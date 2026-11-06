// Pruebas del motor de «El sólido que se abre». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - A_T = A_L + bases; V del prisma = A_B·h y el de la pirámide, un tercio; ap > h y ap > apotema de la base;
//    - el desarrollo: las bisagras no se despegan, cada cara conserva su forma, el área no cambia al abrir,
//      cerrado (f = 0) es el sólido y abierto (f = 1) todo queda en un plano, sin caras encimadas;
//    - el largo del rectángulo del cilindro es 2πr y el sector del cono mide 360°·r/g;
//    - tres pirámides llenan la caja, también con el vértice corrido;
//    - cubitos: los visibles más los ocultos son el total; las caras pintadas suman 6 por cubito en la cuenta total;
//    - Euler: C + V = A + 2, y las aristas contadas en el dibujo coinciden con la fórmula;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const U = motor.util;

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'solidos');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 300;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
function baseAlAzar() {
  const r = rnd();
  if (r < 0.35) return { tipo: 'cuadrado', lado: ent(1, 12) };
  if (r < 0.55) return { tipo: 'rectangulo', largo: ent(1, 9), ancho: ent(1, 9) };
  if (r < 0.7) return { tipo: 'triangulo', lado: ent(1, 12) };
  if (r < 0.85) return { tipo: 'hexagono', lado: ent(1, 8) };
  return { tipo: 'regular', n: ent(5, 9), lado: ent(1, 6) };
}

test('prisma y pirámide: A_T = A_L + bases, V = A_B·h y un tercio de eso; ap mayor que h y que la apotema de la base', () => {
  for (let k = 0; k < N; k++) {
    const b = baseAlAzar(), h = ent(1, 15);
    const P = motor.prisma({ base: b, h });
    cerca(P.total, P.lateral + 2 * P.areaBase, 'A_T del prisma');
    cerca(P.volumen, P.areaBase * h, 'V del prisma');
    assert.equal(P.caras + P.vertices, P.aristas + 2, 'Euler en el prisma');
    if (b.tipo === 'rectangulo' && b.largo !== b.ancho) continue;
    const Q = motor.piramide({ base: b, h });
    cerca(Q.volumen * 3, P.volumen, 'la pirámide es un tercio del prisma');
    cerca(Q.total, Q.lateral + Q.areaBase, 'A_T de la pirámide');
    cerca(Q.ap * Q.ap, h * h + Q.apotemaBase * Q.apotemaBase, 'Pitágoras con la apotema');
    assert.ok(Q.ap > h && Q.ap > Q.apotemaBase && Q.aristaLateral > Q.ap, 'ap está entre h y la arista lateral');
    // con la apotema en lugar de la altura se llega a la misma pirámide
    const R = motor.piramide({ base: b, ap: Q.ap });
    cerca(R.h, h, 'h desde ap', 1e-7); cerca(R.volumen, Q.volumen, 'V desde ap', 1e-7);
    assert.equal(Q.caras + Q.vertices, Q.aristas + 2, 'Euler en la pirámide');
  }
});
test('cilindro, cono y esfera: largo 2πr, sector de 360°·r/g, A_L = πrg y Arquímedes', () => {
  for (let k = 0; k < N; k++) {
    const r = ent(1, 12), h = ent(1, 15);
    const C = motor.cilindro({ r, h });
    cerca(C.largo, 2 * Math.PI * r, 'largo'); cerca(C.lateral, C.largo * h, 'A_L = largo · h');
    const K = motor.cono({ r, h });
    cerca(K.g * K.g, r * r + h * h, 'g² = r² + h²');
    cerca(K.angulo / 360 * 2 * Math.PI * K.g, 2 * Math.PI * r, 'el arco del sector es la circunferencia de la base');
    cerca(K.angulo / 360 * Math.PI * K.g * K.g, K.lateral, 'el área del sector es A_L');
    cerca(K.volumen * 3, C.volumen, 'el cono es un tercio del cilindro');
    const S = motor.conoDeSector({ g: K.g, angulo: K.angulo });
    cerca(S.r, r, 'el sector vuelve a dar el radio'); cerca(S.h, h, 'y la altura', 1e-7);
    const E = motor.esfera({ r });
    cerca(E.volumen / E.cilindro.volumen, 2 / 3, '2/3 del cilindro'); cerca(E.area, E.cilindro.lateral, 'la superficie es la lateral del cilindro');
    cerca(E.volumen, E.area * r / 3, 'V = A·r/3');
    // tronco: el cono grande menos el chico
    const R2 = r + ent(1, 6), T = motor.troncoCono({ R: R2, r, h });
    cerca(T.pi.volumen, T.conoGrande.piVolumen - T.conoChico.piVolumen, 'tronco = cono grande − cono chico', 1e-7);
    const L = r + ent(1, 6), TP = motor.troncoPiramide({ L, l: r, h });
    const Hg = h * L / (L - r);
    cerca(TP.volumen, L * L * Hg / 3 - r * r * (Hg - h) / 3, 'tronco de pirámide = grande − chica', 1e-7);
  }
});

