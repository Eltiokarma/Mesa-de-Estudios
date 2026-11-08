// Pruebas del generador de lecturas: las comunes (600 problemas), casos.json, papel.json y propiedades.
// Recálculo independiente: se lee el arreglo DIBUJADO (las letras y casillas tapadas del SVG, con sus
// coordenadas), se arman las vecindades por geometría y se cuentan las lecturas una por una con una
// búsqueda en profundidad (DFS), sin la programación dinámica ni las fórmulas del generador.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

function casillas(svg) {
  const cs = [];
  for (const m of svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)) cs.push({ x: Number(m[1]), y: Number(m[2]), l: m[3] });
  for (const m of svg.matchAll(/<rect class="tapada" x="([\d.]+)" y="([\d.]+)"/g)) cs.push({ x: Number(m[1]) + 10, y: Number(m[2]) + 16, l: '■' });
  return cs;
}
const cerca = (a, b) => Math.abs(a - b) < 0.5;
function contar(p) {
  const d = p._datos, w = d.palabra;
  const cs = casillas(p.figura.svg);
  const ys = [...new Set(cs.map(c => c.y))].sort((a, b) => a - b);
  const fila = c => ys.indexOf(c.y);
  // Separación entre letras vecinas de una misma fila.
  let gap = Infinity;
  for (const a of cs) for (const b of cs) if (a !== b && a.y === b.y) gap = Math.min(gap, Math.abs(a.x - b.x));
  const rd = d.forma === 'cuadricula';
  const sig = (c, sube) => cs.filter(o => {
    if (rd) return (o.y === c.y && cerca(o.x - c.x, gap)) || (fila(o) === fila(c) + 1 && cerca(o.x, c.x));
    return fila(o) === fila(c) + (sube ? -1 : 1) && cerca(Math.abs(o.x - c.x), gap / 2);
  });
  const caminos = [];
  const dfs = (c, i, camino, sube) => {
    if (c.l !== w[i]) return;
    camino.push(cs.indexOf(c));
    if (i === w.length - 1) caminos.push(camino.slice());
    else for (const o of sig(c, sube)) dfs(o, i + 1, camino, sube);
    camino.pop();
  };
  for (const c of cs) dfs(c, 0, [], false);
  if (d.sentidos === 2) for (const c of cs) dfs(c, 0, [], true);
  if (d.iguales) return new Set(caminos.map(k => { const a = k.join(','), b = k.slice().reverse().join(','); return a < b ? a : b; })).size;
  return caminos.length;
}
probarGenerador(gen, { semillas: 600, recalcular: contar });

test('salen los seis tipos, las dos reglas del palíndromo, la cuadrícula escalonada y los números', () => {
  const vistos = new Set();
  for (let s = 0; s < 200; s++) {
    const d = gen.generar(s)._datos;
    vistos.add(d.tipo);
    if (d.tipo === 'palindromo') vistos.add('iguales-' + d.iguales);
    if (d.banda) vistos.add('banda');
    if (/^\d+$/.test(d.palabra)) vistos.add('numero');
    if (d.tapada) vistos.add('tapada-' + d.forma);
  }
  for (const k of ['triangulo', 'rombo', 'palindromo', 'cuadricula', 'bloques', 'tapada', 'iguales-true', 'iguales-false', 'banda', 'numero', 'tapada-triangulo', 'tapada-rombo', 'tapada-cuadricula']) assert.ok(vistos.has(k), `falta ${k}`);
});

test('la figura del enunciado trae solo las letras (ningún número de Pascal); la de la solución, los números', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), w = p._datos.palabra;
    const letras = casillas(p.figura.svg).map(c => c.l);
    for (const l of letras) assert.ok(l === '■' || w.includes(l), `semilla ${s}: «${l}» no es de ${w}`);
    const nFilas = new Set(casillas(p.figura.svg).map(c => c.y)).size;
    assert.equal((p.figura.alt.match(/fila \d+: /g) || []).length, nFilas, `semilla ${s}: el alt no escribe todas las filas`);
    const nums = casillas(p.figuraSolucion.svg).filter(c => c.l !== '■').map(c => Number(c.l));
    assert.ok(nums.every(Number.isInteger) && nums.includes(1), `semilla ${s}: figura de solución sin números`);
  }
});

test('en los palíndromos, la palabra se lee igual al revés y las dos reglas difieren en el doble', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'palindromo') continue;
    assert.equal(d.palabra, [...d.palabra].reverse().join(''));
    const otra = gen.calc.lecturas({ ...d, iguales: !d.iguales }).total;
    assert.equal(d.iguales ? otra : p.respuesta.valor, 2 * (d.iguales ? p.respuesta.valor : otra));
  }
});

test('con casilla tapada: la respuesta es total − llegan × salen, y tapar nunca deja la cuenta igual', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (!d.tapada) continue;
    const L = gen.calc.lecturas(d);
    assert.equal(p.respuesta.valor, L.sinTapar - L.llegan * L.salen, `semilla ${s}`);
    assert.ok(L.llegan * L.salen > 0, `semilla ${s}: la tapada no corta ningún camino`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: cada problema se comprueba con calc', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.verificar && pr.verificar.length, `${pr.id}: sin verificar`);
    for (const ver of pr.verificar) {
      const r = gen.calc[ver.fn](...ver.args);
      for (const [k, val] of Object.entries(ver.espera)) assert.deepEqual(r[k], val, `${pr.id}: ${k} = ${JSON.stringify(r[k])}`);
    }
  }
});
