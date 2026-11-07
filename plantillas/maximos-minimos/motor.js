/*
 * Motor de «El cordel que encierra: máximos y mínimos» (razonamiento matemático): corrales de perímetro fijo,
 * corrales contra una pared, recorridos mínimos con reflejo, precio que da el mayor ingreso y el menor número de
 * colores para pintar un mapa.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorMaximos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Longitudes en metros, áreas en m², precios en soles. Todo número debe ser finito; los que se dicen
 *     «positivos» deben ser mayores que cero.
 *   - Un rectángulo tiene ancho x (lado horizontal) y largo y (lado vertical); no se exige que y ≥ x.
 *   - El río: la orilla es la recta y = 0; A = (0, a) y B = (d, b) están del mismo lado (a, b > 0, d ≥ 0);
 *     P = (p, 0) es el punto de la orilla que se toca. B' = (d, −b) es el reflejo de B en la orilla.
 *   - Un «exacto» es un texto con fracciones o raíces simplificadas ('40/3', '6√5', '3 + √61'); es null si los
 *     datos no permiten escribirlo así.
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico) y
 *     'coinciden' (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y
 *     no van en 'errores'). Un error que da lo mismo que otro anterior de la lista tampoco va en 'errores':
 *     va a 'repetidos' ({ nombre: el error anterior al que repite }). Solo trae 'repetidos' el resultado que
 *     tiene 'coinciden'.
 *
 * Funciones (argumentos entre llaves):
 *   rectangulo({ perimetro, ancho })   rectángulo de perímetro fijo; 0 < ancho < perimetro/2.
 *                               { ancho, largo: perimetro/2 − ancho, area: ancho·largo, perimetro, semisuma: perimetro/2 }.
 *   rectanguloArea({ area, ancho })    rectángulo de área fija; ancho > 0.
 *                               { ancho, largo: area/ancho, area, perimetro: 2(ancho + largo) }.
 *   productoMaximo({ a, b, total })    el mayor producto x·y con x, y > 0 y a·x + b·y = total (a, b, total positivos).
 *                               { x: total/(2a), y: total/(2b), producto: total²/(4ab), parte: total/2 (lo que vale
 *                               cada sumando a·x y b·y en el máximo), exacto (texto del producto), errores:
 *                               factoresIguales ({ x, y, producto } con x = y = total/(a + b): iguala los factores
 *                               sin mirar qué se suma) }. 'coinciden' lleva 'factoresIguales' si a = b.
 *   compararRectangulos({ tipo, valor, anchos })   compara rectángulos con el mismo perímetro (tipo 'perimetro',
 *                               valor = perímetro) o con la misma área (tipo 'area', valor = área), uno por cada
 *                               ancho de la lista (2 a 6 anchos distintos, todos válidos).
 *                               { rectangulos: [{ ancho, largo, area, perimetro }] en el orden dado,
 *                               mejor: el ancho del de mayor área (tipo 'perimetro') o del de menor perímetro
 *                               (tipo 'area'), optimo: el lado del cuadrado (perimetro/4 o √area),
 *                               iguales: false (en la lista no todos dan lo mismo), errores: masAlargado (el ancho
 *                               del rectángulo más alargado, el de mayor cociente lado mayor / lado menor),
 *                               intermedio (el primer ancho de la lista que no es ni el mejor ni el más alargado;
 *                               no va si no hay), todosIguales ('todos': cree que todos dan lo mismo) }.
 *   escalarCorral({ perimetro, factor })   el mejor corral (cuadrado) con el cordel multiplicado por factor > 0.
 *                               { lado, ladoNuevo, area, areaNueva, razon: factor², errores: lineal (area·factor:
 *                               ilusión de linealidad) y aditiva (area + perimetro·(factor − 1): suma al área lo que
 *                               creció el cordel) }.
 *   sumaMinima({ producto })    la menor suma x + y con x, y > 0 y x·y = producto > 0. { x: √producto, y, suma:
 *                               2√producto, exacto, errores: unoYTodo (1 + producto) y dosYMitad (2 + producto/2) }.
 *   pared({ malla, x, tramos })   corral contra una pared: 'tramos' lados perpendiculares a la pared, de x cada uno
 *                               (tramos entero ≥ 2; por defecto 2), y un lado paralelo. 0 < x < malla/tramos.
 *                               { x, paralelo: malla − tramos·x, area: x·paralelo, malla, tramos }.
 *   paredMaxima({ malla, tramos })   el corral contra la pared de mayor área. { x: malla/(2·tramos), paralelo: malla/2,
 *                               area: malla²/(4·tramos), exacto, reflejo ({ alto: 2x, largo: paralelo, perimetro:
 *                               2·malla, area: 2·area }: el corral y su reflejo en la pared; solo con tramos = 2),
 *                               errores (cada uno { x, paralelo, area } y su 'exacto'): cuadrado (todos los tramos
 *                               iguales: x = paralelo = malla/(tramos + 1)), comoCorralLibre (solo con tramos = 2: x = paralelo = malla/4;
 *                               usa la regla del corral sin pared y le sobra malla), alReves (x = 2·paralelo: invierte
 *                               la razón) }.
 *   recorrido({ a, b, d, p })   ir de A a P = (p, 0) y luego a B. { AP, PB, total: AP + PB, ABprima: √(d² + (a + b)²)
 *                               (la recta de A al reflejo B'), directo: √(d² + (a − b)²) (de A a B sin tocar el río) }.
 *   recorridoMinimo({ a, b, d })   el punto de la orilla que hace mínimo AP + PB. { p: a·d/(a + b), AP, PB, minimo:
 *                               √(d² + (a + b)²), exacto (texto de minimo), pExacto, angulo (grados que forman AP y
 *                               PB con la orilla, iguales a los dos lados: atan((a + b)/d); 90 si d = 0),
 *                               reflejo: { x: d, y: −b }, errores (longitudes del recorrido): perpendicularA (baja en
 *                               perpendicular desde A: p = 0), perpendicularB (p = d), puntoMedio (p = d/2),
 *                               sumaPerpendiculares (a + b, que no es un recorrido posible) y porLaOrilla (a + d + b:
 *                               baja, camina por la orilla y sube); exactos: el texto de cada error }.
 *   moverPunto({ a, b, d, b2 })   si B se aleja (o se acerca) a la orilla, de b a b2, ¿hacia dónde se mueve el mejor
 *                               punto P? { p1, p2, sentido: 'A' (se acerca al pie de A) | 'B' | 'quieto',
 *                               errores: quieto ('quieto'), contrario (el otro sentido), puntoMedio ('medio') }.
 *   ingreso({ p0, q0, dp, dq, u })   precio que cambia: por cada «paso» u (u > 0 sube, u < 0 baja; puede ser
 *                               fraccionario) el precio sube dp y la cantidad vendida baja dq.
 *                               { u, precio: p0 + dp·u, cantidad: q0 − dq·u, ingreso: precio·cantidad }.
 *                               p0, q0, dp, dq positivos.
 *   ingresoMaximo({ p0, q0, dp, dq })   el paso u que da el mayor ingreso: u = (dp·q0 − dq·p0)/(2·dp·dq).
 *                               { u, precio, cantidad, ingreso, ceros: { precio: −p0/dp (u donde el precio es 0),
 *                               cantidad: q0/dq (u donde nadie compra) }, errores (precios): noCambiar (p0),
 *                               igualarFactores (el precio con que precio = cantidad: u = (q0 − p0)/(dp + dq)) y
 *                               hastaLaMitad (va la mitad del camino entre hoy, u = 0, y el cero que queda hacia donde
 *                               conviene moverse); erroresIngreso: el ingreso de cada error, con las mismas claves }.
 *   rueda(n)                    mapa de una pileta (región 0) rodeada por n jardines en ronda (1 a n; n ≥ 3): cada
 *                               jardín toca la pileta y a sus dos vecinos de ronda. { regiones: n + 1, vecinos: [[i, j]] }.
 *   tablero({ filas, columnas, esquinas })   casillas de un tablero (numeradas por filas desde 0); son vecinas las que
 *                               comparten un lado, y también las que se tocan por una esquina si esquinas es true.
 *                               { regiones, vecinos }.
 *   minimoColores({ regiones, vecinos })   el menor número de colores con que se pintan las regiones (0 a regiones − 1;
 *                               hasta 12) sin que dos vecinas compartan color, por fuerza bruta: prueba todas las
 *                               formas con 1, 2, 3… colores. { colores, ejemplo (una pintura válida: lista de colores
 *                               0 a colores − 1, la primera en orden lexicográfico), formas (cuántas pinturas válidas
 *                               hay con exactamente esa cantidad de colores disponibles, contando cada asignación),
 *                               probadas ((colores − 1)^regiones: las formas con un color menos, todas con choque),
 *                               errores: unoPorRegion (regiones), alternarDos (2), tresBastan (3),
 *                               siempreCuatro (4) }.
 *   revisarPintura({ regiones, vecinos, colores })   colores: lista con un número ≥ 0 o null (sin pintar) por región.
 *                               { conflictos: [[i, j]] (vecinas del mismo color), sinPintar, usados (colores
 *                               distintos), valida (todas pintadas y sin conflictos) }.
 *   fraccion(x)                 { num, den, entero, resto, texto ('40/3' o '7'), mixto ('13 1/3') } si x es una
 *                               fracción de denominador ≤ 1000 (con tolerancia 1e-9); si no, null.
 *   radical(n)                  √n simplificada para n entero ≥ 0: { coef, rad, texto ('6√5', '10', '√61'), valor };
 *                               si n no es entero, null.
 *
 * Respaldos (docs/investigacion/): «todos encierran lo mismo» y «todos usan la misma malla» son GE5 de
 * geometria-ideas-erroneas.md (parcial: D'Amore y Fandiño Pinilla, 2007, sin cifra); el área que se duplica con el
 * cordel es AR7 de aritmetica-razonamiento-ideas-erroneas.md (ilusión de linealidad, documentada con áreas de figuras
 * semejantes). Todo lo demás son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMaximos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  function objeto(o, que) {
    if (!o || typeof o !== 'object') throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  // Redondea el ruido de coma flotante cerca de un número con hasta 6 decimales.
  function limpio(x) {
    if (typeof x !== 'number') return x;
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-11 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const casi = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  function igual(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return casi(a, b);
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      if ('area' in a && 'area' in b) return casi(a.x, b.x) && casi(a.area, b.area);
      if ('producto' in a && 'producto' in b) return casi(a.producto, b.producto);
    }
    return a === b;
  }
  function apartar(errores, correcto) {
    const e = {}, coinciden = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      const antes = Object.keys(e).find(j => igual(e[j], v));
      if (antes) { repetidos[k] = antes; continue; }
      e[k] = typeof v === 'number' ? limpio(v) : v;
    }
    return { errores: e, coinciden, repetidos };
  }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // ---------- Exactos ----------
  function fraccion(x) {
    numero(x, 'el número');
    for (let den = 1; den <= 1000; den++) {
      const num = Math.round(x * den);
      if (Math.abs(num / den - x) <= 1e-9 * Math.max(1, Math.abs(x))) {
        const g = mcd(num, den) || 1, n = num / g, d = den / g;
        const entero = Math.trunc(n / d), resto = Math.abs(n - entero * d);
        return { num: n, den: d, entero, resto, texto: d === 1 ? String(n) : `${n}/${d}`,
          mixto: d === 1 ? String(n) : (entero ? `${entero} ${resto}/${d}` : `${n < 0 ? '−' : ''}${resto}/${d}`) };
      }
    }
    return null;
  }
  function radical(n) {
    numero(n, 'el número bajo la raíz', { noNegativo: true });
    const m = Math.round(n);
    if (Math.abs(m - n) > 1e-9) return null;
    let coef = 1, rad = m;
    for (let f = 2; f * f <= rad; f++) while (rad % (f * f) === 0) { rad /= f * f; coef *= f; }
    const texto = rad === 1 ? String(coef) : (coef === 1 ? `√${rad}` : `${coef}√${rad}`);
    return { coef, rad, texto, valor: coef * Math.sqrt(rad) };
  }
  // Texto exacto de un número que puede ser racional o la raíz de un racional entero.
  function exactoDe(x) {
    const f = fraccion(x); if (f) return f.texto;
    const r = radical(x * x); if (r) return r.texto;
    return null;
  }
  // Texto de una suma de raíces (de enteros) y enteros, si todos se pueden escribir exactos.
  function sumaExacta(cuadrados) {
    const partes = [];
    let entero = 0;
    for (const c of cuadrados) {
      const r = radical(c); if (!r) return null;
      if (r.rad === 1) entero += r.coef; else partes.push(r.texto);
    }
    if (entero) partes.unshift(String(entero));
    return partes.length ? partes.join(' + ') : '0';
  }

  // ---------- Rectángulos ----------
  function rectangulo(o) {
    objeto(o, 'rectangulo');
    const P = numero(o.perimetro, 'el perímetro', { positivo: true }), x = numero(o.ancho, 'el ancho', { positivo: true });
    if (!(x < P / 2 - EPS)) throw new Error('el ancho debe ser menor que la mitad del perímetro');
    const y = limpio(P / 2 - x);
    return { ancho: x, largo: y, area: limpio(x * y), perimetro: P, semisuma: limpio(P / 2) };
  }
  function rectanguloArea(o) {
    objeto(o, 'rectanguloArea');
    const A = numero(o.area, 'el área', { positivo: true }), x = numero(o.ancho, 'el ancho', { positivo: true });
    const y = limpio(A / x);
    return { ancho: x, largo: y, area: A, perimetro: limpio(2 * (x + y)) };
  }
  function productoMaximo(o) {
    objeto(o, 'productoMaximo');
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { positivo: true }), t = numero(o.total, 'el total', { positivo: true });
    const x = limpio(t / (2 * a)), y = limpio(t / (2 * b)), producto = limpio(t * t / (4 * a * b));
    const xi = limpio(t / (a + b));
    const { errores, coinciden, repetidos } = apartar({ factoresIguales: { x: xi, y: xi, producto: limpio(xi * xi) } }, { producto });
    return { x, y, producto, parte: limpio(t / 2), exacto: exactoDe(producto), errores, coinciden, repetidos };
  }
  function compararRectangulos(o) {
    objeto(o, 'compararRectangulos');
    if (o.tipo !== 'perimetro' && o.tipo !== 'area') throw new Error("el tipo debe ser 'perimetro' o 'area'");
    const v = numero(o.valor, 'el valor', { positivo: true });
    if (!Array.isArray(o.anchos) || o.anchos.length < 2 || o.anchos.length > 6) throw new Error('anchos debe ser una lista de 2 a 6 anchos');
    const rs = o.anchos.map(x => o.tipo === 'perimetro' ? rectangulo({ perimetro: v, ancho: x }) : rectanguloArea({ area: v, ancho: x }));
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) if (casi(rs[i].ancho, rs[j].ancho)) throw new Error('los anchos deben ser distintos');
    const medida = r => (o.tipo === 'perimetro' ? r.area : -r.perimetro);
    const mejorR = rs.reduce((m, r) => (medida(r) > medida(m) + EPS ? r : m), rs[0]);
    const iguales = rs.every(r => casi(medida(r), medida(rs[0])));
    if (rs.filter(r => casi(medida(r), medida(mejorR))).length > 1) throw new Error('hay dos rectángulos empatados como el mejor');
    const razon = r => Math.max(r.ancho, r.largo) / Math.min(r.ancho, r.largo);
    const alargado = rs.reduce((m, r) => (razon(r) > razon(m) + EPS ? r : m), rs[0]);
    const inter = rs.find(r => r !== mejorR && r !== alargado);
    const { errores, coinciden, repetidos } = apartar({ masAlargado: alargado.ancho, intermedio: inter ? inter.ancho : null, todosIguales: 'todos' }, mejorR.ancho);
    return { rectangulos: rs.map(r => ({ ancho: r.ancho, largo: r.largo, area: r.area, perimetro: r.perimetro })),
      mejor: mejorR.ancho, optimo: limpio(o.tipo === 'perimetro' ? v / 4 : Math.sqrt(v)), iguales, errores, coinciden, repetidos };
  }
  function escalarCorral(o) {
    objeto(o, 'escalarCorral');
    const P = numero(o.perimetro, 'el perímetro', { positivo: true }), f = numero(o.factor, 'el factor', { positivo: true });
    const lado = limpio(P / 4), ladoNuevo = limpio(P * f / 4), area = limpio(lado * lado), areaNueva = limpio(ladoNuevo * ladoNuevo);
    const { errores, coinciden, repetidos } = apartar({ lineal: area * f, aditiva: area + P * (f - 1) }, areaNueva);
    return { lado, ladoNuevo, area, areaNueva, razon: limpio(f * f), errores, coinciden, repetidos };
  }
  function sumaMinima(o) {
    objeto(o, 'sumaMinima');
    const P = numero(o.producto, 'el producto', { positivo: true });
    const x = limpio(Math.sqrt(P)), suma = limpio(2 * Math.sqrt(P));
    const { errores, coinciden, repetidos } = apartar({ unoYTodo: 1 + P, dosYMitad: 2 + P / 2 }, suma);
    return { x, y: x, suma, exacto: exactoDe(suma), errores, coinciden, repetidos };
  }

  // ---------- Contra la pared ----------
  function tramosDe(t) { return t === undefined ? 2 : numero(t, 'los tramos', { entero: true, min: 2 }); }
  function pared(o) {
    objeto(o, 'pared');
    const L = numero(o.malla, 'la malla', { positivo: true }), x = numero(o.x, 'x', { positivo: true }), n = tramosDe(o.tramos);
    if (!(x < L / n - EPS)) throw new Error(`x debe ser menor que la malla entre ${n}`);
    const paralelo = limpio(L - n * x);
    return { x, paralelo, area: limpio(x * paralelo), malla: L, tramos: n };
  }
  function paredMaxima(o) {
    objeto(o, 'paredMaxima');
    const L = numero(o.malla, 'la malla', { positivo: true }), n = tramosDe(o.tramos);
    const x = limpio(L / (2 * n)), paralelo = limpio(L / 2), area = limpio(L * L / (4 * n));
    const caso = (xx, yy) => ({ x: limpio(xx), paralelo: limpio(yy), area: limpio(xx * yy), exacto: { x: exactoDe(xx), paralelo: exactoDe(yy), area: exactoDe(xx * yy) } });
    const q = L / (n + 1), r = L / (2 * n + 1);
    const { errores, coinciden, repetidos } = apartar({ cuadrado: caso(q, q), comoCorralLibre: n === 2 ? caso(L / 4, L / 4) : null, alReves: caso(2 * r, r) }, { x, area });
    const res = { x, paralelo, area, exacto: { x: exactoDe(x), paralelo: exactoDe(paralelo), area: exactoDe(area) }, errores, coinciden, repetidos };
    if (n === 2) res.reflejo = { alto: limpio(2 * x), largo: paralelo, perimetro: limpio(2 * L), area: limpio(2 * area) };
    return res;
  }

  // ---------- El río ----------
  function datosRio(o, que) {
    objeto(o, que);
    return { a: numero(o.a, 'a (distancia de A a la orilla)', { positivo: true }), b: numero(o.b, 'b (distancia de B a la orilla)', { positivo: true }),
      d: numero(o.d, 'd (separación a lo largo de la orilla)', { noNegativo: true }) };
  }
  function recorrido(o) {
    const { a, b, d } = datosRio(o, 'recorrido'), p = numero(o.p, 'p');
    const AP = Math.hypot(p, a), PB = Math.hypot(d - p, b);
    return { AP: limpio(AP), PB: limpio(PB), total: limpio(AP + PB), ABprima: limpio(Math.hypot(d, a + b)), directo: limpio(Math.hypot(d, a - b)) };
  }
  function recorridoMinimo(o) {
    const { a, b, d } = datosRio(o, 'recorridoMinimo');
    const p = a * d / (a + b), minimo = Math.hypot(d, a + b);
    const tot = q => Math.hypot(q, a) + Math.hypot(d - q, b);
    const exTot = q => sumaExacta([q * q + a * a, (d - q) * (d - q) + b * b]);
    const crudos = { perpendicularA: tot(0), perpendicularB: tot(d), puntoMedio: tot(d / 2), sumaPerpendiculares: a + b, porLaOrilla: a + d + b };
    const { errores, coinciden, repetidos } = apartar(crudos, minimo);
    const exactos = {};
    const txt = { perpendicularA: exTot(0), perpendicularB: exTot(d), puntoMedio: exTot(d / 2), sumaPerpendiculares: exactoDe(a + b), porLaOrilla: exactoDe(a + d + b) };
    for (const k of Object.keys(errores)) exactos[k] = txt[k];
    return { p: limpio(p), pExacto: exactoDe(p), AP: limpio(Math.hypot(p, a)), PB: limpio(Math.hypot(d - p, b)), minimo: limpio(minimo),
      exacto: radical(d * d + (a + b) * (a + b)) ? radical(d * d + (a + b) * (a + b)).texto : exactoDe(minimo),
      angulo: limpio(d === 0 ? 90 : Math.atan((a + b) / d) * 180 / Math.PI), reflejo: { x: d, y: -b }, errores, exactos, coinciden, repetidos };
  }
  function moverPunto(o) {
    const { a, b, d } = datosRio(o, 'moverPunto');
    const b2 = numero(o.b2, 'b2 (la nueva distancia de B)', { positivo: true });
    if (!(d > 0)) throw new Error('d debe ser mayor que cero para que P se pueda mover');
    const p1 = a * d / (a + b), p2 = a * d / (a + b2);
    const sentido = casi(p1, p2) ? 'quieto' : (p2 < p1 ? 'A' : 'B');
    const contrario = sentido === 'A' ? 'B' : sentido === 'B' ? 'A' : null;
    const { errores, coinciden, repetidos } = apartar({ quieto: 'quieto', contrario, puntoMedio: 'medio' }, sentido);
    return { p1: limpio(p1), p2: limpio(p2), sentido, errores, coinciden, repetidos };
  }

  // ---------- El precio ----------
  function datosPrecio(o, que) {
    objeto(o, que);
    return { p0: numero(o.p0, 'el precio de hoy (p0)', { positivo: true }), q0: numero(o.q0, 'la cantidad de hoy (q0)', { positivo: true }),
      dp: numero(o.dp, 'el cambio de precio por paso (dp)', { positivo: true }), dq: numero(o.dq, 'el cambio de cantidad por paso (dq)', { positivo: true }) };
  }
  function ingreso(o) {
    const { p0, q0, dp, dq } = datosPrecio(o, 'ingreso'), u = numero(o.u, 'u (los pasos)');
    const precio = limpio(p0 + dp * u), cantidad = limpio(q0 - dq * u);
    return { u, precio, cantidad, ingreso: limpio(precio * cantidad) };
  }
  function ingresoMaximo(o) {
    const D = datosPrecio(o, 'ingresoMaximo'), { p0, q0, dp, dq } = D;
    const u = (dp * q0 - dq * p0) / (2 * dp * dq);
    const R = ingreso(Object.assign({}, D, { u: limpio(u) }));
    const ceros = { precio: limpio(-p0 / dp), cantidad: limpio(q0 / dq) };
    const uIg = (q0 - p0) / (dp + dq);
    const uMit = u > EPS ? ceros.cantidad / 2 : (u < -EPS ? ceros.precio / 2 : null);
    const precioDe = x => limpio(p0 + dp * x);
    const crudos = { noCambiar: p0, igualarFactores: precioDe(uIg), hastaLaMitad: uMit === null ? null : precioDe(uMit) };
    const { errores, coinciden, repetidos } = apartar(crudos, R.precio);
    const erroresIngreso = {};
    for (const [k, pr] of Object.entries(errores)) erroresIngreso[k] = ingreso(Object.assign({}, D, { u: (pr - p0) / dp })).ingreso;
    return { u: R.u, precio: R.precio, cantidad: R.cantidad, ingreso: R.ingreso, ceros, errores, erroresIngreso, coinciden, repetidos };
  }

  // ---------- Mapas ----------
  function rueda(n) {
    numero(n, 'los jardines', { entero: true, min: 3, max: 11 });
    const vecinos = [];
    for (let i = 1; i <= n; i++) vecinos.push([0, i]);
    for (let i = 1; i <= n; i++) vecinos.push([i, i === n ? 1 : i + 1].sort((x, y) => x - y));
    return { regiones: n + 1, vecinos };
  }
  function tablero(o) {
    objeto(o, 'tablero');
    const f = numero(o.filas, 'las filas', { entero: true, min: 1 }), c = numero(o.columnas, 'las columnas', { entero: true, min: 1 });
    if (f * c > 12) throw new Error('el tablero puede tener como mucho 12 casillas');
    const vecinos = [], id = (i, j) => i * c + j;
    for (let i = 0; i < f; i++) for (let j = 0; j < c; j++) {
      if (j + 1 < c) vecinos.push([id(i, j), id(i, j + 1)]);
      if (i + 1 < f) vecinos.push([id(i, j), id(i + 1, j)]);
      if (o.esquinas && i + 1 < f && j + 1 < c) vecinos.push([id(i, j), id(i + 1, j + 1)]);
      if (o.esquinas && i + 1 < f && j > 0) vecinos.push([id(i, j), id(i + 1, j - 1)].sort((x, y) => x - y));
    }
    return { regiones: f * c, vecinos };
  }
  function grafo(o, que) {
    objeto(o, que);
    const n = numero(o.regiones, 'las regiones', { entero: true, min: 1, max: 12 });
    if (!Array.isArray(o.vecinos)) throw new Error('vecinos debe ser una lista de pares');
    for (const v of o.vecinos) {
      if (!Array.isArray(v) || v.length !== 2 || !v.every(k => Number.isInteger(k) && k >= 0 && k < n)) throw new Error(`par de vecinos inválido: ${JSON.stringify(v)}`);
      if (v[0] === v[1]) throw new Error('una región no puede ser vecina de sí misma');
    }
    return { n, vecinos: o.vecinos };
  }
  function choca(vecinos, col) { return vecinos.some(([i, j]) => col[i] !== null && col[i] === col[j]); }
  function minimoColores(o) {
    const { n, vecinos } = grafo(o, 'minimoColores');
    for (let k = 1; k <= n; k++) {
      const col = new Array(n).fill(0);
      let formas = 0, ejemplo = null;
      // todas las asignaciones de k colores, en orden lexicográfico (fuerza bruta: k^n)
      for (;;) {
        if (!choca(vecinos, col)) { formas++; if (!ejemplo) ejemplo = col.slice(); }
        let i = n - 1;
        while (i >= 0 && col[i] === k - 1) { col[i] = 0; i--; }
        if (i < 0) break;
        col[i]++;
      }
      if (formas) {
        const { errores, coinciden, repetidos } = apartar({ unoPorRegion: n, alternarDos: 2, tresBastan: 3, siempreCuatro: 4 }, k);
        return { colores: k, ejemplo, formas, probadas: Math.pow(k - 1, n), errores, coinciden, repetidos };
      }
    }
    throw new Error('no se pudo pintar');   // no pasa: con n colores siempre se puede
  }
  function revisarPintura(o) {
    const { n, vecinos } = grafo(o, 'revisarPintura');
    if (!Array.isArray(o.colores) || o.colores.length !== n) throw new Error('colores debe tener un valor por región');
    const col = o.colores.map(c => (c === null || c === undefined ? null : numero(c, 'un color', { entero: true, noNegativo: true })));
    const conflictos = vecinos.filter(([i, j]) => col[i] !== null && col[i] === col[j]).map(v => v.slice());
    const sinPintar = col.filter(c => c === null).length, usados = new Set(col.filter(c => c !== null)).size;
    return { conflictos, sinPintar, usados, valida: !conflictos.length && !sinPintar };
  }

  return { fraccion, radical, rectangulo, rectanguloArea, productoMaximo, compararRectangulos, escalarCorral, sumaMinima,
    pared, paredMaxima, recorrido, recorridoMinimo, moverPunto, ingreso, ingresoMaximo, rueda, tablero, minimoColores, revisarPintura };
});
