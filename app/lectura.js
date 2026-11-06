// Pantalla del formato "lectura" (razonamiento verbal; diseño en docs/formato-lectura.md).
// Flujo: prueba de entrada (un texto fijo, sin paso previo ni corrección) → práctica texto por texto
// (leer, "Ya lo leí", y por cada pregunta: paso previo que BLOQUEA las alternativas, alternativas,
// explicación pintada en el texto) → prueba de salida, que se ofrece después de 3 textos.
// La calificación y los eventos salen de nucleo/lectura.js; aquí solo va la interfaz.
// Celular: el texto va entero al leer y queda plegado arriba en las preguntas; se relee en una hoja
// que sube desde abajo. Pantalla grande (desde 900 px): texto a la izquierda y pregunta a la derecha.
(function () {
'use strict';
const MIN_SALIDA = 3;
const CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮';
const PREMIOS = ['Te ganaste un bombón. 🍫', 'Leíste con lupa. 🔎', 'El gato está orgulloso. 🐾', 'Una más para la racha. ☕', 'Pensaste antes de mirar: eso es leer. 💜'];
const L = () => window.Lectura;
let banco = null;      // { url, indice, frases, codigos, items }
let actual = null;     // lo que el teclado puede activar en la pantalla de ahora

async function cargarBanco(pl) {
  if (banco && banco.url === pl.banco) return banco;
  const json = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
  const dir = pl.banco.replace(/\/[^/]*$/, '');
  const indice = await json(pl.banco);
  const [frases, codigos] = await Promise.all([json(`${dir}/frases.json`), json(`${dir}/codigos.json`).catch(() => ({}))]);
  const items = {};
  const ids = [...new Set([indice.entrada, indice.salida, ...indice.textos].filter(Boolean))];
  await Promise.all([
    ...ids.map(id => json(`${dir}/textos/${id}.json`).then(t => { items[id] = t; })),
    ...(indice.ejercicios || []).map(id => json(`${dir}/ejercicios/${id}.json`).then(t => { items[id] = t; })),
  ]);
  // Un ítem que no pasa la validación no se muestra (banco.test.js ya lo habría detectado).
  for (const id of Object.keys(items)) if (L().validar(items[id], { codigos }).length) delete items[id];
  banco = { url: pl.banco, indice, frases, codigos, items };
  return banco;
}

async function vista(ctx, id, unidad) {
  const { $app, cat, est, esc, guardar, registrar, marcarDia } = ctx;
  const pl = cat.plantillas[id];
  if (!pl || pl.formato !== 'lectura') { location.hash = '#/cursos'; return; }
  document.body.style.overflow = '';
  actual = null;
  const ruta = location.hash;
  // La unidad que abrió el alumno filtra los textos (cualquiera del catálogo: un ejercicio puede tocar otra).
  const unidadAbierta = cat.cursos.some(c => c.unidades.some(u => u.id === unidad)) ? unidad : '';
  const curso = cat.cursos.find(c => c.unidades.some(u => u.id === (unidadAbierta || pl.unidades[0])));
  const nombreUnidad = unidadAbierta && curso ? (curso.unidades.find(u => u.id === unidadAbierta) || {}).nombre : '';
  $app.innerHTML = '<p class="vacio">Cargando…</p>';
  let b;
  try { b = await cargarBanco(pl); } catch {
    $app.innerHTML = '<p class="vacio">No se pudieron cargar los textos. Ábrelos una vez con internet para tenerlos sin conexión.</p>'; return;
  }
  if (location.hash !== ruta) return; // el alumno ya se fue a otra pantalla
  est.practica = est.practica || {};
  const st = est.practica[id] = Object.assign({ hechos: {}, textos: 0, preguntas: 0, aciertos: 0, previos: 0, previosBien: 0, entrada: null, salida: null }, est.practica[id]);
  const volver = `<a class="volver" href="#/curso/${esc(curso ? curso.id : '')}" aria-label="Volver">‹</a>`;
  const subCurso = `${esc(curso ? curso.nombre : '')}${nombreUnidad ? ` · ${esc(nombreUnidad)}` : ''}`;

  // ---------- Dibujo del texto ----------
  // pint: { evidencia, distractor, idea } (listas de ids). modo 'marcar': cada oración es un botón.
  function oracionHTML(o, modo, pint, sel) {
    const cl = ['o'];
    if (pint) {
      if ((pint.evidencia || []).includes(o.id)) cl.push('pinta-ev');
      if ((pint.distractor || []).includes(o.id)) cl.push('pinta-di');
      if ((pint.idea || []).includes(o.id)) cl.push('pinta-idea');
    }
    const n = `<sup class="n" aria-hidden="true">${o.n}</sup>`;
    if (modo === 'marcar') {
      return `<button type="button" class="${cl.join(' ')} marcable${sel === o.id ? ' sel' : ''}" data-o="${esc(o.id)}" aria-pressed="${sel === o.id}"><span class="lector">Oración ${esc(o.n)}: </span>${n}${esc(o.t)}</button>`;
    }
    return `<span class="${cl.join(' ')}" data-o="${esc(o.id)}">${n}${esc(o.t)}</span>`;
  }
  function textoHTML(it, modo, pint, sel) {
    const ors = L().oraciones(it);
    const pars = [...new Set(ors.map(o => o.parrafo))];
    return pars.map(k => `<p class="lec-par${modo === 'marcar' ? ' marcar' : ''}"><span class="lec-np" aria-hidden="true">${CIRC[k - 1] || k}</span> ${ors.filter(o => o.parrafo === k).map(o => oracionHTML(o, modo, pint, sel)).join(' ')}</p>`).join('');
  }
  // Fragmento citado en la explicación, con el color de su rol (una línea por oración).
  function citaHTML(it, ids, rol) {
    const ors = L().oraciones(it).filter(o => ids.includes(o.id));
    if (!ors.length) return '';
    return `<div class="cita">${ors.map(o => `<p><span class="o ${rol}"><sup class="n">${esc(it.ejercicio ? o.id : o.n)}</sup>${esc(o.t)}</span></p>`).join('')}</div>`;
  }
  function cuerpoEjercicioHTML(it) {
    const c = it.cuerpo || {};
    const t = it.preguntas[0].tipo;
    if (t === 'analogia' && c.base) return `<p class="lec-base">${esc(c.base[0])} : ${esc(c.base[1])}</p>`;
    if (c.terminos) return `<div class="chips lec-terminos">${c.terminos.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>`;
    if (c.oracion) return `<p class="lec-oracion">${esc(c.oracion)}</p>`;
    if (c.oraciones) return `<ol class="lec-lista">${c.oraciones.map(o => `<li><b>${esc(o.n || o.id)}.</b> ${esc(o.t)}</li>`).join('')}</ol>`;
    return '';
  }

  // ---------- Armazón de la pantalla ----------
  function armar(it, sub, etiqueta) {
    const conTexto = !it.ejercicio;
    $app.innerHTML = `<div class="lectura ${conTexto ? 'fase-leer' : 'sin-texto'}">
      <header class="lec-cab">${volver}<p class="sub">${subCurso}</p><h1>${esc(it.titulo)}</h1><p class="sub">${sub}</p>
        ${etiqueta ? `<p class="etq-p lec-etq">${esc(etiqueta)}</p>` : ''}</header>
      ${conTexto ? `<button type="button" class="lec-franja" aria-expanded="false" aria-controls="lecTexto"><b>${esc(it.titulo)}</b><span>Ver texto ▾</span></button>` : ''}
      <div class="lec-cols">
        ${conTexto ? `<aside class="lec-texto" id="lecTexto" aria-label="Texto: ${esc(it.titulo)}">
          <div class="lec-hoja-barra"><span class="asa" aria-hidden="true"></span><button type="button" class="btn borde" id="cerrarHoja">Volver a la pregunta</button></div>
          <div class="lec-cuerpo" id="lecCuerpo">${textoHTML(it)}</div></aside>` : ''}
        <section class="lec-panel" id="lecPanel" aria-live="polite"></section>
      </div>
      <div class="lec-velo" hidden></div></div>`;
    const raiz = $app.querySelector('.lectura');
    if (conTexto) hoja(raiz);
    return raiz;
  }
  const fase = (raiz, f) => { raiz.classList.remove('fase-leer', 'fase-marcar', 'fase-preg'); raiz.classList.add(f); };
  const pintar = (it, pint, modo, sel) => { const c = document.getElementById('lecCuerpo'); if (c) c.innerHTML = textoHTML(it, modo, pint, sel); };

  // La hoja que sube (celular): se abre con la franja, se cierra deslizando hacia abajo, con el botón o con Esc.
  function hoja(raiz) {
    const aside = raiz.querySelector('.lec-texto'), franja = raiz.querySelector('.lec-franja'), velo = raiz.querySelector('.lec-velo');
    const abrir = () => {
      raiz.classList.add('hoja-abierta'); velo.hidden = false; franja.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; aside.setAttribute('role', 'dialog'); aside.setAttribute('aria-modal', 'true');
      setTimeout(() => document.getElementById('cerrarHoja').focus(), 30);
    };
    const cerrar = () => {
      if (!raiz.classList.contains('hoja-abierta')) return;
      raiz.classList.remove('hoja-abierta'); velo.hidden = true; franja.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; aside.removeAttribute('role'); aside.removeAttribute('aria-modal'); aside.style.transform = '';
      franja.focus({ preventScroll: true });
    };
    franja.onclick = abrir; velo.onclick = cerrar;
    document.getElementById('cerrarHoja').onclick = cerrar;
    raiz.abrirHoja = abrir; raiz.cerrarHoja = cerrar;
    const barra = raiz.querySelector('.lec-hoja-barra');
    let y0 = null, dy = 0;
    barra.addEventListener('pointerdown', e => { if (e.target.closest('button') || !raiz.classList.contains('hoja-abierta')) return; y0 = e.clientY; dy = 0; barra.setPointerCapture(e.pointerId); aside.classList.add('arrastrando'); });
    barra.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); aside.style.transform = `translateY(${dy}px)`; });
    const soltar = () => { if (y0 === null) return; y0 = null; aside.classList.remove('arrastrando'); aside.style.transform = ''; if (dy > 80) cerrar(); };
    barra.addEventListener('pointerup', soltar); barra.addEventListener('pointercancel', soltar);
  }

  // ---------- Paso previo: seis tipos ----------
  // Devuelve una promesa con la respuesta confirmada. Nada se graba hasta tocar "Confirmar".
  function pasoPrevio(it, q, raiz, panel) {
    return new Promise(listo => {
      const p = q.previo;
      const enTexto = p.tipo === 'marcar-oracion' && !it.ejercicio;
      let sel = null;
      const bloqueo = `<div class="alts-bloqueadas" role="note"><span aria-hidden="true">🔒</span> Las alternativas se abren cuando respondas este paso.</div>`;
      const confirmar = `<div class="lec-confirmar"><span class="sub" id="selTxt">Elige una respuesta.</span><button type="button" class="btn morado" id="confirmarPrevio" disabled>Confirmar</button></div>`;
      let cuerpo = '';
      if (p.tipo === 'marcar-oracion') {
        cuerpo = (it.ejercicio ? `<div class="lec-cuerpo marcar-ej" id="marcarEj"></div>` : `<p class="sub solo-celular">Toca una oración del texto.</p>`)
          + (p.ninguna ? `<button type="button" class="opc ninguna" id="ninguna" aria-pressed="false">Ninguna la dice completa</button>` : '');
      } else if (p.tipo === 'ordenar') {
        cuerpo = `<ol class="tarjetas" id="tarjetas" aria-label="Oraciones para ordenar"></ol>
          <p class="solo-teclado">Con teclado: <kbd>Espacio</kbd> toma una tarjeta, <kbd>↑</kbd> <kbd>↓</kbd> la mueven y <kbd>Espacio</kbd> la suelta.</p>`;
      } else {
        const ops = {
          clasificar: L().CLASES.map(c => [c.id, c.t, '']),
          relacion: L().RELACIONES.map(c => [c.id, c.t, c.d]),
          proposito: L().PROPOSITOS.map(c => [c.id, c.t, '']),
          'relacion-analogia': L().ANALOGIAS.map(c => [c.id, L().textoAnalogia(c.id, (it.cuerpo || {}).base), '']),
        }[p.tipo];
        cuerpo = (p.sonda ? `<blockquote class="sonda">${esc(p.sonda)}</blockquote>` : '')
          + `<div class="opcs${ops.length > 6 ? ' muchas' : ''}" role="radiogroup" aria-label="Respuestas posibles">${ops.map(([v, t, d], k) =>
            `<button type="button" class="opc" role="radio" aria-checked="false" data-v="${esc(v)}"><span class="num">${k + 1}</span><span>${esc(t)}${d ? `<span class="d">${esc(d)}</span>` : ''}</span></button>`).join('')}</div>
          <p class="solo-teclado">Con teclado: <kbd>1</kbd>–<kbd>${ops.length > 9 ? 9 : ops.length}</kbd> o <kbd>↑</kbd> <kbd>↓</kbd> para elegir, <kbd>Enter</kbd> para confirmar.</p>`;
      }
      panel.innerHTML = `${etqPregunta(q)}
        <div class="card previo">
          <div class="etq-p">Antes de ver las alternativas</div>
          ${it.ejercicio && p.tipo !== 'ordenar' && p.tipo !== 'marcar-oracion' ? cuerpoEjercicioHTML(it) : ''}
          <p class="pide">${esc(p.pide)}</p>
          ${cuerpo}
          ${confirmar}
        </div>${bloqueo}`;
      const bConf = document.getElementById('confirmarPrevio'), selTxt = document.getElementById('selTxt');
      const marcarSel = (v, txt) => { sel = v; bConf.disabled = v === null; selTxt.textContent = v === null ? 'Elige una respuesta.' : `Elegiste: ${txt}.`; };
      const t0 = Date.now();
      const fin = () => { if (sel === null) return; actual = null; listo({ respuesta: sel, ms: Date.now() - t0 }); };
      bConf.onclick = fin;

      if (p.tipo === 'marcar-oracion') {
        if (enTexto) fase(raiz, 'fase-marcar');
        const cont = enTexto ? document.getElementById('lecCuerpo') : document.getElementById('marcarEj');
        cont.innerHTML = textoHTML(it, 'marcar', null, null);
        const ids = L().oraciones(it).map(o => o.id);
        const nin = document.getElementById('ninguna');
        const todos = () => [...cont.querySelectorAll('.marcable'), ...(nin ? [nin] : [])];
        const elegirO = (o, teclado) => {
          marcarSel(o, o === 'ninguna' ? 'ninguna la dice completa' : L().etiquetaPrevio(p, o, it));
          let bt = null;
          for (const x of todos()) {
            const on = (x === nin ? 'ninguna' : x.dataset.o) === o;
            x.classList.toggle('sel', on); x.setAttribute('aria-pressed', String(on));
            if (on) bt = x;
          }
          if (teclado && bt) { bt.focus({ preventScroll: true }); bt.scrollIntoView({ block: 'nearest' }); }
        };
        const orden = [...ids, ...(nin ? ['ninguna'] : [])];
        const mover = (o, d) => { const k = orden.indexOf(o) + d; if (k >= 0 && k < orden.length) elegirO(orden[k], true); };
        for (const bt of todos()) {
          const o = bt === nin ? 'ninguna' : bt.dataset.o;
          bt.onclick = () => elegirO(o);
          bt.onkeydown = e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); mover(o, e.key === 'ArrowDown' ? 1 : -1); }
            else if (e.key === 'Enter') { e.preventDefault(); if (sel === o) fin(); else elegirO(o); }
          };
        }
        // ↑ o ↓ sin foco en el texto: va a la oración elegida o, si no hay, elige la primera.
        actual = { tipo: 'marcar', confirmar: fin, enfocar: () => elegirO(sel || ids[0], true) };
      } else if (p.tipo === 'ordenar') {
        ordenar(it, p, marcarSel, fin);
      } else {
        const bts = [...panel.querySelectorAll('.opc')];
        const elegir = (bt, foco) => {
          bts.forEach(x => { const on = x === bt; x.classList.toggle('sel', on); x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
          marcarSel(bt.dataset.v, L().etiquetaPrevio(p, bt.dataset.v, it));
          if (foco) bt.focus();
        };
        bts.forEach((bt, k) => {
          bt.tabIndex = k === 0 ? 0 : -1;
          bt.onclick = () => elegir(bt);
          bt.onkeydown = e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); elegir(bts[(k + 1) % bts.length], true); }
            else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); elegir(bts[(k - 1 + bts.length) % bts.length], true); }
            else if (e.key === 'Enter') { e.preventDefault(); if (sel === bt.dataset.v) fin(); else elegir(bt); }
          };
        });
        actual = { tipo: 'opciones', numero: n => { if (bts[n - 1]) elegir(bts[n - 1], true); }, confirmar: fin };
      }
    });
  }

  // Plan de redacción: tarjetas que se arrastran (dedo o ratón), con botones para subir y bajar y con teclado.
  function ordenar(it, p, marcarSel, fin) {
    const ol = document.getElementById('tarjetas');
    let orden = (it.cuerpo.oraciones || []).map(o => o.n);
    let tomada = null;
    const txt = n => (it.cuerpo.oraciones.find(o => o.n === n) || {}).t || '';
    const anunciar = () => marcarSel(orden.slice(), orden.join(' – '));
    const dibujar = foco => {
      ol.innerHTML = orden.map((n, k) => `<li class="tarjeta${tomada === n ? ' tomada' : ''}" data-n="${esc(n)}" tabindex="0" aria-label="${esc(n)}, lugar ${k + 1} de ${orden.length}${tomada === n ? ', tomada' : ''}">
        <span class="asa-t" aria-hidden="true">⠿</span><b>${esc(n)}</b><span class="tx">${esc(txt(n))}</span>
        <span class="mover"><button type="button" data-mover="-1" aria-label="Subir ${esc(n)}"${k === 0 ? ' disabled' : ''}>↑</button><button type="button" data-mover="1" aria-label="Bajar ${esc(n)}"${k === orden.length - 1 ? ' disabled' : ''}>↓</button></span></li>`).join('');
      ol.querySelectorAll('.tarjeta').forEach(li => {
        const n = li.dataset.n;
        li.querySelectorAll('[data-mover]').forEach(bt => bt.onclick = () => mover(n, Number(bt.dataset.mover), bt.dataset.mover));
        li.onkeydown = e => {
          if (e.target !== li) return;
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tomada = tomada === n ? null : n; dibujar(n); }
          else if (e.key === 'Escape' && tomada) { e.preventDefault(); tomada = null; dibujar(n); }
          else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); const d = e.key === 'ArrowDown' ? 1 : -1;
            if (tomada === n) mover(n, d); else { const k = orden.indexOf(n) + d; if (orden[k]) ol.querySelector(`[data-n="${CSS.escape(orden[k])}"]`).focus(); }
          }
        };
        li.querySelector('.asa-t').addEventListener('pointerdown', e => arrastrar(e, li));
      });
      if (foco !== undefined) {
        const li = ol.querySelector(`[data-n="${CSS.escape(foco.n || foco)}"]`);
        if (li) (foco.boton ? li.querySelector(`[data-mover="${foco.boton}"]:not(:disabled)`) || li : li).focus();
      }
    };
    const mover = (n, d, boton) => {
      const k = orden.indexOf(n), j = k + d;
      if (j < 0 || j >= orden.length) return;
      [orden[k], orden[j]] = [orden[j], orden[k]];
      anunciar(); dibujar(boton ? { n, boton } : n);
    };
    // Arrastre con eventos de puntero: la tarjeta sigue al dedo y cambia de lugar al pasar la mitad de la vecina.
    function arrastrar(e, li) {
      e.preventDefault();
      const n = li.dataset.n; let y = e.clientY;
      li.classList.add('arrastrando'); li.setPointerCapture(e.pointerId);
      const mov = ev => {
        const dy = ev.clientY - y; li.style.transform = `translateY(${dy}px)`;
        const k = orden.indexOf(n);
        const vecina = ol.children[dy > 0 ? k + 1 : k - 1];
        if (vecina && Math.abs(dy) > vecina.offsetHeight / 2) {
          const d = dy > 0 ? 1 : -1;
          [orden[k], orden[k + d]] = [orden[k + d], orden[k]];
          y += d * vecina.offsetHeight;
          ol.insertBefore(li, d > 0 ? vecina.nextSibling : vecina);
          li.style.transform = `translateY(${ev.clientY - y}px)`;
        }
      };
      const soltar = () => { li.removeEventListener('pointermove', mov); li.removeEventListener('pointerup', soltar); li.removeEventListener('pointercancel', soltar); anunciar(); dibujar(); };
      li.addEventListener('pointermove', mov); li.addEventListener('pointerup', soltar); li.addEventListener('pointercancel', soltar);
    }
    dibujar(); anunciar();
    actual = { tipo: 'ordenar', confirmar: fin };
  }

  const etqPregunta = q => `<div class="etq-p">${q.numero ? `Pregunta ${q.numero} de ${q.total}` : 'Pregunta'}</div>`;
  const altsHTML = q => `<p class="preg">${esc(q.enunciado)}</p>
    <div class="alts lec-alts" role="group" aria-label="Alternativas">${q.alternativas.map(a =>
      `<button type="button" class="alt" data-letra="${a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.t)}</span></button>`).join('')}</div>
    <p class="solo-teclado">Con teclado: <kbd>A</kbd>–<kbd>${q.alternativas[q.alternativas.length - 1].letra}</kbd> o <kbd>1</kbd>–<kbd>${q.alternativas.length}</kbd> para elegir, <kbd>Enter</kbd> para seguir.</p>`;
  function esperarAlternativa(q) {
    return new Promise(listo => {
      const t0 = Date.now();
      const bts = [...document.querySelectorAll('.lec-alts .alt')];
      const elegir = letra => { if (bts[0].disabled) return; bts.forEach(x => { x.disabled = true; }); actual = null; listo({ letra, ms: Date.now() - t0 }); };
      bts.forEach(bt => bt.onclick = () => elegir(bt.dataset.letra));
      actual = { tipo: 'alternativas', letra: l => { if (bts.some(x => x.dataset.letra === l)) elegir(l); } };
    });
  }

  // ---------- Leer ----------
  function leer(it, raiz, etiqueta) {
    return new Promise(listo => {
      const panel = document.getElementById('lecPanel');
      const t0 = Date.now();
      panel.innerHTML = `<div class="card lec-leido">
        <p class="sub">${etiqueta || 'Lee con calma: no hay cronómetro. El texto se queda a la mano mientras respondes.'}</p>
        <button type="button" class="btn morado ancho" id="yaLei">Ya lo leí: ir a las preguntas ›</button></div>`;
      document.getElementById('yaLei').onclick = () => { actual = null; listo(Date.now() - t0); };
      actual = { tipo: 'leer', seguir: () => document.getElementById('yaLei').click() };
      window.scrollTo(0, 0);
    });
  }

  // ---------- Pruebas de entrada y salida: texto fijo, sin paso previo ni corrección ----------
  async function prueba(faseP) {
    const it0 = b.items[b.indice[faseP]];
    if (!it0) return faseP === 'entrada' ? practica() : resultado();
    const it = L().preparar(it0, faseP);
    const raiz = armar(it, faseP === 'entrada'
      ? 'Antes de empezar: un texto con preguntas para saber de dónde partes. No cuenta para nada; responde lo que creas.'
      : 'Prueba final: un texto parecido al del inicio, para ver cuánto avanzaste.', faseP === 'entrada' ? 'Prueba de entrada' : 'Prueba de salida');
    const t0 = Date.now();
    const ms = await leer(it, raiz);
    registrar(L().ev.lectura({ modulo: id, unidad: it.preguntas[0].unidad, item: it, ms, fase: faseP }));
    fase(raiz, 'fase-preg');
    const resultados = [];
    for (const [k, q0] of it.preguntas.entries()) {
      const q = { ...q0, numero: k + 1, total: it.preguntas.length };
      document.getElementById('lecPanel').innerHTML = `<div class="card practica">${etqPregunta(q)}${altsHTML(q)}</div>`;
      window.scrollTo(0, 0);
      const { letra } = await esperarAlternativa(q);
      resultados.push(L().calificar(q, letra));
    }
    st[faseP] = { aciertos: resultados.filter(r => r.correcta).length, total: resultados.length }; guardar();
    registrar(L().ev.prueba({ fase: faseP, modulo: id, unidad: it.preguntas[0].unidad, item: it, resultados, ms: Date.now() - t0 }));
    return faseP === 'entrada' ? practica() : resultado();
  }

  // ---------- Práctica ----------
  async function practica() {
    const lista = L().lista(b.indice, b.items, unidadAbierta);
    if (!lista.length) { $app.innerHTML = `${volver}<p class="vacio">Todavía no hay textos para esta unidad.</p>`; return; }
    const it0 = L().siguiente(lista, st.hechos);
    const it = L().preparar(it0, est.alumno);
    const nTexto = b.indice.textos.indexOf(it.id) + 1;
    const sub = it.ejercicio ? `${esc(L().NOMBRE_EJERCICIO[it.preguntas[0].tipo] || 'Ejercicio')}` : `Texto ${nTexto} · ${it.preguntas.length} preguntas`;
    const raiz = armar(it, sub);
    if (!it.ejercicio) {
      const ms = await leer(it, raiz);
      registrar(L().ev.lectura({ modulo: id, unidad: unidadAbierta || it.preguntas[0].unidad, item: it, ms }));
    }
    let bien = 0;
    for (const [k, q0] of it.preguntas.entries()) {
      const q = { ...q0, numero: it.ejercicio ? 0 : k + 1, total: it.preguntas.length };
      const panel = document.getElementById('lecPanel');
      if (!it.ejercicio) { fase(raiz, 'fase-preg'); pintar(it, null); }
      window.scrollTo(0, 0);
      let rPrevio = null;
      if (q.previo) {
        const { respuesta, ms } = await pasoPrevio(it, q, raiz, panel);
        rPrevio = L().calificarPrevio(q.previo, respuesta, it);
        registrar(L().ev.previo({ modulo: id, pregunta: q, resultado: rPrevio, codigos: b.codigos, ms }));
        st.previos++; if (rPrevio.correcta) st.previosBien++; guardar();
        if (!it.ejercicio) { fase(raiz, 'fase-preg'); pintar(it, null); }
      }
      // El paso previo no se corrige todavía: se guarda y se abren las alternativas.
      panel.innerHTML = `${etqPregunta(q)}
        ${rPrevio ? `<div class="previo-hecho"><span class="etq-p">Tu paso previo</span> ${esc(L().etiquetaPrevio(q.previo, rPrevio.opcion, it))}. Lo revisamos después de que elijas.</div>` : ''}
        <div class="card practica">${it.ejercicio ? cuerpoEjercicioHTML(it) : ''}${altsHTML(q)}<div id="retro"></div></div>`;
      const { letra, ms } = await esperarAlternativa(q);
      const r = L().calificar(q, letra);
      registrar(L().ev.respuesta({ modulo: id, pregunta: q, resultado: r, codigos: b.codigos, ms }));
      st.preguntas++; if (r.correcta) { st.aciertos++; bien++; }
      est.vistas[q.unidad] = est.vistas[q.unidad] || new Date().toLocaleDateString('en-CA');
      guardar(); marcarDia();
      panel.querySelectorAll('.lec-alts .alt').forEach(x => {
        if (x.dataset.letra === r.clave.letra) x.classList.add('ok'); else if (x.dataset.letra === letra) x.classList.add('mal');
      });
      const pint = L().pintura(q, letra);
      if (!it.ejercicio) pintar(it, pint);
      await explicar(it, q, r, rPrevio, k === it.preguntas.length - 1);
    }
    st.hechos[it.id] = (st.hechos[it.id] || 0) + 1; st.textos++; guardar();
    terminado(it, bien);
  }

  function explicar(it, q, r, rPrevio, ultima) {
    return new Promise(listo => {
      const a = r.alternativa, c = r.clave;
      const marca = rol => `<span class="marca ${rol}" aria-hidden="true"></span>`;
      let h = `<div class="retro ${r.correcta ? 'bien' : 'malo'}">
        ${r.correcta && window.Ilus ? Ilus.gato('class="retro-gato"') : ''}
        <b>${r.correcta ? `¡Bien! Es la ${c.letra}. ${PREMIOS[st.preguntas % PREMIOS.length]}` : `Elegiste la ${a.letra}. La correcta es la ${c.letra}: ${esc(c.t)}`}</b></div>
        <div class="expl">`;
      if (!r.correcta) {
        h += `<p>${a.origen ? marca('di') : ''}${esc(a.explicacion)}</p>${b.frases[a.codigo] ? `<p class="frase">${esc(b.frases[a.codigo])}</p>` : ''}`;
        if (a.origen && !it.ejercicio) h += `<p class="sub">${marca('di')}De aquí sale lo que elegiste:</p>${citaHTML(it, [a.origen], 'pinta-di')}`;
      }
      h += `<p>${marca('ev')}${r.correcta ? '' : '<b>La correcta:</b> '}${esc(c.explicacion)}</p>`;
      if (!it.ejercicio && (c.evidencia || []).length) h += `<p class="sub">${marca('ev')}Lo prueba el texto:</p>${citaHTML(it, c.evidencia, 'pinta-ev')}`;
      if (rPrevio) {
        const cp = L().correccionPrevio(q.previo, rPrevio, it, b.frases);
        const marcar = q.previo.tipo === 'marcar-oracion';
        const cita = x => (marcar && x !== 'Ninguna la dice completa' ? x : `«${x}»`);
        const verbo = marcar ? 'marcaste' : q.previo.tipo === 'ordenar' ? 'ordenaste así:' : 'elegiste';
        h += `<div class="corr-previo ${cp.correcta ? 'bien' : 'malo'}"><div class="etq-p">Tu paso previo</div>
          <p><b>Antes ${verbo} ${esc(cita(cp.eligio))}.</b> ${cp.correcta ? '<span class="ok-t">Bien.</span>' : `<span class="mal-t">Se esperaba ${esc(marcar ? cp.aceptada : cita(cp.aceptada))}.</span>`}</p>
          ${cp.porQue ? `<p>${esc(cp.porQue)}</p>` : ''}
          <p>${cp.idea.length && !it.ejercicio ? marca('idea') : ''}${esc(cp.explicacion)}</p>
          ${cp.idea.length && !it.ejercicio ? citaHTML(it, cp.idea, 'pinta-idea') : ''}</div>`;
      }
      if (!it.ejercicio) h += `<button type="button" class="btn borde solo-celular" id="verTexto">Ver los colores en el texto</button>`;
      h += `<details class="demas"><summary>Ver las demás alternativas</summary><ul>${q.alternativas.filter(x => x !== a && x !== c).map(x =>
        `<li><b>${x.letra}.</b> ${esc(x.t)}<br><span class="sub">${esc(x.explicacion)}</span></li>`).join('')}</ul></details>
        <button type="button" class="btn morado ancho" id="otro">${ultima ? 'Terminar' : 'Siguiente pregunta'} ›</button></div>`;
      const retro = document.getElementById('retro');
      retro.innerHTML = h;
      const vt = document.getElementById('verTexto');
      if (vt) vt.onclick = () => { const rz = $app.querySelector('.lectura'); if (rz.abrirHoja) rz.abrirHoja(); };
      document.getElementById('otro').onclick = () => { actual = null; listo(); };
      actual = { tipo: 'explicacion', seguir: () => document.getElementById('otro').click() };
      retro.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function terminado(it, bien) {
    const salidaLista = b.indice.salida && b.items[b.indice.salida] && st.entrada && !st.salida && st.textos >= MIN_SALIDA;
    $app.innerHTML = `${volver}<p class="sub">${subCurso}</p><h1>${esc(it.titulo)}</h1>
      <div class="card resultado" style="margin-top:16px">
        ${window.Ilus ? Ilus.taza('class="resultado-taza"') : ''}
        <p><b>${bien} de ${it.preguntas.length} ${it.preguntas.length === 1 ? 'pregunta' : 'preguntas'} bien.</b> ${bien === it.preguntas.length ? PREMIOS[st.textos % PREMIOS.length] : 'Cada error con nombre es algo que ya no te va a pasar.'}</p>
        <p class="sub">Llevas ${st.textos} ${st.textos === 1 ? 'texto' : 'textos'} y ${st.aciertos} de ${st.preguntas} preguntas bien.</p>
        ${salidaLista ? `<div class="aviso">Ya leíste ${st.textos} textos. <a href="#" id="irSalida"><b>Haz la prueba final</b></a> cuando quieras.</div>` : ''}
        <button type="button" class="btn morado ancho" id="seguir" style="margin-top:8px">Otro texto ›</button></div>`;
    document.getElementById('seguir').onclick = () => practica();
    const ir = document.getElementById('irSalida'); if (ir) ir.onclick = e => { e.preventDefault(); prueba('salida'); };
    actual = { tipo: 'fin', seguir: () => document.getElementById('seguir').click() };
    window.scrollTo(0, 0);
  }

  function resultado() {
    const e = st.entrada, s = st.salida;
    $app.innerHTML = `${volver}<p class="sub">${subCurso}</p><h1>${esc(pl.titulo)}</h1><div class="card resultado" style="margin-top:16px">
      ${window.Ilus ? Ilus.taza('class="resultado-taza"') : ''}
      <div class="stats" style="grid-template-columns:1fr 1fr">
        <div class="stat"><div class="l">Prueba de entrada</div><div class="n">${e ? `${e.aciertos}/${e.total}` : '—'}</div></div>
        <div class="stat"><div class="l">Prueba final</div><div class="n">${s ? `${s.aciertos}/${s.total}` : '—'}</div></div></div>
      <p class="sub" style="margin-top:12px">Leíste ${st.textos} textos y acertaste ${st.aciertos} de ${st.preguntas} preguntas.</p>
      <button type="button" class="btn morado ancho" id="seguir" style="margin-top:8px">Seguir leyendo</button></div>`;
    document.getElementById('seguir').onclick = () => practica();
    actual = { tipo: 'fin', seguir: () => document.getElementById('seguir').click() };
  }

  if (b.indice.entrada && b.items[b.indice.entrada] && !st.entrada) prueba('entrada');
  else practica();
}

// Teclado (laboratorio de cómputo), solo en la ruta de lectura. A–E o 1–5 eligen una alternativa;
// en el paso previo, 1–9 eligen una opción; Enter sigue o confirma; Esc cierra la hoja del texto.
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#/lectura') || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const raiz = document.querySelector('.lectura');
  if (e.key === 'Escape' && raiz && raiz.classList.contains('hoja-abierta')) { e.preventDefault(); raiz.cerrarHoja(); return; }
  if (raiz && raiz.classList.contains('hoja-abierta')) return;
  if (!actual) return;
  const k = e.key.toUpperCase();
  if (actual.tipo === 'alternativas') {
    const letra = /^[A-E]$/.test(k) ? k : /^[1-5]$/.test(k) ? 'ABCDE'[+k - 1] : null;
    if (letra) { e.preventDefault(); actual.letra(letra); }
    return;
  }
  if (actual.tipo === 'opciones' && /^[1-9]$/.test(k)) { e.preventDefault(); actual.numero(+k); return; }
  if (actual.tipo === 'marcar' && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && !(e.target.closest && e.target.closest('.marcable, .ninguna'))) { e.preventDefault(); actual.enfocar(); return; }
  // Enter sobre un botón o un enlace enfocado ya lo activa el navegador (o su propio oyente): no repetir.
  if (e.key === 'Enter' && !(e.target.closest && e.target.closest('button, a, .tarjeta'))) {
    if (actual.seguir) { e.preventDefault(); actual.seguir(); }
    else if (actual.confirmar) { e.preventDefault(); actual.confirmar(); }
  }
});

window.LecturaVista = { vista };
})();
