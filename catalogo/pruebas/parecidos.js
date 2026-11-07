// Detecta ítems del banco que repiten una predicción de su escena o un problema de su generador
// (regla: la prueba no puede tomar lo mismo que el alumno ya practicó, o mediría memoria).
// Lo usa catalogo/pruebas/pruebas.test.js; también se corre solo:
//   node catalogo/pruebas/parecidos.js            → lista los parecidos de todo el banco y los avisos
// Avisos (no tumban la prueba, solo se informan): un ítem que se parece a un problema del papel.json
// de su plantilla, o que comparte dos o más códigos de error con una predicción de su escena (la misma
// tarea con otros números, que la comparación de palabras y números no ve).
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

// Enunciados de los problemas de lápiz y papel de una plantilla.
function textosPapel(id) {
  const f = path.join(RAIZ, 'plantillas', id, 'papel.json');
  if (!fs.existsSync(f)) return [];
  try { return (JSON.parse(fs.readFileSync(f, 'utf8')).problemas || []).map(p => `${p.id}: ${p.enunciado || ''}`); } catch { return []; }
}

// Códigos de error de cada predicción de la escena: las opciones se escriben ['a', 'texto', 'CÓDIGO', …];
// las opciones seguidas (a pocas líneas una de otra) son de la misma predicción.
function codigosEscena(id) {
  const f = path.join(RAIZ, 'plantillas', id, 'index.html');
  if (!fs.existsSync(f)) return [];
  const lineas = fs.readFileSync(f, 'utf8').split('\n'), grupos = [];
  let ultimo = -99;
  lineas.forEach((l, i) => {
    for (const m of l.matchAll(/\[\s*'[a-f]'\s*,\s*(?:'(?:[^'\\]|\\.)*'|`[^`]*`)\s*,\s*'([^']+)'/g)) {
      if (i - ultimo > 3) grupos.push({ linea: i + 1, codigos: new Set() });
      grupos[grupos.length - 1].codigos.add(m[1]); ultimo = i;
    }
  });
  return grupos.filter(g => g.codigos.size >= 2);
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

// Avisos: parecidos con el papel y códigos de error compartidos con una predicción (2 o más).
function avisos(bancos) {
  const cP = {}, cC = {}, out = [];
  for (const b of bancos) for (const p of [...b.pares, ...(b.reserva || [])]) {
    const papel = cP[p.plantilla] = cP[p.plantilla] || textosPapel(p.plantilla);
    const grupos = cC[p.plantilla] = cC[p.plantilla] || codigosEscena(p.plantilla);
    for (const F of ['A', 'B']) {
      for (const t of papel) {
        const r = parecido(p[F].enunciado, t);
        if (r) { out.push({ item: p.par + F, plantilla: p.plantilla, motivo: `papel: ${r}`, texto: t.slice(0, 160) }); break; }
      }
    }
    const mios = new Set(p.A.opciones.map(o => o.error).filter(Boolean));
    for (const g of grupos) {
      const comunes = [...g.codigos].filter(c => mios.has(c));
      if (comunes.length >= 2) { out.push({ item: p.par, plantilla: p.plantilla, motivo: `comparte ${comunes.length} códigos de error con la predicción de la línea ${g.linea}`, texto: comunes.join(', ') }); break; }
    }
  }
  return out;
}

module.exports = { textosEscena, textosGenerador, textosPapel, codigosEscena, parecido, revisar, avisos, numeros, palabras };

if (require.main === module) {
  const dir = __dirname;
  const bancos = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  for (const h of revisar(bancos)) console.log(`${h.item} ~ ${h.plantilla}: ${h.motivo}\n   ${h.texto}`);
  for (const h of avisos(bancos)) console.log(`aviso ${h.item} ~ ${h.plantilla}: ${h.motivo}\n   ${h.texto}`);
}
