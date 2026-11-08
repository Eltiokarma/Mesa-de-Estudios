// Pruebas del motor de «La hoja que se dobla, se corta y se voltea». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija), contra cálculos hechos aquí sin el motor:
//    - doblar: las capas cubren el área de la hoja; doblar k veces por la mitad da 2^k capas; cada celda viaja entera.
//    - con cortes rectangulares alineados a la cuadrícula, el perímetro y las piezas se recuentan aquí punto por
//      punto, plegando cada punto de la hoja doblez por doblez (sin las celdas del motor);
//    - un agujero redondo lejos de los dobleces da tantos agujeros como capas y suma 2πr por capa;
//    - los agujeros que salen son simétricos respecto de los dobleces por la mitad;
//    - esquina sobre esquina: EA = EC, el doblez lleva C a A, y ladoDesdeDoblez deshace esquinaSobreEsquina;
//    - la loseta: simetría central = giro de 180° = dos reflexiones perpendiculares por O; dos veces vuelve;
//    - fichas: la búsqueda en anchura coincide con una búsqueda por profundidad creciente hecha aquí; la paridad.
// 3. Ningún error típico coincide con la respuesta correcta en las predicciones de la escena.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  if (espera === null || typeof espera !== 'object' || Array.isArray(espera)) { cerca(r, espera, que); return; }
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'papel-doblado');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 30);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera !== undefined, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const ent = (a, b) => a + Math.floor(rnd() * (b - a + 1));

// plegado de un punto, hecho aquí: doblez por doblez, si está del lado que se mueve, se refleja
function plegar(P, dobleces) {
  let { x, y } = P;
  for (const d of dobleces) {
    let a, b, c;
    if (d.recta.x !== undefined) { a = 1; b = 0; c = -d.recta.x; } else if (d.recta.y !== undefined) { a = 0; b = 1; c = -d.recta.y; } else { a = -d.recta.m; b = 1; c = -d.recta.n; }
    const n = Math.hypot(a, b); a /= n; b /= n; c /= n;
    const lado = { derecha: Math.sign(a), izquierda: -Math.sign(a), arriba: Math.sign(b), abajo: -Math.sign(b) }[d.mueve];
    const v = a * x + b * y + c;
    if (lado * v > 0) { x -= 2 * v * a; y -= 2 * v * b; }
  }
  return { x, y };
}
// dobleces por la mitad al azar sobre una hoja W × H (verticales u horizontales), con el paquete que va quedando
function doblecesAzar(W, H, k) {
  const out = []; let x0 = 0, x1 = W, y0 = 0, y1 = H;
  for (let i = 0; i < k; i++) {
    const vert = (x1 - x0) % 2 === 0 && ((y1 - y0) % 2 !== 0 || rnd() < 0.5);
    if (vert && (x1 - x0) % 2 === 0) { const m = (x0 + x1) / 2, der = rnd() < 0.5; out.push({ recta: { x: m }, mueve: der ? 'derecha' : 'izquierda' }); if (der) x1 = m; else x0 = m; }
    else if ((y1 - y0) % 2 === 0) { const m = (y0 + y1) / 2, arr = rnd() < 0.5; out.push({ recta: { y: m }, mueve: arr ? 'arriba' : 'abajo' }); if (arr) y1 = m; else y0 = m; }
  }
  return { dobleces: out, caja: [x0, x1, y0, y1] };
}

test('doblar: las capas cubren el área de la hoja y k dobleces por la mitad dan 2^k capas', () => {
  for (let n = 0; n < 60; n++) {
    const W = 2 * ent(2, 6), H = 2 * ent(2, 6), { dobleces } = doblecesAzar(W, H, ent(1, 3));
    const r = motor.doblar({ ancho: W, alto: H }, dobleces);
    const A = r.celdas.reduce((s, c) => s + Math.abs(motor._interno.area(c.img)), 0);
    cerca(A, W * H, 'área total');
    assert.equal(r.capas, 2 ** dobleces.length, 'capas');
    // cada celda es la hoja movida entera: la isometría lleva poli a img y conserva distancias
    for (const c of r.celdas) c.poli.forEach((P, i) => { const Q = motor._interno.ap(c.g, P); cerca(Q.x, c.img[i].x, 'img x'); cerca(Q.y, c.img[i].y, 'img y'); });
    // y coincide con el plegado punto por punto
    for (const c of r.celdas) { const cx = c.poli.reduce((s, P) => s + P.x, 0) / c.poli.length, cy = c.poli.reduce((s, P) => s + P.y, 0) / c.poli.length;
      const a = plegar({ x: cx, y: cy }, dobleces), b = motor._interno.ap(c.g, { x: cx, y: cy }); cerca(a.x, b.x, 'plegar x'); cerca(a.y, b.y, 'plegar y'); }
  }
});

