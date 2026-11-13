/*
 * La mascota: hueco listo para Rive (docs/escena-viva.md, sección 6; docs/encargo-vectores.md).
 *
 * En la página:  <div class="mascota" data-mascota aria-hidden="true"></div>   (72 × 72 por nucleo/mascota.css)
 * Se monta sola: un MutationObserver monta todo [data-mascota] que aparezca. También a mano:
 *   Mascota.montar(el, { curso })   el curso sale de la opción, de data-curso del elemento o de un ancestro
 *                                   (las escenas lo tienen en <html data-curso>); sin curso, la mascota por defecto.
 *   Mascota.pose('celebra')         repertorio cerrado: reposo, saluda, señala, espera, celebra, acompaña, ayuda, hito
 *                                   (también senala y acompana). Un nombre desconocido no hace nada y avisa en consola.
 *
 * Qué mascota: app/mascotas/registro.json dice cuál usa cada curso; app/mascotas/<id>/mascota.json trae
 * nombre, riv (ruta o null), maquina, entradas y respaldo (SVG). Con riv: null, o si el .riv no carga o no
 * cumple el contrato, se ve el respaldo SVG con la misma pose por clase CSS. La app nunca espera a la mascota.
 *
 * Contrato con el archivo Rive: máquina de estados «Mesa», entrada numérica «pose» (0 reposo, 1 saluda,
 * 2 señala, 3 espera, 4 celebra, 5 acompaña, 6 ayuda, 7 hito) y booleana «reducido» (prefers-reduced-motion).
 *
 * Carga perezosa: el runtime (app/vendor/rive/, ~150 KB + ~940 KB con gzip) se pide solo si la mascota elegida
 * trae .riv, y después de pintar el respaldo, cuando el navegador está libre.
 *
 * Actuación: la pose se queda hasta que la app pida otra (vuelve a reposo cuando empieza la tarea siguiente,
 * no por tiempo); «señala» vuelve sola a reposo cuando el alumno toca algo o usa el teclado. Después de cada
 * pose hay como máximo un gesto de vida (parpadeo u oreja) a los 2,4 s; luego, quieta. Con la pestaña oculta,
 * todo en pausa.
 *
 * En Node (pruebas) solo sirven las funciones puras: POSES, normalizarPose, numeroPose, leerRegistro,
 * elegirMascota, leerMascota y revisarContrato.
 */
