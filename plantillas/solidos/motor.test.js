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
//    - 0.2.0: el vaso lleno = agua + lo de arriba y = cono grande − chico; el agua que sube = la pieza; Pappus en la región
//      que gira; la esfera inscrita equidista de la base y la generatriz; el casquete = π·cuerda² y su volumen por integración;
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
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 30);
  // los casos de la 0.2.0 traen su propio campo de verificación (vacío hasta que otro agente los verifique)
  for (const c of datos.casos.filter(x => x.version === '0.2.0')) assert.ok('verificacion' in c, c.nombre.slice(0, 60));
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

// 2b. Troncos y esferas (0.2.0)
test('vaso a una fracción de la altura: agua + resto = vaso, agua = cono hasta el nivel − punta, crece con k; en un vaso angosto abajo, menos que k', () => {
  for (let i = 0; i < N; i++) {
    const r = ent(0, 6), R = r + ent(1, 7), h = ent(1, 12), k = ent(1, 10)/10;
    const T = motor.troncoLlenado({ R, r, h, k });
    cerca(T.pi.agua + T.pi.arriba, T.pi.vaso, 'agua + resto');
    cerca(T.pi.vaso, T.conoCompleto.piGrande - T.conoCompleto.piChico, 'vaso = cono grande − chico', 1e-8);
    const H = T.conoCompleto.H, hc = T.conoCompleto.hChico, zc = hc + k*h;   // altura del nivel medida desde la punta
    cerca(T.rNivel, R*zc/H, 'radio por semejanza', 1e-9);
    cerca(T.pi.agua, T.rNivel*T.rNivel*zc/3 - T.conoCompleto.piChico, 'agua = cono hasta el nivel − punta', 1e-8);
    if (k < 1) assert.ok(T.fraccion < k, 'el vaso se abre hacia arriba: abajo guarda menos');
    if (k < 1 && r > 0) assert.ok(T.fraccion > k*k*k, 'y más que k³ (no tiene punta en el fondo)');
    const N1 = motor.nivelTronco({ R, r, h, z:k*h }); cerca(N1.piAgua, T.pi.agua, 'nivelTronco'); cerca(N1.fraccion, T.fraccion, 'fracción');
    const T2 = motor.troncoLlenado({ R, r, h, k:Math.min(1, k + .1) }); assert.ok(T2.pi.agua >= T.pi.agua - 1e-9, 'crece con el nivel');
    sinChoques(T, 'vaso');
  }
  // un cono con la punta abajo (r = 0): ahí sí vale k³
  const C = motor.troncoLlenado({ R:6, r:0, h:9, k:1/3 }); cerca(C.fraccion, 1/27, 'cono: k³');
});
test('el agua que sube ocupa lo que la pieza; al revés da el volumen; mientras la bola baja, el nivel sube sin pasarse', () => {
  for (let i = 0; i < N; i++) {
    const R = ent(2, 10), r = ent(1, R), h0 = ent(2*r, 2*r + 6);
    const D = motor.desplazamiento({ R, pieza:{ tipo:'esfera', r }, h0 });
    cerca(R*R*D.dh, 4*r*r*r/3, 'πR²·Δh = 4πr³/3');
    assert.ok(D.cubierta, 'la bola queda cubierta');
    const I = motor.desplazamiento({ R, dh:D.dh }); cerca(I.piVolumen, D.piVolumen, 'al revés');
    sinChoques(D, 'desplazamiento'); sinChoques(I, 'desplazamiento al revés');
    let antes = h0;
    for (let c = h0 + r + 1; c >= r - 1e-12; c -= (h0 + 1)/9) {
      const L = motor.nivelConEsfera({ R, r, h0, c:Math.max(r, c) });
      assert.ok(L.nivel >= antes - 1e-9 && L.nivel <= h0 + D.dh + 1e-9, 'el nivel sube parejo y no pasa de h0 + Δh');
      cerca(R*R*L.sube, L.piSumergido, 'lo sumergido es lo que sube', 1e-9);
      antes = L.nivel;
    }
    cerca(motor.nivelConEsfera({ R, r, h0, c:r }).nivel, h0 + D.dh, 'en el fondo, del todo cubierta', 1e-9);
    const a = ent(1, Math.floor(R*Math.SQRT2)), Cb = motor.desplazamiento({ R, pieza:{ tipo:'cubo', a } });
    cerca(Math.PI*R*R*Cb.dh, a*a*a, 'el cubo');
  }
});
test('la región que gira: Pappus (V = 2π · distancia del centroide al eje · área) y las piezas suman el sólido', () => {
  const centroide = pol => { let A = 0, cx = 0; for (let i = 0; i < pol.length; i++) { const [x0, y0] = pol[i], [x1, y1] = pol[(i + 1) % pol.length], c = x0*y1 - x1*y0; A += c; cx += (x0 + x1)*c; } return { A:Math.abs(A/2), x:cx/(3*A) }; };
  for (let i = 0; i < N; i++) {
    const b = ent(1, 9), B = b + ent(1, 8), h = ent(1, 9);
    for (const eje of ['perpendicular', 'mayor', 'menor']) {
      const T = motor.revolucionTrapecio({ B, b, h, eje }), G = centroide(T.trapecio);
      cerca(G.A, (B + b)*h/2, `${eje}: área del trapecio`);
      cerca(T.pi.volumen, 2*G.x*G.A, `${eje}: Pappus`, 1e-9);
      cerca(T.piezas.reduce((s, p) => s + p.piVolumen, 0), T.pi.volumen, `${eje}: piezas`, 1e-9);
      sinChoques(T, `trapecio ${eje}`);
      const vals = Object.values(T.errores.volumen);
      vals.forEach((v, j) => vals.forEach((w, k) => { if (j < k) assert.ok(!casi(v, w), `${eje} B=${B} b=${b} h=${h}: dos errores dan ${v}`); }));
      const phi = rnd()*6.3; motor.girarPerfil(T.perfil, phi).forEach((p, j) => { cerca(Math.hypot(p[0], p[1]), T.perfil[j][0], 'girar no cambia la distancia al eje'); cerca(p[2], T.perfil[j][1], 'ni la altura'); });
    }
  }
});
test('la esfera inscrita en el cono: equidista de la base y de la generatriz, toca en la generatriz y V/V = A/A', () => {
  for (let i = 0; i < N; i++) {
    const r = ent(1, 12), h = ent(1, 15), S = motor.esferaInscritaCono({ r, h });
    // distancia del centro (0, ρ) a la recta que une (r, 0) con (0, h): |h·0 + r·ρ − r·h| / g
    cerca(Math.abs(r*S.rho - r*h)/S.g, S.rho, 'equidista de la generatriz');
    const [tx, tz] = S.tangencia;
    cerca(tx/r + tz/h, 1, 'el punto de contacto está en la generatriz');
    cerca(Math.hypot(tx, tz - S.rho), S.rho, 'y a ρ del centro');
    cerca(Math.hypot(tx - r, tz), r, 'tangentes iguales desde la esquina de la base');
    cerca(S.razonVolumen, S.razonArea, 'V/V = A/A');
    assert.ok(2*S.rho < h && S.rho < r, 'cabe en el cono');
    sinChoques(S, 'esfera inscrita');
  }
});
test('el casquete: A = 2πrh = π·cuerda², el volumen por rodajas, y casquete + resto = esfera', () => {
  for (let i = 0; i < N; i++) {
    const r = ent(1, 12), h = ent(1, 2*r*4)/4, Q = motor.casquete({ r, h });
    cerca(Q.pi.area, Q.cuerda*Q.cuerda, 'π · cuerda²');
    if (h < 2*r) cerca(Q.pi.area + motor.casquete({ r, h:2*r - h }).pi.area, 4*r*r, 'los dos casquetes suman la esfera');
    // volumen con 4000 rodajas: π ∫ (r² − (z − r)²) dz de 2r − h a 2r
    let v = 0; const n = 4000, z0 = 2*r - h; for (let j = 0; j < n; j++) { const z = z0 + h*(j + .5)/n; v += (r*r - (z - r)*(z - r))*h/n; }
    cerca(Q.pi.volumen, v, 'volumen por rodajas', 1e-6);
    for (const [rho, z] of Q.rayos) cerca(rho*rho + (z - r)*(z - r), r*r, 'los rayos salen de la esfera');
    sinChoques(Q, 'casquete');
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
  // bordes que pidió la verificación
  assert.throws(() => motor.cono({ r: 5, g: 5 }), /mayor que el radio/);
  assert.throws(() => motor.piramide({ base: { tipo: 'cuadrado', lado: 6 }, ap: 3 }), /mayor que la apotema de la base/);
  assert.throws(() => motor.conoDeSector({ g: 5, angulo: 400 }), /menor que 360/);
  assert.throws(() => motor.conoDeSector({ g: 5, angulo: 0 }), /mayor que cero/);
  assert.throws(() => motor.bloque(0, 2, 2), /al menos 1/);
  // 0.2.0
  assert.throws(() => motor.troncoLlenado({ R:2, r:3, h:4 }), /no puede ser mayor/);
  assert.throws(() => motor.troncoLlenado({ R:6, r:2, h:4, k:0 }), /de 0 a 1/);
  assert.throws(() => motor.troncoLlenado({ R:6, r:2, h:4, k:1.5 }), /de 0 a 1/);
  assert.throws(() => motor.desplazamiento({ R:3, pieza:{ tipo:'esfera', r:4 } }), /no cabe/);
  assert.throws(() => motor.desplazamiento({ R:3, pieza:{ tipo:'cubo', a:5 } }), /no cabe/);
  assert.throws(() => motor.desplazamiento({ R:3 }), /falta la pieza/);
  assert.throws(() => motor.nivelConEsfera({ R:6, r:3, h0:7, c:1 }), /fondo/);
  assert.throws(() => motor.revolucionTrapecio({ B:4, b:4, h:3 }), /mayor que la menor/);
  assert.throws(() => motor.revolucionTrapecio({ B:6, b:4, h:3, eje:'diagonal' }), /eje desconocido/);
  assert.throws(() => motor.esferaInscritaCono({ r:0, h:3 }), /mayor que cero/);
  assert.throws(() => motor.casquete({ r:3, h:7 }), /diámetro/);
});
test('bordes: cubo de 2 sin cubitos sin pintura (0, nunca negativo); bloques con una dimensión 1 tienen cubitos con 4 o 5 caras pintadas', () => {
  const C2 = motor.cuboPintado(2);
  assert.equal(C2.sinPintura, 0); assert.equal(C2.pintadas[3], 8);
  const B = motor.bloque(1, 3, 4);
  assert.equal(B.pintadas[4], 4); assert.equal(B.pintadas[3], 6); assert.equal(B.pintadas[2], 2);
  const F = motor.bloque(1, 1, 3);
  assert.equal(F.pintadas[5], 2); assert.equal(F.pintadas[4], 1);
  assert.equal(motor.bloque(1, 1, 1).pintadas[6], 1);
  for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) for (let c = 1; c <= 4; c++) {
    const X = motor.bloque(a, b, c);
    assert.equal(Object.entries(X.pintadas).reduce((s, [n, x]) => s + n * x, 0), X.areaTotal, `${a}×${b}×${c}`);
  }
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
