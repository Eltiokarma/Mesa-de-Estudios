/*
 * Motor de «El armador de triángulos»: congruencia de triángulos.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorCongruencia) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * CONVENCIONES
 * - Triángulo ABC con la notación de academia: el lado a es BC (opuesto al ángulo A), b es CA y c es AB.
 * - Los ángulos se reciben y se devuelven en grados. Ángulos de academia: 37 y 53 son los del triángulo 3-4-5
 *   (sen 37° = 3/5, sen 53° = 4/5); el motor los toma con su valor real (36,8698…° y 53,1301…°), y también
 *   74 = 2·37, 106 = 2·53, 127 = 180 − 53 y 143 = 180 − 37. grados(g) da el valor real; academia(x) hace lo
 *   contrario (36,8698… → 37; un valor que no es notable se devuelve igual). Con 30, 45, 60, 90, 120, 135, 150 el
 *   seno y el coseno salen exactos (sen 30° = 0,5 justo).
 * - Coordenadas: un punto es [x, y]. Al construir, A va en (0; 0), B en (c; 0) sobre el eje x positivo y C arriba
 *   (y > 0). "Hasta congruencia": dos triángulos que son reflejo uno del otro cuentan como uno solo.
 * - cuantos: cuántos triángulos no congruentes cumplen los datos, en texto: 'ninguno', 'uno', 'dos' o 'infinitos'
 *   (n vale 0, 1, 2 o Infinity). determina = (n === 1).
 * - Tolerancia: 1e-9 relativa a la escala de los datos.
 *
 * FUNCIONES
 *   grados(g), academia(x), sen(g), cos(g)   lo de arriba; sen y cos reciben grados de academia
 *   construir(datos)        datos: exactamente tres de { a, b, c, A, B, C }. Clasifica el criterio:
 *                           'LLL'; 'LAL' (el ángulo está entre los dos lados: su letra no es la de ningún lado dado);
 *                           'LLA' (dos lados y el ángulo opuesto a uno de ellos); 'ALA' (el lado está entre los dos
 *                           ángulos); 'LAA' (el lado es opuesto a uno de los ángulos; se pasa a ALA con la suma 180°);
 *                           'AAA'. Devuelve { criterio, n, cuantos, determina, triangulos: [t…], motivo, errores } y,
 *                           en LLA, además { angulo, opuesto, adyacente, altura (h = adyacente·sen del ángulo),
 *                           terceros (las medidas posibles del tercer lado, de menor a mayor), detras (cortes del
 *                           compás con la recta que caen detrás del vértice del ángulo, ≤ 0), frenteAlMayor
 *                           (opuesto > adyacente), recto (el ángulo es 90°) }.
 *                           Cada t = { lados: {a,b,c}, angulos: {A,B,C} (reales), academia: {A,B,C}, vertices: {A,B,C} }.
 *                           En AAA con suma 180°, triangulos queda vacío (hay infinitos, todos semejantes).
 *                           errores (valores en el formato de 'cuantos', salvo pitagorasSuma, que es una longitud):
 *                             LLL, LAL, ALA: reflejoComoOtro 'dos' (cuenta el reflejo como otro triángulo);
 *                             LLL además ordenDeUnion 'seis' (uno por cada orden de unir las varillas) y
 *                             bisagrasLibres 'infinitos' (cree que las uniones se pueden abrir);
 *                             LAA: soloConLadoEntre 'infinitos' (cree que el lado tiene que estar entre los ángulos);
 *                             LLA con dos: comoCriterio 'uno' y ladoCortoNoCierra 'ninguno'; LLA con uno:
 *                             nuncaDetermina 'dos' y, si el ángulo es recto, pitagorasSuma = √(opuesto² + adyacente²);
 *                             LLA con ninguno: comoCriterio 'uno'; AAA: comoCriterio 'uno' y sinTriangulo 'ninguno';
 *                             con datos que no cierran (n = 0, salvo LLA): comoSiCerrara 'uno'.
 *                           Ningún error vale lo mismo que la respuesta (si coincidiera, va null).
 *   armador(kit)            el armador de la escena. kit = datos de construir con letras canónicas: LLL {a,b,c},
 *                           LAL {b,A,c}, ALA {A,c,B}, LLA {A,b,a} (A con su lado adyacente b y su opuesto a) o AAA {A,B,C}
 *                           (y opcional desde/hasta: el rango del lado c, por defecto 2 a 10).
 *                           Devuelve { criterio, solucion (= construir), libre, cierres, inicio, base }:
 *                           libre es el lugar por donde se mueve el extremo libre: { tipo:'circulo', centro, radio }
 *                           (LLL: la varilla b gira en A; LLA: la varilla a gira en C), { tipo:'rayo', origen, angulo,
 *                           desde, hasta } (ALA: C corre por el rayo de A; AAA: B corre por la base) o
 *                           { tipo:'puntos', puntos } (LAL: C solo puede estar arriba o abajo).
 *                           cierres: los puntos donde el extremo libre cierra un triángulo con los datos.
 *   mover(kit, P, o)        lleva el punto P (el dedo) al lugar 'libre' y, si queda a menos de o.iman (0,35 por defecto)
 *                           de un cierre, lo pega. Devuelve { punto, cierra, indice (qué cierre), falta (cuánto falta
 *                           para cerrar: LLL |XB| − a; ALA distancia por el rayo; LLA altura sobre la base),
 *                           triangulo ({A,B,C} si cierra), piezas } con las piezas para dibujar:
 *                           { tipo:'varilla', lado, de, a }, { tipo:'rayo', de, angulo }, { tipo:'elastico', lado, de, a }
 *                           y { tipo:'bisagra', letra, vertice, desde, hasta } (ángulos polares en grados, antihorario).
 *   enLocus(kit, f)         el punto del lugar 'libre' para f de 0 a 1 (una vuelta entera desde 'inicio' en sentido
 *                           horario, o el rayo de desde a hasta): sirve para animar el barrido.
 *   correspondencia(t1, t2) t = { nombres: 'ABC', lados: [l01, l12, l20] } (lados[i] une el vértice i con el i + 1) y,
 *                           opcional, puntos: [[x,y]×3]. Prueba los seis emparejamientos de vértices y devuelve
 *                           { congruentes, pares: {A:'Q', …} (el primero que sirve), texto: 'ΔABC ≅ ΔQRP', todas: [textos],
 *                           errores: { ordenEscritura: 'ΔABC ≅ ΔPQR' (emparejar por el orden en que se escriben),
 *                           porPosicion (emparejar por el lugar en el dibujo: el de más arriba con el de más arriba y los
 *                           otros dos de izquierda a derecha; solo si hay puntos), volteadoNoCongruente: 'no congruentes'
 *                           (si uno es reflejo del otro) } }; un error que coincide con una correspondencia válida va null.
 *   superponer(origen, destino, f)   lleva el triángulo origen (3 puntos) sobre destino, congruente, para f de 0 a 1:
 *                           si hace falta, primero lo voltea (f de 0 a 0,4) y después lo gira y lo traslada.
 *                           Devuelve { puntos, refleja, giro (grados) }.
 *   congruentes(P, Q)       ¿dos triángulos dados por sus vértices tienen los mismos tres lados? (true/false)
 *   mediatriz({ A, B, t })  P sobre la mediatriz de AB, a distancia t (con signo, a la izquierda de A→B) del punto medio M.
 *                           Devuelve { P, M, PA, PB, PM, mitad (AB/2), errores: { PMcomoPB (= |t|), suma (|t| + AB/2),
 *                           restaCuadrados (√(t² − (AB/2)²), null si no existe) } }.
 *   bisectriz({ angulo, d })  ángulo AOB de vértice O = (0; 0), lado OA sobre el eje x; P en la bisectriz con OP = d.
 *                           Devuelve { P, H (pie sobre OA), K (pie sobre OB), distancias: [PH, PK], OH, OK, mitad,
 *                           errores: { pieComoDistancia: [OH, OK], mitadDeOP: [d/2, d/2], noEquidista: [PH, OH] } }.
 *   baseMedia({ A, B, C })  M punto medio de AB y N de AC: { M, N, MN, BC, razon (MN/BC), paralela,
 *                           errores: { ladoEntero: BC, cuarto: BC/4 } }.
 *   medianaHipotenusa({ catetos: [AB, BC] } o { hipotenusa, t })  rectángulo en B; AC es la hipotenusa, con A y C en
 *                           (∓ AC/2; 0) y M = (0; 0) su punto medio; con t, B está en la semicircunferencia de diámetro AC,
 *                           en el ángulo polar t (0 < t < 180). Devuelve { A, B, C, M, hipotenusa, catetos: [AB, BC],
 *                           mediana (BM), altura (de B a AC), errores: { cateto: AB, otroCateto: BC, altura,
 *                           promedioCatetos, hipotenusaEntera } } (null el que coincida con la mediana).
 *   notable({ tipo, hipotenusa | menor | mayor | cateto })  tipo '30-60' (k, k√3, 2k), '45-45' (k, k, k√2) o '37-53'
 *                           (3k, 4k, 5k). Devuelve { k, menor, mayor, hipotenusa, textos: { menor, mayor, hipotenusa },
 *                           errores } con, para '30-60' dado por la hipotenusa: intercambiados (el cateto mayor en lugar
 *                           del menor), proporcionalAngulos (lados proporcionales a 30, 60 y 90: hipotenusa/3) y
 *                           otroNotable (el de 45°: hipotenusa/√2).
 *   raizTexto(x)            un número como lo escribe la academia: 5√3, 4√2, 12, o null si no es entero ni p√q.
 *   azar(semilla)           números al azar con semilla (para las pruebas).
 *
 * Los errores vienen de docs/investigacion/geometria-ideas-erroneas.md (GE8, GE9, GE11, GE22) o son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCongruencia = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9, PI = Math.PI;
  const G37 = Math.atan2(3, 4) * 180 / PI, G53 = Math.atan2(4, 3) * 180 / PI;
  const NOTABLES = { 37: G37, 53: G53, 74: 2 * G37, 106: 2 * G53, 127: 180 - G53, 143: 180 - G37 };
  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  // seno y coseno exactos de los ángulos de academia
  const TABLA = { 0: [0, 1], 30: [0.5, R3 / 2], 37: [0.6, 0.8], 45: [R2 / 2, R2 / 2], 53: [0.8, 0.6], 60: [R3 / 2, 0.5],
    74: [0.96, 0.28], 90: [1, 0], 106: [0.96, -0.28], 120: [R3 / 2, -0.5], 127: [0.8, -0.6], 135: [R2 / 2, -R2 / 2],
    143: [0.6, -0.8], 150: [0.5, -R3 / 2], 180: [0, -1] };

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) { numero(x, que); if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`); return x; }
  function anguloDato(x, que) { numero(x, que); if (!(x > 0 && x < 180)) throw new Error(`${que} debe estar entre 0° y 180°`); return x; }
  function punto(p, que) {
    if (!Array.isArray(p) || p.length !== 2 || !p.every(v => typeof v === 'number' && Number.isFinite(v)))
      throw new Error(`${que} debe ser un punto [x, y] con coordenadas numéricas`);
    return [p[0] + 0, p[1] + 0];
  }

  const grados = g => (Object.prototype.hasOwnProperty.call(NOTABLES, g) ? NOTABLES[g] : g);
  function academia(x) {
    for (const k of Object.keys(NOTABLES)) if (Math.abs(NOTABLES[k] - x) < 1e-7) return Number(k);
    const r = Math.round(x);
    return Math.abs(x - r) < 1e-7 ? r : x;
  }
  const sen = g => (TABLA[g] ? TABLA[g][0] : Math.sin(grados(g) * PI / 180));
  const cos = g => (TABLA[g] ? TABLA[g][1] : Math.cos(grados(g) * PI / 180));
  const acosd = x => Math.acos(Math.max(-1, Math.min(1, x))) * 180 / PI;
  const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  const limpio = (x, esc) => (Math.abs(x) <= TOL * (esc || 1) ? 0 : x);
  const polar = (P, Q) => Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / PI;

  const CUANTOS = { 0: 'ninguno', 1: 'uno', 2: 'dos', 6: 'seis' };
  const cuantosDe = n => (n === Infinity ? 'infinitos' : CUANTOS[n]);

  // Triángulo desde sus tres lados (ya válidos), con A en el origen, B en (c; 0) y C arriba.
  function desdeLados(a, b, c) {
    const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
    const A = acosd((b * b + c * c - a * a) / (2 * b * c)), B = acosd((a * a + c * c - b * b) / (2 * a * c));
    const C = 180 - A - B, esc = Math.max(a, b, c);
    return {
      lados: { a, b, c }, angulos: { A, B, C },
      academia: { A: academia(A), B: academia(B), C: academia(C) },
      vertices: { A: [0, 0], B: [c, 0], C: [limpio(x, esc), y] },
    };
  }
  const cierraLLL = (a, b, c) => { const m = Math.max(a, b, c); return a + b + c - 2 * m > TOL * m; };

  const LADOS = ['a', 'b', 'c'], ANGULOS = ['A', 'B', 'C'];
  const may = l => l.toUpperCase(), min = l => l.toLowerCase();

  function construir(datos) {
    if (!datos || typeof datos !== 'object') throw new Error('faltan los datos del triángulo');
    const claves = Object.keys(datos).filter(k => datos[k] !== undefined && datos[k] !== null);
    for (const k of claves) if (!LADOS.includes(k) && !ANGULOS.includes(k)) throw new Error(`dato desconocido: ${k} (usa a, b, c, A, B, C)`);
    if (claves.length !== 3) throw new Error('se necesitan exactamente tres datos');
    const lados = claves.filter(k => LADOS.includes(k)), angs = claves.filter(k => ANGULOS.includes(k));
    for (const l of lados) positivo(datos[l], `el lado ${l}`);
    for (const g of angs) anguloDato(datos[g], `el ángulo ${g}`);
    const R = { triangulos: [], errores: {} };
    const fin = (criterio, n, motivo, extra) => {
      Object.assign(R, { criterio, n, cuantos: cuantosDe(n), determina: n === 1, motivo }, extra || {});
      for (const k of Object.keys(R.errores)) if (R.errores[k] === R.cuantos) R.errores[k] = null;
      return R;
    };

    if (lados.length === 3) {
      const { a, b, c } = datos;
      if (!cierraLLL(a, b, c)) { R.errores = { comoSiCerrara: 'uno' }; return fin('LLL', 0, 'desigualdad'); }
      R.triangulos = [desdeLados(a, b, c)];
      R.errores = { reflejoComoOtro: 'dos', ordenDeUnion: 'seis', bisagrasLibres: 'infinitos' };
      return fin('LLL', 1, 'tres lados');
    }
    if (lados.length === 2) {
      const g = angs[0], lg = min(g);
      if (!lados.includes(lg)) {   // LAL: el ángulo está entre los dos lados
        const [x, y] = lados.map(l => datos[l]);
        const t = Math.sqrt(Math.max(0, x * x + y * y - 2 * x * y * cos(datos[g])));
        const s = { [lados[0]]: x, [lados[1]]: y, [lg]: t };
        R.triangulos = [desdeLados(s.a, s.b, s.c)];
        R.errores = { reflejoComoOtro: 'dos' };
        return fin('LAL', 1, 'ángulo entre los lados');
      }
      // LLA: el ángulo g, su lado opuesto lg y otro lado adyacente
      const ladj = lados.find(l => l !== lg), lter = LADOS.find(l => l !== lg && l !== ladj);
      const o = datos[lg], s = datos[ladj], W = datos[g];
      const h = s * sen(W), p = s * cos(W), esc = Math.max(o, s);
      let terceros = [], detras = [];
      if (Math.abs(o - h) <= TOL * esc) terceros = [p];
      else if (o > h) { const r = Math.sqrt(o * o - h * h); terceros = [p - r, p + r]; }
      detras = terceros.filter(t => t < -TOL * esc);
      terceros = terceros.filter(t => t > TOL * esc);
      R.triangulos = terceros.map(t => { const v = { [lg]: o, [ladj]: s, [lter]: t }; return desdeLados(v.a, v.b, v.c); });
      const n = terceros.length, recto = Math.abs(grados(W) - 90) < 1e-9;
      if (n === 2) R.errores = { comoCriterio: 'uno', ladoCortoNoCierra: 'ninguno' };
      else if (n === 1) { R.errores = { nuncaDetermina: 'dos' }; if (recto) R.errores.pitagorasSuma = Math.sqrt(o * o + s * s); }
      else R.errores = { comoCriterio: 'uno' };
      const motivo = n === 0 ? 'no alcanza' : n === 2 ? 'dos cortes' : (Math.abs(o - h) <= TOL * esc && !recto ? 'tangente' : 'un corte');
      return fin('LLA', n, motivo, { angulo: g, opuesto: lg, adyacente: ladj, tercero: lter, altura: h, terceros, detras,
        frenteAlMayor: o > s + TOL * esc, recto });
    }
    if (lados.length === 1) {
      const l = lados[0], L = may(l);
      const real = angs.map(g => grados(datos[g])), suma = real[0] + real[1];
      const criterio = angs.includes(L) ? 'LAA' : 'ALA';
      if (suma >= 180 - 1e-9) { R.errores = { comoSiCerrara: 'uno' }; return fin(criterio, 0, 'suma de ángulos'); }
      const ang = {}; angs.forEach((g, i) => { ang[g] = real[i]; });
      const falta = ANGULOS.find(g => !angs.includes(g)); ang[falta] = 180 - suma;
      const sn = g => (datos[g] !== undefined ? sen(datos[g]) : Math.sin(ang[g] * PI / 180));
      const k = datos[l] / sn(L);   // ley de proporcionalidad de lados y senos (solo en el motor)
      R.triangulos = [desdeLados(k * sn('A'), k * sn('B'), k * sn('C'))];
      R.errores = criterio === 'LAA' ? { soloConLadoEntre: 'infinitos' } : { reflejoComoOtro: 'dos' };
      return fin(criterio, 1, criterio === 'LAA' ? 'el tercer ángulo sale de la suma' : 'lado entre los ángulos', { faltaAngulo: falta, anguloQueFalta: academia(ang[falta]) });
    }
    const suma = angs.reduce((s, g) => s + grados(datos[g]), 0);
    if (Math.abs(suma - 180) > 1e-9) { R.errores = { comoSiCerrara: 'uno' }; return fin('AAA', 0, 'suma de ángulos'); }
    R.errores = { comoCriterio: 'uno', sinTriangulo: 'ninguno' };
    return fin('AAA', Infinity, 'semejantes');
  }

  // ---------- El armador ----------
  function canon(kit) {
    const s = construir(kit), c = s.criterio, k = Object.keys(kit).filter(x => kit[x] !== undefined && LADOS.concat(ANGULOS).includes(x)).sort().join('');
    const pide = { LLL: 'abc', LAL: 'Abc', ALA: 'ABc', LLA: 'Aab', AAA: 'ABC' }[c];
    if (!pide || k !== pide) throw new Error(`el armador usa las letras LLL {a,b,c}, LAL {b,A,c}, ALA {A,c,B}, LLA {A,b,a} o AAA {A,B,C}`);
    return s;
  }
  const enCirculo = (O, r, g) => [O[0] + r * Math.cos(g * PI / 180), O[1] + r * Math.sin(g * PI / 180)];
  function armador(kit) {
    const sol = canon(kit), crit = sol.criterio, A0 = [0, 0];
    const t = sol.triangulos[0];
    const R = { criterio: crit, solucion: sol, cierres: [], base: { A: A0 } };
    if (crit === 'LLL') {
      R.base.B = [kit.c, 0];
      R.libre = { tipo: 'circulo', centro: A0, radio: kit.b };
      if (t) { const C = t.vertices.C; R.cierres = [C, [C[0], -C[1]]]; }
      const g = t ? t.angulos.A : 90;
      R.inicio = g + 70 < 180 ? g + 70 : g - 70;
    } else if (crit === 'LAL') {
      R.base.B = [kit.c, 0];
      const C = enCirculo(A0, kit.b, grados(kit.A)); C[0] = limpio(C[0], kit.b);
      R.libre = { tipo: 'puntos', puntos: [C, [C[0], -C[1]]] };
      R.cierres = R.libre.puntos.slice(); R.inicio = 0;
    } else if (crit === 'ALA') {
      R.base.B = [kit.c, 0];
      const b = t.lados.b;
      R.libre = { tipo: 'rayo', origen: A0, angulo: grados(kit.A), desde: 0, hasta: 1.6 * b };
      R.cierres = [t.vertices.C]; R.inicio = 0.45 * b;
    } else if (crit === 'LLA') {
      const C = [kit.b * cos(kit.A), kit.b * sen(kit.A)]; C[0] = limpio(C[0], kit.b);
      R.base.C = C;
      R.libre = { tipo: 'circulo', centro: C, radio: kit.a };
      R.cierres = sol.terceros.map(x => [x, 0]);
      R.detras = sol.detras.map(x => [x, 0]);
      R.inicio = 60;
    } else {   // AAA
      const desde = kit.desde === undefined ? 2 : positivo(kit.desde, 'desde'), hasta = kit.hasta === undefined ? 10 : positivo(kit.hasta, 'hasta');
      if (!(hasta > desde)) throw new Error('hasta debe ser mayor que desde');
      R.libre = { tipo: 'rayo', origen: A0, angulo: 0, desde, hasta };
      R.inicio = (desde + hasta) / 2;
    }
    return R;
  }
  function enLocus(kit, f) {
    numero(f, 'f');
    const R = armador(kit), L = R.libre;
    if (L.tipo === 'circulo') return enCirculo(L.centro, L.radio, R.inicio - 360 * f);
    if (L.tipo === 'puntos') return L.puntos[f < 0.5 ? 1 : 0];
    const x = L.desde + (L.hasta - L.desde) * Math.max(0, Math.min(1, f));
    return enCirculo(L.origen, x, L.angulo);
  }
  function mover(kit, P0, o) {
    const R = armador(kit), L = R.libre, P = punto(P0, 'el punto');
    const iman = o && o.iman !== undefined ? positivo(o.iman, 'el imán') : 0.35;
    let X, falta = null;
    if (L.tipo === 'circulo') {
      const d = dist(P, L.centro);
      const u = d > 1e-12 ? [(P[0] - L.centro[0]) / d, (P[1] - L.centro[1]) / d] : [1, 0];
      X = [L.centro[0] + L.radio * u[0], L.centro[1] + L.radio * u[1]];
    } else if (L.tipo === 'puntos') {
      X = dist(P, L.puntos[0]) <= dist(P, L.puntos[1]) ? L.puntos[0] : L.puntos[1];
    } else {
      const u = [Math.cos(L.angulo * PI / 180), Math.sin(L.angulo * PI / 180)];
      const s = Math.max(L.desde, Math.min(L.hasta, (P[0] - L.origen[0]) * u[0] + (P[1] - L.origen[1]) * u[1]));
      X = [L.origen[0] + s * u[0], L.origen[1] + s * u[1]];
    }
    // imán: se pega al cierre más cercano
    let indice = -1, mejor = iman;
    R.cierres.forEach((Q, i) => { const d = dist(X, Q); if (d <= mejor) { mejor = d; indice = i; } });
    if (indice >= 0) X = R.cierres[indice].slice();
    const crit = R.criterio, A0 = R.base.A;
    const piezas = [];
    let tri = null;
    if (crit === 'LLL') {
      const B0 = R.base.B, dBX = dist(B0, X);
      const E = dBX > 1e-12 ? [B0[0] + kit.a * (X[0] - B0[0]) / dBX, B0[1] + kit.a * (X[1] - B0[1]) / dBX] : [B0[0], B0[1] + kit.a];
      falta = indice >= 0 ? 0 : dBX - kit.a;
      piezas.push({ tipo: 'varilla', lado: 'c', de: A0, a: B0 }, { tipo: 'varilla', lado: 'b', de: A0, a: X }, { tipo: 'varilla', lado: 'a', de: B0, a: indice >= 0 ? X : E });
      if (indice >= 0) tri = { A: A0, B: B0, C: X };
    } else if (crit === 'LAL') {
      const B0 = R.base.B;
      piezas.push({ tipo: 'varilla', lado: 'c', de: A0, a: B0 }, { tipo: 'varilla', lado: 'b', de: A0, a: X },
        { tipo: 'bisagra', letra: 'A', vertice: A0, desde: Math.min(0, polar(A0, X)), hasta: Math.max(0, polar(A0, X)) },
        { tipo: 'elastico', lado: 'a', de: B0, a: X });
      falta = 0; indice = X[1] > 0 ? 0 : 1; tri = { A: A0, B: B0, C: X };
    } else if (crit === 'ALA') {
      const B0 = R.base.B, gB = 180 - grados(kit.B);
      piezas.push({ tipo: 'varilla', lado: 'c', de: A0, a: B0 }, { tipo: 'rayo', de: A0, angulo: L.angulo }, { tipo: 'rayo', de: B0, angulo: gB },
        { tipo: 'bisagra', letra: 'A', vertice: A0, desde: 0, hasta: L.angulo }, { tipo: 'bisagra', letra: 'B', vertice: B0, desde: gB, hasta: 180 });
      falta = indice >= 0 ? 0 : dist(X, A0) - dist(R.cierres[0], A0);
      piezas.push({ tipo: 'marca', de: A0, a: X });
      if (indice >= 0) tri = { A: A0, B: B0, C: X };
    } else if (crit === 'LLA') {
      const C0 = R.base.C;
      piezas.push({ tipo: 'rayo', de: A0, angulo: 0 }, { tipo: 'varilla', lado: 'b', de: A0, a: C0 },
        { tipo: 'bisagra', letra: 'A', vertice: A0, desde: 0, hasta: grados(kit.A) }, { tipo: 'varilla', lado: 'a', de: C0, a: X });
      falta = indice >= 0 ? 0 : X[1];
      if (indice >= 0) tri = { A: A0, B: X, C: C0 };
    } else {
      const c = X[0], s = construir({ A: kit.A, B: kit.B, c }), v = s.triangulos[0].vertices;
      piezas.push({ tipo: 'rayo', de: A0, angulo: 0 }, { tipo: 'rayo', de: A0, angulo: grados(kit.A) },
        { tipo: 'bisagra', letra: 'A', vertice: A0, desde: 0, hasta: grados(kit.A) },
        { tipo: 'bisagra', letra: 'B', vertice: v.B, desde: 180 - grados(kit.B), hasta: 180 },
        { tipo: 'bisagra', letra: 'C', vertice: v.C, desde: polar(v.C, v.B), hasta: polar(v.C, v.A) },
        { tipo: 'elastico', lado: 'c', de: v.A, a: v.B }, { tipo: 'elastico', lado: 'b', de: v.A, a: v.C }, { tipo: 'elastico', lado: 'a', de: v.B, a: v.C });
      falta = 0; tri = v; indice = 0; X = v.B;
    }
    let lados = null;
    if (tri) {
      const ab = dist(tri.A, tri.B), bc = dist(tri.B, tri.C), ca = dist(tri.C, tri.A);
      lados = { a: bc, b: ca, c: ab };
      if (crit !== 'AAA' && crit !== 'LAL') {   // la bisagra en C y el tercer lado, ya cerrado
        if (crit === 'ALA') piezas.push({ tipo: 'bisagra', letra: 'C', vertice: tri.C, desde: polar(tri.C, tri.B), hasta: polar(tri.C, tri.A) });
      }
    }
    return { punto: X, cierra: !!tri, indice, falta, triangulo: tri, lados, piezas };
  }

  // ---------- Correspondencia de vértices ----------
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function lado(t, i, j) { if ((i + 1) % 3 === j) return t.lados[i]; if ((j + 1) % 3 === i) return t.lados[j]; throw new Error('lado'); }
  function validarT(t, que) {
    if (!t || typeof t.nombres !== 'string' || t.nombres.length !== 3) throw new Error(`${que}: nombres debe tener tres letras`);
    if (!Array.isArray(t.lados) || t.lados.length !== 3) throw new Error(`${que}: faltan los tres lados`);
    t.lados.forEach((l, i) => positivo(l, `${que}: el lado ${i + 1}`));
    if (t.puntos) t.puntos.forEach((p, i) => punto(p, `${que}: el punto ${i + 1}`));
    return t;
  }
  const igual = (x, y) => Math.abs(x - y) <= TOL * Math.max(1, Math.abs(x), Math.abs(y));
  function correspondencia(t1, t2) {
    validarT(t1, 'el primer triángulo'); validarT(t2, 'el segundo triángulo');
    const sirve = s => [[0, 1], [1, 2], [2, 0]].every(([i, j]) => igual(lado(t1, i, j), lado(t2, s[i], s[j])));
    const texto = s => `Δ${t1.nombres} ≅ Δ${s.map(i => t2.nombres[i]).join('')}`;
    const validas = PERMS.filter(sirve), todas = validas.map(texto);
    const pares = validas.length ? Object.fromEntries([0, 1, 2].map(i => [t1.nombres[i], t2.nombres[validas[0][i]]])) : null;
    const errores = { ordenEscritura: texto([0, 1, 2]) };
    if (t1.puntos && t2.puntos) {
      const slots = P => { const arr = [0, 1, 2]; const top = arr.reduce((m, i) => (P[i][1] > P[m][1] ? i : m), 0);
        const resto = arr.filter(i => i !== top).sort((i, j) => P[i][0] - P[j][0]); return { izq: resto[0], der: resto[1], arriba: top }; };
      const s1 = slots(t1.puntos), s2 = slots(t2.puntos), s = [];
      for (const k of ['izq', 'der', 'arriba']) s[s1[k]] = s2[k];
      errores.porPosicion = texto(s);
    }
    // ¿uno es el reflejo del otro? (la correspondencia válida invierte el sentido de recorrido)
    if (t1.puntos && t2.puntos && validas.length) {
      const area = P => (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]);
      const s = validas[0], Q = s.map(i => t2.puntos[i]);
      errores.volteadoNoCongruente = Math.sign(area(t1.puntos)) !== Math.sign(area(Q)) ? 'no congruentes' : null;
    }
    for (const k of Object.keys(errores)) if (errores[k] !== null && todas.includes(errores[k])) errores[k] = null;
    if (errores.porPosicion && errores.porPosicion === errores.ordenEscritura) errores.porPosicion = null;
    return { congruentes: validas.length > 0, pares, texto: todas[0] || null, todas, errores };
  }

  // ---------- Superponer un triángulo sobre otro (animación) ----------
  function tresPuntos(P, que) { if (!Array.isArray(P) || P.length !== 3) throw new Error(`${que}: se necesitan tres puntos`); return P.map((p, i) => punto(p, `${que} ${i + 1}`)); }
  function congruentes(P0, Q0) {
    const P = tresPuntos(P0, 'el primer triángulo'), Q = tresPuntos(Q0, 'el segundo triángulo');
    const l = T => [dist(T[0], T[1]), dist(T[1], T[2]), dist(T[2], T[0])].sort((x, y) => x - y);
    const a = l(P), b = l(Q);
    return a.every((x, i) => igual(x, b[i]));
  }
  function superponer(O0, D0, f) {
    const O = tresPuntos(O0, 'origen'), D = tresPuntos(D0, 'destino');
    numero(f, 'f'); f = Math.max(0, Math.min(1, f));
    for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) if (!igual(dist(O[i], O[j]), dist(D[i], D[j]))) throw new Error('los triángulos no son congruentes con esa correspondencia');
    const cen = T => [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];
    const area = T => (T[1][0] - T[0][0]) * (T[2][1] - T[0][1]) - (T[2][0] - T[0][0]) * (T[1][1] - T[0][1]);
    const G0 = cen(O), G1 = cen(D), refleja = Math.sign(area(O)) !== Math.sign(area(D));
    const Or = refleja ? O.map(p => [2 * G0[0] - p[0], p[1]]) : O;
    const u = [Or[0][0] - G0[0], Or[0][1] - G0[1]], v = [D[0][0] - G1[0], D[0][1] - G1[1]];
    let giro = (Math.atan2(v[1], v[0]) - Math.atan2(u[1], u[0])) * 180 / PI;
    if (giro > 180) giro -= 360; if (giro <= -180) giro += 360;
    const f1 = refleja ? Math.min(1, f / 0.4) : 1, f2 = refleja ? Math.max(0, (f - 0.4) / 0.6) : f;
    const sx = 1 - 2 * f1 * (refleja ? 1 : 0);
    const r = giro * f2 * PI / 180, co = Math.cos(r), si = Math.sin(r);
    const puntos = O.map(p => {
      const q = [G0[0] + sx * (p[0] - G0[0]), p[1]];
      const w = [q[0] - G0[0], q[1] - G0[1]];
      return [G0[0] + (G1[0] - G0[0]) * f2 + w[0] * co - w[1] * si, G0[1] + (G1[1] - G0[1]) * f2 + w[0] * si + w[1] * co];
    });
    return { puntos, refleja, giro };
  }

  // ---------- Mediatriz, bisectriz, base media, mediana a la hipotenusa ----------
  function mediatriz(o) {
    o = o || {};
    const A = punto(o.A, 'A'), B = punto(o.B, 'B'), t = numero(o.t, 't');
    const AB = dist(A, B); if (!(AB > 0)) throw new Error('A y B deben ser distintos');
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = [-(B[1] - A[1]) / AB, (B[0] - A[0]) / AB];
    const P = [M[0] + t * n[0], M[1] + t * n[1]], mitad = AB / 2, PA = dist(P, A);
    const e = { PMcomoPB: Math.abs(t), suma: Math.abs(t) + mitad, restaCuadrados: Math.abs(t) > mitad ? Math.sqrt(t * t - mitad * mitad) : null };
    for (const k of Object.keys(e)) if (e[k] !== null && igual(e[k], PA)) e[k] = null;
    return { P, M, PA, PB: dist(P, B), PM: Math.abs(t), mitad, errores: e };
  }
  function bisectriz(o) {
    o = o || {};
    const ang = anguloDato(o.angulo, 'el ángulo'), d = positivo(o.d, 'OP');
    const real = grados(ang), mitad = real / 2, sm = Math.sin(mitad * PI / 180), cm = Math.cos(mitad * PI / 180);
    const exS = { 74: 0.6, 106: 0.8, 60: 0.5, 90: R2 / 2, 120: R3 / 2 }[ang], exC = { 74: 0.8, 106: 0.6, 60: R3 / 2, 90: R2 / 2, 120: 0.5 }[ang];
    const s = exS !== undefined ? exS : sm, c = exC !== undefined ? exC : cm;
    const P = [d * c, d * s], H = [d * c, 0];
    const u = [Math.cos(real * PI / 180), Math.sin(real * PI / 180)], OK = d * c, K = [OK * u[0], OK * u[1]];
    const PH = d * s, PK = dist(P, K);
    return { P, H, K, distancias: [PH, PK], OH: d * c, OK, mitad: academia(mitad), A: [d * 1.6, 0], B: [d * 1.6 * u[0], d * 1.6 * u[1]],
      errores: { pieComoDistancia: igual(OK, PH) ? null : [OK, OK], mitadDeOP: igual(d / 2, PH) ? null : [d / 2, d / 2], noEquidista: igual(OK, PH) ? null : [PH, OK] } };
  }
  function baseMedia(o) {
    o = o || {};
    const A = punto(o.A, 'A'), B = punto(o.B, 'B'), C = punto(o.C, 'C');
    const ar = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
    const esc = Math.max(dist(A, B), dist(B, C), dist(C, A));
    if (!(esc > 0) || Math.abs(ar) <= 1e-12 * esc * esc) throw new Error('A, B y C deben formar un triángulo');
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], N = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
    const MN = dist(M, N), BC = dist(B, C);
    const cruz = (N[0] - M[0]) * (C[1] - B[1]) - (N[1] - M[1]) * (C[0] - B[0]);
    return { M, N, MN, BC, razon: MN / BC, paralela: Math.abs(cruz) <= 1e-9 * esc * esc, errores: { ladoEntero: BC, cuarto: BC / 4 } };
  }
  function medianaHipotenusa(o) {
    o = o || {};
    let h, B;
    if (o.catetos) {
      if (!Array.isArray(o.catetos) || o.catetos.length !== 2) throw new Error('catetos debe ser [AB, BC]');
      const ab = positivo(o.catetos[0], 'el cateto AB'), bc = positivo(o.catetos[1], 'el cateto BC');
      h = Math.hypot(ab, bc);
      const x = (ab * ab - bc * bc) / (2 * h);   // B respecto de M, con A en −h/2
      B = [x, ab * bc / h];
    } else {
      h = positivo(o.hipotenusa, 'la hipotenusa');
      const t = numero(o.t, 't'); if (!(t > 0 && t < 180)) throw new Error('t debe estar entre 0° y 180°');
      B = [h / 2 * cos(t), h / 2 * sen(t)];
    }
    const A = [-h / 2, 0], C = [h / 2, 0], M = [0, 0];
    const AB = dist(A, B), BC = dist(B, C), med = dist(B, M), alt = B[1];
    const e = { cateto: AB, otroCateto: BC, altura: alt, promedioCatetos: (AB + BC) / 2, hipotenusaEntera: h };
    for (const k of Object.keys(e)) if (igual(e[k], med)) e[k] = null;
    return { A, B, C, M, hipotenusa: h, catetos: [AB, BC], mediana: med, altura: alt, errores: e };
  }

  // ---------- Triángulos rectángulos notables ----------
  function raizTexto(x) {
    numero(x, 'x');
    const n2 = x * x, r = Math.round(n2);
    if (Math.abs(n2 - r) > 1e-7 * Math.max(1, r) || r <= 0) return null;
    let p = 1, q = r;
    for (let k = Math.floor(Math.sqrt(r)); k > 1; k--) if (q % (k * k) === 0) { p = k; q = q / (k * k); break; }
    return q === 1 ? String(p) : `${p === 1 ? '' : p}√${q}`;
  }
  function notable(o) {
    o = o || {};
    const F = { '30-60': [1, R3, 2], '45-45': [1, 1, R2], '37-53': [3, 4, 5] }[o.tipo];
    if (!F) throw new Error("tipo debe ser '30-60', '45-45' o '37-53'");
    let k;
    if (o.hipotenusa !== undefined) k = positivo(o.hipotenusa, 'la hipotenusa') / F[2];
    else if (o.menor !== undefined) k = positivo(o.menor, 'el cateto menor') / F[0];
    else if (o.mayor !== undefined) k = positivo(o.mayor, 'el cateto mayor') / F[1];
    else if (o.cateto !== undefined) k = positivo(o.cateto, 'el cateto') / F[0];
    else throw new Error('falta un lado: hipotenusa, menor, mayor o cateto');
    const menor = k * F[0], mayor = k * F[1], hip = k * F[2];
    const tx = x => raizTexto(x) || String(Math.round(x * 100) / 100).replace('.', ',');
    const errores = {};
    if (o.tipo === '30-60') { errores.intercambiados = mayor; errores.proporcionalAngulos = hip / 3; errores.otroNotable = hip / R2; }
    if (o.tipo === '37-53') { errores.intercambiados = mayor; errores.proporcionalAngulos = hip * 37 / 90; }
    if (o.tipo === '45-45') { errores.sinRaiz = hip; }
    for (const e of Object.keys(errores)) if (igual(errores[e], menor)) errores[e] = null;
    return { tipo: o.tipo, k, menor, mayor, hipotenusa: hip, textos: { menor: tx(menor), mayor: tx(mayor), hipotenusa: tx(hip) }, errores };
  }

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return { TOL, G37, G53, grados, academia, sen, cos, construir, armador, mover, enLocus, correspondencia, superponer,
    congruentes, mediatriz, bisectriz, baseMedia, medianaHipotenusa, notable, raizTexto, azar, distancia: (P, Q) => dist(punto(P, 'P'), punto(Q, 'Q')) };
});
