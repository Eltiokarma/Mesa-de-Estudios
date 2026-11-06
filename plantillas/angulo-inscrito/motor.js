/*
 * Motor de «El ángulo que no cambia»: ángulos en la circunferencia, longitud de arco y sector.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorAngulo) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Convenciones. La circunferencia tiene centro O (por defecto el origen) y radio r (por defecto 1).
 * Un punto de la circunferencia se da por su ángulo en grados, medido desde el eje x en sentido
 * antihorario (A a 220° quiere decir A = O + r·(cos 220°, sen 220°)). Un punto cualquiera es { x, y }
 * o [x, y]. Todos los ángulos salen en grados.
 *
 *   puntoEn(ang, r, O) · anguloDe(P, O) · proyectar(X, r, O)   puntos sobre la curva
 *   arcos(a, b, p)                el arco menor y el mayor que deja la cuerda AB, y en cuál está P
 *   central(a, b, r, O)           ángulo central AOB (por coordenadas)
 *   inscrito(a, b, p, r, O)       ángulo APB por coordenadas y por la fórmula (arco que abarca)/2;
 *                                 P puede estar en cualquiera de los dos arcos
 *   semiinscrito(a, b, r, O)      ángulo entre la tangente en A y la cuerda AB
 *   dosRectas(Q, d1, d2, r, O)    dos rayos desde Q con direcciones d1 y d2 (grados): los puntos de
 *                                 corte, los arcos y el ángulo, con Q dentro (interior), fuera
 *                                 (exterior: dos secantes, secante y tangente o dos tangentes) o sobre
 *                                 la circunferencia (inscrito o semiinscrito)
 *   rectasPorPuntos(a1, a2, b1, b2, r, O)  recta por los puntos a1 y a2 y recta por b1 y b2: dónde se
 *                                 cortan (Q) y el ángulo entre los rayos de Q hacia a1 y hacia b1
 *   exteriorConArcos(lejano, cercano, r, giro) · interiorConArcos(arco1, arco2, r, giro)
 *                                 arman la figura con esos arcos y la miden con coordenadas
 *   interior(arco1, arco2) · exterior(lejano, cercano) · dosTangentes(cercano)   solo las fórmulas
 *   tangentes(Q, r, O)            las dos tangentes desde un punto exterior
 *   anguloDesde(X, a, b, r, O)    ángulo AXB desde cualquier punto (el «ángulo de la cancha»)
 *   cuadrilatero([a, b, c, d], r, O)  cuadrilátero inscrito: sus ángulos opuestos suman 180°
 *   longitudArco(θ, r) · sector(θ, r)  θ/360·2πr y θ/360·πr², con el coeficiente de π aparte
 *
 * Cada resultado trae un campo 'errores' con lo que dan los errores típicos de
 * docs/investigacion/geometria-ideas-erroneas.md (GE12, GE15, GE16, GE19) y algunas hipótesis
 * nuestras: son las opciones incorrectas de las predicciones.
 *
 * Tolerancia: «sobre la circunferencia», «tangente», «diámetro» y «A y B coinciden» se deciden con una
 * tolerancia relativa de 1e-9.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAngulo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const RAD = Math.PI / 180;

  // ---------- Entradas ----------
  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) { numero(x, que); if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`); return x; }
  function punto(p, nombre) {
    let x, y;
    if (Array.isArray(p)) { x = p[0]; y = p[1]; }
    else if (p && typeof p === 'object') { x = p.x; y = p.y; }
    if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y))
      throw new Error(`el punto ${nombre} debe tener coordenadas numéricas x e y`);
    return { x: x + 0, y: y + 0 };
  }
  function circ(r, O) {
    return { r: r === undefined ? 1 : positivo(r, 'el radio'), O: O === undefined ? { x: 0, y: 0 } : punto(O, 'O') };
  }

  // ---------- Vectores ----------
  const resta = (P, Q) => ({ x: P.x - Q.x, y: P.y - Q.y });
  const pesc = (u, v) => u.x * v.x + u.y * v.y;
  const pvec = (u, v) => u.x * v.y - u.y * v.x;
  const distancia = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
  // Ángulo entre dos vectores, de 0° a 180°.
  const entre = (u, v) => Math.atan2(Math.abs(pvec(u, v)), pesc(u, v)) / RAD;
  const limpio = (x, esc) => (Math.abs(x) <= TOL * (esc || 1) ? 0 : x + 0);

  // Ángulo normalizado a [0, 360).
  function n360(a) {
    let x = a % 360; if (x < 0) x += 360;
    if (360 - x <= 1e-12) x = 0;
    return x + 0;
  }
  // Recorrido antihorario de a a b, en (0, 360).
  const ccw = (a, b) => n360(b - a);
  // ¿Está el ángulo p en el recorrido antihorario de a a b (sin los extremos)?
  const enRecorrido = (a, b, p) => { const d = ccw(a, b), e = ccw(a, p); return e > 0 && e < d; };
  // Medida del arco que va de a a b sin pasar por p.
  const arcoSin = (a, b, p) => (enRecorrido(a, b, p) ? 360 - ccw(a, b) : ccw(a, b));

  function puntoEn(ang, r, O) {
    numero(ang, 'el ángulo'); const c = circ(r, O);
    return { x: limpio(c.O.x + c.r * Math.cos(ang * RAD), c.r), y: limpio(c.O.y + c.r * Math.sin(ang * RAD), c.r) };
  }
  function anguloDe(P, O) {
    P = punto(P, 'P'); const o = O === undefined ? { x: 0, y: 0 } : punto(O, 'O');
    if (P.x === o.x && P.y === o.y) throw new Error('el punto coincide con el centro: no tiene ángulo');
    return n360(Math.atan2(P.y - o.y, P.x - o.x) / RAD);
  }
  // El punto de la circunferencia más cercano a X (para "ajustar a la curva" al arrastrar).
  function proyectar(X, r, O) {
    const c = circ(r, O), ang = anguloDe(X, c.O);
    return { angulo: ang, punto: puntoEn(ang, c.r, c.O), distancia: distancia(punto(X, 'X'), c.O) - c.r };
  }

  function distintos(a, b, nA, nB) {
    numero(a, `el ángulo de ${nA}`); numero(b, `el ángulo de ${nB}`);
    const d = ccw(a, b);
    if (d <= TOL * 360 || 360 - d <= TOL * 360) throw new Error(`${nA} y ${nB} coinciden`);
  }

  // ---------- Arcos de una cuerda ----------
  function arcos(a, b, p) {
    distintos(a, b, 'A', 'B');
    const d = ccw(a, b), menor = Math.min(d, 360 - d), mayor = 360 - menor;
    const r = { menor, mayor, antihorario: d, esDiametro: Math.abs(menor - 180) <= TOL * 180 };
    if (p !== undefined) {
      distintos(a, p, 'A', 'P'); distintos(b, p, 'B', 'P');
      const conP = enRecorrido(a, b, p) ? d : 360 - d;
      r.arcoConP = conP; r.arcoSinP = 360 - conP;
      r.pEnArco = r.esDiametro ? 'semicircunferencia' : (conP > 180 ? 'mayor' : 'menor');
    }
    return r;
  }

  // ---------- Ángulo central ----------
  function central(a, b, r, O) {
    const c = circ(r, O), ar = arcos(a, b);
    const A = puntoEn(a, c.r, c.O), B = puntoEn(b, c.r, c.O);
    return { angulo: entre(resta(A, c.O), resta(B, c.O)), menor: ar.menor, mayor: ar.mayor, A, B };
  }

  // ---------- Ángulo inscrito ----------
  // P en el arco mayor: ∠APB = (arco menor)/2. P en el menor: ∠APB = (arco mayor)/2 = 180° − (arco menor)/2.
  function inscrito(a, b, p, r, O) {
    const c = circ(r, O), ar = arcos(a, b, p);
    const A = puntoEn(a, c.r, c.O), B = puntoEn(b, c.r, c.O), P = puntoEn(p, c.r, c.O);
    const porCoordenadas = entre(resta(A, P), resta(B, P));
    const abarcado = ar.arcoSinP;
    return {
      angulo: abarcado / 2, porCoordenadas, arcoAbarcado: abarcado, arcoConP: ar.arcoConP, pEnArco: ar.pEnArco,
      recto: ar.esDiametro, central: entre(resta(A, c.O), resta(B, c.O)), arcoMenor: ar.menor, arcoMayor: ar.mayor,
      A, B, P,
      errores: {
        igualArco: abarcado,            // GE15: el inscrito igual al arco (o al central que lo abarca)
        dobleArco: 2 * abarcado,        // GE15 al revés: el doble en vez de la mitad
        igualCentral: ar.menor,         // GE15: igual al ángulo central AOB dibujado (el menor de 180°)
        mitadDelOtroArco: ar.arcoConP / 2, // hipótesis: usa el arco donde está P (o siempre el menor)
      },
    };
  }

  // ---------- Ángulo semiinscrito (tangente en A y cuerda AB) ----------
  function semiinscrito(a, b, r, O) {
    const c = circ(r, O), ar = arcos(a, b);
    const A = puntoEn(a, c.r, c.O), B = puntoEn(b, c.r, c.O);
    // tangente en A, en el sentido antihorario: apunta hacia el lado del recorrido antihorario de A a B
    const t = { x: -Math.sin(a * RAD), y: Math.cos(a * RAD) }, menos = { x: -t.x, y: -t.y };
    const AB = resta(B, A);
    const haciaCcw = entre(t, AB), haciaCw = entre(menos, AB);
    const ccwEsMenor = ar.antihorario <= 180;
    return {
      angulo: ar.menor / 2,
      haciaMenor: ccwEsMenor ? haciaCcw : haciaCw, haciaMayor: ccwEsMenor ? haciaCw : haciaCcw,
      porArcos: { menor: ar.menor / 2, mayor: ar.mayor / 2 }, arcoMenor: ar.menor,
      // ¿la tangente es perpendicular al radio OA? (cálculo de control)
      tangentePorRadio: pesc(t, resta(A, c.O)) / c.r,
      errores: { igualArco: ar.menor, perpendicular: 90, otroLado: ar.mayor / 2 },
    };
  }

  // ---------- Dos rayos desde Q ----------
  function cortes(Q, u, c) {
    // |Q − O + t·u|² = r²  →  t² + 2t(u·w) + |w|² − r² = 0
    const w = resta(Q, c.O), bq = pesc(u, w), cq = pesc(w, w) - c.r * c.r, disc = bq * bq - cq;
    const esc = c.r * c.r + pesc(w, w);
    if (disc < -TOL * esc) return { n: 0 };
    if (disc <= TOL * esc) return { n: 1, t: [-bq, -bq] };
    const s = Math.sqrt(disc);
    return { n: 2, t: [-bq - s, -bq + s] };
  }
  const en = (Q, u, t) => ({ x: Q.x + u.x * t, y: Q.y + u.y * t });

  function dosRectas(Q0, d1, d2, r, O) {
    const c = circ(r, O), Q = punto(Q0, 'Q');
    numero(d1, 'la dirección 1'); numero(d2, 'la dirección 2');
    const u1 = { x: Math.cos(d1 * RAD), y: Math.sin(d1 * RAD) }, u2 = { x: Math.cos(d2 * RAD), y: Math.sin(d2 * RAD) };
    if (Math.abs(pvec(u1, u2)) <= 1e-12) throw new Error('las dos rectas son la misma: forman un ángulo de 0° o de 180°');
    const angulo = entre(u1, u2), dist = distancia(Q, c.O);
    const posicion = Math.abs(dist - c.r) <= TOL * c.r ? 'sobre' : (dist < c.r ? 'dentro' : 'fuera');
    const ang = P => anguloDe(P, c.O);
    const k1 = cortes(Q, u1, c), k2 = cortes(Q, u2, c);
    const base = { posicion, angulo, distancia: dist, Q };

    if (posicion === 'dentro') {
      const A = en(Q, u1, k1.t[1]), C = en(Q, u1, k1.t[0]), B = en(Q, u2, k2.t[1]), D = en(Q, u2, k2.t[0]);
      const a = ang(A), b = ang(B), cc = ang(C), d = ang(D);
      const entreLados = arcoSin(a, b, cc), opuesto = arcoSin(cc, d, a);
      return Object.assign(base, {
        tipo: 'interior', subtipo: 'dos cuerdas', porArcos: (entreLados + opuesto) / 2,
        arcos: { entreLados, opuesto }, arco1: entreLados, arco2: opuesto,
        puntos: { A, B, C, D }, angulos: { A: a, B: b, C: cc, D: d },
        errores: { resta: Math.abs(entreLados - opuesto) / 2, sinDividir: entreLados + opuesto, soloUnArco: entreLados / 2 },
      });
    }

    if (posicion === 'fuera') {
      [[k1, 1], [k2, 2]].forEach(([k, i]) => {
        if (k.n === 0) throw new Error(`la recta ${i} no corta la circunferencia`);
        if (k.t[1] < 0) throw new Error(`el rayo ${i} no va hacia la circunferencia`);
      });
      const tan1 = k1.n === 1, tan2 = k2.n === 1;
      const A = en(Q, u1, k1.t[1]), C = en(Q, u1, k1.t[0]), B = en(Q, u2, k2.t[1]), D = en(Q, u2, k2.t[0]);
      const a = ang(A), b = ang(B), cc = tan1 ? a : ang(C), d = tan2 ? b : ang(D);
      let lejano, cercano;
      if (!tan1) { lejano = arcoSin(a, b, cc); cercano = arcoSin(cc, d, a); }
      else if (!tan2) { lejano = arcoSin(a, b, d); cercano = arcoSin(cc, d, b); }
      else { cercano = arcos(a, b).menor; lejano = 360 - cercano; }   // dos tangentes: el cercano es el menor
      const subtipo = tan1 && tan2 ? 'dos tangentes' : (tan1 || tan2 ? 'secante y tangente' : 'dos secantes');
      return Object.assign(base, {
        tipo: 'exterior', subtipo, tangentes: [tan1, tan2], porArcos: (lejano - cercano) / 2,
        arcos: { lejano, cercano }, arco1: lejano, arco2: cercano,
        puntos: { A, B, C: tan1 ? A : C, D: tan2 ? B : D }, angulos: { A: a, B: b, C: cc, D: d },
        errores: { suma: (lejano + cercano) / 2, sinDividir: lejano - cercano, sumaSinDividir: lejano + cercano },
      });
    }

    // Q sobre la circunferencia: cada recta la corta en Q y en otro punto (o es tangente en Q).
    const w = resta(Q, c.O), q = ang(Q);
    const otro = (u, i) => {
      const t = -2 * pesc(u, w);
      if (Math.abs(t) <= TOL * c.r) return null;   // tangente en Q
      if (t < 0) throw new Error(`el rayo ${i} no va hacia la circunferencia`);
      return en(Q, u, t);
    };
    const X1 = otro(u1, 1), X2 = otro(u2, 2);
    if (X1 && X2) {
      const a = ang(X1), b = ang(X2), abarcado = arcoSin(a, b, q);
      return Object.assign(base, {
        tipo: 'inscrito', subtipo: 'dos cuerdas', porArcos: abarcado / 2, arcos: { abarcado }, arco1: abarcado, arco2: null,
        puntos: { A: X1, B: X2 }, angulos: { A: a, B: b, Q: q },
        errores: { igualArco: abarcado, dobleArco: 2 * abarcado },
      });
    }
    // semiinscrito: una recta es tangente en Q; el arco es el que queda del lado del rayo tangente
    const [ut, X] = X1 ? [u2, X1] : [u1, X2];
    const x = ang(X), m1 = n360(q + ccw(q, x) / 2), M1 = puntoEn(m1, c.r, c.O);
    const uc = resta(X, Q);
    const mismoLado = Math.sign(pvec(uc, resta(M1, Q))) === Math.sign(pvec(uc, ut));
    const abarcado = mismoLado ? ccw(q, x) : 360 - ccw(q, x);
    return Object.assign(base, {
      tipo: 'semiinscrito', subtipo: 'tangente y cuerda', porArcos: abarcado / 2, arcos: { abarcado }, arco1: abarcado, arco2: null,
      puntos: X1 ? { A: X1 } : { B: X2 }, angulos: { Q: q, X: x },
      errores: { igualArco: abarcado, perpendicular: 90 },
    });
  }

  // Recta por los puntos de la circunferencia a1 y a2, y recta por b1 y b2.
  function rectasPorPuntos(a1, a2, b1, b2, r, O) {
    const c = circ(r, O);
    [[a1, a2, 1], [b1, b2, 2]].forEach(([x, y, i]) => {
      numero(x, `el ángulo del primer punto de la recta ${i}`); numero(y, `el ángulo del segundo punto de la recta ${i}`);
      const d = ccw(x, y);
      if (d <= TOL * 360 || 360 - d <= TOL * 360) throw new Error(`los dos puntos de la recta ${i} coinciden`);
    });
    const P1 = puntoEn(a1, c.r, c.O), P2 = puntoEn(a2, c.r, c.O), R1 = puntoEn(b1, c.r, c.O), R2 = puntoEn(b2, c.r, c.O);
    const u = resta(P2, P1), v = resta(R2, R1), den = pvec(u, v);
    if (Math.abs(den) <= 1e-12 * c.r * c.r) throw new Error('las dos rectas son paralelas: no se cortan');
    const s = pvec(resta(R1, P1), v) / den, Q = { x: P1.x + u.x * s, y: P1.y + u.y * s };
    // los rayos van de Q hacia a1 y hacia b1 (si Q es a1 o b1, hacia el otro punto de su recta)
    const dir = (X, Y) => { const d = resta(X, Q); return Math.hypot(d.x, d.y) <= TOL * c.r ? resta(Y, Q) : d; };
    const d1 = dir(P1, P2), d2 = dir(R1, R2);
    const res = dosRectas(Q, Math.atan2(d1.y, d1.x) / RAD, Math.atan2(d2.y, d2.x) / RAD, c.r, c.O);
    return res;
  }

  // Figura con dos secantes desde fuera: arco lejano AB y cercano CD, simétrica respecto de la recta OQ,
  // con el arco lejano centrado en el ángulo 'giro'. A y C van en la recta 1, B y D en la recta 2.
  function exteriorConArcos(lejano, cercano, r, giro) {
    positivo(lejano, 'el arco lejano'); positivo(cercano, 'el arco cercano');
    if (!(lejano > cercano)) throw new Error('el arco lejano debe ser mayor que el cercano');
    if (!(lejano + cercano < 360)) throw new Error('los dos arcos deben sumar menos de 360°');
    const g = giro === undefined ? 0 : numero(giro, 'el giro');
    const a = n360(g + lejano / 2), b = n360(g - lejano / 2), cc = n360(g + 180 - cercano / 2), d = n360(g + 180 + cercano / 2);
    return Object.assign(rectasPorPuntos(a, cc, b, d, r), { construccion: { A: a, B: b, C: cc, D: d } });
  }
  // Dos cuerdas AC y BD que se cortan dentro: arco AB (entre los lados del ángulo AQB) y arco CD (el opuesto).
  function interiorConArcos(arco1, arco2, r, giro) {
    positivo(arco1, 'el arco AB'); positivo(arco2, 'el arco CD');
    if (!(arco1 + arco2 < 360)) throw new Error('los dos arcos deben sumar menos de 360°');
    const g = giro === undefined ? 0 : numero(giro, 'el giro');
    const a = n360(g + arco1 / 2), b = n360(g - arco1 / 2), cc = n360(g + 180 + arco2 / 2), d = n360(g + 180 - arco2 / 2);
    return Object.assign(rectasPorPuntos(a, cc, b, d, r), { construccion: { A: a, B: b, C: cc, D: d } });
  }

  // ---------- Solo las fórmulas ----------
  function interior(arco1, arco2) {
    positivo(arco1, 'el arco'); positivo(arco2, 'el arco');
    if (!(arco1 + arco2 < 360)) throw new Error('los dos arcos deben sumar menos de 360°');
    return { angulo: (arco1 + arco2) / 2,
      errores: { resta: Math.abs(arco1 - arco2) / 2, sinDividir: arco1 + arco2, soloUnArco: arco1 / 2 } };
  }
  function exterior(lejano, cercano) {
    positivo(lejano, 'el arco lejano'); numero(cercano, 'el arco cercano');
    if (cercano < 0) throw new Error('el arco cercano no puede ser negativo');
    if (!(lejano > cercano)) throw new Error('el arco lejano debe ser mayor que el cercano');
    if (lejano + cercano > 360 + TOL) throw new Error('los dos arcos no pueden sumar más de 360°');
    return { angulo: (lejano - cercano) / 2,
      errores: { suma: (lejano + cercano) / 2, sinDividir: lejano - cercano, sumaSinDividir: lejano + cercano } };
  }
  // Dos tangentes desde Q: el arco cercano es el menor; el lejano, el resto.
  function dosTangentes(cercano) {
    positivo(cercano, 'el arco cercano');
    if (!(cercano < 180)) throw new Error('con dos tangentes, el arco cercano es menor de 180°');
    const lejano = 360 - cercano;
    return { angulo: (lejano - cercano) / 2, lejano, cercano, suplemento: 180 - cercano,
      errores: { mitadCercano: cercano / 2, igualCercano: cercano, sinDividir: lejano - cercano, suma: (lejano + cercano) / 2 } };
  }

  // ---------- Tangentes desde un punto exterior ----------
  function tangentes(Q0, r, O) {
    const c = circ(r, O), Q = punto(Q0, 'Q'), d = distancia(Q, c.O);
    if (!(d > c.r * (1 + TOL))) throw new Error('Q debe estar fuera de la circunferencia');
    const q = anguloDe(Q, c.O), m = Math.acos(c.r / d) / RAD;   // ángulo entre OQ y OT
    const t1 = n360(q + m), t2 = n360(q - m), T1 = puntoEn(t1, c.r, c.O), T2 = puntoEn(t2, c.r, c.O);
    const L1 = distancia(Q, T1), L2 = distancia(Q, T2);
    const res = dosRectas(Q, Math.atan2(T1.y - Q.y, T1.x - Q.x) / RAD, Math.atan2(T2.y - Q.y, T2.x - Q.x) / RAD, c.r, c.O);
    return { puntos: [T1, T2], angulos: [t1, t2], longitudes: [L1, L2], longitud: Math.sqrt(d * d - c.r * c.r),
      angulo: entre(resta(T1, Q), resta(T2, Q)), cercano: 2 * m, lejano: 360 - 2 * m,
      perpendicular: [pesc(resta(T1, Q), resta(T1, c.O)), pesc(resta(T2, Q), resta(T2, c.O))],
      dosRectas: res };
  }

  // ---------- El ángulo desde cualquier punto («la cancha») ----------
  // Ángulo AXB. Los puntos de la circunferencia que están del mismo lado de AB que X ven AB con
  // 'inscrito' = (arco AB del otro lado)/2; X dentro del círculo lo ve mayor y X fuera, menor.
  function anguloDesde(X0, a, b, r, O) {
    const c = circ(r, O), X = punto(X0, 'X'); distintos(a, b, 'A', 'B');
    const A = puntoEn(a, c.r, c.O), B = puntoEn(b, c.r, c.O), AB = resta(B, A);
    const lado = pvec(AB, resta(X, A));
    if (Math.abs(lado) <= TOL * pesc(AB, AB)) throw new Error('X está en la recta AB: no se ve ningún ángulo');
    const angulo = entre(resta(A, X), resta(B, X));
    // arco AB del lado opuesto a X (el que abarcan los puntos de la curva del lado de X)
    const m = n360(a + ccw(a, b) / 2), M = puntoEn(m, c.r, c.O);
    const mismoLado = Math.sign(pvec(AB, resta(M, A))) === Math.sign(lado);
    const abarcado = mismoLado ? 360 - ccw(a, b) : ccw(a, b);
    const ins = abarcado / 2, dist = distancia(X, c.O);
    const posicion = Math.abs(dist - c.r) <= TOL * c.r ? 'sobre' : (dist < c.r ? 'dentro' : 'fuera');
    let comparado = 'igual';
    if (Math.abs(angulo - ins) > 1e-7) comparado = angulo > ins ? 'mayor' : 'menor';
    return { angulo, inscrito: ins, arcoAbarcado: abarcado, posicion, comparado, distancia: dist };
  }

  // ---------- Cuadrilátero inscrito ----------
  // Vértices en orden (antihorario u horario). El ángulo en cada vértice abarca el arco entre sus dos
  // vecinos que no lo contiene; los opuestos abarcan arcos que suman 360°, así que suman 180°.
  function cuadrilatero(vs, r, O) {
    const c = circ(r, O);
    if (!Array.isArray(vs) || vs.length !== 4) throw new Error('el cuadrilátero necesita los ángulos de sus cuatro vértices');
    vs.forEach((v, i) => numero(v, `el ángulo del vértice ${i + 1}`));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) distintos(vs[i], vs[j], `el vértice ${i + 1}`, `el ${j + 1}`);
    // en orden: recorriendo desde el primero, los demás van en un solo sentido
    const ida = [1, 2, 3].map(i => ccw(vs[0], vs[i]));
    const orden = (ida[0] < ida[1] && ida[1] < ida[2]) || (ida[0] > ida[1] && ida[1] > ida[2]);
    if (!orden) throw new Error('los vértices no están en orden: el cuadrilátero se cruza');
    const P = vs.map(v => puntoEn(v, c.r, c.O));
    const angulos = [], porArcos = [];
    for (let i = 0; i < 4; i++) {
      const ant = (i + 3) % 4, sig = (i + 1) % 4;
      angulos.push(entre(resta(P[ant], P[i]), resta(P[sig], P[i])));
      porArcos.push(arcoSin(vs[ant], vs[sig], vs[i]) / 2);
    }
    return { angulos, porArcos, opuestos: [angulos[0] + angulos[2], angulos[1] + angulos[3]],
      suma: angulos.reduce((s, x) => s + x, 0),
      errores: { opuestosIguales: [angulos[0], angulos[1]], dobleDelOpuesto: [2 * angulos[0], 2 * angulos[1]], mitadDelOpuesto: [angulos[0] / 2, angulos[1] / 2] } };
  }

  // ---------- Longitud de arco y sector (π aparte: pi = 2 quiere decir 2π) ----------
  function angSector(theta) { positivo(theta, 'el ángulo del sector'); if (theta > 360) throw new Error('el ángulo del sector no puede pasar de 360°'); return theta; }
  function longitudArco(theta, r) {
    angSector(theta); positivo(r, 'el radio');
    const f = theta / 360;
    return { longitud: f * 2 * Math.PI * r, pi: f * 2 * r, fraccion: f, circunferencia: { pi: 2 * r },
      errores: { conDiametro: f * 2 * (2 * r), areaSector: f * r * r, sinFraccion: 2 * r, mitadDelRadio: f * r } };   // en coeficientes de π
  }
  function sector(theta, r) {
    angSector(theta); positivo(r, 'el radio');
    const f = theta / 360;
    return { area: f * Math.PI * r * r, pi: f * r * r, fraccion: f, circulo: { pi: r * r },
      perimetro: { recto: 2 * r, pi: f * 2 * r },   // dos radios más el arco
      errores: { conDiametro: f * (2 * r) * (2 * r), longitudArco: f * 2 * r, sinFraccion: r * r } };   // en coeficientes de π
  }

  // Azar con semilla (para las pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return { TOL, n360, ccw, puntoEn, anguloDe, proyectar, arcos, central, inscrito, semiinscrito, dosRectas, rectasPorPuntos,
    exteriorConArcos, interiorConArcos, interior, exterior, dosTangentes, tangentes, anguloDesde, cuadrilatero,
    longitudArco, sector, distancia: (P, Q) => distancia(punto(P, 'P'), punto(Q, 'Q')), azar };
});
