// Pantalla de práctica para módulos del formato "predicciones" (docs/arquitectura.md).
// Flujo: prueba de entrada (3 preguntas iguales para todos, sin corrección) → práctica con
// predicción, explicación del error elegido y solución → prueba de salida (3 preguntas paralelas).
// Todo se registra de forma anónima con ctx.registrar (ver nucleo/medicion.js).
// Escena viva (docs/escena-viva.md): si el problema trae `escena`, la práctica muestra la figura del kit
// (nucleo/kit/), deja responder arrastrando (si trae `respuesta.tipo: 'arrastrar'`) o con alternativas, dibuja el
// fantasma del error elegido y cambia la lista de la solución por una línea de tiempo. Sin `escena`, todo sigue igual.
// La mascota (nucleo/mascota.js, de otra rutina) tiene su hueco reservado; si existe, se le piden poses.
(function () {
'use strict';
const N_PRUEBA = 3, MIN_PRACTICA = 5;

// ---- Kit de escenas vivas: se carga solo cuando un problema trae escena (y su hoja de estilos, al entrar) ----
const KIT_CSS = '/nucleo/kit/kit.css';
const KIT_JS = ['/nucleo/kit/kit.js', '/nucleo/kit/trazo.js', '/nucleo/kit/linea-tiempo.js'];
const cargados = {};
// async = false: se bajan en paralelo y corren en el orden en que se insertan (kit antes que trazo y la pieza).
const cargarScript = src => cargados[src] || (cargados[src] = new Promise((ok, mal) => {
  const s = document.createElement('script'); s.src = src; s.async = false;
  s.onload = ok; s.onerror = () => { delete cargados[src]; s.remove(); mal(new Error('No se pudo cargar ' + src)); };
  document.head.appendChild(s);
}));
let estiloKit = null;
// Se espera a la hoja antes de pintar (el hueco de la mascota y las alturas reservadas no deben saltar); si falla, se sigue.
const cargarEstiloKit = () => estiloKit || (estiloKit = new Promise(ok => {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = KIT_CSS;
  l.onload = ok; l.onerror = ok; document.head.appendChild(l);
}));
async function cargarPieza(id) {
  if (!/^[a-z0-9-]+$/.test(String(id))) throw new Error('Pieza inválida');
  await Promise.all([...KIT_JS, `/nucleo/kit/piezas/${id}.js`].map(cargarScript));
  const pieza = window.Kit && window.Kit.piezas && window.Kit.piezas[id];
  if (!pieza) throw new Error('La pieza no se registró');
  return pieza;
}
// Mascota: repertorio cerrado de docs/escena-viva.md, sección 6. Nunca rompe la práctica si falla o no está.
function pose(nombre) {
  try { if (window.Mascota && typeof window.Mascota.pose === 'function') window.Mascota.pose(nombre); } catch (e) { /* la app nunca espera a la mascota */ }
}
const MASCOTA = '<div class="mascota" data-mascota aria-hidden="true"></div>';
const lista = x => (Array.isArray(x) ? x : [String(x)]);
const ICONO_MENOS = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const ICONO_MAS = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

function texto(partes, p, esc) {
  return partes.map(x => {
    if (typeof x === 'string') return esc(x);
    if (x.formula) return `<span class="formula">${esc(x.t)}</span>`;
    const col = (p.variables[x.v] || {}).color || 'o';
    // Un tramo largo (una frase, no un dato) puede partirse en líneas: si no, se sale de la tarjeta en el celular.
    const largo = String(x.t).length > 22 ? ' largo' : '';
    return `<span class="var c-${esc(col)}${largo}" title="${esc((p.variables[x.v] || {}).nombre || '')}">${esc(x.t)}</span>`;
  }).join('');
}

// Figura opcional del problema: { svg, alt }. El SVG lo arma el generador con código propio
// (nunca con texto del alumno) y escapa sus textos con Predicciones.xml; sus colores van con
// var(--c-o), var(--c-i), var(--c-h), var(--c-d) y currentColor, así sirve en claro y en oscuro.
function figuraHTML(f, esc) {
  if (!f || typeof f.svg !== 'string' || !/^<svg[\s>]/.test(f.svg)) return '';
  return `<figure class="fig-gen" role="img" aria-label="${esc(f.alt || 'Figura del problema')}">${f.svg}</figure>`;
}

// Convenciones de academia (nucleo/convencion.js): la respuesta sigue la del examen, y la tarjeta lo dice en grande.
function convencionesHTML(ids) {
  if (!Array.isArray(ids) || !window.Convencion) return '';
  return ids.filter(id => window.Convencion.LISTA[id]).map(id => window.Convencion.html(id)).join('');
}

function cargarGenerador(pl) {
  if (window.Generadores && window.Generadores[pl.id]) return Promise.resolve(window.Generadores[pl.id]);
  return new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = pl.archivos[0];
    s.onload = () => (window.Generadores && window.Generadores[pl.id]) ? ok(window.Generadores[pl.id]) : mal(new Error('El generador no se registró'));
    s.onerror = () => mal(new Error('No se pudo cargar el generador'));
    document.head.appendChild(s);
  });
}

