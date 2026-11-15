/*
 * Sólidos en 3D (ronda 4, 15 nov 2026): las cuentas de las piezas vivas de geometría (geo-simetria-3d, geo-espacio-3d,
 * geo-poliedro-3d, geo-revolucion-3d y geo-cubitos-3d). Sin DOM ni three.js, para que todo tenga pruebas (regla 1):
 * la pieza solo dibuja lo que este módulo calcula. Funciona en el navegador (window.Solidos3D) y en Node.
 *
 *   poliedro(id) → { id, nombre, vertices: [[x, y, z]], caras: [[índices en orden, vistos desde afuera]] }
 *                  centrado en el promedio de sus vértices; el eje y apunta hacia arriba.
 *   conteo(poli) → { C, V, A }               aristas(poli) → [[i, j]]
 *   reflejar(p, normal)                      reflejo de p en el plano por el origen con esa normal
 *   normalDe(inclinacion, giro)              normal unitaria (grados): se inclina desde la vertical y gira alrededor de ella
 *   esPlanoSimetria(poli, normal) → bool     el reflejo del sólido coincide con él (como conjunto de vértices)
 *   planosSimetria(poli) → [normales]        todos sus planos de simetría (pasan por el centro)
 *   apoyar(poli) → el sólido girado con una cara en el piso (para el desarrollo)
 *   desarrollo(poli, t) → { caras: [[puntos]], raiz }   t = 0: el desarrollo plano; t = 1: el sólido armado
 *   region(id, d) → { perfil: [[r, y]], area, rc, yc, nombre }   (rc, yc: centroide de la región)   región del plano meridiano a distancia d del eje
 *   revolucion(id, d, grados) → { volumen, completo, solido, ... }   Pappus-Guldin: V = área · ángulo · rc
 *   tresPiramides(a, b, c) → las tres pirámides de cúspide común que llenan una caja, con su volumen
 *   volumen(poli) → volumen de un poliedro convexo
 *   cubitos(n) → [{ p: [i, j, k], pintadas: [caras], clase }]   cubo de lado n pintado por fuera
 *   porClase(n) → { 3, 2, 1, 0 }             cuántos cubitos tienen 3, 2, 1 y 0 caras pintadas
 *   varilla(a, L, giro) → A, B, H, sombra, altura (la varilla AB apoyada en el piso, su sombra AH y su ángulo a)
 *   diedro(phi, p) → P en una cara, su pie H en el plano de la otra, PH y si H cae dentro de la cara
 *   proyectar(p, vista) → [x, y, profundidad]   para los respaldos planos (SVG) de las piezas
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Solidos3D = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const resta = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const suma = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const por = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const largo = a => Math.hypot(a[0], a[1], a[2]);
  const unit = a => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const centro = ps => por(ps.reduce(suma, [0, 0, 0]), 1 / ps.length);
  const limpio = x => (Math.abs(x) < 1e-12 ? 0 : x);
  const FI = (1 + Math.sqrt(5)) / 2;

  // ---------- Poliedros ----------
  // Caras de un conjunto convexo de puntos: planos por tres vértices que dejan a todos los demás de un lado.
  function casco(V) {
    const caras = [], vistos = [];
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) for (let k = j + 1; k < V.length; k++) {
      let n = cruz(resta(V[j], V[i]), resta(V[k], V[i]));
      if (largo(n) < 1e-9) continue;
      n = unit(n);
      let d = punto(n, V[i]), mas = 0, menos = 0;
      for (const P of V) { const s = punto(n, P) - d; if (s > 1e-7) mas++; else if (s < -1e-7) menos++; }
      if (mas && menos) continue;
      if (mas) { n = por(n, -1); d = -d; }                                  // la normal mira hacia afuera
      if (vistos.some(m => punto(m, n) > 1 - 1e-9)) continue;
      vistos.push(n);
      const en = V.map((P, q) => q).filter(q => Math.abs(punto(n, V[q]) - d) < 1e-7);
      const c = centro(en.map(q => V[q])), u = unit(resta(V[en[0]], c)), w = cruz(n, u);
      en.sort((p, q) => Math.atan2(punto(resta(V[p], c), w), punto(resta(V[p], c), u)) - Math.atan2(punto(resta(V[q], c), w), punto(resta(V[q], c), u)));
      caras.push(en);
    }
    return caras;
  }
  const anillo = (n, R, y, fase = 0) => Array.from({ length: n }, (_, k) => { const a = fase + 2 * Math.PI * k / n; return [R * Math.sin(a), y, R * Math.cos(a)]; });
  // R: radio de la circunferencia de la base (vértices a θ = 360°·k/n, el primero hacia el frente, +z).
  const RADIO = n => 1 / (2 * Math.sin(Math.PI / n));
  const CATALOGO = {
    tetraedro: { nombre: 'tetraedro regular', v: () => [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(p => por(p, 0.75)) },
    cubo: { nombre: 'cubo', v: () => { const v = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z]); return v; } },
    octaedro: { nombre: 'octaedro regular', v: () => [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(p => por(p, 1.4)) },
    dodecaedro: { nombre: 'dodecaedro regular', v: () => {
      const v = [];
      for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z]);
      for (const a of [-1, 1]) for (const b of [-1, 1]) v.push([0, a / FI, b * FI], [a / FI, b * FI, 0], [a * FI, 0, b / FI]);
      return v.map(p => por(p, 0.8));
    } },
    icosaedro: { nombre: 'icosaedro regular', v: () => {
      const v = [];
      for (const a of [-1, 1]) for (const b of [-1, 1]) v.push([0, a, b * FI], [a, b * FI, 0], [a * FI, 0, b]);
      return v.map(p => por(p, 0.75));
    } },
    // Caja de tres medidas distintas (ortoedro) y prisma de base cuadrada que no es cubo.
    ortoedro: { nombre: 'ortoedro de 3 · 2 · 1,4', v: () => { const v = []; for (const x of [-1.5, 1.5]) for (const y of [-0.7, 0.7]) for (const z of [-1, 1]) v.push([x, y, z]); return v; } },
    'prisma-4': { nombre: 'prisma de base cuadrada', v: () => { const v = []; for (const x of [-0.9, 0.9]) for (const y of [-1.4, 1.4]) for (const z of [-0.9, 0.9]) v.push([x, y, z]); return v; } },
  };
  for (const n of [3, 5, 6]) CATALOGO[`prisma-${n}`] = { nombre: `prisma ${['', '', '', 'triangular', '', 'pentagonal', 'hexagonal'][n]} regular`,
    v: () => { const R = 1.5 * RADIO(n) * (n === 3 ? 1.1 : n === 6 ? 0.6 : 0.8); return anillo(n, R, -1).concat(anillo(n, R, 1)); } };
  for (const n of [3, 4, 5, 6]) CATALOGO[`piramide-${n}`] = { nombre: `pirámide ${['', '', '', 'triangular', 'cuadrangular', 'pentagonal', 'hexagonal'][n]} regular`,
    v: () => { const R = n === 3 ? 1.5 : 1.35; return anillo(n, R, -1).concat([[0, n === 3 ? 0.8 : 1.4, 0]]); } };

  function poliedro(id) {
    const c = CATALOGO[id];
    if (!c) throw new Error(`poliedro desconocido: ${id}`);
    const v0 = c.v(), g = centro(v0), vertices = v0.map(p => resta(p, g).map(limpio));
    return { id, nombre: c.nombre, vertices, caras: casco(vertices) };
  }
  function aristas(poli) {
    const vistas = new Set(), lista = [];
    for (const f of poli.caras) for (let k = 0; k < f.length; k++) {
      const a = f[k], b = f[(k + 1) % f.length], clave = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!vistas.has(clave)) { vistas.add(clave); lista.push(a < b ? [a, b] : [b, a]); }
    }
    return lista;
  }
  const conteo = poli => ({ C: poli.caras.length, V: poli.vertices.length, A: aristas(poli).length });

  // ---------- Simetría ----------
  function normalDe(inclinacion, giro) {
    const t = rad(inclinacion), f = rad(giro);
    return [Math.sin(t) * Math.sin(f), Math.cos(t), Math.sin(t) * Math.cos(f)].map(limpio);
  }
  const reflejar = (p, normal) => { const n = unit(normal); return resta(p, por(n, 2 * punto(n, p))); };
  const coincide = (A, B) => A.every(P => B.some(Q => largo(resta(P, Q)) < 1e-6));
  const esPlanoSimetria = (poli, normal) => coincide(poli.vertices.map(p => reflejar(p, normal)), poli.vertices);
  function planosSimetria(poli) {
    const V = poli.vertices, hallados = [];
    const probar = n => {
      if (largo(n) < 1e-9) return;
      const u = unit(n);
      if (hallados.some(h => Math.abs(Math.abs(punto(h, u)) - 1) < 1e-9)) return;
      if (esPlanoSimetria(poli, u)) hallados.push(u);
    };
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
      if (Math.abs(largo(V[i]) - largo(V[j])) < 1e-6) probar(resta(V[i], V[j]));     // plano mediador de ViVj
      probar(cruz(V[i], V[j]));                                                      // plano por el centro, Vi y Vj
    }
    return hallados;
  }

  // ---------- Desarrollo que se pliega ----------
  // Rotación de p alrededor de la recta que pasa por a con dirección u (unitaria), en un ángulo th (Rodrigues).
  function rotar(p, a, u, th) {
    const v = resta(p, a), c = Math.cos(th), s = Math.sin(th);
    return suma(a, suma(suma(por(v, c), por(cruz(u, v), s)), por(u, punto(u, v) * (1 - c))));
  }
  const normalCara = (V, f) => unit(cruz(resta(V[f[1]], V[f[0]]), resta(V[f[2]], V[f[0]])));
  // Árbol de caras desde la de abajo (recorrido a lo ancho): cada cara cuelga de su madre por la arista que comparten.
  function arbol(poli) {
    const V = poli.vertices, F = poli.caras;
    const raiz = F.map((f, k) => k).sort((a, b) => centro(F[a].map(q => V[q]))[1] - centro(F[b].map(q => V[q]))[1])[0];
    const madre = { [raiz]: null }, orden = [raiz];
    for (let q = 0; q < orden.length; q++) {
      const m = orden[q], fm = F[m];
      for (let k = 0; k < fm.length; k++) {
        const a = fm[k], b = fm[(k + 1) % fm.length];
        F.forEach((f, h) => {
          if (h in madre) return;
          if (f.includes(a) && f.includes(b)) { madre[h] = { de: m, a, b }; orden.push(h); }
        });
      }
    }
    // Ángulo de bisagra: girar la cara hija alrededor de la arista hasta que su normal sea la de la madre.
    for (const h of orden.slice(1)) {
      const { de, a, b } = madre[h], u = unit(resta(V[b], V[a])), nh = normalCara(V, F[h]), nm = normalCara(V, F[de]);
      const ang = Math.acos(Math.max(-1, Math.min(1, punto(nh, nm))));
      const ok = s => punto(unit(resta(rotar(suma(V[a], nh), V[a], u, s * ang), V[a])), nm) > 1 - 1e-6;
      madre[h].ang = ok(1) ? ang : -ang;
      madre[h].u = u;
    }
    return { raiz, madre, orden };
  }
  // El mismo sólido girado para que su cara de más abajo quede apoyada en el piso (normal hacia −y): así el desarrollo
  // se abre sobre la mesa. Los tetraedros, octaedros y demás regulares del catálogo no traen una cara horizontal.
  function apoyar(poli) {
    const V = poli.vertices, F = poli.caras;
    const k = F.map((f, q) => q).sort((a, b) => centro(F[a].map(q => V[q]))[1] - centro(F[b].map(q => V[q]))[1])[0];
    const n = normalCara(V, F[k]), abajo = [0, -1, 0], eje = cruz(n, abajo), s = largo(eje), c = punto(n, abajo);
    if (s < 1e-12) return poli;
    const u = por(eje, 1 / s), th = Math.atan2(s, c);
    return Object.assign({}, poli, { vertices: V.map(p => rotar(p, [0, 0, 0], u, th).map(limpio)) });
  }
  function desarrollo(poli, t) {
    const V = poli.vertices, F = poli.caras, ar = arbol(poli), abierto = 1 - Math.max(0, Math.min(1, t));
    // Cada cara: primero gira en su bisagra (en las coordenadas del sólido armado) y después hereda lo de su madre.
    const transf = { [ar.raiz]: p => p };
    for (const h of ar.orden.slice(1)) {
      const m = ar.madre[h], T = transf[m.de];
      transf[h] = p => T(rotar(p, V[m.a], m.u, abierto * m.ang));
    }
    return { raiz: ar.raiz, caras: F.map((f, k) => f.map(q => transf[k](V[q]))) };
  }

  // ---------- Sólidos de revolución (eje vertical; r es la distancia al eje) ----------
  const REGIONES = {
    rectangulo: { nombre: 'rectángulo', area: 2, rc: 0.5, yc: 0, perfil: d => [[d, -1], [d + 1, -1], [d + 1, 1], [d, 1]] },
    triangulo: { nombre: 'triángulo', area: 1, rc: 1 / 3, yc: -1 / 3, perfil: d => [[d, -1], [d + 1, -1], [d, 1]] },
    semicirculo: { nombre: 'semicírculo', area: Math.PI / 2, rc: 4 / (3 * Math.PI), yc: 0,
      perfil: d => Array.from({ length: 25 }, (_, k) => { const a = Math.PI * k / 24; return [d + Math.sin(a), Math.cos(a)]; }) },
    circulo: { nombre: 'círculo', area: Math.PI * 0.36, rc: 0.6, yc: 0,
      perfil: d => Array.from({ length: 32 }, (_, k) => { const a = 2 * Math.PI * k / 32; return [d + 0.6 + 0.6 * Math.cos(a), 0.6 * Math.sin(a)]; }) },
  };
  // Qué sólido barre la región al dar la vuelta entera.
  const SOLIDO = {
    rectangulo: d => (d === 0 ? 'cilindro' : 'cilindro hueco'),
    triangulo: d => (d === 0 ? 'cono' : 'cilindro con hueco de cono'),
    semicirculo: d => (d === 0 ? 'esfera' : 'anillo de media esfera'),
    circulo: d => (d === 0 ? 'toro sin agujero' : 'toro'),
  };
  function region(id, d) {
    const R = REGIONES[id];
    if (!R) throw new Error(`región desconocida: ${id}`);
    return { id, nombre: R.nombre, perfil: R.perfil(d), area: R.area, rc: d + R.rc, yc: R.yc };
  }
  function revolucion(id, d, grados) {
    const g = region(id, d), th = rad(grados);
    return Object.assign(g, { grados, volumen: g.area * g.rc * th, completo: 2 * Math.PI * g.area * g.rc,
      recorrido: g.rc * th, solido: SOLIDO[id](d), entero: grados >= 360 });
  }

  // ---------- Tres pirámides que llenan una caja ----------
  // Volumen de un poliedro convexo: tetraedros desde su primer vértice hasta cada triángulo de sus caras.
  function volumen(poli) {
    const V = poli.vertices, O = V[0];
    let vol = 0;
    for (const f of poli.caras) for (let k = 1; k + 1 < f.length; k++) vol += punto(resta(V[f[0]], O), cruz(resta(V[f[k]], O), resta(V[f[k + 1]], O))) / 6;
    return Math.abs(vol);
  }
  // Caja de lados a (x), b (y), c (z) centrada en el origen. Las tres pirámides comparten la cúspide en la esquina
  // (−a/2, −b/2, −c/2) y tienen por base las tres caras que no la tocan (x = a/2, y = b/2, z = c/2).
  function tresPiramides(a, b, c) {
    const A = [-a / 2, -b / 2, -c / 2], h = [a / 2, b / 2, c / 2], ejes = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
    const piezas = ejes.map(([i, j, k]) => {
      const base = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, w]) => { const p = [0, 0, 0]; p[i] = h[i]; p[j] = u * h[j]; p[k] = w * h[k]; return p; });
      const vertices = [A, ...base].map(p => p.map(limpio)), poli = { vertices, caras: casco(vertices) };
      return { vertices, caras: poli.caras, volumen: volumen(poli), base: centro(base), altura: [a, b, c][i] };
    });
    return { piezas, caja: a * b * c, cuspide: A };
  }

  // ---------- Cubo pintado ----------
  function cubitos(n) {
    const lista = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
      const pintadas = [];
      if (i === 0) pintadas.push('-x'); if (i === n - 1) pintadas.push('+x');
      if (j === 0) pintadas.push('-y'); if (j === n - 1) pintadas.push('+y');
      if (k === 0) pintadas.push('-z'); if (k === n - 1) pintadas.push('+z');
      lista.push({ p: [i, j, k], pintadas, clase: pintadas.length });
    }
    return lista;
  }
  function porClase(n) {
    const c = { 3: 0, 2: 0, 1: 0, 0: 0 };
    for (const q of cubitos(n)) c[q.clase]++;
    return c;
  }

  // ---------- Rectas y planos ----------
  // Varilla de largo L apoyada en A (origen, en el piso y = 0), a «a» grados del piso, girada «giro» grados.
  function varilla(a, L, giro) {
    const t = rad(a), g = rad(giro || 0);
    const B = [L * Math.cos(t) * Math.sin(g), L * Math.sin(t), L * Math.cos(t) * Math.cos(g)].map(limpio), H = [B[0], 0, B[2]];
    return { A: [0, 0, 0], B, H, sombra: Math.hypot(H[0], H[2]), altura: B[1], largo: L, angulo: a };
  }
  // Diedro de arista en el eje x: una cara es el piso (z ≥ 0) y la otra se abre phi grados. P está en la segunda cara,
  // a p de la arista; H es su pie en el plano del piso. Si phi > 90°, H cae fuera de la cara del piso (z < 0).
  function diedro(phi, p) {
    const f = rad(phi), u = [0, Math.sin(f), Math.cos(f)].map(limpio), P = por(u, p);
    const H = [0, 0, limpio(P[2])];
    return { u, P, H, O: [0, 0, 0], PH: P[1], aArista: p, dentro: H[2] >= -1e-9, angulo: phi };
  }

  // ---------- Proyección para los respaldos planos ----------
  // Gira y inclina como la base 3D (nucleo/kit/vivo3d.js): giro alrededor del eje y, después inclinación en x.
  function proyectar(p, vista) {
    const a = rad(vista.giro || 0), b = rad(vista.inclinacion || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }

  return {
    poliedro, CATALOGO: Object.keys(CATALOGO), aristas, conteo, casco,
    normalDe, reflejar, esPlanoSimetria, planosSimetria,
    desarrollo, apoyar, rotar,
    region, revolucion, REGIONES: Object.keys(REGIONES),
    cubitos, porClase, varilla, diedro, proyectar, volumen, tresPiramides,
    util: { resta, suma, por, punto, cruz, largo, unit, centro },
  };
});
