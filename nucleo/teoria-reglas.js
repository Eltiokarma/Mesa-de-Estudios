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
 *   TeoriaReglas.igualdadesDe(txt)   → las igualdades entre números de un texto, evaluadas (regla igualdad-falsa)
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
    'respuesta-letra': 'La respuesta de un ejemplo con alternativas dice cuál es la suya: por su letra o por su valor; si da la letra, es la de la alternativa que dice su valor.',
    'alternativa-sin-explicar': 'En un ejemplo con alternativas, el resuelto nombra cada alternativa incorrecta, por su letra o por su valor.',
    'figura-respuesta': 'La figura de un ejemplo o de Predice no escribe el número que se pide (de dos cifras o más, fuera de una escala).',
    'datos-respuesta': 'Los Datos no traen «lo que se pregunta = la respuesta» (cos 37° = 4/5 cuando se pide cos 37°).',
    'datos-consejo': 'Una línea de Datos es equivalencia, valor, constante, definición o fórmula: nunca un consejo.',
    'resuelve-repite': '«Así se resuelve» (sus 4 primeros casos) no trae un caso de los 12 primeros de «Ahora tú».',
    'leyenda-visible': 'Toda letra que nombra la leyenda del juego se ve en el juego: en la figura, la lectura, la consigna, la misión o los controles.',
    'igualdad-falsa': 'Toda igualdad entre números que ve el alumno se cumple, con el redondeo que admiten los decimales del resultado; si es aproximada, va con «≈».',
  };

  // Faltas reales encontradas en las unidades con calidad 2 al escribir cada regla. No son permiso: son la lista de
  // pendientes de quien corrige la unidad. Al corregir una, se borra su línea (la prueba avisa si una ya no hace falta).
  //   { regla, unidad, idea ('' si es de toda la unidad), en?: texto que debe traer el hallazgo, motivo, fecha }
  const EXCEPCIONES = [
    // alternativa-sin-explicar
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.cuatro-operaciones', idea: 'otras-bases', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en el ejemplo 14', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'aritmetica.numeracion', idea: 'descomposicion', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en el ejemplo 11', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'desplazamiento-distancia', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'encuentro', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'grafica-xt', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'mru', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.movimiento-rectilineo', idea: 'velocidad-relativa', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'aceleracion', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 13, 14', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'caida-libre', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 12, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'caida-reposo', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en el ejemplo 12', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'ecuaciones-mruv', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'graficas-xt-at', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'fisica.mruv-y-caida-libre', idea: 'pendiente-aceleracion', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'quimica.estructura-atomica', idea: 'modelos-atomicos', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'conclusion-necesaria', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'doble-entrada', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'dos-atributos', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'parentesco', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
    { regla: 'alternativa-sin-explicar', unidad: 'razonamiento-matematico.razonamiento-deductivo', idea: 'si-entonces', motivo: 'el resuelto no nombra, ni por su letra ni por su valor, todas las alternativas incorrectas en los ejemplos 11, 12, 13, 14, 15', fecha: '2026-11-19' },
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

  // ---------- Igualdades numéricas escritas (regla igualdad-falsa) ----------
  // El texto de una ecuación tal como se ve, listo para hacer la cuenta: la fracción entre paréntesis, la potencia con
  // ^( ), la raíz con √( ). Lo que no es un número que se pueda operar (subíndices, rayas, múltiplos, tachados, vectores)
  // deja una marca ¤ que ensucia el lado donde está. La base de una potencia va tal cual: { sup: ['2π', '2'] } se ve
  // «2π²», que es 2·π² (sin paréntesis no es (2π)²).
  function textoCuenta(p) {
    if (p === null || p === undefined || p === false) return '';
    if (typeof p === 'string' || typeof p === 'number') return String(p);
    if (Array.isArray(p)) return p.map(textoCuenta).join('');
    if (typeof p !== 'object') return '';
    if ('v' in p) return String(p.t === undefined ? '' : p.t);
    if (p.frac) return `((${textoCuenta(p.frac[0])})/(${textoCuenta(p.frac[1])}))`;
    if (p.sup) return `${textoCuenta(p.sup[0])}^(${textoCuenta(p.sup[1])})`;
    if (p.sub) return `${textoCuenta(p.sub[0])}¤`;
    if (p.raiz !== undefined) return `${p.indice !== undefined && p.indice !== null && p.indice !== '' ? `[${textoCuenta(p.indice)}]` : ''}√(${textoCuenta(p.raiz)})`;
    if (p.par !== undefined) return `(${textoCuenta(p.par)})`;
    if (p.abs !== undefined) return `‖(${textoCuenta(p.abs)})`;
    if (p.negrita !== undefined) return textoCuenta(p.negrita);
    if (p.llave !== undefined) return textoCuenta(p.llave);
    if (p.vec !== undefined || p.raya !== undefined || p.mult !== undefined || p.tacha !== undefined) return '¤';
    return p.t !== undefined ? String(p.t) : '';
  }

  const SUP_CIFRA = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '' };
  const FRAC_U = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅛': [1, 8] };
  // Las unidades de ángulo, en grados: se pasan a grados para comparar (5° = π/36 rad).
  const ANGULO = { '°': 1, '′': 1 / 60, '″': 1 / 3600, 'ᵍ': 0.9, 'ᵐ': 0.009, 'ˢ': 0.00009, rad: 180 / Math.PI };
  // Unidades que van tras un número y un espacio (12 m, 3 m/s², 4 kJ/(kg·°C)). Solo se quitan; no se convierten.
  const BASES = 'm|g|s|L|N|J|W|V|A|C|Pa|Hz|mol|eV|Ω|F|Wb|cal|K';
  const ATOMO_C = `(?:(?:k|M|G|m|μ|µ|n|c|d|h|da|p)?(?:${BASES})|min|h|atm|mmHg|uma|u|Å|kWh|ppm|°C|°F|t|mT|μT|µT|nT)`;
  const UNI_C = `${ATOMO_C}(?:[²³]|\\^\\(?\\d\\)?)?(?:\\s?[/·]\\s?\\(?${ATOMO_C}(?:[²³]|\\^\\(?\\d\\)?)?(?:\\s?·\\s?${ATOMO_C}[²³]?)?\\)?)*`;
  const RE_UNI_C = new RegExp(`^(?:${UNI_C})(?![\\p{L}\\p{N}_])`, 'u');
  // Palabras que hacen de operación («15 % de 200», «3 por 4», «12 entre 4») o de función («sen 30°», «MCD(12; 18)»):
  // el número que tocan no es un lado de la igualdad.
  const OPERA = new Set(('de del por entre mas más menos veces vez elevado elevada al cuadrado cubo raiz raíz mitad doble triple ' +
    'tercio tercios cuarto cuartos quinto quintos sexto sextos octavo octavos décimo décimos sobre mod módulo ' +
    'sen cos tan tg cot ctg cotg sec csc cosec log ln lg exp arcsen arccos arctan mcd mcm MCD MCM CA máx mín max min cada x').split(' '));
  // «a» no: casi siempre es preposición («opuesto a 60° = 8√3»).
  const CONECTOR = new Set(['y', 'o', 'e', 'u']);
  // Lo que ensucia el número que toca (una cifra tapada, el subíndice de una base, un «±», un «…»), y la puntuación que,
  // pegada después de un número, lo deja limpio.
  const SUCIO = /[¤±∓…|_☐□▢■◻⬜?#!₀-₉₍₎]/u;
  const SEGURO = /^[,;.:)»”"’'\]}?—–→⇒]$/u;
  // Una igualdad que alguien dice o cree («Un compañero dice que √((−5)²) = −5») se cita para discutirla: no se mira.
  const RE_CITA = /(?<![\p{L}])(?:dice|dicen|dijo|cree|creen|crey[oó]|piensa|piensan|afirma|afirman|asegura|aseguran|propone|proponen|seg[uú]n|anot[oó]|escribi[oó]|sostiene|opina)(?![\p{L}])/iu;

  // Las fichas de un texto: num (v, dec), pi, op (o), rel (=, ≈), uni (u), ang (f), pal (w) y corte (lo demás, que
  // rompe el tramo), con su posición (i, fin) y si hay un espacio antes (esp).
  function fichasCuenta(s, puntoSepara) {
    const out = [];
    let i = 0;
    const push = (t, largo, extra) => { out.push(Object.assign({ t, i, fin: i + largo, esp: i > 0 && /\s/.test(s[i - 1]) }, extra)); i += largo; };
    while (i < s.length) {
      const c = s[i], resto = s.slice(i), prev = out[out.length - 1];
      const pegado = prev && prev.fin === i;
      const trasNumero = prev && (prev.t === 'num' || prev.t === 'pi' || (prev.t === 'op' && prev.o === ')'));
      let m;
      if (/\s/.test(c)) { i++; continue; }
      // Un número: 10 000 (miles con espacio), 0,63 (decimales con coma), 1½ (mixto).
      if ((m = /^\d{1,3}(?:[    ]\d{3})+(?![\d,])|^\d+(?:,\d+)?/.exec(resto))) {
        const raw = m[0].replace(/[    ]/g, '');
        let v = Number(raw.replace(',', '.'));
        const fr = FRAC_U[s[i + m[0].length]];
        if (fr) { v += fr[0] / fr[1]; push('num', m[0].length + 1, { v, dec: 0, mixto: true }); continue; }
        push('num', m[0].length, { v, dec: raw.includes(',') ? raw.split(',')[1].length : 0 });
        continue;
      }
      if (c === 'π') { push('pi', 1); continue; }
      if ((m = /^[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/.exec(resto))) {
        const e = Number([...m[0]].map(x => SUP_CIFRA[x]).join(''));
        if (trasNumero && pegado && Number.isFinite(e)) { out.push({ t: 'op', o: '^', i, fin: i, esp: false }); push('num', m[0].length, { v: e, dec: 0, exp: true }); } else push('corte', m[0].length, { que: 'sup' });
        continue;
      }
      if (FRAC_U[c]) {
        const [a, b] = FRAC_U[c];
        out.push({ t: 'op', o: '(', i, fin: i, esp: /\s/.test(s[i - 1] || '') }, { t: 'num', v: a, dec: 0, i, fin: i }, { t: 'op', o: '⁄', i, fin: i }, { t: 'num', v: b, dec: 0, i, fin: i });
        push('op', 1, { o: ')' }); continue;
      }
      if (trasNumero && (m = /^(?:°(?![CF])|′|″|ᵍ|ᵐ|ˢ)/u.exec(resto))) { push('ang', m[0].length, { f: ANGULO[m[0]], u: m[0] }); continue; }
      if (trasNumero && c === '%') { push('uni', 1, { u: '%' }); continue; }
      if (trasNumero && !pegado && (m = /^rad(?![\p{L}\p{N}_/])/u.exec(resto))) { push('ang', 3, { f: ANGULO.rad, u: 'rad' }); continue; }
      if (trasNumero && !pegado && (m = RE_UNI_C.exec(resto))) { push('uni', m[0].length, { u: m[0].replace(/\s/g, '') }); continue; }
      if (c === '=' || c === '≈') { push('rel', 1, { r: c }); continue; }
      // «   ·   »: un punto medio con espacios anchos separa dos cuentas, no multiplica.
      if (c === '·' && (/\s\s$/.test(s.slice(0, i)) && /^\s\s/.test(s.slice(i + 1)) || (puntoSepara && /\s$/.test(s.slice(0, i)) && /^\s/.test(s.slice(i + 1))))) { push('corte', 1, { que: '·' }); continue; }
      // «4/3» pegado es una fracción: va antes que el «/» con espacios y que ÷ (0,6 / 4/3 = 0,45).
      if (c === '/' && trasNumero && pegado && /^[\dπ(]/.test(s[i + 1] || '')) { push('op', 1, { o: '⁄' }); continue; }
      if ('+−-×·⋅∙*÷/^()√‖'.includes(c)) { push('op', 1, { o: { '-': '−', '⋅': '·', '∙': '·', '*': '·' }[c] || c }); continue; }
      if (c === '∛') { out.push({ t: 'op', o: '[', i, fin: i }, { t: 'num', v: 3, dec: 0, i, fin: i }, { t: 'op', o: ']', i, fin: i }); push('op', 1, { o: '√' }); continue; }
      if (c === '–' && /\s/.test(s[i - 1] || '') && /\s/.test(s[i + 1] || '')) { push('op', 1, { o: '−' }); continue; }
      if ((m = /^\[(\d+)\](?=√)/.exec(resto))) { out.push({ t: 'op', o: '[', i, fin: i, esp: /\s/.test(s[i - 1] || '') }, { t: 'num', v: Number(m[1]), dec: 0, i, fin: i }); push('op', m[0].length, { o: ']' }); continue; }
      if ((m = /^[\p{L}\p{M}_′]+/u.exec(resto))) { push('pal', m[0].length, { w: m[0] }); continue; }
      push('corte', 1, { que: c });
    }
    // La notación científica es un solo número: 4,1 × 10¹⁴ (así 5 × 10⁻² / 4,41 × 10⁻¹⁹ divide lo que se ve).
    for (let k = 0; k + 3 < out.length; k++) {
      const [a, x, d, p] = out.slice(k, k + 4);
      if (a.t !== 'num' || x.t !== 'op' || !'×·'.includes(x.o) || d.t !== 'num' || d.v !== 10 || d.dec || p.t !== 'op' || p.o !== '^') continue;
      let q = k + 4, par = false, sg = 1;
      if (out[q] && out[q].t === 'op' && out[q].o === '(') { par = true; q++; }
      if (out[q] && out[q].t === 'op' && out[q].o === '−') { sg = -1; q++; }
      const e = out[q];
      if (!e || e.t !== 'num' || e.dec) continue;
      q++;
      if (par) { if (!(out[q] && out[q].t === 'op' && out[q].o === ')')) continue; q++; }
      const n = sg * e.v;
      out.splice(k, q - k, Object.assign({}, a, { v: a.v * Math.pow(10, n), escala: Math.pow(10, n), fin: out[q - 1].fin }));
    }
    return out;
  }

  // Evalúa un lado (sus fichas, sin el «=»). modo 0: la multiplicación sin signo (2π, 3√2) se hace antes que × y ÷;
  // modo 1: al mismo nivel. Devuelve un número, o null si el lado no es una cuenta. cambia: { ficha: valor } para medir
  // cuánto mueve la cuenta un decimal redondeado.
  function evaluarCuenta(ts, modo, cambia) {
    let i = 0;
    const es = o => ts[i] && ts[i].t === 'op' && ts[i].o === o;
    const valor = t => (cambia && cambia.has(t) ? cambia.get(t) : t.v);
    const abre = t => t && (t.t === 'num' || t.t === 'pi' || (t.t === 'op' && '(√[‖'.includes(t.o)));
    // Sin signo se multiplica 2π, 2(…), 3√2, (2)(3) y (2)3; dos números seguidos (2 3) no.
    const sigue = () => abre(ts[i]) && !(ts[i].t === 'num' && !(ts[i - 1] && ts[i - 1].t === 'op' && ts[i - 1].o === ')'));
    function primario() {
      const t = ts[i];
      if (!t) throw 0;
      if (t.t === 'num') { i++; return valor(t); }
      if (t.t === 'pi') { i++; return Math.PI; }
      if (es('(')) { i++; const v = suma(); if (!es(')')) throw 0; i++; return v; }
      if (es('‖')) { i++; return Math.abs(primario()); }
      if (es('[')) { i++; const n = ts[i]; if (!n || n.t !== 'num') throw 0; i++; if (!es(']')) throw 0; i++; if (!es('√')) throw 0; i++; const x = potencia(); if (x < 0 && n.v % 2 === 0) throw 0; return Math.sign(x) * Math.pow(Math.abs(x), 1 / n.v); }
      if (es('√')) { i++; const x = potencia(); if (x < 0) throw 0; return Math.sqrt(x); }
      throw 0;
    }
    function potencia() {
      let b = primario();
      while (ts[i] && (ts[i].t === 'uni' || ts[i].t === 'ang')) i++;
      if (es('^')) { i++; b = Math.pow(b, signo()); }
      return b;
    }
    // modo 2: el denominador de una fracción pegada se lleva lo que sigue sin signo (2/3π es 2/(3π)).
    // modo 3: el exponente de una fracción pegada es de toda la fracción (3/5² es (3/5)²).
    function fraccion() {
      let v = modo === 3 ? primario() : potencia(), fr = false;
      while (es('⁄')) { i++; fr = true; let w = modo === 3 ? primario() : potencia(); if (modo === 2) while (sigue()) w *= potencia(); if (w === 0) throw 0; v /= w; }
      if (modo === 3) { while (ts[i] && (ts[i].t === 'uni' || ts[i].t === 'ang')) i++; if (es('^')) { i++; v = Math.pow(v, signo()); } else if (!fr) return v; }
      return v;
    }
    function signo() { if (es('−')) { i++; return -signo(); } if (es('+')) { i++; return signo(); } return fraccion(); }
    function pegado() { let v = signo(); if (modo !== 1) while (sigue()) v *= fraccion(); return v; }
    function producto() {
      let v = pegado();
      for (;;) {
        if (es('×') || es('·')) { i++; v *= pegado(); continue; }
        if (es('÷') || es('/')) { i++; const w = pegado(); if (w === 0) throw 0; v /= w; continue; }
        if (modo === 1 && sigue()) { v *= fraccion(); continue; }
        return v;
      }
    }
    function suma() { let v = producto(); for (;;) { if (es('+')) { i++; v += producto(); } else if (es('−')) { i++; v -= producto(); } else return v; } }
    try { const v = suma(); return i === ts.length && Number.isFinite(v) ? v : null; } catch (e) { return null; }
  }

  // ¿Un lado es un solo número (−2,67π, 25 %, 5,56ᵍ, 4,1 × 10¹⁴, 12,5 m)?
  const suelto = ts => ts.filter(t => t.t === 'num').length === 1 && ts.every(t => t.t === 'num' || t.t === 'pi' || t.t === 'uni' || t.t === 'ang' || (t.t === 'op' && (t.o === '−' || t.o === '+') && t === ts[0])) && ts.filter(t => t.t === 'pi').length <= 1;
  // Cuánto puede moverse la cuenta de un lado por sus decimales redondeados: media unidad de la última cifra de cada
  // número con decimales (en su escala: 4,1 × 10¹⁴ se mueve 0,05 × 10¹⁴).
  // Un número suelto entero (12 m) también está redondeado a la unidad.
  function holgura(ts, modo) {
    const v0 = evaluarCuenta(ts, modo);
    if (v0 === null) return 0;
    const unNumero = suelto(ts);
    let h = 0;
    for (const t of ts) {
      if (t.t !== 'num' || t.exp || t.mixto || (!t.dec && !unNumero)) continue;
      const d = 0.5 * Math.pow(10, -t.dec) * (t.escala || 1);
      const v1 = evaluarCuenta(ts, modo, new Map([[t, t.v + d]])), v2 = evaluarCuenta(ts, modo, new Map([[t, t.v - d]]));
      h += Math.max(v1 === null ? 0 : Math.abs(v1 - v0), v2 === null ? 0 : Math.abs(v2 - v0));
    }
    return h;
  }
  // ¿b es a por 10, 100, 1000… (o entre), con el redondeo de b?
  const porPotenciaDe10 = (a, b, tol) => { for (let k = -12; k <= 12; k++) if (k && Math.abs(a * Math.pow(10, k) - b) <= tol * (1 + 1e-9) + 1e-9 * Math.abs(b)) return true; return false; };

  // Las igualdades de un texto: [{ texto, a, b, falsa, redondeo }]. a y b son los dos lados; falsa: no se cumplen ni con
  // el redondeo que admite lo escrito; redondeo: se cumplen solo redondeando.
  function igualdadesDe(s, puntoSepara) {
    const t = fichasCuenta(s, puntoSepara), out = [];
    const enCuenta = x => x.t === 'num' || x.t === 'pi' || x.t === 'op' || x.t === 'uni' || x.t === 'ang' || x.t === 'rel';
    const BIN = '+×·÷/⁄^';
    let k = 0;
    while (k < t.length) {
      if (!enCuenta(t[k])) { k++; continue; }
      let z = k;
      while (z < t.length && enCuenta(t[z])) z++;
      const tramo = t.slice(k, z), antes = t[k - 1], despues = t[z];
      const ia = k, iz = z;
      k = z;
      if (!tramo.some(x => x.t === 'rel' && x.r === '=')) continue;
      if (RE_CITA.test(s.slice(0, tramo[0].i).split(/[.;?!¿¡]\s/).pop())) continue;
      const lados = [[]], rels = [];
      for (const x of tramo) { if (x.t === 'rel') { rels.push(x.r); lados.push([]); } else lados[lados.length - 1].push(x); }
      // Lo que va antes del tramo: ¿el primer lado sigue una cuenta que no es de números? («P(0)», «x − 3», «sen 30°»,
      // «15 % de 200», «2 : 3», «10,5 m + rectángulo 20,4 m»).
      const sucioIzq = (() => {
        if (!antes) return false;
        if (antes.fin === tramo[0].i && antes.t !== 'corte') return true;
        if (antes.t === 'pal') {
          let q = ia - 1; const ws = [];
          while (q >= 0 && t[q].t === 'pal' && ws.length < 4) ws.push(t[q--].w);
          const pp = t[q];
          if (pp && pp.t === 'op' && pp.o !== ')') return true;
          if (pp && ((pp.t === 'num' && ws.every(w => CONECTOR.has(w))) || ((pp.t === 'num' || pp.t === 'uni' || pp.t === 'ang') && ws.some(w => OPERA.has(w))))) return true;
          const w = antes.w;
          return OPERA.has(w) || OPERA.has(w.toLowerCase()) || (w.length === 1 && !CONECTOR.has(w)) || /[_′\p{M}]/u.test(w);
        }
        if (antes.t === 'corte') {
          if (SUCIO.test(antes.que)) return true;
          // Solo la puntuación de una frase deja limpio el lado; un signo propio («2 ★ (−1)», «5 ∗ 3») es otra operación.
          if (!/^[(«"“¿¡\[{—–→⇒;,:.<>≤≥≠·]$/.test(antes.que)) return true;
          const pp = t[ia - 2];
          if (/[.:,]/.test(antes.que) && pp && (pp.t === 'num' || (pp.t === 'op' && pp.o === ')')) && (antes.que === ':' || pp.fin === antes.i)) return true;
        }
        return false;
      })();
      // Lo que va después: «2x», «8☐», «1054₍₆₎», «= 20 % de 50», «= 400 T», «3 : 4».
      const sucioDer = (() => {
        if (!despues) return false;
        const ult = tramo[tramo.length - 1];
        if (despues.i === ult.fin) {
          if (despues.t === 'pal') return true;
          if (despues.t === 'corte' && !SEGURO.test(despues.que)) return true;
          if (despues.t === 'corte' && /[.,:]/.test(despues.que)) { const nn = t[iz + 1]; if (nn && nn.t === 'num' && nn.i === despues.fin) return true; }
        }
        if (despues.t === 'pal') {
          let q = iz; const ws = [];
          while (q < t.length && t[q].t === 'pal' && ws.length < 4) ws.push(t[q++].w);
          const nn = t[q];
          if (nn && nn.t === 'op' && BIN.includes(nn.o)) return true;
          const w = despues.w;
          if (/^en$/i.test(w) && t[iz + 1] && t[iz + 1].t === 'pal' && /^base/i.test(t[iz + 1].w)) return true; // «1/4 = 0,13 en base 6»
          return OPERA.has(w) || OPERA.has(w.toLowerCase()) || (w.length === 1 && !CONECTOR.has(w));
        }
        if (despues.t === 'corte' && despues.que === ':') { const nn = t[iz + 1]; if (nn && nn.t === 'num') return true; }
        if (despues.t === 'corte' && !/^[)»”"’'\]},;.:?!—–→⇒<>≤≥≠·]$/.test(despues.que)) return true;
        return false;
      })();
      // Paréntesis: el primer lado puede abrir uno que no cierra («(2 + 3 = 5)»), y el último cerrar uno que no abrió.
      const balance = ts => ts.reduce((b, x) => b + (x.t === 'op' && x.o === '(' ? 1 : x.t === 'op' && x.o === ')' ? -1 : 0), 0);
      if (lados[0][0] && lados[0][0].t === 'op' && lados[0][0].o === '(' && balance(lados[0]) > 0) lados[0] = lados[0].slice(1);
      const u = lados.length - 1, fin = lados[u];
      if (fin.length && fin[fin.length - 1].t === 'op' && fin[fin.length - 1].o === ')' && balance(fin) < 0) lados[u] = fin.slice(0, -1);
      const unidadesTramo = new Set(tramo.filter(x => x.t === 'uni').map(x => x.u));
      const limpio = (ts, j) => {
        if (!ts.length || !ts.some(x => x.t === 'num' || x.t === 'pi') || balance(ts) !== 0) return false;
        if (j === 0 && sucioIzq) return false;
        if (j === u && sucioDer) return false;
        const a = ts[0], z = ts[ts.length - 1];
        if (a.t === 'op' && (BIN.includes(a.o) || a.o === ')')) return false;
        // «a − 1 = 3»: un menos seguido de espacio resta algo que no es número; el signo de un número va pegado (−14).
        if (a.t === 'op' && a.o === '−' && ts[1] && ts[1].esp) return false;
        if (z.t === 'op' && z.o !== ')') return false;
        // Unidades que se cancelan (60° · π/180°): no se sabe qué queda.
        if (ts.some(x => x.t === 'op' && '/÷⁄'.includes(x.o)) && ts.filter(x => x.t === 'uni' || x.t === 'ang').length >= 2) return false;
        return true;
      };
      for (let j = 0; j < rels.length; j++) {
        if (rels[j] !== '=') continue;
        const A = lados[j], B = lados[j + 1];
        if (!limpio(A, j) || !limpio(B, j + 1)) continue;
        const uA = new Set(A.filter(x => x.t === 'uni').map(x => x.u)), uB = new Set(B.filter(x => x.t === 'uni').map(x => x.u));
        const gA = new Set(A.filter(x => x.t === 'ang').map(x => x.f)), gB = new Set(B.filter(x => x.t === 'ang').map(x => x.f));
        if ((gA.size || gB.size) && (uA.size || uB.size)) continue;
        if (gA.size > 1 || gB.size > 1) continue;
        // Dos números sueltos («queda 5 = 9», «360° = 0°», «1 nm = 1000 pm») dicen otra cosa que una cuenta; si son
        // dos medidas de ángulo en unidades distintas, es una conversión y se mira.
        if (suelto(A) && suelto(B) && !(gA.size && gB.size && [...gA][0] !== [...gB][0])) continue;
        // Unidades: las mismas a los dos lados, o una sola en un lado y ninguna en el otro si ese otro es la cuenta
        // («2 · 3 = 6 m») y el tramo no cambia de unidad («30 m/s = 30 · 3600/1000 = 108 km/h»).
        const mismas = [...uA].every(x => uB.has(x)) && [...uB].every(x => uA.has(x));
        const cuenta = ts => ts.some(x => x.t === 'op' && x.o !== '(' && x.o !== ')' && !(x === ts[0] && x.o === '−'));
        const sinU = uA.size ? B : A;
        if (!mismas && !((uA.size + uB.size === 1) && cuenta(sinU) && unidadesTramo.size === 1)) continue;
        // Ángulos: cada lado a grados; un lado sin unidad frente a uno con ella va en radianes si trae π y, si no, en la
        // unidad del otro lado.
        let fA = gA.size ? [...gA][0] : 1, fB = gB.size ? [...gB][0] : 1;
        if (gA.size !== gB.size) { const sin = gA.size ? B : A, f = sin.some(x => x.t === 'pi') ? ANGULO.rad : (gA.size ? fA : fB); if (gA.size) fB = f; else fA = f; }
        let mejor = null;
        // «5/15 = 33,33 %» y «16/160 · 100 = 10 %»: el % de un solo lado vale como «entre 100» o como unidad.
        const pc = (uA.has('%') !== uB.has('%')) ? [1, 100] : [1];
        for (const modo of [0, 1, 2, 3]) for (const q of pc) {
          const va = evaluarCuenta(A, modo), vb = evaluarCuenta(B, modo);
          if (va === null || vb === null) continue;
          const a = va * fA * (uB.has('%') ? q : 1), b = vb * fB * (uA.has('%') ? q : 1);
          // El lado de la derecha es el resultado: se redondea con sus decimales. El de la izquierda, si es una cuenta,
          // se hace con los números tal como se ven (2 · 0,63 es 1,26, aunque 0,63 venga de 0,625).
          const tol = Math.max(suelto(A) ? holgura(A, modo) * fA * (uB.has('%') ? q : 1) : 0, holgura(B, modo) * fB * (uA.has('%') ? q : 1));
          const d = Math.abs(a - b), eps = 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
          const r = { a, b, va, vb, tol, modo, falsa: d > tol * (1 + 1e-9) + eps, redondeo: d > eps && d <= tol * (1 + 1e-9) + eps };
          if (!mejor || (mejor.falsa && !r.falsa) || (mejor.redondeo && !r.falsa && !r.redondeo)) mejor = r;
        }
        if (!mejor) continue;
        // Dos redondeos que no valen con «=» (auditorías de Movimiento circular, M4, y Ángulo trigonométrico, M1): el
        // coeficiente de π («8π/3 = 2,67π»: si π queda escrita, la fracción también) y el paso de una unidad de ángulo a
        // otra («5° = 5,56ᵍ»). Van con «≈» o exactos.
        if (mejor.redondeo) {
          const piDecimal = ts => suelto(ts) && ts.some(x => x.t === 'pi') && ts.some(x => x.t === 'num' && x.dec > 0);
          const conversion = gA.size && gB.size && [...gA][0] !== [...gB][0] && suelto(A) && suelto(B);
          if (piDecimal(B) || (suelto(A) && piDecimal(A)) || conversion) Object.assign(mejor, { falsa: true, redondeo: false, porRedondeo: piDecimal(B) || piDecimal(A) ? 'pi' : 'angulo' });
        }
        // La cuenta de la izquierda con un número redondeado (5 · 1,73 = 8,66, con 1,73 por √3): cuadraría con «≈».
        if (mejor.falsa && !mejor.porRedondeo && !suelto(A) && Math.abs(mejor.a - mejor.b) <= (mejor.tol + holgura(A, mejor.modo) * fA) * (1 + 1e-9)) mejor.porEntrada = A.filter(x => x.t === 'num' && x.dec > 0).map(x => s.slice(x.i, x.fin));
        // Un factor de 10, 100, 1000… (con un 1 % de holgura) y unidades de por medio es un cambio de prefijo (0,368 mm/s
        // calculado en m/s): no se sabe en qué unidad va la cuenta.
        if (mejor.falsa && (uA.size || uB.size || (despues && despues.t === 'pal' && j + 1 === u)) && porPotenciaDe10(mejor.a, mejor.b, Math.max(mejor.tol, 0.01 * Math.abs(mejor.b)))) continue;
        out.push(Object.assign({ texto: s.slice(A[0].i, B[B.length - 1].fin).trim(), desde: A[0].i, hasta: B[B.length - 1].fin }, mejor));
      }
    }
    // «2² = 4 · 3² = 9 · 5² = 25»: el punto medio separa una lista de igualdades. Si leyéndolo así todas se cumplen,
    // las que fallaban no cuentan.
    if (!puntoSepara && out.some(h => h.falsa)) {
      const otra = igualdadesDe(s, true);
      return out.filter(h => {
        if (!h.falsa) return true;
        const dentro = otra.filter(o => o.desde < h.hasta && h.desde < o.hasta);
        return dentro.length < 2 || dentro.some(o => o.falsa);
      });
    }
    return out;
  }

  // El texto de una igualdad para el mensaje, como se ve: 8/3 y no ((8)/(3)), π² y no π^(2).
  const SUP_DE = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '-': '⁻' };
  function legible(s) {
    let t = String(s), antes;
    do { antes = t; t = t.replace(/\(\(([^()]*)\)\/\(([^()]*)\)\)/g, (m, a, b) => `${/[\s+−]/.test(a) ? `(${a})` : a}/${/[\s+−·]/.test(b) ? `(${b})` : b}`); } while (t !== antes);
    return t.replace(/\^\(([−-]?\d+)\)/g, (m, e) => [...e].map(c => SUP_DE[c]).join('')).replace(/\[3\]√/g, '∛').replace(/\[2\]√/g, '√').replace(/‖\(([^()]*)\)/g, '|$1|').replace(/¤/g, '…');
  }
  // Un número para el mensaje: coma decimal, hasta seis cifras.
  const numTxt = v => String(Number(v.toPrecision(6))).replace('-', '−').replace('.', ',');

  // El mensaje de una igualdad falsa, según de dónde sale el desajuste.
  function mensajeIgualdad(h) {
    const t = `«${legible(h.texto)}»`;
    if (h.porRedondeo === 'pi') return `${t} redondea con «=» el número que acompaña a π: con π escrita va la fracción exacta (8π/3, no 2,67π); si no, «≈»`;
    if (h.porRedondeo === 'angulo') return `${t} pasa de una unidad de ángulo a otra redondeando: con «=» va el valor exacto; si no, «≈»`;
    if (h.porEntrada) return `${t} no se cumple con los números que se ven: la cuenta da ${numTxt(h.va)}. ${h.porEntrada.join(', ')} ${h.porEntrada.length > 1 ? 'están redondeados' : 'está redondeado'}: escribe «≈» o haz la cuenta con lo que se muestra`;
    return `${t} no se cumple tal como se lee: la izquierda da ${numTxt(h.va)} y la derecha, ${numTxt(h.vb)}`;
  }
  // Las igualdades falsas de cada texto ya leído: las semillas y los casos del juego repiten muchos textos.
  const MEMO_IG = new Map();
  // Junta las igualdades falsas de muchos textos y las da por sitio (la semilla o el caso del juego no separan): una
  // línea por sitio, con el primer caso y cuántas igualdades falsas más hay ahí.
  function juntaIgualdades() {
    const sitios = new Map(), vistas = new Set();
    return {
      leer(donde, x) {
        if (x === undefined || x === null || x === false) return;
        const s = textoCuenta(x);
        if (!s.includes('=')) return;
        const sitio = donde.replace(/ (?:semilla \d+|caso \{.*\})$/, '');
        if (!MEMO_IG.has(s)) { if (MEMO_IG.size > 50000) MEMO_IG.clear(); MEMO_IG.set(s, igualdadesDe(s).filter(h => h.falsa)); }
        for (const h of MEMO_IG.get(s)) {
          if (vistas.has(`${sitio}|${h.texto}`)) continue;
          vistas.add(`${sitio}|${h.texto}`);
          if (sitios.has(sitio)) sitios.get(sitio).mas++;
          else sitios.set(sitio, { donde, h, mas: 0 });
        }
      },
      informar(mal) {
        for (const { donde, h, mas } of sitios.values()) mal(donde, `${mensajeIgualdad(h)}${mas ? ` (y ${mas} igualdad${mas > 1 ? 'es' : ''} falsa${mas > 1 ? 's' : ''} más en el mismo sitio)` : ''}`);
      },
    };
  }
  // Lo que se lee en el juego (o en una mesa del laboratorio): su lectura en cada caso de la grilla (hasta 3000 casos;
  // si son más, uno de cada tantos, parejo), sin repetir textos.
  function lecturasDe(J, leer, donde, T) {
    if (!J || typeof J.lectura !== 'function') return;
    let g = [];
    try { g = T.grilla(J.controles || []); } catch (e) { return; }
    const paso = Math.max(1, Math.ceil(g.length / 3000)), vistas = new Set();
    for (let i = 0; i < g.length; i += paso) {
      let l;
      try { l = J.lectura(g[i]); } catch (e) { continue; }
      const k = textoCuenta(l);
      if (vistas.has(k)) continue;
      vistas.add(k);
      leer(`${donde} caso ${JSON.stringify(g[i])}`, l);
    }
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
        // Con alternativas: cuál es la correcta y si el resuelto explica las demás. Una alternativa se nombra por su
        // letra o por su valor: donde la figura tiene puntos A, B, C, ningún resuelto nombra una alternativa por su
        // letra (Gerson, docs/etapa3/decisiones.md, «Letras de las alternativas»).
        if (Array.isArray(e.alternativas) && e.alternativas.length >= 2) {
          const alts = e.alternativas.map(a => limpio(liso(a)).trim()), L = 'ABCDE'.slice(0, alts.length);
          const dentro = (txt, a) => norma(a).length > 0 && ` ${norma(txt)} `.includes(` ${norma(a)} `);
          // Las alternativas que un texto escribe; si una está dentro de otra («8» en «8 m»), cuenta la más larga.
          const escritas = txt => { const c = alts.map((a, k) => k).filter(k => dentro(txt, alts[k])); return c.filter(k => !c.some(q => q !== k && norma(alts[q]).includes(norma(alts[k])) && norma(alts[q]) !== norma(alts[k]))); };
          // La letra, como la escribe un resuelto: sola y seguida de coma, dos puntos, punto o paréntesis («B, 8 m»,
          // «C: Carla es obstetra»). «C = 40 N» o «AC = 17 cm» empiezan por una letra de la figura, no por la de una alternativa.
          const m = /^\s*([A-E])\s*(?:[,:.)]|$)/u.exec(resp);
          let idx = -1;
          if (m && L.includes(m[1])) {
            idx = L.indexOf(m[1]);
            const resto = resp.slice(m[0].length), otra = escritas(resto).find(k => k !== idx && !norma(alts[idx]).includes(norma(alts[k])));
            if (!dentro(resto, alts[idx]) && otra !== undefined) mal('respuesta-letra', de, `la respuesta dice ${m[1]} y escribe «${alts[otra]}», que es la alternativa ${L[otra]} (la ${m[1]} es «${alts[idx]}»)`);
          } else {
            // Sin letra: la respuesta escribe el valor de una sola alternativa (su texto o, si no, sus números).
            let c = escritas(resp);
            if (!c.length) {
              const fs = fichas(e.respuesta), nR = nums((fs.length ? fs.map(x => x.t) : [resp]).join(' · '));
              c = alts.map((a, k) => k).filter(k => { const nA = nums(alts[k]); return nA.size > 0 && nA.size === nR.size && [...nA].every(n => nR.has(n)); });
            }
            if (c.length !== 1) { mal('respuesta-letra', de, `la respuesta («${resp}») no dice cuál es su alternativa: empieza por su letra (${L[0]} a ${L[L.length - 1]}) o escribe su valor tal como está en la lista${c.length > 1 ? ` (aquí calzan ${c.map(k => L[k]).join(' y ')})` : ''}`); return; }
            idx = c[0];
          }
          const letra = L[idx];
          letrasEj.push({ letra, n: alts.length, nivel: e.nivel, donde: de });
          // alternativa-sin-explicar: el resuelto nombra cada incorrecta, por su letra o por su valor (su texto o sus números).
          const sol = limpio((e.solucion || []).map(x => `${liso(x && x.texto)} ${liso((x && x.ecuacion) || '')}`).join(' · ')), nSol = nums(sol);
          const porLetra = x => new RegExp(`(?<![\\p{L}\\p{N}_])${x}(?![\\p{L}\\p{N}_⃗])`, 'u').test(sol);
          const porValor = a => dentro(sol, a) || (nums(a).size > 0 && [...nums(a)].every(n => nSol.has(n)));
          const faltan = [...L].filter((x, k) => k !== idx && !porLetra(x) && !porValor(alts[k]));
          // «Las demás…», «las otras cuatro…»: el resuelto las despacha juntas.
          const juntas = /\b(?:las|los) (?:dem[aá]s|otras|otros)\b|\bel resto\b|\bninguna otra\b/i.test(sol);
          if (faltan.length && !juntas) mal('alternativa-sin-explicar', de, `el resuelto no nombra ${faltan.length > 1 ? 'las alternativas' : 'la alternativa'} ${faltan.map(x => `${x} («${alts[L.indexOf(x)]}»)`).join(', ')}, ni por su letra ni por su valor: di de qué error sale cada una`);
        }
      });

      // «Ahora tú»: la letra en que la app deja la correcta (T.ordenAhoraTu con la idea y la semilla, app/teoria.js).
      for (const [s, c] of casosAT) {
        const ops = T.ordenAhoraTu(c.opciones, idea.id, s), i = ops.findIndex(x => x && x.correcta);
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

      // --- igualdad-falsa: toda igualdad entre números que ve el alumno se cumple ---
      // Lee, el juego (consigna, voz, misión, leyenda y la lectura en toda su grilla), Predice con sus siFuera, Mira, la
      // regla, los ejemplos (enunciado, datos, alternativas, resuelto y respuesta), y «Así se resuelve» y «Ahora tú» en
      // las semillas del validador (opciones, siFuera y solución).
      const ig = juntaIgualdades(), leer = ig.leer;
      ((idea.lee && idea.lee.tarjetas) || []).forEach((t, i) => { if (t) { leer(`${d} Lee tarjeta ${i + 1}`, t.texto); leer(`${d} Lee tarjeta ${i + 1}`, t.ecuacion); } });
      leer(`${d} juega`, J.consigna); leer(`${d} juega`, J.voz);
      if (J.mision) ['texto', 'bien', 'pista'].forEach(k => leer(`${d} misión`, J.mision[k]));
      (J.leyenda || []).forEach(x => x && leer(`${d} juega leyenda`, x.t));
      lecturasDe(J, leer, `${d} juega lectura`, T);
      if (P) {
        leer(`${d} predice`, P.pregunta);
        (P.datos || []).forEach(x => leer(`${d} predice datos`, x));
        (P.opciones || []).forEach(x => { if (x) { leer(`${d} predice opción`, x.texto); leer(`${d} predice siFuera`, x.siFuera); } });
        leer(`${d} predice`, P.coincide); leer(`${d} predice`, P.noCoincide);
      }
      ((idea.mira && idea.mira.pasos) || []).forEach((p, i) => { if (p) { leer(`${d} Mira paso ${i + 1}`, p.texto); leer(`${d} Mira paso ${i + 1}`, p.ecuacion); } });
      if (idea.regla) ['texto', 'ecuacion', 'condicion'].forEach(k => leer(`${d} regla`, idea.regla[k]));
      ejemplos.forEach((e, i) => {
        const de = `${d} ejemplo ${i + 1}`;
        leer(de, e.enunciado);
        (e.datos || []).forEach(x => leer(`${de} datos`, x));
        (Array.isArray(e.alternativas) ? e.alternativas : []).forEach(x => leer(`${de} alternativas`, x));
        (e.solucion || []).forEach(p => { if (p) { leer(`${de} resuelto`, p.texto); leer(`${de} resuelto`, p.ecuacion); } });
        leer(`${de} respuesta`, e.respuesta);
      });
      const resueltos = casosR.slice();
      if (idea.resuelve && typeof idea.resuelve.generar === 'function') for (let s = 12; s < N; s++) { try { const c = idea.resuelve.generar(s); if (c && c.enunciado) resueltos.push([s, c]); } catch (e) { /* lo dice el validador */ } }
      for (const [s, c] of resueltos) {
        const de = `${d} resuelve semilla ${s}`;
        leer(de, c.enunciado); (c.datos || []).forEach(x => leer(de, x));
        (c.pasos || []).forEach(p => { if (p) { leer(de, p.texto); leer(de, p.ecuacion); } });
        leer(de, c.respuesta);
      }
      for (const [s, c] of casosAT) {
        const de = `${d} ahoraTu semilla ${s}`;
        leer(de, c.pregunta); (c.datos || []).forEach(x => leer(de, x));
        c.opciones.forEach(x => { if (x) { leer(de, x.texto); leer(de, x.siFuera); } });
        if (c.solucion) { leer(de, c.solucion.texto); leer(de, c.solucion.ecuacion); }
      }
      ig.informar((donde, que) => mal('igualdad-falsa', donde, que));
    });

    // igualdad-falsa en lo que es de toda la unidad: el glosario y las mesas del laboratorio (sus retos y su lectura).
    const igU = juntaIgualdades();
    for (const g of def.glosario || []) {
      if (!g) continue;
      const dg = `${def.unidad} glosario «${g.termino}»`;
      igU.leer(dg, g.def); igU.leer(dg, g.simple);
      (Glosario ? Glosario.ejemplosDe(g) : g.ejemplos || []).forEach(x => igU.leer(dg, x));
    }
    for (const m of def.laboratorio || []) {
      if (!m) continue;
      const dm = `${def.unidad} mesa ${m.id}`;
      igU.leer(dm, m.consigna); igU.leer(dm, m.voz);
      (m.invitaciones || []).forEach(x => { if (x) { igU.leer(`${dm} reto`, x.texto); igU.leer(`${dm} reto`, x.bien); } });
      lecturasDe(m, igU.leer, `${dm} lectura`, T);
    }
    igU.informar((donde, que) => out.push({ regla: 'igualdad-falsa', idea: '', donde, que }));

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

  return { REGLAS, EXCEPCIONES, revisar, aplicar, sobran, letrasDeRequiere, liso, preparar, simbolosDe, definido, clavesDe, escala, igualdadesDe, textoCuenta };
});
