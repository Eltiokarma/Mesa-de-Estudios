/*
 * Teoría de «Ecuaciones polinomiales» (algebra.ecuaciones-polinomiales). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 10), expediente teoria-152-unidades (ficha y
 * «Precisiones» de Álgebra: Viète con signos y normalización) e historia-ecuaciones (pp. 57–68).
 * Errores: AL8 y AL15 (docs/investigacion/algebra-funciones-ideas-erroneas.md) y TAL-* nuevos (hipótesis de diseño,
 * rutinas/teoria-algebra.md).
 * Colores (regla 4): la incógnita x o z naranja (c-o); las raíces, verde (c-d); la variable auxiliar u o t
 * turquesa (c-i); el módulo y los valores que se calculan aparte, rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · un polinomio de grado n tiene n raíces complejas contando repeticiones, y sus coeficientes las delatan.
 * Persona y condiciones · 4.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · cuenta raíces reales y no reales, usa Viète con signos, lista candidatas racionales, reconoce
 *   conjugadas solo con su hipótesis, resuelve bicuadradas y recíprocas y ubica las n raíces de zⁿ = w.
 * Orden de atención · 1.º la figura (gráfica, tabla, recta, plano) · 2.º las raíces marcadas · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué la gráfica no muestra todas las raíces y cuándo una raíz «trae» a su pareja.
 * Gesto (ronda 2) · se arrastra la curva por su corte con el eje y (idea 1), las tres raíces sobre el eje (idea 2), la
 *   candidata por el eje (idea 3), la raíz que choca con su pareja y sale del eje (idea 4), los valores de u (idea 5) y
 *   la raíz vecina que cambia n (idea 6). Laboratorio: cúbica con raíces y a libres, grados 3, 4 y 5 que suben y bajan,
 *   y zⁿ = w con w libre en el plano (el caso de w no real que las ideas no muestran).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, z = { v: 'c-o', t: 'z' }, u = { v: 'c-i', t: 'u' }, t = { v: 'c-i', t: 't' };
  const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let w = a; w = Math.imul(w ^ (w >>> 15), w | 1); w ^= w + Math.imul(w ^ (w >>> 7), w | 61); return ((w ^ (w >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const y = l.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const s = Kit.plano(o.texto); if (vistos.has(s) || /NaN|Infinity|undefined/.test(s)) continue; vistos.add(s); out.push(o); }
    return out.slice(0, max);
  }
  const mcd = (p, q) => (q ? mcd(q, p % q) : Math.abs(p));
  function fr(num, den) {
    if (den < 0) { num = -num; den = -den; }
    const g = mcd(Math.abs(num), den) || 1;
    return den / g === 1 ? f(num / g) : `${num < 0 ? '−' : ''}${Math.abs(num) / g}/${den / g}`;
  }
  // Polinomio con coeficientes de mayor a menor grado, como partes de ecuación.
  function poli(coefs, X = x) {
    const n = coefs.length - 1, out = [];
    coefs.forEach((a, i) => {
      if (!a) return;
      const e = n - i, abs = Math.abs(a);
      out.push(out.length ? (a < 0 ? ' − ' : ' + ') : (a < 0 ? '−' : ''));
      if (abs !== 1 || e === 0) out.push(f(abs));
      if (e >= 1) out.push(X);
      if (e >= 2) out.push(SUP[e]);
    });
    return out.length ? out : ['0'];
  }
  const poliTxt = coefs => Kit.plano(poli(coefs, 'x'));
  const par = v => (v < 0 ? `(${f(v)})` : f(v));   // un negativo entre paréntesis, para multiplicarlo o elevarlo
  // Cuadrática [1, B, C] evaluada en v, término a término: «2² + 2 · 2 − 8». La usa «Así se resuelve».
  const enCuadratica = ([, B, C], v) => `${par(v)}²${B ? ` ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : `${f(Math.abs(B))} · `}${par(v)}` : ''}${C ? ` ${C < 0 ? '−' : '+'} ${f(Math.abs(C))}` : ''} = ${f(valor([1, B, C], v))}`;
  // Producto de (x − r) para raíces enteras: coeficientes de mayor a menor grado.
  const desdeRaices = (rs, a = 1) => rs.reduce((c, r) => [...c, 0].map((v, i) => v - (i ? r * c[i - 1] : 0)), [a]);
  const valor = (coefs, v) => coefs.reduce((acc, c) => acc * v + c, 0);
  // q^n · P(p/q): entero; vale 0 si p/q es raíz (aritmética exacta).
  const valorFrac = (coefs, p, q) => { const n = coefs.length - 1; return coefs.reduce((acc, c, i) => acc + c * p ** (n - i) * q ** i, 0); };
  function curva(fn, a, b, ymin, ymax, n = 160) {
    const pts = []; let prev = null;
    for (let i = 0; i <= n; i++) {
      const xx = a + (b - a) * i / n, yy = fn(xx), dentro = yy >= ymin && yy <= ymax;
      if (prev && dentro !== prev[2]) {
        const borde = (dentro ? prev[1] : yy) > ymax ? ymax : ymin, k = (borde - prev[1]) / (yy - prev[1]);
        pts.push([prev[0] + (xx - prev[0]) * k, borde]);
        if (!dentro) pts.push(null);
      }
      if (dentro) pts.push([xx, yy]);
      prev = [xx, yy, dentro];
    }
    return pts;
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza («ejes», «recta», «flechas»);
  // los juegos tienen rangos fijos, así que la inversa lineal de la escala pasa del dedo al valor del control.
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  const EJES = () => Kit.piezas.ejes, RECTA = () => Kit.piezas.recta, FL = () => Kit.piezas.flechas;
  function biseccion(fn, a, b) {
    let fa = fn(a);
    for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = fn(m); if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m; }
    return (a + b) / 2;
  }

  // ---------- Idea 1: tantas raíces como el grado ----------
  // Cambia: c en x³ − 3x + c · Permanece: el grado 3 · Progresa: cortes reales que se vuelven pares no reales
  // · Se reserva: el grado 5 que solo corta tres veces · Debe verse: reales + no reales = grado.
  // Se agarra: el corte de la curva con el eje y, que vale c; subirlo sube toda la curva.
  const EJES1 = { x: { min: -3, max: 3, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -8, max: 8, paso: 4, nombre: 'y', decimales: 0 } };
  function cubica(c) {
    const p = v => v * v * v - 3 * v + c;
    const reales = [];
    if (Math.abs(c) < 2) reales.push([biseccion(p, -3, -1), 1], [biseccion(p, -1, 1), 1], [biseccion(p, 1, 3), 1]);
    else if (c === 2) reales.push([-2, 1], [1, 2]);
    else if (c === -2) reales.push([-1, 2], [2, 1]);
    else reales.push([c > 0 ? biseccion(p, -4, -1) : biseccion(p, 1, 4), 1]);
    const conMult = reales.reduce((s, [, m]) => s + m, 0);
    return { p, reales, noReales: 3 - conMult };
  }
  const tfa = {
    id: 'grado-raices',
    titulo: 'Tantas raíces como el grado',
    temas: ['Teorema fundamental del álgebra'],
    pieza: 'ejes',
    // Lee (fase 2): raíz, grado y multiplicidad; no dice cuántas raíces tiene un polinomio ni dónde están las que faltan (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Qué es una raíz', texto: 'Un terreno cuadrado en Juliaca tiene 25 m². Su lado cumple x² − 25 = 0, que tiene dos raíces: 5 y −5. Para el terreno solo sirve 5, porque un lado no es negativo.' },
        { titulo: 'El grado', texto: 'El grado de un polinomio es su mayor exponente: x³ − 3x + 1 es de grado 3, y x⁵ + x, de grado 5. El de 2x⁴ − x + 7 es 4.' },
        { titulo: 'Raíces repetidas', texto: 'En (x − 2)²(x + 1) = 0, el factor x − 2 aparece dos veces. Se dice que 2 es una raíz doble, o de multiplicidad 2.',
          ecuacion: ['(', x, ' − 2)(', x, ' − 2)(', x, ' + 1) = 0'] },
        { titulo: 'Qué mirar', texto: 'En el juego, sube y baja la curva con c. Cuenta los puntos verdes en cada posición y fíjate qué cuenta se mantiene igual.' },
      ],
    },
    juega: {
      consigna: 'Mueve c en y = x³ − 3x + c. Los puntos verdes son raíces reales; una raíz doble solo toca el eje.',
      voz: 'Cuenta los cortes al subir y bajar la curva.',
      controles: [{ id: 'c', etiqueta: 'c', color: 'c-h', min: -4, max: 4, paso: 1, inicio: 0, decimales: 0 }],
      arrastres: [{
        id: 'corte-y', etiqueta: 'corte con el eje y: sube o baja la curva', color: 'c-h',
        donde: v => { const g = EJES().geometria(EJES1); return { x: g.X(0), y: g.Y(v.c) }; },
        mover: pt => ({ c: inversa(EJES().geometria(EJES1).Y, -8, 8)(pt.y) }),
      }],
      dibujo: v => {
        const q = cubica(v.c);
        return { datos: Object.assign({}, EJES1, { curvas: [{ puntos: curva(q.p, -3, 3, -8, 8), color: 'i' }], puntos: q.reales.map(([r, m]) => ({ x: r, y: 0, color: 'd', rotulo: m === 2 ? 'doble' : undefined })), alt: `Cúbica x³ − 3x + ${v.c}: ${q.reales.length} raíces reales distintas` }), estado: {} };
      },
      lectura: v => { const q = cubica(v.c), m = 3 - q.noReales; return [`Reales: ${m} · no reales: ${q.noReales} · total 3`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Un polinomio de grado 5 con coeficientes reales corta el eje x en 3 puntos, sin tocarlo en otro. ¿Cuántas raíces no reales tiene?',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'grafica', texto: '0', error: 'TAL-SOLO-REAL', siFuera: 'Sería cierto si la gráfica mostrara todas las raíces; solo muestra las reales.' },
        { id: 'tres', texto: '3', error: 'TAL-GRADO', siFuera: 'Con 3 reales y 3 no reales serían 6 raíces; el grado es 5.' },
        { id: 'cinco', texto: '5', error: 'TAL-GRADO', siFuera: 'El grado cuenta todas las raíces, reales y no reales juntas.' },
      ],
      dibujo: { datos: Object.assign({}, EJES1, { y: { min: -16, max: 16, paso: 8, nombre: 'y', decimales: 0 }, curvas: [{ puntos: curva(v => v * (v * v - 4) * (v * v + 1) / 2, -3, 3, -16, 16), color: 'i' }], alt: 'Polinomio de grado 5 que corta el eje x tres veces' }), estado: {} },
      revelar: { datos: Object.assign({}, EJES1, { y: { min: -16, max: 16, paso: 8, nombre: 'y', decimales: 0 }, curvas: [{ puntos: curva(v => v * (v * v - 4) * (v * v + 1) / 2, -3, 3, -16, 16), color: 'i' }], puntos: [-2, 0, 2].map(r => ({ x: r, y: 0, color: 'd', rotulo: f(r) })), alt: 'Grado 5: tres raíces reales visibles; las otras dos no se ven en la gráfica' }), estado: {} },
      coincide: 'Coincide: 5 raíces en total, 3 a la vista y 2 que la gráfica no puede mostrar.',
    },
    mira: {
      datos: Object.assign({}, EJES1, {
        y: { min: -12, max: 12, paso: 4, nombre: 'y', decimales: 0 },
        curvas: [{ puntos: curva(v => v * v * v - v * v + 4 * v - 4, -3, 3, -12, 12), color: 'i' }],
        puntos: [{ x: 1, y: 0, color: 'd', rotulo: 'x = 1', desde: 2 }],
        alt: 'Gráfica de x³ − x² + 4x − 4: un solo corte, en x = 1',
      }),
      voz: 'Creo que faltan raíces. Comprobemos con el grado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Grado 3: deberían ser tres raíces. La gráfica corta una vez.', ecuacion: ['P(', x, ') = ', ...poli([1, -1, 4, -4])] },
        { estado: { corte: 2 }, texto: 'En x = 1 vale cero: x − 1 es factor.', ecuacion: ['P(1) = 1 − 1 + 4 − 4 = 0'] },
        { estado: { corte: 3 }, texto: 'Al dividir queda un factor de grado 2.', ecuacion: ['P(', x, ') = (', x, ' − 1)(', x, '² + 4)'] },
        { estado: { corte: 3 }, texto: 'x² + 4 = 0 no tiene raíces reales, pero sí dos complejas.', ecuacion: [x, '² = −4  ⇒  ', x, ' = 2i  o  ', x, ' = −2i'] },
        { estado: { corte: 3 }, texto: 'Una real y dos no reales: tres, como el grado.', ecuacion: ['1 + 2 = 3'] },
      ],
    },
    regla: {
      texto: 'Teorema fundamental del álgebra: un polinomio de grado n ≥ 1 tiene exactamente n raíces complejas, contando cada una tantas veces como se repite. La gráfica solo muestra las reales.',
      ecuacion: ['P(', z, ') = a', { llave: ['(', z, ' − ', { sub: ['r', '1'] }, ')(', z, ' − ', { sub: ['r', '2'] }, ')…(', z, ' − ', { sub: ['r', 'n'] }, ')'], nota: 'n factores', color: 'c-d' }],
      condicion: 'grado n ≥ 1 y coeficiente principal a ≠ 0; una raíz doble cuenta dos veces.',
    },
    // Así se resuelve (fase 2): el mismo P = (x − a)^m (x + b)^n (x² + c) de «Ahora tú», con otras semillas y la misma
    // pregunta según la semilla; la gráfica (calculada con valor() y desdeRaices()) muestra que solo se ven las reales.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const a = r.ent(1, 4), m = r.ent(1, 3), bq = r.ent(1, 4), n2 = r.ent(1, 2), cc = r.uno([1, 4, 9]);
        const grado = m + n2 + 2, pide = s % 3, rc = Math.sqrt(cc), im = rc === 1 ? 'i' : `${f(rc)}i`;
        const fx = v => (v > 0 ? `x − ${f(v)}` : `x + ${f(-v)}`);
        // (x² + c) multiplicado por (x − rr) para cada raíz real, con la misma cuenta de desdeRaices().
        const coefs = [...Array(m).fill(a), ...Array(n2).fill(-bq)].reduce((c, rr) => [...c, 0].map((v, i) => v - (i ? rr * c[i - 1] : 0)), [1, 0, cc]);
        const p = v => valor(coefs, v), lo = -bq - 1.5, hi = a + 1.5;
        let tope = 0; for (let i = 0; i <= 80; i++) tope = Math.max(tope, Math.abs(p(-bq + (a + bq) * i / 80)));
        const ymax = Math.max(4, Math.ceil(tope * 1.3)), pasoY = Math.max(1, Math.ceil(ymax / 2));
        const graf = conPuntos => ({ datos: { x: { min: Math.floor(lo), max: Math.ceil(hi), paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -ymax, max: ymax, paso: pasoY, nombre: 'y', decimales: 0 },
          curvas: [{ puntos: curva(p, Math.floor(lo), Math.ceil(hi), -ymax, ymax), color: 'i' }],
          puntos: conPuntos ? [{ x: a, y: 0, color: 'd', rotulo: f(a) }, { x: -bq, y: 0, color: 'd', rotulo: f(-bq) }] : [],
          alt: `Gráfica de P: corta el eje x solo en ${f(a)} y ${f(-bq)}` }, estado: {} });
        const fac = ['(', x, ` − ${a})${m > 1 ? SUP[m] : ''}(`, x, ` + ${bq})${n2 > 1 ? SUP[n2] : ''}(`, x, `² + ${cc})`];
        const PREG = ['¿cuántas raíces complejas hay en total, contando repeticiones?', '¿cuántas raíces reales distintas hay?', '¿cuántas raíces no reales hay?'];
        const PIDE = ['Piden todas las raíces, reales y no reales, contando cada repetición.', 'Piden las raíces reales, contando una sola vez cada valor.', 'Piden las raíces que no son números reales.'];
        const cuentas = [
          { tipo: 'cuentas', texto: 'Sumo los grados de los tres factores.', ecuacion: [`${m} + ${n2} + 2 = ${grado}`] },
          { tipo: 'cuentas', texto: `Las reales salen de ${fx(a)} = 0 y ${fx(-bq)} = 0. El factor x² + ${cc} no se anula con x real.`, ecuacion: [x, ` = ${f(a)}`, '   ·   ', x, ` = ${f(-bq)}`], dibujo: graf(true) },
          { tipo: 'cuentas', texto: `x² + ${cc} = 0 da x² = −${cc}: dos raíces no reales. Los otros factores dan raíces reales.`, ecuacion: [x, ` = ${im}`, '   ·   ', x, ` = −${im}`] },
        ][pide];
        return {
          enunciado: ['Para P(', x, ') = ', ...fac, ', ', PREG[pide]],
          dibujo: graf(false),
          pasos: [
            { tipo: 'pide', texto: PIDE[pide] },
            { tipo: 'datos', texto: `P ya está factorizado: ${fx(a)} con exponente ${m}, ${fx(-bq)} con exponente ${n2} y x² + ${cc}.` },
            { tipo: 'regla', texto: `Cada factor aporta tantas raíces como su grado, y el total es el grado de P. Un factor como x² + ${cc} no da raíces reales.` },
            cuentas,
            { tipo: 'sentido', texto: `Comprueba con el grado: ${m + n2} raíces reales contando repeticiones, más 2 no reales, dan ${grado}. La gráfica solo llega al eje en ${f(a)} y ${f(-bq)}.` },
          ],
          respuesta: [`${pide === 0 ? grado : 2} raíces`, ['', ' reales distintas', ' no reales'][pide], pide === 0 ? ' en total' : ''],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const a = r.ent(1, 4), m = r.ent(1, 3), bq = r.ent(1, 4), n2 = r.ent(1, 2), cc = r.uno([1, 4, 9]);
        // P(x) = (x − a)^m (x + bq)^n2 (x² + cc)
        const grado = m + n2 + 2, pide = s % 3;
        const fac = ['(', x, ` − ${a})${m > 1 ? SUP[m] : ''}(`, x, ` + ${bq})${n2 > 1 ? SUP[n2] : ''}(`, x, `² + ${cc})`];
        const preg = ['Para P(', x, ') = ', ...fac, ', '];
        if (pide === 0) return {
          pregunta: [...preg, '¿cuántas raíces complejas hay en total, contando repeticiones?'],
          opciones: distintas([
            { id: 'c', texto: f(grado), correcta: true },
            { id: 'distintas', texto: f(4), error: 'TAL-MULTIPLICIDAD', siFuera: 'Esas son las raíces distintas; las repetidas se cuentan cada vez.' },
            { id: 'reales', texto: f(m + n2), error: 'TAL-SOLO-REAL', siFuera: `Esas son las reales; x² + ${cc} aporta dos raíces más.` },
            { id: 'dos', texto: f(2), error: 'TAL-SOLO-REAL', siFuera: 'Esas son las raíces reales distintas; faltan repeticiones y no reales.' },
            { id: 'grado1', texto: f(grado + 1), error: 'TAL-GRADO', siFuera: 'Hay tantas raíces como el grado, sumando los exponentes.' },
          ]),
          solucion: { texto: 'Se suman los grados de los factores.', ecuacion: [`${m} + ${n2} + 2 = ${grado}`] },
        };
        if (pide === 1) return {
          pregunta: [...preg, '¿cuántas raíces reales distintas hay?'],
          opciones: distintas([
            { id: 'c', texto: '2', correcta: true },
            { id: 'mult', texto: f(m + n2), error: 'TAL-MULTIPLICIDAD', siFuera: 'Eso cuenta las repeticiones; se piden raíces distintas.' },
            { id: 'todas', texto: f(grado), error: 'TAL-SOLO-REAL', siFuera: `Eso es el grado; x² + ${cc} = 0 no tiene raíces reales.` },
            { id: 'cuatro', texto: '4', error: 'TAL-SOLO-REAL', siFuera: `Las raíces de x² + ${cc} = 0 son ±${Math.sqrt(cc)}i: no son reales.` },
          ]),
          solucion: { texto: `Las reales son ${a} y −${bq}; x² + ${cc} solo da raíces no reales.`, ecuacion: [x, ` = ${a}`, '   ·   ', x, ` = −${bq}`] },
        };
        return {
          pregunta: [...preg, '¿cuántas raíces no reales hay?'],
          opciones: distintas([
            { id: 'c', texto: '2', correcta: true },
            { id: 'cero', texto: '0', error: 'TAL-SOLO-REAL', siFuera: `x² + ${cc} = 0 da ±${Math.sqrt(cc)}i: dos raíces que la gráfica no muestra.` },
            { id: 'una', texto: '1', error: 'TAL-CONJUGADA', siFuera: 'Con coeficientes reales, las no reales vienen en pareja.' },
            { id: 'grado', texto: f(grado - 2), error: 'TAL-GRADO', siFuera: 'Esas son las reales contando repeticiones.' },
          ]),
          solucion: { texto: `Solo x² + ${cc} da raíces no reales: ${Math.sqrt(cc)}i y −${Math.sqrt(cc)}i.`, ecuacion: [x, ` = ±${Math.sqrt(cc)}i`] },
        };
      },
    },
  };

  // ---------- Idea 2: los coeficientes delatan a las raíces (Viète) ----------
  // Cambia: las tres raíces · Permanece: la tabla suma, productos de a dos, producto · Progresa: los coeficientes
  // que copian esas cuentas con signo alternado · Se reserva: a = 2, que obliga a dividir · Debe verse: −b/a, c/a, −d/a.
  const vieteFila = rs => {
    const [p, q, w] = rs;
    return { S1: p + q + w, S2: p * q + p * w + q * w, S3: p * q * w };
  };
  // Se agarran las tres raíces sobre el eje x. Dos representaciones a propósito: el juego usa la gráfica (las raíces
  // son lugares que se mueven) y la lectura en vivo da suma, productos de a dos y producto junto al polinomio
  // desarrollado, rotulado sobre la curva; «Predice», «Mira» y «Ahora tú» pasan a la tabla, que alinea cada cuenta con
  // su coeficiente. El primer paso de «Mira» parte de las mismas raíces escritas como factores.
  const EJES2 = { x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -12, max: 12, paso: 4, nombre: 'y', decimales: 0 } };
  const graficaRaices = (rs, a = 1) => {
    const c = desdeRaices(rs, a), p = v => valor(c, v);
    return Object.assign({}, EJES2, {
      // El polinomio va en la esquina que la cúbica deja libre: abajo a la derecha si a > 0, arriba si a < 0.
      curvas: [{ puntos: curva(p, -4, 4, -12, 12), color: 'i', rotulo: poliTxt(c), en: a > 0 ? [3.95, -10] : [3.95, 11.5] }],
      puntos: rs.map(r => ({ x: r, y: 0, color: 'd' })),
      alt: `Gráfica de ${poliTxt(c)}, que corta el eje x en ${rs.map(r => f(r)).join(', ')}`,
    });
  };
  const RAICES_ID = ['r1', 'r2', 'r3'], RAICES_TXT = ['r₁', 'r₂', 'r₃'];
  const manijasRaices = (datosDe, ids = RAICES_ID) => ids.map((id, i) => ({
    id: `raiz-${i + 1}`, etiqueta: `raíz ${RAICES_TXT[i]} sobre el eje x`, color: 'c-d',
    donde: v => { const g = EJES().geometria(datosDe(v)); return { x: g.X(v[id]), y: g.Y(0) }; },
    mover: (pt, v) => ({ [id]: inversa(EJES().geometria(datosDe(v)).X, -4, 4)(pt.x) }),
  }));
  const vieta = {
    id: 'viete',
    titulo: 'Los coeficientes delatan las raíces',
    temas: ['Relaciones entre raíces y coeficientes'],
    pieza: 'alg-tabla',
    // Lee (fase 2): los nombres a, b, c, d y qué son los productos de a dos; no dice cómo se leen las raíces en ellos (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Los coeficientes', texto: 'En 3x³ − x² + 5x − 7 = 0, los números 3, −1, 5 y −7 son los coeficientes. Se llaman a, b, c y d, de la potencia más alta a la más baja.',
          ecuacion: ['a', x, '³ + b', x, '² + c', x, ' + d = 0'] },
        { titulo: 'Dos con nombre propio', texto: 'a, el que va con x³, es el coeficiente principal. d, el que va solo, es el término independiente. Si falta un término, su coeficiente es 0.' },
        { titulo: 'Productos de a dos', texto: 'Con tres raíces r₁, r₂ y r₃ hay tres parejas: r₁r₂, r₁r₃ y r₂r₃. Su suma se llama suma de productos de a dos.',
          ecuacion: [{ sub: ['r', '1'] }, { sub: ['r', '2'] }, ' + ', { sub: ['r', '1'] }, { sub: ['r', '3'] }, ' + ', { sub: ['r', '2'] }, { sub: ['r', '3'] }] },
        { titulo: 'Qué mirar', texto: 'En el juego, arrastra las raíces verdes. Compara la suma, los productos de a dos y el producto con los números del polinomio escrito sobre la curva.' },
      ],
    },
    juega: {
      consigna: 'Arrastra las tres raíces por el eje. Sobre la curva va (x − r₁)(x − r₂)(x − r₃) desarrollado; compáralo con sus sumas y productos.',
      voz: 'Mira los signos de cada coeficiente.',
      pieza: 'ejes',
      controles: [
        { id: 'r1', etiqueta: 'r₁', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r2', etiqueta: 'r₂', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'r3', etiqueta: 'r₃', color: 'c-d', min: -3, max: 3, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: v => ({ datos: graficaRaices([v.r1, v.r2, v.r3]), estado: {} }),
      lectura: v => { const V = vieteFila([v.r1, v.r2, v.r3]); return [`suma ${f(V.S1)}`, '   ·   ', `de a dos ${f(V.S2)}`, '   ·   ', `producto ${f(V.S3)}`]; },
      arrastres: manijasRaices(v => graficaRaices([v.r1, v.r2, v.r3])),
      minimo: 3,
    },
    predice: {
      pregunta: ['En 2', x, '³ − 6', x, '² + 4', x, ' + 10 = 0, ¿cuánto vale el producto de sus tres raíces?'],
      opciones: [
        { id: 'c', texto: '−5', correcta: true },
        { id: 'signo', texto: '5', error: 'TAL-SIGNO-VIETE', siFuera: 'En grado 3 el producto es −d/a: el signo cambia. −10/2 = −5.' },
        { id: 'normaliza', texto: '−10', error: 'TAL-NORMALIZA', siFuera: '−10 sería cierto si a fuera 1; con a = 2 se divide entre 2.' },
        { id: 'suma', texto: '3', error: 'TAL-PRODUCTO', siFuera: '3 es la suma, −b/a = 6/2. El producto usa d.' },
      ],
      dibujo: { datos: { columnas: ['a', 'b', 'c', 'd', 'producto'], filas: [['2', '−6', '4', '10', { t: '?', fuerte: true }]] }, estado: {} },
      revelar: { datos: { columnas: ['a', 'b', 'c', 'd', 'producto'], colorCol: [null, null, null, 'h', 'd'], filas: [['2', '−6', '4', '10', { t: '−5', fuerte: true, color: 'd' }]], pie: 'producto = −d/a = −10/2' }, estado: {} },
      coincide: 'Coincide: −d/a = −10/2 = −5, sin hallar ninguna raíz.',
    },
    mira: {
      datos: {
        columnas: ['raíces', 'si a = 1', 'si a = 2'], rotulosFila: ['suma', 'de a dos', 'producto'],
        filas: [
          [{ t: '1+2+3=6', desde: 1 }, { t: '−b = 6', desde: 3, color: 'd', fuerte: true }, { t: '12/2 = 6', desde: 5 }],
          [{ t: '2+3+6=11', desde: 1 }, { t: 'c = 11', desde: 4, color: 'd', fuerte: true }, { t: '22/2 = 11', desde: 5 }],
          [{ t: '1·2·3=6', desde: 1 }, { t: '−d = 6', desde: 4, color: 'd', fuerte: true }, { t: '12/2 = 6', desde: 5 }],
        ],
        alt: 'Raíces 1, 2 y 3: x³ − 6x² + 11x − 6; suma 6, productos de a dos 11, producto 6',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Partimos de tres raíces conocidas: 1, 2 y 3.', ecuacion: ['(', x, ' − 1)(', x, ' − 2)(', x, ' − 3)'] },
        { estado: { corte: 2 }, texto: 'Desarrollado, da un polinomio con a = 1.', ecuacion: poli([1, -6, 11, -6]) },
        { estado: { corte: 3 }, texto: 'El 6 de b es la suma de las raíces, con signo cambiado.', ecuacion: ['1 + 2 + 3 = 6 = −b'] },
        { estado: { corte: 4 }, texto: 'c suma los productos de a dos; −d es el producto.', ecuacion: ['2 + 3 + 6 = 11', '   ·   ', '1 · 2 · 3 = 6'] },
        { estado: { corte: 5 }, texto: 'Si todo se multiplica por 2, las raíces no cambian: se divide entre a.', ecuacion: [{ frac: ['12', '2'] }, ' = 6', '   ·   ', { frac: ['22', '2'] }, ' = 11'] },
      ],
    },
    regla: {
      texto: 'En ax³ + bx² + cx + d = 0, la suma de las raíces es −b/a, la de sus productos de a dos, c/a, y su producto, −d/a.',
      ecuacion: [{ llave: [{ sub: ['r', '1'] }, ' + ', { sub: ['r', '2'] }, ' + ', { sub: ['r', '3'] }], nota: 'suma de raíces', color: 'c-d' }, ' = ', { frac: ['−b', 'a'] }],
      condicion: 'primero se divide entre a; un término que falta tiene coeficiente 0. Los signos alternan: −, +, −.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (polinomio armado con desdeRaices y la pregunta según la
    // semilla), con otras semillas; la comprobación usa las raíces con que se armó, con vieteFila().
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900), a = r.ent(1, 3);
        const rs = [r.ent(-3, 3), r.ent(-3, 3), r.ent(-3, 3)];
        if (rs.every(v => v === 0)) rs[0] = 2;
        const c = desdeRaices(rs, a), V = vieteFila(rs), pide = ['suma', 'dos', 'producto', 'cuadrados'][s % 4];
        const R = [1, 2, 3].map(i => ({ sub: ['r', String(i)] })), par = v => (v < 0 ? `(${f(v)})` : f(v));
        const NOM = { suma: '¿Cuánto vale su suma?', dos: '¿Cuánto vale la suma de sus productos de a dos?', producto: '¿Cuánto vale su producto?', cuadrados: '¿Cuánto vale la suma de sus cuadrados?' };
        const QUE = { suma: 'la suma de las tres raíces', dos: 'la suma de los productos de a dos de las raíces', producto: 'el producto de las tres raíces', cuadrados: 'la suma de los cuadrados de las raíces' };
        const S1 = -c[1] / a, S2 = c[2] / a, S3 = -c[3] / a, bien = { suma: S1, dos: S2, producto: S3, cuadrados: S1 * S1 - 2 * S2 }[pide];
        const tabla = (extra, fila) => ({ datos: { columnas: ['a', 'b', 'c', 'd', ...extra], filas: [[f(c[0]), f(c[1]), f(c[2]), f(c[3]), ...fila]] }, estado: {} });
        const REGLA = {
          suma: ['La suma de las raíces es −b/a: el coeficiente de x², con el signo cambiado, dividido entre a.', [{ frac: ['−b', 'a'] }]],
          dos: ['La suma de los productos de a dos es c/a: el coeficiente de x, dividido entre a, sin cambiar el signo.', [{ frac: ['c', 'a'] }]],
          producto: ['En grado 3, el producto de las raíces es −d/a: el término independiente, con el signo cambiado, entre a.', [{ frac: ['−d', 'a'] }]],
          cuadrados: ['Los cuadrados salen de elevar la suma al cuadrado y quitar el doble de los productos de a dos.', ['r₁² + r₂² + r₃² = (−b/a)² − 2 · c/a']],
        }[pide];
        const CUENTA = {
          suma: [`−${par(c[1])} ÷ ${a} = ${f(S1)}`],
          dos: [`${f(c[2])} ÷ ${a} = ${f(S2)}`],
          producto: [`−${par(c[3])} ÷ ${a} = ${f(S3)}`],
          cuadrados: [`suma = ${f(S1)}`, '   ·   ', `de a dos = ${f(S2)}`, '   ·   ', `${par(S1)}² − 2 · ${par(S2)} = ${f(bien)}`],
        }[pide];
        const conRaices = { suma: rs.map(par).join(' + '), dos: `${par(rs[0])}·${par(rs[1])} + ${par(rs[0])}·${par(rs[2])} + ${par(rs[1])}·${par(rs[2])}`, producto: rs.map(par).join(' · '), cuadrados: rs.map(v => `${par(v)}²`).join(' + ') }[pide];
        const directo = { suma: V.S1, dos: V.S2, producto: V.S3, cuadrados: rs.reduce((t, v) => t + v * v, 0) }[pide];
        return {
          enunciado: ['Las raíces de ', ...poli(c), ' = 0 son ', R[0], ', ', R[1], ' y ', R[2], '. ', NOM[pide]],
          dibujo: tabla([], []),
          pasos: [
            { tipo: 'pide', texto: `Piden ${QUE[pide]}, sin hallar las raíces.` },
            { tipo: 'datos', texto: `Es de grado 3, con a = ${f(c[0])}, b = ${f(c[1])}, c = ${f(c[2])} y d = ${f(c[3])}.` },
            { tipo: 'regla', texto: REGLA[0], ecuacion: REGLA[1] },
            { tipo: 'cuentas', texto: pide === 'cuadrados' ? 'Primero leo la suma y los productos de a dos; después los combino.' : `Leo el coeficiente y divido entre a = ${a}.`,
              ecuacion: CUENTA, dibujo: tabla([pide === 'cuadrados' ? 'suma de cuadrados' : { suma: 'suma', dos: 'de a dos', producto: 'producto' }[pide]], [{ t: f(bien), color: 'd', fuerte: true }]) },
            { tipo: 'sentido', texto: `Comprueba: este polinomio se armó con las raíces ${rs.map(v => f(v)).join(', ')}. Hago la cuenta con ellas y sale lo mismo.`,
              ecuacion: [`${conRaices} = ${f(directo)}`] },
          ],
          respuesta: [`${{ suma: 'La suma', dos: 'La suma de productos de a dos', producto: 'El producto', cuadrados: 'La suma de cuadrados' }[pide]} vale ${f(bien)}.`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(1, 3);
        const rs = [r.ent(-3, 3), r.ent(-3, 3), r.ent(-3, 3)];
        if (rs.every(v => v === 0)) rs[0] = 2;
        const c = desdeRaices(rs, a), V = vieteFila(rs), pide = ['suma', 'dos', 'producto', 'cuadrados'][s % 4];
        const preg = ['Las raíces de ', ...poli(c), ' = 0 son ', { sub: ['r', '1'] }, ', ', { sub: ['r', '2'] }, ' y ', { sub: ['r', '3'] }, '. '];
        const VAL = { suma: V.S1, dos: V.S2, producto: V.S3, cuadrados: V.S1 * V.S1 - 2 * V.S2 };
        const NOM = { suma: '¿Cuánto vale su suma?', dos: '¿Cuánto vale la suma de sus productos de a dos?', producto: '¿Cuánto vale su producto?', cuadrados: '¿Cuánto vale la suma de sus cuadrados?' };
        const bien = VAL[pide];
        const sin = { suma: -c[1], dos: c[2], producto: -c[3], cuadrados: V.S1 * V.S1 };
        const otra = { suma: V.S3, dos: V.S1, producto: V.S1, cuadrados: V.S1 * V.S1 + 2 * V.S2 };
        return {
          pregunta: [...preg, NOM[pide]],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            pide === 'cuadrados' ? { id: 'binomio', texto: f(sin.cuadrados), error: 'AL8', siFuera: 'Eso es el cuadrado de la suma; falta restar el doble de los productos de a dos.' }
              : { id: 'sin-a', texto: f(sin[pide]), error: 'TAL-NORMALIZA', siFuera: `Eso es el coeficiente sin dividir entre a = ${a}.` },
            { id: 'signo', texto: f(-bien), error: 'TAL-SIGNO-VIETE', siFuera: 'Los signos alternan: suma −b/a, de a dos +c/a, producto −d/a.' },
            { id: 'otra', texto: f(otra[pide]), error: 'TAL-PRODUCTO', siFuera: 'Ese valor sale de otro coeficiente de la tabla.' },
            { id: 'mas', texto: f(bien + 1), error: 'TAL-CALCULO', siFuera: 'Ese valor queda cerca; rehaz la división entre a.' },
          ]),
          solucion: {
            texto: pide === 'cuadrados' ? 'Suma al cuadrado menos el doble de los productos de a dos.' : 'Se lee en los coeficientes, dividiendo entre a.',
            ecuacion: [pide === 'suma' ? `−(${f(c[1])})/${a} = ${f(bien)}` : pide === 'dos' ? `${f(c[2])}/${a} = ${f(bien)}` : pide === 'producto' ? `−(${f(c[3])})/${a} = ${f(bien)}` : `(${f(V.S1)})² − 2 · (${f(V.S2)}) = ${f(bien)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: candidatas racionales p/q ----------
  // Cambia: la candidata que se prueba · Permanece: 2x³ − 3x² − 3x + 2 · Progresa: la lista ±p/q y los ceros que
  // aparecen · Se reserva: 3/2 en un polinomio que empieza en 3 · Debe verse: p divide a d y q divide a a.
  // (qx − p)(x − r₂)(x − r₃) desarrollado: lo usa la comprobación de «Así se resuelve».
  const mult3 = (q, p, r2, r3) => { const b = desdeRaices([r2, r3]); return [q * b[0], q * b[1] - p * b[0], q * b[2] - p * b[1], -p * b[2]]; };
  const P3 = [2, -3, -3, 2];
  const CANDS = [[1, 1], [-1, 1], [2, 1], [-2, 1], [1, 2], [-1, 2]];
  // Se agarra la candidata sobre el eje x: salta a la candidata más cercana y la curva muestra la altura P(p/q).
  // Dos representaciones a propósito: en el juego, «es raíz» se ve como «la curva pasa por el eje»; «Predice», «Mira» y
  // «Ahora tú» usan la tabla de candidatas, que es como se trabaja en papel. «Mira» repite las mismas seis candidatas.
  const EJES3 = { x: { min: -2.5, max: 2.5, paso: 0.5, cada: 2, nombre: 'x', decimales: 1, color: 'o' }, y: { min: -20, max: 8, paso: 4, nombre: 'y', decimales: 0 } };
  const graficaCandidata = k => {
    const [p, q] = CANDS[k], val = valorFrac(P3, p, q), yv = val / q ** 3;
    return Object.assign({}, EJES3, {
      curvas: [{ puntos: curva(v => valor(P3, v), -2.5, 2.5, -20, 8), color: 'i' }],
      puntos: [{ x: p / q, y: yv, color: val === 0 ? 'd' : 'h', rotulo: `P = ${fr(val, q ** 3)}`, guias: val !== 0 }],
      alt: `Gráfica de 2x³ − 3x² − 3x + 2; en x = ${fr(p, q)} vale ${fr(val, q ** 3)}`,
    });
  };
  const racionales = {
    id: 'raices-racionales',
    titulo: 'Candidatas racionales: p entre q',
    temas: ['Raíces racionales'],
    pieza: 'alg-tabla',
    // Lee (fase 2): fracción reducida y lista de candidatas; no dice qué divide a qué (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Fracciones de enteros', texto: 'Un número racional se escribe como p/q, con p y q enteros: 1/2, −3 o 2/3. La fracción está reducida si p y q no tienen divisores comunes: 4/6 se reduce a 2/3.' },
        { titulo: 'Una lista corta', texto: 'Probar todos los números en un polinomio no termina nunca. Por eso, antes de evaluar, se arma una lista corta de candidatas: números que podrían ser raíces.' },
        { titulo: 'Candidata no es raíz', texto: 'Una candidata solo es raíz si, al reemplazarla, el polinomio vale 0. Si no da 0, se tacha y se prueba la siguiente.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay seis candidatas para 2x³ − 3x² − 3x + 2. Arrastra el punto por el eje y fíjate en cuáles la curva pasa justo por el eje.' },
      ],
    },
    juega: {
      consigna: 'P(x) = 2x³ − 3x² − 3x + 2. Arrastra la candidata por el eje: el punto marca P en ella. Una raíz da cero.',
      voz: 'Busca las tres que dan cero.',
      pieza: 'ejes',
      controles: [{ id: 'k', etiqueta: 'Candidata', opciones: CANDS.map(([p, q], i) => ({ valor: i, texto: fr(p, q) })) }],
      dibujo: v => ({ datos: graficaCandidata(v.k), estado: {} }),
      arrastres: [{
        id: 'candidata', etiqueta: 'candidata sobre el eje x', color: 'c-o',
        donde: v => { const g = EJES().geometria(EJES3), [p, q] = CANDS[v.k]; return { x: g.X(p / q), y: g.Y(0) }; },
        mover: pt => {
          const xv = inversa(EJES().geometria(EJES3).X, -2.5, 2.5)(pt.x);
          let k = 0; CANDS.forEach(([p, q], i) => { if (Math.abs(p / q - xv) < Math.abs(CANDS[k][0] / CANDS[k][1] - xv)) k = i; });
          return { k };
        },
      }],
      lectura: v => { const [p, q] = CANDS[v.k], val = valorFrac(P3, p, q); return [`P(${fr(p, q)}) = ${fr(val, q ** 3)}`, val === 0 ? ': es raíz' : '']; },
      minimo: 4,
    },
    predice: {
      pregunta: ['Un polinomio de coeficientes enteros empieza en 3', x, '³ y termina en + 2. ¿Cuál NO puede ser raíz racional suya?'],
      opciones: [
        { id: 'c', texto: '3/2', correcta: true },
        { id: 'dos-tercios', texto: '2/3', error: 'TAL-PQ-INVERTIDO', siFuera: '2/3 sí puede: 2 divide a 2 y 3 divide a 3. Que lo sea, se comprueba.' },
        { id: 'tercio', texto: '−1/3', error: 'TAL-PQ-INVERTIDO', siFuera: '−1/3 sí puede: 1 divide a 2 y 3 divide a 3.' },
        { id: 'dos', texto: '2', error: 'TAL-PQ-INVERTIDO', siFuera: '2 sí puede: 2 divide a 2 y 1 divide a 3.' },
      ],
      dibujo: { datos: { columnas: ['p divide a 2', 'q divide a 3'], filas: [['?', '?']] }, estado: {} },
      revelar: { datos: { columnas: ['p divide a 2', 'q divide a 3'], filas: [['1, 2', '1, 3']], pie: 'candidatas: ±1, ±2, ±1/3, ±2/3' }, estado: {} },
      coincide: 'Coincide: en 3/2 el denominador 2 no divide al 3 del principio.',
    },
    mira: {
      datos: {
        columnas: ['p/q', 'P(p/q)', '¿raíz?'],
        filas: [[1, 1], [-1, 1], [2, 1], [-2, 1], [1, 2], [-1, 2]].map(([p, q], i) => {
          const val = valorFrac(P3, p, q);
          return [{ t: fr(p, q), desde: 1, color: 'o' }, { t: fr(val, q ** 3), desde: 2 + (i > 2 ? 1 : 0) }, { t: val === 0 ? '✓' : '✗', desde: 2 + (i > 2 ? 1 : 0), color: val === 0 ? 'd' : 'h', fuerte: true }];
        }),
        pie: '', alt: 'Candidatas ±1, ±2, ±1/2 de 2x³ − 3x² − 3x + 2: son raíces −1, 2 y 1/2',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'p divide al término independiente 2; q, al coeficiente principal 2.', ecuacion: ['p ∈ {1, 2}', '   ·   ', 'q ∈ {1, 2}'] },
        { estado: { corte: 2 }, texto: 'Se prueban las enteras: −1 y 2 dan cero.', ecuacion: ['P(−1) = 0', '   ·   ', 'P(2) = 0'] },
        { estado: { corte: 3 }, texto: 'Se prueban las fracciones: 1/2 también da cero.', ecuacion: ['P(1/2) = 2/8 − 3/4 − 3/2 + 2 = 0'] },
        { estado: { corte: 3 }, texto: 'Tres raíces para un polinomio de grado 3: no hay más.', ecuacion: ['P(', x, ') = (', x, ' + 1)(', x, ' − 2)(2', x, ' − 1)'] },
      ],
    },
    regla: {
      texto: 'Si p/q, reducida, es raíz de un polinomio de coeficientes enteros, p divide al término independiente y q divide al coeficiente principal.',
      ecuacion: [{ frac: ['p', 'q'] }, ':  p | ', { llave: [{ sub: ['a', '0'] }], nota: 'el independiente' }, '   ·   ', 'q | ', { llave: [{ sub: ['a', 'n'] }], nota: 'el principal' }],
      condicion: 'coeficientes enteros. La lista da candidatas, no raíces: cada una se comprueba en el polinomio.',
    },
    // Así se resuelve (fase 2): el mismo P = (qx − p)(x − r₂)(x − r₃) de «Ahora tú», con otras semillas; con semilla par
    // se busca la raíz no entera p/q, y con impar se decide si una fracción puede ser raíz. valorFrac() hace las cuentas.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        const q = r.uno([2, 3]), p = r.uno([1, -1, 2, -2].filter(v => mcd(Math.abs(v), q) === 1));
        const r2 = r.uno([-3, -2, -1, 1, 2, 3]), r3 = r.uno([-3, -1, 1, 3, 2].filter(v => v !== r2));
        const base = desdeRaices([r2, r3]);
        const coefs = [q * base[0], q * base[1] - p * base[0], q * base[2] - p * base[1], -p * base[2]];
        const an = coefs[0], a0 = coefs[3];
        const divisores = n => { const out = []; for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) out.push(d); return out; };
        const P = ['P(', x, ') = ', ...poli(coefs)], Pv = (pp, qq) => fr(valorFrac(coefs, pp, qq), qq ** 3);
        const datos = { tipo: 'datos', texto: `Los coeficientes son enteros. El término independiente es ${f(a0)} y el coeficiente principal es ${f(an)}.` };
        const regla = { tipo: 'regla', texto: `Si una fracción reducida p/q es raíz, p tiene que dividir a ${f(Math.abs(a0))} y q tiene que dividir a ${f(an)}. Después se comprueba en P.` };
        const listas = { tipo: 'datos', texto: `Divisores de ${f(Math.abs(a0))}: ${divisores(a0).join(', ')}. Divisores de ${f(an)}: ${divisores(an).join(', ')}.` };
        if (s % 2 === 0) {
          const cand = []; for (const pp of divisores(a0)) for (const qq of divisores(an)) for (const sg of [1, -1]) if (qq > 1 && mcd(pp, qq) === 1) cand.push([sg * pp, qq]);
          const fallan = cand.filter(([pp, qq]) => valorFrac(coefs, pp, qq) !== 0);
          const mala = fallan.length ? fallan.sort((u, v) => Math.abs(u[0] / u[1]) - Math.abs(v[0] / v[1]))[0] : null;
          const tabla = filas => ({ datos: { columnas: ['p/q', 'P(p/q)', '¿raíz?'], filas: filas.map(([pp, qq]) => [{ t: fr(pp, qq), color: 'o' }, Pv(pp, qq), { t: valorFrac(coefs, pp, qq) === 0 ? '✓' : '✗', color: valorFrac(coefs, pp, qq) === 0 ? 'd' : 'h', fuerte: true }]) }, estado: {} });
          const pasos = [
            { tipo: 'pide', texto: 'Piden una raíz racional que no sea un número entero.' },
            datos, regla,
          ];
          if (mala) pasos.push({ tipo: 'cuentas', texto: `Con q = ${mala[1]} pruebo ${fr(...mala)}: no da cero, así que no es raíz.`, ecuacion: [`P(${fr(...mala)}) = ${Pv(...mala)}`], dibujo: tabla([mala]) });
          pasos.push({ tipo: 'cuentas', texto: `Pruebo ${fr(p, q)}: da cero. Es raíz.`, ecuacion: [`P(${fr(p, q)}) = ${Pv(p, q)}`], dibujo: tabla(mala ? [mala, [p, q]] : [[p, q]]) });
          pasos.push({ tipo: 'sentido', texto: `Comprueba: como ${fr(p, q)} es raíz, ${poliTxt([q, -p])} es factor. Multiplicado por los otros dos factores, vuelve P.`,
            ecuacion: [`(${poliTxt([q, -p])})(${poliTxt([1, -r2])})(${poliTxt([1, -r3])}) = ${poliTxt(mult3(q, p, r2, r3))}`] });
          return {
            enunciado: ['Halla una raíz racional no entera de ', ...poli(coefs), ' = 0.'],
            dibujo: { datos: { columnas: ['p/q', 'P(p/q)', '¿raíz?'], filas: [['?', '?', '?']] }, estado: {} },
            pasos,
            respuesta: [x, ` = ${fr(p, q)} es raíz.`],
          };
        }
        const imposible = [[q * 2 + 1, an], [an, Math.abs(a0) + 1]].find(([pp, qq]) => mcd(pp, qq) === 1 && (a0 % pp !== 0 || an % qq !== 0)) || [Math.abs(a0) + 1, 1];
        const [ip, iq] = imposible, pDiv = a0 % ip === 0, qDiv = an % iq === 0;
        const vistas = new Set(), lista = [];
        for (const qq of divisores(an)) for (const pp of divisores(a0)) { const t = fr(pp, qq); if (!vistas.has(t)) { vistas.add(t); lista.push(`±${t}`); } }
        return {
          enunciado: ['Por el criterio p/q, ¿puede ', fr(ip, iq), ' ser raíz racional de ', ...poli(coefs), ' = 0?'],
          dibujo: { datos: { columnas: ['p divide a ' + f(Math.abs(a0)), 'q divide a ' + f(an)], filas: [['?', '?']] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden decidir si ${fr(ip, iq)} entra en la lista de candidatas, sin evaluar.` },
            datos, regla, listas,
            { tipo: 'cuentas', texto: `En ${fr(ip, iq)}, p = ${ip} ${pDiv ? 'sí' : 'no'} divide a ${f(Math.abs(a0))} y q = ${iq} ${qDiv ? 'sí' : 'no'} divide a ${f(an)}. ${pDiv || qDiv ? 'Falla una condición.' : 'Fallan las dos condiciones.'}`,
              dibujo: { datos: { columnas: ['p divide a ' + f(Math.abs(a0)), 'q divide a ' + f(an)], filas: [[divisores(a0).join(', '), divisores(an).join(', ')]], pie: `${fr(ip, iq)}: p = ${ip}, q = ${iq}` }, estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: armo todas las candidatas ±p/q con esos divisores. ${fr(ip, iq)} no aparece entre ellas.`, ecuacion: [`candidatas: ${lista.join(', ')}`] },
          ],
          respuesta: `No: ${fr(ip, iq)} no puede ser raíz racional.`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        const q = r.uno([2, 3]), p = r.uno([1, -1, 2, -2].filter(v => mcd(Math.abs(v), q) === 1));
        const r2 = r.uno([-3, -2, -1, 1, 2, 3]), r3 = r.uno([-3, -1, 1, 3, 2].filter(v => v !== r2));
        // P(x) = (q x − p)(x − r2)(x − r3): coeficientes enteros y la raíz racional p/q.
        const base = desdeRaices([r2, r3]);
        const coefs = [q * base[0], q * base[1] - p * base[0], q * base[2] - p * base[1], -p * base[2]];
        const an = coefs[0], a0 = coefs[3];
        const divisores = n => { const out = []; for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) out.push(d); return out; };
        const candidatas = [];
        for (const pp of divisores(a0)) for (const qq of divisores(an)) for (const sg of [1, -1]) if (mcd(pp, qq) === 1) candidatas.push([sg * pp, qq]);
        const raices = candidatas.filter(([pp, qq]) => valorFrac(coefs, pp, qq) === 0);
        const noRaiz = candidatas.filter(([pp, qq]) => valorFrac(coefs, pp, qq) !== 0);
        const imposible = [[q * 2 + 1, an], [an, Math.abs(a0) + 1]].map(([pp, qq]) => [pp, qq]).find(([pp, qq]) => mcd(pp, qq) === 1 && (a0 % pp !== 0 || an % qq !== 0)) || [Math.abs(a0) + 1, 1];
        if (s % 2 === 0) {
          const bien = r.uno(raices.filter(([, qq]) => qq !== 1).concat(raices).slice(0, 2));
          const dist = r.mezclar(noRaiz).slice(0, 3);
          return {
            pregunta: ['¿Cuál de estas candidatas es raíz de ', ...poli(coefs), ' = 0?'],
            opciones: distintas([{ id: 'c', texto: fr(...bien), correcta: true }, ...dist.map(([pp, qq], i) => ({ id: `d${i}`, texto: fr(pp, qq), error: 'TAL-CANDIDATA', siFuera: `${fr(pp, qq)} está en la lista de candidatas, pero P(${fr(pp, qq)}) = ${fr(valorFrac(coefs, pp, qq), qq ** 3)}.` }))]),
            solucion: { texto: `Al reemplazar ${fr(...bien)}, el polinomio vale cero.`, ecuacion: [`P(${fr(...bien)}) = 0`], dibujo: { datos: { columnas: ['p/q', 'P(p/q)'], filas: [bien, ...dist].map(([pp, qq]) => [fr(pp, qq), fr(valorFrac(coefs, pp, qq), qq ** 3)]) }, estado: {} } },
          };
        }
        const dist = r.mezclar(candidatas).slice(0, 3);
        return {
          pregunta: ['Por el criterio p/q, ¿cuál NO puede ser raíz racional de ', ...poli(coefs), ' = 0?'],
          opciones: distintas([{ id: 'c', texto: fr(...imposible), correcta: true }, ...dist.map(([pp, qq], i) => ({ id: `d${i}`, texto: fr(pp, qq), error: 'TAL-PQ-INVERTIDO', siFuera: `${fr(pp, qq)} sí puede: ${Math.abs(pp)} divide a ${f(Math.abs(a0))} y ${qq} divide a ${f(an)}.` }))]),
          solucion: { texto: `p debe dividir a ${f(Math.abs(a0))} y q a ${f(an)}; ${fr(...imposible)} no cumple.`, ecuacion: [`p | ${f(Math.abs(a0))}`, '   ·   ', `q | ${f(an)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la pareja conjugada ----------
  // Cambia: b y c de x² + bx + c · Permanece: el plano (parte real, parte imaginaria) · Progresa: dos raíces reales
  // que chocan y se abren hacia arriba y abajo · Se reserva: la hipótesis «coeficientes reales» · Debe verse: espejo en el eje real.
  // Se agarra: la raíz de la derecha (o la de arriba). Llevarla hacia la otra sube c; cuando chocan, sigue hacia arriba
  // y su pareja baja en espejo. Con b fijo, c = b²/4 − (x + b/2)² + y² vale en el eje y fuera de él: el gesto es continuo.
  // b queda en − y +: moverlo corre a las dos raíces a la vez, y una segunda manija sobre la otra raíz se leería como
  // si cada raíz se moviera sola.
  const PLANO = { x: { min: -5, max: 5, paso: 1, nombre: 'real', decimales: 0, color: 'o' }, y: { min: -4, max: 4, paso: 1, nombre: 'imaginaria', decimales: 0 } };
  const imag = (re, im) => (im === 0 ? f(re) : `${re ? f(re) + ' ' : ''}${im < 0 ? '−' : re ? '+' : ''}${re ? ' ' : ''}${Math.abs(im) === 1 ? '' : f(Math.abs(im), 2)}i`);
  const raicesCuad = (bb, cc) => {
    const d = bb * bb - 4 * cc;
    if (d >= 0) { const q = Math.sqrt(d); return [[(-bb - q) / 2, 0], [(-bb + q) / 2, 0]]; }
    const q = Math.sqrt(-d) / 2; return [[-bb / 2, q], [-bb / 2, -q]];
  };
  const conjugadas = {
    id: 'conjugadas',
    titulo: 'La raíz no real viene acompañada',
    temas: ['Paridad de raíces irracionales y complejas'],
    pieza: 'ejes',
    // Lee (fase 2): por qué aparece i y cómo se dibuja a + bi; no dice qué otra raíz llega con una no real (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Cuando no alcanza', texto: 'x² + 4 = 0 no tiene solución real: ningún número real al cuadrado da −4. Para resolverla se usa i, con i² = −1, y aparecen números como 2i o 1 + 3i.' },
        { titulo: 'Dos partes', texto: 'En a + bi, a es la parte real y b, la parte imaginaria. En 2 + 3i, la parte real es 2 y la imaginaria es 3.' },
        { titulo: 'Un plano para dibujarlos', texto: 'a + bi se dibuja como un punto: a se lee en el eje horizontal y b en el vertical. Los números reales quedan sobre el eje horizontal.' },
        { titulo: 'Qué mirar', texto: 'En el juego, sube c poco a poco. Mira qué pasa con los dos puntos verdes cuando se juntan y dejan el eje horizontal.' },
      ],
    },
    juega: {
      consigna: 'Mueve b y c en x² + bx + c = 0. El plano muestra sus raíces: horizontal la parte real, vertical la imaginaria.',
      voz: 'Sube c hasta que las raíces dejen el eje.',
      controles: [
        { id: 'b', etiqueta: 'b', color: 'c-i', min: -4, max: 4, paso: 2, inicio: -2, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -3, max: 8, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => {
        const rs = raicesCuad(v.b, v.c);
        return { datos: Object.assign({}, PLANO, { puntos: rs.map(([re, im]) => ({ x: re, y: im, color: 'd', rotulo: imag(re, im) })), alt: `Raíces de x² + ${v.b}x + ${v.c}: ${rs.map(([re, im]) => imag(re, im)).join(' y ')}` }), estado: {} };
      },
      arrastres: [{
        id: 'raiz', etiqueta: 'raíz de la derecha o de arriba', color: 'c-h',
        donde: v => { const g = EJES().geometria(PLANO), [re, im] = raicesCuad(v.b, v.c)[1]; return { x: g.X(re), y: g.Y(Math.abs(im)) }; },
        mover: (pt, v) => {
          const g = EJES().geometria(PLANO), re = inversa(g.X, -5, 5)(pt.x), im = Math.max(0, inversa(g.Y, -4, 4)(pt.y));
          return { c: v.b * v.b / 4 - (re + v.b / 2) ** 2 + im * im };
        },
      }],
      lectura: v => { const d = v.b * v.b - 4 * v.c, rs = raicesCuad(v.b, v.c); return [d === 0 ? `${imag(...rs[0])}: raíz doble, real` : `${imag(...rs[0])} y ${imag(...rs[1])}: ${d < 0 ? 'no reales, en espejo' : 'reales'}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['Un polinomio de coeficientes reales tiene la raíz 2 + 3i. ¿Qué otro número es seguro que también es raíz?'],
      opciones: [
        { id: 'c', texto: '2 − 3i', correcta: true },
        { id: 'signo-real', texto: '−2 + 3i', error: 'TAL-CONJUGADA', siFuera: 'El conjugado conserva la parte real y cambia la imaginaria.' },
        { id: 'opuesto', texto: '−2 − 3i', error: 'TAL-CONJUGADA', siFuera: 'Ese es el opuesto; el conjugado solo cambia el signo de la parte imaginaria.' },
        { id: 'cambia', texto: '3 + 2i', error: 'TAL-CONJUGADA', siFuera: 'Intercambiar partes no da la pareja: se refleja en el eje real.' },
      ],
      dibujo: { datos: Object.assign({}, PLANO, { puntos: [{ x: 2, y: 3, color: 'd', rotulo: '2 + 3i' }], alt: 'La raíz 2 + 3i en el plano' }), estado: {} },
      revelar: { datos: Object.assign({}, PLANO, { puntos: [{ x: 2, y: 3, color: 'd', rotulo: '2 + 3i', guias: true }, { x: 2, y: -3, color: 'd', rotulo: '2 − 3i', guias: true }], alt: '2 + 3i y su conjugado 2 − 3i, en espejo respecto del eje real' }), estado: {} },
      coincide: 'Coincide: con coeficientes reales, la raíz y su reflejo en el eje real van juntas.',
    },
    mira: {
      datos: Object.assign({}, PLANO, {
        puntos: [{ x: 2, y: 3, color: 'd', rotulo: '2 + 3i', desde: 1 }, { x: 2, y: -3, color: 'd', rotulo: '2 − 3i', desde: 2 }, { x: 1 + Math.SQRT2, y: 0, color: 'o', rotulo: '1 ± √2', desde: 4 }, { x: 1 - Math.SQRT2, y: 0, color: 'o', desde: 4 }],
        alt: 'Pareja 2 ± 3i en espejo y pareja 1 ± √2 sobre el eje real',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Si 2 + 3i es raíz, x − (2 + 3i) es factor.', ecuacion: [x, ' − (2 + 3i)'] },
        { estado: { corte: 2 }, texto: 'Junto con su conjugado, la suma y el producto salen reales.', ecuacion: ['suma 4', '   ·   ', 'producto 4 + 9 = 13'] },
        { estado: { corte: 3 }, texto: 'Por eso el factor de grado 2 tiene coeficientes reales.', ecuacion: [x, '² − 4', x, ' + 13'] },
        { estado: { corte: 4 }, texto: 'Con coeficientes racionales pasa igual con raíces como 1 + √2.', ecuacion: ['(1 + √2) + (1 − √2) = 2', '   ·   ', 'producto −1'] },
        { estado: { corte: 4 }, texto: 'Ese factor es x² − 2x − 1: coeficientes racionales.', ecuacion: [x, '² − 2', x, ' − 1'] },
      ],
    },
    regla: {
      texto: 'Con coeficientes reales, si a + bi es raíz también lo es a − bi. Con coeficientes racionales, si a + b√d es raíz, también a − b√d.',
      ecuacion: ['a + bi  →  ', { llave: ['a − bi'], nota: 'su conjugada', color: 'c-d' }],
      condicion: 'las hipótesis importan: √d irracional y a, b, d racionales. Con coeficientes irracionales, la pareja no está garantizada.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú» según la semilla (menor grado con una raíz no real, producto
    // de la pareja irracional y la hipótesis de los coeficientes), con otras semillas; el plano marca la pareja.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3, par = v => (v < 0 ? `(${f(v)})` : f(v));
        const plano = (puntos, ancho = 5) => ({ datos: Object.assign({}, PLANO, { x: Object.assign({}, PLANO.x, { min: -ancho, max: ancho }), puntos, alt: `Raíces en el plano: ${puntos.map(q => q.rotulo).join(' y ')}` }), estado: {} });
        if (tipo === 0) {
          const a = r.ent(-3, 3), b = r.ent(1, 4), m = r.ent(1, 3);
          const raiz = imag(a, b), conj = imag(a, -b);
          return {
            enunciado: [`Un polinomio de coeficientes reales tiene la raíz ${raiz} y ${m === 1 ? 'una raíz real' : `${m} raíces reales`}. ¿Cuál es el menor grado posible?`],
            dibujo: plano([{ x: a, y: b, color: 'd', rotulo: raiz }]),
            pasos: [
              { tipo: 'pide', texto: 'Piden el grado más chico que puede tener ese polinomio.' },
              { tipo: 'datos', texto: `Coeficientes reales, una raíz no real, ${raiz}, y ${m === 1 ? 'una raíz real' : `${m} raíces reales`}.` },
              { tipo: 'regla', texto: 'Con coeficientes reales, cada raíz no real llega con su conjugada: la misma parte real y la parte imaginaria con el signo cambiado.' },
              { tipo: 'cuentas', texto: `La conjugada de ${raiz} es ${conj}. Cuento las reales y las dos no reales.`, ecuacion: [`${m} + 2 = ${m + 2}`],
                dibujo: plano([{ x: a, y: b, color: 'd', rotulo: raiz, guias: true }, { x: a, y: -b, color: 'd', rotulo: conj, guias: true }]) },
              { tipo: 'sentido', texto: 'Comprueba: la raíz y su conjugada forman un factor de grado 2 con coeficientes reales. Sin la conjugada, no lo serían.',
                ecuacion: ['(', x, ` − (${raiz}))(`, x, ` − (${conj})) = `, ...poli([1, -2 * a, a * a + b * b])] },
            ],
            respuesta: `El menor grado es ${m + 2}.`,
          };
        }
        if (tipo === 1) {
          const a = r.ent(-3, 3), b = r.ent(1, 3), d = r.uno([2, 3, 5]);
          const bd = `${b === 1 ? '' : b}√${d}`, raiz = `${a ? f(a) + ' + ' : ''}${bd}`, otra = `${a ? f(a) + ' − ' : '−'}${bd}`;
          const S = 2 * a, P = a * a - b * b * d, v = b * Math.sqrt(d), ancho = Math.ceil(Math.abs(a) + v + 0.5);
          return {
            enunciado: [`Un polinomio de coeficientes racionales tiene la raíz ${raiz}. Esa raíz y su pareja segura suman S y multiplican P. ¿Cuánto vale P?`],
            dibujo: plano([{ x: a + v, y: 0, color: 'd', rotulo: raiz }], ancho),
            pasos: [
              { tipo: 'pide', texto: 'Piden P, el producto de la raíz dada por su pareja.' },
              { tipo: 'datos', texto: `La raíz es ${raiz}, con √${d} irracional, y los coeficientes son racionales.` },
              { tipo: 'regla', texto: `Con coeficientes racionales, una raíz con √${d} llega con su pareja: la misma, con la raíz cuadrada restada. Su producto es una diferencia de cuadrados.` },
              { tipo: 'cuentas', texto: `La pareja es ${otra}. Multiplico: el primero al cuadrado menos (${bd})².`, ecuacion: [`P = ${par(a)}² − ${b * b} · ${d} = ${f(P)}`],
                dibujo: plano([{ x: a + v, y: 0, color: 'd', rotulo: raiz }, { x: a - v, y: 0, color: 'd', rotulo: otra }], ancho) },
              { tipo: 'sentido', texto: `Comprueba: la suma es S = ${f(S)}, y la pareja da un factor con coeficientes racionales.`, ecuacion: ['(', x, ` − (${raiz}))(`, x, ` − (${otra})) = `, ...poli([1, -S, P])] },
            ],
            respuesta: `P = ${f(P)}`,
          };
        }
        const a = r.ent(1, 3), v = a + Math.SQRT2;
        return {
          enunciado: [`Un polinomio de coeficientes reales, pero no todos racionales, tiene la raíz ${a} + √2. ¿Es seguro que ${a} − √2 también es raíz?`],
          dibujo: plano([{ x: v, y: 0, color: 'd', rotulo: `${a} + √2` }]),
          pasos: [
            { tipo: 'pide', texto: `Piden si ${a} − √2 tiene que ser raíz en todos los casos.` },
            { tipo: 'datos', texto: 'Los coeficientes son reales, pero no todos son racionales.' },
            { tipo: 'regla', texto: 'La pareja con √2 solo está garantizada si los coeficientes son racionales. Si no lo son, basta un ejemplo en contra.' },
            { tipo: 'cuentas', texto: `Pruebo el polinomio más simple con esa raíz: uno de grado 1. Sus coeficientes son 1 y −(${a} + √2), reales y no racionales.`,
              ecuacion: [x, ` − (${a} + √2) = 0  ⇒  `, x, ` = ${a} + √2`] },
            { tipo: 'sentido', texto: `Comprueba: un polinomio de grado 1 tiene una sola raíz. No cabe ${a} − √2, así que no es seguro.` },
          ],
          respuesta: 'No es seguro.',
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const a = r.ent(-3, 3), b = r.ent(1, 4), m = r.ent(1, 3);
          const raiz = imag(a, b), conj = imag(a, -b);
          return {
            pregunta: [`Un polinomio de coeficientes reales tiene la raíz ${raiz} y ${m === 1 ? 'una raíz real' : `${m} raíces reales`}. ¿Cuál es el menor grado posible?`],
            opciones: distintas([
              { id: 'c', texto: f(m + 2), correcta: true },
              { id: 'sin-pareja', texto: f(m + 1), error: 'TAL-CONJUGADA', siFuera: `Falta ${conj}: con coeficientes reales viene con ${raiz}.` },
              { id: 'doble', texto: f(2 * m + 2), error: 'TAL-CONJUGADA', siFuera: 'Las raíces reales no necesitan pareja.' },
              { id: 'cuatro', texto: f(m + 4), error: 'TAL-CONJUGADA', siFuera: 'La pareja de una raíz no real es una sola: su conjugada.' },
            ]),
            solucion: { texto: `${raiz} trae a ${conj}; las reales van solas.`, ecuacion: [`${m} + 2 = ${m + 2}`] },
          };
        }
        if (tipo === 1) {
          const a = r.ent(-3, 3), b = r.ent(1, 3), d = r.uno([2, 3, 5]);
          const raiz = `${a ? f(a) + ' + ' : ''}${b === 1 ? '' : b}√${d}`, otra = `${a ? f(a) + ' − ' : '−'}${b === 1 ? '' : b}√${d}`;
          const S = 2 * a, P = a * a - b * b * d;
          return {
            pregunta: [`Un polinomio de coeficientes racionales tiene la raíz ${raiz}. Esa raíz y su pareja segura suman S y multiplican P. ¿Cuánto vale P?`],
            opciones: distintas([
              { id: 'c', texto: f(P), correcta: true },
              { id: 'suma', texto: f(a * a + b * b * d), error: 'TAL-CONJUGADA', siFuera: 'En (a + b√d)(a − b√d) el término b²d se resta.' },
              { id: 'S', texto: f(S), error: 'TAL-PRODUCTO', siFuera: 'Ese valor es la suma S, no el producto.' },
              { id: 'sin-d', texto: f(a * a - b * b), error: 'TAL-CONJUGADA', siFuera: `Falta el factor ${d}: (b√d)² = b²d.` },
            ]),
            solucion: { texto: `La pareja es ${otra}; diferencia de cuadrados.`, ecuacion: [`P = ${f(a)}² − ${b * b}·${d} = ${f(P)}`] },
          };
        }
        const a = r.ent(1, 3);
        return {
          pregunta: [`Un polinomio de coeficientes reales, pero no todos racionales, tiene la raíz ${a} + √2. ¿Es seguro que ${a} − √2 también es raíz?`],
          opciones: [
            { id: 'c', texto: 'No: la pareja irracional exige coeficientes racionales', correcta: true },
            { id: 'si', texto: 'Sí: las raíces irracionales siempre van en pareja', error: 'TAL-HIPOTESIS', siFuera: `Valdría con coeficientes racionales. Por ejemplo, x − (${a} + √2) tiene una sola raíz.` },
          ],
          solucion: { texto: `x − ${a} − √2 tiene coeficientes reales y una sola raíz.`, ecuacion: [x, ` − (${a} + √2) = 0  ⇒  `, x, ` = ${a} + √2`] },
        };
      },
    },
  };

  // ---------- Idea 5: un cambio de variable ----------
  // Cambia: las dos raíces en u · Permanece: x⁴ − Sx² + P y la recta · Progresa: cada u positiva que se abre en ±√u
  // · Se reserva: u negativa, que no da x reales · Debe verse: dos filas, u arriba y x abajo.
  // Se agarran: los dos valores de u en la fila de arriba; los x de abajo se abren o desaparecen al cruzar el 0.
  const RECTA5 = (elementos, extra = {}) => Object.assign({ min: -4, max: 6, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos }, extra);
  const xDeU = uu => (uu > 0 ? [-Math.sqrt(uu), Math.sqrt(uu)] : uu === 0 ? [0] : []);
  const cambio = {
    id: 'cambio-de-variable',
    titulo: 'Un cambio de variable',
    temas: ['Ecuaciones bicuadradas y recíprocas'],
    pieza: 'recta',
    // Lee (fase 2): qué es una bicuadrada y una recíproca y qué hace el cambio de variable; no dice qué u dan x reales (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Solo potencias pares', texto: 'En x⁴ − 13x² + 36 = 0 solo aparecen x⁴, x² y un número. Una ecuación así se llama bicuadrada, porque x⁴ es el cuadrado de x².' },
        { titulo: 'Otro nombre', texto: 'Si llamas u a x², la ecuación se vuelve u² − 13u + 36 = 0: una cuadrática, que ya sabes resolver. Eso es un cambio de variable.',
          ecuacion: [u, ' = ', x, '²'] },
        { titulo: 'Al derecho y al revés', texto: 'En x⁴ − 5x³ + 8x² − 5x + 1 = 0, los coeficientes 1, −5, 8, −5, 1 se leen igual desde los dos lados. Es una ecuación recíproca, con su propio cambio de variable.' },
        { titulo: 'Qué mirar', texto: 'En el juego, arriba van los valores de u y abajo los de x. Prueba u positivas, u = 0 y u negativas, y cuenta los puntos de abajo.' },
      ],
    },
    juega: {
      consigna: 'Elige dos valores de u = x². Arriba van los valores de u; abajo, los x reales que salen de cada uno.',
      voz: 'Prueba una u negativa.',
      controles: [
        { id: 'u1', etiqueta: 'u₁', color: 'c-i', min: -4, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'u2', etiqueta: 'u₂', color: 'c-i', min: -4, max: 4, paso: 1, inicio: 4, decimales: 0 },
      ],
      arrastres: ['u1', 'u2'].map((id, i) => ({
        id: `valor-${id}`, etiqueta: `valor de ${['u₁', 'u₂'][i]}`, color: 'c-i',
        donde: v => { const g = RECTA().geometria(RECTA5([])); return { x: g.x(v[id]), y: g.filaY(1) }; },
        mover: pt => ({ [id]: inversa(RECTA().geometria(RECTA5([])).x, -4, 6)(pt.x) }),
      })),
      dibujo: v => {
        const els = [v.u1, v.u2].flatMap((uu, i) => [{ tipo: 'punto', x: uu, color: 'i', abierto: uu < 0, rotulo: v.u1 === v.u2 ? (i ? undefined : 'u₁ = u₂') : ['u₁', 'u₂'][i], fila: 1 }, ...xDeU(uu).map(xx => ({ tipo: 'punto', x: xx, color: 'd' }))]);
        return { datos: RECTA5(els, { alt: `u = ${v.u1} y ${v.u2}: x reales ${[v.u1, v.u2].flatMap(xDeU).map(xx => f(xx)).join(', ') || 'ninguno'}` }), estado: {} };
      },
      lectura: v => { const xs = [...new Set([v.u1, v.u2].flatMap(xDeU).map(xx => f(xx)))]; return [x, ` reales: ${xs.length ? xs.join('; ') : 'ninguno'}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuántas soluciones reales tiene ', x, '⁴ + 3', x, '² − 4 = 0?'],
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'u-neg', texto: '4', error: 'TAL-U-NEG', siFuera: 'Serían 4 si las dos u fueran positivas; u = −4 no da x reales.' },
        { id: 'sin-mas', texto: '1', error: 'TAL-SIN-MAS', siFuera: 'u = 1 da dos valores: x = 1 y x = −1.' },
        { id: 'cero', texto: '0', error: 'TAL-U-NEG', siFuera: 'u = 1 es positiva: de ella salen dos soluciones reales.' },
      ],
      dibujo: { datos: RECTA5([], { min: -5, max: 5 }), estado: {} },
      revelar: { datos: RECTA5([{ tipo: 'punto', x: 1, color: 'i', rotulo: 'u=1', fila: 1 }, { tipo: 'punto', x: -4, color: 'i', abierto: true, rotulo: 'u=−4', fila: 1 }, { tipo: 'punto', x: -1, color: 'd' }, { tipo: 'punto', x: 1, color: 'd' }], { min: -5, max: 5 }), estado: {} },
      coincide: 'Coincide: u² + 3u − 4 = 0 da u = 1 y u = −4, y solo u = 1 da x reales.',
    },
    mira: {
      datos: RECTA5([
        { tipo: 'punto', x: 1, color: 'i', rotulo: 'u=1', fila: 2, desde: 2 }, { tipo: 'punto', x: 4, color: 'i', rotulo: 'u=4', fila: 2, desde: 2 },
        ...[-2, -1, 1, 2].map(v => ({ tipo: 'punto', x: v, color: 'd', fila: 1, desde: 3 })),
        { tipo: 'punto', x: 1, color: 'o', desde: 6 },
        { tipo: 'punto', x: (3 - Math.sqrt(5)) / 2, color: 'o', desde: 6 }, { tipo: 'punto', x: (3 + Math.sqrt(5)) / 2, color: 'o', rotulo: 'recíproca', desde: 6 },
      ], { min: -3, max: 5, filas: 2, alt: 'u = 1 y 4 dan x = ±1 y ±2; la recíproca da x = 1 y (3 ± √5)/2' }),
      voz: 'Las formas cambiaron; la igualdad se conserva en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En x⁴ − 5x² + 4 = 0 solo hay x⁴ y x².', ecuacion: [u, ' = ', x, '²  ⇒  ', u, '² − 5', u, ' + 4 = 0'] },
        { estado: { corte: 2 }, texto: 'La cuadrática en u da dos valores.', ecuacion: [u, ' = 1', '   ·   ', u, ' = 4'] },
        { estado: { corte: 3 }, texto: 'Cada u positiva da dos x: ±√u.', ecuacion: [x, ' = ±1', '   ·   ', x, ' = ±2'] },
        { estado: { corte: 4 }, texto: 'Ecuación recíproca: x⁴ − 5x³ + 8x² − 5x + 1 = 0, de coeficientes simétricos.', ecuacion: ['1, −5, 8, −5, 1'] },
        { estado: { corte: 5 }, texto: 'x = 0 no es raíz: se divide entre x² con t = x + 1/x.', ecuacion: [t, '² − 5', t, ' + 6 = 0  ⇒  ', t, ' = 2  o  ', t, ' = 3'] },
        { estado: { corte: 6 }, texto: 't = 2 da x = 1 (doble); t = 3 da dos raíces más.', ecuacion: [x, ' = 1 (doble)', '   ·   ', x, ' = ', { frac: ['3 ± √5', '2'] }] },
      ],
    },
    regla: {
      texto: 'En la ecuación bicuadrada, u = x² da una cuadrática; cada u > 0 da x = ±√u. En la ecuación recíproca se divide entre x² y se usa t = x + 1/x.',
      ecuacion: [x, '² + ', { frac: ['1', [x, '²']] }, ' = ', { llave: [t], nota: 'x + 1/x', color: 'c-i' }, '² − 2'],
      condicion: 'u < 0 no da x reales; u = 0 da x = 0. En la ecuación recíproca, x = 0 nunca es raíz.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» según la semilla (cuántas soluciones reales tiene la
    // bicuadrada, o qué ecuación en t deja la recíproca), con otras semillas; la recta usa xDeU(), como el juego.
    resuelve: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s + 900);
        const ancho = { min: -10, max: 10, paso: 2 };
        if (s % 3 === 2) {
          const t1 = r.ent(2, 4), t2 = r.ent(-3, 5), A = -(t1 + t2), B = t1 * t2 + 2;
          const coefs = [1, A, B, A, 1], enT = [1, A, B - 2];
          const agrupa = ['(', x, '² + 1/', x, '²)', ...(A ? [A < 0 ? ' − ' : ' + ', Math.abs(A) === 1 ? '' : f(Math.abs(A)), '(', x, ' + 1/', x, ')'] : []), ...(B ? [B < 0 ? ' − ' : ' + ', f(Math.abs(B))] : []), ' = 0'];
          return {
            enunciado: ['En ', ...poli(coefs), ' = 0 se divide entre ', x, '² y se usa ', t, ' = ', x, ' + 1/', x, '. ¿Qué ecuación queda en ', t, '?'],
            dibujo: { datos: RECTA5([], Object.assign({ variable: 't', color: 'i', filas: 1 }, ancho)), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la ecuación que queda al escribirlo todo con t.' },
              { tipo: 'datos', texto: `Los coeficientes ${coefs.map(c => f(c)).join(', ')} se leen igual desde los dos lados: es recíproca, y x = 0 no es raíz.` },
              { tipo: 'regla', texto: 'Divido entre x² y junto los términos que se parecen. Como t² = x² + 2 + 1/x², se cumple x² + 1/x² = t² − 2.',
                ecuacion: [x, '² + ', { frac: ['1', [x, '²']] }, ' = ', t, '² − 2'] },
              { tipo: 'cuentas', texto: 'Al dividir entre x² y agrupar, cada paréntesis se cambia por su valor en t.',
                ecuacion: [...agrupa, '  ⇒  ', ...poli(enT, t), ' = 0'] },
              { tipo: 'sentido', texto: `Comprueba: esta ecuación sale de ${t1 === t2 ? `t = ${f(t1)}, raíz doble` : `t = ${f(t1)} y t = ${f(t2)}`}. Al reemplazar t = ${f(t1)}, da cero.`,
                ecuacion: [enCuadratica(enT, t1)],
                dibujo: { datos: RECTA5([t1, t2].map(v => ({ tipo: 'punto', x: v, color: 'i', rotulo: `t = ${f(v)}` })), Object.assign({ variable: 't', color: 'i', filas: 1 }, ancho)), estado: {} } },
            ],
            respuesta: [...poli(enT, t), ' = 0'],
          };
        }
        const u1 = r.uno([1, 4, 9, -1, -4]), u2 = r.uno([1, 4, 9, 2, 3, -9].filter(v => v !== u1));
        const S = u1 + u2, P = u1 * u2, xs = [u1, u2].flatMap(xDeU), n = xs.length, pos = [u1, u2].filter(v => v > 0);
        const raizTxt = v => (Number.isInteger(v) ? f(v) : `${v < 0 ? '−' : ''}√${Math.round(v * v)}`);
        const fig = conX => ({ datos: RECTA5([u1, u2].map((uu, i) => ({ tipo: 'punto', x: uu, color: 'i', abierto: uu < 0, rotulo: ['u₁', 'u₂'][i], fila: 1 })).concat(conX ? xs.map(v => ({ tipo: 'punto', x: v, color: 'd' })) : []),
          Object.assign({ alt: `u = ${u1} y ${u2}; x reales: ${xs.map(raizTxt).join(', ') || 'ninguno'}` }, ancho)), estado: {} });
        return {
          enunciado: ['¿Cuántas soluciones reales tiene ', ...poli([1, 0, -S, 0, P]), ' = 0?'],
          dibujo: { datos: RECTA5([], ancho), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántos números reales x cumplen la ecuación.' },
            { tipo: 'datos', texto: 'Solo aparecen x⁴, x² y un número: es una ecuación bicuadrada.' },
            { tipo: 'regla', texto: 'Cambio u = x² y resuelvo la cuadrática en u. Después vuelvo a x: cada u positiva da dos x, ±√u, y una u negativa no da ninguna.' },
            { tipo: 'cuentas', texto: 'La cuadrática en u se factoriza y da dos valores.',
              ecuacion: [...poli([1, -S, P], u), ' = (', ...poli([1, -u1], u), ')(', ...poli([1, -u2], u), ') = 0  ⇒  ', u, ` = ${f(u1)}`, '   ·   ', u, ` = ${f(u2)}`], dibujo: fig(false) },
            { tipo: 'cuentas', texto: pos.length === 2 ? 'Las dos u son positivas: cada una da dos valores de x.' : pos.length === 1 ? 'Solo una u es positiva; la negativa no da x reales.' : 'Las dos u son negativas: ningún real al cuadrado da un negativo.',
              ecuacion: [x, ` = ${xs.length ? [...xs].sort((p, q) => p - q).map(raizTxt).join('; ') : 'ninguno'}`], dibujo: fig(true) },
            { tipo: 'sentido', texto: pos.length ? `Comprueba con u = ${f(pos[0])}, que es x² para esas x: la cuadrática en u da cero.` : `Comprueba: x⁴, ${poliTxt([-S, 0, 0])} y ${f(P)} nunca son negativos y ${f(P)} es positivo, así que la suma nunca vale cero.`,
              ecuacion: pos.length ? [enCuadratica([1, -S, P], pos[0])] : undefined },
          ],
          respuesta: `${n} ${n === 1 ? 'solución real' : 'soluciones reales'}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const t1 = r.ent(2, 4), t2 = r.ent(-3, 5), A = -(t1 + t2), B = t1 * t2 + 2;
          const coefs = [1, A, B, A, 1];
          return {
            pregunta: ['En ', ...poli(coefs), ' = 0 se divide entre ', x, '² y se usa ', t, ' = ', x, ' + 1/', x, '. ¿Qué ecuación queda en ', t, '?'],
            opciones: distintas([
              { id: 'c', texto: [...poli([1, A, B - 2], t), ' = 0'], correcta: true },
              { id: 'sin-2', texto: [...poli([1, A, B], t), ' = 0'], error: 'TAL-RECIPROCA', siFuera: 'x² + 1/x² es t² − 2, no t²: falta restar 2.' },
              { id: 'mas-2', texto: [...poli([1, A, B + 2], t), ' = 0'], error: 'TAL-RECIPROCA', siFuera: '(x + 1/x)² = x² + 2 + 1/x²: el 2 se resta.' },
              { id: 'signo', texto: [...poli([1, -A, B - 2], t), ' = 0'], error: 'TAL-SIGNO', siFuera: 'El coeficiente de t es el mismo que el de x³.' },
            ]),
            solucion: { texto: 'x² + 1/x² = t² − 2; se reemplaza y se agrupa.', ecuacion: [...poli([1, A, B - 2], t), ' = 0'] },
          };
        }
        const u1 = r.uno([1, 4, 9, -1, -4]), u2 = r.uno([1, 4, 9, 2, 3, -9].filter(v => v !== u1));
        const S = u1 + u2, P = u1 * u2, xs = [u1, u2].flatMap(xDeU), n = xs.length;
        return {
          pregunta: ['¿Cuántas soluciones reales tiene ', ...poli([1, 0, -S, 0, P]), ' = 0?'],
          dibujo: { datos: RECTA5([], { min: -4, max: 4 }), estado: {} },
          opciones: distintas([
            { id: 'c', texto: f(n), correcta: true },
            { id: 'cuatro', texto: '4', error: 'TAL-U-NEG', siFuera: 'Serían 4 si las dos u fueran positivas; una u negativa no da x reales.' },
            { id: 'mitad', texto: f(n / 2), error: 'TAL-SIN-MAS', siFuera: 'Cada u positiva da dos valores, ±√u.' },
            { id: 'dos', texto: '2', error: 'TAL-SIN-MAS', siFuera: 'Esas son las soluciones en u; cada u > 0 da dos x.' },
            { id: 'cero', texto: '0', error: 'TAL-U-NEG', siFuera: 'Alguna u es positiva y da x reales.' },
          ]),
          solucion: { texto: `Con u = x²: u = ${f(u1)} y u = ${f(u2)}; solo las u positivas dan x.`, ecuacion: [x, ` = ${xs.length ? [...xs].sort((p, q) => p - q).map(v => (Number.isInteger(v) ? f(v) : `${v < 0 ? '−' : ''}√${Math.round(v * v)}`)).join('; ') : 'ninguno'}`], dibujo: { datos: RECTA5(xs.map(v => ({ tipo: 'punto', x: v, color: 'd' })), { min: -4, max: 4 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 6: zⁿ = w, un polígono regular ----------
  // Cambia: n y w · Permanece: la circunferencia de radio ⁿ√|w| · Progresa: las n flechas separadas 360°/n
  // · Se reserva: z³ = 8 con dos raíces no reales · Debe verse: n raíces, todas a la misma distancia del origen.
  // Se agarra: la segunda raíz (k = 1). Su ángulo es (θ + 360°)/n: acercarla a la primera mete más raíces en la vuelta.
  // La manija solo usa el ángulo del dedo respecto del origen, así que no importa que la escala cambie con |w| y n.
  const CIRC = rr => Array.from({ length: 48 }, (_, i) => [rr * Math.cos(i * Math.PI / 24), rr * Math.sin(i * Math.PI / 24)]);
  const raicesBin = (n, w) => { const m = Math.abs(w) ** (1 / n), th = w < 0 ? 180 : 0; return Array.from({ length: n }, (_, k) => { const g = (th + 360 * k) / n; return { g, p: [m * Math.cos(g * Math.PI / 180), m * Math.sin(g * Math.PI / 180)] }; }); };
  const planoBin = (n, w, conFlechas = true, extra = {}) => {
    const m = Math.abs(w) ** (1 / n), L = m * 1.25;
    return Object.assign({
      contorno: CIRC(m),
      guias: [{ de: [-L, 0], a: [L, 0] }, { de: [0, -L], a: [0, L] }],
      flechas: conFlechas ? raicesBin(n, w).map((q, k) => ({ de: [0, 0], a: q.p, color: 'd', paso: extra.porPaso ? k + 1 : 0 })) : [],
      puntos: conFlechas ? raicesBin(n, w).map((q, k) => ({ x: q.p[0], y: q.p[1], rotulo: `${f(q.g, 0)}°`, paso: extra.porPaso ? k + 1 : 0 })) : [],
    }, extra.datos || {});
  };
  const binomica = {
    id: 'binomica',
    titulo: 'zⁿ = w: un polígono regular',
    temas: ['Ecuación binómica'],
    pieza: 'flechas',
    // Lee (fase 2): qué es una ecuación binómica y cómo se dibuja un complejo como flecha; no dice cuántas soluciones
    // hay ni dónde quedan (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos términos', texto: 'Ecuaciones como z³ = 8 o z⁴ = 1 tienen solo dos términos: una potencia de z y un número. Por eso se llaman ecuaciones binómicas.',
          ecuacion: [z, 'ⁿ = w'] },
        { titulo: 'Un número, una flecha', texto: 'Un número complejo se dibuja como una flecha que sale del origen. Su largo es el módulo y su giro, medido desde el eje horizontal, es su ángulo.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cambia n y w. Cuenta las flechas verdes, compara su largo con la circunferencia y mira cuántos grados hay entre dos vecinas.' },
      ],
    },
    juega: {
      consigna: 'Elige n y w en zⁿ = w. Cada flecha verde es una solución: mira su largo y el ángulo entre flechas vecinas.',
      voz: 'Cuenta las flechas para cada n.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
        { id: 'w', etiqueta: 'w', opciones: [{ valor: 1, texto: '1' }, { valor: -1, texto: '−1' }, { valor: 16, texto: '16' }] },
      ],
      dibujo: v => ({ datos: planoBin(v.n, v.w), estado: {} }),
      arrastres: [{
        id: 'raiz-vecina', etiqueta: 'segunda raíz: acércala a la primera', color: 'c-d',
        donde: v => { const g = FL().geometria(planoBin(v.n, v.w)), q = raicesBin(v.n, v.w)[1].p; return { x: g.X(q[0]), y: g.Y(q[1]) }; },
        mover: (pt, v) => {
          const g = FL().geometria(planoBin(v.n, v.w)), th = v.w < 0 ? 180 : 0;
          let ang = Math.atan2(g.Y(0) - pt.y, pt.x - g.X(0)) * 180 / Math.PI;
          if (ang < 0.5) ang += 360;
          return { n: (th + 360) / ang };
        },
      }],
      lectura: v => [`${v.n} soluciones · módulo ${f(Math.abs(v.w) ** (1 / v.n))} · cada ${f(360 / v.n, 1)}°`],
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Cuántas soluciones tiene ', z, '³ = 8, y dónde están en el plano?'],
      opciones: [
        { id: 'c', texto: 'Tres, a distancia 2 del origen, separadas 120°', correcta: true },
        { id: 'real', texto: ['Una sola: ', z, ' = 2'], error: 'TAL-SOLO-REAL', siFuera: 'z = 2 es la real; hay dos más que no son reales.' },
        { id: 'par', texto: ['Dos: ', z, ' = 2 y ', z, ' = −2'], error: 'TAL-PAR', siFuera: 'Sería así con z² = 4. Aquí (−2)³ = −8, no 8.' },
        { id: 'cruz', texto: 'Tres: 2, 2i y −2', error: 'TAL-ANGULO', siFuera: 'Están a distancia 2, pero (2i)³ = −8i: el ángulo es 120°.' },
      ],
      dibujo: { datos: planoBin(3, 8, false), estado: {} },
      revelar: { datos: planoBin(3, 8, true), estado: {} },
      coincide: 'Coincide: módulo ³√8 = 2 y ángulos 0°, 120° y 240°.',
    },
    mira: {
      datos: planoBin(3, 8, true, { porPaso: true }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Si z tiene módulo r, z³ tiene módulo r³. Como r³ = 8, r = 2.', ecuacion: ['r³ = 8  ⇒  r = 2'] },
        { estado: { paso: 1 }, texto: 'El ángulo se triplica: 3θ debe dar una vuelta entera.', ecuacion: ['3θ = 0° + 360° · k'] },
        { estado: { paso: 2 }, texto: 'Con k = 0, 1, 2 salen tres ángulos distintos.', ecuacion: ['θ = 0°, 120°, 240°'] },
        { estado: { paso: 3 }, texto: 'Con k = 3 se repite 360° = 0°: no hay más.', ecuacion: [z, ' = 2,  −1 + √3 i,  −1 − √3 i'] },
      ],
    },
    regla: {
      texto: 'zⁿ = w, con w ≠ 0, tiene n soluciones: todas con módulo ⁿ√|w|, separadas 360°/n. Son los vértices de un polígono regular centrado en el origen.',
      ecuacion: [{ llave: [{ sub: ['θ', 'k'] }], nota: 'ángulo de zₖ', color: 'c-d' }, ' = ', { frac: ['θ + 360° · k', 'n'] }],
      condicion: 'w ≠ 0; θ es el ángulo de w y k = 0, 1, …, n − 1. Solo una o dos soluciones pueden ser reales.',
    },
    // Así se resuelve (fase 2): las tres preguntas de «Ahora tú» según la semilla (ángulo entre vecinas, módulo o
    // cuántas son reales), con otras semillas; raicesBin() y planoBin() hacen las cuentas y el dibujo.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(3, 6), m = s % 4 === 2 ? r.ent(2, 3) : r.ent(1, 3), w = (s % 2 ? -1 : 1) * m ** n, pide = s % 4;
        const raices = raicesBin(n, w), th = w < 0 ? 180 : 0, ang = 360 / n;
        const reales = raices.filter(q => Math.abs(q.p[1]) < 1e-9);
        const ec = [z, `${SUP[n]} = ${f(w)}`];
        const PREG = [
          ['Las soluciones de ', ...ec, ' forman un polígono regular. ¿Cuántos grados separan a dos soluciones vecinas?'],
          ['¿A qué distancia del origen están las soluciones de ', ...ec, '?'],
          ['¿Cuántas de las soluciones de ', ...ec, ' son números reales?'],
        ];
        const cual = pide === 2 ? 1 : pide === 3 ? 2 : 0;
        const cuentas = [
          { tipo: 'cuentas', texto: `Son ${n} soluciones repartidas en una vuelta completa, de 360°.`, ecuacion: [`360° ÷ ${n} = ${f(ang, 1)}°`], dibujo: { datos: planoBin(n, w), estado: {} } },
          { tipo: 'cuentas', texto: `El módulo de z es la raíz ${{ 3: 'cúbica', 4: 'cuarta', 5: 'quinta', 6: 'sexta' }[n]} de |w| = ${f(Math.abs(w))}.`, ecuacion: [`${SUP[n]}√${f(Math.abs(w))} = ${f(m)}`], dibujo: { datos: planoBin(n, w), estado: {} } },
          { tipo: 'cuentas', texto: `El ángulo de w es ${th}°. Calculo los ${n} ángulos y busco los que valen 0° o 180°.`,
            ecuacion: [`θ = ${raices.map(q => `${f(q.g, 0)}°`).join(', ')}`], dibujo: { datos: planoBin(n, w), estado: {} } },
        ][cual];
        const sentido = [
          { tipo: 'sentido', texto: `Comprueba: ${n} vecinas separadas ${f(ang, 1)}° completan la vuelta.`, ecuacion: [`${n} · ${f(ang, 1)}° = ${f(n * ang, 0)}°`] },
          { tipo: 'sentido', texto: `Comprueba: si z mide ${f(m)}, z${SUP[n]} mide ${f(m)}${SUP[n]}, que es |w|.`, ecuacion: [`${f(m)}${SUP[n]} = ${f(m ** n)}`] },
          { tipo: 'sentido', texto: reales.length ? `Comprueba: ${reales.map(q => f(q.p[0])).join(' y ')} ${reales.length === 1 ? 'cae' : 'caen'} sobre el eje horizontal, y elevado a ${n} da ${f(w)}.` : 'Comprueba: ningún ángulo es 0° ni 180°, así que ninguna flecha cae sobre el eje horizontal.',
            ecuacion: reales.length ? [`(${f(reales[0].p[0])})${SUP[n]} = ${f(reales[0].p[0] ** n)}`] : undefined },
        ][cual];
        return {
          enunciado: PREG[cual],
          dibujo: { datos: planoBin(n, w, false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', ['el ángulo entre dos soluciones vecinas', 'el módulo de las soluciones', 'cuántas soluciones son reales'][cual], '.'] },
            { tipo: 'datos', texto: `Exponente n = ${n} y w = ${f(w)}, cuyo módulo es ${f(Math.abs(w))} y cuyo ángulo es ${th}°.` },
            { tipo: 'regla', texto: `zⁿ = w tiene n soluciones, todas con el mismo módulo, ⁿ√|w|, y repartidas en partes iguales de la vuelta: cada 360°/n.` },
            cuentas,
            sentido,
          ],
          respuesta: [`${f(ang, 1)}°`, `A distancia ${f(m)} del origen`, reales.length ? `${reales.length} ${reales.length === 1 ? 'es real' : 'son reales'}` : 'Ninguna es real'][cual],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(3, 6), m = s % 4 === 2 ? r.ent(2, 3) : r.ent(1, 3), w = (s % 2 ? -1 : 1) * m ** n, pide = s % 4;
        const raices = raicesBin(n, w);
        if (pide === 0 || pide === 1) return {
          pregunta: ['Las soluciones de ', z, `${SUP[n]} = ${f(w)} forman un polígono regular. ¿Cuántos grados separan a dos soluciones vecinas?`],
          opciones: distintas([
            { id: 'c', texto: `${f(360 / n, 1)}°`, correcta: true },
            { id: 'mitad', texto: `${f(180 / n, 1)}°`, error: 'TAL-ANGULO', siFuera: 'Una vuelta completa son 360°, no 180°.' },
            { id: 'w', texto: `${f(360 / Math.abs(w), 1)}°`, error: 'TAL-ANGULO', siFuera: 'El ángulo depende del exponente n, no de w.' },
            { id: 'noventa', texto: '90°', error: 'TAL-ANGULO', siFuera: `90° serían 4 soluciones; aquí son ${n}.` },
          ]),
          solucion: { texto: `Son ${n} soluciones repartidas en 360°.`, ecuacion: [`360° ÷ ${n} = ${f(360 / n, 1)}°`], dibujo: { datos: planoBin(n, w), estado: {} } },
        };
        if (pide === 2) return {
          pregunta: ['¿A qué distancia del origen están las soluciones de ', z, `${SUP[n]} = ${f(w)}?`],
          opciones: distintas([
            { id: 'c', texto: f(m), correcta: true },
            { id: 'w', texto: f(Math.abs(w)), error: 'TAL-MODULO', siFuera: 'Ese es el módulo de w; el de z es su raíz n-ésima.' },
            { id: 'div', texto: fr(Math.abs(w), n), error: 'TAL-MODULO', siFuera: 'El módulo se saca con raíz, no dividiendo entre n.' },
            { id: 'uno', texto: '1', error: 'TAL-MODULO', siFuera: 'Solo vale 1 si |w| = 1.' },
          ]),
          solucion: { texto: `El módulo de z es la raíz ${n}-ésima de |w|.`, ecuacion: [`${SUP[n]}√${f(Math.abs(w))} = ${f(m)}`], dibujo: { datos: planoBin(n, w), estado: {} } },
        };
        const reales = raices.filter(q => Math.abs(q.p[1]) < 1e-9).length;
        return {
          pregunta: ['¿Cuántas de las soluciones de ', z, `${SUP[n]} = ${f(w)} son números reales?`],
          opciones: distintas([
            { id: 'c', texto: f(reales), correcta: true },
            { id: 'todas', texto: f(n), error: 'TAL-SOLO-REAL', siFuera: 'Solo son reales las que caen sobre el eje horizontal.' },
            { id: 'una', texto: f(reales === 1 ? 2 : 1), error: 'TAL-PAR', siFuera: 'Mira qué ángulos θₖ son 0° o 180°.' },
            { id: 'cero', texto: f(reales === 0 ? 2 : 0), error: 'TAL-PAR', siFuera: 'Cuenta las flechas sobre el eje real.' },
          ]),
          solucion: { texto: `Son reales las de ángulo 0° o 180°: ${reales}.`, ecuacion: [`θ = ${raices.map(q => `${f(q.g, 0)}°`).join(', ')}`], dibujo: { datos: planoBin(n, w), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: la cúbica con sus tres raíces y el coeficiente principal a libres. Más rica que la idea 2: con a = 2 o
  // a = −1 los coeficientes cambian y las cuentas de las raíces no; la lectura las da como −b/a, c/a y −d/a.
  const cubicaLibre = v => graficaRaices([v.r1, v.r2, v.r3], v.a);
  // Mesa 2: grado 3, 4 o 5 que sube y baja. Raíces reales contadas con su repetición: los cambios de signo en una
  // malla fina (que no pasa por los puntos de tangencia) dan las simples; un mínimo o máximo que toca el eje, una doble.
  const FAMILIAS = { 3: [1, 0, -3, 0], 4: [1, 0, -4, 0, 0], 5: [1, 0, -5, 0, 4, 0] };
  const conC = (g, c) => { const k = FAMILIAS[g].slice(); k[k.length - 1] += c; return k; };
  function realesConRepeticion(coefs) {
    const p = v => valor(coefs, v), n = coefs.length - 1;
    const d = coefs.slice(0, -1).map((a, i) => a * (n - i)), dp = v => valor(d, v);
    let cuenta = 0;
    const N = 4000, a0 = -3.0001, h = 6 / N;
    for (let i = 0; i < N; i++) { const xa = a0 + i * h, xb = xa + h; if ((p(xa) < 0) !== (p(xb) < 0)) cuenta++; if ((dp(xa) < 0) !== (dp(xb) < 0)) { const xc = biseccion(dp, xa, xb); if (Math.abs(p(xc)) < 1e-6) cuenta += 2; } }
    return cuenta;
  }
  const subeBaja = v => {
    const k = conC(v.g, v.c);
    return { datos: Object.assign({}, EJES1, { curvas: [{ puntos: curva(xx => valor(k, xx), -3, 3, -8, 8), color: 'i', rotulo: poliTxt(k), en: [-2.95, 7.5] }], alt: `Gráfica de ${poliTxt(k)}` }), estado: {} };
  };
  // Mesa 3: zⁿ = w con w libre en el plano (largo y ángulo), no solo 1, −1 o 16 como en la idea 6.
  const L3 = 1.6;   // ventana fija: |w| hasta 1,5 y raíces de módulo hasta √1,5 ≈ 1,22
  const binLibre = v => {
    const m = v.rw ** (1 / v.n), R = Array.from({ length: v.n }, (_, k) => { const g = (v.tw + 360 * k) / v.n * Math.PI / 180; return [m * Math.cos(g), m * Math.sin(g)]; });
    return { datos: {
      guias: [{ de: [-L3, 0], a: [L3, 0] }, { de: [0, -L3], a: [0, L3] }],
      contorno: v.n > 2 ? R : undefined,
      flechas: [{ de: [0, 0], a: [v.rw * Math.cos(v.tw * Math.PI / 180), v.rw * Math.sin(v.tw * Math.PI / 180)], color: 'h', rotulo: 'w', discontinua: true }, ...R.map(q => ({ de: [0, 0], a: q, color: 'd' }))],
    }, estado: {} };
  };
  const ANG = (pt, g, corte) => { let a = Math.atan2(g.Y(0) - pt.y, pt.x - g.X(0)) * 180 / Math.PI; if (a < corte) a += 360; return a; };
  const raicesW = v => binLibre(v).datos.flechas.slice(1).map(fl => fl.a);
  // Cambios de signo de un polinomio en [−3, 3], con la misma malla que realesConRepeticion (cuenta los cruces, no los toques).
  const cambiosDeSigno = coefs => { let n = 0; for (let i = 0; i < 4000; i++) { const xa = -3.0001 + i * 6 / 4000; if ((valor(coefs, xa) < 0) !== (valor(coefs, xa + 6 / 4000) < 0)) n++; } return n; };
  // El mayor término independiente de la cúbica libre (raíces de −3 a 3, a = 1, 2 o −1): se calcula, no se escribe.
  const MAX_D = (() => { let m = -Infinity; const R = [-3, -2, -1, 0, 1, 2, 3]; for (const a of [1, 2, -1]) for (const p of R) for (const q of R) for (const r of R) m = Math.max(m, desdeRaices([p, q, r], a)[3]); return m; })();
  const laboratorio = [
    {
      id: 'cubica-libre', titulo: 'Cúbica con raíces y a libres', pieza: 'ejes',
      consigna: 'Arrastra las tres raíces y elige a. Sobre la curva va el polinomio; abajo, la suma, los productos de a dos y el producto.',
      controles: [
        { id: 'r1', etiqueta: 'r₁', color: 'c-d', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0 },
        { id: 'r2', etiqueta: 'r₂', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r3', etiqueta: 'r₃', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 3, decimales: 0 },
        { id: 'a', etiqueta: 'a', opciones: [{ valor: 1, texto: '1' }, { valor: 2, texto: '2' }, { valor: -1, texto: '−1' }] },
      ],
      dibujo: v => ({ datos: cubicaLibre(v), estado: {} }),
      lectura: v => { const c = desdeRaices([v.r1, v.r2, v.r3], v.a); return [{ frac: ['−b', 'a'] }, ` = ${f(-c[1] / v.a)}`, '   ·   ', { frac: ['c', 'a'] }, ` = ${f(c[2] / v.a)}`, '   ·   ', { frac: ['−d', 'a'] }, ` = ${f(-c[3] / v.a)}`]; },
      arrastres: manijasRaices(cubicaLibre),
      // Retos comprobados (docs/teoria.md §4d): leen los coeficientes de desdeRaices(), los mismos que dibujan la curva.
      invitaciones: [
        { texto: 'Haz que la suma de las raíces sea 0.',
          logrado: v => -desdeRaices([v.r1, v.r2, v.r3], v.a)[1] / v.a === 0,
          bien: 'Suma cero: el polinomio queda sin término en x².' },
        { texto: 'Consigue que el producto de las raíces sea 6.',
          logrado: v => -desdeRaices([v.r1, v.r2, v.r3], v.a)[3] / v.a === 6,
          bien: '−d/a = 6, elijas el a que elijas: el producto lo deciden las raíces.' },
        { texto: 'Busca el mayor término independiente d de la mesa.',
          logrado: v => desdeRaices([v.r1, v.r2, v.r3], v.a)[3] === MAX_D,
          bien: 'a = 2 y tres raíces en −3: d = −2 · (−27) = 54.' },
        { texto: 'Guarda dos casos con la misma suma de raíces y distinto producto.',
          logrado: (v, guardados) => {
            const sp = w => { const c = desdeRaices([w.r1, w.r2, w.r3], w.a); return [-c[1] / w.a, -c[3] / w.a]; }, [s0, p0] = sp(v);
            return guardados.some(g => sp(g)[0] === s0 && sp(g)[1] !== p0) && guardados.some(g => ['r1', 'r2', 'r3', 'a'].every(k => g[k] === v[k]));
          },
          bien: 'Misma −b/a, distinto −d/a: la suma sola no decide el polinomio.' },
      ],
    },
    {
      id: 'sube-baja', titulo: 'Tres grados que suben y bajan', pieza: 'ejes',
      consigna: 'Elige el grado y arrastra el corte con el eje y. Cuenta los cortes: una curva que solo toca el eje da una raíz doble.',
      controles: [
        { id: 'g', etiqueta: 'Grado', opciones: [{ valor: 3, texto: '3' }, { valor: 4, texto: '4' }, { valor: 5, texto: '5' }] },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -6, max: 6, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: subeBaja,
      lectura: v => { const m = realesConRepeticion(conC(v.g, v.c)); return [`Grado ${v.g}: ${m} ${m === 1 ? 'real' : 'reales'} y ${v.g - m} no ${v.g - m === 1 ? 'real' : 'reales'}`]; },
      arrastres: [{
        id: 'corte-y', etiqueta: 'corte con el eje y: sube o baja la curva', color: 'c-h',
        donde: v => { const g = EJES().geometria(EJES1); return { x: g.X(0), y: g.Y(valor(conC(v.g, v.c), 0)) }; },
        mover: pt => ({ c: inversa(EJES().geometria(EJES1).Y, -8, 8)(pt.y) }),
      }],
      invitaciones: [
        { texto: 'Con grado 4, haz que no haya ninguna raíz real.',
          logrado: v => v.g === 4 && realesConRepeticion(conC(v.g, v.c)) === 0,
          bien: 'Las cuatro raíces son complejas, en dos pares conjugados.' },
        { texto: 'Con grado 3, busca un c donde la curva solo toque el eje en un punto.',
          logrado: v => v.g === 3 && realesConRepeticion(conC(v.g, v.c)) > cambiosDeSigno(conC(v.g, v.c)),
          bien: 'Ahí hay una raíz doble: toca sin cruzar y cuenta dos veces.' },
        { texto: 'Con grado 5, consigue las cinco raíces reales.',
          logrado: v => v.g === 5 && realesConRepeticion(conC(v.g, v.c)) === 5,
          bien: 'Cinco cortes para grado 5: ninguna compleja.' },
        { texto: 'Guarda dos casos del mismo grado con distinto número de raíces reales.',
          logrado: (v, guardados) => guardados.some(g => g.g === v.g && realesConRepeticion(conC(g.g, g.c)) !== realesConRepeticion(conC(v.g, v.c)))
            && guardados.some(g => g.g === v.g && g.c === v.c),
          bien: 'El total sigue siendo el grado: las que faltan son complejas.' },
      ],
    },
    {
      id: 'w-libre', titulo: 'zⁿ = w con w libre', pieza: 'flechas',
      consigna: 'Arrastra la punta de w (punteada) y la segunda raíz. Las raíces siguen a w: su ángulo se divide entre n.',
      controles: [
        { id: 'rw', etiqueta: '|w|', min: 0.5, max: 1.5, paso: 0.25, inicio: 1.5, decimales: 2, color: 'c-h' },
        { id: 'tw', etiqueta: 'ángulo de w', min: 0, max: 345, paso: 15, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
      ],
      dibujo: binLibre,
      lectura: v => [`|w| = ${f(v.rw)}, ${v.tw}°: ${v.n} raíces de módulo ${f(v.rw ** (1 / v.n))}, cada ${f(360 / v.n, 1)}°`],
      arrastres: [
        { id: 'punta-w', etiqueta: 'punta de w: largo y ángulo', color: 'c-h',
          donde: v => { const g = FL().geometria(binLibre(v).datos), a = v.tw * Math.PI / 180; return { x: g.X(v.rw * Math.cos(a)), y: g.Y(v.rw * Math.sin(a)) }; },
          mover: (pt, v) => { const g = FL().geometria(binLibre(v).datos); return { rw: Math.hypot(pt.x - g.X(0), pt.y - g.Y(0)) / g.s, tw: ANG(pt, g, -7.5) }; } },
        { id: 'raiz-vecina', etiqueta: 'segunda raíz: acércala a la primera', color: 'c-d',
          donde: v => { const g = FL().geometria(binLibre(v).datos), q = binLibre(v).datos.flechas[2].a; return { x: g.X(q[0]), y: g.Y(q[1]) }; },
          mover: (pt, v) => ({ n: (v.tw + 360) / ANG(pt, FL().geometria(binLibre(v).datos), 0.5) }) },
      ],
      invitaciones: [
        { texto: 'Haz que una raíz caiga sobre el eje x, a la derecha del origen.',
          logrado: v => raicesW(v).some(q => Math.abs(q[1]) < 1e-9 && q[0] > 0),
          bien: 'Esa raíz es real y positiva: su ángulo es 0°.' },
        { texto: 'Consigue que todas las raíces tengan módulo 1.',
          logrado: v => Math.abs(v.rw ** (1 / v.n) - 1) < 1e-9,
          bien: 'Si |w| = 1, todas quedan en la circunferencia de radio 1.' },
        { texto: 'Forma un hexágono con un vértice en 1.',
          logrado: v => v.n === 6 && raicesW(v).some(q => Math.abs(q[0] - 1) < 1e-9 && Math.abs(q[1]) < 1e-9),
          bien: 'Son las seis raíces de z⁶ = 1, separadas 60°.' },
        { texto: 'Busca las raíces más pegadas al origen.',
          logrado: v => v.rw ** (1 / v.n) === Math.min(...[2, 3, 4, 5, 6].map(n => 0.5 ** (1 / n))),
          bien: 'Con |w| < 1, la raíz cuadrada achica más que la sexta.' },
      ],
    },
  ];

  return {
    unidad: 'algebra.ecuaciones-polinomiales',
    version: '0.2.0',
    laboratorio,
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'teorema fundamental del álgebra', def: 'Un polinomio de grado n ≥ 1 tiene n raíces complejas, contando las repetidas.',
        ejemplo: 'x³ − x tiene 3: −1, 0 y 1.', ver: ['número complejo', 'multiplicidad'] },
      { termino: 'número complejo', formas: ['número complejo', 'números complejos', 'complejo', 'complejos', 'compleja', 'complejas'],
        def: 'Número de la forma a + bi, con i² = −1. Los reales son los que tienen b = 0.',
        ejemplo: 'x² + 4 = 0 tiene raíces 2i y −2i.' },
      { termino: 'coeficiente principal', def: 'El número que multiplica a la potencia más alta de un polinomio.', ejemplo: 'En 2x³ − x + 5, es 2.' },
      { termino: 'raíz racional', formas: ['raíz racional', 'raíces racionales'], def: 'Raíz que se escribe como fracción p/q de enteros.',
        ejemplo: '2x² − x − 1 = 0 tiene la raíz −1/2.', ver: ['coeficiente principal', 'término independiente'] },
      { termino: 'cambio de variable', def: 'Llamar con una letra nueva a una expresión repetida para obtener una ecuación más simple.',
        ejemplo: 'En x⁴ − 5x² + 4 = 0, u = x² da u² − 5u + 4 = 0.' },
      { termino: 'ecuación bicuadrada', formas: ['ecuación bicuadrada', 'ecuaciones bicuadradas', 'bicuadrada', 'bicuadradas'],
        def: 'Ecuación de la forma ax⁴ + bx² + c = 0: solo tiene potencias pares.', ver: ['cambio de variable'] },
      { termino: 'ecuación recíproca', formas: ['ecuación recíproca', 'ecuaciones recíprocas'],
        def: 'Ecuación cuyos coeficientes se leen igual de izquierda a derecha que al revés.', ejemplo: 'x⁴ − 5x³ + 8x² − 5x + 1 = 0.' },
      { termino: 'ecuación binómica', formas: ['ecuación binómica', 'ecuaciones binómicas'],
        def: 'Ecuación de dos términos, zⁿ = w: una potencia de la incógnita igualada a un número.', ejemplo: 'z³ = 8 tiene tres soluciones.', ver: ['raíz n-ésima', 'módulo'] },
    ],
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/flechas.js'],
    historia: {
      texto: 'Buscar soluciones de ecuaciones llevó a preguntar si los números conocidos alcanzaban. Al aceptar poco a poco los números complejos, se pudo afirmar que un polinomio tiene tantas raíces como su grado, contando repeticiones. Ese teorema tuvo propuestas, errores y demostraciones corregidas; no fue un descubrimiento de un solo día. Aquí se distingue hallar raíces concretas de saber cuántas hay.',
      pregunta: '¿Dónde están las raíces que la gráfica no muestra?',
      fuente: { titulo: 'O’Connor y Robertson, The fundamental theorem of algebra — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Fund_theorem_of_algebra/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cubica-libre': ['viete'],
      'sube-baja': ['grado-raices'],
      'w-libre': ['binomica'],
    },
    ideas: [tfa, vieta, racionales, conjugadas, cambio, binomica],
  };
});
