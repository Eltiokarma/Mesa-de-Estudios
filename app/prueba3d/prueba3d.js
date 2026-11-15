/*
 * Prueba 3D (15 nov 2026): ¿da gusto y va fluido girar objetos 3D con three.js en los equipos del piloto?
 * Tres experiencias: un prisma que se corta con un plano (la sección la calcula geometria.js), una molécula que se gira
 * y cubitos que se ponen y se quitan. Se dibuja solo cuando algo cambia (render bajo demanda); la medición fuerza un giro
 * continuo para el peor caso. Sin WebGL 2 (three.js lo exige desde r163) avisa y no intenta nada.
 * Se abre en /app/prueba3d/. No es parte de la app: sirve para decidir si la pieza 3D entra al kit.
 */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const T = window.THREE, G = window.Geo3D;
  const TINTA = 0x2d2340, VAR_O = 0xb85a06, VAR_I = 0x08807a, MARCA = 0x7f5ae0;
  const guardado = (() => { try { return JSON.parse(localStorage.getItem('prueba3d')) || {}; } catch (e) { return {}; } })();
  const DIST = { corte: 7, molecula: 7, cubitos: 11.5 };
  const st = Object.assign({ escena: 'corte', yaw: 0.6, pitch: 0.45, dist: 7, d: 0, incl: 35, giro: 45, mol: 'CH4', poner: true, pilas: null }, guardado);
  const guardar = () => { try { localStorage.setItem('prueba3d', JSON.stringify(st)); } catch (e) { /* sin almacenamiento */ } };

  // ---------- WebGL 2 ----------
  // Si algo falla, se dice en pantalla (P3_FALLO, en index.html) y los botones de medición igual dan un JSON con el motivo.
  const fallo = t => (window.P3_FALLO ? window.P3_FALLO(t) : console.error(t));
  const cv = $('#cv'), caja = $('#lienzo');
  const prueba = document.createElement('canvas').getContext('webgl2');
  const infoGL = (() => {
    if (!prueba) return { webgl2: false };
    const ext = prueba.getExtension('WEBGL_debug_renderer_info');
    return { webgl2: true, renderer: ext ? prueba.getParameter(ext.UNMASKED_RENDERER_WEBGL) : prueba.getParameter(prueba.RENDERER), maxTextura: prueba.getParameter(prueba.MAX_TEXTURE_SIZE) };
  })();
  // Se suelta el contexto de prueba: algunos celulares no dan un segundo contexto mientras el primero sigue vivo.
  if (prueba) { const x = prueba.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
  const dispositivo = () => ({ agente: navigator.userAgent, nucleos: navigator.hardwareConcurrency || null, memoriaGB: navigator.deviceMemory || null,
    pantalla: `${screen.width}×${screen.height}`, ventana: `${innerWidth}×${innerHeight}`, dpr: devicePixelRatio, lienzo: `${cv.width}×${cv.height}` });
  const sinDibujo = motivo => {
    fallo(motivo);
    const r = () => ({ prueba: 'prueba-3d', version: 3, fecha: new Date().toISOString(), nota: $('#celular').value.trim(), dispositivo: dispositivo(), gl: infoGL, error: motivo, errores: window.P3_ERRORES || [] });
    const texto = () => JSON.stringify(r(), null, 2);
    $('#medir-todo').onclick = $('#medir-mano').onclick = () => { $('#estado').textContent = 'No se puede medir: ' + motivo + ' Descarga el JSON igual y mándalo.'; };
    $('#copiar').onclick = () => navigator.clipboard && navigator.clipboard.writeText(texto()).then(() => { $('#estado').textContent = 'Copiado.'; });
    $('#bajar').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto()], { type: 'application/json' })); a.download = `prueba3d-${Date.now()}.json`; a.click(); };
  };
  if (!T) return sinDibujo('three.js no cargó en este navegador (puede ser un navegador antiguo: prueba en Chrome actualizado).');
  if (!G) return sinDibujo('geometria.js no cargó.');
  if (!prueba) return sinDibujo('Este equipo no tiene WebGL 2: three.js no puede dibujar aquí. La app seguiría usando los dibujos de siempre (Canvas y SVG).');

  // ---------- Escena común ----------
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e1) {
    try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: false }); } catch (e2) {
      return sinDibujo('No se pudo crear el dibujo 3D: ' + (e2 && e2.message || e2));
    }
  }
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); fallo('El celular cortó el dibujo 3D (se perdió el contexto WebGL). Recarga la página.'); });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0xf6efe8, 1);
  const escena = new T.Scene();
  const camara = new T.PerspectiveCamera(35, 1, 0.1, 100);
  escena.add(new T.HemisphereLight(0xffffff, 0xd9cfc6, 1.6));
  const sol = new T.DirectionalLight(0xffffff, 1.4); sol.position.set(4, 7, 5); escena.add(sol);
  let mundo = new T.Group(); escena.add(mundo);
  const tamano = () => { const w = caja.clientWidth, h = caja.clientHeight; renderer.setSize(w, h, false); camara.aspect = w / h; camara.updateProjectionMatrix(); pedir(); };
  const ponerCamara = () => {
    const p = Math.max(-1.45, Math.min(1.5, st.pitch));
    camara.position.set(st.dist * Math.cos(p) * Math.sin(st.yaw), st.dist * Math.sin(p), st.dist * Math.cos(p) * Math.cos(st.yaw));
    camara.lookAt(0, st.escena === 'cubitos' ? 0.5 : 0, 0);
  };
  let pendiente = false;
  function dibujar() { ponerCamara(); renderer.render(escena, camara); }
  function pedir() { if (pendiente) return; pendiente = true; requestAnimationFrame(() => { pendiente = false; dibujar(); }); }
  const mate = (color, o = {}) => new T.MeshLambertMaterial(Object.assign({ color }, o));
  const contorno = (geo, color = TINTA) => new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color }));
  const limpiar = () => { escena.remove(mundo); mundo.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); mundo = new T.Group(); escena.add(mundo); };
  const lectura = t => { $('#lectura').textContent = t; cv.setAttribute('aria-label', t); };

  // ---------- 1. Prisma que se corta ----------
  const CUBO = { a: 2, b: 2, c: 2 };
  let seccionMesh = null, planoMesh = null;
  function armarCorte() {
    const g = new T.BoxGeometry(2, 2, 2);
    mundo.add(new T.Mesh(g, mate(0xfffaf6, { transparent: true, opacity: 0.35, depthWrite: false })));
    mundo.add(contorno(g));
    actualizarCorte();
  }
  function actualizarCorte() {
    if (seccionMesh) { mundo.remove(seccionMesh); seccionMesh.geometry.dispose(); }
    if (planoMesh) { mundo.remove(planoMesh); planoMesh.geometry.dispose(); }
    const n = G.normalDe(st.incl, st.giro), s = G.seccion(CUBO, n, st.d);
    // Plano: un cuadrado grande y tenue que sigue la normal (para ver hacia dónde corta).
    const pl = new T.Mesh(new T.BoxGeometry(4.4, 0.002, 4.4), new T.MeshBasicMaterial({ color: MARCA, transparent: true, opacity: 0.12, depthWrite: false }));
    pl.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(...n).normalize());
    pl.position.copy(new T.Vector3(...n).normalize().multiplyScalar(st.d));
    planoMesh = pl; mundo.add(pl);
    if (s.lados >= 3) {
      const c = s.puntos.reduce((a, p) => [a[0] + p[0] / s.lados, a[1] + p[1] / s.lados, a[2] + p[2] / s.lados], [0, 0, 0]);
      const pos = [];
      for (let k = 0; k < s.lados; k++) { const p = s.puntos[k], q = s.puntos[(k + 1) % s.lados]; pos.push(...c, ...p, ...q); }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
      seccionMesh = new T.Group();
      seccionMesh.add(new T.Mesh(geo, mate(VAR_O, { side: T.DoubleSide })));
      const borde = new T.BufferGeometry(); borde.setAttribute('position', new T.Float32BufferAttribute(s.puntos.concat([s.puntos[0]]).flat(), 3));
      seccionMesh.add(new T.Line(borde, new T.LineBasicMaterial({ color: TINTA })));
      seccionMesh.geometry = geo; mundo.add(seccionMesh);
      lectura(`La sección es un ${s.nombre} · área ${s.area.toFixed(2).replace('.', ',')}`);
    } else { seccionMesh = null; lectura('El plano no toca el cubo'); }
    pedir();
  }
  function controlesCorte() {
    const fila = (id, et, min, max, paso, v) => `<div class="p3-fila"><label for="${id}"><b>${et}</b></label><input id="${id}" type="range" min="${min}" max="${max}" step="${paso}" value="${v}"><output id="${id}-o"></output></div>`;
    $('#propios').innerHTML = fila('c-d', 'Altura', -1.7, 1.7, 0.05, st.d) + fila('c-i', 'Inclinación', 0, 70, 1, st.incl) + fila('c-g', 'Giro', 0, 90, 1, st.giro)
      + '<div class="p3-ctrl"><button type="button" id="c-hex">Probar: ¿puedes sacar un hexágono?</button></div>';
    const sync = () => { $('#c-d-o').textContent = st.d.toFixed(2).replace('.', ','); $('#c-i-o').textContent = `${st.incl}°`; $('#c-g-o').textContent = `${st.giro}°`; };
    $('#propios').oninput = e => { st.d = +$('#c-d').value; st.incl = +$('#c-i').value; st.giro = +$('#c-g').value; sync(); guardar(); actualizarCorte(); };
    $('#c-hex').onclick = () => lectura('Pista: inclina unos 55° y gira 45°, con la altura cerca de 0.');
    sync();
  }

  // ---------- 2. Molécula que gira ----------
  const CPK = { C: 0x3a3a3a, H: 0xf4f4f4, O: 0xd23b32, N: 0x2f5fd0, B: 0xe8a0a0, F: 0x5bbf4a };
  const NOMBRE_EL = { C: 'carbono', H: 'hidrógeno', O: 'oxígeno', N: 'nitrógeno', B: 'boro', F: 'flúor' };
  let atomos = [];
  function armarMolecula() {
    const m = G.molecula(st.mol); atomos = [];
    for (const a of m.atomos) {
      const r = a.el === 'H' ? 0.32 : 0.5;
      const s = new T.Mesh(new T.SphereGeometry(r, 28, 18), mate(CPK[a.el]));
      s.position.set(...a.pos); s.userData = { el: a.el }; mundo.add(s); atomos.push(s);
      if (a.pos.some(x => x)) {
        const v = new T.Vector3(...a.pos), cil = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, v.length(), 14), mate(0x8a8090));
        cil.position.copy(v.clone().multiplyScalar(0.5)); cil.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.clone().normalize()); mundo.add(cil);
      }
    }
    for (const p of m.pares) {
      const s = new T.Mesh(new T.SphereGeometry(0.42, 20, 14), mate(MARCA, { transparent: true, opacity: 0.25, depthWrite: false }));
      s.position.set(...p); s.scale.set(0.8, 1.2, 0.8); s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(...p).normalize()); mundo.add(s);
    }
    lectura(`${m.nombre}: ${m.geometria} · ángulo ${String(m.angulo).replace('.', ',')}°${m.pares.length ? ` · ${m.pares.length} ${m.pares.length === 1 ? 'par libre' : 'pares libres'}` : ''}`);
    pedir();
  }
  function controlesMolecula() {
    $('#propios').innerHTML = `<div class="p3-ctrl" role="group" aria-label="Molécula">${Object.keys(G.MOLECULAS).map(k => `<button type="button" data-mol="${k}" aria-pressed="${st.mol === k}">${k.replace(/(\d)/g, '<sub>$1</sub>')}</button>`).join('')}</div>
      <p class="sub" style="margin:0">Toca un átomo para ver cuál es. La nube violeta es un par de electrones sin enlazar.</p>`;
    $('#propios').onclick = e => { const b = e.target.closest('[data-mol]'); if (!b) return; st.mol = b.dataset.mol; guardar(); cambiarEscena(); };
  }

  // ---------- 3. Cubitos ----------
  const N = 4;
  let cubos = [];
  const pilas = () => (st.pilas && st.pilas.length === N * N ? st.pilas : (st.pilas = [2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]));
  function armarCubitos() {
    cubos = [];
    const base = new T.Mesh(new T.BoxGeometry(N, 0.06, N), mate(0xe9dfd5)); base.position.y = -0.03; base.userData = { base: true }; mundo.add(base);
    const geo = new T.BoxGeometry(0.98, 0.98, 0.98);
    pilas().forEach((h, k) => {
      const i = k % N, j = Math.floor(k / N);
      for (let y = 0; y < h; y++) {
        const m = new T.Mesh(geo, mate(y % 2 ? 0x9fd4cf : 0x6fbfb8)); m.position.set(i - N / 2 + 0.5, y + 0.5, j - N / 2 + 0.5);
        m.userData = { k }; mundo.add(m); cubos.push(m);
        const c = contorno(geo); c.position.copy(m.position); mundo.add(c);
      }
    });
    const n = pilas().reduce((a, b) => a + b, 0), arriba = pilas().filter(Boolean).length;
    lectura(`${n} cubitos · desde arriba se ven ${arriba} cuadrados`);
    pedir();
  }
  function controlesCubitos() {
    $('#propios').innerHTML = `<div class="p3-ctrl" role="group" aria-label="Qué hace el toque"><button type="button" data-modo="1" aria-pressed="${st.poner}">Poner</button><button type="button" data-modo="0" aria-pressed="${!st.poner}">Quitar</button><button type="button" id="vaciar">Vaciar</button></div>
      <p class="sub" style="margin:0">Toca una casilla o un cubito. Arrastrar gira la vista; tocar sin arrastrar pone o quita.</p>`;
    $('#propios').onclick = e => {
      const b = e.target.closest('[data-modo]'); if (b) { st.poner = b.dataset.modo === '1'; guardar(); controlesCubitos(); }
      if (e.target.closest('#vaciar')) { st.pilas = Array(N * N).fill(0); guardar(); cambiarEscena(); }
    };
  }

  // ---------- Tocar, arrastrar y vistas ----------
  const ray = new T.Raycaster(), ptr = new T.Vector2();
  let abajo = null;
  cv.addEventListener('pointerdown', e => { abajo = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch, movio: false }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - abajo.x, dy = e.clientY - abajo.y;
    if (!abajo.movio && Math.hypot(dx, dy) < 6) return;
    abajo.movio = true;
    st.yaw = abajo.yaw - dx * 0.01; st.pitch = abajo.pitch + dy * 0.01; pedir();
  });
  cv.addEventListener('pointerup', e => {
    if (!abajo) return;
    const fue = abajo; abajo = null; guardar();
    if (fue.movio) return;
    const r = cv.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ponerCamara(); ray.setFromCamera(ptr, camara);
    if (st.escena === 'molecula') { const h = ray.intersectObjects(atomos)[0]; if (h) lectura(`Ese átomo es de ${NOMBRE_EL[h.object.userData.el]} (${h.object.userData.el})`); }
    if (st.escena === 'cubitos') {
      const h = ray.intersectObjects(mundo.children.filter(o => o.isMesh))[0]; if (!h) return;
      let k = h.object.userData.k;
      if (h.object.userData.base) { const i = Math.floor(h.point.x + N / 2), j = Math.floor(h.point.z + N / 2); if (i < 0 || j < 0 || i >= N || j >= N) return; k = j * N + i; }
      const p = pilas();
      if (st.poner) p[k] = Math.min(4, p[k] + 1); else p[k] = Math.max(0, p[k] - 1);
      guardar(); cambiarEscena();
    }
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); st.dist = Math.max(4, Math.min(12, st.dist * (e.deltaY > 0 ? 1.08 : 0.92))); pedir(); }, { passive: false });
  const VISTAS = { frente: [0, 0], perfil: [Math.PI / 2, 0], planta: [0, 1.5], iso: [Math.PI / 4, 0.62] };
  document.querySelectorAll('[data-giro]').forEach(b => b.onclick = () => { st.yaw += (+b.dataset.giro) * Math.PI / 180; guardar(); pedir(); });
  document.querySelectorAll('[data-vista]').forEach(b => b.onclick = () => { [st.yaw, st.pitch] = VISTAS[b.dataset.vista]; guardar(); pedir(); });

  // ---------- Cambiar de objeto ----------
  const ARMAR = { corte: [armarCorte, controlesCorte], molecula: [armarMolecula, controlesMolecula], cubitos: [armarCubitos, controlesCubitos] };
  function cambiarEscena() {
    limpiar(); seccionMesh = planoMesh = null;
    document.querySelectorAll('[data-escena]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.escena === st.escena)));
    st.dist = DIST[st.escena];
    ARMAR[st.escena][1](); ARMAR[st.escena][0]();
  }
  document.querySelectorAll('[data-escena]').forEach(b => b.onclick = () => { st.escena = b.dataset.escena; guardar(); cambiarEscena(); });
  new ResizeObserver(tamano).observe(caja);
  cambiarEscena(); tamano();

  // ---------- Medición (como la de Rive: cuadros por segundo, cuadros perdidos, peor pausa, tareas largas) ----------
  const resultados = { prueba: 'prueba-3d', version: 3, fecha: '', three: '0.187.0', nota: '', dispositivo: {}, gl: infoGL, escenas: [] };
  let largas = 0;
  try { new PerformanceObserver(l => { largas += l.getEntries().length; }).observe({ type: 'longtask', buffered: false }); } catch (e) { /* no disponible */ }
  function medir(ms, girar) {
    return new Promise(ok => {
      const dts = []; let t0 = performance.now(), prev = t0; largas = 0;
      const paso = ahora => {
        dts.push(ahora - prev); prev = ahora;
        if (girar) st.yaw += 0.02;
        dibujar();
        if (ahora - t0 < ms) requestAnimationFrame(paso);
        else {
          const ord = dts.slice(1).sort((a, b) => a - b), n = ord.length;
          const p95 = ord[Math.floor(n * 0.95)] || 0;
          ok({ cuadros: n, fpsMedia: +(n / (ms / 1000)).toFixed(1), fpsP5: +(1000 / p95).toFixed(1), perdidos: ord.filter(d => d > 25).reduce((a, d) => a + Math.round(d / 16.7) - 1, 0),
            peorMs: +(ord[n - 1] || 0).toFixed(1), tareasLargas: largas, memoriaMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null });
        }
      };
      requestAnimationFrame(paso);
    });
  }
  function pintarResultados() {
    $('#resultados').innerHTML = `<table><tr><th>Objeto</th><th>fps</th><th>p5</th><th>perdidos</th><th>peor ms</th></tr>${resultados.escenas.map(r => `<tr><td>${r.nombre}</td><td>${r.fpsMedia}</td><td>${r.fpsP5}</td><td>${r.perdidos}</td><td>${r.peorMs}</td></tr>`).join('')}</table>
      <p class="sub">WebGL: ${infoGL.renderer || '—'}</p>`;
  }
  $('#medir-todo').onclick = () => medirTodo().catch(e => { fallo('Error al medir: ' + (e && e.message || e)); $('#estado').textContent = 'La medición se cortó por un error (ver el cuadro de arriba).'; });
  const medirTodo = async () => {
    $('#estado').textContent = 'Empezando la medición…';
    const antes = st.escena; resultados.escenas = []; resultados.fecha = new Date().toISOString(); resultados.nota = $('#celular').value.trim(); resultados.dispositivo = dispositivo();
    for (const esc of ['corte', 'molecula', 'cubitos']) {
      st.escena = esc; cambiarEscena();
      $('#estado').textContent = `Midiendo «${esc}»… no toques la pantalla.`;
      await medir(1000, true);                                  // calentar
      const v = [await medir(5000, true), await medir(4000, true)];
      resultados.escenas.push(Object.assign({ id: esc, nombre: { corte: 'Prisma que se corta', molecula: 'Molécula que gira', cubitos: 'Cubitos' }[esc], ventanas: v },
        { fpsMedia: Math.min(v[0].fpsMedia, v[1].fpsMedia), fpsP5: Math.min(v[0].fpsP5, v[1].fpsP5), perdidos: v[0].perdidos + v[1].perdidos, peorMs: Math.max(v[0].peorMs, v[1].peorMs) }));
      pintarResultados();
    }
    resultados.completa = true; st.escena = antes; cambiarEscena(); guardar();
    $('#estado').textContent = 'Listo. Descarga el JSON y mándalo.';
  };
  $('#medir-mano').onclick = async () => {
    $('#estado').textContent = 'Gira el objeto con el dedo durante 5 s…';
    const r = await medir(5000, false);
    resultados.escenas.push(Object.assign({ id: `${st.escena}-mano`, nombre: `${st.escena} (a mano)` }, r)); resultados.nota = $('#celular').value.trim(); resultados.dispositivo = dispositivo();
    pintarResultados(); $('#estado').textContent = 'Medido. Puedes repetir o descargar el JSON.';
  };
  const texto = () => JSON.stringify(resultados, null, 2);
  $('#copiar').onclick = () => navigator.clipboard && navigator.clipboard.writeText(texto()).then(() => { $('#estado').textContent = 'Copiado.'; });
  $('#bajar').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto()], { type: 'application/json' })); a.download = `prueba3d-${Date.now()}.json`; a.click(); };
  window.Prueba3D = { st, cambiarEscena, medir };
})();
