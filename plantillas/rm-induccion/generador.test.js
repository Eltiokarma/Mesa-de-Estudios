// Pruebas del generador rm-induccion: casos.json (verificados aparte, scratchpad e8-rm/casos.py), los tipos por idea, los
// Datos de cada tipo y un recálculo independiente en 400 problemas por idea. El recálculo no usa las cuentas del
// generador: arma los fósforos como lados de una cuadrícula, cuenta chapitas casilla por casilla, escribe las filas y las
// listas término por término y multiplica con BigInt.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const primo = x => x > 1 && rango(2, Math.floor(Math.sqrt(x))).every(d => x % d);
function lados(forma, k) {
  const L = new Set(), seg = (a, b) => L.add([a, b].map(p => p.join(',')).sort().join('|'));
  for (let i = 0; i < k; i++) {
    if (forma === 'cuadrado') { seg([i, 0], [i + 1, 0]); seg([i, 1], [i + 1, 1]); seg([i, 0], [i, 1]); seg([i + 1, 0], [i + 1, 1]); }
    if (forma === 'doble') for (const y of [0, 1]) { seg([i, y], [i + 1, y]); seg([i, y + 1], [i + 1, y + 1]); seg([i, y], [i, y + 1]); seg([i + 1, y], [i + 1, y + 1]); }
    if (forma === 'casita') { seg([2 * i, 0], [2 * i + 2, 0]); seg([2 * i, 2], [2 * i + 2, 2]); seg([2 * i, 0], [2 * i, 2]); seg([2 * i + 2, 0], [2 * i + 2, 2]); seg([2 * i, 0], [2 * i + 1, -2]); seg([2 * i + 2, 0], [2 * i + 1, -2]); }
    if (forma === 'triangulo') { const j = Math.floor(i / 2); if (i % 2 === 0) { seg(['b', j], ['b', j + 1]); seg(['b', j], ['a', j]); seg(['a', j], ['b', j + 1]); } else { seg(['a', j], ['a', j + 1]); seg(['a', j], ['b', j + 1]); seg(['a', j + 1], ['b', j + 1]); } }
  }
  return L.size;
}
const chap = (forma, k) => { const [fi, co] = { 'n(n+1)': [k, k + 1], 'n(n+2)': [k, k + 2], '(n+1)(n+1)': [k + 1, k + 1] }[forma]; let c = 0; for (let i = 0; i < fi; i++) for (let j = 0; j < co; j++) c++; return c; };
const lista = (pre, ciclo, k) => { const s = pre.slice(); while (s.length < k) s.push(...ciclo); return s[k - 1]; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'fosforos': return lados(d.forma, d.k);
    case 'fosforos-inverso': return rango(1, 600).find(k => lados(d.forma, k) === d.T);
    case 'fosforos-diferencia': return lados(d.forma, d.b) - lados(d.forma, d.a);
    case 'contraejemplo': return `n${rango(0, 100).find(n => !primo(n * n + n + d.p))}`;
    case 'primer-fallo': return `n${d.forma === 'poli' ? rango(0, 100).find(n => !primo(n * n + n + d.p)) : rango(1, 100).find(n => !primo(6 * n + d.p))}`;
    case 'dos-reglas': { const xs = [d.a, 2 * d.a, 4 * d.a]; return d.regla === 'doble' ? 2 * xs[2] : xs[2] + 3 * d.a; }
    case 'rectangulo': return chap(d.forma, d.k);
    case 'rectangulo-inverso': return rango(1, 200).find(k => chap(d.forma, k) === d.T);
    case 'triangular': return rango(1, d.k).reduce((a, b) => a + b, 0);
    case 'fila-impares': case 'ultimo-impares': {
      let x = 1; const filas = rango(1, d.k).map(i => rango(1, i).map(() => { const y = x; x += 2; return y; }));
      return d.tipo === 'fila-impares' ? filas[d.k - 1].reduce((a, b) => a + b, 0) : filas[d.k - 1][d.k - 1];
    }
    case 'fila-pascal': { let fl = [1]; for (let i = 1; i < d.k; i++) { const g = [1]; for (let j = 1; j < fl.length; j++) g.push(fl[j - 1] + fl[j]); g.push(1); fl = g; } return fl.reduce((a, b) => a + b, 0); }
    case 'cifras-cuadrado': return String(BigInt(String(d.d).repeat(d.n)) ** 2n).split('').reduce((a, c) => a + +c, 0);
    case 'cifras-cantidad': return String(BigInt('9'.repeat(d.n)) ** 2n).length;
    case 'unos-cuadrado': return String(BigInt('1'.repeat(d.n)) ** 2n).split('').reduce((a, c) => a + +c, 0);
    case 'pulsera': return lista([], d.ciclo, d.k);
    case 'bloque': return lista(d.pre, d.bloque, d.k);
    case 'unidades': { const s = [d.a, d.b]; while (s.length < d.N) s.push(s[s.length - 1] * s[s.length - 2] % 10); return s[d.N - 1]; }
  }
  return undefined;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

