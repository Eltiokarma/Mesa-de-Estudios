/*
 * Ecuaciones con el hilo de color (regla 4), en HTML: la teoría y cualquier pantalla que necesite una fórmula
 * con fracciones, potencias o raíces sin traer una biblioteca de matemática.
 *
 *   Ecuacion.html(partes) → HTML
 *   Ecuacion.texto(partes) → texto plano (para lectores de pantalla, el alt y el conteo de palabras)
 *
 * Una ecuación es una lista de partes. Cada parte es:
 *   'texto'                         tal cual (operadores, números con su unidad: ' = ', ' m/s')
 *   { v: 'c-o', t: 'v' }            una variable con su color (c-o, c-i, c-h, c-d o c-f), igual que nucleo/predicciones.js
 *   { frac: [num, den] }            fracción; num y den son a su vez listas de partes (o un texto)
 *   { sup: [base, exp] }            potencia: base^exp
 *   { sub: [base, ind] }            subíndice: v₀ se escribe { sub: [{ v: 'c-o', t: 'v' }, '0'] }
 *   { raiz: radicando, indice? }    raíz cuadrada (o de índice dado)
 *   { vec: partes }                 flecha encima (vector)
 *   { abs: partes }                 valor absoluto |…|
 *   { par: partes }                 entre paréntesis que crecen con lo de adentro
 * Los colores salen de las clases .var.c-* de app/estilos.css (y de kit.css en las escenas): nunca un color suelto.
 * Funciona en el navegador (window.Ecuacion) y en Node (pruebas).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Ecuacion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COLORES = ['c-o', 'c-i', 'c-h', 'c-d', 'c-f'];
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const lista = x => (Array.isArray(x) ? x : [x]);
  // Signo menos tipográfico en los números escritos con guion: «-3» → «−3» (no toca los guiones entre letras).
  const menos = t => String(t).replace(/(^|[\s(=+×·÷/])-(?=[\d.,])/g, '$1−');

  function revisar(p, donde = 'ecuación') {
    if (p === null || p === undefined) throw new Error(`${donde}: parte vacía`);
    if (typeof p === 'string' || typeof p === 'number') return;
    if (Array.isArray(p)) { p.forEach(x => revisar(x, donde)); return; }
    if (typeof p !== 'object') throw new Error(`${donde}: parte de tipo ${typeof p}`);
    if ('v' in p) {
      if (!COLORES.includes(p.v)) throw new Error(`${donde}: color de variable desconocido «${p.v}» (usa ${COLORES.join(', ')})`);
      if (!String(p.t || '').length) throw new Error(`${donde}: variable sin texto`);
      return;
    }
    const k = Object.keys(p).find(c => ['frac', 'sup', 'sub', 'raiz', 'vec', 'abs', 'par'].includes(c));
    if (!k) throw new Error(`${donde}: parte desconocida ${JSON.stringify(p)}`);
    if (['frac', 'sup', 'sub'].includes(k) && !(Array.isArray(p[k]) && p[k].length === 2)) throw new Error(`${donde}: ${k} lleva dos partes`);
    lista(p[k]).forEach(x => revisar(x, donde));
  }

  function html(partes) {
    return lista(partes).map(p => {
      if (typeof p === 'string' || typeof p === 'number') return esc(menos(p));
      if (Array.isArray(p)) return html(p);
      if ('v' in p) return `<span class="var ${esc(p.v)} ec-v">${esc(p.t)}</span>`;
      if (p.frac) return `<span class="ec-frac"><span class="ec-num">${html(p.frac[0])}</span><span class="ec-den">${html(p.frac[1])}</span></span>`;
      if (p.sup) return `${html(p.sup[0])}<sup class="ec-sup">${html(p.sup[1])}</sup>`;
      if (p.sub) return `${html(p.sub[0])}<sub class="ec-sub">${html(p.sub[1])}</sub>`;
      if (p.raiz) return `<span class="ec-raiz">${p.indice ? `<sup class="ec-ind">${esc(p.indice)}</sup>` : ''}<span class="ec-rad" aria-hidden="true">√</span><span class="ec-bajo">${html(p.raiz)}</span></span>`;
      if (p.vec) return `<span class="ec-vec">${html(p.vec)}</span>`;
      if (p.abs) return `<span class="ec-abs">|${html(p.abs)}|</span>`;
      if (p.par) return `<span class="ec-par">(${html(p.par)})</span>`;
      return '';
    }).join('');
  }

  // Texto plano que se lee bien en voz alta: «v = d / t», «x al cuadrado».
  function texto(partes) {
    return lista(partes).map(p => {
      if (typeof p === 'string' || typeof p === 'number') return menos(p);
      if (Array.isArray(p)) return texto(p);
      if ('v' in p) return p.t;
      if (p.frac) return `(${texto(p.frac[0])}) / (${texto(p.frac[1])})`.replace(/\((\w+)\)/g, '$1');
      if (p.sup) { const e = texto(p.sup[1]); return `${texto(p.sup[0])}${e === '2' ? ' al cuadrado' : e === '3' ? ' al cubo' : ` elevado a ${e}`}`; }
      if (p.sub) return `${texto(p.sub[0])}${texto(p.sub[1])}`;
      if (p.raiz) return `${p.indice ? `raíz ${p.indice} de` : 'raíz de'} ${texto(p.raiz)}`;
      if (p.vec) return `vector ${texto(p.vec)}`;
      if (p.abs) return `valor absoluto de ${texto(p.abs)}`;
      if (p.par) return `(${texto(p.par)})`;
      return '';
    }).join('').replace(/\s+/g, ' ').trim();
  }

  // Colores de variable que usa una ecuación (para comprobar que el dibujo usa los mismos).
  function colores(partes, acc = new Set()) {
    for (const p of lista(partes)) {
      if (!p || typeof p !== 'object') continue;
      if (Array.isArray(p)) { colores(p, acc); continue; }
      if ('v' in p) { acc.add(p.v); continue; }
      for (const k of ['frac', 'sup', 'sub', 'raiz', 'vec', 'abs', 'par']) if (p[k]) colores(p[k], acc);
    }
    return acc;
  }

  return { html, texto, revisar, colores, COLORES };
});
