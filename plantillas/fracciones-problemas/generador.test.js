// Pruebas del generador de problemas de fracciones, decimales periódicos y MCD: casos.json
// (verificados aparte, a ciegas), un recálculo independiente en cada uno de 600 problemas (fuerza
// bruta, división larga o simulación, no las fórmulas del generador) y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// MCD por restas sucesivas (otro camino que el de Euclides con módulo).
function mcdRestas(a, b) { while (a !== b) { if (a > b) a -= b; else b -= a; } return a; }
// División larga: las primeras n cifras decimales de a/b (a < b).
function cifras(a, b, n) { let r = a % b, s = ''; for (let i = 0; i < n; i++) { r *= 10; s += Math.floor(r / b); r %= b; } return s; }
// Anteperiodo y periodo por división larga, guardando el lugar de cada resto.
function antePer(N, D) {
  let r = N % D; const lugar = new Map(); let i = 0;
  while (r !== 0 && !lugar.has(r)) { lugar.set(r, i++); r = r * 10 % D; }
  if (r === 0) return { ante: i, per: 0 };
  return { ante: lugar.get(r), per: i - lugar.get(r) };
}
// Producto de fracciones reducido con BigInt.
function prodFr(lista) {
  let n = 1n, d = 1n; for (const [x, y] of lista) { n *= BigInt(x); d *= BigInt(y); }
  const g = (a, b) => (b === 0n ? a : g(b, a % b)); const k = g(n, d); return `num:${n / k}/${d / k}`;
}
// Generatriz leída del texto del porcentaje («27,2727… %»): se busca el bloque que se repite.
function generatrizTexto(t) {
  const m = /^([\d ]+),(\d+)… %$/.exec(t); assert.ok(m, `porcentaje mal escrito: ${t}`);
  const ent = m[1].replace(/ /g, ''), dec = m[2];
  for (let L = 1; L <= 3; L++) {
    const per = dec.slice(0, L);
    if (per.repeat(Math.ceil(dec.length / L)).slice(0, dec.length) === dec) {
      // x = ent + per/(10^L − 1), en porcentaje: fracción = x/100.
      const num = Number(ent) * (10 ** L - 1) + Number(per), den = (10 ** L - 1) * 100;
      const g = mcdRestas(num, den); return [num / g, den / g];
    }
  }
  throw new Error('sin periodo: ' + t);
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'acotada': {
      const [[p1, q1], [p2, q2]] = d.cotas; let c = 0;
      for (let n = 1; n <= 3000; n++) if (n * q1 > p1 * (n + d.k) && n * q2 < p2 * (n + d.k) && mcdRestas(n, n + d.k) === 1) c++;
      return c;
    }
    case 'pesi': {
      const sols = [];
      for (let B = 1; B <= 2000; B++) {
        const A = B + d.D; let L = A; while (L % B) L += A;
        if (L === d.M) sols.push(A + B);
      }
      assert.equal(sols.length, 1, 'pesi: la solución no es única'); return sols[0];
    }
    case 'porcentaje': {
      const [n1, d1] = generatrizTexto(d.p1), [n2, d2] = generatrizTexto(d.p2);
      assert.deepEqual([n1, d1], d.f1); assert.deepEqual([n2, d2], d.f2);
      const sols = [];
      for (let X = 1; X <= 20000; X++) {
        if ((X * n1) % d1) continue; const resto = X - X * n1 / d1;
        if ((resto * n2) % d2) continue; if (resto - resto * n2 / d2 === d.R) sols.push(X);
      }
      assert.equal(sols.length, 1); return sols[0];
    }
    case 'stock': {
      const [a1, b1] = d.f1, [a2, b2] = d.f2; let mejor = NaN;
      for (let N = d.L; N <= d.H; N++) {
        if ((N * a1) % b1) continue; const q1 = N - N * a1 / b1;
        if ((q1 * a2) % b2) continue; const q2 = q1 - q1 * a2 / b2;
        if (q2 < d.C) mejor = N;
      }
      return mejor;
    }
    case 'equivalentes': {
      let c = 0;
      for (let k = 1; k <= 1000; k++) {
        const num = d.a * k, den = d.b * k, base = d.sub === 'den' ? den : num + den, vigilado = d.sub === 'den' ? den : num;
        if (base >= 100 && base <= 999 && vigilado % d.q !== 0) c++;
      }
      return c;
    }
    case 'trabajo': {
      // Simulación minuto a minuto en unidades enteras: el tanque mide q·t1·60·b unidades.
      const [p_, q] = d.f, [a, b] = d.baja, cap = q * d.t1 * 60 * b;
      const r1 = p_ * b, r2 = p_ * (b - a);
      let lleno = 0, min = 0;
      while (lleno < cap) { lleno += lleno < p_ * d.t1 * 60 * b ? r1 : r2; min++; assert.ok(min < 10000); }
      assert.equal(lleno, cap, 'el llenado no cae en un minuto exacto');
      return min / 60;
    }
    case 'diferencia': {
      let mejor = null;
      for (let a = 1; a <= d.S; a++) for (let b = a + 1; b <= d.S; b++) {
        const ok = d.sub === 'suma' ? a + b === d.S : a * b === d.S;
        if (ok && mcdRestas(a, b) === 1 && (!mejor || b - a < mejor[1] - mejor[0])) mejor = [a, b];
      }
      return `t:${mejor[0]}/${mejor[1]}`;
    }
    case 'formar': {
      const l = [];
      for (const x of d.numeros) for (const y of d.numeros) if (x < y && mcdRestas(x, y) === 1) l.push([x, y]);
      return prodFr(l);
    }
    case 'periodo': {
      if (d.sub === 'ultimas') {
        // Largo del periodo por división larga (el resto vuelve a a) y sus dos últimas cifras.
        let r = d.a, L = 0; do { r = r * 10 % d.p; L++; } while (r !== d.a);
        return `cc:${cifras(d.a, d.p, L).slice(-2)}`;
      }
      return `cifra:${cifras(d.a, d.q, d.k).slice(-1)}`;
    }
    case 'suma-entera': {
      let c = 0;
      for (let a = 1; a < d.d * d.m; a++) for (let b = a + 1; b < d.d * d.m; b++)
        if (a + b === d.d * d.m && a > d.d && b > d.d && mcdRestas(a, d.d) === 1 && mcdRestas(b, d.d) === 1) c++;
      return c;
    }
    case 'tipo-decimal': { const r = antePer(d.N, d.D); return `np:${r.ante},p:${r.per}`; }
    case 'pg-mcd': {
      const sols = [];
      for (let a = 1; a <= 100; a++) for (let b = a + 1; b <= 100; b++) for (let c = b + 1; c <= 100; c++)
        if (b * b === a * c && a * b * c === d.producto && a + b + c === d.suma) sols.push(mcdRestas(a, c));
      assert.equal(sols.length, 1); return sols[0];
    }
    case 'euclides': {
      const sols = [];
      for (let B = 1; B <= 1000; B++) {
        let x = B + d.D, y = B; const qs = []; let paso = 0, ok = true;
        while (y !== 0 && ok) {
          paso++;
          const exceso = paso === d.exceso;
          const qq = exceso ? Math.ceil(x / y) : Math.floor(x / y);
          const r = exceso ? qq * y - x : x - qq * y;
          if (exceso && r === 0) ok = false;
          qs.push(qq); [x, y] = [y, r];
          if (qs.length > 3) ok = false;
        }
        if (ok && qs.join() === d.cocientes.join()) sols.push(2 * B + d.D);
      }
      assert.equal(sols.length, 1); return sols[0];
    }
  }
  throw new Error('tipo desconocido ' + d.tipo);
}