// recuento independiente en una rejilla de 1/8 (los cortes van en múltiplos de 1/2): perímetro y piezas
function recuento(W, H, dobleces, rects, tajosV) {
  const h = 1 / 8, nx = W / h, ny = H / h, papelEn = new Uint8Array(nx * ny);
  const F = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const P = plegar({ x: (i + 0.5) * h, y: (j + 0.5) * h }, dobleces);
    F.push(P);
    papelEn[j * nx + i] = rects.some(([x0, x1, y0, y1]) => P.x > x0 && P.x < x1 && P.y > y0 && P.y < y1) ? 0 : 1;
  }
  const separa = (p, q) => tajosV.some(xc => (F[p].x - xc) * (F[q].x - xc) < 0 && Math.abs(F[p].y - F[q].y) < h * 1.5);
  let borde = 0;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const p = j * nx + i; if (!papelEn[p]) continue;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, b = j + dj;
      if (a < 0 || b < 0 || a >= nx || b >= ny) { borde++; continue; }
      const q = b * nx + a;
      if (!papelEn[q] || separa(p, q)) borde++;
    }
  }
  const visto = new Uint8Array(nx * ny); let piezas = 0;
  for (let s = 0; s < nx * ny; s++) {
    if (!papelEn[s] || visto[s]) continue; piezas++; const pila = [s]; visto[s] = 1;
    while (pila.length) { const p = pila.pop(), i = p % nx, j = (p - i) / nx;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= nx || b >= ny) continue; const q = b * nx + a;
        if (papelEn[q] && !visto[q] && !separa(p, q)) { visto[q] = 1; pila.push(q); } } }
  }
  return { perimetro: borde * h, piezas };
}
test('desplegar: perímetro y piezas con cortes rectangulares coinciden con el recuento punto por punto', () => {
  for (let n = 0; n < 40; n++) {
    const W = 2 * ent(2, 4), H = 2 * ent(2, 4), { dobleces, caja } = doblecesAzar(W, H, ent(1, 2));
    const [x0, x1, y0, y1] = caja, rects = [], cortes = [], tajos = [];
    // un rectángulo de esquinas en x,25 o x,75 (nunca sobre un doblez ni un borde), que puede salirse del paquete (cruzando un doblez o un borde)
    const a = x0 + ent(-1, 2 * (x1 - x0)) / 2 + 0.25, b = a + ent(1, 4) / 2, c = y0 + ent(-1, 2 * (y1 - y0)) / 2 + 0.25, d = c + ent(1, 4) / 2;
    rects.push([a, b, c, d]);
    cortes.push({ tipo: 'poligono', puntos: [{ x: a, y: c }, { x: b, y: c }, { x: b, y: d }, { x: a, y: d }] });
    if (rnd() < 0.5) { const xc = x0 + ent(0, x1 - x0 - 1) + 0.5; if (xc < x1) { tajos.push(xc); cortes.push({ tipo: 'linea', A: { x: xc, y: y0 - 1 }, B: { x: xc, y: y1 + 1 } }); } }
    const r = motor.desplegar({ ancho: W, alto: H }, dobleces, cortes), q = recuento(W, H, dobleces, rects, tajos);
    cerca(r.perimetro.valor, q.perimetro, `perímetro (${JSON.stringify(cortes)})`, 1e-6);
    assert.equal(r.piezas, q.piezas, `piezas (${JSON.stringify(cortes)})`);
  }
});

