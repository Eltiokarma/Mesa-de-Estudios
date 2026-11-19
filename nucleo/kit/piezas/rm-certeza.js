/*
 * Pieza «rm-certeza» (19 nov 2026): los objetos de «Certezas» dibujados por la sesión como prueba (data-prueba; Gerson
 * decide después cuáles reemplaza), para contar cuántas extracciones hacen falta para estar seguro. La usa
 * contenido/teoria/razonamiento-matematico/certezas.js.
 *
 * Afirmación de la figura: estar seguro es que la meta se cumpla salga lo que salga. Se ve el recipiente con lo que
 * queda, lo que ya salió (en el orden de la peor suerte) y cuál es la extracción que obliga a cumplir la meta.
 *
 * Escenas:
 *   'recipiente'  una tómbola, un cajón, un bingo o una mesa con objetos (bolitas con la letra de su color, fichas o
 *                 cartas con su número, guantes izquierdos y derechos). Lo que salió va abajo, en «Salieron» (o se
 *                 marca en su lugar, con enSuLugar).
 *   'casilleros'  un calendario (o cajas) en la pared: cada casillero con las personas u objetos que caen en él.
 *   'llaves'      llaves (filas) y candados (columnas): cada prueba que falla, lo que se deduce sin probar.
 *
 * Papeles de color (la paleta de la rama «Lógica», sin verde ni carmín; quien llama dice el papel, no el color):
 *   peor ...... naranja (o): lo que se supone que sale con la peor suerte, sin cumplir la meta (la prueba que falla)
 *   obliga .... turquesa (i): lo que sale de ahí: la extracción que obliga a cumplir la meta (lo que se deduce)
 *   seguro .... violeta (f): lo seguro, ya comprobado (el total; solo al resolver)
 *   descartado  gris: una suerte que no es la peor, tachada (tinta al 70 % y su raya)
 *   amarra .... tinta: el recipiente, los objetos que quedan, sus letras y números, la meta
 * PAPELES lo exporta para las pruebas de la unidad.
 *
 * datos = {
 *   escena: 'recipiente' | 'casilleros' | 'llaves',
 *   meta: 'texto'                      una línea arriba, en tinta («Meta: 2 rojas, con certeza»)
 *   recipiente: 'tombola' | 'cajon' | 'bingo' | 'mesa', titulo: 'texto'      (escena recipiente)
 *   objetos: [{ forma: 'bola' | 'ficha' | 'carta' | 'guante', t: 'R' | '7' | 'I', relleno: 0 | 1, grupo, papel, desde }]
 *            todo lo que había al empezar, en su orden (los de un mismo grupo van juntos; con dos, unidos por una raya)
 *   enSuLugar: true                    lo que salió se marca en su lugar (con su papel) y no baja a «Salieron»
 *   salieron: [i, …] | [{ i, papel, desde }]   índices de los objetos que salieron, en orden (se ven abajo)
 *   reserva: n                         lugares que se guardan en «Salieron» (para que el alto no cambie al jugar)
 *   cuenta: [{ t, papel, desde }]      una línea de cuentas al final («8 sin cumplir», «+ 1»)
 *   casilleros: [{ t, n, papel, desde, papeles: [p, …] }], columnas: 4, tituloCal: 'texto', unidad: 'alumno'
 *   llaves: n, candados: m (si no, tantos como llaves), filas: [[marca, …], …]  marca: 'x' falla | 'd' se deduce | 'a' abre | '' sin probar; papeles fijos
 *            (x naranja, d turquesa); filasDesde: [corte de cada fila]; totales: ['3 pruebas', …]
 *   nota: 'texto' | [{ t, desde, fuerte }], notas: n   líneas al final (se reservan aunque no se vean)
 * }
 * estado = { corte: 0..n }: se ve lo que tiene desde ≤ corte. El alto no cambia con el estado.
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
  const W = 320, M = 4, TENUE = 0.7, TAM = 14, NOTA = 22, PASO = 26, R = 11;
  const PAPELES = { peor: 'o', obliga: 'i', seguro: 'f', descartado: 'tenue', amarra: 'tinta' };
  const n = T.n;
  const CAJA = ' data-caja="si"';
  const ve = (x, corte) => !x || typeof x !== 'object' || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const tok = p => (p === 'peor' ? 'o' : p === 'obliga' ? 'i' : p === 'seguro' ? 'f' : undefined);
  const marca = c => (c === 'f' ? ' data-marca="seguro"' : '');
  const notasDe = d => (d.nota === undefined ? [] : Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]);
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));
  const salidasDe = d => (d.salieron || []).map(x => (typeof x === 'number' ? { i: x } : x));

  // ---------- Medidas de cada objeto ----------
  const TAMANO = { bola: [2 * R, 2 * R], ficha: [2 * R, 2 * R], carta: [22, 30], guante: [24, 26] };
  const medida = o => TAMANO[o.forma] || TAMANO.bola;

  // Pone objetos en renglones dentro de [x0, x1], de izquierda a derecha; un grupo no se parte entre renglones.
  function acomodar(objs, x0, x1, y0) {
    const pos = [], gap = 3, gapGrupo = 12;
    let x = x0, y = y0, alto = 0, fila = 0;
    const grupos = [];
    objs.forEach((o, i) => { const g = o.grupo; if (g !== undefined && grupos.length && grupos[grupos.length - 1].g === g) grupos[grupos.length - 1].ix.push(i); else grupos.push({ g, ix: [i] }); });
    let primero = true;
    for (const gr of grupos) {
      const ancho = gr.ix.reduce((s, i) => s + medida(objs[i])[0], 0) + gap * (gr.ix.length - 1);
      const sep = primero ? 0 : (gr.g !== undefined ? gapGrupo : gap);
      if (!primero && x + sep + ancho > x1) { y += alto + 8; x = x0; alto = 0; fila++; }
      else x += sep;
      for (const i of gr.ix) {
        const [w, h] = medida(objs[i]);
        pos[i] = { cx: x + w / 2, cy: y + h / 2, w, h, fila };
        x += w + gap; alto = Math.max(alto, h);
      }
      x -= gap;
      primero = false;
    }
    const filas = objs.length ? fila + 1 : 0;
    return { pos, alto: objs.length ? y - y0 + alto : 0, filas, grupos };
  }

  // ---------- Geometría ----------
  function geometria(d) {
    let y = M;
    const yMeta = y;
    if (d.meta) y += 22;
    const g = { yMeta, alto: 0 };
    if (d.escena === 'recipiente') {
      const objs = d.objetos || [];
      y += 1;
      g.yCaja = y;
      const dentro = acomodar(objs, M + 7, W - M - 7, y + 34);
      g.dentro = dentro;
      y += 34 + dentro.alto + 10;
      g.yFinCaja = y;
      y += 1;
      if (!d.enSuLugar && (d.salieron || d.reserva)) {
        y += 6;
        g.ySal = y;
        const nRes = Math.max(d.reserva || 0, salidasDe(d).length);
        const muestra = salidasDe(d).map(s => objs[s.i]).concat(Array.from({ length: Math.max(0, nRes - salidasDe(d).length) }, () => objs[0] || { forma: 'bola' }));
        const abajo = acomodar(muestra, M + 7, W - M - 7, y + 22);
        g.abajo = abajo;
        y += 22 + Math.max(abajo.alto, 2 * R) + 6;
      }
    } else if (d.escena === 'casilleros') {
      const cs = d.casilleros || [], cols = d.columnas || Math.min(4, cs.length || 1), gap = 6;
      y += 1;
      g.yCal = y;
      const w = (W - 2 * M - 12 - gap * (cols - 1)) / cols, h = 44, filas = Math.ceil(cs.length / cols);
      g.cal = { cols, w, h, gap, filas, x0: M + 6, y0: y + 30 };
      y += 30 + filas * h + (filas - 1) * gap + 8;
      g.yFinCal = y;
      y += 1;
    } else if (d.escena === 'llaves') {
      const nn = d.llaves || 2, nc = d.candados || nn, conTot = !!(d.totales && d.totales.length);
      const xg = M + 84, cw = Math.min(30, ((conTot ? W - M - 84 : W - M - 2) - xg) / nc);
      g.ll = { nn, nc, xg, cw, conTot, yCab: y, fila: 26 };
      y += 40 + 26 * nn + 4;
    }
    if (d.cuenta && d.cuenta.length) { g.yCuenta = y; y += NOTA; }
    const nNotas = Math.max(d.notas || 0, notasDe(d).length);
    g.yNota = y; g.nNotas = nNotas;
    y += nNotas * NOTA;
    g.alto = Math.max(y + M, 40);
    return g;
  }

  // ---------- Un objeto ----------
  function objeto(o, p0, papel, corte) {
    let p = p0;
    const c = tok(papel), desc = papel === 'descartado';
    const borde = c ? `var(--c-${c})` : 'currentColor', g = c ? 3 : 2;
    // Un objeto oscuro (relleno: guante o bolo negro) conserva su gris también cuando sale con un papel (cierre del 19 nov).
    const fondo = o.relleno ? ' fill="currentColor" fill-opacity="0.3"' : c ? ` fill="var(--c-${c})" fill-opacity="0.14"` : ' fill="var(--card)"';
    let s = '';
    if (o.forma === 'carta') s += `<rect${CAJA} x="${n(p.cx - p.w / 2)}" y="${n(p.cy - p.h / 2)}" width="${p.w}" height="${p.h}" rx="3"${fondo} stroke="${borde}" stroke-width="${g}"/>`;
    else if (o.forma === 'guante') {
      // Un guante de prueba: la palma y el pulgar, dentro de su ancho (a la izquierda el izquierdo, a la derecha el derecho).
      const izq = o.t === 'I', px = izq ? p.cx - p.w / 2 : p.cx + p.w / 2 - 6, pal = izq ? p.cx - p.w / 2 + 5 : p.cx - p.w / 2;
      s += `<rect${CAJA} x="${n(px)}" y="${n(p.cy - 2)}" width="6" height="11" rx="3"${fondo} stroke="${borde}" stroke-width="${g}"/>`;
      s += `<rect${CAJA} x="${n(pal)}" y="${n(p.cy - p.h / 2)}" width="${p.w - 5}" height="${p.h}" rx="7"${fondo} stroke="${borde}" stroke-width="${g}"/>`;
      p = Object.assign({}, p, { cx: pal + (p.w - 5) / 2 });
    } else s += `<circle${CAJA} cx="${n(p.cx)}" cy="${n(p.cy)}" r="${R}"${fondo} stroke="${borde}" stroke-width="${g}"/>`;
    if (o.t !== undefined && o.t !== '') s += T.rotulo(p.cx, p.cy + 5, String(o.t), { ancla: 'middle', tam: TAM, peso: 700, color: c, min: p.cx - p.w / 2 - 6, max: p.cx + p.w / 2 + 6 });
    if (desc) s += `<line data-tacha="si"${CAJA} x1="${n(p.cx - p.w / 2 - 2)}" y1="${n(p.cy + p.h / 2)}" x2="${n(p.cx + p.w / 2 + 2)}" y2="${n(p.cy - p.h / 2)}" stroke="currentColor" stroke-width="1.5"/>`;
    return `<g class="kit-aparece" data-objeto-papel="${papel || 'amarra'}"${marca(c)}${desc ? ` opacity="${TENUE}"` : ''}>${s}</g>`;
  }

  // Raya bajo cada grupo de dos (una pareja).
  function rayasGrupo(objs, lay) {
    let s = '';
    for (const gr of lay.grupos) {
      if (gr.g === undefined || gr.ix.length !== 2) continue;
      const a = lay.pos[gr.ix[0]], b = lay.pos[gr.ix[1]], yy = Math.max(a.cy + a.h / 2, b.cy + b.h / 2) + 4;
      s += `<line x1="${n(a.cx - 4)}" y1="${n(yy)}" x2="${n(b.cx + 4)}" y2="${n(yy)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    }
    return s;
  }

  // ---------- Escena: el recipiente ----------
  const NOMBRE = { tombola: 'Tómbola', cajon: 'Cajón', bingo: 'Bingo', mesa: 'Mesa' };
  function recipiente(d, g, corte) {
    const objs = d.objetos || [], sal = salidasDe(d).filter(x => ve(x, corte)), fuera = new Map(sal.map(x => [x.i, x]));
    const y0 = g.yCaja, h = g.yFinCaja - y0;
    let s = `<rect${CAJA} x="${M + 1}" y="${n(y0)}" width="${W - 2 * M - 2}" height="${n(h)}" rx="${d.recipiente === 'mesa' ? 4 : 10}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    // La manivela del bombo del bingo, arriba a la derecha (la tómbola y el cajón van con su nombre; la manija del cajón
    // salió en el cierre del 19 nov: el lector no la reconocía).
    if (d.recipiente === 'bingo') s += `<circle cx="${W - M - 26}" cy="${n(y0 + 16)}" r="9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="${W - M - 26}" y1="${n(y0 + 16)}" x2="${W - M - 44}" y2="${n(y0 + 16)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += T.rotulo(M + 12, y0 + 21, d.titulo || NOMBRE[d.recipiente] || 'Tómbola', { tam: TAM, peso: 700, min: M + 8, max: W / 2 + 14 });
    // Dentro: lo que queda (o, en su lugar, todo con lo que salió marcado).
    const dentro = [];
    if (d.enSuLugar) objs.forEach((o, i) => { const x = fuera.get(i); dentro.push(objeto(o, g.dentro.pos[i], x ? (x.papel || 'peor') : o.papel, corte)); });
    else {
      // Lo que queda se acomoda desde el principio (sin huecos); el alto es el de todo lo que había.
      const quedan = objs.filter((_, i) => !fuera.has(i)), lay = acomodar(quedan, M + 7, W - M - 7, g.yCaja + 34);
      quedan.forEach((o, k) => dentro.push(objeto(o, lay.pos[k], o.papel === 'descartado' ? 'descartado' : undefined, corte)));
    }
    s += dentro.join('') + (d.enSuLugar ? rayasGrupo(objs, g.dentro) : '');
    if (g.ySal !== undefined) {
      s += T.rotulo(M + 4, g.ySal + 15, 'Salieron:', { tam: TAM, peso: 700, min: M, max: W - M });
      // Los que salieron, en orden, abajo; los lugares que faltan quedan vacíos.
      const abajo = sal.map((x, k) => objeto(objs[x.i], g.abajo.pos[k], x.papel || 'peor', corte)).join('');
      s += abajo;
    }
    return `<g class="kit-objeto" data-objeto="${d.recipiente || 'tombola'}" data-prueba="si">${s}</g>`;
  }

  // ---------- Escena: casilleros (el calendario de la pared) ----------
  function casilleros(d, g, corte) {
    const c = g.cal, cs = d.casilleros || [];
    const yt = g.yCal, h = g.yFinCal - yt;
    let s = `<rect${CAJA} x="${M + 1}" y="${n(yt)}" width="${W - 2 * M - 2}" height="${n(h)}" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>`;
    // Sin los anillos de colgar (cierre del 19 nov: dos circulitos que el lector no sabía qué eran).
    s += T.rotulo(M + 10, yt + 20, d.tituloCal || 'Cumpleaños del salón', { tam: TAM, peso: 700, min: M + 6, max: W - M - 6 });
    cs.forEach((x, k) => {
      const col = k % c.cols, fila = Math.floor(k / c.cols), x0 = c.x0 + col * (c.w + c.gap), y0 = c.y0 + fila * (c.h + c.gap);
      const papel = x.papel, col0 = tok(papel);
      let q = `<rect${CAJA} x="${n(x0)}" y="${n(y0)}" width="${n(c.w)}" height="${c.h}" rx="4" fill="none" stroke="${col0 ? `var(--c-${col0})` : 'currentColor'}" stroke-width="${col0 ? 2.5 : 1.5}"/>`;
      q += T.rotulo(x0 + 5, y0 + 16, x.t, { tam: TAM, peso: 700, color: col0, min: x0 + 2, max: x0 + c.w - 2 });
      // Una marca por persona (u objeto), en el orden en que cae; si no caben, el número.
      const cupo = Math.max(1, Math.floor((c.w - 8) / 14)), nn = x.n || 0;
      if (nn <= cupo) {
        for (let j = 0; j < nn; j++) {
          const pj = (x.papeles && x.papeles[j]) || papel, cj = tok(pj), dj = x.desdes && x.desdes[j];
          if (dj !== undefined && dj > corte) continue;
          q += `<circle cx="${n(x0 + 10 + j * 14)}" cy="${n(y0 + 32)}" r="5" fill="${cj ? `var(--c-${cj})` : 'currentColor'}"${cj ? ' fill-opacity="0.9"' : ' fill-opacity="0.75"'} stroke="none"${marca(cj)}/>`;
        }
      } else q += T.rotulo(x0 + 5, y0 + 37, `× ${nn}`, { tam: TAM, color: col0, min: x0 + 2, max: x0 + c.w - 2 });
      s += `<g class="kit-aparece"${marca(col0)}>${q}</g>`;
    });
    return `<g class="kit-objeto" data-objeto="calendario" data-prueba="si">${s}</g>`;
  }

  // ---------- Escena: llaves y candados ----------
  function candado(cx, y) {
    // El arco (con dos tramos rectos) y el cuerpo.
    return `<path d="M${n(cx - 5)} ${n(y + 9)}L${n(cx - 5)} ${n(y + 5)}A5 5 0 0 1 ${n(cx + 5)} ${n(y + 5)}L${n(cx + 5)} ${n(y + 9)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
      + `<rect x="${n(cx - 8)}" y="${n(y + 9)}" width="16" height="11" rx="2" fill="currentColor" fill-opacity="0.85"/>`;
  }
  function llaveIcono(x, cy) {
    return `<circle cx="${n(x + 5)}" cy="${n(cy)}" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/>`
      + `<line x1="${n(x + 10)}" y1="${n(cy)}" x2="${n(x + 22)}" y2="${n(cy)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(x + 19)}" y1="${n(cy)}" x2="${n(x + 19)}" y2="${n(cy + 4)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
  }
  const MARCAS = { x: { t: '✗', papel: 'peor' }, d: { t: '✓', papel: 'obliga' }, a: { t: '✓' }, '-': { t: '–' } };
  function llaves(d, g, corte) {
    const L = g.ll, y0 = L.yCab;
    let s = '';
    for (let j = 0; j < L.nc; j++) {
      const cx = L.xg + L.cw * (j + 0.5);
      s += candado(cx, y0);
      s += T.rotulo(cx, y0 + 36, String(j + 1), { ancla: 'middle', tam: TAM, peso: 700, min: L.xg + L.cw * j, max: L.xg + L.cw * (j + 1) });
    }
    s += T.rotulo(M + 2, y0 + 16, 'Candados:', { tam: TAM, peso: 700, min: M, max: L.xg - 2 });
    const yF = y0 + 40;
    s += `<line x1="${M + 2}" y1="${n(yF)}" x2="${n(L.xg + L.cw * L.nc)}" y2="${n(yF)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    for (let i = 0; i < L.nn; i++) {
      const yy = yF + L.fila * i, desdeF = d.filasDesde ? d.filasDesde[i] || 0 : 0;
      let q = llaveIcono(M + 2, yy + 13) + T.rotulo(M + 28, yy + 18, `Llave ${i + 1}`, { tam: TAM, min: M + 26, max: L.xg - 2 });
      if (desdeF <= corte) {
        const fila = (d.filas || [])[i] || [];
        fila.forEach((mk, j) => {
          const m = MARCAS[mk]; if (!m) return;
          const c = tok(m.papel);
          q += T.rotulo(L.xg + L.cw * (j + 0.5), yy + 18, m.t, { ancla: 'middle', tam: TAM, peso: 700, color: c, min: L.xg + L.cw * j + 1, max: L.xg + L.cw * (j + 1) - 1 });
        });
        const tot = (d.totales || [])[i];
        if (L.conTot && tot) q += T.rotulo(W - M - 2, yy + 18, tot, { ancla: 'end', tam: TAM, color: 'o', min: L.xg + L.cw * L.nc + 6, max: W - M });
      }
      s += `<g class="kit-aparece">${q}</g>`;
    }
    return `<g class="kit-objeto" data-objeto="llaves" data-prueba="si">${s}</g>`;
  }

  // ---------- Una línea de cuentas: trozos de texto seguidos, cada uno con su papel ----------
  function cuenta(d, g, corte) {
    let x = M + 2, s = '';
    for (const p of d.cuenta) {
      const c = tok(p.papel), peso = c ? 700 : 400, w = T.ancho(p.t, TAM, peso);
      if (ve(p, corte)) s += `<g class="kit-aparece"${marca(c)}>${T.rotulo(x, g.yCuenta + 16, p.t, { tam: TAM, peso, color: c, min: M, max: W - M })}</g>`;
      x += w + 8;
    }
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, g = geometria(d);
    let s = '';
    if (d.meta) s += T.rotulo(M + 2, g.yMeta + 15, d.meta, { tam: TAM, peso: 700, min: M, max: W - M });
    if (d.escena === 'recipiente') s += recipiente(d, g, corte);
    else if (d.escena === 'casilleros') s += casilleros(d, g, corte);
    else if (d.escena === 'llaves') s += llaves(d, g, corte);
    if (g.yCuenta !== undefined) s += cuenta(d, g, corte);
    notasDe(d).forEach((x, k) => { if (ve(x, corte)) { const c = tok(x.papel); s += `<g class="kit-aparece"${marca(c)}>${T.rotulo(M + 2, g.yNota + 16 + k * NOTA, x.t, { tam: TAM, peso: x.fuerte || c ? 700 : 400, color: c, min: M, max: W - M })}</g>`; } });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  // ---------- Texto alternativo ----------
  const FORMA = { bola: 'bolita', ficha: 'ficha', carta: 'carta', guante: 'guante' };
  function nombreObj(o) {
    if (o.forma === 'guante') return `guante ${o.t === 'I' ? 'izquierdo' : 'derecho'}${o.relleno ? ' oscuro' : ' claro'}`;
    return `${FORMA[o.forma] || 'bolita'} ${o.t}`;
  }
  function resumen(objs) {
    const cuenta = new Map();
    for (const o of objs) { const k = nombreObj(o); cuenta.set(k, (cuenta.get(k) || 0) + 1); }
    return lista([...cuenta].map(([k, v]) => (v > 1 ? `${v} × ${k}` : k)));
  }
  function alt(d) {
    const partes = [];
    if (d.meta) partes.push(d.meta);
    if (d.escena === 'recipiente') {
      const objs = d.objetos || [], sal = salidasDe(d);
      const salen = new Set(sal.map(x => x.i));
      partes.push(`${d.titulo || NOMBRE[d.recipiente] || 'Tómbola'} con ${resumen(d.enSuLugar ? objs : objs.filter((_, i) => !salen.has(i))) || 'nada'}`);
      if (sal.length) partes.push(`${d.enSuLugar ? 'Marcados como salidos' : 'Salieron, en orden'}: ${sal.map(x => nombreObj(objs[x.i]) + (x.papel === 'obliga' ? ' (la que obliga)' : '')).join(', ')}`);
    }
    if (d.escena === 'casilleros') partes.push(`${d.tituloCal || 'Calendario'}: ${(d.casilleros || []).map(x => `${x.t}, ${x.n || 0}`).join('; ')}`);
    if (d.escena === 'llaves') partes.push(`${d.llaves} llaves y ${d.candados || d.llaves} candados${(d.filas || []).length ? '' : ', todavía sin pruebas'}: ${(d.filas || []).map((f, i) => `llave ${i + 1}, ${f.filter(x => x === 'x').length} pruebas que fallan${f.includes('d') ? ' y el último se deduce' : ''}`).join('; ')}`);
    for (const x of d.cuenta || []) partes.push(x.t);
    for (const x of notasDe(d)) partes.push(x.t);
    return (partes.length ? partes.join('. ') : 'Objetos que se sacan sin mirar') + '.';
  }

  return { id: 'rm-certeza', dibujar, alt, geometria, PAPELES, constantes: { W, TENUE } };
});
