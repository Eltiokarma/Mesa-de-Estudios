/*
 * Pieza propia de Gravitación, etapa 10.
 * Afirmación: las distancias parten de los centros; una órbita elíptica mantiene el astro en un foco.
 * Dibujo de prueba: planeta con continentes esquemáticos y satélite con paneles solares.
 * No calcula física ni respuestas. Posiciones, magnitudes, textos y sectores llegan del contenido.
 * Una escala geométrica para ambos ejes y paneles. Una escala fija por familia de flechas.
 * Colores: solo currentColor y var(--c-*); los objetos son neutros, cada rótulo recibe su color.
 * datos: {vista:{x0,x1,y0,y1}, altoGrafico?, escalas:{F,v,...}, paneles:[...], alt}.
 * Cada panel admite planeta/satelite/orbita y sus plurales; cotas, flechas,
 * trayectoria, sectores, notas y titulo. Todos los puntos son [x,y] del caso.
 * Planeta: {c,R,rotulo?,colorRotulo?}; satélite: {c,tam?,rotulo?,colorRotulo?}.
 * Órbita circular: {r,centro?}; elipse: {a,b,foco?}, con el astro en el foco izquierdo.
 * Flecha: {de,d,familia,color,rotulo?}; cotas: {de,a,texto?,color?,lado?,sep?}.
 * Los rótulos admiten subíndices (_A o _{escape}) y la flecha vectorial combinada.
 * sectores:[{puntos,color}] y trayectoria:[puntos] se trazan literalmente.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (T) {
  'use strict';
  const W = 320, M = 4, P = 20, CABECERA = 32, CARRIL = 34, RENGLON = 24;
  const n = T.n, esc = T.esc, color = T.color;
  const visible = (a, paso) => (a.paso || 0) <= paso && (a.hasta == null || paso <= a.hasta);
  const lista = (p, singular, plural) => [...(p[plural] || []), ...(p[singular] ? [p[singular]] : [])];
  const finito = x => typeof x === 'number' && Number.isFinite(x);
  function punto(x, nombre) {
    if (!Array.isArray(x) || x.length !== 2 || !x.every(finito)) throw new Error(`fis-gravitacion: ${nombre} debe ser [x,y] finito.`);
    return x;
  }
  function datosDe(d, e) {
    if (!Array.isArray(d.cortes) || !d.cortes.length) return d;
    const k = Math.min(d.cortes.length - 1, Math.max(0, Math.round(e.corte || 0)));
    return { ...d, ...d.cortes[k] };
  }
  const caja = (x0, y0, x1, y1, extra = {}) => ({ x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1), ...extra });
  const dentro = (b, limite) => b.x0 >= limite.x0 && b.x1 <= limite.x1 && b.y0 >= limite.y0 && b.y1 <= limite.y1;
  const solapan = (a, b, sep = 0) => a.x0 < b.x1 + sep && b.x0 < a.x1 + sep && a.y0 < b.y1 + sep && b.y0 < a.y1 + sep;

  // Una caja medida corresponde a los mismos tspans que se dibujan, incluidos
  // subíndices y flechas vectoriales. No usamos un carácter '_' visible.
  function tipografia(texto, tam = 14, peso = 600) {
    const t = String(texto), tokens = []; let i = 0, cursor = 0;
    while (i < t.length) {
      if (t[i] === '_' && i + 1 < t.length) {
        let sub, fin;
        if (t[i + 1] === '{') { fin = t.indexOf('}', i + 2); if (fin < 0) throw new Error('fis-gravitacion: subíndice sin cierre.'); sub = t.slice(i + 2, fin); fin++; }
        else { const m = /^[\p{L}\p{N},]+/u.exec(t.slice(i + 1)); if (m) { sub = m[0]; fin = i + 1 + sub.length; } }
        if (sub) {
          const ts = tam * 0.72, ancho = T.ancho(sub, ts, peso);
          tokens.push({ texto: sub, x: cursor, dy: tam * 0.28, tam: ts, ancho, sub: true }); cursor += ancho; i = fin; continue;
        }
      }
      if (t[i] === '⃗' && tokens.length) { tokens[tokens.length - 1].vector = true; i++; continue; }
      const ch = t[i], ancho = T.ancho(ch, tam, peso);
      tokens.push({ texto: ch, x: cursor, dy: 0, tam, ancho }); cursor += ancho; i++;
    }
    return { tokens, ancho: cursor, arriba: tokens.some(t => t.vector) ? tam * 1.24 : tam * 0.82,
      abajo: tokens.some(t => t.sub) ? tam * 0.48 : tam * 0.25 };
  }
  function rotulo(texto, x, y, o = {}) {
    const tam = Math.max(14, o.tam || 14), peso = o.peso || 600, tip = tipografia(texto, tam, peso), ancla = o.ancla || 'start';
    if (tip.ancho > W - 2 * M) throw new Error(`fis-gravitacion: texto demasiado ancho, acórtalo: ${texto}`);
    let x0 = x - (ancla === 'middle' ? tip.ancho / 2 : ancla === 'end' ? tip.ancho : 0);
    x0 = Math.max(M, Math.min(W - M - tip.ancho, x0));
    return caja(x0, y - tip.arriba, x0 + tip.ancho, y + tip.abajo,
      { texto: String(texto), x: x0, y, tam, peso, color: o.color, tip, panel: o.panel, clase: o.clase || 'etiqueta' });
  }
  // Auditoría (26 nov): un tspan con x propio por letra separaba las letras según el ancho estimado
  // («Ref er encia», «Ct r o planet a»). El texto corre solo; los subíndices bajan y suben con dy.
  // Una letra con flecha conserva su x, para que la flecha quede sobre ella.
  function textoSVG(r) {
    const grupos = [];
    for (const t of r.tip.tokens) {
      const g = grupos[grupos.length - 1];
      if (g && !!g.sub === !!t.sub && !t.vector && !g.vector) g.texto += t.texto;
      else grupos.push({ texto: t.texto, sub: t.sub, tam: t.tam, dy: t.dy, x: t.x, vector: t.vector });
    }
    let base = 0;
    const spans = grupos.map((g, i) => {
      const dy = g.dy - base; base = g.dy;
      const pos = i === 0 || g.vector ? ` x="${n(r.x + g.x)}" y="${n(r.y + g.dy)}"` : dy ? ` dy="${n(dy)}"` : '';
      return `<tspan${pos}${g.sub ? ` font-size="${n(g.tam)}"` : ''}>${esc(g.texto)}</tspan>`;
    }).join('');
    let s = `<text class="kit-txt" fill="${color(r.color)}" font-size="${r.tam}" font-weight="${r.peso}" style="font-variant-numeric:tabular-nums">${spans}</text>`;
    for (const t of r.tip.tokens) if (t.vector) {
      const y = r.y + t.dy - r.tam * 0.98, x1 = r.x + t.x, x2 = x1 + Math.max(5, t.ancho);
      s += `<path d="M${n(x1)} ${n(y)}H${n(x2)}M${n(x2 - 3)} ${n(y - 2.5)}L${n(x2)} ${n(y)}L${n(x2 - 3)} ${n(y + 2.5)}" fill="none" stroke="${color(r.color)}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return s;
  }
  // Recorte paramétrico de un segmento contra una caja. Se usa solamente para
  // interrumpir líneas auxiliares detrás de rótulos, nunca para acortar una medida.
  function intervaloCaja(a, b, r, margen = 0) {
    let ini = 0, fin = 1;
    for (const [lo, hi, origen, delta] of [[r.x0 - margen, r.x1 + margen, a[0], b[0] - a[0]], [r.y0 - margen, r.y1 + margen, a[1], b[1] - a[1]]]) {
      if (Math.abs(delta) < 1e-12) { if (origen < lo || origen > hi) return null; }
      else { const p = (lo - origen) / delta, q = (hi - origen) / delta; ini = Math.max(ini, Math.min(p, q)); fin = Math.min(fin, Math.max(p, q)); if (fin <= ini) return null; }
    }
    return fin > ini ? [ini, fin] : null;
  }
  function cortarGuia(segmento, rotulos) {
    let tramos = [[0, 1]];
    for (const r of rotulos) {
      const cruce = intervaloCaja(segmento.de, segmento.a, r, 3);
      if (!cruce) continue;
      tramos = tramos.flatMap(([a, b]) => cruce[1] <= a || cruce[0] >= b ? [[a, b]] :
        [...(cruce[0] > a ? [[a, cruce[0]]] : []), ...(cruce[1] < b ? [[cruce[1], b]] : [])]);
    }
    const p = t => [segmento.de[0] + t * (segmento.a[0] - segmento.de[0]), segmento.de[1] + t * (segmento.a[1] - segmento.de[1])];
    return tramos.filter(([a, b]) => b - a > 1e-6).map(([a, b]) => ({ ...segmento, de: p(a), a: p(b) }));
  }
  function flechaGeom(f, p, d) {
    const base = punto(f.de, 'origen de flecha'), v = punto(f.d, 'vector de flecha');
    const escala = (d.escalas || {})[f.familia];
    if (!finito(escala) || escala <= 0) throw new Error(`fis-gravitacion: falta escala positiva para la familia ${f.familia}.`);
    const largo = Math.hypot(...v) * escala;
    if (!largo) return null;
    const x1 = p.X(base[0]), y1 = p.Y(base[1]), x2 = x1 + v[0] * escala, y2 = y1 - v[1] * escala;
    const ux = (x2 - x1) / largo, uy = (y2 - y1) / largo, l = Math.min(10, largo * 0.4), a = Math.min(4, l * 0.45);
    const punta = [[x2, y2], [x2 - l * ux - a * uy, y2 - l * uy + a * ux], [x2 - l * ux + a * uy, y2 - l * uy - a * ux]];
    return { x1, y1, x2, y2, largo, ux, uy, punta, escala, vector: v.slice(), familia: f.familia, color: f.color, rotulo: f.rotulo, panel: p.indice };
  }
  function geometria(datos = {}, estado = {}) {
    const d = datosDe(datos, estado), vista = d.vista || { x0: -2, x1: 6, y0: -2, y1: 2 };
    if (![vista.x0, vista.x1, vista.y0, vista.y1].every(finito) || vista.x1 <= vista.x0 || vista.y1 <= vista.y0) throw new Error('fis-gravitacion: vista inválida.');
    const altoGrafico = d.altoGrafico == null ? 160 : d.altoGrafico;
    if (!finito(altoGrafico) || altoGrafico < 120 || altoGrafico > 240) throw new Error('fis-gravitacion: altoGrafico debe estar entre 120 y 240.');
    const paneles = d.paneles || [];
    if (!Array.isArray(paneles) || paneles.length > 2) throw new Error('fis-gravitacion: se admiten uno o dos paneles.');
    const escala = Math.min((W - 2 * P) / (vista.x1 - vista.x0), altoGrafico / (vista.y1 - vista.y0));
    const ox = (W - (vista.x1 - vista.x0) * escala) / 2;
    const paso = estado.final ? Infinity : Math.max(0, Number(estado.paso) || 0);
    const g = { W, H: 0, alto: 0, paneles: [], rotulos: [], objetos: [], flechas: [], cotas: [], segmentos: [], orbitas: [], sectores: [], vista: { ...vista }, s: escala };
    let inicio = 4;
    paneles.forEach((panel, indice) => {
      const cotas = panel.cotas || [], notas = panel.notas || [];
      const alto = CABECERA + altoGrafico + cotas.length * CARRIL + notas.length * RENGLON + 14;
      const gy = inicio + CABECERA, oy = gy + (altoGrafico - (vista.y1 - vista.y0) * escala) / 2;
      const p = { indice, inicio, alto, s: escala, x0: M, x1: W - M, y0: inicio, y1: inicio + alto,
        grafico: caja(P, gy, W - P, gy + altoGrafico),
        X: x => ox + (x - vista.x0) * escala, Y: y => oy + (vista.y1 - y) * escala,
        Xi: x => vista.x0 + (x - ox) / escala, Yi: y => vista.y1 - (y - oy) / escala };
      g.paneles.push(p);
      const agregarTexto = r => { g.rotulos.push(r); return r; };
      if (panel.titulo) agregarTexto(rotulo(panel.titulo, 12, inicio + 19, { peso: 700, tam: 16, panel: indice, clase: 'titulo' }));
      notas.forEach((nota, i) => {
        const o = typeof nota === 'string' ? { texto: nota } : nota;
        if (o.texto && visible(o, paso)) agregarTexto(rotulo(o.texto, 12, gy + altoGrafico + cotas.length * CARRIL + 20 + RENGLON * i, { color: o.color, panel: indice, clase: 'nota' }));
      });
      const planetas = lista(panel, 'planeta', 'planetas'), satelites = lista(panel, 'satelite', 'satelites');
      const origenOrbital = planetas[0] ? punto(planetas[0].c, 'centro del planeta') : [0, 0];
      const pendientes = [];
      for (const planeta of planetas) if (visible(planeta, paso)) {
        const c = punto(planeta.c, 'centro del planeta');
        if (!finito(planeta.R) || planeta.R <= 0) throw new Error('fis-gravitacion: el radio del planeta debe ser positivo.');
        const x = p.X(c[0]), y = p.Y(c[1]), r = planeta.R * escala;
        const b = caja(x - r - 1, y - r - 1, x + r + 1, y + r + 1, { tipo: 'planeta', x, y, r, R: planeta.R, c: c.slice(), panel: indice });
        g.objetos.push(b);
        if (planeta.rotulo) pendientes.push({ texto: planeta.rotulo, color: planeta.colorRotulo, origen: b, clase: 'rotulo-objeto' });
      }
      for (const satelite of satelites) if (visible(satelite, paso)) {
        const c = punto(satelite.c, 'posición del satélite'), tam = satelite.tam == null ? 10 : satelite.tam;
        if (!finito(tam) || tam < 8 || tam > 14) throw new Error('fis-gravitacion: tam del satélite debe estar entre 8 y 14 px.');
        const x = p.X(c[0]), y = p.Y(c[1]);
        const b = caja(x - 1.8 * tam - 1, y - tam - 1, x + 1.8 * tam + 1, y + tam + 1, { tipo: 'satelite', x, y, tam, c: c.slice(), panel: indice });
        g.objetos.push(b);
        if (satelite.rotulo) pendientes.push({ texto: satelite.rotulo, color: satelite.colorRotulo, origen: b, clase: 'rotulo-objeto' });
      }
      for (const orbita of lista(panel, 'orbita', 'orbitas')) if (visible(orbita, paso)) {
        const elipse = orbita.a != null || orbita.b != null || panel.modo === 'elipse';
        let centro, a, b, foco;
        if (elipse) {
          a = orbita.a; b = orbita.b; foco = punto(orbita.foco || origenOrbital, 'foco de la elipse');
          if (!finito(a) || !finito(b) || b <= 0 || a < b) throw new Error('fis-gravitacion: la elipse requiere a >= b > 0.');
          centro = [foco[0] + Math.sqrt(a * a - b * b), foco[1]];
        } else {
          a = b = orbita.r;
          if (!finito(a) || a <= 0) throw new Error('fis-gravitacion: radio orbital positivo requerido.');
          centro = punto(orbita.centro || origenOrbital, 'centro orbital');
        }
        const o = { tipo: elipse ? 'elipse' : 'circular', centro: centro.slice(), foco: foco && foco.slice(), x: p.X(centro[0]), y: p.Y(centro[1]), a, b,
          rx: a * escala, ry: b * escala, color: orbita.color || 'i', panel: indice };
        g.orbitas.push(o);
        for (let k = 0; k < 96; k++) {
          const pt = j => [o.x + o.rx * Math.cos(j * Math.PI / 48), o.y - o.ry * Math.sin(j * Math.PI / 48)];
          g.segmentos.push({ de: pt(k), a: pt(k + 1), tipo: 'orbita', panel: indice });
        }
      }
      if (panel.trayectoria) {
        const puntos = panel.trayectoria.map(c => { punto(c, 'punto de trayectoria'); return [p.X(c[0]), p.Y(c[1])]; });
        for (let i = 1; i < puntos.length; i++) g.segmentos.push({ de: puntos[i - 1], a: puntos[i], tipo: 'trayectoria', color: panel.colorTrayectoria || 'i', panel: indice });
      }
      for (const sector of panel.sectores || []) if (visible(sector, paso)) {
        if (!Array.isArray(sector.puntos) || sector.puntos.length < 3) throw new Error('fis-gravitacion: sector requiere al menos tres puntos.');
        const puntos = sector.puntos.map(c => { punto(c, 'vértice del sector'); return [p.X(c[0]), p.Y(c[1])]; });
        g.sectores.push({ puntos, originales: sector.puntos.map(p => p.slice()), color: sector.color || 'i', panel: indice });
      }
      for (const f of panel.flechas || []) if (visible(f, paso)) {
        const a = flechaGeom(f, p, d);
        if (a) {
          g.flechas.push(a);
          if (f.rotulo) pendientes.push({ texto: f.rotulo, color: f.color, origen: caja(a.x1, a.y1, a.x2, a.y2), clase: 'rotulo-flecha' });
        }
      }
      const guias = [];
      cotas.forEach((c, i) => {
        if (!visible(c, paso)) return;
        const de = punto(c.de, 'extremo inicial de cota'), a = punto(c.a, 'extremo final de cota');
        const originalDe = [p.X(de[0]), p.Y(de[1])], originalA = [p.X(a[0]), p.Y(a[1])];
        const dx = originalA[0] - originalDe[0], dy = originalA[1] - originalDe[1], largo = Math.hypot(dx, dy);
        if (largo < 1e-8) throw new Error('fis-gravitacion: una cota necesita extremos distintos.');
        const ux = dx / largo, uy = dy / largo, nx = -uy, ny = ux;
        let q, z, textoX, textoY;
        if (Math.abs(dy) < 1e-8) {
          const y = gy + altoGrafico + 10 + i * CARRIL;
          q = [originalDe[0], y]; z = [originalA[0], y]; textoX = (q[0] + z[0]) / 2; textoY = y + 22;
        } else {
          const lado = c.lado === -1 ? -1 : 1, sep = (c.sep == null ? 22 : c.sep) * lado;
          q = [originalDe[0] + nx * sep, originalDe[1] + ny * sep]; z = [originalA[0] + nx * sep, originalA[1] + ny * sep];
          const tip = tipografia(c.texto || ''), distanciaTexto = 10 + (Math.abs(nx) * tip.ancho + Math.abs(ny) * (tip.arriba + tip.abajo)) / 2;
          textoX = (q[0] + z[0]) / 2 + nx * distanciaTexto * lado;
          textoY = (q[1] + z[1]) / 2 + ny * distanciaTexto * lado + (tip.arriba - tip.abajo) / 2;
        }
        const rot = c.texto ? agregarTexto(rotulo(c.texto, textoX, textoY, { color: c.color || 'i', ancla: 'middle', panel: indice, clase: 'rotulo-cota' })) : null;
        const registro = { originalDe, originalA, de: q, a: z, largo, largoFisico: Math.hypot(a[0] - de[0], a[1] - de[1]),
          ux, uy, nx, ny, color: c.color || 'i', texto: c.texto, rotulo: rot, panel: indice };
        g.cotas.push(registro);
        g.segmentos.push({ de: q, a: z, tipo: 'cota', color: registro.color, panel: indice });
        for (const extremo of [q, z]) g.segmentos.push({ de: [extremo[0] - nx * 4, extremo[1] - ny * 4], a: [extremo[0] + nx * 4, extremo[1] + ny * 4], tipo: 'tope-cota', color: registro.color, panel: indice });
        guias.push({ de: originalDe, a: q, tipo: 'guia', color: registro.color, panel: indice }, { de: originalA, a: z, tipo: 'guia', color: registro.color, panel: indice });
      });
      // Colocación alrededor del objeto: sin superponer texto con cuerpos, ejes,
      // órbitas, flechas ni otros rótulos. No se acorta ninguna flecha para encajar.
      const objetosPanel = g.objetos.filter(o => o.panel === indice);
      const lineasPanel = [...g.segmentos.filter(s => s.panel === indice), ...g.flechas.filter(a => a.panel === indice).map(a => ({ de: [a.x1, a.y1], a: [a.x2, a.y2] }))];
      for (const pendiente of pendientes) {
        const b = pendiente.origen, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
        const candidatos = [];
        for (const sep of [10, 24, 38, 52]) candidatos.push([cx, b.y0 - sep, 'middle'], [cx, b.y1 + sep + 12, 'middle'], [b.x1 + sep, cy + 4, 'start'], [b.x0 - sep, cy + 4, 'end']);
        let elegido;
        for (const [x, y, ancla] of candidatos) {
          const r = rotulo(pendiente.texto, x, y, { color: pendiente.color, ancla, panel: indice, clase: pendiente.clase });
          if (!dentro(r, caja(M, inicio + 3, W - M, inicio + alto - 3))) continue;
          if (objetosPanel.some(b => solapan(r, b, 3)) || g.rotulos.some(b => b.panel === indice && solapan(r, b, 4))) continue;
          if (lineasPanel.some(s => intervaloCaja(s.de, s.a, r, 3))) continue;
          elegido = r; break;
        }
        if (!elegido) throw new Error(`fis-gravitacion: no hay sitio libre para «${pendiente.texto}»; muévelo a notas o amplía la vista.`);
        agregarTexto(elegido);
      }
      for (const guia of guias) g.segmentos.push(...cortarGuia(guia, g.rotulos.filter(r => r.panel === indice)));
      inicio += alto + 8;
    });
    g.H = g.alto = paneles.length ? inicio - 4 : 16;
    return g;
  }
  function planetaSVG(o) {
    const x = o.x, y = o.y, r = o.r;
    const punto = (a, b) => `${n(x + a * r)} ${n(y + b * r)}`;
    // Continentes esquemáticos contenidos en el disco, no un mapa geográfico.
    return `<g data-prueba="planeta-gravitacion"><circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${punto(-0.55, -0.55)}L${punto(-0.12, -0.72)}L${punto(0.06, -0.48)}L${punto(-0.08, -0.2)}L${punto(-0.35, -0.16)}L${punto(-0.4, 0.12)}L${punto(-0.66, -0.07)}Z M${punto(0.18, -0.08)}L${punto(0.54, -0.3)}L${punto(0.73, -0.02)}L${punto(0.54, 0.15)}L${punto(0.42, 0.53)}L${punto(0.22, 0.67)}L${punto(0.07, 0.3)}Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-opacity="0.45" stroke-width="1"/>`
      + `<circle cx="${n(x)}" cy="${n(y)}" r="1.8" fill="currentColor"/></g>`;
  }
  function sateliteSVG(o) {
    const t = o.tam, x = o.x, y = o.y, rect = (dx, dy, w, h) => `<rect x="${n(x + dx * t)}" y="${n(y + dy * t)}" width="${n(w * t)}" height="${n(h * t)}" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.6"/>`;
    let s = rect(-0.5, -0.7, 1, 1.4) + rect(-1.8, -0.8, 1, 1.6) + rect(0.8, -0.8, 1, 1.6);
    for (const lado of [-1, 1]) {
      s += T.linea(x + lado * 0.5 * t, y, x + lado * 0.8 * t, y, { grosor: 1.6 });
      for (const z of [-0.26, 0.26]) s += T.linea(x + lado * 0.8 * t, y + z * t, x + lado * 1.8 * t, y + z * t, { grosor: 0.7 });
      s += T.linea(x + lado * 1.3 * t, y - 0.8 * t, x + lado * 1.3 * t, y + 0.8 * t, { grosor: 0.7 });
    }
    s += T.linea(x, y - 0.7 * t, x, y - t, { grosor: 1.6 });
    return `<g data-prueba="satelite-gravitacion">${s}</g>`;
  }
  function dibujar(datos = {}, estado = {}) {
    const d = datosDe(datos, estado), g = geometria(datos, estado); let s = '';
    for (const q of g.sectores) s += `<path d="M${q.puntos.map(p => p.map(n).join(' ')).join('L')}Z" fill="${color(q.color)}" fill-opacity="0.13" stroke="${color(q.color)}" stroke-width="1"/>`;
    for (const o of g.orbitas) s += `<ellipse cx="${n(o.x)}" cy="${n(o.y)}" rx="${n(o.rx)}" ry="${n(o.ry)}" fill="none" stroke="${color(o.color)}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    for (const l of g.segmentos) if (l.tipo !== 'orbita') s += T.linea(...l.de, ...l.a, { color: l.color, grosor: l.tipo === 'guia' ? 0.8 : 1.4, discontinua: l.tipo === 'guia' || l.tipo === 'trayectoria', opacidad: l.tipo === 'guia' ? 0.55 : 1 });
    for (const o of g.objetos) s += o.tipo === 'planeta' ? planetaSVG(o) : sateliteSVG(o);
    for (const f of g.flechas) {
      const L = Math.hypot(f.punta[1][0] - f.x2, f.punta[1][1] - f.y2) * 0.7;
      s += T.linea(f.x1, f.y1, f.x2 - f.ux * L, f.y2 - f.uy * L, { color: f.color, grosor: 2.4 });
      s += `<path d="M${f.punta.map(p => p.map(n).join(' ')).join('L')}Z" fill="${color(f.color)}" stroke="${color(f.color)}" stroke-width="1" stroke-linejoin="round"/>`;
    }
    for (const r of g.rotulos) s += textoSVG(r);
    return T.svg(W, g.H, s, { alt: d.alt || '' });
  }
  return { id: 'fis-gravitacion', geometria, dibujar, alt: datos => datos.alt || '', controles: () => [] };
});
