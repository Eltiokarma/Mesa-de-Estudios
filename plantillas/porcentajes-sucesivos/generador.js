/*
 * Generador: aumentos y descuentos sucesivos.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['porcentajes-sucesivos']) y en Node (require).
 *
 * Aritmética todavía no tiene informe de errores típicos: todas las alternativas incorrectas
 * son hipótesis (errores frecuentes en problemas de academia), y los datos del colegio dirán
 * cuáles se eligen de verdad.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const PCT = [10, 15, 20, 25, 30, 40, 50];
  const PRECIOS = [80, 120, 200, 250, 300, 400, 500, 600, 800, 1000, 1200];
  const PRODUCTOS = ['una casaca', 'unas zapatillas', 'un celular', 'una mochila', 'una bicicleta', 'un televisor', 'una licuadora'];
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 2);

  function generar(semilla) {
    const rng = Azar.crear('porcentajes-sucesivos|' + semilla);
    for (let intento = 0; intento < 50; intento++) {
      const p = construir(rng, semilla);
      if (p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla) {
    const tipo = rng.elegir(['dos-descuentos', 'aumento-descuento', 'descuento-unico']);
    const a = rng.elegir(PCT), b = rng.elegir(PCT), precio = rng.elegir(PRECIOS), prod = rng.elegir(PRODUCTOS);
    const v = P.v;
    const variables = { P: { nombre: 'precio inicial', color: 'o' }, a: { nombre: 'primer porcentaje', color: 'i' }, b: { nombre: 'segundo porcentaje', color: 'h' } };
    let enunciado, pregunta, correcta, errores, solucion, unidad = 'soles', prefijo = 'S/ ';

    if (tipo === 'dos-descuentos') {
      correcta = precio * (1 - a / 100) * (1 - b / 100);
      enunciado = [`Una tienda ofrece ${prod} a `, v('P', `S/ ${f(precio)}`), '. Primero le hace un descuento del ', v('a', `${a} %`),
        ' y, sobre el nuevo precio, otro descuento del ', v('b', `${b} %`), '.'];
      pregunta = ['¿Cuánto se paga al final?'];
      errores = [
        h('suma-descuentos', precio * (1 - (a + b) / 100), `Sumaste ${a} % + ${b} %. El segundo descuento se aplica a un precio ya rebajado.`),
        h('monto-descuento', precio - correcta, 'Calculaste cuánto se descuenta; la pregunta pide cuánto se paga.'),
        h('un-solo-descuento', precio * (1 - Math.max(a, b) / 100), 'Aplicaste un solo descuento. Van los dos, uno después del otro.'),
        h('promedio', precio * (1 - (a + b) / 200), 'Promediaste los porcentajes. Los descuentos sucesivos se multiplican.'),
      ];
      solucion = [
        ['Después del primer descuento queda el ', `${100 - a} %`, ': ', v('P', `S/ ${f(precio)}`), ` × ${f((100 - a) / 100)} = S/ ${f(precio * (1 - a / 100))}.`],
        ['El segundo descuento se aplica sobre ese precio: ', `S/ ${f(precio * (1 - a / 100))} × ${f((100 - b) / 100)} = S/ ${f(correcta)}.`],
        [`Atajo: los factores se multiplican. ${f((100 - a) / 100)} × ${f((100 - b) / 100)} = ${f((1 - a / 100) * (1 - b / 100))}, o sea, se paga el ${f(100 * (1 - a / 100) * (1 - b / 100))} % del precio.`],
      ];
    } else if (tipo === 'aumento-descuento') {
      correcta = precio * (1 + a / 100) * (1 - b / 100);
      enunciado = ['El precio de ', `${prod} era `, v('P', `S/ ${f(precio)}`), '. Subió un ', v('a', `${a} %`), ' y luego bajó un ', v('b', `${b} %`), '.'];
      pregunta = ['¿Cuál es el precio ahora?'];
      errores = [
        h('se-compensan', precio * (1 + (a - b) / 100), `Sumaste +${a} % y −${b} %. El descuento va sobre el precio ya aumentado.${a === b ? ' Por eso no vuelve al inicio.' : ''}`),
        h('solo-aumento', precio * (1 + a / 100), 'Aplicaste solo el aumento. Falta el descuento.'),
        h('solo-descuento', precio * (1 - b / 100), 'Aplicaste solo el descuento. Falta el aumento.'),
        h('monto-variacion', Math.abs(precio - correcta), 'Calculaste cuánto cambió el precio; la pregunta pide el precio nuevo.'),
      ];
      solucion = [
        ['Con el aumento se paga el ', `${100 + a} %`, ': ', v('P', `S/ ${f(precio)}`), ` × ${f((100 + a) / 100)} = S/ ${f(precio * (1 + a / 100))}.`],
        ['El descuento se aplica sobre el precio aumentado: ', `S/ ${f(precio * (1 + a / 100))} × ${f((100 - b) / 100)} = S/ ${f(correcta)}.`],
        [`En un solo paso: ${f((100 + a) / 100)} × ${f((100 - b) / 100)} = ${f((1 + a / 100) * (1 - b / 100))} del precio inicial.`],
      ];
    } else {
      correcta = a + b - a * b / 100;
      unidad = '%'; prefijo = '';
      enunciado = ['Una tienda hace dos descuentos sucesivos: primero del ', v('a', `${a} %`), ' y luego del ', v('b', `${b} %`), '.'];
      pregunta = ['¿A qué descuento único equivalen?'];
      errores = [
        h('suma-descuentos', a + b, `Sumaste los porcentajes. El ${b} % se descuenta de un precio ya rebajado.`),
        h('promedio', (a + b) / 2, 'Promediaste. Lo que se multiplica es lo que queda en cada paso.'),
        h('producto', a * b / 100, 'Multiplicaste los porcentajes. Se multiplican las partes que quedan: 100 % menos cada descuento.'),
        h('lo-que-queda', (1 - a / 100) * (1 - b / 100) * 100, 'Ese es el porcentaje que se paga. El descuento es 100 % menos eso.'),
      ];
      solucion = [
        [`Después de los dos descuentos se paga ${f((100 - a) / 100)} × ${f((100 - b) / 100)} = ${f((1 - a / 100) * (1 - b / 100))} del precio, o sea, el ${f(100 * (1 - a / 100) * (1 - b / 100))} %.`],
        [`El descuento único es lo que falta para el 100 %: 100 % − ${f(100 * (1 - a / 100) * (1 - b / 100))} % = ${f(correcta)} %.`],
        ['Atajo: ', v('a', `${a}`), ' + ', v('b', `${b}`), ` − (${a} × ${b}) ÷ 100 = ${f(correcta)} %.`],
      ];
    }
    const alternativas = P.armar({ correcta, errores, rng, unidad: unidad === '%' ? '%' : '', decimales: 2 })
      .map(x => ({ ...x, texto: unidad === '%' ? x.texto : prefijo + x.texto }));
    return {
      id: `porcentajes-sucesivos#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      _datos: { tipo, precio, a, b },
      // escena, pasos, fantasmas y respuesta ({ valor, unidad } de siempre, más cómo se arrastra).
      ...escenaViva(tipo, precio, a, b, correcta, alternativas),
    };
  }

  /*
   * Escena viva (docs/escena-viva.md, sección 4): la barra del total que se corta por tramos
   * (nucleo/kit/piezas/barra-porcentaje.js), la respuesta que se arrastra, la solución como línea de tiempo
   * y un fantasma por error con nombre. No reemplaza nada: sin el kit, la app usa los campos de siempre.
   */
  const ROTULOS = {
    'suma-descuentos': 'sumando', 'monto-descuento': 'lo descontado', 'un-solo-descuento': 'un descuento', promedio: 'promediando',
    'se-compensan': 'sumando', 'solo-aumento': 'solo el aumento', 'solo-descuento': 'solo el descuento', 'monto-variacion': 'el cambio',
    producto: 'multiplicando', 'lo-que-queda': 'lo que se paga',
  };
  // El mayor paso «bonito» que no pase de tope (el mismo criterio que Kit.respuesta.pasoBonito).
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
  const pasoBonito = tope => BONITOS.reduce((p, b) => (b <= tope + 1e-12 ? b : p), BONITOS[0]);

  function escenaViva(tipo, precio, a, b, correcta, alternativas) {
    const v = P.v;
    const enPct = tipo === 'descuento-unico';
    const fa = tipo === 'aumento-descuento' ? 1 + a / 100 : 1 - a / 100, fb = 1 - b / 100;
    const total = enPct ? 100 : precio, v1 = total * fa, v2 = v1 * fb;
    const tramos = [{ tipo: tipo === 'aumento-descuento' ? 'aumento' : 'descuento', pct: a, color: 'i' }, { tipo: 'descuento', pct: b, color: 'h' }];
    const datos = { total, prefijo: enPct ? '' : 'S/ ', sufijo: enPct ? ' %' : '', decimales: 2, color: enPct ? null : 'o', tramos, marca: enPct ? 'quita' : 'queda' };
    const sol = x => (enPct ? `${f(x)} %` : `S/ ${f(x)}`);
    const inicio = enPct ? '100 %' : v('P', `S/ ${f(precio)}`);
    let pasos;
    if (tipo === 'dos-descuentos') {
      pasos = [
        { estado: { corte: 1 }, texto: ['Primero se quita el ', v('a', `${a} %`), ' del precio: queda el ', `${100 - a} %`, '.'], ecuacion: [inicio, ` × ${f(fa)} = ${sol(v1)}`] },
        { estado: { corte: 2 }, texto: ['El ', v('b', `${b} %`), ' se quita de lo que quedó, no del precio inicial.'], ecuacion: [`${sol(v1)} × ${f(fb)} = ${sol(v2)}`] },
        { estado: { corte: 2, final: true }, texto: [`Se paga el ${f(100 * fa * fb)} % del precio: los factores se multiplican.`], ecuacion: [`${f(fa)} × ${f(fb)} = ${f(fa * fb)}`] },
      ];
    } else if (tipo === 'aumento-descuento') {
      pasos = [
        { estado: { corte: 1 }, texto: ['Con el aumento del ', v('a', `${a} %`), ' se paga el ', `${100 + a} %`, '.'], ecuacion: [inicio, ` × ${f(fa)} = ${sol(v1)}`] },
        { estado: { corte: 2 }, texto: ['El ', v('b', `${b} %`), ' se descuenta del precio ya aumentado.'], ecuacion: [`${sol(v1)} × ${f(fb)} = ${sol(v2)}`] },
        { estado: { corte: 2, final: true }, texto: ['En un solo paso, los factores se multiplican.'], ecuacion: [`${f(fa)} × ${f(fb)} = ${f(fa * fb)} del precio inicial`] },
      ];
    } else {
      pasos = [
        { estado: { corte: 1 }, texto: ['Primero se quita el ', v('a', `${a} %`), ': queda el ', `${100 - a} %`, '.'], ecuacion: [`100 % × ${f(fa)} = ${sol(v1)}`] },
        { estado: { corte: 2 }, texto: ['El ', v('b', `${b} %`), ` se quita del ${f(v1)} % que quedó.`], ecuacion: [`${sol(v1)} × ${f(fb)} = ${sol(v2)}`] },
        { estado: { corte: 2, final: true }, texto: ['El descuento único es lo que falta para llegar al 100 %.'], ecuacion: [`100 % − ${sol(v2)} = ${sol(correcta)}`] },
      ];
    }
    // Paso del arrastre: que la marca distinga cualquier par de alternativas (la mitad del menor hueco) y que
    // la barra tenga unas 150 posiciones. Tolerancia = un paso: así el valor exacto siempre es alcanzable.
    const escala = enPct ? 100 : Math.max(total, v1, v2);
    const vals = alternativas.map(x => x.valor);
    let hueco = Infinity;
    for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) hueco = Math.min(hueco, Math.abs(vals[i] - vals[j]));
    const paso = pasoBonito(Math.min(escala / 150, hueco / 2));
    const fantasmas = {};
    for (const x of alternativas) if (x.error) fantasmas[x.error.id] = { marca: x.valor, rotulo: ROTULOS[x.error.id] || '' };
    const verbo1 = tipo === 'aumento-descuento' ? 'gana' : 'pierde';
    return {
      escena: {
        pieza: 'barra-porcentaje', datos,
        alt: `Barra de ${sol(total)} que primero ${verbo1} el ${a} % y luego pierde el ${b} % de lo que queda`,
      },
      respuesta: { valor: correcta, unidad: enPct ? '%' : 'soles', tipo: 'arrastrar', control: 'marca', paso, tolerancia: paso },
      pasos,
      fantasmas,
    };
  }

  return { id: 'porcentajes-sucesivos', titulo: 'Aumentos y descuentos sucesivos', generar };
});
