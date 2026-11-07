/*
 * Arreglo común del celular para las escenas (pl6). Lo que cada escena repetía a mano y las revisiones
 * volvían a encontrar:
 *   1. Con una predicción pendiente, el dibujo queda pegado arriba y más bajo (clase .pendiente en .mode).
 *   2. Al responder, el lienzo sube a la vista y la animación arranca ~380 ms después (si el alumno
 *      no cambió de paso o de escena mientras tanto).
 *   3. El dedo desplaza la página sobre el dibujo (touch-action: pan-y pinch-zoom); solo un toque que
 *      empieza cerca de lo arrastrable (radio ~40 px; ratón ~32 px) se queda con el gesto.
 * Uso en una escena:
 *   <script src="../../nucleo/celular.js"></script>
 *   Celular.compactar(modoEl, true)            // .mode con predicción pendiente
 *   h = Celular.alto(h, compacto, { tope })    // altura del lienzo: tope de 240 px (o tope) si compacto y celular
 *   Celular.alResponder(lienzo, () => animar(), () => S.step === paso)
 *   Celular.arrastre(canvas, { cerca(p, r), activo(), empezar(p, e), mover(p, e), soltar(), sobre(bool) })
 * Funciona en el navegador (window.Celular) y en Node (require), donde solo sirven las partes sin DOM.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Celular = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ANCHO = 900;      // desde aquí, pantalla grande (grilla de dos columnas)
  const ESPERA = 380;     // ms entre subir el lienzo y animar
  const ALTO_COMPACTO = 240;
  const RADIO_DEDO = 40, RADIO_RATON = 32;

  const ancho = () => (typeof innerWidth === 'number' ? innerWidth : Infinity);
  const chico = w => (w === undefined ? ancho() : w) < ANCHO;
  const movimientoReducido = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Altura del lienzo: con una predicción pendiente en el celular, no más de 240 px (o del tope que pida la escena,
  // si su dibujo no se lee tan bajo). o = { tope, ancho }.
  const alto = (h, compacto, o) => (compacto && chico(o && o.ancho) ? Math.min(h, (o && o.tope) || ALTO_COMPACTO) : h);

  const CSS = `@media (max-width:${ANCHO - 1}px){
  .mode.pendiente .bench{position:sticky; top:0; z-index:1; padding:6px; gap:4px; background:var(--card); border-radius:0 0 20px 20px}
  .mode.pendiente .legend{display:none}
}`;
  function ponerCSS() {
    if (typeof document === 'undefined' || document.getElementById('nucleo-celular')) return;
    const s = document.createElement('style'); s.id = 'nucleo-celular'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  // Marca el .mode (o el elemento dado) como "con predicción pendiente".
  function compactar(modo, on) {
    ponerCSS();
    if (modo && modo.classList) modo.classList.toggle('pendiente', !!on);
    return !!on;
  }

  // Al responder: en el celular sube el lienzo y espera; después llama a seguir() si vigente() sigue siendo cierto.
  // espera(ms, fn) permite cambiar el reloj (pruebas); por defecto, setTimeout.
  function alResponder(lienzo, seguir, vigente, o) {
    o = o || {};
    const c = chico(o.ancho), esperar = o.espera || ((ms, fn) => setTimeout(fn, ms));
    if (c && lienzo && lienzo.scrollIntoView) lienzo.scrollIntoView({ block: 'start', behavior: movimientoReducido() ? 'auto' : 'smooth' });
    const fin = () => { if (!vigente || vigente()) seguir(); else if (o.siNo) o.siNo(); };
    if (c) esperar(ESPERA, fin); else fin();
    return c;
  }

  // Arrastre con dedo y ratón sin robarle el desplazamiento a la página.
  function arrastre(cv, o) {
    cv.style.touchAction = 'pan-y pinch-zoom';
    const activo = () => (o.activo ? o.activo() : true);
    const local = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    let arrastrando = false, sobre = false;
    cv.addEventListener('touchstart', e => {
      if (!activo() || e.touches.length !== 1) return;
      if (o.cerca(local(e.touches[0]), RADIO_DEDO)) e.preventDefault();
    }, { passive: false });
    cv.addEventListener('pointerdown', e => {
      if (!activo()) return;
      const p = local(e);
      if (!o.cerca(p, e.pointerType === 'mouse' ? RADIO_RATON : RADIO_DEDO)) return;
      arrastrando = true; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); e.preventDefault();
      cv.focus && cv.focus({ preventScroll: true });
      if (o.empezar) o.empezar(p, e);
    }, { passive: false });
    cv.addEventListener('pointermove', e => {
      const p = local(e);
      if (arrastrando) { if (o.mover) o.mover(p, e); return; }
      const s = activo() && o.cerca(p, RADIO_RATON);
      if (s !== sobre) { sobre = s; cv.style.cursor = s ? 'grab' : ''; if (o.sobre) o.sobre(s); }
    });
    const soltar = () => { if (arrastrando) { arrastrando = false; if (o.soltar) o.soltar(); } };
    cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
    return { arrastrando: () => arrastrando };
  }

  return { ANCHO, ESPERA, ALTO_COMPACTO, RADIO_DEDO, RADIO_RATON, CSS, chico, alto, compactar, alResponder, arrastre, movimientoReducido };
});
