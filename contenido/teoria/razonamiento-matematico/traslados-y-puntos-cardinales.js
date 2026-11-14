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
  // Gesto directo (docs/teoria.md §4b): manijas sobre rm-plano (X, Y en unidades) y rm-fichas (centro de cada ficha).
  const PLANO = () => Kit.piezas['rm-plano'], FICHAS = () => Kit.piezas['rm-fichas'];
  const aFig = (datos, x, y) => { const g = PLANO().geometria(datos); return { x: g.X(x), y: g.Y(y) }; };
  const aUnid = (datos, pt) => { const g = PLANO().geometria(datos); return [(pt.x - g.X(0)) / g.k, (pt.y - g.Y(0)) / g.k]; };
  const plural = (n, uno, varios) => `${f(n)} ${n === 1 ? uno : varios}`;
  // Distancia en cuadras: entera si el cuadrado es perfecto; si no, como raíz.
  const raizTxt = k => { const q = Math.round(Math.sqrt(k)); return q * q === k ? `${f(q)}` : `√${k}`; };

  // ---------- Idea 1: camino recorrido contra desplazamiento ----------
  // Cambia: cuántas cuadras al este y al norte · Permanece: la cuadrícula y el punto de partida · Progresa: el camino que
  // crece mientras la flecha recta crece menos · Se reserva: la ida y vuelta, donde el camino sube y la flecha baja ·
  // Debe verse: la flecha une los extremos; el camino suma tramos.
  const SAL = [1.5, 5.5];
  const DIR = { E: [1, 0], O: [-1, 0], N: [0, -1], S: [0, 1] };
  function ruta(tramos, extra = {}) {
    const S0 = extra.sal || SAL;
    let p = S0.slice();
    const lineas = tramos.map(([dir, n], k) => {
      const q = [p[0] + DIR[dir][0] * n, p[1] + DIR[dir][1] * n];
      const l = { de: p, a: q, color: 'o', flecha: true, rotulo: `${n} ${dir}`, en: [(p[0] + q[0]) / 2 + (dir === 'N' || dir === 'S' ? 0.55 : 0), (p[1] + q[1]) / 2 + (dir === 'E' || dir === 'O' ? 0.55 : 0)], desde: extra.pasoTramo ? k + 1 : 0 };
      p = q; return l;
    });
    if (extra.recta !== false && (p[0] !== S0[0] || p[1] !== S0[1])) lineas.push({ de: S0, a: p, color: 'i', flecha: true, desde: extra.desdeRecta || 0 });
    return {
      ancho: 9, alto: 6, cuadricula: 1, norte: true,
      nodos: [{ id: 'sal', x: S0[0], y: S0[1], r: 8, relleno: 1, color: 'i' }],
      lineas: lineas.filter(l => l.de[0] !== l.a[0] || l.de[1] !== l.a[1]),
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
      lectura: val => [cam, ` = ${val.e + val.n}`, '   ·   ', d, ` = ${raizTxt(val.e ** 2 + val.n ** 2)} cuadras`],
      minimo: 3,
      // Se lleva el final del camino: lo horizontal da las cuadras al este; lo vertical, al norte.
      arrastres: [{ id: 'final', etiqueta: 'final del camino', color: 'c-o',
        donde: val => aFig(ruta([['E', val.e], ['N', val.n]]), SAL[0] + val.e, SAL[1] - val.n),
        mover: (pt, val) => { const [x, y] = aUnid(ruta([['E', val.e], ['N', val.n]]), pt); return { e: x - SAL[0], n: SAL[1] - y }; } }],
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
        { estado: { corte: 3 }, texto: '3 al oeste: el este neto queda en 6 − 3 = 3.', ecuacion: ['este neto = 6 − 3 = 3', '   ·   ', 'norte = 4'] },
        { estado: { corte: 4 }, texto: 'La flecha es la hipotenusa de 3 y 4.', ecuacion: [d, ' = ', { raiz: [{ sup: ['3', '2'] }, ' + ', { sup: ['4', '2'] }] }, ' = 5 cuadras', '   ·   ', cam, ' = 13'] },
      ],
    },
    regla: {
      texto: 'Para saber dónde terminas, se suman por separado los tramos este-oeste (con signo) y norte-sur. La distancia en línea recta sale de esos dos netos.',
      ecuacion: [d, ' = ', { raiz: [{ llave: [{ sup: ['x', '2'] }], nota: 'este neto', color: 'c-i' }, ' + ', { llave: [{ sup: ['y', '2'] }], nota: 'norte neto', color: 'c-i' }] }, '  ≤  ', { llave: [cam], nota: 'lo caminado', color: 'c-o' }],
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
          solucion: { texto: `Netos: ${Math.abs(x)} al ${x >= 0 ? 'este' : 'oeste'} y ${Math.abs(y)} al ${y >= 0 ? 'norte' : 'sur'}.`, ecuacion: [d, ` = `, { raiz: [{ sup: [String(Math.abs(x)), '2'] }, ' + ', { sup: [String(Math.abs(y)), '2'] }] }, ` = ${raizTxt(k)}`], dibujo: { datos: ruta(tramos), estado: {} } },
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
      lectura: val => [T(val.n), ` = ${plural(minMov(val.n), 'movimiento', 'movimientos')}`],
      minimo: 4,
      // Se sube o se baja la cima de la torre en A: cada piso es un disco.
      arrastres: [{ id: 'cima', etiqueta: 'cima de la torre', color: 'c-h',
        donde: val => aFig(torre([[1], [], []]), PALO[0], 5.4 - val.n * 0.5),
        mover: (pt, val) => ({ n: (5.4 - aUnid(torre([[1], [], []]), pt)[1]) / 0.5 }) }],
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
      ecuacion: [T('n'), ' = 2 · ', { llave: [T('n − 1')], nota: 'los de encima', color: 'c-d' }, ' + ', { llave: ['1'], nota: 'el grande', color: 'c-h' }, '   ·   ', T('n'), ' = ', { sup: ['2', 'n'] }, ' − 1'],
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
  // Manija de la ficha que pasó a B: en la fila B se queda; sobre la fila A elige la ficha más cercana (de las que
  // se pueden pasar), medida en el dibujo con A completo.
  function manijaPasa(datosDe, ctl, valores, posEnB, id = 'ficha-que-pasa', A = GA) {
    return { id, etiqueta: 'número que pasa de A a B', color: 'c-i',
      donde: val => { const q = FICHAS().geometria(datosDe(val)).filas[1].fichas[posEnB(val)]; return { x: q.cx, y: q.cy }; },
      mover: (pt, val) => {
        const g = FICHAS().geometria(datosDe(val)), yA = g.filas[0].fichas[0].cy, yB = g.filas[1].fichas[0].cy;
        if (pt.y > (yA + yB) / 2) return { [ctl]: val[ctl] };
        const fa = FICHAS().geometria(grupos(A, [])).filas[0].fichas;
        let mejor = val[ctl], dmin = Infinity;
        A.forEach((v, k) => { if (!valores.includes(v)) return; const dd = Math.abs(fa[k].cx - pt.x); if (dd < dmin) { dmin = dd; mejor = v; } });
        return { [ctl]: mejor };
      } };
  }
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
      // La ficha que pasó (en B) se lleva de vuelta sobre otra ficha de A: pasa esa.
      arrastres: [manijaPasa(val => grupos(GA, GB, val.p), 'p', [3, 5, 7, 9], val => GB.length)],
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: paseo de cuatro tramos (este, norte, oeste, sur) que se estiran desde sus puntas. El caso raro: un camino
  // largo que vuelve justo a la salida.
  const S4 = [4.5, 3];
  const tramos4 = val => [['E', val.e], ['N', val.n], ['O', val.o], ['S', val.s]];
  const datosPaseo = val => ruta(tramos4(val), { sal: S4 });
  const puntas = val => {
    const p1 = [S4[0] + val.e, S4[1]], p2 = [p1[0], p1[1] - val.n], p3 = [p2[0] - val.o, p2[1]], p4 = [p3[0], p3[1] + val.s];
    return [p1, p2, p3, p4];
  };
  const manijaTramo = (k, ctl, eje, signo, nombre) => ({ id: `tramo-${ctl}`, etiqueta: `fin del tramo al ${nombre}`, color: 'c-o',
    donde: val => { const q = puntas(val)[k]; return aFig(datosPaseo(val), q[0], q[1]); },
    mover: (pt, val) => {
      const u = aUnid(datosPaseo(val), pt), prev = k ? puntas(val)[k - 1] : S4;
      return { [ctl]: signo * (u[eje] - prev[eje]) };
    } });
  const mesaPaseo = {
    id: 'paseo-de-cuatro-tramos', titulo: 'Paseo de cuatro tramos', pieza: 'rm-plano',
    consigna: 'Camina al este, al norte, al oeste y al sur. Estira cada tramo desde su punta y busca volver a la salida.',
    controles: [
      { id: 'e', etiqueta: 'Este', min: 0, max: 4, paso: 1, inicio: 3, unidad: 'cuadras', decimales: 0, color: 'c-o' },
      { id: 'n', etiqueta: 'Norte', min: 0, max: 3, paso: 1, inicio: 2, unidad: 'cuadras', decimales: 0, color: 'c-o' },
      { id: 'o', etiqueta: 'Oeste', min: 0, max: 4, paso: 1, inicio: 1, unidad: 'cuadras', decimales: 0, color: 'c-o' },
      { id: 's', etiqueta: 'Sur', min: 0, max: 3, paso: 1, inicio: 0, unidad: 'cuadras', decimales: 0, color: 'c-o' },
    ],
    dibujo: val => ({ datos: datosPaseo(val), estado: {} }),
    lectura: val => {
      const c = val.e + val.n + val.o + val.s, k = (val.e - val.o) ** 2 + (val.n - val.s) ** 2;
      return [cam, ` = ${c}`, '   ·   ', d, ` = ${raizTxt(k)} ${k === 1 ? 'cuadra' : 'cuadras'}`];
    },
    arrastres: [manijaTramo(0, 'e', 0, 1, 'este'), manijaTramo(1, 'n', 1, -1, 'norte'), manijaTramo(2, 'o', 0, -1, 'oeste'), manijaTramo(3, 's', 1, 1, 'sur')],
  };
  // Mesa 2: la mudanza paso a paso. Se elige la torre (arrastrando su cima) y el paso de la solución mínima: se ve
  // que el disco grande se mueve una sola vez, justo a la mitad.
  function movidas(n, de = 0, a = 2, por = 1, acc = []) {
    if (n === 0) return acc;
    movidas(n - 1, de, por, a, acc); acc.push([n, de, a]); movidas(n - 1, por, a, de, acc);
    return acc;
  }
  const estadoTorre = (n, k) => {
    const palos = [Array.from({ length: n }, (_, i) => n - i), [], []], ms = movidas(n);
    for (const [, de, a] of ms.slice(0, Math.min(k, ms.length))) palos[a].push(palos[de].pop());
    return palos;
  };
  const datosMudanza = val => {
    const k = Math.min(val.k, minMov(val.n)), ms = movidas(val.n), ult = k ? ms[k - 1] : null;
    return torre(estadoTorre(val.n, k), { grande: val.n, pie: ult ? `Movida ${k}: disco ${ult[0]} de ${'ABC'[ult[1]]} a ${'ABC'[ult[2]]}` : 'Torre en A, sin mover' });
  };
  const mesaMudanza = {
    id: 'mudanza-paso-a-paso', titulo: 'La mudanza paso a paso', pieza: 'rm-plano',
    consigna: 'Elige cuántos discos y avanza por la solución mínima. Fíjate en qué movida pasa el disco grande.',
    controles: [
      { id: 'n', etiqueta: 'Discos', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0, color: 'c-h' },
      { id: 'k', etiqueta: 'Movida', min: 0, max: 31, paso: 1, inicio: 0, decimales: 0, color: 'c-d' },
    ],
    dibujo: val => ({ datos: datosMudanza(val), estado: {} }),
    lectura: val => [`${plural(val.n, 'disco', 'discos')} · movida ${Math.min(val.k, minMov(val.n))} de ${minMov(val.n)}`, '   ·   ', `el grande pasa en la ${minMov(val.n - 1) + 1}`],
    // La cima de la torre se arrastra solo antes de empezar (movida 0); después, la torre está repartida.
    arrastres: [{ id: 'cima', etiqueta: 'cima de la torre', color: 'c-h',
      donde: val => aFig(datosMudanza(val), PALO[0], 5.4 - estadoTorre(val.n, Math.min(val.k, minMov(val.n)))[0].length * 0.5),
      mover: (pt, val) => (val.k > 0 ? {} : { n: (5.4 - aUnid(datosMudanza(val), pt)[1]) / 0.5 }) }],
  };
  // Mesa 3: pasar dos números de A a B (la idea pasa uno). La diferencia cambia en el doble de la suma de los dos.
  const datosDos = val => {
    const pasan = [val.p1].concat(val.p2 && val.p2 !== val.p1 ? [val.p2] : []);
    const a2 = GA.filter(v => !pasan.includes(v)), b2 = GB.concat(pasan);
    const ficha = (v, nuevo) => ({ t: String(v), forma: 'cuadrado', color: nuevo ? 'i' : undefined });
    return { filas: [
      { rotulo: `A suma ${suma(a2)}`, caja: true, fichas: a2.map(v => ficha(v)) },
      { rotulo: `B suma ${suma(b2)}`, caja: true, fichas: GB.map(v => ficha(v)).concat(pasan.map(v => ficha(v, true))) },
    ], tam: 30, pie: `Diferencia A − B: ${suma(a2) - suma(b2)}` };
  };
  const mesaDos = {
    id: 'pasar-dos-numeros', titulo: 'Pasar dos números', pieza: 'rm-fichas',
    consigna: 'A suma 30 y B suma 18. Pasa uno o dos números de A a B. ¿Qué parejas igualan las sumas?',
    controles: [
      { id: 'p1', etiqueta: 'Primero', opciones: GA.map(v => ({ valor: v, texto: String(v) })) },
      { id: 'p2', etiqueta: 'Segundo', opciones: [{ valor: 0, texto: 'Ninguno' }].concat(GA.map(v => ({ valor: v, texto: String(v) }))) },
    ],
    dibujo: val => ({ datos: datosDos(val), estado: {} }),
    lectura: val => {
      const s2 = val.p1 + (val.p2 && val.p2 !== val.p1 ? val.p2 : 0);
      return [`Pasan ${s2 === val.p1 ? val.p1 : `${val.p1} y ${val.p2}`}: `, D, ` = 12 − 2 · ${s2} = ${12 - 2 * s2}`];
    },
    arrastres: [
      manijaPasa(datosDos, 'p1', GA, () => GB.length, 'primero'),
    ],
  };

  return {
    unidad: 'razonamiento-matematico.traslados-y-puntos-cardinales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-fichas.js'],
    // Laboratorio: el paseo de cuatro tramos que puede volver a la salida, la mudanza paso a paso y pasar dos números.
    laboratorio: [mesaPaseo, mesaMudanza, mesaDos],
    historia: {
      texto: 'Los navegantes calculaban su posición «por estima»: sumaban rumbos, rapidez y tiempo, y corregían por las corrientes. Un manual de Andrew Mackay de 1804 enseñaba ese cálculo. Caminar cuadras en una cuadrícula es una versión sencilla del mismo problema: un recorrido largo puede terminar cerca del punto de partida.',
      pregunta: '¿Por qué un viaje largo puede acabar cerca de casa?',
      fuente: { titulo: 'Navigational Arts · Whipple Museum, Cambridge', url: 'https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/astronomy-and-empire/navigational-arts' },
    },
    ideas: [desplaza, hanoi, numeros],
  };
});
