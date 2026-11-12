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
let est = Object.assign({ nombre: '', uni: '', grado: '', colegio: '', alumno: '', vistas: {}, dias: [], tema: '', practica: {}, pruebas: {}, salidaHabilitada: [], solucionesHabilitadas: [] }, cargarEstado());
// Identificador anónimo del dispositivo: la medición nunca guarda nombres.
const idNuevo = () => 'a' + Array.from(crypto.getRandomValues(new Uint8Array(5)), b => b.toString(16).padStart(2, '0')).join('');
if (!est.alumno) est.alumno = idNuevo();
// Código del colegio: llega en el enlace que reparte el profesor (…/app/?colegio=ABC).
{ const c = new URLSearchParams(location.search).get('colegio'); if (c) est.colegio = c.trim().toUpperCase().slice(0, 20); }
// Solo el profesor abre la prueba de salida y la revisión de soluciones, con el enlace que reparte en clase:
// …/app/?salida=fisica,quimica (o ?salida=todas) y …/app/?soluciones=fisica (o =todas). Queda guardado en este
// navegador, también si cambia el alumno. No hay servidor ni clave: el control es que el enlace lo da el profesor.
const habilitacionesNuevas = [];
for (const [param, campo] of [['salida', 'salidaHabilitada'], ['soluciones', 'solucionesHabilitadas']]) {
  const v = new URLSearchParams(location.search).get(param);
  if (!v) continue;
  const lista = v.toLowerCase().split(',').map(x => x.trim()).filter(x => /^[a-z0-9-]+$/.test(x));
  const antes = new Set(est[campo] || []);
  for (const c of lista) if (!antes.has(c)) habilitacionesNuevas.push({ que: param, curso: c });
  est[campo] = [...new Set([...antes, ...lista])];
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(est)); } catch { /* sin almacenamiento: la app sigue */ } }
const hoy = () => new Date().toLocaleDateString('en-CA');
// ---------- Medición (anónima; ver nucleo/medicion.js) ----------
const eventos = () => Medicion.eventosGuardados();
const registrar = ev => Medicion.guardar(ev, VERSION_APP, est);
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
    <label class="sub" for="nombre">¿Cómo te llamas?</label>
    <input type="text" id="nombre" autocomplete="given-name" maxlength="30" placeholder="Tu nombre" value="${esc(est.nombre)}">
    <span class="sub">¿A qué universidad postulas?</span>
    <div class="opciones">${opc}</div>
    <span class="sub">¿En qué grado estás?</span>
    <div class="chips" style="margin:0">${GRADOS.map(([k, t]) => `<button class="chip${est.grado === k ? ' on' : ''}" data-grado="${k}">${esc(t)}</button>`).join('')}</div>
    <button class="btn acento ancho" id="empezar"${est.uni && est.grado ? '' : ' disabled'}>Empezar</button>
    <span class="sub" style="text-align:center">Tu avance se guarda en este celular. Funciona sin internet.</span>
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
    est.nombre = document.getElementById('nombre').value.trim(); guardar(); marcarDia(); location.hash = '#/inicio';
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
      <a class="btn borde solo-grande" href="#/otro">Otro alumno en esta PC</a></header>
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
  $app.innerHTML = `<h1>Perfil</h1>
    <div class="col2"><div>
    <h2>Nombre</h2><input type="text" id="nombre" maxlength="30" value="${esc(est.nombre)}" placeholder="Tu nombre">
    <h2>Universidad</h2><div class="chips">${unis}</div>
    <h2>Grado</h2><div class="chips">${GRADOS.map(([k, t]) => `<button class="chip${est.grado === k ? ' on' : ''}" data-grado="${k}">${esc(t)}</button>`).join('')}</div>
    <h2>Código del colegio</h2><input type="text" id="colegio" maxlength="20" value="${esc(est.colegio)}" placeholder="Lo da tu profesor" autocapitalize="characters">
    <h2>Apariencia</h2><div class="chips">${temas}</div>
    <h2>Esta app</h2>
    <div class="lista">
      <div class="item"><span class="ico" aria-hidden="true">${offlineListo ? '✓' : '…'}</span><span class="tx"><span class="t">${offlineListo ? 'Lista para usar sin internet' : 'Preparando modo sin internet'}</span><br>
        <span class="d">Las escenas y el catálogo quedan guardados en el celular.</span></span></div>
      ${instalar ? '<button class="btn morado ancho" id="instalar">Instalar en este celular</button>' : ''}
      <a class="btn borde ancho" href="#/otro" id="otroAlumno">Otro alumno en esta PC</a>
      <button class="btn borde ancho" id="borrar">Borrar mi avance</button>
    </div></div><div>
    <h2>Datos para el profesor</h2>
    <div class="card">
      <p class="sub" style="margin:0 0 10px">Se guardan en este dispositivo, sin tu nombre: tus predicciones, tus pasos previos de lectura y tus pruebas de entrada y salida (${eventos().length} registros${sinExportar() ? `, ${sinExportar()} sin descargar` : ', todos descargados'}).</p>
      ${resumenHTML()}
      <div class="acciones-datos"><button class="btn morado" id="json">Descargar datos para el profesor</button><button class="btn borde" id="csv">Descargar CSV (hoja de cálculo)</button></div>
    </div></div></div>`;
  document.getElementById('nombre').onchange = e => { est.nombre = e.target.value.trim(); guardar(); };
  document.getElementById('colegio').onchange = e => { est.colegio = e.target.value.trim().toUpperCase(); guardar(); };
  $app.querySelectorAll('[data-grado]').forEach(b => b.onclick = () => { est.grado = b.dataset.grado; guardar(); vPerfil(); });
  document.getElementById('csv').onclick = () => { exportar('csv'); vPerfil(); };
  document.getElementById('json').onclick = () => { exportar('json'); vPerfil(); };
  $app.querySelectorAll('[data-uni]').forEach(b => b.onclick = () => { est.uni = b.dataset.uni; guardar(); vPerfil(); });
  $app.querySelectorAll('[data-tema]').forEach(b => b.onclick = () => { est.tema = b.dataset.tema; guardar(); aplicarTema(); vPerfil(); });
  const bi = document.getElementById('instalar');
  if (bi) bi.onclick = async () => { instalar.prompt(); await instalar.userChoice; instalar = null; vPerfil(); };
  document.getElementById('borrar').onclick = () => {
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
