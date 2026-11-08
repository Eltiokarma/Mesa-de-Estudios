// Pruebas del motor de «La rueda, el camino y la lámina que gira». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija) y con métodos que no usan las fórmulas del motor:
//    - el camino del centro está siempre a distancia r del piso (se mide punto por punto) y es continuo; su largo es
//      el piso − 2r·tan(δ/2) por cada esquina que entra + r·δ por cada esquina que sale (± r·θ en los arcos);
//    - los toques del punto pintado se cuentan girando la rueda de a poquito;
//    - el recorrido de un punto de un polígono que vuelca es el largo de la curva que dibuja (volcarEn de a poquito);
//      los radios son las distancias reales al pivote, y tras un vuelco la figura queda apoyada en el piso;
//    - el área de una región barrida se mide contando puntos de una cuadrícula que caen en alguna de las copias
//      giradas de la lámina; el perímetro coincide con perimetroUnion;
//    - las láminas y los giros del plano se comprueban con senos y cosenos;
//    - en el marco, el polígono nunca se sale, cada giro termina con otro vértice en el marco, y tras 'periodo' giros
//      todo vuelve a estar como al inicio;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden') ni con otro error.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? datos.tolerancia : tol;
  if (esperado === null) { assert.equal(real, null, que); return; }
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k || fn}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'rodamientos');
  assert.ok(datos.casos.length >= 18 && datos.casos.length <= 30);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const igual = (a, b) => (typeof a === 'number' ? casi(a, b) : JSON.stringify(a) === JSON.stringify(b));
function sinChoques(R, correcto, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  assert.ok(R.repetidos && typeof R.repetidos === 'object', `${que}: falta repetidos`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!igual(v, correcto), `${que}: el error ${k} da la respuesta`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!igual(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
  if (R.exactos) for (const k of Object.keys(R.errores)) assert.equal(typeof R.exactos[k], 'string', `${que}: falta el exacto de ${k}`);
}
// el valor de un exacto, leído del texto (sin usar el motor): '(10 + 5√2)π/3', '11 + π', '10 − 2√3/3 + π/3'
function leer(t) {
  let s = t.replace(/−/g, '-').replace(/\s/g, '');
  s = s.replace(/(\d)√(\d+)/g, '$1*Math.sqrt($2)').replace(/√(\d+)/g, 'Math.sqrt($1)');
  s = s.replace(/(\d|\))π/g, '$1*Math.PI').replace(/(\))(Math)/g, '$1*$2').replace(/π/g, 'Math.PI');
  return Function(`return (${s});`)();
}
test('leer: los exactos se leen bien', () => {
  assert.ok(casi(leer('(10 + 5√2)π/3'), (10 + 5 * Math.SQRT2) * Math.PI / 3));
  assert.ok(casi(leer('11 + π'), 11 + Math.PI));
  assert.ok(casi(leer('10 − 2√3/3 + π/3'), 10 - 2 * Math.sqrt(3) / 3 + Math.PI / 3));
  assert.ok(casi(leer('4 + (1 + √2)π'), 4 + (1 + Math.SQRT2) * Math.PI));
  assert.ok(casi(leer('5√2π/3'), 5 * Math.SQRT2 * Math.PI / 3));
});

