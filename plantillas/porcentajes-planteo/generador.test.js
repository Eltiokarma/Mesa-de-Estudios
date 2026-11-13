// Pruebas del generador de tanto por ciento, razones y conjuntos en problemas de planteo:
// casos.json (para verificar aparte, a ciegas), un recálculo independiente en cada uno de 600
// problemas y pruebas de propiedades (tipos, forma de las alternativas, datos creíbles, papel.json).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const cerca = (a, b) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

// ---------- conjuntos: se evalúan con conjuntos de verdad ----------
// Un elemento por cada región que las condiciones permiten (8 regiones posibles de tres conjuntos).
function mundo(condiciones) {
  const U = [];
  for (let at = 0; at < 8; at++) {
    const en = { A: !!(at & 1), B: !!(at & 2), C: !!(at & 4) };
    const ok = condiciones.every(([t, x, y]) => (t === 'sub' ? !en[x] || en[y] : !(en[x] && en[y])));
    if (ok) U.push({ id: at, ...en });
  }
  const S = l => new Set(U.filter(e => e[l]).map(e => e.id));
  return { U: new Set(U.map(e => e.id)), A: S('A'), B: S('B'), C: S('C') };
}
const union = (x, y) => new Set([...x, ...y]);
const inter = (x, y) => new Set([...x].filter(e => y.has(e)));
const menos = (x, y) => new Set([...x].filter(e => !y.has(e)));
function evaluaArbol(e, m) {
  if (typeof e === 'string') return e === 'U' ? m.U : e === '∅' ? new Set() : m[e];
  if (e[0] === "'") return menos(m.U, evaluaArbol(e[1], m));
  const x = evaluaArbol(e[1], m), y = evaluaArbol(e[2], m);
  return e[0] === '∪' ? union(x, y) : e[0] === '∩' ? inter(x, y) : menos(x, y);
}
// Lee el texto de una alternativa («(A ∪ B') − C», «C'», «∅») y lo evalúa.
function evaluaTexto(t, m) {
  const tk = t.replace(/\s+/g, '').split('');
  let i = 0;
  const termino = () => {
    let r;
    if (tk[i] === '(') { i++; r = expr(); assert.equal(tk[i++], ')', `paréntesis en «${t}»`); }
    else { const c = tk[i++]; assert.ok('ABCU∅'.includes(c), `símbolo raro «${c}» en «${t}»`); r = c === 'U' ? m.U : c === '∅' ? new Set() : m[c]; }
    while (tk[i] === "'") { i++; r = menos(m.U, r); }
    return r;
  };
  const expr = () => {
    let r = termino();
    while (i < tk.length && '∪∩−'.includes(tk[i])) {
      const op = tk[i++], y = termino();
      r = op === '∪' ? union(r, y) : op === '∩' ? inter(r, y) : menos(r, y);
    }
    return r;
  };
  const r = expr();
  assert.equal(i, tk.length, `sobra texto en «${t}»`);
  return r;
}
const igualSet = (x, y) => x.size === y.size && [...x].every(e => y.has(e));

