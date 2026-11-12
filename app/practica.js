// Pantalla de práctica para módulos del formato "predicciones" (docs/arquitectura.md).
// Flujo: prueba de entrada (3 preguntas iguales para todos, sin corrección) → práctica con
// predicción, explicación del error elegido y solución → prueba de salida (3 preguntas paralelas).
// Todo se registra de forma anónima con ctx.registrar (ver nucleo/medicion.js).
(function () {
'use strict';
const N_PRUEBA = 3, MIN_PRACTICA = 5;
// Un mimo distinto en cada acierto (dirección acogedora, docs/diseno.md).
const PREMIOS = ['Te ganaste un bombón. 🍫', 'Así se piensa. ✨', 'El gato está orgulloso. 🐾', 'Una más para la racha. ☕', 'Predijiste antes de calcular: eso es entender. 💜'];

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
  try { gen = await cargarGenerador(pl); } catch (e) { $app.innerHTML = `<p class="vacio">${esc(e.message)}</p>`; return; }
  est.practica = est.practica || {};
  // Con valores por defecto: «Borrar mi avance» deja solo { entrada, salida } y sin esto hechos quedaba en NaN.
  const st = est.practica[id] = Object.assign({ hechos: 0, aciertos: 0, entrada: null, salida: null }, est.practica[id] || {});
  const volver = `<a class="volver" href="#/curso/${esc(curso ? curso.id : '')}" aria-label="Volver">‹</a>`;
  const cabecera = sub => `${volver}<p class="sub">${esc(curso ? curso.nombre : '')}</p><h1>${esc(pl.titulo)}</h1><p class="sub">${sub}</p>`;

  function problemaHTML(p, n, total, etiqueta) {
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
      <div id="retro"></div>
    </article>`;
  }

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
  function practica() {
    const n = st.hechos + 1;
    const p = gen.generar(`${est.alumno}-${n}`);
    const t0 = Date.now();
    const listaSalida = st.hechos >= MIN_PRACTICA && !st.salida;
    $app.innerHTML = cabecera(`Problema ${n} · aciertos ${st.aciertos} de ${st.hechos}`) +
      (listaSalida ? `<div class="aviso">Ya practicaste ${st.hechos} problemas. <a href="#" id="irSalida"><b>Haz la prueba final</b></a> cuando quieras.</div>` : '') +
      problemaHTML(p, 0, 0, 'Predice antes de ver la solución');
    const ir = document.getElementById('irSalida'); if (ir) ir.onclick = e => { e.preventDefault(); prueba('salida'); };
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
      st.hechos++; if (a && a.correcta) st.aciertos++; if (nose) st.nose = (st.nose || 0) + 1; guardar(); marcarDia();
      est.vistas[unidad] = est.vistas[unidad] || new Date().toLocaleDateString('en-CA'); guardar();
      registrar(nose
        ? { tipo: 'prediccion', modulo: id, unidad, problema: p.id, opcion: '', correcta: false, error: '', respaldo: '', nose: true, ms: Date.now() - t0 }
        : { tipo: 'prediccion', modulo: id, unidad, problema: p.id, opcion: a.letra, correcta: a.correcta,
          error: a.error ? a.error.id : '', respaldo: a.error ? a.error.respaldo : '', ms: Date.now() - t0 });
      document.getElementById('retro').innerHTML = `
        <div class="retro ${nose ? 'nose' : a.correcta ? 'bien' : 'malo'}">
          ${a && a.correcta && window.Ilus ? Ilus.gato('class="retro-gato"') : ''}
          <b>${nose ? `Gracias por decirlo. La respuesta es la ${correcta.letra}: ${esc(correcta.texto)}.`
            : a.correcta ? `¡Bien! Es la ${correcta.letra}. ${PREMIOS[st.hechos % PREMIOS.length]}` : `Elegiste la ${a.letra}. La correcta es la ${correcta.letra}: ${esc(correcta.texto)}.`}</b>
          ${nose ? '<p>Mira la solución paso a paso y prueba con el siguiente.</p>' : a.correcta ? '' : `<p>${esc(a.error.explicacion)}</p>`}
        </div>
        <h3 class="sol-t">Solución paso a paso</h3>
        <ol class="sol">${p.solucion.map(paso => `<li>${texto(paso, p, esc)}</li>`).join('')}</ol>
        ${figuraHTML(p.figuraSolucion, esc)}
        ${convencionesHTML(p.convenciones)}
        <button class="btn morado ancho" id="otro">Otro problema</button>`;
      document.getElementById('otro').onclick = practica;
      document.getElementById('retro').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
