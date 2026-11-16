/*
 * Teoría de «Lógica proposicional» (aritmetica.logica-proposicional). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 1) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: los AT-* son hipótesis de diseño (la matriz no atribuye prevalencias): confundir p → q con q → p,
 * leer ∨ como exclusiva, negar un cuantificador sin cambiarlo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: comprobar una afirmación compuesta mirando todas sus filas, no por cómo suena.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, en clase o en casa.
 *   Resultado observable: arma una tabla de verdad y da la fila que refuta una equivalencia falsa.
 *   Orden de atención: 1.º la fila resaltada de la tabla · 2.º la columna del resultado · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · filas que se llenan · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué “si p entonces q” es verdadera cuando p es falsa?».
 * Colores (regla 4): p naranja (c-o), q turquesa (c-i), la proposición compuesta verde (c-d); la fila que la hace
 * falsa, roja (c-h). Pieza: arit-tabla en las cuatro primeras ideas y recta para los cuantificadores.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-o', t: 'p' }, Q = { v: 'c-i', t: 'q' };
  const VF = b => (b ? 'V' : 'F');
  const FILAS = [[true, true], [true, false], [false, true], [false, false]];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Fórmulas de dos variables: texto y su valor (lo calcula el código, nunca se escribe a mano).
  const FORM = {
    'p ∧ q': (p, q) => p && q,
    'p ∨ q': (p, q) => p || q,
    'p → q': (p, q) => !p || q,
    'q → p': (p, q) => !q || p,
    'p ↔ q': (p, q) => p === q,
    '~p': p => !p,
    '~p ∨ q': (p, q) => !p || q,
    '~p ∧ ~q': (p, q) => !p && !q,
    '~p ∨ ~q': (p, q) => !p || !q,
    '~(p ∧ q)': (p, q) => !(p && q),
    '~(p ∨ q)': (p, q) => !(p || q),
    'p ∧ ~q': (p, q) => p && !q,
    'p → ~q': (p, q) => !p || !q,
    '~q → ~p': (p, q) => q || !p,
    'p ∨ ~p': p => p || !p,
    'p ∧ ~p': p => p && !p,
    '(p ∧ q) → p': (p, q) => !(p && q) || p,
    'p → (p ∨ q)': (p, q) => !p || p || q,
    '(p → q) ∨ (q → p)': (p, q) => (!p || q) || (!q || p),
    '(p ∨ q) ∧ ~p': (p, q) => (p || q) && !p,
    '~(p → q) ∧ q': (p, q) => !(!p || q) && q,
    '(p ↔ q) ∧ (p ∧ ~q)': (p, q) => p === q && p && !q,
    'p ∨ (q ∧ ~q)': (p, q) => p || (q && !q),
    '(p ∧ q) ∨ ~q': (p, q) => (p && q) || !q,
  };
  const columna = t => FILAS.map(([p, q]) => FORM[t](p, q));
  const iguales = (a, b) => columna(a).every((x, i) => x === columna(b)[i]);
  const clase = t => { const c = columna(t), n = c.filter(Boolean).length; return n === 4 ? 'tautología' : n === 0 ? 'contradicción' : 'contingencia'; };
  // Tabla completa de una o dos fórmulas; `hasta` filas llenas por paso; `distintas` resalta las filas donde difieren.
  function tabla(formulas, o = {}) {
    const cols = [{ t: 'p', color: 'o' }, { t: 'q', color: 'i' }, ...formulas.map((t, k) => ({ t, color: k ? 'h' : 'd' }))];
    const cs = formulas.map(columna);
    return {
      columnas: cols, filasMax: 4,
      filas: FILAS.map(([p, q], i) => [VF(p), VF(q), ...formulas.map((t, k) => {
        if (o.solo !== undefined && o.solo !== i) return '';
        const v = cs[k][i], dif = formulas.length > 1 && cs[0][i] !== cs[1][i];
        return { t: VF(v), paso: o.porFila ? i + 1 : 0, color: o.falsaRoja && !v ? 'h' : k ? 'h' : 'd', resalta: (o.falsaRoja && !v) || (o.distintas && dif) };
      })]),
    };
  }
  const fila = (p, q) => FILAS.findIndex(([a, b]) => a === p && b === q);
  // Gesto directo (docs/teoria.md §4b): en la tabla se agarra la fila por su borde derecho y se arrastra arriba o
  // abajo; la fila elegida fija los valores de p y q. En la recta se arrastra el último elemento del dominio.
  const TABLA = () => Kit.piezas['arit-tabla'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const manijaFila = (datos, i) => { const g = TABLA().geometria(datos); return { x: g.xs[g.xs.length - 1] - 12, y: g.filaY(i) + g.altoFila / 2 }; };
  const filaEn = (datos, y, hasta = 3) => { const g = TABLA().geometria(datos); return Math.max(0, Math.min(hasta, Math.floor((y - g.filaY(0)) / g.altoFila))); };
  // Así se resuelve: reemplaza cada letra y resuelve de adentro hacia afuera; cada eslabón lo calcula el código.
  const OPV = { '∧': (x, y) => x && y, '∨': (x, y) => x || y, '→': (x, y) => !x || y, '↔': (x, y) => x === y };
  function sustituye(t, p, q) {
    const pasos = [t.replace(/p/g, VF(p)).replace(/q/g, VF(q))];
    const neg = x => x.replace(/~([VF])/g, (_, c) => (c === 'V' ? 'F' : 'V'));
    const par = x => x.replace(/\(([VF]) ([∧∨→↔]) ([VF])\)/g, (_, a, o, b) => VF(OPV[o](a === 'V', b === 'V')));
    let x = pasos[0];
    for (let k = 0; k < 4; k++) { const y = neg(par(neg(x))); if (y === x) break; pasos.push(y); x = y; }
    const fin = VF(FORM[t](p, q));
    if (x !== fin) pasos.push(fin);
    return pasos.join(' = ');
  }
  const filasV = t => columna(t).filter(Boolean).length;
  const llaves = xs => (xs.length ? `{${xs.join(', ')}}` : '∅');
  const vfCtl = (id, color) => ({ id, etiqueta: id, color, opciones: [{ valor: 'V', texto: 'V' }, { valor: 'F', texto: 'F' }], inicio: 'V' });

  // ---------- Idea 1: los conectivos se definen por su tabla; ∨ es inclusiva ----------
  // Cambia: los valores de p y q y el conectivo. Permanece: las cuatro filas de la tabla, siempre en el mismo orden.
  // Progresa: una fila resaltada por cada caso probado. Se reserva: la fila V-V de «o», que el juego no muestra.
  // Debe verse: el resultado sale de la fila, no de la frase.
  const conectivos = {
    id: 'conectivos',
    titulo: 'Cada conectivo tiene su tabla',
    temas: ['Proposiciones simples y compuestas', 'Conectivos lógicos'],
    pieza: 'arit-tabla',
    // Lee (fase 2): qué es una proposición y cómo se escriben los conectivos; no dice qué hace ∨ con V-V (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Frases que se revisan', texto: '«Juliaca está en Puno» es verdadera. «7 es par» es falsa. Una frase así, que es V o F, se llama proposición. «¿Vienes mañana?» no lo es: una pregunta no es verdadera ni falsa.' },
        { titulo: 'Letras y conectivos', texto: 'Las proposiciones se nombran con letras, como p y q. Los conectivos las unen: ∧ se lee «y», ∨ se lee «o», ↔ se lee «si y solo si», y ~ se lee «no».',
          ecuacion: [P, ' ∧ ', Q, '   ·   ', P, ' ∨ ', Q, '   ·   ', P, ' ↔ ', Q, '   ·   ~', P] },
        { titulo: 'Qué mirar', texto: 'La tabla tiene cuatro filas: V-V, V-F, F-V y F-F. Elige una fila y un conectivo, y mira qué valor sale en la última columna.' },
      ],
    },
    juega: {
      consigna: 'Una proposición es una frase que es verdadera (V) o falsa (F). Elige p, q y el conectivo; mira la fila que se llena.',
      voz: 'Prueba las cuatro filas con un mismo conectivo.',
      controles: [
        vfCtl('p', 'c-o'), vfCtl('q', 'c-i'),
        { id: 'c', etiqueta: 'Conectivo', opciones: [{ valor: 'p ∧ q', texto: 'p ∧ q («y»)' }, { valor: 'p ↔ q', texto: 'p ↔ q' }, { valor: '~p', texto: '~p' }], inicio: 'p ∧ q' },
      ],
      dibujo: v => { const i = fila(v.p === 'V', v.q === 'V'); return { datos: tabla([v.c], { solo: i }), estado: { fila: i } }; },
      lectura: v => [v.c, ` es ${FORM[v.c](v.p === 'V', v.q === 'V') ? 'verdadera' : 'falsa'}`],
      minimo: 4,
      // La fila se arrastra entera: cambia p y q a la vez (por eso la manija no lleva el color de una sola letra).
      arrastres: [{ id: 'fila', etiqueta: 'fila de la tabla (valores de p y q)',
        donde: v => { const i = fila(v.p === 'V', v.q === 'V'); return manijaFila(tabla([v.c], { solo: i }), i); },
        mover: (pt, v) => { const k = filaEn(tabla([v.c]), pt.y); return { p: VF(FILAS[k][0]), q: VF(FILAS[k][1]) }; } }],
    },
    predice: {
      pregunta: ['«Hoy llueve o hace frío». Si hoy llueve (', P, ' = V) y también hace frío (', Q, ' = V), ¿cuánto vale ', P, ' ∨ ', Q, '?'],
      opciones: [
        { id: 'c', texto: 'V: basta que una sea verdadera', correcta: true },
        { id: 'exclusiva', texto: 'F: «o» pide que sea solo una', error: 'AT-O-EXCLUSIVA', siFuera: 'Sería cierto con el «o» exclusivo (⊻). El ∨ de la lógica es inclusivo.' },
        { id: 'sin-valor', texto: 'No tiene valor de verdad', error: 'AT-SIN-VALOR', siFuera: 'Una pregunta no tiene valor; esta frase sí lo tiene en cuanto se fija p y q.' },
      ],
      dibujo: { datos: tabla(['p ∨ q'], { solo: -1 }), estado: { fila: 0 } },
      revelar: { datos: tabla(['p ∨ q'], { falsaRoja: true }), estado: { fila: 0 } },
      coincide: 'Coincide: p ∨ q solo es falsa en la última fila.',
    },
    mira: {
      datos: tabla(['p ∨ q'], { porFila: true, falsaRoja: true }),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Las dos verdaderas: la disyunción es verdadera.', ecuacion: ['V ∨ V = V'] },
        { estado: { paso: 3, fila: [1, 2] }, texto: 'Una verdadera basta.', ecuacion: ['V ∨ F = F ∨ V = V'] },
        { estado: { paso: 4, fila: 3 }, texto: 'Solo es falsa cuando las dos son falsas.', ecuacion: ['F ∨ F = F'] },
      ],
    },
    regla: {
      texto: 'Una proposición compuesta une simples con conectivos, y su valor sale de la tabla del conectivo: ∧ pide las dos; ∨ pide al menos una.',
      ecuacion: [P, ' ∧ ', Q, ' = V solo en V-V', '   ·   ', P, ' ∨ ', Q, ' = F solo en F-F'],
      condicion: 'cada parte tiene valor de verdad. Una pregunta o «x + 2 = 5» sin fijar x no son proposiciones.',
    },
    // Así se resuelve (fase 2): el valor de una fórmula en una fila, como en «Ahora tú», con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), p = r.de([true, false]), q = r.de([true, false]);
        const t = r.de(['p ∧ q', 'p ∨ q', 'p ↔ q', '~p ∨ q', 'p ∧ ~q', '~(p ∧ q)', '~p ∧ ~q']);
        const v = FORM[t](p, q), i = fila(p, q), nV = filasV(t);
        const regla = t.startsWith('~(') ? 'Primero resuelvo el paréntesis; después ~ cambia su valor: V pasa a F y F pasa a V.'
          : t.includes('↔') ? 'Con ↔ el resultado es V cuando las dos partes valen lo mismo, las dos V o las dos F.'
          : t.includes('∨') ? 'Con «o» (∨) basta que una parte sea V. Solo da F cuando las dos partes son F.'
          : 'Con «y» (∧) el resultado es V solo si las dos partes son V. Si una es F, da F.';
        return {
          enunciado: ['Si ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}, ¿cuánto vale ${t}?`],
          dibujo: { datos: tabla([t], { solo: -1 }), estado: { fila: i } },
          pasos: [
            { tipo: 'pide', texto: `Piden el valor de verdad de ${t}: si es V o F.` },
            { tipo: 'datos', texto: ['Tengo ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}. Es la fila ${VF(p)}-${VF(q)} de la tabla.`] },
            { tipo: 'regla', texto: regla },
            { tipo: 'cuentas', texto: 'Reemplazo cada letra por su valor y resuelvo de adentro hacia afuera.', ecuacion: [sustituye(t, p, q)],
              dibujo: { datos: tabla([t], { solo: i }), estado: { fila: i } } },
            { tipo: 'sentido', texto: `En la tabla completa, ${t} sale V en ${nV} de las 4 filas, y la fila ${VF(p)}-${VF(q)} ${v ? 'es' : 'no es'} una de ellas. Cuadra.`,
              dibujo: { datos: tabla([t], { falsaRoja: true }), estado: { fila: i } } },
          ],
          respuesta: `${t} = ${VF(v)}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const prop = r.de(['7 es un número primo.', 'Lima es la capital del Perú.', '15 es múltiplo de 4.', 'El agua hierve a 50 °C a nivel del mar.']);
          const malas = ['¿Qué hora es?', 'x + 2 = 5', '¡Cierra la puerta!', 'Ese número es grande.'];
          return {
            pregunta: '¿Cuál de estas frases es una proposición?',
            opciones: [
              { id: 'c', texto: prop, correcta: true },
              { id: 'preg', texto: malas[0], error: 'AT-SIN-VALOR', siFuera: 'Una pregunta no es verdadera ni falsa.' },
              { id: 'abierta', texto: malas[1], error: 'AT-SIN-VALOR', siFuera: 'Sería proposición si x tuviera un valor fijo.' },
              { id: 'orden', texto: r.de(malas.slice(2)), error: 'AT-SIN-VALOR', siFuera: 'Una orden o una opinión vaga no tiene valor de verdad.' },
            ],
            solucion: { texto: 'Es la única que es verdadera o falsa, sin más datos.', ecuacion: ['proposición → V o F'] },
          };
        }
        const p = r.de([true, false]), q = r.de([true, false]);
        const t = r.de(['p ∧ q', 'p ∨ q', 'p ↔ q', '~p ∨ q', 'p ∧ ~q', '~(p ∧ q)', '~p ∧ ~q']);
        const v = FORM[t](p, q);
        return {
          pregunta: ['Si ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}, ¿cuánto vale ${t}?`],
          dibujo: { datos: tabla([t], { solo: -1 }), estado: { fila: fila(p, q) } },
          opciones: [
            { id: 'c', texto: VF(v), correcta: true },
            { id: 'otro', texto: VF(!v), error: t.includes('∨') ? 'AT-O-EXCLUSIVA' : 'AT-TABLA', siFuera: 'Revisa la tabla del conectivo en esta fila: ∧ pide las dos; ∨, al menos una.' },
          ],
          solucion: { texto: 'Se reemplaza cada letra y se usa la tabla.', ecuacion: [`${t} con p = ${VF(p)}, q = ${VF(q)} → ${VF(v)}`], dibujo: { datos: tabla([t], { solo: fila(p, q) }), estado: { fila: fila(p, q) } } },
        };
      },
    },
  };

  // ---------- Idea 2: el condicional solo falla en V → F, y no es su recíproco ----------
  // Cambia: q y el sentido de la flecha, con p fijo en V. Permanece: la tabla de cuatro filas.
  // Progresa: de la mitad de arriba (p = V) a la de abajo. Se reserva: las filas con p falsa.
  // Debe verse: la fila V-F es la única roja de p → q; en q → p la roja es otra.
  const condicional = {
    id: 'condicional',
    titulo: 'El condicional solo falla una vez',
    temas: ['Conectivos lógicos', 'Tablas de verdad'],
    pieza: 'arit-tabla',
    // Lee: la promesa como condicional y el recíproco; no dice qué vale p → q cuando p es F (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Una promesa', texto: 'Tu tío te dice: «Si apruebas el examen, te invito un helado». p es «apruebas» y q es «te invito». Se escribe p → q y se lee «si p, entonces q».',
          ecuacion: [P, ' → ', Q] },
        { titulo: '¿Cumplió o no?', texto: 'Para saber si el tío cumplió, hay que ver qué pasó con p y con q. Con dos letras hay cuatro casos posibles, y cada caso es una fila de la tabla.' },
        { titulo: 'Dar la vuelta', texto: 'Si cambias el orden de la flecha sale otra frase: q → p, «si te invito, es que aprobaste». Se llama el recíproco. Al jugar, compara las dos flechas en la misma fila.' },
      ],
    },
    juega: {
      consigna: 'Una promesa: «si apruebas (p), te invito (q)». Aquí apruebas: p = V. Cambia q y el sentido de la flecha.',
      voz: 'Compara p → q con q → p en la misma fila.',
      controles: [
        vfCtl('q', 'c-i'),
        { id: 'f', etiqueta: 'Flecha', opciones: [{ valor: 'p → q', texto: 'p → q' }, { valor: 'q → p', texto: 'q → p' }], inicio: 'p → q' },
      ],
      dibujo: v => { const i = fila(true, v.q === 'V'); return { datos: tabla([v.f], { solo: i, falsaRoja: true }), estado: { fila: i } }; },
      lectura: v => [v.f, ` es ${FORM[v.f](true, v.q === 'V') ? 'verdadera' : 'falsa'}`],
      minimo: 3,
      // Con p = V solo quedan las dos filas de arriba: arrastrar entre ellas cambia q.
      arrastres: [{ id: 'fila-q', etiqueta: 'fila de la tabla (valor de q)', color: 'c-i',
        donde: v => { const i = fila(true, v.q === 'V'); return manijaFila(tabla([v.f], { solo: i }), i); },
        mover: (pt, v) => ({ q: VF(FILAS[filaEn(tabla([v.f]), pt.y, 1)][1]) }) }],
    },
    predice: {
      pregunta: ['Ahora no apruebas: ', P, ' = F. ¿Cuánto vale ', P, ' → ', Q, '?'],
      opciones: [
        { id: 'c', texto: 'V, sea q verdadera o falsa', correcta: true },
        { id: 'falsa', texto: 'F, porque no se cumplió p', error: 'AT-COND-F', siFuera: 'Sería cierto para p ∧ q. La promesa no se rompe si no apruebas.' },
        { id: 'como-q', texto: 'Igual que q', error: 'AT-COND-Q', siFuera: 'Eso pasa cuando p es V. Con p falsa no hay nada que cumplir.' },
        { id: 'sin', texto: 'No tiene valor de verdad', error: 'AT-SIN-VALOR', siFuera: 'Con p y q fijas, toda la frase es V o F.' },
      ],
      dibujo: { datos: tabla(['p → q'], { solo: 0 }), estado: { fila: [2, 3] } },
      revelar: { datos: tabla(['p → q'], { falsaRoja: true }), estado: { fila: [2, 3] } },
      coincide: 'Coincide: si no apruebas, la promesa no se rompe.',
    },
    mira: {
      datos: tabla(['p → q', 'q → p'], { porFila: true, distintas: true }),
      pasos: [
        { estado: { paso: 2, fila: [0, 1] }, texto: 'Con p verdadera, p → q copia a q.', ecuacion: ['V → V = V   ·   V → F = F'] },
        { estado: { paso: 4, fila: [2, 3] }, texto: 'Con p falsa, la promesa no se rompe: V.', ecuacion: ['F → q = V'] },
        { estado: { paso: 4, fila: [1, 2] }, texto: 'q → p falla en otra fila: no es lo mismo.', ecuacion: [P, ' → ', Q, ' ≢ ', Q, ' → ', P] },
      ],
    },
    regla: {
      texto: 'El condicional p → q solo es falso cuando p es verdadera y q falsa. Por eso equivale a «no p, o q», y no a su recíproco q → p.',
      ecuacion: [{ llave: [P, ' → ', Q], nota: 'si p, q', color: 'c-d' }, ' ≡ ', { llave: ['~', P, ' ∨ ', Q], nota: '~p, o q', color: 'c-d' }],
      condicion: 'p y q son proposiciones. La contrarrecíproca ~q → ~p sí tiene la misma tabla que p → q.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), p = r.de([true, false]), q = r.de([true, false]);
        const t = r.de(['p → q', 'q → p', '~q → ~p', 'p → ~q', '~p ∨ q']);
        const v = FORM[t](p, q), i = fila(p, q), nF = 4 - filasV(t);
        const flecha = t.includes('→');
        return {
          enunciado: ['Si ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}, ¿cuánto vale ${t}?`],
          dibujo: { datos: tabla([t], { solo: -1 }), estado: { fila: i } },
          pasos: [
            { tipo: 'pide', texto: `Piden si ${t} es V o F en esta fila.` },
            { tipo: 'datos', texto: ['Tengo ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}.${flecha ? ' Miro qué queda a cada lado de la flecha.' : ''}`] },
            { tipo: 'regla', texto: flecha ? 'Una flecha solo da F cuando a su izquierda hay V y a su derecha hay F. En los otros tres casos da V.'
              : 'Con «o» (∨) basta que una parte sea V. Además, ~p ∨ q tiene la misma tabla que p → q.' },
            { tipo: 'cuentas', texto: 'Reemplazo las letras, resuelvo las negaciones y aplico la regla.', ecuacion: [sustituye(t, p, q)],
              dibujo: { datos: tabla([t], { solo: i, falsaRoja: true }), estado: { fila: i } } },
            { tipo: 'sentido', texto: `${t} sale F en ${nF === 1 ? 'una sola fila' : `${nF} filas`} de las cuatro, y esta ${v ? 'no es' : 'es'} ${nF === 1 ? 'esa fila' : 'una de ellas'}. Cuadra.`,
              dibujo: { datos: tabla([t], { falsaRoja: true }), estado: { fila: i } } },
          ],
          respuesta: `${t} = ${VF(v)}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), p = r.de([true, false]), q = r.de([true, false]);
        const t = r.de(['p → q', 'q → p', '~q → ~p', 'p → ~q', '~p ∨ q']);
        const v = FORM[t](p, q);
        return {
          pregunta: ['Si ', P, ` = ${VF(p)} y `, Q, ` = ${VF(q)}, ¿cuánto vale ${t}?`],
          dibujo: { datos: tabla([t], { solo: -1 }), estado: { fila: fila(p, q) } },
          opciones: [
            { id: 'c', texto: VF(v), correcta: true },
            { id: 'otro', texto: VF(!v), error: 'AT-RECIPROCO', siFuera: 'Una flecha solo es falsa si su antecedente es V y su consecuente F.' },
          ],
          solucion: { texto: 'Mira el lado izquierdo de la flecha y el derecho, en esta fila.', ecuacion: [`${t} con p = ${VF(p)}, q = ${VF(q)} → ${VF(v)}`], dibujo: { datos: tabla([t], { solo: fila(p, q), falsaRoja: true }), estado: { fila: fila(p, q) } } },
        };
      },
    },
  };

  // ---------- Idea 3: tautología, contradicción y contingencia ----------
  // Cambia: la fórmula. Permanece: las cuatro valuaciones. Progresa: la columna se llena fila por fila.
  // Se reserva: una fórmula que no está en la lista del juego. Debe verse: cuántas V tiene la columna, todas o ninguna.
  const LISTA = ['p ∨ ~p', 'p ∧ ~p', 'p → q', '(p ∧ q) → p', '(p ∨ q) ∧ ~p'];
  const tipos = {
    id: 'tautologia',
    titulo: 'Verdadera en todas las filas',
    temas: ['Tablas de verdad', 'Tautología, contradicción y contingencia'],
    pieza: 'arit-tabla',
    // Lee: los tres nombres y cómo contar filas; no clasifica la fórmula de Predice.
    lee: {
      tarjetas: [
        { titulo: 'Siempre, nunca, a veces', texto: '«Mañana llueve o no llueve» es verdadera pase lo que pase. «Llueve y no llueve» no lo es nunca. Casi todas las demás frases dependen de cómo amanezca el día.' },
        { titulo: 'Tres nombres', texto: 'Si una fórmula sale V en todas las filas de su tabla, es una tautología. Si sale F en todas, es una contradicción. Si depende de la fila, es una contingencia.' },
        { titulo: 'Qué mirar', texto: 'Con dos letras, la tabla tiene cuatro filas. Al jugar, cuenta cuántas V salen en la última columna antes de ponerle nombre a la fórmula.' },
      ],
    },
    juega: {
      consigna: 'Elige una fórmula y mira su tabla completa. Cuenta en cuántas de las cuatro filas sale V.',
      voz: 'Busca una que siempre sea V y otra que nunca lo sea.',
      controles: [{ id: 't', etiqueta: 'Fórmula', opciones: LISTA.map(t => ({ valor: t, texto: t })), inicio: LISTA[0] }],
      dibujo: v => ({ datos: tabla([v.t], { falsaRoja: true }), estado: {} }),
      lectura: v => [`V en ${columna(v.t).filter(Boolean).length} de 4 filas: ${clase(v.t)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Qué es (p → q) ∨ (q → p)?',
      opciones: [
        { id: 'c', texto: 'Tautología: V en todas las filas', correcta: true },
        { id: 'cont', texto: 'Contingencia: depende de p y q', error: 'AT-TAUTO', siFuera: 'Sería cierto si alguna fila diera F. Cada fila falla en a lo más una flecha.' },
        { id: 'contra', texto: 'Contradicción: F en todas', error: 'AT-TAUTO', siFuera: 'Sería cierto si las dos flechas fallaran juntas, y eso no pasa.' },
      ],
      dibujo: { datos: tabla(['(p → q) ∨ (q → p)'], { solo: -1 }), estado: {} },
      revelar: { datos: tabla(['(p → q) ∨ (q → p)'], { falsaRoja: true }), estado: {} },
      coincide: 'Coincide: en cada fila, al menos una de las flechas es V.',
    },
    mira: {
      datos: tabla(['(p → q) ∨ (q → p)'], { porFila: true }),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'V-V: las dos flechas son V.', ecuacion: ['V ∨ V = V'] },
        { estado: { paso: 2, fila: 1 }, texto: 'V-F: falla p → q, pero q → p es V.', ecuacion: ['F ∨ V = V'] },
        { estado: { paso: 3, fila: 2 }, texto: 'F-V: falla q → p, pero p → q es V.', ecuacion: ['V ∨ F = V'] },
        { estado: { paso: 4, fila: 3 }, texto: 'F-F: las dos son V. Cuatro de cuatro: tautología.', ecuacion: ['V ∨ V = V'] },
      ],
    },
    regla: {
      texto: 'En su tabla de verdad, una tautología es V en todas las filas; una contradicción, en ninguna; una contingencia, solo en algunas. Se revisan todas.',
      ecuacion: ['n variables → ', { llave: [{ sup: ['2', 'n'] }], nota: 'filas' }],
      condicion: 'se revisan todas las combinaciones de valores. Que salga V en las primeras filas no basta.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const t = r.de(['p ∨ ~p', 'p ∧ ~p', '(p ∧ q) → p', 'p → (p ∨ q)', '~(p → q) ∧ q', '(p ↔ q) ∧ (p ∧ ~q)', 'p ∨ (q ∧ ~q)', '(p ∧ q) ∨ ~q', '~p ∨ q', 'p ↔ q']);
        const c = clase(t), col = columna(t), nV = filasV(t);
        const nombre = i => `${VF(FILAS[i][0])}-${VF(FILAS[i][1])}`;
        const iV = col.indexOf(true), iF = col.indexOf(false);
        return {
          enunciado: `¿Qué es ${t}: tautología, contradicción o contingencia?`,
          dibujo: { datos: tabla([t], { solo: -1 }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el tipo de ${t}, según lo que sale en su tabla.` },
            { tipo: 'datos', texto: 'Se trabaja con las letras p y q: la tabla tiene 4 filas, V-V, V-F, F-V y F-F.', ecuacion: [{ sup: ['2', '2'] }, ' = 4 filas'] },
            { tipo: 'regla', texto: 'Cuento las V de la columna: si son todas, es tautología; si no hay ninguna, contradicción; si hay algunas, contingencia.' },
            { tipo: 'cuentas', texto: 'Calculo la fórmula fila por fila, en el orden de la tabla.', ecuacion: [`${t}: ${col.map(VF).join(' ')}`],
              dibujo: { datos: tabla([t], { falsaRoja: true }), estado: {} } },
            { tipo: 'sentido', texto: c === 'tautología' ? `Salen ${nV} V de 4: ninguna fila la hace falsa.`
              : c === 'contradicción' ? 'Salen 0 V de 4: ninguna fila la hace verdadera.'
              : `Salen ${nV} V de 4: la fila ${nombre(iV)} da V y la fila ${nombre(iF)} da F, así que depende de los valores.` },
          ],
          respuesta: `${t} es una ${c}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const t = r.de(['p ∨ ~p', 'p ∧ ~p', '(p ∧ q) → p', 'p → (p ∨ q)', '~(p → q) ∧ q', '(p ↔ q) ∧ (p ∧ ~q)', 'p ∨ (q ∧ ~q)', '(p ∧ q) ∨ ~q', '~p ∨ q', 'p ↔ q']);
        const c = clase(t);
        const otros = ['tautología', 'contradicción', 'contingencia'].filter(x => x !== c);
        return {
          pregunta: `¿Qué es ${t}?`,
          dibujo: { datos: tabla([t], { solo: -1 }), estado: {} },
          opciones: [{ id: 'c', texto: c, correcta: true }, ...otros.map((x, k) => ({ id: 'o' + k, texto: x, error: 'AT-TAUTO', siFuera: `Revisa las cuatro filas: ${t} sale V en ${columna(t).filter(Boolean).length}.` }))],
          solucion: { texto: `V en ${columna(t).filter(Boolean).length} de 4 filas.`, ecuacion: [`${t}: ${columna(t).map(VF).join(' ')}`], dibujo: { datos: tabla([t], { falsaRoja: true }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: equivalentes = misma tabla (De Morgan) ----------
  // Cambia: la fórmula candidata. Permanece: ~(p ∧ q) en la primera columna. Progresa: filas que coinciden.
  // Se reserva: la ley para ~(p ∨ q). Debe verse: una sola fila distinta basta para que no sean equivalentes.
  const leyes = {
    id: 'de-morgan',
    titulo: 'Equivalente es misma tabla',
    temas: ['Leyes lógicas'],
    pieza: 'arit-tabla',
    // Lee: qué quiere decir equivalente y cómo se comprueba; no da la ley para ~(p ∨ q) (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Decir lo mismo', texto: 'Dos frases distintas pueden decir lo mismo con otras palabras. En lógica no se decide por cómo suenan: se comprueba con la tabla, fila por fila.' },
        { titulo: 'Equivalentes', texto: 'Dos fórmulas son equivalentes si su columna es igual en las cuatro filas. Se escribe con ≡. Ya viste un caso: el condicional y «no p, o q».',
          ecuacion: [P, ' → ', Q, ' ≡ ~', P, ' ∨ ', Q] },
        { titulo: 'Qué mirar', texto: 'En el juego, la primera columna es ~(p ∧ q) y la segunda, una candidata. Prueba cada candidata y mira si queda alguna fila resaltada.' },
      ],
    },
    juega: {
      consigna: 'Compara ~(p ∧ q) con una candidata. Las filas resaltadas son donde no coinciden.',
      voz: 'Una sola fila distinta ya las separa.',
      controles: [{ id: 'c', etiqueta: 'Candidata', opciones: ['~p ∧ ~q', '~p ∨ ~q', 'p → ~q'].map(t => ({ valor: t, texto: t })), inicio: '~p ∧ ~q' }],
      dibujo: v => ({ datos: tabla(['~(p ∧ q)', v.c], { distintas: true }), estado: {} }),
      lectura: v => [`Coinciden en ${columna('~(p ∧ q)').filter((x, i) => x === columna(v.c)[i]).length} de 4 filas`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es equivalente a ~(p ∨ q)?',
      opciones: [
        { id: 'c', texto: '~p ∧ ~q', correcta: true },
        { id: 'o', texto: '~p ∨ ~q', error: 'AT-DEMORGAN', siFuera: 'Esa es la negación de p ∧ q. Al negar, el ∨ se vuelve ∧.' },
        { id: 'sin-neg', texto: 'p ∧ q', error: 'AT-DEMORGAN', siFuera: 'Cambiaste el conectivo pero no negaste cada parte.' },
      ],
      dibujo: { datos: tabla(['~(p ∨ q)', '~p ∧ ~q'], { solo: -1 }), estado: {} },
      revelar: { datos: tabla(['~(p ∨ q)', '~p ∧ ~q'], { distintas: true }), estado: {} },
      coincide: 'Coincide: las dos columnas son iguales en las cuatro filas.',
    },
    mira: {
      datos: tabla(['~(p ∨ q)', '~p ∨ ~q'], { porFila: true, distintas: true }),
      pasos: [
        { estado: { paso: 1 }, texto: 'V-V: las dos son F.', ecuacion: ['~(V ∨ V) = F   ·   F ∨ F = F'] },
        { estado: { paso: 2, fila: 1 }, texto: 'V-F: ya no coinciden. Una fila basta para separarlas.', ecuacion: ['~(V ∨ F) = F   ·   F ∨ V = V'] },
        { estado: { paso: 4, fila: [1, 2] }, texto: 'La que sí coincide en todas es ~p ∧ ~q.', ecuacion: ['~(', P, ' ∨ ', Q, ') ≡ ~', P, ' ∧ ~', Q] },
      ],
    },
    regla: {
      texto: 'Dos fórmulas son equivalentes si tienen la misma tabla. Leyes de De Morgan: al negar, cada parte se niega y ∧ se cambia por ∨.',
      ecuacion: [{ llave: ['~(', P, ' ∧ ', Q, ')'], nota: 'negar el «y»' }, ' ≡ ', { llave: ['~', P, ' ∨ ~', Q], nota: 'cada parte negada' }, '   ·   ', '~(', P, ' ∨ ', Q, ') ≡ ~', P, ' ∧ ~', Q],
      condicion: 'se comparan todas las filas. Que dos frases suenen parecido no las hace equivalentes.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const t = r.de(['~(p ∧ q)', '~(p ∨ q)', 'p → q', '~p ∨ q', '~q → ~p']);
        const todas = ['~p ∨ ~q', '~p ∧ ~q', '~p ∨ q', 'q → p', 'p ∧ ~q', 'p ∨ q', 'p → ~q', '~q → ~p', 'p → q'];
        const buena = r.de(todas.filter(x => x !== t && iguales(x, t))), mala = r.de(todas.filter(x => !iguales(x, t)));
        const [c1, c2] = r() < 0.5 ? [buena, mala] : [mala, buena];
        const i = FILAS.findIndex((_, k) => columna(mala)[k] !== columna(t)[k]);
        const col = x => `${x}: ${columna(x).map(VF).join(' ')}`;
        return {
          enunciado: `¿Cuál es equivalente a ${t}: ${c1} o ${c2}?`,
          dibujo: { datos: tabla([t], { solo: -1 }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuál de las dos candidatas tiene la misma tabla que ${t}.` },
            { tipo: 'datos', texto: `Las candidatas son ${c1} y ${c2}. Las tres fórmulas usan p y q: hay 4 filas para comparar.` },
            { tipo: 'regla', texto: 'Dos fórmulas son equivalentes si coinciden en todas las filas. Con una sola fila distinta, ya no lo son.' },
            { tipo: 'cuentas', texto: 'Escribo la columna de cada una, en el orden V-V, V-F, F-V, F-F.', ecuacion: [col(t), '   ·   ', col(c1), '   ·   ', col(c2)],
              dibujo: { datos: tabla([t, buena], { distintas: true }), estado: {} } },
            { tipo: 'sentido', texto: `${mala} no coincide en la fila p = ${VF(FILAS[i][0])}, q = ${VF(FILAS[i][1])}; ${buena} coincide en las cuatro.`,
              dibujo: { datos: tabla([t, mala], { distintas: true }), estado: { fila: i } } },
          ],
          respuesta: `${buena} ≡ ${t}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const objetivos = ['~(p ∧ q)', '~(p ∨ q)', 'p → q', '~p ∨ q', '~q → ~p'];
        const t = objetivos[s % objetivos.length];
        const todas = ['~p ∨ ~q', '~p ∧ ~q', '~p ∨ q', 'q → p', 'p ∧ ~q', 'p ∨ q', 'p → ~q', '~q → ~p', 'p → q'];
        const buenas = todas.filter(x => x !== t && iguales(x, t)), malas = todas.filter(x => !iguales(x, t));
        const buena = r.de(buenas);
        const ms = malas.slice().sort((a, b) => (r() < 0.5 ? -1 : 1)).slice(0, 3);
        const difiere = m => FILAS.findIndex((_, i) => columna(m)[i] !== columna(t)[i]);
        return {
          pregunta: `¿Cuál es equivalente a ${t}?`,
          opciones: [{ id: 'c', texto: buena, correcta: true }, ...ms.map((m, k) => { const i = difiere(m); return { id: 'm' + k, texto: m, error: m === 'q → p' ? 'AT-RECIPROCO' : 'AT-DEMORGAN', siFuera: `Coinciden en algunas filas, pero en p = ${VF(FILAS[i][0])}, q = ${VF(FILAS[i][1])} difieren.` }; })],
          solucion: { texto: 'Tienen la misma columna en las cuatro filas.', ecuacion: [`${t}: ${columna(t).map(VF).join(' ')}   ·   ${buena}: ${columna(buena).map(VF).join(' ')}`], dibujo: { datos: tabla([t, buena], { distintas: true }), estado: {} } },
          dibujo: { datos: tabla([t], { solo: -1 }), estado: {} },
        };
      },
    },
  };

  // ---------- Idea 5: cuantificadores sobre un dominio ----------
  // Cambia: el tamaño del dominio y la propiedad. Permanece: la recta con los elementos del dominio.
  // Progresa: puntos que cumplen (verdes) y los que no (rojos). Se reserva: la negación de «para todo».
  // Debe verse: un solo punto rojo basta para que «para todo» sea falso y «existe» lo niegue.
  const PROP = {
    'x es par': x => x % 2 === 0,
    'x < 6': x => x < 6,
    'x² ≥ x': x => x * x >= x,
    'x > 3': x => x > 3,
  };
  const dominio = n => Array.from({ length: n }, (_, k) => k + 1);
  const rectaD = (n, prop, extra = {}) => Object.assign({
    min: 0, max: Math.max(10, n + 1), paso: 1, variable: 'x', decimales: 0, filas: 1,
    elementos: dominio(n).map(x => ({ tipo: 'punto', x, fila: 0, color: PROP[prop](x) ? 'd' : 'h', abierto: !PROP[prop](x) })),
  }, extra);
  const cuanti = {
    id: 'cuantificadores',
    titulo: 'Para todo y existe',
    temas: ['Cuantificadores'],
    pieza: 'recta',
    // Lee: qué dicen ∀ y ∃ y qué es el dominio; no dice cómo se niega un cuantificador (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Todos o alguno', texto: '«Todos en el aula viven en Juliaca» y «alguien en el aula vive en Puno» no piden lo mismo. La primera habla de cada uno; la segunda, de por lo menos uno.' },
        { titulo: 'Símbolos', texto: '∀ se lee «para todo» y ∃ se lee «existe». Siempre se dice dónde se busca: el dominio, que es el conjunto de elementos que se revisan, como {1, 2, …, 8}.',
          ecuacion: ['∀x P(x)   ·   ∃x P(x)'] },
        { titulo: 'Qué mirar', texto: 'En la recta, los puntos llenos cumplen la propiedad y los huecos no. Cambia n y la propiedad, y cuenta cuántos puntos llenos y cuántos huecos quedan.' },
      ],
    },
    juega: {
      consigna: 'El dominio es {1, 2, …, n}. Elige n y una propiedad. Los puntos llenos la cumplen; los huecos, no.',
      voz: 'Busca un caso donde «para todo» sea verdadero.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 3, max: 9, paso: 1, inicio: 5, decimales: 0 },
        { id: 'pr', etiqueta: 'Propiedad', opciones: Object.keys(PROP).map(t => ({ valor: t, texto: t })), inicio: 'x es par' },
      ],
      dibujo: v => ({ datos: rectaD(v.n, v.pr), estado: {} }),
      lectura: v => { const d = dominio(v.n); return [`∀x: ${VF(d.every(PROP[v.pr]))} · ∃x: ${VF(d.some(PROP[v.pr]))}`]; },
      minimo: 3,
      // Se arrastra el último elemento del dominio: el dominio crece o se achica.
      arrastres: [{ id: 'ultimo', etiqueta: 'último elemento del dominio (n)',
        donde: v => { const dd = rectaD(v.n, v.pr), g = RECTA().geometria(dd); return { x: g.x(v.n), y: g.eje }; },
        mover: (pt, v) => { const g = RECTA().geometria(rectaD(v.n, v.pr)); return { n: inversa(g.x, 0, 10)(pt.x) }; } }],
    },
    predice: {
      pregunta: 'En el dominio {1, 2, …, 8}, ¿cuál es la negación de «para todo x, x < 6»?',
      opciones: [
        { id: 'c', texto: 'Existe x con x ≥ 6', correcta: true },
        { id: 'todo', texto: 'Para todo x, x ≥ 6', error: 'AT-NEG-CUANT', siFuera: 'Eso es más fuerte: basta un solo x que no cumpla para negar «para todo».' },
        { id: 'existe', texto: 'Existe x con x < 6', error: 'AT-NEG-CUANT', siFuera: 'Esa frase no contradice a la original: las dos pueden ser V.' },
        { id: 'mayor', texto: 'Para todo x, x > 6', error: 'AT-NEG-CUANT', siFuera: 'Además de no cambiar el cuantificador, deja fuera x = 6.' },
      ],
      dibujo: { datos: rectaD(8, 'x < 6', { elementos: dominio(8).map(x => ({ tipo: 'punto', x, color: 'o' })) }), estado: {} },
      revelar: { datos: rectaD(8, 'x < 6'), estado: {} },
      coincide: 'Coincide: 6, 7 y 8 no cumplen; con uno basta para negar el «para todo».',
    },
    mira: {
      datos: rectaD(8, 'x < 6', { elementos: [...rectaD(8, 'x < 6').elementos.map(e => ({ ...e, desde: 1 })), { tipo: 'intervalo', a: 6, b: 8, ca: true, cb: true, color: 'h', rotulo: 'x ≥ 6', fila: 1, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Del 1 al 5 se cumple x < 6.', ecuacion: ['P(x): x < 6'] },
        { estado: { corte: 2 }, texto: 'El 6, el 7 y el 8 no cumplen: «para todo» es F.', ecuacion: ['∀x P(x) = F'] },
        { estado: { corte: 2 }, texto: 'Negar «para todo» es decir que existe uno que no cumple.', ecuacion: ['~∀x P(x) ≡ ∃x ~P(x)'] },
      ],
    },
    regla: {
      texto: 'Cuantificadores: «para todo» es falso si un elemento no cumple (un contraejemplo); «existe» es verdadero si uno cumple. Al negar, ∀ se cambia por ∃ y se niega la propiedad.',
      ecuacion: ['~∀x P(x) ≡ ', { llave: ['∃x ~P(x)'], nota: 'un contraejemplo' }, '   ·   ', '~∃x P(x) ≡ ∀x ~P(x)'],
      condicion: 'el dominio está dicho. La misma frase puede ser V en un dominio y F en otro.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(4, 9), pr = r.de(Object.keys(PROP)), d = dominio(n);
        const cual = r.de(['∀', '∃', '~∀']);
        const todosC = d.every(PROP[pr]), alguno = d.some(PROP[pr]);
        const v = cual === '∀' ? todosC : cual === '∃' ? alguno : !todosC;
        const frase = cual === '∀' ? `para todo x, ${pr}` : cual === '∃' ? `existe x tal que ${pr}` : `no es cierto que para todo x, ${pr}`;
        const si = d.filter(PROP[pr]), no = d.filter(x => !PROP[pr](x));
        const regla = cual === '∀' ? '«Para todo» es V solo si cumplen todos. Un solo elemento que no cumple, un contraejemplo, ya la hace F.'
          : cual === '∃' ? '«Existe» es V apenas un elemento cumple. Solo es F si no cumple ninguno.'
          : '«No es cierto que para todo» equivale a «existe uno que no cumple».';
        const sentido = cual === '∃'
          ? (alguno ? `Basta un ejemplo: x = ${f(si[0])} cumple «${pr}».` : 'Ningún punto está lleno: no hay ejemplo que la haga V.')
          : (no.length ? `x = ${f(no[0])} no cumple: ${cual === '∀' ? 'ese contraejemplo basta para que sea F' : '«para todo» es F, y su negación es V'}.`
            : `No hay ningún hueco en la recta: ${cual === '∀' ? 'no existe contraejemplo' : '«para todo» es V, y su negación es F'}.`);
        return {
          enunciado: `En el dominio {1, 2, …, ${n}}, ¿es verdadera o falsa la frase «${frase}»?`,
          dibujo: { datos: rectaD(n, pr, { elementos: d.map(x => ({ tipo: 'punto', x, color: 'o' })) }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden si «${frase}» es verdadera o falsa.` },
            { tipo: 'datos', texto: `El dominio tiene ${n} elementos, del 1 al ${n}. La propiedad es «${pr}».` },
            { tipo: 'regla', texto: regla },
            { tipo: 'cuentas', texto: `Pruebo cada x del 1 al ${n} y separo los que cumplen de los que no.`,
              ecuacion: [`cumplen: ${llaves(si)}   ·   no cumplen: ${llaves(no)}`], dibujo: { datos: rectaD(n, pr), estado: {} } },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `La frase es ${v ? 'verdadera' : 'falsa'}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(4, 9), pr = r.de(Object.keys(PROP)), d = dominio(n);
        const cual = r.de(['∀', '∃', '~∀']);
        const v = cual === '∀' ? d.every(PROP[pr]) : cual === '∃' ? d.some(PROP[pr]) : !d.every(PROP[pr]);
        const frase = cual === '∀' ? `para todo x, ${pr}` : cual === '∃' ? `existe x tal que ${pr}` : `no es cierto que para todo x, ${pr}`;
        const contra = d.find(x => !PROP[pr](x)), testigo = d.find(PROP[pr]);
        return {
          pregunta: `En el dominio {1, 2, …, ${n}}, ¿es verdadera o falsa la frase «${frase}»?`,
          dibujo: { datos: rectaD(n, pr, { elementos: d.map(x => ({ tipo: 'punto', x, color: 'o' })) }), estado: {} },
          opciones: [
            { id: 'c', texto: v ? 'Verdadera' : 'Falsa', correcta: true },
            { id: 'otro', texto: v ? 'Falsa' : 'Verdadera', error: 'AT-NEG-CUANT', siFuera: '«Para todo» cae con un contraejemplo; «existe» se gana con un solo ejemplo.' },
          ],
          solucion: {
            texto: contra !== undefined ? `x = ${f(contra)} no cumple ${pr}.` : `Todos cumplen; por ejemplo x = ${f(testigo)}.`,
            ecuacion: [`cumplen: {${d.filter(PROP[pr]).join(', ') || '∅'}}`],
            dibujo: { datos: rectaD(n, pr), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  const LAB_F = ['p → q', 'q → p', '~q → ~p', '~p ∨ q', 'p ↔ q', '~(p ∧ q)', '~p ∨ ~q', '~p ∧ ~q'];
  const PROP_LAB = {
    'x es primo': x => x > 1 && Array.from({ length: x - 2 }, (_, k) => k + 2).every(d => x % d),
    'x es par': x => x % 2 === 0,
    'x² ≥ x': x => x * x >= x,
    'x divide a 12': x => 12 % x === 0,
    'x < 15': x => x < 15,
  };
  // Cuántas filas comparten las dos fórmulas y cuántos elementos del dominio cumplen: lo mismo que leen la lectura y los retos.
  const coinciden = v => columna(v.a).filter((x, i) => x === columna(v.b)[i]).length;
  const MENOS = Math.min(...LAB_F.flatMap(a => LAB_F.map(b => coinciden({ a, b }))));
  const parEquiv = v => v.a !== v.b && iguales(v.a, v.b);
  const cumplen = v => dominio(v.n).filter(PROP_LAB[v.pr]).length;
  const todos = v => cumplen(v) === v.n;
  const rectaLab = (n, prop) => ({
    min: 0, max: 21, paso: 1, cada: 5, variable: 'x', decimales: 0, filas: 0,
    elementos: dominio(n).map(x => ({ tipo: 'punto', x, fila: 0, color: PROP_LAB[prop](x) ? 'd' : 'h', abierto: !PROP_LAB[prop](x) })),
  });

  return {
    unidad: 'aritmetica.logica-proposicional',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/recta.js'],
    // Glosario del tema (docs/teoria.md, 4d): lo que esta unidad estrena en aritmética; las demás lo heredan.
    glosario: [
      { termino: 'proposición', def: 'Frase que es verdadera (V) o falsa (F) sin necesitar más datos.',
        ejemplo: '«15 es múltiplo de 4» es una, y vale F. «¿Qué hora es?» no lo es.', ver: ['conectivo'] },
      { termino: 'conectivo', def: 'Signo que une o modifica frases V o F para formar otra: ∧ («y»), ∨ («o»), →, ↔ y ~.',
        ejemplo: 'Con p = V y q = F: p ∧ q = F.', ver: ['proposición', 'tabla de verdad'] },
      { termino: 'disyunción', simbolo: '∨', def: 'Unión con «o»: es verdadera si al menos una parte lo es; solo es falsa en F-F.',
        ejemplo: 'V ∨ V = V y F ∨ F = F.', ver: ['conectivo'] },
      { termino: 'negación', simbolo: '~', def: 'Cambiar el valor de una frase: lo verdadero pasa a falso y lo falso, a verdadero.',
        ejemplo: 'Si p = V, ~p = F.', ver: ['leyes de De Morgan'] },
      { termino: 'condicional', simbolo: '→', def: '«Si p, entonces q». Solo es falso cuando p es verdadera y q es falsa.',
        ejemplo: 'Con p = F, p → q = V, sea q como sea.', ver: ['recíproco', 'contrarrecíproca'] },
      { termino: 'recíproco', def: 'La flecha con sus partes intercambiadas: de p → q se pasa a q → p. No vale lo mismo.',
        ejemplo: 'Con p = V y q = F: p → q = F, pero q → p = V.', ver: ['condicional'] },
      { termino: 'contrarrecíproca', def: 'De p → q se pasa a ~q → ~p: partes intercambiadas y negadas. Tiene la misma tabla.',
        ejemplo: '«Si llueve, me mojo» equivale a «si no me mojo, no llueve».', ver: ['condicional', 'equivalente'] },
      { termino: 'tabla de verdad', formas: ['tabla de verdad', 'tablas de verdad'],
        def: 'Todas las combinaciones de V y F de las letras, con lo que vale la fórmula en cada una.',
        ejemplo: 'Con p y q hay 2² = 4 filas: VV, VF, FV, FF.', ver: ['tautología'] },
      { termino: 'tautología', def: 'Fórmula que sale V en todas las filas de su tabla, valgan lo que valgan sus letras.',
        ejemplo: 'p ∨ ~p: V en sus dos filas.', ver: ['contradicción', 'contingencia'] },
      { termino: 'contradicción', def: 'Fórmula que sale F en todas las filas de su tabla.',
        ejemplo: 'p ∧ ~p: F en sus dos filas.', ver: ['tautología', 'contingencia'] },
      { termino: 'contingencia', def: 'Fórmula que sale V en algunas filas y F en otras: depende de los valores de sus letras.',
        ejemplo: 'p → q: V en 3 filas y F en 1.', ver: ['tautología', 'contradicción'] },
      { termino: 'equivalente', formas: ['equivalente', 'equivalentes'],
        def: 'Se dice de dos fórmulas con la misma columna en todas las filas: una puede reemplazar a la otra.',
        ejemplo: 'p → q y ~p ∨ q: las dos salen V, F, V, V.', ver: ['leyes de De Morgan'] },
      { termino: 'leyes de De Morgan', formas: ['leyes de De Morgan', 'De Morgan'],
        def: 'Al negar un «y» o un «o», se niega cada parte y ∧ se cambia por ∨, o al revés.',
        ejemplo: '~(p ∧ q) ≡ ~p ∨ ~q.', ver: ['negación', 'equivalente'] },
      { termino: 'cuantificador', def: '«Para todo» (∀) o «existe» (∃): dice si la propiedad se pide a todos los objetos o a alguno.',
        ejemplo: 'En {1, 2, 3}, «existe x par» es V; «para todo x par» es F.', ver: ['elemento'] },
      { termino: 'elemento', def: 'Cada uno de los objetos que forman un conjunto, como el 2 en {1, 2, 3}.',
        ejemplo: 'El dominio {1, 2, …, 8} tiene 8.', ver: ['conjunto', 'cuantificador'] },
      { termino: 'número primo', formas: ['número primo', 'números primos', 'primo', 'primos'],
        def: 'Entero mayor que 1 que solo se divide exacto entre 1 y entre sí mismo.',
        ejemplo: '13 lo es; 91 no, porque 91 = 7 · 13.' },
    ],
    // Laboratorio: juego libre, sin preguntas. La primera mesa compara dos fórmulas cualesquiera (más de las que dejan
    // las ideas); la segunda lleva los cuantificadores a un dominio de hasta 20 elementos, con más propiedades.
    laboratorio: [
      {
        id: 'dos-formulas', titulo: 'Dos fórmulas, una tabla', pieza: 'arit-tabla',
        consigna: 'Elige dos fórmulas. Las filas resaltadas son donde no coinciden. Arrastra la fila para mirarla de cerca.',
        controles: [
          { id: 'a', etiqueta: 'Primera', opciones: LAB_F.map(t => ({ valor: t, texto: t })), inicio: 'p → q' },
          { id: 'b', etiqueta: 'Segunda', opciones: LAB_F.map(t => ({ valor: t, texto: t })), inicio: 'q → p' },
          vfCtl('p', 'c-o'), vfCtl('q', 'c-i'),
        ],
        dibujo: v => ({ datos: tabla(v.a === v.b ? [v.a] : [v.a, v.b], { distintas: true }), estado: { fila: fila(v.p === 'V', v.q === 'V') } }),
        lectura: v => [`${v.a}, ${v.b}: ${coinciden(v)} de 4 iguales`],
        arrastres: [{ id: 'fila', etiqueta: 'fila de la tabla (valores de p y q)',
          donde: v => manijaFila(tabla([v.a, v.b]), fila(v.p === 'V', v.q === 'V')),
          mover: (pt, v) => { const k = filaEn(tabla([v.a, v.b]), pt.y); return { p: VF(FILAS[k][0]), q: VF(FILAS[k][1]) }; } }],
        invitaciones: [
          { texto: 'Encuentra dos fórmulas distintas que coincidan en las cuatro filas.',
            logrado: v => parEquiv(v),
            bien: 'Se escriben distinto y tienen la misma tabla: son equivalentes.' },
          { texto: 'Busca la pareja de fórmulas que menos filas comparte.',
            logrado: v => coinciden(v) === MENOS,
            bien: 'Comparten una sola fila. ¿Cuál es la fórmula que sería su negación?' },
          { texto: 'Lleva la fila a donde la primera fórmula es F y la segunda es V.',
            logrado: v => !FORM[v.a](v.p === 'V', v.q === 'V') && FORM[v.b](v.p === 'V', v.q === 'V'),
            bien: 'Esa fila sola ya prueba que no son equivalentes.' },
          { texto: 'Guarda dos parejas equivalentes cuyas tablas sean distintas entre sí.',
            logrado: (v, guardados) => parEquiv(v) && guardados.some(g => parEquiv(g) && !iguales(g.a, v.a)),
            bien: 'Dos familias distintas: la del condicional y la de De Morgan.' },
        ],
      },
      {
        id: 'dominio-grande', titulo: 'Un dominio más grande', pieza: 'recta',
        consigna: 'El dominio es {1, 2, …, n}, con n hasta 20. Arrastra el último punto y cambia la propiedad.',
        controles: [
          { id: 'n', etiqueta: 'n', min: 1, max: 20, paso: 1, inicio: 12, decimales: 0 },
          { id: 'pr', etiqueta: 'Propiedad', opciones: Object.keys(PROP_LAB).map(t => ({ valor: t, texto: t })), inicio: 'x es primo' },
        ],
        dibujo: v => ({ datos: rectaLab(v.n, v.pr), estado: {} }),
        lectura: v => { const c = cumplen(v); return [`n = ${f(v.n)}, ${v.pr}: cumplen ${f(c)} · ∀ ${VF(todos(v))} · ∃ ${VF(c > 0)}`]; },
        arrastres: [{ id: 'ultimo', etiqueta: 'último elemento del dominio (n)',
          donde: v => ({ x: RECTA().geometria(rectaLab(v.n, v.pr)).x(v.n), y: RECTA().geometria(rectaLab(v.n, v.pr)).eje }),
          mover: (pt, v) => { const g = RECTA().geometria(rectaLab(v.n, v.pr)); return { n: inversa(g.x, 0, 20)(pt.x) }; } }],
        invitaciones: [
          { texto: 'Con «x divide a 12», busca el mayor n en que «para todo» sigue V.',
            logrado: v => v.pr === 'x divide a 12' && todos(v) && !todos({ n: v.n + 1, pr: v.pr }),
            bien: 'Un paso más y aparece el contraejemplo: 5 no divide a 12.' },
          { texto: 'Haz que haya exactamente siete primos en el dominio.',
            logrado: v => v.pr === 'x es primo' && cumplen(v) === 7,
            bien: 'Siete primos, pero el 1 ya es un hueco: «para todo» es F.' },
          { texto: 'Deja un dominio donde ningún elemento cumpla la propiedad.',
            logrado: v => cumplen(v) === 0,
            bien: 'Nadie cumple: «existe» es F, y «para todo x, no cumple» es V.' },
          { texto: 'Guarda dos casos con la misma propiedad: «para todo» V en uno y F en otro.',
            logrado: (v, guardados) => guardados.some(g => g.pr === v.pr && todos(g) !== todos(v)),
            bien: 'La misma propiedad cambió de valor: el dominio también cuenta.' },
        ],
      },
    ],
    historia: {
      texto: 'Los argumentos se estudiaban desde la Antigüedad, pero sin un cálculo de símbolos. En 1854, George Boole publicó Las leyes del pensamiento y trató las condiciones compuestas con reglas explícitas, parecidas a las del álgebra. La idea que retomamos es suya: revisar todas las posibilidades en vez de aceptar una conclusión porque suena bien. Las letras y tablas de hoy son una presentación moderna.',
      pregunta: '¿Cómo sabrías que una regla funciona en todos los casos?',
      fuente: { titulo: 'O’Connor y Robertson, George Boole — MacTutor, Universidad de St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Boole/' },
    },
    ideas: [conectivos, condicional, tipos, leyes, cuanti],
  };
});