// El desarrollo
function areaUnion2D(caras, eje) {
  // proyecta al plano del desarrollo (x, z) y cuenta cuántas caras cubren cada punto de una grilla
  const pts = caras.flatMap(c => c.puntos);
  const xs = pts.map(p => p[0]), zs = pts.map(p => p[2]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
  const n = 70, enc = [];
  const dentro = (pol, x, z) => { let s = false; for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) { const [xi, zi] = pol[i], [xj, zj] = pol[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) s = !s; } return s; };
  const pols = caras.map(c => c.puntos.map(p => [p[0], p[2]]));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = x0 + (x1 - x0) * (i + 0.5) / n + 1e-7 * eje, z = z0 + (z1 - z0) * (j + 0.5) / n + 1.3e-7;
    let c = 0; for (const p of pols) if (dentro(p, x, z)) c++;
    if (c > 1) enc.push([x, z, c]);
  }
  return enc;
}
function solidoAlAzar() {
  const r = rnd();
  if (r < 0.3) return ['prisma', { base: baseAlAzar(), h: ent(1, 9) }];
  if (r < 0.55) { let b = baseAlAzar(); if (b.tipo === 'rectangulo') b = { tipo: 'cuadrado', lado: b.largo }; return ['piramide', { base: b, h: ent(1, 9) }]; }
  if (r < 0.75) return ['cilindro', { r: ent(1, 6), h: ent(1, 9) }];
  return ['cono', { r: ent(1, 6), h: ent(1, 9) }];
}
test('el desarrollo: bisagras pegadas, caras rígidas, área constante; cerrado es el sólido y abierto queda plano y sin caras encimadas', () => {
  for (let k = 0; k < 60; k++) {
    const [tipo, d] = solidoAlAzar(), o = { N: ent(8, 40) };
    const S = motor.solido(tipo, d, o);
    const area0 = S.caras.reduce((s, c) => s + U.areaPoligono3(c.puntos), 0);
    for (const f of [0, 0.13, 0.5, 0.77, 1]) {
      const D = motor.desarrollo(tipo, d, f, o);
      cerca(D.area, area0, `${tipo} f = ${f}: área`, 1e-9);
      D.caras.forEach((c, i) => {
        // rígida: los lados de cada cara no cambian
        c.puntos.forEach((p, j) => { const q = c.puntos[(j + 1) % c.puntos.length], p0 = c.cerrada[j], q0 = c.cerrada[(j + 1) % c.puntos.length];
          cerca(U.norma(U.sub(q, p)), U.norma(U.sub(q0, p0)), `${tipo} f = ${f}: lado de la cara ${i}`, 1e-9); });
        // la bisagra con su padre no se despega
        if (c.padre !== null) {
          const S0 = S.caras[i], par = D.caras[c.padre];
          for (const j of S0.bisagra) {
            const enPadre = U.aplicar(par.M, S0.puntos[j]);
            cerca(U.norma(U.sub(enPadre, c.puntos[j])), 0, `${tipo} f = ${f}: bisagra de la cara ${i}`, 1e-9);
          }
        }
      });
      if (f === 0) D.caras.forEach((c, i) => c.puntos.forEach((p, j) => cerca(p, S.caras[i].puntos[j], `${tipo}: cerrado es el sólido`, 1e-9)));
      if (f === 1) {
        const y = D.caras[0].puntos[0][1];
        for (const c of D.caras) { cerca(c.normal, [0, -1, 0], `${tipo}: todo mira al frente`, 1e-9); for (const p of c.puntos) cerca(p[1], y, `${tipo}: todo en un plano`, 1e-9); }
        assert.deepEqual(areaUnion2D(D.caras, 1).slice(0, 3), [], `${tipo} ${JSON.stringify(d)}: hay caras encimadas en el desarrollo`);
      }
    }
  }
});
test('el rectángulo del cilindro mide 2πr por h y el sector del cono, 360°·r/g (con 48 tiras)', () => {
  for (let k = 0; k < 30; k++) {
    const r = ent(1, 6), h = ent(1, 9);
    const D = motor.desarrollo('cilindro', { r, h }, 1);
    const lat = D.caras.filter(c => c.rol === 'lateral').flatMap(c => c.puntos);
    const xs = lat.map(p => p[0]), zs = lat.map(p => p[2]);
    cerca(Math.max(...xs) - Math.min(...xs), 2 * Math.PI * r, 'largo del rectángulo', 1e-9);
    cerca(Math.max(...zs) - Math.min(...zs), h, 'alto del rectángulo', 1e-9);
    const K = motor.cono({ r, h }), DK = motor.desarrollo('cono', { r, h }, 1, { N: 48 });
    const V = DK.marcas.vertice.p, tri = DK.caras.filter(c => c.rol === 'lateral');
    // ángulo del abanico: suma de los ángulos de cada tira en el vértice
    let ang = 0; for (const c of tri) { const a = U.sub(c.puntos[0], V), b = U.sub(c.puntos[1], V); ang += Math.acos(U.dot(a, b) / (U.norma(a) * U.norma(b))); }
    cerca(ang * 180 / Math.PI, K.angulo, 'ángulo del sector', 2e-3);
  }
});
test('tres pirámides llenan la caja; correr el vértice sin cambiar la altura no cambia el volumen', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 12), h = ent(1, 12), T = motor.tresPiramides({ a, h, sep: rnd() * 3, punta: rnd() });
    for (const p of T.piezas) cerca(p.volumen, a * a * h / 3, `pieza ${p.id}`, 1e-9);
    cerca(T.suma, a * a * h, 'suman la caja');
  }
});
test('cubitos: visibles + ocultos = total; las caras pintadas suman el área total; sin pintura son (n − 2)³', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 8), b = ent(1, 8), c = ent(1, 8), B = motor.bloque(a, b, c);
    assert.equal(B.visiblesDibujo + B.ocultosDibujo, B.total);
    assert.equal(B.cubitos.filter(q => q.visibleDibujo).length, B.visiblesDibujo, 'los marcados como visibles');
    assert.equal(Object.values(B.pintadas).reduce((s, x) => s + x, 0), B.total);
    assert.equal(Object.entries(B.pintadas).reduce((s, [n, x]) => s + n * x, 0), B.areaTotal, 'caritas pintadas = área total');
    const n = ent(2, 9), P = motor.cuboPintado(n);
    assert.equal(P.pintadas[0], Math.pow(n - 2, 3));
  }
});
test('Euler: C + V = A + 2, y las aristas contadas en el dibujo del prisma y la pirámide coinciden con la fórmula', () => {
  for (const t of ['tetraedro', 'cubo', 'octaedro', 'dodecaedro', 'icosaedro']) assert.ok(motor.poliedro({ tipo: t }).cumpleEuler, t);
  for (let n = 3; n <= 12; n++) {
    for (const tipo of ['prisma', 'piramide']) {
      const P = motor.poliedro({ tipo, n });
      assert.ok(P.cumpleEuler, `${tipo} de ${n} lados`);
      const S = motor.solido(tipo, { base: { tipo: 'regular', n, lado: 2 }, h: 3 });
      assert.equal(S.caras.length, P.caras, `caras de ${tipo} ${n}`);
      assert.equal(motor.aristasUnicas(S.caras).length, P.aristas, `aristas de ${tipo} ${n}`);
    }
  }
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
function sinChoques(R, que) {
  assert.ok(R.respuestas && R.errores && R.coinciden, `${que}: faltan respuestas, errores o coinciden`);
  for (const [g, errs] of Object.entries(R.errores)) {
    assert.ok(g in R.respuestas, `${que}: ${g} no tiene respuesta`);
    for (const [k, v] of Object.entries(errs)) assert.ok(!(typeof v === 'number' ? casi(v, R.respuestas[g]) : v === R.respuestas[g]), `${que}: el error ${g}.${k} da ${v}, igual que la correcta`);
    for (const k of R.coinciden[g]) assert.ok(!(k in errs), `${que}: ${k} está en los dos lados`);
  }
}
test('ningún error típico coincide con la respuesta correcta; los que coinciden se apartan', () => {
  for (let k = 0; k < N; k++) {
    const b = baseAlAzar(), h = ent(1, 15), r = ent(1, 12);
    sinChoques(motor.prisma({ base: b, h }), `prisma ${JSON.stringify(b)} h = ${h}`);
    if (b.tipo !== 'rectangulo' || b.largo === b.ancho) {
      sinChoques(motor.piramide({ base: b, h }), `pirámide ${JSON.stringify(b)} h = ${h}`);
      // la apotema nunca es la altura
      assert.ok(motor.piramide({ base: b, h }).coinciden.ap.length === 0);
    }
    sinChoques(motor.cilindro({ r, h }), `cilindro ${r}, ${h}`);
    sinChoques(motor.cono({ r, h }), `cono ${r}, ${h}`);
    sinChoques(motor.esfera({ r }), `esfera ${r}`);
    sinChoques(motor.conoDeSector({ g: ent(2, 20), angulo: ent(1, 359) }), 'cono de un sector');
    sinChoques(motor.troncoCono({ R: r + ent(0, 6), r, h }), 'tronco de cono');
    sinChoques(motor.troncoPiramide({ L: r + ent(0, 6), l: r, h }), 'tronco de pirámide');
    sinChoques(motor.bloque(ent(1, 8), ent(1, 8), ent(1, 8)), 'bloque');
    sinChoques(motor.cuboPintado(ent(2, 10)), 'cubo pintado');
    sinChoques(motor.poliedro({ tipo: rnd() < 0.5 ? 'prisma' : 'piramide', n: ent(3, 12) }), 'poliedro');
    sinChoques(motor.hojaEnrollada({ largo: ent(1, 12), ancho: ent(1, 12) }), 'hoja');
    // los que se apartaron sí dan lo mismo: el cilindro con r = 2 (πr² = 2πr) y el cubo de 4 (8 esquinas)
    assert.deepEqual(motor.cilindro({ r: 2, h }).coinciden.largo, ['conArea']);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.prisma({ base: { tipo: 'cuadrado', lado: 2 } }), /altura/);
  assert.throws(() => motor.prisma({ base: { tipo: 'estrella', lado: 2 }, h: 1 }), /base desconocida/);
  assert.throws(() => motor.piramide({ base: { tipo: 'rectangulo', largo: 2, ancho: 3 }, h: 1 }), /base regular/);
  assert.throws(() => motor.piramide({ base: { tipo: 'cuadrado', lado: 6 }, ap: 2 }), /mayor que la apotema de la base/);
  assert.throws(() => motor.piramide({ base: { tipo: 'cuadrado', lado: 6 } }), /falta la altura/);
  assert.throws(() => motor.cono({ r: 5, g: 4 }), /mayor que el radio/);
  assert.throws(() => motor.cono({ r: 0, h: 4 }), /mayor que cero/);
  assert.throws(() => motor.cilindro({ r: 'tres', h: 2 }), /número/);
  assert.throws(() => motor.conoDeSector({ g: 5, angulo: 360 }), /menor que 360/);
  assert.throws(() => motor.troncoCono({ R: 2, r: 3, h: 1 }), /no puede ser mayor/);
  assert.throws(() => motor.bloque(2, 2.5, 3), /entero/);
  assert.throws(() => motor.cuboPintado(1), /al menos 2/);
  assert.throws(() => motor.poliedro({ tipo: 'esfera' }), /desconocido/);
  assert.throws(() => motor.desarrollo('esfera', { r: 2 }, 0.5), /no sé abrir/);
  assert.throws(() => motor.desarrollo('cono', { r: 2, h: 3 }, 1.5), /de 0 a 1/);
  assert.throws(() => motor.tresPiramides({ a: 2, h: 3, punta: 2 }), /de 0 a 1/);
  assert.throws(() => motor.hojaEnrollada({ largo: 0, ancho: 2 }), /mayor que cero/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
