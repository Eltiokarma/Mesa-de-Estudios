// Pruebas del motor de «El dado en la mesa y las fichas del dominó». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija):
//    - las 24 posiciones de cada dado son distintas y cumplen la regla del 7; el normal y el espejo no comparten ninguna;
//      cuatro vuelcos hacia el mismo lado, o uno de ida y otro de vuelta, dejan el dado igual;
//    - optimizarDados coincide con una fuerza bruta aparte que recorre las 24^n posiciones (y las 720 formas libres
//      para el error sinSiete) y calcula las clases de las caras por su cuenta;
//    - en un camino, el dado rodado de ida y de vuelta queda como empezó; circuito coincide con rodar vuelta por vuelta;
//    - deducirCubo siempre encuentra el cubo con que se hicieron las vistas;
//    - las fichas del 0 al m son (m + 1)(m + 2)/2 y suman m(m + 1)(m + 2)/2 puntos; elegirFichas y cadenaDomino
//      coinciden con búsquedas aparte; lanzamientos y conteoPuntajes, con cuentas aparte;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden') ni con otro error.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...JSON.parse(JSON.stringify(args)));
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    assert.deepEqual(x, v, `${que} · ${k || fn}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'dados-domino');
  assert.equal(datos.verificacion, '', 'la verificación la llena otro subagente');
  assert.ok(datos.casos.length >= 16);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const elegir = a => a[ent(0, a.length - 1)];
function sinChoques(R, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  assert.ok(R.repetidos && typeof R.repetidos === 'object', `${que}: falta repetidos`);
  for (const [k, v] of Object.entries(R.errores)) assert.notDeepEqual(v, R.respuesta, `${que}: el error ${k} da la respuesta`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.notDeepEqual(vs[i], vs[j], `${que}: dos errores dan lo mismo`);
}
const C6 = motor.CARAS, OP = motor.OPUESTA, clave = d => C6.map(c => d[c]).join(',');

test('las 24 posiciones de cada dado: distintas, con la regla del 7; normal y espejo no se cruzan', () => {
  const N = motor.posiciones(), E = motor.posiciones(true);
  assert.equal(new Set(N.map(clave)).size, 24);
  assert.equal(new Set(E.map(clave)).size, 24);
  for (const d of N.concat(E)) {
    for (const c of C6) assert.equal(d[c] + d[OP[c]], 7);
    assert.deepEqual(C6.map(c => d[c]).sort(), [1, 2, 3, 4, 5, 6]);
  }
  const sN = new Set(N.map(clave));
  for (const d of E) assert.ok(!sN.has(clave(d)));
  // el dado de tienda: 1 arriba, 2 al frente, 3 a la derecha
  assert.equal(motor.dado({ arriba: 1, frente: 2 }).derecha, 3);
  assert.equal(motor.dado({ arriba: 1, frente: 2, espejo: true }).derecha, 4);
  // cada vista de esquina posible está en uno solo de los dos dados
  for (const d of N) assert.equal(motor.quiralidad([d.arriba, d.frente, d.derecha]), 'normal');
  for (const d of E) assert.equal(motor.quiralidad([d.arriba, d.frente, d.derecha]), 'espejo');
});
test('vuelcos: cuatro iguales o uno de ida y otro de vuelta dejan el dado igual; caminoGiro llega', () => {
  for (const d of motor.posiciones()) for (const l of motor.LADOS) {
    let x = d; for (let k = 0; k < 4; k++) x = motor.rodar(x, l);
    assert.equal(clave(x), clave(d));
    assert.equal(clave(motor.rodar(motor.rodar(d, l), OP[l])), clave(d));
    // la cara de arriba va al lado del vuelco (la que sube es la del lado opuesto: RME13)
    const n = motor.rodar(d, l);
    assert.equal(n[l], d.arriba); assert.equal(n.arriba, d[OP[l]]);
  }
  for (let k = 0; k < 40; k++) {
    const a = elegir(motor.posiciones()), b = elegir(motor.posiciones());
    const cam = motor.caminoGiro(a, b);
    let x = a; for (const l of cam) x = motor.rodar(x, l);
    assert.equal(clave(x), clave(b));
    assert.ok(cam.length <= 4);
  }
});

// fuerza bruta aparte para las disposiciones
function clasesAparte(dados, pared, vista) {
  const hay = (x, y, z) => dados.findIndex(p => p[0] === x && p[1] === y && p[2] === z);
  const V = { arriba: [0, 0, 1], abajo: [0, 0, -1], frente: [0, -1, 0], atras: [0, 1, 0], derecha: [1, 0, 0], izquierda: [-1, 0, 0] };
  const maxY = Math.max(...dados.map(p => p[1])), minY = Math.min(...dados.map(p => p[1]));
  const maxX = Math.max(...dados.map(p => p[0])), minX = Math.min(...dados.map(p => p[0]));
  return dados.map(p => {
    const o = {};
    for (const c of C6) {
      const q = [p[0] + V[c][0], p[1] + V[c][1], p[2] + V[c][2]];
      const enPared = pared.includes(c) && ((c === 'atras' && p[1] === maxY) || (c === 'frente' && p[1] === minY) || (c === 'derecha' && p[0] === maxX) || (c === 'izquierda' && p[0] === minX));
      o[c] = c === 'abajo' && p[2] === 0 ? 'mesa' : hay(...q) >= 0 ? 'dado' : enPared ? 'pared' : vista.includes(c) ? 'vista' : 'escondida';
    }
    return o;
  });
}
function bruta(o, lista) {
  const vista = o.vista || ['arriba', 'frente', 'atras', 'derecha', 'izquierda'];
  const cl = clasesAparte(o.dados, o.pared || [], vista), n = o.dados.length, cond = o.condicion || {};
  const ext = o.extremo || 'max', obj = o.objetivo || 'visibles';
  let best = null;
  const elegidos = [];
  (function rec(i) {
    if (i === n) {
      const ar = elegidos.map(d => d.arriba);
      if (cond.productoArriba !== undefined && ar.reduce((a, b) => a * b, 1) !== cond.productoArriba) return;
      if (cond.sumaArriba !== undefined && ar.reduce((a, b) => a + b, 0) !== cond.sumaArriba) return;
      if (cond.contacto !== undefined) {
        const V = { arriba: [0, 0, 1], frente: [0, -1, 0], atras: [0, 1, 0], derecha: [1, 0, 0], izquierda: [-1, 0, 0], abajo: [0, 0, -1] };
        for (let a = 0; a < n; a++) for (const c of C6) {
          const p = o.dados[a], q = [p[0] + V[c][0], p[1] + V[c][1], p[2] + V[c][2]];
          const b = o.dados.findIndex(r => r[0] === q[0] && r[1] === q[1] && r[2] === q[2]);
          if (b >= 0 && elegidos[a][c] + elegidos[b][OP[c]] !== cond.contacto) return;
        }
      }
      let s = 0;
      elegidos.forEach((d, k) => {
        if (Array.isArray(obj)) { for (const [j, c] of obj) if (j === k) s += d[c]; return; }
        for (const c of C6) {
          const t = cl[k][c];
          if ((obj === 'visibles' && t === 'vista') || (obj === 'noVisibles' && t !== 'vista') || (obj === 'mesa' && t === 'mesa') || (obj === 'contactos' && t === 'dado')) s += d[c];
        }
      });
      if (best === null || (ext === 'max' ? s > best : s < best)) best = s;
      return;
    }
    for (const d of lista) {
      if ((o.fijas || []).some(([j, c, v]) => j === i && d[c] !== v)) continue;
      if (cond.arriba === 'par' && d.arriba % 2) continue;
      if (cond.arriba === 'impar' && !(d.arriba % 2)) continue;
      elegidos.push(d); rec(i + 1); elegidos.pop();
    }
  })(0);
  return best;
}
const FORMAS = [
  [[0, 0, 0]], [[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [0, 0, 1]], [[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 0, 0], [0, 0, 1], [0, 0, 2]],
  [[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0], [1, 0, 1]], [[0, 0, 0], [0, 1, 0], [0, 1, 1]],
];
test('optimizarDados coincide con una fuerza bruta aparte (24^n posiciones)', () => {
  const N = motor.posiciones();
  for (let k = 0; k < 70; k++) {
    const dados = elegir(FORMAS), n = dados.length;
    const o = { dados, extremo: elegir(['max', 'min']), objetivo: elegir(['visibles', 'noVisibles', 'mesa', 'contactos', [[0, 'abajo'], [n - 1, 'arriba']]]) };
    if (rnd() < .4) o.pared = [elegir(['atras', 'izquierda', 'derecha'])];
    if (rnd() < .3) o.vista = ['arriba', 'frente', 'derecha'];
    const r = rnd();
    if (r < .2) o.condicion = { arriba: elegir(['par', 'impar']) };
    else if (r < .35) o.condicion = { productoArriba: elegir([6, 12, 18, 24, 36]) };
    else if (r < .5 && n > 1) o.condicion = { contacto: elegir([6, 8, 9]) };
    if (rnd() < .3) { const d = elegir(N); o.fijas = [[0, 'arriba', d.arriba], [0, 'frente', d.frente]]; }
    const b = bruta(o, N);
    let R = null;
    try { R = motor.optimizarDados(o); } catch (e) { assert.equal(b, null, `${JSON.stringify(o)}: el motor no halló y la bruta sí`); continue; }
    assert.equal(R.respuesta, b, JSON.stringify(o));
    assert.equal(R.total, 21 * n);
    sinChoques(R, JSON.stringify(o));
    // el ejemplo es una posición de cada dado que cumple lo fijo
    for (const [j, c, v] of o.fijas || []) assert.equal(R.ejemplo[j][c], v);
  }
});
test('el error sinSiete coincide con la fuerza bruta sobre las 720 formas libres (uno o dos dados)', () => {
  const libres = [];
  (function rec(d, usado) { if (d.length === 6) { const o = {}; C6.forEach((c, k) => { o[c] = d[k]; }); libres.push(o); return; } for (let v = 1; v <= 6; v++) if (!usado.includes(v)) rec(d.concat([v]), usado.concat([v])); })([], []);
  assert.equal(libres.length, 720);
  for (const dados of [[[0, 0, 0]], [[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [0, 0, 1]]]) for (const extremo of ['max', 'min']) for (const objetivo of ['visibles', 'noVisibles', 'mesa']) {
    const o = { dados, extremo, objetivo };
    const R = motor.optimizarDados(o), b = bruta(o, libres);
    const sin = R.errores.sinSiete !== undefined ? R.errores.sinSiete : (R.coinciden.includes('sinSiete') ? R.respuesta : R.errores[R.repetidos.sinSiete]);
    assert.equal(sin, b, JSON.stringify(o));
  }
});
test('las caras visibles más las no visibles son el total, en cualquier disposición', () => {
  for (const dados of FORMAS) {
    const C = motor.clasificar({ dados });
    assert.deepEqual(C.caras, clasesAparte(dados, [], ['arriba', 'frente', 'atras', 'derecha', 'izquierda']));
    const a = motor.optimizarDados({ dados, extremo: 'max' }), b = motor.optimizarDados({ dados, objetivo: 'noVisibles', extremo: 'min' });
    assert.equal(a.respuesta + b.respuesta, 21 * dados.length);
    // con un solo dado, lo visible es 21 menos la cara de abajo
    if (dados.length === 1) for (let t = 1; t <= 6; t++) assert.equal(motor.optimizarDados({ dados, fijas: [[0, 'arriba', t]] }).respuesta, motor.unDado({ arriba: t, pregunta: 'visibles' }).respuesta);
  }
  for (let t = 1; t <= 6; t++) { sinChoques(motor.unDado({ arriba: t, pregunta: 'visibles' }), 'unDado'); assert.equal(motor.unDado({ arriba: t }).respuesta, 7 - t); }
});
test('el dado que rueda: ida y vuelta lo dejan igual; las casillas siguen el camino; sin choques entre errores', () => {
  const inv = { D: 'I', I: 'D', A: 'F', F: 'A' };
  for (let k = 0; k < 60; k++) {
    const d = elegir(motor.posiciones()), L = ent(1, 8);
    const cam = Array.from({ length: L }, () => elegir(['D', 'I', 'A', 'F'])).join('');
    const ida = motor.rodarCamino({ inicio: d, camino: cam });
    const vuelta = motor.rodarCamino({ inicio: ida.final, camino: [...cam].reverse().map(c => inv[c]).join('') });
    assert.equal(clave(vuelta.final), clave(d));
    assert.equal(ida.arribas.length, L + 1);
    assert.deepEqual(vuelta.casillas[L].map((x, j) => x + ida.casillas[L][j] + 0), [0, 0]);
    sinChoques(ida, cam);
    sinChoques(motor.rodarCamino({ inicio: d, camino: cam, pregunta: 'visibles' }), cam + ' visibles');
    assert.equal(motor.rodarCamino({ inicio: d, camino: cam, pregunta: 'visibles' }).respuesta, 14 + ida.final.arriba);
  }
});
test('circuito: el periodo es 1, 2, 3 o 4 y la respuesta sale de rodar vuelta por vuelta', () => {
  for (const vuelta of ['DAIF', 'DDAIIF', 'DDAAIIFF', 'AAIDFF', 'DAAIFF', 'IAAAD' + 'FFF']) {
    for (let k = 0; k < 6; k++) {
      const d = elegir(motor.posiciones()), N = ent(0, 40);
      let R;
      try { R = motor.circuito({ inicio: d, vuelta, vueltas: N }); } catch (e) { assert.match(e.message, /partida/); break; }
      assert.ok([1, 2, 3, 4].includes(R.periodo));
      let x = d; for (let j = 0; j < N; j++) x = motor.rodarCamino({ inicio: x, camino: vuelta }).final;
      assert.equal(R.respuesta, x.arriba);
      sinChoques(R, vuelta);
    }
  }
});
test('deducirCubo encuentra siempre el cubo de las vistas', () => {
  const N = motor.posiciones();
  for (let k = 0; k < 25; k++) {
    // un cubo marcado al azar: los puntajes 1 a 6 repartidos sin la regla del 7
    const v = [1, 2, 3, 4, 5, 6].sort(() => rnd() - .5), L = {}; C6.forEach((c, j) => { L[c] = v[j]; });
    // sus vistas: cualquier giro del cubo (los giros son los mismos que mueven al dado normal)
    const base = motor.dado({ arriba: 1, frente: 2 }), donde = {}; C6.forEach(c => { donde[base[c]] = c; });
    const vistas = Array.from({ length: 3 }, () => { const g = elegir(N); return ['arriba', 'frente', 'derecha'].map(c => L[donde[g[c]]]); });
    if (new Set(vistas.flat()).size < 6) continue;
    const R = motor.deducirCubo({ vistas });
    assert.ok(R.cubos >= 1);
    for (const c of C6) assert.ok(R.opuestas[L[c]].includes(L[OP[c]]), 'la opuesta verdadera está entre las posibles');
    if (R.cubos === 1) {
      const P = motor.deducirCubo({ vistas, cara: L.arriba });
      assert.equal(P.respuesta, L.abajo);
      sinChoques(P, 'cubo');
    }
  }
});
test('dominó: cuántas fichas y puntos hay; elegirFichas y cadenaDomino contra búsquedas aparte', () => {
  for (let m = 1; m <= 9; m++) {
    const R = motor.contarFichas({ max: m });
    assert.equal(R.respuesta, (m + 1) * (m + 2) / 2);
    assert.equal(R.puntos, m * (m + 1) * (m + 2) / 2);
    sinChoques(R, `dominó ${m}`);
  }
  for (const condicion of ['primo', 'par', 'impar', 'doble', 7, 9]) {
    const R = motor.contarFichas({ condicion });
    let n = 0; for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) { const s = a + b; if (condicion === 'primo' ? [2, 3, 5, 7, 11].includes(s) : condicion === 'par' ? s % 2 === 0 : condicion === 'impar' ? s % 2 === 1 : condicion === 'doble' ? a === b : s === condicion) n++; }
    assert.equal(R.respuesta, n, String(condicion));
    sinChoques(R, String(condicion));
  }
  // elegirFichas con k = 2: todas las parejas y sus vueltas
  const F = motor.fichas();
  for (const razon of [[1, 1], [2, 1], [3, 1], [3, 2]]) for (const extremo of ['min', 'max']) {
    let best = null;
    for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++)
      for (const a of [F[i], F[i].slice().reverse()]) for (const b of [F[j], F[j].slice().reverse()]) {
        if ((a[0] + b[0]) * razon[1] !== (a[1] + b[1]) * razon[0]) continue;
        const t = a[0] + a[1] + b[0] + b[1];
        if (best === null || (extremo === 'min' ? t < best : t > best)) best = t;
      }
    const R = motor.elegirFichas({ k: 2, razon, extremo });
    assert.equal(R.respuesta, best, `${razon} ${extremo}`);
    const sA = R.ejemplo.reduce((s, f) => s + f[0], 0), sB = R.ejemplo.reduce((s, f) => s + f[1], 0);
    assert.equal(sA * razon[1], sB * razon[0]);
    sinChoques(R, 'elegir');
  }
  // cadenas: el ejemplo empalma, no repite, respeta lo visible y suma el total
  for (const [cadena, total, ficha] of [[[[2, 5], null, null, [3, 6], null], 40, 2], [[[3, 1], null, null, null, [6, 4]], 35, 3], [[null, [1, 1], null, [4, 0]], 15, 0]]) {
    const R = motor.cadenaDomino({ cadena, total, ficha });
    const E = R.ejemplo;
    for (let i = 0; i + 1 < E.length; i++) assert.equal(E[i][1], E[i + 1][0]);
    assert.equal(new Set(E.map(([a, b]) => Math.min(a, b) + ',' + Math.max(a, b))).size, E.length);
    cadena.forEach((f, i) => { if (f) assert.deepEqual(E[i], f); });
    assert.equal(E.flat().reduce((a, b) => a + b, 0), total);
    assert.equal(E[ficha][0] + E[ficha][1], R.respuesta);
    sinChoques(R, 'cadena');
  }
});
test('lanzamientos y conteoPuntajes contra cuentas aparte', () => {
  for (let n = 1; n <= 4; n++) {
    assert.equal(motor.lanzamientos({ n, pregunta: 'resultados' }).respuesta, 6 ** n);
    assert.equal(motor.lanzamientos({ n, pregunta: 'sumas' }).respuesta, 5 * n + 1);
    assert.equal(motor.lanzamientos({ n, todos: 'impar', pregunta: 'resultados' }).respuesta, 3 ** n);
  }
  assert.equal(motor.lanzamientos({ n: 3, distintos: true, pregunta: 'resultados' }).respuesta, 120);
  for (let k = 0; k < 20; k++) {
    const n = ent(3, 15), c1 = ent(0, n), c3 = ent(0, n - c1), c5 = n - c1 - c3;
    const R = motor.conteoPuntajes({ n, valores: [1, 3, 5], total: c1 + 3 * c3 + 5 * c5 });
    assert.ok(R.soluciones.some(s => s[1] === c1 && s[3] === c3 && s[5] === c5));
    assert.equal(R.deficit, 5 * n - (c1 + 3 * c3 + 5 * c5));
  }
  // deducción: con las reglas de una solución conocida, esa solución sale siempre
  for (let k = 0; k < 20; k++) {
    const v = [1, 2, 3, 4, 5, 6].sort(() => rnd() - .5).slice(0, 4), S = { A: v[0], B: v[1], C: v[2], D: v[3] };
    const conds = [{ suma: ['A', 'B', 'C', 'D'], valor: v.reduce((a, b) => a + b, 0) }, S.A % 2 ? { impar: 'A' } : { par: 'A' }, S.B > S.C ? { mayor: ['B', 'C'] } : { mayor: ['C', 'B'] }];
    const R = motor.deducirPuntajes({ nombres: ['A', 'B', 'C', 'D'], condiciones: conds });
    assert.ok(R.soluciones.some(s => s.A === S.A && s.B === S.B && s.C === S.C && s.D === S.D));
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.rodar(motor.dado({ arriba: 1, frente: 2 }), 'arriba'), /rueda/);
  assert.throws(() => motor.dado({ arriba: 1, frente: 6 }), /opuestas/);
  assert.throws(() => motor.dado({ arriba: 1, frente: 2, derecha: 5 }), /no pueden verse/);
  assert.throws(() => motor.dado({ arriba: 1, abajo: 5, frente: 2, atras: 6, derecha: 3, izquierda: 4 }), /sumar 7/);
  assert.throws(() => motor.optimizarDados({ dados: [[0, 0, 1]] }), /aire/);
  assert.throws(() => motor.optimizarDados({ dados: [[0, 0, 0], [0, 0, 0]] }), /misma casilla/);
  assert.throws(() => motor.optimizarDados({ dados: [[0, 0, 0]], objetivo: 'todo' }), /objetivo/);
  assert.throws(() => motor.optimizarDados({ dados: [[0, 0, 0]], condicion: { color: 1 } }), /condición/);
  assert.throws(() => motor.optimizarDados({ dados: [[0, 0, 0]], condicion: { productoArriba: 7 } }), /ninguna/);
  assert.throws(() => motor.rodarCamino({ inicio: { arriba: 1, frente: 2 }, camino: 'DX' }), /letra/);
  assert.throws(() => motor.circuito({ inicio: { arriba: 1, frente: 2 }, vuelta: 'DD', vueltas: 3 }), /partida/);
  assert.throws(() => motor.deducirCubo({ vistas: [[1, 2, 3]] }), /6 marcas/);
  assert.throws(() => motor.cadenaDomino({ cadena: [[1, 2], [3, 4]], total: 10, ficha: 0 }), /empalman|retirada/);
  assert.throws(() => motor.cadenaDomino({ cadena: [[1, 2], null, [5, 4]], total: 99, ficha: 1 }), /ninguna/);
  assert.throws(() => motor.elegirFichas({ k: 3, razon: [1] }), /razon/);
  assert.throws(() => motor.lanzamientos({ n: 2, todos: 'primo' }), /todos/);
  assert.throws(() => motor.deducirPuntajes({ nombres: ['A'], condiciones: [{ par: 'Z' }] }), /no es uno/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
