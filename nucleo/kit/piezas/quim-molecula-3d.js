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
 *   alt,
 * }
 * estado = { dipolos: true|false, pares: true|false }.
 *
 * En vivo: arrastrar gira; con el teclado, las flechas giran 15° e Inicio vuelve a la vista de partida; tocar un átomo
 * dice cuál es. Dibuja solo cuando algo cambia. Con modo ahorro (<html data-ahorro="1">, Perfil → Gráficos), menos
 * resolución, sin suavizado de bordes y esferas con menos caras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('./quim-molecula.js');
  const El = nodo ? require('../../elementos.js') : root.Elementos;
  const api = fabrica(Kit, El, root);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, El, root) {
  'use strict';
  const TRES = '/app/vendor/three/three-mesa.min.js';
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
    const v = vistaDe(d), g = p => girar(p, v.giro, v.inclinacion);
    const pos = new Map(d.atomos.map(a => [a.id, g(a.pos)]));
    const atomos = d.atomos.map(a => { const p = pos.get(a.id); return { id: a.id, t: a.t, x: p[0] * L, y: -p[1] * L }; });
    const enlaces = d.enlaces.map(x => ({ a: x.a, b: x.b, orden: x.orden || 1, dipolo: e.dipolos ? x.dipolo : undefined }));
    const pares = e.pares === false ? [] : (d.pares || []).map(p => { const q = g(p.dir); return { en: p.en, ang: Math.atan2(-q[1], q[0]) * 180 / Math.PI }; });
    const flechas = [];
    if (e.dipolos && d.total && modulo(d.total) > 0.005) {
      const q = g(d.total), m = Math.hypot(q[0], q[1]) || 1, k = Math.min(1.4, 0.6 + modulo(d.total) * 0.5) * L / m;
      flechas.push({ de: [0, 0], a: [q[0] * k, -q[1] * k], dipolo: true, color: 'o' });
    }
    return { atomos, enlaces, pares, flechas, escala: 40, alto: 230 };
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

  // ---------- three.js, una sola vez ----------
  let cargando = null;
  function cargarTres() {
    if (root.THREE) return Promise.resolve(true);
    if (typeof document === 'undefined' || typeof root.WebGL2RenderingContext === 'undefined') return Promise.resolve(false);
    if (!cargando) cargando = new Promise(ok => {
      const s = document.createElement('script');
      s.src = TRES; s.async = true;
      s.onload = () => ok(!!root.THREE);
      s.onerror = () => { cargando = null; ok(false); };
      document.head.appendChild(s);
    });
    return cargando;
  }
  const ahorro = () => typeof document !== 'undefined' && document.documentElement.dataset.ahorro === '1';
  const oscuro = () => {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body).backgroundColor || '');
    return m ? (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255 < 0.4 : false;
  };
  const varCss = (n, porDefecto) => (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim() || porDefecto;
  const colorDe = t => { try { return El.color(t, oscuro() ? 'oscuro' : 'claro'); } catch (e) { return oscuro() ? '#c9bfd6' : '#6b5f78'; } };
  const NOMBRE = t => (El && El.COLORES && El.COLORES[t] ? El.COLORES[t].nombre : t);

  function vivo(caja, alTocar, perdido) {
    const T = root.THREE, ah = ahorro();
    const cv = document.createElement('canvas');
    cv.className = 'kit-3d-lienzo';
    cv.tabIndex = 0;
    cv.setAttribute('role', 'img');
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: !ah, alpha: true });   // si falla, lanza: el que llama vuelve al plano
    renderer.setPixelRatio(Math.min(ah ? 1 : 2, root.devicePixelRatio || 1));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    caja.innerHTML = '';
    caja.appendChild(cv);
    const nota = document.createElement('p');
    nota.className = 'kit-3d-nota'; nota.setAttribute('aria-live', 'polite');
    caja.appendChild(nota);
    const escena = new T.Scene(), camara = new T.PerspectiveCamera(35, 1, 0.1, 50);
    // Distancia de la cámara: acercar y alejar (pellizco, Ctrl + rueda o rueda dentro de la lupa, y los botones de la lupa).
    let dist = 7.2;
    const DIST_MIN = 3.6, DIST_MAX = 12;
    camara.position.set(0, 0, dist);
    escena.add(new T.HemisphereLight(0xffffff, 0xd9cfc6, 1.7));
    const sol = new T.DirectionalLight(0xffffff, 1.3); sol.position.set(3, 5, 6); escena.add(sol);
    let mol = new T.Group(); escena.add(mol);
    let vista = { giro: 30, inclinacion: 20 }, giro = 0, inc = 0, atomos = [];
    const SEG = ah ? 12 : 24;

    let pend = false;
    const dibujarYa = () => { camara.position.z = dist; mol.rotation.set(rad(inc), rad(giro), 0, 'XYZ'); renderer.render(escena, camara); };
    const acercar = f => { dist = Math.max(DIST_MIN, Math.min(DIST_MAX, dist / f)); pedir(); };
    const pedir = () => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; dibujarYa(); }); };
    // En la lupa (pantalla completa) el lienzo ocupa todo el alto disponible; en la página, un cuadro de 220 a 340 px.
    const tamano = () => { const w = caja.clientWidth || 300, h = caja.closest('.te-lupa') ? Math.max(220, caja.clientHeight || w) : Math.max(220, Math.min(w, 340)); renderer.setSize(w, h, false); cv.style.height = `${h}px`; camara.aspect = w / h; camara.updateProjectionMatrix(); pedir(); };
    const ro = new ResizeObserver(tamano); ro.observe(caja);

    const material = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: new T.Color(c) }, o || {}));
    const barra = (de, a, r, color) => {      // cilindro entre dos puntos
      const v = new T.Vector3().subVectors(a, de), m = new T.Mesh(new T.CylinderGeometry(r, r, v.length(), Math.max(8, SEG / 2)), material(color));
      m.position.copy(de).addScaledVector(v, 0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.clone().normalize());
      return m;
    };
    const flecha = (de, a, r, color) => {      // asta y punta (un cilindro con radio 0 arriba)
      const g = new T.Group(), v = new T.Vector3().subVectors(a, de), largo = v.length(), punta = Math.min(0.32, largo * 0.4);
      const u = v.clone().normalize(), fin = de.clone().addScaledVector(u, largo - punta);
      g.add(barra(de, fin, r, color));
      const c = new T.Mesh(new T.CylinderGeometry(0, r * 2.6, punta, Math.max(8, SEG / 2)), material(color));
      c.position.copy(fin).addScaledVector(u, punta / 2); c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), u);
      g.add(c);
      return g;
    };
    function limpiar() {
      escena.remove(mol);
      mol.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      mol = new T.Group(); escena.add(mol); atomos = [];
    }
    function poner(d, e) {
      limpiar();
      const tinta = varCss('--ink', '#2d2340'), naranja = varCss('--c-o', '#b85a06'), violeta = varCss('--c-f', '#6b3dbd');
      const P = new Map(d.atomos.map(a => [a.id, new T.Vector3(...a.pos).multiplyScalar(1.15)]));
      for (const a of d.atomos) {
        const s = new T.Mesh(new T.SphereGeometry(a.t === 'H' ? 0.24 : 0.36, SEG, Math.round(SEG * 0.7)), material(colorDe(a.t)));
        s.position.copy(P.get(a.id)); s.userData = { t: a.t }; mol.add(s); atomos.push(s);
      }
      for (const x of d.enlaces) {
        const A = P.get(x.a), B = P.get(x.b), n = x.orden || 1, eje = new T.Vector3().subVectors(B, A).normalize();
        let lado = new T.Vector3().crossVectors(eje, new T.Vector3(0, 0, 1));
        if (lado.length() < 0.1) lado = new T.Vector3().crossVectors(eje, new T.Vector3(0, 1, 0));
        lado.normalize().multiplyScalar(0.11);
        for (let k = 0; k < n; k++) {
          const off = lado.clone().multiplyScalar(k - (n - 1) / 2);
          mol.add(barra(A.clone().add(off), B.clone().add(off), n > 1 ? 0.045 : 0.07, tinta));
        }
        if (e.dipolos && x.dipolo) {            // flecha del enlace, al costado, hacia el átomo que atrae más
          const de = x.dipolo === 'b' ? A : B, a = x.dipolo === 'b' ? B : A, u = new T.Vector3().subVectors(a, de);
          const corre = lado.clone().normalize().multiplyScalar(0.3);
          mol.add(flecha(de.clone().addScaledVector(u, 0.22).add(corre), de.clone().addScaledVector(u, 0.8).add(corre), 0.035, naranja));
        }
      }
      if (e.pares !== false) for (const p of d.pares || []) {
        const u = new T.Vector3(...p.dir).normalize(), s = new T.Mesh(new T.SphereGeometry(0.3, SEG, Math.round(SEG * 0.7)),
          material(violeta, { transparent: true, opacity: 0.32, depthWrite: false }));
        s.position.copy(P.get(p.en)).addScaledVector(u, 0.62); s.scale.set(0.75, 1.3, 0.75);
        s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), u); mol.add(s);
      }
      if (e.dipolos && d.total && modulo(d.total) > 0.005) {
        const u = new T.Vector3(...d.total).normalize(), largo = Math.min(1.9, 0.9 + modulo(d.total) * 0.6);
        mol.add(flecha(u.clone().multiplyScalar(0.45), u.clone().multiplyScalar(0.45 + largo), 0.07, naranja));
      }
      cv.setAttribute('aria-label', `${alt(d)} Gírala con el dedo o con las flechas del teclado.`);
      pedir();
    }

    // Girar con el dedo; tocar sin arrastrar dice qué átomo es.
    let abajo = null;
    const ray = new T.Raycaster(), ptr = new T.Vector2();
    const dedos = new Map(); let pellizco = null;
    cv.addEventListener('pointerdown', ev => {
      dedos.set(ev.pointerId, ev); cv.setPointerCapture(ev.pointerId);
      if (dedos.size === 2) { const [a, b] = [...dedos.values()]; pellizco = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), dist }; abajo = null; return; }
      abajo = { x: ev.clientX, y: ev.clientY, g: giro, i: inc, movio: false };
    });
    cv.addEventListener('pointermove', ev => {
      if (dedos.has(ev.pointerId)) dedos.set(ev.pointerId, ev);
      if (pellizco && dedos.size === 2) {
        const [a, b] = [...dedos.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pellizco.d > 0) { dist = Math.max(DIST_MIN, Math.min(DIST_MAX, pellizco.dist * pellizco.d / Math.max(1, d))); pedir(); }
        return;
      }
      if (!abajo) return;
      const dx = ev.clientX - abajo.x, dy = ev.clientY - abajo.y;
      if (!abajo.movio && Math.hypot(dx, dy) < 6) return;
      abajo.movio = true; giro = abajo.g + dx * 0.6; inc = Math.max(-85, Math.min(85, abajo.i + dy * 0.6)); pedir();
    });
    const soltarDedo = ev => {
      dedos.delete(ev.pointerId); if (dedos.size < 2) pellizco = null;
      const fue = abajo; abajo = null;
      if (!fue || fue.movio || ev.type === 'pointercancel') return;
      const r = cv.getBoundingClientRect();
      ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      mol.rotation.set(rad(inc), rad(giro), 0, 'XYZ'); mol.updateMatrixWorld(true);
      ray.setFromCamera(ptr, camara);
      const h = ray.intersectObjects(atomos)[0];
      if (h) { nota.textContent = `Ese átomo es de ${NOMBRE(h.object.userData.t)} (${h.object.userData.t}).`; if (alTocar) alTocar(h.object.userData.t); }
    };
    cv.addEventListener('pointerup', soltarDedo);
    cv.addEventListener('pointercancel', soltarDedo);
    cv.addEventListener('keydown', ev => {
      const k = ev.key;
      if (k === 'ArrowLeft') giro -= 15; else if (k === 'ArrowRight') giro += 15;
      else if (k === 'ArrowUp') inc = Math.max(-85, inc - 15); else if (k === 'ArrowDown') inc = Math.min(85, inc + 15);
      else if (k === 'Home') { giro = vista.giro; inc = vista.inclinacion; } else return;
      ev.preventDefault(); pedir();
    });
    // Android puede cortar el 3D (otra app pidió memoria, o la pantalla se apagó): avisa a montar, que pone la vista
    // plana y lo vuelve a armar al tocar «Volver al 3D» o al regresar a la app.
    cv.addEventListener('webglcontextlost', ev => { ev.preventDefault(); if (perdido) perdido(); });
    cv.addEventListener('wheel', ev => {
      if (!ev.ctrlKey && !caja.closest('.te-lupa')) return;          // la rueda sola desplaza la página
      ev.preventDefault(); acercar(ev.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    return {
      poner(d, e, nuevaVista) {
        if (nuevaVista) { vista = vistaDe(d); giro = vista.giro; inc = vista.inclinacion; nota.textContent = ''; }
        poner(d, e);
      },
      acercar,
      soltar() {
        ro.disconnect();
        try { limpiar(); renderer.dispose(); const x = renderer.getContext().getExtension('WEBGL_lose_context'); if (x && !renderer.getContext().isContextLost()) x.loseContext(); }
        catch (e) { /* el contexto ya estaba perdido */ }
      },
    };
  }

  // montar(el, { alTocar }) → { actualizar(datos, estado), acercar(f), soltar(), enVivo }. Mientras carga, o sin WebGL 2,
  // el respaldo plano. Si el equipo corta el 3D, queda el plano con «Volver al 3D», y se rearma solo al volver a la app.
  function montar(el, op) {
    const caja = document.createElement('div');
    caja.className = 'kit-3d';
    el.innerHTML = ''; el.appendChild(caja);
    let datos = null, estado = {}, v = null, aviso = '', fin = false, clave = '', cortado = false;
    const pintarPlano = () => {
      if (!datos) return;
      caja.innerHTML = dibujar(datos, estado) + (aviso ? `<p class="kit-3d-nota">${aviso}</p>` : '')
        + (cortado ? '<button type="button" class="btn borde kit-3d-volver">Volver al 3D</button>' : '');
    };
    const armar = () => {
      try { v = vivo(caja, op && op.alTocar, perdido); cortado = false; aviso = ''; if (datos) v.poner(datos, estado, true); return true; }
      catch (e) { v = null; return false; }
    };
    function perdido() {
      if (fin) return;
      if (v) v.soltar();
      v = null; cortado = true; aviso = 'El equipo pausó el 3D para ahorrar memoria.';
      pintarPlano();
    }
    const reintentar = () => { if (fin || !cortado) return; if (!armar()) { aviso = 'Vista plana: este equipo no pudo volver al 3D.'; pintarPlano(); } };
    caja.addEventListener('click', ev => { if (ev.target.closest('.kit-3d-volver')) reintentar(); });
    const alVolver = () => { if (document.visibilityState === 'visible') reintentar(); };
    document.addEventListener('visibilitychange', alVolver);
    cargarTres().then(ok => {
      if (fin) return;
      if (!ok) { aviso = 'Vista plana: este equipo no dibuja en 3D.'; pintarPlano(); return; }
      if (!armar()) { aviso = 'Vista plana: este equipo no pudo dibujar en 3D.'; pintarPlano(); }
    });
    return {
      actualizar(d, e) {
        const k = JSON.stringify(d.atomos.map(a => a.t)) + JSON.stringify(d.vista || {});
        const nueva = k !== clave; clave = k;
        datos = d; estado = e || {};
        if (v) v.poner(datos, estado, nueva); else pintarPlano();
      },
      acercar(f) { if (v) v.acercar(f); },
      soltar() { fin = true; document.removeEventListener('visibilitychange', alVolver); if (v) v.soltar(); v = null; },
      get enVivo() { return !!v; },
    };
  }

  return { id: 'quim-molecula-3d', dibujar, alt, montar, plano, girar, mejorVista };
});