test('desplegar: un agujero redondo lejos de los dobleces da un agujero por capa y suma 2πr por capa', () => {
  for (let n = 0; n < 40; n++) {
    const W = 2 * ent(3, 6), H = 2 * ent(3, 6), { dobleces, caja } = doblecesAzar(W, H, ent(1, 3));
    const [x0, x1, y0, y1] = caja, r = 0.25;
    if (x1 - x0 < 1 || y1 - y0 < 1) continue;
    const C = { x: x0 + 0.5 + rnd() * (x1 - x0 - 1), y: y0 + 0.5 + rnd() * (y1 - y0 - 1) };
    const d = motor.desplegar({ ancho: W, alto: H }, dobleces, [{ tipo: 'circulo', centro: C, r }]);
    const k = motor.capasEn({ ancho: W, alto: H }, dobleces, C);
    assert.equal(d.agujeros, k); assert.equal(d.copias[0], k);
    cerca(d.perimetro.valor, 2 * (W + H) + k * 2 * Math.PI * r, 'perímetro', 1e-9);
    assert.equal(d.errores.unaCapa.agujeros, 1);
    // los centros de los agujeros (centro de cada hueco en la hoja) se pliegan todos al centro del corte
    for (const ce of d.celdas) for (const hu of ce.huecos) { const m = hu.reduce((s, P) => ({ x: s.x + P.x / hu.length, y: s.y + P.y / hu.length }), { x: 0, y: 0 }); const p = plegar(m, dobleces); cerca(p.x, C.x, 'centro x', 1e-6); cerca(p.y, C.y, 'centro y', 1e-6); }
  }
});

test('desplegar: un medio círculo sobre un doblez se abre en un círculo entero (2 capas por agujero)', () => {
  for (let n = 0; n < 20; n++) {
    const W = 2 * ent(3, 6), H = 2 * ent(2, 5), m = W / 2, yc = 0.75 + rnd() * (H - 1.5);
    const d = motor.desplegar({ ancho: W, alto: H }, [{ recta: { x: m }, mueve: 'derecha' }], [{ tipo: 'circulo', centro: { x: m, y: yc }, r: 0.5 }]);
    assert.equal(d.agujeros, 1); assert.equal(d.agujerosDetalle[0].celdas, 2);
    cerca(d.perimetro.valor, 2 * (W + H) + Math.PI, 'perímetro');
    cerca(d.errores.tramosDelDoblez.valor, 2 * (W + H) + Math.PI + 2, 'con el diámetro dos veces');
  }
});

test('pose: en t = 0 la celda está como antes del doblez y en t = 1 como después', () => {
  const D = [{ recta: { x: 4 }, mueve: 'derecha' }, { recta: { y: 4 }, mueve: 'arriba' }];
  const { celdas } = motor.doblar({ ancho: 8, alto: 8 }, D);
  for (const c of celdas) {
    const P = c.poli[0];
    const a = motor._interno.ap(motor.pose(c, D, 1, 1), P), b = motor._interno.ap(motor.pose(c, D, 2, 0), P);
    cerca(a.x, b.x, 'x'); cerca(a.y, b.y, 'y');
    const f = motor._interno.ap(motor.pose(c, D, 2, 0), P), g = motor._interno.ap(c.g, P); cerca(f.x, g.x, 'final x'); cerca(f.y, g.y, 'final y');
    const o = motor._interno.ap(motor.pose(c, D, 0, 0), P); cerca(o.x, P.x, 'inicio x');
  }
});