// --- recorrido del centro: distancia al piso punto por punto ---
function distPiso(piso, p) {
  let m = Infinity;
  for (const q of piso) {
    if (q.tipo === 'linea') {
      const dx = q.b[0] - q.a[0], dy = q.b[1] - q.a[1], s = Math.max(0, Math.min(1, ((p[0] - q.a[0]) * dx + (p[1] - q.a[1]) * dy) / (dx * dx + dy * dy)));
      m = Math.min(m, Math.hypot(q.a[0] + s * dx - p[0], q.a[1] + s * dy - p[1]));
    } else {
      // distancia a un arco: al círculo si el ángulo cae en el arco; si no, a sus puntas
      const ang = Math.atan2(p[1] - q.c[1], p[0] - q.c[0]), lo = Math.min(q.a0, q.a1), hi = Math.max(q.a0, q.a1);
      const dentro = [-2, -1, 0, 1, 2].some(k => ang + 2 * Math.PI * k >= lo - 1e-12 && ang + 2 * Math.PI * k <= hi + 1e-12);
      if (dentro) m = Math.min(m, Math.abs(Math.hypot(p[0] - q.c[0], p[1] - q.c[1]) - q.radio));
      for (const a of [q.a0, q.a1]) m = Math.min(m, Math.hypot(q.c[0] + q.radio * Math.cos(a) - p[0], q.c[1] + q.radio * Math.sin(a) - p[1]));
    }
  }
  return m;
}
function revisarCamino(r, camino, cerrado, que) {
  const R = motor.recorridoCentro({ r, camino, cerrado });
  // largo medido sobre el trazo, punto por punto, y distancia al piso
  let largo = 0, ant = null;
  const N = 4000, total = R.trazo.reduce((s, p) => s + p.largo, 0), ss = [];
  for (let i = 0; i <= N; i++) ss.push(total * i / N);
  let acum = 0; for (const p of R.trazo) { acum += p.largo; ss.push(Math.min(total, acum)); }
  ss.sort((a, b) => a - b);
  for (const s0 of ss) {
    const q = motor.puntoEnTrazo({ trazo: R.trazo, s: s0 }), p = [q.x, q.y];
    assert.ok(Math.abs(distPiso(R.piso, p) - r) < 1e-7, `${que}: el centro no está a r del piso en s = ${s0}`);
    if (ant) { const d = Math.hypot(p[0] - ant[0], p[1] - ant[1]); assert.ok(d < 5 * total / N, `${que}: el trazo salta`); largo += d; }
    ant = p;
  }
  assert.ok(Math.abs(largo - R.longitud) < 1e-4 * Math.max(1, R.longitud), `${que}: largo medido ${largo}, motor ${R.longitud}`);
  // la cuenta por esquinas, hecha aquí aparte
  const TAN = { 30: 2 - Math.sqrt(3), 45: Math.SQRT2 - 1, 60: 1 / Math.sqrt(3), 90: 1, 120: Math.sqrt(3), 135: Math.SQRT2 + 1, 150: 2 + Math.sqrt(3) };
  let cuenta = 0;
  for (const t of camino) {
    if (t.tipo === 'recta') cuenta += t.largo;
    else if (t.tipo === 'esquina') cuenta += t.clase === 'sale' ? r * t.angulo * Math.PI / 180 : -2 * r * TAN[t.angulo];
    else cuenta += (t.lado === 'dentro' ? t.R - r : t.R + r) * t.angulo * Math.PI / 180;
  }
  assert.ok(casi(cuenta, R.longitud), `${que}: la cuenta por esquinas da ${cuenta}`);
  assert.ok(casi(leer(R.exacto), R.longitud), `${que}: el exacto ${R.exacto} no da ${R.longitud}`);
  sinChoques(R, R.longitud, que);
  for (const [k, t] of Object.entries(R.exactos)) assert.ok(casi(leer(t), R.errores[k]), `${que}: el exacto de ${k}`);
  return R;
}
test('recorrido del centro: los caminos de la escena, a distancia r del piso y con la cuenta por esquinas', () => {
  for (const [k, c] of Object.entries(motor.caminos)) for (const r of [0.5, 1]) revisarCamino(r, c, k === 'pizza', `${k} con r = ${r}`);
});
test('recorrido del centro: caminos al azar de escalones, bloques y rampas', () => {
  for (let k = 0; k < 25; k++) {
    const r = [0.5, 1, 1.5][ent(0, 2)], cam = [{ tipo: 'recta', largo: ent(3, 6) }];
    const n = ent(1, 4);
    for (let j = 0; j < n; j++) {
      const ang = [45, 60, 90][ent(0, 2)], alto = ent(3, 6), ancho = ent(4, 7);
      if (rnd() < .5) cam.push({ tipo: 'esquina', angulo: ang, clase: 'entra' }, { tipo: 'recta', largo: alto }, { tipo: 'esquina', angulo: ang, clase: 'sale' }, { tipo: 'recta', largo: ancho },
        { tipo: 'esquina', angulo: ang, clase: 'sale' }, { tipo: 'recta', largo: alto }, { tipo: 'esquina', angulo: ang, clase: 'entra' }, { tipo: 'recta', largo: ancho });
      else cam.push({ tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'arco', R: ent(3, 5), angulo: 180, lado: 'dentro' }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: ancho });
    }
    revisarCamino(r, cam, false, `camino al azar ${k}`);
  }
});
test('recorrido del centro: alrededor de un polígono convexo, el perímetro más 2πr', () => {
  for (let k = 0; k < 10; k++) {
    const r = ent(1, 3), a = ent(3, 8), b = ent(3, 8);
    const cam = [];
    for (const L of [a, b, a, b]) cam.push({ tipo: 'recta', largo: L }, { tipo: 'esquina', angulo: 90, clase: 'sale' });
    const R = revisarCamino(r, cam, true, `rectángulo ${a} × ${b}`);
    assert.ok(casi(R.longitud, 2 * (a + b) + 2 * Math.PI * r));
  }
});

