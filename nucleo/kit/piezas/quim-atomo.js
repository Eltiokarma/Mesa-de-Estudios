/*
 * Pieza «quim-atomo» (sesión de teoría de Química): uno o dos átomos (o iones) en el modelo de capas, con el
 * núcleo contado (protones y neutrones) y los electrones en capas discontinuas. Sirve para partículas
 * subatómicas, Z y A, isótopos, iones e isoelectrónicos.
 *
 * Afirmación de la figura: el núcleo dice qué elemento es; los electrones de afuera solo dicen su carga.
 *
 * Fidelidad: el número de puntos de cada capa es el de los datos; los electrones que salen se dibujan fuera,
 * con su flecha, y los que llegan llevan un aro. Las capas son discontinuas a propósito: son niveles de energía
 * del modelo, no trayectorias (el alt lo dice). El tamaño no es a escala: el núcleo real es unas 10⁵ veces menor.
 *
 * Colores (los mismos tokens que la unidad): protones 'h', neutrones 'd', electrones 'i'.
 * datos = {
 *   atomos: [{ simbolo: 'Na', Z: 11, N: 12, capas: [2, 8, 1],   // electrones que quedan, por capa
 *              sale: { n: 1, desde: 1 },                         // electrones que se van (dibujados afuera)
 *              llega: { n: 0, desde },                           // de los de la última capa, cuántos llegaron
 *              titulo, rotulo, desde }],                         // uno o dos átomos
 *   alt
 * }
 * estado = { corte }. El dibujo es una función pura de (datos, estado). Alto fijo: 220.
 *
 * Opción nueva (18 nov 2026, etapa 4, Estructura atómica rehecha): `paleta: 'zne'`. Lo de arriba no cambia para quien no
 * la pide. Con 'zne', los colores son los del mapa aprobado (docs/etapa4/propuesta-quimica.md §8): protones (Z) naranja
 * 'o', neutrones (N) turquesa 'i', electrones violeta 'f', carga carmín 'h'; A va en tinta. Y cambia la figura:
 *   - el núcleo dice «6p⁺» y «8n⁰» (p⁺ protón, n⁰ neutrón: la letra n sola es del número cuántico en esta unidad);
 *   - los electrones no van en capas (los niveles se enseñan después): van en una zona tenue alrededor del núcleo, en dos
 *     anillos alternados que no se leen como órbitas;
 *   - el título lleva la carga en carmín, aparte del símbolo: { titulo: 'Na', carga: 1 } → «Na⁺».
 * atomos: [{ Z, N (null: el núcleo solo dice los protones), e (electrones; por omisión, Z − carga; null: la zona va
 *            sin electrones, cuando el dato no los da), carga, titulo,
 *            rotulo, rotuloColor ('h' para una carga), oculto: ['Z' | 'N' | 'e'] (salen con «?»), sale: { n, desde },
 *            llega: { n, desde }, desde, hasta (visible de desde a hasta, con corte), lugar (ranura 0 o 1) }],
 * lugares: 1 o 2 (por omisión, cuántos átomos hay), flecha: true o { desde, hasta } (una flecha de la ranura 0 a la 1,
 * en vez de la raya),
 * raya: false (sin la raya que separa las dos ranuras).
 * cuerpoZNE(d, estado) da el contenido sin el <svg> (para que quim-objeto lo componga) y cajasZNE(d, estado) las cajas
 * de textos y objetos, con las mismas cuentas del dibujo, para la prueba numérica de encuadre y rótulos.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, ALTO = 220, CY = 112, RN = 22;
  const f = n => Kit.formatear(n, 0);

  function atomoSVG(a, cx, ancho, corte) {
    const ve = x => !x || (x.desde || 0) <= corte;
    const nuevo = x => (x && (x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    const capas = (a.capas || []).filter((n, i, l) => n > 0 || i < l.length - 1);
    const nc = Math.max(1, capas.length + ((a.sale && a.sale.n > 0 && !capas.length) ? 1 : 0));
    const rmax = Math.min(ancho / 2 - 14, 84);
    const paso = (rmax - RN - 6) / nc;
    let s = '';
    // Capas (niveles del modelo): discontinuas.
    capas.forEach((n, i) => {
      const r = RN + 6 + paso * (i + 1);
      s += `<circle cx="${T.n(cx)}" cy="${CY}" r="${T.n(r)}" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="3 4"/>`;
      const llegan = i === capas.length - 1 && a.llega ? a.llega.n || 0 : 0;
      for (let j = 0; j < n; j++) {
        const ang = -Math.PI / 2 + (2 * Math.PI * j) / n + i * 0.35;
        const x = cx + r * Math.cos(ang), y = CY + r * Math.sin(ang);
        const esNuevo = j >= n - llegan;
        if (esNuevo && !ve(a.llega)) continue;
        s += `<g class="kit-electron${esNuevo ? nuevo(a.llega) : ''}"><circle cx="${T.n(x)}" cy="${T.n(y)}" r="4.5" fill="var(--c-i)"/>`;
        if (esNuevo) s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="8" fill="none" stroke="var(--c-i)" stroke-width="1.5"/>`;
        s += '</g>';
      }
    });
    // Núcleo: protones y neutrones contados.
    s += `<circle cx="${T.n(cx)}" cy="${CY}" r="${RN}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    s += T.rotulo(cx, CY - 3, `${f(a.Z)}p`, { ancla: 'middle', peso: 700, color: 'h', tam: 14 });
    s += T.rotulo(cx, CY + 14, `${f(a.N)}n`, { ancla: 'middle', peso: 700, color: 'd', tam: 14 });
    // Electrones que salen: afuera, con su flecha.
    if (a.sale && a.sale.n > 0 && ve(a.sale)) {
      const rext = RN + 6 + paso * Math.max(1, capas.length);
      let q = '';
      for (let j = 0; j < a.sale.n; j++) {
        const ang = -Math.PI / 4 + j * 0.42;
        const x0 = cx + (rext - 2) * Math.cos(ang), y0 = CY + (rext - 2) * Math.sin(ang);
        const x1 = cx + (rext + 18) * Math.cos(ang), y1 = CY + (rext + 18) * Math.sin(ang);
        q += T.flecha(x0, y0, x1 - 6 * Math.cos(ang), y1 - 6 * Math.sin(ang), { color: 'i', grosor: T.GROSOR.cuadricula + 0.5 });
        q += `<circle cx="${T.n(x1 + 4 * Math.cos(ang))}" cy="${T.n(y1 + 4 * Math.sin(ang))}" r="4.5" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-dasharray="2 2"/>`;
      }
      s += `<g class="kit-sale${nuevo(a.sale)}">${q}</g>`;
    }
    if (a.titulo) s += T.rotulo(cx, 18, a.titulo, { ancla: 'middle', peso: 700, min: cx - ancho / 2, max: cx + ancho / 2 });
    if (a.rotulo) s += T.rotulo(cx, ALTO - 8, a.rotulo, { ancla: 'middle', peso: 600, min: cx - ancho / 2, max: cx + ancho / 2, clase: 'kit-num' });
    return `<g class="kit-atomo${nuevo(a)}">${s}</g>`;
  }

  // Geometría para el gesto directo (docs/teoria.md §4b): centro del átomo k, radio del núcleo y de cada capa i
  // (0 = la más interna), con el mismo cálculo que el dibujo.
  function geometria(d) {
    const as = (d.atomos || []).slice(0, 2), n = Math.max(1, as.length), ancho = W / n;
    const atomo = k => {
      const a = as[k] || {}, cx = ancho * (k + 0.5);
      const capas = (a.capas || []).filter((m, i, l) => m > 0 || i < l.length - 1);
      const nc = Math.max(1, capas.length + ((a.sale && a.sale.n > 0 && !capas.length) ? 1 : 0));
      const paso = (Math.min(ancho / 2 - 14, 84) - RN - 6) / nc;
      return { cx, cy: CY, rn: RN, capas: capas.length, radio: i => RN + 6 + paso * (i + 1) };
    };
    return { alto: ALTO, atomo };
  }

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0);
    const as = (d.atomos || []).slice(0, 2), n = Math.max(1, as.length), ancho = W / n;
    let s = '';
    as.forEach((a, k) => { if ((a.desde || 0) <= corte) s += atomoSVG(a, ancho * (k + 0.5), ancho, corte); });
    if (n === 2) s += T.linea(W / 2, 30, W / 2, ALTO - 30, { grosor: T.GROSOR.cuadricula, opacidad: 0.3 });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const as = (d.atomos || []).map(a => {
      const e = (a.capas || []).reduce((x, y) => x + y, 0);
      return `${a.simbolo || 'átomo'}: ${f(a.Z)} protones y ${f(a.N)} neutrones en el núcleo, ${f(e)} electrones en capas ${(a.capas || []).join(', ')}${a.sale && a.sale.n ? `; salen ${f(a.sale.n)}` : ''}`;
    });
    return `Modelo de capas (niveles, no trayectorias; no a escala). ${as.join('. ')}.`;
  }

  // ---------- Paleta 'zne' (18 nov) ----------
  const RNZ = 26, MZ = 4;
  const SUPZ = { '+': '⁺', '-': '⁻', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 0: '⁰' };
  const cargaTxt = q => (!q ? '' : `${Math.abs(q) === 1 ? '' : String(Math.abs(q)).split('').map(c => SUPZ[c]).join('')}${q > 0 ? '⁺' : '⁻'}`);
  const visible = (x, corte) => (x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta);
  const ranuras = d => Math.max(1, Math.min(2, d.lugares || Math.min(2, (d.atomos || []).length)));
  const lugarDe = (a, k) => (a.lugar === undefined ? k : a.lugar);
  // Radios de la zona de los electrones según el ancho de la ranura.
  const radiosZ = ancho => { const rmax = Math.min(ancho / 2 - 16, 80), r2 = rmax - 6; return { r1: RNZ + 12 + 0.3 * (r2 - RNZ - 12), r2, zona: rmax + 2 }; };
  const electronesDe = a => (a.e === null ? 0 : a.e !== undefined ? a.e : Math.max(0, (a.Z || 0) - (a.carga || 0)));
  const oculto = (a, k) => Array.isArray(a.oculto) && a.oculto.includes(k);
  // Posición del electrón j de k: anillo de afuera los pares, de adentro los impares, repartidos en ángulo.
  const posE = (j, k, cx, R) => { const ang = -Math.PI / 2 + (2 * Math.PI * j) / Math.max(1, k), r = j % 2 ? R.r1 : R.r2; return [cx + r * Math.cos(ang), CY + r * Math.sin(ang)]; };
  const posSale = (j, cx, R) => { const ang = -Math.PI / 4 + j * 0.42; return { ang, x0: cx + (R.zona + 2) * Math.cos(ang), y0: CY + (R.zona + 2) * Math.sin(ang), x1: cx + (R.zona + 18) * Math.cos(ang), y1: CY + (R.zona + 18) * Math.sin(ang) }; };
  const TIT = 16, ROT = 16;
  function textoTitulo(a) { return { base: String(a.titulo || ''), q: a.carga ? cargaTxt(a.carga) : '' }; }
  function cajaTexto(x, y, w, tam, ancla) { const x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x; return { x0, x1: x0 + w, y0: y - 0.78 * tam, y1: y + 0.22 * tam }; }
  // Dónde va cada texto del átomo (las mismas cuentas para el dibujo y para cajasZNE).
  function textosZNE(a, cx, ancho) {
    const out = [], lim = [cx - ancho / 2 + MZ, cx + ancho / 2 - MZ];
    const caber = (x, w) => Math.max(lim[0] + w / 2, Math.min(lim[1] - w / 2, x));
    if (a.titulo || a.carga) {
      const t = textoTitulo(a), w = T.ancho(t.base, TIT, 700) + T.ancho(t.q, TIT, 700), x = caber(cx, w);
      out.push(Object.assign({ que: 'titulo', txt: t.base + t.q, t, x, y: 20, w, tam: TIT }, cajaTexto(x, 20, w, TIT, 'middle')));
    }
    if (a.rotulo) {
      const w = T.ancho(a.rotulo, ROT, 600), x = caber(cx, w);
      out.push(Object.assign({ que: 'rotulo', txt: a.rotulo, x, y: ALTO - 8, w, tam: ROT }, cajaTexto(x, ALTO - 8, w, ROT, 'middle')));
    }
    // Lo que se pide va con «?» en tinta: nada se pinta del color de su magnitud antes de comprobarse (molde §3).
    const p = `${oculto(a, 'Z') ? '?' : f(a.Z)}p⁺`, n = a.N === null || a.N === undefined ? null : `${oculto(a, 'N') ? '?' : f(a.N)}n⁰`;
    const yp = n ? CY - 3 : CY + 5;
    out.push(Object.assign({ que: 'dentro', txt: p, color: oculto(a, 'Z') ? undefined : 'o', x: cx, y: yp, w: T.ancho(p, 14, 700), tam: 14 }, cajaTexto(cx, yp, T.ancho(p, 14, 700), 14, 'middle')));
    if (n) out.push(Object.assign({ que: 'dentro', txt: n, color: oculto(a, 'N') ? undefined : 'i', x: cx, y: CY + 14, w: T.ancho(n, 14, 700), tam: 14 }, cajaTexto(cx, CY + 14, T.ancho(n, 14, 700), 14, 'middle')));
    if (oculto(a, 'e')) {
      const R = radiosZ(ancho), y = CY - (R.r1 + R.r2) / 2 + 5, t = '? e⁻', w = T.ancho(t, 14, 700);
      out.push(Object.assign({ que: 'zona', txt: t, x: cx, y, w, tam: 14 }, cajaTexto(cx, y, w, 14, 'middle')));
    }
    return out;
  }
  function atomoZNE(a, cx, ancho, corte) {
    const R = radiosZ(ancho), ve = x => !x || (x.desde || 0) <= corte;
    const nuevo = x => (x && (x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    let s = `<circle class="kit-zona" cx="${T.n(cx)}" cy="${CY}" r="${T.n(R.zona)}" fill="currentColor" fill-opacity="0.06"/>`;
    const k = electronesDe(a), llegan = a.llega ? a.llega.n || 0 : 0;
    if (!oculto(a, 'e')) for (let j = 0; j < k; j++) {
      const [x, y] = posE(j, k, cx, R), esNuevo = j >= k - llegan;
      if (esNuevo && !ve(a.llega)) continue;
      s += `<g class="kit-electron${esNuevo ? nuevo(a.llega) : ''}"><circle cx="${T.n(x)}" cy="${T.n(y)}" r="4.5" fill="var(--c-f)"/>`;
      if (esNuevo) s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="8" fill="none" stroke="var(--c-f)" stroke-width="1.5"/>`;
      s += '</g>';
    }
    s += `<circle cx="${T.n(cx)}" cy="${CY}" r="${RNZ}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    if (a.sale && a.sale.n > 0 && ve(a.sale)) {
      let q = '';
      for (let j = 0; j < a.sale.n; j++) {
        const p = posSale(j, cx, R);
        q += T.flecha(p.x0, p.y0, p.x1 - 6 * Math.cos(p.ang), p.y1 - 6 * Math.sin(p.ang), { color: 'f', grosor: T.GROSOR.cuadricula + 0.5 });
        q += `<circle cx="${T.n(p.x1 + 4 * Math.cos(p.ang))}" cy="${T.n(p.y1 + 4 * Math.sin(p.ang))}" r="4.5" fill="none" stroke="var(--c-f)" stroke-width="2" stroke-dasharray="2 2"/>`;
      }
      s += `<g class="kit-sale${nuevo(a.sale)}">${q}</g>`;
    }
    for (const t of textosZNE(a, cx, ancho)) {
      if (t.que === 'titulo') {
        s += `<text class="kit-txt" x="${T.n(t.x)}" y="${t.y}" fill="currentColor" font-size="${TIT}" font-weight="700" text-anchor="middle">${T.esc(t.t.base)}${t.t.q ? `<tspan fill="var(--c-h)">${T.esc(t.t.q)}</tspan>` : ''}</text>`;
      } else if (t.que === 'rotulo') {
        s += T.rotulo(t.x, t.y, t.txt, { ancla: 'middle', peso: 600, tam: ROT, color: a.rotuloColor, clase: 'kit-num', min: 0, max: W });
      } else s += T.rotulo(t.x, t.y, t.txt, { ancla: 'middle', peso: 700, tam: 14, color: t.color, min: 0, max: W });
    }
    return `<g class="kit-atomo${nuevo(a)}">${s}</g>`;
  }
  function cuerpoZNE(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), n = ranuras(d), ancho = W / n;
    let s = '';
    (d.atomos || []).forEach((a, k) => { if (visible(a, corte)) s += atomoZNE(a, ancho * (lugarDe(a, k) + 0.5), ancho, corte); });
    const fl = d.flecha && (d.flecha === true || visible(d.flecha, corte));
    if (n === 2) {
      if (fl) s += `<g class="kit-flecha${d.flecha !== true && (d.flecha.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : ''}">${T.flecha(W / 2 - 11, CY, W / 2 + 11, CY, { grosor: 2 })}</g>`;
      else if (d.raya !== false) s += T.linea(W / 2, 30, W / 2, ALTO - 30, { grosor: T.GROSOR.cuadricula, opacidad: 0.3 });
    }
    return s;
  }
  // Cajas de lo que se dibuja (para las pruebas de encuadre y rótulos): textos y objetos, en coordenadas del dibujo.
  function cajasZNE(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), n = ranuras(d), ancho = W / n, textos = [], objetos = [];
    (d.atomos || []).forEach((a, k) => {
      if (!visible(a, corte)) return;
      const cx = ancho * (lugarDe(a, k) + 0.5), R = radiosZ(ancho);
      for (const t of textosZNE(a, cx, ancho)) textos.push(t);
      objetos.push({ que: 'zona', x0: cx - R.zona, x1: cx + R.zona, y0: CY - R.zona, y1: CY + R.zona, cx, cy: CY, r: R.zona });
      if (a.sale && a.sale.n > 0 && (a.sale.desde || 0) <= corte) for (let j = 0; j < a.sale.n; j++) {
        const p = posSale(j, cx, R), x = p.x1 + 4 * Math.cos(p.ang), y = p.y1 + 4 * Math.sin(p.ang);
        objetos.push({ que: 'sale', x0: Math.min(p.x0, x - 5.5), x1: Math.max(p.x0, x + 5.5), y0: Math.min(p.y0, y - 5.5), y1: Math.max(p.y0, y + 5.5) });
      }
    });
    if (n === 2 && d.flecha && (d.flecha === true || visible(d.flecha, corte))) objetos.push({ que: 'flecha', x0: W / 2 - 13, x1: W / 2 + 13, y0: CY - 7, y1: CY + 7 });
    return { W, H: ALTO, M: MZ, textos, objetos };
  }
  function altZNE(d) {
    if (d.alt) return d.alt;
    const as = (d.atomos || []).map(a => {
      const q = a.carga || 0, e = electronesDe(a);
      const pz = oculto(a, 'Z') ? 'protones sin contar («?»)' : `${f(a.Z)} protones`;
      const nz = a.N === null || a.N === undefined ? '' : oculto(a, 'N') ? ' y neutrones sin contar («?»)' : ` y ${f(a.N)} neutrones`;
      const ez = a.e === null ? '' : `; afuera, ${oculto(a, 'e') ? 'electrones sin contar («?»)' : `${f(e)} electrones`}`;
      return `${a.titulo || 'átomo'}${q ? ` (carga ${q > 0 ? '+' : '−'}${Math.abs(q)})` : ''}: ${pz}${nz} en el núcleo${ez}${a.sale && a.sale.n ? `; salen ${f(a.sale.n)}` : ''}`;
    });
    return `Átomo con su núcleo contado y sus electrones alrededor (modelo, no a escala). ${as.join('. ')}.`;
  }

  const dibujarViejo = dibujar, altViejo = alt;
  function dibujarTodo(d, estado = {}) { return d && d.paleta === 'zne' ? T.svg(W, ALTO, cuerpoZNE(d, estado), { alt: altZNE(d) }) : dibujarViejo(d, estado); }
  function altTodo(d) { return d && d.paleta === 'zne' ? altZNE(d) : altViejo(d); }

  return { id: 'quim-atomo', dibujar: dibujarTodo, alt: altTodo, geometria, cuerpoZNE, cajasZNE, cargaTxt, ALTO, W };
});
