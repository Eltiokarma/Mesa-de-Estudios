// Pruebas del generador «rutas-tramos»: casos.json (verificados aparte, a ciegas) y un recálculo
// independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const plano = segs => segs.map(x => (typeof x === 'string' ? x : x.t)).join('');

// red: cada camino es una arista con nombre propio («A-B#2»). Se recorren aristas (no tramos)
// sin repetir pueblo y se cuenta cada sucesión de aristas como una ruta.
function recalcRed(d) {
  const aristas = [];
  for (const [i, j, c] of d.tramos) for (let q = 0; q < c; q++) aristas.push({ a: i, b: j, id: `${i}-${j}#${q}` });
  let total = 0;
  const visitar = (u, pueblos) => {
    if (u === d.k - 1) {
      const ok = d.condicion === 'pasa' ? pueblos.has(d.por) : d.condicion === 'evita' ? !pueblos.has(d.por) : true;
      if (ok) total++;
      return;
    }
    for (const e of aristas) {
      const w = e.a === u ? e.b : e.b === u ? e.a : -1;
      if (w < 0 || pueblos.has(w)) continue;
      pueblos.add(w); visitar(w, pueblos); pueblos.delete(w);
    }
  };
  visitar(0, new Set([0]));
  return total;
}

// cuadrícula: se cuentan los caminos esquina por esquina (tabla de sumas), sin combinaciones.
function recalcCuadricula(d) {
  const N = Array.from({ length: d.m + 1 }, () => Array(d.n + 1).fill(0));
  for (let x = 0; x <= d.m; x++) for (let y = 0; y <= d.n; y++) {
    if (x === 0 && y === 0) { N[x][y] = 1; continue; }
    if (d.condicion === 'cerrado' && x === d.px && y === d.py) { N[x][y] = 0; continue; }
    N[x][y] = (x > 0 ? N[x - 1][y] : 0) + (y > 0 ? N[x][y - 1] : 0);
  }
  if (d.condicion === 'cerrado') return N[d.m][d.n];
  // obligado: las que llegan a la esquina, y desde ella sin volver (otra tabla que empieza ahí)
  const M = Array.from({ length: d.m + 1 }, () => Array(d.n + 1).fill(0));
  for (let x = d.px; x <= d.m; x++) for (let y = d.py; y <= d.n; y++) {
    M[x][y] = x === d.px && y === d.py ? N[x][y] : (x > d.px ? M[x - 1][y] : 0) + (y > d.py ? M[x][y - 1] : 0);
  }
  return M[d.m][d.n];
}

const recalcular = p => (p._datos.tipo === 'red' ? recalcRed(p._datos) : recalcCuadricula(p._datos));
probarGenerador(gen, { semillas: 600, recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los dos tipos con todas sus condiciones; el enunciado trae los datos', () => {
  const vistos = new Set();
  let conRegreso = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, txt = plano(p.enunciado);
    vistos.add(d.tipo + '/' + d.condicion);
    assert.ok(p.alternativas.every(a => Number.isInteger(a.valor) && a.valor > 0));
    if (d.tipo === 'red') {
      const L = 'ABCDE';
      for (const [i, j, c] of d.tramos) {
        const directo = j > i + 1;
        const frase = directo ? `${c === 1 ? 'un camino directo' : `${c} caminos directos`} entre ${L[i]} y ${L[j]}` : (i === 0 ? `De A a B hay ${c === 1 ? '1 camino' : c + ' caminos'}` : `de ${L[i]} a ${L[j]}, ${c}`);
        assert.ok(txt.includes(frase), `semilla ${s}: falta «${frase}» en «${txt}»`);
      }
      if (p.alternativas.some(a => a.error && /hacia atrás/.test(a.error.explicacion))) conRegreso++;
    } else {
      assert.ok(txt.includes(`${d.m} cuadras de oeste a este`) && txt.includes(`de ${d.n} cuadras de sur a norte`) || txt.includes(`por ${d.n} cuadras de sur a norte`), txt);
      assert.ok(d.px > 0 && d.px < d.m && d.py > 0 && d.py < d.n);
    }
  }
  assert.deepEqual([...vistos].sort(), ['cuadricula/cerrado', 'cuadricula/obligado', 'red/evita', 'red/ninguna', 'red/pasa']);
  assert.ok(conRegreso > 20, `pocas redes con rutas que regresan (${conRegreso})`);
});

test('ejemplos a mano', () => {
  // 3 caminos de A a B y 4 de B a C, sin atajos: 12 (RME30 diría 7).
  assert.equal(recalcRed({ k: 3, tramos: [[0, 1, 3], [1, 2, 4]], condicion: 'ninguna', por: null }), 12);
  // Con 2 directos de A a C: 14. Si se prohíbe B: 2.
  assert.equal(recalcRed({ k: 3, tramos: [[0, 1, 3], [1, 2, 4], [0, 2, 2]], condicion: 'ninguna', por: null }), 14);
  assert.equal(recalcRed({ k: 3, tramos: [[0, 1, 3], [1, 2, 4], [0, 2, 2]], condicion: 'evita', por: 1 }), 2);
  // Cuadrícula 2 × 2: 6 rutas; con el centro cerrado, 2; obligado, 4.
  assert.equal(recalcCuadricula({ m: 2, n: 2, px: 1, py: 1, condicion: 'cerrado' }), 2);
  assert.equal(recalcCuadricula({ m: 2, n: 2, px: 1, py: 1, condicion: 'obligado' }), 4);
});
