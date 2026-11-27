/*
 * Apertura de la unidad (docs/metodo/apertura-pisa.md): la introducción con un choque entre lo que se predice y lo que
 * se mide, en la portada de la unidad (#/unidad/<id>). Contrato con app/app.js:
 *   window.Apertura.pintar(hueco, def, { abierta })   hueco: el elemento donde va; def: el archivo de la unidad
 * El archivo de la unidad (contenido/aperturas/<curso>/<unidad>.js) se registra en window.Aperturas[unidad].
 * Los párrafos y la ecuación son partes de nucleo/ecuacion.js (texto o fichas de color de la unidad). La figura es un
 * SVG de dos paneles; su texto alternativo cuenta el choque. La ficha es para Gerson: aquí no se muestra.
 *
 * En celular, la primera visita la muestra entera; después queda plegada en el título y «Leer la introducción»
 * (app.js decide `abierta` con est.aperturas). Desde 900 px siempre va abierta y el título no pliega.
 */
(function () {
  'use strict';
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const partes = x => (typeof x === 'string' ? esc(x) : window.Ecuacion.html(x));
  // La ecuación puede ser una línea (lista de partes) o varias (lista de listas).
  const lineas = ec => (Array.isArray(ec) && ec.length && Array.isArray(ec[0]) ? ec : [ec]);
  const ancho = () => !!(window.matchMedia && matchMedia('(min-width:900px)').matches);

  function html(def) {
    const f = def.figura || null, antesFig = f ? f.antes : -1;
    const antesEc = def.ecuacion ? (def.ecuacionAntes !== undefined ? def.ecuacionAntes : antesFig) : -1;
    const fig = f ? `<figure class="ap-fig"><div class="ap-svg" role="img" aria-label="${esc(f.alt || '')}">${f.svg}</div>${f.pie ? `<figcaption>${partes(f.pie)}</figcaption>` : ''}</figure>` : '';
    const ec = def.ecuacion ? `<div class="ap-ec te-ec">${lineas(def.ecuacion).map(l => `<p>${window.Ecuacion.html(l)}</p>`).join('')}</div>` : '';
    let cuerpo = '';
    def.parrafos.forEach((p, i) => {
      cuerpo += `<p>${partes(p)}</p>`;
      if (i + 1 === antesEc) cuerpo += ec;
      if (i + 1 === antesFig) cuerpo += fig;
    });
    return `<summary><span class="ap-et">Introducción</span><h2 class="ap-titulo">${esc(def.titulo)}</h2>
        <span class="ap-abrir" aria-hidden="true"><span class="ap-leer">Leer la introducción</span><span class="ap-cerrar">Plegar</span></span></summary>
      <div class="ap-cuerpo">${cuerpo}
        <aside class="ap-pregunta"><p class="ap-preg-et">Antes de seguir</p><p>${partes(def.pregunta)}</p></aside></div>`;
  }

  function pintar(hueco, def, o = {}) {
    const d = document.createElement('details');
    d.className = 'apertura';
    d.innerHTML = html(def);
    d.open = !!o.abierta || ancho();
    // En pantalla ancha la apertura no se pliega: el título no es un botón.
    d.querySelector('summary').addEventListener('click', e => { if (ancho()) e.preventDefault(); });
    hueco.replaceWith(d);
    return d;
  }

  window.Apertura = { pintar, html };
})();
