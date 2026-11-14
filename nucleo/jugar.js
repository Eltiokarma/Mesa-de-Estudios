/*
 * Jugar antes de preguntar (regla 3 de CLAUDE.md, decisión 20 de Gerson, 14 nov 2026): antes de cualquier
 * pregunta, también de una predicción, el alumno juega con la simulación.
 *
 *   const juego = JugarPrimero.montar({
 *     escena: document.querySelector('.figura'),   // dónde se juega: cuenta toques, arrastres, deslizadores y teclas
 *     preguntas: [document.querySelector('.pred')],// lo que se pregunta: queda inerte (sin foco ni toques) y velado
 *     consigna: 'Juega con la lente: muévela y mira la imagen.',
 *     minimo: 2,                                   // interacciones antes de que aparezca «Ya jugué: seguir»
 *     alListo: () => { … },                        // opcional: al pulsar «Ya jugué: seguir»
 *   });
 *   juego.listo  → Promise que se resuelve al pulsar «Ya jugué: seguir»
 *   juego.saltar() → lo da por jugado (por ejemplo, al volver a una escena ya hecha)
 *
 * La barra con la consigna y el botón va arriba de las preguntas; su alto se reserva desde el principio (nada
 * salta). El botón no se deshabilita: aparece cuando ya jugó (antes, la barra dice cuánto falta). Con lector de
 * pantalla, la barra es una región de estado. Sin DOM (Node), solo se prueba la cuenta (contar).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JugarPrimero = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EVENTOS = ['pointerdown', 'input', 'change', 'keydown'];
  const TECLAS = /^(Arrow|Page|Home|End| |Enter)/;

  // ¿Este evento cuenta como jugar? Un toque, un deslizador, un cambio o una tecla que mueve algo.
  function cuenta(ev) {
    if (!ev || !ev.type) return false;
    if (ev.type === 'keydown') return TECLAS.test(ev.key || '') && !ev.repeat;
    return EVENTOS.includes(ev.type);
  }

  function montar(o) {
    const minimo = Math.max(1, o.minimo || 1);
    const preguntas = (o.preguntas || []).filter(Boolean);
    let hechas = 0, terminado = false, resolver;
    const listo = new Promise(r => { resolver = r; });
    const doc = (o.escena && o.escena.ownerDocument) || (typeof document !== 'undefined' ? document : null);
    if (!doc) return { listo, saltar: () => resolver(), hechas: () => hechas };

    // Las preguntas quedan veladas e inertes hasta que juegue.
    const velar = on => preguntas.forEach(p => {
      if (on) { p.setAttribute('inert', ''); p.classList.add('jugar-velado'); }
      else { p.removeAttribute('inert'); p.classList.remove('jugar-velado'); }
    });
    velar(true);

    const barra = doc.createElement('div');
    barra.className = 'jugar-barra'; barra.setAttribute('role', 'status');
    barra.innerHTML = '<p class="jugar-consigna"></p><button type="button" class="jugar-seguir" hidden>Ya jugué: seguir</button>';
    barra.querySelector('.jugar-consigna').textContent = o.consigna || 'Primero juega con la escena.';
    const ancla = preguntas[0] || o.escena;
    if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(barra, ancla); else doc.body.prepend(barra);
    const boton = barra.querySelector('.jugar-seguir');

    const alJugar = ev => {
      if (terminado || !cuenta(ev) || barra.contains(ev.target)) return;
      hechas++;
      if (hechas >= minimo) boton.hidden = false;
    };
    const zonas = [o.escena].filter(Boolean);
    zonas.forEach(z => EVENTOS.forEach(t => z.addEventListener(t, alJugar, true)));

    function terminar() {
      if (terminado) return; terminado = true;
      zonas.forEach(z => EVENTOS.forEach(t => z.removeEventListener(t, alJugar, true)));
      velar(false); barra.remove();
      if (o.alListo) o.alListo();
      resolver();
    }
    boton.addEventListener('click', terminar);
    return { listo, saltar: terminar, hechas: () => hechas };
  }

  // Estilos mínimos, inyectados una vez (las escenas no comparten hoja de estilos de la cáscara).
  if (typeof document !== 'undefined' && !document.getElementById('jugar-estilos')) {
    const st = document.createElement('style'); st.id = 'jugar-estilos';
    st.textContent = '.jugar-barra{display:flex;align-items:center;gap:12px;flex-wrap:wrap;min-height:56px;margin:8px 0;padding:8px 12px;border-radius:12px;border:2px dashed currentColor}'
      + '.jugar-consigna{margin:0;flex:1 1 200px;font-weight:700}'
      + '.jugar-seguir{min-height:44px;padding:8px 14px;border-radius:12px;font:inherit;font-weight:700;cursor:pointer}'
      + '.jugar-velado{opacity:.35;filter:grayscale(1)}'
      + '@media (prefers-reduced-motion:no-preference){.jugar-velado{transition:opacity .2s linear}}';
    document.head.appendChild(st);
  }

  return { montar, cuenta };
});
