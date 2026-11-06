/*
 * Motor de «El triángulo que se estira»: líneas notables y área.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorTriangulo) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Todo se calcula con coordenadas. Un punto es { x, y } o [x, y]. Convención de nombres:
 * el lado a es BC (opuesto a A), b es CA y c es AB. Los ángulos salen en grados.
 *
 *   triangulo(A, B, C)            lados, ángulos, tipo, área (base·altura/2 y por coordenadas),
 *                                 las tres alturas, medianas y bisectrices, y los puntos notables
 *   altura(A, B, C)               pie y longitud de la altura desde A sobre la recta BC, y si cae
 *                                 dentro de BC, en un extremo o fuera (sobre la prolongación)
 *   mediana(A, B, C)              punto medio de BC y longitud (también con la fórmula de la mediana)
 *   bisectriz(A, B, C)            punto D de BC con BD/DC = AB/AC (teorema de la bisectriz) y longitud
 *   rectangulo({ catetos | proyecciones | hipotenusa y cateto | hipotenusa y proyeccion })
 *                                 relaciones métricas: h² = m·n, cateto² = hipotenusa·proyección, h = ab/c
 *   moverEnParalela(A, B, C, d)   corre A una distancia d sobre la paralela a BC: el área no cambia
 *   rotar(A, B, C, grados, centro) gira el triángulo: las medidas no cambian
 *   partirArea(A, B, C, t)        el punto P = B + t·(BC) parte el triángulo en dos: áreas y razón
 *
 * Cada resultado trae un campo 'errores' con lo que dan los errores típicos de
 * docs/investigacion/geometria-ideas-erroneas.md (GE7, GE8, GE18…): son las opciones incorrectas
 * de las predicciones.
 *
 * Tolerancia: las clasificaciones (rectángulo, isósceles, pie en un extremo) comparan con una
 * tolerancia relativa de 1e-9, para que un triángulo girado siga siendo rectángulo.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTriangulo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;

  // ---------- Puntos y vectores ----------
  function punto(p, nombre) {
    let x, y;
    if (Array.isArray(p)) { x = p[0]; y = p[1]; }
    else if (p && typeof p === 'object') { x = p.x; y = p.y; }
    if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y))
      throw new Error(`el punto ${nombre || ''} debe tener coordenadas numéricas x e y`.replace('  ', ' '));
    return { x: x + 0, y: y + 0 };
  }
  const resta = (P, Q) => ({ x: P.x - Q.x, y: P.y - Q.y });
  const suma = (P, Q) => ({ x: P.x + Q.x, y: P.y + Q.y });
  const por = (P, k) => ({ x: P.x * k, y: P.y * k });
  const pesc = (u, v) => u.x * v.x + u.y * v.y;
  const pvec = (u, v) => u.x * v.y - u.y * v.x;
  const distancia = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
  const medio = (P, Q) => ({ x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 });
  // Iguales con tolerancia relativa (a la mayor de las dos magnitudes).
  const igual = (x, y, escala) => Math.abs(x - y) <= TOL * Math.max(Math.abs(x), Math.abs(y), escala || 0);
  // Limpia el −0 y el ruido de redondeo cerca de cero (relativo a una escala).
  const limpio = (x, escala) => (Math.abs(x) <= TOL * (escala || 1) ? 0 : x);

  function tres(A, B, C) {
    A = punto(A, 'A'); B = punto(B, 'B'); C = punto(C, 'C');
    const escala = Math.max(distancia(A, B), distancia(B, C), distancia(C, A));
    if (!(escala > 0)) throw new Error('los tres vértices coinciden');
    if (Math.abs(pvec(resta(B, A), resta(C, A))) <= 1e-12 * escala * escala)
      throw new Error('los tres puntos están alineados: no forman un triángulo');
    return [A, B, C, escala];
  }

  // Área por coordenadas (fórmula del determinante, o "de los cordones"); con signo: positiva si A, B, C van
  // en sentido antihorario.
  function areaConSigno(A, B, C) { return pvec(resta(B, A), resta(C, A)) / 2; }

  // ---------- Altura ----------
  // Desde V sobre la recta PQ. t es la posición del pie: 0 en P, 1 en Q; t < 0 o t > 1 cae fuera.
  function alturaDesde(V, P, Q, nP, nQ) {
    const u = resta(Q, P), L2 = pesc(u, u), L = Math.sqrt(L2);
    let t = pesc(resta(V, P), u) / L2;
    let donde, extremo = null, lado = null;
    if (Math.abs(t) <= TOL) { t = 0; donde = 'extremo'; extremo = nP; }
    else if (Math.abs(t - 1) <= TOL) { t = 1; donde = 'extremo'; extremo = nQ; }
    else if (t > 0 && t < 1) donde = 'dentro';
    else { donde = 'fuera'; lado = t < 0 ? nP : nQ; }
    const pie = suma(P, por(u, t));
    const longitud = Math.abs(pvec(u, resta(V, P))) / L;   // = 2·área / base
    // Cuánto hay que prolongar la base para que llegue al pie (0 si cae dentro o en un extremo).
    const prolongacion = donde === 'fuera' ? (t < 0 ? -t : t - 1) * L : 0;
    return {
      pie: { x: limpio(pie.x, L), y: limpio(pie.y, L) }, longitud, t, donde, extremo, lado, prolongacion,
      base: L,
      errores: {
        // GE7: tomar un lado como altura (el que va de V a cada extremo de la base)
        ladoHastaP: distancia(V, P), ladoHastaQ: distancia(V, Q),
        // GE8: creer que la altura cae en el punto medio de la base
        hastaPuntoMedio: distancia(V, medio(P, Q)),
      },
    };
  }
  function altura(A, B, C) { const [a, b, c] = tres(A, B, C); return alturaDesde(a, b, c, 'B', 'C'); }

  // ---------- Mediana ----------
  function medianaDesde(V, P, Q) {
    const M = medio(P, Q), lp = distancia(V, P), lq = distancia(V, Q), base = distancia(P, Q);
    return {
      punto: M, longitud: distancia(V, M),
      // Fórmula de la mediana: m² = (2·b² + 2·c² − a²)/4
      formula: Math.sqrt((2 * lp * lp + 2 * lq * lq - base * base) / 4),
      mitades: [base / 2, base / 2],
    };
  }
  function mediana(A, B, C) { const [a, b, c] = tres(A, B, C); return medianaDesde(a, b, c); }

  // ---------- Bisectriz interior ----------
  // Corta a PQ en D con PD/DQ = VP/VQ (teorema de la bisectriz).
  function bisectrizDesde(V, P, Q) {
    const lp = distancia(V, P), lq = distancia(V, Q), base = distancia(P, Q);
    const PD = base * lp / (lp + lq), DQ = base * lq / (lp + lq);
    const D = suma(P, por(resta(Q, P), lp / (lp + lq)));
    const cosV = pesc(resta(P, V), resta(Q, V)) / (lp * lq);
    const mitad = Math.acos(Math.max(-1, Math.min(1, cosV))) / 2;
    return {
      punto: D, segmentos: [PD, DQ], longitud: distancia(V, D),
      // Dos fórmulas: l² = bc·(1 − (a/(b + c))²) y l = 2bc·cos(V/2)/(b + c)
      formula: Math.sqrt(lp * lq * (1 - Math.pow(base / (lp + lq), 2))),
      formulaCoseno: 2 * lp * lq * Math.cos(mitad) / (lp + lq),
      angulos: [mitad * 180 / Math.PI, mitad * 180 / Math.PI],
      errores: { mitad: base / 2 },   // GE8: creer que la bisectriz corta el lado opuesto en su punto medio
    };
  }
  function bisectriz(A, B, C) { const [a, b, c] = tres(A, B, C); return bisectrizDesde(a, b, c); }

  // ---------- Triángulo completo ----------
  function anguloEn(V, P, Q) {
    const u = resta(P, V), v = resta(Q, V);
    return Math.atan2(Math.abs(pvec(u, v)), pesc(u, v)) * 180 / Math.PI;
  }
  function triangulo(A0, B0, C0) {
    const [A, B, C, escala] = tres(A0, B0, C0);
    const a = distancia(B, C), b = distancia(C, A), c = distancia(A, B);
    const angulos = { A: anguloEn(A, B, C), B: anguloEn(B, C, A), C: anguloEn(C, A, B) };
    // Tipo por ángulos: se compara el cuadrado del lado mayor con la suma de los otros dos (sin trigonometría).
    const L = [['A', a], ['B', b], ['C', c]].sort((p, q) => q[1] - p[1]);
    const mayor = L[0][1] * L[0][1], otros = L[1][1] * L[1][1] + L[2][1] * L[2][1];
    let tipoAngulo, verticeRecto = null, verticeObtuso = null;
    if (igual(mayor, otros)) { tipoAngulo = 'rectángulo'; verticeRecto = L[0][0]; }
    else if (mayor > otros) { tipoAngulo = 'obtusángulo'; verticeObtuso = L[0][0]; }
    else tipoAngulo = 'acutángulo';
    const ab = igual(a, b), bc = igual(b, c), ca = igual(c, a);
    const tipoLados = ab && bc ? 'equilátero' : (ab || bc || ca ? 'isósceles' : 'escaleno');
    // En un isósceles, el vértice "de arriba" es el que está entre los dos lados iguales.
    const verticeIsosceles = tipoLados === 'isósceles' ? (igual(b, c) ? 'A' : igual(a, c) ? 'B' : 'C') : null;

    const alturas = { A: alturaDesde(A, B, C, 'B', 'C'), B: alturaDesde(B, C, A, 'C', 'A'), C: alturaDesde(C, A, B, 'A', 'B') };
    const medianas = { A: medianaDesde(A, B, C), B: medianaDesde(B, C, A), C: medianaDesde(C, A, B) };
    const bisectrices = { A: bisectrizDesde(A, B, C), B: bisectrizDesde(B, C, A), C: bisectrizDesde(C, A, B) };
    const s = areaConSigno(A, B, C), area = Math.abs(s);

    // Puntos notables
    const baricentro = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
    const per = a + b + c;
    const incentro = { x: (a * A.x + b * B.x + c * C.x) / per, y: (a * A.y + b * B.y + c * C.y) / per };
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    const n2 = P => P.x * P.x + P.y * P.y;
    const O = {
      x: (n2(A) * (B.y - C.y) + n2(B) * (C.y - A.y) + n2(C) * (A.y - B.y)) / d,
      y: (n2(A) * (C.x - B.x) + n2(B) * (A.x - C.x) + n2(C) * (B.x - A.x)) / d,
    };
    // Recta de Euler: H = A + B + C − 2·O
    let H = { x: A.x + B.x + C.x - 2 * O.x, y: A.y + B.y + C.y - 2 * O.y };
    let ortoDonde = 'dentro', ortoVertice = null;
    if (verticeRecto) { ortoDonde = 'vertice'; ortoVertice = verticeRecto; H = { A, B, C }[verticeRecto]; }
    else if (verticeObtuso) ortoDonde = 'fuera';
    const limpiar = P => ({ x: limpio(P.x, escala), y: limpio(P.y, escala) });
    const fuera = ['A', 'B', 'C'].filter(k => alturas[k].donde === 'fuera').length;

    return {
      vertices: { A, B, C },
      lados: { a, b, c }, perimetro: per,
      angulos, sumaAngulos: angulos.A + angulos.B + angulos.C,
      tipoAngulo, verticeRecto, verticeObtuso, tipoLados, verticeIsosceles,
      // Área: base BC por la altura desde A, entre 2; y por coordenadas
      area: a * alturas.A.longitud / 2, areaCoordenadas: area, sentido: s > 0 ? 'antihorario' : 'horario',
      alturas, medianas, bisectrices, alturasFuera: fuera,
      baricentro: limpiar(baricentro),
      ortocentro: Object.assign(limpiar(H), { donde: ortoDonde, vertice: ortoVertice }),
      circuncentro: Object.assign(limpiar(O), { radio: a * b * c / (4 * area) }),
      incentro: Object.assign(limpiar(incentro), { radio: 2 * area / per }),
      errores: {
        areaSinMitad: a * alturas.A.longitud,       // olvida dividir entre 2 (hipótesis)
        areaConAB: a * c / 2,                        // GE7: toma el lado AB como altura de la base BC
        areaConAC: a * b / 2,                        // GE7: toma el lado AC como altura de la base BC
      },
    };
  }

  // ---------- Triángulo rectángulo: relaciones métricas ----------
  // catetos [a, b], hipotenusa c, proyecciones m (de a) y n (de b) sobre la hipotenusa, altura h a la hipotenusa.
  function positivo(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function rectangulo(o) {
    o = o || {};
    let a, b, c, m, n;
    const errores = {};
    if (o.catetos) {
      a = positivo(o.catetos[0], 'el cateto'); b = positivo(o.catetos[1], 'el cateto'); c = Math.hypot(a, b);
    } else if (o.proyecciones) {
      m = positivo(o.proyecciones[0], 'la proyección'); n = positivo(o.proyecciones[1], 'la proyección');
      c = m + n; a = Math.sqrt(m * c); b = Math.sqrt(n * c);
    } else if (o.hipotenusa !== undefined && o.cateto !== undefined) {
      c = positivo(o.hipotenusa, 'la hipotenusa'); a = positivo(o.cateto, 'el cateto');
      if (a >= c) throw new Error('el cateto debe ser menor que la hipotenusa');
      b = Math.sqrt(c * c - a * a);
      errores.pitagorasSuma = Math.sqrt(c * c + a * a);   // GE11: suma cuando la incógnita es un cateto
    } else if (o.hipotenusa !== undefined && o.proyeccion !== undefined) {
      c = positivo(o.hipotenusa, 'la hipotenusa'); m = positivo(o.proyeccion, 'la proyección');
      if (m >= c) throw new Error('la proyección debe ser menor que la hipotenusa');
      n = c - m; a = Math.sqrt(m * c); b = Math.sqrt(n * c);
    } else throw new Error('faltan datos: catetos, proyecciones, hipotenusa y cateto, o hipotenusa y proyeccion');
    if (m === undefined) { m = a * a / c; n = b * b / c; }
    const h = a * b / c;
    return {
      catetos: [a, b], hipotenusa: c, proyecciones: [m, n], altura: h, area: a * b / 2,
      // comprobaciones de las tres relaciones (deben dar lo mismo a cada lado)
      relaciones: { hCuadrado: h * h, mPorN: m * n, aCuadrado: a * a, cPorM: c * m, bCuadrado: b * b, cPorN: c * n, abSobreC: a * b / c },
      mediana: c / 2,                                       // la mediana a la hipotenusa mide la mitad de ella
      bisectrizRecto: Math.SQRT2 * a * b / (a + b),
      segmentosBisectriz: [c * a / (a + b), c * b / (a + b)],
      errores: Object.assign(errores, {
        hPromedioProyecciones: (m + n) / 2,                 // GE18: la altura como promedio de m y n
        hPromedioCatetos: (a + b) / 2,                      // hipótesis cercana a GE18
        catetoConMN: Math.sqrt(m * n),                      // GE18: cateto² = m·n en vez de m·c
        bisectrizMitad: c / 2,                              // GE8: la bisectriz parte la hipotenusa por la mitad
        hEsMediana: c / 2,                                  // GE8: la altura a la hipotenusa es la mediana
      }),
    };
  }

  // ---------- Transformaciones ----------
  function medidas(A, B, C) {
    const t = triangulo(A, B, C);
    return { A: t.vertices.A, B: t.vertices.B, C: t.vertices.C, lados: t.lados, angulos: t.angulos, area: t.area,
      tipoAngulo: t.tipoAngulo, tipoLados: t.tipoLados };
  }
  // A se mueve una distancia d (con signo, en el sentido de B hacia C) por la recta paralela a BC.
  function moverEnParalela(A0, B0, C0, d) {
    const [A, B, C] = tres(A0, B0, C0);
    if (typeof d !== 'number' || !Number.isFinite(d)) throw new Error('la distancia d debe ser un número');
    const u = resta(C, B), L = Math.hypot(u.x, u.y);
    const A2 = suma(A, por(u, d / L));
    const antes = triangulo(A, B, C), despues = triangulo(A2, B, C);
    return { A: A2, area: despues.area, areaAntes: antes.area, altura: despues.alturas.A.longitud,
      alturaAntes: antes.alturas.A.longitud, triangulo: despues };
  }
  // Gira los tres vértices un ángulo (grados, antihorario) alrededor de un centro (por defecto, el baricentro).
  function rotar(A0, B0, C0, grados, centro) {
    const [A, B, C] = tres(A0, B0, C0);
    if (typeof grados !== 'number' || !Number.isFinite(grados)) throw new Error('el ángulo debe ser un número');
    const O = centro === undefined ? { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 } : punto(centro, 'centro');
    const r = grados * Math.PI / 180, co = Math.cos(r), si = Math.sin(r);
    const esc = Math.max(distancia(A, B), distancia(B, C), distancia(C, A), Math.hypot(O.x, O.y));
    const g = P => { const v = resta(P, O); return { x: limpio(O.x + v.x * co - v.y * si, esc), y: limpio(O.y + v.x * si + v.y * co, esc) }; };
    return medidas(g(A), g(B), g(C));
  }
  // P = B + t·(C − B), con 0 < t < 1, parte el triángulo en ABP y APC.
  function partirArea(A0, B0, C0, t) {
    const [A, B, C] = tres(A0, B0, C0);
    if (typeof t !== 'number' || !(t > 0 && t < 1)) throw new Error('t debe estar entre 0 y 1 (sin incluirlos)');
    const P = suma(B, por(resta(C, B), t));
    const a1 = Math.abs(areaConSigno(A, B, P)), a2 = Math.abs(areaConSigno(A, P, C));
    return { P, areas: [a1, a2], razon: a1 / a2, segmentos: [distancia(B, P), distancia(P, C)], total: a1 + a2 };
  }

  // Azar con semilla (para las pruebas y para la escena).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return { TOL, triangulo, altura, mediana, bisectriz, rectangulo, moverEnParalela, rotar, partirArea, medidas,
    areaConSigno: (A, B, C) => areaConSigno(punto(A), punto(B), punto(C)), distancia: (P, Q) => distancia(punto(P), punto(Q)), azar };
});
