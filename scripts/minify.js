// Minifica HTML, CSS e JS inline dei file generati in _site.
// Non tocca il markup/logica: comprime solo spazi, commenti e whitespace superflui.
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const SITE_DIR = path.join(__dirname, '..', '_site');

async function minifyFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const result = await minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: false,
    removeScriptTypeAttributes: false,
  });
  fs.writeFileSync(filePath, result, 'utf8');
  const before = Buffer.byteLength(html);
  const after = Buffer.byteLength(result);
  console.log(`${path.relative(SITE_DIR, filePath)}: ${before} -> ${after} bytes`);
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      await minifyFile(full);
    }
  }
}

walk(SITE_DIR).catch(err => {
  console.error('Minify failed:', err);
  process.exit(1);
});
