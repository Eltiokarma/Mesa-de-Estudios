// Pantalla del repaso de hoy (versión R de docs/pogil-v2-rive.md; la lógica está en nucleo/repaso.js).
// Preguntas cortas de unidades que el alumno ya trabajó, mezcladas entre cursos, sin escena y sin animación.
// Cada una sale de un generador de la unidad con una semilla nueva (nunca de un banco de academia: regla 5).
// Cada pregunta es de verdad de la unidad que se repasa: con un generador mixto (sistemas-ecuaciones trae trazas de
// matrices) se buscan semillas hasta que la variante sea de esa unidad, según nucleo/repaso-tipos.js. Así, antes de
// resolver se puede preguntar «¿Qué tipo de problema es?» con tres unidades sin dar por buena una etiqueta falsa.
// Si falla, recién ahí la explicación y el enlace a la unidad. Se registra un 'repaso-item' por pregunta y un 'repaso' al terminar (nucleo/medicion.js).
(function () {
'use strict';
const PARA_TIPO = 3;

function textoPlano(partes, esc) {
  return (partes || []).map(x => (typeof x === 'string' ? esc(x) : x.formula ? `<span class="formula">${esc(x.t)}</span>` : `<b>${esc(x.t)}</b>`)).join('');
}
const figura = (f, esc) => (f && typeof f.svg === 'string' && /^<svg[\s>]/.test(f.svg)
  ? `<figure class="fig-gen" role="img" aria-label="${esc(f.alt || 'Figura del problema')}">${f.svg}</figure>` : '');
// «jueves 19 de noviembre»
const fechaBonita = f => new Date(f + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

async function vista(ctx) {
  const { $app, cat, est, esc, guardar, registrar, marcarDia, cursoDeUnidad, generadoresDe, script } = ctx;
  const R = window.Repaso;
  const hoy = R.fechaLocal(Date.now());
  const unidad = id => { const c = cursoDeUnidad(id); return c ? { c, u: c.unidades.find(x => x.id === id) } : null; };
  const cab = `<a class="volver" href="#/inicio" aria-label="Volver al inicio">‹</a><h1>Repaso de hoy</h1>`;
  const sinNada = () => {
    const prox = R.proxima(est, hoy);
    $app.innerHTML = `${cab}<div class="card rp-fin" style="margin-top:16px">${window.Ilus ? Ilus.gatoDormido('width="120"') : ''}
      <h2>Hoy no te toca repasar</h2>
      <p>${prox ? `Tu próximo repaso es el <b>${esc(fechaBonita(prox))}</b>.`
        : 'Cuando termines ejercicios de una unidad, aquí te vamos a preguntar de ella otros días, para que no se te olvide.'}</p>
      <a class="btn morado" href="#/inicio">Ir al inicio</a></div>`;
  };
  const elegidas = R.elegir(est, hoy, id => (cursoDeUnidad(id) || {}).id).filter(id => unidad(id) && generadoresDe(unidad(id).u).length);
  if (!elegidas.length) return sinNada();

  $app.innerHTML = `${cab}<p class="vacio">Cargando preguntas…</p>`;
  const h = location.hash;
  // Un problema por unidad. Los generadores que la cubren se turnan (empieza el que toca según los repasos ya hechos);
  // de cada uno se prueban hasta 400 semillas (unos 50 ms) hasta dar con una variante de la unidad. Si ninguna sale, se
  // prueba con semillas del día, para que una unidad con mala suerte no quede bloqueada para siempre.
  const preguntas = [];
  const delaUnidad = (pl, p, id) => p && Array.isArray(p.alternativas) && p.alternativas.length > 1 && RepasoTipos.unidadDe(pl, p) === id;
  for (const id of elegidas) {
    const { c, u } = unidad(id), ficha = est.repaso[id], gens = generadoresDe(u), n0 = (Number(ficha.hechos) || 0) % gens.length;
    let hallado = null;
    for (const ks of [[...Array(400).keys()], [...Array(100).keys()].map(j => `${hoy}.${j}`)]) {
      for (let r = 0; r < gens.length && !hallado; r++) {
        const pl = gens[(n0 + r) % gens.length];
        let g = null;
        try { await script(pl.archivos[0]); g = window.Generadores && window.Generadores[pl.id]; } catch { g = null; }
        if (!g) continue; // sin conexión y sin la copia guardada
        for (const k of ks) {
          let p = null;
          try { p = g.generar(R.semilla(est.alumno, id, ficha, k)); } catch { /* semilla sin problema válido: otra */ }
          if (delaUnidad(pl, p, id)) { hallado = { id, c, u, pl, p, ficha }; break; }
        }
      }
      if (hallado) break;
    }
    if (hallado) preguntas.push(hallado); // si no, esa unidad queda para otro día
  }
  if (location.hash !== h) return;
  if (!preguntas.length) {
    $app.querySelector('.vacio').textContent = 'No se pudieron cargar las preguntas. Abre la app una vez con internet para tenerlas sin conexión.';
    return;
  }

  // Opciones de «¿Qué tipo de problema es?»: distractores del mismo curso, primero lo que ya estudió.
  const estudiadas = Object.keys(est.repaso || {}).filter(x => unidad(x));
  for (const q of preguntas) {
    q.tipoOk = q.id;
    q.tipos = R.opcionesTipo(q.id, { cursoDe: x => (cursoDeUnidad(x) || {}).id, estudiadas, delCurso: cid => (cat.cursos.find(c => c.id === cid) || { unidades: [] }).unidades.map(x => x.id),
      rng: Azar.crear(`tipo-${R.semilla(est.alumno, q.id, q.ficha)}`), n: PARA_TIPO });
  }

  const t0 = Date.now();
  let i = 0, aciertos = 0, nose = 0, tiposBien = 0, tiposN = 0;
  const nombre = x => (unidad(x) || { u: { nombre: x } }).u.nombre;

  function pregunta() {
    const q = preguntas[i], { p } = q, tq = Date.now();
    const atraso = R.entre(q.ficha.toca, hoy), dias = R.entre(q.ficha.desde, hoy), paso = Number(q.ficha.paso) || 0;
    let tipoOpcion = '', tipoBien = null;
    $app.innerHTML = `${cab}
      <div class="ex-puntos" aria-hidden="true">${preguntas.map((_, k) => `<span class="${k === i ? 'aqui' : ''}${k < i ? ' resp' : ''}"></span>`).join('')}</div>
      <article class="card practica rp-preg"><div class="etq-p">Pregunta ${i + 1} de ${preguntas.length}</div>
        <p class="enun">${textoPlano(p.enunciado, esc)}</p>${p.datos ? `<p class="sub">${esc(p.datos)}</p>` : ''}
        ${figura(p.figura, esc)}
        ${q.tipos ? `<div id="tipo"><p class="preg">¿Qué tipo de problema es?</p>
          <div class="alts rp-tipos" role="group" aria-label="Tipo de problema">${q.tipos.map((x, k) => `<button type="button" class="alt" data-tipo="${esc(x)}"><span class="letra">${k + 1}</span><span>${esc(nombre(x))}</span></button>`).join('')}</div></div>` : ''}
        <div id="resolver"></div>
        <div id="retro" role="status"></div><div id="sol"></div>
      </article>`;
    window.scrollTo(0, 0);
    const pintada = Date.now();
    $app.querySelectorAll('[data-tipo]').forEach(b => b.onclick = () => {
      if (tipoBien !== null || Date.now() - pintada < 450) return;
      tipoOpcion = b.dataset.tipo; tipoBien = tipoOpcion === q.tipoOk; tiposN++; if (tipoBien) tiposBien++;
      $app.querySelectorAll('[data-tipo]').forEach(x => {
        x.disabled = true;
        if (x.dataset.tipo === q.tipoOk) x.classList.add('ok'); else if (x === b) x.classList.add('mal');
      });
      const ok = unidad(q.tipoOk);
      $app.querySelector('#tipo').insertAdjacentHTML('beforeend', `<p class="rp-tipo-dice">${tipoBien ? 'Sí, es de' : 'Es de'} <b>${esc(ok.u.nombre)}</b> (${esc(ok.c.nombre)}).</p>`);
      resolver();
    });
    if (!q.tipos) resolver();

    function resolver() {
      const tr = Date.now();
      $app.querySelector('#resolver').innerHTML = `<p class="preg">${textoPlano(p.pregunta, esc)}</p>
        <div class="alts" role="group" aria-label="Alternativas">${p.alternativas.map(a => `<button type="button" class="alt" data-letra="${a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.texto)}</span></button>`).join('')}
          <button type="button" class="alt nose" data-nose="1">No sé</button></div>`;
      if (q.tipos) $app.querySelector('#resolver').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      $app.querySelectorAll('#resolver .alt').forEach(b => b.onclick = () => {
        if (b.disabled || Date.now() - tr < 450) return;
        const esNose = !!b.dataset.nose, a = esNose ? null : p.alternativas.find(x => x.letra === b.dataset.letra);
        const ok = p.alternativas.find(x => x.correcta), bien = !!(a && a.correcta);
        $app.querySelectorAll('#resolver .alt').forEach(x => {
          x.disabled = true;
          if (x.dataset.letra === ok.letra) x.classList.add('ok'); else if (x === b) x.classList.add(esNose ? 'elegida' : 'mal');
        });
        if (bien) aciertos++; if (esNose) nose++;
        R.anotar(est, q.id, { correcta: bien, nose: esNose }, hoy); guardar(); marcarDia();
        registrar({ tipo: 'repaso-item', curso: q.c.id, unidad: q.id, plantilla: q.pl.id, problema: p.id, opcion: a ? a.letra : '', correcta: bien,
          error: a && !bien && a.error ? a.error.id : '', respaldo: a && !bien && a.error ? a.error.respaldo : '', ...(esNose ? { nose: true } : {}),
          ms: Date.now() - tq, paso, dias, atraso, desde: q.ficha.desde, ...(q.tipos ? { tipoOpcion, tipoBien } : {}) });
        const ultima = i === preguntas.length - 1;
        $app.querySelector('#retro').innerHTML = `<div class="retro ${esNose ? 'nose' : bien ? 'bien' : 'malo'}">
          <b>${bien ? `¡Bien! Es la ${ok.letra}. Lo recuerdas.` : `La respuesta es la ${ok.letra}: ${esc(ok.texto)}.`}</b>
          ${!bien && a && a.error && a.error.explicacion ? `<p>${esc(a.error.explicacion)}</p>` : ''}
          ${bien ? '' : '<p>Te lo vamos a preguntar otra vez en dos días.</p>'}</div>`;
        $app.querySelector('#sol').innerHTML = `${!bien && Array.isArray(p.solucion) && p.solucion.length
          ? `<details open><summary>Solución paso a paso</summary><ol class="sol">${p.solucion.map(x => `<li>${textoPlano(x, esc)}</li>`).join('')}</ol></details>` : ''}
          ${bien ? '' : `<p><a href="#/unidad/${esc(q.id)}/ejercicios">Volver a ver ${esc(q.u.nombre)} ›</a></p>`}
          <button type="button" class="btn morado ancho" id="seguir">${ultima ? 'Terminar' : 'Siguiente'}</button>`;
        const seguir = $app.querySelector('#seguir');
        seguir.onclick = () => { if (ultima) return fin(); i++; pregunta(); };
        $app.querySelector('#retro').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
    }
  }

  function fin() {
    registrar({ tipo: 'repaso', aciertos, total: preguntas.length, nose, tipoBien: tiposBien, ms: Date.now() - t0 });
    const prox = R.proxima(est, hoy), quedan = R.pendientes(est, hoy).length && R.quedanHoy(est, hoy);
    $app.innerHTML = `${cab}<div class="card ex-nota rp-fin" style="margin-top:16px">
      <div class="n">${aciertos}<span> de ${preguntas.length}</span></div><div class="l">las recordaste${tiposN ? ` · reconociste el tipo en ${tiposBien} de ${tiposN}` : ''}</div>
      <p>${prox ? `Tu próximo repaso: <b>${esc(fechaBonita(prox))}</b>.` : ''} Lo que recuerdas bien vuelve más tarde; lo que fallaste, en dos días.</p>
      <div class="acciones-prueba">${quedan ? '<a class="btn morado" href="#/repaso" id="mas">Repasar otras</a>' : ''}<a class="btn ${quedan ? 'borde' : 'morado'}" href="#/inicio">Ir al inicio</a></div></div>`;
    const mas = document.getElementById('mas');
    if (mas) mas.onclick = e => { e.preventDefault(); vista(ctx); };
    window.scrollTo(0, 0);
    if (window.Mascota && typeof Mascota.pose === 'function') { try { Mascota.pose('hito'); } catch { /* nada */ } }
  }

  pregunta();
}

// Teclado (laboratorio): 1–3 eligen el tipo; A–E (o 1–5 ya con el tipo elegido) la alternativa; 0 o N, «No sé»;
// Enter, seguir.
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#/repaso') || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const k = e.key.toUpperCase();
  const tipos = [...document.querySelectorAll('[data-tipo]:not(:disabled)')];
  let b = null;
  if (tipos.length && /^[1-9]$/.test(k)) b = tipos[+k - 1];
  else if (/^[A-E]$/.test(k) || /^[1-5]$/.test(k)) b = document.querySelector(`#resolver .alt[data-letra="${/^[A-E]$/.test(k) ? k : 'ABCDE'[+k - 1]}"]:not(:disabled)`);
  else if (k === '0' || k === 'N') b = document.querySelector('#resolver .alt.nose:not(:disabled)');
  else if (e.key === 'Enter' && !(e.target.closest && e.target.closest('button, a'))) b = document.getElementById('seguir');
  if (b) { e.preventDefault(); b.click(); }
});

window.RepasoVista = { vista };
})();
