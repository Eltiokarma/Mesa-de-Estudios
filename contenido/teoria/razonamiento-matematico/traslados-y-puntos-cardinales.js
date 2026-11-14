/*
 * Teoría de «Traslados y puntos cardinales» (razonamiento-matematico.traslados-y-puntos-cardinales).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 5); historia: navegación por estima (Whipple Museum).
 * Colores (regla 4): el camino recorrido naranja (c-o), el desplazamiento turquesa (c-i), los discos chicos verde (c-d),
 * el disco grande rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMT-TRS-* nuevos (hipótesis); RMP1 (puntos contra intervalos) donde aplica.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: separar lo que se camina de dónde se termina, y contar movimientos de fichas con una regla.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: calcula la distancia al punto de partida, el mínimo de movimientos de una torre y qué número pasar.
 *   Orden de atención: 1.º el camino en la cuadrícula o la torre · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «caminé 10 cuadras, ¿por qué estoy a 4?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const d = { v: 'c-i', t: 'd' }, cam = { v: 'c-o', t: 'camino' }, T = n => ({ sub: [{ v: 'c-h', t: 'T' }, n] });
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
    for (const x of distractores) { if (vistos.has(x.texto) || ops.length >= 4) continue; vistos.add(x.texto); ops.push(x); }
    return ops;
  }
  // Distancia en cuadras: entera si el cuadrado es perfecto; si no, como raíz.
  const raizTxt = k => { const q = Math.round(Math.sqrt(k)); return q * q === k ? `${f(q)}` : `√${k}`; };

  // ---------- Idea 1: camino recorrido contra desplazamiento ----------
  // Cambia: cuántas cuadras al este y al norte · Permanece: la cuadrícula y el punto de partida · Progresa: el camino que
  // crece mientras la flecha recta crece menos · Se reserva: la ida y vuelta, donde el camino sube y la flecha baja ·
  // Debe verse: la flecha une los extremos; el camino suma tramos.
  const SAL = [1.5, 5.5];
  const DIR = { E: [1, 0], O: [-1, 0], N: [0, -1], S: [0, 1] };
  function ruta(tramos, extra = {}) {
    let p = SAL.slice();
    const lineas = tramos.map(([dir, n], k) => {
      const q = [p[0] + DIR[dir][0] * n, p[1] + DIR[dir][1] * n];
      const l = { de: p, a: q, color: 'o', flecha: true, rotulo: `${n} ${dir}`, en: [(p[0] + q[0]) / 2 + (dir === 'N' || dir === 'S' ? 0.55 : 0), (p[1] + q[1]) / 2 + (dir === 'E' || dir === 'O' ? 0.55 : 0)], desde: extra.pasoTramo ? k + 1 : 0 };
      p = q; return l;
    });
    if (extra.recta !== false && (p[0] !== SAL[0] || p[1] !== SAL[1])) lineas.push({ de: SAL, a: p, color: 'i', flecha: true, desde: extra.desdeRecta || 0 });
    return {
      ancho: 9, alto: 6, cuadricula: 1, norte: true,
      nodos: [{ id: 'sal', x: SAL[0], y: SAL[1], r: 8, relleno: 1, color: 'i' }],
      lineas,
      pie: extra.pie,
    };
  }
  const desplaza = {
    id: 'camino-y-flecha',
    titulo: 'Lo caminado y dónde terminas',
    temas: ['Puntos cardinales y orientación'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Camina primero al este y luego al norte, por cuadras iguales. Compara las cuadras caminadas con la flecha recta desde la salida.',
      voz: 'La flecha turquesa va directo de la salida al final.',
      controles: [
        { id: 'e', etiqueta: 'Este', min: 1, max: 7, paso: 1, inicio: 3, unidad: 'cuadras', decimales: 0, color: 'c-o' },
        { id: 'n', etiqueta: 'Norte', min: 1, max: 5, paso: 1, inicio: 4, unidad: 'cuadras', decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: ruta([['E', val.e], ['N', val.n]]), estado: {} }),
      lectura: val => [cam, ` = ${val.e + val.n} · `, d, ` = ${raizTxt(val.e ** 2 + val.n ** 2)} cuadras`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora camina 3 cuadras al este, 4 al norte y 3 al oeste. ¿A cuántas cuadras de la salida termina, en línea recta?',
      opciones: [
        { id: 'camino', texto: '10 cuadras', error: 'RMT-TRS-1', siFuera: '10 es lo caminado. Volver 3 al oeste deshace las 3 del este.' },
        { id: 'cinco', texto: '5 cuadras', error: 'RMT-TRS-2', siFuera: '5 es la distancia tras los dos primeros tramos; el tercero la cambia.' },
        { id: 'c', texto: '4 cuadras', correcta: true },
        { id: 'resta', texto: '2 cuadras', error: 'RMT-TRS-3', siFuera: 'Eso resta tramos de direcciones distintas. Este y oeste se restan entre sí; el norte queda.' },
      ],
      dibujo: { datos: ruta([['E', 3], ['N', 4], ['O', 3]], { recta: false }), estado: {} },
      revelar: { datos: ruta([['E', 3], ['N', 4], ['O', 3]], { pie: 'Camino 10 · flecha 4 cuadras al norte' }), estado: {} },
      coincide: 'Coincide: este y oeste se anulan; solo quedan 4 cuadras al norte.',
    },
    mira: {
      datos: ruta([['E', 6], ['N', 4], ['O', 3]], { pasoTramo: true, desdeRecta: 4 }),
      pasos: [
        { estado: { corte: 1 }, texto: '6 cuadras al este.' },
        { estado: { corte: 2 }, texto: '4 al norte.' },
        { estado: { corte: 3 }, texto: '3 al oeste: el este neto queda en 6 − 3 = 3.', ecuacion: ['este neto = 6 − 3 = 3 · norte = 4'] },
        { estado: { corte: 4 }, texto: 'La flecha es la hipotenusa de 3 y 4.', ecuacion: [d, ' = ', { raiz: '3² + 4²' }, ' = 5 cuadras · ', cam, ' = 13'] },
      ],
    },
    regla: {
      texto: 'Para saber dónde terminas, se suman por separado los tramos este-oeste (con signo) y norte-sur. La distancia en línea recta sale de esos dos netos.',
      ecuacion: [d, ' = ', { raiz: ['(este neto)² + (norte neto)²'] }, '  ≤  ', cam],
      condicion: 'las cuadras miden lo mismo y las calles se cruzan en ángulo recto.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Separa los tramos este-oeste de los norte-sur.',
      generar(s) {
        const r = azar(s);
        const a = r.ent(2, 6), b = r.ent(2, 5), tipo = s % 2;
        const tramos = tipo ? [['E', a], ['N', b], ['O', r.ent(1, a - 1)]] : [['N', b], ['E', a], ['S', r.ent(1, b - 1)]];
        let x = 0, y = 0;
        for (const [dir, n] of tramos) { x += DIR[dir][0] * n; y -= DIR[dir][1] * n; }
        const k = x * x + y * y, camino = tramos.reduce((m, t) => m + t[1], 0);
        const txt = v => `${v} cuadras`;
        return {
          pregunta: `Desde la salida: ${tramos.map(([dir, n]) => `${n} cuadras al ${{ E: 'este', O: 'oeste', N: 'norte', S: 'sur' }[dir]}`).join(', ')}. ¿A qué distancia de la salida termina, en línea recta?`,
          dibujo: { datos: ruta(tramos, { recta: false }), estado: {} },
          opciones: opcionesTexto(txt(raizTxt(k)), [
            { id: 'camino', texto: txt(f(camino)), error: 'RMT-TRS-1', siFuera: 'Eso es lo caminado; algunos tramos se deshacen.' },
            { id: 'suma', texto: txt(f(Math.abs(x) + Math.abs(y))), error: 'RMT-TRS-4', siFuera: 'Eso camina por las calles; la línea recta corta en diagonal.' },
            { id: 'dos', texto: txt(raizTxt(a * a + b * b)), error: 'RMT-TRS-2', siFuera: 'Esa es la distancia tras dos tramos; falta el tercero.' },
            { id: 'resta', texto: txt(f(Math.abs(Math.abs(x) - Math.abs(y)) || camino + 1)), error: 'RMT-TRS-3', siFuera: 'Eso resta tramos de direcciones distintas.' },
          ]),
          solucion: { texto: `Netos: ${Math.abs(x)} al ${x >= 0 ? 'este' : 'oeste'} y ${Math.abs(y)} al ${y >= 0 ? 'norte' : 'sur'}.`, ecuacion: [d, ` = `, { raiz: `${Math.abs(x)}² + ${Math.abs(y)}²` }, ` = ${raizTxt(k)}`], dibujo: { datos: ruta(tramos), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: traslado de fichas (la torre que se muda) ----------
  // Cambia: cuántos discos · Permanece: tres palos y la regla (nunca uno grande sobre uno chico) · Progresa: los
  // movimientos mínimos · Se reserva: el disco grande, que se mueve una sola vez · Debe verse: T(n) = 2·T(n−1) + 1.
  const PALO = [1.8, 5, 8.2];
  function torre(palos, extra = {}) {
    const poligonos = [];
    palos.forEach((discos, p) => discos.forEach((t, k) => {
      const w = 0.35 + 0.2 * t, y = 5.4 - (k + 1) * 0.5;
      poligonos.push({ puntos: [[PALO[p] - w, y], [PALO[p] + w, y], [PALO[p] + w, y + 0.44], [PALO[p] - w, y + 0.44]], color: t === extra.grande ? 'h' : 'd', relleno: 0.3, grosor: 'contorno' });
    }));
    return {
      ancho: 10, alto: 6,
      lineas: PALO.map(x => ({ de: [x, 1.6], a: [x, 5.4], grosor: 'contorno' })).concat([{ de: [0.3, 5.42], a: [9.7, 5.42], grosor: 'contorno' }]),
      poligonos,
      textos: ['A', 'B', 'C'].map((t, k) => ({ x: PALO[k], y: 6.1, t })),
      pie: extra.pie,
    };
  }
  const minMov = n => 2 ** n - 1;
  const hanoi = {
    id: 'torre-que-se-muda',
    titulo: 'La torre que se muda',
    temas: ['Traslado de fichas y figuras'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Pasa la torre de A a C, un disco por vez, sin poner uno grande sobre uno chico. Cambia los discos y mira el mínimo.',
      voz: 'Compara cada mínimo con el anterior.',
      controles: [{ id: 'n', etiqueta: 'Discos', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: torre([Array.from({ length: val.n }, (_, k) => val.n - k), [], []], { grande: val.n }), estado: {} }),
      lectura: val => [T(val.n), ` = ${minMov(val.n)} movimientos`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con 3 discos el mínimo es 7 movimientos. ¿Cuántos son con 6 discos?',
      opciones: [
        { id: 'doble', texto: '14', error: 'RM2', siFuera: '14 sería si el doble de discos diera el doble de movimientos; cada disco extra duplica y suma 1.' },
        { id: 'c', texto: '63', correcta: true },
        { id: 'cuad', texto: '36', error: 'RMT-TRS-5', siFuera: '36 es 6 · 6: los movimientos no crecen como un cuadrado.' },
        { id: 'suma', texto: '11', error: 'RMT-TRS-6', siFuera: 'Sumar de a uno subestima: cada disco nuevo obliga a mover dos veces la torre de encima.' },
      ],
      dibujo: { datos: torre([[3, 2, 1], [], []], { grande: 3 }), estado: {} },
      revelar: { datos: torre([[], [], [6, 5, 4, 3, 2, 1]], { grande: 6, pie: '7 → 15 → 31 → 63' }), estado: {} },
      coincide: 'Coincide: cada disco nuevo duplica lo anterior y suma 1: 7, 15, 31, 63.',
    },
    mira: {
      datos: { ancho: 10, alto: 6 },
      pieza: 'rm-plano',
      pasos: [
        { estado: { corte: 0 }, texto: 'Para mover el disco grande, los otros dos deben estar en B.', ecuacion: [T(2), ' = 3 movimientos'] },
        { estado: { corte: 0 }, texto: 'El disco grande pasa a C en un solo movimiento.', ecuacion: ['+ 1'] },
        { estado: { corte: 0 }, texto: 'Los dos chicos vuelven a subirse encima: otros 3.', ecuacion: [T(3), ' = 3 + 1 + 3 = 7'] },
      ],
    },
    regla: {
      texto: 'Para mudar n discos, primero se mudan los n − 1 de encima, luego el grande y otra vez los n − 1. Por eso cada disco más duplica y suma uno.',
      ecuacion: [T('n'), ' = 2 · ', T('n − 1'), ' + 1 = ', { sup: ['2', 'n'] }, ' − 1'],
      condicion: 'se mueve un disco por vez, nunca uno grande sobre uno chico, y hay solo tres palos.',
    },
    ahoraTu: {
      voz: 'Usa el mínimo de la torre con un disco menos.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 9), tipo = s % 2;
        const bien = minMov(n);
        return {
          pregunta: tipo ? `Mudar una torre de ${n - 1} discos toma, como mínimo, ${minMov(n - 1)} movimientos. ¿Y una de ${n}?` : `¿Cuál es el mínimo de movimientos para mudar una torre de ${n} discos de A a C?`,
          opciones: opcionesTexto(String(bien), [
            { id: 'doble', texto: String(2 * minMov(n - 1)), error: 'RMT-TRS-6', siFuera: 'Falta el movimiento del disco grande.' },
            { id: 'pot', texto: String(2 ** n), error: 'RMT-TRS-7', siFuera: 'Sobra uno: el mínimo es 2ⁿ − 1.' },
            { id: 'cuad', texto: String(n * n), error: 'RMT-TRS-5', siFuera: 'Los movimientos no crecen como un cuadrado.' },
            { id: 'prop', texto: String(Math.round(7 * n / 3)), error: 'RM2', siFuera: 'No es proporcional al número de discos.' },
          ]),
          solucion: { texto: `Se mudan ${n - 1} discos, el grande y otra vez ${n - 1}.`, ecuacion: [T(n), ` = 2 · ${minMov(n - 1)} + 1 = ${bien}`] },
        };
      },
    },
  };
  // Mira de la torre: tres estados de la mudanza de 3 discos.
  hanoi.mira.datos = (() => {
    const a = torre([[3], [2, 1], []], { grande: 3 }), b = torre([[], [2, 1], [3]], { grande: 3 }), c = torre([[], [], [3, 2, 1]], { grande: 3 });
    const marca = (dat, k) => dat.poligonos.map(p => Object.assign(p, { desde: k, hasta: k }));
    return Object.assign(a, { poligonos: marca(a, 1).concat(marca(b, 2), marca(c, 3)) });
  })();
  hanoi.mira.pasos.forEach((p, k) => { p.estado = { corte: k + 1 }; });

  // ---------- Idea 3: traslado de números entre dos grupos ----------
  // Cambia: qué número pasa de A a B · Permanece: las fichas de los grupos · Progresa: la diferencia de las sumas ·
  // Se reserva: el número que iguala · Debe verse: pasar x cambia la diferencia en 2x.
  const GA = [9, 7, 6, 5, 3], GB = [8, 4, 6];
  const suma = xs => xs.reduce((m, x) => m + x, 0);
  function grupos(A, B, pasa = null, extra = {}) {
    const a2 = pasa === null ? A : A.filter((x, k) => k !== A.indexOf(pasa)), b2 = pasa === null ? B : B.concat([pasa]);
    const ficha = (x, nuevo) => ({ t: String(x), forma: 'cuadrado', color: nuevo ? 'i' : undefined });
    return {
      filas: [
        { rotulo: `A suma ${suma(a2)}`, caja: true, fichas: a2.map(x => ficha(x)) },
        { rotulo: `B suma ${suma(b2)}`, caja: true, fichas: B.map(x => ficha(x)).concat(pasa === null ? [] : [ficha(pasa, true)]) },
      ],
      tam: 30,
      pie: extra.pie || `Diferencia: ${Math.abs(suma(a2) - suma(b2))}`,
    };
  }
  const D = { v: 'c-o', t: 'D' }, x = { v: 'c-i', t: 'x' };
  const numeros = {
    id: 'pasar-un-numero',
    titulo: 'Pasar un número, mover el doble',
    temas: ['Traslado de números'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'El grupo A suma 30 y el B suma 18. Pasa un número de A a B y mira cómo cambia la diferencia de sumas.',
      voz: 'Compara el número que pasa con lo que baja la diferencia.',
      controles: [{ id: 'p', etiqueta: 'Pasa de A a B', opciones: [3, 5, 7, 9].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: grupos(GA, GB, val.p), estado: {} }),
      lectura: val => [D, ` = 12 − 2 · ${val.p} = ${12 - 2 * val.p}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Qué número de A hay que pasar a B para que los dos grupos sumen lo mismo?',
      opciones: [
        { id: 'dif', texto: '12', error: 'RMT-TRS-8', siFuera: 'Pasar 12 quitaría 12 a A y daría 12 a B: la diferencia cambiaría en 24.' },
        { id: 'c', texto: '6', correcta: true },
        { id: 'tres', texto: '3', error: 'RMT-TRS-9', siFuera: 'Pasar 3 baja la diferencia solo en 6; quedan 6 de diferencia.' },
      ],
      dibujo: { datos: grupos(GA, GB), estado: {} },
      revelar: { datos: grupos(GA, GB, 6, { pie: 'Pasa 6: A suma 24 y B suma 24' }), estado: {} },
      coincide: 'Coincide: A pierde 6 y B gana 6, y la diferencia de 12 desaparece.',
    },
    mira: {
      datos: Object.assign(grupos(GA, GB, 6), { pie: undefined }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Al principio: 30 − 18 = 12 de diferencia.', ecuacion: [D, ' = 12'] },
        { estado: { corte: 0 }, texto: 'El número que pasa resta en A y suma en B.', ecuacion: ['(30 − ', x, ') − (18 + ', x, ') = 12 − 2', x] },
        { estado: { corte: 0 }, texto: 'Para igualar, 2x debe ser 12.', ecuacion: [x, ' = ', { frac: [D, '2'] }, ' = 6'] },
      ],
    },
    regla: {
      texto: 'Pasar un número de un grupo a otro cambia la diferencia de sus sumas en el doble de ese número. Para igualar, se pasa la mitad de la diferencia.',
      ecuacion: [x, ' = ', { frac: [D, '2'] }],
      condicion: 'el número pasa del grupo que suma más al que suma menos, y la diferencia es par.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Calcula primero la diferencia de las sumas.',
      generar(s) {
        const r = azar(s);
        const xm = r.ent(2, 9);
        const B = r.barajar([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
        const otrosA = r.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== xm && v !== 2 * xm)).slice(0, 3);
        let A = otrosA.concat([xm]);
        // Se ajusta B para que la diferencia sea exactamente 2·xm.
        const falta = suma(A) - suma(B) - 2 * xm;
        const B2 = falta >= 0 ? B.concat(falta ? [falta] : []) : B;
        if (falta < 0) A = A.concat([-falta]);
        const Dv = suma(A) - suma(B2);
        A = r.barajar(A);
        return {
          pregunta: `A suma ${suma(A)} y B suma ${suma(B2)}. ¿Qué número de A hay que pasar a B para que sumen lo mismo?`,
          dibujo: { datos: grupos(A, B2), estado: {} },
          opciones: opcionesTexto(String(xm), [
            { id: 'dif', texto: String(Dv), error: 'RMT-TRS-8', siFuera: 'Pasar la diferencia completa la invierte: cambia el doble.' },
            ...A.filter(v => v !== xm).map((v, k) => ({ id: 'a' + k, texto: String(v), error: 'RMT-TRS-9', siFuera: `Pasar ${v} cambia la diferencia en ${2 * v}, no en ${Dv}.` })),
          ]),
          solucion: { texto: `La diferencia es ${Dv}; se pasa la mitad.`, ecuacion: [x, ` = ${Dv} / 2 = ${xm}`], dibujo: { datos: grupos(A, B2, xm, { pie: `Las dos sumas quedan en ${suma(A) - xm}` }), estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.traslados-y-puntos-cardinales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-fichas.js'],
    historia: {
      texto: 'Los navegantes calculaban su posición «por estima»: sumaban rumbos, rapidez y tiempo, y corregían por las corrientes. Un manual de Andrew Mackay de 1804 enseñaba ese cálculo. Caminar cuadras en una cuadrícula es una versión sencilla del mismo problema: un recorrido largo puede terminar cerca del punto de partida.',
      pregunta: '¿Por qué un viaje largo puede acabar cerca de casa?',
      fuente: { titulo: 'Navigational Arts · Whipple Museum, Cambridge', url: 'https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/astronomy-and-empire/navigational-arts' },
    },
    ideas: [desplaza, hanoi, numeros],
  };
});
