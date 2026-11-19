// Pruebas de «Longitud de arco y sector circular» (práctica): casos.json (calculados aparte, con un script que no usa
// el generador), un recálculo independiente en 600 problemas (desde el texto del enunciado), fugas, tipos por idea,
// errores con su valor, el recuadro «Datos» en 400 semillas, colores de la unidad y presupuesto de texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const PI = Math.PI;
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => plano(x).split(/\s+/).filter(Boolean).length;
// Un número escrito, con π o sin él: «16π/3 cm», «0,9π m», «55 cm²», «1,5 rad».
function num(t) {
  const x = String(t).replace(/\s(cm²|m²|cm|m|rad|vueltas?)$/, '').replace(/(\d) (\d{3})/g, '$1$2').replace(/−/g, '-');
  const m = /^(-?[\d,]*)π(?:\/(\d+))?$/.exec(x);
  if (m) return (m[1] === '' ? 1 : +m[1].replace(',', '.')) * PI / (m[2] ? +m[2] : 1);
  return +x.replace(',', '.');
}
const VECES = { 'el doble de': 2, 'el triple de': 3, 'el cuádruple de': 4, 'el quíntuple de': 5 };
// ---- Camino independiente: del texto del enunciado a la respuesta ----
function recalcular(p) {
  const q = `${plano(p.enunciado)} ${plano(p.pregunta)}`.replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3');
  let m;
  if ((m = /de (\d+) cm de radio, un ángulo central mide ([\dπ\/,]+) rad\. ¿Cuánto mide su arco/.exec(q))) return num(m[2]) * +m[1];
  if ((m = /de (\d+) cm de radio, un ángulo central mide (\d+)°\. ¿Cuánto mide su arco/.exec(q))) return +m[2] * PI / 180 * +m[1];
  if ((m = /Un arco de ([\dπ\/,]+) cm abarca un ángulo central de (\d+)°/.exec(q))) return num(m[1]) / (+m[2] * PI / 180);
  if ((m = /minutero de un reloj mide (\d+) cm\. ¿Cuánto recorre su punta en (\d+) minutos/.exec(q))) return +m[2] / 60 * 2 * PI * +m[1];
  if ((m = /de (\d+) cm de radio, un ángulo central mide (\d+)ᵍ/.exec(q))) return +m[2] * PI / 200 * +m[1];
  if ((m = /arco de (\d+) cm y un radio de (\d+) cm/.exec(q))) return +m[1] * +m[2] / 2;
  if ((m = /tiene (\d+) cm de radio y un ángulo central de ([\dπ\/]+) rad/.exec(q))) return num(m[2]) * (+m[1]) ** 2 / 2;
  if ((m = /ángulo central de (\d+)° y un área de ([\dπ\/,]+) m²/.exec(q))) return Math.sqrt(2 * num(m[2]) / (+m[1] * PI / 180));
  if ((m = /tiene (\d+) m de radio y un ángulo central de (\d+)°/.exec(q))) return +m[2] / 360 * PI * (+m[1]) ** 2;
  if ((m = /tiene ([\d,]+) m² de área y un ángulo central de ([\d,]+) rad/.exec(q))) { const t = num(m[2]), r = Math.sqrt(2 * num(m[1]) / t); return 2 * r + t * r; }
  if ((m = /perímetro de un sector circular es (el triple de|el cuádruple de|el quíntuple de|[\d,]+ veces) su radio/.exec(q))) return (VECES[m[1]] || num(m[1].replace(' veces', ''))) - 2;
  if ((m = /ángulo central de ([\dπ\/]+) rad y va desde r1 = (\d+) cm hasta r2 = (\d+) cm/.exec(q))) return num(m[1]) / 2 * ((+m[3]) ** 2 - (+m[2]) ** 2);
  if ((m = /s1 = (\d+) cm y s2 = (\d+) cm, y su ancho es h = (\d+) cm\. ¿Cuánto mide su (área|ángulo)/.exec(q))) return m[4] === 'área' ? (+m[1] + +m[2]) / 2 * +m[3] : (+m[2] - +m[1]) / +m[3];
  if ((m = /r2 es (el doble de|el triple de|el cuádruple de|el quíntuple de) r1/.exec(q))) return VECES[m[1]] ** 2 - 1;
  if ((m = /brazo de un limpiaparabrisas mide (\d+) cm, y su jebe, de (\d+) cm, .* barre (\d+)°/.exec(q))) { const R2 = +m[1], R1 = R2 - +m[2]; return +m[3] * PI / 360 * (R2 * R2 - R1 * R1); }
  if ((m = /tiene ([\d,]+) m de radio y avanza ([\d,π]+) m sin deslizar/.exec(q))) return num(m[2]) / (2 * PI * num(m[1]));
  if ((m = /rueda de (\d+) cm de radio rueda sin deslizar por (fuera|dentro) .* de (\d+) cm/.exec(q))) return (m[2] === 'fuera' ? +m[3] + +m[1] : +m[3] - +m[1]) / +m[1];
  if ((m = /adelante de un (?:carro|tractor) tienen ([\d,]+) m de radio y las de atrás, ([\d,]+) m\. .* da (\d+) vueltas más/.exec(q))) { const a = num(m[1]), b = num(m[2]); return 2 * PI * +m[3] * a * b / (b - a); }
  if ((m = /polea de r1 = (\d+) cm con otra de r2 = (\d+) cm\. La primera da (\d+) vueltas/.exec(q))) return +m[3] * +m[1] / +m[2];
  if ((m = /r1 = (\d+) cm\) mueve con una faja a la rueda 2 \(r2 = (\d+) cm\); la rueda 3 \(r3 = (\d+) cm\) va en el eje de la 2\. La rueda 1 da (\d+) vueltas?/.exec(q))) return +m[4] * +m[1] / +m[2];
  if ((m = /rueda de (\d+) cm que, con una faja, mueve otra de (\d+) cm; en su eje, un tambor de (\d+) cm .* La manivela da (\d+) vueltas?/.exec(q))) return +m[4] * +m[1] / +m[2] * 2 * PI * +m[3];
  throw new Error(`no sé leer: ${q}`);
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
  assert.equal(new Set(casos.casos.map(c => c.entrada.tipo)).size, gen.TIPOS.length, 'un caso de cada tipo, por lo menos');
});