// --- toques del punto pintado ---
test('toques del punto: se cuentan girando la rueda de a poquito', () => {
  for (let k = 0; k < 40; k++) {
    const r = ent(1, 5), n = ent(1, 8), falta = [0, 90, 180, 270, 45, 120][ent(0, 5)], ini = rnd() < .5;
    const R = motor.toquesPiso({ r, n, falta, cuentaInicial: ini });
    // el punto está en el ángulo 'falta' antes del contacto; contamos cuántas veces llega al contacto
    const paso = 0.25; let giro = 0, toques = falta === 0 && ini ? 1 : 0, ang = falta === 0 ? 360 : falta;
    while (toques < n) { giro += paso; ang -= paso; if (ang <= 1e-9) { toques++; ang += 360; } }
    assert.ok(casi(giro, R.giro), `r ${r}, n ${n}, falta ${falta}: ${giro} contra ${R.giro}`);
    assert.ok(casi(R.recorrido, giro / 360 * 2 * Math.PI * r));
    assert.ok(casi(leer(R.exacto), R.recorrido));
    sinChoques(R, R.recorrido, 'toques');
  }
});

// --- polígonos que vuelcan ---
function largoCurva(fig, piso, vuelcos, punto) {
  let L = 0, ant = null;
  const N = 600 * vuelcos;
  for (let i = 0; i <= N; i++) {
    const p = motor.volcarEn({ figura: fig, piso, t: vuelcos * i / N, punto }).punto;
    if (ant) L += Math.hypot(p[0] - ant[0], p[1] - ant[1]);
    ant = p;
  }
  return L;
}
function revisarVuelco(fig, piso, vuelcos, punto, que) {
  const R = motor.volcar({ figura: fig, piso, vuelcos, punto });
  const L = largoCurva(fig, piso, vuelcos, punto);
  assert.ok(Math.abs(L - R.longitud) < 1e-4 * Math.max(1, R.longitud), `${que}: la curva mide ${L}, el motor da ${R.longitud}`);
  assert.ok(casi(leer(R.exacto), R.longitud), `${que}: exacto`);
  // radios: distancia real al pivote, antes de cada vuelco
  R.pivotes.forEach((c, j) => {
    const p = R.posiciones[j];
    assert.ok(casi(Math.hypot(p[0] - c[0], p[1] - c[1]), R.radios[j], 1e-7), `${que}: radio ${j}`);
    assert.ok(casi(leer(R.radiosExactos[j]), R.radios[j]), `${que}: radio exacto ${j}`);
  });
  // tras cada vuelco, la figura queda apoyada: dos vértices en el piso (recta) o en el polígono de abajo
  for (let j = 1; j <= vuelcos; j++) {
    const E = motor.volcarEn({ figura: fig, piso, t: j });
    if (!piso || piso === 'recta') {
      assert.equal(E.vertices.filter(v => Math.abs(v[1]) < 1e-7).length, 2, `${que}: apoyada tras el vuelco ${j}`);
      assert.ok(E.vertices.every(v => v[1] > -1e-7), `${que}: no se hunde`);
    } else {
      const en = E.vertices.filter(v => E.piso.some(q => Math.hypot(q[0] - v[0], q[1] - v[1]) < 1e-7)).length;
      assert.equal(en, 2, `${que}: dos vértices sobre esquinas del piso tras el vuelco ${j}`);
    }
  }
  sinChoques(R, R.longitud, que);
  for (const [k, t] of Object.entries(R.exactos)) assert.ok(casi(leer(t), R.errores[k]), `${que}: el exacto de ${k}`);
  return R;
}
test('vuelcos de polígonos regulares sobre una recta y sobre otro polígono', () => {
  for (const n of [3, 4, 6]) for (const p of [0, 1, 2]) revisarVuelco({ regular: n, lado: 2 }, 'recta', n, p, `regular ${n}, punto ${p}`);
  for (const [n, m] of [[4, 6], [3, 4], [4, 4], [3, 6], [6, 6], [4, 8]]) revisarVuelco({ regular: n, lado: 1 }, { regular: m }, Math.min(m, 2 * n), 0, `${n} sobre ${m}`);
  revisarVuelco({ regular: 6, lado: 2 }, 'recta', 6, [1, Math.sqrt(3)], 'centro del hexágono');
});
test('vuelcos de trapecios y otras láminas con ángulos distintos', () => {
  const figs = [motor.figuras.trapecio60, motor.figuras.trapecioRecto, [[0, 0], [3, 0], [3, 2], [0, 2]], [[0, 0], [6, 0], [3, 3]], [[0, 0], [4, 0], [4, 4], [2, 6], [0, 4]]];
  for (const v of figs) for (const p of [0, 2]) revisarVuelco({ vertices: v }, 'recta', v.length + 1, p, `figura ${JSON.stringify(v)}`);
});
test('superficie de una arista: el recorrido por el largo', () => {
  for (const n of [3, 4, 6]) {
    const h = ent(2, 9), R = motor.volcar({ figura: { regular: n, lado: 2 }, vuelcos: n, largo: h });
    assert.ok(casi(R.superficie, R.longitud * h));
    assert.ok(casi(leer(R.superficieExacto), R.superficie));
    sinChoques(R, R.superficie, `prisma ${n}`);
  }
});

