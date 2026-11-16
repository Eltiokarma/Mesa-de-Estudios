/*
 * Teoría de «Tabla periódica» (quimica.tabla-periodica). Molde: docs/teoria.md; forma de química:
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 3), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 27) y las precisiones de Química del expediente («flechas universales»: son tendencias con excepciones y los
 * valores reales quedan a la vista). Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md (TP4, TP7, TP8);
 * los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: ubicar un elemento por su configuración y comparar radio, ionización y electronegatividad con datos.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: da periodo, grupo y bloque de un elemento; dibuja su símbolo de Lewis; ordena dos
 *     elementos por radio, energía de ionización o electronegatividad, y nombra las excepciones Be–B y N–O.
 *   Orden de atención: 1.º la casilla marcada · 2.º su barra o círculo frente a los vecinos · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿la flecha de la tendencia es una ley?, ¿electronegativo es negativo?
 *
 * Colores (regla 4): Z número atómico rojo c-h, energía de ionización EI naranja c-o, radio r turquesa c-i,
 * electronegatividad EN verde c-d.
 * Datos (los mismos de plantillas/atomo-y-tabla/motor.js, con su fuente):
 *   EI: NIST Atomic Spectra Database, en eV × 96,485 kJ/mol, redondeadas. Radio: calculados de Clementi, Raimondi y
 *   Reinhardt (1967), en pm, una sola escala. EN: Pauling revisada por Allred (1961), tabla del CRC; He, Ne, Ar y Kr
 *   sin valor. Radios iónicos (solo en textos): Shannon (1976), NC 6.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §6.5; tabla periódica IUPAC; Mendeléiev (1869).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const Zv = { v: 'c-h', t: 'Z' }, EIv = { v: 'c-o', t: 'EI' }, Rv = { v: 'c-i', t: 'r' }, ENv = { v: 'c-d', t: 'EN' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (d.valor === undefined || d.valor === null) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');

  // ---------- Datos (índice = Z) ----------
  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr',
    'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio', 'aluminio',
    'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso', 'hierro', 'cobalto',
    'níquel', 'cobre', 'zinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón'];
  const EI = [null, 1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653,
    717, 762, 760, 737, 745, 906, 579, 762, 944, 941, 1140, 1351];
  const RADIO = [null, 53, 31, 167, 112, 87, 67, 56, 48, 42, 38, 190, 145, 118, 111, 98, 88, 79, 71, 243, 194, 184, 176, 171, 166, 161, 156, 152, 149,
    145, 142, 136, 125, 114, 103, 94, 88];
  const EN = [null, 2.20, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, null, 0.82, 1.00, 1.36, 1.54,
    1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, null];
  const SIMBOLOS = Object.fromEntries(SIMB.map((s, z) => [z, s]).filter(([z]) => +z > 0));
  const valores = (tabla, zs) => Object.fromEntries(zs.filter(z => tabla[z] !== undefined).map(z => [z, tabla[z] === null ? NaN : tabla[z]]));
  const TODOS = Array.from({ length: 36 }, (_, i) => i + 1);
  // Animación (docs/3d.md §6): un control con auto avanza sin ajustarse a su paso; Z se lee entero.
  const zr = v => Object.assign({}, v, { z: Math.round(v.z) });
  // Un cursor que recorre una lista de elementos, uno por segundo (el último se queda hasta que vuelve a empezar).
  const T_CURSOR = max => ({ id: 't', etiqueta: 't', min: 0, max, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } });
  const enCursor = (zs, t) => zs[Math.max(0, Math.min(zs.length - 1, Math.floor(t)))];

  // Lugar en la tabla, deducido de Z por la configuración (orden 1s 2s 2p 3s 3p 4s 3d 4p).
  function lugar(z) {
    const periodo = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : 4;
    const ini = [0, 1, 3, 11, 19][periodo], k = z - ini;
    let grupo;
    if (periodo === 1) grupo = z === 1 ? 1 : 18;
    else if (periodo < 4) grupo = k < 2 ? k + 1 : k + 11;
    else grupo = k + 1;                               // periodo 4: K (1), Ca (2), Sc–Zn (3–12), Ga–Kr (13–18)
    const bloque = z === 2 || grupo <= 2 ? 's' : grupo <= 12 ? 'd' : 'p';
    return { periodo, grupo, bloque };
  }
  const SEMI = [5, 14, 32, 33], NOMETAL = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36];
  const clase = z => (SEMI.includes(z) ? 'semimetal' : NOMETAL.includes(z) ? 'no metal' : 'metal');
  const valencia = z => { const l = lugar(z); return l.grupo <= 2 ? l.grupo : l.grupo >= 13 ? l.grupo - 10 : null; };
  const ultimoNivel = z => {
    const l = lugar(z), v = valencia(z), n = l.periodo;
    if (z <= 2) return `1s${sup(z)}`;
    return v <= 2 ? `${n}s${sup(v)}` : `${n}s² ${n}p${sup(v - 2)}`;
  };
  // Configuración completa por el orden de llenado 1s 2s 2p 3s 3p 4s 3d 4p (Así se resuelve, idea 1). Solo se usa con
  // grupos principales, donde no hay excepciones hasta Z = 36. Da las partes y los electrones de cada una.
  const ORDEN = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
  const configuracion = z => { const partes = []; let resto = z; for (const [sub, cap] of ORDEN) { if (resto <= 0) break; const e = Math.min(cap, resto); partes.push([sub, e]); resto -= e; } return partes; };
  const confTexto = z => configuracion(z).map(([sub, e]) => `${sub}${sup(e)}`).join(' ');
  const tabla = extra => ({ datos: Object.assign({ periodos: 4, simbolos: SIMBOLOS }, extra), estado: {} });
  // Gesto directo (docs/teoria.md §4b): con la geometría de quim-tabla (casilla, celda, zDe). La manija va al centro
  // de la casilla del elemento; al soltarla, el Z es el de la casilla bajo el dedo. La casilla «d» del periodo 4
  // reúne del Sc al Zn: si ya se estaba ahí, se queda el mismo Z; si no, entra el Sc (21). Fuera de la tabla, nada cambia.
  const QT = () => Kit.piezas['quim-tabla'];
  const enCasilla = z => { const c = QT().casilla(z); return { x: c.cx, y: c.cy }; };
  const zBajo = (pt, z) => {
    const c = QT().celda(pt, 4); if (!c) return z;
    if (c.col === 2) return c.per === 4 ? (z >= 21 && z <= 30 ? z : 21) : z;
    return QT().zDe(c.col, c.per) || z;
  };

  // ---------- Idea 1: la tabla ordena por Z y repite propiedades ----------
  // Cambia: el elemento marcado y la vista (bloques o metales) · Permanece: la tabla de los grupos principales · Progresa:
  // de una casilla a una columna, una fila y los bloques · Se reserva: las casillas que Mendeléiev dejó vacías · Debe
  // verse: que periodo y grupo salen del lugar en la tabla.
  const ley = {
    id: 'periodos-grupos-bloques',
    titulo: 'Filas, columnas y bloques',
    temas: ['Ley periódica', 'Periodos, grupos y bloques', 'Metales, no metales y semimetales'],
    pieza: 'quim-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Un orden por Z', texto: ['La tabla periódica ordena los elementos por su número atómico ', Zv, ', la cantidad de protones. El cobre que sale de Toquepala tiene ', Zv, ` = ${SIMB.indexOf('Cu')}; el oxígeno del aire de Juliaca, `, Zv, ` = ${SIMB.indexOf('O')}.`] },
        { titulo: 'Filas y columnas', texto: 'Cada fila de la tabla es un periodo y cada columna, un grupo. Los grupos se cuentan de izquierda a derecha: el 1 y el 2, la casilla d de transición y del 13 al 18.' },
        { titulo: 'Bloques y escalera', texto: 'El color de fondo marca el bloque: s, p o d, según el subnivel que se está llenando. Una línea en escalera separa los metales, como el cobre, de los no metales, como el oxígeno.' },
        { titulo: 'Qué mirar', texto: 'Mientras la casilla recorre la tabla, lee el periodo, el grupo y la clase de cada elemento. Fíjate qué cambia al bajar por una columna y qué cambia al avanzar por una fila.' },
      ],
    },
    juega: {
      consigna: 'La casilla recorre la tabla sola, Z por Z. Cambia la vista entre bloques y metales. Lee el periodo, el grupo y la clase.',
      voz: 'Mira qué tienen en común los de una misma columna.',
      controles: [
        { id: 'z', etiqueta: 'Z', color: 'c-h', min: 1, max: 36, paso: 1, inicio: 11, decimales: 0, auto: { velocidad: 1.5 } },
        { id: 'vista', etiqueta: 'Vista', opciones: [{ valor: 'bloques', texto: 'Bloques s, p, d' }, { valor: 'metales', texto: 'Metales y no metales' }] },
      ],
      dibujo: v => { v = zr(v); return tabla({ marcadas: [{ Z: v.z, color: 'h' }], bloques: v.vista === 'bloques', escalera: v.vista === 'metales' }); },
      lectura: v => { v = zr(v); const l = lugar(v.z); return [`${SIMB[v.z]}: periodo ${l.periodo} · grupo ${l.grupo} · bloque ${l.bloque} · ${clase(v.z)}`]; },
      minimo: 4,
      // Se agarra la casilla marcada y se la lleva a otra: Z sigue al dedo, y la lectura da periodo, grupo y clase.
      arrastres: [{ id: 'casilla', etiqueta: 'casilla marcada: llévala a otro elemento', color: 'c-h',
        donde: v => enCasilla(zr(v).z),
        mover: (pt, v) => ({ z: zBajo(pt, zr(v).z) }) }],
    },
    predice: {
      pregunta: 'En 1869, Mendeléiev ordenó los elementos y dejó dos casillas vacías: bajo el aluminio y bajo el silicio. ¿Qué pasó después?',
      voz: 'Piensa en qué permite hacer una regularidad.',
      opciones: [
        { id: 'c', texto: 'Se hallaron dos elementos con las propiedades predichas', correcta: true },
        { id: 'error', texto: 'Se vio que eran errores y se cerraron', error: 'QM-HUECOS', siFuera: 'Una tabla puede tener errores, cierto. Aquí las propiedades de la columna anticipaban dos elementos reales.' },
        { id: 'masa', texto: 'Se llenaron con elementos de la misma masa que el Al y el Si', error: 'QM-HUECOS', siFuera: 'La masa sube a lo largo de la fila; lo que se repite en una columna son las propiedades.' },
      ],
      dibujo: tabla({ ocultos: [31, 32], marcadas: [{ Z: 13, color: 'i' }, { Z: 14, color: 'i' }], escalera: false }),
      revelar: tabla({ marcadas: [{ Z: 31, color: 'h' }, { Z: 32, color: 'h' }, { Z: 13, color: 'i' }, { Z: 14, color: 'i' }] }),
      coincide: 'Coincide: el galio (1875) y el germanio (1886) encajaron en esos huecos.',
      noCoincide: 'El galio y el germanio, hallados después, tenían las propiedades anunciadas.',
    },
    mira: {
      datos: tabla({ bloques: true, escalera: true, marcadas: [
        ...[3, 11, 19].map(Z => ({ Z, color: 'h', desde: 1 })), ...[11, 12, 13, 14, 15, 16, 17, 18].map(Z => ({ Z, color: 'o', desde: 2 })), ...SEMI.map(Z => ({ Z, color: 'd', desde: 3 })),
      ] }).datos,
      voz: 'Miremos primero una columna, después una fila.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Grupo 1: Li, Na y K terminan en ns¹ y reaccionan parecido.', ecuacion: ['…2s¹ · …3s¹ · …4s¹'] },
        { estado: { corte: 2 }, texto: 'Periodo 3: todos ocupan hasta el nivel n = 3.', ecuacion: ['Na …3s¹ → Ar …3s² 3p⁶'] },
        { estado: { corte: 3 }, texto: 'La escalera separa metales (izquierda) de no metales; junto a ella, semimetales.' },
        { estado: { corte: 3 }, texto: 'El color de fondo dice el bloque: el subnivel que se está llenando.', ecuacion: ['bloque s · bloque d · bloque p'] },
      ],
    },
    regla: {
      texto: 'La tabla ordena los elementos por Z y sus propiedades se repiten en columnas (grupos). El periodo es el último nivel ocupado; el bloque, el subnivel que se llena.',
      ecuacion: ['periodo = ', { llave: ['n'], nota: 'nivel más alto' }, '   ·   ', 'bloque = s, p, d o f'],
      condicion: 'el orden es por número atómico, no por masa. Metales a la izquierda de la escalera; no metales a la derecha.',
      voz: 'Ubica primero la fila y después la columna.',
    },
    // Así se resuelve: el mismo problema de «Ahora tú» (periodo y grupo por Z), con otras semillas. Solo grupos
    // principales: la configuración sale de configuracion(z) y el lugar, de lugar(z), el mismo que pinta la casilla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), z = r.de([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 33, 35]), l = lugar(z);
        const partes = configuracion(z), n = l.periodo, v = partes.filter(([sub]) => +sub[0] === n).reduce((a, [, e]) => a + e, 0);
        const suma = partes.reduce((a, [, e]) => a + e, 0), grupo = l.bloque === 'p' ? `grupo = 10 + ${v} = ${l.grupo}` : `grupo ${v}`;
        return {
          enunciado: ['¿En qué periodo y grupo está el elemento de ', Zv, ` = ${z}? Ubícalo con su configuración electrónica.`],
          dibujo: tabla({ bloques: true }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la fila (el periodo) y la columna (el grupo) del elemento en la tabla.' },
            { tipo: 'datos', texto: ['Con ', Zv, ` = ${z}, el átomo neutro tiene ${z} electrones para repartir.`] },
            { tipo: 'regla', texto: 'Escribo la configuración. El nivel más alto con electrones es el periodo; los electrones de ese nivel dan el grupo, sumando 10 en el bloque p.' },
            { tipo: 'cuentas', texto: `Lleno los subniveles en orden. El nivel más alto es n = ${n}, con ${v} ${v === 1 ? 'electrón' : 'electrones'}: bloque ${l.bloque}.`,
              ecuacion: [confTexto(z), '   ·   ', `periodo ${n}, ${grupo}`], dibujo: tabla({ bloques: true, marcadas: [{ Z: z, color: 'h' }] }) },
            { tipo: 'sentido', texto: `Los exponentes suman ${suma}, el Z del dato. Y la casilla marcada es la del ${NOMBRE[z]} (${SIMB[z]}).`,
              ecuacion: [`${partes.map(([, e]) => e).join(' + ')} = ${suma}`] },
          ],
          respuesta: `Periodo ${n}, grupo ${l.grupo}: el ${NOMBRE[z]} (${SIMB[z]}).`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Ubica la fila y después la columna.',
      generar(s) {
        const r = azar(s), z = r.de([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 26, 29, 31, 33, 35]), l = lugar(z);
        const txt = ([p, g]) => `Periodo ${p}, grupo ${g}`;
        return {
          pregunta: ['¿En qué periodo y grupo está el elemento de ', Zv, ` = ${z}?`],
          dibujo: tabla({ bloques: true }),
          opciones: opciones(txt([l.periodo, l.grupo]), [
            { id: 'cambio', valor: l.periodo !== l.grupo ? txt([l.grupo, l.periodo]) : null, error: 'QM-PERIODO-GRUPO', siFuera: 'Eso intercambia fila y columna. El periodo es la fila; el grupo, la columna.' },
            { id: 'nivel', valor: l.periodo < 4 ? txt([l.periodo + 1, l.grupo]) : txt([l.periodo - 1, l.grupo]), error: 'QM-PERIODO', siFuera: 'El periodo es el nivel más alto que tiene electrones; cuenta de nuevo los niveles.' },
            { id: 'grupo', valor: l.grupo >= 13 ? txt([l.periodo, l.grupo - 10]) : txt([l.periodo, l.grupo + 1]), error: 'QM-GRUPO', siFuera: l.grupo >= 13 ? 'Esos son los electrones de valencia. En el bloque p el grupo es 10 más.' : 'Cuenta de nuevo la columna desde el grupo 1.' },
          ], x => x),
          solucion: { texto: `${NOMBRE[z]} (${SIMB[z]}): fila ${l.periodo}, columna ${l.grupo}, bloque ${l.bloque}.`, dibujo: tabla({ bloques: true, marcadas: [{ Z: z, color: 'h' }] }) },
        };
      },
    },
  };

  // ---------- Idea 2: de la configuración al lugar y a Lewis ----------
  // Cambia: el elemento · Permanece: el símbolo al centro y los cuatro lados · Progresa: de la configuración al
  // periodo, al grupo y a los puntos · Se reserva: los electrones internos, que no se dibujan · Debe verse: un punto
  // por electrón del último nivel, solos antes de aparearse.
  const LADOS = [-90, 0, 90, 180];
  function lewis(z, desde = 0) {
    const v = z === 2 ? 2 : valencia(z), c = [0, 0, 0, 0];
    if (z === 2) c[0] = 2; else for (let k = 0; k < v; k++) c[k % 4]++;
    const pares = [], cargas = [];
    c.forEach((n, i) => { if (n === 2) pares.push({ en: 'a', ang: LADOS[i], desde }); else if (n === 1) cargas.push({ en: 'a', t: '•', ang: LADOS[i], desde }); });
    return { atomos: [{ id: 'a', t: SIMB[z], x: 0, y: 0 }], pares, cargas, escala: 40, alto: 130, alt: `Símbolo de Lewis del ${NOMBRE[z]}: ${v} puntos alrededor de ${SIMB[z]}.` };
  }
  // Sin arrastre: el símbolo de Lewis es la respuesta que el alumno lee; no hay una magnitud natural que agarrar en
  // él (los puntos salen de Z). Z se arrastra en la tabla de la idea 1 y del laboratorio.
  const ubicacion = {
    id: 'ubicacion-lewis',
    titulo: 'Del último nivel al lugar',
    temas: ['Notación de Lewis', 'Ubicación de un elemento'],
    pieza: 'quim-molecula',
    lee: {
      tarjetas: [
        { titulo: 'Leer una configuración', texto: 'En 2p⁶, el 2 es el nivel, la letra p es el subnivel y el exponente 6 dice cuántos electrones hay ahí. El nivel más alto es el más alejado del núcleo.' },
        { titulo: 'Los de valencia', texto: 'Los electrones del nivel más alto se llaman electrones de valencia. Son los que se asoman cuando el átomo se une con otros: en la sal de Maras, el sodio y el cloro.' },
        { titulo: 'El símbolo de Lewis', texto: 'Gilbert N. Lewis propuso dibujar el símbolo del elemento con un punto por cada electrón de valencia, en cuatro lados: arriba, derecha, abajo e izquierda. Los electrones internos no se dibujan.' },
        { titulo: 'Qué mirar', texto: 'Mientras Z sube y baja, cuenta los puntos y compáralos con el grupo que da la lectura. Fíjate también en qué momento un punto deja de estar solo.' },
      ],
    },
    juega: {
      consigna: 'Z sube y baja solo; mira el símbolo de Lewis: un punto por cada electrón del último nivel. Compara los puntos con el grupo.',
      voz: 'Los puntos se reparten solos antes de formar parejas.',
      controles: [{ id: 'z', etiqueta: 'Z', color: 'c-h', min: 1, max: 20, paso: 1, inicio: 7, decimales: 0, auto: { velocidad: 1.2, modo: 'rebota' } }],
      dibujo: v => ({ datos: lewis(zr(v).z), estado: {} }),
      lectura: v => { v = zr(v); const l = lugar(v.z); return [`${SIMB[v.z]}: …${ultimoNivel(v.z)} · grupo ${l.grupo} · ${v.z === 2 ? 2 : valencia(v.z)} puntos`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'La configuración de un elemento termina en 3s² 3p⁴. ¿Dónde está en la tabla y cuántos puntos lleva su símbolo de Lewis?',
      voz: 'Cuenta solo los electrones del nivel más alto.',
      opciones: [
        { id: 'c', texto: 'Periodo 3, grupo 16; 6 puntos', correcta: true },
        { id: 'solo-p', texto: 'Periodo 3, grupo 14; 4 puntos', error: 'QM-SOLO-P', siFuera: 'Contaste los 3p. El nivel 3 también tiene los 3s: son 2 + 4 = 6.' },
        { id: 'todos', texto: 'Periodo 3, grupo 16; 16 puntos', error: 'QM-LEWIS-TODOS', siFuera: 'Tiene 16 electrones en total, cierto. Lewis dibuja solo los del último nivel.' },
        { id: 'periodo', texto: 'Periodo 4, grupo 16; 6 puntos', error: 'QM-PERIODO', siFuera: 'El nivel más alto con electrones es n = 3: ese es el periodo.' },
      ],
      dibujo: { datos: { atomos: [{ id: 'a', t: '?', x: 0, y: 0 }], escala: 40, alto: 130, alt: 'Un elemento sin nombre, todavía sin puntos.' }, estado: {} },
      revelar: { datos: lewis(16), estado: {} },
      coincide: 'Coincide: es el azufre, con 6 electrones de valencia.',
      noCoincide: 'Es el azufre: nivel 3, con 2 + 4 = 6 electrones de valencia.',
    },
    mira: {
      datos: Object.assign(lewis(15, 3), { textos: [{ x: 0, y: 1.25, t: '1s² 2s² 2p⁶ 3s² 3p³', desde: 1 }] }),
      voz: 'Sigamos el fósforo, paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Fósforo, Z = 15: escribe su configuración.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p³'] },
        { estado: { corte: 2 }, texto: 'El nivel más alto es n = 3: está en el periodo 3.', ecuacion: ['periodo 3'] },
        { estado: { corte: 3 }, texto: 'En el nivel 3 hay 2 + 3 = 5 electrones: grupo 15.', ecuacion: ['grupo = 10 + 5 = 15'] },
        { estado: { corte: 3 }, texto: 'Lewis: cinco puntos; los cuatro primeros solos, el quinto forma pareja.' },
      ],
    },
    regla: {
      texto: 'El nivel más alto da el periodo. Sus electrones son los de valencia: dan el grupo y los puntos del símbolo de Lewis.',
      ecuacion: [{ llave: ['grupo = valencia'], nota: 'grupos 1 y 2' }, '   ·   ', { llave: ['grupo = 10 + valencia'], nota: 'grupos 13 a 18' }],
      condicion: 'vale para los grupos principales; en los de transición el grupo cuenta también los electrones d.',
      voz: 'Solo cuentan los del último nivel.',
    },
    // Así se resuelve: el problema de «Ahora tú» (del último nivel al lugar y a Lewis), con la misma lista, lugar(z),
    // valencia(z), ultimoNivel(z) y lewis(z).
    resuelve: {
      generar(s) {
        const r = azar(s + 900), z = r.de([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 33, 34, 35]), l = lugar(z), v = valencia(z), n = l.periodo;
        const pts = `${v} punto${v === 1 ? '' : 's'}`;
        return {
          enunciado: `La configuración de un elemento termina en ${ultimoNivel(z)}. ¿Dónde está en la tabla y cuántos puntos lleva su símbolo de Lewis?`,
          dibujo: { datos: { atomos: [{ id: 'a', t: '?', x: 0, y: 0 }], escala: 40, alto: 130, alt: 'Un elemento sin nombre, todavía sin puntos.' }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden tres cosas: el periodo, el grupo y los puntos del símbolo de Lewis.' },
            { tipo: 'datos', texto: `El último nivel escrito es ${ultimoNivel(z)}.` },
            { tipo: 'regla', texto: 'El número del nivel más alto es el periodo. Todos los electrones de ese nivel son los de valencia: dan el grupo y los puntos.' },
            { tipo: 'cuentas', texto: v > 2 ? `El nivel más alto es n = ${n}. Sumo sus electrones s y p; en el bloque p, el grupo es 10 más.` : `El nivel más alto es n = ${n}, con ${v} ${v === 1 ? 'electrón' : 'electrones'} s: el grupo es igual a la valencia.`,
              ecuacion: v > 2 ? [`valencia = 2 + ${v - 2} = ${v}   →   grupo = 10 + ${v} = ${l.grupo}`] : [`valencia = ${v}   →   grupo = ${l.grupo}`], dibujo: { datos: lewis(z), estado: {} } },
            { tipo: 'sentido', texto: `Es el ${NOMBRE[z]} (${SIMB[z]}): en la figura hay ${pts} alrededor de su símbolo, uno por electrón de valencia.` },
          ],
          respuesta: `Periodo ${n}, grupo ${l.grupo}; ${pts} (${SIMB[z]}).`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Lee el último nivel y cuenta.',
      generar(s) {
        const LISTA = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 33, 34, 35];
        const z = LISTA[s % LISTA.length], l = lugar(z), v = valencia(z);
        const txt = (p, g, pts) => `Periodo ${p}, grupo ${g}; ${pts} punto${pts === 1 ? '' : 's'}`;
        return {
          pregunta: `La configuración de un elemento termina en ${ultimoNivel(z)}. ¿Dónde está y cuántos puntos lleva su símbolo de Lewis?`,
          opciones: opciones(txt(l.periodo, l.grupo, v), [
            v > 2 ? { id: 'solo-p', valor: txt(l.periodo, v - 2 + 10, v - 2), error: 'QM-SOLO-P', siFuera: 'Eso cuenta solo los p. El nivel más alto también tiene sus dos s.' } : {},
            { id: 'todos', valor: txt(l.periodo, l.grupo, z), error: 'QM-LEWIS-TODOS', siFuera: 'Ese es el total de electrones. Lewis dibuja solo los del último nivel.' },
            { id: 'grupo', valor: l.grupo >= 13 ? txt(l.periodo, v, v) : txt(l.periodo + 1, l.grupo, v), error: l.grupo >= 13 ? 'QM-GRUPO' : 'QM-PERIODO', siFuera: l.grupo >= 13 ? 'En el bloque p el grupo es 10 más que los electrones de valencia.' : 'El periodo es el nivel más alto con electrones.' },
          ], x => x),
          solucion: { texto: `Nivel ${l.periodo} con ${v} electrones: grupo ${l.grupo} y ${v} puntos.`, ecuacion: [`${SIMB[z]}: periodo ${l.periodo}, grupo ${l.grupo}`], dibujo: { datos: lewis(z), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: el radio ----------
  // Cambia: el grupo que se mira · Permanece: la tabla y la escala de radios (un círculo por átomo) · Progresa: de
  // una columna (crece hacia abajo) a una fila (baja hacia la derecha) · Se reserva: la fila del periodo 3 · Debe
  // verse: el tamaño de cada círculo frente al de sus vecinos.
  const GRUPOS = { 1: [1, 3, 11, 19], 2: [4, 12, 20], 13: [5, 13, 31], 17: [9, 17, 35] };
  const radio = {
    id: 'radio-atomico-ionico',
    titulo: 'Cuánto mide un átomo',
    temas: ['Radio atómico e iónico'],
    pieza: 'quim-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Muy, muy pequeño', texto: 'Un átomo se mide en picómetros (pm): un picómetro es la billonésima parte de un metro. En un solo grano de sal de Maras hay millones de billones de átomos.' },
        { titulo: 'Un borde que no existe', texto: ['La nube de electrones no tiene un borde nítido. Por eso el radio atómico ', Rv, ' se define con dos átomos iguales unidos: es la mitad de la distancia entre sus núcleos.'] },
        { titulo: 'Átomos e iones', texto: 'Un catión es un átomo que perdió electrones; un anión, uno que los ganó. En la sal hay cationes Na⁺ y aniones Cl⁻. Sus radios se miden en otra escala, la de los iones.' },
        { titulo: 'Qué mirar', texto: 'El círculo de cada casilla es proporcional al radio. Mientras el marco baja por la columna, compara cada círculo con el de arriba y lee en qué periodo está.' },
      ],
    },
    juega: {
      consigna: 'Elige un grupo. El círculo de cada casilla es proporcional al radio. Un marco baja solo por la columna: mira cómo cambia.',
      voz: 'Compara cada círculo con el de arriba.',
      controles: [{ id: 'g', etiqueta: 'Grupo', opciones: Object.keys(GRUPOS).map(g => ({ valor: g, texto: `Grupo ${g}` })) }, T_CURSOR(4)],
      // Se agarra la cabeza de la columna (sobre el número del grupo) y se la corre a otra: al soltar, cae en el grupo más cercano de los cuatro.
      arrastres: [{ id: 'columna', etiqueta: 'columna del grupo', color: 'c-i',
        donde: v => { const c = QT().casilla(GRUPOS[v.g][0]); return { x: c.cx, y: c.y - 12 }; },
        mover: pt => { const col = (pt.x - QT().casilla(1).x) / QT().casilla(1).w - 0.5;
          return { g: Object.keys(GRUPOS).reduce((a, b) => (Math.abs(QT().casilla(GRUPOS[b][0]).col - col) < Math.abs(QT().casilla(GRUPOS[a][0]).col - col) ? b : a)) }; } }],
      dibujo: v => tabla({ propiedad: { valores: valores(RADIO, GRUPOS[v.g]), max: 245, forma: 'circulo', color: 'i', nombre: 'radio (pm)' }, rotulo: 'r: radio calculado (pm)', marcadas: [{ Z: enCursor(GRUPOS[v.g], v.t), color: 'i' }] }),
      lectura: v => { const z = enCursor(GRUPOS[v.g], v.t); return [Rv, ` (${SIMB[z]}) = ${RADIO[z]} pm · periodo ${lugar(z).periodo}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Del sodio al cloro, en el periodo 3, cada átomo tiene un protón y un electrón más que el anterior. ¿Qué pasa con el radio?',
      voz: 'Piensa en el núcleo y en el nivel que se llena.',
      opciones: [
        { id: 'c', texto: 'Baja: más protones atraen el mismo nivel', correcta: true },
        { id: 'sube', texto: 'Sube, porque hay más electrones', error: 'TP4', siFuera: 'Hay más electrones, cierto, pero en el mismo nivel; la carga del núcleo crece más.' },
        { id: 'igual', texto: 'No cambia: todos tienen tres niveles', error: 'QM-RADIO-NIVEL', siFuera: 'Tienen tres niveles, bien visto. Pero el núcleo de cada uno jala distinto.' },
      ],
      dibujo: tabla({ marcadas: [{ Z: 11, color: 'i' }, { Z: 17, color: 'i' }] }),
      revelar: tabla({ propiedad: { valores: valores(RADIO, [11, 12, 13, 14, 15, 16, 17, 18]), max: 245, forma: 'circulo', color: 'i' }, marcadas: [{ Z: 11, color: 'i' }, { Z: 17, color: 'i' }], rotulo: 'Na 190 pm → Cl 79 pm' }),
      coincide: 'Coincide: de 190 pm (Na) a 79 pm (Cl).',
      noCoincide: 'El radio baja de 190 pm (Na) a 79 pm (Cl): el núcleo jala más.',
    },
    mira: {
      datos: tabla({ propiedad: { valores: valores(RADIO, TODOS), max: 245, forma: 'circulo', color: 'i' }, marcadas: [{ Z: 19, color: 'i', desde: 1 }, { Z: 9, color: 'h', desde: 2 }], rotulo: 'r: radio calculado (pm)' }).datos,
      voz: 'Miremos toda la tabla: dos tendencias a la vez.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Hacia abajo en un grupo, el radio crece: hay un nivel más.', ecuacion: ['Li 167 pm → K 243 pm'] },
        { estado: { corte: 0 }, texto: 'Hacia la derecha en un periodo, baja: el núcleo jala más.', ecuacion: ['Na 190 pm → Cl 79 pm'] },
        { estado: { corte: 1 }, texto: 'El más grande de esta tabla: el potasio, abajo a la izquierda.', ecuacion: ['K: 243 pm'] },
        { estado: { corte: 2 }, texto: 'Arriba a la derecha están los más pequeños, como el flúor.', ecuacion: ['F: 42 pm'] },
        { estado: { corte: 2 }, texto: 'Un catión pierde electrones y se achica; un anión los gana y crece.', ecuacion: ['Na⁺ menor que Na', '   ·   ', 'Cl⁻ mayor que Cl'] },
      ],
    },
    regla: {
      texto: 'El radio crece hacia abajo en un grupo (más niveles) y baja hacia la derecha en un periodo (más protones, mismo nivel). Catión: menor que su átomo; anión: mayor.',
      condicion: 'se comparan valores de una misma escala de radios; los radios atómicos y los iónicos no se mezclan.',
      voz: 'Niveles hacia abajo, protones hacia la derecha.',
    },
    // Así se resuelve: la variante de pares de átomos de «Ahora tú» (la de números), con los mismos PARES, RADIO y lugar(z).
    resuelve: {
      generar(s) {
        const PARES = [[3, 11], [11, 19], [9, 17], [17, 35], [11, 17], [12, 16], [3, 9], [19, 35], [4, 20], [13, 15], [6, 8], [14, 32], [5, 13], [20, 31]];
        const r = azar(s + 900), [a, b] = r.de(PARES), mayor = RADIO[a] > RADIO[b] ? a : b, menor = mayor === a ? b : a;
        const la = lugar(a), lb = lugar(b), misma = la.grupo === lb.grupo, veces = RADIO[mayor] / RADIO[menor];
        const donde = z => `${SIMB[z]}: periodo ${lugar(z).periodo}, grupo ${lugar(z).grupo}`;
        return {
          enunciado: `¿Qué átomo tiene mayor radio: ${NOMBRE[a]} (${SIMB[a]}) o ${NOMBRE[b]} (${SIMB[b]})?`,
          dibujo: tabla({ marcadas: [{ Z: a, color: 'i' }, { Z: b, color: 'i' }] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden cuál de los dos átomos es más grande: el de mayor radio ', Rv, '.'] },
            { tipo: 'datos', texto: misma ? `Los dos están en el grupo ${la.grupo}, uno debajo del otro.` : `Los dos están en el periodo ${la.periodo}: tienen el mismo número de niveles.`, ecuacion: [donde(a), '   ·   ', donde(b)] },
            { tipo: 'regla', texto: misma ? 'En un grupo, cada fila hacia abajo suma un nivel de electrones: el átomo de abajo es más grande.' : 'En un periodo, hacia la derecha hay más protones jalando el mismo nivel: el átomo se achica.' },
            { tipo: 'cuentas', texto: 'Leo los dos radios en la tabla de datos y los comparo dividiendo.',
              ecuacion: [Rv, `(${SIMB[mayor]}) = ${RADIO[mayor]} pm   ·   `, Rv, `(${SIMB[menor]}) = ${RADIO[menor]} pm   →   ${RADIO[mayor]} ÷ ${RADIO[menor]} ≈ ${f(veces)}`],
              dibujo: tabla({ propiedad: { valores: valores(RADIO, [a, b]), max: 245, forma: 'circulo', color: 'i' }, marcadas: [{ Z: a, color: 'i' }, { Z: b, color: 'i' }] }) },
            { tipo: 'sentido', texto: misma ? `Cuadra con la regla: el ${SIMB[mayor]} está en el periodo ${lugar(mayor).periodo}, más abajo que el ${SIMB[menor]}; su círculo es ${f(veces)} veces más ancho.`
              : `Cuadra con la regla: el ${SIMB[menor]} tiene ${Math.abs(a - b)} protones más que el ${SIMB[mayor]} y su círculo es más chico.` },
          ],
          respuesta: `El ${SIMB[mayor]}: ${RADIO[mayor]} pm, más que los ${RADIO[menor]} pm del ${SIMB[menor]}.`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Ubica los dos y compara.',
      generar(s) {
        const r = azar(s);
        if (s % 4 === 3) {
          const [x, ion, tipo] = r.de([['Na', 'Na⁺', 'cat'], ['Mg', 'Mg²⁺', 'cat'], ['Cl', 'Cl⁻', 'an'], ['O', 'O²⁻', 'an'], ['K', 'K⁺', 'cat'], ['S', 'S²⁻', 'an'], ['F', 'F⁻', 'an'], ['Ca', 'Ca²⁺', 'cat']]);
          const mayor = tipo === 'an' ? ion : x, menor = tipo === 'an' ? x : ion;
          return {
            pregunta: `¿Cuál es más grande: el átomo de ${x} o el ion ${ion}?`,
            opciones: [
              { id: 'c', texto: mayor, correcta: true },
              { id: 'otro', texto: menor, error: 'QM-ION-RADIO', siFuera: tipo === 'an' ? 'Sería así si el anión perdiera electrones. Los gana y se repelen más.' : 'Sería así si el catión ganara electrones. Los pierde y queda más chico.' },
              { id: 'igual', texto: 'Miden lo mismo', error: 'QM-ION-RADIO', siFuera: 'El núcleo es el mismo, cierto. Pero cambió el número de electrones que atrae.' },
            ],
            solucion: { texto: tipo === 'an' ? 'El anión gana electrones: se repelen más y la nube crece.' : 'El catión pierde electrones: el núcleo jala más a los que quedan.' },
          };
        }
        const PARES = [[3, 11], [11, 19], [9, 17], [17, 35], [11, 17], [12, 16], [3, 9], [19, 35], [4, 20], [13, 15], [6, 8], [14, 32], [5, 13], [20, 31]];
        const [a, b] = r.de(PARES), mayor = RADIO[a] > RADIO[b] ? a : b, menor = mayor === a ? b : a;
        const misma = lugar(a).grupo === lugar(b).grupo;
        return {
          pregunta: `¿Qué átomo tiene mayor radio: ${NOMBRE[a]} (${SIMB[a]}) o ${NOMBRE[b]} (${SIMB[b]})?`,
          dibujo: tabla({ marcadas: [{ Z: a, color: 'i' }, { Z: b, color: 'i' }] }),
          opciones: [
            { id: 'c', texto: SIMB[mayor], correcta: true },
            { id: 'otro', texto: SIMB[menor], error: misma ? 'QM-RADIO-NIVEL' : 'TP4', siFuera: misma ? 'En un grupo, el de abajo tiene un nivel más y es más grande.' : 'Más electrones en el mismo nivel no lo agrandan: más protones lo achican.' },
            { id: 'igual', texto: 'Miden lo mismo', error: 'QM-RADIO-NIVEL', siFuera: 'Sería cierto si nivel y núcleo fueran iguales; aquí cambia uno de los dos.' },
          ],
          solucion: { texto: `${SIMB[mayor]}: ${RADIO[mayor]} pm; ${SIMB[menor]}: ${RADIO[menor]} pm.`, ecuacion: [Rv, `(${SIMB[mayor]}) > `, Rv, `(${SIMB[menor]})`], dibujo: tabla({ propiedad: { valores: valores(RADIO, [a, b]), max: 245, forma: 'circulo', color: 'i' }, marcadas: [{ Z: a, color: 'i' }, { Z: b, color: 'i' }] }) },
        };
      },
    },
  };

  // ---------- Idea 4: energía de ionización y afinidad electrónica ----------
  // Cambia: el periodo que se mira · Permanece: barras de EI a la misma escala · Progresa: de la subida general a
  // sus dos saltos · Se reserva: el par N–O del periodo 2 · Debe verse: que la barra del O es más baja que la del N.
  const PERIODOS = { 3: [11, 12, 13, 14, 15, 16, 17, 18], 4: [19, 20, 31, 32, 33, 34, 35, 36] };
  const P2 = [3, 4, 5, 6, 7, 8, 9, 10];
  const barrasEI = (zs, extra = {}) => tabla(Object.assign({ propiedad: { valores: valores(EI, zs), max: 2400, forma: 'barra', color: 'o', nombre: 'EI (kJ/mol)' }, rotulo: 'EI: energía de ionización (kJ/mol)' }, extra));
  const ionizacion = {
    id: 'energia-ionizacion',
    titulo: 'Cuánto cuesta arrancar un electrón',
    temas: ['Energía de ionización y afinidad electrónica'],
    pieza: 'quim-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Arrancar un electrón', texto: 'Quitarle un electrón a un átomo siempre cuesta energía. Se mide con el átomo aislado, en estado gaseoso, y se da en kilojulios por cada mol de átomos: kJ/mol.' },
        { titulo: 'Un nombre y un símbolo', texto: ['Esa energía se llama energía de ionización, ', EIv, '. Al perder el electrón, el átomo queda como catión, con carga +1.'], ecuacion: ['X(g) → X⁺(g) + e⁻'] },
        { titulo: 'No confundir', texto: 'La afinidad electrónica es otro proceso: el átomo gaseoso gana un electrón y queda como anión. Una cosa es quitar y otra es recibir.', ecuacion: ['X(g) + e⁻ → X⁻(g)'] },
        { titulo: 'Qué mirar', texto: 'Cada barra es la energía de ionización de un elemento, todas a la misma escala. Mientras el marco recorre la fila, compara cada barra con la anterior.' },
      ],
    },
    juega: {
      consigna: 'Elige un periodo. Cada barra es la energía para quitarle un electrón al átomo gaseoso. Un marco recorre la fila solo: ¿siempre sube?',
      voz: 'Busca las barras que no siguen la subida.',
      controles: [{ id: 'p', etiqueta: 'Periodo', opciones: Object.keys(PERIODOS).map(p => ({ valor: p, texto: `Periodo ${p}` })) }, T_CURSOR(9)],
      // Se agarra el comienzo de la fila y se lo sube o baja: al soltar, cae en el periodo 3 o en el 4.
      arrastres: [{ id: 'fila', etiqueta: 'fila del periodo', color: 'c-o',
        donde: v => enCasilla(PERIODOS[v.p][0]),
        mover: pt => { const c = QT().casilla(11), per = 3 + (pt.y - c.cy) / c.h; return { p: per < 3.5 ? '3' : '4' }; } }],
      dibujo: v => barrasEI(PERIODOS[v.p], { marcadas: [{ Z: enCursor(PERIODOS[v.p], v.t), color: 'o' }] }),
      lectura: v => {
        const zs = PERIODOS[v.p], z = enCursor(zs, v.t), i = zs.indexOf(z), antes = i > 0 ? zs[i - 1] : null;
        return [EIv, ` (${SIMB[z]}) = ${EI[z]} kJ/mol${antes ? (EI[z] > EI[antes] ? ` · sube desde ${SIMB[antes]}` : ` · baja desde ${SIMB[antes]}`) : ''}`];
      },
      minimo: 2,
    },
    predice: {
      pregunta: '¿Qué átomo necesita más energía para perder un electrón: el nitrógeno (N) o el oxígeno (O)?',
      voz: 'Tómate tu tiempo: la flecha general no lo decide todo.',
      opciones: [
        { id: 'c', texto: 'El nitrógeno', correcta: true },
        { id: 'o', texto: 'El oxígeno, porque está más a la derecha', error: 'QM-FLECHA', siFuera: 'La tendencia sube hacia la derecha, cierto. Pero el O tiene un 2p apareado que sale más fácil.' },
        { id: 'igual', texto: 'Los dos igual: están en el mismo periodo', error: 'TP7', siFuera: 'Comparten periodo, bien visto. Pero su carga nuclear y su último electrón son distintos.' },
      ],
      dibujo: tabla({ marcadas: [{ Z: 7, color: 'o' }, { Z: 8, color: 'o' }] }),
      revelar: barrasEI(P2, { marcadas: [{ Z: 7, color: 'o' }, { Z: 8, color: 'o' }], rotulo: 'N 1402 · O 1314 kJ/mol' }),
      coincide: 'Coincide: 1402 kJ/mol del N frente a 1314 del O.',
      noCoincide: 'El N pide 1402 kJ/mol y el O, 1314: aquí la tendencia se rompe.',
    },
    mira: {
      datos: barrasEI(P2, { marcadas: [{ Z: 3, color: 'o', desde: 1 }, { Z: 10, color: 'o', desde: 2 }, { Z: 5, color: 'h', desde: 3 }, { Z: 8, color: 'h', desde: 4 }] }).datos,
      voz: 'Recorramos el periodo 2 barra por barra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El litio pierde su 2s¹ con poca energía.', ecuacion: ['Li: 520 kJ/mol'] },
        { estado: { corte: 2 }, texto: 'El neón, con el nivel 2 lleno, es el que más pide.', ecuacion: ['Ne: 2081 kJ/mol'] },
        { estado: { corte: 3 }, texto: 'Salto 1: el B pide menos que el Be; su 2p está más lejos.', ecuacion: ['Be 900 > B 801'] },
        { estado: { corte: 4 }, texto: 'Salto 2: el O pide menos que el N; su 2p apareado se repele.', ecuacion: ['N 1402 > O 1314'] },
        { estado: { corte: 4 }, texto: 'La afinidad electrónica es otro proceso: el átomo gana un electrón.', ecuacion: ['X(g) + e⁻ → X⁻(g)'] },
      ],
    },
    regla: {
      texto: 'La energía de ionización es la que se necesita para quitar un electrón a un átomo gaseoso. Sube hacia la derecha y hacia arriba, con saltos.',
      ecuacion: [{ llave: ['X(g)'], nota: 'gaseoso' }, ' → X⁺(g) + e⁻', '   ·   ', EIv, ': N > O, Be > B'],
      condicion: 'las flechas son tendencias, no leyes: se comparan los datos. La afinidad electrónica es otro proceso: X(g) + e⁻ → X⁻(g).',
      voz: 'Ante la duda, mira el dato.',
    },
    // Así se resuelve: el problema de «Ahora tú» (quién pide más energía), con los mismos PARES, EI y saltos.
    resuelve: {
      generar(s) {
        const PARES = [[4, 5], [7, 8], [12, 13], [15, 16], [3, 11], [11, 19], [9, 17], [6, 7], [11, 17], [3, 9], [20, 31], [33, 34], [2, 10], [17, 35]];
        const r = azar(s + 900), [a, b] = r.de(PARES), mayor = EI[a] > EI[b] ? a : b, menor = mayor === a ? b : a;
        const salto = [[4, 5], [7, 8], [12, 13], [15, 16], [33, 34], [20, 31]].some(([x, y]) => x === a && y === b);
        const pApareado = [[7, 8], [15, 16], [33, 34]].some(([x, y]) => x === a && y === b);
        const misma = lugar(a).grupo === lugar(b).grupo;
        const donde = z => `${SIMB[z]}: periodo ${lugar(z).periodo}, grupo ${lugar(z).grupo}`;
        const por = salto ? (pApareado ? `el ${SIMB[b]} estrena un par en su subnivel p: los dos electrones se repelen y uno sale más fácil.`
          : `el ${SIMB[b]} estrena el subnivel p, algo más lejos del núcleo que el s: su electrón sale más fácil.`)
          : misma ? `el ${SIMB[mayor]} está más arriba: su último electrón está más cerca del núcleo.` : `el ${SIMB[mayor]} está más a la derecha: más protones jalan el mismo nivel.`;
        return {
          enunciado: `¿Cuál necesita más energía para perder un electrón: ${NOMBRE[a]} (${SIMB[a]}) o ${NOMBRE[b]} (${SIMB[b]})?`,
          dibujo: tabla({ marcadas: [{ Z: a, color: 'o' }, { Z: b, color: 'o' }] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden cuál de los dos tiene mayor energía de ionización ', EIv, '.'] },
            { tipo: 'datos', texto: misma ? `Están en la misma columna, el grupo ${lugar(a).grupo}.` : `Están en la misma fila, el periodo ${lugar(a).periodo}.`, ecuacion: [donde(a), '   ·   ', donde(b)] },
            { tipo: 'regla', texto: 'La energía de ionización tiende a subir hacia la derecha y hacia arriba. Pero tiene saltos: la flecha orienta y el dato decide.' },
            { tipo: 'cuentas', texto: 'Leo los dos datos y los resto para ver cuánto más pide uno.',
              ecuacion: [EIv, `(${SIMB[mayor]}) − `, EIv, `(${SIMB[menor]}) = ${EI[mayor]} − ${EI[menor]} = ${EI[mayor] - EI[menor]} kJ/mol`],
              dibujo: barrasEI([a, b], { marcadas: [{ Z: a, color: 'o' }, { Z: b, color: 'o' }] }) },
            { tipo: 'sentido', texto: salto ? `Aquí la flecha falla: ${por}` : `Cuadra con la flecha: ${por}` },
          ],
          respuesta: `El ${SIMB[mayor]}: ${EI[mayor]} kJ/mol, frente a ${EI[menor]} del ${SIMB[menor]}.`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Compara las dos casillas; la flecha no basta.',
      generar(s) {
        const PARES = [[4, 5], [7, 8], [12, 13], [15, 16], [3, 11], [11, 19], [9, 17], [6, 7], [11, 17], [3, 9], [20, 31], [33, 34], [2, 10], [17, 35]];
        const [a, b] = PARES[s % PARES.length], mayor = EI[a] > EI[b] ? a : b, menor = mayor === a ? b : a;
        const salto = [[4, 5], [7, 8], [12, 13], [15, 16], [33, 34], [20, 31]].some(([x, y]) => x === a && y === b);
        return {
          pregunta: `¿Cuál necesita más energía para perder un electrón: ${NOMBRE[a]} (${SIMB[a]}) o ${NOMBRE[b]} (${SIMB[b]})?`,
          dibujo: tabla({ marcadas: [{ Z: a, color: 'o' }, { Z: b, color: 'o' }] }),
          opciones: [
            { id: 'c', texto: SIMB[mayor], correcta: true },
            { id: 'otro', texto: SIMB[menor], error: salto ? 'QM-FLECHA' : 'TP7', siFuera: salto ? 'La flecha diría eso, pero este es uno de los saltos: mira el dato.' : 'Sería así si la tendencia fuera al revés; mira su lugar en la tabla.' },
            { id: 'igual', texto: 'Los dos igual', error: 'TP7', siFuera: 'Comparten fila o columna, pero su carga nuclear y su nivel no son iguales.' },
          ],
          solucion: { texto: `${SIMB[a]}: ${EI[a]} kJ/mol; ${SIMB[b]}: ${EI[b]} kJ/mol.`, ecuacion: [EIv, `(${SIMB[mayor]}) > `, EIv, `(${SIMB[menor]})`], dibujo: barrasEI([a, b], { marcadas: [{ Z: a, color: 'o' }, { Z: b, color: 'o' }] }) },
        };
      },
    },
  };

  // ---------- Idea 5: electronegatividad ----------
  // Cambia: el par de átomos enlazados · Permanece: la escala de Pauling en barras · Progresa: de un par parejo
  // (C–H) a uno muy desigual (Na–Cl) · Se reserva: el flúor aislado, que no tiene carga · Debe verse: hacia qué
  // átomo se corre el par de electrones.
  const PARES_EN = { 'H–Cl': [1, 17], 'C–H': [6, 1], 'O–H': [8, 1], 'Na–Cl': [11, 17], 'C–O': [6, 8] };
  // Animación: un marco recorre el periodo 2 de izquierda a derecha y después baja por el grupo 17 (las dos tendencias).
  const RUTA_EN = [3, 4, 5, 6, 7, 8, 9, 17, 35];
  const barrasEN = (zs, extra = {}) => tabla(Object.assign({ propiedad: { valores: valores(EN, zs), max: 4, forma: 'barra', color: 'd', nombre: 'EN (Pauling)' }, rotulo: 'EN: electronegatividad (Pauling)' }, extra));
  // Sin arrastre: el control elige un enlace, es decir, un par de elementos; no hay un solo objeto que agarrar.
  // (En el laboratorio, la mesa «Dos elementos lado a lado» deja arrastrar cada casilla por separado.)
  // Hallazgo 9 de la auditoría: son dos representaciones a propósito. La tabla compara los valores de EN; «Mira»
  // pasa a la molécula de HCl para mostrar qué hace esa diferencia dentro de un enlace (el par se corre).
  const electroneg = {
    id: 'electronegatividad',
    titulo: 'Quién jala el par compartido',
    temas: ['Electronegatividad'],
    pieza: 'quim-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Un par entre dos', texto: 'Cuando dos átomos se unen compartiendo electrones, queda un par de electrones entre los dos. En cada molécula de agua del Titicaca, cada hidrógeno comparte un par con el oxígeno.' },
        { titulo: 'Una escala de números', texto: ['En 1932, Linus Pauling propuso una escala de números para la electronegatividad, ', ENv, '. Sus valores van de menos de 1 a casi 4; las barras de la tabla los muestran.'] },
        { titulo: 'La diferencia', texto: ['Para un enlace entre dos átomos distintos se calcula la diferencia Δ', ENv, ': se resta el valor menor del mayor. La lectura del juego la da en cada enlace.'], ecuacion: ['Δ', ENv, ' = mayor − menor'] },
        { titulo: 'Qué mirar', texto: 'Mira cuál de los dos átomos marcados tiene la barra más alta. Mientras el otro marco recorre el periodo 2 y baja por el grupo 17, fíjate cómo cambian las barras.' },
      ],
    },
    juega: {
      consigna: 'Elige un enlace y compara las barras de electronegatividad de los dos átomos marcados. Otro marco recorre solo el periodo 2 y el grupo 17.',
      voz: 'Mira cuál de los dos tiene la barra más alta.',
      controles: [{ id: 'k', etiqueta: 'Enlace', opciones: Object.keys(PARES_EN).map(k => ({ valor: k, texto: k })) }, T_CURSOR(RUTA_EN.length + 1)],
      dibujo: v => barrasEN(TODOS, { marcadas: [...PARES_EN[v.k].map(Z => ({ Z, color: 'd' })), ...(PARES_EN[v.k].includes(enCursor(RUTA_EN, v.t)) ? [] : [{ Z: enCursor(RUTA_EN, v.t) }])] }),
      lectura: v => { const [a, b] = PARES_EN[v.k], m = EN[a] > EN[b] ? a : b, z = enCursor(RUTA_EN, v.t); return [`${SIMB[z]}: `, ENv, ` ${f(EN[z])} · par ${v.k}: Δ`, ENv, ` ${f(Math.abs(EN[a] - EN[b]))}, atrae el ${SIMB[m]}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'El flúor es el elemento más electronegativo. ¿Qué dice eso de un átomo de flúor aislado, sin enlaces?',
      voz: 'Piensa dónde se mide la electronegatividad.',
      opciones: [
        { id: 'c', texto: 'Nada por sí solo: se mide dentro de un enlace', correcta: true },
        { id: 'carga', texto: 'Que tiene carga negativa', error: 'TP8', siFuera: 'Sería cierto si fuera el ion F⁻. El átomo aislado es neutro: 9 protones y 9 electrones.' },
        { id: 'mas-e', texto: 'Que tiene más electrones que protones', error: 'TP8', siFuera: 'Eso describe a un anión. La electronegatividad habla de atraer electrones de un enlace.' },
        { id: 'afinidad', texto: 'Que libera mucha energía al ganar un electrón', error: 'QM-EN-AFINIDAD', siFuera: 'Eso es la afinidad electrónica, otro proceso medido en energía; la electronegatividad no tiene unidades.' },
      ],
      dibujo: tabla({ marcadas: [{ Z: 9, color: 'd' }] }),
      revelar: barrasEN(TODOS, { marcadas: [{ Z: 9, color: 'd' }], rotulo: 'F: 3,98, el mayor; sin dato en He, Ne, Ar, Kr' }),
      coincide: 'Coincide: es una tendencia dentro de un enlace, no una carga.',
      noCoincide: 'La electronegatividad describe un enlace; el átomo de F aislado es neutro.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: {
        atomos: [{ id: 'h', t: 'H', x: -1, y: 0, desde: 1 }, { id: 'cl', t: 'Cl', x: 1, y: 0, color: 'd', desde: 1 }],
        enlaces: [{ a: 'h', b: 'cl', dipolo: 'b', desde: 3 }, { a: 'h', b: 'cl', desde: 1, hasta: 2 }],
        pares: [{ en: 'cl', ang: 0, desde: 1 }, { en: 'cl', ang: -90, desde: 1 }, { en: 'cl', ang: 90, desde: 1 }],
        cargas: [{ en: 'h', t: 'δ+', ang: -90, desde: 2 }, { en: 'cl', t: 'δ−', ang: -150, color: 'd', desde: 2 }],
        escala: 75, alto: 150,
        alt: 'Molécula de HCl: el par del enlace se corre hacia el cloro, que queda con carga parcial negativa; el hidrógeno, con carga parcial positiva.',
      },
      voz: 'Veamos qué hace la diferencia dentro de un enlace.',
      pasos: [
        { estado: { corte: 1 }, texto: 'H y Cl comparten un par de electrones.', ecuacion: [ENv, '(H) = 2,20', '   ·   ', ENv, '(Cl) = 3,16'] },
        { estado: { corte: 2 }, texto: 'El Cl jala más el par: queda con carga parcial δ−.', ecuacion: ['Δ', ENv, ' = 3,16 − 2,20 = 0,96'] },
        { estado: { corte: 3 }, texto: 'La flecha del dipolo apunta al más electronegativo.', ecuacion: ['H → Cl'] },
        { estado: { corte: 3 }, texto: 'Con una diferencia grande, como Na–Cl, el par casi se transfiere.', ecuacion: ['Δ', ENv, '(Na–Cl) = 2,23'] },
      ],
    },
    regla: {
      texto: 'La electronegatividad mide cuánto atrae un átomo los electrones de un enlace. Crece hacia la derecha y hacia arriba; el flúor tiene el valor más alto.',
      ecuacion: [{ llave: ['Δ', ENv], nota: 'diferencia', color: 'c-d' }, ' grande → ', 'enlace\u00a0más\u00a0polar'],
      condicion: 'se usa una sola escala (aquí, Pauling, sin unidades). He, Ne y Ar no tienen valor en ella.',
      voz: 'Electronegativo no es negativo: es quien jala más.',
    },
    // Así se resuelve: la variante de números de «Ahora tú» (Δ EN de un enlace), con los mismos PARES y EN.
    resuelve: {
      generar(s) {
        const PARES = [[1, 8], [6, 7], [1, 9], [11, 8], [6, 16], [14, 8], [1, 16], [19, 35], [15, 9], [12, 17], [5, 7], [13, 9], [6, 9], [1, 6]];
        const r = azar(s + 900), [a, b] = r.de(PARES), m = EN[a] > EN[b] ? a : b, o = m === a ? b : a, d = Math.abs(EN[a] - EN[b]);
        return {
          enunciado: ['¿Cuánto vale Δ', ENv, ` en el enlace ${SIMB[a]}–${SIMB[b]}, y hacia qué átomo se corre el par compartido?`],
          dibujo: tabla({ marcadas: [{ Z: a, color: 'd' }, { Z: b, color: 'd' }] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la diferencia Δ', ENv, ` del enlace ${SIMB[a]}–${SIMB[b]} y hacia qué lado se corre el par.`] },
            { tipo: 'datos', texto: 'Leo los dos valores en la escala de Pauling.', ecuacion: [ENv, `(${SIMB[a]}) = ${f(EN[a])}   ·   `, ENv, `(${SIMB[b]}) = ${f(EN[b])}`] },
            { tipo: 'regla', texto: 'La diferencia se saca restando el valor menor del mayor, entera: no se suma ni se divide. El par se corre hacia el que tiene más.' },
            { tipo: 'cuentas', texto: `El mayor es el del ${SIMB[m]}; le resto el del ${SIMB[o]}.`, ecuacion: ['Δ', ENv, ` = ${f(EN[m])} − ${f(EN[o])} = ${f(d)}`],
              dibujo: barrasEN([a, b], { marcadas: [{ Z: a, color: 'd' }, { Z: b, color: 'd' }] }) },
            { tipo: 'sentido', texto: `Sale positivo y menor que 4, como la escala. Y la barra más alta es la del ${SIMB[m]}: hacia él va el par.` },
          ],
          respuesta: ['Δ', ENv, ` = ${f(d)}; el par se corre hacia el ${SIMB[m]}.`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Compara las dos barras.',
      generar(s) {
        const PARES = [[1, 8], [6, 7], [1, 9], [11, 8], [6, 16], [14, 8], [1, 16], [19, 35], [15, 9], [12, 17], [5, 7], [13, 9], [6, 9], [1, 6]];
        const [a, b] = PARES[s % PARES.length], m = EN[a] > EN[b] ? a : b, o = m === a ? b : a, d = Math.abs(EN[a] - EN[b]);
        if (s % 2) return {
          pregunta: `En el enlace ${SIMB[a]}–${SIMB[b]}, ¿hacia qué átomo se corre el par de electrones compartido?`,
          dibujo: tabla({ marcadas: [{ Z: a, color: 'd' }, { Z: b, color: 'd' }] }),
          opciones: [
            { id: 'c', texto: `Hacia el ${SIMB[m]}`, correcta: true },
            { id: 'otro', texto: `Hacia el ${SIMB[o]}`, error: 'QM-EN-ORDEN', siFuera: 'Sería así si el otro tuviera mayor electronegatividad; compara sus barras.' },
            { id: 'centro', texto: 'Queda en el medio', error: 'QM-EN-ORDEN', siFuera: 'Solo queda en el medio si los dos átomos son iguales.' },
          ],
          solucion: { texto: `${SIMB[m]}: ${f(EN[m])}; ${SIMB[o]}: ${f(EN[o])}. Jala más el ${SIMB[m]}.`, dibujo: barrasEN([a, b], { marcadas: [{ Z: a, color: 'd' }, { Z: b, color: 'd' }] }) },
        };
        return {
          pregunta: ['¿Cuánto vale Δ', ENv, ` en el enlace ${SIMB[a]}–${SIMB[b]}? (${SIMB[a]}: ${f(EN[a])}; ${SIMB[b]}: ${f(EN[b])})`],
          opciones: opciones(d, [
            { id: 'suma', valor: EN[a] + EN[b], error: 'QM-EN-SUMA', siFuera: 'Eso suma las dos. La polaridad depende de la diferencia.' },
            { id: 'mayor', valor: EN[m], error: 'QM-EN-SUMA', siFuera: 'Ese es solo el valor del más electronegativo; falta restar el otro.' },
            { id: 'medio', valor: d / 2, error: 'QM-EN-SUMA', siFuera: 'Eso divide la diferencia entre dos; la diferencia va entera.' },
          ], x => f(x)),
          solucion: { texto: 'Se resta el menor del mayor.', ecuacion: ['Δ', ENv, ` = ${f(EN[m])} − ${f(EN[o])} = ${f(d)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Las tres propiedades de la unidad, con su escala, sobre los 36 elementos (incluye los de transición en la casilla d).
  const PROPS = {
    r: { tabla: RADIO, max: 245, forma: 'circulo', color: 'i', nombre: 'radio (pm)', unidad: 'pm', dec: 0, v: Rv },
    ei: { tabla: EI, max: 2400, forma: 'barra', color: 'o', nombre: 'EI (kJ/mol)', unidad: 'kJ/mol', dec: 0, v: EIv },
    en: { tabla: EN, max: 4, forma: 'barra', color: 'd', nombre: 'EN (Pauling)', unidad: '', dec: 2, v: ENv },
  };
  const OP_PROPS = [{ valor: 'r', texto: 'Radio' }, { valor: 'ei', texto: 'Ionización' }, { valor: 'en', texto: 'Electronegatividad' }];
  const valorDe = (k, z) => { const P = PROPS[k], x = P.tabla[z]; return x === null ? 'sin dato' : `${P.dec ? f(x, P.dec) : x}${P.unidad ? ` ${P.unidad}` : ''}`; };
  const tablaProp = (k, marcadas) => { const P = PROPS[k]; return tabla({ propiedad: { valores: valores(P.tabla, TODOS), max: P.max, forma: P.forma, color: P.color, nombre: P.nombre }, marcadas }); };
  // Extremos de las tablas de datos, para los retos del laboratorio (se calculan, no se escriben).
  const conDato = t => TODOS.map(z => t[z]).filter(x => x !== null);
  const MAYOR = { r: Math.max(...conDato(RADIO)), ei: Math.max(...conDato(EI)), dif: Math.max(...conDato(EN)) - Math.min(...conDato(EN)) };
  const MENOR4 = Math.min(...TODOS.filter(z => lugar(z).periodo === 4).map(z => RADIO[z]));
  const SIMBV = z => (z >= 21 && z <= 30 ? `${SIMB[z]} (d)` : SIMB[z]);

  return {
    unidad: 'quimica.tabla-periodica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-tabla.js', '/nucleo/kit/piezas/quim-molecula.js'],
    historia: {
      texto: 'En 1869, Mendeléiev ordenó los elementos conocidos buscando regularidades y dejó casillas vacías para elementos que aún no se conocían; Lothar Meyer trabajaba en clasificaciones parecidas. El orden por masa tenía anomalías que se resolvieron después, al ordenar por número atómico. La tabla de hoy resume configuraciones y propiedades, con sus excepciones.',
      pregunta: '¿Cómo predices algo que todavía nadie ha visto?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §6.5', url: 'https://openstax.org/books/chemistry-2e/pages/6-5-periodic-variations-in-element-properties' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      { termino: 'periodo', formas: ['periodo', 'periodos'], def: 'Fila de la tabla. Su número es el nivel más alto con electrones.',
        ejemplo: 'El sodio, 1s² 2s² 2p⁶ 3s¹, está en el periodo 3.', ver: ['grupo'] },
      { termino: 'grupo', formas: ['grupo', 'grupos'], def: 'Columna de la tabla: sus elementos tienen la misma cantidad de electrones de valencia y se parecen.',
        ejemplo: 'Li, Na y K, grupo 1: un electrón de valencia cada uno.', ver: ['periodo', 'electrones de valencia'] },
      { termino: 'bloque', formas: ['bloque', 'bloques'], def: 'Zona de la tabla según el subnivel donde entra el último electrón: s, p, d o f.',
        ver: ['configuración electrónica'] },
      { termino: 'electrones de valencia', formas: ['electrones de valencia', 'electrón de valencia', 'de valencia'],
        def: 'Los electrones del último nivel: los que participan al formar enlaces.',
        ejemplo: 'El cloro, 3s² 3p⁵, tiene 2 + 5 = 7.', ver: ['grupo', 'símbolo de Lewis'] },
      { termino: 'símbolo de Lewis', formas: ['símbolo de Lewis', 'símbolos de Lewis'],
        def: 'El símbolo del elemento rodeado de un punto por cada electrón del último nivel.',
        ejemplo: 'El nitrógeno lleva 5 puntos: uno por cada electrón de valencia.', ver: ['electrones de valencia'] },
      { termino: 'metal', formas: ['metal', 'metales'], def: 'Elemento brillante que conduce la corriente y el calor y tiende a perder electrones. Está a la izquierda.',
        ver: ['no metal', 'semimetal'] },
      { termino: 'no metal', formas: ['no metal', 'no metales'], def: 'Elemento que no conduce bien la corriente y tiende a ganar o compartir electrones. Está a la derecha.',
        ver: ['metal'] },
      { termino: 'semimetal', formas: ['semimetal', 'semimetales'], def: 'Elemento junto a la escalera de la tabla, con propiedades intermedias entre metal y no metal.',
        ejemplo: 'Boro, silicio, germanio, arsénico.', ver: ['metal', 'no metal'] },
      { termino: 'radio atómico', formas: ['radio atómico', 'radios atómicos'],
        def: 'Tamaño de un átomo: la mitad de la distancia entre los núcleos de dos átomos iguales unidos.',
        medida: 'pm', ejemplo: 'Na 190 pm y Cl 79 pm: en el periodo 3 el tamaño baja.', ver: ['carga nuclear'] },
      { termino: 'picómetro', simbolo: 'pm', formas: ['picómetro', 'picómetros'], def: 'Unidad de longitud para medir átomos: la billonésima parte de un metro.',
        ejemplo: '1 pm = 0,000 000 000 001 m.', ver: ['radio atómico'] },
      { termino: 'carga nuclear', def: 'Carga positiva del núcleo, igual a su número de protones: es la que atrae a los electrones.',
        ver: ['protón', 'radio atómico'] },
      { termino: 'energía de ionización', simbolo: 'EI', medida: 'kJ/mol', formas: ['energía de ionización', 'energías de ionización', 'ionización'],
        def: 'Energía para arrancar el electrón más externo de un átomo aislado, en estado gaseoso.',
        ejemplo: 'Sodio: 496 kJ/mol; cloro: 1251 kJ/mol.', ver: ['afinidad electrónica'] },
      { termino: 'afinidad electrónica', def: 'Energía en juego cuando un átomo aislado, en estado gaseoso, gana un electrón.',
        ver: ['energía de ionización', 'electronegatividad'] },
      { termino: 'electronegatividad', simbolo: 'EN', def: 'Cuánto atrae un átomo los electrones que comparte en un enlace. No tiene unidades.',
        ejemplo: 'Flúor 3,98, el mayor; potasio 0,82.', ver: ['afinidad electrónica'] },
      { termino: 'tendencia periódica', formas: ['tendencia periódica', 'tendencias periódicas', 'tendencia', 'tendencias'],
        def: 'Cómo cambia una propiedad al recorrer la tabla por un grupo o un periodo. Tiene excepciones.',
        ver: ['periodo', 'grupo'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera da las tres propiedades de un elemento a la
    // vez, del H al Kr (con los de transición, que las ideas no muestran); la segunda pone dos elementos lado a lado,
    // cada uno con su casilla arrastrable. La lectura dice los elementos y los valores, para que el caso se lea solo.
    laboratorio: [
      {
        id: 'tres-propiedades', titulo: 'Un elemento, tres propiedades', pieza: 'quim-tabla',
        consigna: 'La casilla recorre la tabla sola, también los de transición. Cambia la propiedad del fondo; pausa o arrastra la casilla para comparar vecinos.',
        controles: [
          { id: 'z', etiqueta: 'Z', color: 'c-h', min: 1, max: 36, paso: 1, inicio: 11, decimales: 0, auto: { velocidad: 1.5 } },
          { id: 'p', etiqueta: 'Propiedad', opciones: OP_PROPS },
        ],
        dibujo: v => tablaProp(v.p, [{ Z: zr(v).z, color: 'h' }]),
        lectura: v => { v = zr(v); return [`${SIMBV(v.z)}: `, Rv, ` ${valorDe('r', v.z)} · `, EIv, ` ${valorDe('ei', v.z)} · `, ENv, ` ${valorDe('en', v.z)}`]; },
        arrastres: [{ id: 'casilla', etiqueta: 'casilla marcada: llévala a otro elemento', color: 'c-h',
          donde: v => enCasilla(zr(v).z),
          mover: (pt, v) => ({ z: zBajo(pt, zr(v).z) }) }],
        // Retos comprobados (docs/teoria.md §4d): leen las mismas tablas de datos y el mismo lugar(z) que pinta la casilla.
        invitaciones: [
          { texto: 'Busca el átomo más grande de toda la tabla.',
            logrado: v => RADIO[v.z] === MAYOR.r,
            bien: 'Abajo y a la izquierda: muchos niveles y poca carga nuclear por electrón.' },
          { texto: 'Con la ionización de fondo, ve al elemento al que más cuesta arrancarle un electrón.',
            logrado: v => v.p === 'ei' && EI[v.z] === MAYOR.ei,
            bien: 'Arriba a la derecha: el helio guarda sus dos electrones muy cerca del núcleo.' },
          { texto: 'Busca el átomo más pequeño del periodo 4.',
            logrado: v => lugar(v.z).periodo === 4 && RADIO[v.z] === MENOR4,
            bien: 'Al final del periodo: mismo nivel, más protones jalando.' },
          { texto: 'Guarda dos elementos del mismo grupo, en periodos distintos.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => lugar(a.z).grupo === lugar(b.z).grupo && lugar(a.z).periodo !== lugar(b.z).periodo)),
            bien: 'Compara sus radios: ¿el de abajo siempre es más grande?' },
        ],
      },
      {
        id: 'dos-elementos', titulo: 'Dos elementos lado a lado', pieza: 'quim-tabla',
        consigna: 'Arrastra las dos casillas a dos elementos y elige la propiedad. Busca un par que rompa la tendencia.',
        controles: [
          { id: 'a', etiqueta: 'Primero', color: 'c-h', min: 1, max: 36, paso: 1, inicio: 7, decimales: 0 },
          { id: 'b', etiqueta: 'Segundo', color: 'c-i', min: 1, max: 36, paso: 1, inicio: 8, decimales: 0 },
          { id: 'p', etiqueta: 'Propiedad', opciones: OP_PROPS, inicio: 'ei' },
        ],
        dibujo: v => tablaProp(v.p, [{ Z: v.a, color: 'h' }, { Z: v.b, color: 'i' }]),
        lectura: v => [PROPS[v.p].v, `: ${SIMBV(v.a)} ${valorDe(v.p, v.a)} · ${SIMBV(v.b)} ${valorDe(v.p, v.b)}`],
        arrastres: [
          { id: 'primero', etiqueta: 'casilla del primer elemento', color: 'c-h', donde: v => enCasilla(v.a), mover: (pt, v) => ({ a: zBajo(pt, v.a) }) },
          { id: 'segundo', etiqueta: 'casilla del segundo elemento', color: 'c-i', donde: v => enCasilla(v.b), mover: (pt, v) => ({ b: zBajo(pt, v.b) }) },
        ],
        invitaciones: [
          { texto: 'En el periodo 3, busca dos vecinos donde la ionización baje hacia la derecha.',
            logrado: v => v.p === 'ei' && v.b === v.a + 1 && lugar(v.a).periodo === 3 && lugar(v.b).periodo === 3 && EI[v.b] < EI[v.a],
            bien: 'La flecha falla aquí: mira qué subnivel estrena el segundo.' },
          { texto: 'Con el radio de fondo, pon el segundo justo debajo del primero, en su grupo.',
            logrado: v => v.p === 'r' && lugar(v.a).grupo === lugar(v.b).grupo && lugar(v.b).periodo === lugar(v.a).periodo + 1,
            bien: 'Un nivel más abajo, un átomo más grande. ¿Pasa en todos los grupos?' },
          { texto: 'Busca el par con la mayor diferencia de electronegatividad.',
            logrado: v => v.p === 'en' && EN[v.a] !== null && EN[v.b] !== null && Math.abs(EN[v.a] - EN[v.b]) === MAYOR.dif,
            bien: 'Tan distintos que uno se quedaría con los electrones del otro.' },
          { texto: 'Encuentra dos elementos distintos con la misma electronegatividad.',
            logrado: v => v.p === 'en' && v.a !== v.b && EN[v.a] !== null && EN[v.a] === EN[v.b],
            bien: 'Jalan los electrones igual, aunque estén lejos en la tabla.' },
        ],
      },
    ],
    ideas: [ley, ubicacion, radio, ionizacion, electroneg],
  };
});