// ---------- recálculo independiente, por tipo ----------
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'dimensiones': {
      // Medidas concretas (60, 40 y 30 cm) que cambian una por una.
      const base = [60, 40, 30].slice(0, d.cambios.length);
      const nuevo = base.map((x, i) => { const c = d.cambios[i]; return c.p !== undefined ? x + x * c.p / 100 : x + x * c.n / c.d; });
      const prod = a => a.reduce((s, x) => s * x, 1);
      return (prod(nuevo) - prod(base)) / prod(base) * 100;
    }
    case 'partes': {
      const T = d.total, montos = [T * d.a[0] / d.a[1], T * d.b / 100, T * d.c / 100];
      const resto = T - montos.reduce((s, x) => s + x, 0);
      return d.sub === 'del-total' ? resto / T * 100 : resto / (T - resto) * 100;
    }
    case 'sistema': {
      // Fuerza bruta en céntimos: todos los pares de precios enteros hasta S/ 400.
      const sol = [];
      for (let x = 1; x <= 400; x++) for (let y = 1; y <= 400; y++)
        if ((100 - d.a) * x + (100 - d.b) * y === 100 * d.T1 && (100 - d.b) * x + (100 - d.a) * y === 100 * d.T2) sol.push([x, y]);
      assert.equal(sol.length, 1);
      return d.pideSegundo ? sol[0][1] : sol[0][0];
    }
    case 'tramos': {
      if (d.sub === 'venta-costo') {
        // Con un precio concreto de 100 (venta o costo).
        if (d.dir === 'venta-a-costo') { const g = d.r, costo = 100 - g; return g / costo * 100; }
        const g = d.r, venta = 100 + g; return g / venta * 100;
      }
      // Se prueban todos los costos enteros hasta S/ 20 000, vendiendo parte por parte.
      for (let C = 1; C <= 20000; C++) {
        const p1 = C * d.f1[0] / d.f1[1], resto = C - p1, p2 = resto * d.f2[0] / d.f2[1], p3 = resto - p2;
        const g = p1 * d.r[0] / 100 + p2 * d.r[1] / 100 + p3 * d.r[2] / 100;
        if (Math.abs(g - d.G) < 1e-6) return C;
      }
      return NaN;
    }
    case 'encadenados': {
      for (let A = 1; A <= 5000; A++) {
        const B = A * d.p / 100, F = B * d.q / 100;
        if (Math.abs(A - F - d.D) < 1e-9) return A * (100 - d.s[0]) / 100 + B * (100 - d.s[1]) / 100 + F * (100 - d.s[2]) / 100;
      }
      return NaN;
    }
    case 'doble-entrada': {
      if (d.sub === 'tabla') {
        // Tabla de doble entrada con conteos.
        const auto = d.N * d.p / 100, mujAuto = auto * d.q / 100, varAuto = auto - mujAuto;
        const varones = d.N * d.v / 100, tabla = { varNo: varones - varAuto, no: d.N - auto };
        return tabla.varNo / tabla.no * 100;
      }
      const varones = d.N * d.a[0] / d.a[1], varFiebre = varones * d.b[0] / d.b[1], fiebre = d.N * d.c[0] / d.c[1];
      const tabla = [[varFiebre, varones - varFiebre], [fiebre - varFiebre, d.N - varones - (fiebre - varFiebre)]];
      assert.equal(tabla.flat().reduce((s, x) => s + x, 0), d.N);
      return tabla[1][1];
    }
    case 'sobrante': {
      // Se llenan los vasos uno por uno con lo que sobra, en cm³.
      let sobra = d.L * 1000 * (100 - d.s1) / 100 + d.L * 1000 * (100 - d.s2) / 100, n = 0;
      while (sobra >= d.vaso - 1e-9) { sobra -= d.vaso; n++; }
      return n;
    }
    case 'extracciones': {
      if (d.sub === 'sucesivas') {
        let puro = d.V, total = d.V;
        for (let k = 0; k < d.n; k++) { const sale = total * d.f[0] / d.f[1]; puro -= sale * (puro / total); }
        return puro;
      }
      const x = d.E * d.a / (d.a + d.b) + d.E * d.c / (d.c + d.d), y = d.E * d.b / (d.a + d.b) + d.E * d.d / (d.c + d.d);
      const g = gcd(x, y);
      return `razon:${x / g}/${y / g}`;
    }
    case 'afin': // interpolación de Lagrange por los dos puntos
      return d.C1 * (d.t3 - d.t2) / (d.t1 - d.t2) + d.C2 * (d.t3 - d.t1) / (d.t2 - d.t1);
    case 'llegadas': {
      const sols = [];
      if (d.sub === 'parejas') {
        for (let H = 1; H <= 400; H++) for (let M = 1; M <= 400; M++)
          if (H * d.b === M * d.a && (H - d.k) * d.d === (M - d.k) * d.c) sols.push(H + M);
      } else {
        for (let H = 1; H <= 400; H++) for (let M = 1; M <= 400; M++)
          if (H * d.d === (M + d.k1) * d.c && (H - d.k2) * d.f === (M + d.k1 - d.k2) * d.e) sols.push(d.pideH ? H : M);
      }
      assert.equal(sols.length, 1, `llegadas: ${sols.length} soluciones`);
      return sols[0];
    }
    case 'conjuntos': {
      const m = mundo(d.condiciones);
      const correcta = p.alternativas.find(a => a.correcta);
      return igualSet(evaluaTexto(correcta.texto, m), evaluaArbol(d.expr, m)) ? p.respuesta.valor : 'no-coincide';
    }
  }
  throw new Error('tipo desconocido ' + d.tipo);
}

probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return typeof r === 'number' && cerca(r, p.respuesta.valor) ? p.respuesta.valor : r;
}, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const muchos = Array.from({ length: 800 }, (_, s) => gen.generar(s));

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set(muchos.map(p => p._datos.tipo + '/' + (p._datos.sub || '')));
  assert.deepEqual([...vistos].sort(), ['afin/', 'conjuntos/', 'dimensiones/area', 'dimensiones/volumen', 'doble-entrada/carroll', 'doble-entrada/tabla',
    'encadenados/', 'extracciones/juntar', 'extracciones/sucesivas', 'llegadas/parejas', 'llegadas/sucesivas', 'partes/de-los-otros', 'partes/del-total',
    'sistema/', 'sobrante/', 'tramos/partes', 'tramos/venta-costo']);
});

test('las alternativas tienen la misma forma', () => {
  const formas = {
    soles: /^S\/ \d{1,3}( \d{3})*(,\d{1,2})?$/, '%': /^\d{1,3}( \d{3})*(,\d{1,2})? %$/, kg: /^\d{1,3}( \d{3})*(,\d{1,2})? kg$/, L: /^\d{1,3}( \d{3})*(,\d{1,2})? L$/,
    personas: /^\d{1,3}( \d{3})*$/, vasos: /^\d+$/,
  };
  for (const p of muchos) {
    const d = p._datos, alt = p.alternativas.map(a => a.texto);
    let re = formas[p.respuesta.unidad];
    if (d.tipo === 'dimensiones') re = /^(aumenta en|disminuye en) \d{1,3}( \d{3})*(,\d{1,2})? %$|^no varía$/;
    if (d.tipo === 'extracciones' && d.sub === 'juntar') re = /^\d+ : \d+$/;
    if (d.tipo === 'conjuntos') { const m = mundo(d.condiciones); for (const t of alt) evaluaTexto(t, m); continue; }
    assert.ok(re, `${p.id}: sin forma para la unidad «${p.respuesta.unidad}»`);
    for (const t of alt) assert.match(t, re, `${p.id}: «${t}» no tiene la forma de las demás (${alt.join(' | ')})`);
  }
});

test('ningún distractor da la respuesta correcta', () => {
  for (const p of muchos) {
    const d = p._datos, mal = p.alternativas.filter(a => !a.correcta);
    if (d.tipo === 'conjuntos') {
      const m = mundo(d.condiciones), bien = evaluaArbol(d.expr, m);
      for (const a of mal) assert.ok(!igualSet(evaluaTexto(a.texto, m), bien), `${p.id}: «${a.texto}» también es igual a la expresión`);
    } else if (typeof p.respuesta.valor === 'string') {
      for (const a of mal) assert.notEqual(a.valor, p.respuesta.valor);
    } else {
      const r = recalcular(p);
      for (const a of mal) assert.ok(!cerca(a.valor, r), `${p.id}: ${a.texto} (${a.error.id}) da la correcta`);
    }
  }
});

