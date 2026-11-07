/*
 * Motor de «Las fichas que se cambian»: razonamiento numérico.
 *
 * CABECERA: fr, frTexto, numTexto, suma, resta, prod, divi, falsaSuposicion, contarCorral, corral, corralAlReves, examen, textoOp, aplicar, invertir,
 *           regresivo, barras, ordenCambiado, mercado, TABLEROS, tablero, distribuir, comprobar, menorSuma, subirTodos,
 *           subirFichas, centroMagico, cuadradosDistintos, corralGeo, mitadDe, examenGeo, tiraGeo, tableroGeo, cercana, pl
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorRazonamientoNumerico) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo es exacto: enteros y fracciones (numerador y denominador enteros, sin decimales de coma flotante).
 *
 * Las tres ideas de la escena:
 *   1. Falsa suposición. Un corral con gallinas (2 patas) y conejos (4 patas): se supone que todos son de un tipo,
 *      se cuenta lo que falta (o sobra) para llegar al total y se cambian fichas una por una; cada cambio mueve el
 *      total en la diferencia entre los dos tipos. Lo mismo con un examen de +4 por buena y −1 por mala.
 *   2. Método regresivo (del cangrejo). Una cadena de operaciones con su resultado final se recorre de atrás hacia
 *      adelante: cada operación se deshace con su contraria (× con ÷, + con −), empezando por la última.
 *   3. Distribuciones numéricas. Fichas numeradas en las casillas de un tablero (triángulo de 3 o 4 por lado, cuadrado
 *      mágico 3 × 3) con la misma suma en cada línea; el motor prueba todas las formas (fuerza bruta), cuenta las
 *      soluciones y las agrupa por giros y reflejos.
 *
 * Números
 *   fr(n, d)                     fracción irreducible { n, d } con d > 0 (enteros seguros)
 *   frTexto(f), numTexto(x)      «16», «−3», «77/2»; números con coma decimal
 * Falsa suposición
 *   falsaSuposicion(total, valorTotal, vSupuesto, vOtro)   supone que los «total» son del tipo que vale vSupuesto:
 *                                base, falta (valorTotal − base, con signo), diferencia (vOtro − vSupuesto), otros (los del
 *                                otro tipo), supuestos, cambios (el total después de cada cambio) y, si no hay reparto entero
 *                                entre 0 y total, posible: false con la razón
 *   contarCorral(fichas)         cabezas, gallinas, conejos y patas de una lista de fichas ('g' o 'c')
 *   corral(animales, patas)      predicción: ¿cuántos conejos? (supone que todos son gallinas)
 *   corralAlReves(animales, patas)   lo mismo suponiendo que todos son conejos (el cociente da las gallinas)
 *   examen(preguntas, puntaje, buena, mala)   ¿cuántas buenas? (supone que todas son buenas; cada mala quita buena − mala)
 * Método regresivo (una operación es { op: 'mas'|'menos'|'por'|'entre', k } o { op: 'gasta', parte: [p, q], mas: k }:
 * «gastó p/q de lo que tenía y k más»; con k negativo, «k menos»)
 *   textoOp(op), aplicar(op, x), invertir(op)    la operación escrita, aplicada a x y su contraria (una lista de simples)
 *   regresivo(cadena, final)     el número de partida, los valores de ida, los pasos de vuelta y los errores
 *   barras(cadena, inicio)       para dibujar «gastó»: lo que tenía, la parte, el extra y lo que le quedó en cada tramo
 *   ordenCambiado(cadena, final, i)   la misma cadena con las operaciones i e i + 1 intercambiadas
 *   mercado(cadena, final)       predicción de «gastó la mitad y k más»: el error de deshacer en el orden equivocado
 * Distribuciones
 *   TABLEROS, tablero(tipo)      casillas, líneas (listas de casillas), simetrías (giros y reflejos) y casillas compartidas
 *   distribuir(tipo, numeros)    fuerza bruta: soluciones, sumas posibles, cuántas hay de cada suma y cuántas sin contar
 *                                giros y reflejos (y solo giros), con una solución de muestra por suma, y qué fichas
 *                                pueden ir en cada casilla (posibles)
 *   comprobar(tipo, colocacion)  la suma de cada línea (null si falta una ficha), si están completas e iguales
 *   menorSuma(tipo, numeros), subirTodos(tipo, numeros, delta), subirFichas(tipo, colocacion, delta), centroMagico(),
 *   cuadradosDistintos()         predicciones
 * Para el dibujo (la escena solo pinta)
 *   corralGeo(n, W, H, o), examenGeo(n, W, H, o), tiraGeo(nOps, W, H, o), tableroGeo(tipo, W, H, o), cercana(puntos, p, r)
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta (o lo mismo
 * que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * El informe de aritmética (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) no trae errores de estos temas:
 * todos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorRazonamientoNumerico = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- fracciones exactas ----------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function fr(n, d) {
    if (d === undefined) d = 1;
    if (typeof n === 'object') return fr(n.n, n.d * d);
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('las fracciones van con enteros');
    if (d === 0) throw new Error('división entre cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  const F = x => (typeof x === 'object' ? x : fr(x));
  const suma = (a, b) => { a = F(a); b = F(b); return fr(a.n * b.d + b.n * a.d, a.d * b.d); };
  const resta = (a, b) => { a = F(a); b = F(b); return fr(a.n * b.d - b.n * a.d, a.d * b.d); };
  const prod = (a, b) => { a = F(a); b = F(b); return fr(a.n * b.n, a.d * b.d); };
  const divi = (a, b) => { a = F(a); b = F(b); if (b.n === 0) throw new Error('división entre cero'); return fr(a.n * b.d, a.d * b.n); };
  const entero = f => F(f).d === 1;
  const menos = t => String(t).replace(/^-/, '−');
  const numTexto = x => menos(String(x).replace('.', ','));
  const frTexto = f => { f = F(f); return f.d === 1 ? menos(String(f.n)) : menos(f.n + '/' + f.d); };
  // valor para afuera: número si es entero, texto «a/b» si no
  const valor = f => (entero(f) ? F(f).n : frTexto(f));
  const pl = (n, uno, varios) => (Math.abs(n) === 1 ? uno : varios);

  function limpiar(errores, correcta) {
    const k = v => JSON.stringify(v), out = {}, vistos = new Set([k(correcta)]);
    for (const [c, v] of Object.entries(errores)) {
      if (v === null || v === undefined) continue;
      if (!vistos.has(k(v))) { vistos.add(k(v)); out[c] = v; }
    }
    return out;
  }
  const ent = (x, que) => { if (!Number.isInteger(x)) throw new Error(`${que} debe ser un entero`); return x; };

  // ---------- falsa suposición ----------
  function falsaSuposicion(total, valorTotal, vSupuesto, vOtro) {
    ent(total, 'el total'); ent(valorTotal, 'el valor total'); ent(vSupuesto, 'el valor de cada uno'); ent(vOtro, 'el valor de cada uno');
    if (total < 0) throw new Error('el total no puede ser negativo');
    const base = total * vSupuesto, falta = valorTotal - base, diferencia = vOtro - vSupuesto;
    const r = { total, valorTotal, vSupuesto, vOtro, base, falta, diferencia };
    if (diferencia === 0) return Object.assign(r, { posible: false, razon: 'Los dos tipos valen lo mismo: cambiar uno por otro no mueve el total.' });
    if (falta % diferencia !== 0) {
      const q = divi(falta, diferencia);
      return Object.assign(r, { posible: false, cociente: frTexto(q), abajo: Math.floor(q.n / q.d), arriba: Math.ceil(q.n / q.d),
        razon: `${numTexto(Math.abs(falta))} no se reparte en cambios de ${numTexto(Math.abs(diferencia))}: ${numTexto(falta)} ÷ ${numTexto(diferencia)} no es un número entero, así que ningún reparto da exactamente ${numTexto(valorTotal)}.` });
    }
    const otros = falta / diferencia + 0;
    if (otros < 0 || otros > total) return Object.assign(r, { posible: false, otros,
      razon: otros < 0 ? `Saldrían ${numTexto(otros)} del otro tipo: con ${total} el total no puede ser ${numTexto(valorTotal)}.`
        : `Saldrían ${otros} del otro tipo, más que los ${total} que hay en total.` });
    const cambios = [];
    for (let i = 0; i <= otros; i++) cambios.push(base + i * diferencia);
    return Object.assign(r, { posible: true, otros, supuestos: total - otros, cambios });
  }
  function contarCorral(fichas) {
    let g = 0, c = 0;
    for (const f of fichas) { const t = typeof f === 'string' ? f : f.tipo; if (t === 'g') g++; else if (t === 'c') c++; else throw new Error('cada ficha es g (gallina) o c (conejo)'); }
    return { cabezas: g + c, gallinas: g, conejos: c, patas: 2 * g + 4 * c };
  }
  // ¿Cuántos conejos? Se supone que todos son gallinas: faltan patas, y cada cambio de gallina por conejo agrega 2.
  function corral(animales, patas) {
    const R = falsaSuposicion(animales, patas, 2, 4);
    const base = { animales, patas, supuestoTotal: R.base, faltan: R.falta, diferencia: 2, posible: R.posible };
    if (!R.posible) return Object.assign(base, { razon: R.razon, abajo: R.abajo, arriba: R.arriba,
      errores: R.abajo !== undefined ? limpiar({ trunca: R.abajo, redondea: R.arriba }, null) : {} });
    const conejos = R.otros, gallinas = R.supuestos;
    return Object.assign(base, { respuesta: conejos, conejos, gallinas, cambios: R.cambios,
      errores: limpiar({ daLosSupuestos: gallinas, faltanSinDividir: R.falta, divideEntreElOtro: R.falta % 4 === 0 ? R.falta / 4 : null }, conejos) });
  }
  // Suponiendo que todos son conejos: sobran patas, y cada cambio de conejo por gallina quita 2. El cociente da las gallinas.
  function corralAlReves(animales, patas) {
    const R = falsaSuposicion(animales, patas, 4, 2);
    if (!R.posible) throw new Error(R.razon);
    const gallinas = R.otros, conejos = R.supuestos, sobran = -R.falta + 0;
    return { animales, patas, supuestoTotal: R.base, sobran, diferencia: 2, gallinas, conejos, respuesta: conejos, cambios: R.cambios,
      errores: limpiar({ leeElCocienteComoConejos: gallinas, sobranSinDividir: sobran, divideEntreElSupuesto: sobran % 4 === 0 ? sobran / 4 : null }, conejos) };
  }
  // Un examen sin preguntas en blanco: buena puntos por correcta y mala (negativo) por incorrecta. Se supone que todas son buenas.
  function examen(preguntas, puntaje, buena, mala) {
    if (buena === undefined) buena = 4;
    if (mala === undefined) mala = -1;
    const R = falsaSuposicion(preguntas, puntaje, buena, mala);
    if (!R.posible) throw new Error(R.razon);
    const incorrectas = R.otros, correctas = R.supuestos, sobran = -R.falta + 0, quita = buena - mala;
    const resta = buena + mala;   // el error de «4 − 1»: restar los puntos en vez de juntarlos
    return { preguntas, puntaje, buena, mala, supuestoTotal: R.base, sobran, quita, correctas, incorrectas, respuesta: correctas, cambios: R.cambios,
      errores: limpiar({
        daLasIncorrectas: incorrectas,
        sinDescuento: puntaje % buena === 0 ? puntaje / buena : null,
        restaLosPuntos: resta > 0 && sobran % resta === 0 ? preguntas - sobran / resta : null }, correctas) };
  }

  // ---------- método regresivo ----------
  const OPS = ['mas', 'menos', 'por', 'entre', 'gasta'];
  function validar(o) {
    if (!o || !OPS.includes(o.op)) throw new Error('operación desconocida');
    if (o.op === 'gasta') {
      const [p, q] = o.parte || [];
      if (!Number.isInteger(p) || !Number.isInteger(q) || p <= 0 || q <= p) throw new Error('la parte que gasta debe ser una fracción entre 0 y 1');
      ent(o.mas || 0, 'lo que gasta de más');
    } else {
      const k = F(o.k);
      if ((o.op === 'por' || o.op === 'entre') && k.n === 0) throw new Error('no se multiplica ni se divide entre cero');
    }
    return o;
  }
  const PARTES = { '1/2': 'la mitad', '1/3': 'la tercera parte', '2/3': 'las dos terceras partes', '1/4': 'la cuarta parte', '3/4': 'las tres cuartas partes', '1/5': 'la quinta parte', '2/5': 'las dos quintas partes' };
  const parteTexto = ([p, q]) => PARTES[p + '/' + q] || `${p}/${q}`;
  function textoOp(o) {
    validar(o);
    if (o.op === 'gasta') {
      const m = o.mas || 0;
      return `gasta ${parteTexto(o.parte)}` + (m > 0 ? ` y ${m} más` : m < 0 ? ` menos ${-m}` : '');
    }
    const k = frTexto(o.k);
    return { mas: '+ ', menos: '− ', por: '× ', entre: '÷ ' }[o.op] + k;
  }
  function aplicar(o, x) {
    validar(o);
    if (o.op === 'mas') return suma(x, o.k);
    if (o.op === 'menos') return resta(x, o.k);
    if (o.op === 'por') return prod(x, o.k);
    if (o.op === 'entre') return divi(x, o.k);
    const [p, q] = o.parte;
    return resta(prod(x, fr(q - p, q)), o.mas || 0);
  }
  const CONTRARIA = { mas: 'menos', menos: 'mas', por: 'entre', entre: 'por' };
  // La contraria como lista de operaciones simples (la de «gasta» son dos: devolver lo de más y después dividir entre lo que quedó)
  function invertir(o) {
    validar(o);
    if (o.op !== 'gasta') return [{ op: CONTRARIA[o.op], k: o.k }];
    const [p, q] = o.parte, m = o.mas || 0, out = [];
    if (m > 0) out.push({ op: 'mas', k: m });
    if (m < 0) out.push({ op: 'menos', k: -m });
    out.push({ op: 'por', k: fr(q, q - p) });
    return out;
  }
  const aplicarLista = (ops, x) => ops.reduce((v, o) => aplicar(o, v), F(x));
  function regresivo(cadena, final) {
    if (!Array.isArray(cadena) || !cadena.length) throw new Error('la cadena necesita al menos una operación');
    cadena.forEach(validar);
    const vuelta = [];
    let y = F(final);
    for (let i = cadena.length - 1; i >= 0; i--) {
      const inv = invertir(cadena[i]), de = y, pasos = [];
      for (const o of inv) { const a = aplicar(o, y); pasos.push({ op: o, texto: textoOp(o), de: valor(y), a: valor(a) }); y = a; }
      vuelta.push({ i, ida: textoOp(cadena[i]), de: valor(de), a: valor(y), pasos, texto: pasos.map(p => p.texto).join(', ') });
    }
    const inicio = y, ida = [valor(inicio)];
    let x = inicio;
    for (const o of cadena) { x = aplicar(o, x); ida.push(valor(x)); }
    if (resta(x, final).n !== 0) throw new Error('la vuelta no devuelve el final');
    // errores
    const adelante = cadena.reduce((v, o) => aplicar(o, v), F(final));
    const ordenSinInvertir = cadena.slice().reverse().reduce((v, o) => aplicar(o, v), F(final));
    const sinOrden = cadena.reduce((v, o) => aplicarLista(invertir(o), v), F(final));
    const errores = { haciaAdelante: valor(adelante), ordenSinInvertir: valor(ordenSinInvertir), invierteSinOrden: valor(sinOrden) };
    if (cadena.some(o => o.op === 'gasta')) Object.assign(errores, erroresGasta(cadena, final));
    const respuesta = valor(inicio);
    return { cadena: cadena.map(textoOp), final: valor(final), respuesta, entero: entero(inicio), ida, vuelta, errores: limpiar(errores, respuesta) };
  }
  // Los errores propios de «gastó la mitad y k más», aplicados a cada tramo de vuelta
  function erroresGasta(cadena, final) {
    const malo = como => cadena.slice().reverse().reduce((y, o) => {
      if (o.op !== 'gasta') return aplicarLista(invertir(o), y);
      const [p, q] = o.parte, m = o.mas || 0, veces = fr(q, q - p);
      if (como === 'alReves') return suma(prod(y, veces), m);        // q·2 + k: primero se dobla y después se devuelve
      if (como === 'restaElExtra') return prod(resta(y, m), veces);   // (q − k)·2: el extra con el signo cambiado
      return prod(y, veces);                                          // q·2: se olvida el extra
    }, F(final));
    return { devuelveDespues: valor(malo('alReves')), restaElExtra: valor(malo('restaElExtra')), olvidaElExtra: valor(malo('olvida')) };
  }
  function barras(cadena, inicio) {
    let x = F(inicio);
    return cadena.map(o => {
      const antes = x; x = aplicar(o, x);
      const t = { op: textoOp(o), antes: valor(antes), despues: valor(x) };
      if (o.op === 'gasta') {
        const [p, q] = o.parte, parte = prod(antes, fr(p, q));
        Object.assign(t, { parte: valor(parte), extra: o.mas || 0, queda: valor(x), parteTexto: parteTexto(o.parte) });
        if (resta(resta(resta(antes, parte), o.mas || 0), x).n !== 0) throw new Error('las barras no cuadran');
      }
      return t;
    });
  }
  function ordenCambiado(cadena, final, i) {
    if (!Number.isInteger(i) || i < 0 || i + 1 >= cadena.length) throw new Error('no hay dos operaciones seguidas en esa posición');
    const otra = cadena.slice(); [otra[i], otra[i + 1]] = [otra[i + 1], otra[i]];
    const A = regresivo(cadena, final), B = regresivo(otra, final);
    return { antes: A.respuesta, respuesta: B.respuesta, cadena: B.cadena, cadenaAntes: A.cadena, vuelta: B.vuelta, ida: B.ida,
      errores: limpiar({ elDeAntes: A.respuesta, haciaAdelante: B.errores.haciaAdelante, ordenSinInvertir: B.errores.ordenSinInvertir }, B.respuesta) };
  }
  function mercado(cadena, final) {
    const R = regresivo(cadena, final);
    if (!cadena.some(o => o.op === 'gasta')) throw new Error('la cadena del mercado lleva al menos un «gasta»');
    const e = R.errores;
    return Object.assign({}, R, { errores: limpiar({ devuelveDespues: e.devuelveDespues, restaElExtra: e.restaElExtra, olvidaElExtra: e.olvidaElExtra }, R.respuesta) });
  }

  // ---------- distribuciones ----------
  function cerrarGrupo(n, generadores) {
    const id = Array.from({ length: n }, (_, i) => i), k = p => p.join(','), vistos = new Map([[k(id), id]]), cola = [id];
    while (cola.length) {
      const a = cola.shift();
      for (const g of generadores) {
        const b = a.map(i => g[i]);
        if (!vistos.has(k(b))) { vistos.set(k(b), b); cola.push(b); }
      }
    }
    return [...vistos.values()];
  }
  function definir(t) {
    const n = t.casillas, cuenta = Array(n).fill(0);
    t.lineas.forEach(L => L.forEach(i => cuenta[i]++));
    const simetrias = cerrarGrupo(n, t.giros.concat(t.reflejos));
    const giros = cerrarGrupo(n, t.giros);
    return Object.assign({}, t, { veces: cuenta, compartidas: cuenta.map((c, i) => (c > 1 ? i : -1)).filter(i => i >= 0), simetrias, soloGiros: giros });
  }
  const TABLEROS = {
    // vértices 0 (arriba), 1 (abajo a la izquierda), 2 (abajo a la derecha); 3 entre 0 y 1, 4 entre 1 y 2, 5 entre 2 y 0
    triangulo3: definir({ nombre: 'triángulo de 3 por lado', casillas: 6, lineas: [[0, 3, 1], [1, 4, 2], [2, 5, 0]],
      giros: [[1, 2, 0, 4, 5, 3]], reflejos: [[0, 2, 1, 5, 4, 3]] }),
    // 3 y 4 entre 0 y 1 (3 cerca de 0), 5 y 6 entre 1 y 2 (5 cerca de 1), 7 y 8 entre 2 y 0 (7 cerca de 2)
    triangulo4: definir({ nombre: 'triángulo de 4 por lado', casillas: 9, lineas: [[0, 3, 4, 1], [1, 5, 6, 2], [2, 7, 8, 0]],
      giros: [[1, 2, 0, 5, 6, 7, 8, 3, 4]], reflejos: [[0, 2, 1, 8, 7, 6, 5, 4, 3]] }),
    // 0 1 2 / 3 4 5 / 6 7 8: filas, columnas y diagonales
    cuadrado3: definir({ nombre: 'cuadrado mágico 3 × 3', casillas: 9,
      lineas: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
      giros: [[2, 5, 8, 1, 4, 7, 0, 3, 6]], reflejos: [[2, 1, 0, 5, 4, 3, 8, 7, 6]] }),
  };
  function tablero(tipo) { const t = TABLEROS[tipo]; if (!t) throw new Error('tablero desconocido: ' + tipo); return t; }
  function numerosValidos(t, numeros) {
    if (!Array.isArray(numeros) || numeros.length !== t.casillas) throw new Error(`el ${t.nombre} lleva ${t.casillas} fichas`);
    numeros.forEach(x => ent(x, 'cada ficha'));
    if (new Set(numeros).size !== numeros.length) throw new Error('las fichas no se repiten');
  }
  const cache = new Map();
  function distribuir(tipo, numeros) {
    const t = tablero(tipo); numerosValidos(t, numeros);
    const clave = tipo + ':' + numeros.slice().sort((a, b) => a - b).join(',');
    if (cache.has(clave)) return cache.get(clave);
    const n = t.casillas, usado = Array(n).fill(false), col = Array(n).fill(0), sols = [], posibles = Array.from({ length: n }, () => new Set());
    // fuerza bruta: todas las formas de poner las fichas en las casillas
    const probar = i => {
      if (i === n) {
        const s0 = t.lineas[0].reduce((s, j) => s + col[j], 0);
        if (t.lineas.every(L => L.reduce((s, j) => s + col[j], 0) === s0)) { sols.push({ suma: s0, colocacion: col.slice() }); col.forEach((x, j) => posibles[j].add(x)); }
        return;
      }
      for (let j = 0; j < n; j++) if (!usado[j]) { usado[j] = true; col[i] = numeros[j]; probar(i + 1); usado[j] = false; }
    };
    probar(0);
    const total = numeros.reduce((a, b) => a + b, 0);
    const clase = (c, grupo) => grupo.map(g => { const d = Array(n); g.forEach((a, i) => { d[a] = c[i]; }); return d.join(','); }).sort()[0];
    const porSuma = {};
    for (const s of sols) {
      const e = porSuma[s.suma] || (porSuma[s.suma] = { suma: s.suma, soluciones: 0, clases: new Set(), clasesGiros: new Set(), muestra: s.colocacion });
      e.soluciones++; e.clases.add(clase(s.colocacion, t.simetrias)); e.clasesGiros.add(clase(s.colocacion, t.soloGiros));
    }
    const sumas = Object.keys(porSuma).map(Number).sort((a, b) => a - b);
    const detalle = sumas.map(s => {
      const e = porSuma[s], m = e.muestra;
      return { suma: s, soluciones: e.soluciones, distintas: e.clases.size, distintasGiros: e.clasesGiros.size, muestra: m,
        compartidas: t.compartidas.map(i => m[i]), sumaCompartidas: t.compartidas.reduce((a, i) => a + (t.veces[i] - 1) * m[i], 0) };
    });
    const r = { tipo, nombre: t.nombre, numeros: numeros.slice(), total, lineas: t.lineas.length, soluciones: sols.length,
      distintas: detalle.reduce((a, d) => a + d.distintas, 0), sumas, detalle,
      // qué fichas pueden ir en cada casilla en alguna solución
      posibles: posibles.map(S => [...S].sort((a, b) => a - b)),
      menor: sumas.length ? sumas[0] : null, mayor: sumas.length ? sumas[sumas.length - 1] : null,
      // la cuenta de la suma total: cada línea suma S; las casillas compartidas se cuentan más de una vez
      cuenta: detalle.map(d => ({ suma: d.suma, izquierda: t.lineas.length * d.suma, derecha: total + d.sumaCompartidas })) };
    cache.set(clave, r);
    return r;
  }
  // colocacion: la ficha de cada casilla (número o null)
  function comprobar(tipo, colocacion) {
    const t = tablero(tipo);
    if (!Array.isArray(colocacion) || colocacion.length !== t.casillas) throw new Error(`el ${t.nombre} tiene ${t.casillas} casillas`);
    const puestas = colocacion.filter(x => x !== null && x !== undefined);
    puestas.forEach(x => ent(x, 'cada ficha'));
    const repetidas = new Set(puestas).size !== puestas.length;
    const lineas = t.lineas.map(L => {
      const xs = L.map(i => colocacion[i]), completa = xs.every(x => x !== null && x !== undefined);
      return { casillas: L, completa, suma: completa ? xs.reduce((a, b) => a + b, 0) : null, parcial: xs.reduce((a, b) => a + (b == null ? 0 : b), 0) };
    });
    const completas = lineas.filter(l => l.completa), sumas = [...new Set(completas.map(l => l.suma))];
    const completo = puestas.length === t.casillas;
    const iguales = completas.length > 0 && sumas.length === 1;
    return { lineas, puestas: puestas.length, completo, repetidas, iguales, valido: completo && !repetidas && lineas.every(l => l.completa) && iguales,
      suma: completo && iguales ? sumas[0] : null, distintas: sumas.length };
  }
  // ¿La menor suma posible por línea?
  function menorSuma(tipo, numeros) {
    const D = distribuir(tipo, numeros), t = tablero(tipo), k = t.lineas[0].length, orden = numeros.slice().sort((a, b) => a - b);
    const menores = orden.slice(0, k).reduce((a, b) => a + b, 0);
    const m = D.detalle[0];
    return { respuesta: D.menor, mayor: D.mayor, sumas: D.sumas, total: D.total, menores, muestra: m.muestra, vertices: m.compartidas, cuenta: D.cuenta[0],
      soluciones: m.soluciones, distintas: m.distintas,
      errores: limpiar({ losMenores: menores, totalEntreLineas: D.total % t.lineas.length === 0 ? D.total / t.lineas.length : null, laMayor: D.mayor }, D.menor) };
  }
  // Si a cada ficha se le suma delta, cada línea sube delta por cada casilla que tiene
  function subirTodos(tipo, numeros, delta) {
    ent(delta, 'el aumento');
    const t = tablero(tipo), A = distribuir(tipo, numeros), B = distribuir(tipo, numeros.map(x => x + delta)), k = t.lineas[0].length;
    return { antes: A.menor, respuesta: B.menor, sumasAntes: A.sumas, sumas: B.sumas, porLinea: k, sube: B.menor - A.menor,
      errores: limpiar({ sinCambio: A.menor, subeUnaVez: A.menor + delta, porCadaFicha: A.menor + delta * t.casillas }, B.menor) };
  }
  // Una distribución que ya funciona: si a cada ficha se le suma delta y se deja en su casilla, ¿cuánto suma cada línea?
  function subirFichas(tipo, colocacion, delta) {
    ent(delta, 'el aumento');
    const t = tablero(tipo), A = comprobar(tipo, colocacion);
    if (!A.valido) throw new Error('la distribución de partida no tiene todas las líneas iguales');
    const nueva = colocacion.map(x => x + delta), B = comprobar(tipo, nueva), k = t.lineas[0].length;
    return { antes: A.suma, respuesta: B.suma, colocacion: nueva, porLinea: k, sube: B.suma - A.suma,
      errores: limpiar({ sinCambio: A.suma, subeUnaVez: A.suma + delta, porCadaFicha: A.suma + delta * t.casillas }, B.suma) };
  }
  // Cuadrado mágico con 1 a 9: qué números pueden ir en el centro
  function centroMagico() {
    const D = distribuir('cuadrado3', [1, 2, 3, 4, 5, 6, 7, 8, 9]), nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const respuesta = D.posibles[4], constante = D.sumas[0];
    return { respuesta, constante, total: D.total, soluciones: D.soluciones, muestra: D.detalle[0].muestra,
      // las 4 líneas que pasan por el centro suman 4 × 15 = 60: el total 45 más el centro contado 3 veces de más
      porElCentro: 4, cuenta: { izquierda: 4 * constante, total: D.total, centro: (4 * constante - D.total) / 3 },
      errores: limpiar({ elMayor: [9], losImpares: nums.filter(x => x % 2), cualquiera: nums }, respuesta) };
  }
  function cuadradosDistintos() {
    const D = distribuir('cuadrado3', [1, 2, 3, 4, 5, 6, 7, 8, 9]), t = tablero('cuadrado3'), m = D.detalle[0].muestra;
    const vistas = t.simetrias.map(g => { const d = Array(9); g.forEach((a, i) => { d[a] = m[i]; }); return d; });
    const reflejo = cerrarGrupo(9, t.reflejos).length;   // la identidad y un reflejo
    return { respuesta: D.distintas, soluciones: D.soluciones, simetrias: t.simetrias.length, vistas,
      errores: limpiar({ cuentaTodos: D.soluciones, soloGiros: D.detalle[0].distintasGiros, soloUnReflejo: D.soluciones / reflejo }, D.distintas) };
  }

  // ---------- geometría para el dibujo ----------
  // n fichas en una cuadrícula dentro de W × H (o = { arriba, abajo, lado, max }), lo más grandes posible
  function rejilla(n, W, H, o) {
    o = o || {};
    const arriba = o.arriba || 0, abajo = o.abajo || 0, lado = o.lado != null ? o.lado : 8, max = o.max || 18;
    const w = W - 2 * lado, h = H - arriba - abajo;
    let mejor = null;
    for (let cols = 1; cols <= Math.max(1, n); cols++) {
      const filas = Math.ceil(n / cols), r = Math.min(max, w / cols / 2 * 0.84, h / filas / 2 * 0.84);
      if (!mejor || r > mejor.r + 1e-9) mejor = { cols, filas, r };
    }
    const { cols, filas, r } = mejor, cw = w / cols, ch = h / filas, pos = [];
    for (let i = 0; i < n; i++) {
      const fila = Math.floor(i / cols), c = i % cols, enFila = Math.min(cols, n - fila * cols), off = (cols - enFila) * cw / 2;
      pos.push({ x: lado + off + (c + 0.5) * cw, y: arriba + (fila + 0.5) * ch });
    }
    return { cols, filas, r, pos };
  }
  // El corral: dos mitades (gallinas a la izquierda, conejos a la derecha) o una sola (o.una: fichas sin tipo, «?»)
  function corralGeo(fichas, W, H, o) {
    o = o || {};
    const arriba = o.arriba != null ? o.arriba : 26, abajo = o.abajo || 0, sep = 10;
    if (!(W > 80 && H > 60)) throw new Error('el lienzo es demasiado chico');
    const max = o.max || 16;
    if (o.una) {
      const caja = { x: 4, y: arriba, w: W - 8, h: H - arriba - abajo - 4 };
      const R = rejilla(fichas.length, caja.w, caja.h, { lado: 4, max });
      return { una: true, cajas: { todo: caja }, r: R.r, pos: R.pos.map(p => ({ x: caja.x + p.x, y: caja.y + p.y })) };
    }
    const C = contarCorral(fichas);
    const wm = (W - 8 - sep) / 2, g = { x: 4, y: arriba, w: wm, h: H - arriba - abajo - 4 }, c = { x: 4 + wm + sep, y: arriba, w: wm, h: g.h };
    // el mismo tamaño de ficha en las dos mitades: el que alcanza para todas las fichas en una mitad
    const R = rejilla(Math.max(1, fichas.length), wm, g.h, { lado: 4, max });
    const Rg = rejilla(C.gallinas, wm, g.h, { lado: 4, max: R.r }), Rc = rejilla(C.conejos, wm, g.h, { lado: 4, max: R.r });
    let ig = 0, ic = 0;
    const pos = fichas.map(f => {
      const t = typeof f === 'string' ? f : f.tipo;
      if (t === 'g') { const p = Rg.pos[ig++]; return { x: g.x + p.x, y: g.y + p.y }; }
      const p = Rc.pos[ic++]; return { x: c.x + p.x, y: c.y + p.y };
    });
    return { una: false, cajas: { g, c }, r: Math.min(Rg.r || R.r, Rc.r || R.r, R.r), pos, cuenta: C };
  }
  const lado = (p, caja) => p.x >= caja.x && p.x <= caja.x + caja.w && p.y >= caja.y && p.y <= caja.y + caja.h;
  // ¿En qué mitad del corral cae un punto? 'g', 'c' o null
  function mitadDe(geo, p) { if (geo.una) return null; return lado(p, geo.cajas.g) ? 'g' : lado(p, geo.cajas.c) ? 'c' : null; }
  function examenGeo(n, W, H, o) {
    o = o || {};
    const R = rejilla(n, W, H, { arriba: o.arriba || 0, abajo: o.abajo || 0, lado: 8, max: o.max || 14 });
    return R;
  }
  // La tira del cangrejo: nOps + 1 cajas en fila con flechas entre ellas; arriba la ida y abajo la vuelta
  function tiraGeo(nOps, W, H, o) {
    o = o || {};
    if (!Number.isInteger(nOps) || nOps < 1) throw new Error('la tira necesita al menos una operación');
    const lado = 8, flecha = o.flecha || (nOps <= 2 ? 0.4 : 0.34), arriba = o.arriba || 0, abajo = o.abajo || 0;
    const util = W - 2 * lado, n = nOps + 1;
    let bw = Math.min(72, util * (1 - flecha) / n);
    const fw = (util - n * bw) / nOps, bh = Math.min(46, bw * 0.9 + 6), y = arriba + (H - arriba - abajo) / 2 - bh / 2;
    const cajas = [], flechas = [];
    for (let i = 0; i < n; i++) cajas.push({ x: lado + i * (bw + fw), y, w: bw, h: bh });
    for (let i = 0; i < nOps; i++) flechas.push({ x1: cajas[i].x + bw, x2: cajas[i + 1].x, y, h: bh, ancho: fw, cx: cajas[i].x + bw + fw / 2 });
    return { cajas, flechas, bw, bh, fw };
  }
  // El tablero: casillas, líneas y la banca de fichas abajo (o = { banca, abajo, arriba })
  function tableroGeo(tipo, W, H, o) {
    o = o || {};
    const t = tablero(tipo), banca = o.banca != null ? o.banca : 56, abajo = o.abajo || 0, arriba = o.arriba || 8;
    const zona = { x: 8, y: arriba, w: W - 16, h: H - arriba - banca - abajo - 6 };
    let cas = [], lineas = [], r;
    if (tipo === 'cuadrado3') {
      const l = Math.min(zona.w, zona.h), c = l / 3, x0 = zona.x + (zona.w - l) / 2, y0 = zona.y + (zona.h - l) / 2;
      r = Math.min(24, c * 0.36);
      for (let i = 0; i < 9; i++) cas.push({ x: x0 + (i % 3 + 0.5) * c, y: y0 + (Math.floor(i / 3) + 0.5) * c, r });
      lineas = t.lineas.map(L => L.map(i => ({ x: cas[i].x, y: cas[i].y })));
      return { tipo, cas, lineas, r, celda: c, x0, y0, lado: l, banca: bancaGeo(t.casillas, W, H - abajo, banca, r), zona };
    }
    const k = tipo === 'triangulo3' ? 3 : 4;
    // triángulo equilátero lo más grande posible, con margen para las casillas
    const m = 26, lmax = Math.min(zona.w - 2 * m, (zona.h - 2 * m) * 2 / Math.sqrt(3)), l = lmax, h = l * Math.sqrt(3) / 2;
    const cx = zona.x + zona.w / 2, top = zona.y + (zona.h - h) / 2;
    const V = [{ x: cx, y: top }, { x: cx - l / 2, y: top + h }, { x: cx + l / 2, y: top + h }];
    r = Math.min(22, l / (k - 1) * 0.3);
    const punto = (a, b, f) => ({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
    cas = V.map(p => ({ x: p.x, y: p.y, r }));
    const ladosV = [[0, 1], [1, 2], [2, 0]];
    for (const [a, b] of ladosV) for (let j = 1; j < k - 1; j++) { const p = punto(V[a], V[b], j / (k - 1)); cas.push({ x: p.x, y: p.y, r }); }
    lineas = t.lineas.map(L => [cas[L[0]], cas[L[L.length - 1]]].map(p => ({ x: p.x, y: p.y })));
    return { tipo, cas, lineas, r, vertices: V, banca: bancaGeo(t.casillas, W, H - abajo, banca, r), zona };
  }
  function bancaGeo(n, W, H, alto, r) {
    const y = H - alto / 2, util = W - 16, paso = Math.min(util / n, 2 * r + 12), x0 = 8 + (util - paso * n) / 2;
    return Array.from({ length: n }, (_, i) => ({ x: x0 + (i + 0.5) * paso, y, r: Math.min(r, paso / 2 - 3) }));
  }
  // El índice del punto más cercano a p (dentro de r), o null
  function cercana(puntos, p, r) {
    let mejor = null, d0 = r;
    puntos.forEach((q, i) => { if (!q) return; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < d0) { d0 = d; mejor = i; } });
    return mejor;
  }

  return { fr, frTexto, numTexto, suma, resta, prod, divi, falsaSuposicion, contarCorral, corral, corralAlReves, examen,
    textoOp, aplicar, invertir, regresivo, barras, ordenCambiado, mercado, TABLEROS, tablero, distribuir, comprobar,
    menorSuma, subirTodos, subirFichas, centroMagico, cuadradosDistintos, corralGeo, mitadDe, examenGeo, tiraGeo, tableroGeo, cercana, pl };
});
