// Detecta ítems del banco que repiten una predicción de su escena o un problema de su generador
// (regla: la prueba no puede tomar lo mismo que el alumno ya practicó, o mediría memoria).
// Lo usa catalogo/pruebas/pruebas.test.js; también se corre solo:
//   node catalogo/pruebas/parecidos.js            → lista los parecidos de todo el banco
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..');

const VACIAS = new Set(('cuando donde desde hasta entre sobre según porque cuánto cuántos cuántas cuál cuáles tiene tienen ' +
  'queda quedan forma forman otra otro otras otros misma mismo mismas mismos cada este esta estos estas pasa ' +
  'después antes ahora luego mientras igual solo también todos todas puede pueden hacer hace sigue dentro afuera ' +
  'vale valor mide miden medir altura grados total mitad doble triple veces').split(' '));
const sinTilde = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const palabras = s => new Set(sinTilde(s.toLowerCase()).match(/[a-zñ]{5,}/g)?.filter(w => !VACIAS.has(w)) || []);
// Números como los escribe el banco: "1,8", "12 000", "−6,7". Se ignoran los que dicen poco (0, 1, 2, 10).
const numeros = s => new Set((s.replace(/−/g, '-').match(/\d+(?:,\d+)?/g) || []).map(x => x.replace(',', '.')).filter(x => !['0', '1', '2', '10'].includes(x)));

// Textos de las predicciones de una escena: las preguntas (cadenas con «¿», línea por línea) de su
// index.html, sin HTML ni ${…}.
function textosEscena(id) {
  const f = path.join(RAIZ, 'plantillas', id, 'index.html');
  if (!fs.existsSync(f)) return [];
  const limpio = s => s.replace(/\$\{[A-Za-z_]+\('[^']*',\s*'([^']*)'\)\}/g, '$1')   // ${V('v','20 m/s')} → 20 m/s
    .replace(/\$\{[A-Za-z_]+\('([^']*)'\)\}/g, '$1')                                  // ${Zn('zinc')} → zinc
    .replace(/\$\{[^}]*\}/g, ' ').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ');
  const preguntas = [];
  for (const linea of fs.readFileSync(f, 'utf8').split('\n')) {
    for (const m of linea.matchAll(/'((?:[^'\\]|\\.)*)'|`([^`]*)`/g)) {
      const t = limpio(m[1] !== undefined ? m[1] : m[2]);
      if (t.includes('¿')) preguntas.push(t);
    }
  }
  return preguntas;
}

// Problemas que puede dar un generador (formato predicciones): enunciados de muchas semillas.
function textosGenerador(id, n) {
  const f = path.join(RAIZ, 'plantillas', id, 'generador.js');
  if (!fs.existsSync(f)) return [];
  const g = require(f), out = [];
  const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let k = 0; k < (n || 4000); k++) {
    try { const p = g.generar(`s${k}`); out.push(plano(p.enunciado)); } catch { /* semilla sin problema válido */ }
  }
  return [...new Set(out)];
}

// ¿El enunciado e se parece demasiado al texto t? Mismos números (dos o más) y palabras en común, o casi las mismas palabras.
function parecido(e, t) {
  const Ne = numeros(e), Nt = numeros(t), Ke = palabras(e), Kt = palabras(t);
  const comunes = [...Ke].filter(w => Kt.has(w)).length, razon = comunes / Math.max(1, Math.min(Ke.size, Kt.size));
  if (Ne.size >= 2 && [...Ne].every(x => Nt.has(x)) && comunes >= 3) return `mismos números (${[...Ne].join(', ')}) y ${comunes} palabras en común`;
  if (razon >= 0.6 && comunes >= 5) return `${comunes} palabras en común (${Math.round(razon * 100)} %)`;
  return null;
}

function revisar(bancos) {
  const cache = {}, hallados = [];
  const de = id => (cache[id] = cache[id] || [...textosEscena(id), ...textosGenerador(id)]);
  for (const b of bancos) for (const p of [...b.pares, ...(b.reserva || [])]) for (const F of ['A', 'B']) {
    for (const t of de(p.plantilla)) {
      const r = parecido(p[F].enunciado, t);
      if (r) { hallados.push({ item: p.par + F, plantilla: p.plantilla, motivo: r, texto: t.slice(0, 160) }); break; }
    }
  }
  return hallados;
}

module.exports = { textosEscena, textosGenerador, parecido, revisar, numeros, palabras };

if (require.main === module) {
  const dir = __dirname;
  const bancos = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  for (const h of revisar(bancos)) console.log(`${h.item} ~ ${h.plantilla}: ${h.motivo}\n   ${h.texto}`);
}
