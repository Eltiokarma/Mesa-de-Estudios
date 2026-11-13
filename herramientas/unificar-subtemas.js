#!/usr/bin/env node
// Unifica las etiquetas de subtema del banco Cuzcano y asigna cada ficha a su unidad del catálogo.
//
//   node herramientas/unificar-subtemas.js            aplica contenido/ejercicios/cuzcano/subtemas.json a los .jsonl
//   node herramientas/unificar-subtemas.js --seco     solo cuenta, no escribe
//
// subtemas.json trae, por tema del banco, un vocabulario corto de subtemas («canónicos», cada uno con su unidad
// del catálogo), a cuál va cada etiqueta de origen y, ficha por ficha, a cuál van las que vinieron sin etiqueta
// o con una etiqueta que juntaba cosas distintas (la asignación por ficha manda sobre la de la etiqueta).
// En cada ficha:
//   banco.subtema         pasa a ser el nombre del subtema unificado;
//   banco.subtema_fuente  guarda la etiqueta tal como vino (null si no traía);
//   unidad                es la unidad del subtema, aunque sea de otro curso que la ficha (el curso es el del
//                         libro; la unidad, donde se estudia); si el subtema no trae, la principal del tema.
// revision-unidades.json, si existe, trae la unidad revisada ficha por ficha (por uid) y manda sobre la del
// subtema; la ficha guarda la marca en banco.revision_unidad (quién la revisó, veredicto, estado y la propuesta).
// Es idempotente: al repetirlo parte siempre de banco.subtema_fuente. La importación (importar-cuzcano.js)
// llama a `aplicar` con cada ficha, así que volver a importar no deshace la unificación.
// Una etiqueta que no está en subtemas.json se deja como vino y se informa.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const DIR = path.join(RAIZ, 'contenido', 'ejercicios', 'cuzcano');
const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));

// «Ley de Faraday», «ley-de-faraday» y «ley_de_faraday» son la misma etiqueta.
function normalizar(s) {
  if (s === null || s === undefined) return null;
  const t = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t === '' || t === 'none' ? null : t;
}

function cargar(dir = DIR) {
  const f = path.join(dir, 'subtemas.json');
  const t = path.join(dir, 'temas.json');
  const r = path.join(dir, 'revision-unidades.json');
  const rev = fs.existsSync(r) ? leer(r) : null;
  return {
    subtemas: fs.existsSync(f) ? leer(f).temas || {} : {},
    temas: fs.existsSync(t) ? leer(t).temas || {} : {},
    revision: rev ? rev.fichas || {} : {},
    revisado_por: rev ? rev.revisado_por || null : null,
  };
}

// Aplica la unificación a un ejercicio (lo modifica). Devuelve 'unificado', 'sin-vocabulario' o 'sin-asignar'.
function aplicar(ej, tablas) {
  const b = ej.banco;
  if (!b || !b.tema) return 'sin-vocabulario';
  const principal = tablas.temas[b.tema] || null;
  const voc = tablas.subtemas[b.tema];
  // La etiqueta de origen: la guardada, o la actual la primera vez.
  const fuente = Object.prototype.hasOwnProperty.call(b, 'subtema_fuente') ? b.subtema_fuente : (b.subtema === undefined ? null : b.subtema);
  if (!voc) {
    if (principal) ej.unidad = principal;
    return 'sin-vocabulario';
  }
  const clave = normalizar(fuente);
  // Una ficha puede tener su subtema propio (las que vinieron sin etiqueta, o con una etiqueta que juntaba cosas distintas).
  const id = (voc.fichas || {})[b.uid] || (clave === null ? undefined : (voc.etiquetas || {})[clave]);
  const can = id && voc.canonicos.find(c => c.id === id);
  if (!can) {
    if (principal) ej.unidad = principal;
    return 'sin-asignar';
  }
  b.subtema_fuente = fuente;
  b.subtema = can.nombre;
  const unidad = can.unidad || principal;
  if (unidad) ej.unidad = unidad;
  revisar(ej, tablas);
  return 'unificado';
}

// La unidad revisada ficha por ficha manda sobre la del subtema.
function revisar(ej, tablas) {
  const r = (tablas.revision || {})[ej.banco.uid];
  if (!r) { delete ej.banco.revision_unidad; return; }
  ej.unidad = r.unidad;
  const marca = { por: tablas.revisado_por || 'modelo', veredicto: r.veredicto, estado: r.estado };
  if (r.propuesta && r.propuesta !== r.unidad) marca.propuesta = r.propuesta;
  if (r.nota) marca.nota = r.nota;
  ej.banco.revision_unidad = marca;
}

// Reordena las claves para que `unidad` quede junto a `curso` y `subtema_fuente` junto a `subtema`.
function ordenar(ej) {
  const out = {};
  for (const k of Object.keys(ej)) {
    if (k === 'unidad') continue;
    if (k === 'banco') {
      const nb = {};
      for (const kb of Object.keys(ej.banco)) {
        if (kb === 'subtema_fuente') continue;
        nb[kb] = ej.banco[kb];
        if (kb === 'subtema' && Object.prototype.hasOwnProperty.call(ej.banco, 'subtema_fuente')) nb.subtema_fuente = ej.banco.subtema_fuente;
      }
      out.banco = nb;
    } else out[k] = ej[k];
    if (k === 'curso' && ej.unidad) out.unidad = ej.unidad;
  }
  if (ej.unidad && !out.unidad) out.unidad = ej.unidad;
  return out;
}

function aplicarCarpeta({ dir = DIR, seco = false } = {}) {
  const tablas = cargar(dir);
  const res = { fichas: 0, unificado: 0, 'sin-vocabulario': 0, 'sin-asignar': 0, con_unidad: 0, archivos: 0, pendientes: {} };
  for (const curso of fs.readdirSync(dir)) {
    const d = path.join(dir, curso);
    if (!fs.statSync(d).isDirectory() || curso === 'figuras') continue;
    for (const f of fs.readdirSync(d).filter(x => x.endsWith('.jsonl'))) {
      const ruta = path.join(d, f);
      const filas = fs.readFileSync(ruta, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
      const salida = filas.map(ej => {
        const r = aplicar(ej, tablas);
        res.fichas++; res[r]++;
        if (ej.unidad) res.con_unidad++;
        if (r === 'sin-asignar') { const k = `${ej.banco.tema}: ${ej.banco.subtema ?? '(sin etiqueta)'}`; res.pendientes[k] = (res.pendientes[k] || 0) + 1; }
        return JSON.stringify(ordenar(ej));
      });
      const texto = salida.join('\n') + '\n';
      if (!seco && texto !== fs.readFileSync(ruta, 'utf8')) { fs.writeFileSync(ruta, texto); res.archivos++; }
    }
  }
  return res;
}

module.exports = { normalizar, cargar, aplicar, ordenar, aplicarCarpeta };
if (require.main === module) {
  const res = aplicarCarpeta({ seco: process.argv.includes('--seco') });
  const pend = Object.entries(res.pendientes).sort((a, b) => b[1] - a[1]);
  delete res.pendientes;
  console.log(JSON.stringify(res));
  if (pend.length) { console.log(`Etiquetas sin asignar (${pend.length}):`); for (const [k, n] of pend.slice(0, 40)) console.log(`  ${n}\t${k}`); }
}
