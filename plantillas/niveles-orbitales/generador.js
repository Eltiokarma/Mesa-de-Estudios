/*
 * Generador «Pisos, pasillos y cuartos»: práctica de la idea 3 de «Estructura atómica» (quimica.estructura-atomica;
 * contenido/teoria/quimica/estructura-atomica.js, idea «numeros-cuanticos»: niveles, subniveles y orbitales). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['niveles-orbitales']) y en Node
 * (require). No usa ningún motor: todo sale de tres reglas de la teoría, escritas aquí aparte para que el generador cargue
 * solo: ℓ va de 0 a n − 1; mₗ va de −ℓ a +ℓ (un orbital por valor: 2ℓ + 1 orbitales); en cada orbital caben 2 electrones,
 * con mₛ = +½ o −½. De ahí, n² orbitales y 2n² electrones en el nivel n.
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   orb-sub    (1) ¿cuántos orbitales tiene el subnivel 4d?                       → 2ℓ + 1
 *   e-sub      (1) ¿cuántos electrones caben, como máximo, en el subnivel 3p?      → 2(2ℓ + 1)
 *   valores    (1) sub 'nmin': ¿cuál es el menor n que tiene un subnivel d? · sub 'ml': ¿qué valores toma mₗ en el 4d?
 *   orb-nivel  (2) ¿cuántos orbitales tiene en total el nivel n = 3?                → n²
 *   e-nivel    (2) ¿cuántos electrones caben, como máximo, en el nivel n = 4?        → 2n²
 *   subnivel   (2) un electrón con n = 4 y ℓ = 2: ¿en qué subnivel está y cuántos caben ahí?
 *   imposible  (3) sub 'no': ¿qué juego (n; ℓ; mₗ; mₛ) no puede existir? · sub 'si': ¿cuál sí puede existir?
 *   condicion  (3) sub 'ml': ¿cuántos electrones pueden tener n = 3 y mₗ = −1? (los subniveles con ℓ ≥ |mₗ|, 2 por cada
 *              uno) · sub 'ms': ¿cuántos electrones pueden tener n = 3 y mₛ = +½? (uno por orbital: n²)
 * _datos: { tipo, nivel, sub?, n, l?, ml?, ms?, juegos? (imposible: los juegos [n, ℓ, mₗ, 2·mₛ] en el orden en que se eligieron, el
 *   primero es la respuesta) }. Respuestas: un número (orb-sub, e-sub, orb-nivel, e-nivel, condicion) o una clave de texto:
 *   'val:<lista>' (valores), 'sub:<nombre>:<electrones>' (subnivel), 'qn:n:l:ml:2ms' (imposible).
 * Notación (propuesta §7): ℓ para el subnivel (no l, que se confunde con el 1); mₗ y mₛ con subíndice; s, p, d, f son 0, 1,
 * 2, 3. Juegos escritos «(3; 2; −1; +½)». Niveles hasta n = 4 en los que cuentan todo el nivel (el 5g no se usa).
 * Colores (molde §5b; la tabla `colores` de la teoría, copiada en COLOR y comparada por
 * plantillas/configuracion-ubicacion/colores.test.js): los electrones en violeta (f) y los orbitales en turquesa (i);
 * n, ℓ, mₗ y mₛ van en tinta, sin color (son la dirección del electrón, no algo que se cuenta).
 * Datos (docs/plan-calidad.md §3, punto 13): las reglas entre las que se elige (ℓ de 0 a n − 1, mₗ de −ℓ a +ℓ,
 * 2ℓ + 1 orbitales, 2 electrones por orbital, mₛ = ±½, las letras s, p, d, f), nunca 2n² ni n² ya armados.
 * Errores (hipótesis, docs/investigacion/atomo-enlace-ideas-erroneas.md, «Estructura atómica (18 nov)»; los mismos de la
 * teoría): QM-ORBITAL-ELECTRON (cuenta orbitales y no electrones, o al revés), QM-N-L (usa n donde va ℓ), QM-L-DESDE-UNO
 * (s = 1, p = 2…), QM-L-IGUAL-N (ℓ llega a n), QM-SIN-F (se queda sin el subnivel nuevo), QM-OCHO-POR-NIVEL, QM-2N,
 * QM-SOLO-ULTIMO, QM-ML-POSITIVO (mₗ sin negativos), QM-L-CERO, QM-L-MENOR, QM-ML-FUERA (mₗ fuera de −ℓ…+ℓ),
 * QM-MS-ENTERO (mₛ = ±1) y QM-CONDICION-IGNORA (cuenta todo el nivel sin la segunda condición; nuevo).
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
  const ID = 'niveles-orbitales';
  const FA = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const e = (valor, id, explicacion) => ({ valor, id, explicacion, respaldo: 'hipotesis', fuente: FA });
  const t = (clave, texto, id, explicacion) => ({ clave, texto, id, explicacion, respaldo: 'hipotesis', fuente: FA });
  const v = P.v;
  const LETRA = 'spdf';

  // Un color fijo por magnitud: copia de `colores` de la teoría de la unidad.
  const COLOR = { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h', orbitales: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });
  const VARS = { e: va('electrones', 'electrones'), o: va('orbitales', 'orbitales') };
  const usa = (...ks) => Object.fromEntries(ks.map(k => [k, VARS[k]]));

  // Las reglas, en los datos (las mismas líneas de la teoría).
  const D = {
    letras: 'ℓ: s es 0, p es 1, d es 2, f es 3',
    lDe: 'ℓ va de 0 a n − 1',
    mlDe: 'mₗ va de −ℓ a +ℓ: un orbital por cada valor',
    orbitales: 'Orbitales de un subnivel: 2ℓ + 1',
    dos: 'En un orbital caben 2 electrones, de espín opuesto',
    ms: 'mₛ = +½ o −½',
  };

  // ---- Cuentas (las que el alumno hace; regla 1: aquí, no en un modelo de lenguaje) ----
  const orbSub = l => 2 * l + 1;
  const eSub = l => 2 * orbSub(l);
  const orbNivel = n => { let s = 0; for (let l = 0; l < n; l++) s += orbSub(l); return s; };
  const eNivel = n => 2 * orbNivel(n);
  const conMl = (n, ml) => { let k = 0; for (let l = Math.abs(ml); l < n; l++) k++; return 2 * k; };   // electrones con n y mₗ
  const conMs = n => orbNivel(n);                                                                         // uno por orbital
  const sub = (n, l) => `${n}${LETRA[l]}`;
  const ML = m => (m > 0 ? `+${m}` : m < 0 ? `−${-m}` : '0');
  const MS2 = m2 => (m2 === 1 ? '+½' : m2 === -1 ? '−½' : m2 > 0 ? `+${m2 / 2}` : `−${-m2 / 2}`);
  const juego = ([n, l, ml, m2]) => `(${n}; ${l}; ${ML(ml)}; ${MS2(m2)})`;
  const lista = xs => (xs.length === 1 ? String(xs[0]) : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  const valoresL = n => Array.from({ length: n }, (_, l) => l);  // ℓ de 0 a n − 1
  const valoresMl = l => Array.from({ length: 2 * l + 1 }, (_, k) => k - l);
  const valTxt = xs => ({ clave: 'val:' + xs.join(','), texto: lista(xs.map(ML)) });
  const plural = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
  // Un juego es posible si ℓ < n, |mₗ| ≤ ℓ y mₛ = ±½.
  const posible = ([n, l, ml, m2]) => n >= 1 && l >= 0 && l < n && Math.abs(ml) <= l && (m2 === 1 || m2 === -1);

  function numericas(rng, correcta, errores, texto = x => String(x)) {
    const ok = errores.filter(x => Number.isInteger(x.valor) && x.valor > 0 && x.valor !== correcta && P.enEscala(x.valor, correcta, x.id));
    return P.armar({ correcta, errores: ok, rng, texto });
  }
  const cerrar = (o) => ({ variables: o.variables || {}, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
    alternativas: o.alternativas, solucion: o.solucion, respuesta: { valor: o.valor, unidad: '' }, _datos: o._datos });

  // ---- orb-sub: orbitales de un subnivel ----
  function tOrbSub(rng) {
    const n = rng.entero(2, 5), l = rng.entero(1, Math.min(3, n - 1)), s = sub(n, l), o = orbSub(l);
    const errores = [
      e(eSub(l), 'QM-ORBITAL-ELECTRON', `Bien la cuenta de 2ℓ + 1 por dos. Pero así salen ${eSub(l)}, los electrones que caben; los orbitales son las cajas.`),
      e(n, 'QM-N-L', `Bien leer el ${n} de ${s}. Pero ${n} es el nivel: los orbitales dependen de ℓ, la letra. Así salen ${n}.`),
      e(orbSub(l + 1), 'QM-L-DESDE-UNO', `Bien usar 2ℓ + 1. Pero ${LETRA[l]} es ℓ = ${l}, no ${l + 1}: la s es 0. Así salen ${orbSub(l + 1)}.`),
      e(l + 1, 'QM-ML-POSITIVO', `Bien contar un orbital por cada mₗ. Pero mₗ va de −${l} a +${l}, también los negativos; de 0 a ${l} salen solo ${l + 1}.`),
    ];
    return cerrar({ variables: usa('o'), enunciado: [`Un electrón está en el subnivel ${s}.`],
      pregunta: ['¿Cuántos ', v('o', 'orbitales'), ` tiene el subnivel ${s}?`],
      datos: [D.letras, D.mlDe, D.orbitales], alternativas: numericas(rng, o, errores), valor: o,
      solucion: [
        [`${LETRA[l]} es ℓ = ${l}: mₗ va de −${l} a +${l} (${lista(valoresMl(l).map(ML))}).`],
        ['Un orbital por cada valor: 2 · ', String(l), ' + 1 = ', v('o', plural(o, 'orbital', 'orbitales')), '.'],
      ], _datos: { tipo: 'orb-sub', nivel: 1, n, l } });
  }

  // ---- e-sub: electrones que caben en un subnivel ----
  function tESub(rng) {
    const n = rng.entero(2, 5), l = rng.entero(0, Math.min(3, n - 1)), s = sub(n, l), k = eSub(l);
    const errores = [
      e(orbSub(l), 'QM-ORBITAL-ELECTRON', `Bien contar los orbitales del ${s}: ${orbSub(l)}. Pero en cada uno caben dos electrones.`),
      e(eNivel(Math.min(n, 4)), 'QM-N-L', `Bien calcular lo que cabe en un nivel. Pero ${eNivel(Math.min(n, 4))} es todo el nivel ${Math.min(n, 4)}; aquí piden un solo subnivel.`),
      e(eSub(l + 1), 'QM-L-DESDE-UNO', `Bien el doble de los orbitales. Pero ${LETRA[l]} es ℓ = ${l}, no ${l + 1}: así salen ${eSub(l + 1)}.`),
      e(8, 'QM-OCHO-POR-NIVEL', 'Bien pensar en un tope. Pero 8 no es el tope de un subnivel: cada uno tiene 2ℓ + 1 orbitales de dos electrones. Así salen 8.'),
      e(2 * (l + 1), 'QM-ML-POSITIVO', `Bien dos electrones por orbital. Pero mₗ va de −${l} a +${l}: de 0 a ${l} contarías solo ${l + 1} orbitales y ${2 * (l + 1)} electrones.`),
    ];
    return cerrar({ variables: usa('e', 'o'), enunciado: [`Se llena el subnivel ${s} de un átomo.`],
      pregunta: ['¿Cuántos ', v('e', 'electrones'), ` caben, como máximo, en el subnivel ${s}?`],
      datos: [D.letras, D.orbitales, D.dos], alternativas: numericas(rng, k, errores), valor: k,
      solucion: [
        [`${LETRA[l]} es ℓ = ${l}: 2 · ${l} + 1 = `, v('o', plural(orbSub(l), 'orbital', 'orbitales')), '.'],
        ['Dos electrones en cada uno: 2 · ', v('o', String(orbSub(l))), ' = ', v('e', `${k} electrones`), '.'],
      ], _datos: { tipo: 'e-sub', nivel: 1, n, l } });
  }

  // ---- valores: de ℓ en un nivel o de mₗ en un subnivel ----
  function tValores(rng) {
    if (rng.moneda()) {
      // sub 'nmin': ¿en qué nivel aparece por primera vez un subnivel? (ℓ llega hasta n − 1, así que n = ℓ + 1)
      const l = rng.entero(2, 3), k = l + 1;
      const errores = [
        e(l, 'QM-L-IGUAL-N', `Bien buscar el nivel más bajo. Pero ℓ no llega a n: con n = ${l}, ℓ va solo de 0 a ${l - 1}. Así sale ${l}.`),
        e(l + 2, 'QM-L-DESDE-UNO', `Bien que n tenga que pasar a ℓ. Pero ${LETRA[l]} es ℓ = ${l}, no ${l + 1}: la s es 0. Así sale ${l + 2}.`),
        e(orbSub(l), 'QM-N-L', `Bien el número de orbitales del ${LETRA[l]}: ${orbSub(l)}. Pero eso no es el nivel: n tiene que ser mayor que ℓ. Así sale ${orbSub(l)}.`),
      ];
      return cerrar({ enunciado: [`El subnivel ${LETRA[l]} no aparece en todos los niveles.`],
        pregunta: [`¿Cuál es el menor nivel n que tiene un subnivel ${LETRA[l]}?`],
        datos: [D.lDe, D.letras], alternativas: numericas(rng, k, errores), valor: k,
        solucion: [[`${LETRA[l]} es ℓ = ${l}, y ℓ va de 0 a n − 1: hace falta n − 1 ≥ ${l}.`], [`El menor es n = ${k}: el primer ${LETRA[l]} es el ${sub(k, l)}.`]],
        _datos: { tipo: 'valores', nivel: 1, sub: 'nmin', l } });
    }
    const n = rng.entero(4, 5), l = rng.entero(2, Math.min(3, n - 1)), s = sub(n, l), bien = valoresMl(l), c = valTxt(bien);
    const errores = [
      valTxt(valoresL(l + 1)), valTxt(valoresMl(l + 1)), valTxt(valoresMl(n)), valTxt(valoresMl(l - 1)),
    ].map((x, i) => [
      t(x.clave, x.texto, 'QM-ML-POSITIVO', `Bien llegar hasta +${l}. Pero mₗ también toma los negativos: va de −${l} a +${l}.`),
      t(x.clave, x.texto, 'QM-L-DESDE-UNO', `Bien ir de un negativo al mismo positivo. Pero ${LETRA[l]} es ℓ = ${l}, no ${l + 1}: va de −${l} a +${l}.`),
      t(x.clave, x.texto, 'QM-N-L', `Bien ir de −x a +x. Pero x es ℓ, no n: para el ${s}, ℓ = ${l}.`),
      t(x.clave, x.texto, 'QM-ML-FUERA', `Bien empezar por un negativo. Pero el ${s} tiene ℓ = ${l}: mₗ llega a −${l} y a +${l}, no se queda en ±${l - 1}.`),
    ][i]);
    return cerrar({ enunciado: [`Un electrón está en el subnivel ${s}.`],
      pregunta: [`¿Qué valores puede tomar mₗ en el subnivel ${s}?`],
      datos: [D.letras, D.mlDe], alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
      solucion: [[`${LETRA[l]} es ℓ = ${l}: mₗ va de −${l} a +${l}.`], [`${c.texto}: ${plural(bien.length, 'orbital', 'orbitales')}.`]],
      _datos: { tipo: 'valores', nivel: 1, sub: 'ml', n, l } });
  }

  // ---- orb-nivel: orbitales de todo un nivel ----
  function tOrbNivel(rng) {
    const n = rng.entero(2, 4), o = orbNivel(n), partes = valoresL(n).map(orbSub);
    const errores = [
      e(eNivel(n), 'QM-ORBITAL-ELECTRON', `Bien la suma de los orbitales por dos. Pero así salen ${eNivel(n)}, los electrones; los orbitales son las cajas.`),
      e(n, 'QM-N-L', `Bien contar ${n} subniveles en el nivel ${n}. Pero cada subnivel tiene varios orbitales: así salen ${n}.`),
      e(orbSub(n - 1), 'QM-SOLO-ULTIMO', `Bien los orbitales del ${sub(n, n - 1)}: ${orbSub(n - 1)}. Pero el nivel tiene también los subniveles de abajo.`),
      e(o - orbSub(n - 1), 'QM-SIN-F', `Bien sumar subniveles. Pero ℓ llega hasta n − 1 = ${n - 1}: falta el ${sub(n, n - 1)}. Así salen ${o - orbSub(n - 1)}.`),
      e(orbNivel(n + 1), 'QM-L-IGUAL-N', `Bien sumar subniveles. Pero ℓ no llega a n = ${n}: ese subnivel no existe. Así salen ${orbNivel(n + 1)}.`),
    ];
    return cerrar({ variables: usa('o'), enunciado: [`Se cuentan los orbitales del nivel n = ${n} de un átomo.`],
      pregunta: ['¿Cuántos ', v('o', 'orbitales'), ` tiene en total el nivel n = ${n}?`],
      datos: [D.lDe, D.orbitales], alternativas: numericas(rng, o, errores), valor: o,
      solucion: [
        [`ℓ va de 0 a ${n - 1}: ${valoresL(n).map(l => sub(n, l)).join(', ')}.`],
        [`Orbitales: ${partes.join(' + ')} = `, v('o', `${o} orbitales`), '.'],
      ], _datos: { tipo: 'orb-nivel', nivel: 2, n } });
  }

  // ---- e-nivel: electrones de todo un nivel ----
  function tENivel(rng) {
    const n = rng.entero(2, 4), o = orbNivel(n), k = eNivel(n), partes = valoresL(n).map(orbSub);
    const errores = [
      e(o, 'QM-ORBITAL-ELECTRON', `Bien la suma de los orbitales: ${o}. Pero en cada uno caben dos electrones.`),
      e(8, 'QM-OCHO-POR-NIVEL', 'Bien buscar un tope. Pero no todos los niveles se llenan con 8: cada nivel suma un subnivel más. Así salen 8.'),
      e(2 * (o - orbSub(n - 1)), 'QM-SIN-F', `Bien sumar subniveles. Pero ℓ llega hasta n − 1 = ${n - 1}: falta el ${sub(n, n - 1)}. Así salen ${2 * (o - orbSub(n - 1))}.`),
      e(2 * n, 'QM-2N', `Bien multiplicar por dos. Pero hay que contar los orbitales de todos los subniveles, no el número del nivel. Así salen ${2 * n}.`),
      e(eNivel(n + 1), 'QM-L-IGUAL-N', `Bien sumar subniveles. Pero ℓ no llega a n = ${n}: ese subnivel no existe. Así salen ${eNivel(n + 1)}.`),
    ];
    return cerrar({ variables: usa('e', 'o'), enunciado: [`Se llena el nivel n = ${n} de un átomo.`],
      pregunta: ['¿Cuántos ', v('e', 'electrones'), ` caben, como máximo, en todo el nivel n = ${n}?`],
      datos: [D.lDe, D.orbitales, D.dos], alternativas: numericas(rng, k, errores), valor: k,
      solucion: [
        [`ℓ va de 0 a ${n - 1}: ${partes.join(' + ')} = `, v('o', `${o} orbitales`), '.'],
        ['Dos electrones en cada uno: 2 · ', v('o', String(o)), ' = ', v('e', `${k} electrones`), '.'],
      ], _datos: { tipo: 'e-nivel', nivel: 2, n } });
  }

  // ---- subnivel: de (n, ℓ) al nombre del subnivel y lo que cabe ----
  function tSubnivel(rng) {
    const n = rng.entero(3, 5), l = rng.entero(1, Math.min(3, n - 1)), s = sub(n, l), k = eSub(l);
    const txt = (nom, x) => ({ clave: `sub:${nom}:${x}`, texto: `${nom}, con ${x} electrones` });
    const c = txt(s, k);
    const errores = [
      { ...txt(sub(n, l - 1), eSub(l - 1)), id: 'QM-L-DESDE-UNO', explicacion: `Bien el nivel ${n}. Pero ℓ = ${l} es la letra ${LETRA[l]}: s es 0, p es 1, d es 2.` },
      { ...txt(s, orbSub(l)), id: 'QM-ORBITAL-ELECTRON', explicacion: `Bien el ${s}. Pero ${orbSub(l)} son sus orbitales; caben dos electrones en cada uno.` },
      { ...txt(s, eNivel(Math.min(n, 4))), id: 'QM-N-L', explicacion: `Bien el ${s}. Pero ${eNivel(Math.min(n, 4))} caben en todo un nivel, no en un subnivel.` },
    ].filter(x => x.clave !== c.clave).map(x => ({ ...x, respaldo: 'hipotesis', fuente: FA }));
    return cerrar({ variables: usa('e'), enunciado: [`Un electrón tiene n = ${n} y ℓ = ${l}.`],
      pregunta: ['¿En qué subnivel está y cuántos ', v('e', 'electrones'), ' caben ahí?'],
      datos: [D.letras, D.orbitales, D.dos], alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
      solucion: [[`n = ${n} es el nivel; ℓ = ${l} es la letra ${LETRA[l]}: el ${s}.`],
        [`2 · ${l} + 1 = ${orbSub(l)} orbitales, con dos electrones cada uno: `, v('e', `${k} electrones`), '.']],
      _datos: { tipo: 'subnivel', nivel: 2, n, l } });
  }

  // ---- imposible: ¿qué juego no puede existir? (o ¿cuál sí?) ----
  // Un juego es [n, ℓ, mₗ, 2·mₛ]. Los que rompen una regla y los que se ven raros pero existen, cada uno con su error.
  function rompe(rng) {
    const n = rng.entero(2, 4), cual = rng.elegir(['l', 'ml', 'ms']);
    if (cual === 'l') return { q: [n, n, 0, rng.elegir([1, -1])], regla: `ℓ = ${n} no puede ser igual a n = ${n}: llega hasta ${n - 1}`, id: 'QM-L-IGUAL-N',
      siAcepta: `Bien que mₗ = 0 y mₛ estén permitidos. Pero ℓ no llega a n: con n = ${n}, ℓ va de 0 a ${n - 1}.` };
    if (cual === 'ml') { const l = rng.entero(1, n - 1), m = (rng.moneda() ? 1 : -1) * (l + 1); return { q: [n, l, m, rng.elegir([1, -1])], regla: `con ℓ = ${l}, mₗ va de −${l} a +${l}: mₗ = ${ML(m)} no existe`, id: 'QM-ML-FUERA',
      siAcepta: `Bien n y ℓ. Pero con ℓ = ${l}, mₗ va de −${l} a +${l}: mₗ = ${ML(m)} no existe.` }; }
    const l = rng.entero(0, n - 1);
    return { q: [n, l, rng.entero(-l, l), rng.elegir([2, -2])], regla: 'mₛ solo vale +½ o −½', id: 'QM-MS-ENTERO', siAcepta: 'Bien n, ℓ y mₗ. Pero mₛ solo vale +½ o −½: no hay espín ±1.' };
  }
  function existe(rng) {
    const cual = rng.elegir(['neg', 'cero', 'tope']);
    const n = rng.entero(2, 4);
    if (cual === 'neg') { const l = rng.entero(1, n - 1); return { q: [n, l, -rng.entero(1, l), rng.elegir([1, -1])], id: 'QM-ML-POSITIVO', siRechaza: 'Ese sí existe: mₗ puede ser negativo, va de −ℓ a +ℓ.' }; }
    if (cual === 'cero') return { q: [rng.entero(1, 4), 0, 0, rng.elegir([1, -1])], id: 'QM-L-CERO', siRechaza: 'Ese sí existe: ℓ = 0 es el subnivel s, con mₗ = 0.' };
    const m = n; return { q: [m, m - 1, rng.moneda() ? m - 1 : 1 - m, rng.elegir([1, -1])], id: 'QM-L-MENOR', siRechaza: `Ese sí existe: con n = ${m}, ℓ llega hasta ${m - 1}, y mₗ hasta ±${m - 1}.` };
  }
  function tImposible(rng) {
    const si = rng.entero(0, 2) === 0;   // 1 de cada 3: ¿cuál sí puede existir?
    const usados = new Set(), toma = f => { for (let k = 0; k < 40; k++) { const x = f(rng); const c = juego(x.q); if (!usados.has(c)) { usados.add(c); return x; } } return null; };
    const meta = si ? toma(existe) : toma(rompe);
    if (!meta) return null;
    const otros = [];
    for (let k = 0; k < 12 && otros.length < 3; k++) { const x = si ? toma(rompe) : toma(existe); if (x && !otros.some(y => y.id === x.id) && x.id !== meta.id) otros.push(x); }
    if (otros.length < 3) return null;
    if (si ? !posible(meta.q) : posible(meta.q)) return null;
    if (otros.some(x => (si ? posible(x.q) : !posible(x.q)))) return null;
    const clave = q => 'qn:' + q.join(':');
    const c = { clave: clave(meta.q), texto: juego(meta.q) };
    const errores = otros.map(x => (si
      ? { clave: clave(x.q), texto: juego(x.q), id: x.id, explicacion: x.siAcepta, respaldo: 'hipotesis', fuente: FA }
      : { clave: clave(x.q), texto: juego(x.q), id: x.id, explicacion: `Bien desconfiar de un valor que se ve raro. Pero ${x.siRechaza.replace(/^Ese/, 'ese')}`, respaldo: 'hipotesis', fuente: FA }));
    const regla = si ? 'todas sus reglas se cumplen: ℓ menor que n, mₗ entre −ℓ y +ℓ, mₛ = ±½' : meta.regla;
    return cerrar({ enunciado: ['Un juego (n; ℓ; mₗ; mₛ) describe un electrón del átomo.'],
      pregunta: [si ? '¿Cuál de estos juegos de números cuánticos sí puede existir?' : '¿Cuál de estos juegos de números cuánticos no puede existir?'],
      datos: [D.lDe, 'mₗ va de −ℓ a +ℓ', D.ms], alternativas: P.armarTexto({ correcta: c, errores, rng }), valor: c.clave,
      solucion: [[`En ${c.texto}, ${regla}.`], [si ? 'En los otros, alguna regla se rompe.' : 'Los otros cumplen las tres reglas.']],
      _datos: { tipo: 'imposible', nivel: 3, sub: si ? 'si' : 'no', juegos: [meta.q, ...otros.map(x => x.q)] } });
  }

  // ---- condicion: cuántos electrones con n y una segunda condición ----
  function tCondicion(rng) {
    if (rng.entero(0, 2) > 0) {
      const n = rng.entero(3, 4), ml = rng.elegir([-2, -1, 1, 2].filter(m => Math.abs(m) <= n - 1)), k = conMl(n, ml), subs = valoresL(n).filter(l => l >= Math.abs(ml));
      const errores = [
        e(2, 'QM-SOLO-ULTIMO', `Bien dos electrones por orbital. Pero hay un orbital con mₗ = ${ML(ml)} en cada subnivel donde cabe (${lista(subs.map(l => sub(n, l)))}). Así salen 2.`),
        e(k / 2, 'QM-ORBITAL-ELECTRON', `Bien hallar los orbitales con mₗ = ${ML(ml)}: ${k / 2}. Pero en cada uno caben dos electrones.`),
        e(eNivel(n), 'QM-CONDICION-IGNORA', `Bien lo que cabe en el nivel ${n}: ${eNivel(n)}. Pero piden solo los electrones con mₗ = ${ML(ml)}.`),
        e(2 * n, 'QM-ML-FUERA', `Bien contar un orbital por subnivel. Pero ${Math.abs(ml) > 1 ? `el ${sub(n, 0)} y el ${sub(n, 1)} no tienen` : `el ${sub(n, 0)} no tiene`} mₗ = ${ML(ml)}: su ℓ es menor que ${Math.abs(ml)}. Así salen ${2 * n}.`),
      ];
      return cerrar({ variables: usa('e'), enunciado: [`En un átomo, el nivel n = ${n} está completamente lleno.`],
        pregunta: ['¿Cuántos ', v('e', 'electrones'), ` de ese nivel tienen mₗ = ${ML(ml)}?`],
        datos: [D.lDe, D.mlDe, D.dos], alternativas: numericas(rng, k, errores), valor: k,
        solucion: [[`mₗ = ${ML(ml)} existe solo donde ℓ ≥ ${Math.abs(ml)}: ${lista(subs.map(l => sub(n, l)))}.`],
          [`Un orbital con ese mₗ en cada uno, con dos electrones: 2 · ${subs.length} = `, v('e', `${k} electrones`), '.']],
        _datos: { tipo: 'condicion', nivel: 3, sub: 'ml', n, ml } });
    }
    const n = rng.entero(2, 4), m2 = rng.elegir([1, -1]), k = conMs(n);
    const errores = [
      e(eNivel(n), 'QM-CONDICION-IGNORA', `Bien lo que cabe en el nivel ${n}: ${eNivel(n)}. Pero solo la mitad tiene mₛ = ${MS2(m2)}: uno por orbital.`),
      e(n, 'QM-N-L', `Bien un electrón con ese espín en cada lugar. Pero hay que contar orbitales, no subniveles: así salen ${n}.`),
      e(2 * n, 'QM-2N', `Bien pensar en el nivel ${n}. Pero 2 · ${n} no cuenta los orbitales del nivel: cada subnivel tiene 2ℓ + 1. Así salen ${2 * n}.`),
      e(orbSub(n - 1), 'QM-SOLO-ULTIMO', `Bien un electrón por orbital. Pero contaste solo el ${sub(n, n - 1)}: el nivel tiene también los subniveles de abajo. Así salen ${orbSub(n - 1)}.`),
    ];
    return cerrar({ variables: usa('e', 'o'), enunciado: [`En un átomo, el nivel n = ${n} está completamente lleno.`],
      pregunta: ['¿Cuántos ', v('e', 'electrones'), ` de ese nivel tienen mₛ = ${MS2(m2)}?`],
      datos: [D.lDe, D.orbitales, D.dos], alternativas: numericas(rng, k, errores), valor: k,
      solucion: [[`El nivel ${n} tiene ${valoresL(n).map(orbSub).join(' + ')} = `, v('o', `${orbNivel(n)} orbitales`), '.'],
        [`En cada orbital lleno hay una ↑ y una ↓: uno con mₛ = ${MS2(m2)}. Son `, v('e', `${k} electrones`), '.']],
      _datos: { tipo: 'condicion', nivel: 3, sub: 'ms', n, ms: m2 / 2 } });
  }

  const TIPOS = ['orb-sub', 'e-sub', 'valores', 'orb-nivel', 'e-nivel', 'subnivel', 'imposible', 'imposible', 'condicion', 'condicion'];
  const CONSTRUIR = { 'orb-sub': tOrbSub, 'e-sub': tESub, valores: tValores, 'orb-nivel': tOrbNivel, 'e-nivel': tENivel, subnivel: tSubnivel,
    imposible: tImposible, condicion: tCondicion };
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const p = CONSTRUIR[tipo](rng);
      if (p && p.alternativas.length >= 4) return { id: `${ID}#${semilla}`, ...p };
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Pisos, pasillos y cuartos: niveles y orbitales', generar, COLOR, TIPOS: [...new Set(TIPOS)],
    orbSub, eSub, orbNivel, eNivel, conMl, conMs, posible, valoresL, valoresMl, juego };
});
