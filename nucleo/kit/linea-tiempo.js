/*
 * Línea de tiempo de la solución (docs/escena-viva.md, regla 5): la solución no es una lista, es una
 * secuencia de estados de la figura que el alumno recorre con un cursor (o con ▶, que avanza paso a paso,
 * se queda quieto en cada uno el tiempo de leerlo y para al final). La misma para todas las piezas.
 *
 *   Kit.lineaTiempo.estado(pasos, i, base) → el estado del paso i (1..n): base + pasos[i−1].estado.
 *   Kit.lineaTiempo.montar(raiz, { pieza, datos, pasos, figura, pie, base, inicio, textoPaso, alCambiar })
 *     raiz: donde van los controles (▶/pausa, cursor accesible, «2/3»).
 *     figura: el elemento que recibe el SVG de pieza.dibujar(datos, estado) en cada paso.
 *     pie: el elemento del texto del paso (región viva: el lector de pantalla lo anuncia sin mover el foco).
 *     textoPaso(paso, i, n) → HTML del pie (por defecto, el texto escapado).
 *     Devuelve { ir(i, animar), actual(), reproducir(), pausar(), destruir() }.
 * Ir atrás y adelante da el mismo dibujo: la pieza es una función pura del estado. Solo al avanzar un paso
 * se marca la figura con .kit-anima, y kit.css anima lo nuevo (sin traslados con prefers-reduced-motion).
 * Funciona en el navegador (window.Kit.lineaTiempo); en Node solo sirve estado() (para las pruebas).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('./kit.js') : (root.Kit = root.Kit || {});
  const api = fabrica(Kit);
  Kit.lineaTiempo = api;
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const ANIMACION = 900;   // token «paso»
  const LECTURA = 2600;    // pausa estable para leer un paso de ≤ 14 palabras antes de seguir
  const ICONO = {
    play: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    otra: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function estado(pasos, i, base) {
    const k = Math.max(1, Math.min(pasos.length, i));
    return Object.assign({}, base || {}, (pasos[k - 1] || {}).estado || {});
  }

  function montar(raiz, o) {
    const { pieza, datos, pasos, figura, pie } = o;
    const n = pasos.length;
    const textoPaso = o.textoPaso || (p => esc(Kit.plano(p.texto)));
    raiz.innerHTML = `<div class="kit-tiempo" role="group" aria-label="Solución paso a paso">
      <button type="button" class="kit-play" aria-label="Reproducir los pasos">${ICONO.play}</button>
      <div class="kit-pista">
        <input class="kit-cursor" type="range" min="1" max="${n}" step="1" value="1" aria-label="Paso de la solución">
        <div class="kit-puntos" aria-hidden="true">${pasos.map(() => '<i></i>').join('')}</div>
      </div>
      <span class="kit-cuenta" aria-hidden="true"></span>
    </div>`;
    const play = raiz.querySelector('.kit-play'), cursor = raiz.querySelector('.kit-cursor');
    const cuenta = raiz.querySelector('.kit-cuenta'), puntos = raiz.querySelectorAll('.kit-puntos i');
    let actual = 0, reloj = null, jugando = false;

    function pintarBoton() {
      const fin = actual >= n;
      play.innerHTML = jugando ? ICONO.pausa : fin ? ICONO.otra : ICONO.play;
      play.setAttribute('aria-label', jugando ? 'Pausar' : fin ? 'Ver los pasos desde el inicio' : 'Reproducir los pasos');
    }
    function ir(i, animar) {
      i = Math.max(1, Math.min(n, i));
      const adelante = animar && i === actual + 1;
      actual = i;
      figura.classList.toggle('kit-anima', !!adelante);
      figura.innerHTML = pieza.dibujar(datos, estado(pasos, i, o.base));
      if (pie) pie.innerHTML = textoPaso(pasos[i - 1], i, n);
      cursor.value = String(i);
      cursor.setAttribute('aria-valuetext', `Paso ${i} de ${n}: ${Kit.plano(pasos[i - 1].texto)}`);
      cuenta.textContent = `${i}/${n}`;
      puntos.forEach((p, k) => p.classList.toggle('on', k < i));
      pintarBoton();
      if (o.alCambiar) o.alCambiar(i);
    }
    function pausar() { jugando = false; clearTimeout(reloj); reloj = null; pintarBoton(); }
    function seguir() {
      if (!jugando) return;
      if (actual >= n) return pausar();
      ir(actual + 1, true);
      reloj = setTimeout(seguir, ANIMACION + LECTURA);
    }
    function reproducir() {
      jugando = true;
      if (actual >= n) { actual = 0; }       // desde el inicio: el paso 1 se anima como nuevo
      seguir();
    }
    play.addEventListener('click', () => (jugando ? pausar() : reproducir()));
    cursor.addEventListener('input', () => { pausar(); ir(+cursor.value, +cursor.value === actual + 1); });
    // ← → también desde el botón ▶ (en el cursor ya los maneja el navegador).
    raiz.addEventListener('keydown', e => {
      if (e.target === cursor || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); pausar();
        ir(actual + (e.key === 'ArrowRight' ? 1 : -1), e.key === 'ArrowRight');
      }
    });
    ir(o.inicio || n, false);
    return { ir, actual: () => actual, reproducir, pausar, destruir: () => { pausar(); raiz.innerHTML = ''; } };
  }

  return { estado, montar, ANIMACION, LECTURA };
});