// --- regiones barridas ---
function areaGrilla(figura, centro, angulo, sentido) {
  const O = figura[centro], s = sentido === 'horario' ? -1 : 1, copias = [];
  for (let k = 0; k <= 720; k++) copias.push(motor.girarFigura({ puntos: figura, centro: O, angulo: s * angulo * k / 720 }));
  const dentro = (p, pol) => { let d = false; for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) { const a = pol[i], b = pol[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) d = !d; } return d; };
  const R = Math.max(...figura.map(p => Math.hypot(p[0] - O[0], p[1] - O[1]))), N = 260, h = 2 * R / N;
  let n = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const p = [O[0] - R + (i + 0.5) * h, O[1] - R + (j + 0.5) * h];
    if (copias.some(c => dentro(p, c))) n++;
  }
  return n * h * h;
}
test('regiones barridas por una lámina: área por cuadrícula y perímetro por perimetroUnion', () => {
  const casos = [[motor.figuras.rectangulo, 0, 90], [motor.figuras.rectangulo, 1, 120], [[[0, 0], [9, 0], [9, 12], [5, 12]], 0, 90], [motor.figuras.trapecio60, 0, 60],
    [[[0, 0], [8, 0], [8, 6], [0, 6]], 0, 60], [motor.figuras.trapecioRecto, 0, 150]];
  for (const [f, c, a] of casos) {
    const R = motor.barridoLamina({ figura: f, centro: c, angulo: a });
    assert.ok(R.exacto !== null, `${JSON.stringify(f)}: sin exacto`);
    assert.ok(casi(leer(R.exacto), R.perimetro));
    assert.ok(Math.abs(R.perimetroUnion - R.perimetro) < 1e-3 * R.perimetro);
    const A = areaGrilla(f, c, a);
    assert.ok(Math.abs(A - R.area) < 0.02 * R.area, `${JSON.stringify(f)}: área ${A} contra ${R.area}`);
    sinChoques(R, R.perimetro, 'lámina');
  }
});
test('región que barre un lado y la arista del cubo', () => {
  const R = motor.barridoSegmento({ figura: motor.figuras.rectangulo, centro: 0, angulo: 180, lado: [2, 3] });
  assert.ok(casi(R.perimetro, 8 + 8 * Math.PI));
  assert.ok(casi(R.area, Math.PI * (25 - 9) / 2));
  sinChoques(R, R.perimetro, 'lado');
  const C = motor.barridoArista({ figura: { regular: 4, lado: 2 }, vuelcos: 1, lado: [3, 0] });
  assert.ok(casi(C.perimetro, 4 + (1 + Math.SQRT2) * Math.PI));
  sinChoques(C, C.perimetro, 'cubo');
  // dos cuartos de círculo que se enciman: 3 + π/3 (las dos rectas de pie, el piso y dos arcos de 30°)
  const U = motor.perimetroUnion({ piezas: [{ tipo: 'segmento', puntos: [[3, 1], [3, 0]], centro: [3, 0], angulo: -90 }, { tipo: 'segmento', puntos: [[3, 0], [4, 0]], centro: [4, 0], angulo: -90 }] });
  assert.ok(Math.abs(U.perimetro - (3 + Math.PI / 3)) < 1e-5);
  // si la rueda choca con el camino (una pared que se inclina sobre ella), el motor avisa
  const S = (a, c) => ({ tipo: 'esquina', angulo: a, clase: c }), L = x => ({ tipo: 'recta', largo: x });
  assert.throws(() => motor.recorridoCentro({ r: 1, camino: [L(4), S(90, 'entra'), L(6), S(90, 'sale'), L(1), S(90, 'sale'), L(4.5), S(90, 'sale'), L(3)] }), /choca/);
});

