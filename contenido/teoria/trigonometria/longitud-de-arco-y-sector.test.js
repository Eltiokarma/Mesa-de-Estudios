// Pruebas propias de «Longitud de arco y sector circular» (además del validador común de contenido/teoria/teoria.test.js).
// Etapa 6 (19 nov): las cinco ideas rehechas contra el contrato (docs/etapa6/propuesta-trigonometria.md).
//   - orden e ids de las ideas, temas del catálogo y una mesa del laboratorio por idea;
//   - regla de colores de la unidad (cabecera del archivo): θ carmín, radios naranja, arcos (y d) turquesa, área y vueltas
//     violeta, sin verde; en cada texto y cada figura, también en «Ahora tú» y «Así se resuelve» (400 semillas);
//   - cada misión se cumple con un solo caso de su grilla y no al abrir; el juego no muestra lo que la predicción pregunta;
//   - las cinco predicciones, con cada distractor rehecho por su error;
//   - «Ahora tú» y «Así se resuelve» cuadran con un cálculo aparte, hecho desde el texto del enunciado (400 semillas), y
//     cada distractor vale lo que da su error; los dos momentos no hacen la misma pregunta;
//   - los 75 ejemplos: la respuesta rehecha aparte, la figura sin el resultado, la letra de las correctas repartida y cada
//     alternativa equivocada con el valor de su error;
//   - nada adelantado ni prestado: ni razones trigonométricas ni velocidades (Física), y R y L no se usan como letras.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./longitud-de-arco-y-sector.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const RAIZ = path.join(__dirname, '..', '..', '..');
const SEMILLAS = 400;
const PI = Math.PI;
const idea = id => def.ideas.find(i => i.id === id);
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/[⁠ ]/g, ' ');
const cerca = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
// Un número escrito, con π o sin él: «12π», «40π/9», «0,6π», «π/2», «2,5», «1/3», «4√2».
function num(t) {
  let x = String(t).replace(/−/g, '-').replace(/\s/g, '').replace(/(cm²|m²|cm|km|m|rad|°|vueltas?|veces|deVuelta|devuelta)$/g, '');
  x = x.replace(/de vuelta$/, '');
  let m;
  if ((m = /^(-?[\d,]*)√(\d+)$/.exec(x))) return (m[1] === '' ? 1 : +m[1].replace(',', '.')) * Math.sqrt(+m[2]);
  if ((m = /^(-?[\d,]*)π(?:\/(\d+))?$/.exec(x))) return (m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : +m[1].replace(',', '.')) * PI / (m[2] ? +m[2] : 1);
  if ((m = /^(-?\d+)\/(\d+)$/.exec(x))) return +m[1] / +m[2];
  return +x.replace(',', '.');
}
const numDe = t => num(String(t).replace(/^[A-E], /, '').replace(/^(s|r|θ|A|n|d|h)[₁₂₃123]?\s?=\s?/, '').replace(/≈.*$/, '').trim());
const svgDe = (dib, pieza) => Kit.piezas[dib.pieza || pieza || 'trig-arco'].dibujar(dib.datos, dib.estado || {});
// Todos los colores de variable de un texto con partes ({ v: 'c-h', t }), con la letra que pintan.
function fichas(x, acc = []) {
  if (Array.isArray(x)) x.forEach(y => fichas(y, acc));
  else if (x && typeof x === 'object') { if (typeof x.v === 'string') acc.push(x); for (const [k, v] of Object.entries(x)) if (k !== 'v' && k !== 't' && typeof v === 'object') fichas(v, acc); }
  return acc;
}

test('cinco ideas con sus id de siempre, temas del catálogo y una mesa por idea', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(def.ideas.map(i => i.id), ['arco', 'sector', 'trapecio-circular', 'vueltas-rueda', 'faja-y-eje']);
  const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo/cursos/trigonometria.json'), 'utf8')).unidades.find(u => u.id === def.unidad);
  for (const i of def.ideas) for (const t of i.temas) assert.ok(cat.temas.includes(t), `${i.id}: «${t}» no es un tema del catálogo`);
  assert.deepEqual(new Set(Object.values(def.laboratorioIdeas).flat()), new Set(def.ideas.map(i => i.id)));
  for (const m of def.laboratorio) assert.ok(def.laboratorioIdeas[m.id] && def.laboratorioIdeas[m.id].length, m.id);
  for (const i of def.ideas) for (const k of ['aprendizaje', 'actividad', 'pregunta']) assert.ok(i[k], `${i.id}: sin ${k}`);
});

// Todos los textos y las figuras de una idea (con 400 semillas de «Ahora tú» y «Así se resuelve»).
function todo(i) {
  const textos = [], figs = [];
  const fig = (d, pz) => { if (d) figs.push(Object.assign({ pieza: d.pieza || pz || i.pieza }, d)); };
  for (const t of i.lee.tarjetas) { textos.push(t.titulo, t.texto); fig(t.dibujo, t.pieza); }
  const j = i.juega;
  textos.push(j.consigna, j.mision.texto, j.mision.bien, j.leyenda.map(l => [l.s, l.t]));
  for (const v of Teoria.grilla(j.controles)) { textos.push(j.lectura(v)); fig(j.dibujo(v)); }
  const p = i.predice;
  textos.push(p.pregunta, p.datos, p.opciones.map(o => [o.texto, o.siFuera]), p.coincide, p.noCoincide);
  fig(p.dibujo); fig(p.revelar);
  for (const ps of i.mira.pasos) { textos.push(ps.texto, ps.ecuacion); fig({ datos: i.mira.datos, estado: ps.estado }, i.mira.pieza); }
  textos.push(i.regla.texto, i.regla.ecuacion, i.regla.condicion);
  if (i.regla.dibujo) fig(i.regla.dibujo);
  for (const e of i.ejemplos) { textos.push(e.enunciado, e.datos, e.solucion, e.respuesta, e.alternativas); fig(e.figura); }
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    textos.push(a.pregunta, a.datos, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion.texto, a.solucion.ecuacion, r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta);
    fig(a.dibujo); fig(r.dibujo); r.pasos.forEach(x => fig(x.dibujo));
  }
  return { textos, figs };
}
const COLOR = { 'θ': 'c-h', r: 'c-o', s: 'c-i', d: 'c-i', A: 'c-f', n: 'c-f' };

