/*
 * Pieza «rv-soporte» (razonamiento verbal): el texto en su soporte, con quién lo escribe y para quién. Es el objeto
 * reconocible de la primera pantalla en verbal (docs/plan-calidad.md §3, punto 1, regla de Gerson del 17 nov): un aviso
 * clavado en el mural del colegio, un papel pegado en una puerta, un cartel de feria, un folleto, una hoja de cuaderno,
 * un mensaje del grupo de padres o una hoja de simulacro con sus alternativas.
 *
 * Afirmación de la figura: un texto siempre está en algún lugar y alguien lo escribe para alguien; sus oraciones
 * numeradas son lo que una frase cubre (turquesa) o deja fuera (gris).
 *
 * Los marcos (corcho, puerta, cartel, folleto, cuaderno, celular, hoja de examen) son dibujos de prueba
 * (data-prueba="si"): Gerson decide después cuáles se reemplazan (docs/molde-unidad.md §6).
 *
 * datos = {
 *   soporte: 'mural' | 'puerta' | 'cartel' | 'folleto' | 'cuaderno' | 'mensaje' | 'simulacro',
 *   lugar: 'Mural del colegio',        // rótulo de arriba (en el mensaje, el nombre del grupo; en el simulacro, no va)
 *   numero: 12,                        // solo simulacro: «Pregunta 12»
 *   hojas: [{                          // un papel (en el mural, la puerta…) o una sección de la hoja del simulacro
 *     id: 'a1', titulo: 'Aviso de la Dirección', de: 'Dirección', para: 'estudiantes y familias',
 *     oraciones: [{ id: 'o1', t: '…' }],          // numeradas 1, 2, 3… dentro de cada hoja
 *     tabla:  { titulo, cols: ['Año', 'Vende'], filas: [{ id: 'f1', celdas: ['2005', '200 kg'] }], nota },
 *     barras: { titulo, max, unidad, items: [{ id: 'b1', t: 'Antes', v: 12 }], nota },   // los valores los trae quien llama
 *     chica: true,                      // un papel más angosto, a la derecha (el «otro aviso» del mural)
 *     ilustracion: 'balsa',             // dibujo de prueba bajo la firma (la balsa de totora del folleto del muelle)
 *   }],
 *   bandeja: true,                      // solo cuaderno: debajo de la hoja, el resaltador y el lápiz (herramientas del
 *                                       // juego de jerarquía: se arrastran a una oración y vuelven a la bandeja)
 *   pregunta: '…', alternativas: [{ id: 'A', t: '…' }],   // solo simulacro, al pie de la hoja
 *   frase: { etiqueta: 'Frase', t: 'Los útiles de la lista' },   // tarjeta opcional debajo del soporte
 * }
 * estado = {
 *   marcas: { o1: 'i' },     // i turquesa continuo (lo que se cubre: evidencia) · o naranja a trazos (lo que se prueba) ·
 *                            // f violeta punteado (la frase o el tema aceptados). Vale para oraciones, filas, barras,
 *                            // alternativas y la frase ('frase').
 *   tenue:  ['o3'],          // gris, sin raya: lo que la frase deja fuera
 *   tachar: ['B'],           // raya de tinta encima: lo descartado (alternativas del simulacro)
 *   nuevo:  ['o2'],          // se anima al avanzar un paso de «Mira» (el texto no se mueve)
 *   tapar:  ['frase'],       // banda gris que guarda el lugar del renglón sin mostrarlo (la idea, hasta el último paso)
 * }
 * ancla(datos, id, lado) y cercana(datos, punto, ids) sirven al arrastre de la teoría (docs/teoria.md §4b): la manija va
 * sobre el número de la oración (lado 'fin': al final del renglón); enBandeja(datos, punto) dice si se soltó en la bandeja.
 * El alto depende solo de los datos: cambiar el estado nunca mueve el texto. Todo texto mide 14 o más; el cuerpo, 15.
 * Función pura: sin azar, ids ni reloj (el grano del corcho sale del índice). Solo currentColor y var(--c-*)/var(--card).
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
  const W = 320, TAM = 15, LH = 21, NUM = 20, PADH = 12, CAP = 24, MARGEN = 4;
  const COLORES = ['i', 'o', 'f'];
  // Opacidad del texto que queda fuera: la tinta del tema al 65 % sobre la tarjeta da 4,70:1 en claro (#2d2340 sobre
  // #fffaf6) y 6,36:1 en oscuro (#f1ebf7 sobre #2a2135); lo comprueba rv-soporte.test.js. Se lee, pero pesa menos.
  const TENUE = 0.65;
  const RAYA = { i: '', o: ' stroke-dasharray="7 4"', f: ' stroke-dasharray="0.1 6"' };

  // Parte un texto en renglones que caben en `ancho` (la medida del kit). El espacio duro (\u00a0) no se parte:
  // «4.º A» no deja la letra sola en el renglón de abajo.
  function partir(texto, ancho, tam = TAM, peso = 400) {
    const out = []; let r = '';
    for (const p of String(texto || '').split(/[ \t\n]+/).filter(Boolean)) {
      const prueba = r ? `${r} ${p}` : p;
      if (T.ancho(prueba, tam, peso) > ancho && r) { out.push(r); r = p; } else r = prueba;
    }
    if (r) out.push(r);
    return out;
  }

  // Dónde va el papel de cada hoja según el soporte (x y ancho); el simulacro y el mensaje los ponen ellos.
  const PAPEL = {
    mural: (h) => (h.chica ? { x: 54, w: 252 } : { x: 14, w: 292 }),
    puerta: () => ({ x: 30, w: 260 }),
    cartel: () => ({ x: 12, w: 296 }),
    folleto: () => ({ x: 12, w: 290 }),
    cuaderno: () => ({ x: 10, w: 300 }),
    mensaje: () => ({ x: 26, w: 258 }),
    simulacro: () => ({ x: 8, w: 304 }),
  };

  // El contenido de una hoja desde (x, y) con ancho w: título, «De … · Para …», oraciones, tabla o barras.
  // Devuelve { items, alto }: items son renglones { id, tipo, x, y, w, texto, tam, peso } y figuras de tabla y barras.
  function hoja(h, x, w, y0) {
    const items = [];
    let y = y0;
    const tx = x + PADH, tw = w - 2 * PADH;
    if (h.titulo) {
      for (const r of partir(h.titulo, tw, 17, 700)) { items.push({ tipo: 'titulo', x: tx, y: y + 16, w: T.ancho(r, 17, 700), texto: r, tam: 17, peso: 700 }); y += 23; }
    }
    const firma = [h.de ? `De: ${h.de}` : '', h.para ? `Para: ${h.para}` : ''].filter(Boolean).join(' · ');
    if (firma) {
      for (const r of partir(firma, tw, 14)) { items.push({ tipo: 'firma', x: tx, y: y + 14, w: T.ancho(r, 14), texto: r, tam: 14, peso: 400 }); y += 19; }
    }
    if (h.titulo || firma) y += 6;
    if (h.ilustracion === 'balsa') { items.push({ tipo: 'balsa', x: tx, y, w: tw, h: 50 }); y += 56; }
    (h.oraciones || []).forEach((o, k) => {
      const rs = partir(o.t, tw - NUM);
      items.push({ tipo: 'num', id: o.id, x: tx, y: y + 15, w: NUM - 6, texto: `${k + 1}`, tam: 14, peso: 700 });
      for (const r of rs) { items.push({ tipo: 'linea', id: o.id, x: tx + NUM, y: y + 15, w: T.ancho(r, TAM), texto: r, tam: TAM, peso: 400 }); y += LH; }
      y += 3;
    });
    if (h.tabla) {
      const tb = h.tabla;
      y += 6;
      if (tb.titulo) for (const r of partir(tb.titulo, tw, 14, 700)) { items.push({ tipo: 'titulo', x: tx, y: y + 14, w: T.ancho(r, 14, 700), texto: r, tam: 14, peso: 700 }); y += 20; }
      const n = (tb.cols || []).length || 1, cw = tw / n;
      items.push({ tipo: 'tabla-cab', x: tx, y, w: tw, h: 24, cols: tb.cols || [], cw });
      y += 24;
      for (const f of tb.filas || []) { items.push({ tipo: 'tabla-fila', id: f.id, x: tx, y, w: tw, h: 26, celdas: f.celdas || [], cw }); y += 26; }
      if (tb.nota) for (const r of partir(tb.nota, tw, 14)) { items.push({ tipo: 'nota', x: tx, y: y + 16, w: T.ancho(r, 14), texto: r, tam: 14, peso: 400 }); y += 19; }
      y += 4;
    }
    if (h.barras) {
      const b = h.barras, nom = 70, max = b.max || Math.max(1, ...(b.items || []).map(i => i.v));
      y += 6;
      if (b.titulo) for (const r of partir(b.titulo, tw, 14, 700)) { items.push({ tipo: 'titulo', x: tx, y: y + 14, w: T.ancho(r, 14, 700), texto: r, tam: 14, peso: 700 }); y += 20; }
      // La barra más larga deja sitio a su valor: el largo es proporcional al dato desde 0 (escala que empieza en cero).
      const largoMax = tw - nom - 52;
      for (const it of b.items || []) {
        items.push({ tipo: 'barra', id: it.id, x: tx, y, w: tw, h: 28, nombre: it.t, valor: `${it.v}${b.unidad || ''}`, x0: tx + nom, largo: largoMax * it.v / max });
        y += 30;
      }
      if (b.nota) for (const r of partir(b.nota, tw, 14)) { items.push({ tipo: 'nota', x: tx, y: y + 16, w: T.ancho(r, 14), texto: r, tam: 14, peso: 400 }); y += 19; }
      y += 4;
    }
    return { items, alto: y - y0 };
  }

  // Pregunta y alternativas del simulacro, con su burbuja de letra.
  function pie(d, x, w, y0) {
    const items = [];
    let y = y0;
    const tx = x + PADH, tw = w - 2 * PADH;
    if (d.pregunta) {
      y += 4;
      for (const r of partir(d.pregunta, tw, TAM, 700)) { items.push({ tipo: 'pregunta', x: tx, y: y + 15, w: T.ancho(r, TAM, 700), texto: r, tam: TAM, peso: 700 }); y += LH; }
      y += 6;
    }
    for (const a of d.alternativas || []) {
      items.push({ tipo: 'letra', id: a.id, x: tx + 10, y: y + 11, texto: a.id });
      for (const r of partir(a.t, tw - 28)) { items.push({ tipo: 'linea', id: a.id, x: tx + 28, y: y + 15, w: T.ancho(r, TAM), texto: r, tam: TAM, peso: 400 }); y += LH; }
      y += 5;
    }
    return { items, alto: y - y0 };
  }

  // Disposición completa: papeles (o secciones) con sus renglones, el marco del soporte y la frase de abajo.
  function disponer(d) {
    const sop = PAPEL[d.soporte] ? d.soporte : 'mural';
    const papeles = [], items = [];
    let y = MARGEN;
    const rotulo = d.lugar && sop !== 'simulacro' && sop !== 'mensaje' ? { x: 8, y: y + 15, texto: d.lugar } : null;
    if (rotulo) y += CAP;
    const marco = { x: 4, y, w: W - 8, h: 0 };
    if (sop === 'simulacro') {
      const P = PAPEL.simulacro();
      const top = y;
      y += 10;
      items.push({ tipo: 'titulo', x: P.x + PADH, y: y + 15, w: T.ancho('Simulacro · Razonamiento verbal', TAM, 700), texto: 'Simulacro · Razonamiento verbal', tam: TAM, peso: 700 });
      y += 21;
      if (d.numero) { items.push({ tipo: 'firma', x: P.x + PADH, y: y + 14, w: T.ancho(`Pregunta ${d.numero}`, 14), texto: `Pregunta ${d.numero}`, tam: 14, peso: 400 }); y += 19; }
      y += 6;
      const regla = y;
      y += 6;
      for (const h of d.hojas || []) { const c = hoja(h, P.x, P.w, y); items.push(...c.items); y += c.alto + 4; }
      const c = pie(d, P.x, P.w, y);
      items.push(...c.items);
      y += c.alto + 6;
      papeles.push({ x: P.x, y: top, w: P.w, h: y - top, regla });
    } else if (sop === 'mensaje') {
      const top = y;
      y += 44;   // la barra del grupo, dentro del celular
      for (const h of d.hojas || []) {
        const P = PAPEL.mensaje(h), py = y;
        const c = hoja(h, P.x, P.w, py + 8);
        items.push(...c.items);
        papeles.push({ x: P.x, y: py, w: P.w, h: c.alto + 16, burbuja: true });
        y = py + c.alto + 16 + 10;
      }
      y += 8;
      marco.y = top; marco.h = y - top;
    } else {
      const top = y;
      // El mural deja ver el corcho arriba; la puerta, su marco; el cartel, la cuerda y el clavo de donde cuelga.
      y += sop === 'mural' ? 10 : sop === 'puerta' ? 18 : sop === 'cartel' ? 20 : 0;
      for (const [k, h] of (d.hojas || []).entries()) {
        const P = PAPEL[sop](h), py = y;
        let iy = py + 10;
        // El cartel lleva su título en una banda de arriba, más grande.
        if (sop === 'cartel' && h.titulo) {
          const rs = partir(h.titulo, P.w - 2 * PADH, 18, 700);
          rs.forEach((r, j) => items.push({ tipo: 'banda', x: P.x + P.w / 2, y: iy + 18 + j * 24, w: T.ancho(r, 18, 700), texto: r, tam: 18, peso: 700 }));
          papeles.push({ banda: { x: P.x, y: py, w: P.w, h: rs.length * 24 + 16 } });
          iy += rs.length * 24 + 12;
        }
        const c = hoja(sop === 'cartel' ? Object.assign({}, h, { titulo: undefined }) : h, P.x, P.w, iy);
        items.push(...c.items);
        const alto = iy - py + c.alto + 6;
        papeles.push({ x: P.x, y: py, w: P.w, h: alto, k });
        y = py + alto + 10;
      }
      if (sop === 'puerta') y += 44;   // se ve la puerta debajo del papel, con su manija
      marco.y = top; marco.h = y - top;
    }
    // La bandeja del cuaderno: el resaltador a la izquierda y el lápiz a la derecha, cada uno con su nombre debajo.
    let bandeja = null;
    if (d.bandeja && sop === 'cuaderno') {
      bandeja = { y, h: 50, resaltador: { x: 92, y: y + 16 }, lapiz: { x: 228, y: y + 16 } };
      y += 54;
    }
    let frase = null;
    if (d.frase) {
      y += 8;
      const tx = 8 + PADH, tw = W - 16 - 2 * PADH;
      const et = d.frase.etiqueta || 'Frase';
      const rs = partir(`«${d.frase.t}»`, tw - T.ancho(`${et}:`, TAM, 700) - 6);
      frase = { x: 8, y, w: W - 16, h: rs.length * LH + 16, etiqueta: { x: tx, y: y + 8 + 15, texto: `${et}:` }, lineas: [] };
      const ex = tx + T.ancho(`${et}:`, TAM, 700) + 6;
      rs.forEach((r, j) => frase.lineas.push({ tipo: 'linea', id: 'frase', x: ex, y: y + 8 + 15 + j * LH, w: T.ancho(r, TAM), texto: r, tam: TAM, peso: 400 }));
      y += frase.h;
    }
    return { soporte: sop, rotulo, marco, papeles, items, frase, bandeja, alto: Math.ceil(y + MARGEN) };
  }

  // ---------- Dibujo ----------
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;

  // El marco del soporte (debajo de los papeles) y lo que va encima de ellos (chinches, cinta, clavo).
  function marcoSVG(L) {
    const { soporte: sop, marco: m } = L;
    let s = '', encima = '';
    if (sop === 'mural') {
      s += `<rect x="${T.n(m.x)}" y="${T.n(m.y)}" width="${T.n(m.w)}" height="${T.n(m.h)}" rx="6" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.45" stroke-width="4"/>`;
      // Grano del corcho: puntos en una grilla corrida por el índice (sin azar: la pieza es pura).
      let p = '';
      for (let gy = m.y + 9, j = 0; gy < m.y + m.h - 6; gy += 15, j++) for (let gx = m.x + 9, i = 0; gx < m.x + m.w - 6; gx += 17, i++) {
        const dx = ((i * 7 + j * 13) % 9) - 4, dy = ((i * 11 + j * 5) % 7) - 3;
        p += `M${T.n(gx + dx)} ${T.n(gy + dy)}h0.01`;
      }
      s += `<path d="${p}" stroke="currentColor" stroke-opacity="0.22" stroke-width="2.4" stroke-linecap="round"/>`;
      for (const P of L.papeles) if (P.w) {
        const cx = P.x + P.w / 2;
        encima += `<circle cx="${T.n(cx)}" cy="${T.n(P.y + 3)}" r="5.5" fill="currentColor" fill-opacity="0.6"/><circle cx="${T.n(cx - 1.6)}" cy="${T.n(P.y + 1.4)}" r="1.6" fill="var(--card)"/>`;
      }
      return { s: obj('mural', s), encima: obj('chinches', encima) };
    }
    if (sop === 'puerta') {
      s += `<rect x="${T.n(m.x + 10)}" y="${T.n(m.y)}" width="${T.n(m.w - 20)}" height="${T.n(m.h)}" rx="4" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.45" stroke-width="3"/>`;
      s += `<rect x="${T.n(m.x + 22)}" y="${T.n(m.y + 10)}" width="${T.n(m.w - 44)}" height="${T.n(m.h - 20)}" rx="2" fill="none" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"/>`;
      s += `<circle cx="${T.n(m.x + m.w - 18)}" cy="${T.n(m.y + m.h - 16)}" r="4.5" fill="currentColor" fill-opacity="0.45"/>`;
      for (const P of L.papeles) if (P.w) {
        for (const [cx, a] of [[P.x + 18, -24], [P.x + P.w - 18, 24]]) encima += `<rect x="${T.n(cx - 15)}" y="${T.n(P.y - 5)}" width="30" height="10" rx="1" fill="currentColor" fill-opacity="0.16" transform="rotate(${a} ${T.n(cx)} ${T.n(P.y)})"/>`;
      }
      return { s: obj('puerta', s), encima: obj('cinta', encima) };
    }
    if (sop === 'cartel') {
      for (const P of L.papeles) if (P.w) {
        const cx = P.x + P.w / 2;
        encima += `<path d="M${T.n(P.x + 26)} ${T.n(P.y + 2)}L${T.n(cx)} ${T.n(P.y - 14)}L${T.n(P.x + P.w - 26)} ${T.n(P.y + 2)}" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"/><circle cx="${T.n(cx)}" cy="${T.n(P.y - 14)}" r="3" fill="currentColor" fill-opacity="0.7"/>`;
      }
      return { s: '', encima: obj('cuerda', encima) };
    }
    if (sop === 'folleto') {
      for (const P of L.papeles) if (P.w) s += `<rect x="${T.n(P.x + 6)}" y="${T.n(P.y + 6)}" width="${T.n(P.w)}" height="${T.n(P.h)}" rx="6" fill="var(--card)" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>`;
      for (const P of L.papeles) if (P.w) encima += `<line x1="${T.n(P.x + 10)}" y1="${T.n(P.y + P.h - 7)}" x2="${T.n(P.x + P.w - 10)}" y2="${T.n(P.y + P.h - 7)}" stroke="currentColor" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="3 5"/>`;
      return { s: obj('folleto', s), encima: obj('doblez', encima) };
    }
    if (sop === 'mensaje') {
      s += `<rect x="${T.n(m.x + 6)}" y="${T.n(m.y)}" width="${T.n(m.w - 12)}" height="${T.n(m.h)}" rx="22" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.5" stroke-width="3"/>`;
      s += `<line x1="${T.n(m.x + 6)}" y1="${T.n(m.y + 36)}" x2="${T.n(m.x + m.w - 6)}" y2="${T.n(m.y + 36)}" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>`;
      s += `<circle cx="${T.n(m.x + 30)}" cy="${T.n(m.y + 19)}" r="9" fill="currentColor" fill-opacity="0.25"/>`;
      return { s: obj('celular', s), encima: '' };
    }
    if (sop === 'cuaderno') {
      for (const P of L.papeles) if (P.w) {
        let g = '';
        for (let gx = P.x + 12; gx < P.x + P.w; gx += 12) g += `M${T.n(gx)} ${T.n(P.y + 2)}V${T.n(P.y + P.h - 2)}`;
        for (let gy = P.y + 12; gy < P.y + P.h; gy += 12) g += `M${T.n(P.x + 2)} ${T.n(gy)}H${T.n(P.x + P.w - 2)}`;
        encima += `<path d="${g}" stroke="currentColor" stroke-opacity="0.08" stroke-width="1"/>`;
      }
      return { s: '', encima: obj('cuadricula', encima) };
    }
    return { s: '', encima: '' };
  }

  // El cuerpo de la figura (sin la etiqueta <svg>), para que otra pieza lo componga (rv-escalera).
  function cuerpo(d, estado = {}) {
    const L = disponer(d);
    const marcas = estado.marcas || {}, tenue = new Set(estado.tenue || []), tachar = new Set(estado.tachar || []), nuevo = new Set(estado.nuevo || []);
    const tapar = new Set(estado.tapar || []);
    const cl = id => (id && nuevo.has(id) ? ' kit-nuevo kit-aparece' : '');
    const col = id => (COLORES.includes(marcas[id]) ? marcas[id] : null);
    const M = marcoSVG(L);
    let fondo = M.s, tinta = '', encima = '';
    if (L.rotulo) tinta += T.rotulo(L.rotulo.x, L.rotulo.y, L.rotulo.texto, { tam: 14, peso: 700, clase: 'rv-lugar' });
    for (const P of L.papeles) {
      if (P.banda) continue;
      fondo += `<rect x="${T.n(P.x)}" y="${T.n(P.y)}" width="${T.n(P.w)}" height="${T.n(P.h)}" rx="${P.burbuja ? 14 : 6}" fill="var(--card)" stroke="currentColor" stroke-opacity="${L.soporte === 'cartel' ? 0.55 : 0.32}" stroke-width="${L.soporte === 'cartel' ? 2.5 : 2}"/>`;
      if (P.regla) fondo += `<line x1="${T.n(P.x + PADH)}" y1="${T.n(P.regla)}" x2="${T.n(P.x + P.w - PADH)}" y2="${T.n(P.regla)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>`;
    }
    // La banda del título del cartel va encima del rectángulo de su papel.
    for (const P of L.papeles) if (P.banda) fondo += `<rect x="${T.n(P.banda.x + 1)}" y="${T.n(P.banda.y + 1)}" width="${T.n(P.banda.w - 2)}" height="${T.n(P.banda.h - 2)}" rx="5" fill="currentColor" fill-opacity="0.09"/>`;
    if (L.soporte === 'mensaje' && d.lugar) tinta += T.rotulo(L.marco.x + 46, L.marco.y + 24, d.lugar, { tam: 14, peso: 700, max: L.marco.x + L.marco.w - 14 });

    const texto = (it, extra = '') => {
      const largo = it.texto.length > 3 ? ` textLength="${T.n(it.w)}" lengthAdjust="spacing"` : '';
      return `<text class="kit-txt" x="${T.n(it.x)}" y="${T.n(it.y)}" fill="currentColor" font-size="${it.tam}"${it.peso !== 400 ? ` font-weight="${it.peso}"` : ''}${extra}${largo}>${T.esc(it.texto)}</text>`;
    };
    const marca = (it, c) => {
      fondo += `<rect class="rv-marca${cl(it.id)}" x="${T.n(it.x - 2)}" y="${T.n(it.y - 15)}" width="${T.n(it.w + 4)}" height="20" rx="4" fill="${T.color(c)}" fill-opacity="0.14"/>`;
      encima += `<line class="rv-sub${cl(it.id)}" x1="${T.n(it.x)}" y1="${T.n(it.y + 4)}" x2="${T.n(it.x + it.w)}" y2="${T.n(it.y + 4)}" stroke="${T.color(c)}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round"${RAYA[c]}/>`;
    };
    const tacha = it => { encima += `<line class="rv-tacha${cl(it.id)}" x1="${T.n(it.x - 1)}" y1="${T.n(it.y - 5)}" x2="${T.n(it.x + it.w + 1)}" y2="${T.n(it.y - 5)}" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round"/>`; };
    const op = id => (tenue.has(id) || tachar.has(id) ? ` opacity="${TENUE}"` : '');

    for (const it of L.items.concat(L.frase ? L.frase.lineas : [])) {
      if (it.tipo === 'titulo' || it.tipo === 'pregunta') { tinta += texto(it); continue; }
      if (it.tipo === 'firma' || it.tipo === 'nota') { tinta += texto(it, ' opacity="0.8"'); continue; }
      if (it.tipo === 'banda') { tinta += `<text class="kit-txt" x="${T.n(it.x)}" y="${T.n(it.y)}" fill="currentColor" font-size="18" font-weight="700" text-anchor="middle">${T.esc(it.texto)}</text>`; continue; }
      if (it.tipo === 'num') { tinta += `<text class="kit-num" x="${T.n(it.x)}" y="${T.n(it.y)}" fill="currentColor" font-size="14" font-weight="700" opacity="0.72">${T.esc(it.texto)}</text>`; continue; }
      if (it.tipo === 'letra') {
        const c = col(it.id);
        fondo += `<circle cx="${T.n(it.x)}" cy="${T.n(it.y)}" r="10" fill="${c ? T.color(c) : 'none'}" fill-opacity="${c ? 0.16 : 0}" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"${c ? RAYA[c] : ''} stroke-linecap="round"/>`;
        tinta += `<text class="kit-txt" x="${T.n(it.x)}" y="${T.n(it.y + 5)}" fill="currentColor" font-size="14" font-weight="700" text-anchor="middle"${op(it.id)}>${T.esc(it.texto)}</text>`;
        continue;
      }
      if (it.tipo === 'balsa') { fondo += balsa(it); continue; }
      if (it.tipo === 'linea' && tapar.has(it.id)) {
        encima += `<rect class="rv-tapa${cl(it.id)}" x="${T.n(it.x - 2)}" y="${T.n(it.y - 14)}" width="${T.n(it.w + 4)}" height="18" rx="4" fill="currentColor" fill-opacity="0.16"/>`;
        continue;
      }
      if (it.tipo === 'linea') {
        const c = col(it.id);
        if (c) marca(it, c);
        tinta += texto(it, op(it.id));
        if (tachar.has(it.id)) tacha(it);
        continue;
      }
      if (it.tipo === 'tabla-cab') {
        it.cols.forEach((t, k) => { tinta += `<text class="kit-txt" x="${T.n(it.x + k * it.cw + 6)}" y="${T.n(it.y + 17)}" fill="currentColor" font-size="14" font-weight="700" opacity="0.8">${T.esc(t)}</text>`; });
        fondo += `<line x1="${T.n(it.x)}" y1="${T.n(it.y + it.h)}" x2="${T.n(it.x + it.w)}" y2="${T.n(it.y + it.h)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>`;
        continue;
      }
      if (it.tipo === 'tabla-fila') {
        const c = col(it.id);
        if (c) fondo += `<rect class="rv-marca${cl(it.id)}" x="${T.n(it.x - 2)}" y="${T.n(it.y + 2)}" width="${T.n(it.w + 4)}" height="${T.n(it.h - 3)}" rx="4" fill="${T.color(c)}" fill-opacity="0.14" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"${RAYA[c]} stroke-linecap="round"/>`;
        it.celdas.forEach((t, k) => { tinta += `<text class="kit-txt" x="${T.n(it.x + k * it.cw + 6)}" y="${T.n(it.y + 18)}" fill="currentColor" font-size="${TAM}" style="font-variant-numeric:tabular-nums"${op(it.id)}>${T.esc(t)}</text>`; });
        fondo += `<line x1="${T.n(it.x)}" y1="${T.n(it.y + it.h)}" x2="${T.n(it.x + it.w)}" y2="${T.n(it.y + it.h)}" stroke="currentColor" stroke-opacity="0.18" stroke-width="1"/>`;
        continue;
      }
      if (it.tipo === 'barra') {
        const c = col(it.id);
        tinta += `<text class="kit-txt" x="${T.n(it.x)}" y="${T.n(it.y + 19)}" fill="currentColor" font-size="14"${op(it.id)}>${T.esc(it.nombre)}</text>`;
        fondo += `<rect class="${c ? `rv-marca${cl(it.id)}` : 'rv-barra'}" x="${T.n(it.x0)}" y="${T.n(it.y + 5)}" width="${T.n(Math.max(2, it.largo))}" height="18" rx="3" fill="${T.color(c)}" fill-opacity="${c ? 0.4 : 0.22}" stroke="${T.color(c)}" stroke-opacity="${c ? 1 : 0.5}" stroke-width="${T.GROSOR.contorno}"${c ? RAYA[c] : ''} stroke-linecap="round"/>`;
        tinta += `<text class="kit-txt" x="${T.n(it.x0 + Math.max(2, it.largo) + 6)}" y="${T.n(it.y + 19)}" fill="currentColor" font-size="${TAM}" font-weight="700" style="font-variant-numeric:tabular-nums"${op(it.id)}>${T.esc(it.valor)}</text>`;
        continue;
      }
    }
    if (L.frase) {
      const F = L.frase, c = col('frase') || 'o';
      fondo += `<rect class="rv-frase${cl('frase')}" x="${T.n(F.x)}" y="${T.n(F.y)}" width="${T.n(F.w)}" height="${T.n(F.h)}" rx="10" fill="var(--card)" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"${RAYA[c]} stroke-linecap="round"/>`;
      tinta += T.rotulo(F.etiqueta.x, F.etiqueta.y, F.etiqueta.texto, { tam: TAM, peso: 700, color: c });
    }
    if (L.bandeja) tinta += bandejaSVG(L.bandeja);
    return { s: fondo + tinta + M.encima + encima, alto: L.alto };
  }

  // La balsa de totora del folleto (dibujo de prueba): casco de haces con la proa y la popa levantadas, sobre el agua.
  function balsa(it) {
    const cx = it.x + it.w / 2, y = it.y, P = (dx, dy) => `${T.n(cx + dx)} ${T.n(y + dy)}`;
    let s = `<path d="M${P(-86, 14)}Q${P(-80, 38)} ${P(-44, 38)}L${P(44, 38)}Q${P(80, 38)} ${P(86, 14)}Q${P(74, 28)} ${P(44, 29)}L${P(-44, 29)}Q${P(-74, 28)} ${P(-86, 14)}Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-opacity="0.6" stroke-width="2" stroke-linejoin="round"/>`;
    // Los haces de totora: tres líneas a lo largo del casco y las amarras.
    s += `<path d="M${P(-70, 30)}Q${P(0, 36)} ${P(70, 30)}M${P(-62, 34)}Q${P(0, 39)} ${P(62, 34)}`;
    for (const dx of [-40, -14, 14, 40]) s += `M${P(dx, 29)}L${P(dx, 38)}`;
    s += `" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5" stroke-linecap="round"/>`;
    // La cabeza de puma de la proa y el agua.
    s += `<circle cx="${T.n(cx + 86)}" cy="${T.n(y + 11)}" r="4" fill="currentColor" fill-opacity="0.55"/>`;
    let w = `M${P(-110, 46)}`;
    for (let k = 0; k < 8; k++) w += `q${T.n(7)} -4 ${T.n(14)} 0q7 4 14 0`;
    s += `<path d="${w}" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-linecap="round"/>`;
    return obj('balsa', s);
  }

  // La bandeja del cuaderno: resaltador y lápiz (dibujos de prueba) con su nombre debajo.
  function bandejaSVG(B) {
    const r = B.resaltador, l = B.lapiz;
    let s = `<rect x="${T.n(r.x - 34)}" y="${T.n(r.y - 8)}" width="56" height="16" rx="4" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.55" stroke-width="2"/>`;
    s += `<path d="M${T.n(r.x + 22)} ${T.n(r.y - 6)}L${T.n(r.x + 34)} ${T.n(r.y - 3)}L${T.n(r.x + 34)} ${T.n(r.y + 3)}L${T.n(r.x + 22)} ${T.n(r.y + 6)}Z" fill="currentColor" fill-opacity="0.45"/>`;
    s += `<rect x="${T.n(l.x - 34)}" y="${T.n(l.y - 6)}" width="54" height="12" rx="2" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-opacity="0.55" stroke-width="2"/>`;
    s += `<path d="M${T.n(l.x + 20)} ${T.n(l.y - 6)}L${T.n(l.x + 34)} ${T.n(l.y)}L${T.n(l.x + 20)} ${T.n(l.y + 6)}Z" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<circle cx="${T.n(l.x + 31)}" cy="${T.n(l.y)}" r="1.8" fill="currentColor"/>`;
    s += `<rect x="${T.n(l.x - 42)}" y="${T.n(l.y - 6)}" width="8" height="12" rx="2" fill="currentColor" fill-opacity="0.3"/>`;
    let t = T.rotulo(r.x, r.y + 30, 'resaltador', { tam: 14, ancla: 'middle' });
    t += T.rotulo(l.x, l.y + 30, 'lápiz', { tam: 14, ancla: 'middle' });
    return obj('bandeja', s) + t;
  }
  function dibujar(d, estado = {}) {
    const c = cuerpo(d, estado);
    return T.svg(W, c.alto, c.s, { alt: alt(d), clase: 'rv-soporte' });
  }

  // El texto alternativo es el texto entero, con su soporte, quién lo escribe y para quién.
  const NOMBRE = { mural: 'Mural', puerta: 'Papel pegado en una puerta', cartel: 'Cartel', folleto: 'Folleto', cuaderno: 'Hoja de cuaderno', mensaje: 'Mensaje de celular', simulacro: 'Hoja de simulacro' };
  function alt(d) {
    const sop = NOMBRE[d.soporte] ? d.soporte : 'mural';
    const hs = (d.hojas || []).map(h => {
      const cab = [h.titulo, h.de ? `de ${h.de}` : '', h.para ? `para ${h.para}` : ''].filter(Boolean).join(', ');
      const ors = (h.oraciones || []).map((o, k) => `${k + 1}. ${o.t}`).join(' ');
      const tb = h.tabla ? ` Tabla${h.tabla.titulo ? ` «${h.tabla.titulo}»` : ''}: ${(h.tabla.cols || []).join(', ')}; ${(h.tabla.filas || []).map(f => f.celdas.join(', ')).join('; ')}.` : '';
      const br = h.barras ? ` Gráfico de barras${h.barras.titulo ? ` «${h.barras.titulo}»` : ''}: ${(h.barras.items || []).map(i => `${i.t}, ${i.v}${h.barras.unidad || ''}`).join('; ')}.` : '';
      return `${cab ? `${cab}: ` : ''}${h.ilustracion === 'balsa' ? '(Dibujo de una balsa de totora.) ' : ''}${ors}${tb}${br}`;
    });
    const alts = (d.alternativas || []).map(a => `${a.id}) ${a.t}`).join(' ');
    return `${NOMBRE[sop]}${d.lugar ? ` (${d.lugar})` : ''}. ${hs.join(' · ')}${d.pregunta ? ` Pregunta: ${d.pregunta}` : ''}${alts ? ` ${alts}` : ''}${d.frase ? ` ${d.frase.etiqueta || 'Frase'}: «${d.frase.t}».` : ''}${d.bandeja && sop === 'cuaderno' ? ' Debajo de la hoja, un resaltador y un lápiz.' : ''}`;
  }

  // Para el arrastre: la manija va sobre el número de la oración (o la letra de la alternativa); con lado 'fin', al final
  // del renglón, para que dos manijas en la misma oración no se tapen.
  function ancla(d, id, lado) {
    const L = disponer(d);
    const it = L.items.find(i => i.id === id && (i.tipo === 'num' || i.tipo === 'letra'));
    if (!it) return null;
    if (lado === 'fin') return { x: W - 18, y: it.tipo === 'num' ? it.y - 5 : it.y };
    return it.tipo === 'num' ? { x: it.x + 4, y: it.y - 5 } : { x: it.x, y: it.y };
  }
  // La oración (de ids) cuyo bloque de renglones queda más cerca del punto, en vertical.
  function cercana(d, punto, ids) {
    const L = disponer(d);
    let mejor = ids[0], dm = Infinity;
    for (const id of ids) {
      const rs = L.items.filter(i => i.id === id && (i.tipo === 'linea' || i.tipo === 'letra'));
      if (!rs.length) continue;
      const arriba = Math.min(...rs.map(r => r.y - 15)), abajo = Math.max(...rs.map(r => r.y + 5));
      const dist = punto.y < arriba ? arriba - punto.y : punto.y > abajo ? punto.y - abajo : 0;
      if (dist < dm) { dm = dist; mejor = id; }
    }
    return mejor;
  }
  const enBandeja = (d, punto) => { const B = disponer(d).bandeja; return !!B && punto.y >= B.y - 2; };

  return { id: 'rv-soporte', dibujar, cuerpo, alt, disponer, partir, ancla, cercana, enBandeja, constantes: { W, TAM, LH, TENUE } };
});
