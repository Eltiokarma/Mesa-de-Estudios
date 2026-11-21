// Mapa de una unidad de teoría, para no leer el archivo entero (algunos pasan de 300 KB).
//   node herramientas/mapa-unidad.js <unidad>                      mapa: ideas, momentos y sus líneas
//   node herramientas/mapa-unidad.js <unidad> <idea>               código de la idea, con números de línea
//   node herramientas/mapa-unidad.js <unidad> <idea> <momento>     código de un momento (lee, juega, predice…)
//   node herramientas/mapa-unidad.js <unidad> <idea> --texto [momento]   lo que ve el alumno, ya armado y sin figuras
//   node herramientas/mapa-unidad.js <unidad> <idea> --ejemplo <n>       el ejemplo n (desde 1), ya armado
// <unidad> va como geometria.congruencia, geometria/congruencia o la ruta del archivo. <idea> es su id o su número.
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

function rutaDe(unidad) {
  if (fs.existsSync(unidad) && unidad.endsWith('.js')) return path.resolve(unidad);
  const rel = unidad.replace(/\.js$/, '').replace(/^contenido\/teoria\//, '').replace('.', '/');
  return path.join(RAIZ, 'contenido/teoria', rel + '.js');
}

const sangria = l => l.length - l.trimStart().length;
const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ubica en la fuente el objeto de cada idea por su línea `id: '<id>'` (la de menor sangría, que es la de la idea y no
// la de una opción) y, dentro, cada momento. Todo por sangría: los archivos están escritos con dos espacios.
function ubicar(lineas, ids) {
  const usadas = new Set();
  return ids.map(id => {
    const re = new RegExp(`^\\s*(?:const \\w+ = )?\\{?\\s*id: (['"\`])${escapar(id)}\\1,`);
    let k = -1;
    lineas.forEach((l, i) => { if (re.test(l) && !usadas.has(i) && (k < 0 || sangria(l) < sangria(lineas[k]))) k = i; });
    if (k < 0) return null;
    usadas.add(k);
    const enLinea = /\{\s*id:/.test(lineas[k]);                 // `const x = { id: 'a', …` en la misma línea
    const sId = enLinea ? sangria(lineas[k]) + 2 : sangria(lineas[k]);
    let ini = k;
    if (!enLinea) while (ini > 0 && (lineas[ini].trim() === '' || sangria(lineas[ini]) >= sId)) ini--;
    const sIni = sangria(lineas[ini]);
    let fin = k;
    for (let i = k + 1; i < lineas.length; i++) {
      if (lineas[i].trim() !== '' && sangria(lineas[i]) <= sIni) { fin = /^\s*[}\])]/.test(lineas[i]) ? i : i - 1; break; }
    }
    const momentos = [];
    for (let i = ini + 1; i < fin; i++) {
      const m = /^(\s*)(\w+):\s*(.*)$/.exec(lineas[i]);
      if (m && m[1].length === sId) momentos.push({ clave: m[2], ini: i, resto: m[3] });
    }
    momentos.forEach((m, j) => {
      m.fin = (j + 1 < momentos.length ? momentos[j + 1].ini : fin) - 1;
      while (m.fin > m.ini && (lineas[m.fin].trim() === '' || /^\s*\/\//.test(lineas[m.fin]))) m.fin--;
      const ref = /^([A-Za-z_$][\w$]*)(?:\(.*\))?,?$/.exec(m.resto.trim());      // `ejemplos: EJ1,` apunta a otra parte
      if (ref && !/^(true|false|null|undefined)$/.test(ref[1])) {
        const def = new RegExp(`^\\s*(?:const|let|var|function)\\s+${escapar(ref[1])}\\b`);
        const d = lineas.findIndex(l => def.test(l));
        if (d >= 0) m.ref = { nombre: ref[1], linea: d };
      }
    });
    return { ini, fin, momentos };
  });
}

// Lo que ve el alumno: las figuras se resumen en su texto alternativo, que es lo único legible de ellas.
function sinFiguras(clave, v) {
  if (typeof v === 'function') return '[función]';
  if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.pieza === 'string' && (v.datos || v.dibujo || v.estado)) {
    const d = v.datos || {};
    const alt = d.alt || (d.figura && d.figura.alt) || (d.escena && d.escena.alt) || '';
    return `[figura ${v.pieza}${d.objeto ? ' · ' + d.objeto : ''}${alt ? ': ' + alt : ''}]`;
  }
  if (typeof v === 'number' && !Number.isInteger(v)) return Math.round(v * 1000) / 1000;
  return v;
}
const armado = x => JSON.stringify(x, sinFiguras, 1);

function numeradas(lineas, ini, fin) {
  const ancho = String(fin + 1).length;
  return lineas.slice(ini, fin + 1).map((l, i) => `${String(ini + i + 1).padStart(ancho)}  ${l}`).join('\n');
}

function mapa(unidad) {
  const archivo = rutaDe(unidad);
  const fuente = fs.readFileSync(archivo, 'utf8');
  const lineas = fuente.split('\n');
  const def = require(archivo);
  const ideas = def.ideas || [];
  const lugares = ubicar(lineas, ideas.map(i => i.id));
  return { archivo, fuente, lineas, def, ideas, lugares };
}

function imprimirMapa(m) {
  const kb = n => `${Math.round(n / 1024)} KB`;
  const out = [];
  out.push(`${path.relative(RAIZ, m.archivo)} · ${m.def.unidad || ''} · calidad ${m.def.calidad === undefined ? '—' : m.def.calidad} · ${m.lineas.length} líneas, ${kb(Buffer.byteLength(m.fuente))}`);
  out.push(`Claves de la unidad: ${Object.keys(m.def).join(', ')}`);
  let previo = 0;
  m.ideas.forEach((idea, n) => {
    const l = m.lugares[n];
    const ej = Array.isArray(idea.ejemplos) ? idea.ejemplos.length : 0;
    out.push('');
    if (!l) { out.push(`${n + 1}. ${idea.id} — «${idea.titulo || ''}» · ${ej} ejemplos · no ubicada en la fuente (búscala con grep; --texto sí funciona)`); return; }
    out.push(`${n + 1}. ${idea.id} — «${idea.titulo || ''}» · L${l.ini + 1}–${l.fin + 1} · ${ej} ejemplos`);
    if (l.ini > previo) out.push(`   antes (ayudas, figuras, ejemplos y casos de esta idea): L${previo + 1}–${l.ini}`);
    const cortos = [], largos = [];
    l.momentos.forEach(mo => {
      if (mo.ref) largos.push(`${mo.clave} L${mo.ini + 1} → ${mo.ref.nombre} en L${mo.ref.linea + 1}`);
      else if (mo.fin === mo.ini) cortos.push(mo.clave);
      else largos.push(`${mo.clave} L${mo.ini + 1}–${mo.fin + 1}`);
    });
    if (largos.length) out.push(`   ${largos.join(' · ')}`);
    if (cortos.length) out.push(`   en una línea: ${cortos.join(', ')}`);
    previo = l.fin + 1;
  });
  if (previo < m.lineas.length) out.push('', `Después de la última idea (glosario, laboratorio, cierre): L${previo + 1}–${m.lineas.length}`);
  out.push('', 'Para leer un tramo: Read con offset y limit, o este mismo comando con <idea> [momento], --texto o --ejemplo <n>.');
  return out.join('\n');
}

function principal(args) {
  const libres = args.filter(a => !a.startsWith('--'));
  const [unidad, cual, momento] = libres;
  if (!unidad) return { codigo: 1, texto: fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 7).join('\n') };
  const m = mapa(unidad);
  if (!cual) return { codigo: 0, texto: imprimirMapa(m) };
  const n = /^\d+$/.test(cual) ? Number(cual) - 1 : m.ideas.findIndex(i => i.id === cual);
  const idea = m.ideas[n];
  if (!idea) return { codigo: 1, texto: `No hay idea «${cual}». Ideas: ${m.ideas.map((i, k) => `${k + 1}. ${i.id}`).join(' · ')}` };
  const iEj = args.indexOf('--ejemplo');
  if (iEj >= 0) {
    const k = Number(args[iEj + 1]) || Number(momento);
    const ej = (idea.ejemplos || [])[k - 1];
    return ej ? { codigo: 0, texto: armado(ej) } : { codigo: 1, texto: `La idea ${idea.id} tiene ${(idea.ejemplos || []).length} ejemplos; pide uno de 1 a ese número.` };
  }
  if (args.includes('--texto')) {
    if (momento) return momento in idea ? { codigo: 0, texto: armado(idea[momento]) } : { codigo: 1, texto: `La idea ${idea.id} no tiene «${momento}». Tiene: ${Object.keys(idea).join(', ')}` };
    const sinEj = Object.assign({}, idea);
    if (Array.isArray(idea.ejemplos)) sinEj.ejemplos = `[${idea.ejemplos.length} ejemplos: pídelos con --ejemplo <n>]`;
    return { codigo: 0, texto: armado(sinEj) };
  }
  const l = m.lugares[n];
  if (!l) return { codigo: 1, texto: `La idea ${idea.id} no se pudo ubicar en la fuente; usa grep -n "id: '${idea.id}'" o --texto.` };
  if (!momento) return { codigo: 0, texto: numeradas(m.lineas, l.ini, l.fin) };
  const mo = l.momentos.find(x => x.clave === momento);
  if (!mo) return { codigo: 1, texto: `La idea ${idea.id} no tiene «${momento}» en la fuente. Tiene: ${l.momentos.map(x => x.clave).join(', ')}` };
  const nota = mo.ref ? `\n\n«${momento}» apunta a ${mo.ref.nombre}, que empieza en la línea ${mo.ref.linea + 1}.` : '';
  return { codigo: 0, texto: numeradas(m.lineas, mo.ini, mo.fin) + nota };
}

if (require.main === module) {
  const r = principal(process.argv.slice(2));
  console.log(r.texto);
  process.exitCode = r.codigo;
}

module.exports = { mapa, ubicar, principal, rutaDe };
