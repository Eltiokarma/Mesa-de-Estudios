/*
 * Teoría de «Certezas» (razonamiento-matematico.certezas).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 10); historia: el principio del palomar (Lethbridge).
 * Precisión: certeza es éxito en todas las extracciones posibles; el peor caso más uno es un argumento, no una fórmula.
 * Colores (regla 4): rojas c-h, azules c-i, verdes c-d (cada color de ficha lleva además su letra); lo que se pide naranja (c-o).
 * Compañero: Faro (zorro). Códigos: RM6 (caso favorable en vez del peor); RMT-CER-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: garantizar un resultado preparando la peor suerte posible.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla cuántas extracciones aseguran una meta, cuántas pruebas identifican llaves y cuántas
 *   personas obligan a repetir un mes.
 *   Orden de atención: 1.º la urna y lo sacado · 2.º la lectura «¿ya es seguro?» · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si con suerte basta con 2, ¿por qué la respuesta es 10?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const Nn = { v: 'c-o', t: 'N' }, k = { v: 'c-d', t: 'k' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesNum(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: f(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor <= 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: f(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }
  const COL = { R: { color: 'h', t: 'R', nombre: ['roja', 'rojas'] }, A: { color: 'i', t: 'A', nombre: ['azul', 'azules'] }, V: { color: 'd', t: 'V', nombre: ['verde', 'verdes'] } };
  const ficha = (c, extra = {}) => Object.assign({ color: COL[c].color, t: COL[c].t }, extra);

  // ---------- Idea 1: el peor caso ----------
  // Cambia: cuántas fichas se sacan · Permanece: la urna (5 rojas, 4 azules, 3 verdes) · Progresa: la secuencia más
  // desfavorable · Se reserva: la meta «3 rojas» · Debe verse: se cuenta lo que se puede sacar SIN cumplir, y se suma 1.
  const URNA = { R: 5, A: 4, V: 3 };
  // Peor secuencia para «dos del mismo color»: una de cada color, luego la que obliga.
  const PEOR2 = ['R', 'A', 'V', 'R', 'A', 'V', 'R', 'A'];
  function urna(cuenta, sacadas, extra = {}) {
    const resto = Object.assign({}, cuenta);
    for (const c of sacadas) resto[c]--;
    return {
      filas: [
        { rotulo: 'En la urna', caja: true, fichas: Object.keys(resto).flatMap(c => Array.from({ length: Math.max(0, resto[c]) }, () => ficha(c))) },
        { rotulo: `Sacadas: ${sacadas.length}`, fichas: sacadas.map((c, i) => ficha(c, { resalto: extra.ultima && i === sacadas.length - 1 ? 'o' : undefined })) },
      ],
      tam: 24,
      pie: extra.pie,
    };
  }
  const hayPar = xs => new Set(xs).size < xs.length;
  const peor = {
    id: 'peor-caso',
    titulo: 'Prepara la peor suerte',
    temas: ['Peor caso', 'Extracción de objetos'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'Se sacan fichas sin mirar. La meta: dos del mismo color. Avanza la peor suerte posible, ficha por ficha, hasta que la meta sea obligada.',
      voz: 'La peor suerte evita repetir color mientras puede.',
      controles: [{ id: 'n', etiqueta: 'Sacadas', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: urna(URNA, PEOR2.slice(0, val.n), { ultima: val.n === 4 }), estado: {} }),
      lectura: val => [hayPar(PEOR2.slice(0, val.n)) ? `Con ${val.n}: ya hay dos iguales, pase lo que pase` : `Con ${val.n}: todavía pueden ser todas distintas`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En la misma urna (5 rojas, 4 azules, 3 verdes), ¿cuántas fichas hay que sacar, como mínimo, para tener con certeza 3 rojas?',
      opciones: [
        { id: 'tres', texto: '3', error: 'RM6', siFuera: '3 alcanza si la suerte ayuda. La certeza pide que alcance aun con la peor suerte.' },
        { id: 'cinco', texto: '5', error: 'RMT-CER-1', siFuera: '5 son todas las rojas; no garantiza que salgan primero.' },
        { id: 'c', texto: '10', correcta: true },
        { id: 'doce', texto: '12', error: 'RMT-CER-2', siFuera: 'Con 12 se saca todo; basta con menos.' },
      ],
      dibujo: { datos: urna(URNA, []), estado: {} },
      revelar: { datos: urna(URNA, ['A', 'A', 'A', 'A', 'V', 'V', 'V', 'R', 'R', 'R'], { ultima: true, pie: '4 azules + 3 verdes + 3 rojas = 10' }), estado: {} },
      coincide: 'Coincide: la peor suerte saca primero todas las azules y verdes.',
    },
    mira: {
      datos: urna(URNA, ['A', 'A', 'A', 'A', 'V', 'V', 'V', 'R', 'R', 'R'], { ultima: true }),
      pasos: [
        { estado: { corte: 0 }, texto: 'La peor suerte saca primero lo que no sirve: 4 azules y 3 verdes.', ecuacion: ['4 + 3 = 7'] },
        { estado: { corte: 0 }, texto: 'Desde ahí, solo quedan rojas: 3 más.', ecuacion: ['7 + 3 = 10'] },
        { estado: { corte: 0 }, texto: 'Con 9 todavía podían faltar rojas; con 10, no.', ecuacion: [Nn, ' = 10'] },
      ],
    },
    regla: {
      texto: 'Para tener certeza se imagina la peor extracción: se saca todo lo que se pueda sin cumplir la meta. Una ficha más obliga a cumplirla.',
      ecuacion: [Nn, ' = (lo máximo sin cumplir) + 1'],
      condicion: 'se saca sin mirar y sin devolver, y la urna tiene suficientes fichas para que la meta sea posible.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: '¿Cuántas puedes sacar sin cumplir la meta?',
      generar(s) {
        const r = azar(s), cu = { R: r.ent(3, 8), A: r.ent(3, 8), V: r.ent(3, 8) }, tipo = s % 3;
        const tot = cu.R + cu.A + cu.V, colores = ['R', 'A', 'V'];
        let pregunta, bien, favorable;
        if (tipo === 0) {
          const kk = r.ent(2, 3);
          bien = colores.reduce((m, c) => m + Math.min(cu[c], kk - 1), 0) + 1; favorable = kk;
          pregunta = `Una urna tiene ${cu.R} rojas, ${cu.A} azules y ${cu.V} verdes. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${kk} del mismo color?`;
        } else if (tipo === 1) {
          const c = colores[r.ent(0, 2)], kk = r.ent(2, cu[c]);
          bien = tot - cu[c] + kk; favorable = kk;
          pregunta = `Una urna tiene ${cu.R} rojas, ${cu.A} azules y ${cu.V} verdes. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${kk} ${COL[c].nombre[1]}?`;
        } else {
          bien = tot - Math.min(cu.R, cu.A, cu.V) + 1; favorable = 3;
          pregunta = `Una urna tiene ${cu.R} rojas, ${cu.A} azules y ${cu.V} verdes. ¿Cuántas hay que sacar, como mínimo, para tener con certeza una de cada color?`;
        }
        return {
          pregunta,
          dibujo: { datos: urna(cu, []), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'fav', valor: favorable, error: 'RM6', siFuera: 'Ese es el caso con buena suerte; la certeza pide la peor.' },
            { id: 'sin1', valor: bien - 1, error: 'RMT-CER-3', siFuera: 'Con esas todavía puede no cumplirse: falta la que obliga.' },
            { id: 'todo', valor: tot, error: 'RMT-CER-2', siFuera: 'Sacar todo asegura, pero no es el mínimo.' },
            { id: 'mas1', valor: bien + 1, error: 'RMT-CER-4', siFuera: 'Una menos ya asegura la meta.' },
          ]),
          solucion: { texto: `En el peor caso se sacan ${bien - 1} sin cumplir; la siguiente obliga.`, ecuacion: [Nn, ` = ${bien - 1} + 1 = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el palomar ----------
  // Cambia: cuántos objetos se reparten · Permanece: 4 casilleros · Progresa: el reparto más parejo posible · Se reserva:
  // 12 meses y 3 personas por mes · Debe verse: más objetos que casilleros obliga a repetir.
  function palomar(N, cas, extra = {}) {
    const filas = Array.from({ length: cas }, (_, i) => ({ rotulo: `Casillero ${i + 1}`, fichas: [] }));
    for (let i = 0; i < N; i++) filas[i % cas].fichas.push({ color: 'o', t: '', forma: 'circulo', resalto: extra.ultima && i === N - 1 ? 'd' : undefined });
    return { filas: filas.slice(0, 5), tam: 22, pie: extra.pie || `Alguno tiene al menos ${Math.ceil(N / cas)}` };
  }
  const palo = {
    id: 'palomar',
    titulo: 'Más objetos que casilleros',
    temas: ['Extracción de objetos', 'Peor caso'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'Reparte objetos en 4 casilleros de la forma más pareja posible. Agrega objetos y mira cuánto tiene, como mínimo, el casillero más lleno.',
      voz: 'El quinto objeto ya no encuentra casillero vacío.',
      controles: [{ id: 'N', etiqueta: 'Objetos', min: 1, max: 13, paso: 1, inicio: 3, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: palomar(val.N, 4), estado: {} }),
      lectura: val => [Nn, ` = ${val.N}: alguno tiene al menos ${Math.ceil(val.N / 4)}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuántas personas hacen falta, como mínimo, para asegurar que 3 cumplan años en el mismo mes?',
      opciones: [
        { id: 'treintaiseis', texto: '36', error: 'RMT-CER-5', siFuera: '36 asegura 3 en cada mes; se pide 3 en algún mes.' },
        { id: 'c', texto: '25', correcta: true },
        { id: 'veinticuatro', texto: '24', error: 'RMT-CER-3', siFuera: 'Con 24 puede haber justo 2 por mes: falta la que obliga.' },
        { id: 'tres', texto: '3', error: 'RM6', siFuera: '3 basta con suerte, si nacieron en el mismo mes.' },
      ],
      dibujo: { datos: palomar(8, 4, { pie: 'Ejemplo: 4 casilleros, 2 en cada uno' }), estado: {} },
      revelar: { datos: palomar(9, 4, { ultima: true, pie: 'Aquí 8 + 1; con 12 meses, 24 + 1' }), estado: {} },
      coincide: 'Coincide: 24 personas pueden repartirse de a 2 por mes; la 25 repite un tercer cumpleaños.',
    },
    mira: {
      datos: palomar(9, 4, { ultima: true }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Con 8 objetos en 4 casilleros puede haber 2 en cada uno.', ecuacion: ['4 · 2 = 8'] },
        { estado: { corte: 0 }, texto: 'El objeto 9 cae en alguno que ya tiene 2.', ecuacion: ['⌈9 / 4⌉ = 3'] },
        { estado: { corte: 0 }, texto: 'Para meses: 12 · 2 = 24; la persona 25 obliga a 3.', ecuacion: [Nn, ' = 12 · 2 + 1 = 25'] },
      ],
    },
    regla: {
      texto: 'Si N objetos se reparten en k casilleros, alguno recibe al menos N/k redondeado hacia arriba. Para obligar a m en uno, se necesitan k(m − 1) + 1.',
      ecuacion: [Nn, ' = ', k, '(m − 1) + 1'],
      condicion: 'cada objeto va a un solo casillero y no importa en cuál; se habla de algún casillero, no de uno elegido.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Llena todos los casilleros justo antes de la meta.',
      generar(s) {
        const r = azar(s), [cosa, kk] = [['meses', 12], ['días de la semana', 7], ['colores de polo (5)', 5], ['salones (4)', 4]][s % 4], m = r.ent(2, 5);
        const bien = kk * (m - 1) + 1;
        return {
          pregunta: `Con ${kk} ${cosa.replace(/ \(\d+\)/, '')} posibles, ¿cuántas personas hacen falta, como mínimo, para asegurar que ${m} coincidan en uno de ellos?`,
          dibujo: { datos: palomar(Math.min(kk, 5) * (m - 1), Math.min(kk, 5), { pie: `${kk} casilleros con ${m - 1} cada uno` }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'sin1', valor: kk * (m - 1), error: 'RMT-CER-3', siFuera: 'Con esos aún puede haber solo m − 1 en cada uno.' },
            { id: 'todos', valor: kk * m, error: 'RMT-CER-5', siFuera: 'Eso asegura m en todos; se pide en alguno.' },
            { id: 'fav', valor: m, error: 'RM6', siFuera: 'Eso es con suerte.' },
            { id: 'mas', valor: kk + m, error: 'RMT-CER-6', siFuera: 'Sumar casilleros y meta no reparte el peor caso.' },
          ]),
          solucion: { texto: `Peor caso: ${m - 1} en cada uno de los ${kk}; uno más obliga.`, ecuacion: [Nn, ` = ${kk} · ${m - 1} + 1 = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: identificar llaves y candados ----------
  // Cambia: cuántas llaves · Permanece: cada llave abre un solo candado · Progresa: las pruebas del peor caso · Se reserva:
  // la última llave, que no se prueba · Debe verse: (n − 1) + (n − 2) + … + 1.
  function llaves(n, extra = {}) {
    // Fila i = llave i; en el peor caso falla en los candados que quedan hasta el penúltimo.
    return {
      columnas: Array.from({ length: n }, (_, j) => `C${j + 1}`), filas: Array.from({ length: n }, (_, i) => `L${i + 1}`), ancho: 40,
      celdas: Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (j < i ? '' : j === i ? { marca: 'si', color: 'd', tenue: true } : { marca: 'no', color: 'h' }))),
      notas: [{ t: extra.nota || `Pruebas: ${n * (n - 1) / 2}` }],
    };
  }
  const ident = {
    id: 'llaves',
    titulo: 'Identificar llaves en el peor caso',
    temas: ['Identificación de objetos'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'n llaves y n candados; cada llave abre uno. En el peor caso, cada llave falla en todos los libres menos uno. Cuenta las ✗.',
      voz: 'La última opción no se prueba: se deduce.',
      controles: [{ id: 'n', etiqueta: 'Llaves', min: 2, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: llaves(val.n), estado: {} }),
      lectura: val => [`Pruebas = ${Array.from({ length: val.n - 1 }, (_, i) => val.n - 1 - i).join(' + ')} = ${val.n * (val.n - 1) / 2}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con 10 llaves y 10 candados, ¿cuántas pruebas aseguran saber qué llave abre cada candado?',
      opciones: [
        { id: 'cien', texto: '100', error: 'RMT-CER-7', siFuera: 'Probar todas con todas asegura, pero cada candado abierto sale del juego.' },
        { id: 'c', texto: '45', correcta: true },
        { id: 'cincuenta5', texto: '55', error: 'RMT-CER-8', siFuera: '55 prueba también la última opción de cada llave, que ya se deduce.' },
        { id: 'diez', texto: '10', error: 'RM6', siFuera: '10 es con suerte: una prueba por llave.' },
      ],
      dibujo: { datos: llaves(4, { nota: 'Con 4 llaves: 3 + 2 + 1' }), estado: {} },
      revelar: { datos: llaves(5, { nota: 'Con 10 llaves: 9 + 8 + … + 1 = 45' }), estado: {} },
      coincide: 'Coincide: la primera llave falla 9 veces como máximo, la segunda 8, y así.',
    },
    mira: {
      datos: llaves(4, { nota: '3 + 2 + 1 = 6 pruebas' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'La llave 1 puede fallar en 3 candados; el cuarto se deduce.', ecuacion: ['3'] },
        { estado: { corte: 0 }, texto: 'La llave 2 tiene 3 candados libres: falla en 2 como máximo.', ecuacion: ['3 + 2'] },
        { estado: { corte: 0 }, texto: 'Y así hasta la penúltima; la última no se prueba.', ecuacion: ['3 + 2 + 1 = 6'] },
      ],
    },
    regla: {
      texto: 'Para identificar n llaves con n candados, en el peor caso cada llave falla en todos los candados libres menos uno, que se deduce.',
      ecuacion: ['(n − 1) + (n − 2) + … + 1 = ', { frac: ['n(n − 1)', '2'] }],
      condicion: 'cada llave abre exactamente un candado y un candado identificado ya no se vuelve a probar.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Cuenta cuántas veces puede fallar cada llave.',
      generar(s) {
        const r = azar(s), n = r.ent(5, 15), bien = n * (n - 1) / 2;
        return {
          pregunta: `Hay ${n} llaves y ${n} candados; cada llave abre uno solo. ¿Cuántas pruebas aseguran saber qué llave abre cada candado?`,
          dibujo: { datos: llaves(Math.min(n, 5), { nota: `Así con ${Math.min(n, 5)} llaves` }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'todo', valor: n * n, error: 'RMT-CER-7', siFuera: 'Cada candado abierto deja de probarse.' },
            { id: 'mas', valor: n * (n + 1) / 2, error: 'RMT-CER-8', siFuera: 'La última opción de cada llave se deduce.' },
            { id: 'fav', valor: n, error: 'RM6', siFuera: 'Eso es con suerte.' },
          ]),
          solucion: { texto: `La primera falla ${n - 1} veces, la segunda ${n - 2}, y así.`, ecuacion: [`${n - 1} + ${n - 2} + … + 1 = ${bien}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.certezas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-fichas.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'El principio del palomar se asocia con Dirichlet: si hay más objetos que casillas, alguna casilla recibe al menos dos. Sirve para demostrar una certeza sin conocer el reparto concreto. Garantizar algo no es lo mismo que estimar su probabilidad: hay que vencer incluso a la peor suerte.',
      pregunta: '¿Qué es estar seguro aunque la suerte juegue en contra?',
      fuente: { titulo: 'The Pigeonhole Principle · University of Lethbridge', url: 'https://opentext.uleth.ca/Ramsey/sec_Pigeon.html' },
    },
    ideas: [peor, palo, ident],
  };
});
