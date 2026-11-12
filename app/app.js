// Laboratorio de Admisión: la app (cáscara PWA).
// Lee el catálogo (datos/catalogo.json, armado desde catalogo/) y nunca tiene cursos escritos
// en el código. El progreso del alumno se guarda en el celular con el id de cada unidad.
(() => {
'use strict';
const $app = document.getElementById('app');
const $nav = document.getElementById('nav');
const CLAVE = 'lab-v1';
const AREA_TXT = { ciencias: 'Ciencias', matematica: 'Matemática', razonamiento: 'Razonamiento', letras: 'Letras' };
const FORMATO_TXT = { escena: 'Escenas', predicciones: 'Predicciones', lectura: 'Lectura' };
const UNI_CORTA = { uni: 'UNI', unmsm: 'San Marcos', una: 'UNA Puno' };
const UNI_SIGLA = { uni: 'UNI', unmsm: 'SM', una: 'UNA' };
const textoDias = n => `${n} ${n === 1 ? 'día seguido' : 'días seguidos'}`;
let cat = null, pruebas = null, instalar = null, offlineListo = false;
const VERSION_APP = '0.6.0';
const GRADOS = [['3', '3.º de secundaria'], ['4', '4.º de secundaria'], ['5', '5.º de secundaria'], ['egresado', 'Ya terminé el colegio']];

// ---------- Datos del alumno (en el celular) ----------
function cargarEstado() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { return {}; }
}
const BASE_EST = () => ({ nombre: '', uni: '', grado: '', colegio: '', alumno: '', vistas: {}, dias: [], tema: '', practica: {}, pruebas: {}, salidaHabilitada: [], solucionesHabilitadas: [] });
let est = Object.assign(BASE_EST(), cargarEstado());
// ---------- Cuentas (docs/cuentas.md, fase C2) ----------
// Con window.MESA_API (app/config.js) hay servidor: el alumno entra con usuario y contraseña, y nucleo/sesion.js sube
// la cola de eventos y su est. Sin servidor, o si elige «Probar sin cuenta», la app queda en modo demostración.
const API = String(window.MESA_API || '').trim();
let cambiandoCuenta = false;
const ses = API && window.Sesion ? Sesion.crear({ api: API, alEstado: e => {
  if (cambiandoCuenta) { try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* sin almacenamiento */ } return; }
  Sesion.aplicarEnSitio(est, e); guardar();
} }) : null;
const cuenta = () => (ses && ses.activa() ? ses.usuario() : null);
const esAlumnoCuenta = () => (cuenta() || {}).rol === 'alumno';
const demoElegido = () => sessionStorage.getItem('lab-demo') === '1';
// Identificador anónimo del dispositivo: la medición nunca guarda nombres. Con cuenta, es el seudónimo del servidor.
const idNuevo = () => 'a' + Array.from(crypto.getRandomValues(new Uint8Array(5)), b => b.toString(16).padStart(2, '0')).join('');
if (esAlumnoCuenta()) est.alumno = ses.seudonimo();
if (!est.alumno) est.alumno = idNuevo();
// Código del colegio: llega en el enlace que reparte el profesor (…/app/?colegio=ABC). Con cuenta, el colegio es el de la cuenta.
{ const c = new URLSearchParams(location.search).get('colegio'); if (c && !esAlumnoCuenta()) est.colegio = c.trim().toUpperCase().slice(0, 20); }
// El servidor manda el colegio como { id, nombre }; en la medición va su id.
function colegioId(c) { return c && typeof c === 'object' ? String(c.id ?? '') : String(c || ''); }
if (esAlumnoCuenta()) est.colegio = colegioId(cuenta().colegio) || est.colegio || '';
// Solo el profesor abre la prueba de salida y la revisión de soluciones, con el enlace que reparte en clase:
// …/app/?salida=fisica,quimica (o ?salida=todas) y …/app/?soluciones=fisica (o =todas). Queda guardado en este
// navegador, también si cambia el alumno. No hay servidor ni clave: el control es que el enlace lo da el profesor.
// Con cuenta, lo abre el profesor desde su panel (por sección) y llega con la sincronización: los enlaces no cuentan.
const habilitacionesNuevas = [];
for (const [param, campo] of esAlumnoCuenta() ? [] : [['salida', 'salidaHabilitada'], ['soluciones', 'solucionesHabilitadas']]) {
  const v = new URLSearchParams(location.search).get(param);
  if (!v) continue;
  const lista = v.toLowerCase().split(',').map(x => x.trim()).filter(x => /^[a-z0-9-]+$/.test(x));
  const antes = new Set(est[campo] || []);
  for (const c of lista) if (!antes.has(c)) habilitacionesNuevas.push({ que: param, curso: c });
  est[campo] = [...new Set([...antes, ...lista])];
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(est)); } catch { /* sin almacenamiento: la app sigue */ }
  if (ses && !cambiandoCuenta && esAlumnoCuenta()) { ses.pronto(); actualizarSync(); }
}
const hoy = () => new Date().toLocaleDateString('en-CA');
// ---------- Medición (anónima; ver nucleo/medicion.js) ----------
const eventos = () => Medicion.eventosGuardados();
const registrar = ev => { const r = Medicion.guardar(ev, VERSION_APP, est); if (ses && esAlumnoCuenta()) { ses.pronto(); actualizarSync(); } return r; };
// Quién habilitó qué: cada habilitación nueva queda en la medición (origen: el enlace del profesor).
for (const h of habilitacionesNuevas) registrar({ tipo: 'habilitacion', que: h.que, curso: h.curso, origen: 'profesor' });
// Registros todavía sin descargar (de cualquier alumno de este navegador): desde la última descarga.
const CLAVE_EXPORTADO = 'lab-exportado-v1';
const sinExportar = () => { const t = localStorage.getItem(CLAVE_EXPORTADO) || ''; return eventos().filter(e => String(e.t) > t).length; };
function exportar(formato) {
  const ev = eventos(), archivo = `laboratorio-${est.colegio || 'sin-colegio'}-${est.alumno}-${new Date().toLocaleDateString('en-CA')}`;
  if (formato === 'csv') descargar(archivo + '.csv', Medicion.aCSV(ev), 'text/csv');
  else descargar(archivo + '.json', JSON.stringify(ev), 'application/json');
  // Solo el JSON cuenta como descargado: es lo que lee herramientas/analizar-medicion.js. El CSV es para mirar en una hoja de cálculo.
  if (ev.length && formato !== 'csv') try { localStorage.setItem(CLAVE_EXPORTADO, String(ev[ev.length - 1].t)); } catch { /* sin almacenamiento */ }
}
function descargar(nombre, contenido, tipo) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement('a'); a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function marcarDia() { if (!est.dias.includes(hoy())) { est.dias.push(hoy()); est.dias = est.dias.slice(-400); guardar(); } }
function racha() {
  const s = new Set(est.dias); let n = 0; const d = new Date();
  if (!s.has(d.toLocaleDateString('en-CA'))) d.setDate(d.getDate() - 1); // la racha sigue viva hasta el final del día
  while (s.has(d.toLocaleDateString('en-CA'))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function aplicarTema() { if (est.tema) document.documentElement.dataset.theme = est.tema; else delete document.documentElement.dataset.theme; }

// ---------- Catálogo ----------
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const unidadesDe = (c, uni) => c.unidades.filter(u => !uni || u.universidades[uni]);
const ubic = (u, uni) => { const k = cat.universidades[uni]?.ubicacion; return k && u.universidades[uni] ? u.universidades[uni][k] : null; };
const etiquetaUbic = (u, k) => { const v = ubic(u, k); if (!v) return ''; const pal = cat.universidades[k].ubicacion === 'semanas' ? 'sem.' : 'tema';
  return `${UNI_CORTA[k] || k} · ${pal} ${v.length > 2 ? `${v[0]}–${v[v.length - 1]}` : v.join(', ')}`; };
const visto = id => !!est.vistas[id];
const cursoDeUnidad = id => cat.cursos.find(c => c.unidades.some(u => u.id === id));
// Módulo de lectura del curso con prueba de entrada y salida propias (razonamiento verbal: textos t000a y t000b).
// Sus pruebas siguen las reglas de las demás: la entrada va al entrar al curso y la salida la abre el profesor (?salida=).
const lecturaConPrueba = c => c && Object.values(cat.plantillas).find(p => p.formato === 'lectura' && p.entrada && p.salida
  && c.unidades.some(u => u.plantillas.includes(p.id)));
const lecturaSt = p => (est.practica || {})[p.id] || {};
const ctxPrueba = () => ({ $app, cat, est, esc, guardar, registrar, marcarDia, pruebas });
// ¿El profesor abrió la salida de este curso en este navegador? (lo mismo que PruebaCurso.habilitada, que el inicio
// necesita antes de que lleguen prueba.js y el banco de pruebas).
const salidaAbierta = curso => (est.salidaHabilitada || []).some(x => x === curso || x === 'todas');
// Las escenas abren su propia página (con botón para volver); las predicciones y la lectura van dentro de la app.
// La lectura recibe además la unidad, para mostrar solo los textos que la tocan.
const enlace = (p, unidad) => p.formato === 'escena' ? `${p.url}?desde=app` : p.formato === 'lectura' && unidad ? `${p.url}/${encodeURIComponent(unidad)}` : p.url;
const VERBO = { escena: 'Abrir escena', predicciones: 'Practicar', lectura: 'Leer' };
const ETIQUETA = { escena: 'Escena', predicciones: 'Práctica', lectura: 'Lectura' };
function avance(c, uni) { const us = unidadesDe(c, uni); return us.length ? us.filter(u => visto(u.id)).length / us.length : 0; }
// Grado: una unidad de un grado mayor al del alumno es un "adelanto". No se oculta, pero va al final.
const adelanto = u => u.grado > (Number(est.grado) || 99);
const tagAdelanto = u => adelanto(u) ? `<span class="tag gris" title="Normalmente se ve en ${u.grado}.º de secundaria">Adelanto · ${u.grado}.º</span>` : '';
// Orden de estudio: primero lo de su grado; dentro, el cronograma de su universidad (semana o tema), intercalando cursos.
function cola(uni) {
  const todas = [];
  cat.cursos.forEach((c, ci) => unidadesDe(c, uni).forEach(u => todas.push({ c, u, a: adelanto(u) ? 1 : 0, k: Math.min(...(ubic(u, uni) || [99])), ci })));
  return todas.sort((a, b) => a.a - b.a || a.k - b.k || a.ci - b.ci);
}

// ---------- Vistas ----------
const icono = id => Ilus.iconoCurso(id);

function vBienvenida() {
  $nav.hidden = true; document.body.dataset.ruta = 'bienvenida'; document.body.classList.remove('con-nav');
  const opc = Object.entries(cat.universidades).filter(([k]) => k !== 'una').map(([k, v]) =>
    `<button class="opcion${est.uni === k ? ' on' : ''}" data-uni="${k}"><span class="avatar" style="width:40px;height:40px;font-size:14px">${esc(UNI_SIGLA[k] || k)}</span><span><b>${esc(v.nombre)}</b><br><span class="sub">Ordenar todo según su temario</span></span></button>`).join('');
  $app.innerHTML = `<section class="bienvenida">
    <div class="hero">
      ${Ilus.escritorio('class="deco"')}
      <h1>Ve la física.<br>Entiende el examen.</h1>
      <p>Escenas que se mueven, predicciones antes de ver la respuesta y problemas para resolver en papel.</p>
    </div>
    ${esAlumnoCuenta() ? `<p class="sub" style="margin:0">Hola, <b>${esc(est.nombre || cuenta().nombre || '')}</b>. Antes de empezar, dos preguntas.</p>`
      : `<label class="sub" for="nombre">¿Cómo te llamas?</label>
    <input type="text" id="nombre" autocomplete="given-name" maxlength="30" placeholder="Tu nombre" value="${esc(est.nombre)}">`}
    <span class="sub">¿A qué universidad postulas?</span>
    <div class="opciones">${opc}</div>
    <span class="sub">¿En qué grado estás?</span>
    <div class="chips" style="margin:0">${GRADOS.map(([k, t]) => `<button class="chip${est.grado === k ? ' on' : ''}" data-grado="${k}">${esc(t)}</button>`).join('')}</div>
    <button class="btn acento ancho" id="empezar"${est.uni && est.grado ? '' : ' disabled'}>Empezar</button>
    <span class="sub" style="text-align:center">${esAlumnoCuenta() ? 'Tu avance se guarda en tu cuenta. Funciona sin internet y se sube cuando vuelve la señal.' : 'Tu avance se guarda en este celular. Funciona sin internet.'}</span>
  </section>`;
  $app.querySelectorAll('[data-uni]').forEach(b => b.onclick = () => {
    est.uni = b.dataset.uni; $app.querySelectorAll('[data-uni]').forEach(x => x.classList.toggle('on', x === b));
    document.getElementById('empezar').disabled = !(est.uni && est.grado);
  });
  $app.querySelectorAll('[data-grado]').forEach(b => b.onclick = () => {
    est.grado = b.dataset.grado; $app.querySelectorAll('[data-grado]').forEach(x => x.classList.toggle('on', x === b));
    document.getElementById('empezar').disabled = !(est.uni && est.grado);
  });
  document.getElementById('empezar').onclick = () => {
    const n = document.getElementById('nombre'); if (n) est.nombre = n.value.trim();
    guardar(); marcarDia(); location.hash = '#/inicio';
  };
}

// Avisos de «tu profesor abrió la salida» del inicio. Los de las pruebas por curso aparecen cuando llega el banco
// (se carga después del primer pintado); los de la lectura no dependen de él.
function avisosSalida() {
  const salidas = pruebas ? cat.cursos.filter(c => pruebas.cursos[c.id] && salidaAbierta(c.id) && est.pruebas[c.id] && est.pruebas[c.id].entrada && !est.pruebas[c.id].salida)
    .map(c => ({ c, href: `#/prueba/${c.id}/salida` })) : [];
  for (const c of cat.cursos) {
    const p = lecturaConPrueba(c);
    if (p && salidaAbierta(c.id) && lecturaSt(p).entrada && !lecturaSt(p).salida) salidas.push({ c, href: `${p.url}/salida` });
  }
  return salidas;
}

function vInicio() {
  const q = cola(est.uni), pend = q.filter(x => !visto(x.u.id));
  const conEscena = pend.find(x => !x.a && x.u.plantillas.length) || pend[0];
  const totalU = q.length, hechas = q.length - pend.length;
  const reto = conEscena ? `<div class="reto tinte" style="${Ilus.tinte(conEscena.c.id)}">${Ilus.viñeta(conEscena.c.id, 'class="reto-vineta vineta-flota"')}${Ilus.gato('class="reto-gato-mini"')}
      <div class="etq">Reto de hoy · ${esc(conEscena.c.nombre)}</div>
      <h3>${esc(conEscena.u.nombre)}</h3>
      <p>${conEscena.u.plantillas.length ? 'Predice antes de ver la respuesta.' : esc(conEscena.u.temas.slice(0, 3).join(' · '))}</p>
      ${conEscena.u.plantillas.length
        ? `<a class="btn tinta" href="${esc(enlace(cat.plantillas[conEscena.u.plantillas[0]], conEscena.u.id))}" data-abrir="${esc(conEscena.u.id)}">${VERBO[cat.plantillas[conEscena.u.plantillas[0]].formato] || 'Abrir'} ›</a>`
        : `<a class="btn tinta" href="#/curso/${esc(conEscena.c.id)}">Ver unidad ›</a>`}
    </div>` : `<div class="reto">${Ilus.gatoDormido('class="reto-gato"')}<h3>¡Terminaste todo el temario!</h3><p>Repasa lo que más te costó.</p></div>`;
  // Lo que sigue: solo unidades con módulo (las demás no tienen nada que abrir todavía), una por curso primero
  // para que no salgan cuatro del mismo curso, y luego el resto en el orden del temario.
  const conModulo = pend.filter(x => x !== conEscena && cat.plantillas[x.u.plantillas[0]]);
  const cursosVistos = new Set(), primeras = conModulo.filter(x => !cursosVistos.has(x.c.id) && cursosVistos.add(x.c.id));
  const sig = [...primeras, ...conModulo.filter(x => !primeras.includes(x))].slice(0, 4).map(x => `<a class="item" style="${Ilus.tinte(x.c.id)}" href="${esc(enlace(cat.plantillas[x.u.plantillas[0]], x.u.id))}" data-abrir="${esc(x.u.id)}">${icono(x.c.id)}
      <span class="tx"><span class="t">${esc(x.u.nombre)}</span><br><span class="d">${esc(x.c.nombre)} · ${esc(etiquetaUbic(x.u, est.uni))}</span></span>
      <span class="ir">${tagAdelanto(x.u)}${esc(ETIQUETA[cat.plantillas[x.u.plantillas[0]].formato] || 'Abrir')} ›</span></a>`).join('');
  // Tus cursos: carrusel de pegatinas con la viñeta de cada curso.
  const carrusel = cat.cursos.filter(c => unidadesDe(c, est.uni).length).map(c => { const a = avance(c, est.uni);
    return `<a class="cursito tinte" style="${Ilus.tinte(c.id)}" href="#/curso/${esc(c.id)}">${Ilus.viñeta(c.id)}<span class="t">${esc(c.nombre)}</span>
      <span class="barra" aria-label="${Math.round(a * 100)} % estudiado"><i style="width:${Math.round(a * 100)}%"></i></span></a>`; }).join('');
  const salidas = avisosSalida();
  $app.innerHTML = `
    ${salidas.map(({ c, href }) => `<a class="aviso" style="display:block;text-decoration:none;margin-top:0" href="${esc(href)}">Tu profesor abrió la prueba de salida de ${esc(c.nombre)}. Hazla aquí ›</a>`).join('')}
    <header class="saludo"><span class="avatar">${esc((est.nombre || '?')[0].toUpperCase())}</span>
      <div><p class="sub">Hola${est.nombre ? `, ${esc(est.nombre)}` : ''} 👋</p><h1>¿Qué entendemos hoy?</h1></div>
      <span class="pildora-racha" title="Racha de estudio">${Ilus.mini.llama}${racha()}<span class="lector"> ${racha() === 1 ? 'día seguido' : 'días seguidos'}</span></span>
      ${esAlumnoCuenta() ? `${pildoraSync()}<a class="btn borde solo-grande" href="#/salir">Cerrar sesión</a>` : '<a class="btn borde solo-grande" href="#/otro">Otro alumno en esta PC</a>'}</header>
    <div class="col2 inicio"><div>
    ${reto}
    <h2>Hoy</h2>
    <div class="stats aparece">
      <div class="stat rosa"><div class="ic" style="background:#fff">${Ilus.mini.llama}</div><div class="n">${racha()}</div><div class="l">${racha() === 1 ? 'día seguido' : 'días seguidos'}</div></div>
      <div class="stat lav"><div class="ic" style="background:#fff">${Ilus.mini.libro}</div><div class="n">${hechas}</div><div class="l">unidades estudiadas</div></div>
      <div class="stat menta"><div class="ic" style="background:#fff">${Ilus.mini.meta}</div><div class="n">${totalU ? Math.round(100 * hechas / totalU) : 0}<span style="font-size:16px">%</span></div><div class="l">del temario ${esc(UNI_CORTA[est.uni] || '')}</div></div>
    </div>
    <h2>Lo que sigue</h2>
    <div class="lista aparece">${sig || `<div class="vacio">${Ilus.gatoDormido('width="140"')}<p>${pend.length > 1 ? 'Ya abriste todas las unidades con escena. El resto del temario está en Cursos.' : 'No hay más unidades pendientes.'}</p></div>`}</div></div><div>
    <h2>Tus cursos <a href="#/cursos">Ver todos ›</a></h2>
    <div class="carrusel aparece">${carrusel}</div></div></div>`;
}

function vCursos() {
  const tarjetas = cat.cursos.map(c => {
    const us = unidadesDe(c, est.uni); if (!us.length) return '';
    const p = avance(c, est.uni), escenas = us.filter(u => u.plantillas.length).length;
    return `<a class="curso tinte" style="${Ilus.tinte(c.id)}" href="#/curso/${esc(c.id)}">${Ilus.viñeta(c.id, 'class="vin"')}
      <span class="t">${esc(c.nombre)}</span>
      <span class="d">${us.length} unidades${escenas ? ` · ${escenas} con escena` : ''}</span>
      <span class="barra" aria-label="${Math.round(p * 100)} % estudiado"><i style="width:${Math.round(p * 100)}%"></i></span></a>`;
  }).join('');
  $app.innerHTML = `<h1>Cursos</h1><p class="sub">Ordenados según el temario de ${esc(cat.universidades[est.uni]?.nombre || '')}.</p>
    <div class="cursos aparece" style="margin-top:18px">${tarjetas}</div>`;
}

function vCurso(id) {
  const c = cat.cursos.find(x => x.id === id); if (!c) return ir('#/cursos');
  // La primera vez que entra a un curso con banco de pruebas, va primero la prueba de entrada.
  const PC = window.PruebaCurso;
  if (PC && PC.pideEntrada(ctxPrueba(), id) && !(est.pruebas[id] || {}).enCurso) { sessionStorage.setItem('prueba-auto-' + id, '1'); return ir(`#/prueba/${id}/entrada`); }
  // Curso de lectura: la entrada es el primer texto del módulo. Se lleva al alumno una vez por sesión, para que
  // el botón de volver deje ver el curso (al abrir cualquier unidad, la entrada vuelve a ir primero).
  const lec = lecturaConPrueba(c);
  if (lec && !lecturaSt(lec).entrada && sessionStorage.getItem('lectura-auto-' + id) !== '1') { sessionStorage.setItem('lectura-auto-' + id, '1'); return ir(lec.url); }
  const todas = sessionStorage.getItem('todas') === '1';
  const us = todas ? c.unidades : unidadesDe(c, est.uni);
  const ord = [...us].sort((a, b) => Math.min(...(ubic(a, est.uni) || [99])) - Math.min(...(ubic(b, est.uni) || [99])));
  const filas = ord.map((u, i) => {
    const pl = u.plantillas.map(p => cat.plantillas[p]).filter(Boolean);
    const tags = tagAdelanto(u) + Object.keys(u.universidades).map(k => `<span class="tag">${esc(etiquetaUbic(u, k))}</span>`).join('');
    return `<article class="unidad${visto(u.id) ? ' hecha' : ''}" style="${Ilus.tinte(c.id)}"><div class="fila">
        <span class="num" aria-hidden="true">${visto(u.id) ? '✓' : i + 1}</span><span class="t">${esc(u.nombre)}</span>
        <button class="check${visto(u.id) ? ' on' : ''}" data-ver="${esc(u.id)}" aria-pressed="${visto(u.id)}" aria-label="Marcar ${esc(u.nombre)} como estudiada">${visto(u.id) ? '✓' : ''}</button></div>
      <div class="temas">${esc(u.temas.join(' · '))}</div>
      <div class="acc">${tags}${pl.map(p => `<a class="btn morado" style="padding:8px 14px;font-size:14px" href="${esc(enlace(p, u.id))}" data-abrir="${esc(u.id)}">${esc(p.formato === 'lectura' ? VERBO.lectura : p.titulo)} ›</a>`
          + (p.papel ? `<a class="btn borde" style="padding:7px 14px;font-size:14px" href="#/papel/${esc(p.id)}">✎ Papel</a>` : '')).join('')}
        ${pl.length ? '' : '<span class="prep">Escena en preparación</span>'}</div></article>`;
  }).join('');
  const pc = Math.round(avance(c, todas ? '' : est.uni) * 100);
  $app.innerHTML = `<header class="curso-hero tinte" style="${Ilus.tinte(c.id)}">${Ilus.viñeta(c.id, 'class="vin vineta-flota"')}
    <a class="volver" href="#/cursos" aria-label="Volver">‹</a>
    <h1>${esc(c.nombre)}</h1><p class="sub">${esc(AREA_TXT[c.area])} · ${us.length} unidades · ${pc} % estudiado</p>
    <span class="barra" aria-hidden="true"><i style="width:${pc}%"></i></span>
    <div class="chips"><button class="chip${todas ? '' : ' on'}" data-todas="0">${esc(UNI_CORTA[est.uni] || 'Mi universidad')}</button><button class="chip${todas ? ' on' : ''}" data-todas="1">Todas las unidades</button></div></header>
    ${PC ? PC.tarjeta(ctxPrueba(), c.id) : ''}${lec ? tarjetaLectura(lec, c) : ''}
    <div class="lista unidades aparece" style="margin-top:16px">${filas}</div>`;
  $app.querySelectorAll('[data-todas]').forEach(b => b.onclick = () => { sessionStorage.setItem('todas', b.dataset.todas); vCurso(id); });
  $app.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => {
    const k = b.dataset.ver; if (est.vistas[k]) delete est.vistas[k]; else { est.vistas[k] = hoy(); marcarDia(); }
    guardar(); vCurso(id);
  });
}

// Tarjeta de las pruebas del módulo de lectura en la página del curso (como la de PruebaCurso).
function tarjetaLectura(p, c) {
  const st = lecturaSt(p);
  if (!st.entrada) return `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de entrada pendiente</div>
    <p>Un texto corto con preguntas. No es nota: sirve para ver de dónde partes.</p><a class="btn morado" href="${esc(p.url)}">Hacer la prueba de entrada ›</a></div>`;
  if (!st.salida) return salidaAbierta(c.id)
    ? `<div class="card prueba-tarjeta destacada"><div class="etq-p">Prueba de salida</div>
      <p>Tu profesor ya la abrió. Es un texto parecido al de la entrada, y al final ves cuánto avanzaste.</p><a class="btn morado" href="${esc(p.url)}/salida">Hacer la prueba de salida ›</a></div>`
    : `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de salida</div><p>La prueba de salida la abre tu profesor cuando terminen el curso.</p></div>`;
  return `<div class="card prueba-tarjeta"><div class="etq-p">Pruebas del curso</div>
    <p>Entrada ${st.entrada.aciertos} de ${st.entrada.total} · Salida <b>${st.salida.aciertos} de ${st.salida.total}</b></p></div>`;
}

function vProgreso() {
  const q = cola(est.uni), hechas = q.filter(x => visto(x.u.id)).length, p = q.length ? hechas / q.length : 0;
  const R = 70, L = Math.PI * R; // medio anillo
  const dias = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); const f = d.toLocaleDateString('en-CA');
    return { l: d.toLocaleDateString('es-PE', { weekday: 'narrow' }), on: est.dias.includes(f), n: Object.values(est.vistas).filter(v => v === f).length }; });
  const max = Math.max(1, ...dias.map(d => d.n));
  $app.innerHTML = `<h1>Tu progreso</h1><p class="sub">Temario de ${esc(cat.universidades[est.uni]?.nombre || '')}</p>
    <div class="col2"><div>
    <div class="card" style="margin-top:18px">
      <div class="anillo"><svg width="180" height="100" viewBox="0 0 180 100" role="img" aria-label="${Math.round(p * 100)} % del temario">
        <path d="M20 90a70 70 0 0 1 140 0" fill="none" stroke="var(--brand-soft)" stroke-width="18" stroke-linecap="round"/>
        <path d="M20 90a70 70 0 0 1 140 0" fill="none" stroke="var(--brand)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - p)}"/></svg>
        <div style="margin-top:-46px;text-align:center"><div class="n">${Math.round(p * 100)}<span style="font-size:20px">%</span></div><div class="l">${hechas} de ${q.length} unidades</div></div></div>
      ${q.length - hechas ? `<div class="aviso">🍫 Te faltan ${q.length - hechas} unidades. Una por día también cuenta.</div>` : ''}
    </div>
    <h2>Últimos 7 días</h2>
    <div class="card"><div style="display:flex;gap:10px;align-items:flex-end;height:110px">
      ${dias.map(d => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="width:100%;max-width:28px;height:${8 + 70 * d.n / max}px;border-radius:8px;background:${d.on ? 'var(--brand)' : 'var(--brand-soft)'}"></div>
        <span class="sub" style="font-size:12px">${esc(d.l)}</span></div>`).join('')}
    </div></div>
    <div class="racha">${Ilus.taza('class="racha-taza"')}<div><div class="etq">Racha de estudio</div><div class="n">${racha()} <span>${racha() === 1 ? 'día' : 'días'}</span></div>
      <p>${racha() ? 'Una taza de chocolate por cada día que vuelves.' : 'Abre una unidad hoy y empieza tu racha.'}</p></div></div></div><div>
    <h2 class="primero">Por curso</h2>
    <div class="lista">${cat.cursos.filter(c => unidadesDe(c, est.uni).length).map(c => { const a = avance(c, est.uni);
      return `<a class="item" style="${Ilus.tinte(c.id)}" href="#/curso/${esc(c.id)}">${icono(c.id)}<span class="tx"><span class="t">${esc(c.nombre)}</span>
        <span class="barra" style="display:block;margin-top:8px"><i style="width:${Math.round(a * 100)}%"></i></span></span><span class="der">${Math.round(a * 100)} %</span></a>`; }).join('')}</div></div></div>`;
}

function resumenHTML() {
  const r = Medicion.resumir(eventos());
  const cursosP = cat.cursos.filter(c => est.pruebas[c.id] && est.pruebas[c.id].entrada);
  const tablaP = cursosP.length ? `<div class="tabla" style="margin-bottom:10px"><table><thead><tr><th>Curso</th><th>Entrada</th><th>Salida</th></tr></thead><tbody>${cursosP.map(c => { const p = est.pruebas[c.id];
    return `<tr><td>${esc(c.nombre)}</td><td>${p.entrada.aciertos}/${p.entrada.total} (forma ${esc(p.entrada.forma)})</td><td>${p.salida ? `${p.salida.aciertos}/${p.salida.total} (forma ${esc(p.salida.forma)})` : '—'}</td></tr>`; }).join('')}</tbody></table></div>` : '';
  if (!r.length) return tablaP || '<p class="sub">Todavía no hay prácticas registradas.</p>';
  const pct = x => x === null ? '—' : Math.round(x * 100) + ' %';
  return `${tablaP}<div class="tabla"><table><thead><tr><th>Módulo</th><th>Entrada</th><th>Salida</th><th>Predicciones</th></tr></thead><tbody>${r.map(m =>
    `<tr><td>${esc((cat.plantillas[m.modulo] || {}).titulo || m.modulo)}</td><td>${pct(m.entrada)}</td><td>${pct(m.salida)}</td><td>${m.predicciones} (${pct(m.acierto)} bien)</td></tr>`).join('')}</tbody></table></div>`;
}

function vPerfil() {
  const unis = Object.entries(cat.universidades).filter(([k]) => k !== 'una').map(([k]) =>
    `<button class="chip${est.uni === k ? ' on' : ''}" data-uni="${k}">${esc(UNI_CORTA[k] || k)}</button>`).join('');
  const temas = [['', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([k, v]) =>
    `<button class="chip${est.tema === k ? ' on' : ''}" data-tema="${k}">${v}</button>`).join('');
  const cu = esAlumnoCuenta() ? cuenta() : null;
  $app.innerHTML = `<h1>Perfil</h1>
    <div class="col2"><div>
    ${cu ? `<h2>Tu cuenta</h2><div class="card cuenta-ficha"><span class="avatar">${esc((cu.nombre || est.nombre || '?')[0].toUpperCase())}</span>
      <div><b>${esc(cu.nombre || est.nombre)}</b><br><span class="sub">Usuario <b>${esc(ses.usuario().usuario || '')}</b>${cu.seccion ? ` · ${esc(seccionTxt(cu.seccion))}` : ''}</span><br>${pildoraSync()}</div></div>`
      : `<h2>Nombre</h2><input type="text" id="nombre" maxlength="30" value="${esc(est.nombre)}" placeholder="Tu nombre">`}
    <h2>Universidad</h2><div class="chips">${unis}</div>
    <h2>Grado</h2><div class="chips">${GRADOS.map(([k, t]) => `<button class="chip${est.grado === k ? ' on' : ''}" data-grado="${k}">${esc(t)}</button>`).join('')}</div>
    ${cu ? '' : `<h2>Código del colegio</h2><input type="text" id="colegio" maxlength="20" value="${esc(est.colegio)}" placeholder="Lo da tu profesor" autocapitalize="characters">`}
    <h2>Apariencia</h2><div class="chips">${temas}</div>
    <h2>Esta app</h2>
    <div class="lista">
      <div class="item"><span class="ico" aria-hidden="true">${offlineListo ? '✓' : '…'}</span><span class="tx"><span class="t">${offlineListo ? 'Lista para usar sin internet' : 'Preparando modo sin internet'}</span><br>
        <span class="d">Las escenas y el catálogo quedan guardados en el celular.</span></span></div>
      ${instalar ? '<button class="btn morado ancho" id="instalar">Instalar en este celular</button>' : ''}
      ${cu ? `<a class="btn borde ancho" href="#/contrasena">Cambiar contraseña</a>
      <a class="btn morado ancho" href="#/salir" id="salir">Cerrar sesión</a>`
      : `<a class="btn borde ancho" href="#/otro" id="otroAlumno">Otro alumno en esta PC</a>
      <button class="btn borde ancho" id="borrar">Borrar mi avance</button>${ses ? '<a class="btn morado ancho" href="#/ingreso">Entrar con mi cuenta</a>' : ''}`}
    </div></div><div>
    <h2>Datos para el profesor</h2>
    <div class="card">
      ${cu ? `<p class="sub" style="margin:0 0 10px">Se suben solos a tu cuenta, con un código y sin tu nombre: tus predicciones, tus pasos previos de lectura y tus pruebas de entrada y salida (${eventos().length} registros en este equipo).</p>
      ${resumenHTML()}`
      : `<p class="sub" style="margin:0 0 10px">Se guardan en este dispositivo, sin tu nombre: tus predicciones, tus pasos previos de lectura y tus pruebas de entrada y salida (${eventos().length} registros${sinExportar() ? `, ${sinExportar()} sin descargar` : ', todos descargados'}).</p>
      ${resumenHTML()}
      <div class="acciones-datos"><button class="btn morado" id="json">Descargar datos para el profesor</button><button class="btn borde" id="csv">Descargar CSV (hoja de cálculo)</button></div>`}
    </div></div></div>`;
  if (!cu) {
    document.getElementById('nombre').onchange = e => { est.nombre = e.target.value.trim(); guardar(); };
    document.getElementById('colegio').onchange = e => { est.colegio = e.target.value.trim().toUpperCase(); guardar(); };
    document.getElementById('csv').onclick = () => { exportar('csv'); vPerfil(); };
    document.getElementById('json').onclick = () => { exportar('json'); vPerfil(); };
  }
  $app.querySelectorAll('[data-grado]').forEach(b => b.onclick = () => { est.grado = b.dataset.grado; guardar(); vPerfil(); });
  $app.querySelectorAll('[data-uni]').forEach(b => b.onclick = () => { est.uni = b.dataset.uni; guardar(); vPerfil(); });
  $app.querySelectorAll('[data-tema]').forEach(b => b.onclick = () => { est.tema = b.dataset.tema; guardar(); aplicarTema(); vPerfil(); });
  const bi = document.getElementById('instalar');
  if (bi) bi.onclick = async () => { instalar.prompt(); await instalar.userChoice; instalar = null; vPerfil(); };
  const bb = document.getElementById('borrar');
  if (bb) bb.onclick = () => {
    if (!confirm('¿Borrar tu avance de este celular? No se puede deshacer.')) return;
    // Las pruebas de entrada y salida se conservan: se hacen una sola vez y son los datos del colegio. Las de
    // razonamiento verbal viven en practica[id] (app/lectura.js): de esas solo se guardan entrada y salida.
    const practica = {};
    for (const [id, p] of Object.entries(est.practica || {})) if (p && (p.entrada || p.salida)) practica[id] = { entrada: p.entrada || null, salida: p.salida || null };
    est = { nombre: '', uni: '', grado: '', colegio: est.colegio, alumno: est.alumno, vistas: {}, dias: [], tema: '', practica, pruebas: est.pruebas,
      salidaHabilitada: est.salidaHabilitada, solucionesHabilitadas: est.solucionesHabilitadas }; guardar(); aplicarTema(); ir('#/bienvenida');
  };
}

// Otro alumno en esta PC (laboratorio de cómputo): primero se descargan los datos que falten; después se crea un
// id anónimo nuevo y se dejan en blanco el avance y las pruebas. Quedan el colegio, la apariencia y lo que habilitó
// el profesor en este navegador. Los registros del alumno anterior siguen guardados (con su id) y salen en la próxima descarga.
function vOtro() {
  const n = sinExportar();
  $app.innerHTML = `<a class="volver" href="#/perfil" aria-label="Volver">‹</a><h1>Otro alumno en esta PC</h1>
    <div class="card prueba-intro">
      <p>Así el siguiente alumno empieza desde cero, con un código anónimo nuevo, y sus pruebas no se mezclan con las tuyas.</p>
      ${n ? `<div class="aviso">Hay ${n} ${n === 1 ? 'registro' : 'registros'} sin descargar. Descárgalos para el profesor antes de cambiar.</div>` : '<p class="sub">Todos los registros ya se descargaron.</p>'}
      <div class="acciones-prueba">
        ${n ? '<button class="btn morado" id="bajarCambiar">Descargar y cambiar</button><button class="btn borde" id="soloCambiar">Cambiar sin descargar</button>'
          : '<button class="btn morado" id="soloCambiar">Cambiar de alumno</button>'}
        <a class="btn borde" href="#/perfil">Cancelar</a></div></div>`;
  const cambiar = bajar => {
    registrar({ tipo: 'sesion', accion: 'otro-alumno' });
    if (bajar) exportar('json');
    est = { nombre: '', uni: '', grado: '', colegio: est.colegio, alumno: idNuevo(), vistas: {}, dias: [], tema: est.tema, practica: {}, pruebas: {},
      salidaHabilitada: est.salidaHabilitada, solucionesHabilitadas: est.solucionesHabilitadas };
    guardar(); sessionStorage.clear(); ir('#/bienvenida');
  };
  const b = document.getElementById('bajarCambiar');
  if (b) b.onclick = () => cambiar(true);
  document.getElementById('soloCambiar').onclick = () => {
    if (n && !confirm(`Quedan ${n} registros sin descargar. Siguen guardados en esta PC y saldrán en la próxima descarga. ¿Cambiar igual?`)) return;
    cambiar(false);
  };
}

// ---------- Cuentas: ingreso, contraseña, cierre de sesión y panel del profesor ----------
const ADMIN = new Set(['admin', 'admin-colegio', 'administrador', 'general']);
function pantallaSola(ruta) { $nav.hidden = true; document.body.dataset.ruta = ruta; document.body.classList.remove('con-nav'); }
// La sección llega como id; el servidor falso usa s4a (4.º A). Si viene como objeto, se usa su grado y su letra.
function seccionTxt(s) {
  if (s && typeof s === 'object') return `${s.grado}.º ${s.letra}`;
  const m = String(s || '').match(/^s(\d)([a-z])$/i);
  return m ? `${m[1]}.º ${m[2].toUpperCase()}` : `Sección ${s}`;
}
function textoSync() {
  if (!ses) return '';
  const i = ses.info();
  if (i.estado === 'vencida') return 'Sesión vencida: vuelve a entrar';
  if (i.estado === 'subiendo') return i.pendientes ? `Subiendo (${i.pendientes})…` : 'Subiendo…';
  if (!i.pendientes) return '✓ Guardado';
  return `Pendiente de subir (${i.pendientes})`;
}
const pildoraSync = () => (esAlumnoCuenta() ? `<span class="sync" data-sync role="status" title="Tu avance y tus respuestas se suben solos a tu cuenta">${esc(textoSync())}</span>` : '');
function actualizarSync() {
  const t = textoSync(), pend = ses && ses.info().pendientes;
  document.querySelectorAll('[data-sync]').forEach(x => { x.textContent = t; x.classList.toggle('pendiente', !!pend); });
}
// Después de entrar o salir, el est de la memoria se vuelve a leer del navegador (es de otra persona).
function recargarEst() {
  est = Object.assign(BASE_EST(), cargarEstado());
  if (esAlumnoCuenta()) { est.alumno = ses.seudonimo(); est.colegio = colegioId(cuenta().colegio) || est.colegio || ''; }
  if (!est.alumno) est.alumno = idNuevo();
  aplicarTema();
}
const destinoCuenta = u => (u.debe_cambiar ? '#/contrasena' : u.rol === 'alumno' ? '#/inicio' : '#/panel');

function vIngreso() {
  if (cuenta()) return ir(destinoCuenta(cuenta()));
  pantallaSola('ingreso');
  const vencida = ses.vencida();
  $app.innerHTML = `<section class="bienvenida ingreso">
    <div class="hero">
      ${Ilus.escritorio('class="deco"')}
      <h1>Ve la física.<br>Entiende el examen.</h1>
      <p>Entra con el usuario y la contraseña que te dio tu profesor. Tu avance se guarda en tu cuenta, en cualquier equipo.</p>
    </div>
    <form id="fIngreso" class="form-cuenta" novalidate>
      ${vencida ? '<div class="aviso">Tu sesión venció. Vuelve a entrar: lo que hiciste sigue guardado en este equipo.</div>' : ''}
      <label class="sub" for="usuario">Usuario</label>
      <input type="text" id="usuario" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="40" placeholder="Por ejemplo, qroman26" value="${esc(vencida ? (ses.usuario() || {}).usuario || '' : '')}">
      <label class="sub" for="clave">Contraseña</label>
      <input type="password" id="clave" autocomplete="current-password" maxlength="80">
      <p class="error-cuenta" id="error" role="alert" hidden></p>
      <button class="btn acento ancho" id="entrar" type="submit">Entrar</button>
      <p class="sub" style="text-align:center;margin:0">¿Olvidaste tu contraseña? Pídesela a tu profesor.</p>
      <button class="btn borde ancho" id="demo" type="button">Probar sin cuenta</button>
      <span class="sub" style="text-align:center">Sin cuenta, la app funciona igual, pero tu avance se queda solo en este equipo.</span>
    </form>
  </section>`;
  const $e = document.getElementById('error');
  const error = m => { $e.textContent = m; $e.hidden = !m; };
  document.getElementById('demo').onclick = () => {
    sessionStorage.setItem('lab-demo', '1');
    ir(est.uni && est.grado ? '#/inicio' : '#/bienvenida');
  };
  document.getElementById('fIngreso').onsubmit = async ev => {
    ev.preventDefault();
    const usuario = document.getElementById('usuario').value.trim().toLowerCase(), clave = document.getElementById('clave').value;
    if (!usuario || !clave) return error('Escribe tu usuario y tu contraseña.');
    const b = document.getElementById('entrar'); b.disabled = true; b.textContent = 'Entrando…'; error('');
    let u;
    cambiandoCuenta = true;
    try { u = await ses.login(usuario, clave); } catch (e) {
      b.disabled = false; b.textContent = 'Entrar';
      document.getElementById('clave').value = '';
      return error(e.codigo === 'sin-conexion' ? 'Para entrar hace falta internet. Revisa la conexión e inténtalo otra vez.' : e.message);
    } finally { cambiandoCuenta = false; }
    sessionStorage.clear();
    recargarEst();
    if (u.rol === 'alumno') ses.arrancar({ ventana: window, doc: document });
    ir(destinoCuenta(u));
  };
}

function vContrasena(obligatoria) {
  pantallaSola('contrasena');
  const u = cuenta();
  $app.innerHTML = `<section class="cuenta-caja">
    ${obligatoria ? '' : `<a class="volver" href="${u.rol === 'alumno' ? '#/perfil' : '#/panel'}" aria-label="Volver">‹</a>`}
    <h1>${obligatoria ? 'Elige tu contraseña' : 'Cambiar contraseña'}</h1>
    <p class="sub">${obligatoria ? `Hola, ${esc(u.nombre || '')}. La contraseña de la tarjeta es solo para entrar la primera vez: elige una nueva, que solo sepas tú.` : 'Escribe la que usas ahora y la nueva.'}</p>
    <form id="fClave" class="card form-cuenta" novalidate>
      <label class="sub" for="actual">${obligatoria ? 'La contraseña de tu tarjeta' : 'Contraseña actual'}</label>
      <input type="password" id="actual" autocomplete="current-password" maxlength="80">
      <label class="sub" for="nueva">Contraseña nueva (6 caracteres o más)</label>
      <input type="password" id="nueva" autocomplete="new-password" maxlength="80">
      <label class="sub" for="repite">Repite la contraseña nueva</label>
      <input type="password" id="repite" autocomplete="new-password" maxlength="80">
      <p class="error-cuenta" id="error" role="alert" hidden></p>
      <button class="btn morado ancho" id="guardarClave" type="submit">Guardar contraseña</button>
      ${obligatoria ? '<a class="btn borde ancho" href="#/salir">Salir</a>' : ''}
    </form></section>`;
  const $e = document.getElementById('error');
  const error = m => { $e.textContent = m; $e.hidden = !m; };
  document.getElementById('fClave').onsubmit = async ev => {
    ev.preventDefault();
    const actual = document.getElementById('actual').value, nueva = document.getElementById('nueva').value, repite = document.getElementById('repite').value;
    if (!actual) return error('Escribe tu contraseña actual.');
    if (nueva.length < 6) return error('La contraseña nueva debe tener 6 caracteres o más.');
    if (nueva !== repite) return error('Las dos contraseñas nuevas no son iguales.');
    if (nueva === actual) return error('La contraseña nueva no puede ser igual a la actual.');
    const b = document.getElementById('guardarClave'); b.disabled = true; error('');
    try { await ses.cambiarContrasena(actual, nueva); } catch (e) {
      b.disabled = false;
      return error(e.codigo === 'sin-conexion' ? 'Para cambiar la contraseña hace falta internet.' : e.message);
    }
    if (obligatoria) {
      // cambiarContrasena ya trajo el estado del servidor: se vuelve a leer y arranca la sincronización.
      recargarEst();
      if (esAlumnoCuenta()) ses.arrancar({ ventana: window, doc: document });
      ir(destinoCuenta(cuenta()));
    }
    else { $app.querySelector('form').outerHTML = `<div class="card"><p><b>Listo.</b> Tu contraseña cambió. La próxima vez entra con la nueva.</p><a class="btn morado" href="${u.rol === 'alumno' ? '#/perfil' : '#/panel'}">Volver</a></div>`; }
  };
}

// Cerrar sesión: sube lo pendiente y borra del navegador el estado y los tokens. Si no pudo subir, avisa.
async function vSalir(forzar = false) {
  pantallaSola('salir');
  const u = cuenta();
  if (!u) return ir('#/ingreso');
  $app.innerHTML = `<section class="cuenta-caja"><h1>Cerrar sesión</h1><div class="card"><p>Subiendo lo que falta…</p></div></section>`;
  const r = await ses.salir({ forzar });
  if (location.hash !== '#/salir') return;
  if (r.ok) {
    sessionStorage.clear(); recargarEst(); guardar();
    Object.assign(panel, { secciones: null, sel: '', avance: null, hab: {}, aviso: '', error: '', admin: null });
    return ir('#/ingreso');
  }
  $app.innerHTML = `<section class="cuenta-caja"><h1>Cerrar sesión</h1>
    <div class="card prueba-intro">
      <div class="aviso">No se pudo subir todo: ${r.pendientes} ${r.pendientes === 1 ? 'cosa pendiente' : 'cosas pendientes'}. Revisa la conexión.</div>
      <p>Si cierras igual, lo pendiente queda guardado en este equipo, separado de los demás, y se sube la próxima vez que entres aquí con tu cuenta.</p>
      <div class="acciones-prueba">
        <button class="btn morado" id="reintentar">Reintentar</button>
        <button class="btn borde" id="cerrarIgual">Cerrar igual</button>
        <a class="btn borde" href="${u.rol === 'alumno' ? '#/perfil' : '#/panel'}">Cancelar</a></div></div></section>`;
  document.getElementById('reintentar').onclick = () => vSalir(false);
  document.getElementById('cerrarIgual').onclick = () => vSalir(true);
}

// Panel del profesor (fase C3 mínima): sus secciones, el avance por alumno, abrir y cerrar la salida y las soluciones
// por curso, y el reinicio de contraseña. El administrador del colegio ve además la carga de la lista y los eventos.
const panel = { secciones: null, sel: '', avance: null, hab: {}, aviso: '', error: '', admin: null };
async function vPanel() {
  pantallaSola('panel');
  const u = cuenta(), admin = ADMIN.has(u.rol);
  const pintar = () => {
    if (location.hash.split('/')[1] !== 'panel') return;
    const secs = panel.secciones || [];
    const hab = panel.hab[panel.sel] || { salida: [], soluciones: [] };
    const abierto = (que, c) => (hab[que] || []).includes(c);
    const filaHab = (c, nombre) => `<tr><th scope="row">${esc(nombre)}</th>${['salida', 'soluciones'].map(que => {
      const on = abierto(que, c), porTodas = c !== 'todas' && abierto(que, 'todas');
      return `<td><button class="chip${on || porTodas ? ' on' : ''}" data-hab="${esc(c)}" data-que="${que}" data-abierto="${on ? '0' : '1'}"${porTodas ? ' disabled title="Abierta para todos los cursos"' : ''}
        aria-label="${on ? 'Cerrar' : 'Abrir'} ${que === 'salida' ? 'la salida' : 'las soluciones'} de ${esc(nombre)}">${on || porTodas ? 'Abierta' : 'Cerrada'}</button></td>`; }).join('')}</tr>`;
    const nombreCurso = id => (cat.cursos.find(c => c.id === id) || {}).nombre || id;
    const pr = r => (r ? `${r.aciertos}/${r.total}` : '—');
    const alumnos = (panel.avance && (panel.avance.alumnos || panel.avance)) || [];
    const filasAl = (Array.isArray(alumnos) ? alumnos : []).map(a => {
      // pruebas por curso; la de razonamiento verbal vive en practica['lectura-verbal'] (servidor/LEEME.md).
      const lv = (a.practica || {})['lectura-verbal'];
      const todas = Object.assign({}, a.pruebas || a.cursos || {}, lv ? { 'razonamiento-verbal': lv } : {});
      const cursos = Object.entries(todas).filter(([, x]) => x && (x.entrada || x.salida));
      return `<tr><th scope="row">${esc(a.nombre)}</th><td>${esc(a.usuario)}</td><td>${esc(a.dias_activos ?? a.dias ?? 0)}</td><td>${esc(a.unidades_vistas ?? a.modulos ?? 0)}</td>
        <td class="pruebas-al">${cursos.length ? cursos.map(([c, x]) => `<span>${esc(nombreCurso(c))}: ${pr(x.entrada)} → ${pr(x.salida)}</span>`).join('') : '<span class="sub">Sin pruebas</span>'}</td>
        <td><button class="btn borde chico" data-reiniciar="${esc(a.usuario)}">Reiniciar contraseña</button></td></tr>`; }).join('');
    $app.innerHTML = `<header class="panel-cab"><div><p class="sub">${esc(admin ? 'Administración del colegio' : 'Panel del profesor')}</p><h1>Hola, ${esc(u.nombre || '')}</h1></div>
        <span class="panel-acc"><a class="btn borde chico" href="#/contrasena">Cambiar contraseña</a><a class="btn morado chico" href="#/salir">Cerrar sesión</a></span></header>
      ${panel.aviso ? `<div class="card aviso-panel" role="status">${panel.aviso}</div>` : ''}
      ${panel.error ? `<p class="error-cuenta" role="alert">${esc(panel.error)}</p>` : ''}
      <h2>Tus secciones</h2>
      ${panel.secciones === null ? '<p class="sub">Cargando…</p>' : secs.length ? `<div class="chips">${secs.map(x => `<button class="chip${x.id == panel.sel ? ' on' : ''}" data-sec="${esc(x.id)}">${esc(x.grado)}.º ${esc(x.letra)} · ${esc(x.alumnos)} ${x.alumnos == 1 ? 'alumno' : 'alumnos'}</button>`).join('')}</div>` : '<p class="sub">Todavía no tienes secciones asignadas. Pídeselas al administrador del colegio.</p>'}
      ${panel.sel ? `<div class="col2 panel"><div>
        <h2>Pruebas de salida y soluciones</h2>
        <p class="sub">Lo que abras aquí les llega a los alumnos de la sección la próxima vez que su app se sincronice (cada 30 segundos con internet). Las soluciones conviene abrirlas cuando todo el grupo terminó la salida.</p>
        <div class="tabla card"><table><thead><tr><th>Curso</th><th>Salida</th><th>Soluciones</th></tr></thead><tbody>
          ${filaHab('todas', 'Todos los cursos')}${cat.cursos.map(c => filaHab(c.id, c.nombre)).join('')}</tbody></table></div>
        </div><div>
        <h2>Avance por alumno</h2>
        ${panel.avance === null ? '<p class="sub">Cargando…</p>' : `<div class="tabla card"><table><thead><tr><th>Alumno</th><th>Usuario</th><th>Días</th><th>Unidades</th><th>Entrada → salida</th><th></th></tr></thead>
          <tbody>${filasAl || '<tr><td colspan="6" class="sub">Sin alumnos.</td></tr>'}</tbody></table></div>
          <p><button class="btn borde chico" id="recargar">Actualizar</button></p>`}
      </div></div>` : ''}
      ${admin ? `<h2>Lista de alumnos</h2>
      <div class="card form-cuenta">
        <p class="sub" style="margin:0">Un archivo CSV con las columnas <code>apellidos,nombres,dni,grado,seccion</code>. Si un DNI ya está, el alumno se actualiza y no se duplica. Las contraseñas iniciales solo aparecen en la respuesta de esta carga: baja las tarjetas en ese momento.</p>
        <input type="file" id="csv" accept=".csv,text/csv">
        <div class="acciones-datos"><button class="btn morado" id="subirPdf">Subir y bajar las tarjetas (PDF)</button><button class="btn borde" id="subirVer">Subir y ver en pantalla</button></div>
        ${panel.admin ? panel.admin : ''}
      </div>
      <h2>Datos para el análisis</h2>
      <div class="card"><p class="sub" style="margin:0 0 10px">Los eventos del colegio con el código de cada alumno, sin nombres ni DNI. Es la entrada de <code>herramientas/analizar-medicion.js</code>.</p>
        <button class="btn morado" id="eventos">Descargar los eventos (JSON)</button></div>` : ''}`;
    $app.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => { panel.sel = b.dataset.sec; panel.avance = null; panel.aviso = ''; cargarAvance(); pintar(); });
    $app.querySelectorAll('[data-hab]').forEach(b => b.onclick = async () => {
      b.disabled = true;
      try {
        const r = await ses.pedir('POST', `/api/secciones/${encodeURIComponent(panel.sel)}/habilitar`, { curso: b.dataset.hab, que: b.dataset.que, abierto: b.dataset.abierto === '1' });
        const h = panel.hab[panel.sel] = panel.hab[panel.sel] || { salida: [], soluciones: [] };
        if (r && Array.isArray(r.salida)) Object.assign(h, { salida: r.salida, soluciones: r.soluciones || [] });
        else { const l = new Set(h[b.dataset.que]); if (b.dataset.abierto === '1') l.add(b.dataset.hab); else l.delete(b.dataset.hab); h[b.dataset.que] = [...l]; }
        panel.error = '';
      } catch (e) { panel.error = e.message; }
      pintar();
    });
    $app.querySelectorAll('[data-reiniciar]').forEach(b => b.onclick = async () => {
      if (!confirm(`¿Reiniciar la contraseña de ${b.dataset.reiniciar}? La de ahora deja de servir.`)) return;
      try {
        const r = await ses.pedir('POST', `/api/alumnos/${encodeURIComponent(b.dataset.reiniciar)}/reiniciar`);
        panel.aviso = `Nueva contraseña de <b>${esc(r.usuario)}</b>: <span class="clave-nueva">${esc(r.contrasena)}</span><br><span class="sub">Dísela al alumno. Al entrar, la app le pide elegir otra.</span>`;
        panel.error = '';
      } catch (e) { panel.error = e.message; }
      pintar(); window.scrollTo(0, 0);
    });
    const rc = document.getElementById('recargar'); if (rc) rc.onclick = () => { panel.avance = null; cargarAvance(); pintar(); };
    if (admin) {
      const subir = async pdf => {
        const f = document.getElementById('csv').files[0];
        if (!f) { panel.error = 'Elige primero el archivo CSV.'; return pintar(); }
        const fd = new FormData(); fd.append('archivo', f, f.name);
        try {
          if (pdf) {
            const r = await ses.pedir('POST', '/api/colegio/alumnos?formato=pdf', fd, { crudo: true });
            descargar(`tarjetas-${hoy()}.pdf`, await r.blob(), 'application/pdf');
            panel.admin = '<p><b>Listo.</b> Se bajó el PDF con las tarjetas de los alumnos nuevos.</p>';
          } else {
            const r = await ses.pedir('POST', '/api/colegio/alumnos', fd);
            panel.admin = `<p><b>${r.creados.length} nuevos, ${r.actualizados} actualizados${r.errores.length ? `, ${r.errores.length} con errores` : ''}.</b> Anota o imprime las contraseñas ahora: no se vuelven a mostrar.</p>
              ${r.creados.length ? `<div class="tabla"><table><thead><tr><th>Nombre</th><th>Grado</th><th>Usuario</th><th>Contraseña</th></tr></thead><tbody>${r.creados.map(c => `<tr><td>${esc(c.nombre)}</td><td>${esc(c.grado)}.º ${esc(c.seccion)}</td><td>${esc(c.usuario)}</td><td><b>${esc(c.contrasena)}</b></td></tr>`).join('')}</tbody></table></div>` : ''}
              ${r.errores.length ? `<ul>${r.errores.map(x => `<li>Fila ${esc(x.fila)}: ${esc(x.motivo)}</li>`).join('')}</ul>` : ''}`;
          }
          panel.error = ''; panel.secciones = null; cargarSecciones();
        } catch (e) { panel.error = e.message; }
        pintar();
      };
      document.getElementById('subirPdf').onclick = () => subir(true);
      document.getElementById('subirVer').onclick = () => subir(false);
      document.getElementById('eventos').onclick = async () => {
        try { const l = await ses.pedir('GET', '/api/colegio/eventos'); descargar(`eventos-colegio-${hoy()}.json`, JSON.stringify(l), 'application/json'); panel.error = ''; }
        catch (e) { panel.error = e.message; pintar(); }
      };
    }
  };
  async function cargarSecciones() {
    try { panel.secciones = await ses.pedir('GET', '/api/secciones'); if (!panel.sel && panel.secciones.length) { panel.sel = panel.secciones[0].id; cargarAvance(); } }
    catch (e) { panel.secciones = []; panel.error = e.message; }
    pintar();
  }
  async function cargarAvance() {
    const id = panel.sel;
    try {
      const a = await ses.pedir('GET', `/api/secciones/${encodeURIComponent(id)}/avance`);
      if (panel.sel !== id) return;
      panel.avance = a;
      // El servidor da una fila por (curso, qué) con abierto; se pasa a { salida: [cursos], soluciones: [cursos] }.
      const h = a && a.habilitaciones;
      if (Array.isArray(h)) panel.hab[id] = { salida: h.filter(x => x.abierto && x.que === 'salida').map(x => x.curso), soluciones: h.filter(x => x.abierto && x.que === 'soluciones').map(x => x.curso) };
      else if (h) panel.hab[id] = { salida: h.salida || [], soluciones: h.soluciones || [] };
    } catch (e) { panel.avance = []; panel.error = e.message; }
    pintar();
  }
  pintar();
  if (panel.secciones === null) cargarSecciones();
  else if (panel.sel && panel.avance === null) cargarAvance();
}

// Papel de un módulo de lectura (herramientas/papel-lectura.js): el texto con sus oraciones numeradas y figuras,
// y cada pregunta con su paso previo ("Antes de mirar las alternativas…") y sus alternativas con letra.
function papelFigura(f) {
  let c = '';
  if (f.tipo === 'tabla') c = `<div class="fig-tabla"><table><thead><tr>${f.columnas.map(x => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${f.filas.map(r =>
    `<tr>${r.celdas.map((x, k) => k ? `<td>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  else if (f.tipo === 'barras') {
    const max = Math.max(...f.barras.map(b => b.valor)) || 1;
    c = `<ul class="fig-barras">${f.barras.map(b => `<li><span class="et">${esc(b.etiqueta)}</span><span class="pista" aria-hidden="true"><span class="relleno" style="width:${(100 * b.valor / max).toFixed(1)}%"></span></span><span class="val">${esc(String(b.valor).replace('.', ','))}${f.unidad ? ` ${esc(f.unidad)}` : ''}</span></li>`).join('')}</ul>`;
  } else if (f.tipo === 'imagen') c = `<div class="fig-imagen" role="img" aria-label="${esc(f.alt)}">${f.svg}</div><div class="fig-recuadros fig-partes">${(f.partes || []).map(r => `<div>${r.titulo ? `<b>${r.n ? `${esc(String(r.n))}. ` : ''}${esc(r.titulo)}</b>` : ''}<p>${esc(r.t)}</p></div>`).join('')}</div>`;
  else c = `<div class="fig-recuadros">${(f.recuadros || []).map(r => `<div>${r.titulo ? `<b>${esc(r.titulo)}</b>` : ''}<p>${esc(r.t)}</p></div>`).join('')}</div>`;
  return `<figure class="lec-fig"><figcaption>${esc(f.titulo)}</figcaption>${c}${f.nota ? `<p class="fig-nota">${esc(f.nota)}</p>` : ''}</figure>`;
}
function papelLectura(q) {
  const t = q.texto, figs = t.figuras || [];
  const fig = k => figs.filter(f => f.despues === k).map(papelFigura).join('');
  const cuerpo = t.lineas ? t.lineas.map(l => `<p>${esc(l)}</p>`).join('')
    : fig(0) + (t.parrafos || []).map((par, k) => `${(a => a ? `<h4 class="papel-autor">${esc(a.titulo)}${a.firma ? ` · ${esc(a.firma)}` : ''}</h4>` : '')((t.autores || []).find(a => a.desde === k))}<p>${par.map(o => `<sup class="n">${o.n}</sup>${esc(o.t)}`).join(' ')}</p>${fig(k + 1)}`).join('');
  return `<div class="papel-texto"${t.idioma ? ` lang="${esc(t.idioma)}"` : ''}>${t.lineas ? '' : `<h3>${esc(t.titulo)}</h3>`}${cuerpo}</div>
    <ol class="papel-preg">${q.preguntas.map(p => `<li>${p.previo ? `<p class="papel-previo">${esc(p.previo)}</p>` : ''}<p>${esc(p.enunciado)}</p>
      <ol class="papel-alts">${p.alternativas.map(a => `<li><b>${esc(a.letra)})</b> ${esc(a.t)}</li>`).join('')}</ol></li>`).join('')}</ol>`;
}

// Problemas para lápiz y papel (regla 6): sin escena, con la respuesta escondida hasta que el alumno la pida.
async function vPapel(id) {
  const p = cat.plantillas[id]; if (!p || !p.papel) return ir('#/cursos');
  const curso = cat.cursos.find(c => c.unidades.some(u => u.id === p.unidades[0]));
  $app.innerHTML = '<p class="vacio">Cargando…</p>';
  let d; try { d = await (await fetch(p.papel)).json(); } catch { $app.innerHTML = '<p class="vacio">No se pudieron cargar los problemas. Ábrelos una vez con internet para tenerlos sin conexión.</p>'; return; }
  if (location.hash !== `#/papel/${id}`) return; // el alumno ya se fue a otra pantalla
  $app.innerHTML = `<a class="volver" href="#/curso/${esc(curso ? curso.id : '')}" aria-label="Volver">‹</a>
    <p class="sub">${esc(curso ? curso.nombre : '')} · ${esc(p.titulo)}</p><h1>Lápiz y papel</h1>
    <p class="sub" style="margin-top:8px">${esc(d.indicacion)}</p>
    <div class="lista papel" style="margin-top:18px">${d.problemas.map((q, k) => `<article class="card">
      <div class="etq-p">Problema ${k + 1}${q.nivel ? ` · ${esc(q.nivel)}` : ''}</div>
      <p style="margin:8px 0 12px">${esc(q.enunciado)}</p>${q.texto ? papelLectura(q) : ''}
      <details><summary>Ver respuesta</summary><p><b>${esc(q.respuesta)}</b></p><ol class="sol${q.texto ? ' sol-lectura' : ''}">${q.pasos.map(x => `<li>${esc(x)}</li>`).join('')}</ol></details>
    </article>`).join('')}</div>
    <p style="margin-top:18px"><button class="btn borde" onclick="print()">Imprimir</button></p>`;
}

// ---------- Carga por partes ----------
// El inicio solo necesita app.js, ilustraciones.js y medicion.js. Las pantallas de práctica, prueba y lectura
// cargan sus scripts al entrar a su ruta. Todos están en la CASCARA de sw.js, así que sin conexión salen de la caché.
const MODULOS = {
  prueba: ['/nucleo/azar.js', '/nucleo/pruebas.js', '/app/prueba.js'],
  practica: ['/nucleo/azar.js', '/nucleo/predicciones.js', '/nucleo/convencion.js', '/app/practica.js'],
  lectura: ['/nucleo/azar.js', '/nucleo/pruebas.js', '/nucleo/lectura.js', '/app/prueba.js', '/app/lectura.js'],
};
const scripts = {};
// async = false: se bajan en paralelo pero corren en el orden en que se insertan (azar antes que pruebas, etc.).
const script = src => scripts[src] || (scripts[src] = new Promise((ok, mal) => {
  const s = document.createElement('script'); s.src = src; s.async = false;
  s.onload = ok; s.onerror = () => { delete scripts[src]; s.remove(); mal(new Error('No se pudo cargar ' + src)); };
  document.head.appendChild(s);
}));
const modulo = nombre => Promise.all(MODULOS[nombre].map(script));
// Banco de pruebas de entrada y salida, con prueba.js. Es opcional: si no carga, la app funciona igual, sin pruebas por curso.
let bancoListo = null;
function cargarBanco() {
  return bancoListo || (bancoListo = Promise.all([
    fetch('datos/pruebas.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
    modulo('prueba').then(() => true, () => false),
  ]).then(([b, ok]) => { pruebas = ok && b ? b : null; if (!pruebas) bancoListo = null; })); // si falló el banco o el script, se reintenta
}
// Muestra la ruta cuando esté lo que necesita; si el alumno ya se fue a otra pantalla, no hace nada.
function cuandoListo(promesa, fn) {
  const h = location.hash;
  if (!$app.firstElementChild) $app.innerHTML = '<p class="vacio">Cargando…</p>';
  promesa.then(() => { if (location.hash === h) { window.scrollTo(0, 0); fn(); } },
    () => { if (location.hash === h) $app.innerHTML = '<p class="vacio">No se pudo cargar esta pantalla. Ábrela una vez con internet para tenerla sin conexión.</p>'; });
}

// ---------- Rutas ----------
function ir(h) { if (location.hash === h) render(); else location.hash = h; }
function render() {
  const [, ruta = 'inicio', arg] = location.hash.split('/');
  // Con servidor: sin sesión (y sin «Probar sin cuenta») va el ingreso; el primer ingreso pide la contraseña nueva;
  // el profesor y el administrador van a su panel.
  if (ses) {
    const u = cuenta();
    if (ruta === 'ingreso' || (!u && !demoElegido())) return ruta === 'ingreso' ? vIngreso() : ir('#/ingreso');
    if (u && u.debe_cambiar) return ruta === 'contrasena' ? vContrasena(true) : ruta === 'salir' ? vSalir() : ir('#/contrasena');
    if (u && ruta === 'contrasena') return vContrasena(false);
    if (u && ruta === 'salir') return vSalir();
    if (u && u.rol !== 'alumno') return ruta === 'panel' ? vPanel() : ir('#/panel');
    if (u && ruta === 'otro') return ir('#/salir');
  }
  if (['ingreso', 'contrasena', 'salir', 'panel'].includes(ruta)) return ir('#/inicio');
  if ((!est.uni || !est.grado) && ruta !== 'bienvenida') return ir('#/bienvenida');
  if (ruta === 'bienvenida') return vBienvenida();
  $nav.hidden = false; document.body.dataset.ruta = ruta; document.body.classList.add('con-nav');
  $nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.ruta === (['curso', 'papel', 'practica', 'prueba', 'lectura'].includes(ruta) ? 'cursos' : ruta === 'otro' ? 'perfil' : ruta)));
  if (ruta === 'practica') {
    $nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.ruta === 'cursos'));
    return cuandoListo(modulo('practica'), () => Practica.vista({ $app, cat, est, esc, guardar, registrar, marcarDia }, decodeURIComponent(arg || '')));
  }
  if (ruta === 'lectura') {
    return cuandoListo(modulo('lectura'), () => LecturaVista.vista({ $app, cat, est, esc, guardar, registrar, marcarDia }, decodeURIComponent(arg || ''), decodeURIComponent(location.hash.split('/')[3] || '')));
  }
  if (ruta === 'prueba') return cuandoListo(cargarBanco().then(() => { if (!window.PruebaCurso) throw new Error('sin prueba.js'); }),
    () => PruebaCurso.vista(ctxPrueba(), decodeURIComponent(arg || ''), location.hash.split('/')[3] || 'entrada'));
  // El curso decide si va primero la prueba de entrada: espera al banco (ya suele estar, porque se pide tras el primer pintado).
  if (ruta === 'curso') return cuandoListo(cargarBanco(), () => vCurso(decodeURIComponent(arg || '')));
  ({ inicio: vInicio, otro: vOtro, cursos: vCursos, progreso: vProgreso, perfil: vPerfil, papel: () => vPapel(decodeURIComponent(arg || '')) }[ruta] || vInicio)();
  window.scrollTo(0, 0);
}
// Abrir una escena cuenta como día activo y marca la unidad como estudiada.
document.addEventListener('click', e => {
  const a = e.target.closest('[data-abrir]'); if (!a) return;
  // Si el curso de esa unidad tiene la prueba de entrada pendiente, va primero la prueba (así la entrada es en frío).
  const c = cursoDeUnidad(a.dataset.abrir);
  // Toque antes de que llegue el banco de pruebas: se espera para no saltarse la entrada.
  if (c && !window.PruebaCurso) {
    e.preventDefault();
    const href = a.href, h = location.hash;
    cargarBanco().then(() => {
      if (location.hash !== h) return;
      if (window.PruebaCurso && PruebaCurso.pideEntrada(ctxPrueba(), c.id)) { a.click(); return; }
      est.vistas[a.dataset.abrir] = est.vistas[a.dataset.abrir] || hoy(); marcarDia(); guardar();
      location.href = href;
    });
    return;
  }
  if (c && window.PruebaCurso && PruebaCurso.pideEntrada(ctxPrueba(), c.id)) {
    e.preventDefault(); sessionStorage.setItem('prueba-auto-' + c.id, '1');
    if (!(est.pruebas[c.id] || {}).enCurso) return ir(`#/prueba/${c.id}/entrada`);
    return ir(`#/prueba/${c.id}/${est.pruebas[c.id].enCurso.fase}`);
  }
  est.vistas[a.dataset.abrir] = est.vistas[a.dataset.abrir] || hoy(); marcarDia(); guardar();
});
window.addEventListener('hashchange', render);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); instalar = e; });

