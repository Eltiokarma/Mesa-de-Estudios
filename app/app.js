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
// Avance honesto (nucleo/avance.js): est.vistas son visitas; estudiar se acredita con evidencia. Migra una sola vez.
if (window.Avance && Avance.migrar(est)) { try { localStorage.setItem(CLAVE, JSON.stringify(est)); } catch { /* sin almacenamiento */ } }
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
function aplicarTema() {
  if (est.tema) document.documentElement.dataset.theme = est.tema; else delete document.documentElement.dataset.theme;
  // Modo ahorro de los gráficos 3D (Perfil → Gráficos): las piezas vivas lo leen al montarse (quim-molecula-3d).
  if (est.prefs && est.prefs.ahorro) document.documentElement.dataset.ahorro = '1'; else delete document.documentElement.dataset.ahorro;
}

// ---------- Catálogo ----------
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const unidadesDe = (c, uni) => c.unidades.filter(u => !uni || u.universidades[uni]);
const ubic = (u, uni) => { const k = cat.universidades[uni]?.ubicacion; return k && u.universidades[uni] ? u.universidades[uni][k] : null; };
const etiquetaUbic = (u, k) => { const v = ubic(u, k); if (!v) return ''; const pal = cat.universidades[k].ubicacion === 'semanas' ? 'sem.' : 'tema';
  return `${UNI_CORTA[k] || k} · ${pal} ${v.length > 2 ? `${v[0]}–${v[v.length - 1]}` : v.join(', ')}`; };
const visto = id => !!est.vistas[id];   // visitada (abrió algo): no es lo mismo que estudiada
// Nivel de una unidad (nucleo/avance.js). El índice de eventos se arma una vez por pantalla.
let ixAvance = null;
const indiceAvance = () => ixAvance || (ixAvance = window.Avance ? Avance.indice(eventos(), est.alumno) : {});
const nivelDe = u => (window.Avance ? Avance.nivel(est, u, indiceAvance()) : { nivel: visto(u.id) ? 0 : -1, nombre: '', falta: '' });
const estudiada = u => nivelDe(u).nivel >= 1;
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
const enlace = (p, unidad) => p.formato === 'escena' ? `${p.url}?desde=app${unidad ? `&unidad=${encodeURIComponent(unidad)}` : ''}` : p.formato === 'lectura' && unidad ? `${p.url}/${encodeURIComponent(unidad)}` : p.url;
const VERBO = { escena: 'Abrir escena', predicciones: 'Practicar', lectura: 'Leer' };
const ETIQUETA = { escena: 'Escena', predicciones: 'Práctica', lectura: 'Lectura' };
function avance(c, uni) { const us = unidadesDe(c, uni); return us.length ? us.filter(estudiada).length / us.length : 0; }
// Grado: una unidad de un grado mayor al del alumno es un "adelanto". No se oculta, pero va al final.
const adelanto = u => u.grado > (Number(est.grado) || 99);
const tagAdelanto = u => adelanto(u) ? `<span class="tag gris" title="Normalmente se ve en ${u.grado}.º de secundaria">Adelanto · ${u.grado}.º</span>` : '';
// Orden de estudio: primero lo de su grado; dentro, el cronograma de su universidad (semana o tema), intercalando cursos.
function cola(uni) {
  const todas = [];
  cat.cursos.forEach((c, ci) => unidadesDe(c, uni).forEach(u => todas.push({ c, u, a: adelanto(u) ? 1 : 0, k: Math.min(...(ubic(u, uni) || [99])), ci })));
  return todas.sort((a, b) => a.a - b.a || a.k - b.k || a.ci - b.ci);
}

// ---------- Recorrido: última actividad, próximo paso y compañero (docs/recorrido.md) ----------
// est.ultima = { hash, fecha }: la última pantalla de estudio o juego (no el inicio ni el perfil). Sirve para «Seguir donde
// quedaste» y para que el compañero reconozca lo que de verdad hizo el alumno.
const RUTAS_ACTIVIDAD = ['unidad', 'practica', 'lectura'];
function anotarUltima(ruta) {
  if (est.proximo && est.proximo.hash === location.hash) { est.proximo = null; guardar(); }
  const partes = location.hash.split('/');
  if (!RUTAS_ACTIVIDAD.includes(ruta) || (ruta === 'unidad' && !partes[3])) return;
  if (est.ultima && est.ultima.hash === location.hash && est.ultima.fecha === hoy()) return;
  est.ultima = { hash: location.hash, fecha: hoy() }; guardar();
}
// Título legible de una ruta guardada: «MRU, MRUV y caída libre · teoría».
function tituloRuta(hash) {
  const [, ruta, a, b, c] = String(hash || '').split('/');
  const SUB = { teoria: c === 'laboratorio' ? 'laboratorio' : c === 'ficha' ? 'ficha de repaso' : c === 'glosario' ? 'glosario' : 'teoría', ejercicios: 'ejercicios', examen: 'simulacro', entrada: 'prueba del tema' };
  if (ruta === 'unidad') { const cu = cursoDeUnidad(decodeURIComponent(a)), u = cu && cu.unidades.find(x => x.id === decodeURIComponent(a)); return u ? `${u.nombre}${SUB[b] ? ` · ${SUB[b]}` : ''}` : ''; }
  if (ruta === 'practica' || ruta === 'lectura') { const pl = cat.plantillas[decodeURIComponent(a)]; return pl ? pl.titulo : ''; }
  return '';
}
const cursoDeRuta = hash => { const [, ruta, a] = String(hash || '').split('/'); const id = decodeURIComponent(a || '');
  if (ruta === 'unidad') return cursoDeUnidad(id); const pl = cat.plantillas[id]; return pl ? cursoDeUnidad(pl.unidades[0]) : null; };
const diasDesde = f => (f ? Math.round((Date.parse(hoy()) - Date.parse(f)) / 864e5) : Infinity);
// El compañero de un curso y una de sus líneas (nucleo/teoria.js); {lugar} se cambia por el título de la actividad.
function companero(cursoId) { const P = window.Teoria && Teoria.PERSONAJES; return (P && (P[cursoId] || P.fisica)) || { nombre: '', voces: {} }; }
const lineaDe = (per, k, lugar) => String((per.voces || {})[k] || '').replace('{lugar}', lugar || 'tu última actividad');
const discreto = () => !!(est.prefs && est.prefs.discreto);

// ---------- Vistas ----------
const icono = id => Ilus.iconoCurso(id);