async function vista(ctx, id) {
  const { $app, cat, est, esc, guardar, registrar, marcarDia } = ctx;
  const pl = cat.plantillas[id];
  if (!pl || pl.formato !== 'predicciones') { location.hash = '#/cursos'; return; }
  const unidad = pl.unidades[0];
  const curso = cat.cursos.find(c => c.unidades.some(u => u.id === unidad));
  $app.innerHTML = '<p class="vacio">Cargando…</p>';
  let gen;
  try { [gen] = await Promise.all([cargarGenerador(pl), cargarEstiloKit()]); } catch (e) { $app.innerHTML = `<p class="vacio">${esc(e.message)}</p>`; return; }
  est.practica = est.practica || {};
  // Con valores por defecto: «Borrar mi avance» deja solo { entrada, salida } y sin esto hechos quedaba en NaN.
  const st = est.practica[id] = Object.assign({ hechos: 0, aciertos: 0, entrada: null, salida: null }, est.practica[id] || {});
  // Vuelve a la unidad (13 nov 2026: la página del curso ya no lista ejercicios; están en #/unidad/<id>/ejercicios).
  const volver = `<a class="volver" href="#/unidad/${esc(unidad)}/ejercicios" aria-label="Volver">‹</a>`;
  const cabecera = sub => `${volver}<p class="sub">${esc(curso ? curso.nombre : '')}</p><h1>${esc(pl.titulo)}</h1><p class="sub">${sub}</p>`;

  function problemaHTML(p, n, total, etiqueta, conMascota) {
    return `<article class="card practica" style="margin-top:16px">
      <div class="etq-p">${esc(etiqueta)}${total ? ` · ${n} de ${total}` : ''}</div>
      <p class="enun">${texto(p.enunciado, p, esc)}</p>
      ${p.datos ? `<p class="sub">${esc(p.datos)}</p>` : ''}
      ${figuraHTML(p.figura, esc)}
      <p class="preg">${texto(p.pregunta, p, esc)}</p>
      <div class="alts" role="group" aria-label="Alternativas">${p.alternativas.map(a =>
        `<button class="alt" data-letra="${a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.texto)}</span></button>`).join('')}
        <button class="alt nose" data-nose="1">No sé</button></div>
      <p class="solo-teclado">Con teclado: <kbd>A</kbd>–<kbd>${p.alternativas[p.alternativas.length - 1].letra}</kbd> o <kbd>1</kbd>–<kbd>${p.alternativas.length}</kbd> para elegir, <kbd>0</kbd> o <kbd>N</kbd> para «No sé», <kbd>Enter</kbd> para seguir.</p>
      ${conMascota ? `<div class="retro-fila">${MASCOTA}<div id="retro" role="status"></div></div><div id="sol"></div>` : '<div id="retro"></div>'}
    </article>`;
  }
  const alternativasHTML = p => `<div class="alts" role="group" aria-label="Alternativas">${p.alternativas.map(a =>
    `<button class="alt" data-letra="${a.letra}"><span class="letra">${a.letra}</span><span>${esc(a.texto)}</span></button>`).join('')}
    <button class="alt nose" data-nose="1">No sé</button></div>`;

  // ---- Pruebas de entrada y salida: mismas semillas para todos, sin corrección inmediata ----
  function prueba(fase) {
    let i = 0, aciertos = 0, nose = 0; const respuestas = []; const t0 = Date.now();
    const sig = () => {
      if (i === N_PRUEBA) {
        st[fase] = { aciertos, total: N_PRUEBA, nose }; guardar();
        registrar({ tipo: 'prueba', fase, modulo: id, unidad, aciertos, total: N_PRUEBA, respuestas: respuestas.join(''), nose, ms: Date.now() - t0 });
        return fase === 'entrada' ? practica() : resultado();
      }
      const p = gen.generar(`${fase}-${i + 1}`);
      $app.innerHTML = cabecera(fase === 'entrada'
        ? 'Antes de empezar: 3 preguntas rápidas para saber de dónde partes. No cuentan para nada. Si no lo sabes, marca «No sé»: nos ayuda más que adivinar.'
        : 'Prueba final: 3 preguntas parecidas a las del inicio, para ver cuánto avanzaste.') + problemaHTML(p, i + 1, N_PRUEBA, fase === 'entrada' ? 'Prueba de entrada' : 'Prueba de salida');
      const pintada = Date.now();
      $app.querySelectorAll('.alt').forEach(b => b.onclick = () => {
        if (Date.now() - pintada < 450) return; // un doble toque no contesta también la siguiente
        if (b.dataset.nose) { respuestas.push('0'); nose++; i++; return sig(); } // «No sé»: 0 en la cadena
        const a = p.alternativas.find(x => x.letra === b.dataset.letra);
        respuestas.push(a.letra); if (a.correcta) aciertos++; i++; sig();
      });
      window.scrollTo(0, 0);
    };
    sig();
  }

  // ---- Práctica: predecir, ver la explicación del error y la solución ----
  // Lo común a los dos formatos al cerrar un problema: avance, día, unidad vista y medición (la misma de siempre).
  function anotar(p, { a, nose, t0, extra }) {
    st.hechos++; if (a && a.correcta) st.aciertos++; if (nose) st.nose = (st.nose || 0) + 1; guardar(); marcarDia();
    est.vistas[unidad] = est.vistas[unidad] || new Date().toLocaleDateString('en-CA'); guardar();
    registrar(Object.assign(nose
      ? { tipo: 'prediccion', modulo: id, unidad, problema: p.id, opcion: '', correcta: false, error: '', respaldo: '', nose: true, ms: Date.now() - t0 }
      : { tipo: 'prediccion', modulo: id, unidad, problema: p.id, opcion: a ? a.letra : '', correcta: !!(a && a.correcta),
        error: a && a.error ? a.error.id : '', respaldo: a && a.error ? a.error.respaldo : '', ms: Date.now() - t0 }, extra || {}));
    pose(nose ? 'ayuda' : a && a.correcta ? 'celebra' : 'acompaña');
  }

  async function practica() {
    const n = st.hechos + 1;
    const p = gen.generar(`${est.alumno}-${n}`);
    if (p.escena && p.escena.pieza) {
      const h = location.hash;
      let pieza = null;
      try { pieza = await cargarPieza(p.escena.pieza); } catch (e) { pieza = null; } // sin el kit, el formato de siempre
      if (location.hash !== h) return; // el alumno ya se fue a otra pantalla
      if (pieza) return practicaViva(p, n, pieza);
    }
    const t0 = Date.now();
    const listaSalida = st.hechos >= MIN_PRACTICA && !st.salida;
    $app.innerHTML = cabecera(`Problema ${n} · aciertos ${st.aciertos} de ${st.hechos}`) +
      (listaSalida ? `<div class="aviso">Ya practicaste ${st.hechos} problemas. <a href="#" id="irSalida"><b>Haz la prueba final</b></a> cuando quieras.</div>` : '') +
      problemaHTML(p, 0, 0, 'Predice antes de ver la solución', true);
    const ir = document.getElementById('irSalida'); if (ir) ir.onclick = e => { e.preventDefault(); prueba('salida'); };
    pose('señala');
    let tocado = false;
    $app.querySelector('.practica').addEventListener('pointerdown', () => { if (!tocado) { tocado = true; pose('reposo'); } }, { once: true });
    $app.querySelectorAll('.alt').forEach(b => b.onclick = () => {
      if (b.disabled || Date.now() - t0 < 450) return; // doble toque desde «Otro problema»
      // «No sé»: se muestra la respuesta y su solución sin marcar error, y se registra nose: true.
      const nose = !!b.dataset.nose;
      const a = nose ? null : p.alternativas.find(x => x.letra === b.dataset.letra);
      const correcta = p.alternativas.find(x => x.correcta);
      $app.querySelectorAll('.alt').forEach(x => {
        x.disabled = true;
        if (x.dataset.letra === correcta.letra) x.classList.add('ok');
        else if (x === b) x.classList.add(nose ? 'elegida' : 'mal');
      });
      anotar(p, { a, nose, t0 });
      document.getElementById('retro').innerHTML = `
        <div class="retro ${nose ? 'nose' : a.correcta ? 'bien' : 'malo'}">
          <b>${nose ? `Gracias por decirlo. La respuesta es la ${correcta.letra}: ${esc(correcta.texto)}.`
            : a.correcta ? `¡Bien! Es la ${correcta.letra}.` : `La respuesta es la ${correcta.letra}: ${esc(correcta.texto)}.`}</b>
          ${nose ? '<p>Mira la solución paso a paso y prueba con el siguiente.</p>' : a.correcta ? '' : `<p>${esc(a.error.explicacion)}</p>`}
        </div>`;
      document.getElementById('sol').innerHTML = `
        <h3 class="sol-t">Solución paso a paso</h3>
        <ol class="sol">${p.solucion.map(paso => `<li>${texto(paso, p, esc)}</li>`).join('')}</ol>
        ${figuraHTML(p.figuraSolucion, esc)}
        ${convencionesHTML(p.convenciones)}
        <button class="btn morado ancho" id="otro">Otro problema</button>`;
      document.getElementById('otro').onclick = practica;
      document.getElementById('retro').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /*
   * Práctica viva (docs/escena-viva.md): figura del kit arriba de la pregunta, respuesta que se arrastra (o
   * alternativas), fantasma del error elegido sobre la misma figura y la solución como línea de tiempo.
   * Las alturas de la figura, el pie, la fila de control, las acciones y el hueco de la mascota están
   * reservadas desde la primera pintura: al responder, nada de lo que ya estaba se mueve.
   */
  function practicaViva(p, n, pieza) {
    const Kit = window.Kit;
    const datos = p.escena.datos;
    const ctrl = typeof pieza.controles === 'function' ? pieza.controles(datos) : null;
    const r = p.respuesta || {};
    const arrastra = r.tipo === 'arrastrar' && !!(ctrl && ctrl.marca);
    const cm = arrastra ? ctrl.marca : null;
    const paso = arrastra ? (r.paso > 0 ? r.paso : (cm.max - cm.min) / 100) : 0;
    const tolerancia = arrastra ? (r.tolerancia >= 0 ? r.tolerancia : paso) : 0;
    let marca = arrastra ? Kit.respuesta.ajustar(cm.inicio === undefined ? cm.min : cm.inicio, paso, cm.min, cm.max) : null;
    const alt = p.escena.alt || pieza.alt(datos);
    const listaSalida = st.hechos >= MIN_PRACTICA && !st.salida;
    const tienePasos = Array.isArray(p.pasos) && p.pasos.length > 0;
    const pintado = d => pieza.dibujar(datos, d);
    $app.innerHTML = cabecera(`Problema ${n} · aciertos ${st.aciertos} de ${st.hechos}`) +
      (listaSalida ? `<div class="aviso">Ya practicaste ${st.hechos} problemas. <a href="#" id="irSalida"><b>Haz la prueba final</b></a> cuando quieras.</div>` : '') +
      `<article class="card practica viva" style="margin-top:16px">
        <div class="etq-p">Predice primero</div>
        <p class="enun">${texto(p.enunciado, p, esc)}</p>
        ${p.datos ? `<p class="sub">${esc(p.datos)}</p>` : ''}
        <div class="kit-escena">
          <div class="kit-lienzo" id="lienzo" ${arrastra
            ? `role="slider" tabindex="0" aria-label="Tu respuesta: mueve la marca" aria-describedby="kit-alt" aria-valuemin="${cm.min}" aria-valuemax="${cm.max}"`
            : `role="img" aria-label="${esc(alt)}"`}>${pintado(arrastra ? { corte: 0, marca } : { corte: 0 })}</div>
          <p class="kit-solo-lector" id="kit-alt">${esc(alt)}</p>
        </div>
        <div class="kit-pie" id="pie" aria-live="polite"><p class="preg">${texto(p.pregunta, p, esc)}</p>
          <p class="kit-consigna">${arrastra ? 'Arrastra la marca o usa − y +.' : 'Elige una alternativa.'}</p></div>
        <div class="kit-control" id="control">${arrastra
          ? `<button type="button" class="kit-btn" id="menos" aria-label="Menos">${ICONO_MENOS}</button>
             <output class="kit-lectura" id="lectura" aria-hidden="true"></output>
             <button type="button" class="kit-btn" id="mas" aria-label="Más">${ICONO_MAS}</button>` : ''}</div>
        ${arrastra ? '' : alternativasHTML(p)}
        <div class="kit-acciones">${arrastra
          ? '<button type="button" class="alt nose" data-nose="1" id="nose">No sé</button><button type="button" class="btn morado" id="comprobar">Comprobar</button>'
          : '<span></span><button type="button" class="btn morado oculto" id="reserva" tabindex="-1" aria-hidden="true">Otro problema</button>'}</div>
        <div class="retro-fila">${MASCOTA}<div id="retro" role="status"></div></div>
        <div id="extra"></div>
      </article>`;
    const t0 = Date.now();
    const $ = s => $app.querySelector(s);
    const lienzo = $('#lienzo'), pie = $('#pie'), control = $('#control'), lectura = $('#lectura');
    const ir = $('#irSalida'); if (ir) ir.onclick = e => { e.preventDefault(); prueba('salida'); };
    let respondido = false, tocado = false;
    const tocar = () => { if (!tocado) { tocado = true; pose('reposo'); } };
    pose('señala');

    // ---- Responder arrastrando: la marca sigue al dedo; tocar la barra la pone ahí; − y + y el teclado, de a un paso ----
    function mostrarMarca() {
      const t = cm.texto(marca);
      lienzo.innerHTML = pintado({ corte: 0, marca });
      lienzo.setAttribute('aria-valuenow', String(marca));
      lienzo.setAttribute('aria-valuetext', t);
      if (lectura) lectura.textContent = t;
    }
    let cuadro = 0;
    function poner(v) {
      if (respondido) return;
      marca = Kit.respuesta.ajustar(v, paso, cm.min, cm.max);
      if (!cuadro) cuadro = requestAnimationFrame(() => { cuadro = 0; if (!respondido) mostrarMarca(); });
    }
    if (arrastra) {
      mostrarMarca();
      const caja = () => lienzo.querySelector('svg').getBoundingClientRect();
      const valorDe = e => { const b = caja(); return cm.deX((e.clientX - b.left) * ctrl.ancho / b.width); };
      const xDe = v => { const b = caja(); return b.left + cm.aX(v) * b.width / ctrl.ancho; };
      // Mirando la pantalla, → mueve la marca a la derecha (en «lo que se quita», eso baja el valor).
      const sentido = cm.aX(cm.max) >= cm.aX(cm.min) ? 1 : -1;
      let gesto = null;
      lienzo.addEventListener('pointerdown', e => {
        if (respondido || (e.pointerType === 'mouse' && e.button !== 0)) return;
        tocar();
        const cerca = Math.abs(e.clientX - xDe(marca)) <= 24;
        gesto = { id: e.pointerId, x0: e.clientX, y0: e.clientY, antes: marca, agarrado: cerca, v: valorDe(e) };
        if (cerca) { try { lienzo.setPointerCapture(e.pointerId); } catch (x) { /* nada */ } e.preventDefault(); }
      });
      lienzo.addEventListener('pointermove', e => {
        if (!gesto || e.pointerId !== gesto.id) return;
        if (!gesto.agarrado) {
          const dx = Math.abs(e.clientX - gesto.x0), dy = Math.abs(e.clientY - gesto.y0);
          if (!(dx > 8 && dx > dy)) return; // un desplazamiento vertical es para la página
          gesto.agarrado = true; try { lienzo.setPointerCapture(e.pointerId); } catch (x) { /* nada */ }
        }
        poner(valorDe(e));
      });
      lienzo.addEventListener('pointerup', e => { if (gesto && e.pointerId === gesto.id && !gesto.agarrado) poner(gesto.v); gesto = null; });
      lienzo.addEventListener('pointercancel', () => { if (gesto && gesto.agarrado) poner(gesto.antes); gesto = null; });
      lienzo.addEventListener('keydown', e => {
        if (respondido || e.altKey || e.ctrlKey || e.metaKey) return;
        const k = e.key;
        let v = null;
        if (k === 'ArrowRight') v = marca + sentido * paso; else if (k === 'ArrowLeft') v = marca - sentido * paso;
        else if (k === 'ArrowUp') v = marca + paso; else if (k === 'ArrowDown') v = marca - paso;
        else if (k === 'PageUp') v = marca + 10 * paso; else if (k === 'PageDown') v = marca - 10 * paso;
        else if (k === 'Home') v = cm.min; else if (k === 'End') v = cm.max;
        else if (k === 'Enter') { e.preventDefault(); e.stopPropagation(); return comprobar(); }
        else return;
        e.preventDefault(); e.stopPropagation(); tocar(); poner(v);
      });
      // − y +: un paso por toque; si se mantiene apretado, sigue solo (cada 60 ms, después de 400 ms).
      const repetir = (btn, signo) => {
        let espera = 0, rafaga = 0;
        const parar = () => { clearTimeout(espera); clearInterval(rafaga); };
        btn.addEventListener('pointerdown', e => {
          if (respondido || (e.pointerType === 'mouse' && e.button !== 0)) return;
          tocar(); poner(marca + signo * paso);
          espera = setTimeout(() => { rafaga = setInterval(() => poner(marca + signo * paso), 60); }, 400);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, parar));
        btn.addEventListener('click', e => { if (e.detail === 0 && !respondido) { tocar(); poner(marca + signo * paso); } }); // teclado
      };
      repetir($('#menos'), -1); repetir($('#mas'), 1);
      $('#comprobar').onclick = () => comprobar();
      $('#nose').onclick = () => { if (Date.now() - t0 >= 450) cerrar({ nose: true }); };
    } else {
      $app.querySelectorAll('.alts .alt').forEach(b => b.onclick = () => {
        if (b.disabled || Date.now() - t0 < 450) return;
        tocar();
        const nose = !!b.dataset.nose;
        cerrar({ nose, a: nose ? null : p.alternativas.find(x => x.letra === b.dataset.letra), boton: b });
      });
    }

    function comprobar() {
      if (respondido || Date.now() - t0 < 450) return;
      if (cuadro) { cancelAnimationFrame(cuadro); cuadro = 0; }
      cerrar({ a: Kit.respuesta.clasificar(marca, p.alternativas, tolerancia), valor: marca });
    }

    // ---- Cerrar: retroalimentación, fantasma, línea de tiempo y «Otro problema» en el lugar de «Comprobar» ----
    function cerrar({ a = null, nose = false, valor = null, boton = null }) {
      if (respondido) return;
      respondido = true;
      const correcta = p.alternativas.find(x => x.correcta);
      const acierto = !!(a && a.correcta);
      const teniaFoco = $app.contains(document.activeElement) && document.activeElement !== document.body;
      if (!arrastra) {
        $app.querySelectorAll('.alts .alt').forEach(x => {
          x.disabled = true;
          if (x.dataset.letra === correcta.letra) x.classList.add('ok');
          else if (x === boton) x.classList.add(nose ? 'elegida' : 'mal');
        });
      }
      anotar(p, { a, nose, t0, extra: arrastra && !nose ? { valor, via: 'arrastre' } : null });
      // El fantasma: el error con nombre, como lo dibuja la pieza; si la marca no equivale a ninguna opción, ella misma.
      let fantasma = null;
      if (!nose && !acierto) {
        if (a && a.error) fantasma = (p.fantasmas && p.fantasmas[a.error.id]) || { marca: a.valor, rotulo: '' };
        else if (arrastra) fantasma = { marca: valor, rotulo: 'tu marca' };
      }
      // Sin cortes dentro de un valor: «S/ 178,5» y «32 %» no se parten al final de una línea.
      const nb = t => esc(t).replace(/ %/g, '&nbsp;%').replace(/S\/ /g, 'S/&nbsp;');
      const titulo = nose ? `Es ${nb(correcta.texto)}.`
        : acierto ? `¡Bien! Es ${nb(correcta.texto)}.`
          : arrastra ? `Marcaste ${nb(cm.texto(valor))}; es ${nb(correcta.texto)}.`
            : `Es la ${correcta.letra}: ${nb(correcta.texto)}.`;
      const detalle = nose ? 'Mira cómo se llega, paso a paso.' : acierto ? '' : a && a.error ? a.error.explicacion : 'Recorre los pasos sobre la barra.';
      $('#retro').innerHTML = `<div class="retro ${nose ? 'nose' : acierto ? 'bien' : 'malo'}"><b>${titulo}</b>${detalle ? `<p>${esc(detalle)}</p>` : ''}</div>`;
      // La figura deja de ser un control: pasa a ser la imagen de la solución.
      if (arrastra) {
        ['role', 'tabindex', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext', 'aria-describedby'].forEach(k => lienzo.removeAttribute(k));
        lienzo.setAttribute('role', 'img'); lienzo.setAttribute('aria-label', alt);
      }
      // «Otro problema» ocupa el lugar de «Comprobar»; «No sé» queda oculto sin soltar su lugar.
      const nuevo = '<button type="button" class="btn morado" id="otro">Otro problema</button>';
      const viejo = $('#comprobar') || $('#reserva');
      viejo.outerHTML = nuevo;
      if ($('#nose')) { $('#nose').classList.add('oculto'); $('#nose').disabled = true; }
      const otro = $('#otro');
      otro.onclick = () => { if (!otro.disabled) { otro.disabled = true; practica(); } };
      // La solución: línea de tiempo sobre la misma figura, empezando por el resultado (el final se entiende solo).
      if (tienePasos) {
        Kit.lineaTiempo.montar(control, {
          pieza, datos, pasos: p.pasos, figura: lienzo, pie, base: { fantasma }, inicio: p.pasos.length,
          textoPaso: q => `<span>${texto(lista(q.texto), p, esc)}</span>${q.ecuacion ? `<span class="kit-ec">${texto(lista(q.ecuacion), p, esc)}</span>` : ''}`,
        });
      } else {
        control.innerHTML = '';
        lienzo.innerHTML = pintado({ corte: 0, fantasma });
        $('#extra').innerHTML = `<h3 class="sol-t">Solución paso a paso</h3><ol class="sol">${p.solucion.map(q => `<li>${texto(q, p, esc)}</li>`).join('')}</ol>`;
      }
      $('#extra').insertAdjacentHTML('beforeend', figuraHTML(p.figuraSolucion, esc) + convencionesHTML(p.convenciones));
      if (teniaFoco) otro.focus({ preventScroll: true });
      // Que la retroalimentación quede a la vista (sobre la barra de navegación) sin mover nada de lo que ya estaba:
      // se desplaza la página, no el contenido, y la figura sigue a la vista.
      const fila = $app.querySelector('.retro-fila').getBoundingClientRect();
      const nav = document.getElementById('nav'), tope = nav && !nav.hidden ? nav.getBoundingClientRect().top - 12 : innerHeight - 12;
      const falta = Math.min(fila.bottom - tope, lienzo.getBoundingClientRect().top - 8);
      if (falta > 0) scrollBy({ top: falta, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  function resultado() {
    const e = st.entrada, s = st.salida;
    $app.innerHTML = cabecera('Resultados') + `<div class="card resultado" style="margin-top:16px">
      ${window.Ilus ? Ilus.taza('class="resultado-taza"') : ''}
      <div class="stats" style="grid-template-columns:1fr 1fr">
        <div class="stat"><div class="l">Prueba de entrada</div><div class="n">${e ? `${e.aciertos}/${e.total}` : '—'}</div></div>
        <div class="stat"><div class="l">Prueba final</div><div class="n">${s ? `${s.aciertos}/${s.total}` : '—'}</div></div>
      </div>
      <p class="sub" style="margin-top:12px">Practicaste ${st.hechos} problemas y acertaste ${st.aciertos} predicciones.</p>
      <button class="btn morado ancho" id="seguir" style="margin-top:8px">Seguir practicando</button></div>`;
    document.getElementById('seguir').onclick = practica;
    pose('hito');
  }

  if (!st.entrada) prueba('entrada');
  else if (st.salida) resultado();
  else practica();
}

// Teclado (laboratorio de cómputo): A–E o 1–5 eligen una alternativa; 0 o N, «No sé»; Enter pasa al siguiente.
// Un solo oyente para toda la app; solo actúa en la ruta de práctica.
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#/practica') || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const k = e.key.toUpperCase();
  const letra = /^[A-E]$/.test(k) ? k : /^[1-5]$/.test(k) ? 'ABCDE'[+k - 1] : null;
  const nose = k === '0' || k === 'N';
  if (letra || nose) {
    const b = document.querySelector(nose ? '.alt.nose:not(:disabled)' : `.alt[data-letra="${letra}"]:not(:disabled)`);
    if (b) { e.preventDefault(); b.click(); }
    return;
  }
  // Enter sobre un botón enfocado ya lo activa el navegador: no repetir.
  if (e.key === 'Enter' && !(e.target.closest && e.target.closest('button, a'))) {
    const b = document.getElementById('otro') || document.getElementById('seguir');
    if (b) { e.preventDefault(); b.click(); }
  }
});

window.Practica = { vista };
})();
