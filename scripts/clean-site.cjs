// Eleventy does not remove retired pages or downloads; never ship stale definitions.
const fs = require('node:fs');
const path = require('node:path');
fs.rmSync(path.resolve(__dirname, '../_site'), { recursive: true, force: true });