test('colores de la unidad: cada letra con el color de su magnitud, y nada en verde (textos y figuras, 400 semillas)', () => {
  for (const i of def.ideas) {
    const { textos, figs } = todo(i);
    for (const x of fichas(textos)) {
      assert.notEqual(x.v, 'c-d', `${i.id}: «${x.t}» en verde`);
      const letra = String(x.t).trim();
      if (COLOR[letra]) assert.equal(x.v, COLOR[letra], `${i.id}: «${letra}» va en ${COLOR[letra]}, no en ${x.v}`);
      // Un número con su unidad lleva el color de su magnitud: ° y rad, carmín; cm² y m², violeta.
      if (/(°|rad|ᵍ)$/.test(letra) && /\d/.test(letra)) assert.equal(x.v, 'c-h', `${i.id}: el ángulo «${letra}» va en carmín`);
      if (/(cm²|m²)$/.test(letra)) assert.equal(x.v, 'c-f', `${i.id}: el área «${letra}» va en violeta`);
    }
    assert.ok(figs.length > 20, `${i.id}: ${figs.length} figuras`);
    for (const d of figs) assert.ok(!/var\(--c-d\)/.test(svgDe(d)), `${i.id}: una figura usa verde`);
  }
});

test('misiones: un solo caso de la grilla las cumple, y ninguna al abrir', () => {
  const esperado = { arco: [{ t: 0.75, r: 2 }], sector: [{ g: 45 }], 'trapecio-circular': [{ r2: 60, h: 30 }], 'vueltas-rueda': [{ r: 0.4, n: 1 }], 'faja-y-eje': [{ n1: 1, r2: 5 }] };
  for (const i of def.ideas) {
    const cumplen = Teoria.grilla(i.juega.controles).filter(v => i.juega.mision.logrado(v));
    assert.equal(cumplen.length, 1, `${i.id}: ${JSON.stringify(cumplen)}`);
    for (const [k, v] of Object.entries(esperado[i.id][0])) assert.ok(cerca(cumplen[0][k], v), `${i.id}: ${k}`);
    assert.ok(!i.juega.mision.logrado(Teoria.inicio(i.juega)), `${i.id}: cumplida al abrir`);
    // Y la cuenta de la misión, aparte.
    const c = cumplen[0];
    if (i.id === 'arco') assert.ok(cerca(c.t * c.r, 1.5));
    if (i.id === 'sector') assert.ok(cerca(c.g / 360 * PI * 400, 50 * PI));
    if (i.id === 'trapecio-circular') assert.ok(cerca(2 * PI / 3 * (c.r2 - c.h), 20 * PI));
    if (i.id === 'vueltas-rueda') assert.ok(cerca(c.n * 2 * PI * c.r, 0.8 * PI));
    if (i.id === 'faja-y-eje') assert.ok(cerca(c.n1 * 10 / c.r2, 2));
  }
});

test('el juego no muestra lo que la predicción pregunta', () => {
  const textoJuego = i => Teoria.grilla(i.juega.controles).map(v => plano(i.juega.lectura(v)) + ' ' + Teoria.textoSVG(svgDe(i.juega.dibujo(v)))).join(' | ');
  // Idea 1: el juego da el ángulo en radianes; la predicción, en grados.
  assert.ok(!/°/.test(textoJuego(idea('arco'))), 'el juego del columpio no usa grados');
  // Idea 2: las varillas no cambian en el juego (la predicción las duplica).
  assert.equal(idea('sector').juega.controles.length, 1);
  // Idea 3: el juego no da ningún área.
  assert.ok(!/cm²|A =/.test(textoJuego(idea('trapecio-circular'))), 'el juego del limpiaparabrisas no da áreas');
  // Idea 4: el juego rueda en una recta (la predicción, alrededor de otra moneda).
  for (const v of Teoria.grilla(idea('vueltas-rueda').juega.controles)) assert.equal(idea('vueltas-rueda').juega.dibujo(v).datos.objeto, 'rueda');
  // Idea 5: el juego no tiene la rueda de atrás (el eje común es la predicción).
  for (const v of Teoria.grilla(idea('faja-y-eje').juega.controles)) assert.ok(!idea('faja-y-eje').juega.dibujo(v).datos.rueda);
});