test('los datos son creíbles', () => {
  for (const p of muchos) {
    const d = p._datos, r = p.respuesta.valor;
    if (p.respuesta.unidad === 'soles') assert.ok(r > 0 && r <= 10000, `${p.id}: S/ ${r}`);
    if (p.respuesta.unidad === 'personas') assert.ok(Number.isInteger(r) && r > 0 && r <= 1000, `${p.id}: ${r} personas`);
    if (p.respuesta.unidad === 'vasos') assert.ok(r >= 2 && r <= 60, `${p.id}: ${r} vasos`);
    if (p.respuesta.unidad === 'kg') assert.ok(r > 0 && r <= 3000, `${p.id}: ${r} kg`);
    if (p.respuesta.unidad === '%' && d.tipo !== 'dimensiones') assert.ok(r > 0 && r < 1000, `${p.id}: ${r} %`);
    if (d.tipo === 'dimensiones') assert.ok(r > -100 && r !== 0, `${p.id}: ${r} %`);
    if (d.tipo === 'llegadas' && d.sub === 'sucesivas') assert.ok(Math.max(d.c, d.d, d.e, d.f) <= 12);
    if (d.tipo === 'extracciones' && d.sub === 'sucesivas') assert.ok(d.V <= 400 && p.respuesta.valor > 0);
    if (d.tipo === 'doble-entrada' && d.sub === 'carroll') assert.ok(/…/.test(JSON.stringify(p.enunciado)), `${p.id}: Carroll sin periódico`);
  }
});

test('ningún texto trae «undefined», «NaN», «−−» ni un guion como signo menos', () => {
  for (const p of muchos) {
    const todo = JSON.stringify([p.enunciado, p.pregunta, p.solucion, p.alternativas.map(a => [a.texto, a.error && a.error.explicacion])]);
    for (const malo of ['undefined', 'NaN', '−−', 'Infinity', '+ −', '- ', '[object']) assert.ok(!todo.includes(malo), `${p.id}: trae «${malo}»`);
    assert.ok(!/\d-\d|\s-\d/.test(todo), `${p.id}: guion como signo menos`);
    for (const k of Object.keys(p.variables)) assert.ok(['o', 'i', 'h', 'd'].includes(p.variables[k].color));
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `${p.id}: dos variables con el mismo color`);
    const usadas = JSON.stringify([p.enunciado, p.pregunta, p.solucion]).match(/"v":"[^"]+"/g) || [];
    for (const u of usadas) assert.ok(p.variables[u.slice(5, -1)], `${p.id}: ${u} sin variable`);
  }
});

test('porcentajes periódicos bien escritos', () => {
  assert.equal(gen._pctPeriodico({ n: 5, d: 12 }), '41,666… %');
  assert.equal(gen._pctPeriodico({ n: 1, d: 3 }), '33,333… %');
  assert.equal(gen._pctPeriodico({ n: 5, d: 18 }), '27,777… %');
  assert.equal(gen._pctPeriodico({ n: 3, d: 8 }), '37,5 %');
  assert.equal(gen._pctPeriodico({ n: 3, d: 11 }), '27,2727… %');
  assert.equal(gen._pctPeriodico({ n: 1, d: 4 }), '25 %');
});

