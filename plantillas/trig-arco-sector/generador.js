/*
 * Generador «Longitud de arco y sector circular»: la práctica de las cinco ideas de trigonometria.longitud-de-arco-y-sector
 * (contenido/teoria/trigonometria/longitud-de-arco-y-sector.js). Formato "predicciones" (docs/arquitectura.md). Funciona
 * en el navegador (window.Generadores['trig-arco-sector']) y en Node (require). No usa ningún motor: las cuentas son
 * productos y cocientes de números chicos con π (s = θ · r, A = θ · r²/2, n = d/(2πr), θ₁ · r₁ = θ₂ · r₂).
 *
 * Propuesta: docs/etapa6/propuesta-trigonometria.md §7 (Gerson delegó el criterio). Objetos, como en la teoría: el
 * columpio, el abanico, el limpiaparabrisas, la rueda de la bicicleta, el plato y el piñón, el pozo con su tambor. Valores
 * de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; generar(semilla, { tipo }) uno solo; sin nada, las cinco ideas con el mismo peso.
 *   arco               arco (1) el arco con el ángulo en radianes · grados (2) el arco o el radio con el ángulo en
 *                      grados · arco-examen (3) el minutero de un reloj o un ángulo en grados centesimales
 *   sector             area (1) el área con el arco y el radio, o con el ángulo en radianes · area-grados (2) el área con
 *                      el ángulo en grados, o el radio desde el área · perimetro (3) el cerco de un sector con su área y su
 *                      ángulo (San Marcos 2025-II), o el perímetro que es «tantas veces el radio»
 *   trapecio-circular  banda (1) el área con el ángulo en radianes y los dos radios · banda-arcos (2) el área o el ángulo
 *                      con los dos arcos y el ancho · banda-examen (3) el limpiaparabrisas (San Marcos 2020-I) o la razón
 *                      entre el trapecio y el sector chico (San Marcos 2026-II)
 *   vueltas-rueda      vueltas (1) las vueltas con lo que avanza la rueda · rodea (2) una rueda alrededor de otra fija ·
 *                      dos-ruedas (3) dos ruedas de radios distintos que avanzan lo mismo
 *   faja-y-eje         faja (1) dos poleas con faja · eje (2) faja y eje común (tres ruedas) · balde (3) la manivela, la
 *                      faja y el tambor que sube un balde
 * Lo que la teoría dejó fuera no entra: razones trigonométricas, velocidades y la cicloide.
 *
 * Notación y colores (regla de la unidad, cabecera de la teoría; docs/molde-unidad.md §5b): el ángulo θ en carmín (ang, h),
 * los radios en naranja (rad, o), los arcos y lo que avanza una rueda en turquesa (arco, i), el área y las vueltas en
 * violeta (area y vuel, f). Sin verde. Letras: θ, r, s, A, h, n, d (y r₁, r₂, s₁, s₂, n₁, n₂); nunca R ni L.
 * Datos (docs/plan-calidad.md §3, punto 13): la fórmula de cada tipo y las equivalencias; nunca el paso hecho ni la
 * respuesta. Errores: TR2 y TR3 (documentados) y TR4 (hipótesis: el informe lo deriva de TR2 y TR3, sin datos propios) de
 * docs/investigacion/trigonometria-ideas-erroneas.md; los demás son hipótesis de aula, con los códigos de la teoría. Cada
 * explicación empieza por lo que el alumno hizo bien y dice lo que da su error.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-arco-sector';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const PI = Math.PI;
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // c·π como texto: «40π/9», «0,6π» (con decimales, si se escribe con dos), «π»; null si no es limpio.
  function piC(c, decimal) {
    if (Math.abs(c) < 1e-12) return '0';
    if (decimal && Math.abs(c * 100 - Math.round(c * 100)) < 1e-9) return `${Math.abs(c - 1) < 1e-12 ? '' : f(c)}π`;
    for (let q = 1; q <= 36; q++) {
      const p = c * q, r = Math.round(p);
      if (Math.abs(p - r) < 1e-9 * Math.max(1, Math.abs(r))) return `${r < 0 ? '−' : ''}${Math.abs(r) === 1 ? '' : f(Math.abs(r))}π${q === 1 ? '' : '/' + q}`;
    }
    return null;
  }
  // Un valor con su unidad: con π si es un múltiplo limpio de π; si no, el número con dos decimales.
  const conU = (u, decimal) => x => { const t = piC(x / PI, decimal); return `${t !== null ? t : f(x)} ${u}`; };
  const ANG = x => v('ang', x), RAD = x => v('rad', x), ARCO = x => v('arco', x), AREA = x => v('area', x), VUEL = x => v('vuel', x);
  const VARS = {
    ang: { nombre: 'el ángulo', color: 'h' },
    rad: { nombre: 'el radio', color: 'o' },
    arco: { nombre: 'la longitud de arco', color: 'i' },
    area: { nombre: 'el área', color: 'f' },
    vuel: { nombre: 'el número de vueltas', color: 'f' },
  };
  const piG = g => piC(g / 180);                                 // grados → radianes, en múltiplos de π

  // ---- Errores: el respaldo sale del código ----
  const RESP = { TR2: 'documentado', TR3: 'documentado' };
  const resp = id => (RESP[id] ? { respaldo: RESP[id], fuente: TRF } : id === 'TR4' ? { respaldo: 'hipotesis', fuente: TRF } : { respaldo: 'hipotesis', fuente: null });
  const en = (id, valor, fmt, explicar) => Object.assign({ id, valor, explicacion: explicar(fmt(valor)) }, resp(id));

  // ---- Datos (una línea cada uno; herramientas, no el paso hecho) ----
  const D = {
    arco: 'Longitud de arco: s = θ · r, con θ en radianes.',
    pi: 'π rad = 180°.',
    piC: 'π rad = 180° = 200ᵍ.',
    vuelta: '1 vuelta = 2π rad = 360°.',
    minutero: 'El minutero da 1 vuelta en 60 min.',
    area: 'Área del sector: A = θ · r²/2 = s · r/2, con θ en radianes.',
    perim: 'Perímetro del sector: dos radios y el arco, 2r + s.',
    banda: 'Trapecio circular: A = θ · (r₂² − r₁²)/2, con θ en radianes.',
    semi: 'También: A = (s₁ + s₂)/2 · h, con el ancho h = r₂ − r₁.',
    arcos: 'Arcos: s₁ = θ · r₁ y s₂ = θ · r₂.',
    vueltas: 'Al rodar sin deslizar: n = d/(2π · r), con d lo que avanza el centro.',
    rodea: 'Alrededor de una rueda fija, el centro recorre una circunferencia: radio suma de los radios por fuera, resta por dentro.',
    faja: 'Faja o cadena: n₁ · r₁ = n₂ · r₂ (los bordes recorren el mismo largo).',
    eje: 'Eje común: las ruedas dan las mismas vueltas.',
    borde: 'Largo del borde de una rueda: 2π · r.',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    arco: ['arco', 'grados', 'arco-examen'],
    sector: ['area', 'area-grados', 'perimetro'],
    'trapecio-circular': ['banda', 'banda-arcos', 'banda-examen'],
    'vueltas-rueda': ['vueltas', 'rodea', 'dos-ruedas'],
    'faja-y-eje': ['faja', 'eje', 'balde'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { arco: 1, grados: 2, 'arco-examen': 3, area: 1, 'area-grados': 2, perimetro: 3, banda: 1, 'banda-arcos': 2, 'banda-examen': 3,
    vueltas: 1, rodea: 2, 'dos-ruedas': 3, faja: 1, eje: 2, balde: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más, las cinco ideas.
  const PAPEL = { 'papel-1': ['grados'], 'papel-2': ['area-grados'], 'papel-3': ['banda'], 'papel-4': ['vueltas'], 'papel-5': ['eje'],
    'papel-6': ['perimetro'], 'papel-7': ['banda-examen'], 'papel-8': ['balde'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && !o.tipo && PAPEL[String(semilla)];
    let tipo;
    if (o.tipo && CONSTRUIR[o.tipo]) tipo = o.tipo;
    else if (forzado) tipo = forzado[0];
    else tipo = rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  function cerrar(rng, semilla, tipo, o) {
    const errores = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor > 0 && Math.abs(x.valor - o.correcta) > 1e-9 * Math.max(1, o.correcta) && P.enEscala(x.valor, o.correcta, x.id));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: longitud de arco =======================
  function arco(rng) {
    const conPi = rng.entero(0, 1) === 1, r = rng.elegir([3, 4, 5, 6, 8, 9, 10, 12, 15]);
    const t = conPi ? rng.elegir([1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 5 / 6]) * PI : rng.elegir([0.5, 1.5, 2, 2.5, 3]);
    const tT = conPi ? piC(t / PI) : f(t), s = t * r, fmt = conU('cm');
    const cosa = rng.elegir(['En una circunferencia de', 'En una rueda de', 'En un reloj de pared, sobre un círculo de']);
    return {
      enunciado: [`${cosa} `, RAD(`${r} cm`), ' de radio, un ángulo central mide ', ANG(`${tT} rad`), '.'],
      pregunta: ['¿Cuánto mide su arco?'],
      datos: [D.arco],
      correcta: s, fmt,
      errores: [
        en('ARCO-DIAM', 2 * s, fmt, x => `Bien que multipliques el ángulo por un largo. Pero con el diámetro sale ${x}; va el radio.`),
        en('ARCO-DIVIDE', t / r, fmt, x => `Bien que juntes el ángulo y el radio. Pero se multiplican: dividir da ${x}.`),
        en('ARCO-AREA', t * r * r / 2, fmt, x => `Bien el ángulo en radianes. Pero θ · r²/2 es el área: da ${x}, y el arco lleva un solo radio.`),
        en('ARCO-MITAD', s / 2, fmt, x => `Bien el ángulo por el radio. Pero no se divide entre 2: la mitad es ${x}.`),
      ],
      solucion: [['El ángulo ya está en radianes: el arco mide ese número de radios.'], ['s = ', ANG(tT), ` · ${r} = `, ARCO(fmt(s)), '.']],
      _datos: { r, t },
    };
  }

  function grados(rng) {
    const g = rng.elegir([20, 30, 36, 40, 45, 72, 75, 90, 120, 135, 150]), r = rng.elegir([6, 9, 12, 15, 18, 20, 24, 30, 36]);
    const s = g * PI / 180 * r, fmt = conU('cm');
    if (rng.entero(0, 1)) {
      const sT = fmt(s);
      return {
        enunciado: ['Un arco de ', ARCO(sT), ' abarca un ángulo central de ', ANG(`${g}°`), '.'],
        pregunta: ['¿Cuánto mide el radio?'],
        datos: [D.arco, D.pi],
        correcta: r, fmt,
        errores: [
          en('TR4', s / g, fmt, x => `Bien que dividas el arco entre el ángulo. Pero con ${g} y no ${piG(g)} rad sale ${x}.`),
          en('ARCO-DIAM', 2 * r, fmt, x => `Bien el ángulo en radianes. Pero ${x} sería el diámetro, dos radios.`),
          en('ARCO-POR', s * g * PI / 180, fmt, x => `Bien el ángulo en radianes. Pero el radio es el arco entre el ángulo; multiplicar da ${x}.`),
          en('RAD-SIN-PI', r * PI, fmt, x => `Bien que dividas entre ${g}/180. Pero falta π: ${g}° son ${piG(g)} rad; sin π sale ${x}.`),
        ],
        solucion: [[`${g}° son ${piG(g)} rad.`], ['r = ', ARCO(sT.replace(' cm', '')), ` ÷ ${piG(g)} = `, RAD(`${r} cm`), '.']],
        _datos: { sub: 'radio', g, r },
      };
    }
    return {
      enunciado: ['En una circunferencia de ', RAD(`${r} cm`), ' de radio, un ángulo central mide ', ANG(`${g}°`), '.'],
      pregunta: ['¿Cuánto mide su arco?'],
      datos: [D.arco, D.pi],
      correcta: s, fmt,
      errores: [
        en('TR4', g * r, fmt, x => `Bien que multipliques el ángulo por el radio. Pero con ${g} en vez de ${piG(g)} rad sale ${x}.`),
        en('RAD-200', g * PI / 200 * r, fmt, x => `Bien que pases a radianes. Pero π rad son 180°, no 200: así sale ${x}.`),
        en('ARCO-DIAM', 2 * s, fmt, x => `Bien el ángulo en radianes. Pero con el diámetro sale ${x}; va el radio.`),
        en('ARCO-AREA', g * PI / 180 * r * r / 2, fmt, x => `Bien el ángulo en radianes. Pero θ · r²/2 es el área, ${x}; el arco lleva un radio.`),
      ],
      solucion: [[`Primero a radianes: ${g}° son ${piG(g)} rad.`], ['s = ', ANG(piG(g)), ` · ${r} = `, ARCO(fmt(s)), '.']],
      _datos: { sub: 'arco', g, r },
    };
  }

  function arcoExamen(rng) {
    if (rng.entero(0, 1)) {
      const L = rng.elegir([6, 8, 9, 10, 12, 15, 18, 20]), m = rng.elegir([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50]), s = m / 60 * 2 * PI * L, fmt = conU('cm');
      return {
        enunciado: ['El minutero de un reloj mide ', RAD(`${L} cm`), '.'],
        pregunta: [`¿Cuánto recorre su punta en ${m} minutos?`],
        datos: [D.arco, D.minutero, D.vuelta],
        correcta: s, fmt,
        errores: [
          en('TR4', 6 * m * L, fmt, x => `Bien que cada minuto sean 6°. Pero en s = θ · r va θ en radianes; con grados sale ${x}.`),
          en('VUELTA-PI', s / 2, fmt, x => `Bien la parte de la vuelta, ${m}/60. Pero la vuelta mide 2π rad, no π: así sale ${x}.`),
          en('ARCO-DIAM', 2 * s, fmt, x => `Bien el ángulo en radianes. Pero el minutero es el radio; con el doble sale ${x}.`),
          en('ARCO-MINUTOS', m * L, fmt, x => `Bien que multipliques por el radio. Pero ${m} minutos no son ${m} radianes; así sale ${x}.`),
        ],
        solucion: [[`${m} de 60 minutos: θ = ${m}/60 · 2π = ${piC(m / 30)} rad.`], ['s = ', ANG(piC(m / 30)), ` · ${L} = `, ARCO(fmt(s)), '.']],
        _datos: { sub: 'minutero', L, m },
      };
    }
    const C = rng.elegir([10, 20, 25, 40, 50, 60, 75, 80, 100, 120, 150]), r = rng.elegir([4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20]), s = C * PI / 200 * r, fmt = conU('cm');
    return {
      enunciado: ['En una circunferencia de ', RAD(`${r} cm`), ' de radio, un ángulo central mide ', ANG(`${C}ᵍ`), '.'],
      pregunta: ['¿Cuánto mide su arco?'],
      datos: [D.arco, D.piC],
      correcta: s, fmt,
      errores: [
        en('CONV-MISMO', C * PI / 180 * r, fmt, x => `Bien que pases a radianes. Pero ${C}ᵍ son centesimales: con 180 sale ${x}.`),
        en('TR4', C * r, fmt, x => `Bien que multipliques por el radio. Pero con ${C} en vez de radianes sale ${x}.`),
        en('ARCO-DIAM', 2 * s, fmt, x => `Bien el ángulo en radianes. Pero con el diámetro sale ${x}; va el radio.`),
        en('RAD-SIN-PI', C / 200 * r, fmt, x => `Bien la fracción ${C}/200. Pero falta π: sin él sale ${x}.`),
      ],
      solucion: [[`Media vuelta: 200ᵍ y π rad. ${C}ᵍ son ${piC(C / 200)} rad.`], ['s = ', ANG(piC(C / 200)), ` · ${r} = `, ARCO(fmt(s)), '.']],
      _datos: { sub: 'centesimal', C, r },
    };
  }

  // ======================= Idea 2: área del sector =======================
  function area(rng) {
    const fmt = conU('cm²');
    if (rng.entero(0, 1)) {
      let s, r;
      do { s = rng.entero(4, 24); r = rng.entero(3, 12); } while (s >= 6 * r || (s * r) % 2);
      return {
        enunciado: ['Un sector circular tiene un arco de ', ARCO(`${s} cm`), ' y un radio de ', RAD(`${r} cm`), '.'],
        pregunta: ['¿Cuánto mide su área?'],
        datos: [D.area],
        correcta: s * r / 2, fmt,
        errores: [
          en('SEC-MITAD', s * r, fmt, x => `Bien el arco por el radio. Pero falta la mitad: sin ella sale ${x}.`),
          en('SEC-ARCO-CUADRADO', s * r * r / 2, fmt, x => `Bien la mitad. Pero el arco ya trae un radio: con r² sale ${x}.`),
          en('SEC-ARCO', s / 2, fmt, x => `Bien la mitad del arco. Pero falta multiplicar por el radio; solo eso da ${x}.`),
          en('SEC-SUMA', (s + r) / 2, fmt, x => `Bien la mitad. Pero el arco y el radio se multiplican; sumarlos da ${x}.`),
        ],
        solucion: [['Con el arco y el radio, el área es medio arco por radio.'], ['A = ', ARCO(`${s}`), ` · ${r}/2 = `, AREA(fmt(s * r / 2)), '.']],
        _datos: { sub: 'arco', s, r },
      };
    }
    const t = rng.elegir([1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1]) * PI, r = rng.elegir([2, 3, 4, 6, 8, 10, 12]), A = t * r * r / 2;
    return {
      enunciado: ['Un sector circular tiene ', RAD(`${r} cm`), ' de radio y un ángulo central de ', ANG(`${piC(t / PI)} rad`), '.'],
      pregunta: ['¿Cuánto mide su área?'],
      datos: [D.area],
      correcta: A, fmt,
      errores: [
        en('SEC-MITAD', 2 * A, fmt, x => `Bien θ por r². Pero falta la mitad: sin ella sale ${x}.`),
        en('SEC-ARCO', t * r, fmt, x => `Bien el ángulo por el radio. Pero eso es el arco, ${x}; el área lleva r² y la mitad.`),
        en('SEC-LINEAL', t * r / 2, fmt, x => `Bien la mitad. Pero el radio va al cuadrado: con r sale ${x}.`),
        en('SEC-DIAM', t * 4 * r * r / 2, fmt, x => `Bien la fórmula. Pero va el radio, no el diámetro: con el diámetro sale ${x}.`),
      ],
      solucion: [['El ángulo ya está en radianes.'], ['A = ', ANG(piC(t / PI)), ` · ${r}²/2 = `, AREA(fmt(A)), '.']],
      _datos: { sub: 'radianes', t, r },
    };
  }

  function areaGrados(rng) {
    const g = rng.elegir([30, 36, 40, 45, 60, 72, 90, 120, 135, 150]), r = rng.elegir([2, 3, 4, 6, 8, 9, 10, 12, 15, 18]), A = g / 360 * PI * r * r, fmt = conU('m²');
    if (rng.entero(0, 1)) {
      const fr = conU('m');
      return {
        enunciado: ['Un terreno con forma de sector circular tiene un ángulo central de ', ANG(`${g}°`), ' y un área de ', AREA(fmt(A)), '.'],
        pregunta: ['¿Cuánto mide su radio?'],
        datos: [D.area, D.pi],
        correcta: r, fmt: fr,
        errores: [
          en('SEC-SIN-RAIZ', r * r, fr, x => `Bien el despeje de r². Pero falta la raíz: r² vale ${x.replace(' m', '')}.`),
          en('SEC-MITAD', r / Math.SQRT2, fr, x => `Bien el ángulo en radianes. Pero el 2 de la fórmula pasa multiplicando; así sale ${x}.`),
          en('TR4', Math.sqrt(2 * A / g), fr, x => `Bien el despeje. Pero con ${g} en vez de ${piG(g)} rad sale ${x}.`),
          en('ARCO-DIAM', 2 * r, fr, x => `Bien el despeje y la raíz. Pero ${x} es el diámetro.`),
        ],
        solucion: [[`${g}° son ${piG(g)} rad; r² = 2A ÷ θ = ${r * r}.`], ['r = ', RAD(`${r} m`), '.']],
        _datos: { sub: 'radio', g, r },
      };
    }
    return {
      enunciado: ['Un terreno con forma de sector circular tiene ', RAD(`${r} m`), ' de radio y un ángulo central de ', ANG(`${g}°`), '.'],
      pregunta: ['¿Cuánto mide su área?'],
      datos: [D.area, D.pi],
      correcta: A, fmt,
      errores: [
        en('TR4', g * r * r / 2, fmt, x => `Bien la fórmula. Pero con ${g} en vez de ${piG(g)} rad sale ${x}.`),
        en('SEC-MITAD', 2 * A, fmt, x => `Bien el ángulo en radianes. Pero falta la mitad: sin ella sale ${x}.`),
        en('SEC-ARCO', g * PI / 180 * r, fmt, x => `Bien el ángulo en radianes. Pero eso es el arco, ${x}; el área lleva r² y la mitad.`),
        en('RAD-200', g * PI / 200 * r * r / 2, fmt, x => `Bien la fórmula. Pero π rad son 180°, no 200: así sale ${x}.`),
      ],
      solucion: [[`${g}° son ${piG(g)} rad.`], ['A = ', ANG(piG(g)), ` · ${r}²/2 = `, AREA(fmt(A)), '.']],
      _datos: { sub: 'area', g, r },
    };
  }

  function perimetro(rng) {
    const fmt = x => `${f(x)} m`;
    if (rng.entero(0, 1)) {
      const r = rng.elegir([4, 6, 8, 10, 12, 20]), t = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]);
      if (!Number.isInteger(t * r * r / 2) || !Number.isInteger(t * r)) return null;
      const A = t * r * r / 2, s = t * r, Pm = 2 * r + s;
      return {
        enunciado: ['Un terreno con forma de sector circular tiene ', AREA(`${f(A)} m²`), ' de área y un ángulo central de ', ANG(`${f(t)} rad`), '.'],
        pregunta: ['¿Cuántos metros de cerco rodean todo su borde?'],
        datos: [D.area, D.perim, D.arco],
        correcta: Pm, fmt,
        errores: [
          en('SEC-SOLO-ARCO', s, fmt, x => `Bien el arco: ${x}. Pero el cerco también va por los dos radios.`),
          en('SEC-SOLO-RADIOS', 2 * r, fmt, x => `Bien los dos radios: ${x}. Pero falta el arco del borde curvo.`),
          en('SEC-UN-RADIO', r + s, fmt, x => `Bien el arco y un radio: ${x}. Pero el sector tiene dos lados rectos.`),
          en('SEC-SIN-RAIZ', 2 * r * r + t * r * r, fmt, x => `Bien el despeje de r² = ${r * r}. Pero el radio es su raíz; sin ella sale ${x}.`),
        ],
        solucion: [[`r² = 2 · ${f(A)} ÷ ${f(t)} = ${r * r}, así que r = ${r} m y s = ${f(t)} · ${r} = `, ARCO(`${f(s)} m`), '.'], [`El cerco: 2 · ${r} + ${f(s)} = ${f(Pm)} m.`]],
        _datos: { sub: 'cerco', r, t },
      };
    }
    const k = rng.elegir([2.5, 3, 3.5, 4, 4.5, 5, 6]), t = k - 2, fmtR = x => `${f(x)} rad`;
    const veces = { 3: 'el triple de', 4: 'el cuádruple de', 5: 'el quíntuple de' }[k] || `${f(k)} veces`;
    return {
      enunciado: [`El perímetro de un sector circular es ${veces} su radio.`],
      pregunta: ['¿Cuánto mide su ángulo central, en radianes?'],
      datos: [D.perim, D.arco],
      correcta: t, fmt: fmtR,
      errores: [
        en('SEC-SOLO-ARCO', k, fmtR, x => `Bien que relaciones el borde con el radio. Pero el perímetro trae dos radios: ${x} los olvida.`),
        en('SEC-UN-RADIO', k - 1, fmtR, x => `Bien que quites los radios. Pero son dos, no uno: con uno sale ${x}.`),
        en('SEC-MITAD', t / 2, fmtR, x => `Bien que quites los dos radios. Pero lo que queda es el arco entero: la mitad da ${x}.`),
        en('SEC-MAS', k + 2, fmtR, x => `Bien que uses los dos radios. Pero se restan del perímetro; sumarlos da ${x}.`),
      ],
      solucion: [[`2r + s = ${f(k)}r, así que s = ${f(t)}r.`], ['Un arco de ', `${f(t)}`, ' radios: θ = ', ANG(`${f(t)} rad`), '.']],
      _datos: { sub: 'veces', k },
    };
  }

  // ======================= Idea 3: trapecio circular =======================
  function banda(rng) {
    const t = rng.elegir([1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 1]) * PI, r1 = rng.entero(1, 8), r2 = r1 + rng.entero(1, 6), A = t / 2 * (r2 * r2 - r1 * r1), fmt = conU('cm²');
    return {
      enunciado: ['Un trapecio circular tiene un ángulo central de ', ANG(`${piC(t / PI)} rad`), ' y va desde ', RAD(`r₁ = ${r1} cm`), ' hasta ', RAD(`r₂ = ${r2} cm`), '.'],
      pregunta: ['¿Cuánto mide su área?'],
      datos: [D.banda],
      correcta: A, fmt,
      errores: [
        en('TRAP-RESTA', t / 2 * (r2 - r1) ** 2, fmt, x => `Bien medio ángulo por un cuadrado. Pero se restan los cuadrados, no los radios: así sale ${x}.`),
        en('TRAP-GRANDE', t / 2 * r2 * r2, fmt, x => `Bien el sector grande: ${x}. Pero falta quitarle el chico.`),
        en('TRAP-CHICO', t / 2 * r1 * r1, fmt, x => `Bien la fórmula del sector. Pero el de radio r₁ es justo lo que no está en la banda: ${x}.`),
        en('TRAP-ARCOS', t * (r1 + r2) / 2, fmt, x => `Bien la semisuma de los arcos. Pero falta multiplicar por el ancho, ${r2 - r1} cm: sin él sale ${x}.`),
      ],
      solucion: [[`Los cuadrados: ${r2 * r2} − ${r1 * r1} = ${r2 * r2 - r1 * r1}.`], ['A = ', ANG(piC(t / PI)), ` · ${r2 * r2 - r1 * r1}/2 = `, AREA(fmt(A)), '.']],
      _datos: { t, r1, r2 },
    };
  }

  function bandaArcos(rng) {
    const t = rng.elegir([0.5, 1, 1.5, 2, 2.5]), a = rng.elegir([2, 4, 6, 8, 10]), h = rng.elegir([2, 3, 4, 5, 6]);
    if (!Number.isInteger(t * a) || !Number.isInteger(t * (a + h))) return null;
    const s1 = t * a, s2 = t * (a + h);
    if (rng.entero(0, 1)) {
      const fmt = x => `${f(x)} cm²`;
      return {
        enunciado: ['Los arcos de un trapecio circular miden ', ARCO(`s₁ = ${s1} cm`), ' y ', ARCO(`s₂ = ${s2} cm`), `, y su ancho es h = ${h} cm.`],
        pregunta: ['¿Cuánto mide su área?'],
        datos: [D.semi],
        correcta: (s1 + s2) / 2 * h, fmt,
        errores: [
          en('TRAP-MITAD', (s1 + s2) * h, fmt, x => `Bien la suma de los arcos por el ancho. Pero falta la mitad: sin ella sale ${x}.`),
          en('TRAP-SUMA', (s2 - s1) / 2 * h, fmt, x => `Bien la mitad por el ancho. Pero los arcos se suman, como bases: restarlos da ${x}.`),
          en('TRAP-GRANDE', s2 * h, fmt, x => `Bien que multipliques por el ancho. Pero con solo el arco de afuera sale ${x}.`),
          en('TRAP-CHICO', s1 * h, fmt, x => `Bien que multipliques por el ancho. Pero con solo el arco de adentro sale ${x}.`),
        ],
        solucion: [['Como un trapecio: la semisuma de los arcos por el ancho.'], [`A = (${s1} + ${s2})/2 · ${h} = `, AREA(fmt((s1 + s2) / 2 * h)), '.']],
        _datos: { sub: 'area', s1, s2, h },
      };
    }
    const fmt = x => `${f(x)} rad`;
    return {
      enunciado: ['Los arcos de un trapecio circular miden ', ARCO(`s₁ = ${s1} cm`), ' y ', ARCO(`s₂ = ${s2} cm`), `, y su ancho es h = ${h} cm.`],
      pregunta: ['¿Cuánto mide su ángulo central, en radianes?'],
      datos: [D.arcos, 'Ancho: h = r₂ − r₁.'],
      correcta: t, fmt,
      errores: [
        en('TRAP-SUMA', (s1 + s2) / h, fmt, x => `Bien que dividas entre el ancho. Pero los arcos se restan: sumarlos da ${x}.`),
        en('TRAP-GRANDE', s2 / h, fmt, x => `Bien que dividas un arco entre un largo. Pero s₂ va con r₂, no con h: así sale ${x}.`),
        en('TRAP-MITAD', (s2 - s1) / (2 * h), fmt, x => `Bien la resta de los arcos. Pero se divide entre h, sin la mitad: así sale ${x}.`),
        en('ARCO-POR', (s2 - s1) * h, fmt, x => `Bien la resta de los arcos. Pero esa resta es θ · h: se divide entre h; multiplicar da ${x}.`),
      ],
      solucion: [['Con el mismo ángulo: s₂ − s₁ = θ · (r₂ − r₁) = θ · h.'], [`θ = (${s2} − ${s1}) ÷ ${h} = `, ANG(fmt(t)), '.']],
      _datos: { sub: 'angulo', s1, s2, h },
    };
  }

  function bandaExamen(rng) {
    if (rng.entero(0, 1)) {
      const k = rng.elegir([2, 3, 4, 5]), nom = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple', 5: 'el quíntuple' }[k], fmt = x => `${f(x)}`;
      return {
        enunciado: ['Un sector de radio r₁ y el trapecio circular que lo rodea hasta r₂ tienen el mismo ángulo central. ', RAD('r₂'), ` es ${nom} de `, RAD('r₁'), '.'],
        pregunta: ['¿Cuántas veces cabe el área del sector en la del trapecio?'],
        datos: ['Área del sector: A = θ · r²/2, con θ en radianes.', D.banda],
        correcta: k * k - 1, fmt,
        errores: [
          en('TRAP-SIN-CUADRADO', k - 1, fmt, x => `Bien que restes el sector chico. Pero se restan los cuadrados: ${k} − 1 da ${x}.`),
          en('TRAP-GRANDE', k * k, fmt, x => `Bien el cuadrado de la razón. Pero ${x} es el sector grande: falta quitar el chico.`),
          en('SEC-LINEAL', k, fmt, x => `Bien que uses la razón de los radios. Pero el área va con su cuadrado; ${x} no lo eleva.`),
          en('TRAP-SUMA', k * k + 1, fmt, x => `Bien el cuadrado de la razón. Pero el trapecio es el grande menos el chico: sumar da ${x}.`),
        ],
        solucion: [[`Con r₁ = k y r₂ = ${k}k: el trapecio mide θ(${k * k}k² − k²)/2.`], [`Es ${k * k - 1} veces el sector chico, θk²/2.`]],
        _datos: { sub: 'razon', k },
      };
    }
    const r2 = rng.elegir([45, 50, 55, 60]), h = rng.elegir([20, 25, 30, 35, 40]), g = rng.elegir([90, 100, 120, 135, 150]), r1 = r2 - h, t = g * PI / 180, fmt = conU('cm²');
    if (r1 < 10) return null;
    return {
      enunciado: ['El brazo de un limpiaparabrisas mide ', RAD(`${r2} cm`), `, y su jebe, de ${h} cm, va al final del brazo. El brazo barre `, ANG(`${g}°`), '.'],
      pregunta: ['¿Qué área limpia el jebe?'],
      datos: [D.banda, D.pi],
      correcta: t / 2 * (r2 * r2 - r1 * r1), fmt,
      errores: [
        en('TRAP-RESTA', t / 2 * h * h, fmt, x => `Bien el ancho del jebe. Pero no empieza en el eje, sino a ${r1} cm: un sector de ${h} cm da ${x}.`),
        en('TRAP-GRANDE', t / 2 * r2 * r2, fmt, x => `Bien el sector de todo el brazo: ${x}. Pero falta quitar la parte sin jebe.`),
        en('TRAP-MITAD', t * (r2 * r2 - r1 * r1), fmt, x => `Bien la resta de cuadrados. Pero falta dividir entre 2: sin eso sale ${x}.`),
        en('TR4', g / 2 * (r2 * r2 - r1 * r1), fmt, x => `Bien la resta de cuadrados. Pero con ${g} en vez de ${piG(g)} rad sale ${x}.`),
      ],
      solucion: [[`El jebe va de ${r1} cm a ${r2} cm del eje; ${g}° son ${piG(g)} rad.`], ['A = ', ANG(piG(g)), ` · (${r2}² − ${r1}²)/2 = `, AREA(fmt(t / 2 * (r2 * r2 - r1 * r1))), '.']],
      _datos: { sub: 'limpia', r2, h, g },
    };
  }

  // ======================= Idea 4: número de vueltas =======================
  function vueltas(rng) {
    const r = rng.elegir([0.2, 0.25, 0.3, 0.35, 0.4, 0.5]), n = rng.elegir([4, 5, 6, 8, 10, 12, 15, 20, 25, 30]), d = n * 2 * PI * r, fmt = x => `${f(x)} vueltas`;
    const cosa = rng.elegir(['La rueda de una bicicleta', 'La rueda de un triciclo', 'La rueda de una carretilla']);
    return {
      enunciado: [`${cosa} tiene `, RAD(`${f(r)} m`), ' de radio y avanza ', ARCO(`${piC(d / PI, true)} m`), ' sin deslizar.'],
      pregunta: ['¿Cuántas vueltas da?'],
      datos: [D.vueltas],
      correcta: n, fmt,
      errores: [
        en('VUEL-DIAMETRO', 2 * n, fmt, x => `Bien que dividas lo que avanza. Pero una vuelta es 2π · r, no π · r: así salen ${x}.`),
        en('VUEL-DIAM', n / 2, fmt, x => `Bien que dividas entre el borde. Pero en 2π · r va el radio, no el diámetro: así salen ${x}.`),
        en('VUEL-RADIO', d / r, fmt, x => `Bien que dividas lo que avanza. Pero cada vuelta avanza el borde entero, no un radio: así salen ${x}.`),
        en('VUEL-SIN-PI', n * PI, fmt, x => `Bien que dividas entre 2r. Pero falta π: sin él salen ${x}.`),
      ],
      solucion: [[`Una vuelta avanza 2π · ${f(r)} = ${piC(2 * r, true)} m.`], ['n = ', ARCO(piC(d / PI, true)), ` ÷ ${piC(2 * r, true)} = `, VUEL(fmt(n)), '.']],
      _datos: { r, n },
    };
  }

  function rodea(rng) {
    const a = rng.elegir([1, 2, 3, 4, 5]), k = rng.elegir([2, 3, 4, 5, 6]), b = k * a, fuera = rng.entero(0, 1) === 1, n = fuera ? k + 1 : k - 1;
    const fmt = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
    return {
      enunciado: ['Una rueda de ', RAD(`${a} cm`), ` de radio rueda sin deslizar por ${fuera ? 'fuera de otra rueda fija' : 'dentro de un aro fijo'} de ${b} cm, hasta volver a su lugar.`],
      pregunta: ['¿Cuántas vueltas da sobre sí misma?'],
      datos: [D.vueltas, D.rodea],
      correcta: n, fmt,
      errores: [
        en('VUEL-CONTACTO', k, fmt, x => `Bien que compares con la rueda fija. Pero cuenta el camino del centro; con el borde que toca salen ${x}.`),
        en(fuera ? 'VUEL-DENTRO' : 'VUEL-FUERA', fuera ? k - 1 : k + 1, fmt, x => `Bien el camino del centro. Pero por ${fuera ? 'fuera los radios se suman' : 'dentro se restan'}; así salen ${x}.`),
        en('VUEL-DIAMETRO', 2 * n, fmt, x => `Bien el camino del centro. Pero se divide entre 2π · r, no π · r: así salen ${x}.`),
        en('VUEL-TRASLADA', 1, fmt, x => `Bien que da la vuelta alrededor. Pero también gira sobre sí misma: no es ${x}.`),
      ],
      solucion: [[`El centro recorre una circunferencia de radio ${b} ${fuera ? '+' : '−'} ${a} = ${fuera ? b + a : b - a} cm.`], [`n = 2π · ${fuera ? b + a : b - a} ÷ (2π · ${a}) = `, VUEL(fmt(n)), '.']],
      _datos: { a, b, fuera },
    };
  }

  function dosRuedas(rng) {
    const [a, b] = rng.elegir([[0.3, 0.6], [0.4, 0.6], [0.4, 0.8], [0.5, 1], [0.2, 0.3], [0.3, 0.5]]), D0 = rng.elegir([5, 10, 15, 20, 30]), q = a * b / (b - a), d = 2 * PI * D0 * q;
    const fmt = x => `${piC(x / PI, true) || f(x)} m`;
    if (!Number.isInteger(Math.round(2 * q * D0 * 100) / 100 * 100)) return null;
    return {
      enunciado: [`Las ruedas de adelante de un carro tienen `, RAD(`${f(a)} m`), ' de radio y las de atrás, ', RAD(`${f(b)} m`), `. En un tramo, cada rueda de adelante da ${D0} vueltas más que cada una de atrás.`],
      pregunta: ['¿Cuánto avanzó el carro?'],
      datos: [D.vueltas],
      correcta: d, fmt,
      errores: [
        en('VUEL-RESTA-RADIOS', 2 * PI * D0 * (b - a), fmt, x => `Bien que uses las ${D0} vueltas de diferencia. Pero se restan las vueltas, no los radios: así sale ${x}.`),
        en('VUEL-UNA-RUEDA', 2 * PI * D0 * a, fmt, x => `Bien el borde de la rueda de adelante. Pero no da solo ${D0} vueltas; con eso sale ${x}.`),
        en('VUEL-DIAMETRO', d / 2, fmt, x => `Bien el planteo con la diferencia. Pero cada vuelta es 2π · r, no π · r: así sale ${x}.`),
        en('VUEL-DIAM', 2 * d, fmt, x => `Bien el planteo. Pero en 2π · r va el radio de cada rueda; con diámetros sale ${x}.`),
      ],
      solucion: [[`d/(2π · ${f(a)}) − d/(2π · ${f(b)}) = ${D0}.`], ['d = ', ARCO(fmt(d)), '.']],
      _datos: { a, b, D: D0 },
    };
  }

  // ======================= Idea 5: faja y eje =======================
  function faja(rng) {
    const r1 = rng.elegir([5, 6, 8, 10, 12, 15]), r2 = rng.elegir([4, 10, 15, 20, 24, 30, 40]), n1 = rng.elegir([4, 5, 6, 10, 12, 15, 20, 30]);
    if (r1 === r2 || !Number.isInteger(2 * n1 * r1 / r2)) return null;
    const n2 = n1 * r1 / r2, fmt = x => `${f(x)} vueltas`;
    return {
      enunciado: ['Una faja une una polea de ', RAD(`r₁ = ${r1} cm`), ' con otra de ', RAD(`r₂ = ${r2} cm`), `. La primera da ${n1} vueltas.`],
      pregunta: ['¿Cuántas vueltas da la segunda?'],
      datos: [D.faja],
      correcta: n2, fmt,
      errores: [
        en('POL-IGUAL', n1, fmt, x => `Bien que las dos se muevan juntas. Pero con faja se iguala el largo del borde, no las vueltas: ${x} no.`),
        en('POL-INVERSA', n1 * r2 / r1, fmt, x => `Bien que uses la razón de los radios. Pero ${r2 > r1 ? 'la grande gira menos' : 'la chica gira más'}: al revés salen ${x}.`),
        en('POL-SUMA', n1 + r1 - r2, fmt, x => `Bien que compares los radios. Pero se multiplica por la razón, no se suma la diferencia: así salen ${x}.`),
        en('POL-BORDE', n1 * r1, fmt, x => `Bien n₁ · r₁ = ${n1 * r1}. Pero falta dividir entre r₂; sin eso salen ${x}.`),
      ],
      solucion: [[`n₁ · r₁ = n₂ · r₂: ${n1} · ${r1} = n₂ · ${r2}.`], ['n₂ = ', VUEL(fmt(n2)), '.']],
      _datos: { r1, r2, n1 },
    };
  }

  function eje(rng) {
    const r1 = rng.elegir([6, 8, 10, 12, 15, 20]), r2 = rng.elegir([3, 4, 5, 6, 8, 10]), r3 = rng.elegir([12, 15, 18, 20, 24, 30]), n1 = rng.elegir([1, 2, 3, 4, 5, 6]);
    if (r1 === r2 || r2 === r3 || !Number.isInteger(2 * n1 * r1 / r2)) return null;
    const n2 = n1 * r1 / r2, fmt = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
    return {
      enunciado: ['La rueda 1 (', RAD(`r₁ = ${r1} cm`), ') mueve con una faja a la rueda 2 (', RAD(`r₂ = ${r2} cm`), '); la rueda 3 (', RAD(`r₃ = ${r3} cm`), `) va en el eje de la 2. La rueda 1 da ${fmt(n1)}.`],
      pregunta: ['¿Cuántas vueltas da la rueda 3?'],
      datos: [D.faja, D.eje],
      correcta: n2, fmt,
      errores: [
        en('POL-IGUAL', n1, fmt, x => `Bien que la 3 gire con la 2. Pero entre la 1 y la 2 hay faja: ${x} no.`),
        en('POL-FAJA-EJE', n1 * r1 / r3, fmt, x => `Bien la faja entre 1 y 2. Pero la 3 comparte eje con la 2: repartir con r₃ da ${x}.`),
        en('POL-INVERSA', n1 * r2 / r1, fmt, x => `Bien que la 3 gire con la 2. Pero la razón de radios va al revés: así salen ${x}.`),
        en('POL-PROPORCIONAL', n2 * r3 / r2, fmt, x => `Bien las vueltas de la 2. Pero en un eje común no se reparten por radios: ${x} no.`),
      ],
      solucion: [[`Faja: ${n1} · ${r1} = n₂ · ${r2}, así que n₂ = ${f(n2)}.`], ['Eje común: n₃ = n₂ = ', VUEL(fmt(n2)), '.']],
      _datos: { r1, r2, r3, n1 },
    };
  }

  function balde(rng) {
    const a = rng.elegir([10, 15, 20, 30]), b = rng.elegir([20, 30, 40, 60]), c = rng.elegir([4, 5, 6, 8, 10]), m = rng.elegir([1, 2, 3, 4, 6]);
    if (a === b || c >= b || !Number.isInteger(2 * m * a / b)) return null;
    const nb = m * a / b, s = nb * 2 * PI * c, fmt = conU('cm');
    return {
      enunciado: [`Una manivela gira una rueda de `, RAD(`${a} cm`), ' que, con una faja, mueve otra de ', RAD(`${b} cm`), '; en su eje, un tambor de ', RAD(`${c} cm`), ` enrolla la soga de un balde. La manivela da ${m} ${m === 1 ? 'vuelta' : 'vueltas'}.`],
      pregunta: ['¿Cuánto sube el balde?'],
      datos: [D.faja, D.eje, D.borde],
      correcta: s, fmt,
      errores: [
        en('POL-SIN-FAJA', m * 2 * PI * c, fmt, x => `Bien que el tambor enrolle su borde. Pero entre la manivela y el tambor hay una faja; sin ella sale ${x}.`),
        en('POL-SOGA-RUEDA', nb * 2 * PI * b, fmt, x => `Bien las vueltas de la segunda rueda. Pero la soga se enrolla en el tambor, no en la rueda: ${x} no.`),
        en('VUEL-DIAMETRO', s / 2, fmt, x => `Bien las vueltas del tambor. Pero en cada una enrolla 2π · r, no π · r: así sale ${x}.`),
        en('POL-INVERSA', m * b / a * 2 * PI * c, fmt, x => `Bien que uses la faja. Pero la razón de radios va al revés: así sale ${x}.`),
      ],
      solucion: [[`La segunda rueda y su tambor dan ${m} · ${a} ÷ ${b} = ${f(nb)} ${Math.abs(nb - 1) < 1e-9 ? 'vuelta' : 'vueltas'}.`], [`s = ${f(nb)} · 2π · ${c} = `, ARCO(fmt(s)), '.']],
      _datos: { a, b, c, m },
    };
  }

  const CONSTRUIR = {
    arco, grados, 'arco-examen': arcoExamen, area, 'area-grados': areaGrados, perimetro, banda, 'banda-arcos': bandaArcos, 'banda-examen': bandaExamen,
    vueltas, rodea, 'dos-ruedas': dosRuedas, faja, eje, balde,
  };

  return { id: ID, titulo: 'Longitud de arco y sector circular', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
