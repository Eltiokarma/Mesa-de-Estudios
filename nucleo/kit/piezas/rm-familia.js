/*
 * Pieza «rm-familia» (17 nov 2026): las fotos de la familia de Ana pegadas en un árbol, dibujadas por la sesión como
 * prueba (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4). Sin caras, el mismo árbol con
 * recuadros de nombre (para los caminos de «Así se resuelve», los ejemplos y «Ahora tú»). La usa la idea «Subir y bajar
 * por el árbol» de «Razonamiento deductivo» (contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js).
 *
 * Afirmación de la figura: cada línea une a un padre o una madre (arriba) con un hijo o una hija (abajo). Un parentesco
 * es un camino: se sube a los padres y se baja a los hijos, y se cuentan las líneas. Una persona puede tener dos papeles.
 *
 * Papeles de color (paleta de deducción, fija en la pieza):
 *   quien habla («mi …») ....... naranja (o): su marco y su nombre
 *   la persona pedida .......... violeta (f), solo cuando ya se comprobó; antes va «?» en tinta
 *   el camino, las líneas, los demás ... tinta (el camino, en trazo grueso)
 * Ni verde ni carmín. Quien habla y la pedida también se dicen con palabras (WCAG 1.4.1).
 *
 * datos = {
 *   escena: 'fotos',                    los recuadros llevan una cara dibujada (cara: 'abuelo'|'hombre'|'mujer'|'nina'|'nino')
 *   personas: [{ id, nombre, x, g, cara, incognita }],   x de 0 a 10; g: generación (0 arriba); incognita: «?» en vez del
 *            nombre
 *   lineas: [[padre, hijo], …],
 *   habla: id,                          naranja
 *   pedida: id | { id, desde },         violeta (desde el corte)
 *   elegida: id,                        un marco más grueso: donde está la manija del juego
 *   camino: { ids: [a, b, c, …], desde } | [{ ids, desde }, …]   las líneas que recorre el camino, en trazo grueso
 *   papeles: [{ id, t, lado: 'der'|'izq', desde }],   una palabra al lado de la persona («padre e hijo»)
 *   nota: 'texto' | [{ t, desde, hasta }]
 * }
 * estado = { corte }: se ve lo que tiene desde ≤ corte. El alto no cambia con el estado.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo texto lo trae quien llama.
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
  const W = 320, M = 4, NOTA = 24, F = 36, NOM = 20, GAP_F = 24, BOX = 26, GAP_B = 30;
  const PAPELES = { habla: 'o', pedida: 'f', camino: 'tinta' };
  const n = T.n;
  const ve = (x, corte) => !x || typeof x !== 'object' || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const idDe = x => (x && typeof x === 'object' ? x.id : x);

  function geometria(d) {
    const fotos = d.escena === 'fotos', gens = Math.max(1, ...(d.personas || []).map(p => p.g + 1));
    const paso = fotos ? F + NOM + GAP_F : BOX + GAP_B;
    const X = x => 26 + x * 26.8;
    const Y = g => M + 6 + (fotos ? F / 2 : BOX / 2) + g * paso;
    const fondo = Y(gens - 1) + (fotos ? F / 2 + NOM : BOX / 2) + M + 6;
    return { fotos, gens, paso, X, Y, fondo, alto: Math.ceil(fondo + (d.nota !== undefined ? NOTA : 0)) };
  }
  // Ancho y bordes de cada persona (el recuadro con su nombre, o la foto con el nombre debajo).
  function caja(d, g, p) {
    const t = p.incognita ? '?' : p.nombre, cx = g.X(p.x), cy = g.Y(p.g);
    if (g.fotos) return { cx, cy, w: F, arriba: cy - F / 2, abajo: cy + F / 2 + NOM, t };
    const w = Math.max(40, T.ancho(t, 14, 700) + 16);
    return { cx, cy, w, arriba: cy - BOX / 2, abajo: cy + BOX / 2, t };
  }

  function cara(tipo, cx, cy) {
    // Una cara dentro de la foto: cabeza, hombros y lo que la distingue (sombrero, cabello largo, cola, gorra).
    let s = `<path d="M${n(cx - 12)} ${n(cy + 17)}A12 9 0 0 1 ${n(cx + 12)} ${n(cy + 17)}" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.5"/>`;
    const r = tipo === 'nina' || tipo === 'nino' ? 6.5 : 7.5, hy = cy - 1;
    if (tipo === 'mujer') s += `<path d="M${n(cx - r - 2)} ${n(hy + 9)}L${n(cx - r - 1)} ${n(hy - 2)}A${n(r + 1)} ${n(r + 1)} 0 0 1 ${n(cx + r + 1)} ${n(hy - 2)}L${n(cx + r + 2)} ${n(hy + 9)}Z" fill="currentColor"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(hy)}" r="${n(r)}" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
    if (tipo === 'abuelo') s += `<path d="M${n(cx - 11)} ${n(hy - 5)}L${n(cx + 11)} ${n(hy - 5)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M${n(cx - 6)} ${n(hy - 5)}L${n(cx - 5)} ${n(hy - 12)}L${n(cx + 5)} ${n(hy - 12)}L${n(cx + 6)} ${n(hy - 5)}Z" fill="currentColor"/><path d="M${n(cx - 3.5)} ${n(hy + 3)}L${n(cx + 3.5)} ${n(hy + 3)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    else if (tipo === 'hombre') s += `<path d="M${n(cx - r)} ${n(hy - 1)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(hy - 1)}Z" fill="currentColor"/>`;
    else if (tipo === 'nina') s += `<path d="M${n(cx - r)} ${n(hy - 1)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(hy - 1)}Z" fill="currentColor"/><circle cx="${n(cx + r + 2.5)}" cy="${n(hy - 3)}" r="3" fill="currentColor"/>`;
    else if (tipo === 'nino') s += `<path d="M${n(cx - r)} ${n(hy - 1)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(hy - 1)}Z" fill="currentColor"/><path d="M${n(cx + 1)} ${n(hy - 1.5)}L${n(cx + r + 4)} ${n(hy - 1.5)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, g = geometria(d), P = Object.fromEntries((d.personas || []).map(p => [p.id, p]));
    const cajas = Object.fromEntries((d.personas || []).map(p => [p.id, caja(d, g, p)]));
    const pedida = d.pedida !== undefined && ve(d.pedida, corte) ? idDe(d.pedida) : null;
    // Las líneas del camino que se ven en este corte.
    const tramos = (Array.isArray(d.camino) ? d.camino : d.camino ? [d.camino] : []).filter(c => ve(c, corte));
    const enCamino = new Set();
    for (const c of tramos) for (let i = 1; i < c.ids.length; i++) enCamino.add([c.ids[i - 1], c.ids[i]].sort().join('~'));
    let s = '';
    // Líneas: del borde de abajo del padre (bajo su nombre) a la barra de los hermanos y de ahí a cada hijo.
    for (const [a, b] of d.lineas || []) {
      const A = cajas[a], B = cajas[b];
      if (!A || !B) continue;
      const ym = (A.abajo + B.arriba) / 2, grueso = enCamino.has([a, b].sort().join('~'));
      const est = grueso ? `stroke="currentColor" stroke-width="4" data-camino="si"` : `stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"`;
      s += `<path d="M${n(A.cx)} ${n(A.abajo + 2)}L${n(A.cx)} ${n(ym)}L${n(B.cx)} ${n(ym)}L${n(B.cx)} ${n(B.arriba - 1)}" fill="none" ${est} stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    for (const p of d.personas || []) {
      const c = cajas[p.id], col = p.id === d.habla ? `var(--c-${PAPELES.habla})` : p.id === pedida ? `var(--c-${PAPELES.pedida})` : 'currentColor';
      const tok = p.id === d.habla ? PAPELES.habla : p.id === pedida ? PAPELES.pedida : undefined;
      const gro = p.id === d.habla || p.id === pedida ? 3 : p.id === d.elegida ? 3 : 1.5;
      const marco = `data-persona="${T.esc(p.id)}"${p.id === d.habla ? ' data-papel="habla"' : p.id === pedida ? ' data-papel="pedida"' : ''}`;
      if (g.fotos) {
        s += `<rect data-caja="si" ${marco} x="${n(c.cx - F / 2)}" y="${n(c.cy - F / 2)}" width="${F}" height="${F}" rx="4" fill="var(--card)" stroke="${col}" stroke-width="${gro}"/>`;
        if (!p.incognita) s += cara(p.cara, c.cx, c.cy);
        s += T.rotulo(c.cx, c.cy + F / 2 + 15, c.t, { ancla: 'middle', peso: 700, tam: 14, color: tok, min: M, max: W - M });
      } else {
        s += `<rect data-caja="si" ${marco} x="${n(c.cx - c.w / 2)}" y="${n(c.cy - BOX / 2)}" width="${n(c.w)}" height="${BOX}" rx="6" fill="var(--card)" stroke="${col}" stroke-width="${gro}"/>`;
        s += T.rotulo(c.cx, c.cy + 5, c.t, { ancla: 'middle', peso: 700, tam: 14, color: tok, min: M, max: W - M });
      }
      // La manija: un marco punteado alrededor de la foto (o del recuadro), sin tapar el nombre.
      const altoM = g.fotos ? F : BOX;
      if (p.id === d.elegida) s += `<rect data-caja="si" data-elegida="si" x="${n(c.cx - c.w / 2 - 4)}" y="${n(c.cy - altoM / 2 - 4)}" width="${n(c.w + 8)}" height="${n(altoM + 8)}" rx="7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    }
    for (const x of (d.papeles || []).filter(y => ve(y, corte))) {
      const c = cajas[x.id];
      if (!c) continue;
      const der = x.lado !== 'izq', xx = der ? c.cx + c.w / 2 + 8 : c.cx - c.w / 2 - 8;
      s += T.rotulo(xx, c.cy + 5, x.t, { ancla: der ? 'start' : 'end', tam: 14, min: M, max: W - M });
    }
    if (d.nota !== undefined) {
      const notas = (Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]).filter(x => ve(x, corte));
      const t = notas.length ? notas[notas.length - 1].t : '';
      if (t) s += T.rotulo(W / 2, g.fondo + 14, t, { ancla: 'middle', peso: 700, tam: 14, min: M, max: W - M });
    }
    const cuerpo = g.fotos ? `<g class="kit-objeto" data-objeto="fotos" data-prueba="si">${s}</g>` : s;
    return T.svg(W, g.alto, cuerpo, { alt: alt(d) });
  }

  function alt(d) {
    const P = Object.fromEntries((d.personas || []).map(p => [p.id, p])), nom = id => (P[id] ? (P[id].incognita ? 'una persona por saber' : P[id].nombre) : id);
    const lin = (d.lineas || []).map(([a, b]) => `${nom(a)} es padre o madre de ${nom(b)}`);
    const partes = [`${d.escena === 'fotos' ? 'Fotos de la familia pegadas en un árbol' : 'Árbol de familia'} con ${(d.personas || []).map(p => nom(p.id)).join(', ')}${lin.length ? `: ${lin.join('; ')}` : ''}`];
    if (d.habla) partes.push(`Habla ${nom(d.habla)}`);
    if (d.camino) partes.push(`Camino: ${(Array.isArray(d.camino) ? d.camino : [d.camino]).map(c => c.ids.map(nom).join(', ')).join('; ')}`);
    return partes.join('. ') + '.';
  }

  return { id: 'rm-familia', dibujar, alt, geometria, PAPELES, constantes: { W, F, BOX } };
});
