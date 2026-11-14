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
      ecuacion: [P, ' ∧ ', Q, ' = V solo en V-V   ·   ', P, ' ∨ ', Q, ' = F solo en F-F'],
      condicion: 'cada parte tiene valor de verdad. Una pregunta o «x + 2 = 5» sin fijar x no son proposiciones.',
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
      texto: 'p → q solo es falsa cuando p es verdadera y q falsa. Por eso equivale a «no p, o q», y no a su recíproco q → p.',
      ecuacion: [P, ' → ', Q, ' ≡ ~', P, ' ∨ ', Q],
      condicion: 'p y q son proposiciones. La contrarrecíproca ~q → ~p sí tiene la misma tabla que p → q.',
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
      texto: 'Una tautología es V en todas las filas; una contradicción, en ninguna; una contingencia, solo en algunas. Para saberlo se revisan todas.',
      ecuacion: ['n variables → ', { sup: ['2', 'n'] }, ' filas'],
      condicion: 'se revisan todas las combinaciones de valores. Que salga V en las primeras filas no basta.',
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
      ecuacion: ['~(', P, ' ∧ ', Q, ') ≡ ~', P, ' ∨ ~', Q, '   ·   ~(', P, ' ∨ ', Q, ') ≡ ~', P, ' ∧ ~', Q],
      condicion: 'se comparan todas las filas. Que dos frases suenen parecido no las hace equivalentes.',
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
      texto: '«Para todo» es falso si un elemento no cumple; «existe» es verdadero si uno cumple. Al negar, ∀ se cambia por ∃ y se niega la propiedad.',
      ecuacion: ['~∀x P(x) ≡ ∃x ~P(x)   ·   ~∃x P(x) ≡ ∀x ~P(x)'],
      condicion: 'el dominio está dicho. La misma frase puede ser V en un dominio y F en otro.',
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

  return {
    unidad: 'aritmetica.logica-proposicional',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Los argumentos se estudiaban desde la Antigüedad, pero sin un cálculo de símbolos. En 1854, George Boole publicó Las leyes del pensamiento y trató las combinaciones de condiciones con reglas explícitas, parecidas a las del álgebra. La idea que retomamos es suya: revisar todas las posibilidades en vez de aceptar una conclusión porque suena bien. Las letras y tablas de hoy son una presentación moderna.',
      pregunta: '¿Cómo sabrías que una regla funciona en todos los casos?',
      fuente: { titulo: 'O’Connor y Robertson, George Boole — MacTutor, Universidad de St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Boole/' },
    },
    ideas: [conectivos, condicional, tipos, leyes, cuanti],
  };
});
