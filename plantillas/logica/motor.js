/*
 * Motor de «Los interruptores de la lógica»: lógica proposicional.
 *
 * CABECERA: analizar, imprimir, leer, variables, evaluar, subformulas, fila, filasDe, tablaVerdad, clasificar,
 *           equivalentes, negar, formasCondicional, filasFalsas, valorConPartes, masFilas, condicionalComoCircuito,
 *           conAntecedenteFalso, diferencias, cuantificador, negarCuantificador, circuito, pasa, disposicion,
 *           corriente, cuadrosTabla, VF
 *
 * Aquí vive toda la lógica de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorLogica) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json. No usa eval: las
 * fórmulas se leen con un analizador propio.
 *
 * Notación (la de las academias peruanas): variables p, q, r, s; negación ~ (también se acepta ¬); conjunción ∧ (^, &);
 * disyunción ∨ (|); disyunción exclusiva Δ (⊕); condicional → (->, =>); bicondicional ↔ (<->, <=>); paréntesis ( ), [ ]
 * y { }. Los valores se escriben V y F.
 *
 * Jerarquía (de la que liga más a la que liga menos), explícita:
 *   1. ~        se aplica solo a lo que tiene inmediatamente a la derecha: ~p ∧ q es (~p) ∧ q.
 *   2. ∧ ∨ Δ    el mismo nivel. Repetir el mismo conectivo se agrupa por la izquierda (p ∧ q ∧ r es (p ∧ q) ∧ r, y da
 *               igual porque es asociativo); MEZCLARLOS sin paréntesis es un error («p ∧ q ∨ r» pide paréntesis).
 *   3. →        p ∧ q → r es (p ∧ q) → r. Encadenarlo sin paréntesis es un error («p → q → r» pide paréntesis).
 *   4. ↔        el de mayor jerarquía: p → q ↔ r es (p → q) ↔ r. Repetido se agrupa por la izquierda (es asociativo).
 * imprimir() pone por defecto paréntesis a toda fórmula compuesta dentro de otra, para que la escena nunca dependa de la
 * jerarquía; imprimir(f, { minimo: true }) pone solo los necesarios. Las dos se leen de vuelta igual (pruebas).
 *
 * Una fórmula es un árbol: { t:'var', n:'p' }, { t:'no', a }, { t:'y'|'o'|'ox'|'si'|'sii', a, b } (y = ∧, o = ∨,
 * ox = Δ, si = →, sii = ↔). Toda función que recibe una fórmula acepta el árbol o el texto.
 *
 * Tablas de verdad: las variables en orden alfabético y las filas en el orden de academia, V primero: la primera
 * variable es V en la primera mitad de las filas, la segunda alterna por cuartos, …, la última alterna V, F, V, F.
 *
 * Fórmulas
 *   analizar(texto)              el árbol; si el texto está mal escrito, un Error con lo que falla y dónde
 *   imprimir(f, o), leer(f)      el texto con símbolos; el texto para el lector de pantalla («si p, entonces q»)
 *   variables(f), evaluar(f, valores), subformulas(f)
 * Tablas
 *   fila(vars, i)                los valores de la fila i
 *   filasDe(f)                   cuántas filas (2ⁿ); errores: 2n, n, n²
 *   tablaVerdad(f, o)            las filas, los valores de las columnas pedidas y la matriz principal («VFVV»)
 *   clasificar(f)                tautología, contradicción o contingencia; errores: leer ∨ como ∧, → como ∧, el tipo opuesto
 *   equivalentes(f, g)           ¿misma columna en todas las filas? y si no, una fila donde difieren
 * Leyes y condicional
 *   negar(f)                     la negación por la ley que toca al conectivo principal (De Morgan, ~(p → q) ≡ p ∧ ~q, …)
 *   formasCondicional(a, b)      recíproca, inversa y contrarrecíproca de a → b; solo la contrarrecíproca equivale
 *   filasFalsas(f)               las filas donde f es F; para un condicional, errores: F → V, F → F, como bicondicional
 *   valorConPartes(f, valores)   el valor de las dos partes del conectivo principal y de f; errores: la negación que
 *                                abarca un paréntesis tomada solo sobre su primera letra, ∨ leída como Δ, → leído como ∧
 * «¿Qué pasa si…?»
 *   masFilas(n), condicionalComoCircuito(a, b), conAntecedenteFalso(f), diferencias(f, g),
 *   cuantificador(tipo, lista), negarCuantificador(tipo)
 * Para el dibujo (la escena solo pinta)
 *   circuito(f, o)               interruptores (∧ en serie, ∨ en paralelo; ~p es un interruptor invertido), cajas
 *                                inversoras para ~ de algo compuesto, y cajas de dos entradas para → ↔ Δ (o, con
 *                                o.expandir, sus circuitos equivalentes: a → b como ~a ∨ b)
 *   pasa(c, valores)             si la corriente cruza el circuito (debe dar lo mismo que evaluar)
 *   disposicion(c)               posiciones en unidades de cuadrícula: elementos, cables y focos
 *   corriente(c, valores)        qué nodo deja pasar y qué cable está encendido
 *   cuadrosTabla(f, o)           los cuadros de la animación que recorre las 2ⁿ filas
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta (o lo mismo
 * que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales. Cuando el error es una fórmula,
 * «lo mismo» se mide por la tabla de verdad, no por el texto. Ninguno de estos errores tiene estudio que lo mida en el
 * informe de aritmética: todos son hipótesis nuestras.
 * Excepción: formasCondicional no deja caer errores que coinciden entre sí por la tabla. La recíproca (q → p) y la
 * inversa (~p → ~q) son equivalentes entre sí, y las dos son incorrectas en el paso 7: se comparan con la correcta por
 * la tabla y entre sí solo por el texto.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorLogica = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VARS = ['p', 'q', 'r', 's'];
  const SIM = { y: '∧', o: '∨', ox: 'Δ', si: '→', sii: '↔' };
  const NIVEL = { y: 2, o: 2, ox: 2, si: 3, sii: 4 };
  const ASOC = { y: true, o: true, ox: true, si: false, sii: true };
  const VF = b => (b ? 'V' : 'F');

  // ---------- analizador ----------
  const ABRE = '([{', CIERRA = ')]}';
  function fichas(texto) {
    if (typeof texto !== 'string') throw new Error('la fórmula debe ser un texto');
    const out = [];
    let i = 0;
    const s = texto;
    const pon = (tipo, v, largo) => { out.push({ tipo, v, pos: i }); i += largo; };
    while (i < s.length) {
      const c = s[i], dos = s.slice(i, i + 2), tres = s.slice(i, i + 3);
      if (/\s/.test(c)) { i++; continue; }
      if (tres === '<->' || tres === '<=>') { pon('op', 'sii', 3); continue; }
      if (dos === '->' || dos === '=>') { pon('op', 'si', 2); continue; }
      if (c === '↔' || c === '⇔') { pon('op', 'sii', 1); continue; }
      if (c === '→' || c === '⇒') { pon('op', 'si', 1); continue; }
      if (c === '∧' || c === '^' || c === '&') { pon('op', 'y', 1); continue; }
      if (c === '∨' || c === '|') { pon('op', 'o', 1); continue; }
      if (c === 'Δ' || c === '△' || c === '⊕') { pon('op', 'ox', 1); continue; }
      if (c === '~' || c === '¬' || c === '∼') { pon('no', 'no', 1); continue; }
      if (ABRE.includes(c)) { pon('abre', c, 1); continue; }
      if (CIERRA.includes(c)) { pon('cierra', c, 1); continue; }
      if (VARS.includes(c)) {
        if (VARS.includes(s[i + 1] || '')) throw new Error(`falta un conectivo entre ${c} y ${s[i + 1]} (posición ${i + 2})`);
        if (/[a-záéíóúñ]/i.test(s[i + 1] || '')) throw new Error(`«${s.slice(i, i + 2)}» no es una variable: usa una sola letra (p, q, r o s), posición ${i + 1}`);
        pon('var', c, 1); continue;
      }
      if (c === 'v' || c === 'V' || c === 'F') throw new Error(`«${c}» no se usa en la fórmula (posición ${i + 1}): la disyunción es ∨ y las variables son p, q, r o s`);
      throw new Error(`no conozco el símbolo «${c}» (posición ${i + 1})`);
    }
    if (!out.length) throw new Error('la fórmula está vacía');
    return out;
  }
  function analizar(texto) {
    if (texto && typeof texto === 'object' && texto.t) return texto;
    const T = fichas(texto);
    let k = 0;
    const ver = () => T[k];
    const donde = f => (f ? `posición ${f.pos + 1}` : 'al final');
    // nivel 4: ↔ ; nivel 3: → ; nivel 2: ∧ ∨ Δ ; nivel 1: ~ y átomos
    function nivel(n) {
      if (n === 1) return unario();
      let izq = nivel(n - 1), opPrevio = null;
      while (ver() && ver().tipo === 'op' && NIVEL[ver().v] === n) {
        const f = T[k++], op = f.v;
        if (opPrevio && opPrevio !== op) throw new Error(`«${SIM[opPrevio]}» y «${SIM[op]}» seguidos sin paréntesis (${donde(f)}): pon paréntesis para decir qué va primero`);
        if (opPrevio && !ASOC[op]) throw new Error(`dos «→» seguidos sin paréntesis (${donde(f)}): pon paréntesis para decir cuál es el principal`);
        const der = nivel(n - 1);
        izq = { t: op, a: izq, b: der };
        opPrevio = op;
      }
      return izq;
    }
    function unario() {
      const f = ver();
      if (!f) throw new Error('falta una proposición al final');
      if (f.tipo === 'no') { k++; return { t: 'no', a: unario() }; }
      if (f.tipo === 'var') { k++; return { t: 'var', n: f.v }; }
      if (f.tipo === 'abre') {
        k++;
        const dentro = nivel(4), g = ver();
        if (!g || g.tipo !== 'cierra') throw new Error(`falta cerrar el paréntesis abierto en la posición ${f.pos + 1}`);
        if (CIERRA.indexOf(g.v) !== ABRE.indexOf(f.v)) throw new Error(`el «${f.v}» de la posición ${f.pos + 1} se cierra con «${g.v}» (${donde(g)})`);
        k++;
        return dentro;
      }
      if (f.tipo === 'cierra') throw new Error(`sobra un «${f.v}» o falta una proposición antes (${donde(f)})`);
      throw new Error(`falta una proposición antes de «${SIM[f.v]}» (${donde(f)})`);
    }
    const arbol = nivel(4);
    if (k < T.length) {
      const f = T[k];
      if (f.tipo === 'cierra') throw new Error(`sobra un «${f.v}» (${donde(f)})`);
      throw new Error(`falta un conectivo antes de la ${donde(f)}`);
    }
    return arbol;
  }
  const A = analizar;

  // ---------- imprimir y leer ----------
  function imprimir(f, o) {
    f = A(f); const minimo = !!(o && o.minimo);
    const hijo = (h, padre, lado) => {
      const t = imprimir(h, o);
      if (h.t === 'var' || h.t === 'no') return t;
      if (padre === 'no') return `(${t})`;
      if (!minimo) return `(${t})`;
      const nh = NIVEL[h.t], np = NIVEL[padre];
      if (nh < np) return t;
      if (nh === np && h.t === padre && ASOC[padre] && lado === 'a') return t;
      return `(${t})`;
    };
    if (f.t === 'var') return f.n;
    if (f.t === 'no') return '~' + hijo(f.a, 'no');
    return `${hijo(f.a, f.t, 'a')} ${SIM[f.t]} ${hijo(f.b, f.t, 'b')}`;
  }
  // Cómo se dice (lector de pantalla). Los paréntesis no se dicen: ~ de algo compuesto es «no es cierto que …»; las
  // partes de → y ↔ van sin más (salvo que la parte sea otro → o ↔, que sí lleva «abre paréntesis … cierra paréntesis»);
  // una parte ∧ ∨ Δ dentro de otro de esos conectivos va en forma corta: (p ∧ q) ∨ r es «tanto p como q, o r», (p ∨ q) ∧ r
  // es «ya sea p o q, y r». ~(p ∨ q) → (q ∨ r) es «si no es cierto que p o q, entonces q o r».
  const PALABRA = { y: 'y', o: 'o', ox: 'o exclusivo' };
  const literal = h => h.t === 'var' || (h.t === 'no' && h.a.t === 'var');
  const conParentesis = h => `abre paréntesis, ${leer(h)}, cierra paréntesis`;
  function leerNo(h) {
    if (h.a.t === 'var') return 'no ' + h.a.n;
    if (h.a.t === 'no') return 'no ' + leerNo(h.a);
    return 'no es cierto que ' + leer(h.a);
  }
  function corta(h) {
    const a = parte(h.a, h.t, 'a'), b = parte(h.b, h.t, 'b');
    if (h.t === 'y') return `tanto ${a} como ${b}`;
    if (h.t === 'o') return `ya sea ${a} o ${b}`;
    return `o bien ${a} o bien ${b}, pero no ambas`;
  }
  function parte(h, padre, lado) {
    if (h.t === 'var') return h.n;
    if (h.t === 'no') return leerNo(h);
    if (h.t === 'si' || h.t === 'sii') return conParentesis(h);
    if (padre === 'si' || padre === 'sii') return leer(h);
    if (h.t === padre && lado === 'a') return leer(h);
    return corta(h);
  }
  function leer(f) {
    f = A(f);
    if (f.t === 'var') return f.n;
    if (f.t === 'no') return leerNo(f);
    const a = parte(f.a, f.t, 'a'), b = parte(f.b, f.t, 'b'), coma = literal(f.a) || (f.a.t === f.t && f.t !== 'si' && f.t !== 'sii') ? '' : ',';
    if (f.t === 'si') return `si ${a}, entonces ${b}`;
    if (f.t === 'sii') return `${a}${coma} si y solo si ${b}`;
    return `${a}${coma} ${PALABRA[f.t]} ${b}`;
  }

  // ---------- evaluar ----------
  function variables(f) {
    f = A(f); const s = new Set();
    (function rec(x) { if (x.t === 'var') s.add(x.n); else { rec(x.a); if (x.b) rec(x.b); } })(f);
    return VARS.filter(v => s.has(v));
  }
  const OPS = {
    y: (a, b) => a && b, o: (a, b) => a || b, ox: (a, b) => a !== b, si: (a, b) => !a || b, sii: (a, b) => a === b,
  };
  function evaluar(f, valores) {
    f = A(f);
    if (f.t === 'var') {
      const v = valores && valores[f.n];
      if (typeof v !== 'boolean') throw new Error(`falta el valor de ${f.n} (V o F)`);
      return v;
    }
    if (f.t === 'no') return !evaluar(f.a, valores);
    return OPS[f.t](evaluar(f.a, valores), evaluar(f.b, valores));
  }
  // Las subfórmulas compuestas, de las más chicas a la principal, sin repetir.
  function subformulas(f) {
    f = A(f); const vistos = new Set(), out = [];
    (function rec(x) {
      if (x.t === 'var') return;
      rec(x.a); if (x.b) rec(x.b);
      const t = imprimir(x);
      if (!vistos.has(t)) { vistos.add(t); out.push(t); }
    })(f);
    return out;
  }

  // ---------- tablas ----------
  function fila(vars, i) {
    const n = vars.length, v = {};
    vars.forEach((x, j) => { v[x] = ((i >> (n - 1 - j)) & 1) === 0; });
    return v;
  }
  function quitarRepetidos(errores, correcta, clave) {
    const k = clave || (x => JSON.stringify(x));
    const out = {}, usados = new Set([k(correcta)]);
    for (const [nombre, v] of Object.entries(errores)) {
      if (v === undefined || v === null) continue;
      const c = k(v);
      if (usados.has(c)) continue;
      usados.add(c); out[nombre] = v;
    }
    return out;
  }
  function filasDe(f) {
    const n = typeof f === 'number' ? f : variables(f).length;
    if (!Number.isInteger(n) || n < 1 || n > 6) throw new Error('el número de variables debe ser un entero de 1 a 6');
    const filas = 2 ** n;
    return { variables: n, filas, respuesta: filas,
      errores: quitarRepetidos({ dobleDeVariables: 2 * n, igualAVariables: n, cuadrado: n * n }, filas) };
  }
  function tablaVerdad(f, o) {
    f = A(f); o = o || {};
    const vars = o.variables || variables(f);
    const cols = (o.columnas || []).map(A);
    const filas = [];
    for (let i = 0; i < 2 ** vars.length; i++) {
      const valores = fila(vars, i);
      filas.push({ i, valores, celdas: cols.map(c => evaluar(c, valores)), valor: evaluar(f, valores) });
    }
    return { variables: vars, formula: imprimir(f), columnas: cols.map(c => imprimir(c)), filas,
      matriz: filas.map(x => VF(x.valor)).join(''), cantidad: filas.length };
  }
  const columna = (f, vars) => tablaVerdad(f, { variables: vars }).matriz;
  function tipoDe(m) { return /^V+$/.test(m) ? 'tautologia' : /^F+$/.test(m) ? 'contradiccion' : 'contingencia'; }
  const NOMBRE_TIPO = { tautologia: 'tautología', contradiccion: 'contradicción', contingencia: 'contingencia' };
  // Cambia todos los nodos de un tipo por otro (para los errores).
  function cambiar(f, de, a) {
    f = A(f);
    if (f.t === 'var') return f;
    if (f.t === 'no') return { t: 'no', a: cambiar(f.a, de, a) };
    return { t: f.t === de ? a : f.t, a: cambiar(f.a, de, a), b: cambiar(f.b, de, a) };
  }
  function resumenTipo(f, vars) {
    const m = columna(f, vars), falsas = (m.match(/F/g) || []).length, tipo = tipoDe(m);
    return { tipo, nombre: NOMBRE_TIPO[tipo], falsas, verdaderas: m.length - falsas, total: m.length };
  }
  function clasificar(f) {
    f = A(f); const vars = variables(f);
    const R = resumenTipo(f, vars), m = columna(f, vars);
    const opuesto = R.tipo === 'tautologia' ? { tipo: 'contradiccion', nombre: 'contradicción', falsas: R.total, verdaderas: 0, total: R.total }
      : R.tipo === 'contradiccion' ? { tipo: 'tautologia', nombre: 'tautología', falsas: 0, verdaderas: R.total, total: R.total } : null;
    const clave = x => `${x.tipo}/${x.falsas}`;
    const errores = quitarRepetidos({
      oComoY: resumenTipo(cambiar(f, 'o', 'y'), vars),
      condicionalComoY: resumenTipo(cambiar(f, 'si', 'y'), vars),
      tipoOpuesto: opuesto,
    }, R, clave);
    return Object.assign({ matriz: m, variables: vars, formula: imprimir(f), respuesta: R, errores }, R);
  }
  function equivalentes(f, g) {
    f = A(f); g = A(g);
    const vars = VARS.filter(v => variables(f).includes(v) || variables(g).includes(v));
    for (let i = 0; i < 2 ** vars.length; i++) {
      const val = fila(vars, i);
      if (evaluar(f, val) !== evaluar(g, val)) return { equivalentes: false, contraejemplo: val, fila: i, valorF: evaluar(f, val), valorG: evaluar(g, val) };
    }
    return { equivalentes: true, contraejemplo: null };
  }
  // Clave de una fórmula por su tabla, sobre un conjunto fijo de variables.
  const claveTabla = vars => x => columna(x, vars);

  // ---------- leyes ----------
  const no = a => ({ t: 'no', a });
  const bin = (t, a, b) => ({ t, a, b });
  const v = n => ({ t: 'var', n });
  // ~X sin doble negación innecesaria: ~(~p) da p.
  const neg = a => (a.t === 'no' ? a.a : no(a));
  const LEY = {
    no: 'doble negación: ~~a ≡ a',
    y: 'De Morgan: ~(a ∧ b) ≡ ~a ∨ ~b',
    o: 'De Morgan: ~(a ∨ b) ≡ ~a ∧ ~b',
    si: 'negación del condicional: ~(a → b) ≡ a ∧ ~b',
    sii: 'negación del bicondicional: ~(a ↔ b) ≡ a Δ b',
    ox: 'negación de la disyunción exclusiva: ~(a Δ b) ≡ a ↔ b',
  };
  function negar(f) {
    f = A(f);
    if (f.t === 'var') return { formula: no(f), texto: imprimir(no(f)), ley: null, respuesta: imprimir(no(f)), errores: {} };
    const a = f.a, b = f.b;
    let g, err = {};
    if (f.t === 'no') g = a;
    else if (f.t === 'y') { g = bin('o', neg(a), neg(b)); err = { negaPartes: bin('y', neg(a), neg(b)), niegaSoloPrimera: bin('o', neg(a), b), niegaPrimeraSinCambiar: bin('y', neg(a), b) }; }
    else if (f.t === 'o') { g = bin('y', neg(a), neg(b)); err = { negaPartes: bin('o', neg(a), neg(b)), niegaSoloPrimera: bin('y', neg(a), b), niegaPrimeraSinCambiar: bin('o', neg(a), b) }; }
    else if (f.t === 'si') { g = bin('y', a, neg(b)); err = { negaPartes: bin('si', neg(a), neg(b)), niegaConsecuente: bin('si', a, neg(b)), cambiaSinNegarBien: bin('y', neg(a), b) }; }
    else if (f.t === 'sii') { g = bin('ox', a, b); err = { negaPartes: bin('sii', neg(a), neg(b)), comoConjuncion: bin('y', neg(a), neg(b)) }; }
    else if (f.t === 'ox') { g = bin('sii', a, b); err = { negaPartes: bin('ox', neg(a), neg(b)), comoConjuncion: bin('y', neg(a), neg(b)) }; }
    const vars = variables(f);
    const errores = {};
    for (const [k, e] of Object.entries(quitarRepetidos(err, g, claveTabla(vars)))) errores[k] = imprimir(e);
    return { formula: g, texto: imprimir(g), respuesta: imprimir(g), ley: LEY[f.t], errores, leer: leer(g) };
  }
  function formasCondicional(a, b) {
    a = A(a); b = A(b);
    const c = bin('si', a, b), rec = bin('si', b, a), inv = bin('si', neg(a), neg(b)), con = bin('si', neg(b), neg(a)), bic = bin('sii', a, b);
    const vars = variables(c);
    const errores = {};
    // recíproca e inversa son equivalentes ENTRE SÍ (una es la contrarrecíproca de la otra), pero ninguna equivale a a → b;
    // por eso se comparan con la correcta por la tabla y entre sí por el texto.
    for (const [k, e] of Object.entries({ reciproca: rec, inversa: inv, bicondicional: bic })) {
      if (columna(e, vars) !== columna(con, vars)) errores[k] = imprimir(e);
    }
    return { condicional: imprimir(c), reciproca: imprimir(rec), inversa: imprimir(inv), contrarreciproca: imprimir(con),
      bicondicional: imprimir(bic), respuesta: imprimir(con), equivale: 'contrarreciproca', errores,
      matrices: { condicional: columna(c, vars), reciproca: columna(rec, vars), inversa: columna(inv, vars), contrarreciproca: columna(con, vars), bicondicional: columna(bic, vars) } };
  }
  // Una fila como texto corto: «V F» en el orden de las variables.
  const filaTexto = (vars, val) => vars.map(x => VF(val[x])).join(' ');
  function filasFalsas(f) {
    f = A(f); const vars = variables(f), T = tablaVerdad(f);
    const falsas = T.filas.filter(x => !x.valor).map(x => filaTexto(vars, x.valores));
    let errores = {};
    if (f.t === 'si') {
      const falsasDe = g => tablaVerdad(g, { variables: vars }).filas.filter(x => !x.valor).map(x => filaTexto(vars, x.valores));
      const a = f.a, b = f.b;
      errores = quitarRepetidos({
        // «se rompe cuando no se cumple lo primero y sí lo segundo»: F → V
        alReves: falsasDe(bin('si', b, a)),
        // «si no se cumple nada (las dos partes falsas), la promesa es falsa»: F → F
        ambasFalsas: falsasDe(bin('o', a, b)),
        comoBicondicional: falsasDe(bin('sii', a, b)),
      }, falsas);
    }
    return { variables: vars, falsas, respuesta: falsas, errores };
  }
  // Las partes del conectivo principal: [a, b] (o [a] si es una negación).
  function partesDe(f) { return f.t === 'var' ? [] : f.t === 'no' ? [f.a] : [f.a, f.b]; }
  // «~(a op b)» tomada solo sobre la primera letra: «~a op b».
  function negacionSoloPrimera(f) {
    if (f.t === 'var') return f;
    if (f.t === 'no') {
      const x = f.a;
      if (x.t !== 'var' && x.t !== 'no') return bin(x.t, no(negacionSoloPrimera(x.a)), negacionSoloPrimera(x.b));
      return no(negacionSoloPrimera(x));
    }
    return bin(f.t, negacionSoloPrimera(f.a), negacionSoloPrimera(f.b));
  }
  function valorConPartes(f, valores) {
    f = A(f);
    const lectura = g => ({ partes: partesDe(g).map(p => evaluar(p, valores)), valor: evaluar(g, valores) });
    const R = lectura(f);
    const textoDe = x => x.partes.map(VF).join(' ') + ' | ' + VF(x.valor);
    const errores = quitarRepetidos({
      negacionSoloPrimera: lectura(negacionSoloPrimera(f)),
      oExclusiva: lectura(cambiar(f, 'o', 'ox')),
      condicionalComoY: lectura(cambiar(f, 'si', 'y')),
    }, R, textoDe);
    return { formula: imprimir(f), partes: partesDe(f).map(imprimir), valoresPartes: R.partes, valor: R.valor,
      respuesta: R, texto: textoDe(R), errores, erroresTexto: Object.fromEntries(Object.entries(errores).map(([k, x]) => [k, textoDe(x)])) };
  }

  // ---------- «¿Qué pasa si…?» ----------
  function masFilas(n) {
    const antes = filasDe(n).filas, despues = 2 * antes, salto = antes - antes / 2;
    return { variables: n, antes, despues, respuesta: despues,
      errores: quitarRepetidos({ sumaIgual: antes + salto, sumaUna: antes + 1, sumaDos: antes + 2 }, despues) };
  }
  function condicionalComoCircuito(a, b) {
    a = A(a); b = A(b);
    const c = bin('si', a, b), vars = variables(c), ok = bin('o', neg(a), b);
    const err = { invierteConsecuente: bin('o', a, neg(b)), enSerie: bin('y', neg(a), b), sinInversor: bin('o', a, b) };
    const errores = {};
    for (const [k, e] of Object.entries(quitarRepetidos(err, ok, claveTabla(vars)))) errores[k] = imprimir(e);
    return { condicional: imprimir(c), respuesta: imprimir(ok), equivalentes: equivalentes(c, ok).equivalentes, errores,
      matrices: Object.fromEntries([['condicional', c], ['respuesta', ok], ...Object.entries(err)].map(([k, e]) => [k, columna(e, vars)])) };
  }
  // f es un condicional a → b; con a falso en todas las filas que se miran, ¿qué vale f?
  // Respuesta como una de: 'siempreV', 'siempreF', 'igualConsecuente', 'contrarioConsecuente', 'depende'.
  function conAntecedenteFalso(f) {
    f = A(f);
    if (f.t !== 'si') throw new Error('conAntecedenteFalso pide un condicional');
    const vars = variables(f);
    const filas = [];
    for (let i = 0; i < 2 ** vars.length; i++) { const val = fila(vars, i); if (!evaluar(f.a, val)) filas.push(val); }
    if (!filas.length) throw new Error('el antecedente nunca es falso');
    const tipo = g => {
      const vs = filas.map(val => evaluar(g, val)), cs = filas.map(val => evaluar(f.b, val));
      if (vs.every(x => x)) return 'siempreV';
      if (vs.every(x => !x)) return 'siempreF';
      if (vs.every((x, i) => x === cs[i])) return 'igualConsecuente';
      if (vs.every((x, i) => x !== cs[i])) return 'contrarioConsecuente';
      return 'depende';
    };
    const R = tipo(f);
    return { filas: filas.length, respuesta: R, valores: filas.map(val => evaluar(f, val)), antecedente: imprimir(f.a), consecuente: imprimir(f.b),
      tabla: filas.map(val => ({ valores: val, celdas: [evaluar(f.b, val), evaluar(f, val)] })),
      errores: quitarRepetidos({ comoY: tipo(bin('y', f.a, f.b)), comoConsecuente: tipo(f.b), comoBicondicional: tipo(bin('sii', f.a, f.b)) }, R) };
  }
  // Filas (como texto «V F») donde f y g difieren.
  function diferencias(f, g) {
    f = A(f); g = A(g);
    const vars = VARS.filter(x => variables(f).includes(x) || variables(g).includes(x));
    const out = [];
    for (let i = 0; i < 2 ** vars.length; i++) { const val = fila(vars, i); if (evaluar(f, val) !== evaluar(g, val)) out.push(filaTexto(vars, val)); }
    let errores = {};
    if (vars.length === 2) errores = quitarRepetidos({ ambasF: ['F F'], ninguna: [], distintas: ['V F', 'F V'] }, out);
    return { variables: vars, filas: out, respuesta: out, errores };
  }
  // Cuantificadores sobre una lista finita de valores de verdad (cada alumno: aprobó o no).
  const CUANT = {
    todos: L => L.every(x => x), alguno: L => L.some(x => x), ninguno: L => !L.some(x => x),
    algunoNo: L => L.some(x => !x), soloAlgunos: L => L.some(x => x) && L.some(x => !x),
  };
  function cuantificador(tipo, lista) {
    if (!CUANT[tipo]) throw new Error(`cuantificador desconocido: ${tipo}`);
    if (!Array.isArray(lista) || !lista.length || lista.some(x => typeof x !== 'boolean')) throw new Error('la lista debe tener al menos un valor V o F');
    return CUANT[tipo](lista);
  }
  const NEGACION_CUANT = { todos: 'algunoNo', algunoNo: 'todos', alguno: 'ninguno', ninguno: 'alguno' };
  function negarCuantificador(tipo) {
    const R = NEGACION_CUANT[tipo];
    if (!R) throw new Error(`no sé negar el cuantificador ${tipo}`);
    const err = tipo === 'todos' ? { niegaTodo: 'ninguno', cambiaSinNegar: 'alguno', soloAlgunos: 'soloAlgunos' }
      : tipo === 'alguno' ? { niegaTodo: 'algunoNo', cambiaSinNegar: 'todos', soloAlgunos: 'soloAlgunos' }
      : tipo === 'ninguno' ? { cambiaSinNegar: 'todos', soloAlgunos: 'soloAlgunos', niegaTodo: 'algunoNo' }
      : { niegaTodo: 'ninguno', cambiaSinNegar: 'alguno', soloAlgunos: 'soloAlgunos' };
    return { respuesta: R, errores: quitarRepetidos(err, R) };
  }

  // ---------- el circuito ----------
  // Nodos: { k:'int', n, negado } · { k:'serie', hijos } · { k:'par', hijos } · { k:'inv', a } (caja que invierte)
  //        · { k:'caja', op, a, b } (dos entradas: → ↔ Δ). Cada nodo lleva un id único y su fórmula (texto).
  function circuito(f, o) {
    f = A(f); const expandir = !!(o && o.expandir);
    let id = 0;
    function rec(x) {
      const texto = imprimir(x);
      if (x.t === 'var') return { k: 'int', n: x.n, negado: false, id: id++, texto };
      if (x.t === 'no' && x.a.t === 'var') return { k: 'int', n: x.a.n, negado: true, id: id++, texto };
      if (x.t === 'no') return { k: 'inv', a: rec(x.a), id: id++, texto };
      if (x.t === 'y' || x.t === 'o') {
        const hijos = [];
        const junta = h => { const c = rec(h); if (c.k === (x.t === 'y' ? 'serie' : 'par') && !c.caja) hijos.push(...c.hijos); else hijos.push(c); };
        junta(x.a); junta(x.b);
        return { k: x.t === 'y' ? 'serie' : 'par', hijos, id: id++, texto };
      }
      if (expandir) {
        const a = x.a, b = x.b;
        const eq = x.t === 'si' ? bin('o', neg(a), b)
          : x.t === 'sii' ? bin('o', bin('y', a, b), bin('y', neg(a), neg(b)))
          : bin('o', bin('y', a, neg(b)), bin('y', neg(a), b));
        const c = rec(eq); c.texto = texto; c.de = x.t; c.caja = true;
        return c;
      }
      return { k: 'caja', op: x.t, a: rec(x.a), b: rec(x.b), id: id++, texto };
    }
    const raiz = rec(f);
    raiz.total = id;
    return raiz;
  }
  function pasa(c, valores) {
    if (c.k === 'int') { const x = valores[c.n]; if (typeof x !== 'boolean') throw new Error(`falta el valor de ${c.n}`); return c.negado ? !x : x; }
    if (c.k === 'serie') return c.hijos.every(h => pasa(h, valores));
    if (c.k === 'par') return c.hijos.some(h => pasa(h, valores));
    if (c.k === 'inv') return !pasa(c.a, valores);
    return OPS[c.op](pasa(c.a, valores), pasa(c.b, valores));
  }
  // Medidas en unidades de cuadrícula. Cada bloque tiene entrada a la izquierda y salida a la derecha, a la altura ym.
  const M_ = { intW: 2, intH: 1.8, hueco: 0.5, riel: 0.5, sep: 0.7, pad: 0.35, cab: 1.1, foco: 1.6 };
  function medir(c) {
    if (c.k === 'int') { c.w = M_.intW; c.h = M_.intH; c.ym = c.h / 2; return c; }
    if (c.k === 'serie') {
      c.hijos.forEach(medir);
      const arriba = Math.max(...c.hijos.map(h => h.ym)), abajo = Math.max(...c.hijos.map(h => h.h - h.ym));
      c.w = c.hijos.reduce((s, h) => s + h.w, 0) + M_.hueco * (c.hijos.length - 1);
      c.h = arriba + abajo; c.ym = arriba; return c;
    }
    if (c.k === 'par') {
      c.hijos.forEach(medir);
      c.w = Math.max(...c.hijos.map(h => h.w)) + 2 * M_.riel;
      c.h = c.hijos.reduce((s, h) => s + h.h, 0) + M_.sep * (c.hijos.length - 1);
      let y = 0; const mids = c.hijos.map(h => { const m = y + h.ym; y += h.h + M_.sep; return m; });
      c.ym = (mids[0] + mids[mids.length - 1]) / 2; return c;
    }
    if (c.k === 'inv') {
      medir(c.a);
      c.w = c.a.w + 2 * M_.pad + M_.foco; c.h = c.a.h + 2 * M_.pad + M_.cab; c.ym = c.h / 2; return c;
    }
    medir(c.a); medir(c.b);
    c.w = Math.max(c.a.w, c.b.w) + 2 * M_.pad + M_.foco;
    c.h = c.a.h + c.b.h + M_.sep + 2 * M_.pad + M_.cab; c.ym = c.h / 2; return c;
  }
  // Coloca el nodo con su esquina en (x, y). Junta elementos, cables (con el id del nodo dueño y si es «interno» a una
  // caja: el circuito de control de la caja) y focos.
  function colocar(c, x, y, out, dueno) {
    c.x = x; c.y = y;
    const cable = (x1, y1, x2, y2, id) => out.cables.push({ x1, y1, x2, y2, id: id === undefined ? c.id : id, dueno });
    if (c.k === 'int') { out.elementos.push({ tipo: 'interruptor', id: c.id, n: c.n, negado: c.negado, texto: c.texto, x, y, w: c.w, h: c.h, ym: y + c.ym, dueno }); return; }
    if (c.k === 'serie') {
      let cx = x;
      c.hijos.forEach((h, i) => {
        const hy = y + c.ym - h.ym;
        colocar(h, cx, hy, out, dueno);
        if (i < c.hijos.length - 1) cable(cx + h.w, y + c.ym, cx + h.w + M_.hueco, y + c.ym);
        cx += h.w + M_.hueco;
      });
      return;
    }
    if (c.k === 'par') {
      let cy = y; const ancho = c.w - 2 * M_.riel, mids = [];
      c.hijos.forEach(h => {
        const hx = x + M_.riel + (ancho - h.w) / 2, m = cy + h.ym; mids.push(m);
        colocar(h, hx, cy, out, dueno);
        cable(x, m, hx, m, h.id); cable(hx + h.w, m, x + c.w, m, h.id);
        cy += h.h + M_.sep;
      });
      cable(x, mids[0], x, mids[mids.length - 1]); cable(x + c.w, mids[0], x + c.w, mids[mids.length - 1]);
      return;
    }
    const interior = (h, hy) => {
      const hx = x + M_.pad;
      colocar(h, hx, hy, out, c.id);
      // el circuito de control: de la pared izquierda de la caja a su foco chico
      const fx = x + c.w - M_.pad - M_.foco / 2, m = hy + h.ym;
      cable(x + M_.pad * 0.4, m, hx, m, h.id); cable(hx + h.w, m, fx - 0.3, m, h.id);
      out.cables[out.cables.length - 1].dueno = c.id; out.cables[out.cables.length - 2].dueno = c.id;
      out.focos.push({ id: h.id, x: fx, y: m, r: 0.3, chico: true, dueno: c.id });
    };
    out.elementos.push({ tipo: c.k === 'inv' ? 'inversor' : 'caja', id: c.id, op: c.op || 'no', texto: c.texto, x, y, w: c.w, h: c.h, ym: y + c.ym, dueno });
    if (c.k === 'inv') interior(c.a, y + M_.cab + M_.pad);
    else { interior(c.a, y + M_.cab + M_.pad); interior(c.b, y + M_.cab + M_.pad + c.a.h + M_.sep); }
  }
  function disposicion(c) {
    if (!c || !c.k) c = circuito(c);
    medir(c);
    const out = { elementos: [], cables: [], focos: [] };
    const x0 = 1.2; // pila a la izquierda
    colocar(c, x0, 0.4, out, null);
    const ym = 0.4 + c.ym, xf = x0 + c.w + 1.9;
    out.cables.push({ x1: 0.5, y1: ym, x2: x0, y2: ym, id: c.id, dueno: null });
    out.cables.push({ x1: x0 + c.w, y1: ym, x2: xf - 0.45, y2: ym, id: c.id, dueno: null });
    out.focos.push({ id: c.id, x: xf, y: ym, r: 0.45, chico: false, dueno: null, principal: true });
    // retorno por abajo, de la pila al foco
    const yb = 0.4 + c.h + 0.5;
    out.retorno = [{ x1: 0.5, y1: ym, x2: 0.5, y2: yb }, { x1: 0.5, y1: yb, x2: xf, y2: yb }, { x1: xf, y1: yb, x2: xf, y2: ym + 0.45 }];
    out.pila = { x: 0.5, y: ym };
    out.ancho = xf + 0.8; out.alto = yb + 0.4; out.raiz = c.id;
    return out;
  }
  // Para cada nodo: si deja pasar y si su cable lleva corriente. Afuera de una caja, un cable está encendido si su nodo
  // deja pasar y todo lo que lo contiene también; adentro de una caja, el circuito de control se enciende por su cuenta.
  function corriente(c, valores) {
    if (!c || !c.k) c = circuito(c);
    const pasaId = {}, encendido = {};
    (function rec(x, padreEncendido) {
      pasaId[x.id] = pasa(x, valores);
      encendido[x.id] = pasaId[x.id] && padreEncendido;
      if (x.k === 'serie' || x.k === 'par') x.hijos.forEach(h => rec(h, encendido[x.id]));
      if (x.k === 'inv') rec(x.a, true);
      if (x.k === 'caja') { rec(x.a, true); rec(x.b, true); }
    })(c, true);
    return { pasa: pasaId, encendido, valor: pasaId[c.id] };
  }

  // ---------- la animación de la tabla ----------
  // Un cuadro por fila: los valores de los interruptores, el valor de cada columna y cuántas filas ya están llenas.
  function cuadrosTabla(f, o) {
    f = A(f); o = o || {};
    const T = tablaVerdad(f, o);
    return T.filas.map((x, j) => ({ fila: j, valores: x.valores, valor: x.valor, celdas: x.celdas, llenas: j + 1,
      texto: `${filaTexto(T.variables, x.valores)} → ${VF(x.valor)}` }));
  }

  return { VARS, SIM, NIVEL, VF, analizar, imprimir, leer, variables, evaluar, subformulas, fila, filaTexto, filasDe,
    tablaVerdad, clasificar, equivalentes, negar, formasCondicional, filasFalsas, valorConPartes, negacionSoloPrimera, cambiar,
    masFilas, condicionalComoCircuito, conAntecedenteFalso, diferencias, cuantificador, negarCuantificador,
    circuito, pasa, disposicion, corriente, cuadrosTabla, MEDIDAS: M_ };
});
