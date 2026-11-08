/*
 * Generador «ecuaciones-polinomiales»: raíces y coeficientes, ecuaciones de grado superior en contexto,
 * bicuadradas, raíz conocida con parámetro, raíces múltiples, paridad de raíces y raíces racionales.
 * Formato "predicciones" (docs/arquitectura.md) con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['ecuaciones-polinomiales']) y en Node (require). Sin DOM ni motor.
 *
 * Tipos (tipo/sub) y la falta que cubre cada uno (filas del grupo, en abstracto):
 *   vieta/cuadrados      cúbica ax³ + bx² + cx + d = 0 (a puede no ser 1): suma de los cuadrados de las raíces.
 *                        Falta: relaciones de Cardano-Vieta en cúbicas.
 *   vieta/cubos          cúbica con tres raíces enteras, una el doble de otra, y el término independiente
 *                        desconocido: suma de los cubos de las raíces. Falta: Cardano-Vieta (raíz doble de otra).
 *   vieta/tercera        cúbica con dos raíces conocidas y el coeficiente de x dado (los otros, letras): la tercera
 *                        raíz sale de la suma de productos binarios. Falta: Cardano-Vieta en cúbicas.
 *   vieta/progresion     cúbica con raíces en progresión aritmética: el coeficiente de x. Falta: Cardano-Vieta.
 *   caja/dimensiones     caja con aristas x, x + α y x + β y volumen dado: cúbica por tanteo de un divisor; la arista
 *                        mayor. Falta: cúbica por tanteo de factores enteros en contexto de volumen.
 *   caja/recorte         caja sin tapa por recortes cuadrados (de lado entero) en las esquinas, con volumen dado:
 *                        cartón de la caja. Falta: cúbica por tanteo en contexto de volumen (caja sin tapa).
 *   bicuadrada/consecutivos  dos pares o impares positivos consecutivos con la suma de sus cuartas potencias: el mayor.
 *                        Falta: bicuadradas planteadas desde un enunciado verbal.
 *   bicuadrada/precio    acertijo de precio que lleva a p⁴ − Mp² + K = 0: diferencia entre el precio mayor y el
 *                        menor (las raíces negativas no son precios). Falta: bicuadradas desde un enunciado verbal.
 *   bicuadrada/imaginarias   x⁴ + (m² + n²)x² + m²n² = 0, sin raíces reales: suma de los módulos de las cuatro raíces.
 *                        Falta: raíces complejas de bicuadradas y su módulo.
 *   igualar              dos tanques con volumen polinomial en el tiempo (cúbico y cuadrático) que parten iguales:
 *                        cuándo vuelven a coincidir. Falta: igualar dos modelos polinomiales y resolver la cúbica.
 *   parametro/mayor      cúbica x³ − Sx² + kx − R = 0 cuyas raíces son las medidas de un contenedor; una medida
 *                        dada fija k; la mayor medida. Falta: usar una raíz conocida para hallar un parámetro y
 *                        factorizar.
 *   parametro/valor      P(x) = x³ + bx² + kx + d con una raíz dada que fija k: conjunto solución de P(x) = d.
 *                        Falta: factorizar una cúbica y resolver P(x) igual a un valor.
 *   multiple             x⁴ + Ax³ + Bx² + Cx + m con una raíz triple entera: m por comparación de coeficientes.
 *                        Falta: raíces múltiples y comparación de coeficientes.
 *   conjugada/compleja   x³ + mx² + nx + p = 0 (m, n enteros) con la raíz a + bi: la raíz real (el conjugado a − bi
 *                        también es raíz). Falta: teorema de paridad de raíces complejas.
 *   conjugada/irracional x³ + mx² + nx + p = 0 (m, n enteros) con la raíz a + √b: la raíz racional (a − √b también es
 *                        raíz). Falta: paridad de raíces (versión irracional).
 *   divisores            P(x) = (qx − p)(x − r)(x − s) desarrollado, con q = 2 o 3: la raíz no entera.
 *                        Falta: divisores binómicos y raíces racionales para factorizar cúbicas.
 *
 * Convenciones: las respuestas son números racionales exactos («−7/2», «73», «12 cm²») o conjuntos («{−3; 0; 2}»),
 * con clave canónica (num:n/d o set:…). Complejos como en plantillas/numeros-complejos («2 + i», «−1 + 3i»).
 * Errores: AL8, AL9, AL11, AL15 (docs/investigacion/algebra-funciones-ideas-erroneas.md), CX1, CX11, CX12
 * (docs/investigacion/matematica-avanzada-ideas-erroneas.md; hipótesis) y errores nuevos con nombre (hipótesis),
 * entre ellos los de la trampa 46 (raíces negativas o no reales sin mirar el contexto).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'ecuaciones-polinomiales';
  const FA = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const FM = 'docs/investigacion/matematica-avanzada-ideas-erroneas.md';
  const v = P.v;
  const COMBOS = [
    ['vieta', 'cuadrados'], ['vieta', 'cubos'], ['vieta', 'tercera'], ['vieta', 'progresion'],
    ['caja', 'dimensiones'], ['caja', 'recorte'],
    ['bicuadrada', 'consecutivos'], ['bicuadrada', 'precio'], ['bicuadrada', 'imaginarias'],
    ['igualar', null], ['parametro', 'mayor'], ['parametro', 'valor'], ['multiple', null],
    ['conjugada', 'compleja'], ['conjugada', 'irracional'], ['divisores', null],
  ];

  // ---------- textos ----------
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).split('').map(d => SUP[+d]).join('');
  const n2 = x => P.formatear(x, 0);                      // entero con «−»
  const par = x => (x < 0 ? `(${n2(x)})` : n2(x));        // entre paréntesis si es negativo
  // Expresión con términos [coef, exp]; coef es un número o una letra (parámetro, que va con «+»).
  function expr(terminos, letra = 'x') {
    let t = '';
    for (const [c, e] of terminos) {
      if (c === 0) continue;
      const neg = typeof c === 'number' && c < 0;
      const abs = typeof c === 'number' ? Math.abs(c) : c;
      const coef = e === 0 ? String(abs) : (abs === 1 ? '' : String(abs));
      const cuerpo = coef + (e === 0 ? '' : letra + (e === 1 ? '' : sup(e)));
      t += t === '' ? (neg ? '−' : '') + cuerpo : (neg ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }
  const poli = (coefs, letra = 'x') => expr(coefs.map((c, i) => [c, coefs.length - 1 - i]), letra);
  // Factor (x − r): «x − 3», «x + 2», «x».
  const factor = (r, letra = 'x') => (r === 0 ? letra : `${letra} ${r < 0 ? '+' : '−'} ${Math.abs(r)}`);
  const complejo = (a, b) => (a === 0 ? '' : n2(a) + (b < 0 ? ' − ' : ' + ')) + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'i';

  // ---------- respuestas ----------
  function num(n, d = 1, unidad = '') {
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) return null;
    const f = P.frac(n, d);
    const u = unidad === 'soles' && f.n === 1 && f.d === 1 ? 'sol' : unidad;   // «1 sol», «3 soles»
    return { clave: `num:${f.n}/${f.d}`, texto: P.textoFraccion(f) + (u ? ' ' + u : '') };
  }
  function conjunto(lista) {
    const l = [...new Set(lista)].sort((a, b) => a - b);
    return { clave: 'set:' + l.join(','), texto: '{' + l.map(n2).join('; ') + '}' };
  }
  const err = (id, r, explicacion, respaldo = 'hipotesis', fuente = null) =>
    (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente } : null);
  const fr = (n, d = 1) => P.textoFraccion(P.frac(n, d));

  // ---------- armado ----------
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const [tipo, sub] = rng.elegir(COMBOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    const f = { vieta: { cuadrados, cubos, tercera, progresion }, caja: { dimensiones, recorte },
      bicuadrada: { consecutivos, precio, imaginarias }, parametro: { mayor, valor }, conjugada: { compleja, irracional } };
    const o = tipo === 'igualar' ? igualar(rng) : tipo === 'multiple' ? multiple(rng) : tipo === 'divisores' ? divisores(rng) : f[tipo][sub](rng);
    if (!o || !o.correcta) return null;
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: o.unidad || '' },
      _datos: { tipo, ...(sub ? { sub } : {}), ...o.datos },
    };
  }

  const RAICES = { E: { nombre: 'la ecuación', color: 'o' }, S: { nombre: 'suma de las raíces', color: 'i' }, Q: { nombre: 'suma de productos de dos en dos', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
  const noCero = (rng, a, b) => { let x; do x = rng.entero(a, b); while (x === 0); return x; };

  // ---- vieta/cuadrados ----
  function cuadrados(rng) {
    const a = rng.elegir([1, 1, 2, 3]), b = noCero(rng, -9, 9), c = noCero(rng, -9, 9), d = noCero(rng, -9, 9);
    const E = poli([a, b, c, d]) + ' = 0';
    const correcta = num(b * b - 2 * a * c, a * a);
    const S = fr(-b, a), Q = fr(c, a);
    const errores = [
      err('AL8', num(b * b, a * a), 'Elevaste la suma de las raíces al cuadrado y te quedaste ahí. (x₁ + x₂ + x₃)² no es x₁² + x₂² + x₃²: también trae los dobles productos 2(x₁x₂ + x₁x₃ + x₂x₃), y hay que restarlos.', 'parcial', FA),
      err('identidad-cuadrados-signo', num(b * b + 2 * a * c, a * a), 'Sumaste los dobles productos en vez de restarlos. De (x₁ + x₂ + x₃)² = x₁² + x₂² + x₃² + 2(x₁x₂ + x₁x₃ + x₂x₃) se despeja: x₁² + x₂² + x₃² = (suma)² − 2·(suma de productos).'),
      a !== 1 ? err('olvida-coef-principal', num(b * b - 2 * c), `Usaste los coeficientes sin dividir entre el principal, ${a}. Las relaciones de Cardano-Vieta valen para la ecuación dividida entre ${a}: la suma es −b/a y la suma de productos es c/a.`) : null,
      err('identidad-cuadrados-sin-2', num(b * b - a * c, a * a), 'Restaste la suma de productos una sola vez. En el cuadrado de la suma, cada producto x₁x₂ aparece dos veces: x₁² + x₂² + x₃² = (suma)² − 2·(suma de productos).'),
    ];
    return {
      correcta, errores, variables: RAICES,
      enunciado: ['Sean x₁, x₂ y x₃ las raíces de la ecuación ', v('E', E), '.'],
      pregunta: ['¿Cuánto vale ', v('X', 'x₁² + x₂² + x₃²'), '?'],
      solucion: [
        [`Por Cardano-Vieta (en ax³ + bx² + cx + d = 0, con a = ${a}, b = ${n2(b)}, c = ${n2(c)}): `, v('S', `x₁ + x₂ + x₃ = −b/a = ${S}`), ' y ', v('Q', `x₁x₂ + x₁x₃ + x₂x₃ = c/a = ${Q}`), '.'],
        ['Al elevar la suma al cuadrado aparecen los dobles productos: (x₁ + x₂ + x₃)² = x₁² + x₂² + x₃² + 2(x₁x₂ + x₁x₃ + x₂x₃).'],
        ['Despejando: ', v('X', 'x₁² + x₂² + x₃²'), ` = (${S})² − 2·(${Q}) = ${fr(b * b, a * a)} − ${par2(fr(2 * c, a), 2 * c * a)} = `, v('X', correcta.texto), '.'],
      ],
      datos: { a, b, c, d },
    };
  }
  // «− (−3/2)» queda feo: la resta de un negativo se escribe entre paréntesis.
  function par2(texto, signo) { return signo < 0 ? `(${texto})` : texto; }

  // ---- vieta/cubos: una raíz el doble de otra ----
  function cubos(rng) {
    const r = noCero(rng, -3, 3), s = noCero(rng, -6, 6);
    if (s === r || s === 2 * r) return null;
    const S = 3 * r + s, Q = 2 * r * r + 3 * r * s, R = 2 * r * r * s;
    // Unicidad: todas las ternas enteras (t, 2t, S − 3t) con la misma suma de productos dan las mismas raíces.
    const ternas = new Set();
    for (let t = -40; t <= 40; t++) { const u = S - 3 * t; if (2 * t * t + 3 * t * u === Q) ternas.add([t, 2 * t, u].sort((x, y) => x - y).join(',')); }
    if (ternas.size !== 1) return null;
    const sumaCubos = 9 * r ** 3 + s ** 3;
    if (sumaCubos !== S ** 3 - 3 * S * Q + 3 * R) throw new Error('identidad de cubos');
    const E = expr([[1, 3], [-S, 2], [Q, 1], ['k', 0]]) + ' = 0';
    const correcta = num(sumaCubos);
    const otra = P.frac(3 * S - 7 * r, 7);
    const otraEntera = otra.d === 1;
    const raices = [r, 2 * r, s].sort((x, y) => x - y);
    const errores = [
      err('AL11', num(S ** 3), 'Elevaste al cubo la suma de las raíces. (x₁ + x₂ + x₃)³ no es x₁³ + x₂³ + x₃³: el cubo de una suma trae además los productos cruzados.', 'hipotesis', FA),
      err('identidad-cubos-sin-producto', num(S ** 3 - 3 * S * Q), 'Usaste x₁³ + x₂³ + x₃³ = S³ − 3SQ (S, la suma; Q, la suma de productos), pero a esa identidad le falta + 3x₁x₂x₃: el producto de las raíces también entra. Por eso hacía falta hallar las raíces (o k).'),
      err('identidad-cubos-signo', num(S ** 3 - 3 * S * Q - 3 * R), 'Usaste la identidad con −3x₁x₂x₃. Es x₁³ + x₂³ + x₃³ = S³ − 3SQ + 3x₁x₂x₃ (S, la suma; Q, la suma de productos): compruébalo con las raíces que hallaste.'),
      err('suma-cuadrados-por-cubos', num(S * S - 2 * Q), 'Esa es la suma de los cuadrados de las raíces, (suma)² − 2·(suma de productos). Se pedía la suma de los cubos.'),
    ];
    const cubo = x => `${par(x)}³`;
    return {
      correcta, errores, variables: RAICES,
      enunciado: ['La ecuación ', v('E', E), ' tiene tres raíces enteras, y una de ellas es el doble de otra.'],
      pregunta: ['¿Cuánto vale la ', v('X', 'suma de los cubos de las tres raíces'), '?'],
      solucion: [
        ['Llama r, 2r y s a las raíces. Por Cardano-Vieta: ', v('S', `r + 2r + s = ${n2(S)}`), ' y ', v('Q', `r·2r + r·s + 2r·s = ${n2(Q)}`), ', es decir, 3r + s = ', v('S', n2(S)), ' y 2r² + 3rs = ', v('Q', n2(Q)), '.'],
        [`De la primera, s = ${n2(S)} − 3r. Al reemplazar en la segunda: 2r² + 3r(${n2(S)} − 3r) = ${n2(Q)}, o sea ${expr([[7, 2], [-3 * S, 1], [Q, 0]], 'r')} = 0.`],
        [`Su solución entera es r = ${n2(r)}` + (otraEntera ? ` (la otra, r = ${n2(otra.n)}, da las mismas raíces)` : ` (la otra, r = ${P.textoFraccion(otra)}, no es entera)`) + `; entonces s = ${n2(s)} y las raíces son ${raices.map(n2).join('; ')}.`],
        ['Suma de cubos: ', `${raices.map(cubo).join(' + ')} = ${raices.map(x => par(x ** 3)).join(' + ')} = `, v('X', correcta.texto), '.'],
      ],
      datos: { S, Q },
    };
  }

  // ---- vieta/tercera: dos raíces conocidas y el coeficiente de x ----
  function tercera(rng) {
    const a = rng.elegir([1, 1, 2, 3]);
    const r1 = noCero(rng, -5, 5), r2 = noCero(rng, -5, 5), r3 = noCero(rng, -6, 6);
    if (r1 >= r2 || r1 + r2 === 0 || r3 === r1 || r3 === r2) return null;
    const c = a * (r1 * r2 + r1 * r3 + r2 * r3);
    if (c === 0) return null;
    const E = expr([[a, 3], ['m', 2], [c, 1], ['n', 0]]) + ' = 0';
    const s12 = r1 + r2, p12 = r1 * r2;
    const correcta = num(c - a * p12, a * s12);
    const errores = [
      err('vieta-signo-suma-productos', num(-c - a * p12, a * s12), `Tomaste la suma de productos de dos en dos como −c/a. En ax³ + bx² + cx + d = 0 los signos van alternados: suma −b/a, suma de productos +c/a, producto −d/a.`),
      a !== 1 ? err('olvida-coef-principal', num(c - p12, s12), `Usaste ${n2(c)} como suma de productos sin dividir entre el coeficiente principal ${a}: la suma de productos es c/a = ${fr(c, a)}.`) : null,
      err('olvida-producto-conocido', num(c, a * s12), `En la suma de productos faltó el término x₁x₂ = ${n2(p12)}: son tres productos, x₁x₂ + x₁x₃ + x₂x₃, y el primero ya se conoce.`),
      err('suma-productos-como-producto', num(c, a * p12), 'Usaste c/a como si fuera el producto de las tres raíces. El producto de las raíces sale del término independiente (−d/a), que aquí es la letra n.'),
      err('suma-productos-como-suma', num(c - a * s12, a), 'Usaste c/a como si fuera la suma de las raíces. La suma sale del coeficiente de x² (−b/a), que aquí es la letra m.'),
    ];
    return {
      correcta, errores, variables: RAICES,
      enunciado: ['La ecuación ', v('E', E), `, donde m y n son constantes, tiene entre sus raíces a ${n2(r1)} y a ${n2(r2)}.`],
      pregunta: ['¿Cuál es la ', v('X', 'tercera raíz'), '?'],
      solucion: [
        ['Las letras m y n no dejan usar la suma ni el producto, pero el coeficiente de x sí se conoce. Por Cardano-Vieta: ', v('Q', `x₁x₂ + x₁x₃ + x₂x₃ = c/a = ${fr(c, a)}`), '.'],
        [`Con x₁ = ${n2(r1)} y x₂ = ${n2(r2)}: ${par(r1)}·${par(r2)} + (${n2(r1)} + ${par(r2)})·x₃ = ${fr(c, a)}, o sea ${n2(p12)} + ${par(s12)}·x₃ = ${fr(c, a)}.`],
        ['Despejando: ', v('X', `x₃ = (${fr(c, a)} − ${par(p12)})/${par(s12)} = ${correcta.texto}`), '.'],
      ],
      datos: { a, c, r1, r2 },
    };
  }

  // ---- vieta/progresion: raíces en progresión aritmética ----
  function progresion(rng) {
    const a = noCero(rng, -4, 5), d = rng.entero(1, 4);
    if (Math.abs(a) === d) return null;
    const S = 3 * a, R = a * (a * a - d * d), k = 3 * a * a - d * d;
    const E = expr([[1, 3], [-S, 2], ['k', 1], [-R, 0]]) + ' = 0';
    const correcta = num(k);
    const raices = [a - d, a, a + d];
    const errores = [
      err('vieta-signo-producto', num(2 * a * a - R / a), `Tomaste el producto de las raíces con el signo cambiado (${n2(-R)}). En x³ + bx² + cx + d = 0 el producto es −d: aquí, ${n2(R)}. Si las raíces fueran las tuyas, no darían ese producto.`),
      err('progresion-raices-iguales', num(3 * a * a), `Tomaste las tres raíces iguales a la del medio (${n2(a)}). Están en progresión, pero con una razón d ≠ 0 que sale del producto.`),
      err('vieta-signo-suma-productos', num(-k), 'El coeficiente de x es la suma de productos de dos en dos con su signo: en x³ + bx² + cx + d = 0, x₁x₂ + x₁x₃ + x₂x₃ = +c. No se le cambia el signo.'),
      d !== 1 ? err('progresion-razon-uno', num(3 * a * a - 1), 'Supusiste que las raíces son enteros consecutivos (razón 1). La razón no se adivina: sale del producto de las raíces.') : null,
    ];
    return {
      correcta, errores, variables: RAICES,
      enunciado: ['Las tres raíces de la ecuación ', v('E', E), ' están en progresión aritmética.'],
      pregunta: ['¿Cuánto vale ', v('X', 'k'), '?'],
      solucion: [
        ['Llama a − d, a y a + d a las raíces. Su ', v('S', `suma es 3a = ${n2(S)}`), `, así que a = ${n2(a)}.`],
        [`El producto (a − d)·a·(a + d) = a(a² − d²) es ${n2(R)}: ${par(a)}·(${n2(a * a)} − d²) = ${n2(R)}, de donde d² = ${n2(d * d)} y las raíces son ${raices.map(n2).join('; ')}.`],
        [v('Q', 'Suma de productos de dos en dos'), `: ${par(raices[0])}·${par(raices[1])} + ${par(raices[0])}·${par(raices[2])} + ${par(raices[1])}·${par(raices[2])} = `, v('X', `k = ${correcta.texto}`), '.'],
      ],
      datos: { S, R },
    };
  }

  // ---- caja/dimensiones ----
  function dimensiones(rng) {
    const x = rng.entero(2, 6), al = rng.entero(1, 4), be = rng.entero(al + 1, 7);
    const V = x * (x + al) * (x + be);
    const variables = { x: { nombre: 'el alto', color: 'o' }, V: { nombre: 'volumen', color: 'i' }, X: { nombre: 'la arista mayor', color: 'd' } };
    const correcta = num(x + be, 1, 'cm');
    const coef = [1, al + be, al * be, -V];
    // Raíz negativa entera (si la hay): la trampa de aceptarla sin mirar el contexto.
    let neg = null;
    for (let t = -30; t < 0; t++) if (((t + al + be) * t + al * be) * t - V === 0) neg = t;
    const errores = [
      err('responde-la-incognita', num(x, 1, 'cm'), `Ese es x = ${x}, el alto. Se pedía la arista mayor, el largo x + ${be}.`),
      err('arista-equivocada', num(x + al, 1, 'cm'), `Esa es x + ${al}, el ancho. La arista mayor es el largo, x + ${be}.`),
      err('suma-de-aristas', num(3 * x + al + be, 1, 'cm'), 'Sumaste las tres aristas. Se pedía solo la mayor.'),
      neg !== null && neg + be > 0 ? err('raiz-negativa-sin-contexto', num(neg + be, 1, 'cm'), `Usaste la raíz x = ${n2(neg)}: cumple la ecuación, pero un alto negativo no existe.`) : null,
    ];
    return {
      correcta, errores, variables, unidad: 'cm',
      enunciado: ['Una caja de cartón tiene forma de paralelepípedo: su ', v('x', 'alto es x cm'), `, su ancho es (x + ${al}) cm y su largo es (x + ${be}) cm. Su `, v('V', `volumen es ${n2(V)} cm³`), '.'],
      pregunta: ['¿Cuánto mide la ', v('X', 'arista mayor'), ' de la caja?'],
      solucion: [
        [v('V', `x(x + ${al})(x + ${be}) = ${n2(V)}`), `, o sea ${poli(coef)} = 0.`],
        [`Se prueba con los divisores de ${n2(V)}: `, v('x', `x = ${x}`), ` da ${x}·${x + al}·${x + be} = ${n2(V)}. Por Ruffini queda ${poli([1, al + be + x, al * be + x * (al + be + x)])}, que no tiene raíces positivas; además, para x > 0 el volumen crece con x, así que x = ${x} es la única medida posible.`],
        ['La arista mayor es el largo: ', v('X', `x + ${be} = ${correcta.texto}`), '.'],
      ],
      datos: { al, be, V },
    };
  }

  // ---- caja/recorte: caja sin tapa ----
  function recorte(rng) {
    const W = rng.entero(10, 24), L = rng.entero(W, 30), x = rng.entero(1, Math.floor((W - 1) / 2));
    const vol = t => t * (L - 2 * t) * (W - 2 * t);
    const V = vol(x);
    const sol = []; for (let t = 1; 2 * t < W; t++) if (vol(t) === V) sol.push(t);
    if (sol.length !== 1 || x < 2) return null;
    const base = (L - 2 * x) * (W - 2 * x), lat = 2 * x * (L - 2 * x) + 2 * x * (W - 2 * x);
    const area = L * W - 4 * x * x;
    if (base + lat !== area) throw new Error('área de la caja');
    const variables = { x: { nombre: 'lado del recorte', color: 'o' }, V: { nombre: 'volumen', color: 'i' }, B: { nombre: 'fondo', color: 'h' }, X: { nombre: 'cartón de la caja', color: 'd' } };
    const u = 'cm²';
    const correcta = num(area, 1, u);
    const errores = [
      err('sin-restar-recortes', num(L * W, 1, u), 'Ese es el área de la lámina entera. Los cuatro cuadrados recortados ya no son parte de la caja: hay que restarlos.'),
      err('resta-un-recorte', num(L * W - x * x, 1, u), `Restaste un solo cuadrado. Se recorta uno en cada esquina: son cuatro de ${x * x} cm².`),
      err('caja-con-tapa', num(area + base, 1, u), 'Le sumaste una tapa igual al fondo. La caja no tiene tapa.'),
      err('solo-fondo', num(base, 1, u), 'Ese es solo el fondo. La caja también tiene sus cuatro caras laterales.'),
    ];
    return {
      correcta, errores, variables, unidad: u,
      enunciado: [`De una lámina rectangular de cartón de ${L} cm por ${W} cm se recorta un cuadrado de `, v('x', 'x cm de lado'), ' en cada esquina, y se doblan las pestañas para formar una caja sin tapa de ', v('V', `${n2(V)} cm³`), '. El lado x es un número entero de centímetros.'],
      pregunta: ['¿Cuántos cm² de ', v('X', 'cartón tiene la caja'), '?'],
      solucion: [
        ['El ', v('B', `fondo mide (${L} − 2x) por (${W} − 2x)`), ' y el alto es x: ', v('V', `x(${L} − 2x)(${W} − 2x) = ${n2(V)}`), '.'],
        [`Se prueba con enteros menores que ${W}/2: `, v('x', `x = ${x}`), ` da ${x}·${L - 2 * x}·${W - 2 * x} = ${n2(V)}, y ningún otro entero lo cumple.`],
        ['El cartón de la caja es la lámina menos los cuatro cuadrados: ', `${L}·${W} − 4·${x}² = ${L * W} − ${4 * x * x} = `, v('X', correcta.texto), '.'],
        ['Comprobación: ', v('B', `fondo ${L - 2 * x}·${W - 2 * x} = ${base}`), ` más cuatro caras laterales (${2 * x * (L - 2 * x)} + ${2 * x * (W - 2 * x)} = ${lat}) dan ${area}.`],
      ],
      datos: { L, W, V },
    };
  }

  // ---- bicuadrada/consecutivos ----
  function consecutivos(rng) {
    const n = rng.entero(2, 6), K = (n - 1) ** 4 + (n + 1) ** 4, M = (K - 2) / 2;
    const clase = n % 2 === 0 ? 'impares' : 'pares';
    const variables = { n: { nombre: 'número del medio', color: 'o' }, K: { nombre: 'suma de las cuartas potencias', color: 'i' }, X: { nombre: 'el mayor', color: 'd' } };
    const correcta = num(n + 1);
    const errores = [
      err('responde-el-menor', num(n - 1), `Ese es el menor de los dos (${n - 1}). Se pedía el mayor.`),
      err('responde-la-auxiliar', num(n), `Ese es n = ${n}, el número que está entre los dos. Los números son n − 1 y n + 1.`),
      err('bicuadrada-sin-raiz', num(n * n + 1), `Tomaste u = n² = ${n * n} como si fuera n. Al resolver en u falta sacar la raíz: n = √${n * n} = ${n}.`),
    ];
    return {
      correcta, errores, variables,
      enunciado: [`La suma de las cuartas potencias de dos números ${clase} positivos consecutivos es `, v('K', n2(K)), '.'],
      pregunta: ['¿Cuál es el ', v('X', 'mayor'), ' de los dos números?'],
      solucion: [
        [`Llama n − 1 y n + 1 a los números (`, v('n', 'n'), ` es el ${clase === 'impares' ? 'par' : 'impar'} que está entre ellos). Al desarrollar, los términos impares se cancelan: (n − 1)⁴ + (n + 1)⁴ = 2n⁴ + 12n² + 2.`],
        [v('K', `2n⁴ + 12n² + 2 = ${n2(K)}`), ` → n⁴ + 6n² − ${n2(M)} = 0, una bicuadrada.`],
        [`Con u = n²: u² + 6u − ${n2(M)} = 0 → (u − ${n * n})(u + ${n * n + 6}) = 0. La raíz negativa no sirve (n² no es negativo): n² = ${n * n} y `, v('n', `n = ${n}`), '.'],
        [`Los números son ${n - 1} y ${n + 1}; el `, v('X', `mayor es ${n + 1}`), '.'],
      ],
      datos: { K },
    };
  }

  // ---- bicuadrada/precio ----
  function precio(rng) {
    const b = rng.entero(1, 6), a = rng.entero(b + 1, 9);
    const K = a * a * b * b, M = a * a + b * b;
    const producto = rng.elegir([['el kilo de palta', 'kilo de palta'], ['el kilo de queso', 'kilo de queso'], ['la docena de panes', 'docena de panes'], ['el kilo de quinua', 'kilo de quinua']]);
    const variables = { p: { nombre: 'precio', color: 'o' }, M: { nombre: 'lo que se obtiene', color: 'i' }, X: { nombre: 'diferencia de precios', color: 'd' } };
    const u = 'soles';
    const correcta = num(a - b, 1, u);
    const raizDif = Math.sqrt(a * a - b * b);
    const errores = [
      err('bicuadrada-sin-raiz', num(a * a - b * b, 1, u), `Restaste las soluciones en u = p² (${a * a} y ${b * b}). Esos son los cuadrados de los precios: falta sacar la raíz.`),
      err('raiz-negativa-sin-contexto', num(2 * a, 1, u), `Tomaste como precio menor la raíz −${a}. Cumple la ecuación, pero un precio negativo no tiene sentido: los precios posibles son ${b} y ${a} soles.`),
      err('raiz-negativa-de-la-otra', num(a + b, 1, u), `Restaste la raíz −${b}: ${a} − (−${b}). Un precio negativo no tiene sentido; el menor de los precios posibles es ${b} soles.`),
      Number.isInteger(raizDif) ? err('AL9', num(raizDif, 1, u), `Sacaste la raíz de la diferencia: √(${a * a} − ${b * b}). La raíz no se reparte sobre la resta: √${a * a} − √${b * b} = ${a} − ${b}.`, 'parcial', FA) : null,
    ];
    return {
      correcta, errores, variables, unidad: u,
      enunciado: [`Rosa pregunta en el mercado cuánto cuesta ${producto[0]}. La vendedora responde con un acertijo: «Si elevas al cuadrado el `, v('p', 'precio en soles'), ` y le sumas ${n2(K)} dividido entre ese cuadrado, `, v('M', `obtienes ${M}`), '». Hay dos precios que cumplen el acertijo.'],
      pregunta: ['¿Cuál es la ', v('X', 'diferencia entre el precio mayor y el menor'), ' que cumplen el acertijo?'],
      solucion: [
        [v('M', `p² + ${n2(K)}/p² = ${M}`), ` → p⁴ − ${M}p² + ${n2(K)} = 0, una bicuadrada.`],
        [`Con u = p²: u² − ${M}u + ${n2(K)} = 0 → (u − ${b * b})(u − ${a * a}) = 0 → p² = ${b * b} o p² = ${a * a}.`],
        [`Las raíces son ±${b} y ±${a}, pero un precio no puede ser negativo: los `, v('p', `precios posibles son ${b} y ${a} soles`), '.'],
        ['La diferencia es ', v('X', `${a} − ${b} = ${correcta.texto}`), '.'],
      ],
      datos: { K, M },
    };
  }

  // ---- bicuadrada/imaginarias ----
  function imaginarias(rng) {
    const m = rng.entero(1, 5), n = rng.entero(m + 1, 6);
    const B = m * m + n * n, C = m * m * n * n;
    const E = poli([1, 0, B, 0, C]) + ' = 0';
    const variables = { E: { nombre: 'la ecuación', color: 'o' }, u: { nombre: 'valores de x²', color: 'i' }, X: { nombre: 'suma de módulos', color: 'd' } };
    const correcta = num(2 * (m + n));
    const im = k => (k === 1 ? 'i' : `${k}i`);
    const errores = [
      err('raiz-no-real-descartada', num(0), 'Como no hay raíces reales, concluiste que no hay raíces (o que la suma es 0). Una ecuación de grado 4 tiene cuatro raíces; aquí las cuatro son imaginarias, y sus módulos son positivos.'),
      err('una-de-cada-conjugada', num(m + n), `Contaste una raíz de cada pareja. x² = −${m * m} da dos raíces, ${im(m)} y −${im(m)}, y las dos tienen módulo ${m}.`),
      err('CX11', num(2 * B), `Tomaste el módulo como el cuadrado (${m * m} y ${n * n}). Los valores de u = x² son −${m * m} y −${n * n}; el módulo de ${im(m)} es ${m}, no ${m * m}.`, 'hipotesis', FM),
    ];
    return {
      correcta, errores, variables,
      enunciado: ['Considera la ecuación ', v('E', E), '.'],
      pregunta: ['¿Cuánto vale la ', v('X', 'suma de los módulos de sus cuatro raíces'), '?'],
      solucion: [
        [`Con u = x²: u² + ${B}u + ${C} = 0 → (u + ${m * m})(u + ${n * n}) = 0 → `, v('u', `x² = −${m * m} o x² = −${n * n}`), '.'],
        [`No hay raíces reales, pero sí cuatro imaginarias: x = ±${im(m)} y x = ±${im(n)}.`],
        [`|±${im(m)}| = ${m} y |±${im(n)}| = ${n}. La suma es ${m} + ${m} + ${n} + ${n} = `, v('X', correcta.texto), '.'],
      ],
      datos: { B, C },
    };
  }

  // ---- igualar: dos tanques ----
  function igualar(rng) {
    const r = rng.entero(2, 6), s = rng.entero(2, 6), V0 = rng.entero(4, 12) * 10, de = rng.entero(2, 9), ga = rng.entero(0, 2);
    if (s === r) return null;
    const A = [1, ga + s - r, de - r * s, V0], B = [ga, de, V0];
    const VA = t => ((t + A[1]) * t + A[2]) * t + V0, VB = t => (ga * t + de) * t + V0;
    for (let t = 0; t <= r + 2; t += 0.25) if (VA(t) <= 5 || VB(t) <= 5) return null;
    const variables = { A: { nombre: 'tanque A', color: 'o' }, B: { nombre: 'tanque B', color: 'i' }, X: { nombre: 'el instante pedido', color: 'd' } };
    const u = 'h';
    const correcta = num(r, 1, u);
    const errores = [
      err('tiempo-inicial', num(0, 1, u), 't = 0 es el inicio: ahí los dos tanques ya tienen el mismo volumen. Se pide cuándo vuelven a coincidir, después de empezar.'),
      err('raiz-negativa-sin-contexto', num(s, 1, u), `La ecuación también tiene la raíz t = −${s}, que es un tiempo antes de empezar y no sirve. Cambiarle el signo no la vuelve solución: a las ${s} h los volúmenes son distintos.`),
      err('termino-independiente-como-raiz', num(r * s, 1, u), `Tomaste el término independiente de ${poli([1, s - r, -r * s], 't')} como si fuera la raíz. Hay que factorizar: (t − ${r})(t + ${s}).`),
    ];
    const D = [1, A[1] - ga, A[2] - de, 0];
    return {
      correcta, errores, variables, unidad: u,
      enunciado: ['Dos tanques de agua empiezan con el mismo volumen. A las t horas de empezar, el volumen (en m³) del ', v('A', `tanque A es ${poli(A, 't')}`), ' y el del ', v('B', `tanque B es ${poli(B, 't')}`), '.'],
      pregunta: ['¿Al cabo de cuántas horas ', v('X', 'vuelven a tener el mismo volumen'), '?'],
      solucion: [
        ['Se igualan los dos modelos: ', v('A', poli(A, 't')), ' = ', v('B', poli(B, 't')), ` → ${poli(D, 't')} = 0.`],
        [`Se saca t de factor común: t(${poli([1, s - r, -r * s], 't')}) = 0 → t(${factor(r, 't')})(${factor(-s, 't')}) = 0.`],
        [`t = 0 es el inicio y t = −${s} es antes de empezar. Vuelven a coincidir a las `, v('X', correcta.texto), '.'],
      ],
      datos: { A, B },
    };
  }

  // ---- parametro/mayor ----
  function mayor(rng) {
    const r = rng.entero(1, 6), s = rng.entero(1, 9), t = rng.entero(1, 9);
    if (s >= t || r === s || r === t || r > t) return null;
    const S = r + s + t, Q = r * s + r * t + s * t, R = r * s * t;
    const E = expr([[1, 3], [-S, 2], ['k', 1], [-R, 0]]) + ' = 0';
    const variables = { E: { nombre: 'la ecuación', color: 'o' }, r: { nombre: 'la medida conocida', color: 'i' }, k: { nombre: 'el parámetro k', color: 'h' }, X: { nombre: 'el largo', color: 'd' } };
    const u = 'm';
    const correcta = num(t, 1, u);
    const errores = [
      err('otra-raiz', num(s, 1, u), `Esa es la otra medida que faltaba (${s} m), el ancho. El largo es la mayor de las tres.`),
      err('suma-de-las-que-faltan', num(s + t, 1, u), `Sumaste las dos medidas que faltaban (${s} + ${t}). Cada raíz es una medida: el largo es la mayor.`),
      err('parametro-por-medida', num(Q, 1, u), `Ese es k = ${Q}, el parámetro. Con k se arma la ecuación; las medidas son sus raíces.`),
    ];
    const coc = [1, r - S, Q - r * (S - r)];   // cociente de Ruffini entre x − r
    return {
      correcta, errores, variables, unidad: u,
      enunciado: ['Las tres raíces de la ecuación ', v('E', E), ' son el largo, el ancho y el alto, en metros, de un contenedor. El ', v('r', `alto mide ${r} m`), ' y el largo es la mayor de las tres medidas.'],
      pregunta: ['¿Cuánto mide el ', v('X', 'largo'), '?'],
      solucion: [
        [v('r', `x = ${r}`), ` es raíz: ${r}³ − ${S}·${r}² + k·${r} − ${R} = 0 → ${n2(r ** 3 - S * r * r - R)} + ${r}k = 0 → `, v('k', `k = ${Q}`), '.'],
        [`Ruffini con ${r}: ${poli([1, -S, Q, -R])} = (${factor(r)})(${poli(coc)}).`],
        [`${poli(coc)} = (${factor(s)})(${factor(t)}): las otras medidas son ${s} m y ${t} m. El largo es `, v('X', correcta.texto), '.'],
      ],
      datos: { S, R, r },
    };
  }

  // ---- parametro/valor: P(x) = d ----
  function valor(rng) {
    const p = noCero(rng, -6, 6), q = noCero(rng, -6, 6), r = noCero(rng, -4, 4);
    if (p >= q || r === p || r === q) return null;
    const b = -(p + q), k = p * q, d = -r * (r - p) * (r - q);
    if (d === 0 || Math.abs(d) > 150) return null;
    const variables = { P: { nombre: 'el polinomio', color: 'o' }, r: { nombre: 'la raíz dada', color: 'i' }, k: { nombre: 'el parámetro k', color: 'h' }, X: { nombre: 'conjunto solución', color: 'd' } };
    const Ptxt = expr([[1, 3], [b, 2], ['k', 1], [d, 0]]);
    const correcta = conjunto([0, p, q]);
    // k con el signo cambiado: x² + bx − k; solo si sus raíces son enteras.
    const disc = b * b + 4 * k, rd = Math.round(Math.sqrt(Math.max(disc, 0)));
    const kMal = disc >= 0 && rd * rd === disc && (b + rd) % 2 === 0 && -k !== k ? conjunto([0, (-b - rd) / 2, (-b + rd) / 2]) : null;
    const errores = [
      err('AL15', conjunto([p, q]), 'Dividiste entre x y perdiste la solución x = 0. En x(x² + bx + k) = 0 cada factor da soluciones: x = 0 también cumple P(0) = ' + n2(d) + '.', 'hipotesis', FA),
      err('raices-signo-cambiado', conjunto([0, -p, -q]), 'Cambiaste el signo de las raíces al leerlas de los factores: (x − a) = 0 da x = a, no x = −a.'),
      err('agrega-raiz-de-P', conjunto([0, p, q, r]), `Agregaste x = ${n2(r)}, que es raíz de P(x) = 0. Ahí P vale 0, no ${n2(d)}.`),
      kMal ? err('parametro-signo', kMal, 'Despejaste k con el signo cambiado. Revisa: al reemplazar la raíz dada, P debe dar 0.') : null,
    ];
    return {
      correcta, errores, variables,
      enunciado: ['El polinomio ', v('P', `P(x) = ${Ptxt}`), ' tiene como raíz a ', v('r', `x = ${n2(r)}`), '.'],
      pregunta: ['¿Cuál es el ', v('X', `conjunto de valores de x para los que P(x) = ${n2(d)}`), '?'],
      solucion: [
        [v('r', `P(${n2(r)}) = 0`), `: ${par(r)}³ + ${par(b)}·${par(r)}² + k·${par(r)} + ${par(d)} = 0 → `, v('k', `k = ${n2(k)}`), '.'],
        [`P(x) = ${n2(d)} → ${poli([1, b, k, 0])} = 0 → x(${poli([1, b, k])}) = 0 → x(${factor(p)})(${factor(q)}) = 0.`],
        ['Las soluciones son ', v('X', correcta.texto), '.'],
      ],
      datos: { b, d, r },
    };
  }

  // ---- multiple: raíz triple ----
  function multiple(rng) {
    const r = rng.elegir([-3, -2, -1, 1, 2, 3]), s = noCero(rng, -5, 5);
    if (s === r) return null;
    const A = -(3 * r + s), B = 3 * r * r + 3 * r * s, C = -(r ** 3 + 3 * r * r * s), D = r ** 3 * s;
    let cuantas = 0;
    for (let t = -40; t <= 40; t++) { const u = -A - 3 * t; if (3 * t * t + 3 * t * u === B && -(t ** 3 + 3 * t * t * u) === C) cuantas++; }
    if (cuantas !== 1) return null;
    const E = expr([[1, 4], [A, 3], [B, 2], [C, 1], ['m', 0]]);
    const variables = { E: { nombre: 'el polinomio', color: 'o' }, r: { nombre: 'la raíz triple', color: 'i' }, s: { nombre: 'la raíz simple', color: 'h' }, X: { nombre: 'm', color: 'd' } };
    const correcta = num(D);
    const errores = [
      err('vieta-signo-producto', num(-D), 'En grado 4 el producto de las raíces es +m (los signos alternan −, +, −, +): no lleva el signo menos de la cúbica.'),
      err('raiz-multiple-una-vez', num(r * s), `Contaste la raíz triple una sola vez. Es raíz tres veces: el producto es ${par(r)}³·${par(s)}.`),
      err('raices-todas-iguales', num(r ** 4), `Tomaste las cuatro raíces iguales a ${n2(r)}. La cuarta es otra: ${n2(s)}.`),
      err('olvida-raiz-simple', num(r ** 3), `Te olvidaste de la cuarta raíz, ${n2(s)}. Un polinomio de grado 4 tiene cuatro raíces.`),
    ];
    const B6 = [6, 3 * A, B];
    // La otra solución de 6r² + 3Ar + B = 0 (suma −A/2): si es entera, el coeficiente de x la descarta.
    const otra = P.frac(-A - 2 * r, 2);
    let otraTxt = '';
    if (otra.d === 1 && otra.n !== r) {
      const r2 = otra.n, s2 = -A - 3 * r2;
      otraTxt = ` La otra solución, r = ${n2(r2)}, daría s = ${n2(s2)} y un coeficiente de x igual a ${n2(-(r2 ** 3 + 3 * r2 * r2 * s2))}: no sirve.`;
    } else if (otra.n !== r || otra.d !== 1) otraTxt = ` La otra solución, r = ${P.textoFraccion(otra)}, no es entera.`;
    return {
      correcta, errores, variables,
      enunciado: ['El polinomio ', v('E', `P(x) = ${E}`), ' tiene una raíz triple, y esa raíz es un número entero.'],
      pregunta: ['¿Cuánto vale ', v('X', 'm'), '?'],
      solucion: [
        ['Si ', v('r', 'r'), ' es la raíz triple y ', v('s', 's'), ' la otra: P(x) = (x − r)³(x − s), con (x − r)³ = x³ − 3rx² + 3r²x − r³.'],
        [`Se comparan coeficientes. De x³: −3r − s = ${n2(A)}, o sea s = ${n2(-A)} − 3r. De x²: 3r² + 3rs = ${n2(B)}.`],
        [`Al reemplazar: 3r² + 3r(${n2(-A)} − 3r) = ${n2(B)} → ${poli(B6, 'r')} = 0. La raíz que sirve es `, v('r', `r = ${n2(r)}`), ', con ', v('s', `s = ${n2(s)}`), `: el coeficiente de x lo confirma, −r³ − 3r²s = ${n2(C)}.` + otraTxt],
        ['El término independiente es el producto de las cuatro raíces: ', v('X', `m = ${par(r)}³·${par(s)} = ${correcta.texto}`), '.'],
      ],
      datos: { A, B, C },
    };
  }

  // ---- conjugada/compleja ----
  function compleja(rng) {
    const a = noCero(rng, -3, 3), b = rng.entero(1, 3), c = noCero(rng, -5, 5);
    const N = a * a + b * b, p = -c * N;
    const z = complejo(a, b), zc = complejo(a, -b);
    const variables = { E: { nombre: 'la ecuación', color: 'o' }, z: { nombre: 'la raíz compleja', color: 'i' }, w: { nombre: 'su conjugada', color: 'h' }, X: { nombre: 'la raíz real', color: 'd' } };
    const E = expr([[1, 3], ['m', 2], ['n', 1], [p, 0]]) + ' = 0';
    const correcta = num(c);
    const errores = [
      err('CX12', num(-c), `Tomaste como conjugado ${complejo(-a, b)}, cambiando el signo de la parte real. El conjugado de ${z} es ${zc}: se cambia el signo de la parte imaginaria.`, 'hipotesis', FM),
      a * a !== b * b ? err('CX1', num(-p, a * a - b * b), `Multiplicaste (${z})(${zc}) como si i² = 1 y te salió ${n2(a * a - b * b)}. Como i² = −1, el producto es ${a * a} + ${b * b} = ${N}.`, 'hipotesis', FM) : null,
      err('conjugados-suma-por-producto', num(-p, 2 * a), `Usaste la suma de las dos raíces complejas (${n2(2 * a)}) donde va su producto (${N}). El término independiente da el producto de las tres raíces.`),
    ];
    return {
      correcta, errores, variables,
      enunciado: ['La ecuación ', v('E', E), ', donde m y n son números enteros, tiene la raíz ', v('z', z), '.'],
      pregunta: ['¿Cuál es su ', v('X', 'raíz real'), '?'],
      solucion: [
        ['Los coeficientes son reales, así que el conjugado de ', v('z', z), ' también es raíz: ', v('w', zc), '. La tercera raíz, c, es real.'],
        ['El producto de las dos complejas es (', v('z', z), ')(', v('w', zc), `) = ${a * a} + ${b * b} = ${N}.`],
        [`En x³ + mx² + nx + d = 0 el producto de las raíces es −d: ${N}·c = ${n2(-p)} → `, v('X', `c = ${correcta.texto}`), '.'],
      ],
      datos: { a, b, p },
    };
  }

  // ---- conjugada/irracional ----
  function irracional(rng) {
    const a = noCero(rng, -3, 3), b = rng.elegir([2, 3, 5, 6, 7]), c = noCero(rng, -5, 5);
    const N = a * a - b, p = -c * N;
    if (N === 0) return null;
    const z = `${n2(a)} + √${b}`, zc = `${n2(a)} − √${b}`;
    const variables = { E: { nombre: 'la ecuación', color: 'o' }, z: { nombre: 'la raíz irracional', color: 'i' }, w: { nombre: 'su pareja', color: 'h' }, X: { nombre: 'la raíz racional', color: 'd' } };
    const E = expr([[1, 3], ['m', 2], ['n', 1], [p, 0]]) + ' = 0';
    const correcta = num(c);
    const errores = [
      err('pareja-irracional-signo-entero', num(-c), `Tomaste como pareja ${n2(-a)} + √${b}, cambiando el signo de la parte entera. La pareja de ${z} es ${zc}: cambia el signo del radical.`),
      err('producto-como-complejo', num(-p, a * a + b), `Multiplicaste (${z})(${zc}) como si fueran complejos conjugados: ${a * a} + ${b}. Aquí es una diferencia de cuadrados: ${a * a} − ${b} = ${n2(N)}.`),
      err('conjugados-suma-por-producto', num(-p, 2 * a), `Usaste la suma de la pareja (${n2(2 * a)}) donde va su producto (${n2(N)}). El término independiente da el producto de las tres raíces.`),
    ];
    return {
      correcta, errores, variables,
      enunciado: ['La ecuación ', v('E', E), ', donde m y n son números enteros, tiene la raíz ', v('z', z), '.'],
      pregunta: ['¿Cuál es su ', v('X', 'raíz racional'), '?'],
      solucion: [
        ['Los coeficientes son enteros, así que ', v('w', zc), ' también es raíz (las raíces de la forma a + √b van en pareja). La tercera, c, es racional.'],
        ['El producto de la pareja es (', v('z', z), ')(', v('w', zc), `) = ${a * a} − ${b} = ${n2(N)}.`],
        [`En x³ + mx² + nx + d = 0 el producto de las raíces es −d: ${par(N)}·c = ${n2(-p)} → `, v('X', `c = ${correcta.texto}`), '.'],
      ],
      datos: { a, b, p },
    };
  }

  // ---- divisores: raíz racional no entera ----
  function divisores(rng) {
    const q = rng.elegir([2, 3]), p = noCero(rng, -5, 5), r = noCero(rng, -4, 4), s = noCero(rng, -4, 4);
    if (p % q === 0 || r >= s || p === r || p === s) return null;
    if (P.frac(p, q).d === 1) return null;
    // (qx − p)(x − r)(x − s)
    const c = [q, -q * (r + s) - p, q * r * s + p * (r + s), -p * r * s];
    if (c.some(x => Math.abs(x) > 80)) return null;
    const variables = { P: { nombre: 'el polinomio', color: 'o' }, r: { nombre: 'raíces enteras', color: 'i' }, X: { nombre: 'la raíz no entera', color: 'd' } };
    const correcta = num(p, q);
    const g = P.frac(p, q);
    const errores = [
      err('olvida-coef-principal', num(g.n), `Ese es un divisor del término independiente, pero no es raíz: el coeficiente principal es ${q}, y los candidatos también se dividen entre sus divisores (±p/q).`),
      err('raiz-racional-invertida', num(g.d, g.n), `Invertiste la fracción. Las raíces racionales tienen arriba un divisor del término independiente y abajo uno del coeficiente principal: ${P.textoFraccion(g)}.`),
      err('raiz-signo-cambiado', num(-p, q), `Cambiaste el signo: el factor ${expr([[q, 1], [-p, 0]])} se anula en x = ${P.textoFraccion(g)}.`),
    ];
    const coc1 = [q, c[1] + q * r, c[2] + r * (c[1] + q * r)];
    return {
      correcta, errores, variables,
      enunciado: ['Al factorizar ', v('P', `P(x) = ${poli(c)}`), ' en factores de primer grado con coeficientes enteros, una de las raíces de P(x) = 0 no es un número entero.'],
      pregunta: ['¿Cuál es esa ', v('X', 'raíz'), '?'],
      solucion: [
        [`Candidatos a raíz racional: ± (divisores de ${Math.abs(c[3])})/(divisores de ${q}).`],
        ['Se prueba con Ruffini: ', v('r', `x = ${n2(r)}`), ` da resto 0 y queda ${poli(coc1)}; luego `, v('r', `x = ${n2(s)}`), ` da resto 0 y queda ${expr([[q, 1], [-p, 0]])}.`],
        [`P(x) = (${factor(r)})(${factor(s)})(${expr([[q, 1], [-p, 0]])}). La raíz no entera anula el último factor: `, v('X', `x = ${correcta.texto}`), '.'],
      ],
      datos: { coef: c },
    };
  }

  return { id: ID, titulo: 'Raíces y coeficientes de una ecuación', generar, _texto: { poli, expr } };
});
