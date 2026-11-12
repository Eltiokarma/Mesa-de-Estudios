/*
 * Tarjeta «Convención del examen» (decisión de Gerson, 12 nov 2026; docs/diseno.md, «Convención del examen»).
 * Algunas respuestas del examen de admisión siguen una convención de academia que la química universitaria
 * matiza. La app las enseña como se responden en el examen, pero lo dice en grande: una tarjeta visible,
 * nunca una letra chica, con «Así se responde en el examen» y «En la universidad verás que…».
 *
 * Uso en una escena:   <script src="../../nucleo/convencion.js"></script>
 *                      el.insertAdjacentHTML('beforeend', Convencion.html('hibridacion'));
 * Uso en la práctica:  el generador pone en el problema convenciones: ['dativos'] y app/practica.js pinta
 *                      una tarjeta por id debajo de la solución.
 * El estilo se inyecta una sola vez (Convencion.estilos(), lo llama html()); funciona en claro y en oscuro con
 * prefers-color-scheme y con <html data-theme>. En Node solo sirven LISTA, ids y html (para las pruebas).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Convencion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Textos para el alumno: español claro y neutro. Cada uno, breve y correcto.
  const LISTA = {
    hibridacion: {
      titulo: 'Hibridación escolar',
      examen: 'La hibridación se cuenta por los enlaces y pares del átomo: con solo enlaces simples, sp³; con un doble, sp²; con un triple o dos dobles, sp. El N de una amida se cuenta sp³, por sus tres enlaces y su par libre.',
      universidad: 'la hibridación es un modelo para explicar la forma, no algo que se mide. En una amida, el par libre del N se reparte con el C=O (resonancia): el N queda casi plano y se describe mejor como sp². Lo mismo pasa con otros átomos que ponen su par en un doble enlace vecino.',
    },
    'azufre-expandido': {
      titulo: 'El S con S=O y 10 electrones',
      examen: 'El S de la alicina y de los sulfóxidos se escribe con un doble enlace S=O: el S queda rodeado de 10 electrones, un octeto expandido.',
      universidad: 'los cálculos muestran que el S casi no usa orbitales d y que ese enlace se describe mejor como S⁺–O⁻, con el S en su octeto y cargas formales. S=O y S⁺–O⁻ son dos formas de escribir la misma molécula; la de cargas es la que respalda la química cuántica.',
    },
    dativos: {
      titulo: 'Lewis con dativos en los oxoaniones',
      examen: 'En los oxoaniones (ClO₃⁻, ClO₄⁻, SO₄²⁻, NO₃⁻…) la estructura se escribe con el octeto del átomo central: un enlace común con el O⁻ y enlaces dativos hacia los demás O, en los que el átomo central pone los dos electrones.',
      universidad: 'un enlace dativo, una vez formado, es igual a cualquier enlace covalente: «dativo» solo cuenta de dónde salieron los electrones. Muchos libros dibujan esos enlaces como dobles (Cl=O) para bajar las cargas formales; la molécula real es un híbrido de resonancia y sus enlaces Cl–O son todos iguales.',
    },
    'etapa-lenta': {
      titulo: 'La etapa lenta, leída desde el valle',
      examen: 'La etapa lenta es la de mayor energía de activación, y cada Ea se mide desde el valle donde empieza su etapa: Ea₂ = cima 2 − valle.',
      universidad: 'lo que decide la rapidez es la distancia entre la cima más alta y el punto más bajo que la reacción visita antes de ella. Si el valle queda por debajo de los reactivos, eso coincide con la regla del examen; si el valle queda por encima, manda la cima más alta medida desde los reactivos.',
    },
  };
  const ids = Object.keys(LISTA);

  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Claro: crema con contorno ciruela y base ámbar. Oscuro: ámbar oscuro con texto crema. Contraste ≥ 7:1 en los dos.
  const CSS = `
.convencion{--cv-fondo:#fff4cc;--cv-tinta:#2d2340;--cv-suave:#5b4a1f;--cv-borde:#2d2340;--cv-base:#e0a21b;--cv-sello:#2d2340;--cv-sello-tinta:#fff4cc;--cv-uni:#fffaf0;
  margin:16px 0;padding:16px 18px 18px;background:var(--cv-fondo);color:var(--cv-tinta);border:2px solid var(--cv-borde);border-radius:22px;
  box-shadow:0 6px 0 var(--cv-base);font-size:1.02rem;line-height:1.5;text-align:left;container:convencion/inline-size}
.convencion .cv-sello{display:inline-flex;align-items:center;gap:8px;background:var(--cv-sello);color:var(--cv-sello-tinta);border-radius:999px;
  padding:5px 14px;font-weight:850;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase}
.convencion .cv-titulo{margin:10px 0 6px;font-size:1.3rem;font-weight:850;letter-spacing:-.01em;line-height:1.25;color:var(--cv-tinta)}
.convencion .cv-cols{display:grid;gap:12px;margin-top:8px}
@container convencion (min-width:600px){.convencion .cv-cols{grid-template-columns:1fr 1fr}}
.convencion .cv-col{margin:0}
.convencion .cv-col b{display:block;font-size:.95rem;font-weight:850;margin-bottom:2px}
.convencion .cv-uni{background:var(--cv-uni);border:2px dashed var(--cv-borde);border-radius:16px;padding:10px 12px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .convencion{--cv-fondo:#3b2e0c;--cv-tinta:#fff1cf;--cv-suave:#f1dca6;--cv-borde:#0f0a15;--cv-base:#8a6410;--cv-sello:#ffd166;--cv-sello-tinta:#2d2340;--cv-uni:#2a2135}}
:root[data-theme="dark"] .convencion{--cv-fondo:#3b2e0c;--cv-tinta:#fff1cf;--cv-suave:#f1dca6;--cv-borde:#0f0a15;--cv-base:#8a6410;--cv-sello:#ffd166;--cv-sello-tinta:#2d2340;--cv-uni:#2a2135}
@media print{.convencion{box-shadow:none}}`;

  function estilos(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc || doc.getElementById('convencion-css')) return;
    const s = doc.createElement('style'); s.id = 'convencion-css'; s.textContent = CSS;
    (doc.head || doc.documentElement).appendChild(s);
  }

  // Devuelve el HTML de la tarjeta (un <aside role="note">). Un id desconocido lanza un error: así no se
  // publica una escena con una nota vacía.
  function html(id) {
    const c = LISTA[id];
    if (!c) throw new Error(`Convencion: no existe la convención «${id}»`);
    estilos();
    return `<aside class="convencion" role="note" aria-label="Convención del examen: ${esc(c.titulo)}" data-convencion="${esc(id)}">
  <span class="cv-sello"><span aria-hidden="true">📌</span> Convención del examen</span>
  <p class="cv-titulo">${esc(c.titulo)}</p>
  <div class="cv-cols">
    <p class="cv-col"><b>Así se responde en el examen de admisión.</b>${esc(c.examen)}</p>
    <p class="cv-col cv-uni"><b>En la universidad verás que…</b>${esc(c.universidad.charAt(0).toUpperCase() + c.universidad.slice(1))}</p>
  </div>
</aside>`;
  }

  return { LISTA, ids, html, estilos, CSS };
});
