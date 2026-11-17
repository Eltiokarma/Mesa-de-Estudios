/*
 * Pieza «rm-casos» (17 nov 2026): la calle frente al colegio, dibujada por la sesión como prueba (data-prueba; Gerson
 * decide después cuáles reemplaza, docs/plan-calidad.md M4), con la tabla de casos al lado. La usa la idea «Si llueve, la
 * pista se moja» de «Razonamiento deductivo» (contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js).
 *
 * Afirmación de la figura: antes de saber nada pueden pasar cuatro cosas (llueve o no, y la pista queda mojada o seca);
 * cada una es una fila. La regla «si llueve, la pista se moja» tacha una sola fila; cada dato tacha las que no lo cumplen.
 * Lo que vale en todas las filas que quedan es lo que se puede asegurar. La cisterna está en la calle porque también moja
 * la pista: por eso «mojada» no dice si llovió.
 *
 * Papeles de color (paleta de deducción, fija en la pieza):
 *   primero (p, la lluvia) ........... naranja (o), en su columna, en las gotas y en lo que se sabe de la lluvia
 *   segundo (q, la pista mojada) ..... turquesa (i), en su columna, en los charcos y en lo que se sabe de la pista
 *   tercero (r, si hay) y lo que amarra (la regla, la cisterna, los números de caso) ... tinta
 *   fila que se concluye ............. violeta (f): su ✓ y su marco, solo cuando queda una sola
 *   fila tachada ..................... gris: tinta al 55 %, con una raya y la palabra de quién la tacha (regla o dato)
 * Ni verde ni carmín. Tachar va con raya y palabra, no solo con color (WCAG 1.4.1).
 *
 * datos = {
 *   escena: 'calle',                         la calle (arriba); calle: { lluvia: true|false|null, pista: true|false|null }
 *                                            (null: no se sabe, con «?»)
 *   regla: 'Regla: si llueve, la pista se moja.'   una línea bajo la escena (opcional)
 *   tablas: [{ titulo, vars: [{ t, papel: 'primero'|'segundo'|'tercero', si, no }],
 *              filas: [{ v: [true, false, …], fuera: 'regla'|'dato'|false, desde, seguro: true|n }] }]   1 o 2 lado a lado
 *            fuera: quién tacha la fila (desde el corte desde); seguro: la fila que queda sola (desde el corte n)
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
  const W = 320, M = 4, TENUE = 0.55, ESC = 116, RH = 28, HC = 28, NOTA = 24, REGLA = 24;
  const PAPELES = { primero: 'o', segundo: 'i', tercero: 'tinta', seguro: 'f', descartado: 'tenue' };
  const n = T.n;
  const ve = (x, corte) => !x || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const tok = p => (p === 'primero' ? PAPELES.primero : p === 'segundo' ? PAPELES.segundo : undefined);
  const tinta = (g = 2) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round"`;

  // ---------- La calle ----------
  function nube(cx, cy) {
    return `<path d="M${n(cx - 26)} ${n(cy + 10)}A10 10 0 0 1 ${n(cx - 18)} ${n(cy - 6)}A14 14 0 0 1 ${n(cx + 6)} ${n(cy - 12)}A12 12 0 0 1 ${n(cx + 26)} ${n(cy)}A9 9 0 0 1 ${n(cx + 24)} ${n(cy + 10)}Z" fill="var(--card)" ${tinta().replace('fill="none" ', '')}/>`;
  }
  function sol(cx, cy) {
    let s = `<circle cx="${n(cx)}" cy="${n(cy)}" r="9" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; s += `<line x1="${n(cx + 13 * Math.cos(a))}" y1="${n(cy + 13 * Math.sin(a))}" x2="${n(cx + 18 * Math.cos(a))}" y2="${n(cy + 18 * Math.sin(a))}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`; }
    return s;
  }
  function cisterna(x, y) {
    // Camión cisterna estacionado: cabina, tanque con su nombre y dos ruedas (y = suelo).
    let s = `<rect data-caja="si" x="${n(x)}" y="${n(y - 34)}" width="72" height="24" rx="11" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2"/>`;
    s += T.rotulo(x + 36, y - 17, 'cisterna', { ancla: 'middle', tam: 14 });
    s += `<rect x="${n(x + 74)}" y="${n(y - 30)}" width="22" height="20" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="${n(x + 80)}" y="${n(y - 26)}" width="12" height="7" rx="1.5" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<line x1="${n(x + 2)}" y1="${n(y - 10)}" x2="${n(x + 96)}" y2="${n(y - 10)}" ${tinta()}/>`;
    for (const dx of [16, 84]) s += `<circle cx="${n(x + dx)}" cy="${n(y - 6)}" r="6" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    return s;
  }
  function calle(d) {
    const c = d.calle || {};
    let s = T.rotulo(M + 4, 18, 'Calle del colegio', { peso: 700, tam: 14 });
    // El cielo: nube con gotas (llueve), sol (no llueve) o nube con «?» (no se sabe).
    if (c.lluvia === false) s += sol(46, 50);
    else s += nube(46, 42);
    if (c.lluvia === true) for (const [x, y] of [[30, 60], [42, 66], [54, 60], [66, 66], [36, 74], [60, 74]]) s += `<line data-gota="si" x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 6}" stroke="var(--c-${PAPELES.primero})" stroke-width="2.5" stroke-linecap="round"/>`;
    const tLluvia = c.lluvia === true ? 'llueve' : c.lluvia === false ? 'no llueve' : '¿llueve?';
    s += T.rotulo(80, 50, tLluvia, { tam: 14, peso: 700, color: c.lluvia === null || c.lluvia === undefined ? undefined : PAPELES.primero });
    s += cisterna(196, 84);
    // La pista: gris tenue; con charcos si está mojada.
    s += `<rect data-caja="si" x="${M + 2}" y="88" width="${W - 2 * M - 4}" height="22" rx="4" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-opacity="0.45" stroke-width="1"/>`;
    if (c.pista === true) for (const [x, rx] of [[150, 16], [214, 22], [280, 14]]) s += `<ellipse data-charco="si" cx="${x}" cy="99" rx="${rx}" ry="4.5" fill="var(--c-${PAPELES.segundo})" fill-opacity="0.35" stroke="var(--c-${PAPELES.segundo})" stroke-width="1.5"/>`;
    const tPista = c.pista === true ? 'pista mojada' : c.pista === false ? 'pista seca' : 'pista: ¿mojada o seca?';
    s += T.rotulo(M + 10, 104, tPista, { tam: 14, peso: 700, color: c.pista === null || c.pista === undefined ? undefined : PAPELES.segundo });
    return `<g class="kit-objeto" data-objeto="calle" data-prueba="si">${s}</g>`;
  }

  // ---------- La tabla de casos ----------
  function geometria(d) {
    const tablas = d.tablas || [], k = Math.max(1, tablas.length), yE = d.escena ? ESC : 0, yR = yE + (d.regla ? REGLA : 0);
    const ancho = k === 1 ? W - 2 * M : (W - 2 * M - 8) / 2;
    const titulo = tablas.some(t => t.titulo) ? 22 : 0;
    const nf = Math.max(0, ...tablas.map(t => t.filas.length));
    const alto = titulo + HC + nf * RH;
    return { k, ancho, titulo, yE, yR, y0: yR + M, alto, total: yR + M + alto + M + 2, x0: i => M + i * (ancho + 8) };
  }
  function tabla(d, g, i, corte) {
    const t = d.tablas[i], x0 = g.x0(i), y0 = g.y0, nv = t.vars.length;
    const cN = g.k === 1 ? 30 : 6, cE = g.k === 1 ? 62 : 24, cv = (g.ancho - cN - cE) / nv;
    const yH = y0 + g.titulo, yF = yH + HC;
    let s = '';
    if (t.titulo) s += T.rotulo(x0 + g.ancho / 2, y0 + 16, t.titulo, { ancla: 'middle', peso: 700, tam: 14, min: x0, max: x0 + g.ancho });
    if (g.k === 1) s += T.rotulo(x0 + cN / 2, yH + 19, 'Caso', { ancla: 'middle', tam: 14, min: x0, max: x0 + cN + 6 });
    t.vars.forEach((v, j) => { s += T.rotulo(x0 + cN + (j + 0.5) * cv, yH + 19, v.t, { ancla: 'middle', peso: 700, tam: 14, color: tok(v.papel), min: x0 + cN + j * cv + 1, max: x0 + cN + (j + 1) * cv - 1 }); });
    s += `<line x1="${n(x0 + 2)}" y1="${n(yF)}" x2="${n(x0 + g.ancho - 2)}" y2="${n(yF)}" stroke="currentColor" stroke-width="1.5"/>`;
    t.filas.forEach((f, r) => {
      const y = yF + r * RH, fuera = !!f.fuera && corte >= (f.desde || 0);
      const seguro = f.seguro === true || (typeof f.seguro === 'number' && corte >= f.seguro);
      let fila = `<rect data-caja="si" x="${n(x0 + 2)}" y="${n(y + 1)}" width="${n(g.ancho - 4)}" height="${RH - 2}" rx="4" fill="var(--card)" stroke="currentColor" stroke-opacity="0.25" stroke-width="1"/>`;
      if (g.k === 1) fila += T.rotulo(x0 + cN / 2, y + 19, String(r + 1), { ancla: 'middle', tam: 14 });
      t.vars.forEach((v, j) => { fila += T.rotulo(x0 + cN + (j + 0.5) * cv, y + 19, f.v[j] ? v.si : v.no, { ancla: 'middle', tam: 14, color: tok(v.papel), min: x0 + cN + j * cv + 1, max: x0 + cN + (j + 1) * cv - 1 }); });
      const xe = x0 + g.ancho - cE / 2;
      if (fuera) {
        fila += `<line data-caja="si" data-raya="si" x1="${n(x0 + cN + 6)}" y1="${n(y + RH / 2)}" x2="${n(x0 + g.ancho - cE - 4)}" y2="${n(y + RH / 2)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
        if (g.k === 1) fila += T.rotulo(xe, y + 19, f.fuera === 'regla' ? 'regla' : 'dato', { ancla: 'middle', tam: 14 });
        else fila += `<line x1="${n(xe - 5)}" y1="${n(y + 9)}" x2="${n(xe + 5)}" y2="${n(y + 19)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="${n(xe + 5)}" y1="${n(y + 9)}" x2="${n(xe - 5)}" y2="${n(y + 19)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
        s += `<g data-fila="fuera" opacity="${TENUE}">${fila}</g>`;
      } else {
        if (seguro) {
          fila += `<rect data-caja="si" data-marca="fila-segura" x="${n(x0 + 2)}" y="${n(y)}" width="${n(g.ancho - 4)}" height="${RH}" rx="5" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="2.5"/>`;
          fila += `<path data-marca="si" d="M${n(xe - 7)} ${n(y + 14)}L${n(xe - 2)} ${n(y + 20)}L${n(xe + 8)} ${n(y + 7)}" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        s += `<g data-fila="queda">${fila}</g>`;
      }
    });
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, g = geometria(d);
    let s = d.escena === 'calle' ? calle(d) : '';
    if (d.regla) s += T.rotulo(M + 4, g.yE + 17, d.regla, { tam: 14, peso: 700, min: M, max: W - M });
    (d.tablas || []).forEach((_, i) => { s += tabla(d, g, i, corte); });
    let alto = g.total;
    if (d.nota !== undefined) {
      const notas = (Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]).filter(x => ve(x, corte));
      const t = notas.length ? notas[notas.length - 1].t : '';
      if (t) s += T.rotulo(W / 2, alto + 14, t, { ancla: 'middle', peso: 700, tam: 14, min: M, max: W - M });
      alto += NOTA;
    }
    return T.svg(W, Math.ceil(alto), s, { alt: alt(d) });
  }

  function alt(d) {
    const partes = [];
    if (d.escena === 'calle') {
      const c = d.calle || {};
      partes.push(`Calle del colegio con un camión cisterna estacionado; ${c.lluvia === true ? 'llueve' : c.lluvia === false ? 'no llueve' : 'no se sabe si llueve'} y ${c.pista === true ? 'la pista está mojada' : c.pista === false ? 'la pista está seca' : 'no se sabe si la pista está mojada'}`);
    }
    if (d.regla) partes.push(d.regla.replace(/\.$/, ''));
    for (const t of d.tablas || []) {
      const filas = t.filas.map((f, r) => `caso ${r + 1}: ${t.vars.map((v, j) => (f.v[j] ? v.si : v.no)).join(', ')}${f.fuera ? `, lo tacha ${f.fuera === 'regla' ? 'la regla' : 'el dato'}` : ''}`);
      partes.push(`${t.titulo ? t.titulo + '. ' : ''}Tabla de ${t.filas.length} casos: ${filas.join('; ')}`);
    }
    return partes.join('. ') + '.';
  }

  return { id: 'rm-casos', dibujar, alt, geometria, PAPELES, constantes: { W, TENUE, ESC, RH } };
});
