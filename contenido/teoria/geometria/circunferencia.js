/*
 * Teoría de «Circunferencia y ángulos en ella» (geometria.circunferencia), para 5.º de secundaria y preuniversitario.
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 5); Elementos III.3 (el
 * radio perpendicular a una cuerda la parte en dos), III.18 (tangente ⟂ radio), III.20 (central e inscrito), III.22
 * (cuadrilátero inscrito). Compañera: Neri (nutria). Piezas: geo-objeto (la escena «redondo», dibujos de prueba: el tanque
 * echado, la bandeja con su plato, los círculos de luz, la pileta con faroles y fotógrafo, la plaza con veredas, y las
 * figuras de examen) y geo-figura (las mesas del laboratorio).
 *
 * Etapa 7 del plan de calidad (19 nov): docs/etapa7/propuesta-geometria.md (Gerson delegó el criterio; revisa después).
 * Seis ideas, con los seis id de antes y otro orden: tangentes (ahora «Radio, cuerda y tangente»), poncelet-pitot (con las
 * tangentes iguales), posiciones, inscrito, interior-exterior y cuadrilatero-inscrito; se conservan los id de las tres
 * mesas. La práctica es plantillas/geo-circunferencia (tipos por idea). Con calidad: 2 desde el cierre (lector en frío y auditor).
 *
 * REGLA DE COLORES DE LA UNIDAD (la del curso: Triángulos, Congruencia y Polígonos; molde §5b):
 *   - todo ángulo dado en carmín (h); un ángulo que se pide va con «?» en tinta;
 *   - los arcos son datos: el que abarca el ángulo (o el mayor, o el lejano) en naranja (o); el otro, en turquesa (i);
 *   - los largos dados naranja y turquesa: la cuerda naranja y el radio turquesa (idea 1); en la bandeja, AB y CD naranja,
 *     BC y DA turquesa, y los tramos de la esquina naranja (idea 2); el círculo grande naranja y el chico turquesa (idea 3);
 *     lo que no es dato (OM, la distancia d entre centros, la hipotenusa) y lo pedido, en tinta;
 *   - el violeta (f) solo en el texto del resuelto y en la respuesta, nunca en una figura; el verde no se usa;
 *   - las marcas de igualdad van siempre sobre una llave, nunca sobre el lado.
 *   La comprueba circunferencia.test.js en todas las figuras.
 * Notación: «arco AB» en palabras (en grados, como su ángulo central); m∠APB; x sin «°»; O el centro, r el radio (r₁ ≥ r₂
 * con dos circunferencias), d la distancia entre centros (solo en la idea 3), h la altura del agua (solo en la idea 1), a, b
 * y c los catetos y la hipotenusa (solo en Poncelet). Donde la figura tiene puntos A, B, C, ningún resuelto nombra una
 * alternativa por su letra: se explican por su valor.
 * Figuras de ejercicio: sin escala si lo pedido se puede medir, con «El dibujo no está a escala.» y lo pedido dibujado lejos
 * de su valor (decisión 10).
 * Pitágoras es un dato (se prueba en Relaciones métricas), siempre con ternos enteros.
 * Códigos de error (todos hipótesis de aula, sin medir, salvo GE12, GE15 y GE16 del informe; docs/investigacion/
 * geometria-ideas-erroneas.md, «Circunferencia»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: usar el radio (perpendicular a la cuerda y a la tangente), las tangentes iguales y el arco que abarca cada
 *     ángulo para hallar largos y ángulos en la circunferencia.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla una cuerda, una tangente o un radio; un lado de un cuadrilátero circunscrito; la posición
 *     de dos circunferencias; un ángulo central, inscrito, semiinscrito, interior o exterior; un ángulo de un cuadrilátero
 *     inscrito.
 *   Orden de atención: 1.º el objeto (tanque, bandeja, luces, pileta, plaza) · 2.º la misión · acción: el control · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿mitad, semisuma o semidiferencia?»: depende de dónde está el vértice.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'), require('../../../nucleo/kit/piezas/geo-objeto.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura'], root.Kit.piezas['geo-objeto']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G, PO) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  const cm = n => `${f(n)} cm`;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  // Las opciones: la correcta y los errores que dan un valor distinto (y positivo); siempre 4 si se puede.
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || d.valor <= 0 || (d.entero && !Number.isInteger(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  // «Ahora tú» no repite un ejemplo de su idea (lección M3 de Congruencia): firma de números y pregunta.
  const firmaDe = t => { const q = Kit.plano(t); return `${(q.match(/\d+(?:[  ]\d{3})*(?:,\d+)?/g) || []).join(' ')}|${((q.match(/¿[^?]*\?/g) || []).pop() || '').replace(/\d+(?:,\d+)?/g, '#')}`; };
  const firmasDe = ejs => new Set(ejs.map(e => firmaDe(e.enunciado)));
  function conCuatro(caso, r, vetadas) {
    for (let i = 0; i < 300; i++) { const c = caso(r); if (c && c.opciones.length >= 4 && !(vetadas && vetadas.has(firmaDe(c.pregunta)))) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Ayudantes de figura (geo-objeto, escena «redondo») ----------
  const GO = 'geo-objeto';
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dH = t => ({ v: 'c-h', t }), dF = t => ({ v: 'c-f', t });
  // Entre dos igualdades, «y» o una flecha (un «·» se leía como otra igualdad).
  const Y = '   y   ', FL = '   →   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x && x.t ? Object.assign({}, x, { t: junto(x.t) }) : x);
  const fig = (datos, estado = {}) => ({ pieza: GO, datos, estado });
  const RAD = Math.PI / 180;
  const NO_ESC = ' El dibujo no está a escala.';
  // Los de antes (las mesas y las ideas que todavía usan geo-figura): radio 3, centro O.
  const R = 3, O = [0, 0], en = g => U.polar(O, R, g);
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, q) => G.aPlano(datos, q);
  const rumbo = (q, corte = 0) => { let g = U.grados(Math.atan2(q[1], q[0])); while (g < corte) g += 360; while (g >= corte + 360) g -= 360; return g; };
  const sep = '   ·   ';

  // Una figura con circunferencias, a escala de geo-figura, dentro de la escena «redondo» de geo-objeto.
  //   c: { O: [x, y], r }       la circunferencia principal (sin c, no hay)
  //   pts: { id: grados } (sobre la principal) | { id: [x, y] }; letra: { id: 'texto' | null } (sin entrada, la letra es
  //        el id; null, sin letra). Un id que empieza por «~» es un punto de ayuda: sin punto ni letra.
  //   segs: [[de, a, { color, discontinua, grosor, recta, desde, hasta }]]
  //   angs: [{ en, de, a, texto, color, marcas, radio, desde, hasta }]
  //   arcos: [{ de, a, color, texto, desde, hasta }]: el arco de «de» a «a» en sentido antihorario, sobre la principal;
  //          su rótulo va afuera, junto a su punto medio
  //   circs: [{ centro, r, color, grosor, discontinua, desde, hasta }]: más circunferencias (o la principal con color)
  //   lados (ladosRot), llaves, libres, regiones, obj: { tipo, … }, vista, alto, alt, sinEscala, evita, conPunto: [ids]
  function circ(o) {
    const C = o.c, pos = {}, puntos = [];
    const ang = {};
    for (const [id, v] of Object.entries(o.pts || {})) {
      const p = Array.isArray(v) ? v : U.polar(C.O, C.r, v);
      pos[id] = p;
      if (!Array.isArray(v)) ang[id] = v;
      const ayuda = id[0] === '~', letra = o.letra && Object.prototype.hasOwnProperty.call(o.letra, id) ? o.letra[id] : id;
      const q = { id, x: p[0], y: p[1] };
      if (ayuda || (o.sinPunto || []).includes(id)) q.sinPunto = true;
      if (!ayuda && letra) Object.assign(q, { rotulo: letra, lado: Array.isArray(v) ? 90 : v });
      const vis = (o.ver || {})[id];
      if (vis) Object.assign(q, vis);
      puntos.push(q);
    }
    const segmentos = (o.segs || []).map(([de, a, x]) => Object.assign({ de, a }, x || {}));
    const angulos = (o.angs || []).map(a => Object.assign({ radio: 18, holgura: 6 }, a));
    const arcos = [], libres = (o.libres || []).slice();
    (o.arcos || []).forEach((a, k) => {
      let g1 = ang[a.de], g2 = ang[a.a];
      if (g1 === undefined) g1 = U.grados(Math.atan2(pos[a.de][1] - C.O[1], pos[a.de][0] - C.O[0]));
      if (g2 === undefined) g2 = U.grados(Math.atan2(pos[a.a][1] - C.O[1], pos[a.a][0] - C.O[0]));
      while (g2 <= g1) g2 += 360;
      arcos.push(Object.assign({ centro: C.O, r: C.r, de: g1, a: g2, color: a.color, grosor: 'variable' }, a.desde !== undefined ? { desde: a.desde } : {}, a.hasta !== undefined ? { hasta: a.hasta } : {}));
      if (a.texto) {
        const m = a.en === undefined ? (g1 + g2) / 2 : g1 + (g2 - g1) * a.en, id = `~a${k}`, p = U.polar(C.O, C.r, m);
        puntos.push({ id, x: p[0], y: p[1], sinPunto: true });
        libres.push(Object.assign({ en: id, dir: a.dirTexto !== undefined ? a.dirTexto : a.dentro ? m + 180 : m, dist: a.dist || 5, texto: a.texto, color: a.color }, a.desde !== undefined ? { desde: a.desde } : {}, a.hasta !== undefined ? { hasta: a.hasta } : {}));
      }
    });
    const circulos = (o.circs || (C ? [{ centro: C.O, r: C.r }] : [])).map(x => Object.assign({}, x));
    const fg = { alt: o.alt, alto: o.alto || 240, puntos, segmentos, angulos, circulos, arcos };
    if (o.regiones) fg.regiones = o.regiones;
    if (o.rotulos) fg.rotulos = o.rotulos;
    const xs = puntos.map(q => q.x).concat(circulos.flatMap(c => { const k = Array.isArray(c.centro) ? c.centro : pos[c.centro]; return [k[0] - c.r, k[0] + c.r]; }));
    const ys = puntos.map(q => q.y).concat(circulos.flatMap(c => { const k = Array.isArray(c.centro) ? c.centro : pos[c.centro]; return [k[1] - c.r, k[1] + c.r]; }));
    const mx = o.mx === undefined ? 0.9 : o.mx;
    fg.vista = o.vista || { x: [Math.min(...xs) - mx, Math.max(...xs) + mx], y: [Math.min(...ys) - mx, Math.max(...ys) + mx] };
    // La letra de un punto de la circunferencia no va a lo largo del borde (la cruzaría): se esquivan sus dos tangentes.
    const evita = Object.assign({}, o.evita || {});
    for (const [id, g] of Object.entries(ang)) evita[id] = (evita[id] || []).concat([g + 90, g - 90]);
    PO.acomodarLetras(fg, puntos.filter(q => q.rotulo && !(o.fijas || []).includes(q.id)).map(q => q.id), evita);
    return Object.assign({ objeto: 'redondo', tipo: 'examen' }, o.obj || {}, { figura: fg },
      o.llaves ? { llaves: o.llaves } : {}, o.lados ? { ladosRot: o.lados } : {}, libres.length ? { libres } : {}, o.sinEscala ? { sinEscala: true } : {});
  }
  // ¿Caben los rótulos? (geo-objeto)
  const cabe = F => PO.escenaCabe(F);
  // Un punto de la circunferencia de centro c y radio r, a g grados.
  const sobre = (c, r, g) => U.polar(c, r, g);

  // Datos (una línea cada uno; herramientas, no el paso hecho).
  const D_RADIOS = 'Todos los radios de una circunferencia miden igual; el diámetro mide dos radios.';
  const D_PERP = 'El radio perpendicular a una cuerda la parte en dos mitades iguales.';
  // (ecuaciones-ancho, 19 nov: «cateto² + cateto² = ⏎ hipotenusa²» se partía en los Datos; dicho en palabras, no.)
  const D_PIT = 'Pitágoras: en un triángulo rectángulo, la suma de los cuadrados de los catetos es el cuadrado de la hipotenusa.';
  const D_TAN = 'La tangente es perpendicular al radio que llega al punto de contacto.';
  const D_EQUI = 'Dos cuerdas a la misma distancia del centro miden igual.';
  const D_ISO = 'En un triángulo isósceles, los dos ángulos de la base miden igual.';
  const D_TRI = 'En todo triángulo, los tres ángulos interiores suman 180°.';
  // Ternos de Pitágoras: [hipotenusa, cateto, cateto].
  const TERNOS = [[5, 3, 4], [10, 6, 8], [13, 5, 12], [15, 9, 12], [17, 8, 15], [20, 12, 16], [25, 7, 24], [25, 15, 20], [26, 10, 24], [29, 20, 21], [30, 18, 24], [34, 16, 30], [39, 15, 36], [41, 9, 40], [50, 14, 48], [50, 30, 40], [51, 24, 45], [52, 20, 48], [65, 25, 60], [65, 33, 56], [65, 39, 52]];

  // ======================= Idea 1: radio, cuerda y tangente =======================
  // Objeto de la primera pantalla: el tanque de agua cilíndrico echado en el piso, visto de frente (geo-objeto, escena
  // «redondo», tipo «tanque»; dibujo de prueba): su borde es la circunferencia, la superficie del agua es una cuerda y el
  // piso, una tangente.
  // Cambia: la altura del agua h. · Permanece: el radio, 50 cm. · Progresa: el ancho de la superficie. · Se reserva: la
  // superficie por encima del centro (la predicción) y el piso como tangente (Mira). · Debe verse: M en el medio de AB.
  const RT = 3, KT = RT / 50;   // el tanque: radio 3 en el plano = 50 cm
  const VTQ = { x: [-4.3, 4.3], y: [-3.85, 3.55] };
  // El agua hasta la cuerda de altura y (en el plano): el arco de abajo, de A a B pasando por el fondo.
  function aguaHasta(y) {
    const x = Math.sqrt(Math.max(0, RT * RT - y * y)), tA = Math.atan2(y, -x);
    let tB = Math.atan2(y, x); if (tB <= tA) tB += 2 * Math.PI;
    return Array.from({ length: 37 }, (_, k) => { const t = tA + (tB - tA) * k / 36; return [RT * Math.cos(t), RT * Math.sin(t)]; });
  }
  // El tanque con el agua a h cm. o: { radios: false (sin OA ni OB), radio: texto del radio OA, cuerda: texto de AB,
  //   perp: false (sin OM ni M), regla: [h1, h2] (la regla del costado con esas dos marcas), otra: h (la segunda cuerda
  //   CD, a esa altura), textoCD, corteCD, corteT (desde qué corte se ven T, OT y su ángulo recto), anguloT: false,
  //   cortePerp, llavesAM (desde qué corte van las llaves de AM y MB), hastaAB (hasta qué corte se ven A, B, M y lo suyo), alt }
  function figTanque(h, o = {}) {
    const y = -RT + h * KT, x = Math.sqrt(Math.max(0, RT * RT - y * y));
    const pts = { O: [0, 0], A: [-x, y], B: [x, y], T: [0, -RT], '~p1': [-1, -RT], '~p2': [1, -RT], '~c1': sobre([0, 0], RT, 238), '~c2': sobre([0, 0], RT, 302), '~abajo': [0, -RT] };
    const perp = o.perp !== false && Math.abs(y) > 0.05, hab = o.hastaAB;
    if (perp) pts.M = [0, y];
    const hasta = x => (hab === undefined ? x : Object.assign({ hasta: hab }, x));
    const letra = { T: o.corteT === undefined ? null : 'T' };
    // Con el agua baja, A y B van de costado (abajo tocarían el piso); con la segunda cuerda, O también (arriba va ON).
    const bajo = h < 25, costado = (lado, x) => (bajo ? Object.assign({ lado: h < 8 ? (lado === 180 ? 160 : 20) : (lado === 180 ? 200 : 340) }, x) : x);
    // M: arriba a la izquierda con el agua baja; cerca del centro, abajo a la izquierda (ahí no hay trazo; abajo puede ir
    // OT); sobre el centro, arriba.
    const ladoM = h < 25 ? 125 : h < 50 ? 235 : 90;
    const ver = { O: { lado: o.otra !== undefined ? 0 : 90 }, T: o.corteT === undefined ? { sinPunto: true } : { desde: o.corteT, lado: 270, lejos: 3 }, M: hasta({ desde: o.cortePerp || 0, lado: ladoM }), A: hasta(costado(180, {})), B: hasta(costado(0, {})) };
    const segs = [['~p1', '~p2', { recta: true }], ['A', 'B', hasta({ color: 'o', grosor: 'variable' })]];
    if (o.radios !== false) segs.push(['O', 'A', hasta({ color: 'i' })], ['O', 'B', hasta({ color: 'i' })]);
    const angs = [];
    if (perp) { segs.push(['O', 'M', hasta({ discontinua: true, grosor: 'fino', desde: o.cortePerp || 0 })]); angs.push(hasta({ en: 'M', de: 'O', a: 'B', desde: o.cortePerp || 0 })); }
    if (o.corteT !== undefined) { segs.push(['O', 'T', { color: 'i', desde: o.corteT }]); if (o.anguloT !== false) angs.push({ en: 'T', de: 'O', a: '~p2', desde: o.corteT }); }
    const lados = [];
    // (Sesión, 19 nov: el rótulo del radio va sobre un radio propio, OR, con su llave; junto a OA, en el triángulo, podía
    // leerse como OM.)
    if (o.radio) { pts.R = sobre([0, 0], RT, 35); ver.R = { lado: 35 }; segs.push(['O', 'R', { color: 'i' }]); lados.push({ de: 'O', a: 'R', texto: o.radio, color: 'i', ref: '~abajo', dist: 15 }); }
    if (o.cuerda) lados.push(hasta({ de: 'A', a: 'B', texto: perp ? `AB = ${o.cuerda}` : o.cuerda, color: 'o', ref: '~abajo', dist: 5 }));
    const llaves = o.llavesAM !== undefined ? [hasta({ de: 'A', a: 'M', marcas: 1, ref: 'O', dist: 9, desde: o.llavesAM }), hasta({ de: 'M', a: 'B', marcas: 1, ref: 'O', dist: 9, desde: o.llavesAM })] : [];
    if (o.radio) llaves.push({ de: 'O', a: 'R', marcas: 1, ref: '~abajo', dist: 7, color: 'i' });
    const libres = [];
    if (o.otra !== undefined) {
      const y2 = -RT + o.otra * KT, x2 = Math.sqrt(Math.max(0, RT * RT - y2 * y2)), dc = o.corteCD || 0;
      Object.assign(pts, { C: [-x2, y2], D: [x2, y2], '~arriba': [0, RT] });
      Object.assign(ver, { C: { desde: dc }, D: { desde: dc } });
      segs.push(['C', 'D', { grosor: 'variable', desde: dc }]);
      if (perp) { pts.N = [0, y2]; ver.N = { desde: dc, lado: 235 }; segs.push(['O', 'N', { discontinua: true, grosor: 'fino', desde: dc }]); angs.push({ en: 'N', de: 'O', a: 'D', desde: dc }); }
      if (o.textoCD) lados.push({ de: 'C', a: 'D', texto: perp ? `CD = ${o.textoCD}` : o.textoCD, ref: '~arriba', dist: 5, desde: dc });
    }
    if (o.regla) {
      // La regla del costado: de 0 a 100 cm, con sus dos marcas (las alturas del agua).
      const xr = 3.75;
      Object.assign(pts, { '~r0': [xr, -RT], '~r1': [xr, RT] });
      segs.push(['~r0', '~r1', { grosor: 'fino' }]);
      o.regla.forEach((hh, k) => { const yy = -RT + hh * KT; pts[`~m${k}`] = [xr, yy]; pts[`~n${k}`] = [xr - 0.32, yy]; segs.push([`~n${k}`, `~m${k}`, {}]); libres.push({ en: `~m${k}`, dir: 0, dist: 4, texto: `${hh} cm` }); });
    }
    if (o.piso) { pts['~pl'] = [o.pisoX === undefined ? 2.6 : o.pisoX, -RT]; libres.push({ en: '~pl', dir: 90, dist: 4, texto: o.piso }); }
    const vista = o.regla ? { x: [-4.3, 6.1], y: VTQ.y } : VTQ;
    return circ({ c: { O: [0, 0], r: RT }, pts, letra, ver, segs, angs, lados, llaves: llaves.length ? llaves : undefined, libres, vista, alto: 250,
      circs: [{ centro: [0, 0], r: RT, grosor: 'variable' }],
      regiones: [{ puntos: aguaHasta(y), opacidad: 0.16 }],
      obj: { tipo: 'tanque', piso: 'T', cunas: ['~c1', '~c2'] },
      fijas: ['O', 'M', 'N', 'T', 'R', ...(bajo ? ['A', 'B'] : [])],
      alt: o.alt || `El tanque echado de 100 cm de diámetro, con el agua a ${f(h)} cm de alto: su superficie AB es una cuerda${perp ? ' y la perpendicular desde el centro O cae en M' : ''}.` });
  }
  // El ancho del agua a h cm de alto, en un tanque de 50 cm de radio: 2 · √(50² − (50 − h)²).
  const mitadAgua = h => Math.sqrt(50 * 50 - (50 - h) * (50 - h));

  // Figura de examen de una cuerda: circunferencia de centro O, la cuerda AB debajo de O, la perpendicular desde O (sin
  // letra en su pie: los ejercicios no la nombran) y, si se da o se pide, el radio OB. Sin escala (lo que se pide no se
  // puede medir): de tres formas, la que dibuja la razón distancia/radio más lejos de la de verdad (prop). La medida de AB
  // va debajo de la cuerda; la de la distancia, a la izquierda de la perpendicular; la del radio, afuera de OB.
  //   rot: { r, OM, AB }: los rótulos (un texto o «?»).
  function figCuerda(rot, o = {}) {
    const formas = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    const lejos = k => (o.prop === undefined ? 1 : Math.abs(k - o.prop));
    // (Auditoría, 19 nov: la forma más lejos de la de verdad primero; si sus rótulos no caben, la siguiente que quede a
    // 0,08 o más.)
    const orden = formas.slice().sort((p, q) => lejos(q) - lejos(p)), ks = orden.filter(k => lejos(k) >= 0.08).concat(orden[0]);
    const ve = t => t && t !== '?';
    const arma = (k, ladoM, enOM, distOM, refOM = 'B') => {
      const r = 3, y = -r * k, x = Math.sqrt(r * r - y * y);
      // (Lector en frío, 19 nov: «15 cm» junto a la cuerda se leía como AM. El pie de la perpendicular se llama M, como en
      // los resueltos, y la distancia dice de qué tramo es: «OM = 15 cm».)
      const pts = { O: [0, 0], A: [-x, y], B: [x, y], M: [0, y] };
      const segs = [['A', 'B', { color: ve(rot.AB) ? 'o' : undefined, grosor: 'variable' }], ['O', 'M', { discontinua: true, grosor: 'fino' }]];
      if (rot.r) segs.push(['O', 'B', { color: ve(rot.r) ? 'i' : undefined }]);
      const lados = [];
      if (rot.r) lados.push({ de: 'O', a: 'B', texto: rot.r, color: ve(rot.r) ? 'i' : undefined, ref: 'A', dist: 4, en: 0.45 });
      if (rot.AB) lados.push({ de: 'A', a: 'B', texto: rot.AB, color: ve(rot.AB) ? 'o' : undefined, ref: 'O', dist: 5 });
      if (rot.OM) lados.push({ de: 'O', a: 'M', texto: `OM = ${rot.OM}`, ref: refOM, dist: distOM, en: enOM });
      return circ({ c: { O: [0, 0], r }, pts, segs, angs: [{ en: 'M', de: 'O', a: 'B', radio: 12 }], lados, ver: { O: { lado: 90 }, M: ladoM === null ? {} : { lado: ladoM } }, fijas: ladoM === null ? ['O'] : ['O', 'M'], alto: rot.OM && rot.OM !== '?' ? 300 : 230,
        vista: { x: [-4.1, 4.1], y: [-3.7, 3.7] }, sinEscala: o.sinEscala !== false, alt: o.alt });
    };
    for (const k of ks) for (const ref of ['B', 'A']) for (const lm of [null, 135, 45, 160, 20, 225, 315]) for (const en of [0.5, 0.35, 0.65]) for (const dd of [4, 8]) {
      const F = arma(k, lm, en, dd, ref); if (cabe(F)) return F;
    }
    return arma(ks[0], null, 0.5, 4);
  }
  // Figura de examen de una tangente: circunferencia de centro O, el punto P afuera, la tangente PT y el radio OT. Sin
  // escala: de tres formas, la que dibuja PO/r más lejos de la de verdad.
  function figTangente(rot, o = {}) {
    // (La de 2,1 si queda lejos de la de verdad: con P más lejos, el rótulo del radio rozaba el borde.)
    const formas = [2.1, 2.6];
    const lejos = k => (o.prop === undefined ? 1 : Math.abs(k - o.prop));
    const k = formas.find(x => lejos(x) >= 0.4) || formas.slice().sort((p, q) => lejos(q) - lejos(p))[0];
    const r = 2.2, d = r * k, g = U.grados(Math.acos(r / d));
    const pts = { O: [0, 0], P: [d, 0], T: sobre([0, 0], r, g), '~izq': [-r, 0] };
    const ve = t => t && t !== '?';
    const segs = [['P', 'T', { color: ve(rot.PT) ? 'o' : undefined, grosor: 'variable' }], ['O', 'T', { color: ve(rot.r) ? 'i' : undefined }], ['O', 'P', { discontinua: true, grosor: 'fino' }]];
    const lados = [];
    if (rot.r) lados.push({ de: 'O', a: 'T', texto: rot.r, color: ve(rot.r) ? 'i' : undefined, ref: 'P', dist: 3, en: k > 2.5 ? 0.32 : 0.4 });
    if (rot.PT) lados.push({ de: 'P', a: 'T', texto: rot.PT, color: ve(rot.PT) ? 'o' : undefined, ref: 'O', dist: 5 });
    // (La medida de PO va en el tramo de afuera de la circunferencia: en el medio de OP cruzaba el borde.)
    if (rot.PO) lados.push({ de: 'O', a: 'P', texto: rot.PO, ref: 'T', dist: 5, en: (1 + 1 / k) / 2 });
    return circ({ c: { O: [0, 0], r }, pts, segs, angs: [{ en: 'T', de: 'O', a: 'P', radio: 12 }], lados, ver: { O: { lado: 270 } }, fijas: ['O'], alto: 220,
      vista: { x: [-3.1, d + 0.9], y: [-2.9, 3.2] }, sinEscala: o.sinEscala !== false, alt: o.alt });
  }
  // El isósceles de dos radios: O, A y B en la circunferencia, con los ángulos en O, A o B rotulados ('' es el arco sin
  // rótulo, en tinta). Sin escala: de varias formas, la primera que cabe con m∠AOB a 15° o más de la de verdad (aob); si
  // con un «?» no cabe ninguna, ese ángulo va con su arco y sin el «?» (lo pedido «va con ? o no va»).
  function figIso(rot, o = {}) {
    const col = t => (t === '?' || t === '' ? undefined : 'h');
    const arma = (g, rr) => {
      const angs = [];
      for (const [v, de, a] of [['O', 'A', 'B'], ['A', 'O', 'B'], ['B', 'A', 'O']]) if (rr[v] !== undefined) angs.push({ en: v, de, a, texto: rr[v] || undefined, color: col(rr[v]), radio: 14 });
      return circ({ c: { O: [0, 0], r: 3 }, pts: { O: [0, 0], A: 270 - g / 2, B: 270 + g / 2 }, segs: [['O', 'A', { color: 'i' }], ['O', 'B', { color: 'i' }], ['A', 'B']], angs, ver: { O: { lado: 90 } }, fijas: ['O'], alto: 260,
        vista: { x: [-3.6, 3.6], y: [-3.7, 3.6] }, sinEscala: true, alt: o.alt });
    };
    // (Sin 90°: el cuadradito del recto diría «90°» junto a otro rótulo.)
    const gs = [100, 80, 110, 70, 120, 60, 50, 130, 40].filter(g => o.aob === undefined || Math.abs(g - o.aob) >= 15);
    const sinP = Object.fromEntries(Object.entries(rot).map(([k, v]) => [k, v === '?' ? '' : v]));
    return gs.map(g => arma(g, rot)).find(cabe) || gs.map(g => arma(g, sinP)).find(cabe) || arma(gs[0], sinP);
  }

  // Los 15 ejemplos (cuentas rehechas aparte en el scratchpad: cuentas.py, idea 1): 12 cm; 13 cm; 50°; 90°; 18 cm;
  // 16 cm (r 10, OM 6); 5 cm (r 13, cuerda 24); 35°; 15 cm (r 8, PO 17); 16 cm (x = 6); 120 cm (tanque de 130 cm, agua a
  // 40 cm); 40 cm (superficie 48, agua a 8 cm); 18 cm (PO 25 − r 7); 60° (dos isósceles); 31 cm (7 + 24).
  // La figura muestra el planteamiento: lo pedido con «?» en tinta; sin escala si se puede medir.
  const EJ1 = [];
  EJ1.push({ nivel: 1, titulo: 'La mitad de la cuerda',
    enunciado: 'En una circunferencia de centro O, la cuerda AB mide 24 cm. La perpendicular desde O corta la cuerda en M. ¿Cuánto mide AM?',
    datos: [D_PERP],
    solucion: [{ texto: ['OM es perpendicular a la cuerda: la parte en dos mitades iguales.'], ecuacion: junto(['AM = ', dO('24 cm'), ' ÷ 2 = ', dF('12 cm')]) }],
    respuesta: [junto('AM = '), dF('12 cm')] });
  EJ1.push({ nivel: 1, titulo: 'El radio de un plato',
    enunciado: 'El borde de un plato redondo es una circunferencia de 26 cm de diámetro. ¿Cuánto mide su radio?',
    datos: [D_RADIOS],
    solucion: [{ texto: 'El diámetro mide dos radios: el radio es la mitad.', ecuacion: junto(['r = 26 cm ÷ 2 = ', dF('13 cm')]) }],
    respuesta: [junto('r = '), dF('13 cm')] });
  EJ1.push({ nivel: 1, titulo: 'Dos radios y una cuerda',
    figura: fig(figIso({ A: '50°', B: '?' }, { aob: 80, alt: 'Una circunferencia de centro O con los radios OA y OB y la cuerda AB; el ángulo OAB mide 50°.' })),
    enunciado: `En una circunferencia de centro O, A y B son puntos de la circunferencia y m∠OAB = 50°. ¿Cuánto mide m∠OBA?${NO_ESC}`,
    datos: [D_RADIOS, D_ISO],
    solucion: [{ texto: ['OA y OB son radios: el triángulo OAB es isósceles, con la base AB.'], ecuacion: junto(['m∠OBA = m∠OAB = ', dF('50°')]) }],
    respuesta: [junto('m∠OBA = '), dF('50°')] });
  EJ1.push({ nivel: 1, titulo: 'El radio y el piso',
    figura: fig(figTanque(30, { radios: false, perp: false, corteT: 0, anguloT: false, alt: 'El tanque echado sobre el piso, que lo toca en T; el radio OT va del centro a T.' })),
    enunciado: 'Un tanque echado toca el piso en un solo punto T: el piso es tangente a su borde. ¿Qué ángulo forma el radio OT con el piso?',
    datos: [D_TAN],
    solucion: [{ texto: ['El radio que llega al punto de contacto es perpendicular a la tangente:'], ecuacion: junto(['OT ⟂ piso', FL, dF('90°')]) }],
    respuesta: [dF('90°')] });
  EJ1.push({ nivel: 1, titulo: 'Cuerdas igual de lejos',
    enunciado: 'En una circunferencia, las cuerdas AB y CD están las dos a 7 cm del centro. Si AB mide 18 cm, ¿cuánto mide CD?',
    datos: [D_EQUI],
    solucion: [{ texto: 'Las dos cuerdas están a la misma distancia del centro: miden igual.', ecuacion: junto(['CD = AB = ', dF('18 cm')]) }],
    respuesta: [junto('CD = '), dF('18 cm')] });

  EJ1.push({ nivel: 2, titulo: 'La cuerda desde el radio',
    figura: fig(figCuerda({ r: '10 cm', OM: '6 cm', AB: '?' }, { prop: 0.6, alt: 'Una circunferencia de centro O y radio OA de 10 cm; la cuerda AB está a 6 cm de O, medidos por OM; AB lleva signo de pregunta.' })),
    enunciado: `Una circunferencia tiene 10 cm de radio. La cuerda AB está a 6 cm del centro O. ¿Cuánto mide AB?${NO_ESC}`,
    datos: [D_PERP, D_PIT],
    solucion: [{ texto: ['Sea M el pie de la perpendicular desde O. En el triángulo rectángulo OMB, la hipotenusa es el radio OB:'], ecuacion: junto(['MB² = ', dI('10'), '² − 6² = 64', FL, 'MB = 8 cm']) },
      { texto: 'La perpendicular parte la cuerda en dos mitades iguales:', ecuacion: junto(['AB = 2 · 8 cm = ', dF('16 cm')]) }],
    respuesta: [junto('AB = '), dF('16 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Qué tan lejos del centro',
    figura: fig(figCuerda({ r: '13 cm', AB: '24 cm', OM: '?' }, { prop: 5 / 13, alt: 'Una circunferencia de centro O y radio de 13 cm con la cuerda AB de 24 cm; OM, la distancia de O a la cuerda, lleva signo de pregunta.' })),
    enunciado: `En una circunferencia de 13 cm de radio, la cuerda AB mide 24 cm. ¿A qué distancia del centro O está la cuerda?${NO_ESC}`,
    datos: [D_PERP, D_PIT, 'La distancia de O a la cuerda se mide por la perpendicular desde O.'],
    solucion: [{ texto: ['Sea M el pie de la perpendicular desde O: parte la cuerda en dos, y MB = ', dO('24 cm'), ' ÷ 2 = 12 cm.'] },
      { texto: 'En el triángulo rectángulo OMB, la hipotenusa es el radio:', ecuacion: junto(['OM² = ', dI('13'), '² − 12² = 169 − 144 = 25', FL, 'OM = ', dF('5 cm')]) }],
    respuesta: ['A ', dF('5 cm'), ' del centro'] });
  EJ1.push({ nivel: 2, titulo: 'El ángulo en el centro',
    figura: fig(figIso({ O: '110°', A: '?' }, { aob: 110, alt: 'Una circunferencia de centro O con los radios OA y OB y la cuerda AB; el ángulo AOB mide 110°; se pide el ángulo OAB.' })),
    enunciado: `En una circunferencia de centro O, los radios OA y OB forman un ángulo m∠AOB = 110°. ¿Cuánto mide m∠OAB?${NO_ESC}`,
    datos: [D_RADIOS, D_ISO, D_TRI],
    solucion: [{ texto: 'OA = OB: el triángulo OAB es isósceles, y sus ángulos en A y en B miden igual.' },
      { texto: 'Los dos se reparten lo que falta para 180°:', ecuacion: junto(['m∠OAB = (180° − ', dH('110°'), ') ÷ 2 = 70° ÷ 2 = ', dF('35°')]) }],
    respuesta: [junto('m∠OAB = '), dF('35°')] });
  EJ1.push({ nivel: 2, titulo: 'La tangente desde un punto',
    figura: fig(figTangente({ r: '8 cm', PO: '17 cm', PT: '?' }, { prop: 17 / 8, alt: 'Una circunferencia de centro O y radio OT de 8 cm; desde P, a 17 cm de O, la tangente PT lleva signo de pregunta.' })),
    enunciado: `Desde el punto P, a 17 cm del centro O de una circunferencia de 8 cm de radio, se traza la tangente PT. ¿Cuánto mide PT?${NO_ESC}`,
    datos: [D_TAN, D_PIT],
    solucion: [{ texto: ['OT ⟂ PT: el triángulo OTP es rectángulo en T, con la hipotenusa OP.'] },
      { texto: 'Pitágoras:', ecuacion: junto(['PT² = 17² − ', dI('8'), '² = 225']) },
      { texto: 'La raíz de 225:', ecuacion: junto(['PT = ', dF('15 cm')]) }],
    respuesta: [junto('PT = '), dF('15 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Dos cuerdas con x',
    enunciado: 'En una circunferencia, las cuerdas AB y CD están las dos a 5 cm del centro. AB = 2x + 4 y CD = 3x − 2, en centímetros. ¿Cuánto mide AB?',
    datos: [D_EQUI],
    solucion: [{ texto: 'Las dos están a la misma distancia del centro: miden igual.', ecuacion: junto(['2x + 4 = 3x − 2', FL, 'x = 6']) },
      { texto: 'Se reemplaza x en AB:', ecuacion: junto(['AB = 2 · 6 + 4 = ', dF('16 cm')]) }],
    respuesta: [junto('AB = '), dF('16 cm')] });

  // Nivel 3 (examen): cinco alternativas; la correcta va en distintas letras (C, A, E, B, D) y cada incorrecta se explica
  // por su valor (donde hay puntos A, B, C, nunca por su letra).
  EJ1.push({ nivel: 3, titulo: 'El agua de un tanque grande',
    enunciado: 'Un tanque cilíndrico de 130 cm de diámetro está echado en el piso, con agua hasta 40 cm de alto. ¿Cuánto mide el ancho de la superficie del agua?',
    alternativas: ['60 cm', '50 cm', '120 cm', '130 cm', '80 cm'],
    datos: [D_RADIOS, D_PERP, D_PIT],
    solucion: [{ texto: 'El radio mide 65 cm; la superficie queda 65 − 40 = 25 cm debajo del centro.' },
      { texto: 'Media superficie, por Pitágoras:', ecuacion: junto(['65² − 25² = 3 600', FL, '√3 600 = 60 cm']) },
      { texto: ['Toda la superficie: 2 · 60 cm = ', dF('120 cm'), '.'] },
      { texto: '60 cm es media superficie; 130 cm, el diámetro; 50 cm duplica la distancia al centro, 25 cm; 80 cm duplica la altura del agua.' }],
    respuesta: [dF('120 cm')] });
  EJ1.push({ nivel: 3, titulo: 'El radio desde la flecha',
    enunciado: 'En una tubería de agua, la superficie del agua mide 48 cm de ancho y el agua llega a 8 cm de alto. ¿Cuánto mide el radio de la tubería?',
    alternativas: ['40 cm', '32 cm', '24 cm', '80 cm', '36 cm'],
    datos: [D_PERP, D_PIT, 'Si el radio es r, la superficie queda a r − 8 del centro.'],
    solucion: [{ texto: 'Media superficie mide 24 cm. En el triángulo con el centro, la hipotenusa es r:', ecuacion: junto(['r² = 24² + (r − 8)²']) },
      { texto: 'Se desarrolla (r − 8)²:', ecuacion: junto(['r² = 576 + r² − 16r + 64']) },
      { texto: 'Se cancela r² y se despeja:', ecuacion: junto(['16r = 640', FL, 'r = ', dF('40 cm')]) },
      { texto: '24 cm es media superficie; 32 cm, lo que hay del centro al agua; 80 cm, el diámetro; 36 cm sale de olvidar el 8² al desarrollar.' }],
    respuesta: [dF('40 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Qué tan cerca pasa',
    enunciado: 'Desde el punto P se traza una tangente a una circunferencia de 7 cm de radio, y mide PT = 24 cm. ¿A qué distancia está P del punto de la circunferencia más cercano a él?',
    alternativas: ['17 cm', '25 cm', '24 cm', '31 cm', '18 cm'],
    datos: [D_TAN, D_PIT, 'El punto más cercano a P está sobre el segmento PO.'],
    solucion: [{ texto: 'OT ⟂ PT: en el triángulo rectángulo OTP, la hipotenusa es PO:', ecuacion: junto(['PO² = 24² + 7² = 625', FL, 'PO = 25 cm']) },
      { texto: ['Del centro al borde hay un radio: 25 cm − 7 cm = ', dF('18 cm'), '.'] },
      { texto: '25 cm es PO, hasta el centro; 24 cm, la tangente; 31 cm suma el radio; 17 cm resta 7 de 24.' }],
    respuesta: [dF('18 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Dos isósceles en un transportador',
    figura: fig(figTransportador({ alt: 'Una circunferencia de centro O con A, B y C sobre ella; O queda dentro del ángulo ABC. El ángulo OAB mide 25° y el ángulo OCB, 35°.' })),
    enunciado: `A, B y C están en una circunferencia de centro O, y O queda dentro del ángulo ABC. m∠OAB = 25° y m∠OCB = 35°. ¿Cuánto mide m∠ABC?${NO_ESC}`,
    alternativas: ['30°', '50°', '70°', '60°', '120°'],
    datos: [D_RADIOS, D_ISO],
    fuente: 'Modelo de San Marcos 2019-I (pregunta 46), con otros números.',
    solucion: [{ texto: 'OA = OB: el triángulo OAB es isósceles y m∠OBA = 25°. OB = OC: el OBC también, y m∠OBC = 35°.' },
      { texto: 'O está dentro del ángulo ABC: sus dos partes se suman.', ecuacion: junto(['m∠ABC = 25° + 35° = ', dF('60°')]) },
      { texto: '30° es la mitad; 50° y 70° duplican un solo ángulo; 120° es el doble de la respuesta.' }],
    respuesta: [junto('m∠ABC = '), dF('60°')] });
  EJ1.push({ nivel: 3, titulo: 'Dos cuerdas paralelas',
    enunciado: 'En una circunferencia de 25 cm de radio, las cuerdas paralelas AB y CD miden 48 cm y 14 cm, y el centro queda entre las dos. ¿Qué distancia hay entre las cuerdas?',
    alternativas: ['17 cm', '31 cm', '62 cm', '50 cm', '24 cm'],
    datos: [D_PERP, D_PIT],
    solucion: [{ texto: 'Mitades: 24 cm y 7 cm. Distancias al centro, por Pitágoras:', ecuacion: junto(['25² − 24² = 49', FL, '7 cm', Y, '25² − 7² = 576', FL, '24 cm']) },
      { texto: 'Con el centro entre las dos, las distancias se suman:', ecuacion: junto(['7 cm + 24 cm = ', dF('31 cm')]) },
      { texto: '17 cm las resta (cuerdas del mismo lado); 24 cm es una sola; 50 cm, el diámetro; 62 cm suma las dos cuerdas.' }],
    respuesta: [dF('31 cm')] });

  // El transportador del examen (2019-I): A, B y C en la circunferencia, con O dentro del ángulo ABC. Sin escala: los dos
  // ángulos dados se dibujan a su clase, no a su valor.
  function figTransportador(o = {}) {
    const r = 3, pts = { O: [0, 0], A: 190, B: 90, C: 350 };   // (búsqueda en el scratchpad: busca.js; así caben los tres rótulos)
    return circ({ c: { O: [0, 0], r }, pts, segs: [['B', 'A'], ['B', 'C'], ['O', 'A', { color: 'i' }], ['O', 'B', { color: 'i' }], ['O', 'C', { color: 'i' }]],
      angs: [{ en: 'A', de: 'O', a: 'B', texto: '25°', color: 'h', radio: 20 }, { en: 'C', de: 'B', a: 'O', texto: '35°', color: 'h', radio: 20 }, { en: 'B', de: 'A', a: 'C', radio: 24 }],
      ver: { O: { lado: 270 } }, fijas: ['O'], alto: 260, vista: { x: [-3.7, 3.7], y: [-3.6, 3.9] }, sinEscala: true, alt: o.alt });
  }

  // «Ahora tú» de la idea 1. Tipos: la cuerda desde el radio y la distancia; la distancia desde la cuerda; el radio desde
  // la superficie y la altura del agua (la flecha); la tangente desde un punto; el isósceles de dos radios.
  const OPS = (r, l) => r.baraja(l);
  // Ternos para «Ahora tú» (los de «Así se resuelve» van aparte: TERNOS_R).
  const TERNOS_A = [[13, 5, 12], [17, 8, 15], [25, 7, 24], [25, 15, 20], [26, 10, 24], [29, 20, 21], [30, 18, 24], [34, 16, 30], [39, 15, 36], [41, 9, 40]];
  const TERNOS_R = [[15, 9, 12], [20, 12, 16], [50, 14, 48], [51, 24, 45], [52, 20, 48], [65, 33, 56]];
  function casoCuerda(r) {
    const [h, a, b] = r.de(TERNOS_A), [d, m] = r.ent(0, 1) ? [a, b] : [b, a], c = 2 * m;
    return { pregunta: `Una circunferencia tiene ${h} cm de radio. La cuerda AB está a ${d} cm del centro O. ¿Cuánto mide AB?${NO_ESC}`,
      datos: [D_PERP, D_PIT, 'La distancia de O a la cuerda se mide por la perpendicular desde O.'],
      dibujo: fig(figCuerda({ r: `${h} cm`, OM: `${d} cm`, AB: '?' }, { prop: d / h, alt: `Una circunferencia de centro O y radio de ${h} cm; la cuerda AB, a ${d} cm de O, lleva signo de pregunta.` })),
      opciones: opciones(c, OPS(r, [
        { id: 'mitad', valor: m, error: 'GE-CIR4', siFuera: `Pitágoras está bien: da ${m} cm, la mitad de la cuerda. Falta duplicar.` },
        { id: 'suma', valor: 2 * Math.hypot(h, d), entero: true, error: 'GE11', siFuera: 'Duplicar está bien; pero el radio es la hipotenusa: se restan los cuadrados.' },
        { id: 'resta', valor: 2 * (h - d), error: 'GE-CIR5', siFuera: `Duplicar está bien; pero ${h} − ${d} no es la mitad: los lados forman un triángulo rectángulo.` },
        { id: 'diam', valor: 2 * h, error: 'GE-CIR6', siFuera: `${2 * h} cm mide el diámetro, la cuerda que pasa por el centro; esta pasa a ${d} cm.` }]), cm),
      solucion: { texto: ['Con M el pie de la perpendicular, la hipotenusa del triángulo OMB es el radio; después se duplica:'], ecuacion: junto([`MB² = ${h}² − ${d}² = ${m * m}`, FL, `MB = ${m} cm`, FL, 'AB = ', dF(cm(c))]) } };
  }
  function casoDistancia(r) {
    const [h, a, b] = r.de(TERNOS_A), [d, m] = r.ent(0, 1) ? [a, b] : [b, a], c = 2 * m;
    return { pregunta: `En una circunferencia de ${h} cm de radio, la cuerda AB mide ${c} cm. ¿A qué distancia del centro O está la cuerda?${NO_ESC}`,
      datos: [D_PERP, D_PIT, 'La distancia de O a la cuerda se mide por la perpendicular desde O.'],
      dibujo: fig(figCuerda({ r: `${h} cm`, AB: `${c} cm`, OM: '?' }, { prop: d / h, alt: `Una circunferencia de centro O y radio de ${h} cm con la cuerda AB de ${c} cm; OM, la distancia de O a la cuerda, lleva signo de pregunta.` })),
      opciones: opciones(d, OPS(r, [
        { id: 'am', valor: m, error: 'GE-CIR7', siFuera: `La mitad de la cuerda está bien: ${m} cm. La distancia es el otro cateto, del centro a la cuerda.` },
        { id: 'entera', valor: Math.sqrt(h * h - c * c), error: 'GE-CIR4', siFuera: 'Restar cuadrados está bien; pero el cateto es media cuerda, no la cuerda entera.' },
        { id: 'resta', valor: h - m, error: 'GE-CIR5', siFuera: `Usar el radio y la mitad está bien; pero ${h} − ${m} no sirve: los lados forman un triángulo rectángulo.` },
        { id: 'suma', valor: Math.hypot(h, m), entero: true, error: 'GE11', siFuera: 'La mitad de la cuerda está bien; pero el radio es la hipotenusa: se restan los cuadrados.' }]), cm),
      solucion: { texto: [`Con M el pie de la perpendicular, MB = ${c} ÷ 2 = ${m} cm; la hipotenusa de OMB es el radio:`], ecuacion: junto([`OM² = ${h}² − ${m}² = ${d * d}`, FL, 'OM = ', dF(cm(d))]) } };
  }
  // La flecha: la superficie del agua (cuerda) mide c y el agua llega a f de alto, f menor que el radio. (c/2)² + (r − f)² = r².
  const FLECHAS = TERNOS.filter(([h, a, b]) => h <= 65).flatMap(([h, a, b]) => [[h, a, b], [h, b, a]]).map(([h, d, m]) => ({ r: h, d, m, fl: h - d })).filter(x => x.fl > 0 && x.fl < x.r);
  function casoFlecha(r) {
    const { r: rr, m, fl } = r.de(FLECHAS.filter(x => !(x.r === 40))), c = 2 * m;
    return { pregunta: `En una tubería echada, la superficie del agua mide ${c} cm de ancho y el agua llega a ${fl} cm de alto, menos de la mitad. ¿Cuánto mide el radio de la tubería?`,
      datos: [D_PERP, D_PIT, `Si el radio es r, la superficie queda a r − ${fl} del centro.`],
      opciones: opciones(rr, OPS(r, [
        { id: 'mitad', valor: m, error: 'GE-CIR7', siFuera: `La mitad de la superficie está bien: ${m} cm. Pero el radio es la hipotenusa, no un cateto.` },
        { id: 'resta', valor: rr - fl, error: 'GE-CIR8', siFuera: `Plantear con r − ${fl} está bien; ${rr - fl} cm es esa distancia al centro, no el radio.` },
        { id: 'diam', valor: 2 * rr, error: 'GE-CIR9', siFuera: `La ecuación está bien: da r = ${rr} cm. ${2 * rr} cm es el diámetro.` },
        { id: 'suma', valor: m + fl, error: 'GE-CIR5', siFuera: `Usar la mitad y la altura está bien; pero no se suman: forman un triángulo rectángulo con r.` }]), cm),
      solucion: { texto: [`Media superficie: ${m} cm. En el triángulo con el centro, la hipotenusa es r:`], ecuacion: junto([`r² = ${m}² + (r − ${fl})²`, FL, `${2 * fl}r = ${m * m + fl * fl}`, FL, 'r = ', dF(cm(rr))]) } };
  }
  function casoTangente(r) {
    const [h, a, b] = r.de(TERNOS_A), [rad, t] = r.ent(0, 1) ? [a, b] : [b, a];
    const pideT = r.ent(0, 1) === 1;
    if (pideT) return { pregunta: `Desde el punto P, a ${h} cm del centro O de una circunferencia de ${rad} cm de radio, se traza la tangente PT. ¿Cuánto mide PT?${NO_ESC}`,
      datos: [D_TAN, D_PIT], dibujo: fig(figTangente({ r: `${rad} cm`, PO: `${h} cm`, PT: '?' }, { prop: h / rad, alt: `Una circunferencia de centro O y radio de ${rad} cm; desde P, a ${h} cm de O, la tangente PT lleva signo de pregunta.` })),
      opciones: opciones(t, OPS(r, [
        { id: 'resta', valor: h - rad, error: 'GE-CIR5', siFuera: `Usar PO y el radio está bien; pero no se restan: forman un triángulo rectángulo.` },
        { id: 'suma', valor: Math.hypot(h, rad), entero: true, error: 'GE11', siFuera: 'Pitágoras está bien; pero PO es la hipotenusa: se restan los cuadrados.' },
        { id: 'po', valor: h, error: 'GE-TAN1', siFuera: `${h} cm es PO, hasta el centro; la tangente llega al punto de contacto T.` },
        { id: 'mas', valor: h + rad, error: 'GE-CIR5', siFuera: 'Usar PO y el radio está bien; pero no se suman: forman un triángulo rectángulo.' }]), cm),
      solucion: { texto: 'OT ⟂ PT: la hipotenusa del triángulo OTP es PO.', ecuacion: junto([`PT² = ${h}² − ${rad}² = ${t * t}`, FL, 'PT = ', dF(cm(t))]) } };
    return { pregunta: `Desde el punto P, a ${h} cm del centro O de una circunferencia, la tangente PT mide ${t} cm. ¿Cuánto mide el radio?${NO_ESC}`,
      datos: [D_TAN, D_PIT], dibujo: fig(figTangente({ PT: `${t} cm`, PO: `${h} cm`, r: '?' }, { prop: h / rad, alt: `Una circunferencia de centro O; desde P, a ${h} cm de O, la tangente PT mide ${t} cm; el radio OT lleva signo de pregunta.` })),
      opciones: opciones(rad, OPS(r, [
        { id: 'resta', valor: h - t, error: 'GE-CIR5', siFuera: `Usar PO y PT está bien; pero no se restan: forman un triángulo rectángulo.` },
        { id: 'suma', valor: Math.hypot(h, t), entero: true, error: 'GE11', siFuera: 'Pitágoras está bien; pero PO es la hipotenusa: se restan los cuadrados.' },
        { id: 'pt', valor: t, error: 'GE-TAN2', siFuera: 'El radio y la tangente no miden igual: forman los dos catetos del triángulo OTP.' },
        { id: 'mitad', valor: h / 2, entero: true, error: 'GE-TAN3', siFuera: `${h / 2} cm es la mitad de PO; el radio sale de Pitágoras.` }]), cm),
      solucion: { texto: 'OT ⟂ PT: la hipotenusa del triángulo OTP es PO.', ecuacion: junto([`r² = ${h}² − ${t}² = ${rad * rad}`, FL, 'r = ', dF(cm(rad))]) } };
  }
  function casoIso(r) {
    const pideO = r.ent(0, 1) === 1;
    if (pideO) {
      const a = r.de([15, 20, 25, 35, 40, 55, 65, 70]), x = 180 - 2 * a;
      return { pregunta: `En una circunferencia de centro O, A y B son puntos de la circunferencia y m∠OAB = ${a}°. ¿Cuánto mide m∠AOB?${NO_ESC}`,
        datos: [D_RADIOS, D_ISO, D_TRI], dibujo: fig(figIso({ A: `${a}°`, O: '?' }, { aob: x, alt: `Una circunferencia de centro O con los radios OA y OB y la cuerda AB; el ángulo OAB mide ${a}°; se pide el ángulo AOB.` })),
        opciones: opciones(x, OPS(r, [
          { id: 'sin2', valor: 180 - a, error: 'GE-CIR10', siFuera: `Restar de 180° está bien; pero en B hay otro ángulo de ${a}°: se restan los dos.` },
          { id: 'doble', valor: 2 * a, error: 'GE-CIR11', siFuera: `Ver el isósceles está bien; ${2 * a}° suman los dos de la base, no el de O.` },
          { id: 'igual', valor: a, error: 'GE-CIR12', siFuera: `En B sí hay ${a}°; pero en O va el tercer ángulo, el que falta para 180°.` }]), gr),
        solucion: { texto: 'OA = OB: en A y en B miden igual.', ecuacion: junto([`m∠AOB = 180° − 2 · ${a}° = `, dF(gr(x))]) } };
    }
    const g = r.de([40, 50, 70, 80, 100, 110, 130, 140, 150]), x = (180 - g) / 2;
    return { pregunta: `En una circunferencia de centro O, los radios OA y OB forman un ángulo m∠AOB = ${g}°. ¿Cuánto mide m∠OAB?${NO_ESC}`,
      datos: [D_RADIOS, D_ISO, D_TRI], dibujo: fig(figIso({ O: `${g}°`, A: '?' }, { aob: g, alt: `Una circunferencia de centro O con los radios OA y OB y la cuerda AB; el ángulo AOB mide ${g}°; se pide el ángulo OAB.` })),
      opciones: opciones(x, OPS(r, [
        { id: 'sin2', valor: 180 - g, error: 'GE-CIR10', siFuera: `Restar de 180° está bien: da ${180 - g}°, lo de A y B juntos. Falta repartirlo entre dos.` },
        { id: 'mitad', valor: g / 2, error: 'GE-CIR11', siFuera: `La mitad de ${g}° no da ningún ángulo del triángulo; A y B se reparten lo que falta para 180°.` },
        { id: 'igual', valor: g, error: 'GE-CIR12', siFuera: 'El isósceles tiene iguales los dos de la base, A y B; el de O es el otro.' }]), gr),
      solucion: { texto: 'OA = OB: A y B se reparten lo que falta para 180°.', ecuacion: junto([`m∠OAB = (180° − ${g}°) ÷ 2 = `, dF(gr(x))]) } };
  }

  const tangentes = {
    id: 'tangentes',
    titulo: 'Radio, cuerda y tangente',
    pregunta: '¿Qué ancho tiene el agua en un tanque echado?',
    temas: ['Elementos y teoremas de tangencia'],
    pieza: GO,
    aprendizaje: 'El radio perpendicular a una cuerda la parte por la mitad; cuerdas igual de lejos del centro miden igual; la tangente es perpendicular al radio.',
    actividad: 'Subir el agua de un tanque echado y medir el ancho de su superficie.',
    // Lee: circunferencia, centro, radio, diámetro, cuerda y tangente. No dice que la perpendicular parte la cuerda en
    // dos (lo muestra el juego) ni qué pasa con la superficie por encima del centro (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un tanque echado', texto: 'Este tanque de agua es un cilindro echado en el piso. Visto de frente, su borde es una circunferencia: todos sus puntos están a 50 cm del centro O. Esa distancia es el radio; el diámetro mide dos radios, 100 cm.',
          pieza: GO, dibujo: fig(figTanque(10, { perp: false, alt: 'El tanque echado de 100 cm de diámetro, visto de frente, con un poco de agua.' })) },
        { titulo: 'Cuerda', texto: 'Un segmento que une dos puntos de la circunferencia es una cuerda. La superficie del agua, de A a B, es una cuerda: cambia de largo cuando el agua sube.' },
        { titulo: 'Tangente', texto: 'Una recta que toca la circunferencia en un solo punto es una tangente, y ese punto es su punto de contacto. El piso toca el tanque solo en el punto de abajo: el piso es tangente.' },
        { titulo: 'Qué mirar al jugar', texto: ['Sube el agua con ', 'h', ' y mira el punto M, donde la línea punteada que baja de O llega a la superficie. Compara AM con MB cada vez.'] },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'El tanque de 100 cm de diámetro está echado en el piso, con agua adentro. La superficie del agua es una cuerda.',
      mision: {
        texto: 'Sube el agua hasta que su superficie mida 80 cm.',
        logrado: v => v.h === 20,
        bien: 'Con el agua a 20 cm: AM = MB = 40 cm, 80 cm en total.',
      },
      voz: 'Mira dónde cae M cada vez que sube el agua.',
      leyenda: [
        { s: 'O', t: 'el centro del tanque' },
        { s: dI('OR'), t: 'un radio: 50 cm, como OA y OB' },
        { s: dO('AB'), t: 'la superficie del agua: una cuerda' },
        { s: 'M', t: 'donde llega la perpendicular desde O' },
        { s: 'h', t: 'la altura del agua' },
      ],
      controles: [{ id: 'h', etiqueta: 'h, la altura del agua', min: 5, max: 50, paso: 5, inicio: 10, unidad: 'cm', decimales: 0 }],
      // (Lector en frío, 19 nov: h no se veía; va en la regla del costado.)
      dibujo: v => { const F = figTanque(v.h, { radio: '50 cm', regla: [v.h] }); return { datos: cabe(F) ? F : figTanque(v.h, { radio: '50 cm' }), estado: {} }; },
      // La relación entera: M parte la superficie en dos mitades iguales, y lo que mide toda.
      lectura: v => { const m = mitadAgua(v.h), ex = Math.abs(m - Math.round(m)) < 1e-9; return [junto(`AM = MB ${ex ? '=' : '≈'} ${cm(ex ? m : Math.round(m * 10) / 10)}: `), dO(junto(`AB ${ex ? '=' : '≈'} ${cm(ex ? 2 * m : Math.round(m * 20) / 10)}`))]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Con el agua a 10 cm de alto, la superficie mide 60 cm. Si el agua sube hasta 90 cm de alto, ¿cuánto mide la superficie?',
      datos: ['El tanque mide 100 cm de diámetro.'],
      voz: 'Mira qué tan lejos del centro queda cada superficie.',
      opciones: [
        { id: 'c', texto: '60 cm', correcta: true },
        { id: 'nueve', texto: '540 cm', error: 'GE-CIR1', siFuera: 'Ver que el agua subió 9 veces está bien; pero el ancho no crece igual: nunca pasa de 100 cm.' },
        { id: 'diam', texto: '100 cm', error: 'GE-CIR2', siFuera: 'Con más agua la superficie crece, pero solo hasta el centro: arriba se angosta de nuevo.' },
        { id: 'suma', texto: '140 cm', error: 'GE-CIR3', siFuera: 'Ver que el agua subió 80 cm está bien; pero no se suma al ancho: nunca pasa de 100 cm.' },
      ],
      dibujo: fig(figTanque(10, { radios: false, perp: false, cuerda: '60 cm', alt: 'El tanque echado con el agua a 10 cm de alto: su superficie AB mide 60 cm.' })),
      revelar: fig(figTanque(10, { radios: false, perp: false, cuerda: '60 cm', otra: 90, textoCD: '60 cm', alt: 'El mismo tanque con la superficie a 90 cm de alto, CD: mide 60 cm, igual que AB.' })),
      coincide: 'Coincide: a 90 cm, la superficie queda 40 cm encima del centro, igual de lejos que a 10 cm: mide lo mismo, 60 cm.',
      noCoincide: 'Revisemos: a 10 cm, la superficie queda 40 cm debajo del centro; a 90 cm, 40 cm encima. Igual de lejos del centro: miden igual, 60 cm.',
    },
    mira: {
      pieza: GO,
      datos: figTanque(10, { otra: 90, corteCD: 3, cortePerp: 1, corteT: 4, hastaAB: 3, alt: 'El tanque con dos superficies, a 10 cm y a 90 cm de alto: las dos quedan a 40 cm del centro y miden 60 cm. Abajo, el piso toca el tanque en T.' }),
      voz: 'Paso a paso: los radios, la perpendicular y la mitad.',
      pasos: [
        { estado: { corte: 0 }, texto: 'OA y OB son radios: el triángulo OAB es isósceles.', ecuacion: junto([dI('OA'), ' = ', dI('OB'), ' = 50 cm']) },
        { estado: { corte: 1 }, texto: 'La perpendicular desde O es la altura del isósceles.', ecuacion: junto('OM ⟂ AB') },
        { estado: { corte: 2 }, texto: 'En el isósceles, esa altura cae en la mitad de la base.', ecuacion: junto(['AM = MB = ', dO('60 cm'), ' ÷ 2 = 30 cm']) },
        { estado: { corte: 3 }, texto: 'A 90 cm, CD queda 40 cm encima de O, como AB debajo.', ecuacion: junto(['ON = OM = 40 cm', FL, 'CD = 60 cm']) },
        { estado: { corte: 4 }, texto: 'Sin agua, la cuerda se achica a un punto, T: el piso.', ecuacion: junto('OT ⟂ piso') },
      ],
    },
    regla: {
      texto: 'El radio perpendicular a una cuerda la parte por la mitad; cuerdas igual de lejos del centro miden igual. La tangente es perpendicular al radio en el punto de contacto.',
      ecuacion: junto(['AM = MB', Y, 'OT ⟂ tangente']),
      condicion: 'O es el centro; M, el pie de la perpendicular desde O a la cuerda AB; T, el punto de contacto.',
      voz: 'Ante una cuerda o una tangente, traza el radio.',
      dibujo: fig(figTanque(30, { radio: '50 cm', corteT: 0, piso: 'tangente', pisoX: 3.8, alt: 'El tanque: la perpendicular OM parte la superficie AB en dos; el piso, tangente, es perpendicular al radio OT.' })),
    },
    // Así se resuelve: el ancho del agua en un tanque echado (otros tanques que los ejemplos), o el radio desde la tangente.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const [h, a, b] = r.de(TERNOS_R), [d, m] = [a, b], alto = h - d;
          return {
            enunciado: `Un tanque cilíndrico de ${2 * h} cm de diámetro está echado en el piso, con agua hasta ${alto} cm de alto. ¿Cuánto mide el ancho de la superficie del agua?`,
            datos: [D_RADIOS, D_PERP, D_PIT],
            pasos: [
              { tipo: 'pide', texto: 'Piden el ancho de la superficie del agua: una cuerda del borde del tanque.' },
              { tipo: 'datos', texto: `El radio mide ${h} cm. El agua llega a ${alto} cm: la superficie queda ${h} − ${alto} = ${d} cm debajo del centro.` },
              { tipo: 'regla', texto: 'La perpendicular desde el centro parte la cuerda en dos mitades. Con el radio, forma un triángulo rectángulo: el radio es la hipotenusa.' },
              { tipo: 'cuentas', texto: 'Pitágoras da media superficie; después se duplica.', ecuacion: junto([`${h}² − ${d}² = ${m * m}`, FL, `${m} cm`, FL, `2 · ${m} cm = `, dF(cm(2 * m))]) },
              { tipo: 'sentido', texto: `Tiene sentido: ${cm(2 * m)} es menos que el diámetro, ${cm(2 * h)}, porque la superficie no pasa por el centro.` },
            ],
            respuesta: ['La superficie mide ', dF(cm(2 * m))],
          };
        }
        const [h, a, b] = r.de(TERNOS_R), [rad, t] = r.ent(0, 1) ? [a, b] : [b, a];
        return {
          enunciado: `Desde el punto P, a ${h} cm del centro O de una circunferencia, la tangente PT mide ${t} cm. ¿Cuánto mide el radio?${NO_ESC}`,
          datos: [D_TAN, D_PIT],
          dibujo: fig(figTangente({ PT: `${t} cm`, PO: `${h} cm`, r: '?' }, { prop: h / rad, alt: `Una circunferencia de centro O; desde P, a ${h} cm de O, la tangente PT mide ${t} cm; el radio OT lleva signo de pregunta.` })),
          pasos: [
            { tipo: 'pide', texto: 'Piden el radio OT, del centro al punto de contacto T.' },
            { tipo: 'datos', texto: `PO = ${h} cm y PT = ${t} cm.` },
            { tipo: 'regla', texto: 'El radio al punto de contacto es perpendicular a la tangente: OTP es un triángulo rectángulo en T, con la hipotenusa PO.', ecuacion: junto('OT ⟂ PT') },
            { tipo: 'cuentas', texto: 'Pitágoras: a la hipotenusa al cuadrado se le resta el cateto conocido al cuadrado.', ecuacion: junto([`r² = ${h}² − ${t}² = ${rad * rad}`, FL, 'r = ', dF(cm(rad))]) },
            { tipo: 'sentido', texto: 'Comprobación:', ecuacion: junto(`${rad}² + ${t}² = ${rad * rad + t * t} = ${h}²`) },
          ],
          respuesta: ['El radio mide ', dF(cm(rad))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Traza el radio: con la perpendicular o la tangente sale un triángulo rectángulo.',
      generar(s) { return conCuatro([casoCuerda, casoDistancia, casoFlecha, casoTangente, casoIso][s % 5], azar(s + 7), firmasDe(EJ1)); },
    },
  };

  // ======================= Idea 2: tangentes iguales, Pitot y Poncelet =======================
  // Objeto de la primera pantalla: la esquina de una bandeja con un plato que roza sus dos bordes (geo-objeto, escena
  // «redondo», tipo «bandeja»; dibujo de prueba). En Predice y Mira, la bandeja entera ABCD con el plato adentro.
  // Cambia: lo lejos que queda la esquina A del centro del plato. · Permanece: el plato, de 10 cm de radio. · Progresa:
  // los dos tramos de A a los puntos de contacto. · Se reserva: los cuatro bordes (Pitot, la predicción) y el triángulo
  // rectángulo (Poncelet, la regla). · Debe verse: AE = AH.
  const KE = 0.2;   // la esquina: 1 cm = 0,2 en el plano (el plato, de 10 cm de radio, mide 2)
  const VES = { x: [-6.7, 3.3], y: [-3.6, 3.6] };
  function figEsquina(d, o = {}) {
    const r = 10 * KE, A = [-d * KE, 0], fi = U.grados(Math.acos(10 / d)), E = sobre([0, 0], r, 180 - fi), H = sobre([0, 0], r, 180 + fi);
    const sigue = (P, k) => [P[0] + (P[0] - A[0]) * k, P[1] + (P[1] - A[1]) * k];
    const L = Math.hypot(E[0] - A[0], E[1] - A[1]), k = Math.max(0.35, 2.6 / L);
    // (Lector en frío, 19 nov: la bandeja se cerraba con un borde que cruzaba el plato. Ahora sus dos bordes siguen hasta
    // fuera de la vista, y se cierra allá: en la figura solo se ven la esquina y sus dos bordes.)
    const pts = { A, E, H, O: [0, 0], '~e2': sigue(E, k), '~h2': sigue(H, k), '~e9': sigue(E, 40), '~h9': sigue(H, 40) };
    return circ({ c: { O: [0, 0], r }, pts, ver: { O: { lado: 0 }, A: { lado: 180 } }, fijas: ['O', 'A'],
      segs: [['A', 'E', { color: 'o', grosor: 'variable' }], ['A', 'H', { color: 'o', grosor: 'variable' }], ['E', '~e2'], ['H', '~h2'], ['O', 'E', { color: 'i' }], ['O', 'H', { color: 'i' }], ['A', 'O', { discontinua: true, grosor: 'fino' }]],
      angs: [{ en: 'E', de: 'O', a: '~e2', radio: 10 }, { en: 'H', de: 'O', a: '~h2', radio: 10 }],
      // (El radio, 10 cm, lo dice la leyenda: su rótulo pisaba el ángulo recto en E.)
      circs: [{ centro: [0, 0], r }], vista: VES, alto: 250,
      obj: { tipo: 'bandeja', bandeja: ['A', '~e9', '~h9'], plato: { centro: [0, 0], r } },
      alt: o.alt || `La esquina A de una bandeja, a ${d} cm del centro O de un plato de 10 cm de radio; los dos bordes rozan el plato en E y en H.` });
  }
  const tramoEsquina = d => Math.sqrt(d * d - 100);
  // Un cuadrilátero circunscrito de tramos tangentes ts = [desde A, B, C, D] (la misma unidad que el radio que sale):
  // los puntos de contacto E (en AB), F (BC), G (CD) y H (DA). Devuelve el radio y los puntos, con O en el origen.
  function circunscrito(ts, esc = 1) {
    let lo = 0.01, hi = 1000;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, s = ts.reduce((a, t) => a + Math.atan(m / t), 0); if (s > Math.PI) hi = m; else lo = m; }
    const r = lo, al = ts.map(t => U.grados(Math.atan(r / t)));   // la mitad de cada ángulo
    // Contactos: E abajo (−90°) y los demás en sentido antihorario; entre dos contactos seguidos va 180° − el ángulo del vértice.
    const cE = -90, cF = cE + 180 - 2 * al[1], cG = cF + 180 - 2 * al[2], cH = cG + 180 - 2 * al[3];
    const R = r * esc, V = (c1, c2, a) => sobre([0, 0], R / Math.sin(a * RAD), (c1 + c2) / 2);
    return { r, R, E: sobre([0, 0], R, cE), F: sobre([0, 0], R, cF), G: sobre([0, 0], R, cG), H: sobre([0, 0], R, cH),
      A: V(cH - 360, cE, al[0]), B: V(cE, cF, al[1]), C: V(cF, cG, al[2]), D: V(cG, cH, al[3]) };
  }
  // La bandeja ABCD con el plato que roza sus cuatro bordes. ts: los tramos dibujados; rot: { AB, BC, CD, DA } los
  // rótulos; o: { contactos: true (E, F, G, H), pares: { A: corte, … } (las llaves de los tramos de cada vértice, con su
  // corte desde y hasta), sinEscala, alt }.
  function figBandeja(ts, rot, o = {}) {
    const K = circunscrito(ts, 3 / circunscrito(ts).r * 0.62);
    const pts = { A: K.A, B: K.B, C: K.C, D: K.D, O: [0, 0] };
    const ver = { O: { sinPunto: true } };
    if (o.contactos) {
      Object.assign(pts, { E: K.E, F: K.F, G: K.G, H: K.H });
      // Las letras de los puntos de contacto van adentro del plato (afuera va la medida del lado).
      for (const id of 'EFGH') { const p = pts[id]; ver[id] = { lado: U.grados(Math.atan2(-p[1], -p[0])) }; }
    }
    const color = { AB: 'o', CD: 'o', BC: 'i', DA: 'i' };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']].map(([p, q]) => { const t = rot[p + q]; return [p, q, t && t !== '?' ? { color: color[p + q], grosor: 'variable' } : { grosor: 'variable' }]; });
    let lados = Object.entries(rot).filter(([, t]) => t).map(([L, t]) => ({ de: L[0], a: L[1], texto: t, color: t === '?' ? undefined : color[L], ref: 'O', dist: 6 }));
    // (Con las llaves de los tramos, las medidas de los lados se van mientras están: no caben las dos afuera del lado.)
    if (o.pares) { const fin = Math.max(...Object.values(o.pares).map(x => x.hasta)); lados = lados.flatMap(l => [Object.assign({ hasta: 0 }, l), Object.assign({ desde: fin + 1 }, l)]); }
    const llaves = [];
    for (const [v, x] of Object.entries(o.pares || {})) {
      const [p, q] = { A: ['E', 'H'], B: ['E', 'F'], C: ['F', 'G'], D: ['G', 'H'] }[v];
      for (const c of [p, q]) llaves.push(Object.assign({ de: v, a: c, marcas: x.marcas, ref: 'O', dist: 8, desde: x.desde }, x.hasta !== undefined ? { hasta: x.hasta } : {}));
    }
    const xs = [K.A, K.B, K.C, K.D].map(p => p[0]), ys = [K.A, K.B, K.C, K.D].map(p => p[1]);
    return circ({ c: { O: [0, 0], r: K.R }, pts, letra: { O: null }, ver, fijas: ['E', 'F', 'G', 'H'], segs, lados, llaves: llaves.length ? llaves : undefined,
      circs: [{ centro: [0, 0], r: K.R }], alto: 250, vista: { x: [Math.min(...xs) - 1.4, Math.max(...xs) + 1.4], y: [Math.min(...ys) - 1.1, Math.max(...ys) + 1.1] },
      obj: { tipo: 'bandeja', bandeja: ['A', 'B', 'C', 'D'], plato: { centro: [0, 0], r: K.R } }, sinEscala: o.sinEscala,
      alt: o.alt });
  }
  // El triángulo rectángulo (recto en C) con su circunferencia inscrita, a escala de sus catetos a y b. o: { textos:
  //   { a, b, c, r }, cuadrado: true (los radios a los catetos y el cuadrado de lado r en C), alt }
  function figPoncelet(a, b, o = {}) {
    // o.dib: [a, b] con que se dibuja (sin escala), si no son los de verdad.
    const [ga, gb] = o.dib || [a, b], c = Math.hypot(ga, gb), r = (ga + gb - c) / 2, k = 5.2 / Math.max(ga, gb);
    const C = [0, 0], B = [ga * k, 0], A = [0, gb * k], I = [r * k, r * k];
    const pts = { A, B, C, '~I': I, '~E': [r * k, 0], '~F': [0, r * k] };
    const t = o.textos || {};
    const segs = [['C', 'B', { color: t.a ? 'o' : undefined, grosor: 'variable' }], ['C', 'A', { color: t.b ? 'i' : undefined, grosor: 'variable' }], ['A', 'B', { grosor: 'variable' }]];
    const angs = [{ en: 'C', de: 'B', a: 'A' }];
    if (o.cuadrado) { segs.push(['~I', '~E', { discontinua: true, grosor: 'fino' }], ['~I', '~F', { discontinua: true, grosor: 'fino' }]); }
    const lados = [];
    if (t.a) lados.push({ de: 'C', a: 'B', texto: t.a, color: 'o', ref: 'A', dist: 5 });
    if (t.b) lados.push({ de: 'C', a: 'A', texto: t.b, color: 'i', ref: 'B', dist: 5 });
    if (t.c) lados.push({ de: 'A', a: 'B', texto: t.c, ref: 'C', dist: 5 });
    if (t.r && o.cuadrado) lados.push({ de: '~I', a: '~E', texto: t.r, ref: '~F', dist: 4 });
    return circ({ c: { O: I, r: r * k }, pts, segs, angs, lados, letra: o.sinLetras ? { A: null, B: null, C: null } : undefined, ver: { C: { lado: 225 }, A: { lado: 100 }, B: { lado: -20 } }, fijas: ['A', 'B', 'C'], sinEscala: o.sinEscala,
      circs: [{ centro: I, r: r * k }], alto: 250, vista: { x: [-1.5, ga * k + 1.2], y: [-1.1, gb * k + 0.8] }, alt: o.alt });
  }

  // La tercera tangente (Puntos de examen, lector en frío): circunferencia de centro O, P afuera, las tangentes PT y PS y
  // otra tangente, del lado de P, que toca en Q y corta PT en M y PS en N. Sin escala (PO se dibuja a 2,6 radios).
  //   rot: { r, PO } los rótulos; alt
  function figTercera(rot) {
    const r = 2, d = 2.6 * r, g = U.grados(Math.acos(r / d)), T = sobre([0, 0], r, g), S = sobre([0, 0], r, -g), P = [d, 0], Q = [r, 0];
    // La tangente en Q es la recta x = r: corta PT y PS en M y N.
    const enX = (A, B) => { const t = (r - A[0]) / (B[0] - A[0]); return [r, A[1] + (B[1] - A[1]) * t]; };
    const M = enX(P, T), N = enX(P, S);
    const pts = { O: [0, 0], P, T, S, Q, M, N };
    const segs = [['P', 'T', { grosor: 'variable' }], ['P', 'S', { grosor: 'variable' }], ['M', 'N', { grosor: 'variable' }], ['O', 'T', { color: 'i' }], ['O', 'P', { discontinua: true, grosor: 'fino' }]];
    const arma = (en, ref, ladoQ) => {
      const lados = [{ de: 'O', a: 'T', texto: rot.r, color: 'i', ref: 'P', dist: 3, en: 0.45 }];
      // La medida de PO va sobre PO entero, en su tramo de afuera (adentro cruzaba el borde), y dice de qué tramo es.
      if (rot.PO) lados.push({ de: 'O', a: 'P', texto: `PO = ${rot.PO}`, ref, dist: 4, en });
      return circ({ c: { O: [0, 0], r }, pts, segs, angs: [{ en: 'T', de: 'O', a: 'P', radio: 10 }], lados, ver: { O: { lado: 180 }, P: { lado: 0 }, Q: { lado: ladoQ } }, fijas: ['O', 'P', 'Q'],
        alto: 240, vista: { x: [-2.9, d + 0.9], y: [-2.8, 2.8] }, sinEscala: true, alt: rot.alt });
    };
    for (const en of [0.72, 0.65, 0.8, 0.58]) for (const ref of ['T', 'S']) for (const lq of [160, 200, 135, 225]) { const F = arma(en, ref, lq); if (cabe(F)) return F; }
    return arma(0.72, 'T', 160);
  }

  const D_IGUALES = 'Desde un punto de afuera, las dos tangentes a una circunferencia miden igual.';
  const D_PITOT = 'Pitot: si los cuatro lados de ABCD tocan una circunferencia, AB + CD = BC + DA.';
  const D_PONCELET = 'Poncelet: en un triángulo rectángulo de catetos a y b e hipotenusa c, a + b = c + 2r.';
  const D_INSCRITA = 'La circunferencia inscrita toca cada lado del polígono en un solo punto.';
  const D_PERIM = 'El perímetro de un polígono es la suma de todos sus lados.';
  const D_NOTABLE = 'En el triángulo rectángulo de 37° y 53°, los lados van como 3, 4 y 5 (convención del examen).';
  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 2): 9 cm; 4 cm; 2 cm; 52 cm; 4 cm; 6 cm; 10 cm; 40 cm;
  // 24 cm; 10 cm (x = 5); 6 cm (trapecio 18 y 8); 18 cm (trapecio rectángulo, r = 6 y 53°); 40 cm (la loseta de 40 cm);
  // 24 cm (PT = 12 desde PO = 13 y r = 5); 3 cm (catetos 7 y 24).
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'Las dos tangentes',
    enunciado: 'Desde el punto P se trazan las dos tangentes a una circunferencia, que la tocan en T y en S. Si PT mide 9 cm, ¿cuánto mide PS?',
    datos: [D_IGUALES],
    solucion: [{ texto: 'PT y PS salen del mismo punto P: miden igual.', ecuacion: junto(['PS = PT = ', dF('9 cm')]) }],
    respuesta: [junto('PS = '), dF('9 cm')] });
  EJ2.push({ nivel: 1, titulo: 'El cuarto borde',
    figura: fig(figBandeja([12, 26, 6, 30], { AB: '7 cm', BC: '8 cm', CD: '5 cm', DA: '?' }, { sinEscala: true, alt: 'Una bandeja ABCD con un plato que roza sus cuatro bordes: AB mide 7 cm, BC 8 cm y CD 5 cm; DA lleva signo de pregunta.' })),
    enunciado: `Los cuatro lados del cuadrilátero ABCD tocan una circunferencia. AB = 7 cm, BC = 8 cm y CD = 5 cm. ¿Cuánto mide DA?${NO_ESC}`,
    datos: [D_PITOT],
    solucion: [{ texto: 'Los lados opuestos suman igual:', ecuacion: junto([dO('7'), ' + ', dO('5'), ' = ', dI('8'), ' + DA', FL, 'DA = ', dF('4 cm')]) }],
    respuesta: [junto('DA = '), dF('4 cm')] });
  EJ2.push({ nivel: 1, titulo: 'El radio de la escuadra',
    // (Auditoría, 19 nov: a escala, con 6, 8 y 10 escritos, se medía el radio. Va sin escala: dibujado de catetos 12 y 5.)
    figura: fig(figPoncelet(8, 6, { dib: [12, 5], sinEscala: true, textos: { a: '8 cm', b: '6 cm', c: '10 cm' }, alt: 'Un triángulo rectángulo ABC, recto en C, con catetos de 8 cm y 6 cm e hipotenusa de 10 cm, y su circunferencia inscrita. No está a escala.' })),
    enunciado: `Un triángulo rectángulo tiene catetos de 6 cm y 8 cm, e hipotenusa de 10 cm. ¿Cuánto mide el radio de su circunferencia inscrita?${NO_ESC}`,
    datos: [D_PONCELET],
    solucion: [{ texto: 'Se reemplaza en Poncelet:', ecuacion: junto([dO('8'), ' + ', dI('6'), ' = 10 + 2r']) },
      { texto: 'Se despeja r:', ecuacion: junto(['2r = 4', FL, 'r = ', dF('2 cm')]) }],
    respuesta: [junto('r = '), dF('2 cm')] });
  EJ2.push({ nivel: 1, titulo: 'El borde de la bandeja',
    enunciado: 'Un plato roza los cuatro bordes de una bandeja ABCD. AB y CD suman 26 cm. ¿Cuánto mide el perímetro de la bandeja?',
    datos: [D_PITOT, D_PERIM],
    solucion: [{ texto: 'BC + DA suma lo mismo que AB + CD: 26 cm. El perímetro junta las dos sumas:', ecuacion: junto('26 cm + 26 cm = 52 cm') }],
    respuesta: [dF('52 cm')] });
  EJ2.push({ nivel: 1, titulo: 'El diámetro de adentro',
    enunciado: 'Un triángulo rectángulo tiene catetos de 5 cm y 12 cm, e hipotenusa de 13 cm. ¿Cuánto mide el diámetro de su circunferencia inscrita?',
    datos: [D_PONCELET, 'El diámetro mide dos radios: 2r.'],
    solucion: [{ texto: 'En Poncelet, 2r es justo el diámetro:', ecuacion: junto([dO('5'), ' + ', dI('12'), ' = 13 + 2r', FL, '2r = ', dF('4 cm')]) }],
    respuesta: [dF('4 cm')] });

  EJ2.push({ nivel: 2, titulo: 'Un tramo en un triángulo',
    enunciado: 'La circunferencia inscrita en el triángulo ABC toca BC en D. AB = 9 cm, BC = 11 cm y CA = 8 cm. ¿Cuánto mide BD?',
    datos: [D_IGUALES, D_INSCRITA],
    solucion: [{ texto: 'Llama x al tramo desde B: BD = x. Los tramos desde C miden 11 − x, y desde A, 9 − x. Los dos de A y de C forman CA:', ecuacion: junto('(9 − x) + (11 − x) = 8') },
      { texto: 'Se despeja:', ecuacion: junto(['20 − 2x = 8', FL, 'x = ', dF('6 cm')]) }],
    respuesta: [junto('BD = '), dF('6 cm')] });
  EJ2.push({ nivel: 2, titulo: 'Un trapecio con su plato',
    enunciado: 'Un trapecio isósceles tiene bases de 14 cm y 6 cm, y sus cuatro lados tocan una circunferencia. ¿Cuánto mide cada lado no paralelo?',
    datos: [D_PITOT, 'En un trapecio isósceles, los dos lados no paralelos miden igual.'],
    solucion: [{ texto: 'Los opuestos suman igual: las bases y los dos lados iguales.', ecuacion: junto(['2 · lado = 14 + 6 = 20']) },
      { texto: 'Cada lado:', ecuacion: junto(['20 ÷ 2 = ', dF('10 cm')]) }],
    respuesta: [dF('10 cm'), ' cada uno'] });
  EJ2.push({ nivel: 2, titulo: 'El perímetro con Poncelet',
    enunciado: 'Un triángulo rectángulo tiene 17 cm de hipotenusa, y el radio de su circunferencia inscrita mide 3 cm. ¿Cuánto mide su perímetro?',
    datos: [D_PONCELET, D_PERIM],
    solucion: [{ texto: 'Los catetos suman la hipotenusa más el diámetro:', ecuacion: junto(['a + b = 17 + 2 · 3 = 23 cm']) },
      { texto: 'El perímetro suma también la hipotenusa:', ecuacion: junto(['23 cm + 17 cm = ', dF('40 cm')]) }],
    respuesta: [dF('40 cm')] });
  EJ2.push({ nivel: 2, titulo: 'Una tercera tangente',
    enunciado: 'Desde P se trazan las tangentes PT y PS, de 12 cm cada una. Una tercera tangente toca el arco entre T y S, y corta PT en M y PS en N. ¿Cuánto mide el perímetro del triángulo PMN?',
    datos: [D_IGUALES, D_PERIM],
    solucion: [{ texto: 'Si la tercera toca en Q: MQ = MT y NQ = NS, porque salen de M y de N.' },
      { texto: 'El perímetro es PM + MT + NS + PN, que da PT + PS:', ecuacion: junto(['12 cm + 12 cm = ', dF('24 cm')]) }],
    respuesta: [dF('24 cm')] });
  EJ2.push({ nivel: 2, titulo: 'Pitot con x',
    enunciado: 'Los cuatro lados del cuadrilátero ABCD tocan una circunferencia. AB = x + 3, BC = 2x, CD = 9 y DA = 7, en centímetros. ¿Cuánto mide BC?',
    datos: [D_PITOT],
    solucion: [{ texto: 'Los opuestos suman igual:', ecuacion: junto(['(x + 3) + 9 = 2x + 7', FL, 'x = 5']) },
      { texto: 'Se reemplaza en BC:', ecuacion: junto(['BC = 2 · 5 = ', dF('10 cm')]) }],
    respuesta: [junto('BC = '), dF('10 cm')] });

  // Nivel 3 (examen): la correcta en B, E, C, A y D; cada incorrecta se explica por su valor.
  EJ2.push({ nivel: 3, titulo: 'El radio de un trapecio',
    enunciado: 'Un trapecio isósceles tiene bases de 18 cm y 8 cm, y sus cuatro lados tocan una circunferencia. ¿Cuánto mide el radio de esa circunferencia?',
    alternativas: ['13 cm', '6 cm', '12 cm', '5 cm', '6,5 cm'],
    datos: [D_PITOT, D_PIT, 'La altura del trapecio es un diámetro de la circunferencia.'],
    solucion: [{ texto: 'Pitot: los dos lados no paralelos suman 18 + 8 = 26 cm; cada uno mide 13 cm.' },
      { texto: 'La altura forma un triángulo rectángulo con un lado y la mitad de la diferencia de las bases, (18 − 8) ÷ 2 = 5 cm:', ecuacion: junto(['13² − 5² = 144', FL, 'altura = 12 cm']) },
      { texto: 'La altura es un diámetro:', ecuacion: junto(['r = 12 cm ÷ 2 = ', dF('6 cm')]) },
      { texto: '13 cm es el lado; 12 cm, la altura (el diámetro); 6,5 cm, la mitad del lado; 5 cm, la mitad de la diferencia de las bases.' }],
    respuesta: [dF('6 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Un trapecio rectángulo',
    enunciado: 'El trapecio ABCD, con BC ∥ AD y rectos en A y en B, tiene sus cuatro lados tangentes a una circunferencia de 6 cm de radio, y m∠D = 53°. ¿Cuánto mide la base mayor AD?',
    alternativas: ['12 cm', '15 cm', '27 cm', '9 cm', '18 cm'],
    datos: [D_PITOT, D_NOTABLE, 'En este trapecio, la altura AB es un diámetro.'],
    fuente: 'Modelo de San Marcos 2023-II (pregunta 34), con otros números.',
    solucion: [{ texto: 'AB = 2 · 6 = 12 cm. CD con 53° en D: 12 cm es el lado de 4, así que CD = 15 cm y su sombra en AD, 9 cm.' },
      { texto: 'Pitot: AD + BC = AB + CD = 27 cm, y AD − BC = 9 cm:', ecuacion: junto(['2 · AD = 27 + 9 = 36', FL, 'AD = ', dF('18 cm')]) },
      { texto: '12 cm es la altura; 15 cm, el lado CD; 27 cm, la suma de las bases; 9 cm, su diferencia.' }],
    respuesta: [junto('AD = '), dF('18 cm')] });
  EJ2.push({ nivel: 3, titulo: 'La loseta cuadrada',
    enunciado: 'Una loseta cuadrada ABCD de 40 cm de lado tiene dibujada su circunferencia inscrita. Una recta tangente a ella corta AB en M y AD en N, cerca de A. ¿Cuánto mide el perímetro del triángulo AMN?',
    alternativas: ['20 cm', '80 cm', '40 cm', '160 cm', '60 cm'],
    datos: [D_IGUALES, D_INSCRITA, 'La circunferencia inscrita en un cuadrado toca cada lado en su punto medio.'],
    fuente: 'Modelo de San Marcos 2027-I (pregunta 36), con otra pregunta.',
    solucion: [{ texto: 'La circunferencia toca AB en E y AD en H, a 20 cm de A. Si la recta MN la toca en T: MT = ME y NT = NH.' },
      { texto: 'El perímetro es AM + MT + TN + NA, que es AM + ME + NH + NA:', ecuacion: junto(['AE + AH = 20 cm + 20 cm = ', dF('40 cm')]) },
      { texto: '20 cm es AE solo; 160 cm, el perímetro de la loseta; 80 cm, su mitad; 60 cm suma un lado más 20 cm.' }],
    respuesta: [dF('40 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Tercera tangente desde lejos',
    figura: fig(figTercera({ r: '5 cm', alt: 'Una circunferencia de centro O; desde P, a 13 cm de O, salen las tangentes PT y PS; otra tangente toca la circunferencia en Q, del lado de P, y corta PT en M y PS en N. El radio mide 5 cm. No está a escala.' })),
    enunciado: `PT y PS son tangentes desde P, y otra tangente corta PT en M y PS en N. PO = 13 cm y el radio mide 5 cm. ¿Cuánto mide el perímetro de PMN?${NO_ESC}`,
    alternativas: ['24 cm', '26 cm', '12 cm', '36 cm', '10 cm'],
    datos: [D_TAN, D_PIT, D_IGUALES],
    solucion: [{ texto: 'OT ⟂ PT: en el triángulo rectángulo OTP,', ecuacion: junto(['PT² = 13² − 5² = 144', FL, 'PT = 12 cm']) },
      { texto: 'Si la otra tangente toca en Q: desde M salen MT y MQ, que miden igual; desde N, NS y NQ. Y PS = PT = 12 cm.' },
      { texto: ['El perímetro PM + MQ + QN + NP es PM + MT + NS + NP, o sea PT + PS: ', junto('12 cm + 12 cm = '), dF('24 cm'), '.'] },
      { texto: '12 cm es una sola tangente; 26 cm duplica PO; 36 cm suma 12 cm de más; 10 cm es el diámetro.' }],
    respuesta: [dF('24 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Poncelet sin un cateto',
    enunciado: 'Un triángulo rectángulo tiene 25 cm de hipotenusa y un cateto de 7 cm. ¿Cuánto mide el radio de su circunferencia inscrita?',
    alternativas: ['6 cm', '12 cm', '24 cm', '3 cm', '16 cm'],
    datos: [D_PONCELET, D_PIT],
    solucion: [{ texto: 'El otro cateto, por Pitágoras:', ecuacion: junto(['25² − 7² = 576', FL, 'b = 24 cm']) },
      { texto: 'Poncelet:', ecuacion: junto(['7 + 24 = 25 + 2r']) },
      { texto: 'Se despeja r:', ecuacion: junto(['2r = 6', FL, 'r = ', dF('3 cm')]) },
      { texto: '6 cm es el diámetro, 2r; 24 cm, el otro cateto; 12 cm, su mitad; 16 cm sale de 7 + 25 sin restar, dividido entre 2.' }],
    respuesta: [junto('r = '), dF('3 cm')] });

  // «Ahora tú» de la idea 2. Tipos: el cuarto lado (Pitot); un tramo en un triángulo con su circunferencia inscrita; el
  // radio (Poncelet); el perímetro de la tercera tangente; el trapecio isósceles circunscrito (su lado o su radio).
  function casoPitot(r) {
    const [a, b, c, dd] = Array.from({ length: 4 }, () => r.ent(3, 15));
    const AB = a + b, BC = b + c, CD = c + dd, DA = dd + a;
    return { pregunta: `Los cuatro lados del cuadrilátero ABCD tocan una circunferencia. AB = ${AB} cm, BC = ${BC} cm y CD = ${CD} cm. ¿Cuánto mide DA?`,
      datos: [D_PITOT],
      opciones: opciones(DA, OPS(r, [
        { id: 'opuesto', valor: BC, error: 'GE-PIT2', siFuera: `Ver la pareja de enfrente está bien; pero DA no copia a BC: lo que se iguala son las sumas.` },
        { id: 'vecinos', valor: AB + BC - CD, error: 'GE-PIT3', siFuera: 'Sumar de a dos está bien; pero se suman los opuestos: AB con CD y BC con DA.' },
        { id: 'resta', valor: AB + CD + BC, error: 'GE-PIT4', siFuera: `Juntar los lados está bien; pero ${AB + CD + BC} cm es la suma de los tres, no el cuarto.` },
        { id: 'mitad', valor: (AB + CD) / 2, error: 'GE-PIT5', siFuera: 'Pitot está bien; pero AB + CD es la suma de BC y DA, no el doble de DA.' }]), cm),
      solucion: { texto: 'Los lados opuestos suman igual:', ecuacion: junto([`${AB} + ${CD} = ${BC} + DA`, FL, 'DA = ', dF(cm(DA))]) } };
  }
  function casoTriangulo(r) {
    for (;;) {
      const x = r.ent(2, 12), y = r.ent(2, 12), z = r.ent(2, 12);   // los tramos desde B, C y A
      const AB = x + z, BC = x + y, CA = y + z;
      if (x === y || x === z) continue;
      return { pregunta: `La circunferencia inscrita en el triángulo ABC toca BC en D. AB = ${AB} cm, BC = ${BC} cm y CA = ${CA} cm. ¿Cuánto mide BD?`,
        datos: [D_IGUALES, D_INSCRITA],
        opciones: opciones(x, OPS(r, [
          { id: 'mitad', valor: BC / 2, error: 'GE-PIT6', siFuera: 'Partir BC está bien; pero D no cae en la mitad: los tramos desde B y desde C son distintos.' },
          { id: 'dc', valor: y, error: 'GE-PIT7', siFuera: `Plantear con tramos está bien; ${y} cm es DC, el tramo desde C.` },
          { id: 'otro', valor: z, error: 'GE-PIT7', siFuera: `Plantear con tramos está bien; ${z} cm es el tramo desde A.` },
          { id: 'sinmitad', valor: AB + BC - CA, error: 'GE-PIT8', siFuera: `La suma AB + BC − CA está bien: da ${AB + BC - CA} cm, dos tramos desde B. Falta la mitad.` }]), cm),
        solucion: { texto: 'Los dos tramos desde cada vértice miden igual; con BD = x:', ecuacion: junto([`(${AB} − x) + (${BC} − x) = ${CA}`, FL, 'x = ', dF(cm(x))]) } };
    }
  }
  function casoPoncelet(r) {
    // (Sin los ternos de «Así se resuelve».)
    const [hh, p, q] = r.de(TERNOS.filter(t => t[0] <= 52 && ![15, 20, 30, 34, 39, 51].includes(t[0]))), [a, b] = r.ent(0, 1) ? [p, q] : [q, p], rr = (a + b - hh) / 2;
    return { pregunta: `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm, e hipotenusa de ${hh} cm. ¿Cuánto mide el radio de su circunferencia inscrita?`,
      datos: [D_PONCELET],
      opciones: opciones(rr, OPS(r, [
        { id: 'diam', valor: 2 * rr, error: 'GE-PON2', siFuera: `Poncelet está bien: ${a} + ${b} − ${hh} = ${2 * rr} es 2r, el diámetro. Falta la mitad.` },
        { id: 'circ', valor: hh / 2, error: 'GE-PON1', siFuera: `${f(hh / 2)} cm es la mitad de la hipotenusa: el radio de la circunscrita, no el de la inscrita.` },
        { id: 'altura', valor: a * b / hh, error: 'GE-PON3', siFuera: `${f(a * b / hh)} cm es la altura sobre la hipotenusa; el radio inscrito es otra medida.` },
        { id: 'suma', valor: (a + b + hh) / 2, error: 'GE-PON4', siFuera: 'Usar los tres lados está bien; pero la hipotenusa se resta: a + b = c + 2r.' }]), cm),
      solucion: { texto: 'Poncelet, y se despeja r:', ecuacion: junto([`${a} + ${b} = ${hh} + 2r`, FL, `2r = ${2 * rr}`, FL, 'r = ', dF(cm(rr))]) } };
  }
  function casoTercera(r) {
    const [hh, p, q] = r.de(TERNOS.filter(t => t[0] <= 41)), [rad, t] = r.ent(0, 1) ? [p, q] : [q, p];
    return { pregunta: `P está a ${hh} cm del centro de una circunferencia de ${rad} cm de radio. Las tangentes desde P son PT y PS; otra tangente corta PT en M y PS en N. ¿Cuál es el perímetro del triángulo PMN?`,
      datos: [D_TAN, D_PIT, D_IGUALES],
      opciones: opciones(2 * t, OPS(r, [
        { id: 'una', valor: t, error: 'GE-PIT9', siFuera: `Pitágoras está bien: PT = ${t} cm. El perímetro de PMN es PT + PS.` },
        { id: 'po', valor: 2 * hh, error: 'GE-PIT10', siFuera: 'Juntar dos tramos está bien; pero los tramos son las tangentes, no PO.' },
        { id: 'suma', valor: 2 * Math.hypot(hh, rad), entero: true, error: 'GE11', siFuera: 'Duplicar está bien; pero PO es la hipotenusa: se restan los cuadrados.' },
        { id: 'resta', valor: 2 * (hh - rad), error: 'GE-CIR5', siFuera: 'Duplicar está bien; pero la tangente no es PO menos el radio: forman un triángulo rectángulo.' }]), cm),
      solucion: { texto: 'PT por Pitágoras. Desde M y desde N, las dos tangentes miden igual: el perímetro de PMN es PT + PS.', ecuacion: junto([`PT² = ${hh}² − ${rad}² = ${t * t}`, FL, `PT = ${t} cm`, FL, `2 · ${t} cm = `, dF(cm(2 * t))]) } };
  }
  // Trapecio isósceles circunscrito de bases B y b: lado (B + b) ÷ 2 y altura √(B · b) (entera en esta lista).
  const TRAPECIOS = [[18, 8], [32, 2], [50, 8], [16, 4], [36, 4], [24, 6], [27, 3], [45, 5], [49, 1], [20, 5], [28, 7], [32, 8], [48, 3], [40, 10]];
  function casoTrapecio(r) {
    const [B, b] = r.de(TRAPECIOS), lado = (B + b) / 2, alt = Math.sqrt(B * b), pideR = r.ent(0, 1) === 1;
    if (!pideR) return { pregunta: `Un trapecio isósceles tiene bases de ${B} cm y ${b} cm, y sus cuatro lados tocan una circunferencia. ¿Cuánto mide cada lado no paralelo?`,
      datos: [D_PITOT, 'En un trapecio isósceles, los dos lados no paralelos miden igual.'],
      opciones: opciones(lado, OPS(r, [
        { id: 'suma', valor: B + b, error: 'GE-PIT11', siFuera: `Pitot está bien: los dos lados suman ${B + b} cm. Cada uno es la mitad.` },
        { id: 'resta', valor: (B - b) / 2, error: 'GE-PIT12', siFuera: 'Usar las dos bases está bien; pero en Pitot se suman, no se restan.' },
        { id: 'base', valor: B, error: 'GE-PIT2', siFuera: 'El lado de enfrente no es la base: lo que se iguala son las sumas.' }]), cm),
      solucion: { texto: 'Los opuestos suman igual: los dos lados iguales suman las dos bases.', ecuacion: junto([`2 · lado = ${B} + ${b}`, FL, 'lado = ', dF(cm(lado))]) } };
    const rr = alt / 2;
    return { pregunta: `Un trapecio isósceles tiene bases de ${B} cm y ${b} cm, y sus cuatro lados tocan una circunferencia. ¿Cuánto mide el radio de esa circunferencia?`,
      datos: [D_PITOT, D_PIT, 'La altura del trapecio es un diámetro de la circunferencia.'],
      opciones: opciones(rr, OPS(r, [
        { id: 'altura', valor: alt, error: 'GE-PIT12', siFuera: `La altura está bien: ${f(alt)} cm. Es el diámetro; el radio es la mitad.` },
        { id: 'lado', valor: lado, error: 'GE-PIT11', siFuera: `Pitot está bien: cada lado mide ${f(lado)} cm. Falta la altura con Pitágoras.` },
        { id: 'mitad', valor: lado / 2, error: 'GE-PIT11', siFuera: 'Partir el lado no da el radio: el radio es la mitad de la altura.' },
        { id: 'dif', valor: (B - b) / 2, error: 'GE-PIT12', siFuera: `${f((B - b) / 2)} cm es la mitad de la diferencia de las bases, un cateto del triángulo.` }]), cm),
      solucion: { texto: `Cada lado mide (${B} + ${b}) ÷ 2 = ${f(lado)} cm; la altura sale con Pitágoras:`, ecuacion: junto([`${f(lado)}² − ${f((B - b) / 2)}² = ${f(alt * alt)}`, FL, `altura = ${f(alt)} cm`, FL, 'r = ', dF(cm(rr))]) } };
  }

  const pitot = {
    id: 'poncelet-pitot',
    titulo: 'Tangentes iguales: Pitot y Poncelet',
    pregunta: '¿Qué miden los bordes de una bandeja donde un plato entra justo?',
    temas: ['Elementos y teoremas de tangencia', 'Teoremas de Poncelet y Pitot'],
    pieza: GO,
    aprendizaje: 'Las dos tangentes desde un punto miden igual; de ahí salen Pitot, en el cuadrilátero circunscrito, y Poncelet, en el triángulo rectángulo.',
    actividad: 'Correr la esquina de una bandeja junto a un plato y medir sus dos tramos.',
    // Lee: punto de contacto, circunferencia inscrita y cuadrilátero circunscrito (qué son). No dice que las dos tangentes
    // miden igual (lo muestra el juego) ni cuánto suman los lados (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un plato en su bandeja', texto: 'Un plato redondo entra justo en una bandeja: roza cada borde en un solo punto. Cada borde es tangente al plato, y el plato es la circunferencia inscrita en la bandeja.',
          pieza: GO, dibujo: fig(figBandeja([16, 22, 10, 20], {}, { contactos: true, alt: 'Una bandeja ABCD vista desde arriba, con un plato redondo que roza sus cuatro bordes en E, F, G y H.' })) },
        { titulo: 'Cuadrilátero circunscrito', texto: 'Si los cuatro lados de un cuadrilátero tocan una circunferencia, el cuadrilátero es circunscrito a ella. Cada vértice queda afuera, y de él salen dos tangentes: los dos bordes que llegan a esa esquina.' },
        { titulo: 'Lo que ya sabes', texto: 'De la idea 1: el radio que llega al punto de contacto es perpendicular a la tangente. En la esquina A, los dos radios OE y OH forman ángulo recto con su borde.' },
        { titulo: 'Qué mirar al jugar', texto: 'Aleja y acerca la esquina A del plato. Compara cada vez los dos tramos que van de A a los puntos de contacto, AE y AH.' },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'Un plato roza los dos bordes de la esquina A de una bandeja. El control aleja A, y la esquina se cierra.',
      mision: {
        texto: 'Aleja la esquina A hasta que el tramo AE mida 24 cm.',
        logrado: v => v.d === 26,
        bien: 'Con A a 26 cm del centro: AE = AH = 24 cm.',
      },
      voz: 'Compara los dos tramos que salen de A.',
      leyenda: [
        { s: 'O', t: 'el centro del plato' },
        { s: dI('OE'), t: 'un radio: 10 cm' },
        { s: dO('AE'), t: 'un tramo de borde, de A al plato' },
        { s: 'E y H', t: 'donde el plato roza los bordes' },
        { s: 'OA', t: 'lo lejos que queda A del centro' },
      ],
      controles: [{ id: 'd', etiqueta: 'OA, de A al centro', min: 12, max: 30, paso: 2, inicio: 16, unidad: 'cm', decimales: 0 }],
      dibujo: v => ({ datos: figEsquina(v.d), estado: {} }),
      lectura: v => { const t = tramoEsquina(v.d), ex = Math.abs(t - Math.round(t)) < 1e-9; return [dO(junto(`AE = AH ${ex ? '=' : '≈'} ${cm(ex ? t : Math.round(t * 10) / 10)}`)), junto(`, con OA = ${v.d} cm`)]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el plato roza los cuatro bordes de una bandeja ABCD. AB = 38 cm, BC = 32 cm y CD = 30 cm. ¿Cuánto mide DA? El dibujo no está a escala.',
      datos: ['El plato roza cada borde en un solo punto.'],
      voz: 'Piensa en los dos tramos de cada esquina.',
      opciones: [
        { id: 'c', texto: '36 cm', correcta: true },
        { id: 'opuesto', texto: '32 cm, como BC', error: 'GE-PIT2', siFuera: 'Mirar el lado de enfrente está bien; pero DA no tiene por qué copiar a BC: no es un paralelogramo.' },
        { id: 'vecinos', texto: '40 cm', error: 'GE-PIT3', siFuera: 'Sumar de a dos está bien; pero 38 + 32 − 30 junta lados vecinos. Se juntan los de enfrente.' },
        { id: 'faltan', texto: 'Faltan datos: depende de la forma', error: 'GE-PIT1', siFuera: 'La forma puede cambiar, es cierto; pero los tramos de cada esquina siguen iguales, y eso alcanza.' },
      ],
      dibujo: fig(figBandeja([12, 26, 6, 30], { AB: '38 cm', BC: '32 cm', CD: '30 cm', DA: '?' }, { sinEscala: true, alt: 'Una bandeja ABCD con un plato que roza sus cuatro bordes: AB mide 38 cm, BC 32 cm y CD 30 cm; DA lleva signo de pregunta. No está a escala.' })),
      revelar: fig(figBandeja([18, 20, 12, 18], { AB: '38 cm', BC: '32 cm', CD: '30 cm', DA: '36 cm' }, { contactos: true, alt: 'La bandeja a escala: DA mide 36 cm.' })),
      coincide: 'Coincide: AB + CD = 38 + 30 = 68 cm, y BC + DA = 32 + 36 = 68 cm.',
      noCoincide: 'Revisemos: los tramos de cada esquina miden igual, así que AB + CD = BC + DA: 38 + 30 = 32 + DA, y DA = 36 cm.',
    },
    mira: {
      pieza: GO,
      datos: figBandeja([18, 20, 12, 18], { AB: '38 cm', BC: '32 cm', CD: '30 cm', DA: '36 cm' }, { contactos: true, pares: { A: { marcas: 1, desde: 1, hasta: 1 }, C: { marcas: 2, desde: 1, hasta: 1 }, B: { marcas: 1, desde: 2, hasta: 2 }, D: { marcas: 2, desde: 2, hasta: 2 } },
        alt: 'La bandeja ABCD con el plato que roza sus bordes en E, F, G y H: los dos tramos de cada esquina miden igual.' }),
      voz: 'Sigue los dos tramos de cada esquina.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El plato roza cada borde en un punto: E, F, G y H.', ecuacion: junto('AB = AE + EB') },
        { estado: { corte: 1 }, texto: 'Desde A, AE = AH; desde C, CF = CG: tangentes desde un punto.', ecuacion: junto(['AE = AH', Y, 'CF = CG']) },
        { estado: { corte: 2 }, texto: 'Lo mismo desde B y desde D.', ecuacion: junto(['BE = BF', Y, 'DG = DH']) },
        { estado: { corte: 3 }, texto: 'AB + CD y BC + DA juntan los mismos ocho tramos.', ecuacion: junto([dO('38'), ' + ', dO('30'), ' = 68 = ', dI('32'), ' + ', dI('36')]) },
      ],
    },
    regla: {
      texto: 'Las dos tangentes desde un punto miden igual. De ahí salen Pitot, en el cuadrilátero circunscrito, y Poncelet, en el triángulo rectángulo con su circunferencia inscrita.',
      ecuacion: junto([dO('AB'), ' + ', dO('CD'), ' = ', dI('BC'), ' + ', dI('DA'), Y, dO('a'), ' + ', dI('b'), ' = c + 2r']),
      condicion: 'Pitot: los cuatro lados de ABCD tocan la circunferencia. Poncelet (el dibujo): a y b, catetos; c, hipotenusa; r, el radio inscrito.',
      voz: 'En cada vértice de afuera, busca sus dos tramos iguales.',
      // (Lector en frío, 19 nov: el triángulo llevaba A, B y C, y AB era la hipotenusa mientras la fórmula de Pitot usa AB.
      // Va sin letras en los vértices, con a, b, c y r.)
      dibujo: fig(figPoncelet(8, 6, { textos: { a: 'a', b: 'b', c: 'c', r: 'r' }, cuadrado: true, sinLetras: true, alt: 'Poncelet: un triángulo rectángulo de catetos a y b e hipotenusa c, con su circunferencia inscrita de radio r; en el ángulo recto, los dos radios forman un cuadrado de lado r.' })),
    },
    // Así se resuelve: el cuarto lado con Pitot (otros números que «Ahora tú») o el radio con Poncelet (otros ternos).
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const [a, b, c, dd] = [r.ent(16, 24), r.ent(16, 24), r.ent(16, 24), r.ent(16, 24)], AB = a + b, BC = b + c, CD = c + dd, DA = dd + a;
          return {
            enunciado: `Los cuatro lados del cuadrilátero ABCD tocan una circunferencia. AB = ${AB} cm, BC = ${BC} cm y DA = ${DA} cm. ¿Cuánto mide CD?`,
            datos: [D_PITOT],
            pasos: [
              { tipo: 'pide', texto: 'Piden el lado CD de un cuadrilátero circunscrito: sus cuatro lados tocan la circunferencia.' },
              { tipo: 'datos', texto: `AB = ${AB} cm, BC = ${BC} cm y DA = ${DA} cm. El opuesto de CD es AB.` },
              { tipo: 'regla', texto: 'Desde cada vértice, los dos tramos tangentes miden igual; por eso los lados opuestos suman lo mismo (Pitot).', ecuacion: junto('AB + CD = BC + DA') },
              { tipo: 'cuentas', texto: 'Se reemplaza y se despeja CD.', ecuacion: junto([`${AB} + CD = ${BC} + ${DA} = ${BC + DA}`, FL, `CD = ${BC + DA} − ${AB} = `, dF(cm(CD))]) },
              { tipo: 'sentido', texto: `Comprobación: ${AB} + ${CD} = ${AB + CD} y ${BC} + ${DA} = ${BC + DA}.` },
            ],
            respuesta: [junto('CD = '), dF(cm(CD))],
          };
        }
        const [hh, p, q] = r.de([[15, 9, 12], [20, 12, 16], [30, 18, 24], [34, 16, 30], [39, 15, 36], [51, 24, 45]]), rr = (p + q - hh) / 2;
        return {
          enunciado: `Un triángulo rectángulo tiene catetos de ${p} cm y ${q} cm, e hipotenusa de ${hh} cm. ¿Cuánto mide el radio de su circunferencia inscrita?`,
          datos: [D_PONCELET],
          pasos: [
            { tipo: 'pide', texto: 'Piden el radio r de la circunferencia que toca los tres lados por dentro.' },
            { tipo: 'datos', texto: `Catetos de ${p} cm y ${q} cm; hipotenusa de ${hh} cm.` },
            { tipo: 'regla', texto: 'En el ángulo recto, los dos tramos tangentes miden r. Por eso los catetos suman la hipotenusa más 2r (Poncelet).', ecuacion: junto('a + b = c + 2r') },
            { tipo: 'cuentas', texto: `Se reemplaza, ${junto(`${p} + ${q} = ${hh} + 2r`)}, y se despeja r.`, ecuacion: junto([`2r = ${2 * rr}`, FL, 'r = ', dF(cm(rr))]) },
            { tipo: 'sentido', texto: `Tiene sentido: el diámetro, ${cm(2 * rr)}, es menor que el cateto menor, ${cm(Math.min(p, q))}.` },
          ],
          respuesta: [junto('r = '), dF(cm(rr))],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca los dos tramos iguales de cada vértice.',
      generar(s) { return conCuatro([casoPitot, casoTriangulo, casoPoncelet, casoTercera, casoTrapecio][s % 5], azar(s + 11), firmasDe(EJ2)); },
    },
  };

  // ======================= Idea 3: posición de dos circunferencias =======================
  // Objeto de la primera pantalla: dos círculos de luz de dos linternas en el piso (geo-objeto, escena «redondo», tipo
  // «luces»; dibujo de prueba). El borde de cada luz es una circunferencia; los radios, 40 cm y 20 cm.
  // Cambia: la distancia d entre los centros. · Permanece: los dos radios. · Progresa: cómo quedan los bordes (separados,
  // se tocan, se cortan, uno dentro del otro). · Se reserva: otros radios (la predicción). · Debe verse: dónde cambia.
  const KL = 0.05;   // las luces: 1 cm = 0,05 en el plano
  const VLU = { x: [-2.3, 5.3], y: [-2.3, 2.3] };
  // Las dos luces de radios r1 y r2 (cm) con los centros a d cm. o: { textos: true (los dos radios), d: false (sin d),
  //   extra: [{ d, desde, hasta, texto }] (más copias de la chica, punteadas), vista, alt }
  function figLuces(d, r1, r2, o = {}) {
    const R1 = r1 * KL, R2 = r2 * KL, P2 = [d * KL, 0];
    const pts = { O1: [0, 0], O2: P2 };
    const letra = { O1: 'O₁', O2: d === 0 ? null : 'O₂' };
    const ver = { O1: { lado: d === 0 ? 90 : 180 }, O2: { lado: 0 } };
    const segs = [], lados = [], circs = [{ centro: [0, 0], r: R1, color: 'o', grosor: 'variable' }, { centro: P2, r: R2, color: 'i', grosor: 'variable' }];
    if (d > 0 && o.d !== false) { segs.push(['O1', 'O2']); if (o.textoD) lados.push({ de: 'O1', a: 'O2', texto: o.textoD, ref: '~arriba', dist: 4 }); }
    pts['~arriba'] = [0, 3];
    if (o.textos) {
      pts['~r1'] = sobre([0, 0], R1, 140); pts['~r2'] = sobre(P2, R2, 40);
      segs.push(['O1', '~r1', { color: 'o' }], ['O2', '~r2', { color: 'i' }]);
      lados.push({ de: 'O1', a: '~r1', texto: `${r1} cm`, color: 'o', ref: '~abajo', dist: 4 }, { de: 'O2', a: '~r2', texto: `${r2} cm`, color: 'i', ref: '~abajo2', dist: 4 });
      pts['~abajo'] = [0.4, -1]; pts['~abajo2'] = [P2[0] + 0.4, -1];
    }
    // Más copias de la chica, punteadas, cada una con su centro marcado, la recta punteada desde O₁ y su rótulo afuera, en
    // la punta lejana (lector en frío, 19 nov: «d = 80 cm» quedaba sobre la chica llena y los centros no se veían). x.dir:
    // la dirección desde O₁ (grados; sin dir, a la derecha, como antes).
    const libres = [], vis = x => Object.assign({}, x.desde !== undefined ? { desde: x.desde } : {}, x.hasta !== undefined ? { hasta: x.hasta } : {});
    (o.extra || []).forEach((x, k) => {
      const c = U.polar([0, 0], x.d * KL, x.dir || 0);
      circs.push(Object.assign({ centro: c, r: R2, color: 'i', discontinua: true }, vis(x)));
      if (x.dir === undefined) { if (!x.texto) return; const arriba = k % 2 === 1; pts[`~x${k}`] = [x.d * KL, arriba ? R2 : -Math.max(R1, R2)]; libres.push(Object.assign({ en: `~x${k}`, dir: arriba ? 90 : 270, dist: 4, texto: x.texto }, vis(x))); return; }
      pts[`~c${k}`] = c; ver[`~c${k}`] = Object.assign({ sinPunto: false }, vis(x));
      segs.push(['O1', `~c${k}`, Object.assign({ discontinua: true, grosor: 'fino' }, vis(x))]);
      if (x.texto) { pts[`~x${k}`] = U.polar([0, 0], x.d * KL + R2, x.dir); libres.push(Object.assign({ en: `~x${k}`, dir: x.dir, dist: 5, texto: x.texto }, vis(x))); }
    });
    if (o.textoChica) { pts['~xc'] = U.polar([0, 0], d * KL + R2, 0); libres.push({ en: '~xc', dir: 0, dist: 5, texto: o.textoChica }); }
    return circ({ pts, letra, ver, fijas: ['O1', 'O2'], segs, lados, libres, circs, vista: o.vista || VLU, alto: 240,
      obj: { tipo: 'luces', luces: [{ centro: [0, 0], r: R1 }, { centro: P2, r: R2 }] },
      alt: o.alt || `Dos círculos de luz de ${r1} cm y ${r2} cm de radio, con los centros a ${d} cm: ${posicionDe(d, r1, r2)}.` });
  }
  // La posición, en palabras (la del juego y la de los ejercicios).
  function posicionDe(d, r1, r2) {
    if (d === 0) return 'mismo centro: son concéntricas';
    if (d > r1 + r2) return 'no se tocan, una fuera de la otra: exteriores';
    if (d === r1 + r2) return 'se tocan por fuera en un punto: tangentes exteriores';
    if (d > r1 - r2) return 'se cortan en dos puntos: secantes';
    if (d === r1 - r2) return 'se tocan por dentro en un punto: tangentes interiores';
    return 'no se tocan, una dentro de la otra: interiores';
  }
  const NOMBRE = d => ({ 'exteriores': 'Exteriores', 'tangentes exteriores': 'Tangentes exteriores', 'secantes': 'Secantes', 'tangentes interiores': 'Tangentes interiores', 'interiores': 'Interiores', 'son concéntricas': 'Concéntricas' }[d]);
  const nombreDe = (d, r1, r2) => { const p = posicionDe(d, r1, r2); return NOMBRE(p.slice(p.lastIndexOf(': ') + 2)); };

  const D_POS = 'Con radios r₁ ≥ r₂ y d entre los centros: d > r₁ + r₂, exteriores; d = r₁ + r₂, tangentes exteriores.';
  const D_POS2 = 'r₁ − r₂ < d < r₁ + r₂, secantes; d = r₁ − r₂, tangentes interiores; d < r₁ − r₂, interiores; d = 0, concéntricas.';
  const D_LINEA = 'Si dos circunferencias son tangentes, el punto de contacto está en la recta que une los centros.';
  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 3): secantes; tangentes exteriores (d = 12); interiores;
  // 15 cm; 13 cm; 9 cm (tangente interior, r2 = 16 − 7); 6 cm (dos tangentes); 4 cm (r2 de 14 − 10); 8, 10 y 12 entre 18 y 22;
  // más de 3 y menos de 17; 12 cm (tangente común exterior: √(13² − 5²)); 6 cm, 4 cm y 8 cm; 5 cm; 22 cm; 30 cm.
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'Dos aros que se cruzan',
    enunciado: 'Dos circunferencias tienen radios de 7 cm y 4 cm, y sus centros están a 9 cm. ¿Cuál es su posición?',
    datos: [D_POS, D_POS2],
    solucion: [{ texto: 'Se compara d con la suma y la resta de los radios:', ecuacion: junto(['7 − 4 = 3 < 9 < 11 = 7 + 4']) },
      { texto: ['d queda entre la resta y la suma: se cortan en dos puntos, son ', dF('secantes'), '.'] }],
    respuesta: [dF('Secantes')] });
  EJ3.push({ nivel: 1, titulo: 'Se tocan por fuera',
    enunciado: 'Dos ruedas de 7 cm y 5 cm de radio se tocan por fuera en un solo punto. ¿A qué distancia están sus centros?',
    datos: [D_POS, D_LINEA],
    solucion: [{ texto: 'Tangentes exteriores: d es la suma de los radios.', ecuacion: junto(['d = ', dO('7'), ' + ', dI('5'), ' = ', dF('12 cm')]) }],
    respuesta: [junto('d = '), dF('12 cm')] });
  EJ3.push({ nivel: 1, titulo: 'Una dentro de otra',
    enunciado: 'Dos circunferencias tienen radios de 10 cm y 3 cm, y sus centros están a 2 cm. ¿Cuál es su posición?',
    datos: [D_POS, D_POS2],
    solucion: [{ texto: 'Se compara d con la resta de los radios:', ecuacion: junto(['d = 2 < 7 = 10 − 3']) },
      { texto: ['La chica queda adentro sin tocar el borde: son ', dF('interiores'), '.'] }],
    respuesta: [dF('Interiores')] });
  EJ3.push({ nivel: 1, titulo: 'Se tocan por dentro',
    enunciado: 'Un aro de 20 cm de radio y otro de 5 cm se tocan por dentro en un solo punto. ¿A qué distancia están sus centros?',
    datos: [D_POS2, D_LINEA],
    solucion: [{ texto: 'Tangentes interiores: d es la resta de los radios.', ecuacion: junto(['d = ', dO('20'), ' − ', dI('5'), ' = ', dF('15 cm')]) }],
    respuesta: [junto('d = '), dF('15 cm')] });
  EJ3.push({ nivel: 1, titulo: 'El radio que falta',
    enunciado: 'Dos circunferencias son tangentes exteriores y sus centros están a 21 cm. Una tiene 8 cm de radio. ¿Cuánto mide el radio de la otra?',
    datos: [D_POS],
    solucion: [{ texto: 'Por fuera, los radios suman d:', ecuacion: junto(['8 + r = 21', FL, 'r = ', dF('13 cm')]) }],
    respuesta: [dF('13 cm')] });

  EJ3.push({ nivel: 2, titulo: 'Adentro, tocándose',
    enunciado: 'Una circunferencia de 16 cm de radio tiene adentro otra, tangente a ella, y sus centros están a 7 cm. ¿Cuánto mide el radio de la chica?',
    datos: [D_POS2],
    solucion: [{ texto: 'Tangentes interiores: d es la resta de los radios.', ecuacion: junto(['16 − r = 7']) },
      { texto: 'Se despeja:', ecuacion: junto(['r = 16 − 7 = ', dF('9 cm')]) }],
    respuesta: [dF('9 cm')] });
  EJ3.push({ nivel: 2, titulo: 'Dos iguales que se tocan',
    enunciado: 'Dos circunferencias iguales son tangentes exteriores, y la distancia entre sus centros es 12 cm. ¿Cuánto mide cada radio?',
    datos: [D_POS],
    solucion: [{ texto: 'Por fuera, d es la suma de los dos radios, que miden igual:', ecuacion: junto(['r + r = 12', FL, '2r = 12']) },
      { texto: 'Cada radio:', ecuacion: junto(['r = 12 ÷ 2 = ', dF('6 cm')]) }],
    respuesta: [dF('6 cm'), ' cada uno'] });
  EJ3.push({ nivel: 2, titulo: 'Una entre dos',
    enunciado: 'Tres platos están en fila sobre una mesa, cada uno tocando al siguiente. Los de las puntas tienen 10 cm y 6 cm de radio, y sus centros están a 28 cm. ¿Cuánto mide el radio del plato del medio?',
    datos: [D_POS, D_LINEA],
    solucion: [{ texto: 'De un centro de punta al otro se recorren el radio de 10 cm, el diámetro de la del medio y el radio de 6 cm:', ecuacion: junto(['10 + 2r + 6 = 28']) },
      { texto: 'Se despeja:', ecuacion: junto(['2r = 12', FL, 'r = ', dF('6 cm')]) }],
    respuesta: [dF('6 cm')] });
  EJ3.push({ nivel: 2, titulo: 'Qué radio les sirve',
    enunciado: 'Una circunferencia tiene 10 cm de radio y otra, de radio r, tiene su centro a 15 cm. ¿Entre qué valores puede estar r para que se corten en dos puntos?',
    datos: [D_POS, D_POS2],
    solucion: [{ texto: 'Si r < 10: secantes cuando 10 − r < 15 < 10 + r, o sea r > 5. Si r ≥ 10: cuando r − 10 < 15, o sea r < 25.' },
      { texto: 'Juntando los dos casos:', ecuacion: junto(['5 cm < r < ', dF('25 cm')]) }],
    respuesta: ['Más de 5 cm y menos de ', dF('25 cm')] });
  EJ3.push({ nivel: 2, titulo: 'Los límites de d',
    enunciado: 'Dos circunferencias de 10 cm y 7 cm de radio son secantes. ¿Entre qué valores puede estar la distancia d entre sus centros?',
    datos: [D_POS, D_POS2],
    solucion: [{ texto: 'Secantes: d queda entre la resta y la suma de los radios.', ecuacion: junto(['10 − 7 < d < 10 + 7']) },
      { texto: 'Los extremos no entran: ahí se tocan en un punto.', ecuacion: junto(['3 cm < d < ', dF('17 cm')]) }],
    respuesta: ['Más de 3 cm y menos de ', dF('17 cm')] });

  // Nivel 3 (examen): la correcta en D, A, C, E y B.
  EJ3.push({ nivel: 3, titulo: 'La faja de dos poleas',
    enunciado: 'Dos poleas de 9 cm y 4 cm de radio tienen sus centros a 13 cm. Una faja recta toca las dos por el mismo lado. ¿Cuánto mide ese tramo recto, entre los dos puntos de contacto?',
    alternativas: ['13 cm', '5 cm', '17 cm', '12 cm', '√194 cm'],
    datos: [D_TAN, D_PIT, 'Los dos radios a la faja son paralelos: los dos son perpendiculares a ella.'],
    solucion: [{ texto: 'Por el centro chico, una paralela a la faja arma un triángulo rectángulo: hipotenusa 13 cm (los centros) y un cateto 9 − 4 = 5 cm.' },
      { texto: 'El otro cateto mide lo que la faja:', ecuacion: junto(['13² − 5² = 144', FL, '√144 = ', dF('12 cm')]) },
      { texto: '13 cm es la distancia entre centros; 5 cm, la resta de los radios; 17 cm suma 13 y 4; √194 cm suma los cuadrados.' }],
    respuesta: [dF('12 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Tres ruedas',
    enunciado: 'Tres ruedas son tangentes exteriores de dos en dos. Las distancias entre sus centros son 10 cm, 12 cm y 14 cm. ¿Cuánto mide el radio de la rueda más chica?',
    alternativas: ['4 cm', '6 cm', '5 cm', '8 cm', '12 cm'],
    datos: [D_POS],
    solucion: [{ texto: 'Con radios x ≤ y ≤ z: x + y = 10, x + z = 12 e y + z = 14. Sumando las tres:', ecuacion: junto(['2(x + y + z) = 36', FL, 'x + y + z = 18']) },
      { texto: 'La más chica es lo que falta a 14 para 18:', ecuacion: junto(['x = 18 − 14 = ', dF('4 cm')]) },
      { texto: '6 cm y 8 cm son los otros dos radios; 5 cm es la mitad de 10; 12 cm, la mitad de 24, la suma de dos distancias.' }],
    respuesta: [dF('4 cm')] });
  EJ3.push({ nivel: 3, titulo: 'La chica entre la grande',
    enunciado: 'La circunferencia chica es tangente interior a la grande, de 18 cm de radio. El centro de la chica está a 13 cm del centro de la grande. ¿Cuánto mide el diámetro de la chica?',
    alternativas: ['5 cm', '31 cm', '10 cm', '26 cm', '13 cm'],
    datos: [D_POS2, 'El diámetro mide dos radios.'],
    solucion: [{ texto: 'Tangentes interiores: d es la resta de los radios.', ecuacion: junto(['18 − r = 13', FL, 'r = 5 cm']) },
      { texto: ['El diámetro: 2 · 5 cm = ', dF('10 cm'), '.'] },
      { texto: '5 cm es el radio; 31 cm suma los dos números; 26 cm duplica d; 13 cm es la distancia entre los centros.' }],
    respuesta: [dF('10 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Una dentro, otra fuera',
    // (Lector en frío, 19 nov: con la de 2 cm del otro lado, las tres se tocaban en un mismo punto. Ahora la chica queda
    // entre los dos centros, dentro de la grande y sin tocarla.)
    enunciado: 'Una circunferencia de 6 cm de radio toca por dentro a una de 20 cm y por fuera a una de 4 cm, cuyo centro queda entre los otros dos, en línea. ¿A qué distancia está del centro grande?',
    alternativas: ['24 cm', '16 cm', '14 cm', '10 cm', '4 cm'],
    datos: [D_POS, D_POS2, D_LINEA],
    solucion: [{ texto: 'De la grande a la de 6 cm, por dentro: 20 − 6 = 14 cm. De la de 6 cm a la de 4 cm, por fuera: 6 + 4 = 10 cm.' },
      { texto: ['El centro de la de 4 cm queda entre los otros dos: el segundo tramo se resta del primero, ', junto('14 − 10 = '), dF('4 cm'), '.'] },
      { texto: '24 cm suma los dos tramos, como si la chica quedara del otro lado; 16 cm resta 10 de 20 + 6; 14 cm y 10 cm son un solo tramo.' }],
    respuesta: [dF('4 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Radios en razón',
    enunciado: 'Dos circunferencias tangentes exteriores tienen sus radios en la razón 3 : 2, y sus centros están a 25 cm. ¿Cuánto mide el radio mayor?',
    alternativas: ['10 cm', '15 cm', '12,5 cm', '25 cm', '5 cm'],
    datos: [D_POS, 'Radios en la razón 3 : 2: miden 3k y 2k.'],
    solucion: [{ texto: 'Por fuera, los radios suman d:', ecuacion: junto(['3k + 2k = 25', FL, 'k = 5']) },
      { texto: ['El mayor: 3 · 5 cm = ', dF('15 cm'), '.'] },
      { texto: '10 cm es el menor; 5 cm, k; 12,5 cm, la mitad de d; 25 cm, d entero.' }],
    respuesta: [dF('15 cm')] });

  // «Ahora tú» de la idea 3. Tipos: la posición (cinco casos); d para que se toquen; el radio que falta; tres ruedas
  // tangentes de dos en dos; la faja de dos poleas (la tangente común exterior).
  const POSICIONES = ['Exteriores', 'Tangentes exteriores', 'Secantes', 'Tangentes interiores', 'Interiores'];
  function casoPosicion(r) {
    const r1 = r.ent(6, 15), r2 = r.ent(2, r1 - 2), k = r.ent(0, 4);
    const d = [r1 + r2 + r.ent(1, 6), r1 + r2, r.ent(r1 - r2 + 1, r1 + r2 - 1), r1 - r2, r.ent(1, r1 - r2 - 1)][k], bien = nombreDe(d, r1, r2);
    const pq = { 'Exteriores': `d > ${r1 + r2}`, 'Tangentes exteriores': `d = ${r1 + r2}`, 'Secantes': `${r1 - r2} < d < ${r1 + r2}`, 'Tangentes interiores': `d = ${r1 - r2}`, 'Interiores': `d < ${r1 - r2}` };
    const otras = r.baraja(POSICIONES.filter(x => x !== bien)).slice(0, 3);
    return { pregunta: `Dos circunferencias tienen radios de ${r1} cm y ${r2} cm, y sus centros están a ${d} cm. ¿Cuál es su posición?`,
      datos: [D_POS, D_POS2],
      opciones: [{ id: 'c', texto: bien, correcta: true }].concat(otras.map(x => ({ id: x.replace(/ /g, '-').toLowerCase(), texto: x, error: 'GE-POS4', siFuera: `Comparar d está bien; «${x.toLowerCase()}» pediría ${pq[x]}.` }))),
      solucion: { texto: `Se compara d = ${d} con ${r1 + r2} (la suma) y ${r1 - r2} (la resta):`, ecuacion: junto([dF(bien)]) } };
  }
  function casoTocar(r) {
    const r1 = r.ent(6, 20), r2 = r.ent(2, r1 - 1), fuera = r.ent(0, 1) === 1, d = fuera ? r1 + r2 : r1 - r2;
    return { pregunta: `Dos circunferencias de ${r1} cm y ${r2} cm de radio son tangentes ${fuera ? 'exteriores' : 'interiores'}. ¿A qué distancia están sus centros?`,
      datos: [D_POS, D_POS2],
      opciones: opciones(d, OPS(r, [
        { id: 'otra', valor: fuera ? r1 - r2 : r1 + r2, error: 'GE-POS5', siFuera: fuera ? 'Usar los dos radios está bien; por fuera se suman, no se restan.' : 'Usar los dos radios está bien; por dentro se restan, no se suman.' },
        { id: 'diam', valor: 2 * (fuera ? r1 + r2 : r1 - r2), error: 'GE-POS6', siFuera: 'La cuenta de los radios está bien; d va de centro a centro: no se duplica.' },
        { id: 'grande', valor: r1, error: 'GE-POS7', siFuera: `${r1} cm es el radio grande; d también usa el chico.` }]), cm),
      solucion: { texto: fuera ? 'Por fuera, d es la suma de los radios:' : 'Por dentro, d es la resta de los radios:', ecuacion: junto([`d = ${r1} ${fuera ? '+' : '−'} ${r2} = `, dF(cm(d))]) } };
  }
  function casoRadio(r) {
    const r1 = r.ent(8, 25), r2 = r.ent(2, r1 - 2), fuera = r.ent(0, 1) === 1, d = fuera ? r1 + r2 : r1 - r2;
    return { pregunta: `Dos circunferencias son tangentes ${fuera ? 'exteriores' : 'interiores'} y sus centros están a ${d} cm. La ${fuera ? 'primera' : 'grande'} tiene ${r1} cm de radio. ¿Cuánto mide el radio de la otra?`,
      datos: [D_POS, D_POS2],
      opciones: opciones(r2, OPS(r, [
        { id: 'otra', valor: fuera ? d + r1 : d + r1, error: 'GE-POS5', siFuera: fuera ? 'Usar d y el radio está bien; por fuera los radios suman d: se resta.' : 'Usar d y el radio está bien; por dentro, el radio chico es el grande menos d.' },
        { id: 'resta', valor: fuera ? r1 - d : d - r1, error: 'GE-POS8', siFuera: 'La relación está bien; al despejar, el radio conocido pasa con el signo que corresponde.' },
        { id: 'mitad', valor: d / 2, error: 'GE-POS9', siFuera: `${f(d / 2)} cm sería si los dos radios fueran iguales; aquí uno mide ${r1} cm.` },
        { id: 'grande', valor: r1, error: 'GE-POS7', siFuera: `${r1} cm es el radio conocido; el otro sale de d.` },
        { id: 'dvalor', valor: d, error: 'GE-POS7', siFuera: `${d} cm es d, de centro a centro; el radio es solo una parte.` }]), cm),
      solucion: { texto: fuera ? 'Por fuera, los radios suman d:' : 'Por dentro, la resta de los radios es d:', ecuacion: junto([fuera ? `${r1} + r = ${d}` : `${r1} − r = ${d}`, FL, 'r = ', dF(cm(r2))]) } };
  }
  function casoTres(r) {
    for (;;) {
      const x = r.ent(2, 9), y = r.ent(x + 1, 11), z = r.ent(y + 1, 14), a = x + y, b = x + z, c = y + z;
      const pide = r.de(['chica', 'grande']), sol = pide === 'chica' ? x : z;
      return { pregunta: `Tres ruedas son tangentes exteriores de dos en dos. Las distancias entre sus centros son ${a} cm, ${b} cm y ${c} cm. ¿Cuánto mide el radio de la rueda más ${pide}?`,
        datos: [D_POS],
        opciones: opciones(sol, OPS(r, [
          { id: 'medio', valor: y, error: 'GE-POS10', siFuera: `El sistema está bien: ${y} cm es el radio de la del medio.` },
          { id: 'mitad', valor: (pide === 'chica' ? a : c) / 2, error: 'GE-POS9', siFuera: 'Partir una distancia en dos sería si las dos ruedas fueran iguales.' },
          { id: 'otra', valor: pide === 'chica' ? z : x, error: 'GE-POS10', siFuera: `El sistema está bien; ${pide === 'chica' ? z : x} cm es el radio de la otra punta.` },
          { id: 'suma', valor: (a + b + c) / 2, error: 'GE-POS11', siFuera: 'Sumar las tres está bien: da dos veces los tres radios. Falta restar.' }]), cm),
        solucion: { texto: 'Sumando las tres distancias, cada radio entra dos veces:', ecuacion: junto([`x + y + z = ${(a + b + c) / 2}`, FL, `${(a + b + c) / 2} − ${pide === 'chica' ? c : a} = `, dF(cm(sol))]) } };
    }
  }
  function casoFaja(r) {
    const [hh, p, q] = r.de(TERNOS.filter(t => t[0] <= 41)), [dif, t] = r.ent(0, 1) ? [p, q] : [q, p], r2 = r.ent(2, 8), r1 = r2 + dif;
    return { pregunta: `Dos poleas de ${r1} cm y ${r2} cm de radio tienen sus centros a ${hh} cm. Una faja recta toca las dos por el mismo lado. ¿Cuánto mide el tramo recto, entre los puntos de contacto?`,
      datos: [D_TAN, D_PIT, 'Los dos radios a la faja son paralelos: los dos son perpendiculares a ella.'],
      opciones: opciones(t, OPS(r, [
        { id: 'd', valor: hh, error: 'GE-POS12', siFuera: `${hh} cm es la distancia entre centros: la faja es un cateto, no la hipotenusa.` },
        { id: 'suma', valor: Math.sqrt(hh * hh - (r1 + r2) ** 2), entero: true, error: 'GE-POS13', siFuera: 'Pitágoras está bien; pero el cateto es la resta de los radios: la faja va por el mismo lado.' },
        { id: 'resta', valor: hh - dif, error: 'GE-CIR5', siFuera: 'Usar la resta de los radios está bien; pero no se resta de d: forman un triángulo rectángulo.' },
        { id: 'sumaC', valor: Math.hypot(hh, dif), entero: true, error: 'GE11', siFuera: 'Pitágoras está bien; pero d es la hipotenusa: se restan los cuadrados.' }]), cm),
      solucion: { texto: `Una paralela a la faja por el centro chico arma un triángulo rectángulo: hipotenusa ${hh}, cateto ${dif}:`, ecuacion: junto([`${hh}² − ${dif}² = ${t * t}`, FL, dF(cm(t))]) } };
  }

  const posiciones = {
    id: 'posiciones',
    titulo: 'Posición de dos circunferencias',
    pregunta: '¿Cuándo se cruzan dos círculos de luz?',
    temas: ['Posiciones relativas de dos circunferencias'],
    pieza: GO,
    aprendizaje: 'Dos circunferencias se cortan, se tocan o se separan según cómo se compara la distancia entre centros con la suma y la resta de radios.',
    actividad: 'Acercar y alejar dos círculos de luz hasta que se toquen o se crucen.',
    // Lee: qué es cada posición, con su nombre. No dice para qué distancias pasa cada una (la regla y la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Dos linternas', texto: 'Dos linternas apuntan al piso y cada una hace un círculo de luz. El borde de cada luz es una circunferencia: la grande mide 40 cm de radio y la chica, 20 cm. La distancia entre sus centros se llama d.',
          pieza: GO, dibujo: fig(figLuces(70, 40, 20, { alt: 'Dos círculos de luz en el piso, de 40 cm y 20 cm de radio, separados.' })) },
        { titulo: 'Los nombres', texto: 'Si los bordes se cortan en dos puntos, son circunferencias secantes. Si se tocan en un solo punto, son tangentes: exteriores si una queda fuera de la otra, interiores si queda dentro.' },
        { titulo: 'Sin tocarse', texto: 'Si no se tocan, son exteriores (una fuera de la otra) o interiores (una dentro de la otra). Con el mismo centro, son concéntricas.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia d de 10 en 10 y anota en qué valores los bordes se tocan en un solo punto. Compáralos con los dos radios.' },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'Dos linternas hacen círculos de luz de 40 cm y 20 cm de radio en el piso. Se puede correr la chica.',
      mision: {
        texto: 'Acerca las luces hasta que sus bordes se toquen por dentro.',
        logrado: v => v.d === 20,
        bien: 'Con d = 20 cm se tocan por dentro: 40 − 20 = 20.',
      },
      voz: 'Busca los dos valores de d en que los bordes apenas se tocan.',
      leyenda: [
        { s: dO('O₁'), t: 'centro de la luz grande: radio 40 cm' },
        { s: dI('O₂'), t: 'centro de la luz chica: radio 20 cm' },
        { s: 'd', t: 'la distancia entre los centros' },
      ],
      controles: [{ id: 'd', etiqueta: 'd, entre los centros', min: 0, max: 80, paso: 10, inicio: 70, unidad: 'cm', decimales: 0 }],
      dibujo: v => ({ datos: figLuces(v.d, 40, 20), estado: {} }),
      lectura: v => { const p = posicionDe(v.d, 40, 20); return [junto(`d = ${v.d} cm: `), p.slice(0, p.lastIndexOf(':'))]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Otras dos linternas hacen círculos de 50 cm y 30 cm de radio. ¿Para qué distancias d entre los centros se cortan sus bordes en dos puntos?',
      datos: ['Un radio mide 50 cm y el otro, 30 cm.'],
      voz: 'Busca primero dónde se tocan en un solo punto.',
      opciones: [
        { id: 'c', texto: 'Más de 20 cm y menos de 80 cm', correcta: true },
        { id: 'solo', texto: 'Cualquier d menor que 80 cm', error: 'GE-POS1', siFuera: 'El 80 está bien; pero con d chica, la luz chica queda adentro, sin cortar el borde.' },
        { id: 'radios', texto: 'Entre 30 cm y 50 cm', error: 'GE-POS2', siFuera: 'Mirar los radios está bien; pero los límites son su suma y su resta, no los radios.' },
        { id: 'cerrado', texto: 'De 20 cm a 80 cm, con los dos incluidos', error: 'GE-POS3', siFuera: 'Los límites están bien; pero en 20 y en 80 se tocan en un solo punto.' },
      ],
      dibujo: fig(figLuces(90, 50, 30, { d: false, vista: { x: [-2.8, 6.3], y: [-2.8, 2.8] }, alt: 'Dos círculos de luz de 50 cm y 30 cm de radio, separados.' })),
      revelar: fig(figLuces(50, 50, 30, { d: false, textoChica: 'd = 50 cm', extra: [{ d: 20, dir: 130, texto: 'd = 20 cm' }, { d: 80, dir: -30, texto: 'd = 80 cm' }], vista: { x: [-2.8, 6.3], y: [-4.1, 2.8] }, alt: 'La luz chica en tres lugares: a 20 cm y a 80 cm del centro grande, toca el borde en un punto; entre los dos, lo corta en dos puntos.' })),
      coincide: 'Coincide: se tocan por dentro con d = 50 − 30 = 20 cm y por fuera con d = 50 + 30 = 80 cm; entre los dos, se cortan.',
      noCoincide: 'Revisemos: se tocan por dentro con d = 20 cm y por fuera con d = 80 cm. Solo entre esos dos valores, sin ellos, se cortan en dos puntos.',
    },
    mira: {
      pieza: GO,
      datos: figLuces(50, 50, 30, { d: false, textoChica: 'd = 50 cm', extra: [{ d: 20, dir: 130, texto: 'd = 20 cm', desde: 2 }, { d: 80, dir: -30, texto: 'd = 80 cm', desde: 1 }], vista: { x: [-2.8, 6.3], y: [-4.1, 2.8] }, alt: 'La luz chica a 20 cm, a 50 cm y a 80 cm del centro grande, cada una con su centro marcado.' }),
      voz: 'Primero los dos casos en que apenas se tocan.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Con d = 50 cm, los bordes se cortan en dos puntos.', ecuacion: junto('d = 50 cm') },
        { estado: { corte: 1 }, texto: 'Por fuera se tocan cuando d junta los dos radios.', ecuacion: junto(['d = ', dO('50'), ' + ', dI('30'), ' = 80 cm']) },
        { estado: { corte: 2 }, texto: 'Por dentro se tocan cuando d es la resta de los radios.', ecuacion: junto(['d = ', dO('50'), ' − ', dI('30'), ' = 20 cm']) },
        { estado: { corte: 2 }, texto: 'Entre esos dos valores, y sin ellos, se cortan.', ecuacion: junto('20 cm < d < 80 cm') },
      ],
    },
    regla: {
      // (Lector en frío, 19 nov: «r₁ − r₂» se partía entre dos renglones. Dicho en palabras; la fórmula va debajo.)
      texto: 'Si d es mayor que la suma de los radios, exteriores; igual, tangentes exteriores; entre la resta y la suma, secantes; igual a la resta, tangentes interiores; menor, interiores.',
      ecuacion: junto([dO('r₁'), ' − ', dI('r₂'), ' < d < ', dO('r₁'), ' + ', dI('r₂')]),
      condicion: 'r₁ es el radio mayor y r₂ el menor; con d = 0, las dos son concéntricas.',
      voz: 'Calcula la suma y la resta de los radios, y ubica d.',
    },
    // Así se resuelve: la posición, o el radio que falta (otros números que «Ahora tú»).
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const r1 = r.ent(20, 30), r2 = r.ent(5, 15), d = [r1 + r2 + r.ent(2, 9), r.ent(r1 - r2 + 1, r1 + r2 - 1), r.ent(1, r1 - r2 - 1)][Math.floor(s / 2) % 3], bien = nombreDe(d, r1, r2);
          return {
            enunciado: `Dos circunferencias tienen radios de ${r1} cm y ${r2} cm, y sus centros están a ${d} cm. ¿Cuál es su posición?`,
            datos: [D_POS, D_POS2],
            pasos: [
              { tipo: 'pide', texto: 'Piden la posición: si se cortan, se tocan en un punto o no se tocan.' },
              { tipo: 'datos', texto: `r₁ = ${r1} cm, r₂ = ${r2} cm y d = ${d} cm.` },
              { tipo: 'regla', texto: 'Se compara d con la suma y con la resta de los radios.', ecuacion: junto(`r₁ + r₂ = ${r1 + r2}   y   r₁ − r₂ = ${r1 - r2}`) },
              { tipo: 'cuentas', texto: 'Se ubica d entre esos dos números.', ecuacion: junto([d > r1 + r2 ? `${d} > ${r1 + r2}` : d > r1 - r2 ? `${r1 - r2} < ${d} < ${r1 + r2}` : `${d} < ${r1 - r2}`, FL, dF(bien)]) },
              { tipo: 'sentido', texto: d > r1 + r2 ? 'Los centros están más lejos que los dos radios juntos: no llegan a tocarse.' : d > r1 - r2 ? 'Ni tan lejos como la suma ni tan cerca como la resta: los bordes se cruzan.' : 'Los centros están tan cerca que la chica cabe entera adentro.' },
            ],
            respuesta: [dF(bien)],
          };
        }
        const r1 = r.ent(26, 40), r2 = r.ent(4, 20), fuera = Math.floor(s / 2) % 2 === 0, d = fuera ? r1 + r2 : r1 - r2;
        return {
          enunciado: `Dos circunferencias son tangentes ${fuera ? 'exteriores' : 'interiores'} y sus centros están a ${d} cm. La ${fuera ? 'primera' : 'grande'} tiene ${r1} cm de radio. ¿Cuánto mide el radio de la otra?`,
          datos: [D_POS, D_POS2],
          pasos: [
            { tipo: 'pide', texto: 'Piden el radio de la segunda circunferencia.' },
            { tipo: 'datos', texto: `d = ${d} cm y r₁ = ${r1} cm; se tocan ${fuera ? 'por fuera' : 'por dentro'}.` },
            { tipo: 'regla', texto: fuera ? 'Tangentes exteriores: d es la suma de los radios.' : 'Tangentes interiores: d es la resta de los radios.', ecuacion: junto(fuera ? 'd = r₁ + r₂' : 'd = r₁ − r₂') },
            { tipo: 'cuentas', texto: 'Se reemplaza y se despeja el radio que falta.', ecuacion: junto([fuera ? `${d} = ${r1} + r₂` : `${d} = ${r1} − r₂`, FL, 'r₂ = ', dF(cm(r2))]) },
            { tipo: 'sentido', texto: `Comprobación: ${r1} ${fuera ? '+' : '−'} ${r2} = ${d}.` },
          ],
          respuesta: ['El radio mide ', dF(cm(r2))],
        };
      },
    },
    ahoraTu: {
      voz: 'Suma y resta los radios antes de mirar d.',
      generar(s) { return conCuatro([casoPosicion, casoTocar, casoRadio, casoTres, casoFaja][s % 5], azar(s + 13), firmasDe(EJ3)); },
    },
  };

  // ======================= Idea 4: ángulo central e inscrito =======================
  // Objeto de la primera pantalla: la pileta redonda de la plaza, con dos faroles A y B en el borde y un fotógrafo P que
  // camina por el borde (geo-objeto, escena «redondo», tipo «pileta»; dibujo de prueba).
  // Cambia: el arco AB entre los faroles y dónde está P. · Permanece: P sobre el borde. · Progresa: el ángulo con que P ve
  // los faroles. · Se reserva: P en el farol A (el semiinscrito, la predicción). · Debe verse: P se mueve y el ángulo no.
  const RP = 3;
  const VPI = { x: [-4, 4], y: [-3.9, 3.7] };
  // La pileta con los faroles A y B (el arco AB abajo, de a grados) y el fotógrafo en P (a fi grados). o: { central:
  //   corte (el ángulo AOB, carmín), textoP, textoArco, persona: false, tangente: corte (la tangente en A y el
  //   semiinscrito, «?» o su valor), textoSemi, sinP: true, alt }
  function figPileta(a, fi, o = {}) {
    const gA = 270 - a / 2, gB = 270 + a / 2;
    const pts = { O: [0, 0], A: gA, B: gB };
    if (!o.sinP) pts.P = fi;
    const segs = [], angs = [], arcos = [{ de: 'A', a: 'B', color: 'o', texto: o.textoArco === undefined ? `${a}°` : o.textoArco || undefined }];
    if (!o.sinP) { segs.push(['P', 'A'], ['P', 'B']); angs.push({ en: 'P', de: 'A', a: 'B', texto: o.textoP, color: o.textoP === '?' || o.persona === false ? undefined : 'h', radio: 22 }); }
    if (o.central !== undefined) { segs.push(['O', 'A', { color: 'i', desde: o.central }], ['O', 'B', { color: 'i', desde: o.central }]); angs.push({ en: 'O', de: 'A', a: 'B', texto: o.textoCentral, color: 'h', radio: 18, desde: o.central }); }
    if (o.tangente !== undefined) {
      const u = [Math.cos((gA - 90) * RAD), Math.sin((gA - 90) * RAD)], A = U.polar([0, 0], RP, gA);
      pts['~t1'] = [A[0] + u[0] * 1.5, A[1] + u[1] * 1.5]; pts['~t2'] = [A[0] - u[0] * 1.5, A[1] - u[1] * 1.5];
      segs.push(['~t1', '~t2', { desde: o.tangente }], ['A', 'B', { desde: o.tangente }]);
      // (El semiinscrito va sin número: su abertura, entre la cuerda y el arco, no deja lugar para un rótulo; lo dicen el
      // texto y la ecuación. colorSemi: carmín cuando ya se sabe.)
      angs.push({ en: 'A', de: '~t2', a: 'B', color: o.colorSemi, radio: 20, desde: o.tangente });
    }
    // La letra de O: arriba, salvo que una cuerda del fotógrafo pase por ahí (P casi enfrente de un farol); entonces, el
    // lado más libre. Se mide en el plano: la letra va a unos 0,55 de O y pide 0,3 de aire a cada trazo.
    const ladoO = (() => {
      const P0 = o.sinP ? null : U.polar([0, 0], RP, fi), A0 = U.polar([0, 0], RP, gA), B0 = U.polar([0, 0], RP, gB);
      const tramos = (P0 ? [[P0, A0], [P0, B0]] : []).concat(o.central !== undefined ? [[[0, 0], A0], [[0, 0], B0]] : []);
      const dist = q => Math.min(9, ...tramos.map(([u, w]) => { const dx = w[0] - u[0], dy = w[1] - u[1], t = Math.max(0, Math.min(1, ((q[0] - u[0]) * dx + (q[1] - u[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(q[0] - u[0] - t * dx, q[1] - u[1] - t * dy); }));
      const aire = g => Math.min(dist(U.polar([0, 0], 0.4, g)), dist(U.polar([0, 0], 0.7, g)));
      if (aire(90) >= 0.35) return 90;
      return [0, 180, 45, 135, 225, 315, 270].filter(g => o.central === undefined || Math.abs(g - 270) > a / 2 + 15).reduce((m, g) => (aire(g) > aire(m) ? g : m), 90);
    })();
    // P a menos de 15° de un farol (la mesa libre): su letra se corre 40° hacia el lado contrario, para no tocar la del
    // farol (auditoría, 19 nov: eran las dos excepciones de letras que se tocaban).
    const ver = { O: { lado: ladoO } }, fijas = ['O'];
    if (!o.sinP) { const dif = g => ((fi - g) % 360 + 540) % 360 - 180, cerca = [gA, gB].map(dif).filter(x => Math.abs(x) < 15)[0];
      if (cerca !== undefined) { ver.P = { lado: fi + (cerca >= 0 ? 40 : -40) }; fijas.push('P'); } }
    return circ({ c: { O: [0, 0], r: RP }, pts, ver, fijas, segs, angs, arcos, vista: o.vista || VPI, alto: 250,
      circs: [{ centro: [0, 0], r: RP, grosor: 'variable' }],
      obj: { tipo: 'pileta', agua: { centro: [0, 0], r: RP * 0.88 }, faroles: ['A', 'B'], persona: o.sinP || o.persona === false ? undefined : 'P' },
      sinEscala: o.sinEscala, alt: o.alt || `La pileta redonda con los faroles A y B en el borde; el arco AB mide ${a}°${o.sinP ? '' : ' y el fotógrafo P los mira desde el borde'}.` });
  }
  // La prueba (Mira): P en el otro extremo del diámetro que pasa por B, el central AOB y el isósceles OAP; después, la
  // tangente en A y el semiinscrito.
  function figPruebaInscrito() {
    const a = 100, gA = 270 - a / 2, gB = 270 + a / 2, gP = gB - 180, A = U.polar([0, 0], RP, gA);
    const u = [Math.cos((gA - 90) * RAD), Math.sin((gA - 90) * RAD)];
    const pts = { O: [0, 0], A: gA, B: gB, P: gP, '~t1': [A[0] + u[0] * 1.5, A[1] + u[1] * 1.5], '~t2': [A[0] - u[0] * 1.5, A[1] - u[1] * 1.5] };
    return circ({ c: { O: [0, 0], r: RP }, pts, ver: { O: { lado: 50 }, '~t1': { desde: 3 }, '~t2': { desde: 3 } }, fijas: ['O'],
      segs: [['O', 'A', { color: 'i' }], ['O', 'B', { color: 'i' }], ['P', 'A', { desde: 1 }], ['P', 'B', { desde: 1 }], ['O', 'P', { color: 'i', desde: 1 }], ['~t1', '~t2', { desde: 3 }], ['A', 'B', { desde: 3 }]],
      angs: [{ en: 'O', de: 'A', a: 'B', texto: '100°', color: 'h', radio: 16 }, { en: 'P', de: 'A', a: 'O', texto: '50°', color: 'h', radio: 26, desde: 2 },
        { en: 'A', de: '~t2', a: 'B', color: 'h', radio: 22, desde: 3 }],
      arcos: [{ de: 'A', a: 'B', color: 'o', texto: '100°' }], vista: VPI, alto: 250, circs: [{ centro: [0, 0], r: RP, grosor: 'variable' }],
      obj: { tipo: 'pileta', agua: { centro: [0, 0], r: RP * 0.88 }, faroles: ['A', 'B'], persona: 'P' },
      alt: 'La pileta: el central AOB y el arco AB miden 100°; P, en el otro extremo del diámetro que pasa por B, ve los faroles con 50°; en A, la tangente y la cuerda AB forman 50°.' });
  }
  // Figura de examen: el inscrito APB y su arco (sin escala si se pide el ángulo): se dibuja con arco dib y se rotula con
  // los textos. o: { textoP, textoArco, central: texto (el ángulo AOB con sus radios), fi }
  function figInscrito(dib, o = {}) {
    return figPileta(dib, o.fi === undefined ? 90 : o.fi, Object.assign({ persona: false, sinEscala: true }, o, { alt: o.alt }));
  }

  const D_CENTRAL = 'Un ángulo central (vértice en el centro) mide lo mismo que el arco que abarca.';
  const D_INSC = 'Un ángulo inscrito (vértice en la circunferencia, lados cuerdas) mide la mitad del arco que abarca.';
  const D_SEMI = 'Un ángulo semiinscrito (entre una tangente y una cuerda) mide la mitad del arco que abarca.';
  const D_VUELTA = 'La circunferencia entera mide 360°; media circunferencia, 180°.';
  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 4): 35°; 140°; 60°; 56°; 90°; 65°; 150°; 34°; 40°; 25°
  // (x = 10); 120° (arco de un inscrito de 60°); 70°; 60° (cuerdas iguales); 60° (transportador); 60° (el hexágono).
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'Desde el borde',
    figura: fig(figInscrito(120, { textoP: '?', textoArco: '70°', alt: 'Una circunferencia con el arco AB de 70° y un punto P en el borde: el ángulo APB lleva signo de pregunta.' })),
    enunciado: `Desde un punto P de la circunferencia se ven los puntos A y B. El arco AB que abarca el ángulo mide 70°. ¿Cuánto mide m∠APB?${NO_ESC}`,
    datos: [D_INSC],
    solucion: [{ texto: 'APB es inscrito: mide la mitad de su arco.', ecuacion: junto(['m∠APB = ', dO('70°'), ' ÷ 2 = ', dF('35°')]) }],
    respuesta: [junto('m∠APB = '), dF('35°')] });
  EJ4.push({ nivel: 1, titulo: 'El arco desde el ángulo',
    enunciado: 'Un ángulo inscrito mide 70°. ¿Cuánto mide el arco que abarca?',
    datos: [D_INSC],
    solucion: [{ texto: 'El inscrito es la mitad de su arco: el arco es el doble.', ecuacion: junto(['arco = 2 · ', dH('70°'), ' = ', dF('140°')]) }],
    respuesta: [dF('140°')] });
  EJ4.push({ nivel: 1, titulo: 'El ángulo en el centro',
    enunciado: 'En una circunferencia de centro O, el arco AB mide 60°. ¿Cuánto mide el ángulo central AOB?',
    datos: [D_CENTRAL],
    solucion: [{ texto: 'El central mide lo mismo que su arco:', ecuacion: junto(['m∠AOB = ', dF('60°')]) }],
    respuesta: [junto('m∠AOB = '), dF('60°')] });
  EJ4.push({ nivel: 1, titulo: 'La tangente y la cuerda',
    enunciado: 'Por el punto A de una circunferencia pasa una tangente. La cuerda AB y la tangente forman un ángulo que abarca un arco de 112°. ¿Cuánto mide ese ángulo?',
    datos: [D_SEMI],
    solucion: [{ texto: 'Es semiinscrito: la mitad de su arco.', ecuacion: junto([dO('112°'), ' ÷ 2 = ', dF('56°')]) }],
    respuesta: [dF('56°')] });
  EJ4.push({ nivel: 1, titulo: 'Sobre un diámetro',
    enunciado: 'AB es un diámetro de una circunferencia y P es otro punto de ella. ¿Cuánto mide m∠APB?',
    datos: [D_INSC, D_VUELTA],
    solucion: [{ texto: 'El diámetro parte la circunferencia en dos: APB abarca media circunferencia.', ecuacion: junto(['m∠APB = 180° ÷ 2 = ', dF('90°')]) }],
    respuesta: [junto('m∠APB = '), dF('90°')] });

  EJ4.push({ nivel: 2, titulo: 'Inscrito y central',
    figura: fig(figInscrito(70, { textoP: '?', textoArco: '', central: 0, textoCentral: '130°', alt: 'Una circunferencia de centro O con el ángulo central AOB de 130° y un punto P en el borde: el ángulo APB lleva signo de pregunta.' })),
    enunciado: `En una circunferencia de centro O, el ángulo central AOB mide 130°. P está en el arco mayor AB, del otro lado de la cuerda AB. ¿Cuánto mide m∠APB?${NO_ESC}`,
    datos: [D_CENTRAL, D_INSC],
    solucion: [{ texto: 'El arco AB mide lo mismo que el central: 130°.' },
      { texto: 'APB es inscrito en ese arco:', ecuacion: junto(['m∠APB = 130° ÷ 2 = ', dF('65°')]) }],
    respuesta: [junto('m∠APB = '), dF('65°')] });
  EJ4.push({ nivel: 2, titulo: 'Desde el arco chico',
    enunciado: 'A y B parten una circunferencia en dos arcos; el menor mide 60°. P está en el arco menor. ¿Cuánto mide m∠APB?',
    datos: [D_INSC, D_VUELTA],
    solucion: [{ texto: 'Desde el arco menor, APB abarca el arco mayor:', ecuacion: junto('360° − 60° = 300°') },
      { texto: 'La mitad:', ecuacion: junto(['300° ÷ 2 = ', dF('150°')]) }],
    respuesta: [junto('m∠APB = '), dF('150°')] });
  EJ4.push({ nivel: 2, titulo: 'El triángulo en el diámetro',
    enunciado: 'El triángulo ABC tiene sus vértices en una circunferencia, y AB es un diámetro. Si m∠CAB = 56°, ¿cuánto mide m∠CBA?',
    datos: [D_INSC, D_TRI, D_VUELTA],
    solucion: [{ texto: 'El ángulo en C abarca media circunferencia, 180°: mide la mitad, 90°.' },
      { texto: 'Lo que falta en el triángulo:', ecuacion: junto(['m∠CBA = 180° − 90° − 56° = ', dF('34°')]) }],
    respuesta: [junto('m∠CBA = '), dF('34°')] });
  EJ4.push({ nivel: 2, titulo: 'Dos inscritos en el mismo arco',
    enunciado: 'P y Q están en el mismo arco de una circunferencia, y los dos miran la cuerda AB. Si m∠APB = 40°, ¿cuánto mide m∠AQB?',
    datos: [D_INSC],
    solucion: [{ texto: 'Los dos abarcan el mismo arco AB, que mide 2 · 40° = 80°.' },
      { texto: 'AQB también mide su mitad:', ecuacion: junto(['m∠AQB = 80° ÷ 2 = ', dF('40°')]) }],
    respuesta: [junto('m∠AQB = '), dF('40°')] });
  EJ4.push({ nivel: 2, titulo: 'Un semiinscrito con x',
    enunciado: 'La tangente en A y la cuerda AB forman un ángulo de 2x + 5°, y el arco que abarca mide 6x − 10°. ¿Cuánto mide el ángulo?',
    datos: [D_SEMI],
    solucion: [{ texto: 'El semiinscrito mide la mitad de su arco:', ecuacion: junto(['2(2x + 5°) = 6x − 10°', FL, 'x = 10']) },
      { texto: 'Se reemplaza x:', ecuacion: junto(['2 · 10° + 5° = ', dF('25°')]) }],
    respuesta: [dF('25°')] });

  // Nivel 3 (examen): la correcta en E, B, D, A y C.
  EJ4.push({ nivel: 3, titulo: 'Dos inscritos y un semiinscrito',
    enunciado: 'Por el punto T de una circunferencia pasa una tangente. Las cuerdas TA y TB parten la media vuelta de un lado de la tangente en tres ángulos iguales. ¿Cuánto mide el arco AB?',
    alternativas: ['60°', '120°', '30°', '180°', '40°'],
    datos: [D_INSC, D_SEMI, 'Media vuelta mide 180°.'],
    fuente: 'Modelo de San Marcos 2019-II (pregunta 34), con otra pregunta.',
    solucion: [{ texto: 'Los tres ángulos en T miden 180° ÷ 3 = 60°: dos semiinscritos y, entre ellos, el inscrito ATB.' },
      { texto: 'El inscrito ATB mide 60°: su arco es el doble.', ecuacion: junto(['arco AB = 2 · 60° = ', dF('120°')]) },
      { texto: '60° es cada ángulo en T; 30° y 40° parten 60° en 2 y 120° en 3; 180° es la media vuelta.' }],
    respuesta: [junto('arco AB = '), dF('120°')] });
  EJ4.push({ nivel: 3, titulo: 'Un triángulo inscrito',
    enunciado: 'El triángulo ABC está inscrito en una circunferencia. Los arcos AB, BC y CA (sin el otro vértice) miden 100°, 120° y 140°. ¿Cuánto mide el mayor ángulo del triángulo?',
    alternativas: ['60°', '70°', '50°', '140°', '120°'],
    datos: [D_INSC],
    solucion: [{ texto: 'Cada ángulo abarca el arco de enfrente: m∠C = 50°, m∠A = 60° y m∠B = 70°.' },
      { texto: ['El mayor es el que abarca el arco de 140°: ', dF('70°'), '.'] },
      { texto: '140° es el arco, no el ángulo; 60° y 50° son los otros dos; 120° es otro arco.' }],
    respuesta: [dF('70°')] });
  EJ4.push({ nivel: 3, titulo: 'Cuerdas iguales',
    enunciado: 'A, B, C y D están en una circunferencia, en ese orden. Las cuerdas AB, BC y CD miden igual, y el arco DA que no las contiene mide 120°. ¿Cuánto mide m∠ACD?',
    alternativas: ['40°', '120°', '80°', '60°', '30°'],
    datos: [D_INSC, D_VUELTA, 'Cuerdas iguales abarcan arcos iguales.'],
    fuente: 'Modelo de San Marcos 2026-II (pregunta 35), con otra pregunta.',
    solucion: [{ texto: 'Los arcos AB, BC y CD son iguales y suman 360° − 120° = 240°: cada uno mide 80°.' },
      { texto: 'ACD abarca el arco DA que no contiene a C, el de 120°:', ecuacion: junto(['m∠ACD = 120° ÷ 2 = ', dF('60°')]) },
      { texto: '40° es la mitad de un arco de 80°; 80°, un arco entero; 120°, el arco DA; 30° divide el arco entre 4.' }],
    respuesta: [junto('m∠ACD = '), dF('60°')] });
  EJ4.push({ nivel: 3, titulo: 'El transportador',
    enunciado: 'En un transportador, el diámetro AB mide 20 cm y C está en la media circunferencia. Si m∠CAB = 2 · m∠CBA, ¿cuánto mide m∠CAB?',
    alternativas: ['60°', '30°', '45°', '90°', '120°'],
    datos: [D_INSC, D_TRI, D_VUELTA],
    fuente: 'Modelo de San Marcos 2019-I (pregunta 46), con otros números.',
    solucion: [{ texto: 'C ve el diámetro AB: abarca media circunferencia, 180°, y m∠ACB = 90°. Los otros dos suman 90°.' },
      { texto: 'Con m∠CBA = x:', ecuacion: junto(['2x + x = 90°', FL, 'x = 30']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['m∠CAB = 2 · 30° = ', dF('60°')]) },
      { texto: '30° es m∠CBA; 45° reparte 90° en dos iguales; 90° es el de C; 120° duplica 60°.' }],
    respuesta: [junto('m∠CAB = '), dF('60°')] });
  EJ4.push({ nivel: 3, titulo: 'La cuerda de un hexágono',
    enunciado: 'Seis puntos parten una circunferencia en seis arcos iguales: A, B, C, D, E y F, en ese orden. ¿Cuánto mide el ángulo inscrito ACE?',
    alternativas: ['30°', '120°', '60°', '90°', '45°'],
    datos: [D_INSC, D_VUELTA],
    solucion: [{ texto: 'Cada arco mide 360° ÷ 6 = 60°. ACE abarca el arco AE que no contiene a C: los arcos EF y FA.', ecuacion: junto('60° + 60° = 120°') },
      { texto: 'La mitad:', ecuacion: junto(['120° ÷ 2 = ', dF('60°')]) },
      { texto: '120° es el arco; 30° es la mitad de un arco; 90° y 45° no salen de ningún arco de 60°.' }],
    respuesta: [dF('60°')] });

  // «Ahora tú» de la idea 4. Tipos: el inscrito desde su arco; el arco o el central desde el inscrito; el semiinscrito;
  // el inscrito desde el arco menor (abarca el mayor); el triángulo sobre un diámetro.
  function casoInscrito(r) {
    const arco = 2 * r.ent(16, 85), x = arco / 2;
    return { pregunta: `Desde un punto P de una circunferencia se ven los puntos A y B. El arco AB que abarca el ángulo APB mide ${arco}°. ¿Cuánto mide m∠APB?`,
      datos: [D_INSC],
      opciones: opciones(x, OPS(r, [
        { id: 'central', valor: arco, error: 'GE15', siFuera: `${arco}° es el arco: así mide el central, con vértice en O. Con vértice en el borde, la mitad.` },
        { id: 'doble', valor: 2 * arco, error: 'GE15', siFuera: 'La relación con el arco está bien; pero el inscrito es la mitad, no el doble.' },
        { id: 'supl', valor: 180 - x, error: 'GE-INS2', siFuera: `La mitad del arco, ${gr(x)}, está bien; no hay que restarla de 180°.` }]), gr),
      solucion: { texto: 'Inscrito: la mitad de su arco.', ecuacion: junto([`m∠APB = ${arco}° ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoCentral(r) {
    const x = r.ent(15, 85), pideArco = r.ent(0, 1) === 1;
    return { pregunta: pideArco ? `Un ángulo inscrito mide ${x}°. ¿Cuánto mide el arco que abarca?` : `En una circunferencia de centro O, el inscrito APB mide ${x}°. ¿Cuánto mide el central AOB, que abarca el mismo arco?`,
      datos: [D_CENTRAL, D_INSC],
      opciones: opciones(2 * x, OPS(r, [
        { id: 'igual', valor: x, error: 'GE15', siFuera: 'Los dos abarcan el mismo arco, es cierto; pero el inscrito mide la mitad del central.' },
        { id: 'mitad', valor: x / 2, error: 'GE15', siFuera: 'La relación con la mitad está bien, pero al revés: el inscrito es la mitad, no el central.' },
        { id: 'supl', valor: 180 - x, error: 'GE-INS2', siFuera: 'El inscrito y el central no se suplementan: el central es el doble.' }]), gr),
      solucion: { texto: 'El arco, y el central, miden el doble del inscrito.', ecuacion: junto([`2 · ${x}° = `, dF(gr(2 * x))]) } };
  }
  function casoSemi(r) {
    const arco = 2 * r.ent(20, 85), x = arco / 2;
    return { pregunta: `Por el punto A de una circunferencia pasa una tangente. La cuerda AB y la tangente forman un ángulo que abarca un arco de ${arco}°. ¿Cuánto mide ese ángulo?`,
      datos: [D_SEMI, D_TAN],
      opciones: opciones(x, OPS(r, [
        { id: 'arco', valor: arco, error: 'GE15', siFuera: `${arco}° es el arco; el semiinscrito, con vértice en el borde, mide la mitad.` },
        { id: 'recto', valor: 90, error: 'GE-INS1', siFuera: 'La tangente forma 90° con el radio, no con la cuerda.' },
        { id: 'resto', valor: 180 - x, error: 'GE-INS3', siFuera: `${gr(180 - x)} es el ángulo del otro lado de la cuerda, con la otra mitad de la tangente.` }]), gr),
      solucion: { texto: 'Semiinscrito: la mitad de su arco.', ecuacion: junto([`${arco}° ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoMenor(r) {
    const menor = 2 * r.ent(15, 80), mayor = 360 - menor, x = mayor / 2;
    return { pregunta: `A y B parten una circunferencia en dos arcos; el menor mide ${menor}°. P está en el arco menor. ¿Cuánto mide m∠APB?`,
      datos: [D_INSC, D_VUELTA],
      opciones: opciones(x, OPS(r, [
        { id: 'menor', valor: menor / 2, error: 'GE-INS4', siFuera: `La mitad está bien; pero desde el arco menor, APB abarca el otro: el de ${mayor}°.` },
        { id: 'mayor', valor: mayor, error: 'GE15', siFuera: `El arco mayor, ${mayor}°, es el que abarca; el inscrito mide su mitad.` },
        { id: 'menorEntero', valor: menor, error: 'GE15', siFuera: 'Ese es el arco menor entero; P abarca el mayor, y mide su mitad.' }]), gr),
      solucion: { texto: `P abarca el arco mayor, 360° − ${menor}° = ${mayor}°:`, ecuacion: junto([`m∠APB = ${mayor}° ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoDiametro(r) {
    const a = r.ent(15, 75);
    return { pregunta: `El triángulo ABC tiene sus vértices en una circunferencia, y AB es un diámetro. Si m∠CAB = ${a}°, ¿cuánto mide m∠CBA?`,
      datos: [D_INSC, D_TRI, D_VUELTA],
      opciones: opciones(90 - a, OPS(r, [
        { id: 'sin90', valor: 180 - a, error: 'GE-INS5', siFuera: 'Restar de 180° está bien; pero en C hay 90°: también se resta.' },
        { id: 'igual', valor: a, error: 'GE-INS6', siFuera: 'Los ángulos de A y B no miden igual: entre los dos suman 90°.' },
        { id: 'enC', valor: 90, error: 'GE-INS7', siFuera: '90° mide el ángulo en C, el que ve el diámetro; se pide el de B.' },
        { id: 'mitad', valor: (180 - a) / 2, error: 'GE-INS8', siFuera: 'Repartir sería si fuera isósceles; aquí C mide 90° y B es lo que falta.' }]), gr),
      solucion: { texto: 'C ve el diámetro: m∠ACB = 90°. Lo que falta para 180°:', ecuacion: junto([`m∠CBA = 180° − 90° − ${a}° = `, dF(gr(90 - a))]) } };
  }

  const inscrito = {
    id: 'inscrito',
    titulo: 'Ángulo central e inscrito',
    pregunta: '¿Con qué ángulo se ven dos faroles desde el borde de una pileta?',
    temas: ['Ángulos central, inscrito, semiinscrito, interior y exterior'],
    pieza: GO,
    aprendizaje: 'El ángulo central mide lo que su arco; el inscrito y el semiinscrito miden la mitad del arco que abarcan.',
    actividad: 'Caminar por el borde de una pileta y mirar dos faroles desde distintos lugares.',
    // Lee: arcos en grados, ángulo central (mide su arco: así se miden los arcos) e inscrito (qué es). No dice cuánto mide
    // el inscrito (lo muestra el juego) ni qué pasa cuando P llega a A (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La pileta y sus faroles', texto: 'En el borde de la pileta redonda de la plaza hay dos faroles, A y B. Entre ellos queda un arco del borde: el arco AB. Un fotógrafo camina por el borde y los mira.',
          pieza: GO, dibujo: fig(figPileta(100, 110, { textoArco: '', alt: 'La pileta redonda vista desde arriba, con los faroles A y B en el borde y el fotógrafo P.' })) },
        { titulo: 'Arcos en grados', texto: 'Un arco se mide en grados, como un ángulo: la vuelta entera es 360°. El ángulo con vértice en el centro O es el ángulo central, y un arco mide lo mismo que su ángulo central.' },
        { titulo: 'Ángulo inscrito', texto: 'Si el vértice está sobre la circunferencia y los lados son dos cuerdas, el ángulo es inscrito. El fotógrafo P ve los faroles con el ángulo inscrito APB, que abarca el arco AB.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia dónde está P y anota el ángulo APB. Después abre los faroles y compara ese ángulo con el arco AB.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'El fotógrafo P camina por el borde de la pileta y mira los dos faroles, A y B.',
      mision: {
        texto: 'Abre los faroles hasta que P los vea con 65°.',
        logrado: v => v.arco === 130,
        bien: 'Con el arco AB de 130°, P ve los faroles con 65°, esté donde esté.',
      },
      voz: 'Mueve a P. ¿Cambia el ángulo?',
      leyenda: [
        { s: dO('arco'), t: 'el arco AB, entre los dos faroles' },
        { s: dH('∠APB'), t: 'el ángulo con que P ve los faroles' },
        { s: 'O', t: 'el centro de la pileta' },
      ],
      controles: [
        { id: 'arco', etiqueta: 'arco AB', min: 40, max: 160, paso: 10, inicio: 80, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'fi', etiqueta: 'dónde está P (grados de vuelta desde la derecha)', min: 30, max: 150, paso: 20, inicio: 90, unidad: '°', decimales: 0 },
      ],
      // (El valor del ángulo lo dice la lectura: en la figura, junto a O, se confundía con el central.)
      dibujo: v => ({ datos: figPileta(v.arco, v.fi), estado: {} }),
      lectura: v => [dO(junto(`arco AB = ${v.arco}°`)), ': ', dH(junto(`∠APB = ${gr(v.arco / 2)}`)), ', esté donde esté P'],
      minimo: 4,
    },
    predice: {
      pregunta: `El fotógrafo llega al farol A: un lado de su vista sigue la tangente y el otro, la cuerda AB. Si el arco AB mide 100°, ¿qué ángulo forman la tangente y la cuerda?${NO_ESC}`,
      datos: ['El arco AB mide 100°.'],
      voz: 'El fotógrafo llegó al farol A. ¿Qué pasa con su ángulo?',
      opciones: [
        { id: 'c', texto: '50°', correcta: true },
        { id: 'central', texto: '100°', error: 'GE15', siFuera: 'Igual al arco mide el central, con vértice en O; este tiene el vértice en el borde.' },
        { id: 'recto', texto: '90°, por ser tangente', error: 'GE-INS1', siFuera: 'La tangente forma 90° con el radio OA, no con la cuerda AB.' },
        { id: 'cero', texto: '0°: el ángulo desaparece', error: 'GE12', siFuera: 'Un lado se fue, es cierto; pero lo reemplaza la tangente, y el ángulo sigue abarcando el arco AB.' },
      ],
      // (Auditoría, 19 nov: a escala, el ángulo entre la tangente y la cuerda medía 50°, la respuesta. Se dibuja con un arco
      // de 140°: el ángulo dibujado mide 70°.)
      dibujo: fig(figPileta(140, 90, { sinP: true, tangente: 0, textoArco: '100°', sinEscala: true, alt: 'La pileta con el arco AB de 100°, la tangente en A y la cuerda AB; se pide el ángulo entre ellas, marcado con un arco. No está a escala.' })),
      revelar: fig(figPileta(100, 90, { sinP: true, tangente: 0, colorSemi: 'h', alt: 'La tangente en A y la cuerda AB forman 50°, la mitad del arco AB.' })),
      coincide: 'Coincide: el semiinscrito también mide la mitad de su arco: 100° ÷ 2 = 50°.',
      noCoincide: 'Revisemos: con P en A, el ángulo queda entre la tangente y la cuerda, y sigue abarcando el arco AB. Mide su mitad: 50°.',
    },
    mira: {
      pieza: GO,
      datos: figPruebaInscrito(),
      voz: 'Paso a paso: el central, el isósceles y la tangente.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El central AOB mide lo mismo que el arco AB.', ecuacion: junto(['m∠AOB = ', dO('arco AB'), ' = 100°']) },
        { estado: { corte: 1 }, texto: 'Con P frente a B, OA = OP: el triángulo OAP es isósceles.', ecuacion: junto('m∠OAP = m∠OPA') },
        { estado: { corte: 2 }, texto: 'El central es exterior de OAP: suma esos dos ángulos iguales.', ecuacion: junto(['100° = 2 · m∠APB', FL, 'm∠APB = 50°']) },
        { estado: { corte: 3 }, texto: 'En A, la tangente es perpendicular a OA; OAB es isósceles.', ecuacion: junto(['m∠OAB = (180° − 100°) ÷ 2 = 40°']) },
        { estado: { corte: 3 }, texto: 'Lo que falta para 90° es el ángulo entre la tangente y la cuerda.', ecuacion: junto(['90° − 40° = 50°']) },
      ],
    },
    regla: {
      texto: 'Un ángulo central mide lo mismo que su arco. Un inscrito, con vértice en la circunferencia, mide la mitad del arco que abarca; un semiinscrito, entre tangente y cuerda, también.',
      ecuacion: junto([dH('m∠APB'), ' = ', dO('arco AB'), ' ÷ 2']),
      condicion: 'el arco que abarca es el que queda entre los lados del ángulo, del otro lado del vértice.',
      voz: 'Ubica el vértice: en el centro, el arco entero; en el borde, la mitad.',
    },
    // Así se resuelve: el inscrito desde el central, o el semiinscrito con x (otros números que «Ahora tú»).
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const c = 2 * r.ent(46, 79), x = c / 2;
          return {
            enunciado: `En una circunferencia de centro O, el ángulo central AOB mide ${c}°. P está en el arco mayor AB, del otro lado de la cuerda AB. ¿Cuánto mide m∠APB?`,
            datos: [D_CENTRAL, D_INSC],
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo inscrito APB, con el vértice en la circunferencia.' },
              { tipo: 'datos', texto: `El central AOB mide ${c}°. P y O miran el mismo arco AB.` },
              { tipo: 'regla', texto: 'El central mide lo mismo que su arco; el inscrito, la mitad del arco que abarca.' },
              { tipo: 'cuentas', texto: 'El arco AB mide lo que el central; el inscrito, su mitad.', ecuacion: junto([`arco AB = ${c}°`, FL, `m∠APB = ${c}° ÷ 2 = `, dF(gr(x))]) },
              { tipo: 'sentido', texto: `Tiene sentido: desde el borde, P está más lejos que O, y ve A y B con un ángulo menor: ${gr(x)} < ${c}°.` },
            ],
            respuesta: [junto('m∠APB = '), dF(gr(x))],
          };
        }
        // El arco se escribe (2k + 2)x − (2x − 2b): con b ≤ 10 < x, el número que se resta es positivo.
        const k = r.ent(2, 4), b = 5 * r.ent(1, 2), x = r.ent(12, 24), arco = 2 * (k * x + b), c2 = 2 * k + 2;
        const ang = k * x + b, arcoTxt = `${c2}x − ${c2 * x - arco}°`;
        return {
          enunciado: `La tangente en A y la cuerda AB forman un ángulo de ${k}x + ${b}°, y el arco que abarca mide ${arcoTxt}. ¿Cuánto mide el ángulo?`,
          datos: [D_SEMI],
          pasos: [
            { tipo: 'pide', texto: 'Piden el ángulo entre la tangente y la cuerda: un semiinscrito.' },
            { tipo: 'datos', texto: `El ángulo mide ${k}x + ${b}° y su arco, ${arcoTxt}.` },
            { tipo: 'regla', texto: 'El semiinscrito mide la mitad de su arco: el arco es el doble del ángulo.' },
            { tipo: 'cuentas', texto: `Se iguala el arco al doble del ángulo, ${junto(`2(${k}x + ${b}°) = ${arcoTxt}`)}, y se despeja x.`, ecuacion: junto([`x = ${x}`, FL, `${k} · ${x}° + ${b}° = `, dF(gr(ang))]) },
            { tipo: 'sentido', texto: `Comprobación: el arco mide ${c2} · ${x}° − ${c2 * x - arco}° = ${arco}°, el doble de ${gr(ang)}.` },
          ],
          respuesta: ['El ángulo mide ', dF(gr(ang))],
        };
      },
    },
    ahoraTu: {
      voz: '¿Dónde está el vértice? Ahí está la cuenta.',
      generar(s) { return conCuatro([casoInscrito, casoCentral, casoSemi, casoMenor, casoDiametro][s % 5], azar(s + 17), firmasDe(EJ4)); },
    },
  };

  // ======================= Idea 5: ángulos interior y exterior =======================
  // Objeto de la primera pantalla: una plaza redonda con dos veredas rectas que la cruzan y se cortan en Q (geo-objeto,
  // escena «redondo», tipo «veredas»; dibujo de prueba).
  // Cambia: los dos arcos, el de arriba (AB) y el de abajo (CD). · Permanece: Q adentro. · Progresa: el ángulo en Q.
  // · Se reserva: Q afuera (la predicción). · Debe verse: el ángulo en Q usa los dos arcos.
  const RV = 3;
  const VVE = { x: [-4, 4], y: [-3.9, 3.9] };
  // Las veredas AC y BD que se cortan en Q, dentro; el arco AB (de a grados, arriba) y el CD (de b, abajo).
  //   o: { textoQ, textos: false (sin los arcos rotulados), alt }
  //   dibA, dibB: los arcos con que se dibuja (sin escala), si no son los de verdad.
  function figVeredas(a, b, o = {}) {
    const da = o.dibA === undefined ? a : o.dibA, db = o.dibB === undefined ? b : o.dibB;
    const gA = 90 + da / 2, gB = 90 - da / 2, gC = 270 + db / 2, gD = 270 - db / 2;
    const A = U.polar([0, 0], RV, gA), B = U.polar([0, 0], RV, gB), C = U.polar([0, 0], RV, gC), D = U.polar([0, 0], RV, gD), Q = U.corte(A, C, B, D);
    const pts = { A: gA, B: gB, C: gC, D: gD, Q };
    // La letra de Q va en el sector más ancho que no lleva el arco del ángulo: abajo (entre QC y QD) o a la izquierda
    // (entre QA y QD); si ese sector es angosto, un poco más lejos, sin tocar ninguna vereda.
    const abajo = (da + db) / 2 > 100, mitad = (abajo ? (da + db) / 2 : 180 - (da + db) / 2) / 2;
    const lejosQ = Math.max(0, Math.round(13 / Math.tan(mitad * Math.PI / 180) - 9));
    return circ({ c: { O: [0, 0], r: RV }, pts, ver: { Q: { lado: abajo ? 270 : 180, lejos: lejosQ }, D: { lado: 220 }, C: { lado: 320 } }, fijas: ['Q', 'C', 'D'], segs: [['A', 'C'], ['B', 'D']],
      angs: [{ en: 'Q', de: 'B', a: 'A', texto: o.textoQ, color: o.textoQ === '?' ? undefined : 'h', radio: 18 }],
      arcos: [{ de: 'B', a: 'A', color: 'o', texto: o.textos === false ? undefined : `${a}°` }, { de: 'D', a: 'C', color: 'i', texto: o.textos === false ? undefined : `${b}°` }],
      circs: [{ centro: [0, 0], r: RV, grosor: 'variable' }], vista: VVE, alto: 250, sinEscala: o.sinEscala,
      obj: { tipo: 'veredas', agua: { centro: [0, 0], r: RV }, veredas: [['A', 'C'], ['B', 'D']] },
      alt: o.alt || `Una plaza redonda con dos veredas, AC y BD, que se cortan en Q; el arco AB mide ${a}° y el arco CD, ${b}°.` });
  }
  // Dos veredas (secantes) que se juntan en Q, afuera: el arco lejano AB (de L grados) y el cercano CD (de c grados), con
  // la figura dibujada con arcos dibL y dibC (sin escala). Las mismas letras que adentro: AB el arco naranja y CD el
  // turquesa (lector en frío, 19 nov: afuera eran AD y BC, y la regla «arco AB + arco CD» quedaba bajo otro dibujo). Las
  // veredas son QDA y QCB. o: { textoQ, prueba: corte (la cuerda AC y sus inscritos), alt }
  function figExterior(L, c, o = {}) {
    const dL = o.dibL === undefined ? L : o.dibL, dc = o.dibC === undefined ? c : o.dibC;
    const gA = 180 - dL / 2, gB = 180 + dL / 2, gD = dc / 2, gC = -dc / 2;
    const A = U.polar([0, 0], RV, gA), B = U.polar([0, 0], RV, gB), C = U.polar([0, 0], RV, gC), D = U.polar([0, 0], RV, gD), Q = U.corte(A, D, B, C);
    const pts = { A: gA, B: gB, C: gC, D: gD, Q };
    // A escala (revelar, Mira y la regla), el arco cercano es chico: C y D van de costado y el rótulo de Q, más afuera.
    const escala = o.dibL === undefined && o.dibC === undefined;
    const segs = [['Q', 'A'], ['Q', 'B']], angs = [{ en: 'Q', de: 'A', a: 'B', texto: o.textoQ, color: o.textoQ === '?' || o.textoQ === undefined ? undefined : 'h', radio: escala && o.textoQ ? 48 : 22 }];
    if (o.prueba !== undefined) {
      segs.push(['A', 'C', { discontinua: true, grosor: 'fino', desde: o.prueba }]);
      angs.push({ en: 'C', de: 'A', a: 'B', color: 'h', radio: 16, desde: o.prueba }, { en: 'A', de: 'C', a: 'D', color: 'h', radio: 30, desde: o.prueba + 1 });
    }
    const xs = [A[0], B[0], Q[0], -RV, RV];
    return circ({ c: { O: [0, 0], r: RV }, pts, ver: Object.assign({ Q: { lado: 0 } }, escala ? { C: { lado: 290 }, D: { lado: 70 } } : {}), fijas: escala ? ['Q', 'C', 'D'] : ['Q'], segs, angs,
      arcos: [{ de: 'A', a: 'B', color: 'o', texto: `${L}°` }, escala ? { de: 'C', a: 'D', color: 'i', texto: `${c}°`, dirTexto: 200, dist: 40 } : { de: 'C', a: 'D', color: 'i', texto: `${c}°`, dentro: o.prueba === undefined, dist: 6 }],
      circs: [{ centro: [0, 0], r: RV, grosor: 'variable' }], vista: { x: [Math.min(...xs) - 1.1, Math.max(...xs) + 0.9], y: [-3.9, 3.9] }, alto: 240,
      sinEscala: o.sinEscala, obj: { tipo: 'veredas', agua: { centro: [0, 0], r: RV }, veredas: [['Q', 'A'], ['Q', 'B']] },
      alt: o.alt || `Dos veredas que se juntan en Q, fuera de la plaza redonda: entre ellas quedan el arco lejano AB, de ${L}°, y el cercano CD, de ${c}°.` });
  }

  const D_INT = 'Ángulo interior (vértice dentro): mide la semisuma de los dos arcos que abarcan él y su opuesto.';
  const D_EXT = 'Ángulo exterior (vértice fuera): mide la semidiferencia de sus dos arcos, el lejano menos el cercano.';
  const D_OPV = 'Dos ángulos opuestos por el vértice miden igual; dos ángulos vecinos en una recta suman 180°.';
  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 5): 70°; 40°; 110°; 55°; 50°; 60° (arco desde el
  // interior); 110° (los vecinos); 130° (dos tangentes); 70° (el arco cercano); 250° (los dos arcos de dos tangentes);
  // 90° (2026-I); 100° (2026-I, el central); 55° (2027-I); 65° (x = 15); 50° (tangente y secante).
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: 'Dos veredas que se cruzan',
    figura: fig(figVeredas(110, 30, { dibA: 80, dibB: 40, sinEscala: true, textoQ: '?', alt: 'Una circunferencia con dos cuerdas que se cruzan en Q: el arco AB mide 110° y el CD, 30°; el ángulo AQB lleva signo de pregunta.' })),
    enunciado: `Dos cuerdas AC y BD se cortan en Q, dentro de la circunferencia. El arco AB mide 110° y el arco CD, 30°. ¿Cuánto mide m∠AQB?${NO_ESC}`,
    datos: [D_INT],
    solucion: [{ texto: 'Q está dentro: el ángulo mide la semisuma de sus dos arcos.', ecuacion: junto(['m∠AQB = (', dO('110°'), ' + ', dI('30°'), ') ÷ 2 = ', dF('70°')]) }],
    respuesta: [junto('m∠AQB = '), dF('70°')] });
  EJ5.push({ nivel: 1, titulo: 'Las secantes de afuera',
    enunciado: 'Desde un punto Q, fuera de una circunferencia, salen dos secantes. Entre ellas quedan un arco lejano de 130° y uno cercano de 50°. ¿Cuánto mide el ángulo en Q?',
    datos: [D_EXT],
    solucion: [{ texto: 'Q está fuera: semidiferencia de los arcos.', ecuacion: junto(['(', dO('130°'), ' − ', dI('50°'), ') ÷ 2 = ', dF('40°')]) }],
    respuesta: [dF('40°')] });
  EJ5.push({ nivel: 1, titulo: 'Un cruce más abierto',
    enunciado: 'Dos cuerdas se cortan dentro de una circunferencia. Un ángulo del cruce abarca un arco de 140°, y su opuesto por el vértice, uno de 80°. ¿Cuánto mide ese ángulo?',
    datos: [D_INT],
    solucion: [{ texto: 'Vértice dentro: semisuma.', ecuacion: junto(['(', dO('140°'), ' + ', dI('80°'), ') ÷ 2 = ', dF('110°')]) }],
    respuesta: [dF('110°')] });
  EJ5.push({ nivel: 1, titulo: 'Una tangente y una secante',
    enunciado: 'Desde un punto Q de afuera salen una tangente y una secante a una circunferencia. Entre ellas quedan un arco lejano de 150° y uno cercano de 40°. ¿Cuánto mide el ángulo en Q?',
    datos: [D_EXT],
    solucion: [{ texto: 'Vértice fuera, también con una tangente: semidiferencia.', ecuacion: junto(['(', dO('150°'), ' − ', dI('40°'), ') ÷ 2 = ', dF('55°')]) }],
    respuesta: [dF('55°')] });
  EJ5.push({ nivel: 1, titulo: 'Dos tangentes',
    enunciado: 'Desde Q se trazan dos tangentes a una circunferencia. Los dos arcos entre los puntos de contacto miden 230° y 130°. ¿Cuánto mide el ángulo entre las tangentes?',
    datos: [D_EXT],
    solucion: [{ texto: 'Vértice fuera: semidiferencia del arco lejano y el cercano.', ecuacion: junto(['(', dO('230°'), ' − ', dI('130°'), ') ÷ 2 = ', dF('50°')]) }],
    respuesta: [dF('50°')] });

  EJ5.push({ nivel: 2, titulo: 'El arco que falta',
    enunciado: 'Dos cuerdas se cortan en Q, dentro de una circunferencia, y forman un ángulo de 85°. Ese ángulo abarca un arco de 110°. ¿Cuánto mide el arco que abarca su opuesto por el vértice?',
    datos: [D_INT],
    solucion: [{ texto: 'La semisuma de los dos arcos es 85°: los dos suman el doble.', ecuacion: junto(['arco + 110° = 2 · 85° = 170°']) },
      { texto: 'El que falta:', ecuacion: junto(['170° − 110° = ', dF('60°')]) }],
    respuesta: [dF('60°')] });
  EJ5.push({ nivel: 2, titulo: 'El vecino del cruce',
    enunciado: 'Dos cuerdas se cortan dentro de una circunferencia. Uno de los ángulos abarca un arco de 50° y su opuesto, otro de 90°. ¿Cuánto mide el ángulo vecino, el de al lado?',
    datos: [D_INT, D_OPV],
    solucion: [{ texto: 'El ángulo de los arcos dados mide (50° + 90°) ÷ 2 = 70°.' },
      { texto: 'Su vecino, en la misma recta, completa 180°:', ecuacion: junto(['180° − 70° = ', dF('110°')]) }],
    respuesta: [dF('110°')] });
  EJ5.push({ nivel: 2, titulo: 'Dos tangentes y un arco',
    enunciado: 'Desde Q se trazan dos tangentes a una circunferencia, y el arco cercano entre los puntos de contacto mide 50°. ¿Cuánto mide el ángulo en Q?',
    datos: [D_EXT, 'La circunferencia entera mide 360°.'],
    solucion: [{ texto: ['El arco lejano es el resto de la vuelta: ', junto('360° − 50° = '), dO('310°'), '.'] },
      { texto: 'Semidiferencia:', ecuacion: junto(['(', dO('310°'), ' − ', dI('50°'), ') ÷ 2 = ', dF('130°')]) }],
    respuesta: [dF('130°')] });
  EJ5.push({ nivel: 2, titulo: 'El arco cercano',
    enunciado: 'Desde Q, fuera de una circunferencia, salen dos secantes que forman un ángulo de 35°. El arco lejano mide 140°. ¿Cuánto mide el arco cercano?',
    datos: [D_EXT],
    solucion: [{ texto: 'La resta de los arcos es el doble del ángulo:', ecuacion: junto('140° − arco = 2 · 35° = 70°') },
      { texto: 'Se despeja:', ecuacion: junto(['arco = 140° − 70° = ', dF('70°')]) }],
    respuesta: [dF('70°')] });
  EJ5.push({ nivel: 2, titulo: 'Los dos arcos de las tangentes',
    enunciado: 'Desde Q se trazan dos tangentes a una circunferencia, y forman un ángulo de 70°. ¿Cuánto mide el arco lejano, entre los puntos de contacto?',
    datos: [D_EXT, 'La circunferencia entera mide 360°.'],
    solucion: [{ texto: 'Con el lejano L y el cercano 360° − L, la resta es el doble del ángulo:', ecuacion: junto('L − (360° − L) = 140°') },
      { texto: 'Se despeja:', ecuacion: junto(['2L = 500°', FL, 'L = ', dF('250°')]) }],
    respuesta: [dF('250°')] });

  // Nivel 3 (examen): la correcta en B, E, D, C y A.
  EJ5.push({ nivel: 3, titulo: 'El arco múltiplo del ángulo',
    enunciado: 'Desde Q se trazan dos tangentes a una circunferencia. El arco lejano entre los puntos de contacto mide 3 veces el ángulo en Q. ¿Cuánto mide el ángulo en Q?',
    alternativas: ['60°', '90°', '72°', '120°', '45°'],
    datos: [D_EXT, 'La circunferencia entera mide 360°.'],
    fuente: 'Modelo de San Marcos 2026-I (pregunta 36), con otros números.',
    solucion: [{ texto: 'Con el ángulo x: el lejano mide 3x y el cercano, 360° − 3x.' },
      { texto: 'Semidiferencia:', ecuacion: junto(['x = (3x − (360° − 3x)) ÷ 2 = 3x − 180°', FL, 'x = ', dF('90°')]) },
      { texto: '120° reparte la vuelta entre 3; 60° y 45° reparten 180° entre 3 y entre 4; 72° reparte la vuelta entre 5.' }],
    respuesta: [dF('90°')] });
  EJ5.push({ nivel: 3, titulo: 'El central desde el cruce',
    enunciado: 'Dos cuerdas AC y BD se cortan en Q, dentro de una circunferencia de centro O, y m∠AQB = 75°. El arco CD mide 50°. ¿Cuánto mide el ángulo central AOB?',
    alternativas: ['50°', '75°', '150°', '125°', '100°'],
    datos: [D_INT, D_CENTRAL],
    fuente: 'Modelo de San Marcos 2026-I (pregunta 35), con otros números.',
    solucion: [{ texto: 'Semisuma: los dos arcos suman 2 · 75° = 150°.', ecuacion: junto(['arco AB = 150° − 50° = 100°']) },
      { texto: ['El central mide lo mismo que su arco: ', dF('100°'), '.'] },
      { texto: '75° es el ángulo en Q; 150°, la suma de los arcos; 125° suma 75° y 50°; 50° es el arco CD.' }],
    respuesta: [junto('m∠AOB = '), dF('100°')] });
  EJ5.push({ nivel: 3, titulo: 'Tangentes y semiinscrito',
    enunciado: 'Desde Q se trazan las tangentes QA y QB, que forman un ángulo de 70°. ¿Cuánto mide el ángulo entre la tangente QA y la cuerda AB, del lado del arco cercano?',
    alternativas: ['35°', '70°', '110°', '55°', '125°'],
    datos: [D_EXT, D_SEMI, 'La circunferencia entera mide 360°.'],
    fuente: 'Modelo de San Marcos 2027-I (pregunta 33), con otros números.',
    solucion: [{ texto: 'Con el cercano c y el lejano 360° − c:', ecuacion: junto(['(360° − 2c) ÷ 2 = 70°', FL, 'c = 110°']) },
      { texto: 'El semiinscrito abarca el arco cercano: su mitad.', ecuacion: junto(['110° ÷ 2 = ', dF('55°')]) },
      { texto: '35° es la mitad de 70°; 110°, el arco; 125°, la mitad del lejano; 70°, el ángulo en Q.' }],
    respuesta: [dF('55°')] });
  EJ5.push({ nivel: 3, titulo: 'Los arcos con x',
    enunciado: 'Dos cuerdas se cortan dentro de una circunferencia. Un ángulo del cruce mide 3x + 20°, y abarca, con su opuesto, arcos de 5x y 3x + 10°. ¿Cuánto mide el ángulo?',
    alternativas: ['15°', '130°', '65°', '75°', '55°'],
    datos: [D_INT],
    solucion: [{ texto: 'El doble del ángulo es la suma de los arcos:', ecuacion: junto(['2(3x + 20°) = 5x + 3x + 10°']) },
      { texto: 'Se ordena y se despeja x:', ecuacion: junto(['6x + 40° = 8x + 10°', FL, 'x = 15']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['3 · 15° + 20° = ', dF('65°')]) },
      { texto: '15° es x; 130°, la suma de los arcos; 75° y 55° son los arcos.' }],
    respuesta: [dF('65°')] });
  EJ5.push({ nivel: 3, titulo: 'La secante por el centro',
    enunciado: 'Desde Q salen una tangente QT y una secante que pasa por el centro y corta la circunferencia en A (cerca) y B (lejos). El arco AT que abarcan mide 40°. ¿Cuánto mide el ángulo en Q?',
    alternativas: ['50°', '70°', '20°', '90°', '40°'],
    datos: [D_EXT, 'La secante por el centro parte la circunferencia en dos arcos de 180°.'],
    solucion: [{ texto: 'El arco lejano, de B a T, es 180° − 40° = 140°.' },
      { texto: 'Semidiferencia:', ecuacion: junto(['(140° − 40°) ÷ 2 = ', dF('50°')]) },
      { texto: '70° es la mitad del lejano; 20°, la mitad del cercano; 90°, la semisuma; 40°, el arco cercano.' }],
    respuesta: [dF('50°')] });

  // «Ahora tú» de la idea 5. Tipos: el interior; el exterior de dos secantes; el exterior de dos tangentes (con un
  // solo arco); el arco que falta desde el interior; el arco cercano desde el exterior.
  function casoInterior(r) {
    const a = 2 * r.ent(30, 75), b = 2 * r.ent(10, 40), x = (a + b) / 2;
    return { pregunta: `Dos cuerdas AC y BD se cortan en Q, dentro de una circunferencia. El arco AB mide ${a}° y el arco CD, ${b}°. ¿Cuánto mide m∠AQB?`,
      datos: [D_INT, D_EXT],
      opciones: opciones(x, OPS(r, [
        { id: 'resta', valor: (a - b) / 2, error: 'GE16', siFuera: 'Usar los dos arcos y la mitad está bien; con el vértice dentro, se suman.' },
        { id: 'sin2', valor: a + b, error: 'GE16', siFuera: 'Sumar los arcos está bien; falta dividir entre 2.' },
        { id: 'uno', valor: a / 2, error: 'GE15', siFuera: 'La mitad de un solo arco sería un inscrito; Q está dentro y usa los dos.' },
        { id: 'vecino', valor: 180 - x, error: 'GE-ANG1', siFuera: `La semisuma está bien: da ${gr(x)}. ${gr(180 - x)} es su vecino, que abarca los otros arcos.` }]), gr),
      solucion: { texto: 'Vértice dentro: semisuma de los dos arcos.', ecuacion: junto([`(${a}° + ${b}°) ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoExterior(r) {
    const L = 2 * r.ent(50, 85), c = 2 * r.ent(8, 35), x = (L - c) / 2;
    return { pregunta: `Desde un punto Q, fuera de una circunferencia, salen dos secantes. Entre ellas quedan un arco lejano de ${L}° y uno cercano de ${c}°. ¿Cuánto mide el ángulo en Q?`,
      datos: [D_INT, D_EXT],
      opciones: opciones(x, OPS(r, [
        { id: 'suma', valor: (L + c) / 2, error: 'GE16', siFuera: 'Usar los dos arcos y la mitad está bien; con el vértice fuera, se restan.' },
        { id: 'sin2', valor: L - c, error: 'GE16', siFuera: 'Restar los arcos está bien; falta dividir entre 2.' },
        { id: 'inscrito', valor: L / 2, error: 'GE15', siFuera: 'La mitad del lejano sería un inscrito; Q está fuera.' }]), gr),
      solucion: { texto: 'Vértice fuera: semidiferencia, el lejano menos el cercano.', ecuacion: junto([`(${L}° − ${c}°) ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoTangentes(r) {
    const c = 2 * r.ent(20, 80), L = 360 - c, x = (L - c) / 2;
    return { pregunta: `Desde Q se trazan dos tangentes a una circunferencia. El arco cercano entre los puntos de contacto mide ${c}°. ¿Cuánto mide el ángulo en Q?`,
      datos: [D_EXT, D_VUELTA],
      opciones: opciones(x, OPS(r, [
        { id: 'mitad', valor: c / 2, error: 'GE15', siFuera: 'La mitad del arco sería un inscrito; Q está fuera y usa los dos arcos.' },
        { id: 'sin2', valor: L - c, error: 'GE16', siFuera: 'Restar los arcos está bien; falta dividir entre 2.' },
        { id: 'supl', valor: c, error: 'GE-ANG2', siFuera: `El ángulo y el arco cercano suman 180°: ${gr(180 - c)} y no ${gr(c)}.` },
        { id: 'lejano', valor: L / 2, error: 'GE15', siFuera: 'La mitad del lejano sería un inscrito; a ese número le falta restar la del cercano.' }]), gr),
      solucion: { texto: `El lejano es 360° − ${c}° = ${L}°; semidiferencia:`, ecuacion: junto([`(${L}° − ${c}°) ÷ 2 = `, dF(gr(x))]) } };
  }
  function casoArcoInt(r) {
    for (;;) {
      const a = 2 * r.ent(30, 70), b = 2 * r.ent(10, 40), x = (a + b) / 2;
      if (a === b) continue;
      return { pregunta: `Dos cuerdas se cortan dentro de una circunferencia y forman un ángulo de ${x}°. Ese ángulo abarca un arco de ${a}°. ¿Cuánto mide el arco que abarca su opuesto por el vértice?`,
        datos: [D_INT],
        opciones: opciones(b, OPS(r, [
          { id: 'resta', valor: a - x, error: 'GE-ANG3', siFuera: `Restar está bien; pero del doble del ángulo, ${2 * x}°, no de ${x}°.` },
          { id: 'doble', valor: 2 * x, error: 'GE-ANG4', siFuera: `El doble del ángulo, ${2 * x}°, es la suma de los dos arcos; falta restar ${a}°.` },
          { id: 'igual', valor: a, error: 'GE-ANG5', siFuera: 'Los ángulos opuestos miden igual; sus arcos, no.' }]), gr),
        solucion: { texto: 'Los dos arcos suman el doble del ángulo:', ecuacion: junto([`2 · ${x}° − ${a}° = `, dF(gr(b))]) } };
    }
  }
  function casoCercano(r) {
    const L = 2 * r.ent(60, 85), x = r.ent(20, 50), c = L - 2 * x;
    return { pregunta: `Desde Q, fuera de una circunferencia, salen dos secantes que forman un ángulo de ${x}°. El arco lejano mide ${L}°. ¿Cuánto mide el arco cercano?`,
      datos: [D_EXT],
      opciones: opciones(c, OPS(r, [
        { id: 'sin2', valor: L - x, error: 'GE-ANG3', siFuera: `Restar del lejano está bien; pero el doble del ángulo, ${2 * x}°, no ${x}°.` },
        { id: 'suma', valor: 2 * x - L > 0 ? 2 * x - L : L + 2 * x, error: 'GE-ANG6', siFuera: 'Con el vértice fuera, el cercano es el lejano menos el doble del ángulo.' },
        { id: 'mitad', valor: (L - x) / 2, error: 'GE16', siFuera: 'Despejar está bien; pero el ángulo ya es la mitad: se multiplica por 2.' }]), gr),
      solucion: { texto: 'La resta de los arcos es el doble del ángulo:', ecuacion: junto([`${L}° − 2 · ${x}° = `, dF(gr(c))]) } };
  }

  const intExt = {
    id: 'interior-exterior',
    titulo: 'Ángulos interior y exterior',
    pregunta: '¿Qué ángulo forman dos veredas que cruzan una plaza redonda?',
    temas: ['Ángulos central, inscrito, semiinscrito, interior y exterior'],
    pieza: GO,
    aprendizaje: 'Con el vértice dentro, el ángulo mide la semisuma de sus dos arcos; con el vértice fuera, la semidiferencia.',
    actividad: 'Mover dos veredas que se cruzan en una plaza redonda y mirar el ángulo del cruce.',
    // Lee: ángulo interior y exterior (dónde está el vértice) y sus dos arcos. No dice cómo se calculan (el juego muestra el
    // de adentro; la predicción es el de afuera).
    lee: {
      tarjetas: [
        { titulo: 'Dos veredas', texto: 'Dos veredas rectas cruzan una plaza redonda de borde a borde y se cortan en Q. Cada vereda es una cuerda, y el ángulo en Q es un ángulo interior: su vértice queda dentro del círculo.',
          pieza: GO, dibujo: fig(figVeredas(110, 30, { textos: false, alt: 'Una plaza redonda con dos veredas rectas que se cruzan en Q.' })) },
        { titulo: 'Dos arcos', texto: 'El ángulo AQB abarca el arco AB. Su opuesto por el vértice, CQD, abarca el arco CD. Un ángulo interior trabaja con los dos.' },
        { titulo: 'Afuera', texto: 'Si las dos rectas se juntan fuera del círculo, el ángulo es exterior: entre sus lados quedan un arco lejano y uno cercano. Las rectas pueden ser secantes o tangentes.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia un solo arco cada vez, de 10° en 10°, y anota cuánto cambia el ángulo en Q.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'Dos veredas rectas cruzan la plaza redonda y se cortan en Q. Puedes mover sus puntas por el borde.',
      mision: {
        texto: 'Mueve las veredas hasta que el ángulo en Q mida 75°.',
        logrado: v => v.a + v.b === 150,
        bien: 'Los dos arcos suman 150°, y el ángulo en Q mide la mitad: 75°.',
      },
      voz: 'Cambia un arco. ¿Cuánto cambia el ángulo?',
      leyenda: [
        { s: dO('arco AB'), t: 'el arco que abarca el ángulo AQB' },
        { s: dI('arco CD'), t: 'el que abarca su opuesto, CQD' },
        { s: dH('∠AQB'), t: 'el ángulo del cruce' },
      ],
      controles: [
        { id: 'a', etiqueta: 'arco AB', min: 60, max: 160, paso: 10, inicio: 110, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'arco CD', min: 30, max: 100, paso: 10, inicio: 30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: figVeredas(v.a, v.b), estado: {} }),
      lectura: v => [dO(junto(`${v.a}°`)), ' y ', dI(junto(`${v.b}°`)), ': ', dH(junto(`∠AQB = ${gr((v.a + v.b) / 2)}`))],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora las dos veredas se juntan en Q, fuera de la plaza. Entre ellas quedan un arco lejano de 110° y uno cercano de 30°. ¿Cuánto mide el ángulo en Q? El dibujo no está a escala.',
      datos: ['El arco lejano mide 110° y el cercano, 30°.'],
      voz: 'Q salió del círculo. ¿El arco cercano suma o resta?',
      opciones: [
        { id: 'c', texto: '40°', correcta: true },
        { id: 'suma', texto: '70°', error: 'GE16', siFuera: 'La semisuma vale con el vértice dentro; afuera, el arco cercano achica el ángulo.' },
        { id: 'sin2', texto: '80°', error: 'GE16', siFuera: 'Restar los arcos está bien; falta dividir entre 2.' },
        { id: 'grande', texto: '55°', error: 'GE15', siFuera: '55° es la mitad del arco lejano: sería un inscrito. Q está fuera.' },
      ],
      dibujo: fig(figExterior(110, 30, { dibL: 130, dibC: 70, textoQ: '?', sinEscala: true, alt: 'Dos veredas que se juntan en Q, fuera de la plaza: el arco lejano mide 110° y el cercano, 30°; el ángulo en Q lleva signo de pregunta. No está a escala.' })),
      revelar: fig(figExterior(110, 30, { textoQ: '40°', alt: 'El ángulo en Q mide 40°, la semidiferencia de 110° y 30°.' })),
      coincide: 'Coincide: afuera, el cercano resta: (110° − 30°) ÷ 2 = 40°.',
      noCoincide: 'Revisemos: con Q fuera, el arco cercano resta: (110° − 30°) ÷ 2 = 40°.',
    },
    mira: {
      pieza: GO,
      datos: figExterior(110, 30, { prueba: 1, alt: 'La cuerda AC arma el triángulo QAC: el inscrito ACB mide 55°, el CAD mide 15° y el ángulo en Q, 40°.' }),
      voz: 'Una cuerda más arma un triángulo con Q.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Q está fuera: entre las veredas quedan dos arcos.', ecuacion: junto([dO('110°'), Y, dI('30°')]) },
        { estado: { corte: 1 }, texto: 'Con la cuerda AC, el inscrito ACB abarca el arco lejano AB.', ecuacion: junto('m∠ACB = 110° ÷ 2 = 55°') },
        { estado: { corte: 2 }, texto: 'El inscrito CAD abarca el arco cercano CD.', ecuacion: junto('m∠CAD = 30° ÷ 2 = 15°') },
        { estado: { corte: 2 }, texto: 'ACB es exterior del triángulo QAC: suma Q y CAD.', ecuacion: junto(['m∠Q = 55° − 15° = 40°']) },
      ],
    },
    regla: {
      texto: 'Con el vértice dentro, el ángulo mide la semisuma de sus dos arcos. Con el vértice fuera, entre secantes o tangentes, mide la semidiferencia: lejano menos cercano, sobre 2.',
      ecuacion: junto(['dentro: (', dO('arco AB'), ' + ', dI('arco CD'), ') ÷ 2', Y, 'fuera: (', dO('arco AB'), ' − ', dI('arco CD'), ') ÷ 2']),
      condicion: 'adentro, AB es el arco del ángulo y CD el de su opuesto; afuera, AB es el lejano y CD el cercano.',
      dibujo: fig(figExterior(110, 30, { textoQ: '40°', alt: 'Afuera: las veredas se juntan en Q; el arco lejano AB mide 110°, el cercano CD 30° y el ángulo en Q, 40°.' })),
      voz: 'Adentro se suman; afuera, se restan. Siempre la mitad.',
    },
    // Así se resuelve: el exterior de dos tangentes con su arco lejano, o el interior con sus arcos (otros números).
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const L = 2 * r.ent(95, 140), c = 360 - L, x = (L - c) / 2;
          return {
            enunciado: `Desde Q se trazan dos tangentes a una circunferencia. El arco lejano entre los puntos de contacto mide ${L}°. ¿Cuánto mide el ángulo en Q?`,
            datos: [D_EXT, D_VUELTA],
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo entre las dos tangentes, con el vértice Q fuera.' },
              { tipo: 'datos', texto: `El arco lejano mide ${L}°; el cercano es el resto de la vuelta: 360° − ${L}° = ${c}°.` },
              { tipo: 'regla', texto: 'Vértice fuera: el ángulo mide la semidiferencia, el lejano menos el cercano, sobre 2.' },
              { tipo: 'cuentas', texto: 'Se restan los arcos y se saca la mitad.', ecuacion: junto([`(${L}° − ${c}°) ÷ 2 = `, dF(gr(x))]) },
              { tipo: 'sentido', texto: `Comprobación: ${gr(x)} + ${c}° = 180°: con dos tangentes, el ángulo y el arco cercano siempre suman 180°.` },
            ],
            respuesta: ['El ángulo mide ', dF(gr(x))],
          };
        }
        const a = 2 * r.ent(76, 90), b = 2 * r.ent(41, 49), x = (a + b) / 2;
        return {
          enunciado: `Dos cuerdas AC y BD se cortan en Q, dentro de una circunferencia. El arco AB mide ${a}° y el arco CD, ${b}°. ¿Cuánto mide m∠AQB?`,
          datos: [D_INT],
          dibujo: fig(figVeredas(a, b, { dibA: a - 50, dibB: b - 30, textoQ: '?', sinEscala: true, alt: `Una circunferencia con las cuerdas AC y BD que se cortan en Q: el arco AB mide ${a}° y el CD, ${b}°.` })),
          pasos: [
            { tipo: 'pide', texto: 'Piden el ángulo AQB, con el vértice Q dentro.' },
            { tipo: 'datos', texto: `AQB abarca el arco AB, de ${a}°, y su opuesto CQD, el arco CD, de ${b}°.` },
            { tipo: 'regla', texto: 'Vértice dentro: el ángulo mide la semisuma de los dos arcos.' },
            { tipo: 'cuentas', texto: 'Se suman los arcos y se saca la mitad.', ecuacion: junto([`(${a}° + ${b}°) ÷ 2 = `, dF(gr(x))]) },
            { tipo: 'sentido', texto: `Tiene sentido: la semisuma es el promedio de los dos arcos, y ${gr(x)} queda entre ${b}° y ${a}°.` },
          ],
          respuesta: [junto('m∠AQB = '), dF(gr(x))],
        };
      },
    },
    ahoraTu: {
      voz: '¿Q está dentro o fuera? Eso decide si sumas o restas.',
      generar(s) { return conCuatro([casoInterior, casoExterior, casoTangentes, casoArcoInt, casoCercano][s % 5], azar(s + 19), firmasDe(EJ5)); },
    },
  };

  // ======================= Idea 6: cuadrilátero inscrito =======================
  // Objeto de la primera pantalla: la pileta con cuatro faroles A, B, C y D en el borde, unidos por un cordel (geo-objeto,
  // escena «redondo», tipo «pileta»; dibujo de prueba).
  // Cambia: dónde está el farol A. · Permanece: B, C y D. · Progresa: los ángulos en B y en D. · Se reserva: D fuera del
  // borde (la predicción). · Debe verse: lo que crece uno, lo pierde el otro.
  const GB6 = 110, GC6 = 340, GD6 = 270;
  // El cuadrilátero ABCD con A a fi grados. o: { textos: { B, D } (los rótulos de sus ángulos), D: [x, y] (D fuera del
  //   borde), arcos: corte (los arcos que abarcan B y D), sinEscala, alt }
  function figCordel(fi, o = {}) {
    const pts = { A: fi, B: GB6, C: GC6, D: o.D || GD6, O: [0, 0] };
    const t = o.textos || {};
    const angs = [{ en: 'B', de: 'C', a: 'A', texto: t.B, color: t.B === '?' ? undefined : 'h', radio: 20, marcas: 1 }, { en: 'D', de: 'A', a: 'C', texto: t.D, color: t.D === '?' ? undefined : 'h', radio: 20, marcas: 2 }];
    if (t.A !== undefined) angs.push({ en: 'A', de: 'B', a: 'D', texto: t.A, color: t.A === '?' ? undefined : 'h', radio: 20, marcas: 3 });
    // (El rótulo de cada arco, corrido de su punto medio: ahí están los faroles D y B.)
    const ta = o.textosArcos || [], arcos = o.arcos === undefined ? [] : [{ de: 'A', a: 'C', color: 'o', desde: o.arcos, texto: ta[0], en: 0.75 }, { de: 'C', a: 'A', color: 'i', desde: o.arcos + 1, texto: ta[1], en: 0.75 }];
    return circ({ c: { O: [0, 0], r: RP }, pts, letra: { O: null }, ver: { O: { sinPunto: true } }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], angs, arcos,
      circs: [{ centro: [0, 0], r: RP, grosor: 'variable' }], vista: VPI, alto: 250, sinEscala: o.sinEscala,
      obj: { tipo: 'pileta', agua: { centro: [0, 0], r: RP * 0.88 }, faroles: o.D ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'] },
      alt: o.alt || 'La pileta con cuatro faroles A, B, C y D en el borde, unidos por un cordel: el cuadrilátero ABCD.' });
  }
  const angB6 = fi => (GC6 + 360 - fi) % 360 / 2;   // B abarca el arco de A a C que pasa por D

  const D_CIC = 'En un cuadrilátero inscrito, los ángulos opuestos suman 180°.';
  // (Lector en frío, 19 nov: para decir «no cabe» hace falta la otra mitad, que la regla sí dice: «al revés».)
  const D_INSCR = 'Inscriptible: si dos ángulos opuestos de un cuadrilátero suman 180°, sus vértices caben en una circunferencia; si no, no caben.';
  const D_CUAD = 'Los ángulos interiores de un cuadrilátero convexo suman 360°.';
  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 6): 110°; 95°; sí (100° + 80°); 85°; 70°; 120° (x = 30);
  // 105° (x = 35); no (95° + 80°); 70° (el exterior en C); 60° (2026-II); 75°; P y C suman 180°; 70° (x = 30); 105° (arcos
  // 2 : 3 : 4 : 3); 135° (trapecio con m∠B = 3 · m∠A).
  const EJ6 = [];
  EJ6.push({ nivel: 1, titulo: 'El ángulo de enfrente',
    figura: fig(figCordel(160, { textos: { B: '70°', D: '?' }, sinEscala: true, alt: 'Un cuadrilátero ABCD inscrito en una circunferencia: el ángulo en B mide 70° y el de D lleva signo de pregunta.' })),
    enunciado: `El cuadrilátero ABCD está inscrito en una circunferencia y m∠B = 70°. ¿Cuánto mide m∠D?${NO_ESC}`,
    datos: [D_CIC],
    solucion: [{ texto: 'B y D son opuestos: suman 180°.', ecuacion: junto(['m∠D = 180° − ', dH('70°'), ' = ', dF('110°')]) }],
    respuesta: [junto('m∠D = '), dF('110°')] });
  EJ6.push({ nivel: 1, titulo: 'El opuesto de A',
    enunciado: 'El cuadrilátero ABCD está inscrito en una circunferencia y m∠A = 85°. ¿Cuánto mide m∠C?',
    datos: [D_CIC],
    solucion: [{ texto: 'A y C son opuestos:', ecuacion: junto(['m∠C = 180° − ', dH('85°'), ' = ', dF('95°')]) }],
    respuesta: [junto('m∠C = '), dF('95°')] });
  EJ6.push({ nivel: 1, titulo: '¿Cabe en una circunferencia?',
    enunciado: 'En el cuadrilátero convexo ABCD, m∠A = 100° y m∠C = 80°. ¿Se puede inscribir en una circunferencia?',
    datos: [D_INSCR],
    solucion: [{ texto: 'A y C son opuestos. Se suman:', ecuacion: junto('100° + 80° = 180°') },
      { texto: ['Suman 180°: ', dF('sí se puede'), '.'] }],
    respuesta: [dF('Sí'), ': A y C suman 180°'] });
  EJ6.push({ nivel: 1, titulo: 'Desde el arco',
    enunciado: 'En el cuadrilátero inscrito ABCD, el ángulo B abarca un arco de 170°. ¿Cuánto mide m∠B?',
    datos: [D_INSC],
    solucion: [{ texto: 'B es un ángulo inscrito: la mitad de su arco.', ecuacion: junto(['m∠B = ', dO('170°'), ' ÷ 2 = ', dF('85°')]) }],
    respuesta: [junto('m∠B = '), dF('85°')] });
  EJ6.push({ nivel: 1, titulo: 'Un trapecio en la circunferencia',
    enunciado: 'Un trapecio isósceles ABCD está inscrito en una circunferencia, con m∠A = 110°. ¿Cuánto mide m∠C?',
    datos: [D_CIC],
    solucion: [{ texto: 'A y C son opuestos:', ecuacion: junto(['m∠C = 180° − ', dH('110°'), ' = ', dF('70°')]) }],
    respuesta: [junto('m∠C = '), dF('70°')] });

  EJ6.push({ nivel: 2, titulo: 'Dos opuestos con x',
    enunciado: 'El cuadrilátero ABCD está inscrito en una circunferencia. m∠A = 3x + 30° y m∠C = 2x, con x en grados. ¿Cuánto mide m∠A?',
    datos: [D_CIC],
    solucion: [{ texto: 'Los opuestos suman 180°:', ecuacion: junto(['3x + 30° + 2x = 180°', FL, '5x = 150°', FL, 'x = 30']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['m∠A = 3 · 30° + 30° = ', dF('120°')]) }],
    respuesta: [junto('m∠A = '), dF('120°')] });
  EJ6.push({ nivel: 2, titulo: 'Los cuatro ángulos',
    enunciado: 'En el cuadrilátero inscrito ABCD, m∠A = 2x + 15°, m∠B = 3x y m∠D = x + 40°, con x en grados. ¿Cuánto mide m∠B?',
    datos: [D_CIC],
    solucion: [{ texto: 'B y D son opuestos:', ecuacion: junto(['3x + x + 40° = 180°']) },
      { texto: 'Se despeja x:', ecuacion: junto(['4x = 140°', FL, 'x = 35']) },
      { texto: 'Se reemplaza en B:', ecuacion: junto(['m∠B = 3 · 35° = ', dF('105°')]) }],
    respuesta: [junto('m∠B = '), dF('105°')] });
  EJ6.push({ nivel: 2, titulo: 'No cabe',
    enunciado: 'En el cuadrilátero convexo ABCD, m∠A = 95°, m∠B = 105° y m∠C = 80°. ¿Se puede inscribir en una circunferencia?',
    datos: [D_INSCR],
    solucion: [{ texto: 'Los opuestos A y C suman 95° + 80° = 175°, no 180°.' },
      { texto: ['Basta un par que no sume 180°: ', dF('no se puede'), '.'] }],
    respuesta: [dF('No'), ': A y C suman 175°'] });
  EJ6.push({ nivel: 2, titulo: 'El exterior del cuadrilátero',
    enunciado: 'El cuadrilátero ABCD está inscrito en una circunferencia y m∠A = 70°. Se prolonga BC más allá de C. ¿Qué ángulo forma esa prolongación con CD?',
    datos: [D_CIC, 'Dos ángulos vecinos en una recta suman 180°.'],
    solucion: [{ texto: 'C, opuesto de A, mide 180° − 70° = 110°.' },
      { texto: 'El de afuera es su vecino en la recta BC:', ecuacion: junto(['180° − 110° = ', dF('70°')]) }],
    respuesta: [dF('70°'), ', lo mismo que m∠A'] });
  EJ6.push({ nivel: 2, titulo: 'Desde un mismo punto',
    enunciado: 'Los vértices del cuadrilátero ABCD están todos a 8 cm de un punto O. Si m∠B = 120°, ¿cuánto mide m∠D?',
    datos: [D_CIC, 'Puntos a la misma distancia de O están en una circunferencia de centro O.'],
    fuente: 'Modelo de San Marcos 2026-II (pregunta 36), con otros números.',
    solucion: [{ texto: 'Los cuatro vértices están a 8 cm de O: están en una circunferencia. ABCD es inscrito.' },
      { texto: 'B y D son opuestos:', ecuacion: junto(['m∠D = 180° − 120° = ', dF('60°')]) }],
    respuesta: [junto('m∠D = '), dF('60°')] });

  // Nivel 3 (examen): la correcta en A, C, E, B y D (las de «por qué» explican cada razón que no alcanza).
  EJ6.push({ nivel: 3, titulo: 'Un inscrito con una diagonal',
    enunciado: 'En el cuadrilátero inscrito ABCD, la diagonal AC forma m∠BAC = 35° y m∠BCA = 40°. ¿Cuánto mide m∠ADC?',
    alternativas: ['75°', '105°', '145°', '40°', '35°'],
    datos: [D_TRI, D_CIC],
    solucion: [{ texto: 'En el triángulo ABC:', ecuacion: junto(['m∠ABC = 180° − 35° − 40° = 105°']) },
      { texto: 'D es opuesto de B:', ecuacion: junto(['m∠ADC = 180° − 105° = ', dF('75°')]) },
      { texto: '105° es m∠ABC; 145° resta solo 35° de 180°; 40° y 35° copian un dato.' }],
    respuesta: [junto('m∠ADC = '), dF('75°')] });
  EJ6.push({ nivel: 3, titulo: 'El cuadrado y sus dos puntos',
    enunciado: 'ABCD es un cuadrado. M está en BC y N en CD, con BM = CN. AM y BN se cortan en P, y m∠APB = 90°. ¿Por qué PMCN se puede inscribir en una circunferencia?',
    alternativas: ['Porque M y N son los puntos medios de sus lados', 'Porque es un cuadrado', 'Porque P y C suman 180°', 'Porque sus lados miden igual', 'No se puede inscribir'],
    datos: [D_INSCR, 'Los ángulos de un cuadrado miden 90°; dos ángulos opuestos por el vértice miden igual.'],
    fuente: 'Modelo de San Marcos 2025-II (pregunta 36), con otra pregunta.',
    solucion: [{ texto: 'En C, el ángulo del cuadrado mide 90°. En P, el ángulo MPN es opuesto por el vértice a APB: también 90°.' },
      { texto: 'P y C son opuestos en PMCN y suman 180°: sí se puede inscribir.' },
      { texto: '«Porque M y N son los puntos medios de sus lados» y «Porque sus lados miden igual» no hacen falta.' },
      { texto: '«Porque es un cuadrado» no se cumple; «No se puede inscribir» olvida que P y C suman 180°.' }],
    respuesta: [dF('Porque P y C suman 180°')] });
  EJ6.push({ nivel: 3, titulo: 'El exterior es el opuesto',
    enunciado: 'En el cuadrilátero inscrito ABCD, m∠A = 2x + 10° y el ángulo entre CD y la prolongación de BC más allá de C mide 3x − 20°. ¿Cuánto mide m∠A?',
    alternativas: ['30°', '110°', '86°', '60°', '70°'],
    datos: [D_CIC, 'Dos ángulos vecinos en una recta suman 180°.'],
    solucion: [{ texto: 'El de afuera en C es 180° − m∠C, y m∠C = 180° − m∠A: el de afuera mide lo mismo que m∠A.', ecuacion: junto(['2x + 10° = 3x − 20°', FL, 'x = 30']) },
      { texto: ['m∠A = 2 · 30° + 10° = ', dF('70°'), '.'] },
      { texto: '30° es x; 110° es m∠C; 60° olvida el 10°; 86° sale de sumar los dos a 180° (x = 38).' }],
    respuesta: [junto('m∠A = '), dF('70°')] });
  EJ6.push({ nivel: 3, titulo: 'Arcos en razón',
    enunciado: 'A, B, C y D parten una circunferencia en arcos AB, BC, CD y DA que están en la razón 2 : 3 : 4 : 3. ¿Cuánto mide m∠ABC del cuadrilátero inscrito ABCD?',
    alternativas: ['90°', '105°', '120°', '210°', '75°'],
    datos: [D_INSC, 'En la razón 2 : 3 : 4 : 3, los arcos miden 2k, 3k, 4k y 3k.'],
    solucion: [{ texto: 'Los arcos suman 12k = 360°: k = 30°. Miden 60°, 90°, 120° y 90°.' },
      { texto: 'ABC abarca el arco de C a A que pasa por D: CD + DA = 120° + 90° = 210°.', ecuacion: junto(['m∠ABC = 210° ÷ 2 = ', dF('105°')]) },
      { texto: '210° es el arco; 75° abarca los otros dos arcos (150°); 90° y 120° son arcos sueltos.' }],
    respuesta: [junto('m∠ABC = '), dF('105°')] });
  EJ6.push({ nivel: 3, titulo: 'Un trapecio isósceles inscrito',
    enunciado: 'El trapecio ABCD, con BC ∥ AD, está inscrito en una circunferencia y m∠B = 3 · m∠A. ¿Cuánto mide m∠C?',
    alternativas: ['45°', '90°', '60°', '135°', '120°'],
    datos: [D_CIC, 'En un trapecio, dos ángulos de un mismo lado no paralelo suman 180°.'],
    solucion: [{ texto: 'A y B están del mismo lado no paralelo: m∠A + 3 · m∠A = 180°, así m∠A = 45° y m∠B = 135°.' },
      { texto: 'C es opuesto de A:', ecuacion: junto(['m∠C = 180° − 45° = ', dF('135°')]) },
      { texto: '45° es m∠A; 90° iguala A y B; 60° y 120° reparten 180° como si m∠B fuera el doble.' }],
    respuesta: [junto('m∠C = '), dF('135°')] });

  // «Ahora tú» de la idea 6. Tipos: el opuesto; los opuestos con x; ¿se puede inscribir?; el exterior que mide como el
  // interior opuesto; los vértices a la misma distancia de un punto.
  function casoOpuesto(r) {
    const par = r.de([['B', 'D'], ['A', 'C'], ['D', 'B'], ['C', 'A']]), a = r.ent(50, 130), otro = { A: 'B', B: 'A', C: 'D', D: 'C' }[par[0]];
    const b = r.ent(50, 130);
    return { pregunta: `El cuadrilátero ABCD está inscrito en una circunferencia. m∠${par[0]} = ${a}° y m∠${otro} = ${b}°. ¿Cuánto mide m∠${par[1]}?`,
      datos: [D_CIC],
      opciones: opciones(180 - a, OPS(r, [
        { id: 'vecino', valor: 180 - b, error: 'GE-CIC1', siFuera: `Restar de 180° está bien; pero el opuesto de ${par[1]} es ${par[0]}, no ${otro}.` },
        { id: 'igual', valor: a, error: 'GE-CIC4', siFuera: 'Iguales serían en un paralelogramo; inscrito, los opuestos suman 180°.' },
        { id: 'resto', valor: 360 - a - b, error: 'GE-CIC5', siFuera: 'Restar de 360° da lo que suman los otros dos juntos, no uno solo.' }]), gr),
      solucion: { texto: `${par[0]} y ${par[1]} son opuestos: suman 180°.`, ecuacion: junto([`m∠${par[1]} = 180° − ${a}° = `, dF(gr(180 - a))]) } };
  }
  function casoOpuestoX(r) {
    for (;;) {
      const p = r.ent(2, 4), q = r.ent(1, 3), x = r.ent(10, 30), k = 5 * r.ent(1, 6), A = p * x + k, C = 180 - A, m = C - q * x;
      if (m <= 0 || C < 30 || A < 30) continue;
      const ex = (c, t) => `${c === 1 ? '' : c}x + ${t}°`;
      return { pregunta: `El cuadrilátero ABCD está inscrito en una circunferencia. m∠A = ${ex(p, k)} y m∠C = ${ex(q, m)}, con x en grados. ¿Cuánto mide m∠A?`,
        datos: [D_CIC],
        opciones: opciones(A, OPS(r, [
          { id: 'x', valor: x, error: 'GE-CIC6', siFuera: `Despejar está bien: x = ${x}. Falta reemplazarlo en m∠A.` },
          { id: 'mc', valor: C, error: 'GE-CIC1', siFuera: `${gr(C)} es m∠C; se pide m∠A.` },
          { id: 'igual', valor: (() => { const xx = (m - k) / (p - q); return p * xx + k; })(), error: 'GE-CIC4', siFuera: 'Igualar los opuestos sería en un paralelogramo; aquí suman 180°.' }]), gr),
        solucion: { texto: 'Los opuestos suman 180°:', ecuacion: junto([`${ex(p, k)} + ${ex(q, m)} = 180°`, FL, `x = ${x}`, FL, 'm∠A = ', dF(gr(A))]) } };
    }
  }
  function casoInscriptible(r) {
    const a = 5 * r.ent(14, 26), si = r.ent(0, 1) === 1, c = si ? 180 - a : 180 - a + 5 * r.de([-3, -2, -1, 1, 2, 3]);
    const correcta = si ? 'Sí: A y C suman 180°' : `No: A y C suman ${a + c}°`;
    const ops = [{ id: 'c', texto: correcta, correcta: true },
      { id: 'otro', texto: si ? 'No: A y C no son iguales' : 'Sí: todo cuadrilátero se puede', error: si ? 'GE-CIC4' : 'GE-CIC7', siFuera: si ? 'Iguales servirían en un paralelogramo; para inscribir, los opuestos suman 180°.' : 'Todo triángulo se puede inscribir; un cuadrilátero, solo si sus opuestos suman 180°.' },
      { id: 'iguales', texto: si ? 'Solo si además es un rectángulo' : 'Sí, si se agranda la circunferencia', error: si ? 'GE-CIC8' : 'GE-CIC7', siFuera: si ? 'El rectángulo es un caso; basta que los opuestos sumen 180°.' : 'El tamaño no cambia los ángulos: si no suman 180°, no cabe en ninguna.' },
      { id: 'faltan', texto: 'Faltan los ángulos B y D', error: 'GE-CIC9', siFuera: 'Un par de opuestos alcanza: si A y C suman 180°, B y D también.' }];
    return { pregunta: `En el cuadrilátero convexo ABCD, m∠A = ${a}° y m∠C = ${c}°. ¿Se puede inscribir en una circunferencia?`,
      datos: [D_INSCR, D_CUAD], opciones: ops,
      solucion: { texto: 'Se suman los opuestos y se compara con 180°.', ecuacion: junto([`${a}° + ${c}° = ${a + c}°`, FL, dF(si ? 'sí' : 'no')]) } };
  }
  function casoExteriorCic(r) {
    const a = r.ent(55, 125);
    return { pregunta: `El cuadrilátero ABCD está inscrito en una circunferencia y m∠A = ${a}°. Se prolonga BC más allá de C. ¿Qué ángulo forma esa prolongación con CD?`,
      datos: [D_CIC, 'Dos ángulos vecinos en una recta suman 180°.'],
      opciones: opciones(a, OPS(r, [
        { id: 'mc', valor: 180 - a, error: 'GE-CIC10', siFuera: `${gr(180 - a)} es m∠C; el de afuera es su vecino en la recta.` },
        { id: 'mitad', valor: a / 2, error: 'GE15', siFuera: 'La mitad sería un inscrito de ese arco; aquí el de afuera es el vecino de C.' },
        { id: 'resto', valor: 360 - a, error: 'GE-CIC5', siFuera: 'Restar de 360° da otra cosa: el de afuera completa 180° con C.' }]), gr),
      solucion: { texto: `m∠C = 180° − ${a}°; el de afuera completa 180° con C:`, ecuacion: junto([`180° − (180° − ${a}°) = `, dF(gr(a))]) } };
  }
  function casoMismoPunto(r) {
    const b = r.ent(60, 140), dist = r.ent(5, 20);
    return { pregunta: `Los vértices del cuadrilátero convexo ABCD están todos a ${dist} cm de un punto O. Si m∠B = ${b}°, ¿cuánto mide m∠D?`,
      datos: [D_CIC, 'Puntos a la misma distancia de O están en una circunferencia de centro O.'],
      opciones: opciones(180 - b, OPS(r, [
        { id: 'igual', valor: b, error: 'GE-CIC4', siFuera: 'Opuestos iguales serían en un paralelogramo; inscrito, suman 180°.' },
        { id: 'resto', valor: 360 - b, error: 'GE-CIC5', siFuera: 'Restar de 360° no da un ángulo: es lo que suman los otros tres.' },
        { id: 'mitad', valor: b / 2, error: 'GE15', siFuera: 'La mitad sería un inscrito de un arco; D es el opuesto de B.' }]), gr),
      solucion: { texto: 'Están en una circunferencia de centro O: ABCD es inscrito, y B y D suman 180°.', ecuacion: junto([`m∠D = 180° − ${b}° = `, dF(gr(180 - b))]) } };
  }

  // El farol D adentro (Predice): su ángulo, medido.
  const D_DENTRO = [0.3, -1.6], angD_DENTRO = U.angulo(D_DENTRO, U.polar([0, 0], RP, 200), U.polar([0, 0], RP, GC6));
  const ciclico = {
    id: 'cuadrilatero-inscrito',
    titulo: 'Cuadrilátero inscrito',
    pregunta: '¿Qué tienen de especial cuatro faroles en el borde de una pileta?',
    temas: ['Cuadrilátero inscrito e inscriptible'],
    pieza: GO,
    aprendizaje: 'Si los cuatro vértices están en una circunferencia, los ángulos opuestos suman 180°; y si suman 180°, caben en una.',
    actividad: 'Correr un farol por el borde de la pileta y mirar los ángulos del cordel.',
    // Lee: cuadrilátero inscrito y opuestos (qué son). No dice cuánto suman los opuestos (lo muestra el juego) ni qué pasa
    // con D fuera del borde (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Cuatro faroles', texto: 'Para la feria, un cordel une los cuatro faroles del borde de la pileta: A, B, C y D, en ese orden. El cordel forma un cuadrilátero inscrito: sus cuatro vértices están en la circunferencia.',
          pieza: GO, dibujo: fig(figCordel(200, { alt: 'La pileta con cuatro faroles en el borde, unidos por un cordel: el cuadrilátero ABCD.' })) },
        { titulo: 'Los opuestos', texto: 'En ABCD, dos ángulos opuestos no comparten lado: A con C, y B con D. Cada ángulo del cordel tiene su vértice en el borde: es un ángulo inscrito.' },
        { titulo: 'Qué mirar al jugar', texto: 'Corre el farol A por el borde y anota los ángulos en B y en D. Compara cómo cambian los dos.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'Un cordel une los cuatro faroles del borde de la pileta. Se puede correr el farol A por el borde.',
      mision: {
        texto: 'Corre el farol A hasta que el ángulo en B mida 70°.',
        logrado: v => angB6(v.fi) === 70,
        bien: 'Con m∠B = 70°, el ángulo en D mide 110°.',
      },
      voz: 'Corre A. ¿Qué pasa con B y con D a la vez?',
      leyenda: [
        { s: dH('m∠B'), t: 'el ángulo del cordel en B (marca simple)' },
        { s: dH('m∠D'), t: 'el ángulo del cordel en D (marca doble)' },
        { s: 'A', t: 'el farol que se corre' },
      ],
      controles: [{ id: 'fi', etiqueta: 'dónde está A (grados de vuelta desde la derecha)', min: 140, max: 240, paso: 10, inicio: 180, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: figCordel(v.fi), estado: {} }),
      lectura: v => { const b = angB6(v.fi); return [dH(junto(`m∠B = ${gr(b)}`)), ' y ', dH(junto(`m∠D = ${gr(180 - b)}`)), ': suman 180°']; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el farol D se mete dentro de la pileta, sin tocar el borde. ¿Cuánto suman los ángulos del cordel en B y en D?',
      voz: 'D dejó el borde. ¿Sigue valiendo lo de antes?',
      opciones: [
        { id: 'c', texto: 'Más de 180°', correcta: true },
        { id: 'igual', texto: '180°, como antes', error: 'GE-CIC2', siFuera: 'Sumarían 180° si D siguiera en el borde. Dentro, el ángulo en D se abre.' },
        { id: 'menos', texto: 'Menos de 180°', error: 'GE-CIC3', siFuera: 'Sería menos si D saliera de la pileta: afuera, el ángulo en D se cierra.' },
      ],
      dibujo: fig(figCordel(200, { D: D_DENTRO, alt: 'El cordel ABCD con el farol D dentro de la pileta.' })),
      revelar: fig(figCordel(200, { D: D_DENTRO, textos: { B: '70°', D: `≈ ${gr(Math.round(angD_DENTRO))}` }, alt: `Con D dentro, m∠B sigue en 70° y m∠D crece a unos ${Math.round(angD_DENTRO)}°: suman más de 180°.` })),
      coincide: 'Coincide: con D dentro, el ángulo en D se abre y la suma pasa de 180°.',
      noCoincide: 'Revisemos: con D en el borde, m∠D = 110°. Al meterlo, el ángulo se abre: la suma pasa de 180°.',
    },
    mira: {
      pieza: GO,
      datos: figCordel(200, { arcos: 1, textosArcos: ['140°', '220°'], textos: { B: '70°', D: '110°' }, alt: 'El ángulo en B abarca el arco ADC y el de D, el arco ABC: los dos arcos juntos son la circunferencia entera.' }),
      voz: 'Cada ángulo abarca un arco. Junta los dos arcos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'B y D son inscritos: cada uno mide la mitad de su arco.', ecuacion: junto([dH('m∠B'), ' = 70°', Y, dH('m∠D'), ' = 110°']) },
        { estado: { corte: 1 }, texto: 'B abarca el arco ADC: mide 2 · 70° = 140°.', ecuacion: junto([dO('arco ADC'), ' = 140°']) },
        { estado: { corte: 2 }, texto: 'D abarca el arco ABC: 2 · 110° = 220°.', ecuacion: junto([dI('arco ABC'), ' = 220°']) },
        { estado: { corte: 2 }, texto: 'Los dos arcos son la vuelta entera: 360°.', ecuacion: junto(['m∠B + m∠D = 360° ÷ 2 = 180°']) },
      ],
    },
    regla: {
      texto: 'En un cuadrilátero inscrito, los ángulos opuestos suman 180°. Al revés: si dos ángulos opuestos suman 180°, sus cuatro vértices caben en una circunferencia (es inscriptible).',
      ecuacion: junto([dH('m∠B'), ' + ', dH('m∠D'), ' = 180°', Y, 'm∠A + m∠C = 180°']),
      condicion: 'ABCD es convexo y sus vértices van en orden por el borde; A con C y B con D son los opuestos.',
      voz: 'Antes de sumar 180°, mira si los cuatro están en la circunferencia.',
    },
    // Así se resuelve: el ángulo que falta, o ¿se puede inscribir? (otros números que «Ahora tú»).
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const a = r.ent(131, 150), b = r.ent(31, 49);
          return {
            enunciado: `El cuadrilátero ABCD está inscrito en una circunferencia. Si m∠A = ${a}° y m∠B = ${b}°, ¿cuánto mide m∠D?`,
            datos: [D_CIC],
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠D, un ángulo del cuadrilátero inscrito.' },
              { tipo: 'datos', texto: `m∠A = ${a}° y m∠B = ${b}°. Los vértices van en orden: el opuesto de D es B, no A.` },
              { tipo: 'regla', texto: 'En un cuadrilátero inscrito, dos ángulos opuestos suman 180°: entre los dos abarcan la circunferencia entera.', ecuacion: junto('m∠B + m∠D = 180°') },
              { tipo: 'cuentas', texto: 'Se resta m∠B de 180°; m∠A no entra en esta cuenta.', ecuacion: junto([`m∠D = 180° − ${b}° = `, dF(gr(180 - b))]) },
              { tipo: 'sentido', texto: `Comprobación: m∠C = 180° − ${a}° = ${180 - a}°, y los cuatro suman ${a}° + ${b}° + ${180 - a}° + ${180 - b}° = 360°.` },
            ],
            respuesta: [junto('m∠D = '), dF(gr(180 - b))],
          };
        }
        const a = r.ent(131, 155), si = Math.floor(s / 2) % 2 === 0, c = si ? 180 - a : 180 - a + r.de([-4, -2, 3, 6]);
        return {
          enunciado: `En el cuadrilátero convexo ABCD, m∠A = ${a}° y m∠C = ${c}°. ¿Se puede inscribir en una circunferencia?`,
          datos: [D_INSCR],
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si los cuatro vértices de ABCD caben en una circunferencia.' },
            { tipo: 'datos', texto: `m∠A = ${a}° y m∠C = ${c}°. A y C no comparten lado: son opuestos.` },
            { tipo: 'regla', texto: 'Un cuadrilátero se puede inscribir si sus ángulos opuestos suman 180°, y solo entonces.' },
            { tipo: 'cuentas', texto: 'Se suman los dos opuestos y se compara con 180°.', ecuacion: junto([`${a}° + ${c}° = ${a + c}°`, FL, dF(si ? 'sí' : 'no')]) },
            { tipo: 'sentido', texto: si ? 'Suman justo 180°: la circunferencia que pasa por A, B y C también pasa por D.' : `Suman ${a + c}°, no 180°: no hay circunferencia que pase por los cuatro.` },
          ],
          respuesta: si ? [dF('Sí'), ': A y C suman 180°'] : [dF('No'), `: A y C suman ${a + c}°`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica los opuestos antes de sumar.',
      generar(s) { return conCuatro([casoOpuesto, casoOpuestoX, casoInscriptible, casoExteriorCic, casoMismoPunto][s % 5], azar(s + 23), firmasDe(EJ6)); },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas (las tres mesas de antes, con sus id y los colores del curso) ----------
  const valoresDe = c => Array.from({ length: Math.floor((c.max - c.min) / c.paso + 1e-9) + 1 }, (_, k) => Math.round(Math.min(c.max, c.min + k * c.paso) * 1e6) / 1e6);
  // Mesa 1 (idea 3): dos círculos de luz con los dos radios libres.
  const mesaDos = {
    id: 'dos-libres', titulo: 'Dos luces con radios libres', pieza: GO,
    consigna: 'Cambia los dos radios y la distancia d entre los centros. Mira cuándo los bordes se tocan o se cortan.',
    controles: [
      { id: 'r1', etiqueta: 'r₁, la luz grande', min: 20, max: 50, paso: 5, inicio: 40, unidad: 'cm', decimales: 0, color: 'c-o' },
      { id: 'r2', etiqueta: 'r₂, la luz chica', min: 5, max: 20, paso: 5, inicio: 15, unidad: 'cm', decimales: 0, color: 'c-i' },
      { id: 'd', etiqueta: 'd, entre los centros', min: 0, max: 70, paso: 5, inicio: 60, unidad: 'cm', decimales: 0 },
    ],
    dibujo: v => ({ datos: figLuces(v.d, v.r1, v.r2), estado: {} }),
    lectura: v => { const p = posicionDe(v.d, v.r1, v.r2); return [junto(`d = ${v.d} cm: `), p.slice(0, p.lastIndexOf(':'))]; },
    invitaciones: [
      { texto: 'Haz que los bordes se toquen por fuera en un solo punto.', logrado: v => v.d === v.r1 + v.r2, bien: 'd es justo la suma de los radios.' },
      { texto: 'Haz que la chica quede adentro, tocando el borde de la grande.', logrado: v => v.d === v.r1 - v.r2 && v.d > 0, bien: 'd es justo la resta de los radios.' },
      { texto: 'Pon las dos con el mismo centro.', logrado: v => v.d === 0, bien: 'd = 0: son concéntricas.' },
    ],
  };
  // Mesa 2 (idea 4): el arco libre y P en cualquier lugar del borde, también en el arco de los faroles.
  const pLibre = (a, fi) => { const P = U.polar([0, 0], RP, fi), A = U.polar([0, 0], RP, 270 - a / 2), B = U.polar([0, 0], RP, 270 + a / 2); return U.angulo(P, A, B); };
  const enArcoChico = (a, fi) => { const x = ((fi - (270 - a / 2)) % 360 + 360) % 360; return x > 0 && x < a; };
  const mesaInscrito = {
    id: 'inscrito-libre', titulo: 'El fotógrafo en cualquier lugar', pieza: GO,
    consigna: 'Abre los faroles y lleva al fotógrafo a cualquier lugar del borde, también entre los faroles.',
    controles: [
      { id: 'arco', etiqueta: 'arco AB', min: 40, max: 160, paso: 20, inicio: 80, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'fi', etiqueta: 'dónde está P (grados de vuelta desde la derecha)', min: 0, max: 340, paso: 20, inicio: 100, unidad: '°', decimales: 0 },
    ],
    dibujo: v => ({ datos: Math.abs(((v.fi - (270 - v.arco / 2)) % 360 + 360) % 360) < 1e-9 || Math.abs(((v.fi - (270 + v.arco / 2)) % 360 + 360) % 360) < 1e-9 ? figPileta(v.arco, v.fi, { sinP: true, textoArco: '' }) : figPileta(v.arco, v.fi, { textoArco: '' }), estado: {} }),
    lectura: v => { const en = Math.abs(((v.fi - (270 - v.arco / 2)) % 360 + 360) % 360) < 1e-9 || Math.abs(((v.fi - (270 + v.arco / 2)) % 360 + 360) % 360) < 1e-9; if (en) return junto(`P está en un farol; arco AB = ${v.arco}°`); return [dO(junto(`arco AB = ${v.arco}°`)), ': ', dH(junto(`∠APB = ${gr(pLibre(v.arco, v.fi))}`)), enArcoChico(v.arco, v.fi) ? junto(`, abarca el otro, ${360 - v.arco}°`) : '']; },
    invitaciones: [
      { texto: 'Lleva a P entre los dos faroles, sobre el arco AB.', logrado: v => enArcoChico(v.arco, v.fi), bien: 'Ahora P abarca el otro arco: el ángulo pasa de 90°.' },
      { texto: 'Abre los faroles hasta que P los vea con 80°, desde el arco grande.', logrado: v => v.arco === 160 && !enArcoChico(v.arco, v.fi) && Math.abs(pLibre(v.arco, v.fi) - 80) < 1e-6, bien: 'Arco de 160°: la mitad, 80°.' },
    ],
  };
  // Mesa 3 (idea 6): el farol D dentro, sobre o fuera del borde.
  const DL = (fi, od) => U.polar([0, 0], od, fi);
  const sumaBD = v => angB6(200) + U.angulo(DL(v.fi, v.od), U.polar([0, 0], RP, 200), U.polar([0, 0], RP, GC6));
  const mesaCiclico = {
    id: 'cuadrilatero-libre', titulo: 'D dentro, sobre o fuera', pieza: GO,
    consigna: 'Corre el farol D hacia adentro o hacia afuera del borde de la pileta. Compara m∠B + m∠D en cada caso.',
    controles: [
      { id: 'fi', etiqueta: 'D, dirección', min: 250, max: 300, paso: 10, inicio: 270, unidad: '°', decimales: 0 },
      { id: 'od', etiqueta: 'D, del centro', min: 2, max: 3.6, paso: 0.2, inicio: 2.4, unidad: '', decimales: 1 },
    ],
    dibujo: v => ({ datos: figCordel(200, { D: DL(v.fi, v.od) }), estado: {} }),
    lectura: v => { const s = sumaBD(v), sobre = Math.abs(v.od - RP) < 1e-9; return [dH(junto(`m∠B + m∠D ${sobre ? '=' : '≈'} ${gr(Math.round(s))}`)), sobre ? ': D en el borde' : v.od < RP ? ': D adentro' : ': D afuera']; },
    invitaciones: [
      { texto: 'Pon D justo en el borde: haz que m∠B + m∠D sume 180°.', logrado: v => Math.abs(v.od - RP) < 1e-9, bien: 'En el borde, los opuestos suman 180°.' },
      { texto: 'Saca D afuera de la pileta.', logrado: v => v.od > RP + 1e-9, bien: 'Afuera, el ángulo en D se cierra: la suma no llega a 180°.' },
    ],
  };
  return {
    unidad: 'geometria.circunferencia',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'El libro III de los Elementos reúne cuerdas, tangentes y ángulos de la circunferencia. Su proposición 20 compara dos observadores del mismo arco: uno en el centro y otro sobre la circunferencia. La prueba usa radios iguales y distingue casos según dónde queda el centro. La condición decisiva sigue siendo la misma: los dos ángulos se apoyan en el mismo arco.',
      pregunta: '¿Qué cambia si el vértice sale de la circunferencia?',
      fuente: { titulo: 'Euclides, Elementos III.20 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookIII/propIII20.html' },
    },
    // La tabla de letras de la unidad (molde §0.4; propuesta §5).
    letras: { r: 'el radio (r₁ y r₂, los de dos circunferencias)', d: 'la distancia entre los centros de dos circunferencias', h: 'la altura del agua en el tanque',
      a: 'un cateto, en Poncelet', b: 'el otro cateto, en Poncelet', c: 'la hipotenusa, en Poncelet', x: 'lo que se pide, un número', k: 'la medida de una parte, en una razón', L: 'el arco lejano, en grados' },
    // «interiores» (dos circunferencias, una dentro de otra) no es el «ángulo interior» de Triángulos: aquí no se marca.
    glosarioSin: ['ángulo interior'],
    glosario: [
      // Idea 1. «circunferencia», «radio» y «diámetro» se mudaron de Congruencia (pendiente de la Etapa 5; decisión 4).
      // Ninguno dice qué pasa con dos cuerdas igual de lejos del centro (la predicción).
      { termino: 'circunferencia', formas: ['circunferencia', 'circunferencias'],
        def: 'Línea curva cerrada cuyos puntos están todos a la misma distancia de un punto fijo, su centro.',
        simple: 'El borde de algo redondo, como el de una moneda.',
        ejemplos: ['El borde de una moneda.', 'Un compás abierto 5 cm traza una de radio 5 cm.', 'Visto de frente, el borde de un tanque echado en el piso.'], ver: ['radio', 'cuerda'] },
      { termino: 'radio', formas: ['radio', 'radios'], def: 'Segmento del centro a un punto de la circunferencia; también, su medida.',
        simple: 'Lo que hay del centro al borde, igual hacia cualquier lado.',
        ejemplos: ['Un compás abierto 5 cm traza una circunferencia de radio 5 cm.', 'Todos los radios de una circunferencia miden igual.', 'En un tanque de 100 cm de diámetro, el radio mide 50 cm.'], ver: ['diámetro'] },
      { termino: 'diámetro', formas: ['diámetro', 'diámetros'], def: 'Cuerda que pasa por el centro de la circunferencia. Mide dos radios.',
        ejemplos: ['Con radio 5 cm, el diámetro mide 10 cm.', 'Es la cuerda más larga de una circunferencia.', 'El centro lo parte en dos mitades.'], ver: ['radio', 'cuerda'] },
      { termino: 'cuerda', formas: ['cuerda', 'cuerdas'], def: 'Segmento que une dos puntos de una circunferencia.',
        simple: 'Un tramo recto de borde a borde, como la superficie del agua.',
        ejemplos: ['La superficie del agua en un tanque echado.', 'El diámetro es la cuerda más larga.', 'Una vereda recta que cruza una plaza redonda de borde a borde.'], ver: ['diámetro'] },
      { termino: 'tangente', formas: ['tangente', 'tangentes'], def: 'Recta que toca una circunferencia en un solo punto.',
        simple: 'Una recta que apenas toca el borde, como el piso bajo un tanque.',
        ejemplos: ['El piso, bajo un tanque echado.', 'Una regla apoyada en el borde de una moneda.', 'Una recta que corta la circunferencia en dos puntos no lo es.'], ver: ['punto de tangencia'] },
      { termino: 'punto de tangencia', formas: ['punto de tangencia', 'puntos de tangencia', 'punto de contacto', 'puntos de contacto'],
        def: 'El único punto que comparten una tangente y la circunferencia.',
        ejemplos: ['Donde el piso toca el tanque.', 'Donde una regla apoyada toca la moneda.', 'Cada tangente tiene uno solo.'], ver: ['tangente'] },
      // Idea 2. Ninguno dice cuánto suman los lados de la bandeja (la predicción): Pitot y Poncelet quedan en la regla.
      { termino: 'circunferencia inscrita', formas: ['circunferencia inscrita', 'circunferencias inscritas'],
        def: 'La que queda dentro de un polígono y toca cada uno de sus lados en un solo punto.',
        simple: 'La que entra justo adentro y roza todos los bordes, como un plato.',
        ejemplos: ['Un plato que entra justo en una bandeja y roza sus cuatro bordes.', 'Un triángulo tiene una sola circunferencia inscrita.', 'Toca cada lado en su punto de contacto.'], ver: ['polígono circunscrito'] },
      { termino: 'polígono circunscrito', formas: ['polígono circunscrito', 'polígonos circunscritos', 'cuadrilátero circunscrito', 'cuadriláteros circunscritos', 'circunscrito'],
        def: 'Polígono cuyos lados tocan todos una misma circunferencia, que queda adentro.',
        simple: 'Una bandeja cuyos bordes rozan, todos, el plato de adentro.',
        ejemplos: ['La bandeja con su plato: un cuadrilátero circunscrito.', 'Un cuadrado con su circunferencia inscrita.', 'Un rectángulo que no es cuadrado no lo es.'], ver: ['circunferencia inscrita'] },
      { termino: 'circunscrita', formas: ['circunscrita', 'circunscritas'], def: 'Dicho de una circunferencia: pasa por todos los vértices de un polígono, que queda adentro.',
        ejemplos: ['La circunferencia que pasa por los tres vértices de un triángulo.', 'En el triángulo rectángulo, su centro es el medio de la hipotenusa.', 'Los cuatro faroles de la pileta están en una.'], ver: ['circunferencia inscrita'] },
      // Idea 3. Sin las condiciones de cada posición (la regla y la predicción): solo qué es cada una.
      { termino: 'circunferencias secantes', formas: ['circunferencias secantes'],
        def: 'Dos circunferencias que se cortan en dos puntos.',
        simple: 'Dos bordes redondos que se cruzan en dos puntos.',
        ejemplos: ['Dos círculos de luz que se montan un poco.', 'Los aros de un logo que se cruzan.', 'Dos ondas en el agua que se cruzan.'], ver: ['tangentes exteriores'] },
      { termino: 'tangentes exteriores', formas: ['tangentes exteriores'],
        def: 'Dos circunferencias que se tocan en un solo punto, una fuera de la otra.',
        simple: 'Dos ruedas que se tocan por fuera, como dos monedas juntas.',
        ejemplos: ['Dos monedas juntas sobre la mesa.', 'Dos engranajes que se tocan.', 'El punto donde se tocan está en la recta de los centros.'], ver: ['tangentes interiores'] },
      { termino: 'tangentes interiores', formas: ['tangentes interiores'],
        def: 'Dos circunferencias que se tocan en un solo punto, una dentro de la otra.',
        simple: 'Una rueda chica dentro de una grande, tocándola en un punto.',
        ejemplos: ['Una moneda dentro de un aro, pegada a su borde.', 'Una pelota dentro de un balde redondo, tocando la pared.', 'El punto donde se tocan está en la recta de los centros.'], ver: ['tangentes exteriores', 'concéntricas'] },
      { termino: 'concéntricas', formas: ['concéntricas', 'concéntrica'], def: 'Dicho de dos circunferencias con el mismo centro.',
        simple: 'Dos círculos con el mismo centro, como las ondas de una piedra.',
        ejemplos: ['Las ondas que hace una piedra en el agua.', 'Los anillos de un tiro al blanco.', 'La distancia entre sus centros es 0.'] },
      // Idea 4. Sin la medida de cada ángulo (el inscrito, lo muestra el juego; el semiinscrito es la predicción).
      { termino: 'arco que abarca', formas: ['arco que abarca', 'arco que abarcan', 'arcos que abarcan'],
        def: 'Parte de la circunferencia que queda entre los lados de un ángulo, del otro lado del vértice.',
        simple: 'El pedazo de borde que queda dentro de la abertura del ángulo.',
        ejemplos: ['Los faroles A y B: el arco entre ellos es el que abarca la vista de P.', 'Un arco se mide en grados.', 'El de un ángulo con vértice en el centro está entre sus dos radios.'], ver: ['ángulo central', 'ángulo inscrito'] },
      { termino: 'ángulo central', formas: ['ángulo central', 'ángulos centrales'], def: 'Ángulo con el vértice en el centro de la circunferencia y dos radios como lados.',
        simple: 'El que se abre desde el centro, como dos rayos de una rueda.',
        ejemplos: ['El que forman dos rayos de una rueda de bicicleta.', 'El que forman las agujas de un reloj.', 'Una vuelta entera de ángulos centrales mide 360°.'], ver: ['ángulo inscrito'] },
      { termino: 'ángulo inscrito', formas: ['ángulo inscrito', 'ángulos inscritos'],
        def: 'Ángulo con el vértice sobre la circunferencia y dos cuerdas como lados.',
        simple: 'Con el que se ven dos puntos del borde desde otro del borde.',
        ejemplos: ['El fotógrafo en el borde de la pileta mira los dos faroles.', 'En un triángulo con sus vértices en la circunferencia, los tres ángulos lo son.', 'Su vértice está en el borde, no en el centro.'], ver: ['ángulo central', 'semiinscrito'] },
      { termino: 'semiinscrito', formas: ['ángulo semiinscrito', 'semiinscrito', 'semiinscritos'],
        def: 'Ángulo con el vértice sobre la circunferencia, entre una cuerda y la tangente en ese punto.',
        simple: 'Como un inscrito, pero con un lado que solo roza el borde.',
        ejemplos: ['El que forman la tangente en A y la cuerda AB.', 'Uno de sus lados es tangente; el otro, cuerda.', 'También abarca un arco: el que queda entre sus lados.'], ver: ['ángulo inscrito', 'tangente'] },
      // Idea 5. Sin cómo se calcula el ángulo (la regla y la predicción).
      { termino: 'arco lejano', formas: ['arco lejano', 'arcos lejanos'], def: 'De los dos arcos entre los lados de un ángulo de vértice exterior, el que queda más lejos del vértice.',
        simple: 'El pedazo de borde del otro lado del círculo, lejos del vértice.',
        ejemplos: ['Desde Q, afuera, el arco del fondo de la plaza.', 'Siempre es mayor que el cercano.', 'Con dos tangentes, cercano y lejano suman 360°.'], ver: ['arco cercano'] },
      { termino: 'arco cercano', formas: ['arco cercano', 'arcos cercanos'], def: 'De los dos arcos entre los lados de un ángulo de vértice exterior, el que queda más cerca del vértice.',
        simple: 'El pedazo de borde que mira al vértice de afuera.',
        ejemplos: ['Desde Q, afuera, el arco del borde que tiene enfrente.', 'Siempre es menor que el lejano.', 'Con dos tangentes, va de un punto de contacto al otro, del lado de Q.'], ver: ['arco lejano'] },
      // Idea 6. Sin cuánto suman sus opuestos (lo muestra el juego) ni qué pasa con D fuera del borde (la predicción).
      { termino: 'cuadrilátero inscrito', formas: ['cuadrilátero inscrito', 'cuadriláteros inscritos'],
        def: 'Cuadrilátero con sus cuatro vértices sobre una circunferencia.',
        simple: 'Cuatro faroles en el borde de una pileta, unidos por un cordel.',
        ejemplos: ['El cordel entre los cuatro faroles de la pileta.', 'Todo rectángulo lo es.', 'Sus cuatro ángulos son inscritos.'], ver: ['inscriptible'] },
      { termino: 'inscriptible', def: 'Dicho de un cuadrilátero cuyos cuatro vértices caben en una misma circunferencia.',
        simple: 'Que sus cuatro esquinas caben justo en un mismo borde redondo.',
        ejemplos: ['Un rectángulo es inscriptible.', 'Un rombo que no es cuadrado no lo es.', 'Todo triángulo cabe en una circunferencia; un cuadrilátero, no siempre.'], ver: ['cuadrilátero inscrito'] },
    ],
    laboratorio: [mesaDos, mesaInscrito, mesaCiclico],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'dos-libres': ['posiciones'],
      'inscrito-libre': ['inscrito'],
      'cuadrilatero-libre': ['cuadrilatero-inscrito'],
    },
    ideas: [tangentes, pitot, posiciones, inscrito, intExt, ciclico],
  };
});
