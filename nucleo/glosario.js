/*
 * Glosario por tema (docs/teoria.md, 4d; pedido de Gerson, 15 nov: «que el alumno no se encuentre con algo en chino»).
 * Sin DOM: lo usan el validador (nucleo/teoria.js), el armado del catálogo y el lector (app/teoria.js).
 *
 * Cada unidad de teoría trae `glosario`: las palabras que el tema estrena.
 *   { termino: 'aceleración', def: 'Cuánto cambia la velocidad en cada segundo.',   ≤ 20 palabras, sin repetir el término
 *     simbolo: 'a', medida: 'm/s²',                                                  opcionales
 *     ejemplo: 'Un carro que pasa de 0 a 10 m/s en 5 s tiene a = 2 m/s².',          opcional, ≤ 20 palabras
 *     ver: ['velocidad'],                                                            otros términos del curso (opcional)
 *     formas: ['aceleración', 'aceleraciones'] }                                     cómo aparece en el texto (opcional)
 * Un término se define una sola vez por curso, en la unidad que lo estrena. En las demás unidades del curso donde
 * aparece, el lector lo marca igual con su definición y dice de dónde viene: así los términos repetidos no se
 * vuelven a escribir y nunca quedan sin explicar.
 * Funciona en el navegador (window.Glosario) y en Node.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Glosario = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const TOPES = { termino: 4, def: 20, ejemplo: 20 };
  const MAX = 24;
  const palabras = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;
  // Clave de un término: minúsculas y sin tildes («Aceleración» y «aceleracion» son el mismo).
  const clave = s => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Plural simple de una sola palabra: «fuerza» → «fuerzas», «ión» no se toca, «luz» → «luces», «vector» → «vectores».
  function plural(p) {
    if (/\s/.test(p)) return null;
    if (/[aeiouáéó]$/i.test(p)) return p + 's';
    if (/z$/i.test(p)) return p.slice(0, -1) + 'ces';
    if (/(ión|ón)$/i.test(p)) return p.replace(/ión$/i, 'iones').replace(/ón$/i, 'ones');
    if (/[lnrdj]$/i.test(p)) return p + 'es';
    return null;
  }
  const formasDe = e => {
    const f = Array.isArray(e.formas) && e.formas.length ? e.formas.slice() : [e.termino, plural(e.termino)].filter(Boolean);
    if (!f.some(x => clave(x) === clave(e.termino))) f.unshift(e.termino);
    return [...new Set(f.filter(x => String(x || '').trim()))].sort((a, b) => b.length - a.length);
  };

  // Todo el texto de una unidad (consignas, pasos, reglas, preguntas, opciones, notas de llaves, invitaciones…).
  // Se recorre el objeto entero; se saltan los campos que son nombres internos y no texto para el alumno.
  const NO_TEXTO = new Set(['id', 'pieza', 'color', 'v', 'url', 'requiere', 'version', 'estado', 'unidad', 'glosario', 'temas', 'expresion', 'pose', 'medida', 'simbolo']);
  function texto(def) {
    const out = [], vistos = new Set();
    const ir = (x, k) => {
      if (x === null || x === undefined || NO_TEXTO.has(k)) return;
      if (typeof x === 'string') { out.push(x); return; }
      if (typeof x !== 'object' || vistos.has(x)) return;
      vistos.add(x);
      if (Array.isArray(x)) { out.push(x.map(y => (typeof y === 'string' ? y : (y && typeof y.t === 'string' ? y.t : ' '))).join('')); x.forEach(y => ir(y)); return; }
      for (const [kk, v] of Object.entries(x)) ir(v, kk);
    };
    ir(def);
    return out.join('\n');
  }

  // Una expresión regular con todas las formas de todas las entradas, la más larga primero («masa molar» antes que «masa»).
  function buscador(entradas) {
    const pares = [];
    for (const e of entradas) for (const f of formasDe(e)) pares.push([f, clave(e.termino)]);
    pares.sort((a, b) => b[0].length - a[0].length);
    if (!pares.length) return null;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${pares.map(p => `(${escRe(p[0])})`).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
    return { re, claves: pares.map(p => p[1]) };
  }
  // marcas(texto, entradas, usados) → [{ inicio, fin, clave }]: la primera aparición de cada término que no esté en `usados`.
  function marcas(txt, entradas, usados = new Set(), b = buscador(entradas)) {
    if (!b) return [];
    const out = [];
    b.re.lastIndex = 0;
    for (const m of String(txt).matchAll(b.re)) {
      const k = b.claves[m.slice(1).findIndex(g => g !== undefined)];
      if (usados.has(k)) continue;
      usados.add(k);
      out.push({ inicio: m.index, fin: m.index + m[0].length, clave: k });
    }
    return out;
  }
  const aparece = (txt, e) => marcas(txt, [e]).length > 0;

  // revisar(def) → problemas del glosario de una unidad (vacía si cumple). Sin glosario no hay problema (todavía).
  function revisar(def) {
    const out = [], mal = (d, q) => out.push(`glosario${d ? ` «${d}»` : ''}: ${q}`);
    const g = def && def.glosario;
    if (g === undefined) return out;
    if (!Array.isArray(g) || !g.length || g.length > MAX) { mal('', `lista de 1 a ${MAX} términos`); return out; }
    const txt = texto(def), vistos = new Set();
    for (const e of g) {
      const t = e && String(e.termino || '').trim();
      if (!t) { mal('', 'término vacío'); continue; }
      const k = clave(t);
      if (vistos.has(k)) mal(t, 'repetido en la unidad');
      vistos.add(k);
      if (k.replace(/[^a-z]/g, '').length < 3) mal(t, 'el término tiene que ser una palabra, no un símbolo (el símbolo va en «simbolo»)');
      if (palabras(t) > TOPES.termino) mal(t, `término de ${palabras(t)} palabras (tope ${TOPES.termino})`);
      if (!String(e.def || '').trim()) mal(t, 'sin definición');
      else {
        if (palabras(e.def) > TOPES.def) mal(t, `definición de ${palabras(e.def)} palabras (tope ${TOPES.def})`);
        if (aparece(e.def, e)) mal(t, 'la definición usa el mismo término: dilo con otras palabras');
      }
      if (e.ejemplo !== undefined && palabras(e.ejemplo) > TOPES.ejemplo) mal(t, `ejemplo de ${palabras(e.ejemplo)} palabras (tope ${TOPES.ejemplo})`);
      for (const c of ['simbolo', 'medida']) if (e[c] !== undefined && (typeof e[c] !== 'string' || !e[c].trim() || e[c].length > 16)) mal(t, `${c}: texto corto`);
      if (e.ver !== undefined && (!Array.isArray(e.ver) || e.ver.some(x => typeof x !== 'string' || !x.trim()))) mal(t, 'ver: lista de términos');
      if (e.formas !== undefined && (!Array.isArray(e.formas) || !e.formas.length)) mal(t, 'formas: lista de cómo aparece en el texto');
      if (!aparece(txt, e)) mal(t, 'no aparece en la teoría de la unidad (¿falta en «formas»?)');
    }
    return out;
  }

  // indice(unidades) → { entradas, problemas } de un curso. unidades: [{ id, nombre, def? , texto? }] en el orden del curso.
  //   entrada: { termino, def, simbolo, medida, ejemplo, ver, formas, en, enNombre, aparece: [ids de unidad] }
  function indice(unidades) {
    const entradas = [], porClave = new Map(), problemas = [];
    for (const u of unidades) for (const e of ((u.def && u.def.glosario) || [])) {
      const k = clave(e.termino);
      if (porClave.has(k)) { problemas.push(`${u.id}: «${e.termino}» ya se define en ${porClave.get(k).en}; aquí no se repite, el lector lo marca solo`); continue; }
      const x = { termino: e.termino, def: e.def, formas: formasDe(e), en: u.id, enNombre: u.nombre, aparece: [] };
      for (const c of ['simbolo', 'medida', 'ejemplo', 'ver']) if (e[c] !== undefined) x[c] = e[c];
      porClave.set(k, x); entradas.push(x);
    }
    const b = buscador(entradas);
    for (const u of unidades) {
      const txt = u.texto !== undefined ? u.texto : (u.def ? texto(u.def) : '');
      for (const m of marcas(txt, entradas, new Set(), b)) porClave.get(m.clave).aparece.push(u.id);
    }
    for (const x of entradas) for (const v of x.ver || []) if (!porClave.has(clave(v))) problemas.push(`${x.en}: «${x.termino}» manda a ver «${v}», que no está en el glosario del curso`);
    return { entradas, problemas };
  }

  return { clave, plural, formasDe, texto, buscador, marcas, aparece, revisar, indice, TOPES, MAX };
});
