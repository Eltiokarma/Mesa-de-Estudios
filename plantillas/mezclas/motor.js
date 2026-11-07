/*
 * Motor de «La balanza de las mezclas»: mezclas y aleaciones.
 *
 * CABECERA: Q, texto, soles, grados, milesimas, mezcla, precioMedio, gradoMezcla, leyMedia, aspa, cantidadPara, aguaPara,
 *           ley, quilates, leyDeQuilates, oroFino, aleacionPara, oroPara, escalar, masAlcohol, sacarYReponer, balanza,
 *           regla, ajustar, mover
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorMezclas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo se cuenta con fracciones exactas (numerador y denominador BigInt): 4,8 es 24/5 y 0,750 es 3/4. Hacia afuera se
 * devuelven números de JavaScript (para las pruebas y el dibujo) y textos con coma decimal hechos desde la fracción
 * exacta; si un resultado no tiene decimal exacto corto, el texto lleva «≈» y dos decimales.
 *
 * La idea de la escena: una balanza. Cada ingrediente se apoya sobre su precio (o grado, o ley, o quilates) en una regla
 * numérica, con un peso proporcional a su cantidad. El precio medio es el punto de equilibrio: ahí la suma de
 * cantidad × distancia (el momento) es igual a los dos lados. Eso mismo es la regla del aspa: las cantidades son
 * inversamente proporcionales a las distancias al precio medio.
 *
 * Mezclas (lista de ingredientes { cantidad, valor })
 *   mezcla(lista)                el valor medio Σ cantidad × valor ÷ Σ cantidad, cada producto, cada distancia al medio
 *                                (brazo) y cada momento; los momentos de la izquierda y de la derecha (siempre iguales)
 *   precioMedio(lista)           lo mismo con { cantidad, precio }; errores: promedio simple, suma de precios, kilos cruzados
 *   gradoMezcla(lista)           con { volumen, grado }: grado = % de alcohol puro en volumen; el alcohol puro de cada vaso
 *   leyMedia(lista)              con { masa, ley }: ley = metal fino ÷ masa total; el metal fino de cada parte
 *   escalar(lista, f)            multiplicar todas las cantidades por f no cambia el valor medio
 * Regla del aspa y problemas inversos
 *   aspa(p1, p2, pm)             la proporción irreducible q1 : q2 = (p2 − pm) : (pm − p1); sin solución (con la razón)
 *                                si pm queda fuera de [mín, máx]
 *   cantidadPara(p1, q1, p2, pm) cuánto del segundo para llegar a pm
 *   aguaPara(V, g0, gf)          litros de agua (0°) para bajar V litros de g0 a gf
 *   aleacionPara(m, li, lf, la)  cuánto de un metal de ley la hay que fundir con m de ley li para llegar a lf
 *   oroPara(m, k0, kf)           cuánto oro puro (24 quilates) para subir m gramos de k0 a kf quilates
 * Ley y quilates
 *   ley(fino, total)             ley = fino ÷ total, en milésimas, y sus quilates (ley × 24)
 *   quilates(ley), leyDeQuilates(k)   ida y vuelta: quilates = ley × 24
 *   oroFino(masa, k)             el oro puro de una pieza de k quilates: masa × k ÷ 24; las 24 partes para el dibujo
 * «¿Qué pasa si…?»
 *   masAlcohol(a, b)             ¿qué vaso tiene más alcohol puro?
 *   sacarYReponer(V, g, x)       se sacan x litros y se reponen con agua: el grado que queda
 * Para el dibujo (la escena solo pinta)
 *   balanza(lista, apoyo, res)   momento neto alrededor del apoyo, hacia dónde baja la barra y su inclinación (radianes)
 *   regla(desde, hasta, paso)    las marcas de la regla, con su texto
 *   ajustar(v, res, min, max), mover(v, pasos, res, min, max)   el apoyo que se arrastra, redondeado a la resolución
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta (o lo mismo
 * que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * El promedio simple (no pesar las cantidades) es el error AR15 del informe de aritmética, con respaldo parcial
 * (Pollatsek, Lima y Well, 1981, sin cifras). Los demás errores son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorMezclas = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- fracciones exactas ----------
  const absB = a => (a < 0n ? -a : a);
  function mcd(a, b) { a = absB(a); b = absB(b); while (b) { [a, b] = [b, a % b]; } return a; }
  function R(n, d) {
    n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
    if (d === 0n) throw new Error('división entre cero');
    if (d < 0n) { n = -n; d = -d; }
    const g = mcd(n, d) || 1n;
    return Object.freeze({ n: n / g, d: d / g, esFraccion: true });
  }
  // Un número de JavaScript, un texto ('4,8', '4.8', '24/5') o una fracción → fracción exacta.
  function Q(x, que) {
    if (x && x.esFraccion) return x;
    if (typeof x === 'bigint') return R(x);
    if (typeof x === 'number') {
      if (!Number.isFinite(x)) throw new Error(`${que || 'el valor'} debe ser un número finito`);
      if (Number.isInteger(x)) return R(BigInt(x));
      return Q(String(x), que);
    }
    if (typeof x === 'string') {
      const t = x.trim().replace(',', '.');
      let m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(t);
      if (m) { const dec = m[3] || ''; return R(BigInt(m[1] + m[2] + dec), 10n ** BigInt(dec.length)); }
      m = /^(-?\d+)\/(\d+)$/.exec(t);
      if (m) return R(BigInt(m[1]), BigInt(m[2]));
    }
    throw new Error(`${que || 'el valor'} debe ser un número`);
  }
  const suma = (a, b) => R(a.n * b.d + b.n * a.d, a.d * b.d);
  const resta = (a, b) => R(a.n * b.d - b.n * a.d, a.d * b.d);
  const por = (a, b) => R(a.n * b.n, a.d * b.d);
  const entre = (a, b) => { if (b.n === 0n) throw new Error('división entre cero'); return R(a.n * b.d, a.d * b.n); };
  const cmp = (a, b) => { const x = a.n * b.d - b.n * a.d; return x < 0n ? -1 : x > 0n ? 1 : 0; };
  const igual = (a, b) => a.n === b.n && a.d === b.d;
  const absQ = a => R(absB(a.n), a.d);
  const num = a => Number(a.n) / Number(a.d);
  const CERO = R(0), UNO = R(1), CIEN = R(100), VEINTICUATRO = R(24);
  const sumar = xs => xs.reduce(suma, CERO);
  const minQ = xs => xs.reduce((a, b) => (cmp(a, b) <= 0 ? a : b));
  const maxQ = xs => xs.reduce((a, b) => (cmp(a, b) >= 0 ? a : b));

  // ---------- textos ----------
  const miles = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Decimal exacto (si el denominador solo tiene 2 y 5 y caben ≤ maxDec decimales), o null.
  function decimalExacto(q, maxDec) {
    let d = q.d, k = 0;
    while (d % 2n === 0n) { d /= 2n; k++; }
    let j = 0; while (d % 5n === 0n) { d /= 5n; j++; }
    if (d !== 1n) return null;
    const dec = Math.max(k, j);
    if (dec > maxDec) return null;
    return conDecimales(q, dec);
  }
  // q con exactamente dec decimales, redondeado (la mitad hacia arriba, en valor absoluto).
  function conDecimales(q, dec) {
    const f = 10n ** BigInt(dec), neg = q.n < 0n, n = absB(q.n);
    const r = (2n * n * f + q.d) / (2n * q.d);
    const ent = r / f, fr = r % f;
    const s = miles(String(ent)) + (dec ? ',' + String(fr).padStart(dec, '0') : '');
    return (neg && r !== 0n ? '−' : '') + s;
  }
  // El texto que ve el alumno: exacto si se puede (hasta 4 decimales); si no, «≈» y dos decimales.
  // o = { min: decimales mínimos (soles: 2; milésimas: 3) }
  function texto(x, o) {
    const q = Q(x), min = (o && o.min) || 0, ex = decimalExacto(q, 4);
    if (ex !== null) {
      const partes = ex.split(','), dec = partes[1] ? partes[1].length : 0;
      return dec >= min ? ex : conDecimales(q, min);
    }
    return '≈ ' + conDecimales(q, Math.max(2, min));
  }
  const exacto = x => decimalExacto(Q(x), 4) !== null;
  // Soles: siempre con dos decimales; si el valor exacto tiene más, «≈» y redondeado a céntimos.
  const soles = x => { const q = Q(x), ex = decimalExacto(q, 2); return ex !== null ? 'S/ ' + conDecimales(q, 2) : '≈ S/ ' + conDecimales(q, 2); };
  const grados = x => texto(x) + '°';
  // Milésimas: siempre con tres decimales; si el valor exacto tiene más, «≈» y redondeado a milésimas.
  const milesimas = x => { const q = Q(x); return (decimalExacto(q, 3) !== null ? '' : '≈ ') + conDecimales(q, 3); };
  const fraccion = q => (q.d === 1n ? String(q.n) : `${q.n}/${q.d}`);

  // ---------- entradas ----------
  function noNegativo(x, que) { const q = Q(x, que); if (q.n < 0n) throw new Error(`${que} debe ser mayor o igual que 0`); return q; }
  function positivo(x, que) { const q = Q(x, que); if (q.n <= 0n) throw new Error(`${que} debe ser mayor que 0`); return q; }
  function entreQ(x, a, b, que) {
    const q = Q(x, que);
    if (cmp(q, a) < 0 || cmp(q, b) > 0) throw new Error(`${que} debe estar entre ${texto(a)} y ${texto(b)}`);
    return q;
  }
  // Quita los errores que coinciden con la respuesta o con un error anterior (comparando exacto).
  function limpiar(errores, correcta) {
    const clave = v => JSON.stringify(v, (k, x) => (x && x.esFraccion ? fraccion(x) : x));
    const out = {}, vistos = [clave(correcta)];
    for (const [k, v] of Object.entries(errores)) {
      if (v === undefined || v === null) continue;
      const c = clave(v);
      if (vistos.includes(c)) continue;
      vistos.push(c); out[k] = v;
    }
    return out;
  }
  const aNum = errores => Object.fromEntries(Object.entries(errores).map(([k, v]) => [k, v && v.esFraccion ? num(v) : v]));

  // ---------- mezclas ----------
  function leerLista(lista, kc, kv) {
    if (!Array.isArray(lista) || !lista.length) throw new Error('la lista debe tener al menos un ingrediente');
    return lista.map((x, i) => {
      if (!x || typeof x !== 'object') throw new Error(`el ingrediente ${i + 1} debe ser un objeto`);
      return { c: noNegativo(x[kc] !== undefined ? x[kc] : x.cantidad, kc), v: Q(x[kv] !== undefined ? x[kv] : x.valor, kv) };
    });
  }
  function mezclaQ(items) {
    const total = sumar(items.map(x => x.c));
    if (total.n === 0n) throw new Error('la mezcla no tiene cantidad: alguna cantidad debe ser mayor que 0');
    const sumaP = sumar(items.map(x => por(x.c, x.v)));
    const m = entre(sumaP, total);
    return { total, sumaP, m };
  }
  // El resultado general: valor medio, productos, brazos y momentos.
  function mezcla(lista, kc, kv) {
    const items = leerLista(lista, kc || 'cantidad', kv || 'valor');
    const { total, sumaP, m } = mezclaQ(items);
    const partes = items.map(({ c, v }) => {
      const b = resta(v, m), brazo = absQ(b), mom = por(c, brazo);
      return { cantidad: num(c), valor: num(v), producto: num(por(c, v)), productoTexto: texto(por(c, v)),
        brazo: num(brazo), brazoTexto: texto(brazo), lado: b.n < 0n ? 'izquierda' : b.n > 0n ? 'derecha' : 'apoyo',
        momento: num(mom), momentoTexto: texto(mom), cantidadTexto: texto(c), valorTexto: texto(v) };
    });
    const izq = sumar(items.filter(x => cmp(x.v, m) < 0).map(x => por(x.c, resta(m, x.v))));
    const der = sumar(items.filter(x => cmp(x.v, m) > 0).map(x => por(x.c, resta(x.v, m))));
    const vs = items.map(x => x.v);
    const simple = entre(sumar(vs), R(vs.length));
    const cruzado = items.length === 2 ? entre(suma(por(items[1].c, items[0].v), por(items[0].c, items[1].v)), total) : undefined;
    const errQ = limpiar({ promedioSimple: simple, sumaValores: items.length > 1 ? sumar(vs) : undefined, cantidadesCruzadas: cruzado }, m);
    return { media: num(m), mediaTexto: texto(m), mediaFraccion: fraccion(m), exacta: exacto(m),
      total: num(total), totalTexto: texto(total), suma: num(sumaP), sumaTexto: texto(sumaP), partes,
      momentoIzquierda: num(izq), momentoDerecha: num(der), momentoTexto: texto(izq),
      minimo: num(minQ(vs)), maximo: num(maxQ(vs)), respuesta: num(m),
      errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, texto(v)])), _m: m };
  }
  const sinInterno = r => { delete r._m; return r; };

  function precioMedio(lista) {
    const L = leerLista(lista, 'cantidad', 'precio');
    L.forEach((x, i) => { if (x.v.n < 0n) throw new Error(`el precio del ingrediente ${i + 1} debe ser mayor o igual que 0`); });
    const r = mezcla(L.map(x => ({ cantidad: x.c, valor: x.v })));
    r.precioMedio = r.media; r.soles = soles(r._m); r.costo = r.suma; r.costoTexto = r.sumaTexto;
    r.erroresSoles = Object.fromEntries(Object.entries(r.errores).map(([k, v]) => [k, soles(v)]));
    return sinInterno(r);
  }
  function gradoMezcla(lista) {
    const L = leerLista(lista, 'volumen', 'grado');
    L.forEach((x, i) => entreQ(x.v, CERO, CIEN, `el grado del vaso ${i + 1}`));
    const r = mezcla(L.map(x => ({ cantidad: x.c, valor: x.v })));
    const alc = L.map(x => entre(por(x.c, x.v), CIEN)), alcT = sumar(alc), totalQ = sumar(L.map(x => x.c));
    r.grado = r.media; r.gradoTexto = grados(r._m);
    r.vasos = L.map((x, i) => ({ volumen: num(x.c), grado: num(x.v), alcohol: num(alc[i]), alcoholTexto: texto(alc[i]),
      agua: num(resta(x.c, alc[i])), aguaTexto: texto(resta(x.c, alc[i])), fraccion: num(entre(x.v, CIEN)) }));
    r.alcohol = num(alcT); r.alcoholTexto = texto(alcT); r.agua = num(resta(totalQ, alcT)); r.aguaTexto = texto(resta(totalQ, alcT));
    r.volumen = r.total; r.volumenTexto = r.totalTexto;
    r.erroresGrados = Object.fromEntries(Object.entries(r.errores).map(([k, v]) => [k, grados(v)]));
    return sinInterno(r);
  }
  function leyMedia(lista) {
    const L = leerLista(lista, 'masa', 'ley');
    L.forEach((x, i) => entreQ(x.v, CERO, UNO, `la ley de la parte ${i + 1}`));
    const r = mezcla(L.map(x => ({ cantidad: x.c, valor: x.v })));
    const fino = L.map(x => por(x.c, x.v)), finoT = sumar(fino);
    r.ley = r.media; r.leyTexto = milesimas(r._m); r.quilates = num(por(r._m, VEINTICUATRO)); r.quilatesTexto = texto(por(r._m, VEINTICUATRO));
    r.fino = num(finoT); r.finoTexto = texto(finoT); r.finoPartes = fino.map(num);
    r.erroresLey = Object.fromEntries(Object.entries(r.errores).map(([k, v]) => [k, milesimas(v)]));
    return sinInterno(r);
  }
  // Multiplicar todas las cantidades por f: el valor medio no cambia.
  function escalar(lista, f) {
    const F = positivo(f, 'f'), L = leerLista(lista, 'cantidad', 'valor');
    const A = mezcla(L.map(x => ({ cantidad: x.c, valor: x.v }))), B = mezcla(L.map(x => ({ cantidad: por(x.c, F), valor: x.v })));
    if (!igual(A._m, B._m)) throw new Error('escalar cambió el valor medio');
    const vs = L.map(x => x.v), simple = entre(sumar(vs), R(vs.length));
    const errQ = limpiar({ seMultiplica: por(A._m, F), seDivide: entre(A._m, F), promedioSimple: simple }, A._m);
    return { f: num(F), media: A.media, mediaTexto: A.mediaTexto, mediaEscalada: B.media, antes: sinInterno(A), despues: sinInterno(B),
      respuesta: B.media, errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, texto(v)])) };
  }

  // ---------- la regla del aspa ----------
  // a : b (fracciones no negativas) → enteros sin factor común.
  function enteros(a, b) {
    if (a.n === 0n && b.n === 0n) return [0, 0];
    const den = (a.d * b.d) / (mcd(a.d, b.d) || 1n);
    let x = a.n * (den / a.d), y = b.n * (den / b.d);
    const g = mcd(x, y) || 1n; x /= g; y /= g;
    return [Number(x), Number(y)];
  }
  const razon = ([x, y]) => `${x} : ${y}`;
  // El valor medio que sale con una proporción q1 : q2 (para las retroalimentaciones).
  const daCon = (P1, P2, [x, y]) => (x + y === 0 ? null : entre(suma(por(R(x), P1), por(R(y), P2)), R(x + y)));
  function aspa(p1, p2, pm) {
    const P1 = Q(p1, 'p1'), P2 = Q(p2, 'p2'), PM = Q(pm, 'pm');
    const lo = minQ([P1, P2]), hi = maxQ([P1, P2]);
    const base = { p1: num(P1), p2: num(P2), pm: num(PM), minimo: num(lo), maximo: num(hi) };
    if (igual(P1, P2)) {
      return igual(PM, P1) ? Object.assign(base, { posible: true, cualquiera: true, razon: 'los dos valen lo mismo: sirve cualquier proporción', errores: {} })
        : Object.assign(base, { posible: false, razon: `los dos valen ${texto(P1)}: la mezcla siempre vale ${texto(P1)}`, errores: {} });
    }
    const d1 = absQ(resta(PM, P1)), d2 = absQ(resta(P2, PM));
    const comun = { d1: num(d1), d2: num(d2), d1Texto: texto(d1), d2Texto: texto(d2) };
    if (cmp(PM, lo) < 0 || cmp(PM, hi) > 0) {
      const errQ = limpiar({ sinSigno: enteros(d2, d1), sinSignoAlReves: enteros(d1, d2) }, null);
      return Object.assign(base, comun, { posible: false,
        razon: `el valor medio siempre queda entre el menor (${texto(lo)}) y el mayor (${texto(hi)}), y ${texto(PM)} queda ${cmp(PM, lo) < 0 ? 'por debajo' : 'por encima'}`,
        errores: errQ, erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, razon(v)])),
        daria: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, num(daCon(P1, P2, v))])) });
    }
    const q = enteros(d2, d1);
    const comp = daCon(P1, P2, q);
    if (!igual(comp, PM)) throw new Error('el aspa no reproduce el valor medio');
    const errQ = limpiar({ alReves: enteros(d1, d2), preciosCruzados: enteros(absQ(P2), absQ(P1)), mitades: [1, 1] }, q);
    const daria = Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, daCon(P1, P2, v)]));
    return Object.assign(base, comun, { posible: true, extremo: igual(PM, P1) || igual(PM, P2), q1: q[0], q2: q[1], proporcion: q, texto: razon(q),
      respuesta: q, errores: errQ, erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, razon(v)])),
      daria: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, num(v)])),
      dariaTexto: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, texto(v)])),
      dariaSoles: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, soles(v)])) });
  }
  // Con q1 del primero (valor p1), ¿cuánto del segundo (valor p2) para que la mezcla valga pm?
  function cantidadPara(p1, q1, p2, pm) {
    const P1 = Q(p1, 'p1'), C1 = noNegativo(q1, 'q1'), P2 = Q(p2, 'p2'), PM = Q(pm, 'pm');
    const A = aspa(P1, P2, PM);
    if (!A.posible) return { posible: false, razon: A.razon, errores: {} };
    if (A.cualquiera) return { posible: true, cualquiera: true, razon: A.razon, errores: {} };
    if (igual(PM, P2)) return { posible: C1.n === 0n, razon: 'para llegar justo al valor del segundo no puede haber nada del primero', errores: {} };
    const c2 = entre(por(C1, resta(PM, P1)), resta(P2, PM));
    const errQ = limpiar({ alReves: cmp(PM, P1) === 0 ? undefined : entre(por(C1, resta(P2, PM)), resta(PM, P1)), total: suma(C1, c2) }, c2);
    return { posible: true, cantidad: num(c2), cantidadTexto: texto(c2), total: num(suma(C1, c2)), totalTexto: texto(suma(C1, c2)), respuesta: num(c2),
      errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, texto(v)])) };
  }
  // Agua (0°) para bajar V litros de alcohol de g0 grados hasta gf grados.
  function aguaPara(V, g0, gf) {
    const Vq = positivo(V, 'V'), G0 = entreQ(g0, CERO, CIEN, 'g0'), GF = entreQ(gf, CERO, CIEN, 'gf');
    const alc = entre(por(Vq, G0), CIEN);
    const base = { V: num(Vq), g0: num(G0), gf: num(GF), alcohol: num(alc), alcoholTexto: texto(alc) };
    if (cmp(GF, G0) > 0) return Object.assign(base, { posible: false, razon: 'el agua no tiene alcohol: al agregarla el grado baja, nunca sube', errores: {} });
    if (GF.n === 0n) return Object.assign(base, { posible: G0.n === 0n, razon: 'con agua el grado se acerca a 0°, pero no llega mientras quede alcohol', errores: {} });
    const final = entre(alc, entre(GF, CIEN)), agua = resta(final, Vq);
    if (!igual(entre(por(alc, CIEN), final), GF)) throw new Error('aguaPara: no cuadra');
    const errQ = limpiar({
      aspaAlReves: agua.n === 0n ? undefined : entre(por(Vq, GF), resta(G0, GF)),     // cruza mal las distancias del aspa
      restaGrados: resta(G0, GF),                                                     // toma la diferencia de grados como litros
      volumenFinal: final,                                                            // da el volumen final, no el agua
      bajaRelativa: G0.n === 0n ? undefined : entre(por(Vq, resta(G0, GF)), G0),      // V × (g0 − gf) ÷ g0
    }, agua);
    return Object.assign(base, { posible: true, agua: num(agua), aguaTexto: texto(agua), volumenFinal: num(final), volumenFinalTexto: texto(final),
      d1: num(resta(G0, GF)), d1Texto: texto(resta(G0, GF)), d2: num(GF), d2Texto: texto(GF), momento: num(por(Vq, resta(G0, GF))), momentoTexto: texto(por(Vq, resta(G0, GF))),
      respuesta: num(agua), errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, texto(v)])),
      daria: Object.fromEntries(Object.entries(errQ).filter(([k]) => k !== 'volumenFinal').map(([k, v]) => [k, num(entre(por(alc, CIEN), suma(Vq, v)))])),
      dariaTexto: Object.fromEntries(Object.entries(errQ).filter(([k]) => k !== 'volumenFinal').map(([k, v]) => [k, grados(entre(por(alc, CIEN), suma(Vq, v)))])) });
  }

  // ---------- ley y quilates ----------
  function ley(fino, total) {
    const T = positivo(total, 'total'), F = entreQ(fino, CERO, T, 'fino');
    const L = entre(F, T), K = por(L, VEINTICUATRO);
    return { fino: num(F), total: num(T), ley: num(L), leyTexto: milesimas(L), leyFraccion: fraccion(L), quilates: num(K), quilatesTexto: texto(K),
      liga: num(resta(T, F)), ligaTexto: texto(resta(T, F)) };
  }
  function quilates(l) { const L = entreQ(l, CERO, UNO, 'ley'), K = por(L, VEINTICUATRO); return { ley: num(L), leyTexto: milesimas(L), quilates: num(K), quilatesTexto: texto(K) }; }
  function leyDeQuilates(k) { const K = entreQ(k, CERO, VEINTICUATRO, 'quilates'), L = entre(K, VEINTICUATRO); return { quilates: num(K), quilatesTexto: texto(K), ley: num(L), leyTexto: milesimas(L), leyFraccion: fraccion(L) }; }
  function oroFino(masa, k) {
    const M = positivo(masa, 'masa'), K = entreQ(k, CERO, VEINTICUATRO, 'quilates'), L = entre(K, VEINTICUATRO);
    const fino = por(M, L), liga = resta(M, fino), parte = entre(M, VEINTICUATRO);
    const nK = Number.isInteger(num(K)) ? num(K) : null;
    const errQ = limpiar({
      quilatesComoGramos: K,                                  // toma los quilates como gramos de oro
      quilatesComoPorcentaje: entre(por(M, K), CIEN),         // toma los quilates como un porcentaje (sobre 100)
      daLaLiga: liga,                                         // da el otro metal, no el oro
    }, fino);
    return { masa: num(M), masaTexto: texto(M), quilates: num(K), ley: num(L), leyTexto: milesimas(L), fino: num(fino), finoTexto: texto(fino),
      liga: num(liga), ligaTexto: texto(liga), parte: num(parte), parteTexto: texto(parte), partesFino: nK, partesLiga: nK === null ? null : 24 - nK,
      partes: nK === null ? null : Array.from({ length: 24 }, (_, i) => ({ i, tipo: i < nK ? 'fino' : 'liga' })),
      respuesta: num(fino), errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k2, v]) => [k2, texto(v)])) };
  }
  // ¿Cuánto metal de ley la hay que fundir con m de ley li para que la aleación tenga ley lf?
  function aleacionPara(masa, li, lf, la) {
    const M = positivo(masa, 'masa'), LI = entreQ(li, CERO, UNO, 'li'), LF = entreQ(lf, CERO, UNO, 'lf'), LA = entreQ(la, CERO, UNO, 'la');
    const finoI = por(M, LI);
    const base = { masa: num(M), li: num(LI), lf: num(LF), la: num(LA), finoInicial: num(finoI), finoInicialTexto: texto(finoI) };
    const A = aspa(LI, LA, LF);
    if (!A.posible) return Object.assign(base, { posible: false, razon: A.razon, errores: {} });
    if (igual(LF, LA)) return Object.assign(base, { posible: false, razon: 'para llegar justo a la ley del metal que se agrega haría falta quitar toda la aleación inicial', errores: {} });
    const x = entre(por(M, resta(LF, LI)), resta(LA, LF)), total = suma(M, x), finoF = suma(finoI, por(x, LA));
    if (!igual(entre(finoF, total), LF)) throw new Error('aleacionPara: no cuadra');
    const errQ = limpiar({
      aspaAlReves: x.n === 0n ? undefined : entre(por(M, resta(LA, LF)), resta(LF, LI)),   // cruza mal las distancias del aspa
      total,                                                                              // da la masa final
      diferenciaPorMasa: por(M, absQ(resta(LF, LI))),                                     // masa × (cambio de ley)
    }, x);
    const daria = Object.fromEntries(Object.entries(errQ).filter(([k]) => k !== 'total').map(([k, v]) => [k, entre(suma(finoI, por(v, LA)), suma(M, v))]));
    return Object.assign(base, { posible: true, agregar: num(x), agregarTexto: texto(x), total: num(total), totalTexto: texto(total),
      finoAgregado: num(por(x, LA)), finoAgregadoTexto: texto(por(x, LA)), finoFinal: num(finoF), finoFinalTexto: texto(finoF),
      respuesta: num(x), errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, texto(v)])),
      dariaLey: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, num(v)])),
      dariaQuilates: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, num(por(v, VEINTICUATRO))])),
      dariaQuilatesTexto: Object.fromEntries(Object.entries(daria).map(([k, v]) => [k, texto(por(v, VEINTICUATRO))])) });
  }
  // Oro puro (24 quilates) para llevar m gramos de k0 a kf quilates; brazos en quilates para la balanza.
  function oroPara(masa, k0, kf) {
    const K0 = entreQ(k0, CERO, VEINTICUATRO, 'k0'), KF = entreQ(kf, CERO, VEINTICUATRO, 'kf');
    const r = aleacionPara(masa, entre(K0, VEINTICUATRO), entre(KF, VEINTICUATRO), UNO);
    r.k0 = num(K0); r.kf = num(KF);
    if (r.posible) {
      const d1 = resta(KF, K0), d2 = resta(VEINTICUATRO, KF);
      Object.assign(r, { d1: num(d1), d1Texto: texto(d1), d2: num(d2), d2Texto: texto(d2), momento: num(por(Q(masa), d1)), momentoTexto: texto(por(Q(masa), d1)) });
    }
    return r;
  }

  // ---------- «¿qué pasa si…?» ----------
  function masAlcohol(a, b) {
    const VA = positivo(a.volumen, 'volumen del vaso A'), GA = entreQ(a.grado, CERO, CIEN, 'grado del vaso A');
    const VB = positivo(b.volumen, 'volumen del vaso B'), GB = entreQ(b.grado, CERO, CIEN, 'grado del vaso B');
    const AA = entre(por(VA, GA), CIEN), AB = entre(por(VB, GB), CIEN), c = cmp(AA, AB);
    const resp = c === 0 ? 'igual' : c > 0 ? 'A' : 'B';
    const errores = limpiar({
      masVolumen: cmp(VA, VB) === 0 ? undefined : cmp(VA, VB) > 0 ? 'A' : 'B',   // el de más litros
      masGrado: cmp(GA, GB) === 0 ? undefined : cmp(GA, GB) > 0 ? 'A' : 'B',     // el de más grados
      noSeSabe: 'no-se-sabe',
    }, resp);
    return { alcoholA: num(AA), alcoholATexto: texto(AA), alcoholB: num(AB), alcoholBTexto: texto(AB), respuesta: resp, errores };
  }
  // De V litros de g grados se sacan x litros y se reponen con x litros de agua.
  function sacarYReponer(V, g, x) {
    const Vq = positivo(V, 'V'), G = entreQ(g, CERO, CIEN, 'g'), X = entreQ(x, CERO, Vq, 'x');
    const alc0 = entre(por(Vq, G), CIEN), sale = entre(por(X, G), CIEN), queda = resta(alc0, sale), gf = entre(por(queda, CIEN), Vq);
    const errQ = limpiar({
      restaLitros: cmp(G, X) >= 0 ? resta(G, X) : undefined,   // resta los litros sacados como si fueran grados
      promedioSimple: entre(G, R(2)),                           // promedia el grado con el del agua (0°) sin pesar los litros
      soloLaBaja: entre(por(G, X), Vq),                         // da cuánto bajó el grado, no cuánto queda
    }, gf);
    return { V: num(Vq), g: num(G), x: num(X), alcoholInicial: num(alc0), alcoholInicialTexto: texto(alc0), alcoholSale: num(sale), alcoholSaleTexto: texto(sale),
      alcoholQueda: num(queda), alcoholQuedaTexto: texto(queda), quedan: num(resta(Vq, X)), quedanTexto: texto(resta(Vq, X)),
      grado: num(gf), gradoTexto: grados(gf), respuesta: num(gf),
      errores: aNum(errQ), erroresTexto: Object.fromEntries(Object.entries(errQ).map(([k, v]) => [k, grados(v)])) };
  }

  // ---------- para el dibujo ----------
  const ANG_MAX = 0.16;   // radianes: lo más que se inclina la barra
  // Momento neto alrededor del apoyo: positivo si la barra baja hacia la derecha. res: la resolución del apoyo que se
  // arrastra (si el apoyo es el más cercano al equilibrio que se puede poner y no es exacto, el estado es 'casi').
  function balanza(lista, apoyo, res) {
    const items = leerLista(lista, 'cantidad', 'valor'), A = Q(apoyo, 'apoyo');
    const total = sumar(items.map(x => x.c));
    const momentoQ = sumar(items.map(x => por(x.c, resta(x.v, A))));
    const izq = sumar(items.filter(x => cmp(x.v, A) < 0).map(x => por(x.c, resta(A, x.v))));
    const der = sumar(items.filter(x => cmp(x.v, A) > 0).map(x => por(x.c, resta(x.v, A))));
    const vs = items.map(x => x.v), span = num(resta(maxQ(vs.concat([A])), minQ(vs.concat([A])))) || 1;
    let estado = momentoQ.n === 0n ? 'equilibrio' : momentoQ.n > 0n ? 'baja-derecha' : 'baja-izquierda';
    let entreTexto = null, entreValores = null, media = null;
    if (total.n > 0n) {
      const m = mezclaQ(items).m; media = num(m);
      if (estado !== 'equilibrio' && res !== undefined) {
        const r = positivo(res, 'res'), dist = absQ(resta(A, m));
        if (cmp(por(dist, R(2)), r) < 0) {
          estado = 'casi';
          const k = m.n * r.d / (m.d * r.n), lo = por(R(k), r), hi = suma(lo, r);   // ⌊m/res⌋·res y el siguiente
          entreTexto = [texto(lo), texto(hi)]; entreValores = [num(lo), num(hi)];
        }
      }
    }
    const t = total.n === 0n ? 0 : num(momentoQ) / (num(total) * span) * 6;
    const angulo = ANG_MAX * Math.max(-1, Math.min(1, t));
    return { apoyo: num(A), apoyoTexto: texto(A), momento: num(momentoQ), momentoTexto: texto(absQ(momentoQ)), izquierda: num(izq), izquierdaTexto: texto(izq),
      derecha: num(der), derechaTexto: texto(der), estado, entre: entreTexto, entreValores, media, angulo, total: num(total) };
  }
  function regla(desde, hasta, paso) {
    const D = Q(desde, 'desde'), H = Q(hasta, 'hasta'), P = positivo(paso, 'paso');
    if (cmp(H, D) <= 0) throw new Error('hasta debe ser mayor que desde');
    const marcas = [];
    for (let v = D; cmp(v, H) <= 0; v = suma(v, P)) { marcas.push({ valor: num(v), texto: texto(v) }); if (marcas.length > 400) throw new Error('demasiadas marcas'); }
    return marcas;
  }
  // El apoyo arrastrado: redondeado a la resolución res y dentro de [min, max].
  function ajustar(v, res, min, max) {
    const r = positivo(res, 'res'), lo = Q(min, 'min'), hi = Q(max, 'max');
    const x = typeof v === 'number' ? v : num(Q(v));
    const k = Math.round(x * Number(r.d) / Number(r.n));
    let q = por(R(k), r);
    if (cmp(q, lo) < 0) q = lo; if (cmp(q, hi) > 0) q = hi;
    return num(q);
  }
  function mover(v, pasos, res, min, max) {
    const r = positivo(res, 'res'), V = Q(v, 'v');
    // primero al múltiplo de res más cercano, después los pasos
    const k = Math.round(num(V) * Number(r.d) / Number(r.n));
    return ajustar(num(por(R(k + pasos), r)), r, min, max);
  }

  return { Q, texto, soles, grados, milesimas, exacto, mezcla: (l, kc, kv) => sinInterno(mezcla(l, kc, kv)), precioMedio, gradoMezcla, leyMedia,
    escalar, aspa, cantidadPara, aguaPara, ley, quilates, leyDeQuilates, oroFino, aleacionPara, oroPara, masAlcohol, sacarYReponer,
    balanza, regla, ajustar, mover, ANG_MAX };
});
