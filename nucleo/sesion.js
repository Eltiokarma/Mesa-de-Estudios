/*
 * Sesión con cuenta (fase C2 de docs/cuentas.md): login, renovación, cierre de sesión y sincronización.
 * Sin DOM: funciona en el navegador (window.Sesion) y en Node (require), con fetch, almacén y relojes inyectables.
 * El contrato de la API está en docs/cuentas.md, «Contrato de la API»; ese contrato manda.
 *
 * Qué guarda en el almacén (localStorage):
 *   lab-sesion-v1    { acceso, renovacion, expira (ms), usuario }        los tokens; nunca la contraseña
 *   lab-cuenta-v1    seudónimo de la cuenta dueña de lab-v1 y de la cola (si falta, lab-v1 es del modo demostración)
 *   lab-subido-v1    { alumno, t, est }   t: último evento subido; est: huella del último est sincronizado
 *   lab-pendiente-v1 { [alumno]: { est, eventos } }   lo que no se pudo subir al cerrar sesión: se sube cuando esa
 *                    cuenta vuelve a entrar en este navegador
 *   lab-demo-v1      { est, eventos }      el modo demostración guardado aparte mientras hay una cuenta
 * El estado del alumno sigue en lab-v1 y la cola de eventos en lab-medicion-v1 (nucleo/medicion.js).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Sesion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const K = { sesion: 'lab-sesion-v1', cuenta: 'lab-cuenta-v1', subido: 'lab-subido-v1', pendiente: 'lab-pendiente-v1',
    demo: 'lab-demo-v1', est: 'lab-v1', eventos: 'lab-medicion-v1' };
  const TANDA = 500, CADA = 30000, ESPERA_MIN = 2000, ESPERA_MAX = 300000;
  const CONTADORES = ['hechos', 'aciertos', 'nose', 'textos', 'preguntas', 'previos', 'previosBien'];
  const UNICAS = ['entrada', 'salida', 'orden'];
  const DEL_CLIENTE = ['uni', 'grado', 'tema', 'nombre'];

  const esObj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  // JSON con las claves ordenadas: dos est iguales dan la misma huella aunque sus claves vengan en otro orden.
  const estable = x => Array.isArray(x) ? '[' + x.map(estable).join(',') + ']'
    : esObj(x) ? '{' + Object.keys(x).sort().filter(k => x[k] !== undefined).map(k => JSON.stringify(k) + ':' + estable(x[k])).join(',') + '}'
    : JSON.stringify(x === undefined ? null : x);
  const copia = x => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));

  // ---------- Unión de est (las reglas de PUT /api/estado) ----------
  const nResp = ec => (ec ? (ec.respuestas || ec.resp || []).length : -1);
  function unirEnCurso(s, c, unido) {
    let ec = s.enCurso && c.enCurso ? (nResp(s.enCurso) > nResp(c.enCurso) ? s.enCurso : c.enCurso) : (s.enCurso || c.enCurso);
    // Una prueba a medio hacer de una fase que ya terminó (en cualquiera de los dos lados) ya no sirve: se descarta.
    if (ec && ec.fase && unido[ec.fase]) ec = undefined;
    return ec;
  }
  // practica[id] o pruebas[curso]: entrada, salida y orden no se pisan (gana el servidor), contadores al máximo.
  function unirFicha(s, c) {
    s = esObj(s) ? s : {}; c = esObj(c) ? c : {};
    const u = Object.assign({}, copia(s), copia(c));
    for (const k of CONTADORES) {
      if (esObj(s[k]) || esObj(c[k])) {
        const a = esObj(s[k]) ? s[k] : {}, b = esObj(c[k]) ? c[k] : {};
        u[k] = {};
        for (const x of new Set([...Object.keys(a), ...Object.keys(b)])) u[k][x] = Math.max(Number(a[x]) || 0, Number(b[x]) || 0);
      } else if (k in s || k in c) u[k] = Math.max(Number(s[k]) || 0, Number(c[k]) || 0);
    }
    for (const k of UNICAS) if (s[k] !== undefined && s[k] !== null) u[k] = copia(s[k]);
    const ec = unirEnCurso(s, c, u);
    if (ec) u.enCurso = copia(ec); else delete u.enCurso;
    return u;
  }
  function unirMapa(s, c) {
    const u = {};
    for (const k of new Set([...Object.keys(s || {}), ...Object.keys(c || {})])) u[k] = unirFicha((s || {})[k], (c || {})[k]);
    return u;
  }
  // Cola de repaso (nucleo/repaso.js, misma regla que Repaso.unir y servidor/app/union.py): por unidad gana la ficha
  // con más hechos; si empatan, la de ultimo más reciente; si también, la del cliente. desde: la fecha más antigua.
  function unirRepaso(s, c) {
    s = esObj(s) ? s : {}; c = esObj(c) ? c : {};
    const u = {};
    for (const k of new Set([...Object.keys(s), ...Object.keys(c)])) {
      const a = esObj(s[k]) ? s[k] : null, b = esObj(c[k]) ? c[k] : null;
      if (!a || !b) { u[k] = copia(b || a); continue; }
      const ha = Number(a.hechos) || 0, hb = Number(b.hechos) || 0;
      const f = copia(ha > hb || (ha === hb && String(a.ultimo || '') > String(b.ultimo || '')) ? a : b);
      const ds = [a.desde, b.desde].filter(x => typeof x === 'string' && x).sort();
      if (ds.length) f.desde = ds[0];
      u[k] = f;
    }
    return u;
  }
  // servidor y cliente son dos est; la respuesta es otro objeto (no toca los de entrada).
  function unirEst(servidor, cliente) {
    const s = esObj(servidor) ? servidor : {}, c = esObj(cliente) ? cliente : {};
    const u = Object.assign({}, copia(s), copia(c));
    for (const k of DEL_CLIENTE) u[k] = c[k] ? c[k] : (s[k] !== undefined ? s[k] : c[k]);
    u.practica = unirMapa(s.practica, c.practica);
    u.pruebas = unirMapa(s.pruebas, c.pruebas);
    u.vistas = {};
    for (const k of new Set([...Object.keys(s.vistas || {}), ...Object.keys(c.vistas || {})])) {
      const a = (s.vistas || {})[k], b = (c.vistas || {})[k];
      u.vistas[k] = a && b ? (String(a) < String(b) ? a : b) : (a || b);
    }
    u.dias = [...new Set([...(s.dias || []), ...(c.dias || [])])].sort();
    if (s.repaso || c.repaso) u.repaso = unirRepaso(s.repaso, c.repaso);
    if (s.alumno) u.alumno = s.alumno;
    return u;
  }

  // Copia fuente sobre destino sin reemplazar los objetos que no cambian: las pantallas abiertas guardan referencias
  // a est.practica[id] o a est.pruebas[curso].enCurso, y siguen escribiendo en ellas.
  function aplicarEnSitio(destino, fuente) {
    for (const k of Object.keys(fuente)) {
      const a = destino[k], b = fuente[k];
      if (esObj(a) && esObj(b)) aplicarEnSitio(a, b);
      else if (estable(a) !== estable(b)) destino[k] = copia(b);
    }
    return destino;
  }

  // ---------- Errores ----------
  class ErrorApi extends Error {
    constructor(codigo, mensaje, estado) { super(mensaje || codigo); this.codigo = codigo; this.estado = estado || 0; }
  }
  const MENSAJES = {
    'sin-conexion': 'No hay conexión con el servidor. Revisa tu internet e inténtalo otra vez.',
    'sesion-vencida': 'Tu sesión venció. Vuelve a entrar con tu usuario y tu contraseña.',
    'servidor': 'El servidor tuvo un problema. Inténtalo otra vez en un rato.',
  };

  function crear(op = {}) {
    const base = String(op.api || '').replace(/\/+$/, '');
    const pedirRed = op.fetch || (typeof fetch === 'function' ? (...a) => fetch(...a) : null);
    const alm = op.almacen || (typeof localStorage !== 'undefined' ? localStorage : null);
    const ahora = op.ahora || (() => Date.now());
    // Envueltos: en el navegador, setTimeout llamado como método de otro objeto da «Illegal invocation».
    const reloj = op.reloj || { setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: t => clearTimeout(t),
      setInterval: (f, ms) => setInterval(f, ms), clearInterval: t => clearInterval(t) };
    const leer = (k, d) => { try { const v = alm.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
    const escribir = (k, v) => { try { if (v === undefined || v === null) alm.removeItem(k); else alm.setItem(k, JSON.stringify(v)); } catch { /* sin espacio */ } };
    const oyentes = new Set();
    let info = { estado: 'guardado', pendientes: 0 };
    let renovando = null, sincronizando = null, fallos = 0, reintento = null, intervalo = null, desarmar = null;

    const sesion = () => leer(K.sesion, null);
    const usuario = () => (sesion() || {}).usuario || null;
    const activa = () => !!(sesion() || {}).renovacion;
    const seudonimo = () => (usuario() || {}).alumno || '';
    const esAlumno = () => (usuario() || {}).rol === 'alumno';
    // Con debe_cambiar, el servidor responde 403 debe-cambiar a todo menos PUT /api/contrasena: no se sincroniza.
    const listo = () => esAlumno() && !(usuario() || {}).debe_cambiar;

    function avisar(cambio) {
      info = Object.assign({}, info, cambio, { pendientes: pendientes() });
      for (const f of oyentes) try { f(info); } catch { /* un oyente roto no frena la sincronización */ }
    }
    // El usuario de la respuesta no trae el nombre de usuario (con el que se entra): se guarda el que se escribió.
    // Al renovar se conserva lo que ya se sabía de la cuenta; al entrar, no (puede ser otra persona).
    function guardarTokens(r, nuevo = false) {
      const u = Object.assign({}, nuevo ? {} : usuario() || {}, r.usuario || {});
      escribir(K.sesion, { acceso: r.acceso, renovacion: r.renovacion, expira: ahora() + 1000 * (Number(r.expira_en) || 900), usuario: u });
    }

    // ---------- Pedidos ----------
    async function red(metodo, ruta, cuerpo, acceso) {
      const h = {};
      if (acceso) h.Authorization = 'Bearer ' + acceso;
      let body;
      if (cuerpo !== undefined) {
        if (typeof FormData !== 'undefined' && cuerpo instanceof FormData) body = cuerpo;
        else { h['Content-Type'] = 'application/json'; body = JSON.stringify(cuerpo); }
      }
      try { return await pedirRed(base + ruta, { method: metodo, headers: h, body }); } catch { throw new ErrorApi('sin-conexion', MENSAJES['sin-conexion']); }
    }
    async function errorDe(r) {
      let d = {}; try { d = await r.json(); } catch { /* sin cuerpo */ }
      const codigo = d.error || (r.status >= 500 ? 'servidor' : 'error-' + r.status);
      return new ErrorApi(codigo, d.mensaje || MENSAJES[codigo] || MENSAJES.servidor, r.status);
    }
    async function json(r) { if (r.status === 204) return null; const t = await r.text(); return t ? JSON.parse(t) : null; }

    // Renovación: una sola a la vez. Si el servidor la rechaza, la sesión venció: se quitan los tokens pero se
    // conservan el estado y la cola (la cuenta sigue en lab-cuenta-v1, y lo pendiente sube al volver a entrar).
    function renovar() {
      if (renovando) return renovando;
      renovando = (async () => {
        const s = sesion();
        if (!s || !s.renovacion) throw new ErrorApi('sesion-vencida', MENSAJES['sesion-vencida'], 401);
        const r = await red('POST', '/api/renovar', { renovacion: s.renovacion });
        if (r.status === 401 || r.status === 403) {
          escribir(K.sesion, { usuario: s.usuario, vencida: true });
          avisar({ estado: 'vencida' });
          throw new ErrorApi('sesion-vencida', MENSAJES['sesion-vencida'], 401);
        }
        if (!r.ok) throw await errorDe(r);
        guardarTokens(await json(r));
      })().finally(() => { renovando = null; });
      return renovando;
    }

    // Pedido con el token de acceso. Si está por vencer se renueva antes; si el servidor responde 401, se renueva
    // y se repite una vez. crudo: devuelve la Response (para el PDF).
    async function pedir(metodo, ruta, cuerpo, { crudo = false } = {}) {
      let s = sesion();
      if (!s || !s.renovacion) throw new ErrorApi('sesion-vencida', MENSAJES['sesion-vencida'], 401);
      if (!s.acceso || ahora() > (s.expira || 0) - 15000) { await renovar(); s = sesion(); }
      let r = await red(metodo, ruta, cuerpo, s.acceso);
      if (r.status === 401) { await renovar(); r = await red(metodo, ruta, cuerpo, sesion().acceso); }
      if (!r.ok) {
        const e = await errorDe(r);
        if (e.codigo === 'debe-cambiar') {
          const x = sesion(); if (x && x.usuario) { x.usuario.debe_cambiar = true; escribir(K.sesion, x); }
          avisar({ estado: 'debe-cambiar' });
        }
        throw e;
      }
      return crudo ? r : json(r);
    }

    // ---------- Datos locales ----------
    const leerEst = () => leer(K.est, {}) || {};
    const leerEventos = () => leer(K.eventos, []) || [];
    const subido = () => { const s = leer(K.subido, null); return s && s.alumno === seudonimo() ? s : { alumno: seudonimo(), t: '', est: '' }; };
    const pendientesEventos = () => { const a = seudonimo(), t = subido().t; return a ? leerEventos().filter(e => e.alumno === a && String(e.t) > t) : []; };
    const estSucio = () => !!seudonimo() && estable(leerEst()) !== subido().est;
    function pendientes() { if (!seudonimo()) return 0; return pendientesEventos().length + (estSucio() ? 1 : 0); }
    // Aplica un est ya unido: con op.alEstado, la app lo copia en su objeto (en sitio) y lo guarda; si no, va directo al almacén.
    function ponerEst(e) { if (op.alEstado) op.alEstado(e); else escribir(K.est, e); }

    function conHabilitaciones(e, hab) {
      if (hab) {
        e.salidaHabilitada = [...new Set(hab.salida || [])];
        e.solucionesHabilitadas = [...new Set(hab.soluciones || [])];
      }
      return e;
    }

    // ---------- Login y salida ----------
    // Al entrar: el modo demostración se guarda aparte (vuelve al cerrar sesión); si lab-v1 era de otra cuenta
    // (sesión vencida sin cerrar), lo de esa cuenta pasa a lab-pendiente-v1; si era de esta misma cuenta, se sigue.
    async function login(nombreUsuario, contrasena) {
      const r = await red('POST', '/api/login', { usuario: String(nombreUsuario || '').trim(), contrasena: String(contrasena || '') });
      if (!r.ok) throw await errorDe(r);
      const d = await json(r);
      const u = d.usuario || {};
      const previa = leer(K.cuenta, null);
      if (u.rol === 'alumno' && u.alumno) {
        if (!previa) escribir(K.demo, { est: leerEst(), eventos: leerEventos() });
        else if (previa !== u.alumno) apartar(previa);
        if (previa !== u.alumno) { escribir(K.est, { tema: leerEst().tema || '' }); escribir(K.eventos, []); escribir(K.subido, null); }
        escribir(K.cuenta, u.alumno);
      }
      if (!u.usuario) u.usuario = String(nombreUsuario || '').trim();
      guardarTokens(d, true);
      if (u.rol === 'alumno' && u.alumno) {
        // Lo que esta cuenta dejó pendiente en este navegador vuelve a la cola.
        const pend = leer(K.pendiente, {}) || {};
        if (pend[u.alumno]) {
          const p = pend[u.alumno];
          const ya = new Set(leerEventos().map(e => e.t));
          escribir(K.eventos, [...leerEventos(), ...(p.eventos || []).filter(e => !ya.has(e.t))].sort((a, b) => String(a.t).localeCompare(String(b.t))));
          escribir(K.est, unirEst(leerEst(), p.est || {}));
          delete pend[u.alumno]; escribir(K.pendiente, Object.keys(pend).length ? pend : null);
        }
        const local = leerEst();
        try {
          // Con debe_cambiar no se puede pedir el estado: llega después de cambiar la contraseña.
          if (u.debe_cambiar) throw new ErrorApi('debe-cambiar', '', 403);
          const g = await pedir('GET', '/api/estado');
          const e = conHabilitaciones(unirEst(Object.assign({}, g.est || {}, { alumno: u.alumno }), local), g.habilitaciones);
          e.alumno = u.alumno;
          if (!e.nombre && u.nombre) e.nombre = u.nombre;
          ponerEst(e);
        } catch (e) {
          // Sin el estado del servidor se trabaja con lo local; la sincronización lo trae después.
          const l = Object.assign(local, { alumno: u.alumno }); if (!l.nombre && u.nombre) l.nombre = u.nombre; ponerEst(l);
        }
      }
      avisar({ estado: pendientes() ? 'pendiente' : 'guardado' });
      return u;
    }
    function apartar(alumno) {
      const pend = leer(K.pendiente, {}) || {};
      const ev = leerEventos().filter(e => e.alumno === alumno && String(e.t) > ((leer(K.subido, {}) || {}).alumno === alumno ? leer(K.subido, {}).t : ''));
      pend[alumno] = { est: leerEst(), eventos: ev };
      escribir(K.pendiente, pend);
    }

    async function cambiarContrasena(actual, nueva) {
      await pedir('PUT', '/api/contrasena', { actual, nueva });
      const s = sesion(); if (s && s.usuario) { s.usuario.debe_cambiar = false; escribir(K.sesion, s); }
      // Recién ahora el servidor deja leer el estado del alumno.
      if (esAlumno()) await sincronizar();
      return true;
    }

    // Cerrar sesión: sube lo pendiente; si no pudo y no se fuerza, avisa (ok: false) y no borra nada. Si se fuerza,
    // lo pendiente queda en lab-pendiente-v1. Después revoca la renovación, borra tokens, estado y cola, y vuelve
    // a poner el modo demostración que había antes de entrar.
    async function salir({ forzar = false } = {}) {
      const alumno = seudonimo();
      if (alumno && pendientes()) {
        // Con la contraseña sin cambiar no se puede subir nada: lo pendiente se aparta sin preguntar.
        if (listo()) await sincronizar().catch(() => {});
        if (pendientes() && !forzar && listo()) return { ok: false, pendientes: pendientes() };
        if (pendientes()) apartar(alumno);
      }
      const s = sesion();
      if (s && s.renovacion) await red('POST', '/api/salir', { renovacion: s.renovacion }, s.acceso).catch(() => {});
      parar();
      const demo = leer(K.demo, null);
      escribir(K.sesion, null); escribir(K.cuenta, null); escribir(K.subido, null); escribir(K.demo, null);
      if (alumno || demo) {
        escribir(K.est, demo ? demo.est : null);
        escribir(K.eventos, demo ? demo.eventos : null);
      }
      fallos = 0; avisar({ estado: 'guardado' });
      return { ok: true };
    }

    // ---------- Sincronización ----------
    // 1. La cola en tandas de 500: después de cada tanda se anota el último t subido (si se corta, sigue de ahí;
    //    reenviar no duplica, porque el servidor es idempotente por alumno + t).
    // 2. Si est cambió desde la última vez, PUT /api/estado. 3. GET /api/estado: est del servidor y habilitaciones,
    //    unidos con el est local de ese momento (lo que el alumno hizo mientras tanto no se pierde).
    function sincronizar() {
      if (sincronizando) return sincronizando;
      sincronizando = (async () => {
        if (!activa() || !listo() || !seudonimo()) return { ok: false, pendientes: pendientes() };
        avisar({ estado: 'subiendo' });
        try {
          for (;;) {
            const p = pendientesEventos();
            if (!p.length) break;
            const tanda = p.slice(0, TANDA);
            await pedir('POST', '/api/eventos', { eventos: tanda });
            escribir(K.subido, Object.assign(subido(), { t: String(tanda[tanda.length - 1].t) }));
          }
          if (estSucio()) await pedir('PUT', '/api/estado', { est: leerEst() });
          const g = await pedir('GET', '/api/estado');
          const e = conHabilitaciones(unirEst(Object.assign({}, g.est || {}, { alumno: seudonimo() }), leerEst()), g.habilitaciones);
          e.alumno = seudonimo();
          ponerEst(e);
          // Si el alumno cambió algo durante el pedido, la huella ya no coincide y el próximo turno lo sube.
          escribir(K.subido, Object.assign(subido(), { est: estable(e) }));
          if (estSucio()) await pedir('PUT', '/api/estado', { est: leerEst() }).then(() => escribir(K.subido, Object.assign(subido(), { est: estable(leerEst()) })));
          fallos = 0;
          if (reintento) { reloj.clearTimeout(reintento); reintento = null; }
          avisar({ estado: pendientes() ? 'pendiente' : 'guardado' });
          return { ok: true, pendientes: pendientes() };
        } catch (err) {
          if (err.codigo === 'sesion-vencida') { avisar({ estado: 'vencida' }); return { ok: false, pendientes: pendientes(), error: err }; }
          fallos++;
          programarReintento();
          avisar({ estado: err.codigo === 'sin-conexion' ? 'sin-conexion' : 'pendiente', error: err.mensaje });
          return { ok: false, pendientes: pendientes(), error: err };
        }
      })().finally(() => { sincronizando = null; });
      return sincronizando;
    }
    // Espera creciente: 2, 4, 8… segundos hasta 5 minutos.
    const espera = n => Math.min(ESPERA_MAX, ESPERA_MIN * 2 ** Math.max(0, n - 1));
    function programarReintento() {
      if (reintento) reloj.clearTimeout(reintento);
      reintento = reloj.setTimeout(() => { reintento = null; sincronizar(); }, espera(fallos));
    }

    // Arranca la sincronización automática: cada 30 s, al volver la señal (online) y al pasar a segundo plano.
    // ventana: window (o un objeto con addEventListener) y doc: document (para visibilityState).
    function arrancar({ ventana, doc } = {}) {
      parar();
      if (!activa() || !esAlumno()) return;
      // Cada turno sube lo pendiente y baja las habilitaciones que abrió el profesor.
      intervalo = reloj.setInterval(() => sincronizar(), CADA);
      const enLinea = () => { fallos = 0; sincronizar(); };
      const visible = () => { if (!doc || doc.visibilityState === 'hidden') sincronizar(); };
      if (ventana && ventana.addEventListener) {
        ventana.addEventListener('online', enLinea);
        (doc || ventana).addEventListener('visibilitychange', visible);
        ventana.addEventListener('pagehide', visible);
      }
      desarmar = () => {
        if (ventana && ventana.removeEventListener) {
          ventana.removeEventListener('online', enLinea);
          (doc || ventana).removeEventListener('visibilitychange', visible);
          ventana.removeEventListener('pagehide', visible);
        }
      };
      sincronizar();
    }
    // Después de un cambio local: sincroniza en unos segundos (varios cambios seguidos dan un solo turno). Si hay un
    // reintento esperando por un fallo, se respeta su espera.
    let prontoT = null;
    function pronto(ms = 3000) {
      if (!activa() || !listo() || reintento || prontoT) return;
      prontoT = reloj.setTimeout(() => { prontoT = null; sincronizar(); }, ms);
    }
    function parar() {
      if (prontoT) { reloj.clearTimeout(prontoT); prontoT = null; }
      if (intervalo) reloj.clearInterval(intervalo);
      if (reintento) reloj.clearTimeout(reintento);
      intervalo = reintento = null;
      if (desarmar) { desarmar(); desarmar = null; }
    }

    return {
      activa, usuario, seudonimo, login, salir, cambiarContrasena, pedir, renovar, sincronizar, pronto, arrancar, parar, pendientes,
      vencida: () => !!(sesion() || {}).vencida,
      info: () => Object.assign({}, info, { pendientes: pendientes() }),
      alCambiar: f => { oyentes.add(f); return () => oyentes.delete(f); },
      espera,
    };
  }

  return { crear, unirEst, aplicarEnSitio, estable, ErrorApi, CLAVES: K, TANDA };
});
