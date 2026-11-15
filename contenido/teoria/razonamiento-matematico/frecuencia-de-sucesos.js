/*
 * Teoría de «Frecuencia de sucesos» (razonamiento-matematico.frecuencia-de-sucesos).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 11); historia: NIST, relojes tempranos.
 * Precisión: se declara si se cuenta el suceso inicial; el MCM solo vale si los dos empiezan juntos. Los contextos de
 * pastillas son ejercicios de conteo, no indicaciones médicas.
 * Colores (regla 4): sucesos de A naranja (c-o), de B turquesa (c-i), coincidencias verde (c-d), lo que se cuenta rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMP1 (puntos contra intervalos); RMT-FRE-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar sucesos que se repiten: con el primero incluido, cuándo coinciden dos ritmos y cuántas campanadas hay.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: cuenta tomas en un periodo, halla la próxima coincidencia y suma campanadas de un día.
 *   Orden de atención: 1.º las marcas en la línea del tiempo · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿por qué 24 h cada 8 h son 4 tomas y no 3?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const T = { v: 'c-o', t: 'T' }, D = { v: 'c-h', t: 'D' }, Nn = { v: 'c-h', t: 'N' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesNum(correcta, distractores, fmt = x => f(x)) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor <= 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: fmt(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : a), mcm = (a, b) => a * b / mcd(a, b);
  const plural = (n, uno, varios) => `${f(n, 0)} ${n === 1 ? uno : varios}`;

  // Gesto directo (docs/teoria.md §4b): las manijas viven en la geometría que exportan las piezas.
  const RECTA = () => Kit.piezas.recta, TAB = () => Kit.piezas['rm-tablero'];
  // Manija sobre la recta en el valor val[id] (fila k); al moverla, el valor bajo el dedo.
  const manijaRecta = (datosDe, id, fila, extra) => Object.assign({
    donde: val => { const g = RECTA().geometria(datosDe(val)); return { x: g.x(val[id]), y: g.filaY(fila) }; },
    mover: (pt, val) => { const d = datosDe(val), g = RECTA().geometria(d); return { [id]: d.min + (pt.x - g.x(d.min)) * (d.max - d.min) / (g.x(d.max) - g.x(d.min)) }; },
  }, extra);

  // ---------- Idea 1: tomas cada T horas ----------
  // Cambia: cada cuántas horas · Permanece: un periodo de 24 h que empieza con una toma · Progresa: las marcas ·
  // Se reserva: tres días · Debe verse: la toma de la hora 0 también cuenta.
  const tomas = (Tp, Dp, extra = {}) => ({
    min: 0, max: Dp, paso: Tp, cada: Dp > 48 ? 2 : 1, sufijo: ' h', decimales: 0, variable: 't', color: 'h', filas: 2,
    elementos: [
      { tipo: 'enteros', a: 0, b: Dp, cada: Tp, color: 'o', rotulo: extra.rotulo },
      { tipo: 'punto', x: 0, color: 'd', rotulo: 'primera', fila: 1, desde: extra.desdePrimera || 0 },
    ],
  });
  const pastillas = {
    id: 'tomas-cada-t',
    titulo: 'La primera toma también cuenta',
    temas: ['Pastillas y recetas'],
    pieza: 'recta',
    juega: {
      consigna: 'Una toma al empezar y luego una cada T horas, durante 24 horas. Cambia T y cuenta las marcas.',
      voz: 'Compara las marcas con los espacios entre ellas.',
      controles: [{ id: 'T', etiqueta: 'Cada', min: 2, max: 8, paso: 2, inicio: 4, unidad: 'h', decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: tomas(val.T, 24), estado: {} }),
      lectura: val => [`24 / ${val.T} = ${24 / val.T} espacios · `, Nn, ` = ${24 / val.T + 1} tomas`],
      minimo: 3,
      // Se arrastra la segunda toma: dónde cae fija cada cuántas horas se toma.
      arrastres: [manijaRecta(() => tomas(8, 24), 'T', 0, { id: 'segunda', etiqueta: 'segunda toma', color: 'c-o' })],
    },
    predice: {
      pregunta: 'Una toma al empezar y luego una cada 8 horas, durante 3 días completos. ¿Cuántas tomas hay, contando la primera y la de la hora 72?',
      opciones: [
        { id: 'nueve', texto: '9', error: 'RMP1', siFuera: '9 son los espacios de 8 h; las tomas son uno más.' },
        { id: 'c', texto: '10', correcta: true },
        { id: 'doce', texto: '12', error: 'RMT-FRE-1', siFuera: '12 sería con una toma cada 6 h.' },
      ],
      dibujo: { datos: tomas(8, 72), estado: {} },
      revelar: { datos: tomas(8, 72, { rotulo: '10 tomas' }), estado: {} },
      coincide: 'Coincide: 72 / 8 = 9 espacios, y 9 espacios tienen 10 extremos.',
    },
    mira: {
      datos: tomas(8, 24, { desdePrimera: 1 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'En 24 h caben 24 / 8 = 3 espacios.', ecuacion: [{ frac: [D, T] }, ' = 3'] },
        { estado: { corte: 1 }, texto: 'Las tomas están en los bordes de los espacios: 0, 8, 16 y 24.', ecuacion: [Nn, ' = 3 + 1 = 4'] },
      ],
    },
    regla: {
      texto: 'Si hay toma al empezar y al terminar, las tomas son una más que los espacios de T horas que caben en el periodo.',
      ecuacion: [Nn, ' = ', { llave: [{ frac: [D, T] }], nota: 'espacios', color: 'c-o' }, ' + ', { llave: ['1'], nota: 'la primera', color: 'c-d' }],
      condicion: 'hay toma en el instante inicial y D es múltiplo de T; si no se toma al final, se resta 1.',
    },
    ahoraTu: {
      pieza: 'recta',
      voz: 'Cuenta espacios y luego bordes.',
      generar(s) {
        const r = azar(s), Tp = r.elegir([4, 6, 8, 12]), dias = r.ent(1, 4), Dp = 24 * dias, bien = Dp / Tp + 1;
        return {
          pregunta: `Una toma al empezar y luego una cada ${Tp} horas, durante ${dias === 1 ? 'un día completo' : `${dias} días completos`}. ¿Cuántas tomas hay, contando la primera y la última?`,
          dibujo: { datos: tomas(Tp, Dp), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'esp', valor: bien - 1, error: 'RMP1', siFuera: 'Esos son los espacios; falta la primera toma.' },
            { id: 'mas', valor: bien + 1, error: 'RMT-FRE-2', siFuera: 'Se contó una toma de más.' },
            { id: 'dia', valor: (24 / Tp) * dias, error: 'RMP1', siFuera: 'Contar por día deja fuera la toma del final.' },
          ]),
          solucion: { texto: `${Dp} / ${Tp} = ${Dp / Tp} espacios, y uno más de bordes.`, ecuacion: [Nn, ` = ${Dp / Tp} + 1 = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: turnos que coinciden (MCM) ----------
  // Cambia: el ritmo de B · Permanece: A cada 4 días, empezando juntos · Progresa: las coincidencias · Se reserva:
  // 6 y 8, cuyo producto engaña · Debe verse: vuelven a coincidir en el MCM, no en el producto.
  const turnos = (a, b, L, extra = {}) => ({
    min: 0, max: L, paso: 1, cada: L > 30 ? 4 : 2, decimales: 0, variable: 'día', color: 'h', filas: 3,
    elementos: [
      { tipo: 'enteros', a: 0, b: L, cada: a, color: 'o', rotulo: `A cada ${a}`, fila: 0 },
      { tipo: 'enteros', a: 0, b: L, cada: b, color: 'i', rotulo: `B cada ${b}`, fila: 1 },
      { tipo: 'enteros', a: 0, b: L, cada: mcm(a, b), color: 'd', rotulo: extra.rotulo || 'juntos', fila: 2, desde: extra.desde || 0 },
    ],
  });
  const coinciden = {
    id: 'turnos-mcm',
    titulo: 'Turnos que vuelven a coincidir',
    temas: ['Dietas y turnos'],
    pieza: 'recta',
    juega: {
      consigna: 'A descansa cada 4 días y B cada cierto número de días; hoy descansan juntos. Cambia el ritmo de B y mira cuándo coinciden.',
      voz: 'Busca la primera marca verde después del día 0.',
      controles: [{ id: 'b', etiqueta: 'B cada', min: 2, max: 10, paso: 1, inicio: 6, unidad: 'días', decimales: 0, color: 'c-i' }],
      // La recta mide siempre 36 días (el mayor MCM del juego), así la manija no salta al cambiar la escala.
      dibujo: val => ({ datos: turnos(4, val.b, 36), estado: {} }),
      lectura: val => [`Vuelven a coincidir el día ${mcm(4, val.b)}`],
      minimo: 3,
      // Se arrastra el primer descanso de B: ese día fija su ritmo.
      arrastres: [manijaRecta(val => turnos(4, val.b, 36), 'b', 1, { id: 'ritmo-b', etiqueta: 'primer descanso de B', color: 'c-i' })],
    },
    predice: {
      pregunta: 'Ana descansa cada 6 días y Beto cada 8. Hoy descansaron juntos. ¿Dentro de cuántos días vuelven a descansar juntos?',
      opciones: [
        { id: 'prod', texto: '48', error: 'RMT-FRE-3', siFuera: '48 también es común, pero antes ya coinciden: el producto no siempre es el primero.' },
        { id: 'c', texto: '24', correcta: true },
        { id: 'suma', texto: '14', error: 'RMT-FRE-4', siFuera: '14 suma los ritmos; el día 14 Ana no descansa.' },
        { id: 'mcd', texto: '2', error: 'RMT-FRE-5', siFuera: '2 es el MCD; ninguno descansa ese día.' },
      ],
      dibujo: { datos: Object.assign(turnos(6, 8, 48), { elementos: turnos(6, 8, 48).elementos.slice(0, 2) }), estado: {} },
      revelar: { datos: turnos(6, 8, 48, { rotulo: 'juntos: 24, 48' }), estado: {} },
      coincide: 'Coincide: 24 es el menor número que es múltiplo de 6 y de 8 a la vez.',
    },
    mira: {
      datos: turnos(6, 8, 48, { desde: 1 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Ana: 6, 12, 18, 24… Beto: 8, 16, 24…' },
        { estado: { corte: 1 }, texto: 'El primer número que está en las dos listas es 24.', ecuacion: ['MCM(6, 8) = 24'] },
      ],
    },
    regla: {
      texto: 'Dos sucesos que empiezan juntos y se repiten cada a y cada b días vuelven a coincidir cada MCM(a, b) días.',
      ecuacion: ['coinciden cada ', { llave: ['MCM(a, b)'], nota: 'menor múltiplo común', color: 'c-d' }],
      condicion: 'los dos empiezan el mismo día; si empiezan en días distintos, el MCM solo no basta.',
    },
    ahoraTu: {
      pieza: 'recta',
      voz: 'Escribe los múltiplos de cada uno hasta el primero común.',
      generar(s) {
        const r = azar(s);
        let a, b;
        do { a = r.ent(2, 12); b = r.ent(2, 12); } while (a === b || mcd(a, b) === 1 && a * b > 60 || a % b === 0 || b % a === 0);
        const m = mcm(a, b);
        return {
          pregunta: `Una combi sale cada ${a} minutos y otra cada ${b}. A las 7:00 salieron juntas. ¿Dentro de cuántos minutos vuelven a salir juntas?`,
          dibujo: { datos: Object.assign(turnos(a, b, Math.max(24, m)), { elementos: turnos(a, b, Math.max(24, m)).elementos.slice(0, 2) }), estado: {} },
          opciones: opcionesNum(m, [
            { id: 'prod', valor: a * b, error: 'RMT-FRE-3', siFuera: 'El producto es común, pero puede no ser el primero.' },
            { id: 'suma', valor: a + b, error: 'RMT-FRE-4', siFuera: 'La suma de los ritmos no es múltiplo de ambos.' },
            { id: 'mcd', valor: mcd(a, b), error: 'RMT-FRE-5', siFuera: 'Ese es el MCD.' },
          ]),
          solucion: { texto: `El menor múltiplo común de ${a} y ${b}.`, ecuacion: [`MCM(${a}, ${b}) = ${m}`], dibujo: { datos: turnos(a, b, Math.max(24, m)), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: campanadas en un día ----------
  // Cambia: hasta qué hora se cuenta · Permanece: un reloj que da tantas campanadas como la hora · Progresa: el total
  // acumulado · Se reserva: el día completo con las medias horas · Debe verse: se suman 1 + 2 + … + 12, dos veces al día.
  function campanas(h, extra = {}) {
    const cel = k => (k <= h && k >= (extra.desde || 1) ? { t: String(k), color: 'h', resalto: 'h' } : { t: String(k), tenue: true });
    return {
      columnas: null, filas: ['Hora', 'Toca', 'Hora', 'Toca'], ancho: 44,
      celdas: [
        [1, 2, 3, 4, 5, 6].map(k => ({ t: `${k}:00` })), [1, 2, 3, 4, 5, 6].map(cel),
        [7, 8, 9, 10, 11, 12].map(k => ({ t: `${k}:00` })), [7, 8, 9, 10, 11, 12].map(cel),
      ],
      notas: [{ t: extra.nota || `Hasta las ${h}:00: ${h * (h + 1) / 2} campanadas` }],
    };
  }
  // La hora k está en la fila «Toca» 1 (de 1 a 6) o 3 (de 7 a 12); soltar en una casilla da su hora.
  const lugarHora = k => (k <= 6 ? [1, k - 1] : [3, k - 7]);
  const manijaHora = (id, etiqueta, datosDe) => ({ id, etiqueta, color: 'c-h',
    donde: val => { const [fi, co] = lugarHora(val[id]); return TAB().geometria(datosDe(val)).centro(fi, co); },
    mover: (pt, val) => { const c = TAB().geometria(datosDe(val)).casilla(pt.x, pt.y); return { [id]: c.c + (c.f <= 1 ? 1 : 7) }; } });
  const total = {
    id: 'campanadas-del-dia',
    titulo: 'Sumar las campanadas del día',
    temas: ['Número de campanadas'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Un reloj da, en cada hora en punto, tantas campanadas como la hora. Cambia hasta qué hora cuentas y mira el total.',
      voz: 'Suma por parejas: 1 con 12, 2 con 11…',
      controles: [{ id: 'h', etiqueta: 'Hasta las', min: 1, max: 12, paso: 1, inicio: 3, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: campanas(val.h), estado: {} }),
      lectura: val => [`1 + 2 + … + ${val.h} = ${val.h * (val.h + 1) / 2}`],
      minimo: 3,
      // Se arrastra la última hora que suena por la fila «Toca».
      arrastres: [manijaHora('h', 'hasta qué hora se cuenta', val => campanas(val.h))],
    },
    predice: {
      pregunta: 'Ese reloj suena también una vez en cada media hora. ¿Cuántas campanadas da en un día completo, de 24 horas?',
      opciones: [
        { id: 'sinmedias', texto: '156', error: 'RMT-FRE-6', siFuera: '156 son las de las horas en punto; faltan las 24 medias horas.' },
        { id: 'c', texto: '180', correcta: true },
        { id: 'una', texto: '90', error: 'RMT-FRE-7', siFuera: '90 cuenta medio día; las 12 horas se repiten dos veces.' },
        { id: 'veinti', texto: '300', error: 'RMT-FRE-8', siFuera: '300 suma de 1 a 24; el reloj vuelve a 1 después de las 12.' },
      ],
      dibujo: { datos: campanas(12), estado: {} },
      revelar: { datos: campanas(12, { nota: '2 · 78 + 24 = 180' }), estado: {} },
      coincide: 'Coincide: 78 por cada vuelta de 12 horas, dos vueltas, y 24 medias horas.',
    },
    mira: {
      datos: campanas(12, { nota: '1 + 2 + … + 12 = 78' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'En 12 horas: 1 + 2 + … + 12, por parejas que suman 13.', ecuacion: ['6 · 13 = 78'] },
        { estado: { corte: 0 }, texto: 'Un día tiene dos vueltas de 12 horas.', ecuacion: ['2 · 78 = 156'] },
        { estado: { corte: 0 }, texto: 'Y 24 medias horas, de una campanada.', ecuacion: ['156 + 24 = 180'] },
      ],
    },
    regla: {
      texto: 'Si el reloj da tantas campanadas como la hora, de la 1 a la n suenan 1 + 2 + … + n. Se agregan aparte las campanadas de las medias horas.',
      ecuacion: ['1 + 2 + … + ', { llave: ['n'], nota: 'última hora', color: 'c-h' }, ' = ', { frac: ['n(n + 1)', '2'] }],
      condicion: 'el reloj marca de 1 a 12 y repite; se aclara si se cuentan las horas de inicio y fin del periodo.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Suma las horas en punto y luego las medias.',
      generar(s) {
        const r = azar(s), a = r.ent(1, 6), b = r.ent(a + 3, 12), medias = s % 2 === 1;
        const horas = (b * (b + 1) - (a - 1) * a) / 2, nm = medias ? b - a : 0, bien = horas + nm;
        return {
          pregunta: `Un reloj da tantas campanadas como la hora${medias ? ' y una en cada media hora' : ''}. ¿Cuántas da desde las ${a}:00 hasta las ${b}:00, ambas incluidas?`,
          dibujo: { datos: campanas(b, { desde: a, nota: `De las ${a}:00 a las ${b}:00` }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'desde1', valor: b * (b + 1) / 2 + nm, error: 'RMT-FRE-9', siFuera: `Eso empieza en la 1:00, no en las ${a}:00.` },
            { id: 'sinA', valor: horas - a + nm, error: 'RMP1', siFuera: 'Falta la hora de inicio, que está incluida.' },
            { id: 'medias', valor: medias ? horas : horas + b - a, error: 'RMT-FRE-6', siFuera: medias ? 'Faltan las medias horas.' : 'Este reloj no suena en las medias horas.' },
          ]),
          solucion: { texto: `Horas en punto: ${a} + … + ${b} = ${horas}${medias ? `; medias horas: ${nm}` : ''}.`, ecuacion: [`${horas}${medias ? ` + ${nm}` : ''} = ${bien}`] },
        };
      },
    },
  };
  void f;

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: cualquier ritmo de 1 a 12 h, de 1 a 3 días, y el caso raro: si T no divide al periodo, no hay toma al final.
  const tomasLibre = val => tomas(val.T, 24 * val.dias);
  // Cuántas tomas caben (la primera incluida) y a qué hora cae la última; lo usan la lectura y los retos.
  const cuentaTomas = val => { const Dp = 24 * val.dias, n = Math.floor(Dp / val.T) + 1; return { Dp, n, ult: (n - 1) * val.T }; };
  const mesaTomas = {
    id: 'receta-libre', titulo: 'Receta libre', pieza: 'recta',
    consigna: 'Arrastra la segunda toma: así fijas la frecuencia. Elige cuántos días dura la receta y prueba ritmos que no dividen a 24.',
    controles: [
      { id: 'T', etiqueta: 'Cada', min: 1, max: 12, paso: 1, inicio: 5, unidad: 'h', decimales: 0, color: 'c-o' },
      { id: 'dias', etiqueta: 'Días', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: tomasLibre(val), estado: {} }),
    lectura: val => {
      const { Dp, n, ult } = cuentaTomas(val);
      return [Nn, ` = ${n} tomas · la última a las ${ult}\u00a0h`, ult < Dp ? ' (antes del final)' : ''];
    },
    invitaciones: [
      { texto: 'Haz que la receta tenga justo 13 tomas.',
        logrado: val => cuentaTomas(val).n === 13,
        bien: 'Trece tomas son 12 espacios. ¿De cuántas maneras se logra?' },
      { texto: 'Con 3 días, busca el ritmo más espaciado que dé al menos 10 tomas.',
        logrado: val => val.dias === 3 && cuentaTomas(val).n >= 10 && cuentaTomas({ T: val.T + 1, dias: 3 }).n < 10,
        bien: 'Cada 8 h da 10 tomas; cada 9 h, ya solo 9.' },
      { texto: 'Con un ritmo impar, haz que la última toma caiga justo al final.',
        logrado: val => val.T % 2 === 1 && cuentaTomas(val).ult === cuentaTomas(val).Dp,
        bien: 'Cae al final porque el ritmo divide al periodo, sea par o impar.' },
      { texto: 'Guarda dos recetas con el mismo número de tomas y distinto ritmo.',
        logrado: (val, guardados) => guardados.some((a, i) => guardados.some((b, j) => j > i && a.T !== b.T
          && cuentaTomas(a).n === cuentaTomas(b).n)),
        bien: 'Mismas tomas, otro ritmo: el periodo también cambió.' },
    ],
    arrastres: [manijaRecta(tomasLibre, 'T', 0, { id: 'segunda', etiqueta: 'segunda toma', color: 'c-o' })],
  };
  // Mesa 2: tres ritmos a la vez, cada uno de 2 a 12 días, en una recta fija de 60 días.
  const L3 = 60;
  const mcm3 = val => mcm(mcm(val.a, val.b), val.c);
  const distintos = val => val.a !== val.b && val.b !== val.c && val.a !== val.c;
  const tresTurnos = val => {
    const m = mcm3(val);
    return {
      min: 0, max: L3, paso: 1, cada: 5, decimales: 0, variable: 'día', color: 'h', filas: 3,
      elementos: [
        { tipo: 'enteros', a: 0, b: L3, cada: val.a, color: 'o', rotulo: `A cada ${val.a}`, fila: 0 },
        { tipo: 'enteros', a: 0, b: L3, cada: val.b, color: 'i', rotulo: `B cada ${val.b}`, fila: 1 },
        { tipo: 'enteros', a: 0, b: L3, cada: val.c, color: 'h', rotulo: `C cada ${val.c}`, fila: 2 },
        { tipo: 'enteros', a: 0, b: L3, cada: m, color: 'd', rotulo: m <= L3 ? 'los tres' : `los tres: día ${m}`, fila: 3 },
      ],
    };
  };
  const mesaTres = {
    id: 'tres-ritmos', titulo: 'Tres ritmos a la vez', pieza: 'recta',
    consigna: 'Hoy descansan juntos A, B y C. Arrastra el primer descanso de cada uno y busca cuándo vuelven a coincidir los tres.',
    controles: [
      { id: 'a', etiqueta: 'A cada', min: 2, max: 12, paso: 1, inicio: 4, unidad: 'días', decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'B cada', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'días', decimales: 0, color: 'c-i' },
      { id: 'c', etiqueta: 'C cada', min: 2, max: 12, paso: 1, inicio: 10, unidad: 'días', decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: tresTurnos(val), estado: {} }),
    lectura: val => [`MCM(${val.a}, ${val.b}, ${val.c}) = ${mcm3(val)}: los tres juntos ese día`],
    // Retos: todos los mide mcm3, la misma cuenta que pone la marca verde de «los tres».
    invitaciones: [
      { texto: 'Con tres ritmos distintos, haz que los tres coincidan antes del día 20.',
        logrado: val => distintos(val) && mcm3(val) < 20,
        bien: 'Si un ritmo es múltiplo de los otros, el MCM no crece.' },
      { texto: 'Haz que los tres vuelvan a coincidir justo el día 36.',
        logrado: val => mcm3(val) === 36,
        bien: '36 es el primer múltiplo común de los tres. ¿Hay otra terna así?' },
      { texto: 'Haz que el primer día juntos sea el producto de los tres ritmos.',
        logrado: val => distintos(val) && mcm3(val) === val.a * val.b * val.c,
        bien: 'Sin factores en común, el MCM es el producto. Si comparten, es menor.' },
      { texto: 'Busca tres ritmos que no vuelvan a coincidir en los 60 días de la recta.',
        logrado: val => mcm3(val) > L3,
        bien: 'El MCM pasó de 60: la marca verde queda fuera de la recta.' },
    ],
    arrastres: [['a', 0, 'A', 'c-o'], ['b', 1, 'B', 'c-i'], ['c', 2, 'C', 'c-h']].map(([id, fila, n, color]) =>
      manijaRecta(tresTurnos, id, fila, { id: `ritmo-${id}`, etiqueta: `primer descanso de ${n}`, color })),
  };
  // Mesa 3: un tramo cualquiera del día, con o sin las medias horas; se arrastran el inicio y el fin.
  const datosTramo = val => {
    const d = campanas(val.hasta, { desde: Math.min(val.desde, val.hasta) });
    d.notas = [{ t: `${tramoHoras(val)} en punto${val.medias ? ` + ${Math.max(0, val.hasta - val.desde)} medias` : ''}` }];
    return d;
  };
  const tramoHoras = val => { const a = Math.min(val.desde, val.hasta), b = val.hasta; return (b * (b + 1) - (a - 1) * a) / 2; };
  // Todo lo que suena en el tramo: horas en punto y, si suenan, las medias horas de adentro.
  const tramoTotal = val => tramoHoras(val) + (val.medias ? val.hasta - Math.min(val.desde, val.hasta) : 0);
  // El tramo de tres horas seguidas que más suena, buscado con la misma cuenta en todas las horas de la mesa.
  const MAX_TRES = Math.max(...Array.from({ length: 10 }, (_, k) => tramoTotal({ desde: k + 1, hasta: k + 3, medias: 1 })));
  const mesaTramo = {
    id: 'tramo-del-dia', titulo: 'Un tramo del día', pieza: 'rm-tablero',
    consigna: 'Arrastra la primera y la última hora del tramo, las dos incluidas. Agrega o quita las medias horas.',
    controles: [
      { id: 'desde', etiqueta: 'Desde las', min: 1, max: 12, paso: 1, inicio: 3, decimales: 0, color: 'c-h' },
      { id: 'hasta', etiqueta: 'Hasta las', min: 1, max: 12, paso: 1, inicio: 9, decimales: 0, color: 'c-h' },
      { id: 'medias', etiqueta: 'Medias horas', opciones: [{ valor: 0, texto: 'No suenan' }, { valor: 1, texto: 'Una campanada' }] },
    ],
    dibujo: val => ({ datos: datosTramo(val), estado: {} }),
    lectura: val => [`De ${Math.min(val.desde, val.hasta)}:00 a ${val.hasta}:00: `, plural(tramoTotal(val), 'campanada', 'campanadas')],
    invitaciones: [
      { texto: 'Arma un tramo que dé exactamente 50 campanadas.',
        logrado: val => tramoTotal(val) === 50,
        bien: 'Hay dos formas: con medias horas o sin ellas. ¿Encontraste las dos?' },
      { texto: 'Busca las tres horas seguidas que más campanadas dan.',
        logrado: val => val.hasta - val.desde === 2 && tramoTotal(val) === MAX_TRES,
        bien: 'Al final del medio día suenan más, y las medias suman un poco.' },
      { texto: 'Guarda el mismo tramo con y sin medias horas.',
        logrado: (val, guardados) => guardados.some((a, i) => guardados.some((b, j) => j > i && a.desde === b.desde
          && a.hasta === b.hasta && a.hasta > a.desde && a.medias !== b.medias)),
        bien: 'Las medias horas son una menos que las horas en punto del tramo.' },
    ],
    arrastres: [manijaHora('desde', 'primera hora del tramo', datosTramo), manijaHora('hasta', 'última hora del tramo', datosTramo)],
  };

  return {
    unidad: 'razonamiento-matematico.frecuencia-de-sucesos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/rm-tablero.js'],
    // Glosario: las palabras que este tema estrena en el curso (docs/teoria.md, 4d). «Intervalo» y «campanada» vienen
    // de relojes y calendarios.
    glosario: [
      { termino: 'suceso', def: 'Algo que pasa en un momento dado y se puede contar, como una toma o un golpe del reloj.',
        ejemplo: 'Tomar una pastilla a las 8:00 es uno.', ver: ['frecuencia', 'periodo'] },
      { termino: 'frecuencia', def: 'Qué tan seguido se repite algo: una vez cada cierto tiempo.',
        ejemplo: 'Una toma cada 8 horas: 3 veces al día.', ver: ['suceso'] },
      { termino: 'periodo', def: 'Tramo de tiempo completo que se cuenta, desde que empieza hasta que termina.',
        ejemplo: 'Una receta de 3 días dura 72 horas.', ver: ['instante inicial'] },
      { termino: 'instante inicial', def: 'El momento en que se empieza a contar el tiempo: la hora 0.',
        ejemplo: 'Si la primera toma es a las 8:00, ahí está la hora 0.', ver: ['periodo'] },
      { termino: 'ambas incluidas', formas: ['ambas incluidas', 'las dos incluidas'],
        def: 'Que la primera y la última también entran en la cuenta.',
        ejemplo: 'De las 3:00 a las 5:00, así: 3, 4 y 5.' },
      { termino: 'múltiplo', def: 'Número que se obtiene al multiplicar otro por un entero: lo contiene una cantidad exacta de veces.',
        ejemplo: '24 lo es de 6 y de 8: 6 · 4 y 8 · 3.', ver: ['MCM'] },
      { termino: 'MCM', formas: ['MCM', 'menor múltiplo común', 'mínimo común múltiplo'],
        def: 'El número más pequeño, mayor que 0, que es múltiplo de dos o más números a la vez.',
        ejemplo: 'De 6 y 8: 6, 12, 18, 24 y 8, 16, 24. Es 24.', ver: ['múltiplo', 'MCD'] },
      { termino: 'MCD', formas: ['MCD', 'máximo común divisor'], def: 'El mayor número que divide exactamente a dos o más números.',
        ejemplo: 'De 6 y 8 es 2.', ver: ['MCM'] },
      { termino: 'producto', def: 'Resultado de multiplicar dos o más números.',
        ejemplo: 'El de 6 y 8 es 48, pero coinciden antes, el día 24.', ver: ['MCM'] },
      { termino: 'suma por parejas', formas: ['suma por parejas', 'por parejas'],
        def: 'Juntar el primero con el último, el segundo con el penúltimo, y así: cada pareja da lo mismo.',
        ejemplo: '1 + 2 + … + 12: 6 parejas de 13, en total 78.' },
    ],
    // Laboratorio: la receta con ritmos que no dividen al periodo, tres ritmos a la vez y un tramo cualquiera del día.
    laboratorio: [mesaTomas, mesaTres, mesaTramo],
    historia: {
      texto: 'Medir el tiempo exigió procesos que se repiten y formas de contarlos. La historia de los relojes que reúne el NIST muestra una búsqueda de ritmos cada vez más estables. El ejercicio de campanadas guarda una pregunta sencilla: cuántos intervalos separan cierto número de golpes.',
      pregunta: '¿Se cuentan los golpes o los espacios entre ellos?',
      fuente: { titulo: 'A Walk Through Time - Early Clocks · NIST', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-early-clocks' },
    },
    ideas: [pastillas, coinciden, total],
  };
});
