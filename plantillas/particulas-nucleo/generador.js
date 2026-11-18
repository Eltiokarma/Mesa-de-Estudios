/*
 * Generador «El núcleo y sus vecinos»: práctica de la idea 1 de «Estructura atómica» (quimica.estructura-atomica;
 * contenido/teoria/quimica/estructura-atomica.js, idea «nucleo-identidad»: partículas, isótopos e iones). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['particulas-nucleo']) y en Node
 * (require). No usa ningún motor: las cuentas son las de la regla de la idea, escritas aquí aparte (A = Z + N;
 * carga = Z − e⁻; isótopos: mismo Z; isóbaros: mismo A; isótonos: mismo N; isoelectrónicos: los mismos electrones).
 * Los otros dos tipos de la idea 1 (partículas de un ion con su A y el ion del cuerpo con su configuración) están en
 * plantillas/configuracion-ubicacion/ (tipos `particulas` y `atomo-ion`).
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   donde          (1) dónde está cada partícula (San Marcos 2020-I). sub 'particula': por su carga o su masa, ¿qué
 *                  partícula es y dónde está? · sub 'correcta' / 'incorrecta': una afirmación sobre dónde están y por
 *                  qué el átomo es neutro.
 *   nuclidos       (2) sub 'que-son': ¿son isótopos, isóbaros, isótonos o nada? · sub 'isotopos': dos isótopos neutros,
 *                  ¿qué tienen igual? o ¿cómo reaccionan? (San Marcos 2022).
 *   isoelectronico (2) el ion X con carga es isoelectrónico con un ion conocido: sub 'z', ¿cuál es el Z de X? · sub
 *                  'elemento' (3), ¿qué elemento es X? (el nivel examen de la idea: «X³⁻ es isoelectrónico con el Ca²⁺»).
 *   vecinos        (3) dos núclidos reales: sub 'isobaros', ¿cuántos neutrones tiene el isóbaro? · 'isotonos', ¿cuál es
 *                  el A del isótono? · 'isotopos', ¿cuántos neutrones tiene el otro isótopo?
 *   masa-ion       (3) un ion con su carga, sus electrones y sus neutrones: ¿cuál es su número de masa?
 * _datos: donde { tipo, nivel, sub, ids (las afirmaciones o la descripción, en el orden en que se eligieron; la primera
 *   es la respuesta) }; nuclidos { …, sub, a: [Z, A], b: [Z, A], pide? ('igual' | 'reacciona') }; isoelectronico { …, sub,
 *   x: carga de X, y: [Z, carga] }; vecinos { …, sub, a: [Z, A], b: [Z, A] } (se da a y el Z de b); masa-ion { …, Z, A,
 *   carga }. Respuestas: un número (Z, neutrones o A) o una clave de texto: 'donde:<id>', 'nuc:isotopos|isobaros|
 *   isotonos|nada', 'iso:igual:<id>', 'el:<Z>'.
 * Núclidos: todos existen (estables o radiactivos conocidos, como el carbono-14 o el cobalto-60); ninguno inventado.
 * Notación (propuesta §7): ²³Na⁺ con A arriba a la izquierda y la carga arriba a la derecha; N son los neutrones (A =
 * Z + N), así que el nitrógeno va por su nombre o con su número de masa (¹⁴N), nunca como «N» suelto.
 * Colores (molde §5b; la tabla `colores` de la teoría, copiada en COLOR y comparada por
 * plantillas/configuracion-ubicacion/colores.test.js): Z y los protones naranja (o), N y los neutrones turquesa (i), los
 * electrones violeta (f), la carga carmín (h); A en tinta, sin color. Ninguna letra de alternativa lleva color.
 * Datos (docs/plan-calidad.md §3, punto 13): las fórmulas y definiciones (A = Z + N, carga = Z − e⁻, isótopos, isóbaros,
 * isótonos, isoelectrónicos), la carga y la masa de cada partícula y el Z de los elementos que se nombran, nunca la
 * cuenta hecha. Cuando se elige un elemento, el Z de todos los que salen entre las alternativas.
 * Errores (hipótesis, docs/investigacion/atomo-enlace-ideas-erroneas.md, «Estructura atómica (18 nov)»; los de la teoría
 * y unos nuevos): AT4 (tantos neutrones como protones; respaldo parcial), QM-ELECTRON-NUCLEO, QM-PROTON-AFUERA,
 * QM-NEUTRON-AFUERA, QM-PARTICULA-CARGA, QM-PARTICULA-MASA, QM-NEUTRO-NEUTRONES (nuevos, de la trampa de San Marcos
 * 2020-I), QM-NUCLIDO-ISOTOPO, -ISOBARO, -ISOTONO, -NADA, -SIGNO (nuevo: compensa al revés la diferencia de protones),
 * QM-ISOTOPO-N, -A, -ELEMENTO, -REACCIONA, -UNO, QM-ISO-Z, QM-ISO-NEUTRO, QM-CARGA-SIGNO, QM-CARGA-E, QM-NEUTRONES y
 * QM-SUMA-TODO.
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
  const ID = 'particulas-nucleo';
  const FA = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const PARCIAL = new Set(['AT4']);
  const resp = id => (PARCIAL.has(id) ? 'parcial' : 'hipotesis');
  const e = (valor, id, explicacion) => ({ valor, id, explicacion, respaldo: resp(id), fuente: FA });
  const t = (clave, texto, id, explicacion) => ({ clave, texto, id, explicacion, respaldo: resp(id), fuente: FA });
  const v = P.v;

  // Un color fijo por magnitud: copia de `colores` de la teoría de la unidad.
  const COLOR = { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h', orbitales: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });
  const VARS = { Z: va('número atómico (protones)', 'protones'), N: va('neutrones', 'neutrones'), e: va('electrones', 'electrones'), q: va('carga', 'carga') };
  const usa = (...ks) => Object.fromEntries(ks.map(k => [k, VARS[k]]));

  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio',
    'magnesio', 'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio',
    'cromo', 'manganeso', 'hierro', 'cobalto', 'níquel', 'cobre', 'cinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón'];
  const Nombre = z => NOMBRE[z][0].toUpperCase() + NOMBRE[z].slice(1);
  const SUP = { '-': '⁻', '+': '⁺', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  const carga = q => (q === 0 ? '' : sup(`${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`));
  const signo = q => (q > 0 ? `+${q}` : q < 0 ? `−${-q}` : '0');
  const qTxt = q => (q > 0 ? `${q}+` : `${-q}−`);
  // ²³Na⁺: A arriba a la izquierda, la carga arriba a la derecha. El nitrógeno siempre con su A (¹⁴N): N son los neutrones.
  const nuclido = (z, a, q = 0) => `${sup(a)}${SIMB[z]}${carga(q)}`;
  // Un ion sin A: el nitrógeno no sale en estas listas (iría como «N» suelto).
  const ion = (z, q) => `${SIMB[z]}${carga(q)}`;
  const elTxt = z => ({ clave: `el:${z}`, texto: `${Nombre(z)} (Z = ${z})` });
  const lista = xs => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);

  // ---- Datos (las mismas líneas de la teoría) ----
  const D = {
    masa: 'A = Z + N',
    carga: 'carga = Z − e⁻',
    nota: 'Número de arriba a la izquierda: A; arriba a la derecha: la carga',
    neutro: 'En un átomo neutro, electrones = protones',
    familias: 'Isótopos: mismo Z. Isóbaros: mismo A. Isótonos: mismo N',
    iso: 'Isoelectrónicos: la misma cantidad de electrones',
    reaccion: 'Una reacción química depende de los electrones',
    proton: 'Protón: carga +1',
    neutron: 'Neutrón: sin carga, con casi la misma masa que el protón',
    electron: 'Electrón: carga −1; el protón pesa unas 1836 veces más',
  };
  const zDe = zs => [...new Set(zs)].sort((a, b) => a - b).map(z => `Z del ${NOMBRE[z]} = ${z}`);

  function numericas(rng, correcta, errores, texto = x => String(x)) {
    const ok = errores.filter(x => Number.isInteger(x.valor) && x.valor > 0 && x.valor !== correcta && P.enEscala(x.valor, correcta, x.id));
    return P.armar({ correcta, errores: ok, rng, texto });
  }
  const cerrar = o => ({ variables: o.variables || {}, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
    alternativas: o.alternativas, solucion: o.solucion, respuesta: { valor: o.valor, unidad: '' }, _datos: o._datos });

  // ---- donde: dónde está cada partícula (San Marcos 2020-I) ----
  const PART = {
    p: { nom: 'Protón', lugar: 'en el núcleo', otro: 'fuera del núcleo', malLugar: 'QM-PROTON-AFUERA' },
    n: { nom: 'Neutrón', lugar: 'en el núcleo', otro: 'fuera del núcleo', malLugar: 'QM-NEUTRON-AFUERA' },
    e: { nom: 'Electrón', lugar: 'fuera del núcleo', otro: 'en el núcleo', malLugar: 'QM-ELECTRON-NUCLEO' },
  };
  const DESCRIBE = [
    { id: 'positiva', txt: 'tiene carga positiva', neg: 'no tiene carga positiva', es: 'p', error: 'QM-PARTICULA-CARGA' },
    { id: 'sin-carga', txt: 'no tiene carga', neg: 'sí tiene carga', es: 'n', error: 'QM-PARTICULA-CARGA' },
    { id: 'negativa', txt: 'tiene carga negativa', neg: 'no tiene carga negativa', es: 'e', error: 'QM-PARTICULA-CARGA' },
    { id: 'liviana', txt: 'es la más liviana de las tres', neg: 'no es la más liviana', es: 'e', error: 'QM-PARTICULA-MASA' },
  ];
  const combo = (k, bien) => ({ clave: `donde:${k}:${bien ? 'si' : 'no'}`, texto: `${PART[k].nom}, ${bien ? PART[k].lugar : PART[k].otro}` });
  const AFIRMA = [
    { id: 'pn-nucleo', v: true, txt: 'Los protones y los neutrones están en el núcleo.', niega: 'QM-PROTON-AFUERA', por: 'el núcleo junta los protones y los neutrones' },
    { id: 'e-fuera', v: true, txt: 'Los electrones se mueven fuera del núcleo.', niega: 'QM-ELECTRON-NUCLEO', por: 'los electrones están alrededor del núcleo, no adentro' },
    { id: 'neutro-e', v: true, txt: 'Un átomo neutro tiene tantos electrones como protones.', niega: 'QM-NEUTRO-NEUTRONES', por: 'así las cargas +1 y −1 se compensan' },
    { id: 'masa-nucleo', v: true, txt: 'Casi toda la masa del átomo está en el núcleo.', niega: 'QM-PARTICULA-MASA', por: 'protones y neutrones pesan mucho más que los electrones' },
    { id: 'e-nucleo', v: false, txt: 'Los electrones están en el núcleo, junto a los protones.', error: 'QM-ELECTRON-NUCLEO', por: 'los electrones están fuera del núcleo' },
    { id: 'p-fuera', v: false, txt: 'Los protones giran fuera del núcleo.', error: 'QM-PROTON-AFUERA', por: 'los protones están en el núcleo' },
    { id: 'n-fuera', v: false, txt: 'Los neutrones están fuera del núcleo.', error: 'QM-NEUTRON-AFUERA', por: 'los neutrones están en el núcleo, con los protones' },
    { id: 'neutro-n', v: false, txt: 'Un átomo es neutro porque tiene tantos neutrones como protones.', error: 'QM-NEUTRO-NEUTRONES', por: 'el neutrón no tiene carga: lo que compensa a los protones son los electrones' },
    { id: 'masa-e', v: false, txt: 'Casi toda la masa del átomo está en sus electrones.', error: 'QM-PARTICULA-MASA', por: 'el electrón es el más liviano: la masa está en el núcleo' },
  ];
  function tDonde(rng) {
    const sub = rng.elegir(['particula', 'particula', 'correcta', 'incorrecta']);
    const datos = [D.proton, D.neutron, D.electron];
    if (sub === 'particula') {
      const d = rng.elegir(DESCRIBE), k = d.es, P0 = PART[k];
      const otros = ['p', 'n', 'e'].filter(x => x !== k), k2 = rng.elegir(otros), k3 = otros.find(x => x !== k2);
      const c = combo(k, true);
      const errores = [
        t(combo(k, false).clave, combo(k, false).texto, P0.malLugar, `Bien: es el ${P0.nom.toLowerCase()}. Pero está ${P0.lugar}, no ${P0.otro}.`),
        t(combo(k2, true).clave, combo(k2, true).texto, d.error, `Bien el lugar del ${PART[k2].nom.toLowerCase()}: ${PART[k2].lugar}. Pero no es la partícula que ${d.txt}: mira la carga y la masa de cada una.`),
        t(combo(k3, false).clave, combo(k3, false).texto, PART[k3].malLugar, `Bien buscar entre las tres partículas. Pero el ${PART[k3].nom.toLowerCase()} ${d.neg}, y además está ${PART[k3].lugar}.`),
      ];
      return cerrar({ enunciado: [`Una de las tres partículas del átomo ${d.txt}.`], pregunta: ['¿Qué partícula es y dónde está?'],
        datos, alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
        solucion: [[`La que ${d.txt} es el ${P0.nom.toLowerCase()}.`], [`Protones y neutrones forman el núcleo; los electrones se mueven fuera de él: ${c.texto.toLowerCase()}.`]],
        _datos: { tipo: 'donde', nivel: 1, sub, ids: [d.id] } });
    }
    const busca = sub === 'correcta';
    const meta = rng.elegir(AFIRMA.filter(a => a.v === busca));
    const otras = rng.barajar(AFIRMA.filter(a => a.v !== busca)).slice(0, 3);
    const c = { clave: `donde:${meta.id}`, texto: meta.txt };
    const errores = otras.map(a => (busca
      ? t(`donde:${a.id}`, a.txt, a.error, `Bien buscar la que describe el átomo. Pero esta es falsa: ${a.por}.`)
      : t(`donde:${a.id}`, a.txt, a.niega, `Bien desconfiar de cada afirmación. Pero esta es verdadera: ${a.por}.`)));
    return cerrar({ enunciado: ['Se dan varias afirmaciones sobre las partículas de un átomo.'],
      pregunta: [busca ? '¿Cuál de estas afirmaciones es correcta?' : '¿Cuál de estas afirmaciones es incorrecta?'],
      datos, alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
      solucion: [[`${meta.txt} Es ${busca ? 'verdadera' : 'falsa'}: ${meta.por}.`], [busca ? 'Las otras son falsas.' : 'Las otras son verdaderas.']],
      _datos: { tipo: 'donde', nivel: 1, sub, ids: [meta.id, ...otras.map(a => a.id)] } });
  }

  // ---- nuclidos: isótopos, isóbaros, isótonos ----
  const PARES = {
    isotopos: [[[6, 12], [6, 14]], [[6, 12], [6, 13]], [[17, 35], [17, 37]], [[8, 16], [8, 18]], [[1, 1], [1, 2]], [[1, 1], [1, 3]], [[19, 39], [19, 41]],
      [[12, 24], [12, 26]], [[29, 63], [29, 65]], [[10, 20], [10, 22]], [[3, 6], [3, 7]], [[5, 10], [5, 11]], [[26, 54], [26, 56]], [[14, 28], [14, 30]], [[16, 32], [16, 34]]],
    isobaros: [[[6, 14], [7, 14]], [[18, 40], [20, 40]], [[19, 40], [20, 40]], [[18, 40], [19, 40]], [[1, 3], [2, 3]], [[15, 32], [16, 32]], [[26, 58], [28, 58]],
      [[27, 60], [28, 60]], [[11, 24], [12, 24]], [[20, 48], [22, 48]]],
    isotonos: [[[6, 13], [7, 14]], [[19, 39], [20, 40]], [[11, 23], [12, 24]], [[5, 11], [6, 12]], [[8, 18], [9, 19]], [[17, 37], [18, 38]], [[14, 30], [15, 31]],
      [[26, 56], [27, 57]], [[12, 26], [13, 27]], [[7, 15], [8, 16]]],
    nada: [[[6, 12], [7, 15]], [[11, 23], [12, 25]], [[8, 16], [9, 19]], [[17, 35], [18, 40]], [[19, 39], [20, 42]], [[12, 24], [13, 26]]],
  };
  const NOM_REL = { isotopos: 'Isótopos', isobaros: 'Isóbaros', isotonos: 'Isótonos', nada: 'Ninguna de las tres' };
  function tNuclidos(rng) {
    if (rng.entero(0, 2) > 0) {
      const es = rng.elegir(['isotopos', 'isotopos', 'isobaros', 'isobaros', 'isotonos', 'isotonos', 'nada']);
      const [a, b] = rng.barajar(rng.elegir(PARES[es])), [z1, a1] = a, [z2, a2] = b, n1 = a1 - z1, n2 = a2 - z2;
      const NO = {
        isotopos: { id: 'QM-NUCLIDO-ISOTOPO', ex: `Bien comparar los núcleos. Pero isótopos tendrían el mismo Z, y aquí Z es ${z1} y ${z2}.` },
        isobaros: { id: 'QM-NUCLIDO-ISOBARO', ex: `Bien comparar los núcleos. Pero isóbaros tendrían el mismo A, y aquí A es ${a1} y ${a2}.` },
        isotonos: { id: 'QM-NUCLIDO-ISOTONO', ex: `Bien comparar los núcleos. Pero isótonos tendrían el mismo N, y aquí N es ${n1} y ${n2}.` },
        nada: { id: 'QM-NUCLIDO-NADA', ex: `Bien buscar diferencias. Pero compara Z, A y N uno por uno: ${es === 'isotopos' ? `Z es ${z1} en los dos` : es === 'isobaros' ? `A es ${a1} en los dos` : `N es ${n1} en los dos`}.` },
      };
      const c = { clave: `nuc:${es}`, texto: NOM_REL[es] };
      const errores = Object.keys(NOM_REL).filter(k => k !== es).map(k => t(`nuc:${k}`, NOM_REL[k], NO[k].id, NO[k].ex));
      const coincide = es === 'isotopos' ? ['Z', `${z1} en los dos`] : es === 'isobaros' ? ['A', `${a1} en los dos`] : es === 'isotonos' ? ['N', `${n1} en los dos`] : null;
      return cerrar({ variables: usa('Z', 'N'), enunciado: ['Se comparan los núclidos ', nuclido(z1, a1), ' y ', nuclido(z2, a2), '.'],
        pregunta: ['¿Qué son entre sí?'], datos: [...zDe([z1, z2]), D.familias, D.masa],
        alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
        solucion: [
          [v('Z', `Z: ${z1} y ${z2}`), `. A: ${a1} y ${a2}. `, v('N', `N = A − Z: ${n1} y ${n2}`), '.'],
          [coincide ? `Coincide ${coincide[0]} (${coincide[1]}): son ${NOM_REL[es].toLowerCase()}.` : 'No coincide ninguno de los tres números.'],
        ], _datos: { tipo: 'nuclidos', nivel: 2, sub: 'que-son', a, b } });
    }
    const [a, b] = rng.elegir(PARES.isotopos), z = a[0], x1 = nuclido(...a), x2 = nuclido(...b), nom = NOMBRE[z];
    if (rng.moneda()) {
      const c = { clave: 'iso:igual:pe', texto: 'Los protones y los electrones' };
      const errores = [
        t('iso:igual:n', 'Los neutrones', 'QM-ISOTOPO-N', `Bien buscar lo que comparten. Pero los neutrones es lo que cambia: ${a[1] - z} y ${b[1] - z}.`),
        t('iso:igual:a', 'El número de masa', 'QM-ISOTOPO-A', `Bien mirar los números del símbolo. Pero el número de masa cambia: ${a[1]} y ${b[1]}.`),
        t('iso:igual:nada', 'Nada: son elementos distintos', 'QM-ISOTOPO-ELEMENTO', `Bien notar que no son iguales. Pero los dos tienen Z = ${z}: son ${nom}.`),
      ];
      return cerrar({ variables: usa('Z', 'e', 'N'), enunciado: ['El ', x1, ' y el ', x2, ` son átomos neutros del ${nom}.`],
        pregunta: ['¿Qué tienen igual estos dos átomos?'], datos: [`Z del ${nom} = ${z}`, D.masa, D.neutro],
        alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
        solucion: [[v('Z', `Z = ${z}`), ' en los dos y, como son neutros, ', v('e', `${z} ${z === 1 ? 'electrón' : 'electrones'}`), ' en los dos.'],
          ['Cambian los neutrones: ', v('N', `N = ${a[1] - z} y ${b[1] - z}`), '.']],
        _datos: { tipo: 'nuclidos', nivel: 1, sub: 'isotopos', pide: 'igual', a, b } });
    }
    const c = { clave: 'iso:reacciona:igual', texto: 'Iguales: tienen los mismos electrones' };
    const errores = [
      t('iso:reacciona:n', 'Distintas: tienen distintos neutrones', 'QM-ISOTOPO-REACCIONA', 'Bien: sus neutrones son distintos. Pero las reacciones las deciden los electrones, y son los mismos.'),
      t('iso:reacciona:uno', 'Solo reacciona el más liviano', 'QM-ISOTOPO-UNO', 'Bien notar que uno pesa más. Pero los dos tienen los mismos electrones: los dos reaccionan igual.'),
      t('iso:reacciona:elem', 'Distintas: son elementos distintos', 'QM-ISOTOPO-ELEMENTO', `Bien notar que no son el mismo núclido. Pero los dos tienen Z = ${z}: son ${nom}.`),
      t('iso:reacciona:masa', 'Distintas: el más pesado reacciona más rápido', 'QM-ISOTOPO-REACCIONA', 'Bien comparar sus masas. Pero la masa del núcleo no decide la reacción: la deciden los electrones.'),
    ];
    return cerrar({ variables: usa('Z', 'e'), enunciado: ['El ', x1, ' y el ', x2, ` son átomos neutros del ${nom}.`],
      pregunta: ['¿Cómo son sus reacciones químicas, comparadas?'], datos: [`Z del ${nom} = ${z}`, D.reaccion, D.neutro],
      alternativas: P.armarTexto({ correcta: c, errores: [errores[0], errores[1], errores[2]], rng }), valor: c.clave,
      solucion: [[v('Z', `Z = ${z}`), ' en los dos; neutros, los mismos ', v('e', `${z} ${z === 1 ? 'electrón' : 'electrones'}`), '.'], ['Como la reacción depende de los electrones, reaccionan igual.']],
      _datos: { tipo: 'nuclidos', nivel: 1, sub: 'isotopos', pide: 'reacciona', a, b } });
  }

  // ---- isoelectronico: el ion X con carga y el ion conocido Y ----
  const ISO_Y = [[20, 2], [19, 1], [17, -1], [16, -2], [11, 1], [12, 2], [9, -1], [8, -2], [13, 3], [35, -1], [38, 2], [37, 1]];
  function tIsoelectronico(rng) {
    const elemento = rng.entero(0, 2) === 0;
    const [zy, qy] = rng.elegir(ISO_Y), qx = rng.elegir([-3, -2, -1, 1, 2, 3]), ey = zy - qy, zx = ey + qx;
    if (zx === zy || zx < 1 || zx > 36 || zx === 7 || (Math.sign(qx) === Math.sign(qy) && Math.abs(qx) === Math.abs(qy))) return null;
    const y = ion(zy, qy), X = `X${carga(qx)}`;
    const malos = [
      { valor: ey, id: 'QM-ISO-Z', ex: `Bien: X también tiene ${ey} electrones. Pero X tiene carga ${signo(qx)}: su Z no es igual a sus electrones. Así sale ${ey}.` },
      { valor: ey - qx, id: 'QM-CARGA-SIGNO', ex: `Bien partir de ${ey} electrones. Pero revisa el signo: carga = Z − e⁻, así que Z = e⁻ + carga. Así sale ${ey - qx}.` },
      { valor: zy + qx, id: 'QM-ISO-NEUTRO', ex: `Bien usar la carga de X. Pero el ${y} no tiene ${zy} electrones: tiene ${ey}. Así sale ${zy + qx}.` },
    ].filter((m, i, l) => m.valor > 0 && m.valor <= 36 && m.valor !== zx && l.findIndex(o => o.valor === m.valor) === i);
    if (malos.length < 3) return null;
    const enun = ['El ion ', X, ' es isoelectrónico con el ', y, ' (', v('Z', `Z = ${zy}`), ').'];
    const sol = [[`El ${y} tiene `, v('e', `${zy} − (${signo(qy)}) = ${ey} electrones`), '; X también tiene ', v('e', String(ey)), '.'],
      [v('Z', 'Z'), ' de X = ', v('e', String(ey)), ' + (', v('q', signo(qx)), ') = ', v('Z', String(zx)), elemento ? `: es el ${NOMBRE[zx]}.` : '.']];
    if (!elemento) return cerrar({ variables: usa('Z', 'e', 'q'), enunciado: enun, pregunta: ['¿Cuál es el ', v('Z', 'número atómico'), ' de X?'],
      datos: [D.carga, D.iso], alternativas: numericas(rng, zx, malos.map(m => e(m.valor, m.id, m.ex))), valor: zx, solucion: sol,
      _datos: { tipo: 'isoelectronico', nivel: 2, sub: 'z', x: qx, y: [zy, qy] } });
    const usados = malos.slice(0, 3);
    const c = elTxt(zx);
    const errores = usados.map(m => t(elTxt(m.valor).clave, elTxt(m.valor).texto, m.id, m.ex.replace(/Así sale \d+\.$/, `Así saldría el ${NOMBRE[m.valor]}.`)));
    return cerrar({ variables: usa('Z', 'e', 'q'), enunciado: enun, pregunta: ['¿Qué elemento es X?'],
      datos: [D.carga, D.iso, `Z: ${lista([zx, ...usados.map(m => m.valor)].sort((a, b) => a - b).map(z => `${NOMBRE[z]} ${z}`))}`],
      alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave, solucion: sol,
      _datos: { tipo: 'isoelectronico', nivel: 3, sub: 'elemento', x: qx, y: [zy, qy] } });
  }

  // ---- vecinos: el isóbaro, el isótono y el otro isótopo, con números ----
  function tVecinos(rng) {
    const sub = rng.elegir(['isobaros', 'isotonos', 'isotopos']);
    const [a, b] = rng.barajar(rng.elegir(PARES[sub])), [z1, a1] = a, [z2, a2] = b, n1 = a1 - z1, n2 = a2 - z2;
    const ya = nuclido(z1, a1), dz = z2 - z1;
    if (sub === 'isobaros') {
      const errores = [
        e(n1, 'QM-NUCLIDO-ISOTONO', `Bien que los dos núclidos se parezcan. Pero isóbaros tienen el mismo A, no el mismo N: ${n1} es de otro. Así salen ${n1}.`),
        e(a1, 'QM-NEUTRONES', `Bien que el A sea ${a1} en los dos. Pero A junta protones y neutrones: falta quitar los ${z2} protones. Así salen ${a1}.`),
        e(n1 + dz, 'QM-NUCLIDO-SIGNO', `Bien partir de los ${n1} neutrones y de la diferencia de ${Math.abs(dz)} protones. Pero va al revés: con ${dz > 0 ? 'más' : 'menos'} protones y el mismo A, hay ${dz > 0 ? 'menos' : 'más'} neutrones. Así salen ${n1 + dz}.`),
        e(z2, 'AT4', `Bien los ${z2} protones del otro núcleo. Pero no siempre hay tantos neutrones como protones: usa A. Así salen ${z2}.`),
      ];
      return cerrar({ variables: usa('Z', 'N'), enunciado: ['El ', ya, ' tiene ', v('Z', `Z = ${z1}`), `. Un núclido del ${NOMBRE[z2]} (`, v('Z', `Z = ${z2}`), ') es isóbaro del ', ya, '.'],
        pregunta: ['¿Cuántos ', v('N', 'neutrones'), ` tiene ese núclido del ${NOMBRE[z2]}?`], datos: [D.familias, D.masa],
        alternativas: numericas(rng, n2, errores), valor: n2,
        solucion: [['Isóbaros: el mismo A, ', `${a1}.`], [v('N', 'N'), ' = ', `${a1} − `, v('Z', String(z2)), ' = ', v('N', `${n2} neutrones`), '.']],
        _datos: { tipo: 'vecinos', nivel: 3, sub, a, b } });
    }
    if (sub === 'isotonos') {
      const errores = [
        e(a1, 'QM-NUCLIDO-ISOBARO', `Bien que los dos núclidos se parezcan. Pero isótonos tienen el mismo N, no el mismo A. Así sale A = ${a1}.`),
        e(n1, 'QM-NEUTRONES', `Bien: tiene ${n1} neutrones, como el ${ya}. Pero A suma también los protones. Así sale ${n1}.`),
        e(a1 - dz, 'QM-NUCLIDO-SIGNO', `Bien partir de A = ${a1} y de la diferencia de ${Math.abs(dz)} protones. Pero va al revés: con ${dz > 0 ? 'más' : 'menos'} protones y los mismos neutrones, A ${dz > 0 ? 'sube' : 'baja'}. Así sale ${a1 - dz}.`),
        e(z2 + z1, 'QM-NUCLIDO-ISOTOPO', `Bien sumar protones y neutrones. Pero el otro sumando es N = ${n1}, no el Z del ${ya}. Así sale ${z2 + z1}.`),
      ];
      return cerrar({ variables: usa('Z', 'N'), enunciado: ['El ', ya, ' tiene ', v('Z', `Z = ${z1}`), `. Un núclido del ${NOMBRE[z2]} (`, v('Z', `Z = ${z2}`), ') es isótono del ', ya, '.'],
        pregunta: [`¿Cuál es el número de masa de ese núclido del ${NOMBRE[z2]}?`], datos: [D.familias, D.masa],
        alternativas: numericas(rng, a2, errores), valor: a2,
        solucion: [['Isótonos: el mismo N. ', v('N', 'N'), ' del ', ya, ' = ', `${a1} − `, v('Z', String(z1)), ' = ', v('N', String(n1)), '.'],
          ['A = ', v('Z', String(z2)), ' + ', v('N', String(n1)), ` = ${a2}.`]],
        _datos: { tipo: 'vecinos', nivel: 3, sub, a, b } });
    }
    const da = a2 - a1;
    const errores = [
      e(n1, 'QM-ISOTOPO-N', `Bien que sean del mismo elemento. Pero los isótopos no tienen los mismos neutrones: eso es lo que cambia. Así salen ${n1}.`),
      e(a2, 'QM-NEUTRONES', `Bien leer A = ${a2}. Pero A junta protones y neutrones: falta quitar los ${z1} protones. Así salen ${a2}.`),
      e(n1 - da, 'QM-NUCLIDO-SIGNO', `Bien usar la diferencia de ${Math.abs(da)} en A. Pero va al revés: el de A ${da > 0 ? 'mayor' : 'menor'} tiene ${da > 0 ? 'más' : 'menos'} neutrones. Así salen ${n1 - da}.`),
      e(z1, 'AT4', `Bien los ${z1} protones, que no cambian. Pero no siempre hay tantos neutrones como protones: usa A. Así salen ${z1}.`),
    ];
    const nom = NOMBRE[z1];
    return cerrar({ variables: usa('Z', 'N'), enunciado: ['El ', ya, ' tiene ', v('N', `${n1} neutrones`), `. El ${nom}-${a2} es otro isótopo del ${nom}.`],
      pregunta: ['¿Cuántos ', v('N', 'neutrones'), ` tiene el ${nom}-${a2}?`], datos: [D.familias, D.masa],
      alternativas: numericas(rng, n2, errores), valor: n2,
      solucion: [[v('Z', 'Z'), ' del ', ya, ' = ', `${a1} − `, v('N', String(n1)), ' = ', v('Z', String(z1)), '; un isótopo tiene el mismo Z.'],
        [v('N', 'N'), ` del ${nom}-${a2} = ${a2} − `, v('Z', String(z1)), ' = ', v('N', `${n2} neutrones`), '.']],
      _datos: { tipo: 'vecinos', nivel: 3, sub, a, b } });
  }

  // ---- masa-ion: A de un ion con su carga, sus electrones y sus neutrones ----
  const IONES = [[8, 16, -2], [11, 23, 1], [12, 24, 2], [13, 27, 3], [16, 32, -2], [17, 35, -1], [17, 37, -1], [19, 39, 1], [20, 40, 2],
    [26, 56, 3], [26, 56, 2], [9, 19, -1], [29, 63, 2], [30, 65, 2], [35, 80, -1], [15, 31, -3], [24, 52, 3], [25, 55, 2], [28, 59, 2], [34, 79, -2]];
  function tMasaIon(rng) {
    const [z, a, q] = rng.elegir(IONES), el = z - q, n = a - z;
    const errores = [
      e(el + n, 'QM-CARGA-E', `Bien sumar los ${n} neutrones. Pero el ion tiene carga: sus protones no son sus ${el} electrones. Así sale ${el + n}.`),
      e(el - q + n, 'QM-CARGA-SIGNO', `Bien usar la carga y los neutrones. Pero el signo va al revés: carga = Z − e⁻. Así sale ${el - q + n}.`),
      e(z, 'QM-NEUTRONES', `Bien los protones: Z = ${z}. Pero falta sumar los ${n} neutrones: A = Z + N. Así sale ${z}.`),
      e(a + el, 'QM-SUMA-TODO', `Bien Z y N. Pero A cuenta solo el núcleo: los ${el} electrones no van. Así sale ${a + el}.`),
    ];
    return cerrar({ variables: usa('Z', 'N', 'e', 'q'), enunciado: ['Un ion X tiene carga ', v('q', qTxt(q)), ', ', v('e', `${el} electrones`), ' y ', v('N', `${n} neutrones`), '.'],
      pregunta: ['¿Cuál es su número de masa A?'], datos: [D.carga, D.masa],
      alternativas: numericas(rng, a, errores), valor: a,
      solucion: [['Protones: ', v('Z', 'Z'), ' = ', v('e', String(el)), ' + (', v('q', signo(q)), ') = ', v('Z', String(z)), '.'],
        ['A = ', v('Z', String(z)), ' + ', v('N', String(n)), ` = ${a}.`]],
      _datos: { tipo: 'masa-ion', nivel: 3, Z: z, A: a, carga: q } });
  }

  const TIPOS = ['donde', 'donde', 'nuclidos', 'nuclidos', 'nuclidos', 'isoelectronico', 'isoelectronico', 'isoelectronico', 'vecinos', 'vecinos', 'masa-ion', 'masa-ion'];
  const CONSTRUIR = { donde: tDonde, nuclidos: tNuclidos, isoelectronico: tIsoelectronico, vecinos: tVecinos, 'masa-ion': tMasaIon };
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const p = CONSTRUIR[tipo](rng);
      if (p && p.alternativas.length >= 4) return { id: `${ID}#${semilla}`, ...p };
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'El núcleo y sus vecinos: isótopos, isóbaros e isoelectrónicos', generar, COLOR, TIPOS: [...new Set(TIPOS)],
    SIMB, NOMBRE, PARES, ISO_Y, IONES, AFIRMA: AFIRMA.map(({ id, v: verdad }) => ({ id, verdad })), DESCRIBE: DESCRIBE.map(d => ({ id: d.id, es: d.es })) };
});
