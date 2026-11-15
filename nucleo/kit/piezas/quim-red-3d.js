/*
 * Pieza «quim-red-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): una celda cúbica de un cristal, o un bloque de ocho
 * celdas, que se gira con el dedo. Va sobre la base común nucleo/kit/vivo3d.js.
 *
 * Afirmación de la figura: de cada esfera solo cuenta, para la celda, el trozo que queda dentro del cubo (un octavo en
 * los vértices, media en las caras, entera en el centro); en el bloque, el átomo del centro toca a sus vecinos más
 * cercanos. Los sitios, las fracciones, el radio y los vecinos los calcula el motor de plantillas/liquidos-y-solidos
 * (celda, bloqueRed; regla 1). La pieza solo los dibuja: girar no cambia nada.
 *
 * datos = {
 *   modo:    'celda' | 'bloque',
 *   sitios:  [{ p: [x, y, z], fraccion, dentro: [±1|0, ±1|0, ±1|0] }],   // celda: en aristas (0 a 1); dentro: hacia
 *                                                                        // dónde queda el cubo desde el sitio
 *   bloque:  { puntos: [[x, y, z]], centro, vecinos: [i], n },           // bloque: en aristas (0 a n)
 *   radio:   r/a con que se dibujan las esferas (el real o uno chico para ver adentro),
 *   nombre:  'cúbica centrada en las caras', vista, alt,
 * }
 * Colores (regla 4): lo que cuenta para la celda (átomos por celda) turquesa c-i, con rótulos «⅛», «½» y «1» del mismo
 * color; los vecinos del átomo del centro (número de coordinación) naranja c-o, con sus enlaces; el resto, tinta tenue.
 *
 * Respaldo (dibujar): la misma figura proyectada desde datos.vista, con círculos. Se usa mientras carga three.js, sin
 * WebGL 2, en Node y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const api = fabrica(Kit);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const rad = g => g * Math.PI / 180, PI = Math.PI;
  const LADO = 2.4;                                          // arista de la celda en la escena
  const vistaDe = d => d.vista || { giro: 30, inclinacion: 22 };
  const lado = d => (d.modo === 'bloque' ? LADO * 0.62 : LADO);
  const n = d => (d.modo === 'bloque' ? d.bloque.n : 1);
  const aEscena = (d, p) => p.map(x => (x - n(d) / 2) * lado(d));
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Trozo de esfera dentro del cubo, para SphereGeometry (x = −cos φ sen θ, y = cos θ, z = sen φ sen θ).
  function gajo(dx, dy, dz) {
    const th = dy > 0 ? [0, PI / 2] : dy < 0 ? [PI / 2, PI / 2] : [0, PI];
    let ph;
    if (!dx && !dz) ph = [0, 2 * PI];
    else if (dx && !dz) ph = dx > 0 ? [PI / 2, PI] : [3 * PI / 2, PI];
    else if (!dx && dz) ph = dz > 0 ? [0, PI] : [PI, PI];
    else ph = dx > 0 ? (dz > 0 ? [PI / 2, PI / 2] : [PI, PI / 2]) : (dz > 0 ? [0, PI / 2] : [3 * PI / 2, PI / 2]);
    return { phiStart: ph[0], phiLength: ph[1], thetaStart: th[0], thetaLength: th[1] };
  }
  // Sector de un disco (CircleGeometry: (cos t, sen t)) donde los ejes locales u y v tienen los signos du y dv.
  function sector(du, dv) {
    if (!du && !dv) return [0, 2 * PI];
    if (du && !dv) return du > 0 ? [3 * PI / 2, PI] : [PI / 2, PI];
    if (!du && dv) return dv > 0 ? [0, PI] : [PI, PI];
    return du > 0 ? (dv > 0 ? [0, PI / 2] : [3 * PI / 2, PI / 2]) : (dv > 0 ? [PI / 2, PI / 2] : [PI, PI / 2]);
  }
  // Tapas planas del trozo: una por eje en el que el sitio está sobre una cara del cubo. Ejes locales (u, v, normal).
  const BASES = [[1, 2, 0], [2, 0, 1], [0, 1, 2]];
  const tapas = dentro => dentro.map((s, i) => (s ? { eje: i, u: BASES[i][0], v: BASES[i][1], sector: sector(dentro[BASES[i][0]], dentro[BASES[i][1]]) } : null)).filter(Boolean);
  const FRAC = f => ({ 0.125: '⅛', 0.25: '¼', 0.5: '½', 1: '1' }[f] || String(f));
  // Un rótulo por tipo de sitio (el de cada fracción más cercano a la cámara de partida), para no tapar la celda. Va afuera del cubo, junto a su
  // trozo (en el vértice o en el centro de la cara), para que se lea sobre el fondo; el del centro, en el centro.
  const rotulos = d => {
    const v = vistaDe(d), hacia = s => girar(s.p.map(x => x - 0.5), v.giro, v.inclinacion)[2];   // + hacia la cámara
    const sitios = (d.sitios || []).slice().sort((a, b) => hacia(b) - hacia(a));                  // el más visible primero
    const vistos = new Set(), r = [];
    for (const s of sitios) {
      if (vistos.has(s.fraccion)) continue;
      vistos.add(s.fraccion);
      const n = Math.hypot(...s.dentro) || 1;
      r.push({ texto: FRAC(s.fraccion), p: s.p.map((x, i) => x - s.dentro[i] / n * 0.16) });
    }
    return r;
  };
  function alt(d) {
    if (d.alt) return d.alt;
    if (d.modo === 'bloque') return `Bloque de ${d.bloque.n ** 3} celdas de la red ${d.nombre}: ${d.bloque.puntos.length} átomos; el del centro toca a ${d.bloque.vecinos.length} vecinos.`;
    const cuenta = {};
    for (const s of d.sitios) cuenta[s.fraccion] = (cuenta[s.fraccion] || 0) + 1;
    const partes = Object.keys(cuenta).sort((a, b) => a - b).map(f => `${cuenta[f]} ${{ 0.125: cuenta[f] === 1 ? 'octavo' : 'octavos', 0.5: cuenta[f] === 1 ? 'mitad' : 'mitades', 1: cuenta[f] === 1 ? 'átomo entero' : 'átomos enteros' }[f] || `trozos de ${f}`}`);
    const total = d.sitios.reduce((t, s) => t + s.fraccion, 0);
    return `Celda de la red ${d.nombre}: ${partes.join(' y ')} dentro del cubo, ${Kit.formatear(total, 2)} ${total === 1 ? 'átomo' : 'átomos'} en total.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, E = 40, N = n(d);
    const p2 = p => { const q = girar(aEscena(d, p), v.giro, v.inclinacion); return [W / 2 + q[0] * E, H / 2 - q[1] * E, q[2]]; };
    const aristas = [];
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      aristas.push([p2([0, i, j]), p2([N, i, j])], [p2([i, 0, j]), p2([i, N, j])], [p2([i, j, 0]), p2([i, j, N])]);
    }
    const r = d.radio * lado(d) * E;
    let esferas;
    if (d.modo === 'bloque') {
      const vec = new Set(d.bloque.vecinos);
      esferas = d.bloque.puntos.map((p, i) => ({ c: p2(p), clase: i === d.bloque.centro ? 'centro' : vec.has(i) ? 'vecino' : 'otro' }));
    } else esferas = d.sitios.map(s => ({ c: p2(s.p), clase: 'celda', fraccion: s.fraccion }));
    esferas.sort((a, b) => a.c[2] - b.c[2]);              // de atrás hacia adelante
    const enlaces = d.modo === 'bloque' ? d.bloque.vecinos.map(i => [p2(d.bloque.puntos[d.bloque.centro]), p2(d.bloque.puntos[i])]) : [];
    return { W, H, aristas, esferas, r, enlaces, rotulos: d.modo === 'bloque' ? [] : rotulos(d).map(x => ({ texto: x.texto, c: p2(x.p) })) };
  }
  function dibujar(d) {
    const pl = plano(d), k = x => Math.round(x * 10) / 10;
    const COLOR = { celda: 'var(--c-i, #08807a)', vecino: 'var(--c-o, #b85a06)', centro: 'currentColor', otro: 'currentColor' };
    const OP = { celda: 0.55, vecino: 0.75, centro: 0.9, otro: 0.15 };
    const ar = pl.aristas.map(([a, b]) => `<line x1="${k(a[0])}" y1="${k(a[1])}" x2="${k(b[0])}" y2="${k(b[1])}"/>`).join('');
    const es = pl.esferas.map(e => `<circle cx="${k(e.c[0])}" cy="${k(e.c[1])}" r="${k(pl.r)}" fill="${COLOR[e.clase]}" fill-opacity="${OP[e.clase]}" stroke="currentColor" stroke-opacity="0.35" class="kit-${e.clase}"/>`).join('');
    const en = pl.enlaces.map(([a, b]) => `<line x1="${k(a[0])}" y1="${k(a[1])}" x2="${k(b[0])}" y2="${k(b[1])}" stroke="var(--c-o, #b85a06)" stroke-width="2"/>`).join('');
    const ro = pl.rotulos.map(x => `<text x="${k(x.c[0])}" y="${k(x.c[1])}" font-size="15" font-weight="700" fill="var(--c-i, #08807a)" text-anchor="middle" dy="5">${x.texto}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">`
      + `<g class="kit-aristas" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.2">${ar}</g><g class="kit-enlaces">${en}</g><g class="kit-esferas">${es}</g><g class="kit-rotulos">${ro}</g></svg>`;
  }

  // ---------- En vivo, sobre la base común ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.modo, d.vista || null]),
    distancia: 8.4, distMin: 4, distMax: 14,
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340'), turquesa = h.varCss('--c-i', '#08807a'), naranja = h.varCss('--c-o', '#b85a06');
      const L = lado(d), N = n(d), r = d.radio * L, V = p => new T.Vector3(...aEscena(d, p));
      // Aristas de las celdas.
      const pos = [];
      for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
        for (const [a, b] of [[[0, i, j], [N, i, j]], [[i, 0, j], [i, N, j]], [[i, j, 0], [i, j, N]]]) pos.push(...aEscena(d, a), ...aEscena(d, b));
      }
      const ga = new T.BufferGeometry(); ga.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      grupo.add(new T.LineSegments(ga, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.55 })));
      if (d.modo === 'bloque') {
        const vec = new Set(d.bloque.vecinos), seg = h.ahorro ? 10 : 14;
        const geo = new T.SphereGeometry(r, seg, Math.round(seg * 0.7)), m = new T.Matrix4();
        const grupoDe = (lista, mat) => {
          if (!lista.length) return;
          const im = new T.InstancedMesh(geo, mat, lista.length);
          lista.forEach((p, i) => { m.makeTranslation(...aEscena(d, p)); im.setMatrixAt(i, m); });
          grupo.add(im);
        };
        const otros = d.bloque.puntos.filter((p, i) => i !== d.bloque.centro && !vec.has(i));
        grupoDe(otros, h.material(tinta, { transparent: true, opacity: 0.18, depthWrite: false }));
        grupoDe(d.bloque.vecinos.map(i => d.bloque.puntos[i]), h.material(naranja));
        const c = new T.Mesh(new T.SphereGeometry(r, h.SEG, Math.round(h.SEG * 0.7)), h.material(tinta));
        c.position.copy(V(d.bloque.puntos[d.bloque.centro])); grupo.add(c);
        const lin = [];
        for (const i of d.bloque.vecinos) lin.push(...aEscena(d, d.bloque.puntos[d.bloque.centro]), ...aEscena(d, d.bloque.puntos[i]));
        const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute(lin, 3));
        grupo.add(new T.LineSegments(gl, new T.LineBasicMaterial({ color: new T.Color(naranja) })));
        const cv = d.bloque.puntos[d.bloque.centro];
        h.etiqueta(V([cv[0], cv[1] + 0.32, cv[2]]), `${d.bloque.vecinos.length} vecinos`, { color: 'c-o' });
        return { aria: alt(d) };
      }
      // Celda: el trozo de cada esfera que queda dentro del cubo, con sus tapas planas.
      const claro = turquesa;
      const mat = h.material(claro, { side: T.DoubleSide }), matTapa = h.material(claro, { side: T.DoubleSide });
      const ejes = [new T.Vector3(1, 0, 0), new T.Vector3(0, 1, 0), new T.Vector3(0, 0, 1)];
      for (const s of d.sitios) {
        const g = gajo(...s.dentro);
        const m = new T.Mesh(new T.SphereGeometry(r, h.SEG, Math.round(h.SEG * 0.7), g.phiStart, g.phiLength, g.thetaStart, g.thetaLength), mat);
        m.position.copy(V(s.p)); grupo.add(m);
        for (const t of tapas(s.dentro)) {
          const c = new T.Mesh(new T.CircleGeometry(r, h.SEG, t.sector[0], t.sector[1]), matTapa);
          c.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(ejes[t.u], ejes[t.v], ejes[t.eje]));
          c.position.copy(V(s.p)); grupo.add(c);
        }
      }
      for (const x of rotulos(d)) h.etiqueta(V(x.p), x.texto, { color: 'c-i' });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'quim-red-3d', dibujar, alt, montar, plano, girar, gajo, sector, tapas, rotulos };
});