test('esquina sobre esquina: EA = EC, el doblez lleva C sobre A y ladoDesdeDoblez lo deshace', () => {
  for (let n = 0; n < 200; n++) {
    const b = ent(2, 20), a = b + ent(0, 20);
    const r = motor.esquinaSobreEsquina(a, b);
    cerca(Math.hypot(r.E.x, r.E.y), Math.hypot(a - r.E.x, b - r.E.y), 'EA = EC');
    cerca(Math.hypot(r.F.x - a, r.F.y - b), Math.hypot(r.F.x, r.F.y), 'FA = FC');
    cerca(r.doblez, b * Math.hypot(a, b) / a, 'fórmula del doblez');
    const d = motor.doblar({ ancho: a, alto: b }, r.dobleces), c = d.celdas.find(q => q.hist[0]);
    const C2 = motor._interno.ap(c.g, { x: a, y: b }); cerca(C2.x, 0, 'C cae en A (x)', 1e-9); cerca(C2.y, 0, 'C cae en A (y)', 1e-9);
    if (a > b) cerca(motor.ladoDesdeDoblez(b, r.doblez).a, a, 'lado desde el doblez', 1e-9);
    // el doblez nunca es la diagonal ni el lado corto; es la mitad de la diagonal solo si a = 2b
    if (a > b) { assert.ok(r.doblez < r.errores.diagonal && r.doblez > b); assert.equal(Math.abs(r.doblez - r.errores.mitadDiagonal) < 1e-9, a === 2 * b); }
  }
});

test('loseta: simetría central = giro de 180° = dos reflexiones perpendiculares por O, y dos veces vuelve', () => {
  for (let n = 0; n < 100; n++) {
    const x0 = ent(-5, 5), y0 = ent(-5, 5), O = { x: ent(-5, 5) / 2, y: ent(-5, 5) / 2 };
    const r = motor.reflejoEnVertice(x0, y0, O);
    assert.ok(r.igualGiro180 && r.igualDosEjes);
    const L = motor.loseta(x0, y0);
    assert.ok(motor.iguales(motor.transformar(r.correcta, { tipo: 'central', O }), L), 'dos veces vuelve');
    for (const e of Object.values(r.errores)) assert.ok(!motor.iguales(e, r.correcta), 'un error no puede dar la correcta');
    assert.ok(!motor.iguales(motor.transformar(L, { tipo: 'giro', O, grados: 90 }), r.correcta));
  }
});

// búsqueda por profundidad creciente, hecha aquí
function minimoIDS(ini, meta, k, contiguas) {
  const n = ini.length, J = [];
  if (contiguas) for (let i = 0; i + k <= n; i++) J.push([...Array(k).keys()].map(j => i + j));
  else { const rec = (s, a) => { if (a.length === k) { J.push(a.slice()); return; } for (let i = s; i < n; i++) { a.push(i); rec(i + 1, a); a.pop(); } }; rec(0, []); }
  const flip = (s, j) => { const a = s.split(''); j.forEach(i => { a[i] = a[i] === '1' ? '0' : '1'; }); return a.join(''); };
  // una jugada repetida se cancela: basta probar conjuntos de jugadas sin repetir
  // una solución mínima usa jugadas independientes (si dos grupos de jugadas se anulan, sobran): a lo más n
  for (let m = 0; m <= n; m++) {
    const rec = (s, desde, faltan) => { if (!faltan) return s === meta; for (let j = desde; j < J.length; j++) if (rec(flip(s, J[j]), j + 1, faltan - 1)) return true; return false; };
    if (rec(ini, 0, m)) return m;
  }
  return null;
}
test('fichas: el mínimo coincide con una búsqueda propia y la paridad decide cuándo no se puede', () => {
  for (let t = 0; t < 120; t++) {
    const n = ent(3, 7), k = ent(2, 3), cont = rnd() < 0.5;
    const s = () => Array.from({ length: n }, () => (rnd() < 0.5 ? '1' : '0')).join('');
    const a = s(), b = s(), r = motor.voltear(a, b, { k, contiguas: cont });
    assert.equal(r.minimo, minimoIDS(a, b, k, cont), `${a} → ${b}, k = ${k}, juntas = ${cont}`);
    if (k % 2 === 0 && !r.paridad.iguales) assert.equal(r.posible, false);
    if (r.posible) { let e = a; for (const j of r.camino) e = motor.aplicar(e, j); assert.equal(e, b); }
  }
});

