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
        h('suma-descuentos', precio * (1 - (a + b) / 100), `Sumaste los descuentos (${a} % + ${b} % = ${a + b} %). El segundo descuento se aplica sobre un precio ya rebajado, así que descuenta menos soles que si fuera sobre el precio inicial.`),
        h('monto-descuento', precio - correcta, 'Calculaste cuánto se descuenta en total, pero la pregunta pide cuánto se paga.'),
        h('un-solo-descuento', precio * (1 - Math.max(a, b) / 100), 'Aplicaste un solo descuento. Hay que aplicar los dos, uno después del otro.'),
        h('promedio', precio * (1 - (a + b) / 200), 'Promediaste los porcentajes. Los descuentos sucesivos se multiplican, no se promedian.'),
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
        h('se-compensan', precio * (1 + (a - b) / 100), `Sumaste y restaste los porcentajes (+${a} % − ${b} % = ${a - b} %). El descuento se calcula sobre el precio ya aumentado, no sobre el inicial.${a === b ? ' Por eso subir y bajar el mismo porcentaje no devuelve el precio inicial: siempre baja.' : ''}`),
        h('solo-aumento', precio * (1 + a / 100), 'Aplicaste solo el aumento. Falta el descuento.'),
        h('solo-descuento', precio * (1 - b / 100), 'Aplicaste solo el descuento. Falta el aumento.'),
        h('monto-variacion', Math.abs(precio - correcta), 'Calculaste cuánto cambió el precio, pero la pregunta pide el precio nuevo.'),
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
        h('suma-descuentos', a + b, `Sumaste los porcentajes. El ${b} % se descuenta sobre un precio ya rebajado, así que vale menos que ${b} puntos del precio inicial.`),
        h('promedio', (a + b) / 2, 'Promediaste los porcentajes. Los descuentos sucesivos se combinan multiplicando lo que queda en cada paso.'),
        h('producto', a * b / 100, 'Multiplicaste los porcentajes entre sí. Lo que se multiplica son las partes que quedan (100 % − cada descuento).'),
        h('lo-que-queda', (1 - a / 100) * (1 - b / 100) * 100, 'Calculaste el porcentaje que se paga, no el que se descuenta. El descuento es 100 % menos lo que se paga.'),
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
      respuesta: { valor: correcta, unidad },
      _datos: { tipo, precio, a, b },
    };
  }

  return { id: 'porcentajes-sucesivos', titulo: 'Aumentos y descuentos sucesivos', generar };
});
