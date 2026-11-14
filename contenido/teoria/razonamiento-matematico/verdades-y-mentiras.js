/*
 * Teoría de «Verdades y mentiras» (razonamiento-matematico.verdades-y-mentiras).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 4); historia: Boole (1847 y 1854).
 * Precisión del curso: la respuesta es la asignación coherente; si hay dos, la información no decide.
 * Colores (regla 4): veraz verde (c-d), mentiroso rojo (c-h), la frase que se evalúa turquesa (c-i), el choque naranja (c-o).
 * Compañero: Faro (zorro). Códigos: RMT-VYM-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: suponer quién miente, comprobar si todo encaja y descartar lo que choca.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla la única asignación coherente, usa el par contradictorio y niega bien «todos».
 *   Orden de atención: 1.º la tabla de suposiciones · 2.º la lectura «coherente / choca» · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cómo sé quién miente si todos hablan?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const V = { v: 'c-d', t: 'V' }, M = { v: 'c-h', t: 'M' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (vistos.has(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }
  const f0 = n => Kit.formatear(n, 0);
  const falsas = n => `${f0(n)} ${n === 1 ? 'falsa' : 'falsas'}`;
  const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  const asignaciones = n => Array.from({ length: 2 ** n }, (_, m) => Array.from({ length: n }, (_, i) => !((m >> (n - 1 - i)) & 1)));
  // Una suposición es coherente si cada veraz dice algo verdadero y cada mentiroso, algo falso.
  const coherente = (frases, v) => frases.every((fr, i) => fr.valor(v) === v[i]);

  // Gesto directo (docs/teoria.md §4b): las manijas viven en la rejilla del tablero (rm-tablero exporta geometria).
  const TAB = () => Kit.piezas['rm-tablero'];
  // Interruptor dentro de la casilla «Es»: a la izquierda, veraz; a la derecha, miente. Se desliza como una ficha.
  const interruptor = (datosDe, fila, id) => ({
    donde: val => { const g = TAB().geometria(datosDe(val)), p = g.centro(fila, 0); return { x: p.x + (val[id] === 'V' ? -0.38 : 0.38) * g.cw, y: p.y + 11 }; },
    mover: (pt, val) => { const g = TAB().geometria(datosDe(val)); return { [id]: pt.x < g.centro(fila, 0).x ? 'V' : 'M' }; },
  });

  // Tabla de suposiciones: una fila por persona: quién es (V/M), su frase vale (V/F) y si encaja.
  function tablaSup(nombres, frases, v, extra = {}) {
    return {
      columnas: ['Es', 'Su frase', 'Encaja'], filas: nombres, ancho: 88,
      celdas: nombres.map((_, i) => {
        const val = frases[i].valor(v), ok = val === v[i];
        return [{ t: v[i] ? 'Veraz' : 'Miente', color: v[i] ? 'd' : 'h' }, { t: val ? 'cierta' : 'falsa', color: 'i' }, { marca: ok ? 'si' : 'no', color: ok ? 'd' : 'o' }];
      }),
      notas: [{ t: extra.nota || (coherente(frases, v) ? 'Todo encaja: suposición coherente' : 'Hay un choque: se descarta') }],
    };
  }

  // ---------- Idea 1: el método de suposición ----------
  // Cambia: quién se supone veraz · Permanece: las frases · Progresa: las suposiciones descartadas · Se reserva: el
  // acertijo de tres, donde solo una sobrevive · Debe verse: una suposición vale si todas las filas encajan.
  const DOS = ['Ana', 'Beto'];
  const FR2 = [{ t: '«Beto miente»', valor: v => !v[1] }, { t: '«Los dos mentimos»', valor: v => !v[0] && !v[1] }];
  const TRES = ['Ana', 'Beto', 'Ciro'];
  const FR3 = [{ t: 'Ana: «Beto miente»', valor: v => !v[1] }, { t: 'Beto: «Ciro miente»', valor: v => !v[2] }, { t: 'Ciro: «Ana y Beto mienten»', valor: v => !v[0] && !v[1] }];
  const SOL3 = asignaciones(3).filter(v => coherente(FR3, v));
  const suposicion = {
    id: 'suposicion',
    titulo: 'Suponer y comprobar',
    temas: ['Método de suposición', 'Personajes que siempre mienten o dicen la verdad'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Cada uno siempre miente o siempre dice la verdad. Ana dice: «Beto miente». Beto dice: «Los dos mentimos». Prueba cada suposición.',
      voz: 'Un veraz dice algo cierto; un mentiroso, algo falso.',
      controles: [
        { id: 'a', etiqueta: 'Ana', opciones: [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }] },
        { id: 'b', etiqueta: 'Beto', opciones: [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }] },
      ],
      dibujo: val => ({ datos: tablaSup(DOS, FR2, [val.a === 'V', val.b === 'V']), estado: {} }),
      lectura: val => [coherente(FR2, [val.a === 'V', val.b === 'V']) ? 'Coherente: esta suposición se queda' : 'Choca: esta suposición se descarta'],
      minimo: 4,
      // Desliza la casilla «Es» de cada persona: izquierda veraz, derecha miente.
      arrastres: [
        Object.assign({ id: 'ana', etiqueta: 'Ana: veraz o miente', color: 'c-d' }, interruptor(val => tablaSup(DOS, FR2, [val.a === 'V', val.b === 'V']), 0, 'a')),
        Object.assign({ id: 'beto', etiqueta: 'Beto: veraz o miente', color: 'c-d' }, interruptor(val => tablaSup(DOS, FR2, [val.a === 'V', val.b === 'V']), 1, 'b')),
      ],
    },
    predice: {
      pregunta: 'Otro grupo. Ana: «Beto miente». Beto: «Ciro miente». Ciro: «Ana y Beto mienten». ¿Quién dice la verdad?',
      opciones: [
        { id: 'ana', texto: 'Ana y Ciro', error: 'RMT-VYM-1', siFuera: 'Si Ana es veraz, Beto miente y Ciro sería veraz; pero Ciro diría algo falso.' },
        { id: 'c', texto: 'Solo Beto', correcta: true },
        { id: 'nadie', texto: 'Nadie', error: 'RMT-VYM-2', siFuera: 'Si todos mienten, Ana diría «Beto miente» y sería cierto: choca.' },
        { id: 'ciro', texto: 'Solo Ciro', error: 'RMT-VYM-1', siFuera: 'Si Ciro es veraz, Ana y Beto mienten; entonces Ana diría algo cierto: choca.' },
      ],
      dibujo: { datos: { columnas: ['Es', 'Su frase', 'Encaja'], filas: TRES, ancho: 82, celdas: TRES.map(() => ['', '', '']), notas: [{ t: 'Prueba una suposición' }] }, estado: {} },
      revelar: { datos: tablaSup(TRES, FR3, SOL3[0], { nota: 'Única suposición coherente' }), estado: {} },
      coincide: 'Coincide: de las ocho suposiciones, solo esta encaja en las tres filas.',
    },
    // Hallazgo 9: el juego usa la tabla «una fila por persona»; Mira usa la cadena «supón → sale». Son dos
    // representaciones a propósito: la primera comprueba una suposición entera, la segunda muestra cómo una sola
    // suposición obliga a las demás, que es lo que la tabla del juego no deja ver.
    mira: {
      datos: {
        columnas: ['Ana', 'Beto', 'Ciro'], filas: ['Supón', 'Sale', 'Sale'], ancho: 70,
        celdas: [
          [{ t: 'Veraz', color: 'd', desde: 1 }, { t: '', desde: 1 }, ''],
          [{ t: '', desde: 1 }, { t: 'Miente', color: 'h', desde: 1 }, { t: 'Veraz', color: 'd', desde: 1 }],
          [{ t: 'Miente', color: 'h', desde: 3 }, { t: 'Veraz', color: 'd', desde: 3 }, { t: 'Miente', color: 'h', desde: 3 }],
        ],
        marcos: [{ f: 1, c: 2, color: 'o', desde: 2, hasta: 2 }, { f: 2, c: 0, ancho: 3, color: 'd', desde: 4 }],
        notas: [{ t: 'Supón Ana veraz: Ciro choca', desde: 2, hasta: 2 }, { t: 'Ana miente: todo encaja', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Supón Ana veraz: Beto miente, así que Ciro es veraz.' },
        { estado: { corte: 2 }, texto: 'Pero Ciro diría «Ana y Beto mienten», y Ana no miente: choca.' },
        { estado: { corte: 3 }, texto: 'Entonces Ana miente: Beto es veraz y Ciro miente.' },
        { estado: { corte: 4 }, texto: 'Se revisa cada frase: las tres encajan.' },
      ],
    },
    regla: {
      texto: 'Se supone quién es veraz y se sigue lo que obliga cada frase. Si aparece un choque, la suposición se descarta. Vale la que encaja en todas las filas.',
      ecuacion: [{ llave: ['veraz'], nota: 'quién habla', color: 'c-d' }, '  ⇔  ', { llave: ['su frase es cierta'], nota: 'lo que dice', color: 'c-i' }],
      condicion: 'cada persona miente siempre o dice siempre la verdad, en todas sus frases.',
    },
    ahoraTu: {
      voz: 'Supón el caso de una persona y sigue la cadena.',
      generar(s) {
        const r = azar(s);
        const N = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva']).slice(0, 3);
        const plantilla = (i) => {
          const otros = [0, 1, 2].filter(j => j !== i), x = r.elegir(otros), y = otros.find(j => j !== x);
          return r.elegir([
            { t: `«${N[x]} miente»`, valor: v => !v[x] },
            { t: `«${N[x]} dice la verdad»`, valor: v => v[x] },
            { t: `«${N[x]} y ${N[y]} mienten»`, valor: v => !v[x] && !v[y] },
            { t: `«${N[x]} o ${N[y]} miente»`, valor: v => !v[x] || !v[y] },
            { t: '«Solo uno de nosotros dice la verdad»', valor: v => v.filter(Boolean).length === 1 },
          ]);
        };
        let fr = null, sol = null;
        for (let t = 0; t < 400 && !sol; t++) {
          const prueba = [0, 1, 2].map(plantilla);
          const v = asignaciones(3).filter(a => coherente(prueba, a));
          if (v.length === 1 && palabras(prueba.map(p => p.t).join(' ')) <= 20) { fr = prueba; sol = v[0]; }
        }
        const nombre = v => { const q = N.filter((_, i) => v[i]); return q.length === 0 ? 'Nadie' : q.length === 3 ? 'Los tres' : q.length === 1 ? `Solo ${q[0]}` : `${q[0]} y ${q[1]}`; };
        const otras = asignaciones(3).filter(a => a.join() !== sol.join()).map(a => ({ a, d: a.filter((x, i) => x !== sol[i]).length })).sort((p, q) => p.d - q.d || r() - 0.5);
        return {
          pregunta: `Cada uno siempre miente o siempre dice la verdad. ${N.map((n, i) => `${n}: ${fr[i].t}.`).join(' ')} ¿Quiénes dicen la verdad?`,
          dibujo: { datos: { columnas: ['Es', 'Su frase', 'Encaja'], filas: N, ancho: 82, celdas: N.map(() => ['', '', '']), notas: [{ t: 'Supón y comprueba' }] }, estado: {} },
          opciones: opcionesTexto(nombre(sol), otras.map((o, k) => ({ id: 'o' + k, texto: nombre(o.a), error: 'RMT-VYM-1', siFuera: 'Con esa suposición, al menos una frase no encaja con quien la dice.' }))),
          solucion: { texto: 'Es la única suposición donde las tres filas encajan.', dibujo: { datos: tablaSup(N, fr, sol), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: dos frases contradictorias ----------
  // Cambia: quién se supone culpable · Permanece: las cuatro declaraciones · Progresa: cuántas son ciertas · Se reserva:
  // el par «fue Beto» / «no fue Beto», que nunca coinciden · Debe verse: en un par contradictorio, exactamente una es cierta.
  const SOSP = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const DECL = [
    { quien: 'Ana', t: '«Fue Beto»', valor: c => c === 1 },
    { quien: 'Beto', t: '«Fue Dina»', valor: c => c === 3 },
    { quien: 'Ciro', t: '«Yo no fui»', valor: c => c !== 2 },
    { quien: 'Dina', t: '«Beto miente»', valor: c => c !== 3 },
  ];
  function tablaCulpa(c, decl = DECL, sosp = SOSP, extra = {}) {
    const ciertas = decl.filter(d => d.valor(c)).length;
    return {
      columnas: ['Dice', 'Es'], filas: sosp, ancho: 120,
      celdas: decl.map(d => [{ t: d.t, color: 'i' }, c === null ? '' : { t: d.valor(c) ? 'cierta' : 'falsa', color: d.valor(c) ? 'd' : 'h' }]),
      marcos: extra.marcos || [],
      notas: [{ t: c === null ? (extra.nota || 'Supón un culpable') : extra.nota || `Si fue ${sosp[c]}: ${ciertas} ${ciertas === 1 ? 'cierta' : 'ciertas'} y ${falsas(decl.length - ciertas)}` }],
    };
  }
  const contradictorias = {
    id: 'contradictorias',
    titulo: 'Dos frases que chocan',
    temas: ['Afirmaciones contradictorias'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Uno de los cuatro rompió el vaso y solo uno de ellos miente. Supón cada culpable y cuenta cuántas frases son falsas.',
      voz: 'Busca el culpable que deja exactamente una frase falsa.',
      controles: [{ id: 'c', etiqueta: 'Supón que fue', opciones: SOSP.map((n, k) => ({ valor: k, texto: n })) }],
      dibujo: val => ({ datos: tablaCulpa(val.c), estado: {} }),
      lectura: val => { const fal = DECL.filter(d => !d.valor(val.c)).length; return [`${falsas(fal)}: `, fal === 1 ? 'encaja con «solo uno miente»' : 'no encaja']; },
      minimo: 4,
      // Señala al sospechoso: la manija sube o baja por las filas del tablero.
      arrastres: [{ id: 'culpable', etiqueta: 'sospechoso que se supone culpable', color: 'c-o',
        donde: val => { const g = TAB().geometria(tablaCulpa(val.c)), p = g.centro(val.c, 1); return { x: p.x + g.cw / 2 - 14, y: p.y }; },
        mover: (pt, val) => ({ c: TAB().geometria(tablaCulpa(val.c)).casilla(pt.x, pt.y).f }) }],
    },
    predice: {
      pregunta: 'Sin saber quién fue, mira solo a Beto («Fue Dina») y a Dina («Beto miente»). ¿Qué se sabe de esas dos frases?',
      opciones: [
        { id: 'ambas', texto: 'Pueden ser falsas las dos', error: 'RMT-VYM-3', siFuera: 'Dos frases distintas pueden fallar juntas; estas no: si una falla, la otra acierta.' },
        { id: 'c', texto: 'Exactamente una es cierta', correcta: true },
        { id: 'nada', texto: 'Nada, hasta saber quién fue', error: 'RMT-VYM-4', siFuera: 'Sin saber quién fue ya se sabe algo: siempre una acierta y otra falla.' },
      ],
      dibujo: { datos: tablaCulpa(null), estado: {} },
      revelar: { datos: tablaCulpa(null, DECL, SOSP, { marcos: [{ f: 1, c: 0, ancho: 2, color: 'o' }, { f: 3, c: 0, ancho: 2, color: 'o' }], nota: 'Si Beto miente, Dina acierta; y al revés' }), estado: {} },
      coincide: 'Coincide: Dina dice justo lo contrario de Beto. Una de las dos es la mentira.',
    },
    mira: {
      datos: Object.assign(tablaCulpa(1), {
        marcos: [{ f: 1, c: 0, ancho: 2, color: 'o', desde: 1 }, { f: 3, c: 0, ancho: 2, color: 'o', desde: 1 }, { f: 0, c: 0, ancho: 2, color: 'd', desde: 2 }, { f: 2, c: 0, ancho: 2, color: 'd', desde: 2 }],
        notas: [{ t: 'Fue Beto: solo una frase falsa', desde: 3 }],
      }),
      base: {},
      pasos: [
        { estado: { corte: 1 }, texto: 'Beto y Dina se contradicen: el único mentiroso está entre ellos.' },
        { estado: { corte: 2 }, texto: 'Entonces Ana y Ciro dicen la verdad: fue Beto, y Ciro no fue.' },
        { estado: { corte: 3 }, texto: 'Se comprueba: con Beto culpable, solo Beto miente.' },
      ],
    },
    regla: {
      texto: 'Si una frase dice exactamente lo contrario de otra, una es cierta y la otra falsa. Si solo hay un mentiroso, está en ese par: los demás dicen la verdad.',
      ecuacion: [{ llave: ['p'], nota: 'una frase', color: 'c-i' }, ' y ', { llave: ['no p'], nota: 'su contraria', color: 'c-o' }, ': exactamente una es cierta'],
      condicion: 'las dos frases hablan de lo mismo y una es la negación completa de la otra, no solo una frase distinta.',
    },
    ahoraTu: {
      voz: 'Busca primero el par de frases que chocan.',
      generar(s) {
        const r = azar(s);
        const sosp = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito']).slice(0, 4);
        const culp = r.ent(0, 3), unoVeraz = s % 3 === 2;
        // Frases de tipo «fue X», «no fue X», «yo no fui», «X miente» (sobre «fue Y» de X). Se buscan con una sola respuesta.
        const tipos = (i) => {
          const x = r.elegir([0, 1, 2, 3].filter(j => j !== i));
          return r.elegir([
            { t: `«Fue ${sosp[x]}»`, valor: c => c === x },
            { t: `«No fue ${sosp[x]}»`, valor: c => c !== x },
            { t: '«Yo no fui»', valor: c => c !== i },
            { t: '«Yo fui»', valor: c => c === i },
          ]);
        };
        let decl = null;
        for (let t = 0; t < 500 && !decl; t++) {
          const d = [0, 1, 2, 3].map(tipos);
          const meta = unoVeraz ? 1 : 3;
          const val = [0, 1, 2, 3].filter(c => d.filter(x => x.valor(c)).length === meta);
          if (val.length === 1 && val[0] === culp) decl = d;
        }
        if (!decl) decl = [0, 1, 2, 3].map(i => (i === culp ? { t: '«Yo no fui»', valor: c => c !== i } : { t: `«Fue ${sosp[culp]}»`, valor: c => c === culp }));
        return {
          pregunta: `Uno de los cuatro rompió el vaso. ${unoVeraz ? 'Solo uno dice la verdad' : 'Solo uno miente'}. ${sosp.map((n, i) => `${n}: ${decl[i].t}.`).join(' ')} ¿Quién fue?`,
          dibujo: { datos: tablaCulpa(null, decl.map((d, i) => Object.assign({ quien: sosp[i] }, d)), sosp), estado: {} },
          opciones: opcionesTexto(sosp[culp], sosp.filter((_, k) => k !== culp).map((n, k) => ({ id: 'n' + k, texto: n, error: 'RMT-VYM-5', siFuera: `Si fuera ${n}, el número de frases falsas no sería el que pide el enunciado.` }))),
          solucion: { texto: `Solo con ${sosp[culp]} culpable se cumple «${unoVeraz ? 'solo uno dice la verdad' : 'solo uno miente'}».`, dibujo: { datos: tablaCulpa(culp, decl, sosp), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: negar bien una frase ----------
  // Cambia: quiénes aprobaron · Permanece: las frases «todos» y «ninguno» · Progresa: los casos donde las dos fallan ·
  // Se reserva: lo que dice un mentiroso · Debe verse: lo contrario de «todos» es «al menos uno no», no «ninguno».
  const ALUM = ['Ana', 'Beto', 'Ciro', 'Dina'];
  function tablaNota(ap, extra = {}) {
    const todos = ap.every(Boolean), ninguno = ap.every(x => !x);
    return {
      columnas: ['Aprobó'], filas: ALUM, ancho: 70,
      celdas: ap.map(x => [{ marca: x ? 'si' : 'no', color: x ? 'd' : 'h' }]),
      notas: [{ t: extra.nota || `«Todos aprobaron»: ${todos ? 'cierta' : 'falsa'}` }, { t: extra.nota2 || `«Ninguno aprobó»: ${ninguno ? 'cierta' : 'falsa'}` }],
    };
  }
  const negar = {
    id: 'negar-bien',
    titulo: 'Lo contrario de «todos»',
    temas: ['Personajes que siempre mienten o dicen la verdad', 'Afirmaciones contradictorias'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Elige cuántos de los cuatro aprobaron y mira si son ciertas las frases «todos aprobaron» y «ninguno aprobó».',
      voz: 'Busca un caso donde las dos frases fallen a la vez.',
      controles: [{ id: 'n', etiqueta: 'Aprobaron', min: 0, max: 4, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: val => ({ datos: tablaNota(ALUM.map((_, k) => k < val.n)), estado: {} }),
      lectura: val => [val.n === 4 ? '«Todos» es cierta' : val.n === 0 ? '«Ninguno» es cierta' : 'Las dos frases son falsas'],
      minimo: 3,
      // La manija es el borde entre los que aprobaron (arriba) y los que no: se baja o se sube por la columna.
      arrastres: [{ id: 'aprobaron', etiqueta: 'cuántos aprobaron', color: 'c-d',
        donde: val => { const g = TAB().geometria(tablaNota(ALUM.map((_, k) => k < val.n))); return { x: g.x0 + g.cw, y: g.y0 + val.n * g.altoFila }; },
        mover: (pt, val) => { const g = TAB().geometria(tablaNota(ALUM.map((_, k) => k < val.n))); return { n: (pt.y - g.y0) / g.altoFila }; } }],
    },
    predice: {
      pregunta: 'Un mentiroso dice: «Todos aprobaron». ¿Qué se sabe con certeza?',
      opciones: [
        { id: 'ninguno', texto: 'Que ninguno aprobó', error: 'RMT-VYM-6', siFuera: '«Ninguno» es un caso posible, pero también falla «todos» si solo uno desaprobó.' },
        { id: 'c', texto: 'Que al menos uno no aprobó', correcta: true },
        { id: 'mitad', texto: 'Que algunos aprobaron y otros no', error: 'RMT-VYM-7', siFuera: 'Puede pasar, pero también es posible que nadie aprobara.' },
      ],
      dibujo: { datos: tablaNota([true, true, true, true], { nota: '«Todos aprobaron»: lo dice un mentiroso', nota2: ' ' }), estado: {} },
      revelar: { datos: tablaNota([true, true, true, false], { nota: 'Basta uno que no aprobó', nota2: 'para que «todos» sea falsa' }), estado: {} },
      coincide: 'Coincide: «todos» se rompe con un solo caso que no cumple.',
    },
    mira: {
      datos: {
        columnas: ['Caso 1', 'Caso 2', 'Caso 3'], filas: ALUM, ancho: 76,
        celdas: ALUM.map((_, k) => [{ marca: k < 3 ? 'si' : 'no', color: k < 3 ? 'd' : 'h', desde: 1 }, { marca: k < 1 ? 'si' : 'no', color: k < 1 ? 'd' : 'h', desde: 2 }, { marca: 'no', color: 'h', desde: 3 }]),
        notas: [{ t: 'En los tres casos, «todos» es falsa', desde: 3 }, { t: 'Lo común: al menos uno no aprobó', desde: 4 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Si falla uno solo, «todos aprobaron» ya es falsa.' },
        { estado: { corte: 2 }, texto: 'También es falsa si fallan tres.' },
        { estado: { corte: 3 }, texto: 'Y si fallan todos.' },
        { estado: { corte: 4 }, texto: 'Lo que se repite en todos los casos es la negación.', ecuacion: ['no (todos) = al menos uno no'] },
      ],
    },
    regla: {
      texto: 'Negar «todos cumplen» es decir «al menos uno no cumple». Negar «ninguno cumple» es «al menos uno cumple». Negar «p y q» es «no p o no q».',
      ecuacion: ['no (p y q) = ', { llave: ['no p o no q'], nota: 'basta una', color: 'c-o' }, '   ·   ', 'no (p o q) = ', { llave: ['no p y no q'], nota: 'fallan las dos', color: 'c-h' }],
      condicion: 'la negación tiene que fallar exactamente cuando la frase original se cumple, en todos los casos.',
    },
    ahoraTu: {
      voz: 'Piensa en el caso más pequeño que rompe la frase.',
      generar(s) {
        const r = azar(s);
        const [a, b] = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva']).slice(0, 2);
        const grupo = r.elegir([['mis primos', 'son altos', 'es alto', 'no es alto', 'son altos'], ['los alumnos', 'llegaron temprano', 'llegó temprano', 'no llegó temprano', 'llegaron temprano'], ['las cajas', 'están llenas', 'está llena', 'no está llena', 'están llenas']]);
        const [g, pl, sg, nosg] = grupo;
        const tipo = s % 4;
        const casos = [
          { dice: `Todos ${g} ${pl}`, ok: `Al menos uno ${nosg}`, mal: [`Ninguno ${sg}`, `Todos ${g} no ${pl}`, `La mitad ${pl}`] },
          { dice: `Ninguno de ${g} ${sg}`, ok: `Al menos uno ${sg}`, mal: [`Todos ${g} ${pl}`, `Ninguno ${nosg}`, `Solo uno ${sg}`] },
          { dice: `${a} y ${b} aprobaron`, ok: `${a} o ${b} no aprobó`, mal: [`${a} y ${b} desaprobaron`, `${a} aprobó y ${b} no`, `Solo ${b} aprobó`] },
          { dice: `${a} o ${b} aprobó`, ok: `Ni ${a} ni ${b} aprobaron`, mal: [`${a} no aprobó y ${b} sí`, `Uno de los dos no aprobó`, `${a} y ${b} aprobaron`] },
        ][tipo];
        return {
          pregunta: `Alguien que siempre miente dice: «${casos.dice}». ¿Qué es seguro?`,
          opciones: opcionesTexto(casos.ok, casos.mal.map((t, k) => ({ id: 'm' + k, texto: t, error: k === 0 ? 'RMT-VYM-6' : 'RMT-VYM-7', siFuera: 'Es un caso posible, pero la frase también falla en otros casos.' }))),
          solucion: { texto: 'La frase dicha es falsa; se escribe lo que falla exactamente cuando ella se cumple.', ecuacion: tipo < 2 ? ['no (todos) = alguno no', '   ·   ', 'no (ninguno) = alguno sí'] : [tipo === 2 ? 'no (p y q) = no p o no q' : 'no (p o q) = no p y no q'] },
        };
      },
    },
  };
  void V; void M;

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: el acertijo de tres que la idea 1 no deja jugar, con la frase de Ciro cambiable: hay frases con una,
  // ninguna o varias suposiciones coherentes (el caso raro: la información no decide).
  const FRASES_CIRO = [
    { valor: 0, texto: 'Ana y Beto mienten', f: v => !v[0] && !v[1] },
    { valor: 1, texto: 'Ana miente', f: v => !v[0] },
    { valor: 2, texto: 'Beto dice la verdad', f: v => v[1] },
  ];
  const fr3 = k => [FR3[0], FR3[1], { t: `Ciro: «${FRASES_CIRO[k].texto}»`, valor: FRASES_CIRO[k].f }];
  const v3 = val => [val.a === 'V', val.b === 'V', val.c === 'V'];
  const datos3 = val => tablaSup(TRES, fr3(val.fc), v3(val));
  const VM = [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }];
  const mesaTres = {
    id: 'tres-que-hablan', titulo: 'Tres que hablan', pieza: 'rm-tablero',
    consigna: 'Ana: «Beto miente». Beto: «Ciro miente». Cambia lo que dice Ciro y busca cuántas suposiciones encajan.',
    controles: [
      { id: 'fc', etiqueta: 'Ciro dice', opciones: FRASES_CIRO.map(o => ({ valor: o.valor, texto: o.texto })) },
      { id: 'a', etiqueta: 'Ana', opciones: VM }, { id: 'b', etiqueta: 'Beto', opciones: VM }, { id: 'c', etiqueta: 'Ciro', opciones: VM },
    ],
    dibujo: val => ({ datos: datos3(val), estado: {} }),
    lectura: val => {
      const n = asignaciones(3).filter(x => coherente(fr3(val.fc), x)).length;
      return [coherente(fr3(val.fc), v3(val)) ? 'Encaja' : 'Choca', ` · ${n} de 8 suposiciones encajan`];
    },
    arrastres: [['ana', 0, 'a'], ['beto', 1, 'b'], ['ciro', 2, 'c']].map(([id, fila, c]) =>
      Object.assign({ id, etiqueta: `${TRES[fila]}: veraz o miente`, color: 'c-d' }, interruptor(datos3, fila, c))),
  };
  // Mesa 2: el culpable con las dos condiciones del examen, «solo uno miente» o «solo uno dice la verdad».
  const datosCulpa = val => {
    const fal = DECL.filter(d => !d.valor(val.c)).length, pide = val.cond === 'miente' ? 1 : 3;
    return Object.assign(tablaCulpa(val.c), { notas: [{ t: `Fue ${SOSP[val.c]}: ${falsas(fal)}; se piden ${pide}` }] });
  };
  const mesaCulpa = {
    id: 'quien-fue', titulo: '¿Quién rompió el vaso?', pieza: 'rm-tablero',
    consigna: 'Señala al sospechoso y cambia la condición. Cuenta las frases falsas que deja cada culpable.',
    controles: [
      { id: 'cond', etiqueta: 'Condición', opciones: [{ valor: 'miente', texto: 'Solo uno miente' }, { valor: 'veraz', texto: 'Solo uno dice la verdad' }] },
      { id: 'c', etiqueta: 'Supón que fue', opciones: SOSP.map((n, k) => ({ valor: k, texto: n })) },
    ],
    dibujo: val => ({ datos: datosCulpa(val), estado: {} }),
    lectura: val => {
      const fal = DECL.filter(d => !d.valor(val.c)).length, pide = val.cond === 'miente' ? 1 : 3;
      return [`${SOSP[val.c]}: ${falsas(fal)} · `, fal === pide ? 'encaja' : 'no encaja'];
    },
    arrastres: [{ id: 'culpable', etiqueta: 'sospechoso que se supone culpable', color: 'c-o',
      donde: val => { const g = TAB().geometria(datosCulpa(val)), p = g.centro(val.c, 1); return { x: p.x + g.cw / 2 - 14, y: p.y }; },
      mover: (pt, val) => ({ c: TAB().geometria(datosCulpa(val)).casilla(pt.x, pt.y).f }) }],
  };
  // Mesa 3: seis alumnos y las cuatro frases, cada una al lado de su negación: siempre valen lo contrario.
  const SEIS = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'];
  const vf = b => (b ? 'cierta' : 'falsa');
  const datosSeis = val => {
    const ap = SEIS.map((_, k) => k < val.n), todos = ap.every(Boolean), ninguno = !ap.some(Boolean);
    return {
      columnas: ['Aprobó'], filas: SEIS, ancho: 70,
      celdas: ap.map(x => [{ marca: x ? 'si' : 'no', color: x ? 'd' : 'h' }]),
      notas: [{ t: `Todos: ${vf(todos)} · Alguno no: ${vf(!todos)}` }, { t: `Ninguno: ${vf(ninguno)} · Alguno sí: ${vf(!ninguno)}` }],
    };
  };
  const mesaSeis = {
    id: 'seis-alumnos', titulo: 'Cada frase y su contraria', pieza: 'rm-tablero',
    consigna: 'Baja o sube el borde de los que aprobaron. Cada frase está junto a su negación: compara cómo cambian.',
    controles: [{ id: 'n', etiqueta: 'Aprobaron', min: 0, max: 6, paso: 1, inicio: 6, decimales: 0 }],
    dibujo: val => ({ datos: datosSeis(val), estado: {} }),
    lectura: val => [`${f0(val.n)} de 6 aprobaron · `, val.n === 6 ? '«todos» se cumple' : val.n === 0 ? '«ninguno» se cumple' : 'ni «todos» ni «ninguno»'],
    arrastres: [{ id: 'aprobaron', etiqueta: 'cuántos aprobaron', color: 'c-d',
      donde: val => { const g = TAB().geometria(datosSeis(val)); return { x: g.x0 + g.cw, y: g.y0 + val.n * g.altoFila }; },
      mover: (pt, val) => { const g = TAB().geometria(datosSeis(val)); return { n: (pt.y - g.y0) / g.altoFila }; } }],
  };

  return {
    unidad: 'razonamiento-matematico.verdades-y-mentiras',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js'],
    // Laboratorio: el acertijo de tres con la frase de Ciro cambiable, el culpable con las dos condiciones y las
    // cuatro frases de «todos/ninguno» junto a su negación.
    laboratorio: [mesaTres, mesaCulpa, mesaSeis],
    historia: {
      texto: 'En 1847 y 1854, George Boole propuso tratar las frases lógicas con un álgebra: cada una es verdadera o falsa, y se combinan con reglas. Las tablas de verdad que usamos hoy llegaron después. Los acertijos de veraces y mentirosos juntan dos capas: lo que dice la frase y quién la dice.',
      pregunta: '¿Se puede atrapar a un mentiroso solo con lógica?',
      fuente: { titulo: 'George Boole · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/archives/sum2021/entries/boole/' },
    },
    ideas: [suposicion, contradictorias, negar],
  };
});
