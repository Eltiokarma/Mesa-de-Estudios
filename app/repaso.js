// Pantalla del repaso de hoy (versión R de docs/pogil-v2-rive.md; la lógica está en nucleo/repaso.js).
// Preguntas cortas de unidades que el alumno ya trabajó, mezcladas entre cursos, sin escena y sin animación.
// Fuentes, por unidad (orden de Gerson, 14 nov 2026):
//   generador  un generador con una semilla nueva (nunca un banco de academia: regla 5). Con un generador mixto
//              (sistemas-ecuaciones trae trazas de matrices) se buscan semillas hasta que la variante sea de la unidad,
//              según nucleo/repaso-tipos.js.
//   papel      si la unidad no tiene generador: un problema de lápiz y papel de su escena (papel.json), distinto en
//              cada visita. No trae alternativas: el alumno lo resuelve, ve la respuesta y marca «Me salió», «No me
//              salió» o «No sé». Se guarda como autoevaluación, aparte del acierto medido (nucleo/medicion.js).
// Antes de resolver: «¿Qué tipo de problema es?», con tres unidades del mismo curso; solo sale con preguntas cuya
// unidad es segura, y todas las de aquí lo son. Si falla, recién ahí la explicación y el enlace a la unidad.
// Se registra un 'repaso-item' por pregunta y un 'repaso' al terminar.
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
const suave = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

const papeles = {};
const cargarPapel = url => papeles[url] || (papeles[url] = fetch(url).then(r => { if (!r.ok) throw new Error(url); return r.json(); })
  .catch(e => { delete papeles[url]; throw e; }));

