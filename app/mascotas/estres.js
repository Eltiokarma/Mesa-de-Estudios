// Prueba de estrés de Rive (versión 0 de docs/pogil-v2-rive.md, sección 9). No es parte de la app:
// es la página app/mascotas/estres.html, para medir en el celular de 4 GB cuántos lienzos de Rive aguanta.
// Las cuentas (cuadros por segundo, percentil 5, cuadros perdidos) son funciones puras y se prueban en Node
// (app/mascotas/estres.test.js); lo demás solo corre en el navegador.
(function (raiz) {
  'use strict';

  // ----- Cuentas -----

  // Percentil p (0 a 100) de una lista de números, con interpolación lineal.
  function percentil(lista, p) {
    if (!lista.length) return NaN;
    const a = lista.slice().sort((x, y) => x - y);
    const k = (a.length - 1) * p / 100, i = Math.floor(k), f = k - i;
    return i + 1 < a.length ? a[i] + f * (a[i + 1] - a[i]) : a[i];
  }

  // Intervalo nominal entre cuadros a partir de los intervalos medidos sin carga: la mediana, llevada a la
  // frecuencia de pantalla común más cercana (60, 90, 120 o 144 Hz) si está a menos del 10 %.
  function intervaloNominal(deltas) {
    const m = percentil(deltas, 50);
    if (!isFinite(m) || m <= 0) return 1000 / 60;
    for (const hz of [60, 90, 120, 144]) if (Math.abs(1000 / hz - m) / (1000 / hz) < 0.1) return 1000 / hz;
    return m;
  }

  // Resumen de una ventana: deltas en ms entre cuadros seguidos y lo que duró la ventana.
  // fpsMedia = cuadros / segundos; fpsP5 = 1000 / percentil 95 de los intervalos (el 5 % de los cuadros más lentos);
  // perdidos = cuadros que debieron dibujarse y no se dibujaron (cada intervalo de k periodos pierde k − 1).
  function resumirVentana(deltas, duracionMs, nominal) {
    const r1 = x => Math.round(x * 10) / 10;
    if (!deltas.length) return { cuadros: 0, fpsMedia: 0, fpsP5: 0, perdidos: 0, peorMs: 0 };
    let perdidos = 0;
    for (const d of deltas) perdidos += Math.max(0, Math.round(d / nominal) - 1);
    return {
      cuadros: deltas.length,
      fpsMedia: r1(deltas.length / (duracionMs / 1000)),
      fpsP5: r1(1000 / percentil(deltas, 95)),
      perdidos,
      peorMs: r1(Math.max(...deltas)),
    };
  }

  // Une las ventanas de un escenario: la media de las medias, el peor percentil 5 y la suma de perdidos.
  function resumirEscenario(ventanas) {
    const v = ventanas.filter(x => x.valida !== false && x.cuadros);
    if (!v.length) return null;
    const r1 = x => Math.round(x * 10) / 10;
    const mem = v.map(x => x.memoriaMB).filter(x => typeof x === 'number');
    return {
      fpsMedia: r1(v.reduce((s, x) => s + x.fpsMedia, 0) / v.length),
      fpsP5: Math.min(...v.map(x => x.fpsP5)),
      perdidos: v.reduce((s, x) => s + x.perdidos, 0),
      peorMs: Math.max(...v.map(x => x.peorMs)),
      memoriaMB: mem.length ? Math.max(...mem) : null,
    };
  }

  // Escenarios de la prueba completa. Cada lienzo: archivo (chica, grande o dedo) y tamaño (chica = 72 px,
  // como la mascota; grande = el ancho de la figura, hasta 320 px). El dedo, en la prueba completa, lo mueve
  // la página sola (para que la cifra no dependa de cómo se mueve la mano); en «Probar a mano» se usa el dedo.
  const ESCENARIOS = [
    { id: 'base', nombre: 'Sin Rive (línea base)', lienzos: [] },
    { id: '1-chica', nombre: '1 chica (la mascota sola)', lienzos: [['chica', 'chica']] },
    { id: '1-grande', nombre: '1 grande', lienzos: [['grande', 'grande']] },
    { id: '1-dedo', nombre: '1 grande siguiendo el dedo', lienzos: [['dedo', 'grande']] },
    { id: '2-grande-chica', nombre: '2: grande + chica (el tope de la sección 6.3)', lienzos: [['grande', 'grande'], ['chica', 'chica']] },
    { id: '2-dedo-chica', nombre: '2: dedo + chica', lienzos: [['dedo', 'grande'], ['chica', 'chica']] },
    { id: '2-grandes', nombre: '2 grandes', lienzos: [['grande', 'grande'], ['grande', 'grande']] },
    { id: '3-grandes-chica', nombre: '3: grande + dedo + chica', lienzos: [['grande', 'grande'], ['dedo', 'grande'], ['chica', 'chica']] },
    { id: '3-grandes', nombre: '3 grandes (por encima del tope)', lienzos: [['grande', 'grande'], ['grande', 'grande'], ['dedo', 'grande']] },
  ];

  const Cuentas = { percentil, intervaloNominal, resumirVentana, resumirEscenario, ESCENARIOS };
  if (typeof module === 'object' && module.exports) { module.exports = Cuentas; return; }

  // ----- Página -----

  const doc = raiz.document;
  const $ = s => doc.querySelector(s);
  const params = new URLSearchParams(raiz.location.search);
  const RUNTIME = params.get('runtime') === '2.43.1' ? '2.43.1' : '2.50.0';
  const DIR_RUNTIME = RUNTIME === '2.50.0' ? '../vendor/rive/' : '../vendor/rive-2.43.1/';
  const VENTANA_MS = Number(params.get('ventana')) || 5000;   // ventanas de 5 s
  const VENTANAS = Number(params.get('ventanas')) || 2;       // por escenario
  const CALENTAR_MS = 1500;                                   // se descarta: carga y primeros cuadros
  const ARCHIVOS = { chica: 'estres/chica.riv', grande: 'estres/grande.riv', dedo: 'estres/dedo.riv' };

  const bytes = {};          // nombre → ArrayBuffer
  let R = null;              // el objeto rive
  let vivos = [];            // { r, lienzo, nombre, entradas }
  let nominal = 1000 / 60;
  let corriendo = false, cancelar = false;
  let resultado = null;
  let dedoManual = 0;        // hasta cuándo manda el dedo de verdad (ms)

  // Tareas largas (más de 50 ms en el hilo principal), donde el navegador las cuenta.
  let tareasLargas = 0;
  try { new PerformanceObserver(l => { tareasLargas += l.getEntries().length; }).observe({ type: 'longtask', buffered: false }); } catch { /* sin soporte */ }

  // ----- Runtime y archivos -----

  function cargarRuntime() {
    if (R) return Promise.resolve(R);
    return new Promise((ok, mal) => {
      const s = doc.createElement('script');
      s.src = DIR_RUNTIME + 'rive.js';
      s.onload = () => {
        const rv = raiz.rive;
        if (!rv || !rv.Rive) return mal(new Error('rive.js cargó sin el objeto rive'));
        rv.RuntimeLoader.setWasmUrl(new URL(DIR_RUNTIME + 'rive.wasm', raiz.location.href).href);
        // El respaldo (para navegadores sin las funciones nuevas de wasm) solo viene con la 2.50.0.
        if (RUNTIME === '2.50.0' && rv.RuntimeLoader.setWasmFallbackUrl) rv.RuntimeLoader.setWasmFallbackUrl(new URL(DIR_RUNTIME + 'rive_fallback.wasm', raiz.location.href).href);
        try { rv.Rive.suppressDeprecationWarnings = ['state-machines-param', 'state-machine-inputs']; } catch { /* versiones viejas */ }
        R = rv; ok(rv);
      };
      s.onerror = () => mal(new Error('no se pudo bajar ' + s.src));
      doc.head.appendChild(s);
    });
  }

  async function cargarArchivos() {
    for (const [n, url] of Object.entries(ARCHIVOS)) {
      if (bytes[n]) continue;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`no se pudo bajar ${url} (${r.status})`);
      bytes[n] = await r.arrayBuffer();
    }
  }

  // Tamaño en px CSS: chica = 72; grande = el ancho disponible, hasta 320.
  function lado(tam) {
    if (tam === 'chica') return 72;
    return Math.max(160, Math.min(320, $('#escenario').clientWidth - 24));
  }

  // Monta un lienzo de Rive y resuelve cuando cargó. Las grandes se encaballan un poco para que todas queden
  // en pantalla (un lienzo fuera de la pantalla podría no dibujarse y daría una cifra engañosa).
  function montar(nombre, tam, i) {
    return new Promise((ok, mal) => {
      const l = lado(tam);
      const c = doc.createElement('canvas');
      c.className = 'lienzo ' + tam + (nombre === 'dedo' ? ' dedo' : '');
      c.style.width = c.style.height = l + 'px';
      if (tam === 'chica') { c.style.right = '8px'; c.style.bottom = '8px'; }
      else { c.style.left = (12 + i * 18) + 'px'; c.style.top = (12 + i * 36) + 'px'; }
      $('#escenario').appendChild(c);
      const r = new R.Rive({
        buffer: bytes[nombre].slice(0), canvas: c, stateMachines: 'Estres', autoplay: true,
        layout: new R.Layout({ fit: R.Fit.Contain }),
        onLoad: () => {
          try { r.resizeDrawingSurfaceToCanvas(); } catch { /* nada */ }
          const v = { r, lienzo: c, nombre, tam, entradas: {} };
          for (const e of r.stateMachineInputs('Estres') || []) v.entradas[e.name] = e;
          if (nombre === 'dedo') escucharDedo(v);
          ok(v);
        },
        onLoadError: () => mal(new Error('Rive no pudo abrir ' + nombre + '.riv')),
      });
    });
  }

  function desmontar() {
    for (const v of vivos) { try { v.r.cleanup(); } catch { /* nada */ } v.lienzo.remove(); }
    vivos = [];
  }

  // El dedo lo lee la página y se lo pasa a Rive como números (regla de la sección 6.1).
  function escucharDedo(v) {
    const mover = e => {
      const b = v.lienzo.getBoundingClientRect();
      v.entradas.x.value = Math.max(0, Math.min(100, (e.clientX - b.left) / b.width * 100));
      v.entradas.y.value = Math.max(0, Math.min(100, (e.clientY - b.top) / b.height * 100));
      dedoManual = performance.now() + 1500;
    };
    v.lienzo.addEventListener('pointerdown', e => { v.lienzo.setPointerCapture(e.pointerId); mover(e); });
    v.lienzo.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') mover(e); });
  }

  // Dedo automático: una curva de Lissajous, igual en todos los celulares.
  function dedoAutomatico(t) {
    if (t < dedoManual) return;
    const s = t / 1000;
    for (const v of vivos) if (v.nombre === 'dedo' && v.entradas.x) {
      v.entradas.x.value = 50 + 40 * Math.cos(s * 1.7);
      v.entradas.y.value = 50 + 40 * Math.sin(s * 2.3);
    }
  }

  // ----- Medición -----

  // Bucle propio de requestAnimationFrame: mide lo que ve el alumno (si Rive atrasa el hilo, aquí se nota).
  let deltas = [], ultimo = 0, oyente = null;
  function cuadro(t) {
    if (ultimo) { const d = t - ultimo; deltas.push(d); if (oyente) oyente(d); }
    ultimo = t;
    dedoAutomatico(t);
    raiz.requestAnimationFrame(cuadro);
  }

  async function memoria() {
    const out = {};
    const pm = raiz.performance && raiz.performance.memory;
    // Ojo: sin la bandera --enable-precise-memory-info, Chrome redondea esta cifra y la actualiza poco.
    if (pm) { out.heapJSUsadoMB = +(pm.usedJSHeapSize / 1048576).toFixed(1); out.heapJSTotalMB = +(pm.totalJSHeapSize / 1048576).toFixed(1); }
    if (raiz.crossOriginIsolated && raiz.performance.measureUserAgentSpecificMemory) {
      try { const m = await raiz.performance.measureUserAgentSpecificMemory(); out.paginaMB = +(m.bytes / 1048576).toFixed(1); } catch { /* nada */ }
    }
    return out;
  }

  const espera = ms => new Promise(ok => setTimeout(ok, ms));

  // Mide una ventana: junta los intervalos durante VENTANA_MS. Si la página se ocultó, la ventana no vale.
  async function medirVentana() {
    deltas = []; ultimo = 0;
    const largas0 = tareasLargas, oculta0 = doc.hidden;
    let oculta = oculta0;
    const vigia = () => { if (doc.hidden) oculta = true; };
    doc.addEventListener('visibilitychange', vigia);
    const t0 = performance.now();
    await espera(VENTANA_MS);
    const dur = performance.now() - t0;
    doc.removeEventListener('visibilitychange', vigia);
    const v = resumirVentana(deltas, dur, nominal);
    v.tareasLargas = tareasLargas - largas0;
    const m = await memoria();
    if (m.heapJSUsadoMB !== undefined) v.memoriaMB = m.heapJSUsadoMB;
    v.memoria = m;
    if (oculta) v.valida = false;
    return v;
  }

  // ----- Pantalla -----

  function estado(texto) { $('#estado').textContent = texto; }

  let ventanaViva = [], vivoT0 = 0;
  function medidorVivo() {
    // Cuadros por segundo del último segundo, en vivo (no entra al resultado).
    oyente = d => { ventanaViva.push(d); };
    setInterval(() => {
      const ahora = performance.now();
      if (ahora - vivoT0 >= 1000) {
        const r = resumirVentana(ventanaViva, ahora - vivoT0, nominal);
        $('#vivo').textContent = ventanaViva.length ? `${r.fpsMedia} cuadros/s · peor ${Math.round(r.peorMs)} ms` : '—';
        ventanaViva = []; vivoT0 = ahora;
      }
    }, 250);
  }

  function dispositivo() {
    const n = raiz.navigator, s = raiz.screen;
    return {
      agente: n.userAgent, nucleos: n.hardwareConcurrency || null, memoriaGB: n.deviceMemory || null,
      pantalla: `${s.width}×${s.height}`, ventana: `${raiz.innerWidth}×${raiz.innerHeight}`, dpr: raiz.devicePixelRatio,
      aislado: !!raiz.crossOriginIsolated,
    };
  }

  function nuevoResultado() {
    return {
      prueba: 'estres-rive', version: 1, fecha: new Date().toISOString(), runtime: RUNTIME,
      nota: $('#nota').value.trim(), emulado: params.get('emulado') || null,
      dispositivo: dispositivo(), ventanaMs: VENTANA_MS, hzEstimados: Math.round(1000 / nominal),
      archivosKB: Object.fromEntries(Object.entries(bytes).map(([n, b]) => [n, +(b.byteLength / 1024).toFixed(1)])),
      escenarios: [],
    };
  }

  const fmt = x => (x === null || x === undefined || Number.isNaN(x)) ? '—' : String(x).replace('.', ',');
  function pintarTabla() {
    if (!resultado) return;
    const filas = resultado.escenarios.map(e => {
      const s = e.resumen;
      return `<tr><th scope="row">${e.nombre}</th><td>${s ? fmt(s.fpsMedia) : '—'}</td><td>${s ? fmt(s.fpsP5) : '—'}</td><td>${s ? fmt(s.perdidos) : '—'}</td><td>${s ? fmt(Math.round(s.peorMs)) : '—'}</td><td>${s ? fmt(s.memoriaMB) : '—'}</td></tr>`;
    }).join('');
    $('#tabla').innerHTML = `<table><thead><tr><th scope="col">Escenario</th><th scope="col">Media (cuadros/s)</th><th scope="col">Percentil 5</th><th scope="col">Perdidos</th><th scope="col">Peor pausa (ms)</th><th scope="col">Memoria JS (MB)</th></tr></thead><tbody>${filas}</tbody></table>
      <p class="chico">Pantalla de ${resultado.hzEstimados} Hz · runtime ${resultado.runtime} · ventanas de ${VENTANA_MS / 1000} s${resultado.emulado ? ' · <strong>cifra emulada: ' + resultado.emulado + '</strong>' : ''}.</p>`;
    $('#json').value = JSON.stringify(resultado, null, 2);
    $('#salida').hidden = false;
  }

  // ----- Correr -----

  async function preparar() {
    // La barra de estado y el escenario quedan a la vista: un lienzo fuera de la pantalla mediría otra cosa.
    $('#barra').scrollIntoView({ block: 'start' });
    estado('Bajando el runtime de Rive y los archivos de prueba…');
    await cargarRuntime();
    await cargarArchivos();
  }

  async function correrEscenario(esc, i, total) {
    desmontar();
    estado(`${i + 1} de ${total}: ${esc.nombre} — cargando…`);
    for (const [k, [n, tam]] of esc.lienzos.entries()) vivos.push(await montar(n, tam, k));
    await espera(CALENTAR_MS);
    const ventanas = [];
    for (let w = 0; w < VENTANAS && !cancelar; w++) {
      estado(`${i + 1} de ${total}: ${esc.nombre} — midiendo ${w + 1} de ${VENTANAS}…`);
      ventanas.push(await medirVentana());
    }
    return { id: esc.id, nombre: esc.nombre, lienzos: vivos.map(v => ({ archivo: v.nombre, ladoPx: parseFloat(v.lienzo.style.width), pxReales: `${v.lienzo.width}×${v.lienzo.height}` })), ventanas, resumen: resumirEscenario(ventanas) };
  }

  async function correrTodo() {
    if (corriendo) return;
    corriendo = true; cancelar = false;
    botones(true);
    try {
      await preparar();
      // Calibra la pantalla sin Rive: de ahí sale cuántos cuadros por segundo da (60, 90, 120…).
      estado('Midiendo la pantalla sin Rive…');
      deltas = []; ultimo = 0; await espera(1500);
      nominal = intervaloNominal(deltas);
      resultado = nuevoResultado();
      for (const [i, esc] of ESCENARIOS.entries()) {
        if (cancelar) break;
        resultado.escenarios.push(await correrEscenario(esc, i, ESCENARIOS.length));
        pintarTabla();
      }
      resultado.completa = !cancelar;
      desmontar();
      estado(cancelar ? 'Prueba detenida. Lo medido hasta ahí está abajo.' : 'Listo. Copia o descarga el resultado y mándaselo al equipo.');
      pintarTabla();
      raiz.resultadoEstres = resultado;
    } catch (e) {
      desmontar(); estado('Error: ' + e.message); raiz.resultadoEstres = { error: e.message };
    } finally { corriendo = false; botones(false); }
  }

  // Probar a mano: monta el escenario elegido y lo deja corriendo, con el medidor en vivo; «Medir 5 s» agrega una fila.
  async function probarAMano() {
    if (corriendo) return;
    const esc = ESCENARIOS.find(e => e.id === $('#mano').value);
    try {
      await preparar();
      desmontar();
      for (const [k, [n, tam]] of esc.lienzos.entries()) vivos.push(await montar(n, tam, k));
      estado(`A mano: ${esc.nombre}. ${esc.lienzos.some(l => l[0] === 'dedo') ? 'Arrastra el dedo sobre la pelota. ' : ''}Toca «Medir 5 s» para guardar una fila.`);
      $('#medir').disabled = false;
    } catch (e) { estado('Error: ' + e.message); }
  }

  async function medirAMano() {
    if (corriendo) return;
    corriendo = true; botones(true);
    const esc = ESCENARIOS.find(e => e.id === $('#mano').value);
    if (!resultado) resultado = nuevoResultado();
    estado('Midiendo 5 s… sigue haciendo lo mismo.');
    const v = await medirVentana();
    resultado.escenarios.push({ id: esc.id + '-a-mano', nombre: esc.nombre + ' (a mano)', lienzos: vivos.map(x => ({ archivo: x.nombre, ladoPx: parseFloat(x.lienzo.style.width), pxReales: `${x.lienzo.width}×${x.lienzo.height}` })), ventanas: [v], resumen: resumirEscenario([v]) });
    pintarTabla();
    raiz.resultadoEstres = resultado;
    estado('Fila guardada. Puedes medir de nuevo o cambiar de escenario.');
    corriendo = false; botones(false);
  }

  function botones(ocupado) {
    $('#correr').disabled = ocupado; $('#montar').disabled = ocupado;
    $('#medir').disabled = ocupado || !vivos.length;
    $('#detener').disabled = !ocupado;
  }

  function descargar() {
    const b = new Blob([$('#json').value], { type: 'application/json' });
    const a = doc.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `estres-rive-${(resultado.fecha || '').slice(0, 16).replace(/[:T]/g, '-')}.json`;
    doc.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function copiar() {
    const t = $('#json');
    try { await raiz.navigator.clipboard.writeText(t.value); estado('Resultado copiado.'); }
    catch { t.select(); try { doc.execCommand('copy'); estado('Resultado copiado.'); } catch { estado('No se pudo copiar: selecciona el texto y cópialo a mano.'); } }
  }

  function iniciar() {
    $('#runtime').textContent = RUNTIME;
    $('#otro-runtime').href = '?runtime=' + (RUNTIME === '2.50.0' ? '2.43.1' : '2.50.0');
    $('#otro-runtime').textContent = 'Probar con ' + (RUNTIME === '2.50.0' ? '2.43.1' : '2.50.0');
    $('#mano').innerHTML = ESCENARIOS.filter(e => e.lienzos.length).map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    $('#correr').addEventListener('click', correrTodo);
    $('#detener').addEventListener('click', () => { cancelar = true; estado('Deteniendo al final de esta ventana…'); });
    $('#montar').addEventListener('click', probarAMano);
    $('#medir').addEventListener('click', medirAMano);
    $('#copiar').addEventListener('click', copiar);
    $('#descargar').addEventListener('click', descargar);
    const m = raiz.performance && raiz.performance.memory;
    $('#memoria-aviso').textContent = m ? 'Este navegador da la memoria de JavaScript (performance.memory).' : 'Este navegador no da la memoria: esa columna sale vacía (pasa en Safari y Firefox).';
    botones(false);
    raiz.requestAnimationFrame(cuadro);
    medidorVivo();
    if (params.get('auto') === '1') correrTodo();
  }

  doc.readyState === 'loading' ? doc.addEventListener('DOMContentLoaded', iniciar) : iniciar();
  raiz.EstresRive = Cuentas;
})(typeof window !== 'undefined' ? window : globalThis);
