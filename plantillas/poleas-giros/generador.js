/*
 * Generador «poleas-giros»: poleas, sentido de giro y coincidencias (razonamiento matemático,
 * unidad razonamiento-matematico.ruedas-poleas-engranajes). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['poleas-giros']) y en Node
 * (require). No usa ningún motor: calcula todo por su cuenta. Sin ω ni rpm (eso es de física,
 * plantillas/circular-transmision/): aquí se cuentan sentidos, arcos y vueltas.
 *
 * Tipos (p._datos.tipo):
 *   sentido       cadena de 5 a 8 poleas (A, B, C, …) en fila; cada una unida a la anterior por faja
 *                 abierta, faja cruzada, contacto directo o mismo eje. A gira en un sentido dado.
 *                 Pregunta «cuantas»: cuántas poleas (contando A) giran en el sentido pedido; respuesta
 *                 un entero. Pregunta «cuales»: qué poleas giran en sentido antihorario; respuesta un
 *                 texto con clave «set:B,D» (vacío: «set:»).
 *   bloques       poleas dobles (dos gargantas fijas al mismo eje) con bloques colgados de cuerdas
 *                 enrolladas, cada cuerda del lado izquierdo o derecho de su garganta. Modo «eje»: una
 *                 polea doble, el bloque X en una garganta y el Y en la otra. Modo «faja»: dos poleas
 *                 dobles P y Q; una faja (abierta o cruzada) une una garganta de P con una de Q; X cuelga
 *                 de la otra garganta de P e Y de la otra de Q. Si X sube (o baja) d cm, se pide cuánto
 *                 se mueve Y y en qué sentido; respuesta con signo, en cm: + sube, − baja.
 *   coincidencias dos ruedas con un punto marcado en cada una, juntos al empezar: tangentes (radios en
 *                 cm), engranajes (dientes) o unidas por faja (radios; las marcas empiezan arriba). Se
 *                 pide cuántas vueltas da A cuando los puntos se han vuelto a juntar n veces (sin contar
 *                 el inicio). Respuesta: n·MCM(a, b)/a, con a y b los radios (o dientes) de A y B.
 *
 * Convenciones:
 *   - Faja abierta y mismo eje conservan el sentido; faja cruzada y contacto lo invierten.
 *   - En un mismo eje se comparte el ángulo girado: el arco (lo que se enrolla) va como el radio.
 *     Por una faja, o en contacto, se comparte el arco: el ángulo va al revés que el radio.
 *   - Una polea que gira en sentido horario sube la cuerda que cuelga de su lado izquierdo y baja la
 *     del lado derecho.
 * Errores: RME26, RME27, RME28 y RME180–RME185 (docs/investigacion/razonamiento-espacial-ideas-erroneas.md),
 * RM5 (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md). Todos «hipotesis».
 * Funciones: generar(semilla) → problema; recalcular a mano con p._datos (campos de cada tipo arriba).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RME = 'docs/investigacion/razonamiento-espacial-ideas-erroneas.md';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = RME) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const ht = (id, r, explicacion) => ({ id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: RME });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const LETRAS = 'ABCDEFGH'.split('');
  const INVIERTE = { abierta: false, cruzada: true, contacto: true, eje: false };
  const mcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => a / mcd(a, b) * b;
  const corto = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;

  function generar(semilla) {
    const rng = Azar.crear('poleas-giros|' + semilla);
    const tipo = rng.elegir(['sentido', 'sentido', 'bloques', 'bloques', 'coincidencias', 'coincidencias']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'sentido' ? sentido(rng, semilla) : tipo === 'bloques' ? bloques(rng, semilla) : coincidencias(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // ---------- sentido de giro ----------
  // Sentidos de toda la cadena (+1 como A) según qué uniones se crea que invierten.
  const sentidos = (uniones, inv) => uniones.reduce((s, u) => (s.push(inv[u] ? -s[s.length - 1] : s[s.length - 1]), s), [1]);
  const conjunto = letras => ({ clave: 'set:' + letras.join(','), texto: letras.length === 0 ? 'Ninguna' : letras.length === 1 ? `Solo ${letras[0]}` : letras.slice(0, -1).join(', ') + ' y ' + letras[letras.length - 1] });

  function textoUnion(u, X, prev) {
    if (u === 'abierta') return [X, ` está unida a ${prev} por una faja abierta.`];
    if (u === 'cruzada') return [X, ` está unida a ${prev} por una faja cruzada (en forma de 8).`];
    if (u === 'contacto') return [X, ` está en contacto con ${prev} y gira sin resbalar.`];
    return [X, ` está fija al mismo eje que ${prev}.`];
  }

  function sentido(rng, semilla) {
    const n = rng.elegir([5, 6, 6, 7, 7, 8]);
    const uniones = [];
    for (let k = 1; k < n; k++) {
      let u;
      do u = rng.elegir(['abierta', 'cruzada', 'contacto', 'eje']); while (u === 'eje' && uniones[k - 2] === 'eje');
      uniones.push(u);
    }
    if (!['abierta', 'cruzada', 'contacto'].every(u => uniones.includes(u))) return null;
    const sA = rng.elegir(['horario', 'antihorario']);
    const modo = rng.elegir(['cuantas', 'cuantas', 'cuales']);
    const pedido = modo === 'cuales' ? 'antihorario' : rng.elegir(['horario', 'antihorario']);
    const letras = LETRAS.slice(0, n);
    // Las del sentido pedido, según una regla de inversión.
    const enPedido = inv => {
      const s = sentidos(uniones, inv);
      const quiere = (pedido === sA) ? 1 : -1;
      return letras.filter((L, k) => s[k] === quiere);
    };
    const bien = enPedido(INVIERTE);
    const variantes = [
      ['RME26', enPedido({ contacto: true }), 'La faja cruzada (en forma de 8) también invierte el sentido: cada tramo de la faja cruza al otro lado de la polea. Solo la faja abierta y el eje lo conservan.'],
      ['RME26', enPedido({ cruzada: true }), 'Dos poleas en contacto giran en sentidos contrarios: el borde de una empuja al de la otra hacia el lado opuesto, como dos engranajes.'],
      ['RME180', enPedido({ abierta: true, cruzada: true, contacto: true }), 'La faja abierta no invierte el sentido: las dos poleas giran hacia el mismo lado, como las ruedas de una bicicleta con su cadena. Solo la faja cruzada y el contacto lo invierten.'],
      ['RME181', letras.filter(L => !bien.includes(L)), `Contaste las que giran en el otro sentido. Se pregunta por las que giran en sentido ${pedido}${pedido === sA ? ' (A es una de ellas)' : ''}.`],
      ['RME26', enPedido({}), 'No todas giran igual: la faja cruzada y el contacto invierten el sentido de giro en cada unión.'],
    ];
    const variables = { A: { nombre: 'polea A', color: 'o' }, S: { nombre: 'sentido pedido', color: 'i' }, X: { nombre: 'lo que se pide', color: 'h' } };
    const enunciado = [`Hay ${n} poleas en fila: ${letras.slice(0, -1).join(', ')} y ${letras[n - 1]}. `];
    for (let k = 1; k < n; k++) enunciado.push(...textoUnion(uniones[k - 1], letras[k], letras[k - 1]), ' ');
    enunciado.push('La polea ', v('A', 'A'), ' gira en sentido ', v('A', sA), '. Nada resbala.');
    const pregunta = modo === 'cuales'
      ? ['¿Qué poleas giran en sentido ', v('S', 'antihorario'), '?']
      : ['¿Cuántas poleas, contando a A, giran en sentido ', v('S', pedido), '?'];
    const s = sentidos(uniones, INVIERTE);
    const sent = k => ((s[k] === 1) === (sA === 'horario') ? 'horario' : 'antihorario');
    const solucion = [['La faja abierta y el mismo eje conservan el sentido; la faja cruzada y el contacto lo invierten.'],
      ['Se recorre la fila desde A: ' + letras.map((L, k) => `${L} ${sent(k)}`).join(', ') + '.']];
    let alternativas, correcta;
    if (modo === 'cuales') {
      correcta = conjunto(bien);
      solucion.push(['Giran en sentido antihorario: ', v('X', correcta.texto), '.']);
      alternativas = P.armarTexto({ correcta, rng, errores: variantes.map(([id, L, e]) => ht(id, conjunto(L), e)) });
      correcta = correcta.clave;
    } else {
      correcta = bien.length;
      solucion.push([`Giran en sentido ${pedido}: ${bien.join(', ') || 'ninguna'}. Son `, v('X', String(correcta)), '.']);
      alternativas = P.armar({ correcta, rng, negativos: true, texto: x => (x === 1 ? '1 polea' : `${x} poleas`), errores: variantes.map(([id, L, e]) => h(id, L.length, e)) });
    }
    return {
      id: `poleas-giros#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: modo === 'cuales' ? '' : 'poleas' },
      _datos: { tipo: 'sentido', modo, n, uniones, sA, pedido },
    };
  }

  // ---------- poleas solidarias y bloques ----------
  const RADIOS = [5, 6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40];
  const lado = s => (s === 'izq' ? 'izquierdo' : 'derecho');
  const mueve = x => `${x > 0 ? 'sube' : 'baja'} ${f(Math.abs(x))} cm`;

  function bloques(rng, semilla) {
    const modo = rng.elegir(['eje', 'faja', 'faja']);
    const d = rng.elegir([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30]);
    const xSube = rng.moneda();
    const ladoX = rng.elegir(['izq', 'der']), ladoY = rng.elegir(['izq', 'der']);
    const dos = () => { const a = rng.elegir(RADIOS); let b; do b = rng.elegir(RADIOS); while (b === a); return [a, b]; };
    // Sentido de la polea de X: +1 horario. Horario sube la cuerda del lado izquierdo.
    const sP = (xSube ? 1 : -1) * (ladoX === 'izq' ? 1 : -1);
    let rx, ry, pf = null, qf = null, cruzada = false, correcta, errores, enunciado, solucion;
    const variables = { X: { nombre: 'bloque X', color: 'o' }, Y: { nombre: 'bloque Y', color: 'i' }, F: { nombre: 'faja', color: 'd' } };
    const datoX = ['Si el bloque ', v('X', 'X'), ' ', v('X', `${xSube ? 'sube' : 'baja'} ${d} cm`), ','];
    if (modo === 'eje') {
      [rx, ry] = dos();
      const sQ = sP;
      const sign = sQ * (ladoY === 'izq' ? 1 : -1);
      correcta = sign * d * ry / rx;
      enunciado = [`Una polea tiene dos gargantas fijas al mismo eje, de ${rx} cm y ${ry} cm de radio. Del lado ${lado(ladoX)} de la garganta de ${rx} cm cuelga el bloque `, v('X', 'X'),
        `, y del lado ${lado(ladoY)} de la garganta de ${ry} cm cuelga el bloque `, v('Y', 'Y'), '. Cada cuerda está enrollada en su garganta y no resbala.'];
      errores = [
        h('RME182', -correcta, ladoX === ladoY ? 'Los dos bloques cuelgan del mismo lado del eje: cuando la polea gira, las dos cuerdas se enrollan (o se sueltan) a la vez, así que los dos se mueven hacia el mismo lado.' : 'Los bloques cuelgan de lados opuestos del eje: cuando una cuerda se enrolla, la otra se suelta. Si uno sube, el otro baja.'),
        h('RME27', sign * d, `Tomaste el mismo desplazamiento en las dos gargantas. En un mismo eje se comparte el ángulo girado, no el arco: la garganta de ${ry} cm enrolla ${ry}/${rx} de lo que enrolla la de ${rx} cm.`),
        h('RM5', sign * d * rx / ry, `Usaste la razón de radios al revés. Con el mismo ángulo, la garganta de mayor radio enrolla más cuerda: el desplazamiento va como el radio, ${ry}/${rx}.`, RM),
        h('RME27', -sign * d, 'Tomaste el mismo desplazamiento en las dos gargantas y además el sentido al revés. En un mismo eje se comparte el ángulo: el arco va como el radio; y el sentido depende del lado del que cuelga cada cuerda.'),
      ];
      solucion = [
        [`Las dos gargantas giran el mismo ángulo. Lo que enrolla cada una va como su radio: `, v('Y', 'Y'), ' se mueve ', `${d} · ${ry}/${rx} = ${f(Math.abs(correcta))} cm.`],
        [ladoX === ladoY ? 'Las dos cuerdas cuelgan del mismo lado, así que se enrollan (o se sueltan) a la vez: ' : 'Las cuerdas cuelgan de lados opuestos, así que si una se enrolla la otra se suelta: ', v('Y', `Y ${mueve(correcta)}`), '.'],
      ];
    } else {
      let px, py; [px, pf] = dos(); [qf, py] = dos();
      rx = px; ry = py;
      cruzada = rng.moneda();
      const sQ = cruzada ? -sP : sP;
      const sign = sQ * (ladoY === 'izq' ? 1 : -1);
      const mag = d * pf * py / (px * qf);
      correcta = sign * mag;
      enunciado = [`Las poleas P y Q tienen dos gargantas cada una, fijas a su eje: P de ${px} cm y ${pf} cm de radio; Q de ${qf} cm y ${py} cm. Una `, v('F', cruzada ? 'faja cruzada (en forma de 8)' : 'faja abierta'),
        ` une la garganta de ${pf} cm de P con la de ${qf} cm de Q. Del lado ${lado(ladoX)} de la garganta de ${px} cm de P cuelga el bloque `, v('X', 'X'),
        `, y del lado ${lado(ladoY)} de la garganta de ${py} cm de Q cuelga el bloque `, v('Y', 'Y'), '. Nada resbala.'];
      const sentidoTexto = 'Para el sentido: ' + (cruzada ? 'la faja cruzada hace girar a Q al revés que P' : 'la faja abierta hace girar a Q hacia el mismo lado que P') + ', y una polea que gira en sentido horario sube la cuerda de su lado izquierdo y baja la del derecho.';
      errores = [
        h('RME182', -correcta, 'El sentido está al revés. ' + sentidoTexto),
        h('RME27', sign * d, 'Tomaste el mismo desplazamiento en todas las gargantas. En un mismo eje se comparte el ángulo, no el arco; solo por la faja se comparte el arco.'),
        h('RME183', sign * d * py / px, `Tomaste que P y Q giran el mismo ángulo. La faja hace avanzar igual sus dos bordes (el mismo arco), así que la garganta de ${qf} cm gira ${pf}/${qf} del ángulo de la de ${pf} cm.`),
        h('RM5', sign * d * px * qf / (pf * py), 'Usaste las razones de radios al revés. En el mismo eje el arco va como el radio; por la faja el arco es el mismo y el ángulo va al revés que el radio.', RM),
        h('RME27', sign * d * pf / px, `Seguiste bien la polea P y la faja, pero en Q tomaste el mismo desplazamiento en sus dos gargantas. En el mismo eje, el arco va como el radio: falta multiplicar por ${py}/${qf}.`),
      ];
      const fajaMueve = d * pf / px;
      solucion = [
        ['En P, mismo eje: la garganta de la faja mueve ', `${d} · ${pf}/${px} = ${f(fajaMueve)} cm de `, v('F', 'faja'), '.'],
        ['Por la faja se comparte el arco: la garganta de Q de ', `${qf} cm también avanza ${f(fajaMueve)} cm.`],
        ['En Q, mismo eje: la cuerda de ', v('Y', 'Y'), ` se mueve ${f(fajaMueve)} · ${py}/${qf} = ${f(mag)} cm.`],
        [sentidoTexto + ' Por eso ', v('Y', `Y ${mueve(correcta)}`), '.'],
      ];
    }
    // Si el desplazamiento de Y sale igual al de X, el error RME27 daría la correcta: no sirve.
    if (!corto(correcta) || Math.abs(correcta) > 200 || Math.abs(correcta) < 0.5 || Math.abs(Math.abs(correcta) - d) < 1e-9) return null;
    errores = errores.filter(e => corto(e.valor));
    const pregunta = [...datoX, ' ¿cuánto y en qué sentido se mueve el bloque ', v('Y', 'Y'), '?'];
    const alternativas = P.armar({ correcta, errores, rng, negativos: true, texto: mueve });
    if (!alternativas.some(a => Math.sign(a.valor) !== Math.sign(correcta))) return null;
    return {
      id: `poleas-giros#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'cm' },
      _datos: { tipo: 'bloques', modo, d, xSube, ladoX, ladoY, rx, ry, pf, qf, cruzada },
    };
  }

  // ---------- coincidencias ----------
  const vecesTxt = n => (n === 1 ? 'una vez' : `${n} veces`);
  function coincidencias(rng, semilla) {
    const modo = rng.elegir(['tangentes', 'engranajes', 'faja']);
    const pool = modo === 'engranajes' ? [8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 36, 40, 42, 45, 48]
      : [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30];
    const a = rng.elegir(pool), b = rng.elegir(pool);
    if (a === b || a % b === 0 || b % a === 0 || mcd(a, b) === 1 || mcm(a, b) > 240) return null;
    const n = rng.elegir([1, 2, 2, 3, 3, 4]);
    const L = mcm(a, b);
    const correcta = n * L / a;
    const med = x => (modo === 'engranajes' ? `${x} dientes` : `${x} cm de radio`);
    const variables = { A: { nombre: 'rueda A', color: 'o' }, B: { nombre: 'rueda B', color: 'i' }, n: { nombre: 'veces que se juntan', color: 'h' }, X: { nombre: 'vueltas de A', color: 'd' } };
    let enunciado, pregunta;
    if (modo === 'tangentes') {
      enunciado = ['Dos ruedas tangentes giran sin resbalar: ', v('A', 'A'), `, de ${med(a)}, y `, v('B', 'B'), `, de ${med(b)}. Al empezar, un punto marcado en el borde de A y otro marcado en el borde de B están en contacto.`];
      pregunta = ['¿Cuántas vueltas habrá dado ', v('A', 'A'), ' cuando los puntos marcados se hayan vuelto a tocar ', v('n', vecesTxt(n)), ' (sin contar el inicio)?'];
    } else if (modo === 'engranajes') {
      enunciado = ['Dos ruedas dentadas engranan: ', v('A', 'A'), `, de ${med(a)}, y `, v('B', 'B'), `, de ${med(b)}. Al empezar, un diente marcado de A está metido en un hueco marcado de B.`];
      pregunta = ['¿Cuántas vueltas habrá dado ', v('A', 'A'), ' cuando el diente marcado haya vuelto a entrar en el hueco marcado ', v('n', vecesTxt(n)), ' (sin contar el inicio)?'];
    } else {
      enunciado = ['Las poleas ', v('A', 'A'), `, de ${med(a)}, y `, v('B', 'B'), `, de ${med(b)}, están unidas por una faja abierta que no resbala. Al empezar, cada una tiene una marca en su punto más alto.`];
      pregunta = ['¿Cuántas vueltas habrá dado ', v('A', 'A'), ' cuando las dos marcas hayan coincidido arriba ', v('n', vecesTxt(n)), ' (sin contar el inicio)?'];
    }
    const errores = [
      h('RME28', n * b, `Igualaste vueltas cruzadas: A da tantas vueltas como mide B. Eso hace coincidir los puntos, pero no por primera vez: lo que tiene que repetirse es el arco recorrido, que debe ser múltiplo de los dos perímetros. El primero es el MCM, no el producto.`),
      h('RM5', n * L / b, 'Esas son las vueltas de B. La rueda de mayor tamaño da menos vueltas para el mismo arco: no da más vueltas por ser más grande.', RM),
      h('RME184', (n - 1) * L / a, `Contaste el inicio como uno de los encuentros. El inicio no cuenta: hacen falta ${n} encuentros después de empezar.`),
      h('RME185', n * L, `Diste el MCM (${modo === 'engranajes' ? 'los dientes que pasan' : 'el arco común, medido en radios'}) y no lo dividiste entre ${modo === 'engranajes' ? 'los dientes' : 'el radio'} de A para tener sus vueltas.`),
    ].filter(e => Number.isInteger(e.valor));
    const per = x => (modo === 'engranajes' ? `${x} dientes` : `2π·${x} cm`);
    const solucion = [
      [modo === 'engranajes' ? 'Los dientes de A y de B pasan por el punto de engrane al mismo ritmo: después de k dientes, A ha dado k/' + a + ' vueltas y B k/' + b + '.'
        : (modo === 'faja' ? 'La faja hace avanzar el borde de A y el de B el mismo arco.' : 'Las ruedas tangentes recorren el mismo arco en el punto de contacto.')],
      modo === 'engranajes'
        ? [`La marca de A vuelve a su lugar cada ${a} dientes y la de B cada ${b}. Se juntan cuando los dientes que pasaron son múltiplo de los dos: cada MCM(${a}, ${b}) = ${L} dientes.`]
        : [`La marca de A vuelve a su lugar cada 2π·${a} cm de arco y la de B cada 2π·${b} cm. Se juntan cuando el arco es múltiplo de los dos perímetros: cada 2π·MCM(${a}, ${b}) = 2π·${L} cm.`],
      modo === 'engranajes'
        ? ['Para juntarse ', v('n', vecesTxt(n)), ` tienen que pasar ${n} · ${L} = ${n * L} dientes; A da ${n * L}/${a} = `, v('X', `${correcta} vueltas`), '.']
        : ['Para juntarse ', v('n', vecesTxt(n)), ` hace falta un arco de ${n} · 2π·${L} cm; A da (${n} · 2π·${L})/(2π·${a}) = `, v('X', `${correcta} vueltas`), '.'],
    ];
    const alternativas = P.armar({ correcta, errores, rng, texto: x => `${f(x)} vuelta${x === 1 ? '' : 's'}` });
    return {
      id: `poleas-giros#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'vueltas' },
      _datos: { tipo: 'coincidencias', modo, a, b, n },
    };
  }

  return { id: 'poleas-giros', titulo: 'Poleas: sentido de giro, bloques y coincidencias', generar };
});
