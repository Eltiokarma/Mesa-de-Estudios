// Pruebas de «Ángulos en posición normal» (práctica): casos.json (calculados aparte, con un script que no usa el
// generador), un recálculo independiente en 600 problemas (con Math.sin, Math.cos y atan2 de los ángulos de verdad),
// fugas, tipos por idea, el valor de cada error, el recuadro «Datos» en 400 semillas y los colores de la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => (plano(x).match(/[\p{L}\p{N}]+(?:[.,]\p{N}+)*/gu) || []).length;
// ---- Lectura de un texto: «−3√13/13», «4/5», «No está definida» (null), «240°», «En el III» ----
function num(t) {
  t = String(t).trim().replace(/^≈\s*/, '');
  if (/no está definida/i.test(t)) return null;
  const s = t.replace(/−/g, '-').replace(/°$/, '').replace(/,/g, '.');
  let m = s.match(/^(-?)(\d*)√(\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]) / +m[4];
  m = s.match(/^(-?)(\d*)√(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]);
  m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
  return +s;
}
// ---- Camino independiente: las razones con los ángulos de verdad ----
const R = g => g * Math.PI / 180;
const RZ = (fn, x, y) => { const r = Math.hypot(x, y), p = { sen: [y, r], cos: [x, r], tan: [y, x], cot: [x, y], sec: [r, x], csc: [r, y] }[fn]; return Math.abs(p[1]) < 1e-9 ? null : p[0] / p[1]; };
const deAng = (fn, g) => { const v = RZ(fn, Math.cos(R(g)), Math.sin(R(g))); return v === null || Math.abs(v) > 1e6 ? null : Math.round(v * 1e9) / 1e9; };
const cuad = g => { const m = ((g % 360) + 360) % 360; return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
const ROM = { I: 1, II: 2, III: 3, IV: 4 };
function esperado(p) {
  const e = p._datos;
  switch (e.tipo) {
    case 'razon-punto': case 'coordenada-falta': return RZ(e.fn, e.x, e.y);
    case 'expresion': { const [a, , op, b] = e.e.split(' '); const A = { sec: RZ('sec', e.x, e.y), csc: RZ('csc', e.x, e.y) }[a], B = RZ(b, e.x, e.y); return op === '+' ? A + B : A - B; }
    case 'razon-cuadrante': {
      // Busca, en el cuadrante, el ángulo con la razón dada y calcula la pedida (sin usar la x, y del generador).
      const dado = RZ(e.dado, e.x, e.y); let best = [1e9, 0];
      for (let g = 90 * (e.q - 1) + 1e-3; g < 90 * e.q; g += 1e-3) { const d = Math.abs(deAng(e.dado, g) - dado); if (d < best[0]) best = [d, g]; }
      return Math.round(deAng(e.pide, best[1]) * 1e3) / 1e3;
    }
    case 'razon-eje': case 'razon-negativo': return deAng(e.fn, e.g);
    case 'expresion-ejes': return e.p * deAng('sen', e.A) - e.q * deAng('cos', e.B) + e.t * deAng('tan', e.C);
    case 'multiplos': { const t = ([c, fn, k]) => c * deAng(fn, e.T * k); return (t(e.t1) + t(e.t2)) / (t(e.t3) + e.d); }
    case 'cuenta-positivas': return e.items.filter(([fn, g]) => deAng(fn, g) > 0).length;
    case 'coterminal': return ((e.g % 360) + 360) % 360;
    case 'k-veces': { const s = []; for (let b = 0.5; b < e.hi; b += 0.5) if (b > e.lo && Math.abs(((e.k - 1) * b) % 360) < 1e-9) s.push(b); assert.equal(s.length, 1); return s[0]; }
    default: return undefined;
  }
}
function revisar(p) {
  const e = p._datos, c = p.alternativas.find(a => a.correcta).texto;
  if (e.tipo === 'signos') { const sg = fn => (deAng(fn, e.g) > 0 ? '+' : '−'); return c === `${e.a} ${sg(e.a)}, ${e.b} ${sg(e.b)}`; }
  if (e.tipo === 'cuadrante-signos') {
    const ok = g => [e.c1, e.c2].every(([fn, s]) => Math.sign(deAng(fn, g)) === s), qs = [1, 2, 3, 4].filter(k => ok(90 * k - 45));
    return qs.length === 1 && c === `En el ${['', 'I', 'II', 'III', 'IV'][qs[0]]}`;
  }
  if (e.tipo === 'cuadrante-negativo') return ROM[c.replace('En el ', '')] === cuad(e.g);
  if (e.tipo === 'cual-coterminal') return p.alternativas.filter(a => (((num(a.texto) - e.g) % 360) + 360) % 360 === 0).length === 1 && (((num(c) - e.g) % 360) + 360) % 360 === 0;
  const v = esperado(p), n = num(c);
  if (e.tipo === 'razon-cuadrante') return Math.abs(v - n) < 2e-3;
  return v === null ? n === null : n !== null && Math.abs(v - n) < 1e-9;
}

probarGenerador(gen, { semillas: 600 });
probarFugas(gen, { grupo: p => p._datos.tipo, valorNumerico: a => num(a.texto) });

test('recálculo independiente en 600 problemas: la correcta es la que da el ángulo de verdad', () => {
  for (let s = 0; s < 600; s++) { const p = gen.generar(s); assert.ok(revisar(p), `semilla ${s} (${p._datos.tipo}): ${plano(p.pregunta)} → ${p.alternativas.find(a => a.correcta).texto}`); }
  for (const t of gen.TIPOS) for (let s = 0; s < 80; s++) { const p = gen.generar(s, { tipo: t }); assert.ok(revisar(p), `${t} ${s}`); }
});

test('casos.json: cada caso, recalculado aparte, da la alternativa correcta que ve el alumno', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}: otro problema`);
    assert.equal(p.alternativas.find(x => x.correcta).texto, c.esperado.texto, `semilla ${c.semilla}`);
  }
});

test('tipos por idea: cada idea da solo sus tipos, con los tres niveles', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => gen.NIVEL[t]), [1, 2, 3], idea);
    for (let s = 0; s < 120; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); assert.ok(tipos.includes(p._datos.tipo)); }
  }
});

test('cada error vale lo que dice: el valor de su alternativa sale de rehacer el error', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), e = p._datos;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const id = a.error.id, v = num(a.texto);
      if (e.tipo === 'razon-punto') {
        const esp = { TR12: RZ(e.fn, Math.abs(e.x), Math.abs(e.y)), 'TRPN-INVERSA': 1 / RZ(e.fn, e.x, e.y), TR11: RZ({ sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' }[e.fn], e.x, e.y), TR7: e.fn === 'sen' ? e.y : e.x }[id];
        assert.ok(Math.abs(esp - v) < 1e-9, `${s} ${id}: ${a.texto}`);
      }
      if (e.tipo === 'coordenada-falta' && id === 'RN-SIGNO-DATO') assert.ok(Math.abs(RZ(e.fn, e.falta === 'x' ? -e.x : e.x, e.falta === 'y' ? -e.y : e.y) - v) < 1e-9, `${s}`);
      if (e.tipo === 'coterminal' && id === 'RN-UNA-VUELTA') assert.equal(v, (((e.g % 360) + 360) % 360) + 360);
      if (e.tipo === 'cuenta-positivas' && id === 'TR15') assert.equal(v, e.items.filter(([fn, g]) => deAng(fn, -g) > 0).length);
      if (e.tipo === 'cuenta-positivas' && id === 'TRNEG-TODO-NEG') assert.equal(v, 0);
      if (!/^(No está definida|En el|.*,)/.test(a.texto) && /\d/.test(a.texto)) assert.ok(a.error.explicacion.includes(a.texto) || ['TRPN-TODO-NEG', 'TRNEG-TODO-NEG', 'TR15', 'TRNEG-180', 'TRNEG-CUENTA', 'RN-CUARTO', 'RN-K', 'RN-UNA-VUELTA', 'TR11', 'TR12', 'TRPN-TAN-CERO', 'TRPN-INFINITO', 'TRPN-CERO-INDEF', 'RN-ALFA'].includes(id) || a.error.explicacion.length > 20, `${s}`);
    }
  }
});

test('Datos en 400 semillas: de 1 a 5 líneas, ≤ 22 palabras, sin la respuesta y sin consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 5, `semilla ${s}`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `semilla ${s}: «${d}» pasa de 22 palabras`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `semilla ${s}: consejo «${d}»`);
      assert.ok(!new RegExp(`= ${ok.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(\\.|$|,)`).test(d), `semilla ${s}: los datos traen «= ${ok}»`);
    }
  }
});

test('colores de la unidad: ángulos carmín, x turquesa, y naranja, la razón pedida violeta; sin verde', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, { ang: 'h', x: 'i', y: 'o', pide: 'f' }[k], `semilla ${s}: ${k}`);
  }
});

test('textos: enunciado y pregunta de 45 palabras o menos; explicaciones de 25 o menos; grados sin espacio de miles', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 45, `semilla ${s}`);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(palabras(a.error.explicacion) <= 25, `semilla ${s}: ${a.error.explicacion}`);
    assert.ok(!/\d \d{3}°/.test(plano(p.enunciado) + plano(p.solucion) + p.alternativas.map(a => a.texto).join(' ')), `semilla ${s}: grados con espacio de miles`);
  }
});

// Cierre (20 nov, rutinas/auditoria/trigonometria.angulos-en-posicion-normal.md): dos explicaciones decían algo falso.
test('cierre: «el tamaño 1 está bien» solo si la razón vale ±1; «sin los signos» deja el menos de la expresión', () => {
  const R = g => g * Math.PI / 180, ejeV = (fn, g) => { const x = Math.round(Math.cos(R(g))), y = Math.round(Math.sin(R(g))), r = 1; const [p, q] = { sen: [y, r], cos: [x, r], tan: [y, x], cot: [x, y], sec: [r, x], csc: [r, y] }[fn]; return q === 0 ? null : p / q; };
  for (let s = 0; s < 400; s++) for (const tipo of ['razon-eje', 'razon-negativo', 'multiplos']) {
    const p = gen.generar(`cierre${s}`, { tipo }), d = p._datos;
    if (tipo !== 'multiplos') {
      const v = ejeV(d.fn, d.g);
      for (const a of p.alternativas.filter(a => a.error)) if (/tamaño 1 está bien/.test(a.error.explicacion)) assert.equal(Math.abs(v), 1, `${tipo} ${s}: ${d.fn} ${d.g}° = ${v}`);
      continue;
    }
    const abs = ([c, fn, k]) => c * Math.abs(ejeV(fn, d.T * k));
    const a = p.alternativas.find(x => x.error && x.error.id === 'TR12');
    if (a) assert.ok(Math.abs(num(a.texto) - (abs(d.t1) + abs(d.t2)) / (abs(d.t3) + d.d)) < 1e-9, `multiplos ${s}: «${a.texto}»`);
  }
});
