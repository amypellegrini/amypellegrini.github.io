// Index the maintained, repository-neutral definitions. No upstream imports.
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const yaml = require('js-yaml');
const root = path.resolve(__dirname, '..');
const source = 'amypellegrini/amypellegrini.github.io';
const entries = [];
for (const kind of ['skill', 'agent']) {
  const dir = path.join(root, kind + 's');
  for (const name of fs.readdirSync(dir).sort()) {
    const file = kind === 'skill' ? `skills/${name}/SKILL.md` : `agents/${name}`;
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    const front = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!front) throw new Error(`Missing frontmatter: ${file}`);
    const metadata = yaml.load(front[1]);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.name) || typeof metadata.description !== 'string' || !metadata.description.trim()) throw new Error(`Invalid metadata: ${file}`);
    const category = metadata.metadata?.category || 'Orchestration';
    const runtime = kind === 'skill' ? 'portable' : 'claude-code';
    const id = `${kind}--${metadata.name}`;
    entries.push({ id, name: metadata.name, kind, category, runtime, description: metadata.description, metadata,
      file: '/' + file, sha256: createHash('sha256').update(content).digest('hex'),
      source: { path: file, url: `https://github.com/${source}/blob/main/${file}` },
      install: kind === 'skill' ? `npx skills add ${source} --skill ${metadata.name}` : null,
      detail: `/library/${id}/` });
  }
}
const registry = { schemaVersion: 2, title: 'Amy Pellegrini’s workflow',
  description: 'The skills and agents I use in my own development workflow, shared with rough edges and refined as I learn. Adapt them to your own repository.',
  categories: [...new Set(entries.map(e => e.category))].sort(), entries };
const output = JSON.stringify(registry, null, 2) + '\n';
const target = path.join(root, 'registry/index.json');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== output) throw new Error('Registry is stale. Run npm run library:sync.');
} else {
  fs.writeFileSync(target, output);
  console.log(`Indexed ${entries.filter(e => e.kind === 'skill').length} reusable skills and ${entries.filter(e => e.kind === 'agent').length} agents.`);
}
