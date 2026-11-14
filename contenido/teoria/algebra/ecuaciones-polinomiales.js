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
      texto: 'Un polinomio de grado n ≥ 1 tiene exactamente n raíces complejas, si cada una se cuenta tantas veces como se repite. La gráfica solo muestra las reales.',
      ecuacion: ['P(', z, ') = a', { llave: ['(', z, ' − ', { sub: ['r', '1'] }, ')(', z, ' − ', { sub: ['r', '2'] }, ')…(', z, ' − ', { sub: ['r', 'n'] }, ')'], nota: 'n factores', color: 'c-d' }],
      condicion: 'grado n ≥ 1 y coeficiente principal a ≠ 0; una raíz doble cuenta dos veces.',
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
          solucion: { texto: `Las reales son ${a} y −${bq}; x² + ${cc} solo da raíces no reales.`, ecuacion: [x, ` = ${a}   ·   `, x, ` = −${bq}`] },
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
      lectura: v => { const V = vieteFila([v.r1, v.r2, v.r3]); return [`suma ${f(V.S1)}   ·   de a dos ${f(V.S2)}   ·   producto ${f(V.S3)}`]; },
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
        { estado: { corte: 4 }, texto: 'c suma los productos de a dos; −d es el producto.', ecuacion: ['2 + 3 + 6 = 11   ·   1 · 2 · 3 = 6'] },
        { estado: { corte: 5 }, texto: 'Si todo se multiplica por 2, las raíces no cambian: se divide entre a.', ecuacion: [{ frac: ['12', '2'] }, ' = 6   ·   ', { frac: ['22', '2'] }, ' = 11'] },
      ],
    },
    regla: {
      texto: 'En ax³ + bx² + cx + d = 0, la suma de las raíces es −b/a, la de sus productos de a dos, c/a, y su producto, −d/a.',
      ecuacion: [{ llave: [{ sub: ['r', '1'] }, ' + ', { sub: ['r', '2'] }, ' + ', { sub: ['r', '3'] }], nota: 'suma de raíces', color: 'c-d' }, ' = ', { frac: ['−b', 'a'] }],
      condicion: 'primero se divide entre a; un término que falta tiene coeficiente 0. Los signos alternan: −, +, −.',
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
        { estado: { corte: 1 }, texto: 'p divide al término independiente 2; q, al coeficiente principal 2.', ecuacion: ['p ∈ {1, 2}   ·   q ∈ {1, 2}'] },
        { estado: { corte: 2 }, texto: 'Se prueban las enteras: −1 y 2 dan cero.', ecuacion: ['P(−1) = 0   ·   P(2) = 0'] },
        { estado: { corte: 3 }, texto: 'Se prueban las fracciones: 1/2 también da cero.', ecuacion: ['P(1/2) = 2/8 − 3/4 − 3/2 + 2 = 0'] },
        { estado: { corte: 3 }, texto: 'Tres raíces para un polinomio de grado 3: no hay más.', ecuacion: ['P(', x, ') = (', x, ' + 1)(', x, ' − 2)(2', x, ' − 1)'] },
      ],
    },
    regla: {
      texto: 'Si p/q, reducida, es raíz de un polinomio de coeficientes enteros, p divide al término independiente y q divide al coeficiente principal.',
      ecuacion: [{ frac: ['p', 'q'] }, ':  p | ', { llave: [{ sub: ['a', '0'] }], nota: 'el independiente' }, '   ·   q | ', { llave: [{ sub: ['a', 'n'] }], nota: 'el principal' }],
      condicion: 'coeficientes enteros. La lista da candidatas, no raíces: cada una se comprueba en el polinomio.',
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
          solucion: { texto: `p debe dividir a ${f(Math.abs(a0))} y q a ${f(an)}; ${fr(...imposible)} no cumple.`, ecuacion: [`p | ${f(Math.abs(a0))}   ·   q | ${f(an)}`] },
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
        { estado: { corte: 2 }, texto: 'Junto con su conjugado, la suma y el producto salen reales.', ecuacion: ['suma 4   ·   producto 4 + 9 = 13'] },
        { estado: { corte: 3 }, texto: 'Por eso el factor de grado 2 tiene coeficientes reales.', ecuacion: [x, '² − 4', x, ' + 13'] },
        { estado: { corte: 4 }, texto: 'Con coeficientes racionales pasa igual con raíces como 1 + √2.', ecuacion: ['(1 + √2) + (1 − √2) = 2   ·   producto −1'] },
        { estado: { corte: 4 }, texto: 'Ese factor es x² − 2x − 1: coeficientes racionales.', ecuacion: [x, '² − 2', x, ' − 1'] },
      ],
    },
    regla: {
      texto: 'Con coeficientes reales, si a + bi es raíz también lo es a − bi. Con coeficientes racionales, si a + b√d es raíz, también a − b√d.',
      ecuacion: ['a + bi  →  ', { llave: ['a − bi'], nota: 'su conjugada', color: 'c-d' }],
      condicion: 'las hipótesis importan: √d irracional y a, b, d racionales. Con coeficientes irracionales, la pareja no está garantizada.',
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
        { estado: { corte: 2 }, texto: 'La cuadrática en u da dos valores.', ecuacion: [u, ' = 1   ·   ', u, ' = 4'] },
        { estado: { corte: 3 }, texto: 'Cada u positiva da dos x: ±√u.', ecuacion: [x, ' = ±1   ·   ', x, ' = ±2'] },
        { estado: { corte: 4 }, texto: 'Recíproca: x⁴ − 5x³ + 8x² − 5x + 1 = 0. Coeficientes simétricos.', ecuacion: ['1, −5, 8, −5, 1'] },
        { estado: { corte: 5 }, texto: 'x = 0 no es raíz: se divide entre x² con t = x + 1/x.', ecuacion: [t, '² − 5', t, ' + 6 = 0  ⇒  ', t, ' = 2  o  ', t, ' = 3'] },
        { estado: { corte: 6 }, texto: 't = 2 da x = 1 (doble); t = 3 da dos raíces más.', ecuacion: [x, ' = 1 (doble)   ·   ', x, ' = ', { frac: ['3 ± √5', '2'] }] },
      ],
    },
    regla: {
      texto: 'Con solo x⁴ y x², u = x² da una cuadrática; cada u > 0 da x = ±√u. Con coeficientes simétricos, se divide entre x² y se usa t = x + 1/x.',
      ecuacion: [x, '² + ', { frac: ['1', [x, '²']] }, ' = ', { llave: [t], nota: 'x + 1/x', color: 'c-i' }, '² − 2'],
      condicion: 'u < 0 no da x reales; u = 0 da x = 0. En la recíproca se divide porque x = 0 no es raíz.',
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
      lectura: v => { const c = desdeRaices([v.r1, v.r2, v.r3], v.a); return [{ frac: ['−b', 'a'] }, ` = ${f(-c[1] / v.a)}   ·   `, { frac: ['c', 'a'] }, ` = ${f(c[2] / v.a)}   ·   `, { frac: ['−d', 'a'] }, ` = ${f(-c[3] / v.a)}`]; },
      arrastres: manijasRaices(cubicaLibre),
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
    },
  ];

  return {
    unidad: 'algebra.ecuaciones-polinomiales',
    version: '0.2.0',
    laboratorio,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/flechas.js'],
    historia: {
      texto: 'Buscar soluciones de ecuaciones llevó a preguntar si los números conocidos alcanzaban. Al aceptar poco a poco los números complejos, se pudo afirmar que un polinomio tiene tantas raíces como su grado, contando repeticiones. Ese teorema tuvo propuestas, errores y demostraciones corregidas; no fue un descubrimiento de un solo día. Aquí se distingue hallar raíces concretas de saber cuántas hay.',
      pregunta: '¿Dónde están las raíces que la gráfica no muestra?',
      fuente: { titulo: 'O’Connor y Robertson, The fundamental theorem of algebra — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Fund_theorem_of_algebra/' },
    },
    ideas: [tfa, vieta, racionales, conjugadas, cambio, binomica],
  };
});