// --- láminas y plano ---
function girarTrig(c, f, n, grados) {          // casilla (c, f) con la fila hacia abajo; grados positivos = horario
  const x = c - (n - 1) / 2, y = -(f - (n - 1) / 2), a = -grados * Math.PI / 180;
  const X = x * Math.cos(a) - y * Math.sin(a), Y = x * Math.sin(a) + y * Math.cos(a);
  return [Math.round(X + (n - 1) / 2), Math.round(-Y + (n - 1) / 2)];
}
const orden = cs => cs.map(c => c.join(',')).sort().join(' ');
test('láminas: el resultado sale igual girando con senos y cosenos', () => {
  for (let k = 0; k < 60; k++) {
    const n = ent(2, 5), L = [];
    for (let j = 0; j < ent(1, 3); j++) {
      const m = []; for (let q = 0; q < ent(1, 3); q++) m.push([ent(0, n - 1), ent(0, n - 1)]);
      L.push({ marcas: m, angulo: 90 * ent(0, 14), sentido: rnd() < .5 ? 'horario' : 'antihorario' });
    }
    const fin = { angulo: 90 * ent(0, 14), sentido: rnd() < .5 ? 'horario' : 'antihorario' };
    const R = motor.laminas({ n, laminas: L, final: fin });
    const g = (o) => (o.sentido === 'horario' ? 1 : -1) * o.angulo;
    const sup = [].concat(...L.map(l => l.marcas.map(([c, f]) => girarTrig(c, f, n, g(l)))));
    const res = sup.map(([c, f]) => girarTrig(c, f, n, g(fin)));
    assert.equal(orden(R.resultado), orden([...new Map(res.map(c => [c.join(','), c])).values()]));
    sinChoques(R, R.resultado, 'láminas');
  }
});
test('giros en el plano cartesiano: con senos y cosenos', () => {
  for (let k = 0; k < 60; k++) {
    const P = [[ent(-5, 5), ent(-5, 5)], [ent(-5, 5), ent(-5, 5)], [ent(-5, 5), ent(-5, 5)]], C = [ent(-3, 3), ent(-3, 3)];
    const ang = 90 * ent(0, 12), sentido = rnd() < .5 ? 'horario' : 'antihorario', pide = ['x', 'y', 'xy'][ent(0, 2)];
    const R = motor.rotarPuntos({ puntos: P, angulo: ang, sentido, centro: C, pide });
    const a = (sentido === 'horario' ? -1 : 1) * ang * Math.PI / 180;
    const N = P.map(([x, y]) => [Math.round(C[0] + (x - C[0]) * Math.cos(a) - (y - C[1]) * Math.sin(a)) + 0, Math.round(C[1] + (x - C[0]) * Math.sin(a) + (y - C[1]) * Math.cos(a)) + 0]);
    assert.deepEqual(R.nuevos, N);
    assert.equal(R.respuesta, N.reduce((s, p) => s + (pide === 'x' ? p[0] : pide === 'y' ? p[1] : p[0] + p[1]), 0));
    sinChoques(R, R.respuesta, 'plano');
  }
});

