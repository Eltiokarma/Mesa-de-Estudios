/*
 * Generador: longitudes y áreas circulares (coronas, sectores, regiones sombreadas, lúnulas y la
 * rueda que rueda). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-areas-circulares']) y en Node (require). No usa ningún motor.
 *
 * Todas las respuestas son exactas de la forma q + p·π (q y p racionales, casi siempre enteros):
 * «12π cm²», «(72 − 18π) cm²», «(8π − 16) m²», «48 cm». respuesta.valor es una clave de texto
 * «q|p» con q y p como fracciones n/d (por ejemplo «72/1|-18/1» es 72 − 18π).
 *
 * Tipos (campo _datos.tipo) y sus campos de _datos (longitudes en la unidad u, áreas en u²):
 *   corona         sub 'radios': R (radio mayor), r (radio menor) → área π(R² − r²).
 *                  sub 'diametros': D, d (diámetros mayor y menor) → área de la corona.
 *                  sub 'razon-suma': a, b (r : R = a : b), S (r + R) → área de la corona.
 *                  sub 'cuerda': c (cuerda de la circunferencia mayor tangente a la menor) → área.
 *   sector         sub 'semicorona': D, d (diámetros de las dos semicircunferencias) → área de la
 *                  media corona. sub 'trapecio': R, r, t (ángulo central en grados) → área del
 *                  trapecio circular. sub 'perimetro': r, t → perímetro del sector (dos radios + arco).
 *   concentricas   sub 'suma': radios [r1, r2, r3] (tres circunferencias concéntricas), n (número de
 *                  sectores iguales), piezas [c1, c2, c3] (piezas pintadas del círculo central, del
 *                  anillo medio y del anillo exterior) → área pintada.
 *                  sub 'razon': radios r, 2r, …, m·r; m (anillo comparado) → cuántas veces la pieza
 *                  del anillo m (entre (m − 1)r y m·r) contiene a la pieza central (mismo ángulo).
 *   cuadrantes     R (OA), r (OC), d (= CA = R − r), S (área entre los dos cuadrantes concéntricos de
 *                  90°, escrita como Spi·π: campo Spi) → se pide OA = R (dato del enunciado: Spi, d).
 *   sombreada      sub 'rect-tres': r; rectángulo de 4r × 2r con un círculo central de radio r y dos
 *                  semicírculos de diámetro 2r sobre los lados cortos → área sin pintar.
 *                  sub 'cuadrado-cuatro': r; cuadrado de lado 4r con cuatro círculos de radio r
 *                  tangentes entre sí y a los lados → área fuera de los círculos.
 *                  sub 'cuadrado-esquinas': l; cuadrado de lado l con un cuarto de círculo de radio l/2
 *                  en cada esquina → área fuera de los cuartos.
 *                  sub 'logo-tangente': r; cuadrado de lado 4r, cuatro semicírculos interiores de radio r
 *                  con el tramo central de cada lado (de r a 3r) como diámetro, y la circunferencia
 *                  central inscrita en el hueco (tangente a los cuatro, radio r) → área fuera de todo.
 *   lunulas        sub 'flor': l; cuadrado de lado l y cuatro semicírculos interiores con los lados
 *                  como diámetros → área de los cuatro pétalos (zonas cubiertas dos veces).
 *                  sub 'dos-cuadrantes': l; cuadrado de lado l, cuadrantes de radio l con centro en
 *                  dos vértices opuestos → área común (la «hoja»).
 *                  sub 'cuadrante-dos-semis': R; cuadrante de radio R y semicírculos interiores con
 *                  los dos radios como diámetros → área del cuadrante que no cubre ningún semicírculo.
 *                  sub 'cuadrante-semi': R; cuadrante de radio R y un semicírculo interior con un
 *                  radio como diámetro → área del cuadrante fuera del semicírculo.
 *                  sub 'hipocrates': a, b, c (catetos e hipotenusa); semicírculos exteriores sobre los
 *                  catetos y la semicircunferencia de diámetro c que pasa por el vértice recto →
 *                  suma de las dos lúnulas.
 *                  sub 'hex-sector': hexágono regular ABCDEF y triángulo ACE inscritos en la misma
 *                  circunferencia; se sombrean n regiones (n = 1, 2 o 3: ABC + segmento de AB, CDE +
 *                  segmento de CD, EFA + segmento de EF); su área total es Spi·π (dato) → longitud 2πR.
 *                  sub 'hex-segmentos': los seis segmentos entre la circunferencia y el hexágono suman
 *                  Spi·π + Sr3·√3 (dato; Sr3 < 0) → longitud de la circunferencia (u, no u²).
 *                  sub 'cuadricula': a = lado de una cuadrícula de 2 × 2 con esquinas (0; 0) y (2a; 2a);
 *                  logo = (1) cuarto de círculo de centro (0; 0) y radio a en [0, a]²; (2) el cuadrado
 *                  [a, 2a] × [0, a] sin el cuarto de círculo de centro (a; 0) y radio a; (3) el cuadrado
 *                  [0, a] × [a, 2a] sin el semicírculo de centro (0; 3a/2) y radio a/2; (4) el semicírculo
 *                  de centro (a; 3a/2) y radio a/2 con x ≥ a → área del logo.
 *   rueda          r (radio), n (vueltas, entero o media vuelta), conCentro (si el dato es lo que
 *                  avanzó el centro, D = 2πrn: campo Dpi = D/π) → longitud de la cicloide que
 *                  recorre un punto del borde que parte del suelo (dato del enunciado: 8r por vuelta).
 *   Todos llevan u (unidad de longitud).
 *
 * Errores: GE1 (razón lineal en vez de k²), GE4 (área por perímetro), GE7 y GE19 del informe
 * docs/investigacion/geometria-ideas-erroneas.md; los GE-circ-* y TR-ciclo-* son hipótesis nuestras
 * sacadas de las trampas de admisión (docs/clasificacion/trampas-admision-unmsm/geometria-trigonometria.md).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-areas-circulares';
  const GE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const v = P.v;
  const e = (id, x, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, x, explicacion, respaldo, fuente });
  const ge = (id, x, explicacion) => e(id, x, explicacion, 'hipotesis', GE);     // hipótesis listadas en el informe
  const gp = (id, x, explicacion) => e(id, x, explicacion, 'parcial', GE);       // cara numérica de un error documentado

  // ---------- Números exactos q + p·π ----------
  const X = (q, p = 0) => ({ q, p });
  const valor = x => x.q + x.p * Math.PI;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function racional(x) {
    for (let d = 1; d <= 12; d++) { const n = Math.round(x * d); if (Math.abs(n - x * d) < 1e-9) return [n, d]; }
    return null;
  }
  const entero = x => Math.abs(x - Math.round(x)) < 1e-9;
  const nro = n => P.formatear(n, 0);
  function textoX(x, u = '') {
    const q = racional(x.q), p = racional(x.p);
    const D = q[1] * p[1] / mcd(q[1], p[1]);
    const Q = q[0] * D / q[1], N = p[0] * D / p[1];
    const kp = c => (c === 1 ? '' : nro(c)) + 'π';
    let t;
    if (N === 0) t = nro(Q) + (D > 1 ? '/' + D : '');
    else if (Q === 0) t = (N < 0 ? '−' : '') + kp(Math.abs(N)) + (D > 1 ? '/' + D : '');
    else {
      t = Q > 0 ? `${nro(Q)} ${N > 0 ? '+' : '−'} ${kp(Math.abs(N))}` : `${kp(N)} − ${nro(-Q)}`;
      t = D > 1 ? `(${t})/${D}` : (u ? `(${t})` : t);
    }
    return u ? `${t} ${u}` : t;
  }
  const clave = x => { const q = racional(x.q), p = racional(x.p); return `${q[0]}/${q[1]}|${p[0]}/${p[1]}`; };
  const clase = x => (Math.abs(x.q) > 1e-12 ? 1 : 0) + (Math.abs(x.p) > 1e-12 ? 2 : 0);
  const coefEnteros = x => entero(x.q) && entero(x.p);

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(['corona', 'corona', 'sector', 'sector', 'concentricas', 'cuadrantes', 'sombreada', 'sombreada', 'lunulas', 'lunulas', 'rueda']);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla);
      if (pr) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Arma las alternativas: solo entran errores positivos, que se escriben limpio y con la misma forma
  // que la correcta (mismaForma) o, si el error mismo cambia la forma (agrega π), con al menos dos
  // distractores de la misma forma para que la forma no delate a la correcta.
  function cerrar(rng, semilla, o) {
    const u = o.unidad;
    const ok = o.errores.filter(er => valor(er.x) > 1e-9 && racional(er.x.q) && racional(er.x.p)
      && (!coefEnteros(o.correcta) || coefEnteros(er.x)));
    const iguales = ok.filter(er => clase(er.x) === clase(o.correcta));
    const usar = o.mismaForma === false ? ok : iguales;
    const distintasIguales = new Set(iguales.map(er => clave(er.x)).filter(k => k !== clave(o.correcta)));
    if (distintasIguales.size < (o.mismaForma === false ? 2 : 3)) return null;
    const alternativas = P.armarTexto({
      correcta: { clave: clave(o.correcta), texto: textoX(o.correcta, u) },
      errores: usar.map(er => ({ id: er.id, clave: clave(er.x), texto: textoX(er.x, u), explicacion: er.explicacion, respaldo: er.respaldo, fuente: er.fuente })),
      rng,
    });
    if (alternativas.length < 4) return null;
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: clave(o.correcta), unidad: u }, _datos: o.datos,
    };
  }

  // ---------- Cálculos puros (los usa papel.json) ----------
  const calc = {
    corona: (R, r) => X(0, R * R - r * r),
    coronaDiametros: (D, d) => X(0, (D * D - d * d) / 4),
    coronaRazon: (a, b, S) => { const k = S / (a + b); return X(0, k * k * (b * b - a * a)); },
    coronaCuerda: c => X(0, c * c / 4),
    semicorona: (D, d) => X(0, (D * D - d * d) / 8),
    trapecio: (R, r, t) => X(0, t / 360 * (R * R - r * r)),
    perimetroSector: (r, t) => X(2 * r, t / 360 * 2 * r),
    concentricas: (radios, n, piezas) => {
      const [r1, r2, r3] = radios, [c1, c2, c3] = piezas;
      return X(0, (c1 * r1 * r1 + c2 * (r2 * r2 - r1 * r1) + c3 * (r3 * r3 - r2 * r2)) / n);
    },
    razonPiezas: m => X(2 * m - 1),
    // Área entre cuadrantes = Spi·π y CA = d: R² − r² = 4·Spi y R − r = d.
    cuadrantesRadio: (Spi, d) => X((4 * Spi / d + d) / 2),
    rectTres: r => X(8 * r * r, -2 * r * r),
    cuadradoCuatro: r => X(16 * r * r, -4 * r * r),
    cuadradoEsquinas: l => X(l * l, -l * l / 4),
    flor: l => X(-l * l, l * l / 2),
    dosCuadrantes: l => X(-l * l, l * l / 2),
    cuadranteDosSemis: R => X(-R * R / 4, R * R / 8),
    cuadranteSemi: R => X(0, R * R / 8),
    hipocrates: (a, b) => X(a * b / 2),
    rueda: (r, n) => X(8 * r * n),
    valor,
  };

  // ---------- Contextos ----------
  const CTX_CORONA = [
    { u: 'm', que: 'Un jardín con forma de corona circular rodea una pileta redonda; el borde de la pileta y el borde exterior del jardín son circunferencias con el mismo centro.', obj: 'el jardín' },
    { u: 'cm', que: 'Una arandela metálica es un disco con un agujero circular en el centro; el borde exterior y el del agujero son circunferencias concéntricas.', obj: 'la arandela' },
    { u: 'm', que: 'Una pista de patinaje con forma de corona circular está limitada por dos circunferencias concéntricas.', obj: 'la pista' },
    { u: 'cm', que: 'Dos circunferencias concéntricas limitan una corona circular.', obj: 'la corona' },
  ];

  // ---------- corona ----------
  function corona(rng, semilla) {
    const sub = rng.elegir(['radios', 'diametros', 'razon-suma', 'razon-suma', 'cuerda']);
    const ctx = rng.elegir(CTX_CORONA), u = ctx.u, u2 = u + '²';
    const variables = { R: { nombre: 'radio mayor', color: 'o' }, r: { nombre: 'radio menor', color: 'i' }, A: { nombre: 'área de la corona', color: 'd' } };
    const pregunta = ['¿Cuál es el ', v('A', 'área'), ` de ${ctx.obj}?`.replace('de el ', 'del ')];
    let R, r, correcta, errores, enunciado, solucion, datos;
    if (sub === 'radios' || sub === 'diametros') {
      R = rng.entero(4, 12); r = rng.entero(2, R - 1);
      if (sub === 'radios') {
        enunciado = [ctx.que, ' El radio exterior mide ', v('R', `${R} ${u}`), ' y el interior, ', v('r', `${r} ${u}`), '.'];
        datos = { tipo: 'corona', sub, u, R, r };
      } else {
        enunciado = [ctx.que, ' El diámetro exterior mide ', v('R', `${2 * R} ${u}`), ' y el del interior, ', v('r', `${2 * r} ${u}`), '.'];
        datos = { tipo: 'corona', sub, u, D: 2 * R, d: 2 * r };
      }
      correcta = X(0, R * R - r * r);
      errores = [
        ge('GE19-resta-radios', X(0, (R - r) ** 2), `Restaste los radios antes de elevar al cuadrado: π(${R} − ${r})². La corona es el círculo grande menos el chico, πR² − πr², y (R − r)² no es lo mismo que R² − r².`),
        ...(sub === 'diametros' ? [ge('GE19-diametro', X(0, 4 * (R * R - r * r)), `Usaste los diámetros como si fueran radios. El radio es la mitad del diámetro: ${2 * R} ÷ 2 = ${R} y ${2 * r} ÷ 2 = ${r}.`)] : []),
        ge('GE19-longitud', X(0, 2 * (R - r)), `Calculaste 2πR − 2πr, la diferencia entre las longitudes de las dos circunferencias. Eso mide bordes, no la región; el área lleva el radio al cuadrado.`),
        e('GE-circ-suma-areas', X(0, R * R + r * r), `Sumaste las áreas de los dos círculos. El círculo chico es el hueco: no forma parte de la corona y se resta.`),
        e('GE-circ-sin-restar', X(0, R * R), `Ese es el área del círculo grande entero, con el hueco incluido. Falta restar el círculo chico.`),
      ];
      solucion = [
        ...(sub === 'diametros' ? [['Los radios son la mitad de los diámetros: ', v('R', `R = ${R} ${u}`), ' y ', v('r', `r = ${r} ${u}`), '.']] : []),
        ['La corona es el círculo grande menos el chico: ', v('A', 'A'), ' = π', v('R', 'R'), '² − π', v('r', 'r'), '² = π(R² − r²).'],
        [v('A', 'A'), ` = π(${R * R} − ${r * r}) = `, v('A', textoX(correcta, u2)), '.'],
      ];
    } else if (sub === 'razon-suma') {
      const [a, b] = rng.elegir([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]]);
      const k = rng.entero(2, 4), S = (a + b) * k;
      r = a * k; R = b * k;
      variables.S = { nombre: 'suma de los radios', color: 'h' };
      enunciado = [ctx.que, ` Los radios de las dos circunferencias están en la razón ${a} : ${b} y suman `, v('S', `${S} ${u}`), '.'];
      correcta = X(0, R * R - r * r);
      errores = [
        ge('GE19-resta-radios', X(0, (R - r) ** 2), `Restaste los radios antes de elevar al cuadrado: π(${R} − ${r})². El área de la corona es π(R² − r²), y (R − r)² no es R² − r².`),
        e('GE-circ-sin-escala', X(0, b * b - a * a), `Usaste ${a} y ${b} como si fueran los radios. La razón solo dice la proporción: los radios son ${a}k y ${b}k, y con la suma sale k = ${k}.`),
        gp('GE1-escala-lineal', X(0, k * (b * b - a * a)), `Multiplicaste por k = ${k} y no por k². Si los radios se multiplican por ${k}, las áreas se multiplican por ${k}² = ${k * k}.`),
        e('GE-circ-suma-areas', X(0, R * R + r * r), `Sumaste las áreas de los dos círculos. El círculo chico es el hueco: se resta.`),
      ];
      solucion = [
        ['Con la razón, los radios son ', v('r', `r = ${a}k`), ' y ', v('R', `R = ${b}k`), '; su suma es ', `${a + b}k = `, v('S', `${S}`), `, así que k = ${k}.`],
        [v('r', `r = ${r} ${u}`), ' y ', v('R', `R = ${R} ${u}`), '.'],
        [v('A', 'A'), ` = π(R² − r²) = π(${R * R} − ${r * r}) = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'corona', sub, u, a, b, S };
    } else {
      const c = 2 * rng.entero(3, 12);
      variables.c = { nombre: 'cuerda tangente', color: 'h' };
      delete variables.R; delete variables.r;
      enunciado = [ctx.que, ' La cuerda AB de la circunferencia mayor es tangente a la menor en T y mide ', v('c', `${c} ${u}`), '. No se conocen los radios.'];
      correcta = X(0, c * c / 4);
      errores = [
        ge('GE19-cuerda-radio', X(0, c * c), `Usaste la cuerda entera: R² − r² = ${c}². El radio OT llega perpendicular a la cuerda y la parte en dos mitades de ${c / 2}; en el triángulo OTA, R² − r² = (${c / 2})².`),
        ge('GE19-longitud', X(0, c), `π·${c} es la longitud de una circunferencia de diámetro ${c}, no un área. El área lleva un cuadrado: π·(${c / 2})².`),
        e('GE-circ-cuerda-doble', X(0, c * c / 2), `Sumaste (${c / 2})² dos veces, una por cada mitad de la cuerda. El triángulo rectángulo OTA usa una sola mitad: R² = r² + (${c / 2})².`),
        e('GE-circ-cuerda-semi', X(0, c * c / 8), `Dividiste otra vez entre 2, como si fuera media corona. La cuerda tangente da toda la corona: π(R² − r²) = π(${c / 2})².`),
      ];
      solucion = [
        ['Une el centro O con T y con A: OT = r es perpendicular a AB y T es el punto medio de la cuerda, así TA = ', v('c', `${c / 2}`), '.'],
        ['En el triángulo rectángulo OTA: R² = r² + ', v('c', `${c / 2}`), '², o sea R² − r² = ', `${c * c / 4}.`],
        [v('A', 'A'), ` = π(R² − r²) = π·${c * c / 4} = `, v('A', textoX(correcta, u2)), '. No hace falta conocer cada radio.'],
      ];
      datos = { tipo: 'corona', sub, u, c };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- sector: semicorona, trapecio circular y perímetro del sector ----------
  function sector(rng, semilla) {
    const sub = rng.elegir(['semicorona', 'trapecio', 'trapecio', 'perimetro']);
    if (sub === 'semicorona') {
      const u = rng.elegir(['m', 'dm']), u2 = u + '²';
      const D = 2 * rng.entero(4, 12), d = 2 * rng.entero(2, D / 2 - 1);
      const R = D / 2, r = d / 2;
      const variables = { R: { nombre: 'diámetro mayor', color: 'o' }, r: { nombre: 'diámetro menor', color: 'i' }, A: { nombre: 'área de la mesa', color: 'd' } };
      const enunciado = [rng.elegir([
        'Una mesa de trabajo tiene forma de media corona circular: sus bordes curvos son dos semicircunferencias con el mismo centro, y sus dos bordes rectos están sobre un mismo diámetro.',
        'Un mostrador tiene forma de semicorona circular: está entre dos semicircunferencias concéntricas cuyos extremos están sobre una misma recta.',
      ]), ' El diámetro de la semicircunferencia exterior mide ', v('R', `${D} ${u}`), ' y el de la interior, ', v('r', `${d} ${u}`), '.'];
      const pregunta = ['¿Cuál es el ', v('A', 'área'), ' de la superficie del mueble?'];
      const correcta = X(0, (R * R - r * r) / 2);
      const errores = [
        ge('GE19-diametro', X(0, 2 * (R * R - r * r)), `Usaste los diámetros como radios. Los radios son ${R} y ${r}, la mitad de cada diámetro.`),
        e('GE-circ-semi-entera', X(0, R * R - r * r), `Ese es el área de la corona entera. La mesa es media corona: falta dividir entre 2.`),
        ge('GE19-resta-radios', X(0, (R - r) ** 2 / 2), `Restaste los radios antes de elevar al cuadrado. Media corona es (π/2)(R² − r²), y (R − r)² no es R² − r².`),
        e('GE-circ-sin-restar', X(0, R * R / 2), `Ese es el semicírculo grande completo. Falta quitar el semicírculo chico del centro.`),
      ];
      const solucion = [
        ['Radios: ', v('R', `R = ${R} ${u}`), ' y ', v('r', `r = ${r} ${u}`), ' (la mitad de cada diámetro).'],
        ['Media corona = la mitad de la corona: ', v('A', 'A'), ' = (π/2)(R² − r²).'],
        [v('A', 'A'), ` = (π/2)(${R * R} − ${r * r}) = `, v('A', textoX(correcta, u2)), '.'],
      ];
      return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos: { tipo: 'sector', sub, u, D, d } });
    }
    const t = rng.elegir([30, 45, 60, 72, 90, 120, 135, 150]);
    const f = t / 360;
    if (sub === 'trapecio') {
      const u = rng.elegir(['cm', 'dm']), u2 = u + '²';
      const R = rng.entero(4, 14), r = rng.entero(2, R - 2);
      const variables = { R: { nombre: 'radio mayor', color: 'o' }, r: { nombre: 'radio menor', color: 'i' }, t: { nombre: 'ángulo central', color: 'h' }, A: { nombre: 'área de la pieza', color: 'd' } };
      const ctx = rng.elegir([
        ['Una pieza de un vitral es un trapecio circular: está entre dos arcos con el mismo centro O, de radios ', ' y ', ', y entre dos radios que forman un ángulo de ', '.', 'la pieza de vidrio'],
        ['Un abanico de papel abierto forma un ángulo de ', '. El papel empieza a ', ' del eje y termina a ', ' del eje, entre dos arcos con centro en el eje.', 'el papel del abanico'],
      ]);
      let enunciado;
      if (ctx[0].startsWith('Una pieza')) enunciado = [ctx[0], v('R', `${R} ${u}`), ctx[1], v('r', `${r} ${u}`), ctx[2], v('t', `${t}°`), ctx[3]];
      else enunciado = [ctx[0], v('t', `${t}°`), ctx[1], v('r', `${r} ${u}`), ctx[2], v('R', `${R} ${u}`), ctx[3]];
      const pregunta = ['¿Cuál es el ', v('A', 'área'), ` de ${ctx[4]}?`.replace('de el ', 'del ')];
      const correcta = X(0, f * (R * R - r * r));
      const errores = [
        ge('GE19-fraccion', X(0, R * R - r * r), `Ese es el área de la corona completa. La pieza solo ocupa ${t}° de los 360°: falta multiplicar por ${t}/360.`),
        ge('GE19-resta-radios', X(0, f * (R - r) ** 2), `Restaste los radios antes de elevar al cuadrado. El trapecio circular es (${t}/360)·π(R² − r²).`),
        e('GE-circ-180', X(0, t / 180 * (R * R - r * r)), `Dividiste el ángulo entre 180 en vez de 360. Una vuelta completa tiene 360°.`),
        e('GE-circ-sector-grande', X(0, f * R * R), `Ese es el sector de radio ${R} completo. Falta quitarle el sector chico de radio ${r}.`),
      ];
      const solucion = [
        ['El trapecio circular es el sector grande menos el chico, con el mismo ángulo ', v('t', `${t}°`), '.'],
        [v('A', 'A'), ' = (', v('t', `${t}`), '/360)·π(', v('R', `${R}`), '² − ', v('r', `${r}`), `²) = (${t}/360)·π·${R * R - r * r}.`],
        [v('A', 'A'), ' = ', v('A', textoX(correcta, u2)), '.'],
      ];
      return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos: { tipo: 'sector', sub, u, R, r, t } });
    }
    // perímetro del sector
    const u = rng.elegir(['cm', 'm']);
    const den = racional(t / 180)[1];
    const r = den * rng.entero(1, Math.max(1, Math.floor(12 / den)));
    const correcta = X(2 * r, f * 2 * r);
    const variables = { r: { nombre: 'radio', color: 'o' }, t: { nombre: 'ángulo central', color: 'h' }, L: { nombre: 'perímetro', color: 'd' } };
    const ctx = rng.elegir([
      ['Se quiere poner cinta de borde alrededor de una porción de pizza con forma de sector circular de radio ', ' y ángulo central ', '.', '¿Cuánta cinta se necesita para todo el borde de la porción?'],
      ['Un jardín tiene forma de sector circular de radio ', ' y ángulo central ', '. Se cercará todo su contorno.', '¿Cuál es la longitud del cerco?'],
      ['Un sector circular tiene radio ', ' y ángulo central ', '.', '¿Cuál es su perímetro?'],
    ]);
    const enunciado = [ctx[0], v('r', `${r} ${u}`), ctx[1], v('t', `${t}°`), ctx[2]];
    const pregunta = [ctx[3]];
    const errores = [
      ge('GE19-solo-arco', X(0, f * 2 * r), `Contaste solo el arco. El contorno del sector también tiene los dos radios rectos: suma 2·${r}.`),
      e('GE-circ-un-radio', X(r, f * 2 * r), `Sumaste un solo radio. El sector tiene dos bordes rectos, uno a cada lado del arco.`),
      ge('GE19-sin-fraccion', X(2 * r, 2 * r), `Usaste la circunferencia completa 2π·${r}. El arco es solo ${t}/360 de esa vuelta.`),
      ge('GE19-diametro', X(2 * r, f * 4 * r), `En el arco usaste el doble del radio. El arco es (${t}/360)·2π·r con r = ${r}.`),
      gp('GE4-area-perimetro', X(0, f * r * r), `Calculaste el área del sector, (${t}/360)·πr². Se pide el borde, que es una longitud.`),
    ];
    const solucion = [
      ['Arco = (', v('t', `${t}`), '/360)·2π·', v('r', `${r}`), ' = ', textoX(X(0, f * 2 * r), u), '.'],
      ['El borde tiene además los dos radios: 2·', v('r', `${r}`), ` = ${2 * r} ${u}.`],
      [v('L', 'Perímetro'), ' = ', v('L', textoX(correcta, u)), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u, mismaForma: false, datos: { tipo: 'sector', sub, u, r, t } });
  }

  // ---------- concentricas: piezas de coronas divididas en sectores iguales ----------
  function concentricas(rng, semilla) {
    const sub = rng.elegir(['suma', 'suma', 'razon']);
    const rr = k => (k === 1 ? 'r' : `${k}r`);
    if (sub === 'razon') {
      const m = rng.entero(2, 5);
      const variables = { m: { nombre: 'anillo comparado', color: 'o' }, N: { nombre: 'número de veces', color: 'd' } };
      const nombres = ['', 'el círculo central', 'el primer anillo', 'el segundo anillo', 'el tercer anillo', 'el cuarto anillo'];
      const radios = Array.from({ length: m }, (_, i) => (i === 0 ? 'r' : `${i + 1}r`)).join(', ').replace(/, ([^,]+)$/, ' y $1');
      const enunciado = [`Un tiro al blanco tiene ${m} circunferencias concéntricas de radios ${radios}. Ocho radios lo dividen en 8 sectores iguales, así que cada anillo queda partido en 8 piezas iguales. `,
        'Se compara una pieza ', v('m', nombres[m].replace(/^el /, 'del ')), ' (entre las circunferencias de radios ', v('m', rr(m - 1)), ' y ', v('m', `${m}r`), ') con una pieza del círculo central.'];
      const pregunta = ['¿Cuántas ', v('N', 'veces'), ' cabe el área de la pieza central en el área de la pieza del anillo?'];
      const correcta = X(2 * m - 1);
      const errores = [
        gp('GE1-escala-lineal', X(m), `Comparaste los radios (${m}r contra r) como si el área creciera igual que el radio. El área va con el cuadrado del radio.`),
        e('GE-circ-sector-completo', X(m * m), `Esa es la razón con el sector completo de radio ${m}r. La pieza del anillo no incluye lo que está dentro del radio ${rr(m - 1)}.`),
        ge('GE19-resta-radios', X(1), `Restaste los radios antes de elevar: (${m}r − ${rr(m - 1)})² = r², como si la pieza fuera igual a la central. Hay que restar áreas: (${m}r)² − (${rr(m - 1)})².`),
        e('GE-circ-anillo-mas', X(2 * m + 1), `Esa sería una pieza entre ${m}r y ${m + 1}r, un anillo más afuera. La pieza pedida está entre ${rr(m - 1)} y ${m}r.`),
      ];
      const solucion = [
        ['Las dos piezas tienen el mismo ángulo (1/8 de vuelta), así que basta comparar r² con lo que queda entre los dos radios.'],
        ['Pieza del anillo: (1/8)·π[(', v('m', `${m}r`), ')² − (', v('m', `${rr(m - 1)}`), `)²] = (1/8)·π·${2 * m - 1}r².`],
        ['Pieza central: (1/8)·πr². La razón es ', v('N', `${2 * m - 1}`), '.'],
      ];
      return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: '', datos: { tipo: 'concentricas', sub, m } });
    }
    const u = rng.elegir(['dm', 'cm']), u2 = u + '²';
    const r1 = rng.entero(1, 4), r2 = r1 + rng.entero(1, 3), r3 = r2 + rng.entero(1, 3);
    const n = rng.elegir([4, 6, 8, 12]);
    const c = [rng.entero(1, 3), rng.entero(1, 3), rng.entero(1, 3)];
    const variables = { a: { nombre: 'radio interior', color: 'o' }, b: { nombre: 'radio medio', color: 'i' }, c: { nombre: 'radio exterior', color: 'h' }, A: { nombre: 'área pintada', color: 'd' } };
    const pz = k => `${k} ${k === 1 ? 'pieza' : 'piezas'}`;
    const enunciado = [rng.elegir(['Un vitral circular', 'Un tapete redondo', 'Un mosaico circular']), ' está formado por tres circunferencias concéntricas de radios ',
      v('a', `${r1} ${u}`), ', ', v('b', `${r2} ${u}`), ' y ', v('c', `${r3} ${u}`), `. Unos radios lo dividen en ${n} sectores iguales, de modo que el círculo central y cada uno de los dos anillos quedan partidos en ${n} piezas iguales. `,
      `Se pintan ${pz(c[0])} del círculo central, ${pz(c[1])} del anillo del medio y ${pz(c[2])} del anillo exterior.`];
    const pregunta = ['¿Cuál es el ', v('A', 'área pintada'), '?'];
    const correcta = calc.concentricas([r1, r2, r3], n, c);
    const errores = [
      ge('GE19-resta-radios', X(0, (c[0] * r1 * r1 + c[1] * (r2 - r1) ** 2 + c[2] * (r3 - r2) ** 2) / n), `En los anillos restaste los radios antes de elevar al cuadrado. Una pieza de anillo es (1/${n})·π(R² − r²), y (R − r)² no es R² − r².`),
      e('GE-circ-sector-completo', X(0, (c[0] * r1 * r1 + c[1] * r2 * r2 + c[2] * r3 * r3) / n), `Contaste cada pieza de anillo como el sector completo hasta el centro. A la pieza le falta lo que está dentro del radio anterior.`),
      e('GE-circ-piezas-iguales', X(0, (c[0] + c[1] + c[2]) * r1 * r1 / n), `Supusiste que todas las piezas miden lo mismo que una central. Las piezas de afuera son más anchas: abarcan el mismo ángulo con más radio.`),
      e('GE-circ-sin-n', X(0, c[0] * r1 * r1 + c[1] * (r2 * r2 - r1 * r1) + c[2] * (r3 * r3 - r2 * r2)), `Olvidaste que cada pieza es 1/${n} de su anillo: sumaste anillos completos.`),
    ];
    const solucion = [
      [`Cada pieza es 1/${n} de su región: el círculo central mide π·`, v('a', `${r1}`), '², el anillo medio π(', v('b', `${r2}`), '² − ', v('a', `${r1}`), '²) y el exterior π(', v('c', `${r3}`), '² − ', v('b', `${r2}`), '²).'],
      [`Una pieza central: π·${r1 * r1}/${n}; una del medio: π·${r2 * r2 - r1 * r1}/${n}; una exterior: π·${r3 * r3 - r2 * r2}/${n}.`],
      [v('A', 'Área pintada'), ` = (π/${n})·(${c[0]}·${r1 * r1} + ${c[1]}·${r2 * r2 - r1 * r1} + ${c[2]}·${r3 * r3 - r2 * r2}) = `, v('A', textoX(correcta, u2)), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos: { tipo: 'concentricas', sub, u, radios: [r1, r2, r3], n, piezas: c } });
  }

  // ---------- cuadrantes: el radio a partir del área entre dos cuadrantes concéntricos ----------
  function cuadrantes(rng, semilla) {
    const u = 'm';
    const R = rng.entero(4, 14), r = rng.entero(1, R - 1), d = R - r;
    const Spi = (R * R - r * r) / 4;
    if (!racional(Spi)) return null;
    const variables = { S: { nombre: 'área entre los cuadrantes', color: 'd' }, d: { nombre: 'CA', color: 'h' }, R: { nombre: 'OA', color: 'o' }, r: { nombre: 'OC', color: 'i' } };
    const enunciado = [rng.elegir(['En un parque hay dos cuadrantes AOB y COD con el mismo centro O', 'Dos cuadrantes AOB y COD tienen el mismo centro O']),
      ' y el mismo ángulo recto: C está sobre el radio OA y D sobre el radio OB, con OC < OA. La región entre los arcos AB y CD tiene un área de ',
      v('S', textoX(X(0, Spi), 'm²')), ' y el segmento ', v('d', `CA = ${d} m`), '.'];
    const pregunta = ['¿A qué distancia del centro O está el punto A (cuánto mide ', v('R', 'OA'), ')?'];
    const correcta = X(R);
    const sinCuarto = ((R + r) / 4 + d) / 2;
    const errores = [
      e('GE-circ-radio-menor', X(r), `Ese es OC, el radio del cuadrante chico. Se pide OA, el del grande.`),
      e('GE-circ-se-quedo-en-suma', X(R + r), `Ese valor es OA + OC = R + r. Falta un paso: con R + r = ${R + r} y R − r = ${d}, se despeja R.`),
      e('GE-circ-sin-mitad', X(2 * R), `Sumaste (R + r) + (R − r) = 2R y no dividiste entre 2.`),
      ge('GE19-fraccion', X(sinCuarto), `Usaste el área de la corona completa, π(R² − r²), en vez de su cuarta parte. Los cuadrantes son 1/4 de círculo.`),
    ];
    const solucion = [
      ['Área entre cuadrantes: (1/4)·π(', v('R', 'R'), '² − ', v('r', 'r'), '²) = ', v('S', textoX(X(0, Spi))), `, así que R² − r² = ${R * R - r * r}.`],
      ['R² − r² = (R + r)(R − r) y ', v('d', `R − r = CA = ${d}`), `, entonces R + r = ${R * R - r * r} ÷ ${d} = ${R + r}.`],
      ['Sumando: 2R = ', `${R + r} + ${d}`, ', así ', v('R', `OA = ${R} m`), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u, datos: { tipo: 'cuadrantes', u, Spi, d, R, r } });
  }

  // ---------- sombreada: figura menos círculos tangentes ----------
  function sombreada(rng, semilla) {
    const sub = rng.elegir(['rect-tres', 'cuadrado-cuatro', 'cuadrado-esquinas', 'logo-tangente']);
    const u = rng.elegir(['cm', 'dm']), u2 = u + '²';
    const variables = { L: { nombre: 'lado', color: 'o' }, r: { nombre: 'radio', color: 'i' }, A: { nombre: 'área sin pintar', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos;
    if (sub === 'rect-tres') {
      const r = rng.elegir([2, 4, 6]), W = 2 * r, Lg = 4 * r;
      enunciado = [rng.elegir(['Un letrero rectangular', 'Una placa rectangular', 'Un rectángulo']), ' mide ', v('L', `${Lg} ${u} por ${W} ${u}`),
        '. Se pinta un círculo en el centro que toca los dos lados largos, y dos semicírculos que tienen por diámetro cada uno de los lados cortos; los semicírculos tocan al círculo.'];
      pregunta = ['¿Qué ', v('A', 'área'), ' del rectángulo queda sin pintar?'];
      correcta = X(8 * r * r, -2 * r * r);
      errores = [
        e('GE-circ-falta-pieza', X(8 * r * r, -r * r), `Restaste solo el círculo. Los dos semicírculos también están pintados: juntos forman otro círculo igual.`),
        ge('GE19-longitud', X(8 * r * r, -4 * r), `Restaste longitudes (2πr del círculo y πr de cada semicírculo) en lugar de áreas. El área de un círculo es πr².`),
        e('GE-circ-semi-cuarto', X(8 * r * r, -1.5 * r * r), `Tomaste cada semicírculo como un cuarto de círculo. Dos semicírculos iguales suman un círculo entero.`),
      ];
      solucion = [
        ['El círculo toca los dos lados largos, así que su diámetro es el ancho: ', v('r', `r = ${r} ${u}`), '. Los semicírculos tienen el mismo radio.'],
        ['Pintado: un círculo más dos semicírculos = 2 círculos = 2π·', v('r', `${r}`), `² = ${2 * r * r}π ${u2}.`],
        [v('A', 'Sin pintar'), ` = ${Lg}·${W} − ${2 * r * r}π = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'sombreada', sub, u, r };
    } else if (sub === 'cuadrado-cuatro') {
      const r = rng.entero(2, 6), l = 4 * r;
      enunciado = [rng.elegir(['Una caja cuadrada', 'Una bandeja cuadrada', 'Un cuadrado']), ' de lado ', v('L', `${l} ${u}`),
        ' contiene cuatro círculos iguales (cuatro galletas, vistas desde arriba), en dos filas de dos: cada círculo toca a sus dos vecinos y a dos lados del cuadrado.'];
      pregunta = ['¿Cuál es el ', v('A', 'área'), ' del fondo del cuadrado que no cubren los círculos?'];
      correcta = X(16 * r * r, -4 * r * r);
      errores = [
        e('GE-circ-falta-pieza', X(16 * r * r, -r * r), `Restaste un solo círculo. Son cuatro círculos de radio ${r}.`),
        ge('GE19-longitud', X(16 * r * r, -8 * r), `Restaste las longitudes de las circunferencias (2πr cada una) en vez de sus áreas (πr²).`),
        e('GE-circ-un-cuarto', X(4 * r * r, -r * r), `Esa es la parte libre de un solo cuadradito de ${2 * r} × ${2 * r}. El cuadrado completo tiene cuatro de esos cuadraditos.`),
      ];
      solucion = [
        ['En cada fila caben dos diámetros: 4', v('r', 'r'), ' = ', v('L', `${l}`), ', así ', v('r', `r = ${r} ${u}`), '.'],
        [`Círculos: 4·π·${r}² = ${4 * r * r}π ${u2}. Cuadrado: ${l}² = ${l * l} ${u2}.`],
        [v('A', 'Área libre'), ` = ${l * l} − ${4 * r * r}π = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'sombreada', sub, u, r };
    } else if (sub === 'cuadrado-esquinas') {
      const l = 4 * rng.entero(1, 5);
      enunciado = [rng.elegir(['Una loseta cuadrada', 'Un pañuelo cuadrado', 'Un cuadrado']), ' de lado ', v('L', `${l} ${u}`),
        ' tiene pintado, en cada una de sus cuatro esquinas, un cuarto de círculo con centro en el vértice y radio igual a la mitad del lado.'];
      pregunta = ['¿Cuál es el ', v('A', 'área'), ' que queda sin pintar?'];
      correcta = X(l * l, -l * l / 4);
      errores = [
        e('GE-circ-un-cuarto', X(l * l, -l * l / 16), `Restaste un solo cuarto de círculo. Hay uno en cada esquina: los cuatro juntos forman un círculo de radio ${l / 2}.`),
        ge('GE19-longitud', X(l * l, -l), `Restaste las longitudes de los cuatro arcos en vez de las áreas de los cuartos de círculo.`),
        e('GE-circ-dos-cuartos', X(l * l, -l * l / 8), `Contaste solo dos esquinas. Las cuatro esquinas tienen su cuarto de círculo.`),
      ];
      solucion = [
        ['Cada cuarto tiene radio ', v('r', `${l / 2} ${u}`), '; los cuatro juntos son un círculo entero: π·', v('r', `${l / 2}`), `² = ${l * l / 4}π ${u2}.`],
        [v('A', 'Sin pintar'), ` = `, v('L', `${l}`), `² − ${l * l / 4}π = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'sombreada', sub, u, l };
    } else if (sub === 'logo-tangente') {
      const r = rng.entero(2, 6), l = 4 * r;
      variables.c = { nombre: 'radio de la circunferencia central', color: 'h' };
      enunciado = [rng.elegir(['El logo de un club se dibuja en un cuadrado', 'Una baldosa decorada es un cuadrado', 'En un cuadrado']), ' ABCD de lado ', v('L', `${l} ${u}`),
        '. Sobre cada lado se dibuja, hacia adentro, un semicírculo cuyo diámetro es el tramo central del lado: va del punto que está a ', v('r', `${r} ${u}`),
        ' de una esquina al punto que está a ', v('r', `${r} ${u}`), ' de la otra. En el centro del cuadrado hay una circunferencia inscrita en el hueco que dejan los semicírculos: toca a los cuatro. Se pinta la parte del cuadrado que queda fuera de los semicírculos y del círculo central.'];
      pregunta = ['¿Cuál es el ', v('A', 'área pintada'), '?'];
      correcta = X(16 * r * r, -3 * r * r);
      errores = [
        e('GE-circ-semi-como-circulo', X(16 * r * r, -5 * r * r), `Tomaste cada semicírculo como un círculo entero. Los cuatro semicírculos juntos suman dos círculos de radio ${r}.`),
        e('GE-circ-falta-pieza', X(16 * r * r, -2 * r * r), `Restaste los semicírculos pero no el círculo central.`),
        e('GE-circ-radio-central', X(16 * r * r, -2 * r * r - r * r / 4), `Tomaste el radio del círculo central como la mitad del radio de los semicírculos. El centro O está a ${2 * r} ${u} del centro de cada semicírculo; como se tocan, el radio central es ${2 * r} − ${r} = ${r}.`),
        ge('GE19-longitud', X(16 * r * r, -6 * r), `Restaste longitudes (las de la circunferencia central y de los cuatro arcos) en vez de áreas.`),
      ];
      solucion = [
        ['Cada semicírculo tiene diámetro ', `${l} − 2·${r} = ${2 * r}`, ': radio ', v('r', `${r}`), '. Su centro es el punto medio del lado, a ', `${2 * r} ${u}`, ' del centro O del cuadrado.'],
        ['La circunferencia central toca a cada semicírculo: su radio es ', v('c', `${2 * r} − ${r} = ${r}`), '.'],
        [`Figuras: 4 semicírculos (= 2 círculos) + 1 círculo = 3·π·${r}² = ${3 * r * r}π ${u2}.`],
        [v('A', 'Pintado'), ` = ${l}² − ${3 * r * r}π = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'sombreada', sub, u, r };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- lunulas: traslado de regiones y lúnulas ----------
  function lunulas(rng, semilla) {
    const sub = rng.elegir(['flor', 'dos-cuadrantes', 'cuadrante-dos-semis', 'cuadrante-semi', 'hipocrates', 'hex-sector', 'hex-segmentos', 'cuadricula']);
    const u = rng.elegir(['cm', 'm']), u2 = u + '²';
    if (sub === 'hex-sector' || sub === 'hex-segmentos') return hexagono(rng, semilla, sub, u);
    if (sub === 'cuadricula') return cuadricula(rng, semilla, u);
    const variables = { L: { nombre: 'lado o radio', color: 'o' }, A: { nombre: 'área pedida', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos, mismaForma = true;
    if (sub === 'flor') {
      const l = 2 * rng.entero(1, 6);
      enunciado = [rng.elegir(['Para el logo de una tienda, en un cuadrado', 'En un cuadrado']), ' ABCD de lado ', v('L', `${l} ${u}`),
        ' se trazan, hacia adentro, cuatro semicírculos que tienen por diámetro cada uno de los lados. Los semicírculos se cruzan y forman cuatro pétalos: las zonas que quedan dentro de dos semicírculos a la vez.'];
      pregunta = ['¿Cuál es el ', v('A', 'área'), ' de los cuatro pétalos juntos?'];
      correcta = X(-l * l, l * l / 2);
      errores = [
        e('GE-circ-sin-traslape', X(0, l * l / 2), `Sumaste los cuatro semicírculos. Esa suma cubre el cuadrado entero y cuenta dos veces cada pétalo: hay que restarle el cuadrado.`),
        e('GE-circ-complemento', X(2 * l * l, -l * l / 2), `Esa es el área del cuadrado que queda fuera de los pétalos, no la de los pétalos.`),
        e('GE-circ-semi-como-circulo', X(-l * l, l * l), `Tomaste cada semicírculo como un círculo entero de radio ${l / 2}.`),
        ge('GE19-diametro', X(-l * l, 2 * l * l), `Usaste el lado como radio. El lado es el diámetro de cada semicírculo: el radio es ${l / 2}.`),
      ];
      solucion = [
        ['Los cuatro semicírculos (radio ', v('L', `${l / 2}`), `) suman 4·(π·${l / 2}²/2) = ${l * l / 2}π.`],
        ['Esa suma cubre todo el cuadrado y cuenta dos veces cada pétalo: suma = cuadrado + pétalos.'],
        [v('A', 'Pétalos'), ` = ${l * l / 2}π − ${l * l} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'lunulas', sub, u, l };
    } else if (sub === 'dos-cuadrantes') {
      const l = 2 * rng.entero(1, 6);
      enunciado = [rng.elegir(['En un terreno cuadrado', 'En un cuadrado']), ' ABCD de lado ', v('L', `${l} ${u}`),
        ' se trazan dos arcos: uno con centro en A y radio AB, que va de B a D, y otro con centro en C y radio CB, que también va de B a D. Entre los dos arcos queda una región con forma de hoja.'];
      pregunta = ['¿Cuál es el ', v('A', 'área'), ' de la hoja?'];
      correcta = X(-l * l, l * l / 2);
      errores = [
        e('GE-circ-sin-traslape', X(0, l * l / 2), `Sumaste los dos cuadrantes. Juntos cubren el cuadrado y cuentan la hoja dos veces: falta restar el cuadrado.`),
        e('GE-circ-complemento', X(2 * l * l, -l * l / 2), `Esa es el área de las dos esquinas que quedan fuera de la hoja, no la de la hoja.`),
        e('GE-circ-un-segmento', X(-l * l / 2, l * l / 4), `Esa es solo media hoja: el cuadrante menos un triángulo. La hoja tiene dos mitades, una a cada lado de la diagonal BD.`),
        e('GE-circ-un-cuadrante', X(l * l, -l * l / 4), `Restaste un cuadrante al cuadrado: esa es una esquina sola. La hoja es la parte común de los dos cuadrantes.`),
      ];
      solucion = [
        ['Cada cuadrante mide π·', v('L', `${l}`), `²/4 = ${l * l / 4}π.`],
        ['Los dos juntos cubren el cuadrado y cuentan la hoja dos veces: 2·cuadrante = cuadrado + hoja.'],
        [v('A', 'Hoja'), ` = ${l * l / 2}π − ${l * l} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'lunulas', sub, u, l };
    } else if (sub === 'cuadrante-dos-semis') {
      const R = 4 * rng.entero(1, 4);
      enunciado = [rng.elegir(['Un abanico decorativo tiene forma de cuadrante', 'Se dibuja un cuadrante']), ' AOB de centro O y radio ', v('L', `${R} ${u}`),
        '. Dentro de él se trazan dos semicírculos: uno con diámetro OA y otro con diámetro OB. Los semicírculos se cruzan y dejan sin cubrir una zona del cuadrante, junto al arco AB.'];
      pregunta = ['¿Cuál es el ', v('A', 'área'), ' de la zona del cuadrante que no cubre ningún semicírculo?'];
      correcta = X(-R * R / 4, R * R / 8);
      errores = [
        e('GE-circ-sin-triangulo', X(0, R * R / 8), `Te quedaste con π·${R}²/8. La zona libre es igual a la zona donde se cruzan los semicírculos, y a esa le falta restar el triángulo (o los triángulos) del centro.`),
        e('GE-circ-un-segmento', X(-R * R / 8, R * R / 16), `Esa es la mitad de la zona: un solo segmento circular. Son dos segmentos, uno a cada lado de la cuerda común.`),
        ge('GE19-diametro', X(-R * R, R * R / 2), `Usaste ${R} como radio de los semicírculos. OA es su diámetro: el radio es ${R / 2}.`),
        e('GE-circ-complemento', X(R * R / 4, R * R / 8), `Esa es la parte cubierta por los semicírculos, no la que queda libre.`),
      ];
      solucion = [
        [`Cuadrante: π·${R}²/4 = ${R * R / 4}π. Cada semicírculo: π·${R / 2}²/2 = ${R * R / 8}π; los dos suman ${R * R / 4}π, lo mismo que el cuadrante.`],
        ['Como los semicírculos se cruzan, lo que se cuenta dos veces (el cruce) es igual a lo que queda libre: libre = cruce.'],
        [`El cruce son dos segmentos de radio ${R / 2} y 90°: 2·(π·${R / 2}²/4 − ${R / 2}²/2) = ${R * R / 8}π − ${R * R / 4}.`],
        [v('A', 'Área libre'), ' = ', v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'lunulas', sub, u, R };
    } else if (sub === 'cuadrante-semi') {
      const R = 4 * rng.entero(1, 5);
      enunciado = [rng.elegir(['Una ventana tiene forma de cuadrante', 'Se dibuja un cuadrante']), ' AOB de centro O y radio ', v('L', `${R} ${u}`),
        '. Dentro de él se traza un semicírculo con diámetro OA; el resto del cuadrante se pinta.'];
      pregunta = ['¿Cuál es el ', v('A', 'área pintada'), '?'];
      correcta = X(0, R * R / 8);
      errores = [
        e('GE-circ-sin-restar', X(0, R * R / 4), `Ese es el cuadrante entero. Falta quitar el semicírculo de diámetro OA.`),
        ge('GE19-resta-radios', X(0, R * R / 16), `Restaste radios antes de elevar al cuadrado: π(${R} − ${R / 2})²/4. Hay que restar áreas: π·${R}²/4 − π·${R / 2}²/2.`),
        e('GE-circ-suma-areas', X(0, 3 * R * R / 8), `Sumaste el semicírculo al cuadrante en vez de restarlo.`),
      ];
      solucion = [
        [`Cuadrante: π·`, v('L', `${R}`), `²/4 = ${R * R / 4}π.`],
        [`Semicírculo de diámetro ${R} (radio ${R / 2}): π·${R / 2}²/2 = ${R * R / 8}π.`],
        [v('A', 'Pintado'), ` = ${R * R / 4}π − ${R * R / 8}π = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'lunulas', sub, u, R };
    } else {
      const [a0, b0, c0] = rng.elegir([[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
      const k = a0 === 3 ? rng.entero(2, 4) : 1;
      const a = a0 * k, b = b0 * k, c = c0 * k;
      variables.L = { nombre: 'cateto AB', color: 'o' }; variables.B = { nombre: 'cateto BC', color: 'i' };
      enunciado = ['En el triángulo rectángulo ABC, recto en B, los catetos miden ', v('L', `AB = ${a} ${u}`), ' y ', v('B', `BC = ${b} ${u}`),
        `, y la hipotenusa AC = ${c} ${u}. Sobre cada cateto se traza un semicírculo hacia afuera, y se traza la semicircunferencia de diámetro AC que pasa por B. Cada lúnula es la parte de un semicírculo pequeño que queda fuera de la semicircunferencia grande.`];
      pregunta = ['¿Cuánto suman las ', v('A', 'áreas de las dos lúnulas'), '?'];
      correcta = X(a * b / 2);
      mismaForma = false;
      errores = [
        e('GE-circ-sin-mitad', X(a * b), `Ese es AB·BC sin dividir entre 2. Las lúnulas suman exactamente el área del triángulo, que es la mitad del producto de los catetos.`),
        gp('GE7-hipotenusa-y-BC', X(b * c / 2), `Usaste la hipotenusa como si fuera la altura del triángulo. En el triángulo rectángulo, base y altura son los dos catetos.`),
        gp('GE7-hipotenusa-y-AB', X(a * c / 2), `Usaste la hipotenusa como si fuera la altura del triángulo. En el triángulo rectángulo, base y altura son los dos catetos.`),
        gp('GE4-area-perimetro', X(a + b + c), `Sumaste los lados del triángulo: ese es su perímetro, una longitud. Las lúnulas suman el área del triángulo.`),
        e('GE-circ-sin-restar', X(0, (a * a + b * b) / 8), `Sumaste los dos semicírculos pequeños enteros. A cada uno le falta quitar la parte que está dentro de la semicircunferencia grande.`),
        e('GE-circ-complemento', X(-a * b / 2, c * c / 8), `Esa es la parte de la semicircunferencia grande que queda fuera del triángulo, no la de las lúnulas.`),
      ];
      solucion = [
        ['Lúnulas = semicírculos pequeños + triángulo − semicírculo grande (el grande cubre el triángulo y lo que falta de las lúnulas).'],
        [`Semicírculos: π(${a}² + ${b}²)/8 = π·${c}²/8, por Pitágoras. El semicírculo grande también es π·${c}²/8: se cancelan.`],
        [v('A', 'Lúnulas'), ' = área del triángulo = ', v('L', `${a}`), '·', v('B', `${b}`), '/2 = ', v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'lunulas', sub, u, a, b, c };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, mismaForma, datos });
  }

  // ---------- hexágono y triángulo inscritos: de las áreas sombreadas a la longitud ----------
  const PIEZAS_HEX = ['ABC con el segmento de la cuerda AB', 'CDE con el segmento de la cuerda CD', 'EFA con el segmento de la cuerda EF'];
  function hexagono(rng, semilla, sub, u) {
    const u2 = u + '²';
    const variables = { S: { nombre: 'área sombreada', color: 'o' }, R: { nombre: 'radio', color: 'i' }, L: { nombre: 'longitud de la circunferencia', color: 'd' } };
    let R, n = 0, Stxt, solucion, errores;
    const base = 'En una circunferencia de centro O se inscriben el hexágono regular ABCDEF y el triángulo equilátero ACE.';
    let enunciado;
    if (sub === 'hex-sector') {
      R = rng.entero(3, 9); n = rng.entero(1, 3);
      const Spi = n * R * R / 6;
      if (!racional(Spi)) return null;
      Stxt = textoX(X(0, Spi), u2);
      const lista = PIEZAS_HEX.slice(0, n);
      enunciado = [base, ` Se sombrea${n > 1 ? 'n' : ''} ${n === 1 ? 'una región formada' : `${n} regiones, cada una formada`} por un triángulo que queda entre el hexágono y el triángulo (con dos lados del hexágono y un lado de ACE) y el segmento circular que está sobre uno de esos lados del hexágono: `,
        lista.map(t => `el triángulo ${t}`).join(n === 3 ? ', ' : ' y ').replace(/, (el triángulo EFA)/, ' y $1'), '. El área sombreada total es ', v('S', Stxt), '.'];
      errores = [
        ge('GE19-diametro-radio', X(0, R), `Ese es π por el radio: usaste la fórmula con el radio en lugar del diámetro. La longitud es 2πR.`),
        ge('GE19-longitud', X(0, R * R), `Ese es el área del círculo, πR². Se pide la longitud, 2πR.`),
        ge('GE19-diametro', X(0, 4 * R), `Usaste 2R como radio en 2πR.`),
      ];
      solucion = [
        ['OABC es un rombo de lado R (OA = AB = BC = CO). La diagonal AC lo parte en ABC y AOC, y la diagonal OB en OAB y OBC: cada mitad mide lo mismo, así el triángulo ABC tiene la misma área que OAB.'],
        ['Cada región = triángulo OAB + segmento de AB = sector AOB de 60° = πR²/6 (se traslada el triángulo).'],
        [`${n} regiones: ${n}·πR²/6 = `, v('S', Stxt), `, así R² = ${R * R} y `, v('R', `R = ${R} ${u}`), '.'],
        [v('L', 'L'), ' = 2π·', v('R', `${R}`), ' = ', v('L', textoX(X(0, 2 * R), u)), '.'],
      ];
    } else {
      R = 2 * rng.entero(2, 4);
      Stxt = `(${nro(R * R)}π − ${nro(3 * R * R / 2)}√3) ${u2}`;
      enunciado = [base, ' Se sombrean los seis segmentos circulares que quedan entre la circunferencia y el hexágono (cada uno entre un lado del hexágono y su arco). Su área total es ', v('S', Stxt), '.'];
      errores = [
        ge('GE19-diametro-radio', X(0, R), `Ese es π por el radio. La longitud es 2πR.`),
        ge('GE19-longitud', X(0, R * R), `Ese es el área del círculo, πR². Se pide la longitud, 2πR.`),
        ge('GE19-diametro', X(0, 4 * R), `Usaste 2R como radio en 2πR.`),
      ];
      solucion = [
        ['Segmentos = círculo − hexágono = πR² − 6·(√3/4)R² = R²(π − 3√3/2).'],
        ['Igualando con ', v('S', Stxt), `: R² = ${R * R}, así `, v('R', `R = ${R} ${u}`), '.'],
        [v('L', 'L'), ' = 2π·', v('R', `${R}`), ' = ', v('L', textoX(X(0, 2 * R), u)), '.'],
      ];
    }
    const pregunta = ['¿Cuál es la ', v('L', 'longitud de la circunferencia'), '?'];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta: X(0, 2 * R), errores, solucion, unidad: u,
      datos: sub === 'hex-sector' ? { tipo: 'lunulas', sub, u, n, Spi: n * R * R / 6 } : { tipo: 'lunulas', sub, u, Spi: R * R, Sr3: -3 * R * R / 2 } });
  }

  // ---------- cuadrícula: trasladar regiones curvas completa cuadrados ----------
  function cuadricula(rng, semilla, u) {
    const a = 2 * rng.entero(1, 5), u2 = u + '²', h = a / 2;
    const variables = { a: { nombre: 'lado de la cuadrícula', color: 'o' }, A: { nombre: 'área del logo', color: 'd' } };
    const c = x => nro(x);
    const enunciado = [rng.elegir(['Un logo se dibuja', 'Un mosaico se arma', 'Una figura se pinta']), ' sobre una cuadrícula de 2 × 2 cuadrados de lado ', v('a', `${a} ${u}`),
      `. Con coordenadas en ${u}, las esquinas de la cuadrícula son (0; 0), (${c(2 * a)}; 0), (${c(2 * a)}; ${c(2 * a)}) y (0; ${c(2 * a)}). El logo es la unión de cuatro piezas: `,
      `(1) el cuarto de círculo de centro (0; 0) y radio ${c(a)}, dentro del cuadrado de (0; 0) a (${c(a)}; ${c(a)}); `,
      `(2) el cuadrado de (${c(a)}; 0) a (${c(2 * a)}; ${c(a)}) sin el cuarto de círculo de centro (${c(a)}; 0) y radio ${c(a)}; `,
      `(3) el cuadrado de (0; ${c(a)}) a (${c(a)}; ${c(2 * a)}) sin el semicírculo de centro (0; ${c(3 * h)}) y radio ${c(h)}; `,
      `(4) el semicírculo de centro (${c(a)}; ${c(3 * h)}) y radio ${c(h)} que está a la derecha de la recta x = ${c(a)}.`];
    const pregunta = ['¿Cuál es el ', v('A', 'área del logo'), '?'];
    const correcta = X(2 * a * a);
    const errores = [
      e('GE-circ-cuadrados-tocados', X(4 * a * a), `Contaste los cuatro cuadrados de la cuadrícula como llenos. Las piezas curvas no llenan cada cuadrado: hay que trasladarlas.`),
      e('GE-circ-sin-hueco', X(2 * a * a, a * a / 4), `Contaste la pieza 2 como un cuadrado entero. Le falta el cuarto de círculo de centro (${c(a)}; 0), que es justo el tamaño de la pieza 1.`),
      e('GE-circ-semi-completa', X(3 * a * a), `Contaste como lleno el cuadrado de arriba a la derecha, pero ahí solo hay medio círculo; ese medio círculo llena el hueco de la pieza 3.`),
      e('GE-circ-resta-en-vez-de-trasladar', X(2 * a * a, -a * a / 4), `Restaste el cuarto de círculo de la pieza 1 en lugar de sumarlo: la pieza 1 está pintada y tapa el hueco de la pieza 2.`),
      e('GE-circ-un-traslado', X(a * a), `Encontraste un solo cuadrado completo. Son dos traslados: el cuarto de círculo llena el hueco de abajo y el semicírculo de la derecha llena el de arriba.`),
    ];
    const solucion = [
      [`La pieza 1 (cuarto de círculo de radio ${c(a)}) tiene la misma forma y tamaño que el hueco de la pieza 2: al trasladarla ${c(a)} ${u} a la derecha, completa el cuadrado de abajo: ${c(a * a)} ${u2}.`],
      [`El semicírculo 4 es igual al hueco de la pieza 3: trasladado ${c(a)} ${u} a la izquierda, completa el cuadrado de arriba: ${c(a * a)} ${u2}.`],
      [v('A', 'Logo'), ' = 2·', v('a', `${c(a)}`), '² = ', v('A', textoX(correcta, u2)), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, mismaForma: false, datos: { tipo: 'lunulas', sub: 'cuadricula', u, a } });
  }

  // ---------- rueda: la cicloide y las fracciones de vuelta ----------
  const VUELTAS = [[1, 'una vuelta completa'], [1.5, 'una vuelta y media'], [2, 'dos vueltas completas'], [2.5, 'dos vueltas y media'], [3, 'tres vueltas completas'], [4, 'cuatro vueltas completas']];
  function rueda(rng, semilla) {
    const u = rng.elegir(['cm', 'm']);
    const r = u === 'cm' ? rng.entero(2, 15) : rng.entero(1, 3);
    const [n, nTxt] = rng.elegir(VUELTAS);
    const conCentro = rng.moneda();
    const variables = { r: { nombre: 'radio', color: 'o' }, n: { nombre: 'vueltas', color: 'i' }, L: { nombre: 'longitud recorrida por P', color: 'd' } };
    const obj = rng.elegir(['Una rueda', 'Un aro', 'Una moneda grande']);
    const dato = 'Un punto del borde de una rueda que rueda sin resbalar describe una curva llamada cicloide; en cada vuelta completa, ese punto recorre una longitud igual a 8 veces el radio, y en media vuelta (desde el suelo hasta lo más alto) recorre 4 veces el radio.';
    let enunciado, datos;
    const Dpi = 2 * r * n;
    if (!conCentro) {
      enunciado = [dato, ` ${obj} de radio `, v('r', `${r} ${u}`), ' rueda sin resbalar por un piso recto y da ', v('n', nTxt), '. El punto P de su borde estaba tocando el piso al empezar.'];
      datos = { tipo: 'rueda', u, r, n, conCentro: false };
    } else {
      variables.D = { nombre: 'avance del centro', color: 'h' };
      enunciado = [dato, ` ${obj} de radio `, v('r', `${r} ${u}`), ' rueda sin resbalar por un piso recto, y su centro avanza ', v('D', textoX(X(0, Dpi), u)), '. El punto P de su borde estaba tocando el piso al empezar.'];
      datos = { tipo: 'rueda', u, r, Dpi, conCentro: true };
    }
    const pregunta = ['¿Qué ', v('L', 'longitud'), ' recorre el punto P sobre la cicloide?'];
    const correcta = X(8 * r * n);
    const errores = [
      e('TR-ciclo-agrega-pi', X(0, 8 * r * n), `Agregaste π a un resultado que ya está en ${u}. La longitud de la cicloide es 8r por vuelta, sin π: el π aparece en lo que avanza el centro, no aquí.`),
      e('GE-ciclo-centro', X(0, 2 * r * n), `Esa es la distancia que avanza el centro (2πr por vuelta). El punto del borde sube y baja, y recorre más: 8r por vuelta.`),
      ge('GE19-diametro', X(16 * r * n), `Usaste el diámetro en lugar del radio en 8r. El dato es 8 veces el radio, ${8 * r} ${u} por vuelta.`),
      e('GE-ciclo-una-vuelta', X(8 * r), `Contaste una sola vuelta. Son ${P.formatear(n, 1)} vueltas: multiplica 8r por ese número.`),
      e('GE-ciclo-mitad', X(4 * r * n), `Usaste 4r por vuelta, que es lo de media vuelta. Una vuelta completa son 8r.`),
    ];
    const solucion = [
      ...(conCentro ? [['En cada vuelta el centro avanza 2π·', v('r', `${r}`), ` = ${2 * r}π ${u}; con `, v('D', textoX(X(0, Dpi), u)), ' son ', v('n', `${P.formatear(n, 1)} ${n === 1 ? 'vuelta' : 'vueltas'}`), '.']] : []),
      ['Por cada vuelta, P recorre 8', v('r', 'r'), ' = ', `${8 * r} ${u}; por cada media vuelta, 4r = ${4 * r} ${u}.`],
      [v('L', 'L'), ' = 8·', v('r', `${r}`), '·', v('n', P.formatear(n, 1)), ' = ', v('L', textoX(correcta, u)), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u, mismaForma: false, datos });
  }

  const CONSTRUIR = { corona, sector, concentricas, cuadrantes, sombreada, lunulas, rueda };

  return { id: ID, titulo: 'Coronas, sectores y regiones con arcos', generar, calc, textoX, clave };
});
