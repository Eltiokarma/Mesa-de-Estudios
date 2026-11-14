/*
 * Teoría de «Relojes y calendarios» (razonamiento-matematico.cronometria-y-calendarios).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 9) y el desarrollo RM9 del expediente (fechas como
 * días transcurridos, tiempo real contra indicado, campanadas como intervalos); historia: USNO, calendarios.
 * Colores (regla 4): minutero naranja (c-o), horario turquesa (c-i), ángulo verde (c-d), lo que se cuenta rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMP1 (puntos contra intervalos; día de partida); RMT-REL-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: leer el reloj y el calendario con cuentas exactas: grados por minuto, intervalos y residuos entre 7.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla el ángulo entre agujas, la hora real de un reloj que adelanta, la duración de campanadas,
 *   si un año es bisiesto y el día de la semana de una fecha.
 *   Orden de atención: 1.º el reloj, la recta o el calendario · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿por qué a las 3:30 el ángulo no es 90°?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const H = { v: 'c-i', t: 'H' }, Mi = { v: 'c-o', t: 'M' }, A = { v: 'c-d', t: 'θ' }, N = { v: 'c-h', t: 'N' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const x of distractores) { if (!x.texto || vistos.has(x.texto) || /NaN/.test(x.texto) || ops.length >= 4) continue; vistos.add(x.texto); ops.push(x); }
    return ops;
  }
  const hhmm = (h, m) => `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}`;
  const angulo = (h, m) => { const d = Math.abs((30 * (h % 12) + 0.5 * m) - 6 * m) % 360; return Math.min(d, 360 - d); };
  const grados = x => `${f(x, 1)}°`;

  // ---------- Idea 1: ángulo entre las agujas ----------
  // Cambia: la hora y los minutos · Permanece: la esfera de 12 horas · Progresa: el horario que se corre con los minutos ·
  // Se reserva: una hora fuera del juego (8:20) · Debe verse: el horario no se queda sobre el número.
  const ang = {
    id: 'angulo-agujas',
    titulo: 'El horario también camina',
    temas: ['Ángulo entre las agujas del reloj'],
    pieza: 'rm-reloj',
    juega: {
      consigna: 'Mueve la hora y los minutos. Mira dónde queda el horario: no se queda sobre el número de la hora.',
      voz: 'Fíjate en el horario cuando pasan 30 minutos.',
      controles: [
        { id: 'h', etiqueta: 'Hora', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
        { id: 'm', etiqueta: 'Minutos', min: 0, max: 45, paso: 15, inicio: 0, decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: { relojes: [{ h: val.h, m: val.m, arco: true, texto: grados(angulo(val.h, val.m)), rotulo: hhmm(val.h, val.m) }] }, estado: {} }),
      lectura: val => [H, ` = ${f(30 * val.h + 0.5 * val.m, 1)}° · `, Mi, ` = ${6 * val.m}° · `, A, ` = ${grados(angulo(val.h, val.m))}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Qué ángulo menor forman las agujas a las 8:20?',
      opciones: [
        { id: 'fijo', texto: grados(Math.abs(240 - 120)), error: 'RMT-REL-1', siFuera: '120° sería con el horario quieto sobre el 8; en 20 minutos avanza 10° más.' },
        { id: 'c', texto: grados(angulo(8, 20)), correcta: true },
        { id: 'mayor', texto: grados(360 - angulo(8, 20)), error: 'RMT-REL-2', siFuera: 'Ese es el ángulo mayor; se pide el menor.' },
        { id: 'cuatro', texto: grados(4 * 30), error: 'RMT-REL-3', siFuera: 'Contar 4 espacios de hora deja fuera lo que avanzó el horario.' },
      ].filter((o, k, xs) => xs.findIndex(y => y.texto === o.texto) === k),
      dibujo: { datos: { relojes: [{ h: 8, m: 20, rotulo: '8:20' }] }, estado: {} },
      revelar: { datos: { relojes: [{ h: 8, m: 20, arco: true, texto: grados(angulo(8, 20)), rotulo: '8:20', fantasmaH: 8 }] }, estado: {} },
      coincide: 'Coincide: el horario está en 250°, un tercio de camino hacia el 9.',
    },
    mira: {
      datos: { relojes: [{ h: 8, m: 20, arco: { desde: 3 }, texto: grados(angulo(8, 20)), rotulo: '8:20', fantasmaH: 8 }] },
      pasos: [
        { estado: { corte: 1 }, texto: 'El minutero avanza 6° por minuto.', ecuacion: [Mi, ' = 6 · 20 = 120°'] },
        { estado: { corte: 2 }, texto: 'El horario avanza 30° por hora y 0,5° por minuto.', ecuacion: [H, ' = 30 · 8 + 0,5 · 20 = 250°'] },
        { estado: { corte: 3 }, texto: 'La diferencia es el ángulo; si pasa de 180°, se toma 360° menos.', ecuacion: [A, ' = 250 − 120 = 130°'] },
      ],
    },
    regla: {
      texto: 'Desde las 12, el minutero está en 6M grados y el horario en 30H + 0,5M grados. El ángulo es la diferencia; el menor no pasa de 180°.',
      ecuacion: [A, ' = | 30', H, ' − 5,5', Mi, ' |  (si pasa de 180°, 360° − ', A, ')'],
      condicion: 'H es la hora de 1 a 12 y M los minutos pasados de esa hora; las agujas se mueven sin saltos.',
    },
    ahoraTu: {
      pieza: 'rm-reloj',
      voz: 'Ubica cada aguja en grados desde las 12.',
      generar(s) {
        const r = azar(s), h = r.ent(1, 12), m = 2 * r.ent(1, 29);
        const bien = angulo(h, m), fijo = Math.min(Math.abs(30 * (h % 12) - 6 * m) % 360, 360 - Math.abs(30 * (h % 12) - 6 * m) % 360);
        return {
          pregunta: `¿Qué ángulo menor forman las agujas del reloj a las ${hhmm(h, m)}?`,
          dibujo: { datos: { relojes: [{ h, m, rotulo: hhmm(h, m) }] }, estado: {} },
          opciones: opcionesTexto(grados(bien), [
            { id: 'fijo', texto: grados(fijo), error: 'RMT-REL-1', siFuera: 'Así quedaría el horario quieto sobre la hora.' },
            { id: 'mayor', texto: grados(360 - bien), error: 'RMT-REL-2', siFuera: 'Ese es el ángulo mayor.' },
            { id: 'cinco', texto: grados(Math.abs(30 * (h % 12) - 5 * m)), error: 'RMT-REL-4', siFuera: 'El minutero va a 6° por minuto, no 5°.' },
            { id: 'dos', texto: grados(Math.abs(bien - 2)), error: 'RMT-REL-5', siFuera: 'Revisa el avance del horario: 0,5° por minuto.' },
          ]),
          solucion: { texto: 'Horario y minutero en grados, y su diferencia.', ecuacion: [H, ` = ${f(30 * (h % 12) + 0.5 * m, 1)}°, `, Mi, ` = ${6 * m}°, `, A, ` = ${grados(bien)}`], dibujo: { datos: { relojes: [{ h, m, arco: true, texto: grados(bien), rotulo: hhmm(h, m) }] }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: adelantos y atrasos ----------
  // Cambia: cuántas horas reales pasan · Permanece: lo que gana el reloj por hora real · Progresa: la diferencia acumulada ·
  // Se reserva: el problema al revés (dada la hora marcada, la real) · Debe verse: el adelanto se mide contra el tiempo real.
  const relojes = (hr, mr, hi, mi, extra = {}) => ({ relojes: [{ h: hr, m: mr, rotulo: `Real ${hhmm(hr, mr)}` }, { h: hi, m: mi, rotulo: `Marca ${hhmm(hi, mi)}`, arco: false }], pie: extra.pie });
  const sumaMin = (h, m, x) => { const t = h * 60 + m + x; return [Math.floor(t / 60) % 24, ((t % 60) + 60) % 60]; };
  const adelanto = {
    id: 'adelantos',
    titulo: 'El adelanto va por hora real',
    temas: ['Adelantos y atrasos'],
    pieza: 'rm-reloj',
    juega: {
      consigna: 'A las 8:00 se pone en hora un reloj que adelanta 3 minutos por cada hora real. Deja pasar horas y compara ambos relojes.',
      voz: 'El de la izquierda es el tiempo real.',
      controles: [{ id: 't', etiqueta: 'Horas reales', min: 0, max: 8, paso: 1, inicio: 0, decimales: 0, color: 'c-h' }],
      dibujo: val => { const [hi, mi] = sumaMin(8 + val.t, 0, 3 * val.t); return { datos: relojes(8 + val.t, 0, hi, mi), estado: {} }; },
      lectura: val => [`Pasaron ${val.t} h reales: adelanta ${3 * val.t} min`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ese reloj marca las 3:00 de la tarde. ¿Qué hora es en realidad?',
      opciones: [
        { id: 'resta', texto: '2:39', error: 'RMT-REL-6', siFuera: 'Restar 7 · 3 usaría 7 horas marcadas como si fueran reales. El reloj marca 63 min por hora real.' },
        { id: 'c', texto: '2:40', correcta: true },
        { id: 'tres', texto: '3:00', error: 'RMT-REL-7', siFuera: 'Eso olvida el adelanto acumulado.' },
        { id: 'suma', texto: '3:21', error: 'RMT-REL-8', siFuera: 'El reloj va adelantado: la hora real está antes, no después.' },
      ],
      dibujo: { datos: { relojes: [{ h: 8, m: 0, rotulo: 'Real ?' }, { h: 15, m: 0, rotulo: 'Marca 3:00' }] }, estado: {} },
      revelar: { datos: relojes(14, 40, 15, 0, {}), estado: {} },
      coincide: 'Coincide: marcó 420 minutos a razón de 63 por hora real: pasaron 400 minutos reales.',
    },
    mira: {
      datos: relojes(14, 40, 15, 0),
      pasos: [
        { estado: { corte: 0 }, texto: 'De 8:00 a 3:00 de la tarde el reloj marcó 420 minutos.', ecuacion: ['marcado = 420 min'] },
        { estado: { corte: 0 }, texto: 'Por cada 60 minutos reales marca 63.', ecuacion: ['real = 420 · ', { frac: ['60', '63'] }, ' = 400 min'] },
        { estado: { corte: 0 }, texto: '400 minutos después de las 8:00 son las 2:40 de la tarde.', ecuacion: ['8:00 + 6 h 40 min = 14:40'] },
      ],
    },
    regla: {
      texto: 'Un reloj que gana g minutos por hora real marca 60 + g minutos por cada 60 reales. El adelanto acumulado es g por cada hora real que pasó.',
      ecuacion: [{ frac: ['marcado', 'real'] }, ' = ', { frac: ['60 + g', '60'] }],
      condicion: 'el reloj gana siempre lo mismo y se sabe si g es por hora real o por hora marcada.',
    },
    ahoraTu: {
      pieza: 'rm-reloj',
      voz: 'Escribe cuántos minutos marca por cada hora real.',
      generar(s) {
        const r = azar(s), g = r.elegir([2, 3, 4, 5, 6]), h0 = r.ent(6, 10), t = r.ent(3, 8), atrasa = s % 4 === 3, inversa = s % 2 === 1;
        const gg = atrasa ? -g : g, marca = sumaMin(h0 + t, 0, gg * t), real = [h0 + t, 0];
        const txt = ([h, m]) => hhmm(h, m);
        const pregunta = inversa
          ? `A las ${h0}:00 se pone en hora un reloj que ${atrasa ? 'atrasa' : 'adelanta'} ${g} min por hora real. Marca las ${txt(marca)}. ¿Qué hora es en realidad?`
          : `A las ${h0}:00 se pone en hora un reloj que ${atrasa ? 'atrasa' : 'adelanta'} ${g} min por hora real. ¿Qué marca a las ${txt(real)} reales?`;
        const bien = inversa ? txt(real) : txt(marca);
        const otro = inversa ? txt(sumaMin(marca[0], marca[1], gg * t)) : txt(sumaMin(real[0], 0, -gg * t));
        return {
          pregunta,
          dibujo: { datos: { relojes: [{ h: h0, m: 0, rotulo: `Puesto a las ${h0}:00` }] }, estado: {} },
          opciones: opcionesTexto(bien, [
            { id: 'signo', texto: otro, error: 'RMT-REL-8', siFuera: 'El sentido del ajuste está al revés.' },
            { id: 'sin', texto: inversa ? txt(marca) : txt(real), error: 'RMT-REL-7', siFuera: 'Eso olvida lo que acumuló el reloj.' },
            { id: 'una', texto: inversa ? txt(sumaMin(marca[0], marca[1], -gg)) : txt(sumaMin(real[0], 0, gg)), error: 'RMT-REL-9', siFuera: 'Eso cuenta el ajuste de una sola hora.' },
          ]),
          solucion: { texto: `En ${t} horas reales el reloj ${atrasa ? 'atrasa' : 'adelanta'} ${g * t} minutos.`, ecuacion: [`${g} · ${t} = ${g * t} min`] },
        };
      },
    },
  };

  // ---------- Idea 3: campanadas (puntos contra intervalos) ----------
  // Cambia: cuántas campanadas · Permanece: el tiempo entre una y otra · Progresa: los intervalos · Se reserva: el
  // cálculo de un intervalo desconocido · Debe verse: n campanadas dejan n − 1 intervalos.
  const campanas = (n, tau, extra = {}) => ({
    min: 0, max: Math.max(10, (n - 1) * tau), paso: 1, cada: tau <= 2 ? 2 : tau, sufijo: ' s', decimales: 1, variable: 't', color: 'h', filas: 2,
    elementos: [{ tipo: 'enteros', a: 0, b: (n - 1) * tau, cada: tau, color: 'h' }, { tipo: 'distancia', a: 0, b: (n - 1) * tau, color: 'd', rotulo: `${n - 1} intervalos`, fila: 1, desde: extra.desde || 0 }],
  });
  const camp = {
    id: 'campanadas',
    titulo: 'Campanadas: se cuentan intervalos',
    temas: ['Campanadas'],
    pieza: 'recta',
    juega: {
      consigna: 'Un reloj da campanadas separadas por 2 segundos. Cambia cuántas da y mira cuánto dura, de la primera a la última.',
      voz: 'Cuenta los espacios entre puntos, no los puntos.',
      controles: [{ id: 'n', etiqueta: 'Campanadas', min: 2, max: 7, paso: 1, inicio: 2, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: campanas(val.n, 2), estado: { corte: 1 } }),
      lectura: val => [N, ` = ${val.n} · duración = ${val.n - 1} · 2 = ${2 * (val.n - 1)} s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro reloj da 6 campanadas en 10 segundos, de la primera a la última. ¿Cuánto tarda en dar 10 campanadas?',
      opciones: [
        { id: 'prop', texto: f(10 * 10 / 6, 1) + ' s', error: 'RMP1', siFuera: 'Eso reparte 10 s entre 6 campanadas; entre 6 hay solo 5 intervalos.' },
        { id: 'veinte', texto: '20 s', error: 'RMP1', siFuera: '20 s duplica la duración; 10 campanadas tienen 9 intervalos, no 10.' },
        { id: 'c', texto: '18 s', correcta: true },
      ],
      dibujo: { datos: campanas(6, 2), estado: { corte: 0 } },
      revelar: { datos: campanas(10, 2), estado: { corte: 1 } },
      coincide: 'Coincide: 5 intervalos en 10 s dan 2 s cada uno, y 10 campanadas tienen 9 intervalos.',
    },
    mira: {
      datos: campanas(6, 2, { desde: 1 }),
      pasos: [
        { estado: { corte: 0 }, texto: '6 campanadas son 6 puntos en la recta del tiempo.' },
        { estado: { corte: 1 }, texto: 'Entre 6 puntos hay 5 espacios: 10 s / 5 = 2 s cada uno.', ecuacion: ['τ = ', { frac: ['10', '6 − 1'] }, ' = 2 s'] },
        { estado: { corte: 1 }, texto: '10 campanadas tienen 9 espacios.', ecuacion: ['9 · 2 = 18 s'] },
      ],
    },
    regla: {
      texto: 'Entre n campanadas hay n − 1 intervalos. Primero se halla el intervalo con los datos y luego se multiplica por los intervalos pedidos.',
      ecuacion: ['duración = (', N, ' − 1) · τ'],
      condicion: 'el tiempo se mide de la primera a la última campanada y los intervalos son iguales.',
    },
    ahoraTu: {
      pieza: 'recta',
      voz: 'Convierte campanadas en intervalos.',
      generar(s) {
        const r = azar(s), n1 = r.ent(3, 8), tau = r.ent(1, 4), T1 = (n1 - 1) * tau, n2 = r.ent(n1 + 2, 13);
        const bien = (n2 - 1) * tau;
        return {
          pregunta: `Un reloj da ${n1} campanadas en ${T1} segundos. ¿Cuántos segundos tarda en dar ${n2} campanadas?`,
          dibujo: { datos: campanas(n1, tau), estado: { corte: 0 } },
          opciones: opcionesTexto(`${f(bien)} s`, [
            { id: 'prop', texto: `${f(T1 * n2 / n1, 1)} s`, error: 'RMP1', siFuera: 'Eso reparte el tiempo entre campanadas, no entre intervalos.' },
            { id: 'n', texto: `${f(n2 * tau)} s`, error: 'RMP1', siFuera: `${n2} campanadas tienen ${n2 - 1} intervalos.` },
            { id: 'tau', texto: `${f((n2 - 1) * T1 / n1, 1)} s`, error: 'RMP1', siFuera: `El intervalo es ${T1} / ${n1 - 1}, no ${T1} / ${n1}.` },
          ]),
          solucion: { texto: `Intervalo: ${T1} / ${n1 - 1} = ${tau} s; hay ${n2 - 1} intervalos.`, ecuacion: [`${n2 - 1} · ${tau} = ${bien} s`] },
        };
      },
    },
  };

  // ---------- Idea 4: años bisiestos ----------
  // Cambia: el año · Permanece: las tres preguntas (÷ 4, ÷ 100, ÷ 400) · Progresa: el veredicto · Se reserva: 2100 ·
  // Debe verse: divisible entre 4 no basta en los años que terminan en 00.
  const bis = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const div = (y, k) => y % k === 0;
  function tablaAnios(ys, extra = {}) {
    return {
      columnas: ['÷ 4', '÷ 100', '÷ 400', 'Días'], filas: ys.map(String), ancho: 62,
      celdas: ys.map(y => [div(y, 4), div(y, 100), div(y, 400)].map(b => ({ marca: b ? 'si' : 'no', color: b ? 'd' : 'h' })).concat([{ t: bis(y) ? '366' : '365', color: bis(y) ? 'o' : undefined }])),
      notas: [{ t: extra.nota || 'Bisiesto: 366 días' }],
    };
  }
  const bisiesto = {
    id: 'bisiestos',
    titulo: 'Cuándo un año es bisiesto',
    temas: ['Años normales y bisiestos'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Elige un año y mira si es divisible entre 4, 100 y 400, y cuántos días tiene.',
      voz: 'Compara 2000 con 2024.',
      controles: [{ id: 'y', etiqueta: 'Año', opciones: [2023, 2024, 2026, 2000, 2400].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: tablaAnios([val.y]), estado: {} }),
      lectura: val => [`${val.y}: ${bis(val.y) ? 'bisiesto, 366 días' : 'normal, 365 días'}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿El año 2100 será bisiesto?',
      opciones: [
        { id: 'si', texto: 'Sí: es divisible entre 4', error: 'RMT-REL-10', siFuera: 'Divisible entre 4 basta casi siempre, pero los años que terminan en 00 tienen otra condición.' },
        { id: 'c', texto: 'No: termina en 00 y no es divisible entre 400', correcta: true },
        { id: 'cien', texto: 'Sí: es divisible entre 100', error: 'RMT-REL-11', siFuera: 'Ser divisible entre 100 quita el bisiesto, salvo que también lo sea entre 400.' },
      ],
      dibujo: { datos: tablaAnios([2100], { nota: '¿366 o 365?' }), estado: {} },
      revelar: { datos: tablaAnios([1900, 2000, 2100]), estado: {} },
      coincide: 'Coincide: como 1900, el 2100 es divisible entre 100 pero no entre 400.',
    },
    mira: {
      datos: tablaAnios([2024, 2100, 2000], { nota: 'Primero ÷ 4, luego ÷ 100, luego ÷ 400' }),
      pasos: [
        { estado: { corte: 0 }, texto: '2024: divisible entre 4 y no termina en 00: bisiesto.' },
        { estado: { corte: 0 }, texto: '2100: termina en 00 y no es divisible entre 400: normal.' },
        { estado: { corte: 0 }, texto: '2000: divisible entre 400: bisiesto.' },
      ],
    },
    regla: {
      texto: 'En el calendario gregoriano, un año es bisiesto si es divisible entre 4, salvo los divisibles entre 100 que no lo son entre 400.',
      ecuacion: ['bisiesto ⇔ (÷4 y no ÷100) o ÷400'],
      condicion: 'se usa el calendario gregoriano; antes de su adopción, cada lugar usaba otro calendario.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Haz las tres divisiones en orden.',
      generar(s) {
        const r = azar(s), y = s % 3 === 0 ? 100 * r.ent(16, 30) : r.ent(1890, 2200);
        const bien = bis(y) ? 'Sí, tiene 366 días' : 'No, tiene 365 días';
        return {
          pregunta: `¿El año ${y} es bisiesto?`,
          opciones: [
            { id: 'si', texto: 'Sí, tiene 366 días', error: 'RMT-REL-10', siFuera: 'Revisa las tres divisiones: 4, 100 y 400.' },
            { id: 'no', texto: 'No, tiene 365 días', error: 'RMT-REL-12', siFuera: 'Revisa las tres divisiones: 4, 100 y 400.' },
          ].map(o => (o.texto === bien ? { id: o.id, texto: o.texto, correcta: true } : o)),
          solucion: { texto: `${y}: ${div(y, 4) ? 'divisible' : 'no divisible'} entre 4${div(y, 100) ? `, termina en 00 y ${div(y, 400) ? 'sí' : 'no'} es divisible entre 400` : ''}.`, dibujo: { datos: tablaAnios([y]), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: el día de la semana ----------
  // Cambia: cuántos días pasan · Permanece: el mes que empieza en lunes · Progresa: las semanas completas que se saltan ·
  // Se reserva: contar el día de partida · Debe verse: solo importa el residuo entre 7.
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  function mes(inicio, marca, extra = {}) {
    // inicio: índice del día de la semana del día 1; marca: día del mes a resaltar.
    const celdas = [];
    let fila = Array(7).fill('');
    for (let d = 1; d <= 31; d++) {
      const c = (inicio + d - 1) % 7;
      fila[c] = { t: String(d), color: d === marca ? 'o' : d === 1 ? 'i' : undefined, resalto: d === marca ? 'o' : d === 1 ? 'i' : undefined };
      if (c === 6 || d === 31) { celdas.push(fila); fila = Array(7).fill(''); }
    }
    return { columnas: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], filas: null, ancho: 42, celdas: celdas.slice(0, 5).concat(celdas.length > 5 ? [] : []), notas: [{ t: extra.nota || '' }] };
  }
  const semana = {
    id: 'dia-de-la-semana',
    titulo: 'Las semanas completas no cuentan',
    temas: ['Día de la semana de una fecha'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'El 1 de un mes cae lunes. Cambia cuántos días pasan y mira en qué día de la semana caes.',
      voz: 'Cada 7 días vuelves al mismo día de la semana.',
      controles: [{ id: 'n', etiqueta: 'Días después', min: 0, max: 27, paso: 1, inicio: 0, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: mes(0, 1 + val.n, { nota: `Día ${1 + val.n}: ${DIAS[val.n % 7]}` }), estado: {} }),
      lectura: val => [N, ` = ${val.n} = 7 · ${Math.floor(val.n / 7)} + ${val.n % 7} → ${DIAS[val.n % 7]}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En otro mes, el 1 cae viernes. ¿Qué día de la semana es el 18 de ese mes?',
      opciones: [
        { id: 'martes', texto: 'Martes', error: 'RMP1', siFuera: 'Martes sale al contar 18 días; del 1 al 18 pasan 17.' },
        { id: 'c', texto: 'Lunes', correcta: true },
        { id: 'domingo', texto: 'Domingo', error: 'RMT-REL-13', siFuera: 'Eso avanza 2 días; el residuo de 17 entre 7 es 3.' },
      ],
      dibujo: { datos: mes(4, 1, { nota: 'El 1 cae viernes' }), estado: {} },
      revelar: { datos: mes(4, 18, { nota: '17 = 2 · 7 + 3: viernes + 3 = lunes' }), estado: {} },
      coincide: 'Coincide: pasan 17 días; dos semanas completas no cambian el día y quedan 3.',
    },
    mira: {
      datos: mes(4, 18, { nota: 'Viernes + 3 = lunes' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Del 1 al 18 pasan 17 días: el 1 no se cuenta.', ecuacion: [N, ' = 18 − 1 = 17'] },
        { estado: { corte: 0 }, texto: 'Las semanas completas no cambian el día.', ecuacion: ['17 = 7 · 2 + 3'] },
        { estado: { corte: 0 }, texto: 'Se avanzan 3 días desde el viernes: lunes.', ecuacion: ['viernes + 3 = lunes'] },
      ],
    },
    regla: {
      texto: 'Se cuentan los días transcurridos desde una fecha de día conocido (sin contarla), se divide entre 7 y se avanza el residuo.',
      ecuacion: ['día final = día inicial + (', N, ' mód 7)'],
      condicion: 'si el intervalo cruza febrero, se revisa si el año es bisiesto para contar el 29.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Resta las fechas y quédate con el residuo entre 7.',
      generar(s) {
        const r = azar(s), ini = r.ent(0, 6), d1 = r.ent(1, 6), d2 = r.ent(d1 + 8, 31);
        const Nd = d2 - d1, bien = DIAS[(ini + Nd) % 7];
        const cap = x => x[0].toUpperCase() + x.slice(1);
        return {
          pregunta: `El ${d1} de un mes cae ${DIAS[ini]}. ¿Qué día de la semana es el ${d2} del mismo mes?`,
          opciones: opcionesTexto(cap(bien), [
            { id: 'mas1', texto: cap(DIAS[(ini + Nd + 1) % 7]), error: 'RMP1', siFuera: 'Eso cuenta también el día de partida.' },
            { id: 'menos1', texto: cap(DIAS[(ini + Nd + 6) % 7]), error: 'RMT-REL-13', siFuera: 'Revisa el residuo entre 7.' },
            { id: 'cociente', texto: cap(DIAS[(ini + Math.floor(Nd / 7)) % 7]), error: 'RMT-REL-14', siFuera: 'Se avanza el residuo, no el cociente.' },
          ]),
          solucion: { texto: `Pasan ${Nd} días: ${Math.floor(Nd / 7)} semanas y ${Nd % 7} días.`, ecuacion: [`${DIAS[ini]} + ${Nd % 7} = ${bien}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.cronometria-y-calendarios',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-reloj.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'Los calendarios intentan encajar ciclos del cielo en días enteros. La reforma gregoriana de 1582 corrigió la regla de los bisiestos del calendario juliano, y cada país la adoptó en fechas distintas. Para practicar, se usa la regla gregoriana; en una fecha histórica real, hay que revisar qué calendario regía.',
      pregunta: '¿Por qué no todos los años divisibles entre 4 son bisiestos?',
      fuente: { titulo: 'Leap Years · US Naval Observatory', url: 'https://aa.usno.navy.mil/faq/leap_years' },
    },
    ideas: [ang, adelanto, camp, bisiesto, semana],
  };
});
