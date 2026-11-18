/*
 * Pieza «quim-lamina» (18 nov 2026, etapa 4 de química, Estructura atómica, idea 2 «Modelos atómicos»): la lámina de oro
 * de Rutherford y los modelos del átomo. Dibujo de prueba (data-prueba; Gerson decide después si lo reemplaza,
 * docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: lo que le pasa a una partícula alfa al cruzar un átomo depende de cómo está repartida la carga
 * positiva de ese átomo: repartida en todo el átomo (Thomson), casi no la desvía; concentrada en un núcleo diminuto, la
 * desvía mucho si pasa cerca, y la hace rebotar si va derecho al centro.
 *
 * Fidelidad: el ángulo de desvío de cada alfa es un dato (lo calcula la unidad con su modelo, regla 1); la pieza solo lo
 * dibuja. No es a escala: el núcleo real es unas 100 000 veces menor que el átomo (el alt lo dice).
 *
 * Colores del mapa aprobado (docs/etapa4/propuesta-quimica.md §8): la carga positiva repartida en carmín 'h' (es carga),
 * los electrones en violeta 'f', el núcleo (los protones) en naranja 'o'; la alfa, su camino, los objetos y los rótulos
 * en tinta. Sin verde ni paleta de elementos.
 *
 * datos = {
 *   vista: 'zoom' | 'lamina' | 'modelos',
 *   banda: 'retablo',        // opcional: arriba, el retablo con pan de oro y la hojita que la lupa agranda
 *   titulo,                  // arriba de la vista (zoom y lámina)
 *   // zoom: un átomo grande y las alfas que lo cruzan
 *   modelo: 'thomson' | 'dalton' | 'nuclear' | 'incognita',   // incognita: el átomo con «?» (lo que se predice)
 *   alfas: [{ b, desvio, llega: true }],  // b: dónde apunta, de −1 a 1 radios del átomo (+ arriba); desvio en grados;
 *                                         // llega: solo el tramo de ida, con «?» (lo que se pide)
 *   // lámina: el experimento entero
 *   resultado: true,         // con lo que se vio (casi todas pasan, pocas se desvían, alguna rebota); si no, «?»
 *   // modelos: cinco dibujos chicos, de Dalton al actual, que aparecen con el corte (desde 1 a 5)
 *   alt
 * }
 * estado = { corte } (vista modelos). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
 * geometria(datos, estado) → { W, H, M, textos, objetos, caminos }: lo mismo que se dibuja, para la prueba numérica de
 * encuadre y rótulos (docs/molde-unidad.md §6).
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
  const W = 320, M = 4, n = T.n, BANDA = 100;
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const altoVista = d => (d.vista === 'modelos' ? 250 : d.vista === 'lamina' ? 206 : 226);
  const alto = d => (d.banda === 'retablo' ? BANDA : 0) + altoVista(d);

  // ---------- Banda: el retablo con pan de oro ----------
  function retablo() {
    let s = '';
    // Cuerpo del retablo: base, dos columnas y la hornacina con arco; molduras doradas como rayitas.
    s += `<rect x="40" y="86" width="140" height="8" fill="currentColor" fill-opacity="0.16" ${tinta(2)}/>`;
    s += `<path d="M52 86V40Q52 30 62 30H158Q168 30 168 40V86" fill="currentColor" fill-opacity="0.1" ${tinta(2)}/>`;
    s += `<path d="M84 86V54A26 22 0 0 1 136 54V86Z" fill="var(--card)" ${tinta(2)}/>`;
    for (const x of [62, 158]) s += `<rect x="${x - 5}" y="38" width="10" height="48" fill="currentColor" fill-opacity="0.18" ${tinta(1.5)}/>`;
    s += `<path d="M66 34l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4" fill="none" ${tinta(1.2)} stroke-opacity="0.7"/>`;
    s += `<path d="M96 62q14 -14 28 0M98 72q12 -10 24 0" fill="none" ${tinta(1.2)} stroke-opacity="0.55"/>`;
    // La hojita de pan de oro y la lupa que baja a la vista.
    s += `<path d="M214 40L250 36L254 70L218 74Z" fill="currentColor" fill-opacity="0.2" ${tinta(1.5)}/>`;
    s += `<circle cx="234" cy="55" r="9" fill="none" ${tinta(1.5)} stroke-dasharray="3 2"/>`;
    s += `<line x1="227" y1="62" x2="206" y2="${BANDA - 2}" ${tinta(1)} stroke-opacity="0.45"/><line x1="241" y1="62" x2="290" y2="${BANDA - 2}" ${tinta(1)} stroke-opacity="0.45"/>`;
    return s;
  }
  function textosBanda() {
    return [{ que: 'titulo', txt: 'Retablo con pan de oro', x: 110, y: 18, tam: 14, peso: 700, ancla: 'middle' },
      { que: 'rotulo', txt: 'pan de oro', x: 234, y: 31, tam: 14, peso: 600, ancla: 'middle' }];
  }

  // ---------- Zoom: un átomo y las alfas ----------
  const ZC = { cx: 192, cy: 118, R: 72, x0: 30 };
  // Una alfa: entra desde la izquierda a la altura del parámetro b; gira en T y sale con su desvío, hasta el borde.
  function camino(a, modelo, top) {
    const cy = top + ZC.cy, y0 = cy - a.b * ZC.R, ini = [ZC.x0, y0];
    if (a.llega) return { ini, fin: [ZC.cx - ZC.R - 30, y0], llega: true };
    const th = Math.max(0, Math.min(180, a.desvio || 0)) * Math.PI / 180, arriba = a.b > 0 ? -1 : 1;
    let tx = ZC.cx;
    if (modelo === 'dalton' && Math.abs(a.b) < 1) tx = ZC.cx - Math.sqrt(ZC.R * ZC.R - (a.b * ZC.R) ** 2);
    else if (modelo === 'nuclear') tx = ZC.cx - 14 * Math.sin(th / 2);
    const tp = [tx, y0];
    // De frente (b = 0, 180°) la alfa vuelve por una paralela, 8 más arriba, para que se vea la vuelta.
    const u = Math.abs(a.b) < 1e-9 && th > Math.PI * 0.99 ? null : [Math.cos(th), arriba * Math.sin(th)];
    if (!u) return { ini, t: tp, fin: [ZC.x0 + 18, y0 - 8], vuelve: true };
    const lim = (p, v, lo, hi) => (v > 1e-9 ? (hi - p) / v : v < -1e-9 ? (lo - p) / v : Infinity);
    const L = Math.min(180, lim(tp[0], u[0], 10, W - 10), lim(tp[1], u[1], top + 34, top + altoVista({ vista: 'zoom' }) - 12));
    return { ini, t: tp, fin: [tp[0] + u[0] * L, tp[1] + u[1] * L] };
  }
  function caminoSVG(c) {
    if (c.llega) return `<line x1="${n(c.ini[0])}" y1="${n(c.ini[1])}" x2="${n(c.fin[0] - 10)}" y2="${n(c.fin[1])}" ${tinta(3)}/>` + T.flecha(c.fin[0] - 12, c.fin[1], c.fin[0], c.fin[1], { grosor: 3 });
    if (c.vuelve) {
      const [tx, ty] = c.t;
      return `<path d="M${n(c.ini[0])} ${n(ty)}L${n(tx - 6)} ${n(ty)}Q${n(tx)} ${n(ty)} ${n(tx)} ${n(ty - 4)}Q${n(tx)} ${n(ty - 8)} ${n(tx - 6)} ${n(ty - 8)}L${n(c.fin[0] + 10)} ${n(c.fin[1])}" fill="none" ${tinta(3)}/>`
        + T.flecha(c.fin[0] + 12, c.fin[1], c.fin[0], c.fin[1], { grosor: 3 });
    }
    const [tx, ty] = c.t, [fx, fy] = c.fin, L = Math.hypot(fx - tx, fy - ty), ux = (fx - tx) / L, uy = (fy - ty) / L;
    const a = [tx - 14, ty], b = [tx + ux * 14, ty + uy * 14], q = [fx - ux * 12, fy - uy * 12];
    return `<path d="M${n(c.ini[0])} ${n(c.ini[1])}L${n(a[0])} ${n(a[1])}Q${n(tx)} ${n(ty)} ${n(b[0])} ${n(b[1])}L${n(q[0])} ${n(q[1])}" fill="none" ${tinta(3)}/>`
      + T.flecha(q[0], q[1], fx, fy, { grosor: 3 });
  }
  // Puntos fijos (sin azar) dentro de un círculo: espiral de Fermat.
  const espiral = (k, total, R, giro = 0) => { const r = R * Math.sqrt((k + 0.5) / total), a = k * 2.39996 + giro; return [r * Math.cos(a), r * Math.sin(a)]; };
  function atomo(modelo, cx, cy, R) {
    let s = '';
    if (modelo === 'thomson') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${R}" fill="var(--c-h)" fill-opacity="0.12" stroke="var(--c-h)" stroke-width="1.5"/>`;
      for (let k = 0; k < 14; k++) { const [x, y] = espiral(k, 14, R * 0.86, 0.4); s += `<path d="M${n(cx + x - 4)} ${n(cy + y)}h8M${n(cx + x)} ${n(cy + y - 4)}v8" stroke="var(--c-h)" stroke-width="1.8" stroke-linecap="round"/>`; }
      for (let k = 0; k < 9; k++) { const [x, y] = espiral(k, 9, R * 0.8, 1.9); s += `<circle class="kit-electron" cx="${n(cx + x)}" cy="${n(cy + y)}" r="${R > 40 ? 4.5 : 2.5}" fill="var(--c-f)"/>`; }
    } else if (modelo === 'dalton') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${R}" fill="currentColor" fill-opacity="0.26" ${tinta(2)}/>`;
      s += `<path d="M${n(cx - R * 0.55)} ${n(cy - R * 0.25)}A${n(R * 0.6)} ${n(R * 0.6)} 0 0 1 ${n(cx - R * 0.1)} ${n(cy - R * 0.62)}" fill="none" ${tinta(2)} stroke-opacity="0.45"/>`;
    } else if (modelo === 'nuclear') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${R}" fill="currentColor" fill-opacity="0.04" ${tinta(1)} stroke-dasharray="4 4" stroke-opacity="0.6"/>`;
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${R > 40 ? 4 : 2.5}" fill="var(--c-o)"/>`;
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + 0.5, r = R * (k % 2 ? 0.78 : 0.62); s += `<circle class="kit-electron" cx="${n(cx + r * Math.cos(a))}" cy="${n(cy + r * Math.sin(a))}" r="${R > 40 ? 4.5 : 2.5}" fill="var(--c-f)"/>`; }
    } else {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${R}" fill="currentColor" fill-opacity="0.06" ${tinta(1.5)} stroke-dasharray="4 4"/>`;
    }
    return s;
  }
  function zoom(d, top) {
    let s = atomo(d.modelo, ZC.cx, top + ZC.cy, ZC.R);
    // La fuente de alfas, a la izquierda.
    s += `<rect x="8" y="${top + 50}" width="16" height="136" rx="4" fill="currentColor" fill-opacity="0.12" ${tinta(1.5)}/>`;
    for (const a of d.alfas || []) s += `<g class="kit-alfa">${caminoSVG(camino(a, d.modelo, top))}</g>`;
    return s;
  }
  function textosZoom(d, top) {
    const out = [];
    if (d.titulo) out.push({ que: 'titulo', txt: d.titulo, x: W / 2, y: top + 20, tam: 16, peso: 700, ancla: 'middle' });
    out.push({ que: 'rotulo', txt: 'alfas', x: 6, y: top + 44, tam: 14, peso: 600, ancla: 'start' });
    if (d.modelo === 'incognita') out.push({ que: 'pide', txt: '?', x: ZC.cx, y: top + ZC.cy + 8, tam: 22, peso: 700, ancla: 'middle' });
    for (const a of d.alfas || []) if (a.llega) {
      const c = camino(a, d.modelo, top);
      out.push({ que: 'pide', txt: '?', x: c.fin[0] + 8, y: c.fin[1] + 6, tam: 18, peso: 700, ancla: 'start' });
    }
    return out;
  }

  // ---------- Lámina: el experimento entero ----------
  const LM = { fx: 172, y: [62, 72, 82, 92, 102, 112, 122, 132, 142] };
  function lamina(d, top) {
    let s = `<rect x="8" y="${top + 86}" width="34" height="34" rx="5" fill="currentColor" fill-opacity="0.12" ${tinta(1.5)}/>`;
    s += `<rect x="${LM.fx - 3}" y="${top + 42}" width="6" height="122" fill="currentColor" fill-opacity="0.32" ${tinta(1)}/>`;
    LM.y.forEach((y, k) => {
      const yy = top + y;
      s += `<line x1="42" y1="${n(top + 103)}" x2="${LM.fx - 4}" y2="${n(yy)}" ${tinta(1.5)} stroke-opacity="0.75"/>`;
      if (!d.resultado) return;
      if (k === 2) s += T.flecha(LM.fx + 4, yy, 290, top + 30, { grosor: 1.5 });
      else if (k === 6) s += `<path d="M${LM.fx - 4} ${n(yy)}L120 ${n(top + 168)}" fill="none" ${tinta(1.5)}/>` + T.flecha(126, top + 165, 112, top + 172, { grosor: 1.5 });
      else s += T.flecha(LM.fx + 4, yy, 296, yy + (yy - top - 103) * 0.3, { grosor: 1.5 });
    });
    return s;
  }
  function textosLamina(d, top) {
    const out = [];
    if (d.titulo) out.push({ que: 'titulo', txt: d.titulo, x: W / 2, y: top + 20, tam: 16, peso: 700, ancla: 'middle' });
    out.push({ que: 'rotulo', txt: 'alfas', x: 25, y: top + 140, tam: 14, peso: 600, ancla: 'middle' });
    out.push({ que: 'rotulo', txt: 'lámina de oro', x: LM.fx, y: top + 194, tam: 14, peso: 600, ancla: 'middle' });
    if (!d.resultado) out.push({ que: 'pide', txt: '?', x: 236, y: top + 110, tam: 22, peso: 700, ancla: 'middle' });
    return out;
  }

  // ---------- Modelos: de Dalton al actual ----------
  const MODELOS = [
    { k: 'dalton', nombre: 'Dalton', anio: '1808', cx: 58, cy: 50 }, { k: 'thomson', nombre: 'Thomson', anio: '1904', cx: 160, cy: 50 },
    { k: 'nuclear', nombre: 'Rutherford', anio: '1911', cx: 262, cy: 50 }, { k: 'bohr', nombre: 'Bohr', anio: '1913', cx: 108, cy: 170 },
    { k: 'actual', nombre: 'Actual', anio: '1926', cx: 212, cy: 170 }];
  const RM = 32;
  function mini(m, top) {
    const cx = m.cx, cy = top + m.cy;
    if (m.k === 'bohr') {
      let s = '';
      for (const r of [11, 21, 31]) s += `<circle cx="${cx}" cy="${n(cy)}" r="${r}" fill="none" ${tinta(1.2)} stroke-opacity="0.7"/>`;
      s += `<circle cx="${cx}" cy="${n(cy)}" r="3" fill="var(--c-o)"/>`;
      // El electrón baja del nivel 3 al 2 y sale luz (una onda de un solo largo: un color fijo).
      s += `<circle class="kit-electron" cx="${cx}" cy="${n(cy - 31)}" r="3.5" fill="var(--c-f)"/>`;
      s += T.flecha(cx + 6, cy - 30, cx + 6, cy - 22, { grosor: 1.5 });
      s += `<path d="M${cx + 14} ${n(cy - 26)}q3 -5 6 0t6 0t6 0t6 0" fill="none" ${tinta(1.5)}/>`;
      return s;
    }
    if (m.k === 'actual') {
      let s = `<circle cx="${cx}" cy="${n(cy)}" r="3" fill="var(--c-o)"/>`;
      for (let k = 0; k < 70; k++) { const r = RM * Math.pow((k + 0.5) / 70, 0.85), a = k * 2.39996; s += `<circle cx="${n(cx + r * Math.cos(a))}" cy="${n(cy + r * Math.sin(a))}" r="1.4" fill="var(--c-f)" fill-opacity="${n(1 - 0.6 * r / RM)}"/>`; }
      return s;
    }
    return atomo(m.k, cx, cy, RM);
  }
  function modelos(d, corte, top) {
    let s = '';
    for (const [i, m] of MODELOS.entries()) {
      const ve = i + 1 <= corte || !corte, nuevo = corte > 0 && i + 1 === corte ? ' kit-nuevo kit-aparece' : '';
      s += ve ? `<g class="kit-modelo${nuevo}">${mini(m, top)}</g>` : `<circle cx="${m.cx}" cy="${n(top + m.cy)}" r="${RM}" fill="none" ${tinta(1)} stroke-dasharray="3 4" stroke-opacity="0.35"/>`;
    }
    return s;
  }
  function textosModelos(d, corte, top) {
    const out = [];
    for (const [i, m] of MODELOS.entries()) {
      if (corte && i + 1 > corte) continue;
      out.push({ que: 'rotulo', txt: m.nombre, x: m.cx, y: top + m.cy + RM + 20, tam: 14, peso: 700, ancla: 'middle' });
      out.push({ que: 'rotulo', txt: m.anio, x: m.cx, y: top + m.cy + RM + 37, tam: 14, peso: 400, ancla: 'middle' });
    }
    return out;
  }

  // ---------- Armado ----------
  function textos(d, estado) {
    const corte = Math.max(0, estado.corte || 0), top = d.banda === 'retablo' ? BANDA : 0;
    const t = d.banda === 'retablo' ? textosBanda() : [];
    return t.concat(d.vista === 'modelos' ? textosModelos(d, corte, top) : d.vista === 'lamina' ? textosLamina(d, top) : textosZoom(d, top));
  }
  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), top = d.banda === 'retablo' ? BANDA : 0;
    let s = '';
    if (d.banda === 'retablo') s += `<g class="kit-objeto" data-objeto="retablo" data-prueba="si">${retablo()}</g>`;
    s += `<g class="kit-lamina" data-prueba="si">${d.vista === 'modelos' ? modelos(d, corte, top) : d.vista === 'lamina' ? lamina(d, top) : zoom(d, top)}</g>`;
    for (const t of textos(d, estado)) s += T.rotulo(t.x, t.y, t.txt, { ancla: t.ancla, peso: t.peso, tam: t.tam, min: M, max: W - M });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }
  function geometria(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), top = d.banda === 'retablo' ? BANDA : 0;
    const tx = textos(d, estado).map(t => {
      const w = T.ancho(t.txt, t.tam, t.peso), x = T.encajar(t.x, t.txt, t.ancla, { tam: t.tam, peso: t.peso, min: M, max: W - M });
      const x0 = t.ancla === 'middle' ? x - w / 2 : t.ancla === 'end' ? x - w : x;
      return { que: t.que, txt: t.txt, x0, x1: x0 + w, y0: t.y - 0.78 * t.tam, y1: t.y + 0.22 * t.tam };
    });
    const objetos = [], caminos = [];
    if (d.vista === 'zoom' || !d.vista) {
      objetos.push({ que: 'atomo', x0: ZC.cx - ZC.R, x1: ZC.cx + ZC.R, y0: top + ZC.cy - ZC.R, y1: top + ZC.cy + ZC.R });
      for (const a of d.alfas || []) { const c = camino(a, d.modelo, top); caminos.push([c.ini, c.t, c.fin].filter(Boolean)); }
    } else if (d.vista === 'modelos') {
      for (const [i, m] of MODELOS.entries()) objetos.push({ que: 'modelo', x0: m.cx - RM - 2, x1: m.cx + RM + 2, y0: top + m.cy - RM - 2, y1: top + m.cy + RM + 2 });
    } else {
      objetos.push({ que: 'lamina', x0: LM.fx - 4, x1: LM.fx + 4, y0: top + 41, y1: top + 165 });
      objetos.push({ que: 'fuente', x0: 7, x1: 43, y0: top + 85, y1: top + 121 });
    }
    return { W, H: alto(d), M, textos: tx, objetos, caminos };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const NOM = { thomson: 'de Thomson: la carga positiva repartida en todo el átomo, con los electrones metidos adentro', dalton: 'de Dalton: una esfera maciza',
      nuclear: 'nuclear: un núcleo diminuto y positivo al centro, electrones afuera y casi todo vacío (no a escala: el núcleo es unas 100 000 veces menor)', incognita: 'sin dibujar por dentro («?»)' };
    const banda = d.banda === 'retablo' ? 'Un retablo dorado con pan de oro; una lupa agranda una hojita de oro. ' : '';
    if (d.vista === 'modelos') return `${banda}Cinco modelos del átomo, en orden: Dalton (1808), esfera maciza; Thomson (1904), carga positiva repartida con electrones adentro; Rutherford (1911), núcleo diminuto y positivo; Bohr (1913), niveles de energía, y un electrón que baja de nivel y suelta luz; actual (1926), una nube donde es probable hallar al electrón.`;
    if (d.vista === 'lamina') return `${banda}Experimento de la lámina de oro: una fuente lanza alfas contra una hoja de oro muy fina. ${d.resultado ? 'Casi todas pasan derecho, una se desvía mucho y otra rebota hacia atrás.' : 'Lo que pasa detrás de la hoja está sin dibujar («?»).'}`;
    const as = (d.alfas || []).map(a => (a.llega ? `una alfa apunta a ${Kit.formatear(a.b, 1)} radios del centro; qué le pasa está sin dibujar («?»)` : `una alfa apunta a ${Kit.formatear(a.b, 1)} radios del centro y se desvía ${Kit.formatear(a.desvio || 0, 0)}°`));
    return `${banda}Un átomo ${NOM[d.modelo] || ''}. ${as.join('; ')}.`;
  }

  return { id: 'quim-lamina', dibujar, alt, geometria, constantes: { W, M, BANDA, ZC } };
});
