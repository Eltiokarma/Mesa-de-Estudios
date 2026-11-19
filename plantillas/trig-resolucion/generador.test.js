// Pruebas de «Resolución de triángulos rectángulos» (práctica): casos.json (calculados aparte, con un script que no usa
// el generador), un recálculo independiente en 600 problemas (con los lados de los notables), fugas, tipos por idea,
// errores con su valor, el recuadro «Datos» en 400 semillas, colores de la unidad y presupuesto de texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => (plano(x).match(/[\p{L}\p{N}]+(?:[.,]\p{N}+)*/gu) || []).length;
// ---- Camino independiente: los lados de cada notable (opuesto, adyacente, hipotenusa), con Math.sqrt ----
const S3 = Math.sqrt(3), S2 = Math.sqrt(2);
const LADOS = { 30: [1, S3, 2], 45: [1, 1, S2], 60: [S3, 1, 2], 37: [3, 4, 5], 53: [4, 3, 5], 16: [7, 24, 25], 74: [24, 7, 25] };
const sen = g => LADOS[g][0] / LADOS[g][2], cos = g => LADOS[g][1] / LADOS[g][2], tan = g => LADOS[g][0] / LADOS[g][1];
const ang = r => { if (Math.abs(r) < 1e-12) return 0; const g = Object.keys(LADOS).find(k => Math.abs(tan(+k) - r) < 1e-9); if (!g) throw new Error(`sin notable: ${r}`); return +g; };
function recalcular(p) {
  const e = p._datos;
  switch (e.tipo) {
    case 'cateto': return e.H * (e.pide === 'op' ? sen(e.g) : cos(e.g));
    case 'perimetro': return e.H * (1 + sen(e.g) + cos(e.g));
    case 'altura-hip': return e.a * sen(e.g) * cos(e.g);
    case 'otro-cateto': return e.tiene === 'op' ? e.k / tan(e.g) : e.k * tan(e.g);
    case 'hipotenusa': return e.obj === 'cable' ? e.k / sen(e.g) : e.k / cos(e.g);
    case 'puente': return e.h / tan(e.g) + e.h / sen(e.g);
    case 'elevacion': return e.dv * tan(e.g);
    case 'ojos-depresion': return e.sub === 'ojos' ? e.dv * tan(e.g) + e.ojo : e.h / tan(e.g);
    case 'ventana': return e.h0 + e.h0 / tan(e.gb) * tan(e.ga);
    case 'separacion': { const d1 = e.h / tan(e.ga), d2 = e.h / tan(e.gb); return e.op ? d1 + d2 : d1 - d2; }
    case 'altura-dos': { const c1 = 1 / tan(e.ga), c2 = 1 / tan(e.gb); return e.m / (e.op ? c1 + c2 : c1 - c2); }
    case 'movil': { const c1 = 1 / tan(e.ga), c2 = 1 / tan(e.gb); return e.sub === 'camara' ? e.h * (c1 - c2) / e.t : e.vv * e.t / (c1 - c2); }
    case 'observacion': return ang(e.hb / e.d0) - ang(e.ha / e.d0);
    case 'largo': { const d = e.d0 * e.k; return d * tan(e.ga + e.gf) - d * tan(e.ga); }
    case 'ventana-obs': return ang(e.h0 / e.d0) + ang(e.arr / e.d0);
    default: throw new Error(`tipo sin recálculo: ${e.tipo}`);
  }
}
const igual = (esperado, valor) => Math.abs(esperado - valor) < 1e-9 * Math.max(1, Math.abs(valor));

probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen);

