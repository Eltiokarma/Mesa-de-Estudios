/*
 * Generador «Poca masa, muchísima energía»: práctica de la idea 5 de «Materia y energía» (quimica.materia-y-energia;
 * contenido/teoria/quimica/materia-y-energia.js, idea «masa-energia»). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['masa-energia']) y en Node (require). No usa ningún motor de escena:
 * E = Δm · c² con c = 3 × 10⁸ m/s (valor de academia; NIST: 299 792 458 m/s), la masa en kg y la energía en J.
 * Solo E = Δm · c² (decisión de Gerson, 17 nov 2026: la vida media se practica aparte, en plantillas/vida-media/).
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   energia    (1) desaparecen unos mg o g: ¿cuánta energía sale?
 *   masa       (2) sale una energía: ¿cuántos gramos desaparecieron?
 *   que-masa   (2) en un reactor nuclear o en el Sol: ¿qué masa va en la fórmula? (la que falta, no toda)
 *   defecto    (3) la masa antes y después de una reacción nuclear: ¿cuánta energía sale?
 *   balones    (3) unos mg que desaparecen: ¿a cuántos balones de gas equivale la energía?
 * _datos: energia { tipo, nivel, x, u: 'mg'|'g' }; masa { tipo, nivel, E (J) }; que-masa { tipo, nivel, caso, antes, despues
 *   (g) }; defecto { tipo, nivel, antes, despues (g) }; balones { tipo, nivel, mg }.
 * Respuestas: un número (J, g o balones, este redondeado a la unidad); que-masa, 'masa:falta|toda|queda|nada'.
 *
 * Colores: un color fijo por magnitud, el de la teoría (docs/molde-unidad.md §5b; tabla COLOR, que compara
 * plantillas/materia-energia/colores.test.js; auditoría M1): Δm y toda masa, naranja (o), también cuando se pide; c y
 * c², turquesa (i); E, violeta (f), la den o la pidan; la energía de un balón, verde (d); el número de balones, carmín
 * (h). Sin figura. El reactor va sin «uranio que se fisiona»: la fisión no se enseña en esta unidad (auditoría, M5).
 * Datos (docs/plan-calidad.md §3, punto 13): E = Δm · c², c = 3 × 10⁸ m/s, las equivalencias de masa de una en una, la
 * regla de las potencias de 10 y, en los balones, «unos 4,6 × 10⁸ J» por balón de 10 kg (valor de libro: unos 46 MJ
 * por kg de gas). Nunca c² ya elevado: elevar es parte del ejercicio.
 * Errores: los de la teoría QM-TODA-MASA, QM-MASA-IGUAL (Taber y Riggs 2023, sin cifra; informe de materia), y los
 *   nuevos QM-MASA-QUEDA (usa la masa que queda), QM-C2-SOLO-POTENCIA ((3 × 10⁸)² como 3 × 10¹⁶) y QM-C2-DOBLE
 *   ((3 × 10⁸)² como 6 × 10¹⁶), hipótesis; trampas QU1 (masa sin pasar a kg, o pasada de más), de
 *   docs/investigacion/unidades-ideas-erroneas.md. Los errores de c sin elevar (3 × 10⁸ veces menos) y de toda la masa
 *   (cientos de veces más) quedan fuera de las alternativas numéricas por la escala; toda la masa se practica en que-masa.
 * Escala: un distractor va de 1/20 a 20 veces la correcta; las trampas QU, hasta 1000.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'masa-energia';
  const FUN = 'docs/investigacion/unidades-ideas-erroneas.md';
  const FMA = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const err = (id, explicacion) => ({ id, explicacion, respaldo: 'hipotesis', fuente: P.esUnidades(id) ? FUN : /TODA-MASA|MASA-IGUAL/.test(id) ? FMA : null });
  const e = (valor, id, explicacion) => ({ valor, ...err(id, explicacion) });
  const v = P.v;
  const C2 = 9e16, BALON = 4.6e8; // c² = (3 × 10⁸)², en m²/s²; un balón, en J
  const limpio = x => Number(x.toPrecision(12));
  const f = (x, d = 2) => P.formatear(limpio(x), d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  // Notación científica con superíndices; entre 0,01 y 10 000, el número tal cual (3 g, no 3 × 10⁰ g).
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x) {
    if (x >= 0.01 && x < 1e4) return f(x, 3);
    let k = Math.floor(Math.log10(x) + 1e-9), m = Math.round(x / 10 ** k * 100) / 100;
    if (m >= 10) { m /= 10; k += 1; }
    return `${f(m, 2)} × 10${String(k).split('').map(c => SUP[c]).join('')}`;
  }
  const DEF_E = 'E = Δm · c², con Δm en kg y E en joules (J)';
  const DEF_C = 'c = 3 × 10⁸ m/s, la rapidez de la luz';
  const DEF_POT = 'Potencias de 10: (10ᵃ)² = 10²ᵃ y al multiplicar se suman los exponentes';
  const DEF_DM = 'Δm: la masa antes menos la masa después';
  const EQ = { mg: '1 kg = 1 000 000 mg', g: '1 kg = 1000 g' };
  // Un color fijo por magnitud (docs/molde-unidad.md §5b): la tabla de la unidad, copia de `colores` de la teoría
  // (contenido/teoria/quimica/materia-y-energia.js). La práctica carga solo este archivo, así que la tabla va copiada;
  // plantillas/materia-energia/colores.test.js comprueba que coincida. Cada variable dice su magnitud (`mag`).
  const COLOR = { masa: 'o', volumen: 'i', longitud: 'i', densidad: 'f', calor: 'f', 'por gramo': 'i', temperatura: 'd', energía: 'f', luz: 'i',
    'energía de un balón': 'd', balones: 'h', tiempo: 'i', 'vida media': 'f', 'vidas medias': 'h', factor: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });
  const VARS_E = { dm: va('masa que desaparece', 'masa'), c2: va('c al cuadrado', 'luz'), x: va('energía (lo que se pide)', 'energía') };

  function numericas(rng, correcta, errores, texto) {
    const ok = errores.filter(x => Number.isFinite(x.valor) && x.valor > 0 && x.valor !== correcta && P.enEscala(x.valor, correcta, x.id));
    return P.armar({ correcta, errores: ok, rng, texto });
  }
  const J = x => `${cien(x)} J`;
  // Los dos errores al elevar c: solo la potencia (3 × 10¹⁶) o el 3 por 2 (6 × 10¹⁶).
  const erroresC2 = (kg, unidad = J, conv = x => x) => [
    e(conv(kg * 3e16), 'QM-C2-SOLO-POTENCIA', `Bien la masa en kg. Pero al elevar 3 × 10⁸ se eleva también el 3: es 9 × 10¹⁶, no 3 × 10¹⁶. Así sale ${unidad(conv(kg * 3e16))}.`),
    e(conv(kg * 6e16), 'QM-C2-DOBLE', `Bien la masa en kg. Pero elevar al cuadrado es 3 × 3 = 9, no 3 × 2: c² = 9 × 10¹⁶. Así sale ${unidad(conv(kg * 6e16))}.`),
  ];

  // ---- energia ----
  // Masas cuya energía tiene mantisa de 3,6 a 8,1: así 3 × 10¹⁶ y 6 × 10¹⁶ no corren la potencia y ninguna alternativa
  // se distingue por su forma (nucleo/probar-generador.js, probarFugas).
  const MASAS = [[4, 'mg'], [5, 'mg'], [6, 'mg'], [40, 'mg'], [70, 'mg'], [0.5, 'g'], [0.8, 'g'], [6, 'g'], [9, 'g']];
  function tEnergia(rng) {
    const [x, u] = rng.elegir(MASAS), kg = limpio(u === 'mg' ? x / 1e6 : x / 1e3), E = limpio(kg * C2);
    const errores = [
      e(kg * 1000 * C2, 'QU1-' + (u === 'mg' ? 'mg-como-g' : 'g-como-kg'), `Bien multiplicar por c² = 9 × 10¹⁶. Pero ${u === 'mg' ? `${f(x)} mg son ${cien(kg)} kg: dividiste entre 1000 una sola vez` : `${f(x)} g no son ${f(x)} kg`}. Así sale ${J(kg * 1000 * C2)}.`),
      e(kg / 1000 * C2, 'QU1-pasa-de-mas', `Bien multiplicar por c². Pero pasaste a kg de más: ${f(x)} ${u} son ${cien(kg)} kg. Así sale ${J(kg / 1000 * C2)}.`),
      ...erroresC2(kg),
      e(kg * 1000 * 3e16, 'QU1-' + (u === 'mg' ? 'mg-como-g' : 'g-como-kg'), `Bien la fórmula. Pero hay dos tropiezos: ${f(x)} ${u} son ${cien(kg)} kg, y c² es 9 × 10¹⁶, no 3 × 10¹⁶. Así sale ${J(kg * 1000 * 3e16)}.`),
    ];
    return {
      variables: VARS_E, enunciado: ['En un proceso nuclear desaparecen ', v('dm', `${f(x)} ${u}`), ' de masa.'],
      pregunta: ['¿Cuánta ', v('x', 'energía'), ' sale?'], datos: [DEF_E, DEF_C, EQ[u], DEF_POT],
      alternativas: numericas(rng, E, [0, 2, 4, 3, 1].map(i => errores[i]), J), respuesta: { valor: E, unidad: 'J' },
      solucion: [
        ['La masa en kg: ', v('dm', `${f(x)} ${u}`), ` = ${cien(kg)} kg.`],
        ['c² = (3 × 10⁸)² = ', v('c2', '9 × 10¹⁶ m²/s²'), ': se eleva el 3 y también la potencia.'],
        ['E = ', v('dm', cien(kg)), ' · ', v('c2', '9 × 10¹⁶'), ' = ', v('x', J(E)), '.'],
      ],
      _datos: { tipo: 'energia', nivel: 1, x, u },
    };
  }

  // ---- masa: de la energía a los gramos ----
  const ENERGIAS = [9e10, 4.5e13, 1.8e12, 2.7e14, 9e13, 1.8e14, 3.6e13];
  function tMasa(rng) {
    const E = rng.elegir(ENERGIAS), kg = limpio(E / C2), g = limpio(kg * 1000);
    const G = x => `${cien(x)} g`;
    const errores = [
      e(kg, 'QU1-kg-como-g', `Bien dividir entre c² = 9 × 10¹⁶. Pero eso sale en kg; falta pasarlo a gramos. Así queda ${G(kg)}.`),
      e(g * 1000, 'QU1-g-como-mg', `Bien dividir entre c². Pero ${cien(kg)} kg son ${G(g)}: multiplicaste por 1000 dos veces. Así queda ${G(g * 1000)}.`),
      e(E / 3e16 * 1000, 'QM-C2-SOLO-POTENCIA', `Bien despejar Δm = E / c². Pero c² es 9 × 10¹⁶, no 3 × 10¹⁶: también se eleva el 3. Así queda ${G(E / 3e16 * 1000)}.`),
      e(E / 6e16 * 1000, 'QM-C2-DOBLE', `Bien despejar Δm = E / c². Pero 3² es 9, no 6: c² = 9 × 10¹⁶. Así queda ${G(E / 6e16 * 1000)}.`),
      e(E / 3e16, 'QU1-kg-como-g', `Bien despejar Δm = E / c². Pero hay dos tropiezos: c² es 9 × 10¹⁶, no 3 × 10¹⁶, y el resultado sale en kg. Así queda ${G(E / 3e16)}.`),
    ];
    return {
      variables: { E: va('energía que sale', 'energía'), x: va('masa que desapareció (lo que se pide)', 'masa') },
      enunciado: ['Un reactor nuclear libera ', v('E', J(E)), '.'], pregunta: ['¿Cuántos ', v('x', 'gramos de masa'), ' desaparecieron?'],
      datos: [DEF_E, DEF_C, '1 kg = 1000 g', DEF_POT],
      alternativas: numericas(rng, g, [0, 2, 4, 3, 1].map(i => errores[i]), G), respuesta: { valor: g, unidad: 'g' },
      solucion: [
        ['De E = Δm · c² se despeja la masa: Δm = E / c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'],
        ['Δm = ', v('E', cien(E)), ` ÷ 9 × 10¹⁶ = ${cien(kg)} kg.`],
        ['A gramos: ', `${cien(kg)} · 1000 = `, v('x', G(g)), '.'],
      ],
      _datos: { tipo: 'masa', nivel: 2, E },
    };
  }

  // ---- que-masa: la que falta, no toda ----
  const CASOS = {
    uranio: { texto: (a, d) => `En un reactor nuclear, el combustible pasa de ${f(a)} g a ${f(d)} g.`, de: 'el combustible', pares: [[1000, 999.1], [2000, 1998.2], [500, 499.55]] },
    sol: { texto: (a, d) => `En el Sol, núcleos de hidrógeno con ${f(a, 4)} g forman núcleos de helio con ${f(d, 4)} g.`, de: 'el hidrógeno', pares: [[4.0312, 4.0026], [8.0624, 8.0052]] },
  };
  function tQueMasa(rng) {
    const caso = rng.elegir(Object.keys(CASOS)), k = CASOS[caso], [antes, despues] = rng.elegir(k.pares), falta = limpio(antes - despues);
    const d4 = x => f(x, 4);
    const T = {
      falta: `La que falta: ${d4(falta)} g`, toda: `Toda la de antes: ${d4(antes)} g`, queda: `La que queda: ${d4(despues)} g`, nada: 'Ninguna: la masa no cambia',
    };
    const errores = [
      { clave: 'masa:toda', texto: T.toda, ...err('QM-TODA-MASA', `Bien: la masa y la energía están ligadas. Pero solo la masa que falta se volvió energía; casi toda sigue ahí.`) },
      { clave: 'masa:queda', texto: T.queda, ...err('QM-MASA-QUEDA', 'Bien buscar una masa en la reacción. Pero la que queda no se volvió energía: se usa la diferencia.') },
      { clave: 'masa:nada', texto: T.nada, ...err('QM-MASA-IGUAL', 'Bien: en lo químico, la masa casi no cambia. Pero aquí antes y después hay masas distintas: falta un poco.') },
    ];
    return {
      variables: { x: va('la masa que va en la fórmula (lo que se pide)', 'masa') },
      enunciado: [k.texto(antes, despues)], pregunta: ['¿Qué ', v('x', 'masa'), ' se usa en E = Δm · c² para calcular la energía que sale?'],
      datos: [DEF_E, DEF_DM],
      alternativas: P.armarTexto({ correcta: { clave: 'masa:falta', texto: T.falta }, errores, rng }),
      respuesta: { valor: 'masa:falta', texto: T.falta, unidad: '' },
      solucion: [
        ['Δm es la masa que desaparece: antes menos después.'],
        [`Δm = ${d4(antes)} − ${d4(despues)} = ${d4(falta)} g.`],
        [`Solo esos ${d4(falta)} g salen como energía; el resto sigue ahí, como ${caso === 'sol' ? 'helio' : 'lo que queda del combustible'}.`],
      ],
      _datos: { tipo: 'que-masa', nivel: 2, caso, antes, despues },
    };
  }

  // ---- defecto: antes y después ----
  const DEFECTOS = [[4.0312, 4.0026], [8.0624, 8.0052], [2000, 1995], [1000, 999.4], [10, 9.993], [500, 499.2]];
  function tDefecto(rng) {
    const [antes, despues] = rng.elegir(DEFECTOS), dg = limpio(antes - despues), kg = limpio(dg / 1000), E = limpio(kg * C2);
    const errores = [
      e(dg * C2, 'QU1-g-como-kg', `Bien la masa que falta, ${f(dg, 4)} g. Pero va en kg: ${f(dg, 4)} g son ${cien(kg)} kg. Así sale ${J(dg * C2)}.`),
      e(kg / 1000 * C2, 'QU1-pasa-de-mas', `Bien la masa que falta. Pero pasaste a kg de más: ${f(dg, 4)} g son ${cien(kg)} kg. Así sale ${J(kg / 1000 * C2)}.`),
      ...erroresC2(kg),
      e(dg * 3e16, 'QU1-g-como-kg', `Bien la masa que falta. Pero hay dos tropiezos: ${f(dg, 4)} g son ${cien(kg)} kg, y c² es 9 × 10¹⁶, no 3 × 10¹⁶. Así sale ${J(dg * 3e16)}.`),
    ];
    return {
      variables: VARS_E, enunciado: [`En una reacción nuclear, la masa pasa de ${f(antes, 4)} g a ${f(despues, 4)} g.`],
      pregunta: ['¿Cuánta ', v('x', 'energía'), ' se libera?'], datos: [DEF_E, DEF_DM, DEF_C, '1 kg = 1000 g', DEF_POT],
      alternativas: numericas(rng, E, [0, 2, 4, 3, 1].map(i => errores[i]), J), respuesta: { valor: E, unidad: 'J' },
      solucion: [
        ['Solo la masa que falta se vuelve energía: ', v('dm', `Δm = ${f(antes, 4)} − ${f(despues, 4)} = ${f(dg, 4)} g = ${cien(kg)} kg`), '.'],
        ['c² = (3 × 10⁸)² = ', v('c2', '9 × 10¹⁶'), '.'],
        ['E = ', v('dm', cien(kg)), ' · ', v('c2', '9 × 10¹⁶'), ' = ', v('x', J(E)), '.'],
      ],
      _datos: { tipo: 'defecto', nivel: 3, antes, despues },
    };
  }

  // ---- balones de gas ----
  function tBalones(rng) {
    const mg = rng.elegir([1, 2, 5, 10, 20, 50]), kg = mg / 1e6, E = limpio(kg * C2), n = Math.round(E / BALON);
    const B = x => `${f(x, 0)} balones`;
    const errores = [
      e(Math.round(E * 1000 / BALON), 'QU1-mg-como-g', `Bien dividir entre la energía de un balón. Pero ${mg} mg son ${cien(kg)} kg: falta un factor 1000. Así salen ${B(Math.round(E * 1000 / BALON))}.`),
      e(Math.round(E / 1000 / BALON), 'QU1-pasa-de-mas', `Bien dividir entre la energía de un balón. Pero ${mg} mg son ${cien(kg)} kg: pasaste de más. Así salen ${B(Math.round(E / 1000 / BALON))}.`),
      ...erroresC2(kg, B, x => Math.round(x / BALON)),
    ];
    return {
      variables: { dm: va('masa que desaparece', 'masa'), b: va('energía de un balón', 'energía de un balón'), x: va('cuántos balones (lo que se pide)', 'balones') },
      enunciado: ['En un proceso nuclear desaparecen ', v('dm', `${mg} mg`), ' de masa.'],
      pregunta: ['¿A ', v('x', 'cuántos balones de gas'), ' equivale la energía que sale? Redondea a la unidad.'],
      datos: [DEF_E, DEF_C, EQ.mg, 'Un balón de gas de 10 kg da unos 4,6 × 10⁸ J al quemarse'],
      alternativas: numericas(rng, n, errores.filter(x => x.valor >= 1), B), respuesta: { valor: n, unidad: 'balones' },
      solucion: [
        ['La masa en kg: ', v('dm', `${mg} mg`), ` = ${cien(kg)} kg; c² = 9 × 10¹⁶.`],
        [`E = ${cien(kg)} · 9 × 10¹⁶ = ${J(E)}.`],
        ['Entre la de un balón: ', `${cien(E)} ÷ `, v('b', '4,6 × 10⁸'), ` ≈ `, v('x', B(n)), '.'],
      ],
      _datos: { tipo: 'balones', nivel: 3, mg },
    };
  }

  const TIPOS = ['energia', 'energia', 'energia', 'masa', 'masa', 'que-masa', 'que-masa', 'defecto', 'defecto', 'balones', 'balones'];
  const NIVEL = { energia: 1, masa: 2, 'que-masa': 2, defecto: 3, balones: 3 };
  const CONSTRUIR = { energia: tEnergia, masa: tMasa, 'que-masa': tQueMasa, defecto: tDefecto, balones: tBalones };
  const PAPEL = { 'papel-1': 'energia', 'papel-2': 'energia', 'papel-3': 'masa', 'papel-4': 'que-masa', 'papel-5': 'masa',
    'papel-6': 'que-masa', 'papel-7': 'defecto', 'papel-8': 'balones' };
  const escaparRe = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fuga = (pr, c) => typeof pr.respuesta.valor === 'number' && new RegExp(`(^|[^\\d,])${escaparRe(c.split(' ')[0])}(?![\\d,])`).test(pr.datos.join('\n'));

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = PAPEL[String(semilla)] || rng.elegir(TIPOS);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (pr && pr.alternativas.length >= 4 && !fuga(pr, pr.alternativas.find(a => a.correcta).texto)) {
        return { id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
          alternativas: pr.alternativas, solucion: pr.solucion, respuesta: pr.respuesta, _datos: pr._datos };
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Poca masa, muchísima energía', generar, NIVEL, cien, COLOR };
});