async function vista(ctx) {
  const { $app, cat, est, esc, guardar, registrar, marcarDia, cursoDeUnidad, fuentesDe, script } = ctx;
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
  const elegidas = R.elegir(est, hoy, id => (cursoDeUnidad(id) || {}).id).filter(id => unidad(id) && fuentesDe(unidad(id).u).hay);
  if (!elegidas.length) return sinNada();

  $app.innerHTML = `${cab}<p class="vacio">Cargando preguntas…</p>`;
  const h = location.hash;

  // ---- Generador: los que cubren la unidad se turnan (empieza el que toca según los repasos ya hechos); de cada uno
  // se prueban hasta 400 semillas (unos 50 ms) hasta dar con una variante de la unidad. Si ninguna sale, se prueba con
  // semillas del día, para que una unidad con mala suerte no quede bloqueada para siempre.
  const delaUnidad = (pl, p, id) => p && Array.isArray(p.alternativas) && p.alternativas.length > 1 && RepasoTipos.unidadDe(pl, p) === id;
  async function deGenerador(id, ficha, gens) {
    const n0 = (Number(ficha.hechos) || 0) % gens.length;
    for (const ks of [[...Array(400).keys()], [...Array(100).keys()].map(j => `${hoy}.${j}`)]) {
      for (let r = 0; r < gens.length; r++) {
        const pl = gens[(n0 + r) % gens.length];
        let g = null;
        try { await script(pl.archivos[0]); g = window.Generadores && window.Generadores[pl.id]; } catch { g = null; }
        if (!g) continue; // sin conexión y sin la copia guardada
        for (const k of ks) {
          let p = null;
          try { p = g.generar(R.semilla(est.alumno, id, ficha, k)); } catch { /* semilla sin problema válido: otra */ }
          if (delaUnidad(pl, p, id)) {
            return { fuente: 'generador', plantilla: pl.id, problema: p.id,
              enunHTML: `<p class="enun">${textoPlano(p.enunciado, esc)}</p>${p.datos ? `<p class="sub">${esc(p.datos)}</p>` : ''}${figura(p.figura, esc)}`,
              preguntaHTML: textoPlano(p.pregunta, esc),
              alts: p.alternativas.map(a => ({ letra: a.letra, texto: a.texto, correcta: !!a.correcta,
                explicacion: a.error ? a.error.explicacion : '', error: a.error ? a.error.id : '', respaldo: a.error ? a.error.respaldo : '' })),
              solucionHTML: Array.isArray(p.solucion) && p.solucion.length ? `<ol class="sol">${p.solucion.map(x => `<li>${textoPlano(x, esc)}</li>`).join('')}</ol>` : '' };
          }
        }
      }
    }
    return null;
  }
  // ---- Papel: todos los problemas de la unidad en las escenas que la cubren, en orden; cada visita, el siguiente.
  async function dePapel(id, ficha, pls) {
    const pool = [];
    for (const pl of pls) {
      let d = null;
      try { d = await cargarPapel(pl.papel); } catch { d = null; }
      if (!d || !Array.isArray(d.problemas)) continue;
      for (const q of d.problemas) if (RepasoTipos.unidadesPapel(pl, q.id).includes(id)) pool.push({ pl, q, indicacion: d.indicacion || '' });
    }
    if (!pool.length) return null;
    const { pl, q, indicacion } = pool[(Number(ficha.hechos) || 0) % pool.length];
    return { fuente: 'papel', plantilla: pl.id, problema: `${pl.id}/${q.id}`, indicacion,
      enunHTML: `<p class="enun">${esc(q.enunciado)}</p>`,
      respuesta: q.respuesta, solucionHTML: `<ol class="sol">${(q.pasos || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>` };
  }

  const preguntas = [];
  for (const id of elegidas) {
    const { c, u } = unidad(id), ficha = est.repaso[id], f = fuentesDe(u);
    let q = null;
    if (f.gens.length) q = await deGenerador(id, ficha, f.gens);
    if (!q && f.papeles.length) q = await dePapel(id, ficha, f.papeles);
    if (q) preguntas.push(Object.assign(q, { id, c, u, ficha })); // si no, esa unidad queda para otro día
  }
  if (location.hash !== h) return;
  if (!preguntas.length) {
    $app.querySelector('.vacio').textContent = 'No se pudieron cargar las preguntas. Abre la app una vez con internet para tenerlas sin conexión.';
    return;
  }

  // Opciones de «¿Qué tipo de problema es?»: distractores del mismo curso, primero lo que ya estudió.
  const estudiadas = Object.keys(est.repaso || {}).filter(x => unidad(x));
  for (const q of preguntas) {
    q.tipos = R.opcionesTipo(q.id, { cursoDe: x => (cursoDeUnidad(x) || {}).id, estudiadas, delCurso: cid => (cat.cursos.find(c => c.id === cid) || { unidades: [] }).unidades.map(x => x.id),
      rng: Azar.crear(`tipo-${R.semilla(est.alumno, q.id, q.ficha)}`), n: PARA_TIPO });
  }

  const t0 = Date.now();
  let i = 0, aciertos = 0, medidas = 0, nose = 0, tiposBien = 0, tiposN = 0, papelN = 0, papelSi = 0;
  const nombre = x => (unidad(x) || { u: { nombre: x } }).u.nombre;

  function pregunta() {
    const q = preguntas[i], tq = Date.now();
    const atraso = R.entre(q.ficha.toca, hoy), dias = R.entre(q.ficha.desde, hoy), paso = Number(q.ficha.paso) || 0;
    let tipoOpcion = '', tipoBien = null;
    const ultima = i === preguntas.length - 1;
    $app.innerHTML = `${cab}
      <div class="ex-puntos" aria-hidden="true">${preguntas.map((_, k) => `<span class="${k === i ? 'aqui' : ''}${k < i ? ' resp' : ''}"></span>`).join('')}</div>
      <article class="card practica rp-preg"><div class="etq-p">Pregunta ${i + 1} de ${preguntas.length}</div>
        ${q.enunHTML}
        <div id="tipo"><p class="preg">¿Qué tipo de problema es?</p>
          <div class="alts rp-tipos" role="group" aria-label="Tipo de problema">${q.tipos.map((x, k) => `<button type="button" class="alt" data-tipo="${esc(x)}"><span class="letra">${k + 1}</span><span>${esc(nombre(x))}</span></button>`).join('')}</div></div>
        <div id="resolver"></div>
        <div id="retro" role="status"></div><div id="sol"></div>
      </article>`;
    window.scrollTo(0, 0);
    const pintada = Date.now();
    $app.querySelectorAll('[data-tipo]').forEach(b => b.onclick = () => {
      if (tipoBien !== null || Date.now() - pintada < 450) return;
      tipoOpcion = b.dataset.tipo; tipoBien = tipoOpcion === q.id; tiposN++; if (tipoBien) tiposBien++;
      $app.querySelectorAll('[data-tipo]').forEach(x => {
        x.disabled = true;
        if (x.dataset.tipo === q.id) x.classList.add('ok'); else if (x === b) x.classList.add('mal');
      });
      $app.querySelector('#tipo').insertAdjacentHTML('beforeend', `<p class="rp-tipo-dice">${tipoBien ? 'Sí, es de' : 'Es de'} <b>${esc(q.u.nombre)}</b> (${esc(q.c.nombre)}).</p>`);
      (q.fuente === 'papel' ? resolverPapel : resolver)();
      $app.querySelector('#resolver').scrollIntoView({ behavior: suave(), block: 'nearest' });
    });

    const base = () => ({ tipo: 'repaso-item', fuente: q.fuente, curso: q.c.id, unidad: q.id, plantilla: q.plantilla, problema: q.problema,
      ms: Date.now() - tq, paso, dias, atraso, desde: q.ficha.desde, tipoOpcion, tipoBien });
    const volverUnidad = `<p><a href="#/unidad/${esc(q.id)}/ejercicios">Volver a ver ${esc(q.u.nombre)} ›</a></p>`;
    const botonSeguir = `<button type="button" class="btn morado ancho" id="seguir">${ultima ? 'Terminar' : 'Siguiente'}</button>`;
    const conectarSeguir = () => { $app.querySelector('#seguir').onclick = () => { if (ultima) return fin(); i++; pregunta(); }; };

    // ---- Con alternativas (generador; después, verbal): elegir, ver si acertó y, si falló, la explicación ----
    function resolver() {
      const tr = Date.now();
      $app.querySelector('#resolver').innerHTML = `<p class="preg">${q.preguntaHTML}</p>
        <div class="alts" role="group" aria-label="Alternativas">${q.alts.map(a => `<button type="button" class="alt" data-letra="${a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.texto)}</span></button>`).join('')}
          <button type="button" class="alt nose" data-nose="1">No sé</button></div>`;
      $app.querySelectorAll('#resolver .alt').forEach(b => b.onclick = () => {
        if (b.disabled || Date.now() - tr < 450) return;
        const esNose = !!b.dataset.nose, a = esNose ? null : q.alts.find(x => x.letra === b.dataset.letra);
        const ok = q.alts.find(x => x.correcta), bien = !!(a && a.correcta);
        $app.querySelectorAll('#resolver .alt').forEach(x => {
          x.disabled = true;
          if (x.dataset.letra === ok.letra) x.classList.add('ok'); else if (x === b) x.classList.add(esNose ? 'elegida' : 'mal');
        });
        medidas++; if (bien) aciertos++; if (esNose) nose++;
        R.anotar(est, q.id, { correcta: bien, nose: esNose }, hoy); guardar(); marcarDia();
        registrar(Object.assign(base(), { opcion: a ? a.letra : '', correcta: bien, error: a && !bien ? a.error : '', respaldo: a && !bien ? a.respaldo : '' }, esNose ? { nose: true } : {}));
        $app.querySelector('#retro').innerHTML = `<div class="retro ${esNose ? 'nose' : bien ? 'bien' : 'malo'}">
          <b>${bien ? `¡Bien! Es la ${ok.letra}. Lo recuerdas.` : `La respuesta es la ${ok.letra}: ${esc(ok.texto)}.`}</b>
          ${!bien && a && a.explicacion ? `<p>${esc(a.explicacion)}</p>` : ''}
          ${bien ? '' : '<p>Te lo vamos a preguntar otra vez en dos días.</p>'}</div>`;
        $app.querySelector('#sol').innerHTML = `${!bien && q.solucionHTML ? `<details open><summary>Solución paso a paso</summary>${q.solucionHTML}</details>` : ''}
          ${bien ? '' : volverUnidad}${botonSeguir}`;
        conectarSeguir();
        $app.querySelector('#retro').scrollIntoView({ behavior: suave(), block: 'start' });
      });
    }

    // ---- Papel: resolver en el cuaderno, ver la respuesta y decir si le salió (autoevaluación) ----
    function resolverPapel() {
      $app.querySelector('#resolver').innerHTML = `<p class="preg">Resuélvelo en tu cuaderno. Cuando termines, mira la respuesta.</p>
        ${q.indicacion ? `<details class="rp-datos"><summary>Datos y convenciones</summary><p class="sub">${esc(q.indicacion)}</p></details>` : ''}
        <div class="rp-papel-acc"><button type="button" class="alt nose" id="pnose">No sé</button><button type="button" class="btn morado" id="ver">Ver la respuesta</button></div>`;
      const respuestaHTML = () => `<div class="rp-respuesta"><b>Respuesta: ${esc(q.respuesta)}</b></div><details open><summary>Pasos</summary>${q.solucionHTML}</details>`;
      const cerrar = v => {
        papelN++; if (v === 'si') papelSi++;
        R.anotar(est, q.id, { correcta: v === 'si', nose: v === 'nose' }, hoy); guardar(); marcarDia();
        registrar(Object.assign(base(), { autoevaluacion: v })); // sin «correcta»: no es acierto medido
        $app.querySelector('#resolver').innerHTML = '';
        $app.querySelector('#retro').innerHTML = `<div class="retro ${v === 'si' ? 'bien' : v === 'nose' ? 'nose' : 'malo'}">
          <b>${v === 'si' ? '¡Bien! Lo vas a volver a ver más adelante.' : 'Te lo vamos a preguntar otra vez en dos días.'}</b></div>`;
        $app.querySelector('#sol').innerHTML = `${respuestaHTML()}${v === 'si' ? '' : volverUnidad}${botonSeguir}`;
        conectarSeguir();
        $app.querySelector('#retro').scrollIntoView({ behavior: suave(), block: 'start' });
      };
      const t = Date.now();
      $app.querySelector('#pnose').onclick = () => { if (Date.now() - t >= 450) cerrar('nose'); };
      $app.querySelector('#ver').onclick = () => {
        if (Date.now() - t < 450) return;
        $app.querySelector('#resolver').innerHTML = `${respuestaHTML()}<p class="preg">¿Te salió?</p>
          <div class="rp-papel-acc"><button type="button" class="btn borde" id="pno">No me salió</button><button type="button" class="btn morado" id="psi">Me salió</button></div>`;
        $app.querySelector('#pno').onclick = () => cerrar('no');
        $app.querySelector('#psi').onclick = () => cerrar('si');
        $app.querySelector('#resolver').scrollIntoView({ behavior: suave(), block: 'start' });
      };
    }
  }

  function fin() {
    registrar({ tipo: 'repaso', aciertos, total: medidas, nose, tipoBien: tiposBien, ms: Date.now() - t0, ...(papelN ? { autoevaluacion: `${papelSi}/${papelN}` } : {}) });
    const prox = R.proxima(est, hoy), quedan = R.pendientes(est, hoy).length && R.quedanHoy(est, hoy);
    const nota = medidas ? `<div class="n">${aciertos}<span> de ${medidas}</span></div><div class="l">las recordaste${tiposN ? ` · reconociste el tipo en ${tiposBien} de ${tiposN}` : ''}</div>`
      : `<div class="l">Reconociste el tipo en ${tiposBien} de ${tiposN}</div>`;
    $app.innerHTML = `${cab}<div class="card ex-nota rp-fin" style="margin-top:16px">${nota}
      ${papelN ? `<p>En el cuaderno te ${papelSi === 1 ? 'salió' : 'salieron'} ${papelSi} de ${papelN}.</p>` : ''}
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