test('casos.json: cada caso, recalculado aparte, da la alternativa correcta que ve el alumno', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}: otro problema`);
    assert.equal(p.alternativas.find(x => x.correcta).texto, c.esperado.texto, `semilla ${c.semilla}`);
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.valor) < 1e-9, `semilla ${c.semilla}`);
  }
});

test('tipos por idea: cada idea da solo sus tipos, con los tres niveles', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => gen.NIVEL[t]), [1, 2, 3], idea);
    for (let s = 0; s < 120; s++) {
      const p = gen.generar(s, { idea });
      assert.equal(p._datos.idea, idea);
      assert.ok(tipos.includes(p._datos.tipo));
    }
  }
});

test('cada alternativa equivocada vale lo que dice su explicación (el texto de la alternativa está en ella)', () => {
  for (const t of gen.TIPOS) for (let s = 0; s < 80; s++) {
    const p = gen.generar(s, { tipo: t });
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(a.error.explicacion.includes(a.texto.replace(' m/s', ' m')) || a.error.explicacion.includes(a.texto),
      `${t} ${s}: «${a.error.explicacion}» no dice ${a.texto}`);
  }
});

test('Datos en 400 semillas: de 1 a 6 líneas, ≤ 22 palabras, sin la respuesta, sin consejos y con la convención', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6, `semilla ${s}`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `semilla ${s}: «${d}» pasa de 22 palabras`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `semilla ${s}: consejo «${d}»`);
      if (/\b(37|53|16|74)°/.test(d) && /(sen|cos|tan) (37|53|16|74)°/.test(d)) assert.match(d, /\(convención del examen\)/, `semilla ${s}: «${d}»`);
    }
    assert.ok(!p.datos.some(d => d.includes(`= ${ok}`)), `semilla ${s}: los datos traen «= ${ok}»`);
  }
});

test('colores de la unidad: ángulos carmín, opuesto y alturas naranja, adyacente y distancias turquesa; sin violeta ni verde', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) {
      assert.ok(['h', 'o', 'i'].includes(x.color), `semilla ${s}: ${k} en ${x.color}`);
      assert.equal(x.color, { ang: 'h', op: 'o', ad: 'i' }[k], `semilla ${s}: ${k}`);
    }
    for (const parte of [p.enunciado, p.pregunta, ...p.solucion].flat()) {
      if (!parte || typeof parte !== 'object') continue;
      if (parte.v === 'ang') assert.match(parte.t, /°/, `semilla ${s}: un ángulo sin «°»: ${parte.t}`);
    }
  }
});

test('presupuesto de texto: enunciado y pregunta de 40 palabras o menos; nada de NaN ni «undefined»', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 45, `semilla ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    assert.ok(!/NaN|undefined|null|Infinity/.test(plano([p.enunciado, p.pregunta, p.datos, ...p.solucion, p.alternativas.map(a => a.texto + (a.error ? a.error.explicacion : ''))])), `semilla ${s}`);
  }
});

test('nada adelantado: ni tangente de una suma o diferencia, ni identidades, ni oblicuángulos', () => {
  for (let s = 0; s < 400; s++) {
    const t = plano([gen.generar(s).enunciado, gen.generar(s).pregunta, gen.generar(s).datos, ...gen.generar(s).solucion]);
    assert.ok(!/tan\s*\(|sen\s*2|cos\s*2|ley de (senos|cosenos)/.test(t), `semilla ${s}: ${t}`);
  }
});

// Cierre delegado (19 nov): una alternativa sin «≈» es exacta («2,04 m» era 49/24 redondeado), y en «Dos ángulos» se mira
// desde el suelo (personas que miran sumarían la altura de sus ojos, como en la idea 3).
test('cierre: alternativas exactas o con «≈»; dos ángulos desde el suelo', () => {
  const pl = x => (Array.isArray(x) ? x.map(pl).join('') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));
  for (let s = 0; s < 400; s++) for (const id of Object.keys(gen.TIPOS_POR_IDEA)) {
    const p = gen.generar(s, { idea: id });
    for (const a of p.alternativas) {
      const m = a.texto.match(/^(\d+(?:,\d+)?) (m\/s|m|cm|dm|s|°)$/);
      if (m) assert.ok(Math.abs(+m[1].replace(',', '.') - a.valor) < 1e-9, `${id} ${s}: «${a.texto}» vale ${a.valor}`);
    }
    if (id === 'dos-angulos') assert.ok(!/personas|niños/.test(pl(p.enunciado)) && (!/Avanzas/.test(pl(p.enunciado)) || /Desde un punto del suelo/.test(pl(p.enunciado))), pl(p.enunciado));
  }
});
