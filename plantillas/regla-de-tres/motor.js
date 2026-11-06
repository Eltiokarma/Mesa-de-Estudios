/*
 * Motor de «El taller y la pared»: razones, proporciones, magnitudes proporcionales, regla de tres y reparto.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorTres) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 *   razon(a, b)                                   razón aritmética (a − b) y geométrica (a/b)
 *   cuartaProporcional(a, b, c)                   a/b = c/x → x = b·c/a
 *   mediaProporcional(a, c)                       a/b = b/c → b = √(a·c) (proporción continua)
 *   terceraProporcional(a, b)                     a/b = b/x → x = b²/a
 *   serieRazones({ consecuentes, k | sumaAntecedentes | productoAntecedentes })
 *                                                 a₁/b₁ = a₂/b₂ = … = k; (a₁ + a₂ + …)/(b₁ + b₂ + …) = k
 *   relacion(tabla)                               [[x, y], …] → 'directa' (y/x fijo), 'inversa' (x·y fijo) o 'ninguna'
 *   tabla(tipo, constante, xs)                    filas de una relación directa (y = k·x) o inversa (y = P/x)
 *   curva(tipo, constante, x0, x1, n)             puntos de la gráfica: recta por el origen o hipérbola
 *   reglaDeTres({ tipo, a1, b1, a2 })             regla de tres simple directa o inversa, con sus errores típicos
 *   srAlto({ bajoBotones, bajoClips, altoBotones }) la tira del Sr. Bajo y el Sr. Alto (Karplus)
 *   compuesta({ magnitudes, incognita })          regla de tres compuesta por proporciones y por el método de signos
 *   horasHombre({ obreros, dias, horas, eficiencia, dificultad })   el trabajo: obreros·días·horas·eficiencia/dificultad
 *   trabajo(antes, despues)                       (obreros·días·horas·eficiencia)/(obra·dificultad) constante: despeja el dato que falta
 *   rectangulo(trabajo, obreros)                  el rectángulo obreros × días (su área es el trabajo): filas enteras y la última
 *   reparto({ total, directo, inverso })          reparto proporcional directo, inverso o compuesto
 *   engranajes({ dientes, vueltas1 })             engranajes en fila: z·n se conserva; el sentido se alterna
 *   crecimiento(edad)                             estatura aproximada de una niña (no es proporcional a la edad)
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los
 * errores típicos de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (AR6 a AR10, RM5):
 * son las opciones incorrectas de la escena.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTres = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    return x;
  }
  // Redondea el ruido de coma flotante cerca de un entero (8,999999999 → 9).
  const limpio = x => (Math.abs(x - Math.round(x)) <= TOL * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);
  const igual = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  function lista(xs, que, o) {
    if (!Array.isArray(xs) || !xs.length) throw new Error(`${que} debe ser una lista no vacía`);
    xs.forEach((x, k) => numero(x, `${que}[${k}]`, o));
    return xs;
  }
  // La fracción más simple con denominador hasta maxDen que vale x (o null).
  function fraccion(x, maxDen) {
    numero(x, 'el número'); maxDen = maxDen || 1000;
    for (let q = 1; q <= maxDen; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) <= TOL * Math.max(1, Math.abs(x))) return { num: p + 0, den: q };
    }
    return null;
  }
  const textoFraccion = x => { const f = fraccion(x, 1000); return !f ? null : f.den === 1 ? String(f.num) : `${f.num}/${f.den}`; };

  // ---------- Razones y proporciones ----------
  function razon(a, b) {
    numero(a, 'a'); numero(b, 'b', { positivo: true });
    return { aritmetica: limpio(a - b), geometrica: limpio(a / b), texto: textoFraccion(a / b) };
  }
  // a/b = c/x. Errores: la diferencia que se conserva (AR6), la razón al revés.
  function cuartaProporcional(a, b, c) {
    numero(a, 'a', { positivo: true }); numero(b, 'b', { positivo: true }); numero(c, 'c', { positivo: true });
    return { x: limpio(b * c / a), errores: { aditiva: limpio(b + (c - a)), invertida: limpio(a * c / b) } };
  }
  // a/b = b/c → b = √(a·c). Error: tomar el promedio (a + c)/2 (la media aritmética).
  function mediaProporcional(a, c) {
    numero(a, 'a', { positivo: true }); numero(c, 'c', { positivo: true });
    return { b: limpio(Math.sqrt(a * c)), errores: { promedio: limpio((a + c) / 2) } };
  }
  function terceraProporcional(a, b) {
    numero(a, 'a', { positivo: true }); numero(b, 'b', { positivo: true });
    return { x: limpio(b * b / a) };
  }
  // a₁/b₁ = a₂/b₂ = … = k. Se da k, la suma de los antecedentes o su producto.
  function serieRazones(o) {
    const b = lista(o.consecuentes, 'consecuentes', { positivo: true });
    const dados = ['k', 'sumaAntecedentes', 'productoAntecedentes'].filter(c => o[c] !== undefined);
    if (dados.length !== 1) throw new Error('da exactamente uno: k, sumaAntecedentes o productoAntecedentes');
    let k;
    if (o.k !== undefined) k = numero(o.k, 'k');
    else if (o.sumaAntecedentes !== undefined) k = numero(o.sumaAntecedentes, 'la suma') / b.reduce((s, x) => s + x, 0);
    else {
      const P = numero(o.productoAntecedentes, 'el producto', { positivo: true });
      k = Math.pow(P / b.reduce((s, x) => s * x, 1), 1 / b.length);
    }
    k = limpio(k);
    const a = b.map(x => limpio(k * x));
    return { k, antecedentes: a, consecuentes: b.slice(), sumaA: limpio(a.reduce((s, x) => s + x, 0)), sumaB: b.reduce((s, x) => s + x, 0),
      razonDeSumas: limpio(a.reduce((s, x) => s + x, 0) / b.reduce((s, x) => s + x, 0)) };
  }

  // ---------- Magnitudes proporcionales ----------
  // La prueba: si y/x es siempre el mismo, son directamente proporcionales; si x·y es siempre el mismo, inversamente.
  function relacion(tabla) {
    if (!Array.isArray(tabla) || tabla.length < 2) throw new Error('la tabla necesita al menos dos filas');
    tabla.forEach((f, j) => { if (!Array.isArray(f) || f.length !== 2) throw new Error(`fila ${j}: debe ser [x, y]`); numero(f[0], `x de la fila ${j}`, { positivo: true }); numero(f[1], `y de la fila ${j}`, { positivo: true }); });
    const cocientes = tabla.map(([x, y]) => limpio(y / x)), productos = tabla.map(([x, y]) => limpio(x * y));
    const diferencias = tabla.map(([x, y]) => limpio(y - x));
    const todos = v => v.every(z => igual(z, v[0]));
    const tipo = todos(cocientes) ? 'directa' : todos(productos) ? 'inversa' : 'ninguna';
    return { tipo, cocientes, productos, diferencias, k: tipo === 'directa' ? cocientes[0] : null, producto: tipo === 'inversa' ? productos[0] : null,
      diferenciaFija: todos(diferencias) };
  }
  function tabla(tipo, c, xs) {
    numero(c, 'la constante', { positivo: true }); lista(xs, 'xs', { positivo: true });
    if (tipo !== 'directa' && tipo !== 'inversa') throw new Error("tipo debe ser 'directa' o 'inversa'");
    return xs.map(x => [x, limpio(tipo === 'directa' ? c * x : c / x)]);
  }
  // Puntos para dibujar: la directa es una recta que pasa por el origen; la inversa, una rama de hipérbola.
  function curva(tipo, c, x0, x1, n) {
    numero(c, 'la constante', { positivo: true }); numero(x0, 'x0'); numero(x1, 'x1'); n = n || 60;
    if (tipo === 'inversa' && !(x0 > 0)) throw new Error('la hipérbola no toca x = 0: x0 debe ser mayor que cero');
    if (tipo !== 'directa' && tipo !== 'inversa') throw new Error("tipo debe ser 'directa' o 'inversa'");
    const pts = [];
    for (let j = 0; j <= n; j++) { const x = x0 + (x1 - x0) * j / n; pts.push({ x, y: tipo === 'directa' ? c * x : c / x }); }
    return pts;
  }

  // ---------- Regla de tres simple ----------
  // a1 → b1, a2 → ¿b2? Directa: b2 = b1·a2/a1. Inversa: b2 = b1·a1/a2.
  function reglaDeTres(o) {
    const { tipo } = o, a1 = numero(o.a1, 'a1', { positivo: true }), b1 = numero(o.b1, 'b1', { positivo: true }), a2 = numero(o.a2, 'a2', { positivo: true });
    if (tipo !== 'directa' && tipo !== 'inversa') throw new Error("tipo debe ser 'directa' o 'inversa'");
    const directa = limpio(b1 * a2 / a1), inversa = limpio(b1 * a1 / a2);
    const b2 = tipo === 'directa' ? directa : inversa;
    const r = { tipo, b2, constante: tipo === 'directa' ? limpio(b1 / a1) : limpio(a1 * b1) };
    r.errores = tipo === 'directa'
      ? { comoInversa: inversa, aditiva: limpio(b1 + (a2 - a1)) }
      // inversa: multiplicar en cruz como si fuera directa (AR8); restar tanto como aumentó la otra (AR6); que no cambie
      : { comoDirecta: directa, aditiva: limpio(b1 - (a2 - a1)), aditivaSuma: limpio(b1 + (a2 - a1)), sinCambio: b1 };
    return r;
  }
  // La tira de Karplus: el Sr. Bajo mide bajoBotones botones o bajoClips clips; el Sr. Alto, altoBotones botones.
  function srAlto(o) {
    const bb = numero(o.bajoBotones, 'bajoBotones', { positivo: true }), bc = numero(o.bajoClips, 'bajoClips', { positivo: true });
    const ab = numero(o.altoBotones, 'altoBotones', { positivo: true });
    const k = limpio(bc / bb);
    return { clips: limpio(k * ab), k, kTexto: textoFraccion(k), diferencia: limpio(bc - bb),
      errores: { aditiva: limpio(ab + (bc - bb)), invierteRazon: limpio(ab * bb / bc), doble: limpio(2 * ab) } };
  }

  // ---------- Regla de tres compuesta ----------
  // magnitudes: [{ nombre, antes, despues, relacion: 'directa'|'inversa' }] (relación con la incógnita);
  // incognita: { nombre, antes }. Por proporciones: x = antes · Π(factor), con factor despues/antes si es directa y
  // antes/despues si es inversa. Cada factor va como fracción { arriba, abajo }: «arriba» va al numerador.
  // Método de signos: arriba el caso conocido y abajo el que se pregunta, con la x debajo de su valor conocido, que
  // lleva +. Cada magnitud se compara con la incógnita: si es inversa, lleva + arriba (antes) y − abajo (despues); si
  // es directa, al revés. x = producto de los + / producto de los −. 'signos' devuelve el signo de cada fila.
  function compuesta(o) {
    if (!o || !Array.isArray(o.magnitudes) || !o.magnitudes.length) throw new Error('faltan las magnitudes');
    if (!o.incognita) throw new Error('falta la incógnita');
    const x0 = numero(o.incognita.antes, 'el valor conocido de la incógnita', { positivo: true });
    const ms = o.magnitudes.map((m, j) => {
      if (m.relacion !== 'directa' && m.relacion !== 'inversa') throw new Error(`magnitud ${m.nombre || j}: relacion debe ser 'directa' o 'inversa'`);
      numero(m.antes, `${m.nombre || j} antes`, { positivo: true }); numero(m.despues, `${m.nombre || j} después`, { positivo: true });
      const f = m.relacion === 'directa' ? { arriba: m.despues, abajo: m.antes } : { arriba: m.antes, abajo: m.despues };
      return Object.assign({ nombre: m.nombre || `m${j}`, relacion: m.relacion, antes: m.antes, despues: m.despues, factor: f.arriba / f.abajo }, f);
    });
    const prod = arr => arr.reduce((s, m) => s * m.factor, 1);
    const valor = limpio(x0 * prod(ms));
    const flip = m => ({ factor: 1 / m.factor });
    const errores = { todoDirecta: limpio(x0 * ms.reduce((s, m) => s * (m.despues / m.antes), 1)) };
    ms.forEach((m, j) => {
      errores['olvida-' + m.nombre] = limpio(x0 * prod(ms.filter((_, i) => i !== j)));
      errores['invierte-' + m.nombre] = limpio(x0 * prod(ms.map((q, i) => (i === j ? flip(q) : q))));
    });
    return { valor, factores: ms.map(m => ({ nombre: m.nombre, relacion: m.relacion, arriba: m.arriba, abajo: m.abajo, factor: limpio(m.factor) })),
      signos: ms.map(m => ({ nombre: m.nombre, antes: m.relacion === 'directa' ? '−' : '+', despues: m.relacion === 'directa' ? '+' : '−' })), errores };
  }
  // La obra es lo que se hace (un muro, metros de zanja). El trabajo, obreros · días · horas · eficiencia / dificultad,
  // mide el esfuerzo en horas-hombre (obrero-días si no hay horas): es el área del rectángulo de la escena.
  const CAMPOS = ['obreros', 'dias', 'horas', 'eficiencia', 'dificultad', 'obra'];
  function horasHombre(o) {
    const v = c => (o[c] === undefined ? 1 : numero(o[c], c, { positivo: true }));
    return limpio(numero(o.obreros, 'obreros', { positivo: true }) * numero(o.dias, 'dias', { positivo: true }) * v('horas') * v('eficiencia') / v('dificultad'));
  }
  // obreros·días·horas·eficiencia / (obra·dificultad) no cambia. 'despues' trae un solo campo en null: ese se despeja.
  // Los campos que faltan valen 1 (en los dos lados). Errores para el caso de los días: olvidar las horas y
  // tratar las horas como directas (AR9), y todo como directo.
  function trabajo(antes, despues) {
    const v = (o, c) => (o[c] === undefined ? 1 : o[c]);
    const faltan = CAMPOS.filter(c => despues[c] === null);
    if (faltan.length !== 1) throw new Error('en despues, exactamente un dato debe ir en null');
    const x = faltan[0];
    CAMPOS.forEach(c => { numero(v(antes, c), `antes.${c}`, { positivo: true }); if (c !== x) numero(v(despues, c), `despues.${c}`, { positivo: true }); });
    const C = o => v(o, 'obreros') * v(o, 'dias') * v(o, 'horas') * v(o, 'eficiencia') / (v(o, 'obra') * v(o, 'dificultad'));
    const resto = Object.assign({}, despues, { [x]: 1 }), cR = C(resto), c0 = C(antes);
    // C es proporcional a los cuatro primeros e inversamente proporcional a obra y dificultad
    const valor = limpio(['obra', 'dificultad'].includes(x) ? cR / c0 : c0 / cR);
    const r = { dato: x, valor, constante: limpio(c0) };
    if (x === 'dias') {
      const o1 = v(antes, 'obreros'), o2 = v(despues, 'obreros'), h1 = v(antes, 'horas'), h2 = v(despues, 'horas'), d1 = v(antes, 'dias');
      const w1 = v(antes, 'obra'), w2 = v(despues, 'obra');
      r.errores = { sinCambio: d1, todoDirecta: limpio(d1 * (o2 / o1) * (h2 / h1) * (w1 / w2)) };
      if (h1 !== h2) Object.assign(r.errores, { olvidaHoras: limpio(d1 * (o1 / o2) * (w2 / w1)), horasDirectas: limpio(d1 * (o1 / o2) * (h2 / h1) * (w2 / w1)) });
      if (w1 !== w2) r.errores.obraInversa = limpio(d1 * (o1 / o2) * (h1 / h2) * (w1 / w2));
    }
    if (x === 'obra') r.errores = { sinCambio: limpio(v(antes, 'obra')), soloUno: limpio(v(antes, 'obra') * Math.max(v(despues, 'obreros') / v(antes, 'obreros'), v(despues, 'dias') / v(antes, 'dias'))) };
    return r;
  }
  // El rectángulo obreros × días con el trabajo fijo: días = trabajo/obreros; cuántas filas enteras y qué parte de la última.
  function rectangulo(w, obreros) {
    numero(w, 'el trabajo', { positivo: true }); numero(obreros, 'obreros', { positivo: true });
    const dias = limpio(w / obreros), enteras = Math.floor(dias + 1e-9);
    return { obreros, dias, filasEnteras: enteras, resto: limpio(dias - enteras), area: limpio(obreros * dias), casillas: w };
  }

  // ---------- Reparto proporcional ----------
  // Cada parte es proporcional al producto de los índices directos y al inverso del producto de los inversos.
  function reparto(o) {
    const S = numero(o.total, 'total', { positivo: true });
    const d = o.directo ? lista(o.directo, 'directo', { positivo: true }) : null, iv = o.inverso ? lista(o.inverso, 'inverso', { positivo: true }) : null;
    if (!d && !iv) throw new Error('da los índices: directo, inverso o los dos');
    if (d && iv && d.length !== iv.length) throw new Error('directo e inverso deben tener el mismo largo');
    const n = (d || iv).length;
    const pesos = Array.from({ length: n }, (_, j) => (d ? d[j] : 1) / (iv ? iv[j] : 1));
    const suma = pesos.reduce((s, x) => s + x, 0), k = S / suma;
    const partes = pesos.map(p => limpio(k * p));
    // pesos enteros más chicos (inverso a 2, 3 y 6 → 3, 2 y 1), si salen
    let enteros = null;
    for (let m = 1; m <= 10000 && !enteros; m++) {
      const e = pesos.map(p => p * m);
      if (e.every(x => Math.abs(x - Math.round(x)) < 1e-9)) {
        const r = e.map(Math.round), g = r.reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
        enteros = r.map(x => x / g);
      }
    }
    const kEnteros = enteros ? limpio(S / enteros.reduce((s, x) => s + x, 0)) : null;
    const errores = { iguales: partes.map(() => limpio(S / n)) };
    const directoA = idx => { const t = idx.reduce((s, x) => s + x, 0); return idx.map(x => limpio(S * x / t)); };
    if (iv && !d) errores.comoDirecto = directoA(iv);
    if (d && !iv) errores.comoInverso = directoA(d.map(x => 1 / x));
    return { partes, k: limpio(k), pesos: pesos.map(limpio), enteros, kEnteros, errores };
  }

  // ---------- Engranajes ----------
  // Por el punto de contacto pasan los mismos dientes: z₁·n₁ = z₂·n₂ = … El sentido se alterna en cada contacto.
  function engranajes(o) {
    const z = lista(o.dientes, 'dientes', { positivo: true, entero: true });
    if (z.length < 2) throw new Error('hacen falta al menos dos engranajes');
    const n1 = numero(o.vueltas1, 'vueltas1');
    const vueltas = z.map(zi => limpio(n1 * z[0] / zi));
    const sentido = z.map((_, j) => (j % 2 ? -1 : 1));
    const ult = z.length - 1;
    return { vueltas, sentido, dientesQuePasan: limpio(n1 * z[0]), mismoSentidoQueElPrimero: sentido[ult] === 1,
      errores: { directa: limpio(n1 * z[ult] / z[0]), aditiva: limpio(n1 + (z[ult] - z[0])), iguales: n1,
        soloElAnterior: z.length > 2 ? limpio(n1 * z[ult - 1] / z[ult]) : null } };
  }
  // Ángulo de cada engranaje (en vueltas) cuando el primero gira 'giro1' vueltas, con su sentido.
  function girosEngranajes(dientes, giro1) {
    lista(dientes, 'dientes', { positivo: true }); numero(giro1, 'giro1');
    return dientes.map((z, j) => (j % 2 ? -1 : 1) * giro1 * dientes[0] / z);
  }

  // ---------- Una magnitud que no es proporcional ----------
  // Estatura aproximada de una niña según su edad, en cm (valores redondeados de referencia, solo para mostrar
  // la forma de la curva). Entre dos edades enteras se interpola en línea recta.
  const ESTATURA = [50, 75, 87, 96, 103, 110, 116, 122, 128, 133, 138, 144, 151, 157, 160, 162, 163];
  function crecimiento(edad) {
    numero(edad, 'la edad');
    if (edad < 0 || edad > ESTATURA.length - 1) throw new Error(`la edad va de 0 a ${ESTATURA.length - 1} años`);
    const j = Math.min(Math.floor(edad), ESTATURA.length - 2), f = edad - j;
    return limpio(ESTATURA[j] + (ESTATURA[j + 1] - ESTATURA[j]) * f);
  }
  // Lía mide e1 (en clips de 'clip' cm) a la edad a1. ¿A la edad a2? Lo proporcional (AR7) contra la curva.
  function estatura(o) {
    const a1 = numero(o.a1, 'a1', { positivo: true }), a2 = numero(o.a2, 'a2', { positivo: true }), clip = numero(o.clip || 1, 'clip', { positivo: true });
    const e1 = limpio(crecimiento(a1) / clip), e2 = limpio(crecimiento(a2) / clip);
    const t = relacion([[a1, e1], [a2, e2]]);
    return { e1, e2, tipo: t.tipo, alNacer: limpio(crecimiento(0) / clip), errores: { proporcional: limpio(e1 * a2 / a1), sinCambio: e1,
      // crece en el segundo tramo lo mismo que en el primero (desde el nacimiento hasta a1), escalado al largo del tramo
      mismoAumento: limpio(e1 + (e1 - crecimiento(0) / clip) * (a2 - a1) / a1) } };
  }

  return { fraccion, textoFraccion, razon, cuartaProporcional, mediaProporcional, terceraProporcional, serieRazones,
    relacion, tabla, curva, reglaDeTres, srAlto, compuesta, horasHombre, trabajo, rectangulo, reparto, engranajes, girosEngranajes,
    crecimiento, estatura };
});
