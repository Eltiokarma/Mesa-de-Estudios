// Lee las filas "| RVn |" del informe de razonamiento verbal y escribe
// contenido/razonamiento-verbal/codigos.json (docs/formato-lectura.md, sección 7.7):
//   { "RV1": { "nombre": "…", "respaldo": "parcial", "por_verificar": true } }
// El respaldo se normaliza a documentado, parcial o hipotesis (sin tilde, como en nucleo/predicciones.js);
// lo que va entre paréntesis se descarta, salvo "por verificar", que pasa a por_verificar.
// La app no lee Markdown: usa este JSON para el respaldo de cada evento.
//   node herramientas/codigos-verbal.js   (también lo corre npm run catalogo)
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const INFORME = path.join(RAIZ, 'docs', 'investigacion', 'razonamiento-verbal-ideas-erroneas.md');
const SALIDA = path.join(RAIZ, 'contenido', 'razonamiento-verbal', 'codigos.json');

function normalizarRespaldo(s) {
  const base = s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  for (const r of ['documentado', 'parcial', 'hipotesis']) if (base.startsWith(r)) return r;
  throw new Error(`Respaldo desconocido: "${s}"`);
}

function construir(md = fs.readFileSync(INFORME, 'utf8')) {
  const filas = [...md.matchAll(/^\| (RV\d+) \|(.*)\|\s*$/gm)];
  const out = {};
  for (const [, id, resto] of filas) {
    const celdas = resto.split(' | ').map(x => x.trim());
    // Columnas: idea errónea, ejemplo, dato, respaldo, fuente.
    if (celdas.length < 5) throw new Error(`${id}: la fila no tiene las 6 columnas`);
    const idea = celdas[0], resp = celdas[celdas.length - 2];
    const negrita = idea.match(/\*\*(.+?)\*\*/);
    const nombre = (negrita ? negrita[1] : idea).replace(/\.$/, '').trim();
    out[id] = { nombre, respaldo: normalizarRespaldo(resp), por_verificar: /por verificar/i.test(resp) };
  }
  const orden = Object.keys(out).sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  return Object.fromEntries(orden.map(k => [k, out[k]]));
}

const texto = () => JSON.stringify(construir(), null, 1) + '\n';

module.exports = { construir, texto, normalizarRespaldo, SALIDA };

if (require.main === module) {
  fs.writeFileSync(SALIDA, texto());
  console.log(`contenido/razonamiento-verbal/codigos.json: ${Object.keys(construir()).length} códigos`);
}
