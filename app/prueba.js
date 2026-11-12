// Pruebas de entrada y salida por curso (tarea la1). Banco: app/datos/pruebas.json, armado desde
// catalogo/pruebas/ (formato en docs/arquitectura.md). Lógica compartida: nucleo/pruebas.js.
// - Entrada: la primera vez que el alumno entra a un curso. Corta, sin nota y SIN decirle qué acertó,
//   para no enseñarle las respuestas antes de la salida.
// - Salida: SOLO cuando el profesor la abre en ese navegador con el enlace …/app/?salida=fisica (o =todas).
//   Al final se ve solo el puntaje de entrada contra salida; la revisión pregunta por pregunta (correcta y
//   error) aparece solo si el profesor la abre con …/app/?soluciones=fisica (o =todas).
// - Formas A y B en orden contrabalanceado: Pruebas.orden(alumno, curso) da 'AB' o 'BA'.
// Cada respuesta se registra con ctx.registrar (nucleo/medicion.js): tipo 'item' por pregunta y
// tipo 'prueba' al terminar.
(function () {
'use strict';
const NOMBRE_FASE = { entrada: 'Prueba de entrada', salida: 'Prueba de salida' };

function estado(est, curso) {
  est.pruebas = est.pruebas || {};
  const st = est.pruebas[curso] = est.pruebas[curso] || {};
  if (!st.orden) st.orden = Pruebas.orden(est.alumno, curso);
  return st;
}
const enLista = (l, curso) => (l || []).some(x => x === curso || x === 'todas');
const habilitada = (est, curso) => enLista(est.salidaHabilitada, curso);
const conSoluciones = (est, curso) => enLista(est.solucionesHabilitadas, curso);
const unidadesVistas = (cat, est, curso) => { const c = cat.cursos.find(x => x.id === curso); return c ? c.unidades.filter(u => est.vistas[u.id]).length : 0; };

// ¿Hay que pedirle la entrada antes de dejarlo entrar al curso?
function pideEntrada(ctx, curso) {
  const { pruebas, est } = ctx;
  if (!pruebas || !pruebas.cursos[curso]) return false;
  const st = (est.pruebas || {})[curso] || {};
  return !st.entrada && sessionStorage.getItem('prueba-luego-' + curso) !== '1';
}

// Tarjeta para la página del curso.
function tarjeta(ctx, curso) {
  const { pruebas, est, esc } = ctx;
  const b = pruebas && pruebas.cursos[curso];
  if (!b) return '';
  const st = estado(est, curso), n = b.pares.length;
  const boton = (fase, texto, clase) => `<a class="btn ${clase}" href="#/prueba/${esc(curso)}/${fase}">${texto}</a>`;
  if (st.enCurso) return `<div class="card prueba-tarjeta"><div class="etq-p">${NOMBRE_FASE[st.enCurso.fase]}</div>
    <p>Te quedaste en la pregunta ${st.enCurso.respuestas.length + 1} de ${n}.</p>${boton(st.enCurso.fase, 'Continuar ›', 'morado')}</div>`;
  if (!st.entrada) return `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de entrada pendiente</div>
    <p>${n} preguntas, unos ${b.minutos} minutos. No es nota: sirve para ver de dónde partes.</p>${boton('entrada', 'Hacer la prueba de entrada ›', 'morado')}</div>`;
  if (!st.salida) {
    if (!habilitada(est, curso)) return `<div class="card prueba-tarjeta"><div class="etq-p">Prueba de salida</div>
      <p>La prueba de salida la abre tu profesor cuando terminen el curso.</p></div>`;
    return `<div class="card prueba-tarjeta destacada"><div class="etq-p">Prueba de salida</div>
      <p>Tu profesor ya la abrió. Son ${n} preguntas parecidas a las de la entrada, y al final ves cuánto avanzaste.</p>
      ${boton('salida', 'Hacer la prueba de salida ›', 'morado')}</div>`;
  }
  return `<div class="card prueba-tarjeta"><div class="etq-p">Pruebas del curso</div>
    <p>Entrada ${st.entrada.aciertos} de ${st.entrada.total} · Salida <b>${st.salida.aciertos} de ${st.salida.total}</b></p>${boton('salida', 'Ver resultados ›', 'borde')}</div>`;
}

function vista(ctx, curso, fase) {
  const { $app, cat, est, esc, guardar, registrar, pruebas } = ctx;
  const b = pruebas && pruebas.cursos[curso], c = cat.cursos.find(x => x.id === curso);
  if (!b || !c || !Pruebas.FASES.includes(fase)) { location.hash = '#/cursos'; return; }
  const st = estado(est, curso); guardar();
  // Con la entrada pendiente, «volver» va a la lista de cursos: el curso mandaría otra vez aquí.
  const volver = `<a class="volver" href="${st.entrada ? `#/curso/${esc(curso)}` : '#/cursos'}" aria-label="Volver">‹</a>`;
  const cab = (sub) => `${volver}<p class="sub">${esc(c.nombre)}</p><h1>${NOMBRE_FASE[fase]}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}`;
  const n = b.pares.length;

  if (fase === 'salida' && !st.entrada) {
    $app.innerHTML = cab('') + `<div class="card prueba-intro"><p>Primero va la prueba de entrada: así se puede comparar lo de antes con lo de después.</p>
      <a class="btn morado ancho" href="#/prueba/${esc(curso)}/entrada">Hacer la prueba de entrada</a></div>`;
    return;
  }
  if (st[fase]) return fase === 'salida' ? resultado() : listo();
  if (fase === 'salida' && !habilitada(est, curso)) {
    $app.innerHTML = cab('') + `<div class="card prueba-intro"><p>La prueba de salida la abre tu profesor cuando terminen el curso.</p>
      <a class="btn morado ancho" href="#/curso/${esc(curso)}">Volver al curso</a></div>`;
    return;
  }
  if (st.enCurso && st.enCurso.fase === fase) return pregunta();
  if (st.enCurso && st.enCurso.fase !== fase) { location.hash = `#/prueba/${curso}/${st.enCurso.fase}`; return; }
  intro();

  function intro() {
    const prof = fase === 'salida';
    $app.innerHTML = cab('') + `<div class="card prueba-intro">
      ${window.Ilus ? Ilus.taza('class="prueba-taza"') : ''}
      <div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><div class="n">${n}</div><div class="l">preguntas</div></div>
        <div class="stat"><div class="n">${b.minutos}</div><div class="l">minutos, más o menos</div></div></div>
      ${fase === 'entrada'
        ? `<p><b>No es nota.</b> Sirve para saber de dónde partes y, al final del curso, cuánto avanzaste. Tus respuestas se guardan sin tu nombre.</p>
           <p><b>Si no lo sabes, marca «No sé»:</b> nos ayuda más que adivinar. No se descuenta nada. Esta vez no te diremos cuáles acertaste; lo verás al final, con la prueba de salida.</p>`
        : `<div class="aviso">Tu profesor abrió la prueba de salida.</div>
           <p>Son preguntas <b>parecidas</b> a las de la entrada, no las mismas. Se hace una sola vez. Si no lo sabes, marca «No sé».</p>
           <p>Al terminar verás cuántas acertaste antes y ahora.</p>`}
      <div class="acciones-prueba"><button class="btn morado" id="empezar">Empezar</button>
        <button class="btn borde" id="luego">${fase === 'entrada' ? 'Ahora no' : 'Todavía no'}</button></div></div>`;
    document.getElementById('empezar').onclick = () => {
      st.enCurso = { fase, forma: Pruebas.formaDe(st.orden, fase), respuestas: [], ms: 0,
        origen: fase === 'entrada' ? (sessionStorage.getItem('prueba-auto-' + curso) === '1' ? 'primera-vez' : 'alumno') : 'profesor',
        previas: fase === 'entrada' ? unidadesVistas(cat, est, curso) : undefined };
      guardar(); pregunta();
    };
    document.getElementById('luego').onclick = () => {
      if (fase === 'entrada') sessionStorage.setItem('prueba-luego-' + curso, '1');
      location.hash = `#/curso/${curso}`;
    };
    document.getElementById('empezar').focus({ preventScroll: true });
  }

  function pregunta() {
    const ec = st.enCurso, lista = Pruebas.items(b, ec.forma), k = ec.respuestas.length;
    if (k >= lista.length) return terminar();
    const it = lista[k], ops = Pruebas.presentar(it, est.alumno), t0 = Date.now();
    $app.innerHTML = cab('') + `<div class="progreso-prueba" aria-hidden="true"><span class="barra"><i style="width:${Math.round(100 * k / lista.length)}%"></i></span></div>
      <article class="card practica" style="margin-top:12px">
        <div class="etq-p">Pregunta ${k + 1} de ${lista.length}</div>
        <p class="enun">${esc(it.enunciado)}</p>
        <div class="alts" role="group" aria-label="Alternativas">${ops.map(o =>
          `<button class="alt" data-letra="${o.letra}"><span class="letra">${o.letra}</span><span>${esc(o.texto)}</span></button>`).join('')}
          <button class="alt nose" data-nose="1">${Pruebas.NOSE_TEXTO}</button></div>
        <p class="solo-teclado">Con teclado: <kbd>A</kbd>–<kbd>${ops[ops.length - 1].letra}</kbd> o <kbd>1</kbd>–<kbd>${ops.length}</kbd> para elegir, <kbd>0</kbd> o <kbd>N</kbd> para «No sé».</p>
      </article>`;
    $app.querySelectorAll('.alt').forEach(btn => btn.onclick = () => {
      if (btn.disabled) return;
      $app.querySelectorAll('.alt').forEach(x => { x.disabled = true; });
      btn.classList.add('elegida'); // solo marca la elegida: no dice si está bien
      // «No sé»: sin opción, ni acierto ni error de un código (nucleo/pruebas.js).
      const o = btn.dataset.nose ? null : ops.find(x => x.letra === btn.dataset.letra), r = Pruebas.corregir(o), ms = Date.now() - t0;
      ec.respuestas.push(r.nose ? { item: it.id, par: it.par, indice: -1, letra: Pruebas.NOSE_MARCA, correcta: false, error: '', nose: true }
        : { item: it.id, par: it.par, indice: o.indice, letra: o.letra, correcta: r.correcta, error: r.error });
      ec.ms += ms; guardar();
      registrar({ tipo: 'item', fase, curso, forma: ec.forma, orden: st.orden, banco: b.version, item: it.id, par: it.par,
        plantilla: it.plantilla, unidad: it.unidad, opcion: r.opcion, correcta: r.correcta, error: r.error, ...(r.nose ? { nose: true } : {}), ms });
      setTimeout(pregunta, 180);
    });
    window.scrollTo(0, 0);
  }

  function terminar() {
    const ec = st.enCurso, aciertos = ec.respuestas.filter(r => r.correcta).length, total = ec.respuestas.length, nose = ec.respuestas.filter(r => r.nose).length;
    const dias = fase === 'salida' && st.entrada ? Math.max(0, Math.round((Date.now() - Date.parse(st.entrada.fecha)) / 864e5)) : undefined;
    registrar({ tipo: 'prueba', fase, curso, forma: ec.forma, orden: st.orden, banco: b.version, aciertos, total,
      respuestas: ec.respuestas.map(r => r.letra).join(''), nose, ms: ec.ms, origen: ec.origen, previas: ec.previas, dias });
    st[fase] = { forma: ec.forma, aciertos, total, nose, fecha: new Date().toISOString(), respuestas: ec.respuestas, banco: b.version };
    delete st.enCurso; guardar(); ctx.marcarDia();
    if (fase === 'salida') resultado(); else listo();
  }

  // Fin de la entrada: sin puntaje ni respuestas correctas.
  function listo() {
    $app.innerHTML = cab('') + `<div class="card prueba-intro" style="text-align:center">
      ${window.Ilus ? Ilus.gato('class="prueba-gato"') : ''}
      <h2 style="justify-content:center;margin-top:4px">¡Listo! Gracias.</h2>
      <p>Ya sabemos de dónde partes. Ahora sí, a estudiar: al final del curso haces la prueba de salida y ves cuánto avanzaste.</p>
      <a class="btn morado ancho" href="#/curso/${esc(curso)}" id="alCurso">Ir al curso</a></div>`;
    document.getElementById('alCurso').focus({ preventScroll: true });
  }

  // Fin de la salida: el puntaje de entrada contra salida. La revisión pregunta por pregunta (qué mide, la
  // correcta y el error) solo si el profesor la abrió con ?soluciones=<curso>: así no circulan las respuestas
  // entre compañeros que todavía no rinden la salida.
  function resultado() {
    const e = st.entrada, s = st.salida, sol = conSoluciones(est, curso);
    const subio = e ? s.aciertos - e.aciertos : 0;
    if (sol && !st.vioSoluciones) { st.vioSoluciones = true; guardar(); registrar({ tipo: 'habilitacion', que: 'soluciones-vistas', curso, origen: 'profesor' }); }
    let html = cab('Resultados') + `<div class="card resultado" style="margin-top:16px">
      ${window.Ilus ? Ilus.taza('class="resultado-taza"') : ''}
      <div class="stats" style="grid-template-columns:1fr 1fr">
        <div class="stat"><div class="l">Prueba de entrada</div><div class="n">${e ? `${e.aciertos}/${e.total}` : '—'}</div></div>
        <div class="stat"><div class="l">Prueba de salida</div><div class="n">${s.aciertos}/${s.total}</div></div>
      </div>
      <p class="sub" style="margin-top:12px">${!e ? '' : subio > 0 ? `Acertaste ${subio} ${subio === 1 ? 'pregunta' : 'preguntas'} más que al empezar. 💜` : subio === 0 ? 'Acertaste las mismas que al empezar.' : 'Esta vez acertaste menos que al empezar.'}</p>
      ${sol ? '' : '<p class="sub">Tu profesor revisará las soluciones con la clase.</p>'}</div>`;
    if (sol) {
      const porPar = l => Object.fromEntries((l || []).map(r => [r.par, r]));
      const pe = porPar(e && e.respuestas), ps = porPar(s.respuestas);
      const marca = r => !r ? '<span class="sub">—</span>' : r.correcta ? '<span class="ok-t">✓ bien</span>' : r.nose ? '<span class="sub">No sé</span>' : '<span class="mal-t">✗</span>';
      const lista = Pruebas.items(b, s.forma);
      html += `<h2>Qué mide cada pregunta</h2>
      <div class="tabla card"><table><thead><tr><th>Tema</th><th>Entrada</th><th>Salida</th></tr></thead><tbody>${b.pares.map(p =>
        `<tr><td style="white-space:normal">${esc(p.mide)}</td><td>${marca(pe[p.par])}</td><td>${marca(ps[p.par])}</td></tr>`).join('')}</tbody></table></div>
      <h2>Tus respuestas de salida</h2>
      <div class="lista revision">${lista.map((it, k) => {
        const r = ps[it.par], el = r && !r.nose ? it.opciones[r.indice] : null, ok = it.opciones.find(o => o.correcta), err = el && !el.correcta && b.errores[el.error];
        return `<details class="card"${r && !r.correcta ? ' open' : ''}><summary>${k + 1}. ${r && r.correcta ? '✓' : r && r.nose ? '·' : '✗'} ${esc(it.mide)}</summary>
          <p>${esc(it.enunciado)}</p>
          ${el ? `<p>Elegiste: <b>${esc(el.texto)}</b>${el.correcta ? ' <span class="ok-t">¡Bien!</span>' : ''}</p>` : ''}
          ${r && r.nose ? `<p>Marcaste «No sé». La correcta: <b>${esc(ok.texto)}</b></p>` : ''}
          ${el && !el.correcta ? `<p>La correcta: <b>${esc(ok.texto)}</b></p>${err ? `<p class="sub">Lo que suele pasar: ${esc(err.describe)}.</p>` : ''}` : ''}
        </details>`; }).join('')}</div>`;
    }
    $app.innerHTML = html + `<p style="margin-top:18px"><a class="btn morado" href="#/curso/${esc(curso)}">Volver al curso</a></p>`;
  }
}

// Teclado (laboratorio de cómputo): A–E o 1–5 eligen una alternativa de la prueba; 0 o N, «No sé».
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#/prueba') || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const k = e.key.toUpperCase();
  const letra = /^[A-E]$/.test(k) ? k : /^[1-5]$/.test(k) ? 'ABCDE'[+k - 1] : null;
  const nose = k === '0' || k === 'N';
  if (!letra && !nose) return;
  const b = document.querySelector(nose ? '.alt.nose:not(:disabled)' : `.alt[data-letra="${letra}"]:not(:disabled)`);
  if (b) { e.preventDefault(); b.click(); }
});

window.PruebaCurso = { vista, tarjeta, pideEntrada, habilitada, conSoluciones };
})();
