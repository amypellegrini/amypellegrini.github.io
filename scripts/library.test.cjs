const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const yaml = require('js-yaml');
const registry = require('../registry/index.json');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = content => createHash('sha256').update(content).digest('hex');
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
test('registry covers every maintained definition exactly once and is reproducible', () => {
  assert.equal(registry.schemaVersion, 2);
  const definitions = [...files(path.join(root, 'skills')), ...files(path.join(root, 'agents'))].filter(f => f.endsWith('.md'));
  assert.equal(registry.entries.length, definitions.length);
  assert.equal(new Set(registry.entries.map(e => e.id)).size, definitions.length);
  assert.deepEqual(new Set(registry.entries.map(e => path.join(root, e.file))), new Set(definitions));
  execFileSync(process.execPath, ['scripts/sync-library.cjs', '--check'], { cwd: root });
});
test('definitions are valid portable skills or optional Claude Code agents', () => {
  for (const entry of registry.entries) {
    const content = read(entry.file);
    const front = content.match(/^---\n([\s\S]*?)\n---\n/);
    assert(front, entry.file);
    const metadata = yaml.load(front[1]);
    assert.deepEqual(metadata, entry.metadata);
    assert.equal(hash(content), entry.sha256);
    assert.equal(metadata.name, entry.name);
    assert.equal(metadata.description, entry.description);
    assert.match(metadata.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert(metadata.description.length > 0 && metadata.description.length < 1024);
    // Prevent accidental reintroduction of original project identities and helpers.
    assert.doesNotMatch(content, /jazzjam|musicpracticepro|amypellegrini|RevenueCat|board-lifecycle\.py|board-columns\.md|pointers:bump|qa-evidence|fastlane/i);
    if (entry.kind === 'skill') {
      assert.equal(entry.file, `/skills/${entry.name}/SKILL.md`);
      assert.equal(entry.runtime, 'portable');
      assert.equal(entry.install, `npx skills add amypellegrini/amypellegrini.github.io --skill ${entry.name}`);
    } else {
      assert.equal(entry.file, `/agents/${entry.name}.md`);
      assert.equal(entry.runtime, 'claude-code');
      assert.equal(entry.install, null);
    }
  }
});
test('site publishes the exact current catalog and downloads, with no retired snapshots', () => {
  const catalog = read('_site/library/index.html');
  assert.equal((catalog.match(/class="library-card"/g) || []).length, registry.entries.length);
  for (const entry of registry.entries) {
    assert(catalog.includes(entry.detail));
    assert(read(`_site${entry.detail}index.html`).includes(entry.source.url));
    assert.equal(hash(read('_site' + entry.file)), entry.sha256);
  }
  assert.deepEqual(JSON.parse(read('_site/registry/index.json')), registry);
  assert(!fs.existsSync(path.join(root, '_site/registry/originals')));
  assert(!fs.existsSync(path.join(root, '_site/registry/packs')));
  for (const file of files(path.join(root, '_site/library'))) {
    assert.doesNotMatch(file, /jazzjam|musicpracticepro/i);
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /jazzjam|musicpracticepro/i);
  }
});
