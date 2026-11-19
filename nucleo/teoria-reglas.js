/*
 * Reglas de calidad 2 de la teoría (Etapa 5, 19 nov 2026): lo que los auditores (rutinas/auditoria/) y los lectores en
 * frío (rutinas/frio/) encontraron una y otra vez en las 15 primeras unidades, convertido en reglas que comprueba una
 * máquina. Las usa Teoria.problemas (nucleo/teoria.js) solo en unidades con `calidad: 2`; una unidad en proceso no las
 * ve hasta que se marca. La lista en lenguaje claro, para quien escribe una unidad: docs/metodo/unidad/reglas-validador.md.
 *
 * Sin DOM. Corre en las pruebas (Node); la app no carga este archivo: en el celular del alumno el validador no corre.
 *
 *   TeoriaReglas.revisar(def, o, T)  → todos los hallazgos: [{ regla, idea, donde, que }]
 *   TeoriaReglas.aplicar(def, o, T)  → { fallan, pendientes }: los hallazgos sin excepción y los que una excepción cubre
 *   TeoriaReglas.EXCEPCIONES         → faltas reales del contenido existente, con fecha: la lista de pendientes
 *   TeoriaReglas.REGLAS              → { id: descripción corta } de cada regla
 *
 * o.semillas: cuántas semillas de «Ahora tú» se miran (60 por defecto). o.letras: símbolos que se suman a la tabla de
 * letras ({ símbolo: término }); si no se dan, en Node salen solos del glosario de las unidades que la unidad pide.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('./kit/kit.js') : root.Kit, nodo ? require('./glosario.js') : root.Glosario, nodo ? require : null);
  if (nodo) module.exports = api;
  else root.TeoriaReglas = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, Glosario, requerir) {
  'use strict';

  const REGLAS = {
    'glosario-predice': 'El glosario de una idea (simple, definición y ejemplos) no trae el valor ni la frase que responde su Predice.',
    'antes-predice': 'Nada de lo que se lee antes de Predice (Lee, el juego, su misión y su leyenda) trae la frase o la cuenta que la responde.',
    'letras-datos': 'Toda letra de una línea de Datos está dicha en ese ejercicio (enunciado o datos) o en la tabla de letras de la unidad.',
    'letra-repartida': 'La letra de la alternativa correcta se reparte: con 10 casos o más, ninguna pasa del 40 % ni falta.',
    'respuesta-letra': 'La letra que da la respuesta de un ejemplo es la de la alternativa que dice su valor.',
    'alternativa-sin-explicar': 'En un ejemplo con alternativas, el resuelto nombra cada alternativa incorrecta.',
    'figura-respuesta': 'La figura de un ejemplo o de Predice no escribe el número que se pide (de dos cifras o más, fuera de una escala).',
    'datos-respuesta': 'Los Datos no traen «lo que se pregunta = la respuesta» (cos 37° = 4/5 cuando se pide cos 37°).',
    'datos-consejo': 'Una línea de Datos es equivalencia, valor, constante, definición o fórmula: nunca un consejo.',
    'resuelve-repite': '«Así se resuelve» (sus 4 primeros casos) no trae un caso de los 12 primeros de «Ahora tú».',
    'leyenda-visible': 'Toda letra que nombra la leyenda del juego se ve en el juego: en la figura, la lectura, la consigna, la misión o los controles.',
  };

  // Faltas reales encontradas en las unidades con calidad 2 al escribir cada regla. No son permiso: son la lista de
  // pendientes de quien corrige la unidad. Al corregir una, se borra su línea (la prueba avisa si una ya no hace falta).
  //   { regla, unidad, idea ('' si es de toda la unidad), en?: texto que debe traer el hallazgo, motivo, fecha }
  const EXCEPCIONES = [
    // alternativa-sin-explicar
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.cuatro-operaciones', idea: 'otras-bases', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 14', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.cuatro-operaciones', idea: 'prestamo', motivo: 'el resuelto no nombra todas las alternativas incorrectas en el ejemplo 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.numeracion', idea: 'agrupar', motivo: 'el resuelto no nombra todas las alternativas incorrectas en el ejemplo 11', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.numeracion', idea: 'conteo-cifras', motivo: 'el resuelto no nombra todas las alternativas incorrectas en el ejemplo 11', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.numeracion', idea: 'descomposicion', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 14', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'desplazamiento-distancia', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'encuentro', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'grafica-xt', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'mru', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'velocidad-relativa', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'aceleracion', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'caida-libre', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'caida-reposo', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'ecuaciones-mruv', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'graficas-xt-at', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'pendiente-aceleracion', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'quimica.estructura-atomica', idea: 'configuracion-iones', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'quimica.estructura-atomica', idea: 'desapareados-isoelectronicos', motivo: 'el resuelto no nombra todas las alternativas incorrectas en el ejemplo 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'quimica.estructura-atomica', idea: 'modelos-atomicos', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'quimica.estructura-atomica', idea: 'numeros-cuanticos', motivo: 'el resuelto no nombra todas las alternativas incorrectas en el ejemplo 11', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'conclusion-necesaria', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'doble-entrada', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'dos-atributos', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'parentesco', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'si-entonces', motivo: 'el resuelto no nombra todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    // glosario-predice
    { regla: 'glosario-predice', unidad: 'fisica.vectores', idea: 'componentes', motivo: '«vector unitario» (ejemplo 1) da la respuesta de Predice «0,6î + 0,8ĵ»: «A⃗ = 6î + 8ĵ: û = 0,6î + 0,8ĵ.»', fecha: '2026-11-19' },
    { regla: 'glosario-predice', unidad: 'trigonometria.razones-trigonometricas-agudas', idea: 'aproximados', motivo: '«ángulo aproximado» (ejemplo 1) da la respuesta de Predice «No: mide unos 36,87°»: «37° del 3-4-5, que mide unos 36,87°.»', fecha: '2026-11-19' },
    // letra-repartida
    { regla: 'letra-repartida', unidad: 'algebra.exponentes-y-productos-notables', idea: '', motivo: 'en los ejemplos de nivel 3, la B es la correcta en 8 de 15 (A: 3, B: 8, C: 3, D: 1, E: 0)', fecha: '2026-11-19' },
    { regla: 'letra-repartida', unidad: 'algebra.productos-notables', idea: '', motivo: 'en los ejemplos de nivel 3, la D nunca es la correcta en 25 casos (A: 9, B: 8, C: 8, D: 0, E: 0)', fecha: '2026-11-19' },
    { regla: 'letra-repartida', unidad: 'aritmetica.numeracion', idea: '', motivo: 'en los ejemplos de nivel 3, la C es la correcta en 8 de 14 (A: 1, B: 3, C: 8, D: 2)', fecha: '2026-11-19' },
    { regla: 'letra-repartida', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: '', motivo: 'en los ejemplos de nivel 3, la C es la correcta en 15 de 25 (A: 2, B: 1, C: 15, D: 5, E: 2)', fecha: '2026-11-19' },
    // letras-datos
    { regla: 'letras-datos', unidad: 'fisica.magnitudes-y-vectores', idea: 'homogeneidad', motivo: 'Datos usa «M» y «T» sin decir qué son (ejemplos 5, 7, 8, 12, 14, 15 y casos generados); basta declararla en def.letras', fecha: '2026-11-19' },
    { regla: 'letras-datos', unidad: 'fisica.vectores', idea: 'productos', motivo: 'Datos usa «θ» sin decir qué es (ejemplos 3, 6, 9, 12, 13 y casos generados); basta declararla en def.letras', fecha: '2026-11-19' },
    { regla: 'letras-datos', unidad: 'fisica.vectores', idea: 'resultante', motivo: 'Datos usa «B» sin decir qué es (ejemplo 6: el enunciado habla de dos fuerzas de módulo F); basta declararla en def.letras', fecha: '2026-11-19' },
    { regla: 'letras-datos', unidad: 'quimica.estructura-atomica', idea: 'nucleo-identidad', motivo: 'Datos usa «N» sin decir qué es (ejemplos 1, 2, 6, 8, 9, 12, 14, 15 y casos generados); basta declararla en def.letras', fecha: '2026-11-19' },
    { regla: 'letras-datos', unidad: 'quimica.materia-y-energia', idea: 'calor-sensible-latente', motivo: 'Datos usa «ΔT» sin decir qué es (ejemplos 6, 7, 9, 11, 12, 13, 15 y casos generados); basta declararla en def.letras', fecha: '2026-11-19' },
    { regla: 'letras-datos', unidad: 'quimica.materia-y-energia', idea: 'propiedades', motivo: 'Datos usa «V» sin decir qué es (ejemplos 1, 5, 6, 7, 8, 11, 13, 14 y casos generados); basta declararla en def.letras', fecha: '2026-11-19' },
    // leyenda-visible
    { regla: 'leyenda-visible', unidad: 'fisica.mruv-y-caida-libre', idea: 'caida-reposo', motivo: 'la leyenda nombra «h» y el juego no la escribe en ningún caso', fecha: '2026-11-19' },
    { regla: 'leyenda-visible', unidad: 'fisica.mruv-y-caida-libre', idea: 'ecuaciones-mruv', motivo: 'la leyenda nombra «v0» y el juego no la escribe en ningún caso', fecha: '2026-11-19' },
    { regla: 'leyenda-visible', unidad: 'fisica.vectores', idea: 'resultante', motivo: 'la leyenda nombra «u» y el juego no la escribe en ningún caso', fecha: '2026-11-19' },
    { regla: 'leyenda-visible', unidad: 'quimica.estructura-atomica', idea: 'numeros-cuanticos', motivo: 'la leyenda nombra «f» y el juego solo llega al piso 3 (se agregó por el lector en frío, ronda 2: Predice habla del subnivel f); decidir si va en los datos de Predice', fecha: '2026-11-19' },
    { regla: 'leyenda-visible', unidad: 'quimica.materia-y-energia', idea: 'masa-energia', motivo: 'la leyenda nombra «E» y el juego no la escribe en ningún caso', fecha: '2026-11-19' },
    // resuelve-repite
    { regla: 'resuelve-repite', unidad: 'fisica.magnitudes-y-vectores', idea: 'homogeneidad', motivo: 'resuelve semilla 3 es el caso de «Ahora tú» (semilla 1): «En E = k · S², E es una energía y S es un área. ¿Qué dimensión tiene k?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'fisica.vectores', idea: 'escalar-vector', motivo: 'resuelve semilla 2 es el caso de «Ahora tú» (semilla 0): «En la noche, la temperatura baja a −8 °C. ¿Qué clase de magnitud es la temperatura?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.estructura-atomica', idea: 'configuracion-iones', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 8): «¿Cuál es la configuración abreviada del ion Ni²⁺?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'calor-sensible-latente', motivo: 'resuelve semilla 2 es el caso de «Ahora tú» (semilla 2): «¿Cuánto calor hace falta para llevar 200 g de hielo a 0 °C hasta agua líquida a 10 °C?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'fisico-quimico-nuclear', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 5): «El azúcar se disuelve en el té. ¿Qué tipo de cambio es?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'masa-energia', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 5): «En un proceso nuclear desaparecen 20 mg de masa. ¿Cuánta energía se libera?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'propiedades', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 5): «La balanza marca 31,5 g para una moneda de plata. En la probeta, el agua sube de 50 mL a ', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'sustancia-mezcla', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 5): «Esta es la lupa de una muestra. ¿Cómo se clasifica?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'quimica.materia-y-energia', idea: 'vida-media', motivo: 'resuelve semilla 3 es el caso de «Ahora tú» (semilla 8): «Una fuente de cobalto-60 pasa de 48 g a 12 g en 10,6 años. ¿Cuál es su vida media?»', fecha: '2026-11-19' },
    { regla: 'resuelve-repite', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'si-entonces', motivo: 'resuelve semilla 0 es el caso de «Ahora tú» (semilla 1): «Regla: si un número termina en 0, es par. Se sabe que el número es par. ¿Qué se concluye ', fecha: '2026-11-19' },
  ];

  // ---------- Texto ----------
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const SUBL = { 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₕ': 'h', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₚ': 'p', 'ₛ': 's', 'ₜ': 't', 'ᵢ': 'i', 'ⱼ': 'j', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v' };
  // Lo que se ve de un texto con partes (nucleo/ecuacion.js), en una línea: las potencias como x^(2), los subíndices
  // pegados (v0) o con «_» si son letras (t_e), las fracciones con «/». No es Ecuacion.texto, que escribe para el lector
  // de pantalla («a elevado a m»): aquí hacen falta las letras tal como están.
  function liso(p) {
    if (p === null || p === undefined) return '';
    if (typeof p === 'string' || typeof p === 'number') return String(p);
    if (Array.isArray(p)) return p.map(liso).join('');
    if (typeof p !== 'object') return '';
    if ('v' in p) return String(p.t === undefined ? '' : p.t);
    if (p.frac) { const par = x => (/[\s+−\-·×÷/]/.test(x) ? `(${x})` : x); return `${par(liso(p.frac[0]))}/${par(liso(p.frac[1]))}`; }
    if (p.sup) return `${liso(p.sup[0])}^(${liso(p.sup[1])})`;
    if (p.sub) { const i = liso(p.sub[1]); return `${liso(p.sub[0])}${/^\d+$/.test(i) ? i : /^[\p{L}\d]+$/u.test(i) ? `_{${i}}` : i}`; }
    if (p.raiz !== undefined) return `${p.indice !== undefined && p.indice !== null && p.indice !== '' ? `[${liso(p.indice)}]` : ''}√(${liso(p.raiz)})`;
    if (p.vec !== undefined) return `${liso(p.vec)}⃗`;
    if ('llave' in p) return `${liso(p.llave)} (${liso(p.nota)})`;
    if (p.raya !== undefined) return liso(p.raya).replace(/\p{L}/gu, c => `${c}\u0305`);
    for (const k of ['tacha', 'abs', 'par', 'negrita', 'mult']) if (p[k] !== undefined) return liso(p[k]);
    return p.t !== undefined ? String(p.t) : '';
  }
  const limpio = s => String(s).replace(/[\u2060\u200b\u200c\u200d\ufeff]/g, '').replace(/[\u00a0\u202f\u2009\u2007\u2008]/g, ' ');
  const norma = s => limpio(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[«»"“”¿?¡!.,;:()]/g, ' ').replace(/\s+/g, ' ').trim();
  const palabrasDe = s => norma(s).split(' ').filter(Boolean);
  const VACIAS = new Set(('el la los las un una unos unas de del al a en y o u e que se su sus es son por con para como mas menos no si lo le les ' +
    'este esta esto ese esa eso cada todo toda todos todas muy ya hay porque cuando donde entre sin sobre hasta desde mismo misma tiene tienen ' +
    'cual cuales cuanto cuanta cuantos cuantas otro otra otros otras solo ser esta estan fue hace queda quedan vale da dan').split(' '));
  const contenido = s => palabrasDe(s).filter(w => w.length >= 4 && !VACIAS.has(w) && !/^\d/.test(w));
  // Las partes con color de un texto ({ v, t }), en orden.
  function fichas(p, acc = []) {
    if (!p || typeof p !== 'object') return acc;
    if (Array.isArray(p)) { p.forEach(x => fichas(x, acc)); return acc; }
    if ('v' in p) { acc.push(p); return acc; }
    for (const k of ['frac', 'sup', 'sub', 'raiz', 'indice', 'vec', 'tacha', 'abs', 'par', 'raya', 'negrita', 'mult', 'llave', 'nota']) if (p[k] !== undefined) fichas(p[k], acc);
    return acc;
  }
  const svgDe = dib => {
    try { const P = dib && Kit.piezas[dib.pieza]; return P ? P.dibujar(dib.datos, dib.estado || {}) : ''; } catch (e) { return ''; }
  };

  // ---------- Letras de una línea de datos (regla letras-datos) ----------
  const ATOMO = '(?:km|hm|dm|cm|mm|nm|μm|kg|mg|ms|min|kJ|kW|kPa|Pa|atm|mol|mL|Hz|kcal|cal|eV|rad|m|g|s|h|N|J|W|K|L|V|A|C|u)';
  const UNIDAD = `(?:${ATOMO}[²³]?(?:\\s?[/·]\\s?(?:°C|${ATOMO})[²³]?)*)`;
  const RE_NUM_UNIDAD = new RegExp(`(\\d) ${UNIDAD}(?![\\p{L}\\p{N}_])`, 'gu');
  const RE_UNIDAD_SOLA = new RegExp(`(?<![\\p{L}\\p{N}_])${ATOMO}[²³]?(?:[/·]\\(?(?:°C|${ATOMO})[²³]?\\)?)+(?![\\p{L}\\p{N}_])`, 'gu');
  // Fórmulas químicas (H₂O, CO₂, N₂, NaCl, C₆H₁₂O₆, Fe³⁺): sus letras son elementos, no letras de una fórmula.
  const RE_QUIMICA = /(?<![\p{L}\p{N}_])(?:[A-Z][a-z]?[₀-₉]*){1,8}[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]?(?![\p{L}\p{N}_])/gu;
  const esFormula = x => /[₀-₉⁺⁻]/.test(x) || /^(?:[A-Z][a-z]?){2,}$/.test(x) && /[a-z]/.test(x);
  const SUPS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '−', 'ⁿ': 'n', 'ᵏ': 'k', 'ᵐ': 'm' };
  // Subíndices y superíndices de Unicode, escritos en línea: v₀ → v0, tₑ → t_{e}, a² → a^2.
  const enLinea = s => s.replace(/[₀-₉]/g, c => SUB[c]).replace(/[ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ]+/g, m => `_{${[...m].map(c => SUBL[c]).join('')}}`)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵏᵐ]+/g, m => `^${[...m].map(c => SUPS[c]).join('')}`);
  // El texto listo para buscar letras: sin unidades (5 m, m/s) y, en química, sin fórmulas.
  function preparar(txt, quimica) {
    let s = limpio(txt);
    if (quimica) s = s.replace(RE_QUIMICA, x => (esFormula(x) ? ' ' : x)).replace(/(?<![\p{L}\p{N}_])e⁻/gu, ' ').replace(/(?<=\d)[spdf](?![\p{L}])/gu, ' ');
    return enLinea(s.replace(RE_NUM_UNIDAD, '$1 ').replace(RE_UNIDAD_SOLA, ' '));
  }
  const LETRA = '[A-Za-zα-ωΑ-Ωℓ]';
  const RE_SIMBOLO = new RegExp(`(?<![\\p{L}\\p{N}_°{])([Δ∆]?)(${LETRA})([′']?)(?:(_\\{[^}]+\\})|(\\d+)(?![\\p{L}\\p{N}])|(?![\\p{L}\\p{N}_∠]))`, 'gu');
  // Los símbolos de un texto ya preparado: [{ clave, base, sub }]. clave: «x», «Δx», «t_{e}»; un subíndice numérico no
  // hace otra letra (v0 es v). No cuentan: π, «m∠», ni las letras sueltas de una frase («a», «y», «la opción A», «el
  // paradero R»): esas solo cuentan pegadas a un signo de cuenta.
  function simbolosDe(s, quimica) {
    const out = [];
    for (const m of s.matchAll(RE_SIMBOLO)) {
      const [todo, delta, letra, prima, subLetras] = m, sub = subLetras || m[5] || '';
      if (letra === 'π' || letra === 'Δ' || letra === 'Σ') continue;
      const cola = s.slice(m.index + todo.length);
      if (/^\u0302/.test(cola)) continue; // k̂: un unitario, como î y ĵ
      const antes = s.slice(0, m.index).replace(/[\s\u0305\u20d7]+$/, '').slice(-1), resto = cola.replace(/^[\s\u0305\u20d7]+/, ''), despues = resto[0] || '';
      const cuenta = /[=+−\-·×÷/^√<>≤≥≠(]/.test(antes) || /[=+−\-·×÷/^<>≤≥≠)]/.test(despues);
      if ((/^[aeouy]$/.test(letra) || /^[A-ZÑ]$/.test(letra)) && !prima && !sub && !delta && !cuenta) continue;
      // «+ y hacia atrás», «+½ o −½»: la conjunción, no una letra.
      if (/^[aeouy]$/.test(letra) && !prima && !sub && !delta && (/\p{L}/u.test(despues) || (/^[+−-][\d½¼¾]/.test(resto) && !/[=+−\-·×÷/^√<>≤≥≠(]/.test(antes)))) continue;
      if (quimica && /^[spdf]$/.test(letra) && !sub && !delta) continue; // subniveles
      if (/[∠△]/.test(antes)) continue;
      const letraSub = /^_/.test(sub) ? sub : '';
      out.push({ clave: `${delta ? 'Δ' : ''}${letra}${prima ? '′' : ''}${letraSub}`, base: letra, sub: letraSub ? letraSub.slice(2, -1) : '' });
    }
    return out;
  }
  const NO_NOMBRE = new Set(('con por para que los las del una uno son sin mas entre donde cuando como vale sea sean todo cada pero tambien solo desde hasta sobre ' +
    'dos tres sus hay muy eso esa ese tal asi ser van ven dan fue era han vez cos sen tan cot sec csc log si es de la el en un al se su lo no ni').split(' '));
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const INI = '(?<![\\p{L}\\p{N}_{])', FIN = '(?![\\p{L}\\p{N}_])';
  // ¿El texto (ya preparado) dice qué es el símbolo? «D: la distancia», «p = 1 si…», «la base n», «Densidad: ρ = …»,
  // «M es…», «x en metros», «con k la medida de una parte», «a, b ≥ 0», «la base (n)», «la distancia, d, …».
  function definido(clave, s) {
    const k = escRe(clave), L = `${LETRA}(?:_\\{[^}]+\\})?`;
    if (new RegExp(`${INI}${k}${FIN}\\s*:\\s*(?=\\p{L}{2,}|«)`, 'u').test(s)) return true;
    if (new RegExp(`${INI}${k}${FIN}(?:\\^\\(?\\d\\)?)?\\s*=\\s*(?:[−-]?\\d|\\p{L}{3,})`, 'u').test(s)) return true;
    // «a + b = 7», «a · b = 10»: letras que una cuenta con número presenta
    if (new RegExp(`${INI}${k}${FIN}(?:\\s*[+−·×]\\s*${L}){1,3}\\s*=\\s*[−-]?\\d`, 'u').test(s)) return true;
    if (new RegExp(`${INI}${k}${FIN}\\s+(?:es|son|sera|será|vale|mide|esta|está|en|se mide|se lee|se llama|significa|medido|medida|medidos|entre|cuenta|indica|representa|la|el|los|las|un|una)\\s`, 'u').test(s)) return true;
    for (const m of s.matchAll(new RegExp(`(\\p{L}{3,})(?::|\\s+de)?\\s+${k}${FIN}`, 'gu'))) if (!NO_NOMBRE.has(norma(m[1]))) return true;
    if (new RegExp(`${INI}${k}${FIN}(?:\\s*,\\s*${L})*(?:\\s+(?:y|e)\\s+${L})?\\s*[><≥≤≠]`, 'u').test(s)) return true;
    if (new RegExp(`\\p{L}{3,}\\s*\\(${k}\\)`, 'u').test(s)) return true;
    // «La distancia recorrida, d, suma las áreas»: la letra en aposición
    if (new RegExp(`\\p{L}{3,}\\s*,\\s*${k}${FIN}\\s*[,:;]`, 'u').test(s)) return true;
    return false;
  }
  // Las letras que van en una misma lista («a : b : c», «a, b y c»): si una está dicha, lo están todas.
  function listas(s) {
    const L = `[Δ∆]?${LETRA}[′']?(?:\\d+|_\\{[^}]+\\})?`, out = [];
    for (const m of s.matchAll(new RegExp(`${INI}${L}(?:\\s*(?:,|:| y | e )\\s*${L})+${FIN}`, 'gu'))) out.push(simbolosDeLista(m[0]));
    return out;
  }
  const simbolosDeLista = txt => txt.split(/,|:| y | e /).map(x => x.trim().replace('∆', 'Δ').replace(/(\D)\d+$/, '$1')).filter(Boolean);
  // ¿La letra está en la línea como letra cualquiera? En una igualdad, a los dos lados de un «=» ((a + b)² = a² + 2ab + b²);
  // en una frase sin «=», dos veces o más («Si una razón vale a/b, sus lados miden a·k y b·k»).
  function cualquiera(letra, linea) {
    const sinPalabras = linea.replace(/\p{L}{4,}/gu, ' ').replace(/(?<![\p{L}])(?:sen|cos|tan|cot|sec|csc|log|con|por|los|las|del|una|que|son)(?![\p{L}])/gu, ' ');
    const partes = sinPalabras.split(/(?<![≠≤≥<>!])=/);
    if (partes.length >= 2) return partes.filter(x => x.includes(letra)).length >= 2;
    return sinPalabras.split(letra).length - 1 >= 2;
  }
  // Las claves de un símbolo del glosario o de la tabla: «n, ℓ, mₗ, mₛ» → n, ℓ, m_{l}, m_{s}.
  function clavesDe(txt) {
    const out = [];
    for (const parte of enLinea(limpio(String(txt))).split(/[,;]| y /)) {
      const m = new RegExp(`^\\s*([Δ∆]?)(${LETRA})([′']?)((?:\\d+|_\\{[^}]+\\}|_[\\p{L}\\d]+)?)\\s*[⃗]?\\s*$`, 'u').exec(parte);
      if (m) out.push(`${m[1] ? 'Δ' : ''}${m[2]}${m[3] ? '′' : ''}${/^_\{/.test(m[4]) ? m[4] : /^_/.test(m[4]) ? `_{${m[4].slice(1)}}` : ''}`);
    }
    return out;
  }

  // Los símbolos del glosario de las unidades que una unidad pide: «v: velocidad» se define en MRU, y MRUV la usa sin
  // repetirla. Es la cadena de `requiere` del catálogo dentro del mismo curso, más las unidades de otro curso que esa
  // cadena pide directamente (Vectores pide las razones trigonométricas); la cadena de otro curso no se sigue, para que
  // la «d» del divisor no valga como la «d» de una distancia. Solo en Node (lee catalogo/ y contenido/).
  let CATALOGO = null;
  function letrasDeRequiere(id) {
    if (!requerir) return {};
    const out = {};
    try {
      const fs = requerir('node:fs'), path = requerir('node:path'), raiz = path.join(__dirname, '..');
      if (!CATALOGO) {
        CATALOGO = {};
        const dir = path.join(raiz, 'catalogo', 'cursos');
        for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) for (const u of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).unidades) CATALOGO[u.id] = u;
      }
      const vistos = new Set([id]), cola = [...((CATALOGO[id] || {}).requiere || [])];
      while (cola.length) {
        const r = cola.shift();
        if (vistos.has(r)) continue;
        vistos.add(r);
        const [c, u] = r.split('.'), f = path.join(raiz, 'contenido', 'teoria', c, `${u}.js`);
        // Una unidad pedida que está a medias no rompe la revisión de esta.
        try { if (fs.existsSync(f)) for (const g of requerir(f).glosario || []) if (g && g.simbolo && !g.local) out[g.simbolo] = g.termino; } catch (e) { /* la dirá su propia prueba */ }
        if (c === String(id).split('.')[0]) cola.push(...((CATALOGO[r] || {}).requiere || []));
      }
    } catch (e) { /* sin catálogo: la tabla queda con lo de la unidad */ }
    return out;
  }

  // ---------- Las reglas ----------
  function revisar(def, o = {}, T) {
    const out = [];
    const N = o.semillas || 60;
    const quimica = /^quimica\./.test(def.unidad || '');
    const nums = (x, acc) => T.numerosDe(limpio(typeof x === 'string' ? x : liso(x)), acc || new Set());
    // Los números con su signo («−10» no es «10»): para comparar una respuesta con un dato.
    const conSigno = txt => { const m = /([+−-]?)\s*(\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?)/.exec(limpio(txt)); const n = m && [...nums(m[2])][0]; return n === undefined ? null : `${/[−-]/.test(m[1]) ? '-' : ''}${n}`; };
    // La tabla de letras de la unidad: def.letras, los símbolos de su glosario y los de las unidades que pide (o.letras).
    const tabla = new Set();
    for (const k of Object.keys(def.letras || {})) clavesDe(k).forEach(c => tabla.add(c));
    for (const g of def.glosario || []) if (g && g.simbolo) clavesDe(g.simbolo).forEach(c => tabla.add(c));
    for (const k of Object.keys(o.letras || letrasDeRequiere(def.unidad))) clavesDe(k).forEach(c => tabla.add(c));
    if (def.letras !== undefined && (!def.letras || typeof def.letras !== 'object' || Array.isArray(def.letras) ||
      Object.entries(def.letras).some(([k, v]) => !clavesDe(k).length || typeof v !== 'string' || !v.trim()))) {
      out.push({ regla: 'letras-datos', idea: '', donde: def.unidad, que: 'letras: la tabla de letras es { letra: «qué es» } (p. ej. { n: «la base», «t_e»: «instante del encuentro» })' });
    }
    const porIdea = Glosario ? Glosario.porIdea(def) : [];
    const letrasEj = [], letrasAT = [];
    const piezaDe = (dib, porDefecto) => Object.assign({ pieza: porDefecto }, dib);

    (def.ideas || []).forEach((idea, k) => {
      if (!idea || !idea.id) return;
      const d = `idea ${k + 1} (${idea.id})`;
      const mal = (regla, donde, que) => out.push({ regla, idea: idea.id, donde, que });
      const P = idea.predice, J = idea.juega || {};
      const ejemplos = Array.isArray(idea.ejemplos) ? idea.ejemplos.filter(Boolean) : [];
      // Los casos generados: «Ahora tú» (las semillas del validador) y «Así se resuelve» (12).
      const casosAT = [], casosR = [];
      if (idea.ahoraTu && typeof idea.ahoraTu.generar === 'function') for (let s = 0; s < N; s++) { try { const c = idea.ahoraTu.generar(s); if (c && c.pregunta && Array.isArray(c.opciones)) casosAT.push([s, c]); } catch (e) { /* lo dice el validador */ } }
      if (idea.resuelve && typeof idea.resuelve.generar === 'function') for (let s = 0; s < 12; s++) { try { const c = idea.resuelve.generar(s); if (c && c.enunciado) casosR.push([s, c]); } catch (e) { /* idem */ } }

      // --- (a) glosario-predice y antes-predice ---
      const buena = P && Array.isArray(P.opciones) && P.opciones.find(x => x && x.correcta);
      if (buena) {
        const tc = liso(buena.texto), preg = `${liso(P.pregunta)} ${(P.datos || []).map(liso).join(' ')}`;
        const nPreg = nums(preg), nResp = new Set([...nums(tc)].filter(n => !nPreg.has(n)));
        const wResp = palabrasDe(tc), cPreg = new Set(contenido(`${preg} ${tc}`));
        // La frase: la respuesta entera (3 palabras o más) o cuatro palabras seguidas de ella, con tres o más que digan
        // algo («el punto medio de» lo dice cualquier tarjeta de geometría: no cuenta).
        const frases = [];
        if (wResp.length >= 3) frases.push(wResp.join(' '));
        for (let i = 0; i + 4 <= wResp.length; i++) { const f = wResp.slice(i, i + 4); if (f.filter(w => !VACIAS.has(w)).length >= 3) frases.push(f.join(' ')); }
        const frase = txt => { const t = ` ${palabrasDe(txt).join(' ')} `; const f = frases.find(x => t.includes(` ${x} `)); return !f ? null : f === wResp.join(' ') ? 'la respuesta entera' : `la frase «${f}»`; };
        // El valor, en el glosario: la respuesta es un número (con su unidad) de dos cifras o más, o con decimales o
        // fracción, que la pregunta no dio, y el texto lo trae junto a los números de la pregunta (o, si la pregunta no
        // trae números, junto a una de sus palabras). Una cifra suelta (4, «5xy», «entre 9») está en cualquier ejemplo.
        const esNumero = /^\s*(?:[\p{L}_′⃗ ]{0,12}[=≈]\s*)?[+−-]?\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?\s*(?:\S+(?:\s+\S+)?)?\s*$/u.test(limpio(tc));
        const valor = txt => {
          if (!nResp.size || !esNumero || ![...nResp].every(n => n.replace(/[^\d]/g, '').replace(/^0+/, '').length >= 2)) return null;
          const n = nums(txt);
          if (![...nResp].every(x => n.has(x))) return null;
          const comunes = [...nPreg].filter(x => n.has(x)).length;
          const mismaSituacion = nPreg.size ? comunes >= Math.min(2, nPreg.size) : contenido(txt).some(w => cPreg.has(w));
          return mismaSituacion ? `el valor ${[...nResp].join(' y ')} con los números de la pregunta` : null;
        };
        for (const e of porIdea[k] || []) {
          const textos = [['simple', e.simple], ['definición', e.def], ...Glosario.ejemplosDe(e).map((x, i) => [`ejemplo ${i + 1}`, x])];
          for (const [campo, txt] of textos) { const q = txt && (frase(txt) || valor(txt)); if (q) mal('glosario-predice', `${d} glosario «${e.termino}» (${campo})`, `trae ${q}, que es la respuesta de su Predice («${limpio(tc)}»): «${txt}»`); }
        }
        // Antes de Predice, fuera del glosario: la frase, o la respuesta como resultado de una cuenta («= 25 m²»).
        const mResp = /^\s*(?:[\p{L}_′⃗ ]{0,12}[=≈]\s*)?[+−-]?(\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?)\s*(\S*)\s*$/u.exec(limpio(tc));
        const nR = mResp && [...nums(mResp[1])][0];
        const cuenta = txt => {
          if (nR === undefined || nR === null || nPreg.has(nR)) return null;
          const t = limpio(txt);
          for (const q of t.matchAll(/[=≈]\s*[+−-]?(\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?)\s*(\S*)/gu)) {
            if ([...nums(q[1])][0] === nR && (!mResp[2] || norma(q[2]) === norma(mResp[2]))) return `la cuenta «${q[0].trim()}»`;
          }
          return null;
        };
        const antes = [];
        ((idea.lee && idea.lee.tarjetas) || []).forEach((t, i) => { if (t) antes.push([`Lee tarjeta ${i + 1}`, `${t.titulo || ''} · ${liso(t.texto)} · ${liso(t.ecuacion || '')}`]); });
        antes.push(['Juega (consigna y voz)', `${liso(J.consigna)} · ${liso(J.voz || '')}`]);
        if (J.mision) antes.push(['misión', `${liso(J.mision.texto)} · ${liso(J.mision.bien || '')} · ${liso(J.mision.pista || '')}`]);
        (J.leyenda || []).forEach(x => { if (x) antes.push(['leyenda', `${liso([x.s])}: ${liso(x.t)}`]); });
        for (const [campo, txt] of antes) { const q = frase(txt) || cuenta(txt); if (q) mal('antes-predice', `${d} ${campo}`, `trae ${q}, que es la respuesta de Predice («${limpio(tc)}»): «${limpio(txt).trim()}»`); }
      }

      // --- figura-respuesta, en Predice ---
      const grande = n => n.replace(/[^\d]/g, '').replace(/^0+/, '').length >= 2;
      if (buena && P.dibujo) {
        const dados = nums(`${liso(P.pregunta)} ${(P.datos || []).map(liso).join(' ')}`);
        const pide = [...nums(liso(buena.texto))].filter(n => !dados.has(n) && grande(n));
        const otras = nums(P.opciones.filter(x => x && !x.correcta).map(x => liso(x.texto)).join(' · '));
        const txtFig = T.textoSVG(svgDe(piezaDe(P.dibujo, P.pieza || idea.pieza))), fig = nums(txtFig);
        // Si la figura trae también los números de las otras opciones, o el número es una marca de su escala, no la delata.
        const delata = pide.filter(n => fig.has(n) && ![...otras].some(x => fig.has(x) && x !== n) && !escala(txtFig, n));
        if (delata.length) mal('figura-respuesta', `${d} predice`, `el dibujo de Predice escribe ${delata.join(', ')}, que es la respuesta («${limpio(liso(buena.texto))}»)`);
      }

      // --- (b) letras-datos ---
      const vistasLetras = new Set();
      const letras = (donde, enunciado, datos) => {
        if (!Array.isArray(datos)) return;
        const lineas = datos.map(x => preparar(liso(x), quimica)), enun = preparar(liso(enunciado), quimica), todo = `${enun} · ${lineas.join(' · ')}`;
        const enEnun = new Set(simbolosDe(enun, quimica).map(x => x.clave)), grupos = listas(todo);
        const libre = base => lineas.some(l => cualquiera(base, l));
        const sueltas = new Set((todo.match(new RegExp(`${INI}${LETRA}${FIN}`, 'gu')) || []));
        const dicha = c => tabla.has(c) || enEnun.has(c) || definido(c, todo);
        const ok = (s, linea) => {
          const c = s.clave;
          if (dicha(c) || (!s.sub && libre(s.base))) return true;
          if (grupos.some(g => g.includes(c) && g.some(x => x !== c && dicha(x)))) return true;
          // Con subíndice: A_x, A_y, A_z son las componentes de una letra dicha; v_B vale si v está dicha y B se nombra suelta («la combi B»).
          if (s.sub && (dicha(s.base) || libre(s.base)) && (/^[xyz]$/.test(s.sub) || /^[A-Z]+$/.test(s.sub) && [...s.sub].every(ch => sueltas.has(ch)))) return true;
          return false;
        };
        const faltan = new Set();
        for (const linea of lineas) {
          // Una glosa entre paréntesis al final dice las letras de su fórmula: «v = d / t (distancia entre tiempo)».
          if (/=.*\((?:[^()]*\p{L}{4,}){2,}[^()]*\)\s*\.?\s*$/u.test(linea)) continue;
          for (const s of simbolosDe(linea, quimica)) {
            const sinDelta = s.clave.replace(/^Δ/, '');
            if (ok(s, linea) || (sinDelta !== s.clave && ok(Object.assign({}, s, { clave: sinDelta }), linea))) continue;
            faltan.add(s.clave.replace(/_\{([^}]+)\}/, '_$1'));
          }
        }
        const sitio = donde.replace(/ semilla \d+/, '');
        const nuevas = [...faltan].filter(c => !vistasLetras.has(`${sitio}|${c}`));
        nuevas.forEach(c => vistasLetras.add(`${sitio}|${c}`));
        if (nuevas.length) mal('letras-datos', donde, `en Datos, ${nuevas.map(c => `«${c}»`).join(', ')} sin decir qué ${nuevas.length > 1 ? 'son' : 'es'}: dilo en el ejercicio («${nuevas[0]}: …») o en la tabla de letras de la unidad (def.letras, o el símbolo de un término del glosario)`);
      };
      if (P) letras(`${d} predice`, P.pregunta, P.datos);
      ejemplos.forEach((e, i) => letras(`${d} ejemplo ${i + 1}`, e.enunciado, e.datos));
      casosR.forEach(([s, c]) => letras(`${d} resuelve semilla ${s}`, c.enunciado, c.datos));
      casosAT.forEach(([s, c]) => letras(`${d} ahoraTu semilla ${s}`, c.pregunta, c.datos));

      // --- datos-consejo ---
      const RE_CONSEJO = /^\s*(?:ojo\b|recuerda\b|cuidado\b|atenci[oó]n\b|no olvides\b|no te olvides\b|ten en cuenta\b|f[ií]jate\b|conviene\b|te conviene\b|truco\b|consejo\b|tip\b|primero (?:halla|calcula|busca|convierte|pasa)\b|empieza por\b)|\b(?:recuerda que|no olvides|ojo:|el truco|lo m[aá]s f[aá]cil es|te conviene)\b/i;
      // El aviso de una letra que choca con otra sí va («Ojo: aquí T es el período…»; Gerson, 17 nov: péndulo).
      const RE_AVISO_LETRA = /^\s*ojo:\s*(?:aqu[ií]\s+)?[\p{L}][₀-₉ₐ-ₜ′]?\s+(?:es|son|no es)\b/iu;
      const vistosConsejo = new Set();
      const consejo = (donde, datos) => {
        for (const x of Array.isArray(datos) ? datos : []) {
          const t = limpio(liso(x));
          if (RE_CONSEJO.test(t) && !RE_AVISO_LETRA.test(t) && !vistosConsejo.has(t)) { vistosConsejo.add(t); mal('datos-consejo', donde, `«${t}» es un consejo, no un dato (equivalencia, valor, constante, definición o fórmula)`); }
        }
      };
      if (P) consejo(`${d} predice`, P.datos);
      ejemplos.forEach((e, i) => consejo(`${d} ejemplo ${i + 1}`, e.datos));
      casosR.forEach(([s, c]) => consejo(`${d} resuelve semilla ${s}`, c.datos));
      casosAT.forEach(([s, c]) => consejo(`${d} ahoraTu semilla ${s}`, c.datos));

      // --- datos-respuesta: una línea de Datos dice «lo que se pregunta = la respuesta» ---
      // La respuesta es un número (con su signo y su unidad); la línea lo trae a la derecha de un «=» o un «≈», y lo que
      // hay a su izquierda (3 letras o más: «cos 37°», «1 km») está tal cual en el enunciado.
      const enDatos = (valorTxt, enunciado, datos) => {
        const m = /^\s*(?:[\p{L}_′⃗ ]{0,12}[=≈]\s*)?([+−-]?\s*\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?)\s*(\S*)\s*$/u.exec(limpio(valorTxt));
        if (!m || !Array.isArray(datos)) return null;
        const n = conSigno(m[1]), unidad = m[2].replace(/[.;,]$/, ''), enun = ` ${norma(liso(enunciado))} `;
        if (n === null) return null;
        for (const x of datos) {
          const t = limpio(liso(x));
          for (const q of t.matchAll(/([^=≈,;:·]{3,}?)\s*[=≈]\s*([+−-]?\s*\d[\d .,]*(?:\s*\/\s*\d[\d.,]*)?)\s*([^\s,;.:)]*)/gu)) {
            const izq = norma(q[1]);
            if (izq.replace(/\s/g, '').length < 3 || !enun.includes(` ${izq} `)) continue;
            if (conSigno(q[2]) === n && (!unidad || norma(q[3]) === norma(unidad))) return t;
          }
        }
        return null;
      };
      ejemplos.forEach((e, i) => {
        const fs = fichas(e.respuesta).filter(f => !/^[A-E]$/.test(limpio(f.t)));
        for (const f of fs.length ? fs.map(x => String(x.t)) : [liso(e.respuesta)]) { const t = enDatos(f, e.enunciado, e.datos); if (t) { mal('datos-respuesta', `${d} ejemplo ${i + 1}`, `los Datos ya traen la respuesta («${limpio(f)}») a lo que se pregunta: «${t}»`); break; } }
      });
      const atDatos = casosAT.map(([s, c]) => { const b = c.opciones.find(x => x && x.correcta); const t = b && enDatos(liso(b.texto), c.pregunta, c.datos); return t ? [s, limpio(liso(b.texto)), t] : null; }).filter(Boolean);
      if (atDatos.length) mal('datos-respuesta', `${d} ahoraTu semilla ${atDatos[0][0]}`, `los Datos ya traen la respuesta («${atDatos[0][1]}») a lo que se pregunta: «${atDatos[0][2]}» (${atDatos.length} de ${casosAT.length} semillas)`);

      // --- resuelve-repite: los casos que el alumno ve primero (la app empieza las dos cuentas en la semilla 0) ---
      if (casosR.length && casosAT.length) {
        // El caso es su enunciado; si los dos traen dibujo, también el dibujo («Esta es la lupa de una muestra» con otra
        // lupa es otro caso).
        const dib = c => (c.dibujo ? JSON.stringify(c.dibujo.datos) : null);
        const igual = (r, a) => norma(liso(r.enunciado)) === norma(liso(a.pregunta)) && (dib(r) === null || dib(a) === null || dib(r) === dib(a));
        for (const [sr, r] of casosR.filter(([s]) => s < 4)) {
          const par = casosAT.find(([s, a]) => s < 12 && igual(r, a));
          if (par) { mal('resuelve-repite', `${d} resuelve semilla ${sr}`, `«Así se resuelve» trae el mismo caso que «Ahora tú» (semilla ${par[0]}): «${limpio(liso(r.enunciado))}»`); break; }
        }
      }

      // --- ejemplos: letra de la respuesta, alternativas y figura ---
      ejemplos.forEach((e, i) => {
        const de = `${d} ejemplo ${i + 1}`;
        if (!e.respuesta) return;
        const resp = limpio(liso(e.respuesta));
        // figura-respuesta: los números de la respuesta (los de color) que no dio el enunciado ni los datos, escritos en la figura
        if (e.figura) {
          const dados = nums(`${liso(e.enunciado)} · ${(e.datos || []).map(liso).join(' · ')}`);
          const fs = fichas(e.respuesta).filter(x => !/^[A-E]$/.test(limpio(x.t)));
          const pide = [...nums((fs.length ? fs.map(x => x.t) : [resp]).join(' · '))].filter(n => !dados.has(n) && grande(n));
          const txtFig = T.textoSVG(svgDe(e.figura)), fig = nums(txtFig);
          const alts = Array.isArray(e.alternativas) ? nums(e.alternativas.map(liso).join(' · ')) : new Set();
          const delata = pide.filter(n => fig.has(n) && ![...alts].some(x => x !== n && fig.has(x)) && !escala(txtFig, n));
          if (delata.length) mal('figura-respuesta', de, `la figura escribe ${delata.join(', ')}, que es la respuesta («${resp}»): la figura muestra el planteamiento, no el resultado`);
        }
        // Con alternativas: la letra de la respuesta
        if (Array.isArray(e.alternativas) && e.alternativas.length >= 2) {
          const alts = e.alternativas.map(a => limpio(liso(a)).trim()), L = 'ABCDE'.slice(0, alts.length);
          const m = /^\s*([A-E])(?![\p{L}\p{N}])/u.exec(resp);
          if (!m || !L.includes(m[1])) { mal('respuesta-letra', de, `la respuesta («${resp}») no empieza por la letra de su alternativa (${L[0]} a ${L[L.length - 1]})`); return; }
          const letra = m[1], idx = L.indexOf(letra), resto = ` ${norma(resp.slice(m[0].length))} `;
          const dice = a => norma(a).length > 0 && resto.includes(` ${norma(a)} `);
          const otra = alts.findIndex((a, j) => j !== idx && dice(a) && !norma(alts[idx]).includes(norma(a)));
          if (!dice(alts[idx]) && otra >= 0) mal('respuesta-letra', de, `la respuesta dice ${letra} y escribe «${alts[otra]}», que es la alternativa ${L[otra]} (la ${letra} es «${alts[idx]}»)`);
          letrasEj.push({ letra, n: alts.length, nivel: e.nivel, donde: de });
          // alternativa-sin-explicar: cada letra incorrecta sale en el resuelto
          const sol = limpio((e.solucion || []).map(x => `${liso(x && x.texto)} ${liso((x && x.ecuacion) || '')}`).join(' · '));
          const faltan = [...L].filter(x => x !== letra && !new RegExp(`(?<![\\p{L}\\p{N}_])${x}(?![\\p{L}\\p{N}_⃗])`, 'u').test(sol));
          // «Las demás…», «las otras cuatro…»: el resuelto las despacha juntas.
          const juntas = /\b(?:las|los) (?:dem[aá]s|otras|otros)\b|\bel resto\b|\bninguna otra\b/i.test(sol);
          if (faltan.length && !juntas) mal('alternativa-sin-explicar', de, `el resuelto no nombra ${faltan.length > 1 ? 'las alternativas' : 'la alternativa'} ${faltan.join(', ')}: di de qué error sale cada una`);
        }
      });

      // «Ahora tú»: la letra en que la app deja la correcta (T.barajar con semilla + 7, app/teoria.js).
      for (const [s, c] of casosAT) {
        const ops = T.barajar(c.opciones, s + 7), i = ops.findIndex(x => x && x.correcta);
        if (i >= 0) letrasAT.push({ letra: 'ABCDE'[i], n: ops.length });
      }

      // --- leyenda-visible: cada letra y cada color que nombra la leyenda se ve en algún caso del juego ---
      // Los casos: el inicio, los extremos de cada control, todos al mínimo y al máximo, el resumen, el testigo de la
      // misión y una muestra pareja de la grilla.
      if (Array.isArray(J.leyenda) && typeof J.dibujo === 'function') {
        const v0 = T.inicio(J), ctr = J.controles || [], casos = [v0];
        for (const c of ctr) {
          if (c.opciones) for (const op of c.opciones) casos.push(Object.assign({}, v0, { [c.id]: op.valor }));
          else casos.push(Object.assign({}, v0, { [c.id]: c.min }), Object.assign({}, v0, { [c.id]: c.max }));
        }
        const todos = lado => Object.fromEntries(ctr.map(c => [c.id, c.opciones ? c.opciones[lado === 'min' ? 0 : c.opciones.length - 1].valor : c[lado]]));
        if (ctr.length) casos.push(todos('min'), todos('max'));
        if (J.resumen) casos.push(Object.assign({}, v0, J.resumen));
        const t = J.mision && J.mision.testigo;
        if (Array.isArray(t)) casos.push(...t);
        try { const g = T.grilla(ctr), paso = Math.max(1, Math.floor(g.length / 40)); for (let i = 0; i < g.length; i += paso) casos.push(g[i]); } catch (e) { /* lo dice el validador */ }
        let visto = `${liso(J.consigna)} · ${liso(J.voz || '')} · ${J.mision ? `${liso(J.mision.texto)} · ${liso(J.mision.bien || '')}` : ''} · ${ctr.map(c => `${liso(c.etiqueta)} ${(c.opciones || []).map(x => liso(x.texto)).join(' ')} ${c.unidad || ''}`).join(' · ')}`;
        let svgs = '';
        for (const v of casos) {
          try { if (typeof J.lectura === 'function') { const l = J.lectura(v); visto += ` · ${liso(l)}`; svgs += fichas(l).map(f => ` var(--${f.v}) `).join(''); } } catch (e) { /* lo dice el validador */ }
          try { const svg = svgDe(piezaDe(J.dibujo(v), J.pieza || idea.pieza)); visto += ` · ${T.textoSVG(svg)}`; svgs += svg; } catch (e) { /* idem */ }
        }
        svgs += [J.consigna, J.mision && J.mision.texto].map(x => fichas(x).map(f => ` var(--${f.v}) `).join('')).join('') + ctr.map(c => (c.color ? ` var(--${c.color}) ` : '')).join('') + (J.arrastres || []).map(a => (a && a.color ? ` var(--${a.color}) ` : '')).join('');
        const s = enLinea(limpio(visto));
        const COLOR = { naranja: 'c-o', turquesa: 'c-i', violeta: 'c-f', morado: 'c-f', lila: 'c-f', 'carmín': 'c-h', carmin: 'c-h', verde: 'c-d' };
        const faltan = [];
        for (const x of J.leyenda) {
          const ls = x && enLinea(limpio(liso([x.s]))).trim();
          if (!ls) continue;
          const tok = COLOR[ls.toLowerCase()];
          if (tok) { if (!new RegExp(`${tok}(?![\\w-])`).test(svgs)) faltan.push(liso([x.s])); continue; }
          const m = new RegExp(`^([Δ∆]?)(${LETRA})([′']?)(?:\\d+|_\\{[^}]+\\})?[⃗]?$`, 'u').exec(ls);
          if (!m) continue;
          // La letra, sola o con su subíndice (v0, v_{B}, «v B» en un rótulo con <tspan>); puede llevar Δ delante.
          if (!new RegExp(`(?<![\\p{L}]|[\\p{L}][Δ∆])${escRe(m[2])}(?![\\p{L}])|(?<![\\p{L}])${escRe(m[2])}[\\p{Lu}\\d](?![\\p{L}])`, 'u').test(s.replace(/[Δ∆](?=\p{L})/gu, ' '))) faltan.push(liso([x.s]));
        }
        if (faltan.length) mal('leyenda-visible', `${d} juega leyenda`, `nombra ${faltan.map(x => `«${x}»`).join(', ')}, que no se ve en el juego (ni en la figura, la lectura, la consigna, la misión o los controles; se miró el inicio, los extremos y una muestra de casos)`);
      }
    });

    // --- (c) letra-repartida, en toda la unidad ---
    const reparto = (casos, que) => {
      // Cuentan los casos con 4 o 5 alternativas (el formato del examen); con 10 o más.
      const cs = casos.filter(c => c.n >= 4);
      if (cs.length < 10) return;
      const n = Math.max(...cs.map(c => c.n));
      const L = 'ABCDE'.slice(0, n), cuenta = Object.fromEntries([...L].map(l => [l, cs.filter(c => c.letra === l).length]));
      const resumen = [...L].map(l => `${l}: ${cuenta[l]}`).join(', ');
      for (const l of L) {
        const puede = cs.filter(c => 'ABCDE'.indexOf(l) < c.n).length; // en cuántos casos esa letra existe
        if (cuenta[l] / cs.length > 0.4) out.push({ regla: 'letra-repartida', idea: '', donde: def.unidad, que: `${que}: la ${l} es la correcta en ${cuenta[l]} de ${cs.length} (${Math.round(100 * cuenta[l] / cs.length)} %; el tope es 40 %). Reparto: ${resumen}` });
        else if (cuenta[l] === 0 && puede >= 10) out.push({ regla: 'letra-repartida', idea: '', donde: def.unidad, que: `${que}: la ${l} nunca es la correcta en ${puede} casos. Reparto: ${resumen}` });
      }
    };
    reparto(letrasEj.filter(c => c.nivel === 3), 'ejemplos de nivel 3');
    reparto(letrasAT, '«Ahora tú»');
    return out;
  }

  // ¿El número n está en la figura como marca de una escala (tres números o más en progresión que lo incluyen)?
  function escala(txt, n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return false;
    const xs = [...new Set((String(txt).match(/(?<![\p{L}\d.,])\d+(?:[.,]\d+)?(?![\d])/gu) || []).map(x => Number(x.replace(',', '.'))))].sort((a, b) => a - b);
    for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) {
      const p = xs[j] - xs[i];
      if (p <= 0) continue;
      let k = 2, serie = [xs[i], xs[j]];
      while (xs.some(x => Math.abs(x - (xs[i] + k * p)) < 1e-9)) { serie.push(xs[i] + k * p); k++; }
      if (serie.length >= 3 && serie.some(x => Math.abs(x - v) < 1e-9)) return true;
    }
    return false;
  }

  const cubre = (x, def, h) => x.regla === h.regla && x.unidad === def.unidad && (x.idea || '') === (h.idea || '') && (!x.en || `${h.donde}: ${h.que}`.includes(x.en));
  function aplicar(def, o, T) {
    const todos = revisar(def, o, T), fallan = [], pendientes = [];
    for (const h of todos) { const x = EXCEPCIONES.find(e => cubre(e, def, h)); if (x) pendientes.push(Object.assign({ motivo: x.motivo, fecha: x.fecha }, h)); else fallan.push(h); }
    return { fallan, pendientes };
  }
  // Las excepciones de una unidad que ya no cubren ningún hallazgo (se corrigió: hay que borrarlas).
  function sobran(def, o, T) {
    const todos = revisar(def, o, T);
    return EXCEPCIONES.filter(x => x.unidad === def.unidad && !todos.some(h => cubre(x, def, h)));
  }

  return { REGLAS, EXCEPCIONES, revisar, aplicar, sobran, letrasDeRequiere, liso, preparar, simbolosDe, definido, clavesDe, escala };
});