function vBienvenida() {
  $nav.hidden = true; document.body.dataset.ruta = 'bienvenida'; document.body.classList.remove('con-nav');
  const opc = Object.entries(cat.universidades).filter(([k]) => k !== 'una').map(([k, v]) =>
    `<button class="opcion${est.uni === k ? ' on' : ''}" data-uni="${k}"><span class="avatar" style="width:40px;height:40px;font-size:14px">${esc(UNI_SIGLA[k] || k)}</span><span><b>${esc(v.nombre)}</b><br><span class="sub">Ordenar todo según su temario</span></span></button>`).join('');
  $app.innerHTML = `<section class="bienvenida">
    <div class="hero">
      ${Ilus.escritorio('class="deco"')}
      <h1>Mueve las ideas.<br>Entiende el examen.</h1>
      <p>Física, química, matemática y razonamiento: juegas con la figura, predices y después ves por qué.</p>
      <a class="btn blanco muestra-btn" href="#/muestra">Probar una mesa sin registrarme ›</a>
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

// ---------- Cola de repaso (nucleo/repaso.js, app/repaso.js) ----------
// Una unidad entra a la cola cuando el alumno termina un ejercicio suyo (también los de las escenas, que guardan sus
// eventos por su cuenta); solo las que tienen generador, que es de donde salen las preguntas.
const unidadPorId = id => { const c = cursoDeUnidad(id); return c ? c.unidades.find(u => u.id === id) : null; };
// Generadores que pueden dar problemas de la unidad: los de una sola unidad, y los mixtos con alguna variante suya
// según nucleo/repaso-tipos.js (repasar «Conjuntos» con un problema de porcentajes no sería repasar conjuntos).
const generadoresRepaso = u => (window.RepasoTipos ? generadoresDe(u).filter(p => RepasoTipos.cubre(p, u.id)) : []);
// De dónde salen las preguntas de repaso de una unidad (orden de Gerson, 14 nov 2026): primero sus generadores; si no
// tiene, los problemas de lápiz y papel de sus escenas (autoevaluación, ver app/repaso.js).
function fuentesRepaso(u) {
  const gens = generadoresRepaso(u);
  const papeles = gens.length || !window.RepasoTipos ? [] : modulosDe(u).filter(p => p.formato !== 'lectura' && RepasoTipos.papelCubre(p, u.id));
  // Razonamiento verbal: los ejercicios sueltos y los textos de sus módulos de lectura (app/repaso.js elige).
  const lecturas = modulosDe(u).filter(p => p.formato === 'lectura' && p.banco);
  return { gens, papeles, lecturas, hay: gens.length + papeles.length + lecturas.length > 0 };
}
function sembrarRepaso() {
  if (!window.Repaso) return;
  try {
    const nuevas = Repaso.sembrar(est, eventos(), id => { const u = unidadPorId(id); return !!(u && fuentesRepaso(u).hay); });
    if (nuevas.length) guardar();
  } catch { /* el repaso nunca rompe la app */ }
}
function tarjetaRepaso() {
  if (!window.Repaso || !est.repaso || !Object.keys(est.repaso).length) return '';
  const h = Repaso.fechaLocal(Date.now()), n = Math.min(Repaso.pendientes(est, h).length, Repaso.quedanHoy(est, h));
  if (n) return `<a class="repaso-hoy" href="#/repaso"><span class="rh-ic" aria-hidden="true">↻</span>
      <span class="rh-tx"><span class="etq">Repaso de hoy</span><b>${n} ${n === 1 ? 'pregunta' : 'preguntas'} de lo que ya estudiaste</b>
      <span class="d">Unos ${Math.max(1, Math.round(n / 2))} min · para que no se te olvide</span></span><span class="rh-ir">Repasar ›</span></a>`;
  const prox = Repaso.proxima(est, h);
  return prox ? `<p class="sub repaso-prox">Tu próximo repaso: ${esc(new Date(prox + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }))}.</p>` : '';
}

function vInicio() {
  sembrarRepaso();
  const q = cola(est.uni), pend = q.filter(x => !estudiada(x.u));
  const conEscena = pend.find(x => !x.a && x.u.plantillas.length) || pend[0];
  const totalU = q.length, hechas = q.length - pend.length;
  const reto = conEscena ? `<div class="reto tinte" style="${Ilus.tinte(conEscena.c.id)}">${Ilus.viñeta(conEscena.c.id, 'class="reto-vineta vineta-flota"')}${Ilus.gato('class="reto-gato-mini"')}
      <div class="etq">Reto de hoy · ${esc(conEscena.c.nombre)}</div>
      <h3>${esc(conEscena.u.nombre)}</h3>
      <p>${conEscena.u.teoria ? 'Empieza por la teoría: lees, juegas y entiendes por qué.' : conEscena.u.plantillas.length ? 'Predice antes de ver la respuesta.' : esc(conEscena.u.temas.slice(0, 3).join(' · '))}</p>
      ${conEscena.u.teoria ? `<a class="btn tinta" href="#/unidad/${esc(conEscena.u.id)}/teoria">Estudiar la teoría ›</a>`
        : conEscena.u.plantillas.length
        ? `<a class="btn tinta" href="${esc(enlace(cat.plantillas[conEscena.u.plantillas[0]], conEscena.u.id))}" data-abrir="${esc(conEscena.u.id)}">${VERBO[cat.plantillas[conEscena.u.plantillas[0]].formato] || 'Abrir'} ›</a>`
        : `<a class="btn tinta" href="#/unidad/${esc(conEscena.u.id)}">Ver unidad ›</a>`}
    </div>` : `<div class="reto">${Ilus.gatoDormido('class="reto-gato"')}<h3>Estudiaste todas las unidades</h3><p>Ahora toca recordarlas: el repaso de hoy te espera.</p></div>`;
  // Lo que sigue: solo unidades con módulo (las demás no tienen nada que abrir todavía), una por curso primero
  // para que no salgan cuatro del mismo curso, y luego el resto en el orden del temario.
  const conModulo = pend.filter(x => x !== conEscena && cat.plantillas[x.u.plantillas[0]]);
  const cursosVistos = new Set(), primeras = conModulo.filter(x => !cursosVistos.has(x.c.id) && cursosVistos.add(x.c.id));
  // Si la unidad tiene teoría, «Lo que sigue» lleva a la teoría (Gerson, 15 nov: primero estudiar, después ejercitar).
  const sig = [...primeras, ...conModulo.filter(x => !primeras.includes(x))].slice(0, 4).map(x => `<a class="item" style="${Ilus.tinte(x.c.id)}" href="${esc(x.u.teoria ? `#/unidad/${x.u.id}/teoria` : enlace(cat.plantillas[x.u.plantillas[0]], x.u.id))}"${x.u.teoria ? '' : ` data-abrir="${esc(x.u.id)}"`}>${icono(x.c.id)}
      <span class="tx"><span class="t">${esc(x.u.nombre)}</span><br><span class="d">${esc(x.c.nombre)} · ${esc(etiquetaUbic(x.u, est.uni))}</span></span>
      <span class="ir">${tagAdelanto(x.u)}${x.u.teoria ? 'Teoría' : esc(ETIQUETA[cat.plantillas[x.u.plantillas[0]].formato] || 'Abrir')} ›</span></a>`).join('');
  // Tus cursos: carrusel de pegatinas con la viñeta de cada curso.
  const carrusel = cat.cursos.filter(c => unidadesDe(c, est.uni).length).map(c => { const a = avance(c, est.uni);
    return `<a class="cursito tinte" style="${Ilus.tinte(c.id)}" href="#/curso/${esc(c.id)}">${Ilus.viñeta(c.id)}<span class="t">${esc(c.nombre)}</span>
      <span class="barra" aria-label="${Math.round(a * 100)} % estudiado"><i style="width:${Math.round(a * 100)}%"></i></span></a>`; }).join('');
  const salidas = avisosSalida();
  // Seguir donde quedaste: el próximo paso que dejó al cerrar o, si no, la última actividad (hasta 21 días).
  const prox = est.proximo && diasDesde(est.proximo.fecha) <= 21 ? est.proximo : null;
  const ult = !prox && est.ultima && diasDesde(est.ultima.fecha) <= 21 ? est.ultima : null;
  const destino = prox || ult, tDest = destino && tituloRuta(destino.hash);
  const cursoComp = (destino && cursoDeRuta(destino.hash)) || (conEscena && conEscena.c) || cat.cursos[0];
  const per = companero(cursoComp && cursoComp.id);
  // La llegada se dice una vez por día; al volver a otra pantalla, el compañero no repite el saludo.
  const yaSaludo = sessionStorage.getItem('saludo') === hoy();
  sessionStorage.setItem('saludo', hoy());
  const linea = destino && tDest ? lineaDe(per, 'regreso', tDest) : yaSaludo ? '' : lineaDe(per, 'llegada');
  const seguir = destino && tDest ? `<div class="card seguir tinte" style="${Ilus.tinte(cursoComp.id)}">
      <div class="seguir-fila"><div class="mascota" data-mascota data-curso="${esc(cursoComp.id)}" aria-hidden="true"></div>
        <div><div class="etq">${prox ? 'Tu próximo paso' : 'Lo último que hiciste'}</div><h3>${esc(tDest)}</h3>
          ${linea && !discreto() ? `<p class="sub"><b>${esc(per.nombre)}</b> ${esc(linea)}</p>` : ''}</div></div>
      <a class="btn tinta" href="${esc(destino.hash)}">Seguir ›</a></div>`
    : linea && !discreto() ? `<div class="seguir-fila saludo-comp"><div class="mascota" data-mascota data-curso="${esc(cursoComp.id)}" aria-hidden="true"></div><p class="sub"><b>${esc(per.nombre)}</b> ${esc(linea)}</p></div>` : '';
  $app.innerHTML = `
    ${salidas.map(({ c, href }) => `<a class="aviso" style="display:block;text-decoration:none;margin-top:0" href="${esc(href)}">Tu profesor abrió la prueba de salida de ${esc(c.nombre)}. Hazla aquí ›</a>`).join('')}
    <header class="saludo"><span class="avatar">${esc((est.nombre || '?')[0].toUpperCase())}</span>
      <div><p class="sub">Hola${est.nombre ? `, ${esc(est.nombre)}` : ''} 👋</p><h1>¿Qué entendemos hoy?</h1></div>
      <span class="pildora-racha" title="Racha de estudio">${Ilus.mini.llama}${racha()}<span class="lector"> ${racha() === 1 ? 'día seguido' : 'días seguidos'}</span></span>
      ${esAlumnoCuenta() ? `${pildoraSync()}<a class="btn borde solo-grande" href="#/salir">Cerrar sesión</a>` : '<a class="btn borde solo-grande" href="#/otro">Otro alumno en esta PC</a>'}</header>
    <div class="col2 inicio"><div>
    ${seguir}
    ${tarjetaRepaso()}
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

// La primera vez que entra a un curso (o a una de sus unidades) con banco de pruebas, va primero la prueba de
// entrada. Curso de lectura: la entrada es el primer texto del módulo, una vez por sesión, para que el botón de volver
// deje ver el curso (al abrir cualquier ejercicio, la entrada vuelve a ir primero). Devuelve true si redirigió.
// Decisión de Gerson (14 nov): la prueba de entrada del CURSO es opcional (se ofrece en la página del curso, nunca se
// impone); la del TEMA tampoco: es opcional y va después de la teoría (decisión de Gerson, 15 nov). Se deja la función
// por si vuelve a hacer falta, pero no redirige.
function llevarAEntrada(c) {
  return false;
  // eslint-disable-next-line no-unreachable
  const PC = window.PruebaCurso;
  if (PC && PC.pideEntrada(ctxPrueba(), c.id) && !(est.pruebas[c.id] || {}).enCurso) { sessionStorage.setItem('prueba-auto-' + c.id, '1'); ir(`#/prueba/${c.id}/entrada`); return true; }
  const lec = lecturaConPrueba(c);
  if (lec && !lecturaSt(lec).entrada && sessionStorage.getItem('lectura-auto-' + c.id) !== '1') { sessionStorage.setItem('lectura-auto-' + c.id, '1'); ir(lec.url); return true; }
  return false;
}

