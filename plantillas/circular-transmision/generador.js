/*
 * Generador G2: transmisión del movimiento circular (tipo C3 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-transmision']) y en Node (require). No usa ningún motor:
 * calcula todo por su cuenta.
 *
 * Tipos:
 *   tren       de 2 a 4 ruedas unidas por faja, faja cruzada, contacto o eje; se pide la ω de la última
 *              (en rad/s, en rpm, o dada en rpm y pedida en rad/s, con π indicado)
 *   contacto   3 o 4 discos en fila, cada uno en contacto con el siguiente; ω del último
 *   sentido    tren con fajas cruzadas o contactos; se pide la ω de la última con su sentido
 *              (horario o antihorario): una sola magnitud, la velocidad angular con signo
 *   bloque     polea simple con motor → faja → polea de dos gargantas → cuerda con un bloque;
 *              rapidez del bloque (radios o diámetros, ω en rad/s o en rpm)
 *   movil      dos tambores enrollan (o sueltan) las dos cuerdas de una polea móvil con un bloque;
 *              rapidez del bloque (la semisuma, o la semidiferencia)
 *   alfa       reducción que arranca con aceleración angular: tren de 2 o 3 ruedas; α de la última
 *
 * Convenciones:
 *   - Faja, faja cruzada y contacto: los bordes van igual de rápido (misma v = ω·r) y, si arrancan,
 *     tienen la misma aceleración tangencial (aT = α·r). Mismo eje: misma ω y misma α.
 *   - Faja abierta conserva el sentido; faja cruzada y contacto lo invierten.
 *   - Radios en cm; rapideces del bloque en m/s. Con rpm pedidas en rad/s, la respuesta lleva π
 *     indicado («3π rad/s»), y sus distractores también.
 *   - En «sentido», el valor numérico es positivo si gira en sentido horario y negativo si no.
 * Errores: hipótesis (códigos CI-* del mapa y los de la pestaña «Ruedas»); RM5 con su informe.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const NOMBRES = ['A', 'B', 'C', 'D'];
  const COLORES = ['o', 'i', 'h', 'd'];
  const RADIOS = [5, 10, 15, 20, 25, 30, 40, 50, 60];
  const W_RAD = [4, 6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 60];
  const W_RPM = [30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 450, 600, 720, 900, 1200];
  const INVIERTE = { faja: false, cruzada: true, engranaje: true, eje: false };

  const corto = (x, dec = 2) => x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;

  function generar(semilla) {
    const rng = Azar.crear('circular-transmision|' + semilla);
    const tipo = rng.elegir(['tren', 'tren', 'contacto', 'sentido', 'bloque', 'bloque', 'movil', 'alfa']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Ruedas en cadena: la primera sin unión; cada otra con la unión a la anterior.
  function cadena(rng, n, pool, conInversor) {
    const ruedas = [{ r: rng.elegir(RADIOS), union: null }];
    for (let k = 1; k < n; k++) {
      let union;
      do union = rng.elegir(pool); while (union === 'eje' && ruedas[k - 1].union === 'eje');
      let r;
      do r = rng.elegir(RADIOS); while (r === ruedas[k - 1].r);
      ruedas.push({ r, union });
    }
    if (ruedas.every(q => q.union === null || q.union === 'eje')) return null;
    if (conInversor && !ruedas.some(q => q.union && INVIERTE[q.union])) return null;
    return ruedas;
  }
  // Recorre la cadena con una regla para las uniones que comparten v y otra para el eje.
  function recorrer(ruedas, w1, reglaV, reglaEje = (w) => w) {
    let w = w1;
    for (let k = 1; k < ruedas.length; k++) {
      const rp = ruedas[k - 1].r, rn = ruedas[k].r;
      w = ruedas[k].union === 'eje' ? reglaEje(w, rp, rn, k) : reglaV(w, rp, rn, k);
    }
    return w;
  }
  const bien = (w, rp, rn) => w * rp / rn;
  // Sentido de la última (+1 como la primera), según qué uniones se crea que invierten.
  const signo = (ruedas, inv) => ruedas.slice(1).reduce((s, q) => (inv[q.union] ? -s : s), 1);

  function textoUnion(q, X, prev) {
    const r = `${q.r} cm`;
    if (q.union === 'faja') return [`La rueda `, X, `, de ${r} de radio, está unida a la rueda ${prev} por una faja que no resbala.`];
    if (q.union === 'cruzada') return [`La rueda `, X, `, de ${r} de radio, está unida a la rueda ${prev} por una faja cruzada (en forma de 8) que no resbala.`];
    if (q.union === 'engranaje') return [`La rueda `, X, `, de ${r} de radio, está en contacto con el borde de la rueda ${prev} y gira sin resbalar.`];
    return [`La rueda `, X, `, de ${r} de radio, está fija al mismo eje que la rueda ${prev}.`];
  }

  function construir(rng, semilla, tipo) {
    if (tipo === 'bloque') return bloque(rng, semilla);
    if (tipo === 'movil') return movil(rng, semilla);
    const n = tipo === 'contacto' ? rng.elegir([3, 4]) : tipo === 'alfa' ? rng.elegir([2, 3]) : tipo === 'sentido' ? rng.elegir([3, 4]) : rng.elegir([2, 3, 3, 4]);
    const pool = tipo === 'contacto' ? ['engranaje'] : tipo === 'sentido' ? ['faja', 'cruzada', 'engranaje', 'eje'] : ['faja', 'faja', 'cruzada', 'engranaje', 'eje'];
    const ruedas = cadena(rng, n, pool, tipo === 'sentido');
    if (!ruedas) return null;
    const modo = tipo === 'alfa' || tipo === 'sentido' || tipo === 'contacto' ? rng.elegir(['rad', 'rad', 'rpm']) : rng.elegir(['rad', 'rpm', 'rpm-rad']);
    const modoF = tipo === 'alfa' || tipo === 'sentido' ? 'rad' : modo;
    const w1 = tipo === 'alfa' ? rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]) : rng.elegir(modoF === 'rad' ? W_RAD : W_RPM);
    const wn = recorrer(ruedas, w1, bien);
    // Lo que ve el alumno: rad/s, rpm, o rpm convertidas a rad/s (π indicado).
    const pi = modoF === 'rpm-rad';
    const conv = w => (pi ? w * Math.PI / 30 : w);
    const correctaMag = conv(wn);
    if (pi ? !P.pi(correctaMag, '', 4) : !corto(correctaMag, modoF === 'rpm' ? 1 : 2)) return null;
    const ultimo = NOMBRES[n - 1];
    const variables = {};
    ruedas.forEach((q, k) => { variables[NOMBRES[k]] = { nombre: `rueda ${NOMBRES[k]}`, color: COLORES[k] }; });
    const X = k => v(NOMBRES[k], NOMBRES[k]);
    const uW = tipo === 'alfa' ? 'rad/s²' : modoF === 'rad' ? 'rad/s' : 'rpm';
    const mag = tipo === 'alfa' ? 'α' : 'ω';
    const sentidoA = tipo === 'sentido' ? rng.elegir(['horario', 'antihorario']) : null;

    const enunciado = [];
    if (tipo === 'alfa') enunciado.push('La rueda ', X(0), `, de ${ruedas[0].r} cm de radio, parte del reposo con una aceleración angular constante de `, v('A', `${w1} rad/s²`), '. ');
    else if (sentidoA) enunciado.push('La rueda ', X(0), `, de ${ruedas[0].r} cm de radio, gira a `, v('A', `${w1} rad/s`), ` en sentido ${sentidoA}. `);
    else enunciado.push('La rueda ', X(0), `, de ${ruedas[0].r} cm de radio, gira a `, v('A', `${w1} ${modoF === 'rad' ? 'rad/s' : 'rpm'}`), '. ');
    for (let k = 1; k < n; k++) { enunciado.push(...textoUnion(ruedas[k], X(k), NOMBRES[k - 1])); if (k < n - 1) enunciado.push(' '); }

    let pregunta;
    if (tipo === 'alfa') pregunta = [`¿Cuál es la aceleración angular de la rueda `, X(n - 1), '?'];
    else if (sentidoA) pregunta = [`¿Con qué rapidez angular, y en qué sentido, gira la rueda `, X(n - 1), '?'];
    else if (modoF === 'rpm') pregunta = [`¿A cuántas rpm gira la rueda `, X(n - 1), '?'];
    else if (pi) pregunta = [`¿Con qué rapidez angular gira la rueda `, X(n - 1), ', en rad/s?'];
    else pregunta = [`¿Con qué rapidez angular gira la rueda `, X(n - 1), '?'];

    // Errores, en las unidades de la ω de la primera rueda.
    const hayEje = ruedas.some(q => q.union === 'eje');
    const vLinks = ruedas.map((q, k) => k).filter(k => k > 0 && ruedas[k].union !== 'eje');
    const ultimaV = vLinks[vLinks.length - 1];
    const enLaCadena = [];
    if (tipo === 'alfa') {
      enLaCadena.push(h('CI-alfa-igual-con-faja', recorrer(ruedas, w1, w => w), 'Tomaste la misma aceleración angular en las ruedas unidas por la faja. Lo que comparten es la aceleración tangencial del borde, aT = α·r: la rueda más chica tiene más α.'));
    } else {
      enLaCadena.push(h('omega-igual-con-faja', recorrer(ruedas, w1, w => w), tipo === 'contacto'
        ? 'Tomaste la misma rapidez angular en los discos en contacto. Lo que comparten es la rapidez del borde, v = ω·r: el disco más chico gira más rápido.'
        : 'Tomaste la misma rapidez angular en las ruedas unidas por faja o en contacto. Lo que comparten es la rapidez del borde, v = ω·r: la rueda más chica gira más rápido.'));
    }
    if (tipo === 'contacto') {
      enLaCadena.push(h('CI-cadena-directa', recorrer(ruedas, w1, (w, rp, rn) => w * rn / rp), 'Recorriste la cadena como si el disco más grande girara más rápido. En cada contacto se comparte v, así que ω va al revés que el radio: ωfinal = ωA·rA/rúltimo.'));
    } else {
      enLaCadena.push(h('RM5-proporcion-directa', recorrer(ruedas, w1, (w, rp, rn) => w * rn / rp), `Usaste la razón de radios al revés, como si la rueda más grande girara más rápido. Con la misma v en el borde, ${mag} = ${tipo === 'alfa' ? 'aT' : 'v'}/r: a mayor radio, menor ${mag}.`, RM));
    }
    enLaCadena.push(h('radio-al-cuadrado', recorrer(ruedas, w1, (w, rp, rn) => w * (rp / rn) ** 2), `Elevaste al cuadrado la razón de radios. En cada faja o contacto, ${mag} cambia en la razón de los radios, sin cuadrado.`));
    if (hayEje) enLaCadena.push(h('v-igual-en-eje', recorrer(ruedas, w1, bien, bien), `En el mismo eje tomaste la misma rapidez del borde. Las ruedas fijas a un mismo eje giran juntas: tienen la misma ${mag}, no la misma v.`));
    if (vLinks.length >= 2) enLaCadena.push(h('CI-solo-ultima-pareja', w1 * ruedas[ultimaV - 1].r / ruedas[ultimaV].r, `Usaste solo la última unión. Cada faja o contacto de la cadena cambia la ${mag} de la rueda siguiente: hay que recorrer la cadena desde A.`));

    let errores, correcta, texto, negativos = false;
    if (sentidoA) {
      const s0 = sentidoA === 'horario' ? 1 : -1;
      const sOk = s0 * signo(ruedas, INVIERTE);
      correcta = sOk * wn;
      errores = [
        h('CI-sentido-contacto-igual', s0 * signo(ruedas, { cruzada: true }) * wn, 'Las ruedas en contacto giran en sentidos contrarios: el borde de una empuja el de la otra hacia el lado opuesto.'),
        h('CI-sentido-cruzada-igual', s0 * signo(ruedas, { engranaje: true }) * wn, 'La faja cruzada (en forma de 8) invierte el sentido de giro; solo la faja abierta lo conserva.'),
        h('CI-sentido-faja-invierte', s0 * signo(ruedas, { faja: true, cruzada: true, engranaje: true }) * wn, 'La faja abierta no invierte el sentido: las dos ruedas giran hacia el mismo lado. Solo la faja cruzada y el contacto lo invierten.'),
        ...enLaCadena.map(e => ({ ...e, valor: sOk * e.valor })),
      ];
      negativos = true;
      texto = x => `${f(Math.abs(x))} rad/s, en sentido ${x > 0 ? 'horario' : 'antihorario'}`;
      errores = errores.filter(e => corto(Math.abs(e.valor)));
    } else if (pi) {
      correcta = correctaMag;
      errores = [
        h('CI-rpm-sin-60', wn * 2 * Math.PI, 'Pasaste de rpm a rad/s sin dividir entre 60: las rpm son vueltas por minuto, y un minuto tiene 60 s.'),
        h('CI-rpm-sin-2pi', wn * Math.PI / 60, 'Multiplicaste por π en vez de 2π: una vuelta son 2π rad.'),
        ...enLaCadena.map(e => ({ ...e, valor: conv(e.valor) })),
      ];
      texto = x => P.pi(x, 'rad/s');
    } else {
      correcta = wn;
      errores = enLaCadena.filter(e => corto(e.valor, 2));
      texto = x => `${f(x)} ${uW}`;
    }

    const solucion = [[tipo === 'alfa'
      ? 'Con faja o en contacto, los bordes tienen la misma aceleración tangencial (aT = α·r), así que α cambia al revés que el radio. En el mismo eje, α es la misma.'
      : 'Con faja o en contacto, los bordes van igual de rápido (v = ω·r es la misma), así que ω cambia al revés que el radio. En el mismo eje, ω es la misma.']];
    if (sentidoA) solucion.push(['La faja abierta conserva el sentido de giro; la faja cruzada y el contacto lo invierten.']);
    let w = w1, s = sentidoA === 'antihorario' ? -1 : 1;
    const nom = k => v(NOMBRES[k], `${mag}${NOMBRES[k]}`);
    for (let k = 1; k < n; k++) {
      const q = ruedas[k], rp = ruedas[k - 1].r;
      const nuevo = q.union === 'eje' ? w : w * rp / q.r;
      if (INVIERTE[q.union]) s = -s;
      const sent = sentidoA ? `; gira en sentido ${s > 0 ? 'horario' : 'antihorario'}` : '';
      if (q.union === 'eje') solucion.push([nom(k), ' = ', nom(k - 1), ` = ${f(nuevo)} ${uW} (mismo eje)${sent}.`]);
      else solucion.push([nom(k), ' = ', nom(k - 1), ` · ${rp}/${q.r} = ${f(w)} · ${rp}/${q.r} = ${f(nuevo)} ${uW}${sent}.`]);
      w = nuevo;
    }
    if (pi) solucion.push([`Se pasa a rad/s: ${f(wn)} rpm = ${f(wn)} · 2π/60 rad/s = `, v(ultimo, texto(correcta)), '.']);
    else solucion.push(['Respuesta: ', v(ultimo, texto(correcta)), '.']);

    const alternativas = P.armar({ correcta, errores, rng, texto, negativos, formato: pi ? 'pi' : null });
    // En «sentido», al menos una alternativa tiene que girar al otro lado.
    if (sentidoA && !alternativas.some(a => Math.sign(a.valor) !== Math.sign(correcta))) return null;
    return {
      id: `circular-transmision#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: pi ? 'rad/s' : uW },
      _datos: { tipo, modo: modoF, w1, ruedas, sentidoA },
    };
  }

  // Motor → polea A → faja → garganta g1 de la polea B (dos gargantas) → cuerda en la garganta g2 → bloque.
  function bloque(rng, semilla) {
    const rA = rng.elegir(RADIOS), R = rng.elegir(RADIOS.slice(2)), r = rng.elegir(RADIOS.filter(x => x < R));
    if (rA === R || rA === r) return null;
    const fajaEnMayor = rng.moneda();
    const g1 = fajaEnMayor ? R : r, g2 = fajaEnMayor ? r : R;
    const modo = rng.elegir(['rad', 'rad', 'rpm']);
    const diam = rng.moneda();
    const w1 = rng.elegir(modo === 'rad' ? W_RAD : W_RPM);
    const aRad = w => (modo === 'rad' ? w : w * Math.PI / 30);
    const vDe = (wA, rf, rb) => aRad(wA) * rA / rf * rb / 100; // m/s
    const correcta = vDe(w1, g1, g2);
    const pi = modo === 'rpm';
    if (pi ? !P.pi(correcta, '', 6) : !corto(correcta, 2)) return null;
    if (correcta > 12) return null; // un bloque que sube a más de 12 m/s no es creíble
    const med = x => (diam ? `${2 * x} cm de diámetro` : `${x} cm de radio`);
    const variables = { A: { nombre: 'polea A', color: 'o' }, B: { nombre: 'polea B', color: 'i' }, v: { nombre: 'rapidez del bloque', color: 'h' } };
    const enunciado = ['Un motor hace girar la polea ', v('A', 'A'), `, de ${med(rA)}, a `, v('A', `${w1} ${modo === 'rad' ? 'rad/s' : 'rpm'}`),
      '. Una faja que no resbala une A con la garganta ', fajaEnMayor ? 'mayor' : 'menor', ' de la polea ', v('B', 'B'),
      `, que tiene dos gargantas fijas al mismo eje: una de ${med(R)} y otra de ${med(r)}. Un bloque cuelga de una cuerda enrollada en la garganta `,
      fajaEnMayor ? 'menor' : 'mayor', ' de B, y la cuerda no resbala.'];
    const pregunta = ['¿Con qué rapidez sube el ', v('v', 'bloque'), '?'];
    const errores = [
      h('CI-bloque-radio-equivocado', aRad(w1) * rA / 100, 'Tomaste para el bloque la rapidez de la faja. La cuerda del bloque está enrollada en la otra garganta: su rapidez es ωB por el radio de esa garganta.'),
      h('omega-igual-con-faja', aRad(w1) * g2 / 100, 'Tomaste la misma rapidez angular en A y en B. La faja hace que sus bordes vayan igual de rápido (misma v), no que giren con la misma ω.'),
      h('RM5-proporcion-directa', aRad(w1) * g1 / rA * g2 / 100, 'Usaste la razón de radios al revés al pasar por la faja: con la misma v, la polea de mayor radio gira más despacio.', RM),
      h('inversa-en-eje', aRad(w1) * rA / 100 * g1 / g2, 'Pasaste de una garganta a la otra con la razón de radios al revés. En el mismo eje, ω es la misma; la rapidez del borde es mayor en la garganta de mayor radio.'),
    ];
    if (diam) errores.unshift(h('CI-diametro-por-radio', 2 * correcta, 'Usaste el diámetro donde va el radio: v = ω·r, y el radio es la mitad del diámetro.'));
    if (pi) errores.push(h('CI-rpm-sin-60', correcta * 60, 'Pasaste de rpm a rad/s sin dividir entre 60: las rpm son vueltas por minuto.'),
      h('CI-rpm-sin-2pi', correcta / 2, 'Multiplicaste por π en vez de 2π: una vuelta son 2π rad.'));
    const texto = x => (pi ? P.pi(x, 'm/s') : `${f(x)} m/s`);
    const wA = aRad(w1), wB = wA * rA / g1;
    const wTxt = w => (pi ? P.pi(w, 'rad/s') : `${f(w)} rad/s`);
    const solucion = [
      ...(pi ? [[v('A', `ωA = ${w1} rpm`), ` = ${w1} · 2π/60 rad/s = ${wTxt(wA)}.`]] : []),
      ...(diam ? [['Los radios son la mitad de los diámetros: ' + `A, ${rA} cm; B, ${R} cm y ${r} cm.`]] : []),
      ['La faja une el borde de A con la garganta de radio ', `${g1} cm`, ': misma v, así que ', v('B', 'ωB'), ` = ωA · ${rA}/${g1} = ${wTxt(wB)}.`],
      ['Las dos gargantas de B giran juntas (mismo eje). La cuerda del bloque sale de la garganta de radio ', `${g2} cm = ${f(g2 / 100)} m`, ': ', v('v', 'v'), ` = ωB · r = ${wTxt(wB)} · ${f(g2 / 100)} m = `, v('v', texto(correcta)), '.'],
    ];
    const alternativas = P.armar({ correcta, errores: pi ? errores : errores.filter(e => corto(e.valor, 2)), rng, texto, formato: pi ? 'pi' : null });
    return {
      id: `circular-transmision#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'm/s' },
      _datos: { tipo: 'bloque', modo, w1, rA, R, r, fajaEnMayor, diametros: diam },
    };
  }

  // Polea móvil: dos tambores (radios r1 y r2, en cm) giran con ω1 y ω2; cada uno enrolla una cuerda
  // que baja, abraza la polea móvil y sube. Si los dos enrollan, el bloque sube a (v1 + v2)/2; si uno
  // suelta, a (v1 − v2)/2 hacia donde manda el que va más rápido.
  function movil(rng, semilla) {
    const r1 = rng.elegir([5, 10, 15, 20, 25, 30]), r2 = rng.elegir([5, 10, 15, 20, 25, 30]);
    const w1 = rng.elegir([2, 4, 5, 6, 8, 10, 12]), w2 = rng.elegir([2, 4, 5, 6, 8, 10, 12]);
    const v1 = w1 * r1 / 100, v2 = w2 * r2 / 100;
    const suelta = rng.moneda();
    if (Math.abs(v1 - v2) < 1e-9) return null;
    const correcta = suelta ? Math.abs(v1 - v2) / 2 : (v1 + v2) / 2;
    if (!corto(correcta, 2)) return null;
    const sube = !suelta || v1 > v2;
    const variables = { A: { nombre: 'tambor 1', color: 'o' }, B: { nombre: 'tambor 2', color: 'i' }, v: { nombre: 'rapidez del bloque', color: 'h' } };
    const enunciado = ['Un bloque cuelga de una polea móvil. Una cuerda pasa por debajo de la polea; sus dos tramos suben verticalmente y cada extremo está enrollado en un tambor fijo al techo. El ',
      v('A', 'tambor 1'), `, de ${r1} cm de radio, gira a `, v('A', `${w1} rad/s`), ' y enrolla su extremo de la cuerda. El ', v('B', 'tambor 2'), `, de ${r2} cm de radio, gira a `, v('B', `${w2} rad/s`),
      suelta ? ' y suelta su extremo.' : ' y también enrolla su extremo.', ' La cuerda no resbala en los tambores.'];
    const pregunta = ['¿Con qué rapidez se mueve el ', v('v', 'bloque'), '?'];
    const errores = [
      h('CI-polea-movil-una-cuerda', Math.max(v1, v2), 'Tomaste la rapidez de una sola cuerda. El bloque cuelga de la polea móvil, que se mueve con el promedio de lo que suben (o bajan) sus dos cuerdas.'),
      h('CI-polea-movil-una-cuerda', suelta ? Math.abs(v1 - v2) : v1 + v2, `${suelta ? 'Restaste' : 'Sumaste'} las rapideces de las dos cuerdas y no dividiste entre 2. Cada cuerda que se acorta sube la polea solo la mitad, porque la cuerda pasa por los dos lados de la polea.`),
      h('CI-polea-movil-sentido', suelta ? (v1 + v2) / 2 : Math.abs(v1 - v2) / 2, suelta ? 'Tomaste las dos cuerdas como si se enrollaran. El tambor 2 suelta su cuerda: ese lado baja, y su rapidez se resta.' : 'Restaste las rapideces, pero los dos tambores enrollan: los dos lados suben, y las rapideces se suman.'),
      h('CI-polea-movil-una-cuerda', Math.min(v1, v2), 'Tomaste la rapidez de una sola cuerda. La polea móvil se mueve con el promedio de lo que suben (o bajan) sus dos cuerdas.'),
    ].filter(e => corto(e.valor, 2));
    const texto = x => `${f(x)} m/s`;
    const solucion = [
      ['Cada tambor mueve su cuerda con la rapidez de su borde, v = ω·r: ', v('A', `v1 = ${w1} · ${f(r1 / 100)} = ${f(v1)} m/s`), ' y ', v('B', `v2 = ${w2} · ${f(r2 / 100)} = ${f(v2)} m/s`), '.'],
      ['La polea móvil se mueve con el promedio de lo que se acortan sus dos cuerdas por segundo; la que se suelta cuenta con signo menos.'],
      suelta && !sube
        ? [v('v', 'v'), ` = (${f(v1)} − ${f(v2)})/2 = −${f(correcta)} m/s: el signo menos dice que el bloque baja, con una rapidez de `, v('v', texto(correcta)), '.']
        : [v('v', 'v'), ` = (${f(v1)} ${suelta ? '−' : '+'} ${f(v2)})/2 = `, v('v', texto(correcta)), ', hacia arriba.'],
    ];
    const alternativas = P.armar({ correcta, errores, rng, texto });
    return {
      id: `circular-transmision#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'm/s' },
      _datos: { tipo: 'movil', r1, r2, w1, w2, suelta },
    };
  }

  return { id: 'circular-transmision', titulo: 'Ruedas, fajas y poleas', generar };
});