const igual = (a, b) => (typeof a === 'string' ? a === b : Math.abs(a - b) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const correcta = p.alternativas.find(a => a.correcta);
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.texto, c.esperado.respuesta);
    assert.equal(correcta.texto, c.esperado.exacta);
  });
}

const TEXTUALES = ['diferencia', 'formar', 'periodo', 'tipo-decimal'];
const FORMA = {
  diferencia: /^\d+\/\d+$/, formar: /^\d+(\/\d+)?$/, 'tipo-decimal': /^\d+ no periódicas? y \d+ periódicas?$/,
  periodo: null, // depende del sub: dos cifras o una cifra
};
test('salen todos los tipos y subtipos, y las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), d = p._datos, alt = p.alternativas.map(a => a.texto);
    vistos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    if (TEXTUALES.includes(d.tipo)) {
      const re = d.tipo === 'periodo' ? (d.sub === 'ultimas' ? /^\d\d$/ : /^\d$/) : FORMA[d.tipo];
      for (const t of alt) assert.match(t, re, `semilla ${s}: ${alt}`);
      assert.equal(typeof p.respuesta.valor, 'string');
    } else {
      const forma = t => t.replace(/[\d ,]+/g, '#');
      assert.equal(new Set(alt.map(forma)).size, 1, `semilla ${s}: formas distintas (${alt})`);
      for (const t of alt) assert.ok(!/,\d{3}/.test(t), `semilla ${s}: más de dos decimales (${t})`);
    }
  }
  assert.deepEqual([...vistos].sort(), ['acotada', 'diferencia/producto', 'diferencia/suma', 'equivalentes/den', 'equivalentes/suma',
    'euclides', 'formar', 'periodo/lugar', 'periodo/ultimas', 'pesi', 'pg-mcd', 'porcentaje', 'stock', 'suma-entera',
    'tipo-decimal/factorial', 'tipo-decimal/producto', 'trabajo']);
});

