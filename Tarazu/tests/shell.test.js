const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('all linked scripts and styles ship with the static build', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) assert.ok(fs.existsSync('dist/' + match[1]));
});