test('las cinco predicciones: una correcta, cuatro opciones, cada distractor sale de su error, y la figura no trae la respuesta', () => {
  const esp = {
    arco: { c: '2π/3 m ≈ 2,09 m', otros: { grados: `${60 * 2} m`, radio: '2 m', diam: '4π/3 m ≈ 4,19 m' } },
    sector: { c: 'El arco se duplica y el área se cuadruplica' },
    'trapecio-circular': { c: '400π cm²', otros: { jebe: '400π/3 cm²', brazo: '1600π/3 cm²', mitad: '800π cm²' } },
    'vueltas-rueda': { c: '2 vueltas', otros: { contacto: '1 vuelta', diametro: '4 vueltas' } },
    'faja-y-eje': { c: '2 vueltas', otros: { faja: '1/3 de vuelta', proporcional: '12 vueltas', pedal: '1 vuelta' } },
  };
  // Las cuentas, aparte: 60° = π/3 rad y π/3 · 2; 60 · 2; un radio; el diámetro (4 m). El trapecio de 120°:
  // 2π/3 · (40² − 20²)/2 = 400π; el jebe solo, 2π/3 · 20²/2; el brazo, 2π/3 · 40²/2; sin la mitad, el doble. Las monedas:
  // 2π · 2r / 2πr = 2; entre media vuelta, 4. El eje común: 2 vueltas; por radios, 2 · 5/30; al revés, 2 · 30/5.
  assert.ok(cerca(PI / 3 * 2, 2 * PI / 3)); assert.ok(cerca(2 * PI / 3 * (1600 - 400) / 2, 400 * PI));
  assert.ok(cerca(2 * PI / 3 * 400 / 2, 400 * PI / 3)); assert.ok(cerca(2 * PI / 3 * 1600 / 2, 1600 * PI / 3));
  assert.equal(2 * 5 / 30, 1 / 3); assert.equal(2 * 30 / 5, 12);
  for (const i of def.ideas) {
    const p = i.predice, e = esp[i.id];
    assert.equal(p.opciones.length, 4); assert.equal(p.opciones.filter(o => o.correcta).length, 1);
    assert.equal(plano(p.opciones.find(o => o.correcta).texto), e.c, i.id);
    for (const [id, t] of Object.entries(e.otros || {})) assert.equal(plano(p.opciones.find(o => o.id === id).texto), t, `${i.id}: ${id}`);
    for (const o of p.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${i.id}: ${o.id}`);
    // La figura de Predice no escribe la respuesta (sí el revelar).
    const fig = Teoria.textoSVG(svgDe(p.dibujo, i.pieza));
    assert.ok(!fig.includes(e.c.split(' ')[0]) || i.id === 'vueltas-rueda' || i.id === 'faja-y-eje', `${i.id}: la figura de Predice trae «${e.c}»`);
    // Datos de la predicción: sin fórmula (ningún «=» con letras, salvo la equivalencia π rad = 180°).
    for (const dt of p.datos || []) assert.ok(!/[sAnr]\s*=/.test(plano(dt)), `${i.id}: datos de Predice con fórmula: ${plano(dt)}`);
  }
  assert.ok(!/n₃ = 2/.test(Teoria.textoSVG(svgDe(idea('faja-y-eje').predice.dibujo))), 'la figura de Predice del eje no trae las vueltas de la rueda');
});

// ---------- «Ahora tú» y «Así se resuelve», con un cálculo aparte desde el texto ----------
const VECES = { 'el doble': 2, 'el triple': 3, 'el cuádruple': 4, 'el quíntuple': 5 };
const n = t => num(t);
// Cada caso: del texto de la pregunta, la respuesta correcta y lo que vale cada error (por su código).
function resolver(idId, q0) {
  const q = q0.replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3');
  let m;
  if (idId === 'arco') {
    if ((m = /(?:un arco de|llanta de) ([\dπ\/,]+) cm abarca (?:un ángulo central de )?(\d+)°.*¿Cuánto mide el radio/.exec(q))) {
      const S = n(m[1]), g = +m[2], r = S / (g * PI / 180);
      return { bien: r, err: { TR4: S / g, 'ARCO-DIAM': 2 * r, 'ARCO-POR': S * g * PI / 180, 'RAD-SIN-PI': r * PI } };
    }
    if ((m = /de (\d+) cm de radio, un arco mide ([\dπ\/,]+) cm\. ¿Cuánto mide su ángulo central, en grados/.exec(q))) {
      const r = +m[1], S = n(m[2]), t = S / r, g = t * 180 / PI;
      return { bien: g, err: { TR3: t, 'ARCO-INV': r / S * 180 / PI, 'RAD-200': t * 200 / PI, 'ARCO-DIAM': g / 2 } };
    }
    if ((m = /minutero de un reloj mide (\d+) cm\. ¿Cuánto recorre su punta en (\d+) minutos/.exec(q))) {
      const L = +m[1], mi = +m[2], s = mi / 60 * 2 * PI * L;
      return { bien: s, err: { TR4: 6 * mi * L, 'VUELTA-PI': s / 2, 'ARCO-DIAM': 2 * s, 'ARCO-MINUTOS': mi * L } };
    }
    if ((m = /de (\d+) cm de radio, un ángulo central mide (\d+)ᵍ/.exec(q))) {
      const r = +m[1], C = +m[2], s = C * PI / 200 * r;
      return { bien: s, err: { 'CONV-MISMO': C * PI / 180 * r, TR4: C * r, 'ARCO-DIAM': 2 * s, 'RAD-SIN-PI': C / 200 * r } };
    }
    if ((m = /columpio mide ([\d,]+) m y se aleja (\d+)°/.exec(q))) return { bien: +m[2] * PI / 180 * n(m[1]) };
  }
  if (idId === 'sector') {
    if ((m = /borde curvo de (\d+) cm y lados rectos de (\d+) cm/.exec(q))) {
      const s = +m[1], r = +m[2];
      return { bien: s * r / 2, err: { 'SEC-MITAD': s * r, 'SEC-ARCO-CUADRADO': s * r * r / 2, 'SEC-ARCO': s / 2, 'SEC-SUMA': (s + r) / 2 } };
    }
    if ((m = /sector circular de (\d+)° tiene un área de ([\dπ\/,]+) cm²\. ¿Cuánto mide su radio/.exec(q))) {
      const g = +m[1], A = n(m[2]), t = g * PI / 180, r = Math.sqrt(2 * A / t);
      return { bien: r, err: { 'SEC-SIN-RAIZ': r * r, 'SEC-MITAD': Math.sqrt(A / t), TR4: Math.sqrt(2 * A / g), 'ARCO-DIAM': 2 * r }, tol: 0.01 };
    }
    if ((m = /de (\d+) cm de radio tiene un área de ([\dπ\/,]+) cm²\. ¿Cuánto mide su ángulo central, en grados/.exec(q))) {
      const r = +m[1], A = n(m[2]), t = 2 * A / (r * r), g = t * 180 / PI;
      return { bien: g, err: { 'SEC-MITAD': g / 2, 'SEC-LINEAL': 2 * A / r * 180 / PI, TR3: t, 'RAD-200': t * 200 / PI }, tol: 0.01 };
    }
    if ((m = /tiene ([\d,]+) m² de área y un ángulo central de ([\d,]+) rad/.exec(q))) {
      const A = n(m[1]), t = n(m[2]), r = Math.sqrt(2 * A / t), s = t * r;
      return { bien: 2 * r + s, err: { 'SEC-SOLO-ARCO': s, 'SEC-SOLO-RADIOS': 2 * r, 'SEC-UN-RADIO': r + s, 'SEC-SIN-RAIZ': 2 * (2 * A / t) + t * (2 * A / t) } };
    }
    if ((m = /perímetro de un sector circular es (el doble|el triple|el cuádruple|el quíntuple|[\d,]+ veces) de su radio/.exec(q))) {
      const k = VECES[m[1]] || n(m[1].replace(' veces', ''));
      return { bien: k - 2, err: { 'SEC-SOLO-ARCO': k, 'SEC-UN-RADIO': k - 1, TR2: (k - 2) * 60, 'SEC-MITAD': (k - 2) / 2 } };
    }
    if ((m = /con (\d+) m de radio y (\d+)° de ángulo central/.exec(q))) return { bien: +m[2] / 360 * PI * (+m[1]) ** 2 };
  }
  if (idId === 'trapecio-circular') {
    if ((m = /s1 = (\d+) cm y s2 = (\d+) cm, y su ancho es h = (\d+) cm\. ¿Cuánto mide su (área|ángulo)/.exec(q))) {
      const a = +m[1], b = +m[2], h = +m[3];
      if (m[4] === 'área') return { bien: (a + b) / 2 * h, err: { 'TRAP-MITAD': (a + b) * h, 'TRAP-SUMA': (b - a) / 2 * h } };
      return { bien: (b - a) / h, err: { 'TRAP-SUMA': (a + b) / h, 'TRAP-GRANDE': b / h, 'TRAP-MITAD': (b - a) / (2 * h), 'ARCO-POR': (b - a) * h } };
    }
    if ((m = /Si r2 es (el doble|el triple|el cuádruple|el quíntuple) de r1/.exec(q))) {
      const k = VECES[m[1]];
      return { bien: k * k - 1, err: { 'TRAP-SIN-CUADRADO': k - 1, 'TRAP-GRANDE': k * k, 'SEC-LINEAL': k, 'TRAP-SUMA': k * k + 1 } };
    }
    if ((m = /brazo de un limpiaparabrisas mide (\d+) cm, y su jebe, de (\d+) cm, .* barre (\d+)°/.exec(q))) {
      const R2 = +m[1], h = +m[2], g = +m[3], R1 = R2 - h, t = g * PI / 180;
      return { bien: t / 2 * (R2 * R2 - R1 * R1), err: { 'TRAP-RESTA': t / 2 * h * h, 'TRAP-GRANDE': t / 2 * R2 * R2, 'TRAP-MITAD': t * (R2 * R2 - R1 * R1), 'TRAP-SIN-CUADRADO': t / 2 * (R2 - R1) * h } };
    }
    if ((m = /va desde (\d+) m hasta (\d+) m del centro, y abarca (\d+)°/.exec(q))) return { bien: +m[3] * PI / 360 * ((+m[2]) ** 2 - (+m[1]) ** 2) };
  }
  if (idId === 'vueltas-rueda') {
    if ((m = /Una rueda de ([\d,]+) m de radio da (\d+) vueltas rodando sin deslizar\. ¿Cuánto avanza/.exec(q))) {
      const r = n(m[1]), v = +m[2], d = 2 * PI * r * v;
      return { bien: d, err: { 'VUEL-SIN-PI': d / PI, 'VUEL-RADIO': r * v } };
    }
    if ((m = /da (\d+) vueltas sin deslizar, y su centro avanza ([\d,π]+) m\. ¿Cuánto mide su radio/.exec(q))) {
      const v = +m[1], d = n(m[2]), r = d / (2 * PI * v);
      return { bien: r, err: { 'VUEL-UNA-RUEDA': r * v, 'VUEL-SIN-PI': r * PI }, tol: 0.01 };
    }
    if ((m = /rueda de (\d+) cm de radio rueda sin deslizar por (fuera de otra rueda fija|dentro de un aro fijo) de (\d+) cm/.exec(q))) {
      const a = +m[1], b = +m[3], fuera = /fuera/.test(m[2]), v = (fuera ? b + a : b - a) / a;
      return { bien: v, err: { 'VUEL-CONTACTO': b / a, 'VUEL-DENTRO': (b - a) / a, 'VUEL-FUERA': (b + a) / a, 'VUEL-DIAMETRO': 2 * v, 'VUEL-TRASLADA': 1 } };
    }
    if ((m = /adelante de un (?:carro|tractor) tienen ([\d,]+) m de radio y las de atrás, ([\d,]+) m\. .* da (\d+) vueltas más/.exec(q))) {
      const a = n(m[1]), b = n(m[2]), D = +m[3], d = 2 * PI * D * a * b / (b - a);
      return { bien: d, err: { 'VUEL-RESTA-RADIOS': 2 * PI * D * (b - a), 'VUEL-UNA-RUEDA': 2 * PI * D * a } };
    }
    if ((m = /tiene ([\d,]+) m de radio y avanza ([\d,π]+) m sin deslizar/.exec(q))) return { bien: n(m[2]) / (2 * PI * n(m[1])) };
  }
  if (idId === 'faja-y-eje') {
    if ((m = /r1 = (\d+) cm y el segundo, r2 = (\d+) cm\. Si el primero gira (\d+)° en sentido (horario|antihorario)/.exec(q))) {
      const a = +m[1], b = +m[2], g = +m[3], otro = m[4] === 'horario' ? 'antihorario' : 'horario';
      return { bien: `${Kit.formatear(g * a / b, 2)}°, ${otro}`, texto: true };
    }
    if ((m = /r1 = (\d+) cm\) mueve con una faja a la rueda 2 \(r2 = (\d+) cm\); la rueda 3 \(r3 = (\d+) cm\) va en el eje de la 2\. Si la 1 da ([\d,]+) vueltas?/.exec(q))) {
      const a = +m[1], b = +m[2], c = +m[3], v = n(m[4]);
      return { bien: v * a / b, err: { 'POL-IGUAL': v, 'POL-FAJA-EJE': v * a / c, 'POL-INVERSA': v * b / a, 'POL-PROPORCIONAL': v * a / b * c / b } };
    }
    if ((m = /rueda de (\d+) cm que, con una faja, mueve otra de (\d+) cm; en su eje, un tambor de (\d+) cm .* Con ([\d,]+) vueltas? de la manivela/.exec(q))) {
      const a = +m[1], b = +m[2], c = +m[3], v = n(m[4]), nb = v * a / b;
      return { bien: nb * 2 * PI * c, err: { 'POL-SIN-FAJA': v * 2 * PI * c, 'POL-SOGA-RUEDA': nb * 2 * PI * b, 'VUEL-DIAMETRO': nb * PI * c, 'POL-INVERSA': v * b / a * 2 * PI * c } };
    }
    if ((m = /r1 = (\d+) cm, da (\d+) vueltas y mueve con una faja a otra polea de r2 = (\d+) cm/.exec(q))) return { bien: +m[2] * +m[1] / +m[3] };
  }
  return null;
}

test(`«Ahora tú»: cuatro opciones, datos, la correcta y cada distractor rehechos desde el texto (${SEMILLAS} semillas por idea)`, () => {
  for (const i of def.ideas) {
    const tipos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const c = i.ahoraTu.generar(s), q = plano(c.pregunta), ops = c.opciones.map(o => plano(o.texto));
      assert.equal(c.opciones.length, 4, `${i.id} ${s}: ${ops}`);
      assert.equal(new Set(ops).size, 4, `${i.id} ${s}: opciones repetidas ${ops}`);
      assert.equal(c.opciones.filter(o => o.correcta).length, 1);
      assert.ok(Array.isArray(c.datos) && c.datos.length >= 1, `${i.id} ${s}: sin datos`);
      for (const o of c.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${i.id} ${s}: ${o.id}`);
      const R = resolver(i.id, q);
      assert.ok(R, `${i.id} ${s}: no sé leer «${q}»`);
      tipos.add(s % 3);
      const bien = plano(c.opciones.find(o => o.correcta).texto);
      if (R.texto) { assert.equal(bien, R.bien, `${i.id} ${s}: ${q}`); continue; }
      const tol = R.tol || 0.006;
      assert.ok(cerca(numDe(bien), R.bien, tol), `${i.id} ${s}: «${bien}» y el cálculo aparte da ${R.bien} (${q})`);
      // Cada distractor con un error conocido vale lo que da ese error; ninguno vale lo mismo que la correcta.
      for (const o of c.opciones.filter(x => !x.correcta)) {
        const v = numDe(plano(o.texto));
        assert.ok(!cerca(v, R.bien, 1e-9), `${i.id} ${s}: «${plano(o.texto)}» vale lo mismo que la correcta`);
        if (R.err && R.err[o.error] !== undefined && !['VUEL-DIAMETRO', 'TRAP-GRANDE', 'SEC-MITAD'].includes(o.error)) assert.ok(cerca(v, R.err[o.error], 0.01), `${i.id} ${s}: ${o.error} da ${R.err[o.error]}, no «${plano(o.texto)}»`);
      }
    }
    assert.equal(tipos.size, 3, `${i.id}: los tres tipos`);
  }
});

