const fs = require('node:fs');
const path = require('node:path');
const registry = require('../registry/index.json');
module.exports = () => ({ ...registry,
  skillCount: registry.entries.filter(e => e.kind === 'skill').length,
  agentCount: registry.entries.filter(e => e.kind === 'agent').length,
  workflowCount: new Set(registry.entries.filter(e => e.kind === 'skill').map(e => e.name)).size,
  entries: registry.entries.map(entry => ({ ...entry,
    body: fs.readFileSync(path.join(__dirname, '..', entry.file), 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''),
    shortDescription: entry.description.split(/(?<=\.)\s/)[0],
  }))
});
