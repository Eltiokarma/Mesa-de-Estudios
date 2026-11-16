/*
 * Teoría de «Nomenclatura inorgánica» (quimica.nomenclatura-inorganica). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 5), docs/teoria/fuentes/historia-ecuaciones-1.pdf y
 * la guía breve de nomenclatura inorgánica de la IUPAC (2015, act. 2017). Errores: docs/investigacion/quimica-
 * materia-nomenclatura-organica-ideas-erroneas.md (NO1–NO4) y estequiometria (ES11); los QM- son hipótesis nuevas.
 * Precisión del expediente: no se enseña el «cruce ciego» de cargas; la proporción sale de que la suma de cargas
 * sea cero, se simplifica y los iones poliatómicos no se rompen (van entre paréntesis).
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: pasar de fórmula a nombre y de nombre a fórmula sabiendo por qué, con la suma de cargas a la vista.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: halla un estado de oxidación, escribe la fórmula de una sal sin romper iones, nombra en
 *     tres sistemas y reconoce óxidos, peróxidos, hidróxidos, ácidos y sales ácidas, básicas e hidratadas.
 *   Orden de atención: 1.º las fichas y su cuenta de cargas · 2.º la lectura en vivo · acción: probar · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿el romano cuenta átomos?, ¿Ca(NO₃)₂ o CaN₂O₆?, ¿Na₂O₂ se simplifica?, ¿el ·5H₂O es OH?
 *
 * Colores (regla 4): estado de oxidación ω verde c-d, carga de la especie z rojo c-h, catión naranja c-o, anión
 * turquesa c-i (también en las fichas). Los demás átomos de las fichas van en tinta.
 * Fuentes (no van al alumno): IUPAC, Brief Guide to Inorganic Nomenclature; OpenStax Chemistry 2e §2.7.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const w = { v: 'c-d', t: 'ω' }, z = { v: 'c-h', t: 'z' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let x = q; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const sub = n => (n === 1 ? '' : String(n).split('').map(c => SUBS[+c]).join(''));
  const sg = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
  const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  // Fórmula desde [símbolo, cantidad] (ya en orden). Un grupo poliatómico va entre paréntesis si se repite.
  const formula = partes => partes.map(([s, n, poli]) => (poli && n > 1 ? `(${s})${sub(n)}` : `${s}${sub(n)}`)).join('');
  const elegir = (bien, malas) => {
    const vistos = new Set([bien]);
    return [{ id: 'c', texto: bien, correcta: true }, ...malas.filter(x => !vistos.has(x.texto) && vistos.add(x.texto))].slice(0, 4);
  };
  const fichas = (lista, extra = {}) => ({ datos: Object.assign({ fichas: lista }, extra), estado: {} });
  // ---------- Animación (docs/3d.md §6) ----------
  // Un control con auto avanza sin ajustarse a su paso: los conteos se leen enteros. Las piezas que se arman por
  // pasos reciben corte = paso + 0,5: se ve lo de desde ≤ paso, sin la clase de «lo nuevo» de «Mira» (que en cada
  // cuadro volvería a empezar).
  const ent = (v, ...ids) => { const x = Object.assign({}, v); for (const k of ids) x[k] = Math.round(x[k]); return x; };
  const T_AUTO = (max, vel = 1) => ({ id: 't', etiqueta: 't', min: 0, max, paso: 0.1, inicio: max, unidad: 's', decimales: 1, auto: { velocidad: vel } });

  // ---------- Idea 1: los estados de oxidación suman la carga ----------
  // Cambia: el estado del átomo que falta · Permanece: O −2 y H +1 en sus fichas · Progresa: la suma se acerca a la
  // carga de la especie · Se reserva: el peróxido, donde el O vale −1 · Debe verse: la carga neta que queda.
  const ESPECIES = {
    H2SO4: { t: 'H₂SO₄', z: 0, x: 'S', fijos: [['H', 1, 2], ['O', -2, 4]], bien: 6 },
    NH4: { t: 'NH₄⁺', z: 1, x: 'N', fijos: [['H', 1, 4]], bien: -3 },
    MnO4: { t: 'MnO₄⁻', z: -1, x: 'Mn', fijos: [['O', -2, 4]], bien: 7 },
    CO3: { t: 'CO₃²⁻', z: -2, x: 'C', fijos: [['O', -2, 3]], bien: 4 },
  };
  // Un grupo de átomos iguales va en una sola ficha («O₄ · −2»): su carga es la suma (los cuadritos la cuentan).
  const grupo = ([s, c, n]) => ({ t: `${s}${sub(n)} ${n > 1 ? `${n}·(${sg(c)})` : sg(c)}`, carga: c * n, n: 1 });
  function oxDib(k, wx) {
    const e = ESPECIES[k];
    return fichas([{ t: `${e.x} ${sg(wx)}`, carga: wx, n: 1, color: 'd' }, ...e.fijos.map(grupo)], { neta: 'suma de estados' });
  }
  // Gesto sobre quim-fichas: el átomo que falta va primero, así que sus |ω|·n cargas son los primeros cuadritos de su
  // fila (arriba si ω > 0, abajo si ω < 0). La manija va en el último; con ω = 0, entre las dos filas (x = 30).
  // Inversa: k = (x − 47)/17 + 1 cuadritos, ω = ±k/n según la fila (frontera en y = 127).
  const PF = () => Kit.piezas['quim-fichas'];
  const arrastreVerde = (dib, nAt, id) => ({ id: 'estado', etiqueta: 'final de las cargas del átomo verde', color: 'c-d',
    donde: val => { const k = Math.round(val[id] * nAt(val)), g = PF().geometria(dib(val).datos); return k === 0 ? { x: 30, y: 127 } : g.cuadrito(Math.abs(k) - 1, k > 0 ? '+' : '−'); },
    mover: (pt, val) => { const k = (pt.x - 47) / 17 + 1; return { [id]: (pt.y < 127 ? k : -k) / nAt(val) }; } });
  // Casos de «Ahora tú» y de «Así se resuelve»: [fórmula, átomo que falta, cuántos hay, carga, conocidos [el, ω, n]].
  const CASOS_OX = [['H₂SO₄', 'S', 1, 0, [['H', 1, 2], ['O', -2, 4]]], ['HNO₃', 'N', 1, 0, [['H', 1, 1], ['O', -2, 3]]], ['KMnO₄', 'Mn', 1, 0, [['K', 1, 1], ['O', -2, 4]]],
    ['NH₄⁺', 'N', 1, 1, [['H', 1, 4]]], ['SO₃²⁻', 'S', 1, -2, [['O', -2, 3]]], ['ClO₄⁻', 'Cl', 1, -1, [['O', -2, 4]]], ['HClO', 'Cl', 1, 0, [['H', 1, 1], ['O', -2, 1]]],
    ['K₂Cr₂O₇', 'Cr', 2, 0, [['K', 1, 2], ['O', -2, 7]]], ['PO₄³⁻', 'P', 1, -3, [['O', -2, 4]]], ['NaH', 'H', 1, 0, [['Na', 1, 1]]], ['Fe₂O₃', 'Fe', 2, 0, [['O', -2, 3]]]];
  const oxidacion = {
    id: 'estados-oxidacion',
    titulo: 'La suma da la carga',
    temas: ['Estados de oxidación'],
    pieza: 'quim-fichas',
    lee: {
      tarjetas: [
        { titulo: 'Una cuenta, no una carga', texto: ['Cada átomo de un compuesto lleva un número con signo: su estado de oxidación, ', w, '. No es una carga que se pueda medir. Es una cuenta que se hace como si todos los enlaces fueran iónicos.'] },
        { titulo: 'Neutro o con carga', texto: ['El agua es neutra: su carga ', z, ' es 0. El amonio, NH₄⁺, tiene carga +1 y el carbonato, CO₃²⁻, carga −2. La carga de un ion se escribe arriba, a la derecha.'] },
        { titulo: 'En la lejía', texto: 'La lejía de casa tiene hipoclorito de sodio, NaClO, y la sal de mesa es cloruro de sodio, NaCl. Con esta idea vas a poder hallar el estado de oxidación del cloro en cada una.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el átomo verde es el que falta. Sus cuadritos se alinean con los de los demás átomos: cada + busca un −. Mira cuántos quedan sin pareja.' },
      ],
    },
    juega: {
      consigna: 'El estado de oxidación del átomo verde sube y baja solo. Pausa, o ajústalo tú, cuando la suma de estados sea igual a la carga.',
      voz: 'Ajusta el verde y mira cuánto queda sin pareja.',
      controles: [
        { id: 'k', etiqueta: 'Especie', opciones: Object.keys(ESPECIES).map(k => ({ valor: k, texto: ESPECIES[k].t })) },
        { id: 'w', etiqueta: 'ω', color: 'c-d', min: -4, max: 8, paso: 1, inicio: 0, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
      ],
      dibujo: val => oxDib(val.k, Math.round(val.w)),
      lectura: val => {
        val = ent(val, 'w');
        const e = ESPECIES[val.k], suma = val.w + e.fijos.reduce((a, [, c, n]) => a + c * n, 0);
        return [`suma ${sg(suma)}`, '   ·   ', `carga de ${e.t}: `, z, ` = ${sg(e.z)}${suma === e.z ? ' ✓' : ''}`];
      },
      minimo: 4,
      // Se agarra el final de los cuadritos verdes (las cargas del átomo que falta) y se estira o se encoge; si se
      // lleva a la fila de abajo, el estado pasa a negativo. La carga sin pareja responde.
      arrastres: [arrastreVerde(val => oxDib(val.k, val.w), () => 1, 'w')],
    },
    predice: {
      pregunta: ['En el agua oxigenada, H₂O₂, cada H vale +1 y la molécula es neutra. ¿Qué estado de oxidación ', w, ' tiene cada O?'],
      voz: 'Haz la cuenta antes de aplicar la costumbre.',
      opciones: [
        { id: 'c', texto: '−1', correcta: true },
        { id: 'menos2', texto: '−2', error: 'QM-OX-O', siFuera: 'El O vale −2 en casi todos los compuestos. Aquí la suma no daría cero: +2 − 4.' },
        { id: 'cero', texto: '0', error: 'NO4', siFuera: 'Sería 0 en el O₂ puro. Aquí cada O está unido a un H.' },
        { id: 'mas1', texto: '+1', error: 'QM-OX-SIGNO', siFuera: 'Ese es el valor del H. Los dos O deben compensar +2.' },
      ],
      dibujo: fichas([{ t: 'H +1', carga: 1, n: 2 }, { t: 'O ?', carga: 0, n: 2, color: 'd' }], { neta: 'suma de estados' }),
      revelar: fichas([{ t: 'H +1', carga: 1, n: 2 }, { t: 'O −1', carga: -1, n: 2, color: 'd' }], { neta: 'suma de estados' }),
      coincide: 'Coincide: +2 de los H, −2 entre los dos O.',
      noCoincide: 'Los dos H suman +2; los dos O deben sumar −2: −1 cada uno.',
    },
    mira: {
      datos: { fichas: [{ t: 'O₇ 7·(−2)', carga: -14, n: 1, desde: 1 }, { t: 'Cr ?', carga: 0, n: 2, color: 'd', desde: 2, hasta: 2 }, { t: 'Cr +6', carga: 6, n: 2, color: 'd', desde: 3 }], neta: 'suma de estados' },
      voz: 'Llevemos la cuenta paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dicromato, Cr₂O₇²⁻: siete oxígenos a −2 suman −14.', ecuacion: ['7 · (−2) = −14'] },
        { estado: { corte: 2 }, texto: 'La especie tiene carga −2: los dos Cr deben aportar +12.', ecuacion: ['2', w, ' − 14 = ', z, ' = −2'] },
        { estado: { corte: 3 }, texto: 'Cada cromo: +12 entre 2.', ecuacion: [w, ' = +6'] },
      ],
    },
    regla: {
      texto: 'Asigna los valores conocidos: O −2, H +1 con no metales, grupo 1 +1, grupo 2 +2. El valor que falta sale de que la suma iguale la carga.',
      ecuacion: ['Σ n · ', { llave: [w], nota: 'cada estado', color: 'c-d' }, ' = ', { llave: [z], nota: 'carga', color: 'c-h' }],
      condicion: 'es una cuenta formal, no la carga real. En peróxidos el O vale −1; en hidruros metálicos, el H vale −1.',
      voz: 'Primero los conocidos; el que falta cierra la cuenta.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const r = azar(s + 900), [fo, x, nx, q, fijos] = r.de(CASOS_OX);
        const suma = fijos.reduce((a, [, c, n]) => a + c * n, 0), wx = (q - suma) / nx;
        const conocidos = fijos.map(([el, c, n]) => `${n} ${el} a ${sg(c)}`).join(' y ');
        const comprueba = [`${nx} · (${sg(wx)})`, ...fijos.map(([, c, n]) => `${n} · (${sg(c)})`)].join(' + ');
        return {
          enunciado: ['¿Qué estado de oxidación ', w, ` tiene el ${x} en ${fo}?`],
          dibujo: fichas([{ t: `${x} ?`, carga: 0, n: nx, color: 'd' }, ...fijos.map(grupo)], { neta: 'suma conocida' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el estado de oxidación ', w, ` ${nx > 1 ? `de cada uno de los ${nx} átomos` : 'del átomo'} de ${x} en ${fo}.`] },
            { tipo: 'datos', texto: [`Conocidos: ${conocidos}. La carga de la especie es `, z, ` = ${sg(q)}.`] },
            { tipo: 'regla', texto: 'Pongo los valores que ya sé. El que falta tiene que hacer que todos juntos sumen la carga de la especie.',
              ecuacion: ['Σ n · ', w, ' = ', z] },
            { tipo: 'cuentas', texto: [`Los conocidos suman ${sg(suma)}. Lo que falta para llegar a ${sg(q)} lo aporta${nx > 1 ? `n los ${nx} átomos` : ' el átomo'} de ${x}.`],
              ecuacion: [nx > 1 ? `${nx}` : '', w, ` + (${sg(suma)}) = ${sg(q)}   →   `, w, ` = ${sg(wx)}`],
              dibujo: fichas([{ t: `${x} ${sg(wx)}`, carga: wx, n: nx, color: 'd' }, ...fijos.map(grupo)], { neta: 'suma de estados' }) },
            { tipo: 'sentido', texto: [`Compruebo con todos los átomos: la suma da ${sg(nx * wx + suma)}, que es la carga de ${fo}. Cuadra.`], ecuacion: [`${comprueba} = ${sg(nx * wx + suma)}`] },
          ],
          respuesta: [w, ` = ${sg(wx)} para el ${x}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Suma los conocidos y compara con la carga.',
      generar(s) {
        const C = CASOS_OX;
        const [fo, x, nx, q, fijos] = C[s % C.length];
        const suma = fijos.reduce((a, [, c, n]) => a + c * n, 0), wx = (q - suma) / nx;
        return {
          pregunta: ['¿Qué estado de oxidación ', w, ` tiene ${x} en ${fo}?`],
          dibujo: fichas([{ t: `${x} ?`, carga: 0, n: nx, color: 'd' }, ...fijos.map(grupo)], { neta: 'suma conocida' }),
          opciones: elegir(sg(wx), [
            { id: 'signo', texto: sg(-wx), error: 'QM-OX-SIGNO', siFuera: 'Ese es el valor con el signo cambiado: compensa al revés.' },
            { id: 'sin-z', texto: sg(-suma / nx), error: 'QM-OX-CARGA', siFuera: 'Ese valor dejaría la especie neutra. Falta usar su carga.' },
            { id: 'total', texto: sg(q - suma), error: 'QM-OX-TOTAL', siFuera: `Eso es lo que aportan los ${f(nx, 0)} átomos juntos. Se divide entre ellos.` },
            { id: 'mas', texto: sg(wx + 2), error: 'NO4', siFuera: 'Con ese valor la suma no cierra con la carga.' },
          ]),
          solucion: { texto: `Los conocidos suman ${sg(suma)}; la carga es ${sg(q)}.`, ecuacion: [`${nx > 1 ? `${nx}` : ''}`, w, ` ${sg(suma)} = ${sg(q)} → `, w, ` = ${sg(wx)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: un compuesto, tres nombres ----------
  // Cambia: el compuesto · Permanece: la fórmula arriba y los tres sistemas debajo · Progresa: de contar átomos
  // (prefijos) a leer el estado de oxidación (romano) y a elegir sufijo (-oso, -ico) · Se reserva: el romano, que
  // no cuenta átomos · Debe verse: que los tres nombres apuntan a la misma fórmula.
  const OXIDOS = {
    FeO: { t: 'FeO', sis: 'monóxido de hierro', stock: 'óxido de hierro(II)', trad: 'óxido ferroso', w: 2, m: 'Fe', est: '+2 y +3' },
    Fe2O3: { t: 'Fe₂O₃', sis: 'trióxido de dihierro', stock: 'óxido de hierro(III)', trad: 'óxido férrico', w: 3, m: 'Fe', est: '+2 y +3' },
    Cu2O: { t: 'Cu₂O', sis: 'monóxido de dicobre', stock: 'óxido de cobre(I)', trad: 'óxido cuproso', w: 1, m: 'Cu', est: '+1 y +2' },
    CuO: { t: 'CuO', sis: 'monóxido de cobre', stock: 'óxido de cobre(II)', trad: 'óxido cúprico', w: 2, m: 'Cu', est: '+1 y +2' },
  };
  const nombres = (k, desde = [0, 0, 0, 0]) => {
    const o = OXIDOS[k];
    return { datos: { columnas: [{ titulo: o.t, color: 'd', nodos: [
      { texto: `Sistemática: ${o.sis}`, desde: desde[1] }, { texto: `Stock: ${o.stock}`, color: 'd', desde: desde[2] }, { texto: `Tradicional: ${o.trad}`, desde: desde[3] }], flechas: [] }] }, estado: {} };
  };
  // Animación: los tres nombres se leen solos, uno cada 2 s; los otros quedan tenues.
  const SISTEMAS = ['Sistemática', 'Stock', 'Tradicional'], cualNombre = t => Math.min(2, Math.floor(t / 2));
  const nombresT = (k, t) => { const d = nombres(k); d.datos.columnas[0].nodos.forEach((n, i) => { if (i !== cualNombre(t)) n.tenue = true; }); return d; };
  const NOMBRE_DE = (k, i) => [OXIDOS[k].sis, OXIDOS[k].stock, OXIDOS[k].trad][i];
  // Casos de «Ahora tú» y de «Así se resuelve»: [fórmula, elemento, átomos del elemento, átomos de O].
  const CASOS_OXIDO = [['FeO', 'hierro', 1, 1], ['Fe₂O₃', 'hierro', 2, 3], ['CuO', 'cobre', 1, 1], ['Cu₂O', 'cobre', 2, 1], ['PbO₂', 'plomo', 1, 2], ['SnO', 'estaño', 1, 1],
    ['SO₂', 'azufre', 1, 2], ['SO₃', 'azufre', 1, 3], ['N₂O₅', 'nitrógeno', 2, 5], ['Cl₂O₇', 'cloro', 2, 7]];
  const tipos = {
    id: 'tres-nombres',
    titulo: 'Un compuesto, tres nombres',
    temas: ['Tipos de nomenclatura'],
    pieza: 'quim-cadena',
    lee: {
      tarjetas: [
        { titulo: 'Nombres de la casa', texto: 'Muchos compuestos tienen un nombre común. La cal viva que se usa en construcción es óxido de calcio, CaO, y el óxido rojizo de un clavo viejo es, sobre todo, óxido de hierro.' },
        { titulo: 'Tres sistemas', texto: 'Hay tres maneras de nombrar un compuesto: la nomenclatura sistemática, la Stock y la nomenclatura tradicional. Cada una se fija en un dato distinto de la fórmula. En el examen te pueden pedir cualquiera.' },
        { titulo: 'Prefijos y sufijos', texto: 'Los prefijos mono, di, tri, tetra y penta quieren decir 1, 2, 3, 4 y 5. Los sufijos -oso e -ico vienen del latín: ferroso y férrico, de ferrum, el hierro.' },
        { titulo: 'Qué mirar', texto: 'En el juego, los tres nombres de un óxido se encienden por turnos. Pasa de FeO a Fe₂O₃ y mira qué palabra o qué número cambia en cada nombre.' },
      ],
    },
    juega: {
      consigna: 'Elige un óxido: sus tres nombres se leen solos, uno por uno. Busca qué dato usa cada sistema: cuántos átomos o qué estado de oxidación.',
      voz: 'Tres nombres, una sola fórmula. Compáralos uno por uno.',
      controles: [{ id: 'k', etiqueta: 'Óxido', opciones: Object.keys(OXIDOS).map(k => ({ valor: k, texto: OXIDOS[k].t })) }, Object.assign(T_AUTO(6), { inicio: 0 })],
      dibujo: val => nombresT(val.k, val.t),
      lectura: val => { const o = OXIDOS[val.k], i = cualNombre(val.t); return [`${SISTEMAS[i]}: ${NOMBRE_DE(val.k, i)} · ${o.m} con `, w, ` = +${o.w}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '«Óxido de plomo(IV)» y «dióxido de plomo», ¿nombran la misma sustancia?',
      voz: 'Lee qué cuenta el número romano.',
      opciones: [
        { id: 'c', texto: 'Sí: los dos son PbO₂', correcta: true },
        { id: 'cuatro', texto: 'No: el primero tiene cuatro plomos', error: 'QM-ROMANO', siFuera: 'El IV no cuenta plomos: es el estado de oxidación +4.' },
        { id: 'distintos', texto: 'No: un sistema moderno y uno antiguo nombran compuestos distintos', error: 'NO3', siFuera: 'Son sistemas distintos, sí, pero los dos describen la misma fórmula.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: '¿?', color: 'd', nodos: [{ texto: 'Stock: óxido de plomo(IV)', color: 'd' }, { texto: 'Sistemática: dióxido de plomo' }], flechas: [] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'PbO₂', color: 'd', nodos: [{ texto: 'Stock: óxido de plomo(IV)', color: 'd' }, { texto: 'Sistemática: dióxido de plomo' }], flechas: [] }] }, estado: {} },
      coincide: 'Coincide: Pb +4 con dos O −2 es PbO₂.',
      noCoincide: 'El IV es el estado +4; con dos O −2 la fórmula es PbO₂.',
    },
    mira: {
      datos: nombres('Fe2O3', [0, 1, 2, 3]).datos,
      voz: 'Saquemos cada nombre de la fórmula.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Sistemática: cuenta átomos con prefijos. 2 Fe y 3 O.', ecuacion: ['Fe₂O₃ → tri-óxido de di-hierro'] },
        { estado: { corte: 2 }, texto: 'Stock: el estado del hierro, en romanos.', ecuacion: ['2', w, ' + 3 · (−2) = 0 → ', w, ' = +3 → (III)'] },
        { estado: { corte: 3 }, texto: 'Tradicional: el hierro tiene +2 y +3; el mayor lleva -ico.', ecuacion: ['+3 → férrico', '   ·   ', '+2 → ferroso'] },
      ],
    },
    regla: {
      texto: 'Sistemática: prefijos que cuentan átomos. Stock: el estado de oxidación en romanos. Tradicional: -oso para el estado menor e -ico para el mayor.',
      ecuacion: ['Fe₂O₃: trióxido de dihierro = óxido de hierro', { llave: ['(III)'], nota: 'estado +3' }, ' = óxido férrico'],
      condicion: 'el romano es el estado de oxidación, no un conteo de átomos; se omite si hay un solo estado (óxido de sodio).',
      voz: 'Antes de nombrar, decide qué sistema te piden.',
    },
    resuelve: {
      pieza: 'quim-cadena',
      generar(s) {
        const r = azar(s + 900), [fo, el, nx, no] = r.de(CASOS_OXIDO), wx = 2 * no / nx, stock = `óxido de ${el}(${ROM[wx]})`;
        const cadena = nodos => ({ datos: { columnas: [{ titulo: fo, color: 'd', nodos, flechas: [] }] }, estado: {} });
        return {
          enunciado: `¿Cuál es el nombre Stock de ${fo}?`,
          dibujo: cadena([{ texto: `${nx} de ${el} y ${no} O` }, { texto: 'Stock: ¿?', color: 'd' }]),
          pasos: [
            { tipo: 'pide', texto: `Piden el nombre Stock de ${fo}: «óxido de ${el}» y, entre paréntesis, un número romano.` },
            { tipo: 'datos', texto: [`La fórmula tiene ${nx} ${nx > 1 ? 'átomos' : 'átomo'} de ${el} y ${no} de oxígeno. Cada O vale −2 y el óxido es neutro: `, z, ' = 0.'] },
            { tipo: 'regla', texto: ['En Stock, el romano no cuenta átomos: es el estado de oxidación ', w, ' del elemento. Lo saco de que la suma de estados dé cero.'],
              ecuacion: [nx > 1 ? `${nx}` : '', w, ` + ${no} · (−2) = 0`] },
            { tipo: 'cuentas', texto: [`Los ${no} O suman ${sg(-2 * no)}. ${nx > 1 ? `Los ${nx} átomos` : 'El átomo'} de ${el} ${nx > 1 ? 'deben' : 'debe'} aportar ${sg(2 * no)}${nx > 1 ? ', repartido entre ellos' : ''}.`],
              ecuacion: [...(nx > 1 ? [`${nx}`, w, ` = +${2 * no}   →   `] : []), w, ` = ${sg(wx)}   →   (${ROM[wx]})`],
              dibujo: cadena([{ texto: `${nx} de ${el} y ${no} O` }, { texto: `${el}: ${sg(wx)}; O: −2` }, { texto: `Stock: ${stock}`, color: 'd' }]) },
            { tipo: 'sentido', texto: `Compruebo: ${nx} · (${sg(wx)}) + ${no} · (−2) = ${sg(nx * wx - 2 * no)}. El óxido queda neutro, así que el romano está bien.` },
          ],
          respuesta: stock,
        };
      },
    },
    ahoraTu: {
      voz: 'Halla el estado y después el romano.',
      generar(s) {
        const C = CASOS_OXIDO;
        const [fo, el, nx, no] = C[s % C.length], wx = 2 * no / nx;
        return {
          pregunta: `¿Cuál es el nombre Stock de ${fo}?`,
          opciones: elegir(`óxido de ${el}(${ROM[wx]})`, [
            { id: 'cuenta', texto: `óxido de ${el}(${ROM[nx === 1 ? no : nx]})`, error: 'QM-ROMANO', siFuera: 'Ese romano cuenta átomos. Stock escribe el estado de oxidación.' },
            { id: 'o', texto: `óxido de ${el}(${ROM[no]})`, error: 'QM-ROMANO', siFuera: 'Ese número es la cantidad de oxígenos, no el estado del elemento.' },
            { id: 'mitad', texto: `óxido de ${el}(${ROM[Math.max(1, wx - 1)]})`, error: 'NO4', siFuera: `Con ese estado la suma no da cero con ${f(no, 0)} oxígenos.` },
            { id: 'doble', texto: `óxido de ${el}(${ROM[Math.min(7, wx + 2)]})`, error: 'NO4', siFuera: 'Con ese estado la suma de cargas no cierra en cero.' },
          ]),
          solucion: { texto: `${f(no, 0)} O suman ${sg(-2 * no)}; ${f(nx, 0)} de ${el} aportan ${sg(2 * no)}.`, ecuacion: [w, ` = ${sg(wx)} → (${ROM[wx]})`] },
        };
      },
    },
  };

  // ---------- Idea 3: el árbol de las funciones ----------
  // Cambia: el elemento · Permanece: dos caminos lado a lado (con oxígeno y agua; con hidrógeno) · Progresa:
  // elemento → óxido → hidróxido u oxácido · Se reserva: el peróxido, que no se simplifica · Debe verse: que cada
  // paso suma átomos enteros (O, H₂O) y que el estado de oxidación no cambia.
  const ELEM = {
    Na: { nom: 'Na', w: 1, metal: true }, Ca: { nom: 'Ca', w: 2, metal: true }, Fe: { nom: 'Fe(III)', s: 'Fe', w: 3, metal: true },
    C: { nom: 'C(IV)', s: 'C', w: 4 }, S: { nom: 'S(VI)', s: 'S', w: 6 }, N: { nom: 'N(V)', s: 'N', w: 5 },
  };
  // Óxido: E₂O_ω simplificado. Hidróxido: E(OH)_ω. Oxácido: óxido + H₂O, simplificado.
  function oxido(s, wx) { const g = mcd(2, wx); return formula([[s, 2 / g], ['O', wx / g]]); }
  function oxacido(s, wx) {
    const g = mcd(2, wx), ne = 2 / g, no = wx / g;                 // óxido E_ne O_no
    let h = 2, e = ne, o = no + 1;                                  // + H₂O
    const d = mcd(mcd(h, e), o); h /= d; e /= d; o /= d;
    return { f: formula([['H', h], [s, e], ['O', o]]), sin: formula([['H', 2], [s, ne], ['O', no + 1]]), simplificable: d > 1, h, e, o, d };
  }
  const hidroxido = (s, wx) => formula([[s, 1], ['OH', wx, true]]);
  const HIDR = { Na: 'NaH (hidruro, H −1)', Ca: 'CaH₂ (hidruro, H −1)', Fe: 'sin hidruro común', C: 'CH₄ (hidruro)', S: 'H₂S: en agua, ácido sulfhídrico', N: 'NH₃ (hidruro)' };
  function arbol(k, desde = [0, 0, 0, 0]) {
    const e = ELEM[k], s = e.s || k;
    const izq = [{ texto: `${e.nom} + O₂`, desde: desde[0] }, { texto: `óxido ${e.metal ? 'básico' : 'ácido'}: ${oxido(s, e.w)}`, color: e.metal ? 'o' : 'i', desde: desde[1] },
      { texto: e.metal ? `hidróxido: ${hidroxido(s, e.w)}` : `oxácido: ${oxacido(s, e.w).f}`, color: e.metal ? 'o' : 'i', desde: desde[2] }];
    const der = [{ texto: `${s} + H₂`, desde: desde[3] }, { texto: HIDR[k], desde: desde[3] }];
    return { datos: { columnas: [{ titulo: 'Con oxígeno', nodos: izq, flechas: [{ de: 0, a: 1, desde: desde[1] }, { de: 1, a: 2, texto: '+ H₂O', desde: desde[2] }] }, { titulo: 'Con hidrógeno', nodos: der }] }, estado: {} };
  }
  // Animación: el árbol se arma solo, un paso cada 1,2 s: el elemento con O₂, su óxido, el óxido con agua y, al final,
  // el camino con hidrógeno. Se queda completo unos segundos y vuelve a empezar.
  const pasoArbol = t => Math.min(4, 1 + Math.floor(t / 1.2));
  const arbolT = (k, t) => { const d = arbol(k, [1, 2, 3, 4]); d.estado = { corte: pasoArbol(t) + 0.5 }; return d; };
  function leeArbol(k, t) {
    const e = ELEM[k], s = e.s || k, p = pasoArbol(t);
    if (p === 1) return `${e.nom} + O₂`;
    if (p === 2) return `da el óxido ${e.metal ? 'básico' : 'ácido'} ${oxido(s, e.w)}`;
    if (p === 3) return e.metal ? `con agua, el hidróxido ${hidroxido(s, e.w)}` : `con agua, el oxácido ${oxacido(s, e.w).f}`;
    return `con hidrógeno: ${HIDR[k]}`;
  }
  // Casos de «Ahora tú» y de «Así se resuelve»: [elemento, ω, nombre del ácido o «hidróxido»].
  const CASOS_FUN = [['S', 4, 'sulfuroso'], ['S', 6, 'sulfúrico'], ['N', 5, 'nítrico'], ['N', 3, 'nitroso'], ['C', 4, 'carbónico'], ['Cl', 7, 'perclórico'], ['Cl', 5, 'clórico'], ['Cl', 1, 'hipocloroso'],
    ['Fe', 3, 'hidróxido'], ['Al', 3, 'hidróxido'], ['Mg', 2, 'hidróxido'], ['K', 1, 'hidróxido']];
  const funciones = {
    id: 'arbol-funciones',
    titulo: 'El árbol de las funciones',
    temas: ['Óxidos e hidruros', 'Hidróxidos', 'Ácidos oxácidos e hidrácidos', 'Peróxidos'],
    pieza: 'quim-cadena',
    lee: {
      tarjetas: [
        { titulo: 'Familias de compuestos', texto: 'Los compuestos inorgánicos se agrupan en familias llamadas funciones: óxidos, hidróxidos, ácidos, sales e hidruros. Cada familia tiene una forma de fórmula que se reconoce a simple vista.' },
        { titulo: 'En la casa y el carro', texto: 'La soda cáustica que destapa desagües es hidróxido de sodio, NaOH. La batería de un carro lleva ácido sulfúrico, H₂SO₄. Los dos son compuestos inorgánicos de familias distintas.' },
        { titulo: 'Metal o no metal', texto: 'Para ubicar un compuesto en su familia, primero se mira si el elemento es metal o no metal: la tabla periódica lo dice. En el juego, compara el camino de un metal con el de un no metal.' },
      ],
    },
    juega: {
      consigna: 'Elige un elemento con su estado de oxidación. El árbol se arma solo: con oxígeno y después agua; y con hidrógeno.',
      voz: 'Compara un metal con un no metal en el mismo camino.',
      controles: [{ id: 'k', etiqueta: 'Elemento', opciones: Object.keys(ELEM).map(k => ({ valor: k, texto: ELEM[k].nom })) }, T_AUTO(7.5)],
      dibujo: val => arbolT(val.k, val.t),
      lectura: val => [leeArbol(val.k, val.t), '   ·   ', w, ` = +${ELEM[val.k].w}`],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-fichas',
      pregunta: 'Na₂O y Na₂O₂ tienen los mismos elementos. ¿En qué se diferencian?',
      voz: 'Mira cuánto vale cada oxígeno.',
      opciones: [
        { id: 'c', texto: 'Na₂O₂ es un peróxido: dos O unidos, cada uno a −1', correcta: true },
        { id: 'na2', texto: 'En Na₂O₂ el sodio vale +2', error: 'QM-PEROX', siFuera: 'El sodio vale +1 en todos sus compuestos. Lo que cambia es el oxígeno.' },
        { id: 'simpl', texto: 'Son el mismo óxido; Na₂O₂ se simplifica a NaO', error: 'QM-PEROX', siFuera: 'Simplificar vale para iones sueltos. El grupo O₂²⁻ es un ion y no se parte.' },
      ],
      dibujo: fichas([{ t: 'Na +1', carga: 1, n: 2, color: 'o' }, { t: 'O −2', carga: -2, n: 1, color: 'i' }], { neta: 'Na₂O: suma' }),
      revelar: fichas([{ t: 'Na +1', carga: 1, n: 2, color: 'o' }, { t: 'O −1', carga: -1, n: 2, color: 'i' }], { neta: 'Na₂O₂: suma' }),
      coincide: 'Coincide: en el peróxido cada O vale −1 y van en pareja (O₂²⁻).',
      noCoincide: 'El peróxido tiene el ion O₂²⁻: dos O unidos, cada uno a −1.',
    },
    mira: {
      datos: (() => { const a = arbol('S', [1, 2, 3, 9]).datos, b = arbol('Ca', [4, 4, 5, 9]).datos; return { columnas: [Object.assign(a.columnas[0], { titulo: 'Azufre (+6)' }), Object.assign(b.columnas[0], { titulo: 'Calcio (+2)' })] }; })(),
      voz: 'Sumemos átomos enteros en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Azufre con estado +6 y oxígeno.', ecuacion: ['2 S + 3 O₂'] },
        { estado: { corte: 2 }, texto: 'El óxido: S₂O₆ se simplifica a SO₃ (óxido ácido).', ecuacion: ['S: +6', '   ·   ', 'O: 3 · (−2) = −6'] },
        { estado: { corte: 3 }, texto: 'Con agua se suman sus átomos: ácido sulfúrico.', ecuacion: ['SO₃ + H₂O → H₂SO₄'] },
        { estado: { corte: 4 }, texto: 'Un metal da óxido básico: CaO.', ecuacion: ['2 Ca + O₂ → 2 CaO'] },
        { estado: { corte: 5 }, texto: 'Con agua, un hidróxido: el ion OH⁻ va entero.', ecuacion: ['CaO + H₂O → Ca(OH)₂'] },
      ],
    },
    regla: {
      texto: 'Metal con oxígeno: óxido básico; con agua, hidróxido. No metal con oxígeno: óxido ácido; con agua, oxácido. Con hidrógeno: hidruros, e hidrácidos en agua.',
      ecuacion: ['SO₃ + H₂O → H₂SO₄', '   ·   ', 'CaO + H₂O → Ca(OH)₂'],
      condicion: 'el peróxido (O₂²⁻, O a −1) no se simplifica: Na₂O₂ no es NaO. HCl y H₂S son ácidos disueltos en agua.',
      voz: 'Cada paso suma átomos enteros; el estado no cambia.',
    },
    resuelve: {
      pieza: 'quim-cadena',
      generar(s) {
        const r = azar(s + 900), [x, wx, tipo] = r.de(CASOS_FUN), metal = tipo === 'hidróxido', ox = oxido(x, wx);
        const camino = final => ({ datos: { columnas: [{ titulo: `${x} con ω = +${wx}`, color: metal ? 'o' : 'i', nodos: [
          { texto: `${x} + O₂` }, { texto: `óxido ${metal ? 'básico' : 'ácido'}: ${final ? ox : '¿?'}`, color: metal ? 'o' : 'i' },
          { texto: `${metal ? 'hidróxido' : 'oxácido'}: ${final || '¿?'}`, color: metal ? 'o' : 'i' }],
          flechas: [{ de: 0, a: 1 }, { de: 1, a: 2, texto: '+ H₂O' }] }] }, estado: {} });
        if (metal) {
          const bien = hidroxido(x, wx);
          return {
            enunciado: ['¿Cuál es la fórmula del hidróxido de ', x, ' con ', w, ` = +${wx}?`],
            dibujo: camino(null),
            pasos: [
              { tipo: 'pide', texto: ['Piden la fórmula del hidróxido de ', x, ': el metal con iones OH⁻.'] },
              { tipo: 'datos', texto: [`El ${x} es un metal con `, w, ` = +${wx}. El ion hidróxido, OH⁻, tiene carga −1 y va entero.`] },
              { tipo: 'regla', texto: 'Un metal con oxígeno da un óxido básico; con agua, un hidróxido. Lleva tantos OH⁻ como hagan falta para que la carga quede en cero.',
                ecuacion: ['óxido básico + H₂O → hidróxido'] },
              { tipo: 'cuentas', texto: `Cada OH⁻ compensa una carga positiva. Para +${wx} hacen falta ${wx} OH⁻${wx > 1 ? ', entre paréntesis porque se repiten' : ''}.`,
                ecuacion: [`+${wx} + ${wx} · (−1) = 0   →   ${bien}`], dibujo: camino(bien) },
              { tipo: 'sentido', texto: `Compruebo: el ${x} aporta +${wx} y los OH⁻ suman −${wx}; queda neutro. El óxido del camino, ${ox}, tiene el mismo estado +${wx}.` },
            ],
            respuesta: bien,
          };
        }
        const o = oxacido(x, wx);
        return {
          enunciado: ['¿Cuál es la fórmula del ácido ', tipo, ' (oxácido de ', x, ' con ', w, ` = +${wx})?`],
          dibujo: camino(null),
          pasos: [
            { tipo: 'pide', texto: ['Piden la fórmula del ácido ', tipo, ': un oxácido, con hidrógeno, ', x, ' y oxígeno.'] },
            { tipo: 'datos', texto: [`El ${x} es un no metal con `, w, ` = +${wx}. El oxígeno vale −2.`] },
            { tipo: 'regla', texto: 'Un no metal con oxígeno da un óxido ácido. Si le sumo una molécula de agua, sale el oxácido. Al final simplifico, si se puede.',
              ecuacion: ['óxido ácido + H₂O → oxácido'] },
            { tipo: 'cuentas', texto: `Primero el óxido que suma cero: ${ox}. Le sumo los átomos de H₂O${o.simplificable ? ` y divido todos los subíndices entre ${o.d}` : ''}.`,
              ecuacion: [`${ox} + H₂O → ${o.sin}${o.simplificable ? `   →   ${o.f}` : ''}`], dibujo: camino(o.f) },
            { tipo: 'sentido', texto: `Compruebo los estados en ${o.f}: los H suman +${o.h}, el ${x} aporta +${o.e * wx} y los O, −${2 * o.o}. Total: ${sg(o.h + o.e * wx - 2 * o.o)}.` },
          ],
          respuesta: o.f,
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe primero el óxido y suma el agua.',
      generar(s) {
        const C = CASOS_FUN;
        const [x, wx, tipo] = C[s % C.length];
        if (tipo === 'hidróxido') {
          const bien = hidroxido(x, wx);
          return {
            pregunta: ['¿Cuál es la fórmula del hidróxido de ', x, ' con ', w, ` = +${wx}?`],
            opciones: elegir(bien, [
              { id: 'paren', texto: `${x}OH${sub(wx)}`, error: 'NO1', siFuera: 'Sin paréntesis el subíndice afecta solo al H. Se repite el ion OH⁻ entero.' },
              { id: 'oxido', texto: oxido(x, wx), error: 'QM-FUNCION', siFuera: 'Ese es el óxido. El hidróxido lleva iones OH⁻.' },
              { id: 'uno', texto: `${x}OH`, error: 'NO2', siFuera: `Un solo OH⁻ no compensa +${wx}: la suma no da cero.` },
            ]),
            solucion: { texto: `Hacen falta ${f(wx, 0)} iones OH⁻ para compensar +${wx}.`, ecuacion: [`+${wx} + ${wx} · (−1) = 0 → ${bien}`] },
          };
        }
        const o = oxacido(x, wx);
        return {
          pregunta: ['¿Cuál es la fórmula del ácido ', tipo, ' (oxácido de ', x, ' con ', w, ` = +${wx})?`],
          opciones: elegir(o.f, [
            { id: 'sin', texto: o.sin, error: 'QM-SIMPLIFICA', siFuera: o.simplificable ? 'Esa es la suma sin simplificar. Se dividen los subíndices entre su divisor común.' : 'Esa suma usa dos átomos del elemento; revisa el óxido.' },
            { id: 'oxido', texto: oxido(x, wx), error: 'QM-FUNCION', siFuera: 'Ese es el óxido ácido. Falta sumarle el agua.' },
            { id: 'h2', texto: formula([['H', 2], [x, 1], ['O', Math.ceil((wx + 2) / 2)]]), error: 'QM-OXACIDO-H', siFuera: 'No todo oxácido lleva 2 H: con esa fórmula la suma de estados no da cero.' },
            { id: 'otro', texto: oxacido(x, wx > 2 ? wx - 2 : wx + 2).f, error: 'NO4', siFuera: `Ese ácido corresponde a otro estado de oxidación del ${x}.` },
          ]),
          solucion: { texto: `Óxido ${oxido(x, wx)} más H₂O; se simplifica si se puede.`, ecuacion: [`${oxido(x, wx)} + H₂O → ${o.f}`] },
        };
      },
    },
  };

  // ---------- Idea 4: sal = catión de la base + anión del ácido ----------
  // Cambia: el catión y el anión · Permanece: la cuenta de cargas bajo las fichas · Progresa: se agregan fichas
  // enteras hasta que todo + tiene su − · Se reserva: el ion poliatómico, que entra entero (paréntesis) · Debe verse:
  // carga neta 0.
  const CAT = { Na: ['Na⁺', 'Na', 1, 'sodio'], K: ['K⁺', 'K', 1, 'potasio'], Ca: ['Ca²⁺', 'Ca', 2, 'calcio'], Mg: ['Mg²⁺', 'Mg', 2, 'magnesio'], Al: ['Al³⁺', 'Al', 3, 'aluminio'], Fe: ['Fe³⁺', 'Fe', 3, 'hierro(III)'], NH4: ['NH₄⁺', 'NH₄', 1, 'amonio', true] };
  const AN = { Cl: ['Cl⁻', 'Cl', 1, 'cloruro'], Br: ['Br⁻', 'Br', 1, 'bromuro'], S: ['S²⁻', 'S', 2, 'sulfuro'], NO3: ['NO₃⁻', 'NO₃', 1, 'nitrato', true], SO4: ['SO₄²⁻', 'SO₄', 2, 'sulfato', true], CO3: ['CO₃²⁻', 'CO₃', 2, 'carbonato', true], PO4: ['PO₄³⁻', 'PO₄', 3, 'fosfato', true] };
  function sal(c, a, desde) {
    const C = CAT[c], A = AN[a], m = C[2] * A[2] / mcd(C[2], A[2]), nc = m / C[2], na = m / A[2];
    const fo = formula([[C[1], nc, C[4]], [A[1], na, A[4]]]);
    const dib = fichas([{ t: C[0], carga: C[2], n: nc, color: 'o', desde }, { t: A[0], carga: -A[2], n: na, color: 'i', desde }]);
    return { fo, nombre: `${A[3]} de ${C[3]}`, nc, na, dib };
  }
  // Animación: las fichas entran solas, enteras, de a una (el armado dura 4,5 s y se queda 1,5 s completo): un catión
  // si la carga neta es negativa o cero, un anión si es positiva, hasta que queda neutra. La secuencia la arma la
  // misma cuenta de cargas.
  function armado(c, a) {
    const qc = CAT[c][2], qa = AN[a][2], pasos = [[1, 0]];
    for (let g = 0; g < 20; g++) {
      const [nc, na] = pasos[pasos.length - 1], q = nc * qc - na * qa;
      if (q === 0 && na > 0) break;
      pasos.push(q > 0 ? [nc, na + 1] : [nc + 1, na]);
    }
    return pasos;
  }
  function salT(c, a, t) {
    const pasos = armado(c, a), i = Math.min(pasos.length - 1, Math.floor(t / (4.5 / pasos.length))), [nc, na] = pasos[i];
    const C = CAT[c], A = AN[a], fin = i === pasos.length - 1;
    return { nc, na, q: nc * C[2] - na * A[2], fin, dib: fichas([{ t: C[0], carga: C[2], n: nc, color: 'o' }, { t: A[0], carga: -A[2], n: na, color: 'i' }]) };
  }
  const sales = {
    id: 'sales',
    titulo: 'Fichas enteras hasta carga cero',
    temas: ['Sales oxisales y haloideas'],
    pieza: 'quim-fichas',
    lee: {
      tarjetas: [
        { titulo: 'No solo la de mesa', texto: 'La sal de Maras, en el Cusco, es cloruro de sodio. Pero en química, «sal» es toda una familia: el yeso, el mármol y el salitre también son sales.' },
        { titulo: 'Catión y anión', texto: 'Una sal es un compuesto iónico: tiene un catión, un ion positivo, y un anión, un ion negativo. El catión suele venir de una base y el anión, de un ácido.' },
        { titulo: 'Se nombra al revés', texto: 'La sal se nombra empezando por el anión: cloruro de sodio, sulfato de calcio. La fórmula se escribe al revés, con el catión primero: NaCl, CaSO₄.' },
        { titulo: 'Qué mirar', texto: 'En el juego, las fichas entran de una en una. Cuenta cuántas fichas de cada ion hacen falta para que la carga neta llegue a cero.' },
      ],
    },
    juega: {
      consigna: 'Elige un catión y un anión. Las fichas entran solas, enteras, hasta que cada carga + tenga su − enfrente. Lee la fórmula.',
      voz: 'Las fichas no se parten: se agregan enteras.',
      controles: [
        { id: 'c', etiqueta: 'Catión', opciones: ['Na', 'Ca', 'Al'].map(k => ({ valor: k, texto: CAT[k][0] })) },
        { id: 'a', etiqueta: 'Anión', opciones: ['Cl', 'SO4', 'PO4'].map(k => ({ valor: k, texto: AN[k][0] })) },
        T_AUTO(6),
      ],
      dibujo: val => salT(val.c, val.a, val.t).dib,
      lectura: val => { const x = sal(val.c, val.a), y = salT(val.c, val.a, val.t); return [y.fin ? `${x.fo}: ${x.nombre}` : `${y.nc} ${CAT[val.c][0]} y ${y.na} ${AN[val.a][0]}: carga neta ${sg(y.q)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Se combinan iones calcio, Ca²⁺, con iones nitrato, NO₃⁻. ¿Cuál es la fórmula de la sal?',
      voz: 'Piensa qué pasa con el ion nitrato entero.',
      opciones: [
        { id: 'c', texto: 'Ca(NO₃)₂', correcta: true },
        { id: 'rompe', texto: 'CaN₂O₆', error: 'QM-POLI', siFuera: 'Tiene los átomos correctos. Pero así el ion nitrato deja de verse: se escribe entero.' },
        { id: 'uno', texto: 'CaNO₃', error: 'NO2', siFuera: 'Sería cierto si el calcio fuera +1. Con +2 hacen falta dos nitratos.' },
        { id: 'cruce', texto: 'Ca₂NO₃', error: 'NO1', siFuera: 'Eso pone el 2 del calcio en el lado que no es: dos Ca²⁺ dejarían +3 sin pareja.' },
      ],
      dibujo: fichas([{ t: 'Ca²⁺', carga: 2, n: 1, color: 'o' }, { t: 'NO₃⁻', carga: -1, n: 1, color: 'i' }]),
      revelar: sal('Ca', 'NO3').dib,
      coincide: 'Coincide: un Ca²⁺ y dos NO₃⁻ enteros.',
      noCoincide: 'Un Ca²⁺ necesita dos NO₃⁻ enteros: Ca(NO₃)₂.',
    },
    mira: {
      datos: { fichas: [{ t: 'Al³⁺', carga: 3, n: 1, color: 'o', desde: 1 }, { t: 'SO₄²⁻', carga: -2, n: 1, color: 'i', desde: 1 }, { t: 'SO₄²⁻', carga: -2, n: 1, color: 'i', desde: 2 },
        { t: 'Al³⁺', carga: 3, n: 1, color: 'o', desde: 3 }, { t: 'SO₄²⁻', carga: -2, n: 1, color: 'i', desde: 3 }] },
      voz: 'Agreguemos fichas enteras hasta que cuadre.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Un Al³⁺ y un SO₄²⁻: sobra +1.', ecuacion: ['+3 − 2 = +1'] },
        { estado: { corte: 2 }, texto: 'Otro sulfato: ahora falta, queda −1.', ecuacion: ['+3 − 4 = −1'] },
        { estado: { corte: 3 }, texto: 'Dos Al³⁺ y tres SO₄²⁻: cada + tiene su −.', ecuacion: ['2 · (+3) + 3 · (−2) = 0'] },
        { estado: { corte: 3 }, texto: 'El sulfato va entero, entre paréntesis: sulfato de aluminio.', ecuacion: ['Al₂(SO₄)₃'] },
      ],
    },
    regla: {
      texto: 'Una sal junta el catión de una base con el anión de un ácido. Se usan las cantidades mínimas que dejan la suma de cargas en cero.',
      ecuacion: ['Σ n · ', z, ' = 0   →   Al₂', { llave: ['(SO₄)₃'], nota: 'ion entero' }],
      condicion: 'el ion poliatómico no se rompe: va entre paréntesis si se repite. Haloidea: anión sin oxígeno (cloruro); oxisal: con oxígeno.',
      voz: 'Primero los iones y sus cargas; después la proporción.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const r = azar(s + 900), c = r.de(['Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'NH4']);
        // Sin NaNO₃: el validador de nucleo/teoria.js lo toma por «NaN» (igual que en «Ahora tú»).
        const a = r.de(['Cl', 'Br', 'S', 'NO3', 'SO4', 'CO3', 'PO4'].filter(k => !(c === 'Na' && k === 'NO3')));
        const x = sal(c, a), C = CAT[c], A = AN[a], tope = x.nc * C[2];
        const poli = [C, A].filter(i => i[4]).map(i => i[0]);
        return {
          enunciado: `¿Cuál es la fórmula del ${x.nombre}?`,
          dibujo: fichas([{ t: C[0], carga: C[2], n: 1, color: 'o' }, { t: A[0], carga: -A[2], n: 1, color: 'i' }]),
          pasos: [
            { tipo: 'pide', texto: `Piden la fórmula del ${x.nombre}: cuántos iones de cada clase y cómo se escriben.` },
            { tipo: 'datos', texto: `El catión es ${C[0]}, con +${C[2]}, y el anión es ${A[0]}, con −${A[2]}.${poli.length ? ` ${poli.join(' y ')} ${poli.length > 1 ? 'son iones de varios átomos' : 'es un ion de varios átomos'}.` : ''}` },
            { tipo: 'regla', texto: 'Junto iones enteros, la menor cantidad posible, hasta que las cargas positivas y negativas se anulen. Un ion de varios átomos que se repite va entre paréntesis.',
              ecuacion: ['Σ n · ', z, ' = 0'] },
            { tipo: 'cuentas', texto: `Busco el menor número al que llegan las dos cargas: ${tope}. Hacen falta ${x.nc} ${C[0]} y ${x.na} ${A[0]}.`,
              ecuacion: [`${x.nc} · (+${C[2]}) + ${x.na} · (−${A[2]}) = ${sg(x.nc * C[2] - x.na * A[2])}   →   ${x.fo}`], dibujo: x.dib },
            { tipo: 'sentido', texto: `Las cargas se anulan: +${x.nc * C[2]} y −${x.na * A[2]}. Y ${x.nc} : ${x.na} ya no se puede simplificar más: es la proporción mínima.` },
          ],
          respuesta: x.fo,
        };
      },
    },
    ahoraTu: {
      voz: 'Iones enteros hasta carga cero.',
      generar(s) {
        const r = azar(s);
        const c = ['Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'NH4'][s % 7];
        // NaNO₃ queda fuera: el validador de nucleo/teoria.js lo toma por «NaN» (pedido al molde en el reporte).
        const a = r.de(['Cl', 'Br', 'S', 'NO3', 'SO4', 'CO3', 'PO4'].filter(x => !(c === 'Na' && x === 'NO3')));
        const x = sal(c, a), C = CAT[c], A = AN[a];
        const rompe = A[4] && x.na > 1 ? `${C[1]}${sub(x.nc)}${A[1].replace(/([A-Z][a-z]?)([₀-₉]*)/g, (m0, el, d) => { const n = d ? +d.split('').map(ch => SUBS.indexOf(ch)).join('') : 1; return el + sub(n * x.na); })}` : formula([[C[1], A[2], C[4]], [A[1], C[2], A[4]]]);
        return {
          pregunta: `¿Cuál es la fórmula del ${x.nombre}?`,
          dibujo: fichas([{ t: C[0], carga: C[2], n: 1, color: 'o' }, { t: A[0], carga: -A[2], n: 1, color: 'i' }]),
          opciones: elegir(x.fo, [
            { id: 'rompe', texto: rompe, error: A[4] && x.na > 1 ? 'QM-POLI' : 'NO1', siFuera: A[4] && x.na > 1 ? 'Los átomos cuadran, pero el ion se escribe entero, con paréntesis.' : 'Esa proporción no se simplificó o no deja carga cero.' },
            { id: 'uno', texto: formula([[C[1], 1, C[4]], [A[1], 1, A[4]]]), error: 'NO2', siFuera: 'Uno de cada ion solo sirve si sus cargas son iguales.' },
            { id: 'invertido', texto: formula([[C[1], Math.max(1, x.na), C[4]], [A[1], Math.max(1, x.nc), A[4]]]), error: 'NO1', siFuera: 'Esa proporción está invertida: la suma de cargas no da cero.' },
            { id: 'sin-paren', texto: `${C[1]}${sub(x.nc)}${A[1]}${sub(x.na)}`, error: 'QM-POLI', siFuera: 'Sin paréntesis el subíndice solo afecta al último átomo del ion.' },
            { id: 'doble', texto: formula([[C[1], 2 * x.nc, C[4]], [A[1], 2 * x.na, A[4]]]), error: 'QM-SIMPLIFICA', siFuera: 'Esa proporción es correcta pero no es la mínima: se simplifica.' },
            { id: 'mas-an', texto: formula([[C[1], x.nc, C[4]], [A[1], x.na + 1, A[4]]]), error: 'NO2', siFuera: 'Con un anión de más la suma de cargas queda negativa.' },
          ]),
          solucion: { texto: `${f(x.nc, 0)} ${C[0]} y ${f(x.na, 0)} ${A[0]} dejan carga cero.`, ecuacion: [`${f(x.nc, 0)} · (+${C[2]}) + ${f(x.na, 0)} · (−${A[2]}) = 0 → ${x.fo}`] },
        };
      },
    },
  };

  // ---------- Idea 5: sales ácidas, básicas e hidratadas ----------
  // Cambia: la sal · Permanece: la cuenta de cargas · Progresa: H que se queda en el anión, OH⁻ extra, agua sin carga
  // · Se reserva: el agua de cristalización, ficha de carga 0 · Debe verse: qué ficha distinta aparece en cada sal.
  const ESP = {
    bicarbonato: { t: 'NaHCO₃', clase: 'ácida', f: [{ t: 'Na⁺', carga: 1, color: 'o' }, { t: 'HCO₃⁻', carga: -1, color: 'i' }], lee: 'El anión conserva un H: sal ácida.' },
    basica: { t: 'Mg(OH)Cl', clase: 'básica', f: [{ t: 'Mg²⁺', carga: 2, color: 'o' }, { t: 'OH⁻', carga: -1 }, { t: 'Cl⁻', carga: -1, color: 'i' }], lee: 'Hay un OH⁻ junto al anión: sal básica.' },
    hidrato: { t: 'CuSO₄·5H₂O', clase: 'hidratada', f: [{ t: 'Cu²⁺', carga: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, color: 'i' }, { t: 'H₂O', carga: 0, n: 5 }], lee: 'Cinco H₂O enteras sin carga: sal hidratada.' },
    neutra: { t: 'Na₂CO₃', clase: 'neutra', f: [{ t: 'Na⁺', carga: 1, n: 2, color: 'o' }, { t: 'CO₃²⁻', carga: -2, color: 'i' }], lee: 'Solo catión y anión: sal neutra.' },
  };
  // Animación: las fichas de la sal entran solas, de a una (el armado dura 4,5 s y se queda 1,5 s completo); la carga
  // neta se cuenta en cada momento.
  function espT(k, t) {
    const todas = []; for (const x of ESP[k].f) for (let j = 0; j < (x.n || 1); j++) todas.push(x);
    const n = Math.max(1, Math.min(todas.length, 1 + Math.floor(t / (4.5 / todas.length))));
    const lista = []; for (const x of todas.slice(0, n)) { const u = lista.find(y => y.t === x.t); if (u) u.n += 1; else lista.push(Object.assign({}, x, { n: 1 })); }
    return { n, total: todas.length, q: todas.slice(0, n).reduce((a, x) => a + x.carga, 0), dib: fichas(lista) };
  }
  // «Así se resuelve»: las sales de «Ahora tú» separadas en sus partes [texto, carga, cuántas, papel]; papel: c catión,
  // a anión, oh ion hidróxido aparte, agua agua de cristalización.
  const SALES_RES = [
    ['NaHSO₄', 'ácida', [['Na⁺', 1, 1, 'c'], ['HSO₄⁻', -1, 1, 'a']]],
    ['KHCO₃', 'ácida', [['K⁺', 1, 1, 'c'], ['HCO₃⁻', -1, 1, 'a']]],
    ['Ca(HCO₃)₂', 'ácida', [['Ca²⁺', 2, 1, 'c'], ['HCO₃⁻', -1, 2, 'a']]],
    ['Mg(OH)Cl', 'básica', [['Mg²⁺', 2, 1, 'c'], ['OH⁻', -1, 1, 'oh'], ['Cl⁻', -1, 1, 'a']]],
    ['Cu₂(OH)₂CO₃', 'básica', [['Cu²⁺', 2, 2, 'c'], ['OH⁻', -1, 2, 'oh'], ['CO₃²⁻', -2, 1, 'a']]],
    ['Al(OH)SO₄', 'básica', [['Al³⁺', 3, 1, 'c'], ['OH⁻', -1, 1, 'oh'], ['SO₄²⁻', -2, 1, 'a']]],
    ['Na₂CO₃·10H₂O', 'hidratada', [['Na⁺', 1, 2, 'c'], ['CO₃²⁻', -2, 1, 'a'], ['H₂O', 0, 10, 'agua']]],
    ['CaSO₄·2H₂O', 'hidratada', [['Ca²⁺', 2, 1, 'c'], ['SO₄²⁻', -2, 1, 'a'], ['H₂O', 0, 2, 'agua']]],
    ['NaCl', 'neutra', [['Na⁺', 1, 1, 'c'], ['Cl⁻', -1, 1, 'a']]],
    ['K₂SO₄', 'neutra', [['K⁺', 1, 2, 'c'], ['SO₄²⁻', -2, 1, 'a']]],
  ];
  const especiales = {
    id: 'sales-acidas-basicas-hidratadas',
    titulo: 'Sales con H, OH o agua',
    temas: ['Sales ácidas, básicas e hidratadas'],
    pieza: 'quim-fichas',
    lee: {
      tarjetas: [
        { titulo: 'El bicarbonato', texto: 'El bicarbonato de la cocina, NaHCO₃, es una sal que conserva un hidrógeno del ácido carbónico. Por eso se le llama sal ácida, aunque se pueda comer.' },
        { titulo: 'Más que catión y anión', texto: 'Una sal neutra solo tiene catión y anión, como el NaCl. Otras sales traen algo más en su fórmula, y ese algo más decide su nombre de familia: ácida, básica o hidratada.' },
        { titulo: 'Qué mirar', texto: 'En el juego, compara cada sal con la neutra, Na₂CO₃. Busca la ficha que no aparece en la neutra y fíjate en su carga.' },
      ],
    },
    juega: {
      consigna: 'Elige una sal: sus fichas entran solas. Busca la que la distingue de una sal neutra: un H en el anión, un OH⁻ o agua.',
      voz: 'Busca la ficha que sobra respecto de una sal neutra.',
      controles: [{ id: 'k', etiqueta: 'Sal', opciones: Object.keys(ESP).map(k => ({ valor: k, texto: ESP[k].t })) }, T_AUTO(6)],
      dibujo: val => espT(val.k, val.t).dib,
      lectura: val => { const y = espT(val.k, val.t); return [y.n === y.total ? `${ESP[val.k].t}: ${ESP[val.k].lee}` : `${ESP[val.k].t}: ${y.n} de ${y.total} fichas · carga neta ${sg(y.q)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'El yeso es CaSO₄·2H₂O. ¿Qué es el «·2H₂O»?',
      voz: 'Mira la carga de esa parte.',
      opciones: [
        { id: 'c', texto: 'Dos moléculas de agua enteras, sin carga, dentro del cristal', correcta: true },
        { id: 'oh', texto: 'Dos grupos OH⁻: es una sal básica', error: 'QM-HIDRATO', siFuera: 'Un OH⁻ tiene carga −1. El agua del cristal está entera y es neutra.' },
        { id: 'h', texto: 'Hidrógenos ácidos: es una sal ácida', error: 'QM-HIDRATO', siFuera: 'En una sal ácida el H está dentro del anión, como en HCO₃⁻. Aquí son moléculas de agua.' },
        { id: 'parte', texto: 'Parte del ion sulfato', error: 'QM-POLI', siFuera: 'El sulfato es SO₄²⁻, completo. El agua va aparte, tras el punto.' },
      ],
      dibujo: fichas([{ t: 'Ca²⁺', carga: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, color: 'i' }]),
      revelar: fichas([{ t: 'Ca²⁺', carga: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, color: 'i' }, { t: 'H₂O', carga: 0, n: 2 }]),
      coincide: 'Coincide: dos H₂O enteras, neutras: la suma sigue en cero.',
      noCoincide: 'Son dos moléculas de agua neutras: la cuenta de cargas no cambia.',
    },
    mira: {
      datos: { fichas: [{ t: 'H⁺', carga: 1, desde: 1, hasta: 1 }, { t: 'Na⁺', carga: 1, color: 'o', desde: 2 }, { t: 'H⁺', carga: 1, desde: 1, hasta: 2 }, { t: 'CO₃²⁻', carga: -2, color: 'i', desde: 1, hasta: 2 }, { t: 'HCO₃⁻', carga: -1, color: 'i', desde: 3 }] },
      voz: 'Sigamos qué H se cambia por el sodio.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El ácido carbónico, H₂CO₃: dos H⁺ y un CO₃²⁻.', ecuacion: ['H₂CO₃'] },
        { estado: { corte: 2 }, texto: 'Un Na⁺ reemplaza a uno de los H⁺; el otro se queda.', ecuacion: ['H₂CO₃ → NaHCO₃'] },
        { estado: { corte: 3 }, texto: 'Ese H queda dentro del anión: HCO₃⁻, hidrogenocarbonato. Sal ácida.', ecuacion: ['Na⁺ + HCO₃⁻ → NaHCO₃'] },
      ],
    },
    regla: {
      texto: 'Sal ácida: el anión conserva H (HCO₃⁻). Sal básica: lleva OH⁻ además del anión. Sal hidratada: moléculas de agua enteras en el cristal (·5H₂O).',
      ecuacion: [{ llave: ['NaHCO₃'], nota: 'ácida' }, '   ·   ', { llave: ['Mg(OH)Cl'], nota: 'básica' }, '   ·   ', { llave: ['CuSO₄·5H₂O'], nota: 'hidratada' }],
      condicion: 'el agua de cristalización no tiene carga ni se mezcla con los OH de un hidróxido; se nombra con prefijos: pentahidrato.',
      voz: 'Una ficha distinta decide la clase.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const r = azar(s + 900), [fo, cl, iones] = r.de(SALES_RES);
        const parte = rol => iones.filter(i => i[3] === rol), cat = parte('c')[0], an = parte('a')[0], oh = parte('oh')[0], agua = parte('agua')[0];
        const lista = iones.map(([t, , n]) => `${n} ${t}`).join(', ');
        const suma = iones.reduce((a, [, q, n]) => a + q * n, 0);
        const cuenta = iones.map(([, q, n]) => `${n} · (${sg(q)})`).join(' + ');
        const aplica = {
          ácida: () => `El anión ${an[0]} conserva un H del ácido. Es una sal ácida.`,
          básica: () => `Además del anión ${an[0]}, hay ${oh[2]} OH⁻ aparte. Es una sal básica.`,
          hidratada: () => `Después del punto hay ${agua[2]} H₂O enteras, sin carga. Es una sal hidratada.`,
          neutra: () => `Solo hay ${cat[0]} y ${an[0]}, sin H en el anión, sin OH⁻ y sin agua. Es una sal neutra.`,
        }[cl]();
        return {
          enunciado: `¿Qué clase de sal es ${fo}: ácida, básica, hidratada o neutra?`,
          dibujo: fichas(iones.map(([t, carga, n, rol]) => Object.assign({ t, carga, n }, rol === 'c' ? { color: 'o' } : rol === 'a' ? { color: 'i' } : {}))),
          pasos: [
            { tipo: 'pide', texto: `Piden la clase de sal de ${fo}. Hay que ver qué trae además del catión y el anión.` },
            { tipo: 'datos', texto: `Separo ${fo} en sus partes: ${lista}.` },
            { tipo: 'regla', texto: 'Una sal neutra solo tiene catión y anión. Si el anión guarda un H, es ácida; si lleva OH⁻ aparte, básica; si trae agua tras el punto, hidratada.' },
            { tipo: 'aplica', texto: aplica },
            { tipo: 'sentido', texto: `Las cargas se anulan, como en toda sal: la suma da ${sg(suma)}.${agua ? ' El agua no cambia la cuenta.' : ''}`, ecuacion: [`${cuenta} = ${sg(suma)}`] },
          ],
          respuesta: `${fo}: sal ${cl}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Busca el H del anión, el OH o el agua.',
      generar(s) {
        const C = [['NaHSO₄', 'ácida'], ['KHCO₃', 'ácida'], ['Ca(HCO₃)₂', 'ácida'], ['Mg(OH)Cl', 'básica'], ['Cu₂(OH)₂CO₃', 'básica'],
          ['Na₂CO₃·10H₂O', 'hidratada'], ['CaSO₄·2H₂O', 'hidratada'], ['NaCl', 'neutra'], ['K₂SO₄', 'neutra'], ['Al(OH)SO₄', 'básica']];
        const [fo, cl] = C[s % C.length];
        const SI = { ácida: 'Sería ácida si el anión conservara un H, como HCO₃⁻.', básica: 'Sería básica si llevara OH⁻ además del anión.', hidratada: 'Sería hidratada si tuviera agua tras el punto (·nH₂O).', neutra: 'Sería neutra si solo tuviera catión y anión, sin H, OH ni agua.' };
        const POR = { ácida: 'El anión conserva un H.', básica: 'Lleva OH⁻ además del anión.', hidratada: 'Tiene agua de cristalización tras el punto.', neutra: 'Solo catión y anión.' };
        return {
          pregunta: `¿Qué clase de sal es ${fo}?`,
          opciones: ['ácida', 'básica', 'hidratada', 'neutra'].map(k => (k === cl ? { id: 'c', texto: `Sal ${k}`, correcta: true } : { id: k, texto: `Sal ${k}`, error: 'QM-HIDRATO', siFuera: SI[k] })),
          solucion: { texto: POR[cl], ecuacion: [`${fo}: sal ${cl}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: la sal armada a mano. El alumno pone cuántas fichas de cada ion; la cuenta dice si quedó neutra.
  // La fila de + es del catión y la de − del anión: estirar el final de cada fila agrega fichas enteras.
  const CATL = ['Na', 'Ca', 'Al', 'NH4'], ANL = ['Cl', 'S', 'CO3', 'SO4', 'PO4'];  // sin NO₃⁻: «NaNO₃» dispara el aviso de NaN del validador
  const salMano = v => { const C = CAT[v.c], A = AN[v.a]; return fichas([{ t: C[0], carga: C[2], n: v.nc, color: 'o' }, { t: A[0], carga: -A[2], n: v.na, color: 'i' }],
    { neta: 'carga neta', alt: `${v.nc} ${C[0]} y ${v.na} ${A[0]}: carga neta ${sg(v.nc * C[2] - v.na * A[2])}.` }); };
  const cargaMano = v => v.nc * CAT[v.c][2] - v.na * AN[v.a][2];
  // La sal simplificada con más fichas entre los iones de la mesa (para el reto del extremo).
  const MAS_FICHAS = Math.max(...CATL.flatMap(c => ANL.map(a => { const x = sal(c, a); return x.nc + x.nc * CAT[c][2] / AN[a][2]; })));
  const filaFin = (q, n, signo) => PF().geometria({ fichas: [] }).cuadrito(q * n - 1, signo);
  // Mesa 2: estados de oxidación con los casos raros: peróxido (O −1), hidruro (H −1) y dos átomos que comparten.
  const RAROS = {
    h2o2: { t: 'H₂O₂', z: 0, x: 'O', nx: 2, fijos: [['H', 1, 2]] },
    nah: { t: 'NaH', z: 0, x: 'H', nx: 1, fijos: [['Na', 1, 1]] },
    s2o3: { t: 'S₂O₃²⁻', z: -2, x: 'S', nx: 2, fijos: [['O', -2, 3]] },
    hno3: { t: 'HNO₃', z: 0, x: 'N', nx: 1, fijos: [['H', 1, 1], ['O', -2, 3]] },
  };
  const sumaRaro = v => { const e = RAROS[v.k]; return v.w * e.nx + e.fijos.reduce((a, [, c, n]) => a + c * n, 0); };
  const cuadra = v => sumaRaro(v) === RAROS[v.k].z;
  const MAX_W = Math.max(...Object.keys(RAROS).flatMap(k => Array.from({ length: 11 }, (_, i) => i - 3).filter(w => cuadra({ k, w }))));
  const raroDib = v => { const e = RAROS[v.k]; return fichas([{ t: `${e.x}${sub(e.nx)} ${e.nx > 1 ? `${e.nx}·(${sg(v.w)})` : sg(v.w)}`, carga: v.w * e.nx, n: 1, color: 'd' }, ...e.fijos.map(grupo)],
    { neta: 'suma de estados', alt: `${e.t} con ${e.x} a ${sg(v.w)}: suma ${sg(v.w * e.nx + e.fijos.reduce((a, [, c, n]) => a + c * n, 0))}, carga ${sg(e.z)}.` }); };

  return {
    unidad: 'quimica.nomenclatura-inorganica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-fichas.js', '/nucleo/kit/piezas/quim-cadena.js'],
    historia: {
      texto: 'Los nombres antiguos dependían del origen, del aspecto o del oficio que usaba una sustancia, y eso dificultaba comparar experimentos. En 1787, Guyton de Morveau, Lavoisier, Berthollet y Fourcroy propusieron un método común para nombrar. La nomenclatura siguió cambiando y hoy hay varios sistemas válidos: aprenderla es traducir entre nombre, fórmula y composición.',
      pregunta: '¿Qué tendría que decir un nombre para reconstruir la fórmula?',
      fuente: { titulo: 'IUPAC, Brief Guide to Inorganic Nomenclature', url: 'https://iupac.org/what-we-do/nomenclature/brief-guides/' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      { termino: 'estado de oxidación', formas: ['estado de oxidación', 'estados de oxidación'], simbolo: 'ω',
        def: 'Carga que tendría un átomo si todos sus enlaces fueran iónicos. En una especie, todos suman su carga.',
        ejemplo: 'HNO₃: +1 + ω + 3 · (−2) = 0, así el N vale +5.', ver: ['enlace iónico'] },
      { termino: 'nomenclatura sistemática', formas: ['nomenclatura sistemática', 'sistemática'],
        def: 'Nombra con prefijos que cuentan átomos: mono, di, tri, tetra.', ejemplo: 'PbO₂: dióxido de plomo.', ver: ['nomenclatura Stock'] },
      { termino: 'nomenclatura Stock', formas: ['nomenclatura Stock', 'Stock'],
        def: 'Nombra con el estado de oxidación del metal en números romanos, entre paréntesis.',
        ejemplo: 'Fe₂O₃: 2ω = 6, óxido de hierro(III).', ver: ['estado de oxidación'] },
      { termino: 'nomenclatura tradicional', formas: ['nomenclatura tradicional'],
        def: 'Nombra con sufijos: -oso para el estado de oxidación menor del elemento e -ico para el mayor.',
        ejemplo: 'FeO: óxido ferroso; Fe₂O₃: óxido férrico.', ver: ['nomenclatura Stock', 'estado de oxidación'] },
      { termino: 'óxido básico', formas: ['óxido básico', 'óxidos básicos'], def: 'Compuesto de un metal con oxígeno. Con agua forma un hidróxido.',
        ejemplo: 'CaO + H₂O → Ca(OH)₂.', ver: ['hidróxido', 'óxido ácido'] },
      { termino: 'óxido ácido', formas: ['óxido ácido', 'óxidos ácidos'], def: 'Compuesto de un no metal con oxígeno; también se llama anhídrido. Con agua forma un oxácido.',
        ejemplo: 'SO₃ + H₂O → H₂SO₄.', ver: ['oxácido', 'óxido básico'] },
      { termino: 'hidróxido', formas: ['hidróxido', 'hidróxidos'], def: 'Compuesto de un catión metálico con iones OH⁻.',
        ejemplo: 'NaOH: hidróxido de sodio.', ver: ['óxido básico'] },
      { termino: 'oxácido', formas: ['ácido oxácido', 'oxácido', 'oxácidos'], def: 'Ácido formado por hidrógeno, un no metal y oxígeno.',
        ejemplo: 'H₂SO₄, ácido sulfúrico.', ver: ['óxido ácido', 'hidrácido'] },
      { termino: 'hidrácido', formas: ['hidrácido', 'hidrácidos'], def: 'Ácido sin oxígeno: hidrógeno unido a un no metal, disuelto en agua.',
        ejemplo: 'HCl(ac), ácido clorhídrico.', ver: ['oxácido'] },
      { termino: 'sal', formas: ['sal', 'sales'], def: 'Compuesto iónico de un catión con el anión que deja un ácido al perder sus H⁺.',
        ejemplo: 'NaCl, del HCl; CaCO₃, del H₂CO₃.', ver: ['oxisal', 'hidrácido'] },
      { termino: 'oxisal', formas: ['oxisal', 'oxisales'], def: 'Sal cuyo anión lleva oxígeno; viene de un oxácido.',
        ejemplo: 'K₂SO₄, sulfato de potasio.', ver: ['oxácido'] },
      { termino: 'ion poliatómico', formas: ['ion poliatómico', 'iones poliatómicos'],
        def: 'Ion de varios átomos unidos que se comporta como una sola pieza: va entre paréntesis si se repite.',
        ejemplo: 'Ca₃(PO₄)₂: dos fosfatos PO₄³⁻.', ver: ['ion'] },
      { termino: 'sal ácida', formas: ['sal ácida', 'sales ácidas'], def: 'Sal cuyo anión conserva algún hidrógeno del ácido.',
        ejemplo: 'NaHCO₃, con el anión HCO₃⁻.', ver: ['sal'] },
      { termino: 'sal hidratada', formas: ['sal hidratada', 'sales hidratadas', 'hidrato', 'hidratos'],
        def: 'Sal con moléculas de agua fijas en su cristal; se escriben después de un punto.',
        ejemplo: 'CaSO₄·2H₂O: dos aguas por cada CaSO₄.', ver: ['sal'] },
      { termino: 'peróxido', formas: ['peróxido', 'peróxidos'], def: 'Compuesto con dos oxígenos unidos entre sí, O₂²⁻, donde cada oxígeno vale −1.',
        ejemplo: 'H₂O₂: 2 · (+1) + 2 · (−1) = 0.', ver: ['estado de oxidación'] },
      { termino: 'hidruro', formas: ['hidruro', 'hidruros'], def: 'Compuesto del hidrógeno con un metal, donde el hidrógeno vale −1.',
        ejemplo: 'NaH: +1 − 1 = 0.', ver: ['estado de oxidación'] },
    ],
    // Laboratorio (docs/teoria.md §4b), sin preguntas. La primera mesa suelta el número de fichas (la idea 4 lo pone
    // sola): el alumno puede dejar la sal cargada y ver por qué no vale. La segunda trae los casos raros que la idea 1
    // deja para la predicción: peróxido, hidruro y dos átomos del mismo elemento.
    laboratorio: [
      {
        id: 'sal-a-mano', titulo: 'La sal armada a mano', pieza: 'quim-fichas',
        consigna: 'Las fichas de anión suben y bajan solas. Elige los dos iones, pon las fichas y pausa cuando no quede carga sin pareja.',
        controles: [
          { id: 'c', etiqueta: 'Catión', opciones: CATL.map(k => ({ valor: k, texto: CAT[k][0] })) },
          { id: 'a', etiqueta: 'Anión', opciones: ANL.map(k => ({ valor: k, texto: AN[k][0] })) },
          { id: 'nc', etiqueta: 'fichas de catión', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
          { id: 'na', etiqueta: 'fichas de anión', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 0.8, modo: 'rebota' } },
        ],
        dibujo: v => salMano(ent(v, 'na')),
        lectura: v => {
          v = ent(v, 'na');
          const C = CAT[v.c], A = AN[v.a], q = cargaMano(v), x = sal(v.c, v.a);
          return [q !== 0 ? `${v.nc} ${C[0]} + ${v.na} ${A[0]}: carga ${sg(q)}, no es neutra` : v.nc === x.nc ? `${x.fo}: ${x.nombre} ✓` : `neutra, pero se simplifica a ${x.fo}`];
        },
        // El final de cada fila: arriba, las cargas del catión (q por ficha); abajo, las del anión.
        arrastres: [
          { id: 'cation', etiqueta: 'final de las cargas del catión', color: 'c-o',
            donde: v => filaFin(CAT[v.c][2], v.nc, '+'), mover: (pt, v) => ({ nc: ((pt.x - 47) / 17 + 1) / CAT[v.c][2] }) },
          { id: 'anion', etiqueta: 'final de las cargas del anión', color: 'c-i',
            donde: v => filaFin(AN[v.a][2], Math.round(v.na), '−'), mover: (pt, v) => ({ na: ((pt.x - 47) / 17 + 1) / AN[v.a][2] }) },
        ],
        // Retos comprobados (docs/teoria.md §4d): la carga neta y la fórmula mínima salen de cargaMano y sal(), lo mismo
        // que la lectura.
        invitaciones: [
          { texto: 'Arma la sal de calcio y fosfato sin que quede carga suelta.',
            logrado: v => v.c === 'Ca' && v.a === 'PO4' && cargaMano(v) === 0,
            bien: 'Tres de +2 contra dos de −3: seis y seis. El fosfato va entre paréntesis.' },
          { texto: 'Arma una sal neutra que todavía se pueda simplificar.',
            logrado: v => cargaMano(v) === 0 && v.nc !== sal(v.c, v.a).nc,
            bien: 'Neutra no basta: la fórmula usa la proporción más pequeña.' },
          { texto: 'Busca la sal neutra, ya simplificada, que pide más fichas en total.',
            logrado: v => cargaMano(v) === 0 && v.nc === sal(v.c, v.a).nc && v.nc + v.na === MAS_FICHAS,
            bien: 'Cargas que no se dividen entre sí piden más fichas de cada lado.' },
          { texto: 'Guarda dos sales neutras con el mismo anión y distinto número de cationes.',
            logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.a === y.a && x.nc !== y.nc
              && cargaMano(x) === 0 && cargaMano(y) === 0)),
            bien: 'Mismo anión, otra carga del catión: cambia cuántas fichas pide.' },
        ],
      },
      {
        id: 'estados-raros', titulo: 'Peróxidos, hidruros y pares', pieza: 'quim-fichas',
        consigna: 'Ajusta el estado del átomo verde hasta que la suma iguale la carga. Aquí el oxígeno o el hidrógeno no valen lo de siempre.',
        controles: [
          { id: 'k', etiqueta: 'Especie', opciones: Object.keys(RAROS).map(k => ({ valor: k, texto: RAROS[k].t })) },
          { id: 'w', etiqueta: 'ω', color: 'c-d', min: -3, max: 7, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => raroDib(v),
        lectura: v => { const e = RAROS[v.k], suma = sumaRaro(v); return [`${e.x} ${sg(v.w)} en ${e.t}: suma ${sg(suma)}, carga ${sg(e.z)}${suma === e.z ? ' ✓' : ''}`]; },
        arrastres: [arrastreVerde(raroDib, v => RAROS[v.k].nx, 'w')],
        // Retos: «cuadra» cuando sumaRaro, la misma suma de la lectura, iguala la carga de la especie.
        invitaciones: [
          { texto: 'Haz que cuadre el peróxido de hidrógeno: ¿cuánto vale cada oxígeno?',
            logrado: v => v.k === 'h2o2' && cuadra(v),
            bien: 'Cada oxígeno vale −1: los dos están unidos entre sí.' },
          { texto: 'Haz que el hidrógeno valga −1 en un compuesto neutro.',
            logrado: v => v.k === 'nah' && cuadra(v),
            bien: 'Junto a un metal, el hidrógeno gana el electrón: es un hidruro.' },
          { texto: 'Busca la especie donde el átomo verde llega al estado más alto.',
            logrado: v => cuadra(v) && v.w === MAX_W,
            bien: 'El nitrógeno del HNO₃ da todos sus electrones de valencia.' },
          { texto: 'Guarda dos especies distintas, ya cuadradas, con el mismo estado del átomo verde.',
            logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.k !== y.k && x.w === y.w && cuadra(x) && cuadra(y))),
            bien: 'Mismo −1 en peróxido e hidruro: el valor depende de los vecinos.' },
        ],
      },
    ],
    ideas: [oxidacion, tipos, funciones, sales, especiales],
  };
});