test(`«Así se resuelve»: la respuesta cuadra con un cálculo aparte (${SEMILLAS} semillas) y no es la pregunta de «Ahora tú»`, () => {
  for (const i of def.ideas) {
    const ahora = new Set();
    for (let s = 0; s < 60; s++) ahora.add(plano(i.ahoraTu.generar(s).pregunta).replace(/[\d,π\/]+/g, '#'));
    for (let s = 0; s < SEMILLAS; s++) {
      const r = i.resuelve.generar(s), q = plano(r.enunciado), R = resolver(i.id, q);
      assert.ok(R, `${i.id} ${s}: no sé leer «${q}»`);
      assert.ok(cerca(numDe(plano(r.respuesta)), R.bien, 0.006), `${i.id} ${s}: «${plano(r.respuesta)}» y aparte ${R.bien}`);
      assert.ok(!ahora.has(q.replace(/[\d,π\/]+/g, '#')), `${i.id} ${s}: «Así se resuelve» hace la pregunta de «Ahora tú»`);
      assert.ok(r.datos && r.datos.length, `${i.id} ${s}: sin datos`);
    }
  }
});

// ---------- Los 75 ejemplos, rehechos aparte ----------
// La respuesta de cada ejemplo, con la cuenta escrita aquí (no la del archivo), en el orden de las ideas.
const RESPUESTAS = {
  arco: [2, 15, 3 * PI, 3, 8, 4 * PI, 5 * PI, 75, 0.5, 5 * PI, 20 / 60 * 2 * PI * 15, PI / 4 * 16, 2 * 180 / PI, 6 * PI / (PI / 3) + 6 * PI / (PI / 4), 0.5 * PI / (PI / 4)],
  sector: [10 * 6 / 2, 2 * 16 / 2, PI / 3 * 36 / 2, PI * 100 / 4, 2 * 5 + 7, PI / 6 * 144 / 2, 4 * PI / 5 * 625 / 2, 5, 2 * 27 / 36, 2 * 32 * PI / 8,
    2 * 10 + 1.5 * 10, 1, null, Math.round(PI / 5 * 400 / 2 * 50 / PI * 3.14), 5 * 9],
  'trapecio-circular': [2 * (25 - 9) / 2, (6 + 10) / 2 * 4, PI / 2 * (36 - 4) / 2, PI / 3 * 9, PI * (16 - 4) / 2, PI / 3 * 27 / 2, PI / 4 * 48 / 2, (6 * PI - 4 * PI) / 4, PI / 2 * (2500 - 400) / 2, Math.sqrt(16 + 20) - 4,
    9 - 1, 2 * PI / 3 * (3600 - 400) / 2, Math.sqrt(32), 2 * 3 + 2 * 7 + 2 * 4, (5 * PI - 2 * PI) / 6 * 180 / PI],
  'vueltas-rueda': [2 * PI * 0.3, 10 * PI / (2 * PI * 0.25), 4 * PI / (2 * PI * 0.4), 3 * 2 * PI, 4.8 * PI / 8 / (2 * PI), 70 * PI / (2 * PI * 0.35), 900 / 360 * 2 * PI * 0.2, (6 + 2) / 2, (6 - 2) / 2, 40 * 0.5,
    10 / (1 / (2 * PI * 0.4) - 1 / (2 * PI * 0.6)), (3 + 1) / 1, (1 - 0.25) / 0.25, 2.2, 3 * PI / 0.3],
  'faja-y-eje': [10 / 4, 20 * 6 / 15, 90 / 360, null, 60 * 12 / 4, 80 * PI, 240 * 9 / 6 / 360, 10 / 5, 6 * PI / 4 * 12, 3 * 2 * PI * 5,
    4 * 30 / 12, 120 * 6 / 4, 2 * 30 / 60 * 2 * PI * 10, 10 / 4 * 2 * PI * 0.3, 50 * PI / 10 * 25],
};
// El valor de cada alternativa equivocada de nivel 3, rehecho por su error (en el orden de los ejemplos 11 a 15).
const ALTERNATIVAS = {
  arco: [[20 * 15, PI / 3 * 15, 2 * PI / 3 * 30, 2 * PI * 15], [50 * PI / 180 * 16, 50 * 16, PI / 4 * 32, PI / 4 * 8], [2, 360, 120, 180 / PI],
    [6 * PI / (PI / 3), 6 * PI / (PI / 4), 6 * PI / 60 + 6 * PI / 45, 2 * 18 + 2 * 24], [0.5 * PI / (PI / 8), 0.5 * PI * PI / 4, 0.5 * PI / 45, (PI / 4) / (0.5 * PI)]],
  sector: [[15, 20, 25, 2 * 50 + 1.5 * 50], null, null, [Math.round(PI / 5 * 20 / 2 * 50 / PI * 3.14), 80 * 3.14 * 50, 4 * 3.14 * 50, 36 * 400 / 2 * 50], [15, 135, 25]],
  'trapecio-circular': [[3 - 1, 9, 3, 9 + 1], [2 * PI / 3 * 1600 / 2, 2 * PI / 3 * 3600 / 2, 2 * PI / 3 * 3200, 2 * PI / 3 * 400 / 2], [8, 32, 4, 16], [6 + 14, 6 + 14 + 4, 6 + 14 + 3 + 7, 14], [7 * PI / 6 * 180 / PI, 5 * PI / 6 * 180 / PI, 3 * PI / 12 * 180 / PI, 3 * PI / 3 * 180 / PI]],
  'vueltas-rueda': [[10 / (1 / (PI * 0.4) - 1 / (PI * 0.6)), 2 * PI * 10 * 0.2, 2 * PI * 0.4 * 10, 10 / (1 / (2 * PI * 0.8) - 1 / (2 * PI * 1.2))], [3, 2, 8], [4, 5, 6],
    [1.1, 0.7, 4.4, 0.35], [10, 5 * PI, 5]],
  'faja-y-eje': [[4 * 12 / 30, 4, 4 * 30], null, [2 * 2 * PI * 10, 1 * 2 * PI * 60, PI * 10, 4 * 2 * PI * 10], [0.6 * PI, 0.4 * 2 * PI * 0.3, 2.5 * 2 * PI * 0.6, 2.5 * PI * 0.3], [50 * PI, 50 * PI * 10 / 25, 5 * PI, 5 * PI * 50]],
};
// La parte numérica del valor de una alternativa (sin «S/», unidades ni palabras).
const valorAlt = t => numDe(String(t).replace(/^≈\s*/, '').replace(/^S\/\s*/, '').replace(/\s(?=\d{3}\b)/g, '').replace(/,\s?(horario|antihorario)$/, '').replace(/ de vuelta$/, '').replace(/ vueltas?$/, ''));

