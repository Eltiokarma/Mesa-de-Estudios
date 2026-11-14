/*
 * Teoría de «Tanto por ciento y operaciones comerciales» (aritmetica.porcentajes). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 5), el microguion «cada porcentaje tiene una base»
 * de docs/teoria/fuentes/teoria-152-unidades.txt y docs/teoria/fuentes/historia-ecuaciones.pdf (pág. 50).
 * Errores: AR1–AR5 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que cada porcentaje muerde una base y que cambiar la base cambia el valor.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: calcula cambios encadenados, ganancias e impuestos e identifica la base de cada porcentaje sin ayuda.
 *   Orden de atención: 1.º la barra del total · 2.º el pedazo que cae y su base rotulada · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué dos descuentos del 20 % y 10 % no son un 30 %?».
 * Colores (regla 4): el total o base inicial naranja (c-o), el primer porcentaje turquesa (c-i), el segundo rojo (c-h),
 * el resultado verde (c-d). La pieza es barra-porcentaje en todas las ideas: una sola escala por figura.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const sol = n => `S/ ${f(n)}`;
  const B = { v: 'c-o', t: 'B' }, p = { v: 'c-i', t: 'p' }, q = { v: 'c-h', t: 'q' }, F = { v: 'c-d', t: 'F' };
  const P0 = { sub: [{ v: 'c-o', t: 'P' }, '0'] }, Pf = { sub: [{ v: 'c-d', t: 'P' }, 'f'] };
  const r1 = { sub: [{ v: 'c-i', t: 'r' }, '1'] }, r2 = { sub: [{ v: 'c-h', t: 'r' }, '2'] };
  const tau = { v: 'c-i', t: 'τ' };
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Opciones distintas: la correcta primero; se descartan distractores que repiten un valor. Hasta 4.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const barra = (total, tramos, extra = {}) => Object.assign({ total, prefijo: 'S/ ', decimales: 2, color: 'o', tramos }, extra);
  const des = (pct, color = 'i') => ({ tipo: 'descuento', pct, color });
  const aum = (pct, color = 'i') => ({ tipo: 'aumento', pct, color });

  // ---------- Idea 1: cada porcentaje tiene una base (tanto por cuanto) ----------
  // Cambia: el tamaño del pedazo según p y según la base. Permanece: la escala de la barra (S/ por px).
  // Progresa: de «p % de B» a «qué % de B es la parte». Se reserva: la parte que cabe un número entero de veces.
  // Debe verse: la parte medida contra su base, no contra 100.
  const base = {
    id: 'base',
    titulo: 'Cada porcentaje tiene una base',
    temas: ['Tanto por cuanto'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'Elige la base y el porcentaje. Mira qué pedazo de la barra se separa.',
      voz: 'Cambia la base sin tocar el porcentaje, y mira el pedazo.',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-o', min: 100, max: 400, paso: 50, inicio: 200, unidad: 'soles', decimales: 0 },
        { id: 'p', etiqueta: 'p', color: 'c-i', min: 5, max: 50, paso: 5, inicio: 20, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(v.B, [des(v.p)]), estado: { corte: 1 } }),
      lectura: v => [p, ` = ${f(v.p)} % de `, B, ` = ${sol(v.B)} → ${sol(v.p * v.B / 100)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Una parte de ', { v: 'c-i', t: 'S/ 20' }, ' sale de una base de ', { v: 'c-o', t: 'S/ 80' }, '. ¿Qué porcentaje de la base es?'],
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'parte', texto: '20 %', error: 'AT-PARTE', siFuera: 'Sería cierto si la base fuera S/ 100. Aquí la base es S/ 80.' },
        { id: 'invertido', texto: '400 %', error: 'AR3', siFuera: 'Eso divide la base entre la parte. El porcentaje compara la parte con la base.' },
        { id: 'resta', texto: '60 %', error: 'AT-RESTA', siFuera: '80 − 20 = 60 es lo que queda en soles, no un porcentaje.' },
      ],
      dibujo: { datos: barra(80, [des(25)]), estado: { corte: 0 } },
      revelar: { datos: barra(80, [des(25)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 20 cabe 4 veces en S/ 80, y 100 % entre 4 es 25 %.',
    },
    mira: {
      datos: barra(80, [des(25)]),
      pasos: [
        { estado: { corte: 0 }, texto: 'La base es el 100 %: aquí, S/ 80.', ecuacion: [B, ' = S/ 80 → 100 %'] },
        { estado: { corte: 1 }, texto: 'La parte de S/ 20 cabe 4 veces en la base.', ecuacion: [{ frac: ['80', '20'] }, ' = 4'] },
        { estado: { corte: 1 }, texto: 'Entonces es la cuarta parte del 100 %.', ecuacion: [p, ' = ', { frac: ['20', '80'] }, ' · 100 % = 25 %'] },
      ],
    },
    regla: {
      texto: 'Un porcentaje siempre es de una base: p % de B es p centésimos de B. Para saber qué porcentaje es una parte, se divide entre la base.',
      ecuacion: [p, ' % de ', B, ' = ', { frac: [p, '100'] }, ' · ', B, '   ·   ', p, ' = ', { frac: ['parte', B] }, ' · 100'],
      condicion: 'la base es la cantidad que vale 100 %; «a por cada b» es lo mismo que a/b de la base.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const Bv = r.de([40, 60, 80, 120, 150, 200, 250, 300]), pv = r.de([5, 10, 15, 20, 25, 30, 40]);
          const parte = Bv * pv / 100;
          return {
            pregunta: ['¿Cuánto es el ', { v: 'c-i', t: `${pv} %` }, ' de ', { v: 'c-o', t: sol(Bv) }, '?'],
            dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 0 } },
            opciones: opciones(parte, [
              { id: 'p', valor: pv, error: 'AT-PARTE', siFuera: `Sería cierto si la base fuera S/ 100. Aquí es ${sol(Bv)}.` },
              { id: 'resto', valor: Bv - parte, error: 'AR5', siFuera: 'Eso es lo que queda, no el pedazo pedido.' },
              { id: 'div', valor: Bv / pv, error: 'AT-DIVIDE', siFuera: `Eso divide ${f(Bv)} entre ${f(pv)}; falta el 100.` },
            ], sol),
            solucion: { texto: `${pv} centésimos de la base.`, ecuacion: [{ frac: [String(pv), '100'] }, ` · ${f(Bv)} = ${sol(parte)}`], dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 1 } } },
          };
        }
        if (tipo === 1) {
          const Bv = r.de([40, 50, 80, 120, 160, 200]), pv = r.de([10, 20, 25, 40, 50, 75]);
          const parte = Bv * pv / 100;
          return {
            pregunta: ['Una parte de ', { v: 'c-i', t: sol(parte) }, ' sale de una base de ', { v: 'c-o', t: sol(Bv) }, '. ¿Qué porcentaje de la base es?'],
            dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 0 } },
            opciones: opciones(pv, [
              { id: 'parte', valor: parte, error: 'AT-PARTE', siFuera: `Sería cierto si la base fuera S/ 100. Aquí es ${sol(Bv)}.` },
              { id: 'inv', valor: 100 * Bv / parte, error: 'AR3', siFuera: 'Eso divide la base entre la parte; se divide la parte entre la base.' },
              { id: 'resto', valor: 100 - pv, error: 'AR5', siFuera: 'Ese es el porcentaje de lo que queda.' },
            ], n => `${f(n)} %`),
            solucion: { texto: 'La parte entre la base, por cien.', ecuacion: [{ frac: [f(parte), f(Bv)] }, ` · 100 = ${f(pv)} %`], dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 1 } } },
          };
        }
        const b = r.de([4, 5, 8, 10, 20, 25]), a = r.ent(1, b - 1), Bv = b * r.ent(4, 12);
        const parte = Bv * a / b;
        return {
          pregunta: [`De cada ${b} soles de una base de `, { v: 'c-o', t: sol(Bv) }, `, ${a} se separan. ¿Cuántos soles se separan?`],
          opciones: opciones(parte, [
            { id: 'a', valor: a, error: 'AT-PARTE', siFuera: `Sería cierto si la base fuera solo ${b} soles.` },
            { id: 'pct', valor: Bv * a / 100, error: 'AT-CIEN', siFuera: `Eso toma ${a} de cada 100, no de cada ${b}.` },
            { id: 'resto', valor: Bv - parte, error: 'AR5', siFuera: 'Eso es lo que queda, no lo que se separa.' },
          ], sol),
          solucion: { texto: `«${a} por cada ${b}» es ${a}/${b} de la base.`, ecuacion: [{ frac: [String(a), String(b)] }, ` · ${f(Bv)} = ${sol(parte)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: descuentos sucesivos, cada uno sobre lo que quedó ----------
  // Cambia: la base del segundo porcentaje (ya no es el total). Permanece: la escala en soles y el contorno de S/ 200.
  // Progresa: corte 1 → corte 2 → final, cada pedazo cae a su fila. Se reserva: la cota «base S/ 160» del segundo paso.
  // Debe verse: el segundo pedazo es más chico que «10 % de 200».
  const sucesivos = {
    id: 'sucesivos',
    titulo: 'El segundo muerde lo que quedó',
    temas: ['Aumentos y descuentos sucesivos'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'Un precio de S/ 200 recibe dos descuentos seguidos. Elige cada uno y mira qué base usa el segundo.',
      voz: 'Fíjate en la cota de arriba: es la base del segundo descuento.',
      controles: [
        { id: 'a', etiqueta: '1.º', color: 'c-i', min: 5, max: 50, paso: 5, inicio: 20, unidad: '%', decimales: 0 },
        { id: 'b', etiqueta: '2.º', color: 'c-h', min: 5, max: 50, paso: 5, inicio: 10, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(200, [des(v.a), des(v.b, 'h')]), estado: { corte: 2 } }),
      lectura: v => [`Base del 2.º: ${sol(200 * (1 - v.a / 100))} · final ${sol(200 * (1 - v.a / 100) * (1 - v.b / 100))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Una casaca de ', { v: 'c-o', t: 'S/ 500' }, ' tiene un descuento del ', { v: 'c-i', t: '20 %' }, ' y después otro del ', { v: 'c-h', t: '30 %' }, '. ¿Cuánto se paga?'],
      opciones: [
        { id: 'c', texto: 'S/ 280', correcta: true },
        { id: 'suma', texto: 'S/ 250', error: 'AR1', siFuera: 'Sería cierto si los dos descuentos fueran sobre S/ 500. El segundo es sobre S/ 400.' },
        { id: 'monto', texto: 'S/ 220', error: 'AR5', siFuera: 'S/ 220 es lo que se descuenta en total, no lo que se paga.' },
        { id: 'uno', texto: 'S/ 400', error: 'AR5', siFuera: 'Ese es el precio después del primer descuento; falta el segundo.' },
      ],
      dibujo: { datos: barra(500, [des(20), des(30, 'h')]), estado: { corte: 0 } },
      revelar: { datos: barra(500, [des(20), des(30, 'h')]), estado: { corte: 2, final: true, fantasma: { marca: 250, rotulo: 'sumando' } } },
      coincide: 'Coincide: el 30 % se quita de S/ 400, no de S/ 500.',
    },
    mira: {
      datos: barra(500, [des(20), des(30, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'El precio inicial es la primera base.', ecuacion: [P0, ' = S/ 500'] },
        { estado: { corte: 1 }, texto: 'Primer descuento: 20 % de S/ 500 = S/ 100. Quedan S/ 400.', ecuacion: ['500 · 0,80 = 400'] },
        { estado: { corte: 2 }, texto: 'Segundo descuento: 30 % de S/ 400 = S/ 120.', ecuacion: ['400 · 0,70 = 280'] },
        { estado: { corte: 2, final: true, fantasma: { marca: 250, rotulo: 'sumando' } }, texto: 'Se paga el 56 % del precio: el descuento único es 44 %, no 50 %.', ecuacion: [Pf, ' = 500 · 0,80 · 0,70 = S/ 280'] },
      ],
    },
    regla: {
      texto: 'Cada cambio multiplica lo que dejó el anterior. Un descuento r deja el factor 1 − r; un aumento r, el factor 1 + r.',
      ecuacion: [Pf, ' = ', P0, ' (1 − ', r1, ')(1 − ', r2, ')'],
      condicion: 'cada porcentaje se aplica sobre el resultado anterior. El orden de los descuentos no cambia el final, sí cada monto.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), P = r.de([200, 300, 400, 500, 600, 800, 1000]);
        const a = r.de([10, 20, 25, 30, 40]), b = r.de([10, 20, 25, 30, 50]);
        const sube = s % 4 === 3;   // a veces el primer cambio es un aumento
        const t1 = sube ? aum(a) : des(a), t2 = des(b, 'h');
        const fin = P * (sube ? 1 + a / 100 : 1 - a / 100) * (1 - b / 100);
        const suma = P * (1 + (sube ? a : -a) / 100 - b / 100);
        return {
          pregunta: ['Un precio de ', { v: 'c-o', t: sol(P) }, sube ? ' sube ' : ' baja ', { v: 'c-i', t: `${a} %` }, ' y después baja ', { v: 'c-h', t: `${b} %` }, '. ¿Cuál es el precio final?'],
          dibujo: { datos: barra(P, [t1, t2]), estado: { corte: 0 } },
          opciones: opciones(fin, [
            { id: 'suma', valor: suma, error: sube && a === b ? 'AR2' : 'AR1', siFuera: 'Eso aplica los dos porcentajes sobre el precio inicial. El segundo va sobre lo nuevo.' },
            { id: 'monto', valor: P - fin, error: 'AR5', siFuera: 'Ese es el cambio total, no el precio final.' },
            { id: 'uno', valor: P * (sube ? 1 + a / 100 : 1 - a / 100), error: 'AR5', siFuera: 'Ese es el precio después del primer cambio; falta el segundo.' },
          ], sol),
          solucion: {
            texto: 'Cada factor multiplica lo que dejó el anterior.',
            ecuacion: [`${f(P)} · ${f(sube ? 1 + a / 100 : 1 - a / 100)} · ${f(1 - b / 100)} = ${sol(fin)}`],
            dibujo: { datos: barra(P, [t1, t2]), estado: { corte: 2, final: true } },
          },
        };
      },
    },
  };

  // ---------- Idea 3: variación porcentual (subir y bajar lo mismo no se anula) ----------
  // Cambia: r, que sube y luego baja. Permanece: la base inicial de S/ 500 como contorno.
  // Progresa: la barra crece, luego pierde más de lo que ganó. Se reserva: la diferencia final de r² con signo.
  // Debe verse: el final queda bajo el contorno del inicio.
  const variacion = {
    id: 'variacion',
    titulo: 'Subir y bajar no se anulan',
    temas: ['Variación porcentual'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'Un precio de S/ 500 sube r % y después baja el mismo r %. Elige r y compara el final con el inicio.',
      voz: 'Mira dónde termina la barra frente al contorno del inicio.',
      controles: [{ id: 'r', etiqueta: 'r', color: 'c-i', min: 10, max: 50, paso: 10, inicio: 20, unidad: '%', decimales: 0 }],
      dibujo: v => ({ datos: barra(500, [aum(v.r), des(v.r, 'h')]), estado: { corte: 2 } }),
      lectura: v => [`Final ${sol(500 * (1 + v.r / 100) * (1 - v.r / 100))} · cambio ${f(-v.r * v.r / 100)} %`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un sueldo subió ', { v: 'c-i', t: '25 %' }, '. ¿Qué porcentaje debe bajar el nuevo sueldo para volver al de antes?'],
      opciones: [
        { id: 'c', texto: '20 %', correcta: true },
        { id: 'igual', texto: '25 %', error: 'AR3', siFuera: 'Sería cierto si se bajara sobre el sueldo de antes. Se baja sobre el nuevo, que es mayor.' },
        { id: 'factor', texto: '75 %', error: 'AR4', siFuera: '75 % es el factor 0,75 escrito como descuento; se descuenta 1 − 0,80.' },
        { id: 'cien', texto: '125 %', error: 'AR4', siFuera: '125 % es el sueldo nuevo comparado con el viejo, no lo que baja.' },
      ],
      dibujo: { datos: barra(400, [aum(25), des(20, 'h')]), estado: { corte: 1 } },
      revelar: { datos: barra(400, [aum(25), des(20, 'h')]), estado: { corte: 2 } },
      coincide: 'Coincide: S/ 100 de S/ 500 es el 20 %.',
    },
    mira: {
      datos: barra(400, [aum(25), des(20, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'Tomemos un sueldo de S/ 400 como ejemplo.', ecuacion: [P0, ' = S/ 400'] },
        { estado: { corte: 1 }, texto: 'Sube 25 % de 400: S/ 100. Ahora es S/ 500.', ecuacion: ['400 · 1,25 = 500'] },
        { estado: { corte: 2 }, texto: 'Para volver hay que quitar los mismos S/ 100, pero de S/ 500.', ecuacion: [{ frac: ['100', '500'] }, ' = 20 %'] },
      ],
    },
    regla: {
      texto: 'La variación porcentual compara el cambio con el valor inicial. Por eso subir y bajar el mismo r deja 1 − r² del inicio.',
      ecuacion: ['variación = ', { frac: [['final − ', P0], P0] }, ' · 100   ·   (1 + r)(1 − r) = 1 − ', { sup: ['r', '2'] }],
      condicion: 'el valor inicial no es cero. Para deshacer un cambio se divide entre su factor, no se resta el mismo porcentaje.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const P = r.de([200, 400, 500, 800, 1000]), rr = r.de([10, 20, 30, 40, 50]);
          const fin = P * (1 + rr / 100) * (1 - rr / 100), v = 100 * (fin - P) / P;
          return {
            pregunta: ['Un precio de ', { v: 'c-o', t: sol(P) }, ' sube ', { v: 'c-i', t: `${rr} %` }, ' y luego baja ', { v: 'c-h', t: `${rr} %` }, '. ¿Cuál es la variación porcentual total?'],
            dibujo: { datos: barra(P, [aum(rr), des(rr, 'h')]), estado: { corte: 0 } },
            opciones: opciones(v, [
              { id: 'cero', valor: 0, error: 'AR2', siFuera: 'Sería cierto si las dos veces la base fuera la misma. La bajada usa el precio ya subido.' },
              { id: 'sube', valor: -v, error: 'AT-SIGNO', siFuera: 'El final queda debajo del inicio: la variación es negativa.' },
              { id: 'doble', valor: -2 * rr, error: 'AR1', siFuera: 'Eso suma dos bajadas; aquí una sube y la otra baja.' },
            ], n => `${f(n)} %`),
            solucion: { texto: `Queda ${f(1 - rr * rr / 10000, 4)} del inicio.`, ecuacion: [`(1 + ${f(rr / 100)})(1 − ${f(rr / 100)}) = ${f(1 - rr * rr / 10000, 4)}`], dibujo: { datos: barra(P, [aum(rr), des(rr, 'h')]), estado: { corte: 2, final: true } } },
          };
        }
        const P = r.de([200, 250, 400, 500, 800]), fin = P * r.de([0.6, 0.75, 0.8, 1.2, 1.25, 1.5]);
        const v = 100 * (fin - P) / P;
        return {
          pregunta: ['Un precio pasó de ', { v: 'c-o', t: sol(P) }, ' a ', { v: 'c-d', t: sol(fin) }, '. ¿Cuál es la variación porcentual?'],
          opciones: opciones(v, [
            { id: 'base-final', valor: 100 * (fin - P) / fin, error: 'AR3', siFuera: 'Eso divide entre el precio final. La variación se mide contra el inicial.' },
            { id: 'soles', valor: fin - P, error: 'AR5', siFuera: 'Ese es el cambio en soles, no en porcentaje.' },
            { id: 'razon', valor: 100 * fin / P, error: 'AR4', siFuera: 'Eso es el final como porcentaje del inicio, no el cambio.' },
          ], n => `${n > 0 ? '+' : ''}${f(n)} %`),
          solucion: { texto: 'El cambio entre el valor inicial.', ecuacion: [{ frac: [`${f(fin)} − ${f(P)}`, f(P)] }, ` · 100 = ${f(v)} %`] },
        };
      },
    },
  };

  // ---------- Idea 4: costo, lista, venta, ganancia y pérdida ----------
  // Cambia: la marca sobre el costo y el descuento sobre la lista. Permanece: el costo como contorno de referencia.
  // Progresa: costo → lista → venta. Se reserva: la ganancia medida contra el costo, no contra la venta.
  // Debe verse: si la venta queda bajo el contorno del costo, es pérdida.
  const comercio = {
    id: 'costo-venta',
    titulo: 'Costo, lista, venta y ganancia',
    temas: ['Precio de costo, de lista y de venta', 'Ganancia y pérdida'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'Un producto cuesta S/ 200. Se le sube un porcentaje para el precio de lista y luego se rebaja. Busca una pérdida.',
      voz: 'El contorno punteado es el costo. ¿La venta lo pasa?',
      controles: [
        { id: 'm', etiqueta: 'Sube', color: 'c-i', min: 10, max: 60, paso: 10, inicio: 40, unidad: '%', decimales: 0 },
        { id: 'd', etiqueta: 'Rebaja', color: 'c-h', min: 10, max: 50, paso: 10, inicio: 20, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(200, [aum(v.m), des(v.d, 'h')]), estado: { corte: 2 } }),
      lectura: v => { const g = 200 * (1 + v.m / 100) * (1 - v.d / 100) - 200; return [`Venta ${sol(200 + g)} · ${g >= 0 ? 'gana' : 'pierde'} ${sol(Math.abs(g))}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se compró a ', { v: 'c-o', t: 'S/ 200' }, ' y se vendió a ', { v: 'c-d', t: 'S/ 250' }, '. ¿Qué porcentaje del costo se ganó?'],
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'venta', texto: '20 %', error: 'AR3', siFuera: '20 % sería la ganancia sobre la venta. Se pidió sobre el costo, S/ 200.' },
        { id: 'soles', texto: '50 %', error: 'AR5', siFuera: '50 es la ganancia en soles, no un porcentaje.' },
        { id: 'razon', texto: '125 %', error: 'AR4', siFuera: '125 % es la venta comparada con el costo; la ganancia es lo que pasa del 100 %.' },
      ],
      dibujo: { datos: barra(200, [aum(25)]), estado: { corte: 0 } },
      revelar: { datos: barra(200, [aum(25)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 50 sobre S/ 200 es la cuarta parte, 25 %.',
    },
    mira: {
      datos: barra(200, [aum(40), des(20, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'El costo es S/ 200: la base de la ganancia.', ecuacion: [{ sub: ['P', 'c'] }, ' = S/ 200'] },
        { estado: { corte: 1 }, texto: 'Precio de lista: sube 40 % sobre el costo.', ecuacion: [{ sub: ['P', 'L'] }, ' = 200 · 1,40 = 280'] },
        { estado: { corte: 2 }, texto: 'Venta: rebaja 20 % sobre la lista, no sobre el costo.', ecuacion: [{ sub: ['P', 'v'] }, ' = 280 · 0,80 = 224'] },
        { estado: { corte: 2, final: true }, texto: 'Gana S/ 24, que es el 12 % del costo.', ecuacion: ['G = 224 − 200 = 24 → ', { frac: ['24', '200'] }, ' = 12 %'] },
      ],
    },
    regla: {
      texto: 'La ganancia es la venta menos el costo. En porcentaje se divide entre el costo, salvo que el problema diga otra base.',
      ecuacion: ['G = ', { sub: ['P', 'v'] }, ' − ', { sub: ['P', 'c'] }, '   ·   G % = ', { frac: ['G', { sub: ['P', 'c'] }] }, ' · 100'],
      condicion: 'si G sale negativa es pérdida. La rebaja se calcula sobre el precio de lista, que es otra base.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), C = r.de([100, 200, 250, 400, 500]), m = r.de([20, 25, 40, 50, 60]), d = r.de([10, 20, 25]);
        const L = C * (1 + m / 100), V = L * (1 - d / 100), G = V - C;
        if (s % 2 === 0) return {
          pregunta: ['Cuesta ', { v: 'c-o', t: sol(C) }, ', se lista ', { v: 'c-i', t: `${m} %` }, ' más caro y se vende con rebaja del ', { v: 'c-h', t: `${d} %` }, '. ¿A cuánto se vende?'],
          dibujo: { datos: barra(C, [aum(m), des(d, 'h')]), estado: { corte: 0 } },
          opciones: opciones(V, [
            { id: 'resta', valor: C * (1 + (m - d) / 100), error: 'AR1', siFuera: 'Eso aplica la rebaja sobre el costo. La rebaja va sobre la lista.' },
            { id: 'lista', valor: L, error: 'AR5', siFuera: 'Ese es el precio de lista, antes de la rebaja.' },
            { id: 'ganancia', valor: G, error: 'AR5', siFuera: 'Esa es la ganancia, no el precio de venta.' },
          ], sol),
          solucion: { texto: 'Primero la lista; la rebaja va sobre la lista.', ecuacion: [`${f(C)} · ${f(1 + m / 100)} · ${f(1 - d / 100)} = ${sol(V)}`], dibujo: { datos: barra(C, [aum(m), des(d, 'h')]), estado: { corte: 2, final: true } } },
        };
        const Vv = C * r.de([0.8, 0.9, 1.1, 1.2, 1.25, 1.5]), Gv = Vv - C;
        return {
          pregunta: ['Se compra a ', { v: 'c-o', t: sol(C) }, ' y se vende a ', { v: 'c-d', t: sol(Vv) }, '. ¿Qué porcentaje del costo se gana o se pierde?'],
          opciones: opciones(100 * Gv / C, [
            { id: 'venta', valor: 100 * Gv / Vv, error: 'AR3', siFuera: 'Eso divide entre la venta. La base pedida es el costo.' },
            { id: 'soles', valor: Gv, error: 'AR5', siFuera: 'Ese es el monto en soles, no el porcentaje.' },
            { id: 'signo', valor: -100 * Gv / C, error: 'AT-SIGNO', siFuera: Gv > 0 ? 'Vende por encima del costo: es ganancia.' : 'Vende por debajo del costo: es pérdida.' },
          ], n => (n > 0 ? `gana ${f(n)} %` : `pierde ${f(-n)} %`)),
          solucion: { texto: 'Lo que gana o pierde, entre el costo.', ecuacion: [{ frac: [`${f(Vv)} − ${f(C)}`, f(C)] }, ` · 100 = ${f(100 * Gv / C)} %`] },
        };
      },
    },
  };

  // ---------- Idea 5: el impuesto se suma a la base; se quita dividiendo ----------
  // Cambia: la base B y la tasa τ. Permanece: el total con impuesto como barra que pasa del contorno.
  // Progresa: B → B(1 + τ) → de vuelta a B dividiendo. Se reserva: el fantasma de «quitar el 18 % del total».
  // Debe verse: quitar τ % del total cae por debajo de la base.
  const igv = {
    id: 'igv',
    titulo: 'El impuesto se quita dividiendo',
    temas: ['IGV'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'Elige la base sin impuesto y la tasa que da el problema. Mira cuánto se agrega y el total.',
      voz: 'La tasa siempre se toma de la base, no del total.',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-o', min: 100, max: 500, paso: 50, inicio: 200, unidad: 'soles', decimales: 0 },
        { id: 't', etiqueta: 'τ', color: 'c-i', min: 10, max: 20, paso: 2, inicio: 18, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(v.B, [aum(v.t)]), estado: { corte: 1 } }),
      lectura: v => [`Impuesto ${sol(v.B * v.t / 100)} · total ${sol(v.B * (1 + v.t / 100))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un precio con IGV del ', { v: 'c-i', t: '18 %' }, ' incluido es ', { v: 'c-d', t: 'S/ 236' }, '. ¿Cuál es el precio sin IGV?'],
      opciones: [
        { id: 'c', texto: 'S/ 200', correcta: true },
        { id: 'resta-pct', texto: 'S/ 193,52', error: 'AR3', siFuera: 'Eso quita el 18 % de S/ 236. El 18 % se calculó sobre la base, que es menor.' },
        { id: 'resta-18', texto: 'S/ 218', error: 'AT-PARTE', siFuera: 'Eso resta 18 soles: sería cierto si la base fuera S/ 100.' },
        { id: 'suma', texto: 'S/ 278,48', error: 'AT-SENTIDO', siFuera: 'Eso vuelve a sumar el impuesto. Aquí hay que quitarlo.' },
      ],
      dibujo: { datos: barra(200, [aum(18)]), estado: { corte: 0 } },
      revelar: { datos: barra(200, [aum(18)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 200 más su 18 % da S/ 236.',
    },
    mira: {
      datos: barra(200, [aum(18)]),
      pasos: [
        { estado: { corte: 0 }, texto: 'La base sin impuesto es lo que buscamos.', ecuacion: [B, ' = ?'] },
        { estado: { corte: 1 }, texto: 'El total es la base más el 18 % de la base.', ecuacion: [B, ' · 1,18 = 236'] },
        { estado: { corte: 1 }, texto: 'Se deshace dividiendo entre el mismo factor.', ecuacion: [B, ' = ', { frac: ['236', '1,18'] }, ' = S/ 200'] },
      ],
    },
    regla: {
      texto: 'Un impuesto de tasa τ se calcula sobre la base: el total es la base por 1 + τ. Para recuperar la base, se divide entre 1 + τ.',
      ecuacion: ['total = ', B, ' (1 + ', tau, ')   ·   ', B, ' = ', { frac: ['total', ['1 + ', tau]] }],
      condicion: 'τ es la tasa que da el enunciado. Quitar τ % del total no devuelve la base.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), Bv = r.de([100, 150, 200, 250, 300, 400, 500, 1000]), tv = r.de([18, 18, 10, 20]);
        const total = Bv * (1 + tv / 100);
        if (s % 2 === 0) return {
          pregunta: ['Un precio con impuesto del ', { v: 'c-i', t: `${tv} %` }, ' incluido es ', { v: 'c-d', t: sol(total) }, '. ¿Cuál es el precio sin impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          opciones: opciones(Bv, [
            { id: 'resta-pct', valor: total * (1 - tv / 100), error: 'AR3', siFuera: `Eso quita el ${tv} % del total; el impuesto se calculó sobre la base.` },
            { id: 'resta', valor: total - tv, error: 'AT-PARTE', siFuera: `Eso resta ${tv} soles; sería cierto si la base fuera S/ 100.` },
            { id: 'suma', valor: total * (1 + tv / 100), error: 'AT-SENTIDO', siFuera: 'Eso vuelve a sumar el impuesto.' },
          ], sol),
          solucion: { texto: 'Se divide entre el factor del impuesto.', ecuacion: [{ frac: [f(total), f(1 + tv / 100)] }, ` = ${sol(Bv)}`], dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1, final: true } } },
        };
        return {
          pregunta: ['Un producto vale ', { v: 'c-o', t: sol(Bv) }, ' sin impuesto. Con un impuesto del ', { v: 'c-i', t: `${tv} %` }, ', ¿cuánto es el impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          opciones: opciones(Bv * tv / 100, [
            { id: 'total', valor: total, error: 'AR5', siFuera: 'Ese es el total con impuesto, no el impuesto.' },
            { id: 'del-total', valor: total * tv / 100, error: 'AR3', siFuera: 'Eso toma la tasa del total; la tasa va sobre la base.' },
            { id: 'tasa', valor: tv, error: 'AT-PARTE', siFuera: 'Sería cierto si la base fuera S/ 100.' },
          ], sol),
          solucion: { texto: 'La tasa por la base.', ecuacion: [`${f(tv / 100)} · ${f(Bv)} = ${sol(Bv * tv / 100)}`], dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1 } } },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.porcentajes',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/barra-porcentaje.js'],
    historia: {
      texto: 'Los comerciantes del Mediterráneo comparaban monedas, pesos y medidas que no eran iguales en cada ciudad. La Summa de Luca Pacioli, impresa en 1494, reunió la aritmética práctica de su tiempo: proporciones, cambios y contabilidad. No inventó esas técnicas; las ordenó. Expresar todo «por cada cien» fue una manera de comparar sobre una base común.',
      pregunta: '¿Cómo compararías dos precios en monedas distintas?',
      fuente: { titulo: 'O’Connor y Robertson, Luca Pacioli — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Pacioli/' },
    },
    ideas: [base, sucesivos, variacion, comercio, igv],
  };
});
