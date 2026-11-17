/*
 * Generador G4: el vector unitario (T12 de docs/clasificacion/compendio-vectores.md).
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['vectores-unitario']) y en Node (require).
 *
 * Tipos:
 *   unitario      el unitario de un vector entero de módulo entero (ternas y cuádruplas pitagóricas)
 *   con-modulo    el vector de módulo dado paralelo (o antiparalelo) a otro
 *   constante     la constante c > 0 que hace unitario a c·v
 *   unitario-suma el unitario de A + B (no es la suma de los unitarios)
 *   recta         el unitario en la dirección de la recta y = mx + b, hacia x creciente
 * Todo con fracciones exactas. Errores: hipótesis nuestras (no hay informe de vectores).
 * Notación (docs/plan-calidad.md, contrato, punto 5): el vector lleva flecha (A⃗) y su módulo no (A); los
 * unitarios de los ejes, sombrerito (î, ĵ, k̂). Los pares (3/5; 4/5) quedan como están.
 * Escena viva (pieza «flechas»): en los tipos del plano, A⃗ a escala sobre los ejes con î y ĵ, sus componentes y
 * el unitario û de largo 1. Los tipos en 3D y la recta no llevan escena (ver escenaViva).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, r, explicacion) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const TIPOS = ['unitario', 'con-modulo', 'constante', 'unitario-suma', 'recta'];
  // [x, y, z, módulo]: vectores enteros con módulo entero.
  const BASE2 = [[3, 4, 0, 5], [4, 3, 0, 5], [5, 12, 0, 13], [12, 5, 0, 13], [6, 8, 0, 10], [8, 15, 0, 17], [15, 8, 0, 17], [7, 24, 0, 25], [9, 12, 0, 15]];
  const BASE3 = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 3, 6, 7], [3, 6, 2, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [4, 8, 1, 9]];
  const numero = q => ({ clave: 'num:' + P.frac(q).n + '/' + P.frac(q).d, texto: P.textoFraccion(q) });
  const fr = (n, d) => P.frac(n, d);
  const vec = (cs, d) => P.vector(cs.map(c => fr(c, d)));
  // Vector con î, ĵ, k̂: (2, −3, 1) → «2î − 3ĵ + k̂».
  const ijk = P.ijk;
  const A_ = P.vec('A'), B_ = P.vec('B'), AB_ = `${A_} + ${B_}`;

  function elegirVector(rng, dim) {
    const b = rng.elegir(dim === 3 ? BASE3 : BASE2);
    const s = [rng.moneda() ? 1 : -1, rng.moneda() ? 1 : -1, rng.moneda() ? 1 : -1];
    const c = [b[0] * s[0], b[1] * s[1], dim === 3 ? b[2] * s[2] : 0];
    return { c: c.slice(0, dim), m: b[3], dim };
  }

  // Pares (A, B) enteros con |A|, |B| y |A + B| enteros, no paralelos. Se arman una sola vez.
  let PARES = null;
  function paresSuma() {
    if (PARES) return PARES;
    const cand = [];
    for (const [x, y] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]])
      for (const sx of [1, -1]) for (const sy of [1, -1]) cand.push([sx * x, sy * y]);
    for (let k = 1; k <= 12; k++) cand.push([k, 0], [-k, 0], [0, k], [0, -k]);
    PARES = [];
    for (const a of cand) for (const b of cand) {
      if (a[0] * b[1] - a[1] * b[0] === 0) continue;
      const s = Math.hypot(a[0] + b[0], a[1] + b[1]);
      if (Number.isInteger(s) && s > 0 && s <= 25) PARES.push([a, b]);
    }
    return PARES;
  }

  /*
   * Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): módulo, unitario y las reglas que el tipo usa, una
   * por línea. Nunca el módulo que sale ni el unitario.
   */
  // Las fórmulas van con un vector cualquiera V⃗, para no confundirlo con el A⃗ del enunciado.
  const V_ = P.vec('V');
  const MODULO = dim => `Módulo de un vector ${V_}: V = √(V_x² + V_y²${dim === 3 ? ' + V_z²' : ''}).`;
  const UNITARIO = `Unitario de ${V_}: û = ${V_}/V. Mide 1 y apunta hacia donde apunta ${V_}.`;
  function lineasDatos(d) {
    const dim = d.c ? d.c.length : 2;
    if (d.tipo === 'unitario') return [MODULO(dim), UNITARIO];
    if (d.tipo === 'con-modulo') return [MODULO(dim), UNITARIO,
      'Un vector de módulo k en la dirección de û es k·û; en sentido contrario, −k·û.'];
    if (d.tipo === 'constante') return [MODULO(dim), 'Un vector es unitario si su módulo es 1.', `Si c > 0: |c·${V_}| = c·|${V_}|.`];
    if (d.tipo === 'unitario-suma') return ['Suma con componentes: (a; b) + (c; d) = (a + c; b + d).', MODULO(2), UNITARIO];
    return ['La recta y = mx + b sube m por cada unidad que avanza x: su dirección es (1; m).', MODULO(2), UNITARIO];
  }

  function generar(semilla) {
    const rng = Azar.crear('vectores-unitario|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const variables = { A: { nombre: 'vector dado', color: 'o' }, B: { nombre: 'otro vector', color: 'i' }, k: { nombre: 'módulo pedido', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos;
    const suma = c => c.reduce((s, x) => s + Math.abs(x), 0);

    if (tipo === 'unitario') {
      const { c, m, dim } = elegirVector(rng, rng.elegir([2, 2, 3]));
      correcta = vec(c, m);
      enunciado = ['Se tiene el vector ', v('A', `${A_} = ${ijk(c)}`), '.'];
      pregunta = [`¿Cuál es el vector unitario de ${A_}?`];
      errores = [
        h('VE-unitario-sin-dividir', vec(c, 1), `Ese es el mismo ${A_}: no lo dividiste entre su módulo. Un unitario mide 1.`),
        h('VE-unitario-entre-suma', vec(c, suma(c)), `Dividiste entre la suma de las componentes (${suma(c)}). Hay que dividir entre el módulo, √(x² + y²${dim === 3 ? ' + z²' : ''}) = ${m}.`),
        h('VE-sentido-opuesto', vec(c.map(x => -x), m), `Ese unitario apunta al revés: es el de −${A_}.`),
        dim === 2 ? h('VE-sen-cos-cambiados', vec([c[1], c[0]], m), 'Cambiaste el orden de las componentes. El unitario conserva x en el primer lugar e y en el segundo.')
                  : h('VE-unitario-sin-raiz', vec(c, m * m), `Dividiste entre ${m * m}, que es el módulo al cuadrado. El módulo es su raíz, ${m}.`),
        h('VE-unitario-unos', P.vector(c.map(x => Math.sign(x))), 'Pusiste 1 en cada componente, con su signo. Ese vector no mide 1 (mide √2 o √3).'),
      ];
      solucion = [
        [`Módulo: A = √(${c.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = √${m * m} = ${m}.`],
        [`El unitario es ${A_} dividido entre su módulo: `, v('X', `û = ${A_}/${m} = ${correcta.texto}`), '.'],
        ['Comprobación: la suma de los cuadrados de sus componentes es 1.'],
      ];
      datos = { tipo, c };
    } else if (tipo === 'con-modulo') {
      const { c, m } = elegirVector(rng, rng.elegir([2, 2, 3]));
      const k = m * rng.elegir([2, 3, 4]); // módulo pedido: múltiplo del módulo, así B sale entero
      const anti = rng.elegir([false, false, true]);
      const s = anti ? -1 : 1;
      correcta = vec(c.map(x => s * k * x), m);
      enunciado = ['Se tiene ', v('A', `${A_} = ${ijk(c)}`), `. Se busca un vector ${B_} de módulo `, v('k', `${k}`), anti ? `, paralelo a ${A_} pero de sentido contrario (antiparalelo).` : `, paralelo a ${A_} y del mismo sentido.`];
      pregunta = [`¿Cuál es ${B_}?`];
      errores = [
        h('VE-unitario-sin-escalar', vec(c.map(x => s * x), m), `Ese es el unitario${anti ? ` de −${A_}` : ` de ${A_}`}: mide 1. Falta multiplicarlo por ${k}.`),
        h('VE-unitario-sin-dividir', vec(c.map(x => s * k * x), 1), `Multiplicaste ${A_} por ${k} sin dividirlo antes entre su módulo (${m}). Ese vector mide ${k * m}, no ${k}.`),
        h('VE-sentido-opuesto', vec(c.map(x => -s * k * x), m), anti ? `Ese vector tiene el mismo sentido que ${A_}. Antiparalelo pide el sentido contrario.` : `Ese vector apunta al revés de ${A_}. Paralelo y del mismo sentido pide el mismo unitario.`),
        h('VE-modulo-entre', vec(c.map(x => s * x), k * m), `Dividiste entre ${k} en vez de multiplicar: ese vector mide 1/${k}.`),
      ];
      solucion = [
        [`A = ${m}, así que el unitario de ${A_} es û = ${A_}/${m} = ${vec(c, m).texto}.`],
        [anti ? 'Antiparalelo: se usa −û. ' : 'Paralelo y del mismo sentido: se usa û. ', 'Un vector de módulo ', v('k', `${k}`), ' en esa dirección es ', v('k', `${k}`), anti ? '·(−û).' : '·û.'],
        [`${B_} = `, v('X', correcta.texto), '.'],
      ];
      datos = { tipo, c, k, anti };
    } else if (tipo === 'constante') {
      const { c, m } = elegirVector(rng, rng.elegir([2, 3]));
      correcta = numero(fr(1, m));
      enunciado = ['Para cierto número c > 0, el vector ', v('A', `c·${A_}`), ' es unitario, con ', v('A', `${A_} = ${ijk(c)}`), '.'];
      pregunta = ['¿Cuánto vale c?'];
      errores = [
        h('VE-constante-invertida', numero(m), `Ese es el módulo del vector. c es su inverso: c·${m} tiene que dar 1.`),
        h('VE-unitario-entre-suma', numero(fr(1, suma(c))), `Usaste la suma de las componentes (${suma(c)}). Lo que tiene que valer 1 es el módulo, no la suma.`),
        h('VE-unitario-sin-raiz', numero(fr(1, m * m)), `Dividiste entre ${m * m}, el módulo al cuadrado. El módulo es ${m}.`),
        h('VE-raiz-que-no-cumple', numero(fr(-1, m)), 'Si c fuera negativo también saldría unitario, pero el problema pide c > 0.'),
      ];
      solucion = [
        [`|c·${A_}| = c·|${A_}| para c > 0, y A = √(${c.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = ${m}.`],
        [`c·${m} = 1 → c = `, v('X', correcta.texto), '.'],
      ];
      datos = { tipo, c };
    } else if (tipo === 'unitario-suma') {
      // A y B no paralelos, de módulo entero, cuya suma también tiene módulo entero (así se puede
      // escribir la suma de los unitarios como distractor).
      const [a, b] = rng.elegir(paresSuma());
      const ma = Math.hypot(...a), mb = Math.hypot(...b);
      const S = [a[0] + b[0], a[1] + b[1]], m = Math.round(Math.hypot(...S));
      correcta = vec(S, m);
      const errores0 = [
        h('VE-unitario-sin-dividir', P.vector(S), `Ese es ${AB_}, que mide ${m}. Falta dividirlo entre su módulo.`),
        h('VE-sentido-opuesto', vec(S.map(x => -x), m), `Ese unitario apunta al revés: es el de −(${AB_}).`),
        h('VE-unitario-de-la-resta', Number.isInteger(Math.hypot(a[0] - b[0], a[1] - b[1])) ? vec([a[0] - b[0], a[1] - b[1]], Math.hypot(a[0] - b[0], a[1] - b[1])) : null, `Restaste ${A_} − ${B_} en vez de sumar.`),
        h('VE-unitario-entre-suma', vec(S, suma(S)), `Dividiste entre la suma de las componentes de ${AB_} (${suma(S)}). Hay que dividir entre su módulo, ${m}.`),
        h('VE-sen-cos-cambiados', vec([S[1], S[0]], m), `Cambiaste el orden de las componentes de ${AB_}.`),
      ];
      // La suma de los unitarios solo se puede escribir si los dos módulos son enteros.
      if (Number.isInteger(ma) && Number.isInteger(mb)) {
        const L = ma * mb;
        errores0.unshift(h('VE-suma-de-unitarios', vec([a[0] * mb + b[0] * ma, a[1] * mb + b[1] * ma], L), `Sumaste los unitarios de ${A_} y ${B_}: esa suma no mide 1. Primero se suma, después se divide.`));
      }
      errores = errores0;
      enunciado = ['Se tienen ', v('A', `${A_} = ${ijk(a)}`), ' y ', v('B', `${B_} = ${ijk(b)}`), '.'];
      pregunta = [`¿Cuál es el vector unitario de ${AB_}?`];
      solucion = [
        [`Primero se suma: ${AB_} = `, `${P.vector(S).texto}.`],
        [`|${AB_}| = √(${S.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = ${m}.`],
        [`Unitario de ${AB_} = (${AB_})/`, `${m} = `, v('X', correcta.texto), '.'],
        [`Ojo: sumar los unitarios de ${A_} y de ${B_} da otro vector, que no mide 1.`],
      ];
      datos = { tipo, a, b };
    } else {
      // recta y = (p/q)x + b; dirección (q; p) con módulo entero r.
      const [q, p0, r] = rng.elegir([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [15, 8, 17], [8, 15, 17]]);
      const p = rng.moneda() ? p0 : -p0;
      const b = rng.entero(-5, 5);
      correcta = vec([q, p], r);
      const mT = P.textoFraccion(fr(p, q));
      const mTexto = `(${mT})`;
      enunciado = ['Se tiene la recta ', v('A', `y = ${mTexto}x${b === 0 ? '' : (b < 0 ? ' − ' : ' + ') + Math.abs(b)}`), '.'];
      pregunta = ['¿Cuál es el vector unitario paralelo a la recta que apunta hacia donde crece x?'];
      errores = [
        h('VE-pendiente-a-direccion', vec([p, q], r), 'Pusiste la pendiente al revés, como (m; 1). La dirección de y = mx + b es (1; m): por cada paso en x, y sube m.'),
        h('VE-pendiente-signo', vec([q, -p], r), 'Cambiaste el signo de la pendiente. Con y = mx + b, la dirección es (1; m), con el signo de m.'),
        h('VE-unitario-sin-dividir', P.vector([1, fr(p, q)]), `(1; m) da la dirección, pero no mide 1: mide ${r}/${q}. Falta dividir entre su módulo.`),
        h('VE-sentido-opuesto', vec([-q, -p], r), 'Ese unitario apunta hacia donde x decrece.'),
        h('VE-ordenada-en-direccion', b !== 0 && Number.isInteger(Math.hypot(1, b)) ? vec([1, b], Math.hypot(1, b)) : null, 'Usaste el término independiente b como si fuera la pendiente. b solo sube o baja la recta.'),
      ];
      solucion = [
        [`La recta sube ${mT} por cada unidad que avanza x: su dirección es (1; ${mT}), o, sin fracciones, (${q}; ${p < 0 ? '−' : ''}${p0}).`],
        [`Su módulo es √(${q}² + ${p0}²) = ${r}.`],
        ['Unitario hacia x creciente: ', v('X', correcta.texto), '. El término independiente no cambia la dirección.'],
      ];
      datos = { tipo, p, q, b };
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    return {
      id: `vectores-unitario#${semilla}`, variables, enunciado, pregunta, datos: lineasDatos(datos), alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' },
      _datos: datos,
      // escena, pasos y fantasmas; solo en los tipos del plano que dividen un vector entre su módulo (ver escenaViva).
      ...escenaViva(datos, alternativas, correcta),
    };
  }

  /*
   * Escena viva (docs/escena-viva.md, sección 4; pieza nucleo/kit/piezas/flechas.js): A⃗ a escala sobre los ejes con
   * î y ĵ, sus componentes como tramos sobre x e y, y el unitario û desde el origen, como î y ĵ. Fidelidad: û mide 1
   * en la escala de la figura, igual que î y ĵ, y apunta como A⃗. Pasos: módulo (Pitágoras), dividir y comprobar.
   *   constante      c·A⃗ es el unitario: el paso «dividir» da c = 1/A
   *   unitario-suma  primero A⃗ + B⃗, cola con punta; después lo mismo con la suma
   * Los tipos en 3D no llevan escena: A⃗ no cabe a escala en el plano de la figura sin falsear largos ni ángulos.
   * La recta tampoco (su figura es la recta, no una flecha), ni «con módulo»: B⃗ mide de 2 a 4 veces A⃗ y la escala
   * se fija para todos los pasos, así que la figura inicial dejaba ver hacia dónde iba B⃗ (la respuesta) por el
   * espacio vacío. Siguen con la solución de siempre.
   * Las alternativas son textos: no se arrastra nada, y cada error se muestra en su fila, con su nombre.
   */
  const ROTULOS = {
    'VE-unitario-sin-dividir': 'sin dividir', 'VE-unitario-entre-suma': 'entre la suma', 'VE-sentido-opuesto': 'al revés',
    'VE-sen-cos-cambiados': 'componentes cambiadas', 'VE-unitario-sin-raiz': 'entre el cuadrado', 'VE-unitario-unos': 'unos con signo',
    'VE-constante-invertida': 'el módulo',
    'VE-raiz-que-no-cumple': 'c negativo', 'VE-unitario-de-la-resta': 'de la resta', 'VE-suma-de-unitarios': 'suma de unitarios',
  };
  const cuadrados = c => c.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ');

  function escenaViva(d, alternativas, correcta) {
    if (d.tipo === 'recta' || d.tipo === 'con-modulo' || (d.c && d.c.length !== 2)) return {};
    const v = P.v, suma = d.tipo === 'unitario-suma';
    const c = suma ? [d.a[0] + d.b[0], d.a[1] + d.b[1]] : d.c;           // el vector que se divide
    const m = Math.round(Math.hypot(...c));                              // entero por construcción
    const uT = vec(c, m).texto, u = [c[0] / m, c[1] / m];
    const nombre = suma ? `(${AB_})` : A_, colorV = suma ? null : 'o';
    const flechas = [];
    let p0 = 0;                                                          // pasos que van antes del módulo
    if (suma) {
      flechas.push({ de: [0, 0], a: d.a, color: 'o', rotulo: A_, valor: ijk(d.a) }, { de: [0, 0], a: d.b, color: 'i', rotulo: B_, valor: ijk(d.b) });
      flechas.push({ de: d.a, a: c, color: 'i', discontinua: true, grosor: 'contorno', paso: 1 });
      flechas.push({ de: [0, 0], a: c, rotulo: AB_, valor: ijk(c), paso: 1, valorPaso: 1 });
      p0 = 1;
    } else {
      flechas.push({ de: [0, 0], a: c, color: 'o', rotulo: A_, valor: ijk(c) });
    }
    // Las componentes: un tramo sobre x y otro paralelo a y, que llegan a la punta. Sin rótulo: el de A⃗ ya las dice
    // («A⃗ = 3î + 4ĵ») y, cerca del origen, los rótulos se pisaban con los de î, ĵ y û. Sobre un eje no hacen falta.
    if (c[0] && c[1]) {
      flechas.push({ de: [0, 0], a: [c[0], 0], color: colorV, discontinua: true, grosor: 'contorno', paso: p0 + 1 },
        { de: [c[0], 0], a: c, color: colorV, discontinua: true, grosor: 'contorno', paso: p0 + 1 });
    }
    // El unitario, desde el origen como î y ĵ. Es la respuesta en «unitario» y en la suma (color de lo que se pide).
    // Solo «û»: su valor va en la ecuación del paso (con el valor, el rótulo tapaba el origen).
    const uEsRespuesta = d.tipo === 'unitario' || suma;
    flechas.push({ de: [0, 0], a: u, color: uEsRespuesta ? 'd' : null, rotulo: 'û', paso: p0 + 2 });
    const modulo = { estado: { paso: p0 + 1 }, texto: ['El módulo sale con Pitágoras sobre las componentes.'],
      ecuacion: [`|${suma ? AB_ : 'A'}| = √(${cuadrados(c)}) = √${m * m} = `, suma ? `${m}` : v('A', `${m}`)] };
    // |û|² = (x/m)² + (y/m)²: «(3/5)²», «1²», «(−1)²»; después cada cuadrado ya hecho, «9/25 + 16/25».
    const alCuadrado = x => { const t = P.textoFraccion(fr(x, m)); return /[/−]/.test(t) ? `(${t})²` : `${t}²`; };
    const comprobar = [`|û| = √(${c.map(alCuadrado).join(' + ')}) = √(${c.map(x => P.textoFraccion(fr(x * x, m * m))).join(' + ')}) = 1`];
    let pasos;
    if (d.tipo === 'constante') {
      pasos = [modulo,
        { estado: { paso: 2 }, texto: [v('A', `c·${A_}`), ' mide c·', `${m}`, ', y tiene que medir 1.'], ecuacion: [`c·${m} = 1 → c = `, v('X', correcta.texto)] },
        { estado: { paso: 2, final: true }, texto: ['Comprobación: ', v('A', `c·${A_}`), ' es û, que mide 1 como î y ĵ.'], ecuacion: [`c·${A_} = û = ${uT}; `, ...comprobar] },
      ];
    } else {
      pasos = [modulo,
        { estado: { paso: p0 + 2 }, texto: [`Se divide ${nombre} entre su módulo: misma dirección, largo 1.`], ecuacion: [v('X', 'û'), ` = ${nombre}/${m} = `, v('X', uT)] },
        { estado: { paso: p0 + 2, final: true }, texto: ['Comprobación: ', v('X', 'û'), ' mide 1, igual que î y ĵ.'], ecuacion: comprobar },
      ];
      if (suma) pasos.unshift({ estado: { paso: 1 }, texto: [`Cola con punta: ${B_} sale de la punta de ${A_}.`], ecuacion: [`${AB_} = ${ijk(c)}`] });
    }
    const cuenta = {};
    for (const a of alternativas) if (a.error) cuenta[a.error.id] = (cuenta[a.error.id] || 0) + 1;
    const fantasmas = {};
    for (const a of alternativas) if (a.error) fantasmas[a.error.id] = cuenta[a.error.id] === 1 ? { rotulo: ROTULOS[a.error.id] || '', texto: a.texto } : {};
    const alt = `Ejes x e y con los unitarios î y ĵ. ${suma ? `Los vectores A y B a escala desde el origen, su suma de componentes ${P.formatear(c[0])} y ${P.formatear(c[1])}`
      : `El vector A a escala desde el origen, de componentes ${P.formatear(c[0])} y ${P.formatear(c[1])}`}, y el unitario de largo 1 en la misma dirección`;
    return { escena: { pieza: 'flechas', datos: { unidad: '', ejes: true, flechas }, alt }, pasos, fantasmas };
  }

  return { id: 'vectores-unitario', titulo: 'El vector unitario', generar };
});
