/*
 * Pieza «alg-planos-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): las tres ecuaciones de un sistema de 3 × 3 como
 * tres planos dentro de un cubo, que se gira con el dedo.
 *
 * Afirmación de la figura: resolver el sistema es buscar lo que los tres planos tienen en común: un punto, una recta
 * o nada (planos paralelos, o tres rectas paralelas de dos en dos, como un prisma sin tapas). Qué pasa, el punto, la
 * recta común y las rectas de dos en dos los calcula plantillas/matrices/motor.js (tresPlanos y recortarRecta, con
 * pruebas); el pedazo de plano que cabe en el cubo, nucleo/geometria3d.js (seccion). La pieza solo dibuja (regla 1).
 *
 * datos = {
 *   planos: [[a, b, c, d], …],       // tres ecuaciones ax + by + cz = d
 *   lado:   3,                       // el cubo |x|, |y|, |z| ≤ lado (opcional)
 *   vista:  { giro, inclinacion },   // opcional; sin ella, 25° y 18°
 *   alt,
 * }
 * Colores (regla 4): la ecuación 1 en c-o, la 2 en c-i y la 3 en c-d; lo común a las tres, en tinta.
 *
 * Respaldo (dibujar): los planos, las rectas y el punto proyectados desde datos.vista. Se usa mientras carga three.js,
 * sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  // Los motores se buscan al usarlos: en la app, las piezas y los motores de «requiere» cargan en paralelo.
  const M = nodo ? require('../../../plantillas/matrices/motor.js') : null;
  const G = nodo ? require('../../geometria3d.js') : null;
  const api = fabrica(Kit, () => M || root.MotorMatrices, () => G || root.Geo3D);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, motor, geo) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const COLOR = ['c-o', 'c-i', 'c-d'];
  const E = 0.5;
  const ladoDe = d => d.lado || 3;
  const vistaDe = d => d.vista || { giro: 25, inclinacion: 18 };
  const sistema = d => motor().tresPlanos({ planos: d.planos });
  const MENOS = '−';
  // «x + y + z = 3», «x − z = 0», «0 = 2»: la ecuación como se escribe en clase.
  function ecuacion(p) {
    const [a, b, c, k] = p, partes = [];
    [[a, 'x'], [b, 'y'], [c, 'z']].forEach(([n, l]) => {
      if (!n) return;
      const m = Math.abs(n) === 1 ? l : `${f(Math.abs(n))}${l}`;
      partes.push(partes.length ? `${n < 0 ? MENOS : '+'} ${m}` : `${n < 0 ? MENOS : ''}${m}`);
    });
    return `${partes.length ? partes.join(' ') : '0'} = ${f(k).replace('-', MENOS)}`;
  }
  // Pedazo del plano dentro del cubo (polígono, en el orden de su borde); vacío si no lo toca o si la ecuación no es un plano.
  function pedazo(d, p) {
    const n = Math.hypot(p[0], p[1], p[2]), L = ladoDe(d);
    if (n < 1e-12) return [];
    const s = geo().seccion({ a: 2 * L, b: 2 * L, c: 2 * L }, [p[0], p[1], p[2]], p[3] / n);
    return s.lados >= 3 ? s.puntos : [];
  }
  const escena = p => [p[0] * E, p[2] * E, -p[1] * E];          // matemática (z arriba) → escena (alto en y)
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Entre los candidatos, el más lejano de lo ya ocupado (el más lejano del centro si no hay nada).
  const rotulo = (cands, ocupados) => {
    const holgura = q => (ocupados.length ? Math.min(...ocupados.map(o => Math.hypot(q[0] - o[0], q[1] - o[1], q[2] - o[2]))) : Math.hypot(...q));
    return cands.reduce((a, q) => (holgura(q) > holgura(a) ? q : a), cands[0]);
  };
  const dentro = (d, q) => q && q.every(x => Math.abs(x) <= ladoDe(d) + 1e-9);
  // Lo que se dibuja, ya calculado: pedazos de plano, rectas recortadas al cubo, la recta común y el punto.
  function figura(d) {
    const s = sistema(d), L = ladoDe(d), M2 = motor();
    const rec = r => M2.recortarRecta({ punto: r.punto, dir: r.dir, lado: L });
    return {
      s,
      pedazos: d.planos.map(p => pedazo(d, p)),
      rectas: s.tipo === 'punto' || s.tipo === 'recta' || s.caso === 'prisma' ? s.pares.map(r => ({ i: r.i, j: r.j, tramo: rec(r) })).filter(r => r.tramo) : [],
      comun: s.recta ? rec(s.recta) : null,
      punto: dentro(d, s.punto) ? s.punto : null,
    };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const s = sistema(d);
    const fuera = s.punto && !dentro(d, s.punto) ? ', fuera del cubo dibujado' : '';
    return `Tres planos: ${d.planos.map((p, k) => `ecuación ${k + 1}, ${ecuacion(p)}`).join('; ')}. ${s.texto.charAt(0).toUpperCase()}${s.texto.slice(1)}${fuera}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, L = ladoDe(d), PX = 118 / (L * E * 1.75), fg = figura(d);
    const p2 = q => { const g = girar(escena(q), v.giro, v.inclinacion); return [W / 2 + g[0] * PX, H / 2 - g[1] * PX, g[2]]; };
    const esq = [];
    for (const x of [-L, L]) for (const y of [-L, L]) for (const z of [-L, L]) esq.push(p2([x, y, z]));
    const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const planos = fg.pedazos.map((pts, k) => ({ k, puntos: pts.map(p2) })).filter(x => x.puntos.length)
      .map(x => Object.assign(x, { prof: x.puntos.reduce((a, q) => a + q[2], 0) / x.puntos.length })).sort((a, b) => a.prof - b.prof);
    return { W, H, cubo: ARISTAS.map(([i, j]) => [esq[i], esq[j]]), planos, rectas: fg.rectas.map(r => r.tramo.map(p2)),
      comun: fg.comun ? fg.comun.map(p2) : null, punto: fg.punto ? p2(fg.punto) : null };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, ln = (a, b, extra) => `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" ${extra}/>`;
    const cubo = pl.cubo.map(([a, b]) => ln(a, b, 'stroke="currentColor" stroke-opacity="0.3" stroke-width="1"')).join('');
    const planos = pl.planos.map(x => `<polygon points="${x.puntos.map(q => `${n(q[0])},${n(q[1])}`).join(' ')}" fill="var(--${COLOR[x.k]})" fill-opacity="0.28" stroke="var(--${COLOR[x.k]})" stroke-width="1.6" stroke-linejoin="round"/>`).join('');
    const rectas = pl.rectas.map(([a, b]) => ln(a, b, 'stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 4"')).join('');
    const comun = pl.comun ? ln(pl.comun[0], pl.comun[1], 'stroke="currentColor" stroke-width="4" stroke-linecap="round"') : '';
    const punto = pl.punto ? `<circle cx="${n(pl.punto[0])}" cy="${n(pl.punto[1])}" r="6" fill="currentColor"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-cubo">${cubo}</g><g class="kit-planos">${planos}</g>${rectas}${comun}${punto}</svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([ladoDe(d), d.vista || null]),
    distancia: 8.5, distMin: 4.5, distMax: 14,
    tocar: o => (o && o.userData && o.userData.dice) || '',
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340'), L = ladoDe(d), fg = figura(d), tocables = [], puestos = fg.punto ? [fg.punto] : [];
      const V = p => new T.Vector3(...escena(p));
      // El cubo de referencia, tenue: marca hasta dónde se dibujan los planos.
      const caja = new T.BoxGeometry(2 * L * E, 2 * L * E, 2 * L * E);
      grupo.add(new T.LineSegments(new T.EdgesGeometry(caja), new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.25 })));
      caja.dispose();
      fg.pedazos.forEach((pts, k) => {
        if (!pts.length) return;
        const c = pts.reduce((a, q) => a.map((x, i) => x + q[i] / pts.length), [0, 0, 0]), pos = [];
        for (let i = 0; i < pts.length; i++) pos.push(...escena(c), ...escena(pts[i]), ...escena(pts[(i + 1) % pts.length]));
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        const color = h.varCss(`--${COLOR[k]}`, '#888');
        const m = new T.Mesh(geo, h.material(color, { transparent: true, opacity: 0.38, side: T.DoubleSide, depthWrite: false }));
        m.userData.dice = `Ecuación ${k + 1}: ${ecuacion(d.planos[k])}.`;
        grupo.add(m); tocables.push(m);
        const borde = new T.BufferGeometry(); borde.setAttribute('position', new T.Float32BufferAttribute(pts.concat([pts[0]]).flatMap(escena), 3));
        grupo.add(new T.Line(borde, new T.LineBasicMaterial({ color: new T.Color(color) })));
        // El rótulo, hacia un vértice del pedazo: el que más lo aleja de los rótulos ya puestos y del punto común.
        const lejos = rotulo(pts.map(q => c.map((x, i) => x + 0.72 * (q[i] - x))), puestos);
        puestos.push(lejos);
        h.etiqueta(V(lejos), `ec. ${k + 1}`, { color: COLOR[k] });
      });
      for (const r of fg.rectas) grupo.add(h.barra(V(r.tramo[0]), V(r.tramo[1]), 0.022, tinta));
      if (fg.comun) {
        const b = h.barra(V(fg.comun[0]), V(fg.comun[1]), 0.06, tinta);
        b.userData.dice = 'La recta común: cada punto suyo cumple las tres ecuaciones.';
        grupo.add(b); tocables.push(b);
      }
      if (fg.punto) {
        const s = new T.Mesh(new T.SphereGeometry(0.12, h.SEG, h.SEG / 2), h.material(tinta));
        s.position.copy(V(fg.punto)); s.userData.dice = `El único punto común: (${fg.punto.map(x => f(x)).join('; ')}).`;
        grupo.add(s); tocables.push(s);
      }
      return { tocables, aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'alg-planos-3d', dibujar, alt, montar, plano, girar, sistema, ecuacion, figura, rotulo };
});