test('tipos por idea: las cinco ideas de la unidad, cada una con nivel 1, 2 y 3; generar(s, { idea }) da solo los suyos', () => {
  const U = require('../../contenido/teoria/trigonometria/longitud-de-arco-y-sector.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), U.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => gen.NIVEL[t]).sort(), [1, 2, 3], idea);
    for (let s = 0; s < 60; s++) assert.equal(gen.generar(s, { idea })._datos.idea, idea);
  }
  for (const t of gen.TIPOS) for (let s = 0; s < 30; s++) assert.equal(gen.generar(`t${s}`, { tipo: t })._datos.tipo, t);
});

// Cada error vale lo que dice su explicación: el número que la explicación nombra es el de la alternativa.
test('cada explicación empieza por lo que el alumno hizo bien, es corta, lleva su respaldo y nombra el valor de su alternativa', () => {
  for (let s = 0; s < 800; s++) {
    for (const x of gen.generar(s).alternativas.filter(y => y.error)) {
      assert.match(x.error.explicacion, /^Bien\b/, `semilla ${s}: ${x.error.explicacion}`);
      assert.ok(palabras(x.error.explicacion) <= 24, `semilla ${s}: ${x.error.explicacion}`);
      if (/^TR[23]$/.test(x.error.id)) assert.ok(x.error.respaldo === 'documentado' && x.error.fuente, `semilla ${s}: ${x.error.id}`);
      else assert.equal(x.error.respaldo, 'hipotesis', `semilla ${s}: ${x.error.id}`);
      const t = x.texto.replace(/ (vueltas?|rad|cm²|m²|cm|m)$/, '');
      if (!['VUEL-TRASLADA', 'POL-IGUAL', 'TRAP-SIN-CUADRADO', 'SEC-SIN-RAIZ', 'POL-PROPORCIONAL', 'POL-SOGA-RUEDA'].includes(x.error.id)) assert.ok(x.error.explicacion.includes(t), `semilla ${s}: la explicación de ${x.error.id} no dice ${x.texto}: ${x.error.explicacion}`);
    }
  }
});

