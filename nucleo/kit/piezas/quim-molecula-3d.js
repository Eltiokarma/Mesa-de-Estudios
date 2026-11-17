/*
 * Pieza «quim-molecula-3d» (15 nov 2026, docs/dos-entradas.md): una molécula pequeña que se gira con el dedo, con
 * three.js. Es la primera pieza viva del kit: además de dibujar(datos, estado) → SVG, trae montar(el), que deja un
 * lienzo WebGL que se actualiza sin rehacerse (app/teoria.js lo usa si la pieza lo tiene).
 *
 * Afirmación de la figura: la forma de la molécula es la que dan sus posiciones 3D (las calcula la unidad con el
 * motor de plantillas/enlace, regla 1); girarla no la cambia. La pieza no sabe química: dibuja lo que le pasan.
 *
 * Respaldo (dibujar): la misma molécula proyectada en el plano con la pieza «quim-molecula», vista desde
 * datos.vista. Se usa mientras carga three.js, si el equipo no tiene WebGL 2, en Node (pruebas) y en las miniaturas
 * de la colección. El alt dice que es una proyección.
 *
 * datos = {
 *   atomos:  [{ id, t: 'N', pos: [x, y, z] }],            // pos en largos de enlace (el central en el origen)
 *   enlaces: [{ a, b, orden: 1|2|3, dipolo: 'a' | 'b' }],  // dipolo: hacia qué átomo apunta la flecha del enlace
 *   pares:   [{ en: id, dir: [x, y, z] }],                 // un par libre en la dirección dir (vector unitario)
 *   total:   [x, y, z] | null,                             // dipolo total (para la flecha gruesa); null o ~0: no hay
 *   vista:   { giro, inclinacion },                        // grados (opcional): sin ella, la que más separa los átomos
 *   escala:  número,                                      // opcional (1): achica todo, para que quepan dos moléculas
 *   simbolos: true,                                       // opcional: rótulo HTML con el símbolo de cada átomo que no es C
 *   giro:    grados,                                      // opcional (ronda 5, animación): la molécula girada sobre su eje
 *                                                         // vertical; sin él, 0. Girar no cambia la molécula.
 *   alt,
 * }
 * estado = { dipolos: true|false, pares: true|false }.
 *
 * Animación (docs/3d.md §6): forma(datos, estado) no depende de giro, y mover solo gira el pivote que guarda la molécula
 * y lleva cada rótulo a su lugar (h.moverEtiqueta): la escena no se rearma en cada cuadro.
 * Ampliado (sesión quimica-b, hidrocarburos: un enlace C–C que gira): forma tampoco depende de las posiciones de los
 * átomos, solo de cuáles hay y cómo se unen. Si las posiciones cambian, mover corre esferas, barras y rótulos a su
 * lugar nuevo; si a la vista hay pares libres o flechas de dipolo (dependen de las posiciones), pide rearmar.
 *
 * En vivo, sobre la base común nucleo/kit/vivo3d.js: arrastrar gira, pellizco acerca, teclado, «Vista inicial», modo ahorro,
 * dibujar solo cuando algo cambia y volver solo si el equipo corta el 3D. Aquí solo se arma la escena; tocar un átomo
 * dice cuál es.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) { require('./quim-molecula.js'); require('../vivo3d.js'); }
  const El = nodo ? require('../../elementos.js') : root.Elementos;
  const api = fabrica(Kit, El, root);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, El, root) {
  'use strict';
  const L = 1.6;                                   // largo de enlace en unidades de la pieza plana
  const rad = g => g * Math.PI / 180;

  // Gira un vector: primero alrededor del eje vertical (giro), después del horizontal (inclinación).
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const modulo = v => Math.hypot(v[0], v[1], v[2]);
  // Vista sin datos.vista: la más cercana a 30° de giro y 20° de inclinación (se lee como 3D) en la que ningún átomo
  // queda encimado en el plano (separación ≥ SEPARA largos de enlace), buscando cada 10°. Una vista «de frente» que
  // aplana la molécula (el CH₄ visto como un cuadrado de 90°) refuerza el error del dibujo plano; por eso no se busca
  // la separación máxima. Si ninguna vista cumple, la que más separa.
  const SEPARA = 0.55, vistas = new Map();
  function mejorVista(d) {
    const k = JSON.stringify(d.atomos.map(a => [a.t, a.pos]));
    if (vistas.has(k)) return vistas.get(k);
    let cerca = null, separa = null;
    for (let gi = 0; gi < 360; gi += 10) for (let inc = -60; inc <= 60; inc += 10) {
      const q = d.atomos.map(a => girar(a.pos, gi, inc));
      let min = Infinity;
      for (let a = 0; a < q.length; a++) for (let b = a + 1; b < q.length; b++) min = Math.min(min, Math.hypot(q[a][0] - q[b][0], q[a][1] - q[b][1]));
      const lejos = Math.hypot(Math.min(Math.abs(gi - 30), 360 - Math.abs(gi - 30)), inc - 20);
      if (min >= SEPARA && (!cerca || lejos < cerca.lejos - 1e-9)) cerca = { lejos, giro: gi, inclinacion: inc };
      if (!separa || min > separa.min + 1e-9) separa = { min, giro: gi, inclinacion: inc };
    }
    const m = cerca || separa, v = { giro: m.giro, inclinacion: m.inclinacion };
    vistas.set(k, v);
    return v;
  }
  const vistaDe = d => d.vista || mejorVista(d);

  // ---------- Respaldo plano ----------
  function plano(d, e) {
    const v = vistaDe(d), g = p => girar(p, v.giro + (d.giro || 0), v.inclinacion);   // giro propio, después la vista
    const pos = new Map(d.atomos.map(a => [a.id, g(a.pos)]));
    const atomos = d.atomos.map(a => { const p = pos.get(a.id); return { id: a.id, t: a.t, x: p[0] * L, y: -p[1] * L }; });
    const enlaces = d.enlaces.map(x => ({ a: x.a, b: x.b, orden: x.orden || 1, dipolo: e.dipolos ? x.dipolo : undefined }));
    const pares = e.pares === false ? [] : (d.pares || []).map(p => { const q = g(p.dir); return { en: p.en, ang: Math.atan2(-q[1], q[0]) * 180 / Math.PI }; });
    const flechas = [];
    if (e.dipolos && d.total && modulo(d.total) > 0.005) {
      const q = g(d.total), m = Math.hypot(q[0], q[1]) || 1, k = Math.min(1.4, 0.6 + modulo(d.total) * 0.5) * L / m;
      flechas.push({ de: [0, 0], a: [q[0] * k, -q[1] * k], dipolo: true, color: 'o' });
    }
    return { atomos, enlaces, pares, flechas, escala: 40 * (d.escala || 1), alto: 230 };
  }
  function alt(d) {
    if (d.alt) return d.alt;
    const t = new Map(d.atomos.map(a => [a.id, a.t]));
    return `Molécula en 3D (aquí, una proyección plana): ${d.enlaces.map(e => `${t.get(e.a)}${['', '–', '=', '≡'][e.orden || 1]}${t.get(e.b)}`).join(', ')}.`;
  }
  function dibujar(datos, estado) {
    const P = Kit.piezas['quim-molecula'];
    const d = plano(datos, estado || {});
    d.alt = alt(datos);
    return P.dibujar(d, {});
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const posiciones = (T, d) => new Map(d.atomos.map(a => [a.id, new T.Vector3(...a.pos).multiplyScalar(1.15 * (d.escala || 1))]));
  // Hacia dónde se separan las líneas de un enlace doble o triple (perpendicular al enlace).
  function ladoDe(T, A, B, esc) {
    const eje = new T.Vector3().subVectors(B, A).normalize();
    let lado = new T.Vector3().crossVectors(eje, new T.Vector3(0, 0, 1));
    if (lado.length() < 0.1) lado = new T.Vector3().crossVectors(eje, new T.Vector3(0, 1, 0));
    return lado.normalize().multiplyScalar(0.11 * esc);
  }
  const NOMBRE = t => (El && El.COLORES && El.COLORES[t] ? El.COLORES[t].nombre : t);
  const SPEC = {
    plano: (d, e) => dibujar(d, e),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify(d.atomos.map(a => a.t)) + JSON.stringify(d.vista || {}),
    // Ruta rápida: todo lo que se arma menos el giro propio y las posiciones de los átomos.
    forma: (d, e) => JSON.stringify([d.atomos.map(a => [a.id, a.t]), d.enlaces, d.pares || null, d.total || null, d.escala || 1, !!d.simbolos, d.vista || null, !!e.dipolos, e.pares !== false]),
    mover(T, grupo, d, e, h) {
      const piv = grupo.children.find(o => o.userData && o.userData.pivote);
      if (!piv) return false;
      const a = rad(d.giro || 0), Y = new T.Vector3(0, 1, 0), u = piv.userData;
      // Átomos que se movieron (un enlace que gira): esferas, barras y rótulos van a su lugar nuevo.
      const pos = JSON.stringify(d.atomos.map(x => x.pos));
      if (pos !== u.pos) {
        if (u.fijo) return false;                          // pares libres o dipolos a la vista: se rearma
        const P = posiciones(T, d), esc = d.escala || 1, arriba = new T.Vector3(0, 1, 0);
        for (const x of d.atomos) { const s = u.esferas.get(x.id); if (!s) return false; s.position.copy(P.get(x.id)); }
        for (const r of u.rotulos) r.base.copy(P.get(r.id));
        for (const b of u.barras) {
          const A = P.get(b.a), B = P.get(b.b), off = ladoDe(T, A, B, esc).multiplyScalar(b.k - (b.n - 1) / 2), v = new T.Vector3().subVectors(B, A);
          b.m.position.copy(A).add(off).addScaledVector(v, 0.5);
          b.m.quaternion.setFromUnitVectors(arriba, v.clone().normalize());
          b.m.scale.set(1, v.length() / b.largo, 1);
        }
        u.pos = pos;
      }
      piv.rotation.y = a;
      for (const r of u.rotulos) h.moverEtiqueta(r.el, r.base.clone().applyAxisAngle(Y, a));
      return true;
    },
    distancia: 7.2, distMin: 3.6, distMax: 12,
    tocar: o => (o && o.userData && o.userData.t ? `Ese átomo es de ${NOMBRE(o.userData.t)} (${o.userData.t}).` : ''),
    construir(T, grupo, d, e, h) {
      const colorDe = t => { try { return El.color(t, h.oscuro() ? 'oscuro' : 'claro'); } catch (err) { return h.oscuro() ? '#c9bfd6' : '#6b5f78'; } };
      const tinta = h.varCss('--ink', '#2d2340'), naranja = h.varCss('--c-o', '#a95300'), violeta = h.varCss('--c-f', '#6b3dbd');
      const esc = d.escala || 1;                     // 1 salvo que la mesa pida achicar (dos moléculas lado a lado)
      // Todo va en un pivote que gira con datos.giro (la animación lo mueve sin rearmar); el grupo de afuera es la vista.
      const caja = grupo, Y = new T.Vector3(0, 1, 0), giro = rad(d.giro || 0);
      // esferas, barras y fijo: para que mover lleve los átomos a otras posiciones sin rearmar (un enlace que gira).
      grupo = new T.Group(); caja.add(grupo); grupo.rotation.y = giro;
      grupo.userData = { pivote: true, rotulos: [], esferas: new Map(), barras: [], pos: JSON.stringify(d.atomos.map(a => a.pos)),
        fijo: (e.pares !== false && (d.pares || []).length > 0) || (!!e.dipolos && (!!d.total || d.enlaces.some(x => x.dipolo))) };
      const P = posiciones(T, d);
      const tocables = [];
      for (const a of d.atomos) {
        const s = new T.Mesh(new T.SphereGeometry((a.t === 'H' ? 0.24 : 0.36) * esc, h.SEG, Math.round(h.SEG * 0.7)), h.material(colorDe(a.t)));
        s.position.copy(P.get(a.id)); s.userData = { t: a.t }; grupo.add(s); tocables.push(s); grupo.userData.esferas.set(a.id, s);
        if (d.simbolos && a.t !== 'C') {                                     // símbolo encima del átomo (texto real)
          const base = P.get(a.id).clone();
          grupo.userData.rotulos.push({ el: h.etiqueta(base.clone().applyAxisAngle(Y, giro), a.t), base, id: a.id });
        }
      }
      for (const x of d.enlaces) {
        const A = P.get(x.a), B = P.get(x.b), n = x.orden || 1, lado = ladoDe(T, A, B, esc);
        for (let k = 0; k < n; k++) {
          const off = lado.clone().multiplyScalar(k - (n - 1) / 2), m = h.barra(A.clone().add(off), B.clone().add(off), (n > 1 ? 0.045 : 0.07) * esc, tinta);
          grupo.add(m); grupo.userData.barras.push({ a: x.a, b: x.b, k, n, m, largo: A.distanceTo(B) });
        }
        if (e.dipolos && x.dipolo) {            // flecha del enlace, al costado, hacia el átomo que atrae más
          const de = x.dipolo === 'b' ? A : B, a = x.dipolo === 'b' ? B : A, u = new T.Vector3().subVectors(a, de);
          const corre = lado.clone().normalize().multiplyScalar(0.3);
          grupo.add(h.flecha(de.clone().addScaledVector(u, 0.22).add(corre), de.clone().addScaledVector(u, 0.8).add(corre), 0.035, naranja));
        }
      }
      if (e.pares !== false) for (const p of d.pares || []) {
        const u = new T.Vector3(...p.dir).normalize(), s = new T.Mesh(new T.SphereGeometry(0.3 * esc, h.SEG, Math.round(h.SEG * 0.7)),
          h.material(violeta, { transparent: true, opacity: 0.32, depthWrite: false }));
        s.position.copy(P.get(p.en)).addScaledVector(u, 0.62 * esc); s.scale.set(0.75, 1.3, 0.75);
        s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), u); grupo.add(s);
      }
      if (e.dipolos && d.total && modulo(d.total) > 0.005) {
        const u = new T.Vector3(...d.total).normalize(), largo = Math.min(1.9, 0.9 + modulo(d.total) * 0.6);
        grupo.add(h.flecha(u.clone().multiplyScalar(0.45), u.clone().multiplyScalar(0.45 + largo), 0.07, naranja));
      }
      return { tocables, aria: alt(d) };
    },
  };
  // montar(el, { alTocar }) → { actualizar(datos, estado), acercar(f), inicio(), soltar(), enVivo } (nucleo/kit/vivo3d.js).
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, { alTocar: o => { if (op && op.alTocar && o && o.userData) op.alTocar(o.userData.t); } });

  return { id: 'quim-molecula-3d', dibujar, alt, montar, plano, girar, mejorVista, forma: SPEC.forma, spec: SPEC };
});