// ---------- Modo sin conexión ----------
async function registrarSW() {
  if (!('serviceWorker' in navigator)) return;
  try {
    // Alcance "/" para cubrir también /plantillas/ (el servidor manda Service-Worker-Allowed).
    await navigator.serviceWorker.register('sw.js', { scope: '/' });
  } catch {
    try { await navigator.serviceWorker.register('sw.js'); } catch { return; }
  }
  await navigator.serviceWorker.ready;
  offlineListo = true;
  if (location.hash.startsWith('#/perfil')) render();
}

aplicarTema();
// Con cuenta de alumno: la sincronización arranca sola y el indicador se actualiza con cada cambio. Si llegan
// habilitaciones nuevas, el inicio vuelve a pintar sus avisos; si la sesión vence, va al ingreso.
if (ses) {
  let avisosAntes = -1;
  ses.alCambiar(i => {
    actualizarSync();
    if (i.estado === 'vencida' && !/^#\/ingreso/.test(location.hash)) return ir('#/ingreso');
    if (i.estado === 'debe-cambiar' && !/^#\/contrasena/.test(location.hash)) return ir('#/contrasena');
    const [, ruta = 'inicio'] = location.hash.split('/');
    if (cat && i.estado === 'guardado' && ruta === 'inicio' && est.uni && est.grado) {
      const n = avisosSalida().length; if (avisosAntes !== -1 && n !== avisosAntes) vInicio(); avisosAntes = n;
    }
  });
  if (esAlumnoCuenta()) ses.arrancar({ ventana: window, doc: document });
}
// Primero el catálogo y el primer pintado. Después (cuando la página terminó de cargar, para no quitarle ancho de banda
// al primer pintado) el banco de pruebas con prueba.js; si cambia los avisos del inicio, el inicio se vuelve a pintar.
// Al final se registra el service worker, cuya precarga es lo más pesado.
const cargada = new Promise(ok => (document.readyState === 'complete' ? ok() : addEventListener('load', ok, { once: true })));
fetch('datos/catalogo.json').then(r => r.json()).then(c => { cat = c; render(); })
  .then(async () => {
    await cargada;
    const antes = avisosSalida().length;
    await cargarBanco();
    const [, ruta = 'inicio'] = location.hash.split('/');
    if (ruta === 'inicio' && est.uni && est.grado && avisosSalida().length !== antes) vInicio();
    registrarSW();
  }, () => { $app.innerHTML = '<p class="vacio">No se pudo cargar el catálogo. Revisa tu conexión e inténtalo otra vez.</p>'; });
})();