test('ninguna alternativa queda fuera de escala (de 1/20 a 20 veces la correcta) ni es cero', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), cv = num(p.alternativas.find(x => x.correcta).texto);
    for (const x of p.alternativas) {
      const xv = num(x.texto);
      assert.ok(xv > 0 && xv / cv >= 1 / 20 && xv / cv <= 20, `semilla ${s}: ${x.texto} frente a ${cv}`);
    }
  }
});

test('presupuesto de texto: enunciado y pregunta hasta 45 palabras; sin punto decimal, null, R ni L', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 45, `semilla ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(x => x.texto)].join(' ');
    assert.ok(!/\d\.\d|\bnull\b|\bNaN\b|undefined|\b[RL] =|\bsen |\bcos /.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('colores de la unidad: ángulo carmín, radio naranja, arco turquesa, área y vueltas violeta; sin verde (600 semillas)', () => {
  const COLOR = { ang: 'h', rad: 'o', arco: 'i', area: 'f', vuel: 'f' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (typeof x !== 'object') continue;
      if (/(°|ᵍ|rad)$/.test(x.t)) assert.equal(x.v, 'ang', `semilla ${s}: «${x.t}»`);
      if (/(cm²|m²)$/.test(x.t)) assert.equal(x.v, 'area', `semilla ${s}: «${x.t}»`);
      if (/^r/.test(x.t)) assert.equal(x.v, 'rad', `semilla ${s}: «${x.t}»`);
      if (/^s/.test(x.t)) assert.equal(x.v, 'arco', `semilla ${s}: «${x.t}»`);
    }
  }
});

const FORMULA = {
  arco: ['s = θ · r'], grados: ['s = θ · r', 'π rad = 180°'], 'arco-examen': ['s = θ · r', /200ᵍ|1 vuelta = 2π rad/],
  area: ['A = θ · r²/2 = s · r/2'], 'area-grados': ['A = θ · r²/2', 'π rad = 180°'], perimetro: ['2r + s'],
  banda: ['A = θ · (r₂² − r₁²)/2'], 'banda-arcos': [/\(s₁ \+ s₂\)\/2 · h|s₁ = θ · r₁/], 'banda-examen': ['A = θ · (r₂² − r₁²)/2'],
  vueltas: ['n = d/(2π · r)'], rodea: ['n = d/(2π · r)', 'suma de los radios'], 'dos-ruedas': ['n = d/(2π · r)'],
  faja: ['n₁ · r₁ = n₂ · r₂'], eje: ['n₁ · r₁ = n₂ · r₂', 'Eje común'], balde: ['n₁ · r₁ = n₂ · r₂', 'Eje común', '2π · r'],
};
test('datos: lista de líneas cortas, con la fórmula de cada tipo, sin la respuesta ni consejos, en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Truco|Tip|Consejo|Primero|Siempre|No olvides|Fíjate|Conviene)/i.test(l), `semilla ${s}: «${l}» es un consejo`);
    }
    const todo = p.datos.join('\n');
    for (const fo of FORMULA[d.tipo]) assert.ok(fo instanceof RegExp ? fo.test(todo) : todo.includes(fo), `semilla ${s} (${d.tipo}): falta «${fo}»`);
    const c = p.alternativas.find(x => x.correcta).texto;
    assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta`);
  }
});

test('la práctica no repite las predicciones de la teoría', () => {
  for (let s = 0; s < 1500; s++) {
    const q = plano(gen.generar(s).enunciado);
    assert.ok(!/de 2 m y se aleja 60°|brazo de un limpiaparabrisas mide 40 cm, y su jebe, de 20 cm/.test(q), `semilla ${s}: ${q}`);
  }
});
