/*
 * Generador G7: la gráfica ω-t de tramos rectos (tipo C11 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-grafica']) y en Node (require). No usa ningún motor.
 *
 * La gráfica se da en texto, como lista de puntos unidos por rectas («pasa por (0 s; 6 rad/s),
 * (3 s; 0) y (6 s; −6 rad/s)»), porque la práctica no dibuja figuras.
 *
 * Tipos:
 *   angulo     ω no cambia de signo; el ángulo girado entre dos instantes (que puede no empezar en 0)
 *   recorrido  ω cruza el eje (el disco se detiene y gira al revés); el ángulo total recorrido
 *   neto       la misma gráfica que cruza el eje; el desplazamiento angular, con signo
 *   vueltas    ω en múltiplos de π rad/s; las vueltas recorridas en el intervalo
 *
 * Convenciones: t en s; ω en rad/s (o en múltiplos de π rad/s), positiva en sentido antihorario.
 * El área bajo ω-t es el ángulo: con signo para el desplazamiento, sin signo para lo recorrido.
 * Errores: G4 (parcial, docs/investigacion/cinematica-ideas-erroneas.md: la pendiente o el valor del
 * eje en vez del área), K4 (parcial, el mismo informe: desde t = 0 en vez de desde t1), y
 * CI-neto-por-recorrido y los demás del mapa (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: CIN });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && Math.abs(x) < 1e5;
  const corto = x => limpio(x) && x > 0;
  const OBJ = [['un disco', 'el disco', 'del disco'], ['una rueda', 'la rueda', 'de la rueda'], ['un ventilador', 'el ventilador', 'del ventilador'], ['una polea', 'la polea', 'de la polea']];

  function generar(semilla) {
    const rng = Azar.crear('circular-grafica|' + semilla);
    const tipo = rng.elegir(['angulo', 'angulo', 'recorrido', 'recorrido', 'recorrido', 'neto', 'neto', 'vueltas', 'vueltas']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // ω(t) por tramos rectos entre los puntos [[t, ω], ...].
  function omegaDe(pts, t) {
    for (let k = 1; k < pts.length; k++) {
      if (t <= pts[k][0] + 1e-12) { const [a, wa] = pts[k - 1], [b, wb] = pts[k]; return wa + (wb - wa) * (t - a) / (b - a); }
    }
    return pts[pts.length - 1][1];
  }
  // Áreas entre t1 y t2: con signo (neto), sin signo (recorrido), los cruces con el eje y la suma de
  // los trapecios de cada tramo tomados sin signo pero sin partirlos en el cruce.
  function areas(pts, t1, t2) {
    const cortes = [t1, ...pts.map(p => p[0]).filter(t => t > t1 && t < t2), t2];
    let neto = 0, rec = 0, trapecios = 0;
    const ceros = [];
    for (let k = 1; k < cortes.length; k++) {
      const a = cortes[k - 1], b = cortes[k], wa = omegaDe(pts, a), wb = omegaDe(pts, b);
      const ar = (wa + wb) / 2 * (b - a);
      neto += ar; trapecios += Math.abs(ar);
      if (wa * wb < 0) {
        const z = a + (b - a) * wa / (wa - wb); ceros.push(z);
        rec += Math.abs(wa) * (z - a) / 2 + Math.abs(wb) * (b - z) / 2;
      } else rec += Math.abs(ar);
    }
    return { neto, rec, trapecios, ceros };
  }

  // Vértices: tiempos enteros que crecen; ω enteros.
  function grafica(rng, conCruce, soloPositiva) {
    const n = rng.elegir([3, 3, 4]);
    const pts = [[0, null]];
    for (let k = 1; k < n; k++) pts.push([pts[k - 1][0] + rng.entero(1, 4), null]);
    for (const p of pts) p[1] = soloPositiva ? rng.entero(0, 10) : rng.entero(-8, 8);
    for (let k = 1; k < n; k++) if (pts[k][1] === pts[k - 1][1] && rng.moneda()) return null;
    const pos = pts.some(p => p[1] > 0), neg = pts.some(p => p[1] < 0);
    if (conCruce && !(pos && neg)) return null;
    if (!conCruce && neg) return null;
    if (pts.every(p => p[1] === 0)) return null;
    return pts;
  }

  function construir(rng, semilla, tipo) {
    const [un, el, del] = rng.elegir(OBJ);
    const conPi = tipo === 'vueltas';
    const pts = grafica(rng, tipo === 'recorrido' || tipo === 'neto' || (conPi && rng.moneda()), tipo === 'angulo');
    if (!pts) return null;
    const T = pts[pts.length - 1][0];
    // Intervalo: toda la gráfica, o entre dos vértices.
    const tiempos = pts.map(p => p[0]);
    let t1 = 0, t2 = T;
    if (rng.moneda()) {
      const i = rng.entero(0, tiempos.length - 2), j = rng.entero(i + 1, tiempos.length - 1);
      t1 = tiempos[i]; t2 = tiempos[j];
    }
    const A = areas(pts, t1, t2);
    const cruza = A.ceros.length > 0;
    if ((tipo === 'recorrido' || tipo === 'neto') && !cruza) return null;
    if (tipo === 'neto' && Math.abs(A.neto) < 1e-9) return null;
    if (A.rec < 1e-9) return null;
    // Cruces en instantes sencillos (a lo más un decimal), para que las áreas se lean bien.
    if (A.ceros.some(z => !limpio(z, 1))) return null;
    const wTxt = w => (w === 0 ? '0' : conPi ? P.pi(w * Math.PI, 'rad/s') : `${f(w)} rad/s`);
    const lista = pts.map(([t, w]) => `(${t} s; ${wTxt(w)})`);
    const listaTxt = lista.slice(0, -1).join(', ') + ' y ' + lista[lista.length - 1];
    const variables = { w: { nombre: 'velocidad angular', color: 'o' }, t: { nombre: 'intervalo', color: 'i' }, ar: { nombre: 'áreas bajo la gráfica', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`La gráfica `, v('w', 'ω-t'), ` de ${un} que gira pasa por los puntos ${listaTxt}, unidos por rectas. ω es positiva cuando ${el} gira en sentido antihorario.`];
    const intervalo = t1 === 0 && t2 === T ? `entre t = 0 y t = ${T} s` : `entre t = ${t1} s y t = ${t2} s`;
    const iv = v('t', intervalo);
    // En «vueltas», las áreas están en múltiplos de π rad: vueltas = área/2.
    const conv = x => (conPi ? x / 2 : x);
    const unidad = tipo === 'vueltas' ? 'vueltas' : 'rad';
    const texto = tipo === 'vueltas' ? (x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`) : (x => `${f(x)} rad`);
    let correcta, pregunta;
    if (tipo === 'angulo') { correcta = A.neto; pregunta = [`¿Qué `, v('x', 'ángulo'), ` gira ${el} `, iv, '?']; }
    else if (tipo === 'recorrido') { correcta = A.rec; pregunta = [`¿Qué `, v('x', 'ángulo total'), ` recorre ${el} `, iv, '? (Se suma lo que gira hacia un lado y hacia el otro.)']; }
    else if (tipo === 'neto') { correcta = A.neto; pregunta = [`¿Cuál es el `, v('x', 'desplazamiento angular'), ` ${del} `, iv, '? (Con signo: positivo en sentido antihorario.)']; }
    else { correcta = conv(A.rec); pregunta = [`¿Cuántas `, v('x', 'vueltas'), ` da ${el} `, iv, cruza ? '? (Se cuentan las que da hacia un lado y hacia el otro.)' : '?']; }
    const negativos = tipo === 'neto';
    if (!(negativos ? limpio(correcta) : corto(correcta))) return null;
    if (Math.abs(correcta) > 400) return null;

    // Errores, en las unidades de la respuesta.
    const k0 = pts.findIndex(p => p[0] > t1);
    const pend = Math.abs((pts[k0][1] - pts[k0 - 1][1]) / (pts[k0][0] - pts[k0 - 1][0]));
    const w2 = Math.abs(omegaDe(pts, t2)), wMax = Math.max(...pts.filter(p => p[0] >= t1 && p[0] <= t2).map(p => Math.abs(p[1])));
    const errores = [];
    if (tipo === 'recorrido' || tipo === 'vueltas') {
      if (cruza) errores.push(h('CI-neto-por-recorrido', conv(Math.abs(A.neto)), 'Restaste las áreas de arriba y de abajo: eso es el desplazamiento angular. Para lo recorrido, las áreas bajo el eje también suman.'));
      if (cruza) errores.push(h('CI-trapecio-sobre-el-cruce', conv(A.trapecios), 'En el tramo donde la recta cruza el eje tomaste un solo trapecio. Ahí hay dos triángulos, uno arriba y otro abajo, y los dos suman.'));
    }
    if (tipo === 'neto') {
      errores.push(h('CI-neto-por-recorrido', A.rec, 'Sumaste todas las áreas sin signo: eso es lo recorrido. El desplazamiento resta lo que gira al revés (el área bajo el eje).'));
      errores.push(h('CI-signo-cambiado', -A.neto, 'Te salió el signo cambiado. El área sobre el eje es positiva (antihorario) y la de abajo, negativa.'));
      const arriba = (A.rec + A.neto) / 2, abajo = (A.rec - A.neto) / 2;
      errores.push(h('CI-un-solo-lado', A.neto > 0 ? arriba : -abajo, `Tomaste solo el área ${A.neto > 0 ? 'sobre' : 'bajo'} el eje. El desplazamiento suma las dos, cada una con su signo.`));
    }
    if (t1 > 0) {
      const desde0 = areas(pts, 0, t2);
      const val = tipo === 'neto' ? desde0.neto : tipo === 'angulo' ? desde0.neto : conv(desde0.rec);
      errores.push(pa('K4-delta-t-contra-t', val, `Tomaste el área desde t = 0. El intervalo empieza en t = ${t1} s: lo de antes no cuenta.`));
    }
    const pendS = (pts[k0][1] - pts[k0 - 1][1]) / (pts[k0][0] - pts[k0 - 1][0]);
    const pendTxt = conPi ? `${pendS === 0 ? '0' : P.pi(pendS * Math.PI)} rad/s²` : `${f(pendS)} rad/s²`;
    errores.push(pa('G4-pendiente-en-vez-de-area', conv(pend), `Calculaste la pendiente del tramo que empieza en t = ${pts[k0 - 1][0]} s (${pendTxt})${pendS < 0 ? ' y tomaste su valor absoluto' : ''}: eso es la aceleración angular. Lo girado es el área bajo la gráfica ω-t.`));
    const w2s = omegaDe(pts, t2), conSigno = tipo === 'neto' || w2s >= 0;
    errores.push(pa('G4-lee-el-eje', conSigno ? conv(w2s) : conv(w2), `Leíste el eje: ω(${t2}) = ${wTxt(w2s)}${conSigno ? ', y lo tomaste como si fuera el ángulo' : ', y tomaste su valor absoluto como si fuera el ángulo'}. Ese es el valor de ω en un instante; lo girado es el área bajo la gráfica.`));
    errores.push(h('CI-rectangulo-maximo', conv(wMax * (t2 - t1)), 'Multiplicaste la ω más grande por el tiempo, como si girara así todo el intervalo. La gráfica no es horizontal: hay que sumar las áreas de cada tramo.'));
    if (tipo === 'angulo') errores.push(h('rectangulo-con-omegaf', w2 * (t2 - t1), `Multiplicaste la ω de t = ${t2} s por el tiempo, como si hubiera girado así todo el intervalo. Lo girado es el área bajo la gráfica.`, CIN));

    // Solución: el área de cada tramo.
    const cortes = [t1, ...pts.map(p => p[0]).filter(t => t > t1 && t < t2), t2];
    const piezas = [];
    for (let k = 1; k < cortes.length; k++) {
      const a = cortes[k - 1], b = cortes[k], wa = omegaDe(pts, a), wb = omegaDe(pts, b);
      if (wa * wb < 0) {
        const z = a + (b - a) * wa / (wa - wb);
        piezas.push(wa * (z - a) / 2, wb * (b - z) / 2);
      } else piezas.push((wa + wb) / 2 * (b - a));
    }
    if (piezas.some(x => !limpio(x))) return null;
    const piTxt = x => (conPi ? (x === 0 ? '0' : P.pi(x * Math.PI)) : f(x));
    const solucion = [['El área bajo la gráfica ', v('w', 'ω-t'), ' es el ángulo girado: con signo (arriba del eje, antihorario; abajo, horario).']];
    const cz = A.ceros.map(z => `t = ${f(z)} s`);
    if (cruza) solucion.push([`La gráfica cruza el eje en ${cz.length > 1 ? cz.slice(0, -1).join(', ') + ' y ' + cz[cz.length - 1] : cz[0]}: ahí ${el} se detiene y cambia de sentido.`]);
    solucion.push(['Áreas de cada tramo ', iv, ': ', v('ar', piezas.filter(x => Math.abs(x) > 1e-12).map(piTxt).join(', ')), ' (en rad).']);
    if (tipo === 'angulo') solucion.push(['Lo girado es la suma: ', v('x', texto(correcta)), '.']);
    else if (tipo === 'recorrido') solucion.push(['Lo recorrido suma todas las áreas sin signo: ', v('x', texto(correcta)), '.']);
    else if (tipo === 'neto') solucion.push(['El desplazamiento las suma con su signo: ', v('x', texto(correcta)), '.']);
    else solucion.push([`Lo recorrido, sin signo, es ${piTxt(A.rec)} rad; cada vuelta son 2π rad: `, v('x', texto(correcta)), '.']);

    const alternativas = P.armar({ correcta, errores: errores.filter(e => (negativos ? limpio(e.valor) : corto(e.valor))), rng, texto, negativos });
    return {
      id: `circular-grafica#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad }, _datos: { tipo, pi: conPi, puntos: pts, t1, t2 },
    };
  }

  return { id: 'circular-grafica', titulo: 'El área bajo la gráfica ω-t', generar };
});
