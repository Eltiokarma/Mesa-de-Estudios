/*
 * Lentes de la tabla viva: qué muestra cada carta. Lógica pura, sin DOM.
 *
 *   valor(Z, lente) → { texto, corto, fraccion, tipo, grupo, sinDato }
 *     texto     lo que dice el panel de comparar («496 kJ/mol»)
 *     corto     lo que cabe en la carta («496»)
 *     fraccion  0 a 1 para la barra, desde cero (las barras empiezan en cero: fidelidad); null si no hay barra
 *     tipo      'medido' | 'calculado' | 'extrapolado' | 'escala' | 'compilado' | 'masico' | null
 *     grupo     para las lentes de categoría (clase, estado): la familia que decide el tinte
 *     sinDato   true si no hay valor con fuente (decisión 9: no se estima)
 *   comparar(Za, Zb, lente) → frase con la diferencia, o null
 *
 * Unidades y redondeo: la carta redondea (masa a entero, EN a dos decimales); el panel da el valor de la fuente.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const datos = nodo ? require('./datos.js') : root.Kit.tablaDatos;
  const api = fabrica(datos);
  if (nodo) module.exports = api;
  else root.Kit.tablaLentes = api;
})(typeof self !== 'undefined' ? self : this, function (datos) {
  'use strict';
  const { ELEMENTOS } = datos;
  const coma = x => String(x).replace('.', ',');
  const miles = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const LENTES = {
    nada:   { nombre: 'Nada', largo: 'Solo el símbolo' },
    masa:   { nombre: 'Masa', largo: 'Masa atómica', unidad: 'u' },
    ei:     { nombre: 'Ionización', largo: 'Energía de ionización', unidad: 'kJ/mol' },
    en:     { nombre: 'Electronegatividad', largo: 'Electronegatividad (Pauling)', unidad: '' },
    radio:  { nombre: 'Radio', largo: 'Radio de van der Waals', unidad: 'pm' },
    clase:  { nombre: 'Clase', largo: 'Clase de elemento' },
    estado: { nombre: 'Estado', largo: 'Estado a 25 °C' }
  };
  const ORDEN = ['nada', 'masa', 'ei', 'en', 'radio', 'clase', 'estado'];

  // Grupo de tinte para la clase: cuatro familias (el texto de la carta dice la clase exacta).
  const FAMILIA = { alcalino: 'metal', alcalinotérreo: 'metal', 'de transición': 'metal', 'metal del bloque p': 'metal',
    lantánido: 'metal', actínido: 'metal', semimetal: 'semimetal', 'no metal': 'no-metal', halógeno: 'no-metal', 'gas noble': 'noble' };
  const CORTO_CLASE = { alcalino: 'alc', alcalinotérreo: 'alc-t', 'de transición': 'trans', 'metal del bloque p': 'met p',
    lantánido: 'lant', actínido: 'act', semimetal: 'semi', 'no metal': 'no m.', halógeno: 'halóg', 'gas noble': 'noble' };
  const CORTO_ESTADO = { gas: 'gas', líquido: 'líq', sólido: 'sól' };

  const maximo = {};
  maximo.masa = Math.max(...ELEMENTOS.map(e => e.peso || 0));
  maximo.ei = Math.max(...ELEMENTOS.map(e => (e.ei ? e.ei.kj : 0)));
  maximo.en = Math.max(...ELEMENTOS.map(e => e.en || 0));
  maximo.radio = Math.max(...ELEMENTOS.map(e => e.radio || 0));

  const SIN = { texto: 'sin dato', corto: '—', fraccion: null, tipo: null, grupo: null, sinDato: true };

  function valor(Z, lente) {
    const e = ELEMENTOS[Z - 1];
    if (!e) throw new Error(`lentes: Z fuera de 1 a 118 (${Z})`);
    if (!LENTES[lente]) throw new Error(`lente desconocida: ${lente}`);
    switch (lente) {
      case 'nada': return { texto: '', corto: '', fraccion: null, tipo: null, grupo: null, sinDato: false };
      case 'masa':
        if (e.peso !== undefined) return { texto: `${coma(e.pesoTexto)} u`, corto: String(Math.round(e.peso)),
          fraccion: e.peso / maximo.masa, tipo: 'medido', grupo: null, sinDato: false };
        // Sin peso atómico estándar: el número másico, que no es una masa atómica: sin barra.
        return { texto: `sin peso atómico estándar; número másico ${e.masico.map(n => `[${n}]`).join(' o ')}`,
          corto: `[${e.masico[0]}]`, fraccion: null, tipo: 'masico', grupo: null, sinDato: false };
      case 'ei':
        if (!e.ei) return SIN;
        return { texto: `${miles(e.ei.kj)} kJ/mol${e.ei.tipo === 'medido' ? '' : ` (${e.ei.tipo})`}`, corto: String(e.ei.kj),
          fraccion: e.ei.kj / maximo.ei, tipo: e.ei.tipo, grupo: null, sinDato: false };
      case 'en':
        if (e.en === undefined) return SIN;
        return { texto: coma(e.en.toFixed(2)), corto: coma(e.en.toFixed(2)), fraccion: e.en / maximo.en, tipo: 'escala', grupo: null, sinDato: false };
      case 'radio':
        if (e.radio === undefined) return SIN;
        return { texto: `${e.radio} pm`, corto: String(e.radio), fraccion: e.radio / maximo.radio, tipo: 'compilado', grupo: null, sinDato: false };
      case 'clase':
        if (!e.clase) return SIN;
        return { texto: e.clase, corto: CORTO_CLASE[e.clase], fraccion: null, tipo: 'compilado', grupo: FAMILIA[e.clase], sinDato: false };
      case 'estado':
        if (!e.estado) return SIN;
        return { texto: e.estado, corto: CORTO_ESTADO[e.estado], fraccion: null, tipo: 'compilado', grupo: e.estado, sinDato: false };
    }
  }

  // Diferencia entre dos cartas en una lente numérica: «Mg tiene 242 kJ/mol más que Na».
  function comparar(a, b, lente) {
    const ea = ELEMENTOS[a - 1], eb = ELEMENTOS[b - 1];
    const num = {
      masa: e => (e.peso !== undefined ? e.peso : null),
      ei: e => (e.ei ? e.ei.kj : null),
      en: e => (e.en !== undefined ? e.en : null),
      radio: e => (e.radio !== undefined ? e.radio : null)
    }[lente];
    if (!num) return null;
    const va = num(ea), vb = num(eb);
    if (va === null || vb === null) return null;
    if (va === vb) return `${ea.simbolo} y ${eb.simbolo} tienen el mismo valor`;
    const [mayor, menor, d] = va > vb ? [ea, eb, va - vb] : [eb, ea, vb - va];
    const dec = { masa: 3, ei: 0, en: 2, radio: 0 }[lente];
    const texto = coma(String(Number(d.toFixed(dec))));
    const u = LENTES[lente].unidad ? ` ${LENTES[lente].unidad}` : '';
    return `${mayor.simbolo} tiene ${dec === 0 ? miles(texto) : texto}${u} más que ${menor.simbolo}`;
  }

  return { LENTES, ORDEN, valor, comparar, maximo };
});
