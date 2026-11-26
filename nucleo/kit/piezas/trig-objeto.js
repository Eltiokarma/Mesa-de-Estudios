/*
 * Pieza «trig-objeto» (17 nov 2026): objetos de la vida real que esconden un triángulo rectángulo, para la teoría de
 * «Razones trigonométricas de ángulos agudos» (contenido/teoria/trigonometria/razones-trigonometricas-agudas.js).
 * Dibujos de prueba (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: el triángulo es el objeto. Cada lado es una parte que se ve (la escalera, la pared, el
 * piso) y lleva su medida pegada; los ángulos van en carmín, con su arco y su letra; el ángulo recto, con su cuadradito.
 *
 * Fidelidad: una sola escala para los dos ejes; los lados se dibujan a escala con sus medidas (en metros o cm).
 *
 * Cada objeto tiene tres vértices: el del ángulo recto (r) y dos agudos (a y b). Sus lados son ra (de r a a), rb (de r a
 * b) y h (de a a b, la hipotenusa). Cada objeto les pone nombres propios (alias), que valen en medidas, lados y angulos:
 *   escalera  lados { piso: ra, pared: rb, escalera: h }       angulos { pie: a, arriba: b }
 *             una escalera apoyada en la pared de una casa de adobe (la casa a la derecha)
 *   rampa     lados { base: ra, alto: rb, rampa: h }            angulos { abajo: a, arriba: b }
 *             una rampa que sube a una vereda
 *   poste     lados { suelo: ra, poste: rb, cable: h }          angulos { suelo: a, arriba: b }
 *             un poste con su cable a una estaca; con sombra: true, la sombra en el suelo (alias sombra: ra) y el rayo
 *             de sol (alias rayo: h, punteado) que pasa por la punta del poste, con el sol lejos, en la misma dirección
 *   repisa    lados { pared: ra, brazo: rb, tirante: h }        angulos { abajo: a, punta: b }
 *             una repisa en la pared: el ángulo recto arriba, donde el brazo horizontal toca la pared
 *   chacra    lados { ra, rb, h }                               una chacra vista desde arriba, con la hipotenusa abajo
 *   triangulo lados { ra, rb, h }, giro (grados), vertices: { r: 'Q', a: 'P', b: 'R' }   un triángulo girado, de examen
 * Objetos de las ideas 2 a 5 (17 nov):
 *   sombras   lados { sombra: ra, poste: rb, rayo: h, sombra2, primo, rayo2 }   angulos { suelo: a, arriba: b, suelo2 }
 *             un poste y tu primo a la misma hora, con sus sombras y los rayos de sol paralelos; primo: su altura
 *             (1,5 por omisión). sombra2, primo y rayo2 son los lados del triángulo del primo (extras)
 *   senal     lados { media: ra, altura: rb, lado: h }      angulos { esquina: a (60°), punta: b (30°) }
 *             una señal «Ceda el paso» (triángulo equilátero, de punta abajo) partida por su altura; medidas { lado }
 *   loseta    lados { base: ra, costado: rb, diagonal: h }   angulos { izquierda: a, arriba: b }
 *             una loseta cuadrada del piso, cortada por la diagonal; medidas { lado }
 *   escuadras lados { largo: ra, corto: rb, hip: h, c1, c2, d }   angulos { a30: a, a60: b, e1, e2 }
 *             las dos escuadras del colegio: la de 30° y 60° (el triángulo principal) y la de 45° (extras c1, c2, d);
 *             medidas { corto } (1 por omisión); sola: true dibuja solo la de 30° y 60°, más grande
 *   cuerda    lados { base: ra, estaca: rb, cuerda: h }      angulos { transportador: a, arriba: b }
 *             el albañil marca una esquina recta con estacas y una cuerda, visto desde arriba; el transportador en θ
 *   techo     lados { viga: ra, poste: rb, calamina: h }     angulos { alero: a, cumbre: b }
 *             un techo de calamina a dos aguas, partido por el poste del centro (la mitad derecha es el triángulo)
 *   figura    forma: 'diagonal' | 'medio' | 'trapecio', con sus vértices nombrados (el triángulo escondido del examen):
 *             diagonal  rectángulo ABCD (A abajo a la izquierda) y su diagonal AC; triángulo ABC, recto en B
 *                       lados { AB: ra, BC: rb, AC: h, CD, DA }       angulos { A: a, C: b }
 *             medio     cuadrado ABCD y M, punto medio de DC; triángulo ADM, recto en D
 *                       lados { DA: ra, DM: rb, AM: h, AB, BC, MC }    angulos { A: a, M: b }
 *             trapecio  trapecio ABCD con AD vertical, DC arriba y la altura CH; triángulo HBC, recto en H
 *                       lados { HB: ra, CH: rb, BC: h, AH, DA, CD }    angulos { B: a, C: b }; menor: largo de DC
 *             semicirculo  semicircunferencia de diámetro AB y C en el arco; triángulo ACB, recto en C (17 nov)
 *                       lados { AC: ra, BC: rb, AB: h }                angulos { A: a, B: b }
 * Lo que no es del triángulo principal (el primo, la otra escuadra, los demás lados de una figura) son «extras»: se
 * pintan y se rotulan igual que ra, rb y h si datos.lados los nombra.
 *
 * datos = {
 *   objeto, medidas: { piso: 3, pared: 4 },          largos de los catetos ra y rb, en la unidad del problema
 *   marco: [ra, rb],                                 opcional: fija la escala (el juego, para que el pie siga al dedo)
 *   lados: { piso: { color: 'f', texto, texto2, texto3, color2, color3, paso } },   color: token del kit o [{ c, paso }]
 *            (cambia con los pasos); texto (línea 1, 16), texto2 y texto3 (líneas 2 y 3, 14): un texto o [{ t, paso }] (se
 *            ve el último cuyo paso ya llegó); color2 y color3: el color de esas líneas (por omisión, el del lado);
 *            paso: desde cuándo se pinta el color
 *   angulos: { pie: { texto: 'θ', color: 'h', paso } },     solo los que se nombran; color carmín por omisión
 *   recto: true,                                     el cuadradito del ángulo recto (por omisión, sí)
 *   nota: 'sen 60° = √3/2',                          opcional: una línea arriba, al centro (un texto o [{ t, paso }])
 *   otra: { ra, rb },                                solo la escalera: otra posición de la misma escalera, punteada (la
 *                                                    escalera que resbala), con su ángulo en angulos.pie2
 * }
 * estado = { paso: 0..n, final }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 256.
 * Colores: currentColor (tinta) y var(--c-*); el halo de los rótulos, var(--card). La unidad decide qué color lleva cada
 * lado (regla de colores en el comentario de la unidad: el opuesto naranja, el adyacente turquesa, la hipotenusa en tinta).
 * La letra de un ángulo va dentro de su abertura, tan lejos del vértice como haga falta para no tocar un lado; el arco
 * la sigue (lector en frío, 17 nov: «25°», «α» y «30°» quedaban lejos de su arquito).
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
  const W = 320, H = 256, M = 4, SUELO = 200;
  const n = T.n;
  const tinta = (g = 2, op) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;
  const halo = s => s.replace(/<text /g, '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}Z" ${attrs}/>`;
  const resta = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const suma = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
  const largo = v => Math.hypot(v[0], v[1]) || 1;
  const unit = v => { const L = largo(v); return [v[0] / L, v[1] / L]; };

  const ALIAS = {
    escalera: { lados: { piso: 'ra', pared: 'rb', escalera: 'h' }, angulos: { pie: 'a', arriba: 'b' } },
    rampa: { lados: { base: 'ra', alto: 'rb', rampa: 'h' }, angulos: { abajo: 'a', arriba: 'b' } },
    poste: { lados: { suelo: 'ra', sombra: 'ra', poste: 'rb', cable: 'h', rayo: 'h' }, angulos: { suelo: 'a', arriba: 'b' } },
    repisa: { lados: { pared: 'ra', brazo: 'rb', tirante: 'h' }, angulos: { abajo: 'a', punta: 'b' } },
    chacra: { lados: {}, angulos: {} },
    triangulo: { lados: {}, angulos: {} },
    sombras: { lados: { sombra: 'ra', poste: 'rb', rayo: 'h' }, angulos: { suelo: 'a', arriba: 'b' } },
    senal: { lados: { media: 'ra', altura: 'rb', lado: 'h' }, angulos: { esquina: 'a', punta: 'b' } },
    loseta: { lados: { base: 'ra', costado: 'rb', diagonal: 'h' }, angulos: { izquierda: 'a', arriba: 'b' } },
    escuadras: { lados: { largo: 'ra', corto: 'rb', hip: 'h' }, angulos: { a30: 'a', a60: 'b' } },
    cuerda: { lados: { base: 'ra', estaca: 'rb', cuerda: 'h' }, angulos: { transportador: 'a', arriba: 'b' } },
    techo: { lados: { viga: 'ra', poste: 'rb', calamina: 'h' }, angulos: { alero: 'a', cumbre: 'b' } },
    figura: { lados: {}, angulos: {} },
  };
  // Nombres de los lados y ángulos de una figura de examen, según su forma.
  const FORMAS = {
    diagonal: { lados: { AB: 'ra', BC: 'rb', AC: 'h' }, angulos: { A: 'a', C: 'b' }, nombres: { ra: 'AB', rb: 'BC', h: 'AC' } },
    medio: { lados: { DA: 'ra', DM: 'rb', AM: 'h' }, angulos: { A: 'a', M: 'b' }, nombres: { ra: 'DA', rb: 'DM', h: 'AM' } },
    trapecio: { lados: { HB: 'ra', CH: 'rb', BC: 'h' }, angulos: { B: 'a', C: 'b' }, nombres: { ra: 'HB', rb: 'CH', h: 'BC' } },
    semicirculo: { lados: { AC: 'ra', BC: 'rb', AB: 'h' }, angulos: { A: 'a', B: 'b' }, nombres: { ra: 'AC', rb: 'BC', h: 'AB' } },
  };
  // Nombres de los lados para el texto alternativo.
  const NOMBRES = {
    escalera: { ra: 'piso', rb: 'pared', h: 'escalera', otra: 'la escalera después de resbalar' }, rampa: { ra: 'base', rb: 'altura', h: 'rampa' },
    poste: { ra: 'suelo', rb: 'poste', h: 'cable' }, sombra: { ra: 'sombra', rb: 'poste', h: 'rayo de sol' },
    repisa: { ra: 'pared', rb: 'brazo', h: 'tirante' }, chacra: { ra: 'cerca', rb: 'cerca', h: 'cerca larga' },
    triangulo: { ra: 'cateto', rb: 'cateto', h: 'hipotenusa' },
    sombras: { ra: 'sombra del poste', rb: 'poste', h: 'rayo de sol', sombra2: 'sombra del primo', primo: 'primo', rayo2: 'rayo del primo' },
    senal: { ra: 'media base', rb: 'altura', h: 'lado de la señal' }, loseta: { ra: 'base', rb: 'costado', h: 'diagonal' },
    escuadras: { ra: 'cateto largo', rb: 'cateto corto', h: 'hipotenusa', c1: 'cateto', c2: 'cateto', d: 'hipotenusa de la de 45°' },
    cuerda: { ra: 'base', rb: 'estaca', h: 'cuerda' }, techo: { ra: 'viga', rb: 'poste', h: 'calamina' },
    figura: {},
  };
  // Pasa los alias de un objeto a las claves de la pieza (ra, rb, h; a, b).
  function normal(d) {
    const al = d.objeto === 'figura' ? FORMAS[d.forma] || { lados: {}, angulos: {} } : ALIAS[d.objeto] || { lados: {}, angulos: {} };
    const mapa = (o, tipo) => { const r = {}; for (const [k, v] of Object.entries(o || {})) r[al[tipo][k] || k] = v; return r; };
    return { med: mapa(d.medidas, 'lados'), lados: mapa(d.lados, 'lados'), angulos: mapa(d.angulos, 'angulos') };
  }

  // Suelo: línea y banda tenue, de punta a punta.
  const suelo = (x0 = 8, x1 = W - 6, y = SUELO) => linea([x0, y], [x1, y], tinta(2)) + `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="4" fill="currentColor" fill-opacity="0.12"/>`;
  const centro = (...ps) => [ps.reduce((t, p) => t + p[0], 0) / ps.length, ps.reduce((t, p) => t + p[1], 0) / ps.length];
  // Estaca vista desde arriba: un círculo con una cruz.
  const estaca = p => `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="4.5" fill="var(--card)" ${tinta(2)}/>` + linea([p[0] - 3, p[1] - 3], [p[0] + 3, p[1] + 3], tinta(1.5)) + linea([p[0] - 3, p[1] + 3], [p[0] + 3, p[1] - 3], tinta(1.5));
  // Sol lejos, en la dirección de un rayo (de la punta de la sombra a la punta del objeto), sin salirse del lienzo.
  function sol(desde, hasta) {
    const u = unit(resta(hasta, desde)), k = Math.min(48, (hasta[1] - 22) / Math.abs(u[1] || 1e-9), (hasta[0] - 22) / Math.abs(u[0] || 1e-9));
    const c = suma(hasta, u, Math.max(0, k));
    let rayos = '';
    for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; rayos += `M${n(c[0] + 12 * Math.cos(t))} ${n(c[1] + 12 * Math.sin(t))}L${n(c[0] + 17 * Math.cos(t))} ${n(c[1] + 17 * Math.sin(t))}`; }
    return `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="8" fill="currentColor" fill-opacity="0.25" ${tinta(1.5)}/><path d="${rayos}" fill="none" ${tinta(1.5)}/>`;
  }
  // Muro de adobe: relleno tenue y juntas de los adobes (filas de 12, juntas alternadas cada 30).
  function adobe(x0, y0, x1, y1) {
    let s = `<rect x="${n(x0)}" y="${n(y0)}" width="${n(x1 - x0)}" height="${n(y1 - y0)}" fill="currentColor" fill-opacity="0.07"/>`;
    let juntas = '';
    for (let y = y1 - 12, fila = 0; y > y0 + 4; y -= 12, fila++) {
      juntas += `M${n(x0)} ${n(y)}L${n(x1)} ${n(y)}`;
      for (let x = x0 + 12 + (fila % 2) * 15; x < x1 - 4; x += 30) juntas += `M${n(x)} ${n(y)}L${n(x)} ${n(Math.min(y + 12, y1))}`;
    }
    return s + `<path d="${juntas}" fill="none" ${tinta(1, 0.28)}/>`;
  }

  // Cada objeto: geometría en px (r, a, b) y su dibujo. col(k): color del lado k (o tinta). Devuelve también los lados
  // que el objeto pinta con su propio dibujo (propios) y si alguno va punteado.
  const OBJETOS = {
    // escalera: «una escalera apoyada en la pared de una casa de adobe es la hipotenusa; la pared y el piso, los catetos».
    escalera(m, d, col) {
      const mk = d.marco || [], ot = d.otra || {};
      const s = Math.min(160 / Math.max(m.ra, mk[0] || 0, ot.ra || 0), 168 / Math.max(m.rb, mk[1] || 0, ot.rb || 0));
      const XW = 196, r = [XW, SUELO], a = [XW - m.ra * s, SUELO], b = [XW, SUELO - m.rb * s];
      let fondo = adobe(XW, 16, W - 6, SUELO) + linea([XW, 16], [XW, SUELO], tinta(2));
      fondo += `<path d="M${XW - 10} 16L${W - 6} 16L${W - 6} 9L${XW - 4} 9Z" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
      // Una ventana arriba, lejos de los rótulos de la pared (que van a media altura).
      fondo += `<rect x="262" y="30" width="36" height="30" rx="2" fill="var(--card)" ${tinta(2)}/>` + linea([280, 30], [280, 60], tinta(1.5)) + linea([262, 45], [298, 45], tinta(1.5));
      fondo += suelo();
      // Dos largueros: uno es el lado (de a a b); el otro, 7 más afuera. Peldaños cada 14 px.
      const u = unit(resta(b, a)), q = [u[1], -u[0]], L = largo(resta(b, a));
      const a2 = suma(a, q, 7), b2 = suma(b, q, 7);
      let frente = linea(a2, b2, `stroke="${col('h')}" stroke-width="2.5" stroke-linecap="round"`);
      const k = Math.max(2, Math.floor(L / 14));
      let pel = '';
      for (let i = 1; i < k; i++) { const p = suma(a, resta(b, a), i / k), p2 = suma(p, q, 7); pel += `M${n(p[0])} ${n(p[1])}L${n(p2[0])} ${n(p2[1])}`; }
      frente += `<path d="${pel}" fill="none" ${tinta(1.5)}/>` + linea(a, b, `stroke="${col('h')}" stroke-width="3" stroke-linecap="round"`);
      // Otra posición de la misma escalera (la que resbala): punteada, con su ángulo en el piso (pie2).
      const extras = {}, extraAng = {};
      if (d.otra) {
        const a3 = [XW - d.otra.ra * s, SUELO], b3 = [XW, SUELO - d.otra.rb * s];
        fondo += linea(a3, b3, `${tinta(2.5)} stroke-dasharray="6 5"`);
        extras.otra = [a3, b3];
        extraAng.pie2 = { v: a3, p1: r, p2: b3 };
      }
      // El rótulo de la escalera va más afuera: el segundo larguero está a 7 del lado. Las letras de los ángulos evitan
      // también ese larguero (lector en frío, 17 nov: «74°» quedaba encima de la escalera).
      return { r, a, b, s, fondo, frente, propios: ['h'], separa: { h: 19 }, evitar: [[a2, b2]], extras, extraAng, extraG: centro(r, a, b) };
    },
    // rampa: «la rampa es la hipotenusa; lo que sube (la vereda) y la base en el piso son los catetos».
    rampa(m, d) {
      const mk = d.marco || [];
      const s = Math.min(170 / Math.max(m.ra, mk[0] || 0), 130 / Math.max(m.rb, mk[1] || 0));
      const XR = 200, r = [XR, SUELO], a = [XR - m.ra * s, SUELO], b = [XR, SUELO - m.rb * s];
      let fondo = `<rect x="${XR}" y="${n(b[1])}" width="${W - 6 - XR}" height="${n(SUELO - b[1])}" fill="currentColor" fill-opacity="0.12"/>`
        + linea(b, [W - 6, b[1]], tinta(2)) + linea(r, b, tinta(2));
      fondo += poli([a, r, b], `fill="currentColor" fill-opacity="0.1" stroke="none"`) + suelo();
      // 26 nov (dibujos reconocibles): la baranda de la rampa, paralela a ella y tenue, con sus parantes, y el sardinel
      // de la vereda: un triángulo sombreado solo no se leía como rampa.
      const u = unit(resta(b, a)), q = [u[1], -u[0]], L = largo(resta(b, a)), alto = 16;
      const a1 = suma(suma(a, u, Math.min(14, L * 0.12)), q, alto), b1 = suma(suma(b, u, -6), q, alto);
      let bar = `M${n(a1[0])} ${n(a1[1])}L${n(b1[0])} ${n(b1[1])}L${n(b1[0] + 24)} ${n(b1[1])}`;
      const kp = Math.max(2, Math.round(L / 40));
      for (let i = 0; i <= kp; i++) { const t = suma(a1, resta(b1, a1), i / kp), pie = suma(t, q, -alto); bar += `M${n(t[0])} ${n(t[1])}L${n(pie[0])} ${n(pie[1])}`; }
      fondo += `<path d="${bar}" fill="none" ${tinta(1.8, 0.4)}/>`;
      fondo += linea([XR, b[1] + 4], [W - 6, b[1] + 4], tinta(1, 0.3));
      const frente = linea(a, b, tinta(3));
      return { r, a, b, s, fondo, frente, propios: [], separa: { h: alto + 12 }, evitar: [[a1, b1]] };
    },
    // poste: «el poste y el suelo forman el ángulo recto; el cable (o el rayo de sol) es la hipotenusa».
    poste(m, d) {
      const sombra = !!d.sombra, mk = d.marco || [];
      const XP = sombra ? 96 : 80;
      const s = Math.min((W - 24 - XP) / Math.max(m.ra, mk[0] || 0), (sombra ? 132 : 168) / Math.max(m.rb, mk[1] || 0));
      const r = [XP, SUELO], a = [XP + m.ra * s, SUELO], b = [XP, SUELO - m.rb * s];
      let fondo = suelo();
      if (sombra) fondo += `<rect x="${XP}" y="${SUELO - 2}" width="${n(m.ra * s)}" height="7" rx="3" fill="currentColor" fill-opacity="0.4"/>`;
      fondo += `<rect x="${XP - 4}" y="${n(b[1] - 6)}" width="8" height="${n(SUELO - b[1] + 6)}" rx="2" fill="currentColor" fill-opacity="0.18" ${tinta(1.5)}/>`;
      fondo += linea([XP - 14, b[1] + 8], [XP + 14, b[1] + 8], tinta(2.5));
      // 26 nov (dibujos reconocibles): el poste de luz se reconoce por los aisladores de la cruceta y los cables que se
      // van (tenues, hacia la izquierda, lejos de los rótulos); la veta del palo y su base de concreto.
      for (const dx of [-12, 0, 12]) fondo += `<path d="M${XP + dx - 2.5} ${n(b[1] + 7)}L${XP + dx - 2.5} ${n(b[1] + 2)}L${XP + dx + 2.5} ${n(b[1] + 2)}L${XP + dx + 2.5} ${n(b[1] + 7)}" fill="var(--card)" ${tinta(1.3)}/>`;
      const comba = (x0, y0, y1, baja) => Array.from({ length: 9 }, (_, i) => { const t = i / 8; return `${i ? 'L' : 'M'}${n(x0 + (6 - x0) * t)} ${n(y0 + (y1 - y0) * t + baja * 4 * t * (1 - t))}`; }).join('');
      fondo += `<path d="${comba(XP - 12, b[1] + 2, b[1] + 8, 10)}${comba(XP, b[1] + 2, b[1] + 2, 8)}" fill="none" ${tinta(1.2, 0.35)}/>`;
      fondo += linea([XP - 1, b[1] + 14], [XP - 1, SUELO - 10], tinta(1, 0.3));
      fondo += `<path d="M${XP - 7} ${SUELO}L${XP - 7} ${SUELO - 6}L${XP + 7} ${SUELO - 6}L${XP + 7} ${SUELO}" fill="var(--card)" ${tinta(1.5)}/>`;
      let frente = '';
      if (sombra) {
        // El sol, lejos, en la dirección del rayo (de la punta de la sombra hacia la punta del poste).
        const u = unit(resta(b, a)), k = Math.min(48, (b[1] - 22) / Math.abs(u[1] || 1e-9), (b[0] - 22) / Math.abs(u[0] || 1e-9));
        const c = suma(b, u, k);
        let rayos = '';
        for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; rayos += `M${n(c[0] + 12 * Math.cos(t))} ${n(c[1] + 12 * Math.sin(t))}L${n(c[0] + 17 * Math.cos(t))} ${n(c[1] + 17 * Math.sin(t))}`; }
        frente += `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="8" fill="currentColor" fill-opacity="0.25" ${tinta(1.5)}/><path d="${rayos}" fill="none" ${tinta(1.5)}/>`;
        frente += linea(b, a, `${tinta(2)} stroke-dasharray="5 5"`);
      } else {
        frente += linea(b, a, tinta(2)) + linea([a[0] - 3, SUELO - 4], [a[0] + 3, SUELO + 8], tinta(2.5));
      }
      return { r, a, b, s, fondo, frente, propios: [], punteado: sombra ? ['h'] : [] };
    },
    // repisa: «el ángulo recto está arriba, en la pared: el lado de enfrente del ángulo de abajo es horizontal».
    repisa(m, d) {
      const mk = d.marco || [];
      const XW = 66, YB = 72;
      const s = Math.min(216 / Math.max(m.rb, mk[1] || 0), 164 / Math.max(m.ra, mk[0] || 0));
      const r = [XW, YB], a = [XW, YB + m.ra * s], b = [XW + m.rb * s, YB];
      let fondo = adobe(6, 8, XW, H - 8) + linea([XW, 8], [XW, H - 8], tinta(2));
      fondo += `<rect x="${XW}" y="${YB - 9}" width="${n(m.rb * s + 14)}" height="8" rx="2" fill="currentColor" fill-opacity="0.2" ${tinta(1.5)}/>`;
      const frente = linea(r, b, tinta(3)) + linea(a, b, tinta(2.5))
        + `<circle cx="${n(a[0] + 3)}" cy="${n(a[1])}" r="2.5" fill="currentColor"/><circle cx="${n(b[0] - 4)}" cy="${n(b[1] + 3)}" r="2" fill="currentColor"/>`;
      return { r, a, b, s, fondo, frente, propios: [] };
    },
    // chacra: «una chacra con forma de triángulo rectángulo, vista desde arriba, con postes en la cerca».
    chacra(m) {
      const c = Math.hypot(m.ra, m.rb), alto = m.ra * m.rb / c, xr = m.ra * m.ra / c;
      const s = Math.min(236 / c, 140 / alto), y0 = 190, x0 = (W - c * s) / 2;
      const a = [x0, y0], b = [x0 + c * s, y0], r = [x0 + xr * s, y0 - alto * s];
      let fondo = poli([a, r, b], `fill="currentColor" fill-opacity="0.07" ${tinta(2)}`);
      let postes = '';
      for (const [p, q] of [[a, r], [r, b], [b, a]]) {
        const L = largo(resta(q, p)), k = Math.max(2, Math.round(L / 26));
        for (let i = 0; i < k; i++) { const t = suma(p, resta(q, p), i / k); postes += `<circle cx="${n(t[0])}" cy="${n(t[1])}" r="2.5" fill="currentColor"/>`; }
      }
      return { r, a, b, s, fondo: fondo + postes, frente: '', propios: [] };
    },
    // triangulo: «un triángulo rectángulo girado, con sus vértices nombrados, como en el examen».
    triangulo(m, d) {
      const g = (d.giro || 0) * Math.PI / 180, cg = Math.cos(g), sg = Math.sin(g);
      const rot = ([x, y]) => [x * cg - y * sg, x * sg + y * cg];
      const loc = { r: rot([0, 0]), a: rot([m.ra, 0]), b: rot([0, m.rb]) };
      const xs = Object.values(loc).map(p => p[0]), ys = Object.values(loc).map(p => p[1]);
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
      const s = Math.min(196 / w, 150 / h), cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
      const px = p => [W / 2 + (p[0] - cx) * s, 124 - (p[1] - cy) * s];
      const r = px(loc.r), a = px(loc.a), b = px(loc.b);
      let fondo = poli([a, r, b], `fill="currentColor" fill-opacity="0.05" ${tinta(2)}`);
      const v = d.vertices || {}, G = [(r[0] + a[0] + b[0]) / 3, (r[1] + a[1] + b[1]) / 3];
      let frente = '';
      for (const [k, p] of [['r', r], ['a', a], ['b', b]]) if (v[k]) {
        const u = unit(resta(p, G));
        frente += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="3" fill="currentColor"/>` + T.rotulo(p[0] + u[0] * 16, p[1] + u[1] * 16 + 6, v[k], { ancla: 'middle', peso: 700, tam: 16 });
      }
      return { r, a, b, s, fondo, frente, propios: [] };
    },
    // sombras: «a la misma hora, el sol pega igual al poste y a tu primo: sus rayos son paralelos y el ángulo θ es el
    // mismo». El poste es el triángulo principal; el primo, sus extras (más chico, a la derecha).
    sombras(m, d, col) {
      const mk = d.marco || [], alto2 = +d.primo || 1.5, k2 = alto2 / m.rb;
      const S = Math.max(m.ra, mk[0] || 0), XP = 60;
      const s = Math.min((W - 8 - XP) / (S * (1 + k2) + 0.9), 120 / Math.max(m.rb, mk[1] || 0));
      const r = [XP, SUELO], a = [XP + m.ra * s, SUELO], b = [XP, SUELO - m.rb * s];
      const XQ = XP + (S + 0.9) * s, r2 = [XQ, SUELO], a2 = [XQ + m.ra * k2 * s, SUELO], b2 = [XQ, SUELO - alto2 * s];
      let fondo = suelo();
      fondo += `<rect x="${XP}" y="${SUELO - 2}" width="${n(m.ra * s)}" height="7" rx="3" fill="currentColor" fill-opacity="0.4"/>`;
      fondo += `<rect x="${n(XQ)}" y="${SUELO - 2}" width="${n(m.ra * k2 * s)}" height="7" rx="3" fill="currentColor" fill-opacity="0.4"/>`;
      fondo += `<rect x="${XP - 4}" y="${n(b[1] - 6)}" width="8" height="${n(SUELO - b[1] + 6)}" rx="2" fill="currentColor" fill-opacity="0.18" ${tinta(1.5)}/>`;
      fondo += linea([XP - 14, b[1] + 8], [XP + 14, b[1] + 8], tinta(2.5));
      // El primo: cabeza, cuerpo, brazos y piernas, en el color de su lado (o tinta). Mide de los pies a la coronilla.
      const cp = col('primo'), hb = SUELO - b2[1], cab = Math.max(3.5, hb * 0.13);
      const cuello = b2[1] + 2 * cab, cadera = SUELO - hb * 0.45;
      let frente = `<circle cx="${n(XQ)}" cy="${n(b2[1] + cab)}" r="${n(cab)}" fill="var(--card)" stroke="${cp}" stroke-width="2"/>`
        + `<path d="M${n(XQ)} ${n(cuello)}L${n(XQ)} ${n(cadera)}M${n(XQ - 5)} ${n(SUELO)}L${n(XQ)} ${n(cadera)}L${n(XQ + 5)} ${n(SUELO)}M${n(XQ - 6)} ${n(cuello + hb * 0.25)}L${n(XQ)} ${n(cuello + 2)}L${n(XQ + 6)} ${n(cuello + hb * 0.25)}" fill="none" stroke="${cp}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      frente += sol(a, b) + linea(b, a, `${tinta(2)} stroke-dasharray="5 5"`) + linea(b2, a2, `${tinta(2)} stroke-dasharray="4 4"`);
      return { r, a, b, s, fondo, frente, propios: ['primo'], punteado: ['h', 'rayo2'],
        extras: { sombra2: [r2, a2], primo: [r2, b2], rayo2: [b2, a2] }, extraG: centro(r2, a2, b2),
        extraAng: { suelo2: { v: a2, p1: r2, p2: b2, R: 12 } },
        // El alto del primo a la izquierda de su cabeza y el largo de su rayo a la derecha: centrados se pisaban.
        lugar: { primo: { x: XQ - 5, y: b2[1] - 6, ancla: 'end' }, rayo2: { x: XQ + 7, y: b2[1] - 6, ancla: 'start' } } };
    },
    // senal: «una señal "Ceda el paso" es un triángulo equilátero; su altura la parte en dos triángulos rectángulos
    // iguales, cada uno con 30° abajo y 60° arriba». La mitad derecha es el triángulo principal.
    senal(m, d) {
      // Siempre del mismo tamaño en pantalla: al cambiar el lado, cambian las medidas y no la forma.
      const L = +((d.medidas || {}).lado) || 2, s = 190 / L;
      const cx = 150, YT = 60, TL = [cx - L * s / 2, YT], TR = [cx + L * s / 2, YT], V = [cx, YT + L * s * Math.sqrt(3) / 2];
      const r = [cx, YT], a = TR, b = V, YS = 236;
      const G = centro(TL, TR, V);
      let fondo = suelo(8, W - 6, YS) + `<rect x="${cx - 3}" y="${n(V[1])}" width="6" height="${n(YS - V[1])}" rx="2" fill="currentColor" fill-opacity="0.25" ${tinta(1.5)}/>`;
      fondo += poli([TL, TR, V], `fill="var(--card)" ${tinta(2.5)}`) + poli([r, a, b], 'fill="currentColor" fill-opacity="0.1" stroke="none"');
      // Sin el filete interior: cruzaba los rótulos (lector en frío, 17 nov).
      const frente = linea(r, b, `${tinta(2)} stroke-dasharray="6 5"`);
      // El rótulo de la altura va en la mitad sombreada (el triángulo que se usa), pegado a la línea punteada, a media
      // altura: arriba está el 60° y abajo la mitad se angosta.
      return { r, a, b, s, fondo, frente, propios: [], punteado: ['rb'], suelo: YS,
        extras: { izqLado: [TL, V], izqMedia: [TL, r] }, centro: G, lugar: { rb: { x: cx + 4, y: YT + 64, ancla: 'start', partir: true } } };
    },
    // loseta: «una loseta cuadrada partida por su diagonal da dos triángulos rectángulos iguales, con 45° y 45°».
    loseta(m, d) {
      const L = +((d.medidas || {}).lado) || 2, s = 190 / L, x0 = 56, y0 = 220;
      const BL = [x0, y0], BR = [x0 + L * s, y0], TR = [x0 + L * s, y0 - L * s], TL = [x0, y0 - L * s];
      const r = BR, a = BL, b = TR;
      // Las juntas de las losetas vecinas, tenues, arriba y a la izquierda (lejos de los rótulos).
      let fondo = `<path d="M${n(x0)} ${n(y0)}L${n(x0)} ${n(Math.max(8, TL[1] - 26))}M${n(x0)} ${n(TL[1])}L${n(Math.max(8, x0 - 40))} ${n(TL[1])}M${n(TL[0])} ${n(TL[1])}L${n(Math.min(W - 8, TR[0] + 30))} ${n(TL[1])}M${n(TR[0])} ${n(TL[1])}L${n(TR[0])} ${n(Math.max(8, TL[1] - 26))}" fill="none" ${tinta(1, 0.3)}/>`;
      fondo += poli([BL, BR, TR, TL], `fill="currentColor" fill-opacity="0.05" ${tinta(2)}`) + poli([r, a, b], 'fill="currentColor" fill-opacity="0.1" stroke="none"');
      return { r, a, b, s, fondo, frente: '', propios: [], extras: { arriba: [TL, TR], izq: [BL, TL] } };
    },
    // escuadras: «las dos escuadras del colegio son una media loseta (45° y 45°) y una media señal (30° y 60°)».
    escuadras(m, d) {
      // sola: solo la de 30° y 60°, más grande y al centro (cuando sus rótulos llevan unidades).
      // La de 45° más grande que antes (lector en frío, 17 nov: sus dos «45°» quedaban juntos en el medio) y las dos un poco
      // más arriba, para que no sobre lienzo encima.
      const c = +((d.medidas || {}).corto) || 1, s = (d.sola ? 106 : 80) / c, s45 = 100 / c, y0 = d.sola ? 200 : 190, X2 = 20, X1 = d.sola ? 52 : X2 + 100 + 26;
      const r2 = [X2, y0], a2 = [X2 + c * s45, y0], b2 = [X2, y0 - c * s45];
      const a = [X1, y0], r = [X1 + c * Math.sqrt(3) * s, y0], b = [r[0], y0 - c * s];
      // Sin el hueco del centro: en una escuadra tan chica, sus bordes le quitaban sitio a las letras de los ángulos.
      const escuadra = (p, q, t) => poli([p, q, t], `fill="currentColor" fill-opacity="0.1" ${tinta(2)}`);
      // Las marcas de los centímetros en los catetos de abajo, como en una escuadra de verdad.
      let m30 = '', m45 = '';
      for (let x = a[0] + 12; x < r[0] - 4; x += 12) m30 += `M${n(x)} ${y0}L${n(x)} ${y0 - 5}`;
      for (let x = r2[0] + 12; x < a2[0] - 14; x += 12) m45 += `M${n(x)} ${y0}L${n(x)} ${y0 - 5}`;
      if (d.sola) return { r, a, b, s, fondo: escuadra(r, a, b) + `<path d="${m30}" fill="none" ${tinta(1, 0.5)}/>`, frente: '', propios: [] };
      const fondo = escuadra(r2, a2, b2) + escuadra(r, a, b) + `<path d="${m30}${m45}" fill="none" ${tinta(1, 0.5)}/>`;
      return { r, a, b, s, fondo, frente: '', propios: [], extras: { c1: [r2, a2], c2: [r2, b2], d: [a2, b2] }, extraG: centro(r2, a2, b2),
        extraAng: { e1: { v: a2, p1: r2, p2: b2 }, e2: { v: b2, p1: r2, p2: a2 } }, extraRecto: [r2, a2, b2] };
    },
    // cuerda: «el albañil clava una estaca en la esquina, mide 4 m por un lado y 3 m por el otro; si la cuerda entre las
    // puntas mide 5 m, la esquina es recta». Visto desde arriba; el transportador mide θ en la punta de la base.
    cuerda(m, d) {
      const mk = d.marco || [], s = Math.min(130 / Math.max(m.ra, mk[0] || 0), 176 / Math.max(m.rb, mk[1] || 0));
      const XR = 92, YB = 212, r = [XR, YB], a = [XR + m.ra * s, YB], b = [XR, YB - m.rb * s];
      // El transportador: medio disco sobre la base, con su centro en la punta a.
      const R = 31;
      let marcas = '';
      for (let g = 10; g < 180; g += 10) { const t = Math.PI + g * Math.PI / 180, L = g % 30 === 0 ? 6 : 3; marcas += `M${n(a[0] + R * Math.cos(t))} ${n(a[1] + R * Math.sin(t))}L${n(a[0] + (R - L) * Math.cos(t))} ${n(a[1] + (R - L) * Math.sin(t))}`; }
      let fondo = `<path d="M${n(a[0] - R)} ${n(a[1])}A${R} ${R} 0 0 1 ${n(a[0] + R)} ${n(a[1])}Z" fill="currentColor" fill-opacity="0.08" ${tinta(1.5)}/><path d="${marcas}" fill="none" ${tinta(1, 0.6)}/>`;
      // Sin los adobes apilados de antes: nadie los explicaba (lector en frío, 17 nov).
      // Las tres cuerdas, en tinta (las que llevan color se pintan encima) y las estacas sobre todo.
      const frente = linea(r, a, tinta(2)) + linea(r, b, tinta(2)) + linea(a, b, tinta(2));
      // La lectura del transportador va a su derecha, sobre la base: ahí no llega la cuerda en ningún ángulo.
      return { r, a, b, s, fondo, frente, encima: estaca(r) + estaca(b) + estaca(a), propios: [], lugarAng: { a: { x: a[0] + R + 22, y: a[1] - 12 } } };
    },
    // techo: «el poste del centro parte el techo a dos aguas en dos triángulos rectángulos: la viga, el poste y la
    // calamina». La mitad derecha es el triángulo; la izquierda, su reflejo en tinta.
    techo(m, d) {
      const mk = d.marco || [], s = Math.min(144 / Math.max(m.ra, mk[0] || 0), 150 / Math.max(m.rb, mk[1] || 0));
      const cx = 160, YV = 196, r = [cx, YV], a = [cx + m.ra * s, YV], b = [cx, YV - m.rb * s], Lz = [cx - m.ra * s, YV];
      // La pared de la casa termina antes que la viga: lo que sobra es el alero, y ahí abajo va el rótulo «viga», que ya
      // no queda sobre la pared (lector en frío, 17 nov: parecía nombrar la pared).
      const vuelo = 56;
      let fondo = `<rect x="${n(Lz[0] + vuelo)}" y="${YV}" width="${n(a[0] - Lz[0] - 2 * vuelo)}" height="${H - 8 - YV}" fill="currentColor" fill-opacity="0.07" ${tinta(2)}/>`;
      fondo += `<rect x="${n(Lz[0] - 6)}" y="${YV}" width="${n(a[0] - Lz[0] + 12)}" height="6" rx="2" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
      fondo += `<rect x="${n(cx - 3)}" y="${n(b[1])}" width="6" height="${n(YV - b[1])}" fill="currentColor" fill-opacity="0.22" ${tinta(1.2)}/>`;
      // La calamina: una lámina ondulada sobre cada mitad (dos líneas y las ondas entre ellas).
      const onda = (p, q) => {
        const u = unit(resta(q, p)), nv = [u[1], -u[0]], L = largo(resta(q, p));
        const nv2 = nv[1] > 0 ? [-nv[0], -nv[1]] : nv;
        let o = linea(suma(p, nv2, 7), suma(q, nv2, 7), tinta(1.5));
        let t = '';
        for (let x = 6; x < L - 3; x += 9) { const c = suma(p, u, x); t += `M${n(c[0])} ${n(c[1])}L${n(c[0] + nv2[0] * 7)} ${n(c[1] + nv2[1] * 7)}`; }
        return o + `<path d="${t}" fill="none" ${tinta(1, 0.55)}/>`;
      };
      fondo += onda(Lz, b) + linea(Lz, b, tinta(2.5)) + onda(a, b);
      // La puerta de la casa.
      fondo += `<rect x="${cx + 26}" y="${H - 8 - 34}" width="20" height="34" rx="2" fill="none" ${tinta(1.5)}/>`;
      // El rótulo del poste va abajo a su izquierda, sobre la viga: arriba lo taparía el techo de la otra mitad.
      // La nota va cerca del techo, no arriba del todo: con un techo bajo quedaba un hueco.
      return { r, a, b, s, fondo, frente: '', propios: [], separa: { h: 20 }, notaY: Math.max(19, b[1] - 30),
        lugar: { rb: { x: cx - 10, y: YV - 10, ancla: 'end' }, ra: { x: a[0] - vuelo / 2, y: YV + 25, ancla: 'middle' } } };
    },
    // figura: «el triángulo rectángulo está escondido en la figura del examen: hay que verlo para usar la razón».
    figura(m, d) {
      const f = d.forma;
      let P = {}, main;
      if (f === 'diagonal') {
        const w = m.ra, h = m.rb, s = Math.min(200 / w, 150 / h), x0 = (W - w * s) / 2 - 8, y0 = 196;
        P = { A: [x0, y0], B: [x0 + w * s, y0], C: [x0 + w * s, y0 - h * s], D: [x0, y0 - h * s] };
        main = { r: 'B', a: 'A', b: 'C', extras: { CD: ['C', 'D'], DA: ['D', 'A'] }, s };
      } else if (f === 'medio') {
        const L = m.ra, s = Math.min(170 / L, 170 / L), x0 = (W - L * s) / 2, y0 = 206;
        P = { A: [x0, y0], B: [x0 + L * s, y0], C: [x0 + L * s, y0 - L * s], D: [x0, y0 - L * s] };
        P.M = [(P.C[0] + P.D[0]) / 2, P.D[1]];
        main = { r: 'D', a: 'A', b: 'M', extras: { AB: ['A', 'B'], BC: ['B', 'C'], MC: ['M', 'C'] }, s };
      } else if (f === 'semicirculo') {
        // El diámetro AB abajo y C en el arco: el ángulo en C es recto porque abarca media circunferencia.
        const dd = Math.hypot(m.ra, m.rb), s = 232 / dd, x0 = (W - dd * s) / 2, y0 = 206, t = Math.atan2(m.rb, m.ra);
        P = { A: [x0, y0], B: [x0 + dd * s, y0] };
        P.C = [x0 + m.ra * s * Math.cos(t), y0 - m.ra * s * Math.sin(t)];
        main = { r: 'C', a: 'A', b: 'B', extras: {}, s };
      } else {
        const men = +d.menor || 1, w = men + m.ra, h = m.rb, s = Math.min(232 / w, 150 / h), x0 = (W - w * s) / 2, y0 = 196;
        P = { A: [x0, y0], B: [x0 + w * s, y0], C: [x0 + men * s, y0 - h * s], D: [x0, y0 - h * s], H: [x0 + men * s, y0] };
        main = { r: 'H', a: 'B', b: 'C', extras: { AH: ['A', 'H'], DA: ['D', 'A'], CD: ['C', 'D'] }, s };
      }
      const pts = Object.values(P), G = centro(...pts);
      const R0 = f === 'semicirculo' ? (P.B[0] - P.A[0]) / 2 : 0;
      let fondo = f === 'semicirculo'
        ? `<path d="M${n(P.A[0])} ${n(P.A[1])}A${n(R0)} ${n(R0)} 0 0 1 ${n(P.B[0])} ${n(P.B[1])}Z" fill="currentColor" fill-opacity="0.05" ${tinta(2)}/>`
        : poli([P.A, P.B, P.C, P.D], `fill="currentColor" fill-opacity="0.05" ${tinta(2)}`);
      fondo += poli([P[main.r], P[main.a], P[main.b]], 'fill="currentColor" fill-opacity="0.08" stroke="none"');
      const frente = f === 'trapecio' ? linea(P.C, P.H, `${tinta(2)} stroke-dasharray="5 4"`) : f === 'medio' ? linea(P.A, P.M, tinta(2))
        : f === 'semicirculo' ? linea(P.A, P.C, tinta(2)) + linea(P.C, P.B, tinta(2)) : linea(P.A, P.C, tinta(2));
      const extras = {};
      for (const [k, [p, q]] of Object.entries(main.extras)) extras[k] = [P[p], P[q]];
      return { r: P[main.r], a: P[main.a], b: P[main.b], s: main.s, fondo, frente, propios: [], punteado: f === 'trapecio' ? ['rb'] : [],
        extras, centro: G, puntos: P,
        rectos: f === 'trapecio' ? [['A', 'H', 'D'], ['D', 'A', 'C']] : f === 'medio' ? [['B', 'C', 'A'], ['C', 'B', 'M']] : f === 'semicirculo' ? [] : [['D', 'A', 'C']] };
    },
  };

  // El color de un lado en un paso: un token, o [{ c, paso }] (el último cuyo paso ya llegó).
  const colorEn = (c, p) => {
    if (!Array.isArray(c)) return c;
    let out;
    for (const x of c) if (x && (x.paso || 0) <= p) out = x.c;
    return out;
  };
  // Lo que se ve de un texto con pasos: el último cuyo paso ya llegó.
  const textoEn = (t, p) => {
    if (t === undefined || t === null || t === '') return null;
    if (!Array.isArray(t)) return String(t);
    let out = null;
    for (const x of t) if (x && (x.paso || 0) <= p) out = x.t;
    return out;
  };

  // Rótulo de un lado: de una a tres líneas ([texto, color]) junto a su mitad, del lado de afuera del triángulo.
  function rotulosLado(p, q, G, lineas, dist = 12) {
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let nv = unit([-(q[1] - p[1]), q[0] - p[0]]);
    if ((mid[0] - G[0]) * nv[0] + (mid[1] - G[1]) * nv[1] < 0) nv = [-nv[0], -nv[1]];
    const P = suma(mid, nv, dist), alto = lineas.length * 18;
    const ancla = Math.abs(nv[0]) < 0.4 ? 'middle' : nv[0] > 0 ? 'start' : 'end';
    const arriba = nv[1] > 0.4 ? P[1] : nv[1] < -0.4 ? P[1] - alto : P[1] - alto / 2;
    return lineas.map(([t, color], i) => T.rotulo(P[0], arriba + 13 + i * 18, t, { ancla, peso: 700, tam: i === 0 ? 16 : 14, color, min: M, max: W - M })).join('');
  }

  // ¿El segmento p–q cruza la caja [x0, y0, x1, y1]? Recorte de Liang-Barsky.
  function cruza(p, q, c) {
    let t0 = 0, t1 = 1;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - c[0]], [dx, c[2] - p[0]], [-dy, p[1] - c[1]], [dy, c[3] - p[1]]]) {
      if (pp === 0) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }

  // Arco de un ángulo agudo en v, entre los lados que van a p1 y p2, con su letra sobre la bisectriz: tan lejos del
  // vértice como haga falta para que la letra no toque ningún segmento de la figura (en ángulos chicos, más lejos).
  function arco(v, p1, p2, an, segs, R = 24) {
    const t1 = Math.atan2(p1[1] - v[1], p1[0] - v[0]), t2 = Math.atan2(p2[1] - v[1], p2[0] - v[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
    const c = T.color(an.color || 'h');
    const pt = (t, rr) => [v[0] + rr * Math.cos(t), v[1] + rr * Math.sin(t)];
    let s = '', Ra = R;
    if (an.texto) {
      // La caja de la letra: de la línea base − 12,8 a + 4 (con la letra 5,5 bajo el centro) y 2 de aire.
      const w = T.ancho(an.texto, 16, 700), caja = (x, y) => [x - w / 2 - 3, y - 10, x + w / 2 + 3, y + 11];
      let rr = 20, tx, ty;
      if (an.lugar) [tx, ty] = [an.lugar.x, an.lugar.y];
      else {
        for (; rr < 130; rr += 2) {
          [tx, ty] = pt(t1 + dt / 2, rr);
          const k = caja(tx, ty);
          if (![[v, p1], [v, p2], [p1, p2]].concat(segs || []).some(([p, q]) => cruza(p, q, k))) break;
        }
        // El arco sigue a la letra: queda justo antes de su caja (medio largo de la caja sobre la bisectriz y 4 de aire).
        const tb = t1 + dt / 2, medio = Math.abs(Math.cos(tb)) * (w / 2 + 3) + Math.abs(Math.sin(tb)) * 10;
        Ra = Math.max(11, Math.min(rr - medio - 3, 70));
      }
      s += T.rotulo(tx, ty + 5.5, an.texto, { color: an.color || 'h', ancla: 'middle', peso: 700, tam: 16 });
    }
    const [ax, ay] = pt(t1, Ra), [bx, by] = pt(t2, Ra);
    return `<path d="M${n(ax)} ${n(ay)}A${n(Ra)} ${n(Ra)} 0 0 ${dt > 0 ? 1 : 0} ${n(bx)} ${n(by)}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>` + s;
  }
  // Cuadradito de un ángulo recto en v, entre los lados que van a p y q.
  function cuadradito(v, p, q, lado = 11) {
    const u1 = unit(resta(p, v)), u2 = unit(resta(q, v));
    const p1 = suma(v, u1, lado), p3 = suma(v, u2, lado), p2 = suma(p1, u2, lado);
    return `<path d="M${n(p1[0])} ${n(p1[1])}L${n(p2[0])} ${n(p2[1])}L${n(p3[0])} ${n(p3[1])}" fill="none" ${tinta(2)}/>`;
  }

  function geometria(d = {}) {
    const f = OBJETOS[d.objeto];
    if (!f) return null;
    const N = normal(d), m = { ra: +N.med.ra || 1, rb: +N.med.rb || 1 };
    return f(m, d, k => T.color(colorEn((N.lados[k] || {}).color, 0)));
  }
  // Todos los segmentos con nombre de una figura: los tres lados del triángulo principal y los extras.
  const segmentos = g => Object.assign({ ra: [g.r, g.a], rb: [g.r, g.b], h: [g.a, g.b] }, g.extras || {});

  // Qué es cada lado de la figura, nombrado desde un agudo (para la regla de colores de la unidad: el opuesto naranja, el
  // adyacente turquesa, la hipotenusa en tinta; auditoría del 17 nov). Desde θ si la figura lo rotula; si marca un solo
  // agudo, desde ese; si marca los dos (o ninguno), desde el de referencia del objeto: el de abajo, y en la señal la
  // punta de 30° (DESDE). Así un mismo objeto (la señal, la escuadra) no cambia de colores de una figura a otra.
  // papeles(datos) → { desde: 'a' | 'b', papel: { ra, rb, h, …extras } } con 'co', 'ca', 'h' o null (un lado que no es
  // de un triángulo de la figura, como CD en el trapecio: va en tinta).
  const DESDE = { senal: 'b' };
  // Los triángulos extras: el del primo (mismo θ, en el suelo) y la escuadra de 45° (desde su ángulo de abajo, e1).
  const PAPEL_EXTRAS = { sombras: { primo: 'co', sombra2: 'ca', rayo2: 'h' }, escuadras: { c1: 'ca', c2: 'co', d: 'h' } };
  function papeles(d = {}) {
    const g = geometria(d);
    if (!g) return null;
    const N = normal(d), marca = k => N.angulos[k] !== undefined && N.angulos[k] !== null;
    const esTheta = k => { const t = marca(k) ? N.angulos[k].texto : null; return Array.isArray(t) ? t.some(x => x && x.t === 'θ') : t === 'θ'; };
    const desde = esTheta('a') ? 'a' : esTheta('b') ? 'b' : marca('a') !== marca('b') ? (marca('a') ? 'a' : 'b') : DESDE[d.objeto] || 'a';
    const papel = { ra: desde === 'a' ? 'ca' : 'co', rb: desde === 'a' ? 'co' : 'ca', h: 'h' };
    const cambia = { co: 'ca', ca: 'co', h: 'h' }, ex = PAPEL_EXTRAS[d.objeto] || {};
    for (const k of Object.keys(g.extras || {})) papel[k] = ex[k] ? (d.objeto === 'sombras' && desde === 'b' ? cambia[ex[k]] : ex[k]) : null;
    return { desde, papel };
  }
  // Los colores que toma la línea de cada lado en algún paso (para las pruebas de colores de la unidad).
  function coloresDe(d = {}) {
    const N = normal(d), out = {};
    for (const [k, st] of Object.entries(N.lados)) {
      if (!st || st.color === undefined) continue;
      out[k] = (Array.isArray(st.color) ? st.color.map(x => x && x.c) : [st.color]).filter(Boolean);
    }
    return out;
  }

  function dibujar(d = {}, estado = {}) {
    const g = geometria(d);
    if (!g) return T.svg(W, H, '', { alt: alt(d) });
    const N = normal(d), final = !!estado.final;
    const p = final ? Infinity : Math.max(0, Number.isFinite(estado.paso) ? estado.paso : 0);
    const ve = x => x && (x.paso || 0) <= p;
    const lados = segmentos(g), todos = Object.values(lados).concat(g.evitar || []);
    // Los lados con color van encima del dibujo del objeto (si no, su línea en tinta los tapa: el cable, la rampa, el
    // tirante) y debajo de lo que el objeto pone «encima» (las estacas de la cuerda).
    let cuerpo = g.fondo + g.frente;
    for (const k of Object.keys(lados)) {
      const st = N.lados[k], c = st && colorEn(st.color, p);
      if (!c || !ve(st) || (g.propios || []).includes(k)) continue;
      const [a, b] = lados[k];
      cuerpo += linea(a, b, `stroke="${T.color(c)}" stroke-width="3" stroke-linecap="round"${(g.punteado || []).includes(k) ? ' stroke-dasharray="6 5"' : ''}`);
    }
    cuerpo += g.encima || '';
    let marcas = '';
    if (d.recto !== false) {
      marcas += cuadradito(g.r, g.a, g.b);
      if (g.extraRecto) marcas += cuadradito(...g.extraRecto);
      for (const [v, p1, p2] of g.rectos || []) marcas += cuadradito(g.puntos[v], g.puntos[p1], g.puntos[p2], 9);
    }
    // Un ángulo puede cambiar de texto con los pasos (37° → 36,87°), igual que un lado.
    for (const k of Object.keys(N.angulos)) if (N.angulos[k] && Array.isArray(N.angulos[k].texto)) N.angulos[k] = Object.assign({}, N.angulos[k], { texto: textoEn(N.angulos[k].texto, p) });
    for (const k of ['a', 'b']) {
      const an = N.angulos[k];
      if (!ve(an)) continue;
      const v = k === 'a' ? g.a : g.b, otro = k === 'a' ? g.b : g.a;
      marcas += arco(v, g.r, otro, (g.lugarAng || {})[k] ? Object.assign({}, an, { lugar: g.lugarAng[k] }) : an, todos);
    }
    for (const [k, ea] of Object.entries(g.extraAng || {})) {
      const an = N.angulos[k];
      if (!ve(an)) continue;
      marcas += arco(ea.v, ea.p1, ea.p2, an, todos, ea.R);
    }
    // Los nombres de los vértices (figuras de examen), hacia afuera del centro de la figura.
    let textos = '';
    if (g.puntos) for (const [nom, q] of Object.entries(g.puntos)) {
      const u = unit(resta(q, g.centro));
      marcas += `<circle cx="${n(q[0])}" cy="${n(q[1])}" r="2.5" fill="currentColor"/>`;
      textos += T.rotulo(q[0] + u[0] * 15, q[1] + u[1] * 15 + 6, nom, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    }
    const G = g.centro || [(g.r[0] + g.a[0] + g.b[0]) / 3, (g.r[1] + g.a[1] + g.b[1]) / 3];
    for (const k of Object.keys(lados)) {
      const st = N.lados[k];
      if (!st) continue;
      const base = st.colorTexto || colorEn(st.color, p);
      const lin = [[st.texto, base], [st.texto2, st.color2 === undefined ? base : colorEn(st.color2, p)], [st.texto3, st.color3 === undefined ? base : colorEn(st.color3, p)]]
        .map(([t, c]) => [textoEn(t, p), c]).filter(x => x[0] !== null);
      if (!lin.length) continue;
      const [a, b] = lados[k], lu = (g.lugar || {})[k];
      // partir: un rótulo de una línea con espacio se escribe en dos (la medida arriba, la unidad abajo) donde falta ancho.
      if (lu && lu.partir && lin.length === 1 && / /.test(lin[0][0])) { const t = lin[0][0], i = t.lastIndexOf(' '); lin.splice(0, 1, [t.slice(0, i), lin[0][1]], [t.slice(i + 1), lin[0][1]]); }
      if (lu) textos += lin.map(([t, c], i) => T.rotulo(lu.x, lu.y - (lin.length - 1 - i) * 18, t, { ancla: lu.ancla, peso: 700, tam: i === 0 ? 16 : 14, color: c, min: M, max: W - M })).join('');
      else textos += rotulosLado(a, b, ['ra', 'rb', 'h'].includes(k) ? G : g.extraG || G, lin, (g.separa || {})[k]);
    }
    const nota = textoEn(d.nota, p);
    if (nota) textos += T.rotulo(W / 2, g.notaY || 19, nota, { ancla: 'middle', peso: 700, tam: 15, min: M, max: W - M });
    const nombre = d.objeto === 'poste' && d.sombra ? 'poste-sombra' : d.objeto === 'figura' ? `figura-${d.forma}` : d.objeto;
    return T.svg(W, H, obj(nombre, cuerpo) + marcas + halo(textos), { alt: alt(d) });
  }

  function alt(d = {}) {
    const forma = { diagonal: 'Un rectángulo ABCD con su diagonal AC', medio: 'Un cuadrado ABCD con M, el punto medio de DC, unido con A',
      trapecio: 'Un trapecio ABCD con la altura CH',
      semicirculo: 'Una semicircunferencia de diámetro AB con el punto C en el arco, unido con A y con B' }[d.forma];
    const base = {
      escalera: 'Una escalera apoyada en la pared de una casa de adobe', rampa: 'Una rampa que sube desde el piso hasta una vereda',
      poste: d.sombra ? 'Un poste y su sombra en el suelo, con el rayo de sol que pasa por su punta' : 'Un poste sostenido por un cable que baja hasta una estaca',
      repisa: 'Una repisa en la pared, con un brazo horizontal y un tirante', chacra: 'Una chacra con forma de triángulo rectángulo, vista desde arriba',
      triangulo: 'Un triángulo rectángulo girado',
      sombras: 'Un poste y, a su derecha, una persona, cada uno con su sombra y el rayo de sol que pasa por su punta, a la misma hora',
      senal: 'Una señal triangular de «Ceda el paso», partida por su altura en dos triángulos rectángulos iguales',
      loseta: 'Una loseta cuadrada del piso, partida por su diagonal en dos triángulos rectángulos iguales',
      escuadras: 'Las dos escuadras del colegio: la de 45° a la izquierda y la de 30° y 60° a la derecha',
      cuerda: 'Una esquina marcada con tres estacas y cuerdas, vista desde arriba, con un transportador en la punta de la base',
      techo: 'Un techo de calamina a dos aguas sobre una casa, partido por el poste del centro',
      figura: forma,
    }[d.objeto];
    if (!base) return 'Un dibujo.';
    const N = normal(d), nom = d.objeto === 'figura' ? (FORMAS[d.forma] || {}).nombres || {} : NOMBRES[d.objeto === 'poste' && d.sombra ? 'sombra' : d.objeto] || {};
    const plano = t => (Array.isArray(t) ? t.map(x => x && x.t).filter(Boolean).join(', ') : t);
    const lados = Object.keys(N.lados).filter(k => N.lados[k] && N.lados[k].texto)
      .map(k => `${nom[k] || k}: ${[N.lados[k].texto, N.lados[k].texto2, N.lados[k].texto3].filter(Boolean).map(plano).join(', ')}`);
    const angs = Object.keys(N.angulos).filter(k => N.angulos[k] && N.angulos[k].texto).map(k => plano(N.angulos[k].texto));
    const v = d.vertices ? `; vértices ${['r', 'a', 'b'].map(k => d.vertices[k]).filter(Boolean).join(', ')}, recto en ${d.vertices.r || ''}` : '';
    const nt = d.nota ? `; ${plano(d.nota)}` : '';
    return `${base}${v}${lados.length ? `; ${lados.join('; ')}` : ''}${angs.length ? `; ángulos ${angs.join(' y ')}` : ''}${nt}.`;
  }

  return { id: 'trig-objeto', dibujar, alt, geometria, papeles, coloresDe, OBJETOS: Object.keys(OBJETOS), constantes: { W, H, M, SUELO } };
});
