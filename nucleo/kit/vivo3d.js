/*
 * Base de las piezas vivas en 3D (15 nov 2026, docs/dos-entradas.md): lo que toda figura 3D del kit hace igual, para que
 * cada pieza solo arme su escena. La primera que la usa es quim-molecula-3d; las que siguen (prisma, cubitos, campo,
 * vectores…) también.
 *
 * Kit.vivo3d.montar(el, spec, op) → { actualizar(datos, estado), acercar(f), inicio(), soltar(), enVivo }
 *   spec = {
 *     plano(datos, estado) → SVG          respaldo: mientras carga, sin WebGL 2, si el equipo corta el 3D
 *     vista(datos) → { giro, inclinacion } vista de partida, en grados (la de «Vista inicial»)
 *     clave(datos) → texto                 si cambia, se vuelve a la vista de partida (otra molécula, otro sólido)
 *     construir(T, grupo, datos, estado, h) → { tocables?: [Object3D], aria?: texto }
 *                                          arma la escena dentro de `grupo` (se limpia sola antes de cada cambio)
 *     tocar?(objeto) → texto               qué decir cuando el alumno toca un objeto sin arrastrar
 *     forma?(datos, estado) → texto        con mover: mientras la forma no cambie, cada cambio de datos (un cuadro de
 *     mover?(T, grupo, datos, estado, h)   la animación) mueve lo que ya está armado en vez de rearmar la escena
 *                                          (devuelve false para pedir que se rearme). Toda pieza animada lo necesita:
 *                                          rearmar 30 veces por segundo gasta memoria y batería.
 *     distancia?: 7.2 | (datos) → número   distancia de la cámara; como función, el encuadre sigue a los datos (un
 *                                          desarrollo abierto ocupa más que el sólido cerrado). distMin y distMax, en
 *     distMin?, distMax?                   proporción a ella si no se dan.
 *   }
 *   op = { alTocar?(objeto) }
 *   h  = { SEG, ahorro, oscuro, varCss(n, porDefecto), material(color, extra), barra(de, a, r, color), flecha(de, a, r, color),
 *          etiqueta(pos, texto, { color?, letra? }) → el rótulo; h.moverEtiqueta(el, pos, texto?) lo mueve en mover }
 *        etiqueta: un rótulo HTML que sigue a un punto de la escena (Vector3 en coordenadas del grupo). Es texto real, legible
 *        y del color de su variable (regla 4): color 'c-o' le pone la clase «var c-o» de la app; letra: true, en cursiva.
 *
 * Lo común:
 *   - three.js se carga una vez (app/vendor/three); sin WebGL 2 queda el plano con su aviso.
 *   - Dibuja solo cuando algo cambia; en reposo, cero cuadros.
 *   - Arrastrar gira; pellizco, Ctrl + rueda (o la rueda dentro de la lupa) acercan; teclado: flechas giran 15°,
 *     + y − acercan, Inicio vuelve a la vista de partida. El botón «Vista inicial» hace lo mismo (pedido de Gerson, 15 nov).
 *   - Si Android corta el 3D: plano con «Volver al 3D», y se rearma solo al regresar a la app.
 *   - Modo ahorro (<html data-ahorro="1">): resolución 1×, sin suavizado de bordes y menos caras (h.SEG).
 *   - Tamaño: un cuadro de 220 a 340 px en la página; en la lupa (.te-lupa), todo el alto.
 * Sin three.js ni DOM, montar no existe en Node: las pruebas usan plano().
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('./kit.js') : root.Kit;
  const api = fabrica(root);
  Kit.vivo3d = api;
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  const TRES = '/app/vendor/three/three-mesa.min.js';
  const rad = g => g * Math.PI / 180;

  let cargando = null;
  function cargarTres() {
    if (root.THREE) return Promise.resolve(true);
    if (typeof document === 'undefined' || typeof root.WebGL2RenderingContext === 'undefined') return Promise.resolve(false);
    // Respaldo para los navegadores de fábrica con Chromium anterior al 84 (Xiaomi, Oppo): three.js usa WeakRef y
    // FinalizationRegistry al liberar memoria; sin esto, el script falla y queda solo la vista plana.
    if (typeof root.WeakRef === 'undefined') root.WeakRef = function (o) { this.deref = function () { return o; }; };
    if (typeof root.FinalizationRegistry === 'undefined') root.FinalizationRegistry = function () { this.register = this.unregister = function () {}; };
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

  function vivo(caja, spec, op, perdido) {
    const T = root.THREE, ah = ahorro();
    const cv = document.createElement('canvas');
    cv.className = 'kit-3d-lienzo';
    cv.tabIndex = 0;
    cv.setAttribute('role', 'img');
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: !ah, alpha: true });   // si falla, lanza: montar vuelve al plano
    renderer.setPixelRatio(Math.min(ah ? 1 : 2, root.devicePixelRatio || 1));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    caja.innerHTML = '';
    caja.appendChild(cv);
    // Capa de rótulos HTML encima del lienzo (h.etiqueta): se reubican en cada cuadro.
    const capaEtq = document.createElement('div');
    capaEtq.className = 'kit-3d-etiquetas'; capaEtq.setAttribute('aria-hidden', 'true');
    caja.appendChild(capaEtq);
    let etiquetas = [];
    const pie = document.createElement('div');
    pie.className = 'kit-3d-pie';
    pie.innerHTML = '<p class="kit-3d-nota" aria-live="polite"></p><button type="button" class="kit-3d-inicio" aria-label="Volver a la vista inicial">↺ Vista inicial</button>';
    caja.appendChild(pie);
    const nota = pie.querySelector('.kit-3d-nota');
    const escena = new T.Scene(), camara = new T.PerspectiveCamera(35, 1, 0.1, 80);
    // Distancia de partida: fija o según los datos (spec.distancia(datos)); se recalcula al cambiar de caso (clave).
    let D0 = typeof spec.distancia === 'number' ? spec.distancia : 7.2, DMIN, DMAX;
    const fijarD0 = d => {
      D0 = typeof spec.distancia === 'function' ? (d ? spec.distancia(d) : 7.2) : (spec.distancia || 7.2);
      DMIN = spec.distMin || D0 * 0.5; DMAX = spec.distMax || D0 * 1.7;
    };
    fijarD0(null);
    let dist = D0;
    escena.add(new T.HemisphereLight(0xffffff, 0xd9cfc6, 1.7));
    const sol = new T.DirectionalLight(0xffffff, 1.3); sol.position.set(3, 5, 6); escena.add(sol);
    let grupo = new T.Group(); escena.add(grupo);
    let vista = { giro: 30, inclinacion: 20 }, giro = 30, inc = 20, tocables = [], formaActual = null;
    const SEG = ah ? 12 : 24;

    let pend = false;
    // Rótulos (ronda 4, pedidos de química, geometría, álgebra y aritmética): siempre dentro del lienzo (no ensanchan la
    // página) y atenuados cuando su punto queda detrás de una superficie opaca (un rayo desde la cámara lo comprueba).
    const rayEtq = new T.Raycaster();
    const opacos = () => { const xs = []; grupo.traverse(o => { if (o.isMesh && o.material && !(o.material.transparent && o.material.opacity < 0.6)) xs.push(o); }); return xs; };
    const ubicarEtiquetas = () => {
      if (!etiquetas.length) return;
      grupo.updateMatrixWorld(true); camara.updateMatrixWorld(true);
      const w = cv.clientWidth, hh = cv.clientHeight, objs = opacos();
      for (const e of etiquetas) {
        const mundo = e.pos.clone().applyMatrix4(grupo.matrixWorld), v = mundo.clone().project(camara);
        const fuera = v.z > 1 || v.z < -1;
        e.el.style.display = fuera ? 'none' : '';
        if (fuera) continue;
        const mw = e.el.offsetWidth / 2, mh = e.el.offsetHeight / 2;
        const x = Math.max(mw + 2, Math.min(w - mw - 2, (v.x + 1) / 2 * w)), y = Math.max(mh + 2, Math.min(hh - mh - 2, (1 - v.y) / 2 * hh));
        e.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`;
        const hacia = mundo.clone().sub(camara.position), lejos = hacia.length();
        rayEtq.set(camara.position, hacia.normalize()); rayEtq.far = lejos - 0.05;
        e.el.classList.toggle('tapado', objs.length > 0 && rayEtq.intersectObjects(objs, false).length > 0);
      }
    };
    // Con el lienzo más alto que ancho (la lupa en un celular vertical), la cámara se aleja en proporción: si no, la figura
    // se corta a los costados (pedido de aritmética y razonamiento matemático).
    const dibujarYa = () => { camara.position.set(0, 0, dist / Math.min(1, camara.aspect || 1)); grupo.rotation.set(rad(inc), rad(giro), 0, 'XYZ'); renderer.render(escena, camara); ubicarEtiquetas(); };
    const pedir = () => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; dibujarYa(); }); };
    const acercar = f => { dist = Math.max(DMIN, Math.min(DMAX, dist / f)); pedir(); };
    const inicio = () => { giro = vista.giro; inc = vista.inclinacion; dist = D0; nota.textContent = ''; pedir(); };
    const tamano = () => {
      const w = caja.clientWidth || 300, alto = caja.clientHeight - pie.offsetHeight;
      const h = caja.closest('.te-lupa') ? Math.max(220, alto || w) : Math.max(220, Math.min(w, 340));
      renderer.setSize(w, h, false); cv.style.height = `${h}px`; camara.aspect = w / h; camara.updateProjectionMatrix(); pedir();
    };
    const ro = new ResizeObserver(tamano); ro.observe(caja);

    // Ayudas de dibujo comunes: material mate, barra (cilindro entre dos puntos) y flecha (asta y punta).
    const material = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: new T.Color(c) }, o || {}));
    const barra = (de, a, r, color) => {
      const v = new T.Vector3().subVectors(a, de), m = new T.Mesh(new T.CylinderGeometry(r, r, v.length(), Math.max(8, SEG / 2)), material(color));
      m.position.copy(de).addScaledVector(v, 0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.clone().normalize());
      return m;
    };
    const flecha = (de, a, r, color) => {
      const g = new T.Group(), v = new T.Vector3().subVectors(a, de), largo = v.length(), punta = Math.min(0.32, largo * 0.4);
      const u = v.clone().normalize(), fin = de.clone().addScaledVector(u, largo - punta);
      g.add(barra(de, fin, r, color));
      const c = new T.Mesh(new T.CylinderGeometry(0, r * 2.6, punta, Math.max(8, SEG / 2)), material(color));
      c.position.copy(fin).addScaledVector(u, punta / 2); c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), u);
      g.add(c);
      return g;
    };
    const etiqueta = (pos, texto, o) => {
      const el = document.createElement('span');
      el.className = `kit-3d-etq${o && o.color ? ` var ${o.color}` : ''}${o && o.letra ? ' ec-letra' : ''}`;
      el.textContent = texto;
      capaEtq.appendChild(el);
      etiquetas.push({ pos: pos.clone(), el });
      return el;
    };
    const moverEtiqueta = (el, pos, texto) => { const e = etiquetas.find(x => x.el === el); if (!e) return; e.pos.copy(pos); if (texto !== undefined && el.textContent !== texto) el.textContent = texto; };
    const h = { SEG, ahorro: ah, oscuro, varCss, material, barra, flecha, etiqueta, moverEtiqueta };
    function limpiar() {
      escena.remove(grupo);
      grupo.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      grupo = new T.Group(); escena.add(grupo); tocables = [];
      capaEtq.innerHTML = ''; etiquetas = [];
    }
    function poner(d, e) {
      limpiar();
      const r = spec.construir(T, grupo, d, e || {}, h) || {};
      tocables = r.tocables || [];
      cv.setAttribute('aria-label', `${r.aria || ''} Gírala con el dedo o con las flechas del teclado; con + y − se acerca.`.trim());
      pedir();
    }

    cv.addEventListener('keydown', ev => {
      const k = ev.key;
      if (k === 'ArrowLeft') giro -= 15; else if (k === 'ArrowRight') giro += 15;
      else if (k === 'ArrowUp') inc = Math.max(-85, inc - 15); else if (k === 'ArrowDown') inc = Math.min(85, inc + 15);
      else if (k === '+' || k === '=') { acercar(1.15); ev.preventDefault(); return; }
      else if (k === '-') { acercar(1 / 1.15); ev.preventDefault(); return; }
      else if (k === 'Home') { inicio(); ev.preventDefault(); return; } else return;
      ev.preventDefault(); pedir();
    });
    pie.querySelector('.kit-3d-inicio').addEventListener('click', inicio);
    // Android puede cortar el 3D (otra app pidió memoria, o la pantalla se apagó): montar pone el plano y lo rearma.
    cv.addEventListener('webglcontextlost', ev => { ev.preventDefault(); if (perdido) perdido(); });
    cv.addEventListener('wheel', ev => {
      if (!ev.ctrlKey && !caja.closest('.te-lupa')) return;          // la rueda sola desplaza la página
      ev.preventDefault(); acercar(ev.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    // Girar con un dedo, acercar con dos; tocar sin arrastrar dice qué es (spec.tocar).
    const dedos = new Map(); let pellizco = null, abajo = null;
    const ray = new T.Raycaster(), ptr = new T.Vector2();
    cv.addEventListener('pointerdown', ev => {
      dedos.set(ev.pointerId, ev); cv.setPointerCapture(ev.pointerId);
      if (dedos.size === 2) { const [a, b] = [...dedos.values()]; pellizco = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), dist }; abajo = null; return; }
      abajo = { x: ev.clientX, y: ev.clientY, g: giro, i: inc, movio: false };
    });
    cv.addEventListener('pointermove', ev => {
      if (dedos.has(ev.pointerId)) dedos.set(ev.pointerId, ev);
      if (pellizco && dedos.size === 2) {
        const [a, b] = [...dedos.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pellizco.d > 0) { dist = Math.max(DMIN, Math.min(DMAX, pellizco.dist * pellizco.d / Math.max(1, d))); pedir(); }
        return;
      }
      if (!abajo) return;
      const dx = ev.clientX - abajo.x, dy = ev.clientY - abajo.y;
      if (!abajo.movio && Math.hypot(dx, dy) < 6) return;
      if (!abajo.movio) caja.dispatchEvent(new CustomEvent('kit3d:gira', { bubbles: true }));   // el juego pausa lo que gira solo
      abajo.movio = true; giro = abajo.g + dx * 0.6; inc = Math.max(-85, Math.min(85, abajo.i + dy * 0.6)); pedir();
    });
    const soltarDedo = ev => {
      dedos.delete(ev.pointerId); if (dedos.size < 2) pellizco = null;
      const fue = abajo; abajo = null;
      if (!fue || fue.movio || ev.type === 'pointercancel' || !tocables.length) return;
      const r = cv.getBoundingClientRect();
      ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      grupo.rotation.set(rad(inc), rad(giro), 0, 'XYZ'); grupo.updateMatrixWorld(true);
      ray.setFromCamera(ptr, camara);
      const hit = ray.intersectObjects(tocables, true)[0];
      if (!hit) return;
      let o = hit.object; while (o && !tocables.includes(o)) o = o.parent;
      const dice = spec.tocar ? spec.tocar(o || hit.object) : '';
      if (dice) nota.textContent = dice;
      if (op && op.alTocar) op.alTocar(o || hit.object);
    };
    cv.addEventListener('pointerup', soltarDedo);
    cv.addEventListener('pointercancel', soltarDedo);

    return {
      poner(d, e, nuevaVista) {
        if (nuevaVista) { fijarD0(d); vista = spec.vista(d); giro = vista.giro; inc = vista.inclinacion; dist = D0; nota.textContent = ''; }
        // Ruta rápida de la animación: misma forma → mover lo armado (sin rearmar ni liberar memoria en cada cuadro).
        const f = spec.forma && spec.mover ? spec.forma(d, e || {}) : null;
        if (!nuevaVista && f !== null && f === formaActual && spec.mover(T, grupo, d, e || {}, h) !== false) { pedir(); return; }
        formaActual = f;
        poner(d, e);
      },
      acercar, inicio,
      soltar() {
        ro.disconnect();
        try { limpiar(); renderer.dispose(); const x = renderer.getContext().getExtension('WEBGL_lose_context'); if (x && !renderer.getContext().isContextLost()) x.loseContext(); }
        catch (e) { /* el contexto ya estaba perdido */ }
      },
    };
  }

  function montar(el, spec, op) {
    const caja = document.createElement('div');
    caja.className = 'kit-3d';
    el.innerHTML = ''; el.appendChild(caja);
    let datos = null, estado = {}, v = null, aviso = '', fin = false, clave = '', cortado = false;
    const pintarPlano = () => {
      if (!datos) return;
      caja.innerHTML = spec.plano(datos, estado) + (aviso ? `<p class="kit-3d-nota">${aviso}</p>` : '')
        + (cortado ? '<button type="button" class="btn borde kit-3d-volver">Volver al 3D</button>' : '');
    };
    const armar = () => {
      try { v = vivo(caja, spec, op, perdido); cortado = false; aviso = ''; if (datos) v.poner(datos, estado, true); return true; }
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
        const k = spec.clave(d);
        const nueva = k !== clave; clave = k;
        datos = d; estado = e || {};
        if (v) v.poner(datos, estado, nueva); else pintarPlano();
      },
      acercar(f) { if (v) v.acercar(f); },
      inicio() { if (v) v.inicio(); },
      soltar() { fin = true; document.removeEventListener('visibilitychange', alVolver); if (v) v.soltar(); v = null; },
      get enVivo() { return !!v; },
    };
  }

  return { montar, cargarTres };
});
