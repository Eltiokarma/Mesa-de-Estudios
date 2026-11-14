#!/usr/bin/env node
// Escribe en un papel.json sin reformatear lo que ya está (los archivos están formateados a mano):
//   insertarPreguntas(texto, { p1: [...preguntas], p5: [...] }) → texto nuevo
// pone (o reemplaza) el campo "preguntas" de cada problema, dentro de su objeto y con sangría de 2: los objetos
// cortos en una línea y las listas de textos una por línea. Lo demás del archivo queda byte por byte igual.
// Lo usa quien agrega las alternativas del paso 4 del repaso (nucleo/papel-opciones.js).
'use strict';
const ANCHO = 150;

function compacto(v) {
  if (Array.isArray(v)) return v.length ? `[${v.map(compacto).join(', ')}]` : '[]';
  if (v && typeof v === 'object') { const ks = Object.keys(v); return ks.length ? `{ ${ks.map(k => `${JSON.stringify(k)}: ${compacto(v[k])}`).join(', ')} }` : '{}'; }
  return JSON.stringify(v);
}
const soloTextos = v => Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string');

function formatear(v, sangria = 0) {
  const pad = ' '.repeat(sangria), pad2 = ' '.repeat(sangria + 2);
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  const c = compacto(v);
  // Un objeto o una lista sin textos largos cabe en una línea; las listas de textos van siempre una por línea.
  if (!soloTextos(v) && sangria + c.length <= ANCHO && !c.includes('\n')
    && !(v && !Array.isArray(v) && Object.values(v).some(x => typeof x === 'string' && x.length > 60))) return c;
  if (Array.isArray(v)) return v.length ? `[\n${v.map(x => pad2 + formatear(x, sangria + 2)).join(',\n')}\n${pad}]` : '[]';
  const ks = Object.keys(v);
  return ks.length ? `{\n${ks.map(k => `${pad2}${JSON.stringify(k)}: ${formatear(v[k], sangria + 2)}`).join(',\n')}\n${pad}}` : '{}';
}

// Fin del valor JSON que empieza en i (objeto, lista o texto), respetando las cadenas.
function finDe(t, i) {
  if (t[i] === '"') { for (let j = i + 1; j < t.length; j++) { if (t[j] === '\\') j++; else if (t[j] === '"') return j + 1; } throw new Error('cadena sin cerrar'); }
  let prof = 0;
  for (let j = i; j < t.length; j++) {
    const ch = t[j];
    if (ch === '"') { j = finDe(t, j) - 1; continue; }
    if (ch === '{' || ch === '[') prof++;
    else if (ch === '}' || ch === ']') { prof--; if (prof === 0) return j + 1; }
  }
  throw new Error('JSON sin cerrar');
}

function insertarPreguntas(texto, porProblema) {
  let t = texto;
  for (const [pid, preguntas] of Object.entries(porProblema)) {
    const m = new RegExp(`"id"\\s*:\\s*"${pid}"`).exec(t);
    if (!m) throw new Error(`no encuentro el problema ${pid}`);
    const ini = t.lastIndexOf('{', m.index), fin = finDe(t, ini); // el objeto del problema
    let obj = t.slice(ini, fin);
    const sangria = (/\n( *)"id"/.exec(obj) || [, '      '])[1].length;
    const bloque = `"preguntas": ${formatear(preguntas, sangria)}`;
    const ya = /"preguntas"\s*:\s*/.exec(obj);
    if (ya) obj = obj.slice(0, ya.index) + bloque + obj.slice(finDe(obj, ya.index + ya[0].length));
    else { const cierre = obj.lastIndexOf('}'); obj = obj.slice(0, cierre).replace(/\s*$/, '') + `,\n${' '.repeat(sangria)}${bloque}\n${' '.repeat(sangria - 2)}}`; }
    t = t.slice(0, ini) + obj + t.slice(fin);
  }
  JSON.parse(t); // que siga siendo JSON válido
  return t;
}

module.exports = { formatear: v => formatear(v) + '\n', insertarPreguntas };
