/*
 * Pieza «trig-medida» (19 nov 2026, etapa 5): los objetos con que se mide un ángulo en la teoría de «Ángulo
 * trigonométrico y sistemas de medida» (contenido/teoria/trigonometria/angulo-trigonometrico.js), ideas 3, 4 y 5.
 * Dibujos de prueba (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 *   lupa         la lupa sobre el transportador: un grado sexagesimal partido en sus 60 minutos (una rayita cada 5′) y,
 *                debajo, un grado centesimal partido en sus 100 minutos (una rayita cada 10ᵐ). Los dos empiezan en el
 *                mismo cero y están a escala: el grado centesimal mide 9/10 del sexagesimal.
 *     datos = { objeto: 'lupa', desde: 2,        el grado donde empieza la fila de arriba (de `desde`° a `desde + 1`°)
 *               min: 45, rotulo: '2° 45′',       la aguja, en minutos sexagesimales, y su rótulo (arriba, en carmín)
 *               cen: true,                       dibuja también la fila centesimal (solo con desde: 0)
 *               rotuloCen: '50ᵐ',                rótulo de la aguja en la fila centesimal (abajo, en turquesa)
 *               colorRotulo: 'tinta' }           el color del rótulo de arriba, si no es carmín («?»)
 *   rueda        la rueda de un triciclo de carga y pitas del largo de un rayo acostadas sobre la llanta: el ángulo que
 *                abarca una pita desde el centro es un radián.
 *     datos = { objeto: 'rueda', radio: 30,      el radio en centímetros (20, 30 o 40: cambia el tamaño del dibujo)
 *               pitas: 2,                        cuántas pitas (radios de arco) hay sobre la llanta, desde el rayo naranja
 *               cuenta: true,                    numera las pitas enteras
 *               rotulo: '2 rad',                 rótulo del ángulo (en violeta; colorRotulo: 'tinta' para «?»)
 *               resto: true }                    marca, punteado, lo que falta para la vuelta
 *   calculadora  una calculadora científica con el mismo ángulo en sus tres modos.
 *     datos = { objeto: 'calculadora', modos: [{ nombre: 'DEG', valor: '63', color: 'h' }, … ] }   de 1 a 3 filas
 * Todos aceptan valores con pasos: un valor o [{ t | v, paso }] (se ve el último cuyo paso ya llegó); estado = { paso, final }.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 300. Colores: currentColor (tinta) y
 * var(--c-*), según la regla de la unidad: sexagesimal en carmín (h), centesimal en turquesa (i), radianes en violeta (f)
 * y los largos (el radio y la pita) en naranja (o).
 * geometria(datos, estado) da las cajas de los rótulos y los puntos que usan las manijas (la aguja, la punta del arco).
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
  const W = 320, H = 300, M = 4, RAD = Math.PI / 180;
  const OBJETOS = ['lupa', 'rueda', 'calculadora'];
  const n = T.n;
  const tinta = (g = 2, op) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const trazo = (c, g = 2, extra = '') => `fill="none" stroke="${T.color(c)}" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${extra}`;
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs, cerrar = true) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}${cerrar ? 'Z' : ''}" ${attrs}/>`;
  const circulo = (c, r, attrs) => `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}" ${attrs}/>`;
  const rect = (x, y, w, h, rx, attrs) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}" ${attrs}/>`;
  const enPaso = (x, e) => {
    if (!Array.isArray(x)) return x;
    const p = e && e.final ? Infinity : (e && e.paso) || 0;
    let v;
    for (const it of x) if ((it.paso || 0) <= p) v = it.t !== undefined ? it.t : it.v;
    return v;
  };
  // Un rótulo: caja centrada en (x, y); se dibuja con halo.
  const caja = (x, y, texto, o = {}) => { const tam = o.tam || 16, peso = o.peso || 600, w = T.ancho(texto, tam, peso); return { x: Math.min(W - M - 2 - w / 2, Math.max(M + 2 + w / 2, x)), y, w, h: tam * 1.05, texto: String(texto), tam, peso, color: o.color }; };
  const rotulo = b => T.rotulo(b.x, b.y + b.tam * 0.28, b.texto, { ancla: 'middle', peso: b.peso, color: b.color, tam: b.tam, min: M, max: W - M })
    .replace('<text ', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');

  // ---------- La lupa: un grado partido en minutos ----------
  const LX0 = 54, LARGO = 200, YS = 124, YC = 190, LENTE = { c: [154, 142], r: 130 };
  const xMin = m => LX0 + LARGO * m / 60;                    // dónde cae un minuto sexagesimal
  const xCen = m => LX0 + LARGO * 0.9 * m / 100;             // dónde cae un minuto centesimal (1ᵍ = 0,9°)
  function lupa(d, e) {
    const desde = Number.isFinite(d.desde) ? d.desde : 0, min = enPaso(d.min, e), cen = !!enPaso(d.cen, e) && desde === 0;
    const cajas = [];
    let s = circulo(LENTE.c, LENTE.r, 'fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="5" stroke-opacity="0.45"') + circulo(LENTE.c, LENTE.r - 4, tinta(1.5));
    // El mango, hacia abajo a la derecha.
    s += linea([249, 237], [298, 286], 'stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-opacity="0.55"');
    // Fila sexagesimal: de desde° a (desde + 1)°, con sus 60 minutos.
    s += linea([LX0, YS], [LX0 + LARGO, YS], trazo('h', 2));
    for (let m = 0; m <= 60; m += 5) s += linea([xMin(m), YS], [xMin(m), YS - (m % 60 === 0 ? 22 : m % 15 === 0 ? 14 : 8)], trazo('h', m % 15 === 0 ? 2.5 : 1.5));
    cajas.push(caja(LX0, YS - 33, `${desde}°`, { color: 'h' }), caja(LX0 + LARGO, YS - 33, `${desde + 1}°`, { color: 'h' }));
    for (const m of [15, 30, 45]) if (!cen || !Number.isFinite(min) || Math.abs(min - m) > 6) cajas.push(caja(xMin(m), YS + 13, `${m}′`, { tam: 14, peso: 400, color: 'h' }));
    if (cen) {
      s += linea([LX0, YC], [xCen(100), YC], trazo('i', 2));
      for (let m = 0; m <= 100; m += 10) s += linea([xCen(m), YC], [xCen(m), YC + (m % 100 === 0 ? 22 : m % 50 === 0 ? 14 : 8)], trazo('i', m % 50 === 0 ? 2.5 : 1.5));
      cajas.push(caja(LX0, YC + 33, '0ᵍ', { color: 'i' }), caja(xCen(100), YC + 33, '1ᵍ', { color: 'i' }));
      // El rótulo de la rayita del medio no va si la aguja pasa por ahí.
      if (!Number.isFinite(min) || Math.abs(xMin(min) - xCen(50)) > 22) cajas.push(caja(xCen(50), YC - 13, '50ᵐ', { tam: 14, peso: 400, color: 'i' }));
    }
    let aguja = null;
    if (Number.isFinite(min)) {
      const x = xMin(min), abajo = cen && enPaso(d.rotuloCen, e) ? YC + 26 : YS + 4;
      aguja = [x, YS - 30];
      s += linea([x, YS - 40], [x, abajo], 'stroke="var(--card)" stroke-width="6" stroke-linecap="round"') + linea([x, YS - 40], [x, abajo], trazo(d.colorAguja === undefined ? 'h' : d.colorAguja, 3));
      const r = enPaso(d.rotulo, e), rc = cen ? enPaso(d.rotuloCen, e) : null;
      if (r) cajas.push(caja(x, YS - 52, String(r), { color: d.colorRotulo === undefined ? 'h' : d.colorRotulo }));
      if (rc) cajas.push(caja(x, YC + 54, String(rc), { color: 'i' }));
    }
    return { s, cajas, aguja, escala: { x0: LX0, largo: LARGO } };
  }

  // ---------- La rueda y sus pitas ----------
  const RC = [160, 150], UNO = 180 / Math.PI;                  // un radián, en grados
  const pt = (r, a) => [RC[0] + r * Math.cos(a * RAD), RC[1] - r * Math.sin(a * RAD)];
  const arcoPs = (r, a0, a1) => { const N = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 5)); return Array.from({ length: N + 1 }, (_, i) => pt(r, a0 + (a1 - a0) * i / N)); };
  // La rueda es lo más grande de la figura (revisión de la sesión, 19 nov): 20 cm → 82; 30 → 97; 40 → 112.
  const TAM_RUEDA = cm => 82 + (Math.min(40, Math.max(20, cm)) - 20) * 1.5;
  function rueda(d, e) {
    const cm = Number.isFinite(d.radio) ? d.radio : 30, R = TAM_RUEDA(cm), pitas = Math.max(0, Math.min(6.283, +enPaso(d.pitas, e) || 0));
    const cajas = [], fin = pitas * UNO;
    let s = circulo(RC, R, 'fill="none" stroke="currentColor" stroke-width="7" stroke-opacity="0.3"') + circulo(RC, R + 3.5, tinta(2)) + circulo(RC, R - 3.5, tinta(1.5, 0.7));
    for (let g = 0; g < 12; g++) s += linea(pt(6, 15 + g * 30), pt(R - 4, 15 + g * 30), tinta(1, 0.4));
    s += circulo(RC, 6, 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    // El rayo que sirve de medida: el radio, en naranja, con su letra.
    s += linea(pt(6, 0), pt(R - 4, 0), trazo('o', 4));
    const rr = enPaso(d.rotuloRadio, e);
    // La letra del radio va debajo del rayo; si el ángulo pasa de media vuelta, encima (abajo queda su rótulo).
    cajas.push(caja(RC[0] + R * 0.62, RC[1] + (fin > 200 ? -13 : 13), rr === undefined ? 'r' : String(rr), { color: 'o', tam: 15 }));
    // Las pitas, acostadas sobre la llanta desde el rayo naranja; cada una mide un radio.
    const RP = R + 9;
    for (let i = 0; i < Math.ceil(pitas - 1e-9); i++) {
      const a0 = i * UNO, a1 = Math.min(i + 1, pitas) * UNO;
      s += poli(arcoPs(RP, a0 + 1.2, a1 - 1.2), trazo('o', 5, i % 2 ? ' stroke-opacity="0.55"' : ''), false);
      s += linea(pt(RP - 6, a1), pt(RP + 6, a1), tinta(2));
      if (d.cuenta && a1 - a0 > UNO - 0.01) { const p = pt(RP + 15, (a0 + a1) / 2); cajas.push(caja(p[0], p[1], `${i + 1}`, { tam: 14, color: 'o' })); }
    }
    if (pitas > 0) s += linea(pt(RP - 6, 0), pt(RP + 6, 0), tinta(2));
    if (enPaso(d.resto, e) && pitas < 6.283) s += poli(arcoPs(RP, fin + 2, 358), trazo('o', 2, ' stroke-dasharray="4 5"'), false);
    // El ángulo desde el centro: su otro lado, su arco con flecha y su rótulo.
    let punta = pt(RP, fin);
    if (pitas > 0) {
      s += linea(pt(6, fin), pt(R - 4, fin), tinta(2));
      const ra = Math.min(32, R * 0.4), corta = Math.min(fin / 2, 9 / (ra * RAD)), ps = arcoPs(ra, 0, fin - corta), p1 = pt(ra, fin), b = ps[ps.length - 1];
      const L = Math.hypot(p1[0] - b[0], p1[1] - b[1]) || 1, u = [(p1[0] - b[0]) / L, (p1[1] - b[1]) / L], v = [-u[1], u[0]], B = [p1[0] - u[0] * 9, p1[1] - u[1] * 9];
      s += poli(ps, trazo('h', 3), false) + poli([p1, [B[0] + v[0] * 4.5, B[1] + v[1] * 4.5], [B[0] - v[0] * 4.5, B[1] - v[1] * 4.5]], `fill="var(--c-h)" stroke="var(--c-h)" stroke-width="1.5" stroke-linejoin="round"`);
      const r = enPaso(d.rotulo, e);
      if (r) {
        // Dentro de la rueda, pasado el lado final del ángulo (ahí ya no hay arco); si el ángulo pasa de media vuelta,
        // al medio de lo que queda libre, y con la vuelta casi entera, debajo del centro.
        const a = fin <= 180 ? fin + 30 : fin < 330 ? fin + (360 - fin) / 2 : 270, w = T.ancho(String(r), 16, 600), u2 = [Math.cos(a * RAD), -Math.sin(a * RAD)];
        // Siempre pasado el arco del ángulo, para no pisarlo.
        const dist = ra + 8 + Math.abs(u2[0]) * w / 2 + Math.abs(u2[1]) * 8.4;
        cajas.push(caja(RC[0] + u2[0] * dist, RC[1] + u2[1] * dist, String(r), { color: d.colorRotulo === undefined ? 'f' : d.colorRotulo }));
      }
    }
    return { s, cajas, punta, R, RP };
  }

  // ---------- La calculadora de tres modos ----------
  function calculadora(d, e) {
    const modos = (d.modos || []).slice(0, 3), cajas = [];
    let s = rect(70, 8, 180, 284, 16, 'fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="2"');
    s += rect(84, 22, 152, 108, 8, 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    modos.forEach((m, i) => {
      const y = 22 + 18 + i * 36, valor = String(enPaso(m.valor, e));
      if (i) s += linea([90, y - 18], [230, y - 18], tinta(1, 0.3));
      const b1 = caja(92 + T.ancho(m.nombre, 14, 600) / 2, y, m.nombre, { tam: 14, color: m.color }), b2 = caja(228 - T.ancho(valor, 18, 600) / 2, y, valor, { tam: 18, color: valor === '?' ? undefined : m.color });
      cajas.push(b1, b2);
    });
    // Las teclas: la primera fila lleva las de trigonometría; el resto, sin rótulo.
    const TECLAS = ['DRG', 'sin', 'cos', 'tan'];
    for (let f = 0; f < 4; f++) for (let c = 0; c < 4; c++) {
      const x = 84 + c * 39, y = 144 + f * 35;
      s += rect(x, y, 34, 28, 6, `fill="var(--card)" stroke="currentColor" stroke-width="${f ? 1.5 : 2}"${f ? ' stroke-opacity="0.6"' : ''}`);
      if (!f) cajas.push(caja(x + 17, y + 14, TECLAS[c], { tam: 14, peso: 400 }));
    }
    return { s, cajas };
  }
  const DIBUJA = { lupa, rueda, calculadora };

  function geometria(d = {}, e = {}) {
    const objeto = OBJETOS.includes(d.objeto) ? d.objeto : 'rueda';
    return Object.assign({ objeto }, DIBUJA[objeto](d, e));
  }
  function dibujar(datos = {}, estado = {}) {
    const g = geometria(datos, estado);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="${g.objeto}" data-prueba="si">${g.s}</g>${g.cajas.map(rotulo).join('')}`, { alt: alt(datos) });
  }
  function alt(d = {}) {
    if (d.alt) return d.alt;
    const e = { final: true }, objeto = OBJETOS.includes(d.objeto) ? d.objeto : 'rueda';
    if (objeto === 'lupa') {
      const desde = Number.isFinite(d.desde) ? d.desde : 0, min = enPaso(d.min, e), r = enPaso(d.rotulo, e);
      return `Lupa sobre un transportador: el grado sexagesimal de ${desde} a ${desde + 1}, partido en 60 minutos${enPaso(d.cen, e) && desde === 0 ? ', y debajo un grado centesimal, más corto, partido en 100 minutos' : ''}${Number.isFinite(min) ? `; la aguja está en ${r && r !== '?' ? r : `el minuto ${Kit.formatear(min, 1)}`}` : ''}.`;
    }
    if (objeto === 'rueda') {
      const p = +enPaso(d.pitas, e) || 0, r = enPaso(d.rotulo, e);
      return `Rueda de un triciclo con un rayo pintado, el radio, y ${p ? `${Kit.formatear(p, 2)} ${p === 1 ? 'pita del largo del radio acostada' : 'pitas del largo del radio acostadas'} sobre la llanta${r ? `; el ángulo que ${p === 1 ? 'abarca' : 'abarcan'} desde el centro está rotulado ${r}` : ''}` : 'sin pitas sobre la llanta'}.`;
    }
    const ms = d.modos || [];
    return `Calculadora científica con el mismo ángulo en ${ms.length} modos: ${ms.map(m => `${m.nombre} ${enPaso(m.valor, e)}`).join(', ')}.`;
  }

  return { id: 'trig-medida', dibujar, alt, geometria, OBJETOS, constantes: { W, H, M, LX0, LARGO, RC, UNO }, xMin, tamRueda: TAM_RUEDA };
});
