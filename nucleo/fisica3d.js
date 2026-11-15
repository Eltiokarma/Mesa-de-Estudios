/*
 * Escenas 3D de física (15 nov 2026, ronda 4, docs/3d.md): convierten los valores de una mesa en lo que dibuja la pieza
 * «fis-espacio-3d» y en lo que miden su lectura y sus retos. Toda la física sale de los motores de las plantillas
 * (regla 1); aquí solo se elige la escala y se ubican las flechas. Así la figura, la lectura y los retos usan el mismo
 * número. Sin DOM: funciona en el navegador (window.Fisica3D, con los motores ya cargados por `requiere`) y en Node.
 *
 *   vectores({ ax, ay, az, b, ver })   flecha A por componentes, su caja de sombras o el producto A × B con B dada
 *   lorentz({ th, fi, q })             F = q v × B con B fija en x̂, v a θ de B y girada φ alrededor de B
 *   espira({ th, B, A })               espira cuadrada que gira en un campo vertical: Φ = B·A·cos θ y su sombra
 *   ondaEM({ lam, E0, t })             onda que avanza en x̂ con E vertical y B horizontal; t en ns
 *   tiro({ v0, ang, t })               pelota con sus dos sombras: en el suelo (MRU) y en la pared (MRUV)
 * Cada una devuelve { datos, ... } con las medidas que usan la lectura y los retos.
 * Coordenadas de física: z hacia arriba (la pieza las pasa a three.js).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motores = nodo ? () => ({
    V: require('../plantillas/vectores/motor.js'), M: require('../plantillas/magnetismo/motor.js'),
    I: require('../plantillas/induccion/motor.js'), O: require('../plantillas/ondas-electromagneticas/motor.js'),
    T: require('../plantillas/tiro-parabolico/motor.js'),
  }) : () => ({ V: root.MotorVectores, M: root.MotorMagnetismo, I: root.MotorInduccion, O: root.MotorOndasEM, T: root.MotorTiro });
  const api = fabrica(motores);
  if (nodo) module.exports = api;
  else root.Fisica3D = api;
})(typeof self !== 'undefined' ? self : this, function (motores) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const M = () => motores();
  const arr = o => [o.x, o.y, o.z || 0];
  const f = (x, d = 2) => {
    const r = Math.round(x * 10 ** d) / 10 ** d;
    return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−').replace('.', ',');
  };

  // ---------- Vectores en el espacio ----------
  const BES = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1], xy: [1, 1, 0] };
  const BNOMBRE = { x: 'î', y: 'ĵ', z: 'k̂', xy: 'î + ĵ' };
  function vectores(v) {
    const { V } = M(), A = [v.ax, v.ay, v.az], B = BES[v.b] || BES.x;
    const modA = Math.sqrt(V.escalar(A, A)), punto = V.escalar(A, B), cruz = V.vectorial(A, B), C = arr(cruz);
    const datos = { escena: 'vectores', escala: 0.85, ejes: { largo: 2.6 }, vista: { giro: 35, inclinacion: 22 }, flechas: [], trazos: [], caras: [] };
    if (v.ver === 'cruz') {
      datos.flechas.push({ de: [0, 0, 0], a: A, color: 'c-o', rotulo: 'A' }, { de: [0, 0, 0], a: B, color: 'c-i', rotulo: 'B' });
      if (cruz.modulo > 1e-9) {
        datos.flechas.push({ de: [0, 0, 0], a: C, color: 'c-d', rotulo: 'A × B' });
        datos.caras.push({ puntos: [[0, 0, 0], A, [A[0] + B[0], A[1] + B[1], A[2] + B[2]], B], color: 'c-d', opacidad: 0.18 });
      }
    } else {
      datos.flechas.push({ de: [0, 0, 0], a: A, color: 'c-o', rotulo: 'A', grosor: 1.2 });
      const comp = [[[v.ax, 0, 0], 'Ax'], [[0, v.ay, 0], 'Ay'], [[0, 0, v.az], 'Az']];
      for (const [p, t] of comp) if (Math.hypot(...p) > 1e-9) datos.flechas.push({ de: [0, 0, 0], a: p, color: 'c-o', rotulo: t, grosor: 0.6 });
      // Caja de sombras: de la punta al piso y del piso a cada eje.
      const piso = [v.ax, v.ay, 0];
      datos.trazos.push({ puntos: [A, piso], color: 'tinta', punteado: true }, { puntos: [[v.ax, 0, 0], piso, [0, v.ay, 0]], color: 'tinta', punteado: true },
        { puntos: [[0, 0, v.az], A], color: 'tinta', punteado: true });
    }
    datos.alt = v.ver === 'cruz'
      ? `Flecha A = (${A.map(x => f(x)).join(', ')}) y B = ${BNOMBRE[v.b] || 'î'}: A · B = ${f(punto)}; A × B mide ${f(cruz.modulo)} y es perpendicular a las dos.`
      : `Flecha A = (${A.map(x => f(x)).join(', ')}) con sus tres componentes sobre los ejes: mide ${f(modA)}.`;
    return { datos, modA, punto, cruz: C, modCruz: cruz.modulo, B };
  }

  // ---------- Fuerza magnética sobre una carga ----------
  function lorentz(v) {
    const { M: MM } = M(), t = rad(v.th), p = rad(v.fi);
    const vel = { x: Math.cos(t), y: Math.sin(t) * Math.cos(p), z: Math.sin(t) * Math.sin(p) }, B = { x: 1, y: 0, z: 0 };
    const r = MM.fuerzaCarga(v.q, vel, B), F = arr(r.F), V = arr(vel);
    const LV = 1.7, LB = 2.2, LF = 1.7;
    const datos = { escena: 'lorentz', escala: 0.95, ejes: null, vista: { giro: 25, inclinacion: 24 }, flechas: [], trazos: [], bolas: [] };
    for (const [y, z] of [[1.1, -0.9], [-1.1, -0.9], [1.1, 0.9], [-1.1, 0.9]]) datos.flechas.push({ de: [-LB / 2 - 0.3, y, z], a: [LB / 2 + 0.3, y, z], color: 'c-i', grosor: 0.45 });
    datos.flechas.push({ de: [-LB / 2, 0, 0], a: [LB / 2, 0, 0], color: 'c-i', rotulo: 'B', grosor: 0.8 });
    datos.flechas.push({ de: [0, 0, 0], a: V.map(x => x * LV), color: 'c-o', rotulo: 'v' });
    // Parte de v perpendicular a B: la única que empuja.
    if (Math.abs(Math.sin(t)) > 1e-9 && Math.abs(Math.cos(t)) > 1e-9) datos.trazos.push({ puntos: [V.map(x => x * LV), [0, V[1] * LV, V[2] * LV], [0, 0, 0]], color: 'c-o', punteado: true });
    if (r.modulo > 1e-9) datos.flechas.push({ de: [0, 0, 0], a: F.map(x => x * LF), color: 'c-d', rotulo: 'F' });
    datos.bolas.push({ en: [0, 0, 0], r: 0.16, color: 'tinta', rotulo: v.q > 0 ? 'q +' : 'q −' });
    datos.alt = `Carga ${v.q > 0 ? 'positiva' : 'negativa'} con velocidad v a ${f(v.th, 0)}° del campo B: `
      + (r.modulo > 1e-9 ? `la fuerza F mide ${f(r.modulo)} de qvB y es perpendicular a v y a B.` : 'la fuerza es cero.');
    return { datos, F, modulo: r.modulo, sen: r.sen, perpendicular: r.perpendicular };
  }

  // ---------- Flujo en una espira que gira ----------
  const KESP = 6;                                    // unidades de escena por metro (la espira de 0,16 m² mide 2,4)
  function espira(v) {
    const { I } = M(), r = I.flujo(v.B, v.A, v.th), s = Math.sqrt(v.A) * KESP / 2, t = rad(v.th), PISO = -1.8;
    const c = Math.cos(t), sn = Math.sin(t);
    const esq = [[-s, -s], [s, -s], [s, s], [-s, s]].map(([x, y]) => [x, y * c, y * sn]);
    const datos = { escena: 'espira', escala: 0.9, ejes: null, vista: { giro: 30, inclinacion: 18 }, flechas: [], trazos: [], caras: [], rotulos: [] };
    for (const x of [-1.3, 0, 1.3]) for (const y of [-1.3, 0, 1.3]) datos.flechas.push({ de: [x, y, PISO + 0.05], a: [x, y, 1.9], color: 'c-i', grosor: 0.4, rotulo: x === 1.3 && y === -1.3 ? 'B' : undefined });
    datos.caras.push({ puntos: esq, color: 'tinta', opacidad: 0.12 });
    datos.trazos.push({ puntos: esq, color: 'tinta', cerrado: true });
    const sombra = esq.map(p => [p[0], p[1], PISO]);
    if (Math.abs(r.cos) > 1e-9) datos.caras.push({ puntos: sombra, color: 'c-d', opacidad: 0.4 });
    else datos.trazos.push({ puntos: [sombra[0], sombra[1]], color: 'c-d' });
    datos.flechas.push({ de: [0, 0, 0], a: [0, -1.3 * sn, 1.3 * c], color: 'tinta', rotulo: 'n', grosor: 0.6 });
    datos.rotulos.push({ en: [s + 0.5, s * c, PISO], texto: 'Φ', color: 'c-d' });
    datos.alt = `Espira de ${f(v.A)} m² inclinada ${f(v.th, 0)}° respecto del campo vertical B de ${f(v.B, 1)} T: `
      + `su sombra en el piso es lo que cruza el campo; flujo Φ = ${f(r.Phi, 3)} Wb.`;
    return { datos, Phi: r.Phi, cos: r.cos, sombra: v.A * Math.abs(r.cos) };
  }

  // ---------- Onda electromagnética ----------
  const LARGO = 6, KX = 1, AMP = 0.3;             // 6 m de camino a escala 1; 0,3 de escena por V/m
  function ondaEM(v) {
    const { O } = M(), o = O.ondaDeLambda(v.lam, 'm'), T = 1e9 / o.f, cB = O.campos(v.E0);   // período en ns
    const X0 = -LARGO * KX / 2, h = AMP * v.E0;
    const valor = x => O.instante(x, v.t, v.lam, T).electrico;          // seno de la fase, el mismo para E y para B
    const datos = { escena: 'onda-em', escala: 0.68, ejes: null, vista: { giro: 35, inclinacion: 20 }, flechas: [], trazos: [], bolas: [] };
    const N = 96, curvaE = [], curvaB = [];
    for (let k = 0; k <= N; k++) { const x = LARGO * k / N, s = valor(x); curvaE.push([X0 + x * KX, 0, h * s]); curvaB.push([X0 + x * KX, -h * s, 0]); }
    datos.trazos.push({ puntos: [[X0, 0, 0], [X0 + LARGO * KX + 0.3, 0, 0]], color: 'tinta' }, { puntos: curvaE, color: 'c-o' }, { puntos: curvaB, color: 'c-i' });
    for (let k = 0; k < 12; k++) {
      const x = 0.25 + 0.5 * k, s = valor(x), X = X0 + x * KX;
      datos.flechas.push({ de: [X, 0, 0], a: [X, 0, h * s], color: 'c-o', grosor: 0.5 }, { de: [X, 0, 0], a: [X, -h * s, 0], color: 'c-i', grosor: 0.5 });
    }
    datos.flechas.push({ de: [X0 + LARGO * KX + 0.3, 0, 0], a: [X0 + LARGO * KX + 1.1, 0, 0], color: 'tinta', rotulo: 'c' });
    // λ en verde, bajo el eje: de una cresta a la siguiente hay un largo λ (regla 4: λ verde en la unidad).
    const yl = -h - 0.35;
    datos.trazos.push({ puntos: [[X0, 0, yl + 0.12], [X0, 0, yl], [X0 + v.lam * KX, 0, yl], [X0 + v.lam * KX, 0, yl + 0.12]], color: 'c-d' });
    datos.rotulos = [{ en: [X0 + v.lam * KX / 2, 0, yl - 0.25], texto: 'λ', color: 'c-d' }];
    const E0 = valor(0);
    datos.bolas.push({ en: [X0, 0, h * E0], r: 0.09, color: 'c-o' }, { en: [X0, -h * E0, 0], r: 0.09, color: 'c-i' });
    // Los nombres van sobre el plano de cada campo, al comienzo: E arriba (vertical) y B hacia adelante (horizontal).
    datos.rotulos.push({ en: [X0 - 0.35, 0, h + 0.3], texto: 'E', color: 'c-o' }, { en: [X0 - 0.35, -h - 0.3, 0], texto: 'B', color: 'c-i' });
    datos.alt = `Onda de λ = ${f(v.lam, 1)} m que avanza a c: E sube y baja en vertical y B en horizontal, en fase y perpendiculares; `
      + `a t = ${f(v.t, 1)} ns, en el origen E vale ${f(v.E0 * E0, 2)} V/m.`;
    return { datos, f: o.f, T, B0: cB.B0, Eorigen: v.E0 * E0 };
  }

  // ---------- Tiro parabólico con sus dos sombras ----------
  // 75 m caben en 4,6 de escena (los tiros más largos salen del cuadro: se aleja con − o el pellizco); el suelo queda bajo
  // el centro (ZB) y la pared, detrás del lanzador.
  const KT = 4.6 / 75, X0T = -2, PARED = -2.4, ZB = -0.9;
  function tiro(v) {
    const { T: MT } = M(), p = MT.proyectil({ v0: v.v0, angulo: v.ang }), t = Math.min(v.t, p.tVuelo), e = p.estado(t);
    const enEsc = (x, y) => [X0T + x * KT, 0, ZB + Math.max(0, y) * KT];
    const suelo = X => [X, 0, ZB], pared = Z => [PARED, 0, Z];
    const datos = { escena: 'tiro', escala: 0.9, ejes: null, vista: { giro: -18, inclinacion: 14 }, flechas: [], trazos: [], bolas: [], caras: [] };
    datos.caras.push({ puntos: [[PARED, -0.7, ZB], [PARED, 0.7, ZB], [PARED, 0.7, ZB + 2], [PARED, -0.7, ZB + 2]], color: 'tinta', opacidad: 0.1 });
    datos.trazos.push({ puntos: [suelo(PARED), suelo(X0T + 92 * KT)], color: 'tinta' });
    const camino = p.puntos(60).filter(q => q.t <= t + 1e-9).map(q => enEsc(q.x, q.y));
    camino.push(enEsc(e.x, e.y));
    datos.trazos.push({ puntos: camino, color: 'c-i', punteado: true });
    // Marcas cada medio segundo: la sombra en el suelo y la sombra en la pared.
    for (let k = 1; k * 0.5 < t - 1e-9 && k <= 12; k++) {
      const q = p.estado(k * 0.5), P = enEsc(q.x, q.y);
      datos.bolas.push({ en: suelo(P[0]), r: 0.045, color: 'c-i' }, { en: pared(P[2]), r: 0.045, color: 'c-i' });
    }
    const P = enEsc(e.x, e.y);
    datos.bolas.push({ en: P, r: 0.12, color: 'tinta' }, { en: suelo(P[0]), r: 0.08, color: 'c-i' }, { en: pared(P[2]), r: 0.08, color: 'c-i', rotulo: 'y' });
    datos.rotulos = [{ en: [P[0], 0, ZB - 0.3], texto: 'x', color: 'c-i' }];      // bajo el suelo: no choca con vy
    datos.trazos.push({ puntos: [P, suelo(P[0])], color: 'tinta', punteado: true }, { puntos: [P, pared(P[2])], color: 'tinta', punteado: true });
    const KV = 0.035;
    if (t < p.tVuelo - 1e-9) {
      datos.flechas.push({ de: P, a: [P[0] + e.vx * KV, 0, P[2]], color: 'c-o', rotulo: 'vx', grosor: 0.6 });
      if (Math.abs(e.vy) > 1e-9) datos.flechas.push({ de: P, a: [P[0], 0, P[2] + e.vy * KV], color: 'c-o', rotulo: 'vy', grosor: 0.6 });
    }
    datos.alt = `Pelota lanzada a ${f(v.v0, 0)} m/s y ${f(v.ang, 0)}°, a t = ${f(t, 2)} s: x = ${f(e.x, 1)} m, y = ${f(Math.max(0, e.y), 1)} m. `
      + 'Su sombra en el suelo avanza parejo; la de la pared sube y baja cada vez más lento cerca de la cima.';
    return { datos, x: e.x, y: Math.max(0, e.y), t, tSubida: p.tSubida, tVuelo: p.tVuelo, alcance: p.alcance, H: p.H, enAire: t < p.tVuelo - 1e-9 };
  }

  return { vectores, lorentz, espira, ondaEM, tiro, BNOMBRE, f };
});
