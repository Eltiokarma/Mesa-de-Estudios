/*
 * Flecha de vector dibujada por la app (16 nov 2026). Los textos de los generadores escriben un vector con el carácter
 * combinante U+20D7 detrás del nombre («A⃗», «AB⃗»; punto 5 del contrato, docs/plan-calidad.md). Las fuentes del
 * sistema no lo traen: en Chrome se veía un cuadradito vacío. Este archivo lo reemplaza en toda la página:
 *   - en HTML, el nombre va en <span class="ec-vec"> (la flecha la pone el CSS, como en la teoría);
 *   - en un <text> de SVG, el nombre queda y encima va una flechita «→» chica, centrada sobre él.
 * Mira la página con un MutationObserver: lo que se pinte después (pasos, preguntas, figuras) también se arregla.
 * Solo en el navegador; sin dependencias. Flechas.reemplazar(texto) devuelve las partes, para probarlo en Node.
 */
(function (root) {
  'use strict';
  const F = '⃗';
  const RE = /([A-Za-zÁÉÍÓÚáéíóúÑñ]+|0)⃗/g;
  // [{ t: 'texto suelto' } | { vec: 'AB' }, …]
  function reemplazar(t) {
    const out = []; let k = 0;
    String(t).replace(RE, (m, nombre, i) => { if (i > k) out.push({ t: t.slice(k, i) }); out.push({ vec: nombre }); k = i + m.length; return m; });
    if (k < t.length) out.push({ t: t.slice(k).split(F).join('') });
    return out;
  }
  if (typeof module === 'object' && module.exports) { module.exports = { reemplazar }; return; }
  const doc = root.document; if (!doc) return;
  const SVG = 'http://www.w3.org/2000/svg';

  function enHTML(nodo) {
    const frag = doc.createDocumentFragment();
    for (const p of reemplazar(nodo.nodeValue)) {
      if (p.t !== undefined) frag.append(p.t);
      else { const s = doc.createElement('span'); s.className = 'ec-vec'; s.textContent = p.vec; frag.append(s); }
    }
    nodo.replaceWith(frag);
  }
  function enSVG(nodo) {
    const padre = nodo.parentNode, fs = parseFloat(root.getComputedStyle(padre).fontSize) || 16;
    const partes = reemplazar(nodo.nodeValue), nuevos = [];
    let pendienteDy = 0, pendienteDx = 0;
    for (const p of partes) {
      const ts = doc.createElementNS(SVG, 'tspan');
      if (pendienteDy || pendienteDx) { ts.setAttribute('dy', String(pendienteDy)); ts.setAttribute('dx', String(pendienteDx)); pendienteDy = 0; pendienteDx = 0; }
      ts.textContent = p.t !== undefined ? p.t : p.vec;
      padre.insertBefore(ts, nodo); nuevos.push(ts);
      if (p.vec !== undefined) {
        let largo = 0; try { largo = ts.getComputedTextLength(); } catch (e) { /* sin dibujar todavía */ }
        if (!largo) largo = fs * 0.6 * p.vec.length;
        const fl = doc.createElementNS(SVG, 'tspan'), af = fs * 0.62, la = af * 0.9;
        fl.setAttribute('font-size', String(af)); fl.setAttribute('dy', String(-fs * 0.68)); fl.setAttribute('dx', String(-(largo + la) / 2));
        fl.setAttribute('aria-hidden', 'true'); fl.textContent = '→';
        padre.insertBefore(fl, nodo);
        pendienteDy = fs * 0.68; pendienteDx = (largo - la) / 2;
      }
    }
    // Si la flecha fue lo último, lo que sigue en el <text> (otro tspan) igual vuelve a la línea base.
    if (pendienteDy) { const ts = doc.createElementNS(SVG, 'tspan'); ts.setAttribute('dy', String(pendienteDy)); ts.setAttribute('dx', String(pendienteDx)); ts.textContent = '​'; padre.insertBefore(ts, nodo); }
    padre.removeChild(nodo);
  }
  function recorrer(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) { if (raiz.nodeValue.includes(F)) arreglar(raiz); return; }
    if (raiz.nodeType !== 1 && raiz.nodeType !== 11) return;
    if (!(raiz.textContent || '').includes(F)) return;
    const tw = doc.createTreeWalker(raiz, 4, { acceptNode: n => (n.nodeValue.includes(F) ? 1 : 3) });
    const nodos = []; for (let n = tw.nextNode(); n; n = tw.nextNode()) nodos.push(n);
    nodos.forEach(arreglar);
  }
  function arreglar(n) {
    const p = n.parentNode; if (!p) return;
    if (p.closest && p.closest('script,style,textarea,title')) return;
    if (p.namespaceURI === SVG) enSVG(n); else enHTML(n);
  }
  const iniciar = () => {
    // Las escenas de plantillas/ no cargan los estilos de la app: la regla de la flecha va aquí también.
    if (!doc.getElementById('estilo-ec-vec')) {
      const st = doc.createElement('style'); st.id = 'estilo-ec-vec';
      st.textContent = ".ec-vec{display:inline-block;position:relative}.ec-vec::before{content:'→';position:absolute;left:0;right:0;top:-.85em;font-size:.7em;text-align:center}";
      doc.head.appendChild(st);
    }
    recorrer(doc.body);
    new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') recorrer(m.target); else m.addedNodes.forEach(recorrer); } })
      .observe(doc.body, { childList: true, subtree: true, characterData: true });
  };
  if (doc.body) iniciar(); else doc.addEventListener('DOMContentLoaded', iniciar);
  root.Flechas = { reemplazar };
})(typeof self !== 'undefined' ? self : this);
