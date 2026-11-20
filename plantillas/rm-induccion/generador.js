/*
 * Generador: razonamiento inductivo, de los casos chicos a la regla (práctica de la unidad
 * razonamiento-matematico.razonamiento-inductivo, etapa 8; propuesta: docs/etapa8/propuesta-razonamiento-matematico.md).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['rm-induccion']) y en Node.
 *
 * Tipos por idea (TIPOS_POR_IDEA; los id de las ideas de la teoría) y sus _datos:
 *   figuras-que-crecen      fosforos { forma, k } · fosforos-inverso { forma, T } · fosforos-diferencia { forma, a, b }
 *                           forma: cuadrado (4 y 3 más por paso), triangulo (3 y 2), casita (6 y 5), doble (7 y 5)
 *   tres-casos-no-prueban   contraejemplo { p, casos } (n × n + n + p) · primer-fallo { forma: 'poli' | 'seis', p }
 *                           · dos-reglas { a, regla: 'doble' | 'suma' } (la lista a, 2a, 4a)
 *   cada-caso-con-su-lugar  rectangulo { forma: 'n(n+1)' | 'n(n+2)' | '(n+1)(n+1)', k } · rectangulo-inverso { forma, T }
 *                           · triangular { k } (monedas en triángulo, con 1 + 2 + … + n en los datos)
 *   arreglo-triangular      fila-impares { k } (suma de la fila k) · ultimo-impares { k } · fila-pascal { k }
 *   cuenta-larga            cifras-cuadrado { d, n } (suma de cifras de dd…d × dd…d) · cifras-cantidad { n } (cuántas
 *                           cifras tiene 99…9 × 99…9) · unos-cuadrado { n } (suma de cifras de 11…1 × 11…1, n ≤ 9)
 *   lo-que-se-repite        pulsera { ciclo, k } · bloque { bloque, pre, k } · unidades { a, b, N }
 * Sin idea, el tipo sale de todos (las semillas de casos.json fijan el tipo y la idea).
 *
 * calc (funciones puras, contadas o simuladas, nunca escritas a mano): fosforos(forma, k), chapitas(forma, k), tri(k),
 *   filaImpares(k), filaPascal(k), cuadrado(cifras), sumaCifras(s), toca(ciclo, k, pre), unidades(a, b, N), primo(x),
 *   primerFallo(f, desde), resolver(_datos).
 *
 * Errores (docs/investigacion/codigos-rm-procesos.md, «Razonamiento inductivo»; todos hipótesis salvo RM2, parcial):
 *   RM2 objeto entero (el doble del caso mitad) · RMP1 contar dos veces lo compartido · RMP26 no descontar lo de antes del
 *   ciclo · RMP27 el residuo leído uno de más o de menos · RMP86 crecimiento lineal supuesto · RMP160 sin lo de la figura 1
 *   · RMP161 el lugar corrido · RMP162 el patrón visto como regla · RMP163 sumar lo último que creció · RMP164 la otra
 *   regla que encaja · RMP166 el caso mal escrito con su lugar · RMP167 olvidar lo que se resta o divide al final · RMP168
 *   empezar la fila donde no empieza · RMP169 quedarse con el primer caso · RMP170 contar una parte de las cifras · RMP171
 *   el cociente en vez del residuo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-induccion';
  const UNIDAD = 'razonamiento-matematico.razonamiento-inductivo';
  const RM2F = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: id.startsWith('RM2') ? 'parcial' : 'hipotesis', fuente: id.startsWith('RM2') ? RM2F : null });
  const ht = (id, clave, texto, explicacion) => ({ id, clave, texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 0);
  const v = P.v;
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));

  // ---------- Cálculos ----------
  const FORMAS = {
    cuadrado: { primero: 4, agrega: 3, nombre: ['cuadrado', 'cuadrados'], fila: 'una fila de cuadrados pegados', dato: 'Dos cuadrados vecinos comparten un fósforo.' },
    triangulo: { primero: 3, agrega: 2, nombre: ['triángulo', 'triángulos'], fila: 'una fila de triángulos, uno con la punta arriba y el siguiente con la punta abajo', dato: 'Dos triángulos vecinos comparten un fósforo.' },
    casita: { primero: 6, agrega: 5, nombre: ['casita', 'casitas'], fila: 'una fila de casitas pegadas (cada casita: un cuadrado con techo de dos fósforos)', dato: 'Dos casitas vecinas comparten una pared.' },
    doble: { primero: 7, agrega: 5, nombre: ['columna', 'columnas'], fila: 'una fila de columnas de dos cuadrados, uno sobre otro', dato: 'Dos columnas vecinas comparten sus fósforos del medio.' },
  };
  const fosforos = (forma, k) => FORMAS[forma].primero + FORMAS[forma].agrega * (k - 1);
  const CHAP = { 'n(n+1)': k => k * (k + 1), 'n(n+2)': k => k * (k + 2), '(n+1)(n+1)': k => (k + 1) * (k + 1) };
  const CHAP_TXT = { 'n(n+1)': 'n × (n + 1)', 'n(n+2)': 'n × (n + 2)', '(n+1)(n+1)': '(n + 1) × (n + 1)' };
  const chapitas = (forma, k) => CHAP[forma](k);
  const tri = k => k * (k + 1) / 2;
  const filaImpares = k => rango(1, k).map(j => k * (k - 1) + 2 * j - 1);
  const filaPascal = k => { let fl = [1]; for (let i = 1; i < k; i++) fl = [1, ...fl.slice(1).map((x, j) => x + fl[j]), 1]; return fl; };
  const cuadrado = s => (BigInt(s) * BigInt(s)).toString();
  const sumaCifras = s => suma(String(s).split('').map(Number));
  const toca = (ciclo, k, pre = []) => (k <= pre.length ? pre[k - 1] : ciclo[(k - pre.length - 1) % ciclo.length]);
  function unidades(a, b, N) { const s = [a, b]; while (s.length < N) s.push((s[s.length - 1] * s[s.length - 2]) % 10); return s; }
  function cicloDe(a, b) {
    const s = unidades(a, b, 80);
    for (let i = 0; i < 40; i++) for (let p = 1; p <= 20; p++) if (rango(i, i + 30).every(j => s[j] === s[j + p])) return { pre: i, largo: p };
    return null;
  }
  const primo = x => x > 1 && rango(2, Math.floor(Math.sqrt(x))).every(d => x % d);
  const primerFallo = (fn, desde) => { for (let x = desde; ; x++) if (!primo(fn(x))) return x; };
  const poli = p => n => n * n + n + p;
  const COLOR = { R: ['roja', 'Roja'], V: ['verde', 'Verde'], N: ['negra', 'Negra'], B: ['blanca', 'Blanca'], D: ['dorada', 'Dorada'], C: ['celeste', 'Celeste'] };

  function resolver(d) {
    switch (d.tipo) {
      case 'fosforos': return fosforos(d.forma, d.k);
      case 'fosforos-inverso': return rango(1, 500).find(k => fosforos(d.forma, k) === d.T);
      case 'fosforos-diferencia': return fosforos(d.forma, d.b) - fosforos(d.forma, d.a);
      case 'contraejemplo': return `n${primerFallo(poli(d.p), 0)}`;
      case 'primer-fallo': return `n${d.forma === 'poli' ? primerFallo(poli(d.p), 0) : primerFallo(n => 6 * n + d.p, 1)}`;
      case 'dos-reglas': return d.regla === 'doble' ? 8 * d.a : 7 * d.a;
      case 'rectangulo': return chapitas(d.forma, d.k);
      case 'rectangulo-inverso': return rango(1, 200).find(k => chapitas(d.forma, k) === d.T);
      case 'triangular': return tri(d.k);
      case 'fila-impares': return suma(filaImpares(d.k));
      case 'ultimo-impares': return filaImpares(d.k)[d.k - 1];
      case 'fila-pascal': return suma(filaPascal(d.k));
      case 'cifras-cuadrado': return sumaCifras(cuadrado(String(d.d).repeat(d.n)));
      case 'cifras-cantidad': return cuadrado('9'.repeat(d.n)).length;
      case 'unos-cuadrado': return sumaCifras(cuadrado('1'.repeat(d.n)));
      case 'pulsera': return toca(d.ciclo, d.k);
      case 'bloque': return toca(d.bloque, d.k, d.pre);
      case 'unidades': return unidades(d.a, d.b, d.N)[d.N - 1];
    }
    return null;
  }

  // ---------- Datos (contrato, punto 13): herramientas, no el paso hecho ----------
  const D_FIG = 'Figura n: lo de la figura 1 más lo que agrega cada paso, por (n − 1) pasos.';
  const D_PRIMO = 'Un número primo tiene solo dos divisores: 1 y él mismo.';
  const D_CONTRA = 'Contraejemplo: un caso que no cumple lo que se afirma.';
  const D_LUGAR = 'Cada figura se arma con la misma regla; su número de lugar es n.';
  const D_TRI = '1 + 2 + 3 + … + n = n × (n + 1) ÷ 2';
  const D_FILA = 'La fila n tiene n números; la fila 1 es la de arriba.';
  const D_SUMA = 'Suma de cifras: se suman los dígitos; la de 2026 es 2 + 0 + 2 + 6 = 10.';
  const D_CICLO = 'Ciclo: lo que se repite igual, siempre en el mismo orden.';
  const D_RES = 'Residuo: lo que sobra al dividir; 17 entre 5 da 3 y sobran 2.';
  function datosDe(d) {
    switch (d.tipo) {
      case 'fosforos': case 'fosforos-inverso': case 'fosforos-diferencia': return [D_FIG, FORMAS[d.forma].dato];
      case 'contraejemplo': case 'primer-fallo': return [D_PRIMO, D_CONTRA];
      case 'dos-reglas': return ['Cada número de la lista sale del anterior con la regla dada.'];
      case 'rectangulo': case 'rectangulo-inverso': return [D_LUGAR];
      case 'triangular': return [D_TRI, D_LUGAR];
      case 'fila-impares': return ['Los números son los impares en orden: 1, 3, 5, 7…', D_FILA, 'n³ = n × n × n'];
      case 'ultimo-impares': return ['Los números son los impares en orden: 1, 3, 5, 7…', D_FILA];
      case 'fila-pascal': return ['Cada número es la suma de los dos que tiene encima; los de los bordes son 1.', D_FILA];
      case 'cifras-cuadrado': case 'unos-cuadrado': return [D_SUMA, 'La calculadora del salón muestra hasta 10 cifras.'];
      case 'cifras-cantidad': return ['La calculadora del salón muestra hasta 10 cifras.'];
      case 'pulsera': case 'bloque': return [D_CICLO, D_RES];
      case 'unidades': return [D_CICLO, D_RES, 'Cifra de las unidades: la última; la de 48 es 8.'];
    }
    return [D_CICLO];
  }

  // ---------- Cierre común: alternativas, solución y respuesta ----------
  function cerrar(rng, semilla, o) {
    const unidad = o.unidad || '';
    const alternativas = o.textos
      ? P.armarTexto({ correcta: o.correcta, errores: o.errores, rng })
      : P.armar({ correcta: o.correcta, errores: o.errores, rng, decimales: 0, texto: x => f(x) + (unidad ? ' ' + (x === 1 ? unidad[0] : unidad[1]) : '') });
    const resp = o.textos ? o.correcta.texto : f(o.correcta) + (unidad ? ' ' + (o.correcta === 1 ? unidad[0] : unidad[1]) : '');
    return {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: { x: { nombre: 'lo pedido, ya comprobado', color: 'f' } },
      enunciado: o.enunciado, pregunta: o.pregunta, datos: datosDe(o.datos),
      alternativas, solucion: o.solucion.concat([['Respuesta: ', v('x', resp), '.']]),
      respuesta: { valor: o.textos ? o.correcta.clave : o.correcta, unidad: unidad ? unidad[1] : '' }, _datos: o.datos,
    };
  }
  const FOS = ['fósforo', 'fósforos'];

  // ---------- Idea 1: la figura que crece ----------
  function tFosforos(rng) {
    const forma = rng.elegir(Object.keys(FORMAS)), F = FORMAS[forma], k = rng.entero(12, 60), r = fosforos(forma, k);
    const errores = [
      h('RMP1-cada-uno-entero', F.primero * k, `Cada ${F.nombre[0]} nuevo comparte con su vecino: no trae ${F.primero}, trae ${F.agrega}.`),
      h('RMP160-sin-la-primera', F.agrega * k, `${F.agrega} es lo que trae cada paso; la figura 1 trae ${F.primero}, no ${F.agrega}.`),
      h('RMP161-figura-siguiente', fosforos(forma, k + 1), `Diste un paso de más: de la figura 1 a la ${k} hay ${k - 1} pasos, no ${k}.`),
      h('RMP161-figura-anterior', fosforos(forma, k - 1), `Diste un paso de menos: de la figura 1 a la ${k} hay ${k - 1} pasos.`),
    ];
    if (k % 2 === 0) errores.splice(1, 0, h('RM2-doble-de-la-mitad', 2 * fosforos(forma, k / 2), `Dos figuras ${k / 2} sueltas no forman la figura ${k}: al pegarlas se comparte.`));
    return cerrar(rng, null, { datos: { tipo: 'fosforos', forma, k }, correcta: r, errores, unidad: FOS,
      enunciado: [`Con fósforos iguales se arma ${F.fila}. La figura 1 tiene ${F.primero} fósforos; la 2, ${fosforos(forma, 2)}; la 3, ${fosforos(forma, 3)}.`],
      pregunta: [`¿Cuántos fósforos tiene la figura ${k}?`],
      solucion: [[`La figura 1 trae ${F.primero} y cada paso agrega ${F.agrega}: de la figura 1 a la ${k} hay ${k - 1} pasos.`], [`${F.primero} + ${F.agrega} × ${k - 1} = ${f(r)}.`]] });
  }
  function tFosforosInverso(rng) {
    const forma = rng.elegir(Object.keys(FORMAS)), F = FORMAS[forma], k = rng.entero(15, 70), T = fosforos(forma, k);
    const errores = [
      h('RMP160-cuenta-pasos', k - 1, `${k - 1} son los pasos después de la figura 1; falta contar la figura 1.`),
      h('RMP161-paso-de-mas', k + 1, 'Bien que quitas lo de la figura 1, pero contaste un paso de más.'),
      h('RMP161-dos-de-mas', k + 2, 'Contaste dos pasos de más: comprueba tu respuesta con la cuenta de la figura.'),
    ];
    if (T % F.primero === 0) errores.push(h('RMP1-reparte-todo', T / F.primero, `Repartir entre ${F.primero} sería si cada ${F.nombre[0]} tuviera sus fósforos propios.`));
    if (T % F.agrega === 0) errores.push(h('RMP160-reparte-lo-nuevo', T / F.agrega, `Repartir entre ${F.agrega} olvida que la figura 1 trae ${F.primero}.`));
    errores.push(h('RMP161-dos-de-menos', k - 2, 'Contaste un paso de menos y olvidaste la figura 1.'));
    return cerrar(rng, null, { datos: { tipo: 'fosforos-inverso', forma, T }, correcta: k, errores, unidad: F.nombre,
      enunciado: [`Con fósforos iguales se arma ${F.fila}. La figura 1 tiene ${F.primero} fósforos; la 2, ${fosforos(forma, 2)}; la 3, ${fosforos(forma, 3)}.`],
      pregunta: [`Una de las figuras usa ${f(T)} fósforos. ¿Cuántas ${F.nombre[1]} tiene?`.replace(/Cuántas (cuadrados|triángulos)/, 'Cuántos $1')],
      solucion: [[`Sin los ${F.primero} de la figura 1 quedan los fósforos de los pasos, de ${F.agrega} en ${F.agrega}: (${f(T)} − ${F.primero}) ÷ ${F.agrega} = ${k - 1}.`], [`Son ${k - 1} pasos después de la figura 1: la figura tiene ${k - 1} + 1 = ${k}.`]] });
  }
  function tFosforosDiferencia(rng) {
    const forma = rng.elegir(Object.keys(FORMAS)), F = FORMAS[forma], a = rng.entero(5, 30), b = a + rng.entero(6, 25), r = F.agrega * (b - a);
    return cerrar(rng, null, { datos: { tipo: 'fosforos-diferencia', forma, a, b }, correcta: r, unidad: FOS,
      errores: [
        h('RMP161-cuenta-las-dos', F.agrega * (b - a + 1), `Contaste ${b - a + 1} pasos; de la figura ${a} a la ${b} hay ${b - a}.`),
        h('RMP1-cada-uno-entero', F.primero * (b - a), `Cada ${F.nombre[0]} nuevo comparte con su vecino y trae ${F.agrega}, no ${F.primero}.`),
        h('RM2-figura-diferencia', fosforos(forma, b - a), `Esos son los fósforos de la figura ${b - a}, que trae los de una figura 1.`),
        h('RMP160-figura-entera', fosforos(forma, b), `Esa es la figura ${b} entera; piden lo que tiene de más que la ${a}.`),
      ],
      enunciado: [`Con fósforos iguales se arma ${F.fila}. La figura 1 tiene ${F.primero} fósforos; la 2, ${fosforos(forma, 2)}; la 3, ${fosforos(forma, 3)}.`],
      pregunta: [`¿Cuántos fósforos más tiene la figura ${b} que la figura ${a}?`],
      solucion: [[`De la figura ${a} a la ${b} hay ${b - a} pasos, y cada paso agrega ${F.agrega}: ${F.agrega} × ${b - a} = ${f(r)}.`]] });
  }

  // ---------- Idea 2: tres casos no prueban ----------
  function tContraejemplo(rng) {
    const p = rng.elegir([11, 17, 41]), fn = poli(p), x = primerFallo(fn, 0), otros = rng.barajar(rango(1, Math.min(9, x - 1))).slice(0, 4).sort((a, b) => a - b);
    const errores = otros.map(c => ht(`RMP162-cumple-${c}`, `n${c}`, `n = ${c}`, `Con n = ${c} sale ${fn(c)}, que es primo: ese caso cumple.`));
    return cerrar(rng, null, { datos: { tipo: 'contraejemplo', p, casos: otros }, textos: true, correcta: { clave: `n${x}`, texto: `n = ${x}` }, errores,
      enunciado: [`Se afirma: «n × n + n + ${p} es primo para todo n desde 0».`], pregunta: ['¿Cuál de estos casos es un contraejemplo?'],
      solucion: [[`Con n = ${x} sale ${fn(x)} = ${p} × ${p}, que no es primo: no cumple.`], ['Los demás casos dan números primos: cumplen.']] });
  }
  function tPrimerFallo(rng) {
    const forma = rng.elegir(['poli', 'seis']), p = forma === 'poli' ? rng.elegir([11, 17, 41]) : rng.elegir([1, -1]);
    const fn = forma === 'poli' ? poli(p) : (n => 6 * n + p), desde = forma === 'poli' ? 0 : 1, x = primerFallo(fn, desde), antes = x - 1;
    // El distractor «después» es el siguiente n que tampoco cumple (con 6 × n ± 1, el n = x + 1 da primo: 31, 41).
    const despues = primerFallo(fn, x + 1);
    const t = forma === 'poli' ? `n × n + n + ${p}` : `6 × n ${p > 0 ? '+' : '−'} 1`;
    const fac = y => { for (let d = 2; d * d <= y; d++) if (y % d === 0) return `${d} × ${y / d}`; return ''; };
    return cerrar(rng, null, { datos: { tipo: 'primer-fallo', forma, p }, textos: true, correcta: { clave: `n${x}`, texto: `n = ${x}` },
      errores: [
        ht('RMP162-nunca', 'nunca', 'Ninguno: siempre da primo', `Los primeros casos dan primos, pero eso no prueba que todos lo den.`),
        ht('RMP162-antes', `n${antes}`, `n = ${antes}`, `Con n = ${antes} sale ${fn(antes)}, que es primo: todavía cumple.`),
        ht('RMP161-despues', `n${despues}`, `n = ${despues}`, `Con n = ${despues} tampoco sale primo, pero antes ya falló n = ${x}.`),
        ht('RMP162-dos-antes', `n${antes - 1}`, `n = ${antes - 1}`, `Con n = ${antes - 1} sale ${fn(antes - 1)}, que es primo: cumple.`),
      ],
      enunciado: [`Se afirma: «${t} es primo para todo n desde ${desde}». Se revisa con n = ${desde}, ${desde + 1}, ${desde + 2}…`], pregunta: ['¿Cuál es el primer n que no cumple?'],
      solucion: [[`Hasta n = ${antes} todo sale primo; con n = ${x} sale ${fn(x)} = ${fac(fn(x))}.`]] });
  }
  function tDosReglas(rng) {
    const a = rng.entero(2, 9), regla = rng.elegir(['doble', 'suma']), r = regla === 'doble' ? 8 * a : 7 * a;
    return cerrar(rng, null, { datos: { tipo: 'dos-reglas', a, regla }, correcta: r,
      errores: [
        h('RMP164-otra-regla', regla === 'doble' ? 7 * a : 8 * a, 'Esa sale con la otra regla que también encaja con los tres números; el enunciado fijó esta.'),
        h('RMP163-lo-ultimo', 6 * a, `Sumaste otra vez ${2 * a}, lo último que creció; la regla dada dice otra cosa.`),
        h('RMP169-lo-primero', 5 * a, `Sumaste ${a}, lo que creció al principio; la regla dada dice otra cosa.`),
        h('RMP161-quinto', regla === 'doble' ? 16 * a : 11 * a, 'Ese es el quinto número; piden el cuarto.'),
      ],
      enunciado: [`La lista ${a}, ${2 * a}, ${4 * a} sigue esta regla: ${regla === 'doble' ? 'cada número es el doble del anterior' : `lo que se suma crece de ${a} en ${a}`}.`],
      pregunta: ['¿Cuál es el cuarto número?'],
      solucion: [[regla === 'doble' ? `El cuarto es el doble del tercero: ${4 * a} × 2 = ${r}.` : `Se sumó ${a} y después ${2 * a}: ahora toca ${3 * a}. ${4 * a} + ${3 * a} = ${r}.`]] });
  }

  // ---------- Idea 3: cada caso con su lugar ----------
  function errChap(fn, k) {
    const e = [
      h('RMP86-lineal', fn(1) + (fn(2) - fn(1)) * (k - 1), `Sumaste siempre ${fn(2) - fn(1)}, lo del primer paso; pero lo que se agrega crece.`),
      h('RMP166-lugar-al-cuadrado', k * k, `${k} × ${k} usa el lugar dos veces; mira bien filas y columnas.`),
      h('RMP161-figura-siguiente', fn(k + 1), `Esa es la figura ${k + 1}: corriste el lugar en uno.`),
      h('RMP161-figura-anterior', fn(k - 1), `Esa es la figura ${k - 1}: corriste el lugar en uno.`),
    ];
    if (k % 2 === 0) e.splice(2, 0, h('RM2-doble-de-la-mitad', 2 * fn(k / 2), `Dos figuras ${k / 2} juntas no forman la figura ${k}: no crece en proporción.`));
    return e;
  }
  function tRectangulo(rng) {
    const forma = rng.elegir(Object.keys(CHAP)), fn = CHAP[forma], k = rng.entero(8, 30), r = fn(k);
    return cerrar(rng, null, { datos: { tipo: 'rectangulo', forma, k }, correcta: r, errores: errChap(fn, k), unidad: ['chapita', 'chapitas'],
      enunciado: [`Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen ${fn(1)}, ${fn(2)} y ${fn(3)} chapitas.`], pregunta: [`¿Cuántas tiene la figura ${k}?`],
      solucion: [[`Cada figura es filas por columnas: la figura n es ${CHAP_TXT[forma]}.`], [`Con n = ${k}: ${f(r)}.`]] });
  }
  function tRectanguloInverso(rng) {
    const forma = rng.elegir(['n(n+1)', 'n(n+2)']), fn = CHAP[forma], k = rng.entero(8, 25), T = fn(k);
    const errores = [
      h('RMP161-una-mas', k + 1, `La figura ${k + 1} tiene ${fn(k + 1)}: se pasa.`),
      h('RMP161-una-menos', k - 1, `La figura ${k - 1} tiene ${fn(k - 1)}: le faltan.`),
      h('RMP166-la-mitad', Math.round(T / 2), `La mitad de ${T} no es el número de la figura; busca filas por columnas que den ${T}.`),
      h('RMP161-dos-mas', k + 2, `La figura ${k + 2} tiene ${fn(k + 2)}: se pasa.`),
    ];
    const lin = (T - fn(1)) / (fn(2) - fn(1)) + 1;
    if (Number.isInteger(lin)) errores.unshift(h('RMP86-lineal', lin, `Contaste como si cada paso agregara ${fn(2) - fn(1)}; lo que se agrega crece.`));
    return cerrar(rng, null, { datos: { tipo: 'rectangulo-inverso', forma, T }, correcta: k, errores,
      enunciado: [`Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen ${fn(1)}, ${fn(2)} y ${fn(3)} chapitas.`], pregunta: [`¿Qué figura tiene ${f(T)} chapitas?`],
      solucion: [[`La figura n es ${CHAP_TXT[forma]}. Con n = ${k} sale ${f(T)}.`]] });
  }
  function tTriangular(rng) {
    const k = rng.entero(8, 30), r = tri(k);
    return cerrar(rng, null, { datos: { tipo: 'triangular', k }, correcta: r, unidad: ['moneda', 'monedas'],
      errores: [
        h('RMP166-cuadrado', k * k, `${k} × ${k} sería un cuadrado de monedas; el triángulo tiene filas de 1 a ${k}.`),
        h('RMP167-sin-dividir', k * (k + 1), `Bien la cuenta ${k} × ${k + 1}, pero falta dividir entre 2.`),
        h('RMP86-lineal', 1 + 2 * (k - 1), 'Sumaste siempre 2, lo del primer paso; cada fila nueva trae una moneda más.'),
        h('RMP161-figura-siguiente', tri(k + 1), `Esa es la figura ${k + 1}: corriste el lugar en uno.`),
      ],
      enunciado: ['Se ponen monedas en triángulo: la figura 1 tiene 1; la 2, 3 (1 + 2); la 3, 6 (1 + 2 + 3).'], pregunta: [`¿Cuántas monedas tiene la figura ${k}?`],
      solucion: [[`La figura ${k} tiene filas de 1 hasta ${k} monedas: ${k} × ${k + 1} ÷ 2 = ${f(r)}.`]] });
  }

  // ---------- Idea 4: filas de un triángulo de números ----------
  const LATAS = 'En una pirámide de latas, ';
  function tFilaImpares(rng) {
    const k = rng.entero(6, 25), r = k ** 3, errores = [
      h('RMP168-desde-el-uno', k * k, `${k * k} suman los ${k} primeros impares; la fila ${k} no empieza en 1.`),
      h('RMP161-fila-siguiente', (k + 1) ** 3, `Esa es la fila ${k + 1}: corriste el lugar en uno.`),
      h('RMP161-fila-anterior', (k - 1) ** 3, `Esa es la fila ${k - 1}: corriste el lugar en uno.`),
      h('RMP86-lineal', 1 + 7 * (k - 1), 'Sumaste 7 por fila, lo del primer paso; lo que crece cambia en cada fila.'),
    ];
    if (k % 2 === 0) errores.splice(1, 0, h('RM2-doble-de-la-mitad', 2 * (k / 2) ** 3, `Dos filas ${k / 2} no forman la fila ${k}: no crece en proporción.`));
    return cerrar(rng, null, { datos: { tipo: 'fila-impares', k }, correcta: r, errores,
      enunciado: [`${LATAS}las latas llevan los impares en orden, fila por fila: 1; 3, 5; 7, 9, 11…`], pregunta: [`¿Cuánto suman las latas de la fila ${k}?`],
      solucion: [['Las filas 1, 2 y 3 suman 1, 8 y 27: cada una, su número de fila al cubo.'], [`${k} × ${k} × ${k} = ${f(r)}.`]] });
  }
  function tUltimoImpares(rng) {
    const k = rng.entero(6, 30), r = k * k + k - 1;
    return cerrar(rng, null, { datos: { tipo: 'ultimo-impares', k }, correcta: r,
      errores: [
        h('RMP168-el-impar-k', 2 * k - 1, `${2 * k - 1} es el impar número ${k}; antes de la fila ${k} ya hay muchas latas.`),
        h('RMP167-sin-restar', k * (k + 1), `Bien el ${k} × ${k + 1}, pero falta restar 1: 5 = 2 × 3 − 1, 11 = 3 × 4 − 1.`),
        h('RMP161-primera-siguiente', k * k + k + 1, `Esa es la primera lata de la fila ${k + 1}.`),
        h('RMP166-lugar-al-cuadrado', k * k, `${k} × ${k} no sale de los casos: los últimos son 1, 5, 11, 19.`),
      ],
      enunciado: [`${LATAS}las latas llevan los impares en orden, fila por fila: 1; 3, 5; 7, 9, 11…`], pregunta: [`¿Qué número lleva la última lata de la fila ${k}?`],
      solucion: [['Los últimos son 1, 5, 11, 19: 1 × 2 − 1, 2 × 3 − 1, 3 × 4 − 1, 4 × 5 − 1.'], [`${k} × ${k + 1} − 1 = ${f(r)}.`]] });
  }
  function tFilaPascal(rng) {
    const k = rng.entero(8, 16), r = 2 ** (k - 1);
    return cerrar(rng, null, { datos: { tipo: 'fila-pascal', k }, correcta: r,
      errores: [
        h('RMP161-fila-siguiente', 2 ** k, `Esa es la fila ${k + 1}: corriste el lugar en uno.`),
        h('RMP86-lineal', 2 * (k - 1), 'Seguiste 2, 4, 6…: sumaste 2 por fila desde la fila 2. Pero cada suma duplica la anterior.'),
        h('RMP166-lugar-al-cuadrado', k * k, `${k} × ${k} no sale de los casos: 1, 2, 4, 8 no son 1, 4, 9, 16.`),
        h('RMP161-fila-anterior', 2 ** (k - 2), `Esa es la fila ${k - 1}: corriste el lugar en uno.`),
      ],
      enunciado: [`${LATAS}cada número es la suma de los dos que tiene encima. Las filas 1, 2, 3 y 4 suman 1, 2, 4 y 8.`], pregunta: [`¿Cuánto suma la fila ${k}?`],
      solucion: [['Cada número de una fila pasa a las dos latas que tiene debajo (los bordes repiten el 1): por eso cada fila suma el doble de la anterior.'],
        [`La fila ${k} suma 2 × 2 × … × 2, con ${k - 1} doses: ${f(r)}.`]] });
  }

  // ---------- Idea 5: casos chicos de una cuenta larga ----------
  const corto = (d, n) => `${d}${d}…${d}`;
  // Por qué son 9 por cada cifra: la forma del resultado (comprobada con BigInt en generador.test.js).
  const FORMA = { 3: 'El resultado tiene unos, un 0, ochos y un 9: cada 1 con un 8 suma 9, como el 0 con el 9.',
    6: 'El resultado tiene cuatros, un 3, cincos y un 6: cada 4 con un 5 suma 9, como el 3 con el 6.',
    9: 'El resultado tiene nueves, un 8, ceros y un 1: cada 9 suma 9, como el 8 con el 1.' };
  function tCifrasCuadrado(rng) {
    const d = rng.elegir([3, 6, 9]), n = rng.entero(8, 60), r = sumaCifras(cuadrado(String(d).repeat(n)));
    const errores = [
      h('RMP170-una-parte', 9 * (n - 1), 'Bien las cifras que se repiten, pero faltan las dos que no se repiten.'),
      h('RMP169-primer-caso', 9, '9 es la suma del primer caso; con más cifras la suma crece: 9, 18, 27…'),
      h('RMP161-caso-siguiente', 9 * (n + 1), `Esa sería con ${n + 1} cifras: corriste el caso en uno.`),
      h('RMP170-cuenta-cifras', 2 * n, `${2 * n} son las cifras del resultado; piden cuánto suman.`),
    ];
    if (d !== 3) errores.push(h('RM2-repite-el-primero', d * d * n, `${f(d * d * n)} es ${n} veces ${d * d}; el resultado no es ${d * d} repetido.`));
    return cerrar(rng, null, { datos: { tipo: 'cifras-cuadrado', d, n }, correcta: r, errores,
      enunciado: [`El número ${corto(d, n)} tiene ${n} cifras, todas ${d}, y se multiplica por sí mismo: ${corto(d, n)} × ${corto(d, n)}.`], pregunta: ['¿Cuánto suman las cifras del resultado?'],
      solucion: [[`Casos chicos: ${d} × ${d}, ${d}${d} × ${d}${d} y ${d}${d}${d} × ${d}${d}${d} dan resultados cuyas cifras suman 9, 18 y 27.`], [FORMA[d]], [`Son 9 por cada cifra: 9 × ${n} = ${f(r)}.`]] });
  }
  function tCifrasCantidad(rng) {
    const n = rng.entero(8, 60), r = cuadrado('9'.repeat(n)).length;
    return cerrar(rng, null, { datos: { tipo: 'cifras-cantidad', n }, correcta: r, unidad: ['cifra', 'cifras'],
      errores: [
        h('RMP167-una-menos', 2 * n - 1, 'Con 2 nueves sale 9801: 4 cifras, el doble justo; no una menos.'),
        h('RMP169-las-mismas', n, 'El resultado no tiene las mismas cifras que el número: 9 × 9 = 81 ya tiene dos.'),
        h('RMP166-al-cuadrado', n * n, `${n} × ${n} no sale de los casos: 2, 4, 6 cifras crecen de 2 en 2.`),
        h('RMP161-una-mas', 2 * n + 1, 'Contaste una cifra de más: 81, 9801 y 998 001 tienen 2, 4 y 6.'),
      ],
      enunciado: [`El número 99…9 tiene ${n} cifras, todas 9, y se multiplica por sí mismo.`], pregunta: ['¿Cuántas cifras tiene el resultado?'],
      solucion: [['81, 9801 y 998 001 tienen 2, 4 y 6 cifras: el doble de los nueves.'], [`2 × ${n} = ${r}.`]] });
  }
  function tUnosCuadrado(rng) {
    const n = rng.entero(4, 9), r = sumaCifras(cuadrado('1'.repeat(n)));
    return cerrar(rng, null, { datos: { tipo: 'unos-cuadrado', n }, correcta: r,
      errores: [
        h('RMP170-cuenta-cifras', 2 * n - 1, `${2 * n - 1} es cuántas cifras tiene el resultado; piden cuánto suman.`),
        h('RMP167-solo-la-subida', n * (n + 1) / 2, 'Sumaste solo la subida (1, 2, 3…); las cifras también bajan.'),
        h('RMP161-caso-anterior', (n - 1) * (n - 1), `Esa es la suma con ${n - 1} unos: corriste el caso en uno.`),
        h('RMP169-la-del-medio', n, `${n} es la cifra del medio del resultado, no la suma de todas.`),
      ],
      enunciado: [`El número ${'1'.repeat(n)} tiene ${n} unos y se multiplica por sí mismo.`], pregunta: ['¿Cuánto suman las cifras del resultado?'],
      solucion: [['Casos chicos: 1, 121 y 12 321 suman 1, 4 y 9: la cantidad de unos por sí misma.'], ['Las cifras suben de 1 hasta la cantidad de unos y vuelven a bajar: vale hasta 9 unos; con 10 ya hay llevadas.'], [`${n} × ${n} = ${r}.`]] });
  }

  // ---------- Idea 6: lo que se repite ----------
  function tPulsera(rng) {
    const ciclo = rng.barajar(Object.keys(COLOR)).slice(0, rng.entero(4, 6)), L = ciclo.length, k = rng.entero(40, 300), q = Math.floor(k / L), re = k % L;
    const c = toca(ciclo, k), op = x => ({ clave: x, texto: COLOR[x][1] });
    const errores = [
      ht('RMP171-cociente', toca(ciclo, q === 0 ? L : q), op(toca(ciclo, q === 0 ? L : q)).texto, `${q} son los ciclos completos; lo que decide es lo que sobra al dividir entre ${L}: ${re}.`),
      ht('RMP27-una-de-mas', toca(ciclo, k + 1), op(toca(ciclo, k + 1)).texto, `Bien la división, pero contaste una de más: esa va en el lugar ${k + 1}.`),
      ht('RMP27-una-de-menos', toca(ciclo, k - 1), op(toca(ciclo, k - 1)).texto, `Bien la división, pero contaste una de menos: esa va en el lugar ${k - 1}.`),
      ht('RMP27-primera', ciclo[0], op(ciclo[0]).texto, 'Esa es la primera del ciclo; el residuo dice cuál toca.'),
      ht('RMP27-ultima', ciclo[L - 1], op(ciclo[L - 1]).texto, 'Esa es la última del ciclo: tocaría solo si no sobrara nada.'),
    ].filter(e => e.clave !== c);
    return cerrar(rng, null, { datos: { tipo: 'pulsera', ciclo, k }, textos: true, correcta: op(c), errores,
      enunciado: [`Una pulsera repite ${lista(ciclo.map(x => COLOR[x][0]))}, siempre en ese orden.`], pregunta: [`¿De qué color es la mostacilla del lugar ${k}?`],
      solucion: [[`El ciclo tiene ${L}: ${k} = ${L} × ${q} + ${re}.`], [re === 0 ? 'No sobra nada: toca la última del ciclo.' : `Toca la mostacilla ${re} del ciclo.`]] });
  }
  function tBloque(rng) {
    const bloque = rng.barajar(rango(1, 9)).slice(0, rng.entero(4, 6)), conPre = rng.sig() < 0.5;
    const pre = conPre ? [rng.elegir(rango(1, 9).filter(d => !bloque.includes(d)))] : [], k = rng.entero(50, 300), L = bloque.length;
    const c = toca(bloque, k, pre), q = Math.floor((k - pre.length) / L), re = (k - pre.length) % L;
    const errores = [
      h('RMP27-una-de-mas', toca(bloque, k + 1, pre), `Contaste una de más: esa cifra va en el lugar ${k + 1}.`),
      h('RMP27-una-de-menos', toca(bloque, k - 1, pre), `Contaste una de menos: esa cifra va en el lugar ${k - 1}.`),
      h('RMP171-cociente', toca(bloque, q === 0 ? L : q), `${q} son los bloques completos; lo que decide es lo que sobra: ${re}.`),
      conPre ? h('RMP26-sin-descontar', toca(bloque, k), `Bien el ciclo de ${L}, pero no descontaste el ${pre[0]} del inicio, que no se repite.`) : h('RMP27-ultima', bloque[L - 1], 'Esa es la última del bloque: tocaría solo si no sobrara nada.'),
      h('RMP27-primera', bloque[0], 'Esa es la primera del bloque; el residuo dice cuál toca.'),
    ];
    const muestra = rango(1, 2 * L + 2).map(j => toca(bloque, j, pre)).join('');
    return cerrar(rng, null, { datos: { tipo: 'bloque', bloque, pre, k }, correcta: c, errores,
      enunciado: [conPre ? `Un número empieza con ${pre[0]} y sigue con el bloque ${bloque.join('')} repetido: ${muestra}…` : `Se escribe el bloque ${bloque.join('')} una y otra vez: ${muestra}…`],
      pregunta: [`¿Qué cifra ocupa el lugar ${k}?`],
      solucion: [[conPre ? `Descuento el ${pre[0]} del inicio: ${k} − 1 = ${k - 1}.` : `El bloque tiene ${L} cifras.`], [`${k - pre.length} = ${L} × ${q} + ${re}: ${re === 0 ? 'toca la última del bloque' : `toca la cifra ${re} del bloque`}.`]] });
  }
  function tUnidades(rng) {
    for (let t = 0; t < 400; t++) {
      const a = rng.entero(2, 9), b = rng.entero(2, 9), C = cicloDe(a, b), N = rng.entero(40, 200);
      if (!C || C.pre < 1 || C.largo < 3) continue;
      const s = unidades(a, b, N + 2), c = s[N - 1];
      const errores = [
        h('RMP26-sin-descontar', s[C.pre + ((N - 1) % C.largo)], `Bien el ciclo de ${C.largo}, pero no descontaste los ${C.pre} términos de antes, que no se repiten.`),
        h('RMP27-uno-de-mas', s[N], `Contaste uno de más: ese es el término ${N + 1}.`),
        h('RMP27-uno-de-menos', s[N - 2], `Contaste uno de menos: ese es el término ${N - 1}.`),
        h('RMP169-primero-del-ciclo', s[C.pre], 'Ese es el primero del ciclo; el residuo dice cuál toca.'),
        h('RMP27-dos-de-mas', s[N + 1], `Contaste dos de más: ese es el término ${N + 2}.`),
      ];
      if (new Set(errores.map(e => e.valor).filter(x => x !== c && x > 0)).size < 3 || c === 0) continue;
      return cerrar(rng, null, { datos: { tipo: 'unidades', a, b, N }, correcta: c, errores,
        enunciado: [`Una sucesión empieza ${a}, ${b}. Desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores: ${s.slice(0, 8).join(', ')}…`],
        pregunta: [`¿Cuál es el término ${N}?`],
        solucion: [[`Antes del ciclo ${C.pre === 1 ? 'va 1 término' : `van ${C.pre} términos`}; el ciclo tiene ${C.largo}.`], [`${N} − ${C.pre} = ${N - C.pre} = ${C.largo} × ${Math.floor((N - C.pre) / C.largo)} + ${(N - C.pre) % C.largo}: ${(N - C.pre) % C.largo === 0 ? 'toca el último del ciclo' : `toca el término ${(N - C.pre) % C.largo} del ciclo`}.`]] });
    }
    return null;
  }

  const CONSTR = { fosforos: tFosforos, 'fosforos-inverso': tFosforosInverso, 'fosforos-diferencia': tFosforosDiferencia,
    contraejemplo: tContraejemplo, 'primer-fallo': tPrimerFallo, 'dos-reglas': tDosReglas,
    rectangulo: tRectangulo, 'rectangulo-inverso': tRectanguloInverso, triangular: tTriangular,
    'fila-impares': tFilaImpares, 'ultimo-impares': tUltimoImpares, 'fila-pascal': tFilaPascal,
    'cifras-cuadrado': tCifrasCuadrado, 'cifras-cantidad': tCifrasCantidad, 'unos-cuadrado': tUnosCuadrado,
    pulsera: tPulsera, bloque: tBloque, unidades: tUnidades };
  const TIPOS_POR_IDEA = {
    'figuras-que-crecen': ['fosforos', 'fosforos-inverso', 'fosforos-diferencia'],
    'tres-casos-no-prueban': ['contraejemplo', 'primer-fallo', 'dos-reglas'],
    'cada-caso-con-su-lugar': ['rectangulo', 'rectangulo-inverso', 'triangular'],
    'arreglo-triangular': ['fila-impares', 'ultimo-impares', 'fila-pascal'],
    'cuenta-larga': ['cifras-cuadrado', 'cifras-cantidad', 'unos-cuadrado'],
    'lo-que-se-repite': ['pulsera', 'bloque', 'unidades'],
  };
  const TIPOS = Object.values(TIPOS_POR_IDEA).flat();

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const idea = o.idea && TIPOS_POR_IDEA[o.idea] ? o.idea : null;
    const tipo = idea ? Azar.crear(ID + '+idea|' + idea + '|' + semilla).elegir(TIPOS_POR_IDEA[idea]) : rng.elegir(TIPOS);
    for (let intento = 0; intento < 200; intento++) {
      const p = CONSTR[tipo](rng);
      if (p && p.alternativas.length >= 4) {
        p.id = `${ID}#${semilla}`;
        p._datos = Object.assign({ idea: Object.keys(TIPOS_POR_IDEA).find(k => TIPOS_POR_IDEA[k].includes(tipo)) }, p._datos);
        return p;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const calc = { fosforos, chapitas, tri, filaImpares, filaPascal, cuadrado, sumaCifras, toca, unidades, primo, primerFallo, resolver };
  return { id: ID, titulo: 'De los casos chicos a la regla', generar, calc, TIPOS_POR_IDEA, tiposPorUnidad: { [UNIDAD]: TIPOS } };
});