test('ejemplos: 5 por nivel con datos; la respuesta cuadra con la cuenta aparte; la figura no trae el resultado', () => {
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === nv).length, 5, `${i.id}: nivel ${nv}`);
    i.ejemplos.forEach((e, k) => {
      const nombre = `${i.id} ejemplo ${k + 1} («${e.titulo}»)`;
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${nombre}: sin datos`);
      const esp = RESPUESTAS[i.id][k];
      if (esp !== null) {
        const r = plano(e.respuesta).replace(/^[A-E], /, '').replace(/^(.*?)[:;].*$/, '$1').replace(/^S\/ /, '');
        assert.ok(cerca(valorAlt(r), esp, 0.006), `${nombre}: la respuesta «${plano(e.respuesta)}» y aparte ${esp}`);
      }
      if (e.figura) {
        const enFig = Teoria.numerosDe(Teoria.textoSVG(svgDe(e.figura))), dados = Teoria.numerosDe(plano([e.enunciado, e.datos]));
        for (const x of enFig) assert.ok(dados.has(x), `${nombre}: la figura muestra ${x}, que no está en el enunciado ni en los datos`);
      }
    });
  }
});

test('ejemplos de nivel 3: la letra de la correcta, cada alternativa equivocada con el valor de su error y las letras repartidas', () => {
  const letras = [];
  for (const i of def.ideas) {
    i.ejemplos.filter(e => e.nivel === 3).forEach((e, k) => {
      assert.ok(e.alternativas && e.alternativas.length >= 4, e.titulo);
      assert.equal(new Set(e.alternativas).size, e.alternativas.length, `${e.titulo}: alternativas repetidas`);
      const r = plano(e.respuesta), m = /^([A-E]), /.exec(r);
      assert.ok(m, `${e.titulo}: la respuesta empieza por su letra`);
      const kk = 'ABCDE'.indexOf(m[1]);
      letras.push(m[1]);
      const esp = RESPUESTAS[i.id][10 + k];
      if (esp !== null) assert.ok(cerca(valorAlt(e.alternativas[kk]), esp, 0.006), `${e.titulo}: la alternativa ${m[1]} no es la respuesta`);
      const errs = (ALTERNATIVAS[i.id] || [])[k];
      if (errs) {
        const otras = e.alternativas.filter((_, j) => j !== kk).map(valorAlt);
        for (const v of errs) assert.ok(otras.some(o => cerca(o, v, 0.01)), `${e.titulo}: ninguna alternativa vale ${v}`);
        assert.equal(otras.length, errs.length, `${e.titulo}: cada alternativa equivocada tiene su error`);
      }
      // El resuelto nombra cada alternativa equivocada por su letra.
      const sol = JSON.stringify(e.solucion);
      for (let j = 0; j < e.alternativas.length; j++) if (j !== kk) assert.ok(sol.includes(`"negrita":["${'ABCDE'[j]}"]`), `${e.titulo}: el resuelto no explica la ${'ABCDE'[j]}`);
    });
  }
  const cuenta = l => letras.filter(x => x === l).length;
  for (const l of 'ABCDE') assert.ok(cuenta(l) >= 3 && cuenta(l) <= 7, `la letra ${l} sale ${cuenta(l)} veces de 25: ${letras.join('')}`);
});

test('nada prestado ni adelantado: sin razones trigonométricas ni velocidades, y sin R ni L como letras', () => {
  for (const i of def.ideas) {
    const txt = plano(todo(i).textos.flat(Infinity).filter(x => x !== undefined && x !== null));
    assert.ok(!/\b(sen|cos|tan)\b|velocidad|rapidez|ω/.test(txt), `${i.id}: usa razones trigonométricas o velocidades`);
    assert.ok(!/\b[RL]\s?=|\bR₂|\bL₂/.test(txt), `${i.id}: usa R o L como letra`);
  }
});

test('glosario: «eje común» sin simple (la predicción del eje); los términos estrenados por idea', () => {
  const eje = def.glosario.find(g => g.termino === 'eje común');
  assert.ok(eje && !eje.simple && !/mismo ángulo|giran juntas/.test(eje.def + eje.ejemplos.join(' ')));
  const por = Glosario.porIdea(def).map(es => es.filter(e => e.simple).map(e => e.termino));
  assert.deepEqual(por, [['longitud de arco', 'ángulo central'], ['sector circular', 'centímetro cuadrado'], ['trapecio circular', 'semisuma'], ['número de vueltas', 'rodar sin deslizar'], ['faja', 'engranaje']]);
});

// ---------------------------------------------------------------------------------------------------------------------
// Correcciones del cierre (auditoría y lectores en frío, 19 nov; rutinas/auditoria/trigonometria.longitud-de-arco-y-sector.md).
// Cada prueba falla con la versión de antes.
// ---------------------------------------------------------------------------------------------------------------------
const NO_ESC = /El dibujo no está a escala\./;
const datosFig = f => (f && (f.datos || f)) || null;
const rotDe = f => (datosFig(f) && datosFig(f).rot) || {};
// El ángulo pedido en grados, desde la respuesta («135°», «1,5 rad», «π/2 rad»).
const gradosDe = t => (/rad/.test(t) ? num(t.replace(/\s*rad$/, '')) * 180 / PI : num(t.replace('°', '')));

test('cierre: una figura que deja medir lo que se pide no lo dibuja con su medida, y dice «El dibujo no está a escala»', () => {
  // Ejemplos: un ángulo con «?», un ancho h con «?» o lo que avanza una rueda con «?» llevan el aviso.
  for (const i of def.ideas) i.ejemplos.forEach((e, k) => {
    if (!e.figura) return;
    const ro = rotDe(e.figura), d = datosFig(e.figura), nombre = `${i.id} ejemplo ${k + 1}`;
    const pide = Object.entries(ro).filter(([, v]) => typeof v === 'string' && /\?/.test(v)).map(([c]) => c);
    if (pide.some(c => c === 't' || c === 'h' || (d.objeto === 'rueda' && c === 'd'))) assert.match(plano(e.enunciado), NO_ESC, `${nombre}: sin el aviso`);
    if (pide.includes('t')) {
      const r = plano(e.respuesta).replace(/^.*= /, ''), g = gradosDe(r), dib = d.objeto === 'columpio' ? d.t * 180 / PI : d.g;
      assert.ok(Math.abs(dib - g) >= 15, `${nombre}: el ángulo pedido (${g}°) está dibujado con ${dib}°`);
    }
  });
  // «Ahora tú»: el ángulo que se pide, dibujado lejos de su medida, y con el aviso.
  for (const i of def.ideas) for (let sem = 0; sem < SEMILLAS; sem++) {
    const c = i.ahoraTu.generar(sem);
    if (!c.dibujo || !/\?/.test(String(rotDe(c.dibujo).t || ''))) continue;
    const g = gradosDe(c.opciones.find(o => o.correcta).texto);
    assert.match(plano(c.pregunta), NO_ESC, `${i.id} #${sem}`);
    assert.ok(Math.abs(datosFig(c.dibujo).g - g) >= 15, `${i.id} #${sem}: ${g}° dibujado con ${datosFig(c.dibujo).g}°`);
  }
  // «De un extremo al otro»: el columpio dibujaba solo un lado del vaivén (la alternativa de 4 m).
  assert.ok(!idea('arco').ejemplos.find(e => e.titulo === 'De un extremo al otro').figura);
});

