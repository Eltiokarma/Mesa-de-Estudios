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
 *   cv.width = W*Celular.dpr()                 // densidad del lienzo: hasta 1,5 en el celular y 2 en pantalla grande
 *   const css = Celular.variable               // variable CSS de <html>, guardada hasta que cambie el tema o el tamaño
 *   const b = Celular.bucle(cv, (dt, now) => { ...; return sigue })   // rAF que se duerme; b.despertar()
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

  // Densidad del lienzo (la2): en el celular, más de 1,5 píxeles reales por píxel CSS no se nota y cuesta ráster;
  // en pantalla grande, hasta 2. o = { ancho, dpr } permite probarla sin navegador.
  function dpr(o) {
    const d = (o && o.dpr) || (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1;
    return Math.min(d, chico(o && o.ancho) ? 1.5 : 2);
  }

  // Variables CSS de <html> (colores y letras del tema). getComputedStyle en cada cuadro es caro en gama baja: se leen
  // una vez y se guardan hasta que cambie el tema (prefers-color-scheme, atributos de <html>) o el tamaño de la ventana.
  let claveTema = null, estilo = null, guardadas = {};
  const mqOscuro = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
  function clave() {
    const h = document.documentElement;
    return `${mqOscuro && mqOscuro.matches}|${h.className}|${h.getAttribute('data-theme')}|${h.getAttribute('style')}|${innerWidth}x${innerHeight}`;
  }
  function variable(n) {
    const k = clave();
    if (k !== claveTema) { claveTema = k; estilo = getComputedStyle(document.documentElement); guardadas = {}; }
    const v = guardadas[n];
    return v !== undefined ? v : (guardadas[n] = estilo.getPropertyValue(n).trim());
  }

  // Bucle de animación que se duerme (la2). paso(dt, now) corre en cada cuadro mientras el lienzo está a la vista
  // (pestaña visible, lienzo mostrado y en pantalla) y devuelve true si algo se sigue moviendo. Si devuelve false,
  // el bucle se detiene hasta b.despertar(); si el lienzo sale de la vista, se detiene y vuelve solo al regresar.
  // dt en segundos, sin recortar (cada escena pone su tope); tras dormir, el primer dt es de un cuadro (1/60 s).
  // Un despertar() durante paso (por ejemplo, un config que la misma animación dispara) pide un cuadro más.
  // ¿El lienzo se ve? Pestaña visible, lienzo mostrado (su modo no está escondido) y dentro de la pantalla.
  // alVolver() se llama cuando puede haber vuelto a la vista (para reanudar un bucle detenido).
  function aLaVista(cv, alVolver) {
    let enPantalla = true;
    const ve = () => enPantalla && !document.hidden && cv.offsetParent !== null;
    const avisar = () => { if (alVolver && ve()) alVolver(); };
    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver(es => { enPantalla = es[es.length - 1].isIntersecting; avisar(); }).observe(cv);
    }
    document.addEventListener('visibilitychange', avisar);
    addEventListener('resize', avisar);   // un cambio de modo también lo avisa el observador
    return ve;
  }

  function bucle(cv, paso) {
    let raf = 0, ultimo = 0, dormido = false, enPaso = false, pedido = false;
    const cuadro = now => {
      raf = 0;
      if (!ve()) return;
      const dt = ultimo ? (now - ultimo) / 1000 : 1 / 60; ultimo = now;
      enPaso = true; pedido = false;
      let sigue;
      try { sigue = paso(dt, now); } finally { enPaso = false; }
      if (sigue || pedido) raf = requestAnimationFrame(cuadro); else dormido = true;
    };
    const despertar = () => {
      dormido = false;
      if (enPaso) { pedido = true; return; }
      if (!raf && ve()) { ultimo = 0; raf = requestAnimationFrame(cuadro); }
    };
    const ve = aLaVista(cv, () => { if (!dormido) despertar(); });
    // Red de seguridad: un toque, una tecla o un control que cambia despiertan el bucle (un cuadro basta si nada se mueve).
    for (const ev of ['pointerdown', 'click', 'input', 'change', 'keydown']) document.addEventListener(ev, despertar, { capture: true, passive: true });
    despertar();
    return { despertar, activo: () => !!raf };
  }

  return { ANCHO, ESPERA, ALTO_COMPACTO, RADIO_DEDO, RADIO_RATON, CSS, chico, alto, compactar, alResponder, arrastre, movimientoReducido, dpr, variable, bucle, aLaVista };
});