// Dibujo esquemático de la unidad (app/dibujos/). Si su curso aún no tiene, va la viñeta del curso.
function cargarDibujos(curso) {
  return script('/app/dibujos/comun.js')
    .then(() => (window.Dibujos.CURSOS.includes(curso) ? script(`/app/dibujos/${curso}.js`) : null)).catch(() => null);
}
const dibujo = (c, u) => (window.Dibujos && Dibujos.svg(c.id, u.id)) || Ilus.viñeta(c.id, 'class="dib-resp"');
const modulosDe = u => u.plantillas.map(p => cat.plantillas[p]).filter(Boolean);
const textoEjercicios = n => (n ? `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}` : 'En preparación');

// Página del curso: el mapa del curso (16 nov 2026, pedido de Gerson). Las unidades van en ramas (Mecánica, Ondas y
// luz…), y cada rama es un árbol que se abre de lo básico a lo complejo: una unidad va debajo de lo que necesita, con
// una línea que las une (nucleo/mapa.js; los datos están en catalogo/cursos). Lo que necesita de otra rama o de otro
// curso va escrito en la tarjeta («Antes: …»). Una rama que no se apoya en otra dice que se puede empezar por ella.
// Se puede entrar a cualquier unidad; las que todavía no tienen sus requisitos se ven más suaves.
const COLOR_RAMA = ['c-i', 'c-o', 'c-d', 'c-f', 'c-h'];
const nombreUnidad = id => { const c = cursoDeUnidad(id), u = c && c.unidades.find(x => x.id === id); return u ? { c, u } : null; };
function vCurso(id) {
  const c = cat.cursos.find(x => x.id === id); if (!c) return ir('#/cursos');
  if (llevarAEntrada(c)) return;
  const PC = window.PruebaCurso, lec = lecturaConPrueba(c);
  const todas = sessionStorage.getItem('todas') === '1';
  const us = todas ? c.unidades : unidadesDe(c, est.uni);
  const hecha = uid => { const x = nombreUnidad(uid); return !!x && estudiada(x.u); };
  const m = Mapa.armar(c, { incluir: u => us.includes(u), hecha });
  const sig = Mapa.siguiente(m.ramas, u => !adelanto(u));
  const mio = Number(est.grado) || 0;
  const antes = n => n.fuera.length ? `<span class="nodo-antes">Antes: ${n.fuera.map(p => { const x = nombreUnidad(p); if (!x) return '';
    return `<a href="#/unidad/${esc(p)}"${hecha(p) ? ' class="ok"' : ''}>${esc(x.u.nombre)}${x.c.id !== c.id ? ` <small>(${esc(x.c.nombre)})</small>` : ''}</a>`; }).join(', ')}</span>` : '';
  const nodo = n => { const u = n.unidad;
    return `<div class="nodo${n.hecha ? ' hecha' : ''}${n.lista || n.hecha ? '' : ' espera'}${sig && sig.id === n.id ? ' sigue' : ''}" data-unidad="${esc(u.id)}" data-dentro="${esc(n.dentro.join(' '))}">
      <span class="lamina">${dibujo(c, u)}${n.hecha ? `<span class="hecho" title="${esc(nivelDe(u).nombre)}">✓<span class="lector"> ${esc(nivelDe(u).nombre)}</span></span>` : ''}</span>
      <a class="t nodo-ir" href="#/unidad/${esc(u.id)}">${esc(u.nombre)}</a>
      <span class="nodo-g"><span class="tag ${u.grado === mio ? 'acento' : 'gris'}">${u.grado}.º</span>${sig && sig.id === n.id ? '<span class="tag">Sigue aquí</span>' : ''}</span>
      <span class="d">${u.teoria ? esc(textoTeoriaCorto(u)) : textoEjercicios(modulosDe(u).length)}</span>${antes(n)}</div>`; };
  const ramas = m.ramas.map((r, k) => {
    const otras = r.necesita.map(j => `«${esc(c.ramas[j].nombre)}»`).join(' y ');
    const dep = r.independiente ? '<span class="rama-dep libre">No necesita otra rama: puedes empezar por aquí</span>'
      : r.conEntrada ? `<span class="rama-dep"><b class="libre">Puedes empezar por aquí.</b> Algunos temas se apoyan en ${otras}.</span>`
        : `<span class="rama-dep">Antes, conviene ver ${otras}.</span>`;
    return `<details class="rama" open style="--rama:var(--${COLOR_RAMA[r.i % COLOR_RAMA.length]})">
      <summary><span class="rama-cab"><span class="rama-n">Rama ${k + 1}</span><span class="rama-t">${esc(r.nombre)}</span>
        <span class="rama-av">${r.hechas} de ${r.nodos.length}</span></span>${dep}</summary>
      <div class="rama-arbol"><svg class="rama-lineas" aria-hidden="true"></svg>
        ${r.pisos.map(f => `<div class="rama-piso">${f.map(nodo).join('')}</div>`).join('')}</div></details>`; }).join('');
  const pc = Math.round(avance(c, todas ? '' : est.uni) * 100);
  const sigue = sig ? `<a class="card mapa-sigue" href="#/unidad/${esc(sig.id)}"><span class="lamina">${dibujo(c, sig.unidad)}</span>
      <span class="ms-tx"><span class="etq-p">${pc ? 'Lo que sigue' : 'Empieza aquí'}</span><b>${esc(sig.unidad.nombre)}</b>
      <span>${sig.dentro.length || sig.fuera.length ? 'Ya tienes lo que necesita antes.' : 'No necesita ningún tema antes.'}</span></span><span class="ms-ir" aria-hidden="true">›</span></a>` : '';
  $app.innerHTML = `<header class="curso-hero tinte" style="${Ilus.tinte(c.id)}">${Ilus.viñeta(c.id, 'class="vin vineta-flota"')}
    <a class="volver" href="#/cursos" aria-label="Volver">‹</a>
    <h1>${esc(c.nombre)}</h1><p class="sub">${esc(AREA_TXT[c.area])} · ${us.length} unidades · ${pc} % estudiado</p>
    <span class="barra" aria-hidden="true"><i style="width:${pc}%"></i></span>
    <div class="chips"><button class="chip${todas ? '' : ' on'}" data-todas="0">${esc(UNI_CORTA[est.uni] || 'Mi universidad')}</button><button class="chip${todas ? ' on' : ''}" data-todas="1">Todas las unidades</button></div></header>
    ${sigue}
    <p class="mapa-guia">Cada rama va <b>de lo básico a lo complejo</b>: un tema se apoya en el que tiene arriba, unido por la línea. Puedes entrar a cualquiera; los que se ven más suaves te costarán menos si antes ves lo de arriba.</p>
    <div class="mapa" style="${Ilus.tinte(c.id)}">${ramas}</div>
    ${PC || lec ? `<div class="pruebas-curso">${PC ? PC.tarjeta(ctxPrueba(), c.id) : ''}${lec ? tarjetaLectura(lec, c) : ''}</div>` : ''}`;
  $app.querySelectorAll('[data-todas]').forEach(b => b.onclick = () => { sessionStorage.setItem('todas', b.dataset.todas); vCurso(id); });
  const mapa = $app.querySelector('.mapa');
  lineasMapa(mapa);
  mapa.querySelectorAll('.rama').forEach(d => d.addEventListener('toggle', () => lineasMapa(mapa)));
  vigilarAncho(mapa, () => lineasMapa(mapa));
  // Al volver de una unidad, su tarjeta queda a la vista y con el foco.
  const ult = sessionStorage.getItem('ultima-unidad'), t = ult && mapa.querySelector(`[data-unidad="${CSS.escape(ult)}"] .nodo-ir`);
  if (t) { t.focus({ preventScroll: true }); t.closest('.nodo').scrollIntoView({ block: 'center' }); }
}

