/*
 * Teoría de «Polígonos y cuadriláteros» (geometria.poligonos-y-cuadrilateros), para 5.º de secundaria y
 * preuniversitario. Molde: docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 4);
 * Elementos I.34 (la diagonal del paralelogramo). Compañera: Neri (nutria). Piezas: geo-objeto (la escena «parcela»,
 * dibujos de prueba: el terreno con estacas, la plaza con su mototaxi, el geoplano y el corte del canal; el «armazon» de
 * Congruencia para los marcos de madera; y las figuras de examen) y geo-figura (las mesas del laboratorio).
 *
 * Etapa 6 del plan de calidad (19 nov): docs/etapa6/propuesta-geometria.md (Gerson delegó el criterio; revisa después).
 * Seis ideas: suma-de-angulos, angulos-exteriores (nueva), diagonales, paralelogramos, rectangulo-rombo-cuadrado (nueva)
 * y trapecios; se conservan los id de cuatro ideas de antes, los de sus controles y los de las tres mesas. La idea
 * «trapezoides» salió: el cuadrilátero cualquiera va en la idea 1 y el trapezoide, en la 4 (decisión 2).
 * La práctica es plantillas/geo-poligonos-cuadrilateros (tipos por idea). No lleva calidad: 2 hasta el lector en frío y el
 * auditor (la prueba de la unidad la simula).
 * Cuentas de los 90 ejemplos rehechas aparte, sin el código de la unidad (scratchpad e6-geometria/cuentas.py), y las de
 * «Ahora tú» y «Así se resuelve», leyendo el enunciado, en poligonos-y-cuadrilateros.test.js.
 *
 * REGLA DE COLORES DE LA UNIDAD (la del curso: Triángulos y Congruencia; molde §5b):
 *   - todo ángulo interior dado en carmín (h), con 1, 2 o 3 arcos cuando hay parejas; el ángulo exterior (el giro) en
 *     turquesa (i); un ángulo que se pide va con «?» en tinta;
 *   - los lados dados naranja (o) y turquesa (i): en el paralelogramo AB y CD naranja, AD y BC turquesa; en el rectángulo
 *     y el rombo, la diagonal AC naranja y BD turquesa; en el trapecio, la base mayor AD naranja y la menor BC turquesa;
 *     lo que no es dato, las diagonales de conteo que no se cuentan, la mediana y lo pedido, en tinta;
 *   - n (el número de lados) en naranja en el texto y en el control;
 *   - el violeta (f) solo en el texto del resuelto y en la respuesta, nunca en una figura; el verde no se usa;
 *   - las marcas de igualdad van siempre sobre una llave, nunca sobre el lado.
 *   La comprueba poligonos-y-cuadrilateros.test.js en todas las figuras.
 * Notación: m∠A (m∠BAC si el vértice tiene varios ángulos); x sin «°» (m∠A = 3x + 10°, x = 20); S, la suma de los
 * ángulos interiores (solo donde se usa); «diagonales» sin letra (la D es un vértice); los vértices en orden alrededor
 * de la figura; las bases del trapecio por su nombre (AD y BC). Donde la figura tiene puntos A, B, C, ningún resuelto
 * nombra una alternativa por su letra: se explican por su valor.
 * Figuras de ejercicio con un ángulo que se pide: sin escala, con «El dibujo no está a escala.» y el ángulo pedido lejos
 * de la respuesta (decisión 10; lección M2 de la auditoría de Congruencia).
 * Códigos de error (todos hipótesis de aula, sin medir, salvo GE10 y GE23 del informe; docs/investigacion/
 * geometria-ideas-erroneas.md, «Polígonos y cuadriláteros»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar ángulos y diagonales de cualquier polígono partiéndolo en triángulos, y usar las propiedades del
 *     paralelogramo, del rectángulo, del rombo, del cuadrado y del trapecio para hallar lados y ángulos.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla la suma de ángulos interiores o el número de lados, el ángulo de un polígono equiángulo,
 *     el número de diagonales, un lado o un ángulo de un cuadrilátero y la mediana de un trapecio.
 *   Orden de atención: 1.º el objeto (terreno, plaza, geoplano, marco, canal) · 2.º la misión · acción: el control ·
 *     fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿de dónde sale (n − 2) · 180°?» y «¿un cuadrado es también rombo?».
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
  const mt = n => `${f(n)} m`;
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

  // ---------- Ayudantes de figura (geo-objeto) ----------
  const GO = 'geo-objeto';
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dH = t => ({ v: 'c-h', t }), dF = t => ({ v: 'c-f', t });
  const nO = n => dO(String(n));
  // Entre dos igualdades, «y» o una flecha (un «·» se leía como otra igualdad).
  const Y = '   y   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x && x.t ? Object.assign({}, x, { t: junto(x.t) }) : x);
  const fig = (datos, estado = {}) => ({ pieza: GO, datos, estado });
  const RAD = Math.PI / 180;
  const NO_ESC = ' El dibujo no está a escala.';
  const LETRAS = 'ABCDEFGHIJ';

  // Un polígono a escala de geo-figura: nom en orden alrededor de la figura ('ABCDE') y P sus puntos.
  //   ang:   { A: { texto, color, marcas, radio, ext, desde, hasta } }   el arco de ese vértice (sin texto, solo el arco;
  //          sin color, en tinta). ext: true, el ángulo exterior: el lado que llega se prolonga más allá del vértice.
  //   lados: { AB: { texto, color, llave: 1..3, dist, en, grueso, fino, paralela } }   su medida (afuera) o su marca
  //          sobre una llave; grueso: en tinta gruesa; fino: punteado; paralela: las flechitas de paralelas.
  //   diag:  [['A', 'C', { color, discontinua, grosor, desde, hasta }]]   segmentos entre vértices (diagonales, cordeles)
  //   pts:   puntos de más; segs: segmentos de más; angs: ángulos de más (con su mide).
  // Cada ángulo lleva mide (lo que mide de verdad en el dibujo): la prueba lo compara con su rótulo si la figura va a
  // escala.
  function poli(nom, P, o = {}) {
    const ids = nom.split(''), n = ids.length, pos = {};
    ids.forEach((id, k) => { pos[id] = P[k]; });
    (o.pts || []).forEach(q => { pos[q.id] = [q.x, q.y]; });
    const prev = v => ids[(ids.indexOf(v) + n - 1) % n], next = v => ids[(ids.indexOf(v) + 1) % n];
    const puntos = ids.map(id => Object.assign({ id, x: pos[id][0], y: pos[id][1], sinPunto: true }, o.letras === false ? {} : { rotulo: id, lado: 90 }));
    const lados = o.lados || {}, cl = L => (lados[L] || lados[L[1] + L[0]] || {});
    const vis = x => Object.assign({}, x.desde !== undefined ? { desde: x.desde } : {}, x.hasta !== undefined ? { hasta: x.hasta } : {});
    const segmentos = ids.map((id, k) => {
      const L = id + ids[(k + 1) % n], x = cl(L);
      return Object.assign({ de: id, a: ids[(k + 1) % n] }, x.color && x.fino ? { color: x.color, discontinua: true, grosor: 'fino' } : x.color ? { color: x.color, grosor: 'variable' } : x.grueso ? { grosor: 'variable' } : x.fino ? { discontinua: true, grosor: 'fino' } : {}, x.paralela ? { paralela: x.paralela } : {});
    });
    for (const [a, b, x] of o.diag || []) segmentos.push(Object.assign({ de: a, a: b }, x || { discontinua: true, grosor: 'fino' }));
    segmentos.push(...(o.segs || []));
    const angulos = [], extra = [];
    const lista = Object.entries(o.ang || {}).map(([v, x]) => [v, x, !!x.ext]).concat(Object.entries(o.ext || {}).map(([v, x]) => [v, x, true]));
    for (const [v, x, esExt] of lista) {
      const base = { radio: x.radio || 18, holgura: x.holgura || 6, marcas: x.marcas || 1 };
      if (esExt) {
        const pv = pos[prev(v)], q = pos[v], d = U.dist(pv, q), L = (x.largo || 0.42) * d, e = [q[0] + (q[0] - pv[0]) / d * L, q[1] + (q[1] - pv[1]) / d * L], id = `x${v}`;
        extra.push(Object.assign({ id, x: e[0], y: e[1], sinPunto: true }, vis(x)));
        segmentos.push(Object.assign({ de: v, a: id, discontinua: true, grosor: 'fino' }, vis(x)));
        angulos.push(Object.assign({ en: v, de: id, a: next(v), mide: U.angulo(q, e, pos[next(v)]) }, base, vis(x), x.texto !== undefined ? { texto: x.texto } : {}, x.color ? { color: x.color } : {}));
      } else angulos.push(Object.assign({ en: v, de: prev(v), a: next(v), mide: U.angulo(pos[v], pos[prev(v)], pos[next(v)]) }, base, vis(x), x.texto !== undefined ? { texto: x.texto } : {}, x.color ? { color: x.color } : {}));
    }
    for (const a of o.angs || []) angulos.push(Object.assign({ radio: 18, holgura: 6, marcas: 1, mide: U.angulo(pos[a.en], pos[a.de], pos[a.a]) }, a));
    const llaves = [], ladosRot = [];
    const refDe = L => ids.find(x => !L.includes(x));
    for (const [L, x] of Object.entries(lados)) {
      const b = { de: L[0], a: L[1], ref: x.ref || refDe(L) };
      if (x.llave) llaves.push(Object.assign({}, b, { marcas: x.llave }, x.color ? { color: x.color } : {}, x.dist ? { dist: x.dist } : {}, vis(x)));
      if (x.texto !== undefined) ladosRot.push(Object.assign({}, b, { texto: x.texto, dist: x.dist === undefined ? 6 : x.dist }, x.color ? { color: x.color } : {}, x.en !== undefined ? { en: x.en } : {}, vis(x)));
    }
    return { puntos: puntos.concat(extra, o.pts || []), segmentos, angulos, llaves, ladosRot };
  }
  // Junta las partes en una figura; los puntos y los lados repetidos van una sola vez. o.obj: lo del objeto (parcela o
  // armazon: tipo, borde, estacas…); sin él, figura de examen («angulos»).
  function figura(partes, o = {}) {
    const fg = { alt: o.alt, alto: o.alto || 240, puntos: [], segmentos: [], angulos: [] }, llaves = [], ladosRot = [];
    const clave = sg => [sg.de, sg.a].sort().join('');
    for (const p of partes) {
      for (const q of p.puntos || []) if (!fg.puntos.some(x => x.id === q.id)) fg.puntos.push(q);
      for (const sg of p.segmentos || []) { const k = fg.segmentos.findIndex(x => clave(x) === clave(sg) && !x.desde && !sg.desde); if (k < 0) fg.segmentos.push(sg); else if (sg.color && !fg.segmentos[k].color) fg.segmentos[k] = sg; }
      fg.angulos.push(...(p.angulos || [])); llaves.push(...(p.llaves || [])); ladosRot.push(...(p.ladosRot || []));
    }
    if (o.regiones) fg.regiones = o.regiones;
    if (o.rotulos) fg.rotulos = o.rotulos;
    const xs = fg.puntos.map(q => q.x), ys = fg.puntos.map(q => q.y), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const mx = o.mx === undefined ? 0.16 * Math.max(w, 1.3 * h) : o.mx, my = o.my === undefined ? mx : o.my;
    fg.vista = o.vista || { x: [Math.min(...xs) - mx, Math.max(...xs) + mx], y: [Math.min(...ys) - my, Math.max(...ys) + my] };
    PO.acomodarLetras(fg, fg.puntos.filter(q => q.rotulo).map(q => q.id), o.evita || {});
    return Object.assign({ objeto: 'angulos' }, o.obj || {}, { figura: fg }, llaves.length ? { llaves } : {}, ladosRot.length ? { ladosRot } : {}, o.libres ? { libres: o.libres } : {}, o.sinEscala ? { sinEscala: true } : {});
  }
  // Una figura sirve si sus rótulos caben (geo-objeto) y cada rótulo de ángulo queda más cerca de su vértice que de
  // cualquier otro vértice con ángulo marcado (regla de Triángulos).
  function rotulosPropios(F, k = 0.8) {
    const { rot, vertice } = PO.rotulos(F), ids = [...new Set((F.figura.angulos || []).map(q => q.en))];
    return rot.every(z => {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      return ids.every(id => id === z.an.en || d(z.an.en) < k * d(id));
    });
  }
  // Y dos rótulos de ángulo no quedan pegados (con menos de 8 px entre sus cajas se leían como uno: «145°115°»).
  function rotulosSueltos(F, aire = 8) {
    const { rot } = PO.rotulos(F);
    return rot.every((a, i) => rot.every((b, j) => j <= i || a.caja.x1 + aire <= b.caja.x0 || b.caja.x1 + aire <= a.caja.x0 || a.caja.y1 + aire / 2 <= b.caja.y0 || b.caja.y1 + aire / 2 <= a.caja.y0));
  }
  const cabe = F => PO.escenaCabe(F) && rotulosPropios(F) && rotulosSueltos(F);
  // Un polígono convexo de n lados, irregular a propósito (no prototípico) y siempre igual para el mismo n; A abajo a la
  // izquierda y los demás en sentido antihorario.
  const irregular = (n, r = 3, gira = 235) => Array.from({ length: n }, (_, k) => U.polar([0, 0], r * (1 + 0.1 * Math.cos(k * 1.7 + n)), gira + 360 * k / n + 7 * Math.sin(k * 2.3 + n)));
  // Un polígono de n lados iguales y ángulos iguales (para la plaza y el geoplano).
  const parejo = (n, r = 3, gira = 270 - 180 / n) => Array.from({ length: n }, (_, k) => U.polar([0, 0], r, gira + 360 * k / n));
  // Un polígono convexo con esos ángulos interiores (en orden, desde A) y lados de largo parecido: se camina girando
  // 180° − a en cada vértice y los dos últimos lados se ajustan para cerrar. null si no cierra con lados positivos.
  function conAngulos(angs, largos) {
    const n = angs.length, P = [[0, 0]];
    let rumbo = 0;
    const L = largos || angs.map(() => 4);
    for (let k = 0; k < n - 2; k++) { const p = P[P.length - 1]; P.push([p[0] + L[k] * Math.cos(rumbo * RAD), p[1] + L[k] * Math.sin(rumbo * RAD)]); rumbo += 180 - angs[(k + 1) % n]; }
    // Faltan dos lados: con rumbo actual (del vértice n−2 al n−1) y el último (rumbo + 180 − a_{n−1}) hasta A.
    const p = P[P.length - 1], r1 = rumbo, r2 = rumbo + 180 - angs[n - 1];
    const u = [Math.cos(r1 * RAD), Math.sin(r1 * RAD)], v = [Math.cos(r2 * RAD), Math.sin(r2 * RAD)], w = [-p[0], -p[1]], det = u[0] * v[1] - u[1] * v[0];
    if (Math.abs(det) < 1e-9) return null;
    const s = (w[0] * v[1] - w[1] * v[0]) / det, t = (u[0] * w[1] - u[1] * w[0]) / det;
    if (!(s > 0.3 && t > 0.3)) return null;
    P.push([p[0] + u[0] * s, p[1] + u[1] * s]);
    return P;
  }

  // Datos (una línea cada uno; herramientas, no el paso hecho).
  const D_S = 'Los ángulos interiores de un polígono convexo de n lados suman S = (n − 2) · 180°.';
  const D_TRIS = 'Desde un vértice, las diagonales parten un polígono convexo de n lados en n − 2 triángulos.';
  const D_TRI = 'En todo triángulo, los tres ángulos interiores suman 180°.';
  const D_CUAD = 'Los ángulos interiores de un cuadrilátero convexo suman 360°.';
  const D_BIS = 'Bisectriz de un ángulo: la recta que lo parte en dos ángulos iguales.';

  // ======================= Idea 1: suma de ángulos interiores =======================
  // Objeto de la primera pantalla: el terreno de don Julián visto desde arriba (geo-objeto, parcela «terreno»; dibujo de
  // prueba), con una estaca en cada esquina y cordeles desde la estaca A.
  // Cambia: el número de esquinas n. · Permanece: los cordeles salen de A. · Progresa: las parcelas (n − 2) y la suma.
  // · Se reserva: partir desde una estaca de adentro (la predicción) · Debe verse: cada parcela aporta 180°.
  const VT = { x: [-4.3, 4.3], y: [-4.1, 4.1] };
  // Los triángulos (parcelas) desde A, alternando el relleno para que se cuenten.
  // (Sesión, 19 nov: dos tonos bien distintos, para contar las parcelas.)
  const parcelas = (ids, desde = 0, hasta) => ids.slice(1, -1).map((id, k) => Object.assign({ puntos: [ids[0], id, ids[k + 2]], opacidad: k % 2 ? 0.22 : 0.04, desde }, hasta !== undefined ? { hasta } : {}));
  // El número de cada parcela, chico, en su centro (solo en el juego: ahí se cuentan).
  const numeros = (ids, P) => ids.slice(1, -1).map((id, k) => { const a = P[0], b = P[k + 1], c = P[k + 2]; return { x: (a[0] + b[0] + c[0]) / 3, y: (a[1] + b[1] + c[1]) / 3, texto: String(k + 1) }; });
  function figTerreno(n, o = {}) {
    const ids = LETRAS.slice(0, n).split(''), P = irregular(n);
    const ang = Object.fromEntries(ids.map(id => [id, { color: 'h', radio: n >= 8 ? 11 : 13 }]));
    // Los cordeles van con trazo fino continuo: salen justo de la estaca A (punteados, el primer tramo quedaba en blanco).
    const diag = o.cordeles === false ? [] : ids.slice(2, -1).map(id => ['A', id, { grosor: 'fino' }]);
    const F = figura([poli(ids.join(''), P, { ang: o.arcos === false ? {} : ang, diag })], {
      vista: VT, alto: 250, regiones: o.cordeles === false ? [] : parcelas(ids),
      obj: { objeto: 'parcela', tipo: 'terreno', borde: ids, estacas: ids },
      rotulos: o.numeros ? numeros(ids, P) : undefined,
      alt: o.alt || `El terreno de don Julián, de ${n} lados, visto desde arriba: una estaca en cada esquina y ${n - 3 === 1 ? 'un cordel' : `${n - 3} cordeles`} desde la estaca A, que lo reparten en ${n - 2} parcela${n - 2 === 1 ? '' : 's'} triangular${n - 2 === 1 ? '' : 'es'}.`,
    });
    return F;
  }
  // El terreno de 5 lados de doña Rosa, partido desde una estaca O de adentro (Predice y Mira). Cortes: 0, los cordeles
  // desde O; 1, los ángulos alrededor de O; 2, los cordeles desde O se van y llegan los de A.
  function figRosa() {
    const ids = 'ABCDE'.split(''), P = irregular(5), O = [0.25, -0.15];
    const ang = Object.fromEntries(ids.map(id => [id, { color: 'h', radio: 13 }]));
    const p = poli('ABCDE', P, { ang, pts: [{ id: 'O', x: O[0], y: O[1], rotulo: 'O', lado: 90, lejos: 6, hasta: 1 }],
      diag: ids.map(id => ['O', id, { grosor: 'fino', hasta: 1 }]).concat([['A', 'C', { grosor: 'fino', desde: 2 }], ['A', 'D', { grosor: 'fino', desde: 2 }]]),
      angs: ids.map((id, k) => ({ en: 'O', de: id, a: ids[(k + 1) % 5], radio: 9, desde: 1, hasta: 1 })) });
    const reg = ids.map((id, k) => ({ puntos: ['O', id, ids[(k + 1) % 5]], opacidad: k % 2 ? 0.22 : 0.04, hasta: 1 })).concat(parcelas(ids, 2));
    return figura([p], { vista: VT, alto: 250, regiones: reg, obj: { objeto: 'parcela', tipo: 'terreno', borde: ids, estacas: ids.concat(['O']) },
      alt: 'El terreno de doña Rosa, de 5 lados: una estaca O adentro y un cordel de O a cada esquina, que lo parten en 5 parcelas triangulares.' });
  }
  const ROSA = figRosa();

  // Figura de examen de un polígono con sus ángulos (sin escala si se pide un ángulo). angs: los rótulos por vértice
  // ({ A: '100°', E: '?' }); los dados en carmín, lo pedido en tinta.
  function figAngulos(n, rot, o = {}) {
    const ids = LETRAS.slice(0, n).split('');
    // (Con 6 o más vértices se ensancha: a 390 px, los seis rótulos de adentro quedaban pegados.)
    const k = o.estira || (n >= 6 ? [1.5, 1.3] : [1, 1]);
    const P = o.P || irregular(n, 3, o.gira === undefined ? 235 : o.gira).map(p => [p[0] * k[0], p[1] * k[1]]);
    const ang = {};
    for (const [v, t] of Object.entries(rot)) ang[v] = t === '?' || /^x/.test(t) && o.xTinta ? { texto: t, radio: 16 } : { texto: t, color: 'h', radio: 16 };
    return figura([poli(ids.join(''), P, { ang, diag: o.diag, lados: o.lados })], Object.assign({ alto: o.alto || (n >= 6 ? 262 : 240) }, o.sinEscala ? { sinEscala: true } : {}, { alt: o.alt }));
  }

  // Los 15 ejemplos (cuentas rehechas aparte en el scratchpad: cuentas.py, idea 1): 720°; 360°; 10 triángulos; 3240°;
  // 9 lados; 9 lados (1260°); 120° (540 − 420); x = 36, 144°; 125° (900 − 650 = 250, entre dos); 110° (x = 50); 15 lados
  // (2340°); 6 lados (1980° entre los dos, con 3 de diferencia); 80° ((70 + 90) ÷ 2); 150° (k = 30); 2160° (14 lados).
  // La figura muestra el planteamiento: lo pedido con «?» en tinta; si se pide un ángulo, sin escala.
  const EJ1 = [];
  EJ1.push({ nivel: 1, titulo: 'Un terreno de seis lados',
    figura: fig(figTerreno(6, { cordeles: false, alt: 'Un terreno de 6 lados con su estaca en cada esquina y sus seis ángulos interiores marcados con un arco.' })),
    enunciado: 'Don Julián compró un terreno de 6 lados rectos, sin entrantes. ¿Cuánto suman los ángulos de sus seis esquinas, por dentro?',
    datos: [D_S],
    solucion: [{ texto: ['El terreno es un polígono convexo de ', nO(6), ' lados:'], ecuacion: junto(['S = (', nO(6), ' − 2) · 180° = 4 · 180° = ', dF('720°')]) }],
    respuesta: [dF('720°')] });
  EJ1.push({ nivel: 1, titulo: 'Las cuatro esquinas',
    figura: fig(figAngulos(4, {}, { P: [[0, 0], [5.2, 0.3], [4.6, 3.4], [0.6, 2.8]], alt: 'Un cuadrilátero ABCD con sus cuatro ángulos interiores marcados con un arco.' })),
    enunciado: 'Una loseta tiene la forma del cuadrilátero convexo ABCD. ¿Cuánto suman sus cuatro ángulos interiores?',
    datos: [D_S],
    solucion: [{ texto: ['Un cuadrilátero tiene ', nO(4), ' lados: la diagonal AC lo parte en 2 triángulos.'], ecuacion: junto(['S = (', nO(4), ' − 2) · 180° = ', dF('360°')]) }],
    respuesta: [dF('360°')] });
  EJ1.push({ nivel: 1, titulo: '¿Cuántas parcelas salen?',
    enunciado: 'Un terreno convexo tiene 12 esquinas. Desde una de ellas se tienden cordeles a todas las esquinas que no están junto a ella. ¿En cuántos triángulos queda partido?',
    datos: [D_TRIS],
    solucion: [{ texto: ['Desde un vértice salen triángulos: ', nO(12), ' − 2.'], ecuacion: junto([nO(12), ' − 2 = ', dF('10')]) }],
    respuesta: [dF('10 triángulos')] });
  EJ1.push({ nivel: 1, titulo: 'Un polígono de veinte lados',
    enunciado: 'Un polígono convexo tiene 20 lados. ¿Cuánto suman sus ángulos interiores?',
    datos: [D_S],
    solucion: [{ texto: ['Se reemplaza n = ', nO(20), ':'], ecuacion: junto(['S = (', nO(20), ' − 2) · 180° = 18 · 180° = ', dF('3 240°')]) }],
    respuesta: [dF('3 240°')] });
  EJ1.push({ nivel: 1, titulo: 'De los triángulos a los lados',
    enunciado: 'Desde un vértice de un polígono convexo, las diagonales lo parten en 7 triángulos. ¿Cuántos lados tiene el polígono?',
    datos: [D_TRIS],
    solucion: [{ texto: 'Los triángulos son dos menos que los lados. Al revés, los lados son dos más que los triángulos:', ecuacion: junto(['n − 2 = 7', '   →   ', 'n = ', dF('9')]) }],
    respuesta: [dF('9 lados')] });

  EJ1.push({ nivel: 2, titulo: 'Lados desde la suma',
    enunciado: 'Los ángulos interiores de un polígono convexo suman 1 260°. ¿Cuántos lados tiene?',
    datos: [D_S],
    solucion: [{ texto: 'Se iguala la fórmula a la suma dada:', ecuacion: junto('(n − 2) · 180° = 1 260°') },
      { texto: 'Se divide entre 180° y se suman 2:', ecuacion: junto(['n − 2 = 7', '   →   ', 'n = ', dF('9')]) }],
    respuesta: [dF('9 lados')] });
  EJ1.push({ nivel: 2, titulo: 'El ángulo que falta',
    figura: fig(figAngulos(5, { A: '100°', B: '105°', C: '120°', D: '95°', E: '?' }, { sinEscala: true, alt: 'Un pentágono ABCDE con 100° en A, 105° en B, 120° en C y 95° en D; el ángulo en E, con signo de pregunta.' })),
    enunciado: `En el pentágono convexo ABCDE, m∠A = 100°, m∠B = 105°, m∠C = 120° y m∠D = 95°. ¿Cuánto mide m∠E?${NO_ESC}`,
    datos: [D_S],
    solucion: [{ texto: ['Los cinco ángulos suman (', nO(5), ' − 2) · 180° = 540°.'] },
      { texto: 'Lo que falta es la suma menos los cuatro conocidos:', ecuacion: junto(['m∠E = 540° − (100° + 105° + 120° + 95°) = 540° − 420° = ', dF('120°')]) }],
    respuesta: [junto('m∠E = '), dF('120°')] });
  EJ1.push({ nivel: 2, titulo: 'Cuatro ángulos en razón',
    figura: fig(figAngulos(4, { A: 'x', B: '2x', C: '3x', D: '4x' }, { P: [[0, 0], [5, 0], [4.4, 3.2], [1.6, 3.6]], sinEscala: true, alt: 'Un cuadrilátero ABCD con sus ángulos rotulados x, 2x, 3x y 4x.' })),
    enunciado: `En el cuadrilátero convexo ABCD, m∠A = x, m∠B = 2x, m∠C = 3x y m∠D = 4x. ¿Cuánto mide el mayor de sus ángulos?${NO_ESC}`,
    datos: [D_CUAD],
    solucion: [{ texto: 'Los cuatro suman 360°:', ecuacion: junto(['x + 2x + 3x + 4x = 360°', '   →   ', '10x = 360°', '   →   ', 'x = 36']) },
      { texto: 'El mayor es m∠D = 4x:', ecuacion: junto(['4 · 36° = ', dF('144°')]) }],
    respuesta: [junto('m∠D = '), dF('144°')] });
  EJ1.push({ nivel: 2, titulo: 'Dos esquinas iguales',
    enunciado: 'Un terreno convexo de 7 lados tiene cinco esquinas de 130° cada una. Las otras dos miden igual. ¿Cuánto mide cada una de esas dos?',
    datos: [D_S],
    solucion: [{ texto: ['Las siete esquinas suman (', nO(7), ' − 2) · 180° = 900°; las cinco iguales, 5 · 130° = 650°.'] },
      { texto: 'Lo que queda se reparte entre las dos:', ecuacion: junto(['(900° − 650°) ÷ 2 = 250° ÷ 2 = ', dF('125°')]) }],
    respuesta: [dF('125°'), ' cada una'] });
  EJ1.push({ nivel: 2, titulo: 'Un cuadrilátero con x',
    figura: fig(figAngulos(4, { A: '80°', B: '100°', C: '2x + 10°', D: 'x + 20°' }, { P: [[0, 0], [5.4, 0], [4.9, 3.4], [0.8, 3.0]], sinEscala: true, alt: 'Un cuadrilátero ABCD con 80° en A, 100° en B, 2x + 10° en C y x + 20° en D.' })),
    enunciado: `En el cuadrilátero convexo ABCD, m∠A = 80°, m∠B = 100°, m∠C = 2x + 10° y m∠D = x + 20°. ¿Cuánto mide m∠C?${NO_ESC}`,
    datos: [D_CUAD],
    solucion: [{ texto: 'Los cuatro suman 360°:', ecuacion: junto(['80° + 100° + (2x + 10°) + (x + 20°) = 360°', '   →   ', '3x + 210° = 360°', '   →   ', 'x = 50']) },
      { texto: 'Se reemplaza x en m∠C:', ecuacion: junto(['m∠C = 2 · 50° + 10° = ', dF('110°')]) }],
    respuesta: [junto('m∠C = '), dF('110°')] });

  // Nivel 3 (examen): cinco alternativas; la correcta va en distintas letras (B, D, A, E, C) y cada incorrecta se explica
  // por su valor (donde hay puntos A, B, C, nunca por su letra).
  EJ1.push({ nivel: 3, titulo: 'La suma de un examen',
    enunciado: 'Los ángulos interiores de un polígono convexo suman 2 340°. ¿Cuántos lados tiene el polígono?',
    alternativas: ['13', '15', '17', '11', '14'],
    datos: [D_S],
    fuente: 'Modelo de San Marcos 2023-I (pregunta 35), con otros números.',
    solucion: [{ texto: 'Se iguala la fórmula a la suma:', ecuacion: junto(['(n − 2) · 180° = 2 340°', '   →   ', 'n − 2 = 13', '   →   ', 'n = ', dF('15')]) },
      { texto: '13 es el número de triángulos (n − 2), no el de lados; 17 suma 4 en vez de 2; 14 suma solo 1.' },
      { texto: '11 resta 2 en vez de sumarlos: 13 − 2.' }],
    respuesta: [dF('15 lados')] });
  EJ1.push({ nivel: 3, titulo: 'Dos polígonos',
    enunciado: 'Un polígono convexo tiene 3 lados más que otro. Entre los dos, sus ángulos interiores suman 1 980°. ¿Cuántos lados tiene el polígono menor?',
    alternativas: ['9', '5', '4', '6', '11'],
    datos: [D_S],
    solucion: [{ texto: ['Si el menor tiene n lados, el otro tiene n + 3:'], ecuacion: junto(['(n − 2) · 180° + (n + 1) · 180° = 1 980°']) },
      { texto: 'Se divide entre 180°:', ecuacion: junto(['2n − 1 = 11', '   →   ', 'n = ', dF('6')]) },
      { texto: '9 es el mayor (6 + 3). 4 sale de usar n · 180° en cada uno; 5, de usar (n − 1) · 180°; 11 es 1 980° ÷ 180°.' }],
    respuesta: [dF('6 lados')] });
  EJ1.push({ nivel: 3, titulo: 'Bisectrices en un cuadrilátero',
    figura: fig(figBisec(70, 90, { alt: 'Un cuadrilátero ABCD con 70° en A y 90° en B; las bisectrices de los ángulos C y D se cortan en E, y el ángulo CED lleva signo de pregunta.' })),
    enunciado: `En el cuadrilátero convexo ABCD, m∠A = 70° y m∠B = 90°. Las bisectrices de los ángulos C y D se cortan en E. ¿Cuánto mide m∠CED?${NO_ESC}`,
    alternativas: ['80°', '160°', '100°', '40°', '200°'],
    datos: [D_CUAD, D_TRI, D_BIS],
    fuente: 'Modelo de San Marcos 2025-I (pregunta 35).',
    solucion: [{ texto: 'C y D suman lo que falta para 360°:', ecuacion: junto('m∠C + m∠D = 360° − 70° − 90° = 200°') },
      { texto: 'En el triángulo CED están las mitades de C y de D:', ecuacion: junto(['m∠CED = 180° − 200° ÷ 2 = 180° − 100° = ', dF('80°')]) },
      { texto: '100° es la suma de las dos mitades; 200°, la de C y D enteros; 160°, la de A y B sin partir; 40°, la mitad de 80°.' }],
    respuesta: [junto('m∠CED = '), dF('80°')] });
  EJ1.push({ nivel: 3, titulo: 'Ángulos en razón',
    figura: fig(figAngulos(5, { A: '3k', B: '4k', C: '4k', D: '5k', E: '2k' }, { sinEscala: true, alt: 'Un pentágono ABCDE con sus ángulos rotulados 3k, 4k, 4k, 5k y 2k.' })),
    enunciado: `Los ángulos de un pentágono convexo ABCDE están en la razón 3 : 4 : 4 : 5 : 2, en ese orden. ¿Cuánto mide el mayor?${NO_ESC}`,
    alternativas: ['100°', '60°', '30°', '120°', '150°'],
    datos: [D_S, 'En la razón 3 : 4 : 4 : 5 : 2, los ángulos miden 3k, 4k, 4k, 5k y 2k.'],
    solucion: [{ texto: ['Suman (', nO(5), ' − 2) · 180° = 540°:'], ecuacion: junto(['3k + 4k + 4k + 5k + 2k = 18k = 540°', '   →   ', 'k = 30']) },
      { texto: 'El mayor es 5k:', ecuacion: junto(['5 · 30° = ', dF('150°')]) },
      { texto: '30° es k; 60°, el menor (2k); 120°, uno de 4k; 100° sale de repartir 360° como si fuera un cuadrilátero (20°).' }],
    respuesta: [dF('150°')] });
  EJ1.push({ nivel: 3, titulo: 'El doble de lados',
    enunciado: 'Si un polígono convexo tuviera el doble de lados, desde uno de sus vértices saldrían 14 triángulos más. ¿Cuánto suman sus ángulos interiores?',
    alternativas: ['2 520°', '4 680°', '2 160°', '2 880°', '2 340°'],
    datos: [D_TRIS, D_S],
    solucion: [{ texto: 'Con 2n lados salen 2n − 2 triángulos; la diferencia es n:', ecuacion: junto(['(2n − 2) − (n − 2) = n = 14']) },
      { texto: 'Se reemplaza n = 14 en la suma:', ecuacion: junto(['S = (14 − 2) · 180° = 12 · 180° = ', dF('2 160°')]) },
      { texto: '2 520° es 14 · 180° (sin restar 2); 2 880° es la suma con 18 lados; 4 680°, la del doble (28 lados); 2 340°, la de 15.' }],
    respuesta: [dF('2 160°')] });

  // Las bisectrices de C y D en un cuadrilátero de ángulos a (en A) y b (en B); el resto sale de una forma fija.
  // Sin escala: el ángulo CED pedido se dibuja lejos de su valor.
  function figBisec(a, b, o = {}) {
    // Sin escala: de dos formas, la que dibuja m∠CED más lejos de su valor, (a + b) ÷ 2.
    const FORMAS = [[[0, 0], [6, 0], [5.2, 4.2], [0.9, 3.4]], [[0, 0], [6, 0], [6.6, 3.8], [-0.8, 3.6]]];
    const ced = Q => { const A1 = U.angulo(Q[0], Q[1], Q[3]), B1 = U.angulo(Q[1], Q[2], Q[0]); return (A1 + B1) / 2; };
    const P = FORMAS.slice().sort((p, q) => Math.abs(ced(q) - (a + b) / 2) - Math.abs(ced(p) - (a + b) / 2))[0];
    const ids = ['A', 'B', 'C', 'D'], pos = { A: P[0], B: P[1], C: P[2], D: P[3] };
    const bis = (v, p, q) => { const u1 = U.mezcla(pos[v], pos[p], 1 / U.dist(pos[v], pos[p])), u2 = U.mezcla(pos[v], pos[q], 1 / U.dist(pos[v], pos[q])); return [(u1[0] + u2[0]) / 2 - pos[v][0], (u1[1] + u2[1]) / 2 - pos[v][1]]; };
    const dC = bis('C', 'B', 'D'), dD = bis('D', 'C', 'A'), E = U.corte(pos.C, [pos.C[0] + dC[0], pos.C[1] + dC[1]], pos.D, [pos.D[0] + dD[0], pos.D[1] + dD[1]]);
    void ids;
    return figura([poli('ABCD', P, { ang: { A: { texto: `${a}°`, color: 'h' }, B: { texto: `${b}°`, color: 'h' } },
      pts: [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', lado: 270 }],
      segs: [{ de: 'C', a: 'E', discontinua: true, grosor: 'fino' }, { de: 'D', a: 'E', discontinua: true, grosor: 'fino' }],
      angs: [{ en: 'E', de: 'C', a: 'D', texto: '?', radio: 14 }, { en: 'C', de: 'B', a: 'E', color: 'h', marcas: 1, radio: 14 }, { en: 'C', de: 'E', a: 'D', color: 'h', marcas: 1, radio: 14 },
        { en: 'D', de: 'C', a: 'E', color: 'h', marcas: 2, radio: 14 }, { en: 'D', de: 'E', a: 'A', color: 'h', marcas: 2, radio: 14 }] })],
    { alto: 240, sinEscala: true, alt: o.alt });
  }

  // «Ahora tú» de la idea 1. Tipos: la suma desde n; los lados desde la suma (San Marcos 2023-I); el ángulo que falta;
  // las bisectrices de C y D en un cuadrilátero (San Marcos 2025-I); dos polígonos con lados de diferencia.
  const OPS = (r, l) => r.baraja(l);
  // «n + 3», «n − 1» o «n» (sin «+ 0» ni «+ −1»).
  const mas = (a, c) => (c === 0 ? a : `${a} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`);
  function casoSuma(r) {
    const n = r.de([5, 7, 8, 10, 11, 13, 14, 16, 18]);
    const S = (n - 2) * 180;
    return { pregunta: `Un polígono convexo tiene ${n} lados. ¿Cuánto suman sus ángulos interiores?`, datos: [D_S],
      opciones: opciones(S, OPS(r, [
        { id: 'n180', valor: n * 180, error: 'GE23', siFuera: `Multiplicar por 180° está bien; pero salen ${n} − 2 triángulos, no ${n}.` },
        { id: 'mas1', valor: (n - 1) * 180, error: 'GE-POL10', siFuera: `Contar triángulos está bien; desde un vértice salen ${n - 2}, no ${n - 1}.` },
        { id: 'diag', valor: (n - 3) * 180, error: 'GE-POL11', siFuera: `${n - 3} son los cordeles desde un vértice; los triángulos son uno más.` },
        { id: 'ext', valor: 360, error: 'GE-POL1', siFuera: '360° suman los ángulos de un cuadrilátero, de 4 lados; este tiene más.' }]), gr),
      solucion: { texto: ['Se reemplaza n = ', nO(n), ' en la suma:'], ecuacion: junto(['S = (', nO(n), ` − 2) · 180° = ${n - 2} · 180° = `, dF(gr(S))]) } };
  }
  function casoLados(r) {
    const n = r.de([7, 8, 10, 11, 12, 13, 14, 16, 17, 20]);
    const S = (n - 2) * 180, t = n - 2;
    return { pregunta: `Los ángulos interiores de un polígono convexo suman ${gr(S)}. ¿Cuántos lados tiene?`, datos: [D_S],
      opciones: opciones(n, OPS(r, [
        { id: 'tri', valor: t, error: 'GE-POL12', siFuera: `Dividir entre 180° está bien: da ${t}, los triángulos. Los lados son dos más.` },
        { id: 'resta', valor: t - 2, error: 'GE-POL13', siFuera: `Despejar está bien; el 2 que resta en n − 2 pasa sumando, no restando.` },
        { id: 'uno', valor: t + 1, error: 'GE-POL10', siFuera: `Dividir entre 180° está bien; falta sumar 2, no 1.` }]), x => `${f(x)}`),
      solucion: { texto: 'Se iguala la fórmula a la suma y se despeja:', ecuacion: junto([`(n − 2) · 180° = ${gr(S)}`, '   →   ', `n − 2 = ${t}`, '   →   ', 'n = ', dF(String(n))]) } };
  }
  function casoFalta(r) {
    for (let i = 0; i < 200; i++) {
      const n = r.de([5, 6]), S = (n - 2) * 180, base = S / n;
      const dados = Array.from({ length: n - 1 }, () => 5 * Math.round((base + r.ent(-25, 25)) / 5));
      const x = S - dados.reduce((a, b) => a + b, 0);
      if (x < 70 || x > 170 || dados.some(v => v >= 175)) continue;
      const ids = LETRAS.slice(0, n), pide = ids[n - 1];
      const rot = Object.fromEntries(dados.map((v, k) => [ids[k], gr(v)])); rot[pide] = '?';
      const F = figAngulos(n, rot, { sinEscala: true, alt: `Un polígono ${ids} con ${dados.map((v, k) => `${v}° en ${ids[k]}`).join(', ')}; el ángulo en ${pide}, con signo de pregunta.` });
      // (Sin escala: el ángulo pedido no se dibuja cerca de su valor.)
      const dib = F.figura.angulos.find(q => q.en === pide).mide;
      if (Math.abs(dib - x) < 8 || !cabe(F)) continue;
      const suma = dados.reduce((a, b) => a + b, 0), lista = dados.map((v, k) => `m∠${ids[k]} = ${v}°`);
      return { pregunta: `En el polígono convexo ${ids}, ${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}. ¿Cuánto mide m∠${pide}?${NO_ESC}`,
        datos: [D_S], dibujo: fig(F),
        opciones: opciones(x, OPS(r, [
          { id: 'mas1', valor: (n - 1) * 180 - suma, error: 'GE-POL10', siFuera: `Restar los conocidos está bien; pero la suma es ${gr(S)}, no ${gr((n - 1) * 180)}.` },
          { id: 'igual', valor: S / n, error: 'GE-POL8', siFuera: `Repartir ${gr(S)} entre ${n} sería si todos midieran igual; aquí son distintos.` },
          { id: 'n180', valor: n * 180 - suma, error: 'GE23', siFuera: `Restar está bien; pero la suma es (${n} − 2) · 180°, no ${n} · 180°.` }]), gr),
        solucion: { texto: [`La suma es (${n} − 2) · 180° = ${gr(S)}; se restan los conocidos:`], ecuacion: junto([`m∠${pide} = ${gr(S)} − ${gr(suma)} = `, dF(gr(x))]) } };
    }
    throw new Error('casoFalta sin caso');
  }
  function casoBisec(r) {
    for (let i = 0; i < 200; i++) {
      const a = 5 * r.ent(12, 22), b = 5 * r.ent(12, 22);
      if ((a + b) % 2 || a === b || a + b > 230 || a + b < 120) continue;
      const x = (a + b) / 2, F = figBisec(a, b, { alt: `Un cuadrilátero ABCD con ${a}° en A y ${b}° en B; las bisectrices de los ángulos C y D se cortan en E, y el ángulo CED lleva signo de pregunta.` });
      if (!cabe(F)) continue;
      return { pregunta: `En el cuadrilátero convexo ABCD, m∠A = ${a}° y m∠B = ${b}°. Las bisectrices de los ángulos C y D se cortan en E. ¿Cuánto mide m∠CED?${NO_ESC}`,
        datos: [D_CUAD, D_TRI, D_BIS], dibujo: fig(F),
        opciones: opciones(x, OPS(r, [
          { id: 'sinpartir', valor: a + b, error: 'GE-POL14', siFuera: `Usar A y B está bien; el ángulo en E es la mitad de su suma.` },
          { id: 'mitades', valor: 180 - x, error: 'GE-POL15', siFuera: `${gr(180 - x)} suman las mitades de C y D; m∠CED es lo que les falta para 180°.` },
          { id: 'cd', valor: 360 - a - b, error: 'GE-POL15', siFuera: `${gr(360 - a - b)} suman C y D enteros; en E entran sus mitades.` }]), gr),
        solucion: { texto: `C y D suman ${gr(360 - a - b)}; sus mitades, ${gr(180 - x)}. En el triángulo CED:`, ecuacion: junto(['m∠CED = 180° − ', gr(180 - x), ' = ', dF(gr(x))]) } };
    }
    throw new Error('casoBisec sin caso');
  }
  function casoDos(r) {
    for (let i = 0; i < 200; i++) {
      const n = r.ent(4, 12), k = r.ent(1, 4), T = 180 * (2 * n + k - 4);
      if (n === 6 && k === 3) continue;   // el del ejemplo «Dos polígonos»
      // Lo que sale con cada error (en lados del menor): sin restar 2 (n · 180°) y con (n − 1) · 180°.
      const conN = (T / 180 - k) / 2, conN1 = (T / 180 - k + 2) / 2;
      return { pregunta: `Un polígono convexo tiene ${k} lado${k > 1 ? 's' : ''} más que otro. Entre los dos, sus ángulos interiores suman ${gr(T)}. ¿Cuántos lados tiene el polígono menor?`,
        datos: [D_S],
        opciones: opciones(n, OPS(r, [
          { id: 'mayor', valor: n + k, error: 'GE-POL16', siFuera: `Plantear con n y n + ${k} está bien; ${n + k} son los lados del mayor.` },
          { id: 'sin2', valor: conN, entero: true, error: 'GE23', siFuera: 'Plantear la suma de los dos está bien; cada uno suma (n − 2) · 180°, no n · 180°.' },
          { id: 'n1', valor: conN1, entero: true, error: 'GE-POL10', siFuera: 'Plantear la suma de los dos está bien; cada uno suma (n − 2) · 180°, no (n − 1) · 180°.' },
          { id: 'total', valor: T / 180, entero: true, error: 'GE-POL12', siFuera: `Dividir entre 180° está bien; da ${f(T / 180)}, los triángulos de los dos juntos.` }]), x => `${f(x)}`),
        solucion: { texto: `Con n lados el menor y n + ${k} el mayor:`, ecuacion: junto([`(n − 2) · 180° + (${mas('n', k - 2)}) · 180° = ${gr(T)}`, '   →   ', `${mas('2n', k - 4)} = ${2 * n + k - 4}`, '   →   ', 'n = ', dF(String(n))]) } };
    }
    throw new Error('casoDos sin caso');
  }

  const sumaIdea = {
    id: 'suma-de-angulos',
    titulo: 'Suma de ángulos interiores',
    pregunta: '¿Cuánto suman los ángulos de adentro de un terreno?',
    temas: ['Suma de ángulos internos y externos'],
    pieza: GO,
    aprendizaje: 'Desde un vértice, las diagonales parten un polígono de n lados en n − 2 triángulos: sus ángulos interiores suman (n − 2) · 180°.',
    actividad: 'Agregar esquinas a un terreno y contar las parcelas que dejan los cordeles.',
    // Lee: polígono, convexo, n y la suma del triángulo. No dice cuánto suman los ángulos de un polígono (la regla) ni
    // qué pasa si se parte desde una estaca de adentro (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un terreno de lados rectos', texto: 'Visto desde arriba, el terreno de don Julián es un polígono: una figura cerrada de lados rectos. Tiene tantos lados como esquinas, o vértices; ese número se llama n. Sus esquinas no tienen entrantes: es convexo.',
          pieza: GO, dibujo: fig(figTerreno(5, { arcos: false, alt: 'El terreno de don Julián, de 5 lados, con una estaca en cada esquina y dos cordeles desde la estaca A.' })) },
        { titulo: 'Rincones de adentro', texto: 'En cada esquina hay un ángulo interior: el rincón de adentro, entre dos lados seguidos. En un triángulo, los tres ángulos interiores suman 180°, como se vio en Triángulos.' },
        { titulo: 'Cordeles desde una esquina', texto: 'Don Julián tiende un cordel de la estaca A a cada esquina que no queda junto a ella: cada cordel es una diagonal. Los cordeles reparten el terreno en parcelas triangulares, sin que se crucen.' },
        { titulo: 'Qué mirar al jugar', texto: ['Cambia el número de esquinas ', dO('n'), ' y cuenta las parcelas cada vez. Compara cuántas salen con ', dO('n'), '.'] },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'Don Julián reparte su terreno en parcelas triangulares con cordeles que salen de la estaca A.',
      mision: {
        texto: 'Agrega esquinas hasta que los cordeles dejen 6 parcelas.',
        logrado: v => v.n === 8,
        bien: 'Con 8 esquinas, 6 parcelas: 6 · 180° en total.',
      },
      voz: 'Una esquina más, ¿cuántas parcelas más?',
      leyenda: [
        { s: dO('n'), t: 'el número de lados, o de esquinas' },
        { s: 'A', t: 'la estaca de donde salen los cordeles' },
        { s: 'línea fina', t: 'un cordel: una diagonal' },
        { s: 'parcela', t: 'cada triángulo del terreno' },
        { s: dH('arco'), t: 'un ángulo interior' },
      ],
      controles: [{ id: 'n', etiqueta: 'n, el número de lados', min: 3, max: 10, paso: 1, inicio: 5, unidad: 'lados', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: figTerreno(v.n, { numeros: true }), estado: {} }),
      // La relación entera: cuántas parcelas salen con n esquinas y cuánto suman sus ángulos.
      lectura: v => [dO(junto(`n = ${v.n}`)), junto(`: ${v.n - 2} parcela${v.n - 2 === 1 ? '' : 's'}; ${v.n - 2} · 180° = ${gr((v.n - 2) * 180)}`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Doña Rosa reparte otro terreno de 5 lados de otra manera: clava una estaca O adentro y tiende un cordel de O a cada esquina. Salen 5 parcelas. ¿Cuánto suman los 5 ángulos interiores del terreno?',
      datos: ['En cada triángulo, los tres ángulos suman 180°.', 'Los ángulos que se juntan alrededor de O forman una vuelta: 360°.'],
      voz: 'Ojo con los ángulos que quedan en O.',
      opciones: [
        { id: 'c', texto: '540°', correcta: true },
        { id: 'cinco', texto: '900°', error: 'GE-POL6', siFuera: '5 · 180° suma todo lo de las parcelas; pero los ángulos en O no son del terreno.' },
        { id: 'seis', texto: '720°', error: 'GE23', siFuera: '720° serían 4 triángulos enteros; aquí hay 5 y sobra la vuelta de O.' },
        { id: 'depende', texto: 'Depende de dónde quede O', error: 'GE-POL7', siFuera: 'Las parcelas cambian con O, es cierto; pero lo que se resta siempre es una vuelta.' },
      ],
      dibujo: fig(ROSA, { corte: 0 }),
      revelar: fig(ROSA, { corte: 1 }),
      coincide: 'Coincide: 5 · 180° = 900°, menos la vuelta de O, 360°: quedan 540° para el terreno.',
      noCoincide: 'Revisemos: las 5 parcelas suman 900°, pero los ángulos en O dan una vuelta, 360°, y no son del terreno.',
    },
    mira: {
      pieza: GO,
      datos: ROSA,
      voz: 'Paso a paso: ¿qué ángulos son del terreno y cuáles no?',
      pasos: [
        { estado: { corte: 0 }, texto: 'Cinco parcelas desde O: sus ángulos suman 5 · 180°.', ecuacion: junto([nO(5), ' · 180° = 900°']) },
        { estado: { corte: 1 }, texto: 'Los ángulos alrededor de O no son del terreno: forman una vuelta.', ecuacion: junto('900° − 360° = 540°') },
        { estado: { corte: 2 }, texto: 'Desde la esquina A salen dos cordeles y tres parcelas: la misma suma.', ecuacion: junto(['(', nO(5), ' − 2) · 180° = 540°']) },
        { estado: { corte: 3 }, texto: ['Con ', dO('n'), ' lados: ', dO('n'), ' parcelas desde O, menos una vuelta.'], ecuacion: junto([dO('n'), ' · 180° − 360° = (', dO('n'), ' − 2) · 180°']) },
      ],
    },
    regla: {
      texto: 'Desde un vértice, las diagonales parten un polígono de n lados en n − 2 triángulos. Por eso sus ángulos interiores suman (n − 2) · 180°; en un cuadrilátero, 360°.',
      ecuacion: junto([dF('S'), ' = (', dO('n'), ' − 2) · 180°']),
      condicion: 'el polígono es convexo (sin entrantes) y n es su número de lados, que es también el de vértices.',
      voz: 'Cuenta los lados y quita dos: esos son los triángulos.',
    },
    // Así se resuelve: el ángulo que falta en un hexágono con dos iguales, o el número de lados desde la suma (con otras
    // listas que «Ahora tú»).
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          for (let i = 0; ; i++) {
            const dados = Array.from({ length: 4 }, () => 5 * r.ent(22, 30)), suma = dados.reduce((a, b) => a + b, 0), resto = 720 - suma;
            if ((resto % 2 || resto / 2 < 80 || resto / 2 > 170) && i < 300) continue;
            const x = resto / 2, lista = dados.map((v, k) => `m∠${'ABCD'[k]} = ${v}°`);
            const F = figAngulos(6, { A: gr(dados[0]), B: gr(dados[1]), C: gr(dados[2]), D: gr(dados[3]), E: 'x', F: 'x' }, { sinEscala: true, xTinta: true, alt: `Un hexágono ABCDEF con ${dados.map((v, k) => `${v}° en ${'ABCD'[k]}`).join(', ')}; los ángulos en E y en F, iguales, rotulados x.` });
            if (!cabe(F) && i < 300) continue;
            return {
              enunciado: `En el hexágono convexo ABCDEF, ${lista.join(', ')}; los ángulos E y F miden igual. ¿Cuánto mide cada uno?${NO_ESC}`,
              datos: [D_S],
              dibujo: fig(F),
              pasos: [
                { tipo: 'pide', texto: 'Piden lo que mide cada uno de los dos ángulos iguales, E y F.' },
                { tipo: 'datos', texto: `Cuatro ángulos conocidos, que suman ${gr(suma)}, y dos iguales que llamo x.` },
                { tipo: 'regla', texto: 'Un hexágono tiene 6 lados: sus ángulos interiores suman (6 − 2) · 180°.', ecuacion: junto(['S = (', nO(6), ' − 2) · 180° = 720°']) },
                { tipo: 'cuentas', texto: 'Lo que queda después de los cuatro conocidos se reparte entre los dos iguales.', ecuacion: junto([`2x = 720° − ${gr(suma)} = ${gr(resto)}`, '   →   ', 'x = ', dF(gr(x))]) },
                { tipo: 'sentido', texto: `Tiene sentido: ${gr(x)} es menos de 180°, como todo ángulo de un polígono convexo.` },
              ],
              respuesta: ['Cada uno mide ', dF(gr(x))],
            };
          }
        }
        const n = r.de([9, 12, 15, 18, 22]), S = (n - 2) * 180;
        return {
          enunciado: `Los ángulos interiores de un polígono convexo suman ${gr(S)}. ¿Cuántos lados tiene?`,
          datos: [D_S],
          pasos: [
            { tipo: 'pide', texto: 'Piden el número de lados, n.' },
            { tipo: 'datos', texto: `La suma de los ángulos interiores: ${gr(S)}.` },
            { tipo: 'regla', texto: 'La suma es (n − 2) · 180°: se iguala a la que dan.', ecuacion: junto(`(n − 2) · 180° = ${gr(S)}`) },
            { tipo: 'cuentas', texto: 'Se divide entre 180° y se pasan los 2 sumando.', ecuacion: junto([`n − 2 = ${n - 2}`, '   →   ', 'n = ', dF(String(n))]) },
            { tipo: 'sentido', texto: `Comprobación: (${n} − 2) · 180° = ${gr(S)}.` },
          ],
          respuesta: ['Tiene ', dF(`${n} lados`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Primero cuenta los triángulos: n − 2.',
      generar(s) { return conCuatro([casoSuma, casoLados, casoFalta, casoBisec, casoDos][s % 5], azar(s + 7), firmasDe(EJ1)); },
    },
  };

  // ======================= Idea 2: ángulos exteriores =======================
  // Objeto de la primera pantalla: una plaza de esquinas iguales y el mototaxi que la rodea (geo-objeto, parcela «plaza»;
  // dibujo de prueba). En cada esquina gira el ángulo exterior: el que forma la calle que toma con la prolongación de la
  // que traía (Triángulos).
  // Cambia: el número de esquinas n. · Permanece: las esquinas iguales. · Progresa: el giro baja y la esquina de adentro
  // crece. · Se reserva: la plaza de esquinas distintas (la predicción). · Debe verse: adentro + giro = 180°.
  const D_EXT = 'Los ángulos exteriores de un polígono convexo suman 360°, uno por vértice.';
  const D_CADA = 'En un polígono equiángulo de n lados, cada exterior mide 360° ÷ n.';
  const D_ADY = 'En cada vértice, el ángulo interior y el exterior forman 180°.';
  const D_EQUI = 'Polígono equiángulo: todos sus ángulos interiores miden igual.';
  // Un valor en grados: «= 72°» si es exacto, «≈ 51,4°» si no (los redondeos van con «≈»).
  const exacto = v => Math.abs(v - Math.round(v)) < 1e-9;
  const grA = v => (exacto(v) ? gr(v) : `≈ ${gr(v)}`);
  const VP = { x: [-4.7, 4.7], y: [-4.5, 4.5] };
  function figPlaza(n, o = {}) {
    const ids = LETRAS.slice(0, n).split(''), P = parejo(n), ext = 360 / n, int = 180 - ext;
    const ang = Object.fromEntries(ids.map(id => [id, { color: 'h', radio: n >= 8 ? 11 : 13 }]));
    if (o.valores !== false) ang.B = { color: 'h', radio: 14, texto: grA(int) };
    const F = figura([poli(ids.join(''), P, { ang, ext: { B: Object.assign({ color: 'i', radio: 16, largo: 0.6 }, o.valores !== false ? { texto: grA(ext) } : {}) } })], {
      vista: VP, alto: 262, obj: { objeto: 'parcela', tipo: 'plaza', borde: ids, mototaxi: { de: 'A', a: 'B', t: 0.4 } },
      alt: o.alt || `Una plaza de ${n} esquinas iguales vista desde arriba y un mototaxi en la calle AB, que va a doblar en B. Por dentro, cada esquina mide ${f(int)}°; al doblar gira ${f(ext)}°.` });
    return F;
  }
  // La plaza de doña Rosa: 5 esquinas distintas, con el giro en cada una (Predice y Mira). Sin escala: el giro que se pide
  // se dibuja lejos de su valor. Cortes: 0, cuatro giros y «?»; 1, el quinto con su valor.
  const GIROS_P = [60, 85, 70, 75], QUINTO = 360 - GIROS_P.reduce((a, b) => a + b, 0);
  function figPlazaRosa() {
    // (Sin escala: ensanchada, el giro en A se dibuja de unos 57°, lejos de su valor.)
    const ids = 'ABCDE'.split(''), P = irregular(5, 3, 250).map(p => [p[0] * 1.3, p[1]]);
    const ext = {};
    ['B', 'C', 'D', 'E'].forEach((v, k) => { ext[v] = { color: 'i', radio: 15, largo: 0.55, texto: gr(GIROS_P[k]) }; });
    ext.A = { radio: 15, largo: 0.55, texto: '?', hasta: 0 };
    const p = poli('ABCDE', P, { ext });
    p.angulos.push(Object.assign({}, p.angulos.find(a => a.en === 'A'), { texto: gr(QUINTO), color: 'i', desde: 1, hasta: undefined }));
    return figura([p], { vista: { x: [-4.9, 4.9], y: [-4.6, 4.6] }, alto: 262, sinEscala: true, obj: { objeto: 'parcela', tipo: 'plaza', borde: ids, mototaxi: { de: 'D', a: 'E', t: 0.65 } },
      alt: 'Una plaza de 5 esquinas distintas y el mototaxi que la rodea. En B, C, D y E gira 60°, 85°, 70° y 75°; el giro en A lleva signo de pregunta.' });
  }
  const PLAZA_R = figPlazaRosa();
  // Un polígono con giros (exteriores) rotulados, para los ejercicios: sin escala.
  // o.resp: el valor del ángulo pedido; de unas formas estiradas se usa la que lo dibuja más lejos de ese valor.
  function figGiros(n, rot, o = {}) {
    const ids = LETRAS.slice(0, n).split(''), base = n >= 6 ? [1.4, 1.2] : [1, 1];
    const ext = {}, ang = {};
    for (const [v, t] of Object.entries(rot)) ext[v] = t === '?' ? { texto: '?', radio: 15, largo: 0.5 } : { texto: t, color: 'i', radio: 15, largo: 0.5 };
    for (const [v, t] of Object.entries(o.int || {})) ang[v] = t === '?' ? { texto: '?', radio: 15 } : { texto: t, color: 'h', radio: 15 };
    const arma = k => figura([poli(ids.join(''), irregular(n, 3, 245).map(p => [p[0] * base[0] * k[0], p[1] * base[1] * k[1]]), { ext, ang })], { alto: o.alto || 250, sinEscala: true, alt: o.alt, mx: 1.3 });
    if (o.resp === undefined) return arma([1, 1]);
    const lejos = F => { const q = F.figura.angulos.find(a => a.texto === '?'); return q ? Math.abs(q.mide - o.resp) : 0; };
    const todas = [[1, 1], [1.3, 1], [1, 1.3], [0.85, 1.15]].map(arma), caben = todas.filter(cabe);
    return (caben.length ? caben : todas).sort((x, y) => lejos(y) - lejos(x))[0];
  }
  // El hexágono equiángulo de San Marcos 2026-II: AB, BC, CD y EF dados; al prolongar AB, CD y EF sale un equilátero.
  // Sin escala: se dibuja con otros lados (que cierran con 120° en cada vértice) para que no se midan DE ni FA.
  function figHexEq(l, o = {}) {
    const dib = [3.5, 3, 2.5, 3, 3.5, 2], P = [[0, 0]];
    for (let k = 0; k < 5; k++) { const p = P[k]; P.push([p[0] + dib[k] * Math.cos(k * 60 * RAD), p[1] + dib[k] * Math.sin(k * 60 * RAD)]); }
    const T1 = U.corte(P[0], P[1], P[2], P[3]), T2 = U.corte(P[2], P[3], P[4], P[5]), T3 = U.corte(P[4], P[5], P[0], P[1]);
    // (BC lleva su medida por dentro: por fuera queda el triángulo de la esquina.)
    const lados = { AB: { texto: cm(l[0]), color: 'o' }, BC: Object.assign({ texto: cm(l[1]), color: 'i' }, o.prolonga === false ? {} : { ref: 'T1' }), CD: { texto: cm(l[2]), color: 'o', en: o.enCD === undefined ? 0.4 : o.enCD, dist: 8 }, EF: { texto: cm(l[3]), color: 'i' } };
    const pts = [{ id: 'T1', x: T1[0], y: T1[1], sinPunto: true }, { id: 'T2', x: T2[0], y: T2[1], sinPunto: true }, { id: 'T3', x: T3[0], y: T3[1], sinPunto: true }];
    const segs = o.prolonga === false ? [] : [['B', 'T1'], ['C', 'T1'], ['D', 'T2'], ['E', 'T2'], ['F', 'T3'], ['A', 'T3']].map(([a, b]) => ({ de: a, a: b, discontinua: true, grosor: 'fino' }));
    return figura([poli('ABCDEF', P, { lados, pts: o.prolonga === false ? [] : pts, segs })], { alto: 262, sinEscala: true, alt: o.alt || `Un hexágono ABCDEF de ángulos iguales con AB = ${cm(l[0])}, BC = ${cm(l[1])}, CD = ${cm(l[2])} y EF = ${cm(l[3])}; los lados AB, CD y EF se prolongan con líneas punteadas hasta formar un triángulo grande.` });
  }
  const D_EQL = 'Un triángulo con sus tres ángulos de 60° es equilátero: sus tres lados miden igual.';
  const D_PER = 'El perímetro de un polígono es la suma de todos sus lados.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 2): 45°; 80° (360 − 280); 50°; 18 lados; 360°; 150°
  // (12 lados); 9 lados (140°); 72° (x = 36, el exterior mayor 108°); 12 lados (i − e = 120°); 36° (10 lados); 17 cm
  // (hexágono: DE = 2, FA = 1); 10 lados (i = 4e); 9 lados (e = 2x, i = 7x); 120° (sexto giro 60°); 10 lados (exteriores
  // con 12° de diferencia).
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'La plaza de ocho esquinas',
    figura: fig(figPlaza(8, { valores: false, alt: 'Una plaza de 8 esquinas iguales y el mototaxi que la rodea; en la esquina B, el giro va marcado con un arco.' })),
    enunciado: 'Una plaza tiene 8 esquinas iguales, como la señal de «Pare». Un mototaxi la rodea. ¿Cuánto gira en cada esquina?',
    datos: [D_EXT, D_EQUI],
    solucion: [{ texto: 'Los 8 giros suman una vuelta y son iguales:', ecuacion: junto(['360° ÷ ', nO(8), ' = ', dF('45°')]) }],
    respuesta: [dF('45°'), ' en cada esquina'] });
  EJ2.push({ nivel: 1, titulo: 'El giro que falta',
    figura: fig(figGiros(5, { A: '80°', B: '65°', C: '75°', D: '60°', E: '?' }, { resp: 80, alt: 'Un pentágono con sus ángulos exteriores: 80° en A, 65° en B, 75° en C y 60° en D; el de E, con signo de pregunta.' })),
    enunciado: `Cuatro ángulos exteriores de un pentágono convexo miden 80°, 65°, 75° y 60°. ¿Cuánto mide el quinto?${NO_ESC}`,
    datos: [D_EXT],
    solucion: [{ texto: 'Los cinco suman 360°:', ecuacion: junto(['360° − (80° + 65° + 75° + 60°) = 360° − 280° = ', dF('80°')]) }],
    respuesta: [dF('80°')] });
  EJ2.push({ nivel: 1, titulo: 'Adentro y afuera',
    figura: fig(figGiros(5, { B: '?' }, { int: { B: '130°' }, resp: 50, alt: 'Un pentágono con 130° por dentro en el vértice B; el ángulo exterior de B, con signo de pregunta.' })),
    enunciado: `En el vértice B de un polígono convexo, el ángulo interior mide 130°. ¿Cuánto mide el ángulo exterior en B?${NO_ESC}`,
    datos: [D_ADY],
    solucion: [{ texto: 'Los dos forman 180°:', ecuacion: junto(['180° − 130° = ', dF('50°')]) }],
    respuesta: [dF('50°')] });
  EJ2.push({ nivel: 1, titulo: 'Lados desde el giro',
    enunciado: 'Cada ángulo exterior de un polígono equiángulo mide 20°. ¿Cuántos lados tiene?',
    datos: [D_CADA],
    solucion: [{ texto: 'Si 360° ÷ n = 20°, entonces n es cuántas veces cabe 20° en 360°:', ecuacion: junto(['n = 360° ÷ 20° = ', dF('18')]) }],
    respuesta: [dF('18 lados')] });
  EJ2.push({ nivel: 1, titulo: 'Muchos lados, una vuelta',
    enunciado: 'Un polígono convexo tiene 25 lados, todos distintos. ¿Cuánto suman sus ángulos exteriores, uno por vértice?',
    datos: [D_EXT],
    solucion: [{ texto: 'La suma de los exteriores no depende de los lados: es una vuelta.', ecuacion: junto(['suma de exteriores = ', dF('360°')]) }],
    respuesta: [dF('360°')] });

  EJ2.push({ nivel: 2, titulo: 'La esquina de doce',
    enunciado: 'Un polígono equiángulo tiene 12 lados. ¿Cuánto mide cada ángulo interior?',
    datos: [D_CADA, D_ADY],
    solucion: [{ texto: 'Cada exterior:', ecuacion: junto(['360° ÷ ', nO(12), ' = 30°']) },
      { texto: 'Cada interior completa 180°:', ecuacion: junto(['180° − 30° = ', dF('150°')]) }],
    respuesta: [dF('150°')] });
  EJ2.push({ nivel: 2, titulo: 'Lados desde la esquina',
    enunciado: 'Cada ángulo interior de un polígono equiángulo mide 140°. ¿Cuántos lados tiene?',
    datos: [D_CADA, D_ADY],
    solucion: [{ texto: 'Cada exterior:', ecuacion: junto('180° − 140° = 40°') },
      { texto: 'Cuántos exteriores de 40° caben en una vuelta:', ecuacion: junto(['n = 360° ÷ 40° = ', dF('9')]) }],
    respuesta: [dF('9 lados')] });
  EJ2.push({ nivel: 2, titulo: 'Giros en razón',
    figura: fig(figGiros(5, { A: 'x', B: 'x', C: '2x', D: '3x', E: '3x' }, { alt: 'Un pentágono con sus ángulos exteriores rotulados x, x, 2x, 3x y 3x.' })),
    enunciado: `Los ángulos exteriores de un pentágono convexo miden x, x, 2x, 3x y 3x. ¿Cuánto mide su menor ángulo interior?${NO_ESC}`,
    datos: [D_EXT, D_ADY],
    solucion: [{ texto: 'Los exteriores suman 360°:', ecuacion: junto(['10x = 360°', '   →   ', 'x = 36']) },
      { texto: 'El menor interior está donde el exterior es mayor, 3x = 108°:', ecuacion: junto(['180° − 108° = ', dF('72°')]) }],
    respuesta: [dF('72°')] });
  EJ2.push({ nivel: 2, titulo: 'La diferencia de dos ángulos',
    enunciado: 'En un polígono equiángulo, cada ángulo interior mide 120° más que cada exterior. ¿Cuántos lados tiene?',
    datos: [D_CADA, D_ADY],
    solucion: [{ texto: 'Interior y exterior suman 180° y se llevan 120°: el exterior es la mitad de lo que sobra.', ecuacion: junto('(180° − 120°) ÷ 2 = 30°') },
      { texto: 'Cuántos de 30° caben en una vuelta:', ecuacion: junto(['n = 360° ÷ 30° = ', dF('12')]) }],
    respuesta: [dF('12 lados')] });
  EJ2.push({ nivel: 2, titulo: 'Del total al giro',
    enunciado: 'Los ángulos interiores de un polígono equiángulo suman 1 440°. ¿Cuánto mide cada ángulo exterior?',
    datos: [D_S, D_CADA],
    solucion: [{ texto: 'Primero los lados:', ecuacion: junto(['(n − 2) · 180° = 1 440°', '   →   ', 'n = 10']) },
      { texto: 'Cada exterior:', ecuacion: junto(['360° ÷ ', nO(10), ' = ', dF('36°')]) }],
    respuesta: [dF('36°')] });

  // Nivel 3: la correcta en C, D, E, A y B.
  EJ2.push({ nivel: 3, titulo: 'El hexágono equiángulo',
    figura: fig(figHexEq([3, 4, 2, 5])),
    enunciado: `El hexágono ABCDEF tiene sus seis ángulos iguales: AB = 3 cm, BC = 4 cm, CD = 2 cm y EF = 5 cm. Al prolongar AB, CD y EF sale un triángulo. ¿Cuánto mide su perímetro?${NO_ESC}`,
    alternativas: ['14 cm', '24 cm', '17 cm', '19 cm', '8 cm'],
    datos: [D_CADA, D_EQL, D_PER],
    fuente: 'Modelo de San Marcos 2026-II (pregunta 37), con otros números.',
    solucion: [{ texto: 'Cada exterior mide 360° ÷ 6 = 60°: los tres triángulos de las esquinas y el grande son equiláteros.' },
      { texto: 'Cada lado del grande junta tres lados del hexágono:', ecuacion: junto('FA + 3 + 4 = 4 + 2 + DE = DE + 5 + FA') },
      { texto: 'De la 1.ª y la 3.ª, DE = 2 cm; de la 1.ª y la 2.ª, FA = 1 cm. Perímetro:', ecuacion: junto(['3 + 4 + 2 + 2 + 5 + 1 = ', dF('17 cm')]) },
      { texto: '14 cm suma solo los cuatro dados; 19 cm supone lados opuestos iguales; 24 cm es el perímetro del triángulo grande, de 8 cm de lado.' }],
    respuesta: [dF('17 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Cuatro veces el giro',
    enunciado: 'En un polígono equiángulo, cada ángulo interior mide el cuádruple de cada ángulo exterior. ¿Cuántos lados tiene?',
    alternativas: ['5', '36', '8', '10', '144'],
    datos: [D_CADA, D_ADY],
    solucion: [{ texto: 'Interior y exterior suman 180°: 4e + e = 180°.', ecuacion: junto(['5e = 180°', '   →   ', 'e = 36°']) },
      { texto: 'Lados:', ecuacion: junto(['n = 360° ÷ 36° = ', dF('10')]) },
      { texto: '36 es el exterior y 144, el interior: son ángulos, no lados. 5 cuenta las partes (4 + 1); 8 duplica el 4.' }],
    respuesta: [dF('10 lados')] });
  EJ2.push({ nivel: 3, titulo: 'Exterior 2x, interior 7x',
    enunciado: 'En un polígono equiángulo, cada ángulo exterior mide 2x y cada interior, 7x. ¿Cuántos lados tiene el polígono?',
    alternativas: ['20', '40', '140', '18', '9'],
    datos: [D_CADA, D_ADY],
    solucion: [{ texto: 'Los dos suman 180°:', ecuacion: junto(['2x + 7x = 180°', '   →   ', 'x = 20']) },
      { texto: 'Cada exterior mide 2 · 20° = 40°:', ecuacion: junto(['n = 360° ÷ 40° = ', dF('9')]) },
      { texto: '20 es x; 40, el exterior; 140, el interior; 18 sale de dividir 360° entre x y no entre el exterior.' }],
    respuesta: [dF('9 lados')] });
  EJ2.push({ nivel: 3, titulo: 'La sexta esquina',
    figura: fig(figGiros(6, { A: '50°', B: '65°', C: '70°', D: '55°', E: '60°' }, { int: { F: '?' }, resp: 120, alt: 'Un hexágono con sus ángulos exteriores en A, B, C, D y E: 50°, 65°, 70°, 55° y 60°; el ángulo interior de F, con signo de pregunta.' })),
    enunciado: `Un mototaxi rodea una plaza convexa de 6 esquinas. En cinco gira 50°, 65°, 70°, 55° y 60°. ¿Cuánto mide la sexta esquina por dentro?${NO_ESC}`,
    alternativas: ['120°', '420°', '240°', '300°', '60°'],
    datos: [D_EXT, D_ADY],
    solucion: [{ texto: 'Los seis giros suman 360°; los cinco dados, 300°:', ecuacion: junto('360° − 300° = 60°') },
      { texto: 'La esquina por dentro completa 180°:', ecuacion: junto(['180° − 60° = ', dF('120°')]) },
      { texto: '60° es el giro, no la esquina; 300° es la suma de los cinco giros; 420° resta 300° de 720°, y 240°, de 540°.' }],
    respuesta: [dF('120°')] });
  EJ2.push({ nivel: 3, titulo: 'Dos polígonos equiángulos',
    enunciado: 'Un polígono equiángulo tiene 4 lados más que otro, y su ángulo exterior mide 24° menos. ¿Cuántos lados tiene el menor?',
    alternativas: ['15', '6', '10', '60', '36'],
    datos: [D_CADA],
    solucion: [{ texto: 'Con n lados el menor, sus exteriores se llevan 24°:', ecuacion: junto(['360° ÷ n − 360° ÷ (n + 4) = 24°']) },
      { texto: 'Juntando las fracciones, 1 440 ÷ (n(n + 4)) = 24, así que n(n + 4) = 60 = 6 · 10:', ecuacion: junto(['n = ', dF('6'), ':   60° − 36° = 24°']) },
      { texto: '10 es el mayor; 60° y 36° son los exteriores de cada uno, no lados; 15 es 360 ÷ 24.' }],
    respuesta: [dF('6 lados')] });

  // «Ahora tú» de la idea 2: el ángulo de un equiángulo; los lados desde el interior; los giros con x; el hexágono
  // equiángulo (San Marcos 2026-II); el interior que es k veces el exterior.
  const NS2 = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
  function casoCada(r) {
    const n = r.de(NS2), e = 360 / n, i = 180 - e, pideInt = r() < 0.5;
    const c = pideInt ? i : e;
    return { pregunta: `Un polígono equiángulo tiene ${n} lados. ¿Cuánto mide cada ángulo ${pideInt ? 'interior' : 'exterior'}?`, datos: [D_CADA, D_ADY],
      opciones: opciones(c, OPS(r, [
        pideInt ? { id: 'ext', valor: e, error: 'GE-POL9', siFuera: `Dividir 360° entre ${n} está bien: da el exterior. El interior completa 180°.` }
          : { id: 'int', valor: i, error: 'GE-POL9', siFuera: `${gr(i)} es cada ángulo interior; el exterior es lo que gira: 360° ÷ ${n}.` },
        { id: 'r180', valor: 180 / n, error: 'GE-POL18', siFuera: `Repartir en ${n} partes iguales está bien; lo que se reparte es una vuelta, 360°.` },
        { id: 'suma', valor: (n - 2) * 180, error: 'GE-POL17', siFuera: `${gr((n - 2) * 180)} suman todos los interiores juntos; se pide uno solo.` },
        { id: 'tri', valor: 360 / (n - 2), error: 'GE-POL19', siFuera: `Repartir 360° está bien; se reparte entre los ${n} vértices, no entre ${n - 2}.` }]), grA),
      solucion: { texto: `Cada exterior: 360° ÷ ${n} = ${gr(e)}.${pideInt ? ' El interior completa 180°:' : ''}`, ecuacion: junto(pideInt ? [`180° − ${gr(e)} = `, dF(gr(i))] : ['360° ÷ ', nO(n), ' = ', dF(gr(e))]) } };
  }
  function casoNInt(r) {
    const n = r.de(NS2.filter(x => x >= 6)), e = 360 / n, i = 180 - e;
    return { pregunta: `Cada ángulo interior de un polígono equiángulo mide ${gr(i)}. ¿Cuántos lados tiene?`, datos: [D_CADA, D_ADY],
      opciones: opciones(n, OPS(r, [
        { id: 'r180', valor: 180 / e, entero: true, error: 'GE-POL18', siFuera: `Hallar el exterior, ${gr(e)}, está bien; los exteriores suman 360°, no 180°.` },
        { id: 'giro', valor: e, error: 'GE-POL20', siFuera: `${gr(e)} es cada exterior; falta ver cuántos caben en 360°.` },
        { id: 'div', valor: i / e, entero: true, error: 'GE-POL21', siFuera: `Hallar los dos ángulos está bien; los lados salen de 360° ÷ ${gr(e)}.` },
        { id: 'menos', valor: n - 2, error: 'GE-POL12', siFuera: `Con ${n - 2} lados, cada interior mediría ${grA(180 - 360 / (n - 2))}.` }]), x => f(x)),
      solucion: { texto: `Cada exterior: 180° − ${gr(i)} = ${gr(e)}.`, ecuacion: junto(['n = 360° ÷ ', gr(e), ' = ', dF(String(n))]) } };
  }
  function casoGirosX(r) {
    for (let t = 0; t < 400; t++) {
      const n = r.de([4, 5, 6]), x = 5 * r.ent(4, 12), a = Array.from({ length: n }, () => r.ent(1, 3)), c = Array.from({ length: n - 1 }, () => 5 * r.ent(-4, 6));
      const sa = a.reduce((p, q) => p + q, 0), last = 360 - sa * x - c.reduce((p, q) => p + q, 0);
      if (last % 5 || Math.abs(last) > 40) continue;
      c.push(last);
      const vals = a.map((k, i) => k * x + c[i]);
      if (vals.some(v => v < 15 || v > 150) || new Set(vals).size < 3) continue;
      const ex = a.map((k, i) => `${k === 1 ? '' : k}x${c[i] ? ` ${c[i] < 0 ? '−' : '+'} ${Math.abs(c[i])}°` : ''}`), sc = c.reduce((p, q) => p + q, 0);
      const conS = ((n - 2) * 180 - sc) / sa, con180 = (180 - sc) / sa;
      return { pregunta: `Los ángulos exteriores de un polígono convexo de ${n} lados miden ${ex.slice(0, -1).join(', ')} y ${ex[n - 1]}. ¿Cuánto vale x?`, datos: [D_EXT],
        opciones: opciones(x, OPS(r, [
          { id: 'int', valor: conS, entero: true, error: 'GE-POL1', siFuera: `Sumar y despejar está bien; los exteriores suman 360°, no ${gr((n - 2) * 180)}.` },
          { id: 'r180', valor: con180, entero: true, error: 'GE-POL18', siFuera: 'Sumar y despejar está bien; los exteriores suman una vuelta: 360°.' },
          { id: 'sinc', valor: 360 / sa, entero: true, error: 'GE-POL22', siFuera: `Sumar las x está bien; faltan los números sueltos, que suman ${gr(sc)}.` },
          { id: 'mayor', valor: Math.max(...vals), error: 'GE-CON30', siFuera: `${gr(Math.max(...vals))} es el mayor ángulo; se pide x.` }]), x => f(x)),
        solucion: { texto: 'Los exteriores suman 360°:', ecuacion: junto([`${sa}x ${sc < 0 ? '−' : '+'} ${Math.abs(sc)}° = 360°`, '   →   ', 'x = ', dF(String(x))]) } };
    }
    throw new Error('casoGirosX sin caso');
  }
  function casoHex(r) {
    for (let t = 0; t < 400; t++) {
      const l = [r.ent(2, 7), r.ent(2, 7), r.ent(2, 7), r.ent(2, 7)];
      const de = l[0] + l[1] - l[3], fa = l[2] + de - l[0];
      if (de < 1 || fa < 1 || (l[0] === 3 && l[1] === 4 && l[2] === 2 && l[3] === 5)) continue;
      const per = l[0] + l[1] + l[2] + de + l[3] + fa, L = fa + l[0] + l[1];
      const F = [0.4, 0.3, 0.55].map(en => figHexEq(l, { enCD: en })).find(cabe);
      if (!F) continue;
      return { pregunta: `El hexágono ABCDEF es equiángulo: AB = ${cm(l[0])}, BC = ${cm(l[1])}, CD = ${cm(l[2])} y EF = ${cm(l[3])}. Al prolongar AB, CD y EF sale un triángulo. ¿Cuánto mide el perímetro del hexágono?${NO_ESC}`,
        datos: [D_CADA, D_EQL, D_PER], dibujo: fig(F),
        opciones: opciones(per, OPS(r, [
          { id: 'opuestos', valor: l[0] + l[1] + l[2] + l[0] + l[3] + l[2], error: 'GE-POL23', siFuera: 'Sumar los seis lados está bien; pero aquí los lados opuestos no miden igual.' },
          { id: 'grande', valor: 3 * L, error: 'GE-POL24', siFuera: `Ver los equiláteros está bien; ${cm(3 * L)} es el perímetro del triángulo grande.` },
          { id: 'cuatro', valor: l.reduce((a, b) => a + b, 0), error: 'GE-POL25', siFuera: 'Sumar lados está bien; faltan DE y FA, que salen de los equiláteros.' },
          { id: 'L', valor: L, error: 'GE-POL24', siFuera: `${cm(L)} es el lado del triángulo grande, no el perímetro del hexágono.` }]), cm),
        solucion: { texto: `Los equiláteros dan DE = ${cm(de)} y FA = ${cm(fa)} (cada lado del grande vale ${cm(L)}).`, ecuacion: junto([`${l[0]} + ${l[1]} + ${l[2]} + ${de} + ${l[3]} + ${fa} = `, dF(cm(per))]) } };
    }
    throw new Error('casoHex sin caso');
  }
  function casoRazon2(r) {
    const k = r.de([2, 3, 5, 8, 11]), e = 180 / (k + 1), n = 360 / e;
    return { pregunta: `En un polígono equiángulo, cada ángulo interior mide ${k} veces lo que mide cada exterior. ¿Cuántos lados tiene?`, datos: [D_CADA, D_ADY],
      opciones: opciones(n, OPS(r, [
        { id: 'partes', valor: k + 1, error: 'GE-POL26', siFuera: `Ver ${k + 1} partes de 180° está bien; los lados salen de 360° ÷ ${gr(e)}.` },
        { id: 'giro', valor: e, error: 'GE-POL20', siFuera: `${gr(e)} es cada exterior; falta ver cuántos caben en 360°.` },
        { id: 'doble', valor: 2 * k, error: 'GE-POL27', siFuera: `Duplicar está bien; lo que se duplica es ${k} + 1, las partes de 180°.` }]), x => f(x)),
      solucion: { texto: `Interior más exterior: ${k}e + e = 180°, así que e = ${gr(e)}.`, ecuacion: junto(['n = 360° ÷ ', gr(e), ' = ', dF(String(n))]) } };
  }

  const exteriores = {
    id: 'angulos-exteriores',
    titulo: 'Ángulos exteriores del polígono',
    pregunta: '¿Cuánto gira en total quien da la vuelta a una plaza?',
    temas: ['Suma de ángulos internos y externos'],
    pieza: GO,
    aprendizaje: 'Los ángulos exteriores de un polígono convexo suman 360°; si sus n ángulos son iguales, cada exterior mide 360° ÷ n.',
    actividad: 'Rodear plazas en mototaxi y mirar cuánto gira en cada esquina.',
    // Lee: el exterior como giro (de Triángulos), interior + exterior = 180° y «equiángulo». No dice cuánto suman los giros
    // (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Doblar en una esquina', texto: 'Un mototaxi rodea una plaza. En cada esquina deja la calle que traía y dobla: lo que gira es el ángulo exterior, entre la calle nueva y la prolongación de la vieja, como en Triángulos.',
          pieza: GO, dibujo: fig(figPlaza(5, { valores: false, alt: 'Una plaza de 5 esquinas iguales y el mototaxi en la calle AB; en B, el arco turquesa marca lo que gira al doblar.' })) },
        { titulo: 'Adentro y afuera', texto: 'En cada esquina, el ángulo de adentro y el giro quedan sobre una misma recta: juntos forman 180°. Si la esquina es cerrada, el giro es grande; si es abierta, el giro es chico.' },
        { titulo: 'Esquinas iguales', texto: 'Un polígono con todos sus ángulos iguales se llama equiángulo. Si además sus lados miden igual, es regular, como la señal de «Pare», de 8 lados.' },
        { titulo: 'Qué mirar al jugar', texto: ['Cambia el número de esquinas ', dO('n'), ' de la plaza. Mira cuánto mide cada esquina por dentro y cuánto gira el mototaxi en cada una.'] },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'El mototaxi da vueltas a una plaza de esquinas iguales, sin entrantes.',
      mision: {
        texto: 'Elige la plaza en la que el mototaxi gira 45° en cada esquina.',
        logrado: v => v.n === 8,
        bien: 'Con 8 esquinas gira 45° en cada una, como en la señal de «Pare».',
      },
      voz: 'Más esquinas: ¿gira más o gira menos?',
      leyenda: [
        { s: dO('n'), t: 'el número de esquinas, o de lados' },
        { s: dH('arco carmín'), t: 'la esquina por dentro: ángulo interior' },
        { s: dI('arco turquesa'), t: 'lo que gira: ángulo exterior' },
        { s: 'punteado', t: 'la calle que sigue de largo' },
      ],
      controles: [{ id: 'n', etiqueta: 'n, el número de esquinas', min: 3, max: 10, paso: 1, inicio: 5, unidad: 'esquinas', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: figPlaza(v.n), estado: {} }),
      lectura: v => { const e = 360 / v.n; return [dO(junto(`n = ${v.n}`)), ': ', dH(junto(grA(180 - e))), ' adentro y ', dI(junto(grA(e))), junto(' de giro: suman 180°')]; },
      minimo: 4,
    },
    predice: {
      pregunta: `El mototaxi da la vuelta a otra plaza de 5 esquinas, todas distintas. Gira 60°, 85°, 70° y 75° en cuatro de ellas. ¿Cuánto gira en la quinta?${NO_ESC}`,
      datos: ['En cada esquina, el ángulo de adentro y el giro forman 180°.', 'Los ángulos interiores de un polígono de 5 lados suman 540°.'],
      voz: 'Piensa en hacia dónde mira el mototaxi al volver.',
      opciones: [
        { id: 'c', texto: `${QUINTO}°`, correcta: true },
        { id: 'int', texto: `${540 - 290}°`, error: 'GE-POL1', siFuera: 'Completar una suma está bien; pero 540° es de los ángulos de adentro, no de los giros.' },
        { id: 'igual', texto: '72°', error: 'GE-POL8', siFuera: 'Repartir 360° en 5 está bien si las esquinas fueran iguales; aquí son distintas.' },
        { id: 'adentro', texto: `${180 - QUINTO}°`, error: 'GE-POL9', siFuera: `${180 - QUINTO}° mide esa esquina por dentro; el giro es lo que le falta para 180°.` },
      ],
      dibujo: fig(PLAZA_R, { corte: 0 }),
      revelar: fig(PLAZA_R, { corte: 1 }),
      coincide: `Coincide: los cinco giros dan una vuelta entera, 360°. Faltaban 360° − 290° = ${QUINTO}°.`,
      noCoincide: `Revisemos: al volver a A, el mototaxi mira hacia donde empezó: giró una vuelta, 360°. Faltan ${QUINTO}°.`,
    },
    mira: {
      pieza: GO,
      datos: PLAZA_R,
      voz: 'Sigue la nariz del mototaxi: ¿cuánto giró al volver?',
      pasos: [
        { estado: { corte: 0 }, texto: 'En cada esquina, el mototaxi gira su ángulo exterior.', ecuacion: junto([dI('60°'), ' + ', dI('85°'), ' + ', dI('70°'), ' + ', dI('75°'), ' + ?']) },
        { estado: { corte: 1 }, texto: 'Al volver a A mira hacia donde empezó: dio una vuelta entera.', ecuacion: junto(`360° − 290° = ${QUINTO}°`) },
        { estado: { corte: 1 }, texto: 'Con la idea 1: cinco veces 180°, menos los interiores.', ecuacion: junto([nO(5), ' · 180° − 540° = 360°']) },
        { estado: { corte: 1 }, texto: ['Con ', dO('n'), ' esquinas pasa lo mismo: siempre queda una vuelta.'], ecuacion: junto([dO('n'), ' · 180° − (', dO('n'), ' − 2) · 180° = 360°']) },
        { estado: { corte: 1 }, texto: 'Si las esquinas son iguales, la vuelta se reparte en partes iguales.', ecuacion: junto(['cada exterior = 360° ÷ ', dO('n')]) },
      ],
    },
    regla: {
      texto: 'Los ángulos exteriores de un polígono convexo suman 360°, sea cual sea n. Si son todos iguales, cada uno mide 360° ÷ n, y cada interior, 180° menos eso.',
      ecuacion: junto([dI('exteriores'), ': 360°', Y, dI('cada exterior'), ' = 360° ÷ ', dO('n')]),
      condicion: 'el polígono es convexo y en cada vértice se cuenta un solo exterior: el giro hacia el lado siguiente.',
      voz: 'Una vuelta entera, repartida entre las esquinas.',
    },
    // Así se resuelve: los lados desde el exterior (con otros números) o cada interior por dos caminos.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const n = r.de([40, 45, 60, 72, 90]), e = 360 / n, i = 180 - e;
          return {
            enunciado: `Cada ángulo interior de un polígono equiángulo mide ${gr(i)}. ¿Cuántos lados tiene?`,
            datos: [D_CADA, D_ADY],
            pasos: [
              { tipo: 'pide', texto: 'Piden el número de lados, n.' },
              { tipo: 'datos', texto: `Todos los ángulos interiores miden ${gr(i)}.` },
              { tipo: 'regla', texto: 'El exterior completa 180° con el interior, y los n exteriores iguales reparten 360°.' },
              { tipo: 'cuentas', texto: `Cada exterior mide 180° − ${gr(i)} = ${gr(e)}; cuántos caben en una vuelta:`, ecuacion: junto(['n = 360° ÷ ', gr(e), ' = ', dF(String(n))]) },
              { tipo: 'sentido', texto: `Comprobación: con ${n} lados, (${n} − 2) · 180° ÷ ${n} = ${gr(i)}.` },
            ],
            respuesta: ['Tiene ', dF(`${n} lados`)],
          };
        }
        const n = r.de([9, 15, 20, 24]), S = (n - 2) * 180, i = S / n;
        return {
          enunciado: `Una mesa tiene la forma de un polígono equiángulo de ${n} lados. ¿Cuánto mide cada una de sus esquinas, por dentro?`,
          datos: [D_S, D_CADA, D_ADY],
          pasos: [
            { tipo: 'pide', texto: 'Piden cada ángulo interior.' },
            { tipo: 'datos', texto: `${n} ángulos iguales.` },
            { tipo: 'regla', texto: 'Por los exteriores: cada uno es 360° ÷ n, y el interior completa 180°.' },
            { tipo: 'cuentas', texto: `Cada exterior: 360° ÷ ${n} = ${gr(360 / n)}.`, ecuacion: junto([`180° − ${gr(360 / n)} = `, dF(gr(i))]) },
            { tipo: 'sentido', texto: `Por la idea 1 sale igual: (${n} − 2) · 180° = ${gr(S)}, y ${gr(S)} ÷ ${n} = ${gr(i)}.` },
          ],
          respuesta: ['Cada esquina mide ', dF(gr(i))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Los giros siempre dan una vuelta: 360°.',
      generar(s) { return conCuatro([casoCada, casoNInt, casoGirosX, casoHex, casoRazon2][s % 5], azar(s + 7), firmasDe(EJ2)); },
    },
  };

  // ======================= Idea 3: número de diagonales =======================
  // Objeto de la primera pantalla: un geoplano redondo, el tablero con clavos y ligas del colegio (geo-objeto, parcela
  // «geoplano»; dibujo de prueba). Cada liga va de un clavo a otro que no es su vecino: es una diagonal.
  // Cambia: el número de clavos n y el clavo de partida. · Permanece: las ligas van a los no vecinos. · Progresa: n − 3
  // ligas por clavo. · Se reserva: el total (la predicción). · Debe verse: de cualquier clavo salen las mismas.
  const D_DIAG = 'Diagonal: el segmento que une dos vértices que no son vecinos.';
  const D_DV = 'De cada vértice de un polígono de n lados salen n − 3 diagonales.';
  const D_ND = 'Un polígono convexo de n lados tiene n(n − 3) ÷ 2 diagonales.';
  const nd = n => n * (n - 3) / 2;
  const VG = { x: [-4.4, 4.4], y: [-4.2, 4.2] };
  // El geoplano de n clavos; ligas del clavo v (naranja) y, desde el corte todas, todas las demás (tinta fina).
  function figGeoplano(n, v = 0, o = {}) {
    const ids = LETRAS.slice(0, n).split(''), P = parejo(n, 3, 90);
    const diag = [];
    for (let k = 0; k < n; k++) { if (k === v || k === (v + 1) % n || k === (v + n - 1) % n) continue; diag.push([ids[v], ids[k], { color: 'o', grosor: 'variable' }]); }
    if (o.todas !== undefined) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) { if ((i === 0 && j === n - 1) || i === v || j === v) continue; diag.push([ids[i], ids[j], Object.assign({ grosor: 'fino' }, o.todas ? { desde: o.todas } : {})]); }
    if (o.deB !== undefined) { const w = (v + 1) % n; for (let k = 0; k < n; k++) { if ([w, (w + 1) % n, (w + n - 1) % n].includes(k)) continue; diag.push([ids[w], ids[k], { color: 'i', grosor: 'variable', desde: o.deB, hasta: o.deB }]); } }
    const F = figura([poli(ids.join(''), P, { diag })], { vista: VG, alto: 250, obj: { objeto: 'parcela', tipo: 'geoplano', clavos: ids },
      alt: o.alt || `Un geoplano redondo con ${n} clavos, de A a ${ids[n - 1]}; del clavo ${ids[v]} salen ${n - 3} ligas naranjas, una a cada clavo que no es su vecino.` });
    // Los lados (entre vecinos) se ven tenues: en el geoplano no hay liga entre vecinos.
    F.figura.segmentos.forEach((sg, k) => { if (k < n) Object.assign(sg, { discontinua: true, grosor: 'fino' }); });
    return F;
  }
  const GEO10 = figGeoplano(10, 0, { todas: 2, deB: 1, alt: 'Un geoplano con 10 clavos: del clavo A salen 7 ligas naranjas; después, las de B en turquesa; al final, todas las ligas entre clavos no vecinos.' });

  // Los 15 ejemplos (cuentas.py, idea 3): 9; 12; 20; 5; 2; 9 lados (27); 44 apretones; 54 (12 lados); 35 (10 lados);
  // 5 lados; 10 lados (30 más con 3 más); 1 260° (9 lados); 12 lados (54 − 12 = 42); 77 saludos; 135 (18 lados).
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'Las diagonales del hexágono',
    figura: fig(figGeoplano(6, 0, { alt: 'Un geoplano de 6 clavos: del clavo A salen 3 ligas naranjas.' })),
    enunciado: 'En un geoplano de 6 clavos se pone una liga entre cada par de clavos que no son vecinos. ¿Cuántas ligas se ponen?',
    datos: [D_ND],
    solucion: [{ texto: ['Es un polígono de ', nO(6), ' lados:'], ecuacion: junto([nO(6), ' · (6 − 3) ÷ 2 = 18 ÷ 2 = ', dF('9')]) }],
    respuesta: [dF('9 ligas')] });
  EJ3.push({ nivel: 1, titulo: 'Desde un solo vértice',
    enunciado: 'Un polígono convexo tiene 15 lados. ¿Cuántas diagonales salen de uno de sus vértices?',
    datos: [D_DV],
    solucion: [{ texto: 'A todos menos a él mismo y a sus dos vecinos:', ecuacion: junto([nO(15), ' − 3 = ', dF('12')]) }],
    respuesta: [dF('12 diagonales')] });
  EJ3.push({ nivel: 1, titulo: 'El octógono',
    enunciado: 'La señal de «Pare» tiene 8 lados. ¿Cuántas diagonales tiene?',
    datos: [D_ND],
    solucion: [{ texto: ['Con n = ', nO(8), ':'], ecuacion: junto([nO(8), ' · 5 ÷ 2 = 40 ÷ 2 = ', dF('20')]) }],
    respuesta: [dF('20 diagonales')] });
  EJ3.push({ nivel: 1, titulo: 'La estrella de cinco puntas',
    figura: fig(figGeoplano(5, 0, { alt: 'Un geoplano de 5 clavos: del clavo A salen 2 ligas naranjas.' })),
    enunciado: 'Con ligas entre los clavos no vecinos de un geoplano de 5 clavos se forma una estrella. ¿Cuántas ligas tiene?',
    datos: [D_ND],
    solucion: [{ texto: ['Con n = ', nO(5), ':'], ecuacion: junto([nO(5), ' · 2 ÷ 2 = ', dF('5')]) }],
    respuesta: [dF('5 ligas')] });
  EJ3.push({ nivel: 1, titulo: 'Las varillas de la cometa',
    enunciado: 'Una cometa tiene forma de cuadrilátero convexo, y sus varillas van de punta a punta, entre puntas no vecinas. ¿Cuántas varillas tiene?',
    datos: [D_ND],
    solucion: [{ texto: ['Con n = ', nO(4), ':'], ecuacion: junto([nO(4), ' · 1 ÷ 2 = ', dF('2')]) }],
    respuesta: [dF('2 varillas')] });

  EJ3.push({ nivel: 2, titulo: 'Lados desde el total',
    enunciado: 'Un polígono convexo tiene 27 diagonales. ¿Cuántos lados tiene?',
    datos: [D_ND],
    solucion: [{ texto: 'Se busca n con n(n − 3) ÷ 2 = 27, o sea n(n − 3) = 54:' },
      { texto: 'Dos números que se llevan 3 y multiplicados dan 54: 9 y 6.', ecuacion: junto(['9 · 6 = 54', '   →   ', 'n = ', dF('9')]) }],
    respuesta: [dF('9 lados')] });
  EJ3.push({ nivel: 2, titulo: 'Apretones en la ronda',
    enunciado: 'Once amigos se sientan en ronda. Cada uno da un apretón de manos a cada amigo que no está sentado a su lado. ¿Cuántos apretones hay en total?',
    datos: [D_ND],
    solucion: [{ texto: 'Cada amigo es un vértice de un polígono de 11 lados, y cada apretón, una diagonal.' },
      { texto: 'Se cuentan las diagonales:', ecuacion: junto([nO(11), ' · 8 ÷ 2 = 88 ÷ 2 = ', dF('44')]) }],
    respuesta: [dF('44 apretones')] });
  EJ3.push({ nivel: 2, titulo: 'De un vértice al total',
    enunciado: 'De un vértice de un polígono convexo salen 9 diagonales. ¿Cuántas diagonales tiene el polígono en total?',
    datos: [D_DV, D_ND],
    solucion: [{ texto: 'Los lados son 3 más:', ecuacion: junto(['n − 3 = 9', '   →   ', 'n = 12']) },
      { texto: 'El total:', ecuacion: junto([nO(12), ' · 9 ÷ 2 = ', dF('54')]) }],
    respuesta: [dF('54 diagonales')] });
  EJ3.push({ nivel: 2, titulo: 'De la suma a las diagonales',
    enunciado: 'Los ángulos interiores de un polígono convexo suman 1 440°. ¿Cuántas diagonales tiene?',
    datos: [D_S, D_ND],
    solucion: [{ texto: 'Primero los lados:', ecuacion: junto(['(n − 2) · 180° = 1 440°', '   →   ', 'n = 10']) },
      { texto: 'Las diagonales:', ecuacion: junto([nO(10), ' · 7 ÷ 2 = ', dF('35')]) }],
    respuesta: [dF('35 diagonales')] });
  EJ3.push({ nivel: 2, titulo: 'Tantas diagonales como lados',
    enunciado: 'Un polígono convexo tiene tantas diagonales como lados. ¿Cuántos lados tiene?',
    datos: [D_ND],
    solucion: [{ texto: 'Se iguala: n(n − 3) ÷ 2 = n. Se divide entre n:', ecuacion: junto(['(n − 3) ÷ 2 = 1', '   →   ', 'n − 3 = 2', '   →   ', 'n = ', dF('5')]) }],
    respuesta: [dF('5 lados')] });

  // Nivel 3: la correcta en D, B, E, A y C.
  EJ3.push({ nivel: 3, titulo: 'Tres lados más',
    enunciado: 'Si un polígono convexo tuviera 3 lados más, tendría 30 diagonales más. ¿Cuántos lados tiene?',
    alternativas: ['13', '30', '15', '10', '7'],
    datos: [D_ND],
    solucion: [{ texto: 'Con n + 3 lados, de cada vértice salen n diagonales:', ecuacion: junto(['(n + 3) · n ÷ 2 − n(n − 3) ÷ 2 = 30', '   →   ', '6n ÷ 2 = 30']) },
      { texto: 'Entonces 3n = 30:', ecuacion: junto(['n = ', dF('10')]) },
      { texto: '13 son los lados con 3 más; 30, las diagonales que aumentan; 15 sale de 30 ÷ 2; 7 = 10 − 3 son las de un vértice.' }],
    respuesta: [dF('10 lados')] });
  EJ3.push({ nivel: 3, titulo: 'El triple de lados',
    enunciado: 'Un polígono convexo tiene el triple de diagonales que de lados. ¿Cuánto suman sus ángulos interiores?',
    alternativas: ['1 620°', '1 260°', '720°', '4 860°', '1 080°'],
    datos: [D_ND, D_S],
    solucion: [{ texto: 'n(n − 3) ÷ 2 = 3n, y se divide entre n:', ecuacion: junto(['n − 3 = 6', '   →   ', 'n = 9']) },
      { texto: 'La suma:', ecuacion: junto(['(9 − 2) · 180° = ', dF('1 260°')]) },
      { texto: '1 620° es 9 · 180°, sin restar 2; 720° olvida el ÷ 2 (sale n = 6); 1 080° toma 6 como triángulos; 4 860° multiplica las 27 diagonales por 180°.' }],
    respuesta: [dF('1 260°')] });
  EJ3.push({ nivel: 3, titulo: 'Cuarenta y dos más',
    enunciado: 'El número de diagonales de un polígono convexo excede en 42 al número de lados. ¿Cuántos lados tiene?',
    alternativas: ['42', '7', '9', '54', '12'],
    datos: [D_ND],
    solucion: [{ texto: 'n(n − 3) ÷ 2 − n = 42, o sea n(n − 5) = 84:', ecuacion: junto(['12 · 7 = 84', '   →   ', 'n = ', dF('12')]) },
      { texto: 'Comprobación: 12 · 9 ÷ 2 = 54 diagonales, y 54 − 12 = 42.' },
      { texto: '54 son las diagonales y 42, la diferencia; 9 son las de un vértice (12 − 3); 7 es el otro factor de 84 = 12 · 7.' }],
    respuesta: [dF('12 lados')] });
  EJ3.push({ nivel: 3, titulo: 'Saludos de una ronda',
    enunciado: 'Catorce niños forman una ronda. Cada uno saluda con un apretón de manos a todos los niños que no tiene a su lado. ¿Cuántos apretones hay?',
    alternativas: ['77', '91', '154', '11', '84'],
    datos: [D_ND],
    solucion: [{ texto: 'Cada niño es un vértice de un polígono de 14 lados:', ecuacion: junto([nO(14), ' · 11 ÷ 2 = 154 ÷ 2 = ', dF('77')]) },
      { texto: '154 cuenta cada apretón dos veces; 91 incluye a los vecinos (14 · 13 ÷ 2); 84 quita un solo vecino (14 · 12 ÷ 2); 11 son los de un niño.' }],
    respuesta: [dF('77 apretones')] });
  EJ3.push({ nivel: 3, titulo: 'Del giro a las diagonales',
    enunciado: 'Cada ángulo exterior de un polígono equiángulo mide 20°. ¿Cuántas diagonales tiene?',
    alternativas: ['18', '270', '135', '15', '153'],
    datos: [D_CADA, D_ND],
    solucion: [{ texto: 'Lados:', ecuacion: junto(['n = 360° ÷ 20° = 18']) },
      { texto: 'Diagonales:', ecuacion: junto([nO(18), ' · 15 ÷ 2 = 270 ÷ 2 = ', dF('135')]) },
      { texto: '270 no divide entre 2; 153 incluye los 18 lados (18 · 17 ÷ 2); 18 son los lados y 15, las de un vértice.' }],
    respuesta: [dF('135 diagonales')] });

  // «Ahora tú» de la idea 3: el total; los lados desde el total; desde un vértice al total; diagonales que son k veces
  // los lados; «si tuviera k lados más».
  function casoTotal(r) {
    const n = r.de([7, 9, 11, 13, 15, 16, 17, 20, 25]);
    return { pregunta: `Un polígono convexo tiene ${n} lados. ¿Cuántas diagonales tiene?`, datos: [D_DIAG, D_ND],
      opciones: opciones(nd(n), OPS(r, [
        { id: 'doble', valor: n * (n - 3), error: 'GE-POL4', siFuera: `${n} · ${n - 3} cuenta lo que sale de cada vértice, pero cada diagonal tiene dos puntas.` },
        { id: 'lados', valor: n * (n - 1) / 2, error: 'GE23', siFuera: `Dividir entre 2 está bien; pero n(n − 1) ÷ 2 une también vecinos: cuenta los ${n} lados.` },
        { id: 'uno', valor: n - 3, error: 'GE-POL5', siFuera: `${n - 3} salen de un solo vértice; faltan las de los otros.` },
        { id: 'menos2', valor: n * (n - 2) / 2, entero: true, error: 'GE-POL28', siFuera: 'Quitar vecinos está bien; se quitan el vértice y sus dos vecinos: n − 3.' }]), x => f(x)),
      solucion: { texto: ['Con n = ', nO(n), ':'], ecuacion: junto([`${n} · ${n - 3} ÷ 2 = `, dF(f(nd(n)))]) } };
  }
  function casoNDiag(r) {
    const n = r.de([7, 8, 10, 11, 13, 14, 16, 20]), D = nd(n);
    const sinMitad = (() => { for (let k = 4; k < 60; k++) if (k * (k - 3) === D) return k; return NaN; })();
    return { pregunta: `Un polígono convexo tiene ${D} diagonales. ¿Cuántos lados tiene?`, datos: [D_ND],
      opciones: opciones(n, OPS(r, [
        { id: 'mas', valor: n + 1, error: 'GE-POL29', siFuera: `Con ${n + 1} lados tendría ${nd(n + 1)} diagonales.` },
        { id: 'menos', valor: n - 1, error: 'GE-POL29', siFuera: `Con ${n - 1} lados tendría ${nd(n - 1)} diagonales.` },
        { id: 'sinmitad', valor: sinMitad, error: 'GE-POL4', siFuera: 'Plantear n(n − 3) está bien; falta dividir entre 2.' },
        { id: 'uno', valor: n - 3, error: 'GE-POL5', siFuera: `${n - 3} son las diagonales de un vértice, no los lados.` }]), x => f(x)),
      solucion: { texto: `Se busca n con n(n − 3) = ${2 * D}:`, ecuacion: junto([`${n} · ${n - 3} = ${2 * D}`, '   →   ', 'n = ', dF(String(n))]) } };
  }
  function casoDeVertice(r) {
    const k = r.de([4, 5, 7, 8, 10, 11, 14]), n = k + 3;
    return { pregunta: `De un vértice de un polígono convexo salen ${k} diagonales. ¿Cuántas diagonales tiene el polígono en total?`, datos: [D_DV, D_ND],
      opciones: opciones(nd(n), OPS(r, [
        { id: 'sinmitad', valor: n * k, error: 'GE-POL4', siFuera: `Ver ${n} lados está bien; ${n} · ${k} cuenta cada diagonal dos veces.` },
        { id: 'kn', valor: nd(k), error: 'GE-POL30', siFuera: `${k} no es el número de lados: los lados son ${k} + 3.` },
        { id: 'lados', valor: n * (n - 1) / 2, error: 'GE23', siFuera: 'Dividir entre 2 está bien; n(n − 1) ÷ 2 cuenta también los lados.' }]), x => f(x)),
      solucion: { texto: `Los lados son ${k} + 3 = ${n}:`, ecuacion: junto([`${n} · ${k} ÷ 2 = `, dF(f(nd(n)))]) } };
  }
  function casoVeces(r) {
    const m = r.de([2, 4, 5, 6, 7, 8]), n = 2 * m + 3;
    return { pregunta: `El número de diagonales de un polígono convexo es ${m} veces su número de lados. ¿Cuántos lados tiene?`, datos: [D_ND],
      opciones: opciones(n, OPS(r, [
        { id: 'sin3', valor: 2 * m, error: 'GE-POL31', siFuera: `Llegar a n − 3 = ${2 * m} está bien; falta sumar los 3.` },
        { id: 'sinmitad', valor: m + 3, error: 'GE-POL4', siFuera: `Sumar 3 está bien; pero n(n − 3) se divide entre 2: n − 3 = ${2 * m}.` },
        { id: 'diag', valor: m * n, error: 'GE-POL27', siFuera: `${m * n} son las diagonales; se piden los lados.` }]), x => f(x)),
      solucion: { texto: `n(n − 3) ÷ 2 = ${m}n; se divide entre n:`, ecuacion: junto([`n − 3 = ${2 * m}`, '   →   ', 'n = ', dF(String(n))]) } };
  }
  function casoMas(r) {
    for (let t = 0; t < 100; t++) {
      const k = r.de([1, 2, 4]), n = r.ent(6, 16), dlt = nd(n + k) - nd(n);
      if (n === 10 && k === 3) continue;
      return { pregunta: `Si un polígono convexo tuviera ${k} lado${k > 1 ? 's' : ''} más, tendría ${dlt} diagonales más. ¿Cuántos lados tiene?`, datos: [D_ND],
        opciones: opciones(n, OPS(r, [
          { id: 'nuevo', valor: n + k, error: 'GE-POL32', siFuera: `Plantear la resta está bien; ${n + k} serían los lados con ${k} más.` },
          { id: 'delta', valor: dlt, error: 'GE-POL27', siFuera: `${dlt} son las diagonales que aumentan, no los lados.` },
          { id: 'menos', valor: n - 1, error: 'GE-POL29', siFuera: `Con ${n - 1} lados, al agregar ${k} aumentarían ${nd(n - 1 + k) - nd(n - 1)}.` }]), x => f(x)),
        solucion: { texto: `Se resta: (${mas('n', k)})(${mas('n', k - 3)}) ÷ 2 − n(n − 3) ÷ 2 = ${dlt}.`, ecuacion: junto(['n = ', dF(String(n)), `:   ${nd(n + k)} − ${nd(n)} = ${dlt}`]) } };
    }
    throw new Error('casoMas sin caso');
  }

  const diagonales = {
    id: 'diagonales',
    titulo: 'Número de diagonales',
    pregunta: '¿Cuántas ligas caben entre clavos que no son vecinos?',
    temas: ['Número de diagonales'],
    pieza: GO,
    aprendizaje: 'De cada vértice salen n − 3 diagonales; como cada una tiene dos puntas, un polígono de n lados tiene n(n − 3) ÷ 2.',
    actividad: 'Poner ligas en un geoplano y contar las que salen de un clavo.',
    // Lee: el geoplano, vecinos y diagonal. No dice cuántas hay en total (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El geoplano', texto: 'Un geoplano es un tablero con clavos. Aquí los clavos están en círculo: son los vértices de un polígono. Una liga estirada entre dos clavos es un segmento.',
          pieza: GO, dibujo: fig(figGeoplano(6, 0, { alt: 'Un geoplano redondo de 6 clavos con 3 ligas que salen del clavo A.' })) },
        { titulo: 'Vecinos y no vecinos', texto: 'Dos clavos seguidos en la ronda son vecinos: la liga entre ellos sería un lado. Entre dos clavos que no son vecinos, la liga es una diagonal.' },
        { titulo: 'Qué mirar al jugar', texto: ['Cambia el número de clavos ', dO('n'), ' y cuenta las ligas que salen del clavo marcado. Después elige otro clavo de partida: ¿salen las mismas?'] },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'En el geoplano, cada liga va de un clavo a otro que no es su vecino.',
      mision: {
        texto: 'Pon clavos hasta que del clavo marcado salgan 5 ligas.',
        logrado: v => v.n === 8,
        bien: 'Con 8 clavos salen 5 ligas de cada uno.',
      },
      voz: 'Un clavo no se une con él mismo ni con sus vecinos.',
      leyenda: [
        { s: dO('n'), t: 'el número de clavos, o de vértices' },
        { s: dO('liga naranja'), t: 'una diagonal desde el clavo marcado' },
        { s: 'punteado', t: 'dos clavos vecinos: sería un lado' },
      ],
      controles: [{ id: 'n', etiqueta: 'n, el número de clavos', min: 4, max: 10, paso: 1, inicio: 6, unidad: 'clavos', decimales: 0, color: 'c-o' },
        { id: 'v', etiqueta: 'Clavo de partida', opciones: [{ valor: 0, texto: 'A' }, { valor: 1, texto: 'B' }, { valor: 2, texto: 'C' }, { valor: 3, texto: 'D' }], inicio: 0 }],
      dibujo: v => ({ datos: figGeoplano(v.n, v.v % v.n), estado: {} }),
      lectura: v => [dO(junto(`n = ${v.n}`)), junto(`: del clavo ${LETRAS[v.v % v.n]} salen ${v.n} − 3 = ${v.n - 3} ligas`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora el geoplano tiene 10 clavos. Si pones una liga entre cada par de clavos que no son vecinos, ¿cuántas ligas usas en total?',
      datos: ['Del clavo A salen 7 ligas, una a cada clavo que no es su vecino.', 'Cada liga une dos clavos.'],
      voz: '¿La liga de A a E también sale de E?',
      opciones: [
        { id: 'c', texto: '35', correcta: true },
        { id: 'doble', texto: '70', error: 'GE-POL4', siFuera: '10 · 7 cuenta lo que sale de cada clavo; pero cada liga sale de sus dos puntas.' },
        { id: 'lados', texto: '45', error: 'GE23', siFuera: 'Unir todos los pares está bien, salvo los 10 vecinos: esos serían lados.' },
        { id: 'siete', texto: '7', error: 'GE-POL5', siFuera: '7 salen del clavo A; los otros nueve clavos tienen las suyas.' },
      ],
      dibujo: fig(GEO10, { corte: 0 }),
      revelar: fig(GEO10, { corte: 2 }),
      coincide: 'Coincide: 10 clavos por 7 ligas dan 70 puntas, y cada liga tiene dos: 35 ligas.',
      noCoincide: 'Revisemos: 10 · 7 = 70 cuenta cada liga dos veces, una por cada punta: son 35.',
    },
    mira: {
      pieza: GO,
      datos: GEO10,
      voz: 'Cuenta puntas de liga, no ligas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Del clavo A salen 7 ligas: a todos menos A y sus dos vecinos.', ecuacion: junto([nO(10), ' − 3 = 7']) },
        { estado: { corte: 1 }, texto: 'Del clavo B salen otras 7. Cada clavo pone 7 puntas.', ecuacion: junto([nO(10), ' · 7 = 70 puntas']) },
        { estado: { corte: 2 }, texto: 'Cada liga tiene dos puntas: en 70 se contó dos veces.', ecuacion: junto(['70 ÷ 2 = 35 ligas']) },
        { estado: { corte: 2 }, texto: ['Con ', dO('n'), ' clavos: ', dO('n'), ' − 3 por clavo, y la mitad del producto.'], ecuacion: junto([dO('n'), ' · (', dO('n'), ' − 3) ÷ 2']) },
      ],
    },
    regla: {
      texto: 'De cada vértice salen n − 3 diagonales (a todos menos él y sus vecinos). Cada una tiene dos puntas: el polígono de n lados tiene n(n − 3) ÷ 2.',
      ecuacion: junto([dF('diagonales'), ' = ', dO('n'), ' · (', dO('n'), ' − 3) ÷ 2']),
      condicion: 'n es el número de lados del polígono convexo; un lado, entre vértices vecinos, no es diagonal.',
      voz: 'Multiplica y divide entre 2: cada diagonal se cuenta dos veces.',
    },
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const n = r.de([12, 15, 18, 21]), D = nd(n);
          return {
            enunciado: `Un polígono convexo tiene ${D} diagonales. ¿Cuántos lados tiene?`,
            datos: [D_ND],
            pasos: [
              { tipo: 'pide', texto: 'Piden el número de lados, n.' },
              { tipo: 'datos', texto: `El total de diagonales: ${D}.` },
              { tipo: 'regla', texto: 'El total es n(n − 3) ÷ 2: se iguala y se multiplica por 2.', ecuacion: junto(`n(n − 3) = ${2 * D}`) },
              { tipo: 'cuentas', texto: `Dos números que se llevan 3 y dan ${2 * D}: ${n} y ${n - 3}.`, ecuacion: junto([`${n} · ${n - 3} = ${2 * D}`, '   →   ', 'n = ', dF(String(n))]) },
              { tipo: 'sentido', texto: `Comprobación: de cada vértice salen ${n - 3}, y ${n} · ${n - 3} ÷ 2 = ${D}.` },
            ],
            respuesta: ['Tiene ', dF(`${n} lados`)],
          };
        }
        const n = r.de([9, 12, 13, 16]), D = nd(n);
        return {
          enunciado: `En una reunión, ${n} personas se sientan alrededor de una mesa redonda. Cada una da un apretón de manos a cada persona que no está a su lado. ¿Cuántos apretones hay?`,
          datos: [D_DIAG, D_ND],
          pasos: [
            { tipo: 'pide', texto: 'Piden el total de apretones.' },
            { tipo: 'datos', texto: `${n} personas en ronda; no saludan a sus dos vecinos.` },
            { tipo: 'regla', texto: `Cada persona es un vértice de un polígono de ${n} lados; cada apretón une dos que no son vecinos: es una diagonal.` },
            { tipo: 'cuentas', texto: `Cada persona da ${n - 3} apretones, y cada apretón lo cuentan dos personas.`, ecuacion: junto([`${n} · ${n - 3} ÷ 2 = `, dF(f(D))]) },
            { tipo: 'sentido', texto: 'Tiene sentido: es menos que si saludaran a todos, sin quitar a los vecinos.' },
          ],
          respuesta: [dF(`${f(D)} apretones`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Cuenta las de un vértice y no olvides la mitad.',
      generar(s) { return conCuatro([casoTotal, casoNDiag, casoDeVertice, casoVeces, casoMas][s % 5], azar(s + 7), firmasDe(EJ3)); },
    },
  };

  // ======================= Idea 4: el paralelogramo =======================
  // Objeto de la primera pantalla: un marco de madera con pernos en las esquinas, sobre la mesa del taller (geo-objeto,
  // armazon «taller»; dibujo de prueba). Sus listones no cambian: al inclinarlo, sigue con los de enfrente iguales.
  // Cambia: la inclinación m∠A. · Permanece: los listones (60 cm y 40 cm). · Progresa: los otros tres ángulos. · Se
  // reserva: los cordeles en diagonal (la predicción). · Debe verse: m∠C = m∠A y m∠A + m∠B = 180°.
  const D_PARA = 'Paralelogramo: cuadrilátero con sus lados opuestos paralelos de dos en dos.';
  const D_PROP = 'En un paralelogramo, los lados opuestos miden igual y los ángulos opuestos también.';
  const D_VEC = 'En un paralelogramo, dos ángulos vecinos (del mismo lado) suman 180°.';
  const D_DIAGP = 'Las diagonales de un paralelogramo se cortan en su punto medio.';
  const D_ALT = 'Alternos internos entre paralelas: miden igual.';
  const D_ISO = 'En un triángulo isósceles, los ángulos de la base miden igual; y al revés: ángulos iguales, lados iguales.';
  const D_BM = 'Base media: une los puntos medios de dos lados de un triángulo; es paralela al tercero y mide su mitad.';
  const MARCO = { AB: 60, AD: 40 };
  const VMarco = { x: [-38, 99], y: [-14, 54] };
  const ptsPara = (a, b, t) => { const D = U.polar([0, 0], b, t); return [[0, 0], [a, 0], [a + D[0], D[1]], D]; };
  // El marco (o cualquier paralelogramo ABCD con AB = a, AD = b y m∠A = t). o.angulos: rótulos; o.cordeles: AC y BD
  // desde ese corte; o.mira: las piezas de «Mira» por corte.
  function figMarco(t, o = {}) {
    const a = o.a || MARCO.AB, b = o.b || MARCO.AD, P = ptsPara(a, b, t), O = U.medio(P[0], P[2]);
    const ang = {};
    if (o.angulos !== false) {
      // (Holgura grande: el rótulo no toca el borde de los listones.)
      // (Rótulo solo en A y B: con los cuatro, las esquinas chicas no los dejaban caber; la lectura dice C y D.)
      // (Con un ángulo chico, su rótulo se alejaba hasta otra esquina: solo A lleva el suyo.)
      ang.A = { color: 'h', marcas: 1, radio: 16, holgura: 11, texto: `${t}°` }; ang.C = { color: 'h', marcas: 1, radio: 16 };
      ang.B = { color: 'h', marcas: 2, radio: 16 }; ang.D = { color: 'h', marcas: 2, radio: 16 };
    }
    const lados = { AB: { color: 'o', paralela: 1, texto: o.medidas === false ? undefined : cm(a), dist: 9 }, CD: { color: 'o', paralela: 1 }, BC: { color: 'i', paralela: 2 }, AD: { color: 'i', paralela: 2, texto: o.medidas === false ? undefined : cm(b), dist: 9 } };
    if (lados.AB.texto === undefined) delete lados.AB.texto;
    if (lados.AD.texto === undefined) delete lados.AD.texto;
    const pts = [], diag = [], angs = [];
    if (o.cordeles !== undefined) {
      pts.push({ id: 'O', x: O[0], y: O[1], rotulo: 'O', lado: 90, desde: o.cordeles });
      diag.push(['A', 'C', { grosor: 'fino', desde: o.cordeles }], ['B', 'D', { grosor: 'fino', desde: o.cordeles }]);
      // (Sin llaves: en mitades tan cortas, entre los dos cordeles, se enredaban; las mitades las dicen el texto y la ecuación.)
    }
    if (o.mira) {
      // Corte 1: el cordel AC y los alternos internos; corte 4: BD, O y las mitades.
      diag.push(['A', 'C', { grosor: 'fino', desde: 1, hasta: 2 }], ['A', 'C', { grosor: 'fino', desde: 4 }], ['B', 'D', { grosor: 'fino', desde: 4 }]);
      pts.push({ id: 'O', x: O[0], y: O[1], rotulo: 'O', lado: 90, desde: 4 });
      angs.push({ en: 'A', de: 'B', a: 'C', color: 'h', marcas: 1, radio: 22, desde: 1, hasta: 2 }, { en: 'C', de: 'D', a: 'A', color: 'h', marcas: 1, radio: 22, desde: 1, hasta: 2 },
        { en: 'A', de: 'C', a: 'D', color: 'h', marcas: 2, radio: 22, desde: 1, hasta: 2 }, { en: 'C', de: 'A', a: 'B', color: 'h', marcas: 2, radio: 22, desde: 1, hasta: 2 });
      ang.A = { color: 'h', marcas: 1, radio: 16, holgura: 11, texto: `${t}°`, desde: 3, hasta: 3 }; ang.B = { color: 'h', marcas: 2, radio: 16, holgura: 11, texto: `${180 - t}°`, desde: 3, hasta: 3 };

    }
    return figura([poli('ABCD', P, { ang, lados, pts, diag, angs })], { vista: o.vista || VMarco, alto: o.alto || 250,
      obj: o.examen ? {} : { objeto: 'armazon', tipo: 'taller', vigas: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }], pernos: ['A', 'B', 'C', 'D'] },
      sinEscala: o.sinEscala, alt: o.alt || `Un marco de madera ABCD sobre la mesa del taller: los listones AB y CD miden ${cm(a)} y van paralelos; AD y BC miden ${cm(b)} y también van paralelos. La esquina A mide ${t}°.` });
  }
  const MARCO_P = figMarco(60, { angulos: false, cordeles: 1, alt: 'El marco de madera inclinado: la esquina A mide 60°. Después, dos cordeles AC y BD que se cruzan en O; cada uno queda partido en dos mitades iguales.' });
  const MARCO_M = figMarco(60, { angulos: false, mira: true, alt: 'El marco inclinado con el cordel AC: los ángulos alternos internos que forma con los listones paralelos; después, el cordel BD y las mitades de los dos.' });
  // Un paralelogramo de examen con rótulos de ángulos o lados (sin escala si se pide un ángulo).
  const figPara = (a, b, t, o = {}) => figura([poli('ABCD', ptsPara(a, b, t), { ang: o.ang || {}, lados: o.lados || {}, pts: o.pts, diag: o.diag, segs: o.segs, angs: o.angs })],
    { alto: o.alto || 230, sinEscala: o.sinEscala, alt: o.alt, mx: o.mx, evita: o.evita });
  // La bisectriz de A corta BC en E (dibujada de verdad en la figura que se ve; los rótulos dicen los datos del problema).
  function figBisA(lab, o = {}) {
    const a = o.a || 7, b = o.b || 10, t = o.t || 64, P = ptsPara(a, b, t), E = U.mezcla(P[1], P[2], a / b);
    // BC lleva su medida cerca de B; EC, su «?» en su propio tramo, más arriba.
    const lados = { AB: { texto: lab.AB, color: 'o', dist: 8 }, BC: Object.assign({ texto: lab.BC, color: 'i', dist: 8 }, lab.EC ? { en: 0.28 } : {}) };
    if (lab.EC) lados.EC = { texto: lab.EC, dist: 8, ref: 'A' };
    return figPara(a, b, t, { sinEscala: true, alt: o.alt, lados, evita: lab.EC ? { E: [-90, -45, 0, 45, 90] } : undefined,
      pts: [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', lado: 0 }], segs: [{ de: 'A', a: 'E', discontinua: true, grosor: 'fino' }],
      angs: [{ en: 'A', de: 'B', a: 'E', color: 'h', rayita: 1, radio: 20 }, { en: 'A', de: 'E', a: 'D', color: 'h', rayita: 1, radio: 20 }] });
  }

  // Los 15 ejemplos (cuentas.py, idea 4): 200 cm; 65°; 115°; 9 cm; trapecio; 80° (x = 30); 58 cm (x = 7); 26 cm (x = 8);
  // 5 cm (BE = 7); 90°; 24 cm; 3 cm (BE = CF = 6); 55°; 18 cm; 54 cm (BC = 2 · 9).
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'El perímetro del marco',
    figura: fig(figMarco(90, { angulos: false, alt: 'Un marco rectangular de madera: los listones AB y CD miden 60 cm; AD y BC, 40 cm.' })),
    enunciado: 'Un marco de madera tiene la forma del paralelogramo ABCD, con AB = 60 cm y AD = 40 cm. ¿Cuánto mide su perímetro?',
    datos: [D_PROP, D_PER],
    solucion: [{ texto: 'Los lados de enfrente miden igual: CD = 60 cm y BC = 40 cm.', ecuacion: junto(['60 + 40 + 60 + 40 = ', dF('200 cm')]) }],
    respuesta: [dF('200 cm')] });
  EJ4.push({ nivel: 1, titulo: 'La esquina de enfrente',
    figura: fig(figPara(6, 4, 77, { ang: { A: { texto: '65°', color: 'h', marcas: 1 }, C: { texto: '?' } }, sinEscala: true, alt: 'Un paralelogramo ABCD con 65° en A; el ángulo en C, con signo de pregunta.' })),
    enunciado: `En el paralelogramo ABCD, m∠A = 65°. ¿Cuánto mide m∠C?${NO_ESC}`,
    datos: [D_PROP],
    solucion: [{ texto: 'A y C son ángulos opuestos: miden igual.', ecuacion: junto(['m∠C = m∠A = ', dF('65°')]) }],
    respuesta: [junto('m∠C = '), dF('65°')] });
  EJ4.push({ nivel: 1, titulo: 'La esquina vecina',
    figura: fig(figPara(6, 4, 77, { ang: { A: { texto: '65°', color: 'h', marcas: 1 }, B: { texto: '?' } }, sinEscala: true, alt: 'Un paralelogramo ABCD con 65° en A; el ángulo en B, con signo de pregunta.' })),
    enunciado: `En el paralelogramo ABCD, m∠A = 65°. ¿Cuánto mide m∠B?${NO_ESC}`,
    datos: [D_VEC],
    solucion: [{ texto: 'A y B son vecinos, del mismo lado AB: suman 180°.', ecuacion: junto(['m∠B = 180° − 65° = ', dF('115°')]) }],
    respuesta: [junto('m∠B = '), dF('115°')] });
  EJ4.push({ nivel: 1, titulo: 'La mitad del cordel',
    enunciado: 'En el paralelogramo ABCD, las diagonales se cortan en O y AC = 18 cm. ¿Cuánto mide AO?',
    datos: [D_DIAGP],
    solucion: [{ texto: 'O es el punto medio de AC:', ecuacion: junto(['AO = 18 ÷ 2 = ', dF('9 cm')]) }],
    respuesta: [junto('AO = '), dF('9 cm')] });
  EJ4.push({ nivel: 1, titulo: '¿Es paralelogramo?',
    enunciado: 'El cuadrilátero ABCD tiene AD ∥ BC, pero AB y CD no son paralelos. ¿Es un paralelogramo?',
    datos: [D_PARA, 'Trapecio: cuadrilátero con un solo par de lados paralelos. Trapezoide: sin lados paralelos.'],
    solucion: [{ texto: 'Un paralelogramo pide dos pares de lados paralelos; ABCD tiene uno solo.' }],
    respuesta: [dF('No'), ': es un trapecio'] });

  EJ4.push({ nivel: 2, titulo: 'Dos ángulos vecinos con x',
    figura: fig(figPara(6, 4, 70, { ang: { A: { texto: '2x + 20°', color: 'h', marcas: 1 }, B: { texto: '3x + 10°', color: 'h', marcas: 2 }, C: { texto: '?' } }, sinEscala: true, alt: 'Un paralelogramo ABCD con 2x + 20° en A y 3x + 10° en B; el ángulo en C, con signo de pregunta.' })),
    enunciado: `En el paralelogramo ABCD, m∠A = 2x + 20° y m∠B = 3x + 10°. ¿Cuánto mide m∠C?${NO_ESC}`,
    datos: [D_VEC, D_PROP],
    solucion: [{ texto: 'A y B son vecinos: suman 180°.', ecuacion: junto(['5x + 30° = 180°', '   →   ', 'x = 30']) },
      { texto: 'C es opuesto a A:', ecuacion: junto(['m∠C = m∠A = 2 · 30° + 20° = ', dF('80°')]) }],
    respuesta: [junto('m∠C = '), dF('80°')] });
  EJ4.push({ nivel: 2, titulo: 'Lados con x',
    enunciado: 'En el paralelogramo ABCD, AB = 3x − 4, CD = x + 10 y AD = 12, en centímetros. ¿Cuánto mide su perímetro?',
    datos: [D_PROP, D_PER],
    solucion: [{ texto: 'AB y CD son opuestos:', ecuacion: junto(['3x − 4 = x + 10', '   →   ', 'x = 7', '   →   ', 'AB = 17']) },
      { texto: 'BC = AD = 12:', ecuacion: junto(['2 · 17 + 2 · 12 = ', dF('58 cm')]) }],
    respuesta: [dF('58 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Las mitades de una diagonal',
    enunciado: 'En el paralelogramo ABCD, las diagonales se cortan en O; AO = x + 5 y OC = 2x − 3, en centímetros. ¿Cuánto mide AC?',
    datos: [D_DIAGP],
    solucion: [{ texto: 'O es el punto medio de AC:', ecuacion: junto(['x + 5 = 2x − 3', '   →   ', 'x = 8', '   →   ', 'AO = 13']) },
      { texto: 'AC tiene dos mitades:', ecuacion: junto(['2 · 13 = ', dF('26 cm')]) }],
    respuesta: [junto('AC = '), dF('26 cm')] });
  EJ4.push({ nivel: 2, titulo: 'La bisectriz y el isósceles',
    figura: fig(figBisA({ AB: '7 cm', BC: '12 cm' }, { alt: 'Un paralelogramo ABCD con AB de 7 cm y BC de 12 cm; la bisectriz del ángulo A corta BC en E.' })),
    enunciado: `En el paralelogramo ABCD, AB = 7 cm y BC = 12 cm. La bisectriz del ángulo A corta BC en E. ¿Cuánto mide EC?${NO_ESC}`,
    datos: [D_BIS, D_ALT, D_ISO],
    solucion: [{ texto: 'AD ∥ BC: el ángulo AEB es alterno interno con EAD, que es la mitad de A. Así, m∠BAE = m∠AEB: △ABE es isósceles.', ecuacion: junto('BE = AB = 7 cm') },
      { texto: 'Lo que queda de BC:', ecuacion: junto(['EC = 12 − 7 = ', dF('5 cm')]) }],
    respuesta: [junto('EC = '), dF('5 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Dos bisectrices vecinas',
    enunciado: 'En el paralelogramo ABCD, las bisectrices de los ángulos A y B se cortan en P. ¿Cuánto mide m∠APB?',
    datos: [D_VEC, D_BIS, D_TRI],
    solucion: [{ texto: 'A y B suman 180°; sus mitades, 90°.' },
      { texto: 'En el triángulo APB:', ecuacion: junto(['m∠APB = 180° − 90° = ', dF('90°')]) }],
    respuesta: [junto('m∠APB = '), dF('90°')] });

  // Nivel 3: la correcta en A, D, B, C y E.
  EJ4.push({ nivel: 3, titulo: 'Los puntos medios de un trapezoide',
    figura: fig(figVarignon({ alt: 'Un trapezoide ABCD con sus diagonales AC de 10 cm y BD de 14 cm; M, N, P y Q son los puntos medios de sus lados.' })),
    enunciado: 'En el trapezoide ABCD, las diagonales miden AC = 10 cm y BD = 14 cm. M, N, P y Q son los puntos medios de AB, BC, CD y DA. ¿Cuánto mide el perímetro de MNPQ?',
    alternativas: ['24 cm', '12 cm', '48 cm', '14 cm', '17 cm'],
    datos: [D_BM, D_PER],
    solucion: [{ texto: 'En △ABC, MN es base media: mide AC ÷ 2 = 5 cm; en △ACD, PQ también. En △ABD y △BCD, QM y NP miden BD ÷ 2 = 7 cm.' },
      { texto: 'Perímetro:', ecuacion: junto(['5 + 7 + 5 + 7 = ', dF('24 cm')]) },
      { texto: '12 cm es la mitad (un lado de cada clase); 48 cm suma las diagonales dos veces; 14 cm suma solo dos lados de 7; 17 cm, 10 + 7.' }],
    respuesta: [dF('24 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Dos bisectrices que se cruzan',
    enunciado: 'En el paralelogramo ABCD, AB = 6 cm y BC = 15 cm. Las bisectrices de los ángulos A y D cortan BC en E y F. ¿Cuánto mide EF?',
    alternativas: ['9 cm', '6 cm', '12 cm', '3 cm', '15 cm'],
    datos: [D_BIS, D_ALT, D_ISO],
    solucion: [{ texto: 'Como en el isósceles ABE, BE = AB = 6 cm; del mismo modo, en △DCF, CF = CD = 6 cm.' },
      { texto: 'Sobre BC quedan, en orden, B, E, F y C:', ecuacion: junto(['EF = 15 − 6 − 6 = ', dF('3 cm')]) },
      { texto: '9 cm es EC (15 − 6); 6 cm es BE; 12 cm suma BE y CF; 15 cm es BC entero.' }],
    respuesta: [dF('3 cm')] });
  EJ4.push({ nivel: 3, titulo: 'El ángulo de la bisectriz',
    figura: fig(figPara(6, 9, 95, { sinEscala: true, ang: { D: { texto: '110°', color: 'h', marcas: 2 } },
      pts: [{ id: 'E', x: ptsPara(6, 9, 95)[3][0] * 0.62, y: ptsPara(6, 9, 95)[3][1] * 0.62, rotulo: 'E', lado: 180 }],
      segs: [{ de: 'B', a: 'E', discontinua: true, grosor: 'fino' }], angs: [{ en: 'E', de: 'A', a: 'B', texto: '?', radio: 16 }],
      alt: 'Un paralelogramo ABCD con 110° en D; la bisectriz del ángulo B corta AD en E, y el ángulo AEB lleva signo de pregunta.' })),
    enunciado: `En el paralelogramo ABCD, m∠D = 110°. La bisectriz del ángulo B corta AD en E. ¿Cuánto mide m∠AEB?${NO_ESC}`,
    alternativas: ['110°', '55°', '70°', '35°', '125°'],
    datos: [D_PROP, D_BIS, D_ALT],
    solucion: [{ texto: 'B es opuesto a D: m∠B = 110°, y la bisectriz lo parte en dos de 55°.' },
      { texto: 'AD ∥ BC: m∠AEB es alterno interno con m∠EBC.', ecuacion: junto(['m∠AEB = ', dF('55°')]) },
      { texto: '110° es B entero; 70° es A; 35° es la mitad de A; 125° es 180° − 55°, el ángulo BED.' }],
    respuesta: [junto('m∠AEB = '), dF('55°')] });
  EJ4.push({ nivel: 3, titulo: 'Un lado el doble del otro',
    enunciado: 'El perímetro del paralelogramo ABCD es 54 cm y AB mide el doble de BC. ¿Cuánto mide AB?',
    alternativas: ['9 cm', '27 cm', '18 cm', '36 cm', '13,5 cm'],
    datos: [D_PROP, D_PER],
    solucion: [{ texto: 'Si BC = x, AB = 2x, y los cuatro lados suman 54:', ecuacion: junto(['2x + x + 2x + x = 6x = 54', '   →   ', 'x = 9']) },
      { texto: 'AB = 2 · 9:', ecuacion: junto(['AB = ', dF('18 cm')]) },
      { texto: '9 cm es BC; 27 cm es la mitad del perímetro; 36 cm sale de 3x = 54; 13,5 cm, de 4x = 54.' }],
    respuesta: [junto('AB = '), dF('18 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Bisectrices que se juntan en BC',
    enunciado: 'En el paralelogramo ABCD, las bisectrices de los ángulos A y D se cortan en un punto P de BC, y AB = 9 cm. ¿Cuánto mide el perímetro de ABCD?',
    alternativas: ['36 cm', '27 cm', '72 cm', '45 cm', '54 cm'],
    datos: [D_BIS, D_ALT, D_ISO, D_PER],
    solucion: [{ texto: 'Por los alternos internos, △ABP es isósceles: BP = AB = 9 cm; y △DCP también: PC = CD = 9 cm.', ecuacion: junto('BC = 9 + 9 = 18 cm') },
      { texto: 'Perímetro:', ecuacion: junto(['2 · 9 + 2 · 18 = ', dF('54 cm')]) },
      { texto: '36 cm toma los cuatro lados de 9; 27 cm suma AB y BC; 45 cm olvida un lado de 9; 72 cm cuenta dos veces BC.' }],
    respuesta: [dF('54 cm')] });

  // Los puntos medios de un trapezoide (Varignon, sin el nombre): con sus diagonales y el cuadrilátero de adentro.
  function figVarignon(o = {}) {
    const P = [[0, 0], [7, -0.6], [6.2, 4.4], [1.4, 3.4]], ids = 'ABCD', M = P.map((p, k) => U.medio(p, P[(k + 1) % 4]));
    const pts = M.map((p, k) => ({ id: 'MNPQ'[k], x: p[0], y: p[1], rotulo: 'MNPQ'[k], lado: 90 }));
    void ids;
    return figura([poli('ABCD', P, { pts, diag: [['A', 'C', { color: 'o', grosor: 'fino' }], ['B', 'D', { color: 'i', grosor: 'fino' }]],
      segs: [{ de: 'M', a: 'N' }, { de: 'N', a: 'P' }, { de: 'P', a: 'Q' }, { de: 'Q', a: 'M' }],
      lados: {} })],
    { alto: 240, alt: o.alt });
  }

  // «Ahora tú» de la idea 4: ángulos con x; perímetro con x; las mitades de una diagonal; la bisectriz que arma un
  // isósceles; los puntos medios de un trapezoide.
  function casoAngP(r) {
    for (let t = 0; t < 300; t++) {
      const vecino = r() < 0.5, x = r.ent(8, 40), p = r.ent(2, 4), q = 5 * r.ent(0, 6), A = p * x + q;
      if (A < 35 || A > 145) continue;
      let ex2, otro, pide, val;
      if (vecino) { const B = 180 - A, p2 = r.ent(1, 3), q2 = B - p2 * x; if (q2 < -40 || q2 > 120 || p2 === p) continue; ex2 = exAng(p2, q2); otro = 'B'; pide = 'C'; val = A; }
      else { const p2 = r.ent(1, 3), q2 = A - p2 * x; if (q2 < 0 || q2 > 140 || p2 === p) continue; ex2 = exAng(p2, q2); otro = 'C'; pide = 'B'; val = 180 - A; }
      const pq = `m∠A = ${exAng(p, q)} y m∠${otro} = ${ex2}`;
      // (Sin escala: de tres inclinaciones, la que dibuja el ángulo pedido más lejos de su valor.)
      const tDib = [55, 70, 85].sort((p1, p2) => Math.abs((pide === 'C' ? p2 : 180 - p2) - val) - Math.abs((pide === 'C' ? p1 : 180 - p1) - val))[0];
      const F = figPara(6, 4, tDib, { sinEscala: true, ang: { A: { texto: exAng(p, q), color: 'h', marcas: 1 }, [otro]: { texto: ex2, color: 'h', marcas: otro === 'B' ? 2 : 1 }, [pide]: { texto: '?' } }, alt: `Un paralelogramo ABCD con ${pq.replace(' y ', ', ')}; el ángulo en ${pide}, con signo de pregunta.` });
      if (!cabe(F)) continue;
      return { pregunta: `En el paralelogramo ABCD, ${pq}. ¿Cuánto mide m∠${pide}?${NO_ESC}`, datos: [D_PROP, D_VEC], dibujo: fig(F),
        opciones: opciones(val, OPS(r, [
          { id: 'x', valor: x, error: 'GE-CON30', siFuera: `x = ${x} está bien; falta reemplazarlo para tener el ángulo.` },
          { id: 'otro', valor: 180 - val, error: 'GE-PC5', siFuera: `${gr(180 - val)} es el vecino de m∠${pide}; ${pide === 'C' ? 'C es opuesto a A: mide igual que A' : 'B es vecino de A: suman 180°'}.` },
          { id: 'recto', valor: 90, error: 'GE-PC7', siFuera: 'Cada ángulo mediría 90° solo en un rectángulo; aquí no son rectos.' }]), gr),
        solucion: { texto: vecino ? 'A y B son vecinos: suman 180°. Con x, C es opuesto a A.' : 'A y C son opuestos: miden igual. Con x, B completa 180° con A.', ecuacion: junto([`x = ${x}`, '   →   ', `m∠${pide} = `, dF(gr(val))]) } };
    }
    throw new Error('casoAngP sin caso');
  }
  // «3x + 10°», «x − 5°», «2x».
  function exAng(p, q) { return `${p === 1 ? '' : p}x${q ? ` ${q < 0 ? '−' : '+'} ${Math.abs(q)}°` : ''}`; }
  const exL = (p, q) => `${p === 1 ? '' : p}x${q ? ` ${q < 0 ? '−' : '+'} ${Math.abs(q)}` : ''}`;
  function casoPerP(r) {
    for (let t = 0; t < 300; t++) {
      const x = r.ent(3, 12), p = r.ent(2, 4), q = r.ent(-6, 6), s = (p - 1) * x + q, ad = r.ent(5, 20), AB = p * x + q;
      if (AB < 4 || s === 0 || AB === ad || (x === 7 && p === 3)) continue;
      const per = 2 * (AB + ad);
      return { pregunta: `En el paralelogramo ABCD, AB = ${exL(p, q)}, CD = ${exL(1, s)} y AD = ${ad}, en centímetros. ¿Cuánto mide su perímetro?`, datos: [D_PROP, D_PER],
        opciones: opciones(per, OPS(r, [
          { id: 'mitad', valor: AB + ad, error: 'GE-PC8', siFuera: `Hallar AB = ${cm(AB)} está bien; el perímetro suma los cuatro lados, no dos.` },
          { id: 'tres', valor: 2 * AB + ad, error: 'GE-PC9', siFuera: 'Sumar lados está bien; BC mide lo mismo que AD y también va.' },
          { id: 'x', valor: 2 * (x + ad), error: 'GE-CON30', siFuera: `x = ${x} está bien; AB no es x: es ${exL(p, q)} = ${AB}.` }]), cm),
        solucion: { texto: `AB y CD son opuestos: ${exL(p, q)} = ${exL(1, s)}, x = ${x} y AB = ${AB}.`, ecuacion: junto([`2 · ${AB} + 2 · ${ad} = `, dF(cm(per))]) } };
    }
    throw new Error('casoPerP sin caso');
  }
  function casoDiagP(r) {
    for (let t = 0; t < 300; t++) {
      const x = r.ent(3, 15), p = r.ent(2, 4), q = r.ent(-8, 5), h = p * x + q, s = h - x;
      if (h < 4 || s === 0 || (x === 8 && p === 2)) continue;
      const cual = r.de([['A', 'C'], ['B', 'D']]);
      return { pregunta: `En el paralelogramo ABCD, las diagonales se cortan en O; ${cual[0]}O = ${exL(p, q)} y O${cual[1]} = ${exL(1, s)}, en centímetros. ¿Cuánto mide ${cual.join('')}?`, datos: [D_DIAGP],
        opciones: opciones(2 * h, OPS(r, [
          { id: 'mitad', valor: h, error: 'GE-PC10', siFuera: `${cm(h)} es ${cual[0]}O, la mitad; ${cual.join('')} tiene dos mitades.` },
          { id: 'x', valor: x, error: 'GE-CON30', siFuera: `x = ${x} está bien; falta reemplazarlo y duplicar.` },
          { id: 'cuatro', valor: 4 * h, error: 'GE-PC11', siFuera: `Duplicar está bien una vez; ${cm(2 * h)} ya es la diagonal entera.` }]), cm),
        solucion: { texto: `O es el punto medio: ${exL(p, q)} = ${exL(1, s)}, x = ${x} y ${cual[0]}O = ${h}.`, ecuacion: junto([`${cual.join('')} = 2 · ${h} = `, dF(cm(2 * h))]) } };
    }
    throw new Error('casoDiagP sin caso');
  }
  function casoBisP(r) {
    for (let t = 0; t < 300; t++) {
      const ab = r.ent(4, 12), bc = ab + r.ent(2, 9);
      if (ab === 7 && bc === 12) continue;
      const F = figBisA({ AB: cm(ab), BC: cm(bc), EC: '?' }, { alt: `Un paralelogramo ABCD con AB de ${cm(ab)} y BC de ${cm(bc)}; la bisectriz del ángulo A corta BC en E, y EC lleva signo de pregunta.` });
      if (!cabe(F)) continue;
      return { pregunta: `En el paralelogramo ABCD, AB = ${cm(ab)} y BC = ${cm(bc)}. La bisectriz del ángulo A corta BC en E. ¿Cuánto mide EC?${NO_ESC}`, datos: [D_BIS, D_ALT, D_ISO], dibujo: fig(F),
        opciones: opciones(bc - ab, OPS(r, [
          { id: 'be', valor: ab, error: 'GE-PC12', siFuera: `BE = ${cm(ab)} está bien (△ABE es isósceles); se pide lo que queda, EC.` },
          { id: 'medio', valor: bc / 2, error: 'GE-PC13', siFuera: 'La bisectriz parte el ángulo, no el lado BC: E no es su punto medio.' },
          { id: 'suma', valor: ab + bc, error: 'GE-PC14', siFuera: `Usar AB y BC está bien; EC es lo que queda de BC sin BE: se resta.` }]), cm),
        solucion: { texto: 'Por los alternos internos, m∠BAE = m∠AEB: △ABE es isósceles y BE = AB.', ecuacion: junto([`EC = ${bc} − ${ab} = `, dF(cm(bc - ab))]) } };
    }
    throw new Error('casoBisP sin caso');
  }
  function casoVar(r) {
    for (let t = 0; t < 300; t++) {
      const p = 2 * r.ent(3, 11), q = 2 * r.ent(3, 11);
      if (p === q || (p === 10 && q === 14) || (p === 14 && q === 10)) continue;
      return { pregunta: `En el trapezoide ABCD, las diagonales miden AC = ${cm(p)} y BD = ${cm(q)}. M, N, P y Q son los puntos medios de AB, BC, CD y DA. ¿Cuál es el perímetro de MNPQ?`, datos: [D_BM, D_PER],
        opciones: opciones(p + q, OPS(r, [
          { id: 'mitad', valor: (p + q) / 2, error: 'GE-PC15', siFuera: `Cada lado mide la mitad de una diagonal, sí; pero hay dos de cada una: ${p / 2} + ${q / 2} + ${p / 2} + ${q / 2}.` },
          { id: 'doble', valor: 2 * (p + q), error: 'GE-PC16', siFuera: 'Ver las bases medias está bien; cada una mide la mitad de su diagonal, no la diagonal entera.' },
          { id: 'una', valor: p + q / 2, error: 'GE-PC15', siFuera: `Ver las bases medias está bien; las dos paralelas a BD miden ${q / 2} cada una.` }]), cm),
        solucion: { texto: `MN y PQ son bases medias paralelas a AC: miden ${p / 2}; NP y QM, paralelas a BD, miden ${q / 2}.`, ecuacion: junto([`${p / 2} + ${q / 2} + ${p / 2} + ${q / 2} = `, dF(cm(p + q))]) } };
    }
    throw new Error('casoVar sin caso');
  }

  const paralelogramos = {
    id: 'paralelogramos',
    titulo: 'El paralelogramo y sus propiedades',
    pregunta: '¿Qué no cambia cuando un marco de madera se inclina?',
    temas: ['Paralelogramos', 'Trapezoides'],
    pieza: GO,
    aprendizaje: 'En un paralelogramo, los lados opuestos y los ángulos opuestos miden igual, dos vecinos suman 180° y las diagonales se cortan en su punto medio.',
    actividad: 'Inclinar un marco de madera y mirar qué pasa con sus cuatro esquinas.',
    // Lee: los nombres por lados paralelos (paralelogramo, trapecio, trapezoide). No dice qué pasa con las diagonales (la
    // predicción) ni con los ángulos (el juego).
    lee: {
      tarjetas: [
        { titulo: 'Un marco que se inclina', texto: 'Don Julián armó un marco con dos listones de 60 cm y dos de 40 cm, con un perno en cada esquina. Puede inclinarlo, pero los listones no cambian de largo.',
          pieza: GO, dibujo: fig(figMarco(70, { angulos: false, alt: 'Un marco de madera ABCD inclinado, con un perno en cada esquina: AB y CD de 60 cm, AD y BC de 40 cm.' })) },
        { titulo: 'Lados de enfrente', texto: 'En un cuadrilátero ABCD, AB y CD son lados opuestos, como AD y BC; A y C son ángulos opuestos, como B y D. Las flechitas iguales marcan lados paralelos.' },
        { titulo: 'Nombres por los paralelos', texto: 'Con dos pares de lados paralelos, el cuadrilátero es un paralelogramo; con un solo par, un trapecio; sin lados paralelos, un trapezoide.' },
        { titulo: 'Qué mirar al jugar', texto: 'Inclina el marco y mira las cuatro esquinas: cuáles miden igual y cuánto suman dos vecinas.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'Un marco de 60 cm por 40 cm se inclina sin que sus listones cambien de largo.',
      mision: {
        texto: 'Inclina el marco (arrastra D o usa el control) hasta que la esquina B mida 110°.',
        logrado: v => v.t === 70,
        bien: 'B mide 110° y D también; A y C miden 70°.',
      },
      voz: 'Inclínalo: ¿qué esquinas se abren juntas?',
      leyenda: [
        { s: 'A, B, C, D', t: 'las esquinas del marco; D se arrastra' },
        { s: dO('AB, CD'), t: 'los listones de 60 cm' },
        { s: dI('AD, BC'), t: 'los listones de 40 cm' },
        { s: dH('m∠A'), t: 'cuánto se abre la esquina A' },
        { s: 'flechitas', t: 'lados paralelos' },
      ],
      controles: [{ id: 't', etiqueta: 'm∠A, la esquina A', min: 50, max: 130, paso: 10, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figMarco(v.t), estado: {} }),
      arrastres: [{ id: 'vertice-d', etiqueta: 'esquina D del marco: gira el listón AD alrededor de A', color: 'c-i',
        donde: v => PO.aPantalla(figMarco(v.t), U.polar([0, 0], MARCO.AD, v.t)),
        mover: (pt, v) => { const q = PO.aPlano(figMarco(v.t), pt); return { t: U.grados(Math.atan2(Math.max(q[1], 0.05), q[0])) }; } }],
      lectura: v => [dH(junto(`m∠A = ${v.t}°`)), junto(`: m∠C = ${v.t}°; m∠B = m∠D = ${180 - v.t}°`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Don Julián ata dos cordeles en diagonal al marco inclinado: uno de A a C y otro de B a D. ¿Qué pasa siempre, se incline como se incline?',
      datos: ['Los listones de enfrente miden igual: dos de 60 cm y dos de 40 cm.'],
      voz: 'Imagina el marco muy inclinado y casi recto.',
      opciones: [
        { id: 'c', texto: 'Se cortan justo en la mitad de cada uno', correcta: true },
        { id: 'iguales', texto: 'Los dos cordeles miden lo mismo', error: 'GE-PC1', siFuera: 'Medirían igual con el marco recto; al inclinarlo, uno se alarga y el otro se acorta.' },
        { id: 'recto', texto: 'Se cortan en ángulo recto', error: 'GE-PC2', siFuera: 'Se cortarían en ángulo recto si los cuatro listones midieran igual; aquí no.' },
        { id: 'nada', texto: 'Nada fijo: depende de cuánto se incline', error: 'GE-PC3', siFuera: 'Los largos sí dependen de eso; pero el cruce siempre parte a los dos en mitades.' },
      ],
      dibujo: fig(MARCO_P, { corte: 0 }),
      revelar: fig(MARCO_P, { corte: 1 }),
      coincide: 'Coincide: se cruzan en O, la mitad de cada cordel: AO = OC y BO = OD.',
      noCoincide: 'Revisemos: los cordeles se cruzan en O, y O es la mitad de cada uno: AO = OC y BO = OD.',
    },
    mira: {
      pieza: GO,
      datos: MARCO_M,
      voz: 'El cordel parte el marco en dos triángulos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Los listones de enfrente van paralelos.', ecuacion: junto([dO('AB'), ' ∥ ', dO('CD'), Y, dI('AD'), ' ∥ ', dI('BC')]) },
        { estado: { corte: 1 }, texto: 'El cordel AC corta las paralelas: los alternos internos miden igual.', ecuacion: junto(['m∠BAC = m∠DCA', Y, 'm∠DAC = m∠BCA']) },
        { estado: { corte: 2 }, texto: 'AC es de los dos triángulos: △ABC ≅ △CDA, por ALA.', ecuacion: junto(['AB = CD', Y, 'BC = DA', Y, 'm∠B = m∠D']) },
        { estado: { corte: 3 }, texto: 'A y B quedan entre AD ∥ BC: son conjugados internos.', ecuacion: junto([dH('60°'), ' + ', dH('120°'), ' = 180°']) },
        { estado: { corte: 4 }, texto: 'Con BD, △AOB ≅ △COD por ALA: cada cordel queda partido en mitades.', ecuacion: junto(['AO = OC', Y, 'BO = OD']) },
      ],
    },
    regla: {
      texto: 'En un paralelogramo, los lados opuestos miden igual, los ángulos opuestos también, dos ángulos vecinos suman 180° y las diagonales se cortan en su punto medio.',
      ecuacion: junto([dO('AB'), ' = ', dO('CD'), Y, dH('m∠A'), ' = ', dH('m∠C'), Y, dH('m∠A'), ' + ', dH('m∠B'), ' = 180°', Y, 'AO = OC']),
      condicion: 'los lados opuestos son paralelos de dos en dos. Al revés también: si los lados opuestos miden igual, es paralelogramo.',
      voz: 'Enfrente, iguales; vecinos, 180°.',
    },
    // Así se resuelve: dos bisectrices vecinas (90°) o un perímetro con la diagonal partida.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const A = 5 * r.ent(9, 26);
          return {
            enunciado: `En el paralelogramo ABCD, m∠A = ${A}°. Las bisectrices de los ángulos A y B se cortan en P. ¿Cuánto mide m∠APB?`,
            datos: [D_VEC, D_BIS, D_TRI],
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo en P, entre las dos bisectrices.' },
              { tipo: 'datos', texto: `m∠A = ${A}°; A y B son vecinos.` },
              { tipo: 'regla', texto: 'Dos ángulos vecinos de un paralelogramo suman 180°.', ecuacion: junto(`m∠B = 180° − ${A}° = ${180 - A}°`) },
              { tipo: 'cuentas', texto: `Las mitades: ${f(A / 2)}° y ${f((180 - A) / 2)}°, que suman 90°. En el triángulo APB:`, ecuacion: junto(['m∠APB = 180° − 90° = ', dF('90°')]) },
              { tipo: 'sentido', texto: `No dependía de los ${A}°: con cualquier inclinación, las mitades de dos vecinos suman 90°.` },
            ],
            respuesta: [junto('m∠APB = '), dF('90°')],
          };
        }
        const ao = r.ent(5, 12), bo = r.ent(3, 9), ab = r.ent(Math.abs(ao - bo) + 2, ao + bo - 1);
        return {
          enunciado: `En el paralelogramo ABCD, las diagonales se cortan en O; AC = ${cm(2 * ao)}, BD = ${cm(2 * bo)} y AB = ${cm(ab)}. ¿Cuál es el perímetro del triángulo COD?`,
          datos: [D_DIAGP, D_PROP, 'El perímetro de un triángulo es la suma de sus tres lados.'],
          pasos: [
            { tipo: 'pide', texto: 'Piden OC + OD + CD.' },
            { tipo: 'datos', texto: `Las dos diagonales y el lado AB = ${cm(ab)}.` },
            { tipo: 'regla', texto: 'Las diagonales se cortan en su punto medio, y CD es opuesto a AB.' },
            { tipo: 'cuentas', texto: `OC = ${2 * ao} ÷ 2 = ${ao}; OD = ${2 * bo} ÷ 2 = ${bo}; CD = AB = ${ab}.`, ecuacion: junto([`${ao} + ${bo} + ${ab} = `, dF(cm(ao + bo + ab))]) },
            { tipo: 'sentido', texto: 'Es el mismo perímetro que el de △AOB: los dos triángulos son congruentes.' },
          ],
          respuesta: [dF(cm(ao + bo + ab))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Enfrente, iguales; vecinos, 180°.',
      generar(s) { return conCuatro([casoAngP, casoPerP, casoDiagP, casoBisP, casoVar][s % 5], azar(s + 7), firmasDe(EJ4)); },
    },
  };
  // ======================= Idea 5: rectángulo, rombo y cuadrado =======================
  // Objeto de la primera pantalla: el marco de una ventana con dos cordeles en diagonal (geo-objeto, armazon «taller»;
  // dibujo de prueba). El carpintero mide los dos cordeles: si miden igual, el marco quedó a escuadra.
  // Cambia: la inclinación m∠A. · Permanece: los listones (80 cm y 60 cm). · Progresa: un cordel crece y el otro baja.
  // · Se reserva: el marco de cuatro listones iguales (la predicción). · Debe verse: iguales solo con 90°.
  const D_RECT = 'Rectángulo: paralelogramo con sus cuatro ángulos rectos. Sus diagonales miden igual.';
  const D_ROMBO = 'Rombo: paralelogramo con sus cuatro lados iguales. Sus diagonales son perpendiculares y parten sus ángulos por la mitad.';
  const D_CUADR = 'Cuadrado: es rectángulo y rombo a la vez.';
  const D_PIT = 'En un triángulo rectángulo, catetos de 3k y 4k dan una hipotenusa de 5k (3² + 4² = 5²).';
  const D_N37 = 'Notable de 37° y 53° (convención del examen): catetos 3k (frente a 37°) y 4k; hipotenusa 5k.';
  const VEN = { AB: 80, AD: 60 };
  const VVen = { x: [-36, 118], y: [-14, 66] };
  const diagsDe = (a, b, t) => { const P = ptsPara(a, b, t); return { ac: U.dist(P[0], P[2]), bd: U.dist(P[1], P[3]) }; };
  const cmA = v => (exacto(v) ? cm(v) : `≈ ${cm(v)}`);
  function figVentana(t, o = {}) {
    const P = ptsPara(VEN.AB, VEN.AD, t);
    return figura([poli('ABCD', P, { ang: { A: { color: 'h', radio: 16 } },
      lados: { AB: { texto: cm(VEN.AB), dist: 9 }, AD: { texto: cm(VEN.AD), dist: 9 } },
      diag: [['A', 'C', { color: 'o', grosor: 'variable' }], ['B', 'D', { color: 'i', grosor: 'variable' }]] })],
    { vista: VVen, alto: 250, obj: { objeto: 'armazon', tipo: 'taller', vigas: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }], pernos: ['A', 'B', 'C', 'D'] },
      alt: o.alt || `El marco de una ventana, de 80 cm por 60 cm, con la esquina A de ${t}°; dos cordeles van en diagonal, de A a C y de B a D.` });
  }
  // El marco de cuatro listones de 50 cm (el rombo), con la esquina A de 60°. Cortes: 1, los cordeles y su cruce;
  // 2, las mitades de A; o.mira, las llaves de los lados.
  function figRomboMarco(o = {}) {
    const P = ptsPara(50, 50, 60), O = U.medio(P[0], P[2]);
    // (Sin llaves: sobre los listones se confundían con la madera; los 50 cm los dicen los datos y el paso.)
    const lados = {};
    return figura([poli('ABCD', P, { lados, pts: [{ id: 'O', x: O[0], y: O[1], rotulo: 'O', lado: 345, desde: 1 }],
      diag: [['A', 'C', { color: 'o', grosor: 'variable', desde: 1 }], ['B', 'D', { color: 'i', grosor: 'variable', desde: 1 }]],
      angs: [{ en: 'O', de: 'C', a: 'D', radio: 10, desde: 1 }].concat(o.mira ? [{ en: 'A', de: 'B', a: 'C', color: 'h', rayita: 1, radio: 22, desde: 2 }, { en: 'A', de: 'C', a: 'D', color: 'h', rayita: 1, radio: 22, desde: 2 }] : []),
      ang: { A: o.mira ? { color: 'h', radio: 15, holgura: 11, texto: '60°', hasta: 0 } : { color: 'h', radio: 15 } } })],
    { vista: { x: [-14, 92], y: [-12, 54] }, alto: 240, obj: { objeto: 'armazon', tipo: 'taller', vigas: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }], pernos: ['A', 'B', 'C', 'D'] },
      alt: 'Un marco de cuatro listones de 50 cm, inclinado: la esquina A mide 60°. Después, los cordeles AC y BD, que se cruzan en O.' });
  }
  const ROMBO_P = figRomboMarco(), ROMBO_M = figRomboMarco({ mira: true });
  // Rectángulo con sus diagonales y el ángulo entre ellas en O (sin escala: se pide un ángulo).
  function figRect(th, pide, o = {}) {
    // (Más alto que ancho a medias: con un ángulo OAB muy chico, su «?» quedaba más cerca de O que de A.)
    const P = [[0, 0], [6, 0], [6, 5.6], [0, 5.6]], O = [3, 2.8];
    const angs = [{ en: 'O', de: 'A', a: 'B', color: 'h', texto: `${th}°`, radio: 14 }];
    if (pide) angs.push({ en: pide[0], de: pide[1], a: pide[2], texto: '?', radio: 14, holgura: 3 });
    return figura([poli('ABCD', P, { pts: [{ id: 'O', x: O[0], y: O[1], rotulo: 'O', lado: 90 }], diag: [['A', 'C', { color: 'o', grosor: 'variable' }], ['B', 'D', { color: 'i', grosor: 'variable' }]], angs })],
      { alto: 262, mx: 0.7, sinEscala: true, alt: o.alt });
  }
  // Rombo de examen con el ángulo A dado y la diagonal BD (sin escala).
  // o.resp: el valor del ángulo pedido; la esquina A se dibuja (52°, 72° o 100°) donde el pedido quede más lejos de él.
  function figRombo(texA, pide, o = {}) {
    const dib = A => (pide && pide[0] === 'A' ? A / 2 : (180 - A) / 2);
    const aDib = o.resp === undefined ? 72 : [52, 72, 100].sort((p, q) => Math.abs(dib(q) - o.resp) - Math.abs(dib(p) - o.resp))[0];
    const P = ptsPara(5, 5, aDib);
    const angs = pide ? [{ en: pide[0], de: pide[1], a: pide[2], texto: '?', radio: 18 }] : [];
    return figura([poli('ABCD', P, { ang: { A: { color: 'h', radio: 16, texto: texA } }, lados: { AB: { llave: 1, dist: 8 }, BC: { llave: 1, dist: 8 }, CD: { llave: 1, dist: 8 }, DA: { llave: 1, dist: 8 } },
      diag: [['B', 'D', { color: 'i', grosor: 'variable' }]].concat(o.ac ? [['A', 'C', { color: 'o', grosor: 'variable' }]] : []), angs })], { alto: 230, sinEscala: true, alt: o.alt });
  }
  // Cuadrado ABCD con el equilátero BCE adentro (o afuera): se pide m∠BAE. Sin escala: se estira en vertical.
  function figCuadEq(afuera, o = {}) {
    const P = [[0, 0], [5, 0], [5, 6.2], [0, 6.2]];
    // (Sin escala a propósito: E no queda donde lo pondría el equilátero, y el ángulo pedido no mide su valor.)
    const E = afuera ? [6.6, 3.1] : [1.67, 3.1];
    return figura([poli('ABCD', P, { pts: [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', lado: afuera ? 0 : 180 }],
      segs: [{ de: 'B', a: 'E' }, { de: 'C', a: 'E' }, { de: 'A', a: 'E', discontinua: true, grosor: 'fino' }],
      angs: [{ en: 'A', de: 'B', a: 'E', texto: '?', radio: 20 }] })], { alto: 230, sinEscala: true, alt: o.alt, mx: afuera ? 1.2 : undefined });
  }

  // Los 15 ejemplos (cuentas.py, idea 5): 13 cm; 90°; 28 cm; 45°; sí; 26 cm (x = 10); 35°; 58°; 10 cm (6 y 8); 9 cm
  // (equilátero); 75°; 12 cm (AOB equilátero); 150° (rombo de 96°); 96 cm (k = 2); 22,5°.
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: 'Los cordeles de la ventana',
    figura: fig(figVentana(90, { alt: 'El marco rectangular de una ventana, de 80 cm por 60 cm, con sus dos cordeles en diagonal.' })),
    enunciado: 'El marco ABCD de una ventana es un rectángulo. El cordel AC mide 100 cm. ¿Cuánto mide el cordel BD?',
    datos: [D_RECT],
    solucion: [{ texto: 'En un rectángulo, las diagonales miden igual.', ecuacion: junto(['BD = AC = ', dF('100 cm')]) }],
    respuesta: [junto('BD = '), dF('100 cm')] });
  EJ5.push({ nivel: 1, titulo: 'El cruce de un rombo',
    enunciado: 'En el rombo ABCD, m∠A = 70° y sus diagonales se cortan en O. ¿Cuánto mide m∠AOB?',
    datos: [D_ROMBO],
    solucion: [{ texto: 'Las diagonales del rombo son perpendiculares, se incline como se incline.', ecuacion: junto(['m∠AOB = ', dF('90°')]) }],
    respuesta: [junto('m∠AOB = '), dF('90°')] });
  EJ5.push({ nivel: 1, titulo: 'El perímetro de un rombo',
    enunciado: 'Un lado del rombo ABCD mide 7 cm. ¿Cuánto mide su perímetro?',
    datos: [D_ROMBO, D_PER],
    solucion: [{ texto: 'Sus cuatro lados miden igual:', ecuacion: junto(['4 · 7 = ', dF('28 cm')]) }],
    respuesta: [dF('28 cm')] });
  EJ5.push({ nivel: 1, titulo: 'La diagonal del cuadrado',
    enunciado: 'En el cuadrado ABCD se traza la diagonal AC. ¿Cuánto mide m∠BAC?',
    datos: [D_CUADR, D_ROMBO],
    solucion: [{ texto: 'El cuadrado es rombo: la diagonal parte su ángulo de 90° por la mitad.', ecuacion: junto(['90° ÷ 2 = ', dF('45°')]) }],
    respuesta: [junto('m∠BAC = '), dF('45°')] });
  EJ5.push({ nivel: 1, titulo: '¿Un cuadrado es rombo?',
    enunciado: '¿Todo cuadrado es también un rombo?',
    datos: [D_ROMBO, 'Cuadrado: paralelogramo con cuatro ángulos rectos y cuatro lados iguales.'],
    solucion: [{ texto: 'El rombo pide cuatro lados iguales, y el cuadrado los tiene. Lo de más (los ángulos rectos) no le quita el nombre.' }],
    respuesta: [dF('Sí'), ': cumple todo lo del rombo'] });

  EJ5.push({ nivel: 2, titulo: 'Las mitades en un rectángulo',
    enunciado: 'En el rectángulo ABCD, las diagonales se cortan en O; AO = x + 3 y BD = 3x − 4, en centímetros. ¿Cuánto mide BD?',
    datos: [D_RECT, D_DIAGP],
    solucion: [{ texto: 'BD = AC, y AC mide el doble de AO:', ecuacion: junto(['3x − 4 = 2(x + 3)', '   →   ', 'x = 10']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['BD = 3 · 10 − 4 = ', dF('26 cm')]) }],
    respuesta: [junto('BD = '), dF('26 cm')] });
  EJ5.push({ nivel: 2, titulo: 'El ángulo entre diagonales',
    figura: fig(figRect(110, ['A', 'B', 'O'], { alt: 'Un rectángulo ABCD con sus diagonales, que se cortan en O formando 110° en el ángulo AOB; el ángulo OAB, con signo de pregunta.' })),
    enunciado: `En el rectángulo ABCD, las diagonales se cortan en O y m∠AOB = 110°. ¿Cuánto mide m∠OAB?${NO_ESC}`,
    datos: [D_RECT, D_DIAGP, D_ISO],
    solucion: [{ texto: 'Las diagonales miden igual y se cortan en su mitad: OA = OB, y △AOB es isósceles.' },
      { texto: 'Sus dos ángulos iguales se reparten lo que queda:', ecuacion: junto(['(180° − 110°) ÷ 2 = ', dF('35°')]) }],
    respuesta: [junto('m∠OAB = '), dF('35°')] });
  EJ5.push({ nivel: 2, titulo: 'La diagonal corta del rombo',
    figura: fig(figRombo('64°', ['B', 'A', 'D'], { resp: 58, alt: 'Un rombo ABCD con 64° en A y la diagonal BD; el ángulo ABD, con signo de pregunta.' })),
    enunciado: `En el rombo ABCD, m∠A = 64°. ¿Cuánto mide m∠ABD?${NO_ESC}`,
    datos: [D_ROMBO, D_VEC],
    solucion: [{ texto: 'A y B son vecinos:', ecuacion: junto('m∠B = 180° − 64° = 116°') },
      { texto: 'La diagonal BD parte a B por la mitad:', ecuacion: junto(['116° ÷ 2 = ', dF('58°')]) }],
    respuesta: [junto('m∠ABD = '), dF('58°')] });
  EJ5.push({ nivel: 2, titulo: 'El lado desde las diagonales',
    enunciado: 'Las diagonales de un rombo miden 12 cm y 16 cm. ¿Cuánto mide su lado?',
    datos: [D_ROMBO, D_DIAGP, D_PIT],
    solucion: [{ texto: 'Se cortan en su mitad y en ángulo recto: cada triángulo tiene catetos de 6 cm y 8 cm.' },
      { texto: 'Son 3k y 4k con k = 2:', ecuacion: junto(['5 · 2 = ', dF('10 cm')]) }],
    respuesta: [dF('10 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Un rombo de 60°',
    enunciado: 'En el rombo ABCD, m∠A = 60° y AB = 9 cm. ¿Cuánto mide la diagonal BD?',
    datos: [D_ROMBO, 'Un triángulo isósceles con un ángulo de 60° entre sus lados iguales es equilátero.'],
    solucion: [{ texto: 'En △ABD, AB = AD = 9 cm y el ángulo entre ellos mide 60°: es equilátero.' },
      { texto: 'BD es su tercer lado:', ecuacion: junto(['BD = ', dF('9 cm')]) }],
    respuesta: [junto('BD = '), dF('9 cm')] });

  // Nivel 3: la correcta en E, C, A, B y D.
  EJ5.push({ nivel: 3, titulo: 'Un equilátero en el cuadrado',
    figura: fig(figCuadEq(false, { alt: 'Un cuadrado ABCD con el triángulo equilátero BCE dibujado hacia adentro; el ángulo BAE, con signo de pregunta.' })),
    enunciado: `Dentro del cuadrado ABCD se dibuja el triángulo equilátero BCE. ¿Cuánto mide m∠BAE?${NO_ESC}`,
    alternativas: ['60°', '30°', '15°', '45°', '75°'],
    datos: [D_CUADR, D_EQL, D_ISO, D_TRI],
    fuente: 'Modelo de San Marcos 2024-II (pregunta 33).',
    solucion: [{ texto: 'BE = BC = BA: △ABE es isósceles, y su ángulo en B mide 90° − 60° = 30°.' },
      { texto: 'Sus otros dos ángulos se reparten el resto:', ecuacion: junto(['(180° − 30°) ÷ 2 = ', dF('75°')]) },
      { texto: '60° copia el equilátero; 30° es el ángulo en B; 15° es m∠EAD (90° − 75°); 45° es el de la diagonal.' }],
    respuesta: [junto('m∠BAE = '), dF('75°')] });
  EJ5.push({ nivel: 3, titulo: 'Un rectángulo con 60°',
    enunciado: 'En el rectángulo ABCD, las diagonales se cortan en O, m∠AOB = 60° y AB = 6 cm. ¿Cuánto mide la diagonal AC?',
    alternativas: ['6 cm', '3 cm', '12 cm', '18 cm', '24 cm'],
    datos: [D_RECT, D_DIAGP, D_EQL],
    solucion: [{ texto: 'OA = OB (mitades de diagonales iguales): △AOB es isósceles con 60° en O, así que sus otros ángulos miden 60° y es equilátero.', ecuacion: junto('OA = AB = 6 cm') },
      { texto: 'AC tiene dos mitades:', ecuacion: junto(['AC = 2 · 6 = ', dF('12 cm')]) },
      { texto: '6 cm es OA, la mitad; 3 cm es la mitad de OA; 18 cm y 24 cm multiplican de más (3 · 6 y 4 · 6).' }],
    respuesta: [junto('AC = '), dF('12 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Un equilátero en el rombo',
    enunciado: 'En el rombo ABCD, m∠ABC = 96°. Dentro del rombo se marca E, con BEC equilátero. ¿Cuánto mide m∠AED?',
    alternativas: ['150°', '72°', '78°', '96°', '60°'],
    datos: [D_ROMBO, D_VEC, D_EQL, D_ISO],
    solucion: [{ texto: 'BA = BE: en △ABE, m∠ABE = 96° − 60° = 36° y los otros dos miden (180° − 36°) ÷ 2 = 72°.' },
      { texto: 'm∠BCD = 84°: en △DCE, m∠ECD = 24° y los otros dos miden 78°.' },
      { texto: 'Alrededor de E, los cuatro ángulos dan una vuelta:', ecuacion: junto(['m∠AED = 360° − 72° − 60° − 78° = ', dF('150°')]) },
      { texto: '72° es m∠AEB; 78°, m∠CED; 60°, el del equilátero; 96° copia el ángulo B.' }],
    respuesta: [junto('m∠AED = '), dF('150°')] });
  EJ5.push({ nivel: 3, titulo: 'Dos cuadrados encajados',
    enunciado: 'Un cuadrado de alambre de 14 cm de lado lleva adentro otro cuadrado, con un vértice en cada lado del primero. Cada esquina deja un triángulo rectángulo con un ángulo de 37°. ¿Cuánto alambre se usa en los dos?',
    alternativas: ['56 cm', '96 cm', '40 cm', '112 cm', '84 cm'],
    datos: [D_N37, D_PER],
    fuente: 'Modelo de San Marcos 2026-II (pregunta 38).',
    solucion: [{ texto: 'Cada lado de 14 cm queda partido en los dos catetos del notable, 3k y 4k:', ecuacion: junto(['7k = 14', '   →   ', 'k = 2']) },
      { texto: 'El lado de adentro es la hipotenusa, 5k = 10 cm. Alambre:', ecuacion: junto(['4 · 14 + 4 · 10 = ', dF('96 cm')]) },
      { texto: '56 cm es solo el de afuera y 40 cm, solo el de adentro; 112 cm toma el de adentro de 14 cm; 84 cm, de 7 cm.' }],
    respuesta: [dF('96 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Un punto en la diagonal',
    enunciado: 'En el cuadrado ABCD, el punto P de la diagonal BD cumple BP = BA. ¿Cuánto mide m∠PAD?',
    alternativas: ['45°', '67,5°', '30°', '22,5°', '15°'],
    datos: [D_CUADR, D_ROMBO, D_ISO],
    solucion: [{ texto: 'BD parte a B en dos de 45°. △ABP es isósceles (BA = BP), con 45° en B:', ecuacion: junto('m∠BAP = (180° − 45°) ÷ 2 = 67,5°') },
      { texto: 'Lo que queda de la esquina A, de 90°:', ecuacion: junto(['m∠PAD = 90° − 67,5° = ', dF('22,5°')]) },
      { texto: '67,5° es m∠BAP; 45°, la mitad de la esquina; 30° y 15° serían con un equilátero.' }],
    respuesta: [junto('m∠PAD = '), dF('22,5°')] });

  // «Ahora tú» de la idea 5: el nombre que gana; las mitades en un rectángulo con x; el ángulo entre las diagonales del
  // rectángulo; el ángulo de la diagonal del rombo; el cuadrado con un equilátero.
  const NOMBRES = ['cuadrado', 'rectángulo', 'rombo', 'paralelogramo'];
  const CASOS_N = [
    { que: 'Un paralelogramo tiene sus diagonales iguales y perpendiculares.', bien: 'cuadrado' },
    { que: 'Un paralelogramo tiene sus diagonales iguales, y no se cortan en ángulo recto.', bien: 'rectángulo' },
    { que: 'Un paralelogramo tiene sus diagonales perpendiculares, y de distinto largo.', bien: 'rombo' },
    { que: 'Un paralelogramo tiene un ángulo de 70° y lados de 5 cm y 8 cm.', bien: 'paralelogramo' },
    { que: 'Un paralelogramo tiene sus cuatro lados de 6 cm y un ángulo de 90°.', bien: 'cuadrado' },
    { que: 'Un paralelogramo tiene sus cuatro lados de 6 cm y un ángulo de 50°.', bien: 'rombo' },
    { que: 'Un paralelogramo tiene un ángulo de 90° y lados de 4 cm y 7 cm.', bien: 'rectángulo' },
  ];
  const MOTIVO = { cuadrado: 'diagonales iguales y perpendiculares a la vez', rectángulo: 'diagonales iguales (ángulos rectos)', rombo: 'diagonales perpendiculares (lados iguales)', paralelogramo: 'solo lados opuestos paralelos, sin más' };
  function casoNombre(r) {
    const c = r.de(CASOS_N);
    return { pregunta: `${c.que} ¿Cuál es el nombre más preciso de la figura?`, datos: [D_RECT, D_ROMBO, D_CUADR],
      opciones: [{ id: 'c', texto: c.bien, correcta: true }].concat(NOMBRES.filter(x => x !== c.bien).map(x => ({ id: x.normalize('NFD').replace(/\p{M}/gu, ''), texto: x,
        error: x === 'paralelogramo' ? 'GE-PC17' : c.bien === 'cuadrado' ? 'GE10' : 'GE-PC18',
        siFuera: x === 'paralelogramo' ? `Lo es, pero se pide el más preciso: ${c.bien}.` : c.bien === 'cuadrado' ? `Es ${x}, sí; pero también cumple lo del otro: es cuadrado.` : `Sería ${x} con ${MOTIVO[x]}.` }))),
      solucion: { texto: `Tiene ${MOTIVO[c.bien]}.`, ecuacion: [dF(c.bien)] } };
  }
  function casoRectX(r) {
    for (let t = 0; t < 300; t++) {
      const x = r.ent(3, 14), p = r.ent(1, 2), q = r.ent(1, 8), ao = p * x + q, s = 2 * ao - 3 * x;
      if (x === 10 && p === 1 && q === 3) continue;
      const bd = 3 * x + s;
      if (bd < 6) continue;
      const sinMitad = (() => { const k = (s - q) / (p - 3); return Number.isInteger(k) && k > 0 ? 3 * k + s : NaN; })();
      return { pregunta: `En el rectángulo ABCD, las diagonales se cortan en O; AO = ${exL(p, q)} y BD = ${exL(3, s)}, en centímetros. ¿Cuánto mide BD?`, datos: [D_RECT, D_DIAGP],
        opciones: opciones(bd, OPS(r, [
          { id: 'ao', valor: ao, error: 'GE-PC10', siFuera: `${cm(ao)} es AO, la mitad de AC; BD mide lo mismo que AC.` },
          { id: 'x', valor: x, error: 'GE-CON30', siFuera: `x = ${x} está bien; falta reemplazarlo en BD.` },
          { id: 'sinmitad', valor: sinMitad, error: 'GE-PC15', siFuera: 'Igualar está bien; pero AO es la mitad de AC, y AC = BD.' },
          { id: 'doble', valor: 2 * bd, error: 'GE-PC11', siFuera: `BD ya es la diagonal entera: ${cm(bd)}.` }]), cm),
        solucion: { texto: `BD = AC = 2 · AO: ${exL(3, s)} = 2(${exL(p, q)}), así que x = ${x}.`, ecuacion: junto([`BD = 3 · ${x} ${s < 0 ? '−' : '+'} ${Math.abs(s)} = `, dF(cm(bd))]) } };
    }
    throw new Error('casoRectX sin caso');
  }
  function casoRectAng(r) {
    for (let t = 0; t < 300; t++) {
      const th = 2 * r.ent(25, 70);
      if (th === 110 || th === 90 || Math.abs((180 - th) / 2 - U.grados(Math.atan2(2.8, 3))) < 8) continue;
      const F = figRect(th, ['A', 'B', 'O'], { alt: `Un rectángulo ABCD con sus diagonales, que se cortan en O formando ${th}° en el ángulo AOB; el ángulo OAB, con signo de pregunta.` });
      if (!cabe(F)) continue;
      const v = (180 - th) / 2;
      return { pregunta: `En el rectángulo ABCD, las diagonales se cortan en O y m∠AOB = ${th}°. ¿Cuánto mide m∠OAB?${NO_ESC}`, datos: [D_RECT, D_DIAGP, D_ISO], dibujo: fig(F),
        opciones: opciones(v, OPS(r, [
          { id: 'mitad', valor: th / 2, error: 'GE-PC19', siFuera: `Partir está bien; lo que se parte entre los dos ángulos iguales es 180° − ${th}°.` },
          { id: 'sup', valor: 180 - th, error: 'GE-PC20', siFuera: `${gr(180 - th)} es m∠BOC, el vecino de AOB; falta repartirlo.` },
          { id: 'copia', valor: th, error: 'GE-CON35', siFuera: `${th}° está en O; en A va otro ángulo del triángulo AOB.` }]), gr),
        solucion: { texto: 'OA = OB (mitades de diagonales iguales): △AOB es isósceles.', ecuacion: junto([`(180° − ${th}°) ÷ 2 = `, dF(gr(v))]) } };
    }
    throw new Error('casoRectAng sin caso');
  }
  function casoRomboAng(r) {
    for (let t = 0; t < 300; t++) {
      const a = 2 * r.ent(20, 60), pideB = r() < 0.5;
      if (a === 64 || a === 90 || a === 70) continue;
      const v = pideB ? (180 - a) / 2 : a / 2, pide = pideB ? ['B', 'A', 'D'] : ['A', 'B', 'C'];
      const F = figRombo(`${a}°`, pide, { ac: !pideB, resp: v, alt: `Un rombo ABCD con ${a}° en A y la diagonal ${pideB ? 'BD; el ángulo ABD' : 'AC; el ángulo BAC'}, con signo de pregunta.` });
      if (!cabe(F)) continue;
      return { pregunta: `En el rombo ABCD, m∠A = ${a}°. ¿Cuánto mide m∠${pideB ? 'ABD' : 'BAC'}?${NO_ESC}`, datos: [D_ROMBO, D_VEC], dibujo: fig(F),
        opciones: opciones(v, OPS(r, [
          pideB ? { id: 'mitadA', valor: a / 2, error: 'GE-PC19', siFuera: `Partir por la mitad está bien; BD parte a B, que mide ${180 - a}°, no a A.` }
            : { id: 'mitadB', valor: (180 - a) / 2, error: 'GE-PC19', siFuera: `Partir está bien; AC parte a A, no a B.` },
          { id: 'entero', valor: pideB ? 180 - a : a, error: 'GE-CON36', siFuera: 'La diagonal del rombo parte ese ángulo en dos iguales: falta la mitad.' },
          { id: 'cruce', valor: 90, error: 'GE-PC2', siFuera: '90° es el cruce de las diagonales, en O; se pide un ángulo en un vértice.' }]), gr),
        solucion: { texto: pideB ? `m∠B = 180° − ${a}° = ${180 - a}°, y BD lo parte por la mitad:` : 'AC parte el ángulo A por la mitad:', ecuacion: junto([pideB ? `${180 - a}° ÷ 2 = ` : `${a}° ÷ 2 = `, dF(gr(v))]) } };
    }
    throw new Error('casoRomboAng sin caso');
  }
  function casoCuadEq(r) {
    const afuera = r() < 0.5, v = afuera ? 15 : 75;
    const F = figCuadEq(afuera, { alt: `Un cuadrado ABCD con el triángulo equilátero BCE dibujado hacia ${afuera ? 'afuera' : 'adentro'}; el ángulo BAE, con signo de pregunta.` });
    const pide = r() < 0.5 && !afuera;
    return { pregunta: `${afuera ? 'Fuera' : 'Dentro'} del cuadrado ABCD se dibuja el triángulo equilátero BCE. ¿Cuánto mide m∠${pide ? 'EAD' : 'BAE'}?${NO_ESC}`, datos: [D_CUADR, D_EQL, D_ISO, D_TRI], dibujo: fig(F),
      opciones: opciones(pide ? 90 - v : v, OPS(r, [
        { id: 'eq', valor: 60, error: 'GE-CON35', siFuera: '60° es un ángulo del equilátero; en A va un ángulo del triángulo ABE.' },
        { id: 'b', valor: afuera ? 150 : 30, error: 'GE-PC21', siFuera: `${afuera ? '150° = 90° + 60°' : '30° = 90° − 60°'} es el ángulo en B del triángulo ABE, no en A.` },
        { id: 'otro', valor: pide ? v : 90 - v, error: 'GE-PC21', siFuera: `${gr(pide ? v : 90 - v)} es el otro pedazo de la esquina A.` },
        { id: 'diag', valor: 45, error: 'GE-PC22', siFuera: '45° es el ángulo de la diagonal; AE no es diagonal.' }]), gr),
      solucion: { texto: `BA = BE: △ABE es isósceles con ${afuera ? '90° + 60° = 150°' : '90° − 60° = 30°'} en B; en A, (180° − ${afuera ? 150 : 30}°) ÷ 2 = ${v}°.`, ecuacion: junto(pide ? [`m∠EAD = 90° − ${v}° = `, dF(gr(90 - v))] : ['m∠BAE = ', dF(gr(v))]) } };
  }

  const especiales = {
    id: 'rectangulo-rombo-cuadrado',
    titulo: 'Rectángulo, rombo y cuadrado',
    pregunta: '¿Cómo sabe el carpintero que su marco quedó a escuadra?',
    temas: ['Rectángulo, rombo y cuadrado'],
    pieza: GO,
    aprendizaje: 'El rectángulo tiene diagonales iguales; el rombo, perpendiculares y que parten sus ángulos; el cuadrado es rectángulo y rombo a la vez.',
    actividad: 'Enderezar el marco de una ventana midiendo sus dos cordeles.',
    // Lee: rectángulo, rombo y cuadrado como paralelogramos con algo más; «a escuadra». No dice cómo se cruzan las
    // diagonales del rombo (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El marco de la ventana', texto: 'Don Julián armó el marco de una ventana de 80 cm por 60 cm. Antes de clavar el vidrio debe quedar a escuadra: con sus cuatro esquinas de 90°.',
          pieza: GO, dibujo: fig(figVentana(75, { alt: 'El marco de una ventana, de 80 cm por 60 cm, todavía inclinado, con dos cordeles en diagonal.' })) },
        { titulo: 'Paralelogramos con algo más', texto: 'Un rectángulo es un paralelogramo con cuatro ángulos rectos. Un rombo, uno con cuatro lados iguales. Un cuadrado tiene las dos cosas.' },
        { titulo: 'Qué mirar al jugar', texto: 'El carpintero no tiene transportador: tiene una wincha. Endereza el marco y compara el largo de los dos cordeles, AC y BD.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'El marco de una ventana mide 80 cm por 60 cm; el carpintero mide sus dos cordeles en diagonal.',
      mision: {
        texto: 'Endereza el marco (arrastra D o usa el control) hasta que los cordeles midan igual.',
        logrado: v => v.t === 90,
        bien: 'Miden lo mismo: el marco quedó a escuadra, con sus cuatro esquinas de 90°.',
      },
      voz: 'Si un cordel crece, ¿qué hace el otro?',
      leyenda: [
        { s: 'A, B, C, D', t: 'las esquinas del marco; D se arrastra' },
        { s: dO('AC'), t: 'el cordel de A a C' },
        { s: dI('BD'), t: 'el cordel de B a D' },
        { s: dH('m∠A'), t: 'la esquina A' },
      ],
      controles: [{ id: 't', etiqueta: 'm∠A, la esquina A', min: 60, max: 120, paso: 5, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figVentana(v.t), estado: {} }),
      arrastres: [{ id: 'vertice-d', etiqueta: 'esquina D del marco', color: 'c-i',
        donde: v => PO.aPantalla(figVentana(v.t), U.polar([0, 0], VEN.AD, v.t)),
        mover: (pt, v) => { const q = PO.aPlano(figVentana(v.t), pt); return { t: U.grados(Math.atan2(Math.max(q[1], 0.05), q[0])) }; } }],
      lectura: v => { const d = diagsDe(VEN.AB, VEN.AD, v.t), ig = Math.abs(d.ac - d.bd) < 1e-9; return ig ? [dO(junto(`AC = ${f(d.ac)} cm`)), junto(' = '), dI(junto(`BD`)), ': miden igual'] : [dO(junto(`AC ${cmA(d.ac).startsWith('≈') ? '' : '= '}${cmA(d.ac)}`)), ' y ', dI(junto(`BD ${cmA(d.bd).startsWith('≈') ? '' : '= '}${cmA(d.bd)}`)), junto(`: ${d.ac > d.bd ? 'AC' : 'BD'} es mayor`)]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora el marco tiene sus cuatro listones de 50 cm, como el rombo de una reja, y está inclinado. ¿Cómo se cruzan sus dos cordeles, AC y BD?',
      datos: ['Los cuatro listones miden 50 cm.', 'La esquina A mide 60°.'],
      voz: 'Mira dónde quedan A y C respecto de B y D.',
      opciones: [
        { id: 'c', texto: 'En ángulo recto', correcta: true },
        { id: 'copia', texto: 'A 60°, igual que la esquina A', error: 'GE-PC4', siFuera: 'Mirar la esquina está bien; pero el cruce de los cordeles no copia su ángulo.' },
        { id: 'escuadra', texto: 'En ángulo recto solo si el marco está a escuadra', error: 'GE10', siFuera: 'A escuadra, con lados iguales, sería un cuadrado; pero el rombo inclinado también lo cumple.' },
        { id: 'depende', texto: 'Depende de cuánto se incline', error: 'GE-PC3', siFuera: 'Los largos de los cordeles sí dependen; el cruce, no.' },
      ],
      dibujo: fig(ROMBO_P, { corte: 0 }),
      revelar: fig(ROMBO_P, { corte: 1 }),
      coincide: 'Coincide: se cruzan en ángulo recto, aunque el marco esté inclinado.',
      noCoincide: 'Revisemos: los cordeles del rombo se cruzan en ángulo recto, se incline como se incline.',
    },
    mira: {
      pieza: GO,
      datos: ROMBO_M,
      voz: 'A y C están igual de lejos de B y de D.',
      pasos: [
        { estado: { corte: 0 }, texto: 'A está a 50 cm de B y de D; C, también.', ecuacion: junto(['AB = AD', Y, 'CB = CD']) },
        { estado: { corte: 1 }, texto: 'A y C equidistan de B y D: están en la mediatriz de BD.', ecuacion: junto([dO('AC'), ' ⟂ ', dI('BD')]) },
        { estado: { corte: 2 }, texto: '△ABC ≅ △ADC por LLL: AC parte la esquina A por la mitad.', ecuacion: junto(['m∠BAC = m∠DAC = ', dH('30°')]) },
        { estado: { corte: 2 }, texto: 'En el juego, con esquinas rectas, los cordeles medían igual: △ABC ≅ △BAD por LAL.', ecuacion: junto([dO('AC'), ' = ', dI('BD')]) },
        { estado: { corte: 2 }, texto: 'El cuadrado es rombo y rectángulo: tiene las dos cosas.', ecuacion: junto([dO('AC'), ' = ', dI('BD'), Y, dO('AC'), ' ⟂ ', dI('BD')]) },
      ],
    },
    regla: {
      texto: 'Un rectángulo, con sus cuatro ángulos rectos, tiene diagonales iguales. Un rombo, con sus cuatro lados iguales, tiene diagonales perpendiculares que parten sus ángulos. El cuadrado es las dos cosas.',
      ecuacion: junto(['rectángulo: ', dO('AC'), ' = ', dI('BD'), Y, 'rombo: ', dO('AC'), ' ⟂ ', dI('BD')]),
      condicion: 'son paralelogramos: también tienen todo lo de la idea anterior, y sus diagonales se cortan en su punto medio.',
      voz: 'El cuadrado no pierde ningún nombre: es rectángulo y es rombo.',
    },
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const k = r.de([3, 4, 5, 6]);
          return {
            enunciado: `Las diagonales de un rombo miden ${cm(6 * k)} y ${cm(8 * k)}. ¿Cuánto mide su perímetro?`,
            datos: [D_ROMBO, D_DIAGP, D_PIT, D_PER],
            pasos: [
              { tipo: 'pide', texto: 'Piden el perímetro: cuatro veces el lado.' },
              { tipo: 'datos', texto: `Las dos diagonales: ${cm(6 * k)} y ${cm(8 * k)}.` },
              { tipo: 'regla', texto: 'En el rombo, las diagonales se cortan en su mitad y en ángulo recto: arman cuatro triángulos rectángulos iguales.' },
              { tipo: 'cuentas', texto: `Cada uno tiene catetos de ${3 * k} y ${4 * k}: son 3k y 4k con k = ${k}, y el lado es 5k = ${5 * k}.`, ecuacion: junto([`4 · ${5 * k} = `, dF(cm(20 * k))]) },
              { tipo: 'sentido', texto: 'El lado es mayor que cada media diagonal, como debe ser una hipotenusa.' },
            ],
            respuesta: [dF(cm(20 * k))],
          };
        }
        const a = 2 * r.ent(26, 40);
        return {
          enunciado: `En el rombo ABCD, m∠ABC = ${a}° y se traza la diagonal AC. ¿Cuánto mide m∠BAC?`,
          datos: [D_ROMBO, D_ISO, D_TRI],
          pasos: [
            { tipo: 'pide', texto: 'Piden el ángulo entre el lado AB y la diagonal AC.' },
            { tipo: 'datos', texto: `m∠ABC = ${a}° y los cuatro lados iguales: BA = BC.` },
            { tipo: 'regla', texto: '△ABC es isósceles (BA = BC): sus ángulos en A y en C miden igual.' },
            { tipo: 'cuentas', texto: 'Se reparte lo que deja B:', ecuacion: junto([`(180° − ${a}°) ÷ 2 = `, dF(gr((180 - a) / 2))]) },
            { tipo: 'sentido', texto: `Por otro camino: m∠A = 180° − ${a}° = ${180 - a}°, y AC lo parte por la mitad.` },
          ],
          respuesta: [junto('m∠BAC = '), dF(gr((180 - a) / 2))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: '¿Diagonales iguales, perpendiculares o las dos cosas?',
      generar(s) { return conCuatro([casoNombre, casoRectX, casoRectAng, casoRomboAng, casoCuadEq][s % 5], azar(s + 7), firmasDe(EJ5)); },
    },
  };

  // ======================= Idea 6: el trapecio y su mediana =======================
  // Objeto de la primera pantalla: el corte de un canal de riego con el agua hasta la mitad de su hondura (geo-objeto,
  // parcela «canal»; dibujo de prueba). La boca y el fondo son las bases; el borde del agua es la mediana.
  // Cambia: el fondo b y su corrimiento d. · Permanece: la boca (6 m) y la hondura. · Progresa: el ancho del agua.
  // · Se reserva: el tramo entre las diagonales (la predicción). · Debe verse: el agua mide la semisuma, corra como corra.
  const D_TRAP = 'Trapecio: cuadrilátero con un solo par de lados paralelos, las bases.';
  const D_MED = 'Mediana del trapecio: el segmento que une los puntos medios de los lados no paralelos.';
  const D_MN = 'La mediana del trapecio es paralela a las bases y mide su semisuma: (base mayor + base menor) ÷ 2.';
  const D_PQ = 'El tramo entre los puntos medios de las diagonales mide la semidiferencia de las bases: (mayor − menor) ÷ 2.';
  const D_CONJ = 'Conjugados internos entre paralelas: suman 180°.';
  const D_TISO = 'En un trapecio isósceles (lados no paralelos iguales), los dos ángulos de una misma base miden igual.';
  const BOCA = 6, HOND = 2.4;
  const VC = { x: [-1.7, 7.7], y: [-1.1, 3.5] };
  function figCanal(b, d, o = {}) {
    const boca = o.boca || BOCA, x0 = (BOCA - b) / 2 + d, A = [0, HOND], Dp = [BOCA, HOND], B = [x0, 0], C = [x0 + b, 0], M = U.medio(A, B), N = U.medio(Dp, C);
    return figura([poli('ABCD', [A, B, C, Dp], { lados: { AD: { color: 'o', fino: true, texto: mt(boca), dist: 7 }, BC: { color: 'i', texto: mt(o.fondo || b), dist: 7 } },
      pts: [{ id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 0 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 180 }],
      segs: [{ de: 'M', a: 'N', grosor: 'variable' }] })],
    { vista: VC, alto: 230, sinEscala: o.sinEscala, obj: { objeto: 'parcela', tipo: 'canal', borde: ['A', 'B', 'C', 'D'], agua: ['M', 'B', 'C', 'N'] },
      alt: o.alt || `El corte de un canal de riego: la boca AD mide 6 m y el fondo BC, ${mt(b)}. El agua llega a la mitad de la hondura: su borde MN va de la mitad de una pared a la mitad de la otra.` });
  }
  // El canal de la predicción (boca 10 m, fondo 4 m) con los cordeles AC y BD. Sin escala en Predice (el fondo se dibuja
  // de 6,5 m: PQ no se mide); a escala en «Mira», con sus cortes.
  function figCanalPQ(escala, o = {}) {
    // (Sin escala, el fondo se dibuja angosto: PQ queda largo, lejos de su medida, y su «?» cabe.)
    const AD = 10, bd = escala ? 4 : 1.6, H = 3.6, A = [0, H], Dp = [AD, H], B = [(AD - bd) / 2, 0], C = [(AD + bd) / 2, 0];
    const M = U.medio(A, B), N = U.medio(Dp, C), P = U.medio(A, C), Q = U.medio(B, Dp);
    const m = o.mira, lados = { AD: { color: 'o', fino: true, texto: mt(10), dist: 7 }, BC: { color: 'i', texto: mt(4), dist: 7 } };
    if (!m) lados.PQ = { texto: '?', dist: 7, ref: 'B' };
    // (MP y PN van solo en la ecuación del paso: sus rótulos chocaban con los cordeles o las paredes.)
    else lados.PQ = { texto: mt(3), dist: 6, ref: 'B', desde: 3 };
    return figura([poli('ABCD', [A, B, C, Dp], { lados,
      pts: [{ id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 180 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 0 }, { id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: 270 }, { id: 'Q', x: Q[0], y: Q[1], rotulo: 'Q', lado: 270 }],
      segs: [{ de: 'M', a: 'N', grosor: 'variable' }, { de: 'A', a: 'C', grosor: 'fino', discontinua: true }, { de: 'B', a: 'D', grosor: 'fino', discontinua: true, desde: m ? 3 : 0 }] })],
    { vista: { x: [-1.4, 11.4], y: [-1.1, 4.4] }, alto: 220, sinEscala: !escala, evita: { B: [270], C: [270] }, obj: { objeto: 'parcela', tipo: 'canal', borde: ['A', 'B', 'C', 'D'], agua: ['M', 'B', 'C', 'N'] },
      alt: o.alt || 'El corte de otro canal: la boca AD mide 10 m y el fondo BC, 4 m. Dos cordeles van de A a C y de B a D y cruzan la línea del agua MN en P y Q; PQ lleva signo de pregunta.' });
  }
  const CANAL_P = figCanalPQ(false), CANAL_M = figCanalPQ(true, { mira: true, alt: 'El canal de 10 m de boca y 4 m de fondo, a escala: la línea del agua MN corta los cordeles en sus mitades P y Q.' });
  // Un trapecio de examen ABCD con BC ∥ AD (AD abajo, la mayor).
  // o.resp: el valor del ángulo pedido; de tres corrimientos de BC se usa el que lo dibuja más lejos de él.
  function figTrap(lab, o = {}) {
    if (o.resp !== undefined) {
      const lejos = F => { const q = F.figura.angulos.find(x => x.texto === '?'); return q ? Math.abs(q.mide - o.resp) : 0; };
      return (o.sh === 0 ? [0, 0.01] : [-0.9, 1.1, 2.6]).map(sh => figTrap(lab, Object.assign({}, o, { resp: undefined, sh, H: o.sh === 0 ? [4.6, 2.6][sh ? 1 : 0] : o.H }))).sort((x, y) => lejos(y) - lejos(x))[0];
    }
    const AD = 9, BC = 4.6, H = o.H || 4.6, sh = o.sh === undefined ? 1.1 : o.sh, A = [0, 0], Dp = [AD, 0], B = [(AD - BC) / 2 - sh, H], C = [(AD + BC) / 2 - sh, H];
    const pts = [], segs = [], lados = { AD: Object.assign({ color: 'o', dist: 7 }, lab.AD ? { texto: lab.AD } : {}), BC: Object.assign({ color: 'i', dist: 7 }, lab.BC ? { texto: lab.BC } : {}) };
    if (o.mn) { const M = U.medio(A, B), N = U.medio(Dp, C); pts.push({ id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 180 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 0 }); segs.push({ de: 'M', a: 'N', grosor: 'variable' }); if (lab.MN) lados.MN = { texto: lab.MN, dist: 6, ref: 'B' }; }
    return figura([poli('ABCD', [A, B, C, Dp], { lados, pts, segs, ang: o.ang || {} })], { alto: 210, sinEscala: o.sinEscala, alt: o.alt });
  }

  // Los 15 ejemplos (cuentas.py, idea 6): 6 m; 3 cm; 13 cm; 110°; 15 cm; 17 cm (x = 8); 7 cm (MN 10, PQ 3); 115°; 4 cm;
  // 16 cm; 24 cm (6, 8 y 10); 4 m (3-4-5); 68° (x = 34); 20 cm; 6 cm (3 + 3).
  const EJ6 = [];
  EJ6.push({ nivel: 1, titulo: 'El agua del canal',
    figura: fig(figCanal(2.5, 0, { boca: 8, fondo: 4, sinEscala: true, alt: 'El corte de un canal de 8 m de boca y 4 m de fondo, con el agua hasta la mitad de su hondura.' })),
    enunciado: `Un canal de riego tiene 8 m de boca y 4 m de fondo. El agua llega a la mitad de su hondura. ¿Qué ancho tiene el agua arriba?${NO_ESC}`,
    datos: [D_MED, D_MN],
    solucion: [{ texto: 'El borde del agua une las mitades de las dos paredes: es la mediana del trapecio.', ecuacion: junto(['(8 + 4) ÷ 2 = ', dF('6 m')]) }],
    respuesta: [dF('6 m')] });
  EJ6.push({ nivel: 1, titulo: 'El tramo de las diagonales',
    enunciado: 'Las bases de un trapecio miden 12 cm y 6 cm. ¿Cuánto mide el tramo entre los puntos medios de sus diagonales?',
    datos: [D_PQ],
    solucion: [{ texto: 'Es la semidiferencia de las bases:', ecuacion: junto(['(12 − 6) ÷ 2 = ', dF('3 cm')]) }],
    respuesta: [dF('3 cm')] });
  EJ6.push({ nivel: 1, titulo: 'La base que falta',
    figura: fig(figTrap({ BC: '5 cm', MN: '9 cm' }, { mn: true, alt: 'Un trapecio ABCD con la base menor BC de 5 cm y la mediana MN de 9 cm; la base mayor AD no tiene medida.' })),
    enunciado: 'En el trapecio ABCD (BC ∥ AD), la mediana mide 9 cm y la base menor BC, 5 cm. ¿Cuánto mide la base mayor AD?',
    datos: [D_MN],
    solucion: [{ texto: 'Las dos bases suman el doble de la mediana:', ecuacion: junto(['AD = 2 · 9 − 5 = ', dF('13 cm')]) }],
    respuesta: [junto('AD = '), dF('13 cm')] });
  EJ6.push({ nivel: 1, titulo: 'Ángulos de un mismo lado',
    figura: fig(figTrap({}, { sinEscala: true, resp: 110, ang: { A: { texto: '70°', color: 'h' }, B: { texto: '?' } }, alt: 'Un trapecio ABCD con BC paralela a AD, 70° en A y el ángulo en B con signo de pregunta.' })),
    enunciado: `En el trapecio ABCD, con BC ∥ AD, m∠A = 70°. ¿Cuánto mide m∠B?${NO_ESC}`,
    datos: [D_CONJ],
    solucion: [{ texto: 'A y B quedan entre las bases paralelas, del mismo lado AB: son conjugados internos.', ecuacion: junto(['m∠B = 180° − 70° = ', dF('110°')]) }],
    respuesta: [junto('m∠B = '), dF('110°')] });
  EJ6.push({ nivel: 1, titulo: 'Las bases suman',
    enunciado: 'Las dos bases de un trapecio suman 30 cm. ¿Cuánto mide su mediana?',
    datos: [D_MN],
    solucion: [{ texto: 'La mediana es la mitad de esa suma:', ecuacion: junto(['30 ÷ 2 = ', dF('15 cm')]) }],
    respuesta: [dF('15 cm')] });

  EJ6.push({ nivel: 2, titulo: 'Bases y mediana con x',
    enunciado: 'En un trapecio, la base mayor mide 3x − 1, la menor x + 3 y la mediana x + 9, en centímetros. ¿Cuánto mide la mediana?',
    datos: [D_MN],
    solucion: [{ texto: 'La mediana es la semisuma:', ecuacion: junto(['(3x − 1 + x + 3) ÷ 2 = x + 9', '   →   ', '2x + 1 = x + 9', '   →   ', 'x = 8']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['8 + 9 = ', dF('17 cm')]) }],
    respuesta: [dF('17 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Las bases desde MN y PQ',
    enunciado: 'En un trapecio, la mediana mide 10 cm y el tramo entre los puntos medios de las diagonales, 3 cm. ¿Cuánto mide la base menor?',
    datos: [D_MN, D_PQ],
    solucion: [{ texto: 'Las bases suman 20 cm y se llevan 6 cm.' },
      { texto: 'La menor es la mitad de lo que queda al quitar la diferencia:', ecuacion: junto(['(20 − 6) ÷ 2 = ', dF('7 cm')]) }],
    respuesta: [dF('7 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Un trapecio isósceles',
    figura: fig(figTrap({}, { sh: 0, sinEscala: true, resp: 115, ang: { A: { texto: '65°', color: 'h' }, C: { texto: '?' } }, alt: 'Un trapecio isósceles ABCD con BC paralela a AD, 65° en A y el ángulo en C con signo de pregunta.' })),
    enunciado: `En el trapecio isósceles ABCD, con BC ∥ AD, m∠A = 65°. ¿Cuánto mide m∠C?${NO_ESC}`,
    datos: [D_TISO, D_CONJ],
    solucion: [{ texto: 'D es de la misma base que A: m∠D = 65°.' },
      { texto: 'C y D son conjugados internos:', ecuacion: junto(['m∠C = 180° − 65° = ', dF('115°')]) }],
    respuesta: [junto('m∠C = '), dF('115°')] });
  EJ6.push({ nivel: 2, titulo: 'Un pedazo de la mediana',
    enunciado: 'En el trapecio ABCD, BC ∥ AD, BC = 8 cm y AD = 20 cm. La mediana MN corta la diagonal AC en P. ¿Cuánto mide MP?',
    datos: [D_MED, D_BM],
    solucion: [{ texto: 'P es el punto medio de AC, y M el de AB: en △ABC, MP es base media.', ecuacion: junto(['MP = 8 ÷ 2 = ', dF('4 cm')]) }],
    respuesta: [junto('MP = '), dF('4 cm')] });
  EJ6.push({ nivel: 2, titulo: 'La base mayor es el doble',
    enunciado: 'En un trapecio, la mediana mide 12 cm y la base mayor mide el doble de la menor. ¿Cuánto mide la base mayor?',
    datos: [D_MN],
    solucion: [{ texto: 'Si la menor es x, la mayor es 2x, y las dos suman 24:', ecuacion: junto(['3x = 24', '   →   ', 'x = 8']) },
      { texto: 'La mayor:', ecuacion: junto(['2 · 8 = ', dF('16 cm')]) }],
    respuesta: [dF('16 cm')] });

  // Nivel 3: la correcta en B, E, C, D y A.
  EJ6.push({ nivel: 3, titulo: 'Tres paralelas',
    enunciado: 'En el trapecio ABCD, las bases miden BC = 4 cm y AD = 12 cm. AB se parte en cuatro partes iguales y por los tres puntos se trazan paralelas a las bases. ¿Cuánto suman?',
    alternativas: ['8 cm', '24 cm', '16 cm', '32 cm', '30 cm'],
    datos: [D_MN],
    fuente: 'Modelo de San Marcos 2027-I (pregunta 35).',
    solucion: [{ texto: 'La del medio es la mediana: (12 + 4) ÷ 2 = 8 cm. Cada una de las otras es la mediana de un trapecio más chico:', ecuacion: junto(['(8 + 4) ÷ 2 = 6', '   y   ', '(12 + 8) ÷ 2 = 10']) },
      { texto: 'Suma:', ecuacion: junto(['6 + 8 + 10 = ', dF('24 cm')]) },
      { texto: '8 cm es solo la del medio; 16 cm suma las bases; 32 cm cuenta cuatro tramos de 8; 30 cm toma tres veces la de 10.' }],
    respuesta: [dF('24 cm')] });
  EJ6.push({ nivel: 3, titulo: 'El ancho del río',
    enunciado: 'Las orillas de un río son paralelas: los anclajes A y D, en una, están a 10 m; B y C, en la otra, a 4 m. Los cables AB y CD miden 5 m. ¿Qué ancho tiene el río?',
    alternativas: ['3 m', '5 m', '7 m', '6 m', '4 m'],
    datos: [D_TISO, D_PIT],
    fuente: 'Modelo de San Marcos 2024-II (pregunta 38), con otros números.',
    solucion: [{ texto: 'Las alturas desde B y C dejan, a cada lado de AD, un tramo de (10 − 4) ÷ 2 = 3 m.' },
      { texto: 'Cada cable de 5 m es la hipotenusa de un triángulo de catetos 3 m y el ancho: 3k, 4k y 5k con k = 1.', ecuacion: junto(['ancho = ', dF('4 m')]) },
      { texto: '3 m es el tramo de la orilla; 5 m, el cable; 7 m, la mediana; 6 m, la diferencia de las bases.' }],
    respuesta: [dF('4 m')] });
  EJ6.push({ nivel: 3, titulo: 'Conjugados con x',
    figura: fig(figTrap({}, { sinEscala: true, ang: { A: { texto: '2x', color: 'h' }, B: { texto: '3x + 10°', color: 'h' } }, alt: 'Un trapecio ABCD con BC paralela a AD; 2x en A y 3x + 10° en B.' })),
    enunciado: `En el trapecio ABCD, con BC ∥ AD, m∠A = 2x y m∠B = 3x + 10°. ¿Cuánto mide m∠A?${NO_ESC}`,
    alternativas: ['112°', '34°', '68°', '102°', '90°'],
    datos: [D_CONJ],
    solucion: [{ texto: 'A y B son conjugados internos:', ecuacion: junto(['2x + 3x + 10° = 180°', '   →   ', 'x = 34']) },
      { texto: 'Se reemplaza:', ecuacion: junto(['m∠A = 2 · 34° = ', dF('68°')]) },
      { texto: '34 es x; 112° es m∠B; 102° es 3x sin el 10°; 90° supondría un ángulo recto.' }],
    respuesta: [junto('m∠A = '), dF('68°')] });
  EJ6.push({ nivel: 3, titulo: 'Bases desde la mediana',
    enunciado: 'En un trapecio, la mediana mide 15 cm y el tramo entre los puntos medios de las diagonales, 5 cm. ¿Cuánto mide la base mayor?',
    alternativas: ['10 cm', '15 cm', '25 cm', '20 cm', '30 cm'],
    datos: [D_MN, D_PQ],
    solucion: [{ texto: 'Las bases suman 30 cm y se llevan 10 cm.' },
      { texto: 'La mayor es la mitad de la suma más la diferencia:', ecuacion: junto(['(30 + 10) ÷ 2 = ', dF('20 cm')]) },
      { texto: '10 cm es la base menor; 15 cm, la mediana; 25 cm suma 15 + 10; 30 cm, la suma de las dos bases.' }],
    respuesta: [dF('20 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Los extremos de la mediana',
    enunciado: 'En el trapecio ABCD, BC = 6 cm y AD = 14 cm son las bases. Las diagonales cortan la mediana MN en P y Q. ¿Cuánto suman MP y QN?',
    alternativas: ['6 cm', '4 cm', '10 cm', '3 cm', '7 cm'],
    datos: [D_MED, D_BM, D_MN, D_PQ],
    solucion: [{ texto: 'MP es base media de △ABC y QN, de △BCD: cada una mide 6 ÷ 2 = 3 cm.', ecuacion: junto(['MP + QN = 3 + 3 = ', dF('6 cm')]) },
      { texto: 'Por otro camino: MN − PQ = 10 − 4 = 6 cm.' },
      { texto: '4 cm es PQ; 10 cm, la mediana; 3 cm, uno solo de los tramos; 7 cm, la mitad de AD.' }],
    respuesta: [dF('6 cm')] });

  // «Ahora tú» de la idea 6: la mediana; la base que falta; el tramo PQ; con x; tres paralelas (San Marcos 2027-I).
  function casoMed(r) {
    const B = r.ent(8, 30), b = r.ent(3, B - 2);
    if ((B + b) % 2) return null;
    if ((B === 8 && b === 4) || B + b === 30) return null;
    return { pregunta: `Las bases de un trapecio miden ${cm(B)} y ${cm(b)}. ¿Cuánto mide su mediana?`, datos: [D_MED, D_MN],
      opciones: opciones((B + b) / 2, OPS(r, [
        { id: 'suma', valor: B + b, error: 'GE-TRP2', siFuera: 'Sumar las bases está bien; la mediana es la mitad de esa suma.' },
        { id: 'pq', valor: (B - b) / 2, error: 'GE-TRP1', siFuera: `${cm((B - b) / 2)} es la semidiferencia: el tramo entre las diagonales.` },
        { id: 'mayor', valor: B / 2, error: 'GE-TRP4', siFuera: 'Partir por la mitad está bien; la mediana promedia las dos bases, no solo la mayor.' }]), cm),
      solucion: { texto: 'La mediana es la semisuma de las bases:', ecuacion: junto([`(${B} + ${b}) ÷ 2 = `, dF(cm((B + b) / 2))]) } };
  }
  function casoBase(r) {
    const mn = r.ent(6, 20), b = r.ent(2, mn - 1), B = 2 * mn - b;
    if (mn === 9 && b === 5) return null;
    return { pregunta: `En el trapecio ABCD (BC ∥ AD), la mediana mide ${cm(mn)} y la base menor BC, ${cm(b)}. ¿Cuánto mide la base mayor AD?`, datos: [D_MN],
      opciones: opciones(B, OPS(r, [
        { id: 'resta', valor: mn - b, error: 'GE-TRP5', siFuera: 'Restar la base que se tiene está bien; primero se duplica la mediana: las bases suman el doble.' },
        { id: 'suma', valor: mn + b, error: 'GE-TRP6', siFuera: `Usar la mediana y la base está bien; las dos bases suman ${2 * mn}, no ${mn}.` },
        { id: 'doble', valor: 2 * mn, error: 'GE-TRP7', siFuera: `${cm(2 * mn)} es la suma de las dos bases; falta quitar BC.` }]), cm),
      solucion: { texto: `Las dos bases suman 2 · ${mn} = ${2 * mn}:`, ecuacion: junto([`AD = ${2 * mn} − ${b} = `, dF(cm(B))]) } };
  }
  function casoPQ(r) {
    const B = r.ent(9, 30), b = r.ent(3, B - 2);
    if ((B - b) % 2 || (B === 12 && b === 6) || (B === 10 && b === 4)) return null;
    return { pregunta: `En un trapecio de bases ${cm(B)} y ${cm(b)}, las diagonales cortan la mediana en P y Q. ¿Cuánto mide PQ?`, datos: [D_MED, D_PQ],
      opciones: opciones((B - b) / 2, OPS(r, [
        { id: 'mn', valor: (B + b) / 2, error: 'GE-TRP1', siFuera: `${cm((B + b) / 2)} es la mediana entera; PQ es su tramo del medio.` },
        { id: 'resta', valor: B - b, error: 'GE-TRP2', siFuera: 'Restar las bases está bien; PQ es la mitad de esa resta.' },
        { id: 'mp', valor: b / 2, error: 'GE-TRP3', siFuera: `${cm(b / 2)} es MP, la mitad de la base menor; PQ es lo que sigue.` }]), cm),
      solucion: { texto: 'PQ es la semidiferencia de las bases:', ecuacion: junto([`(${B} − ${b}) ÷ 2 = `, dF(cm((B - b) / 2))]) } };
  }
  function casoTrapX(r) {
    for (let t = 0; t < 300; t++) {
      const x = r.ent(3, 15), p = r.ent(2, 4), q = r.ent(-6, 6), s = r.ent(-3, 8), Bv = p * x + q, bv = x + s;
      if (Bv <= bv + 1 || bv < 2 || (Bv + bv) % 2) continue;
      const mn = (Bv + bv) / 2, c = mn - x;
      if (x === 8 && p === 3) continue;
      return { pregunta: `En un trapecio, la base mayor mide ${exL(p, q)}, la menor ${exL(1, s)} y la mediana ${exL(1, c)}, en centímetros. ¿Cuánto mide la mediana?`, datos: [D_MN],
        opciones: opciones(mn, OPS(r, [
          { id: 'x', valor: x, error: 'GE-CON30', siFuera: `x = ${x} está bien; falta reemplazarlo en la mediana.` },
          { id: 'mayor', valor: Bv, error: 'GE-TRP8', siFuera: `${cm(Bv)} es la base mayor; se pide la mediana.` },
          { id: 'suma', valor: Bv + bv, error: 'GE-TRP2', siFuera: 'La suma de las bases es el doble de la mediana; falta la mitad.' }]), cm),
        solucion: { texto: `(${exL(p, q)} + ${exL(1, s)}) ÷ 2 = ${exL(1, c)}, así que x = ${x}.`, ecuacion: junto([`${x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = `, dF(cm(mn))]) } };
    }
    throw new Error('casoTrapX sin caso');
  }
  function casoTres(r) {
    for (let t = 0; t < 300; t++) {
      const b = r.ent(2, 12), B = b + 4 * r.ent(1, 5);
      if (b === 4 && B === 12) continue;
      const k = (B - b) / 4, ls = [b + k, b + 2 * k, b + 3 * k], tot = ls.reduce((a, c) => a + c, 0);
      return { pregunta: `En el trapecio ABCD, las bases miden BC = ${cm(b)} y AD = ${cm(B)}. AB se parte en cuatro partes iguales, y por los tres puntos se trazan paralelas a las bases hasta CD. ¿Cuánto suman las tres paralelas?`, datos: [D_MN],
        opciones: opciones(tot, OPS(r, [
          { id: 'medio', valor: b + 2 * k, error: 'GE-TRP9', siFuera: `${cm(b + 2 * k)} es la del medio, la mediana; faltan las otras dos.` },
          { id: 'bases', valor: B + b, error: 'GE-TRP10', siFuera: 'Sumar las bases está bien para la mediana; aquí son tres paralelas.' },
          { id: 'cuatro', valor: 4 * (b + 2 * k), error: 'GE-TRP9', siFuera: 'Las tres paralelas miden distinto; la del medio no se repite cuatro veces.' }]), cm),
        solucion: { texto: `La del medio es la mediana, ${b + 2 * k}; las otras son medianas de trapecios más chicos: ${ls[0]} y ${ls[2]}.`, ecuacion: junto([`${ls[0]} + ${ls[1]} + ${ls[2]} = `, dF(cm(tot))]) } };
    }
    throw new Error('casoTres sin caso');
  }

  const trapecios = {
    id: 'trapecios',
    titulo: 'El trapecio y su mediana',
    pregunta: '¿Qué ancho tiene el agua de un canal lleno hasta la mitad?',
    temas: ['Trapecios'],
    pieza: GO,
    aprendizaje: 'La mediana del trapecio es paralela a las bases y mide su semisuma; el tramo entre los puntos medios de las diagonales, su semidiferencia.',
    actividad: 'Cambiar el fondo de un canal y medir el ancho del agua a media altura.',
    // Lee: el canal como trapecio, bases y mediana. No dice cuánto mide la mediana (el juego) ni el tramo PQ (la
    // predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un canal de riego', texto: 'Cortado de frente, un canal de riego es un trapecio: la boca y el fondo son paralelos y se llaman bases; las paredes son los lados no paralelos.',
          pieza: GO, dibujo: fig(figCanal(2, 0, { alt: 'El corte de un canal de riego: la boca AD de 6 m arriba, el fondo BC de 2 m abajo y el agua hasta la mitad.' })) },
        { titulo: 'Agua hasta la mitad', texto: 'Si el agua llega a la mitad de la hondura, su borde toca cada pared justo en su mitad: M en AB y N en CD. El segmento MN se llama mediana del trapecio.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el ancho del fondo y mira el ancho del agua, MN. Después corre el fondo hacia un lado: ¿cambia MN?' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'La boca del canal mide 6 m; el agua llega a la mitad de su hondura.',
      mision: {
        texto: 'Ajusta el fondo hasta que el agua mida 4,5 m de ancho.',
        logrado: v => v.b === 3,
        bien: 'Con 3 m de fondo, el agua mide 4,5 m. Córrelo a un lado: sigue igual.',
      },
      voz: '¿El agua queda más cerca de la boca o del fondo?',
      leyenda: [
        { s: dO('AD'), t: 'la boca del canal' },
        { s: dI('BC'), t: 'el fondo del canal' },
        { s: 'M, N', t: 'la mitad de cada pared' },
        { s: 'MN', t: 'el borde del agua: la mediana' },
      ],
      controles: [{ id: 'b', etiqueta: 'BC, el fondo', min: 1.5, max: 5, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1, color: 'c-i' },
        { id: 'd', etiqueta: 'el fondo corrido', min: -1, max: 1, paso: 0.5, inicio: 0, unidad: 'm', decimales: 1 }],
      dibujo: v => ({ datos: figCanal(v.b, v.d), estado: {} }),
      lectura: v => [junto(`MN = ${mt((BOCA + v.b) / 2)}`), ', entre ', dI(junto(`BC = ${mt(v.b)}`)), ' y ', dO(junto(`AD = ${mt(BOCA)}`))],
      minimo: 4,
    },
    predice: {
      pregunta: `Otro canal: boca AD de 10 m, fondo BC de 4 m. Los cordeles AC y BD cruzan la línea del agua MN en P y Q. ¿Cuánto mide PQ?${NO_ESC}`,
      datos: ['M y N son las mitades de las paredes AB y CD.', 'P y Q son las mitades de los cordeles AC y BD.'],
      voz: 'Mira los triángulos que arma cada cordel.',
      opciones: [
        { id: 'c', texto: '3 m', correcta: true },
        { id: 'mn', texto: '7 m', error: 'GE-TRP1', siFuera: '7 m mide toda la línea del agua, MN; PQ es solo su tramo del medio.' },
        { id: 'resta', texto: '6 m', error: 'GE-TRP2', siFuera: 'Restar las bases va bien; falta la mitad.' },
        { id: 'mp', texto: '2 m', error: 'GE-TRP3', siFuera: '2 m es MP, la mitad del fondo; PQ es lo que sigue.' },
      ],
      dibujo: fig(CANAL_P, { corte: 0 }),
      revelar: fig(CANAL_M, { corte: 3 }),
      coincide: 'Coincide: MQ = 5 m y MP = 2 m, así que PQ = 3 m: la mitad de 10 − 4.',
      noCoincide: 'Revisemos: MQ mide la mitad de la boca, 5 m, y MP la mitad del fondo, 2 m. PQ = 3 m.',
    },
    mira: {
      pieza: GO,
      datos: CANAL_M,
      voz: 'Cada cordel arma dos triángulos con bases medias.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La línea del agua MN corta el cordel AC en su mitad, P.', ecuacion: junto('AP = PC') },
        { estado: { corte: 1 }, texto: 'En △ABC, MP une dos puntos medios: es base media.', ecuacion: junto(['MP = ', dI('4 m'), ' ÷ 2 = 2 m']) },
        { estado: { corte: 2 }, texto: 'En △ACD, PN también es base media.', ecuacion: junto(['PN = ', dO('10 m'), ' ÷ 2 = 5 m', '   →   ', 'MN = 7 m']) },
        { estado: { corte: 3 }, texto: 'Con el otro cordel, MQ es base media de △ABD.', ecuacion: junto(['MQ = 5 m', '   →   ', 'PQ = 5 m − 2 m = 3 m']) },
        { estado: { corte: 3 }, texto: 'Con cualquier trapecio: la semisuma y la semidiferencia de las bases.', ecuacion: junto(['MN = (', dO('AD'), ' + ', dI('BC'), ') ÷ 2', Y, 'PQ = (', dO('AD'), ' − ', dI('BC'), ') ÷ 2']) },
      ],
    },
    regla: {
      texto: 'La mediana MN une las mitades de los lados no paralelos: es paralela a las bases y mide su semisuma. PQ, entre las mitades de las diagonales, mide su semidiferencia.',
      ecuacion: junto([dF('MN'), ' = (', dO('AD'), ' + ', dI('BC'), ') ÷ 2', Y, dF('PQ'), ' = (', dO('AD'), ' − ', dI('BC'), ') ÷ 2']),
      condicion: 'BC ∥ AD, con AD la base mayor; vale se incline como se incline el trapecio.',
      voz: 'Suma y mitad para MN; resta y mitad para PQ.',
    },
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const b = r.ent(4, 14), B = b + 2 * r.ent(2, 7), mn = (B + b) / 2, pq = (B - b) / 2;
          return {
            enunciado: `En un trapecio, la mediana mide ${cm(mn)} y el tramo entre los puntos medios de las diagonales, ${cm(pq)}. ¿Cuánto miden las bases?`,
            datos: [D_MN, D_PQ],
            pasos: [
              { tipo: 'pide', texto: 'Piden las dos bases.' },
              { tipo: 'datos', texto: `La semisuma de las bases, ${cm(mn)}, y su semidiferencia, ${cm(pq)}.` },
              { tipo: 'regla', texto: `Las bases suman 2 · ${mn} = ${2 * mn} y se llevan 2 · ${pq} = ${2 * pq}.` },
              { tipo: 'cuentas', texto: 'La mayor es la mediana más PQ; la menor, la mediana menos PQ.', ecuacion: junto([`${mn} + ${pq} = `, dF(String(B)), Y, `${mn} − ${pq} = `, dF(String(b))]) },
              { tipo: 'sentido', texto: `Comprobación: (${B} + ${b}) ÷ 2 = ${mn} y (${B} − ${b}) ÷ 2 = ${pq}.` },
            ],
            respuesta: [dF(cm(B)), ' y ', dF(cm(b))],
          };
        }
        const x = r.ent(15, 30), a = 2 * x + 10;
        return {
          enunciado: `En el trapecio isósceles ABCD, con BC ∥ AD, m∠A = 2x + 10° y m∠D = 3x − ${x - 10}°. ¿Cuánto mide m∠C?`,
          datos: [D_TISO, D_CONJ],
          pasos: [
            { tipo: 'pide', texto: 'Piden el ángulo en C, de la base BC.' },
            { tipo: 'datos', texto: 'A y D son los ángulos de la base AD.' },
            { tipo: 'regla', texto: 'En el trapecio isósceles, A y D miden igual; y C con D son conjugados internos: suman 180°.' },
            { tipo: 'cuentas', texto: `2x + 10 = 3x − ${x - 10}, así que x = ${x} y m∠D = ${a}°.`, ecuacion: junto([`m∠C = 180° − ${a}° = `, dF(gr(180 - a))]) },
            { tipo: 'sentido', texto: 'Tiene sentido: los ángulos de la base mayor son agudos y los de la menor, obtusos.' },
          ],
          respuesta: [junto('m∠C = '), dF(gr(180 - a))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Suma y mitad, o resta y mitad.',
      generar(s) { return conCuatro([casoMed, casoBase, casoPQ, casoTrapX, casoTres][s % 5], azar(s + 7), firmasDe(EJ6)); },
    },
  };

  // ---------- Laboratorio (juego libre, sin preguntas) ----------
  // Tres mesas, con los id de antes y los colores del curso (AC naranja, BD turquesa, lo demás en tinta; sin verde ni
  // rojo). Sin cóncavos ni cruzados: ninguna idea los enseña.
  const medios4 = V => V.map((p, k) => U.medio(p, V[(k + 1) % 4]));
  const esConvexo = V => { const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const sg = V.map((p, k) => Math.sign(cr(p, V[(k + 1) % 4], V[(k + 2) % 4]))); return sg.every(x => x === sg[0] && x !== 0); };
  const vCuad = v => [[0, 0], [8, 0], [v.cx, v.cy], [v.dx, v.dy]];
  const cuadLibre = v => {
    const V = vCuad(v), M = medios4(V);
    return { alt: `Un cuadrilátero ABCD${esConvexo(V) ? '' : ' (no convexo)'}: sus diagonales miden ${f(U.dist(V[0], V[2]), 2)} y ${f(U.dist(V[1], V[3]), 2)}; los puntos medios de sus lados forman un paralelogramo.`,
      vista: { x: [-2.6, 10.6], y: [-1.4, 7.4] },
      puntos: [...V.map((p, k) => ({ id: 'ABCD'[k], x: p[0], y: p[1], rotulo: 'ABCD'[k], lado: [-135, -45, 45, 135][k] })),
        ...M.map((p, k) => ({ id: 'MNPQ'[k], x: p[0], y: p[1], rotulo: 'MNPQ'[k], lado: [-90, 0, 90, 180][k] }))],
      regiones: [{ puntos: ['M', 'N', 'P', 'Q'], opacidad: 0.12 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' },
        { de: 'A', a: 'C', color: 'o', grosor: 'fino', discontinua: true }, { de: 'B', a: 'D', color: 'i', grosor: 'fino', discontinua: true },
        { de: 'M', a: 'N', paralela: 1 }, { de: 'P', a: 'Q', paralela: 1 }, { de: 'N', a: 'P', paralela: 2 }, { de: 'Q', a: 'M', paralela: 2 }] };
  };
  const ladosVar = v => { const M = medios4(vCuad(v)); return [U.dist(M[0], M[1]), U.dist(M[1], M[2])]; };
  const cruceVar = v => { const V = vCuad(v), p = [V[2][0] - V[0][0], V[2][1] - V[0][1]], q = [V[3][0] - V[1][0], V[3][1] - V[1][1]]; return p[0] * q[0] + p[1] * q[1]; };
  const mesaCuad = {
    id: 'cuadrilatero-libre', titulo: 'Los puntos medios de un cuadrilátero', pieza: 'geo-figura',
    consigna: 'Mueve C y D. Mira la figura que forman los puntos medios de los lados y compárala con las diagonales.',
    controles: [
      { id: 'cx', etiqueta: 'C a lo ancho', min: 4, max: 10, paso: 0.5, inicio: 7, unidad: '', decimales: 1 },
      { id: 'cy', etiqueta: 'C a lo alto', min: 2, max: 7, paso: 0.5, inicio: 5, unidad: '', decimales: 1 },
      { id: 'dx', etiqueta: 'D a lo ancho', min: -2, max: 4, paso: 0.5, inicio: 1, unidad: '', decimales: 1 },
      { id: 'dy', etiqueta: 'D a lo alto', min: 2, max: 7, paso: 0.5, inicio: 5.5, unidad: '', decimales: 1 },
    ],
    dibujo: v => ({ datos: cuadLibre(v), estado: {} }),
    arrastres: [
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-o', donde: v => G.aPantalla(cuadLibre(v), [v.cx, v.cy]), mover: (q, v) => { const z = G.aPlano(cuadLibre(v), q); return { cx: z[0], cy: z[1] }; } },
      { id: 'vertice-d', etiqueta: 'vértice D', color: 'c-i', donde: v => G.aPantalla(cuadLibre(v), [v.dx, v.dy]), mover: (q, v) => { const z = G.aPlano(cuadLibre(v), q); return { dx: z[0], dy: z[1] }; } },
    ],
    lectura: v => { const L = ladosVar(v), V = vCuad(v); return [junto(`MN = PQ = ${f(L[0], 2)}`), ' (', { v: 'c-o', t: junto(`AC ÷ 2`) }, ')', '   y   ', junto(`NP = QM = ${f(L[1], 2)}`), ' (', { v: 'c-i', t: junto(`BD ÷ 2`) }, ')', esConvexo(V) ? '' : '; no es convexo'].filter(x => x !== ''); },
    invitaciones: [
      { texto: 'Consigue que la figura de adentro sea un rombo.', logrado: v => { const L = ladosVar(v); return Math.abs(L[0] - L[1]) < 1e-9; },
        bien: 'Rombo adentro: las diagonales AC y BD miden igual.' },
      { texto: 'Consigue que la figura de adentro sea un rectángulo.', logrado: v => Math.abs(cruceVar(v)) < 1e-9,
        bien: 'Rectángulo adentro: AC y BD se cortan en ángulo recto.' },
      { texto: 'Haz que ABCD sea un paralelogramo y mira la figura de adentro.', logrado: v => Math.abs(v.cx - 8 - v.dx) < 1e-9 && Math.abs(v.cy - v.dy) < 1e-9,
        bien: 'También adentro hay un paralelogramo: sus lados son medias diagonales.' },
    ],
  };
  const nombreDe = (t, a, b) => (t === 90 && a === b ? 'cuadrado' : t === 90 ? 'rectángulo' : a === b ? 'rombo' : 'paralelogramo');
  const paraLibre = v => {
    const P = ptsPara(v.a, v.b, v.t), O = U.medio(P[0], P[2]), cr = U.angulo(O, P[2], P[3]);
    return { alt: `Un ${nombreDe(v.t, v.a, v.b)} de lados ${f(v.a)} y ${f(v.b)} con ${v.t}° en A; sus diagonales miden ${f(U.dist(P[0], P[2]), 2)} y ${f(U.dist(P[1], P[3]), 2)}.`,
      vista: { x: [-4.2, 9.2], y: [-0.9, 5.6] },
      puntos: [...P.map((p, k) => ({ id: 'ABCD'[k], x: p[0], y: p[1], rotulo: 'ABCD'[k], lado: [-135, -45, 45, 135][k] })), { id: 'O', x: O[0], y: O[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', paralela: 1 }, { de: 'D', a: 'C', paralela: 1 }, { de: 'A', a: 'D', paralela: 2 }, { de: 'B', a: 'C', paralela: 2 },
        { de: 'A', a: 'C', color: 'o', grosor: 'variable' }, { de: 'B', a: 'D', color: 'i', grosor: 'variable' }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'h', mide: v.t }, { en: 'O', de: 'C', a: 'D', radio: 12, mide: cr }] };
  };
  const dsMesa = v => { const P = ptsPara(v.a, v.b, v.t), O = U.medio(P[0], P[2]); return { ac: U.dist(P[0], P[2]), bd: U.dist(P[1], P[3]), cr: U.angulo(O, P[2], P[3]) }; };
  const mesaPara = {
    id: 'paralelogramo-libre', titulo: 'Diagonales que dan el nombre', pieza: GO,
    consigna: 'Cambia la esquina A y los lados. Busca diagonales iguales, luego un cruce de 90° y luego las dos cosas.',
    controles: [
      { id: 't', etiqueta: 'm∠A', min: 45, max: 135, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'a', etiqueta: 'Lado AB', min: 2, max: 5, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1 },
      { id: 'b', etiqueta: 'Lado AD', min: 2, max: 5, paso: 0.5, inicio: 3, unidad: '', decimales: 1 },
    ],
    // (Con geo-objeto, el rótulo de A va en el hueco que deja la diagonal AC.)
    dibujo: v => ({ datos: { objeto: 'angulos', figura: paraLibre(v) }, estado: {} }),
    lectura: v => { const d = dsMesa(v); return [nombreDe(v.t, v.a, v.b), ': ', { v: 'c-o', t: junto(`AC = ${f(d.ac, 2)}`) }, ' y ', { v: 'c-i', t: junto(`BD = ${f(d.bd, 2)}`) }, junto(`; se cruzan a ${f(d.cr, 0)}°`)]; },
    invitaciones: [
      { texto: 'Consigue diagonales iguales sin que la figura sea un cuadrado.', logrado: v => { const d = dsMesa(v); return Math.abs(d.ac - d.bd) < 1e-9 && v.a !== v.b; },
        bien: 'Diagonales iguales: la esquina A quedó recta. Es un rectángulo.' },
      { texto: 'Haz que las diagonales se crucen a 90° con la esquina A no recta.', logrado: v => Math.abs(dsMesa(v).cr - 90) < 1e-6 && v.t !== 90,
        bien: 'Cruce recto: los cuatro lados son iguales. Es un rombo.' },
      { texto: 'Logra las dos cosas a la vez: diagonales iguales y cruce de 90°.', logrado: v => { const d = dsMesa(v); return Math.abs(d.ac - d.bd) < 1e-9 && Math.abs(d.cr - 90) < 1e-6; },
        bien: 'Las dos a la vez: es un cuadrado, rectángulo y rombo.' },
    ],
  };
  const trapLibre = v => {
    const A = [0, 0], Dp = [10, 0], B = [v.dx, v.h], C = [v.dx + v.b, v.h], M = U.medio(A, B), N = U.medio(Dp, C), P = U.medio(A, C), Q = U.medio(B, Dp);
    return { alt: `Un trapecio de bases 10 y ${f(v.b)}: la mediana MN mide ${f((10 + v.b) / 2)} y el tramo PQ, ${f(Math.abs(10 - v.b) / 2)}.`,
      vista: { x: [-3.6, 14.6], y: [-0.8, 6.6] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'D', x: 10, y: 0, rotulo: 'D', lado: -60 }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: 60 }, { id: 'B', x: B[0], y: B[1], rotulo: 'B', lado: 120 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 180 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 0 }, { id: 'P', x: P[0], y: P[1] }, { id: 'Q', x: Q[0], y: Q[1] }],
      segmentos: [{ de: 'A', a: 'D', color: 'o', grosor: 'variable', paralela: 1 }, { de: 'B', a: 'C', color: 'i', grosor: 'variable', paralela: 1 },
        { de: 'A', a: 'B' }, { de: 'D', a: 'C' }, { de: 'A', a: 'C', grosor: 'fino', discontinua: true }, { de: 'B', a: 'D', grosor: 'fino', discontinua: true },
        { de: 'M', a: 'N', grosor: 'fino' }, { de: 'P', a: 'Q', grosor: 'variable' }] };
  };
  const mesaTrap = {
    id: 'trapecio-libre', titulo: 'Trapecio estirable', pieza: 'geo-figura',
    consigna: 'Corre y sube la base menor BC, y cámbiale el largo. Mira la mediana MN y el tramo PQ.',
    controles: [
      { id: 'dx', etiqueta: 'B a lo ancho', min: -2, max: 6, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
      { id: 'h', etiqueta: 'altura', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
      { id: 'b', etiqueta: 'BC', min: 1, max: 8, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: trapLibre(v), estado: {} }),
    lectura: v => [junto(`MN = ${f((10 + v.b) / 2, 2)}`), '   y   ', junto(`PQ = ${f((10 - v.b) / 2, 2)}`), junto(`, con AD = 10`)],
    invitaciones: [
      { texto: 'Haz que la mediana MN mida justo 8.', logrado: v => { const t = trapLibre(v), p = Object.fromEntries(t.puntos.map(q => [q.id, [q.x, q.y]])); return Math.abs(U.dist(p.M, p.N) - 8) < 1e-9; },
        bien: 'MN = 8 con BC = 6: la semisuma de 10 y 6. ¿Importó la altura?' },
      { texto: 'Haz que el tramo PQ mida justo 2.', logrado: v => { const t = trapLibre(v), p = Object.fromEntries(t.puntos.map(q => [q.id, [q.x, q.y]])); return Math.abs(U.dist(p.P, p.Q) - 2) < 1e-9; },
        bien: 'PQ = 2 con BC = 6: la semidiferencia de 10 y 6.' },
      { texto: 'Haz un trapecio isósceles: AB y CD del mismo largo.', logrado: v => Math.abs(U.dist([0, 0], [v.dx, v.h]) - U.dist([10, 0], [v.dx + v.b, v.h])) < 1e-9,
        bien: 'Lados no paralelos iguales: MN sigue dependiendo solo de las bases.' },
    ],
  };

  return {
    unidad: 'geometria.poligonos-y-cuadrilateros',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'En la proposición I.34 de los Elementos, una diagonal parte el paralelogramo en dos triángulos congruentes: así se justifica que sus lados opuestos son iguales. La misma idea de descomponer en triángulos sirve para polígonos de cualquier número de lados.',
      pregunta: '¿Qué línea convierte una figura nueva en triángulos conocidos?',
      fuente: { titulo: 'Euclides, Elementos I.34 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI34.html' },
    },
    // La tabla de letras de la unidad (molde §0.4; propuesta §5).
    letras: { n: 'el número de lados del polígono (igual al de vértices)', S: 'la suma de los ángulos interiores', x: 'lo que se pide, un número', k: 'la medida de una parte, en una razón' },
    glosario: [
      // Idea 1. Ningún ejemplo dice la suma de un pentágono (la predicción).
      { termino: 'polígono', formas: ['polígono', 'polígonos'], def: 'Figura plana cerrada hecha de segmentos rectos que se unen de dos en dos por sus extremos.',
        simple: 'Una figura cerrada de lados rectos, como un terreno visto desde arriba.',
        ejemplos: ['Un triángulo es el polígono de 3 lados.', 'La señal de «Pare» es un polígono de 8 lados.', 'Un círculo no lo es: su borde es curvo.'], ver: ['polígono convexo', 'cuadrilátero'] },
      { termino: 'polígono convexo', formas: ['polígono convexo', 'polígonos convexos', 'convexo', 'convexos'],
        def: 'Polígono sin entrantes: cada ángulo interior mide menos de 180°.',
        simple: 'Un polígono sin entrantes, como una loseta o una señal de tránsito.',
        ejemplos: ['Un rectángulo lo es: sus cuatro ángulos miden 90°.', 'Una estrella de cinco puntas no lo es: tiene entrantes.', 'Una diagonal de un polígono convexo queda siempre adentro.'], ver: ['polígono'] },
      { termino: 'cuadrilátero', formas: ['cuadrilátero', 'cuadriláteros'], def: 'Polígono de cuatro lados: tiene cuatro vértices, cuatro ángulos y dos diagonales.',
        simple: 'Una figura de cuatro lados rectos, como una loseta.',
        ejemplos: ['Una hoja de cuaderno es un cuadrilátero.', 'En el cuadrilátero ABCD, los lados son AB, BC, CD y DA.', 'La diagonal AC lo parte en dos triángulos.'], ver: ['polígono'] },
      { termino: 'pentágono', formas: ['pentágono', 'pentágonos'], def: 'Polígono de cinco lados.',
        ejemplos: ['La estrella de cinco puntas se dibuja con las diagonales de un pentágono.', 'ABCDE es un pentágono: tiene 5 vértices.', 'Desde un vértice, dos diagonales lo parten en 3 triángulos.'] },
      { termino: 'hexágono', formas: ['hexágono', 'hexágonos'], def: 'Polígono de seis lados.',
        ejemplos: ['Las celdas de un panal tienen forma de hexágono.', 'ABCDEF es un hexágono.', 'Desde un vértice, tres diagonales lo parten en 4 triángulos.'] },
      // Idea 2. Ningún ejemplo dice cuánto suman los giros de una plaza de esquinas distintas (la predicción).
      { termino: 'polígono equiángulo', formas: ['polígono equiángulo', 'polígonos equiángulos', 'equiángulo', 'equiángulos'],
        def: 'Polígono con todos sus ángulos interiores iguales.',
        simple: 'Un polígono con todas sus esquinas iguales.',
        ejemplos: ['Un rectángulo es un cuadrilátero equiángulo: sus cuatro ángulos miden 90°.', 'Un triángulo equiángulo es equilátero.', 'Un equiángulo puede tener lados distintos, como un rectángulo.'], ver: ['polígono regular'] },
      // Se mudó de Polígonos regulares (decisión 5 de la propuesta): allá se sigue usando y se marca «se explica en…».
      { termino: 'polígono regular', formas: ['polígono regular', 'polígonos regulares', 'regular', 'regulares'],
        def: 'Polígono con todos sus lados iguales y todos sus ángulos iguales.',
        simple: 'Lados iguales y esquinas iguales, como la señal de «Pare».',
        ejemplos: ['El cuadrado es regular; el rectángulo de lados distintos, no.', 'El triángulo equilátero es el polígono regular de 3 lados.', 'El rombo de esquinas distintas no lo es: tiene lados iguales, pero ángulos distintos.'], ver: ['polígono equiángulo'] },
      { termino: 'perímetro', formas: ['perímetro', 'perímetros'], def: 'Suma de las longitudes de todos los lados de una figura.',
        simple: 'Lo que mide el borde entero: el alambre que la rodea.',
        ejemplos: ['Un terreno de lados 5 m, 3 m, 5 m y 3 m tiene 16 m de perímetro.', 'El perímetro de un cuadrado de 4 cm es 16 cm.', 'Rodear un terreno con alambre pide tanto alambre como su perímetro.'] },
      // Idea 3. Ningún ejemplo da las ligas de un geoplano de 10 clavos (la predicción).
      { termino: 'geoplano', formas: ['geoplano', 'geoplanos'], def: 'Tablero con clavos en el que se estiran ligas para formar figuras.',
        simple: 'Un tablero con clavos para armar figuras con ligas.',
        ejemplos: ['Con tres ligas en un geoplano se arma un triángulo.', 'En el geoplano redondo, los clavos están en círculo.', 'Una liga estirada entre dos clavos es un segmento.'] },
      { termino: 'vecino', formas: ['vecinos', 'vecino', 'vecinas', 'vecina'], def: 'Dicho de dos vértices o dos ángulos de un polígono: seguidos, unidos por un mismo lado.',
        simple: 'Seguidos en la ronda, uno al lado del otro.',
        ejemplos: ['En ABCDE, B y C son vecinos; B y D, no.', 'Cada vértice tiene dos vecinos.', 'Entre dos vértices vecinos va un lado, no una diagonal.'] },
      // Idea 4. «paralelogramo» se mudó de Congruencia (decisión 6). Ningún ejemplo dice dónde se cortan las diagonales.
      { termino: 'paralelogramo', formas: ['paralelogramo', 'paralelogramos'], def: 'Cuadrilátero con sus lados opuestos paralelos de dos en dos.',
        simple: 'Un cuadrilátero de lados paralelos dos a dos, como un marco inclinado.',
        ejemplos: ['Un rectángulo es un paralelogramo.', 'Un marco de madera que se inclina sigue siendo un paralelogramo.', 'Un trapecio no lo es: solo tiene un par de lados paralelos.'], ver: ['cuadrilátero', 'trapecio', 'trapezoide'] },
      { termino: 'trapezoide', formas: ['trapezoide', 'trapezoides'], def: 'Cuadrilátero sin ningún par de lados paralelos.',
        simple: 'Un cuadrilátero sin lados paralelos, como una cometa.',
        ejemplos: ['Una cometa de varillas desiguales es un trapezoide.', 'Si AB no es paralelo a CD ni AD a BC, ABCD es un trapezoide.', 'Sus ángulos también suman 360°.'], ver: ['trapecio', 'paralelogramo'] },
      // Idea 5. «rombo» no dice cómo se cortan sus diagonales (la predicción).
      { termino: 'rombo', formas: ['rombo', 'rombos'], def: 'Paralelogramo con sus cuatro lados iguales.',
        simple: 'Un cuadrilátero de cuatro lados iguales, como la reja de un portón.',
        ejemplos: ['Un marco de cuatro listones de 50 cm, inclinado, es un rombo.', 'El cuadrado es un rombo con ángulos rectos.', 'Un rombo de 6 cm de lado tiene 24 cm de perímetro.'], ver: ['paralelogramo'] },
      { termino: 'a escuadra', formas: ['a escuadra'], def: 'Dicho de un marco o de una esquina: con sus ángulos de 90°.',
        simple: 'Con sus esquinas rectas, como las de una hoja.',
        ejemplos: ['Una puerta a escuadra cierra bien.', 'Un marco a escuadra es un rectángulo.', 'El albañil comprueba con su escuadra que la esquina quedó a escuadra.'] },
      // Idea 6. «semidiferencia» no usa 10 y 4 (la predicción).
      { termino: 'trapecio', formas: ['trapecio', 'trapecios'], def: 'Cuadrilátero con un solo par de lados paralelos, que se llaman bases.',
        simple: 'Un cuadrilátero con solo dos lados paralelos, como un canal cortado.',
        ejemplos: ['Visto de costado, un balde dibuja un trapecio.', 'Si BC ∥ AD y AB no es paralelo a CD, ABCD es un trapecio.', 'Si sus lados no paralelos miden igual, es un trapecio isósceles.'], ver: ['mediana del trapecio', 'trapezoide'] },
      { termino: 'mediana del trapecio', formas: ['mediana del trapecio', 'medianas del trapecio'], def: 'Segmento que une los puntos medios de los dos lados no paralelos de un trapecio.',
        simple: 'La línea del agua en un canal lleno hasta la mitad.',
        ejemplos: ['En el trapecio ABCD, con M y N los puntos medios de AB y CD, MN es la mediana.', 'Va de una pared del canal a la otra, a media altura.', 'Cruza el trapecio de lado a lado.'], ver: ['trapecio'] },
      { termino: 'semisuma', def: 'La mitad de la suma de dos cantidades.', simple: 'Sumar dos números y sacar la mitad: el punto del medio.',
        ejemplos: ['Semisuma de 8 y 2: (8 + 2) ÷ 2 = 5.', 'La semisuma de dos números iguales es ese mismo número.', 'Es el promedio de los dos.'], ver: ['semidiferencia'] },
      { termino: 'semidiferencia', def: 'La mitad de la resta de dos cantidades: la mayor menos la menor.', simple: 'Restar dos números y sacar la mitad.',
        ejemplos: ['Semidiferencia de 14 y 6: (14 − 6) ÷ 2 = 4.', 'La semidiferencia de dos números iguales es 0.', 'Semisuma más semidiferencia da el mayor: 10 + 4 = 14.'], ver: ['semisuma'] },
    ],
    laboratorio: [mesaCuad, mesaPara, mesaTrap],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'cuadrilatero-libre': ['paralelogramos'],
      'paralelogramo-libre': ['rectangulo-rombo-cuadrado'],
      'trapecio-libre': ['trapecios'],
    },
    ideas: [sumaIdea, exteriores, diagonales, paralelogramos, especiales, trapecios],
  };
});
