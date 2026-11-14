/*
 * Teoría de «Interés y descuento» (aritmetica.interes-y-descuento). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 6) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR15 y AR16 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que el interés compuesto gana interés sobre el interés, y que tasa, período y base se declaran antes de calcular.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: calcula montos simples y compuestos, tasas efectivas, valores presentes, descuentos y vencimiento común.
 *   Orden de atención: 1.º las tiras del capital y sus capas · 2.º la capa que crece · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué al 10 % durante 3 años no se gana 30 %?».
 * Colores (regla 4): capital o valor presente P naranja (c-o), tasa i turquesa (c-i), tiempo t o n rojo (c-h),
 * monto o valor futuro F verde (c-d). Las capas de interés llevan el color de la tasa.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const sol = n => `S/ ${f(n)}`;
  const P = { v: 'c-o', t: 'P' }, i = { v: 'c-i', t: 'i' }, n = { v: 'c-h', t: 'n' }, t = { v: 'c-h', t: 't' }, F = { v: 'c-d', t: 'F' };
  const j = { v: 'c-i', t: 'j' }, m = 'm', d = { v: 'c-i', t: 'd' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || !Number.isFinite(x.valor) || x.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: simple contra compuesto, capa por capa ----------
  // Cambia: la tasa y los períodos. Permanece: el capital de S/ 1000 al inicio de las dos tiras.
  // Progresa: una capa por período; en la compuesta cada capa es más larga. Se reserva: el «interés del interés».
  // Debe verse: la tira compuesta pasa a la simple desde el segundo período.
  // Solo se dibujan los intereses (el capital es igual en las dos y taparía la diferencia); cada capa con su valor.
  const capas = (cap, tasa, per, compuesto, o = {}) => {
    const tr = [];
    let saldo = cap;
    for (let k = 1; k <= per; k++) {
      const gana = compuesto ? saldo * tasa : cap * tasa;
      tr.push({ valor: gana, color: k % 2 ? 'i' : 'd', relleno: 0.35, texto: o.sinTexto ? undefined : f(gana), paso: o.pasos ? k : 0 });
      saldo += gana;
    }
    return { tramos: tr, saldo };
  };
  const dosTiras = (cap, tasa, per, o = {}) => {
    const s = capas(cap, tasa, per, false, o), c = capas(cap, tasa, per, true, o);
    return {
      max: c.saldo - cap, filas: 2,
      alt: `Intereses de ${sol(cap)} al ${f(tasa * 100)} % por período durante ${per} períodos: simple, capas iguales; compuesto, cada capa mayor que la anterior`,
      tiras: [
        { rotulo: `intereses simples · monto ${o.sinFin ? '?' : sol(s.saldo)}`, color: 'o', tramos: s.tramos, sinContorno: true },
        { rotulo: `intereses compuestos · monto ${o.sinFin ? '?' : sol(c.saldo)}`, color: 'o', tramos: c.tramos, sinContorno: true },
      ],
    };
  };
  const simpleCompuesto = {
    id: 'simple-compuesto',
    titulo: 'El interés que gana interés',
    temas: ['Interés simple', 'Interés compuesto y continuo'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Se depositan S/ 1000 a una tasa por período. Las tiras muestran solo los intereses: una capa por período. Compara las dos.',
      voz: 'Mira el largo de cada capa nueva en las dos tiras.',
      controles: [
        { id: 'i', etiqueta: 'i', color: 'c-i', min: 10, max: 30, paso: 10, inicio: 20, unidad: '%', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: dosTiras(1000, v.i / 100, v.n, { sinTexto: false }), estado: {} }),
      lectura: v => [`Monto: simple ${f(1000 * (1 + v.i / 100 * v.n))} · compuesto ${f(1000 * Math.pow(1 + v.i / 100, v.n))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Se depositan ', { v: 'c-o', t: 'S/ 1000' }, ' al ', { v: 'c-i', t: '10 %' }, ' anual con interés compuesto. ¿Cuánto hay al cabo de ', { v: 'c-h', t: '3 años' }, '?'],
      opciones: [
        { id: 'c', texto: 'S/ 1331', correcta: true },
        { id: 'simple', texto: 'S/ 1300', error: 'AR16', siFuera: 'Sería cierto con interés simple. En el compuesto, el interés también gana interés.' },
        { id: 'uno', texto: 'S/ 1100', error: 'AT-UN-PERIODO', siFuera: 'Ese es el monto de un solo año.' },
        { id: 'interes', texto: 'S/ 331', error: 'AT-MONTO-INTERES', siFuera: 'Eso es solo el interés ganado; el monto incluye el capital.' },
      ],
      dibujo: { datos: dosTiras(1000, 0.1, 3, { sinFin: true }), estado: { paso: 0 } },
      revelar: { datos: dosTiras(1000, 0.1, 3), estado: {} },
      coincide: 'Coincide: 1000 · 1,1 · 1,1 · 1,1 = 1331.',
    },
    mira: {
      datos: dosTiras(1000, 0.1, 3, { pasos: true }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Primer año: las dos ganan 10 % de 1000 = 100.', ecuacion: ['1000 · 1,1 = 1100'] },
        { estado: { paso: 2 }, texto: 'Segundo año: la compuesta gana 10 % de 1100 = 110.', ecuacion: ['1100 · 1,1 = 1210'] },
        { estado: { paso: 3 }, texto: 'Tercer año: gana 10 % de 1210 = 121.', ecuacion: ['1210 · 1,1 = 1331'] },
        { estado: { paso: 3 }, texto: 'La simple siempre gana 100: termina en 1300.', ecuacion: ['1000 (1 + 0,1 · 3) = 1300'] },
      ],
    },
    regla: {
      texto: 'En el interés simple cada período gana lo mismo, sobre el capital. En el compuesto cada período gana sobre el saldo, y el monto crece por un factor.',
      ecuacion: ['simple: ', F, ' = ', P, '(1 + ', i, t, ')   ·   compuesto: ', F, ' = ', P, { sup: [['(1 + ', i, ')'], n] }, '   ·   continuo: ', F, ' = ', P, { sup: ['e', [i, t]] }],
      condicion: 'i y t en la misma unidad de tiempo. El continuo es el límite cuando se capitaliza en cada instante.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), cap = r.de([500, 1000, 2000, 4000, 5000]), tasa = r.de([5, 10, 20]) / 100, per = r.ent(2, 4);
        const comp = cap * Math.pow(1 + tasa, per), simp = cap * (1 + tasa * per), pideSimple = s % 3 === 2;
        return {
          pregunta: ['Se depositan ', { v: 'c-o', t: sol(cap) }, ' al ', { v: 'c-i', t: `${f(tasa * 100)} %` }, ` anual con interés ${pideSimple ? 'simple' : 'compuesto'}. ¿Cuál es el monto al cabo de `, { v: 'c-h', t: `${per} años` }, '?'],
          dibujo: { datos: dosTiras(cap, tasa, per, { sinFin: true }), estado: {} },
          opciones: opciones(pideSimple ? simp : comp, [
            { id: 'otro', valor: pideSimple ? comp : simp, error: pideSimple ? 'AT-COMPUESTO' : 'AR16', siFuera: pideSimple ? 'Eso es el compuesto; en el simple cada año gana sobre el capital.' : 'Eso es el simple; en el compuesto el interés gana interés.' },
            { id: 'interes', valor: (pideSimple ? simp : comp) - cap, error: 'AT-MONTO-INTERES', siFuera: 'Eso es solo el interés; el monto incluye el capital.' },
            { id: 'uno', valor: cap * (1 + tasa), error: 'AT-UN-PERIODO', siFuera: 'Ese es el monto de un solo año.' },
          ], sol),
          solucion: {
            texto: pideSimple ? 'Cada año gana lo mismo sobre el capital.' : 'Cada año multiplica por el mismo factor.',
            ecuacion: pideSimple ? [`${f(cap)} (1 + ${f(tasa)} · ${per}) = ${sol(simp)}`] : [`${f(cap)} · `, { sup: [f(1 + tasa), String(per)] }, ` = ${sol(comp)}`],
            dibujo: { datos: dosTiras(cap, tasa, per), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: tasa nominal, efectiva y equivalente ----------
  // Cambia: cuántas veces al año se capitaliza (m). Permanece: la tasa nominal j y los S/ 100.
  // Progresa: m = 1, 2, 4, 12, 365: la efectiva sube, cada vez menos. Se reserva: el tope del continuo.
  // Debe verse: la tira efectiva pasa a la nominal, pero no pasa la del continuo.
  const tasasDatos = (jj, mm, o = {}) => {
    const ef = 100 * (Math.pow(1 + jj / mm, mm) - 1), cont = 100 * (Math.exp(jj) - 1);
    return {
      max: cont * 1.02, filas: 3, regla: { paso: 1, cada: cont > 16 ? 5 : 2 },
      tiras: [
        { rotulo: `nominal: S/ ${f(100 * jj)}`, color: 'i', tramos: [{ valor: 100 * jj, color: 'i', relleno: 0.3 }] },
        { rotulo: o.sinEf ? `efectiva (${mm} veces al año): ?` : `efectiva (${mm} veces al año): S/ ${f(ef)}`, color: 'd', paso: o.paso, tramos: [o.sinEf ? { valor: cont, hueco: true } : { valor: ef, color: 'd', relleno: 0.3 }] },
        { rotulo: `continua: S/ ${f(cont)}`, color: 'h', tramos: [{ valor: cont, color: 'h', relleno: 0.12, discontinua: true }] },
      ],
    };
  };
  const tasas = {
    id: 'tasas',
    titulo: 'Nominal, efectiva y continua',
    temas: ['Tasas nominal, efectiva y equivalentes', 'Interés compuesto y continuo'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'S/ 100 durante un año a una tasa nominal j, capitalizada m veces. Las tiras miden el interés del año.',
      voz: 'Sube m de a poco y mira la tira verde.',
      controles: [
        { id: 'j', etiqueta: 'j anual', color: 'c-i', min: 12, max: 36, paso: 12, inicio: 12, unidad: '%', decimales: 0 },
        { id: 'm', etiqueta: 'm', opciones: [{ valor: 1, texto: '1' }, { valor: 2, texto: '2' }, { valor: 4, texto: '4' }, { valor: 12, texto: '12' }, { valor: 365, texto: '365' }] },
      ],
      dibujo: v => ({ datos: tasasDatos(v.j / 100, v.m), estado: {} }),
      lectura: v => [`Tasa por período ${f(v.j / v.m, 4)} % · efectiva ${f(100 * (Math.pow(1 + v.j / 100 / v.m, v.m) - 1))} %`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un banco paga ', { v: 'c-i', t: '12 %' }, ' anual capitalizable cada mes. ¿Cuánto interés ganan S/ 100 en un año?'],
      opciones: [
        { id: 'c', texto: 'S/ 12,68', correcta: true },
        { id: 'nominal', texto: 'S/ 12', error: 'AT-NOMINAL', siFuera: 'Sería cierto si se capitalizara una vez al año. Cada mes se suma interés al saldo.' },
        { id: 'por-12', texto: 'S/ 144', error: 'AT-TASA-PERIODO', siFuera: 'Eso usa 12 % cada mes; la tasa mensual es 12 % ÷ 12 = 1 %.' },
        { id: 'mensual', texto: 'S/ 1', error: 'AT-UN-PERIODO', siFuera: 'Ese es el interés de un mes.' },
      ],
      dibujo: { datos: tasasDatos(0.12, 12, { sinEf: true, paso: 9 }), estado: {} },
      revelar: { datos: tasasDatos(0.12, 12), estado: {} },
      coincide: 'Coincide: 1,01 multiplicado 12 veces da 1,1268.',
    },
    mira: {
      datos: tasasDatos(0.12, 12, { paso: 2 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'La tasa nominal anual se reparte entre los 12 meses.', ecuacion: [i, ' = ', { frac: [j, m] }, ' = ', { frac: ['12 %', '12'] }, ' = 1 % mensual'] },
        { estado: { paso: 2 }, texto: 'Cada mes el saldo se multiplica por 1,01: doce veces.', ecuacion: [{ sup: ['1,01', '12'] }, ' = 1,1268'] },
        { estado: { paso: 2 }, texto: 'La tasa efectiva anual es 12,68 %, más que la nominal.', ecuacion: [{ sub: ['i', 'ef'] }, ' = ', { sup: ['1,01', '12'] }, ' − 1 = 12,68 %'] },
        { estado: { paso: 2 }, texto: 'Capitalizar cada instante tiene un tope: la continua.', ecuacion: [{ sup: ['e', '0,12'] }, ' − 1 = 12,75 %'] },
      ],
    },
    regla: {
      texto: 'La nominal j se divide entre m para la tasa de cada período. La efectiva es lo que de verdad crece en el año. Tasas equivalentes dan el mismo factor.',
      ecuacion: [{ sub: ['i', 'ef'] }, ' = ', { sup: [['(1 + ', { frac: [j, m] }, ')'], m] }, ' − 1'],
      condicion: 'una tasa efectiva anual no se divide entre 12: la mensual equivalente es la raíz doceava del factor, menos 1.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const jj = r.de([8, 12, 16, 20, 24]) / 100, mm = r.de([2, 4]);
          const ef = 100 * (Math.pow(1 + jj / mm, mm) - 1);
          return {
            pregunta: ['Una tasa nominal del ', { v: 'c-i', t: `${f(jj * 100)} %` }, ` anual se capitaliza ${mm === 2 ? 'cada semestre' : 'cada trimestre'}. ¿Cuál es la tasa efectiva anual?`],
            dibujo: { datos: tasasDatos(jj, mm, { sinEf: true }), estado: {} },
            opciones: opciones(ef, [
              { id: 'nominal', valor: jj * 100, error: 'AT-NOMINAL', siFuera: 'Esa es la nominal; la efectiva cuenta el interés sobre el interés.' },
              { id: 'periodo', valor: jj * 100 / mm, error: 'AT-UN-PERIODO', siFuera: 'Esa es la tasa de un solo período.' },
              { id: 'por-m', valor: jj * 100 * mm, error: 'AT-TASA-PERIODO', siFuera: 'Eso multiplica la tasa anual por los períodos.' },
            ], x => `${f(x)} %`),
            solucion: { texto: `Tasa por período ${f(jj * 100 / mm)} %, ${mm} veces.`, ecuacion: [{ sup: [`(1 + ${f(jj / mm, 4)})`, String(mm)] }, ` − 1 = ${f(ef)} %`], dibujo: { datos: tasasDatos(jj, mm), estado: {} } },
          };
        }
        const ief = r.de([0.1, 0.12, 0.15, 0.2, 0.25, 0.3]), per = r.de([2, 4]);
        const eq = 100 * (Math.pow(1 + ief, 1 / per) - 1);
        return {
          pregunta: ['Una tasa efectiva anual es ', { v: 'c-i', t: `${f(ief * 100)} %` }, `. ¿Qué tasa efectiva ${per === 2 ? 'semestral' : 'trimestral'} es equivalente?`],
          opciones: opciones(eq, [
            { id: 'divide', valor: ief * 100 / per, error: 'AT-DIVIDE-EFECTIVA', siFuera: `Eso divide entre ${per}; al componer daría más que ${f(ief * 100)} %.` },
            { id: 'igual', valor: ief * 100, error: 'AT-NOMINAL', siFuera: 'Esa es la anual; el período es más corto.' },
            { id: 'multiplica', valor: ief * 100 * per, error: 'AT-TASA-PERIODO', siFuera: 'Eso multiplica en vez de repartir.' },
          ], x => `${f(x)} %`),
          solucion: { texto: `El factor anual es el semestral elevado a ${per}.`, ecuacion: [{ raiz: f(1 + ief), indice: String(per) }, ` − 1 = ${f(eq)} %`] },
        };
      },
    },
  };

  // ---------- Idea 3: valor presente y futuro ----------
  // Cambia: los años que faltan y la tasa. Permanece: los S/ 1210 que se quieren tener.
  // Progresa: dividir por el factor de cada año, de atrás hacia adelante. Se reserva: restar porcentajes del futuro.
  // Debe verse: el presente es más corto que el futuro, y se acorta con más años.
  const pfDatos = (Fv, tasa, per, o = {}) => {
    const Pv = Fv / Math.pow(1 + tasa, per);
    return {
      max: Fv, filas: 2,
      tiras: [
        { rotulo: o.sinP ? 'hoy: ?' : `hoy: ${sol(Pv)}`, color: 'o', tramos: [{ valor: o.sinP ? Fv : Pv, color: 'o', relleno: o.sinP ? 0 : 0.25, hueco: !!o.sinP }] },
        { rotulo: `en ${per} años: ${sol(Fv)}`, color: 'd', tramos: [{ valor: Pv, color: 'o', relleno: 0.25 }, { valor: Fv - Pv, color: 'i', relleno: 0.35, texto: o.sinP ? undefined : 'intereses' }] },
      ],
    };
  };
  const presente = {
    id: 'presente-futuro',
    titulo: 'Traer el dinero al presente',
    temas: ['Valor presente y futuro'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Quieres tener S/ 1210 dentro de unos años. Elige cuántos años y la tasa compuesta. ¿Cuánto debes depositar hoy?',
      voz: 'Con más años, ¿hoy necesitas más o menos?',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'años', decimales: 0 },
        { id: 'i', etiqueta: 'i', color: 'c-i', min: 5, max: 20, paso: 5, inicio: 10, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: pfDatos(1210, v.i / 100, v.n), estado: {} }),
      lectura: v => [P, ` = 1210 ÷ ${f(Math.pow(1 + v.i / 100, v.n), 4)} = ${sol(1210 / Math.pow(1 + v.i / 100, v.n))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto hay que depositar hoy, al ', { v: 'c-i', t: '10 %' }, ' anual compuesto, para tener ', { v: 'c-d', t: 'S/ 1210' }, ' dentro de ', { v: 'c-h', t: '2 años' }, '?'],
      opciones: [
        { id: 'c', texto: 'S/ 1000', correcta: true },
        { id: 'resta', texto: 'S/ 968', error: 'AT-RESTA-FUTURO', siFuera: 'Eso quita 20 % de 1210. El 10 % de cada año se calculó sobre un saldo menor.' },
        { id: 'simple', texto: 'S/ 1008,33', error: 'AR16', siFuera: 'Eso descuenta con interés simple: 1210 ÷ 1,2.' },
        { id: 'un-anio', texto: 'S/ 1100', error: 'AT-UN-PERIODO', siFuera: 'Eso descuenta un solo año.' },
      ],
      dibujo: { datos: pfDatos(1210, 0.1, 2, { sinP: true }), estado: {} },
      revelar: { datos: pfDatos(1210, 0.1, 2), estado: {} },
      coincide: 'Coincide: 1000 · 1,1 · 1,1 = 1210.',
    },
    mira: {
      datos: pfDatos(1210, 0.1, 2),
      pasos: [
        { estado: {}, texto: 'El futuro es el presente multiplicado por 1,1 dos veces.', ecuacion: [P, ' · ', { sup: ['1,1', '2'] }, ' = 1210'] },
        { estado: {}, texto: 'Para volver al presente se divide entre el mismo factor.', ecuacion: [P, ' = ', { frac: ['1210', '1,21'] }, ' = 1000'] },
        { estado: {}, texto: 'Restar 20 % de 1210 no deshace dos multiplicaciones.', ecuacion: ['1210 · 0,8 = 968 ≠ 1000'] },
      ],
    },
    regla: {
      texto: 'El valor futuro lleva el capital hacia adelante multiplicando; el valor presente lo trae hacia atrás dividiendo entre el mismo factor.',
      ecuacion: [F, ' = ', P, { sup: [['(1 + ', i, ')'], n] }, '   ·   ', P, ' = ', { frac: [F, { sup: [['(1 + ', i, ')'], n] }] }],
      condicion: 'con interés compuesto y la tasa del mismo período que n. Con interés simple, P = F ÷ (1 + it).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), Pv = r.de([500, 800, 1000, 2000, 2500]), tasa = r.de([0.1, 0.2, 0.05]), per = r.ent(2, 3);
        const Fv = Pv * Math.pow(1 + tasa, per);
        return {
          pregunta: ['¿Cuánto hay que depositar hoy, al ', { v: 'c-i', t: `${f(tasa * 100)} %` }, ' anual compuesto, para tener ', { v: 'c-d', t: sol(Fv) }, ' dentro de ', { v: 'c-h', t: `${per} años` }, '?'],
          dibujo: { datos: pfDatos(Fv, tasa, per, { sinP: true }), estado: {} },
          opciones: opciones(Pv, [
            { id: 'resta', valor: Fv * (1 - tasa * per), error: 'AT-RESTA-FUTURO', siFuera: 'Eso quita porcentajes del futuro; se divide entre el factor.' },
            { id: 'simple', valor: Fv / (1 + tasa * per), error: 'AR16', siFuera: 'Eso descuenta con interés simple.' },
            { id: 'uno', valor: Fv / (1 + tasa), error: 'AT-UN-PERIODO', siFuera: 'Eso descuenta un solo año.' },
          ], sol),
          solucion: { texto: 'El futuro entre el factor compuesto.', ecuacion: [P, ' = ', { frac: [f(Fv), [{ sup: [f(1 + tasa), String(per)] }]] }, ` = ${sol(Pv)}`], dibujo: { datos: pfDatos(Fv, tasa, per), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: descuento comercial contra racional ----------
  // Cambia: los meses que faltan y la tasa. Permanece: la letra de S/ 1200.
  // Progresa: el descuento se come la tira desde la derecha. Se reserva: comercial sobre el nominal, racional sobre lo que se recibe.
  // Debe verse: el descuento comercial es siempre un poco mayor que el racional.
  const descDatos = (Fv, tasa, meses, o = {}) => {
    const tt = meses / 12, Dc = Fv * tasa * tt, Pr = Fv / (1 + tasa * tt), Dr = Fv - Pr;
    return {
      max: Fv, filas: 2,
      tiras: [
        { rotulo: o.oculta === 'c' ? 'comercial: recibe ?' : `comercial: recibe ${sol(Fv - Dc)}`, color: 'o', tramos: [{ valor: Fv - Dc, color: 'o', relleno: 0.22 }, { valor: Dc, color: 'h', relleno: 0.35, texto: o.oculta === 'c' ? undefined : f(Dc) }] },
        { rotulo: o.oculta === 'r' ? 'racional: recibe ?' : `racional: recibe ${sol(Pr)}`, color: 'o', tramos: [{ valor: Pr, color: 'o', relleno: 0.22 }, { valor: Dr, color: 'i', relleno: 0.35, texto: o.oculta === 'r' ? undefined : f(Dr) }] },
      ],
    };
  };
  const descuento = {
    id: 'descuento',
    titulo: 'Descuento comercial y racional',
    temas: ['Descuento comercial y racional'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Una letra de S/ 1200 se cobra antes de vencer. Elige los meses que faltan y la tasa anual. Compara los dos descuentos.',
      voz: 'La parte de color es lo que se pierde por cobrar antes.',
      controles: [
        { id: 't', etiqueta: 'Faltan', color: 'c-h', min: 1, max: 12, paso: 1, inicio: 5, unidad: 'meses', decimales: 0 },
        { id: 'd', etiqueta: 'Tasa anual', color: 'c-i', min: 12, max: 36, paso: 12, inicio: 24, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: descDatos(1200, v.d / 100, v.t), estado: {} }),
      lectura: v => { const tt = v.t / 12, Dc = 1200 * v.d / 100 * tt, Dr = 1200 - 1200 / (1 + v.d / 100 * tt); return [`Comercial ${sol(Dc)} · racional ${sol(Dr)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una letra de ', { v: 'c-d', t: 'S/ 1200' }, ' vence en ', { v: 'c-h', t: '5 meses' }, '. Con descuento racional al ', { v: 'c-i', t: '24 %' }, ' anual, ¿cuánto se recibe hoy?'],
      opciones: [
        { id: 'c', texto: 'S/ 1090,91', correcta: true },
        { id: 'comercial', texto: 'S/ 1080', error: 'AT-COMERCIAL-RACIONAL', siFuera: 'Sería cierto con descuento comercial, que calcula el 10 % sobre los S/ 1200.' },
        { id: 'anual', texto: 'S/ 912', error: 'AT-TASA-PERIODO', siFuera: 'Eso descuenta 24 % por un año entero; faltan 5 meses.' },
        { id: 'desc', texto: 'S/ 109,09', error: 'AT-MONTO-INTERES', siFuera: 'Ese es el descuento, no lo que se recibe.' },
      ],
      dibujo: { datos: descDatos(1200, 0.24, 5, { oculta: 'r' }), estado: {} },
      revelar: { datos: descDatos(1200, 0.24, 5), estado: {} },
      coincide: 'Coincide: 1090,91 crece 10 % en 5 meses hasta 1200.',
    },
    mira: {
      datos: descDatos(1200, 0.24, 5),
      pasos: [
        { estado: {}, texto: '24 % anual por 5 meses es 10 % de tasa en el plazo.', ecuacion: ['0,24 · ', { frac: ['5', '12'] }, ' = 0,10'] },
        { estado: {}, texto: 'Comercial: el 10 % se calcula sobre el valor nominal.', ecuacion: [{ sub: ['D', 'c'] }, ' = 1200 · 0,10 = 120'] },
        { estado: {}, texto: 'Racional: lo recibido hoy, más su 10 %, llega a 1200.', ecuacion: [P, ' = ', { frac: ['1200', '1,10'] }, ' = 1090,91'] },
        { estado: {}, texto: 'El racional es menor porque su base, lo recibido, es menor.', ecuacion: [{ sub: ['D', 'r'] }, ' = 1200 − 1090,91 = 109,09'] },
      ],
    },
    regla: {
      texto: 'El descuento comercial se calcula sobre el valor nominal de la letra. El racional es el interés simple de lo que se recibe hoy.',
      ecuacion: [{ sub: ['D', 'c'] }, ' = ', F, d, t, '   ·   ', { sub: ['D', 'r'] }, ' = ', P, i, t, ' con ', P, ' = ', { frac: [F, ['1 + ', i, t]] }],
      condicion: 'la tasa y el tiempo en la misma unidad. No se cambia una tasa de descuento por una de interés.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), Fv = r.de([600, 1200, 2400, 3000, 6000]), tasa = r.de([0.12, 0.24, 0.36]), meses = r.de([2, 3, 4, 5, 6, 10]);
        const tt = meses / 12, Dc = Fv * tasa * tt, Pr = Fv / (1 + tasa * tt), comercial = s % 2 === 0;
        const res = comercial ? Fv - Dc : Pr;
        return {
          pregunta: ['Una letra de ', { v: 'c-d', t: sol(Fv) }, ' vence en ', { v: 'c-h', t: `${meses} meses` }, `. Con descuento ${comercial ? 'comercial' : 'racional'} al `, { v: 'c-i', t: `${f(tasa * 100)} %` }, ' anual, ¿cuánto se recibe hoy?'],
          dibujo: { datos: descDatos(Fv, tasa, meses, { oculta: comercial ? 'c' : 'r' }), estado: {} },
          opciones: opciones(res, [
            { id: 'otro', valor: comercial ? Pr : Fv - Dc, error: 'AT-COMERCIAL-RACIONAL', siFuera: comercial ? 'Ese es el racional; el comercial descuenta sobre el nominal.' : 'Ese es el comercial; el racional usa lo que se recibe como base.' },
            { id: 'anual', valor: Fv * (1 - tasa), error: 'AT-TASA-PERIODO', siFuera: 'Eso descuenta un año entero.' },
            { id: 'desc', valor: Fv - res, error: 'AT-MONTO-INTERES', siFuera: 'Ese es el descuento, no lo que se recibe.' },
          ], sol),
          solucion: {
            texto: comercial ? 'Se descuenta la tasa del plazo sobre el nominal.' : 'Se divide entre 1 más la tasa del plazo.',
            ecuacion: comercial ? [`${f(Fv)} (1 − ${f(tasa)} · ${f(meses)}/12) = ${sol(res)}`] : [{ frac: [f(Fv), `1 + ${f(tasa)} · ${f(meses)}/12`] }, ` = ${sol(res)}`],
            dibujo: { datos: descDatos(Fv, tasa, meses), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 5: vencimiento común, el promedio pesado por el dinero ----------
  // Cambia: el valor y el plazo de la segunda letra. Permanece: la primera, S/ 1000 a 3 meses.
  // Progresa: las letras en la recta del tiempo y el punto que equilibra. Se reserva: el promedio simple como fantasma.
  // Debe verse: el vencimiento común se acerca a la letra de más dinero.
  const vcDatos = (letras, o = {}) => {
    const S = letras.reduce((a, l) => a + l.F, 0), tbar = letras.reduce((a, l) => a + l.F * l.t, 0) / S;
    const prom = letras.reduce((a, l) => a + l.t, 0) / letras.length;
    const el = letras.map((l, k) => ({ tipo: 'punto', x: l.t, color: ['o', 'i', 'h'][k], rotulo: sol(l.F), fila: 1 + (k % 2) }));
    if (!o.sinT) el.push({ tipo: 'punto', x: tbar, color: 'd', rotulo: `${f(tbar)} meses`, fila: 0, desde: o.desde || 0 });
    return { datos: { min: 0, max: 12, paso: 1, cada: 1, decimales: 2, filas: 2, variable: 't (meses)', color: 'h', elementos: el }, tbar, prom, S };
  };
  const vencimiento = {
    id: 'vencimiento-comun',
    titulo: 'Varias letras, una fecha',
    temas: ['Letras de cambio y vencimiento común'],
    pieza: 'recta',
    juega: {
      consigna: 'Dos letras se cambian por una sola que vale su suma. La primera es de S/ 1000 a 3 meses. Mueve la segunda.',
      voz: 'Mira hacia qué letra se corre el punto verde.',
      controles: [
        { id: 'F', etiqueta: 'Valor (S/)', color: 'c-i', min: 1000, max: 4000, paso: 1000, inicio: 3000, decimales: 0 },
        { id: 't', etiqueta: 'Vence en', color: 'c-h', min: 5, max: 11, paso: 1, inicio: 7, unidad: 'meses', decimales: 0 },
      ],
      dibujo: v => ({ datos: vcDatos([{ F: 1000, t: 3 }, { F: v.F, t: v.t }]).datos, estado: {} }),
      lectura: v => [`Una letra de ${sol(1000 + v.F)} a ${f((3000 + v.F * v.t) / (1000 + v.F))} meses`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Letras de ', { v: 'c-o', t: 'S/ 1000' }, ' a 3 meses y de ', { v: 'c-i', t: 'S/ 3000' }, ' a 7 meses se cambian por una sola de S/ 4000. ¿En cuántos meses vence?'],
      opciones: [
        { id: 'c', texto: '6 meses', correcta: true },
        { id: 'promedio', texto: '5 meses', error: 'AR15', siFuera: 'Sería cierto si las dos letras valieran lo mismo. La de 7 meses pesa el triple.' },
        { id: 'suma', texto: '10 meses', error: 'AT-SUMA', siFuera: 'Eso suma los plazos; la nueva fecha queda entre los dos.' },
        { id: 'mayor', texto: '7 meses', error: 'AT-SOLO-MAYOR', siFuera: 'Eso ignora la letra de S/ 1000, que vence antes.' },
      ],
      dibujo: { datos: vcDatos([{ F: 1000, t: 3 }, { F: 3000, t: 7 }], { sinT: true }).datos, estado: {} },
      revelar: { datos: vcDatos([{ F: 1000, t: 3 }, { F: 3000, t: 7 }]).datos, estado: { fantasma: { marca: 5, rotulo: 'promedio simple' } } },
      coincide: 'Coincide: 1000 · 3 + 3000 · 7 = 24 000, y 24 000 ÷ 4000 = 6.',
    },
    mira: {
      datos: vcDatos([{ F: 1000, t: 3 }, { F: 3000, t: 7 }], { desde: 2 }).datos,
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada letra pesa lo que vale: S/ 3000 pesa el triple.', ecuacion: ['1000 : 3000 = 1 : 3'] },
        { estado: { corte: 2 }, texto: 'La fecha común es el promedio de los plazos, pesado por el dinero.', ecuacion: [{ frac: ['1000 · 3 + 3000 · 7', '4000'] }, ' = 6'] },
        { estado: { corte: 2, fantasma: { marca: 5, rotulo: 'promedio simple' } }, texto: 'El promedio simple, 5 meses, olvida que pesan distinto.', ecuacion: ['(3 + 7) ÷ 2 = 5'] },
      ],
    },
    regla: {
      texto: 'Varias letras se cambian por una sola que vale su suma; su vencimiento común es el promedio de los plazos pesado por el valor de cada letra.',
      ecuacion: [{ sub: [t, 'c'] }, ' = ', { frac: [['Σ ', { sub: [F, 'k'] }, ' ', { sub: [t, 'k'] }], ['Σ ', { sub: [F, 'k'] }]] }],
      condicion: 'vale con descuento comercial simple a la misma tasa para todas, y la letra nueva vale la suma de las anteriores.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n2 = s % 3 === 2 ? 3 : 2;
        const letras = Array.from({ length: n2 }, () => ({ F: r.de([1000, 2000, 3000, 4000, 5000]), t: r.ent(2, 11) }));
        if (new Set(letras.map(l => l.t)).size < n2) return this.generar(s + 313);
        const v = vcDatos(letras);
        return {
          pregunta: `Las letras ${letras.map(l => `de ${sol(l.F)} a ${l.t} meses`).join(', ').replace(/, ([^,]*)$/, ' y $1')} se cambian por una sola de ${sol(v.S)}. ¿En cuántos meses vence?`,
          dibujo: { datos: vcDatos(letras, { sinT: true }).datos, estado: {} },
          opciones: opciones(v.tbar, [
            { id: 'promedio', valor: v.prom, error: 'AR15', siFuera: 'Ese es el promedio simple; las letras pesan según su valor.' },
            { id: 'mayor', valor: Math.max(...letras.map(l => l.t)), error: 'AT-SOLO-MAYOR', siFuera: 'Ese es el último plazo; la fecha común queda entre los plazos.' },
            { id: 'suma', valor: letras.reduce((a, l) => a + l.t, 0), error: 'AT-SUMA', siFuera: 'Eso suma los plazos.' },
          ], x => `${f(x)} meses`),
          solucion: { texto: 'Plazos pesados por el valor de cada letra.', ecuacion: [{ frac: [letras.map(l => `${f(l.F)} · ${l.t}`).join(' + '), f(v.S)] }, ` = ${f(v.tbar)}`], dibujo: { datos: v.datos, estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.interes-y-descuento',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'En 1683, Jacob Bernoulli se preguntó qué pasa con un capital si el interés se suma cada vez más seguido. El monto crece, pero no sin límite: se acerca a un tope que hoy relacionamos con el número e. Él todavía no tenía la relación moderna entre exponenciales y logaritmos. La lección sigue viva: capital, tasa por período y número de períodos se fijan antes de calcular.',
      pregunta: '¿Ganarías más si te pagaran interés cada minuto?',
      fuente: { titulo: 'O’Connor y Robertson, The number e — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/e/' },
    },
    ideas: [simpleCompuesto, tasas, presente, descuento, vencimiento],
  };
});