// Las líneas del árbol: de cada unidad a las que necesita en su rama (abajo de una al centro de arriba de la otra).
// Se miden en la pantalla, así sirven con cualquier ancho; la línea es de color si el requisito ya está hecho.
function lineasMapa(mapa) {
  mapa.querySelectorAll('.rama[open] .rama-arbol').forEach(a => {
    const svg = a.querySelector('.rama-lineas'), r0 = a.getBoundingClientRect(), caja = id => a.querySelector(`[data-unidad="${CSS.escape(id)}"]`);
    svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`); svg.setAttribute('width', r0.width); svg.setAttribute('height', r0.height);
    svg.innerHTML = [...a.querySelectorAll('.nodo[data-dentro]')].flatMap(n => n.dataset.dentro.split(' ').filter(Boolean).map(p => {
      const de = caja(p); if (!de) return '';
      const a1 = de.getBoundingClientRect(), b1 = n.getBoundingClientRect();
      const x1 = a1.left + a1.width / 2 - r0.left, y1 = a1.bottom - r0.top, x2 = b1.left + b1.width / 2 - r0.left, y2 = b1.top - r0.top, ym = (y1 + y2) / 2;
      return `<path class="${de.classList.contains('hecha') ? 'ok' : ''}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${ym.toFixed(1)} ${x2.toFixed(1)} ${ym.toFixed(1)} ${x2.toFixed(1)} ${(y2 - 4).toFixed(1)}"/>`;
    })).join('');
  });
}
// Vuelve a dibujar cuando cambia el ancho (girar el celular, achicar la ventana); deja de mirar al salir de la página.
function vigilarAncho(el, fn) {
  if (!window.ResizeObserver) return;
  let w = el.clientWidth, pend = false;
  const ro = new ResizeObserver(() => { if (!el.isConnected) return ro.disconnect();
    if (el.clientWidth === w || pend) return; w = el.clientWidth; pend = true; requestAnimationFrame(() => { pend = false; fn(); }); });
  ro.observe(el);
}

// Tarjeta de las pruebas del módulo de lectura en la página del curso (como la de PruebaCurso).
function tarjetaLectura(p, c) {
  const st = lecturaSt(p);
  if (!st.entrada) return `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de entrada pendiente</div>
    <p>Opcional. Un texto corto con preguntas. No es nota: sirve para ver de dónde partes.</p><a class="btn borde" href="${esc(p.url)}/entrada">Hacer la prueba de entrada ›</a></div>`;
  if (!st.salida) return salidaAbierta(c.id)
    ? `<div class="card prueba-tarjeta destacada"><div class="etq-p">Prueba de salida</div>
      <p>Tu profesor ya la abrió. Es un texto parecido al de la entrada, y al final ves cuánto avanzaste.</p><a class="btn morado" href="${esc(p.url)}/salida">Hacer la prueba de salida ›</a></div>`
    : `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de salida</div><p>La prueba de salida la abre tu profesor cuando terminen el curso.</p></div>`;
  return `<div class="card prueba-tarjeta"><div class="etq-p">Pruebas del curso</div>
    <p>Entrada ${st.entrada.aciertos} de ${st.entrada.total} · Salida <b>${st.salida.aciertos} de ${st.salida.total}</b></p></div>`;
}

// ---------- Página de la unidad: cuatro puertas (teoría, ejercicios, exámenes y dejar una pregunta) ----------
// Íconos de trazo de 24 con currentColor (docs/diseno.md).
const ICONO_PUERTA = {
  teoria: '<path d="M12 6c-3-2-6-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zM12 6v13"/>',
  ejercicios: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',
  examen: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13l2 2 4-4"/>',
  entrada: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6"/>',
  pregunta: '<path d="M4 5h16v11H11l-5 4v-4H4zM10 9a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1V12M12 14.2v.1"/>',
  laboratorio: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9"/>',
};
const iconoPuerta = k => `<svg class="ic-puerta" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${ICONO_PUERTA[k]}</svg>`;
const SUB_UNIDAD = { teoria: 'Teoría', ejercicios: 'Ejercicios', examen: 'Exámenes', pregunta: 'Dejar una pregunta', entrada: 'Prueba del tema' };
// La prueba del tema (opcional, después de la teoría; se puede volver a tomar): lo que dice su puerta.
function textoPruebaTema(u) {
  const tm = (est.temas || {})[u.id] || {}, ult = (tm.intentos && tm.intentos[tm.intentos.length - 1]) || tm.entrada;
  return ult ? `Última: ${ult.aciertos} de ${ult.total} · volver a tomarla` : `Opcional: ${u.teoria.ideas || 0} preguntas para comprobar lo que aprendiste`;
}
const N_EXAMEN = 5;
const generadoresDe = u => modulosDe(u).filter(p => p.formato === 'predicciones');

// En la tarjeta de la unidad (página del curso): la teoría primero (15 nov), en corto.
function textoTeoriaCorto(u) {
  const st = (est.teoria || {})[u.id], n = u.teoria.ideas || 0, h = st ? Object.values(st.ideas || {}).filter(i => i.hecha).length : 0;
  return h ? `Teoría: ${h} de ${n} ideas` : `Teoría · ${n} ${n === 1 ? 'idea' : 'ideas'}`;
}
// Lo que dice la puerta de la teoría: cuántas ideas tiene y cuántas terminó el alumno.
function textoTeoria(u) {
  const st = (est.teoria || {})[u.id], n = u.teoria.ideas || 0;
  const h = st ? Object.values(st.ideas || {}).filter(i => i.hecha).length : 0;
  return h ? `${h} de ${n} ideas terminadas` : `${n} ${n === 1 ? 'idea' : 'ideas'} para jugar y entender`;
}
function vUnidad(id, sub) {
  const c = cursoDeUnidad(id), u = c && c.unidades.find(x => x.id === id);
  if (!u) return ir('#/cursos');
  if (llevarAEntrada(c)) return;
  sessionStorage.setItem('ultima-unidad', id);
  if (sub === 'entrada') return vEntradaTema(c, u);
  // La prueba del tema es opcional y va después de la teoría (decisión de Gerson, 15 nov): ya no se impone antes de nada.
  if (sub === 'teoria') return vTeoria(c, u);
  if (sub === 'ejercicios') return vEjercicios(c, u);
  if (sub === 'examen') return vExamen(c, u);
  if (sub === 'pregunta') return vPregunta(c, u);
  const n = modulosDe(u).length, gens = generadoresDe(u).length, ex = (est.examenes || {})[id];
  const primeraVisita = est.vistas[id] || hoy();
  est.vistas[id] = primeraVisita;   // abrir la unidad es una visita (no la acredita como estudiada)
  const nv = nivelDe(u), marcada = !!(est.marcadas || {})[id];
  const puerta = (k, d, principal) => `<a class="puerta puerta-${k}${principal ? ' principal' : ''}" href="#/unidad/${esc(id)}/${k}">${iconoPuerta(k)}<span class="t">${SUB_UNIDAD[k]}</span><span class="d">${d}</span></a>`;
  $app.innerHTML = `<header class="unidad-hero tinte" style="${Ilus.tinte(c.id)}">
      <a class="volver" href="#/curso/${esc(c.id)}" aria-label="Volver a ${esc(c.nombre)}">‹</a>
      <div class="uh-cuerpo"><span class="lamina">${dibujo(c, u)}</span>
        <div><p class="sub">${esc(c.nombre)} · ${u.grado}.º de secundaria</p><h1>${esc(u.nombre)}</h1></div></div>
      <p class="sub temas">${esc(u.temas.join(' · '))}</p>
      ${(est.temas || {})[id] && est.temas[id].entrada ? `<p class="sub">Prueba del tema: ${est.temas[id].entrada.aciertos} de ${est.temas[id].entrada.total} ideas acertadas</p>` : ''}
      <div class="nivel-u">${nv.nivel > 0 || (nv.nivel === 0 && primeraVisita < hoy()) ? `<span class="tag nivel-${nv.nivel}">${esc(nv.nombre)}</span>` : ''}${nv.falta ? `<span class="sub">${esc(nv.nivel < 1 ? `Para empezar: ${nv.falta.charAt(0).toLowerCase()}${nv.falta.slice(1)}` : nv.falta)}</span>` : ''}</div>
      <button type="button" class="marca-vista${marcada ? ' on' : ''}" data-ver aria-pressed="${marcada}"><span class="caja-v" aria-hidden="true">${marcada ? '✓' : ''}</span>${marcada ? 'La marqué como estudiada' : 'Ya la estudié por mi cuenta'}</button>
    </header>
    <nav class="puertas aparece" aria-label="Qué hacer en esta unidad">
      ${puerta('teoria', u.teoria ? textoTeoria(u) : 'En preparación', !!u.teoria)}
      ${u.teoria ? `<a class="puerta puerta-laboratorio" href="#/unidad/${esc(id)}/teoria/laboratorio">${iconoPuerta('laboratorio')}<span class="t">Laboratorio</span><span class="d">Juega libre, sin preguntas</span></a>` : ''}
      ${puerta('ejercicios', textoEjercicios(n), !u.teoria && n > 0)}
      ${puerta('examen', gens ? (ex ? `Último: ${ex.ultimo.aciertos} de ${ex.ultimo.total}` : `${N_EXAMEN} preguntas tipo examen`) : 'En preparación')}
      ${u.teoria ? puerta('entrada', textoPruebaTema(u)) : ''}
      ${puerta('pregunta', 'Para tu profesor')}
    </nav>`;
  $app.querySelector('[data-ver]').onclick = () => {
    est.marcadas = est.marcadas || {};
    if (est.marcadas[id]) delete est.marcadas[id]; else { est.marcadas[id] = hoy(); marcarDia(); }
    ixAvance = null; guardar(); vUnidad(id);
  };
}

// Cabecera de las páginas dentro de una unidad: volver a la unidad, su dibujo chico y el título de la sección.
const cabUnidad = (c, u, titulo) => `<header class="unidad-cab tinte" style="${Ilus.tinte(c.id)}">
    <a class="volver" href="#/unidad/${esc(u.id)}" aria-label="Volver a ${esc(u.nombre)}">‹</a>
    <span class="lamina">${dibujo(c, u)}</span><div><p class="sub">${esc(c.nombre)} · ${esc(u.nombre)}</p><h1>${esc(titulo)}</h1></div></header>`;

// Prueba de entrada del tema (app/teoria.js, Teoria.entrada): pendiente si la unidad tiene teoría y aún no la hizo.
function vEntradaTema(c, u) {
  if (!u.teoria) return ir(`#/unidad/${u.id}`);
  cuandoListo(modulo('teoria'), () => Teoria.entrada({ $app, cat, est, esc, guardar, registrar, marcarDia, cab: t => cabUnidad(c, u, t) }, u));
}

// Teoría (docs/teoria.md): si la unidad del catálogo trae `teoria` ({ archivo, requiere }, lo pone construir-catalogo.js
// cuando existe contenido/teoria/<curso>/<unidad>.js), app/teoria.js la muestra. Si no, esta pantalla dice qué vendrá
// y manda a lo que sí hay.
function vTeoria(c, u) {
  if (u.teoria) return cuandoListo(modulo('teoria'), () => Teoria.vista({ $app, cat, est, esc, guardar, registrar, marcarDia, cab: t => cabUnidad(c, u, t) }, u));
  const n = modulosDe(u).length;
  $app.innerHTML = `${cabUnidad(c, u, 'Teoría')}
    <div class="card prep-teoria">${Ilus.gatoDormido('class="prep-gato" width="120"')}
      <span class="tag gris">En preparación</span>
      <h2>Estamos escribiendo esta teoría</h2>
      <p>Van a ser lecciones cortas, de dos o tres minutos, con un dibujo que se mueve. Esta unidad tendrá:</p>
      <ul class="temas-l">${u.temas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="sub">Mientras tanto, ${n ? 'los ejercicios te muestran la idea paso a paso y te explican cada error.' : 'puedes dejarle una pregunta a tu profesor.'}</p>
      ${n ? `<a class="btn morado" href="#/unidad/${esc(u.id)}/ejercicios">Ir a los ejercicios ›</a>` : `<a class="btn morado" href="#/unidad/${esc(u.id)}/pregunta">Dejar una pregunta ›</a>`}
    </div>`;
}

// Ejercicios: lo que antes era la pila de botones de la tarjeta, ordenado (escenas, prácticas, lectura) y con lo que
// pide cada uno. Toda la tarjeta abre el ejercicio; «Lápiz y papel» es un enlace aparte, debajo.
const ORDEN_FORMATO = { escena: 0, predicciones: 1, lectura: 2 };
const QUE_ES = { escena: 'Predices y después lo ves moverse', predicciones: 'Preguntas que te explican tu error', lectura: 'Textos cortos con preguntas' };
const ICONO_FORMATO = {
  escena: '<path d="M8 5v14l11-7z"/>',
  predicciones: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  lectura: '<path d="M12 6c-3-2-6-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zM12 6v13"/>',
};
function vEjercicios(c, u) {
  const pl = modulosDe(u).sort((a, b) => ORDEN_FORMATO[a.formato] - ORDEN_FORMATO[b.formato]);
  const fila = p => `<article class="ej" style="${Ilus.tinte(c.id)}">
      <span class="ej-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24">${ICONO_FORMATO[p.formato] || ICONO_FORMATO.predicciones}</svg></span>
      <span class="ej-tx"><span class="etq-f">${esc(ETIQUETA[p.formato] || 'Ejercicio')}</span>
        <a class="t" href="${esc(enlace(p, u.id))}" data-abrir="${esc(u.id)}">${esc(p.formato === 'lectura' ? `Lectura: ${u.nombre}` : p.titulo)}</a>
        <span class="d">${esc(QUE_ES[p.formato] || '')}</span></span>
      <span class="ej-ir" aria-hidden="true"><span class="v">${esc(VERBO[p.formato] || "Abrir")}</span> ›</span>
      ${p.papel ? `<a class="ej-papel" href="#/papel/${esc(p.id)}">✎ Lápiz y papel<span class="lector">: ${esc(p.titulo)}</span></a>` : ''}
    </article>`;
  $app.innerHTML = `${cabUnidad(c, u, 'Ejercicios')}
    ${pl.length ? `<div class="lista ejercicios aparece">${pl.map(fila).join('')}</div>`
      : `<div class="vacio">${Ilus.gatoDormido('width="140"')}<p>Esta unidad todavía no tiene ejercicios. Estamos haciéndolos; mientras, puedes dejarle una pregunta a tu profesor.</p>
        <a class="btn morado" href="#/unidad/${esc(u.id)}/pregunta">Dejar una pregunta ›</a></div>`}`;
}

// Exámenes: un simulacro de la unidad con los generadores de sus prácticas, como en el examen de admisión: cinco
// preguntas, sin pistas ni corrección hasta terminar, con la opción de dejar en blanco. No usa el banco de entrada y
// salida (catalogo/pruebas/), para no gastar esas preguntas ni mezclar la medición. Cada intento trae preguntas
// nuevas (semilla: alumno, unidad e intento). Se registra un 'examen-item' por pregunta y un 'examen' al final.
const textoPlano = (partes, esc) => (partes || []).map(x => (typeof x === 'string' ? esc(x)
  : x.formula ? `<span class="formula">${esc(x.t)}</span>` : `<b>${esc(x.t)}</b>`)).join('');
async function vExamen(c, u) {
  const gens = generadoresDe(u), h = location.hash;
  if (!gens.length) {
    $app.innerHTML = `${cabUnidad(c, u, 'Exámenes')}<div class="vacio">${Ilus.gatoDormido('width="140"')}
      <p>Todavía no hay preguntas tipo examen para esta unidad. Las estamos preparando.</p>
      ${modulosDe(u).length ? `<a class="btn morado" href="#/unidad/${esc(u.id)}/ejercicios">Ir a los ejercicios ›</a>` : ''}</div>`;
    return;
  }
  $app.innerHTML = `${cabUnidad(c, u, 'Exámenes')}<p class="vacio">Cargando preguntas…</p>`;
  let fabricas;
  try {
    await modulo('examen');
    fabricas = (await Promise.all(gens.map(p => script(p.archivos[0]).then(() => window.Generadores && window.Generadores[p.id], () => null)))).filter(Boolean);
    if (!fabricas.length) throw new Error();
  } catch { if (location.hash === h) $app.querySelector('.vacio').textContent = 'No se pudieron cargar las preguntas. Ábrelas una vez con internet para tenerlas sin conexión.'; return; }
  if (location.hash !== h) return;
  est.examenes = est.examenes || {};
  const reg = est.examenes[u.id] = Object.assign({ intentos: 0, ultimo: null }, est.examenes[u.id] || {});
  const intento = reg.intentos + 1;
  // Simulacro que se retoma (P0-C): las preguntas salen de semillas fijas por intento, así que basta guardar dónde
  // iba y qué marcó. Si el intento guardado es otro (ya se terminó), se empieza uno nuevo.
  const guardado = reg.enCurso && reg.enCurso.intento === intento ? reg.enCurso : null;
  // Cinco preguntas repartidas entre los generadores de la unidad; si una semilla no da alternativas, se prueba otra.
  const preguntas = [];
  for (let i = 0, k = 0; preguntas.length < N_EXAMEN && k < N_EXAMEN * 4; k++) {
    const g = fabricas[i % fabricas.length];
    try { const p = g.generar(`examen-${est.alumno}-${u.id}-${intento}-${k}`); if (p && Array.isArray(p.alternativas) && p.alternativas.length > 1) { preguntas.push({ g, p }); i++; } } catch { /* semilla sin problema válido: otra */ }
  }
  if (!preguntas.length) { $app.querySelector('.vacio').textContent = 'No se pudieron armar las preguntas de esta unidad.'; return; }
  const resp = guardado ? preguntas.map((_, k) => guardado.resp[k] || null) : preguntas.map(() => null);
  const tiempos = guardado ? preguntas.map((_, k) => guardado.tiempos[k] || 0) : preguntas.map(() => 0);
  const t0 = Date.now() - (guardado ? guardado.ms || 0 : 0);
  let i = guardado ? Math.min(guardado.i, preguntas.length - 1) : 0, tPreg = Date.now();
  const anotarCurso = () => { reg.enCurso = { intento, i, resp: resp.slice(), tiempos: tiempos.slice(), ms: Date.now() - t0 }; guardar(); };

  function intro() {
    $app.innerHTML = `${cabUnidad(c, u, 'Exámenes')}
      <div class="card ex-intro"><span class="etq-p">Simulacro de la unidad${reg.intentos ? ` · intento ${intento}` : ''}</span>
        <h2>${preguntas.length} preguntas como las del examen de admisión</h2>
        <ul class="temas-l"><li>Sin pistas: la corrección llega al final, con la explicación de cada error.</li>
          <li>Puedes dejar preguntas en blanco y volver a ellas antes de terminar.</li>
          <li>Si sales, queda guardado donde ibas. Cada intento nuevo trae preguntas nuevas.</li></ul>
        ${reg.ultimo ? `<p class="sub">La última vez: ${reg.ultimo.aciertos} de ${reg.ultimo.total} correctas${reg.mejor ? ` · tu mejor: ${Math.round(reg.mejor * preguntas.length)} de ${preguntas.length}` : ''}.</p>` : ''}
        <button type="button" class="btn morado" id="empezar">${guardado ? `Seguir en la pregunta ${i + 1}` : 'Empezar el simulacro'}</button></div>`;
    document.getElementById('empezar').onclick = () => { tPreg = Date.now(); anotarCurso(); pregunta(); };
  }
  function pregunta() {
    const { p } = preguntas[i], ultima = i === preguntas.length - 1;
    $app.innerHTML = `${cabUnidad(c, u, 'Exámenes')}
      <div class="ex-puntos" aria-hidden="true">${preguntas.map((_, k) => `<span class="${k === i ? 'aqui' : ''}${resp[k] ? ' resp' : ''}"></span>`).join('')}</div>
      <article class="card practica ex-preg"><div class="etq-p">Pregunta ${i + 1} de ${preguntas.length}</div>
        <p class="enun">${textoPlano(p.enunciado, esc)}</p>${p.datos ? `<p class="sub">${esc(p.datos)}</p>` : ''}
        ${p.figura && typeof p.figura.svg === 'string' && /^<svg[\s>]/.test(p.figura.svg) ? `<figure class="fig-gen" role="img" aria-label="${esc(p.figura.alt || 'Figura del problema')}">${p.figura.svg}</figure>` : ''}
        <p class="preg">${textoPlano(p.pregunta, esc)}</p>
        <div class="alts" role="group" aria-label="Alternativas">${p.alternativas.map(a => `<button type="button" class="alt${resp[i] === a.letra ? ' on' : ''}" data-letra="${a.letra}" aria-pressed="${resp[i] === a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.texto)}</span></button>`).join('')}</div>
        <p class="ex-blanco" role="status">${resp[i] ? `Marcaste la ${resp[i]}. Puedes cambiarla.` : 'Sin marcar: si sigues, queda en blanco.'}</p>
      </article>
      <div class="ex-nav"><button type="button" class="btn borde" id="ant"${i ? '' : ' style="visibility:hidden"'}>‹ Anterior</button>
        <button type="button" class="btn morado" id="sig">${ultima ? 'Terminar ›' : 'Siguiente ›'}</button></div>`;
    $app.querySelectorAll('.alt').forEach(b => b.onclick = () => {
      resp[i] = resp[i] === b.dataset.letra ? null : b.dataset.letra; // tocar otra vez la misma la desmarca
      $app.querySelectorAll('.alt').forEach(x => { const on = x.dataset.letra === resp[i]; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      $app.querySelector('.ex-blanco').textContent = resp[i] ? `Marcaste la ${resp[i]}. Puedes cambiarla.` : 'Sin marcar: si sigues, queda en blanco.';
      $app.querySelectorAll('.ex-puntos span')[i].classList.toggle('resp', !!resp[i]);
      anotarCurso();
    });
    const mover = d => { tiempos[i] += Date.now() - tPreg; tPreg = Date.now(); i += d; anotarCurso(); window.scrollTo(0, 0); pregunta(); };
    document.getElementById('ant').onclick = () => mover(-1);
    document.getElementById('sig').onclick = () => (ultima ? (tiempos[i] += Date.now() - tPreg, terminar()) : mover(1));
  }
  function terminar() {
    let aciertos = 0, blancos = 0;
    // Para no registrar dos veces el mismo intento (por ejemplo, si se toca «Terminar» dos veces), se cierra primero.
    if (!reg.enCurso && reg.intentos >= intento) return;
    const porRegistrar = [];
    preguntas.forEach(({ g, p }, k) => {
      const a = resp[k] && p.alternativas.find(x => x.letra === resp[k]);
      if (!a) blancos++; else if (a.correcta) aciertos++;
      porRegistrar.push(a ? { tipo: 'examen-item', curso: c.id, unidad: u.id, plantilla: g.id, problema: p.id, opcion: a.letra, correcta: !!a.correcta, error: a.correcta ? '' : (a.error || {}).id || '', ms: tiempos[k] }
        : { tipo: 'examen-item', curso: c.id, unidad: u.id, plantilla: g.id, problema: p.id, opcion: '', correcta: false, error: '', nose: true, ms: tiempos[k] });
    });
    porRegistrar.push({ tipo: 'examen', curso: c.id, unidad: u.id, aciertos, total: preguntas.length, nose: blancos, respuestas: resp.map(x => x || '0').join(''), ms: Date.now() - t0 });
    const antes = reg.ultimo;
    reg.intentos = intento; reg.ultimo = { aciertos, total: preguntas.length, blancos, fecha: hoy() };
    reg.mejor = Math.max(reg.mejor || 0, aciertos / preguntas.length);
    delete reg.enCurso; guardar(); marcarDia();
    // Primero queda cerrado el intento y después se registran sus eventos: si se corta aquí, no se duplica.
    porRegistrar.forEach(registrar);
    const min = Math.max(1, Math.round((Date.now() - t0) / 60000));
    $app.innerHTML = `${cabUnidad(c, u, 'Exámenes')}
      <div class="card ex-nota"><div class="n">${aciertos}<span> de ${preguntas.length}</span></div><div class="l">correctas${blancos ? ` · ${blancos} en blanco` : ''} · ${min} min</div>
        ${antes ? `<p class="sub">La vez anterior: ${antes.aciertos} de ${antes.total}. ${aciertos > antes.aciertos ? 'Mejoraste.' : aciertos === antes.aciertos ? 'Igual que antes.' : 'Esta vez fueron menos; revisa abajo qué preguntas cambiaron.'}</p>` : ''}
        <div class="acciones-prueba"><a class="btn morado" href="#/unidad/${esc(u.id)}/examen" id="otro">Otro simulacro</a><a class="btn borde" href="#/unidad/${esc(u.id)}">Volver a la unidad</a></div></div>
      <h2>Revisa cada pregunta</h2>
      <div class="lista">${preguntas.map(({ p }, k) => {
        const a = resp[k] && p.alternativas.find(x => x.letra === resp[k]), ok = p.alternativas.find(x => x.correcta);
        const estado = !a ? ['blanco', 'En blanco'] : a.correcta ? ['bien', 'Correcta'] : ['malo', 'Incorrecta'];
        return `<article class="card ex-rev"><div class="etq-p">Pregunta ${k + 1} · <span class="ex-${estado[0]}">${estado[1]}</span></div>
          <p class="enun">${textoPlano(p.enunciado, esc)} <b>${textoPlano(p.pregunta, esc)}</b></p>
          <p>${a && !a.correcta ? `Marcaste la ${a.letra}: ${esc(a.texto)}. ` : ''}La respuesta es la <b>${ok.letra}: ${esc(ok.texto)}</b>.</p>
          ${a && !a.correcta && a.error && a.error.explicacion ? `<div class="retro malo"><p style="margin:0">${esc(a.error.explicacion)}</p></div>` : ''}
          ${Array.isArray(p.solucion) && p.solucion.length ? `<details><summary>Solución paso a paso</summary><ol class="sol">${p.solucion.map(q => `<li>${textoPlano(q, esc)}</li>`).join('')}</ol></details>` : ''}
        </article>`; }).join('')}</div>`;
    // El enlace apunta a la misma ruta: se vuelve a pintar a mano, con un intento nuevo.
    document.getElementById('otro').onclick = e => { e.preventDefault(); window.scrollTo(0, 0); vExamen(c, u); };
    window.scrollTo(0, 0);
  }
  intro();
}

// Dejar una pregunta: la duda viaja con la medición como evento { tipo: 'pregunta', curso, unidad, texto }. Sin cuenta
// queda en este equipo y sale en «Descargar datos para el profesor»; con cuenta se sube con la cola de eventos
// (POST /api/eventos acepta cualquier tipo). La confirmación dice lo que de verdad pasó.
const MAX_PREGUNTA = 500;
function vPregunta(c, u) {
  const mias = () => eventos().filter(e => e.tipo === 'pregunta' && e.unidad === u.id && e.alumno === est.alumno).reverse();
  const descargado = localStorage.getItem(CLAVE_EXPORTADO) || '';
  const estadoDe = e => (esAlumnoCuenta() ? (ses.info().pendientes ? 'Guardada en este equipo, por enviar' : 'Enviada')
    : String(e.t) <= descargado ? 'Entregada en la descarga para el profesor' : 'Guardada en este equipo');
  const lista = () => { const l = mias(); return l.length ? `<h2>Tus preguntas de esta unidad</h2><div class="lista">${l.map(e => `<article class="card preg-hecha">
      <p>${esc(e.texto)}</p><span class="sub">${esc(new Date(e.t).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }))} · ${esc(estadoDe(e))}</span></article>`).join('')}</div>` : ''; };
  $app.innerHTML = `${cabUnidad(c, u, 'Dejar una pregunta')}
    <form class="card form-preg" id="fPreg" novalidate>
      <label for="duda"><b>¿Qué no te quedó claro de «${esc(u.nombre)}»?</b></label>
      <textarea id="duda" rows="5" maxlength="${MAX_PREGUNTA}" placeholder="Con tus palabras. Por ejemplo: «No entiendo el paso donde…»" aria-describedby="avisoPreg estadoPreg"></textarea>
      <div class="preg-pie"><span class="sub" id="avisoPreg">Tu profesor la lee sin tu nombre. No escribas datos personales.</span><span class="sub cuenta-c" aria-hidden="true">0/${MAX_PREGUNTA}</span></div>
      <p class="estado-preg" id="estadoPreg" role="status"></p>
      <button class="btn morado" id="enviarPreg">${esAlumnoCuenta() ? 'Enviar pregunta' : 'Guardar pregunta'}</button>
    </form><div id="misPreg">${lista()}</div>`;
  const ta = document.getElementById('duda'), st = document.getElementById('estadoPreg'), cuenta = $app.querySelector('.cuenta-c');
  const decir = (t, clase = '') => { st.textContent = t; st.className = 'estado-preg' + (clase ? ' ' + clase : ''); };
  ta.oninput = () => { cuenta.textContent = `${ta.value.length}/${MAX_PREGUNTA}`; if (st.classList.contains('falta') && ta.value.trim()) decir(''); };
  let quitar = null;
  document.getElementById('fPreg').onsubmit = e => {
    e.preventDefault();
    const texto = ta.value.trim().slice(0, MAX_PREGUNTA);
    if (!texto) { decir('Escribe tu pregunta antes de guardarla.', 'falta'); ta.focus(); return; }
    if (!registrar({ tipo: 'pregunta', curso: c.id, unidad: u.id, texto })) {
      decir('No se pudo guardar en este equipo (puede estar lleno o en modo privado). Copia tu pregunta y dísela a tu profesor.', 'falta'); return;
    }
    ta.value = ''; cuenta.textContent = `0/${MAX_PREGUNTA}`;
    document.getElementById('misPreg').innerHTML = lista();
    if (!esAlumnoCuenta()) { decir('Guardada en este equipo. Llega a tu profesor con la descarga de datos.', 'ok'); return; }
    // Con cuenta: se intenta subir ya. «Enviada» solo cuando el servidor confirmó y no queda nada por subir.
    decir(navigator.onLine === false ? 'Guardada en este equipo. Se enviará sola cuando vuelva la señal.' : 'Guardada en este equipo. Enviando…');
    if (quitar) quitar();
    const ver = i => {
      if (!document.body.contains(st)) { if (quitar) quitar(); return; }
      if (i.estado === 'guardado' && !i.pendientes) { decir(`Enviada a tu profesor (${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })})`, 'ok'); document.getElementById('misPreg').innerHTML = lista(); if (quitar) quitar(); }
      else if (i.estado === 'vencida') decir('Guardada en este equipo. Vuelve a entrar con tu cuenta para enviarla.');
      else if (i.estado !== 'subiendo') decir('Guardada en este equipo. Se enviará sola cuando vuelva la señal.');
    };
    quitar = ses.alCambiar(ver);
    Promise.resolve().then(() => ses.sincronizar()).catch(() => {});
  };
}

// ---------- Muestra jugable (P1-A): una mesa de laboratorio sin registrarse, sin preguntas ni pruebas ----------
// Tres experiencias distintas (mover un carrito, deformar un triángulo, probar conectores). No es una unidad evaluada
// en sí: si el alumno después hace la prueba del tema, el evento «tema» anota que ya la había explorado (expuesto).
const MUESTRAS = ['fisica.movimiento-rectilineo', 'geometria.triangulos', 'razonamiento-verbal.conectores'];
function vMuestra(arg) {
  pantallaSola('muestra');
  const k = ((+arg || 0) % MUESTRAS.length + MUESTRAS.length) % MUESTRAS.length;
  const c = cursoDeUnidad(MUESTRAS[k]), u = c && c.unidades.find(x => x.id === MUESTRAS[k]);
  if (!u || !u.teoria) return ir(est.uni && est.grado ? '#/inicio' : '#/bienvenida');
  const listo = est.uni && est.grado;
  const cab = () => `<header class="muestra-cab"><p class="sub">Muestra · ${esc(c.nombre)}</p><h1>Juega sin registrarte</h1>
      <p class="sub">Nada se califica. Cuando quieras, empiezas a estudiar.</p>
      <div class="acciones-prueba"><a class="btn borde" href="#/muestra/${k + 1}">Otra muestra</a>
        <a class="btn morado" href="${listo ? '#/inicio' : '#/bienvenida'}">${listo ? 'Ir al inicio' : 'Empezar a estudiar'}</a></div></header>`;
  cuandoListo(modulo('teoria'), () => Teoria.vista({ $app, cat, est, esc, guardar, registrar, marcarDia, cab, sub: 'laboratorio', muestra: true }, u));
}

// ---------- Por hoy terminé (P0-C): resumen de lo que de verdad pasó hoy, qué quedó guardado y un próximo paso opcional ----------
function resumenDeHoy() {
  const d = hoy(), ev = eventos().filter(e => e.alumno === est.alumno && e.t && new Date(e.t).toLocaleDateString('en-CA') === d);
  const r = { preguntas: 0, bien: 0, ideas: new Set(), labs: new Set(), casos: 0, textos: 0, simulacros: 0, temas: 0 };
  for (const e of ev) {
    if (['prediccion', 'previo', 'examen-item', 'repaso-item', 'tema-item'].includes(e.tipo) || (e.tipo === 'teoria' && ['prediccion', 'ahora-tu'].includes(e.momento))) { r.preguntas++; if (e.correcta) r.bien++; }
    if (e.tipo === 'teoria' && e.momento === 'ahora-tu' && e.correcta) r.ideas.add(`${e.unidad}/${e.idea}`);
    if (e.tipo === 'teoria' && e.momento === 'laboratorio') { r.labs.add(e.unidad); r.casos++; }
    if (e.tipo === 'lectura') r.textos++;
    if (e.tipo === 'examen') r.simulacros++;
    if (e.tipo === 'tema') r.temas++;
  }
  const partes = [];
  if (r.ideas.size) partes.push(`terminaste ${r.ideas.size} ${r.ideas.size === 1 ? 'idea' : 'ideas'} de teoría`);
  if (r.casos) partes.push(`guardaste ${r.casos} ${r.casos === 1 ? 'caso' : 'casos'} en ${r.labs.size} ${r.labs.size === 1 ? 'laboratorio' : 'laboratorios'}`);
  // Los aciertos se dicen si los hubo; un día difícil no se resume con un «0 bien» (los datos siguen en la medición).
  if (r.preguntas) partes.push(`respondiste ${r.preguntas} ${r.preguntas === 1 ? 'pregunta' : 'preguntas'}${r.bien ? ` (${r.bien} bien)` : ''}`);
  if (r.textos) partes.push(`leíste ${r.textos} ${r.textos === 1 ? 'texto' : 'textos'}`);
  if (r.simulacros) partes.push(`hiciste ${r.simulacros} ${r.simulacros === 1 ? 'simulacro' : 'simulacros'}`);
  if (r.temas) partes.push(`hiciste ${r.temas} ${r.temas === 1 ? 'prueba de tema' : 'pruebas de tema'}`);
  return { partes, vacio: !ev.length };
}
function vCierre() {
  const { partes, vacio } = resumenDeHoy();
  const ult = est.ultima && diasDesde(est.ultima.fecha) <= 21 ? est.ultima : null;
  const cursoComp = (ult && cursoDeRuta(ult.hash)) || cat.cursos[0], per = companero(cursoComp && cursoComp.id);
  const q = cola(est.uni), sig = q.find(x => !estudiada(x.u));
  const opciones = [
    ult && tituloRuta(ult.hash) ? { hash: ult.hash, t: `Seguir con ${tituloRuta(ult.hash)}` } : null,
    sig ? { hash: `#/unidad/${sig.u.id}`, t: `Empezar ${sig.u.nombre}` } : null,
  ].filter(Boolean);
  const guardado = esAlumnoCuenta() ? `Quedó guardado en este celular. ${textoSync()}.` : 'Quedó guardado en este celular.';
  $app.innerHTML = `<h1>Por hoy</h1>
    <div class="card cierre">
      <div class="seguir-fila"><div class="mascota" data-mascota data-curso="${esc(cursoComp.id)}" aria-hidden="true"></div>
        <p class="sub"><b>${esc(per.nombre)}</b> ${esc(vacio ? 'Hasta pronto.' : lineaDe(per, 'despedida'))}</p></div>
      ${vacio ? '<p>Hoy no hubo actividad. Puedes volver cuando quieras.</p>'
        : `<p>Hoy ${esc(partes.join(', '))}.</p><p class="sub">${esc(guardado)}</p>`}
      ${opciones.length ? `<fieldset class="cierre-prox"><legend>¿Dejas un próximo paso? (opcional)</legend>
        ${opciones.map((o, k) => `<button type="button" class="chip${est.proximo && est.proximo.hash === o.hash ? ' on' : ''}" data-prox="${k}" aria-pressed="${!!(est.proximo && est.proximo.hash === o.hash)}">${esc(o.t)}</button>`).join('')}
        <button type="button" class="chip" data-prox="-1" aria-pressed="false">Lo decido después</button></fieldset>
        <p class="sub cierre-ok" role="status"></p>` : ''}
      <a class="btn borde" href="#/inicio">Volver al inicio</a></div>`;
  try { if (window.Mascota) Mascota.pose('reposo'); } catch { /* la app nunca espera a la mascota */ }
  $app.querySelectorAll('[data-prox]').forEach(b => b.onclick = () => {
    const k = +b.dataset.prox;
    est.proximo = k >= 0 ? { hash: opciones[k].hash, fecha: hoy() } : null; guardar();
    $app.querySelectorAll('[data-prox]').forEach(x => { const on = x === b && k >= 0; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
    $app.querySelector('.cierre-ok').textContent = k >= 0 ? `Listo: al volver te espera «${opciones[k].t.replace(/^(Seguir con|Empezar) /, '')}».` : 'Está bien: al volver eliges.';
  });
  registrar({ tipo: 'cierre', vacio, ms: 0 });
}

function vProgreso() {
  sembrarRepaso();
  const q = cola(est.uni), hechas = q.filter(x => estudiada(x.u)).length, p = q.length ? hechas / q.length : 0;
  const porNivel = [0, 1, 2, 3, 4].map(k => q.filter(x => nivelDe(x.u).nivel === k).length);
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
        <div style="margin-top:-46px;text-align:center"><div class="n">${Math.round(p * 100)}<span style="font-size:20px">%</span></div><div class="l">${hechas} de ${q.length} unidades estudiadas</div></div></div>
      <ul class="niveles-resumen">${['Visitadas', 'La estudié', 'Con ayuda', 'Sin ayuda', 'La recuerdo'].map((t, k) => `<li><b>${porNivel[k]}</b> ${t}</li>`).join('')}</ul>
      <div class="aviso">${hechas ? `🍫 Llevas ${hechas} ${hechas === 1 ? 'unidad estudiada' : 'unidades estudiadas'}. Sigue a tu ritmo.` : '🍫 Cuando termines la teoría de una unidad, aparece aquí.'}</div>
    </div>
    ${repasoProgreso()}
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

// Una línea con la cola de repaso: cuántas unidades están en ella y cómo le fue.
function repasoProgreso() {
  const r = Object.values(est.repaso || {}); if (!r.length) return '';
  const hechos = r.reduce((a, x) => a + (Number(x.hechos) || 0), 0), bien = r.reduce((a, x) => a + (Number(x.aciertos) || 0), 0);
  return `<h2>Repaso</h2><div class="card"><p style="margin:0"><b>${r.length}</b> ${r.length === 1 ? 'unidad está' : 'unidades están'} en tu repaso.
    ${hechos ? `En los repasos recordaste <b>${bien} de ${hechos}</b>.` : 'El primero llega dos días después de tu primer ejercicio.'}</p>${tarjetaRepaso()}</div>`;
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

// Mi colección (Perfil): los casos que el alumno guardó en los laboratorios, con su nombre; cada uno abre su mesa con sus
// valores exactos (el laboratorio lo reconstruye con el motor).
function coleccionHTML() {
  const col = Array.isArray(est.coleccion) ? est.coleccion.slice().reverse() : [];
  if (!col.length) return '<h2>Tu colección</h2><p class="sub">Aún no guardas casos. En el laboratorio de cada unidad, «Guardar este caso» los deja aquí.</p>';
  return `<h2>Tu colección · ${col.length}</h2><div class="lista">${col.slice(0, 20).map(cs => { const cu = cursoDeUnidad(cs.unidad), un = cu && cu.unidades.find(x => x.id === cs.unidad);
    return un ? `<a class="item" style="${Ilus.tinte(cu.id)}" href="#/unidad/${esc(cs.unidad)}/teoria/laboratorio" data-caso="${esc(cs.id)}">${icono(cu.id)}<span class="tx"><span class="t">${esc(cs.nombre)}</span><br><span class="d">${esc(un.nombre)} · ${esc(cs.fecha)}</span></span><span class="ir">Abrir ›</span></a>` : ''; }).join('')}</div>`;
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
    <h2>Tu compañero</h2><div class="chips">
      <button class="chip${!(est.prefs || {}).discreto ? ' on' : ''}" data-pref="discreto" data-v="">Conversa</button>
      <button class="chip${(est.prefs || {}).discreto ? ' on' : ''}" data-pref="discreto" data-v="1">Discreto: habla solo para ayudar</button></div>
    <div class="chips" style="margin-top:8px">
      <button class="chip${!(est.prefs || {}).sinFestejo ? ' on' : ''}" data-pref="sinFestejo" data-v="">Con festejos</button>
      <button class="chip${(est.prefs || {}).sinFestejo ? ' on' : ''}" data-pref="sinFestejo" data-v="1">Sin festejos</button></div>
    <h2>Gráficos en 3D</h2><div class="chips">
      <button class="chip${!(est.prefs || {}).ahorro ? ' on' : ''}" data-pref="ahorro" data-v="">Completos</button>
      <button class="chip${(est.prefs || {}).ahorro ? ' on' : ''}" data-pref="ahorro" data-v="1">Ahorro: menos detalle y menos batería</button></div>
    ${coleccionHTML()}
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
  $app.querySelectorAll('[data-pref]').forEach(b => b.onclick = () => { est.prefs = Object.assign({}, est.prefs, { [b.dataset.pref]: !!b.dataset.v }); guardar(); aplicarTema(); vPerfil(); });
  $app.querySelectorAll('[data-caso]').forEach(a => a.onclick = () => sessionStorage.setItem('abrir-caso', a.dataset.caso));
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
      <h1>Mueve las ideas.<br>Entiende el examen.</h1>
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
        <td>${a.repaso && a.repaso.hechos ? `${esc(a.repaso.aciertos)}/${esc(a.repaso.hechos)}<br><span class="sub">${esc(a.repaso.unidades)} ${a.repaso.unidades == 1 ? 'unidad' : 'unidades'}</span>` : a.repaso && a.repaso.unidades ? `<span class="sub">${esc(a.repaso.unidades)} en cola</span>` : '—'}</td>
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
        ${panel.avance === null ? '<p class="sub">Cargando…</p>' : `<div class="tabla card"><table><thead><tr><th>Alumno</th><th>Usuario</th><th>Días</th><th>Unidades</th><th>Entrada → salida</th><th title="Preguntas del repaso de otros días: recordadas de respondidas">Repaso</th><th></th></tr></thead>
          <tbody>${filasAl || '<tr><td colspan="7" class="sub">Sin alumnos.</td></tr>'}</tbody></table></div>
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
  // Vuelve a los ejercicios de la unidad desde la que llegó (una plantilla puede servir a varias unidades).
  const ult = sessionStorage.getItem('ultima-unidad'), deUnidad = ult && p.unidades.includes(ult) ? ult : null;
  $app.innerHTML = `<a class="volver" href="${deUnidad ? `#/unidad/${esc(deUnidad)}/ejercicios` : `#/curso/${esc(curso ? curso.id : '')}`}" aria-label="Volver">‹</a>
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
  // Exámenes de una unidad: lo que necesitan los generadores (después se carga el de cada práctica de la unidad).
  examen: ['/nucleo/azar.js', '/nucleo/predicciones.js', '/nucleo/convencion.js'],
  // Repaso de hoy: lo mismo que el examen más su pantalla (nucleo/repaso.js ya viene con el inicio).
  // Teoría interactiva: el lector; él mismo carga el kit, nucleo/teoria.js, las piezas y el archivo de la unidad.
  teoria: ['/app/teoria.js'],
  repaso: ['/nucleo/azar.js', '/nucleo/predicciones.js', '/nucleo/convencion.js', '/nucleo/lectura.js', '/nucleo/papel-opciones.js', '/app/lectura.js', '/app/repaso.js'],
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
  ixAvance = null;                                  // los niveles se recalculan con los eventos de ahora
  if (window.Avance) Avance.migrar(est);
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
  // La muestra jugable no pide universidad ni grado: se juega primero y se configura después (P1-A, docs/recorrido.md).
  if (ruta === 'muestra') return vMuestra(arg);
  if ((!est.uni || !est.grado) && ruta !== 'bienvenida') return ir('#/bienvenida');
  if (ruta === 'bienvenida') return vBienvenida();
  $nav.hidden = false; document.body.dataset.ruta = ruta; document.body.classList.add('con-nav');
  $nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.ruta === (['curso', 'unidad', 'papel', 'practica', 'prueba', 'lectura'].includes(ruta) ? 'cursos' : ruta === 'otro' ? 'perfil' : ruta)));
  anotarUltima(ruta);
  if (ruta === 'cierre') return vCierre();
  if (ruta === 'practica') {
    $nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.ruta === 'cursos'));
    return cuandoListo(modulo('practica'), () => Practica.vista({ $app, cat, est, esc, guardar, registrar, marcarDia }, decodeURIComponent(arg || '')));
  }
  if (ruta === 'repaso') {
    sembrarRepaso();
    return cuandoListo(modulo('repaso'), () => RepasoVista.vista({ $app, cat, est, esc, guardar, registrar, marcarDia, cursoDeUnidad, fuentesDe: fuentesRepaso, script }));
  }
  if (ruta === 'lectura') {
    return cuandoListo(modulo('lectura'), () => LecturaVista.vista({ $app, cat, est, esc, guardar, registrar, marcarDia }, decodeURIComponent(arg || ''), decodeURIComponent(location.hash.split('/')[3] || '')));
  }
  if (ruta === 'prueba') return cuandoListo(cargarBanco().then(() => { if (!window.PruebaCurso) throw new Error('sin prueba.js'); }),
    () => PruebaCurso.vista(ctxPrueba(), decodeURIComponent(arg || ''), location.hash.split('/')[3] || 'entrada'));
  // El curso decide si va primero la prueba de entrada: espera al banco (ya suele estar, porque se pide tras el primer pintado).
  if (ruta === 'curso') return cuandoListo(Promise.all([cargarBanco(), cargarDibujos(decodeURIComponent(arg || ''))]), () => vCurso(decodeURIComponent(arg || '')));
  if (ruta === 'unidad') {
    const id = decodeURIComponent(arg || ''), c = cursoDeUnidad(id);
    return cuandoListo(Promise.all([cargarBanco(), c ? cargarDibujos(c.id) : null]), () => vUnidad(id, location.hash.split('/')[3] || ''));
  }
  ({ inicio: vInicio, otro: vOtro, cursos: vCursos, progreso: vProgreso, perfil: vPerfil, papel: () => vPapel(decodeURIComponent(arg || '')) }[ruta] || vInicio)();
  window.scrollTo(0, 0);
}
// Abrir una escena cuenta como día activo y marca la unidad como estudiada.
document.addEventListener('click', e => {
  const a = e.target.closest('[data-abrir]'); if (!a) return;
  // Abrir cuenta como visita, nunca como unidad estudiada (nucleo/avance.js). La prueba del tema ya no se impone (15 nov).
  est.vistas[a.dataset.abrir] = est.vistas[a.dataset.abrir] || hoy(); marcarDia(); guardar();
});
window.addEventListener('hashchange', render);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); instalar = e; });

// ---------- Modo sin conexión ----------
async function registrarSW() {
  if (!('serviceWorker' in navigator)) return;
  // Actualización sin «recarga dos veces» (15 nov): cuando una versión nueva toma el control, la página se recarga sola
  // una vez (el avance vive en localStorage, no se pierde). Al volver a la app se busca si hay versión nueva.
  const habia = !!navigator.serviceWorker.controller;
  let recargada = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (habia && !recargada) { recargada = true; location.reload(); } });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {});
  });
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