test('cierre: las lecturas del juego no escriben con «=» un número redondeado (con π, o las vueltas del piñón)', () => {
  for (const v of Teoria.grilla(idea('vueltas-rueda').juega.controles)) {
    const t = plano(idea('vueltas-rueda').juega.lectura(v)), m = /d = ([\d,]+)π m/.exec(t);
    assert.ok(m && cerca(num(m[1]), v.n * 2 * v.r, 1e-12), `rueda ${JSON.stringify(v)}: ${t}`);
  }
  for (const v of Teoria.grilla(idea('faja-y-eje').juega.controles)) {
    const t = plano(idea('faja-y-eje').juega.lectura(v)), m = /= ([\d,]+)$/.exec(t);
    assert.ok(m && cerca(num(m[1]), v.n1 * 10 / v.r2, 1e-12), `faja ${JSON.stringify(v)}: ${t}`);
  }
});

test('cierre: rótulos en su sitio (limpiaparabrisas, abanicos juntos y rueda de atrás)', () => {
  const P = Kit.piezas['trig-arco'], dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const caja = (g, re) => g.cajas.find(c => re.test(c.texto));
  // El limpiaparabrisas: r₂ mide el brazo entero (una cota, con su rótulo hacia la mitad del brazo); s₁ junto al arco de
  // adentro, no al de afuera.
  const lim = [idea('trapecio-circular').predice.dibujo, { datos: idea('trapecio-circular').mira.datos, estado: { final: true } }]
    .concat(Teoria.grilla(idea('trapecio-circular').juega.controles).map(v => idea('trapecio-circular').juega.dibujo(v)));
  for (const f of lim) {
    const g = P.geometria(f.datos, f.estado || {}), r2 = caja(g, /^r₂/), s1 = caja(g, /^s₁/);
    if (r2) {
      const a1 = 90 + (f.datos.g || 120) / 2, u = [Math.cos(a1 * PI / 180), -Math.sin(a1 * PI / 180)];
      const largo = (r2.x - g.centro[0]) * u[0] + (r2.y - g.centro[1]) * u[1];
      assert.ok(largo >= 0.4 * g.R2, `r₂ junto al primer tramo del brazo (a ${largo.toFixed(0)} de ${g.R2.toFixed(0)})`);
    }
    if (s1) { const d = dist([s1.x, s1.y], g.centro); assert.ok(Math.abs(d - g.R1) < Math.abs(d - g.R2), `s₁ más cerca del arco de afuera (${d.toFixed(0)}; R1 ${g.R1}, R2 ${g.R2})`); }
  }
  // Los dos abanicos de Predice y Mira: el arco y el área del chico van dentro de su papel.
  for (const f of [idea('sector').predice.revelar, { datos: idea('sector').mira.datos, estado: { final: true } }]) {
    const g = P.geometria(f.datos, f.estado || {});
    for (const c of g.cajas.filter(c => /^(s = )?10π cm$|^(A = )?100π cm²$/.test(c.texto))) assert.ok(dist([c.x, c.y], g.centro) < g.R, `«${c.texto}» fuera del abanico chico`);
  }
  // La bici con la rueda de atrás: n₂ junto al piñón, n₃ arriba de la rueda.
  const b = P.geometria(idea('faja-y-eje').predice.revelar.datos, {}), n2 = caja(b, /^n₂/), n3 = caja(b, /^n₃/);
  assert.ok(n3.y < n2.y, 'n₃ debajo de n₂');
  // La regla del sector y la del trapecio tienen figura propia (la de Mira apilaba los rótulos).
  assert.ok(idea('sector').regla.dibujo && idea('trapecio-circular').regla.dibujo);
});

