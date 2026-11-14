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
      ecuacion: [Nn, ' = ', { frac: [D, T] }, ' + 1'],
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
      dibujo: val => ({ datos: turnos(4, val.b, Math.max(24, mcm(4, val.b))), estado: {} }),
      lectura: val => [`Vuelven a coincidir el día ${mcm(4, val.b)}`],
      minimo: 3,
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
      ecuacion: ['coinciden cada MCM(a, b)'],
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
      ecuacion: ['1 + 2 + … + n = ', { frac: ['n(n + 1)', '2'] }],
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

  return {
    unidad: 'razonamiento-matematico.frecuencia-de-sucesos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'Medir el tiempo exigió procesos que se repiten y formas de contarlos. La historia de los relojes que reúne el NIST muestra una búsqueda de ritmos cada vez más estables. El ejercicio de campanadas guarda una pregunta sencilla: cuántos intervalos separan cierto número de golpes.',
      pregunta: '¿Se cuentan los golpes o los espacios entre ellos?',
      fuente: { titulo: 'A Walk Through Time - Early Clocks · NIST', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-early-clocks' },
    },
    ideas: [pastillas, coinciden, total],
  };
});
