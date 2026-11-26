/*
 * Teoría de «Arreglos numéricos y cuadrados mágicos» (razonamiento-matematico.arreglos-numericos). Molde: docs/teoria.md
 * y docs/molde-unidad.md. Etapa 9 del plan de calidad (docs/plan-calidad.md §7), segunda unidad de la rama «Números y
 * patrones». Propuesta: docs/etapa9/propuesta-razonamiento-matematico.md (Gerson delegó el criterio y revisa después).
 * Seis ideas: 1. reparto-parejo «El total se reparte parejo» (la bandeja de la kermés) · 2. vertices-dos-veces «Lo
 * compartido cuenta dos veces» (la bandeja en cruz) · 3. mayor-suma «La mayor suma tiene que armarse» (el marco
 * triangular) · 4. suma-magica «El cuadrado mágico y su centro» (el tablero 4 × 4) · 5. producto-magico «Cuando las líneas
 * multiplican» (las tiras de cartulina) · 6. piramide-de-sumas «La pirámide de sumas» (el muro de adobes).
 * reparto-parejo y suma-magica conservan su predicción y sus ids; vertices-dos-veces cambia la suya (nucleo/avance.js).
 * Público: 5.º de secundaria y preuniversitario.
 *
 * Colores (molde §5b, un color fijo por magnitud; la pieza rm-casillas fija sus papeles y arreglos-numericos.test.js lo
 * comprueba):
 *   tinta ....... las tarjetas, sus números, las líneas, n
 *   o naranja ... T, el total de todos los números (en la idea 5, el producto de todas las casillas)
 *   i turquesa .. lo compartido: V (las esquinas), c (el centro o la casilla común), las veces que sube un adobe
 *   f violeta ... S y P, la suma o el producto común, y la cima: lo que se pide casi siempre (en las figuras, solo al
 *                 resolver)
 *   h carmín .... x, la casilla que se busca (la unidad no tiene ángulos; x va junto a S y no puede ser violeta)
 *   Sin verde: no puede ir junto al naranja del total.
 * Letras (letras): T, S, V, c, n, a, b, P, x. «×» y «÷» en todo texto (nunca «·» ni «/»).
 * Errores: RMP1, RMP2, RMP61, RMP63, RMP65 y RMP180 a RMP193 (docs/investigacion/codigos-rm-procesos.md, todos hipótesis).
 * Historia: los cuadrados mágicos y el Lo Shu (ETH Library). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: saber cuánto suma cada grupo antes de armarlo, y cuándo no hay reparto.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: halla la suma común con el total, descarta un reparto imposible y halla la tarjeta que falta.
 *   Orden de atención: 1.º la bandeja con sus dos filas · 2.º lo que suma cada fila y el total · acción: voltear columnas.
 *   Estados: juego sin tocar · misión cumplida · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cuánto tiene que sumar cada fila si todavía no las armé?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const PZ = 'rm-casillas';
  const f0 = v => Kit.formatear(v, 0);
  // Las letras, cada una con el color de su magnitud (molde §5b).
  const T = { v: 'c-o', t: 'T' }, S = { v: 'c-f', t: 'S' }, V = { v: 'c-i', t: 'V' }, C = { v: 'c-i', t: 'c' }, x = { v: 'c-h', t: 'x' }, P = { v: 'c-f', t: 'P' };
  const F = t => ({ v: 'c-f', t });   // la suma o el producto común, ya hallado: violeta
  const H = t => ({ v: 'c-h', t });   // la casilla que se busca, ya hallada: carmín
  const I = t => ({ v: 'c-i', t });   // lo compartido: turquesa
  const O = t => ({ v: 'c-o', t });   // el total: naranja
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  const suma = xs => xs.reduce((m, x) => m + x, 0);
  function particion(nums) {
    const T = suma(nums);
    if (T % 2) return null;
    const n = nums.length;
    for (let m = 0; m < 1 << n; m++) { let t = 0; for (let i = 0; i < n; i++) if (m >> i & 1) t += nums[i]; if (t === T / 2) return nums.filter((_, i) => m >> i & 1); }
    return null;
  }
  // Casos ya usados por idea (el juego, la predicción y los 15 ejemplos): «Ahora tú» y «Así se resuelve» no los repiten
  // (regla 15 de la Etapa 6). Cada ejemplo guarda su clave en _caso.
  const CLAVES = {};
  const usado = (idea, clave) => !!(CLAVES[idea] && CLAVES[idea].has(clave));
  const juntar = (idea, ejemplos, extra) => { CLAVES[idea] = new Set(extra.concat(ejemplos.map(e => e._caso).filter(Boolean))); };
  // Un ejemplo: con alternativas (nivel 3), la última línea del resuelto nombra cada incorrecta por su valor.
  function ejemplo(o) {
    const e = { nivel: o.nivel, titulo: o.titulo, enunciado: o.enunciado, datos: o.datos, solucion: o.solucion, respuesta: o.respuesta, _caso: o.caso || null };
    if (o.figura) e.figura = o.figura;
    if (o.alternativas) {
      const ok = o.alternativas.filter(a => a === o.correcta);
      if (ok.length !== 1) throw new Error(`ejemplo «${o.titulo}»: la correcta debe estar una sola vez`);
      e.alternativas = o.alternativas;
      e.solucion = o.solucion.concat((Array.isArray(o.explica) ? o.explica : [o.explica]).map(texto => ({ texto })));
    }
    return e;
  }
  // ---------- Idea 1: el total se reparte parejo ----------
  // Objeto de la primera pantalla: la bandeja de la kermés (rm-casillas, escena «bandeja»). Cambia: qué tarjeta de cada
  // columna va arriba. · Permanece: las seis tarjetas y su total, 24. · Progresa: lo que suma cada fila. · Se reserva: un
  // total par que no se arma (2, 4, 6, 8 y 10, Predice). · Debe verse: una fila gana lo que la otra pierde; parejas, 12 y 12.
  const J1_ARR = [1, 2, 3], J1_ABA = [7, 6, 5], T_J1 = suma(J1_ARR) + suma(J1_ABA);
  const filasJ1 = v => { const arr = [], aba = []; for (let k = 0; k < 3; k++) { const sube = v['c' + k] === 1; arr.push(sube ? J1_ABA[k] : J1_ARR[k]); aba.push(sube ? J1_ARR[k] : J1_ABA[k]); } return { arr, aba }; };
  // Las dos soluciones de la misión, buscadas aquí (no escritas a mano): {7, 2, 3} y {1, 6, 5} arriba.
  const SOL_J1 = [0, 1].flatMap(a => [0, 1].flatMap(b => [0, 1].map(c => ({ c0: a, c1: b, c2: c })))).filter(v => { const f = filasJ1(v); return suma(f.arr) === suma(f.aba); });
  if (T_J1 !== 24 || SOL_J1.length !== 2) throw new Error('juego de la idea 1: total 24 y dos maneras de igualar las filas');
  const P1_NUMS = [2, 4, 6, 8, 10];
  if (suma(P1_NUMS) !== 30 || particion(P1_NUMS)) throw new Error('predicción de la idea 1: 2, 4, 6, 8 y 10 suman 30 y no se reparten');
  const bandeja = (filas, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'bandeja', filas }, o), estado: {} });
  const cartas = (xs, papel) => xs.map(x => (x === '?' ? { t: '?' } : x === null ? { hueco: true } : papel ? { t: f0(x), papel } : { t: f0(x) }));
  const huecos = k => Array.from({ length: k }, () => ({ hueco: true }));
  function dibujoJ1(v) {
    const { arr, aba } = filasJ1(v);
    return { datos: { escena: 'bandeja', conResultado: true, toques: ['c0', 'c1', 'c2'],
      filas: [{ cartas: cartas(arr), resultado: { t: f0(suma(arr)) } }, { cartas: cartas(aba), resultado: { t: f0(suma(aba)) } }],
      nota: [{ t: `Total de las seis: ${f0(T_J1)}`, papel: 'total' }] }, estado: {} };
  }
  function lecturaJ1(v) {
    const { arr, aba } = filasJ1(v), a = suma(arr), b = suma(aba);
    if (a === b) return [`Arriba ${f0(a)} y abajo ${f0(b)}: cada una, la mitad de `, T, ` = ${f0(T_J1)}`];
    return [`Arriba ${f0(a)} y abajo ${f0(b)}: juntas dan `, T, ` = ${f0(T_J1)}`];
  }
  // Datos que se repiten en los ejercicios de la idea (herramientas, no el paso hecho).
  const D_TOTAL = 'El total es lo que suman todas las tarjetas del reto, contando cada una una sola vez.';
  const D_GRUPO = 'Si los grupos no comparten tarjetas y las usan todas, cada grupo suma el total ÷ el número de grupos.';
  const D_SEGUIDOS = 'Los números que van con un mismo salto suman (primero + último) × cuántos son ÷ 2.';
  const D_PAR = 'Una suma de números pares siempre da par.';
  const D_FALTA = 'La tarjeta que le falta a un grupo es la suma del grupo menos lo que ya tiene.';
  const rango = (a, b, d = 1) => { const xs = []; for (let x = a; x <= b; x += d) xs.push(x); return xs; };
  // Reparte nums en k grupos de r tarjetas con la misma suma (búsqueda completa; null si no se puede).
  function enGrupos(nums, k, r) {
    const T = suma(nums);
    if (T % k || nums.length !== k * r) return null;
    const S = T / k, orden = nums.slice().sort((p, q) => q - p), grupos = Array.from({ length: k }, () => []), sumas = Array(k).fill(0);
    const ir = i => {
      if (i === orden.length) return true;
      const vistos = new Set();
      for (let g = 0; g < k; g++) {
        if (grupos[g].length >= r || sumas[g] + orden[i] > S || vistos.has(`${grupos[g].length}|${sumas[g]}`)) continue;
        vistos.add(`${grupos[g].length}|${sumas[g]}`);
        grupos[g].push(orden[i]); sumas[g] += orden[i];
        if (ir(i + 1)) return true;
        grupos[g].pop(); sumas[g] -= orden[i];
      }
      return false;
    };
    return ir(0) ? grupos.map(g => g.slice().sort((p, q) => p - q)) : null;
  }
  const listaTxt = xs => (xs.length > 1 ? `${xs.slice(0, -1).map(f0).join(', ')} y ${f0(xs[xs.length - 1])}` : xs.map(f0).join(''));
  const deA = (xs, d) => (d === 1 ? `del ${f0(xs[0])} al ${f0(xs[xs.length - 1])}` : `${xs[0] % 2 ? 'impares' : 'pares'} del ${f0(xs[0])} al ${f0(xs[xs.length - 1])}`);
  const SEP = '   ·   ';
  const NUMS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  const nf = k => NUMS[k] || f0(k);   // «tres filas», «dos columnas» (femenino)
  // Opciones numéricas: la correcta y los errores que dan un valor distinto, entero y positivo.
  function opcionesNum(correcta, distractores, max = 4, sufijo = '') {
    const vistos = new Set([correcta]), ops = [{ id: 'c', texto: f0(correcta) + sufijo, correcta: true }];
    for (const d of distractores) {
      if (!d || !Number.isFinite(d.valor) || d.valor <= 0 || !Number.isInteger(d.valor) || vistos.has(d.valor) || ops.length >= max) continue;
      vistos.add(d.valor); ops.push({ id: d.id, texto: f0(d.valor) + sufijo, error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }
  // Los casos de «Ahora tú» de la idea 1, por tipo (semilla % 3): 0 la suma de cada grupo · 1 ¿se puede repartir? ·
  // 2 la tarjeta que falta. «Así se resuelve» usa los mismos tipos con otras listas (columnas, otros rangos) y no repite.
  function casoGrupos(r, o) {
    for (let i = 0; i < 400; i++) {
      const d = r.elegir(o.pasos), k = r.elegir(o.ks), por = r.elegir([3, 4]), a = r.ent(o.desde[0], o.desde[1]);
      const nums = rango(a, a + d * (k * por - 1), d), T = suma(nums);
      if (k * por > 12 || T % k || usado('reparto-parejo', `grupos|${nums.join(',')}|${k}`)) continue;
      const g = enGrupos(nums, k, por);
      if (!g) continue;
      return { nums, d, k, por, T, S: T / k, g };
    }
    throw new Error('casoGrupos');
  }
  function casoSePuede(r, quiere, pool) {
    for (let i = 0; i < 4000; i++) {
      const n = r.ent(5, 7), nums = r.barajar(pool).slice(0, n).sort((p, q) => p - q), T = suma(nums), g = particion(nums);
      const tipo = g ? 'si' : T % 2 ? 'impar' : 'par';
      if (tipo !== quiere || usado('reparto-parejo', `puede|${nums.join(',')}`)) continue;
      return { nums, T, g, tipo, mayor: nums[nums.length - 1] };
    }
    throw new Error('casoSePuede');
  }
  function casoFalta(r, o) {
    for (let i = 0; i < 400; i++) {
      const c = casoGrupos(r, o), fila = r.ent(0, c.k - 1), G = c.g[fila], j = r.ent(0, G.length - 1), x = G[j], otras = G.filter((_, q) => q !== j);
      if (usado('reparto-parejo', `falta|${c.nums.join(',')}|${otras.join(',')}`)) continue;
      return Object.assign(c, { fila, x, otras });
    }
    throw new Error('casoFalta');
  }
  const textoSePuede = (c, T) => (c === 'si' ? `Sí: cada grupo suma ${f0(T / 2)}` : c === 'impar' ? 'No: el total es impar' : 'No, aunque el total es par');
  function opcionesSePuede(cs) {
    const bien = textoSePuede(cs.tipo, cs.T), T = cs.T, mitad = f0(T / 2);
    const ds = [
      { id: 'si', texto: `Sí: cada grupo suma ${Kit.formatear(T / 2, 1)}`, error: T % 2 ? 'RMP184' : 'RMP180',
        siFuera: T % 2 ? `Repartir el total es la idea, pero ${f0(T)} ÷ 2 no da entero, y con tarjetas enteras no se llega a esa mitad.` : `Es cierto que la mitad es ${mitad}, pero ningún grupo de estas tarjetas suma justo ${mitad}.` },
      { id: 'impar', texto: 'No: el total es impar', error: 'RMP181', siFuera: `Mirar el total es el primer paso, pero súmalo otra vez: las tarjetas dan ${f0(T)}, que es par.` },
      { id: 'par', texto: 'No, aunque el total es par', error: 'RMP180', siFuera: cs.g ? `Es cierto que ser par no basta, pero aquí sí se arma: ${cs.g.map(f0).join(' + ')} = ${mitad}.` : `Pensar en la mitad es la idea, pero ${f0(T)} es impar y no tiene mitad entera.` },
      { id: 'mayor', texto: `Sí: cada grupo suma ${f0(cs.mayor)}`, error: 'RMP181', siFuera: `Probar con la tarjeta mayor es una idea, pero el ${f0(cs.mayor)} solo no es la mitad de ${f0(T)}.` },
    ];
    return [{ id: 'c', texto: bien, correcta: true }].concat(ds.filter(d => d.texto !== bien && !(d.id === 'mayor' && cs.mayor * 2 === T))).slice(0, 4);
  }
  const reparto = {
    id: 'reparto-parejo',
    titulo: 'El total se reparte parejo',
    pregunta: '¿Cuánto suma cada grupo si todos suman lo mismo?',
    temas: ['Distribución de números con condiciones'],
    pieza: PZ,
    aprendizaje: 'Los grupos que no comparten números suman, cada uno, el total entre los grupos; si esa suma no se arma, no hay reparto.',
    actividad: 'Voltear columnas de tarjetas hasta que las dos filas de la bandeja sumen lo mismo.',
    // Lee: la kermés, el total T, la suma común S, par e impar. No dice que un total par no basta (Predice).
    lee: {
      tarjetas: [
        { titulo: 'El juego de la kermés', texto: 'En la kermés del colegio hay un juego de tarjetas con números. Cada reto dice qué tarjetas se usan, una vez cada una, y dónde van: en filas, en columnas o en grupos.',
          pieza: PZ, dibujo: bandeja([{ cartas: cartas(J1_ARR) }, { cartas: cartas(J1_ABA) }]) },
        { titulo: 'El total y la suma común', texto: ['El total, ', T, ', es lo que suman todas las tarjetas del reto. Si varias filas deben sumar lo mismo, esa suma de cada una es la suma común, ', S, '.'] },
        { titulo: 'Par e impar', texto: 'Un número es par si se parte en dos mitades enteras: 14 = 7 + 7. Uno impar, como 9, no se parte así: cada mitad sería 4,5.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cada columna de la bandeja tiene dos tarjetas. Al tocarla, se voltea: la de arriba baja y la de abajo sube. Mira cuánto suma cada fila y cuánto suman las seis.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'La bandeja tiene seis tarjetas: 1, 2 y 3 arriba, y 7, 6 y 5 abajo. Cada columna se puede voltear.',
      mision: {
        texto: 'Haz que las dos filas sumen lo mismo.',
        logrado: v => { const f = filasJ1(v); return suma(f.arr) === suma(f.aba); },
        bien: ['Las dos suman lo mismo: cada fila se lleva la mitad del total.'],
      },
      voz: 'Lo que una fila gana, la otra lo pierde.',
      leyenda: [
        { s: T, t: 'el total de las seis tarjetas' },
        { s: '6, 18…', t: 'la suma de cada fila' },
      ],
      controles: [0, 1, 2].map(k => ({ id: 'c' + k, etiqueta: `Columna ${k + 1}`, opciones: [{ valor: 0, texto: `${f0(J1_ARR[k])} arriba` }, { valor: 1, texto: `${f0(J1_ABA[k])} arriba` }] })),
      dibujo: v => dibujoJ1(v),
      lectura: v => lecturaJ1(v),
      minimo: 3,
    },
    // La predicción de antes, con su pregunta y sus ids (el avance la conserva).
    predice: {
      pregunta: 'Los números 2, 4, 6, 8 y 10 suman 30, que es par. ¿Se pueden repartir en dos grupos de igual suma?',
      datos: ['Un número par se parte en dos mitades enteras; uno impar, no.', 'Al sumar números pares, el resultado siempre es par.'],
      voz: 'Piensa cuánto tendría que sumar cada grupo.',
      opciones: [
        { id: 'si', texto: 'Sí: el total es par', error: 'RMP180', siFuera: 'Es cierto que el total par hace falta, pero no basta: cada grupo debería sumar 15, que es impar, y sumando pares nunca sale impar.' },
        { id: 'diez', texto: 'Sí: 10 con 4, y 2 con 6 y 8', error: 'RMP181', siFuera: 'Probar grupos es buena idea, pero súmalos otra vez: 10 + 4 = 14 y 2 + 6 + 8 = 16, que no son iguales.' },
        { id: 'c', texto: 'No: cada grupo sumaría 15, y con pares no sale', correcta: true },
      ],
      dibujo: bandeja([{ cartas: cartas(P1_NUMS) }], { nota: [{ t: 'Total 30, que es par', papel: 'total' }] }),
      revelar: bandeja([{ cartas: cartas(P1_NUMS) }], { nota: [{ t: 'Total 30, que es par', papel: 'total' }, { t: 'Cada grupo: 30 ÷ 2 = 15, impar', papel: 'seguro' }] }),
      coincide: 'Coincide: el total es par, pero no basta, porque la mitad, 15, no se arma con números pares.',
      noCoincide: 'Revisemos: cada grupo tendría que sumar la mitad del total.',
    },
    mira: {
      pieza: PZ,
      datos: { escena: 'bandeja', conResultado: true,
        filas: [{ rotulo: 'Grupo 1', cartas: cartas([7, 6, 1]), resultado: { t: '14', desde: 1 } }, { rotulo: 'Grupo 2', cartas: cartas([5, 4, 3, 2]), resultado: { t: '14', desde: 1 } }],
        nota: [{ t: 'Del 1 al 7: total 28', papel: 'total' }, { t: '2, 4, 6, 8 y 10 suman 30; la mitad, 15, es impar', desde: 2 }] },
      voz: 'Primero el total; después, armar los grupos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las tarjetas del 1 al 7 suman 28, así que dos grupos parejos tienen que sumar 14 cada uno.', ecuacion: [S, ' = ', T, ' ÷ 2 = 28 ÷ 2 = 14'] },
        { estado: { corte: 1 }, texto: 'Los grupos sí se arman: 7 + 6 + 1 da 14, y 5 + 4 + 3 + 2 también da 14.' },
        { estado: { corte: 2 }, texto: 'Con 2, 4, 6, 8 y 10, el total es 30, así que cada grupo debería sumar 15.', ecuacion: [S, ' = 30 ÷ 2 = 15'] },
        { estado: { corte: 2 }, texto: 'Una suma de números pares siempre da par, así que ningún grupo puede sumar justo 15, que es impar.' },
      ],
    },
    regla: {
      texto: 'Si los grupos no comparten números y entre todos usan cada número una vez, cada grupo suma el total dividido entre el número de grupos. Esa cuenta dice cuánto debe sumar cada uno; falta comprobar que los grupos se armen.',
      ecuacion: [{ llave: [S], nota: 'cada grupo', color: 'c-f' }, ' = ', T, ' ÷ grupos', SEP, { llave: [x], nota: 'el número que le falta al grupo', color: 'c-h' }, ' = ', S, ' − lo\u00a0que\u00a0ya\u00a0tiene'],
      condicion: 'el total dividido entre los grupos da un número entero y, además, los grupos se pueden armar con los números que hay.',
      voz: 'El total manda: se reparte parejo.',
    },
    ejemplos: null,
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const c = casoGrupos(r, { pasos: [1, 2], ks: [3, 4], desde: [13, 21] });
          return {
            enunciado: `Las tarjetas ${deA(c.nums, c.d)} van en ${nf(c.k)} filas de ${nf(c.por)}, una vez cada una, y todas las filas suman lo mismo. ¿Cuánto suma cada fila?`,
            datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS],
            dibujo: bandeja(Array.from({ length: c.k }, (_, i) => ({ rotulo: `Fila ${i + 1}`, cartas: huecos(c.por) })), { meta: `Tarjetas ${deA(c.nums, c.d)}` }),
            pasos: [
              { tipo: 'pide', texto: 'Piden la suma común: lo que suma cada fila.' },
              { tipo: 'datos', texto: `Son ${f0(c.nums.length)} tarjetas, ${deA(c.nums, c.d)}. Las sumo con la fórmula de los números seguidos.`, ecuacion: [T, ` = (${f0(c.nums[0])} + ${f0(c.nums[c.nums.length - 1])}) × ${f0(c.nums.length)} ÷ 2 = ${f0(c.T)}`] },
              { tipo: 'regla', texto: 'Las filas no comparten tarjetas y las usan todas: cada una se lleva la misma parte del total.' },
              { tipo: 'cuentas', texto: `Reparto el total entre las ${f0(c.k)} filas.`, ecuacion: [S, ` = ${f0(c.T)} ÷ ${f0(c.k)} = `, F(f0(c.S))],
                dibujo: bandeja(c.g.map((g, i) => ({ rotulo: `Fila ${i + 1}`, cartas: cartas(g), resultado: { t: f0(c.S), papel: 'seguro' } })), { meta: `Tarjetas ${deA(c.nums, c.d)}` }) },
              { tipo: 'sentido', texto: `Las filas sí se arman: la primera, ${c.g[0].map(f0).join(' + ')}, da ${f0(c.S)}. Además, ${f0(c.k)} × ${f0(c.S)} = ${f0(c.T)}, que es el total.` },
            ],
            respuesta: [S, ' = ', F(f0(c.S))],
          };
        }
        if (tipo === 1) {
          const quiere = ['par', 'si', 'impar'][Math.floor(s / 3) % 3], cs = casoSePuede(r, quiere, [3, 5, 6, 8, 9, 12, 14, 16, 17, 21, 23]);
          const mitad = cs.T / 2, cuentas = cs.tipo === 'si' ? { tipo: 'cuentas', texto: `Busco un grupo que llegue justo a ${f0(mitad)}.`, ecuacion: [`${cs.g.map(f0).join(' + ')} = `, F(f0(mitad))] }
            : cs.tipo === 'impar' ? { tipo: 'cuentas', texto: `El total ${f0(cs.T)} es impar: no se parte en dos mitades enteras.`, ecuacion: [T, ` = ${f0(cs.T)}  ⇒  ${f0(cs.T)} ÷ 2 = ${Kit.formatear(mitad, 1)}`] }
              : { tipo: 'cuentas', texto: `Cada grupo debería sumar ${f0(mitad)}. Pruebo los grupos posibles: ninguno llega justo a ${f0(mitad)}.`, ecuacion: [S, ` = ${f0(cs.T)} ÷ 2 = ${f0(mitad)}`] };
          const otro = cs.g ? cs.nums.slice() : [];
          if (cs.g) for (const q of cs.g) otro.splice(otro.indexOf(q), 1);
          const sentido = cs.tipo === 'si' ? `El otro grupo, ${otro.map(f0).join(' + ')}, también da ${f0(mitad)}.`
            : cs.tipo === 'impar' ? 'Si dos grupos sumaran lo mismo, el total sería el doble de un entero y, por eso, sería par.'
              : cs.mayor > mitad ? `El ${f0(cs.mayor)} solo ya pasa de ${f0(mitad)}, así que el grupo que lo tenga se pasa: ser par no bastaba.` : 'El total es par, pero ninguna combinación de estas tarjetas da la mitad: ser par hace falta, pero no basta.';
          return {
            enunciado: `¿Se pueden repartir las tarjetas ${listaTxt(cs.nums)} en dos grupos que sumen lo mismo?`,
            datos: [D_TOTAL, D_GRUPO],
            dibujo: bandeja([{ cartas: cartas(cs.nums) }]),
            pasos: [
              { tipo: 'pide', texto: 'Piden decidir si las tarjetas, usadas una vez cada una, se parten en dos grupos de igual suma.' },
              { tipo: 'datos', texto: `Son ${f0(cs.nums.length)} tarjetas. Primero las sumo todas.`, ecuacion: [T, ` = ${cs.nums.map(f0).join(' + ')} = ${f0(cs.T)}`] },
              { tipo: 'regla', texto: 'Cada grupo tendría que sumar la mitad del total. Si el total es impar, no hay mitad entera; si es par, falta armar el grupo.' },
              cuentas,
              { tipo: 'sentido', texto: sentido },
            ],
            respuesta: [F(cs.tipo === 'si' ? 'Sí se puede' : 'No se puede')],
          };
        }
        const c = casoFalta(r, { pasos: [1], ks: [3, 4], desde: [11, 19] });
        return {
          enunciado: `Las tarjetas ${deA(c.nums, c.d)} van en ${nf(c.k)} filas de ${nf(c.por)} que suman lo mismo. Una fila tiene ${listaTxt(c.otras)} y le falta una tarjeta. ¿Cuál es?`,
          datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS, D_FALTA],
          dibujo: bandeja(c.g.map((g, i) => ({ rotulo: `Fila ${i + 1}`, cartas: i === c.fila ? cartas(c.otras.concat(['?'])) : huecos(g.length) })), { meta: `Tarjetas ${deA(c.nums, c.d)}` }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la tarjeta que completa esa fila.' },
            { tipo: 'datos', texto: `El total de las ${f0(c.nums.length)} tarjetas sale con la fórmula de los números seguidos.`, ecuacion: [T, ` = (${f0(c.nums[0])} + ${f0(c.nums[c.nums.length - 1])}) × ${f0(c.nums.length)} ÷ 2 = ${f0(c.T)}`] },
            { tipo: 'regla', texto: `Cada fila suma el total dividido entre ${f0(c.k)}, y la tarjeta que falta es esa suma menos lo que la fila ya tiene.` },
            { tipo: 'cuentas', texto: 'Primero la suma común; después, lo que falta.', ecuacion: [S, ` = ${f0(c.T)} ÷ ${f0(c.k)} = ${f0(c.S)}`, SEP, x, ` = ${f0(c.S)} − (${c.otras.map(f0).join(' + ')}) = `, F(f0(c.x))] },
            { tipo: 'sentido', texto: `El ${f0(c.x)} es una de las tarjetas y no estaba en esa fila; con él, ${c.otras.concat([c.x]).map(f0).join(' + ')} = ${f0(c.S)}.` },
          ],
          respuesta: [x, ' = ', F(f0(c.x))],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 3): 0 la suma común · 1 ¿se puede? · 2 la tarjeta que falta. Cada distractor da el
    // valor de su error.
    ahoraTu: {
      pieza: PZ,
      voz: 'Primero el total de todas las tarjetas.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const c = casoGrupos(r, { pasos: [1, 1, 2], ks: [2, 3, 4], desde: [1, 12] });
          const ds = [
            { id: 'total', valor: c.T, error: 'RMP61', siFuera: `Sumaste bien todas las tarjetas: ${f0(c.T)} es el total, pero falta repartirlo entre las ${f0(c.k)} filas.` },
            { id: 'doble', valor: 2 * c.S, error: 'RMP193', siFuera: 'Repartir es la idea, pero la fórmula de los números seguidos lleva «÷ 2»; sin él, sale el doble.' },
            c.por !== c.k ? { id: 'porFila', valor: c.T / c.por, error: 'RMP192', siFuera: `Repartir el total es la idea, pero entre las ${f0(c.k)} filas, no entre las ${f0(c.por)} tarjetas de cada fila.` } : null,
            { id: 'promedio', valor: c.T / c.nums.length, error: 'RMP192', siFuera: `Dividir el total es la idea, pero ${f0(c.T)} ÷ ${f0(c.nums.length)} es lo que toca a cada tarjeta, no a cada fila.` },
            { id: 'mas', valor: c.S + c.d * c.por, error: 'RMP61', siFuera: 'Buscas la suma de una fila, pero esa cuenta no reparte el total: revisa la división entre las filas.' },
          ];
          return {
            pregunta: `Las tarjetas ${deA(c.nums, c.d)} van en ${nf(c.k)} filas de ${nf(c.por)}, una vez cada una, y todas las filas suman lo mismo. ¿Cuánto suma cada fila?`,
            datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS],
            dibujo: bandeja(Array.from({ length: c.k }, (_, i) => ({ rotulo: `Fila ${i + 1}`, cartas: huecos(c.por) })), { meta: `Tarjetas ${deA(c.nums, c.d)}` }),
            opciones: opcionesNum(c.S, ds),
            solucion: { texto: `Cada fila suma el total dividido entre las ${f0(c.k)} filas; por ejemplo, ${c.g[0].map(f0).join(' + ')} = ${f0(c.S)}.`, ecuacion: [T, ` = ${f0(c.T)}`, SEP, S, ` = ${f0(c.T)} ÷ ${f0(c.k)} = `, F(f0(c.S))] },
          };
        }
        if (tipo === 1) {
          const quiere = ['si', 'par', 'impar'][Math.floor(s / 3) % 3], cs = casoSePuede(r, quiere, rango(1, 20));
          return {
            pregunta: `¿Se pueden repartir las tarjetas ${listaTxt(cs.nums)} en dos grupos que sumen lo mismo?`,
            datos: [D_TOTAL, D_GRUPO, D_PAR],
            dibujo: bandeja([{ cartas: cartas(cs.nums) }]),
            opciones: opcionesSePuede(cs),
            solucion: { texto: cs.tipo === 'si' ? `El total es ${f0(cs.T)}, y el grupo ${cs.g.map(f0).join(' + ')} da justo la mitad, ${f0(cs.T / 2)}.` : cs.tipo === 'impar' ? `El total, ${f0(cs.T)}, es impar: no tiene mitad entera.` : `El total, ${f0(cs.T)}, es par, pero ningún grupo suma justo ${f0(cs.T / 2)}.`,
              ecuacion: [T, ` = ${f0(cs.T)}`] },
          };
        }
        const c = casoFalta(r, { pasos: [1, 2], ks: [2, 3], desde: [1, 10] });
        const sumO = suma(c.otras);
        const ds = [
          { id: 'suma', valor: c.S, error: 'RMP61', siFuera: `Hallaste bien la suma de la fila, ${f0(c.S)}, pero falta quitarle lo que la fila ya tiene.` },
          { id: 'total', valor: c.T - sumO, error: 'RMP61', siFuera: `Restar lo que ya está es la idea, pero hay que restarlo de la suma de una fila, ${f0(c.S)}, no del total.` },
          { id: 'una', valor: c.S - c.otras[0], error: 'RMP63', siFuera: `Restar de ${f0(c.S)} es la idea, pero quitaste solo el ${f0(c.otras[0])}; también hay que quitar las demás tarjetas de la fila.` },
          { id: 'ya', valor: sumO, error: 'RMP61', siFuera: `Sumaste bien lo que la fila ya tiene, ${f0(sumO)}, pero la tarjeta que falta es la que completa ${f0(c.S)}.` },
        ];
        return {
          pregunta: `Las tarjetas ${deA(c.nums, c.d)} van en ${nf(c.k)} filas de ${nf(c.por)} que suman lo mismo. Una fila tiene ${listaTxt(c.otras)} y le falta una tarjeta. ¿Cuál es?`,
          datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS, D_FALTA],
          dibujo: bandeja(c.g.map((g, i) => ({ rotulo: `Fila ${i + 1}`, cartas: i === c.fila ? cartas(c.otras.concat(['?'])) : huecos(g.length) })), { meta: `Tarjetas ${deA(c.nums, c.d)}` }),
          opciones: opcionesNum(c.x, ds),
          solucion: { texto: `Cada fila suma ${f0(c.T)} ÷ ${f0(c.k)} = ${f0(c.S)}, y la tarjeta que falta es lo que le queda a la fila para llegar a esa suma.`, ecuacion: [x, ` = ${f0(c.S)} − ${f0(sumO)} = `, F(f0(c.x))] },
        };
      },
    },
  };
  // ---------- Ejemplos resueltos de «El total se reparte parejo» ----------
  // Comprobados al cargar (enGrupos, particion) y aparte en scratchpad e9-rm/ej1.py, que reparte por fuerza bruta:
  // 1 → 18 · 2 → 14 · 3 → no (15) · 4 → no (19,5) · 5 → 5 · 6 → 42 · 7 → no (10 > 8) · 8 → 4 · 9 → solo columnas, 7 ·
  // 10 → 18 · 11 → 15 (C) · 12 → 11 (B) · 13 → no se puede (D) · 14 → 15 (E) · 15 → 44 (A).
  const r18 = rango(1, 8), r12 = rango(1, 12);
  if (!enGrupos(r18, 2, 4) || !enGrupos([2, 4, 6, 8, 10, 12], 3, 2) || suma(rango(1, 5)) !== 15 || suma(r12) !== 78 || !enGrupos(rango(5, 16), 3, 4)
    || particion([1, 2, 3, 10]) || !enGrupos([1, 3, 5, 6, 7, 8], 2, 3) || !enGrupos(rango(1, 6), 3, 2) || suma(rango(1, 6)) % 2 === 0
    || suma([7, 11]) !== 18 || suma([1, 3, 5, 9]) !== 18 || suma(rango(2, 9)) !== 44 || suma(rango(2, 24, 2)) !== 156 || suma([1, 2, 4, 8]) !== 15
    || suma(rango(1, 11)) !== 66 || suma([1, 10, 11]) !== 22 || suma([1, 4, 9]) !== 14 || suma([2, 5, 8]) !== 15 || suma([3, 6, 7]) !== 16) throw new Error('ejemplos de la idea 1');
  const filasVacias = (k, por, rot = 'Fila') => Array.from({ length: k }, (_, i) => ({ rotulo: `${rot} ${i + 1}`, cartas: huecos(por) }));
  const EJEMPLOS_REP = [
    ejemplo({ nivel: 1, titulo: 'Dos filas de cuatro', caso: 'grupos|1,2,3,4,5,6,7,8|2',
      enunciado: 'Las tarjetas del 1 al 8 van en dos filas de cuatro, una vez cada una, y las dos filas suman lo mismo. ¿Cuánto suma cada fila?',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja(filasVacias(2, 4), { meta: 'Tarjetas del 1 al 8' }),
      solucion: [{ texto: 'Las dos filas usan las ocho tarjetas y no comparten ninguna: cada una se lleva la mitad del total.', ecuacion: [T, ' = 36', SEP, S, ' = 36 ÷ 2 = ', F('18')] }],
      respuesta: [S, ' = ', F('18')] }),
    ejemplo({ nivel: 1, titulo: 'Tres grupos de pares', caso: 'grupos|2,4,6,8,10,12|3',
      enunciado: 'Las tarjetas 2, 4, 6, 8, 10 y 12 se reparten en tres grupos de dos que suman lo mismo. ¿Cuánto suma cada grupo?',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja([{ cartas: cartas([2, 4, 6, 8, 10, 12]) }]),
      solucion: [{ texto: 'Sumo las seis y reparto entre los tres grupos.', ecuacion: [T, ' = 42', SEP, S, ' = 42 ÷ 3 = ', F('14')] },
        { texto: 'Los grupos se arman así: 2 + 12, 4 + 10 y 6 + 8, que dan 14 cada uno.' }],
      respuesta: [S, ' = ', F('14')] }),
    ejemplo({ nivel: 1, titulo: 'Un total impar', caso: 'puede|1,2,3,4,5',
      enunciado: '¿Se pueden repartir las tarjetas 1, 2, 3, 4 y 5 en dos grupos que sumen lo mismo?',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja([{ cartas: cartas([1, 2, 3, 4, 5]) }]),
      solucion: [{ texto: 'El total es 15, impar: cada grupo tendría que sumar 7,5, y con tarjetas enteras no sale.', ecuacion: [T, ' = 15', SEP, '15 ÷ 2 = 7,5'] }],
      respuesta: [F('No se puede')] }),
    ejemplo({ nivel: 1, titulo: 'Cuatro filas', caso: 'grupos|1,2,3,4,5,6,7,8,9,10,11,12|4',
      enunciado: '¿Se pueden poner las tarjetas del 1 al 12 en cuatro filas de tres que sumen lo mismo?',
      datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS], figura: bandeja(filasVacias(4, 3), { meta: 'Tarjetas del 1 al 12' }),
      solucion: [{ texto: 'El total de las doce tarjetas, repartido entre cuatro filas, no da un número entero.', ecuacion: [T, ' = (1 + 12) × 12 ÷ 2 = 78', SEP, '78 ÷ 4 = 19,5'] }],
      respuesta: [F('No se puede')] }),
    ejemplo({ nivel: 1, titulo: 'La tarjeta que falta', caso: 'falta|1,2,3,4,5,6,7,8|1,4,8',
      enunciado: 'Las tarjetas del 1 al 8 van en dos filas de cuatro que suman lo mismo. La fila de arriba tiene 8, 1 y 4. ¿Qué tarjeta le falta?',
      datos: [D_TOTAL, D_GRUPO, D_FALTA], figura: bandeja([{ rotulo: 'Arriba', cartas: cartas([8, 1, 4, '?']) }, { rotulo: 'Abajo', cartas: huecos(4) }]),
      solucion: [{ texto: 'Cada fila suma la mitad de 36, y a la de arriba le falta lo que necesita para llegar a 18.', ecuacion: [S, ' = 18', SEP, x, ' = 18 − (8 + 1 + 4) = ', H('5')] }],
      respuesta: [x, ' = ', H('5')] }),
    ejemplo({ nivel: 2, titulo: 'Del 5 al 16', caso: 'grupos|5,6,7,8,9,10,11,12,13,14,15,16|3',
      enunciado: 'Las tarjetas del 5 al 16 van en tres filas de cuatro, una vez cada una, y las tres filas suman lo mismo. ¿Cuánto suma cada fila?',
      datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS], figura: bandeja(filasVacias(3, 4), { meta: 'Tarjetas del 5 al 16' }),
      solucion: [{ texto: 'Son 12 tarjetas seguidas, así que el total sale con la fórmula de los números seguidos.', ecuacion: [T, ' = (5 + 16) × 12 ÷ 2 = 126'] },
        { texto: 'Reparto el total entre las tres filas; una fila que lo cumple es, por ejemplo, 5 + 6 + 15 + 16.', ecuacion: [S, ' = 126 ÷ 3 = ', F('42')] }],
      respuesta: [S, ' = ', F('42')] }),
    ejemplo({ nivel: 2, titulo: 'Par, pero no se arma', caso: 'puede|1,2,3,10',
      enunciado: '¿Se pueden repartir las tarjetas 1, 2, 3 y 10 en dos grupos que sumen lo mismo?',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja([{ cartas: cartas([1, 2, 3, 10]) }]),
      solucion: [{ texto: 'El total es par: cada grupo tendría que sumar 8.', ecuacion: [T, ' = 16', SEP, S, ' = 16 ÷ 2 = 8'] },
        { texto: 'Pero el grupo que tenga el 10 ya pasa de 8, y el otro grupo, con 1, 2 y 3, suma a lo más 6.' }],
      respuesta: [F('No se puede: el 10 pasa de 8')] }),
    ejemplo({ nivel: 2, titulo: 'Tres filas con un hueco', caso: 'falta|1,2,3,4,5,6,7,8,9|2,9',
      enunciado: 'Las tarjetas del 1 al 9 van en tres filas de tres que suman lo mismo. Una fila tiene el 9 y el 2. ¿Qué tarjeta la completa?',
      datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS, D_FALTA], figura: bandeja([{ rotulo: 'Fila 1', cartas: cartas([9, 2, '?']) }, { rotulo: 'Fila 2', cartas: huecos(3) }, { rotulo: 'Fila 3', cartas: huecos(3) }]),
      solucion: [{ texto: 'Primero la suma común de las tres filas.', ecuacion: [T, ' = (1 + 9) × 9 ÷ 2 = 45', SEP, S, ' = 45 ÷ 3 = 15'] },
        { texto: 'A la fila le falta lo que necesita para llegar a 15; las otras dos se arman con 1 + 6 + 8 y 3 + 5 + 7.', ecuacion: [x, ' = 15 − (9 + 2) = ', H('4')] }],
      respuesta: [x, ' = ', H('4')] }),
    ejemplo({ nivel: 2, titulo: 'Filas o columnas', caso: 'filas-columnas|1,2,3,4,5,6',
      enunciado: 'Las tarjetas del 1 al 6 van en una bandeja de dos filas y tres columnas. ¿Se puede lograr que las dos filas sumen lo mismo? ¿Y las tres columnas?',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja(filasVacias(2, 3), { meta: 'Tarjetas del 1 al 6' }),
      solucion: [{ texto: 'Para las filas, el total, 21, no se parte en dos mitades enteras.', ecuacion: [T, ' = 21', SEP, '21 ÷ 2 = 10,5'] },
        { texto: 'Para las columnas, 21 ÷ 3 = 7, y sí se arman con 1 + 6, 2 + 5 y 3 + 4.', ecuacion: [S, ' = 21 ÷ 3 = ', F('7')] }],
      respuesta: [F('Solo las columnas: 7 cada una')] }),
    ejemplo({ nivel: 2, titulo: 'Impares en dos grupos', caso: 'puede|1,3,5,7,9,11',
      enunciado: 'Las tarjetas 1, 3, 5, 7, 9 y 11 se reparten en dos grupos que suman lo mismo. ¿Cuánto suma cada grupo? Da un reparto.',
      datos: [D_TOTAL, D_GRUPO], figura: bandeja([{ cartas: cartas([1, 3, 5, 7, 9, 11]) }]),
      solucion: [{ texto: 'Cada grupo se lleva la mitad del total.', ecuacion: [T, ' = 36', SEP, S, ' = 36 ÷ 2 = ', F('18')] },
        { texto: 'Un reparto es 7 + 11 = 18, y las otras cuatro también suman 18: 1 + 3 + 5 + 9.' }],
      respuesta: [S, ' = ', F('18'), ': 7 + 11 y 1 + 3 + 5 + 9'] }),
    // Nivel 3 (tipo examen), con alternativas. Letras de la correcta: C, B, D, E, A.
    ejemplo({ nivel: 3, titulo: 'Filas que suben de uno', caso: 'seguidas|1-9',
      enunciado: 'Las tarjetas del 1 al 9 van en tres filas de tres. Las sumas de las filas son tres números seguidos. ¿Cuánto suma la fila del medio?',
      datos: [D_TOTAL, D_SEGUIDOS, 'Tres números seguidos: m − 1, m y m + 1, con m el del medio.'],
      figura: bandeja(filasVacias(3, 3), { meta: 'Tarjetas del 1 al 9' }),
      alternativas: ['14', '16', '15', '45', '5'], correcta: '15',
      solucion: [{ texto: 'Las tres filas juntas usan todas las tarjetas: suman el total.', ecuacion: [T, ' = (1 + 9) × 9 ÷ 2 = 45'] },
        { texto: 'Tres números seguidos suman 3 veces el del medio, porque el menor tiene uno menos y el mayor, uno más.', ecuacion: ['(m − 1) + m + (m + 1) = 45', SEP, 'm = 45 ÷ 3 = ', F('15')] },
        { texto: 'Las filas se arman así: 1 + 4 + 9 = 14, 2 + 5 + 8 = 15 y 3 + 6 + 7 = 16.' }],
      explica: '14 y 16 son las sumas de las otras dos filas; 45 es el total de las tres, y 5 sale de dividir 15 otra vez entre 3.',
      respuesta: [F('15')] }),
    ejemplo({ nivel: 3, titulo: 'Las otras dos de arriba', caso: 'falta|2,3,4,5,6,7,8,9|2,9',
      enunciado: 'Las tarjetas del 2 al 9 van en dos filas de cuatro que suman lo mismo. Arriba están el 9 y el 2. ¿Cuánto suman las otras dos tarjetas de arriba?',
      datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS], figura: bandeja([{ rotulo: 'Arriba', cartas: cartas([9, 2, '?', '?']) }, { rotulo: 'Abajo', cartas: huecos(4) }]),
      alternativas: ['22', '11', '33', '13', '20'], correcta: '11',
      solucion: [{ texto: 'Cada fila suma la mitad del total.', ecuacion: [T, ' = (2 + 9) × 8 ÷ 2 = 44', SEP, S, ' = 44 ÷ 2 = 22'] },
        { texto: 'A la fila de arriba le falta lo que el 9 y el 2 no alcanzan a sumar para llegar a 22.', ecuacion: ['22 − (9 + 2) = ', F('11')] }],
      explica: '22 es la suma de la fila, sin restar nada; 33 resta del total en vez de la fila; 13 quita solo el 9, y 20 quita solo el 2.',
      respuesta: [F('11')] }),
    ejemplo({ nivel: 3, titulo: 'Pares en cuatro grupos', caso: 'grupos|pares 2-24|4',
      enunciado: 'Las tarjetas pares del 2 al 24 se reparten en cuatro grupos que suman lo mismo. ¿Cuánto suma cada grupo?',
      datos: [D_TOTAL, D_GRUPO, D_SEGUIDOS, D_PAR], figura: bandeja(filasVacias(4, 3, 'Grupo'), { meta: 'Tarjetas pares del 2 al 24' }),
      alternativas: ['39', '78', '156', 'No se puede', '13'], correcta: 'No se puede',
      solucion: [{ texto: 'Son 12 tarjetas pares, y su total repartido entre cuatro grupos da 39.', ecuacion: [T, ' = (2 + 24) × 12 ÷ 2 = 156', SEP, '156 ÷ 4 = 39'] },
        { texto: 'Cada grupo tendría que sumar 39, que es impar, y una suma de pares nunca da impar.' }],
      explica: '39 es la cuenta del reparto, pero no se arma con pares; 78 reparte entre dos grupos y no entre cuatro; 156 es el total, y 13 es lo que toca a cada tarjeta.',
      respuesta: [F('No se puede')] }),
    ejemplo({ nivel: 3, titulo: 'Una fila gana por 6', caso: 'diferencia|1-8|6',
      enunciado: 'Las tarjetas del 1 al 8 van en dos filas de cuatro. La fila de arriba suma 6 más que la de abajo. ¿Cuánto suma la fila de abajo?',
      datos: [D_TOTAL, D_SEGUIDOS, 'Dos sumas que dan un total, una mayor por una diferencia: la menor = (total − diferencia) ÷ 2.'],
      figura: bandeja([{ rotulo: 'Arriba', cartas: huecos(4) }, { rotulo: 'Abajo', cartas: huecos(4) }], { meta: 'Tarjetas del 1 al 8' }),
      alternativas: ['18', '21', '12', '30', '15'], correcta: '15',
      solucion: [{ texto: 'Las dos filas juntas suman el total.', ecuacion: [T, ' = (1 + 8) × 8 ÷ 2 = 36'] },
        { texto: 'Si a la fila de arriba se le quitan sus 6 de ventaja, las dos quedan iguales, y cada una vale lo que la de abajo.', ecuacion: ['(36 − 6) ÷ 2 = ', F('15')] },
        { texto: 'Se arma con 1 + 2 + 4 + 8 = 15 abajo y 3 + 5 + 6 + 7 = 21 arriba.' }],
      explica: '18 es la mitad, como si las filas fueran iguales; 21 es la fila de arriba; 12 resta los 6 a la mitad, y 30 quita la ventaja pero no reparte.',
      respuesta: [F('15')] }),
    ejemplo({ nivel: 3, titulo: 'Un grupo es el doble', caso: 'doble|1-11',
      enunciado: 'Las tarjetas del 1 al 11 se reparten en dos grupos, y uno suma el doble que el otro. ¿Cuánto suma el grupo mayor?',
      datos: [D_TOTAL, D_SEGUIDOS, 'Si una suma es el doble de otra, juntas son 3 veces la menor.'],
      figura: bandeja([{ cartas: cartas(rango(1, 11)) }]),
      alternativas: ['44', '33', '22', '66'], correcta: '44',
      solucion: [{ texto: 'Los dos grupos juntos suman el total, y como el mayor vale dos veces el menor, el total es 3 veces el menor.', ecuacion: [T, ' = (1 + 11) × 11 ÷ 2 = 66', SEP, '66 ÷ 3 = 22'] },
        { texto: 'El mayor es el doble del menor; se arma, por ejemplo, poniendo 1 + 10 + 11 = 22 en el grupo menor.', ecuacion: ['2 × 22 = ', F('44')] }],
      explica: '33 es la mitad, como si los grupos fueran iguales; 22 es el grupo menor, y 66 es el total.',
      respuesta: [F('44')] }),
  ];
  reparto.ejemplos = EJEMPLOS_REP;
  juntar('reparto-parejo', EJEMPLOS_REP, ['grupos|1,2,3,5,6,7|2', 'puede|2,4,6,8,10']);
  // ---------- Idea 2: lo compartido cuenta dos veces ----------
  // Objeto de la primera pantalla: la bandeja en cruz (rm-casillas, escena «cruz»). Cambia: desde qué número van las cinco
  // tarjetas y cuál va al centro. · Permanece: una fila y una columna de tres que comparten el centro. · Progresa: lo que
  // suman la fila y la columna. · Se reserva: el marco triangular (Predice). · Debe verse: el centro está en las dos.
  const permutar = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((v, i) => permutar(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [v].concat(p))));
  // Un polígono de L lados con una tarjeta en cada esquina y una en medio de cada lado: con esas esquinas, ¿se arma?
  // Devuelve { S, v (esquinas en orden), m (el medio del lado k va entre v[k] y v[k + 1]) } o null. Las del medio
  // quedan obligadas (m = S − esquina − esquina): basta probar el orden de las esquinas.
  function armaPol(nums, esq, L) {
    const Tn = suma(nums), Vn = suma(esq);
    if ((Tn + Vn) % L) return null;
    const Sn = (Tn + Vn) / L, resto = nums.filter(q => !esq.includes(q)).slice().sort((p, q) => p - q);
    for (const v of permutar(esq.slice())) {
      const m = v.map((a, k) => Sn - a - v[(k + 1) % L]);
      if (m.slice().sort((p, q) => p - q).join() === resto.join()) return { S: Sn, v, m };
    }
    return null;
  }
  const subconjuntos = (xs, k) => (k === 0 ? [[]] : xs.length < k ? [] : subconjuntos(xs.slice(1), k - 1).map(s => [xs[0]].concat(s)).concat(subconjuntos(xs.slice(1), k)));
  // Las esquinas van siempre con el papel de lo compartido (turquesa), también cuando son «?»: así se distinguen de las del
  // medio aunque el marco esté vacío (el pentágono se leía como un óvalo de diez casillas; lector en frío, 26 nov).
  const esqComp = es => es.map(e => (e && !e.papel && !e.hueco ? Object.assign({ papel: 'compartida' }, e) : e));
  const marco = (L, esq, med, sumas, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'marco', lados: L, esquinas: esqComp(esq), medios: med, sumas }, o), estado: {} });
  const qs = k => Array.from({ length: k }, () => ({ t: '?' }));
  const comp = xs => xs.map(v => ({ t: f0(v), papel: 'compartida' }));
  const NOMBRE_POL = { 3: 'triangular', 4: 'cuadrado', 5: 'con forma de pentágono' };
  // La cruz del juego: cinco tarjetas desde a; el centro c. Las otras cuatro van en dos parejas de igual suma si se puede.
  function cruzJ2(v) {
    const nums = rango(v.a, v.a + 4), cc = v.c;
    if (!nums.includes(cc)) return { nums, ok: false };
    const r = nums.filter(q => q !== cc), pares = [[[r[0], r[3]], [r[1], r[2]]], [[r[0], r[2]], [r[1], r[3]]], [[r[0], r[1]], [r[2], r[3]]]];
    const par = pares.find(p => suma(p[0]) === suma(p[1])) || pares[0];
    return { nums, ok: true, c: cc, fila: [par[0][0], cc, par[0][1]], col: [par[1][0], cc, par[1][1]] };
  }
  function dibujoJ2(v) {
    const z = cruzJ2(v), meta = `Tarjetas del ${f0(z.nums[0])} al ${f0(z.nums[4])}`;
    if (!z.ok) return { datos: { escena: 'cruz', meta, centro: { hueco: true }, izq: { hueco: true }, der: { hueco: true }, arriba: { hueco: true }, abajo: { hueco: true }, fila: { t: '' }, columna: { t: '' } }, estado: {} };
    return { datos: { escena: 'cruz', meta, centro: { t: f0(z.c), papel: 'compartida' }, izq: f0(z.fila[0]), der: f0(z.fila[2]), arriba: f0(z.col[0]), abajo: f0(z.col[2]),
      fila: { t: f0(suma(z.fila)) }, columna: { t: f0(suma(z.col)) } }, estado: {} };
  }
  function lecturaJ2(v) {
    const z = cruzJ2(v);
    if (!z.ok) return ['El centro tiene que ser una de las cinco tarjetas'];
    const f = suma(z.fila), k = suma(z.col);
    if (f === k) return [`Fila ${f0(f)} y columna ${f0(k)}; `, C, ` = ${f0(z.c)} está en las dos`];
    return [`Fila ${f0(f)} y columna ${f0(k)}: no se igualan; `, C, ` = ${f0(z.c)}`];
  }
  const P2_ESQ = [1, 3, 5], P2 = armaPol(rango(1, 6), P2_ESQ, 3);
  if (!P2 || P2.S !== 10) throw new Error('predicción de la idea 2: con esquinas 1, 3 y 5, cada lado suma 10');
  const D_LINEAS = 'Al sumar todas las líneas, cada número entra una vez por cada línea que lo tiene.';
  const D_LADO = 'Cada lado tiene sus dos esquinas y la tarjeta del medio.';
  const D_CRUZ = 'La fila y la columna comparten la tarjeta del centro.';
  // Casos de «Ahora tú» de la idea 2 (semilla % 3): 0 la suma por lado · 1 la suma de las esquinas · 2 la cruz.
  function casoPol(r, o) {
    for (let i = 0; i < 600; i++) {
      const L = r.elegir(o.lados), d = r.elegir(o.pasos), a = r.ent(o.desde[0], o.desde[1]), nums = rango(a, a + d * (2 * L - 1), d);
      const posibles = subconjuntos(nums, L).map(e => armaPol(nums, e, L)).filter(Boolean);
      if (!posibles.length) continue;
      const A = r.elegir(posibles), clave = `${o.tipo}|${nums.join(',')}|${o.tipo === 'lado' ? A.v.slice().sort((p, q) => p - q).join(',') : A.S}`;
      if (usado('vertices-dos-veces', clave)) continue;
      return { L, d, nums, T: suma(nums), A, V: suma(A.v) };
    }
    throw new Error('casoPol');
  }
  function casoCruz(r, o) {
    for (let i = 0; i < 600; i++) {
      const d = r.elegir(o.pasos), a = r.ent(o.desde[0], o.desde[1]), nums = rango(a, a + 4 * d, d), cc = r.elegir(nums);
      const rest = nums.filter(q => q !== cc), Tn = suma(nums);
      if ((Tn + cc) % 2) continue;
      const Sn = (Tn + cc) / 2, par = subconjuntos(rest, 2).find(p => suma(p) + cc === Sn);
      if (!par || usado('vertices-dos-veces', `cruz|${nums.join(',')}|${cc}`)) continue;
      return { d, nums, c: cc, T: Tn, S: Sn, fila: par, col: rest.filter(q => !par.includes(q)) };
    }
    throw new Error('casoCruz');
  }
  const dibCruz = (z, conC, conS) => ({ pieza: PZ, datos: { escena: 'cruz', meta: `Tarjetas ${deA(z.nums, z.d)}`, centro: conC ? { t: f0(z.c), papel: 'compartida' } : { t: '?' },
    izq: { t: '?' }, der: { t: '?' }, arriba: { t: '?' }, abajo: { t: '?' }, fila: { t: conS ? f0(z.S) : '?' }, columna: { t: conS ? f0(z.S) : '?' } }, estado: {} });
  const dibCruzLlena = z => ({ pieza: PZ, datos: { escena: 'cruz', meta: `Tarjetas ${deA(z.nums, z.d)}`, centro: { t: f0(z.c), papel: 'compartida' },
    izq: f0(z.fila[0]), der: f0(z.fila[1]), arriba: f0(z.col[0]), abajo: f0(z.col[1]), fila: { t: f0(z.S), papel: 'seguro' }, columna: { t: f0(z.S), papel: 'seguro' } }, estado: {} });
  const poligono = {
    id: 'vertices-dos-veces',
    titulo: 'Lo compartido cuenta dos veces',
    pregunta: '¿Por qué sumar los lados no da la suma de los números?',
    temas: ['Arreglos en polígonos'],
    pieza: PZ,
    aprendizaje: 'Al sumar todas las líneas, una tarjeta compartida entra una vez por cada línea que la tiene: juntas suman el total más lo compartido.',
    actividad: 'Elegir la tarjeta del centro de una cruz hasta que fila y columna sumen 12.',
    // Lee: la cruz, la casilla compartida y su letra c, y qué mirar. No dice cuánto suma cada lado del triángulo (Predice).
    lee: {
      tarjetas: [
        { titulo: 'La bandeja en cruz', texto: 'En otro reto de la kermés, cinco tarjetas van en una cruz. La fila tiene tres y la columna también, pero solo hay cinco tarjetas, porque la del centro está en las dos.',
          pieza: PZ, dibujo: { pieza: PZ, datos: { escena: 'cruz', centro: { t: '' }, izq: { t: '' }, der: { t: '' }, arriba: { t: '' }, abajo: { t: '' } }, estado: {} } },
        { titulo: 'Una casilla compartida', texto: ['Una casilla compartida está en dos líneas a la vez. Al número del centro de la cruz lo llamamos ', C, '. En un marco, cada esquina está en dos lados, y lo que suman las esquinas se llama ', V, ', de «vértices».'] },
        { titulo: 'Qué mirar al jugar', texto: 'Tú eliges desde qué número van las tarjetas y cuál va al centro, y las otras cuatro se acomodan solas. Compara lo que suman la fila y la columna con lo que suman las cinco.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Cinco tarjetas seguidas van en la cruz: una fila de tres y una columna de tres, con el centro en las dos.',
      mision: {
        texto: 'Haz que la fila y la columna sumen 12 cada una.',
        logrado: v => { const z = cruzJ2(v); return z.ok && suma(z.fila) === 12 && suma(z.col) === 12; },
        bien: ['La fila y la columna suman 12, y el centro se contó en las dos.'],
      },
      voz: 'Mira el centro: ¿en cuántas líneas está?',
      leyenda: [
        { s: C, t: 'la tarjeta del centro, compartida' },
        { s: 'fila, columna', t: 'lo que suma cada una' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Primera tarjeta', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c', etiqueta: 'Centro', min: 1, max: 7, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => dibujoJ2(v),
      lectura: v => lecturaJ2(v),
      minimo: 4,
    },
    predice: {
      pregunta: 'En el marco triangular van las tarjetas del 1 al 6, una por casilla. Las esquinas son 1, 3 y 5, y los tres lados suman lo mismo. ¿Cuánto suma cada lado?',
      datos: ['1 + 2 + 3 + 4 + 5 + 6 = 21', 'Cada lado tiene sus dos esquinas y la tarjeta del medio.'],
      voz: 'Piensa en qué lados está cada esquina.',
      opciones: [
        { id: 'siete', texto: '7', error: 'RMP1', siFuera: 'Repartir 21 entre los 3 lados valdría si nada se repitiera, pero cada esquina está en dos lados y entra dos veces.' },
        { id: 'once', texto: '11', error: 'RMP182', siFuera: 'Es cierto que algo entra dos veces, pero son las esquinas, no las tarjetas del medio: contar dos veces 2, 4 y 6 da (21 + 12) ÷ 3 = 11.' },
        { id: 'nueve', texto: '9', error: 'RMP183', siFuera: 'Mirar las esquinas es la idea, pero 1 + 3 + 5 = 9 es lo que suman ellas, no lo que suma un lado.' },
        { id: 'c', texto: '10', correcta: true },
      ],
      dibujo: marco(3, cartas(P2_ESQ), qs(3), qs(3)),
      revelar: marco(3, comp(P2.v), cartas(P2.m), P2.v.map(() => ({ t: f0(P2.S), papel: 'seguro' }))),
      coincide: 'Coincide: los tres lados juntos suman 21 + 9 = 30, y cada uno suma 10.',
      noCoincide: 'Revisemos: cada esquina está en dos lados.',
    },
    mira: {
      pieza: PZ,
      datos: Object.assign(marco(3, comp(P2.v), cartas(P2.m), P2.v.map(() => ({ t: f0(P2.S), desde: 3 }))).datos,
        { nota: [{ t: 'Del 1 al 6: total 21', papel: 'total' }, { t: 'Esquinas: 1 + 3 + 5 = 9', desde: 1 }] }),
      voz: 'Cada esquina, en dos lados.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Cada lado tiene dos esquinas y la tarjeta del medio.' },
        { estado: { corte: 1 }, texto: 'Al sumar los tres lados, cada esquina entra dos veces.', ecuacion: ['3 × ', S, ' = ', T, ' + ', V] },
        { estado: { corte: 2 }, texto: 'Entran las seis tarjetas una vez y, además, las esquinas otra vez.', ecuacion: ['3 × ', S, ' = 21 + 9 = 30'] },
        { estado: { corte: 3 }, texto: 'Los tres lados se reparten esos 30, así que cada lado suma 10.', ecuacion: [S, ' = 30 ÷ 3 = 10'] },
        { estado: { corte: 3 }, texto: 'En la cruz pasa lo mismo, porque el centro está en la fila y en la columna.', ecuacion: ['2 × ', S, ' = ', T, ' + ', C] },
      ],
    },
    regla: {
      texto: 'Al sumar todas las líneas, cada número entra una vez por cada línea que lo tiene, así que lo compartido se cuenta de más: las esquinas del marco o el centro de la cruz.',
      ecuacion: ['lados × ', S, ' = ', T, ' + ', { llave: [V], nota: 'las esquinas', color: 'c-i' }, SEP, '2 × ', S, ' = ', T, ' + ', { llave: [C], nota: 'el centro', color: 'c-i' }],
      condicion: 'cada número va una sola vez, cada esquina está en dos lados y todas las líneas suman lo mismo.',
      voz: 'Lo compartido, una vez por cada línea.',
    },
    ejemplos: null,
    // Así se resuelve: los mismos tres tipos con otras listas (impares o desde más arriba). «Ahora tú» usa otras.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo < 2) {
          const z = casoPol(r, { tipo: tipo ? 'esquinas' : 'lado', lados: [3, 4], pasos: [2], desde: [1, 9] }), L = z.L, LS = L * z.A.S;
          const base = { datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], dibujo: marco(L, tipo ? qs(L) : cartas(z.A.v), qs(L), tipo ? z.A.v.map(() => ({ t: f0(z.A.S) })) : qs(L)) };
          const pasos = [
            { tipo: 'pide', texto: tipo ? 'Piden lo que suman las esquinas.' : 'Piden la suma común de cada lado.' },
            { tipo: 'datos', texto: `Son ${f0(2 * L)} tarjetas, ${deA(z.nums, z.d)}, y su total sale con la fórmula de los números seguidos.`, ecuacion: [T, ` = (${f0(z.nums[0])} + ${f0(z.nums[z.nums.length - 1])}) × ${f0(2 * L)} ÷ 2 = ${f0(z.T)}`] },
            { tipo: 'regla', texto: `Al sumar los ${f0(L)} lados, cada tarjeta entra una vez y cada esquina entra otra vez más, porque está en dos lados.` },
          ];
          if (tipo) {
            pasos.push({ tipo: 'cuentas', texto: `Los ${f0(L)} lados juntos suman ${f0(L)} × ${f0(z.A.S)}; si les quito el total, queda lo que se contó dos veces: las esquinas.`, ecuacion: [`${f0(L)} × ${f0(z.A.S)} = ${f0(LS)}`, SEP, V, ` = ${f0(LS)} − ${f0(z.T)} = `, I(f0(z.V))],
              dibujo: marco(L, comp(z.A.v), cartas(z.A.m), z.A.v.map(() => ({ t: f0(z.A.S) }))) },
            { tipo: 'sentido', texto: `Hay un arreglo que lo cumple, con las esquinas ${listaTxt(z.A.v)}, que suman ${f0(z.V)}.` });
            return Object.assign(base, { enunciado: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla, y cada lado suma ${f0(z.A.S)}. ¿Cuánto suman las esquinas?`, pasos, respuesta: [V, ' = ', I(f0(z.V))] });
          }
          pasos.push({ tipo: 'cuentas', texto: `Las esquinas suman ${f0(z.V)}, y los ${f0(L)} lados juntos dan el total más las esquinas.`, ecuacion: [`${f0(L)} × `, S, ` = ${f0(z.T)} + ${f0(z.V)} = ${f0(z.T + z.V)}`, SEP, S, ` = `, F(f0(z.A.S))],
            dibujo: marco(L, comp(z.A.v), cartas(z.A.m), z.A.v.map(() => ({ t: f0(z.A.S), papel: 'seguro' }))) },
          { tipo: 'sentido', texto: `Se arma: por ejemplo, un lado es ${f0(z.A.v[0])} + ${f0(z.A.m[0])} + ${f0(z.A.v[1])} = ${f0(z.A.S)}.` });
          return Object.assign(base, { enunciado: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla. Las esquinas son ${listaTxt(z.A.v)} y los lados suman lo mismo. ¿Cuánto suma cada lado?`, pasos, respuesta: [S, ' = ', F(f0(z.A.S))] });
        }
        const z = casoCruz(r, { pasos: [2], desde: [1, 9] });
        return {
          enunciado: `Las tarjetas ${deA(z.nums, z.d)} van en una cruz, con el ${f0(z.c)} en el centro. La fila y la columna suman lo mismo. ¿Cuánto suma cada una?`,
          datos: [D_TOTAL, D_CRUZ, D_LINEAS], dibujo: dibCruz(z, true, false),
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que suma la fila, que es lo mismo que suma la columna.' },
            { tipo: 'datos', texto: 'Sumo las cinco tarjetas.', ecuacion: [T, ` = ${z.nums.map(f0).join(' + ')} = ${f0(z.T)}`] },
            { tipo: 'regla', texto: 'Al sumar la fila y la columna, cada tarjeta entra una vez y el centro entra dos veces.' },
            { tipo: 'cuentas', texto: 'Fila más columna da el total más el centro otra vez.', ecuacion: ['2 × ', S, ` = ${f0(z.T)} + ${f0(z.c)} = ${f0(z.T + z.c)}`, SEP, S, ' = ', F(f0(z.S))], dibujo: dibCruzLlena(z) },
            { tipo: 'sentido', texto: `Se arma con la fila ${f0(z.fila[0])} + ${f0(z.c)} + ${f0(z.fila[1])} y la columna ${f0(z.col[0])} + ${f0(z.c)} + ${f0(z.col[1])}, que suman ${f0(z.S)} cada una.` },
          ],
          respuesta: [S, ' = ', F(f0(z.S))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la suma por lado · 1 las esquinas · 2 la cruz (S con c, o c con S).
    ahoraTu: {
      pieza: PZ,
      voz: 'Primero: ¿qué tarjetas están en dos líneas?',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const z = casoPol(r, { tipo: 'lado', lados: [3, 3, 4, 5], pasos: [1, 1, 2], desde: [1, 8] }), L = z.L, Sb = z.A.S;
          const ds = [
            { id: 'una', valor: z.T / L, error: 'RMP1', siFuera: `Repartir ${f0(z.T)} entre ${f0(L)} lados valdría si nada se repitiera, pero cada esquina está en dos lados.` },
            { id: 'medios', valor: (2 * z.T - z.V) / L, error: 'RMP182', siFuera: 'Es cierto que algo entra dos veces, pero son las esquinas, no las tarjetas del medio.' },
            { id: 'esq', valor: z.V, error: 'RMP183', siFuera: `Sumar las esquinas sirve, pero dan ${f0(z.V)}, que no es lo que suma un lado.` },
            { id: 'juntos', valor: L * Sb, error: 'RMP61', siFuera: `La cuenta va bien: ${f0(L * Sb)} es lo de los ${f0(L)} lados juntos, pero falta dividir entre ${f0(L)}.` },
          ];
          return { pregunta: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla. Las esquinas son ${listaTxt(z.A.v)} y los lados suman lo mismo. ¿Cuánto suma cada lado?`,
            datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], dibujo: marco(L, cartas(z.A.v), qs(L), qs(L)),
            opciones: opcionesNum(Sb, ds),
            solucion: { texto: `Los ${f0(L)} lados juntos suman el total más las esquinas otra vez, y cada lado se lleva la misma parte.`, ecuacion: [`${f0(L)} × `, S, ` = ${f0(z.T)} + ${f0(z.V)}`, SEP, S, ' = ', F(f0(Sb))] } };
        }
        if (tipo === 1) {
          const z = casoPol(r, { tipo: 'esquinas', lados: [3, 4, 4, 5], pasos: [1, 2], desde: [1, 8] }), L = z.L, LS = L * z.A.S;
          const ds = [
            { id: 'medios', valor: z.T - z.V, error: 'RMP182', siFuera: `Separar lo que se repite es la idea, pero ${f0(z.T - z.V)} es lo que suman las tarjetas del medio.` },
            { id: 'juntos', valor: LS, error: 'RMP61', siFuera: `${f0(LS)} es lo de los ${f0(L)} lados juntos, y esa cuenta va bien, pero falta quitarle el total.` },
            { id: 'lado', valor: z.A.S, error: 'RMP61', siFuera: `Usar la suma por lado es la idea, pero ${f0(z.A.S)} es lo de un lado, no lo de las esquinas.` },
            { id: 'total', valor: z.T, error: 'RMP1', siFuera: `Sumaste bien las tarjetas, pero ${f0(z.T)} es el total, no lo que suman las esquinas.` },
          ];
          return { pregunta: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla, y cada lado suma ${f0(z.A.S)}. ¿Cuánto suman las esquinas?`,
            datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], dibujo: marco(L, qs(L), qs(L), z.A.v.map(() => ({ t: f0(z.A.S) }))),
            opciones: opcionesNum(z.V, ds),
            solucion: { texto: `Si a los ${f0(L)} lados juntos les quitas el total, queda lo que se contó de más: las esquinas.`, ecuacion: [V, ` = ${f0(L)} × ${f0(z.A.S)} − ${f0(z.T)} = `, I(f0(z.V))] } };
        }
        const z = casoCruz(r, { pasos: [1, 2], desde: [1, 12] }), pideC = Math.floor(s / 3) % 2 === 1;
        if (pideC) {
          const ds = [
            { id: 'doble', valor: 2 * z.S, error: 'RMP61', siFuera: `${f0(2 * z.S)} es fila más columna, y esa cuenta va bien, pero falta quitarle el total.` },
            { id: 'resta', valor: z.T - z.S, error: 'RMP1', siFuera: `Restar es la idea, pero la fila y la columna juntas suman ${f0(2 * z.S)}, no ${f0(z.S)}.` },
            { id: 'suma', valor: z.S, error: 'RMP183', siFuera: `Usar la suma es la idea, pero ${f0(z.S)} es lo que suma la fila, no el número del centro.` },
            { id: 'medio', valor: z.nums[2] === z.c ? null : z.nums[2], error: 'RMP186', siFuera: `Probar el número del medio de la lista es una idea, pero con ${f0(z.nums[2])} en el centro no suman ${f0(z.S)}.` },
          ];
          return { pregunta: `Las tarjetas ${deA(z.nums, z.d)} van en una cruz. La fila y la columna suman ${f0(z.S)} cada una. ¿Qué tarjeta va en el centro?`,
            datos: [D_TOTAL, D_CRUZ, D_LINEAS], dibujo: dibCruz(z, false, true),
            opciones: opcionesNum(z.c, ds),
            solucion: { texto: 'Fila más columna es el total más el centro otra vez.', ecuacion: [`2 × ${f0(z.S)} = ${f0(z.T)} + `, C, SEP, C, ` = ${f0(2 * z.S)} − ${f0(z.T)} = `, I(f0(z.c))] } };
        }
        const ds = [
          { id: 'mitad', valor: z.T / 2, error: 'RMP1', siFuera: `Repartir el total es la idea, pero el centro, ${f0(z.c)}, está en la fila y en la columna.` },
          { id: 'tres', valor: (z.T + 2 * z.c) / 2, error: 'RMP182', siFuera: 'Es cierto que el centro entra de más, pero entra una vez más, no dos.' },
          { id: 'total', valor: z.T + z.c, error: 'RMP61', siFuera: `${f0(z.T + z.c)} es fila más columna, y esa cuenta va bien, pero falta repartirlo entre las dos.` },
          { id: 'centro', valor: z.c, error: 'RMP183', siFuera: 'Mirar el centro es la idea, pero piden lo que suma la fila, no el centro.' },
          { id: 'sinC', valor: z.S - z.c, error: 'RMP63', siFuera: 'Sumar las dos tarjetas de los lados es la idea, pero la fila también tiene el centro.' },
        ];
        return { pregunta: `Las tarjetas ${deA(z.nums, z.d)} van en una cruz, con el ${f0(z.c)} en el centro. La fila y la columna suman lo mismo. ¿Cuánto suma cada una?`,
          datos: [D_TOTAL, D_CRUZ, D_LINEAS], dibujo: dibCruz(z, true, false),
          opciones: opcionesNum(z.S, ds),
          solucion: { texto: 'Fila más columna es el total más el centro otra vez.', ecuacion: ['2 × ', S, ` = ${f0(z.T)} + ${f0(z.c)}`, SEP, S, ' = ', F(f0(z.S))] } };
      },
    },
  };
  // ---------- Ejemplos resueltos de «Lo compartido cuenta dos veces» ----------
  // Comprobados al cargar (armaPol arma cada polígono; la cruz y la estrella, tarjeta por tarjeta) y aparte en scratchpad
  // e9-rm/ej2.py, que prueba todos los órdenes: 1 → 12 · 2 → 9 · 3 → 10 · 4 → 13 · 5 → 8 · 6 → 12 · 7 → 14 · 8 → 4 ·
  // 9 → 20 · 10 → 12 · 11 → 19 (D) · 12 → 5 (A) · 13 → 28 (C) · 14 → 20 (B) · 15 → 4 (D).
  const chk2 = [[rango(1, 6), [4, 5, 6], 3, 12], [rango(1, 6), [1, 2, 3], 3, 9], [rango(1, 8), [1, 4, 5, 6], 4, 13], [rango(2, 7), [2, 4, 6], 3, 13],
    [rango(1, 10), [1, 2, 3, 4, 5], 5, 14], [rango(1, 8), [1, 4, 7, 8], 4, 14], [rango(1, 11, 2), [3, 7, 11], 3, 19], [rango(2, 20, 2), [2, 4, 6, 8, 10], 5, 28]];
  for (const [ns, e, L, Sx] of chk2) { const A = armaPol(ns, e, L); if (!A || A.S !== Sx) throw new Error(`ejemplos de la idea 2: ${ns}`); }
  const EST = (cc, pares) => pares.every(p => p[0] + p[1] + cc === pares[0][0] + pares[0][1] + cc);
  if (!EST(4, [[1, 7], [2, 6], [3, 5]]) || 1 + 4 + 7 !== 12 || 2 * 25 !== 45 + 5 || suma([1, 2, 8, 9]) !== 20) throw new Error('ejemplos de la idea 2: la estrella y la cruz');
  const pol = (L, ns, e) => armaPol(ns, e, L);
  const A21 = pol(3, rango(1, 6), [4, 5, 6]), A22 = pol(3, rango(1, 6), [1, 2, 3]), A24 = pol(4, rango(1, 8), [1, 4, 5, 6]), A27 = pol(5, rango(1, 10), [1, 2, 3, 4, 5]);
  const A2b = pol(3, rango(1, 11, 2), [3, 7, 11]), A2c = pol(5, rango(2, 20, 2), [2, 4, 6, 8, 10]);
  // La estrella de tres líneas: siete círculos, tres líneas de tres que pasan por el del centro (tablero 3 × 3 con huecos).
  const estrella = (cc, ext) => ({ pieza: PZ, datos: { escena: 'tablero', celdas: [[ext[0], null, ext[1]], [ext[2], cc, ext[3]], [ext[4], null, ext[5]]].map(f => f.map(q => (q === null ? null : q))),
    lineas: [{ tipo: 'fila', k: 1 }, { tipo: 'diagonal' }, { tipo: 'contra' }] }, estado: {} });
  const EJEMPLOS_POL = [
    ejemplo({ nivel: 1, titulo: 'Esquinas grandes', caso: 'lado|1,2,3,4,5,6|4,5,6',
      enunciado: 'En el marco triangular van las tarjetas del 1 al 6: una en cada esquina y una en medio de cada lado. Las esquinas son 4, 5 y 6. ¿Cuánto suma cada lado, si todos suman lo mismo?',
      datos: [D_TOTAL, D_LADO, D_LINEAS], figura: marco(3, cartas(A21.v), qs(3), qs(3)),
      solucion: [{ texto: 'Los tres lados juntos cuentan las seis tarjetas una vez y las esquinas otra vez.', ecuacion: [T, ' = 21', SEP, '3 × ', S, ' = 21 + 15 = 36', SEP, S, ' = ', F('12')] }],
      respuesta: [S, ' = ', F('12')] }),
    ejemplo({ nivel: 1, titulo: 'Esquinas chicas', caso: 'lado|1,2,3,4,5,6|1,2,3',
      enunciado: 'En el marco triangular van las tarjetas del 1 al 6, una por casilla. Las esquinas son 1, 2 y 3. ¿Cuánto suma cada lado, si todos suman lo mismo?',
      datos: [D_TOTAL, D_LADO, D_LINEAS], figura: marco(3, cartas(A22.v), qs(3), qs(3)),
      solucion: [{ texto: 'Las seis tarjetas suman 21, y las esquinas, que suman 6, entran otra vez.', ecuacion: ['3 × ', S, ' = 21 + 6 = 27', SEP, S, ' = ', F('9')] }],
      respuesta: [S, ' = ', F('9')] }),
    ejemplo({ nivel: 1, titulo: 'La cruz con el 5', caso: 'cruz|1,2,3,4,5|5',
      enunciado: 'Las tarjetas del 1 al 5 van en una cruz, con el 5 en el centro. La fila y la columna suman lo mismo. ¿Cuánto suma cada una?',
      datos: [D_TOTAL, D_CRUZ, D_LINEAS], figura: dibCruz({ nums: rango(1, 5), d: 1, c: 5 }, true, false),
      solucion: [{ texto: 'Fila más columna cuenta las cinco tarjetas una vez y el centro otra vez.', ecuacion: [T, ' = 15', SEP, '2 × ', S, ' = 15 + 5 = 20', SEP, S, ' = ', F('10')] }],
      respuesta: [S, ' = ', F('10')] }),
    ejemplo({ nivel: 1, titulo: 'El marco cuadrado', caso: 'lado|1,2,3,4,5,6,7,8|1,4,5,6',
      enunciado: 'En un marco cuadrado van las tarjetas del 1 al 8: una en cada esquina y una en medio de cada lado. Las esquinas son 1, 4, 5 y 6. ¿Cuánto suma cada lado, si todos suman lo mismo?',
      datos: [D_TOTAL, D_LADO, D_LINEAS], figura: marco(4, cartas(A24.v), qs(4), qs(4)),
      solucion: [{ texto: 'Los cuatro lados juntos cuentan las ocho tarjetas una vez y las esquinas otra vez.', ecuacion: [T, ' = 36', SEP, '4 × ', S, ' = 36 + 16 = 52', SEP, S, ' = ', F('13')] }],
      respuesta: [S, ' = ', F('13')] }),
    ejemplo({ nivel: 1, titulo: 'La cruz con el 1', caso: 'cruz|1,2,3,4,5|1',
      enunciado: 'Las tarjetas del 1 al 5 van en una cruz, con el 1 en el centro. La fila y la columna suman lo mismo. ¿Cuánto suma cada una?',
      datos: [D_TOTAL, D_CRUZ, D_LINEAS], figura: dibCruz({ nums: rango(1, 5), d: 1, c: 1 }, true, false),
      solucion: [{ texto: 'Fila más columna cuenta las cinco tarjetas una vez y el centro, 1, otra vez.', ecuacion: [T, ' = 15', SEP, '2 × ', S, ' = 15 + 1 = 16', SEP, S, ' = ', F('8')] }],
      respuesta: [S, ' = ', F('8')] }),
    ejemplo({ nivel: 2, titulo: 'Las esquinas, al revés', caso: 'esquinas|2,3,4,5,6,7|13',
      enunciado: 'En el marco triangular van las tarjetas del 2 al 7. Cada lado suma 13. ¿Cuánto suman las tres esquinas?',
      datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], figura: marco(3, qs(3), qs(3), [13, 13, 13].map(v => ({ t: f0(v) }))),
      solucion: [{ texto: 'Los tres lados juntos dan 39, que es el total más las esquinas otra vez.', ecuacion: [T, ' = (2 + 7) × 6 ÷ 2 = 27', SEP, '3 × 13 = 39'] },
        { texto: 'Lo que sobra al quitar el total son las esquinas; por ejemplo, 2, 4 y 6.', ecuacion: [V, ' = 39 − 27 = ', I('12')] }],
      respuesta: [V, ' = ', I('12')] }),
    ejemplo({ nivel: 2, titulo: 'El pentágono', caso: 'lado|1,2,3,4,5,6,7,8,9,10|1,2,3,4,5',
      enunciado: 'En un marco con forma de pentágono van las tarjetas del 1 al 10: una en cada esquina y una en medio de cada lado. Las esquinas son 1, 2, 3, 4 y 5. ¿Cuánto suma cada lado?',
      datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], figura: marco(5, cartas(A27.v), qs(5), qs(5)),
      solucion: [{ texto: 'Primero sumo las diez tarjetas y, aparte, las esquinas.', ecuacion: [T, ' = (1 + 10) × 10 ÷ 2 = 55', SEP, V, ' = 15'] },
        { texto: 'Los cinco lados juntos cuentan el total y las esquinas otra vez.', ecuacion: ['5 × ', S, ' = 55 + 15 = 70', SEP, S, ' = ', F('14')] }],
      respuesta: [S, ' = ', F('14')] }),
    ejemplo({ nivel: 2, titulo: 'El centro de la cruz', caso: 'cruzC|2,3,4,5,6|12',
      enunciado: 'Las tarjetas del 2 al 6 van en una cruz. La fila y la columna suman 12 cada una. ¿Qué tarjeta va en el centro?',
      datos: [D_TOTAL, D_CRUZ, D_LINEAS], figura: dibCruz({ nums: rango(2, 6), d: 1, c: 4, S: 12 }, false, true),
      solucion: [{ texto: 'Fila más columna suman 24, y las cinco tarjetas suman 20.', ecuacion: ['2 × 12 = 24', SEP, T, ' = 20'] },
        { texto: 'Lo que sobra es el centro, que se contó dos veces.', ecuacion: [C, ' = 24 − 20 = ', I('4')] }],
      respuesta: [C, ' = ', I('4')] }),
    ejemplo({ nivel: 2, titulo: 'Esquinas del cuadrado', caso: 'esquinas|1,2,3,4,5,6,7,8|14',
      enunciado: 'En un marco cuadrado van las tarjetas del 1 al 8: una en cada esquina y una en medio de cada lado. Cada lado suma 14. ¿Cuánto suman las cuatro esquinas?',
      datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], figura: marco(4, qs(4), qs(4), [14, 14, 14, 14].map(v => ({ t: f0(v) }))),
      solucion: [{ texto: 'Los cuatro lados juntos suman 56, y las ocho tarjetas suman 36.', ecuacion: ['4 × 14 = 56', SEP, T, ' = 36'] },
        { texto: 'Lo que sobra es lo que se contó dos veces, las esquinas; por ejemplo, 1, 4, 7 y 8.', ecuacion: [V, ' = 56 − 36 = ', I('20')] }],
      respuesta: [V, ' = ', I('20')] }),
    ejemplo({ nivel: 2, titulo: 'Tres líneas por el centro', caso: 'estrella|1-7|4',
      enunciado: 'Siete tarjetas, del 1 al 7, van en tres líneas de tres que se cruzan en la tarjeta del centro, que es el 4. Las tres líneas suman lo mismo. ¿Cuánto suma cada una?',
      datos: [D_TOTAL, D_LINEAS], figura: estrella({ t: '4', papel: 'compartida' }, qs(6)),
      solucion: [{ texto: 'El centro está en las tres líneas: entra dos veces de más.', ecuacion: ['3 × ', S, ' = 28 + 2 × 4 = 36', SEP, S, ' = ', F('12')] },
        { texto: 'Se arma con 1 + 4 + 7, 2 + 4 + 6 y 3 + 4 + 5.' }],
      respuesta: [S, ' = ', F('12')] }),
    // Nivel 3 (tipo examen). Letras de la correcta: D, A, C, B, D.
    ejemplo({ nivel: 3, titulo: 'Impares en el triángulo', caso: 'lado|1,3,5,7,9,11|3,7,11',
      enunciado: 'En el marco triangular van los impares del 1 al 11, uno por casilla. Las esquinas suman 21 y los tres lados suman lo mismo. ¿Cuánto suma cada lado?',
      datos: [D_TOTAL, D_LADO, D_LINEAS], figura: marco(3, qs(3), qs(3), qs(3)),
      alternativas: ['17', '12', '21', '19', '57'], correcta: '19',
      solucion: [{ texto: 'Los seis impares suman 36, y las esquinas, que suman 21, entran otra vez.', ecuacion: ['3 × ', S, ' = 36 + 21 = 57', SEP, S, ' = ', F('19')] }],
      explica: '17 cuenta dos veces las del medio; 12 reparte 36 sin las esquinas; 21 es lo de las esquinas, y 57 son los tres lados juntos.',
      respuesta: [F('19')] }),
    ejemplo({ nivel: 3, titulo: 'La cruz de nueve', caso: 'cruz9|1-9|25',
      enunciado: 'Las tarjetas del 1 al 9 van en una cruz: una fila de cinco y una columna de cinco que comparten la del centro. Fila y columna suman 25 cada una. ¿Qué tarjeta va al centro?',
      datos: [D_TOTAL, D_CRUZ, D_LINEAS, D_SEGUIDOS], figura: { pieza: PZ, datos: { escena: 'tablero', celdas: [[null, null, '?', null, null], [null, null, '?', null, null], ['?', '?', '?', '?', '?'], [null, null, '?', null, null], [null, null, '?', null, null]] }, estado: {} },
      alternativas: ['5', '25', '20', '9', '45'], correcta: '5',
      solucion: [{ texto: 'Fila más columna suman 50, y las nueve tarjetas suman 45.', ecuacion: ['2 × 25 = 50', SEP, T, ' = 45'] },
        { texto: 'El centro es lo que se contó dos veces; se arma, por ejemplo, con 1, 2, 8 y 9 en la fila.', ecuacion: [C, ' = 50 − 45 = ', I('5')] }],
      explica: '25 es la suma de una línea; 20 resta 25 del total; 9 pone el mayor al centro, y 45 es el total.',
      respuesta: [C, ' = ', I('5')] }),
    ejemplo({ nivel: 3, titulo: 'Pares en el pentágono', caso: 'lado|2,4,6,8,10,12,14,16,18,20|2,4,6,8,10',
      enunciado: 'En un marco con forma de pentágono van los pares del 2 al 20: uno en cada esquina y uno en medio de cada lado. Las esquinas son 2, 4, 6, 8 y 10. ¿Cuánto suma cada lado?',
      datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], figura: marco(5, cartas(A2c.v), qs(5), qs(5)),
      alternativas: ['22', '38', '28', '30', '140'], correcta: '28',
      solucion: [{ texto: 'Primero sumo los diez pares y, aparte, las esquinas.', ecuacion: [T, ' = (2 + 20) × 10 ÷ 2 = 110', SEP, V, ' = 30'] },
        { texto: 'Los cinco lados juntos cuentan el total y las esquinas otra vez.', ecuacion: ['5 × ', S, ' = 110 + 30 = 140', SEP, S, ' = ', F('28')] }],
      explica: '22 reparte 110 sin las esquinas; 38 cuenta dos veces las del medio; 30 es lo de las esquinas, y 140 son los cinco lados juntos.',
      respuesta: [F('28')] }),
    ejemplo({ nivel: 3, titulo: 'Las que no son esquina', caso: 'medios|1-8|13',
      enunciado: 'En un marco cuadrado van las tarjetas del 1 al 8: una en cada esquina y una en medio de cada lado. Cada lado suma 13. ¿Cuánto suman las cuatro tarjetas que no están en las esquinas?',
      datos: [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS], figura: marco(4, qs(4), qs(4), [13, 13, 13, 13].map(v => ({ t: f0(v) }))),
      alternativas: ['16', '20', '52', '13', '36'], correcta: '20',
      solucion: [{ texto: ['Primero las esquinas, que suman ', V, ': es lo que los cuatro lados juntos cuentan de más sobre el total de las ocho tarjetas.'], ecuacion: [T, ' = 36', SEP, '4 × 13 = 52', SEP, V, ' = 52 − 36 = 16'] },
        { texto: 'Las otras cuatro son el total menos las esquinas.', ecuacion: ['36 − 16 = ', F('20')] }],
      explica: '16 es lo de las esquinas; 52 son los cuatro lados juntos; 13 es un lado, y 36 es el total.',
      respuesta: [F('20')] }),
    ejemplo({ nivel: 3, titulo: 'El centro de la estrella', caso: 'estrellaC|1-7|12',
      enunciado: 'Las tarjetas del 1 al 7 van en tres líneas de tres que se cruzan en la tarjeta del centro. Cada línea suma 12. ¿Qué tarjeta va al centro?',
      datos: [D_TOTAL, D_LINEAS], figura: estrella({ t: '?' }, qs(6)),
      alternativas: ['8', '12', '28', '4'], correcta: '4',
      solucion: [{ texto: 'Las tres líneas juntas suman 36, y las siete tarjetas suman 28.', ecuacion: ['3 × 12 = 36', SEP, T, ' = 28'] },
        { texto: 'El centro está en las tres líneas: entra dos veces de más.', ecuacion: ['36 − 28 = 8 = 2 × ', C, SEP, C, ' = ', I('4')] }],
      explica: '8 cuenta el centro una sola vez de más; 12 es una línea, y 28 es el total.',
      respuesta: [C, ' = ', I('4')] }),
  ];
  poligono.ejemplos = EJEMPLOS_POL;
  juntar('vertices-dos-veces', EJEMPLOS_POL, ['cruz|2,3,4,5,6|4', 'lado|1,2,3,4,5,6|1,3,5']);
  // ---------- Idea 3: la mayor suma tiene que armarse ----------
  // Objeto de la primera pantalla: el marco triangular (rm-casillas, escena «marco»). Cambia: las tres esquinas.
  // · Permanece: las tarjetas del 1 al 6. · Progresa: la suma por lado y si se arma. · Se reserva: el marco cuadrado con
  // 1 a 8, donde la cuenta con las mayores no da entera (Predice). · Debe verse: una cuenta entera que no se arma.
  // Con las esquinas en el orden dado (el triángulo: cualquier orden de las esquinas es el mismo arreglo girado).
  function armaFijo(nums, v, L) {
    const Tn = suma(nums), Vn = suma(v);
    if (new Set(v).size < L || v.some(q => !nums.includes(q)) || (Tn + Vn) % L) return null;
    const Sn = (Tn + Vn) / L, m = v.map((a, k) => Sn - a - v[(k + 1) % L]), resto = nums.filter(q => !v.includes(q)).sort((p, q) => p - q);
    return m.slice().sort((p, q) => p - q).join() === resto.join() ? { S: Sn, v, m } : null;
  }
  // Todas las sumas por lado que se arman (búsqueda completa) y las cotas de la cuenta (esquinas mayores o menores).
  function extremos(nums, L) {
    const arm = subconjuntos(nums, L).map(e => armaPol(nums, e, L)).filter(Boolean), Ss = [...new Set(arm.map(A => A.S))].sort((p, q) => p - q);
    const o = nums.slice().sort((p, q) => p - q), Tn = suma(nums);
    return { Ss, arm, max: Ss[Ss.length - 1], min: Ss[0], cotaMax: (Tn + suma(o.slice(-L))) / L, cotaMin: (Tn + suma(o.slice(0, L))) / L, T: Tn,
      de: Sx => arm.find(A => A.S === Sx) };
  }
  const J3 = rango(1, 6);
  const esqJ3 = v => [v.e0, v.e1, v.e2];
  function dibujoJ3(v) {
    const e = esqJ3(v), A = armaFijo(J3, e, 3);
    return { datos: { escena: 'marco', lados: 3, meta: 'Tarjetas del 1 al 6', esquinas: comp(e), medios: A ? cartas(A.m) : huecos(3), sumas: A ? e.map(() => ({ t: f0(A.S) })) : [{ t: '' }, { t: '' }, { t: '' }] }, estado: {} };
  }
  function lecturaJ3(v) {
    const e = esqJ3(v), Ve = suma(e);
    if (new Set(e).size < 3) return ['Las esquinas se repiten: cada tarjeta va una vez'];
    if ((21 + Ve) % 3) return [V, ` = ${f0(Ve)}: (21 + ${f0(Ve)}) ÷ 3 no da entero`];
    const A = armaFijo(J3, e, 3);
    return A ? [V, ` = ${f0(Ve)}: cada lado suma `, S, ` = ${f0(A.S)}`] : [V, ` = ${f0(Ve)}: daría `, S, ` = ${f0((21 + Ve) / 3)}, pero no se arma`];
  }
  const EX8 = extremos(rango(1, 8), 4), A_P3 = EX8.de(EX8.max);
  if (EX8.max !== 15 || EX8.cotaMax !== 15.5 || armaPol(rango(1, 8), [4, 5, 7, 8], 4) || suma(A_P3.v) !== 24) throw new Error('predicción de la idea 3: el cuadrado con 1 a 8 llega a 15');
  if (!subconjuntos(J3, 3).some(e => (21 + suma(e)) / 3 === 11 && !armaPol(J3, e, 3))) throw new Error('juego de la idea 3: hay esquinas que dan 11 y no se arman');
  const D_COTA = 'Cada lado suma (total + esquinas) ÷ el número de lados.';
  const D_ARMA = 'Una suma por lado vale si con esas esquinas las del medio salen de las tarjetas que quedan, sin repetir.';
  // Opciones con un valor que puede no ser entero (la cota): se escribe con coma.
  function opcionesDec(correcta, ds, max = 4) {
    const vistos = new Set([correcta]), ops = [{ id: 'c', texto: f0(correcta), correcta: true }];
    for (const d of ds) {
      if (!d || !Number.isFinite(d.valor) || d.valor <= 0 || vistos.has(d.valor) || ops.length >= max) continue;
      vistos.add(d.valor); ops.push({ id: d.id, texto: Kit.formatear(d.valor, Number.isInteger(d.valor) ? 0 : 1), error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }
  // Por qué la cota no es la respuesta («Así se resuelve» de la idea 3; lector en frío, 26 nov): si no es entera; si las
  // tarjetas son todas pares o todas impares y la cota no tiene la paridad de tres de ellas; o, si no, porque ninguna
  // elección de esquinas deja las del medio entre las tarjetas que quedan. Luego, hacia dónde se prueba.
  function porQue(z, cota, quiere, menor) {
    if (cota === quiere) return 'Es entera y se arma.';
    const hacia = menor ? 'hacia arriba' : 'hacia abajo';
    if (!Number.isInteger(cota)) return `No es entera; se prueba ${hacia} y la primera que se arma es ${f0(quiere)}.`;
    const imp = z.nums.every(n => n % 2 === 1), par = z.nums.every(n => n % 2 === 0);
    if ((par && cota % 2 === 1) || (imp && cota % 2 === 0)) return `Es entera, pero tres ${par ? 'pares siempre suman par' : 'impares siempre suman impar'}; se prueba ${hacia} y la primera que se arma es ${f0(quiere)}.`;
    return `Es entera, pero con ninguna elección de esquinas salen las del medio; se prueba ${hacia} y la primera que se arma es ${f0(quiere)}.`;
  }
  function casoExt(r, o) {
    for (let i = 0; i < 300; i++) {
      const L = r.elegir(o.lados), d = r.elegir(o.pasos), a = r.ent(o.desde[0], o.desde[1]), nums = rango(a, a + d * (2 * L - 1), d), X = extremos(nums, L);
      if (!X.Ss.length || usado('mayor-suma', `${o.tipo}|${nums.join(',')}|${L}`)) continue;
      if (o.giro && X.cotaMax === X.max && X.cotaMin === X.min) continue;   // casos donde la cuenta no basta
      return Object.assign({ L, d, nums }, X);
    }
    throw new Error('casoExt');
  }
  const mayor = {
    id: 'mayor-suma',
    titulo: 'La mayor suma tiene que armarse',
    pregunta: '¿Cómo sabes que una suma es la mayor posible?',
    temas: ['Arreglos en polígonos'],
    pieza: PZ,
    aprendizaje: 'La suma mayor pone los números grandes en las esquinas y debe salir entera; si con esas esquinas no se arma, se prueba la siguiente.',
    actividad: 'Elegir las esquinas del marco triangular hasta que cada lado sume 11.',
    // Lee: el marco, la cota y qué mirar. No dice la mayor suma del marco cuadrado (Predice).
    lee: {
      tarjetas: [
        { titulo: 'El marco triangular', texto: 'En la kermés también hay un marco de madera con forma de triángulo, un polígono de tres lados. Lleva una tarjeta en cada esquina y otra a mitad de cada lado, y el reto pide que los tres lados sumen lo mismo.',
          pieza: PZ, dibujo: marco(3, huecos(3), huecos(3), []) },
        { titulo: 'Una cuenta no basta', texto: ['La cuenta de la idea anterior da la suma por lado a partir de lo que suman las esquinas, ', V, '. Una cota es un tope que la suma no puede pasar; cuando la cuenta da una cota, falta ver si las tarjetas la alcanzan.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Tú eliges las tres esquinas y las del medio se acomodan solas, si se puede. Fíjate en las veces que la cuenta da entera y aun así no se arma.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Las tarjetas del 1 al 6 van en el marco triangular. Elige las tres esquinas; las del medio se acomodan solas si se puede.',
      mision: {
        texto: 'Haz que cada lado sume 11.',
        logrado: v => { const A = armaFijo(J3, esqJ3(v), 3); return !!A && A.S === 11; },
        bien: ['Cada lado suma 11. Con otras esquinas la cuenta también daba 11, pero no se armaba.'],
      },
      voz: 'Que la cuenta dé entera no basta: mira si se arma.',
      leyenda: [
        { s: V, t: 'lo que suman las esquinas' },
        { s: S, t: 'lo que suma cada lado' },
      ],
      controles: ['Esquina de arriba', 'Esquina derecha', 'Esquina izquierda'].map((e, k) => ({ id: 'e' + k, etiqueta: e, min: 1, max: 6, paso: 1, inicio: [1, 3, 5][k], decimales: 0 })),
      dibujo: v => dibujoJ3(v),
      lectura: v => lecturaJ3(v),
      minimo: 4,
    },
    // La predicción que antes era de vertices-dos-veces (mismas opciones), ahora en su idea.
    predice: {
      pregunta: 'Ahora un marco cuadrado con las tarjetas del 1 al 8: una en cada esquina y una en medio de cada lado. ¿Cuál es la mayor suma igual por lado que se puede armar?',
      datos: ['1 + 2 + 3 + … + 8 = 36', 'Cada lado tiene sus dos esquinas y la tarjeta del medio.'],
      voz: 'Prueba primero con las esquinas más grandes.',
      opciones: [
        { id: 'tope', texto: '15,5', error: 'RMP184', siFuera: 'Poner 5, 6, 7 y 8 en las esquinas es el buen comienzo, pero una suma de tarjetas enteras no puede dar 15,5.' },
        { id: 'c', texto: f0(EX8.max), correcta: true },
        { id: 'nueve', texto: '9', error: 'RMP1', siFuera: 'Repartir 36 entre los 4 lados valdría si nada se repitiera, pero cada esquina está en dos lados.' },
        { id: 'veinti', texto: '21', error: 'RMP185', siFuera: 'Buscar las tarjetas grandes es la idea, pero 8 + 7 + 6 llena un solo lado, y los otros no llegan a 21 con las que quedan.' },
      ],
      dibujo: marco(4, qs(4), qs(4), qs(4)),
      revelar: marco(4, comp(A_P3.v), cartas(A_P3.m), A_P3.v.map(() => ({ t: f0(EX8.max), papel: 'seguro' }))),
      coincide: 'Coincide: 15,5 no es entero, y 15 no se arma con 4, 5, 7 y 8 en las esquinas, pero sí con 3, 6, 7 y 8.',
      noCoincide: 'Revisemos: la cuenta con las mayores da una cota, y falta armarla.',
    },
    mira: {
      pieza: PZ,
      datos: Object.assign(marco(4, A_P3.v.map(q => ({ t: f0(q), papel: 'compartida', desde: 3 })), A_P3.m.map(q => ({ t: f0(q), desde: 3 })), A_P3.v.map(() => ({ t: '15', desde: 3 }))).datos,
        { nota: [{ t: 'Del 1 al 8: total 36', papel: 'total' }, { t: '5 + 6 + 7 + 8 = 26 → 15,5', desde: 1 }] }),
      voz: 'La cuenta da una cota; el arreglo la confirma.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Mientras más grandes son las esquinas, más suma cada lado.', ecuacion: ['4 × ', S, ' = ', T, ' + ', V] },
        { estado: { corte: 1 }, texto: 'Con 5, 6, 7 y 8 en las esquinas, la cuenta no da entera.', ecuacion: ['4 × ', S, ' = 36 + 26 = 62', SEP, '62 ÷ 4 = 15,5'] },
        { estado: { corte: 2 }, texto: 'Se prueba el entero de abajo, 15, que pide esquinas que sumen 24.', ecuacion: ['4 × 15 = 60', SEP, V, ' = 60 − 36 = 24'] },
        { estado: { corte: 3 }, texto: 'Con 4, 5, 7 y 8 en las esquinas no se arma; con 3, 6, 7 y 8, sí.' },
      ],
    },
    regla: {
      texto: 'Para la mayor suma van los números más grandes en las esquinas, y para la menor, los más chicos. Si la cuenta no sale entera o no se arma, se prueba el entero siguiente: hacia abajo para la mayor, hacia arriba para la menor.',
      ecuacion: [S, ' = (', T, ' + ', V, ') ÷ lados', SEP, { llave: ['mayor: ', V, ' con las más grandes'], nota: 'la cota', color: 'c-i' }],
      condicion: 'algún arreglo alcanza esa suma usando cada tarjeta una sola vez.',
      voz: 'Primero la cota; después, armarla.',
    },
    ejemplos: null,
    // Así se resuelve: impares o pares, con la cuenta que no basta. «Ahora tú» usa números seguidos desde otro valor.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = ['mayor', 'menor', 'diferencia'][s % 3];
        const z = casoExt(r, { tipo, lados: [3, 4, 5], pasos: [2], desde: [10, 16], giro: true }), L = z.L, quiere = tipo === 'menor' ? z.min : z.max;
        const A = z.de(quiere), o = z.nums.slice().sort((p, q) => p - q), esqC = tipo === 'menor' ? o.slice(0, L) : o.slice(-L), cota = tipo === 'menor' ? z.cotaMin : z.cotaMax;
        const pasos = [
          { tipo: 'pide', texto: tipo === 'diferencia' ? 'Piden la mayor suma por lado menos la menor.' : `Piden la ${tipo} suma por lado que se puede armar.` },
          { tipo: 'datos', texto: `Son ${f0(2 * L)} tarjetas, ${deA(z.nums, z.d)}, y primero las sumo todas.`, ecuacion: [T, ` = ${f0(z.T)}`] },
          { tipo: 'regla', texto: `Los ${f0(L)} lados juntos suman el total más las esquinas, así que para la ${tipo === 'menor' ? 'menor suma van las esquinas más chicas' : 'mayor suma van las esquinas más grandes'}. Si la cuenta no sale entera o no se arma, se prueba el entero siguiente.` },
          { tipo: 'cuentas', texto: `Con ${listaTxt(esqC)} en las esquinas, la cuenta da ${Kit.formatear(cota, Number.isInteger(cota) ? 0 : 1)}. ${porQue(z, cota, quiere, tipo === 'menor')}`,
            ecuacion: [S, ` = (${f0(z.T)} + ${f0(suma(esqC))}) ÷ ${f0(L)}`], dibujo: marco(L, comp(A.v), cartas(A.m), A.v.map(() => ({ t: f0(quiere), papel: 'seguro' }))) },
        ];
        if (tipo === 'diferencia') pasos.push({ tipo: 'cuentas', texto: `La menor: con ${listaTxt(o.slice(0, L))} en las esquinas da ${Kit.formatear(z.cotaMin, Number.isInteger(z.cotaMin) ? 0 : 1)}. ${porQue(z, z.cotaMin, z.min, true)} Resto las dos.`, ecuacion: [`${f0(z.max)} − ${f0(z.min)} = `, F(f0(z.max - z.min))] });
        pasos.push({ tipo: 'sentido', texto: `El arreglo lo confirma: un lado es ${f0(A.v[0])} + ${f0(A.m[0])} + ${f0(A.v[1])} = ${f0(quiere)}.` });
        const res = tipo === 'diferencia' ? z.max - z.min : quiere;
        return {
          enunciado: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla, y los lados suman lo mismo. ¿${tipo === 'diferencia' ? 'Cuánto es la mayor suma por lado menos la menor' : `Cuál es la ${tipo} suma por lado`}?`,
          datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], dibujo: marco(L, qs(L), qs(L), qs(L)), pasos,
          respuesta: tipo === 'diferencia' ? [F(f0(res))] : [S, ' = ', F(f0(res))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la mayor · 1 la menor · 2 la mayor menos la menor. Los distractores: la cota sin armar,
    // el total entre los lados, lo de las esquinas y la primera que se arma (sin buscar el extremo).
    ahoraTu: {
      pieza: PZ,
      voz: 'La cuenta da una cota: ¿se arma?',
      generar(s) {
        const r = azar(s), tipo = ['mayor', 'menor', 'diferencia'][s % 3];
        const z = casoExt(r, { tipo, lados: [3, 4, 4, 5], pasos: [1, 1, 2], desde: [1, 9], giro: s % 2 === 1 }), L = z.L, o = z.nums.slice().sort((p, q) => p - q);
        const pide = { lados: L, txt: `Las tarjetas ${deA(z.nums, z.d)} van en un marco ${NOMBRE_POL[L]}, una por casilla, y los lados suman lo mismo.` };
        const base = { datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], dibujo: marco(L, qs(L), qs(L), qs(L)) };
        if (tipo === 'diferencia') {
          const bien = z.max - z.min;
          const ds = [
            { id: 'cota', valor: z.cotaMax - z.cotaMin, error: 'RMP184', siFuera: 'Usar las esquinas extremas es la idea, pero esas dos cuentas no siempre se arman: hay que restar las sumas que sí se arman.' },
            { id: 'mayor', valor: z.max, error: 'RMP61', siFuera: `Hallaste bien la mayor, ${f0(z.max)}, pero falta restarle la menor.` },
            { id: 'menor', valor: z.min, error: 'RMP61', siFuera: `Hallaste bien la menor, ${f0(z.min)}, pero piden la mayor menos la menor.` },
            { id: 'esq', valor: suma(o.slice(-L)) - suma(o.slice(0, L)), error: 'RMP183', siFuera: 'Comparar las esquinas es la idea, pero esa diferencia todavía se reparte entre los lados.' },
            { id: 'suma', valor: z.max + z.min, error: 'RMP61', siFuera: 'Hallaste bien las dos sumas, pero piden restarlas, no sumarlas.' },
          ];
          return Object.assign(base, { pregunta: `${pide.txt} ¿Cuánto es la mayor suma por lado menos la menor?`, opciones: opcionesDec(bien, ds),
            solucion: { texto: `La mayor que se arma es ${f0(z.max)} y la menor, ${f0(z.min)}.`, ecuacion: [`${f0(z.max)} − ${f0(z.min)} = `, F(f0(bien))] } });
        }
        const bien = tipo === 'mayor' ? z.max : z.min, cota = tipo === 'mayor' ? z.cotaMax : z.cotaMin, esq = tipo === 'mayor' ? o.slice(-L) : o.slice(0, L);
        const otra = z.Ss.length > 1 ? (tipo === 'mayor' ? z.Ss[z.Ss.length - 2] : z.Ss[1]) : null;
        const ds = [
          { id: 'cota', valor: cota, error: 'RMP184', siFuera: `Poner ${listaTxt(esq)} en las esquinas es el buen comienzo, pero ${Number.isInteger(cota) ? 'con esa suma las tarjetas no se arman' : 'esa cuenta no da un número entero'}.` },
          { id: 'una', valor: z.T / L, error: 'RMP1', siFuera: 'Repartir el total valdría si nada se repitiera, pero cada esquina está en dos lados.' },
          { id: 'esq', valor: suma(esq), error: 'RMP183', siFuera: `Elegir bien las esquinas es la idea, pero ${f0(suma(esq))} es lo que suman ellas, no un lado.` },
          { id: 'otra', valor: otra, error: 'RMP2', siFuera: `Es cierto que ${f0(otra)} se arma, pero hay otra suma, ${tipo === 'mayor' ? 'más grande' : 'más chica'}, que también se arma.` },
          { id: 'lados', valor: L * bien, error: 'RMP61', siFuera: 'La cuenta de los lados juntos va bien, pero falta dividirla entre el número de lados.' },
          { id: 'total', valor: z.T, error: 'RMP61', siFuera: 'Sumaste bien las tarjetas, pero ese es el total, no lo que suma un lado.' },
        ];
        return Object.assign(base, { pregunta: `${pide.txt} ¿Cuál es la ${tipo} suma por lado?`, opciones: opcionesDec(bien, ds),
          solucion: { texto: `Con ${listaTxt(esq)} en las esquinas, la cuenta da ${Kit.formatear(cota, Number.isInteger(cota) ? 0 : 1)}; ${cota === bien ? 'es entera y se arma' : `el primer valor que se arma es ${f0(bien)}`}.`, ecuacion: [S, ' = ', F(f0(bien))] } });
      },
    },
  };
  // ---------- Ejemplos resueltos de «La mayor suma tiene que armarse» ----------
  // Comprobados al cargar (extremos prueba todas las esquinas con armaPol) y aparte en scratchpad e9-rm/ej3.py:
  // 1 → 12 · 2 → 9 · 3 → 21 · 4 → 18 · 5 → 15 · 6 → 12 · 7 → 12 · 8 → 19 · 9 → 18 · 10 → 3 · 11 → 10 (C) · 12 → 15 (B) ·
  // 13 → 24 (E) · 14 → 10 (A) · 15 → 14 (C).
  const X16 = extremos(rango(1, 6), 3), X27 = extremos(rango(2, 7), 3), XI = extremos(rango(1, 11, 2), 3), XP = extremos(rango(2, 12, 2), 3);
  const X7 = extremos([1, 2, 3, 4, 5, 7], 3), X10 = extremos(rango(1, 10), 5), X29 = extremos(rango(2, 9), 4), XI19 = extremos(rango(1, 19, 2), 5);
  if (X16.max !== 12 || X16.min !== 9 || XI.max !== 21 || XP.min !== 18 || X27.max !== 15 || EX8.min !== 12 || EX8.cotaMin !== 11.5 || X7.max !== 12
    || X10.max !== 19 || X10.min !== 14 || X10.Ss.includes(15) || X29.max !== 18 || XI19.max - XI19.min !== 10 || suma(EX8.de(12).m) !== 24
    || 3 * 14 !== 28 + 2 * 7 || 2 * 10 !== 15 + 5) throw new Error('ejemplos de la idea 3');
  const fig3 = (L, ns) => marco(L, qs(L), qs(L), qs(L), { meta: `Tarjetas ${ns}` });
  const sol3 = (X, Sx) => { const A = X.de(Sx); return `Se arma con las esquinas ${listaTxt(A.v)} y, en medio de los lados, ${listaTxt(A.m)}.`; };
  const EJEMPLOS_MAY = [
    ejemplo({ nivel: 1, titulo: 'La mayor con 1 a 6', caso: 'mayor|1,2,3,4,5,6|3',
      enunciado: 'En el marco triangular van las tarjetas del 1 al 6, y los lados suman lo mismo. ¿Cuál es la mayor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'del 1 al 6'),
      solucion: [{ texto: 'Para la mayor van las esquinas más grandes: 4, 5 y 6, que suman 15.', ecuacion: [S, ' = (21 + 15) ÷ 3 = ', F('12')] }, { texto: sol3(X16, 12) }],
      respuesta: [S, ' = ', F('12')] }),
    ejemplo({ nivel: 1, titulo: 'La menor con 1 a 6', caso: 'menor|1,2,3,4,5,6|3',
      enunciado: 'En el marco triangular van las tarjetas del 1 al 6, y los lados suman lo mismo. ¿Cuál es la menor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'del 1 al 6'),
      solucion: [{ texto: 'Para la menor van las esquinas más chicas: 1, 2 y 3, que suman 6.', ecuacion: [S, ' = (21 + 6) ÷ 3 = ', F('9')] }, { texto: sol3(X16, 9) }],
      respuesta: [S, ' = ', F('9')] }),
    ejemplo({ nivel: 1, titulo: 'Impares, la mayor', caso: 'mayor|1,3,5,7,9,11|3',
      enunciado: 'En el marco triangular van los impares del 1 al 11, y los lados suman lo mismo. ¿Cuál es la mayor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'impares del 1 al 11'),
      solucion: [{ texto: 'Los seis impares suman 36, y las esquinas más grandes, 7 + 9 + 11, suman 27.', ecuacion: [S, ' = (36 + 27) ÷ 3 = ', F('21')] }, { texto: sol3(XI, 21) }],
      respuesta: [S, ' = ', F('21')] }),
    ejemplo({ nivel: 1, titulo: 'Pares, la menor', caso: 'menor|2,4,6,8,10,12|3',
      enunciado: 'En el marco triangular van los pares del 2 al 12, y los lados suman lo mismo. ¿Cuál es la menor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'pares del 2 al 12'),
      solucion: [{ texto: 'Los seis pares suman 42, y las esquinas más chicas, 2 + 4 + 6, suman 12.', ecuacion: [S, ' = (42 + 12) ÷ 3 = ', F('18')] }, { texto: sol3(XP, 18) }],
      respuesta: [S, ' = ', F('18')] }),
    ejemplo({ nivel: 1, titulo: 'Del 2 al 7, la mayor', caso: 'mayor|2,3,4,5,6,7|3',
      enunciado: 'En el marco triangular van las tarjetas del 2 al 7, y los lados suman lo mismo. ¿Cuál es la mayor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'del 2 al 7'),
      solucion: [{ texto: 'El total es 27, y las esquinas más grandes, 5, 6 y 7, suman 18.', ecuacion: [S, ' = (27 + 18) ÷ 3 = ', F('15')] }, { texto: sol3(X27, 15) }],
      respuesta: [S, ' = ', F('15')] }),
    ejemplo({ nivel: 2, titulo: 'El cuadrado, la menor', caso: 'menor|1,2,3,4,5,6,7,8|4',
      enunciado: 'En un marco cuadrado van las tarjetas del 1 al 8: una en cada esquina y una en medio de cada lado. ¿Cuál es la menor suma igual por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(4, 'del 1 al 8'),
      solucion: [{ texto: 'Con 1, 2, 3 y 4 en las esquinas, la cuenta no da entera.', ecuacion: ['(36 + 10) ÷ 4 = 11,5'] },
        { texto: 'Se prueba el entero de arriba, 12, que pide esquinas que sumen 12.', ecuacion: ['4 × 12 − 36 = 12', SEP, S, ' = ', F('12')] }, { texto: sol3(EX8, 12) }],
      respuesta: [S, ' = ', F('12')] }),
    ejemplo({ nivel: 2, titulo: 'Tarjetas salteadas', caso: 'mayor|1,2,3,4,5,7|3',
      enunciado: 'En el marco triangular van las tarjetas 1, 2, 3, 4, 5 y 7, y los lados suman lo mismo. ¿Cuál es la mayor suma por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, '1, 2, 3, 4, 5 y 7'),
      solucion: [{ texto: 'El total es 22. Con 4, 5 y 7 en las esquinas, la cuenta da 38 ÷ 3, que no es entero, y con esquinas que sumen 15 da 37 ÷ 3, que tampoco lo es.', ecuacion: ['(22 + 16) ÷ 3 ≈ 12,7'] },
        { texto: 'Con esquinas que sumen 14, la cuenta sí sale entera.', ecuacion: [S, ' = (22 + 14) ÷ 3 = ', F('12')] }, { texto: sol3(X7, 12) }],
      respuesta: [S, ' = ', F('12')] }),
    ejemplo({ nivel: 2, titulo: 'El pentágono, la mayor', caso: 'mayor|1,2,3,4,5,6,7,8,9,10|5',
      enunciado: 'En un marco con forma de pentágono van las tarjetas del 1 al 10: una en cada esquina y una en medio de cada lado. ¿Cuál es la mayor suma igual por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA, D_SEGUIDOS], figura: fig3(5, 'del 1 al 10'),
      solucion: [{ texto: 'El total es 55, y las esquinas más grandes, del 6 al 10, suman 40.', ecuacion: [S, ' = (55 + 40) ÷ 5 = ', F('19')] }, { texto: sol3(X10, 19) }],
      respuesta: [S, ' = ', F('19')] }),
    ejemplo({ nivel: 2, titulo: 'Del 2 al 9, la mayor', caso: 'mayor|2,3,4,5,6,7,8,9|4',
      enunciado: 'En un marco cuadrado van las tarjetas del 2 al 9: una en cada esquina y una en medio de cada lado. ¿Cuál es la mayor suma igual por lado?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA, D_SEGUIDOS], figura: fig3(4, 'del 2 al 9'),
      solucion: [{ texto: 'El total es 44, y con 6, 7, 8 y 9 en las esquinas la cuenta no da entera.', ecuacion: ['(44 + 30) ÷ 4 = 18,5'] },
        { texto: 'Se prueba el entero de abajo, 18, que pide esquinas que sumen 28.', ecuacion: ['4 × 18 − 44 = 28', SEP, S, ' = ', F('18')] }, { texto: sol3(X29, 18) }],
      respuesta: [S, ' = ', F('18')] }),
    ejemplo({ nivel: 2, titulo: 'Mayor menos menor', caso: 'diferencia|1,2,3,4,5,6|3',
      enunciado: 'En el marco triangular van las tarjetas del 1 al 6. ¿Cuánto es la mayor suma por lado menos la menor?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(3, 'del 1 al 6'),
      solucion: [{ texto: 'La mayor suma es 12, con 4, 5 y 6 en las esquinas, y la menor es 9, con 1, 2 y 3; las dos se arman.', ecuacion: ['12 − 9 = ', F('3')] }],
      respuesta: [F('3')] }),
    // Nivel 3 (tipo examen). Letras de la correcta: C, B, E, A, C.
    ejemplo({ nivel: 3, titulo: 'Impares en el pentágono', caso: 'diferencia|impares 1-19|5',
      enunciado: 'En un marco con forma de pentágono van los impares del 1 al 19, uno por casilla: en cada esquina y en medio de cada lado. ¿Cuánto es la mayor suma igual por lado menos la menor?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA, D_SEGUIDOS], figura: fig3(5, 'impares del 1 al 19'),
      alternativas: ['35', '25', '10', '60'], correcta: '10',
      solucion: [{ texto: 'El total es 100. Para la mayor, las esquinas van del 11 al 19 y suman 75; para la menor, van del 1 al 9 y suman 25.', ecuacion: ['(100 + 75) ÷ 5 = 35', SEP, '(100 + 25) ÷ 5 = 25'] },
        { texto: 'Las dos cuentas dan entero y se arman; la menor, por ejemplo, con las esquinas 1, 3, 5, 7 y 9.', ecuacion: ['35 − 25 = ', F('10')] }],
      explica: '35 es la mayor y 25 es la menor, sin restar, y 60 suma las dos en vez de restarlas.',
      respuesta: [F('10')] }),
    ejemplo({ nivel: 3, titulo: 'La suma que no se arma', caso: 'cual|1-10|5',
      enunciado: 'En un marco con forma de pentágono van las tarjetas del 1 al 10, una en cada esquina y una en medio de cada lado. ¿Cuál de estas sumas por lado no se puede armar?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA, D_SEGUIDOS], figura: fig3(5, 'del 1 al 10'),
      alternativas: ['14', '15', '16', '17', '19'], correcta: '15',
      solucion: [{ texto: 'Con 15 por lado, la cuenta pide esquinas que sumen 20: es entera.', ecuacion: ['5 × 15 − 55 = 20'] },
        { texto: 'Pero se probaron todas las esquinas que suman 20 y en ninguna las del medio salen de las tarjetas que quedan.' }],
      explica: '14, 16, 17 y 19 sí se arman: 14, por ejemplo, con las esquinas del 1 al 5, y las otras tres también tienen su arreglo.',
      respuesta: [F('15')] }),
    ejemplo({ nivel: 3, titulo: 'Las del medio, en la menor', caso: 'medios-menor|1-8|4',
      enunciado: 'En un marco cuadrado van las tarjetas del 1 al 8, con la menor suma igual por lado. ¿Cuánto suman las cuatro tarjetas que no están en las esquinas?',
      datos: [D_TOTAL, D_LADO, D_COTA, D_ARMA], figura: fig3(4, 'del 1 al 8'),
      alternativas: ['12', '11,5', '36', '48', '24'], correcta: '24',
      solucion: [{ texto: 'La menor no puede ser 11,5, porque no es entera; es 12, con esquinas que suman 12.', ecuacion: ['4 × 12 − 36 = 12'] },
        { texto: 'Las tarjetas del medio son lo que queda del total al quitar las esquinas.', ecuacion: ['36 − 12 = ', F('24')] }],
      explica: '12 es la suma por lado, y también la de las esquinas; 11,5 no es entera; 36 es el total, y 48 son los cuatro lados juntos.',
      respuesta: [F('24')] }),
    // Antes era la cruz de 1 a 5 (la misma del ejemplo 3, de nivel 1); el lector en frío la vio repetida (26 nov).
    ejemplo({ nivel: 3, titulo: 'La cruz grande, la mayor', caso: 'cruz9-mayor|1-9',
      enunciado: 'Las tarjetas del 1 al 9 van en una cruz: una fila de cinco y una columna de cinco que comparten la del centro, y las dos suman lo mismo. ¿Cuál es la mayor suma posible?',
      datos: [D_TOTAL, D_CRUZ, D_LINEAS, D_SEGUIDOS], figura: { pieza: PZ, datos: { escena: 'tablero', celdas: [[null, null, '?', null, null], [null, null, '?', null, null], ['?', '?', '?', '?', '?'], [null, null, '?', null, null], [null, null, '?', null, null]] }, estado: {} },
      alternativas: ['27', '22,5', '25', '9', '45'], correcta: '27',
      solucion: [{ texto: 'Fila más columna es el total más el centro, así que la mayor suma pide el centro más grande, 9.', ecuacion: [T, ' = (1 + 9) × 9 ÷ 2 = 45', SEP, '2 × ', S, ' = 45 + 9 = 54', SEP, S, ' = ', F('27')] },
        { texto: 'Falta ver que se arma: las otras ocho tarjetas se parten en dos grupos de 18, como 1 + 2 + 7 + 8 en la fila y 3 + 4 + 5 + 6 en la columna, y cada línea suma 18 + 9 = 27.' }],
      explica: '22,5 reparte 45 sin contar el centro; 25 pone el 5 al centro; 9 es el centro, y 45 es el total.',
      respuesta: [F('27')] }),
    ejemplo({ nivel: 3, titulo: 'La estrella, la mayor', caso: 'estrella-mayor|1-7',
      enunciado: 'Las tarjetas del 1 al 7 van en tres líneas de tres que se cruzan en la del centro, y las tres líneas suman lo mismo. ¿Cuál es la mayor suma por línea?',
      datos: [D_TOTAL, D_LINEAS], figura: estrella({ t: '?' }, qs(6)),
      alternativas: ['12', '28', '14', '7'], correcta: '14',
      solucion: [{ texto: 'El centro entra dos veces de más, así que para la mayor suma va el más grande, 7.', ecuacion: ['3 × ', S, ' = 28 + 2 × 7 = 42', SEP, S, ' = ', F('14')] },
        { texto: 'Se arma con 1 + 7 + 6, 2 + 7 + 5 y 3 + 7 + 4.' }],
      explica: '12 pone el 4 al centro; 28 es el total, y 7 es el centro.',
      respuesta: [F('14')] }),
  ];
  mayor.ejemplos = EJEMPLOS_MAY;
  juntar('mayor-suma', EJEMPLOS_MAY, ['mayor|1,2,3,4,5,6,7,8|4']);
  // ---------- Idea 4: el cuadrado mágico y su centro ----------
  // Objeto de la primera pantalla: el tablero de madera de 4 × 4 (rm-casillas, escena «tablero»). Cambia: desde qué número
  // van las 16 tarjetas. · Permanece: el cuadrado de Durero (1514), pasado a esos números. · Progresa: el total y lo que
  // suma cada fila. · Se reserva: el 3 × 3 y su centro (Predice). · Debe verse: cada fila se lleva la cuarta parte.
  const DURER = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]];
  const LS = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];   // el Lo Shu
  const lineas = m => { const n = m.length, L = m.concat(m[0].map((_, k) => m.map(f => f[k]))); L.push(m.map((f, i) => f[i]), m.map((f, i) => f[n - 1 - i])); return L; };
  const esMagico = m => { const Ls = lineas(m); return Ls.every(l => suma(l) === suma(Ls[0])) && new Set(m.flat()).size === m.length * m.length; };
  if (!esMagico(DURER) || !esMagico(LS)) throw new Error('idea 4: Durero y Lo Shu son mágicos');
  const desdeA = (m, a, d = 1) => m.map(f => f.map(q => a + (q - 1) * d));
  const tab = (m, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'tablero', celdas: m.map(f => f.map(q => (q === null ? null : typeof q === 'object' ? q : { t: f0(q) }))) }, o), estado: {} });
  const vacio3 = (centro, o = {}) => tab([[{ t: '' }, { t: '' }, { t: '' }], [{ t: '' }, centro || { t: '' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '' }]], o);
  function dibujoJ4(v) {
    const m = desdeA(DURER, v.a), Sx = suma(m[0]);
    return { datos: { escena: 'tablero', celdas: m.map(f => f.map(q => ({ t: f0(q) }))), sumas: m.map(() => ({ t: f0(Sx) })), lineas: [{ tipo: 'diagonal' }, { tipo: 'contra' }],
      nota: [{ t: `Total de las 16: ${f0(suma(m.flat()))}`, papel: 'total' }] }, estado: {} };
  }
  function lecturaJ4(v) { const tot = suma(desdeA(DURER, v.a).flat()); return [T, ` = ${f0(tot)}; cada fila: ${f0(tot)} ÷ 4 = `, S, ` = ${f0(tot / 4)}`]; }
  if (suma(desdeA(DURER, 5).flat()) !== 200) throw new Error('juego de la idea 4: desde el 5, el total es 200');
  const D_MAGICO = 'En un cuadrado mágico, cada fila, cada columna y las dos diagonales suman lo mismo.';
  const D_FILAS = 'Las filas no comparten casillas y las usan todas: cada fila suma el total ÷ número de filas.';
  const D_CENTRO = 'Por el centro del 3 × 3 pasan cuatro líneas: la fila y la columna del medio y las dos diagonales.';
  // Un 3 × 3 mágico con números en progresión: el Lo Shu pasado a a, a + d, …, girado o reflejado según la semilla.
  const giros = m => { const g = x => x[0].map((_, k) => x.map(f => f[f.length - 1 - k])), out = []; let y = m; for (let i = 0; i < 4; i++) { out.push(y, y.map(f => f.slice().reverse())); y = g(y); } return out; };
  function casoMag(r, o) {
    for (let i = 0; i < 400; i++) {
      const a = r.ent(o.desde[0], o.desde[1]), d = r.elegir(o.pasos), m = r.elegir(giros(desdeA(LS, a, d))), nums = rango(a, a + 8 * d, d);
      const k = `${o.tipo}|${a}|${d}|${m.flat().join(',')}`;
      if (usado('suma-magica', o.clave ? `${o.tipo}|${a}|${d}` : k)) continue;
      return { a, d, m, nums, T: suma(nums), S: suma(nums) / 3, c: m[1][1] };
    }
    throw new Error('casoMag');
  }
  const magico = {
    id: 'suma-magica',
    titulo: 'El cuadrado mágico y su centro',
    pregunta: '¿Qué número va en el centro de un cuadrado mágico?',
    temas: ['Cuadrados mágicos'],
    pieza: PZ,
    aprendizaje: 'Cada fila de un cuadrado mágico suma el total entre las filas; en el 3 × 3, el centro es la tercera parte de esa suma.',
    actividad: 'Cambiar desde qué número va un cuadrado mágico 4 × 4 hasta que cada fila sume 50.',
    // Lee: qué es un cuadrado mágico, el orden n y qué mirar. No dice qué número va al centro del 3 × 3 (Predice).
    lee: {
      tarjetas: [
        { titulo: 'El tablero', texto: 'Este tablero tiene 4 filas y 4 columnas de tarjetas, y las líneas grises que lo cruzan de esquina a esquina marcan sus dos diagonales. En un cuadrado mágico, cada fila, cada columna y las dos diagonales suman lo mismo: la suma mágica.',
          pieza: PZ, dibujo: tab(DURER.map(f => f.map(() => ({ t: '' }))), { lineas: [{ tipo: 'diagonal' }, { tipo: 'contra' }] }) },
        { titulo: 'El orden', texto: 'El orden del cuadrado, n, es cuántas casillas tiene cada fila: el de 4 × 4 es de orden 4, y el de 3 × 3, de orden 3. En estos retos casi siempre lleva números seguidos, cada uno una vez.' },
        { titulo: 'Qué mirar al jugar', texto: 'Tú eliges desde qué número empiezan las 16 tarjetas. Compara lo que suma una fila con el total de las 16.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Este cuadrado mágico 4 × 4 tiene 16 números seguidos, cada uno una vez, y sus diagonales también suman lo mismo que las filas.',
      mision: {
        texto: 'Haz que cada fila sume 50.',
        logrado: v => suma(desdeA(DURER, v.a)[0]) === 50,
        bien: ['Cada fila suma 50: la cuarta parte del total de las 16.'],
      },
      voz: 'Una fila se lleva la cuarta parte del total.',
      leyenda: [
        { s: T, t: 'el total de las 16 tarjetas' },
        { s: S, t: 'la suma de cada fila, a la derecha' },
      ],
      controles: [{ id: 'a', etiqueta: 'Empieza en', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => dibujoJ4(v),
      lectura: v => lecturaJ4(v),
      minimo: 3,
    },
    // La predicción de antes, con su pregunta y sus ids (el avance la conserva).
    predice: {
      pregunta: 'En un cuadrado mágico 3 × 3 con los números del 1 al 9, ¿qué número va en la casilla del centro?',
      datos: ['1 + 2 + 3 + … + 9 = 45'],
      voz: 'Piensa cuántas líneas pasan por el centro.',
      opciones: [
        { id: 'nueve', texto: '9', error: 'RMP186', siFuera: 'Es cierto que el centro es especial, pero no por ser el mayor, sino porque cuatro líneas lo comparten.' },
        { id: 'quince', texto: '15', error: 'RMP61', siFuera: 'Esa cuenta va bien, porque 15 es lo que suma cada fila, pero el centro es una sola casilla.' },
        { id: 'c', texto: '5', correcta: true },
        { id: 'cualquiera', texto: 'Cualquiera de los nueve', error: 'RMP187', siFuera: 'Es cierto que hay varios cuadrados 3 × 3 con esos números, pero en todos ellos el centro es 5.' },
      ],
      dibujo: vacio3(null, { nota: 'Números del 1 al 9' }),
      revelar: tab(LS.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: '5', papel: 'seguro' } : { t: f0(q) }))), { nota: 'Cada línea suma 15' }),
      coincide: 'Coincide: en todo cuadrado mágico 3 × 3 con 1 a 9, el centro es 5.',
      noCoincide: 'Revisemos: por el centro pasan cuatro líneas.',
    },
    mira: {
      pieza: PZ,
      datos: { escena: 'tablero', celdas: LS.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: '5', papel: 'compartida' } : { t: f0(q) }))),
        lineas: [{ tipo: 'fila', k: 1, papel: 'compartida', desde: 1 }, { tipo: 'columna', k: 1, papel: 'compartida', desde: 1 }, { tipo: 'diagonal', papel: 'compartida', desde: 1 }, { tipo: 'contra', papel: 'compartida', desde: 1 }],
        nota: [{ t: 'Del 1 al 9: total 45', papel: 'total' }, { t: 'Las cuatro líneas: 4 × 15 = 45 + 3 × 5', desde: 2 }] },
      voz: 'El centro, en cuatro líneas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las tres filas suman lo mismo y se reparten el total, 45, así que cada una suma 15.', ecuacion: [S, ' = 45 ÷ 3 = 15'] },
        { estado: { corte: 1 }, texto: 'Por el centro pasan cuatro líneas, y las cuatro juntas suman 60.', ecuacion: ['4 × 15 = 60'] },
        { estado: { corte: 2 }, texto: 'Esas cuatro líneas cubren las nueve casillas una vez y, además, el centro tres veces más.', ecuacion: ['60 = 45 + 3 × ', C, SEP, C, ' = 5'] },
        { estado: { corte: 2 }, texto: 'Dos casillas opuestas suman el doble del centro: 2 + 8 = 10.', ecuacion: ['2 + 8 = 2 × 5'] },
      ],
    },
    regla: {
      texto: 'Cada fila suma el total entre las filas. En el 3 × 3, las cuatro líneas del centro cubren las nueve casillas y el centro tres veces más: el centro es la tercera parte de la suma mágica. Las opuestas a y b suman su doble.',
      ecuacion: [S, ' = ', T, ' ÷ n', SEP, { llave: [C], nota: 'el centro', color: 'c-i' }, ' = ', S, ' ÷ 3', SEP, 'a + b = 2 × ', C],
      condicion: 'el cuadrado es mágico; para el centro y las opuestas, además, es de 3 × 3, y a y b están en una línea que pasa por el centro, una a cada lado.',
      voz: 'Primero S; después, el centro.',
    },
    ejemplos: null,
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = s % 3, z = casoMag(r, { tipo: 'r' + tipo, desde: [10, 20], pasos: [2, 3, 4] }), seq = `${listaTxt(z.nums)}`;
        const base = { datos: tipo === 1 ? [D_MAGICO, D_FILAS, D_CENTRO] : [D_MAGICO, D_FILAS, D_CENTRO, D_SEGUIDOS] };
        if (tipo === 0) return Object.assign(base, {
          enunciado: `Un cuadrado mágico 3 × 3 usa una vez cada número: ${seq}. ¿Qué número va en el centro?`, dibujo: vacio3({ t: '?' }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el número del centro.' },
            { tipo: 'datos', texto: 'Los nueve números van con un mismo salto, así que los sumo con esa fórmula.', ecuacion: [T, ` = (${f0(z.nums[0])} + ${f0(z.nums[8])}) × 9 ÷ 2 = ${f0(z.T)}`] },
            { tipo: 'regla', texto: 'Cada fila se lleva la tercera parte del total. Por el centro pasan cuatro líneas, y por eso el centro es la tercera parte de la suma mágica.' },
            { tipo: 'cuentas', texto: 'Primero hallo la suma mágica y, después, el centro.', ecuacion: [S, ` = ${f0(z.T)} ÷ 3 = ${f0(z.S)}`, SEP, C, ` = ${f0(z.S)} ÷ 3 = `, I(f0(z.c))], dibujo: tab(z.m.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: f0(q), papel: 'seguro' } : { t: f0(q) })))) },
            { tipo: 'sentido', texto: `El ${f0(z.c)} es el del medio de la lista: el quinto de los nueve.` },
          ], respuesta: [C, ' = ', I(f0(z.c))] });
        const aa = z.m[0][0], xx = z.m[2][2];
        if (tipo === 1) return Object.assign(base, {
          enunciado: `En un cuadrado mágico 3 × 3, el centro es ${f0(z.c)} y la esquina de arriba a la izquierda es ${f0(aa)}. ¿Qué número va en la esquina opuesta, abajo a la derecha?`,
          dibujo: tab([[{ t: f0(aa) }, { t: '' }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '?' }]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden la esquina opuesta a la que se conoce.' },
            { tipo: 'datos', texto: `El centro es ${f0(z.c)}, y en el 3 × 3 la suma mágica es el triple del centro.`, ecuacion: [S, ` = 3 × ${f0(z.c)} = ${f0(3 * z.c)}`] },
            { tipo: 'regla', texto: 'La diagonal pasa por las dos esquinas y por el centro, así que también da la suma mágica.' },
            { tipo: 'cuentas', texto: 'La esquina que falta es lo que le queda a la diagonal para llegar a la suma mágica.', ecuacion: [x, ` = ${f0(3 * z.c)} − ${f0(aa)} − ${f0(z.c)} = `, H(f0(xx))] },
            { tipo: 'sentido', texto: `Las dos esquinas opuestas suman ${f0(aa + xx)}, el doble del centro.` },
          ], respuesta: [x, ' = ', H(f0(xx))] });
        const f0r = z.m[0];
        return Object.assign(base, {
          enunciado: `En un cuadrado mágico 3 × 3 con los números ${seq}, la fila de arriba tiene ${f0(f0r[0])} y ${f0(f0r[1])}. ¿Qué número completa esa fila?`,
          dibujo: tab([[{ t: f0(f0r[0]) }, { t: f0(f0r[1]) }, { t: '?' }], [{ t: '' }, { t: '' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '' }]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden el número que completa la fila de arriba.' },
            { tipo: 'datos', texto: 'Los nueve números van con un mismo salto, así que los sumo con esa fórmula.', ecuacion: [T, ` = (${f0(z.nums[0])} + ${f0(z.nums[8])}) × 9 ÷ 2 = ${f0(z.T)}`] },
            { tipo: 'regla', texto: 'Cada fila suma la tercera parte del total.' },
            { tipo: 'cuentas', texto: 'El número que falta es lo que le queda a la fila para llegar a la suma mágica.', ecuacion: [S, ` = ${f0(z.T)} ÷ 3 = ${f0(z.S)}`, SEP, x, ` = ${f0(z.S)} − ${f0(f0r[0])} − ${f0(f0r[1])} = `, H(f0(f0r[2]))] },
            { tipo: 'sentido', texto: `El ${f0(f0r[2])} está en la lista y no se repite en esa fila.` },
          ], respuesta: [x, ' = ', H(f0(f0r[2]))] });
      },
    },
    // Ahora tú (semilla % 3): 0 la suma o el centro de un 3 × 3 en progresión · 1 la casilla opuesta · 2 la suma de un 4 × 4.
    ahoraTu: {
      pieza: PZ,
      voz: 'Piensa qué se reparte entre las filas y qué líneas pasan por el centro.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const z = casoMag(r, { tipo: 'a0', desde: [1, 12], pasos: [1, 2, 3], clave: true }), pideC = Math.floor(s / 3) % 2 === 1, bien = pideC ? z.c : z.S, mx = z.nums[8];
          const ds = pideC ? [
            { id: 'suma', valor: z.S, error: 'RMP61', siFuera: `Hallaste bien la suma mágica, ${f0(z.S)}, pero el centro es su tercera parte.` },
            { id: 'mayor', valor: mx, error: 'RMP186', siFuera: 'Es cierto que el centro es especial, pero no por ser el mayor, sino porque cuatro líneas pasan por él.' },
            { id: 'total', valor: z.T, error: 'RMP61', siFuera: `${f0(z.T)} es el total, pero falta repartirlo entre las tres filas y dividir otra vez entre 3.` },
            { id: 'cuatro', valor: z.S / 4, error: 'RMP188', siFuera: 'Pensar en las cuatro líneas es la idea, pero el centro es la suma mágica dividida entre 3, no entre 4.' },
          ] : [
            { id: 'total', valor: z.T, error: 'RMP61', siFuera: `Sumaste bien: ${f0(z.T)} es el total, pero falta repartirlo entre las tres filas.` },
            { id: 'centro', valor: z.c, error: 'RMP61', siFuera: `${f0(z.c)} es el centro, y está bien hallado, pero piden lo que suma una fila.` },
            { id: 'extremos', valor: z.nums[0] + mx, error: 'RMP63', siFuera: 'Sumar es la idea, pero el primero más el último no reparte el total entre las filas.' },
            { id: 'mayor', valor: mx * 3, error: 'RMP185', siFuera: 'Pensar en las tres casillas de una fila es la idea, pero no todas pueden ser el número mayor.' },
          ];
          return { pregunta: `Un cuadrado mágico 3 × 3 usa una vez cada número: ${listaTxt(z.nums)}. ¿${pideC ? 'Qué número va en el centro' : 'Cuánto suma cada fila'}?`,
            datos: [D_MAGICO, D_FILAS, D_CENTRO], dibujo: vacio3(pideC ? { t: '?' } : null),
            opciones: opcionesNum(bien, ds),
            solucion: { texto: pideC ? 'La suma mágica es la tercera parte del total, y el centro es la tercera parte de la suma mágica.' : 'Cada fila suma el total dividido entre las tres filas.',
              ecuacion: pideC ? [S, ` = ${f0(z.T)} ÷ 3 = ${f0(z.S)}`, SEP, C, ` = ${f0(z.S)} ÷ 3 = `, I(f0(z.c))] : [S, ` = ${f0(z.T)} ÷ 3 = `, F(f0(z.S))] } };
        }
        if (tipo === 1) {
          const z = casoMag(r, { tipo: 'a1', desde: [1, 15], pasos: [1, 2, 3, 4] }), borde = r.ent(0, 1), aa = borde ? z.m[0][1] : z.m[0][0], xx = borde ? z.m[2][1] : z.m[2][2];
          const ds = [
            { id: 'sinC', valor: 3 * z.c - aa, error: 'RMP191', siFuera: `Restar de la suma mágica, ${f0(3 * z.c)}, es la idea, pero falta restar también el centro.` },
            { id: 'resta', valor: aa > z.c ? aa - z.c : z.c - aa, error: 'RMP191', siFuera: 'Comparar con el centro es la idea, pero dos casillas opuestas suman el doble del centro.' },
            { id: 'igual', valor: aa, error: 'RMP63', siFuera: `Buscar la casilla de enfrente es la idea, pero las dos opuestas suman ${f0(2 * z.c)}, el doble del centro, y ${f0(aa)} + ${f0(aa)} no da eso.` },
            { id: 'suma', valor: z.c + aa, error: 'RMP191', siFuera: `Juntar el centro y la casilla es la idea, pero la línea completa suma ${f0(3 * z.c)}.` },
            { id: 'S', valor: 3 * z.c, error: 'RMP61', siFuera: `${f0(3 * z.c)} es la suma mágica, y esa cuenta va bien, pero falta quitarle las otras dos casillas.` },
          ];
          const donde = borde ? 'la casilla de arriba en el medio' : 'la esquina de arriba a la izquierda', op = borde ? 'la casilla de abajo en el medio' : 'la esquina de abajo a la derecha';
          const dib = borde ? [[{ t: '' }, { t: f0(aa) }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '?' }, { t: '' }]]
            : [[{ t: f0(aa) }, { t: '' }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '?' }]];
          return { pregunta: `En un cuadrado mágico 3 × 3, el centro es ${f0(z.c)} y ${donde} es ${f0(aa)}. ¿Qué número va en ${op}?`,
            datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, la suma mágica es el triple del centro.'], dibujo: tab(dib),
            opciones: opcionesNum(xx, ds),
            solucion: { texto: 'La línea que pasa por las dos y por el centro suma el triple del centro.', ecuacion: [x, ` = 3 × ${f0(z.c)} − ${f0(aa)} − ${f0(z.c)} = `, H(f0(xx))] } };
        }
        let a, d, m, k;
        do { a = r.ent(1, 15); d = r.elegir([1, 1, 2]); k = `a2|${a}|${d}`; } while (usado('suma-magica', k) || (d === 1 && (a === 5 || a === 1)));
        m = desdeA(DURER, a, d);
        const nums = rango(a, a + 15 * d, d), Tn = suma(nums), bien = Tn / 4;
        const ds = [
          { id: 'total', valor: Tn, error: 'RMP61', siFuera: `${f0(Tn)} es el total, y esa cuenta va bien, pero falta repartirlo entre las 4 filas.` },
          { id: 'tres', valor: Tn / 3, error: 'RMP63', siFuera: 'Repartir es la idea, pero el 4 × 4 tiene cuatro filas, no tres.' },
          { id: 'doble', valor: Tn / 2, error: 'RMP193', siFuera: 'Repartir es la idea, pero entre 4 filas, y eso da la mitad de lo que tienes.' },
          { id: 'memoria', valor: 34, error: 'RMP63', siFuera: 'Es cierto que el 4 × 4 con los números del 1 al 16 suma 34, pero aquí los números son otros.' },
          { id: 'tarjeta', valor: Tn / 16, error: 'RMP192', siFuera: 'Repartir es la idea, pero entre las 4 filas, no entre las 16 tarjetas.' },
        ];
        return { pregunta: `Un cuadrado mágico 4 × 4 usa una vez cada uno de los números ${deA(nums, d)}. ¿Cuánto suma cada fila?`,
          datos: [D_MAGICO, D_FILAS, D_SEGUIDOS], dibujo: tab(m.map(f => f.map(() => ({ t: '' })))),
          opciones: opcionesNum(bien, ds),
          solucion: { texto: 'Cada fila suma el total de los 16 números dividido entre las cuatro filas.', ecuacion: [T, ` = (${f0(nums[0])} + ${f0(nums[15])}) × 16 ÷ 2 = ${f0(Tn)}`, SEP, S, ` = ${f0(Tn)} ÷ 4 = `, F(f0(bien))] } };
      },
    },
  };
  // ---------- Ejemplos resueltos de «El cuadrado mágico y su centro» ----------
  // Comprobados al cargar (esMagico sobre el Lo Shu pasado a cada lista) y aparte en scratchpad e9-rm (sumas y centros):
  // 1 → 18 · 2 → 6 · 3 → 34 · 4 → 11 · 5 → 27 · 6 → 8 · 7 → 6 · 8 → 42 · 9 → 24 · 10 → 21 · 11 → 21 (B) · 12 → 20 (A) ·
  // 13 → 68 (D) · 14 → 19 (C) · 15 → 30 (E).
  const M2 = desdeA(LS, 2), MI = desdeA(LS, 1, 2), M7 = desdeA(LS, 3, 1), M9 = desdeA(LS, 2, 1);
  if (!esMagico(M2) || suma(M2[0]) !== 18 || M2[1][1] !== 6 || suma(MI[0]) !== 27 || suma(desdeA(DURER, 3).flat()) !== 168 || suma(rango(2, 32, 2)) !== 272
    || !esMagico(LS.map(f => f.map(q => q + 2))) || suma(LS[0].map(q => q * 2)) !== 30 || LS[0][1] + LS[1][0] + LS[1][2] + LS[2][1] !== 20) throw new Error('ejemplos de la idea 4');
  const t3 = filas => tab(filas.map(f => f.map(q => (q === '' ? { t: '' } : q === '?' ? { t: '?' } : typeof q === 'object' ? q : { t: f0(q) }))));
  const cen = q => ({ t: f0(q), papel: 'compartida' });
  const EJEMPLOS_MAG = [
    ejemplo({ nivel: 1, titulo: 'Del 2 al 10', caso: 'a0|2|1',
      enunciado: 'Un cuadrado mágico 3 × 3 usa una vez cada número del 2 al 10. ¿Cuánto suma cada fila?',
      datos: [D_MAGICO, D_FILAS], figura: vacio3(null, { nota: 'Números del 2 al 10' }),
      solucion: [{ texto: 'Las tres filas se reparten el total.', ecuacion: [T, ' = 54', SEP, S, ' = 54 ÷ 3 = ', F('18')] }],
      respuesta: [S, ' = ', F('18')] }),
    ejemplo({ nivel: 1, titulo: 'El centro del 2 al 10', caso: 'centro|2|1',
      enunciado: 'En un cuadrado mágico 3 × 3 con los números del 2 al 10, cada fila suma 18. ¿Qué número va en el centro?',
      datos: [D_MAGICO, D_CENTRO], figura: vacio3({ t: '?' }),
      solucion: [{ texto: 'Las cuatro líneas que pasan por el centro suman 4 × 18 = 72, que es el total más el centro tres veces.', ecuacion: ['72 = 54 + 3 × ', C, SEP, C, ' = ', I('6')] }],
      respuesta: [C, ' = ', I('6')] }),
    ejemplo({ nivel: 1, titulo: 'El 4 × 4 clásico', caso: 'a2|1|1',
      enunciado: 'Un cuadrado mágico 4 × 4 usa una vez cada número del 1 al 16. ¿Cuánto suma cada fila?',
      datos: [D_MAGICO, D_FILAS, D_SEGUIDOS], figura: tab(DURER.map(f => f.map(() => ({ t: '' })))),
      solucion: [{ texto: 'Son dieciséis números seguidos, así que el total sale con la fórmula, y las cuatro filas se lo reparten.', ecuacion: [T, ' = (1 + 16) × 16 ÷ 2 = 136', SEP, S, ' = 136 ÷ 4 = ', F('34')] }],
      respuesta: [S, ' = ', F('34')] }),
    ejemplo({ nivel: 1, titulo: 'La esquina opuesta', caso: 'opuesta|7|3',
      enunciado: 'En un cuadrado mágico 3 × 3, el centro es 7 y una esquina es 3. ¿Qué número va en la esquina opuesta?',
      datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, dos casillas opuestas suman el doble del centro.'], figura: t3([[3, '', ''], ['', cen(7), ''], ['', '', '?']]),
      solucion: [{ texto: 'La diagonal tiene las dos esquinas y el centro, y las dos esquinas opuestas suman el doble del centro.', ecuacion: [x, ' = 2 × 7 − 3 = ', H('11')] }],
      respuesta: [x, ' = ', H('11')] }),
    ejemplo({ nivel: 1, titulo: 'Impares del 1 al 17', caso: 'a0|1|2',
      enunciado: 'Un cuadrado mágico 3 × 3 usa una vez cada impar del 1 al 17. ¿Cuánto suma cada fila?',
      datos: [D_MAGICO, D_FILAS, D_SEGUIDOS], figura: vacio3(null, { nota: 'Impares del 1 al 17' }),
      solucion: [{ texto: 'Son nueve impares seguidos, así que el total sale con la fórmula.', ecuacion: [T, ' = (1 + 17) × 9 ÷ 2 = 81', SEP, S, ' = 81 ÷ 3 = ', F('27')] }],
      respuesta: [S, ' = ', F('27')] }),
    ejemplo({ nivel: 2, titulo: 'Del centro a la suma', caso: 'centroS|24',
      enunciado: 'En un cuadrado mágico 3 × 3 cada línea suma 24. ¿Qué número va en el centro?',
      datos: [D_MAGICO, D_FILAS, D_CENTRO], figura: vacio3({ t: '?' }),
      solucion: [{ texto: 'Las tres filas suman el total, 72, y las cuatro líneas que pasan por el centro suman 96.', ecuacion: ['3 × 24 = 72', SEP, '4 × 24 = 96'] },
        { texto: 'Lo que sobra es el centro, contado tres veces de más.', ecuacion: ['96 − 72 = 24 = 3 × ', C, SEP, C, ' = ', I('8')] }],
      respuesta: [C, ' = ', I('8')] }),
    ejemplo({ nivel: 2, titulo: 'Completar la fila', caso: 'fila|1|8,1',
      enunciado: 'En un cuadrado mágico 3 × 3 con los números del 1 al 9, la fila de arriba tiene 8 y 1. ¿Qué número la completa?',
      datos: [D_MAGICO, D_FILAS], figura: t3([[8, 1, '?'], ['', '', ''], ['', '', '']]),
      solucion: [{ texto: 'Cada fila suma 45 ÷ 3 = 15.', ecuacion: [S, ' = 15'] }, { texto: 'A la fila le falta lo que necesita para llegar a 15.', ecuacion: [x, ' = 15 − 8 − 1 = ', H('6')] }],
      respuesta: [x, ' = ', H('6')] }),
    ejemplo({ nivel: 2, titulo: 'El 4 × 4 desde 3', caso: 'a2|3|1',
      enunciado: 'Un cuadrado mágico 4 × 4 usa una vez cada número del 3 al 18. ¿Cuánto suma cada fila?',
      datos: [D_MAGICO, D_FILAS, D_SEGUIDOS], figura: tab(DURER.map(f => f.map(() => ({ t: '' })))),
      solucion: [{ texto: 'Son dieciséis números seguidos, así que el total sale con la fórmula.', ecuacion: [T, ' = (3 + 18) × 16 ÷ 2 = 168'] }, { texto: 'Las cuatro filas se reparten el total.', ecuacion: [S, ' = 168 ÷ 4 = ', F('42')] }],
      respuesta: [S, ' = ', F('42')] }),
    ejemplo({ nivel: 2, titulo: 'Las cuatro esquinas', caso: 'esquinas|6',
      enunciado: 'En un cuadrado mágico 3 × 3 el centro es 6. ¿Cuánto suman las cuatro esquinas?',
      datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, dos casillas opuestas suman el doble del centro.'], figura: t3([['?', '', '?'], ['', cen(6), ''], ['?', '', '?']]),
      solucion: [{ texto: 'Las esquinas forman dos parejas opuestas, una por diagonal: cada pareja suma 12.', ecuacion: ['2 × 6 = 12', SEP, '12 + 12 = ', F('24')] }],
      respuesta: [F('24')] }),
    ejemplo({ nivel: 2, titulo: 'Dos más a cada una', caso: 'mas2|1',
      enunciado: 'Al cuadrado mágico 3 × 3 con 1 a 9 se le suma 2 a cada casilla. ¿Sigue siendo mágico? ¿Cuánto suma ahora cada línea?',
      datos: [D_MAGICO, 'Cada línea del 3 × 3 tiene tres casillas.', '1 + 2 + … + 9 = 45'], figura: tab(LS),
      solucion: [{ texto: 'Cada línea gana 2 en cada una de sus tres casillas, así que todas ganan 6 y siguen iguales.', ecuacion: [S, ' = 15 + 3 × 2 = ', F('21')] }],
      respuesta: [F('Sí; cada línea suma 21')] }),
    // Nivel 3 (tipo examen). Letras de la correcta: B, A, D, C, E.
    ejemplo({ nivel: 3, titulo: 'La diagonal dice el centro', caso: 'diag|4,10',
      enunciado: 'En un cuadrado mágico 3 × 3, una diagonal tiene 4 y 10 en sus esquinas. ¿Cuánto suma cada línea?',
      datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, dos casillas opuestas suman el doble del centro.'], figura: t3([[4, '', ''], ['', '?', ''], ['', '', 10]]),
      alternativas: ['14', '21', '7', '28'], correcta: '21',
      solucion: [{ texto: 'Las dos esquinas opuestas suman el doble del centro.', ecuacion: ['4 + 10 = 14 = 2 × ', C, SEP, C, ' = 7'] },
        { texto: 'La suma mágica es el triple del centro.', ecuacion: [S, ' = 3 × 7 = ', F('21')] }],
      explica: '14 es lo que suman las dos esquinas; 7 es el centro, y 28 son cuatro veces el centro.',
      respuesta: [F('21')] }),
    ejemplo({ nivel: 3, titulo: 'Las cuatro del borde', caso: 'bordes|1',
      enunciado: 'En un cuadrado mágico 3 × 3 con los números del 1 al 9, ¿cuánto suman las cuatro casillas del medio de cada borde (ni esquinas ni centro)?',
      datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, dos casillas opuestas suman el doble del centro.'], figura: t3([['', '?', ''], ['?', '', '?'], ['', '?', '']]),
      alternativas: ['20', '15', '30', '10', '45'], correcta: '20',
      solucion: [{ texto: 'El centro es 5, y esas cuatro casillas forman dos parejas opuestas: la de la columna del medio y la de la fila del medio.', ecuacion: ['2 × 5 = 10'] },
        { texto: 'Cada pareja suma el doble del centro, 10, y son dos parejas.', ecuacion: ['10 + 10 = ', F('20')] }],
      explica: '15 es una línea; 30 son dos líneas contando el centro; 10 es una sola pareja, y 45 es el total.',
      respuesta: [F('20')] }),
    ejemplo({ nivel: 3, titulo: 'Un 4 × 4 de pares', caso: 'a2|2|2',
      enunciado: 'Un cuadrado mágico 4 × 4 usa una vez cada número par del 2 al 32. ¿Cuánto suma cada fila?',
      datos: [D_MAGICO, D_FILAS, D_SEGUIDOS], figura: tab(DURER.map(f => f.map(() => ({ t: '' })))),
      alternativas: ['136', '34', '272', '68', '17'], correcta: '68',
      solucion: [{ texto: 'Son dieciséis pares seguidos, así que el total sale con la fórmula.', ecuacion: [T, ' = (2 + 32) × 16 ÷ 2 = 272'] }, { texto: 'Las cuatro filas se reparten el total.', ecuacion: [S, ' = 272 ÷ 4 = ', F('68')] }],
      explica: '136 reparte entre dos filas; 34 es la suma del 4 × 4 con 1 a 16; 272 es el total, y 17 reparte entre las 16 casillas.',
      respuesta: [F('68')] }),
    ejemplo({ nivel: 3, titulo: 'Dos casillas opuestas', caso: 'dos|9',
      enunciado: 'En un cuadrado mágico 3 × 3 el centro es 9. Una esquina es 5 y la casilla del medio de un borde es 12. ¿Cuánto suman sus dos casillas opuestas?',
      datos: [D_MAGICO, D_CENTRO, 'En el 3 × 3, dos casillas opuestas suman el doble del centro.'], figura: t3([[5, 12, ''], ['', cen(9), ''], ['', '?', '?']]),
      alternativas: ['27', '18', '19', '36'], correcta: '19',
      solucion: [{ texto: 'Cada opuesta es el doble del centro menos la que se conoce.', ecuacion: ['2 × 9 − 5 = 13', SEP, '2 × 9 − 12 = 6'] },
        { texto: 'Ahora sumo esas dos casillas opuestas.', ecuacion: ['13 + 6 = ', F('19')] }],
      explica: '27 es la suma mágica; 18 es lo que suma una sola pareja, y 36 son las dos parejas completas.',
      respuesta: [F('19')] }),
    ejemplo({ nivel: 3, titulo: 'Por dos cada casilla', caso: 'por2|1',
      enunciado: 'Cada número del cuadrado mágico 3 × 3 con 1 a 9 se multiplica por 2. ¿Cuánto suma ahora cada línea?',
      datos: [D_MAGICO, '1 + 2 + … + 9 = 45', 'Si cada sumando se duplica, la suma se duplica.'], figura: tab(LS),
      alternativas: ['15', '17', '45', '60', '30'], correcta: '30',
      solucion: [{ texto: 'Antes cada línea sumaba 15, y al duplicarse sus tres casillas, su suma también se duplica.', ecuacion: ['2 × 15 = ', F('30')] }],
      explica: '15 es la suma de antes; 17 suma 2 una sola vez; 45 es el total de antes, y 60 cuenta cuatro líneas.',
      respuesta: [F('30')] }),
  ];
  magico.ejemplos = EJEMPLOS_MAG;
  juntar('suma-magica', EJEMPLOS_MAG, ['a2|5|1', 'a0|1|1', 'r0|1|1']);
  // ---------- Idea 5: cuando las líneas multiplican ----------
  // Objeto de la primera pantalla: dos tiras de cartulina que multiplican (rm-casillas, escena «bandeja», op «×»). Cambia:
  // qué tarjeta de cada columna va arriba. · Permanece: 1, 2, 3, 4, 6 y 9, que multiplicadas dan 1296. · Progresa: el
  // producto de cada tira. · Se reserva: el centro del cuadrado que multiplica (Predice). · Debe verse: lo que una tira
  // gana, multiplicando, la otra lo pierde dividiendo.
  const J5_ARR = [2, 4, 9], J5_ABA = [1, 3, 6], prod = xs => xs.reduce((m, q) => m * q, 1);
  const filasJ5 = v => { const arr = [], aba = []; for (let k = 0; k < 3; k++) { const sube = v['c' + k] === 1; arr.push(sube ? J5_ABA[k] : J5_ARR[k]); aba.push(sube ? J5_ARR[k] : J5_ABA[k]); } return { arr, aba }; };
  if (prod(J5_ARR.concat(J5_ABA)) !== 1296 || prod(J5_ARR) === prod(J5_ABA)) throw new Error('juego de la idea 5');
  const xTxt = xs => xs.map(f0).join(' × ');
  function dibujoJ5(v) {
    const { arr, aba } = filasJ5(v);
    return { datos: { escena: 'bandeja', op: '×', conResultado: true, toques: ['c0', 'c1', 'c2'],
      filas: [{ cartas: cartas(arr), resultado: { t: `= ${f0(prod(arr))}` } }, { cartas: cartas(aba), resultado: { t: `= ${f0(prod(aba))}` } }],
      nota: [{ t: 'Cada tira multiplica sus tres tarjetas' }] }, estado: {} };
  }
  function lecturaJ5(v) {
    const { arr, aba } = filasJ5(v), a = prod(arr), b = prod(aba);
    if (a === b) return [`Arriba ${f0(a)} y abajo ${f0(b)}: el mismo producto, `, P, ` = ${f0(a)}`];
    return [`Arriba ${f0(a)} y abajo ${f0(b)}: juntas multiplican ${f0(a * b)}`];
  }
  // Cuadrados mágicos multiplicativos 3 × 3: p^A · q^B, con A y B dos cuadrados de exponentes 0, 1 y 2 (cada línea suma 3).
  // Su centro es p × q y cada línea multiplica (p × q) × (p × q) × (p × q).
  const EXA = [[1, 0, 2], [2, 1, 0], [0, 2, 1]], EXB = [[0, 2, 1], [2, 1, 0], [1, 0, 2]];
  const multi = (p, q) => EXA.map((f, i) => f.map((e, k) => p ** e * q ** EXB[i][k]));
  const esMulti = m => { const Ls = lineas(m); return Ls.every(l => prod(l) === prod(Ls[0])) && new Set(m.flat()).size === 9; };
  for (const [p, q] of [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]]) if (!esMulti(multi(p, q)) || multi(p, q)[1][1] !== p * q) throw new Error('idea 5: p^A · q^B es mágico');
  const M6 = multi(2, 3);
  const D_MULTI = 'En un cuadrado mágico multiplicativo, cada fila, columna y diagonal da el mismo producto P.';
  // El producto descompuesto en factores primos (como el dato de la Predice): una herramienta, no la respuesta. Antes iba una
  // tabla de cubos (« 15 → 3375 »), que regalaba el centro (auditoría, 26 nov).
  const factores = n => { const o = []; for (let p = 2; n > 1; p++) while (n % p === 0) { o.push(p); n /= p; } return o; };
  const D_FACT = Pn => `${f0(Pn)} = ${factores(Pn).map(f0).join(' × ')}`;
  const D_CENTRO_P = 'En el 3 × 3 que multiplica, el centro por sí mismo tres veces da P.';
  const D_CENTRO_M = 'Por el centro del 3 × 3 pasan cuatro líneas: la fila y la columna del medio y las dos diagonales.';
  function casoMulti(r, o) {
    for (let i = 0; i < 300; i++) {
      const [p, q] = r.elegir(o.pares), m = r.elegir(giros(multi(p, q))), c = p * q;
      if (usado('producto-magico', `${o.tipo}|${m.flat().join(',')}`)) continue;
      return { p, q, m, c, P: c * c * c };
    }
    throw new Error('casoMulti');
  }
  const multiplica = {
    id: 'producto-magico',
    titulo: 'Cuando las líneas multiplican',
    pregunta: '¿Qué cambia si las líneas multiplican en vez de sumar?',
    temas: ['Cuadrados mágicos'],
    pieza: PZ,
    aprendizaje: 'En el cuadrado que multiplica, el centro por sí mismo tres veces da el producto común, y dos opuestas multiplican el centro por sí mismo.',
    actividad: 'Voltear columnas de dos tiras hasta que las dos multipliquen lo mismo.',
    // Lee: las tiras, el producto común P y qué mirar. No dice qué va en el centro del cuadrado con 216 (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Tiras que multiplican', texto: 'En la misma kermés del colegio, este juego usa una bandeja con dos tiras de tres tarjetas: la de arriba y la de abajo. Aquí no se suma, porque cada tira multiplica sus tres números.',
          pieza: PZ, dibujo: bandeja([{ cartas: cartas(J5_ARR) }, { cartas: cartas(J5_ABA) }], { op: '×' }) },
        { titulo: 'El producto común', texto: ['Si todas las líneas multiplican lo mismo, ese resultado es el producto común, ', P, '. Un cuadrado mágico multiplicativo pide el mismo producto en filas, columnas y diagonales.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cada columna se voltea al tocarla. Mira qué pasa con los dos productos cuando una tarjeta grande sube y una chica baja.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Hay seis tarjetas en dos tiras: 2, 4 y 9 arriba, y 1, 3 y 6 abajo. Cada tira multiplica sus tres números.',
      mision: {
        texto: 'Haz que las dos tiras den el mismo producto.',
        logrado: v => { const f = filasJ5(v); return prod(f.arr) === prod(f.aba); },
        bien: ['Las dos dan lo mismo: multiplicadas entre sí, dan el producto de las seis.'],
      },
      voz: 'Aquí no se reparte sumando: se reparte multiplicando.',
      leyenda: [
        { s: '= 72', t: 'el producto de cada tira, a su derecha' },
        { s: P, t: 'el producto común, si las tiras coinciden' },
      ],
      controles: [0, 1, 2].map(k => ({ id: 'c' + k, etiqueta: `Columna ${k + 1}`, opciones: [{ valor: 0, texto: `${f0(J5_ARR[k])} arriba` }, { valor: 1, texto: `${f0(J5_ABA[k])} arriba` }] })),
      dibujo: v => dibujoJ5(v),
      lectura: v => lecturaJ5(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cuadrado mágico 3 × 3 multiplica: cada fila, columna y diagonal da 216. ¿Qué número va en el centro?',
      datos: ['216 = 2 × 2 × 2 × 3 × 3 × 3'],
      voz: 'Piensa en el centro de la idea anterior, pero multiplicando.',
      opciones: [
        { id: 'aditivo', texto: '72', error: 'RMP65', siFuera: 'Buscar el centro como en el cuadrado de sumas es la idea, pero aquí se multiplica, así que 216 ÷ 3 no sirve.' },
        { id: 'cuatro', texto: '54', error: 'RMP188', siFuera: 'Pensar en las cuatro líneas del centro es la idea, pero dividir 216 entre 4 no da el centro.' },
        { id: 'c', texto: '6', correcta: true },
        { id: 'nose', texto: 'No se sabe sin las otras casillas', error: 'RMP187', siFuera: 'Es cierto que faltan casillas, pero el centro queda fijo, como en el cuadrado de sumas.' },
      ],
      dibujo: vacio3({ t: '?' }, { nota: 'Cada línea multiplica 216' }),
      revelar: tab(M6.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: '6', papel: 'seguro' } : { t: f0(q) }))), { nota: 'Cada línea multiplica 216' }),
      coincide: 'Coincide: 6 × 6 × 6 = 216, y el centro entra en las cuatro líneas.',
      noCoincide: 'Revisemos: aquí las líneas multiplican.',
    },
    mira: {
      pieza: PZ,
      datos: { escena: 'tablero', celdas: M6.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: '6', papel: 'compartida' } : { t: f0(q) }))),
        lineas: [{ tipo: 'fila', k: 1, papel: 'compartida', desde: 1 }, { tipo: 'columna', k: 1, papel: 'compartida', desde: 1 }, { tipo: 'diagonal', papel: 'compartida', desde: 1 }, { tipo: 'contra', papel: 'compartida', desde: 1 }],
        nota: [{ t: 'Cada línea multiplica 216' }, { t: '2 × 18 = 36 = 6 × 6', desde: 3 }] },
      voz: 'Lo mismo que en el de sumas, pero multiplicando.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las tres filas juntas multiplican las nueve casillas.', ecuacion: ['216 × 216 × 216'] },
        { estado: { corte: 1 }, texto: 'Las cuatro líneas que pasan por el centro multiplican las nueve casillas y, además, el centro tres veces más.' },
        { estado: { corte: 2 }, texto: 'Lo que esas cuatro líneas tienen de más es el centro multiplicado tres veces por sí mismo.', ecuacion: [C, ' × ', C, ' × ', C, ' = 216', SEP, C, ' = 6'] },
        { estado: { corte: 3 }, texto: 'Dos casillas opuestas multiplican lo mismo que el centro por sí mismo.', ecuacion: ['2 × 18 = 6 × 6'] },
      ],
    },
    regla: {
      texto: 'En el cuadrado mágico multiplicativo 3 × 3, el centro multiplicado tres veces por sí mismo da P, y dos casillas opuestas multiplican lo mismo que el centro por sí mismo. La casilla que falta se halla dividiendo.',
      ecuacion: [P, ' = ', C, ' × ', C, ' × ', C, SEP, 'a × b = ', C, ' × ', C, SEP, x, ' = ', P, ' ÷ (otras dos)'],
      condicion: 'las líneas multiplican en vez de sumar, el cuadrado es de 3 × 3 y todos sus números son positivos.',
      voz: 'Donde sumabas, multiplica; donde restabas, divide.',
    },
    ejemplos: null,
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = s % 3, z = casoMulti(r, { tipo: 'r' + tipo, pares: [[2, 7]] }), m = z.m;
        const base = { datos: tipo === 0 ? [D_MULTI, D_CENTRO_M, D_FACT(z.P)] : [D_MULTI, D_CENTRO_M] };
        if (tipo === 0) return Object.assign(base, {
          enunciado: `Un cuadrado mágico 3 × 3 multiplica: cada fila, columna y diagonal da ${f0(z.P)}. ¿Qué número va en el centro?`, dibujo: vacio3({ t: '?' }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el número del centro.' },
            { tipo: 'datos', texto: `Cada línea multiplica ${f0(z.P)}.` },
            { tipo: 'regla', texto: 'Las cuatro líneas que pasan por el centro tienen las nueve casillas y el centro tres veces más; las tres filas tienen solo las nueve. Lo que sobra es el centro por sí mismo tres veces.' },
            { tipo: 'cuentas', texto: `Busco el número que, por sí mismo tres veces, da ${f0(z.P)}.`, ecuacion: [`${f0(z.c)} × ${f0(z.c)} × ${f0(z.c)} = ${f0(z.P)}`, SEP, C, ' = ', I(f0(z.c))], dibujo: tab(m.map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: f0(q), papel: 'seguro' } : { t: f0(q) })))) },
            { tipo: 'sentido', texto: `Una fila lo confirma: ${xTxt(m[0])} = ${f0(z.P)}.` },
          ], respuesta: [C, ' = ', I(f0(z.c))] });
        const aa = m[0][0], xx = m[2][2];
        if (tipo === 1) return Object.assign(base, {
          enunciado: `En un cuadrado mágico multiplicativo 3 × 3, el centro es ${f0(z.c)} y la esquina de arriba a la izquierda es ${f0(aa)}. ¿Qué va en la esquina de abajo a la derecha?`,
          dibujo: tab([[{ t: f0(aa) }, { t: '' }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '?' }]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden la esquina opuesta a la que se conoce.' },
            { tipo: 'datos', texto: `El centro es ${f0(z.c)}: cada línea multiplica ${f0(z.c)} × ${f0(z.c)} × ${f0(z.c)}.`, ecuacion: [P, ` = ${f0(z.P)}`] },
            { tipo: 'regla', texto: 'En la diagonal, las dos esquinas multiplican lo mismo que el centro por sí mismo.' },
            { tipo: 'cuentas', texto: 'Como aquí se multiplica, divido en vez de restar.', ecuacion: [x, ` = ${f0(z.c)} × ${f0(z.c)} ÷ ${f0(aa)} = `, H(f0(xx))] },
            { tipo: 'sentido', texto: `La diagonal lo confirma: ${f0(aa)} × ${f0(z.c)} × ${f0(xx)} = ${f0(z.P)}.` },
          ], respuesta: [x, ' = ', H(f0(xx))] });
        return Object.assign(base, {
          enunciado: `Un cuadrado mágico 3 × 3 multiplica ${f0(z.P)} en cada línea. La fila de arriba tiene ${f0(m[0][0])} y ${f0(m[0][1])}. ¿Qué número la completa?`,
          dibujo: tab([[{ t: f0(m[0][0]) }, { t: f0(m[0][1]) }, { t: '?' }], [{ t: '' }, { t: '' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '' }]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden el número que completa la fila.' },
            { tipo: 'datos', texto: `Las dos casillas que ya están multiplican ${f0(m[0][0] * m[0][1])}.` },
            { tipo: 'regla', texto: 'La fila multiplica el producto común, así que el número que falta es ese producto dividido entre lo que ya multiplican las otras dos.' },
            { tipo: 'cuentas', texto: 'Como aquí se multiplica, divido en vez de restar.', ecuacion: [x, ` = ${f0(z.P)} ÷ ${f0(m[0][0] * m[0][1])} = `, H(f0(m[0][2]))] },
            { tipo: 'sentido', texto: `La fila completa lo confirma: ${xTxt(m[0])} = ${f0(z.P)}.` },
          ], respuesta: [x, ' = ', H(f0(m[0][2]))] });
      },
    },
    // Ahora tú (semilla % 3): 0 el centro con P, o P con el centro · 1 la casilla opuesta · 2 la que falta en una fila.
    ahoraTu: {
      pieza: PZ,
      voz: 'Donde sumabas, multiplica.',
      generar(s) {
        const r = azar(s), tipo = s % 3, z = casoMulti(r, { tipo: 'a' + tipo, pares: tipo === 0 ? [[3, 7], [2, 11], [2, 13]] : [[2, 5], [3, 5], [2, 3]] }), m = z.m;
        const datos = [D_MULTI, D_CENTRO_M, D_FACT(z.P)];
        if (tipo === 0) {
          if (Math.floor(s / 3) % 2 === 0) {
            const ds = [
              { id: 'aditivo', valor: z.P / 3, error: 'RMP65', siFuera: 'Buscar el centro es la idea, pero aquí no se divide entre 3 como en el cuadrado de sumas.' },
              { id: 'cuatro', valor: z.P / 4, error: 'RMP188', siFuera: 'Pensar en las cuatro líneas es la idea, pero dividir entre 4 no da el centro.' },
              { id: 'dos', valor: z.c * z.c, error: 'RMP194', siFuera: `Multiplicar el centro por sí mismo es la idea, pero son tres veces: ${f0(z.c * z.c)} lo multiplica solo dos.` },
              { id: 'suma', valor: 3 * z.c, error: 'RMP65', siFuera: 'Es cierto que el centro va tres veces, pero multiplicado, no sumado.' },
            ];
            return { pregunta: `Un cuadrado mágico 3 × 3 multiplica: cada fila, columna y diagonal da ${f0(z.P)}. ¿Qué número va en el centro?`, datos, dibujo: vacio3({ t: '?' }),
              opciones: opcionesNum(z.c, ds),
              solucion: { texto: `Las cuatro líneas del centro tienen las nueve casillas y el centro tres veces más: el centro por sí mismo tres veces da ${f0(z.P)}.`, ecuacion: [`${f0(z.c)} × ${f0(z.c)} × ${f0(z.c)} = ${f0(z.P)}`, SEP, C, ' = ', I(f0(z.c))] } };
          }
          const ds = [
            { id: 'suma', valor: 3 * z.c, error: 'RMP65', siFuera: 'Es cierto que el centro va tres veces, pero multiplicado, no sumado.' },
            { id: 'dos', valor: z.c * z.c, error: 'RMP194', siFuera: 'Multiplicar el centro por sí mismo es la idea, pero son tres veces, no dos.' },
            { id: 'cuatro', valor: z.c * z.c * z.c * z.c, error: 'RMP188', siFuera: 'Es cierto que el centro está en cuatro líneas, pero cada línea da el centro multiplicado por sí mismo tres veces, no cuatro.' },
          ];
          return { pregunta: `En un cuadrado mágico multiplicativo 3 × 3, el centro es ${f0(z.c)}. ¿Qué producto da cada línea?`, datos: [D_MULTI, D_CENTRO_M], dibujo: vacio3({ t: f0(z.c), papel: 'compartida' }),
            opciones: opcionesNum(z.P, ds),
            solucion: { texto: 'El producto de cada línea es el centro multiplicado tres veces por sí mismo.', ecuacion: [P, ` = ${f0(z.c)} × ${f0(z.c)} × ${f0(z.c)} = `, F(f0(z.P))] } };
        }
        if (tipo === 1) {
          const borde = r.ent(0, 1), aa = borde ? m[0][1] : m[0][0], xx = borde ? m[2][1] : m[2][2];
          const ds = [
            { id: 'aditivo', valor: 2 * z.c - aa, error: 'RMP65', siFuera: 'Usar las casillas opuestas es la idea, pero aquí se multiplican, no se suman como en el cuadrado de sumas.' },
            { id: 'sinDiv', valor: z.c * z.c, error: 'RMP61', siFuera: `${f0(z.c * z.c)} es lo que multiplican las dos opuestas, pero falta dividirlo entre ${f0(aa)}.` },
            { id: 'P', valor: z.P / aa, error: 'RMP191', siFuera: 'Dividir es la idea, pero falta dividir también entre el centro.' },
            { id: 'igual', valor: aa, error: 'RMP63', siFuera: `Buscar la casilla de enfrente es la idea, pero las dos opuestas multiplican ${f0(z.c * z.c)}, el centro por sí mismo, y ${f0(aa)} × ${f0(aa)} no da eso.` },
            { id: 'cxa', valor: z.c * aa, error: 'RMP191', siFuera: `Multiplicar es la idea, pero la casilla de enfrente es ${f0(z.c)} × ${f0(z.c)} ÷ ${f0(aa)}.` },
          ];
          const dib = borde ? [[{ t: '' }, { t: f0(aa) }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '?' }, { t: '' }]]
            : [[{ t: f0(aa) }, { t: '' }, { t: '' }], [{ t: '' }, { t: f0(z.c), papel: 'compartida' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '?' }]];
          return { pregunta: `En un cuadrado mágico multiplicativo 3 × 3, el centro es ${f0(z.c)} y ${borde ? 'la casilla de arriba en el medio' : 'la esquina de arriba a la izquierda'} es ${f0(aa)}. ¿Qué va en ${borde ? 'la casilla de abajo en el medio' : 'la esquina de abajo a la derecha'}?`,
            datos: [D_MULTI, D_CENTRO_M], dibujo: tab(dib), opciones: opcionesNum(xx, ds),
            solucion: { texto: 'Las dos casillas opuestas multiplican lo mismo que el centro por sí mismo.', ecuacion: [x, ` = ${f0(z.c)} × ${f0(z.c)} ÷ ${f0(aa)} = `, H(f0(xx))] } };
        }
        const f = r.ent(0, 2), fila = m[f], ab = fila[0] * fila[1];
        const ds = [
          { id: 'resta', valor: z.P - fila[0] - fila[1], error: 'RMP65', siFuera: 'Quitar lo que ya está es la idea, pero aquí se divide en vez de restar.' },
          { id: 'una', valor: z.P / fila[0], error: 'RMP63', siFuera: `Dividir es la idea, pero falta dividir también entre ${f0(fila[1])}.` },
          { id: 'ab', valor: ab, error: 'RMP61', siFuera: `${f0(ab)} es lo que ya multiplica la fila, pero falta el número que la completa.` },
          { id: 'centro', valor: z.c, error: 'RMP186', siFuera: 'Mirar el centro es una idea, pero la casilla que falta no es el centro.' },
        ];
        const nom = ['de arriba', 'del medio', 'de abajo'][f];
        return { pregunta: `Un cuadrado mágico 3 × 3 multiplica ${f0(z.P)} en cada línea. La fila ${nom} tiene ${f0(fila[0])} y ${f0(fila[1])}. ¿Qué número la completa?`,
          datos: [D_MULTI], dibujo: tab([0, 1, 2].map(i => (i === f ? [{ t: f0(fila[0]) }, { t: f0(fila[1]) }, { t: '?' }] : [{ t: '' }, { t: '' }, { t: '' }]))),
          opciones: opcionesNum(fila[2], ds),
          solucion: { texto: 'Lo que falta es el producto de la fila dividido entre lo que ya multiplican las otras dos.', ecuacion: [x, ` = ${f0(z.P)} ÷ ${f0(ab)} = `, H(f0(fila[2]))] } };
      },
    },
  };
  // ---------- Ejemplos resueltos de «Cuando las líneas multiplican» ----------
  // Comprobados al cargar (esMulti sobre cada cuadrado) y aparte en scratchpad e9-rm (productos línea por línea):
  // 1 → 10 · 2 → 64 · 3 → 9 · 4 → 12 · 5 → 3 · 6 → 36 · 7 → 7 · 8 → 25 · 9 → 20 · 10 → solo multiplica · 11 → 71 (B) ·
  // 12 → 75 (A) · 13 → 1296 (E) · 14 → 15 (C) · 15 → 1728 (D).
  const M10 = multi(2, 5), M15 = multi(3, 5);
  if (!esMulti(M10) || !esMulti(M15) || prod(M10[0]) !== 1000 || prod(M15[0]) !== 3375 || 6 * 6 / 4 !== 9 || 216 / (2 * 9) !== 12 || 1296 !== 36 * 36
    || [M6[0][1], M6[0][2] * 0 + 18, 3, 36, 1, 4].reduce((a, b) => a + b, 0) !== 71 || M6[0][0] * M6[2][2] !== 36 || 2 * 2 * 2 * 216 !== 1728
    || suma(M6.flat()) !== 91 || suma(M6[0]) === suma(M6[1])) throw new Error('ejemplos de la idea 5');
  const EJEMPLOS_PRO = [
    ejemplo({ nivel: 1, titulo: 'El centro con 1000', caso: 'a0|centro|1000',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 1000 en cada fila, columna y diagonal. ¿Qué número va en el centro?',
      datos: [D_MULTI, D_CENTRO_M, D_FACT(1000)], figura: vacio3({ t: '?' }),
      solucion: [{ texto: 'Las cuatro líneas del centro tienen las nueve casillas, que multiplican 1000 × 1000 × 1000 como las tres filas, y el centro tres veces más. Por eso el centro por sí mismo tres veces da 1000.' },
        { texto: 'Los factores de 1000 se juntan en tres grupos iguales, 2 × 5 en cada uno.', ecuacion: ['10 × 10 × 10 = 1000', SEP, C, ' = ', I('10')] }],
      respuesta: [C, ' = ', I('10')] }),
    ejemplo({ nivel: 1, titulo: 'Del centro al producto', caso: 'P|4',
      enunciado: 'En un cuadrado mágico multiplicativo 3 × 3, el centro es 4. ¿Qué producto da cada línea?',
      datos: [D_MULTI, D_CENTRO_M], figura: vacio3({ t: '4', papel: 'compartida' }),
      solucion: [{ texto: 'El producto de cada línea es el centro multiplicado tres veces por sí mismo.', ecuacion: [P, ' = 4 × 4 × 4 = ', F('64')] }],
      respuesta: [P, ' = ', F('64')] }),
    ejemplo({ nivel: 1, titulo: 'La esquina opuesta', caso: 'op|6|4',
      enunciado: 'En un cuadrado mágico multiplicativo 3 × 3, el centro es 6 y una esquina es 4. ¿Qué va en la esquina opuesta?',
      datos: [D_MULTI, 'En el 3 × 3 que multiplica, dos opuestas multiplican el centro por sí mismo.'], figura: t3([[4, '', ''], ['', cen(6), ''], ['', '', '?']]),
      solucion: [{ texto: 'Las dos esquinas opuestas multiplican lo mismo que el centro por sí mismo: 6 × 6 = 36.', ecuacion: [x, ' = 36 ÷ 4 = ', H('9')] }],
      respuesta: [x, ' = ', H('9')] }),
    ejemplo({ nivel: 1, titulo: 'Completar una fila', caso: 'fila|216|2,9',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 216 en cada línea. Una fila tiene 2 y 9. ¿Qué número la completa?',
      datos: [D_MULTI], figura: t3([[2, 9, '?'], ['', '', ''], ['', '', '']]),
      solucion: [{ texto: 'Como la fila multiplica, divido 216 entre lo que ya tiene en vez de restar.', ecuacion: [x, ' = 216 ÷ (2 × 9) = 216 ÷ 18 = ', H('12')] }],
      respuesta: [x, ' = ', H('12')] }),
    ejemplo({ nivel: 1, titulo: 'El centro con 512', caso: 'a0|centro|512',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 512 en cada línea (puede repetir números). ¿Qué número va en el centro?',
      datos: [D_MULTI, D_CENTRO_M, D_FACT(512)], figura: vacio3({ t: '?' }),
      solucion: [{ texto: 'El centro multiplicado tres veces por sí mismo da 512, como en todo cuadrado que multiplica: los nueve doses se juntan en tres grupos de tres.', ecuacion: ['8 × 8 × 8 = 512', SEP, C, ' = ', I('8')] }],
      respuesta: [C, ' = ', I('8')] }),
    ejemplo({ nivel: 2, titulo: 'Dos tiras iguales', caso: 'tiras|1,2,3,4,6,9',
      enunciado: 'Las tarjetas 1, 2, 3, 4, 6 y 9 van en dos tiras de tres, y las dos tiras multiplican lo mismo. ¿Cuánto da cada tira?',
      datos: ['Una tira multiplica sus tres tarjetas.', 'Las dos tiras juntas multiplican las seis tarjetas.'], figura: bandeja([{ cartas: huecos(3) }, { cartas: huecos(3) }], { op: '×', meta: 'Tarjetas 1, 2, 3, 4, 6 y 9' }),
      solucion: [{ texto: 'Las seis tarjetas multiplican 1296, y como las dos tiras dan lo mismo, ese producto multiplicado por sí mismo da 1296.', ecuacion: ['1 × 2 × 3 × 4 × 6 × 9 = 1296', SEP, '36 × 36 = 1296'] },
        { texto: 'Se arma con 1 × 4 × 9 y 2 × 3 × 6.', ecuacion: [P, ' = ', F('36')] }],
      respuesta: [P, ' = ', F('36')] }),
    ejemplo({ nivel: 2, titulo: 'El centro con 1728', caso: 'a0|centro|1728',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 1728 en cada línea (puede repetir números). ¿Qué va en el centro y qué producto dan sus dos esquinas de una diagonal?',
      datos: [D_MULTI, D_CENTRO_M, D_FACT(1728)], figura: vacio3({ t: '?' }),
      solucion: [{ texto: 'El centro multiplicado tres veces por sí mismo da 1728: los factores se juntan en tres grupos iguales, 2 × 2 × 3 en cada uno.', ecuacion: ['12 × 12 × 12 = 1728', SEP, C, ' = ', I('12')] },
        { texto: 'Las dos esquinas de la diagonal multiplican el centro por sí mismo.', ecuacion: ['12 × 12 = 144'] }],
      respuesta: [C, ' = ', I('12'), '; las esquinas, 144'] }),
    ejemplo({ nivel: 2, titulo: 'La opuesta en el de 1000', caso: 'op|10|4',
      enunciado: 'En un cuadrado mágico multiplicativo 3 × 3, cada línea da 1000 y una esquina es 4. ¿Qué va en la esquina opuesta?',
      datos: [D_MULTI, D_CENTRO_P, D_FACT(1000), 'En el 3 × 3 que multiplica, dos opuestas multiplican el centro por sí mismo.'], figura: t3([[4, '', ''], ['', '?', ''], ['', '', '?']]),
      solucion: [{ texto: 'Primero el centro, que por sí mismo tres veces da el producto de cada línea: 10 × 10 × 10 = 1000.', ecuacion: [C, ' = 10'] }, { texto: 'Las esquinas opuestas multiplican lo mismo que 10 × 10, es decir, 100.', ecuacion: [x, ' = 100 ÷ 4 = ', H('25')] }],
      respuesta: [x, ' = ', H('25')] }),
    ejemplo({ nivel: 2, titulo: 'Fila del de 1000', caso: 'fila|1000|2,25',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 1000 en cada línea. La fila de arriba tiene 2 y 25. ¿Qué número la completa?',
      datos: [D_MULTI], figura: t3([[2, 25, '?'], ['', '', ''], ['', '', '']]),
      solucion: [{ texto: 'Las dos que ya están multiplican 2 × 25 = 50, y divido en vez de restar.', ecuacion: [x, ' = 1000 ÷ 50 = ', H('20')] }],
      respuesta: [x, ' = ', H('20')] }),
    ejemplo({ nivel: 2, titulo: '¿Suma o multiplica?', caso: 'cual|216',
      enunciado: 'En este cuadrado, ¿las filas suman lo mismo o multiplican lo mismo?',
      datos: [D_MAGICO, D_MULTI], figura: tab(M6),
      solucion: [{ texto: 'Sumadas, las filas no coinciden.', ecuacion: ['2 + 9 + 12 = 23', SEP, '36 + 6 + 1 = 43'] },
        { texto: 'Multiplicadas, sí: todas dan 216.', ecuacion: ['2 × 9 × 12 = 216', SEP, '36 × 6 × 1 = 216'] }],
      respuesta: [F('Multiplican lo mismo: 216')] }),
    // Nivel 3 (tipo examen). Letras de la correcta: B, A, E, C, D.
    ejemplo({ nivel: 3, titulo: 'Completar y sumar', caso: 'completar|216',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 216 en cada línea. La fila de arriba empieza en 2 y termina en 12, y el centro es 6. Complétalo. ¿Cuánto suman los seis números que pusiste?',
      datos: [D_MULTI, D_CENTRO_M], figura: t3([[2, '?', 12], ['?', cen(6), '?'], ['?', '?', '?']]),
      alternativas: ['91', '71', '77', '216'], correcta: '71',
      solucion: [{ texto: 'Arriba falta 216 ÷ (2 × 12) = 9. Cada esquina de abajo es 36 entre su esquina opuesta: 36 ÷ 12 = 3 y 36 ÷ 2 = 18.' },
        { texto: 'Las tres que quedan completan su línea: en la columna izquierda, 216 ÷ (2 × 3) = 36; en la derecha, 216 ÷ (12 × 18) = 1, y abajo, 216 ÷ (3 × 18) = 4.', ecuacion: ['9 + 3 + 18 + 36 + 1 + 4 = ', F('71')] }],
      explica: '91 suma también los tres que ya estaban; 77 suma además el centro, y 216 es el producto de cada línea.',
      respuesta: [F('71')] }),
    ejemplo({ nivel: 3, titulo: 'La opuesta del 3', caso: 'op|15|3',
      enunciado: 'En un cuadrado mágico multiplicativo 3 × 3, el centro es 15 y una esquina es 3. ¿Qué va en la esquina opuesta?',
      datos: [D_MULTI, 'En el 3 × 3 que multiplica, dos opuestas multiplican el centro por sí mismo.'], figura: t3([[3, '', ''], ['', cen(15), ''], ['', '', '?']]),
      alternativas: ['75', '27', '45', '225', '12'], correcta: '75',
      solucion: [{ texto: 'Las dos esquinas multiplican 15 × 15 = 225.', ecuacion: [x, ' = 225 ÷ 3 = ', H('75')] }],
      explica: '27 usa la regla del cuadrado de sumas (2 × 15 − 3); 45 es 3 × 15; 225 multiplica el centro por sí mismo pero no divide entre 3, y 12 resta 3 de 15.',
      respuesta: [x, ' = ', H('75')] }),
    ejemplo({ nivel: 3, titulo: 'Las cuatro esquinas', caso: 'esq|6',
      enunciado: 'En un cuadrado mágico multiplicativo 3 × 3 el centro es 6. ¿Cuánto da multiplicar sus cuatro esquinas?',
      datos: [D_MULTI, 'En el 3 × 3 que multiplica, dos opuestas multiplican el centro por sí mismo.'], figura: t3([['?', '', '?'], ['', cen(6), ''], ['?', '', '?']]),
      alternativas: ['72', '216', '36', '24', '1296'], correcta: '1296',
      solucion: [{ texto: 'Las cuatro esquinas forman dos parejas opuestas, una por diagonal, y cada pareja multiplica 6 × 6 = 36.', ecuacion: ['36 × 36 = ', F('1296')] }],
      explica: '72 suma las dos parejas en vez de multiplicarlas; 216 es una línea; 36 es una sola pareja, y 24 suma cuatro centros.',
      respuesta: [F('1296')] }),
    ejemplo({ nivel: 3, titulo: 'El centro con 3375', caso: 'a0|centro|3375',
      enunciado: 'Un cuadrado mágico 3 × 3 multiplica 3375 en cada línea. ¿Qué número va en el centro?',
      datos: [D_MULTI, D_CENTRO_M, D_FACT(3375)], figura: vacio3({ t: '?' }),
      alternativas: ['1125', '225', '15', '45'], correcta: '15',
      solucion: [{ texto: 'Las cuatro líneas del centro tienen las nueve casillas, que multiplican lo que las tres filas, y el centro tres veces más: el centro por sí mismo tres veces da 3375.' },
        { texto: 'Los factores de 3375 se juntan en tres grupos iguales, 3 × 5 en cada uno.', ecuacion: ['15 × 15 × 15 = 3375', SEP, C, ' = ', I('15')] }],
      explica: '1125 divide entre 3, como en el cuadrado de sumas; 225 es 15 × 15, y 45 suma tres veces 15.',
      respuesta: [C, ' = ', I('15')] }),
    ejemplo({ nivel: 3, titulo: 'Todo por dos', caso: 'por2|216',
      enunciado: 'Cada número del cuadrado mágico multiplicativo que da 216 se multiplica por 2. ¿Qué producto da ahora cada línea?',
      datos: [D_MULTI, 'Cada línea del 3 × 3 tiene tres casillas.'], figura: tab(M6),
      alternativas: ['432', '1296', '648', '1728', '216'], correcta: '1728',
      solucion: [{ texto: 'Cada una de las tres casillas de una línea se multiplica por 2, así que el producto de la línea se multiplica por 2 tres veces.', ecuacion: ['216 × 2 × 2 × 2 = ', F('1728')] }],
      explica: '432 multiplica por 2 una sola vez; 1296 multiplica por 6; 648 multiplica por 3, y 216 deja el producto sin cambio.',
      respuesta: [F('1728')] }),
  ];
  multiplica.ejemplos = EJEMPLOS_PRO;
  juntar('producto-magico', EJEMPLOS_PRO, []);
  // ---------- Idea 6: la pirámide de sumas ----------
  // Objeto de la primera pantalla: el muro de adobes (rm-casillas, escena «muro»). Cambia: los tres adobes de abajo.
  // · Permanece: cada adobe vale la suma de los dos de abajo. · Progresa: la cima. · Se reserva: el muro de cuatro abajo
  // (Predice). · Debe verse: el del medio sube por dos caminos.
  const subir = b => { const filas = [b.slice()]; while (filas[0].length > 1) filas.unshift(filas[0].slice(1).map((q, i) => filas[0][i] + q)); return filas; };
  const cimaDe = b => subir(b)[0][0];
  const pesos = k => { let p = [1]; for (let i = 1; i < k; i++) p = [1].concat(p.slice(1).map((q, j) => p[j] + q), [1]); return p; };
  // Los pesos se comprueban contra la pirámide de verdad (con un 1 en un solo lugar de la base).
  for (let k = 1; k <= 6; k++) for (let j = 0; j < k; j++) { const b = Array(k).fill(0); b[j] = 1; if (cimaDe(b) !== pesos(k)[j]) throw new Error('idea 6: pesos'); }
  const muro = (filas, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'muro', filas }, o), estado: {} });
  const muroBase = (b, o = {}) => { const k = b.length; return muro(Array.from({ length: k }, (_, i) => (i === k - 1 ? cartas(b) : i === 0 ? [{ t: '?' }] : huecos(i + 1))), o); };
  const muroLleno = (b, o = {}) => muro(subir(b).map((f, i) => f.map(q => (i === 0 ? { t: f0(q), papel: 'seguro' } : { t: f0(q) }))), o);
  const pesosTxt = k => pesos(k).map(w => ({ t: `× ${f0(w)}`, papel: 'compartida' }));
  // La cuenta de la cima con sus caminos; con cinco abajo va en dos renglones (no cabe a 390 px).
  const cuentaCima = (b, w, fin) => { const t = b.map((q, j) => `${f0(q)} × ${f0(w[j])}`);
    if (b.length < 5) return [`${t.join(' + ')} = `, fin];
    const p = suma(b.slice(0, 3).map((q, j) => q * w[j])); return [`${t.slice(0, 3).join(' + ')} = ${f0(p)}`, SEP, `${f0(p)} + ${t.slice(3).join(' + ')} = `, fin]; };
  const J6 = v => [v.a, v.b, v.c];
  function lecturaJ6(v) { const [a, b, c] = J6(v); return [`Cima ${f0(cimaDe([a, b, c]))} = ${f0(a)} + ${f0(b)} + ${f0(b)} + ${f0(c)}`]; }
  const P6 = [2, 5, 1, 3];
  if (cimaDe(P6) !== 23 || suma(P6) !== 11) throw new Error('predicción de la idea 6');
  const D_MURO = 'Cada adobe vale la suma de los dos que tiene debajo.';
  const D_PESOS = 'La cima cuenta cada adobe de abajo tantas veces como caminos suben de él a la cima.';
  const D_FILA_PESOS = 'Caminos de cada adobe: 1, 2, 1 (tres abajo); 1, 3, 3, 1 (cuatro); 1, 4, 6, 4, 1 (cinco).';
  function casoMuro(r, o) {
    for (let i = 0; i < 400; i++) {
      const k = r.elegir(o.ks), b = r.barajar(rango(1, o.hasta)).slice(0, k);
      if (['cima', 'falta', o.tipo].some(t => usado('piramide-de-sumas', `${t}|${b.join(',')}`))) continue;
      return { k, b, cima: cimaDe(b), w: pesos(k) };
    }
    throw new Error('casoMuro');
  }
  const piramide = {
    id: 'piramide-de-sumas',
    titulo: 'La pirámide de sumas',
    pregunta: '¿Cuántas veces sube cada adobe de la base?',
    temas: ['Distribución de números con condiciones'],
    pieza: PZ,
    aprendizaje: 'Si cada adobe suma los dos de abajo, la cima cuenta cada adobe de la base tantas veces como caminos suben de él.',
    actividad: 'Cambiar los tres adobes de abajo de un muro hasta que la cima valga 20.',
    // Lee: el muro, cómo se arma y qué mirar. No dice cuánto vale la cima del muro de cuatro (Predice).
    lee: {
      tarjetas: [
        { titulo: 'El muro de adobes', texto: 'En el patio del colegio armaron un muro de adobes en pirámide, con un número en cada adobe. Cada adobe vale la suma de los dos que tiene debajo.',
          pieza: PZ, dibujo: muro([[{ t: '' }], [{ t: '' }, { t: '' }], [{ t: '' }, { t: '' }, { t: '' }]]) },
        { titulo: 'Subir por caminos', texto: 'Un número de abajo sube a los adobes que tiene encima, y de ahí sigue subiendo. Un camino es una manera de llegar desde un adobe de abajo hasta la cima.' },
        { titulo: 'Qué mirar al jugar', texto: 'Tú cambias los tres números de abajo. Mira cuántas veces aparece cada uno en la cuenta de la cima.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'El muro tiene tres adobes abajo, dos encima y la cima. Cada adobe vale la suma de los dos que tiene debajo.',
      mision: {
        texto: 'Haz que la cima valga 20 sin repetir números abajo.',
        logrado: v => new Set(J6(v)).size === 3 && cimaDe(J6(v)) === 20,
        bien: ['La cima vale 20, y el adobe del medio de abajo entra dos veces.'],
      },
      voz: 'El del medio llega a la cima por dos caminos.',
      leyenda: [
        { s: 'abajo', t: 'los tres adobes que tú eliges' },
        { s: 'adobe de encima', t: 'la suma de los dos de debajo' },
        { s: 'cima', t: 'el adobe de arriba' },
      ],
      controles: [['a', 'Izquierda', 1], ['b', 'Medio', 2], ['c', 'Derecha', 3]].map(([id, e, ini]) => ({ id, etiqueta: e, min: 1, max: 9, paso: 1, inicio: ini, decimales: 0 })),
      dibujo: v => ({ datos: { escena: 'muro', filas: subir(J6(v)).map(f => cartas(f)) }, estado: {} }),
      lectura: v => lecturaJ6(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'En otro muro van cuatro adobes abajo: 2, 5, 1 y 3, en ese orden. ¿Cuánto vale la cima?',
      datos: [D_MURO],
      voz: 'Piensa por cuántos caminos sube cada uno.',
      opciones: [
        { id: 'una', texto: '11', error: 'RMP1', siFuera: 'Es cierto que todos llegan a la cima, pero los del medio llegan por más de un camino.' },
        { id: 'dos', texto: '17', error: 'RMP189', siFuera: 'Es cierto que los del medio cuentan de más, pero con cuatro abajo cuentan tres veces, no dos.' },
        { id: 'doble', texto: '22', error: 'RMP190', siFuera: 'Es cierto que cada fila suma más que la de abajo, pero no siempre el doble.' },
        { id: 'c', texto: '23', correcta: true },
      ],
      dibujo: muroBase(P6),
      revelar: muroLleno(P6),
      coincide: 'Coincide: 2 + 3 × 5 + 3 × 1 + 3 = 23, porque los del medio suben por tres caminos.',
      noCoincide: 'Revisemos: sube fila por fila.',
    },
    mira: {
      pieza: PZ,
      datos: Object.assign(muro(subir(P6).map((f, i) => f.map(q => ({ t: f0(q), desde: i === 3 ? 0 : 1 })))).datos, { pesos: pesos(4).map(w => ({ t: `× ${f0(w)}`, papel: 'compartida', desde: 2 })) }),
      voz: 'Cada adobe de abajo, tantas veces como caminos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Abajo van los adobes 2, 5, 1 y 3, en ese orden.' },
        { estado: { corte: 1 }, texto: 'Fila por fila salen 7, 6 y 4; luego, 13 y 10, y la cima vale 23.', ecuacion: ['13 + 10 = 23'] },
        { estado: { corte: 2 }, texto: 'Los de las puntas suben por un camino; los del medio, por tres.' },
        { estado: { corte: 2 }, texto: 'La cima cuenta cada adobe de abajo tantas veces como caminos tiene.', ecuacion: ['2 × 1 + 5 × 3 + 1 × 3 + 3 × 1 = 23'] },
      ],
    },
    regla: {
      texto: 'La cima cuenta cada adobe de abajo tantas veces como caminos suben de él: 1, 2 y 1 con tres; 1, 3, 3 y 1 con cuatro. La fila de cuatro sale de la de tres como el muro: 1, 1 + 2, 2 + 1, 1.',
      ecuacion: [{ llave: ['1, 3, 3, 1'], nota: 'veces que sube cada uno', color: 'c-i' }, SEP, F('cima'), ' = 1.º + 3 × 2.º + 3 × 3.º + 4.º'],
      condicion: 'cada adobe vale justo la suma de los dos que tiene debajo, sin agregar ni quitar nada.',
      voz: 'Los del medio pesan más.',
    },
    ejemplos: null,
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), tipo = s % 2;
        const z = casoMuro(r, { tipo: 'r' + tipo, ks: [4, 5], hasta: 12 });
        if (tipo === 0) return {
          enunciado: `En un muro de adobes van ${nf(z.k)} abajo: ${listaTxt(z.b)}, en ese orden. Cada adobe vale la suma de los dos de abajo. ¿Cuánto vale la cima?`,
          datos: [D_MURO, D_PESOS, D_FILA_PESOS], dibujo: muroBase(z.b),
          pasos: [
            { tipo: 'pide', texto: 'Piden la cima, y se puede hallar sin armar todo el muro.' },
            { tipo: 'datos', texto: `Abajo hay ${nf(z.k)} adobes: ${listaTxt(z.b)}.` },
            { tipo: 'regla', texto: `La cima cuenta cada adobe de abajo tantas veces como caminos tiene: ${z.w.join(', ')}.`, dibujo: muroBase(z.b, { pesos: pesosTxt(z.k) }) },
            { tipo: 'cuentas', texto: 'Multiplico cada adobe por sus caminos y sumo los resultados.', ecuacion: cuentaCima(z.b, z.w, F(f0(z.cima))) },
            { tipo: 'sentido', texto: `Armando el muro fila por fila sale lo mismo: ${f0(z.cima)}.`, dibujo: muroLleno(z.b) },
          ],
          respuesta: [F('cima'), ' = ', F(f0(z.cima))],
        };
        const j = r.ent(1, z.k - 2), xx = z.b[j], otros = z.b.map((q, i) => (i === j ? 0 : q * z.w[i])).reduce((a, q) => a + q, 0);
        return {
          enunciado: `En un muro de adobes van ${nf(z.k)} abajo; la cima vale ${f0(z.cima)}. Abajo están ${z.b.map((q, i) => (i === j ? '?' : f0(q))).join(', ')}. ¿Qué número falta?`,
          datos: [D_MURO, D_PESOS, D_FILA_PESOS], dibujo: muro(Array.from({ length: z.k }, (_, i) => (i === z.k - 1 ? z.b.map((q, ii) => (ii === j ? { t: '?' } : { t: f0(q) })) : i === 0 ? [{ t: f0(z.cima) }] : huecos(i + 1)))),
          pasos: [
            { tipo: 'pide', texto: 'Piden el adobe de abajo que falta.' },
            { tipo: 'datos', texto: `La cima vale ${f0(z.cima)}, y el adobe que falta sube por ${f0(z.w[j])} caminos.` },
            { tipo: 'regla', texto: `La cima cuenta cada adobe de abajo tantas veces como caminos tiene: ${z.w.join(', ')}.` },
            { tipo: 'cuentas', texto: 'Quito lo que aportan los otros y divido entre los caminos del que falta.', ecuacion: [x, ` = (${f0(z.cima)} − ${f0(otros)}) ÷ ${f0(z.w[j])} = `, H(f0(xx))] },
            { tipo: 'sentido', texto: `Con ${f0(xx)} abajo, el muro sube hasta ${f0(z.cima)}.`, dibujo: muroLleno(z.b) },
          ],
          respuesta: [x, ' = ', H(f0(xx))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la cima con tres o cuatro abajo · 1 el adobe que falta · 2 la cima con cinco abajo.
    ahoraTu: {
      pieza: PZ,
      voz: 'Cuenta los caminos de cada adobe.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo !== 1) {
          const z = casoMuro(r, { tipo: 'a' + tipo, ks: tipo === 0 ? [3, 4, 4] : [5], hasta: 9 }), k = z.k;
          const mal2 = z.b.map((q, i) => q * (i === 0 || i === k - 1 ? 1 : 2)).reduce((a, q) => a + q, 0);
          const ds = [
            { id: 'una', valor: suma(z.b), error: 'RMP1', siFuera: 'Es cierto que todos llegan a la cima, pero los del medio llegan por más de un camino.' },
            { id: 'dos', valor: mal2, error: 'RMP189', siFuera: `Es cierto que los del medio cuentan de más, pero con ${nf(k).replace('una', 'uno')} abajo no cuentan solo dos veces.` },
            { id: 'doble', valor: 2 * suma(z.b), error: 'RMP190', siFuera: 'Es cierto que cada fila suma más, pero no siempre el doble de la de abajo.' },
            { id: 'fila', valor: suma(subir(z.b)[1]), error: 'RMP61', siFuera: 'Esa es la suma de la fila de dos adobes, pero falta seguir subiendo hasta la cima.' },
            { id: 'izq', valor: z.b[0] + z.b[1], error: 'RMP61', siFuera: 'Sumar los dos de abajo es la idea, pero eso da el adobe que tienen encima, no la cima.' },
            { id: 'demas', valor: z.cima + suma(z.b.slice(1, -1)), error: 'RMP182', siFuera: 'Es cierto que los del medio cuentan de más, pero contaste un camino de más en cada uno.' },
          ];
          return { pregunta: `En un muro de adobes van ${nf(k).replace('una', 'uno')} abajo: ${listaTxt(z.b)}, en ese orden. Cada adobe vale la suma de los dos de abajo. ¿Cuánto vale la cima?`,
            datos: [D_MURO, D_PESOS, D_FILA_PESOS], dibujo: muroBase(z.b), opciones: opcionesNum(z.cima, ds),
            solucion: { texto: `La cima cuenta cada adobe de abajo tantas veces como caminos tiene: ${z.w.join(', ')}.`, ecuacion: cuentaCima(z.b, z.w, F(f0(z.cima))) } };
        }
        const z = casoMuro(r, { tipo: 'a1', ks: [4], hasta: 9 }), j = r.ent(1, z.k - 2), xx = z.b[j];
        const otros = z.b.map((q, i) => (i === j ? 0 : q * z.w[i])).reduce((a, q) => a + q, 0), sumO = suma(z.b) - xx;
        const ds = [
          { id: 'sinDiv', valor: z.cima - otros, error: 'RMP61', siFuera: `Quitar lo de los otros es la idea, pero el que falta sube por ${f0(z.w[j])} caminos, así que falta dividir.` },
          { id: 'una', valor: z.cima - sumO, error: 'RMP1', siFuera: 'Restar a los otros es la idea, pero cada uno cuenta tantas veces como caminos tiene.' },
          { id: 'dos', valor: Number.isInteger((z.cima - sumO) / z.w[j]) ? (z.cima - sumO) / z.w[j] : null, error: 'RMP189', siFuera: 'Dividir entre los caminos es la idea, pero los otros también cuentan tantas veces como sus caminos.' },
          { id: 'cima', valor: Number.isInteger(z.cima / z.w[j]) ? z.cima / z.w[j] : null, error: 'RMP63', siFuera: 'Dividir es la idea, pero antes hay que quitar lo que aportan los otros.' },
          { id: 'uno-mas', valor: Number.isInteger((z.cima - otros) / (z.w[j] + 1)) ? (z.cima - otros) / (z.w[j] + 1) : null, error: 'RMP182', siFuera: `Dividir entre los caminos es la idea, pero ese adobe sube por ${f0(z.w[j])}, no por ${f0(z.w[j] + 1)}.` },
          { id: 'arriba', valor: subir(z.b)[z.k - 2][j], error: 'RMP61', siFuera: 'Ese es un adobe de la fila de encima, pero piden el adobe de abajo que falta.' },
          { id: 'mal2', valor: (() => { const w2 = z.b.map((q, i) => (i === 0 || i === z.k - 1 ? 1 : 2)), r2 = (z.cima - suma(z.b.map((q, i) => (i === j ? 0 : q * w2[i])))) / 2; return Number.isInteger(r2) ? r2 : null; })(),
            error: 'RMP189', siFuera: 'Es cierto que los del medio cuentan de más, pero con cuatro abajo suben por tres caminos.' },
        ];
        return { pregunta: `En un muro de adobes van ${nf(z.k).replace('una', 'uno')} abajo y la cima vale ${f0(z.cima)}. Abajo están ${z.b.map((q, i) => (i === j ? '?' : f0(q))).join(', ')}. ¿Qué número falta?`,
          datos: [D_MURO, D_PESOS, D_FILA_PESOS], dibujo: muro(Array.from({ length: z.k }, (_, i) => (i === z.k - 1 ? z.b.map((q, ii) => (ii === j ? { t: '?' } : { t: f0(q) })) : i === 0 ? [{ t: f0(z.cima) }] : huecos(i + 1)))),
          opciones: opcionesNum(xx, ds),
          solucion: { texto: `Quito lo de los otros y divido entre los ${f0(z.w[j])} caminos del que falta.`, ecuacion: [x, ` = (${f0(z.cima)} − ${f0(otros)}) ÷ ${f0(z.w[j])} = `, H(f0(xx))] } };
      },
    },
  };
  // ---------- Ejemplos resueltos de «La pirámide de sumas» ----------
  // Comprobados al cargar (subir arma el muro fila por fila) y aparte en scratchpad e9-rm (pirámides armadas a mano):
  // 1 → 17 · 2 → 8 · 3 → 10 · 4 → 2 · 5 → 21 · 6 → 20 · 7 → 18 · 8 → 5 · 9 → 5 · 10 → 1, 4, 6, 4, 1 · 11 → 48 (A) ·
  // 12 → 15 (C) · 13 → 6 (D) · 14 → 24 (B) · 15 → 32 (E).
  if (cimaDe([3, 5, 4]) !== 17 || cimaDe([1, 2, 3]) !== 8 || cimaDe([6, 1, 2]) !== 10 || cimaDe([2, 7, 5]) !== 21 || cimaDe([1, 2, 3, 4]) !== 20 || cimaDe([4, 1, 3, 2]) !== 18
    || cimaDe([2, 5, 4]) !== 16 || cimaDe([1, 5, 2, 3]) !== 25 || pesos(5).join() !== '1,4,6,4,1' || cimaDe([1, 2, 3, 4, 5]) !== 48 || suma(subir([3, 1, 4, 2])[2]) !== 15
    || cimaDe([2, 6, 3, 1]) !== 30 || cimaDe([1, 4, 3, 2]) !== 24 || cimaDe([4, 1, 2, 3]) !== 16 || cimaDe([2, 2, 2, 2, 2]) !== 32 || pesos(3)[1] !== 2) throw new Error('ejemplos de la idea 6');
  const ejMuro = (nivel, titulo, b, extra = {}) => ejemplo(Object.assign({ nivel, titulo, caso: `cima|${b.join(',')}`,
    enunciado: `En un muro de adobes van ${b.length === 3 ? 'tres' : b.length === 4 ? 'cuatro' : 'cinco'} abajo: ${listaTxt(b)}, en ese orden. Cada adobe vale la suma de los dos de abajo. ¿Cuánto vale la cima?`,
    datos: [D_MURO, D_PESOS], figura: muroBase(b),
    solucion: [{ texto: `Cada adobe de abajo cuenta tantas veces como caminos tiene: ${pesos(b.length).join(', ')}.`, ecuacion: cuentaCima(b, pesos(b.length), F(f0(cimaDe(b)))) }],
    respuesta: [F('cima'), ' = ', F(f0(cimaDe(b)))] }, extra));
  const EJEMPLOS_PIR = [
    ejMuro(1, 'Tres adobes: 3, 5 y 4', [3, 5, 4]),
    ejMuro(1, 'Tres adobes: 1, 2 y 3', [1, 2, 3]),
    ejemplo({ nivel: 1, titulo: 'Fila por fila', caso: 'cima|6,1,2',
      enunciado: 'En un muro de adobes van tres abajo: 6, 1 y 2. Cada adobe vale la suma de los dos de abajo. ¿Cuánto vale la cima?',
      datos: [D_MURO], figura: muroBase([6, 1, 2]),
      solucion: [{ texto: 'Encima de la base van 6 + 1 = 7 y 1 + 2 = 3, y la cima es su suma.', ecuacion: ['7 + 3 = ', F('10')] }],
      respuesta: [F('cima'), ' = ', F('10')] }),
    ejemplo({ nivel: 1, titulo: 'Caminos del medio', caso: 'pesos|3',
      enunciado: 'En un muro con tres adobes abajo, ¿por cuántos caminos sube el adobe del medio hasta la cima?',
      datos: [D_MURO], figura: muro([[{ t: '' }], [{ t: '' }, { t: '' }], [{ t: '' }, { t: '?' }, { t: '' }]]),
      solucion: [{ texto: 'Sube a los dos adobes que tiene encima, y cada uno sube a la cima: dos caminos.' }],
      respuesta: [I('2 caminos')] }),
    ejMuro(1, 'Tres adobes: 2, 7 y 5', [2, 7, 5]),
    ejMuro(2, 'Cuatro adobes: 1 a 4', [1, 2, 3, 4], { datos: [D_MURO, D_PESOS, D_FILA_PESOS] }),
    ejMuro(2, 'Cuatro adobes: 4, 1, 3, 2', [4, 1, 3, 2], { datos: [D_MURO, D_PESOS, D_FILA_PESOS] }),
    ejemplo({ nivel: 2, titulo: 'El del medio que falta', caso: 'falta|2,5,4',
      enunciado: 'En un muro de adobes van tres abajo: 2, ? y 4. La cima vale 16. ¿Qué número falta?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muro([[{ t: '16' }], huecos(2), [{ t: '2' }, { t: '?' }, { t: '4' }]]),
      solucion: [{ texto: 'El del medio cuenta dos veces; los de las puntas, una.', ecuacion: ['2 + 2 × ', x, ' + 4 = 16'] },
        { texto: 'Quito lo que aportan las puntas, 2 + 4 = 6, y divido entre 2.', ecuacion: [x, ' = (16 − 6) ÷ 2 = ', H('5')] }],
      respuesta: [x, ' = ', H('5')] }),
    ejemplo({ nivel: 2, titulo: 'Falta uno de cuatro', caso: 'falta|1,5,2,3',
      enunciado: 'En un muro de adobes van cuatro abajo: 1, ?, 2 y 3. La cima vale 25. ¿Qué número falta?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muro([[{ t: '25' }], huecos(2), huecos(3), [{ t: '1' }, { t: '?' }, { t: '2' }, { t: '3' }]]),
      solucion: [{ texto: 'Los caminos son 1, 3, 3 y 1, así que los adobes conocidos aportan 1 + 6 + 3 = 10.', ecuacion: ['1 × 1 + 2 × 3 + 3 × 1 = 10'] },
        { texto: 'El que falta sube por 3 caminos: quito lo de los otros y divido entre 3.', ecuacion: [x, ' = (25 − 10) ÷ 3 = ', H('5')] }],
      respuesta: [x, ' = ', H('5')] }),
    ejemplo({ nivel: 2, titulo: 'Caminos con cinco abajo', caso: 'pesos|5',
      enunciado: 'En un muro con cinco adobes abajo, ¿por cuántos caminos sube cada uno hasta la cima?',
      datos: [D_MURO, 'Con cuatro abajo, los caminos son 1, 3, 3 y 1.'], figura: muro([[{ t: '' }], huecos(2), huecos(3), huecos(4), qs(5)]),
      solucion: [{ texto: 'Cada número de caminos sale de sumar dos vecinos de la fila de cuatro, 1, 3, 3 y 1, como se arma el muro.', ecuacion: ['1, 1 + 3, 3 + 3, 3 + 1, 1'] }],
      respuesta: [I('1, 4, 6, 4 y 1')] }),
    // Nivel 3 (tipo examen). Letras de la correcta: A, C, D, B, E.
    ejemplo({ nivel: 3, titulo: 'Del 1 al 5 abajo', caso: 'cima|1,2,3,4,5',
      enunciado: 'En un muro de adobes van cinco abajo: 1, 2, 3, 4 y 5, en ese orden. Cada adobe vale la suma de los dos de abajo. ¿Cuánto vale la cima?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muroBase([1, 2, 3, 4, 5]),
      alternativas: ['48', '15', '24', '33', '30'], correcta: '48',
      solucion: [{ texto: 'Con cinco abajo, los caminos son 1, 4, 6, 4 y 1.', ecuacion: ['1 × 1 + 2 × 4 + 3 × 6 = 27', SEP, '27 + 4 × 4 + 5 × 1 = ', F('48')] }],
      explica: '15 cuenta cada uno una vez; 24 cuenta dos veces los del medio; 33 los cuenta tres veces, y 30 duplica la base.',
      respuesta: [F('48')] }),
    ejemplo({ nivel: 3, titulo: 'La fila de tres', caso: 'fila|3,1,4,2',
      enunciado: 'En un muro de adobes van cuatro abajo: 3, 1, 4 y 2. ¿Cuánto suman los tres adobes de la fila de encima?',
      datos: [D_MURO], figura: muro([[{ t: '' }], huecos(2), qs(3), cartas([3, 1, 4, 2])]),
      alternativas: ['10', '20', '15', '30', '5'], correcta: '15',
      solucion: [{ texto: 'La fila de encima tiene 3 + 1, 1 + 4 y 4 + 2, así que los de las puntas entran una vez y los del medio, dos.', ecuacion: ['4 + 5 + 6 = ', F('15')] }],
      explica: '10 es la suma de abajo; 20 es la cima; 30 duplica la base, y 5 es solo el adobe del medio.',
      respuesta: [F('15')] }),
    ejemplo({ nivel: 3, titulo: 'Un hueco y la cima', caso: 'falta|2,6,3,1',
      enunciado: 'En un muro de adobes van cuatro abajo: 2, ?, 3 y 1. La cima vale 30. ¿Qué número falta?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muro([[{ t: '30' }], huecos(2), huecos(3), [{ t: '2' }, { t: '?' }, { t: '3' }, { t: '1' }]]),
      alternativas: ['24', '8', '18', '6'], correcta: '6',
      solucion: [{ texto: 'Los adobes conocidos aportan 2 × 1 + 3 × 3 + 1 × 1 = 12, y el que falta sube por 3 caminos.', ecuacion: [x, ' = (30 − 12) ÷ 3 = ', H('6')] }],
      explica: '24 resta los otros una vez cada uno, sin sus caminos; 8 hace eso y después divide entre 3, y 18 resta bien pero no divide.',
      respuesta: [x, ' = ', H('6')] }),
    ejemplo({ nivel: 3, titulo: 'La cima más alta', caso: 'mayor|1,2,3,4',
      enunciado: 'Las tarjetas 1, 2, 3 y 4 van abajo en un muro de adobes, en el orden que quieras. ¿Cuál es la mayor cima posible?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muroBase(['?', '?', '?', '?'].map(() => '?')),
      alternativas: ['20', '24', '10', '16'], correcta: '24',
      solucion: [{ texto: 'Los del medio suben por 3 caminos, así que ahí van los más grandes, 4 y 3. Con el orden 1, 4, 3 y 2 la cima es:', ecuacion: ['1 × 1 + 4 × 3 + 3 × 3 + 2 × 1 = ', F('24')] },
        { texto: 'Otros órdenes con 4 y 3 en el medio, como 2, 3, 4 y 1, dan la misma cima.' }],
      explica: '20 deja el orden 1, 2, 3, 4; 10 cuenta cada una una vez, y 16 pone los grandes en las puntas.',
      respuesta: [F('24')] }),
    ejemplo({ nivel: 3, titulo: 'Cinco adobes iguales', caso: 'cima|2,2,2,2,2',
      enunciado: 'En un muro de adobes van cinco abajo, todos con el número 2. ¿Cuánto vale la cima?',
      datos: [D_MURO, D_PESOS, D_FILA_PESOS], figura: muroBase([2, 2, 2, 2, 2]),
      alternativas: ['10', '20', '22', '16', '32'], correcta: '32',
      solucion: [{ texto: 'Los caminos suman 1 + 4 + 6 + 4 + 1 = 16, y cada uno trae un 2.', ecuacion: ['2 × 16 = ', F('32')] }],
      explica: '10 cuenta cada uno una vez; 20 duplica la base; 22 cuenta tres veces los del medio, como en el muro de cuatro, y 16 son solo los caminos, sin el 2.',
      respuesta: [F('32')] }),
  ];
  piramide.ejemplos = EJEMPLOS_PIR;
  juntar('piramide-de-sumas', EJEMPLOS_PIR, ['cima|2,5,1,3']);
  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1 (idea 1): números seguidos desde a, n de ellos, repartidos en dos grupos parejos si se puede.
  const seguidos = (a, n) => rango(a, a + n - 1);
  const sale = val => !!particion(seguidos(val.a, val.n));
  const totalSeg = val => suma(seguidos(val.a, val.n));
  const MAS_FICHAS = Math.max(...[1, 2, 3, 4, 5, 6].flatMap(a => rango(2, 10).map(n => (sale({ a, n }) ? n : 0))));
  function dibReparto(val) {
    const ns = seguidos(val.a, val.n), g = particion(ns);
    const filas = g ? [{ cartas: cartas(g) }, { cartas: cartas(ns.filter(q => !g.includes(q))) }] : [{ cartas: cartas(ns) }, { cartas: [] }];
    const nota = g ? `Dos grupos de ${f0(suma(g))}` : suma(ns) % 2 ? 'Total impar: no hay reparto' : 'Total par, pero no se arma';
    return { datos: { escena: 'bandeja', ranuras: 10, filas, nota: [{ t: `Total ${f0(suma(ns))}`, papel: 'total' }, { t: nota }] }, estado: {} };
  }
  const mesaReparto = {
    id: 'reparto-libre', titulo: 'Reparte números seguidos', pieza: PZ,
    consigna: 'Elige desde qué número empiezas y cuántos van. ¿Cuándo salen dos grupos de igual suma?',
    controles: [
      { id: 'a', etiqueta: 'Desde', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      { id: 'n', etiqueta: 'Cuántos', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
    ],
    dibujo: val => dibReparto(val),
    lectura: val => { const ns = seguidos(val.a, val.n), Tn = suma(ns); return [`Del ${f0(val.a)} al ${f0(val.a + val.n - 1)}: `, T, ` = ${f0(Tn)}`, Tn % 2 ? ', impar' : particion(ns) ? `, grupos de ${f0(Tn / 2)}` : ', par pero no sale']; },
    invitaciones: [
      { texto: 'Consigue un total par que igual no se pueda repartir.', logrado: val => totalSeg(val) % 2 === 0 && !sale(val), bien: 'Total par y sin reparto: que sea par no basta.' },
      { texto: 'Arma dos grupos que sumen 15 cada uno.', logrado: val => sale(val) && totalSeg(val) === 30, bien: 'Total 30, mitad 15. ¿Hay otra fila de números seguidos que también lo logre?' },
      { texto: 'Busca la fila más larga que sí se pueda repartir.', logrado: val => sale(val) && val.n === MAS_FICHAS, bien: `${f0(MAS_FICHAS)} números. Con 10 seguidos el total siempre sale impar: ¿por qué?` },
    ],
  };
  // Mesa 2 (idea 4): el cuadrado mágico 3 × 3 con números que van de d en d desde a.
  const tableroMagico = val => desdeA(LS, val.a, val.d);
  const filaMagica = val => suma(tableroMagico(val)[0]);
  const centroMagico = val => tableroMagico(val)[1][1];
  const SALTO_60 = Math.min(...[1, 2, 3, 4, 5].filter(d => rango(1, 10).some(a => filaMagica({ a, d }) === 60)));
  const mesaMagico = {
    id: 'magico-libre', titulo: 'Cuadrado mágico con otros números', pieza: PZ,
    consigna: 'Cambia el primer número y el salto entre uno y el siguiente. Mira cómo cambian la suma de cada fila y el centro.',
    controles: [
      { id: 'a', etiqueta: 'Primer número', min: 1, max: 10, paso: 1, inicio: 1, decimales: 0 },
      { id: 'd', etiqueta: 'Salto', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: val => ({ datos: { escena: 'tablero', celdas: tableroMagico(val).map((f, i) => f.map((q, k) => (i === 1 && k === 1 ? { t: f0(q), papel: 'compartida' } : { t: f0(q) }))), sumas: [0, 1, 2].map(() => ({ t: f0(filaMagica(val)) })) }, estado: {} }),
    lectura: val => [S, ` = ${f0(filaMagica(val))} y `, C, ` = ${f0(centroMagico(val))}: S es el triple del centro`],
    invitaciones: [
      { texto: 'Consigue que la casilla del centro valga 20.', logrado: val => centroMagico(val) === 20, bien: 'Centro 20, y cada fila suma 60: el triple del centro.' },
      { texto: 'Haz que cada fila sume 60 con el salto más chico posible.', logrado: val => filaMagica(val) === 60 && val.d === SALTO_60, bien: `Salto ${f0(SALTO_60)}: con uno menor, el primer número tendría que pasar de 10.` },
      { texto: 'Guarda dos cuadrados con el mismo centro y distinto salto.', logrado: (val, g) => g.some(p => g.some(q => q.d !== p.d && centroMagico(q) === centroMagico(p))), bien: 'Mismo centro, misma suma: la fila solo mira el centro.' },
    ],
  };
  // Mesa 3 (idea 3): el triángulo con esquinas libres; aparecen esquinas cuya cuenta da entera y no se arman.
  const esquinasTri = val => [val.e0, val.e1, val.e2];
  const arregloDe = val => armaFijo(J3, esquinasTri(val), 3);
  const SUMAS_TRI = extremos(J3, 3).Ss;
  const mesaTri = {
    id: 'triangulo-libre', titulo: 'Esquinas a elección', pieza: PZ,
    consigna: 'Elige tres esquinas distintas del 1 al 6. A veces la cuenta da entera y aun así no hay arreglo.',
    controles: ['Esquina 1', 'Esquina 2', 'Esquina 3'].map((e, k) => ({ id: 'e' + k, etiqueta: e, min: 1, max: 6, paso: 1, inicio: [2, 4, 1][k], decimales: 0 })),
    dibujo: val => dibujoJ3(val),
    lectura: val => lecturaJ3(val),
    invitaciones: [
      { texto: 'Encuentra esquinas con cuenta entera y, aun así, sin arreglo.', logrado: val => new Set(esquinasTri(val)).size === 3 && (21 + suma(esquinasTri(val))) % 3 === 0 && !arregloDe(val), bien: 'La cuenta da entera, pero las del medio no encajan.' },
      { texto: 'Consigue la mayor suma por lado que se arma.', logrado: val => !!arregloDe(val) && arregloDe(val).S === Math.max(...SUMAS_TRI), bien: 'Las esquinas más grandes, contadas dos veces, empujan la suma hacia arriba.' },
      { texto: 'Consigue la menor suma por lado que se arma.', logrado: val => !!arregloDe(val) && arregloDe(val).S === Math.min(...SUMAS_TRI), bien: `Esquinas chicas, suma chica. Entre la menor y la mayor hay ${f0(SUMAS_TRI.length)} sumas posibles.` },
    ],
  };

  // ---------- Glosario (docs/teoria.md, 4d): de 2 a 4 términos por idea, con simple y 3 ejemplos ----------
  // Ningún ejemplo trae la respuesta de una predicción (15 de la idea 1; 10; 15 y 15,5; 5; 6; 23): regla glosario-predice.
  // «Cota» se mudó aquí desde Máximos y mínimos (va antes en la rama). «Vértice», «paridad», «producto» y «al cubo» se
  // estrenan en otras unidades del curso: aquí solo se marcan.
  const GLOSARIO = [
    // Idea 1
    { termino: 'suma común', formas: ['suma común', 'sumas comunes'], simbolo: 'S', def: 'Lo que suma cada línea (fila, columna, lado o grupo) cuando el reto pide que todas sumen igual.',
      simple: 'Lo que suma cada fila cuando todas suman igual.',
      ejemplos: ['Filas 1 + 6 y 3 + 4: la suma común es 7.', 'Tres grupos de 12 cada uno: suma común 12.', 'Si una fila suma 9 y otra 10, no hay suma común.'] },
    { termino: 'entero', formas: ['número entero', 'números enteros', 'entero', 'enteros', 'entera', 'enteras'], def: 'Número sin parte decimal ni fracción, como −2, 0 o 7.',
      simple: 'Un número sin coma ni fracción.', ejemplos: ['12 ÷ 3 = 4 da entero.', '7 ÷ 2 = 3,5 no da entero.', 'Las tarjetas llevan enteros: 1, 2, 3…'] },
    // Idea 2
    { termino: 'casilla compartida', formas: ['casilla compartida', 'casillas compartidas'], def: 'Casilla que está en dos líneas o más a la vez; al sumar esas líneas, entra en cada una.',
      simple: 'Un lugar que pertenece a dos líneas a la vez.', ejemplos: ['El centro de una cruz está en la fila y en la columna.', 'Una esquina de un marco está en dos lados.', 'En el 3 × 3, el centro está en cuatro líneas.'] },
    { termino: 'arreglo numérico', formas: ['arreglos numéricos', 'arreglo numérico', 'arreglos', 'arreglo'], def: 'Forma de colocar números en una figura para que cumplan una condición, como sumas iguales.',
      simple: 'Números puestos en una figura siguiendo una regla.', ejemplos: ['Un cuadrado mágico es un arreglo numérico.', 'Tarjetas en un marco con lados iguales: un arreglo.', 'Un arreglo vale si cumple todas las condiciones.'] },
    { termino: 'polígono', formas: ['polígono', 'polígonos'], def: 'Figura plana y cerrada formada por lados rectos, como el triángulo o el cuadrado.',
      simple: 'Una figura cerrada de lados rectos.', ejemplos: ['El triángulo es un polígono de 3 lados.', 'El pentágono tiene 5 lados.', 'Un círculo no es un polígono.'] },
    // Idea 3
    { termino: 'cota', formas: ['cota', 'cotas'], def: 'Valor que el resultado no puede pasar, como «a lo más 12». Si un caso lo alcanza, es el mejor.',
      simple: 'Un tope que el resultado no puede pasar.', ejemplos: ['Con 1 a 6 en un triángulo, ningún lado pasa de 12.', 'Si nadie mide más de 2 m, 2 m es una cota.', 'Una cota que no se alcanza no es la respuesta.'] },
    { termino: 'suma por lado', formas: ['suma por lado', 'sumas por lado'], def: 'Lo que suman las tarjetas de un lado del polígono; en estos retos debe ser igual en todos.',
      simple: 'Lo que suma cada lado de la figura.', ejemplos: ['Esquinas 4 y 6, medio 2: la suma por lado es 12.', 'En el triángulo con 1 a 6 va de 9 a 12.', 'Con más esquinas grandes, la suma por lado crece.'] },
    // Idea 4
    { termino: 'cuadrado mágico', formas: ['cuadrado mágico', 'cuadrados mágicos'], def: 'Tablero cuadrado de números en el que cada fila, columna y diagonal suman lo mismo.',
      simple: 'Un tablero donde todas las líneas suman igual.', ejemplos: ['Filas 4 9 2 · 3 5 7 · 8 1 6: cada línea suma 15.', 'El de Durero, de 1514, es un 4 × 4.', 'Si una diagonal no suma igual, no es mágico.'], ver: ['suma mágica'] },
    { termino: 'suma mágica', formas: ['suma mágica'], def: 'Lo que suma cada fila, columna o diagonal de un cuadrado mágico: el total entre el número de filas.',
      simple: 'Lo que suma cada línea del cuadrado mágico.', ejemplos: ['Del 1 al 16 suman 136: en el 4 × 4, 34 por fila.', 'Del 2 al 10 suman 54: en el 3 × 3, 18.', 'Es la suma común del cuadrado.'], ver: ['cuadrado mágico'] },
    { termino: 'casilla opuesta', formas: ['casilla opuesta', 'casillas opuestas', 'opuesta', 'opuestas'], def: 'Casilla que queda al otro lado del centro, en la misma línea y a la misma distancia.',
      simple: 'La casilla de enfrente, pasando por el centro.', ejemplos: ['La esquina de arriba a la izquierda y la de abajo a la derecha.', 'Arriba en el medio y abajo en el medio.', 'Izquierda y derecha de la fila del medio.'] },
    // Idea 5
    { termino: 'producto común', formas: ['producto común'], simbolo: 'P', def: 'Lo que da cada línea al multiplicar sus números, cuando el reto pide que todas den igual.',
      simple: 'Lo que multiplica cada línea cuando todas dan igual.', ejemplos: ['Tiras 1 × 4 × 9 y 2 × 3 × 6: producto común 36.', 'Si una fila da 30 y otra 40, no hay producto común.', 'Con centro 10, el producto común es 1000.'] },
    { termino: 'multiplicativo', formas: ['multiplicativo', 'multiplicativos'], def: 'Se dice del cuadrado mágico cuyas líneas se multiplican en vez de sumarse.',
      simple: 'Que se multiplica en vez de sumarse.', ejemplos: ['Filas 2 25 20 · 100 10 1 · 5 4 50: multiplicativo, cada línea da 1000.', 'En el multiplicativo, restar pasa a ser dividir.', 'Un aditivo suma; un multiplicativo multiplica.'] },
    // Idea 6
    { termino: 'pirámide de sumas', formas: ['pirámide de sumas'], def: 'Arreglo en filas donde cada casilla vale la suma de las dos que tiene debajo.',
      simple: 'Un muro donde cada adobe suma los dos de abajo.', ejemplos: ['Abajo 1 y 2: arriba va 3.', 'Abajo 3, 5 y 4: encima 8 y 9; la cima, 17.', 'Se arma de abajo hacia arriba.'] },
    { termino: 'camino', formas: ['camino', 'caminos'], def: 'Manera de subir desde un adobe de abajo hasta la cima, adobe por adobe.',
      simple: 'Una manera de llegar de abajo hasta la cima.', ejemplos: ['Con tres abajo, el del medio sube por 2 caminos.', 'El de una punta sube por un solo camino.', 'Con cinco abajo, el del medio sube por 6 caminos.'] },
  ];

  const IDEAS = [reparto, poligono, mayor, magico, multiplica, piramide];
  return {
    unidad: 'razonamiento-matematico.arreglos-numericos',
    version: '0.4.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-casillas.js'],
    letras: { T: 'el total de todos los números del reto', S: 'la suma común de cada línea', V: 'la suma de las esquinas (V de vértices)', c: 'el número de la casilla compartida o del centro', n: 'el orden del cuadrado: casillas por fila', a: 'una de dos casillas opuestas', b: 'la otra de dos casillas opuestas', P: 'el producto común de cada línea', x: 'el número de la casilla que se busca' },
    glosario: GLOSARIO,
    laboratorio: [mesaReparto, mesaTri, mesaMagico],
    // A qué idea pertenece cada mesa (Gerson, 16 nov). Las ideas 2, 5 y 6 aportan su juego.
    laboratorioIdeas: { 'reparto-libre': ['reparto-parejo'], 'triangulo-libre': ['mayor-suma'], 'magico-libre': ['suma-magica'] },
    historia: {
      texto: 'Los cuadrados mágicos circularon por muchas culturas; en China se cuenta el Lo Shu, un 3 × 3 con los números del 1 al 9. En 1514, Durero grabó uno de 4 × 4 con el año en la fila de abajo. La suma de cada línea se conoce antes de llenar el tablero.',
      pregunta: '¿Qué no cambia aunque cambies los números de lugar?',
      fuente: { titulo: 'Magic Squares · ETH Library', url: 'https://library.ethz.ch/en/collections-and-archives/platforms/virtual-exhibitions/Its-all-math-and-games/magic-squares.html' },
    },
    ideas: IDEAS,
  };
});