(function (root, fabrica) {
  const api = fabrica(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Mascota = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';

  // ---------- Contrato y funciones puras ----------

  const POSES = ['reposo', 'saluda', 'señala', 'espera', 'celebra', 'acompaña', 'ayuda', 'hito'];
  const CONTRATO = { maquina: 'Mesa', pose: 'pose', reducido: 'reducido' };
  // Tipos de entrada de Rive (StateMachineInputType de @rive-app/canvas).
  const TIPO = { numero: 56, disparo: 58, booleano: 59 };

  const sinMarcas = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const SLUG = Object.fromEntries(POSES.map(p => [p, sinMarcas(p)]));

  // 'Señala', 'senala', ' SEÑALA ' → 'señala'. Lo que no está en el repertorio → null.
  function normalizarPose(nombre) {
    if (typeof nombre !== 'string') return null;
    const n = sinMarcas(nombre.trim().toLowerCase());
    return POSES.find(p => SLUG[p] === n) || null;
  }
  // Número de la entrada «pose» del archivo Rive; -1 si la pose no existe.
  const numeroPose = nombre => POSES.indexOf(normalizarPose(nombre));

  // Registro: { porDefecto, mascotas: [ids], cursos: { curso: id } }. Se tolera lo que falte.
  function leerRegistro(json) {
    const r = json && typeof json === 'object' ? json : {};
    const cursos = r.cursos && typeof r.cursos === 'object' ? { ...r.cursos } : {};
    const mascotas = Array.isArray(r.mascotas) ? r.mascotas.filter(x => typeof x === 'string' && x)
      : [...new Set([r.porDefecto, ...Object.values(cursos)].filter(x => typeof x === 'string' && x))];
    const porDefecto = typeof r.porDefecto === 'string' && r.porDefecto ? r.porDefecto : (mascotas[0] || null);
    return { porDefecto, mascotas, cursos };
  }

  // Id de la mascota de un curso: la del curso si está en la lista; si no, la de por defecto.
  function elegirMascota(registro, curso) {
    const r = leerRegistro(registro);
    const id = curso && r.cursos[curso];
    if (id && r.mascotas.includes(id)) return id;
    return r.porDefecto;
  }

  // Une una ruta relativa a la carpeta de la mascota (base termina en «/»). Las absolutas se respetan.
  function unir(base, ruta) {
    if (!ruta) return null;
    if (/^([a-z][a-z0-9+.-]*:|\/)/i.test(ruta)) return ruta;
    try { return new URL(ruta, base).href; } catch { return String(base || '') + ruta; }
  }

  // Ficha de una mascota, con las rutas resueltas. usaRive dice si hay que intentar el .riv.
  function leerMascota(json, base) {
    const m = json && typeof json === 'object' ? json : {};
    const entradas = Object.assign({}, { pose: CONTRATO.pose, reducido: CONTRATO.reducido }, m.entradas || {});
    const riv = typeof m.riv === 'string' && m.riv.trim() ? unir(base, m.riv.trim()) : null;
    return {
      id: m.id || null,
      nombre: m.nombre || m.id || 'Mascota',
      riv,
      maquina: typeof m.maquina === 'string' && m.maquina ? m.maquina : CONTRATO.maquina,
      entradas,
      respaldo: typeof m.respaldo === 'string' && m.respaldo ? unir(base, m.respaldo) : null,
      usaRive: !!riv,
    };
  }

  // ¿El archivo cumple el contrato? maquinas: nombres de las máquinas de estados del artboard;
  // entradas: [{ name, type }] de la máquina pedida. Devuelve { ok, problemas: [texto] }.
  function revisarContrato(maquinas, entradas, def) {
    const d = def || { maquina: CONTRATO.maquina, entradas: { pose: CONTRATO.pose, reducido: CONTRATO.reducido } };
    const problemas = [];
    if (!Array.isArray(maquinas) || !maquinas.includes(d.maquina)) {
      problemas.push(`no tiene la máquina de estados «${d.maquina}» (tiene: ${(maquinas || []).join(', ') || 'ninguna'})`);
      return { ok: false, problemas };
    }
    const lista = Array.isArray(entradas) ? entradas : [];
    const busca = (nombre, tipo, palabra) => {
      const e = lista.find(x => x && x.name === nombre);
      if (!e) problemas.push(`a «${d.maquina}» le falta la entrada ${palabra} «${nombre}»`);
      else if (e.type !== tipo) problemas.push(`la entrada «${nombre}» debe ser ${palabra}`);
    };
    busca(d.entradas.pose, TIPO.numero, 'numérica');
    busca(d.entradas.reducido, TIPO.booleano, 'booleana');
    return { ok: problemas.length === 0, problemas };
  }

  const puras = { POSES, CONTRATO, TIPO, normalizarPose, numeroPose, leerRegistro, elegirMascota, leerMascota, revisarContrato };
  if (typeof document === 'undefined' || typeof window === 'undefined') return puras;

  // ---------- Navegador ----------

  // Rutas a partir de este mismo script (/nucleo/mascota.js → raíz del sitio), así sirve en la app y en las escenas.
  const src = (document.currentScript && document.currentScript.src) || new URL('/nucleo/mascota.js', location.href).href;
  const RAIZ = new URL('../', src).href;
  const MASCOTAS = new URL('app/mascotas/', RAIZ).href;
  const RIVE = new URL('app/vendor/rive/', RAIZ).href;
  const CSS = new URL('nucleo/mascota.css', RAIZ).href;

  const avisar = (...a) => { try { console.warn('[mascota]', ...a); } catch { /* nada */ } };
  const montadas = new Set();
  let poseActual = 'reposo';
  let reducidoForzado = null;   // null: lo decide prefers-reduced-motion
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reducido = () => reducidoForzado !== null ? reducidoForzado : !!(mq && mq.matches);

  // Un solo pedido por archivo, compartido entre mascotas (el service worker lo guarda para sin conexión).
  const memo = new Map();
  const pedir = (url, tipo) => {
    if (!memo.has(url)) {
      memo.set(url, fetch(url).then(r => { if (!r.ok) throw new Error(`${r.status} ${url}`); return tipo === 'json' ? r.json() : r.text(); })
        .catch(e => { memo.delete(url); throw e; }));
    }
    return memo.get(url);
  };

  function estilos() {
    if (document.querySelector('link[href$="nucleo/mascota.css"], #mascota-css')) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CSS; l.id = 'mascota-css';
    (document.head || document.documentElement).appendChild(l);
  }

  const cursoDe = el => (el.dataset && el.dataset.curso) || (el.closest && (el.closest('[data-curso]') || {}).dataset?.curso) || null;

  async function definicion(opciones) {
    let id = opciones.mascota;
    if (!id) {
      let registro = null;
      try { registro = await pedir(MASCOTAS + 'registro.json', 'json'); } catch (e) { avisar('no se pudo leer el registro', e.message); }
      id = elegirMascota(registro || { porDefecto: 'gato' }, opciones.curso);
    }
    if (!id) return null;
    const base = MASCOTAS + encodeURIComponent(id) + '/';
    const json = await pedir(base + 'mascota.json', 'json');
    const def = leerMascota(Object.assign({ id }, json), base);
    if (opciones.riv) { def.riv = opciones.riv; def.usaRive = true; }
    return def;
  }

  // ----- Respaldo SVG -----

  function pintarPose(e, nombre, animar) {
    const el = e.el;
    el.dataset.pose = SLUG[nombre];
    el.classList.remove('m-actua', 'm-vida');
    clearTimeout(e.vida); cancelAnimationFrame(e.cuadro);
    if (!animar || reducido() || e.modo !== 'svg') return;
    // Un cuadro después, para que el mismo gesto se repita si la pose se pide dos veces seguidas.
    if (nombre !== 'reposo') e.cuadro = requestAnimationFrame(() => el.classList.add('m-actua'));
    programarVida(e);
  }

  function programarVida(e) {
    clearTimeout(e.vida);
    if (reducido() || document.hidden || e.modo !== 'svg') return;
    e.vida = setTimeout(() => {
      e.el.classList.add('m-vida');
      e.vida = setTimeout(() => e.el.classList.remove('m-vida'), 400);
    }, 2400);
  }

  // ----- Rive -----

  let runtime = null;
  function cargarRuntime() {
    if (!runtime) {
      runtime = new Promise((ok, mal) => {
        if (root.rive && root.rive.Rive) return ok(root.rive);
        const s = document.createElement('script');
        s.src = RIVE + 'rive.js'; s.async = true;
        s.onload = () => root.rive && root.rive.Rive ? ok(root.rive) : mal(new Error('rive.js cargó sin el objeto rive'));
        s.onerror = () => mal(new Error('no se pudo cargar ' + s.src));
        document.head.appendChild(s);
      }).then(R => {
        const L = R.RuntimeLoader;
        L.setWasmUrl(RIVE + 'rive.wasm');
        if (L.setWasmFallbackUrl) L.setWasmFallbackUrl(RIVE + 'rive_fallback.wasm');
        if (L.setWasmThreadsUrl) L.setWasmThreadsUrl(null);
        return R;
      });
      runtime.catch(() => { runtime = null; });
    }
    return runtime;
  }

  const enReposo = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));

  // Una instancia de Rive sobre los bytes ya bajados; resuelve cuando cargó.
  function instancia(R, buffer, opciones) {
    return new Promise((ok, mal) => {
      let r;
      try {
        r = new R.Rive(Object.assign({
          buffer, autoplay: false,
          layout: new R.Layout({ fit: R.Fit.Contain, alignment: R.Alignment.Center }),
          onLoad: () => ok(r),
          onLoadError: () => { try { r.cleanup(); } catch { /* nada */ } mal(new Error('Rive no pudo abrir el archivo')); },
        }, opciones));
      } catch (e) { mal(e); }
    });
  }

  // Abre un .riv. Resuelve { r, lienzo, entradas } si cumple el contrato; si no, rechaza diciendo por qué.
  // Dos pasos sobre los mismos bytes: primero se lee su contenido sin echarlo a andar (si se pide una máquina
  // que no existe, Rive lo trata como error de carga y se pierde el porqué); recién si cumple, se abre con «Mesa».
  async function abrirRiv(R, def, lado) {
    const resp = await fetch(def.riv);
    if (!resp.ok) throw new Error(`no se pudo bajar (${resp.status})`);
    const buffer = await resp.arrayBuffer();
    const prueba = await instancia(R, buffer, { canvas: document.createElement('canvas') });
    const contenido = prueba.contents;
    try { prueba.cleanup(); } catch { /* nada */ }
    const ab = contenido && contenido.artboards[0];   // Rive usa el primer artboard
    const maquinas = ab ? ab.stateMachines.map(m => m.name) : [];
    const mesa = ab && ab.stateMachines.find(m => m.name === def.maquina);
    const rev = revisarContrato(maquinas, mesa ? mesa.inputs : [], def);
    if (!rev.ok) throw new Error(rev.problemas.join('; '));

    const lienzo = document.createElement('canvas');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = lienzo.height = Math.round(lado * dpr);
    lienzo.className = 'm-lienzo';
    lienzo.setAttribute('aria-hidden', 'true');
    const r = await instancia(R, buffer, { canvas: lienzo, stateMachines: def.maquina, autoplay: true });
    const ins = r.stateMachineInputs(def.maquina) || [];
    const toma = n => ins.find(x => x.name === n);
    if (!toma(def.entradas.pose) || !toma(def.entradas.reducido)) {
      try { r.cleanup(); } catch { /* nada */ }
      throw new Error(`la máquina «${def.maquina}» no expuso sus entradas`);
    }
    return { r, lienzo, entradas: { pose: toma(def.entradas.pose), reducido: toma(def.entradas.reducido) } };
  }

  async function probarRive(e) {
    let R;
    try { R = await cargarRuntime(); } catch (err) { return avisar('sin runtime de Rive, queda el respaldo:', err.message); }
    if (!e.el.isConnected) return;
    try {
      const { r, lienzo, entradas } = await abrirRiv(R, e.def, e.el.clientWidth || 72);
      if (!e.el.isConnected) { r.cleanup(); return; }
      e.rive = r; e.entradas = entradas; e.modo = 'rive';
      entradas.reducido.value = reducido();
      entradas.pose.value = numeroPose(poseActual);
      e.el.appendChild(lienzo);
      e.el.classList.add('m-con-rive');
      clearTimeout(e.vida); e.el.classList.remove('m-actua', 'm-vida');
      if (document.hidden) r.pause();
    } catch (err) {
      avisar(`«${e.def.riv}» no cumple el contrato, queda el respaldo SVG:`, err.message);
    }
  }

  // ----- API -----

  async function montar(el, opciones) {
    if (!el || el.nodeType !== 1) return null;
    if (el.__mascota) return el.__mascota;
    const o = Object.assign({}, opciones || {});
    if (!o.curso) o.curso = cursoDe(el);
    if (!o.mascota && el.dataset.mascota) o.mascota = el.dataset.mascota;
    estilos();
    el.classList.add('mascota');
    if (!el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true');
    el.dataset.mascotaLista = '';
    const e = { el, def: null, modo: 'cargando', rive: null, entradas: null, vida: 0, cuadro: 0 };
    el.__mascota = e;
    montadas.add(e);
    el.dataset.pose = SLUG[poseActual];
    if (reducidoForzado !== null) el.toggleAttribute('data-reducido', reducidoForzado);
    try {
      e.def = await definicion(o);
      if (!e.def) throw new Error('no hay mascota para este curso');
      el.dataset.mascotaId = e.def.id;
      if (e.def.respaldo) {
        const svg = await pedir(e.def.respaldo, 'text');
        if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', svg);
      }
      e.modo = 'svg';
      pintarPose(e, poseActual, false);
      if (e.def.usaRive) enReposo(() => probarRive(e));
    } catch (err) {
      avisar('no se pudo montar la mascota:', err.message);
    }
    return e;
  }

  let quitarSenala = null;
  function pose(nombre) {
    const n = normalizarPose(nombre);
    if (!n) { avisar(`pose desconocida «${nombre}»; el repertorio es: ${POSES.join(', ')}`); return false; }
    poseActual = n;
    if (quitarSenala) { quitarSenala(); quitarSenala = null; }
    for (const e of [...montadas]) {
      if (!e.el.isConnected) { soltar(e); continue; }
      if (e.modo === 'rive') e.entradas.pose.value = numeroPose(n);
      else pintarPose(e, n, true);
    }
    // «señala» dura hasta que el alumno toca algo (o usa el teclado).
    if (n === 'señala') {
      const volver = () => { quitarSenala && quitarSenala(); quitarSenala = null; if (poseActual === 'señala') pose('reposo'); };
      const t = setTimeout(() => {
        document.addEventListener('pointerdown', volver, { capture: true, passive: true });
        document.addEventListener('keydown', volver, { capture: true });
      }, 0);
      quitarSenala = () => {
        clearTimeout(t);
        document.removeEventListener('pointerdown', volver, { capture: true });
        document.removeEventListener('keydown', volver, { capture: true });
      };
    }
    return true;
  }

  function soltar(e) {
    clearTimeout(e.vida); cancelAnimationFrame(e.cuadro);
    if (e.rive) { try { e.rive.cleanup(); } catch { /* nada */ } }
    montadas.delete(e);
  }

  // Para probar.html: fuerza el movimiento reducido (true/false) o lo devuelve al sistema (null).
  function forzarReducido(v) {
    reducidoForzado = v === null || v === undefined ? null : !!v;
    for (const e of montadas) {
      if (reducidoForzado === null) e.el.removeAttribute('data-reducido'); else e.el.toggleAttribute('data-reducido', reducidoForzado);
      if (e.entradas) e.entradas.reducido.value = reducido();
      if (reducido()) { clearTimeout(e.vida); e.el.classList.remove('m-actua', 'm-vida'); }
    }
  }
  if (mq) {
    const cambio = () => forzarReducido(reducidoForzado);
    if (mq.addEventListener) mq.addEventListener('change', cambio); else if (mq.addListener) mq.addListener(cambio);
  }

  document.addEventListener('visibilitychange', () => {
    for (const e of montadas) {
      e.el.toggleAttribute('data-pausada', document.hidden);
      if (document.hidden) { clearTimeout(e.vida); if (e.rive) e.rive.pause(); }
      else if (e.rive) e.rive.play();
    }
  });

  // Monta sola todo [data-mascota] que aparezca. Barato: solo mira los nodos HTML agregados.
  function buscar(nodo) {
    if (nodo.nodeType !== 1 || nodo.namespaceURI !== 'http://www.w3.org/1999/xhtml') return;
    if (nodo.hasAttribute('data-mascota') && !nodo.__mascota) montar(nodo);
    if (nodo.firstElementChild) for (const el of nodo.querySelectorAll('[data-mascota]:not([data-mascota-lista])')) montar(el);
  }
  // Las que salieron del documento se sueltan (un .riv que sigue andando en un lienzo suelto gasta batería).
  const vigia = typeof MutationObserver === 'function' ? new MutationObserver(lista => {
    let salieron = false;
    for (const m of lista) { for (const n of m.addedNodes) buscar(n); if (m.removedNodes.length) salieron = true; }
    if (salieron) for (const e of [...montadas]) if (!e.el.isConnected) soltar(e);
  }) : null;
  function arrancar() {
    buscar(document.documentElement);
    if (vigia) vigia.observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar, { once: true });
  else arrancar();

  return Object.assign(puras, {
    montar, pose, forzarReducido,
    poseActual: () => poseActual,
    // Para probar.html: el runtime y el chequeo del contrato sobre un archivo suelto.
    _cargarRuntime: cargarRuntime, _abrirRiv: abrirRiv,
  });
});