test('ningún distractor da la respuesta correcta', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      if (typeof a.valor === 'number') assert.ok(Math.abs(a.valor - p.respuesta.valor) > 1e-9, `semilla ${s}`);
      else assert.notEqual(a.valor, p.respuesta.valor, `semilla ${s}`);
    }
    // En «diferencia», ninguna alternativa distinta de la correcta es propia, irreducible y con el dato.
    if (d.tipo === 'diferencia') for (const a of p.alternativas.filter(x => !x.correcta)) {
      const [x, y] = a.texto.split('/').map(Number);
      const cumple = x < y && mcdRestas(x, y) === 1 && (d.sub === 'suma' ? x + y === d.S : x * y === d.S);
      if (cumple) assert.ok(y - x > p.respuesta.texto.split('/').map(Number).reduce((u, w) => w - u), `semilla ${s}: ${a.texto} también serviría`);
    }
  }
});

test('los datos son creíbles y los textos están limpios', () => {
  const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto + ' ' + (a.error ? a.error.explicacion : ''))].join('\n');
    for (const malo of ['undefined', 'NaN', '−−', 'null', '[object', 'Infinity']) assert.ok(!todo.includes(malo), `semilla ${s}: «${malo}» en ${todo}`);
    for (const parte of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof parte !== 'string') assert.ok(p.variables[parte.v], `semilla ${s}: clave ${parte.v} sin variable`);
    const colores = Object.values(p.variables).map(x => x.color);
    for (const c of colores) assert.ok(['o', 'i', 'd', 'h'].includes(c));
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    if (d.tipo === 'porcentaje') assert.ok(p.respuesta.valor <= 3000 && d.R > 0);
    if (d.tipo === 'pg-mcd') assert.ok(d.suma < 200 && d.producto ** (1 / 3) < 70);
    if (d.tipo === 'euclides') assert.ok(p.respuesta.valor < 1000);
    if (d.tipo === 'trabajo') assert.ok(p.respuesta.valor <= 40);
    if (d.tipo === 'stock') assert.ok(p.respuesta.valor <= 1000);
    if (['acotada', 'equivalentes', 'suma-entera'].includes(d.tipo)) assert.ok(p.respuesta.valor >= 1 && p.respuesta.valor <= 120);
  }
});

test('papel.json: 5 a 10 problemas con sus campos, y las respuestas se recalculan', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    for (const k of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(pr[k], `${pr.id}: falta ${k}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    assert.ok(Array.isArray(pr.pasos) && pr.pasos.length >= 2);
  }
  const R = Object.fromEntries(papel.problemas.map(pr => [pr.id, pr.respuesta]));
  const con = (id, txt) => assert.ok(R[id].includes(txt), `${id}: «${R[id]}» no trae ${txt}`);
  // p1: 41,666… % como fracción.
  assert.deepEqual(generatrizTexto('41,666… %'), [5, 12]); con('p1', '5/12');
  // p2: 7/440, cifras no periódicas y periódicas.
  assert.deepEqual(antePer(7, 440), { ante: 3, per: 2 }); con('p2', '3'); con('p2', '2');
  // p3: n/(n + 10) irreductibles entre 1/2 y 4/5.
  assert.equal(recalcular({ _datos: { tipo: 'acotada', k: 10, cotas: [[1, 2], [4, 5]] } }), 12); con('p3', '12');
  // p4: entre 200 y 300 panes, vende 1/3 y luego 3/4 del resto, quedan menos de 40.
  assert.equal(recalcular({ _datos: { tipo: 'stock', f1: [1, 3], f2: [3, 4], L: 200, H: 300, C: 40 } }), 234); con('p4', '234');
  // p5: diferencia 36 y MCM 120.
  assert.equal(recalcular({ _datos: { tipo: 'pesi', D: 36, M: 120 } }), 84); con('p5', '84');
  // p6: 2/5 en 4 h y luego el rendimiento baja en 1/3.
  assert.equal(recalcular({ _datos: { tipo: 'trabajo', f: [2, 5], t1: 4, baja: [1, 3] } }), 13); con('p6', '13');
  // p7: cocientes 3, 2 y 4, la segunda por exceso, diferencia 216.
  assert.equal(recalcular({ _datos: { tipo: 'euclides', cocientes: [3, 2, 4], exceso: 2, D: 216 } }), 384); con('p7', '300'); con('p7', '84');
  // p8: las dos últimas cifras del periodo de 3/17.
  assert.equal(recalcular({ _datos: { tipo: 'periodo', sub: 'ultimas', a: 3, p: 17 } }), 'cc:41'); con('p8', '41');
  // p9: edades en progresión geométrica con producto 1728 y suma 38.
  assert.equal(recalcular({ _datos: { tipo: 'pg-mcd', producto: 1728, suma: 38 } }), 2); con('p9', '2');
  // p10: con 6, 7, 10 y 21.
  assert.equal(recalcular({ _datos: { tipo: 'formar', numeros: [6, 7, 10, 21] } }), 'num:2/7'); con('p10', '2/7');
});