// --- el marco ---
test('giros dentro de un marco: nunca se sale, cada giro termina tocando, y el período devuelve todo', () => {
  for (const [n, l, W, H] of [[3, 1, 1, 1], [3, 1, 2, 2], [3, 1, 2, 1], [4, 1, 3, 2], [4, 1, 2, 2], [4, 1, 3, 3]]) {
    const R = motor.girosMarco({ n, lado: l, ancho: W, alto: H, pasos: 0 });
    for (let t = 0; t <= R.periodo; t += 0.125) {
      const E = motor.marcoEn({ n, lado: l, ancho: W, alto: H, t });
      assert.ok(E.vertices.every(p => p[0] > -1e-7 && p[0] < W + 1e-7 && p[1] > -1e-7 && p[1] < H + 1e-7), `${n} en ${W} × ${H}: se sale en t = ${t}`);
      if (Number.isInteger(t)) {
        const enMarco = E.vertices.filter(p => Math.abs(p[0]) < 1e-7 || Math.abs(p[0] - W) < 1e-7 || Math.abs(p[1]) < 1e-7 || Math.abs(p[1] - H) < 1e-7).length;
        assert.ok(enMarco >= 2, `${n} en ${W} × ${H}: apoyado en t = ${t}`);
      }
    }
    const A = motor.marcoEn({ n, lado: l, ancho: W, alto: H, t: 0 }).vertices, B = motor.marcoEn({ n, lado: l, ancho: W, alto: H, t: R.periodo }).vertices;
    A.forEach((p, i) => assert.ok(Math.hypot(p[0] - B[i][0], p[1] - B[i][1]) < 1e-6, `${n} en ${W} × ${H}: período`));
    assert.equal(R.periodo % R.periodoLugar, 0);
    for (let N = 0; N < 3 * R.periodo; N += 1 + ent(0, 4)) {
      const S = motor.girosMarco({ n, lado: l, ancho: W, alto: H, pasos: N, esquina: ['abajo-izquierda', 'abajo-derecha', 'arriba-derecha', 'arriba-izquierda'][ent(0, 3)] });
      sinChoques(S, S.respuesta, 'marco');
    }
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.recorridoCentro({ r: 0, camino: motor.caminos.bloque }), /radio/);
  assert.throws(() => motor.recorridoCentro({ r: 3, camino: motor.caminos.bloque }), /corta/);
  assert.throws(() => motor.recorridoCentro({ r: 1, camino: [{ tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'arco', R: 2, angulo: 90 }] }), /recta a cada lado/);
  assert.throws(() => motor.recorridoCentro({ r: 1, camino: [{ tipo: 'arco', R: 1, angulo: 90, lado: 'dentro' }] }), /menor que R/);
  assert.throws(() => motor.recorridoCentro({ r: 1, camino: [{ tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }], cerrado: true }), /no vuelve/);
  assert.throws(() => motor.toquesPiso({ r: 1, n: 0 }), /toques/);
  assert.throws(() => motor.toquesPiso({ r: 1, n: 2, falta: 360 }), /menor que 360/);
  assert.throws(() => motor.volcar({ figura: { vertices: [[0, 0], [2, 0], [0, 2], [2, 2]] } }), /antihorario|convexa/);
  assert.throws(() => motor.volcar({ figura: { vertices: motor.figuras.trapecio60 }, piso: { regular: 6 } }), /lados iguales/);
  assert.throws(() => motor.barridoLamina({ figura: motor.figuras.rectangulo, centro: 0, angulo: 360 }), /menor que 360/);
  assert.throws(() => motor.barridoLamina({ figura: [[0, 0], [2, 0], [2, 2], [0, 2]], centro: 0, angulo: 90 }) && motor.barridoLamina({ figura: [[0, 0], [2, 0], [1, 3]], centro: 2, angulo: 90 }), /uno solo/);
  assert.throws(() => motor.barridoSegmento({ figura: motor.figuras.rectangulo, centro: 0, angulo: 90, lado: [1, 3] }), /seguidos/);
  assert.throws(() => motor.laminas({ n: 3, laminas: [{ marcas: [[0, 0]], angulo: 45 }] }), /múltiplo de 90/);
  assert.throws(() => motor.laminas({ n: 3, laminas: [{ marcas: [[3, 0]], angulo: 90 }] }), /casilla/);
  assert.throws(() => motor.rotarPuntos({ puntos: [[0.5, 1]], angulo: 90 }), /enteras/);
  assert.throws(() => motor.girosMarco({ n: 5, lado: 1, ancho: 2 }), /3, 4 o 6/);
  assert.throws(() => motor.girosMarco({ n: 4, lado: 3, ancho: 2 }), /no cabe/);
});

// 4. papel.json
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length >= 2, p.id);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: sin verificar`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id); });
