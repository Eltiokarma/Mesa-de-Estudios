/*
 * Motor de Biomoléculas: piezas que se unen soltando agua (condensación) y se separan con agua (hidrólisis).
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorBiomoleculas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: masas molares en g/mol; masas en g; índice de saponificación en mg de KOH por g de grasa; índice de yodo en
 * g de I₂ por 100 g de grasa; energía en kcal.
 *
 * Masas atómicas de academia (enteras, como en el examen): H 1, C 12, N 14, O 16, Na 23, S 32, K 39, I 127.
 * Con ellas: H₂O 18, KOH 56, NaOH 40, I₂ 254, H₂ 2. Con I = 126,9 los índices de yodo cambian en el primer decimal.
 *
 * Funciones (una pieza es un id de PIEZAS, como 'glucosa', 'Gly' o 'estearico'):
 *  - formula(f): { C, H, ... } desde un texto como 'C6H12O6'. masa(f): masa molar. texto(f): 'C₆H₁₂O₆' (C, H y después
 *    los demás en orden alfabético).
 *  - condensar(piezas): une las piezas en una cadena lineal. Cada unión saca un H₂O (un H de una pieza y un OH de la otra).
 *    { n, uniones (n − 1), aguas (n − 1), masaPiezas (Σ Mᵢ), masaAgua (18 por unión), M = Σ Mᵢ − 18(n − 1), formula,
 *    texto, errores: { 'no-resta-agua': Σ Mᵢ, 'n-aguas': Σ Mᵢ − 18n, 'resta-un-agua': Σ Mᵢ − 18 } }.
 *  - sacarido(piezas): condensar + { tipo ('monosacárido' | 'disacárido' | 'oligosacárido' | 'polisacárido'), nombre
 *    (sacarosa, maltosa o lactosa si los reconoce), enlace: 'glucosídico', errores + { 'fusion-mismo-tamano': M de una
 *    pieza } } (BMH5, BM5).
 *  - peptido(piezas): condensar + { nombre ('Gly-Ala-Ser'), tipo ('dipéptido', 'tripéptido', ... 'polipéptido'),
 *    enlacesPeptidicos, errores + { 'n-enlaces': { enlaces: n, aguas: n }, 'sin-agua': { enlaces: n − 1, aguas: 0 },
 *    'mezcla': { enlaces: n, aguas: n − 1 } } } (BMH6, BMH7, BM9).
 *  - enlacesCadena(n): { enlaces, aguas, errores: { 'n-enlaces': n, 'n-mas-uno': n + 1 } }.
 *  - polisacarido(n, tipo?): n glucosas en cadena ('almidon' por defecto, 'celulosa' o 'glucogeno'). { n, M (exacta,
 *    162n + 18), Mformula (162n, la de (C₆H₁₀O₅)ₙ), unidad 'C₆H₁₀O₅', Munidad 162, enlaces, aguas, enlace,
 *    errores: { 'n-aguas': { aguas: n, M: 162n }, 'sin-agua': { aguas: 0, M: 180n }, 'un-agua': { aguas: 1, M: 180n − 18 },
 *    'formula-glucosa': { unidad: 'C₆H₁₂O₆', M: 180n } } } (BMH8).
 *  - hidrolisis(piezas, gramos?): rompe todas las uniones con agua. { aguas, masaAgua, productos [{ id, M, gramos }],
 *    masaProductos (= M + 18·aguas), gramosAgua, errores (con gramos y dos piezas: { 'sin-agua': gramos/2,
 *    'resta-agua': (gramos − 18·mol)/2, 'todo-glucosa': gramos }) } (BM9).
 *  - hidrolisisAlmidon(gramos): glucosa que da un almidón grande ((C₆H₁₀O₅)ₙ + n H₂O → n C₆H₁₂O₆): gramos·180/162,
 *    con errores { 'sin-agua': gramos, 'resta-agua': gramos·144/162 }.
 *  - secuencias(k, largo, repeticion): cuántas cadenas distintas de 'largo' aminoácidos salen de k aminoácidos
 *    (con repetición kᴸ; sin ella, k!/(k − L)!). errores: { 'olvida-orden': C(k, L) (o el número de multiconjuntos con
 *    repetición), 'una-por-aminoacido': k } (BMH12).
 *  - trigliceridos: trigliceridoDe(acidos) con un ácido o una lista de tres: { M, formula, texto, dobles (C=C), aguas: 3,
 *    indiceSaponificacion (3·56·1000/M), indiceYodo (dobles·254·100/M), nombre }.
 *    saponificacion(acidos, gramos?, base?): triglicérido + 3 NaOH (o KOH) → glicerol + 3 jabones. { base, molBase (3 por
 *    mol), jabon (texto y M), masaJabon, masaGlicerol, masaBase, conserva (M + 3·Mbase = 92 + 3·Mjabón) }.
 *    hidrogenar(acidos): { H2 (uno por doble enlace), masaGanada, Mantes, Mdespues, yodoAntes, yodoDespues: 0, producto,
 *    errores: { 'cuenta-H-como-H2': { H2: 2·dobles, masaGanada, yodo: 0 }, 'yodo-mide-masa': { H2, yodo: yodoAntes },
 *    'yodo-sube-con-masa': { H2, yodo: 'sube' } } } (BMH3, BMH9).
 *    compararSaponificacion(a, b): { mayor, indices [Ia, Ib], errores: { 'crece-con-M', 'iguales-por-mol': 'iguales',
 *    'confunde-con-yodo': 'ninguna' (si las dos son saturadas) } } (BMH10).
 *  - desnaturalizar(n): la proteína de n aminoácidos que se despliega al calor. { antes: { peptidicos, debiles, piezas },
 *    despues: { peptidicos (los mismos), debiles: 0, piezas: 1 }, masa: 'igual', secuencia: 'igual', rompe: 'débiles',
 *    errores: { 'rompe-peptidicos', 'separa-aminoacidos', 'proteina-rigida' } } (BMH1, BM6, BM7, BM8; etiquetas
 *    conceptuales con lo que diría cada una).
 *    plegado(n, p): posiciones { pos [{ x, y }], enlaces [[i, i + 1]], contactos [[i, j]] } de los n bloques, de plegada
 *    (p = 0, en serpentín) a estirada (p = 1, en fila); los contactos son las atracciones débiles del plegado (vecinos de
 *    fila que no son vecinos en la cadena) y solo existen con p = 0.
 *  - POLISACARIDOS, ENZIMAS y digerir(tipo, enzima): { corta, enlace, enzimaCorta, errores: { 'misma-glucosa-se-digiere',
 *    'no-es-glucosa', 'por-tamano' } } (BMH2, BM3, BM5). cadenaPolisacarido(tipo, n): [{ x, y, giro }] de cada glucosa:
 *    en el enlace α todas miran igual y la cadena se enrosca; en el β cada una va girada media vuelta y la cadena es recta.
 *  - energia(gramos): kcal con los factores de Atwater { carbohidrato: 4, proteina: 4, grasa: 9 } por g; las vitaminas
 *    no se cuentan (no son combustible; muchas son coenzimas). porcion(id): una de PORCIONES con sus kcal (BM1).
 *
 * Convenciones:
 *  - Las piezas se unen en cadena lineal: n piezas, n − 1 uniones. Un triglicérido es el glicerol con tres ácidos
 *    grasos colgando: 4 piezas y 3 uniones (ésteres), igual que una cadena de 4.
 *  - La fórmula de la cadena es la suma de las fórmulas menos un H₂O por unión. Las masas salen de la fórmula, con las
 *    masas atómicas de academia.
 *  - Monosacárido: 1 pieza; disacárido: 2; oligosacárido: de 3 a 10; polisacárido: más de 10. Péptido: hasta 10
 *    aminoácidos con nombre (dipéptido, tripéptido...), y polipéptido desde 11.
 *  - Desnaturalizar (calor, ácido, alcohol) rompe atracciones débiles (puentes de hidrógeno, puentes salinos,
 *    interacciones hidrofóbicas); la secuencia queda igual. Romper enlaces peptídicos es hidrólisis (enzimas o ácido
 *    concentrado y caliente).
 *  - Las amilasas humanas cortan el enlace α(1→4) del almidón y del glucógeno; ninguna enzima humana corta el β(1→4) de
 *    la celulosa (sí lo hacen las celulasas de microbios, como los del estómago de la vaca o del intestino de la termita).
 *
 * Errores típicos (campo 'errores'), para armar las alternativas, con los códigos de investigacion.md: BMH5 (no restar
 * el agua), BMH6 (n enlaces en vez de n − 1), BMH7 (resta una sola agua), BMH8 ((C₆H₁₂O₆)ₙ como fórmula del
 * polisacárido), BMH1 (la desnaturalización rompe enlaces peptídicos), BMH2 (almidón y celulosa se digieren igual), BMH3
 * y BMH9 (hidrogenación e índice de yodo), BMH10 (índice de saponificación y masa), BMH12 (orden de los aminoácidos), BM1
 * (las vitaminas dan energía), BM3, BM5, BM6, BM7 y BM8, BM9 (el agua que no se ve en la hidrólisis).
 * CABECERA: líneas 1 a 79 (funciones, unidades, masas atómicas, convenciones y errores).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorBiomoleculas = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = { H: 1, C: 12, N: 14, O: 16, Na: 23, S: 32, K: 39, I: 127 };
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

  // ---------------- Fórmulas ----------------
  function formula(f) {
    if (f && typeof f === 'object') return Object.assign({}, f);
    if (typeof f !== 'string' || !/^([A-Z][a-z]?\d*)+$/.test(f)) throw new Error(`fórmula que no entiendo: ${f}`);
    const d = {};
    for (const [, e, n] of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
      if (!(e in MASAS)) throw new Error(`elemento sin masa en el motor: ${e}`);
      d[e] = (d[e] || 0) + (n ? +n : 1);
    }
    return d;
  }
  function masa(f) {
    const d = formula(f);
    return Object.entries(d).reduce((t, [e, n]) => t + MASAS[e] * n, 0);
  }
  function texto(f) {
    const d = formula(f);
    const orden = ['C', 'H', ...Object.keys(d).filter(e => e !== 'C' && e !== 'H').sort()];
    return orden.filter(e => d[e]).map(e => e + (d[e] === 1 ? '' : String(d[e]).replace(/\d/g, x => SUB[x]))).join('');
  }
  const sumar = fs => fs.reduce((t, f) => { for (const [e, n] of Object.entries(formula(f))) t[e] = (t[e] || 0) + n; return t; }, {});

  // ---------------- Piezas ----------------
  // Monosacáridos, aminoácidos (con su código de tres letras), glicerol y ácidos grasos (dobles: enlaces C=C).
  const PIEZAS = {
    glucosa: { familia: 'azucar', nombre: 'glucosa', formula: 'C6H12O6', forma: 'hexagono' },
    fructosa: { familia: 'azucar', nombre: 'fructosa', formula: 'C6H12O6', forma: 'pentagono' },
    galactosa: { familia: 'azucar', nombre: 'galactosa', formula: 'C6H12O6', forma: 'hexagono' },
    Gly: { familia: 'aminoacido', nombre: 'glicina', formula: 'C2H5NO2' },
    Ala: { familia: 'aminoacido', nombre: 'alanina', formula: 'C3H7NO2' },
    Ser: { familia: 'aminoacido', nombre: 'serina', formula: 'C3H7NO3' },
    Val: { familia: 'aminoacido', nombre: 'valina', formula: 'C5H11NO2' },
    Cys: { familia: 'aminoacido', nombre: 'cisteína', formula: 'C3H7NO2S' },
    Leu: { familia: 'aminoacido', nombre: 'leucina', formula: 'C6H13NO2' },
    Phe: { familia: 'aminoacido', nombre: 'fenilalanina', formula: 'C9H11NO2' },
    glicerol: { familia: 'glicerol', nombre: 'glicerol', formula: 'C3H8O3' },
    palmitico: { familia: 'acido-graso', nombre: 'ácido palmítico', formula: 'C16H32O2', dobles: 0, C: 16 },
    estearico: { familia: 'acido-graso', nombre: 'ácido esteárico', formula: 'C18H36O2', dobles: 0, C: 18 },
    oleico: { familia: 'acido-graso', nombre: 'ácido oleico', formula: 'C18H34O2', dobles: 1, C: 18 },
    linoleico: { familia: 'acido-graso', nombre: 'ácido linoleico', formula: 'C18H32O2', dobles: 2, C: 18 },
    linolenico: { familia: 'acido-graso', nombre: 'ácido linolénico', formula: 'C18H30O2', dobles: 3, C: 18 },
  };
  for (const [k, p] of Object.entries(PIEZAS)) { p.id = k; p.M = masa(p.formula); p.texto = texto(p.formula); }
  function pieza(id) {
    const p = PIEZAS[id];
    if (!p) throw new Error(`pieza desconocida: ${id}`);
    return p;
  }
  const AGUA = 18;

  function lista(piezas) {
    if (!Array.isArray(piezas) || piezas.length < 1) throw new Error('hace falta una lista de piezas');
    return piezas.map(pieza);
  }

  // ---------------- Condensación genérica ----------------
  function condensar(piezas) {
    const ps = lista(piezas), n = ps.length, k = n - 1;
    const f = sumar(ps.map(p => p.formula));
    f.H -= 2 * k; f.O -= k;
    const masaPiezas = ps.reduce((t, p) => t + p.M, 0);
    return { n, uniones: k, aguas: k, masaPiezas, masaAgua: AGUA * k, M: masa(f), formula: f, texto: texto(f),
      errores: { 'no-resta-agua': masaPiezas, 'n-aguas': masaPiezas - AGUA * n, 'resta-un-agua': masaPiezas - (k > 0 ? AGUA : 0) } };
  }

  // ---------------- Carbohidratos ----------------
  const DISACARIDOS = { 'fructosa+glucosa': 'sacarosa', 'glucosa+glucosa': 'maltosa', 'galactosa+glucosa': 'lactosa' };
  function sacarido(piezas) {
    const ps = lista(piezas);
    if (ps.some(p => p.familia !== 'azucar')) throw new Error('un sacárido se arma solo con monosacáridos');
    const r = condensar(piezas), n = r.n;
    r.tipo = n === 1 ? 'monosacárido' : n === 2 ? 'disacárido' : n <= 10 ? 'oligosacárido' : 'polisacárido';
    r.enlace = 'glucosídico';
    r.nombre = n === 1 ? ps[0].nombre : n === 2 ? (DISACARIDOS[[...piezas].sort().join('+')] || null) : null;
    r.errores['fusion-mismo-tamano'] = ps[0].M;
    return r;
  }
  const POLISACARIDOS = {
    almidon: { nombre: 'almidón (amilosa)', enlace: 'α(1→4)', ramas: null, forma: 'hélice', funcion: 'reserva de energía de las plantas' },
    glucogeno: { nombre: 'glucógeno', enlace: 'α(1→4)', ramas: 'α(1→6)', forma: 'ramificada', funcion: 'reserva de energía de los animales' },
    celulosa: { nombre: 'celulosa', enlace: 'β(1→4)', ramas: null, forma: 'recta', funcion: 'pared de las células de las plantas' },
  };
  function polisacarido(n, tipo) {
    n = Number(n); tipo = tipo || 'almidon';
    if (!Number.isInteger(n) || n < 2) throw new Error('un polisacárido necesita al menos 2 glucosas (n entero)');
    const P = POLISACARIDOS[tipo];
    if (!P) throw new Error(`polisacárido desconocido: ${tipo}`);
    const g = PIEZAS.glucosa.M, u = g - AGUA;
    return { n, tipo, nombre: P.nombre, enlace: P.enlace, M: u * n + AGUA, Mformula: u * n, unidad: 'C₆H₁₀O₅', Munidad: u,
      enlaces: n - 1, aguas: n - 1, masaAgua: AGUA * (n - 1), masaPiezas: g * n,
      errores: { 'n-aguas': { aguas: n, M: u * n }, 'sin-agua': { aguas: 0, M: g * n }, 'un-agua': { aguas: 1, M: g * n - AGUA },
        'formula-glucosa': { unidad: 'C₆H₁₂O₆', M: g * n } } };
  }
  function hidrolisis(piezas, gramos) {
    const r = condensar(piezas), ps = lista(piezas);
    const out = { aguas: r.aguas, masaAgua: r.masaAgua, M: r.M, masaProductos: r.M + r.masaAgua,
      productos: ps.map(p => ({ id: p.id, nombre: p.nombre, M: p.M })) };
    if (gramos != null) {
      gramos = Number(gramos);
      if (!(gramos > 0)) throw new Error('los gramos tienen que ser positivos');
      const mol = gramos / r.M;
      out.mol = mol; out.gramosAgua = mol * r.masaAgua;
      out.productos.forEach(p => { p.gramos = mol * p.M; });
      out.gramosProductos = mol * out.masaProductos;
      out.errores = { 'sin-agua': gramos / ps.length, 'resta-agua': (gramos - mol * r.masaAgua) / ps.length, 'todo-glucosa': gramos };
    }
    return out;
  }
  function hidrolisisAlmidon(gramos) {
    gramos = Number(gramos);
    if (!(gramos > 0)) throw new Error('los gramos tienen que ser positivos');
    const g = PIEZAS.glucosa.M, u = g - AGUA, mol = gramos / u;
    return { molUnidades: mol, glucosa: mol * g, agua: mol * AGUA, errores: { 'sin-agua': gramos, 'resta-agua': mol * (u - AGUA) } };
  }

  // ---------------- Aminoácidos y proteínas ----------------
  const NOMBRES_PEP = ['', 'aminoácido', 'dipéptido', 'tripéptido', 'tetrapéptido', 'pentapéptido', 'hexapéptido', 'heptapéptido', 'octapéptido', 'nonapéptido', 'decapéptido'];
  function peptido(piezas) {
    const ps = lista(piezas);
    if (ps.some(p => p.familia !== 'aminoacido')) throw new Error('un péptido se arma solo con aminoácidos');
    const r = condensar(piezas), n = r.n;
    r.nombre = piezas.join('-');
    r.tipo = n <= 10 ? NOMBRES_PEP[n] : 'polipéptido';
    r.enlace = 'peptídico';
    r.enlacesPeptidicos = n - 1;
    Object.assign(r.errores, { 'n-enlaces': { enlaces: n, aguas: n }, 'sin-agua': { enlaces: n - 1, aguas: 0 }, 'mezcla': { enlaces: n, aguas: n - 1 } });
    return r;
  }
  function enlacesCadena(n) {
    n = Number(n);
    if (!Number.isInteger(n) || n < 1) throw new Error('n tiene que ser un entero positivo');
    return { n, enlaces: n - 1, aguas: n - 1, errores: { 'n-enlaces': n, 'n-mas-uno': n + 1 } };
  }
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const comb = (a, b) => fact(a) / (fact(b) * fact(a - b));
  function secuencias(k, largo, repeticion) {
    k = Number(k); largo = Number(largo);
    if (!Number.isInteger(k) || !Number.isInteger(largo) || k < 1 || largo < 1) throw new Error('k y largo tienen que ser enteros positivos');
    if (!repeticion && largo > k) throw new Error('sin repetición, el largo no puede pasar de k');
    const total = repeticion ? Math.pow(k, largo) : fact(k) / fact(k - largo);
    return { total, errores: { 'olvida-orden': repeticion ? comb(k + largo - 1, largo) : comb(k, largo), 'una-por-aminoacido': k } };
  }
  function desnaturalizar(n) {
    n = Number(n);
    if (!Number.isInteger(n) || n < 4) throw new Error('la proteína del modelo tiene al menos 4 aminoácidos');
    const debiles = plegado(n, 0).contactos.length;
    return { n, antes: { peptidicos: n - 1, debiles, piezas: 1 }, despues: { peptidicos: n - 1, debiles: 0, piezas: 1 },
      masa: 'igual', secuencia: 'igual', rompe: 'débiles',
      errores: { 'rompe-peptidicos': { peptidicos: 'menos', piezas: 'varias' }, 'separa-aminoacidos': { peptidicos: 0, piezas: n },
        'proteina-rigida': { debiles, peptidicos: n - 1, cambia: false } } };
  }
  // Serpentín: filas de 'ancho' bloques que van y vuelven. Separación 1 entre vecinos.
  function plegado(n, p) {
    n = Number(n); p = Math.max(0, Math.min(1, Number(p) || 0));
    if (!Number.isInteger(n) || n < 2) throw new Error('n tiene que ser un entero mayor que 1');
    const ancho = Math.max(2, Math.ceil(Math.sqrt(n * 1.5))), filas = Math.ceil(n / ancho);
    const doblado = [], recto = [];
    for (let i = 0; i < n; i++) {
      const f = Math.floor(i / ancho), c = i % ancho, col = f % 2 ? ancho - 1 - c : c;
      doblado.push({ x: col - (ancho - 1) / 2, y: f - (filas - 1) / 2 });
      recto.push({ x: i - (n - 1) / 2, y: 0 });
    }
    const pos = doblado.map((a, i) => ({ x: a.x + (recto[i].x - a.x) * p, y: a.y + (recto[i].y - a.y) * p }));
    const contactos = [];
    if (p === 0) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++)
      if (Math.abs(doblado[i].x - doblado[j].x) < 1e-9 && Math.abs(Math.abs(doblado[i].y - doblado[j].y) - 1) < 1e-9) contactos.push([i, j]);
    const enlaces = []; for (let i = 0; i + 1 < n; i++) enlaces.push([i, i + 1]);
    return { pos, enlaces, contactos, ancho, filas };
  }

  // ---------------- Digestión de polisacáridos ----------------
  const ENZIMAS = {
    amilasa: { nombre: 'amilasa (saliva y páncreas)', corta: ['α(1→4)'], humana: true },
    celulasa: { nombre: 'celulasa (microbios de la vaca o la termita)', corta: ['β(1→4)'], humana: false },
  };
  function digerir(tipo, enzima) {
    const P = POLISACARIDOS[tipo], Z = ENZIMAS[enzima || 'amilasa'];
    if (!P) throw new Error(`polisacárido desconocido: ${tipo}`);
    if (!Z) throw new Error(`enzima desconocida: ${enzima}`);
    const corta = Z.corta.includes(P.enlace);
    return { tipo, enlace: P.enlace, enzima: enzima || 'amilasa', corta, enzimaCorta: Z.corta[0], monomero: 'glucosa',
      errores: { 'misma-glucosa-se-digiere': true, 'no-es-glucosa': tipo === 'celulosa' ? 'otro monómero' : 'glucosa', 'por-tamano': tipo === 'celulosa' ? 'demasiado larga' : 'se digiere' } };
  }
  function cadenaPolisacarido(tipo, n) {
    const P = POLISACARIDOS[tipo];
    if (!P) throw new Error(`polisacárido desconocido: ${tipo}`);
    n = Number(n);
    if (!Number.isInteger(n) || n < 1) throw new Error('n tiene que ser un entero positivo');
    const out = [];
    for (let i = 0; i < n; i++) {
      if (P.enlace.startsWith('β')) out.push({ x: i, y: 0, giro: i % 2 ? Math.PI : 0 });
      else out.push({ x: i, y: 0.45 * Math.sin(i * 2 * Math.PI / 6), giro: 0 });
    }
    return out;
  }

  // ---------------- Grasas ----------------
  function tres(acidos) {
    const a = Array.isArray(acidos) ? acidos : [acidos, acidos, acidos];
    if (a.length !== 3) throw new Error('un triglicérido lleva tres ácidos grasos');
    a.forEach(x => { if (pieza(x).familia !== 'acido-graso') throw new Error(`no es un ácido graso: ${x}`); });
    return a;
  }
  const NOMBRE_TG = { palmitico: 'tripalmitina', estearico: 'triestearina', oleico: 'trioleína', linoleico: 'trilinoleína', linolenico: 'trilinolenina' };
  const KOH = masa('KOH'), NAOH = masa('NaOH'), I2 = masa('I2'), H2 = masa('H2');
  function trigliceridoDe(acidos) {
    const a = tres(acidos), r = condensar(['glicerol', ...a]);
    const dobles = a.reduce((t, x) => t + PIEZAS[x].dobles, 0);
    return { acidos: a, nombre: a.every(x => x === a[0]) ? NOMBRE_TG[a[0]] : null, M: r.M, formula: r.formula, texto: r.texto,
      masaPiezas: r.masaPiezas, aguas: r.aguas, masaAgua: r.masaAgua, dobles,
      indiceSaponificacion: 3 * KOH * 1000 / r.M, indiceYodo: dobles * I2 * 100 / r.M };
  }
  function jabonDe(acido, base) {
    const f = formula(PIEZAS[acido].formula); f.H -= 1; f[base === 'KOH' ? 'K' : 'Na'] = 1;
    return { formula: f, texto: texto(f), M: masa(f) };
  }
  function saponificacion(acidos, gramos, base) {
    base = base || 'NaOH';
    if (base !== 'NaOH' && base !== 'KOH') throw new Error('la base es NaOH o KOH');
    const t = trigliceridoDe(acidos), Mb = base === 'KOH' ? KOH : NAOH;
    const jabones = t.acidos.map(x => jabonDe(x, base)), mJ = jabones.reduce((s, j) => s + j.M, 0), gl = PIEZAS.glicerol.M;
    const r = { base, Mtrigliceridos: t.M, molBase: 3, masaBase: 3 * Mb, jabon: jabones[0], jabones, masaJabon: mJ, masaGlicerol: gl,
      antes: t.M + 3 * Mb, despues: gl + mJ, conserva: Math.abs(t.M + 3 * Mb - gl - mJ) < 1e-9 };
    if (gramos != null) {
      gramos = Number(gramos);
      if (!(gramos > 0)) throw new Error('los gramos tienen que ser positivos');
      const mol = gramos / t.M;
      Object.assign(r, { mol, gramosBase: mol * 3 * Mb, gramosJabon: mol * mJ, gramosGlicerol: mol * gl });
    }
    return r;
  }
  function hidrogenar(acidos) {
    const t = trigliceridoDe(acidos), h = t.dobles;
    const sat = t.acidos.map(x => (PIEZAS[x].C === 18 ? 'estearico' : 'palmitico'));
    const d = trigliceridoDe(sat);
    return { H2: h, masaGanada: h * H2, Mantes: t.M, Mdespues: d.M, yodoAntes: t.indiceYodo, yodoDespues: d.indiceYodo,
      dobles: h, producto: d.nombre, antes: t.nombre,
      errores: { 'cuenta-H-como-H2': { H2: 2 * h, masaGanada: 2 * h * H2, yodo: 0 }, 'yodo-mide-masa': { H2: h, yodo: t.indiceYodo },
        'yodo-sube-con-masa': { H2: h, yodo: 'sube' } } };
  }
  function compararSaponificacion(a, b) {
    const A = trigliceridoDe(a), B = trigliceridoDe(b);
    const ia = A.indiceSaponificacion, ib = B.indiceSaponificacion;
    const mayor = Math.abs(ia - ib) < 1e-9 ? 'iguales' : ia > ib ? 'a' : 'b';
    return { mayor, indices: [ia, ib], M: [A.M, B.M],
      errores: { 'crece-con-M': A.M === B.M ? 'iguales' : A.M > B.M ? 'a' : 'b', 'iguales-por-mol': 'iguales',
        'confunde-con-yodo': A.dobles === 0 && B.dobles === 0 ? 'ninguna' : (A.dobles > B.dobles ? 'a' : A.dobles < B.dobles ? 'b' : 'iguales') } };
  }

  // ---------------- Energía (factores de Atwater) ----------------
  const ATWATER = { carbohidrato: 4, proteina: 4, grasa: 9, vitamina: 0 };
  function energia(g) {
    g = g || {};
    let kcal = 0;
    for (const [k, v] of Object.entries(g)) {
      if (!(k in ATWATER)) throw new Error(`nutriente desconocido: ${k}`);
      kcal += ATWATER[k] * Number(v);
    }
    return { kcal, kJ: kcal * 4.184 };
  }
  const PORCIONES = {
    azucar: { nombre: 'una cucharadita de azúcar', gramos: { carbohidrato: 5 } },
    aceite: { nombre: 'una cucharadita de aceite', gramos: { grasa: 5 } },
    huevo: { nombre: 'la clara de un huevo', gramos: { proteina: 4 } },
    vitaminas: { nombre: 'una tableta de vitaminas del complejo B', gramos: { vitamina: 0.1 } },
  };
  function porcion(id) {
    const P = PORCIONES[id];
    if (!P) throw new Error(`porción desconocida: ${id}`);
    const e = energia(P.gramos);
    return { id, nombre: P.nombre, gramos: Object.values(P.gramos).reduce((a, b) => a + b, 0), kcal: e.kcal,
      errores: id === 'vitaminas' ? { 'se-queman-como-azucar': energia({ carbohidrato: 0.1 }).kcal, 'son-proteinas': energia({ proteina: 0.1 }).kcal } : {} };
  }

  return { MASAS, AGUA, PIEZAS, POLISACARIDOS, ENZIMAS, ATWATER, PORCIONES, KOH, NAOH, I2,
    formula, masa, texto, pieza, condensar, sacarido, polisacarido, hidrolisis, hidrolisisAlmidon,
    peptido, enlacesCadena, secuencias, desnaturalizar, plegado, digerir, cadenaPolisacarido,
    trigliceridoDe, saponificacion, hidrogenar, compararSaponificacion, energia, porcion };
});