test('cierre: «Ahora tú» no repite un ejemplo, ni con otro objeto (400 semillas)', () => {
  const ya = {
    arco: [/minutero de un reloj mide 15 cm\. ¿Cuánto recorre su punta en 20 minutos/, /de 16 cm de radio, un ángulo central mide 50ᵍ/],
    sector: [/borde curvo de 10 cm y lados rectos de 6 cm/, /tiene 75 m² de área y un ángulo central de 1,5 rad/, /es el triple de su radio/],
    'trapecio-circular': [/miden s[₁1] = 6 cm y s[₂2] = 10 cm, y su ancho es h = 4 cm\. ¿Cuánto mide su área/, /r[₂2] es el triple de r[₁1]/, /mide 50 cm, y su jebe, de 30 cm, va al final del brazo\. Si barre 90°/],
    'vueltas-rueda': [/rueda de 2 cm de radio rueda sin deslizar por (fuera|dentro) de (otra rueda fija|un aro fijo) de 6 cm/, /tienen 0,4 m de radio y las de atrás, 0,6 m\. En un tramo, cada rueda de adelante da 10 vueltas/, /da 8 vueltas sin deslizar, y su centro avanza 4,8π m/],
    'faja-y-eje': [/rueda de 30 cm que, con una faja, mueve otra de 60 cm; en su eje, un tambor de 10 cm .* Con 2 vueltas/],
  };
  for (const i of def.ideas) for (let sem = 0; sem < SEMILLAS; sem++) {
    const q = plano(i.ahoraTu.generar(sem).pregunta);
    for (const re of ya[i.id]) assert.ok(!re.test(q), `${i.id} #${sem} repite un ejemplo: ${q}`);
    assert.ok(!/\bcarro\b/.test(q), `${i.id} #${sem}: un carro con ruedas de 1 m de radio`);
  }
});