test('tipos por idea: cada idea da solo sus tipos, con 400 semillas, y el recálculo coincide', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { idea });
      assert.ok(tipos.includes(p._datos.tipo), `${idea} ${s}: ${p._datos.tipo}`);
      assert.equal(p._datos.idea, idea);
      assert.equal(recalcular(p), p.respuesta.valor, `${idea} ${s}`);
      vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), tipos.slice().sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('Datos: lista no vacía, líneas de 22 palabras o menos, sin la respuesta escrita y sin consejos', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), c = p.alternativas.find(a => a.correcta);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${idea} ${s}`);
    for (const l of p.datos) {
      assert.ok((l.match(/[\p{L}\p{N}]+/gu) || []).length <= 22, `${idea} ${s}: ${l}`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(l), l);
      if (typeof c.valor === 'number' && c.valor >= 10) assert.ok(!new RegExp(`(^|[^\\d ])${c.texto.split(' ')[0].replace(/ /g, ' ?')}(?![\\d])`).test(l.replace(/ (?=\d{3})/g, '')), `${idea} ${s}: los datos traen la respuesta: ${l}`);
    }
    const visto = [p.enunciado, p.pregunta].map(plano).join(' ');
    assert.ok(!/\bnull\b|\bNaN\b|\bundefined\b/.test(visto), `${idea} ${s}`);
  }
});

test('las explicaciones de los errores dicen lo que su opción da de verdad (el caso siguiente, el ciclo, el primo)', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const e = a.error.explicacion; let m;
      if ((m = e.match(/Con n = (\d+) sale (\d+), que es primo/))) {
        const fn = d.forma === 'seis' ? n => 6 * n + d.p : n => n * n + n + d.p;
        assert.equal(fn(+m[1]), +m[2], e); assert.ok(primo(+m[2]), e);
      }
      if (a.error.id === 'RMP161-figura-siguiente' && d.tipo === 'fosforos') assert.equal(a.valor, lados(d.forma, d.k + 1));
      if (a.error.id === 'RMP27-una-de-mas' && d.tipo === 'pulsera') assert.equal(a.valor, lista([], d.ciclo, d.k + 1));
      if (a.error.id === 'RMP26-sin-descontar' && d.tipo === 'bloque') assert.equal(a.valor, lista([], d.bloque, d.k));
      if (a.error.id === 'RMP27-uno-de-mas' && d.tipo === 'unidades') assert.equal(a.valor, recalcular({ _datos: Object.assign({}, d, { N: d.N + 1 }) }));
    }
  }
});

for (const c of casos.casos) {
  test(`casos.json: ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, c.opciones);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

// ---- Cierre (20 nov 2026, auditoría: rutinas/auditoria/razonamiento-matematico.razonamiento-inductivo.md) ----
test('cierre: «tampoco sale primo» es verdad en 400 semillas (con 6 × n ± 1, el n siguiente puede dar primo)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'tres-casos-no-prueban' }), d = p._datos;
    if (d.tipo !== 'primer-fallo') continue;
    const fn = d.forma === 'seis' ? n => 6 * n + d.p : n => n * n + n + d.p;
    for (const a of p.alternativas) {
      const m = a.error && a.error.explicacion.match(/Con n = (\d+) tampoco sale primo/);
      if (m) assert.ok(!primo(fn(+m[1])), `${s}: ${a.error.explicacion} (da ${fn(+m[1])})`);
    }
  }
});
test('cierre: la suma que se duplica trae su porqué, y los treses, seises y unos, la forma de su resultado', () => {
  const forma = (d, n) => { const r = (BigInt(String(d).repeat(n)) ** 2n).toString(), u = n - 1;
    return { 3: '1'.repeat(u) + '0' + '8'.repeat(u) + '9', 6: '4'.repeat(u) + '3' + '5'.repeat(u) + '6', 9: '9'.repeat(u) + '8' + '0'.repeat(u) + '1' }[d] === r; };
  for (const d of [3, 6, 9]) for (let n = 2; n <= 60; n++) assert.ok(forma(d, n), `${d} con ${n} cifras`);
  assert.notEqual(BigInt('1'.repeat(10)) ** 2n + '', '12345678910987654321', 'con 10 unos ya hay llevadas');
  for (const idea of ['arreglo-triangular', 'cuenta-larga']) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos, sol = JSON.stringify(p.solucion);
    if (d.tipo === 'fila-pascal') assert.match(sol, /pasa a las dos latas que tiene debajo/);
    if (d.tipo === 'cifras-cuadrado') assert.match(sol, /El resultado tiene/);
    if (d.tipo === 'unos-cuadrado') assert.match(sol, /hasta 9 unos/);
  }
});
test('cierre: «van 1 términos» no sale, y el ejemplo del residuo no es 23 entre 4', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), t = JSON.stringify([p.solucion, p.datos]);
    assert.ok(!/van 1 términos/.test(t) && !/23 entre 4/.test(t), `${idea} ${s}`);
  }
});
