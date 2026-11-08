/*
 * Generador G5: aceleración total y sus componentes (tipo C9 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-aceleracion-total']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   radio        rapidez, aceleración tangencial y el ángulo (37° o 53°) entre a y v; se pide el radio
 *   componentes  rapidez, radio (o diámetro) y el ángulo entre a y v (37°, 53°, 30°, 45° o 60°); se pide
 *                aT o |a|
 *   reposo       parte del reposo con α constante: el ángulo girado cuando acp = k·aT (θ = k/2 rad,
 *                sin importar el radio ni α), o la tangente del ángulo entre a y v tras girar θ (2θ)
 *   inicial      un punto con rapidez inicial y aT constante: la acp (o |a|) después de girar θ
 *                (acp = acp0 + 2·aT·θ), o la acp en un instante con ω0, α y t
 *
 * Convenciones: el triángulo de aceleraciones tiene aT sobre la velocidad, acp hacia el centro y a
 * como hipotenusa; el ángulo dado es el de a con v, así que tan θ = acp/aT. Con 37° y 53° se usan los
 * valores de academia (sen 37° = 0,6, cos 37° = 0,8). Con 30°, 45° y 60°, las respuestas pueden llevar
 * raíz («4√3 m/s²»), escrita con P.radical en todas las alternativas.
 * Errores: TR9 (parcial, docs/investigacion/trigonometria-ideas-erroneas.md) para seno y coseno o la
 * razón equivocada; los del motor (a-suma-sin-pitagoras, acp-con-omega0) y los CI-* del mapa, hipótesis.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const TRI = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: TRI });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  // Un valor que P.radical escribe limpio: decimal corto o a√b (o a√b/2) con b sin cuadrados.
  const conRaiz = x => Number.isFinite(x) && x > 0 && x < 1e4 && (corto(x) || !/,/.test(P.radical(x)));
  // Razones de los ángulos que se usan (37° y 53° con los valores de academia).
  const TRIG = {
    37: { sen: 0.6, cos: 0.8, tan: 0.75, sTxt: '3/5', cTxt: '4/5', tTxt: '3/4' },
    53: { sen: 0.8, cos: 0.6, tan: 4 / 3, sTxt: '4/5', cTxt: '3/5', tTxt: '4/3' },
    30: { sen: 0.5, cos: Math.sqrt(3) / 2, tan: 1 / Math.sqrt(3), sTxt: '1/2', cTxt: '√3/2', tTxt: '√3/3' },
    45: { sen: Math.SQRT1_2, cos: Math.SQRT1_2, tan: 1, sTxt: '√2/2', cTxt: '√2/2', tTxt: '1' },
    60: { sen: Math.sqrt(3) / 2, cos: 0.5, tan: Math.sqrt(3), sTxt: '√3/2', cTxt: '1/2', tTxt: '√3' },
  };
  const OBJ = [['Un disco', 'del disco'], ['Una rueda', 'de la rueda'], ['Un volante', 'del volante'], ['Una polea', 'de la polea']];
  const acTxt = x => `${P.radical(x)} m/s²`;

  function generar(semilla) {
    const rng = Azar.crear('circular-aceleracion-total|' + semilla);
    const [tipo, sub] = rng.elegir([['radio'], ['radio'], ['componentes', 'at'], ['componentes', 'a'], ['componentes', 'at'], ['reposo', 'theta'], ['reposo', 'theta'], ['reposo', 'tangente'],
      ['inicial', 'acp'], ['inicial', 'modulo'], ['inicial', 'instante']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'radio') return radio(rng, semilla);
    if (tipo === 'componentes') return componentes(rng, semilla, sub);
    if (tipo === 'reposo') return reposo(rng, semilla, sub);
    return inicial(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    const ok = o.raiz ? conRaiz : (x => corto(x));
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => ok(e.valor)), rng, texto: o.texto });
    return {
      id: `circular-aceleracion-total#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const VAR = { v: { nombre: 'rapidez', color: 'o' }, at: { nombre: 'aceleración tangencial', color: 'i' }, ac: { nombre: 'aceleración centrípeta', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  // ---- radio: del ángulo entre a y v ----
  function radio(rng, semilla) {
    const ang = rng.elegir([37, 53]), T = TRIG[ang];
    const at = rng.elegir([1, 1.5, 2, 3, 4, 6, 8, 9, 12]), vv = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15]);
    const acp = at * T.tan, R = vv * vv / acp;
    // En autos, la aceleración total no pasa de 6 m/s².
    if (!corto(acp) || !corto(R) || R > 150 || R < 0.5 || (vv <= 6 && R > 5) || Math.hypot(at, acp) > 6) return null;
    const enunciado = [`${vv > 6 ? 'Un auto' : 'Un auto de juguete'} recorre una pista circular. En cierto instante su rapidez es `, v('v', `${vv} m/s`), ', su aceleración tangencial es ',
      v('at', `${f(at)} m/s²`), ` y su aceleración total forma ${ang}° con la velocidad.`];
    const pregunta = ['¿Cuál es el ', v('x', 'radio'), ' de la pista?'];
    const errores = [
      pa('TR9-sen-cos-cambiados', vv * vv / (at / T.tan), `Pusiste las componentes al revés en la tangente. El ángulo se mide desde la velocidad: el cateto adyacente es aT y el opuesto es acp, así que tan ${ang}° = acp/aT.`),
      h('CI-at-ac-cambiadas', vv * vv / at, 'Usaste la aceleración tangencial como si fuera la centrípeta. En r = v²/acp va la componente que apunta al centro.'),
      h('acp-sin-cuadrado', vv / acp, 'Dividiste la rapidez entre acp sin elevarla al cuadrado: acp = v²/r, así que r = v²/acp.'),
      pa('TR9-razon-equivocada', vv * vv / (at * T.sen), `Usaste el seno donde va la tangente: con aT como cateto adyacente, acp = aT · tan ${ang}°.`),
    ];
    const solucion = [
      ['En el triángulo de aceleraciones, ', v('at', 'aT'), ' va sobre la velocidad y ', v('ac', 'acp'), ` es perpendicular: tan ${ang}° = acp/aT.`],
      [v('ac', 'acp'), ` = aT · tan ${ang}° = ${f(at)} · ${T.tTxt} = ${f(acp)} m/s².`],
      [v('x', 'r'), ' = ', v('v', 'v'), '²/', v('ac', 'acp'), ` = ${vv}²/${f(acp)} = `, v('x', `${f(R)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: R, errores, texto: x => `${f(x)} m`, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'radio', angulo: ang, v: vv, at } });
  }

  // ---- componentes: aT o |a| con v, r y el ángulo ----
  function componentes(rng, semilla, pide) {
    const ang = rng.elegir([37, 53, 37, 53, 30, 45, 60]), T = TRIG[ang];
    const vv = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]), R = rng.elegir([0.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20, 25]);
    const acp = vv * vv / R;
    if (!corto(acp) || acp > 60 || acp < 1) return null;
    const at = acp / T.tan, a = acp / T.sen;
    const correcta = pide === 'at' ? at : a;
    const raiz = ang === 30 || ang === 45 || ang === 60;
    if (!conRaiz(correcta) || (R > 2 && a > 6)) return null;
    if (R <= 2 && vv > 6) return null;
    const diam = rng.moneda() && R >= 1;
    const [Obj] = rng.elegir(OBJ);
    const medida = v('ac', diam ? `${f(2 * R)} m de diámetro` : `${f(R)} m de radio`);
    const enunciado = R > 2
      ? ['Un auto recorre una pista circular de ', medida, ' y aumenta su rapidez. En cierto instante va a ', v('v', `${vv} m/s`), ` y su aceleración total forma ${ang}° con su velocidad.`]
      : [`${Obj} de `, medida, ' gira cada vez más rápido. En cierto instante, un punto del borde va a ', v('v', `${vv} m/s`), ` y su aceleración total forma ${ang}° con su velocidad.`];
    const quien = R > 2 ? 'del auto' : 'de ese punto';
    const pregunta = pide === 'at' ? ['¿Cuál es la ', v('x', 'aceleración tangencial'), ` ${quien}?`] : ['¿Cuál es el módulo de la ', v('x', 'aceleración total'), ` ${quien}?`];
    const ac0 = vv / R; // la «acp» sin el cuadrado
    const errores = pide === 'at' ? [
      pa('TR9-sen-cos-cambiados', acp * T.tan, `Pusiste las componentes al revés en la tangente. Con el ángulo medido desde la velocidad, tan ${ang}° = acp/aT, así que aT = acp/tan ${ang}°.`),
      h('acp-sin-cuadrado', ac0 / T.tan, 'Calculaste la aceleración centrípeta como v/r, sin el cuadrado: acp = v²/r.'),
      h('CI-total-por-tangencial', acp / T.sen, 'Ese es el módulo de la aceleración total, la hipotenusa del triángulo. La tangencial es el cateto que va sobre la velocidad.'),
      pa('TR9-razon-equivocada', acp * T.cos, `Multiplicaste acp por cos ${ang}°. aT y acp son los dos catetos: los une la tangente, aT = acp/tan ${ang}°.`),
      ...(diam ? [h('CI-diametro-por-radio', at / 2, 'Usaste el diámetro como radio en acp = v²/r: el radio es la mitad del diámetro.')] : []),
    ] : [
      h('a-suma-sin-pitagoras', at + acp, 'Sumaste las dos componentes como números. aT y acp son perpendiculares: el módulo de la total sale con Pitágoras (o con el seno del ángulo).'),
      pa('TR9-sen-cos-cambiados', acp / T.cos, `Cambiaste seno y coseno. acp es el cateto opuesto al ángulo de ${ang}° (medido desde la velocidad): a = acp/sen ${ang}°.`),
      h('a-solo-centripeta', acp, 'Esa es solo la aceleración centrípeta. Como la rapidez cambia, también hay aceleración tangencial, y la total es la hipotenusa.'),
      h('acp-sin-cuadrado', ac0 / T.sen, 'Calculaste la aceleración centrípeta como v/r, sin el cuadrado: acp = v²/r.'),
      ...(diam ? [h('CI-diametro-por-radio', a / 2, 'Usaste el diámetro como radio en acp = v²/r: el radio es la mitad del diámetro.')] : []),
    ];
    const solucion = [
      ...(diam ? [['El radio es la mitad del diámetro: ', v('ac', `r = ${f(R)} m`), '.']] : []),
      [v('ac', 'acp'), ' = ', v('v', 'v'), `²/r = ${vv}²/${f(R)} = ${f(acp)} m/s².`],
      ['En el triángulo de aceleraciones, ', v('at', 'aT'), ' va sobre la velocidad, ', v('ac', 'acp'), ` es el cateto opuesto al ángulo de ${ang}° y a es la hipotenusa.`],
      pide === 'at'
        ? [v('x', 'aT'), ` = acp/tan ${ang}° = ${f(acp)} ÷ ${T.tTxt} = `, v('x', acTxt(correcta)), '.']
        : [v('x', 'a'), ` = acp/sen ${ang}° = ${f(acp)} ÷ ${T.sTxt} = `, v('x', acTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { raiz, correcta, errores, texto: acTxt, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'componentes', pide, angulo: ang, v: vv, r: R, diametro: diam } });
  }

  // ---- reposo: acp/aT = 2θ ----
  function reposo(rng, semilla, sub) {
    const R = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), al = rng.elegir([0.5, 2, 3, 4, 5, 6, 8]);
    const [Obj] = rng.elegir(OBJ);
    const el = Obj.toLowerCase().replace(/^un /, 'el ').replace(/^una /, 'la ');
    const variables = { al: { nombre: 'aceleración angular', color: 'o' }, r: { nombre: 'distancia al eje', color: 'i' }, k: { nombre: 'razón acp/aT', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const base = [`${Obj} parte del reposo y gira con aceleración angular constante de `, v('al', `${f(al)} rad/s²`), '. Una marca está a ', v('r', `${f(R)} m`), ' del eje.'];
    if (sub === 'theta') {
      const k = rng.elegir([0.5, 1, 1, 1.5, 2, 3, 4, 5, 6]);
      const correcta = k / 2;
      const kTxt = k === 1 ? ['la aceleración centrípeta de la marca es ', v('k', 'igual'), ' a su aceleración tangencial']
        : k === 0.5 ? ['la aceleración centrípeta de la marca es ', v('k', 'la mitad'), ' de su aceleración tangencial']
        : ['la aceleración centrípeta de la marca es ', v('k', `${f(k)} veces`), ' su aceleración tangencial'];
      const enunciado = base;
      const pregunta = ['¿Qué ', v('x', 'ángulo'), ` ha girado ${el} cuando `, ...kTxt, '?'];
      const errores = [
        h('CI-sin-el-2', k, 'Usaste ω² = α·θ sin el 2. Desde el reposo, ω² = 2·α·θ; con acp = ω²·r y aT = α·r, la razón acp/aT vale 2θ.'),
        h('CI-cociente-depende-del-radio', k * R / 2, 'Multiplicaste por la distancia al eje, pero el radio se cancela: acp/aT = ω²r/(αr) = 2θ, igual para todas las marcas del disco.'),
        h('CI-cociente-depende-de-alfa', k / (2 * al), 'Dividiste entre α, pero α se cancela: ω² = 2αθ y aT = αr dan acp/aT = 2θ, sea cual sea α.'),
        h('CI-at-ac-cambiadas', 1 / (2 * k), 'Pusiste la razón al revés: acp/aT = 2θ, no aT/acp.'),
        h('CI-cociente-depende-de-alfa', k * al / 2, 'Multiplicaste por α, pero α se cancela: la razón acp/aT solo depende de lo girado.'),
      ];
      const solucion = [
        ['Desde el reposo, ω² = 2', v('al', 'α'), 'θ. Entonces ', v('k', 'acp/aT'), ' = ω²r/(', v('al', 'α'), v('r', 'r'), ') = 2θ: no dependen del radio ni de α.'],
        [v('x', 'θ'), ` = (acp/aT)/2 = ${f(k)}/2 = `, v('x', `${f(correcta)} rad`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} rad`, unidad: 'rad', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'reposo', sub, r: R, alfa: al, razon: k } });
    }
    const th = rng.elegir([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4]);
    const correcta = 2 * th;
    const enunciado = [...base, ` En cierto momento, ${el} ha girado `, v('k', `${f(th)} rad`), ' desde que arrancó.'];
    const pregunta = ['En ese momento, ¿cuánto vale la ', v('x', 'tangente'), ' del ángulo que forma la aceleración total de la marca con su velocidad?'];
    const errores = [
      h('CI-sin-el-2', th, 'Usaste ω² = α·θ sin el 2. Desde el reposo, ω² = 2·α·θ, y la tangente vale acp/aT = 2θ.'),
      h('CI-at-ac-cambiadas', 1 / (2 * th), 'Pusiste la razón al revés: esa es la tangente del ángulo con el radio. Con la velocidad, la tangente es acp/aT.'),
      h('CI-cociente-depende-del-radio', 2 * th * R, 'Multiplicaste por la distancia al eje, pero el radio se cancela: acp/aT = ω²r/(αr) = 2θ.'),
      h('CI-cociente-depende-de-alfa', 2 * th * al, 'Multiplicaste por α, pero α se cancela: acp/aT = 2αθ/α = 2θ.'),
      h('CI-cuadrado-de-theta', th * th, 'Elevaste lo girado al cuadrado. Desde el reposo, ω² = 2αθ: la tangente es 2θ, lineal en θ.'),
    ];
    const solucion = [
      ['La tangente del ángulo entre a y v es acp/aT (acp es el cateto opuesto; aT, el adyacente).'],
      ['Desde el reposo, ω² = 2', v('al', 'α'), 'θ, así que acp/aT = ω²r/(αr) = 2θ: no depende de ', v('r', 'r'), ' ni de ', v('al', 'α'), '.'],
      [v('x', 'tan'), ` = 2 · ${f(th)} = `, v('x', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: f, unidad: '', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'reposo', sub, r: R, alfa: al, theta: th } });
  }

  // ---- inicial: acp después de girar θ con aT constante, o en un instante ----
  // (aT, acp) con |a| exacto; aT a lo más 6 m/s², creíble para un auto.
  const TRIPLES = [[0.6, 0.8], [0.8, 0.6], [1.2, 1.6], [1.6, 1.2], [1.5, 2], [2, 1.5], [2.4, 3.2], [3, 4], [4, 3], [2.4, 1.8], [3.6, 4.8], [4.8, 3.6]];
  function inicial(rng, semilla, sub) {
    const variables = { v: { nombre: 'rapidez inicial', color: 'o' }, at: { nombre: 'aceleración tangencial', color: 'i' }, ac: { nombre: 'aceleración centrípeta', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'instante') {
      const w0 = rng.elegir([1, 2, 3, 4, 5]), al = rng.elegir([0.5, 1, 2, 3]), t = rng.elegir([1, 2, 3, 4]);
      const R = rng.elegir([0.1, 0.2, 0.25, 0.5, 1]);
      const w = w0 + al * t, correcta = w * w * R;
      if (!corto(correcta) || correcta > 80 || w > 12) return null;
      const [Obj] = rng.elegir(OBJ);
      const enunciado = [`${Obj} gira a `, v('v', `${w0} rad/s`), ' y, desde ese instante, acelera con aceleración angular constante de ', v('at', `${f(al)} rad/s²`), '. Una marca está a ',
        `${f(R)} m del eje.`];
      const pregunta = ['¿Cuál es la ', v('x', 'aceleración centrípeta'), ` de la marca ${t} s después?`];
      const errores = [
        h('acp-con-omega0', w0 * w0 * R, 'Usaste la rapidez angular del comienzo. La aceleración centrípeta cambia con ω: hay que calcular ω en ese instante.'),
        h('acp-sin-cuadrado', w * R, 'Multiplicaste ω por el radio sin elevar ω al cuadrado: eso es la rapidez de la marca. acp = ω²·r.'),
        h('CI-omega-media', ((w0 + w) / 2) ** 2 * R, 'Usaste la rapidez angular media del intervalo. La aceleración centrípeta es la del instante: con ω al final.'),
        h('CI-at-ac-cambiadas', al * R, 'Esa es la aceleración tangencial, aT = α·r. La centrípeta es ω²·r.'),
        h('CI-omega-sin-inicial', (al * t) ** 2 * R, 'Calculaste ω como si partiera del reposo. Ya giraba a ω0: ω = ω0 + α·t.'),
      ];
      const solucion = [
        ['Rapidez angular en ese instante: ω = ', v('v', 'ω0'), ' + ', v('at', 'α'), `·t = ${w0} + ${f(al)} · ${t} = ${f(w)} rad/s.`],
        [v('x', 'acp'), ` = ω²·r = ${f(w)}² · ${f(R)} = `, v('x', `${f(correcta)} m/s²`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} m/s²`, unidad: 'm/s²', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'inicial', sub, omega0: w0, alfa: al, t, r: R } });
    }
    let at, acpF, acp0, th, R, v0;
    if (sub === 'modulo') { [at, acpF] = rng.elegir(TRIPLES); }
    else { at = rng.elegir([0.5, 1, 1.5, 2, 3, 4]); acpF = null; }
    R = rng.elegir([0.5, 1, 2, 4, 5, 8]); v0 = rng.elegir([1, 2, 3, 4, 5, 6]);
    acp0 = v0 * v0 / R;
    if (!corto(acp0)) return null;
    if (sub === 'modulo') { th = (acpF - acp0) / (2 * at); if (!corto(th) || th < 0.2 || th > 6) return null; }
    else { th = rng.elegir([0.5, 1, 1.5, 2, 3]); acpF = acp0 + 2 * at * th; }
    if (Math.hypot(at, acpF) > 6) return null;
    const enunciado = ['Un auto de juguete recorre una pista circular de ', `${f(R)} m de radio. Pasa por un punto con rapidez de `, v('v', `${v0} m/s`),
      ' y, desde ahí, aumenta su rapidez con aceleración tangencial constante de ', v('at', `${f(at)} m/s²`), '.'];
    const pregunta = sub === 'modulo'
      ? ['¿Cuál es el módulo de su ', v('x', 'aceleración total'), ' cuando ha recorrido un ángulo de ', `${f(th)} rad`, ' desde ese punto?']
      : ['¿Cuál es su ', v('x', 'aceleración centrípeta'), ' cuando ha recorrido un ángulo de ', `${f(th)} rad`, ' desde ese punto?'];
    const correcta = sub === 'modulo' ? Math.hypot(at, acpF) : acpF;
    const conTh = x => acp0 + x * at * th;
    const errores = sub === 'modulo' ? [
      h('a-suma-sin-pitagoras', at + acpF, 'Sumaste las dos componentes como números. aT y acp son perpendiculares: |a| = √(aT² + acp²).'),
      h('acp-con-omega0', Math.hypot(at, acp0), 'Usaste la aceleración centrípeta del comienzo. Como la rapidez creció, acp también creció.'),
      h('a-solo-centripeta', acpF, 'Esa es solo la aceleración centrípeta. La rapidez sigue cambiando: también hay aceleración tangencial.'),
      h('CI-sin-el-2', Math.hypot(at, conTh(1)), 'Olvidaste el 2 de v² = v0² + 2·aT·s: la acp crece en 2·aT·θ.'),
      h('a-suma-sin-pitagoras', at + acp0, 'Sumaste aT con la acp del comienzo, como números. Hay que usar la acp de ese instante y Pitágoras.'),
    ] : [
      h('acp-con-omega0', acp0, 'Esa es la aceleración centrípeta del comienzo. Como la rapidez crece, acp también crece.'),
      h('CI-sin-el-2', conTh(1), 'Olvidaste el 2 de v² = v0² + 2·aT·s: dividida entre r, la acp crece en 2·aT·θ.'),
      h('CI-angulo-por-arco', (v0 * v0 + 2 * at * th) / R, 'Usaste el ángulo como si fuera el arco recorrido. El arco es s = θ·r.'),
      h('CI-suma-at-a-acp0', acp0 + at, 'Sumaste la tangencial a la centrípeta del comienzo. Lo que crece la centrípeta depende de cuánto aumentó la rapidez: 2·aT·θ.'),
    ];
    const s = th * R, v2 = v0 * v0 + 2 * at * s;
    const solucion = [
      ['El arco recorrido es s = θ·r = ', `${f(th)} · ${f(R)} = ${f(s)} m.`],
      ['Con aT constante, v² = ', v('v', 'v0'), '² + 2', v('at', 'aT'), `·s = ${v0}² + 2 · ${f(at)} · ${f(s)} = ${f(v2)} m²/s².`],
      [v('ac', 'acp'), ` = v²/r = ${f(v2)}/${f(R)} = ${f(acpF)} m/s² (es acp0 + 2·aT·θ = ${f(acp0)} + 2 · ${f(at)} · ${f(th)}).`],
      ...(sub === 'modulo' ? [[v('x', '|a|'), ` = √(aT² + acp²) = √(${f(at)}² + ${f(acpF)}²) = `, v('x', `${f(correcta)} m/s²`), '.']] : [['Respuesta: ', v('x', `${f(correcta)} m/s²`), '.']]),
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} m/s²`, unidad: 'm/s²', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'inicial', sub, r: R, v0, at, theta: th } });
  }

  return { id: 'circular-aceleracion-total', titulo: 'El triángulo de aceleraciones', generar };
});