test('cierre: textos que el lector en frío o el auditor señalaron', () => {
  // SEC-MITAD (radio desde el área) vale √(r²/2): el error es olvidar el 2, no «pasarlo dividiendo».
  for (let sem = 1; sem < SEMILLAS; sem += 3) {
    const c = idea('sector').ahoraTu.generar(sem), o = c.opciones.find(x => x.id === 'mitad');
    if (o && /radio\?/.test(plano(c.pregunta))) assert.ok(!/dividiendo/.test(o.siFuera), o.siFuera);
  }
  assert.ok(!/cuadrados/.test(idea('trapecio-circular').ahoraTu.voz), 'la voz de «Ahora tú» habla de cuadrados en problemas de arcos');
  assert.ok(!/fij|barra|junt/.test(idea('faja-y-eje').predice.voz), 'la voz de Predice casi da la respuesta');
  assert.ok(/engranaje/.test(idea('faja-y-eje').ahoraTu.voz));
  const nv = def.glosario.find(g => g.termino === 'número de vueltas');
  assert.ok(!/\b2 vueltas\b/.test(nv.def + nv.ejemplos.join(' ')), 'el glosario dice «2 vueltas», la respuesta de la moneda');
  const ej3 = idea('faja-y-eje').ejemplos[2];
  assert.ok(!/90°/.test(plano(ej3.respuesta)), 'el dato del eje común era la respuesta');
  assert.match(plano(idea('vueltas-rueda').juega.mision.texto), /una sola vuelta/);
  assert.match(plano(idea('vueltas-rueda').regla.texto), /ángulo θ/);
  assert.ok(!/\buna vuelta\b/.test(plano(idea('vueltas-rueda').resuelve.generar(0).dibujo.datos.rot.d)), 'la huella (d, turquesa) se rotulaba como una vuelta (n)');
  // Ningún número de un ejemplo se separa de su unidad al partir el renglón.
  for (const i of def.ideas) for (const e of i.ejemplos) {
    const crudo = x => (typeof x === 'string' ? x : Array.isArray(x) ? x.map(crudo).join('') : x && typeof x.t === 'string' ? x.t : '');
    const t = crudo([e.enunciado, e.solucion.map(p => p.texto || '')]);
    assert.ok(!/[\dπ] (cm²|m²|cm|m|rad)(?![a-zñ])/.test(t), `${i.id} «${e.titulo}»: número y unidad separables`);
  }
});
