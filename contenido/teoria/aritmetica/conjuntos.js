/*
 * Teoría de «Conjuntos» (aritmetica.conjuntos). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 2) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: los AT-* son hipótesis de diseño (la matriz no atribuye prevalencias): confundir ∈ con ⊂, contar dos
 * veces la intersección, olvidar el vacío en el conjunto potencia, tomar los pares como no ordenados.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver cada operación como una condición de pertenencia y contar sin repetir la intersección.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio.
 *   Resultado observable: escribe el resultado de una operación, cuenta |A ∪ B| y |P(A)|, y distingue ∈ de ⊂.
 *   Orden de atención: 1.º las zonas punteadas del diagrama · 2.º lo que hay en cada zona · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · zonas por pasos · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué al sumar los dos grupos sale más gente de la que hay?».
 * Colores (regla 4): A naranja (c-o), B turquesa (c-i), lo que se pide (zona o resultado) verde (c-d); lo que se
 * cuenta dos veces, rojo (c-h). Piezas: arit-venn, arit-tabla (Carroll, potencia y producto cartesiano).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, Bv = { v: 'c-i', t: 'B' };
  const n = x => ['n(', x, ')'];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || (typeof d.valor === 'number' && (!Number.isFinite(d.valor) || d.valor < 0))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const llaves = xs => (xs.length ? `{${xs.join(', ')}}` : '∅');
  const sinLlaves = xs => xs.join(', ');
  const U9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Diagrama de A y B dentro de U: cada zona con sus elementos (lo calcula el código desde los conjuntos).
  function venn(Ae, Be, Ue, extra = {}) {
    const zona = x => (Ae.includes(x) ? 'A' : '') + (Be.includes(x) ? 'B' : '');
    const reg = { A: [], AB: [], B: [], '': [] };
    for (const x of Ue) reg[zona(x)].push(x);
    const regiones = {};
    for (const z in reg) if (reg[z].length) regiones[z] = sinLlaves(reg[z]);
    return Object.assign({ universo: 'U', conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: 'B', color: 'i' }], regiones, colorResalta: 'd' }, extra);
  }

  // ---------- Idea 1: un conjunto por su criterio; ∈ para elementos, ⊂ para conjuntos ----------
  // Cambia: el criterio de A. Permanece: U = {1, …, 9} y B = múltiplos de 4. Progresa: los elementos de A por zona.
  // Se reserva: un conjunto de un solo elemento, {2}, frente al elemento 2. Debe verse: B ⊂ A cuando B queda dentro.
  const CRIT = { 'x es par': x => x % 2 === 0, 'x < 5': x => x < 5, 'x es primo': x => [2, 3, 5, 7].includes(x) };
  const B4 = U9.filter(x => x % 4 === 0);
  const pertenencia = {
    id: 'pertenencia',
    titulo: 'Pertenecer no es estar incluido',
    temas: ['Determinación de conjuntos', 'Pertenencia e inclusión', 'Conjuntos especiales'],
    pieza: 'arit-venn',
    juega: {
      consigna: 'U = {1, …, 9} y B = múltiplos de 4. Elige el criterio de A y mira qué elementos caen dentro.',
      voz: 'Busca un criterio que deje a B entero dentro de A.',
      controles: [{ id: 'c', etiqueta: 'A: los x de U con', opciones: Object.keys(CRIT).map(t => ({ valor: t, texto: t })), inicio: 'x < 5' }],
      dibujo: v => ({ datos: venn(U9.filter(CRIT[v.c]), B4, U9), estado: {} }),
      lectura: v => { const Ae = U9.filter(CRIT[v.c]); return [A, ` = ${llaves(Ae)} · `, Bv, B4.every(x => Ae.includes(x)) ? ' ⊂ ' : ' ⊄ ', A]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Si ', A, ' = {1, 2, 3}, ¿cuál de estas frases es verdadera?'],
      opciones: [
        { id: 'c', texto: '{2} ⊂ A', correcta: true },
        { id: 'pertenece', texto: '{2} ∈ A', error: 'AT-PERTENECE', siFuera: 'Sería cierto si A tuviera al conjunto {2} como elemento. Sus elementos son números.' },
        { id: 'incluye', texto: '2 ⊂ A', error: 'AT-PERTENECE', siFuera: '⊂ compara dos conjuntos; 2 es un elemento, así que se escribe 2 ∈ A.' },
        { id: 'vacio', texto: '∅ ∈ A', error: 'AT-VACIO', siFuera: '∅ está incluido en A (∅ ⊂ A), pero no es uno de sus elementos.' },
      ],
      dibujo: { datos: venn([1, 2, 3], [2], [1, 2, 3, 4], { conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: '{2}', color: 'i' }] }), estado: {} },
      revelar: { datos: venn([1, 2, 3], [2], [1, 2, 3, 4], { conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: '{2}', color: 'i' }] }), estado: { resalta: ['AB'] } },
      coincide: 'Coincide: todo lo de {2} está en A, así que {2} ⊂ A.',
    },
    mira: {
      datos: venn(U9.filter(CRIT['x es par']), B4, U9),
      pasos: [
        { estado: { resalta: ['A', 'AB'] }, texto: 'Por comprensión: A son los pares de U. Por extensión: {2, 4, 6, 8}.', ecuacion: [A, ' = {x ∈ U : x par} = {2, 4, 6, 8}'] },
        { estado: { resalta: ['AB'] }, texto: 'El 4 está en la zona de A: 4 ∈ A.', ecuacion: ['4 ∈ ', A, '   ·   5 ∉ ', A] },
        { estado: { resalta: ['AB', 'B'] }, texto: 'Todo B cae dentro de A: B está incluido en A.', ecuacion: [Bv, ' = {4, 8} ⊂ ', A] },
      ],
    },
    regla: {
      texto: 'Un elemento pertenece (∈) a un conjunto; un conjunto está incluido (⊂) en otro si todos sus elementos están en él. Extensión y comprensión describen el mismo conjunto.',
      ecuacion: ['x ∈ ', A, '   ·   ', Bv, ' ⊂ ', A, ' ⟺ todo x ∈ ', Bv, ' está en ', A],
      condicion: '∅ no tiene elementos y está incluido en todo conjunto; {∅} sí tiene uno. U es el universo del problema.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const a = r.ent(1, 5), b = a + r.ent(6, 12), k = r.de([2, 3, 5]);
          const xs = []; for (let x = a; x < b; x++) if (x % k === 0) xs.push(x);
          return {
            pregunta: `¿Cuántos elementos tiene {x ∈ ℕ : ${a} ≤ x < ${b}, x múltiplo de ${k}}?`,
            opciones: opciones(xs.length, [
              { id: 'todos', valor: b - a, error: 'AT-CRITERIO', siFuera: 'Eso cuenta todos los x del tramo, sin el criterio de ser múltiplo.' },
              { id: 'uno-mas', valor: xs.length + 1, error: 'AT-EXTREMO', siFuera: `x < ${b} deja fuera al ${b}.` },
              { id: 'div', valor: Math.floor(b / k), error: 'AT-CRITERIO', siFuera: `Eso cuenta múltiplos desde 1, no desde ${a}.` },
            ], x => String(x)),
            solucion: { texto: 'Se escribe por extensión y se cuenta.', ecuacion: [`${llaves(xs)} → ${xs.length} elementos`] },
          };
        }
        if (tipo === 1) {
          const t = r.de([['∅', 0], ['{∅}', 1], ['{0}', 1], ['{∅, {∅}}', 2], ['{1, {1}}', 2]]);
          return {
            pregunta: `¿Cuántos elementos tiene ${t[0]}?`,
            opciones: opciones(t[1], [
              { id: 'cero', valor: 0, error: 'AT-VACIO', siFuera: 'Un conjunto que contiene a ∅ ya tiene un elemento: el ∅.' },
              { id: 'uno', valor: 1, error: 'AT-VACIO', siFuera: 'Cuenta cada cosa separada por comas entre las llaves exteriores.' },
              { id: 'dos', valor: 2, error: 'AT-VACIO', siFuera: 'Cuenta solo los elementos de las llaves de afuera.' },
            ], x => String(x)),
            solucion: { texto: 'Se cuentan los elementos de las llaves exteriores.', ecuacion: [`n(${t[0]}) = ${t[1]}`] },
          };
        }
        const Ae = [1, 2, 3, 4, 5, 6].filter(() => r() < 0.6).slice(0, 4);
        if (Ae.length < 2) Ae.push(7, 8);
        const x = r.de(Ae), y = Ae.find(z => z !== x);
        return {
          pregunta: ['Si ', A, ` = ${llaves(Ae)}, ¿cuál es verdadera?`],
          opciones: [
            { id: 'c', texto: `{${x}, ${y}} ⊂ A`, correcta: true },
            { id: 'pert', texto: `{${x}} ∈ A`, error: 'AT-PERTENECE', siFuera: `Lo que pertenece es ${x}; {${x}} es un conjunto incluido en A.` },
            { id: 'inc', texto: `${x} ⊂ A`, error: 'AT-PERTENECE', siFuera: `${x} es un elemento: se escribe ${x} ∈ A.` },
            { id: 'vacio', texto: '∅ ∈ A', error: 'AT-VACIO', siFuera: '∅ está incluido en A, pero no es uno de sus elementos.' },
          ],
          dibujo: { datos: venn(Ae, [x, y], [...new Set([...Ae, 9])]), estado: {} },
          solucion: { texto: 'Los dos elementos están en A: el conjunto está incluido.', ecuacion: [`${x} ∈ A, ${y} ∈ A → {${x}, ${y}} ⊂ A`] },
        };
      },
    },
  };

  // ---------- Idea 2: cada operación es una zona ----------
  // Cambia: la operación. Permanece: A, B y U, con sus elementos en su zona. Progresa: las zonas punteadas.
  // Se reserva: A ∩ B′, que no está en la lista. Debe verse: la misma zona en el Venn y en la tabla de Carroll.
  const AA = [1, 2, 3, 4, 6], BB = [3, 4, 5, 7], UU = [1, 2, 3, 4, 5, 6, 7, 8];
  const OPS = {
    'A ∪ B': ['A', 'AB', 'B'], 'A ∩ B': ['AB'], 'A − B': ['A'], 'B − A': ['B'], 'A′': ['B', ''], 'A Δ B': ['A', 'B'], 'B′': ['A', ''], '(A ∪ B)′': [''],
  };
  const elementos = (Ae, Be, Ue, zonas) => Ue.filter(x => zonas.includes((Ae.includes(x) ? 'A' : '') + (Be.includes(x) ? 'B' : '')));
  const carroll = (Ae, Be, Ue) => {
    const c = (a, b) => sinLlaves(Ue.filter(x => Ae.includes(x) === a && Be.includes(x) === b)) || '—';
    return { columnas: ['', { t: 'B', color: 'i' }, { t: 'no B', color: 'i' }], cabeza: true, filasMax: 2,
      filas: [[{ t: 'A', color: 'o' }, c(true, true), c(true, false)], [{ t: 'no A', color: 'o' }, c(false, true), c(false, false)]] };
  };
  const operaciones = {
    id: 'operaciones',
    titulo: 'Cada operación es una zona',
    temas: ['Operaciones con conjuntos', 'Diagramas de Venn y Carroll'],
    pieza: 'arit-venn',
    juega: {
      consigna: 'A, B y U ya tienen sus elementos. Elige una operación y mira qué zonas se puntean.',
      voz: 'Lee cada operación como una condición: está en A, y no en B…',
      controles: [{ id: 'o', etiqueta: 'Operación', opciones: ['A ∪ B', 'A ∩ B', 'A − B', 'B − A', 'A′', 'A Δ B'].map(t => ({ valor: t, texto: t })), inicio: 'A ∪ B' }],
      dibujo: v => ({ datos: venn(AA, BB, UU), estado: { resalta: OPS[v.o] } }),
      lectura: v => [`${v.o} = ${llaves(elementos(AA, BB, UU, OPS[v.o]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Con estos ', A, ' y ', Bv, ', ¿qué es ', A, ' ∩ ', Bv, '′ (en A y no en B)?'],
      opciones: [
        { id: 'c', texto: '{1, 2, 6}', correcta: true },
        { id: 'inter', texto: '{3, 4}', error: 'AT-OPERACION', siFuera: 'Eso es A ∩ B. El ′ pide lo que NO está en B.' },
        { id: 'comp', texto: '{1, 2, 6, 8}', error: 'AT-OPERACION', siFuera: 'Eso es B′ entero; falta pedir además que esté en A.' },
        { id: 'union', texto: '{1, 2, 3, 4, 6, 8}', error: 'AT-OPERACION', siFuera: 'Eso es A ∪ B′: «y» pide las dos condiciones a la vez.' },
      ],
      dibujo: { datos: venn(AA, BB, UU), estado: {} },
      revelar: { datos: venn(AA, BB, UU), estado: { resalta: ['A'] } },
      coincide: 'Coincide: A ∩ B′ es la misma zona que A − B.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: carroll(AA, BB, UU),
      pasos: [
        { estado: {}, texto: 'La tabla de Carroll tiene las mismas cuatro zonas que el Venn.', ecuacion: ['filas: A o no A   ·   columnas: B o no B'] },
        { estado: { fila: 0 }, texto: 'La fila A: todo lo que está en A.', ecuacion: [A, ' = {1, 2, 3, 4, 6}'] },
        { estado: { fila: 0, columna: 2 }, texto: 'El cruce con «no B» es A ∩ B′.', ecuacion: [A, ' ∩ ', Bv, '′ = ', A, ' − ', Bv, ' = {1, 2, 6}'] },
      ],
    },
    regla: {
      texto: 'Cada operación es una condición de pertenencia: ∪ pide estar en uno, ∩ en los dos, − en el primero y no en el segundo, y A′ no estar en A.',
      ecuacion: [A, ' − ', Bv, ' = ', A, ' ∩ ', Bv, '′   ·   ', A, ' Δ ', Bv, ' = (', A, ' − ', Bv, ') ∪ (', Bv, ' − ', A, ')'],
      condicion: 'el complemento depende del universo U: con otro U, A′ cambia. Venn y Carroll muestran criterios, no tamaños.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), Ue = [1, 2, 3, 4, 5, 6, 7, 8];
        const Ae = Ue.filter(() => r() < 0.5), Be = Ue.filter(() => r() < 0.5);
        if (!Ae.length) Ae.push(1); if (!Be.length) Be.push(8);
        const nombres = Object.keys(OPS), op = nombres[s % nombres.length];
        const res = elementos(Ae, Be, Ue, OPS[op]);
        return {
          pregunta: ['Con ', A, ` = ${llaves(Ae)}, `, Bv, ` = ${llaves(Be)} y U = {1, …, 8}, ¿qué es ${op}?`],
          dibujo: { datos: venn(Ae, Be, Ue), estado: {} },
          opciones: opciones(res, nombres.filter(x => x !== op).map(x => ({ id: 'o' + nombres.indexOf(x), valor: elementos(Ae, Be, Ue, OPS[x]), error: 'AT-OPERACION', siFuera: `Ese es ${x}. Lee la condición de ${op} zona por zona.` })), llaves),
          solucion: { texto: `Las zonas de ${op}.`, ecuacion: [`${op} = ${llaves(res)}`], dibujo: { datos: venn(Ae, Be, Ue), estado: { resalta: OPS[op] } } },
        };
      },
    },
  };

  // ---------- Idea 3: contar sin repetir la intersección ----------
  // Cambia: n(A), n(B) y cuántos están en los dos. Permanece: los dos aros iguales (no codifican tamaño).
  // Progresa: zona por zona, de «solo A» a «ambos» a «solo B». Se reserva: el total de los que hacen al menos uno.
  // Debe verse: la intersección está dentro de A y dentro de B: sumar n(A) + n(B) la cuenta dos veces.
  const zonas = (a, b, x, ex = {}) => venn([], [], [], Object.assign({ regiones: { A: String(a - x), AB: String(x), B: String(b - x) } }, ex));
  const conteo = {
    id: 'conteo',
    titulo: 'La intersección se cuenta una vez',
    temas: ['Operaciones con conjuntos', 'Diagramas de Venn y Carroll'],
    pieza: 'arit-venn',
    juega: {
      consigna: 'A: los que juegan fútbol. B: los que juegan vóley. Elige cuántos hay en cada grupo y cuántos juegan los dos.',
      voz: 'Mira cómo cambian las zonas «solo A» y «solo B».',
      controles: [
        { id: 'a', etiqueta: 'n(A)', color: 'c-o', min: 6, max: 20, paso: 1, inicio: 12, decimales: 0 },
        { id: 'b', etiqueta: 'n(B)', color: 'c-i', min: 6, max: 20, paso: 1, inicio: 9, decimales: 0 },
        { id: 'x', etiqueta: 'Los dos', color: 'c-d', min: 0, max: 6, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: zonas(v.a, v.b, v.x), estado: { resalta: ['AB'] } }),
      lectura: v => [`solo A: ${v.a - v.x} · los dos: ${v.x} · solo B: ${v.b - v.x}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En un aula, ', { v: 'c-o', t: '25' }, ' juegan fútbol, ', { v: 'c-i', t: '18' }, ' juegan vóley y ', { v: 'c-d', t: '7' }, ' juegan los dos. ¿Cuántos juegan al menos uno?'],
      opciones: [
        { id: 'c', texto: '36', correcta: true },
        { id: 'suma', texto: '43', error: 'AT-DOBLE', siFuera: '43 sería cierto si nadie jugara los dos. Los 7 ya están en el 25 y en el 18.' },
        { id: 'resta-doble', texto: '29', error: 'AT-DOBLE', siFuera: 'Eso quita a los 7 dos veces. Se repitieron una sola vez.' },
        { id: 'mas', texto: '50', error: 'AT-DOBLE', siFuera: 'Eso vuelve a sumar a los 7; ya estaban dentro del 25 y del 18.' },
      ],
      dibujo: { datos: zonas(25, 18, 7, { regiones: { AB: '7' } }), estado: {} },
      revelar: { datos: zonas(25, 18, 7), estado: { resalta: ['A', 'AB', 'B'] } },
      coincide: 'Coincide: 18 solo fútbol, 7 los dos y 11 solo vóley.',
    },
    mira: {
      datos: zonas(25, 18, 7, { regiones: { AB: '7', A: { t: '18', paso: 2 }, B: { t: '11', paso: 3 } } }),
      pasos: [
        { estado: { paso: 1, resalta: ['AB'] }, texto: 'Primero la intersección: 7 juegan los dos.', ecuacion: [n([A, ' ∩ ', Bv]), ' = 7'] },
        { estado: { paso: 2, resalta: ['A'] }, texto: 'Solo fútbol: los 25 menos esos 7.', ecuacion: ['25 − 7 = 18'] },
        { estado: { paso: 3, resalta: ['B'] }, texto: 'Solo vóley: los 18 menos esos 7.', ecuacion: ['18 − 7 = 11'] },
        { estado: { paso: 3, resalta: ['A', 'AB', 'B'] }, texto: 'Al menos uno: las tres zonas, cada una una vez.', ecuacion: [n([A, ' ∪ ', Bv]), ' = 18 + 7 + 11 = 36'] },
      ],
    },
    regla: {
      texto: 'Al sumar n(A) y n(B), los de la intersección se cuentan dos veces; por eso se restan una vez.',
      ecuacion: [n([A, ' ∪ ', Bv]), ' = ', n(A), ' + ', n(Bv), ' − ', n([A, ' ∩ ', Bv])],
      condicion: 'A y B son finitos. Los que no están en ninguno se obtienen restando del total de U.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), x = r.ent(2, 9), a = x + r.ent(4, 15), b = x + r.ent(4, 15), u = a + b - x + r.ent(2, 9);
        const pide = ['union', 'soloA', 'ninguno'][s % 3];
        const bien = pide === 'union' ? a + b - x : pide === 'soloA' ? a - x : u - (a + b - x);
        const preg = pide === 'union' ? '¿cuántos están en al menos uno?' : pide === 'soloA' ? '¿cuántos están solo en A?' : `si el aula tiene ${u}, ¿cuántos no están en ninguno?`;
        return {
          pregunta: ['En un grupo, ', { v: 'c-o', t: `n(A) = ${a}` }, ', ', { v: 'c-i', t: `n(B) = ${b}` }, ' y ', { v: 'c-d', t: `n(A ∩ B) = ${x}` }, `; ${preg}`],
          dibujo: { datos: zonas(a, b, x, { regiones: { AB: String(x) } }), estado: {} },
          opciones: opciones(bien, [
            { id: 'suma', valor: pide === 'union' ? a + b : pide === 'soloA' ? a : u - a - b, error: 'AT-DOBLE', siFuera: `Eso cuenta dos veces a los ${x} de la intersección.` },
            { id: 'doble', valor: pide === 'union' ? a + b - 2 * x : pide === 'soloA' ? a - 2 * x : u - (a + b - 2 * x), error: 'AT-DOBLE', siFuera: `Eso quita a los ${x} dos veces; se repetían una vez.` },
            { id: 'otro', valor: pide === 'soloA' ? b - x : pide === 'union' ? x : a + b - x, error: 'AT-ZONA', siFuera: 'Esa es otra zona del diagrama.' },
          ], v => String(v)),
          solucion: { texto: 'Se llena el diagrama desde la intersección.', ecuacion: [`solo A ${a - x} · los dos ${x} · solo B ${b - x}${pide === 'ninguno' ? ` · ninguno ${u - (a + b - x)}` : ''}`], dibujo: { datos: zonas(a, b, x, pide === 'ninguno' ? { regiones: { A: String(a - x), AB: String(x), B: String(b - x), '': String(u - (a + b - x)) } } : {}), estado: { resalta: pide === 'soloA' ? ['A'] : pide === 'union' ? ['A', 'AB', 'B'] : [''] } } },
        };
      },
    },
  };

  // ---------- Idea 4: el conjunto potencia tiene 2^n elementos ----------
  // Cambia: cuántos elementos tiene A. Permanece: una columna por elemento (está o no está). Progresa: las filas se duplican.
  // Se reserva: n = 5, que el juego no muestra. Debe verse: cada elemento nuevo copia todas las filas, con y sin él.
  const LETRAS = ['a', 'b', 'c'];
  const COLS = ['o', 'i', 'h'];
  function potencia(k, porFila = false) {
    const els = LETRAS.slice(0, k), filas = [];
    for (let m = 0; m < 2 ** k; m++) {
      const sub = els.filter((_, j) => (m >> j) & 1);
      filas.push([...els.map((_, j) => ({ t: (m >> j) & 1 ? '✓' : '·', color: COLS[j], paso: porFila ? m + 1 : 0 })), { t: llaves(sub), paso: porFila ? m + 1 : 0, color: 'd' }]);
    }
    return { columnas: [...els.map((e, j) => ({ t: e, color: COLS[j] })), { t: 'subconjunto', color: 'd' }], filas, filasMax: 8 };
  }
  const pot = {
    id: 'potencia',
    titulo: 'Cada elemento duplica los subconjuntos',
    temas: ['Conjunto potencia'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige cuántos elementos tiene A. Cada fila es un subconjunto: cada elemento está (✓) o no está (·).',
      voz: 'Cuenta las filas cada vez que agregas un elemento.',
      controles: [{ id: 'k', etiqueta: 'n(A)', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => ({ datos: potencia(v.k), estado: {} }),
      lectura: v => [`n(P(A)) = ${2 ** v.k}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si ', A, ' tiene 5 elementos, ¿cuántos subconjuntos tiene?'],
      opciones: [
        { id: 'c', texto: '32', correcta: true },
        { id: 'doble', texto: '10', error: 'AT-POTENCIA', siFuera: 'Sería cierto si cada elemento sumara 2. Cada uno duplica todo lo anterior.' },
        { id: 'cuadrado', texto: '25', error: 'AT-POTENCIA', siFuera: '5² cuenta pares de elementos, no subconjuntos.' },
        { id: 'sin-vacio', texto: '31', error: 'AT-VACIO', siFuera: '31 deja fuera al vacío. ∅ también es un subconjunto.' },
      ],
      dibujo: { datos: potencia(3), estado: {} },
      revelar: { datos: potencia(3), estado: { fila: [0, 7] } },
      coincide: 'Coincide: 2 · 2 · 2 · 2 · 2 = 32.',
    },
    mira: {
      datos: potencia(3, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Sin elementos, solo está el vacío: 1 subconjunto.', ecuacion: ['n(P(∅)) = 1'] },
        { estado: { paso: 2, fila: 1 }, texto: 'Con a: lo de antes, y lo de antes con a.', ecuacion: ['1 · 2 = 2'] },
        { estado: { paso: 4, fila: [2, 3] }, texto: 'Con b: se copian las 2 filas y se les pone b.', ecuacion: ['2 · 2 = 4'] },
        { estado: { paso: 8, fila: [4, 5, 6, 7] }, texto: 'Con c: otra vez el doble.', ecuacion: ['4 · 2 = 8 = ', { sup: ['2', '3'] }] },
      ],
    },
    regla: {
      texto: 'El conjunto potencia P(A) reúne todos los subconjuntos de A. Cada elemento está o no está, así que el número se duplica con cada uno.',
      ecuacion: ['n(P(', A, ')) = ', { sup: ['2', ['n(', A, ')']] }],
      condicion: 'cuenta al vacío y a A misma. Los subconjuntos propios son todos menos A: 2ⁿ − 1.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), k = r.ent(2, 7), propios = s % 2 === 1;
        const bien = propios ? 2 ** k - 1 : 2 ** k;
        return {
          pregunta: ['Si ', A, ` tiene ${k} elementos, ¿cuántos subconjuntos ${propios ? 'propios' : ''} tiene?`.replace('  ', ' ')],
          opciones: opciones(bien, [
            { id: 'doble', valor: 2 * k, error: 'AT-POTENCIA', siFuera: 'Cada elemento duplica el total; no suma 2.' },
            { id: 'cuad', valor: k * k, error: 'AT-POTENCIA', siFuera: `${k}² no cuenta subconjuntos.` },
            { id: 'otro', valor: propios ? 2 ** k : 2 ** k - 1, error: propios ? 'AT-PROPIO' : 'AT-VACIO', siFuera: propios ? 'Un subconjunto propio no es A misma: se resta 1.' : 'Eso deja fuera un subconjunto; ∅ y A también cuentan.' },
          ], v => String(v)),
          solucion: { texto: propios ? 'Todos menos A misma.' : 'Cada elemento duplica la cuenta.', ecuacion: [{ sup: ['2', String(k)] }, propios ? ` − 1 = ${bien}` : ` = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el producto cartesiano son pares ordenados ----------
  // Cambia: cuántos elementos tienen A y B. Permanece: una fila por elemento de A y una columna por elemento de B.
  // Progresa: el rectángulo de pares crece. Se reserva: el par al revés, (x, 1). Debe verse: en A × B, el primero es de A.
  const LB = ['x', 'y', 'z', 'w'];
  const prod = (na, nb, extra = {}) => Object.assign({
    columnas: ['×', ...LB.slice(0, nb).map(t => ({ t, color: 'i' }))], cabeza: true, filasMax: 4,
    filas: Array.from({ length: na }, (_, i) => [{ t: String(i + 1), color: 'o' }, ...LB.slice(0, nb).map(b => `(${i + 1}, ${b})`)]),
  }, extra);
  const cartesiano = {
    id: 'cartesiano',
    titulo: 'Pares con orden',
    temas: ['Producto cartesiano'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'A tiene números y B tiene letras. Elige cuántos elementos tiene cada uno: cada casilla es un par (de A, de B).',
      voz: 'Cuenta las casillas: filas por columnas.',
      controles: [
        { id: 'a', etiqueta: 'n(A)', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'n(B)', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: prod(v.a, v.b), estado: {} }),
      lectura: v => [`n(A × B) = ${v.a} · ${v.b} = ${v.a * v.b}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si ', A, ' = {1, 2, 3} y ', Bv, ' = {x, y}, ¿el par (x, 1) está en ', A, ' × ', Bv, '?'],
      opciones: [
        { id: 'c', texto: 'No: en A × B el primero es de A', correcta: true },
        { id: 'si', texto: 'Sí: tiene un 1 y una x', error: 'AT-ORDEN', siFuera: 'Sería cierto si los pares no tuvieran orden. (x, 1) y (1, x) son distintos.' },
        { id: 'conmuta', texto: 'Sí, porque A × B = B × A', error: 'AT-ORDEN', siFuera: 'Tienen la misma cantidad de pares, pero no los mismos pares.' },
      ],
      dibujo: { datos: prod(3, 2), estado: {} },
      revelar: { datos: prod(3, 2), estado: { columna: 0 } },
      coincide: 'Coincide: (x, 1) está en B × A, no en A × B.',
    },
    mira: {
      datos: prod(3, 2),
      pasos: [
        { estado: { fila: 0 }, texto: 'Cada fila empieza con un elemento de A.', ecuacion: ['(1, x), (1, y)'] },
        { estado: { fila: [0, 1, 2] }, texto: 'Tres filas de dos pares: 6 pares.', ecuacion: ['n(', A, ' × ', Bv, ') = 3 · 2 = 6'] },
        { estado: { columna: 0 }, texto: 'El primer lugar siempre es de A: (x, 1) no aparece.', ecuacion: ['(1, x) ≠ (x, 1)'] },
      ],
    },
    regla: {
      texto: 'A × B es el conjunto de pares ordenados (a, b) con a de A y b de B. Hay tantos como filas por columnas.',
      ecuacion: ['n(', A, ' × ', Bv, ') = n(', A, ') · n(', Bv, ')'],
      condicion: 'el orden importa: (a, b) = (c, d) solo si a = c y b = d. Si A ≠ B, A × B ≠ B × A.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), na = r.ent(2, 6), nb = r.ent(2, 6);
        if (s % 3 === 2) return {
          pregunta: ['Si ', A, ' = {1, 2} y ', Bv, ' = {3, 4, 5}, ¿cuál par está en ', Bv, ' × ', A, '?'],
          opciones: [
            { id: 'c', texto: `(${r.de([3, 4, 5])}, ${r.de([1, 2])})`, correcta: true },
            { id: 'orden', texto: `(${r.de([1, 2])}, ${r.de([3, 4, 5])})`, error: 'AT-ORDEN', siFuera: 'Ese par está en A × B: en B × A el primero es de B.' },
            { id: 'mismo', texto: '(1, 2)', error: 'AT-ORDEN', siFuera: 'Los dos son de A; en B × A el primero debe ser de B.' },
          ],
          solucion: { texto: 'Primero un elemento de B, después uno de A.', ecuacion: ['B × A = {(b, a) : b ∈ B, a ∈ A}'] },
        };
        return {
          pregunta: ['Si ', A, ` tiene ${na} elementos y `, Bv, ` tiene ${nb}, ¿cuántos pares tiene `, A, ' × ', Bv, '?'],
          opciones: opciones(na * nb, [
            { id: 'suma', valor: na + nb, error: 'AT-PRODUCTO', siFuera: 'Eso suma los elementos; cada elemento de A forma un par con cada uno de B.' },
            { id: 'pot', valor: na ** nb, error: 'AT-PRODUCTO', siFuera: 'Eso cuenta funciones de B en A, no pares.' },
            { id: 'pot2', valor: 2 ** (na + nb), error: 'AT-POTENCIA', siFuera: 'Eso cuenta subconjuntos, no pares.' },
          ], v => String(v)),
          solucion: { texto: `${na} filas de ${nb} pares.`, ecuacion: [`n(A × B) = ${na} · ${nb} = ${na * nb}`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.conjuntos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-venn.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'Los conjuntos no nacieron como dibujos escolares. En el siglo XIX, Georg Cantor estudiaba series trigonométricas y terminó comparando colecciones infinitas por correspondencias: así distinguió tamaños de infinito. Las operaciones de esta unidad preparan ese lenguaje: pertenecer, incluir y combinar no significan lo mismo. Los aros que usamos son una ayuda para ver relaciones, no una demostración.',
      pregunta: '¿Cómo compararías dos colecciones sin contarlas?',
      fuente: { titulo: 'O’Connor y Robertson, Georg Cantor — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/' },
    },
    ideas: [pertenencia, operaciones, conteo, pot, cartesiano],
  };
});