// ---------- papel.json: formato y respuestas recalculadas ----------
test('papel.json: entre 5 y 10 problemas con sus campos', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    for (const k of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(q[k], `${q.id}: falta ${k}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel));
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2);
  }
});

test('papel.json: cada respuesta se recalcula', () => {
  const r = Object.fromEntries(papel.problemas.map(q => [q.id, q.respuesta]));
  // p1: caja +20 %, −20 %, +1/4.
  const v1 = recalcular({ _datos: { tipo: 'dimensiones', cambios: [{ p: 20 }, { p: -20 }, { n: 1, d: 4 }] } });
  assert.ok(cerca(v1, 20)); assert.match(r.p1, /Aumenta en 20 %/);
  // p2: S/ 3000; 1/5, 35 %, 0,25.
  assert.ok(cerca(recalcular({ _datos: { tipo: 'partes', sub: 'del-total', total: 3000, a: [1, 5], b: 35, c: 25 } }), 20));
  assert.match(r.p2, /20 %.*S\/ 600/);
  // p3: descuentos cruzados.
  assert.equal(recalcular({ _datos: { tipo: 'sistema', a: 20, b: 10, T1: 112, T2: 109, pideSegundo: true } }), 80); assert.equal(r.p3, 'S/ 80.');
  // p4: lote por partes.
  assert.equal(recalcular({ _datos: { tipo: 'tramos', sub: 'partes', f1: [1, 3], f2: [1, 2], r: [20, -10, 30], G: 160 } }), 1200); assert.equal(r.p4, 'S/ 1200.');
  // p5: encadenados.
  assert.ok(cerca(recalcular({ _datos: { tipo: 'encadenados', p: 80, q: 75, D: 120, s: [25, 50, 20] } }), 489)); assert.equal(r.p5, '489 kg.');
  // p6: Carroll con periódicos.
  assert.equal(recalcular({ _datos: { tipo: 'doble-entrada', sub: 'carroll', N: 360, a: [5, 12], b: [1, 3], c: [5, 18] } }), 160); assert.equal(r.p6, '160.');
  // p7: extracciones sucesivas.
  assert.ok(cerca(recalcular({ _datos: { tipo: 'extracciones', sub: 'sucesivas', V: 64, f: [1, 4], n: 3 } }), 27)); assert.equal(r.p7, '27 L.');
  // p8: afín.
  assert.ok(cerca(recalcular({ _datos: { tipo: 'afin', t1: 2, C1: 70, t2: 5, C2: 145, t3: 8 } }), 220)); assert.equal(r.p8, 'S/ 220.');
  // p9: parejas.
  assert.equal(recalcular({ _datos: { tipo: 'llegadas', sub: 'parejas', a: 3, b: 2, k: 8, c: 5, d: 3 } }), 80); assert.equal(r.p9, '80 personas.');
  // p10: (A ∪ C) ∩ B con A ⊂ B y B ∩ C = ∅.
  const m = mundo([['sub', 'A', 'B'], ['disj', 'B', 'C']]);
  assert.ok(igualSet(evaluaTexto('(A ∪ C) ∩ B', m), evaluaTexto('A', m))); assert.equal(r.p10, 'A.');
});

// ---------- Escena viva (docs/escena-viva.md): extracciones sucesivas con la barra-porcentaje ----------
const Kit = require('../../nucleo/kit/kit.js');
const barra = require('../../nucleo/kit/piezas/barra-porcentaje.js');
const LT = require('../../nucleo/kit/linea-tiempo.js');
const palabras = x => Kit.plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length; // como herramientas/validar-ejercicios.js

test('escena viva: las extracciones sucesivas traen la barra; su final dibuja la respuesta y se arrastra', () => {
  let vistas = 0;
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (!(d.tipo === 'extracciones' && d.sub === 'sucesivas')) { assert.ok(!p.escena, `${p.id}: escena inesperada`); continue; }
    vistas++;
    assert.equal(p.escena.pieza, 'barra-porcentaje');
    assert.ok(cerca(barra.controles(p.escena.datos).respuesta, p.respuesta.valor), `${p.id}: la barra no da la respuesta`);
    const fin = barra.dibujar(p.escena.datos, LT.estado(p.pasos, p.pasos.length));
    assert.ok(fin.includes(`${Kit.formatear(p.respuesta.valor)} L ✓`), `${p.id}: el final no dibuja la respuesta`);
    assert.ok(!/NaN|undefined|null|Infinity/.test(fin));
    for (const q of p.pasos) assert.ok(palabras(q.texto) <= 14 && q.ecuacion.length, `${p.id}: «${Kit.plano(q.texto)}»`);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `${p.id}: enunciado largo`);
    const r = p.respuesta, c = barra.controles(p.escena.datos).marca;
    assert.equal(r.tipo, 'arrastrar');
    for (const a of p.alternativas) {
      assert.ok(palabras(a.error ? a.error.explicacion : '') <= 20);
      if (a.error) assert.equal(p.fantasmas[a.error.id].marca, a.valor);
      const puesto = Kit.respuesta.ajustar(a.valor, r.paso, c.min, c.max);
      assert.equal(Kit.respuesta.clasificar(puesto, p.alternativas, r.tolerancia), a, `${p.id}: la marca en ${a.texto} no equivale a esa alternativa`);
    }
  }
  assert.ok(vistas > 30, `pocas extracciones sucesivas: ${vistas}`);
});
