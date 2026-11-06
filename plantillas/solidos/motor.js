/*
 * Motor de «El sólido que se abre»: prisma, pirámide, cilindro, cono y esfera.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en
 * el navegador (window.MotorSolidos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: las que traiga el problema (cm, m, u); el motor no convierte. En los sólidos con círculos, los
 * campos de 'pi' y de 'respuestas' son el coeficiente de π (cono r = 3, h = 4 → pi.volumen = 12, es decir,
 * 12π u³), para comparar sin decimales; 'lateral', 'total' y 'volumen' traen el número ya multiplicado por π.
 *
 *   prisma({ base, h })                      A_B, perímetro, A_L = 2p·h, A_T, V = A_B·h, caras, vértices y aristas
 *   piramide({ base, h } o { base, ap })     apotema ap, arista lateral, A_L = p·ap, A_T, V = A_B·h/3
 *   cilindro({ r, h })                       largo del rectángulo 2πr, A_L, A_T, V
 *   cono({ r, h } o { r, g })                generatriz g, ángulo del sector, A_L = πrg, A_T, V = πr²h/3
 *   conoDeSector({ g, angulo })              el cono que se arma con un sector circular de radio g
 *   esfera({ r })                            4πr², 4πr³/3 y el cilindro circunscrito (Arquímedes: 2/3)
 *   troncoCono({ R, r, h }), troncoPiramide({ L, l, h })
 *   bloque(a, b, c), cuboPintado(n)          cubitos totales, visibles en el dibujo, ocultos y pintados
 *   poliedro({ tipo, n })                    caras, vértices y aristas; teorema de Euler
 *   hojaEnrollada({ largo, ancho })          la misma hoja enrollada de dos formas: misma A_L, distinto V
 *   desarrollo(tipo, d, f, o)                el sólido que se abre: cada cara en 3D con f de 0 (cerrado) a 1 (abierto)
 *   tresPiramides({ a, h, sep, punta })      una caja a × a × h partida en tres pirámides de igual volumen
 *   aristasUnicas(caras)                     las aristas distintas de un poliedro, para contarlas
 *
 * Base de un prisma o pirámide: { tipo: 'cuadrado', lado }, { tipo: 'rectangulo', largo, ancho },
 * { tipo: 'triangulo', lado } (equilátero), { tipo: 'hexagono', lado } o { tipo: 'regular', n, lado }.
 *
 * Cada resultado que es la respuesta de una predicción trae 'respuestas' (lo correcto), 'errores' (lo que da cada
 * idea errónea de docs/investigacion/geometria-ideas-erroneas.md, agrupado por la misma clave que 'respuestas') y
 * 'coinciden' (los errores que con esos números dan lo mismo que la correcta: se apartan para que la escena no
 * ofrezca dos opciones iguales). Claves de error: GE13 carasDibujo y visiblesDibujo; GE14 areaTotal, comoArea e
 * iguales; GE19 conArea y conDiametro; GE20 sinTercio; GE21 conAltura; el resto son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorSolidos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI;
  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    const v = typeof x === 'string' && x.trim() !== '' ? Number(x) : x;
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  function entero(x, que, min) {
    const v = numero(x, que);
    if (!Number.isInteger(v)) throw new Error(`${que} debe ser un número entero`);
    if (v < min) throw new Error(`${que} debe ser al menos ${min}`);
    return v;
  }
  // Redondea lo que es entero salvo un error de coma flotante (√25 = 5, no 4,999…).
  const limpio = x => (Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) : x);
  const iguales = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);
  // Número con coma decimal (hasta 3 decimales), como se escribe en la pantalla.
  const coma = x => String(Math.round(limpio(x) * 1000) / 1000).replace('.', ',');
  const limpiar = o => { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = typeof v === 'number' ? limpio(v) : v; return r; };

  // Reparte los errores: los que dan lo mismo que la respuesta van a 'coinciden' (no se ofrecen como opción).
  function separar(respuestas, grupos) {
    const errores = {}, coinciden = {};
    for (const [k, g] of Object.entries(grupos)) {
      if (!(k in respuestas)) throw new Error(`falta la respuesta de ${k}`);
      errores[k] = {}; coinciden[k] = [];
      for (const [e, v] of Object.entries(g)) {
        const x = typeof v === 'number' ? limpio(v) : v;
        if (iguales(x, respuestas[k])) coinciden[k].push(e); else errores[k][e] = x;
      }
    }
    return { respuestas: limpiar(respuestas), errores, coinciden };
  }

  // ---------- Bases ----------
  // Polígono de la base en el plano z = 0, centrado en el origen y en sentido antihorario visto desde arriba.
  // La arista 0 (vértice 0 → vértice 1) es la del frente: paralela al eje x, del lado de y negativo.
  function base(b) {
    if (!b || typeof b !== 'object') throw new Error('falta la base');
    let n, puntos, area, perimetro, apotema = null, lado = null;
    if (b.tipo === 'rectangulo') {
      const L = numero(b.largo, 'el largo de la base', { positivo: true }), A = numero(b.ancho, 'el ancho de la base', { positivo: true });
      n = 4; puntos = [[-L / 2, -A / 2], [L / 2, -A / 2], [L / 2, A / 2], [-L / 2, A / 2]];
      area = L * A; perimetro = 2 * (L + A);
      if (L === A) { apotema = L / 2; lado = L; }
      return { tipo: b.tipo, n, puntos, area, perimetro, apotema, lado, largo: L, ancho: A, regular: L === A, circunradio: L === A ? L / Math.SQRT2 : null };
    }
    n = b.tipo === 'cuadrado' ? 4 : b.tipo === 'triangulo' ? 3 : b.tipo === 'hexagono' ? 6 : b.tipo === 'regular' ? entero(b.n, 'el número de lados', 3) : 0;
    if (!n) throw new Error(`base desconocida: ${b.tipo} (cuadrado, rectangulo, triangulo, hexagono o regular)`);
    lado = numero(b.lado, 'el lado de la base', { positivo: true });
    const R = lado / (2 * Math.sin(PI / n));
    apotema = lado / (2 * Math.tan(PI / n));
    puntos = [];
    for (let i = 0; i < n; i++) { const t = -PI / 2 - PI / n + 2 * PI * i / n; puntos.push([limpio(R * Math.cos(t)), limpio(R * Math.sin(t))]); }
    perimetro = n * lado; area = perimetro * apotema / 2;
    if (n === 4) { area = lado * lado; apotema = lado / 2; }
    return { tipo: b.tipo, n, puntos, area: limpio(area), perimetro: limpio(perimetro), apotema: limpio(apotema), lado, circunradio: limpio(R), regular: true };
  }

  // ---------- Prisma recto ----------
  function prisma(d) {
    d = d || {};
    const B = base(d.base), h = numero(d.h, 'la altura', { positivo: true });
    const lateral = B.perimetro * h, total = lateral + 2 * B.area, volumen = B.area * h;
    const r = {
      tipo: 'prisma', base: B, h, areaBase: B.area, perimetroBase: B.perimetro, lateral: limpio(lateral), total: limpio(total), volumen: limpio(volumen),
      caras: B.n + 2, vertices: 2 * B.n, aristas: 3 * B.n,
    };
    if (B.tipo === 'rectangulo') r.diagonal = limpio(Math.hypot(B.largo, B.ancho, h));
    return Object.assign(r, separar({ volumen, lateral, total },
      { volumen: { comoArea: total, comoLateral: lateral }, lateral: { conBases: total, unaCara: B.area + h }, total: { unaBase: lateral + B.area, sinBases: lateral } }));
  }

  // ---------- Pirámide regular ----------
  // La apotema ap es la altura de cada cara lateral (del vértice al punto medio de una arista de la base); forma
  // un triángulo rectángulo con la altura h y la apotema de la base: ap² = h² + apBase².
  function piramide(d) {
    d = d || {};
    const B = base(d.base);
    if (!B.regular) throw new Error('la pirámide regular necesita una base regular (cuadrado, triángulo equilátero, hexágono o regular)');
    let h, ap;
    if (d.h !== undefined) { h = numero(d.h, 'la altura', { positivo: true }); ap = Math.hypot(h, B.apotema); }
    else if (d.ap !== undefined) {
      ap = numero(d.ap, 'la apotema', { positivo: true });
      if (!(ap > B.apotema + EPS)) throw new Error('la apotema de la pirámide debe ser mayor que la apotema de la base');
      h = Math.sqrt(ap * ap - B.apotema * B.apotema);
    } else throw new Error('falta la altura h o la apotema ap');
    const arista = Math.hypot(h, B.circunradio);
    const lateral = B.perimetro * ap / 2, total = lateral + B.area, volumen = B.area * h / 3;
    return Object.assign({
      tipo: 'piramide', base: B, h: limpio(h), ap: limpio(ap), apotemaBase: B.apotema, aristaLateral: limpio(arista),
      areaBase: B.area, perimetroBase: B.perimetro, semiperimetro: limpio(B.perimetro / 2),
      lateral: limpio(lateral), total: limpio(total), volumen: limpio(volumen),
      caras: B.n + 1, vertices: B.n + 1, aristas: 2 * B.n,
      // ángulo entre la base y una cara lateral (diedro), en grados
      diedro: Math.atan2(h, B.apotema) * 180 / PI,
    }, separar({ ap, lateral, total, volumen },
      { ap: { conAltura: h, conArista: arista },
        lateral: { conAltura: B.perimetro * h / 2, sinMitad: B.perimetro * ap, conBase: total, conArista: B.perimetro * arista / 2 },
        total: { sinBase: lateral, conAltura: B.perimetro * h / 2 + B.area },
        volumen: { sinTercio: B.area * h, mitad: B.area * h / 2, comoArea: total, conApotema: B.area * ap / 3 } }));
  }

  // ---------- Cilindro recto ----------
  // El desarrollo de la superficie lateral es un rectángulo de largo 2πr (la circunferencia de la base) y alto h.
  function cilindro(d) {
    d = d || {};
    const r = numero(d.r, 'el radio', { positivo: true }), h = numero(d.h, 'la altura', { positivo: true });
    const pi = { largo: 2 * r, areaBase: r * r, lateral: 2 * r * h, total: 2 * r * h + 2 * r * r, volumen: r * r * h };
    return Object.assign({
      tipo: 'cilindro', r, h, diametro: 2 * r, largo: 2 * PI * r, areaBase: PI * r * r, lateral: PI * pi.lateral, total: PI * pi.total, volumen: PI * pi.volumen,
      pi: limpiar(pi),
    }, separar({ largo: pi.largo, lateral: pi.lateral, total: pi.total, volumen: pi.volumen },
      { largo: { conArea: r * r, conDiametro: 4 * r, mitad: r },
        lateral: { conArea: r * r * h, conDiametro: 4 * r * h },
        total: { unaBase: pi.lateral + r * r, sinBases: pi.lateral },
        volumen: { comoLateral: pi.lateral, conDiametro: 4 * r * r * h, comoArea: pi.total } }));
  }

  // ---------- Cono recto ----------
  // La generatriz g va del vértice al borde de la base: g² = h² + r². El desarrollo lateral es un sector circular
  // de radio g y arco 2πr; su ángulo es 360° · r/g. A_L = πrg es el área de ese sector.
  function cono(d) {
    d = d || {};
    const r = numero(d.r, 'el radio', { positivo: true });
    let h, g;
    if (d.h !== undefined) { h = numero(d.h, 'la altura', { positivo: true }); g = Math.hypot(r, h); }
    else if (d.g !== undefined) {
      g = numero(d.g, 'la generatriz', { positivo: true });
      if (!(g > r + EPS)) throw new Error('la generatriz debe ser mayor que el radio');
      h = Math.sqrt(g * g - r * r);
    } else throw new Error('falta la altura h o la generatriz g');
    const pi = { arco: 2 * r, areaBase: r * r, lateral: r * g, total: r * g + r * r, volumen: r * r * h / 3 };
    const angulo = 360 * r / g;
    return Object.assign({
      tipo: 'cono', r, h: limpio(h), g: limpio(g), diametro: 2 * r, angulo: limpio(angulo),
      arco: 2 * PI * r, areaBase: PI * r * r, lateral: PI * pi.lateral, total: PI * pi.total, volumen: PI * pi.volumen,
      pi: limpiar(pi),
    }, separar({ g, lateral: pi.lateral, total: pi.total, volumen: pi.volumen, angulo },
      { g: { conAltura: h, suma: r + h },
        lateral: { conAltura: r * h, conDiametro: 2 * r * g, conBase: pi.total },
        total: { sinBase: pi.lateral, conAltura: r * h + r * r },
        volumen: { sinTercio: r * r * h, mitad: r * r * h / 2, conGeneratriz: r * r * g / 3 },
        angulo: { conAltura: 360 * r / h, completo: 360, mitad: 180 * r / g } }));
  }

  // El cono que se arma enrollando un sector de radio g y ángulo α (en grados): el arco del sector es la
  // circunferencia de la base, 2πr = 2πg · α/360, así que r = g · α/360.
  function conoDeSector(d) {
    d = d || {};
    const g = numero(d.g, 'el radio del sector', { positivo: true }), a = numero(d.angulo, 'el ángulo del sector', { positivo: true });
    if (!(a < 360)) throw new Error('el ángulo del sector debe ser menor que 360°');
    const r = g * a / 360, arcoPi = g * a / 180;
    const c = cono({ r, g });
    const conArea = Math.sqrt(arcoPi), sinPi = arcoPi / 2;   // πr² = arco; 2r = arco (sin π)
    const R = separar({ r }, { r: { igualG: g, conArea, sinPi: PI * sinPi, mitad: r / 2 } });
    return Object.assign({ tipo: 'conoDeSector', g, angulo: a, r: limpio(r), h: c.h, arcoPi: limpio(arcoPi), arco: PI * arcoPi,
      pi: c.pi, cono: c,
      // cómo se escribe cada error en la pantalla (con raíz o con π)
      formas: { igualG: coma(g), conArea: Number.isInteger(limpio(arcoPi)) && !Number.isInteger(limpio(conArea)) ? `√${coma(arcoPi)}` : coma(conArea),
        sinPi: `${coma(sinPi)}π`, mitad: coma(r / 2) } }, R);
  }

  // ---------- Esfera ----------
  // Arquímedes: en el cilindro circunscrito (radio r, altura 2r) la esfera ocupa 2/3 del volumen, y su
  // superficie, 4πr², es igual al área lateral del cilindro (2πr · 2r).
  function esfera(d) {
    d = d || {};
    const r = numero(d.r, 'el radio', { positivo: true });
    const pi = { area: 4 * r * r, volumen: 4 * r * r * r / 3, circuloMaximo: r * r, cilVolumen: 2 * r * r * r, cilLateral: 4 * r * r, cilTotal: 6 * r * r };
    const fraccion = pi.volumen / pi.cilVolumen;
    return Object.assign({
      tipo: 'esfera', r, diametro: 2 * r, area: PI * pi.area, volumen: PI * pi.volumen, pi: limpiar(pi),
      cilindro: { r, h: 2 * r, volumen: PI * pi.cilVolumen, lateral: PI * pi.cilLateral, total: PI * pi.cilTotal },
      fraccion: limpio(fraccion), fraccionTexto: '2/3', fraccionArea: limpio(pi.area / pi.cilTotal), circulosMaximos: limpio(pi.area / pi.circuloMaximo),
    }, separar({ fraccion, area: pi.area, volumen: pi.volumen },
      { fraccion: { comoCono: 1 / 3, mitad: 1 / 2, tresCuartos: 3 / 4 },
        area: { comoCirculo: r * r, dosCirculos: 2 * r * r, conDiametro: 4 * 4 * r * r },
        volumen: { sinFraccion: 4 * r * r * r, conCuadrado: 4 * r * r / 3, conDiametro: 4 * 8 * r * r * r / 3 } }));
  }

  // ---------- Troncos ----------
  // Tronco de cono de radios R (abajo) y r (arriba) y altura h: V = πh(R² + r² + Rr)/3. Es el cono grande menos
  // el cono chico que se le quitó arriba.
  function troncoCono(d) {
    d = d || {};
    const R = numero(d.R, 'el radio mayor', { positivo: true }), r = numero(d.r, 'el radio menor'), h = numero(d.h, 'la altura', { positivo: true });
    if (r > R) throw new Error('el radio menor no puede ser mayor que el radio mayor');
    const g = Math.hypot(h, R - r);
    const pi = { volumen: h * (R * R + r * r + R * r) / 3, lateral: (R + r) * g, total: (R + r) * g + R * R + r * r, baseMayor: R * R, baseMenor: r * r };
    const out = { tipo: 'troncoCono', R, r, h, g: limpio(g), volumen: PI * pi.volumen, lateral: PI * pi.lateral, total: PI * pi.total, pi: limpiar(pi) };
    if (R > r) {
      const H = h * R / (R - r);
      out.conoGrande = { r: R, h: limpio(H), piVolumen: limpio(R * R * H / 3) };
      out.conoChico = { r, h: limpio(H - h), piVolumen: limpio(r * r * (H - h) / 3) };
    }
    return Object.assign(out, separar({ volumen: pi.volumen },
      { volumen: { sinTercio: h * (R * R + r * r + R * r), radioPromedio: ((R + r) / 2) * ((R + r) / 2) * h, basesPromedio: (R * R + r * r) * h / 2 } }));
  }
  // Tronco de pirámide de bases cuadradas de lados L (abajo) y l (arriba) y altura h.
  function troncoPiramide(d) {
    d = d || {};
    const L = numero(d.L, 'el lado mayor', { positivo: true }), l = numero(d.l, 'el lado menor'), h = numero(d.h, 'la altura', { positivo: true });
    if (l > L) throw new Error('el lado menor no puede ser mayor que el lado mayor');
    const A1 = L * L, A2 = l * l, ap = Math.hypot(h, (L - l) / 2);
    const volumen = h * (A1 + A2 + Math.sqrt(A1 * A2)) / 3, lateral = 2 * (L + l) * ap;
    return Object.assign({ tipo: 'troncoPiramide', L, l, h, ap: limpio(ap), baseMayor: A1, baseMenor: A2, lateral: limpio(lateral), total: limpio(lateral + A1 + A2), volumen: limpio(volumen) },
      separar({ volumen }, { volumen: { sinTercio: h * (A1 + A2 + Math.sqrt(A1 * A2)), basesPromedio: (A1 + A2) * h / 2 } }));
  }

  // ---------- Cubitos ----------
  // Bloque de a × b × c cubitos (largo, ancho, alto). En un dibujo en perspectiva se ven tres caras (arriba,
  // frente y un costado): asoman a·b·c − (a−1)(b−1)(c−1) cubitos y se ven ab + bc + ac caritas.
  function bloque(a, b, c) {
    a = entero(a, 'el largo', 1); b = entero(b, 'el ancho', 1); c = entero(c, 'el alto', 1);
    const total = a * b * c, ocultosDibujo = (a - 1) * (b - 1) * (c - 1);
    const interior = Math.max(0, a - 2) * Math.max(0, b - 2) * Math.max(0, c - 2);
    const caritas = a * b + b * c + a * c;
    // caras pintadas de cada cubito si se pinta todo el bloque por fuera
    const pintadas = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const cubitos = [];
    for (let z = 0; z < c; z++) for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) {
      const caras = (x === 0) + (x === a - 1) + (y === 0) + (y === b - 1) + (z === 0) + (z === c - 1);
      pintadas[caras]++;
      // en el dibujo se ven el frente (y = 0), el costado derecho (x = a − 1) y la tapa (z = c − 1)
      cubitos.push({ x, y, z, caras, visibleDibujo: y === 0 || x === a - 1 || z === c - 1 });
    }
    return Object.assign({ a, b, c, total, visiblesDibujo: total - ocultosDibujo, ocultosDibujo, interior, conCaraAfuera: total - interior,
      carasDibujo: caritas, areaTotal: 2 * caritas, pintadas, cubitos },
      separar({ total }, { total: { carasDibujo: caritas, visiblesDibujo: total - ocultosDibujo, areaTotal: 2 * caritas, sumaAristas: a + b + c } }));
  }
  // Un cubo de n × n × n cubitos se pinta por fuera: ¿cuántos quedan sin pintura? (n − 2)³, los de adentro
  // (con n = 2 no queda ninguno). Errores (hipótesis): quitar una sola capa, (n − 1)³ — que es también lo que no se ve
  // en un dibujo con tres caras; contar solo el centro de una cara, (n − 2)²; confundir con los de una cara pintada,
  // 6(n − 2)²; contar los pintados, n³ − (n − 2)³.
  function cuboPintado(n) {
    n = entero(n, 'el número de cubitos por arista', 2);
    const B = bloque(n, n, n);
    const sin = Math.pow(n - 2, 3);
    return Object.assign({ n, total: B.total, pintadas: B.pintadas, sinPintura: sin, ocultosDibujo: B.ocultosDibujo, cubitos: B.cubitos },
      separar({ sinPintura: sin }, { sinPintura: { quitaUnaCapa: Math.pow(n - 1, 3), centroDeUnaCara: (n - 2) * (n - 2), unaCara: 6 * (n - 2) * (n - 2), conPintura: B.total - sin } }));
  }

  // ---------- Poliedros y Euler ----------
  const REGULARES = { tetraedro: [4, 4, 6], cubo: [6, 8, 12], octaedro: [8, 6, 12], dodecaedro: [12, 20, 30], icosaedro: [20, 12, 30] };
  function poliedro(d) {
    d = d || {};
    let C, V, A, n = null;
    if (d.tipo === 'prisma' || d.tipo === 'piramide') {
      n = entero(d.n, 'el número de lados de la base', 3);
      if (d.tipo === 'prisma') { C = n + 2; V = 2 * n; A = 3 * n; } else { C = n + 1; V = n + 1; A = 2 * n; }
    } else if (REGULARES[d.tipo]) [C, V, A] = REGULARES[d.tipo];
    else throw new Error(`poliedro desconocido: ${d.tipo}`);
    const bases = d.tipo === 'prisma' ? 2 * n : d.tipo === 'piramide' ? n : null;
    const grupos = { aristas: { comoCaras: C, eulerSuma: C + V + 2, comoVertices: V } };
    if (bases !== null) grupos.aristas.soloBases = bases;
    return Object.assign({ tipo: d.tipo, n, caras: C, vertices: V, aristas: A, euler: C + V - A, cumpleEuler: C + V === A + 2 },
      separar({ aristas: A }, grupos));
  }
  // Las aristas distintas de una lista de caras (polígonos en 3D): cada segmento se cuenta una sola vez.
  function aristasUnicas(caras) {
    const clave = p => p.map(v => Math.round(v * 1e6) / 1e6).join(',');
    const vistas = new Map();
    for (const cara of caras) {
      const pts = cara.puntos || cara.pts || cara;
      for (let j = 0; j < pts.length; j++) {
        const p = pts[j], q = pts[(j + 1) % pts.length];
        const k = [clave(p), clave(q)].sort().join('|');
        if (!vistas.has(k)) vistas.set(k, [p, q]);
      }
    }
    return [...vistas.values()];
  }

  // ---------- La hoja enrollada ----------
  // Una hoja de largo × ancho se enrolla de dos formas: con el largo alrededor (cilindro bajo y ancho) o con el
  // ancho alrededor (cilindro alto y delgado). Las dos tienen la misma área lateral, pero V = P²h/(4π): guarda
  // más el que tiene la circunferencia más larga.
  function hojaEnrollada(d) {
    d = d || {};
    const L = numero(d.largo, 'el largo de la hoja', { positivo: true }), A = numero(d.ancho, 'el ancho de la hoja', { positivo: true });
    const mayor = Math.max(L, A), menor = Math.min(L, A);
    const rollo = (P, h) => ({ perimetro: P, h, r: P / (2 * PI), volumen: P * P * h / (4 * PI), sobrePi: limpio(P * P * h / 4) });
    const bajo = rollo(mayor, menor), alto = rollo(menor, mayor);
    const resp = mayor === menor ? 'iguales' : 'bajo';
    return Object.assign({ largo: L, ancho: A, lateral: L * A, bajo, alto, razon: limpio(mayor / menor) },
      separar({ mayor: resp }, { mayor: { iguales: 'iguales', alto: 'alto' } }));
  }

  // ---------- Geometría en 3D ----------
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const add = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
  const mul = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const norma = p => Math.hypot(p[0], p[1], p[2]);
  const unit = p => mul(p, 1 / norma(p));
  // Normal de un polígono por el método de Newell (hacia afuera si los vértices van antihorario vistos desde afuera).
  function normal(pts) {
    let n = [0, 0, 0];
    for (let j = 0; j < pts.length; j++) {
      const p = pts[j], q = pts[(j + 1) % pts.length];
      n = add(n, [(p[1] - q[1]) * (p[2] + q[2]), (p[2] - q[2]) * (p[0] + q[0]), (p[0] - q[0]) * (p[1] + q[1])]);
    }
    return unit(n);
  }
  function areaPoligono3(pts) {
    let s = [0, 0, 0];
    for (let j = 0; j < pts.length; j++) s = add(s, cross(pts[j], pts[(j + 1) % pts.length]));
    return norma(s) / 2;
  }
  // Transformaciones rígidas { R (3 × 3), t }: p ↦ R·p + t.
  const ID = { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] };
  const aplicar = (M, p) => [0, 1, 2].map(i => M.R[i][0] * p[0] + M.R[i][1] * p[1] + M.R[i][2] * p[2] + M.t[i]);
  const girarVector = (M, v) => [0, 1, 2].map(i => M.R[i][0] * v[0] + M.R[i][1] * v[1] + M.R[i][2] * v[2]);
  function componer(A, B) { // A ∘ B
    const R = [0, 1, 2].map(i => [0, 1, 2].map(j => A.R[i][0] * B.R[0][j] + A.R[i][1] * B.R[1][j] + A.R[i][2] * B.R[2][j]));
    return { R, t: aplicar(A, B.t) };
  }
  // Giro de ángulo θ alrededor de la recta que pasa por c con dirección u (Rodrigues).
  function giro(c, u, th) {
    u = unit(u);
    const [x, y, z] = u, C = Math.cos(th), S = Math.sin(th), K = 1 - C;
    const R = [[C + x * x * K, x * y * K - z * S, x * z * K + y * S], [y * x * K + z * S, C + y * y * K, y * z * K - x * S], [z * x * K - y * S, z * y * K + x * S, C + z * z * K]];
    const Rc = [0, 1, 2].map(i => R[i][0] * c[0] + R[i][1] * c[1] + R[i][2] * c[2]);
    return { R, t: sub(c, Rc) };
  }
  // Ángulo con signo, alrededor de u, que lleva el vector a al vector b (los dos perpendiculares a u).
  const anguloAlrededor = (a, b, u) => Math.atan2(dot(unit(u), cross(a, b)), dot(a, b));

  // ---------- El sólido cerrado y su árbol de bisagras ----------
  // Cada cara: { rol, puntos (cerrado), padre, bisagra: [j, k] (índices de dos vértices de la cara que comparte con
  // su padre), bordes: tipo de cada arista j → j + 1 ('arista' se dibuja siempre; 'suave' solo en el contorno;
  // 'costura' solo cuando el sólido está abierto), vecinos: cara del otro lado de cada arista suave }.
  // La cara 0 es la raíz: una cara lateral del frente, que gira sobre su arista de abajo hasta quedar vertical.
  function poligonoBase(tipo, d, N) {
    if (tipo === 'prisma' || tipo === 'piramide') return base(d.base).puntos;
    // cilindro y cono: polígono de N lados con perímetro exacto 2πr (el desarrollo mide 2πr de largo)
    const r = numero(d.r, 'el radio', { positivo: true });
    return base({ tipo: 'regular', n: N, lado: 2 * PI * r / N }).puntos;
  }
  function solido(tipo, d, o) {
    d = d || {}; o = o || {};
    const N = o.N === undefined ? 48 : entero(o.N, 'el número de tiras', 6);
    const curvo = tipo === 'cilindro' || tipo === 'cono';
    let h;
    if (tipo === 'cono' || tipo === 'piramide') {
      const info = tipo === 'cono' ? cono(d) : piramide(d);
      h = info.h;
    } else if (tipo === 'prisma' || tipo === 'cilindro') h = numero(d.h, 'la altura', { positivo: true });
    else throw new Error(`no sé abrir un ${tipo}: prisma, piramide, cilindro o cono`);
    const P = poligonoBase(tipo, d, N), n = P.length;
    const B = P.map(p => [p[0], p[1], 0]);
    const caras = [];
    const lat = curvo ? 'suave' : 'arista';
    const tapas = o.tapas !== false;
    if (tipo === 'prisma' || tipo === 'cilindro') {
      const T = P.map(p => [p[0], p[1], h]);
      for (let i = 0; i < n; i++) caras.push({ rol: 'lateral', puntos: [B[i], B[(i + 1) % n], T[(i + 1) % n], T[i]], bordes: ['arista', lat, 'arista', lat] });
    } else {
      const A = [0, 0, h];
      for (let i = 0; i < n; i++) caras.push({ rol: 'lateral', puntos: [B[i], B[(i + 1) % n], A], bordes: ['arista', lat, lat] });
    }
    // Cadena de laterales: hacia la derecha 1, 2, …, k y hacia la izquierda n − 1, n − 2, …, k + 1.
    const k = Math.floor(n / 2);
    const encadenar = tipo !== 'piramide';
    if (encadenar) {
      // en el prisma la arista derecha de la cara i es la 1 ([B_{i+1}, T_{i+1}]); en el cono, [B_{i+1}, A] también es la 1
      for (let i = 1; i <= k; i++) { caras[i].padre = i - 1; caras[i].bisagra = tipo === 'cono' ? [0, 2] : [0, 3]; }
      for (let i = n - 1; i > k; i--) { caras[i].padre = (i + 1) % n; caras[i].bisagra = tipo === 'cono' ? [1, 2] : [1, 2]; }
      // la costura queda entre la cara k y la k + 1
      if (curvo) { caras[k].bordes[1] = 'costura'; caras[(k + 1) % n].bordes[tipo === 'cono' ? 2 : 3] = 'costura'; }
      if (curvo) for (let i = 0; i < n; i++) caras[i].vecinos = tipo === 'cono' ? [null, (i + 1) % n, (i + n - 1) % n] : [null, (i + 1) % n, null, (i + n - 1) % n];
    }
    if (tipo === 'piramide' || tipo === 'cono') {
      if (tapas) caras.push({ rol: 'base', puntos: B.slice().reverse(), padre: 0, bisagra: [n - 2, n - 1], bordes: new Array(n).fill('arista') });
      if (tipo === 'piramide') {
        const ib = caras.length - 1;
        // en la base invertida, la arista B_i → B_{i+1} es la que une los índices n − 2 − i y n − 1 − i (módulo n)
        for (let i = 1; i < n; i++) { caras[i].padre = ib; caras[i].bisagra = [0, 1]; }
      }
    } else if (tapas) {
      const T = P.map(p => [p[0], p[1], h]);
      caras.push({ rol: 'base', puntos: B.slice().reverse(), padre: 0, bisagra: [n - 2, n - 1], bordes: new Array(n).fill('arista') });
      caras.push({ rol: 'base', puntos: T, padre: 0, bisagra: [0, 1], bordes: new Array(n).fill('arista') });
    }
    caras[0].padre = null;
    for (const c of caras) { c.normal = normal(c.puntos); if (!c.vecinos) c.vecinos = c.bordes.map(() => null); }
    return { tipo, d, h, N: curvo ? N : null, n, caras };
  }

  // El sólido abierto en una fracción f (0 cerrado, 1 abierto del todo). Cada cara gira sobre la arista que comparte
  // con su padre un ángulo f·δ, donde δ es lo que le falta para quedar en el plano del padre; la raíz gira sobre su
  // arista de abajo hasta quedar vertical, mirando hacia y negativo. Al final, todo el desarrollo queda en un plano.
  function desarrollo(tipo, d, f, o) {
    f = numero(f, 'la fracción abierta');
    if (f > 1 + EPS) throw new Error('la fracción abierta va de 0 a 1');
    f = Math.min(1, f);
    const S = solido(tipo, d, o), C = S.caras;
    const M = new Array(C.length);
    const raiz = C[0], e0 = raiz.puntos[0], e1 = raiz.puntos[1];
    const fi = anguloAlrededor(raiz.normal, [0, -1, 0], sub(e1, e0));
    M[0] = giro(e0, sub(e1, e0), fi * f);
    const delta = new Array(C.length).fill(0);
    delta[0] = fi;
    const hecho = new Array(C.length).fill(false); hecho[0] = true;
    let faltan = C.length - 1;
    while (faltan > 0) {
      let avance = false;
      C.forEach((c, i) => {
        if (hecho[i] || !hecho[c.padre]) return;
        const p = c.puntos[c.bisagra[0]], q = c.puntos[c.bisagra[1]], u = sub(q, p);
        const dl = anguloAlrededor(c.normal, C[c.padre].normal, u);
        delta[i] = dl;
        M[i] = componer(M[c.padre], giro(p, u, dl * f));
        hecho[i] = true; faltan--; avance = true;
      });
      if (!avance) throw new Error('el árbol de bisagras no está conectado');
    }
    const caras = C.map((c, i) => ({ rol: c.rol, puntos: c.puntos.map(p => aplicar(M[i], p)), normal: girarVector(M[i], c.normal),
      bordes: c.bordes, vecinos: c.vecinos, padre: c.padre, M: M[i], cerrada: c.puntos, giro: delta[i] * 180 / PI }));
    const area = caras.reduce((s, c) => s + areaPoligono3(c.puntos), 0);
    // Puntos notables (cerrado → con la transformación de su cara): vértice, centro de la base, medio de la arista del frente.
    const marcas = {};
    const iBase = C.findIndex(c => c.rol === 'base');
    const medio = mul(add(e0, e1), 0.5);
    marcas.medioFrente = { cara: 0, p: aplicar(M[0], medio), cerrado: medio };
    if (tipo === 'piramide' || tipo === 'cono') { const A = [0, 0, S.h]; marcas.vertice = { cara: 0, p: aplicar(M[0], A), cerrado: A }; }
    if (iBase >= 0) marcas.centroBase = { cara: iBase, p: aplicar(M[iBase], [0, 0, 0]), cerrado: [0, 0, 0] };
    if (tipo === 'prisma' || tipo === 'cilindro') {
      const sup = [medio[0], medio[1], S.h];
      marcas.medioFrenteArriba = { cara: 0, p: aplicar(M[0], sup), cerrado: sup };
    }
    return { tipo, f, h: S.h, N: S.N, caras, area, marcas, plano: f === 1 };
  }

  // ---------- Tres pirámides llenan la caja ----------
  // La caja [0, a] × [0, a] × [0, h] se parte en tres pirámides con el mismo vértice P = (0, a, h): sus bases son
  // las tres caras de la caja que no tocan a P (abajo, frente y derecha). Cada una tiene volumen a²h/3.
  // 'sep' las separa (la de abajo se queda; la del frente se corre hacia x negativo y la de la derecha hacia x positivo)
  // y 'punta' (de 0 a 1) corre el vértice de la de abajo
  // hasta el centro de la tapa: la altura no cambia, así que el volumen tampoco (principio de Cavalieri).
  // Las coordenadas se devuelven con la base centrada en el origen.
  function tresPiramides(d) {
    d = d || {};
    const a = numero(d.a, 'el lado de la base', { positivo: true }), h = numero(d.h, 'la altura', { positivo: true });
    const sep = numero(d.sep === undefined ? 0 : d.sep, 'la separación'), punta = numero(d.punta === undefined ? 0 : d.punta, 'la punta');
    if (punta > 1 + EPS) throw new Error('la punta va de 0 a 1');
    const c = p => [p[0] - a / 2, p[1] - a / 2, p[2]];
    const P = [0, a, h];
    const piezas = [
      { id: 'abajo', base: [[0, 0, 0], [0, a, 0], [a, a, 0], [a, 0, 0]], dir: [0, 0, 0] },
      { id: 'frente', base: [[0, 0, 0], [a, 0, 0], [a, 0, h], [0, 0, h]], dir: [-1, 0, 0] },
      { id: 'derecha', base: [[a, 0, 0], [a, a, 0], [a, a, h], [a, 0, h]], dir: [1, 0, 0] },
    ].map(pz => {
      const vert = pz.id === 'abajo' ? [P[0] + (a / 2 - P[0]) * punta, P[1] + (a / 2 - P[1]) * punta, h] : P;
      const mov = mul(pz.dir, sep);
      const b = pz.base.map(p => c(add(p, mov))), v = c(add(vert, mov));
      // caras: la base y los cuatro triángulos laterales
      const caras = [{ rol: 'base', puntos: b }];
      for (let j = 0; j < 4; j++) caras.push({ rol: 'lateral', puntos: [b[j], b[(j + 1) % 4], v] });
      // volumen medido con las coordenadas (área de la base × distancia del vértice a su plano / 3)
      const n = normal(b), dist = Math.abs(dot(sub(v, b[0]), n));
      return { id: pz.id, base: b, vertice: v, caras, areaBase: areaPoligono3(b), altura: dist, volumen: areaPoligono3(b) * dist / 3 };
    });
    return { a, h, caja: a * a * h, piezas, volumenCadaUna: a * a * h / 3, suma: piezas.reduce((s, p) => s + p.volumen, 0) };
  }

  return { base, prisma, piramide, cilindro, cono, conoDeSector, esfera, troncoCono, troncoPiramide, bloque, cuboPintado,
    poliedro, aristasUnicas, hojaEnrollada, solido, desarrollo, tresPiramides,
    util: { aplicar, normal, areaPoligono3, dot, cross, sub, add, mul, norma, unit } };
});
