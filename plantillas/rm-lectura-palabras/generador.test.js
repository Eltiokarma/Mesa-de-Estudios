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
// Las mismas casillas, pero leídas solo del texto alternativo (lo que oye un lector de pantalla): posición
// en medias casillas en los arreglos en filas; columnas en la cuadrícula.
function casillasAlt(alt) {
  const cs = [];
  const filas = [...alt.matchAll(/fila (\d+): ([^;.]*)/g)];
  for (const [, nf, cuerpo] of filas) {
    const y = Number(nf);
    const col = /^(.*) \(columnas (\d+) a (\d+)\)$/.exec(cuerpo.trim());
    if (col) {
      const ls = col[1].split(' ');
      ls.forEach((l, k) => cs.push({ x: Number(col[2]) + k, y, l }));
      assert.equal(ls.length, Number(col[3]) - Number(col[2]) + 1);
    } else for (const m of cuerpo.matchAll(/(\S+) \((\d+)\)/g)) cs.push({ x: Number(m[2]), y, l: m[1] });
  }
  return cs;
}
function contar(p, cs = casillas(p.figura.svg)) {
  const d = p._datos, w = d.palabra;
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

// ---- Los dos tipos de cierre-100 (semillas de texto): recuento por DFS sobre lo DIBUJADO ----
// doble: letras del SVG; vecinas en la misma fila a una separación, y en filas seguidas a media separación.
function contarDoble(p, cs = casillas(p.figura.svg)) {
  const w = p._datos.palabra;
  const ys = [...new Set(cs.map(c => c.y))].sort((a, b) => a - b);
  const fila = c => ys.indexOf(c.y);
  let gap = Infinity;
  for (const a of cs) for (const b of cs) if (a !== b && a.y === b.y) gap = Math.min(gap, Math.abs(a.x - b.x));
  const vec = c => cs.filter(o => o !== c && ((fila(o) === fila(c) && cerca(Math.abs(o.x - c.x), gap)) || (Math.abs(fila(o) - fila(c)) === 1 && cerca(Math.abs(o.x - c.x), gap / 2))));
  let n = 0;
  const dfs = (c, i) => { if (c.l !== w[i]) return; if (i === w.length - 1) { n++; return; } for (const o of vec(c)) dfs(o, i + 1); };
  for (const c of cs) dfs(c, 0);
  return n;
}
// malla: vecinas = las más cercanas (distancia mínima entre cualquier par de letras del dibujo).
function contarMalla(p, cs = casillas(p.figura.svg)) {
  const w = p._datos.palabra;
  let dmin = Infinity;
  for (const a of cs) for (const b of cs) if (a !== b) dmin = Math.min(dmin, Math.hypot(a.x - b.x, a.y - b.y));
  const vec = c => cs.filter(o => o !== c && cerca(Math.hypot(o.x - c.x, o.y - c.y), dmin));
  let n = 0;
  const dfs = (c, i) => { if (c.l !== w[i]) return; if (i === w.length - 1) { n++; return; } for (const o of vec(c)) dfs(o, i + 1); };
  for (const c of cs) dfs(c, 0);
  return n;
}
const recalcularTexto = p => (p._datos.tipo === 'doble' ? contarDoble(p) : p._datos.tipo === 'malla' ? contarMalla(p) : contar(p));
const genTexto = { ...gen, id: gen.id + ' (semillas de texto)', generar: s => gen.generar('p' + s) };
probarGenerador(genTexto, { semillas: 600, recalcular: recalcularTexto });

// El alt solo (lo que oye un lector de pantalla) alcanza para rehacer las vecindades de los dos tipos nuevos.
function casillasAltPos(alt) {
  const cs = [];
  for (const [, nf, cuerpo] of alt.matchAll(/fila (\d+): ([^;.]*)/g)) for (const m of cuerpo.matchAll(/(\S+) \((\d+)\)/g)) cs.push({ x: Number(m[2]), y: Number(nf), l: m[1] });
  return cs;
}
test('doble y malla: desde el alt se rehacen las vecindades y la búsqueda da la respuesta', () => {
  let vistos = 0;
  for (let s = 0; s < 400; s++) {
    const p = genTexto.generar(s), t = p._datos.tipo;
    if (t !== 'doble' && t !== 'malla') continue;
    vistos++;
    const cs = casillasAltPos(p.figura.alt);
    assert.equal(cs.length, casillas(p.figura.svg).length, `semilla ${s}: el alt no trae todas las casillas`);
    const n = t === 'doble' ? (() => { const w = p._datos.palabra; const f = c => c.y; let k = 0; const vec = c => cs.filter(o => o !== c && ((f(o) === f(c) && Math.abs(o.x - c.x) === 2) || (Math.abs(f(o) - f(c)) === 1 && Math.abs(o.x - c.x) === 1))); const dfs = (c, i) => { if (c.l !== w[i]) return; if (i === w.length - 1) { k++; return; } for (const o of vec(c)) dfs(o, i + 1); }; cs.forEach(c => dfs(c, 0)); return k; })()
      : (() => { const w = p._datos.palabra; let k = 0; const vec = c => cs.filter(o => Math.abs(o.x - c.x) === 1 && Math.abs(o.y - c.y) === 1); const dfs = (c, i) => { if (c.l !== w[i]) return; if (i === w.length - 1) { k++; return; } for (const o of vec(c)) dfs(o, i + 1); }; cs.forEach(c => dfs(c, 0)); return k; })();
    assert.equal(n, p.respuesta.valor, `semilla ${s}: el alt no basta para resolver`);
  }
  assert.ok(vistos > 80, `solo ${vistos} problemas nuevos`);
});

test('las preguntas oficiales (UNMSM 2024-I y 2025-II) dan 512 y 132, y citan el examen', () => {
  for (const [s, v] of [['unmsm-2024-I-28', 512], ['unmsm-2025-II-29', 132]]) {
    const p = gen.generar(s);
    assert.equal(p.respuesta.valor, v); assert.equal(recalcularTexto(p), v); assert.match(p.datos, /UNMSM/);
  }
});

test('doble: la respuesta es (2 + 4 + 2) · 2^(n − 2) = 2^(n + 1); malla: sin repetir ≤ total y la letra repetida solo vale en la fila 2', () => {
  for (let s = 0; s < 400; s++) {
    const p = genTexto.generar(s), d = p._datos;
    if (d.tipo === 'doble') { assert.equal(p.respuesta.valor, 2 ** (d.palabra.length + 1)); assert.equal(new Set([...d.palabra].slice(2)).size, d.palabra.length - 2); }
    if (d.tipo === 'malla') { const M = gen.calc.malla(d); assert.ok(M.sinRepetir <= M.total && M.soloAbajo <= M.total); assert.equal(M.porInicio.reduce((a, x) => a + x.n, 0), M.total); }
  }
});

test('las semillas numéricas no cambiaron y las de texto sacan doble y malla', () => {
  const nums = new Set(), txt = new Set();
  for (let s = 0; s < 200; s++) { nums.add(gen.generar(s)._datos.tipo); txt.add(genTexto.generar(s)._datos.tipo); }
  assert.ok(!nums.has('doble') && !nums.has('malla'));
  assert.ok(txt.has('doble') && txt.has('malla'));
});

test('distractores de doble y malla dicen lo que dicen', () => {
  for (let s = 0; s < 500; s++) {
    const p = genTexto.generar(s), d = p._datos, n = p.respuesta.valor;
    for (const a of p.alternativas.filter(x => x.error)) {
      const id = a.error.id;
      if (d.tipo === 'doble') {
        if (id === 'RMP113-un-caso') assert.equal(a.valor * 2, n);
        if (id === 'RMP114-una-L') assert.equal(a.valor * 4, n);
      }
      if (d.tipo === 'malla') {
        const M = gen.calc.malla(d);
        if (id === 'RMP115-sin-volver') assert.equal(a.valor, M.sinRepetir);
        if (id === 'RMP45-vuelta-doble') assert.equal(a.valor, 2 * n - M.sinRepetir);
        if (id === 'RMP84-solo-abajo') assert.equal(a.valor, M.soloAbajo);
        if (id === 'RMP116-una-salida') assert.equal(a.valor, M.porInicio[0].n * M.porInicio.length);
      }
    }
  }
});

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

test('desde el alt solo se rehacen las vecindades y la búsqueda da la respuesta (500 semillas)', () => {
  for (let s = 0; s < 500; s++) {
    const p = gen.generar(s);
    const cs = casillasAlt(p.figura.alt);
    assert.equal(cs.length, casillas(p.figura.svg).length, `semilla ${s}: el alt no trae todas las casillas`);
    assert.equal(contar(p, cs), p.respuesta.valor, `semilla ${s}: el alt no basta para resolver`);
    assert.ok(!/centrad/.test(p.figura.alt), `semilla ${s}: el alt dice filas centradas`);
    const num = /^\d+$/.test(p._datos.palabra);
    assert.match(p.figura.alt, num ? /^(Arreglo|Cuadrícula) de cifras/ : /^(Arreglo|Cuadrícula) de letras/, `semilla ${s}`);
  }
});

test('respaldos: solo AR18-solo-rectas es AR18 (parcial); lo demás, códigos propios en hipótesis', () => {
  for (let s = 0; s < 600; s++) for (const a of gen.generar(s).alternativas) {
    if (!a.error) continue;
    if (a.error.id.startsWith('AR18')) { assert.equal(a.error.id, 'AR18-solo-rectas'); assert.equal(a.error.respaldo, 'parcial'); }
    else { assert.match(a.error.id, /^RMP(1|45|46|81|82|83|84)-/); assert.equal(a.error.respaldo, 'hipotesis'); assert.equal(a.error.fuente, null); }
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
