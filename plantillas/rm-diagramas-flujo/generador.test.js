// Pruebas del generador de diagramas de flujo y operadores: las comunes (600 problemas), un recálculo
// independiente (cada diagrama traducido a mano a un bucle de JavaScript desde _datos, sin el intérprete),
// casos.json (verificados aparte, a ciegas), papel.json y propiedades del intérprete y del dibujo.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const primo = n => { if (n < 2) return false; for (let d = 2; d < n; d++) if (n % d === 0) return false; return true; };
const cifras = n => { let s = 0; for (const c of String(n)) s += +c; return s; };
const cumple = (op, x, y) => ({ '>': x > y, '>=': x >= y, '<': x < y, '<=': x <= y })[op];

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'acumulador': {
      const term = k => (d.sub === 'producto' ? k : { k, k2: k * k, '2k+1': 2 * k + 1 }[d.termino]);
      let A = d.sub === 'producto' ? 1 : 0, k = d.k0;
      const paso = () => {
        if (d.orden === 'acum') { A = d.sub === 'producto' ? A * term(k) : A + term(k); k += d.p; }
        else { k += d.p; A = d.sub === 'producto' ? A * term(k) : A + term(k); }
      };
      if (d.forma === 'abajo') { do paso(); while (!cumple(d.op, A, d.L)); }
      else { while (cumple(d.op, k, d.L)) paso(); }
      return d.imprime === 'k' ? k : A;
    }
    case 'contador': {
      const X = { '2n+3': n => 2 * n + 3, '3n-1': n => 3 * n - 1, '5n+2': n => 5 * n + 2, 'n2+1': n => n * n + 1,
        'n2-n': n => n * n - n, '4n+1': n => 4 * n + 1, 'n2+2': n => n * n + 2 }[d.expr];
      const imp = [];
      let n = d.a;
      do { const x = X(n); if (x % d.m === 0) imp.push(x); n += d.p; } while (!cumple(d.opFin, n, d.b));
      return d.pide === 'cuantos' ? imp.length : imp.reduce((s, x) => s + x, 0);
    }
    case 'dos-contadores': {
      let A = 0, B = 0, n = d.a;
      do {
        const si = d.sub === 'primo' ? primo(n) : n % d.d === 0;
        if (si) A += d.sub === 'primo' ? 1 : n; else B += 1;
        n++;
      } while (!cumple(d.opFin, n, d.b));
      return d.imprime === 'B-A' ? B - A : A - B;
    }
    case 'descuentos': {
      // En céntimos, con enteros, para no depender de los decimales.
      let c;
      if (cumple(d.op1, d.P, d.T1)) c = d.P * (100 - d.a) * (100 - d.b) / 100;
      else if (cumple(d.op2, d.P, d.T2)) c = d.P * (100 - d.c);
      else c = d.P * 100;
      return (c + d.E * 100) / 100;
    }
    case 'cifras': {
      const term = k => ({ k2: k * k, k3: k * k * k, kk1: k * (k + 1) })[d.termino];
      let S = 0, k = 1;
      do { if (d.orden === 'acum') { S += term(k); k++; } else { k++; S += term(k); } } while (!(k > d.n));
      if (d.sub === 'una-vez') return cifras(S);
      while (S >= 10) S = cifras(S);
      return S;
    }
    case 'potencias-div': {
      if (d.sub === 'base') {
        let n = d.N, S = 0;
        do {
          if (d.orden === 'acum') { S += n % d.b; n = Math.floor(n / d.b); }
          else { n = Math.floor(n / d.b); S += n % d.b; }
        } while (n !== 0);
        return S;
      }
      let n = d.N, S = 0;
      do { n = n % 2 === 0 ? n / 2 : (d.regla === '3n+1' ? 3 * n + 1 : n + 1); S += n; } while (n !== 1);
      return S;
    }
    case 'operador': {
      const R = { '2a-b': (a, b) => 2 * a - b, 'a2-b': (a, b) => a ** 2 - b, '3a+b': (a, b) => 3 * a + b, 'ab-a': (a, b) => a * b - a,
        'a+2b': (a, b) => a + 2 * b, 'a2+b': (a, b) => a ** 2 + b, '2a+3b': (a, b) => 2 * a + 3 * b, 'a(a-b)': (a, b) => a * (a - b), 'ab+b': (a, b) => a * b + b };
      const o = R[d.regla];
      if (d.forma === 'izq') return o(o(d.x, d.y), d.z);
      if (d.forma === 'der') return o(d.x, o(d.y, d.z));
      return R[d.regla2](o(d.x, d.y), d.z);
    }
  }
  throw new Error('tipo sin recálculo: ' + d.tipo);
}
probarGenerador(gen, { semillas: 600, recalcular: p => { const r = recalcular(p); return Math.abs(r - p.respuesta.valor) < 1e-6 ? p.respuesta.valor : r; } });

