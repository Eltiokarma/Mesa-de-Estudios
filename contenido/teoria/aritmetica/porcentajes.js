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
 *   Duda que resuelve: «¿por qué dos descuentos del 20 % y 10 % no son un 30 %?».
 * Colores (regla 4): el total o base inicial naranja (c-o), el primer porcentaje turquesa (c-i), el segundo rojo (c-h),
 * el resultado verde (c-d). La pieza es barra-porcentaje en todas las ideas: una sola escala por figura.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // El separador de miles va con espacio duro: «S/ 1 566» no se parte en dos líneas (tipografía, docs/teoria.md §4b).
  const f = (n, d = 2) => Kit.formatear(n, d).replace(/ /g, '\u00a0');
  const sol = n => `S/ ${f(n)}`;
  const B = { v: 'c-o', t: 'B' }, p = { v: 'c-i', t: 'p' }, q = { v: 'c-h', t: 'q' }, F = { v: 'c-d', t: 'F' };
  const P0 = { sub: [{ v: 'c-o', t: 'P' }, '0'] }, Pf = { sub: [{ v: 'c-d', t: 'P' }, 'f'] };
  const r1 = { sub: [{ v: 'c-i', t: 'r' }, '1'] }, r2 = { sub: [{ v: 'c-h', t: 'r' }, '2'] };
  const tau = { v: 'c-i', t: 'τ' }, rr = { v: 'c-i', t: 'r' };
  const Pc = { sub: [{ v: 'c-o', t: 'P' }, 'c'] };
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
  // Gesto directo (docs/teoria.md §4b): la manija va donde la barra o un pedazo termina, en coordenadas de la pieza.
  // fr(datos, px) es la fracción de la escala (el valor mayor de la barra) que hay bajo el dedo: la barra se dibuja
  // siempre a lo ancho de su valor mayor, así que la fracción no depende de la escala y la cuenta inversa es exacta.
  const BP = () => Kit.piezas['barra-porcentaje'];
  const fr = (datos, px) => { const g = BP().geometria(datos); return g.deX(px) / g.escala; };
  const enBarra = (datos, valor) => { const g = BP().geometria(datos); return { x: g.x(valor), y: g.barraY + g.barraH / 2 }; };
  const enFila = (datos, i, valor) => { const g = BP().geometria(datos); return { x: g.x(valor), y: g.filaY(i) + g.piezaH / 2 }; };
  const valoresDe = datos => BP().geometria(datos).v;
  // Laboratorio: tres cambios con signo (+ sube, − baja) sobre P₀, cada uno con su color de pedazo.
  const cambio = (c, color) => (c >= 0 ? aum(c, color) : des(-c, color));
  // Escala fija en 2 · P₀: arrastrar un pedazo no cambia la regla bajo el dedo (si el final pasa de 2 · P₀, manda él).
  const cadena = v => barra(v.P, [cambio(v.c1, 'i'), cambio(v.c2, 'h'), cambio(v.c3, 'd')], { escala: 2 * v.P });
  // Lo que leen la lectura y los retos de las mesas (la misma barra que dibuja).
  const finCadena = v => valoresDe(cadena(v))[3];
  const varTotal = v => 100 * (finCadena(v) - v.P) / v.P;
  const casi = (u, w) => Math.abs(u - w) < 1e-9;
  const venta = v => v.C * (1 + v.m / 100) * (1 - v.d / 100);
  const ganPct = v => 100 * (venta(v) - v.C) / v.C;
  const pasos5 = (lo, hi) => Array.from({ length: (hi - lo) / 5 + 1 }, (_, i) => lo + 5 * i);
  const MAX_G20 = Math.max(...pasos5(5, 100).flatMap(m => pasos5(20, 60).map(d => ganPct({ C: 100, m, d }))));
  const conSigno = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${f(Math.abs(n))} %`;

  // ---------- Idea 1: cada porcentaje tiene una base (tanto por cuanto) ----------
  // Cambia: el tamaño del pedazo según p y según la base. Permanece: la escala de la barra (S/ por px).
  // Progresa: de «p % de B» a «qué % de B es la parte». Se reserva: la parte que cabe un número entero de veces.
  // Debe verse: la parte medida contra su base, no contra 100.
  const base = {
    id: 'base',
    titulo: 'Cada porcentaje tiene una base',
    temas: ['Tanto por cuanto'],
    pieza: 'barra-porcentaje',
    // Lee (fase 2): vocabulario y contexto; no dice cómo se halla qué porcentaje es una parte (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Por cada cien', texto: 'En una tienda de Juliaca ves el cartel «20 % menos». Por ciento quiere decir «por cada cien»: de cada S/ 100 del precio te quitan S/ 20. El símbolo % se lee «por ciento».' },
        { titulo: 'De qué es', texto: 'Todo porcentaje se toma de una cantidad: esa es la base del porcentaje, y vale el 100 %. El 10 % de una propina y el 10 % del precio de una moto no son lo mismo.',
          ecuacion: [B, ' = 100 %'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la barra naranja es la base. Cambia la base sin tocar el porcentaje y mira cuánto mide el pedazo turquesa que se separa.' },
      ],
    },
    juega: {
      consigna: 'Elige la base del porcentaje (lo que vale 100 %) y el porcentaje. Mira qué pedazo de la barra se separa.',
      voz: 'Cambia la base sin tocar el porcentaje, y mira el pedazo.',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-o', min: 100, max: 400, paso: 50, inicio: 200, decimales: 0 },
        { id: 'p', etiqueta: 'p', color: 'c-i', min: 5, max: 50, paso: 5, inicio: 20, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(v.B, [des(v.p)]), estado: { corte: 1 } }),
      lectura: v => [p, ` = ${f(v.p)} % de `, B, ` = ${sol(v.B)} → ${sol(v.p * v.B / 100)}`],
      minimo: 3,
      // Arrastra el corte: el final de lo que queda en la barra. Lo que se separa es p % de la base.
      arrastres: [{ id: 'corte', etiqueta: 'corte de la barra', color: 'c-i',
        donde: v => { const d = barra(v.B, [des(v.p)]); return enBarra(d, valoresDe(d)[1]); },
        mover: (pt, v) => ({ p: 100 * (1 - fr(barra(v.B, [des(v.p)]), pt.x)) }) }],
    },
    predice: {
      pregunta: ['Una parte de ', { v: 'c-i', t: 'S/ 20' }, ' sale de una base de ', { v: 'c-o', t: 'S/ 80' }, '. ¿Qué porcentaje de la base es?'],
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'parte', texto: '20 %', error: 'AT-PARTE', siFuera: 'Sería cierto si la base fuera S/ 100. Aquí la base es S/ 80.' },
        { id: 'invertido', texto: '400 %', error: 'AR3', siFuera: 'Eso divide la base entre la parte. El porcentaje compara la parte con la base.' },
        { id: 'resta', texto: '60 %', error: 'AT-RESTA', siFuera: '80 − 20 = 60 es lo que queda en soles, no un porcentaje.' },
      ],
      dibujo: { datos: barra(80, [des(25)]), estado: { corte: 0 } },
      revelar: { datos: barra(80, [des(25)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 20 cabe 4 veces en S/ 80, y 100 % entre 4 es 25 %.',
    },
    mira: {
      datos: barra(80, [des(25)]),
      pasos: [
        { estado: { corte: 0 }, texto: 'La base es el 100 %: aquí, S/ 80.', ecuacion: [B, ' = S/ 80 → 100 %'] },
        { estado: { corte: 1 }, texto: 'La parte de S/ 20 cabe 4 veces en la base.', ecuacion: [{ frac: ['80', '20'] }, ' = 4'] },
        { estado: { corte: 1 }, texto: 'Entonces es la cuarta parte del 100 %.', ecuacion: [p, ' = ', { frac: ['20', '80'] }, ' · 100 % = 25 %'] },
      ],
    },
    regla: {
      texto: 'Un porcentaje siempre es de una base: p % de B es p centésimos de B. Para saber qué porcentaje es una parte, se divide entre la base.',
      ecuacion: [p, ' % de ', { llave: [B], nota: 'vale 100 %', color: 'c-o' }, ' = ', { frac: [p, '100'] }, ' · ', B, '   ·   ', p, ' = ', { frac: ['parte', B] }, ' · 100'],
      condicion: 'la base es la cantidad que vale 100 %; «a por cada b» es lo mismo que a/b de la base.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú», con otras semillas (azar(s + 900)).
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const Bv = r.de([40, 60, 80, 120, 150, 200, 250, 300]), pv = r.de([5, 10, 15, 20, 25, 30, 40]);
          const parte = Bv * pv / 100;
          return {
            enunciado: ['¿Cuánto es el ', { v: 'c-i', t: `${pv} %` }, ' de ', { v: 'c-o', t: sol(Bv) }, '?'],
            dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 0 } },
            pasos: [
              { tipo: 'pide', texto: ['Piden el pedazo que es el ', p, ` = ${pv} % de una base de ${sol(Bv)}.`] },
              { tipo: 'datos', texto: ['La base vale el 100 %: es ', B, ` = ${sol(Bv)}. El porcentaje es `, p, ` = ${pv} %.`] },
              { tipo: 'regla', texto: [`Un porcentaje se cuenta en centésimos de la base: ${pv} % quiere decir ${pv} de cada 100 partes de `, B, '.'], ecuacion: [p, ' % de ', B, ' = ', { frac: [p, '100'] }, ' · ', B] },
              { tipo: 'cuentas', texto: 'Multiplico los centésimos por la base.', ecuacion: [{ frac: [String(pv), '100'] }, ` · ${f(Bv)} = ${sol(parte)}`], dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 1 } } },
              { tipo: 'sentido', texto: pv === 10 ? `Por otro camino: el 10 % es la décima parte, ${f(Bv)} ÷ 10 = ${f(parte)}. Cuadra.` : `Por otro camino: el 10 % es ${sol(Bv / 10)}, y ${pv} % es ${f(pv / 10)} veces eso: ${f(pv / 10)} · ${f(Bv / 10)} = ${f(parte)}. Cuadra.` },
            ],
            respuesta: [`${pv} % de ${sol(Bv)} = `, { v: 'c-i', t: sol(parte) }],
          };
        }
        if (tipo === 1) {
          const Bv = r.de([40, 50, 80, 120, 160, 200]), pv = r.de([10, 20, 25, 40, 50, 75]);
          const parte = Bv * pv / 100;
          return {
            enunciado: ['Una parte de ', { v: 'c-i', t: sol(parte) }, ' sale de una base de ', { v: 'c-o', t: sol(Bv) }, '. ¿Qué porcentaje de la base es?'],
            dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 0 } },
            pasos: [
              { tipo: 'pide', texto: ['Piden qué porcentaje ', p, ` de la base es la parte de ${sol(parte)}.`] },
              { tipo: 'datos', texto: ['La base es ', B, ` = ${sol(Bv)}: vale el 100 %. La parte es ${sol(parte)}.`] },
              { tipo: 'regla', texto: 'Para saber qué porcentaje es, comparo la parte con la base: divido la parte entre la base y lo paso a cientos.', ecuacion: [p, ' = ', { frac: ['parte', B] }, ' · 100'] },
              { tipo: 'cuentas', texto: 'Divido y multiplico por 100.', ecuacion: [{ frac: [f(parte), f(Bv)] }, ` · 100 = ${f(pv)} %`], dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 1 } } },
              { tipo: 'sentido', texto: `De vuelta: el ${pv} % de ${sol(Bv)} es ${f(pv / 100)} · ${f(Bv)} = ${sol(parte)}, la parte del enunciado. Cuadra.` },
            ],
            respuesta: [p, ` = ${f(pv)} %`],
          };
        }
        const b = r.de([4, 5, 8, 10, 20, 25]), a = r.ent(2, b - 1), grupos = r.ent(4, 12), Bv = b * grupos;
        const parte = Bv * a / b;
        return {
          enunciado: [`De cada ${b} soles de una base de `, { v: 'c-o', t: sol(Bv) }, `, ${a} se separan. ¿Cuántos soles se separan?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden cuántos soles se separan de la base ', B, ` = ${sol(Bv)}.`] },
            { tipo: 'datos', texto: `De cada ${b} soles se separan ${a}. La base es ${sol(Bv)}.` },
            { tipo: 'regla', texto: `«${a} por cada ${b}» es un tanto por cuanto: la fracción ${a}/${b} de la base, como un porcentaje es «tanto por cada 100».`, ecuacion: [{ frac: [String(a), String(b)] }, ' · ', B] },
            { tipo: 'cuentas', texto: `En ${sol(Bv)} hay ${grupos} grupos de ${b} soles; de cada grupo salen ${a}.`, ecuacion: [{ frac: [String(a), String(b)] }, ` · ${f(Bv)} = ${sol(parte)}`] },
            { tipo: 'sentido', texto: `Comprueba: ${grupos} grupos por ${a} soles dan ${f(parte)}. Es menos que la base, porque ${a} es menos que ${b}.` },
          ],
          respuesta: `Se separan ${sol(parte)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const Bv = r.de([40, 60, 80, 120, 150, 200, 250, 300]), pv = r.de([5, 10, 15, 20, 25, 30, 40]);
          const parte = Bv * pv / 100;
          return {
            pregunta: ['¿Cuánto es el ', { v: 'c-i', t: `${pv} %` }, ' de ', { v: 'c-o', t: sol(Bv) }, '?'],
            dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 0 } },
            opciones: opciones(parte, [
              { id: 'p', valor: pv, error: 'AT-PARTE', siFuera: `Sería cierto si la base fuera S/ 100. Aquí es ${sol(Bv)}.` },
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
              { id: 'parte', valor: parte, error: 'AT-PARTE', siFuera: `Sería cierto si la base fuera S/ 100. Aquí es ${sol(Bv)}.` },
              { id: 'inv', valor: 100 * Bv / parte, error: 'AR3', siFuera: 'Eso divide la base entre la parte; se divide la parte entre la base.' },
              { id: 'resto', valor: 100 - pv, error: 'AR5', siFuera: 'Ese es el porcentaje de lo que queda.' },
            ], n => `${f(n)} %`),
            solucion: { texto: 'La parte entre la base, por cien.', ecuacion: [{ frac: [f(parte), f(Bv)] }, ` · 100 = ${f(pv)} %`], dibujo: { datos: barra(Bv, [des(pv)]), estado: { corte: 1 } } },
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
  // Cambia: la base del segundo porcentaje (ya no es el total). Permanece: la escala en soles y el contorno de S/ 200.
  // Progresa: corte 1 → corte 2 → final, cada pedazo cae a su fila. Se reserva: la cota «base S/ 160» del segundo paso.
  // Debe verse: el segundo pedazo es más chico que «10 % de 200».
  const sucesivos = {
    id: 'sucesivos',
    titulo: 'El segundo muerde lo que quedó',
    temas: ['Aumentos y descuentos sucesivos'],
    pieza: 'barra-porcentaje',
    // Lee: no dice sobre qué base cae el segundo descuento (eso se descubre al jugar y en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos rebajas', texto: 'En las ferias de fin de temporada ves carteles como «20 % + 10 %». Son dos descuentos seguidos: primero se aplica uno y después el otro.' },
        { titulo: 'Lo que pagas', texto: 'Quitar el 20 % de un precio es pagar el 80 % de ese precio. Por eso un descuento se puede escribir como una multiplicación: por 0,80.',
          ecuacion: ['100 % − 20 % = 80 % → · 0,80'] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada descuento deja su pedazo en una fila: turquesa el primero, rojo el segundo. La cota de arriba dice de qué base sale cada uno.' },
      ],
    },
    juega: {
      consigna: 'Un precio de S/ 200 recibe dos descuentos seguidos. Elige cada uno y mira qué base usa el segundo.',
      voz: 'Fíjate en la cota de arriba: es la base del segundo descuento.',
      controles: [
        { id: 'a', etiqueta: '1.º', color: 'c-i', min: 5, max: 50, paso: 5, inicio: 20, unidad: '%', decimales: 0 },
        { id: 'b', etiqueta: '2.º', color: 'c-h', min: 5, max: 50, paso: 5, inicio: 10, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(200, [des(v.a), des(v.b, 'h')]), estado: { corte: 2 } }),
      lectura: v => [`Base del 2.º: ${sol(200 * (1 - v.a / 100))} · final ${sol(200 * (1 - v.a / 100) * (1 - v.b / 100))}`],
      minimo: 3,
      // El primer corte vive en su pedazo (fila 1); el segundo, en el final de la barra. El segundo se mide sobre lo que dejó el primero.
      arrastres: [
        { id: 'primero', etiqueta: 'corte del primer descuento', color: 'c-i',
          donde: v => { const d = barra(200, [des(v.a), des(v.b, 'h')]); return enFila(d, 1, valoresDe(d)[1]); },
          mover: (pt, v) => ({ a: 100 * (1 - fr(barra(200, [des(v.a), des(v.b, 'h')]), pt.x)) }) },
        { id: 'segundo', etiqueta: 'corte del segundo descuento', color: 'c-h',
          donde: v => { const d = barra(200, [des(v.a), des(v.b, 'h')]); return enBarra(d, valoresDe(d)[2]); },
          mover: (pt, v) => ({ b: 100 * (1 - fr(barra(200, [des(v.a), des(v.b, 'h')]), pt.x) / (1 - v.a / 100)) }) },
      ],
    },
    predice: {
      pregunta: ['Una casaca de ', { v: 'c-o', t: 'S/ 500' }, ' tiene un descuento del ', { v: 'c-i', t: '20 %' }, ' y después otro del ', { v: 'c-h', t: '30 %' }, '. ¿Cuánto se paga?'],
      opciones: [
        { id: 'c', texto: 'S/ 280', correcta: true },
        { id: 'suma', texto: 'S/ 250', error: 'AR1', siFuera: 'Sería cierto si los dos descuentos fueran sobre S/ 500. El segundo es sobre S/ 400.' },
        { id: 'monto', texto: 'S/ 220', error: 'AR5', siFuera: 'S/ 220 es lo que se descuenta en total, no lo que se paga.' },
        { id: 'uno', texto: 'S/ 400', error: 'AR5', siFuera: 'Ese es el precio después del primer descuento; falta el segundo.' },
      ],
      dibujo: { datos: barra(500, [des(20), des(30, 'h')]), estado: { corte: 0 } },
      revelar: { datos: barra(500, [des(20), des(30, 'h')]), estado: { corte: 2, final: true, fantasma: { marca: 250, rotulo: 'sumando' } } },
      coincide: 'Coincide: el 30 % se quita de S/ 400, no de S/ 500.',
    },
    mira: {
      datos: barra(500, [des(20), des(30, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'El precio inicial es la primera base.', ecuacion: [P0, ' = S/ 500'] },
        { estado: { corte: 1 }, texto: 'Primer descuento: 20 % de S/ 500 = S/ 100. Quedan S/ 400.', ecuacion: ['500 · 0,80 = 400'] },
        { estado: { corte: 2 }, texto: 'Segundo descuento: 30 % de S/ 400 = S/ 120.', ecuacion: ['400 · 0,70 = 280'] },
        { estado: { corte: 2, final: true, fantasma: { marca: 250, rotulo: 'sumando' } }, texto: 'Se paga el 56 % del precio: el descuento único es 44 %, no 50 %.', ecuacion: [Pf, ' = 500 · 0,80 · 0,70 = S/ 280'] },
      ],
    },
    regla: {
      texto: 'En descuentos sucesivos, cada cambio multiplica lo que dejó el anterior. Un descuento r deja el factor 1 − r; un aumento r, el factor 1 + r.',
      ecuacion: [Pf, ' = ', { llave: [P0], nota: 'precio inicial', color: 'c-o' }, ' ', { llave: ['(1 − ', r1, ')(1 − ', r2, ')'], nota: 'factor por cambio', color: 'c-i' }],
      condicion: 'cada porcentaje se aplica sobre el resultado anterior. El orden de los descuentos no cambia el final, sí cada cantidad.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), P = r.de([200, 300, 400, 500, 600, 800, 1000]);
        const a = r.de([10, 20, 25, 30, 40]), b = r.de([10, 20, 25, 30, 50]);
        const sube = s % 4 === 3;
        const t1 = sube ? aum(a) : des(a), t2 = des(b, 'h');
        const fa = sube ? 1 + a / 100 : 1 - a / 100, fb = 1 - b / 100, m1 = P * fa, fin = m1 * fb;
        return {
          enunciado: ['Un precio de ', { v: 'c-o', t: sol(P) }, sube ? ' sube ' : ' baja ', { v: 'c-i', t: `${a} %` }, ' y después baja ', { v: 'c-h', t: `${b} %` }, '. ¿Cuál es el precio final?'],
          dibujo: { datos: barra(P, [t1, t2]), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden el precio final ', Pf, ', después de los dos cambios.'] },
            { tipo: 'datos', texto: ['Precio inicial ', P0, ` = ${sol(P)}. Primero ${sube ? 'sube' : 'baja'} `, r1, ` = ${a} %; luego baja `, r2, ` = ${b} %.`] },
            { tipo: 'regla', texto: 'Cada cambio se aplica a lo que dejó el anterior. Multiplico el precio por el factor de cada cambio, uno tras otro.',
              ecuacion: [Pf, ' = ', P0, ` (1 ${sube ? '+' : '−'} `, r1, ')(1 − ', r2, ')'] },
            { tipo: 'cuentas', texto: `Primer cambio: ${f(P)} · ${f(fa)} = ${f(m1)}. El segundo se calcula sobre ${sol(m1)}.`,
              ecuacion: [`${f(m1)} · ${f(fb)} = ${sol(fin)}`], dibujo: { datos: barra(P, [t1, t2]), estado: { corte: 2, final: true } } },
            { tipo: 'sentido', texto: `De vuelta: ${f(fin)} ÷ ${f(fb)} = ${f(m1)}, y ${f(m1)} ÷ ${f(fa)} = ${f(P)}, el precio inicial. Cuadra.` },
          ],
          respuesta: [Pf, ` = ${sol(fin)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), P = r.de([200, 300, 400, 500, 600, 800, 1000]);
        const a = r.de([10, 20, 25, 30, 40]), b = r.de([10, 20, 25, 30, 50]);
        const sube = s % 4 === 3;   // a veces el primer cambio es un aumento
        const t1 = sube ? aum(a) : des(a), t2 = des(b, 'h');
        const fin = P * (sube ? 1 + a / 100 : 1 - a / 100) * (1 - b / 100);
        const suma = P * (1 + (sube ? a : -a) / 100 - b / 100);
        return {
          pregunta: ['Un precio de ', { v: 'c-o', t: sol(P) }, sube ? ' sube ' : ' baja ', { v: 'c-i', t: `${a} %` }, ' y después baja ', { v: 'c-h', t: `${b} %` }, '. ¿Cuál es el precio final?'],
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
  // Cambia: r, que sube y luego baja. Permanece: la base inicial de S/ 500 como contorno.
  // Progresa: la barra crece, luego pierde más de lo que ganó. Se reserva: la diferencia final de r² con signo.
  // Debe verse: el final queda bajo el contorno del inicio.
  const variacion = {
    id: 'variacion',
    titulo: 'Subir y bajar no se anulan',
    temas: ['Variación porcentual'],
    pieza: 'barra-porcentaje',
    // Lee: vocabulario y signo; no dice contra qué valor se mide el cambio (eso decide Predice).
    lee: {
      tarjetas: [
        { titulo: 'Sube y baja', texto: 'El pasaje, el precio de la papa o un sueldo cambian todo el tiempo. Ese cambio, dicho en porcentaje, se llama variación porcentual.' },
        { titulo: 'Con signo', texto: 'Una variación de +10 % es una subida; una de −10 %, una bajada. Si un precio termina justo donde empezó, su variación total es 0 %.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la barra sube r % y después baja el mismo r %. El contorno punteado marca dónde estaba el inicio. Compara el final con ese contorno.' },
      ],
    },
    juega: {
      consigna: 'Un precio de S/ 500 sube r % y después baja el mismo r %. Elige r y compara el final con el inicio.',
      voz: 'Mira dónde termina la barra frente al contorno del inicio.',
      controles: [{ id: 'r', etiqueta: 'r', color: 'c-i', min: 10, max: 50, paso: 10, inicio: 20, unidad: '%', decimales: 0 }],
      dibujo: v => ({ datos: barra(500, [aum(v.r), des(v.r, 'h')]), estado: { corte: 2 } }),
      lectura: v => [`Final ${sol(500 * (1 + v.r / 100) * (1 - v.r / 100))} · cambio ${f(-v.r * v.r / 100)} %`],
      minimo: 3,
      // Arrastra el final de la barra: la bajada es r % de lo que había después de subir.
      arrastres: [{ id: 'final', etiqueta: 'final de la barra', color: 'c-i',
        donde: v => { const d = barra(500, [aum(v.r), des(v.r, 'h')]); return enBarra(d, valoresDe(d)[2]); },
        mover: (pt, v) => ({ r: 100 * (1 - fr(barra(500, [aum(v.r), des(v.r, 'h')]), pt.x)) }) }],
    },
    predice: {
      pregunta: ['Un sueldo subió ', { v: 'c-i', t: '25 %' }, '. ¿Qué porcentaje debe bajar el nuevo sueldo para volver al de antes?'],
      opciones: [
        { id: 'c', texto: '20 %', correcta: true },
        { id: 'igual', texto: '25 %', error: 'AR3', siFuera: 'Sería cierto si se bajara sobre el sueldo de antes. Se baja sobre el nuevo, que es mayor.' },
        { id: 'factor', texto: '75 %', error: 'AR4', siFuera: '75 % es el factor 0,75 escrito como descuento; se descuenta 1 − 0,80.' },
        { id: 'cien', texto: '125 %', error: 'AR4', siFuera: '125 % es el sueldo nuevo comparado con el viejo, no lo que baja.' },
      ],
      dibujo: { datos: barra(400, [aum(25), des(20, 'h')]), estado: { corte: 1 } },
      revelar: { datos: barra(400, [aum(25), des(20, 'h')]), estado: { corte: 2 } },
      coincide: 'Coincide: S/ 100 de S/ 500 es el 20 %.',
    },
    mira: {
      datos: barra(400, [aum(25), des(20, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'Tomemos S/ 400 de ejemplo: con cualquier sueldo pasa igual.', ecuacion: [P0, ' = S/ 400'] },
        { estado: { corte: 1 }, texto: 'Sube 25 % de 400: S/ 100. Ahora es S/ 500.', ecuacion: ['400 · 1,25 = 500'] },
        { estado: { corte: 2 }, texto: 'Para volver hay que quitar los mismos S/ 100, pero de S/ 500.', ecuacion: [{ frac: ['100', '500'] }, ' = 20 %'] },
      ],
    },
    regla: {
      texto: 'La variación porcentual compara el cambio con el valor inicial. Por eso subir y bajar el mismo r deja 1 − r² del inicio.',
      ecuacion: ['variación = ', { frac: [['final − ', P0], { llave: [P0], nota: 'el inicio', color: 'c-o' }] }, ' · 100', '   ·   ', '(1 + ', rr, ')(1 − ', rr, ') = ', { llave: ['1 − ', { sup: [rr, '2'] }], nota: 'menos que 1', color: 'c-i' }],
      condicion: 'el valor inicial no es cero. Para deshacer un cambio se divide entre su factor, no se resta el mismo porcentaje.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const reglaPaso = { tipo: 'regla', texto: 'Cada cambio multiplica lo que hay. La variación compara el cambio total con el valor del inicio, no con uno de en medio.',
          ecuacion: ['variación = ', { frac: [['final − ', P0], P0] }, ' · 100'] };
        if (s % 2 === 0) {
          const P = r.de([200, 400, 500, 800, 1000]), rv = r.de([10, 20, 30, 40, 50]);
          const sub = P * (1 + rv / 100), fin = sub * (1 - rv / 100), v = 100 * (fin - P) / P;
          return {
            enunciado: ['Un precio de ', { v: 'c-o', t: sol(P) }, ' sube ', { v: 'c-i', t: `${rv} %` }, ' y luego baja ', { v: 'c-h', t: `${rv} %` }, '. ¿Cuál es la variación porcentual total?'],
            dibujo: { datos: barra(P, [aum(rv), des(rv, 'h')]), estado: { corte: 0 } },
            pasos: [
              { tipo: 'pide', texto: 'Piden la variación porcentual total: cuánto cambió el precio, en porcentaje del inicio.' },
              { tipo: 'datos', texto: ['Inicio ', P0, ` = ${sol(P)}; sube ${rv} % y luego baja ${rv} %.`] },
              reglaPaso,
              { tipo: 'cuentas', texto: `Sube: ${f(P)} · ${f(1 + rv / 100)} = ${f(sub)}. Baja: ${f(sub)} · ${f(1 - rv / 100)} = ${f(fin)}.`,
                ecuacion: [{ frac: [`${f(fin)} − ${f(P)}`, f(P)] }, ` · 100 = ${f(v)} %`], dibujo: { datos: barra(P, [aum(rv), des(rv, 'h')]), estado: { corte: 2, final: true } } },
              { tipo: 'sentido', texto: `Sale negativa: la bajada se toma de ${sol(sub)}, que es más que el inicio. Comprueba con los factores.`,
                ecuacion: [`(1 + ${f(rv / 100)})(1 − ${f(rv / 100)}) = ${f(1 - rv * rv / 10000, 4)}`] },
            ],
            respuesta: `Variación total: ${f(v)} %`,
          };
        }
        const P = r.de([200, 250, 400, 500, 800]), fin = P * r.de([0.6, 0.75, 0.8, 1.2, 1.25, 1.5]);
        const v = 100 * (fin - P) / P, sube = fin > P;
        return {
          enunciado: ['Un precio pasó de ', { v: 'c-o', t: sol(P) }, ' a ', { v: 'c-d', t: sol(fin) }, '. ¿Cuál es la variación porcentual?'],
          pasos: [
            { tipo: 'pide', texto: 'Piden la variación porcentual: el cambio del precio comparado con el precio de antes.' },
            { tipo: 'datos', texto: ['Antes ', P0, ` = ${sol(P)}; después ${sol(fin)}.`] },
            reglaPaso,
            { tipo: 'cuentas', texto: `El cambio es ${f(fin)} − ${f(P)} = ${f(fin - P)} soles. Lo divido entre el precio de antes.`,
              ecuacion: [{ frac: [`${f(fin)} − ${f(P)}`, f(P)] }, ` · 100 = ${f(v)} %`] },
            { tipo: 'sentido', texto: `De vuelta: ${f(P)} · ${f(fin / P)} = ${f(fin)}. El signo dice que el precio ${sube ? 'subió' : 'bajó'}, y así fue.` },
          ],
          respuesta: `Variación: ${sube ? '+' : ''}${f(v)} %`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const P = r.de([200, 400, 500, 800, 1000]), rr = r.de([10, 20, 30, 40, 50]);
          const fin = P * (1 + rr / 100) * (1 - rr / 100), v = 100 * (fin - P) / P;
          return {
            pregunta: ['Un precio de ', { v: 'c-o', t: sol(P) }, ' sube ', { v: 'c-i', t: `${rr} %` }, ' y luego baja ', { v: 'c-h', t: `${rr} %` }, '. ¿Cuál es la variación porcentual total?'],
            dibujo: { datos: barra(P, [aum(rr), des(rr, 'h')]), estado: { corte: 0 } },
            opciones: opciones(v, [
              { id: 'cero', valor: 0, error: 'AR2', siFuera: 'Sería cierto si las dos veces la base fuera la misma. La bajada usa el precio ya subido.' },
              { id: 'sube', valor: -v, error: 'AT-SIGNO', siFuera: 'El final queda debajo del inicio: la variación es negativa.' },
              { id: 'doble', valor: -2 * rr, error: 'AR1', siFuera: 'Eso suma dos bajadas; aquí una sube y la otra baja.' },
            ], n => `${f(n)} %`),
            solucion: { texto: `Queda ${f(1 - rr * rr / 10000, 4)} del inicio.`, ecuacion: [`(1 + ${f(rr / 100)})(1 − ${f(rr / 100)}) = ${f(1 - rr * rr / 10000, 4)}`], dibujo: { datos: barra(P, [aum(rr), des(rr, 'h')]), estado: { corte: 2, final: true } } },
          };
        }
        const P = r.de([200, 250, 400, 500, 800]), fin = P * r.de([0.6, 0.75, 0.8, 1.2, 1.25, 1.5]);
        const v = 100 * (fin - P) / P;
        return {
          pregunta: ['Un precio pasó de ', { v: 'c-o', t: sol(P) }, ' a ', { v: 'c-d', t: sol(fin) }, '. ¿Cuál es la variación porcentual?'],
          opciones: opciones(v, [
            { id: 'base-final', valor: 100 * (fin - P) / fin, error: 'AR3', siFuera: 'Eso divide entre el precio final. La variación porcentual se mide contra el inicial.' },
            { id: 'soles', valor: fin - P, error: 'AR5', siFuera: 'Ese es el cambio en soles, no en porcentaje.' },
            { id: 'razon', valor: 100 * fin / P, error: 'AR4', siFuera: 'Eso es el final como porcentaje del inicio, no el cambio.' },
          ], n => `${n > 0 ? '+' : ''}${f(n)} %`),
          solucion: { texto: 'El cambio entre el valor inicial.', ecuacion: [{ frac: [`${f(fin)} − ${f(P)}`, f(P)] }, ` · 100 = ${f(v)} %`] },
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
    // Lee: los tres precios y las palabras ganancia y pérdida; no dice sobre qué base va el porcentaje (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Tres precios', texto: 'Una tienda de Juliaca compra zapatillas al mayorista: ese es el precio de costo. En la vitrina les pone el precio de lista. Lo que pagas al final, con la rebaja, es el precio de venta.' },
        { titulo: 'Ganar o perder', texto: 'Si el precio de venta pasa al costo, la tienda tiene ganancia; si queda por debajo, tiene pérdida. En soles, las dos salen de una resta.',
          ecuacion: ['G = ', { sub: ['P', 'v'] }, ' − ', Pc] },
        { titulo: 'Qué mirar', texto: 'En el juego el costo es S/ 200. Sube el precio de lista, ponle una rebaja y mira si la barra final queda más corta o más larga que el costo.' },
      ],
    },
    juega: {
      consigna: 'Un producto cuesta S/ 200. Se le sube un porcentaje para el precio de lista y luego se rebaja. Busca una pérdida.',
      voz: 'El contorno punteado es el costo. ¿La venta lo pasa?',
      controles: [
        { id: 'm', etiqueta: 'Sube', color: 'c-i', min: 10, max: 60, paso: 10, inicio: 40, unidad: '%', decimales: 0 },
        { id: 'd', etiqueta: 'Rebaja', color: 'c-h', min: 10, max: 50, paso: 10, inicio: 20, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(200, [aum(v.m), des(v.d, 'h')]), estado: { corte: 2 } }),
      lectura: v => { const g = 200 * (1 + v.m / 100) * (1 - v.d / 100) - 200; return [`Venta ${sol(200 + g)} · ${g >= 0 ? 'gana' : 'pierde'} ${sol(Math.abs(g))}`]; },
      minimo: 3,
      // El costo queda marcado donde empieza la subida (fila 1); la rebaja termina en el final de la barra.
      arrastres: [
        { id: 'costo', etiqueta: 'fin del costo', color: 'c-i',
          donde: v => { const d = barra(200, [aum(v.m), des(v.d, 'h')]); return enFila(d, 1, 200); },
          mover: (pt, v) => ({ m: 100 * (1 / fr(barra(200, [aum(v.m), des(v.d, 'h')]), pt.x) - 1) }) },
        { id: 'venta', etiqueta: 'precio de venta', color: 'c-h',
          donde: v => { const d = barra(200, [aum(v.m), des(v.d, 'h')]); return enBarra(d, valoresDe(d)[2]); },
          mover: (pt, v) => ({ d: 100 * (1 - fr(barra(200, [aum(v.m), des(v.d, 'h')]), pt.x)) }) },
      ],
    },
    predice: {
      pregunta: ['Se compró a ', { v: 'c-o', t: 'S/ 200' }, ' y se vendió a ', { v: 'c-d', t: 'S/ 250' }, '. ¿Qué porcentaje del costo se ganó?'],
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'venta', texto: '20 %', error: 'AR3', siFuera: '20 % sería la ganancia sobre la venta. Se pidió sobre el costo, S/ 200.' },
        { id: 'soles', texto: '50 %', error: 'AR5', siFuera: '50 es la ganancia en soles, no un porcentaje.' },
        { id: 'razon', texto: '125 %', error: 'AR4', siFuera: '125 % es la venta comparada con el costo; la ganancia es lo que pasa del 100 %.' },
      ],
      dibujo: { datos: barra(200, [aum(25)]), estado: { corte: 0 } },
      revelar: { datos: barra(200, [aum(25)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 50 sobre S/ 200 es la cuarta parte, 25 %.',
    },
    mira: {
      datos: barra(200, [aum(40), des(20, 'h')]),
      pasos: [
        { estado: { corte: 0 }, texto: 'El costo es S/ 200: la base de la ganancia.', ecuacion: [{ sub: ['P', 'c'] }, ' = S/ 200'] },
        { estado: { corte: 1 }, texto: 'Precio de lista: sube 40 % sobre el costo.', ecuacion: [{ sub: ['P', 'L'] }, ' = 200 · 1,40 = 280'] },
        { estado: { corte: 2 }, texto: 'Venta: rebaja 20 % sobre la lista, no sobre el costo.', ecuacion: [{ sub: ['P', 'v'] }, ' = 280 · 0,80 = 224'] },
        { estado: { corte: 2, final: true }, texto: 'Gana S/ 24, que es el 12 % del costo.', ecuacion: ['G = 224 − 200 = 24 → ', { frac: ['24', '200'] }, ' = 12 %'] },
      ],
    },
    regla: {
      texto: 'La ganancia es la venta menos el costo. En porcentaje se divide entre el costo, salvo que el problema diga otra base.',
      ecuacion: ['G = ', { sub: ['P', 'v'] }, ' − ', Pc, '   ·   ', 'G % = ', { frac: ['G', { llave: [Pc], nota: 'la base', color: 'c-o' }] }, ' · 100'],
      condicion: 'si G sale negativa es pérdida. La rebaja se calcula sobre el precio de lista, que es otra base.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), C = r.de([100, 200, 250, 400, 500]), m = r.de([20, 25, 40, 50, 60]), d = r.de([10, 20, 25]);
        const L = C * (1 + m / 100), V = L * (1 - d / 100), G = V - C;
        if (s % 2 === 0) return {
          enunciado: ['Cuesta ', { v: 'c-o', t: sol(C) }, ', se lista ', { v: 'c-i', t: `${m} %` }, ' más caro y se vende con rebaja del ', { v: 'c-h', t: `${d} %` }, '. ¿A cuánto se vende?'],
          dibujo: { datos: barra(C, [aum(m), des(d, 'h')]), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: 'Piden el precio de venta: lo que paga el cliente después de la rebaja.' },
            { tipo: 'datos', texto: ['Costo ', Pc, ` = ${sol(C)}; la lista es ${m} % más cara; la rebaja es de ${d} %.`] },
            { tipo: 'regla', texto: 'Aquí hay dos bases: la subida se toma del costo y la rebaja, del precio de lista. Multiplico por cada factor, en orden.' },
            { tipo: 'cuentas', texto: `Lista: ${f(C)} · ${f(1 + m / 100)} = ${f(L)}. Venta: ${f(L)} · ${f(1 - d / 100)} = ${f(V)}.`,
              ecuacion: [{ sub: ['P', 'v'] }, ` = ${sol(V)}`], dibujo: { datos: barra(C, [aum(m), des(d, 'h')]), estado: { corte: 2, final: true } } },
            { tipo: 'sentido', texto: `De vuelta: ${f(V)} ÷ ${f(1 - d / 100)} = ${f(L)}, la lista. Frente al costo, ${G >= 0 ? 'gana' : 'pierde'} ${sol(Math.abs(G))}.` },
          ],
          respuesta: `Se vende a ${sol(V)}.`,
        };
        const Vv = C * r.de([0.8, 0.9, 1.1, 1.2, 1.25, 1.5]), Gv = Vv - C, gp = 100 * Gv / C;
        return {
          enunciado: ['Se compra a ', { v: 'c-o', t: sol(C) }, ' y se vende a ', { v: 'c-d', t: sol(Vv) }, '. ¿Qué porcentaje del costo se gana o se pierde?'],
          pasos: [
            { tipo: 'pide', texto: 'Piden qué porcentaje del costo se gana o se pierde.' },
            { tipo: 'datos', texto: ['Costo ', Pc, ` = ${sol(C)}; venta ${sol(Vv)}.`] },
            { tipo: 'regla', texto: 'Lo que se gana o se pierde es venta menos costo. En porcentaje, lo comparo con el costo, que es la base.',
              ecuacion: ['G % = ', { frac: ['G', Pc] }, ' · 100'] },
            { tipo: 'cuentas', texto: `${Gv >= 0 ? 'Gana' : 'Pierde'} ${f(Math.abs(Gv))} soles. Lo divido entre el costo.`,
              ecuacion: [{ frac: [`${f(Vv)} − ${f(C)}`, f(C)] }, ` · 100 = ${f(gp)} %`] },
            { tipo: 'sentido', texto: `De vuelta: el ${f(Math.abs(gp))} % de ${sol(C)} es ${sol(Math.abs(Gv))}. La venta es ${Gv > 0 ? 'mayor' : 'menor'} que el costo: es ${Gv > 0 ? 'ganancia' : 'pérdida'}.` },
          ],
          respuesta: `${Gv > 0 ? 'Gana' : 'Pierde'} el ${f(Math.abs(gp))} % del costo.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), C = r.de([100, 200, 250, 400, 500]), m = r.de([20, 25, 40, 50, 60]), d = r.de([10, 20, 25]);
        const L = C * (1 + m / 100), V = L * (1 - d / 100), G = V - C;
        if (s % 2 === 0) return {
          pregunta: ['Cuesta ', { v: 'c-o', t: sol(C) }, ', se lista ', { v: 'c-i', t: `${m} %` }, ' más caro y se vende con rebaja del ', { v: 'c-h', t: `${d} %` }, '. ¿A cuánto se vende?'],
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
          ], n => (n > 0 ? `gana ${f(n)} %` : `pierde ${f(-n)} %`)),
          solucion: { texto: 'Lo que gana o pierde, entre el costo.', ecuacion: [{ frac: [`${f(Vv)} − ${f(C)}`, f(C)] }, ` · 100 = ${f(100 * Gv / C)} %`] },
        };
      },
    },
  };

  // ---------- Idea 5: el impuesto se suma a la base; se quita dividiendo ----------
  // Cambia: la base B y la tasa τ. Permanece: el total con impuesto como barra que pasa del contorno.
  // Progresa: B → B(1 + τ) → de vuelta a B dividiendo. Se reserva: el fantasma de «quitar el 18 % del total».
  // Debe verse: quitar τ % del total cae por debajo de la base.
  const igv = {
    id: 'igv',
    titulo: 'El impuesto se quita dividiendo',
    temas: ['IGV'],
    pieza: 'barra-porcentaje',
    // Lee: qué es el IGV y qué partes trae un precio; no dice cómo se recupera la base desde el total (Predice).
    lee: {
      tarjetas: [
        { titulo: 'El IGV', texto: 'En el Perú casi todo lo que compras lleva IGV, el Impuesto General a las Ventas. En una factura de una tienda de Puno verás tres números: el precio sin impuesto, el IGV y el total.' },
        { titulo: 'La tasa', texto: 'La tasa del IGV es 18 %. Otros problemas usan otra tasa para otro impuesto: siempre se toma la que da el enunciado.',
          ecuacion: [tau, ' = 18 % = 0,18'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la barra naranja es el precio sin impuesto y el pedazo turquesa que se agrega es el impuesto. Cambia la tasa y mira cuánto crece el total.' },
      ],
    },
    juega: {
      consigna: 'Elige la base sin impuesto y la tasa que da el problema. Mira cuánto se agrega y el total.',
      voz: 'La tasa siempre se toma de la base, no del total.',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-o', min: 100, max: 500, paso: 50, inicio: 200, decimales: 0 },
        { id: 't', etiqueta: 'τ', color: 'c-i', min: 10, max: 20, paso: 2, inicio: 18, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: barra(v.B, [aum(v.t)]), estado: { corte: 1 } }),
      lectura: v => [`Impuesto ${sol(v.B * v.t / 100)} · total ${sol(v.B * (1 + v.t / 100))}`],
      minimo: 3,
      // La base termina donde empieza el impuesto: acercarla al final de la barra baja la tasa.
      arrastres: [{ id: 'base', etiqueta: 'fin de la base', color: 'c-i',
        donde: v => { const d = barra(v.B, [aum(v.t)]); return enFila(d, 1, v.B); },
        mover: (pt, v) => ({ t: 100 * (1 / fr(barra(v.B, [aum(v.t)]), pt.x) - 1) }) }],
    },
    predice: {
      pregunta: ['Un precio con IGV del ', { v: 'c-i', t: '18 %' }, ' incluido es ', { v: 'c-d', t: 'S/ 236' }, '. ¿Cuál es el precio sin IGV?'],
      opciones: [
        { id: 'c', texto: 'S/ 200', correcta: true },
        { id: 'resta-pct', texto: 'S/ 193,52', error: 'AR3', siFuera: 'Eso quita el 18 % de S/ 236. El 18 % se calculó sobre la base, que es menor.' },
        { id: 'resta-18', texto: 'S/ 218', error: 'AT-PARTE', siFuera: 'Eso resta 18 soles: sería cierto si la base fuera S/ 100.' },
        { id: 'suma', texto: 'S/ 278,48', error: 'AT-SENTIDO', siFuera: 'Eso vuelve a sumar el impuesto. Aquí hay que quitarlo.' },
      ],
      dibujo: { datos: barra(200, [aum(18)]), estado: { corte: 0 } },
      revelar: { datos: barra(200, [aum(18)]), estado: { corte: 1 } },
      coincide: 'Coincide: S/ 200 más su 18 % da S/ 236.',
    },
    mira: {
      datos: barra(200, [aum(18)]),
      pasos: [
        { estado: { corte: 0 }, texto: 'La base sin impuesto es lo que buscamos.', ecuacion: [B, ' = ?'] },
        { estado: { corte: 1 }, texto: 'El total es la base más el 18 % de la base.', ecuacion: [B, ' · 1,18 = 236'] },
        { estado: { corte: 1 }, texto: 'Se deshace dividiendo entre el mismo factor.', ecuacion: [B, ' = ', { frac: ['236', '1,18'] }, ' = S/ 200'] },
      ],
    },
    regla: {
      texto: 'Un impuesto de tasa τ se calcula sobre la base: el total es la base por 1 + τ. Para recuperar la base, se divide entre 1 + τ.',
      ecuacion: ['total = ', B, ' (1 + ', tau, ')', '   ·   ', B, ' = ', { frac: ['total', { llave: ['1 + ', tau], nota: 'el factor', color: 'c-i' }] }],
      condicion: 'τ es la tasa que da el enunciado. Quitar τ % del total no devuelve la base.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), Bv = r.de([100, 150, 200, 250, 300, 400, 500, 1000]), tv = r.de([18, 18, 10, 20]);
        const total = Bv * (1 + tv / 100), imp = Bv * tv / 100;
        if (s % 2 === 0) return {
          enunciado: ['Un precio con impuesto del ', { v: 'c-i', t: `${tv} %` }, ' incluido es ', { v: 'c-d', t: sol(total) }, '. ¿Cuál es el precio sin impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden el precio sin impuesto: la base ', B, '.'] },
            { tipo: 'datos', texto: [`El total con impuesto es ${sol(total)} y la tasa es `, tau, ` = ${tv} %.`] },
            { tipo: 'regla', texto: 'El total es la base más su impuesto: la base multiplicada por 1 + tasa. Para volver a la base, deshago esa multiplicación dividiendo.',
              ecuacion: [B, ' = ', { frac: ['total', ['1 + ', tau]] }] },
            { tipo: 'cuentas', texto: `El factor es 1 + ${f(tv / 100)} = ${f(1 + tv / 100)}.`, ecuacion: [B, ' = ', { frac: [f(total), f(1 + tv / 100)] }, ` = ${sol(Bv)}`],
              dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1, final: true } } },
            { tipo: 'sentido', texto: `De vuelta: el ${tv} % de ${sol(Bv)} es ${sol(imp)}, y ${f(Bv)} + ${f(imp)} = ${f(total)}, el total. Cuadra.` },
          ],
          respuesta: [B, ` = ${sol(Bv)}`],
        };
        return {
          enunciado: ['Un producto vale ', { v: 'c-o', t: sol(Bv) }, ' sin impuesto. Con un impuesto del ', { v: 'c-i', t: `${tv} %` }, ', ¿cuánto es el impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: 'Piden solo el impuesto, no el total que se paga.' },
            { tipo: 'datos', texto: ['Sin impuesto vale ', B, ` = ${sol(Bv)}; la tasa es `, tau, ` = ${tv} %.`] },
            { tipo: 'regla', texto: 'El impuesto se calcula sobre el precio sin impuesto: es la tasa, en centésimos, por esa base.', ecuacion: ['impuesto = ', tau, ' · ', B] },
            { tipo: 'cuentas', texto: `${tv} % son ${f(tv / 100)} de la base.`, ecuacion: [`${f(tv / 100)} · ${f(Bv)} = ${sol(imp)}`], dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: tv === 10 ? `Por otro camino: el 10 % es la décima parte, ${f(Bv)} ÷ 10 = ${f(imp)}. El total queda en ${sol(total)}.` : `Por otro camino: el 10 % es ${sol(Bv / 10)}, y ${tv} % es ${f(tv / 10)} veces eso. El total queda en ${sol(total)}.` },
          ],
          respuesta: `El impuesto es ${sol(imp)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), Bv = r.de([100, 150, 200, 250, 300, 400, 500, 1000]), tv = r.de([18, 18, 10, 20]);
        const total = Bv * (1 + tv / 100);
        if (s % 2 === 0) return {
          pregunta: ['Un precio con impuesto del ', { v: 'c-i', t: `${tv} %` }, ' incluido es ', { v: 'c-d', t: sol(total) }, '. ¿Cuál es el precio sin impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          opciones: opciones(Bv, [
            { id: 'resta-pct', valor: total * (1 - tv / 100), error: 'AR3', siFuera: `Eso quita el ${tv} % del total; el impuesto se calculó sobre la base.` },
            { id: 'resta', valor: total - tv, error: 'AT-PARTE', siFuera: `Eso resta ${tv} soles; sería cierto si la base fuera S/ 100.` },
            { id: 'suma', valor: total * (1 + tv / 100), error: 'AT-SENTIDO', siFuera: 'Eso vuelve a sumar el impuesto.' },
          ], sol),
          solucion: { texto: 'Se divide entre el factor del impuesto.', ecuacion: [{ frac: [f(total), f(1 + tv / 100)] }, ` = ${sol(Bv)}`], dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1, final: true } } },
        };
        return {
          pregunta: ['Un producto vale ', { v: 'c-o', t: sol(Bv) }, ' sin impuesto. Con un impuesto del ', { v: 'c-i', t: `${tv} %` }, ', ¿cuánto es el impuesto?'],
          dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 0 } },
          opciones: opciones(Bv * tv / 100, [
            { id: 'total', valor: total, error: 'AR5', siFuera: 'Ese es el total con impuesto, no el impuesto.' },
            { id: 'del-total', valor: total * tv / 100, error: 'AR3', siFuera: 'Eso toma la tasa del total; la tasa va sobre la base.' },
            { id: 'tasa', valor: tv, error: 'AT-PARTE', siFuera: 'Sería cierto si la base fuera S/ 100.' },
          ], sol),
          solucion: { texto: 'La tasa por la base.', ecuacion: [`${f(tv / 100)} · ${f(Bv)} = ${sol(Bv * tv / 100)}`], dibujo: { datos: barra(Bv, [aum(tv)]), estado: { corte: 1 } } },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.porcentajes',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/barra-porcentaje.js'],
    // Glosario del tema (docs/teoria.md, 4d). «base del porcentaje» no se acorta a «base»: numeración usa «base» en otro sentido.
    glosario: [
      { termino: 'porcentaje', simbolo: '%', def: 'Parte de una cantidad contada por cada cien: p % son p centésimos de la base.',
        ejemplo: '20 % de S/ 200 = 0,20 · 200 = S/ 40.', ver: ['base del porcentaje'] },
      { termino: 'tanto por cuanto', def: 'Parte tomada «a por cada b» de una cantidad: es la fracción a/b de ella.',
        ejemplo: '3 por cada 4 de S/ 80: 3/4 · 80 = S/ 60.', ver: ['porcentaje'] },
      { termino: 'base del porcentaje', def: 'La cantidad que vale el 100 %: de ella se toma cada porcentaje.',
        ejemplo: 'S/ 20 de una base de S/ 80: 20/80 = 25 %.', ver: ['porcentaje'] },
      { termino: 'descuento', formas: ['descuento', 'descuentos'], def: 'Lo que se le quita a un precio. Si es r %, queda el (100 − r) % del precio.',
        ejemplo: '20 % menos a S/ 500: se paga S/ 400.', ver: ['aumento', 'descuentos sucesivos'] },
      { termino: 'aumento', formas: ['aumento', 'aumentos'], def: 'Lo que se le agrega a una cantidad. Si es r %, queda el (100 + r) %.',
        ejemplo: '25 % más a S/ 400: S/ 500.', ver: ['descuento', 'variación porcentual'] },
      { termino: 'descuentos sucesivos', formas: ['descuentos sucesivos', 'aumentos sucesivos'],
        def: 'Cambios en porcentaje que se aplican uno tras otro: cada uno se calcula sobre lo que dejó el anterior.',
        ejemplo: 'S/ 500 con 20 % y 30 %: 500 · 0,80 · 0,70 = S/ 280.', ver: ['descuento único'] },
      { termino: 'descuento único', def: 'Un solo porcentaje de rebaja que deja el mismo final que varios seguidos.',
        ejemplo: '20 % y luego 30 %: se paga el 56 %; el único es 44 %.', ver: ['descuentos sucesivos'] },
      { termino: 'variación porcentual', def: 'Cuánto cambió una cantidad, dividido entre su valor inicial y por 100.',
        ejemplo: 'De S/ 400 a S/ 500: 100/400 · 100 = 25 %.', ver: ['aumento', 'descuento'] },
      { termino: 'precio de costo', formas: ['precio de costo', 'costo', 'costos'],
        def: 'Lo que pagó el vendedor por el producto. Suele ser la base de la ganancia.',
        ejemplo: 'Se compró a S/ 200.', ver: ['precio de lista', 'precio de venta', 'ganancia'] },
      { termino: 'precio de lista', def: 'Precio que se anuncia antes de las rebajas; sobre él se calcula la rebaja.',
        ejemplo: 'Costo S/ 200 y se lista 40 % más: S/ 280.', ver: ['precio de costo', 'precio de venta'] },
      { termino: 'precio de venta', formas: ['precio de venta', 'venta', 'ventas'], def: 'Lo que el cliente paga al final, después de las rebajas.',
        ejemplo: 'Lista S/ 280 con rebaja de 20 %: S/ 224.', ver: ['precio de lista', 'ganancia'] },
      { termino: 'ganancia', formas: ['ganancia', 'ganancias'], def: 'Lo que queda al restar el costo al precio de venta, cuando sale positivo.',
        ejemplo: 'Compra a S/ 200 y vende a S/ 224: S/ 24, el 12 % del costo.', ver: ['pérdida', 'precio de costo'] },
      { termino: 'pérdida', formas: ['pérdida', 'pérdidas'], def: 'Lo que falta cuando el precio de venta queda por debajo del costo.',
        ejemplo: 'Costo S/ 200 y venta S/ 180: S/ 20, el 10 % del costo.', ver: ['ganancia'] },
      { termino: 'impuesto', formas: ['impuesto', 'impuestos'], def: 'Dinero que se paga al Estado: se agrega al precio y se calcula sobre el valor sin ese recargo.',
        ejemplo: '18 % sobre S/ 200: S/ 36.', ver: ['IGV', 'tasa'] },
      { termino: 'IGV', def: 'Impuesto General a las Ventas: en el Perú se suma un 18 % al precio sin él.',
        ejemplo: 'S/ 200 sin IGV son S/ 236 con IGV; 236 ÷ 1,18 = 200.', ver: ['impuesto'] },
      { termino: 'tasa', formas: ['tasa', 'tasas'], def: 'El porcentaje que fija el problema para un impuesto, un interés o un cambio.',
        ejemplo: 'Una tasa de 18 % es 0,18 de la base.', ver: ['impuesto', 'porcentaje'] },
    ],
    // Laboratorio: juego libre, sin preguntas.
    // · «Tres cambios seguidos» es más rica que los juegos: cada cambio puede subir o bajar, el precio inicial se elige y
    //   se puede probar el caso raro de los juegos (el orden). Guardar −20, +10 y +10 contra +10, +10 y −20 muestra
    //   el mismo final. Cada manija va donde termina el pedazo de su cambio, en su fila.
    // · «Ganancia según la base» junta costo, lista y venta con rangos amplios y da la ganancia sobre dos bases a la vez.
    laboratorio: [
      {
        id: 'cadena', titulo: 'Tres cambios seguidos', pieza: 'barra-porcentaje',
        consigna: 'Cada cambio sube (+) o baja (−) lo que dejó el anterior. Arrastra el final de cada pedazo. Guarda un caso, cambia el orden y compara.',
        controles: [
          { id: 'P', etiqueta: 'P₀', color: 'c-o', min: 100, max: 1000, paso: 100, inicio: 500, decimales: 0 },
          { id: 'c1', etiqueta: '1.º', color: 'c-i', min: -50, max: 50, paso: 5, inicio: -20, unidad: '%', decimales: 0 },
          { id: 'c2', etiqueta: '2.º', color: 'c-h', min: -50, max: 50, paso: 5, inicio: 10, unidad: '%', decimales: 0 },
          { id: 'c3', etiqueta: '3.º', color: 'c-d', min: -50, max: 50, paso: 5, inicio: 10, unidad: '%', decimales: 0 },
        ],
        dibujo: v => ({ datos: cadena(v), estado: { corte: 3, final: true } }),
        lectura: v => [`${conSigno(v.c1)}, ${conSigno(v.c2)}, ${conSigno(v.c3)} → ${sol(finCadena(v))} · ${conSigno(varTotal(v))}`],
        arrastres: ['c1', 'c2', 'c3'].map((id, k) => ({
          id: `fin-${k + 1}`, etiqueta: `final del cambio ${k + 1}`, color: ['c-i', 'c-h', 'c-d'][k],
          donde: v => { const d = cadena(v); return enFila(d, k + 1, valoresDe(d)[k + 1]); },
          // El nuevo valor del pedazo, sobre lo que dejó el cambio anterior.
          mover: (pt, v) => { const d = cadena(v), vs = valoresDe(d), g = BP().geometria(d); return { [id]: 100 * (g.deX(pt.x) / vs[k] - 1) }; },
        })),
        invitaciones: [
          { texto: 'Haz que los tres cambios sumen 0 % y que el final baje más del 10 %.',
            logrado: v => v.c1 + v.c2 + v.c3 === 0 && varTotal(v) < -10,
            bien: 'Suman 0 % y aun así bajó: cada cambio se toma de otra base.' },
          { texto: 'Deja el final justo en la mitad de P₀, con los tres cambios distintos de 0.',
            logrado: v => v.c1 !== 0 && v.c2 !== 0 && v.c3 !== 0 && casi(finCadena(v), v.P / 2),
            bien: 'La mitad sin bajar 50 % de una vez. Comprueba: multiplica los tres factores.' },
          { texto: 'Haz que el final pase del doble de P₀.',
            logrado: v => finCadena(v) > 2 * v.P,
            bien: 'Ningún cambio llega a 100 %, pero juntos más que duplican.' },
          { texto: 'Guarda dos casos con distinto P₀ y la misma variación porcentual.',
            logrado: (v, guardados) => guardados.some(g => g.P !== v.P && casi(varTotal(g), varTotal(v))),
            bien: 'Distinto inicio, misma variación porcentual: no depende de P₀.' },
        ],
      },
      {
        id: 'ganancia', titulo: 'Ganancia según la base', pieza: 'barra-porcentaje',
        consigna: 'Elige el costo, cuánto sube para la lista y cuánto se rebaja al vender. Compara la ganancia sobre el costo y sobre la venta.',
        controles: [
          { id: 'C', etiqueta: 'Costo', color: 'c-o', min: 100, max: 500, paso: 50, inicio: 200, decimales: 0 },
          { id: 'm', etiqueta: 'Sube', color: 'c-i', min: 5, max: 100, paso: 5, inicio: 50, unidad: '%', decimales: 0 },
          { id: 'd', etiqueta: 'Rebaja', color: 'c-h', min: 0, max: 60, paso: 5, inicio: 20, unidad: '%', decimales: 0 },
        ],
        dibujo: v => ({ datos: barra(v.C, [aum(v.m), des(v.d, 'h')]), estado: { corte: 2 } }),
        lectura: v => { const V = venta(v), G = V - v.C; return [`${sol(v.C)} → ${sol(V)} · ${conSigno(ganPct(v))} del costo · ${conSigno(100 * G / V)} de la venta`]; },
        arrastres: [
          { id: 'costo', etiqueta: 'fin del costo', color: 'c-i',
            donde: v => enFila(barra(v.C, [aum(v.m), des(v.d, 'h')]), 1, v.C),
            mover: (pt, v) => ({ m: 100 * (1 / fr(barra(v.C, [aum(v.m), des(v.d, 'h')]), pt.x) - 1) }) },
          { id: 'venta', etiqueta: 'precio de venta', color: 'c-h',
            donde: v => { const d = barra(v.C, [aum(v.m), des(v.d, 'h')]); return enBarra(d, valoresDe(d)[2]); },
            mover: (pt, v) => ({ d: 100 * (1 - fr(barra(v.C, [aum(v.m), des(v.d, 'h')]), pt.x)) }) },
        ],
        invitaciones: [
          { texto: 'Haz que la venta sea igual al costo: ni gana ni pierde.',
            logrado: v => casi(venta(v), v.C),
            bien: 'Ni gana ni pierde, aunque la subida y la rebaja no son iguales.' },
          { texto: 'Consigue una pérdida aunque la subida sea mayor que la rebaja.',
            logrado: v => v.m > v.d && venta(v) < v.C - 1e-9,
            bien: 'La rebaja se toma de una base más grande, por eso pesa más.' },
          { texto: 'Con una rebaja de 20 % o más, busca la mayor ganancia sobre el costo.',
            logrado: v => v.d >= 20 && casi(ganPct(v), MAX_G20),
            bien: 'La subida más alta con la rebaja más chica permitida.' },
          { texto: 'Guarda dos casos con la misma ganancia en soles y distinto costo.',
            logrado: (v, guardados) => guardados.some(g => g.C !== v.C && casi(venta(g) - g.C, venta(v) - v.C)),
            bien: 'Misma ganancia en soles, otro porcentaje: la base cambió.' },
        ],
      },
    ],
    historia: {
      texto: 'Los comerciantes del Mediterráneo comparaban monedas, pesas y medidas que no eran iguales en cada ciudad. La Summa de Luca Pacioli, impresa en 1494, reunió la aritmética práctica de su tiempo: proporciones, cambios y contabilidad. No inventó esas técnicas; las ordenó. Expresar todo «por cada cien» fue una manera de comparar sobre una base común.',
      pregunta: '¿Cómo compararías dos precios en monedas distintas?',
      fuente: { titulo: 'O’Connor y Robertson, Luca Pacioli — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Pacioli/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cadena': ['sucesivos', 'variacion'],
      'ganancia': ['costo-venta', 'base'],
    },
    ideas: [base, sucesivos, variacion, comercio, igv],
  };
});