// 3. Las predicciones de la escena: ningún error da la correcta y las opciones son distintas
test('predicciones de la escena: las opciones son distintas entre sí', () => {
  const H8 = { ancho: 8, alto: 8 }, D4 = [{ recta: { x: 4 }, mueve: 'derecha' }, { recta: { y: 4 }, mueve: 'arriba' }];
  const distintas = (xs, que) => assert.equal(new Set(xs.map(String)).size, xs.length, `${que}: ${xs}`);
  const p2 = motor.desplegar(H8, D4, [{ tipo: 'circulo', centro: { x: 4, y: 2 }, r: 1 }]);
  distintas([`${p2.agujeros} enteros`, `${p2.copias[0]} medios`, `${p2.errores.soloDoblez[0].agujeros} enteros`, `${p2.errores.enteroPorCapa.agujeros} enteros`], 'paso 2');
  const p3 = motor.desplegar(H8, D4, [{ tipo: 'circulo', centro: { x: 0, y: 2 }, r: 1 }]);
  distintas([p3.perimetro.exacto, p3.errores.unaCapa.perimetro.exacto, p3.errores.sinRestarBorde.exacto, p3.errores.soloDoblez[1].perimetro.exacto], 'paso 3');
  const p4 = motor.desplegar(H8, D4, [{ tipo: 'rombo', centro: { x: 4, y: 4 }, dx: 2, dy: 1 }]);
  distintas([p4.perimetro.exacto, p4.errores.unaCapa.perimetro.exacto, p4.errores.tramosDelDoblez.exacto, p4.errores.soloDoblez[0].perimetro.exacto], 'paso 4');
  const p5 = motor.desplegar({ ancho: 6, alto: 2 }, [{ recta: { x: 2 }, mueve: 'izquierda' }, { recta: { x: 4 }, mueve: 'derecha' }], [{ tipo: 'linea', A: { x: 3, y: -1 }, B: { x: 3, y: 3 } }]);
  distintas([p5.piezas, p5.errores.sinUniones, p5.errores.unaCapa.piezas, p5.errores.cortesComoPiezas], 'paso 5');
  const p6 = motor.esquinaSobreEsquina(8, 6);
  distintas([p6.doblez, p6.errores.diagonal, p6.errores.mitadDiagonal, p6.errores.ladoCorto], 'paso 6');
  const p8 = motor.voltear('110101', '000000', { k: 2, contiguas: true });
  distintas([p8.minimo, p8.errores.dividir, p8.errores.unoPorUno, p8.errores.cadaGrupo], 'paso 8');
  const p9 = motor.voltear('00000', '11111', { k: 2, contiguas: true });
  distintas(['no', p9.errores.dividir, p9.errores.unoPorUno, p9.errores.cadaGrupo], 'paso 9');
  const e2 = motor.voltear('11111', '00000', { k: 3 });
  distintas([e2.minimo, e2.errores.dividir, e2.errores.unoPorUno, 'no'], 'experimento de los vasos');
  const e3 = motor.desplegar({ ancho: 6, alto: 6 }, [{ recta: { m: 1, n: 0 }, mueve: 'arriba' }, { recta: { m: -1, n: 6 }, mueve: 'arriba' }], [{ tipo: 'poligono', puntos: [{ x: 1, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 4 }, { x: 1, y: 4 }] }]);
  distintas([e3.perimetro.exacto, e3.errores.unaCapa.perimetro.exacto, e3.errores.tramosDelDoblez.exacto, e3.errores.soloDoblez[1].perimetro.exacto], 'experimento de las diagonales');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.doblar({ ancho: 0, alto: 2 }, []));
  assert.throws(() => motor.doblar({ ancho: 4, alto: 4 }, [{ recta: { x: 2 }, mueve: 'arriba' }]), /vertical/);
  assert.throws(() => motor.doblar({ ancho: 4, alto: 4 }, [{ recta: { y: 2 }, mueve: 'derecha' }]), /horizontal/);
  assert.throws(() => motor.desplegar({ ancho: 4, alto: 4 }, [], [{ tipo: 'estrella' }]), /tipo/);
  assert.throws(() => motor.esquinaSobreEsquina(3, 5));
  assert.throws(() => motor.ladoDesdeDoblez(6, 5));
  assert.throws(() => motor.voltear('10a', '000', { k: 2 }));
  assert.throws(() => motor.voltear('10', '000', { k: 2 }));
  assert.throws(() => motor.jugadas(3, { k: 4 }));
});

// 5. papel.json
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, `papel ${p.id}`); });