const TIPOS = ['acumulador', 'contador', 'dos-contadores', 'descuentos', 'cifras', 'potencias-div', 'operador'];
test('salen los siete tipos en 200 semillas', () => {
  const vistos = new Set(); for (let s = 0; s < 200; s++) vistos.add(gen.generar(s)._datos.tipo);
  assert.deepEqual([...vistos].sort(), [...TIPOS].sort());
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia);
    assert.ok(Math.abs(gen.calc.resolver(c.entrada) - c.esperado.respuesta) <= casos.tolerancia);
  });
}
test('casos.json: dos por tipo y las seis semillas de las pruebas', () => {
  for (const t of TIPOS) assert.ok(casos.casos.filter(c => c.entrada.tipo === t).length >= 2, t);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3']) assert.ok(casos.casos.some(c => c.semilla === s), s);
});

test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) assert.ok(q.id && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
});
for (const q of papel.problemas) test(`papel ${q.id}`, () => {
  for (const vv of q.verificar) {
    const r = gen.calc[vv.fn](...vv.args);
    assert.ok(Math.abs(r - vv.espera) < 1e-9, `${q.id}: ${vv.fn} da ${r}, se esperaba ${vv.espera}`);
    assert.ok(Math.abs(recalcular({ _datos: vv.args[0] }) - vv.espera) < 1e-9, `${q.id}: el recálculo independiente no coincide`);
  }
});

test('el intérprete: una vuelta menos y una más cambian el número de vueltas en uno', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'operador' || d.tipo === 'descuentos') continue;
    const prog = gen.calc.programa(d), b = prog.bucle;
    const k = gen.calc.ejecutar(prog).vueltas[b];
    assert.equal(gen.calc.ejecutar(prog, { delta: -1 }).vueltas[b] || 0, k - 1, `semilla ${s}`);
    assert.ok(gen.calc.ejecutar(prog, { delta: +1 }).vueltas[b] >= k + 1, `semilla ${s}`);
  }
});

test('la figura del diagrama: todos los bloques en el alt y nada de la respuesta en el dibujo', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    if (!p.figura) { assert.equal(p._datos.tipo, 'operador'); continue; }
    const prog = gen.calc.programa(p._datos);
    for (let i = 1; i <= prog.bloques.length; i++) assert.ok(p.figura.alt.includes(`Paso ${i}:`), `semilla ${s}: falta el paso ${i}`);
    assert.ok((p.figura.svg.match(/<(rect|polygon) [^>]*stroke-width/g) || []).length >= prog.bloques.length, `semilla ${s}: faltan formas`);
    const w = +p.figura.svg.match(/viewBox="0 0 (\d+)/)[1];
    assert.ok(w >= 300 && w <= 420, `semilla ${s}: ancho ${w}`);
    assert.ok(prog.bloques.length <= 9, `semilla ${s}: ${prog.bloques.length} bloques`);
  }
});

test('cada error da otro valor que la respuesta y las vueltas son pocas', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.notEqual(a.valor, p.respuesta.valor);
    if (p._datos.tipo !== 'operador' && p._datos.tipo !== 'descuentos') {
      const r = gen.calc.ejecutar(gen.calc.programa(p._datos));
      assert.ok(r.traza.length <= 13, `semilla ${s}: ${r.traza.length} filas de traza`);
    }
  }
});
