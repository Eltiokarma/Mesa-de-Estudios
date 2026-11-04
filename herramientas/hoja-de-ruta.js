// Hoja de ruta: validación de docs/hoja-de-ruta.json y generación del Gantt de Mermaid
// que va dentro de docs/hoja-de-ruta.md (así GitHub lo dibuja sin la app).
// Lo usan el servidor local (herramientas/servidor.js) y las pruebas.

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const JSON_RUTA = path.join(RAIZ, 'docs', 'hoja-de-ruta.json');
const MD_RUTA = path.join(RAIZ, 'docs', 'hoja-de-ruta.md');
const ESTADOS = ['pendiente', 'en_curso', 'hecho'];
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function validar(d) {
  const err = [];
  if (!d || typeof d !== 'object') return ['no es un objeto'];
  if (!Array.isArray(d.secciones) || !d.secciones.length) err.push('faltan secciones');
  if (!Array.isArray(d.tareas)) return err.concat('faltan tareas');
  const ids = new Set();
  for (const t of d.tareas) {
    const q = `tarea "${t && t.id}"`;
    if (!t || !/^[a-z0-9-]+$/.test(t.id || '')) { err.push(`${q}: id inválido`); continue; }
    if (ids.has(t.id)) err.push(`${q}: id repetido`);
    ids.add(t.id);
    if (!t.nombre || typeof t.nombre !== 'string') err.push(`${q}: falta nombre`);
    if (/[:#;]/.test(t.nombre || '')) err.push(`${q}: el nombre no puede llevar ":", "#" ni ";" (rompen Mermaid)`);
    if (!d.secciones.includes(t.seccion)) err.push(`${q}: sección desconocida "${t.seccion}"`);
    if (!FECHA.test(t.inicio || '') || !FECHA.test(t.fin || '')) err.push(`${q}: fechas en formato AAAA-MM-DD`);
    else if (t.fin < t.inicio) err.push(`${q}: termina antes de empezar`);
    if (!ESTADOS.includes(t.estado)) err.push(`${q}: estado debe ser ${ESTADOS.join(', ')}`);
    if (!Number.isInteger(t.progreso) || t.progreso < 0 || t.progreso > 100) err.push(`${q}: progreso de 0 a 100`);
    if (!Array.isArray(t.depende_de)) err.push(`${q}: depende_de debe ser una lista`);
  }
  for (const t of d.tareas) for (const p of t.depende_de || []) {
    if (!ids.has(p)) err.push(`tarea "${t.id}": depende de "${p}", que no existe`);
  }
  return err;
}

// Mermaid toma el fin como exclusivo; en el JSON el fin es el último día de trabajo.
function diaSiguiente(f) {
  const d = new Date(f + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function mermaid(d) {
  const lineas = ['gantt', `    title ${d.titulo}`, '    dateFormat  YYYY-MM-DD', '    axisFormat  %d %b'];
  for (const s of d.secciones) {
    lineas.push('', `    section ${s}`);
    for (const t of d.tareas.filter(t => t.seccion === s)) {
      const marcas = [];
      if (t.estado === 'hecho') marcas.push('done');
      if (t.estado === 'en_curso') marcas.push('active');
      if (t.critico) marcas.push('crit');
      marcas.push(t.id, t.inicio, diaSiguiente(t.fin));
      lineas.push(`    ${t.nombre} :${marcas.join(', ')}`);
    }
  }
  return lineas.join('\n') + '\n';
}

// Reemplaza el bloque ```mermaid de docs/hoja-de-ruta.md por el generado desde el JSON.
function actualizarMd(d, mdRuta = MD_RUTA) {
  const md = fs.readFileSync(mdRuta, 'utf8');
  const re = /```mermaid\n[\s\S]*?```/;
  if (!re.test(md)) throw new Error('docs/hoja-de-ruta.md no tiene un bloque ```mermaid');
  const nuevo = md.replace(re, '```mermaid\n' + mermaid(d) + '```');
  if (nuevo !== md) fs.writeFileSync(mdRuta, nuevo);
  return nuevo !== md;
}

function leer() { return JSON.parse(fs.readFileSync(JSON_RUTA, 'utf8')); }

function guardar(d) {
  const err = validar(d);
  if (err.length) { const e = new Error(err.join('\n')); e.errores = err; throw e; }
  d.actualizado = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(JSON_RUTA, JSON.stringify(d, null, 2) + '\n');
  actualizarMd(d);
  return d;
}

module.exports = { validar, mermaid, actualizarMd, leer, guardar, JSON_RUTA, MD_RUTA };

// Uso directo: node herramientas/hoja-de-ruta.js  → regenera el Gantt del Markdown.
if (require.main === module) {
  const d = leer(); const err = validar(d);
  if (err.length) { console.error(err.join('\n')); process.exit(1); }
  console.log(actualizarMd(d) ? 'docs/hoja-de-ruta.md actualizado' : 'docs/hoja-de-ruta.md ya estaba al día');
}
