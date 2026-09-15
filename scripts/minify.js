// Minifica HTML, CSS e JS inline dei file generati in _site.
// Include una verifica di sicurezza: dopo la minificazione, ogni blocco <script>
// inline puro (senza src) viene validato sintatticamente con `new Function()`.
// Se anche un solo script fallisce la validazione, lo script si ferma con errore
// e NON scrive il file, per evitare di pubblicare codice rotto (vedi incidente
// precedente con React minificato corrotto da una sostituzione poco sicura).
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const SITE_DIR = path.join(__dirname, '..', '_site');

function validateInlineScripts(html, label) {
  const scriptRe = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = scriptRe.exec(html))) {
    i++;
    const code = m[1];
    if (!code.trim()) continue;
    try {
      new Function(code);
    } catch (e) {
      throw new Error(`[${label}] script inline #${i} non valido dopo minify: ${e.message}`);
    }
  }
  return i;
}

async function minifyFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');

  // Verifica il file ORIGINALE prima di tutto: se il sorgente ha già uno
  // script rotto, non è colpa della minificazione ed è giusto saperlo subito.
  validateInlineScripts(original, path.basename(filePath) + ' (originale)');

  const result = await minify(original, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: false,
    removeScriptTypeAttributes: false,
  });

  // Verifica il file MINIFICATO: se qui fallisce ma l'originale era ok,
  // il problema è la minificazione stessa -> non scriviamo nulla.
  const scriptCount = validateInlineScripts(result, path.basename(filePath) + ' (minificato)');

  fs.writeFileSync(filePath, result, 'utf8');
  const before = Buffer.byteLength(original);
  const after = Buffer.byteLength(result);
  console.log(`${path.relative(SITE_DIR, filePath)}: ${before} -> ${after} bytes (${scriptCount} script validati)`);
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
  console.error('Minify FALLITO (nessun file scritto per quello con errore):', err.message);
  process.exit(1);
});
