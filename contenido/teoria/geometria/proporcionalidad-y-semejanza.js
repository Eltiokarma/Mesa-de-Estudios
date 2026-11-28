/*
 * Teoría de «Proporcionalidad y semejanza» (geometria.proporcionalidad-y-semejanza). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 6), microguion «Geometría 6: el área cambia con el cuadrado de la
 * escala» del expediente (idea 5) y Elementos VI.2 (Thales por áreas) y VI.3 (bisectriz).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: usar razones entre segmentos (Thales, bisectriz, Ceva y Menelao) y semejanza emparejando lados por sus
 *     ángulos, y separar la escala de longitudes (k) de la de áreas (k²).
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla segmentos con Thales y con la bisectriz, completa Ceva y Menelao, resuelve semejanzas
 *     antiparalelas y escala áreas por k².
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿qué lado va con cuál?» y «¿por qué el área no se duplica?».
 *
 * Colores: segmento o razón de arriba naranja (c-o), la de abajo turquesa (c-i), referencia verde (c-d), pedido rojo (c-h).
 * Precisión del expediente: arrastrar muestra casos; la prueba (áreas, paralela auxiliar) explica por qué.
 * Códigos: GE1, GE2, GE8, GE22 (docs/investigacion/geometria-ideas-erroneas.md); GE-THA, GE-CEV, GE-SEM hipótesis nuevas.
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
  const f = (n, d = 2) => Kit.formatear(n, d);
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema, sobreRecta da la fracción de un lado y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const sobre = (datos, A, B, pt) => G.sobreRecta(datos, A, B, pt);

  // ======================= Comunes de la etapa 8 =======================
  const GO = 'geo-objeto';
  const fm = n => Kit.formatear(n, 2);
  const m_ = n => `${fm(n)} m`, cm = n => `${fm(n)} cm`;
  const gr = n => `${fm(n)}°`;
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dH = t => ({ v: 'c-h', t }), dF = t => ({ v: 'c-f', t });
  // Entre dos igualdades, «y» o una flecha (un «·» se leía como un producto; auditoría de Circunferencia, M3).
  const Y = '   y   ', FL = '   →   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x && x.t ? Object.assign({}, x, { t: junto(x.t) }) : x);
  const figO = (datos, estado = {}) => ({ pieza: GO, datos, estado });
  const NO_ESC = ' El dibujo no está a escala.';
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  // Una razón entre enteros, reducida: «2 : 3».
  const razon = (a, b) => { const k = mcd(Math.round(a * 100), Math.round(b * 100)) / 100; return `${fm(a / k)} : ${fm(b / k)}`; };
  function azar2(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  // Las opciones: la correcta y los errores que dan un valor distinto (positivo); siempre 4 si se puede.
  function ops(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const out = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || d.valor <= 0) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      out.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return out.slice(0, n);
  }
  // «Ahora tú» no repite un ejemplo de su idea (lección M3 de Congruencia): firma de números y pregunta.
  const firmaDe = t => { const q = Kit.plano(t); return `${(q.match(/\d+(?:[  ]\d{3})*(?:,\d+)?/g) || []).join(' ')}|${((q.match(/¿[^?]*\?/g) || []).pop() || '').replace(/\d+(?:,\d+)?/g, '#')}`; };
  const firmasDe = (ejs, mas = []) => new Set(ejs.map(e => firmaDe(e.enunciado)).concat(mas.map(firmaDe)));
  function conCuatro(caso, r, vetadas) {
    for (let i = 0; i < 400; i++) { const c = caso(r); if (c && c.opciones.length >= 4 && !(vetadas && vetadas.has(firmaDe(c.pregunta)))) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Una figura de geo-figura dentro de la escena «semejante» de geo-objeto.
  //   pts: { id: [x, y] }; letra: { id: texto | null } (sin entrada, la letra es el id; un id que empieza por «~» es de
  //   ayuda: sin punto ni letra); ver: { id: { …props } }; segs: [[de, a, { … }]]; angs: [{ … }]; lados, llaves, libres;
  //   obj: { tipo, … }; vista, alto, alt, sinEscala, fijas: ids cuya letra no se acomoda; regiones.
  function sem(o) {
    const puntos = [];
    for (const [id, p] of Object.entries(o.pts)) {
      const q = { id, x: p[0], y: p[1] }, ayuda = id[0] === '~';
      const letra = o.letra && Object.prototype.hasOwnProperty.call(o.letra, id) ? o.letra[id] : id;
      if (ayuda) q.sinPunto = true; else if (letra) Object.assign(q, { rotulo: letra, lado: 90 });
      Object.assign(q, (o.ver || {})[id] || {});
      puntos.push(q);
    }
    const segmentos = (o.segs || []).map(([de, a, x]) => Object.assign({ de, a }, x || {}));
    const angulos = (o.angs || []).map(a => Object.assign({ radio: 18, holgura: 6 }, a));
    const fg = { alt: o.alt, alto: o.alto || 240, puntos, segmentos, angulos };
    if (o.regiones) fg.regiones = o.regiones;
    const xs = puntos.map(q => q.x), ys = puntos.map(q => q.y);
    fg.vista = o.vista || { x: [Math.min(...xs) - 0.9, Math.max(...xs) + 0.9], y: [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9] };
    PO.acomodarLetras(fg, puntos.filter(q => q.rotulo && !(o.fijas || []).includes(q.id)).map(q => q.id), o.evita || {});
    return Object.assign({ objeto: 'semejante', tipo: 'examen' }, o.obj || {}, { figura: fg },
      o.llaves ? { llaves: o.llaves } : {}, o.cotas ? { cotas: o.cotas } : {}, o.lados ? { ladosRot: o.lados } : {}, o.libres ? { libres: o.libres } : {}, o.sinEscala ? { sinEscala: true } : {});
  }
  const cabe = F => PO.escenaCabe(F);
  // El primero que cabe de una lista de armados (o el primero, si ninguno).
  const elQueCabe = (...fs) => { for (const g of fs) { const F = g(); if (cabe(F)) return F; } return fs[0](); };
  // Una lista de dibujos posibles que nunca queda vacía (si el filtro descarta todos, va el de reserva).
  const noVacia = (l, reserva) => (l.length ? l : [reserva]);

  // ======================= Idea 1: Thales =======================
  // Objeto de la primera pantalla: el plano de un barrio visto desde arriba (geo-objeto, escena «semejante», tipo
  // «calles»; dibujo de prueba): tres jirones paralelos (horizontales) y dos avenidas que los cruzan. Las cuadras de cada
  // avenida entre jirones son los tramos.
  // Cambia: dónde pasa el jirón del medio. · Permanece: 100 m de la avenida 1 y 150 m de la 2 entre el primer jirón y el
  // tercero. · Progresa: las dos razones, siempre iguales. · Se reserva: la parte con el todo (la predicción) y el
  // triángulo (la regla). · Debe verse: AB : BC = DE : EF.
  // La avenida 1 baja casi vertical (80° con los jirones); la 2, más inclinada, mide 1,5 veces más entre el primer jirón y
  // el tercero (sen del ángulo de la 2 = sen 80° ÷ 1,5).
  const HC = 6, A1 = 80, A2 = U.grados(Math.asin(Math.sin(A1 * Math.PI / 180) / 1.5));
  const AV1 = { x: 1.6, a: A1 }, AV2 = { x: 3.6, a: A2 };
  // El punto de la avenida a la fracción t (desde el primer jirón): y baja de HC a 0; x avanza hacia la derecha.
  const pAv = (av, t) => { const y = HC * (1 - t); return [av.x + (HC - y) / Math.tan(av.a * Math.PI / 180), y]; };
  // El plano del barrio. t: dónde cruza el jirón del medio (fracción de la avenida, desde el primer jirón). o: { rot: {
  //   AB, BC, DE, EF, DF, AC } (textos; «?» en tinta), objeto: false (figura de examen, sin el barrio), marcas: [fracciones]
  //   (puntos y paralelas punteadas de Mira, con sus cortes: corteMarcas, corteParalelas, corteMarcas2), corteDE (desde qué
  //   corte se ven los rótulos de DE y EF), alt, sinEscala, letras: { … } }
  // Los jirones se dibujan entre las avenidas, con un poco de más a cada lado (la franja del objeto sigue de borde a borde):
  // así las medidas de las cuadras van afuera sin cruzar una línea.
  function figCalles(t, o = {}) {
    const rot = o.rot || {};
    const A = pAv(AV1, 0), B = pAv(AV1, t), C = pAv(AV1, 1), D = pAv(AV2, 0), E = pAv(AV2, t), F = pAv(AV2, 1);
    const pts = { A, B, C, D, E, F, '~izq': [-6, HC / 2], '~der': [16, HC / 2] };
    const col = (k, base) => (rot[k] === undefined || rot[k] === '?' ? undefined : base);
    const segs = [['A', 'B', { color: col('AB', 'o'), grosor: 'variable' }], ['B', 'C', { color: col('BC', 'i'), grosor: 'variable' }],
      ['D', 'E', { color: col('DE', 'o'), grosor: 'variable' }], ['E', 'F', { color: col('EF', 'i'), grosor: 'variable' }]];
    const calles = [];
    // Un jirón: de un poco antes de la avenida 1 a un poco después de la 2, partido en sus puntos (las letras los esquivan).
    const jiron = (p, q, k, extra = {}) => {
      const y = pts[p][1]; pts[`~j${k}a`] = [pts[p][0] - 0.25, y]; pts[`~j${k}b`] = [pts[q][0] + 0.25, y];
      segs.push([`~j${k}a`, p, extra], [p, q, Object.assign({ paralela: 1 }, extra)], [q, `~j${k}b`, extra]);
      calles.push([`~j${k}a`, `~j${k}b`]);
    };
    jiron('A', 'D', 1); jiron('B', 'E', 2); jiron('C', 'F', 3);
    // Las letras: A y D arriba, C y F abajo; B y E hacia el hueco entre las avenidas (afuera van las medidas).
    const ver = { A: { lado: 90 }, D: { lado: 90 }, C: { lado: 270 }, F: { lado: 270 }, B: { lado: -40 }, E: { lado: -120 } }, letra = Object.assign({}, o.letras || {});
    (o.marcas || []).forEach((u, k) => {
      pts[`m${k}`] = pAv(AV1, u); pts[`n${k}`] = pAv(AV2, u); letra[`m${k}`] = null; letra[`n${k}`] = null;
      ver[`m${k}`] = { desde: o.corteMarcas || 0 }; ver[`n${k}`] = { desde: o.corteMarcas2 || 0 };
      const y = pts[`m${k}`][1]; pts[`~ma${k}`] = [pts[`m${k}`][0] - 0.25, y]; pts[`~mb${k}`] = [pts[`n${k}`][0] + 0.25, y];
      segs.push([`~ma${k}`, `~mb${k}`, { discontinua: true, grosor: 'fino', desde: o.corteParalelas || 0 }]);
    });
    const lados = [];
    const lado = (de, a, k, base, ref, extra) => { if (rot[k] !== undefined) lados.push(Object.assign({ de, a, texto: rot[k], color: col(k, base), ref, dist: 4 }, extra || {})); };
    const en = o.en || {}, con = (k, x) => Object.assign(en[k] !== undefined ? { en: en[k] } : {}, x);
    lado('A', 'B', 'AB', 'o', '~der', con('AB')); lado('B', 'C', 'BC', 'i', '~der', con('BC'));
    lado('D', 'E', 'DE', 'o', '~izq', con('DE', o.corteDE ? { desde: o.corteDE } : {})); lado('E', 'F', 'EF', 'i', '~izq', con('EF', o.corteDE ? { desde: o.corteDE } : {}));
    // Un total va con su nombre («DF = 120 m»), afuera, junto al tramo que no lleva medida.
    if (rot.DF !== undefined) lados.push({ de: 'D', a: 'F', texto: `DF = ${rot.DF}`, ref: '~izq', dist: 6, en: rot.EF === undefined ? 0.8 : 0.15 });
    if (rot.AC !== undefined) lados.push({ de: 'A', a: 'C', texto: `AC = ${rot.AC}`, ref: '~der', dist: 6, en: rot.BC === undefined ? 0.8 : 0.15 });
    const obj = o.objeto === false ? { tipo: 'examen' } : { tipo: 'calles', calles, avenidas: [['A', 'C'], ['D', 'F']] };
    return sem({ pts, segs, ver, letra, lados, obj, alto: 250, fijas: ['A', 'B', 'C', 'D', 'E', 'F'], vista: { x: [0, 11.9], y: [-0.8, HC + 0.8] }, sinEscala: o.sinEscala,
      alt: o.alt || 'El plano de un barrio: tres jirones paralelos cortan las avenidas 1 (A, B, C) y 2 (D, E, F).' });
  }
  // El triángulo ABC con MN paralela a BC (M en AB, N en AC). t: AM/AB dibujado. rot: { AM, MB, AN, NC, AB, AC, BC, MN }.
  // o: { sinEscala, alt, objeto }
  function figTri(t, rot, o = {}) {
    const A = [2.2, 4.2], B = [0, 0], C = [6.4, 0], M = U.mezcla(A, B, t), N = U.mezcla(A, C, t);
    const col = (k, base) => (rot[k] === undefined || rot[k] === '?' ? undefined : base);
    const segs = [['A', 'M', { color: col('AM', 'o'), grosor: 'variable' }], ['M', 'B', { color: col('MB', 'i'), grosor: 'variable' }], ['A', 'N', { color: col('AN', 'o'), grosor: 'variable' }],
      ['N', 'C', { color: col('NC', 'i'), grosor: 'variable' }], ['B', 'C', { paralela: 1 }], ['M', 'N', { paralela: 1, discontinua: !!o.punteada }]];
    const lados = [];
    for (const [de, a, k, base] of [['A', 'M', 'AM', 'o'], ['M', 'B', 'MB', 'i'], ['A', 'N', 'AN', 'o'], ['N', 'C', 'NC', 'i']]) if (rot[k] !== undefined) lados.push({ de, a, texto: rot[k], color: col(k, base), ref: 'C' === a || 'N' === a ? 'B' : 'C', dist: 4 });
    for (const [de, a, k] of [['B', 'C', 'BC'], ['M', 'N', 'MN']]) if (rot[k] !== undefined) lados.push({ de, a, texto: rot[k], ref: 'A', dist: 4, en: 0.28 });
    // M y N con la letra adentro, bajo MN: afuera van las medidas de los tramos.
    return sem({ pts: { A, B, C, M, N }, segs, lados, ver: { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, M: { lado: 300 }, N: { lado: 240 } }, fijas: ['A', 'B', 'C', 'M', 'N'], alto: 250,
      vista: { x: [-0.9, 7.3], y: [-0.8, 4.9] }, sinEscala: o.sinEscala, obj: o.obj,
      alt: o.alt || 'El triángulo ABC, con MN paralela a BC: M en AB y N en AC.' });
  }
  // Tres paralelas (horizontales) cortadas por dos secantes, figura de examen. t: dónde cruza la del medio. rot como figCalles.
  // t puede ser una lista: el primero con el que caben los rótulos.
  const figTres = (t, rot, o = {}) => { const arma = u => figCalles(u, Object.assign({}, o, { rot, objeto: false, alt: o.alt || 'Tres rectas paralelas cortan dos secantes: la primera en A, B y C; la segunda en D, E y F.' }));
    return Array.isArray(t) ? elQueCabe(...t.map(u => () => arma(u))) : arma(t); };

  // La regla de la idea 1, con sus dos casos lado a lado (nota de la sesión, 19 nov: AB/BC = DE/EF tiene su dibujo):
  // a la izquierda, tres paralelas que cortan dos secantes (A, B, C y D, E, F); a la derecha, el triángulo ABC con MN ∥ BC.
  // Las letras A, B y C se repiten porque son dos figuras distintas, como en un libro.
  function figReglaThales() {
    const t = 0.45, s1 = [[0.5, 4], [0.9, 0]], s2 = [[1.9, 4], [4.3, 0]], P = (s, u) => U.mezcla(s[0], s[1], u);
    const T = { A: [8.3, 4], B: [6.3, 0], C: [10.5, 0] };
    const pts = { A: s1[0], B: P(s1, t), C: s1[1], D: s2[0], E: P(s2, t), F: s2[1],
      '~d': [4.8, 4], '~e': [4.8, 4 * (1 - t)], '~f': [4.8, 0],
      A2: T.A, B2: T.B, C2: T.C, M: U.mezcla(T.A, T.B, t), N: U.mezcla(T.A, T.C, t) };
    const segs = [['A', '~d', { paralela: 1 }], ['B', '~e', { paralela: 1 }], ['C', '~f', { paralela: 1 }],
      ['A', 'B', { color: 'o', grosor: 'variable' }], ['B', 'C', { color: 'i', grosor: 'variable' }], ['D', 'E', { color: 'o', grosor: 'variable' }], ['E', 'F', { color: 'i', grosor: 'variable' }],
      ['A2', 'M', { color: 'o', grosor: 'variable' }], ['M', 'B2', { color: 'i', grosor: 'variable' }], ['A2', 'N', { color: 'o', grosor: 'variable' }], ['N', 'C2', { color: 'i', grosor: 'variable' }],
      ['B2', 'C2', { paralela: 1 }], ['M', 'N', { paralela: 1 }]];
    return sem({ pts, segs, letra: { A2: 'A', B2: 'B', C2: 'C' }, fijas: ['A', 'B', 'C', 'D', 'E', 'F', 'A2', 'B2', 'C2', 'M', 'N'],
      ver: { A: { lado: 180 }, B: { lado: 180 }, C: { lado: 180 }, D: { lado: 90 }, E: { lado: 50 }, F: { lado: 270 }, A2: { lado: 90 }, B2: { lado: 225 }, C2: { lado: 315 }, M: { lado: 300 }, N: { lado: 240 } },
      alto: 220, vista: { x: [-0.4, 11.1], y: [-0.9, 4.9] },
      alt: 'Dos figuras: tres paralelas que cortan dos secantes en A, B, C y en D, E, F; y el triángulo ABC con MN paralela a BC.' });
  }
  // Datos (una línea cada uno; herramientas, no el paso hecho).
  // Auditoría (20 nov, lector B, tarjeta 01): el dato dice qué son A a F, para los problemas que no los nombran.
const D_THALES = ['Thales: paralelas que cortan una secante en A, B, C y otra en D, E, F dan ', { frac: ['AB', 'BC'] }, ' = ', { frac: ['DE', 'EF'] }, '.'];
  const D_TRI = ['En un triángulo ABC, si MN ∥ BC (M en AB, N en AC): ', { frac: ['AM', 'MB'] }, ' = ', { frac: ['AN', 'NC'] }, '.'];
  const D_RECIP = 'Y al revés: si M y N parten AB y AC en la misma razón, MN es paralela a BC.';
  const D_SUMA = 'Un tramo entero es la suma de sus partes: AC = AB + BC.';

  // Los 15 ejemplos (cuentas rehechas aparte en el scratchpad: e8-geometria/cuentas.py, idea 1): 12 cm; 9 cm; 80 m; 2 : 3;
  // sí (3/5 = 6/10); 16 cm (12 + 18 = 30 y 40); 7 cm (5/15 = x/21); 9 cm (x = 3); 6 cm (trapecio); 9 cm (cuatro paralelas,
  // 20 y 30); 12 km (6 + 9 = 15, 30 km); 10 cm (x = 5); 9 cm (la cometa); 15 cm (DE = 9); 6 cm (AN para la paralela).
  const EJ1 = [];
  EJ1.push({ nivel: 1, titulo: 'El tramo que falta',
    figura: figO(figTres(0.6, { AB: '6 cm', BC: '9 cm', DE: '8 cm', EF: '?' }, { sinEscala: true })),
    enunciado: `Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = 6 cm, BC = 9 cm y DE = 8 cm. ¿Cuánto mide EF?${NO_ESC}`,
    datos: [D_THALES],
    solucion: [{ texto: 'Tramo con tramo, en el mismo orden:', ecuacion: junto([{ frac: [dO('6'), dI('9')] }, ' = ', { frac: [dO('8'), 'EF'] }, FL, 'EF = 9 · 8 ÷ 6 = ', dF('12 cm')]) }],
    respuesta: [junto('EF = '), dF('12 cm')] });
  EJ1.push({ nivel: 1, titulo: 'Una paralela en el triángulo',
    figura: figO(figTri(0.6, { AM: '4 cm', MB: '6 cm', AN: '6 cm', NC: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, MN es paralela a BC, con M en AB y N en AC. AM = 4 cm, MB = 6 cm y AN = 6 cm. ¿Cuánto mide NC?${NO_ESC}`,
    datos: [D_TRI],
    solucion: [{ texto: 'Arriba con arriba, abajo con abajo:', ecuacion: junto([{ frac: [dO('4'), dI('6')] }, ' = ', { frac: [dO('6'), 'NC'] }, FL, 'NC = 6 · 6 ÷ 4 = ', dF('9 cm')]) }],
    respuesta: [junto('NC = '), dF('9 cm')] });
  EJ1.push({ nivel: 1, titulo: 'Dos avenidas y tres jirones',
    enunciado: 'Tres jirones paralelos cortan dos avenidas. En la primera, las cuadras miden 45 m y 60 m. En la segunda, la primera cuadra mide 60 m. ¿Cuánto mide la segunda?',
    datos: [D_THALES],
    solucion: [{ texto: 'Las cuadras de las dos avenidas están en la misma razón:', ecuacion: junto([{ frac: [dO('45'), dI('60')] }, ' = ', { frac: [dO('60'), 'x'] }]) },
      { texto: 'Se despeja:', ecuacion: junto(['x = 60 · 60 ÷ 45 = ', dF('80 m')]) }],
    respuesta: [dF('80 m')] });
  EJ1.push({ nivel: 1, titulo: 'La misma razón',
    enunciado: 'Tres rectas paralelas cortan a dos secantes. En la primera, los tramos están en razón AB : BC = 2 : 3. ¿En qué razón están los tramos DE y EF de la segunda?',
    datos: [D_THALES],
    solucion: [{ texto: 'Las paralelas cortan las dos secantes en la misma razón:', ecuacion: junto(['DE : EF = AB : BC = ', dF('2 : 3')]) }],
    respuesta: [junto('DE : EF = '), dF('2 : 3')] });
  EJ1.push({ nivel: 1, titulo: '¿Es paralela?',
    enunciado: 'En el triángulo ABC, M está en AB y N en AC. AM = 3 cm, MB = 5 cm, AN = 6 cm y NC = 10 cm. ¿Es MN paralela a BC?',
    datos: [D_RECIP],
    solucion: [{ texto: 'Se comparan las dos razones:', ecuacion: junto([{ frac: [dO('3'), dI('5')] }, ' = 0,6', Y, { frac: [dO('6'), dI('10')] }, ' = 0,6']) },
      { texto: ['Son iguales: ', dF('sí, MN es paralela a BC'), '.'] }],
    respuesta: [dF('Sí'), ': 3/5 = 6/10'] });

  EJ1.push({ nivel: 2, titulo: 'La parte y el todo',
    figura: figO(figTres(0.6, { AB: '12 cm', BC: '18 cm', DE: '?', DF: '40 cm' }, { sinEscala: true })),
    enunciado: `Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = 12 cm, BC = 18 cm y DF = 40 cm. ¿Cuánto mide DE?${NO_ESC}`,
    datos: [D_THALES, D_SUMA],
    solucion: [{ texto: 'AB : BC = 12 : 18 = 2 : 3. DE y EF se reparten DF en la misma razón: 2 partes y 3 partes.', ecuacion: junto(['2 + 3 = 5 partes', FL, '40 cm ÷ 5 = 8 cm']) },
      { texto: 'DE toma dos partes:', ecuacion: junto(['DE = 2 · 8 cm = ', dF('16 cm')]) }],
    respuesta: [junto('DE = '), dF('16 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Con el lado entero',
    figura: figO(figTri(0.55, { AM: '5 cm', AN: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = 5 cm, AB = 15 cm y AC = 21 cm. ¿Cuánto mide AN?${NO_ESC}`,
    datos: [D_TRI, 'Un lado entero es la suma de sus partes: AB = AM + MB.'],
    solucion: [{ texto: 'MB = 15 cm − 5 cm = 10 cm. Si AN = x, entonces NC = 21 − x:', ecuacion: junto([{ frac: [dO('5'), dI('10')] }, ' = ', { frac: ['x', '21 − x'] }]) },
      { texto: 'En cruz, 10x = 105 − 5x. Se juntan las x:', ecuacion: junto(['15x = 105', FL, 'x = ', dF('7 cm')]) }],
    respuesta: [junto('AN = '), dF('7 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Un tramo con x',
    enunciado: 'En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = x, MB = 6, AN = 4 y NC = 8, en centímetros. ¿Cuánto mide AB?',
    datos: [D_TRI],
    solucion: [{ texto: 'Thales en el triángulo:', ecuacion: junto([{ frac: ['x', dI('6')] }, ' = ', { frac: [dO('4'), dI('8')] }, FL, '8x = 24', FL, 'x = 3']) },
      { texto: 'AB es la suma de sus dos tramos:', ecuacion: junto(['AB = 3 + 6 = ', dF('9 cm')]) }],
    respuesta: [junto('AB = '), dF('9 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Una paralela en el trapecio',
    enunciado: 'En el trapecio ABCD, las bases son AD y BC. Una paralela a las bases corta AB en M y CD en N. AM = 6 cm, MB = 4 cm y DN = 9 cm. ¿Cuánto mide NC?',
    datos: [D_THALES, 'Las dos bases de un trapecio son paralelas.'],
    solucion: [{ texto: 'AD, MN y BC son tres paralelas que cortan los lados AB y DC. En el mismo orden, de la base AD hacia BC:', ecuacion: junto([{ frac: [dO('AM'), dI('MB')] }, ' = ', { frac: [dO('DN'), dI('NC')] }]) },
      { texto: 'Con los números:', ecuacion: junto([{ frac: [dO('6'), dI('4')] }, ' = ', { frac: [dO('9'), 'NC'] }, FL, 'NC = 4 · 9 ÷ 6 = ', dF('6 cm')]) }],
    respuesta: [junto('NC = '), dF('6 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Cuatro paralelas',
    enunciado: 'Cuatro rectas paralelas cortan a dos secantes. En la primera quedan tres tramos: 4 cm, 6 cm y 10 cm. En la segunda, los tres tramos juntos miden 30 cm. ¿Cuánto mide el tramo del medio de la segunda?',
    datos: [D_THALES, 'Con más paralelas vale igual: todos los tramos se multiplican por el mismo número.'],
    solucion: [{ texto: 'En la primera, los tres tramos suman 4 + 6 + 10 = 20 cm. En la segunda suman 30 cm:', ecuacion: junto(['30 ÷ 20 = 1,5']) },
      { texto: 'Cada tramo de la segunda es 1,5 veces el suyo:', ecuacion: junto(['1,5 · ', dI('6 cm'), ' = ', dF('9 cm')]) }],
    respuesta: [dF('9 cm')] });

  // Nivel 3 (examen): cinco alternativas; la correcta va en distintas letras (C, A, E, B, D) y cada incorrecta se explica
  // por su valor (hay puntos A, B, C: nunca por su letra).
  EJ1.push({ nivel: 3, titulo: 'Pueblos entre carreteras',
    enunciado: 'Tres carreteras paralelas cortan dos caminos rectos: uno en los pueblos A, B y C (AB = 6 km, BC = 9 km), y otro en D, E y F (DF = 30 km). ¿Cuánto hay de D a E?',
    alternativas: ['20 km', '15 km', '12 km', '18 km', '9 km'],
    datos: [D_THALES, D_SUMA],
    fuente: 'Modelo de San Marcos 2023-I (pregunta 36), con otros números.',
    solucion: [{ texto: 'AB : BC = 6 : 9 = 2 : 3: DE y EF se reparten los 30 km en 2 + 3 = 5 partes de 6 km.' },
      { texto: 'DE toma dos partes:', ecuacion: junto(['DE = 2 · 6 km = ', dF('12 km')]) },
      { texto: '20 km sale de 6/9 = DE/30 (la parte con el todo); 18 km es EF; 15 km reparte por la mitad; 9 km copia BC.' }],
    respuesta: [junto('DE = '), dF('12 km')] });
  EJ1.push({ nivel: 3, titulo: 'Dos tramos con x',
    enunciado: 'En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = x − 1, MB = x + 1, AN = 4 y NC = 6, en centímetros. ¿Cuánto mide AB?',
    alternativas: ['10 cm', '5 cm', '4 cm', '6 cm', '12 cm'],
    datos: [D_TRI],
    solucion: [{ texto: 'Thales en el triángulo:', ecuacion: junto([{ frac: ['x − 1', 'x + 1'] }, ' = ', { frac: [dO('4'), dI('6')] }, FL, '6x − 6 = 4x + 4']) },
      { texto: 'Se despeja: 2x = 10, x = 5. Entonces AM = 4 cm y MB = 6 cm:', ecuacion: junto(['AB = 4 + 6 = ', dF('10 cm')]) },
      { texto: '5 cm es x; 4 cm y 6 cm son AM y MB solos; 12 cm suma x + 1 dos veces.' }],
    respuesta: [junto('AB = '), dF('10 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Dos paralelas seguidas',
    enunciado: 'En el triángulo ABC, BC = 15 cm, AP = 4 cm y PB = 6 cm (P en AB). La paralela a BC por P corta AC en Q; la paralela a AB por Q corta BC en R. ¿Cuánto mide RC?',
    alternativas: ['6 cm', '10 cm', '7,5 cm', '22,5 cm', '9 cm'],
    datos: [D_TRI],
    fuente: 'Modelo de San Marcos 2021 (pregunta 38), con otros números.',
    solucion: [{ texto: 'PQ ∥ BC parte AB y AC en la misma razón:', ecuacion: junto(['AQ : QC = AP : PB = 4 : 6']) },
      { texto: 'QR ∥ AB, en el triángulo CAB, parte CA y CB en la misma razón, contada desde C:', ecuacion: junto(['CR : RB = CQ : QA = 6 : 4']) },
      { texto: 'BC = 15 cm en 6 + 4 = 10 partes de 1,5 cm:', ecuacion: junto(['RC = 6 · 1,5 cm = ', dF('9 cm')]) },
      { texto: '6 cm es RB; 7,5 cm parte BC por la mitad; 10 cm sale de 15 · 4 ÷ 6, y 22,5 cm de 15 · 6 ÷ 4.' }],
    respuesta: [junto('RC = '), dF('9 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Un tramo que se describe',
    enunciado: 'Tres rectas paralelas cortan a dos secantes. En la primera, AB = 6 cm y BC = 10 cm. En la segunda, DE mide 3 cm más que AB. ¿Cuánto mide EF?',
    alternativas: ['13 cm', '15 cm', '9 cm', '24 cm', '5,4 cm'],
    datos: [D_THALES],
    solucion: [{ texto: 'DE = 6 cm + 3 cm = 9 cm. Thales:', ecuacion: junto([{ frac: [dO('6'), dI('10')] }, ' = ', { frac: [dO('9'), 'EF'] }]) },
      { texto: 'Se despeja:', ecuacion: junto(['EF = 10 · 9 ÷ 6 = ', dF('15 cm')]) },
      { texto: '13 cm suma 3 a BC, como si los tramos crecieran igual; 9 cm es DE; 24 cm, DF; 5,4 cm sale de 6/10 = EF/9.' }],
    respuesta: [junto('EF = '), dF('15 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Dónde poner N',
    enunciado: 'En el triángulo ABC, AB = 12 cm y AC = 18 cm. M está en AB con AM = 4 cm. ¿A qué distancia de A debe estar N, sobre AC, para que MN sea paralela a BC?',
    alternativas: ['8 cm', '9 cm', '12 cm', '6 cm', '2,67 cm'],
    datos: [D_RECIP, D_TRI],
    solucion: [{ texto: 'MB = 12 − 4 = 8 cm. Para que MN sea paralela, N parte AC en la misma razón: AN : NC = 4 : 8 = 1 : 2.' },
      { texto: 'AC = 18 cm en 1 + 2 = 3 partes de 6 cm:', ecuacion: junto(['AN = ', dF('6 cm')]) },
      { texto: '12 cm es NC; 9 cm es la mitad de AC; 8 cm copia MB; 2,67 cm sale de 4 · 12 ÷ 18 (AM con los lados cambiados).' }],
    respuesta: [junto('AN = '), dF('6 cm')] });

  // «Ahora tú» de la idea 1. Tipos: el tramo que falta con tres paralelas; la parte con el todo; la paralela en el
  // triángulo; la x en los tramos; el recíproco (¿es paralela?). Cada caso, con su figura sin escala cuando la lleva.
  // Auditoría (20 nov, lector A): el dibujo sin escala respeta el orden de las medidas (el tramo más largo se ve más largo),
  // pero no su razón: t, la fracción dibujada, va lejos de la de verdad. Antes se dibujaba al revés y confundía.
  const tOrden = (a, b) => { const real = a / (a + b), base = a > b ? [0.6, 0.65, 0.56, 0.7] : [0.4, 0.35, 0.44, 0.3]; const ts = base.filter(t => Math.abs(t - real) > 0.04); return ts.length ? ts : [a > b ? 0.75 : 0.25]; };
  function casoTres(r) {
    const a = r.ent(2, 12), b = r.ent(2, 12), k = r.de([1.5, 2, 2.5, 3, 0.5]), c = a * k, x = b * k;
    if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * x)) return null;
    return { pregunta: `Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = ${a} cm, BC = ${b} cm y DE = ${fm(c)} cm. ¿Cuánto mide EF?${NO_ESC}`,
      datos: [D_THALES],
      dibujo: figO(figTres(tOrden(a, b), { AB: `${a} cm`, BC: `${b} cm`, DE: `${fm(c)} cm`, EF: '?' }, { sinEscala: true })),
      opciones: ops(x, r.baraja([
        { id: 'invertida', valor: a * c / b, error: 'GE22', siFuera: `Usar la razón está bien; pero va AB con DE y BC con EF: ${a}/${b} = ${fm(c)}/EF.` },
        { id: 'diferencia', valor: c + (b - a), error: 'GE-THA1', siFuera: `Sumar la diferencia, ${b} − ${a}, sería si los tramos crecieran igual; crecen en la misma razón.` },
        { id: 'total', valor: c * (a + b) / a, error: 'GE-THA5', siFuera: `La razón está bien; ${fm(c * (a + b) / a)} cm es DF entero, no EF.` },
        { id: 'copia', valor: b, error: 'GE-THA2', siFuera: `${b} cm es BC; EF está en la otra secante y no tiene por qué medir igual.` }]), cm),
      solucion: { texto: 'Tramo con tramo, en el mismo orden:', ecuacion: junto([{ frac: [`${a}`, `${b}`] }, ' = ', { frac: [fm(c), 'EF'] }, FL, 'EF = ', dF(cm(x))]) } };
  }
  function casoTotal(r) {
    const p = r.ent(1, 5), q = r.ent(1, 6), m = r.ent(2, 5), a = p * m, b = q * m, u = r.ent(2, 9), T = (p + q) * u;
    if (p === q || mcd(p, q) !== 1) return null;
    const x = p * u;
    return { pregunta: `Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = ${a} m, BC = ${b} m y DF = ${T} m. ¿Cuánto mide DE?${NO_ESC}`,
      datos: [D_THALES, D_SUMA],
      dibujo: figO(figTres(tOrden(a, b), { AB: `${a} m`, BC: `${b} m`, DE: '?', DF: `${T} m` }, { sinEscala: true })),
      opciones: ops(x, r.baraja([
        { id: 'parte-todo', valor: T * a / b, error: 'GE22', siFuera: `Usar Thales está bien; pero ${a}/${b} es parte con parte, y ${T} es el todo: no se emparejan.` },
        { id: 'mitad', valor: T / 2, error: 'GE-THA4', siFuera: `Partir DF está bien; pero no por la mitad: en la razón ${razon(a, b)}.` },
        { id: 'otra', valor: q * u, error: 'GE-THA5', siFuera: `El reparto está bien: ${fm(q * u)} m es EF, la otra parte.` },
        { id: 'resta', valor: T - a - b, error: 'GE-THA1', siFuera: 'Restar no sirve: DE y EF se reparten DF en la misma razón que AB y BC.' }]), m_),
      solucion: { texto: `AB : BC = ${razon(a, b)}: DF se reparte en ${p + q} partes de ${u} m.`, ecuacion: junto([`DE = ${p} · ${u} m = `, dF(m_(x))]) } };
  }
  function casoTri(r) {
    const a = r.ent(2, 10), b = r.ent(2, 10), k = r.de([1.5, 2, 3, 0.5, 2.5]), c = a * k, x = b * k;
    if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * x)) return null;
    return { pregunta: `En el triángulo ABC, MN es paralela a BC, con M en AB y N en AC. AM = ${a} cm, MB = ${b} cm y AN = ${fm(c)} cm. ¿Cuánto mide NC?${NO_ESC}`,
      datos: [D_TRI],
      dibujo: figO(elQueCabe(...tOrden(a, b).map(t => () => figTri(t, { AM: `${a} cm`, MB: `${b} cm`, AN: `${fm(c)} cm`, NC: '?' }, { sinEscala: true })))),
      opciones: ops(x, r.baraja([
        { id: 'invertida', valor: a * c / b, error: 'GE22', siFuera: `Usar la razón está bien; pero va AM con AN y MB con NC: ${a}/${b} = ${fm(c)}/NC.` },
        { id: 'diferencia', valor: c + (b - a), error: 'GE-THA1', siFuera: 'Sumar la diferencia sería si los tramos crecieran igual; crecen en la misma razón.' },
        { id: 'lado', valor: c * (a + b) / a, error: 'GE-THA5', siFuera: `La razón está bien; ${fm(c * (a + b) / a)} cm es AC entero, no NC.` },
        { id: 'copia', valor: b, error: 'GE-THA2', siFuera: `${b} cm es MB; NC está en el otro lado.` }]), cm),
      solucion: { texto: 'Arriba con arriba, abajo con abajo:', ecuacion: junto([{ frac: [`${a}`, `${b}`] }, ' = ', { frac: [fm(c), 'NC'] }, FL, 'NC = ', dF(cm(x))]) } };
  }
  function casoX(r) {
    const m = r.ent(2, 9), n = r.ent(m + 1, 14), p = r.ent(1, 6), x = m * p / (n - m);
    if (!Number.isInteger(x) || x < 1 || x > 20) return null;
    const AB = 2 * x + p;
    return { pregunta: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = x, MB = x + ${p}, AN = ${m} y NC = ${n}, en centímetros. ¿Cuánto mide AB?`,
      datos: [D_TRI],
      opciones: ops(AB, r.baraja([
        { id: 'x', valor: x, error: 'GE-THA6', siFuera: `La ecuación está bien: x = ${x}. Falta AB = x + (x + ${p}).` },
        { id: 'mb', valor: x + p, error: 'GE-THA6', siFuera: `x = ${x} está bien; ${x + p} cm es solo MB.` },
        { id: 'ac', valor: m + n, error: 'GE-THA2', siFuera: `${m + n} cm es AC; AB es el otro lado.` },
        { id: 'sinp', valor: 2 * x, error: 'GE-THA6', siFuera: `x = ${x} está bien; pero MB es x + ${p}, no x.` }]), cm),
      solucion: { texto: `x/(x + ${p}) = ${m}/${n}, así que ${n}x = ${m}x + ${m * p} y x = ${x}.`, ecuacion: junto([`AB = ${x} + ${x + p} = `, dF(cm(AB))]) } };
  }
  function casoRecip(r) {
    const a = r.ent(2, 9), b = r.ent(2, 9), k = r.de([2, 3, 1.5]);
    if (a === b) return null;
    const si = r.ent(0, 1) === 1, c = a * k, d = si ? b * k : b * k + r.de([-2, -1, 1, 2]);
    if (!Number.isInteger(2 * c) || d <= 0 || (!si && Math.abs(c / d - a / b) < 1e-9)) return null;
    const ok = si ? `Sí: ${a}/${b} = ${fm(c)}/${fm(d)}` : `No: ${a}/${b} ≠ ${fm(c)}/${fm(d)}`;
    const opciones = [{ id: 'c', texto: ok, correcta: true }].concat(si
      ? [{ id: 'iguales', texto: 'No: los tramos no miden igual', error: 'GE-THA2', siFuera: 'No hace falta que midan igual: basta la misma razón.' },
        { id: 'faltan', texto: 'Faltan datos: se necesita BC', error: 'GE-THA7', siFuera: 'Las dos razones alcanzan: son el recíproco de Thales.' },
        { id: 'resta', texto: `No: ${b} − ${a} ≠ ${fm(d)} − ${fm(c)}`, error: 'GE-THA1', siFuera: 'Comparar restas no sirve: se comparan razones.' }]
      : [{ id: 'siempre', texto: 'Sí: M y N están en los lados', error: 'GE-THA3', siFuera: 'Estar en los lados no basta: la razón tiene que ser la misma.' },
        { id: 'faltan', texto: 'Faltan datos: se necesita BC', error: 'GE-THA7', siFuera: 'Las dos razones alcanzan: son el recíproco de Thales.' },
        { id: 'casi', texto: 'Sí: las razones casi coinciden', error: 'GE-THA3', siFuera: 'Casi no alcanza: la paralela pide razones iguales.' }]);
    return { pregunta: `En el triángulo ABC, M está en AB y N en AC. AM = ${a} cm, MB = ${b} cm, AN = ${fm(c)} cm y NC = ${fm(d)} cm. ¿Es MN paralela a BC?`,
      datos: [D_RECIP], opciones,
      solucion: { texto: `${a}/${b} ${si ? '=' : '≠'} ${fm(c)}/${fm(d)}:`, ecuacion: [dF(si ? 'sí es paralela' : 'no es paralela')] } };
  }
  // Así se resuelve (otras listas de casos: la parte con el todo en el triángulo, o los pueblos entre carreteras).
  function resuelveThales(s) {
    const r = azar2(s + 900);
    if (s % 2 === 0) {
      let p, q, u, m;
      do { p = r.ent(1, 4); q = r.ent(2, 6); u = r.ent(2, 6); m = r.ent(2, 4); } while (p === q || mcd(p, q) !== 1);
      const AM = p * m, AB = (p + q) * m, AC = (p + q) * u, AN = p * u;
      return {
        enunciado: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = ${AM} cm, AB = ${AB} cm y AC = ${AC} cm. ¿Cuánto mide AN?${NO_ESC}`,
        datos: [D_TRI, 'Un lado entero es la suma de sus partes: AB = AM + MB.'],
        dibujo: figO(elQueCabe(...tOrden(p, q).map(t => () => figTri(t, { AM: `${AM} cm`, AN: '?' }, { sinEscala: true, alt: `El triángulo ABC con MN paralela a BC; AM = ${AM} cm; AN lleva signo de pregunta.` })))),
        pasos: [
          { tipo: 'pide', texto: 'Piden AN, el tramo de arriba del lado AC.' },
          { tipo: 'datos', texto: `AM = ${AM} cm y AB = ${AB} cm, así que MB = ${AB} − ${AM} = ${AB - AM} cm. AC = ${AC} cm entero.` },
          { tipo: 'regla', texto: 'MN ∥ BC: los dos lados quedan partidos en la misma razón.', ecuacion: [{ frac: [dO('AM'), dI('MB')] }, ' = ', { frac: [dO('AN'), dI('NC')] }] },
          { tipo: 'cuentas', texto: `AM : MB = ${AM} : ${AB - AM} = ${p} : ${q}. AC se reparte en ${p + q} partes de ${u} cm.`, ecuacion: junto([`AN = ${p} · ${u} cm = `, dF(cm(AN))]) },
          { tipo: 'sentido', texto: `Comprobación: NC = ${AC} − ${AN} = ${AC - AN} cm, y ${AN} : ${AC - AN} = ${p} : ${q}, la misma razón que en AB.` },
        ],
        respuesta: [junto('AN = '), dF(cm(AN))],
      };
    }
    let p, q, u, m;
    do { p = r.ent(1, 5); q = r.ent(1, 5); u = r.ent(2, 8); m = r.ent(2, 4); } while (p === q || mcd(p, q) !== 1);
    const a = p * m, b = q * m, T = (p + q) * u;
    return {
      enunciado: `Tres carreteras paralelas cortan dos caminos rectos. En el primero, los pueblos A, B y C, con AB = ${a} km y BC = ${b} km. En el segundo, D, E y F, con DF = ${T} km. ¿Cuánto mide EF?`,
      datos: [D_THALES, D_SUMA],
      pasos: [
        { tipo: 'pide', texto: 'Piden EF: la distancia entre los pueblos del segundo camino que están en la segunda y la tercera carretera.' },
        { tipo: 'datos', texto: `En el primer camino, AB = ${a} km y BC = ${b} km. En el segundo solo se sabe el total, DF = ${T} km.` },
        { tipo: 'regla', texto: 'Thales: las carreteras paralelas cortan los dos caminos en la misma razón.', ecuacion: [{ frac: [dO('AB'), dI('BC')] }, ' = ', { frac: [dO('DE'), dI('EF')] }] },
        { tipo: 'cuentas', texto: `AB : BC = ${a} : ${b} = ${p} : ${q}. DF se reparte en ${p + q} partes de ${u} km; EF toma ${q}.`, ecuacion: junto([`EF = ${q} · ${u} km = `, dF(`${q * u} km`)]) },
        { tipo: 'sentido', texto: `Comprobación: DE = ${p * u} km y ${p * u} + ${q * u} = ${T}.` },
      ],
      respuesta: [junto('EF = '), dF(`${q * u} km`)],
    };
  }

  // Auditoría (20 nov): DF = 160 m. Con 120 m, DE salía de copiar el factor fijo del juego (DE = 1,5 · AB = 45 m) sin usar
  // el total; ahora ese atajo da 45 m, que no es la respuesta.
  const PRED1 = 'En otro barrio, la avenida 1 tiene AB = 30 m y BC = 50 m. En la avenida 2, del primer jirón al tercero hay DF = 160 m. ¿Cuánto mide DE?';
  // ======================= En el mundo (Gerson, 28 nov; docs/teoria.md, 4k) =======================
  // Un hecho real por idea, después de su regla, que esa regla explica, con una pregunta breve que se responde con ella.
  // No repite la apertura (la foto de 10 por 15 ampliada a 20 por 25) ni los contextos de los ejemplos y juegos (calles,
  // terreno, canal, poste y sombra, rampa y puntal, fotos, mayólicas). Las cuentas las hace el código (regla 1); los
  // datos van con su fuente. Ninguno trae la respuesta de una Predice ni de una misión (60 m, 4 y 6 m, 4 m, 2 cm, la
  // cuarta parte, 1 en Menelao; 75 m, D en el medio, 6 m, 3 m, 9 veces, F en el medio).
  const fd = (n, d) => Kit.formatear(n, d);
  const r1 = n => Math.round(n * 10) / 10;
  const txt = (x, y, t, o = '') => `<text x="${r1(x)}" y="${r1(y)}" ${o}>${t}</text>`;

  // Idea 1: el truco del carpintero. Tabla de 22 cm, 4 tiras: la wincha cruzada del 0 al 24 se marca cada 6 cm.
  const TABLA = { ancho: 22, tiras: 4, wincha: 24 };
  TABLA.paso = TABLA.wincha / TABLA.tiras; TABLA.tira = TABLA.ancho / TABLA.tiras;
  const TABLA2 = { ancho: 17, tiras: 3, wincha: 18 };
  TABLA2.paso = TABLA2.wincha / TABLA2.tiras; TABLA2.tira = TABLA2.ancho / TABLA2.tiras;
  const svgTabla = (() => {
    const s = 6, x0 = 30, y0 = 24, L = 250, H = TABLA.ancho * s, W = TABLA.wincha * s;
    const dx = Math.sqrt(W * W - H * H), ax = 92, bx = ax + dx;
    const marcas = [1, 2, 3].map(i => ({ x: ax + dx * i / TABLA.tiras, y: y0 + H * i / TABLA.tiras, n: TABLA.paso * i }));
    return `<svg viewBox="0 0 330 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">
      <rect x="${x0}" y="${y0}" width="${L}" height="${r1(H)}" fill="none" stroke="currentColor" stroke-width="2.5"/>
      ${marcas.map(m => `<line x1="${x0}" y1="${r1(m.y)}" x2="${x0 + L}" y2="${r1(m.y)}" style="stroke:var(--c-i)" stroke-width="1.8" stroke-dasharray="6 4"/>`).join('')}
      <line x1="${ax}" y1="${y0}" x2="${r1(bx)}" y2="${r1(y0 + H)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      ${marcas.map(m => `<circle cx="${r1(m.x)}" cy="${r1(m.y)}" r="4" fill="currentColor"/>${txt(m.x + 8, m.y - 4, m.n, 'style="fill:var(--c-o)" font-weight="700"')}`).join('')}
      ${txt(ax - 4, y0 - 6, '0', 'style="fill:var(--c-o)" font-weight="700" text-anchor="middle"')}${txt(bx + 4, y0 + H + 16, TABLA.wincha, 'style="fill:var(--c-o)" font-weight="700" text-anchor="middle"')}
      ${[0, 1, 2, 3].map(i => txt(x0 + L - 8, y0 + H * (i + 0.5) / TABLA.tiras + 5, `${fm(TABLA.tira)} cm`, 'style="fill:var(--c-i)" font-weight="700" text-anchor="end"')).join('')}
      ${txt(16, y0 + H / 2, `${TABLA.ancho} cm`, `text-anchor="middle" fill="currentColor" transform="rotate(-90 16 ${r1(y0 + H / 2)})"`)}
      ${txt(165, y0 + H + 34, 'La wincha, cruzada sobre la tabla', 'text-anchor="middle" style="fill:var(--muted)"')}
    </svg>`;
  })();
  const MUNDO1 = {
    hecho: 'Una wincha cruzada parte una tabla en tiras iguales',
    parrafos: [
      [`Un carpintero que tiene que partir una tabla de ${TABLA.ancho} cm de ancho en ${TABLA.tiras} tiras iguales no divide ${TABLA.ancho} entre ${TABLA.tiras}. `,
        `Cruza su wincha sobre la tabla, con el 0 en un borde y el ${TABLA.wincha} en el otro, y marca la tabla donde la wincha dice ${TABLA.paso}, ${2 * TABLA.paso} y ${3 * TABLA.paso}.`],
      ['Por cada marca traza una raya paralela a los bordes: son paralelas que cortan dos rectas, la wincha y el ancho de la tabla. Como los tramos de la wincha son iguales, los del ancho también lo son:',
        { linea: [`${TABLA.wincha} cm ÷ ${TABLA.tiras} = `, dO(`${TABLA.paso} cm`), '   en la wincha'] },
        { linea: [`${TABLA.ancho} cm ÷ ${TABLA.tiras} = `, dI(`${fm(TABLA.tira)} cm`), '   en el ancho de la tabla'] },
        `El carpintero nunca midió ${fm(TABLA.tira)} cm: con la wincha cruzada, cualquier ancho se parte leyendo números enteros.`],
    ],
    figura: { svg: svgTabla,
      alt: `Una tabla de ${TABLA.ancho} cm de ancho con una wincha cruzada del 0 al ${TABLA.wincha}. Las marcas ${TABLA.paso}, ${2 * TABLA.paso} y ${3 * TABLA.paso} de la wincha dejan rayas paralelas a los bordes, y las cuatro tiras miden ${fm(TABLA.tira)} cm.` },
    pregunta: {
      texto: `Con el mismo truco, una tabla de ${TABLA2.ancho} cm se parte en ${TABLA2.tiras} tiras: la wincha va del 0 al ${TABLA2.wincha} y se marca en el ${TABLA2.paso} y el ${2 * TABLA2.paso}. ¿Cuánto mide de ancho cada tira?`,
      opciones: [
        { id: 'c', texto: `Un tercio de ${TABLA2.ancho} cm: unos ${fm(TABLA2.tira)} cm`, correcta: true },
        { id: 'igual', texto: `${TABLA2.paso} cm, lo que hay de marca a marca en la wincha`, error: 'GE-THA-igual',
          siFuera: `Es cierto que las marcas parten la wincha en tramos de ${TABLA2.paso} cm. Pero la wincha va cruzada y es más larga que el ancho: sus tramos son proporcionales a los del ancho, no iguales.` },
        { id: 'diagonal', texto: 'La del medio sale más ancha, porque la wincha va inclinada', error: 'GE-THA-inclinada',
          siFuera: 'Es cierto que la wincha inclinada no mide el ancho. Pero las rayas son paralelas a los bordes, y paralelas que cortan una recta en tramos iguales también cortan la otra en tramos iguales.' },
        { id: 'angulo', texto: 'No se sabe sin medir el ángulo de la wincha', error: 'GE-THA-angulo',
          siFuera: 'Es cierto que con otro ángulo cambiaría el número que toca el borde. Pero la regla no pide el ángulo: basta que los tramos de la wincha sean iguales para que los del ancho también lo sean.' },
      ],
      porque: `Las rayas son paralelas y parten la wincha en ${TABLA2.tiras} tramos iguales, así que también parten el ancho en ${TABLA2.tiras} tramos iguales: cada tira mide ${TABLA2.ancho} cm ÷ ${TABLA2.tiras}, unos ${fm(TABLA2.tira)} cm.`,
    },
    fuente: 'Truco de la wincha cruzada para partir una tabla sin dividir: Fine Homebuilding, «Division without fractions» (2005).',
  };

  // Idea 2: el arquero se para en la bisectriz del ángulo de tiro. Arco de 7,32 m (IFAB, regla 1).
  const ARCO = 7.32;
  const arquero = (cerca, lejos) => ({ cerca, lejos, tc: ARCO * cerca / (cerca + lejos), tl: ARCO * lejos / (cerca + lejos) });
  const ARQ = arquero(10, 14), ARQ2 = arquero(12, 15);
  [ARQ2.pc, ARQ2.pl] = razon(ARQ2.cerca, ARQ2.lejos).split(' : ').map(Number);
  const svgArco = (() => {
    // Postes en x = ±3,66 m sobre la línea de gol; el balón donde está a 10 m de un poste y a 14 m del otro.
    const h = ARCO / 2, bx = (ARQ.lejos ** 2 - ARQ.cerca ** 2) / (4 * h), by = Math.sqrt(ARQ.cerca ** 2 - (bx - h) ** 2);
    const s = 21, X = x => 96 + x * s, Yp = y => 246 - y * s, dx = h - ARQ.tc;
    return `<svg viewBox="0 0 330 290" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">
      <line x1="10" y1="${Yp(0)}" x2="320" y2="${Yp(0)}" style="stroke:var(--muted)" stroke-width="1.5"/>
      <line x1="${r1(X(-h))}" y1="${Yp(0)}" x2="${r1(X(dx))}" y2="${Yp(0)}" style="stroke:var(--c-i)" stroke-width="5"/>
      <line x1="${r1(X(dx))}" y1="${Yp(0)}" x2="${r1(X(h))}" y2="${Yp(0)}" style="stroke:var(--c-o)" stroke-width="5"/>
      <line x1="${r1(X(bx))}" y1="${r1(Yp(by))}" x2="${r1(X(h))}" y2="${Yp(0)}" style="stroke:var(--c-o)" stroke-width="2.5"/>
      <line x1="${r1(X(bx))}" y1="${r1(Yp(by))}" x2="${r1(X(-h))}" y2="${Yp(0)}" style="stroke:var(--c-i)" stroke-width="2.5"/>
      <line x1="${r1(X(bx))}" y1="${r1(Yp(by))}" x2="${r1(X(dx))}" y2="${Yp(0)}" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/>
      <rect x="${r1(X(-h) - 4)}" y="${Yp(0) - 14}" width="8" height="14" fill="currentColor"/><rect x="${r1(X(h) - 4)}" y="${Yp(0) - 14}" width="8" height="14" fill="currentColor"/>
      <circle cx="${r1(X(bx))}" cy="${r1(Yp(by))}" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="${r1(X(dx))}" cy="${Yp(0)}" r="4" fill="currentColor"/>
      ${txt(X(bx), Yp(by) - 14, 'balón', 'text-anchor="middle" fill="currentColor"')}
      ${txt((X(bx) + X(h)) / 2 + 8, (Yp(by) + Yp(0)) / 2, `${ARQ.cerca} m`, 'style="fill:var(--c-o)" font-weight="700"')}
      ${txt((X(bx) + X(-h)) / 2 - 10, (Yp(by) + Yp(0)) / 2, `${ARQ.lejos} m`, 'style="fill:var(--c-i)" font-weight="700" text-anchor="end"')}
      ${txt((X(dx) + X(h)) / 2, Yp(0) + 20, `${fm(ARQ.tc)} m`, 'style="fill:var(--c-o)" font-weight="700" text-anchor="middle"')}
      ${txt((X(-h) + X(dx)) / 2, Yp(0) + 20, `${fm(ARQ.tl)} m`, 'style="fill:var(--c-i)" font-weight="700" text-anchor="middle"')}
      ${txt(165, Yp(0) + 38, 'La línea del arco, vista desde arriba', 'text-anchor="middle" style="fill:var(--muted)"')}
    </svg>`;
  })();
  const MUNDO2 = {
    hecho: 'El arquero no se para frente al centro del arco',
    parrafos: [
      'Cuando el balón llega por un costado, los entrenadores de arqueros enseñan a pararse sobre la bisectriz del ángulo que forman el balón y los dos postes. Así el arquero queda a la misma distancia de los dos tiros que van pegados a los postes, y no deja más espacio libre de un lado que del otro.',
      [`Esa bisectriz llega a la línea del arco, que mide ${fm(ARCO)} m de poste a poste, en un punto que no es el centro. Si el balón está a ${ARQ.cerca} m de un poste y a ${ARQ.lejos} m del otro, los tramos del arco van en la misma razón que esas distancias:`,
        { linea: [{ frac: [dO(`${fm(ARQ.tc)} m`), dI(`${fm(ARQ.tl)} m`)] }, ' = ', { frac: [dO(`${ARQ.cerca} m`), dI(`${ARQ.lejos} m`)] }] }],
      `Por eso la línea del arquero llega a ${fm(ARQ.tc)} m del poste cercano, ${fm(Math.round((ARCO / 2 - ARQ.tc) * 100))} cm más cerca de él que el centro del arco, y el arquero se corre hacia ese poste.`,
    ],
    figura: { svg: svgArco,
      alt: `El arco visto desde arriba y un balón a ${ARQ.cerca} m de un poste y a ${ARQ.lejos} m del otro. La bisectriz del ángulo de tiro llega a la línea del arco a ${fm(ARQ.tc)} m del poste cercano y a ${fm(ARQ.tl)} m del lejano.` },
    pregunta: {
      texto: `Ahora el balón está a ${ARQ2.cerca} m de un poste y a ${ARQ2.lejos} m del otro. ¿Dónde llega la bisectriz del ángulo de tiro a la línea del arco?`,
      opciones: [
        { id: 'c', texto: `A unos ${fm(ARQ2.tc)} m del poste más cercano al balón`, correcta: true },
        { id: 'centro', texto: `Al centro, a ${fm(ARCO / 2)} m de cada poste`, error: 'GE8',
          siFuera: 'Es cierto que la bisectriz parte el ángulo de tiro en dos ángulos iguales. Pero el arco no queda partido en dos mitades, porque el balón no está a la misma distancia de los dos postes.' },
        { id: 'invertida', texto: `A unos ${fm(ARQ2.tc)} m del poste más lejano`, error: 'GE-PIE1',
          siFuera: `Es cierto que el arco queda en tramos de unos ${fm(ARQ2.tc)} m y ${fm(ARQ2.tl)} m. Pero el corto está del lado del poste cercano: cada tramo va con la distancia del balón al poste que toca.` },
        { id: 'resta', texto: `A ${ARQ2.lejos - ARQ2.cerca} m del poste cercano, porque ${ARQ2.lejos} − ${ARQ2.cerca} = ${ARQ2.lejos - ARQ2.cerca}`, error: 'GE-PIE2',
          siFuera: `Ver que el punto se corre hacia el poste cercano está bien. Pero la diferencia de las distancias no da un tramo: los tramos van en razón ${razon(ARQ2.cerca, ARQ2.lejos)}.` },
      ],
      porque: `Cada tramo va con la distancia al poste que toca, así que el arco se parte en razón ${ARQ2.cerca} : ${ARQ2.lejos} = ${razon(ARQ2.cerca, ARQ2.lejos)}. El tramo cercano toma ${ARQ2.pc} de las ${ARQ2.pc + ARQ2.pl} partes iguales de los ${fm(ARCO)} m: unos ${fm(ARQ2.tc)} m.`,
    },
    fuente: 'Arco de 7,32 m: IFAB, Reglas de Juego, regla 1. El arquero sobre la bisectriz del ángulo de tiro: guías de entrenamiento de arqueros.',
  };

  // Idea 3: el eclipse total. Diámetros y distancias medias: NASA (NSSDCA, fichas del Sol y de la Luna).
  const SOL = { d: 1391400, D: 149600000 }, LUNA = { d: 3475, D: 384400 }, MONEDA = 2.55;
  const justo = LUNA.d * SOL.D / SOL.d;                      // a esta distancia la Luna tapa justo al Sol
  const kLuna = LUNA.D / LUNA.d, aMoneda = MONEDA * kLuna;   // la moneda que tapa la Luna llena, en cm
  const svgEclipse = `<svg viewBox="0 0 330 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">
      <path d="M20 100 L300 30 L300 170 Z" style="fill:var(--c-i)" fill-opacity=".1"/>
      <line x1="20" y1="100" x2="300" y2="30" style="stroke:var(--c-i)" stroke-width="2"/><line x1="20" y1="100" x2="300" y2="170" style="stroke:var(--c-i)" stroke-width="2"/>
      <line x1="300" y1="30" x2="300" y2="170" style="stroke:var(--c-i)" stroke-width="4"/>
      <line x1="110" y1="77.5" x2="110" y2="122.5" style="stroke:var(--c-o)" stroke-width="5"/>
      <circle cx="110" cy="100" r="22.5" fill="none" style="stroke:var(--c-o)" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="20" cy="100" r="6" fill="currentColor"/>
      ${txt(20, 126, 'ojo', 'text-anchor="middle" fill="currentColor"')}${txt(110, 70, 'Luna', 'text-anchor="middle" style="fill:var(--c-o)" font-weight="700"')}
      ${txt(292, 100, 'Sol', 'text-anchor="end" style="fill:var(--c-i)" font-weight="700"')}
      ${txt(165, 194, 'No está a escala.', 'text-anchor="middle" style="fill:var(--muted)"')}
    </svg>`;
  const MUNDO3 = {
    hecho: 'La Luna tapa justo al Sol en un eclipse total',
    parrafos: [
      `El Sol mide unos ${fm(SOL.d)} km de ancho y la Luna, unos ${LUNA.d} km, así que el Sol es unas ${fd(SOL.d / LUNA.d, 0)} veces más ancho. También está unas ${fd(SOL.D / LUNA.D, 0)} veces más lejos de nosotros, y por eso en el cielo los dos se ven casi del mismo tamaño.`,
      ['Cada astro forma un triángulo con un vértice en tu ojo y su diámetro como el lado de enfrente. Cuando la Luna tapa justo al Sol, los dos triángulos comparten el ángulo del ojo y tienen sus diámetros paralelos, así que son semejantes:',
        { linea: [{ frac: [dO('diámetro de la Luna'), dO('diámetro del Sol')] }, ' = ', { frac: [dI('distancia de la Luna'), dI('distancia del Sol')] }] }],
      `Con los datos del Sol y de la Luna, esa igualdad pide que la Luna esté a unos ${fm(Math.round(justo / 100) * 100)} km. Su distancia cambia entre unos 363 300 km y 405 500 km: más cerca, se ve más grande que el Sol y el eclipse es total; más lejos, queda un anillo de Sol alrededor de la Luna.`,
    ],
    figura: { svg: svgEclipse, alt: 'Dos triángulos con el vértice en el ojo: uno llega a la Luna, cerca y chica, y otro al Sol, lejos y grande. Los diámetros son paralelos y la Luna cubre justo el ángulo del Sol.' },
    pregunta: {
      texto: `Una moneda de un sol mide ${fm(MONEDA)} cm de ancho. ¿A qué distancia de tu ojo tapa justo la Luna llena, cuando está a ${fm(LUNA.D)} km?`,
      opciones: [
        { id: 'c', texto: `A unos ${fd(aMoneda / 100, 1)} m`, correcta: true },
        { id: 'brazo', texto: 'Con el brazo estirado, a unos 60 cm', error: 'luna-grande',
          siFuera: `Es cierto que la Luna llena parece grande en el cielo. Pero el triángulo de la moneda tiene que copiar el de la Luna, y su distancia es unas ${fd(kLuna, 0)} veces su ancho.` },
        { id: 'invertida', texto: `A unos ${fd(MONEDA / kLuna * 10, 1)} mm, casi pegada al ojo`, error: 'k-al-reves',
          siFuera: `Usar la razón de la Luna está bien. Pero se aplicó al revés: la distancia es unas ${fd(kLuna, 0)} veces el ancho, así que se multiplica ${fm(MONEDA)} cm por ${fd(kLuna, 0)}, no se divide.` },
      ],
      porque: `Los dos triángulos tienen que ser semejantes: la distancia de la moneda es ${fd(kLuna, 1)} veces su ancho, como la de la Luna. ${fm(MONEDA)} cm × ${fd(kLuna, 1)} son unos ${fd(aMoneda / 100, 1)} m.`,
    },
    fuente: 'Diámetros y distancias del Sol y de la Luna: NASA, fichas de datos (NSSDCA). Moneda de S/ 1 de 25,50 mm: BCRP, cono monetario.',
  };

  // Idea 4: la cámara oscura (cámara estenopeica). Triángulos cruzados en el agujero: la imagen sale de cabeza.
  const CAM = { alto: 4, dist: 10, fondo: 0.3 }, CAM2 = { alto: 1.6, dist: 4, fondo: 0.25 };
  CAM.img = CAM.alto * CAM.fondo / CAM.dist; CAM2.img = CAM2.alto * CAM2.fondo / CAM2.dist; CAM2.mal = CAM2.dist * CAM2.fondo / CAM2.alto;
  const svgCamara = (() => {
    // Dibujo sin escala, la caja vista de costado: el árbol a la izquierda, el agujero a la altura de su pie y, al fondo
    // de la caja, la imagen de cabeza. La línea de la punta pasa por el agujero (la imagen sale de la misma recta).
    const yb = 140, ar = 40, ap = 50, hx = 220, fx = 300, iy = yb + (yb - ap) * (fx - hx) / (hx - ar);
    return `<svg viewBox="0 0 330 230" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">
      <rect x="${hx}" y="${yb - 50}" width="${fx - hx}" height="${r1(iy - yb + 60)}" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${ar}" cy="${ap + 10}" r="18" style="fill:var(--c-o)" fill-opacity=".25"/>
      <line x1="${ar}" y1="${yb}" x2="${ar}" y2="${ap}" style="stroke:var(--c-o)" stroke-width="5"/>
      <line x1="${ar}" y1="${ap}" x2="${fx}" y2="${r1(iy)}" style="stroke:var(--c-o)" stroke-width="1.8"/>
      <line x1="${ar}" y1="${yb}" x2="${fx}" y2="${yb}" style="stroke:var(--c-i)" stroke-width="1.8" stroke-dasharray="5 4"/>
      <line x1="${fx}" y1="${yb}" x2="${fx}" y2="${r1(iy)}" style="stroke:var(--c-o)" stroke-width="5"/>
      <circle cx="${fx}" cy="${r1(iy - 10 * (fx - hx) / (hx - ar))}" r="${r1(18 * (fx - hx) / (hx - ar))}" style="fill:var(--c-o)" fill-opacity=".25"/>
      <circle cx="${hx}" cy="${yb}" r="3.5" fill="currentColor"/>
      ${txt(ar, yb + 20, 'árbol', 'text-anchor="middle" style="fill:var(--c-o)" font-weight="700"')}
      ${txt((ar + hx) / 2, yb - 8, 'distancia al árbol', 'text-anchor="middle" style="fill:var(--c-i)" font-weight="700"')}
      ${txt(hx, yb - 58, 'agujero', 'text-anchor="middle" fill="currentColor"')}
      ${txt((hx + fx) / 2, yb - 8, 'fondo', 'text-anchor="middle" style="fill:var(--c-i)" font-weight="700"')}
      ${txt(fx, iy + 28, 'imagen', 'text-anchor="middle" style="fill:var(--c-o)" font-weight="700"')}
      ${txt(165, 224, 'La caja vista de costado. No está a escala.', 'text-anchor="middle" style="fill:var(--muted)"')}
    </svg>`;
  })();
  const MUNDO4 = {
    hecho: 'En una cámara oscura, la imagen sale de cabeza',
    parrafos: [
      'Si haces un agujerito en una caja cerrada y pones papel de calco en la cara de enfrente, en el papel aparece lo que hay afuera, pero de cabeza. Es la cámara oscura, la cámara de fotos más simple, y en el fondo de tu ojo la imagen también se forma de cabeza.',
      ['La luz va en línea recta y se cruza en el agujero, así que un árbol y su imagen forman dos triángulos cruzados. Con el agujero a la altura del pie del árbol, los dos tienen un ángulo recto y sus ángulos del agujero son opuestos por el vértice, así que son semejantes:',
        { linea: [{ frac: [dO('imagen'), dO('árbol')] }, ' = ', { frac: [dI('fondo de la caja'), dI('distancia al árbol')] }] }],
      `La punta del árbol, arriba, va con la punta de la imagen, que queda abajo, y por eso la imagen sale de cabeza. Un árbol de ${m_(CAM.alto)}, a ${m_(CAM.dist)} de una caja de ${cm(CAM.fondo * 100)} de fondo, deja una imagen de ${cm(CAM.img * 100)}.`,
    ],
    figura: { svg: svgCamara, alt: 'Una caja con un agujero, vista de costado. Las líneas de luz que salen de la punta y del pie de un árbol se cruzan en el agujero, y al fondo de la caja la imagen del árbol queda de cabeza.' },
    pregunta: {
      texto: `Un compañero de ${m_(CAM2.alto)} se para a ${m_(CAM2.dist)} de una cámara oscura de ${cm(CAM2.fondo * 100)} de fondo. ¿Cómo sale su imagen en el papel?`,
      opciones: [
        { id: 'c', texto: `De ${cm(CAM2.img * 100)} y de cabeza`, correcta: true },
        { id: 'derecha', texto: `De ${cm(CAM2.img * 100)} y derecha`, error: 'GE-HOM-lugar',
          siFuera: `Es cierto que la imagen mide ${cm(CAM2.img * 100)}. Pero los triángulos están cruzados: la cabeza del compañero va con la punta de la imagen, que queda en el lado de abajo del papel.` },
        { id: 'pareja', texto: `De ${cm(CAM2.mal * 100)} y de cabeza`, error: 'GE22',
          siFuera: `Usar una razón está bien. Pero las parejas se cruzaron: la altura del compañero va con la de su imagen, y los ${m_(CAM2.dist)} van con el fondo de la caja.` },
      ],
      porque: `Los triángulos son semejantes con k = ${cm(CAM2.fondo * 100)} ÷ ${m_(CAM2.dist)} = 1/${CAM2.dist / CAM2.fondo}: la imagen mide ${m_(CAM2.alto)} ÷ ${CAM2.dist / CAM2.fondo} = ${cm(CAM2.img * 100)}, y sale de cabeza porque los triángulos se cruzan en el agujero.`,
    },
    fuente: 'Cámara oscura: Britannica, «camera obscura». Tamaño de la imagen en la cámara estenopeica: guías de física de la Universidad de Iowa.',
  };

  // Idea 5: la fotocopiadora amplía de A4 a A3 con 141 % (ISO 216; manuales de copiadoras).
  const A4 = { a: 21, b: 29.7 }, A3 = { a: 29.7, b: 42 };
  const kA = Math.sqrt(2);
  const svgHojas = (() => {
    const s = 4.2, x3 = 140, y0 = 14, x4 = 18;
    return `<svg viewBox="0 0 330 210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">
      <rect x="${x4}" y="${r1(y0 + (A3.a - A4.b) * s)}" width="${r1(A4.a * s)}" height="${r1(A4.b * s)}" fill="none" style="stroke:var(--c-o)" stroke-width="3"/>
      <rect x="${x3}" y="${y0}" width="${r1(A3.b * s)}" height="${r1(A3.a * s)}" fill="none" style="stroke:var(--c-i)" stroke-width="3"/>
      <line x1="${r1(x3 + A3.b * s / 2)}" y1="${y0}" x2="${r1(x3 + A3.b * s / 2)}" y2="${r1(y0 + A3.a * s)}" style="stroke:var(--c-o)" stroke-width="1.8" stroke-dasharray="6 4"/>
      ${txt(x4 + A4.a * s / 2, y0 + (A3.a - A4.b) * s + A4.b * s / 2 + 5, 'A4', 'text-anchor="middle" style="fill:var(--c-o)" font-weight="800" font-size="18"')}
      ${txt(x3 + A3.b * s / 4, y0 + A3.a * s / 2 + 6, 'A3', 'text-anchor="middle" style="fill:var(--c-i)" font-weight="800" font-size="18"')}
      ${txt(x4 + A4.a * s / 2, y0 + A3.a * s + 18, '21 por 29,7 cm', 'text-anchor="middle" style="fill:var(--c-o)"')}
      ${txt(x3 + A3.b * s / 2, y0 + A3.a * s + 18, '29,7 por 42 cm', 'text-anchor="middle" style="fill:var(--c-i)"')}
      ${txt(165, 200, 'En la A3 caben dos A4, una al lado de la otra.', 'text-anchor="middle" style="fill:var(--muted)"')}
    </svg>`;
  })();
  const MUNDO5 = {
    hecho: 'La fotocopiadora amplía de A4 a A3 con 141 %',
    parrafos: [
      `La hoja A4, la de la impresora, mide ${fm(A4.a)} cm por ${fm(A4.b)} cm, y la A3, que se usa para planos y afiches, mide ${fm(A3.a)} cm por ${fm(A3.b)} cm. En una A3 caben dos hojas A4, una al lado de la otra, y las dos hojas tienen la misma forma: son semejantes.`,
      ['Para pasar un afiche de A4 a A3, la fotocopiadora no marca 200 %, sino 141 %. El área se duplica, y como crece con k², cada lado se multiplica por el número que, al cuadrado, da 2:',
        { linea: [`k² = 2   →   k ≈ ${fd(kA, 2)}`] },
        { linea: [dO(`${fm(A4.a)} cm`), ` × ${fd(kA, 2)} ≈ `, dI(`${fd(A4.a * kA, 1)} cm`)] },
        'Con 200 %, cada lado se duplicaría y la copia ya no cabría en la hoja A3.'],
    ],
    figura: { svg: svgHojas, alt: 'Una hoja A4 de 21 por 29,7 cm y una hoja A3 de 29,7 por 42 cm, con la misma forma. En la A3 caben dos A4, una al lado de la otra.' },
    pregunta: {
      texto: 'Para reducir un afiche de A3 a A4, ¿qué porcentaje tiene que marcar la fotocopiadora?',
      opciones: [
        { id: 'c', texto: `${fd(100 / kA, 0)} %`, correcta: true },
        { id: 'mitad', texto: '50 %, porque la A4 es la mitad de la A3', error: 'GE1',
          siFuera: `Es cierto que la A4 tiene la mitad del área de la A3. Pero el porcentaje achica cada lado, a lo largo y a lo ancho: con 50 %, la copia saldría de ${fm(A3.a / 2)} cm por ${fm(A3.b / 2)} cm.` },
        { id: 'resta', texto: `${100 - 41} %, porque se le quita el 41 % que se sumó`, error: 'GE-ARE-resta',
          siFuera: `Es cierto que reducir deshace lo que hizo el 141 %. Pero deshacer una multiplicación es dividir: 100 % ÷ ${fd(kA, 2)} da unos ${fd(100 / kA, 0)} %, no se resta el 41 %.` },
      ],
      porque: `El área tiene que quedar en la mitad, así que k² = 1/2: cada lado se multiplica por unos ${fd(1 / kA, 2)}, que es 1 ÷ ${fd(kA, 2)}, y la máquina lo marca como ${fd(100 / kA, 0)} %.`,
    },
    fuente: 'Tamaños A4 y A3: norma ISO 216. Zoom de 141 % de A4 a A3 y de 71 % de A3 a A4: manuales de fotocopiadoras Canon.',
  };

  // Idea 6: un triángulo con monedas en las esquinas se equilibra en un solo punto (ley de la palanca y Ceva).
  const MON = { A: 1, B: 2, C: 3 }, MON2 = { A: 6, B: 1, C: 2 };
  const svgMonedas = (() => {
    const A = [40, 172], B = [290, 172], C = [120, 42], m = MON, M = m.A + m.B + m.C;
    const en = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
    const F = en(A, B, m.B / (m.A + m.B)), D = en(B, C, m.C / (m.B + m.C)), E = en(C, A, m.A / (m.C + m.A));
    const G = [(m.A * A[0] + m.B * B[0] + m.C * C[0]) / M, (m.A * A[1] + m.B * B[1] + m.C * C[1]) / M];
    const pila = (P, n, dx, dy) => Array.from({ length: n }, (_, i) => `<ellipse cx="${r1(P[0] + dx)}" cy="${r1(P[1] + dy - i * 5)}" rx="11" ry="4" fill="currentColor" fill-opacity=".55" stroke="currentColor"/>`).join('');
    const ln = (P, Q, c) => `<line x1="${r1(P[0])}" y1="${r1(P[1])}" x2="${r1(Q[0])}" y2="${r1(Q[1])}" style="stroke:var(${c})" stroke-width="2" stroke-dasharray="6 4"/>`;
    return `<svg viewBox="0 0 330 236" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14">
      <path d="M${A.join(' ')} L${B.join(' ')} L${C.join(' ')} Z" fill="none" stroke="currentColor" stroke-width="2.5"/>
      ${ln(C, F, '--c-o')}${ln(A, D, '--c-o')}${ln(B, E, '--c-o')}
      ${[F, D, E].map(P => `<circle cx="${r1(P[0])}" cy="${r1(P[1])}" r="3.5" fill="currentColor"/>`).join('')}
      <circle cx="${r1(G[0])}" cy="${r1(G[1])}" r="6" style="fill:var(--c-i)"/>
      ${pila(A, m.A, -20, 2)}${pila(B, m.B, 20, 2)}${pila(C, m.C, 0, -10)}
      ${txt(A[0], A[1] + 24, 'A', 'text-anchor="middle" font-weight="800" fill="currentColor"')}${txt(B[0], B[1] + 24, 'B', 'text-anchor="middle" font-weight="800" fill="currentColor"')}${txt(C[0] - 26, C[1] + 4, 'C', 'font-weight="800" fill="currentColor"')}
      ${txt(F[0], F[1] + 18, 'F', 'text-anchor="middle" fill="currentColor"')}${txt(D[0] + 8, D[1], 'D', 'fill="currentColor"')}${txt(E[0] - 10, E[1], 'E', 'text-anchor="end" fill="currentColor"')}
      
      ${txt(165, 210, `${m.A} moneda en A, ${m.B} en B y ${m.C} en C`, 'text-anchor="middle" style="fill:var(--muted)"')}${txt(165, 228, 'El punto de equilibrio va en turquesa.', 'text-anchor="middle" style="fill:var(--c-i)" font-weight="700"')}
    </svg>`;
  })();
  const MUNDO6 = {
    hecho: 'Un triángulo con monedas se equilibra en un solo punto',
    parrafos: [
      'Pon una moneda de un sol en un extremo de una regla liviana y dos monedas en el otro: la regla se equilibra sobre un lápiz en un punto más cerca de las dos monedas. Es la ley de la palanca, que ya escribió Arquímedes, y dice que los dos tramos de la regla van al revés que los pesos.',
      `Ahora pon ${MON.A} moneda en la esquina A de un triángulo de cartulina, ${MON.B} en B y ${MON.C} en C. El triángulo se equilibra sobre el filo de una regla puesta en la línea que va de una esquina al punto de equilibrio del lado de enfrente.`,
      ['Esas tres líneas pasan por un mismo punto, porque dando la vuelta el producto de las razones vale 1:',
        { linea: [{ frac: [dO('AF'), dI('FB')] }, ' · ', { frac: [dO('BD'), dI('DC')] }, ' · ', { frac: [dO('CE'), dI('EA')] }, ' = ',
          { frac: [dO(`${MON.B}`), dI(`${MON.A}`)] }, ' · ', { frac: [dO(`${MON.C}`), dI(`${MON.B}`)] }, ' · ', { frac: [dO(`${MON.A}`), dI(`${MON.C}`)] }, ' = 1'] },
        'Sobre ese punto, y solo sobre ese, el triángulo queda quieto en la punta de un lápiz, si la cartulina pesa poco al lado de las monedas.'],
    ],
    figura: { svg: svgMonedas, alt: `Un triángulo ABC con ${MON.A} moneda en A, ${MON.B} en B y ${MON.C} en C. Las tres líneas que van de cada esquina al punto de equilibrio del lado de enfrente se cruzan en un solo punto.` },
    pregunta: {
      texto: `Con ${MON2.A} monedas en A, ${MON2.B} en B y ${MON2.C} en C, las líneas de A y de B dan BD/DC = ${MON2.C / MON2.B} y CE/EA = ${MON2.A / MON2.C}. ¿Cuánto vale AF/FB?`,
      opciones: [
        { id: 'c', texto: `1/${MON2.A}: F queda más cerca de A`, correcta: true },
        { id: 'producto', texto: `${MON2.A}, porque ${MON2.C / MON2.B} · ${MON2.A / MON2.C} = ${MON2.A}`, error: 'GE-CEV-producto',
          siFuera: `Multiplicar las dos razones está bien. Pero el producto de las tres tiene que valer 1, así que la tercera es la que, multiplicada por ${MON2.A}, da 1.` },
        { id: 'suma', texto: `${MON2.C / MON2.B + MON2.A / MON2.C}, porque ${MON2.C / MON2.B} + ${MON2.A / MON2.C} = ${MON2.C / MON2.B + MON2.A / MON2.C}`, error: 'GE-CEV-suma',
          siFuera: 'Juntar las dos razones que se conocen está bien. Pero Ceva las multiplica, no las suma: el producto de las tres razones, dando la vuelta, vale 1.' },
      ],
      porque: `Dando la vuelta, AF/FB · ${MON2.C / MON2.B} · ${MON2.A / MON2.C} = 1, así que AF/FB = 1/${MON2.A}. Con ${MON2.A} monedas en A, el punto de equilibrio del lado AB queda cerca de esa esquina pesada.`,
    },
    fuente: 'Ley de la palanca: Arquímedes, «Sobre el equilibrio de los planos». Equilibrio de pesos en un triángulo: geometría de masas.',
  };

  const ideaThales = {
    id: 'thales',
    titulo: 'Paralelas que cortan dos rectas',
    pregunta: '¿Cómo se reparten las cuadras entre calles paralelas?',
    temas: ['Teorema de Thales'],
    pieza: GO,
    aprendizaje: 'Paralelas que cortan dos rectas las parten en tramos proporcionales; en un triángulo, una paralela a un lado parte los otros dos igual.',
    actividad: 'Correr un jirón entre dos paralelas y comparar las cuadras de dos avenidas.',
    // Lee: jirón, avenida, cuadra y razón entre tramos. No dice cómo se reparte un total (la predicción) ni el triángulo (la regla).
    lee: {
      tarjetas: [
        { titulo: 'El plano del barrio', texto: 'Este es el plano de un barrio visto desde arriba. Los tres jirones son paralelos, y sus flechitas lo marcan: van siempre a la misma distancia. Las dos avenidas los cruzan. En cada avenida, el tramo entre dos jirones es una cuadra.',
          pieza: GO, dibujo: figO(figCalles(0.4, { alt: 'El plano del barrio: tres jirones paralelos y dos avenidas que los cruzan.' })) },
        { titulo: 'Razón entre dos tramos', texto: 'Comparar dos tramos dividiendo es su razón. AB : BC = 40 : 60 se lee «40 a 60». Si los dos se dividen entre 20, queda 2 : 3: la misma razón, más corta.',
          ecuacion: junto([dO('AB'), ' : ', dI('BC'), ' = 40 : 60 = 2 : 3']) },
        { titulo: 'Qué mirar al jugar', texto: 'Corre el jirón del medio. Mira la razón de las cuadras de la avenida 1 y la de la avenida 2, cada vez.' },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'Tres jirones paralelos cortan dos avenidas. Del primer jirón al tercero hay 100 m por la avenida 1 y 150 m por la 2.',
      mision: { texto: 'Corre el jirón del medio hasta que la cuadra DE mida 75 m.', logrado: v => v.ab === 50,
        bien: 'Listo: AB = BC = 50 m y DE = EF = 75 m: razón 1 : 1.' },
      voz: 'Compara las dos razones cada vez que corras el jirón.',
      leyenda: [
        { s: 'A, B, C', t: 'las esquinas de la avenida 1' },
        { s: 'D, E, F', t: 'las esquinas de la avenida 2' },
        { s: dO('AB, DE'), t: 'las primeras cuadras de cada avenida' },
        { s: dI('BC, EF'), t: 'las segundas cuadras' },
      ],
      controles: [{ id: 'ab', etiqueta: 'AB, la primera cuadra', min: 30, max: 70, paso: 10, inicio: 40, unidad: 'm', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: figCalles(v.ab / 100, { rot: { AB: `${v.ab} m`, BC: `${100 - v.ab} m`, DE: `${1.5 * v.ab} m`, EF: `${1.5 * (100 - v.ab)} m` } }), estado: {} }),
      // La relación entera: las dos razones, con sus números y reducidas (la misma).
      lectura: v => [junto([dO('AB'), ' : ', dI('BC'), ` = ${v.ab} : ${100 - v.ab} = ${razon(v.ab, 100 - v.ab)} = `, dO('DE'), ' : ', dI('EF')])],
      minimo: 3,
    },
    predice: {
      pregunta: `${PRED1}${NO_ESC}`,
      datos: ['AB = 30 m, BC = 50 m y DF = 160 m.', 'Los tres jirones son paralelos.'],
      voz: 'Ahora no sabes las dos cuadras de la avenida 2: solo su total.',
      opciones: [
        { id: 'c', texto: '60 m', correcta: true },
        { id: 'parte-todo', texto: '96 m', error: 'GE22', siFuera: 'Usar 30/50 está bien; pero 160 m es el todo, no la otra cuadra: no va con 50.' },
        { id: 'mitad', texto: '80 m', error: 'GE-THA4', siFuera: 'Repartir los 160 m está bien; pero no por la mitad: AB y BC no miden igual.' },
        { id: 'otra', texto: '100 m', error: 'GE-THA5', siFuera: 'El reparto está bien: 100 m es EF, la cuadra de abajo. DE es la de arriba.' },
      ],
      dibujo: figO(figCalles(0.33, { rot: { AB: '30 m', BC: '50 m', DE: '?', DF: '160 m' }, sinEscala: true, alt: 'Otro barrio: en la avenida 1, AB = 30 m y BC = 50 m; en la avenida 2, DF = 160 m y DE lleva signo de pregunta.' })),
      revelar: figO(figCalles(0.33, { rot: { AB: '30 m', BC: '50 m', DE: '60 m', EF: '100 m' }, sinEscala: true, alt: 'El mismo barrio: DE = 60 m y EF = 100 m, en razón 3 : 5 como AB y BC.' })),
      coincide: 'Coincide: 30 : 50 = 3 : 5, así que los 160 m se reparten en 8 partes de 20 m: DE = 3 · 20 = 60 m.',
      noCoincide: 'Revisemos: las cuadras de la avenida 2 van en la misma razón que las de la 1, 3 : 5. Los 160 m son 8 partes de 20 m: DE = 60 m.',
    },
    mira: {
      pieza: GO,
      datos: figCalles(0.4, { rot: { AB: '40 m', BC: '60 m', DE: '60 m', EF: '90 m' }, corteDE: 3, marcas: [0.2, 0.6, 0.8], en: { AB: 0.72, DE: 0.72, BC: 0.44, EF: 0.47 }, corteMarcas: 1, corteParalelas: 2, corteMarcas2: 3,
        alt: 'El barrio con AB = 40 m y BC = 60 m partidos en tramos de 20 m; por cada marca pasa una paralela, que parte la avenida 2 en tramos de 30 m.' }),
      voz: 'Paso a paso: partir en tramos iguales y trazar paralelas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'AB = 40 m y BC = 60 m: dos y tres tramos de 20 m.', ecuacion: junto([dO('AB'), ' : ', dI('BC'), ' = 2 : 3']) },
        { estado: { corte: 1 }, texto: 'Se marca la avenida 1 cada 20 m.', ecuacion: junto('100 m = 5 · 20 m') },
        { estado: { corte: 2 }, texto: 'Por cada marca pasa una recta paralela a los jirones.' },
        { estado: { corte: 3 }, texto: 'Tramos iguales en una secante dan tramos iguales en la otra.', ecuacion: junto(['150 m = 5 · 30 m']) },
        { estado: { corte: 3 }, texto: 'DE toma dos tramos de 30 m y EF, tres: la misma razón.', ecuacion: junto([dO('DE'), ' : ', dI('EF'), ' = 60 : 90 = 2 : 3']) },
      ],
    },
    regla: {
      texto: 'Tres o más paralelas cortan dos secantes en tramos proporcionales. En un triángulo, una paralela a un lado parte los otros dos igual; y si los parte igual, es paralela.',
      ecuacion: [{ frac: [dO('AB'), dI('BC')] }, ' = ', { frac: [dO('DE'), dI('EF')] }, Y, { frac: [dO('AM'), dI('MB')] }, ' = ', { frac: [dO('AN'), dI('NC')] }],
      condicion: 'se compara tramo con tramo y en el mismo orden; también la parte con el todo: AB/AC = DE/DF.',
      voz: 'Ante paralelas que cortan dos rectas, escribe las dos razones en el mismo orden.',
      dibujo: figO(figReglaThales()),
    },
    mundo: MUNDO1,
    resuelve: { pieza: GO, generar: resuelveThales },
    ahoraTu: {
      pieza: GO,
      voz: 'Escribe las dos razones en el mismo orden: arriba con arriba, abajo con abajo.',
      generar(s) { return conCuatro([casoTres, casoTotal, casoTri, casoX, casoRecip][s % 5], azar2(s + 7), firmasDe(EJ1, [PRED1])); },
    },
  };

  // ======================= Idea 2: teorema de la bisectriz =======================
  // Objeto de la primera pantalla: un terreno triangular visto desde arriba, con una estaca en cada esquina (geo-objeto,
  // escena «parcela», tipo «terreno», de Polígonos; no se toca) y un canal de riego recto que parte la esquina A en dos
  // ángulos iguales y llega a la cerca BC en D.
  // Cambia: la cerca AC. · Permanece: AB = 60 m y el ángulo A, 70°. · Progresa: dónde llega el canal. · Se reserva: la
  // razón exacta (la predicción) y la bisectriz exterior (la regla). · Debe verse: D se corre hacia el lado más corto.
  const KB = 0.1, ANG_A = 70;
  // El triángulo de la bisectriz: A arriba, la bisectriz de A hacia abajo; AB = c y AC = b (en el plano), ángulo A = alfa.
  //   rot: { AB, AC, BC, BD, DC, CE, BE, AD } (textos; «?» en tinta); o: { exterior: true (la bisectriz exterior AE y la
  //   prolongación de BC hasta E), terreno: true (el objeto), aux: { desde } (la paralela por C de Mira y el punto P),
  //   iso: corte (las marcas de los ángulos en P y en C), sinEscala, alt, vista, alto, sinMitades }
  function figBis(c, b, alfa, rot, o = {}) {
    const A = [0, 0], B = U.polar(A, c, 270 - alfa / 2), C = U.polar(A, b, 270 + alfa / 2);
    const D = [(b * B[0] + c * C[0]) / (b + c), (b * B[1] + c * C[1]) / (b + c)];
    // colores: true (juego, lector A): BD y DC llevan su color aunque no lleven medida.
    const col = (k, base) => (rot[k] === '?' || (rot[k] === undefined && !o.colores) ? undefined : base);
    const pts = { A, B, C, D };
    const segs = [['A', 'B', { color: col('AB', 'o'), grosor: 'variable' }], ['A', 'C', { color: col('AC', 'i'), grosor: 'variable' }],
      ['B', 'D', { color: col('BD', 'o'), grosor: 'variable' }], ['D', 'C', { color: col('DC', 'i'), grosor: 'variable' }], ['A', 'D', { discontinua: true }]];
    const ri = o.exterior && !o.sinMitades ? 20 : 26;
    const angs = o.sinMitades ? [] : [{ en: 'A', de: 'B', a: 'D', color: 'h', rayita: 1, radio: ri }, { en: 'A', de: 'D', a: 'C', color: 'h', rayita: 1, radio: ri }];
    const lados = [];
    const lado = (de, a, k, base, ref, x) => { if (rot[k] !== undefined) lados.push(Object.assign({ de, a, texto: rot[k], color: col(k, base), ref, dist: 4 }, x || {})); };
    lado('A', 'B', 'AB', 'o', 'C'); lado('A', 'C', 'AC', 'i', o.refAC || 'B', o.enAC !== undefined ? { en: o.enAC } : {}); lado('B', 'D', 'BD', 'o', 'A'); lado('D', 'C', 'DC', 'i', 'A');
    // Con un tramo rotulado (BD o DC), BC va un renglón más abajo: los dos rótulos se pisaban (auditoría, 20 nov).
    if (rot.BC !== undefined) lados.push({ de: 'B', a: 'C', texto: `BC = ${rot.BC}`, ref: 'A', dist: rot.BD !== undefined || rot.DC !== undefined ? 28 : 6, en: o.enBC !== undefined ? o.enBC : c / (b + c) < 0.5 ? 0.76 : 0.22 });
    // Con la exterior, CE sale de C hacia arriba: la letra C va abajo (auditoría, 20 nov).
    const ver = { A: { lado: o.exterior || o.aux ? 150 : 90 }, B: { lado: 200 }, C: { lado: o.exterior ? 290 : 340 }, D: { lado: 270 } };
    if (o.exterior && Math.abs(c - b) > 1e-9) {
      const E = [(c * C[0] - b * B[0]) / (c - b), (c * C[1] - b * B[1]) / (c - b)], X = [A[0] + (A[0] - B[0]) * 0.3, A[1] + (A[1] - B[1]) * 0.3];
      Object.assign(pts, { E, '~x': X });
      segs.push(['C', 'E', { color: col('CE', 'i'), grosor: col('CE', 'i') ? 'variable' : undefined }], ['A', 'E', { discontinua: true }], ['A', '~x', { discontinua: true, grosor: 'fino' }]);
      // Las mitades exteriores, más afuera que las interiores (lector A: se encimaban junto a AC).
      angs.push({ en: 'A', de: '~x', a: 'E', color: 'h', rayita: 2, radio: o.sinMitades ? 20 : 34 }, { en: 'A', de: 'E', a: 'C', color: 'h', rayita: 2, radio: o.sinMitades ? 20 : 34 });
      lado('C', 'E', 'CE', 'i', 'A');
      ver.E = { lado: 270 };
    }
    if (o.aux) {
      // Mira: por C, la paralela al canal; corta la prolongación de BA en P. Los ángulos en P y en C copian las mitades.
      const u = [D[0] - A[0], D[1] - A[1]], P = U.corte(C, [C[0] + u[0], C[1] + u[1]], B, A);
      pts.P = P; ver.P = { lado: 90, desde: o.aux.desde };
      segs.push(['A', 'P', { discontinua: true, grosor: 'fino', desde: o.aux.desde }], ['P', 'C', { discontinua: true, desde: o.aux.desde }]);
      if (o.iso !== undefined) angs.push({ en: 'P', de: 'A', a: 'C', color: 'h', rayita: 1, radio: 22, desde: o.iso }, { en: 'C', de: 'P', a: 'A', color: 'h', rayita: 1, radio: 22, desde: o.iso });
      if (o.llaveAP !== undefined) lados.push({ de: 'A', a: 'P', texto: rot.AP || 'AP', ref: 'C', dist: 4, desde: o.llaveAP, color: 'i' });
    }
    const obj = o.terreno ? { objeto: 'parcela', tipo: 'terreno', borde: ['A', 'B', 'C'], estacas: ['A', 'B', 'C'] } : { tipo: 'examen' };
    return sem({ pts, segs, angs, lados, ver, fijas: Object.keys(ver), obj, alto: o.alto || 250, vista: o.vista, sinEscala: o.sinEscala,
      alt: o.alt || 'Un triángulo ABC; la bisectriz de A llega a BC en D.' });
  }
  // La lectura del juego: los dos tramos en metros (con «≈» si no son exactos) y hacia dónde se corre D.
  const tramosBis = (c, b, alfa) => { const a = Math.sqrt(c * c + b * b - 2 * c * b * Math.cos(alfa * Math.PI / 180)); return { a, bd: a * c / (b + c), dc: a * b / (b + c) }; };
  const aprox = x => { const r = Math.round(x * 10) / 10; return Math.abs(r - x) < 1e-9 ? `= ${fm(r)}` : `≈ ${fm(r)}`; };
  // La vista del juego, fija para toda la grilla (AC de 20 a 100 m).
  const VBIS = { x: [-4.6, 6.9], y: [-9, 1.2] };

  // Un triángulo de la bisectriz sin escala para «Ahora tú» y «Así se resuelve» (lector A: no tenían dibujo): el lado más
  // largo se ve más largo, pero la razón dibujada va lejos de la de verdad. El primero que cabe.
  function dibBis(c, b, rot, o = {}) {
    const real = c / b, pares = noVacia((c < b ? [[4.4, 7.4], [4, 6.6], [5, 7.6], [3.6, 7.2], [5.4, 8], [4.8, 6.8]] : [[7.4, 4.4], [6.6, 4], [7.6, 5], [7.2, 3.6], [8, 5.4], [6.8, 4.8]]).filter(([x, y]) => Math.abs(x / y - real) > 0.12 * real), [c < b ? 3 : 7.5, c < b ? 7.5 : 3]);
    return figO(elQueCabe(...[70, 60, 80].flatMap(al => pares.map(([x, y]) => () => figBis(x, y, al, rot, Object.assign({ sinEscala: true }, o))))));
  }
  const D_BIS = ['Teorema de la bisectriz: la bisectriz de A llega a BC en D, y ', { frac: ['BD', 'DC'] }, ' = ', { frac: ['AB', 'AC'] }, '.'];
  const D_BISEXT = [{ frac: ['BE', 'CE'] }, ' = ', { frac: ['AB', 'AC'] }, ', si la bisectriz exterior de A llega a la prolongación de BC en E.'];
  const D_PERIM = 'El perímetro de un triángulo es la suma de sus tres lados.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 2): 9 cm; 6 cm; 10 cm; 5 cm (isósceles); 2 : 3; 35 cm
  // (perímetro); 10 cm (exterior); 6 cm (x = 4); 24 cm (DE entre las dos bisectrices); 30/7 cm (el 6-8-10); 105 m; 4 cm;
  // 8 cm; 8 cm (BC desde la exterior); 15 cm (diferencia de tramos).
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'El otro tramo',
    figura: figO(figBis(6, 6.4, 70, { AB: '10 cm', AC: '15 cm', BD: '6 cm', DC: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, la bisectriz de A llega a BC en D. AB = 10 cm, AC = 15 cm y BD = 6 cm. ¿Cuánto mide DC?${NO_ESC}`,
    datos: [D_BIS],
    solucion: [{ texto: 'BD va con AB, y DC con AC:', ecuacion: junto([{ frac: [dO('6'), 'DC'] }, ' = ', { frac: [dO('10'), dI('15')] }]) },
      { texto: 'Se despeja:', ecuacion: junto(['DC = 6 · 15 ÷ 10 = ', dF('9 cm')]) }],
    respuesta: [junto('DC = '), dF('9 cm')] });
  EJ2.push({ nivel: 1, titulo: 'Repartir el lado',
    enunciado: 'En el triángulo ABC, AB = 8 cm, AC = 12 cm y BC = 15 cm. La bisectriz de A llega a BC en D. ¿Cuánto mide BD?',
    datos: [D_BIS],
    solucion: [{ texto: 'BD : DC = AB : AC = 8 : 12 = 2 : 3. BC = 15 cm se reparte en 5 partes de 3 cm:', ecuacion: junto(['BD = 2 · 3 cm = ', dF('6 cm')]) }],
    respuesta: [junto('BD = '), dF('6 cm')] });
  EJ2.push({ nivel: 1, titulo: 'El lado desde los tramos',
    enunciado: 'En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = 3 cm y DC = 5 cm. Si AB = 6 cm, ¿cuánto mide AC?',
    datos: [D_BIS],
    solucion: [{ texto: 'Los lados están en la misma razón que los tramos:', ecuacion: junto([{ frac: [dO('3'), dI('5')] }, ' = ', { frac: [dO('6'), 'AC'] }, FL, 'AC = 5 · 6 ÷ 3 = ', dF('10 cm')]) }],
    respuesta: [junto('AC = '), dF('10 cm')] });
  EJ2.push({ nivel: 1, titulo: 'Dos lados iguales',
    enunciado: 'En el triángulo ABC, AB = AC = 7 cm y BC = 10 cm. La bisectriz de A llega a BC en D. ¿Cuánto mide BD?',
    datos: [D_BIS],
    solucion: [{ texto: 'AB : AC = 7 : 7 = 1 : 1: los dos tramos miden igual.', ecuacion: junto(['BD = 10 cm ÷ 2 = ', dF('5 cm')]) }],
    respuesta: [junto('BD = '), dF('5 cm')] });
  EJ2.push({ nivel: 1, titulo: 'La razón de los tramos',
    enunciado: 'En el triángulo ABC, los lados AB y AC están en razón 2 : 3. ¿En qué razón parte la bisectriz de A el lado BC?',
    datos: [D_BIS],
    solucion: [{ texto: 'Los tramos copian la razón de los lados vecinos:', ecuacion: junto(['BD : DC = AB : AC = ', dF('2 : 3')]) }],
    respuesta: [junto('BD : DC = '), dF('2 : 3')] });

  EJ2.push({ nivel: 2, titulo: 'El perímetro del terreno',
    figura: figO(figBis(6, 7.6, 70, { AB: '10 m', BD: '4 m', DC: '6 m' }, { terreno: true, sinEscala: true, alt: 'Un terreno triangular ABC; el canal AD parte la esquina A en dos; AB = 10 m, BD = 4 m y DC = 6 m.' })),
    enunciado: `El canal AD parte la esquina A del terreno triangular ABC en dos ángulos iguales. BD = 4 m, DC = 6 m y AB = 10 m. ¿Cuál es el perímetro?${NO_ESC}`,
    datos: [D_BIS, D_PERIM],
    solucion: [{ texto: 'Primero AC:', ecuacion: junto([{ frac: [dO('4'), dI('6')] }, ' = ', { frac: [dO('10'), 'AC'] }, FL, 'AC = 15 m']) },
      { texto: 'BC = 4 + 6 = 10 m. El perímetro:', ecuacion: junto(['10 + 15 + 10 = ', dF('35 m')]) }],
    respuesta: [dF('35 m')] });
  EJ2.push({ nivel: 2, titulo: 'La bisectriz de afuera',
    figura: figO(figBis(6, 3, 60, { AB: '12 cm', AC: '8 cm', BC: '5 cm', CE: '?' }, { enAC: 0.65, exterior: true, sinMitades: true, sinEscala: true, vista: { x: [-4.4, 7.4], y: [-6, 1.6] } })),
    enunciado: `En el triángulo ABC, AB = 12 cm, AC = 8 cm y BC = 5 cm. La bisectriz del ángulo exterior en A corta la prolongación de BC en E. ¿Cuánto mide CE?${NO_ESC}`,
    datos: [D_BISEXT],
    solucion: [{ texto: 'Con CE = x, el tramo BE es 5 + x:', ecuacion: junto([{ frac: ['5 + x', 'x'] }, ' = ', { frac: [dO('12'), dI('8')] }]) },
      { texto: 'En cruz, 40 + 8x = 12x. Se juntan las x:', ecuacion: junto(['4x = 40', FL, 'x = ', dF('10 cm')]) }],
    respuesta: [junto('CE = '), dF('10 cm')] });
  EJ2.push({ nivel: 2, titulo: 'Un lado con x',
    enunciado: 'En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = 4 cm y DC = 6 cm. AB = x + 2 y AC = 9, en centímetros. ¿Cuánto mide AB?',
    datos: [D_BIS],
    solucion: [{ texto: 'Teorema de la bisectriz:', ecuacion: junto([{ frac: ['x + 2', dI('9')] }, ' = ', { frac: [dO('4'), dI('6')] }]) },
      { texto: 'Se despeja x + 2:', ecuacion: junto(['x + 2 = 9 · 4 ÷ 6 = 6']) },
      { texto: 'AB es x + 2:', ecuacion: junto(['AB = ', dF('6 cm')]) }],
    respuesta: [junto('AB = '), dF('6 cm')] });
  EJ2.push({ nivel: 2, titulo: 'Entre las dos bisectrices',
    enunciado: 'En el triángulo ABC, AB = 9 cm, AC = 6 cm y BC = 10 cm. La bisectriz interior de A llega a BC en D, y la exterior corta la prolongación de BC en E. ¿Cuánto mide DE?',
    datos: [D_BIS, D_BISEXT],
    solucion: [{ texto: 'Adentro: BD : DC = 9 : 6 = 3 : 2, y 10 cm en 5 partes: DC = 4 cm.' },
      { texto: 'Afuera, con CE = x:', ecuacion: junto([{ frac: ['10 + x', 'x'] }, ' = ', { frac: [dO('9'), dI('6')] }, FL, '60 + 6x = 9x', FL, 'x = 20']) },
      { texto: 'DE = DC + CE:', ecuacion: junto(['4 + 20 = ', dF('24 cm')]) }],
    respuesta: [junto('DE = '), dF('24 cm')] });
  EJ2.push({ nivel: 2, titulo: 'La escuadra 6-8-10',
    figura: figO(figBis(5.2, 7.3, 90, { AB: '6 cm', AC: '8 cm', BD: '?' }, { sinEscala: true, alt: 'Un triángulo rectángulo en A, con AB = 6 cm y AC = 8 cm; la bisectriz del ángulo recto llega a la hipotenusa en D; BD lleva signo de pregunta.' })),
    enunciado: `Un triángulo es rectángulo en A, con catetos AB = 6 cm y AC = 8 cm, e hipotenusa BC = 10 cm. La bisectriz del ángulo recto llega a BC en D. ¿Cuánto mide BD?${NO_ESC}`,
    datos: [D_BIS],
    solucion: [{ texto: 'BD : DC = 6 : 8 = 3 : 4. BC = 10 cm se reparte en 7 partes iguales:', ecuacion: junto(['BD = ', { frac: ['3 · 10', '7'] }, ' = ', dF('30/7 cm')]) },
      { texto: 'No es la mitad, 5 cm: D se corre hacia B, el lado corto. Es casi 4,3 cm.' }],
    respuesta: [junto('BD = '), dF('30/7 cm')] });

  // Nivel 3: la correcta en C, A, E, B, D.
  EJ2.push({ nivel: 3, titulo: 'El terreno partido',
    enunciado: 'Un canal recto parte la esquina A de un terreno triangular ABC en dos ángulos iguales y llega a la cerca BC en D. BD = 12 m, DC = 18 m y AB = 30 m. ¿Cuál es el perímetro del terreno?',
    alternativas: ['90 m', '80 m', '105 m', '75 m', '120 m'],
    datos: [D_BIS, D_PERIM],
    fuente: 'Modelo de San Marcos 2026-II (pregunta 33), con otros números.',
    solucion: [{ texto: 'AC sale de la razón de los tramos:', ecuacion: junto([{ frac: [dO('12'), dI('18')] }, ' = ', { frac: [dO('30'), 'AC'] }, FL, 'AC = 45 m']) },
      { texto: 'BC = 12 + 18 = 30 m. El perímetro:', ecuacion: junto(['30 + 45 + 30 = ', dF('105 m')]) },
      { texto: '90 m toma AC = 30 m, como si fuera isósceles; 80 m toma AC = 20 m; 75 m deja fuera AB; 120 m suma 45 m dos veces.' }],
    respuesta: [dF('105 m')] });
  EJ2.push({ nivel: 3, titulo: 'Bisectriz y paralela',
    enunciado: 'En el triángulo ABC, AB = 12 cm y AC = 6 cm. La bisectriz de A llega a BC en D, y la paralela a AB por D corta AC en E. ¿Cuánto mide AE?',
    alternativas: ['4 cm', '2 cm', '3 cm', '8 cm', '6 cm'],
    datos: [D_BIS, D_TRI],
    fuente: 'Modelo de San Marcos 2019-II (pregunta 41), con otros números.',
    solucion: [{ texto: 'BD : DC = AB : AC = 12 : 6 = 2 : 1.' },
      { texto: 'DE ∥ AB: en el triángulo CAB, E parte CA en la misma razón que D parte CB:', ecuacion: junto(['CE : EA = CD : DB = 1 : 2']) },
      { texto: 'AC = 6 cm en 3 partes de 2 cm; AE toma dos:', ecuacion: junto(['AE = ', dF('4 cm')]) },
      { texto: '2 cm es CE; 3 cm parte AC por la mitad; 8 cm sale de 12 · 2 ÷ 3; 6 cm es AC entero.' }],
    respuesta: [junto('AE = '), dF('4 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Lados con la misma x',
    enunciado: 'En el triángulo ABC, AB = 2x y AC = 3x, con x en centímetros, y BC = 20 cm. La bisectriz de A llega a BC en D. ¿Cuánto mide BD?',
    alternativas: ['10 cm', '12 cm', '4 cm', '6,67 cm', '8 cm'],
    datos: [D_BIS],
    solucion: [{ texto: 'No hace falta x: BD : DC = 2x : 3x = 2 : 3.' },
      { texto: 'BC = 20 cm en 5 partes de 4 cm:', ecuacion: junto(['BD = 2 · 4 cm = ', dF('8 cm')]) },
      { texto: '10 cm es la mitad; 12 cm es DC; 4 cm es una sola parte; 6,67 cm reparte en tres partes, como si fuera 1 : 2.' }],
    respuesta: [junto('BD = '), dF('8 cm')] });
  EJ2.push({ nivel: 3, titulo: 'El lado desde afuera',
    enunciado: 'En el triángulo ABC, AB = 10 cm y AC = 6 cm. La bisectriz del ángulo exterior en A corta la prolongación de BC en E, con CE = 12 cm. ¿Cuánto mide BC?',
    alternativas: ['20 cm', '8 cm', '7,5 cm', '12 cm', '4,5 cm'],
    datos: [D_BISEXT],
    solucion: [{ texto: 'Como AB es más largo que AC, E queda del lado de C, más allá de C: BE = BC + 12. Con la bisectriz exterior:', ecuacion: junto([{ frac: ['BC + 12', '12'] }, ' = ', { frac: [dO('10'), dI('6')] }, FL, 'BC + 12 = 20']) },
      { texto: 'Se despeja:', ecuacion: junto(['BC = 20 − 12 = ', dF('8 cm')]) },
      { texto: '20 cm es BE entero; 12 cm es CE; 7,5 cm y 4,5 cm salen de repartir 12 cm en razón 10 : 6, como si E estuviera adentro.' }],
    respuesta: [junto('BC = '), dF('8 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Tramos que se diferencian',
    enunciado: 'En el triángulo ABC, AB = 8 cm y AC = 12 cm. La bisectriz de A llega a BC en D, y DC mide 3 cm más que BD. ¿Cuánto mide BC?',
    alternativas: ['20 cm', '12 cm', '9 cm', '15 cm', '6 cm'],
    datos: [D_BIS],
    solucion: [{ texto: 'BD : DC = 8 : 12 = 2 : 3: BD es 2 partes y DC, 3 partes.' },
      { texto: 'La diferencia es una parte: 3 cm. BC tiene 5 partes:', ecuacion: junto(['BC = 5 · 3 cm = ', dF('15 cm')]) },
      { texto: '20 cm suma los lados; 6 cm es BD y 9 cm es DC; 12 cm toma 4 partes.' }],
    respuesta: [junto('BC = '), dF('15 cm')] });

  // «Ahora tú» de la idea 2. Tipos: el tramo desde los tres lados; un lado desde los tramos; el perímetro (San Marcos
  // 2026-II); la bisectriz exterior; la x en un lado.
  // Un triángulo de lados c (AB), b (AC) y a (BC) que existe.
  const existe = (a, b, c) => a < b + c && b < a + c && c < a + b;
  function casoTramo(r) {
    const p = r.ent(1, 5), q = r.ent(1, 6), m = r.ent(2, 6), u = r.ent(1, 5);
    if (p === q || mcd(p, q) !== 1) return null;
    const c = p * m, b = q * m, a = (p + q) * u, pideBD = r.ent(0, 1) === 1;
    if (!existe(a, b, c)) return null;
    const x = pideBD ? p * u : q * u, otro = pideBD ? q * u : p * u, nom = pideBD ? 'BD' : 'DC';
    return { pregunta: `En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La bisectriz de A llega a BC en D. ¿Cuánto mide ${nom}?${NO_ESC}`,
      datos: [D_BIS], dibujo: dibBis(c, b, { AB: `${c} cm`, AC: `${b} cm`, BC: `${a} cm`, [nom]: '?' }),
      opciones: ops(x, r.baraja([
        { id: 'mitad', valor: a / 2, error: 'GE8', siFuera: 'Repartir BC está bien; pero la bisectriz no llega al medio: sale de la razón de los lados.' },
        { id: 'invertida', valor: otro, error: 'GE-PIE1', siFuera: `El reparto está bien: ${fm(otro)} cm es el otro tramo. ${nom} va con el lado que lo toca.` },
        { id: 'parte', valor: u, error: 'GE-PIE3', siFuera: `${fm(u)} cm es una sola parte; ${nom} toma ${pideBD ? p : q}.` },
        { id: 'lado', valor: pideBD ? a * c / b : a * b / c, error: 'GE-PIE4', siFuera: 'Usar los lados está bien; pero BC se reparte en partes, no se divide entre un lado.' }]), cm),
      solucion: { texto: `BD : DC = ${c} : ${b} = ${p} : ${q}. BC = ${a} cm en ${p + q} partes de ${u} cm.`, ecuacion: junto([`${nom} = ${pideBD ? p : q} · ${u} cm = `, dF(cm(x))]) } };
  }
  function casoLado(r) {
    const p = r.ent(1, 5), q = r.ent(1, 6), m = r.ent(2, 7), u = r.ent(1, 5);
    if (p === q || mcd(p, q) !== 1) return null;
    const c = p * m, b = q * m, a = (p + q) * u;
    if (!existe(a, b, c)) return null;
    return { pregunta: `En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = ${p * u} cm y DC = ${q * u} cm. Si AB = ${c} cm, ¿cuánto mide AC?${NO_ESC}`,
      datos: [D_BIS], dibujo: dibBis(c, b, { BD: `${p * u} cm`, DC: `${q * u} cm`, AB: `${c} cm`, AC: '?' }),
      opciones: ops(b, r.baraja([
        { id: 'invertida', valor: c * p / q, error: 'GE-PIE1', siFuera: `Usar la razón está bien; pero AC va con DC: ${p * u}/${q * u} = ${c}/AC.` },
        { id: 'suma', valor: c + q * u - p * u, error: 'GE-PIE2', siFuera: 'Sumar la diferencia de los tramos sería si crecieran igual; van en la misma razón.' },
        { id: 'copia', valor: c, error: 'GE8', siFuera: 'AC igual a AB solo si D cae en el medio; aquí los tramos son distintos.' },
        { id: 'tramo', valor: q * u, error: 'GE-PIE4', siFuera: `${q * u} cm es DC, un tramo de BC; AC es el lado.` }]), cm),
      solucion: { texto: 'Los lados están en la razón de los tramos:', ecuacion: junto([{ frac: [`${p * u}`, `${q * u}`] }, ' = ', { frac: [`${c}`, 'AC'] }, FL, 'AC = ', dF(cm(b))]) } };
  }
  function casoPerimetro(r) {
    const p = r.ent(1, 5), q = r.ent(1, 6), m = r.ent(2, 9), u = r.ent(2, 6);
    if (p === q || mcd(p, q) !== 1) return null;
    const c = p * m, b = q * m, a = (p + q) * u;
    if (!existe(a, b, c)) return null;
    const P = a + b + c;
    return { pregunta: `El canal AD parte la esquina A del terreno triangular ABC en dos ángulos iguales. BD = ${p * u} m, DC = ${q * u} m y AB = ${c} m. ¿Cuál es el perímetro?${NO_ESC}`,
      datos: [D_BIS, D_PERIM], dibujo: dibBis(c, b, { BD: `${p * u} m`, DC: `${q * u} m`, AB: `${c} m` }, { terreno: true, alt: 'Un terreno triangular ABC; el canal AD parte la esquina A en dos ángulos iguales y llega a BC en D.' }),
      opciones: ops(P, r.baraja([
        { id: 'iso', valor: a + 2 * c, error: 'GE8', siFuera: 'Sumar los tres lados está bien; pero AC no mide lo que AB: D no está en el medio.' },
        { id: 'invertida', valor: a + c + c * p / q, error: 'GE-PIE1', siFuera: `Sumar está bien; pero AC va con DC: AC = ${b} m, no ${fm(c * p / q)} m.` },
        { id: 'sinab', valor: a + b, error: 'GE-PIE5', siFuera: `AC = ${b} m está bien; falta sumar AB.` },
        { id: 'sinbc', valor: b + c, error: 'GE-PIE5', siFuera: `AC = ${b} m está bien; falta sumar BC = ${a} m.` }]), m_),
      solucion: { texto: `${p * u}/${q * u} = ${c}/AC da AC = ${b} m; BC = ${a} m.`, ecuacion: junto([`${c} + ${b} + ${a} = `, dF(m_(P))]) } };
  }
  function casoExterior(r) {
    const b = r.ent(2, 12), k = r.ent(1, 6), c = b + k, a = r.ent(k + 1, b + c - 1), x = a * b / k;
    if (!Number.isInteger(2 * x) || !existe(a, b, c) || x > 120) return null;
    return { pregunta: `En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La bisectriz del ángulo exterior en A corta la prolongación de BC en E. ¿Cuánto mide CE?${NO_ESC}`,
      datos: [D_BISEXT], dibujo: figO(elQueCabe(...[undefined, 0.5, 0.65].flatMap(enBC => [60, 50, 70].flatMap(al => noVacia([[6, 3.6], [6, 4], [6, 3.3], [5.6, 4.2], [6.6, 3.6], [5.2, 3.4]].filter(([x, y]) => Math.abs(x / y - c / b) > 0.1 * c / b), [6, 2.4]).map(([x, y]) => () => figBis(x, y, al, { AB: `${c} cm`, AC: `${b} cm`, BC: `${a} cm`, CE: '?' }, { enAC: 0.65, enBC, exterior: true, sinMitades: true, sinEscala: true, alto: 280 })))),
        // Si ninguno cabe, BC queda solo en el texto.
        ...noVacia([[6, 4], [6.4, 3], [5, 3.6], [6, 2.4], [6, 3.1]].filter(([x, y]) => Math.abs(x / y - c / b) > 0.1 * c / b), [6, 2.4]).map(([x, y]) => () => figBis(x, y, 60, { AB: `${c} cm`, AC: `${b} cm`, CE: '?' }, { enAC: 0.65, exterior: true, sinMitades: true, sinEscala: true })))),
      opciones: ops(x, r.baraja([
        { id: 'interior', valor: a * b / (b + c), error: 'GE-PIE6', siFuera: `${fm(a * b / (b + c))} cm es DC, el tramo de la bisectriz interior; E está afuera, más allá de C.` },
        { id: 'be', valor: a + x, error: 'GE-PIE7', siFuera: `La ecuación está bien: CE = ${fm(x)} cm. ${fm(a + x)} cm es BE entero.` },
        { id: 'sinbc', valor: a * c / k, error: 'GE-PIE1', siFuera: 'Plantear afuera está bien; pero CE va con AC, el lado que lo toca.' },
        { id: 'copia', valor: a, error: 'GE-PIE2', siFuera: `${a} cm es BC; CE es lo que sigue después de C.` }]), cm),
      solucion: { texto: `Con CE = x: (${a} + x)/x = ${c}/${b}, así que ${b * a} + ${b}x = ${c}x.`, ecuacion: junto(['x = ', dF(cm(x))]) } };
  }
  function casoXBis(r) {
    const p = r.ent(1, 4), q = r.ent(p + 1, 7), m = r.ent(2, 4), u = r.ent(1, 4), k = r.ent(1, 5);
    if (mcd(p, q) !== 1) return null;
    const c = p * m, b = q * m, a = (p + q) * u, x = c - k;
    if (x < 1 || !existe(a, b, c)) return null;
    return { pregunta: `En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = ${p * u} cm y DC = ${q * u} cm. AB = x + ${k} y AC = ${b}, en centímetros. ¿Cuánto vale x?${NO_ESC}`,
      datos: [D_BIS], dibujo: dibBis(c, b, { BD: `${p * u} cm`, DC: `${q * u} cm`, AB: `x + ${k}`, AC: `${b} cm` }),
      opciones: ops(x, r.baraja([
        { id: 'ab', valor: c, error: 'GE-THA6', siFuera: `AB = ${c} cm está bien; x es ${k} menos.` },
        { id: 'invertida', valor: b * q / p - k, error: 'GE-PIE1', siFuera: 'Plantear está bien; pero AB va con BD, el tramo que toca.' },
        { id: 'mas', valor: c + k, error: 'GE-THA6', siFuera: `AB = ${c} cm está bien; x + ${k} = ${c} da x restando, no sumando.` },
        { id: 'tramo', valor: p * u, error: 'GE-PIE4', siFuera: `${p * u} cm es BD, un tramo; x sale de AB.` }]), n => fm(n)),
      solucion: { texto: `(x + ${k})/${b} = ${p * u}/${q * u}, así que x + ${k} = ${c}.`, ecuacion: junto(['x = ', dF(fm(x))]) } };
  }
  function resuelveBis(s) {
    const r = azar2(s + 900);
    let p, q, m, u, c, b, a;
    do { p = r.ent(1, 4); q = r.ent(2, 6); m = r.ent(3, 9); u = r.ent(2, 7); c = p * m; b = q * m; a = (p + q) * u; } while (p === q || mcd(p, q) !== 1 || !existe(a, b, c));
    if (s % 2 === 0) return {
      enunciado: `En un terreno triangular ABC, AB = ${c} m, AC = ${b} m y BC = ${a} m. El canal AD parte la esquina A en dos ángulos iguales. ¿A cuántos metros de C llega?${NO_ESC}`,
      datos: [D_BIS], dibujo: dibBis(c, b, { AB: `${c} m`, AC: `${b} m`, BC: `${a} m`, DC: '?' }, { terreno: true, alt: `Un terreno triangular ABC con AB = ${c} m, AC = ${b} m y BC = ${a} m; el canal llega a BC en D; DC lleva signo de pregunta.` }),
      pasos: [
        { tipo: 'pide', texto: 'Piden DC: lo que hay de la estaca C al punto D donde llega el canal.' },
        { tipo: 'datos', texto: `Los lados vecinos de A: AB = ${c} m y AC = ${b} m. La cerca que parte el canal: BC = ${a} m.` },
        { tipo: 'regla', texto: 'El canal es la bisectriz de A: cada tramo de BC va con el lado que lo toca.', ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: [dO('AB'), dI('AC')] }] },
        { tipo: 'cuentas', texto: `AB : AC = ${c} : ${b} = ${p} : ${q}. BC = ${a} m se reparte en ${p + q} partes de ${u} m; DC toma ${q}.`, ecuacion: junto([`DC = ${q} · ${u} m = `, dF(m_(q * u))]) },
        { tipo: 'sentido', texto: `Comprobación: BD = ${p * u} m y ${p * u} + ${q * u} = ${a}. DC es el tramo largo porque AC es el lado largo.` },
      ],
      respuesta: [junto('DC = '), dF(m_(q * u))] };
    const P = a + b + c;
    return {
      enunciado: `En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = ${p * u} cm y DC = ${q * u} cm. Si AC = ${b} cm, ¿cuál es el perímetro del triángulo?${NO_ESC}`,
      datos: [D_BIS, D_PERIM], dibujo: dibBis(c, b, { BD: `${p * u} cm`, DC: `${q * u} cm`, AC: `${b} cm`, AB: '?' }),
      pasos: [
        { tipo: 'pide', texto: 'Piden el perímetro: AB + BC + CA.' },
        { tipo: 'datos', texto: `BC = ${p * u} + ${q * u} = ${a} cm y AC = ${b} cm. Falta AB.` },
        { tipo: 'regla', texto: 'Teorema de la bisectriz: los tramos están en la razón de los lados vecinos.', ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: [dO('AB'), dI('AC')] }] },
        { tipo: 'cuentas', texto: `${p * u}/${q * u} = AB/${b}, así que AB = ${c} cm.`, ecuacion: junto([`${c} + ${a} + ${b} = `, dF(cm(P))]) },
        { tipo: 'sentido', texto: `AB < AC y BD < DC: el lado corto va con el tramo corto. El triángulo existe: ${c} + ${b} > ${a}.` },
      ],
      respuesta: ['El perímetro mide ', dF(cm(P))] };
  }

  const PRED2 = 'Otro terreno tiene AB = 6 m, AC = 9 m y BC = 10 m. El canal parte la esquina A en dos ángulos iguales. ¿En qué tramos parte la cerca BC?';
  const ideaBisectriz = {
    id: 'bisectriz',
    titulo: 'Teorema de la bisectriz',
    pregunta: '¿Dónde llega un canal que parte una esquina en dos?',
    temas: ['Teorema de la bisectriz interior y exterior'],
    pieza: GO,
    aprendizaje: 'La bisectriz de un ángulo del triángulo parte el lado opuesto en dos tramos en la misma razón que los lados vecinos.',
    actividad: 'Alargar la cerca de un terreno y mirar dónde llega el canal que parte una esquina.',
    // Lee: la bisectriz (de Triángulos), el pie y los lados vecinos. No dice en qué razón queda el lado (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El terreno y su canal', texto: 'Este terreno triangular tiene una estaca en cada esquina. Un canal recto sale de la esquina A y la parte en dos ángulos iguales: es la bisectriz del ángulo A. Llega a la cerca BC en D, el pie de la bisectriz.',
          pieza: GO, dibujo: figO(figBis(6, 4, ANG_A, {}, { terreno: true, vista: VBIS, alt: 'Un terreno triangular ABC; el canal AD parte la esquina A en dos ángulos iguales y llega a BC en D.' })) },
        { titulo: 'Lados vecinos', texto: 'Los lados vecinos de la esquina A son las dos cercas que salen de ella: AB y AC. La cerca de enfrente, BC, es el lado opuesto: el canal la parte en dos tramos, BD y DC.' },
        { titulo: 'Qué mirar al jugar', texto: 'Alarga o acorta la cerca AC. Mira hacia qué estaca se corre D y compara los dos tramos con las dos cercas.' },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'El canal parte la esquina A del terreno en dos ángulos iguales y llega a la cerca BC en D. AB mide 60 m.',
      mision: { texto: 'Cambia la cerca AC hasta que D quede en el medio de BC.', logrado: v => v.ac === 60,
        bien: 'Listo: con AC igual a AB, el canal llega justo al medio de BC.' },
      voz: 'Mira hacia qué estaca se corre D.',
      leyenda: [
        { s: dO('AB'), t: 'una cerca, con su tramo BD' },
        { s: dI('AC'), t: 'la otra cerca, con su tramo DC' },
        { s: 'AD', t: 'el canal, en línea punteada' },
        { s: dH('marcas'), t: 'los dos ángulos iguales de A' },
      ],
      controles: [{ id: 'ac', etiqueta: 'AC, la otra cerca', min: 20, max: 100, paso: 10, inicio: 30, unidad: 'm', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: figBis(60 * KB, v.ac * KB, ANG_A, { AB: '60 m', AC: `${v.ac} m` }, { terreno: true, colores: true, vista: VBIS, alt: `El terreno con AB = 60 m y AC = ${v.ac} m; el canal llega a BC en D.` }), estado: {} }),
      lectura: v => { const t = tramosBis(60, v.ac, ANG_A); return v.ac === 60 ? [junto(`BD = DC ${aprox(t.bd)} m: D en el medio`)]
        : [junto([dO('BD'), ` ${aprox(t.bd)} m`]), Y, junto([dI('DC'), ` ${aprox(t.dc)} m`]), `: D, más cerca de ${t.bd < t.dc ? 'B' : 'C'}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: `${PRED2}${NO_ESC}`,
      datos: ['AB = 6 m, AC = 9 m y BC = 10 m.', 'Los dos ángulos que deja el canal en A miden igual.'],
      voz: 'Piensa hacia qué estaca se corre D y cuánto.',
      opciones: [
        { id: 'c', texto: 'BD = 4 m y DC = 6 m', correcta: true },
        { id: 'mitad', texto: 'BD = 5 m y DC = 5 m', error: 'GE8', siFuera: 'Partir el ángulo en dos está bien; pero el lado no queda en dos: eso pasa solo con AB = AC.' },
        { id: 'invertida', texto: 'BD = 6 m y DC = 4 m', error: 'GE-PIE1', siFuera: 'Ver que los tramos son 4 y 6 está bien; pero el corto está junto a B, el lado corto.' },
        { id: 'resta', texto: 'BD = 3 m y DC = 7 m', error: 'GE-PIE2', siFuera: 'Ver que D se corre hacia B está bien; pero 9 − 6 = 3 no es un tramo: va en razón.' },
      ],
      dibujo: figO(figBis(4.4, 8, ANG_A, { AB: '6 m', AC: '9 m', BC: '10 m' }, { terreno: true, sinEscala: true, alt: 'Otro terreno, con AB = 6 m, AC = 9 m y BC = 10 m; el canal parte la esquina A y llega a BC en D.' })),
      revelar: figO(figBis(4.4, 8, ANG_A, { AB: '6 m', AC: '9 m', BD: '4 m', DC: '6 m' }, { terreno: true, sinEscala: true, alt: 'El mismo terreno: BD = 4 m y DC = 6 m, en razón 6 : 9 como las cercas.' })),
      coincide: 'Coincide: BD : DC = 6 : 9 = 2 : 3, así que los 10 m se reparten en 4 m y 6 m.',
      noCoincide: 'Revisemos: los tramos copian la razón de las cercas, 6 : 9 = 2 : 3. Los 10 m en 5 partes de 2 m: BD = 4 m y DC = 6 m.',
    },
    mira: {
      pieza: GO,
      datos: figBis(6, 4, ANG_A, { AB: 'AB', AC: 'AC', BD: 'BD', DC: 'DC' }, { aux: { desde: 1 }, iso: 2, refAC: 'B', enAC: 0.3, vista: { x: [-5.6, 4.6], y: [-6.2, 5.6] },
        alt: 'El triángulo ABC con su bisectriz AD; por C, una paralela a AD corta la prolongación de BA en P, y el triángulo APC sale isósceles.' }),
      voz: 'Paso a paso: una paralela que se traza por C convierte la bisectriz en Thales.',
      pasos: [
        { estado: { corte: 0 }, texto: 'AD parte el ángulo A en dos mitades iguales.' },
        { estado: { corte: 1 }, texto: 'Por C, una paralela a AD corta la prolongación de BA en P.' },
        { estado: { corte: 2 }, texto: 'Las dos mitades se copian en P y en C: APC es isósceles.', ecuacion: junto(['AP = ', dI('AC')]) },
        { estado: { corte: 2 }, texto: 'Thales en el triángulo BPC, con AD paralela a PC:', ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: [dO('AB'), 'AP'] }] },
        { estado: { corte: 2 }, texto: 'Y como AP = AC, queda la razón de los lados vecinos.', ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: [dO('AB'), dI('AC')] }] },
      ],
    },
    regla: {
      texto: 'La bisectriz de un ángulo parte el lado opuesto en la razón de los lados vecinos. La exterior, que parte el ángulo de afuera, hace lo mismo en la prolongación.',
      ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: [dO('AB'), dI('AC')] }, Y, { frac: ['BE', dI('CE')] }, ' = ', { frac: [dO('AB'), dI('AC')] }],
      condicion: 'cada tramo va con el lado que lo toca: BD con AB, DC con AC y, afuera, CE con AC.',
      voz: 'Ante una bisectriz, empareja cada tramo con el lado que toca.',
      dibujo: figO(figBis(6, 3, 60, { AB: 'AB', AC: 'AC', BD: 'BD', DC: 'DC', CE: 'CE' }, { exterior: true, enAC: 0.78, vista: { x: [-4.4, 7.4], y: [-6, 1.6] }, alt: 'El triángulo ABC con la bisectriz interior AD y la exterior AE, que llega a la prolongación de BC en E.' })),
    },
    mundo: MUNDO2,
    resuelve: { pieza: GO, generar: resuelveBis },
    ahoraTu: {
      pieza: GO,
      voz: 'Cada tramo va con el lado que lo toca.',
      generar(s) { return conCuatro([casoTramo, casoLado, casoPerimetro, casoExterior, casoXBis][s % 5], azar2(s + 7), firmasDe(EJ2, [PRED2])); },
    },
  };

  // ======================= Idea 3: triángulos semejantes =======================
  // Objeto de la primera pantalla: un poste de luz y una alumna parados al sol, con sus sombras (geo-objeto, escena
  // «semejante», tipo «sol»; dibujo de prueba). El poste, su sombra y el rayo que pasa por la punta del poste forman un
  // triángulo rectángulo; la alumna, su sombra y su rayo, otro. Los rayos son paralelos: el ángulo con el suelo es el mismo.
  // Cambia: la altura del sol (la sombra de la alumna). · Permanece: el poste, 4,5 m, y la alumna, 1,5 m. · Progresa: las
  // dos sombras, siempre 3 a 1. · Se reserva: la alumna dentro de la sombra del poste (la predicción) y LAL y LLL (la
  // regla). · Debe verse: todo se multiplica por el mismo número.
  const HP = 4.5, HA = 1.5, XA = -3.5;
  // El poste AB (B al pie) y su sombra BC; la persona DE (E al pie) y su sombra EF. o: { H (alto del poste, dibujado), h
  // (alto de la persona, dibujado), s (sombra de la persona, dibujada), xe (dónde está la persona; con encaja: true, la
  // punta de su sombra cae en C), rot: { AB, DE, BC, EF, BE }, fantasma: corte (Mira: la persona corrida hasta C, D′E′),
  // angulos: corte (desde qué corte se ven los ángulos del sol), rectos: corte, sinEscala, alt, vista }
  function figSol(o) {
    const H = o.H || HP, h = o.h || HA, s = o.s, rot = o.rot || {};
    const B = [0, 0], A = [0, H], C = [H * s / h, 0], xe = o.encaja ? C[0] - s : (o.xe === undefined ? XA : o.xe);
    const E = [xe, 0], D = [xe, h], F = [xe + s, 0];
    const L = Math.hypot(A[0] - C[0], A[1] - C[1]), u = [(A[0] - C[0]) / L, (A[1] - C[1]) / L];
    const sol = [A[0] + u[0] * 2.4, A[1] + u[1] * 2.4];
    const col = (k, base) => (rot[k] === undefined || rot[k] === '?' ? undefined : base);
    const pts = { A, B, C, D, E, '~arriba': [0, 30], '~izq': [-30, H / 2] };
    if (!o.encaja) pts.F = F;
    const segs = [['B', 'A', { color: col('AB', 'o'), grosor: 'variable' }], ['B', 'C', { color: col('BC', 'i'), grosor: 'variable' }], ['A', 'C', { discontinua: true }],
      ['E', 'D', { color: col('DE', 'o'), grosor: 'variable' }], ['D', o.encaja ? 'C' : 'F', { discontinua: true }]];
    if (!o.encaja) segs.push(['E', 'F', { color: col('EF', 'i'), grosor: 'variable' }]);
    const ca = o.angulos || 0, cr = o.rectos === undefined ? 0 : o.rectos;
    const angs = [{ en: 'C', de: 'B', a: 'A', color: 'h', radio: 20, desde: ca }, { en: 'B', de: 'C', a: 'A', desde: cr }, { en: 'E', de: o.encaja ? 'C' : 'F', a: 'D', desde: cr }];
    if (!o.encaja) angs.push({ en: 'F', de: 'E', a: 'D', color: 'h', radio: 13, desde: ca });
    const lados = [];
    const lado = (de, a, k, base, ref, x) => { if (rot[k] !== undefined) lados.push(Object.assign({ de, a, texto: rot[k], color: col(k, base), ref, dist: 4 }, x || {})); };
    lado('B', 'A', 'AB', 'o', 'C'); lado('E', 'D', 'DE', 'o', o.encaja ? 'C' : 'F', { dist: 9 });
    lado('B', 'C', 'BC', 'i', '~arriba', o.encaja ? { dist: 12, en: 0.25 } : { dist: 12 }); lado('E', 'F', 'EF', 'i', '~arriba', { dist: 27 });
    if (o.encaja && rot.EC !== undefined) lados.push({ de: 'E', a: 'C', texto: rot.EC, color: col('EC', 'i'), ref: '~arriba', dist: 12 });
    if (rot.BE !== undefined) lados.push({ de: 'B', a: 'E', texto: rot.BE, ref: '~arriba', dist: 12 });
    const ver = { A: { lado: 90 }, B: { lado: 135 }, C: { lado: 45 }, D: { lado: 90 }, E: { lado: 225 }, F: { lado: 300 } };
    if (o.fantasma !== undefined) {
      const E2 = [C[0] - s, 0], D2 = [C[0] - s, h];
      Object.assign(pts, { E2, D2 }); Object.assign(ver, { E2: { lado: 225, desde: o.fantasma }, D2: { lado: 60, desde: o.fantasma } });
      segs.push(['E2', 'D2', { discontinua: true, color: 'o', desde: o.fantasma }]);
      angs.push({ en: 'E2', de: 'C', a: 'D2', desde: o.fantasma });
    }
    const letra = { E2: null, D2: 'D′' };
    return sem({ pts, segs, angs, lados, ver, letra, fijas: Object.keys(ver), obj: { tipo: 'sol', suelo: 'B', sol, postes: [['B', 'A']], personas: [['E', 'D']] },
      alto: 250, vista: o.vista || { x: [-5.8, 8.3], y: [-2.3, 6.7] }, sinEscala: o.sinEscala,
      alt: o.alt || 'Un poste AB y una alumna DE al sol; sus sombras BC y EF, y los rayos de sol AC y DF, paralelos.' });
  }
  // Dos triángulos semejantes, figura de examen: ABC a la izquierda y DEF a la derecha, con DEF = k veces ABC.
  //   b, c: los ángulos en B y en C (grados); k: la razón dibujada; rot: { AB, BC, CA, DE, EF, FD }; o: { marcas: true (los
  //   ángulos iguales con 1 y 2 arcos), textos: { B, C, E, F } (rótulos de ángulo), sinEscala, alt }
  function figDos(b, c, k, rot, o = {}) {
    const ancho = 3, Bp = [0, 0], Cp = [ancho, 0], ta = Math.tan(b * Math.PI / 180), tc = Math.tan(c * Math.PI / 180), xa = ancho * tc / (ta + tc), Ap = [xa, xa * ta];
    const dx = ancho + 2, E = [dx, 0], F = [dx + ancho * k, 0], Dp = [dx + xa * k, xa * ta * k];
    const pts = { A: Ap, B: Bp, C: Cp, D: Dp, E, F };
    const col = (kk, base) => (rot[kk] === undefined || rot[kk] === '?' ? undefined : base);
    const C3 = { AB: 'o', DE: 'o', BC: 'i', EF: 'i' };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E'], ['E', 'F'], ['F', 'D']].map(([p, q]) => [p, q, { color: col(p + q, C3[p + q]), grosor: 'variable' }]);
    const tx = o.textos || {};
    const angs = o.marcas === false ? [] : [{ en: 'B', de: 'C', a: 'A', color: 'h', texto: tx.B }, { en: 'C', de: 'A', a: 'B', color: 'h', marcas: 2, texto: tx.C },
      { en: 'E', de: 'F', a: 'D', color: 'h', texto: tx.E }, { en: 'F', de: 'D', a: 'E', color: 'h', marcas: 2, texto: tx.F }];
    const lados = Object.entries(rot).map(([kk, t]) => ({ de: kk[0], a: kk[1], texto: t, color: col(kk, C3[kk]), ref: { AB: 'C', BC: 'A', CA: 'B', DE: 'F', EF: 'D', FD: 'E' }[kk], dist: 4 }));
    const ys = [Ap[1], Dp[1]];
    return sem({ pts, segs, angs, lados, ver: { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, D: { lado: 90 }, E: { lado: 225 }, F: { lado: 315 } }, fijas: ['A', 'B', 'C', 'D', 'E', 'F'],
      alto: 230, vista: { x: [-0.9, F[0] + 0.9], y: [-0.9, Math.max(...ys) + 0.9] }, sinEscala: o.sinEscala,
      alt: o.alt || 'Dos triángulos, ABC y DEF, con los ángulos de B y E iguales y los de C y F iguales.' });
  }

  const D_AA = 'AA: si dos triángulos tienen dos ángulos iguales, son semejantes.';
  // Auditoría (20 nov, los dos lectores): el dato va sin letras. Con «DE/AB = EF/BC = FD/CA» chocaba con los puntos D y E
  // de los encajados (tarjeta 11: daba DE = 6 en vez de 5) y nombraba puntos que los problemas de sombras no tienen.
  const D_SEM = 'Semejantes: los lados frente a ángulos iguales van en pareja, y cada lado del grande es k veces su pareja.';
  const D_LLL = 'LLL: si los tres lados de un triángulo están en la misma razón con los de otro, son semejantes.';
  const D_LAL = 'LAL: si dos lados están en la misma razón y el ángulo entre ellos es igual, son semejantes.';
  const D_SOL = 'A la misma hora, los rayos del sol llegan paralelos: forman el mismo ángulo con el suelo.';
  const D_PARA = 'Una paralela a un lado de un triángulo forma con los otros dos un triángulo semejante al grande.';
  const D_ESPEJO = 'El rayo de luz sale del espejo con el mismo ángulo (con el suelo) con que llega.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 3): 8 m; 15 cm; k = 2; 4 cm; sí, k = 1,5; 6 m; 10,5 cm;
  // 15 cm; 15 cm; 6 m; 15 cm; 4 m; 10 cm; 8 cm; 2,4 m.
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'El árbol y el palo',
    enunciado: 'A la misma hora, un árbol proyecta una sombra de 12 m y un palo vertical de 1 m proyecta una sombra de 1,5 m. ¿Cuánto mide el árbol?',
    datos: [D_SOL, D_AA, D_SEM],
    solucion: [{ texto: 'Los dos triángulos (objeto, sombra y rayo) son semejantes. La sombra del árbol es 12 ÷ 1,5 = 8 veces la del palo:', ecuacion: junto(['árbol = 8 · ', dO('1 m'), ' = ', dF('8 m')]) }],
    respuesta: [dF('8 m')] });
  EJ3.push({ nivel: 1, titulo: 'Un lado del grande',
    figura: figO(figDos(55, 70, 1.5, { AB: '4 cm', BC: '6 cm', DE: '10 cm', EF: '?' }, { sinEscala: true })),
    enunciado: `Los triángulos ABC y DEF tienen m∠B = m∠E y m∠C = m∠F. AB = 4 cm, BC = 6 cm y DE = 10 cm. ¿Cuánto mide EF?${NO_ESC}`,
    datos: [D_AA, D_SEM],
    solucion: [{ texto: 'Dos ángulos iguales: son semejantes, con k = 10 ÷ 4 = 2,5.', ecuacion: junto(['EF = 2,5 · ', dI('6 cm'), ' = ', dF('15 cm')]) }],
    respuesta: [junto('EF = '), dF('15 cm')] });
  EJ3.push({ nivel: 1, titulo: 'La razón de semejanza',
    enunciado: 'Un triángulo tiene lados de 3 cm, 4 cm y 5 cm, y otro, de 6 cm, 8 cm y 10 cm. ¿Cuál es la razón de semejanza k del grande al chico?',
    datos: [D_LLL, D_SEM],
    solucion: [{ texto: 'Cada lado del grande entre su pareja del chico:', ecuacion: junto(['6 ÷ 3 = 8 ÷ 4 = 10 ÷ 5 = ', dF('2')]) }],
    respuesta: [junto('k = '), dF('2')] });
  EJ3.push({ nivel: 1, titulo: 'El segmento paralelo',
    figura: figO(figTri(0.55, { AM: '3 cm', BC: '12 cm', MN: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = 3 cm, AB = 9 cm y BC = 12 cm. ¿Cuánto mide MN?${NO_ESC}`,
    datos: [D_PARA, D_SEM],
    solucion: [{ texto: 'AMN y ABC son semejantes, con k = AM ÷ AB = 3 ÷ 9:', ecuacion: junto(['MN = ', { frac: ['3', '9'] }, ' · ', '12 cm = ', dF('4 cm')]) }],
    respuesta: [junto('MN = '), dF('4 cm')] });
  EJ3.push({ nivel: 1, titulo: '¿Son semejantes?',
    enunciado: 'Un triángulo tiene lados de 4 cm, 6 cm y 8 cm, y otro, de 6 cm, 9 cm y 12 cm. ¿Son semejantes?',
    datos: [D_LLL],
    solucion: [{ texto: 'Se dividen los lados en orden, del más corto al más largo:', ecuacion: junto(['6 ÷ 4 = 9 ÷ 6 = 12 ÷ 8 = 1,5']) },
      { texto: ['Los tres dan lo mismo: ', dF('sí, con k = 1,5'), '.'] }],
    respuesta: [dF('Sí'), ': k = 1,5'] });

  EJ3.push({ nivel: 2, titulo: 'Dentro de la sombra',
    figura: figO(figSol({ H: 5, h: 1.5, s: 1.6, encaja: true, rot: { AB: '?', DE: '1,5 m', EC: '2 m', BE: '6 m' }, sinEscala: true, vista: { x: [-2.4, 8.6], y: [-1.7, 6.9] },
      alt: 'Un poste AB y una alumna DE de 1,5 m, parada a 6 m del poste, justo donde la punta de su sombra, de 2 m, cae en la del poste.' })),
    enunciado: `Una alumna de 1,5 m está a 6 m de un poste, donde la punta de su sombra cae en la de la sombra del poste. Su sombra mide 2 m. ¿Y el poste?${NO_ESC}`,
    datos: [D_SOL, D_AA, D_SEM],
    solucion: [{ texto: 'La sombra del poste es toda: 6 m + 2 m = 8 m. Es 4 veces la de la alumna.' },
      { texto: 'Los dos triángulos comparten el ángulo del sol:', ecuacion: junto(['poste = 4 · ', dO('1,5 m'), ' = ', dF('6 m')]) }],
    respuesta: [dF('6 m')] });
  EJ3.push({ nivel: 2, titulo: 'Dos lados y su ángulo',
    enunciado: 'En el triángulo ABC, AB = 5 cm, AC = 8 cm, m∠A = 60° y BC = 7 cm. En el triángulo DEF, DE = 7,5 cm, DF = 12 cm y m∠D = 60°. ¿Cuánto mide EF?',
    datos: [D_LAL, D_SEM],
    solucion: [{ texto: '7,5 ÷ 5 = 12 ÷ 8 = 1,5 y el ángulo entre esos lados es igual: LAL, con k = 1,5.' },
      { texto: 'EF es la pareja de BC:', ecuacion: junto(['EF = 1,5 · 7 cm = ', dF('10,5 cm')]) }],
    respuesta: [junto('EF = '), dF('10,5 cm')] });
  EJ3.push({ nivel: 2, titulo: 'El lado más corto',
    enunciado: 'Un triángulo tiene lados de 5 cm, 7 cm y 9 cm. Otro, semejante a él, tiene su lado más largo de 27 cm. ¿Cuánto mide su lado más corto?',
    datos: [D_SEM],
    solucion: [{ texto: 'El más largo va con el más largo: k = 27 ÷ 9 = 3.' },
      { texto: 'El más corto, con el más corto:', ecuacion: junto(['3 · 5 cm = ', dF('15 cm')]) }],
    respuesta: [dF('15 cm')] });
  EJ3.push({ nivel: 2, titulo: 'La base desde arriba',
    figura: figO(figTri(0.6, { AM: '4 cm', MB: '6 cm', MN: '6 cm', BC: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = 4 cm, MB = 6 cm y MN = 6 cm. ¿Cuánto mide BC?${NO_ESC}`,
    datos: [D_PARA, D_SEM],
    solucion: [{ texto: 'AB = 4 + 6 = 10 cm. ABC es el grande, con k = AB ÷ AM = 10 ÷ 4 = 2,5.' },
      { texto: 'BC es la pareja de MN:', ecuacion: junto(['BC = 2,5 · 6 cm = ', dF('15 cm')]) }],
    respuesta: [junto('BC = '), dF('15 cm')] });
  EJ3.push({ nivel: 2, titulo: 'Un espejo en el piso',
    enunciado: 'Un espejo en el piso está a 2 m de una alumna, con los ojos a 1,5 m de alto, y a 8 m de una pared. En el espejo ve lo alto de la pared. ¿Cuánto mide la pared?',
    datos: [D_ESPEJO, D_AA, D_SEM],
    solucion: [{ texto: 'Los dos triángulos rectángulos (alumna y pared, cada uno con su tramo de piso) tienen el mismo ángulo en el espejo: son semejantes.' },
      { texto: 'El piso de la pared es 8 ÷ 2 = 4 veces el de la alumna:', ecuacion: junto(['pared = 4 · ', dO('1,5 m'), ' = ', dF('6 m')]) }],
    respuesta: [dF('6 m')] });

  // Nivel 3: la correcta en C, A, E, B, D.
  EJ3.push({ nivel: 3, titulo: 'El tablero cortado',
    enunciado: 'Un tablero triangular tiene lados de 12 cm, 15 cm y 18 cm. Se corta con una recta paralela al lado de 18 cm, y el corte mide 6 cm. ¿Cuál es el perímetro del triángulo que se separa?',
    alternativas: ['39 cm', '30 cm', '15 cm', '6 cm', '18 cm'],
    datos: [D_PARA, D_SEM, 'El perímetro es la suma de los lados.'],
    fuente: 'Modelo de San Marcos 2022 (pregunta 35), con otros números.',
    solucion: [{ texto: 'El triángulo que se separa es semejante al tablero, con k = 6 ÷ 18 = 1/3.' },
      { texto: 'Sus lados: 12 ÷ 3 = 4 cm, 15 ÷ 3 = 5 cm y 6 cm.', ecuacion: junto(['4 + 5 + 6 = ', dF('15 cm')]) },
      { texto: '39 cm resta 6 del perímetro del tablero; 30 cm usa k = 2/3; 6 cm es solo el corte; 18 cm suma 12 y 6.' }],
    respuesta: [dF('15 cm')] });
  EJ3.push({ nivel: 3, titulo: 'El cable más corto',
    enunciado: 'Dos postes de 3 m y 6 m están a 12 m. Un cable une sus puntas pasando por una estaca en el suelo, y es lo más corto posible. ¿A qué distancia del poste chico está la estaca?',
    alternativas: ['4 m', '6 m', '8 m', '3 m', '2 m'],
    datos: ['El cable más corto forma ángulos iguales con el suelo a los dos lados de la estaca.', D_AA, D_SEM],
    fuente: 'Modelo de San Marcos 2020-I (pregunta 40), con otros números.',
    solucion: [{ texto: 'Con ángulos iguales, los dos triángulos (poste, suelo y cable) son semejantes, y el grande es el doble: k = 6 ÷ 3 = 2.' },
      { texto: 'Si la estaca está a x del chico, del grande está a 12 − x = 2x:', ecuacion: junto(['3x = 12', FL, 'x = ', dF('4 m')]) },
      { texto: '8 m es lo que hay hasta el poste grande; 6 m es la mitad; 3 m y 2 m no dejan los tramos en razón 1 : 2.' }],
    respuesta: [dF('4 m')] });
  EJ3.push({ nivel: 3, titulo: 'Paralela con x',
    enunciado: 'En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = x, MB = 6, MN = 4 y BC = 10, en centímetros. ¿Cuánto mide AB?',
    alternativas: ['4 cm', '6 cm', '15 cm', '2,4 cm', '10 cm'],
    datos: [D_PARA, D_SEM],
    solucion: [{ texto: 'AMN ∼ ABC: AM con AB y MN con BC.', ecuacion: junto([{ frac: ['x', 'x + 6'] }, ' = ', { frac: ['4', '10'] }, FL, '10x = 4x + 24', FL, 'x = 4']) },
      { texto: 'AB = x + 6:', ecuacion: junto(['AB = 4 + 6 = ', dF('10 cm')]) },
      { texto: '4 cm es x; 6 cm es MB; 2,4 cm sale de x/6 = 4/10, la parte con la parte; 15 cm, de AB/6 = 10/4.' }],
    respuesta: [junto('AB = '), dF('10 cm')] });
  EJ3.push({ nivel: 3, titulo: 'El lado con x',
    enunciado: 'Los triángulos de lados 4 cm, 6 cm y x, y de lados 6 cm, 9 cm y 12 cm, son semejantes, con los lados escritos en el mismo orden. ¿Cuánto vale x?',
    alternativas: ['10', '8', '18', '9', '6'],
    datos: [D_SEM],
    solucion: [{ texto: 'k = 6 ÷ 4 = 9 ÷ 6 = 1,5. La pareja de x es 12:', ecuacion: junto(['1,5 · x = 12', FL, 'x = ', dF('8')]) },
      { texto: '18 multiplica 12 por 1,5; 10 resta a 12 la diferencia 6 − 4, y 9 le resta 9 − 6, como si los lados crecieran sumando; 6 copia el segundo lado.' }],
    respuesta: [junto('x = '), dF('8')] });
  EJ3.push({ nivel: 3, titulo: 'Dos cables cruzados',
    enunciado: 'Dos postes verticales de 4 m y 6 m están a 10 m uno del otro. Un cable va de la punta de cada poste al pie del otro. ¿A qué altura del suelo se cruzan los cables?',
    alternativas: ['5 m', '3 m', '2 m', '2,4 m', '2,5 m'],
    datos: [D_AA, D_SEM],
    solucion: [{ texto: 'Sea h la altura del cruce y x lo que hay de su pie al poste chico. Por semejanza con cada poste:', ecuacion: junto(['h ÷ 6 = x ÷ 10', Y, 'h ÷ 4 = (10 − x) ÷ 10']) },
      { texto: 'Se suman: h ÷ 6 + h ÷ 4 = 1, así que 5h ÷ 12 = 1:', ecuacion: junto(['h = ', dF('2,4 m')]) },
      { texto: '5 m promedia los postes; 3 m y 2 m son sus mitades; 2,5 m es un cuarto de la distancia.' }],
    respuesta: [dF('2,4 m')] });

  // «Ahora tú» de la idea 3. Tipos: el poste por su sombra; un lado con dos ángulos iguales (AA); el segmento paralelo a
  // la base; ¿son semejantes? (LLL); el espejo en el piso.
  // Dibujos sin escala de «Ahora tú» y «Así se resuelve» (lector A: no tenían): el poste y el palo, o los dos triángulos,
  // con lo dibujado lejos de la respuesta.
  const dibSombra = (S, h, s, k) => { const Hs = noVacia([4.5, 5.4, 3.9].filter(H => Math.abs(H / 1.5 - k) > 0.25), 6.6);
    return figO(elQueCabe(...Hs.map(H => () => figSol({ H, h: 1.5, s: 1, xe: -3, rot: { AB: '?', DE: m_(h), BC: m_(S), EF: m_(s) }, sinEscala: true, vista: { x: [-5.8, 8.3], y: [-2.3, Math.max(6.7, H + 2.6)] },
      alt: `Un poste AB y un palo DE de ${m_(h)} al sol; la sombra del poste mide ${m_(S)} y la del palo, ${m_(s)}.` })))); };
  function casoSombra(r) {
    const h = r.de([1.5, 1.6, 1.8, 2]), s = r.de([1, 1.2, 1.5, 2, 2.5]), k = r.ent(3, 6), S = s * k, H = h * k;
    if (H > 12) return null;
    return { pregunta: `A la misma hora, un poste AB proyecta una sombra BC de ${m_(S)} y un palo vertical DE de ${m_(h)} proyecta una sombra EF de ${m_(s)}. ¿Cuánto mide el poste?${NO_ESC}`,
      datos: [D_SOL, D_AA, D_SEM], dibujo: dibSombra(S, h, s, k),
      opciones: ops(H, r.baraja([
        { id: 'invertida', valor: S * s / h, error: 'GE22', siFuera: `Usar la razón está bien; pero va alto con alto y sombra con sombra: ${fm(S)} ÷ ${fm(s)} = poste ÷ ${fm(h)}.` },
        { id: 'suma', valor: S + h - s, error: 'GE-SEM1', siFuera: 'Sumar la diferencia sería si todo creciera igual; crece en la misma razón.' },
        { id: 'sombra', valor: S, error: 'GE-SEM2', siFuera: `${fm(S)} m es la sombra; el poste y su sombra miden igual solo con el sol a 45°.` },
        { id: 'k', valor: k, error: 'GE-SEM3', siFuera: `${k} es cuántas veces cabe la sombra chica en la grande; falta multiplicar el palo.` }]), m_),
      solucion: { texto: `La sombra del poste es ${fm(S)} ÷ ${fm(s)} = ${k} veces la del palo.`, ecuacion: junto([`poste = ${k} · ${fm(h)} m = `, dF(m_(H))]) } };
  }
  function casoAA(r) {
    const a = r.ent(2, 9), b = r.ent(2, 9), k = r.de([1.5, 2, 2.5, 3, 4]), d = a * k, x = b * k;
    if (a === b || !Number.isInteger(2 * d) || !Number.isInteger(2 * x)) return null;
    // (Sin los valores de los ángulos: con AB y BC al azar, unos ángulos fijos no siempre darían un triángulo posible.)
    if (b >= a + 2 * a || a >= 3 * b) return null;
    return { pregunta: `Los triángulos ABC y DEF tienen m∠B = m∠E y m∠C = m∠F. AB = ${a} cm, BC = ${b} cm y DE = ${fm(d)} cm. ¿Cuánto mide EF?${NO_ESC}`,
      datos: [D_AA, D_SEM], dibujo: figO(elQueCabe(...noVacia([1.5, 1.8, 1.3].filter(kk => Math.abs(kk - k) > 0.2), 1.1).map(kk => () => figDos(55, 70, kk, { AB: `${a} cm`, BC: `${b} cm`, DE: `${fm(d)} cm`, EF: '?' }, { sinEscala: true })))),
      opciones: ops(x, r.baraja([
        { id: 'invertida', valor: a * b / d, error: 'GE22', siFuera: 'Usar la razón está bien; pero el grande es DEF: EF es mayor que BC.' },
        { id: 'suma', valor: b + d - a, error: 'GE-SEM1', siFuera: 'Sumar la diferencia sería si todo creciera igual; crece en la misma razón.' },
        { id: 'k', valor: k, error: 'GE-SEM3', siFuera: `${fm(k)} es k, cuántas veces es mayor el grande; falta multiplicar BC.` },
        { id: 'copia', valor: b, error: 'GE-SEM4', siFuera: `${b} cm es BC: los triángulos semejantes no miden igual, se multiplican por k.` }]), cm),
      solucion: { texto: `k = ${fm(d)} ÷ ${a} = ${fm(k)}.`, ecuacion: junto([`EF = ${fm(k)} · ${b} cm = `, dF(cm(x))]) } };
  }
  function casoBase(r) {
    const p = r.ent(1, 5), q = r.ent(1, 6), u = r.ent(1, 4), w = r.ent(2, 6);
    if (p === q || mcd(p, q) !== 1) return null;
    const AM = p * u, MB = q * u, BC = (p + q) * w, MN = p * w;
    return { pregunta: `En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = ${AM} cm, MB = ${MB} cm y BC = ${BC} cm. ¿Cuánto mide MN?${NO_ESC}`,
      datos: [D_PARA, D_SEM], dibujo: figO(elQueCabe(...tOrden(AM, MB).map(t => () => figTri(t, { AM: `${AM} cm`, MB: `${MB} cm`, BC: `${BC} cm`, MN: '?' }, { sinEscala: true })))),
      opciones: ops(MN, r.baraja([
        { id: 'parte', valor: BC * AM / MB, error: 'GE22', siFuera: `Usar la razón está bien; pero MN va con BC, y AM con AB entero, no con MB.` },
        { id: 'resta', valor: BC - MB, error: 'GE-SEM1', siFuera: 'Restar no sirve: el triángulo chico es el grande multiplicado por un número.' },
        { id: 'mitad', valor: BC / 2, error: 'GE-SEM5', siFuera: 'La mitad de BC vale solo si M es el punto medio de AB.' },
        { id: 'otra', valor: q * w, error: 'GE-THA5', siFuera: 'El reparto está bien; pero MN va con AM, la parte de arriba.' }]), cm),
      solucion: { texto: `AMN ∼ ABC con k = ${AM} ÷ ${AM + MB}.`, ecuacion: junto([`MN = ${BC} · ${AM} ÷ ${AM + MB} = `, dF(cm(MN))]) } };
  }
  function casoLLL(r) {
    const T = r.de([[3, 4, 5], [4, 6, 7], [5, 6, 8], [2, 3, 4], [4, 5, 6], [5, 7, 9]]), k = r.de([1.5, 2, 2.5, 3]), si = r.ent(0, 1) === 1;
    const otro = T.map(x => x * k);
    if (!si) otro[2] += r.de([-1, 1, 2]);
    // Auditoría (20 nov): con 2, 3 y 4 por 1,5 o 2, sumar 2 al lado largo dejaba un triángulo imposible (3; 4,5; 8).
    if (otro.some(x => !Number.isInteger(2 * x)) || !existe(...otro)) return null;
    const ok = si ? `Sí, con k = ${fm(k)}` : `No: ${fm(otro[2])} ÷ ${T[2]} no es ${fm(k)}`;
    const opciones = [{ id: 'c', texto: ok, correcta: true }].concat(si
      ? [{ id: 'iguales', texto: 'No: sus lados no miden igual', error: 'GE-SEM4', siFuera: 'Semejantes no es iguales: basta que todos se multipliquen por el mismo número.' },
        { id: 'angulos', texto: 'Faltan los ángulos', error: 'GE-SEM6', siFuera: 'Con los tres lados en la misma razón alcanza: es LLL.' },
        { id: 'resta', texto: 'No: las diferencias no son iguales', error: 'GE-SEM1', siFuera: 'Se comparan cocientes, no restas.' }]
      : [{ id: 'dos', texto: `Sí: dos lados dan ${fm(k)}`, error: 'GE-SEM6', siFuera: 'Dos lados no alcanzan: los tres tienen que dar el mismo cociente.' },
        { id: 'angulos', texto: 'Faltan los ángulos', error: 'GE-SEM6', siFuera: 'Con los tres lados basta: se comparan sus cocientes.' },
        { id: 'casi', texto: 'Sí: los cocientes casi coinciden', error: 'GE-SEM6', siFuera: 'Casi no alcanza: tienen que ser iguales.' }]);
    return { pregunta: `Un triángulo tiene lados de ${T.join(' cm, ').replace(/, (\d+)$/, ' y $1')} cm, y otro, de ${otro.map(fm).join(' cm, ').replace(/, ([\d,]+)$/, ' y $1')} cm. ¿Son semejantes?`,
      datos: [D_LLL], opciones,
      solucion: { texto: `Cocientes en orden: ${otro.map((x, i) => `${fm(x)} ÷ ${T[i]} ${Number.isInteger(100 * x / T[i]) ? '=' : '≈'} ${fm(x / T[i])}`).join('; ')}.`, ecuacion: [dF(si ? 'sí son semejantes' : 'no son semejantes')] } };
  }
  function casoEspejo(r) {
    const ojo = r.de([1.5, 1.6]), a = r.de([1.5, 2, 2.5, 3]), k = r.ent(3, 8), b = a * k, H = ojo * k;
    if (H > 15 || !Number.isInteger(2 * b)) return null;
    return { pregunta: `Un espejo en el piso está a ${m_(a)} de un alumno, con los ojos a ${m_(ojo)} de altura, y a ${m_(b)} de un edificio. Él ve en el espejo lo más alto del edificio. ¿Cuánto mide?`,
      datos: [D_ESPEJO, D_AA, D_SEM],
      opciones: ops(H, r.baraja([
        { id: 'invertida', valor: ojo * a / b, error: 'GE22', siFuera: 'Usar la razón está bien; pero el edificio es el grande: tiene que salir mayor que el alumno.' },
        { id: 'suma', valor: ojo + b - a, error: 'GE-SEM1', siFuera: 'Sumar la diferencia sería si todo creciera igual; crece en la misma razón.' },
        { id: 'piso', valor: b, error: 'GE-SEM2', siFuera: `${fm(b)} m es el piso hasta el edificio, no su altura.` },
        { id: 'total', valor: ojo * (a + b) / a, error: 'GE-SEM7', siFuera: 'Usar el piso entero no sirve: cada triángulo tiene su tramo, del espejo a la persona o al edificio.' }]), m_),
      solucion: { texto: `Mismo ángulo en el espejo: semejantes. El piso del edificio es ${fm(b)} ÷ ${fm(a)} = ${k} veces el del alumno.`, ecuacion: junto([`${k} · ${fm(ojo)} m = `, dF(m_(H))]) } };
  }
  function resuelveSem(s) {
    const r = azar2(s + 900);
    if (s % 2 === 0) {
      let h, sa, d, k;
      // (Ni 1,6 m con 2 m de sombra: es el alumno de Predice; lector A.)
      do { h = r.de([1.5, 1.6, 1.8]); sa = r.de([1, 1.5, 2, 2.5]); d = r.de([2, 3, 4, 4.5, 5, 6, 7.5]); k = (d + sa) / sa; } while (!Number.isInteger(2 * k) || h * k > 12 || (h === 1.6 && sa === 2));
      const H = h * k;
      return {
        enunciado: `Un alumno de ${m_(h)} se para a ${m_(d)} de un poste. La punta de su sombra, de ${m_(sa)}, cae en la de la sombra del poste. ¿Cuánto mide el poste?${NO_ESC}`,
        datos: [D_SOL, D_AA, D_SEM],
        dibujo: figO(elQueCabe(...noVacia([[5, 2.2], [5.4, 1.8], [4.4, 2.6]].filter(([H, ss]) => Math.abs(H / 1.5 - k) > 0.3 && Math.abs((H * ss / 1.5 - ss) / ss - d / sa) > 0.3), [3.6, 3]).map(([H, ss]) => () => figSol({ H, h: 1.5, s: ss, encaja: true, rot: { AB: '?', DE: m_(h), EC: m_(sa), BE: m_(d) }, sinEscala: true, vista: { x: [-2.4, 8.6], y: [-1.7, 6.9] },
          alt: `Un poste AB y un alumno DE de ${m_(h)}, a ${m_(d)} del poste; la punta de su sombra, de ${m_(sa)}, cae en la punta C de la sombra del poste.` })))),
        pasos: [
          { tipo: 'pide', texto: 'Piden la altura del poste.' },
          { tipo: 'datos', texto: `Alumno: ${m_(h)} de alto y ${m_(sa)} de sombra. El poste está a ${m_(d)} del alumno, así que su sombra mide ${fm(d)} + ${fm(sa)} = ${m_(d + sa)}.` },
          { tipo: 'regla', texto: 'Los dos triángulos (cada uno con su rayo de sol) tienen el ángulo recto y el ángulo del sol: son semejantes (AA).', ecuacion: [{ frac: ['poste', dO('alumno')] }, ' = ', { frac: [dI('sombra del poste'), dI('sombra del alumno')] }] },
          { tipo: 'cuentas', texto: `k = ${fm(d + sa)} ÷ ${fm(sa)} = ${fm(k)}.`, ecuacion: junto([`poste = ${fm(k)} · ${fm(h)} m = `, dF(m_(H))]) },
          { tipo: 'sentido', texto: `Comprobación: ${fm(H)} ÷ ${fm(h)} = ${fm(k)}, lo mismo que las sombras. La sombra del poste es la entera, no solo los ${m_(d)}.` },
        ],
        respuesta: ['El poste mide ', dF(m_(H))] };
    }
    let T, k;
    do { T = r.de([[3, 5, 7], [4, 5, 6], [2, 3, 4], [5, 6, 9], [3, 4, 6]]); k = r.de([2, 2.5, 3, 4]); } while (!T.every(x => Number.isInteger(2 * x * k)));
    const g = T.map(x => x * k);
    return {
      enunciado: `Un triángulo tiene lados de ${T[0]} cm, ${T[1]} cm y ${T[2]} cm. Otro triángulo, semejante a él, tiene su lado más largo de ${fm(g[2])} cm. ¿Cuánto mide su lado más corto?`,
      datos: [D_SEM],
      pasos: [
        { tipo: 'pide', texto: 'Piden el lado más corto del triángulo grande.' },
        { tipo: 'datos', texto: `El chico: ${T[0]}, ${T[1]} y ${T[2]} cm. Del grande se conoce el más largo: ${fm(g[2])} cm.` },
        { tipo: 'regla', texto: 'En triángulos semejantes, el lado más largo va con el más largo y el más corto con el más corto; todos se multiplican por k.' },
        { tipo: 'cuentas', texto: `k = ${fm(g[2])} ÷ ${T[2]} = ${fm(k)}.`, ecuacion: junto([`${fm(k)} · ${T[0]} cm = `, dF(cm(g[0]))]) },
        { tipo: 'sentido', texto: `El otro lado medirá ${fm(k)} · ${T[1]} = ${fm(g[1])} cm: ${fm(g[0])} < ${fm(g[1])} < ${fm(g[2])}, el mismo orden.` },
      ],
      respuesta: ['El lado más corto mide ', dF(cm(g[0]))] };
  }

  const PRED3 = 'Un alumno de 1,6 m se para a 3 m de un poste, donde la punta de su sombra, de 2 m, cae en la de la sombra del poste. ¿Cuánto mide el poste?';
  const ideaSemejanza = {
    id: 'semejanza',
    titulo: 'Triángulos semejantes',
    pregunta: '¿Cómo se mide un poste con su sombra?',
    temas: ['Criterios de semejanza de triángulos'],
    pieza: GO,
    aprendizaje: 'Dos ángulos iguales bastan para que dos triángulos sean semejantes (también LAL y LLL), y entonces todos sus lados se multiplican por el mismo k.',
    actividad: 'Alargar la sombra de una alumna y compararla con la de un poste.',
    // Lee: el poste y la alumna como triángulos; semejante y razón de semejanza, sin decir cuánto mide el poste de la
    // predicción ni cómo se usa la sombra entera.
    lee: {
      tarjetas: [
        { titulo: 'Dos triángulos al sol', texto: 'El poste, su sombra y el rayo de sol que pasa por su punta forman un triángulo rectángulo. La alumna, su sombra y su rayo forman otro, más chico. Los rayos llegan paralelos: los dos triángulos tienen el mismo ángulo con el suelo.',
          pieza: GO, dibujo: figO(figSol({ s: 1, rot: { AB: '4,5 m', DE: '1,5 m' }, alt: 'Un poste de 4,5 m y una alumna de 1,5 m al sol, con sus sombras.' })) },
        { titulo: 'Semejantes', texto: 'Dos figuras son semejantes si tienen la misma forma, aunque no el mismo tamaño: una es la otra ampliada. La razón de semejanza k es el número por el que se multiplica cada lado. El signo ∼ se lee «es semejante a».' },
        { titulo: 'Qué mirar al jugar', texto: 'Alarga o acorta la sombra de la alumna, como si el sol bajara o subiera. Compara la sombra del poste con la de la alumna, y el alto del poste con el de la alumna.' },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'Un poste de 4,5 m y una alumna de 1,5 m están al sol de la misma tarde. Cada uno proyecta su sombra.',
      mision: { texto: 'Alarga la sombra EF de la alumna hasta que la sombra del poste mida 6 m.', logrado: v => v.s === 2,
        bien: 'Listo: sombras de 6 m y 2 m, como alturas de 4,5 m y 1,5 m.' },
      voz: 'Compara las dos sombras y las dos alturas.',
      leyenda: [
        { s: dO('AB'), t: 'el poste; DE, la alumna' },
        { s: dI('BC'), t: 'la sombra del poste; EF, la de ella' },
        { s: 'AC, DF', t: 'los rayos de sol, punteados' },
        { s: dH('marca'), t: 'el ángulo del sol con el suelo' },
      ],
      controles: [{ id: 's', etiqueta: 'EF, la sombra de la alumna', min: 0.5, max: 2.5, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2, color: 'c-i' }],
      dibujo: v => ({ datos: figSol({ s: v.s, rot: { AB: '4,5 m', DE: '1,5 m', BC: m_(3 * v.s), EF: m_(v.s) } }), estado: {} }),
      lectura: v => [junto(['sombras: ', dI(m_(3 * v.s)), ' = 3 × ', dI(m_(v.s))]), '; ', junto(['alturas: ', dO('4,5 m'), ' = 3 × ', dO('1,5 m')])],
      minimo: 3,
    },
    predice: {
      pregunta: `${PRED3}${NO_ESC}`,
      datos: ['El alumno mide 1,6 m y su sombra, 2 m.', 'Del poste al alumno hay 3 m.'],
      voz: 'Mira qué parte del suelo es la sombra del poste.',
      opciones: [
        { id: 'c', texto: '4 m', correcta: true },
        { id: 'parte', texto: '2,4 m', error: 'GE22', siFuera: 'Multiplicar al alumno está bien; pero la sombra del poste no son 3 m: llega hasta la punta.' },
        { id: 'suma', texto: '4,6 m', error: 'GE-SEM1', siFuera: 'Ver que el poste es más alto está bien; pero no se suman la altura y la distancia.' },
        { id: 'sombra', texto: '5 m', error: 'GE-SEM2', siFuera: 'Ver que la sombra del poste mide 5 m está bien; pero el poste no mide lo que su sombra.' },
      ],
      dibujo: figO(figSol({ H: 5, h: 1.5, s: 2.2, encaja: true, rot: { AB: '?', DE: '1,6 m', EC: '2 m', BE: '3 m' }, sinEscala: true, vista: { x: [-2.4, 8.6], y: [-1.7, 6.7] },
        alt: 'Un poste AB y un alumno DE, de 1,6 m, a 3 m del poste; la punta de su sombra, de 2 m, cae en la punta C de la sombra del poste.' })),
      revelar: figO(figSol({ H: 5, h: 1.5, s: 2.2, encaja: true, rot: { AB: '4 m', DE: '1,6 m', EC: '2 m', BE: '3 m' }, sinEscala: true, vista: { x: [-2.4, 8.6], y: [-1.7, 6.7] },
        alt: 'El mismo dibujo: el poste mide 4 m, porque su sombra, 5 m, es 2,5 veces la del alumno.' })),
      coincide: 'Coincide: la sombra del poste mide 3 + 2 = 5 m, 2,5 veces la del alumno. El poste: 2,5 · 1,6 = 4 m.',
      noCoincide: 'Revisemos: la sombra del poste llega hasta la punta, 3 + 2 = 5 m, que es 2,5 veces 2 m. El poste es 2,5 veces el alumno: 4 m.',
    },
    mira: {
      pieza: GO,
      datos: figSol({ s: 2, rot: { AB: '4,5 m', DE: '1,5 m', BC: '6 m', EF: '2 m' }, angulos: 0, rectos: 1, fantasma: 2,
        alt: 'El poste y la alumna al sol: los ángulos del sol son iguales, los dos ángulos rectos también, y la alumna corrida hasta C cabe dentro del triángulo del poste.' }),
      voz: 'Dos ángulos iguales bastan. Después, el triángulo de la alumna se corre hasta caber en el del poste.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Rayos paralelos: el ángulo del sol en C y en F es igual.' },
        { estado: { corte: 1 }, texto: 'Poste y alumna están derechos: los dos tienen un ángulo recto.' },
        { estado: { corte: 1 }, texto: 'Si dos ángulos son iguales, el tercero también: suman 180°.', ecuacion: junto('m∠A = m∠D') },
        { estado: { corte: 2 }, texto: 'Corrida hasta C (punteada), la alumna queda paralela al poste.' },
        { estado: { corte: 2 }, texto: 'Thales en el triángulo del poste: todo se multiplica por 3.', ecuacion: junto([dO('4,5'), ' ÷ ', dO('1,5'), ' = ', dI('6'), ' ÷ ', dI('2'), ' = 3']) },
      ],
    },
    regla: {
      texto: 'Dos triángulos son semejantes si tienen dos ángulos iguales (AA). Entonces todos sus lados se multiplican por el mismo k. También bastan LAL y LLL con lados en razón k.',
      ecuacion: [{ frac: [dO('DE'), dO('AB')] }, ' = ', { frac: [dI('EF'), dI('BC')] }, ' = ', { frac: ['FD', 'CA'] }, ' = k'],
      condicion: 'se empareja en el orden de los vértices: el lado de enfrente de cada ángulo con el de enfrente de su igual.',
      voz: 'Busca dos ángulos iguales; después, los lados en el mismo orden.',
      dibujo: figO(figDos(50, 65, 1.6, { AB: 'AB', BC: 'BC', DE: 'DE', EF: 'EF' }, { alt: 'Dos triángulos semejantes ABC y DEF: los ángulos en B y E iguales (una marca), los de C y F iguales (dos marcas).' })),
    },
    mundo: MUNDO3,
    resuelve: { pieza: GO, generar: resuelveSem },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca los ángulos iguales y escribe k con una pareja de lados.',
      generar(s) { return conCuatro([casoSombra, casoAA, casoBase, casoLLL, casoEspejo][s % 5], azar2(s + 7), firmasDe(EJ3, [PRED3])); },
    },
  };

  // ======================= Idea 4: triángulos encajados =======================
  // Objeto de la primera pantalla: una rampa apoyada en una pared, con un puntal perpendicular a la rampa que baja al piso
  // (geo-objeto, escena «semejante», tipo «rampa»; dibujo de prueba). Rampa, piso y pared forman un triángulo rectángulo;
  // el puntal, el tramo de rampa y el tramo de piso, otro, encajado en el primero con el ángulo del pie A en común.
  // Cambia: dónde se apoya el puntal. · Permanece: la rampa (5 m), el piso hasta la pared (4 m) y la altura (3 m). ·
  // Progresa: AD sobre el piso. · Se reserva: el ángulo igual sin ángulo recto (la predicción, la antiparalela). · Debe
  // verse: AE va con AC y AD con AB, cruzados: no se emparejan por estar en la misma recta.
  // Diferencia con Congruencia («Lados y ángulos correspondientes»): allá los dos triángulos estaban separados y medían
  // igual; aquí están montados uno sobre otro, comparten un ángulo y un lado del chico está sobre un lado del grande.
  const RP = { AB: 5, AC: 4, BC: 3 };
  // La rampa: A en el piso, C al pie de la pared, B arriba. ae: AE sobre la rampa (E, donde se apoya el puntal); D, su
  // pie en el piso. o: { rot: { AE, AD, AB, AC, ED }, angulos: corte, recto: corte, sinPuntal, alt, sinEscala, objeto }
  // Los rótulos de una pareja llevan su color (AE y AC naranja; AD y AB turquesa); los trazos van en tinta, porque un
  // lado del chico está encima de uno del grande.
  function figRampa(ae, o = {}) {
    const rot = o.rot || {}, A = [0, 0], C = [RP.AC, 0], B = [RP.AC, RP.BC], u = [RP.AC / RP.AB, RP.BC / RP.AB];
    const E = [u[0] * ae, u[1] * ae], D = [ae * RP.AB / RP.AC, 0];
    const pts = { A, B, C, E, D, '~abajo': [2, -9], '~arriba': [-3, 9], '~der': [9, 0] };
    const segs = [['A', 'D'], ['D', 'C'], ['C', 'B'], ['A', 'E'], ['E', 'B'], ['E', 'D', { grosor: 'variable' }]];
    const ca = o.angulos || 0, cr = o.recto || 0;
    const angs = [{ en: 'A', de: 'D', a: 'E', color: 'h', radio: 26, desde: ca }, { en: 'C', de: 'B', a: 'A', desde: cr }, { en: 'E', de: 'A', a: 'D', desde: cr }];
    const col = (k, base) => (rot[k] === undefined || rot[k] === '?' ? undefined : base);
    const lados = [], cotas = [];
    const L = (de, a, k, base, ref, x) => { if (rot[k] !== undefined) lados.push(Object.assign({ de, a, texto: k === 'AE' || k === 'AD' || k === 'ED' || rot[k] === k ? rot[k] : `${k} = ${rot[k]}`, color: col(k, base), ref, dist: 4 }, x || {})); };
    // La rampa AB y el piso AC enteros van sobre una llave (cota): su rótulo junto a EB o DC se leía como la medida de ese
    // tramo (auditoría, 20 nov).
    const K = (de, a, k, base, ref, dist) => { if (rot[k] !== undefined) cotas.push({ de, a, texto: rot[k] === k ? k : `${k} = ${rot[k]}`, color: col(k, base), ref, dist }); };
    L('A', 'E', 'AE', 'o', '~abajo', { dist: 6 }); K('A', 'B', 'AB', 'i', 'C', 58);
    L('A', 'D', 'AD', 'i', '~arriba', { dist: 10 }); K('A', 'C', 'AC', 'o', 'B', 36); L('E', 'D', 'ED', undefined, '~der', { dist: 5 });
    const ver = { A: { lado: 115 }, B: { lado: 90 }, C: { lado: 315 }, E: { lado: 110 }, D: { lado: 300 } };
    return sem({ pts, segs, angs, lados, cotas, ver, fijas: Object.keys(ver), alto: 270, sinEscala: o.sinEscala,
      obj: o.objeto === false ? { tipo: 'examen' } : { tipo: 'rampa', suelo: 'A', pared: ['C', 'B'], tablas: [['A', 'B'], ['E', 'D']] },
      vista: { x: [-0.9, 4.9], y: [-1.45, 3.9] },
      alt: o.alt || 'Una rampa AB apoyada en la pared, con el pie A en el piso; un puntal ED sale perpendicular a la rampa y baja al piso en D.' });
  }
  // La antiparalela: triángulo ABC con D en AB y E en AC, y m∠ADE = m∠ACB (no paralela a BC). Dibujado con lados ab y ac
  // desde A y AE = ae; AD sale de la semejanza ADE ∼ ACB. rot: { AB, AC, AE, AD, DE, BC }; o: { sinEscala, alt }
  function figAnti(ab, ac, ae, rot, o = {}) {
    const A = [0, 0], B = U.polar(A, ab, 238), C = U.polar(A, ac, 302), ad = ae * ac / ab, D = U.polar(A, ad, 238), E = U.polar(A, ae, 302);
    const segs = [['A', 'D'], ['D', 'B'], ['A', 'E'], ['E', 'C'], ['B', 'C'], ['D', 'E', { grosor: 'variable' }]];
    // marcaE: el ángulo igual dado es AED = ABC (en E y en B), no ADE = ACB.
    const angs = [o.marcaE ? { en: 'E', de: 'A', a: 'D', color: 'h', radio: 16 } : { en: 'D', de: 'A', a: 'E', color: 'h', radio: 16 },
      o.marcaE ? { en: 'B', de: 'C', a: 'A', color: 'h', radio: 18 } : { en: 'C', de: 'A', a: 'B', color: 'h', radio: 18 }, { en: 'A', de: 'B', a: 'C', color: 'h', marcas: 2, radio: 20 }];
    const col = (k, base) => (rot[k] === undefined || rot[k] === '?' ? undefined : base);
    const lados = [], cotas = [];
    const L = (de, a, k, base, ref, x) => { if (rot[k] !== undefined) lados.push(Object.assign({ de, a, texto: rot[k], color: col(k, base), ref, dist: 4 }, x || {})); };
    // AB y AC enteros, sobre una llave del lado de afuera (cota): el rótulo suelto quedaba junto a DB y EC y se leía como su
    // medida (auditoría, 20 nov). AD y AE van adentro.
    const K = (de, a, k, base, ref) => { if (rot[k] !== undefined) cotas.push({ de, a, texto: rot[k], color: col(k, base), ref, dist: o.distCota || 54, en: 0.74 }); };
    K('A', 'B', 'AB', 'i', 'C'); K('A', 'C', 'AC', 'o', 'B'); L('A', 'D', 'AD', 'o', 'C'); L('A', 'E', 'AE', 'i', 'B');
    L('D', 'E', 'DE', undefined, 'A', { dist: 3 }); L('B', 'C', 'BC', undefined, 'A');
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, D: { lado: 300 }, E: { lado: 240 } };
    const xs = [A, B, C].map(q => q[0]), ys = [A, B, C].map(q => q[1]);
    return sem({ pts: { A, B, C, D, E }, segs, angs, lados, cotas, ver, fijas: Object.keys(ver), alto: 260, sinEscala: o.sinEscala,
      vista: { x: [Math.min(...xs) - 4.2, Math.max(...xs) + 4.2], y: [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9] },
      alt: o.alt || 'Un triángulo ABC con D en AB y E en AC; el ángulo ADE es igual al ángulo ACB, y DE no es paralela a BC.' });
  }

  // Dos triángulos cruzados (lector B: sin dibujo no se veía cuáles ángulos son alternos): AC y BD se cortan en O, con AB
  // paralela a CD. oa y ob: OA y OB dibujados; k: OC/OA dibujado. rot: { OA, OC, OB, OD, AB, CD } (textos; «?» en tinta).
  function figCruz(oa, ob, k, rot, o = {}) {
    const O = [0, 0], A = U.polar(O, oa, 160), B = U.polar(O, ob, 222), C = U.polar(O, oa * k, 340), D = U.polar(O, ob * k, 42);
    const col = (kk, base) => (rot[kk] === undefined || rot[kk] === '?' ? undefined : base);
    const C3 = { OA: 'o', OC: 'o', AB: 'i', CD: 'i' };
    const segs = [['A', 'O', { color: col('OA', 'o'), grosor: 'variable' }], ['O', 'C', { color: col('OC', 'o'), grosor: 'variable' }], ['B', 'O'], ['O', 'D'],
      ['A', 'B', { color: col('AB', 'i'), grosor: 'variable', paralela: 1 }], ['C', 'D', { color: col('CD', 'i'), grosor: 'variable', paralela: 1 }]];
    const angs = [{ en: 'A', de: 'O', a: 'B', color: 'h', radio: 18 }, { en: 'C', de: 'O', a: 'D', color: 'h', radio: 18 },
      { en: 'O', de: 'A', a: 'B', color: 'h', marcas: 2, radio: 16 }, { en: 'O', de: 'C', a: 'D', color: 'h', marcas: 2, radio: 16 }];
    const REF = { OA: 'B', OC: 'D', OB: 'A', OD: 'C', AB: 'O', CD: 'O' }, EXT = { OA: ['A', 'O'], OC: ['O', 'C'], OB: ['B', 'O'], OD: ['O', 'D'], AB: ['A', 'B'], CD: ['C', 'D'] };
    // AB y CD llevan la flechita de paralela en el medio: su rótulo va a un lado de ella.
    const lados = Object.entries(rot).map(([kk, t]) => Object.assign({ de: EXT[kk][0], a: EXT[kk][1], texto: t, color: col(kk, C3[kk]), ref: REF[kk], dist: 4 }, kk === 'AB' || kk === 'CD' ? { en: 0.25 } : {}));
    const ps = [A, B, C, D], xs = ps.map(q => q[0]), ys = ps.map(q => q[1]);
    return sem({ pts: { A, B, C, D, O }, segs, angs, lados, ver: { A: { lado: 130 }, B: { lado: 230 }, C: { lado: 310 }, D: { lado: 50 } }, fijas: ['A', 'B', 'C', 'D'], alto: 230, sinEscala: o.sinEscala,
      vista: { x: [Math.min(...xs) - 1.1, Math.max(...xs) + 1.1], y: [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9] },
      alt: o.alt || 'Los segmentos AC y BD se cortan en O; AB es paralela a CD: dos triángulos cruzados, OAB y OCD.' });
  }
  // Los cruzados, el primero que cabe con OA y OB dibujados de varias maneras (k, la razón dibujada).
  const dibCruz = (k, rot) => figO(elQueCabe(...[[2.2, 2], [2.2, 2.6], [2.6, 1.8], [2, 2.4], [2.6, 2.6]].map(([a, b]) => () => figCruz(a, b, k, rot, { sinEscala: true }))));
  const D_ENC = 'Si dos triángulos comparten un ángulo y tienen otro ángulo igual, son semejantes (AA).';
  const D_HOM = 'Lados homólogos: el lado frente a un ángulo va con el lado frente a su ángulo igual.';
  const D_OPV = 'Los ángulos opuestos por el vértice miden igual.';
  const D_ALT = 'Una recta que corta dos paralelas forma ángulos alternos internos iguales.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 4): 3,2 cm; 5 m; 8 cm; DE con CB; 1,5 m; 6 cm; 15 cm;
  // 5 cm; 4 cm; 2,4 m; 4 cm; 6 cm; 5 cm; 21 cm; 3 m.
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'Un ángulo cruzado',
    figura: figO(figAnti(7, 6, 3.6, { AB: '10 cm', AC: '8 cm', AE: '4 cm', AD: '?' }, { sinEscala: true })),
    enunciado: `En el triángulo ABC, AB = 10 cm y AC = 8 cm. D está en AB y E en AC, con AE = 4 cm y m∠ADE = m∠ACB. ¿Cuánto mide AD?${NO_ESC}`,
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'ADE ∼ ACB: A con A, D con C y E con B. AD va con AC; AE, con AB:', ecuacion: junto([{ frac: ['AD', dO('8')] }, ' = ', { frac: [dI('4'), dI('10')] }]) },
      { texto: 'Se despeja:', ecuacion: junto(['AD = 8 · 4 ÷ 10 = ', dF('3,2 cm')]) }],
    respuesta: [junto('AD = '), dF('3,2 cm')] });
  EJ4.push({ nivel: 1, titulo: 'El pie del puntal',
    enunciado: 'Una rampa de 10 m tiene su pie A a 8 m de la pared. Un puntal perpendicular a la rampa la toca a 4 m de A y llega al piso en D. ¿Cuánto mide AD?',
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'Los dos triángulos comparten el ángulo A y tienen un recto. AD, frente al recto del puntal, va con la rampa, frente al recto de la pared.',
      ecuacion: junto([{ frac: ['AD', dI('10')] }, ' = ', { frac: [dO('4'), dO('8')] }, FL, 'AD = ', dF('5 m')]) }],
    respuesta: [junto('AD = '), dF('5 m')] });
  EJ4.push({ nivel: 1, titulo: 'Dos triángulos cruzados',
    figura: dibCruz(1.6, { OA: '3 cm', OC: '6 cm', AB: '4 cm', CD: '?' }),
    enunciado: `Los segmentos AC y BD se cortan en O, y AB es paralela a CD. OA = 3 cm, OC = 6 cm y AB = 4 cm. ¿Cuánto mide CD?${NO_ESC}`,
    datos: [D_OPV, D_ALT, D_SEM],
    solucion: [{ texto: 'OAB ∼ OCD: los ángulos en O son opuestos por el vértice, y los de A y C, alternos. OA va con OC: k = 6 ÷ 3 = 2.', ecuacion: junto(['CD = 2 · ', '4 cm = ', dF('8 cm')]) }],
    respuesta: [junto('CD = '), dF('8 cm')] });
  EJ4.push({ nivel: 1, titulo: '¿Con quién va DE?',
    enunciado: 'En el triángulo ABC, D está en AB y E en AC, con m∠ADE = m∠ACB. En la semejanza de ADE con ACB, ¿con qué lado del grande va DE?',
    datos: [D_HOM],
    solucion: [{ texto: 'DE está frente al ángulo A en el chico. En el grande, frente al ángulo A está CB:', ecuacion: junto(['DE va con ', dF('CB')]) }],
    respuesta: ['Con ', dF('CB')] });
  EJ4.push({ nivel: 1, titulo: 'Lo que mide el puntal',
    enunciado: 'Una rampa de 5 m tiene su pie A a 4 m de la pared y sube 3 m. Un puntal perpendicular a la rampa la toca a 2 m de A y baja al piso. ¿Cuánto mide el puntal?',
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'Los 2 m de rampa, junto a A y al recto, van con los 4 m del piso: k = 1/2.' }, { texto: 'El puntal, frente a A, va con la pared, también frente a A:', ecuacion: junto(['puntal = 3 m ÷ 2 = ', dF('1,5 m')]) }],
    respuesta: [dF('1,5 m')] });

  EJ4.push({ nivel: 2, titulo: 'El lado que se repite',
    enunciado: 'En el triángulo ABC, D está en AC, con AD = 4 cm y DC = 5 cm, y m∠ABD = m∠ACB. ¿Cuánto mide AB?',
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'ABD ∼ ACB: comparten el ángulo A y m∠ABD = m∠ACB. AB (frente a D) va con AC (frente a B); AD, con AB:', ecuacion: junto([{ frac: ['AB', '9'] }, ' = ', { frac: ['4', 'AB'] }]) },
      { texto: 'AC = 4 + 5 = 9 cm:', ecuacion: junto(['AB · AB = 36', FL, 'AB = ', dF('6 cm')]) }],
    respuesta: [junto('AB = '), dF('6 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Cruzados con x',
    figura: dibCruz(1.25, { OA: 'x', OC: 'x + 3', AB: '4 cm', CD: '6 cm' }),
    enunciado: `Los segmentos AC y BD se cortan en O, con AB paralela a CD. OA = x, OC = x + 3, AB = 4 y CD = 6, en centímetros. ¿Cuánto mide AC?${NO_ESC}`,
    datos: [D_OPV, D_ALT, D_SEM],
    solucion: [{ texto: 'OAB ∼ OCD, con OA y OC como pareja:', ecuacion: junto([{ frac: ['x', 'x + 3'] }, ' = ', { frac: ['4', '6'] }, FL, '6x = 4x + 12', FL, 'x = 6']) },
      { texto: 'AC = OA + OC:', ecuacion: junto(['6 + 9 = ', dF('15 cm')]) }],
    respuesta: [junto('AC = '), dF('15 cm')] });
  EJ4.push({ nivel: 2, titulo: 'El lado de en medio',
    figura: figO(figAnti(7, 6, 4, { AB: '12 cm', AC: '9 cm', AE: '6 cm', BC: '10 cm', DE: '?' }, { sinEscala: true, marcaE: true, alt: 'Un triángulo ABC con D en AB y E en AC; el ángulo AED es igual al ángulo ABC.' })),
    enunciado: `En el triángulo ABC, AB = 12 cm, AC = 9 cm y BC = 10 cm. D está en AB y E en AC, con AE = 6 cm y m∠AED = m∠ABC. ¿Cuánto mide DE?${NO_ESC}`,
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'AED ∼ ABC: E con B y D con C. AE (frente a D) va con AB (frente a C): k = 6 ÷ 12 = 1/2.' },
      { texto: 'DE está frente a A, como BC:', ecuacion: junto(['DE = 10 cm ÷ 2 = ', dF('5 cm')]) }],
    respuesta: [junto('DE = '), dF('5 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Un cuadrado en el triángulo',
    enunciado: 'Un triángulo tiene una base de 12 cm y una altura de 6 cm sobre ella. Un cuadrado se apoya en la base, con sus dos vértices de arriba en los otros lados. ¿Cuánto mide el lado del cuadrado?',
    datos: [D_PARA, D_SEM, 'En triángulos semejantes, también las alturas se multiplican por k.'],
    solucion: [{ texto: 'El lado de arriba del cuadrado es paralelo a la base: corta un triángulo semejante, de base x y altura 6 − x.', ecuacion: junto([{ frac: ['x', '12'] }, ' = ', { frac: ['6 − x', '6'] }]) },
      { texto: 'En cruz, 6x = 72 − 12x. Se juntan las x:', ecuacion: junto(['18x = 72', FL, 'x = ', dF('4 cm')]) }],
    respuesta: [dF('4 cm')] });
  EJ4.push({ nivel: 2, titulo: 'El puntal desde el piso',
    enunciado: 'Una rampa de 10 m tiene su pie A a 8 m de la pared. Un puntal sale del piso a 3 m de A, perpendicular a la rampa, y la toca en E. ¿Cuánto mide AE?',
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'El triángulo del puntal es rectángulo en E. AE, junto a A y al recto, va con el piso; los 3 m, frente al recto, con la rampa.',
      ecuacion: junto([{ frac: ['AE', dO('8')] }, ' = ', { frac: [dI('3'), dI('10')] }, FL, 'AE = ', dF('2,4 m')]) }],
    respuesta: [junto('AE = '), dF('2,4 m')] });

  // Nivel 3: la correcta en C, A, E, B, D.
  EJ4.push({ nivel: 3, titulo: 'El cuadrado en la esquina',
    enunciado: 'El rectángulo ABCD tiene AB = 12 cm y BC = 6 cm. Un cuadrado tiene un vértice en B, dos lados sobre BA y BC, y el vértice opuesto a B sobre la diagonal AC. ¿Cuánto mide su lado?',
    alternativas: ['6 cm', '3 cm', '4 cm', '8 cm', '2 cm'],
    datos: [D_PARA, D_SEM],
    fuente: 'Modelo de San Marcos 2024-II (pregunta 36), con otros números.',
    solucion: [{ texto: 'Con lado x, el vértice sobre la diagonal deja un triángulo chico con A: base 12 − x y altura x, semejante al ABC (base 12, altura 6).', ecuacion: junto([{ frac: ['x', '6'] }, ' = ', { frac: ['12 − x', '12'] }]) },
      { texto: 'En cruz, 12x = 72 − 6x. Se juntan las x:', ecuacion: junto(['18x = 72', FL, 'x = ', dF('4 cm')]) },
      { texto: '6 cm es BC y 3 cm, su mitad; 8 cm es lo que queda de AB, 12 − 4; 2 cm es 12 ÷ 6.' }],
    respuesta: [dF('4 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Cuadrado sobre la base',
    enunciado: 'Un triángulo tiene una base de 15 cm y una altura de 10 cm sobre ella. Un cuadrado se apoya en la base, con sus dos vértices de arriba en los otros lados. ¿Cuánto mide el lado del cuadrado?',
    alternativas: ['6 cm', '5 cm', '7,5 cm', '12,5 cm', '25 cm'],
    datos: [D_PARA, D_SEM, 'En triángulos semejantes, también las alturas se multiplican por k.'],
    solucion: [{ texto: 'El lado de arriba del cuadrado corta un triángulo semejante de base x y altura 10 − x:', ecuacion: junto([{ frac: ['x', '15'] }, ' = ', { frac: ['10 − x', '10'] }]) },
      { texto: 'Se despeja:', ecuacion: junto(['10x = 150 − 15x', FL, '25x = 150', FL, 'x = ', dF('6 cm')]) },
      { texto: '5 cm y 7,5 cm son media altura y media base; 12,5 cm las promedia; 25 cm las suma.' }],
    respuesta: [dF('6 cm')] });
  EJ4.push({ nivel: 3, titulo: 'El otro tramo',
    enunciado: 'En el triángulo ABC, AB = 6 cm. D está en AC, con AD = 4 cm y m∠ABD = m∠ACB. ¿Cuánto mide DC?',
    alternativas: ['9 cm', '2 cm', '6 cm', '13 cm', '5 cm'],
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'ABD ∼ ACB (el ángulo A común y m∠ABD = m∠ACB): AD va con AB, y AB va con AC.', ecuacion: junto([{ frac: ['4', '6'] }, ' = ', { frac: ['6', 'AC'] }, FL, 'AC = 9 cm']) },
      { texto: 'DC = AC − AD:', ecuacion: junto(['9 − 4 = ', dF('5 cm')]) },
      { texto: '9 cm es AC entero; 2 cm resta 6 − 4; 6 cm copia AB; 13 cm suma AD y AC.' }],
    respuesta: [junto('DC = '), dF('5 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Diagonales cruzadas',
    figura: dibCruz(1.6, { OA: '4 cm', OC: '10 cm', OB: '6 cm' }),
    enunciado: `Los segmentos AC y BD se cortan en O, con AB paralela a CD. OA = 4 cm, OC = 10 cm y OB = 6 cm. ¿Cuánto mide BD?${NO_ESC}`,
    alternativas: ['15 cm', '21 cm', '16 cm', '2,4 cm', '12 cm'],
    datos: [D_OPV, D_ALT, D_SEM],
    solucion: [{ texto: 'OAB ∼ OCD: OA con OC y OB con OD, con k = 10 ÷ 4 = 2,5.', ecuacion: junto(['OD = 2,5 · 6 = 15 cm']) },
      { texto: 'BD = OB + OD:', ecuacion: junto(['6 + 15 = ', dF('21 cm')]) },
      { texto: '15 cm es solo OD; 16 cm suma 6 y 10; 2,4 cm empareja OB con OC; 12 cm suma 6 dos veces.' }],
    respuesta: [junto('BD = '), dF('21 cm')] });
  EJ4.push({ nivel: 3, titulo: 'El puntal de una rampa',
    enunciado: 'Una rampa de 10 m tiene su pie A a 8 m de la pared y sube 6 m. Un puntal perpendicular a la rampa baja al piso a 5 m de A. ¿Cuánto mide el puntal?',
    alternativas: ['3,75 m', '4 m', '6,25 m', '3 m', '2,5 m'],
    datos: [D_ENC, D_HOM, D_SEM],
    solucion: [{ texto: 'El triángulo del puntal (recto donde toca la rampa) y el de la rampa (recto en la pared) comparten el ángulo A: semejantes.' },
      { texto: 'Los 5 m del piso, frente al recto, van con la rampa (10 m): k = 1/2. El puntal, frente a A, va con la pared:', ecuacion: junto(['6 m ÷ 2 = ', dF('3 m')]) },
      { texto: '4 m es el tramo de rampa; 3,75 m y 6,25 m emparejan los 5 m con el piso de 8 m; 2,5 m es su mitad.' }],
    respuesta: [dF('3 m')] });

  // «Ahora tú» de la idea 4. Tipos: la antiparalela; el puntal de la rampa; el lado que se repite (AB · AB = AD · AC);
  // los triángulos cruzados; el cuadrado sobre la base.
  const RAMPAS = [[5, 4, 3], [10, 8, 6], [13, 12, 5], [15, 12, 9], [20, 16, 12], [25, 24, 7], [17, 15, 8]];
  function casoAnti(r) {
    const ab = r.ent(5, 15), ac = r.ent(5, 15), ae = r.ent(2, Math.min(ac, ab) - 1), ad = ae * ac / ab;
    if (ab === ac || !Number.isInteger(4 * ad) || ad >= ab || Math.abs(ad - ae) < 1e-9) return null;
    return { pregunta: `En el triángulo ABC, AB = ${ab} cm y AC = ${ac} cm. D está en AB y E en AC, con AE = ${ae} cm y m∠ADE = m∠ACB. ¿Cuánto mide AD?${NO_ESC}`,
      datos: [D_ENC, D_HOM, D_SEM],
      dibujo: figO(elQueCabe(...[54, 62, 46].map(dc => () => figAnti(7, 6, ae * ac / ab / ab > 0.4 ? 2.6 : 4, { AB: `${ab} cm`, AC: `${ac} cm`, AE: `${ae} cm`, AD: '?' }, { sinEscala: true, distCota: dc })))),
      opciones: ops(ad, r.baraja([
        { id: 'posicion', valor: ae * ab / ac, error: 'GE22', siFuera: 'Usar la semejanza está bien; pero AD/AB = AE/AC vale si DE ∥ BC. Aquí D va con C.' },
        { id: 'igual', valor: ae, error: 'GE-HOM1', siFuera: 'AD = AE solo si el triángulo ADE fuera isósceles; no hay dato para eso.' },
        { id: 'resta', valor: ac - ae, error: 'GE-HOM2', siFuera: 'Restar AC − AE da EC, lo que falta de AC; AD está en el otro lado.' },
        { id: 'db', valor: ab - ad, error: 'GE-THA5', siFuera: `La semejanza está bien: AD = ${fm(ad)} cm. ${fm(ab - ad)} cm es DB.` }]), cm),
      solucion: { texto: 'ADE ∼ ACB: AD (frente a E) va con AC (frente a B), y AE con AB.', ecuacion: junto([`AD = ${ac} · ${ae} ÷ ${ab} = `, dF(cm(ad))]) } };
  }
  function casoPuntal(r) {
    const [AB, AC, BC] = r.de(RAMPAS), k = r.de([0.2, 0.25, 0.4, 0.5, 0.6]), ae = AC * k, ad = AB * k, ed = BC * k;
    if (!Number.isInteger(10 * ae) || !Number.isInteger(10 * ad) || ad >= AC) return null;
    const pideAD = r.ent(0, 1) === 1;
    const x = pideAD ? ad : ed;
    return { pregunta: pideAD ? `Una rampa de ${AB} m tiene su pie A a ${AC} m de la pared. Un puntal perpendicular a la rampa la toca a ${m_(ae)} de A y llega al piso en D. ¿Cuánto mide AD?`
        : `Una rampa de ${AB} m tiene su pie A a ${AC} m de la pared y sube ${BC} m. Un puntal perpendicular a la rampa la toca a ${m_(ae)} de A y baja al piso. ¿Cuánto mide el puntal?`,
      datos: [D_ENC, D_HOM, D_SEM],
      opciones: ops(x, r.baraja(pideAD ? [
        { id: 'posicion', valor: ae * AC / AB, error: 'GE22', siFuera: 'Usar la semejanza está bien; pero AD, frente al recto, va con la rampa, no con el piso.' },
        { id: 'igual', valor: ae, error: 'GE-HOM1', siFuera: 'AD y AE no miden igual: AD es la hipotenusa del triángulo chico.' },
        { id: 'altura', valor: ed, error: 'GE-HOM3', siFuera: `${m_(ed)} es el puntal; AD es lo que hay en el piso de A a D.` },
        { id: 'suma', valor: ae + (AB - AC), error: 'GE-SEM1', siFuera: 'Sumar la diferencia sería si creciera igual; va en la misma razón.' }]
        : [
        { id: 'posicion', valor: ae * BC / AB, error: 'GE22', siFuera: 'Usar la semejanza está bien; pero el tramo de rampa AE va con el piso AC, no con la rampa.' },
        { id: 'ad', valor: ad, error: 'GE-HOM3', siFuera: `${m_(ad)} es AD, en el piso; el puntal está frente al ángulo A.` },
        { id: 'pared', valor: BC, error: 'GE-SEM4', siFuera: `${BC} m es la pared; el puntal es su pareja en el chico, más corta.` },
        { id: 'resta', valor: BC - (AC - ae), error: 'GE-SEM1', siFuera: 'Restar no sirve: el triángulo chico es el grande multiplicado por un número.' }]), m_),
      solucion: { texto: `AE va con AC: k = ${fm(ae)} ÷ ${AC} = ${fm(k)}.`, ecuacion: junto([pideAD ? `AD = ${fm(k)} · ${AB} m = ` : `puntal = ${fm(k)} · ${BC} m = `, dF(m_(x))]) } };
  }
  function casoComun(r) {
    const ad = r.ent(1, 9), ac = r.ent(ad + 1, 25), p = ad * ac, ab = Math.round(Math.sqrt(p));
    if (ab * ab !== p || ab >= ac || ab <= ad) return null;
    return { pregunta: `En el triángulo ABC, D está en AC, con AD = ${ad} cm y DC = ${ac - ad} cm, y m∠ABD = m∠ACB. ¿Cuánto mide AB?`,
      datos: [D_ENC, D_HOM, D_SEM],
      opciones: ops(ab, r.baraja([
        { id: 'media', valor: (ad + ac) / 2, error: 'GE-HOM4', siFuera: 'Ver que AB queda entre AD y AC está bien; pero no es su promedio: AB · AB = AD · AC.' },
        { id: 'ad', valor: ad, error: 'GE-HOM1', siFuera: `${ad} cm es AD; AB es su pareja en el otro triángulo, no la misma medida.` },
        { id: 'dc', valor: ac - ad, error: 'GE-HOM2', siFuera: `${ac - ad} cm es DC; AB sale de la semejanza ABD ∼ ACB.` },
        { id: 'producto', valor: p, error: 'GE-HOM5', siFuera: `AB · AB = ${p} está bien; falta la raíz.` }]), cm),
      solucion: { texto: `ABD ∼ ACB: AB/AC = AD/AB, así que AB · AB = ${ad} · ${ac} = ${p}.`, ecuacion: junto(['AB = ', dF(cm(ab))]) } };
  }
  function casoCruz(r) {
    const a = r.ent(2, 9), k = r.de([1.5, 2, 2.5, 3]), b = r.ent(2, 9), c = a * k, d = b * k;
    if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * d)) return null;
    return { pregunta: `Los segmentos AC y BD se cortan en O, con AB paralela a CD. OA = ${a} cm, OC = ${fm(c)} cm y AB = ${b} cm. ¿Cuánto mide CD?${NO_ESC}`,
      datos: [D_OPV, D_ALT, D_SEM], dibujo: dibCruz(noVacia([1.6, 1.3, 1.8].filter(kk => Math.abs(kk - k) > 0.15), 1.2)[0], { OA: `${a} cm`, OC: `${fm(c)} cm`, AB: `${b} cm`, CD: '?' }),
      opciones: ops(d, r.baraja([
        { id: 'invertida', valor: b * a / c, error: 'GE22', siFuera: 'Usar la razón está bien; pero CD está del lado grande: OC > OA.' },
        { id: 'suma', valor: b + c - a, error: 'GE-SEM1', siFuera: 'Sumar la diferencia sería si creciera igual; crece en la misma razón.' },
        { id: 'oc', valor: c, error: 'GE-HOM3', siFuera: `${fm(c)} cm es OC; CD es la pareja de AB.` },
        { id: 'k', valor: k, error: 'GE-SEM3', siFuera: `${fm(k)} es k; falta multiplicar AB.` }]), cm),
      solucion: { texto: `OAB ∼ OCD (opuestos por el vértice y alternos): k = ${fm(c)} ÷ ${a} = ${fm(k)}.`, ecuacion: junto([`CD = ${fm(k)} · ${b} cm = `, dF(cm(d))]) } };
  }
  function casoCuadrado(r) {
    const b = r.ent(4, 30), h = r.ent(3, 24), x = b * h / (b + h);
    if (!Number.isInteger(2 * x) || b === h) return null;
    return { pregunta: `Un triángulo tiene una base de ${b} cm y una altura de ${h} cm sobre ella. Un cuadrado se apoya en la base, con sus dos vértices de arriba en los otros lados. ¿Cuánto mide su lado?`,
      datos: [D_PARA, D_SEM, 'En triángulos semejantes, también las alturas se multiplican por k.'],
      opciones: ops(x, r.baraja([
        { id: 'promedio', valor: (b + h) / 2, error: 'GE-HOM4', siFuera: 'Promediar no sirve: el lado sale de la semejanza del triángulo de arriba.' },
        { id: 'mitad', valor: Math.min(b, h) / 2, error: 'GE-SEM5', siFuera: 'La mitad no es: el triángulo de arriba tiene base x y altura (altura − x).' },
        { id: 'suma', valor: b + h, error: 'GE-HOM4', siFuera: 'Sumar no sirve: el lado es menor que la base y que la altura.' },
        { id: 'resta', valor: Math.abs(b - h), error: 'GE-SEM1', siFuera: 'Restar no sirve: plantea x/base = (altura − x)/altura.' }]), cm),
      solucion: { texto: `x/${b} = (${h} − x)/${h}, así que ${h}x = ${b * h} − ${b}x.`, ecuacion: junto(['x = ', dF(cm(x))]) } };
  }
  function resuelveEnc(s) {
    const r = azar2(s + 900);
    if (s % 2 === 0) {
      let ad, ac, ab;
      do { ad = r.ent(2, 9); ac = r.ent(ad + 2, 30); ab = Math.round(Math.sqrt(ad * ac)); } while (ab * ab !== ad * ac || ab >= ac || ab <= ad);
      return {
        enunciado: `En el triángulo ABC, AB = ${ab} cm. D está en AC, con AD = ${ad} cm, y m∠ABD = m∠ACB. ¿Cuánto mide AC?`,
        datos: [D_ENC, D_HOM, D_SEM],
        pasos: [
          { tipo: 'pide', texto: 'Piden AC, el lado entero donde está D.' },
          { tipo: 'datos', texto: `AB = ${ab} cm, AD = ${ad} cm, y los ángulos ABD y ACB miden igual.` },
          { tipo: 'regla', texto: 'ABD y ACB comparten el ángulo A y tienen otro igual: son semejantes, con B ↔ C y D ↔ B. AD va con AB, y AB va con AC.', ecuacion: [{ frac: ['AD', 'AB'] }, ' = ', { frac: ['AB', 'AC'] }] },
          { tipo: 'cuentas', texto: `${ad}/${ab} = ${ab}/AC, así que AC = ${ab} · ${ab} ÷ ${ad}.`, ecuacion: junto(['AC = ', dF(cm(ab * ab / ad))]) },
          { tipo: 'sentido', texto: `AB aparece dos veces: en el chico va con AC y en el grande con AD. Comprobación: ${ad} · ${ab * ab / ad} = ${ab * ab} = ${ab} · ${ab}.` },
        ],
        respuesta: [junto('AC = '), dF(cm(ab * ab / ad))] };
    }
    let a, c, b, k;
    do { a = r.ent(2, 8); k = r.de([2, 2.5, 3, 4]); c = a * k; b = r.ent(2, 9); } while (!Number.isInteger(2 * c) || a === b);
    return {
      enunciado: `Los segmentos AC y BD se cortan en O, con AB paralela a CD. OA = ${a} cm, OC = ${fm(c)} cm y OB = ${b} cm. ¿Cuánto mide OD?${NO_ESC}`,
      datos: [D_OPV, D_ALT, D_SEM], dibujo: dibCruz(noVacia([1.6, 1.3, 1.8].filter(kk => Math.abs(kk - k) > 0.15), 1.2)[0], { OA: `${a} cm`, OC: `${fm(c)} cm`, OB: `${b} cm`, OD: '?' }),
      pasos: [
        { tipo: 'pide', texto: 'Piden OD, el tramo de BD que va de O a D.' },
        { tipo: 'datos', texto: `En AC: OA = ${a} cm y OC = ${fm(c)} cm. En BD: OB = ${b} cm.` },
        { tipo: 'regla', texto: 'Los ángulos en O son opuestos por el vértice, y los de A y C, alternos: OAB ∼ OCD, con A ↔ C y B ↔ D.', ecuacion: [{ frac: ['OC', 'OA'] }, ' = ', { frac: ['OD', 'OB'] }] },
          { tipo: 'cuentas', texto: `k = ${fm(c)} ÷ ${a} = ${fm(k)}.`, ecuacion: junto([`OD = ${fm(k)} · ${b} cm = `, dF(cm(b * k))]) },
        { tipo: 'sentido', texto: `OA va con OC aunque estén en la misma recta: los dos están frente a los ángulos alternos. OD > OB, como OC > OA.` },
      ],
      respuesta: [junto('OD = '), dF(cm(b * k))] };
  }

  const PRED4 = 'En el triángulo ABC, AB = 9 cm y AC = 6 cm. D está en AB y E en AC, con AE = 3 cm y m∠ADE = m∠ACB. ¿Cuánto mide AD?';
  const ideaEncajados = {
    id: 'encajados',
    titulo: 'Triángulos encajados y cruzados',
    pregunta: '¿Qué lado va con cuál si un triángulo está encima de otro?',
    temas: ['Criterios de semejanza de triángulos'],
    pieza: GO,
    aprendizaje: 'Dos triángulos con un ángulo común y otro igual son semejantes aunque no haya paralelas; los lados se emparejan por los ángulos.',
    actividad: 'Correr el puntal de una rampa y comparar los tramos de rampa y de piso.',
    // Lee: el objeto y la idea de emparejar por los ángulos (que ya viene de Congruencia). No dice cuánto mide AD en la
    // predicción ni que AD va con AC.
    lee: {
      tarjetas: [
        { titulo: 'La rampa y su puntal', texto: 'La rampa AB, el piso AC y la pared CB forman un triángulo rectángulo. El puntal ED sale de la rampa, perpendicular a ella, y baja al piso: forma otro triángulo, AED, metido dentro del primero. Los dos comparten el ángulo del pie A.',
          pieza: GO, dibujo: figO(figRampa(1.6, { rot: { AB: '5 m', AC: '4 m' }, alt: 'La rampa AB de 5 m con su pie A a 4 m de la pared; el puntal ED baja de la rampa al piso.' })) },
        { titulo: 'Lados homólogos', texto: 'En dos triángulos semejantes, los lados que van en pareja se llaman homólogos. La pareja la deciden los ángulos, no el lugar del dibujo. Aquí un lado del chico está sobre uno del grande. Dos triángulos cruzados, como una X, comparten un vértice.' },
        { titulo: 'Qué mirar al jugar', texto: 'Corre el puntal por la rampa. Mira cuánto miden AE, sobre la rampa, y AD, sobre el piso, y compara cada uno con la rampa y con el piso enteros.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'La rampa AB mide 5 m y su pie A está a 4 m de la pared. El puntal ED es perpendicular a la rampa.',
      mision: { texto: 'Mueve AE hasta que el pie D del puntal quede a 3 m de A.', logrado: v => v.ae === 2.4,
        bien: 'Listo: AD = 3 m con AE = 2,4 m. 3 : 5 es lo mismo que 2,4 : 4.' },
      voz: 'Compara AE con AC y AD con AB.',
      leyenda: [
        { s: dO('AE'), t: 'el tramo de rampa hasta el puntal' },
        { s: dI('AD'), t: 'el tramo de piso hasta el puntal' },
        { s: 'ED', t: 'el puntal, perpendicular a la rampa' },
        { s: dH('marca'), t: 'el ángulo de A, de los dos' },
      ],
      controles: [{ id: 'ae', etiqueta: 'AE, hasta el puntal', min: 1.2, max: 2.8, paso: 0.4, inicio: 1.6, unidad: 'm', decimales: 1, color: 'c-o' }],
      dibujo: v => ({ datos: figRampa(v.ae, { rot: { AE: m_(v.ae), AD: m_(v.ae * 1.25), AB: '5 m', AC: '4 m' } }), estado: {} }),
      lectura: v => [junto([dO('AE'), ' ÷ ', dO('AC'), ` = ${fm(v.ae)} ÷ 4 = ${fm(v.ae / 4)}`]), Y, junto([dI('AD'), ' ÷ ', dI('AB'), ` = ${fm(v.ae * 1.25)} ÷ 5 = ${fm(v.ae / 4)}`])],
      minimo: 3,
    },
    predice: {
      pregunta: `${PRED4}${NO_ESC}`,
      datos: ['AB = 9 cm, AC = 6 cm y AE = 3 cm.', 'El ángulo ADE mide lo mismo que el ángulo ACB.'],
      voz: 'Ahora no hay ángulo recto: solo el ángulo igual y el ángulo A.',
      opciones: [
        { id: 'c', texto: '2 cm', correcta: true },
        { id: 'posicion', texto: '4,5 cm', error: 'GE22', siFuera: 'Usar la razón está bien; pero AD/AB = AE/AC vale si DE ∥ BC. Aquí D va con C.' },
        { id: 'mitad', texto: '3 cm', error: 'GE-HOM1', siFuera: 'AD = AE sería si el triángulo ADE fuera isósceles; no hay dato para eso.' },
        { id: 'resta', texto: '6 cm', error: 'GE-HOM2', siFuera: 'Restar 9 − 3 supone que AD y AE se completan; están en lados distintos.' },
      ],
      dibujo: figO(figAnti(7, 6, 3.43, { AB: '9 cm', AC: '6 cm', AE: '3 cm', AD: '?' }, { sinEscala: true })),
      revelar: figO(figAnti(7, 6, 3.43, { AB: '9 cm', AC: '6 cm', AE: '3 cm', AD: '2 cm' }, { sinEscala: true, alt: 'El mismo triángulo: AD = 2 cm, porque ADE ∼ ACB y AD va con AC.' })),
      coincide: 'Coincide: ADE ∼ ACB, con D frente a E como C frente a B. AD va con AC y AE con AB: AD = 6 · 3 ÷ 9 = 2 cm.',
      noCoincide: 'Revisemos: el ángulo de D es el de C. AD, frente a E, va con AC, frente a B: AD/6 = 3/9, así que AD = 2 cm.',
    },
    mira: {
      pieza: GO,
      datos: figRampa(2.4, { rot: { AE: '2,4 m', AD: '3 m', AB: '5 m', AC: '4 m' }, recto: 0, angulos: 1, alt: 'La rampa y el puntal: los dos triángulos son rectángulos y comparten el ángulo A.' }),
      voz: 'Dos ángulos iguales, y los lados se emparejan por ellos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El puntal es perpendicular a la rampa: AED tiene un recto en E.', ecuacion: junto('m∠E = m∠C = 90°') },
        { estado: { corte: 1 }, texto: 'Los dos triángulos comparten el ángulo A.' },
        { estado: { corte: 1 }, texto: 'Dos ángulos iguales: AED ∼ ACB, con E ↔ C y D ↔ B.' },
        { estado: { corte: 1 }, texto: 'AE, frente a D, va con AC; AD, frente al recto, con AB.', ecuacion: junto([{ frac: [dO('AE'), dO('AC')] }, ' = ', { frac: [dI('AD'), dI('AB')] }]) },
        { estado: { corte: 1 }, texto: 'Con los números: las dos razones valen 0,6.', ecuacion: junto([dO('2,4'), ' ÷ ', dO('4'), ' = ', dI('3'), ' ÷ ', dI('5'), ' = 0,6']) },
      ],
    },
    regla: {
      texto: 'Triángulos con un ángulo común y otro igual son semejantes sin paralelas: ADE ∼ ACB, con DE antiparalela a BC. Cada lado va con el de enfrente de su ángulo igual.',
      ecuacion: [{ frac: [dO('AD'), dO('AC')] }, ' = ', { frac: [dI('AE'), dI('AB')] }, ' = ', { frac: ['DE', 'CB'] }],
      condicion: 'se emparejan los lados frente a ángulos iguales: AD (frente a E) va con AC (frente a B), aunque esté sobre AB.',
      voz: 'Marca los ángulos iguales antes de escribir la razón.',
      dibujo: figO(figAnti(7, 6, 3.43, { AB: 'AB', AC: 'AC', AE: 'AE', AD: 'AD' }, { alt: 'El triángulo ABC con DE antiparalela: el ángulo ADE es igual al ACB.' })),
    },
    mundo: MUNDO4,
    resuelve: { pieza: GO, generar: resuelveEnc },
    ahoraTu: {
      pieza: GO,
      voz: 'Marca los ángulos iguales: cada lado va con el que está frente a su igual.',
      generar(s) { return conCuatro([casoAnti, casoPuntal, casoComun, casoCruz, casoCuadrado][s % 5], azar2(s + 7), firmasDe(EJ4, [PRED4])); },
    },
  };

  // ======================= Idea 5: áreas de figuras semejantes =======================
  // Objeto de la primera pantalla: una foto de 15 cm por 10 cm y su ampliación, con la foto chica repetida adentro de la
  // grande (geo-objeto, escena «semejante», tipo «foto»; dibujo de prueba).
  // Cambia: k, por cuánto se multiplica cada lado. · Permanece: la foto chica. · Progresa: cuántas fotos chicas caben. ·
  // Se reserva: la reducción y la parte de un todo (la predicción, el terreno con su cerco) y el perímetro (la regla). ·
  // Debe verse: k a lo largo y k a lo alto: k · k fotos.
  const FW = 1.5, FH = 1;   // la foto chica: 15 cm por 10 cm (1 = 10 cm)
  // La foto y su ampliación por k (entero: la chica se repite k · k veces). rot: { w1, h1, w2, h2 } (textos de los lados).
  function figFoto(k, rot = {}, o = {}) {
    const x0 = FW + 0.7, W2 = FW * k, H2 = FH * k;
    const pts = { a: [0, 0], b: [FW, 0], c: [FW, FH], d: [0, FH], e: [x0, 0], f: [x0 + W2, 0], g: [x0 + W2, H2], h: [x0, H2], '~arriba': [3, 50], '~izq': [-50, 1], '~der': [50, 1] };
    const letra = Object.fromEntries(Object.keys(pts).map(id => [id, null])), ver = Object.fromEntries(Object.keys(pts).map(id => [id, { sinPunto: true }]));
    const segs = [['a', 'b', { color: 'o' }], ['b', 'c'], ['c', 'd'], ['d', 'a', { color: 'o' }], ['e', 'f', { color: 'i' }], ['f', 'g', { color: 'i' }], ['g', 'h'], ['h', 'e']];
    const lados = [];
    if (rot.w1) lados.push({ de: 'a', a: 'b', texto: rot.w1, color: 'o', ref: '~arriba', dist: 6 });
    if (rot.h1) lados.push({ de: 'd', a: 'a', texto: rot.h1, color: 'o', ref: '~der', dist: 4 });
    if (rot.w2) lados.push({ de: 'e', a: 'f', texto: rot.w2, color: 'i', ref: '~arriba', dist: 6 });
    if (rot.h2) lados.push({ de: 'f', a: 'g', texto: rot.h2, color: 'i', ref: '~izq', dist: 4 });
    const K = o.kMax || 4;
    return sem({ pts, segs, letra, ver, lados, alto: 250, vista: { x: [-1.3, x0 + FW * K + 1.3], y: [-0.75, FH * K + 0.3] },
      obj: { tipo: 'foto', fotos: [{ esquinas: ['a', 'b', 'c', 'd'], copias: 1 }, { esquinas: ['e', 'f', 'g', 'h'], copias: Number.isInteger(k) ? k : 1 }] },
      alt: o.alt || `Una foto de 15 cm por 10 cm y su ampliación, con los lados multiplicados por ${fm(k)}.` });
  }
  // El terreno triangular con un cerco MN paralelo a BC (M en AB, N en AC, AM = t · AB), dibujo de prueba sobre la escena
  // «parcela» (tipo «terreno»). o: { medio: corte (Mira: el punto medio Q de BC y los trazos MQ y NQ), arriba: corte (el
  // triángulo AMN sombreado), rot: { … }, alt }
  function figLindero(t, o = {}) {
    const A = [2.6, 4.4], B = [0, 0], C = [6.2, 0], M = U.mezcla(A, B, t), N = U.mezcla(A, C, t), P = U.medio(B, C);
    const pts = { A, B, C, M, N };
    const segs = [['A', 'M'], ['M', 'B'], ['A', 'N'], ['N', 'C'], ['B', 'C', { paralela: 1 }], ['M', 'N', { grosor: 'variable', paralela: 1 }]];
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, M: { lado: 165 }, N: { lado: 15 } };
    const regiones = [];
    if (o.arriba !== undefined) regiones.push({ puntos: ['A', 'M', 'N'], color: 'o', opacidad: 0.22, desde: o.arriba });
    if (o.medio !== undefined) {
      pts.Q = P; ver.Q = { lado: 270, desde: o.medio };
      segs.push(['M', 'Q', { discontinua: true, desde: o.medio }], ['N', 'Q', { discontinua: true, desde: o.medio }]);
    }
    const lados = [];
    for (const [de, a, k] of [['B', 'C', 'BC'], ['M', 'N', 'MN']]) if ((o.rot || {})[k] !== undefined) lados.push({ de, a, texto: o.rot[k], ref: k === 'BC' ? 'A' : 'B', dist: k === 'BC' ? 6 : 4, en: k === 'BC' ? 0.25 : 0.5 });
    return sem({ pts, segs, ver, fijas: Object.keys(ver), regiones, lados, alto: 240, vista: { x: [-0.9, 7.1], y: [-0.9, 5.1] },
      obj: { objeto: 'parcela', tipo: 'terreno', borde: ['A', 'B', 'C'], estacas: ['A', 'B', 'C'] },
      alt: o.alt || 'Un terreno triangular ABC con un cerco MN paralelo a BC.' });
  }

  // Lector B: el dato dice cuál es S₂.
  const D_AREA = ['Áreas de semejantes con razón k: ', junto([{ frac: [{ sub: ['S', '2'] }, { sub: ['S', '1'] }] }, ' = k²']), ', con S₂ el área de la grande y S₁ la de la chica.'];
  const D_PER = 'Si dos figuras son semejantes con razón k, sus perímetros están en razón k.';
  const D_ATRI = 'Área de un triángulo: base · altura ÷ 2. Área de un rectángulo: base · altura.';
  const D_BM = 'Base media: el segmento que une los puntos medios de dos lados es paralelo al tercero y mide su mitad.';
  const D_RAICES = 'Por un punto interior, paralelas a los lados forman tres triángulos semejantes al grande, de áreas S₁, S₂ y S₃.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 5): 600 cm²; 45 cm²; 2; 36 cm; 150 cm²; 40 m²; 270 m²;
  // 12 cm; 75 soles; 600 cm²; 250 m²; 100 cm²; 54 cm²; 6 cm; 27 h.
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: 'La foto al doble',
    enunciado: 'Una foto de 10 cm por 15 cm se amplía al doble: cada lado se multiplica por 2. ¿Cuál es el área de la foto ampliada?',
    datos: [D_AREA, D_ATRI],
    solucion: [{ texto: 'El área de la chica: 10 · 15 = 150 cm². Con k = 2, el área va por 2² = 4:', ecuacion: junto(['150 cm² · 4 = ', dF('600 cm²')]) }],
    respuesta: [dF('600 cm²')] });
  EJ5.push({ nivel: 1, titulo: 'Triángulos al triple',
    enunciado: 'Dos triángulos son semejantes, y los lados del grande miden el triple que los del chico. El chico tiene 5 cm² de área. ¿Cuál es el área del grande?',
    datos: [D_AREA],
    solucion: [{ texto: 'k = 3, así que el área va por 3² = 9:', ecuacion: junto(['5 cm² · 9 = ', dF('45 cm²')]) }],
    respuesta: [dF('45 cm²')] });
  EJ5.push({ nivel: 1, titulo: 'De las áreas a los lados',
    enunciado: 'Dos cuadrados tienen áreas de 9 cm² y 36 cm². ¿Cuántas veces es más largo el lado del grande?',
    datos: [D_AREA],
    solucion: [{ texto: 'k² = 36 ÷ 9 = 4. El número que, por sí mismo, da 4:', ecuacion: junto(['k = ', dF('2')]) }],
    respuesta: [dF('2 veces')] });
  EJ5.push({ nivel: 1, titulo: 'El perímetro también',
    enunciado: 'Dos triángulos son semejantes con k = 3, del chico al grande. El perímetro del chico mide 12 cm. ¿Cuánto mide el del grande?',
    datos: [D_PER, D_AREA],
    solucion: [{ texto: 'El perímetro es un largo: va por k, no por k².', ecuacion: junto(['12 cm · 3 = ', dF('36 cm')]) }],
    respuesta: [dF('36 cm')] });
  EJ5.push({ nivel: 1, titulo: 'La foto a la mitad',
    enunciado: 'Una foto de 600 cm² se reduce: cada lado queda en la mitad. ¿Cuál es el área de la foto reducida?',
    datos: [D_AREA],
    solucion: [{ texto: 'Con k = 1/2, el área va por (1/2)², o sea, por 1/4:', ecuacion: junto(['600 cm² ÷ 4 = ', dF('150 cm²')]) }],
    respuesta: [dF('150 cm²')] });

  EJ5.push({ nivel: 2, titulo: 'El triángulo de arriba',
    figura: figO(figLindero(1 / 3, { arriba: 0, alt: 'Un terreno triangular ABC con un cerco MN paralelo a BC; el triángulo AMN, arriba, sombreado.' })),
    enunciado: 'Un terreno triangular ABC tiene 360 m². Un cerco MN, paralelo a BC, corta AB en M con AM igual a la tercera parte de AB. ¿Cuál es el área del triángulo AMN?',
    datos: [D_PARA, D_AREA],
    solucion: [{ texto: 'AMN ∼ ABC con k = 1/3: el área va por (1/3)² = 1/9.', ecuacion: junto(['360 m² ÷ 9 = ', dF('40 m²')]) }],
    respuesta: [dF('40 m²')] });
  EJ5.push({ nivel: 2, titulo: 'Lo que queda abajo',
    enunciado: 'Un terreno triangular de 360 m² se parte con un cerco que une los puntos medios de dos lados. ¿Cuál es el área del trapecio que queda abajo?',
    datos: [D_BM, D_AREA],
    solucion: [{ texto: 'El triángulo de arriba es semejante con k = 1/2: su área es la cuarta parte, 90 m².' },
      { texto: 'El trapecio es lo que falta:', ecuacion: junto(['360 − 90 = ', dF('270 m²')]) }],
    respuesta: [dF('270 m²')] });
  EJ5.push({ nivel: 2, titulo: 'Un lado desde las áreas',
    enunciado: 'Dos triángulos semejantes tienen áreas de 50 cm² y 200 cm². Un lado del chico mide 6 cm. ¿Cuánto mide su lado homólogo en el grande?',
    datos: [D_AREA],
    solucion: [{ texto: 'k² = 200 ÷ 50 = 4, así que k = 2.', ecuacion: junto(['6 cm · 2 = ', dF('12 cm')]) }],
    respuesta: [dF('12 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Mayólicas para un patio',
    enunciado: 'Una mayólica cuadrada de 20 cm de lado cuesta 3 soles. ¿Cuánto cuestan las mayólicas para cubrir un cuadrado de 1 m de lado?',
    datos: [D_AREA, '1 m = 100 cm.'],
    solucion: [{ texto: 'k = 100 ÷ 20 = 5: caben 5² = 25 mayólicas.', ecuacion: junto(['25 · 3 = ', dF('75 soles')]) }],
    respuesta: [dF('75 soles')] });
  EJ5.push({ nivel: 2, titulo: 'Una ampliación de 2,5',
    enunciado: 'Una foto tiene 96 cm² de área. Se amplía con cada lado multiplicado por 2,5. ¿Cuál es su nueva área?',
    datos: [D_AREA],
    solucion: [{ texto: 'k² = 2,5 · 2,5 = 6,25:', ecuacion: junto(['96 cm² · 6,25 = ', dF('600 cm²')]) }],
    respuesta: [dF('600 cm²')] });

  // Nivel 3: la correcta en C, A, E, B, D.
  EJ5.push({ nivel: 3, titulo: 'El lindero del terreno',
    enunciado: 'Un terreno triangular de 450 m² se parte con un lindero paralelo a un lado. El triángulo junto al vértice opuesto tiene lados en 2/3 de los del terreno. ¿Cuál es el área de la otra parte?',
    alternativas: ['150 m²', '200 m²', '250 m²', '300 m²', '50 m²'],
    datos: [D_AREA],
    fuente: 'Modelo de San Marcos 2023-II (pregunta 33), con otros números.',
    solucion: [{ texto: 'k = 2/3, así que el triángulo tiene (2/3)² = 4/9 del área:', ecuacion: junto(['450 · 4 ÷ 9 = 200 m²']) },
      { texto: 'La otra parte es el resto:', ecuacion: junto(['450 − 200 = ', dF('250 m²')]) },
      { texto: '200 m² es el triángulo; 300 m² y 150 m² usan 2/3 y 1/3 sin elevar al cuadrado; 50 m² es la novena parte.' }],
    respuesta: [dF('250 m²')] });
  EJ5.push({ nivel: 3, titulo: 'Tres triángulos por un punto',
    enunciado: 'Por un punto interior de un triángulo se trazan paralelas a sus tres lados. Quedan tres triángulos de 4 cm², 9 cm² y 25 cm². ¿Cuál es el área del triángulo grande?',
    alternativas: ['100 cm²', '38 cm²', '76 cm²', '10 cm²', '114 cm²'],
    datos: [D_RAICES, D_AREA, 'Los lados de los tres triángulos chicos, puestos en fila, cubren el lado del grande.'],
    fuente: 'Modelo de San Marcos 2026-I (pregunta 37), con otros números.',
    solucion: [{ texto: 'Con el lado del grande igual a L, los chicos tienen lados aL, bL y cL, con a + b + c = 1. Sus áreas: a²S, b²S y c²S.' },
      { texto: 'Raíces: 2, 3 y 5 son a√S, b√S y c√S, y suman √S:', ecuacion: junto(['√S = 2 + 3 + 5 = 10', FL, 'S = ', dF('100 cm²')]) },
      { texto: '38 cm² suma las áreas; 76 cm² las suma dos veces y 114 cm², tres veces; 10 cm² suma las raíces y no eleva al cuadrado.' }],
    respuesta: [junto('S = '), dF('100 cm²')] });
  EJ5.push({ nivel: 3, titulo: 'Esquinas cortadas',
    enunciado: 'Un triángulo equilátero tiene 81 cm² de área. Se cortan sus tres esquinas con triángulos equiláteros cuyo lado es la tercera parte del lado del grande. ¿Cuál es el área de lo que queda?',
    alternativas: ['27 cm²', '72 cm²', '78 cm²', '63 cm²', '54 cm²'],
    datos: [D_AREA, 'Dos triángulos equiláteros siempre son semejantes.'],
    fuente: 'Modelo de San Marcos 2025-I (pregunta 36), con otros números.',
    solucion: [{ texto: 'Cada esquina es semejante al grande con k = 1/3: su área es la novena parte, 81 ÷ 9 = 9 cm².' },
      { texto: 'Se quitan tres esquinas:', ecuacion: junto(['81 − 3 · 9 = ', dF('54 cm²')]) },
      { texto: '27 cm² es lo cortado; 72 cm² quita una sola esquina; 78 cm² quita 3 cm², la novena parte de 27; 63 cm² quita 18.' }],
    respuesta: [dF('54 cm²')] });
  EJ5.push({ nivel: 3, titulo: 'El lado del chico',
    enunciado: 'Dos triángulos semejantes tienen áreas de 18 cm² y 50 cm². Un lado del grande mide 10 cm. ¿Cuánto mide su lado homólogo en el chico?',
    alternativas: ['3,6 cm', '6 cm', '10 cm', '16,67 cm', '5 cm'],
    datos: [D_AREA],
    solucion: [{ texto: 'k² = 50 ÷ 18 = 25/9, así que k = 5/3, del chico al grande.' },
      { texto: 'El chico es el grande entre k:', ecuacion: junto(['10 · 3 ÷ 5 = ', dF('6 cm')]) },
      { texto: '3,6 cm usa 18/50 sin raíz; 16,67 cm multiplica por 5/3 en vez de dividir; 10 cm copia el lado del grande; 5 cm es su mitad.' }],
    respuesta: [dF('6 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Pintar una pared más grande',
    enunciado: 'Pintar una pared cuadrada de 2 m de lado toma 3 horas. Con la misma pintora y el mismo ritmo, ¿cuánto toma pintar una pared cuadrada de 6 m de lado?',
    alternativas: ['9 h', '18 h', '81 h', '27 h', '12 h'],
    datos: [D_AREA, 'El tiempo es proporcional al área que se pinta.'],
    solucion: [{ texto: 'k = 6 ÷ 2 = 3: el área va por 3² = 9.' },
      { texto: 'Nueve veces más pared, nueve veces más tiempo:', ecuacion: junto(['3 h · 9 = ', dF('27 h')]) },
      { texto: '9 h multiplica por k, como si el área fuera un largo; 18 h por 6; 81 h por 27; 12 h suma 9.' }],
    respuesta: [dF('27 h')] });

  // «Ahora tú» de la idea 5. Tipos: el área desde k; k desde las áreas; el lindero paralelo (triángulo o trapecio); el
  // perímetro y el área juntos; las raíces de áreas.
  function casoAreaK(r) {
    const k = r.de([1.5, 2, 2.5, 3, 4, 5]), S = r.ent(2, 40) * (k === 1.5 || k === 2.5 ? 4 : 1), x = S * k * k;
    return { pregunta: `Dos figuras son semejantes, y cada lado de la grande mide ${fm(k)} veces el de la chica. La chica tiene ${S} cm² de área. ¿Cuál es el área de la grande?`,
      datos: [D_AREA],
      opciones: ops(x, r.baraja([
        { id: 'lineal', valor: S * k, error: 'GE1', siFuera: 'Multiplicar por k está bien para un largo; el área crece a lo largo y a lo ancho: por k².' },
        { id: 'cubo', valor: S * k * k * k, error: 'GE2', siFuera: 'k³ es para el volumen, con tres medidas; el área tiene dos.' },
        { id: 'doble', valor: S * 2 * k, error: 'GE-ARE2', siFuera: 'k² no es 2 · k: es k por k.' },
        { id: 'suma', valor: S + k * k, error: 'GE-ARE3', siFuera: 'k² multiplica el área, no se le suma.' }]), n => `${fm(n)} cm²`),
      solucion: { texto: `k² = ${fm(k)} · ${fm(k)} = ${fm(k * k)}.`, ecuacion: junto([`${S} · ${fm(k * k)} = `, dF(`${fm(x)} cm²`)]) } };
  }
  function casoKArea(r) {
    const k = r.ent(2, 6), S = r.ent(2, 20), l = r.ent(2, 12), S2 = S * k * k;
    return { pregunta: `Dos triángulos semejantes tienen áreas de ${S} cm² y ${S2} cm². Un lado del chico mide ${l} cm. ¿Cuánto mide su lado homólogo en el grande?`,
      datos: [D_AREA],
      opciones: ops(l * k, r.baraja([
        { id: 'sinraiz', valor: l * k * k, error: 'GE1', siFuera: `${k * k} es k², la razón de las áreas; los lados van por k, su raíz.` },
        { id: 'mitad', valor: l * k * k / 2, error: 'GE-ARE4', siFuera: `La raíz de ${k * k} no es su mitad: es ${k}.` },
        { id: 'suma', valor: l + S2 - S, error: 'GE-ARE3', siFuera: 'Sumar la diferencia de áreas a un lado no sirve: se comparan con la razón.' },
        { id: 'raiz', valor: Math.sqrt(S2), error: 'GE-ARE5', siFuera: 'La raíz del área grande no es un lado del triángulo; se usa la razón de las áreas.' }]), cm),
      solucion: { texto: `k² = ${S2} ÷ ${S} = ${k * k}, así que k = ${k}.`, ecuacion: junto([`${l} cm · ${k} = `, dF(cm(l * k))]) } };
  }
  function casoLindero(r) {
    const [p, q] = r.de([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), u = r.ent(2, 12), S = q * q * u, chico = p * p * u, trap = S - chico;
    const pideTrap = r.ent(0, 1) === 1;
    return { pregunta: `Un terreno triangular de ${S} m² se parte con un cerco paralelo a un lado. El triángulo junto al vértice opuesto tiene sus lados en ${p}/${q} de los del terreno. ¿Cuál es el área ${pideTrap ? 'de la otra parte' : 'de ese triángulo'}?`,
      datos: [D_AREA], dibujo: figO(figLindero(p / q, { arriba: 0, alt: `Un terreno triangular ABC con un cerco MN paralelo a BC; el triángulo AMN tiene lados en ${p}/${q} de los del terreno.` })),
      opciones: ops(pideTrap ? trap : chico, r.baraja([
        { id: 'lineal', valor: pideTrap ? S - S * p / q : S * p / q, error: 'GE1', siFuera: `${p}/${q} es la razón de los lados; el área va por (${p}/${q})².` },
        { id: 'otra', valor: pideTrap ? chico : trap, error: 'GE-ARE6', siFuera: 'La cuenta está bien; pero esa es la otra parte del terreno.' },
        { id: 'cubo', valor: pideTrap ? S - S * p * p * p / (q * q * q) : S * p * p * p / (q * q * q), error: 'GE2', siFuera: 'Elevar al cubo es para el volumen; el área va al cuadrado.' },
        { id: 'mitad', valor: S / 2, error: 'GE-ARE1', siFuera: 'Un cerco paralelo no parte el terreno por la mitad: depende de la razón al cuadrado.' }]), n => `${fm(n)} m²`),
      solucion: { texto: `El triángulo: ${S} · (${p}/${q})² = ${chico} m².`, ecuacion: junto(pideTrap ? [`${S} − ${chico} = `, dF(`${trap} m²`)] : ['Su área: ', dF(`${chico} m²`)]) } };
  }
  function casoPerArea(r) {
    const k = r.ent(2, 5), P = r.ent(6, 30), S = r.ent(3, 30), pideP = r.ent(0, 1) === 1;
    const x = pideP ? P * k : S * k * k;
    return { pregunta: `Dos triángulos son semejantes con k = ${k}, del chico al grande. El chico tiene ${P} cm de perímetro y ${S} cm² de área. ¿Cuánto mide ${pideP ? 'el perímetro' : 'el área'} del grande?`,
      datos: [D_PER, D_AREA],
      opciones: ops(x, r.baraja(pideP ? [
        { id: 'cuadrado', valor: P * k * k, error: 'GE-ARE7', siFuera: 'k² es para el área; el perímetro es un largo y va por k.' },
        { id: 'area', valor: S * k * k, error: 'GE-ARE6', siFuera: 'Esa es el área del grande; piden su perímetro.' },
        { id: 'suma', valor: P + k, error: 'GE-ARE3', siFuera: 'k multiplica, no se suma.' },
        { id: 'cubo', valor: P * k * k * k, error: 'GE2', siFuera: 'k³ es para un volumen; el perímetro va por k.' }] : [
        { id: 'lineal', valor: S * k, error: 'GE1', siFuera: 'Por k va el perímetro; el área va por k².' },
        { id: 'per', valor: P * k, error: 'GE-ARE6', siFuera: 'Ese es el perímetro del grande; piden su área.' },
        { id: 'cubo', valor: S * k * k * k, error: 'GE2', siFuera: 'k³ es para un volumen; el área va por k².' },
        { id: 'suma', valor: S + k * k, error: 'GE-ARE3', siFuera: 'k² multiplica el área, no se le suma.' }]), n => (pideP ? cm(n) : `${fm(n)} cm²`)),
      solucion: { texto: pideP ? 'El perímetro es un largo: va por k.' : 'El área va por k².', ecuacion: junto(pideP ? [`${P} · ${k} = `, dF(cm(x))] : [`${S} · ${k * k} = `, dF(`${fm(x)} cm²`)]) } };
  }
  function casoRaices(r) {
    const [a, b, c] = [r.ent(1, 6), r.ent(1, 6), r.ent(1, 7)], S = (a + b + c) ** 2;
    if (a === b || b === c || a === c) return null;
    return { pregunta: `Por un punto interior de un triángulo se trazan paralelas a sus tres lados. Quedan tres triángulos de ${a * a} cm², ${b * b} cm² y ${c * c} cm². ¿Cuál es el área del triángulo grande?`,
      datos: [D_RAICES, D_AREA, 'Los lados de los tres triángulos chicos, puestos en fila, cubren el lado del grande.'],
      opciones: ops(S, r.baraja([
        { id: 'suma', valor: a * a + b * b + c * c, error: 'GE-ARE8', siFuera: 'Sumar las áreas no alcanza: faltan los paralelogramos. Se suman las raíces.' },
        { id: 'raices', valor: a + b + c, error: 'GE-ARE5', siFuera: `La suma de las raíces, ${a + b + c}, es √S: falta elevar al cuadrado.` },
        { id: 'doble', valor: 2 * (a * a + b * b + c * c), error: 'GE-ARE8', siFuera: 'Duplicar la suma de áreas no sirve: se suman las raíces y se eleva al cuadrado.' },
        { id: 'tres', valor: 3 * (a * a + b * b + c * c), error: 'GE-ARE8', siFuera: 'Triplicar la suma de áreas no sirve: se suman las raíces y se eleva al cuadrado.' }]), n => `${fm(n)} cm²`),
      solucion: { texto: `√S = ${a} + ${b} + ${c} = ${a + b + c}.`, ecuacion: junto(['S = ', dF(`${S} cm²`)]) } };
  }
  function resuelveArea(s) {
    const r = azar2(s + 900);
    if (s % 2 === 0) {
      const [p, q] = r.de([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5]]), u = r.ent(3, 15), S = q * q * u, chico = p * p * u;
      return {
        enunciado: `Un terreno triangular tiene ${S} m². Un cerco paralelo a un lado deja, junto al vértice opuesto, un triángulo con lados en ${p}/${q} de los del terreno. ¿Cuánto mide el resto?`,
        datos: [D_AREA, D_PARA], dibujo: figO(figLindero(p / q, { arriba: 0, alt: `Un terreno triangular ABC con un cerco MN paralelo a BC; el triángulo AMN tiene lados en ${p}/${q} de los del terreno.` })),
        pasos: [
          { tipo: 'pide', texto: 'Piden el área del resto: el terreno menos el triángulo chico.' },
          { tipo: 'datos', texto: `Terreno: ${S} m². El triángulo chico es semejante al terreno con k = ${p}/${q}.` },
          { tipo: 'regla', texto: 'Si los lados van por k, el área va por k².', ecuacion: [{ frac: [{ sub: ['S', '2'] }, { sub: ['S', '1'] }] }, ' = k²'] },
          { tipo: 'cuentas', texto: `El triángulo tiene ${chico} m²: ${S} · (${p}/${q})², o sea, ${S} · ${p * p}/${q * q}.`, ecuacion: junto([`${S} − ${chico} = `, dF(`${S - chico} m²`)]) },
          { tipo: 'sentido', texto: `El triángulo tiene ${p}/${q} de los lados pero solo ${p * p}/${q * q} del área: con lados más chicos, el área se achica más.` },
        ],
        respuesta: ['El resto mide ', dF(`${S - chico} m²`)] };
    }
    const k = r.de([2, 3, 4]), w = r.de([10, 12, 15, 20]), h = r.de([8, 10, 12]);
    const S1 = w * h, S2 = S1 * k * k;
    return {
      enunciado: `Una foto de ${w} cm por ${h} cm se amplía y queda de ${w * k} cm por ${h * k} cm. ¿Cuántas veces creció su área?`,
      datos: [D_AREA, D_ATRI],
      pasos: [
        { tipo: 'pide', texto: 'Piden cuántas veces cabe el área chica en la grande.' },
        { tipo: 'datos', texto: `Los lados pasan de ${w} a ${w * k} cm y de ${h} a ${h * k} cm: los dos se multiplican por k = ${k}.` },
        { tipo: 'regla', texto: 'Las dos fotos son semejantes con razón k: sus áreas, con razón k².', ecuacion: [{ frac: [{ sub: ['S', '2'] }, { sub: ['S', '1'] }] }, ' = k²'] },
        { tipo: 'cuentas', texto: `k² = ${k} · ${k} = ${k * k}.`, ecuacion: junto([`${S2} cm² ÷ ${S1} cm² = `, dF(`${k * k}`)]) },
        { tipo: 'sentido', texto: `Caben ${k} fotos a lo largo y ${k} a lo alto: ${k} · ${k} = ${k * k} fotos chicas.` },
      ],
      respuesta: ['El área creció ', dF(`${k * k} veces`)] };
  }

  const PRED5 = 'Un terreno triangular se parte con un cerco paralelo a un lado, que une los puntos medios de los otros dos. ¿Qué parte del terreno queda en el triángulo de arriba?';
  const ideaArea = {
    id: 'area-y-escala',
    titulo: 'Áreas de figuras semejantes',
    pregunta: '¿Cuánto crece el área de una foto ampliada?',
    temas: ['Razón de áreas de figuras semejantes'],
    pieza: GO,
    aprendizaje: 'Si los lados se multiplican por k, el perímetro se multiplica por k y el área por k².',
    actividad: 'Ampliar una foto y contar cuántas fotos chicas caben en la grande.',
    // Lee: área y ampliación. No dice cuántas fotos caben (el juego) ni qué parte queda en el terreno (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Una foto que se amplía', texto: 'Una foto de 15 cm por 10 cm se amplía: cada lado se multiplica por el mismo número k. La foto grande es semejante a la chica, con razón k.',
          pieza: GO, dibujo: figO(figFoto(1.5, { w1: '15 cm', h1: '10 cm' }, { alt: 'Una foto de 15 cm por 10 cm y una ampliación suya, más grande.' })) },
        { titulo: 'Área', texto: 'El área es cuánta superficie cubre una figura. Se mide en cuadraditos: cm² es un cuadradito de 1 cm de lado. La foto de 15 cm por 10 cm cubre 15 · 10 = 150 cm².' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia k y cuenta cuántas fotos chicas caben en la grande. Compara ese número con k. Aquí solo hay áreas; el volumen de un cuerpo se ve en otra unidad.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'Una foto de 15 cm por 10 cm se amplía: cada lado se multiplica por k. Adentro de la grande se repite la chica.',
      mision: { texto: 'Amplía la foto hasta que tenga 9 veces el área de la chica.', logrado: v => v.k === 3,
        bien: 'Listo: con k = 3 caben 3 fotos a lo largo y 3 a lo alto.' },
      voz: 'Cuenta las fotos chicas y compáralas con k.',
      leyenda: [
        { s: dO('15 cm'), t: 'un lado de la chica' },
        { s: dI('30 cm'), t: 'un lado de la grande' },
        { s: 'k', t: 'por cuánto se multiplica cada lado' },
      ],
      controles: [{ id: 'k', etiqueta: 'k, por cuánto se multiplica cada lado', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: figFoto(v.k, { w1: '15 cm', h1: '10 cm', w2: `${15 * v.k} cm`, h2: `${10 * v.k} cm` }), estado: {} }),
      lectura: v => [`lados × ${v.k}: caben ${v.k * v.k} fotos chicas, área × ${v.k * v.k}`],
      minimo: 3,
    },
    predice: {
      pregunta: PRED5,
      datos: ['El cerco es paralelo al lado de abajo, BC.', 'M y N son los puntos medios de AB y AC.'],
      voz: 'Ahora la figura se achica, y se pregunta por una parte del todo.',
      opciones: [
        { id: 'c', texto: 'La cuarta parte', correcta: true },
        { id: 'mitad', texto: 'La mitad', error: 'GE1', siFuera: 'Los lados quedan en la mitad, sí; pero el área se achica a lo largo y a lo ancho.' },
        { id: 'tercio', texto: 'La tercera parte', error: 'GE-ARE1', siFuera: 'Ver que el de arriba es más chico está bien; pero no es un tercio: caben cuatro iguales.' },
        { id: 'octavo', texto: 'La octava parte', error: 'GE2', siFuera: 'Achicar más que los lados está bien; pero un octavo es para volúmenes, con tres medidas.' },
      ],
      dibujo: figO(figLindero(0.5, { alt: 'Un terreno triangular ABC; el cerco MN une los puntos medios de AB y AC.' })),
      revelar: figO(figLindero(0.5, { medio: 0, arriba: 0, alt: 'El terreno partido en cuatro triángulos iguales por el cerco MN y los trazos al punto medio Q de BC: el de arriba es uno de cuatro.' })),
      coincide: 'Coincide: con los trazos al punto medio de BC, el terreno queda en cuatro triángulos iguales. El de arriba es uno: la cuarta parte.',
      noCoincide: 'Revisemos: los lados del de arriba son la mitad, a lo largo y a lo ancho. Caben cuatro como él en el terreno: es la cuarta parte.',
    },
    mira: {
      pieza: GO,
      datos: figLindero(0.5, { medio: 1, arriba: 2, rot: { BC: '2 · MN' }, alt: 'El terreno ABC con el cerco MN entre los puntos medios; desde el punto medio Q de BC, los trazos QM y QN lo parten en cuatro triángulos iguales.' }),
      voz: 'Partimos el terreno en triángulos iguales y contamos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'MN une los puntos medios: es paralela a BC y mide su mitad.', ecuacion: junto('BC = 2 · MN') },
        { estado: { corte: 1 }, texto: 'Con el punto medio Q de BC salen cuatro triángulos iguales.' },
        { estado: { corte: 2 }, texto: 'El de arriba, AMN, es uno de los cuatro.', ecuacion: junto(['k = 1/2', FL, 'área ÷ 4']) },
        { estado: { corte: 2 }, texto: 'Base por k y altura por k: el área va por k · k.', ecuacion: junto([{ frac: [{ sub: ['S', '2'] }, { sub: ['S', '1'] }] }, ' = k · k = k²']) },
      ],
    },
    regla: {
      texto: 'Si dos figuras son semejantes con razón k, sus perímetros están en razón k y sus áreas en razón k².',
      ecuacion: [junto([{ frac: ['perímetro grande', 'perímetro chico'] }, ' = k']), Y, junto([{ frac: [{ sub: ['S', '2'] }, { sub: ['S', '1'] }] }, ' = k²'])],
      condicion: 'k es la razón de dos lados homólogos, de la grande a la chica; S₂ es el área de la grande.',
      voz: 'Antes de multiplicar, pregúntate si mides un largo o un área.',
      dibujo: figO(figFoto(2, { w1: '15 cm', h1: '10 cm', w2: '30 cm', h2: '20 cm' }, { kMax: 2, alt: 'La foto chica y su ampliación por 2: caben 4 fotos chicas.' })),
    },
    mundo: MUNDO5,
    resuelve: { pieza: GO, generar: resuelveArea },
    ahoraTu: {
      pieza: GO,
      voz: 'Un largo va por k; un área, por k².',
      generar(s) { return conCuatro([casoAreaK, casoKArea, casoLindero, casoPerArea, casoRaices][s % 5], azar2(s + 7), firmasDe(EJ5, [PRED5])); },
    },
  };

  // ======================= Idea 6: Ceva y Menelao =======================
  // Objeto de la primera pantalla: el terreno triangular con estacas en las esquinas (geo-objeto, escena «parcela», tipo
  // «terreno», de Polígonos; no se toca), con tres caminos rectos que salen de las esquinas y se cruzan en el pozo P.
  // Cambia: dónde llegan los caminos de A y de B. · Permanece: el terreno. · Progresa: dónde llega el camino de C. · Se
  // reserva: la recta que corta un lado por fuera (la predicción, Menelao). · Debe verse: el producto de las tres razones
  // es 1, siempre.
  // Sin puntos notables (encargo, 19 nov): los caminos son cevianas cualesquiera; ninguna figura usa medianas, alturas ni
  // bisectrices que se cortan.
  const TA6 = [2.4, 4.6], TB6 = [0, 0], TC6 = [6.4, 0];
  // Una razón escrita como fracción reducida (n/d) o entero.
  const fr = (n, d) => { const g = mcd(n, d); n /= g; d /= g; return d === 1 ? `${n}` : `${n}/${d}`; };
  // El terreno con tres caminos que concurren. d = [n, m]: BD : DC = n : m; e = [n, m]: CE : EA = n : m. F sale de Ceva.
  //   o: { rot: { AF, FB, BD, DC, CE, EA } (textos), terreno: true, sinEscala, alt, letras: false (sin P) }
  function figCeva(d, e, o = {}) {
    const rot = o.rot || {};
    const D = U.mezcla(TB6, TC6, d[0] / (d[0] + d[1])), E = U.mezcla(TC6, TA6, e[0] / (e[0] + e[1]));
    const P = U.corte(TA6, D, TB6, E), F = U.corte(TC6, P, TA6, TB6);
    const pts = { A: TA6, B: TB6, C: TC6, D, E, F, P };
    const col = (k, base) => (rot[k] === '?' || (rot[k] === undefined && !o.colores) ? undefined : base);
    const segs = [['A', 'F', { color: col('AF', 'o'), grosor: 'variable' }], ['F', 'B', { color: col('FB', 'i'), grosor: 'variable' }], ['B', 'D', { color: col('BD', 'o'), grosor: 'variable' }],
      ['D', 'C', { color: col('DC', 'i'), grosor: 'variable' }], ['C', 'E', { color: col('CE', 'o'), grosor: 'variable' }], ['E', 'A', { color: col('EA', 'i'), grosor: 'variable' }],
      ['A', 'P', { grosor: 'fino' }], ['P', 'D', { grosor: 'fino' }], ['B', 'P', { grosor: 'fino' }], ['P', 'E', { grosor: 'fino' }], ['C', 'P', { grosor: 'fino' }], ['P', 'F', { grosor: 'fino' }]];
    const lados = [];
    for (const [de, a, k, b, ref] of [['A', 'F', 'AF', 'o', 'C'], ['F', 'B', 'FB', 'i', 'C'], ['B', 'D', 'BD', 'o', 'A'], ['D', 'C', 'DC', 'i', 'A'], ['C', 'E', 'CE', 'o', 'B'], ['E', 'A', 'EA', 'i', 'B']])
      if (rot[k] !== undefined) lados.push({ de, a, texto: rot[k], color: col(k, b), ref, dist: 4 });
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, D: { lado: 270 }, E: { lado: 45 }, F: { lado: 150 }, P: { lejos: o.lejosP !== undefined ? o.lejosP : 4 } };
    // En el juego, con BD : DC = 3 : 1 y CE = EA el pozo queda pegado a dos caminos y su rótulo no cabe.
    const letra = o.letras === false ? { P: null } : {};
    const hacia = q => U.grados(Math.atan2(q[1] - P[1], q[0] - P[0]));
    const evita = { P: [TA6, TB6, TC6, D, E, F].map(hacia) };
    return sem({ pts, segs, ver, letra, lados, evita, fijas: Object.keys(ver).filter(id => id !== 'P'), alto: 240, vista: { x: [-1, 7.4], y: [-0.9, 5.3] }, sinEscala: o.sinEscala,
      obj: o.terreno ? { objeto: 'parcela', tipo: 'terreno', borde: ['A', 'B', 'C'], estacas: ['A', 'B', 'C', 'P'] } : { tipo: 'examen' },
      alt: o.alt || 'Un triángulo ABC con tres cevianas, AD, BE y CF, que se cortan en P.' });
  }
  // Menelao: una recta corta AB en F, BC en D y la prolongación de CA, más allá de A, en E. f = AF/(AF + FB) y d = BD/(BD + DC)
  // (fracciones dibujadas). o: { paralela: corte (Mira: la paralela por C a la recta, que corta AB en G), rot, sinEscala, alt }
  function figMene(f, d, o = {}) {
    const rot = o.rot || {};
    const A = [2.4, 3.6], B = [0, 0], C = [6.4, 0], F = U.mezcla(A, B, f), D = U.mezcla(B, C, d), E = U.corte(F, D, C, A);
    const pts = { A, B, C, D, E, F };
    const col = (k, base) => (rot[k] === '?' || (rot[k] === undefined && !o.colores) ? undefined : base);
    const segs = [['A', 'F', { color: col('AF', 'o'), grosor: 'variable' }], ['F', 'B', { color: col('FB', 'i'), grosor: 'variable' }], ['B', 'D', { color: col('BD', 'o'), grosor: 'variable' }],
      ['D', 'C', { color: col('DC', 'i'), grosor: 'variable' }], ['C', 'A', { grosor: 'variable' }], ['A', 'E', { discontinua: true }],
      ['E', 'D', { grosor: 'variable' }]];
    // Con E más allá de C, la recta AE pasa por C: su letra va abajo, no sobre la recta (auditoría, 20 nov).
    const masC = U.dist(A, E) > U.dist(A, C);
    const ver = { A: { lado: o.paralela !== undefined ? 7 : 45 }, B: { lado: 225 }, C: { lado: masC ? 40 : 315 }, D: { lado: 270 }, E: { lado: masC ? 330 : 90 }, F: { lado: 200 } };
    if (o.paralela !== undefined) {
      const G = U.corte(C, [C[0] + D[0] - E[0], C[1] + D[1] - E[1]], A, B);
      pts.G = G; ver.G = { lado: 160, desde: o.paralela };
      segs.push(['C', 'G', { discontinua: true, desde: o.paralela }], ['A', 'G', { discontinua: true, grosor: 'fino', desde: o.paralela }]);
    }
    const lados = [];
    for (const [de, a, k, b, ref] of [['A', 'F', 'AF', 'o', 'C'], ['F', 'B', 'FB', 'i', 'C'], ['B', 'D', 'BD', 'o', 'A'], ['D', 'C', 'DC', 'i', 'A'], ['C', 'E', 'CE', 'o', 'B'], ['E', 'A', 'EA', 'i', 'B']])
      if (rot[k] !== undefined) lados.push({ de, a, texto: rot[k], color: col(k, b), ref, dist: 4 });
    const xs = Object.values(pts).map(p => p[0]), ys = Object.values(pts).map(p => p[1]);
    // F está sobre la recta ED: su letra esquiva también esa recta.
    const haciaF = q => U.grados(Math.atan2(q[1] - F[1], q[0] - F[0]));
    return sem({ pts, segs, ver, lados, fijas: Object.keys(ver).filter(id => id !== 'F'), evita: { F: [haciaF(E), haciaF(D)] }, alto: 250, sinEscala: o.sinEscala,
      vista: { x: [Math.min(...xs) - 0.9, Math.max(...xs) + 0.9], y: [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9] },
      alt: o.alt || 'Un triángulo ABC y una recta que corta AB en F, BC en D y la prolongación de CA en E.' });
  }
  // La regla, con sus dos casos lado a lado (como la de Thales): Ceva a la izquierda, Menelao a la derecha.
  function figReglaCM() {
    const k = 0.62, desp = (p, dx) => [p[0] * k + dx, p[1] * k];
    const A = desp(TA6, 0), B = desp(TB6, 0), C = desp(TC6, 0);
    const D = U.mezcla(B, C, 0.6), E = U.mezcla(C, A, 0.5), P = U.corte(A, D, B, E), F = U.corte(C, P, A, B);
    const A2 = [8.6, 2.6], B2 = [6.6, 0], C2 = [10.6, 0], F2 = U.mezcla(A2, B2, 0.25), D2 = U.mezcla(B2, C2, 0.5), E2 = U.corte(F2, D2, C2, A2);
    const pts = { A, B, C, D, E, F, P, A2, B2, C2, D2, E2, F2 };
    const segs = [['A', 'F', { color: 'o', grosor: 'variable' }], ['F', 'B', { color: 'i', grosor: 'variable' }], ['B', 'D', { color: 'o', grosor: 'variable' }], ['D', 'C', { color: 'i', grosor: 'variable' }],
      ['C', 'E', { color: 'o', grosor: 'variable' }], ['E', 'A', { color: 'i', grosor: 'variable' }], ['A', 'D', { grosor: 'fino' }], ['B', 'E', { grosor: 'fino' }], ['C', 'F', { grosor: 'fino' }],
      ['A2', 'F2', { color: 'o', grosor: 'variable' }], ['F2', 'B2', { color: 'i', grosor: 'variable' }], ['B2', 'D2', { color: 'o', grosor: 'variable' }], ['D2', 'C2', { color: 'i', grosor: 'variable' }],
      ['C2', 'A2', { grosor: 'variable' }], ['A2', 'E2', { discontinua: true }], ['E2', 'D2', { grosor: 'variable' }]];
    const letra = { A2: 'A', B2: 'B', C2: 'C', D2: 'D', E2: 'E', F2: 'F', P: null };
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, D: { lado: 270 }, E: { lado: 45 }, F: { lado: 150 }, P: { lejos: 5 },
      A2: { lado: 45 }, B2: { lado: 225 }, C2: { lado: 315 }, D2: { lado: 270 }, E2: { lado: 90 }, F2: { lado: 200 } };
    const hacia = (de, q) => U.grados(Math.atan2(q[1] - de[1], q[0] - de[0]));
    const evita = { P: [A, B, C, D, E, F].map(q => hacia(P, q)), F2: [hacia(F2, E2), hacia(F2, D2)] };
    const xs = Object.values(pts).map(p => p[0]), ys = Object.values(pts).map(p => p[1]);
    return sem({ pts, segs, letra, ver, evita, fijas: Object.keys(ver).filter(id => id !== 'P' && id !== 'F2'), alto: 230, vista: { x: [Math.min(...xs) - 0.7, Math.max(...xs) + 0.7], y: [Math.min(...ys) - 0.7, Math.max(...ys) + 0.7] },
      alt: 'Dos figuras: a la izquierda, tres cevianas AD, BE y CF que se cortan en P; a la derecha, una recta que corta AB en F, BC en D y la prolongación de CA en E.' });
  }

  const D_CEVA = ['Ceva: AD, BE y CF concurren si y solo si ', junto([{ frac: ['AF', 'FB'] }, ' · ', { frac: ['BD', 'DC'] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1']), '.'];
  // Auditoría (20 nov): Menelao va en un solo sentido. Con largos sin signo, «si el producto vale 1, están alineados» es
  // falso (los tres puntos medios dan 1 y no están alineados: es Ceva). Lo que distingue los dos casos es un punto afuera.
  // El producto va al principio: al final se partía después de «·» (ecuaciones-ancho).
  const D_MENE = ['Menelao: ', junto([{ frac: ['AF', 'FB'] }, ' · ', { frac: ['BD', 'DC'] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1']), ' con F, D y E en una recta (en AB, BC y CA alargado).'];
  const D_LARGOS = 'Cada tramo se mide como un largo, sin signo.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 6): 1/6; 2 cm; 5 cm (E en el medio); sí; 1/2; 6 cm; 6 cm; 8 cm; 1 : 2; 10 cm;
  // 6 cm (auditoría: AC = 11); 6 cm; 10 cm (auditoría: 9, 4, 2 y 3); 2 cm; 21 cm.
  const EJ6 = [];
  EJ6.push({ nivel: 1, titulo: 'La tercera razón',
    enunciado: 'En el triángulo ABC, las cevianas AD, BE y CF pasan por un mismo punto. AF/FB = 2 y BD/DC = 3. ¿Cuánto vale CE/EA?',
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva: el producto de las tres razones vale 1.', ecuacion: junto(['2 · 3 · ', { frac: ['CE', 'EA'] }, ' = 1', FL, { frac: ['CE', 'EA'] }, ' = ', dF('1/6')]) }],
    respuesta: [junto('CE/EA = '), dF('1/6')] });
  EJ6.push({ nivel: 1, titulo: 'Un tramo con Ceva',
    figura: figO(figCeva([1, 1], [1, 2], { rot: { AF: '2 cm', FB: '4 cm', BD: '3 cm', DC: '3 cm', CE: '4 cm', EA: '?' }, sinEscala: true })),
    enunciado: `Las cevianas AD, BE y CF del triángulo ABC pasan por P. AF = 2 cm, FB = 4 cm, BD = DC = 3 cm y CE = 4 cm. ¿Cuánto mide EA?${NO_ESC}`,
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva, dando la vuelta:', ecuacion: junto([{ frac: [dO('2'), dI('4')] }, ' · ', { frac: [dO('3'), dI('3')] }, ' · ', { frac: [dO('4'), 'EA'] }, ' = 1']) },
      { texto: 'Se despeja:', ecuacion: junto(['2 ÷ EA = 1', FL, 'EA = ', dF('2 cm')]) }],
    respuesta: [junto('EA = '), dF('2 cm')] });
  EJ6.push({ nivel: 1, titulo: 'Dónde cae E',
    figura: figO(figCeva([1, 1], [1, 2], { rot: { AF: '3 cm', FB: '2 cm', BD: '4 cm', DC: '6 cm', CE: '?' }, sinEscala: true })),
    enunciado: `Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = 3 cm, FB = 2 cm, BD = 4 cm, DC = 6 cm y CA = 10 cm. ¿Cuánto mide CE?${NO_ESC}`,
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['3', '2'] }, ' · ', { frac: ['4', '6'] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1', FL, '1 · ', { frac: ['CE', 'EA'] }, ' = 1']) },
      { texto: 'CE = EA: E está en el medio de CA.', ecuacion: junto(['CE = 10 cm ÷ 2 = ', dF('5 cm')]) }],
    respuesta: [junto('CE = '), dF('5 cm')] });
  EJ6.push({ nivel: 1, titulo: '¿Pasan por un punto?',
    enunciado: 'En el triángulo ABC, AF : FB = 1 : 2, BD : DC = 2 : 3 y CE : EA = 3 : 1. ¿Las cevianas AD, BE y CF pasan por un mismo punto?',
    datos: [D_CEVA],
    solucion: [{ texto: 'Se multiplica dando la vuelta:', ecuacion: junto([{ frac: ['1', '2'] }, ' · ', { frac: ['2', '3'] }, ' · ', { frac: ['3', '1'] }, ' = 1']) },
      { texto: ['Vale 1: ', dF('sí pasan por un mismo punto'), '.'] }],
    respuesta: [dF('Sí'), ': el producto vale 1'] });
  EJ6.push({ nivel: 1, titulo: 'La razón con Menelao',
    enunciado: 'Una recta corta AB en F, BC en D y la prolongación de CA en E. AF/FB = 1/2 y BD/DC = 4. ¿Cuánto vale CE/EA?',
    datos: [D_MENE, D_LARGOS],
    solucion: [{ texto: 'Menelao:', ecuacion: junto([{ frac: ['1', '2'] }, ' · 4 · ', { frac: ['CE', 'EA'] }, ' = 1', FL, '2 · ', { frac: ['CE', 'EA'] }, ' = 1', FL, { frac: ['CE', 'EA'] }, ' = ', dF('1/2')]) }],
    respuesta: [junto('CE/EA = '), dF('1/2')] });

  EJ6.push({ nivel: 2, titulo: 'Con el lado entero',
    enunciado: 'Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = 3 cm, FB = 6 cm, BD = 4 cm, DC = 2 cm y AC = 12 cm. ¿Cuánto mide CE?',
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['3', '6'] }, ' · ', { frac: ['4', '2'] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1', FL, { frac: ['CE', 'EA'] }, ' = 1']) },
      { texto: 'CE y EA miden igual, y suman 12 cm:', ecuacion: junto(['CE = ', dF('6 cm')]) }],
    respuesta: [junto('CE = '), dF('6 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Un punto por fuera',
    enunciado: 'F está en AB y D en BC; la recta FD corta la prolongación de CA en E, más allá de A. AF = 2 cm, FB = 4 cm, BD = DC = 3 cm y CA = 6 cm. ¿Cuánto mide EA?',
    datos: [D_MENE, D_LARGOS],
    solucion: [{ texto: 'Menelao:', ecuacion: junto([{ frac: [dO('2'), dI('4')] }, ' · ', { frac: [dO('3'), dI('3')] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1', FL, 'CE = 2 · EA']) },
      { texto: 'E está más allá de A: CE = EA + 6.', ecuacion: junto(['EA + 6 = 2 · EA', FL, 'EA = ', dF('6 cm')]) }],
    respuesta: [junto('EA = '), dF('6 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Un tramo con x',
    figura: figO(figCeva([1, 1], [1, 1], { rot: { AF: 'x', FB: '6 cm', BD: '3 cm', DC: '2 cm', CE: '4 cm', EA: '2 cm' }, sinEscala: true })),
    enunciado: `Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = x, FB = 6, BD = 3, DC = 2, CE = 4 y EA = 2, en centímetros. ¿Cuánto mide AB?${NO_ESC}`,
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['x', '6'] }, ' · ', { frac: ['3', '2'] }, ' · ', { frac: ['4', '2'] }, ' = 1']) },
      { texto: '3/2 · 4/2 = 3, así que x/6 · 3 = 1:', ecuacion: junto(['x ÷ 2 = 1', FL, 'x = 2']) },
      { texto: 'AB = AF + FB:', ecuacion: junto(['2 + 6 = ', dF('8 cm')]) }],
    respuesta: [junto('AB = '), dF('8 cm')] });
  EJ6.push({ nivel: 2, titulo: 'La razón en el tercer lado',
    enunciado: 'En el triángulo ABC, las cevianas AD, BE y CF pasan por un punto, con BD : DC = 3 : 1 y CE : EA = 2 : 3. ¿En qué razón parte F al lado AB?',
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['AF', 'FB'] }, ' · 3 · ', { frac: ['2', '3'] }, ' = 1', FL, { frac: ['AF', 'FB'] }, ' · 2 = 1']) },
      { texto: 'Se despeja:', ecuacion: junto(['AF : FB = ', dF('1 : 2')]) }],
    respuesta: [junto('AF : FB = '), dF('1 : 2')] });
  EJ6.push({ nivel: 2, titulo: 'Afuera, del lado de B',
    enunciado: 'Una recta corta AB en F, CA en E y la prolongación de BC, más allá de B, en D. AF/FB = 3, CE/EA = 1/2 y BC = 5 cm. ¿Cuánto mide BD?',
    datos: [D_MENE, D_LARGOS],
    solucion: [{ texto: 'Menelao:', ecuacion: junto(['3 · ', { frac: ['BD', 'DC'] }, ' · ', { frac: ['1', '2'] }, ' = 1', FL, { frac: ['BD', 'DC'] }, ' = ', { frac: ['2', '3'] }]) },
      { texto: 'D está más allá de B: DC = BD + 5.', ecuacion: junto(['3 · BD = 2 · (BD + 5)', FL, 'BD = ', dF('10 cm')]) }],
    respuesta: [junto('BD = '), dF('10 cm')] });

  // Nivel 3: la correcta en C, A, E, B, D.
  EJ6.push({ nivel: 3, titulo: 'El tramo del tercer lado',
    enunciado: 'Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = 4 cm, FB = 6 cm, BD = 5 cm, DC = 4 cm y AC = 11 cm. ¿Cuánto mide CE?',
    alternativas: ['5 cm', '5,5 cm', '6 cm', '13,2 cm', '11 cm'],
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['4', '6'] }, ' · ', { frac: ['5', '4'] }, ' · ', { frac: ['CE', 'EA'] }, ' = 1', FL, { frac: ['CE', 'EA'] }, ' = ', { frac: ['6', '5'] }]) },
      { texto: 'AC = 11 cm en 6 + 5 = 11 partes de 1 cm; CE toma 6:', ecuacion: junto(['CE = ', dF('6 cm')]) },
      { texto: '5 cm es EA; 5,5 cm parte AC por la mitad; 13,2 cm multiplica AC por 6/5 en vez de repartirlo; 11 cm es AC entero.' }],
    respuesta: [junto('CE = '), dF('6 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Más allá de C',
    figura: figO(figMene(0.5, 0.6, { rot: { CE: '?' }, sinEscala: true, alt: 'Un triángulo ABC; la recta que pasa por F, en AB, y por D, en BC, corta la prolongación de AC más allá de C, en E.' })),
    enunciado: `F es el punto medio de AB; D está en BC, con BD = 2 · DC. FD corta la prolongación de AC más allá de C, en E. AC = 6 cm. ¿Cuánto mide CE?${NO_ESC}`,
    alternativas: ['6 cm', '3 cm', '12 cm', '2 cm', '4 cm'],
    datos: [D_MENE, D_LARGOS],
    solucion: [{ texto: 'Menelao:', ecuacion: junto(['1 · 2 · ', { frac: ['CE', 'EA'] }, ' = 1', FL, 'EA = 2 · CE']) },
      { texto: 'E está más allá de C: EA = 6 + CE.', ecuacion: junto(['6 + CE = 2 · CE', FL, 'CE = ', dF('6 cm')]) },
      { texto: '12 cm es EA; 3 cm y 2 cm parten AC en vez de mirar afuera; 4 cm pone BD/DC al revés y E adentro.' }],
    respuesta: [junto('CE = '), dF('6 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Dos tramos con x',
    figura: figO(figCeva([2, 1], [1, 1], { rot: { AF: 'x', FB: 'x + 2', BD: '9 cm', DC: '4 cm', CE: '2 cm', EA: '3 cm' }, sinEscala: true })),
    enunciado: `Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = x, FB = x + 2, BD = 9, DC = 4, CE = 2 y EA = 3, en centímetros. ¿Cuánto mide AB?${NO_ESC}`,
    alternativas: ['4 cm', '6 cm', '8 cm', '12 cm', '10 cm'],
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['x', 'x + 2'] }, ' · ', { frac: ['9', '4'] }, ' · ', { frac: ['2', '3'] }, ' = 1']) },
      { texto: '9/4 · 2/3 = 3/2, así que:', ecuacion: junto([{ frac: ['x', 'x + 2'] }, ' = ', { frac: ['2', '3'] }, FL, '3x = 2x + 4', FL, 'x = 4']) },
      { texto: 'AB = AF + FB:', ecuacion: junto(['AB = 4 + 6 = ', dF('10 cm')]) },
      { texto: '4 cm es x; 6 cm es FB; 8 cm suma x dos veces; 12 cm suma FB dos veces.' }],
    respuesta: [junto('AB = '), dF('10 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Para que concurran',
    figura: figO(figCeva([2, 3], [3, 1], { rot: { AF: '2 cm', FB: '3 cm', BD: '3 cm', DC: '4 cm', CE: '4 cm', EA: '?' }, sinEscala: true })),
    enunciado: `F, D y E están en los lados del triángulo ABC: AF = 2, FB = 3, BD = 3, DC = 4 y CE = 4, en centímetros. ¿Qué EA hace concurrentes a AD, BE y CF?${NO_ESC}`,
    alternativas: ['3 cm', '2 cm', '4,5 cm', '8 cm', '4 cm'],
    datos: [D_CEVA],
    solucion: [{ texto: 'Ceva:', ecuacion: junto([{ frac: ['2', '3'] }, ' · ', { frac: ['3', '4'] }, ' · ', { frac: ['4', 'EA'] }, ' = 1', FL, { frac: ['2', 'EA'] }, ' = 1']) },
      { texto: 'Se despeja:', ecuacion: junto(['EA = ', dF('2 cm')]) },
      { texto: '4 cm copia CE; 3 cm copia FB; 4,5 cm pone AF/FB al revés, y 8 cm, CE/EA.' }],
    respuesta: [junto('EA = '), dF('2 cm')] });
  EJ6.push({ nivel: 3, titulo: 'La prolongación de BC',
    enunciado: 'Una recta corta AB en F, con AF : FB = 3 : 2; pasa por el punto medio E de AC y corta la prolongación de BC, más allá de B, en D. Si BC = 7 cm, ¿cuánto mide DC?',
    alternativas: ['14 cm', '35 cm', '28 cm', '21 cm', '7 cm'],
    datos: [D_MENE, D_LARGOS],
    solucion: [{ texto: 'Menelao, con CE/EA = 1:', ecuacion: junto([{ frac: ['3', '2'] }, ' · ', { frac: ['BD', 'DC'] }, ' · 1 = 1', FL, { frac: ['BD', 'DC'] }, ' = ', { frac: ['2', '3'] }]) },
      { texto: 'D está más allá de B: DC = BD + 7, y BD es 2 de 3 partes. La parte que falta es BC, así que cada parte mide 7 cm:', ecuacion: junto(['DC = 3 · 7 cm = ', dF('21 cm')]) },
      { texto: '14 cm es BD; 7 cm es BC; 35 cm suma BD y DC; 28 cm toma cuatro partes.' }],
    respuesta: [junto('DC = '), dF('21 cm')] });

  // «Ahora tú» de la idea 6. Tipos: un tramo con Ceva; la razón que falta con Ceva; un tramo por fuera con Menelao; la x
  // con Ceva; ¿concurren?
  function casoCevaTramo(r) {
    const a = r.ent(1, 6), b = r.ent(1, 6), c = r.ent(1, 6), d = r.ent(1, 6), e = r.ent(1, 8), x = e * b * d / (a * c);
    // Auditoría (20 nov): el triángulo de lados AB, BC y CA tiene que existir (antes salían 4, 11 y 23 cm).
    if (!Number.isInteger(2 * x) || x === e || (a === b && c === d) || !existe(a + b, c + d, e + x)) return null;
    return { pregunta: `Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y EA = ${e} cm. ¿Cuánto mide CE?`,
      datos: [D_CEVA],
      opciones: ops(x, r.baraja([
        { id: 'invertida', valor: e * a * c / (b * d), error: 'GE-CEV3', siFuera: 'Usar Ceva está bien; pero dando la vuelta se escribe CE/EA, no EA/CE.' },
        { id: 'suma', valor: a + c, error: 'GE-CEV4', siFuera: 'Ceva multiplica razones; no se suman tramos.' },
        { id: 'copia', valor: e, error: 'GE-CEV5', siFuera: 'CE = EA solo si las otras dos razones se compensan; aquí no.' },
        { id: 'dos', valor: e * b / a, error: 'GE-CEV6', siFuera: 'Faltó la razón de BC: el producto lleva las tres.' }]), cm),
      solucion: { texto: `(${a}/${b}) · (${c}/${d}) · (CE/${e}) = 1.`, ecuacion: junto(['CE = ', dF(cm(x))]) } };
  }
  function casoCevaRazon(r) {
    const p = [r.ent(1, 4), r.ent(1, 4)], q = [r.ent(1, 4), r.ent(1, 4)];
    if (p[0] === p[1] || q[0] === q[1] || mcd(p[0], p[1]) !== 1 || mcd(q[0], q[1]) !== 1) return null;
    const txt = (a, b) => { const g = mcd(a, b); return `${a / g} : ${b / g}`; };
    const correcta = txt(p[1] * q[1], p[0] * q[0]);
    const opciones = [{ id: 'c', texto: `AF : FB = ${correcta}`, correcta: true }];
    for (const [t2, er, sf] of [[txt(p[0] * q[0], p[1] * q[1]), 'GE-CEV3', 'Usar Ceva está bien; pero al despejar, AF/FB queda al revés del producto de las otras dos.'],
      ['1 : 1', 'GE-CEV5', 'F en el medio sería si las otras dos razones se compensaran.'],
      [txt(p[0] + q[0], p[1] + q[1]), 'GE-CEV4', 'Sumar no sirve: Ceva multiplica las razones.'],
      [txt(p[1] + q[1], p[0] + q[0]), 'GE-CEV4', 'Sumar no sirve: Ceva multiplica las razones.']])
      if (!opciones.some(o => o.texto === `AF : FB = ${t2}`)) opciones.push({ id: `o${opciones.length}`, texto: `AF : FB = ${t2}`, error: er, siFuera: sf });
    if (opciones.length < 4) return null;
    return { pregunta: `En el triángulo ABC, las cevianas AD, BE y CF pasan por un punto, con BD : DC = ${p[0]} : ${p[1]} y CE : EA = ${q[0]} : ${q[1]}. ¿En qué razón parte F al lado AB?`,
      datos: [D_CEVA], opciones: opciones.slice(0, 4),
      solucion: { texto: `AF/FB · ${fr(p[0], p[1])} · ${fr(q[0], q[1])} = 1.`, ecuacion: junto(['AF : FB = ', dF(correcta)]) } };
  }
  function casoMene(r) {
    const a = r.ent(1, 5), b = r.ent(1, 6), c = r.ent(1, 5), d = r.ent(1, 6), L = r.ent(2, 12), rr = b * d / (a * c);
    if (Math.abs(rr - 1) < 1e-9) return null;
    const masA = rr > 1, ce = masA ? rr * L / (rr - 1) : rr * L / (1 - rr), ea = masA ? ce - L : ce + L;
    if (!Number.isInteger(2 * ea) || ea > 60 || !existe(a + b, c + d, L)) return null;
    return { pregunta: `Una recta corta AB en F, BC en D y la prolongación de CA, más allá de ${masA ? 'A' : 'C'}, en E. AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y CA = ${L} cm. ¿Cuánto mide EA?`,
      datos: [D_MENE, D_LARGOS],
      opciones: ops(ea, r.baraja([
        { id: 'ce', valor: ce, error: 'GE-CEV7', siFuera: `Menelao está bien: CE = ${fm(ce)} cm. EA es el otro tramo.` },
        { id: 'adentro', valor: L / (1 + rr), error: 'GE-CEV1', siFuera: 'Repartir CA en la razón supone E adentro; está en la prolongación.' },
        { id: 'lado', valor: masA ? ce + L : Math.abs(ce - L), error: 'GE-CEV8', siFuera: masA ? 'CE está bien; pero E está más allá de A: EA es CE menos CA.' : 'CE está bien; pero E está más allá de C: EA es CE más CA.' },
        { id: 'ca', valor: L, error: 'GE-CEV5', siFuera: `${L} cm es CA; EA es lo que hay de E hasta A.` }]), cm),
      solucion: { texto: `(${a}/${b}) · (${c}/${d}) · (CE/EA) = 1, así que CE/EA = ${fr(b * d, a * c)}, con ${masA ? `CE = EA + ${L}` : `EA = CE + ${L}`}.`, ecuacion: junto(['EA = ', dF(cm(ea))]) } };
  }
  function casoCevaX(r) {
    const c = r.ent(1, 6), d = r.ent(1, 6), e1 = r.ent(1, 6), e2 = r.ent(1, 6), b = r.ent(2, 9), x = b * d * e2 / (c * e1);
    if (!Number.isInteger(x) || x < 1 || x > 30 || (c === d && e1 === e2) || !existe(x + b, c + d, e1 + e2)) return null;
    return { pregunta: `Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = x, FB = ${b}, BD = ${c}, DC = ${d}, CE = ${e1} y EA = ${e2}, en centímetros. ¿Cuánto mide AB?`,
      datos: [D_CEVA],
      opciones: ops(x + b, r.baraja([
        { id: 'x', valor: x, error: 'GE-THA6', siFuera: `Ceva está bien: x = ${x}. Falta AB = x + ${b}.` },
        { id: 'invertida', valor: b * c * e1 / (d * e2) + b, error: 'GE-CEV3', siFuera: 'Usar Ceva está bien; pero una razón quedó al revés: se da la vuelta A, F, B, D, C, E.' },
        { id: 'doble', valor: 2 * b, error: 'GE-CEV5', siFuera: 'AF = FB solo si las otras dos razones se compensan.' },
        { id: 'suma', valor: x + b + c, error: 'GE-CEV4', siFuera: 'AB son AF y FB; BD está en otro lado.' }]), cm),
      solucion: { texto: `(x/${b}) · (${c}/${d}) · (${e1}/${e2}) = 1, así que x = ${x}.`, ecuacion: junto([`AB = ${x} + ${b} = `, dF(cm(x + b))]) } };
  }
  function casoConcurren(r) {
    const t0 = r.ent(1, 4), t1 = r.ent(1, 4), t2 = r.ent(1, 4), t3 = r.ent(1, 4), si = r.ent(0, 1) === 1;
    if ((t0 === t1 && t2 === t3) || mcd(t0, t1) !== 1 || mcd(t2, t3) !== 1) return null;
    // Para que concurran, CE/EA = (t1 · t3)/(t0 · t2); si no, se cambia CE.
    let ce = t1 * t3, ea = t0 * t2;
    if (!si) ce += r.ent(1, 2);
    const g = mcd(ce, ea); ce /= g; ea /= g;
    const pn = t0 * t2 * ce, pd = t1 * t3 * ea;
    if (!si && pn === pd) return null;
    const ok = si ? 'Sí: el producto vale 1' : `No: el producto vale ${fr(pn, pd)}`;
    const opciones = [{ id: 'c', texto: ok, correcta: true }].concat(si
      ? [{ id: 'iguales', texto: 'No: los tramos no miden igual', error: 'GE-CEV5', siFuera: 'No hace falta que midan igual: basta que el producto valga 1.' },
        { id: 'suma', texto: 'No: las razones no suman 1', error: 'GE-CEV4', siFuera: 'Ceva multiplica las razones; no las suma.' },
        { id: 'faltan', texto: 'Faltan los lados enteros', error: 'GE-CEV6', siFuera: 'Las tres razones alcanzan: es el recíproco de Ceva.' }]
      : [{ id: 'siempre', texto: 'Sí: los tres puntos están en los lados', error: 'GE-CEV6', siFuera: 'Estar en los lados no basta: el producto tiene que valer 1.' },
        { id: 'suma', texto: 'Sí: las razones suman más de 1', error: 'GE-CEV4', siFuera: 'Ceva multiplica las razones; no las suma.' },
        { id: 'faltan', texto: 'Faltan los lados enteros', error: 'GE-CEV6', siFuera: 'Las tres razones alcanzan para decidir.' }]);
    return { pregunta: `En el triángulo ABC, AF : FB = ${t0} : ${t1}, BD : DC = ${t2} : ${t3} y CE : EA = ${ce} : ${ea}. ¿Las cevianas AD, BE y CF pasan por un mismo punto?`,
      datos: [D_CEVA], opciones,
      solucion: { texto: `(${t0}/${t1}) · (${t2}/${t3}) · (${ce}/${ea}) = ${fr(pn, pd)}.`, ecuacion: [dF(si ? 'sí pasan por un punto' : 'no pasan por un punto')] } };
  }
  function resuelveCM(s) {
    const r = azar2(s + 900);
    if (s % 2 === 0) {
      let a, b, c, d, L, num, den;
      do { a = r.ent(1, 5); b = r.ent(1, 6); c = r.ent(1, 5); d = r.ent(1, 6); num = b * d; den = a * c; L = (num + den) * r.ent(1, 3); } while (num === den || mcd(num, den) !== 1 || L > 40 || !existe(a + b, c + d, L));
      const ce = L * num / (num + den);
      return {
        enunciado: `Los caminos AD, BE y CF de un terreno triangular ABC se cruzan en un pozo. AF = ${a} m, FB = ${b} m, BD = ${c} m, DC = ${d} m y AC = ${L} m. ¿Cuánto mide CE?`,
        datos: [D_CEVA],
        pasos: [
          { tipo: 'pide', texto: 'Piden CE, el tramo de la cerca CA que va de C al camino que sale de B.' },
          { tipo: 'datos', texto: `En AB: AF = ${a} m y FB = ${b} m. En BC: BD = ${c} m y DC = ${d} m. CA entera: ${L} m.` },
          { tipo: 'regla', texto: 'Los tres caminos son cevianas que pasan por un punto: Ceva, dando la vuelta de A a F, de F a B, y así.', ecuacion: [{ frac: [dO('AF'), dI('FB')] }, ' · ', { frac: [dO('BD'), dI('DC')] }, ' · ', { frac: [dO('CE'), dI('EA')] }, ' = 1'] },
          { tipo: 'cuentas', texto: `(${a}/${b}) · (${c}/${d}) · CE/EA = 1, así que CE/EA = ${fr(num, den)}. CA se reparte en ${num + den} partes de ${fm(L / (num + den))} m.`, ecuacion: junto(['CE = ', dF(m_(ce))]) },
          { tipo: 'sentido', texto: `Comprobación: EA = ${fm(L - ce)} m, y (${a}/${b}) · (${c}/${d}) · (${fm(ce)}/${fm(L - ce)}) = 1.` },
        ],
        respuesta: [junto('CE = '), dF(m_(ce))] };
    }
    let a, b, c, d, L, rr;
    do { a = r.ent(1, 5); b = r.ent(1, 6); c = r.ent(1, 5); d = r.ent(1, 6); L = r.ent(2, 10); rr = b * d / (a * c); } while (rr <= 1 || !Number.isInteger(2 * rr * L / (rr - 1)) || rr * L / (rr - 1) > 50 || !existe(a + b, c + d, L));
    const ce = rr * L / (rr - 1);
    return {
      enunciado: `Una recta corta AB en F, BC en D y la prolongación de CA, más allá de A, en E. AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y CA = ${L} cm. ¿Cuánto mide CE?`,
      datos: [D_MENE, D_LARGOS],
      pasos: [
        { tipo: 'pide', texto: 'Piden CE: de C hasta E, que está afuera, más allá de A.' },
        { tipo: 'datos', texto: `AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y CA = ${L} cm. Como E está más allá de A, CE = EA + ${L}.` },
        { tipo: 'regla', texto: 'F, D y E están en una recta: Menelao, dando la vuelta.', ecuacion: [{ frac: [dO('AF'), dI('FB')] }, ' · ', { frac: [dO('BD'), dI('DC')] }, ' · ', { frac: [dO('CE'), dI('EA')] }, ' = 1'] },
        { tipo: 'cuentas', texto: `CE/EA = ${fr(b * d, a * c)}. Con EA = CE − ${L}: CE = ${fm(rr)} · (CE − ${L}).`, ecuacion: junto(['CE = ', dF(cm(ce))]) },
        { tipo: 'sentido', texto: `CE es mayor que CA, ${L} cm, como debe ser con E afuera. EA = ${fm(ce - L)} cm.` },
      ],
      respuesta: [junto('CE = '), dF(cm(ce))] };
  }

  // Lectura del juego: las tres razones (BD/DC y CE/EA de los controles; AF/FB, la que deja F) y su producto.
  const RAZ = [[1, 3], [1, 2], [1, 1], [2, 1], [3, 1]];
  const razTxt = ([n, d]) => fr(n, d);
  const PRED6 = 'Ahora no hay cevianas: una recta corta AB en F, BC en D y la prolongación de CA en E. ¿Cuánto vale AF/FB · BD/DC · CE/EA?';
  const ideaCeva = {
    id: 'ceva-menelao',
    titulo: 'Teoremas de Ceva y Menelao',
    pregunta: '¿Qué tienen en común tres caminos que se cruzan en un pozo?',
    temas: ['Menelao y Ceva'],
    pieza: GO,
    aprendizaje: 'Tres cevianas pasan por un punto, o tres puntos están en una recta, cuando el producto de tres razones, dando la vuelta, vale 1.',
    actividad: 'Mover dos caminos de un terreno y ver dónde llega el tercero.',
    // Lee: ceviana, concurrentes y cómo se da la vuelta. No dice cuánto vale el producto (el juego) ni qué pasa con una
    // recta que corta por fuera (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Tres caminos y un pozo', texto: 'En el terreno ABC, tres caminos rectos salen de las esquinas y llegan a la cerca de enfrente: de A a D, de B a E y de C a F. Los tres pasan por el pozo P.',
          pieza: GO, dibujo: figO(figCeva([2, 1], [2, 1], { terreno: true, alt: 'El terreno ABC con tres caminos, AD, BE y CF, que se cruzan en el pozo P.' })) },
        { titulo: 'Cevianas concurrentes', texto: 'Un segmento que va de un vértice a un punto del lado opuesto es una ceviana: cada camino lo es. Tres rectas que pasan por un mismo punto son concurrentes.' },
        { titulo: 'Dar la vuelta', texto: 'Las razones se escriben dando la vuelta al triángulo: de A a F, de F a B, de B a D, de D a C, de C a E y de E a A. Cada tramo aparece una vez.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve D y E. El camino de C se acomoda para pasar por el pozo. Mira el producto de las tres razones.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'Tres caminos rectos salen de las esquinas del terreno y se cruzan en el pozo P. El de C llega a AB en F.',
      mision: { texto: 'Mueve D y E hasta que el camino de C llegue al medio de AB.', logrado: v => Math.abs(v.d * v.e - 1) < 1e-9,
        bien: 'Listo: AF = FB, y las otras dos razones se compensan.' },
      voz: 'Mira el producto de las tres razones cada vez.',
      leyenda: [
        { s: dO('AF, BD, CE'), t: 'los tramos que salen de un vértice' },
        { s: dI('FB, DC, EA'), t: 'los tramos que llegan al vértice siguiente' },
        { s: 'P', t: 'el pozo, donde se cruzan los caminos' },
      ],
      controles: [
        { id: 'd', etiqueta: 'BD : DC', opciones: RAZ.map(z => ({ valor: z[0] / z[1], texto: `${z[0]} : ${z[1]}` })), inicio: 2 },
        { id: 'e', etiqueta: 'CE : EA', opciones: RAZ.map(z => ({ valor: z[0] / z[1], texto: `${z[0]} : ${z[1]}` })), inicio: 2 },
      ],
      dibujo: v => { const zd = RAZ.find(z => Math.abs(z[0] / z[1] - v.d) < 1e-9) || [2, 1], ze = RAZ.find(z => Math.abs(z[0] / z[1] - v.e) < 1e-9) || [2, 1];
        return { datos: figCeva(zd, ze, { terreno: true, colores: true, letras: !(zd[0] === 3 && ze[0] === ze[1]), alt: `El terreno con BD : DC = ${zd[0]} : ${zd[1]} y CE : EA = ${ze[0]} : ${ze[1]}; el camino de C llega a AB en F.` }), estado: {} }; },
      lectura: v => { const zd = RAZ.find(z => Math.abs(z[0] / z[1] - v.d) < 1e-9), ze = RAZ.find(z => Math.abs(z[0] / z[1] - v.e) < 1e-9);
        return [junto([{ frac: [dO('BD'), dI('DC')] }, ' · ', { frac: [dO('CE'), dI('EA')] }, ' · ', { frac: [dO('AF'), dI('FB')] }, ` = ${razTxt(zd)} · ${razTxt(ze)} · ${fr(zd[1] * ze[1], zd[0] * ze[0])} = 1`])]; },
      minimo: 3,
    },
    predice: {
      pregunta: PRED6,
      datos: ['F está en el lado AB, D en el lado BC y E fuera del lado CA, en su prolongación.'],
      voz: 'Un punto quedó fuera del lado. ¿Cambia el producto?',
      opciones: [
        { id: 'c', texto: '1, también', correcta: true },
        { id: 'menos', texto: 'Menos de 1, porque E está fuera', error: 'GE-CEV1', siFuera: 'Ver que E está fuera está bien; pero con largos el producto vuelve a dar 1.' },
        { id: 'nada', texto: 'No se puede: E no está en el lado', error: 'GE-CEV1', siFuera: 'Ceva pide puntos en los lados; este es otro teorema, que acepta prolongaciones.' },
        { id: 'depende', texto: 'Depende de dónde corte la recta', error: 'GE-CEV1', siFuera: 'Ver que la recta puede cortar en muchos lugares está bien; pero el producto da 1 en todos.' },
      ],
      dibujo: figO(figMene(0.25, 0.5, { alt: 'Un triángulo ABC y una recta que corta AB en F, BC en D y la prolongación de CA, más allá de A, en E.' })),
      revelar: figO(figMene(0.25, 0.5, { colores: true, alt: 'El mismo dibujo, con los tramos que salen de un vértice en naranja y los que llegan en turquesa: el producto de las tres razones vale 1.' })),
      coincide: 'Coincide: con una recta, el producto también vale 1. Es el teorema de Menelao.',
      noCoincide: 'Revisemos: aunque E quede fuera, con largos el producto vuelve a dar 1. Es el teorema de Menelao.',
    },
    mira: {
      pieza: GO,
      datos: figMene(0.25, 0.5, { paralela: 1, colores: true, alt: 'El triángulo ABC con la recta FDE; por C, una paralela a esa recta corta AB en G.' }),
      voz: 'Una paralela por C, y Thales dos veces.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La recta pasa por F y D, y por E, afuera.' },
        { estado: { corte: 1 }, texto: 'Por C, una paralela a la recta corta la prolongación de BA en G.' },
        { estado: { corte: 1 }, texto: 'Thales desde B: FD y GC son paralelas.', ecuacion: [{ frac: [dO('BD'), dI('DC')] }, ' = ', { frac: ['BF', 'FG'] }] },
        { estado: { corte: 1 }, texto: 'Desde A, AFE y AGC son semejantes, cruzados: FE ∥ GC.', ecuacion: [{ frac: [dO('CE'), dI('EA')] }, ' = ', { frac: ['FG', 'AF'] }] },
        { estado: { corte: 1 }, texto: 'Al multiplicar las tres razones, todo se cancela.', ecuacion: [{ frac: [dO('AF'), dI('FB')] }, ' · ', { frac: ['BF', 'FG'] }, ' · ', { frac: ['FG', 'AF'] }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'Ceva: tres cevianas concurren si el producto, dando la vuelta, vale 1. Menelao: una recta que corta dos lados y la prolongación del tercero también da 1.',
      ecuacion: [{ frac: [dO('AF'), dI('FB')] }, ' · ', { frac: [dO('BD'), dI('DC')] }, ' · ', { frac: [dO('CE'), dI('EA')] }, ' = 1'],
      condicion: 'se da la vuelta vértice, punto, vértice, con largos sin signo. Lo que distingue a Menelao es el punto afuera.',
      voz: 'Escribe las tres razones dando la vuelta, sin saltarte un tramo.',
      dibujo: figO(figReglaCM()),
    },
    mundo: MUNDO6,
    resuelve: { pieza: GO, generar: resuelveCM },
    ahoraTu: {
      pieza: GO,
      voz: 'Da la vuelta: A, F, B, D, C, E, y otra vez A.',
      generar(s) { return conCuatro([casoCevaTramo, casoCevaRazon, casoMene, casoCevaX, casoConcurren][s % 5], azar2(s + 7), firmasDe(EJ6, [PRED6])); },
    },
  };

  // ======================= Laboratorio: juego libre, sin preguntas =======================
  // Las tres mesas de antes, con sus id, en los colores del curso (sin verde; el carmín solo en ángulos).
  // Valores de un control como los da el lector (min + k·paso, redondeado) y el extremo de una medida en toda la grilla
  // de la mesa: los retos «el mayor…» se comprueban con la mesa real, no con un número escrito a mano.
  const valoresDe = c => Array.from({ length: Math.floor((c.max - c.min) / c.paso + 1e-9) + 1 }, (_, k) => Math.round(Math.min(c.max, c.min + k * c.paso) * 1e6) / 1e6);
  const extremoMesa = (mesa, medida) => {
    let casos = [{}];
    for (const c of mesa.controles) casos = casos.flatMap(v => valoresDe(c).map(x => Object.assign({}, v, { [c.id]: x })));
    return Math.max(...casos.map(medida));
  };
  const memo = fn => { let x; return () => (x === undefined ? (x = fn()) : x); };
  const TA = [2, 5], TB = [0, 0], TC = [7, 0];
  // Mesa 1 (idea 1): D y E se mueven cada uno por su lado; DE es paralela a BC solo si los dos van a la misma altura.
  const thalesLibre = (t, te) => {
    const D = U.mezcla(TA, TB, t), E = U.mezcla(TA, TC, te), par = Math.abs(t - te) < 1e-9 ? 1 : 0;
    return {
      alt: `D a ${f(t, 1)} de AB y E a ${f(te, 1)} de AC, desde A: DE ${par ? 'es' : 'no es'} paralela a BC.`,
      vista: { x: [-0.8, 7.8], y: [-0.8, 5.6] },
      puntos: [pt('A', TA, { rotulo: 'A', lado: 90 }), pt('B', TB, { rotulo: 'B', lado: -120 }), pt('C', TC, { rotulo: 'C', lado: -60 }), pt('D', D, { rotulo: 'D', lado: 180 }), pt('E', E, { rotulo: 'E', lado: 0 })],
      segmentos: [{ de: 'A', a: 'D', color: 'o', grosor: 'variable' }, { de: 'D', a: 'B', color: 'i', grosor: 'variable' }, { de: 'A', a: 'E', color: 'o', grosor: 'variable' },
        { de: 'E', a: 'C', color: 'i', grosor: 'variable' }, { de: 'B', a: 'C', paralela: par }, { de: 'D', a: 'E', paralela: par, discontinua: !par }],
    };
  };
  const corteLibre = v => {
    const D = U.mezcla(TA, TB, v.t), E = U.mezcla(TA, TC, v.te);
    const cruz = (E[0] - D[0]) * (TC[1] - TB[1]) - (E[1] - D[1]) * (TC[0] - TB[0]);
    return { rd: U.dist(TA, D) / U.dist(D, TB), re: U.dist(TA, E) / U.dist(E, TC), paralela: Math.abs(cruz) < 1e-9 };
  };
  const mesaThales = {
    id: 'corte-libre', titulo: 'Corte paralelo o inclinado', pieza: 'geo-figura',
    consigna: 'Arrastra D y E por separado. Compara las dos razones y busca cuándo DE queda paralela a BC.',
    controles: [
      { id: 't', etiqueta: 'D desde A', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.4, unidad: 'de AB', decimales: 1, color: 'c-o' },
      { id: 'te', etiqueta: 'E desde A', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.6, unidad: 'de AC', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: thalesLibre(v.t, v.te), estado: {} }),
    arrastres: [
      { id: 'punto-d', etiqueta: 'punto D en AB', color: 'c-o',
        donde: v => enPantalla(thalesLibre(v.t, v.te), U.mezcla(TA, TB, v.t)),
        mover: (p, v) => ({ t: sobre(thalesLibre(v.t, v.te), TA, TB, p) }) },
      { id: 'punto-e', etiqueta: 'punto E en AC', color: 'c-i',
        donde: v => enPantalla(thalesLibre(v.t, v.te), U.mezcla(TA, TC, v.te)),
        mover: (p, v) => ({ te: sobre(thalesLibre(v.t, v.te), TA, TC, p) }) },
    ],
    // La relación: las dos razones, reducidas, y si DE queda paralela.
    lectura: v => [junto([{ v: 'c-o', t: 'AD' }, ' : ', { v: 'c-i', t: 'DB' }, ` = ${razon(Math.round(v.t * 10), Math.round(10 - v.t * 10))}`]), Y,
      junto([{ v: 'c-o', t: 'AE' }, ' : ', { v: 'c-i', t: 'EC' }, ` = ${razon(Math.round(v.te * 10), Math.round(10 - v.te * 10))}`]), Math.abs(v.t - v.te) < 1e-9 ? ': paralela' : ''],
    invitaciones: [
      { texto: 'Mueve D o E hasta dejar DE paralela a BC.',
        logrado: v => corteLibre(v).paralela,
        bien: 'Paralela justo cuando las dos razones coinciden: eso dice Thales.' },
      { texto: 'Consigue que AD : DB sea 4 : 1 con DE paralela a BC.',
        logrado: v => { const c = corteLibre(v); return c.paralela && Math.abs(c.rd - 4) < 1e-9; },
        bien: 'AD : DB = 4 : 1 obliga a AE : EC = 4 : 1: la paralela copia la razón.' },
      { texto: 'Inclina DE hasta que las dos razones queden lo más distintas posible.',
        logrado: v => { const c = corteLibre(v); return Math.abs(Math.abs(c.rd - c.re) - difMax()) < 1e-9; },
        bien: 'Muy inclinada, las razones se separan: sin paralela no hay proporción.' },
      { texto: 'Guarda dos cortes paralelos a distinta altura. Compara sus razones.',
        logrado: (v, guardados) => corteLibre(v).paralela && guardados.some(g => g.t === v.t && g.te === v.te)
          && guardados.some(g => g.t !== v.t && corteLibre(g).paralela),
        bien: 'Cada paralela da su razón, pero en los dos lados es la misma.' },
    ],
  };
  const difMax = memo(() => extremoMesa(mesaThales, v => { const c = corteLibre(v); return Math.abs(c.rd - c.re); }));
  // Mesa 2 (idea 2): además de los lados, se abre el ángulo A. La razón BD : DC no depende del ángulo.
  const bisecLibre = (c, b, ang) => {
    const A = [0, 0], B = U.polar(A, c, 270 - ang / 2), C = U.polar(A, b, 270 + ang / 2);
    const D = [(b * B[0] + c * C[0]) / (b + c), (b * B[1] + c * C[1]) / (b + c)];
    return {
      alt: `AB = ${f(c, 1)}, AC = ${f(b, 1)} y ángulo A de ${ang}°: la bisectriz llega a BC en D.`,
      vista: { x: [-7.4, 7.4], y: [-7.4, 0.9] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: 180 }), pt('C', C, { rotulo: 'C', lado: 0 }), pt('D', D, { rotulo: 'D', lado: -90 })],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'C', color: 'i', grosor: 'variable' },
        { de: 'B', a: 'D', color: 'o' }, { de: 'D', a: 'C', color: 'i' }, { de: 'A', a: 'D', discontinua: true }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'h', rayita: 1, radio: 26 }, { en: 'A', de: 'D', a: 'C', color: 'h', rayita: 1, radio: 26 }],
    };
  };
  const dirB = g => (g > 90 ? g - 360 : g);
  const mesaBisectriz = {
    id: 'bisectriz-libre', titulo: 'Bisectriz con ángulo libre', pieza: 'geo-figura',
    consigna: 'Arrastra B y C: cambian los lados y la abertura de A. Mira si la razón BD : DC depende del ángulo.',
    controles: [
      // ∠A va primero (mismos ids): así el reto que compara dos ángulos con los mismos lados se puede comprobar.
      { id: 'ang', etiqueta: '∠A', min: 50, max: 150, paso: 10, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'c', etiqueta: 'AB', min: 1, max: 7, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'AC', min: 1, max: 7, paso: 0.5, inicio: 6, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: bisecLibre(v.c, v.b, v.ang), estado: {} }),
    arrastres: [
      { id: 'vertice-b', etiqueta: 'vértice B', color: 'c-o',
        donde: v => enPantalla(bisecLibre(v.c, v.b, v.ang), U.polar([0, 0], v.c, 270 - v.ang / 2)),
        mover: (p, v) => { const q = alPlano(bisecLibre(v.c, v.b, v.ang), p); return { c: Math.hypot(...q), ang: 2 * (-90 - dirB(U.grados(Math.atan2(q[1], q[0])))) }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(bisecLibre(v.c, v.b, v.ang), U.polar([0, 0], v.b, 270 + v.ang / 2)),
        mover: (p, v) => { const q = alPlano(bisecLibre(v.c, v.b, v.ang), p); return { b: Math.hypot(...q), ang: 2 * (90 + U.grados(Math.atan2(q[1], q[0]))) }; } },
    ],
    lectura: v => [junto([{ v: 'c-h', t: '∠A' }, ` = ${v.ang}°`]), ': ', junto([{ v: 'c-o', t: 'BD' }, ' : ', { v: 'c-i', t: 'DC' }, ' = ', { v: 'c-o', t: 'AB' }, ' : ', { v: 'c-i', t: 'AC' }, ` = ${razon(v.c, v.b)}`])],
    // Retos: BD : DC se mide sobre el punto D que dibuja bisecLibre, no con la fórmula AB/AC.
    invitaciones: [
      { texto: 'Haz que la bisectriz caiga justo en el punto medio de BC.',
        logrado: v => Math.abs(razonBD(v) - 1) < 1e-9,
        bien: 'BD = DC solo con AB = AC: el triángulo quedó isósceles.' },
      { texto: 'Consigue que BD mida el doble que DC.',
        logrado: v => Math.abs(razonBD(v) - 2) < 1e-9,
        bien: 'BD : DC = 2 : 1 porque AB mide el doble que AC.' },
      { texto: 'Busca la razón BD : DC más grande que deja la mesa.',
        logrado: v => Math.abs(razonBD(v) - razonMax()) < 1e-9,
        bien: 'AB mucho más largo que AC empuja D hacia C.' },
      { texto: 'Guarda dos casos con los mismos lados y otro ∠A. Compara BD : DC.',
        logrado: (v, guardados) => guardados.some(g => g.ang === v.ang && g.c === v.c && g.b === v.b)
          && guardados.some(g => g.c === v.c && g.b === v.b && g.ang !== v.ang && Math.abs(razonBD(g) - razonBD(v)) < 1e-9),
        bien: 'Otro ángulo, la misma razón: solo mandan AB y AC.' },
    ],
  };
  const razonBD = v => { const P = bisecLibre(v.c, v.b, v.ang).puntos, q = id => { const p = P.find(x => x.id === id); return [p.x, p.y]; }; return U.dist(q('B'), q('D')) / U.dist(q('D'), q('C')); };
  const razonMax = memo(() => extremoMesa(mesaBisectriz, razonBD));
  // Mesa 3 (idea 5): ancho y alto con escalas distintas. Con kx ≠ ky la figura ya no es semejante y el área se
  // multiplica por kx · ky; solo con kx = ky aparece k². La chica en naranja, la grande en turquesa (como la idea 5).
  const ampl2 = (kx, ky) => {
    const x0 = 4.4;
    return {
      alt: `Rectángulo de 3 por 2 estirado ${f(kx, 1)} veces a lo ancho y ${f(ky, 1)} a lo alto: ${f(3 * kx, 1)} por ${f(2 * ky, 1)}.`,
      vista: { x: [-0.6, x0 + 9.4], y: [-0.9, 6.6] },
      cuadricula: { paso: 1 },
      puntos: [pt('a', [0, 0], { sinPunto: true }), pt('b', [3, 0], { sinPunto: true }), pt('c', [0, 2], { sinPunto: true }), pt('A', [x0, 0], { sinPunto: true }), pt('B', [x0 + 3 * kx, 0], { sinPunto: true }), pt('C', [x0, 2 * ky], { sinPunto: true })],
      regiones: [{ puntos: [[0, 0], [3, 0], [3, 2], [0, 2]], color: 'o', opacidad: 0.2 },
        { puntos: [[x0, 0], [x0 + 3 * kx, 0], [x0 + 3 * kx, 2 * ky], [x0, 2 * ky]], color: kx === ky ? 'i' : undefined, opacidad: 0.14 }],
      segmentos: [{ de: 'a', a: 'b', color: 'o', texto: '3' }, { de: 'a', a: 'c', color: 'o', texto: '2' },
        { de: 'A', a: 'B', color: 'i', grosor: 'variable', texto: f(3 * kx, 1), lado: -1 }, { de: 'A', a: 'C', color: 'i', grosor: 'variable', texto: f(2 * ky, 1), lado: -1 }],
    };
  };
  const mesaEstirar = {
    id: 'estirar', titulo: 'Ampliar o estirar', pieza: 'geo-figura',
    consigna: 'Arrastra la esquina a cualquier lugar. Compara cuánto crece el área con k · k cuando las dos escalas coinciden.',
    controles: [
      { id: 'kx', etiqueta: 'k a lo ancho', min: 0.5, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'ky', etiqueta: 'k a lo alto', min: 0.5, max: 3, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: ampl2(v.kx, v.ky), estado: {} }),
    arrastres: [{ id: 'esquina', etiqueta: 'esquina de la figura nueva', color: 'c-i',
      donde: v => enPantalla(ampl2(v.kx, v.ky), [4.4 + 3 * v.kx, 2 * v.ky]),
      mover: (p, v) => { const q = alPlano(ampl2(v.kx, v.ky), p); return { kx: (q[0] - 4.4) / 3, ky: q[1] / 2 }; } }],
    lectura: v => [`área × ${f(v.kx * v.ky)}: ${v.kx === v.ky ? 'semejante' : 'no semejante'}`],
    invitaciones: [
      { texto: 'Consigue una figura semejante con el área multiplicada por 4.',
        logrado: v => v.kx === v.ky && Math.abs(factorArea(v) - 4) < 1e-9,
        bien: 'Lados por 2 y área por 4: con semejanza, el área va por k · k.' },
      { texto: 'Haz una figura semejante más chica que la original.',
        logrado: v => v.kx === v.ky && factorArea(v) < 1,
        bien: 'Con k = 0,5 el área queda en la cuarta parte.' },
      { texto: 'Busca el mayor factor del área sin que la figura sea semejante.',
        logrado: v => v.kx !== v.ky && Math.abs(factorArea(v) - factorMaxNoSem()) < 1e-9,
        bien: 'Casi el máximo. Con las dos escalas iguales a 3, el área iría por 9.' },
      { texto: 'Guarda dos casos no semejantes con el mismo factor del área.',
        logrado: (v, guardados) => v.kx !== v.ky && guardados.some(g => g.kx === v.kx && g.ky === v.ky)
          && guardados.some(g => g.kx !== g.ky && (g.kx !== v.kx || g.ky !== v.ky) && Math.abs(factorArea(g) - factorArea(v)) < 1e-9),
        bien: 'Mismo factor, formas distintas: el área sola no prueba semejanza.' },
    ],
  };
  const factorArea = v => { const P = ampl2(v.kx, v.ky).puntos, x = id => P.find(p => p.id === id); return (x('B').x - x('A').x) * (x('C').y - x('A').y) / (3 * 2); };
  const factorMaxNoSem = memo(() => extremoMesa(mesaEstirar, v => (v.kx !== v.ky ? factorArea(v) : -Infinity)));

  return {
    unidad: 'geometria.proporcionalidad-y-semejanza',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'El libro VI de los Elementos conecta forma y proporción. En su proposición 2, una paralela a un lado corta proporcionalmente los otros dos, y el texto también demuestra el recíproco. La prueba pasa por áreas de triángulos con alturas iguales. El nombre escolar de «Thales» no basta para saber quién descubrió cada versión.',
      pregunta: '¿Qué tienen que ver las áreas con las proporciones?',
      fuente: { titulo: 'Euclides, Elementos VI.2 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookVI/propVI2.html' },
    },
    // La tabla de letras de la unidad (molde §0.4; propuesta §5).
    letras: { k: 'la razón de semejanza: por cuánto se multiplica cada lado', x: 'lo que se pide, un número', S: 'un área (S₁ y S₂, las de dos figuras; S, la del triángulo grande)', h: 'una altura' },
    // Glosario: lo que esta unidad estrena. «razón», «bisectriz interior y exterior», «partes correspondientes» y
    // «perímetro» vienen de unidades anteriores. «incentro» se mudó a Puntos notables (decisión 3). Ningún término dice
    // la respuesta de una predicción: «teorema de la bisectriz» no va (sería la respuesta) y Ceva y Menelao no dicen
    // cuánto vale su producto.
    glosario: [
      // Idea 1. Ninguno dice cómo se reparte un total (la predicción: la parte con el todo).
      { termino: 'proporción', formas: ['proporción', 'proporciones'], def: 'Igualdad entre dos razones.',
        simple: 'Dos comparaciones que dan lo mismo, como 2 a 3 y 4 a 6.',
        ejemplos: ['2/3 = 4/6: los dos cocientes valen lo mismo.', '40 : 60 = 2 : 3, porque los dos se dividen entre 20.', '1/2 = 5/10 es una proporción; 1/2 y 5/9 no forman una.'], ver: ['proporcional', 'razón'] },
      { termino: 'proporcional', formas: ['proporcional', 'proporcionales', 'proporcionalmente'],
        def: 'Dicho de dos parejas de cantidades que forman la misma razón.',
        simple: 'Que crecen juntas en la misma razón, sin sumar lo mismo.',
        ejemplos: ['Tramos de 2 cm y 3 cm frente a 4 cm y 6 cm: 2/3 = 4/6.', 'Cuadras de 40 m y 60 m frente a 60 m y 90 m.', 'Tramos de 2 y 3 frente a 4 y 5 no lo son: 2/3 no es 4/5.'], ver: ['proporción', 'teorema de Thales'] },
      { termino: 'teorema de Thales', formas: ['teorema de Thales', 'Thales'],
        def: 'Rectas paralelas que cortan a dos secantes las parten en tramos proporcionales, tomados en el mismo orden.',
        simple: 'Calles paralelas reparten dos avenidas en cuadras de la misma razón.',
        ejemplos: ['Tramos de 2 y 3 en una secante; 4 y 6 en la otra.', 'Vale con tres paralelas o con más.', 'En un triángulo, la paralela a un lado parte los otros dos igual.'], ver: ['proporcional', 'recíproco'] },
      { termino: 'recíproco', formas: ['recíproco', 'recíprocos'],
        def: 'Enunciado con el orden cambiado: lo que era conclusión pasa a ser dato, y al revés.',
        simple: 'Darle la vuelta a un «si…, entonces…».',
        ejemplos: ['Thales: si MN ∥ BC, las razones son iguales. Recíproco: si las razones son iguales, MN ∥ BC.', 'El recíproco de un teorema no siempre es cierto.', 'Aquí sirve para saber si una recta es paralela.'], ver: ['teorema de Thales'] },
      // Idea 2. Ninguno dice en qué razón queda el lado opuesto (la predicción); «bisectriz», «bisectriz interior» y
      // «bisectriz exterior» son de Triángulos. «teorema de la bisectriz» no va: su definición sería la respuesta.
      { termino: 'pie de la bisectriz', formas: ['pie de la bisectriz', 'pies de las bisectrices'],
        def: 'Punto donde la bisectriz de un ángulo del triángulo llega al lado opuesto.',
        simple: 'Donde el canal que parte una esquina llega a la cerca de enfrente.',
        ejemplos: ['D, donde el canal llega a la cerca BC.', 'En un triángulo, cada vértice tiene el suyo en el lado de enfrente.', 'Parte el lado opuesto en dos tramos.'], ver: ['lados vecinos'] },
      { termino: 'lados vecinos', formas: ['lados vecinos', 'lado vecino'],
        def: 'Los dos lados de un triángulo que salen de un mismo vértice y forman su ángulo.',
        simple: 'Las dos cercas que salen de una misma esquina.',
        ejemplos: ['Los de la esquina A son AB y AC.', 'El de enfrente, BC, no es vecino de A: es su lado opuesto.', 'Cada vértice tiene dos lados vecinos.'], ver: ['pie de la bisectriz'] },
      // Idea 3. Ninguno dice cuánto mide el poste de la predicción.
      { termino: 'semejanza', formas: ['semejanza', 'semejante', 'semejantes'],
        def: 'Relación entre dos figuras de igual forma: ángulos iguales y lados que se multiplican por el mismo número.',
        simple: 'La misma forma en otro tamaño, como una foto y su ampliación.',
        ejemplos: ['Triángulos de lados 3, 4, 5 y 6, 8, 10.', 'Una foto y su ampliación.', 'Dos cuadrados cualesquiera.'], ver: ['razón de semejanza'] },
      { termino: 'razón de semejanza', formas: ['razón de semejanza'], simbolo: 'k',
        def: 'Número por el que se multiplica cada lado de una figura para obtener su semejante.',
        simple: 'Cuántas veces más largo es cada lado de la copia.',
        ejemplos: ['De 3, 4, 5 a 6, 8, 10: k = 2.', 'Una foto al triple: k = 3.', 'Con k menor que 1, la copia es más chica.'], ver: ['semejanza'] },
      // Idea 4. Ninguno dice cuánto mide AD en la predicción.
      { termino: 'lados homólogos', formas: ['lados homólogos', 'lado homólogo', 'homólogos'],
        def: 'En dos triángulos semejantes, los lados que van en pareja: los que están frente a ángulos iguales.',
        simple: 'Los lados que hacen el mismo papel en las dos figuras.',
        ejemplos: ['En la foto y su ampliación, el ancho chico y el ancho grande.', 'Frente a ángulos iguales están los homólogos.', 'No siempre están en el mismo lugar del dibujo.'], ver: ['semejanza'] },
      { termino: 'antiparalela', formas: ['antiparalela', 'antiparalelas'],
        def: 'Recta que corta dos lados de un triángulo con los ángulos cruzados respecto del tercer lado.',
        simple: 'Un corte cruzado: parece paralelo, pero tiene los ángulos al revés.',
        ejemplos: ['DE, si el ángulo ADE es igual al ángulo ACB.', 'No es paralela al tercer lado.', 'También deja un triángulo semejante al grande.'], ver: ['semejanza'] },
      // Idea 5. Ninguno dice qué parte queda en el terreno de la predicción ni da el cuadrado de k como regla.
      { termino: 'área', formas: ['área', 'áreas'], def: 'Cuánta superficie encierra una figura plana, contada en cuadraditos de lado 1.',
        simple: 'Lo que cubre una figura, contado en cuadraditos.',
        ejemplos: ['Un rectángulo de 3 por 4 encierra 12 cuadraditos.', 'Una foto de 15 cm por 10 cm cubre 150 cm².', 'Se mide en cm², m² o km².'] },
      { termino: 'ampliación', formas: ['ampliación', 'ampliaciones', 'amplía', 'ampliada'],
        def: 'Copia de una figura con todas sus longitudes multiplicadas por un mismo número mayor que 1.',
        simple: 'La misma figura más grande, sin estirarla de un solo lado.',
        ejemplos: ['Una foto de 10 por 15 llevada a 20 por 30.', 'Un plano dibujado al doble.', 'Si solo se alarga el ancho, no es ampliación.'], ver: ['semejanza'] },
      { termino: 'factor del área', formas: ['factor del área', 'factor de área'],
        def: 'Número por el que se multiplica el área de una figura al cambiar su tamaño.',
        simple: 'Cuántas veces cabe la figura chica en la grande.',
        ejemplos: ['Si caben 4 fotos chicas en la grande, es 4.', 'Se cuenta en cuadraditos, no en lados.', 'Si la figura se achica, es menor que 1.'], ver: ['área'] },
      { termino: 'volumen', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa un cuerpo, contado en cubitos de arista 1.',
        simple: 'Lo que cabe dentro de una caja, contado en cubitos.',
        ejemplos: ['Una caja de 2 por 3 por 4 guarda 24 cubitos.', 'Se mide en cm³ o m³.', 'Es de los cuerpos; el área, de las figuras planas.'] },
      // Idea 6. Ninguno dice cuánto vale el producto (el juego y la predicción).
      { termino: 'ceviana', formas: ['ceviana', 'cevianas'], def: 'Segmento que va de un vértice de un triángulo a un punto del lado opuesto.',
        simple: 'Un camino recto de una esquina a la cerca de enfrente.',
        ejemplos: ['AD, de A a un punto D de BC.', 'Cada triángulo tiene infinitas.', 'Un segmento entre dos lados no lo es.'], ver: ['concurrentes'] },
      { termino: 'concurrentes', formas: ['concurrentes', 'concurrente', 'concurren'], def: 'Dicho de tres o más rectas que pasan por un mismo punto.',
        simple: 'Caminos que se cruzan todos en el mismo pozo.',
        ejemplos: ['Tres caminos que pasan por el pozo P.', 'Dos rectas siempre se cortan, si no son paralelas; con tres, no siempre.', 'Las tres rectas de un asterisco.'], ver: ['ceviana'] },
      { termino: 'teorema de Ceva', formas: ['teorema de Ceva', 'Ceva'],
        def: 'Relaciona tres cevianas de un triángulo con las razones en que parten los lados: dice cuándo son concurrentes.',
        simple: 'La cuenta que dice si tres caminos se cruzan en un punto.',
        ejemplos: ['Usa AF/FB, BD/DC y CE/EA.', 'Las razones se escriben dando la vuelta.', 'Sirve en los dos sentidos.'], ver: ['ceviana', 'concurrentes', 'teorema de Menelao'] },
      { termino: 'teorema de Menelao', formas: ['teorema de Menelao', 'Menelao'],
        def: 'Si una recta corta dos lados de un triángulo y la prolongación del tercero, relaciona las razones de sus tramos.',
        simple: 'La cuenta de una recta que cruza un triángulo y sale por un lado.',
        ejemplos: ['Una recta que corta AB, BC y la prolongación de CA.', 'Usa las mismas tres razones que Ceva.', 'Uno de los puntos puede quedar fuera del lado.'], ver: ['teorema de Ceva'] },
    ],
    laboratorio: [mesaThales, mesaBisectriz, mesaEstirar],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'corte-libre': ['thales'],
      'bisectriz-libre': ['bisectriz'],
      'estirar': ['area-y-escala'],
    },
    ideas: [ideaThales, ideaBisectriz, ideaSemejanza, ideaEncajados, ideaArea, ideaCeva],
  };
});
