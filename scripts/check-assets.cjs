const fs = require('node:fs');
const path = require('node:path');
const assets = fs.readFileSync('src/lib/assets.ts', 'utf8');
const names = Array.from(assets.matchAll(/component\('([^']+)'\)/g), match => match[1]);
for (const name of names) {
  const file = path.join('public', 'component images', name);
  if (!fs.existsSync(file)) throw Error('Missing public image: ' + name);
  const image = fs.readFileSync(file);
  if (image.toString('ascii', 0, 4) !== 'RIFF' || image.toString('ascii', 8, 12) !== 'WEBP') throw Error('Invalid WebP: ' + name);
}
const sourceFiles = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (/\.(tsx?|css)$/.test(file)) sourceFiles.push(file);
  }
}
walk('src');
const legacyPath = 'index-main.html';
for (const file of [...sourceFiles, ...(fs.existsSync(legacyPath) ? [legacyPath] : [])]) {
  const text = fs.readFileSync(file, 'utf8');
  if (/data:image\//.test(text)) throw Error('Embedded raster image remains: ' + file);
}
if (fs.existsSync(legacyPath)) {
  const legacy = fs.readFileSync(legacyPath, 'utf8');
  for (const match of legacy.matchAll(/['"](public\/component%20images\/[^'"]+\.png)['"]/g)) {
    if (!fs.existsSync(decodeURIComponent(match[1]))) throw Error('Missing legacy image: ' + match[1]);
  }
}
console.log(`Verified ${names.length} public WebP assets and no embedded images in application${fs.existsSync(legacyPath) ? ' or legacy HTML' : ''}.`);
