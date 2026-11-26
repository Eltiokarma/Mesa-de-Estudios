/*
 * Teoría de «Reacciones químicas y balance» (quimica.reacciones-y-balance). Molde: docs/teoria.md y docs/molde-unidad.md;
 * unidad modelo: contenido/teoria/quimica/mol-y-composicion.js. Compañera: Bruna (castora).
 *
 * Etapa 9 del plan de calidad (26 nov 2026), con criterio delegado (docs/metodo/unidad/etapa-delegada.md). Propuesta:
 * docs/etapa9/propuesta-quimica.md. Segunda unidad de la rama «Cálculos químicos». Seis ideas, en este orden y con estos
 * id: 1 «Indicios y ecuación química» (`indicios`, otra Predice), 2 «Clases de reacciones» (`clasificar`, otra Predice),
 * 3 «Balance por tanteo» (`tanteo`, conserva su Predice), 4 «Oxidación, reducción y agentes» (`oxida-reduce`, conserva su
 * Predice), 5 «Electrones perdidos, electrones ganados» (`cambio-eo`, nueva) y 6 «Ion-electrón: ácido y básico»
 * (`ion-electron`, otra Predice).
 *
 * Regla 1: los balances, los EO, quién se oxida y los electrones salen del motor de la escena
 * (plantillas/balance-reacciones/motor.js, con sus casos); nada se escribe a mano si sale de una cuenta. Cuentas rehechas
 * aparte, por otro camino (scratchpad e9-quimica/verif/).
 *
 * Tabla de letras (propuesta §7, también en `letras`): EO el estado de oxidación (viene de Nomenclatura), e⁻ el electrón,
 * a, b, c, d los coeficientes del método algebraico (solo un ejemplo de la idea 3); (s), (l), (g) y (ac) los estados. El
 * calor se escribe con su palabra («+ calor»), sin letra.
 * Mapa de colores (propuesta §8, un color fijo por magnitud): el coeficiente violeta (c-f), el EO naranja (c-o), los
 * electrones turquesa (c-i), la carga carmín (c-h); fórmulas, subíndices, calor y nombres en tinta; sin verde. Las
 * partículas van con la paleta de elementos (nucleo/elementos.js) y nunca junto a un color de variable; en una misma lupa
 * no van dos elementos de colores cercanos (Elementos.CERCANOS). La prueba de la unidad lo revisa.
 * Objetos de la primera pantalla (quim-reaccion, de prueba): la mesa del laboratorio con tres vasos (1), el horno de cal
 * (2), la hornilla (3), la lámina de zinc en sulfato de cobre (4), el árbol de plata (5) y el frasco de permanganato (6).
 * Errores: estequiometria-ideas-erroneas.md (ES11, ES12, ES14), equilibrio-acidos-electroquimica (EC9, EC11),
 * quimica-materia-nomenclatura-organica (MA1 a MA3, MA8); S-SUM, S-IGN, N-CAR y W-CAR de la investigación de la etapa 9
 * (docs/investigacion/etapa9/quimica.reacciones-y-balance.md §03, por verificar); los QM- son hipótesis.
 * Fuentes (no van al alumno): OpenStax, Chemistry 2e, §4.1 y §4.2 (ecuaciones y clases) y §17.1 (redox, ion-electrón).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/balance-reacciones/motor.js'))
    : fabrica(root.Kit, root.MotorBalance);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MB) {
  'use strict';
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  const idx = (s, n) => ((s % n) + n) % n;
  const SEP = '   ·   ';
  const letra = L => ({ negrita: [L] });
  // ---------- Colores (un color fijo por magnitud) ----------
  const COEF = t => ({ v: 'c-f', t: String(t), m: 'coeficiente' }), EOc = t => ({ v: 'c-o', t: String(t), m: 'eo' });
  const ELc = t => ({ v: 'c-i', t: String(t), m: 'electrones' }), CARGA = t => ({ v: 'c-h', t: String(t), m: 'carga' });
  // ---------- Fórmulas: del texto del motor («MnO4^-», «Ca(OH)2») a como va en el libro («MnO₄⁻», «Ca(OH)₂») ----------
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = k => String(k).split('').map(c => SUBS[+c]).join('');
  function bonita(t) {
    const m = String(t).match(/^(.*?)(?:\^(\d*)([+-]))?(\((?:s|l|g|ac)\))?$/);
    const cuerpo = m[1].replace(/([A-Za-z)])(\d+)/g, (x, a, d) => a + sub(d));
    const carga = m[3] ? (m[2] && m[2] !== '1' ? m[2].split('').map(c => SUPS[+c]).join('') : '') + (m[3] === '+' ? '⁺' : '⁻') : '';
    return cuerpo + carga + (m[4] || '');
  }
  const sinEstado = t => String(t).replace(/\((?:s|l|g|ac)\)/g, '');
  // «2 Al(s) + 6 HCl(ac) -> 2 AlCl3(ac) + 3 H2(g)» → texto del libro, con «→».
  const ecTxt = t => String(t).split(/\s*->\s*/).map(l => l.split(/\s+\+\s+/).map(x => { const m = x.match(/^(\d+)\s+(.*)$/); return m ? `${m[1]}\u00a0${bonita(m[2])}` : bonita(x); }).join(' + ')).join(' → ');
  const listaY = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`);

  const f = (n, d = 2) => Kit.formatear(n, d);
  const sg = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
  // ---------- Partículas que se mueven solas (animación, docs/3d.md §6) ----------
  // Modelo cinético, en cámara lenta y determinístico (regla 1: cada cuadro es función de t). En un cilindro o una caja
  // las partículas vuelan en recta y rebotan (gas); en un vaso se deslizan alrededor de su lugar (líquido); las que
  // tienen un lugar fijo (un sólido en el fondo) vibran en su sitio. Frecuencias múltiplos de 1/CICLO: nada salta.
  const CICLO = 8, W2 = 2 * Math.PI / CICLO;
  const h01 = (a, b) => { let h = (Math.imul(a + 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x7F4A7C15, 0xC2B2AE35)) >>> 0; h ^= h >>> 15; h = Math.imul(h, 0x2C1B3C6D); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
  const tri = u => { const w = ((u % 2) + 2) % 2; return w > 1 ? 2 - w : w; };
  const acota = (u, a = 0.06, b = 0.94) => Math.max(a, Math.min(b, u));
  function mover(caja, t, k = 0) {
    const lista = [];
    for (const g of caja.particulas || []) { const n = Math.round(g.n === undefined ? 1 : g.n); for (let j = 0; j < n; j++) lista.push(g); }
    const libres = lista.filter(g => !(Number.isFinite(g.x) && Number.isFinite(g.y)));
    const cols = Math.max(1, Math.round(Math.sqrt(libres.length * 1.6))), filas = Math.max(1, Math.ceil(libres.length / cols));
    const casilla = libres.map((_, i) => i).sort((a, b) => h01(k + 1, a) - h01(k + 1, b));
    const gas = caja.forma !== 'vaso';
    let libre = 0;
    const particulas = lista.map((g, i) => {
      const r = j => h01(i * 7 + j, k * 13 + 3);
      if (Number.isFinite(g.x) && Number.isFinite(g.y)) {
        return Object.assign({}, g, { n: 1, x: acota(g.x + 0.018 * Math.sin(W2 * (6 + Math.floor(r(1) * 3)) * t + 6.3 * r(2))), y: acota(g.y + 0.018 * Math.sin(W2 * (6 + Math.floor(r(3) * 3)) * t + 6.3 * r(4)), 0.06, 0.96) });
      }
      const c = casilla[libre++], bx = 0.14 + 0.72 * (cols === 1 ? 0.5 : (c % cols) / (cols - 1)), by = 0.16 + ((caja.libreHasta || 0.84) - 0.16) * (filas === 1 ? 0.5 : Math.floor(c / cols) / (filas - 1));
      if (gas) {
        const vx = (2 + Math.floor(r(1) * 3)) * (r(2) < 0.5 ? -1 : 1) * 2 / CICLO, vy = (1 + Math.floor(r(3) * 3)) * (r(4) < 0.5 ? -1 : 1) * 2 / CICLO;
        return Object.assign({}, g, { n: 1, x: 0.06 + 0.88 * tri(bx + vx * t), y: 0.07 + 0.86 * tri(by + vy * t) });
      }
      return Object.assign({}, g, { n: 1, x: acota(bx + 0.07 * Math.sin(W2 * (1 + Math.floor(r(1) * 2)) * t + 6.3 * r(2)) + 0.03 * Math.sin(W2 * 3 * t + 6.3 * r(3))),
        y: acota(by + 0.05 * Math.sin(W2 * (1 + Math.floor(r(4) * 2)) * t + 6.3 * r(5)), 0.06, 0.95) });
    });
    return Object.assign({}, caja, { particulas });
  }
  const T_ANIMA = { id: 't', etiqueta: 't', min: 0, max: CICLO, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } };
  const ent = (v, ...ids) => { const x = Object.assign({}, v); for (const k of ids) x[k] = Math.round(x[k]); return x; };

  // ---------- Lupa con la paleta de elementos (partículas, nunca colores de variable) ----------
  // Los átomos se distinguen también en grises por su relleno y su tamaño. En una misma lupa no van dos elementos de
  // colores cercanos (Elementos.CERCANOS): por eso el nitrato de plata va sin moléculas de agua (H y Ag casi iguales) y con
  // KCl (Na y Ag también se parecen). La prueba de la unidad lo revisa.
  const AT = { H: { el: 'H', estilo: 'hueco', r: 4 }, O: { el: 'O', estilo: 'lleno', r: 6 }, Cl: { el: 'Cl', estilo: 'lleno', r: 7 },
    Zn: { el: 'Zn', estilo: 'punto', r: 7 }, Zn2: { el: 'Zn', estilo: 'hueco', r: 6 }, Ag: { el: 'Ag', estilo: 'punto', r: 7 }, K: { el: 'K', estilo: 'hueco', r: 7 }, N: { el: 'N', estilo: 'lleno', r: 5 },
    Ca: { el: 'Ca', estilo: 'punto', r: 7 }, Fe: { el: 'Fe', estilo: 'punto', r: 7 }, Fe3: { el: 'Fe', estilo: 'hueco', r: 6 }, Na: { el: 'Na', estilo: 'hueco', r: 6 }, C: { el: 'C', estilo: 'lleno', r: 6 } };
  const ESP = {
    H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]], H: [['H', 0, 0]], H2: [['H', -4, 0], ['H', 4, 0]], Cl: [['Cl', 0, 0]], Zn: [['Zn', 0, 0]], Zn2: [['Zn2', 0, 0]],
    Ag: [['Ag', 0, 0]], K: [['K', 0, 0]], NO3: [['N', 0, 0], ['O', -7, 4], ['O', 7, 4], ['O', 0, -7]], AgCl: [['Ag', -6, 0], ['Cl', 7, 0]],
    CaO: [['Ca', -6, 0], ['O', 6, 0]], CaOH2: [['Ca', 0, 0], ['O', -9, 0], ['H', -14, -4], ['O', 9, 0], ['H', 14, -4]],
    Fe: [['Fe', 0, 0]], Fe3: [['Fe3', 0, 0]], OH: [['O', -3, 0], ['H', 4, -3]], Na: [['Na', 0, 0]], FeOH3: [['Fe', 0, 2], ['O', -12, 6], ['H', -18, 2], ['O', 12, 6], ['H', 18, 2], ['O', 0, -10], ['H', 0, -17]],
  };
  const elementosDe = cajas => [...new Set(cajas.flatMap(c => (c.particulas || []).flatMap(p => (ESP[p.e] || []).map(a => AT[a[0]].el))))];
  const lupaEl = (cajas, extra = {}) => ({ pieza: 'quim-particulas', datos: Object.assign({ atomos: AT, especies: ESP, alto: 150, separacion: 24, flechas: cajas.length > 1, cuentaPorFila: 2, cajas }, extra), estado: {} });
  // La carga de cada partícula de las lupas (la prueba de la unidad comprueba que cada vaso sea neutro): H es H⁺, Zn2 es
  // Zn²⁺; los átomos de un sólido o una molécula, sin carga.
  const CARGA_ESP = { H: 1, Cl: -1, Zn2: 2, Ag: 1, K: 1, NO3: -1, Fe3: 3, OH: -1, Na: 1 };
  // Un trozo de metal en el fondo: átomos pegados, en dos filas.
  const trozo = (e, k) => [[0.4, 0.93], [0.5, 0.93], [0.6, 0.93], [0.45, 0.85], [0.55, 0.85]].slice(0, k).map(([x, y]) => ({ e, n: 1, x, y }));
  // Las partículas que se mueven solas (modelo cinético en cámara lenta, de la idea 3 de Materia y energía): en el vaso se
  // deslizan alrededor de su lugar; las que tienen un lugar fijo (un sólido en el fondo, burbujas arriba) vibran en su sitio.
  const enFila = (e, k, y, x0 = 0.25, x1 = 0.75) => Array.from({ length: k }, (_, i) => ({ e, n: 1, x: k === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (k - 1), y }));

  // ---------- Idea 1 (rehecha, 26 nov): indicios y ecuación química ----------
  // Propuesta §3 idea 1. Objeto de la primera pantalla: la mesa del laboratorio con tres vasos (quim-reaccion).
  // Cambia: el fenómeno · Permanece: antes a la izquierda, después a la derecha, y la ecuación con estados en la lectura ·
  // Progresa: del indicio a la sustancia nueva · Se reserva: el hidróxido de hierro de Predice · Debe verse: que el (g) o el
  // (s) de un producto es el gas o el sólido que aparece.
  // Errores: MA8 (describir lo que se ve sin mirar las sustancias), MA1 (cambio de estado como reacción), MA3 (disolver
  // es reaccionar), QM-PRECIP (el sólido es la sal que estaba disuelta), QM-INDICIO-GAS (toda reacción hace burbujas),
  // QM-LADO (confundir reactivo con producto), QM-ESTADO (leer mal el estado).
  // Juego: Zn con ácido muriático, agua que hierve, nitrato de plata con KCl y cal viva con agua.
  const FEN = {
    gas: { t: 'Zinc en ácido muriático', ec: 'Zn(s) + 2 HCl(ac) -> ZnCl2(ac) + H2(g)', dice: 'sale un gas',
      antes: { titulo: 'Antes', forma: 'vaso', nivel: 0.8, libreHasta: 0.62, particulas: [...trozo('Zn', 5), { e: 'H', n: 4 }, { e: 'Cl', n: 4 }],
        cuenta: [{ e: 'Zn', texto: 'Zn(s)' }, { e: 'H', texto: 'H⁺' }, { e: 'Cl', texto: 'Cl⁻' }] },
      despues: { titulo: 'Después', forma: 'vaso', nivel: 0.8, libreHasta: 0.62, particulas: [...trozo('Zn', 3), ...enFila('H2', 2, 0.3, 0.3, 0.7), { e: 'Zn2', n: 2 }, { e: 'Cl', n: 4 }],
        cuenta: [{ e: 'Zn', texto: 'Zn(s)' }, { e: 'Zn2', texto: 'Zn²⁺' }, { e: 'Cl', texto: 'Cl⁻' }, { e: 'H2', texto: 'H₂(g)' }] } },
    hervir: { t: 'Agua que hierve', ec: 'H2O(l) -> H2O(g)', dice: 'sigue siendo la misma sustancia',
      antes: { titulo: 'Agua', forma: 'vaso', nivel: 0.7, particulas: [{ e: 'H2O', n: 6 }], cuenta: [{ e: 'H2O', texto: 'H₂O' }] },
      despues: { titulo: 'Vapor', forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 6 }], cuenta: [{ e: 'H2O', texto: 'H₂O' }] } },
    solido: { t: 'Nitrato de plata con KCl', ec: 'AgNO3(ac) + KCl(ac) -> AgCl(s) + KNO3(ac)', dice: 'aparece un sólido',
      antes: { titulo: 'Antes', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'Ag', n: 2 }, { e: 'NO3', n: 2 }, { e: 'K', n: 2 }, { e: 'Cl', n: 2 }],
        cuenta: [{ e: 'Ag', texto: 'Ag⁺' }, { e: 'NO3', texto: 'NO₃⁻' }, { e: 'K', texto: 'K⁺' }, { e: 'Cl', texto: 'Cl⁻' }] },
      despues: { titulo: 'Después', forma: 'vaso', nivel: 0.8, libreHasta: 0.66, particulas: [...enFila('AgCl', 2, 0.92, 0.35, 0.65), { e: 'NO3', n: 2 }, { e: 'K', n: 2 }],
        cuenta: [{ e: 'AgCl', texto: 'AgCl(s)' }, { e: 'NO3', texto: 'NO₃⁻' }, { e: 'K', texto: 'K⁺' }] } },
    calor: { t: 'Cal viva con agua', ec: 'CaO(s) + H2O(l) -> Ca(OH)2(s)', dice: 'se calienta',
      antes: { titulo: 'Antes', forma: 'vaso', nivel: 0.8, libreHasta: 0.66, particulas: [...enFila('CaO', 2, 0.92, 0.35, 0.65), { e: 'H2O', n: 4 }], cuenta: [{ e: 'CaO', texto: 'CaO' }, { e: 'H2O', texto: 'H₂O' }] },
      despues: { titulo: 'Después', forma: 'vaso', nivel: 0.8, libreHasta: 0.66, particulas: [...enFila('CaOH2', 2, 0.9, 0.3, 0.7), { e: 'H2O', n: 2 }], cuenta: [{ e: 'CaOH2', texto: 'Ca(OH)₂' }, { e: 'H2O', texto: 'H₂O' }] } },
  };
  const lecturaFen = k => [`${ecTxt(FEN[k].ec)}: ${FEN[k].dice}`];
  // Las burbujas de H₂ suben y salen por arriba, y vuelven a nacer junto al zinc (un ciclo de CICLO s).
  const burbujas = (caja, t) => Object.assign({}, caja, { particulas: caja.particulas.map((p, i) => (p.e === 'H2' ? Object.assign({}, p, { y: 0.85 - 0.8 * (((t / CICLO) * 2 + i * 0.37) % 1) }) : p)) });
  const lupaFen = (k, t) => lupaEl([mover(FEN[k].antes, t, 0), burbujas(mover(FEN[k].despues, t, 1), t)], { alt: `Lupa (un modelo, no a escala) de ${FEN[k].t.toLowerCase()}, antes y después: ${ecTxt(FEN[k].ec)}.` });
  // Predice y Mira: cloruro de hierro(III) con soda cáustica. Fe³⁺ con tres Cl⁻ en un vaso; Na⁺ con tres OH⁻ en el otro.
  const PRED1 = {
    a: { titulo: 'FeCl₃(ac)', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'Fe3', n: 1 }, { e: 'Cl', n: 3 }], cuenta: [{ e: 'Fe3', texto: 'Fe³⁺' }, { e: 'Cl', texto: 'Cl⁻' }] },
    b: { titulo: 'NaOH(ac)', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'Na', n: 3 }, { e: 'OH', n: 3 }], cuenta: [{ e: 'Na', texto: 'Na⁺' }, { e: 'OH', texto: 'OH⁻' }] },
  };
  const D_EST = '(s) sólido; (l) líquido; (g) gas; (ac) disuelto en agua (acuoso)';
  const D_LADOS = 'Reactivos: a la izquierda de la flecha; productos: a la derecha';
  const D_REAC = 'Reacción química: se forman sustancias nuevas, con otras propiedades';
  const D_IND = 'Indicios de reacción: un gas que sale, un sólido que aparece (precipitado), un cambio de color o de temperatura';

  // Ejemplos de la idea 1. Revisado aparte (verif/idea1.js): cada ecuación está balanceada (motor y conteo propio) y el
  // estado de cada producto es el de la respuesta; las letras correctas de nivel 3: D, C, A, E, B.
  const EJEMPLOS_IND = [
    { nivel: 1, titulo: 'Los reactivos', enunciado: 'En 2 H₂(g) + O₂(g) → 2 H₂O(l), ¿cuáles son los reactivos?', datos: [D_LADOS],
      solucion: [{ texto: 'Los reactivos van a la izquierda de la flecha: H₂ y O₂. El agua, a la derecha, es el producto.' }], respuesta: ['H₂ y O₂'] },
    { nivel: 1, titulo: 'El estado de un producto', enunciado: 'En el horno de cal, CaCO₃(s) → CaO(s) + CO₂(g). ¿En qué estado sale el CO₂?', datos: [D_EST],
      solucion: [{ texto: 'El CO₂ lleva (g), así que sale como gas; el CaO lleva (s) y queda como sólido.' }], respuesta: ['Como gas'] },
    { nivel: 1, titulo: 'Lo que queda disuelto', enunciado: 'En Pb(NO₃)₂(ac) + 2 KI(ac) → PbI₂(s) + 2 KNO₃(ac), ¿qué producto queda disuelto en agua?', datos: [D_EST, D_LADOS],
      solucion: [{ texto: 'De los dos productos, el KNO₃ lleva (ac) y queda disuelto; el PbI₂ lleva (s) y aparece como sólido.' }], respuesta: ['El KNO₃'] },
    { nivel: 1, titulo: 'Contar sustancias', enunciado: 'En Zn(s) + CuSO₄(ac) → ZnSO₄(ac) + Cu(s), ¿cuántos reactivos y cuántos productos hay?', datos: [D_LADOS, 'El signo + separa una sustancia de otra'],
      solucion: [{ texto: 'A la izquierda de la flecha están el Zn y el CuSO₄, que son dos reactivos; a la derecha, el ZnSO₄ y el Cu, que son dos productos.' }], respuesta: ['2 reactivos y 2 productos'] },
    { nivel: 1, titulo: 'La ecuación en palabras', enunciado: 'Escribe en palabras la ecuación C(s) + O₂(g) → CO₂(g), con el estado de cada sustancia.', datos: [D_EST, 'La flecha se lee «forman» o «producen»'],
      solucion: [{ texto: 'A la izquierda hay carbono sólido y oxígeno gaseoso, y a la derecha, dióxido de carbono gaseoso; la flecha que los une se lee «forman».' }],
      respuesta: ['Carbono sólido y oxígeno gaseoso forman dióxido de carbono gaseoso'] },
    { nivel: 2, titulo: 'Soplar en agua de cal', enunciado: 'Soplas con un sorbete en agua de cal: Ca(OH)₂(ac) + CO₂(g) → CaCO₃(s) + H₂O(l). ¿Qué indicio ves?', datos: [D_EST, D_IND],
      solucion: [{ texto: 'El CaCO₃ lleva (s) y se forma dentro de una solución, así que aparece un sólido.' }, { texto: 'Ese sólido blanco enturbia el agua: es el precipitado.' }],
      respuesta: ['El agua se enturbia: aparece CaCO₃ sólido'] },
    { nivel: 2, titulo: 'Agua oxigenada en una herida', enunciado: 'El agua oxigenada hace espuma en una herida: 2 H₂O₂(ac) → 2 H₂O(l) + O₂(g). ¿Qué indicio es y de qué gas?', datos: [D_EST, D_IND],
      solucion: [{ texto: 'El O₂ lleva (g), así que sale un gas.' }, { texto: 'La espuma está hecha de burbujas de oxígeno, mientras el agua queda líquida.' }],
      respuesta: ['Burbujas de oxígeno, O₂'] },
    { nivel: 2, titulo: 'Burbujas sin reacción', enunciado: 'Al destapar una gaseosa salen burbujas de CO₂ que ya estaba disuelto: CO₂(ac) → CO₂(g). ¿Hay reacción química?', datos: [D_EST, D_REAC],
      solucion: [{ texto: 'A los dos lados está la misma sustancia, CO₂: solo pasa de disuelto a gas.' }, { texto: 'Hay un indicio, las burbujas, pero no se forma ninguna sustancia nueva.' }],
      respuesta: ['No: es el mismo CO₂, que sale del agua'] },
    { nivel: 2, titulo: 'Calor sin reacción', enunciado: 'Al disolver soda cáustica, NaOH, en agua, el vaso se calienta y el sólido desaparece. ¿Prueba eso una reacción?', datos: [D_REAC, D_IND],
      solucion: [{ texto: 'El NaOH solo se disuelve: sus iones Na⁺ y OH⁻ ya estaban en el sólido y ahora se reparten en el agua.' }, { texto: 'El calor es un indicio, pero no aparece ninguna sustancia nueva.' }],
      respuesta: ['No: el NaOH solo se disuelve'] },
    { nivel: 2, titulo: 'Aluminio en ácido', enunciado: 'En 2 Al(s) + 6 HCl(ac) → 2 AlCl₃(ac) + 3 H₂(g), ¿qué se ve y qué producto queda disuelto?', datos: [D_EST, D_IND],
      solucion: [{ texto: 'El H₂ lleva (g), así que salen burbujas de hidrógeno.' }, { texto: 'El AlCl₃ lleva (ac), así que queda disuelto y no se ve, mientras el aluminio sólido se va gastando.' }],
      respuesta: ['Burbujas de H₂; el AlCl₃ queda disuelto'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Sobre K₂CO₃(ac) + 2 HCl(ac) → 2 KCl(ac) + H₂O(l) + CO₂(g), di si es verdadero (V) o falso (F): I. Salen burbujas. II. El KCl precipita. III. Hay tres productos.',
      alternativas: ['VVV', 'FFV', 'VFF', 'VFV', 'FVF'], datos: [D_EST, D_LADOS],
      solucion: [{ texto: 'I es verdadera, porque el CO₂ lleva (g). II es falsa, porque el KCl lleva (ac) y queda disuelto.' }, { texto: 'III es verdadera: KCl, H₂O y CO₂ son tres productos.' },
        { texto: ['La ', letra('A'), ' cree que el KCl precipita; la ', letra('B'), ' niega las burbujas; la ', letra('C'), ' no cuenta los tres productos, y la ', letra('E'), ' invierte las tres respuestas.'] }],
      respuesta: [letra('D'), ', VFV'] },
    { nivel: 3, titulo: 'La mezcla que da un sólido', enunciado: '¿En cuál de estas mezclas aparece un sólido?', datos: [D_EST],
      alternativas: ['Fe(s) + H₂SO₄(ac) → FeSO₄(ac) + H₂(g)', 'NaOH(ac) + HCl(ac) → NaCl(ac) + H₂O(l)', 'MgCl₂(ac) + 2 NaOH(ac) → Mg(OH)₂(s) + 2 NaCl(ac)',
        '2 Na(s) + 2 H₂O(l) → 2 NaOH(ac) + H₂(g)', 'CaCO₃(s) → CaO(s) + CO₂(g)'],
      solucion: [{ texto: 'Aparece un sólido cuando un producto con (s) se forma a partir de soluciones, y eso solo pasa con el Mg(OH)₂.' },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' dan burbujas de H₂; la ', letra('B'), ' no da sólido ni gas, y en la ', letra('E'), ' el sólido ya estaba antes y lo que sale es un gas.'] }],
      respuesta: [letra('C'), ', el Mg(OH)₂'] },
    { nivel: 3, titulo: 'El indicio que engaña', enunciado: 'Un compañero dice: «Si salen burbujas, hubo reacción». ¿Qué caso lo contradice?', datos: [D_REAC],
      alternativas: ['Una gaseosa que se destapa', 'Una pastilla efervescente en agua', 'Sarro con ácido muriático', 'Agua oxigenada en una herida', 'Un trozo de sodio en agua'],
      solucion: [{ texto: 'En la gaseosa sale el CO₂ que ya estaba disuelto, así que no se forma ninguna sustancia nueva.' },
        { texto: ['En la ', letra('B'), ', la ', letra('C'), ', la ', letra('D'), ' y la ', letra('E'), ' sí se forma un gas nuevo (CO₂, CO₂, O₂ y H₂).'] }],
      respuesta: [letra('A'), ', la gaseosa'] },
    { nivel: 3, titulo: 'El estado que falta', enunciado: 'En el horno, el bicarbonato de un queque se descompone: 2 NaHCO₃(s) → Na₂CO₃(s) + H₂O + CO₂. ¿Qué estado se le escribe al H₂O y cuál al CO₂?', datos: [D_EST, 'El agua hierve a unos 100 °C; un horno de queques está a unos 180 °C'],
      alternativas: ['(l) y (g)', '(l) y (ac)', '(ac) y (g)', '(s) y (g)', '(g) y (g)'],
      solucion: [{ texto: 'El horno está a unos 180 °C, más que los 100 °C a los que hierve el agua, así que el H₂O sale como vapor: (g). El CO₂ también sale como gas.' },
        { texto: ['La ', letra('A'), ' deja el agua líquida, como en la mesa; la ', letra('B'), ' y la ', letra('C'), ' los dan disueltos, pero no hay agua líquida que los disuelva, y la ', letra('D'), ' da el agua como hielo.'] }],
      respuesta: [letra('E'), ', (g) y (g)'] },
    { nivel: 3, titulo: 'Qué se ve al mezclar', enunciado: 'Se mezcla nitrato de plomo con cloruro de potasio: Pb(NO₃)₂(ac) + 2 KCl(ac) → PbCl₂(s) + 2 KNO₃(ac). ¿Qué afirmación es correcta?', datos: [D_EST, D_LADOS],
      alternativas: ['El KNO₃ cae al fondo', 'Aparece PbCl₂ sólido y el KNO₃ queda disuelto', 'Salen burbujas de un gas', 'No se ve nada: todo es transparente', 'El KCl es un producto'],
      solucion: [{ texto: 'El PbCl₂ lleva (s), así que aparece un sólido; el KNO₃ lleva (ac) y queda disuelto.' },
        { texto: ['La ', letra('A'), ' confunde cuál producto es el sólido; la ', letra('C'), ' busca un gas que no hay; la ', letra('D'), ' no lee el (s), y la ', letra('E'), ' pone el KCl del otro lado de la flecha.'] }],
      respuesta: [letra('B'), ', PbCl₂ sólido'] },
  ];

  // Así se resuelve y Ahora tú (tipo «indicio»): listas distintas (resuelve-repite), sin los casos del juego, de Predice
  // ni de los ejemplos (Etapa 5, reglas 8 y 15). Cada caso: la ecuación (balanceada, la revisa la prueba con el motor), el
  // producto que se ve y si es gas o sólido.
  const RES1 = [
    ['Mg(s) + 2 HCl(ac) -> MgCl2(ac) + H2(g)', 'H2', 'gas', 'una cinta de magnesio en ácido muriático'],
    ['BaCl2(ac) + Na2SO4(ac) -> BaSO4(s) + 2 NaCl(ac)', 'BaSO4', 'solido', 'cloruro de bario con sulfato de sodio'],
    ['CaCO3(s) + 2 HCl(ac) -> CaCl2(ac) + H2O(l) + CO2(g)', 'CO2', 'gas', 'sarro de la tetera con ácido muriático'],
    ['CuSO4(ac) + 2 NaOH(ac) -> Cu(OH)2(s) + Na2SO4(ac)', 'Cu(OH)2', 'solido', 'sulfato de cobre con soda cáustica'],
    ['Fe(s) + 2 HCl(ac) -> FeCl2(ac) + H2(g)', 'H2', 'gas', 'clavos de hierro en ácido muriático'],
  ];
  const AT1 = [
    ['2 Na(s) + 2 H2O(l) -> 2 NaOH(ac) + H2(g)', 'H2', 'gas'], ['NH4Cl(ac) + NaOH(ac) -> NaCl(ac) + H2O(l) + NH3(g)', 'NH3', 'gas'],
    ['Na2CO3(ac) + 2 HCl(ac) -> 2 NaCl(ac) + H2O(l) + CO2(g)', 'CO2', 'gas'], ['CaCl2(ac) + Na2CO3(ac) -> CaCO3(s) + 2 NaCl(ac)', 'CaCO3', 'solido'],
    ['AgNO3(ac) + KBr(ac) -> AgBr(s) + KNO3(ac)', 'AgBr', 'solido'], ['FeS(s) + 2 HCl(ac) -> FeCl2(ac) + H2S(g)', 'H2S', 'gas'],
    ['ZnCl2(ac) + 2 NaOH(ac) -> Zn(OH)2(s) + 2 NaCl(ac)', 'Zn(OH)2', 'solido'], ['NaHCO3(ac) + HCl(ac) -> NaCl(ac) + H2O(l) + CO2(g)', 'CO2', 'gas'],
    ['Ba(NO3)2(ac) + K2SO4(ac) -> BaSO4(s) + 2 KNO3(ac)', 'BaSO4', 'solido'],
  ];
  // Las sustancias de una ecuación con su lado y su estado: [{ f: 'NaCl(ac)', lado: 'r' | 'p', estado: 'ac' }].
  const terminos = ec => ec.split(/\s*->\s*/).flatMap((l, i) => l.split(/\s+\+\s+/).map(x => { const f = x.replace(/^\d+\s+/, ''); return { f, lado: i ? 'p' : 'r', estado: (f.match(/\((s|l|g|ac)\)$/) || [])[1] }; }));
  const nombreEstado = { s: 'sólido', l: 'líquido', g: 'gas', ac: 'disuelto en agua' };
  const ver = (tipo, f) => (tipo === 'gas' ? `Burbujas de ${bonita(sinEstado(f))}` : `Aparece un sólido: ${bonita(sinEstado(f))}`);
  const seVe = tipo => (tipo === 'gas' ? 'sale como gas y forma burbujas' : 'aparece como sólido en el vaso');
  function casoIndicio([ec, visto, tipo]) {
    const ts = terminos(ec), disuelto = ts.find(x => x.lado === 'p' && x.estado === 'ac');
    const ops = [{ id: 'c', texto: ver(tipo, visto), correcta: true }];
    if (disuelto) ops.push({ id: 'precip', texto: `Aparece un sólido: ${bonita(sinEstado(disuelto.f))}`, error: 'QM-PRECIP',
      siFuera: `Hiciste bien en mirar los productos, pero el ${bonita(sinEstado(disuelto.f))} lleva (ac): queda disuelto en el agua y no cae como sólido.` });
    if (tipo === 'solido') ops.push({ id: 'gas', texto: 'Salen burbujas de un gas', error: 'QM-INDICIO-GAS', siFuera: 'Sí hay un indicio, pero saldría un gas solo si algún producto llevara (g), y aquí ninguno lo lleva.' });
    else {
      const liq = ts.find(x => x.lado === 'p' && x.estado === 'l');
      if (liq) ops.push({ id: 'liq', texto: `Burbujas de ${bonita(sinEstado(liq.f))}`, error: 'QM-ESTADO', siFuera: `Haría burbujas si llevara (g), pero el ${bonita(sinEstado(liq.f))} lleva (l): se forma como líquido y queda en el vaso.` });
      ops.push({ id: 'solido', texto: 'Aparece un sólido que cae al fondo', error: 'QM-ESTADO', siFuera: 'Sí hay un indicio, pero aparecería un sólido solo si algún producto llevara (s), y aquí ninguno lo lleva.' });
    }
    ops.push({ id: 'nada', texto: 'Nada: todo queda disuelto', error: 'MA8', siFuera: `Es cierto que lo que lleva (ac) no se ve, pero el ${bonita(sinEstado(visto))} lleva (${tipo === 'gas' ? 'g' : 's'}): ${seVe(tipo)}.` });
    return { pregunta: `Se mezclan los reactivos de esta reacción: ${ecTxt(ec)}. ¿Qué indicio se ve?`, datos: [D_EST, D_IND], opciones: ops.slice(0, 4),
      solucion: { texto: `El ${bonita(sinEstado(visto))} lleva (${tipo === 'gas' ? 'g' : 's'}), así que ${tipo === 'gas' ? 'sale como gas' : 'aparece como sólido'}; lo que lleva (ac) queda disuelto y no se ve.`, ecuacion: [ecTxt(ec)] } };
  }
  // ¿Hay reacción? El caso dice qué sustancias hay antes y después (la identidad, no solo lo que se ve).
  const PRUEBA1 = [
    ['Echas una pastilla efervescente al agua: salen burbujas de CO₂, que la pastilla no traía', true, 'el CO₂'],
    ['Un clavo queda a la lluvia: se cubre de óxido de hierro, rojizo', true, 'el óxido de hierro'],
    ['Hielo seco, CO₂ sólido, echa humo blanco: el CO₂ pasa a gas', false, 'CO₂'],
    ['Un vidrio frío se empaña con tu aliento: es vapor de agua que se vuelve líquido', false, 'agua'],
    ['Quemas un papel: quedan ceniza, CO₂ y vapor de agua, que el papel no era', true, 'el CO₂ y la ceniza'],
    ['La naftalina de un ropero se achica: sus moléculas pasan al aire sin cambiar', false, 'naftalina'],
    ['Echas vinagre a la leche: el vinagre cambia sus proteínas y se forman grumos nuevos', true, 'la proteína cambiada'],
    ['Calientas yodo sólido: sale un vapor violeta, también de yodo', false, 'yodo'],
  ];
  function casoPrueba([caso, hubo, que]) {
    const ops = hubo ? [
      { id: 'c', texto: `Sí: aparece ${que}, una sustancia nueva`, correcta: true },
      { id: 'estado', texto: 'No: solo cambió de estado', error: 'MA2', siFuera: 'Un cambio de estado no sería una reacción, es cierto, pero aquí no solo cambia el estado: aparece una sustancia que antes no estaba.' },
      { id: 'mezcla', texto: 'No: solo se mezclaron dos cosas', error: 'MA3', siFuera: 'Si solo se mezclaran, cada sustancia seguiría siendo la misma; aquí, en cambio, aparece una sustancia que antes no estaba.' },
      { id: 'color', texto: 'No: sin cambio de color no hay reacción', error: 'MA8', siFuera: 'El color es un indicio, pero no hace falta: hay reacción cuando aparece una sustancia nueva, cambie o no el color.' },
    ] : [
      { id: 'c', texto: `No: sigue siendo ${que}`, correcta: true },
      { id: 'indicio', texto: 'Sí: hay un indicio, y eso prueba la reacción', error: 'MA8', siFuera: 'Es cierto que hay un indicio, pero un indicio solo no prueba la reacción: antes y después está la misma sustancia.' },
      { id: 'estado', texto: 'Sí: al cambiar de estado es otra sustancia', error: 'MA1', siFuera: 'Sí cambia de estado, pero eso no forma otra sustancia: las moléculas siguen siendo las mismas, solo más juntas o más separadas.' },
      { id: 'aspecto', texto: 'Sí: se ve distinto, así que cambió', error: 'MA8', siFuera: 'Es cierto que se ve distinto, pero el aspecto puede cambiar sin reacción: lo que cuenta es la sustancia, y sigue siendo la misma.' },
    ];
    return { pregunta: `${caso}. ¿Hubo reacción química?`, datos: [D_REAC, D_IND], opciones: ops,
      solucion: { texto: hubo ? `Hay reacción, porque aparece ${que}, que antes no estaba.` : `No hay reacción: antes y después hay ${que}, y un indicio solo no basta si no aparece una sustancia nueva.` } };
  }
  // ¿Cuál es…? En una ecuación, la sustancia de un lado y un estado (una sola cumple).
  const PARTES1 = [
    ['Mg(s) + CuSO4(ac) -> MgSO4(ac) + Cu(s)', 'p', 's'], ['Zn(s) + 2 AgNO3(ac) -> Zn(NO3)2(ac) + 2 Ag(s)', 'r', 's'],
    ['CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l)', 'p', 'l'], ['Cl2(g) + 2 NaBr(ac) -> 2 NaCl(ac) + Br2(l)', 'r', 'g'],
    ['Zn(s) + H2SO4(ac) -> ZnSO4(ac) + H2(g)', 'p', 'g'], ['Cu(s) + 2 AgNO3(ac) -> Cu(NO3)2(ac) + 2 Ag(s)', 'p', 'ac'],
  ];
  function casoPartes([ec, lado, est], r) {
    const ts = terminos(ec), quien = ts.filter(x => x.lado === lado && x.estado === est);
    if (quien.length !== 1) throw new Error(`casoPartes: ${ec} no da una sola sustancia`);
    const pide = `un ${lado === 'r' ? 'reactivo' : 'producto'} ${nombreEstado[est] === 'gas' ? 'gaseoso' : nombreEstado[est]}`;
    const otros = r.baraja(ts.filter(x => x !== quien[0]));
    const ops = [{ id: 'c', texto: bonita(quien[0].f), correcta: true }, ...otros.slice(0, 3).map((x, i) => ({ id: `o${i}`, texto: bonita(x.f),
      error: x.lado !== lado ? 'QM-LADO' : 'QM-ESTADO',
      siFuera: x.lado !== lado ? `El ${bonita(sinEstado(x.f))} sí lleva ese estado, pero está del otro lado de la flecha: es un ${x.lado === 'r' ? 'reactivo' : 'producto'}.` : `El ${bonita(sinEstado(x.f))} sí es un ${lado === 'r' ? 'reactivo' : 'producto'}, pero lleva (${x.estado}) y no (${est}).` }))];
    return { pregunta: `En ${ecTxt(ec)}, ¿cuál es ${pide}?`, datos: [D_EST, D_LADOS], opciones: ops,
      solucion: { texto: `${lado === 'r' ? 'A la izquierda' : 'A la derecha'} de la flecha, solo el ${bonita(sinEstado(quien[0].f))} lleva (${est}).` } };
  }
  // Nivel de examen: tres afirmaciones sobre una ecuación.
  const VF1 = [
    ['Pb(NO3)2(ac) + 2 KI(ac) -> PbI2(s) + 2 KNO3(ac)', 'KI'], ['AgNO3(ac) + KI(ac) -> AgI(s) + KNO3(ac)', 'KNO3'],
    ['Na2S(ac) + 2 HCl(ac) -> 2 NaCl(ac) + H2S(g)', 'HCl'], ['2 NaOH(ac) + CO2(g) -> Na2CO3(ac) + H2O(l)', 'CO2'],
  ];
  function casoVF([ec, x], r) {
    const ts = terminos(ec), nP = ts.filter(t => t.lado === 'p').length, tx = ts.find(t => sinEstado(t.f) === x);
    const precip = ts.some(t => t.lado === 'p' && t.estado === 's') && ts.filter(t => t.lado === 'r').every(t => t.estado === 'ac');
    const gas = ts.some(t => t.lado === 'p' && t.estado === 'g');
    const nDice = r.de([nP, nP + 1, nP - 1].filter(k => k >= 1));
    const af = [
      ...(r() < 0.5 ? [['Salen burbujas', gas, gas ? 'un producto lleva (g)' : 'ningún producto lleva (g)']] : [['Aparece un sólido', precip, precip ? 'un producto lleva (s)' : 'ningún producto lleva (s)']]),
      [`El ${bonita(x)} es un reactivo`, tx.lado === 'r', tx.lado === 'r' ? `el ${bonita(x)} está a la izquierda` : `el ${bonita(x)} es un producto`],
      [`Hay ${nDice} producto${nDice === 1 ? '' : 's'}`, nDice === nP, `a la derecha hay ${nP} productos`],
    ];
    const clave = af.map(a => (a[1] ? 'V' : 'F')).join('');
    const todas = ['VVV', 'VVF', 'VFV', 'FVV', 'VFF', 'FVF', 'FFV', 'FFF'].filter(k => k !== clave);
    const malas = r.baraja(todas).slice(0, 3);
    const ROM = ['I', 'II', 'III'];
    const ops = [{ id: 'c', texto: clave, correcta: true }, ...malas.map((k, i) => {
      const j = [0, 1, 2].find(q => k[q] !== clave[q]);
      return { id: `vf${i}`, texto: k, error: j === 0 ? 'QM-ESTADO' : j === 1 ? 'QM-LADO' : 'QM-CONTEO',
        siFuera: `La ${ROM[j]} es ${clave[j] === 'V' ? 'verdadera' : 'falsa'}, porque ${af[j][2]}.` };
    })];
    return { pregunta: `Sobre ${ecTxt(ec)}: I. ${af[0][0]}. II. ${af[1][0]}. III. ${af[2][0]}. ¿Qué es verdadero (V) y qué falso (F)?`, datos: [D_EST, D_LADOS], opciones: ops,
      solucion: { texto: `I: ${af[0][2]}. II: ${af[1][2]}. III: ${af[2][2]}.`, ecuacion: [clave] } };
  }

  const indicios = {
    id: 'indicios',
    titulo: 'Indicios y ecuación química',
    pregunta: '¿Qué dice una ecuación química de lo que vas a ver?',
    temas: ['Evidencias de una reacción'],
    pieza: 'quim-particulas',
    aprendizaje: 'Gas, precipitado, color o calor son indicios; la ecuación escribe reactivos y productos con su estado, y el (g) o el (s) anuncian lo visible.',
    actividad: 'Mirar con la lupa cuatro fenómenos, antes y después, con su ecuación.',
    lee: {
      tarjetas: [
        { titulo: 'Tres vasos en la mesa', texto: 'En el laboratorio del colegio, un vaso burbujea, otro tiene un sólido blanco en el fondo y el tercero se calienta. Son indicios: pistas de que puede haber una reacción química.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'mesa', nombre: 'Tres vasos, tres indicios' }, estado: {} } },
        { titulo: 'Reactivos y productos', texto: 'Una ecuación química escribe la reacción con fórmulas. A la izquierda de la flecha van los reactivos, lo que había; a la derecha, los productos, lo que se forma. El signo + separa una sustancia de otra.',
          ecuacion: ['reactivos → productos'] },
        { titulo: 'El estado de cada sustancia', texto: 'Junto a cada fórmula va su estado entre paréntesis: (s) sólido, (l) líquido, (g) gas y (ac) acuoso, es decir, disuelto en agua.',
          ecuacion: ['H₂O(l)', SEP, 'NaCl(ac)'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la lupa muestra las partículas antes y después de cuatro fenómenos, y debajo va su ecuación. Busca qué partículas aparecen que antes no estaban.' },
      ],
    },
    ejemplos: EJEMPLOS_IND,
    juega: {
      consigna: 'La lupa muestra cuatro fenómenos del laboratorio, con lo de antes a la izquierda y lo de después a la derecha, en cámara lenta.',
      mision: { texto: 'Encuentra el caso con burbujas en que no se forma ninguna sustancia nueva.', logrado: v => v.k === 'hervir',
        bien: 'Listo: el agua que hierve sigue siendo H₂O. Las burbujas solas no prueban una reacción.' },
      voz: 'Compara las partículas de antes y de después; el aspecto puede engañar.',
      leyenda: [
        { s: '→', t: 'reactivos a la izquierda, productos a la derecha' },
        { s: '(s)', t: 'sólido' }, { s: '(l)', t: 'líquido' }, { s: '(g)', t: 'gas' },
        { s: '(ac)', t: 'disuelto en agua' },
      ],
      controles: [{ id: 'k', etiqueta: 'Fenómeno', opciones: Object.keys(FEN).map(k => ({ valor: k, texto: FEN[k].t })) }, Object.assign({}, T_ANIMA, { etiqueta: 'tiempo, en cámara lenta' })],
      dibujo: v => lupaFen(v.k, v.t),
      lectura: v => lecturaFen(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-particulas',
      pregunta: 'Se mezclan dos soluciones: FeCl₃(ac) + 3 NaOH(ac) → Fe(OH)₃(s) + 3 NaCl(ac). ¿Qué verás en el vaso?',
      datos: [D_EST],
      voz: 'Lee el estado de cada producto.',
      opciones: [
        { id: 'c', texto: 'Aparece un sólido: Fe(OH)₃', correcta: true },
        { id: 'sal', texto: 'Aparece un sólido: NaCl, la sal', error: 'QM-PRECIP', siFuera: 'Es cierto que aparece un sólido, pero no es la sal: el NaCl lleva (ac), así que queda disuelto en el agua.' },
        { id: 'gas', texto: 'Salen burbujas de un gas', error: 'QM-INDICIO-GAS', siFuera: 'Sí hay un indicio, pero no son burbujas: saldría un gas si algún producto llevara (g), y aquí ninguno lo lleva.' },
        { id: 'nada', texto: 'Nada: todo sigue disuelto', error: 'MA8', siFuera: 'Es cierto que casi todo sigue disuelto, pero el Fe(OH)₃ lleva (s): se forma como sólido y cae al fondo.' },
      ],
      dibujo: lupaEl([PRED1.a, PRED1.b], { flechas: false, alt: 'Lupa (un modelo) de dos vasos con agua: en uno, un Fe³⁺ y tres Cl⁻; en el otro, tres Na⁺ y tres OH⁻.' }),
      revelar: lupaEl([{ titulo: 'Mezcla', forma: 'vaso', nivel: 0.85, particulas: [...enFila('FeOH3', 1, 0.88), { e: 'Na', n: 3 }, { e: 'Cl', n: 3 }],
        cuenta: [{ e: 'FeOH3', texto: 'Fe(OH)₃(s): precipitado' }, { e: 'Na', texto: 'Na⁺' }, { e: 'Cl', texto: 'Cl⁻' }] }],
        { cuentaPorFila: 1, alt: 'Lupa de la mezcla: el Fe(OH)₃ quedó en el fondo, sólido; los tres Na⁺ y los tres Cl⁻ siguen sueltos en el agua.' }),
      coincide: 'Coincide: el Fe(OH)₃ lleva (s) y cae al fondo; el NaCl queda disuelto.',
      noCoincide: 'El Fe(OH)₃ lleva (s), así que aparece un sólido rojizo; el NaCl lleva (ac) y queda disuelto.',
    },
    mira: {
      datos: lupaEl([{ titulo: 'Mezcla', forma: 'vaso', nivel: 0.85, particulas: [
        { e: 'Fe3', n: 1, desde: 1, hasta: 1, x: 0.5, y: 0.44 }, ...enFila('OH', 3, 0.62, 0.3, 0.7).map(p => Object.assign(p, { desde: 1, hasta: 1 })),
        ...enFila('FeOH3', 1, 0.88).map(p => Object.assign(p, { desde: 2 })),
        ...enFila('Na', 3, 0.16, 0.2, 0.8).map(p => Object.assign(p, { desde: 1 })), ...[0.12, 0.34, 0.88].map(x => ({ e: 'Cl', n: 1, x, y: 0.34, desde: 1 })),
      ], cuenta: [{ e: 'Na', texto: 'Na⁺', desde: 1 }, { e: 'Cl', texto: 'Cl⁻', desde: 1 }, { e: 'Fe3', texto: 'Fe³⁺', desde: 1, hasta: 1 }, { e: 'OH', texto: 'OH⁻', desde: 1, hasta: 1 }, { e: 'FeOH3', texto: 'Fe(OH)₃(s): precipitado', desde: 2 }] }], { cuentaPorFila: 2, alt: 'Lupa de la mezcla de FeCl₃ y NaOH: el Fe³⁺ se junta con tres OH⁻ y cae al fondo como Fe(OH)₃; Na⁺ y Cl⁻ siguen sueltos.' }).datos,
      voz: 'Sigamos al hierro y a los OH⁻.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En la mezcla hay Fe³⁺, Cl⁻, Na⁺ y OH⁻ sueltos en el agua.', ecuacion: ['FeCl₃(ac) + 3 NaOH(ac)'] },
        { estado: { corte: 2 }, texto: 'El Fe³⁺ se junta con tres OH⁻ y forma un sólido nuevo, que cae al fondo.', ecuacion: ['→ Fe(OH)₃(s)'] },
        { estado: { corte: 2 }, texto: 'El Na⁺ y el Cl⁻ siguen sueltos en el agua, así que el NaCl queda disuelto.', ecuacion: ['+ 3 NaCl(ac)'] },
        { estado: { corte: 2 }, texto: 'El (s) de la ecuación anunciaba lo que se ve: un sólido que aparece, llamado precipitado.' },
      ],
    },
    regla: {
      texto: 'Una reacción química forma sustancias nuevas. Sus indicios son un gas que sale, un sólido que aparece (un precipitado) y un cambio de color o de temperatura. La ecuación anuncia el gas con (g) y el sólido con (s).',
      ecuacion: ['reactivos → productos', SEP, '(g): sale un gas', SEP, '(s): aparece un sólido'],
      condicion: 'el indicio viene de una sustancia nueva, y no de un cambio de estado o de una disolución, como el agua que hierve o la soda cáustica (NaOH) que calienta al disolverse.',
      voz: 'Primero lee los estados; después busca la sustancia nueva.',
    },
    resuelve: {
      generar(s) {
        const [ec, visto, tipo, nombre] = RES1[idx(s, RES1.length)], ts = terminos(ec), prods = ts.filter(x => x.lado === 'p');
        const est = tipo === 'gas' ? 'g' : 's';
        return { enunciado: `En el laboratorio se prueba ${nombre}: ${ecTxt(ec)}. ¿Qué indicio se verá y de qué sustancia es?`, datos: [D_EST, D_IND],
          pasos: [
            { tipo: 'pide', texto: 'Se pide qué indicio se verá al mezclar y qué sustancia lo produce.' },
            { tipo: 'datos', texto: `Los productos, con su estado entre paréntesis, son ${listaY(prods.map(x => `${bonita(sinEstado(x.f))} (${nombreEstado[x.estado]})`))}.` },
            { tipo: 'regla', texto: 'Un producto con (g) sale como gas, y uno con (s) que se forma a partir de soluciones aparece como sólido; lo que lleva (ac) queda disuelto y no se ve.' },
            { tipo: 'aplica', texto: `El ${bonita(sinEstado(visto))} lleva (${est}), así que ${tipo === 'gas' ? 'salen burbujas de ese gas' : 'aparece ese sólido en el vaso'}.` },
            { tipo: 'sentido', texto: `Es una sustancia que antes no estaba: el ${bonita(sinEstado(visto))} es nuevo, así que el indicio sí viene de una reacción.` },
          ],
          respuesta: [ver(tipo, visto)] };
      },
    },
    ahoraTu: {
      voz: 'Lee el estado de cada sustancia antes de decidir.',
      generar(s) {
        const r = azar(s + 11), tipo = ['indicio', 'prueba', 'partes', 'vf'][idx(s, 4)], k = Math.floor(s / 4);
        if (tipo === 'indicio') return casoIndicio(AT1[idx(k, AT1.length)]);
        if (tipo === 'prueba') return casoPrueba(PRUEBA1[idx(k, PRUEBA1.length)]);
        if (tipo === 'partes') return casoPartes(PARTES1[idx(k, PARTES1.length)], r);
        return casoVF(VF1[idx(k, VF1.length)], r);
      },
    },
  };


  // ---------- Idea 2 (rehecha, 26 nov): clases de reacciones ----------
  // Propuesta §3 idea 2. Objeto de la primera pantalla: el horno de cal (quim-reaccion).
  // Cambia: la clase · Permanece: los mismos átomos A, B, X, Y (cualesquiera) · Progresa: juntar, separar, reemplazar,
  // intercambiar · Se reserva: el calor (Predice del horno de cal) · Debe verse: qué se junta, qué se separa y quién cambia
  // de pareja. Los átomos del patrón van en tinta (no son elementos ni magnitudes): se distinguen por relleno y tamaño.
  // Errores: QM-CLASIF (confundir las clases por su forma), QM-CALOR-LADO (leer el calor escrito con los reactivos como
  // calor que sale), QM-CLASIF-REVES (leer la ecuación de derecha a izquierda).
  const ATP = { A: { estilo: 'lleno', r: 7 }, B: { estilo: 'hueco', r: 7 }, X: { estilo: 'punto', r: 7 }, Y: { estilo: 'lleno', r: 4.5 } };
  const ESPP = { A: [['A', 0, 0]], B: [['B', 0, 0]], X: [['X', 0, 0]], Y: [['Y', 0, 0]], AB: [['A', -6, 0], ['B', 7, 0]], XB: [['X', -6, 0], ['B', 7, 0]],
    AY: [['A', -6, 0], ['Y', 5, 0]], XY: [['X', -6, 0], ['Y', 5, 0]] };
  const TIPOS = {
    sintesis: { t: 'Adición', ec: 'A + B → AB', a: [['A', 3], ['B', 3]], d: [['AB', 3]], lee: 'dos sustancias se juntan en una sola' },
    descomp: { t: 'Descomposición', ec: 'AB → A + B', a: [['AB', 3]], d: [['A', 3], ['B', 3]], lee: 'una sola sustancia se separa en dos' },
    simple: { t: 'Desplazamiento simple', ec: 'X + AB → XB + A', a: [['X', 3], ['AB', 3]], d: [['XB', 3], ['A', 3]], lee: 'X toma el lugar de A' },
    doble: { t: 'Doble desplazamiento', ec: 'AB + XY → AY + XB', a: [['AB', 2], ['XY', 2]], d: [['AY', 2], ['XB', 2]], lee: 'las parejas se intercambian' },
  };
  const cajaP = (titulo, l) => ({ titulo, forma: 'caja', particulas: l.map(([e, n]) => ({ e, n })), cuenta: l.map(([e]) => ({ e, texto: e })) });
  const lupaP = (k, t) => ({ pieza: 'quim-particulas', datos: { atomos: ATP, especies: ESPP, alto: 130, separacion: 26, flechas: true, cuentaPorFila: 2,
    cajas: [mover(cajaP('Antes', TIPOS[k].a), t, 0), mover(cajaP('Después', TIPOS[k].d), t, 1)],
    alt: `Lupa del patrón de ${TIPOS[k].t.toLowerCase()} con átomos cualesquiera A, B, X e Y: ${TIPOS[k].ec}.` }, estado: {} });
  const D_FORMA = ['Adición: varias sustancias forman una. Descomposición: una forma varias', 'Desplazamiento simple: un elemento toma el lugar de otro en un compuesto',
    'Doble desplazamiento: dos compuestos intercambian sus parejas'];
  const D_CALOR = 'Exotérmica: libera calor al entorno. Endotérmica: absorbe calor del entorno';
  const D_CALOR_LADO = 'El calor que se absorbe se escribe con los reactivos; el que se libera, con los productos';
  const NOMBRE_T = { 'adición': 'adición', 'descomposición': 'descomposición', 'desplazamiento simple': 'desplazamiento simple', 'doble desplazamiento': 'doble desplazamiento' };
  const CLASES = ['adición', 'descomposición', 'desplazamiento simple', 'doble desplazamiento'];
  // La clase por su forma la da el motor (MB.clasificar), con la ecuación sin estados ni calor.
  const formaDe = ec => MB.clasificar(sinEstado(ec).replace(/\s*\+\s*calor/g, '')).tipo;
  const calorDe = ec => (/calor\s*->/.test(ec) ? 'endotérmica' : /->.*calor/.test(ec) ? 'exotérmica' : null);
  const POR_QUE = { 'adición': 'varias sustancias forman una', 'descomposición': 'una sustancia forma varias',
    'desplazamiento simple': 'un elemento toma el lugar de otro', 'doble desplazamiento': 'dos compuestos intercambian sus parejas' };
  // Lo que diría cada clase equivocada (el siFuera empieza por lo que el alumno hizo bien).
  const SI_CLASE = { 'adición': 'Sería adición si varias sustancias formaran una sola.', 'descomposición': 'Sería descomposición si una sola sustancia formara varias.',
    'desplazamiento simple': 'Sería desplazamiento simple si un elemento suelto tomara el lugar de otro.', 'doble desplazamiento': 'Sería doble desplazamiento si dos compuestos intercambiaran parejas.' };

  // Ejemplos de la idea 2. Revisado aparte (verif/idea2.js): cada ecuación cuadra; la clase por su forma la da el motor y
  // se compara con la del resuelto; el signo del calor es el de las tablas (OpenStax, apéndice G: CaCO₃ +178 kJ, N₂ + O₂
  // +181 kJ, HgO +91 kJ por mol, KClO₃ −39 kJ por mol, H₂O₂ −98 kJ por mol). Letras correctas de nivel 3: B, E, C, A, D.
  const EJEMPLOS_CLA = [
    { nivel: 1, titulo: 'El carbón que arde', enunciado: '¿Qué clase de reacción es C(s) + O₂(g) → CO₂(g), por su forma?', datos: D_FORMA,
      solucion: [{ texto: 'Entran dos sustancias, carbono y oxígeno, y sale una sola, CO₂: es una adición.' }], respuesta: ['Adición'] },
    { nivel: 1, titulo: 'El óxido de mercurio', enunciado: 'Al calentar óxido de mercurio: 2 HgO(s) → 2 Hg(l) + O₂(g). ¿Qué clase es, por su forma?', datos: D_FORMA,
      solucion: [{ texto: 'Entra una sola sustancia y salen dos, mercurio y oxígeno: es una descomposición.' }], respuesta: ['Descomposición'] },
    { nivel: 1, titulo: 'Hierro en sulfato de cobre', enunciado: '¿Qué clase es Fe(s) + CuSO₄(ac) → FeSO₄(ac) + Cu(s)?', datos: D_FORMA,
      solucion: [{ texto: 'El hierro, que entra suelto, toma el lugar del cobre en el sulfato y deja el cobre suelto: es un desplazamiento simple.' }], respuesta: ['Desplazamiento simple'] },
    { nivel: 1, titulo: 'Ácido con hidróxido', enunciado: '¿Qué clase es HCl(ac) + NaOH(ac) → NaCl(ac) + H₂O(l)?', datos: D_FORMA,
      solucion: [{ texto: 'Dos compuestos cambian de pareja, porque el Na pasa con el Cl y el H con el OH: es un doble desplazamiento.' }], respuesta: ['Doble desplazamiento'] },
    { nivel: 1, titulo: 'El calor escrito', enunciado: 'En 2 H₂(g) + O₂(g) → 2 H₂O(l) + calor, ¿la reacción libera o absorbe calor?', datos: [D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'El calor está escrito con los productos, así que sale de la reacción: es exotérmica.' }], respuesta: ['Libera calor: exotérmica'] },
    { nivel: 2, titulo: 'Rayos y aire', enunciado: 'En un rayo, el nitrógeno y el oxígeno del aire reaccionan: N₂(g) + O₂(g) + calor → 2 NO(g). ¿Qué clase es por su forma y por el calor?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'Dos sustancias forman una sola, así que es una adición.' }, { texto: 'El calor va con los reactivos, así que se absorbe: es endotérmica, aunque sea una adición.' }],
      respuesta: ['Adición y endotérmica'] },
    { nivel: 2, titulo: 'Clorato que se descompone', enunciado: 'Al calentar clorato de potasio: 2 KClO₃(s) → 2 KCl(s) + 3 O₂(g) + calor. ¿Qué clase es por su forma y por el calor?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'Una sustancia forma dos, así que es una descomposición.' }, { texto: 'El calor va con los productos, así que se libera: es exotérmica, aunque haga falta calentar para que empiece.' }],
      respuesta: ['Descomposición y exotérmica'] },
    { nivel: 2, titulo: 'La termita', enunciado: 'En la soldadura de rieles: 2 Al(s) + Fe₂O₃(s) → Al₂O₃(s) + 2 Fe(l) + calor. ¿Qué clase es?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'El aluminio, que entra suelto, toma el lugar del hierro en el óxido: es un desplazamiento simple.' }, { texto: 'El calor sale con los productos, así que es exotérmica, y libera tanto calor que el hierro sale líquido.' }],
      respuesta: ['Desplazamiento simple y exotérmica'] },
    { nivel: 2, titulo: 'El carbón y el vapor', enunciado: 'C(s) + H₂O(g) + calor → CO(g) + H₂(g). ¿Qué clase es por su forma y por el calor?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'El carbono, suelto, se lleva el oxígeno del agua y deja libre al hidrógeno: es un desplazamiento simple.' }, { texto: 'El calor va con los reactivos, así que es endotérmica.' }],
      respuesta: ['Desplazamiento simple y endotérmica'] },
    { nivel: 2, titulo: 'El bicarbonato en el horno', enunciado: 'Al hornear un queque: 2 NaHCO₃(s) + calor → Na₂CO₃(s) + H₂O(g) + CO₂(g). ¿Qué clase es?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      solucion: [{ texto: 'Una sustancia forma tres, así que es una descomposición.' }, { texto: 'El calor va con los reactivos, así que es endotérmica; el CO₂ que sale es el que hincha la masa.' }],
      respuesta: ['Descomposición y endotérmica'] },
    { nivel: 3, titulo: 'La que es endotérmica', enunciado: '¿Cuál de estas reacciones es una adición endotérmica?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      alternativas: ['S(s) + O₂(g) → SO₂(g) + calor', 'N₂(g) + O₂(g) + calor → 2 NO(g)', '2 HgO(s) + calor → 2 Hg(l) + O₂(g)', '2 Mg(s) + O₂(g) → 2 MgO(s) + calor', 'CaO(s) + H₂O(l) → Ca(OH)₂(s) + calor'],
      solucion: [{ texto: 'Se busca una adición con el calor escrito en los reactivos, y solo la cumple N₂ + O₂ + calor → 2 NO.' },
        { texto: ['La ', letra('A'), ', la ', letra('D'), ' y la ', letra('E'), ' son adiciones exotérmicas, y la ', letra('C'), ' es endotérmica, pero es una descomposición.'] }],
      respuesta: [letra('B'), ', N₂ + O₂ + calor → 2 NO'] },
    { nivel: 3, titulo: 'Dos etiquetas a la vez', enunciado: 'Sobre CaCO₃(s) + 2 HCl(ac) → CaCl₂(ac) + H₂O(l) + CO₂(g) + calor, ¿qué es correcto?', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      alternativas: ['Es una adición', 'Es una descomposición', 'Es endotérmica', 'Es desplazamiento simple', 'Es exotérmica y doble desplazamiento'],
      solucion: [{ texto: 'El Ca pasa con el Cl y el H con el CO₃; el H₂CO₃ que se forma se parte en agua y CO₂: es un doble desplazamiento.' }, { texto: 'El calor va con los productos, así que es exotérmica.' },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' leen mal la forma, porque entran dos y salen tres; la ', letra('C'), ' lee mal el calor, y la ', letra('D'), ' busca un elemento suelto que no hay.'] }],
      respuesta: [letra('E'), ', exotérmica y doble desplazamiento'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Sobre 2 H₂O₂(ac) → 2 H₂O(l) + O₂(g) + calor: I. Es descomposición. II. Es endotérmica. III. Hace burbujas.', datos: [...D_FORMA, D_CALOR, D_CALOR_LADO, D_EST],
      alternativas: ['VVV', 'FVV', 'VFV', 'VFF', 'FFV'],
      solucion: [{ texto: 'I es verdadera, porque una sustancia forma dos. II es falsa, porque el calor sale con los productos.' }, { texto: 'III es verdadera, porque el O₂ lleva (g) y sale como gas.' },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' la creen endotérmica; la ', letra('D'), ' olvida el gas, y la ', letra('E'), ' no ve la descomposición.'] }],
      respuesta: [letra('C'), ', VFV'] },
    { nivel: 3, titulo: 'Relaciona', enunciado: 'Relaciona: I. Zn + 2 HCl → ZnCl₂ + H₂. II. 2 KClO₃ → 2 KCl + 3 O₂. III. AgNO₃ + KCl → AgCl + KNO₃. Con a) descomposición, b) desplazamiento simple, c) doble desplazamiento.', datos: D_FORMA,
      alternativas: ['I-b, II-a, III-c', 'I-a, II-b, III-c', 'I-c, II-a, III-b', 'I-b, II-c, III-a', 'I-a, II-c, III-b'],
      solucion: [{ texto: 'En I, el zinc suelto toma el lugar del hidrógeno (b); en II, una sustancia forma dos (a), y en III, dos compuestos cambian de pareja (c).' },
        { texto: ['La ', letra('B'), ' cruza I con II; la ', letra('C'), ' cruza I con III; la ', letra('D'), ' cruza II con III, y la ', letra('E'), ' las cambia todas.'] }],
      respuesta: [letra('A'), ', I-b, II-a, III-c'] },
    { nivel: 3, titulo: 'El calor al revés', enunciado: 'La fotosíntesis es 6 CO₂ + 6 H₂O + energía → C₆H₁₂O₆ + 6 O₂. Su reacción inversa, la respiración, ¿cómo es?', datos: [D_CALOR, D_CALOR_LADO, 'La reacción inversa intercambia los reactivos con los productos'],
      alternativas: ['Endotérmica: absorbe la misma energía', 'Ni libera ni absorbe', 'Endotérmica: es una descomposición', 'Exotérmica: libera la energía', 'Exotérmica: es una adición'],
      solucion: [{ texto: 'Al invertir, la energía pasa al lado de los productos: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energía. La respiración libera energía: es exotérmica.' },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' no invierten el calor; la ', letra('B'), ' olvida la energía, y la ', letra('E'), ' acierta el calor, pero no es una adición: dos sustancias forman dos.'] }],
      respuesta: [letra('D'), ', exotérmica'] },
  ];
  // Así se resuelve y Ahora tú: listas distintas, sin el horno de cal (Predice) ni los casos de los ejemplos. Calor según
  // las tablas (signo de ΔH).
  const RES2 = ['2 Na(s) + Cl2(g) -> 2 NaCl(s) + calor', '2 H2O(l) + calor -> 2 H2(g) + O2(g)', 'Zn(s) + CuSO4(ac) -> ZnSO4(ac) + Cu(s) + calor',
    'NH4Cl(s) + calor -> NH3(g) + HCl(g)', 'Pb(NO3)2(ac) + 2 KI(ac) -> PbI2(s) + 2 KNO3(ac) + calor'];
  const AT2 = ['N2(g) + 3 H2(g) -> 2 NH3(g) + calor', '2 Mg(s) + O2(g) -> 2 MgO(s) + calor', 'CaO(s) + CO2(g) -> CaCO3(s) + calor',
    '2 Ag2O(s) + calor -> 4 Ag(s) + O2(g)', 'Cu(OH)2(s) + calor -> CuO(s) + H2O(g)', 'Mg(s) + 2 HCl(ac) -> MgCl2(ac) + H2(g) + calor',
    'Cl2(g) + 2 KBr(ac) -> 2 KCl(ac) + Br2(l) + calor', 'BaCl2(ac) + K2SO4(ac) -> BaSO4(s) + 2 KCl(ac) + calor', 'KOH(ac) + HNO3(ac) -> KNO3(ac) + H2O(l) + calor',
    'H2(g) + I2(s) + calor -> 2 HI(g)'];
  const ecCal = ecTxt;   // «calor» es un término más: ecTxt lo deja tal cual
  // «Entra una sustancia», «Entran 2 sustancias» (el verbo concuerda con la cuenta).
  const cuantas = (n, verbo) => (n === 1 ? `${verbo} una sustancia` : `${verbo}n ${n} sustancias`);
  function casoForma(ec, r) {
    const k = formaDe(ec), otras = r.baraja(CLASES.filter(x => x !== k)).slice(0, 3);
    return { pregunta: `¿Qué clase de reacción es ${ecTxt(ec.replace(/\s*\+\s*calor/g, ''))}, por su forma?`, datos: D_FORMA,
      opciones: [{ id: 'c', texto: k[0].toUpperCase() + k.slice(1), correcta: true }, ...otras.map(x => ({ id: x.split(' ')[0], texto: x[0].toUpperCase() + x.slice(1), error: 'QM-CLASIF',
        siFuera: `${SI_CLASE[x]} Aquí, en cambio, ${POR_QUE[k]}.` }))],
      solucion: { texto: `Es una reacción de ${k}, porque ${POR_QUE[k]}.`, ecuacion: [ecTxt(ec.replace(/\s*\+\s*calor/g, ''))] } };
  }
  function casoCalor(ec) {
    const c = calorDe(ec), otra = c === 'exotérmica' ? 'endotérmica' : 'exotérmica', lado = c === 'exotérmica' ? 'los productos' : 'los reactivos', oLado = c === 'exotérmica' ? 'los reactivos' : 'los productos';
    return { pregunta: `En ${ecCal(ec)}, ¿la reacción libera o absorbe calor?`, datos: [D_CALOR, D_CALOR_LADO],
      opciones: [
        { id: 'c', texto: c === 'exotérmica' ? 'Libera calor: exotérmica' : 'Absorbe calor: endotérmica', correcta: true },
        { id: 'lado', texto: c === 'exotérmica' ? 'Absorbe calor: endotérmica' : 'Libera calor: exotérmica', error: 'QM-CALOR-LADO', siFuera: `Sería ${otra} si el calor estuviera escrito con ${oLado}; aquí está con ${lado}, así que es ${c}.` },
        { id: 'nada', texto: 'Ni libera ni absorbe: el calor no cambia', error: 'QM-CALOR-LADO', siFuera: 'Sería así si la ecuación no escribiera calor, pero lo escribe: si está con los reactivos entra, y si está con los productos sale.' },
        { id: 'forma', texto: `Depende de si es adición o descomposición`, error: 'QM-CLASIF', siFuera: `La forma es otra etiqueta y no dice nada del calor: aquí el calor está con ${lado}, así que es ${c}.` },
      ],
      solucion: { texto: `El calor está con ${lado}: la reacción es ${c}.`, ecuacion: [ecCal(ec)] } };
  }
  const cap = t => t[0].toUpperCase() + t.slice(1);
  function casoAmbas(ec, r) {
    const k = formaDe(ec), c = calorDe(ec), oc = c === 'exotérmica' ? 'endotérmica' : 'exotérmica', ok = r.de(CLASES.filter(x => x !== k));
    return { pregunta: `¿Cómo se clasifica ${ecCal(ec)}, por su forma y por el calor?`, datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      opciones: [
        { id: 'c', texto: `${cap(k)} y ${c}`, correcta: true },
        { id: 'calor', texto: `${cap(k)} y ${oc}`, error: 'QM-CALOR-LADO', siFuera: `La forma está bien, ${k}, pero el calor está escrito con ${c === 'exotérmica' ? 'los productos' : 'los reactivos'}, así que la reacción es ${c}.` },
        { id: 'forma', texto: `${cap(ok)} y ${c}`, error: 'QM-CLASIF', siFuera: `El calor está bien, ${c}. ${SI_CLASE[ok]} Aquí, en cambio, ${POR_QUE[k]}.` },
        { id: 'las2', texto: `${cap(ok)} y ${oc}`, error: 'QM-CLASIF', siFuera: `Cambian las dos etiquetas: por su forma es de ${k}, porque ${POR_QUE[k]}, y por el calor es ${c}.` },
      ],
      solucion: { texto: `Por su forma es de ${k}, porque ${POR_QUE[k]}; por el calor es ${c}.`, ecuacion: [ecCal(ec)] } };
  }
  // Examen: ¿cuál de cuatro es «<clase> y <calor>»? Una sola cumple las dos.
  function casoCual(s, r) {
    let base, k, c, otras;
    for (let i = 0; i < 50; i++) {
      base = AT2[idx(s + i, AT2.length)]; k = formaDe(base); c = calorDe(base);
      otras = r.baraja(AT2.filter(e => e !== base && !(formaDe(e) === k && calorDe(e) === c))).slice(0, 3);
      if (otras.some(e => formaDe(e) === k) || otras.some(e => calorDe(e) === c)) break;
    }
    const porQue = e => (formaDe(e) === k ? `Es de ${k}, como se pide, pero es ${calorDe(e)}.` : calorDe(e) === c ? `Es ${c}, como se pide, pero es de ${formaDe(e)}.` : `No cumple ninguna de las dos: es de ${formaDe(e)} y ${calorDe(e)}.`);
    return { pregunta: `¿Cuál de estas reacciones es de ${k} y ${c}?`, datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
      opciones: [{ id: 'c', texto: ecCal(base), correcta: true }, ...otras.map((e, i) => ({ id: `o${i}`, texto: ecCal(e), error: formaDe(e) === k ? 'QM-CALOR-LADO' : 'QM-CLASIF', siFuera: porQue(e) }))],
      solucion: { texto: `Solo esta es de ${k}, porque ${POR_QUE[k]}, y además es ${c}.`, ecuacion: [ecCal(base)] } };
  }

  const clasif = {
    id: 'clasificar',
    titulo: 'Clases de reacciones',
    pregunta: '¿Cómo se clasifica una reacción por su forma y por su calor?',
    temas: ['Clasificación de las reacciones'],
    pieza: 'quim-particulas',
    aprendizaje: 'Por su forma: adición, descomposición, desplazamiento simple o doble; por el calor: exotérmica o endotérmica. Una reacción lleva varias etiquetas a la vez.',
    actividad: 'Mirar con la lupa los cuatro patrones de reacción, con átomos cualesquiera.',
    lee: {
      tarjetas: [
        { titulo: 'El horno de cal', texto: 'En un horno de cal, las piedras de caliza, CaCO₃, se calientan con fuego y salen convertidas en cal viva, CaO, que se usa en las obras. Al mismo tiempo sale CO₂ por arriba.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'horno', nombre: 'Un horno de cal' }, estado: {} } },
        { titulo: 'Mirar la forma', texto: 'Las reacciones se agrupan por su forma: cuántas sustancias entran, cuántas salen y quién cambia de pareja. En el juego, las letras A, B, X e Y son átomos cualesquiera.' },
        { titulo: 'Calor que sale o entra', texto: 'Algunas reacciones sueltan calor al entorno, como una fogata. Otras lo toman del entorno mientras ocurren. En la ecuación, el calor se escribe como un término más, con la palabra «calor».' },
        { titulo: 'Qué mirar', texto: 'Elige cada clase en el juego y sigue a una partícula de antes a después: ¿se junta con otra, se separa o cambia de pareja?' },
      ],
    },
    ejemplos: EJEMPLOS_CLA,
    juega: {
      consigna: 'Cuatro patrones con átomos cualesquiera, A, B, X e Y: lo de antes va a la izquierda y lo de después, a la derecha.',
      mision: { texto: 'Halla la clase en que dos compuestos intercambian sus parejas.', logrado: v => v.k === 'doble',
        bien: 'Listo: AB + XY → AY + XB. Cada compuesto se queda con la pareja del otro.' },
      voz: 'Sigue a una sola partícula de antes a después.',
      leyenda: [{ s: 'A, B, X, Y', t: 'átomos cualesquiera, uno distinto por letra' }, { s: 'AB', t: 'un compuesto de A con B' }, { s: '→', t: 'antes a la izquierda, después a la derecha' }],
      controles: [{ id: 'k', etiqueta: 'Clase', opciones: Object.keys(TIPOS).map(k => ({ valor: k, texto: TIPOS[k].t })) }, Object.assign({}, T_ANIMA, { etiqueta: 'tiempo, en cámara lenta' })],
      dibujo: v => lupaP(v.k, v.t),
      lectura: v => [`${TIPOS[v.k].ec}: ${TIPOS[v.k].lee}`],
      minimo: 3,
    },
    predice: {
      pieza: 'quim-reaccion',
      pregunta: 'En el horno de cal: CaCO₃(s) + calor → CaO(s) + CO₂(g). ¿Cómo se clasifica, por su forma y por el calor?',
      datos: [D_CALOR],
      voz: 'Mira dónde está escrito el calor.',
      opciones: [
        { id: 'c', texto: 'Descomposición y endotérmica', correcta: true },
        { id: 'exo', texto: 'Descomposición y exotérmica', error: 'QM-CALOR-LADO', siFuera: 'La forma está bien, porque una sustancia da dos, pero el calor está escrito con los reactivos: entra a la reacción, así que se absorbe.' },
        { id: 'reves', texto: 'Adición y endotérmica', error: 'QM-CLASIF-REVES', siFuera: 'El calor está bien leído, pero la flecha va del CaCO₃ a dos sustancias; sería adición si dos sustancias formaran una.' },
        { id: 'simple', texto: 'Desplazamiento simple y exotérmica', error: 'QM-CLASIF', siFuera: 'Sería desplazamiento simple si un elemento suelto tomara el lugar de otro, pero aquí no entra ninguno; además, el calor está con los reactivos.' },
      ],
      dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'horno', nombre: 'CaCO₃ + calor → CaO + CO₂' }, estado: {} },
      revelar: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'horno', nombre: 'Descomposición y endotérmica' }, estado: {} },
      coincide: 'Coincide: una sustancia forma dos, y el calor entra con los reactivos.',
      noCoincide: 'Una sustancia forma dos, así que es una descomposición; el calor va con los reactivos, así que se absorbe y es endotérmica.',
    },
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [
        { titulo: 'Por su forma', nodos: [{ texto: 'CaCO₃ → CaO + CO₂: una forma dos', desde: 1 }, { texto: 'descomposición', desde: 1 }, { texto: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor', desde: 3 }, { texto: 'combustión: no es ninguna de las cuatro formas', desde: 3 }], flechas: [{ de: 0, a: 1 }, { de: 2, a: 3 }] },
        { titulo: 'Por el calor', nodos: [{ texto: 'calor con los reactivos: entra', desde: 2 }, { texto: 'endotérmica', desde: 2 }, { texto: 'calor con los productos: sale', desde: 3 }, { texto: 'exotérmica', desde: 3 }], flechas: [{ de: 0, a: 1 }, { de: 2, a: 3 }] },
      ], alt: 'Dos columnas: por su forma, CaCO₃ → CaO + CO₂ es descomposición; por el calor, con el calor en los reactivos, endotérmica. Abajo, la quema del metano: exotérmica, y no es adición ni descomposición.' },
      voz: 'Una etiqueta por la forma y otra por el calor.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Entra una sustancia, CaCO₃, y salen dos: es una descomposición.', ecuacion: ['CaCO₃ → CaO + CO₂'] },
        { estado: { corte: 2 }, texto: 'El calor está escrito con los reactivos, así que entra a la reacción: es endotérmica.', ecuacion: ['CaCO₃ + calor → CaO + CO₂'] },
        { estado: { corte: 3 }, texto: 'En la hornilla que quema metano, el calor sale con los productos: la reacción es exotérmica.', ecuacion: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor'] },
        { estado: { corte: 3 }, texto: 'Las dos etiquetas se suman, porque la forma no decide si el calor entra o sale.' },
      ],
    },
    regla: {
      texto: 'Por su forma, una reacción es de adición si varias sustancias forman una, de descomposición si una forma varias, de desplazamiento simple si un elemento toma el lugar de otro y de doble desplazamiento si dos compuestos intercambian parejas.',
      ecuacion: ['A + B → AB', SEP, 'AB → A + B', SEP, 'X + AB → XB + A', SEP, 'AB + XY → AY + XB'],
      condicion: 'se lee la ecuación de izquierda a derecha y el calor aparte: va con los productos si se libera (exotérmica) y con los reactivos si se absorbe (endotérmica).',
      voz: 'Primero la forma; después, dónde está el calor.',
    },
    resuelve: {
      generar(s) {
        const ec = RES2[idx(s, RES2.length)], k = formaDe(ec), c = calorDe(ec);
        return { enunciado: `¿Cómo se clasifica ${ecCal(ec)}, por su forma y por el calor?`, datos: [...D_FORMA, D_CALOR, D_CALOR_LADO],
          pasos: [
            { tipo: 'pide', texto: 'Se piden dos etiquetas: la clase de la reacción por su forma y la clase por el calor.' },
            { tipo: 'datos', texto: `${cuantas(terminos(ec.replace(/\s*\+\s*calor/g, '')).filter(x => x.lado === 'r').length, 'Entra')} y ${cuantas(terminos(ec.replace(/\s*\+\s*calor/g, '')).filter(x => x.lado === 'p').length, 'sale')}, y el calor está escrito con ${c === 'exotérmica' ? 'los productos' : 'los reactivos'}.` },
            { tipo: 'regla', texto: 'La forma dice si las sustancias se juntan, se separan o cambian de pareja. El calor escrito con los productos sale (exotérmica), y el escrito con los reactivos entra (endotérmica).' },
            { tipo: 'aplica', texto: `Por su forma es una reacción de ${k}, porque ${POR_QUE[k]}; por el calor, es ${c}.` },
            { tipo: 'sentido', texto: 'Las dos etiquetas no se contradicen, porque una mira cuántas sustancias entran y salen, y la otra, hacia dónde va el calor.' },
          ],
          respuesta: [`${cap(k)} y ${c}`] };
      },
    },
    ahoraTu: {
      voz: 'Mira qué te piden: la forma, el calor o las dos cosas.',
      generar(s) {
        const r = azar(s + 23), tipo = ['forma', 'calor', 'ambas', 'cual'][idx(s, 4)], ec = AT2[idx(Math.floor(s / 4) + s, AT2.length)];
        if (tipo === 'forma') return casoForma(ec, r);
        if (tipo === 'calor') return casoCalor(ec);
        if (tipo === 'ambas') return casoAmbas(ec, r);
        return casoCual(s, r);
      },
    },
  };


  // ---------- Idea 3 (rehecha, 26 nov): balance por tanteo ----------
  // Propuesta §3 idea 3. Objeto de la primera pantalla: la hornilla con su llama de gas (quim-reaccion).
  // Cambia: los coeficientes de O₂, CO₂ y H₂O · Permanece: las fórmulas (subíndices) y una molécula de metano · Progresa:
  // cada elemento se iguala · Se reserva: el subíndice tocado (Predice del H₂O₂) · Debe verse: la cuenta de C, H y O de cada
  // lado. Los coeficientes en violeta (c-f); los átomos con la paleta de elementos; la cuenta en tinta.
  // Errores: ES11 (cambiar subíndices), ES12 (no contar cada elemento a los dos lados), ES14 (creer que se conservan las
  // moléculas), S-IGN (olvidar el coeficiente o el subíndice del paréntesis), S-SUM (sumar coeficiente y subíndice),
  // H-MIN (coeficientes que cuadran sin ser los mínimos), QM-SUMA-SIN-BALANCE (sumar los coeficientes antes de balancear).
  Object.assign(ESP, { O: [['O', 0, 0]], O2: [['O', -5, 0], ['O', 5, 0]], CO2: [['C', 0, 0], ['O', -10, 0], ['O', 10, 0]], CH4: [['C', 0, 0], ['H', -7, -6], ['H', 7, -6], ['H', -7, 6], ['H', 7, 6]],
    Fe2O3: [['Fe', -7, -4], ['Fe', 7, -4], ['O', -12, 6], ['O', 0, 7], ['O', 12, 6]], H2O2: [['O', -5, -1], ['O', 5, -1], ['H', -11, 4], ['H', 11, 4]] });
  // Una ecuación del motor («C3H8 + O2 -> CO2 + H2O») con los coeficientes dados, en fichas: el coeficiente en violeta.
  function ecCoefs(ec, cs) {
    const e = MB.ecuacion(sinEstado(ec)), fs = [...e.reactivos, ...e.productos].map(t => t.f), nR = e.reactivos.length, out = [];
    fs.forEach((f, k) => { if (k === nR) out.push(' → '); else if (k) out.push(' + '); if (cs[k] !== 1) out.push(COEF(cs[k]), ' '); out.push(bonita(f)); });
    return out;
  }
  const cuenta = (pares, extra = {}) => pares.map(([e, n]) => Object.assign({ e, texto: f(n, 0) }, extra));   // de la mesa del laboratorio
  const bal = ec => MB.balancear(sinEstado(ec)).coefs;
  const sumaDe = cs => cs.reduce((a, b) => a + b, 0);
  const cuentaTxt = (cs, ec) => { const c = MB.contar(sinEstado(ec), cs); return c.elementos.map(e => `${e}: ${c.izq[e]} y ${c.der[e]}`).join('; '); };
  // El primer elemento que no cuadra con unos coeficientes (para el siFuera: el valor que produce el error).
  const primeroMal = (ec, cs) => { const c = MB.contar(sinEstado(ec), cs); const e = c.elementos.find(x => c.izq[x] !== c.der[x]); return e ? `${e}: quedaría${c.izq[e] === 1 ? ' 1 átomo' : `n ${c.izq[e]} átomos`} a la izquierda y ${c.der[e]} a la derecha` : null; };
  function metano(a, b, c) {
    const caja = (titulo, ps, cnt) => ({ titulo, forma: 'caja', particulas: ps, cuenta: cnt }), k = n => (n === 1 ? '' : `${n}\u00a0`);
    return lupaEl([
      caja(`CH₄ + ${k(a)}O₂`, [{ e: 'CH4', n: 1 }, { e: 'O2', n: a }], [{ e: 'C', texto: 'C 1' }, { e: 'H', texto: 'H 4' }, { e: 'O', texto: `O ${2 * a}` }]),
      caja(`${k(b)}CO₂ + ${k(c)}H₂O`, [{ e: 'CO2', n: b }, { e: 'H2O', n: c }], [{ e: 'C', texto: `C ${b}` }, { e: 'H', texto: `H ${2 * c}` }, { e: 'O', texto: `O ${2 * b + c}` }]),
    ], { alto: 130, cuentaPorFila: 3, alt: `Lupa (un modelo) de CH₄ + ${a} O₂ → ${b} CO₂ + ${c} H₂O. Izquierda: 1 C, 4 H y ${2 * a} O. Derecha: ${b} C, ${2 * c} H y ${2 * b + c} O.` });
  }
  const lectura3 = v => { const fila = (el, i, d) => `${el}: ${i} ${i === d ? '=' : '≠'} ${d}`; return [fila('C', 1, v.b), SEP, fila('H', 4, 2 * v.c), SEP, fila('O', 2 * v.a, 2 * v.b + v.c)]; };
  const D_TANTEO = 'Átomos de un elemento = coeficiente × subíndice (un subíndice fuera del paréntesis multiplica todo lo de adentro)';
  const D_SUB = 'El subíndice dice qué sustancia es; el coeficiente, cuántas moléculas o unidades hay';
  const D_MIN = 'Se escriben los enteros más pequeños; el coeficiente 1 no se escribe, pero cuenta';

  // Ejemplos de la idea 3. Revisado aparte (verif/todas.js y verif/idea3.js): cada ecuación cuadra, los coeficientes son los
  // del motor (balance por álgebra) y cada suma se rehace. Letras correctas de nivel 3: C, A, E, D, B.
  const EJEMPLOS_TAN = [
    { nivel: 1, titulo: 'Contar con coeficiente', enunciado: '¿Cuántos átomos de hidrógeno hay en 3 H₂O?', datos: [D_TANTEO],
      solucion: [{ texto: 'Cada molécula tiene 2 H, y hay 3 moléculas.', ecuacion: ['3 × 2 = ', COEF('6')] }], respuesta: [COEF('6 átomos de H')] },
    { nivel: 1, titulo: 'Contar con paréntesis', enunciado: '¿Cuántos átomos de oxígeno hay en 2 Ca(OH)₂?', datos: [D_TANTEO],
      solucion: [{ texto: 'El 2 de afuera del paréntesis da 2 O en cada unidad, y el coeficiente dice que hay 2 unidades.', ecuacion: ['2 × 2 × 1 = ', COEF('4')] }], respuesta: [COEF('4 átomos de O')] },
    { nivel: 1, titulo: '¿Está balanceada?', enunciado: '¿Está balanceada N₂ + H₂ → NH₃?', datos: [D_TANTEO],
      solucion: [{ texto: 'Hay 2 N a la izquierda y 1 a la derecha, y 2 H a la izquierda y 3 a la derecha: no cuadra ninguno de los dos.' }], respuesta: ['No: ni el N ni el H cuadran'] },
    { nivel: 1, titulo: 'El coeficiente que falta', enunciado: 'Completa: 2 Na + Cl₂ → __ NaCl.', datos: [D_TANTEO],
      solucion: [{ texto: 'A la izquierda hay 2 Na y 2 Cl, y cada NaCl lleva uno de cada uno, así que hacen falta 2 NaCl.', ecuacion: ['2 Na + Cl₂ → ', COEF(2), ' NaCl'] }], respuesta: [COEF('2')] },
    { nivel: 1, titulo: 'Moléculas que no se conservan', enunciado: 'En 2 H₂ + O₂ → 2 H₂O, ¿cuántas moléculas hay antes y cuántas después?', datos: [D_SUB],
      solucion: [{ texto: 'Antes hay 2 moléculas de H₂ y 1 de O₂, que son 3; después hay 2 moléculas de agua.' }, { texto: 'Se conservan los átomos (4 H y 2 O), pero no las moléculas.' }], respuesta: ['3 antes y 2 después'] },
    { nivel: 2, titulo: 'El óxido de aluminio', enunciado: 'Balancea Al + O₂ → Al₂O₃ con los enteros más pequeños.', datos: [D_TANTEO, D_MIN],
      solucion: [{ texto: 'El oxígeno va de 2 en 2 a la izquierda y de 3 en 3 a la derecha; el menor múltiplo común es 6, con 3 O₂ y 2 Al₂O₃.' }, { texto: 'Así quedan 4 aluminios a la derecha, de modo que van 4 Al a la izquierda.', ecuacion: ecCoefs('Al + O2 -> Al2O3', [4, 3, 2]) }],
      respuesta: [...ecCoefs('Al + O2 -> Al2O3', [4, 3, 2])] },
    { nivel: 2, titulo: 'La quema del propano', enunciado: 'Balancea C₃H₈ + O₂ → CO₂ + H₂O, el propano del balón de gas.', datos: [D_TANTEO, D_MIN],
      solucion: [{ texto: 'Los 3 carbonos piden 3 CO₂, y los 8 hidrógenos piden 4 H₂O.' }, { texto: 'A la derecha quedan 6 + 4 = 10 oxígenos, así que van 5 O₂.', ecuacion: ecCoefs('C3H8 + O2 -> CO2 + H2O', [1, 5, 3, 4]) }],
      respuesta: [...ecCoefs('C3H8 + O2 -> CO2 + H2O', [1, 5, 3, 4])] },
    { nivel: 2, titulo: 'Con paréntesis', enunciado: 'Balancea Ca(OH)₂ + HCl → CaCl₂ + H₂O.', datos: [D_TANTEO, D_MIN],
      solucion: [{ texto: 'El CaCl₂ tiene 2 cloros, así que van 2 HCl.' }, { texto: 'A la izquierda hay 2 + 2 = 4 hidrógenos, que piden 2 H₂O; el oxígeno queda con 2 a cada lado.', ecuacion: ecCoefs('Ca(OH)2 + HCl -> CaCl2 + H2O', [1, 2, 1, 2]) }],
      respuesta: [...ecCoefs('Ca(OH)2 + HCl -> CaCl2 + H2O', [1, 2, 1, 2])] },
    { nivel: 2, titulo: 'Una fracción que se va', enunciado: 'Al balancear C₂H₂ + O₂ → CO₂ + H₂O sale 1, 5/2, 2, 1. ¿Cuáles son los enteros más pequeños?', datos: [D_MIN, 'Si sale una fracción, todos los coeficientes se multiplican por su denominador'],
      solucion: [{ texto: 'Se multiplican todos los coeficientes por 2, y quedan 2, 5, 4 y 2.', ecuacion: ecCoefs('C2H2 + O2 -> CO2 + H2O', [2, 5, 4, 2]) }, { texto: 'Si solo el 5/2 se multiplicara por 2, con 1, 5, 2 y 1 el oxígeno quedaría en 10 contra 5.' }],
      respuesta: [...ecCoefs('C2H2 + O2 -> CO2 + H2O', [2, 5, 4, 2])] },
    { nivel: 2, titulo: 'No son los mínimos', enunciado: '¿Está bien escrita 4 H₂ + 2 O₂ → 4 H₂O como ecuación balanceada?', datos: [D_MIN],
      solucion: [{ texto: 'Cuadra, con 8 H y 4 O a cada lado, pero los tres coeficientes se pueden dividir entre 2.' }, { texto: 'Con los enteros más pequeños queda así:', ecuacion: ecCoefs('H2 + O2 -> H2O', [2, 1, 2]) }],
      respuesta: ['Cuadra, pero no son los mínimos: 2, 1, 2'] },
    { nivel: 3, titulo: 'La suma de coeficientes', enunciado: 'Balancea NH₃ + O₂ → NO + H₂O. ¿Cuánto suman los coeficientes?', datos: [D_TANTEO, D_MIN], alternativas: ['4', '15', '19', '38', '9'],
      solucion: [{ texto: 'Con 6 H a cada lado van 2 NH₃ y 3 H₂O; los 2 N piden 2 NO, y el O suma 2 + 3 = 5, que pide 5/2 O₂.' },
        { texto: 'Para quitar la fracción, todo se multiplica por 2: 4, 5, 4 y 6, que suman 19.', ecuacion: ecCoefs('NH3 + O2 -> NO + H2O', [4, 5, 4, 6]) },
        { texto: ['La ', letra('A'), ' suma sin balancear; la ', letra('B'), ' olvida el 4 del NO; la ', letra('D'), ' no usa los mínimos, y la ', letra('E'), ' suma 2 + 5/2 + 2 + 3 = 9,5 y corta el decimal.'] }],
      respuesta: [letra('C'), ', ', COEF('19')] },
    { nivel: 3, titulo: 'Método algebraico', enunciado: 'Con a C₂H₆ + b O₂ → c CO₂ + d H₂O, se escribe una igualdad por elemento. ¿Cuánto vale b con los enteros más pequeños?', datos: [D_TANTEO, D_MIN, 'a, b, c y d: los coeficientes, en ese orden'],
      alternativas: ['7', '7/2', '14', '3', '4'],
      solucion: [{ texto: 'C: 2a = c. H: 6a = 2d. O: 2b = 2c + d.' }, { texto: 'Con a = 2: c = 4, d = 6 y 2b = 8 + 6 = 14, b = 7.', ecuacion: ecCoefs('C2H6 + O2 -> CO2 + H2O', [2, 7, 4, 6]) },
        { texto: ['La ', letra('B'), ' toma a = 1 y deja la fracción; la ', letra('C'), ' da el valor de 2b y no el de b; la ', letra('D'), ' da d con a = 1, y la ', letra('E'), ' olvida el O del agua (2b = 2c).'] }],
      respuesta: [letra('A'), ', b = ', COEF('7')] },
    { nivel: 3, titulo: 'El subíndice tocado', enunciado: 'Para balancear Fe + O₂ → FeO, un compañero escribe Fe + O₂ → FeO₂. ¿Qué afirmación es correcta?', datos: [D_SUB, D_TANTEO],
      alternativas: ['Está bien: cuadran 1 Fe y 2 O', 'Le falta multiplicar todo por 2', 'Debió escribir Fe₂ + O₂', 'No cuadra el hierro', 'Cuadra, pero FeO₂ es otra sustancia: va 2 Fe + O₂ → 2 FeO'],
      solucion: [{ texto: 'Cambiar el subíndice cambia la sustancia, así que se balancea con coeficientes: 2 Fe + O₂ → 2 FeO.' },
        { texto: ['La ', letra('A'), ' acepta el subíndice tocado; la ', letra('B'), ' y la ', letra('C'), ' tampoco devuelven la sustancia correcta, y la ', letra('D'), ' cuenta mal, porque el hierro sí cuadra.'] }],
      respuesta: [letra('E')] },
    { nivel: 3, titulo: 'Fosfato de calcio', enunciado: 'Balancea Ca₃(PO₄)₂ + H₂SO₄ → CaSO₄ + H₃PO₄. ¿Cuál es el coeficiente del H₂SO₄?', datos: [D_TANTEO, D_MIN], alternativas: ['1', '2', '4', '3', '6'],
      solucion: [{ texto: 'Los 3 Ca piden 3 CaSO₄ y los 2 P piden 2 H₃PO₄; con 3 S a la derecha, van 3 H₂SO₄.' }, { texto: 'Al revisar, el H queda 6 y 6, y el O, 8 + 12 = 20 y 12 + 8 = 20.', ecuacion: ecCoefs('Ca3(PO4)2 + H2SO4 -> CaSO4 + H3PO4', [1, 3, 3, 2]) },
        { texto: ['La ', letra('A'), ' no balancea; la ', letra('B'), ' copia el 2 del paréntesis; la ', letra('C'), ' cuenta los O del sulfato, y la ', letra('E'), ' da el doble, 3 × 2 = 6.'] }],
      respuesta: [letra('D'), ', ', COEF('3')] },
    { nivel: 3, titulo: 'Combustión del octano', enunciado: 'Balancea la combustión de la gasolina, C₈H₁₈ + O₂ → CO₂ + H₂O, con enteros mínimos. ¿Cuánto suman los coeficientes?', datos: [D_TANTEO, D_MIN],
      alternativas: ['30,5', '61', '122', '4', '43'],
      solucion: [{ texto: 'Los 8 C piden 8 CO₂ y los 18 H, 9 H₂O; el O suma 16 + 9 = 25, que pide 25/2 O₂.' }, { texto: 'Todo se multiplica por 2: 2, 25, 16 y 18, que suman 61.', ecuacion: ecCoefs('C8H18 + O2 -> CO2 + H2O', [2, 25, 16, 18]) },
        { texto: ['La ', letra('A'), ' suma con la fracción; la ', letra('C'), ' no usa los mínimos; la ', letra('D'), ' suma sin balancear, y la ', letra('E'), ' multiplica por 2 solo el O₂: 1 + 25 + 8 + 9.'] }],
      respuesta: [letra('B'), ', ', COEF('61')] },
  ];
  // Ahora tú y Así se resuelve: listas distintas, sin el metano (juego), el H₂O₂ (Predice), el Fe₂O₃ (Mira) ni los casos
  // de los ejemplos. Los coeficientes los da el motor.
  const HUECO3 = ['2 Al + 3 Cl2 -> 2 AlCl3', '2 KClO3 -> 2 KCl + 3 O2', '2 Na + 2 H2O -> 2 NaOH + H2', '2 SO2 + O2 -> 2 SO3', 'P4 + 5 O2 -> P4O10',
    'N2 + 3 H2 -> 2 NH3', '2 Mg + O2 -> 2 MgO', 'Zn + 2 HCl -> ZnCl2 + H2'];
  const CONTAR3 = [[3, 'Ca(NO3)2', 'O', 2, 3], [2, 'Al2(SO4)3', 'O', 3, 4], [4, 'Mg(OH)2', 'H', 2, 1], [5, 'Ba(NO3)2', 'N', 2, 1], [3, 'Fe2(SO4)3', 'S', 3, 1], [2, '(NH4)3PO4', 'H', 3, 4]];
  const SUMA3 = ['Fe + Cl2 -> FeCl3', 'KClO3 -> KCl + O2', 'Fe2O3 + C -> Fe + CO2', 'C4H10 + O2 -> CO2 + H2O', 'Al + H2SO4 -> Al2(SO4)3 + H2', 'C2H5OH + O2 -> CO2 + H2O'];
  const FRAC3 = ['C3H6', 'C4H8', 'C6H6', 'C5H10', 'C3H4'];
  const RES3 = ['Mg + N2 -> Mg3N2', 'H2S + O2 -> SO2 + H2O', 'Al + HCl -> AlCl3 + H2', 'C5H12 + O2 -> CO2 + H2O', 'Cu + AgNO3 -> Cu(NO3)2 + Ag'];
  const sinCoefs = ec => ec.replace(/(^|[>+]\s*)\d+\s+/g, '$1');
  function casoHueco(ec, k) {
    const base = sinCoefs(ec), cs = bal(base), fs = [...MB.ecuacion(base).reactivos, ...MB.ecuacion(base).productos].map(t => t.f), nR = MB.ecuacion(base).reactivos.length;
    const pos = idx(k, fs.length), bien = cs[pos];
    const txt = fs.map((f, i) => (i === pos ? '__ ' : cs[i] === 1 ? '' : `${cs[i]} `) + bonita(f));
    const enun = `${txt.slice(0, nR).join(' + ')} → ${txt.slice(nR).join(' + ')}`;
    const ops = [{ id: 'c', texto: String(bien), correcta: true }];
    for (const [id, v] of [['mas', bien + 1], ['menos', bien > 1 ? bien - 1 : bien + 2], ['doble', 2 * bien]]) {
      if (ops.some(o => o.texto === String(v))) continue;
      const otros = cs.slice(); otros[pos] = v;
      ops.push({ id, texto: String(v), error: id === 'doble' ? 'H-MIN' : 'ES12', siFuera: `Un entero está bien, pero con ${v} no cuadra el ${primeroMal(base, otros)}.` });
    }
    return { pregunta: `¿Qué coeficiente va en el espacio? ${enun}`, datos: [D_TANTEO], opciones: ops.slice(0, 4),
      solucion: { texto: `Con ${bien} cada elemento cuadra a los dos lados: ${cuentaTxt(cs, base)}.`, ecuacion: ecCoefs(base, cs) } };
  }
  function casoContar([k, f, el, n, m]) {
    const bien = k * n * m, F = bonita(f);
    const ops = [{ id: 'c', texto: String(bien), correcta: true }];
    for (const [id, v, err, sf] of [['sincoef', n * m, 'S-IGN', `Una unidad sí tiene ${n * m}, pero el coeficiente dice que hay ${k} unidades, así que se multiplica por ${k}.`],
      ['sinpar', k * m, 'S-IGN', `El coeficiente está bien usado, pero el ${n} de afuera del paréntesis también multiplica lo que está adentro.`],
      ['suma', k + n + m, 'S-SUM', `Hay que usar los tres números, es cierto, pero se multiplican y no se suman: ${k} × ${n} × ${m}.`]]) {
      if (!ops.some(o => o.texto === String(v))) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `¿Cuántos átomos de ${el} hay en ${k} ${F}?`, datos: [D_TANTEO], opciones: ops,
      solucion: { texto: `Cada unidad tiene ${n} × ${m} = ${n * m} átomos de ${el}, y hay ${k} unidades.`, ecuacion: [`${k} × ${n} × ${m} = `, COEF(bien)] } };
  }
  function casoSuma(base) {
    const cs = bal(base), s = sumaDe(cs), nEsp = cs.length, unos = cs.filter(x => x === 1).length;
    const ops = [{ id: 'c', texto: String(s), correcta: true }];
    for (const [id, v, err, sf] of [['sinbal', nEsp, 'QM-SUMA-SIN-BALANCE', 'Ese número sale si se suman los coeficientes sin balancear, cuando todos valen 1; primero hay que balancear y después sumar.'],
      ['doble', 2 * s, 'H-MIN', `Una suma de ${2 * s} sale con coeficientes que cuadran, pero que no son los enteros más pequeños: es el doble de la suma mínima.`],
      ['sinunos', s - unos, 'ES12', `Los coeficientes escritos están bien, pero el 1 que no se escribe también se suma: falta${unos > 1 ? 'n' : ''} ${unos}.`],
      ['otra', s + 2, 'ES12', `Con coeficientes que sumen ${s + 2}, algún elemento no cuadra; cuenta otra vez ${listaY(MB.contar(base, cs).elementos)} a los dos lados.`]]) {
      if (v > 0 && !ops.some(o => o.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `Balancea ${ecTxt(base)} con los enteros más pequeños. ¿Cuánto suman los coeficientes?`, datos: [D_TANTEO, D_MIN], opciones: ops,
      solucion: { texto: `Los coeficientes más pequeños son ${listaY(cs.map(String))}, y suman ${s}.`, ecuacion: ecCoefs(base, cs) } };
  }
  function casoFraccion(comb) {
    const base = `${comb} + O2 -> CO2 + H2O`, cs = bal(base), o2 = cs[1], at = MB.atomos(comb), un = (at.C * 2 + at.H / 2) / 2;
    const ops = [{ id: 'c', texto: String(o2), correcta: true }];
    const frac = Number.isInteger(un) ? null : `${2 * un}/2`;
    for (const [id, v, err, sf] of [['frac', frac, 'H-MIN', `La cuenta del oxígeno está bien, pero ${frac} no es entero: se multiplican todos los coeficientes por 2.`],
      ['sinagua', cs[0] * at.C, 'ES12', 'Ese número alcanza solo para el oxígeno del CO₂, pero el oxígeno del agua también sale del O₂.'],
      ['doble', 2 * o2, 'H-MIN', `Con ${2 * o2} la ecuación cuadra, pero no con los enteros más pequeños: es el doble.`], ['mas', o2 + 1, 'ES12', `Con ${o2 + 1} O₂ sobrarían 2 átomos de oxígeno a la izquierda.`]]) {
      if (v !== null && v !== undefined && !ops.some(o => o.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `Balancea la combustión ${ecTxt(base)} con los enteros más pequeños. ¿Cuál es el coeficiente del O₂?`, datos: [D_TANTEO, D_MIN, 'Si sale una fracción, todos los coeficientes se multiplican por su denominador'], opciones: ops,
      solucion: { texto: `Se igualan primero el C y el H, y al final el O: ${cuentaTxt(cs, base)}.`, ecuacion: ecCoefs(base, cs) } };
  }

  const tanteo = {
    id: 'tanteo',
    titulo: 'Balance por tanteo',
    pregunta: '¿Qué números se cambian para balancear una ecuación?',
    temas: ['Balance por tanteo'],
    pieza: 'quim-particulas',
    aprendizaje: 'Se cambian los coeficientes, nunca los subíndices, hasta que cada elemento tenga los mismos átomos a los dos lados, con los enteros más pequeños.',
    actividad: 'Cambiar cuántas moléculas de cada sustancia hay hasta que los átomos cuadren.',
    lee: {
      tarjetas: [
        { titulo: 'La llama de la hornilla', texto: 'En muchas cocinas, la llama azul quema metano, CH₄, el gas natural. Con el oxígeno del aire forma dióxido de carbono y vapor de agua.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'cocina', nombre: 'La llama de gas natural' }, estado: {} } },
        { titulo: 'Dos números distintos', texto: 'En 3 H₂O, el 3 grande de adelante es el coeficiente: cuántas moléculas hay. El 2 chico de abajo es el subíndice: dice que cada molécula tiene 2 H.',
          ecuacion: [COEF(3), ' H₂O'] },
        { titulo: 'Los átomos no se pierden', texto: 'En una reacción, los átomos se reacomodan: ninguno aparece ni desaparece. Por eso cada elemento debe tener los mismos átomos a los dos lados de la flecha.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay una molécula de metano. Cambia cuántas de O₂, CO₂ y H₂O hay, y mira la cuenta de C, H y O de cada lado.' },
      ],
    },
    ejemplos: EJEMPLOS_TAN,
    juega: {
      consigna: 'Una molécula de metano arde en la hornilla. Tú decides cuántas moléculas de O₂, CO₂ y H₂O hay; las fórmulas no se tocan.',
      mision: { texto: 'Balancea la quema del metano con los enteros más pequeños.', logrado: v => v.a === 2 && v.b === 1 && v.c === 2,
        bien: 'Listo: CH₄ + 2 O₂ → CO₂ + 2 H₂O. Cada átomo de antes sigue ahí después.' },
      voz: 'Iguala un elemento a la vez: C, después H y al final O.',
      leyenda: [{ s: COEF('2'), t: 'coeficiente: cuántas moléculas hay' }, { s: 'O₂', t: 'el 2 chico es el subíndice: no cambia' },
        { s: '=', t: 'mismos átomos a los dos lados' }, { s: '≠', t: 'todavía no cuadra' }],
      controles: [
        { id: 'a', etiqueta: 'O₂', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'CO₂', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c', etiqueta: 'H₂O', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => metano(v.a, v.b, v.c),
      lectura: v => lectura3(v),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-particulas',
      pregunta: 'Para balancear H₂ + O₂ → H₂O, alguien escribe H₂ + O₂ → H₂O₂: así los oxígenos ya cuadran. ¿Qué pasó?',
      voz: 'Mira qué sustancia queda escrita.',
      opciones: [
        { id: 'c', texto: 'Cuadra, pero ahora describe otra sustancia: agua oxigenada', correcta: true },
        { id: 'vale', texto: 'Es otra forma válida de balancear', error: 'ES11', siFuera: 'Es cierto que los átomos cuadran, pero el subíndice dice qué sustancia es: al cambiarlo, la fórmula H₂O₂ ya no es la del agua.' },
        { id: 'h', texto: 'No cuadra el hidrógeno', error: 'ES12', siFuera: 'El hidrógeno sí cuadra, con 2 átomos a cada lado; el problema no está en la cuenta, sino en la sustancia que quedó escrita.' },
      ],
      dibujo: lupaEl([{ titulo: 'H₂ + O₂', forma: 'caja', particulas: [{ e: 'H2', n: 1 }, { e: 'O2', n: 1 }], cuenta: [{ e: 'H2', texto: 'H₂' }, { e: 'O2', texto: 'O₂' }] },
        { titulo: 'H₂O₂ ?', forma: 'caja', particulas: [] }], { alto: 120, alt: 'Lupa: a la izquierda, una molécula de H₂ y una de O₂; a la derecha, una caja vacía con «H₂O₂ ?».' }),
      revelar: lupaEl([{ titulo: 'H₂ + O₂', forma: 'caja', particulas: [{ e: 'H2', n: 1 }, { e: 'O2', n: 1 }], cuenta: [{ e: 'H2', texto: 'H₂' }, { e: 'O2', texto: 'O₂' }] },
        { titulo: 'H₂O₂: no es agua', forma: 'caja', particulas: [{ e: 'H2O2', n: 1 }], cuenta: [{ e: 'H2O2', texto: 'H₂O₂' }] }], { alto: 120, alt: 'Lupa: H₂ y O₂ forman una molécula de H₂O₂, agua oxigenada, que no es agua.' }),
      coincide: 'Coincide: cambiar el subíndice cambia la sustancia. El agua es 2 H₂ + O₂ → 2 H₂O.',
      noCoincide: 'Los átomos cuadran, pero H₂O₂ es otra sustancia. Lo correcto: 2 H₂ + O₂ → 2 H₂O.',
    },
    mira: {
      datos: lupaEl([
        { titulo: 'Fe + O₂', forma: 'caja', particulas: [{ e: 'Fe', n: 1, desde: 1, hasta: 2 }, { e: 'Fe', n: 4, desde: 3 }, { e: 'O2', n: 1, desde: 1, hasta: 1 }, { e: 'O2', n: 3, desde: 2 }],
          cuenta: [{ e: 'Fe', texto: 'Fe: 1', desde: 1, hasta: 2 }, { e: 'Fe', texto: 'Fe: 4', desde: 3 }, { e: 'O', texto: 'O: 2', desde: 1, hasta: 1 }, { e: 'O', texto: 'O: 6', desde: 2 }] },
        { titulo: 'Fe₂O₃', forma: 'caja', particulas: [{ e: 'Fe2O3', n: 1, desde: 1, hasta: 1 }, { e: 'Fe2O3', n: 2, desde: 2 }],
          cuenta: [{ e: 'Fe', texto: 'Fe: 2', desde: 1, hasta: 1 }, { e: 'Fe', texto: 'Fe: 4', desde: 2 }, { e: 'O', texto: 'O: 3', desde: 1, hasta: 1 }, { e: 'O', texto: 'O: 6', desde: 2 }] },
      ], { alto: 130, alt: 'Lupa del hierro que se oxida: Fe + O₂ → Fe₂O₃, y cómo se ajustan los coeficientes hasta 4 Fe + 3 O₂ → 2 Fe₂O₃.' }).datos,
      voz: 'Igualemos elemento por elemento.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Un clavo se oxida: Fe + O₂ → Fe₂O₃. No cuadra el hierro ni el oxígeno.', ecuacion: ['Fe: 1 ≠ 2', SEP, 'O: 2 ≠ 3'] },
        { estado: { corte: 2 }, texto: 'Para el oxígeno, el menor múltiplo común de 2 y 3 es 6.', ecuacion: [COEF(3), ' O₂ → ', COEF(2), ' Fe₂O₃'] },
        { estado: { corte: 3 }, texto: 'Ahora hay 4 hierros a la derecha, así que se ponen 4 Fe a la izquierda.', ecuacion: [COEF(4), ' Fe + ', COEF(3), ' O₂ → ', COEF(2), ' Fe₂O₃'] },
        { estado: { corte: 3 }, texto: 'Cada lado queda con 4 Fe y 6 O: la ecuación está balanceada.', ecuacion: ['Fe: 4 = 4', SEP, 'O: 6 = 6'] },
      ],
    },
    regla: {
      texto: 'Por tanteo se cambian los coeficientes, nunca los subíndices, hasta que cada elemento tenga los mismos átomos a los dos lados. El coeficiente multiplica toda la fórmula, paréntesis incluido.',
      ecuacion: ['átomos = coeficiente × subíndice', SEP, COEF(4), ' Fe + ', COEF(3), ' O₂ → ', COEF(2), ' Fe₂O₃'],
      condicion: 'se usan los enteros más pequeños; si sale una fracción, todos los coeficientes se multiplican por su denominador.',
      voz: 'Inventario igual antes y después, elemento por elemento.',
    },
    resuelve: {
      generar(s) {
        const base = RES3[idx(s, RES3.length)], cs = bal(base), e = MB.ecuacion(base), pasosT = MB.balancear(base).pasos || [];
        return { enunciado: `Balancea ${ecTxt(base)} con los enteros más pequeños. ¿Cuánto suman los coeficientes?`, datos: [D_TANTEO, D_MIN],
          pasos: [
            { tipo: 'pide', texto: 'Se piden los coeficientes más pequeños que hacen cuadrar cada elemento, y después su suma.' },
            { tipo: 'datos', texto: `Las fórmulas están fijas: ${[...e.reactivos, ...e.productos].map(t => bonita(t.f)).join(', ')}. Se cambian solo los coeficientes.` },
            { tipo: 'regla', texto: 'Los átomos de un elemento son coeficiente × subíndice, y deben ser iguales a los dos lados. Conviene igualar primero los metales y los no metales, y dejar el H y el O al final.' },
            { tipo: 'cuentas', texto: `Con los coeficientes ${listaY(cs.map(String))} cuadra cada elemento a los dos lados: ${cuentaTxt(cs, base)}.`, ecuacion: ecCoefs(base, cs) },
            { tipo: 'sentido', texto: `No se pueden dividir todos entre un mismo número, así que son los mínimos, y suman ${cs.join(' + ')} = ${sumaDe(cs)}.` },
          ],
          respuesta: [COEF(sumaDe(cs))] };
      },
    },
    ahoraTu: {
      voz: 'Cuenta un elemento a la vez, a los dos lados.',
      generar(s) {
        const tipo = ['hueco', 'contar', 'suma', 'fraccion'][idx(s, 4)], k = Math.floor(s / 4);
        if (tipo === 'hueco') return casoHueco(HUECO3[idx(k, HUECO3.length)], k + s);
        if (tipo === 'contar') return casoContar(CONTAR3[idx(k, CONTAR3.length)]);
        if (tipo === 'suma') return casoSuma(SUMA3[idx(k, SUMA3.length)]);
        return casoFraccion(FRAC3[idx(k, FRAC3.length)]);
      },
    },
  };


  // ---------- Idea 4 (rehecha, 26 nov): oxidación, reducción y agentes ----------
  // Propuesta §3 idea 4. Objeto de la primera pantalla: la lámina de zinc en sulfato de cobre (quim-reaccion).
  // Cambia: la reacción · Permanece: la recta del EO · Progresa: un salto a la derecha (oxidación) y otro a la izquierda
  // (reducción) · Se reserva: el alto horno (Predice, la de siempre) · Debe verse: que el que sube pierde electrones y el
  // que baja los gana. El EO en naranja (c-o); los electrones en turquesa (c-i).
  // Errores: EC9 (oxidar es ganar oxígeno; reducir, perderlo), QM-AGENTE (el agente es un producto, o se cruzan los
  // nombres), N-CAR (la carga del ion como EO de cada átomo), QM-NO-REDOX (llamar redox a lo que no cambia ningún EO).
  const rectaEO = (elementos, extra = {}) => ({ pieza: 'recta', datos: Object.assign({ min: -3, max: 4, paso: 1, cada: 1, variable: 'EO', color: 'o', filas: 2, elementos }, extra), estado: {} });
  const saltoEO = (x, a, b, fila, desde = 0) => ({ tipo: 'salto', a, b, color: 'o', rotulo: `${x}: ${b > a ? 'se oxida' : 'se reduce'}`, fila, desde });
  const REAC = {
    zn: { t: 'Zn + Cu²⁺', s: [['Zn', 0, 2], ['Cu', 2, 0]], ox: 'Zn', red: 'Cu²⁺' },
    mg: { t: 'Mg + O₂', s: [['Mg', 0, 2], ['O', 0, -2]], ox: 'Mg', red: 'O₂' },
    cu: { t: 'Cu + Ag⁺', s: [['Cu', 0, 2], ['Ag', 1, 0]], ox: 'Cu', red: 'Ag⁺' },
    h2: { t: 'H₂ + Cl₂', s: [['H', 0, 1], ['Cl', 0, -1]], ox: 'H₂', red: 'Cl₂' },
  };
  // Animación: primero el salto del que se oxida, después el del que se reduce, y quedan los dos (1,5 s cada paso).
  const pasoRedox = t => Math.min(3, 1 + Math.floor(t / 1.5));
  function leeRedox(k, t) {
    const r = REAC[k], p = pasoRedox(t);
    if (p === 3) return `${r.ox} se oxida (reductor) y ${r.red} se reduce (oxidante)`;
    const [x, a, b] = r.s[p - 1];
    return `El ${x} pasa de ${sg(a)} a ${sg(b)}: ${b > a ? 'pierde electrones y se oxida' : 'gana electrones y se reduce'}`;
  }
  const D_EO = ['EO: elemento suelto 0; hidrógeno +1; oxígeno −2; metal del grupo 1, +1; del grupo 2, +2', 'La suma de los EO de una especie es su carga', 'EO del cloro, el bromo o el yodo en una sal sin oxígeno (NaCl, FeCl₃, KBr): −1'];
  const D_OXRED = 'Se oxida: su EO sube (pierde electrones). Se reduce: su EO baja (gana electrones)';
  const D_AGENTE = 'Agente oxidante: el reactivo que se reduce. Agente reductor: el reactivo que se oxida';
  const D_REDOX = 'Redox: reacción en que algún EO cambia';
  // Lo que dice el motor de una ecuación (sin coeficientes ni estados): quién se oxida, quién se reduce, los agentes y los
  // EO de antes y después de cada elemento que cambia.
  const rx = ec => MB.redox(sinCoefs(sinEstado(ec)));
  const eoEn = (f, el) => MB.oxidacion(f).porElemento[el];
  const cambio = (ec, el) => { const r = rx(ec); return [r.estados[el].izq[0], r.estados[el].der.find(v => v !== r.estados[el].izq[0]) ?? r.estados[el].der[0]]; };

  // Ejemplos de la idea 4. Revisado aparte (verif/todas.js y verif/idea4.js): cada ecuación cuadra; quién se oxida, quién se
  // reduce y los agentes los da el motor (redox) y se comparan con el resuelto; los EO se rehacen a mano. Letras correctas
  // de nivel 3: E, B, D, A, C.
  const EJEMPLOS_RED = [
    { nivel: 1, titulo: 'El EO de un elemento suelto', enunciado: '¿Qué EO tiene el cobre en un alambre de cobre puro, Cu?', datos: D_EO,
      solucion: [{ texto: 'Un elemento suelto, sin combinar, tiene EO 0.' }], respuesta: [EOc('0')] },
    { nivel: 1, titulo: 'Sube o baja', enunciado: 'En una reacción, el hierro pasa de Fe a Fe³⁺. ¿Se oxida o se reduce?', datos: [D_OXRED],
      solucion: [{ texto: 'Su EO sube de 0 a +3 porque pierde 3 electrones: se oxida.', ecuacion: ['Fe → Fe³⁺ + 3 ', ELc('e⁻')] }], respuesta: ['Se oxida'] },
    { nivel: 1, titulo: 'El cloro que baja', enunciado: 'En 2 Na + Cl₂ → 2 NaCl, ¿qué le pasa al EO del cloro?', datos: [...D_EO, D_OXRED],
      solucion: [{ texto: 'En el Cl₂, el cloro está suelto y tiene EO 0; en el NaCl, como el Na es +1, el Cl es −1.' }, { texto: 'Su EO baja de 0 a −1 porque gana un electrón: se reduce.' }], respuesta: ['Baja de 0 a −1: se reduce'] },
    { nivel: 1, titulo: 'Redox sin oxígeno', enunciado: '¿Es redox Mg + 2 HCl → MgCl₂ + H₂, aunque no haya oxígeno?', datos: [...D_EO, D_REDOX],
      solucion: [{ texto: 'El Mg va de 0 a +2 y el H, de +1 a 0: cambian dos EO.' }, { texto: 'Es redox, porque para serlo no hace falta oxígeno.' }], respuesta: ['Sí: el Mg sube y el H baja'] },
    { nivel: 1, titulo: 'Sin cambios', enunciado: '¿Es redox CaCO₃ → CaO + CO₂, aunque salga oxígeno combinado?', datos: [...D_EO, D_REDOX],
      solucion: [{ texto: 'El Ca queda en +2, el C en +4 y el O en −2 a los dos lados: ningún EO cambia.' }], respuesta: ['No: ningún EO cambia'] },
    { nivel: 2, titulo: 'Los dos agentes', enunciado: 'En Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag, ¿cuál es el agente oxidante y cuál el reductor?', datos: [...D_EO, D_OXRED, D_AGENTE],
      solucion: [{ texto: 'El Cu va de 0 a +2 y se oxida; la Ag va de +1 a 0 y se reduce.' }, { texto: 'El reactivo que se reduce es el oxidante: AgNO₃. El que se oxida es el reductor: Cu.' }],
      respuesta: ['Oxidante: AgNO₃. Reductor: Cu'] },
    { nivel: 2, titulo: 'La combustión es redox', enunciado: 'En CH₄ + 2 O₂ → CO₂ + 2 H₂O, ¿qué se oxida y qué se reduce?', datos: [...D_EO, D_OXRED],
      solucion: [{ texto: 'En el CH₄, como el H es +1, el C es −4; en el CO₂ es +4, así que sube 8 y se oxida.' }, { texto: 'El O baja de 0 en el O₂ a −2, así que se reduce. Toda combustión es redox.' }],
      respuesta: ['Se oxida el C; se reduce el O'] },
    { nivel: 2, titulo: 'El halógeno que desplaza', enunciado: 'En Cl₂ + 2 KI → 2 KCl + I₂, ¿cuál es el agente reductor?', datos: [...D_EO, D_OXRED, D_AGENTE],
      solucion: [{ texto: 'El I sube de −1 en el KI a 0 en el I₂ y se oxida; el Cl baja de 0 a −1 y se reduce.' }, { texto: 'El reactivo que trae el yodo, el KI, es el que se oxida: es el reductor.' }], respuesta: ['El KI'] },
    { nivel: 2, titulo: 'El cobre que se recupera', enunciado: 'En C + 2 CuO → 2 Cu + CO₂, ¿quién gana oxígeno y quién gana electrones?', datos: [...D_EO, D_OXRED],
      solucion: [{ texto: 'El C gana oxígeno y su EO sube de 0 a +4: se oxida.' }, { texto: 'El Cu pasa de +2 a 0: gana electrones, se reduce.' }], respuesta: ['El C gana oxígeno; el Cu gana electrones'] },
    { nivel: 2, titulo: 'Un ion que sube', enunciado: 'En 2 FeCl₂ + Cl₂ → 2 FeCl₃, ¿qué le pasa al hierro?', datos: [...D_EO, D_OXRED],
      solucion: [{ texto: 'En el FeCl₂, como el Cl es −1, el Fe es +2; en el FeCl₃ es +3.' }, { texto: 'Sube de +2 a +3 porque pierde un electrón: se oxida, y el FeCl₂ es el reductor.' }], respuesta: ['Sube de +2 a +3: se oxida'] },
    { nivel: 3, titulo: 'La tostación de la blenda', enunciado: 'En una fundición se tuesta blenda: 2 ZnS + 3 O₂ → 2 ZnO + 2 SO₂. ¿Cuál es el agente reductor?', datos: [...D_EO, D_OXRED, D_AGENTE],
      alternativas: ['O₂', 'ZnO', 'SO₂', 'Zn', 'ZnS'],
      solucion: [{ texto: 'El S sube de −2 en el ZnS a +4 en el SO₂ y se oxida; el O baja de 0 a −2 y se reduce, y el Zn sigue en +2.' }, { texto: 'El reactivo que se oxida es el ZnS: el reductor.' },
        { texto: ['La ', letra('A'), ' es el oxidante; la ', letra('B'), ' y la ', letra('C'), ' son productos, y el Zn de la ', letra('D'), ' no cambia su EO.'] }],
      respuesta: [letra('E'), ', ZnS'] },
    { nivel: 3, titulo: 'Cuál es redox', enunciado: '¿Cuál de estas reacciones es redox?', datos: [...D_EO, D_REDOX],
      alternativas: ['CaO + H₂O → Ca(OH)₂', '2 FeCl₂ + Cl₂ → 2 FeCl₃', 'HCl + NaOH → NaCl + H₂O', 'SO₃ + H₂O → H₂SO₄', 'AgNO₃ + KCl → AgCl + KNO₃'],
      solucion: [{ texto: 'Solo en la segunda cambian EO: el Fe sube de +2 a +3 y el Cl baja de 0 a −1.' },
        { texto: ['En la ', letra('A'), ', la ', letra('C'), ', la ', letra('D'), ' y la ', letra('E'), ' ningún EO cambia, aunque haya oxígeno.'] }],
      respuesta: [letra('B')] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Sobre MnO₂ + 4 HCl → MnCl₂ + Cl₂ + 2 H₂O: I. El Mn se oxida. II. El HCl es el agente reductor. III. Es redox.', datos: [...D_EO, D_OXRED, D_AGENTE],
      alternativas: ['VVV', 'VFV', 'FFV', 'FVV', 'FVF'],
      solucion: [{ texto: 'El Mn baja de +4 a +2 y se reduce, así que I es falsa; el Cl sube de −1 a 0, así que el HCl es el reductor y II es verdadera.' }, { texto: 'Como cambian EO, III también es verdadera.' },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' creen que el Mn se oxida; la ', letra('C'), ' cruza los agentes, y la ', letra('E'), ' no ve que es redox.'] }],
      respuesta: [letra('D'), ', FVV'] },
    { nivel: 3, titulo: 'El amoníaco que reduce', enunciado: 'En 3 CuO + 2 NH₃ → 3 Cu + N₂ + 3 H₂O, ¿qué especie se oxida y cuál es el agente oxidante?', datos: [...D_EO, D_OXRED, D_AGENTE],
      alternativas: ['NH₃ y CuO', 'CuO y NH₃', 'N₂ y Cu', 'NH₃ y N₂', 'H₂O y CuO'],
      solucion: [{ texto: 'El N sube de −3 en el NH₃ a 0 en el N₂, así que el NH₃ se oxida. El Cu baja de +2 a 0, así que el CuO se reduce y es el oxidante.' },
        { texto: ['La ', letra('B'), ' cruza los papeles; la ', letra('C'), ' y la ', letra('D'), ' nombran productos, y el H₂O de la ', letra('E'), ' es un producto que no cambia de EO.'] }],
      respuesta: [letra('A'), ', NH₃ y CuO'] },
    { nivel: 3, titulo: 'Oxidar sin oxígeno', enunciado: 'Un alumno dice: «Oxidarse es ganar oxígeno». ¿Qué reacción lo contradice?', datos: [...D_EO, D_OXRED],
      alternativas: ['2 Mg + O₂ → 2 MgO', 'C + O₂ → CO₂', '2 Na + Cl₂ → 2 NaCl', 'S + O₂ → SO₂', '4 Fe + 3 O₂ → 2 Fe₂O₃'],
      solucion: [{ texto: 'En 2 Na + Cl₂ → 2 NaCl el sodio sube de 0 a +1: se oxida sin oxígeno.' },
        { texto: ['En la ', letra('A'), ', la ', letra('B'), ', la ', letra('D'), ' y la ', letra('E'), ' el que se oxida sí gana oxígeno, así que no la contradicen.'] }],
      respuesta: [letra('C')] },
  ];
  // Así se resuelve y Ahora tú: listas distintas, sin el alto horno (Predice), las del juego ni las de los ejemplos.
  const RES4 = ['Mg + 2 HCl -> MgCl2 + H2', 'Zn + 2 AgNO3 -> Zn(NO3)2 + 2 Ag', '2 H2S + 3 O2 -> 2 SO2 + 2 H2O', 'CuO + H2 -> Cu + H2O', '2 Al + 3 CuCl2 -> 2 AlCl3 + 3 Cu'];
  const AG4 = ['Zn + 2 HCl -> ZnCl2 + H2', '2 Al + 3 Cl2 -> 2 AlCl3', 'Fe + CuSO4 -> FeSO4 + Cu', 'Cl2 + 2 KBr -> 2 KCl + Br2', 'PbO + CO -> Pb + CO2', 'Mg + CuSO4 -> MgSO4 + Cu', '2 KI + Br2 -> 2 KBr + I2'];
  const SI4 = ['Zn + CuSO4 -> ZnSO4 + Cu', '2 H2 + O2 -> 2 H2O', 'C3H8 + 5 O2 -> 3 CO2 + 4 H2O', 'Fe + 2 HCl -> FeCl2 + H2', 'N2 + 3 H2 -> 2 NH3'];
  const NO4 = ['LiOH + HCl -> LiCl + H2O', 'CaCO3 -> CaO + CO2', 'BaCl2 + K2SO4 -> BaSO4 + 2 KCl', 'CO2 + H2O -> H2CO3', 'Na2O + H2O -> 2 NaOH', 'MgCO3 -> MgO + CO2', 'Pb(NO3)2 + 2 KI -> PbI2 + 2 KNO3'];
  const VF4 = ['2 Mg + O2 -> 2 MgO', 'H2 + Cl2 -> 2 HCl', 'Cu + 2 AgNO3 -> Cu(NO3)2 + 2 Ag', 'Fe2O3 + 3 H2 -> 2 Fe + 3 H2O', '2 FeCl3 + Fe -> 3 FeCl2'];
  const reactivos = ec => MB.ecuacion(sinCoefs(ec)).reactivos.map(t => t.f), productos = ec => MB.ecuacion(sinCoefs(ec)).productos.map(t => t.f);
  const eoTxt = (ec, el) => { const [a, b] = cambio(ec, el); return `${el}: de ${sg(a)} a ${sg(b)}`; };
  // «el Zn va de 0 a +2»: el mismo cambio, dicho como oración.
  const eoVa = (ec, el) => { const [a, b] = cambio(ec, el); return `el ${el} va de ${sg(a)} a ${sg(b)}`; };
  const capi = t => t[0].toUpperCase() + t.slice(1);
  function casoAgente(ec, pideOx) {
    const r = rx(ec), bien = pideOx ? r.agenteOxidante[0] : r.agenteReductor[0], otro = pideOx ? r.agenteReductor[0] : r.agenteOxidante[0];
    const el = pideOx ? r.seReduce[0] : r.seOxida[0], prod = productos(ec).find(f => MB.especie(f).atomos[el] && f !== bien) || productos(ec)[0];
    const ops = [{ id: 'c', texto: bonita(bien), correcta: true },
      { id: 'cruce', texto: bonita(otro), error: 'QM-AGENTE', siFuera: `En el ${bonita(otro)} también cambia un EO, pero ${pideOx ? 'se oxida, así que es el agente reductor' : 'se reduce, así que es el agente oxidante'}.` },
      { id: 'prod', texto: bonita(prod), error: 'QM-AGENTE', siFuera: `Seguiste bien al ${el}, pero el ${bonita(prod)} es un producto, y los agentes siempre son reactivos.` }];
    const otroProd = productos(ec).find(f => !ops.some(o => o.texto === bonita(f)));
    if (otroProd) ops.push({ id: 'prod2', texto: bonita(otroProd), error: 'QM-AGENTE', siFuera: `El ${bonita(otroProd)} está a la derecha de la flecha: es un producto, y los agentes siempre son reactivos.` });
    return { pregunta: `En ${ecTxt(ec)}, ¿cuál es el agente ${pideOx ? 'oxidante' : 'reductor'}?`, datos: [...D_EO, D_OXRED, D_AGENTE], opciones: ops,
      solucion: { texto: `${capi(eoVa(ec, r.seOxida[0]))}, así que se oxida; ${eoVa(ec, r.seReduce[0])}, así que se reduce.`, ecuacion: [`agente ${pideOx ? 'oxidante' : 'reductor'}: ${bonita(bien)}`] } };
  }
  // Examen: ¿cuál es (o no es) redox? Una sola cumple; los distractores del oxígeno (EC9) primero.
  function casoEsRedox(s, r) {
    const pideSi = s % 8 < 4, una = pideSi ? SI4[idx(s, SI4.length)] : NO4[idx(s, NO4.length)];
    const resto = r.baraja(pideSi ? NO4 : SI4).slice(0, 3);
    const porQue = ec => (rx(ec).esRedox ? `En esta sí cambia un EO: ${eoVa(ec, rx(ec).seOxida[0])}.` : 'Que haya oxígeno no basta: en esta reacción ningún EO cambia, así que no es redox.');
    return { pregunta: `¿Cuál de estas reacciones ${pideSi ? 'es' : 'no es'} redox?`, datos: [...D_EO, D_REDOX],
      opciones: [{ id: 'c', texto: ecTxt(una), correcta: true }, ...resto.map((e, i) => ({ id: `o${i}`, texto: ecTxt(e), error: pideSi ? 'EC9' : 'QM-NO-REDOX', siFuera: porQue(e) }))],
      solucion: { texto: rx(una).esRedox ? `Solo en esta cambian los EO: ${eoVa(una, rx(una).seOxida[0])}, y ${eoVa(una, rx(una).seReduce[0])}.` : 'Solo en esta reacción ningún EO cambia, así que no es redox.', ecuacion: [ecTxt(una)] } };
  }
  // ¿Qué le pasa a un elemento? Sube (se oxida), baja (se reduce) o no cambia.
  function casoCambia(ec, k) {
    const r = rx(ec), els = [r.seOxida[0], r.seReduce[0]], el = els[idx(k, 2)], [a, b] = cambio(ec, el), sube = b > a;
    return { pregunta: `En ${ecTxt(ec)}, ¿qué le pasa al ${el}?`, datos: [...D_EO, D_OXRED],
      opciones: [
        { id: 'c', texto: `Su EO ${sube ? 'sube' : 'baja'} de ${sg(a)} a ${sg(b)}: se ${sube ? 'oxida' : 'reduce'}`, correcta: true },
        { id: 'nombre', texto: `Su EO ${sube ? 'sube' : 'baja'} de ${sg(a)} a ${sg(b)}: se ${sube ? 'reduce' : 'oxida'}`, error: 'EC9', siFuera: `Los valores del EO están bien, pero ${sube ? 'subir es perder electrones, y eso es oxidarse' : 'bajar es ganar electrones, y eso es reducirse'}.` },
        { id: 'reves', texto: `Su EO ${sube ? 'baja' : 'sube'} de ${sg(b)} a ${sg(a)}: se ${sube ? 'reduce' : 'oxida'}`, error: 'QM-CLASIF-REVES', siFuera: `Los dos valores están bien, pero se leen de reactivo a producto: el EO va de ${sg(a)} a ${sg(b)}.` },
        { id: 'nada', texto: 'No cambia: sigue en el mismo compuesto', error: 'N-CAR', siFuera: `Sería así si su EO fuera el mismo a los dos lados de la flecha, pero pasa de ${sg(a)} a ${sg(b)}.` },
      ],
      solucion: { texto: `El ${el} va de ${sg(a)} a ${sg(b)}: ${sube ? 'pierde' : 'gana'} electrones.`, ecuacion: [`${el}: ${sg(a)} → ${sg(b)}`] } };
  }
  // Examen: tres afirmaciones sobre una redox.
  function casoVF4(ec, r) {
    const R = rx(ec), ox = R.seOxida[0], red = R.seReduce[0];
    const I = r() < 0.5 ? [`El ${ox} se oxida`, true] : [`El ${red} se oxida`, false];
    const ag = r() < 0.5 ? [`El ${bonita(R.agenteOxidante[0])} es el agente oxidante`, true] : [`El ${bonita(R.agenteReductor[0])} es el agente oxidante`, false];
    const III = r() < 0.5 ? ['Es redox', true] : ['Ningún EO cambia', false];
    const af = [I, ag, III], clave = af.map(a => (a[1] ? 'V' : 'F')).join('');
    const motivo = [`el que se oxida es el ${ox}, porque su EO sube`, `el oxidante es el ${bonita(R.agenteOxidante[0])}, que se reduce`, 'algún EO cambia, así que es redox'];
    const malas = r.baraja(['VVV', 'VVF', 'VFV', 'FVV', 'VFF', 'FVF', 'FFV', 'FFF'].filter(k => k !== clave)).slice(0, 3), ROM = ['I', 'II', 'III'];
    return { pregunta: `Sobre ${ecTxt(ec)}: I. ${I[0]}. II. ${ag[0]}. III. ${III[0]}. ¿Qué es verdadero (V) y qué falso (F)?`, datos: [...D_EO, D_OXRED, D_AGENTE],
      opciones: [{ id: 'c', texto: clave, correcta: true }, ...malas.map((k, i) => { const j = [0, 1, 2].find(q => k[q] !== clave[q]);
        return { id: `vf${i}`, texto: k, error: j === 1 ? 'QM-AGENTE' : 'EC9', siFuera: `La ${ROM[j]} es ${clave[j] === 'V' ? 'verdadera' : 'falsa'}: ${motivo[j]}.` }; })],
      solucion: { texto: `${capi(eoVa(ec, ox))} y se oxida; ${eoVa(ec, red)} y se reduce, así que el oxidante es el ${bonita(R.agenteOxidante[0])}.`, ecuacion: [clave] } };
  }

  const redox = {
    id: 'oxida-reduce',
    titulo: 'Oxidación, reducción y agentes',
    pregunta: '¿Quién se oxida, quién se reduce y quién es el oxidante?',
    temas: ['Oxidación, reducción y agentes'],
    pieza: 'recta',
    aprendizaje: 'Oxidarse es perder electrones: el EO sube; reducirse, ganarlos: baja. El oxidante es el reactivo que se reduce; el reductor, el que se oxida.',
    actividad: 'Mirar en la recta del EO cómo sube uno y baja el otro.',
    lee: {
      tarjetas: [
        { titulo: 'Zinc en sulfato de cobre', texto: 'Una lámina de zinc en una solución azul de sulfato de cobre se cubre de una capa rojiza de cobre, y el azul se aclara. El zinc pasa a la solución como Zn²⁺.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'zinc', nombre: 'Zinc en sulfato de cobre' }, estado: {} } },
        { titulo: 'El EO, otra vez', texto: 'En Nomenclatura viste el estado de oxidación, EO. Un elemento suelto tiene EO 0, un ion de un átomo tiene EO igual a su carga, y la suma de los EO de una especie es su carga.' },
        { titulo: 'Electrones que pasan', texto: 'Cuando el EO de un átomo cambia, es que pasaron electrones de un átomo a otro. Cada electrón tiene carga −1.', ecuacion: ['Zn → Zn²⁺ + 2 ', ELc('e⁻')] },
        { titulo: 'Qué mirar', texto: 'En el juego, la recta marca el EO. Elige una reacción y mira qué átomo sube y cuál baja, y cómo se llama cada uno.' },
      ],
    },
    ejemplos: EJEMPLOS_RED,
    juega: {
      consigna: 'Cuatro reacciones en la recta del EO. Los saltos se dibujan solos: primero el de un átomo, después el del otro.',
      mision: { texto: 'Halla la reacción en que un no metal se reduce sin que haya oxígeno.', logrado: v => v.k === 'h2',
        bien: 'Listo: el cloro baja de 0 a −1 y no hay oxígeno. Reducirse es ganar electrones.' },
      voz: 'Sube quien pierde electrones; baja quien los gana.',
      leyenda: [{ s: EOc('EO'), t: 'estado de oxidación de un átomo' }, { s: 'se oxida', t: 'su EO sube: pierde electrones' }, { s: 'se reduce', t: 'su EO baja: gana electrones' }],
      controles: [{ id: 'k', etiqueta: 'Reacción', opciones: Object.keys(REAC).map(k => ({ valor: k, texto: REAC[k].t })) },
        { id: 't', etiqueta: 'tiempo', min: 0, max: 6, paso: 0.1, inicio: 6, unidad: 's', decimales: 1, auto: { velocidad: 1 } }],
      // corte = paso + 0,5: se ve lo de desde ≤ paso, sin la clase de «lo nuevo» de «Mira» (que volvería a empezar).
      dibujo: v => { const r = REAC[v.k], d = rectaEO(r.s.map(([x, a, b], i) => saltoEO(x, a, b, i + 1, i + 1))); d.estado = { corte: pasoRedox(v.t) + 0.5 }; return d; },
      lectura: v => [leeRedox(v.k, v.t)],
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: 'En el alto horno: Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂. El hierro pasa de +3 a 0 y el carbono de +2 a +4. ¿Cuál es el agente reductor?',
      voz: 'Primero decide quién sube y quién baja.',
      opciones: [
        { id: 'c', texto: 'El CO: su carbono se oxida', correcta: true },
        { id: 'fe2o3', texto: 'El Fe₂O₃: pierde oxígeno', error: 'EC9', siFuera: 'Es cierto que el Fe₂O₃ pierde oxígeno, pero por eso su hierro se reduce, y el reactivo que se reduce es el oxidante, no el reductor.' },
        { id: 'fe', texto: 'El Fe, que se forma', error: 'QM-AGENTE', siFuera: 'El hierro sí cambia de EO, pero el Fe es un producto, y los agentes siempre son reactivos.' },
        { id: 'co2', texto: 'El CO₂, porque gana oxígeno', error: 'QM-AGENTE', siFuera: 'Es cierto que el carbono gana oxígeno, pero el CO₂ es un producto; el agente es el reactivo que trae ese carbono.' },
      ],
      dibujo: rectaEO([]),
      revelar: rectaEO([saltoEO('Fe', 3, 0, 1), saltoEO('C', 2, 4, 2)]),
      coincide: 'Coincide: el C sube de +2 a +4; el CO es el reductor.',
      noCoincide: 'El C del CO sube de +2 a +4: se oxida, y el que se oxida es el reductor.',
    },
    mira: {
      datos: rectaEO([saltoEO('Zn', 0, 2, 1, 1), saltoEO('Cu', 2, 0, 2, 2)]).datos,
      voz: 'Sigamos los electrones del zinc al cobre.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El zinc sube de 0 a +2, porque pierde 2 electrones: se oxida.', ecuacion: ['Zn → Zn²⁺ + 2 ', ELc('e⁻')] },
        { estado: { corte: 2 }, texto: 'El ion cobre baja de +2 a 0, porque gana 2 electrones: se reduce.', ecuacion: ['Cu²⁺ + 2 ', ELc('e⁻'), ' → Cu'] },
        { estado: { corte: 2 }, texto: 'Los electrones que pierde el zinc son los que gana el cobre.' },
        { estado: { corte: 2 }, texto: 'El zinc provoca la reducción del cobre, así que es el reductor; el Cu²⁺, que oxida al zinc, es el oxidante.' },
      ],
    },
    regla: {
      texto: 'Oxidarse es perder electrones: el EO sube. Reducirse es ganarlos: el EO baja. El agente oxidante es el reactivo que se reduce; el agente reductor, el que se oxida.',
      ecuacion: ['Zn → Zn²⁺ + ', { llave: ['2 ', ELc('e⁻')], nota: 'perdidos', color: 'c-i' }, SEP, 'Cu²⁺ + ', { llave: ['2 ', ELc('e⁻')], nota: 'ganados', color: 'c-i' }, ' → Cu'],
      condicion: 'algún EO cambia, aunque no haya oxígeno; los agentes se buscan entre los reactivos, nunca entre los productos.',
      voz: 'El nombre del agente es lo que le hace al otro.',
    },
    resuelve: {
      generar(s) {
        const ec = RES4[idx(s, RES4.length)], r = rx(ec), ox = r.seOxida[0], red = r.seReduce[0];
        return { enunciado: `En ${ecTxt(ec)}, ¿cuál es el agente oxidante y cuál el agente reductor?`, datos: [...D_EO, D_OXRED, D_AGENTE],
          dibujo: rectaEO([saltoEO(ox, ...cambio(ec, ox), 1), saltoEO(red, ...cambio(ec, red), 2)], { min: Math.min(-3, ...cambio(ec, ox), ...cambio(ec, red)), max: Math.max(4, ...cambio(ec, ox), ...cambio(ec, red)) }),
          pasos: [
            { tipo: 'pide', texto: 'Se piden los dos agentes: el reactivo que oxida al otro y el reactivo que lo reduce.' },
            { tipo: 'datos', texto: `Al pasar de reactivos a productos, ${eoVa(ec, ox)}, y ${eoVa(ec, red)}.` },
            { tipo: 'regla', texto: 'El que sube se oxida y es el agente reductor; el que baja se reduce y es el agente oxidante.' },
            { tipo: 'aplica', texto: `El ${ox} sube, así que el ${bonita(r.agenteReductor[0])} es el reductor; el ${red} baja, así que el ${bonita(r.agenteOxidante[0])} es el oxidante.` },
            { tipo: 'sentido', texto: 'Los dos son reactivos, y uno no puede oxidarse sin que otro se reduzca.' },
          ],
          respuesta: [`Oxidante: ${bonita(r.agenteOxidante[0])}. Reductor: ${bonita(r.agenteReductor[0])}`] };
      },
    },
    ahoraTu: {
      voz: 'Sigue el EO de cada elemento, de reactivo a producto.',
      generar(s) {
        const r = azar(s + 37), tipo = ['agente', 'cambia', 'esRedox', 'vf'][idx(s, 4)], k = Math.floor(s / 4);
        if (tipo === 'agente') return casoAgente(AG4[idx(k, AG4.length)], k % 2 === 1);
        if (tipo === 'cambia') return casoCambia(AG4[idx(k + 3, AG4.length)], k);
        if (tipo === 'esRedox') return casoEsRedox(k, r);
        return casoVF4(VF4[idx(k, VF4.length)], r);
      },
    },
  };


  // ---------- Idea 5 (nueva, 26 nov): electrones perdidos, electrones ganados ----------
  // Propuesta §3 idea 5. Objeto de la primera pantalla: el árbol de plata, un alambre de cobre en nitrato de plata.
  // Cambia: cuántos Cu y cuántos AgNO₃ · Permanece: lo que pierde cada Cu (2) y lo que gana cada Ag⁺ (1) · Progresa: hasta
  // que los perdidos son los ganados · Se reserva: la fórmula con dos átomos que cambian (Predice del Fe₂O₃) · Debe verse:
  // las dos cuentas de electrones lado a lado. Coeficientes en violeta, electrones en turquesa, EO en naranja.
  // Errores: S-IGN (contar un solo átomo de los que cambian), S-SUM (sumar el subíndice al salto), N-CAR (la carga de la
  // especie en vez de los electrones), QM-SIN-IGUALAR (no multiplicar para igualar), QM-AGENTE, H-MIN.
  const AG5 = (cu, ag) => ({ pieza: 'quim-reaccion', datos: { vista: 'inventario', cabeza: ['pierde el Cu', 'gana la Ag'],
    ecuacion: [COEF(cu), ' Cu + ', COEF(ag), ' Ag⁺ → ', COEF(cu), ' Cu²⁺ + ', COEF(ag), ' Ag'],
    filas: [{ et: 'átomos', izq: String(cu), der: String(ag) }, { et: 'e⁻', izq: [ELc(`${2 * cu}`)], der: [ELc(`${ag}`)], igual: 2 * cu === ag }],
    alt: `${cu} Cu + ${ag} Ag⁺ (el nitrato no cambia y no se escribe): los ${cu} Cu pierden ${2 * cu} electrones y las ${ag} Ag⁺ ganan ${ag}.` }, estado: {} });
  const D_SALTO = 'Electrones de una fórmula = átomos que cambian × salto del EO de cada uno';
  const D_IGUAL = 'Los electrones que pierde el reductor son los que gana el oxidante';
  const rx5 = ec => MB.redox(sinCoefs(sinEstado(ec)));
  // Electrones transferidos en la ecuación balanceada: los da el motor, que cuenta solo los átomos que cambian de EO (en
  // K₂Cr₂O₇ + 14 HCl, los 6 Cl que pasan a Cl₂, no los 14).
  const eTransfer = ec => MB.redox(sinCoefs(sinEstado(ec))).electrones;
  // Electrones por unidad de A al pasar a B, con el elemento que cambia (el motor da los EO).
  function porUnidad(A, B, el) {
    const ea = MB.oxidacion(A).porElemento[el], eb = MB.oxidacion(B).porElemento[el], n = MB.especie(A).atomos[el];
    return { n, ea, eb, salto: Math.abs(ea - eb), e: n * Math.abs(ea - eb), gana: eb < ea, carga: MB.especie(A).carga };
  }
  // Ejemplos de la idea 5. Revisado aparte (verif/todas.js y verif/idea5.js): cada ecuación cuadra, los coeficientes son los
  // del motor (balance por álgebra) y los electrones por fórmula salen de sus EO. Letras correctas de nivel 3: A, D, B, E, C.
  const EJEMPLOS_EO = [
    { nivel: 1, titulo: 'Aluminio que se oxida', enunciado: '¿Cuántos electrones pierde un átomo de aluminio al pasar de Al a Al³⁺?', datos: [D_SALTO],
      solucion: [{ texto: 'Cambia un solo átomo, y su EO sube de 0 a +3.', ecuacion: ['1 × 3 = ', ELc('3')] }], respuesta: [ELc('3 electrones')] },
    { nivel: 1, titulo: 'Cloro que se reduce', enunciado: '¿Cuántos electrones gana una molécula de Cl₂ al pasar a dos Cl⁻?', datos: [D_SALTO],
      solucion: [{ texto: 'Dos átomos de cloro cambian, cada uno de 0 a −1.', ecuacion: ['2 × 1 = ', ELc('2')] }], respuesta: [ELc('2 electrones')] },
    { nivel: 1, titulo: 'El permanganato', enunciado: '¿Cuántos electrones gana un MnO₄⁻ al pasar a Mn²⁺?', datos: [D_SALTO, 'EO del Mn: +7 en MnO₄⁻ y +2 en Mn²⁺'],
      solucion: [{ texto: 'Cambia un solo Mn, de +7 a +2, así que baja 5.', ecuacion: ['1 × 5 = ', ELc('5')] }], respuesta: [ELc('5 electrones')] },
    { nivel: 1, titulo: 'El dicromato', enunciado: '¿Cuántos electrones gana un Cr₂O₇²⁻ al pasar a dos Cr³⁺?', datos: [D_SALTO, 'EO del Cr: +6 en Cr₂O₇²⁻ y +3 en Cr³⁺'],
      solucion: [{ texto: 'Cambian los dos Cr, cada uno de +6 a +3.', ecuacion: ['2 × 3 = ', ELc('6')] }], respuesta: [ELc('6 electrones')] },
    { nivel: 1, titulo: 'Sodio y cloro', enunciado: 'Cada Na pierde 1 electrón y cada Cl₂ gana 2. ¿Cuántos Na hacen falta por cada Cl₂?', datos: [D_IGUAL],
      solucion: [{ texto: 'Para dar los 2 electrones que toma un Cl₂ hacen falta 2 Na.', ecuacion: [COEF(2), ' Na + Cl₂ → ', COEF(2), ' NaCl'] }], respuesta: [COEF('2'), ' Na'] },
    { nivel: 2, titulo: 'Zinc y plata', enunciado: 'Balancea con los electrones: Zn + AgNO₃ → Zn(NO₃)₂ + Ag.', datos: [D_SALTO, D_IGUAL],
      solucion: [{ texto: 'El Zn va de 0 a +2 y pierde 2 electrones; la Ag va de +1 a 0 y gana 1.' }, { texto: 'Por cada Zn hacen falta 2 Ag⁺, y con eso el nitrato también cuadra.', ecuacion: ecCoefs('Zn + AgNO3 -> Zn(NO3)2 + Ag', [1, 2, 1, 2]) }],
      respuesta: [...ecCoefs('Zn + AgNO3 -> Zn(NO3)2 + Ag', [1, 2, 1, 2])] },
    { nivel: 2, titulo: 'Aluminio y cloro', enunciado: 'Balancea con los electrones: Al + Cl₂ → AlCl₃.', datos: [D_SALTO, D_IGUAL],
      solucion: [{ texto: 'Cada Al pierde 3 electrones y cada Cl₂ gana 2; el menor múltiplo común de 3 y 2 es 6.' }, { texto: 'Así, 2 Al pierden 6 electrones y 3 Cl₂ ganan 6.', ecuacion: ecCoefs('Al + Cl2 -> AlCl3', [2, 3, 2]) }],
      respuesta: [...ecCoefs('Al + Cl2 -> AlCl3', [2, 3, 2])] },
    { nivel: 2, titulo: 'Plomo y amoníaco', enunciado: 'Balancea con los electrones: PbO + NH₃ → Pb + N₂ + H₂O.', datos: [D_SALTO, D_IGUAL, 'EO del N: −3 en NH₃ y 0 en N₂', 'EO del oxígeno en un óxido: −2'],
      solucion: [{ texto: 'Cada PbO gana 2, porque el Pb va de +2 a 0. El N va de −3 a 0, y un N₂ sale de 2 NH₃, que pierden 6.' }, { texto: 'Con 3 PbO y 2 NH₃ se ganan 6 y se pierden 6; el H y el O se igualan por tanteo.', ecuacion: ecCoefs('PbO + NH3 -> Pb + N2 + H2O', [3, 2, 3, 1, 3]) }],
      respuesta: [...ecCoefs('PbO + NH3 -> Pb + N2 + H2O', [3, 2, 3, 1, 3])] },
    { nivel: 2, titulo: 'Cobre en ácido sulfúrico', enunciado: 'Balancea Cu + H₂SO₄ → CuSO₄ + SO₂ + H₂O.', datos: [D_SALTO, D_IGUAL, 'EO del S: +6 en H₂SO₄ y +4 en SO₂'],
      solucion: [{ texto: 'El Cu pierde 2 electrones y el S que pasa a SO₂ gana 2, así que va un Cu por cada SO₂.' }, { texto: 'Hace falta otro H₂SO₄ que dé el sulfato del CuSO₄, así que van 2.', ecuacion: ecCoefs('Cu + H2SO4 -> CuSO4 + SO2 + H2O', [1, 2, 1, 1, 2]) }],
      respuesta: [...ecCoefs('Cu + H2SO4 -> CuSO4 + SO2 + H2O', [1, 2, 1, 1, 2])] },
    { nivel: 2, titulo: 'Carbón en ácido nítrico', enunciado: 'Balancea C + HNO₃ → CO₂ + NO₂ + H₂O.', datos: [D_SALTO, D_IGUAL, 'EO del N: +5 en HNO₃ y +4 en NO₂'],
      solucion: [{ texto: 'El C va de 0 a +4 y pierde 4; el N va de +5 a +4 y gana 1, así que van 4 HNO₃ por cada C.' }, { texto: 'El H y el O cuadran con 2 H₂O.', ecuacion: ecCoefs('C + HNO3 -> CO2 + NO2 + H2O', [1, 4, 1, 4, 2]) }],
      respuesta: [...ecCoefs('C + HNO3 -> CO2 + NO2 + H2O', [1, 4, 1, 4, 2])] },
    { nivel: 3, titulo: 'Cobre en ácido nítrico', enunciado: 'Balancea Cu + HNO₃ → Cu(NO₃)₂ + NO + H₂O con enteros mínimos. ¿Cuánto suman los coeficientes?', datos: [D_SALTO, D_IGUAL, D_MIN, 'EO del N: +5 en HNO₃ y +2 en NO'],
      alternativas: ['20', '5', '9', '40', '17'],
      solucion: [{ texto: 'El Cu pierde 2 y el N que pasa a NO gana 3; el menor múltiplo común es 6, con 3 Cu y 2 NO.' }, { texto: 'Hacen falta otros 6 HNO₃ para el nitrato del Cu(NO₃)₂, así que van 8, y el agua queda en 4.', ecuacion: ecCoefs('Cu + HNO3 -> Cu(NO3)2 + NO + H2O', [3, 8, 3, 2, 4]) },
        { texto: ['La ', letra('B'), ' suma sin balancear; la ', letra('C'), ' olvida los 6 HNO₃ del nitrato; la ', letra('D'), ' no usa los mínimos, y la ', letra('E'), ' olvida el agua.'] }],
      respuesta: [letra('A'), ', ', COEF('20')] },
    { nivel: 3, titulo: 'Permanganato y ácido', enunciado: 'Balancea KMnO₄ + HCl → KCl + MnCl₂ + Cl₂ + H₂O. ¿Cuál es el coeficiente del HCl?', datos: [D_SALTO, D_IGUAL, D_MIN, 'EO del Mn: +7 en KMnO₄ y +2 en MnCl₂'],
      alternativas: ['10', '5', '8', '16', '2'],
      solucion: [{ texto: 'El Mn gana 5, y cada Cl₂ sale de 2 Cl⁻ que pierden 2; el menor múltiplo común es 10, con 2 KMnO₄ y 5 Cl₂.' }, { texto: 'Del HCl, 10 se oxidan y 6 quedan como cloruro en el KCl y el MnCl₂: van 16.', ecuacion: ecCoefs('KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O', [2, 16, 2, 2, 5, 8]) },
        { texto: ['La ', letra('A'), ' cuenta solo el HCl que se oxida, y la ', letra('B'), ', la ', letra('C'), ' y la ', letra('E'), ' son los coeficientes del Cl₂, del agua y del KMnO₄.'] }],
      respuesta: [letra('D'), ', ', COEF('16')] },
    { nivel: 3, titulo: 'Una dismutación', enunciado: 'En 3 Cl₂ + 6 KOH → 5 KCl + KClO₃ + 3 H₂O, ¿qué afirmación es correcta?', datos: [D_SALTO, D_IGUAL, 'EO del Cl: 0 en Cl₂, −1 en KCl y +5 en KClO₃'],
      alternativas: ['El KOH es el agente oxidante', 'El Cl₂ es a la vez oxidante y reductor', 'Solo el cloro se reduce', 'No es redox: el cloro sigue siendo cloro', 'El K se oxida'],
      solucion: [{ texto: 'El Cl sube de 0 a +5 en el KClO₃ y baja de 0 a −1 en el KCl: el Cl₂ se oxida y se reduce. Es una dismutación.' }, { texto: 'Cinco átomos de Cl bajan 1 cada uno y ganan 5 electrones; un Cl sube 5 y pierde 5.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' cambian EO que no cambian; la ', letra('C'), ' olvida el KClO₃, y la ', letra('D'), ' no ve los saltos.'] }],
      respuesta: [letra('B')] },
    { nivel: 3, titulo: 'Fósforo en ácido nítrico', enunciado: 'Balancea P + HNO₃ + H₂O → H₃PO₄ + NO. ¿Cuánto suman los coeficientes?', datos: [D_SALTO, D_IGUAL, D_MIN, 'EO: P de 0 a +5; N de +5 a +2'],
      alternativas: ['5', '10', '36', '13', '18'],
      solucion: [{ texto: 'El P pierde 5 y el N gana 3; el menor múltiplo común es 15, con 3 P y 5 HNO₃.' }, { texto: 'Con 3 H₃PO₄ y 5 NO, la derecha tiene 9 H y 17 O; la izquierda, 5 H y 15 O. Faltan 4 H y 2 O: son 2 H₂O.' }, { texto: 'Los coeficientes quedan 3, 5, 2, 3 y 5.', ecuacion: ecCoefs('P + HNO3 + H2O -> H3PO4 + NO', [3, 5, 2, 3, 5]) },
        { texto: ['La ', letra('A'), ' suma sin balancear; la ', letra('B'), ' suma solo los reactivos; la ', letra('C'), ' no usa los mínimos, y la ', letra('D'), ' olvida el agua y el H₃PO₄.'] }],
      respuesta: [letra('E'), ', ', COEF('18')] },
    { nivel: 3, titulo: 'Electrones del amoníaco', enunciado: 'En 4 NH₃ + 5 O₂ → 4 NO + 6 H₂O, ¿cuántos electrones se transfieren en total?', datos: [D_SALTO, D_IGUAL, 'EO del N: −3 en NH₃ y +2 en NO'],
      alternativas: ['5', '4', '20', '10', '40'],
      solucion: [{ texto: 'Cada N sube 5 y hay 4 NH₃, que pierden 20; cada O₂ gana 4 y hay 5, que ganan 20.', ecuacion: ['4 × 5 = 5 × 4 = ', ELc('20')] },
        { texto: ['La ', letra('A'), ' cuenta lo de un solo N; la ', letra('B'), ', lo de un solo O₂; la ', letra('D'), ' cuenta la mitad, y la ', letra('E'), ' suma perdidos y ganados.'] }],
      respuesta: [letra('C'), ', ', ELc('20')] },
  ];
  // Así se resuelve y Ahora tú: listas distintas, sin el Cu + AgNO₃ (juego), el Fe₂O₃ (Predice y Mira) ni los casos de los
  // ejemplos. Los coeficientes y los electrones los da el motor.
  const RES5 = ['Fe + Cl2 -> FeCl3', 'Al + Br2 -> AlBr3', 'Li + N2 -> Li3N', 'Ca + O2 -> CaO', 'Al + CuSO4 -> Al2(SO4)3 + Cu'];
  const PU5 = [['K2Cr2O7', 'CrCl3', 'Cr'], ['Cu2O', 'Cu', 'Cu'], ['N2H4', 'N2', 'N'], ['P4', 'H3PO4', 'P'], ['C2O4^2-', 'CO2', 'C'], ['H2O2', 'H2O', 'O'], ['MnO2', 'Mn^2+', 'Mn'], ['ClO3^-', 'Cl^-', 'Cl']];
  // [ecuación, se pide el oxidante]: el agente que se pide actúa entero (ninguna parte queda sin cambiar de EO).
  const CO5 = [['NH3 + O2 -> NO + H2O', false], ['H2S + HNO3 -> S + NO + H2O', true], ['K2Cr2O7 + HCl -> KCl + CrCl3 + Cl2 + H2O', true], ['Al + S -> Al2S3', true],
    ['Na + H2O -> NaOH + H2', false], ['H2S + HNO3 -> S + NO + H2O', false], ['NH3 + O2 -> NO + H2O', true], ['Al + S -> Al2S3', false]];
  const SU5 = ['Ag + HNO3 -> AgNO3 + NO + H2O', 'Zn + HNO3 -> Zn(NO3)2 + NH4NO3 + H2O', 'MnO2 + HCl -> MnCl2 + Cl2 + H2O', 'Cu + HNO3 -> Cu(NO3)2 + NO2 + H2O', 'Al + HNO3 -> Al(NO3)3 + NO + H2O'];
  const DI5 = ['Cl2 + 2 NaOH -> NaCl + NaClO + H2O', '3 NO2 + H2O -> 2 HNO3 + NO', '4 KClO3 -> 3 KClO4 + KCl', 'Cu2O + H2SO4 -> Cu + CuSO4 + H2O', '3 Br2 + 6 NaOH -> 5 NaBr + NaBrO3 + 3 H2O'];
  const eoS = (A, el) => sg(MB.oxidacion(A).porElemento[el]);
  function casoPorUnidad([A, B, el]) {
    const p = porUnidad(A, B, el), FA = bonita(A), FB = bonita(B);
    const ops = [{ id: 'c', texto: String(p.e), correcta: true }];
    const gp = p.gana ? 'gana' : 'pierde';
    for (const [id, v, err, sf] of [['uno', p.salto, 'S-IGN', `El salto de un ${el} sí es ${p.salto}, pero en el ${FA} cambian ${p.n} átomos de ${el}, y cada uno cuenta.`],
      ['suma', p.salto + p.n, 'S-SUM', `Hay que usar el salto y los átomos, pero se multiplican y no se suman: ${p.n} × ${p.salto}.`],
      ['carga', Math.abs(p.carga), 'N-CAR', `La carga del ${FA} no cuenta los electrones que pasan; esos salen del EO del ${el}, que cambia en cada átomo.`],
      ['atomos', p.n, 'S-IGN', `Contaste bien los átomos de ${el}, pero cada uno ${gp} ${p.salto} electrones, no uno solo.`]]) {
      if (!ops.some(o => o.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `¿Cuántos electrones ${p.gana ? 'gana' : 'pierde'} una unidad de ${FA} al pasar a ${FB}?`, datos: [D_SALTO, `EO del ${el}: ${eoS(A, el)} en ${FA} y ${eoS(B, el)} en ${FB}`], opciones: ops,
      solucion: { texto: p.n === 1 ? `Cambia un solo átomo de ${el}, que ${gp} ${p.salto} electrones.` : `Cambian ${p.n} átomos de ${el}, y cada uno ${gp} ${p.salto === 1 ? 'un electrón' : `${p.salto} electrones`}.`, ecuacion: [`${p.n} × ${p.salto} = `, ELc(p.e)] } };
  }
  function casoCoefAgente(ec, pideOx) {
    const base = sinCoefs(ec), cs = bal(base), R = rx5(base), fs = [...MB.ecuacion(base).reactivos, ...MB.ecuacion(base).productos].map(t => t.f);
    const quien = pideOx ? R.agenteOxidante[0] : R.agenteReductor[0], otro = pideOx ? R.agenteReductor[0] : R.agenteOxidante[0];
    const bien = cs[fs.indexOf(quien)], vOtro = cs[fs.indexOf(otro)], eU = R.electronesPorUnidad[quien];
    const ops = [{ id: 'c', texto: String(bien), correcta: true }];
    for (const [id, v, err, sf] of [['cruce', vOtro, 'QM-AGENTE', `Ese es el coeficiente del ${bonita(otro)}, que es el agente ${pideOx ? 'reductor' : 'oxidante'}; se pide el del otro agente.`],
      ['eU', eU, 'QM-SIN-IGUALAR', `Un ${bonita(quien)} ${pideOx ? 'gana' : 'pierde'} ${eU === 1 ? 'un electrón' : `${eU} electrones`}, pero eso no es su coeficiente: el coeficiente sale al igualar perdidos y ganados.`],
      ['total', eTransfer(base), 'QM-SIN-IGUALAR', `Esos ${eTransfer(base)} son los electrones transferidos en total, pero ese número no es un coeficiente: es lo que se iguala.`],
      ['doble', 2 * bien, 'H-MIN', `Con ${2 * bien} la ecuación cuadra, pero no con los enteros más pequeños: es el doble.`]]) {
      if (v && !ops.some(o => o.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `Balancea ${ecTxt(base)} con los electrones. ¿Cuál es el coeficiente del agente ${pideOx ? 'oxidante' : 'reductor'}?`, datos: [D_SALTO, D_IGUAL, ...D_EO], opciones: ops,
      solucion: { texto: `Se transfieren ${eTransfer(base)} electrones, y el agente ${pideOx ? 'oxidante' : 'reductor'} es el ${bonita(quien)}; su coeficiente se lee en la ecuación balanceada.`, ecuacion: ecCoefs(base, cs) } };
  }
  function casoSuma5(ec) {
    const base = sinCoefs(ec), cs = bal(base), s = sumaDe(cs);
    const ops = [{ id: 'c', texto: String(s), correcta: true }];
    for (const [id, v, err, sf] of [['sinbal', cs.length, 'QM-SUMA-SIN-BALANCE', 'Ese número sale si se suman los coeficientes sin balancear, cuando todos valen 1; primero hay que igualar los electrones.'],
      ['doble', 2 * s, 'H-MIN', `Una suma de ${2 * s} sale con coeficientes que cuadran, pero que no son los enteros más pequeños: es el doble de la suma mínima.`],
      ['reac', sumaDe(cs.slice(0, MB.ecuacion(base).reactivos.length)), 'ES12', 'Los coeficientes están bien, pero esa es solo la suma de los reactivos: faltan los de los productos.'],
      ['mas', s + 1, 'ES12', `Con coeficientes que sumen ${s + 1}, algún elemento no queda igual a los dos lados.`]]) {
      if (!ops.some(o => o.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    return { pregunta: `Balancea ${ecTxt(base)} con los enteros más pequeños. ¿Cuánto suman los coeficientes?`, datos: [D_SALTO, D_IGUAL, D_MIN, ...D_EO], opciones: ops,
      solucion: { texto: `Se igualan ${eTransfer(base)} electrones, y los coeficientes ${listaY(cs.map(String))} suman ${s}.`, ecuacion: ecCoefs(base, cs) } };
  }
  function casoDismuta(ec) {
    const R = rx5(ec), el = R.seOxida[0], est = R.estados[el], a = est.izq[0], sube = Math.max(...est.der), baja = Math.min(...est.der);
    return { pregunta: `En ${ecTxt(ec)}, ¿qué le pasa al ${el}?`, datos: [D_REDOX, `EO del ${el}: ${sg(a)} en los reactivos; ${sg(baja)} y ${sg(sube)} en los productos`],
      opciones: [
        { id: 'c', texto: 'Se oxida y se reduce a la vez: dismutación', correcta: true },
        { id: 'ox', texto: 'Solo se oxida', error: 'S-IGN', siFuera: `Es cierto que parte del ${el} sube a ${sg(sube)}, pero otra parte baja a ${sg(baja)}: también se reduce.` },
        { id: 'red', texto: 'Solo se reduce', error: 'S-IGN', siFuera: `Es cierto que parte del ${el} baja a ${sg(baja)}, pero otra parte sube a ${sg(sube)}: también se oxida.` },
        { id: 'no', texto: 'Nada: no es redox porque ningún otro elemento cambia', error: 'QM-NO-REDOX', siFuera: `Es cierto que solo cambia el ${el}, pero basta con que cambie un EO: el ${el} sube y baja, y eso es redox.` },
      ],
      solucion: { texto: `En los reactivos, el ${el} tiene EO ${sg(a)}; en los productos, una parte sube a ${sg(sube)} y otra baja a ${sg(baja)}.`, ecuacion: [`${el}: ${sg(baja)} ← ${sg(a)} → ${sg(sube)}`] } };
  }

  const cambioEO = {
    id: 'cambio-eo',
    titulo: 'Electrones perdidos, electrones ganados',
    pregunta: '¿Cómo se usan los electrones para balancear una redox?',
    temas: ['Balance redox por ion-electrón'],
    pieza: 'quim-reaccion',
    aprendizaje: 'Los electrones de una fórmula son sus átomos que cambian por su salto de EO; se multiplica hasta que los perdidos sean los ganados.',
    actividad: 'Cambiar cuántos Cu y cuántos AgNO₃ hay hasta que los electrones cuadren.',
    lee: {
      tarjetas: [
        { titulo: 'El árbol de plata', texto: 'Un alambre de cobre en una solución de nitrato de plata se cubre de cristales de plata, y la solución se pone celeste: el cobre pasa a la solución como Cu²⁺.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'plata', nombre: 'El árbol de plata' }, estado: {} } },
        { titulo: 'Electrones de un átomo', texto: 'Un átomo que cambia de EO pierde o gana tantos electrones como cambia su EO. El cobre, de 0 a +2, pierde 2; la plata, de +1 a 0, gana 1.' },
        { titulo: 'Ninguno suelto', texto: 'En una reacción no quedan electrones sueltos: todos los que pierde el reductor los gana el oxidante.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cambia cuántos átomos de cobre y cuántos de AgNO₃ hay, y compara los electrones que pierde el cobre con los que gana la plata.' },
      ],
    },
    ejemplos: EJEMPLOS_EO,
    juega: {
      consigna: 'El árbol de plata, contado: cada Cu pierde 2 electrones y cada Ag⁺ gana 1; el nitrato no cambia. Tú eliges cuántos hay.',
      mision: { texto: 'Haz que el cobre pierda tantos electrones como gana la plata, con lo mínimo.', logrado: v => v.cu === 1 && v.ag === 2,
        bien: 'Listo: un Cu pierde 2 y dos Ag⁺ ganan 2. Ningún electrón queda suelto.' },
      voz: 'Compara las dos cuentas de electrones, no los átomos.',
      leyenda: [{ s: COEF('1'), t: 'coeficiente: cuántos de cada uno' }, { s: ELc('e⁻'), t: 'electrones que pasan' }, { s: '✓', t: 'perdidos igual a ganados' }, { s: '≠', t: 'todavía no cuadran' }],
      controles: [
        { id: 'cu', etiqueta: 'Cu', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'ag', etiqueta: 'Ag⁺', color: 'c-f', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => AG5(v.cu, v.ag),
      lectura: v => [`${v.cu} Cu ${v.cu === 1 ? 'pierde' : 'pierden'} ${2 * v.cu} e⁻ ${2 * v.cu === v.ag ? '=' : '≠'} ${v.ag} e⁻ que ${v.ag === 1 ? 'gana' : 'ganan'} ${v.ag} Ag⁺`],
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: 'En el alto horno, el Fe₂O₃ pasa a hierro, Fe. ¿Cuántos electrones gana una unidad de Fe₂O₃?',
      datos: ['EO del hierro: +3 en Fe₂O₃ y 0 en Fe'],
      voz: 'Mira la fórmula entera, no solo el símbolo del hierro.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'uno', texto: '3', error: 'S-IGN', siFuera: 'El salto de un hierro sí es de 3, de +3 a 0, pero el Fe₂O₃ tiene dos hierros y cada uno gana 3.' },
        { id: 'suma', texto: '5', error: 'S-SUM', siFuera: 'Hay que usar el salto y el subíndice, pero se multiplican y no se suman: son 2 hierros que ganan 3 cada uno.' },
        { id: 'cero', texto: '0, porque el Fe₂O₃ es neutro', error: 'N-CAR', siFuera: 'Es cierto que el Fe₂O₃ es neutro, pero los electrones no salen de su carga total: salen del EO de cada hierro, que baja.' },
      ],
      dibujo: rectaEO([{ tipo: 'salto', a: 3, b: 0, color: 'o', rotulo: 'Fe: +3 → 0', fila: 1 }]),
      revelar: rectaEO([{ tipo: 'salto', a: 3, b: 0, color: 'o', rotulo: 'primer Fe: 3 e⁻', fila: 1 }, { tipo: 'salto', a: 3, b: 0, color: 'o', rotulo: 'segundo Fe: 3 e⁻', fila: 2 }]),
      coincide: 'Coincide: los dos hierros bajan 3 cada uno: 2 × 3 = 6 electrones.',
      noCoincide: 'El Fe₂O₃ tiene dos hierros y cada uno gana 3: 2 × 3 = 6 electrones.',
    },
    mira: {
      datos: { vista: 'inventario', cabeza: ['gana el Fe₂O₃', 'pierde el CO'], ecuacion: 'Fe₂O₃ + CO → Fe + CO₂',
        filas: [{ et: 'por unidad', izq: [ELc('6')], der: [ELc('2')], desde: 1 }, { et: 'unidades', izq: [COEF('1')], der: [COEF('3')], desde: 2 }, { et: 'e⁻ total', izq: [ELc('6')], der: [ELc('6')], igual: true, desde: 3 }],
        alt: 'Inventario de Fe₂O₃ + CO: cada Fe₂O₃ gana 6 electrones y cada CO pierde 2; con 1 Fe₂O₃ y 3 CO, 6 y 6.' },
      voz: 'Primero por unidad; después, cuántas unidades.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada Fe₂O₃ gana 6 electrones, y cada CO pierde 2, porque su C sube de +2 a +4.', ecuacion: ['2 × 3 = ', ELc('6'), SEP, '1 × 2 = ', ELc('2')] },
        { estado: { corte: 2 }, texto: 'Para dar los 6 electrones que gana un Fe₂O₃ hacen falta 3 CO.', ecuacion: ['Fe₂O₃ + ', COEF(3), ' CO'] },
        { estado: { corte: 3 }, texto: 'Así, los electrones ganados son tantos como los perdidos: 6 y 6.' },
        { estado: { corte: 3 }, texto: 'El resto se iguala por tanteo, y van 2 Fe y 3 CO₂.', ecuacion: ecCoefs('Fe2O3 + CO -> Fe + CO2', [1, 3, 2, 3]) },
      ],
    },
    regla: {
      texto: 'Los electrones que gana o pierde una fórmula se cuentan multiplicando los átomos que cambian por el salto de EO de cada uno. Cada especie se multiplica hasta que los electrones perdidos igualen a los ganados, y lo demás se iguala por tanteo.',
      ecuacion: ['electrones = átomos que cambian × salto de EO'],
      condicion: 'al final cuadran todos los elementos, también los que no cambian de EO. También vale si un mismo elemento sube y baja a la vez: es una dismutación.',
      voz: 'Ningún electrón queda suelto.',
    },
    resuelve: {
      generar(s) {
        const base = RES5[idx(s, RES5.length)], cs = bal(base), R = rx5(base), fs = [...MB.ecuacion(base).reactivos, ...MB.ecuacion(base).productos].map(t => t.f);
        const red = R.agenteReductor[0], ox = R.agenteOxidante[0], eR = R.electronesPorUnidad[red], eO = R.electronesPorUnidad[ox];
        return { enunciado: `Balancea ${ecTxt(base)} con los electrones. ¿Cuál es el coeficiente del agente reductor?`, datos: [D_SALTO, D_IGUAL, ...D_EO],
          pasos: [
            { tipo: 'pide', texto: 'Se pide el coeficiente del reactivo que se oxida, en la ecuación balanceada con los enteros más pequeños.' },
            { tipo: 'datos', texto: `${capi(eoVa(base, R.seOxida[0]))}, así que se oxida; ${eoVa(base, R.seReduce[0])}, así que se reduce.` },
            { tipo: 'regla', texto: 'Los electrones de una fórmula se cuentan multiplicando los átomos que cambian por su salto de EO; cada especie se multiplica hasta que los perdidos igualen a los ganados.' },
            { tipo: 'cuentas', texto: `Cada ${bonita(red)} pierde ${eR === 1 ? 'un electrón' : `${eR} electrones`} y cada ${bonita(ox)} gana ${eO}; con ${cs[fs.indexOf(red)]} ${bonita(red)} y ${cs[fs.indexOf(ox)]} ${bonita(ox)}, se pierden ${eTransfer(base)} y se ganan ${eTransfer(base)}.`, ecuacion: ecCoefs(base, cs) },
            { tipo: 'sentido', texto: `Al final se revisan todos los elementos, a la izquierda y a la derecha: ${cuentaTxt(cs, base)}.` },
          ],
          respuesta: ['Coeficiente del ', bonita(red), ': ', COEF(cs[fs.indexOf(red)])] };
      },
    },
    ahoraTu: {
      voz: 'Cuenta los átomos que cambian; después iguala.',
      generar(s) {
        const tipo = ['porUnidad', 'coef', 'suma', 'dismuta'][idx(s, 4)], k = Math.floor(s / 4);
        if (tipo === 'porUnidad') return casoPorUnidad(PU5[idx(k, PU5.length)]);
        if (tipo === 'coef') return casoCoefAgente(...CO5[idx(k, CO5.length)]);
        if (tipo === 'suma') return casoSuma5(SU5[idx(k, SU5.length)]);
        return casoDismuta(DI5[idx(k, DI5.length)]);
      },
    },
  };


  // ---------- Idea 6 (rehecha, 26 nov): ion-electrón en medio ácido y básico ----------
  // Propuesta §3 idea 6. Objeto de la primera pantalla: el frasco de permanganato de potasio (quim-reaccion).
  // Cambia: cuántos H₂O, H⁺ y e⁻ se escriben · Permanece: MnO₄⁻ a la izquierda y Mn²⁺ a la derecha · Progresa: O, después
  // H, después la carga · Se reserva: el nitrato que pasa a NO (Predice: el producto también tiene O) · Debe verse: la
  // cuenta de O, H y carga de cada lado. Coeficientes violeta, electrones turquesa, carga carmín.
  // Errores: W-CAR (el agua arregla la carga), QM-AGUA-TODO (un H₂O por cada O del oxoanión), QM-AGUA-LADO (el agua del
  // lado equivocado), QM-ION-E (electrones del lado equivocado o iguales a la carga de un lado), EC11 (la carga no se
  // conserva al sumar), H-MED (dejar H⁺ en medio básico), QM-SIN-IGUALAR, QM-SUMA-SIN-BALANCE.
  const sgC = q => (q > 0 ? `+${q}` : q < 0 ? `−${-q}` : '0');
  // Una lista [[coef, especie]] del motor en fichas: H⁺, OH⁻ y H₂O con su coeficiente en violeta; los e⁻ en turquesa.
  function terminosF(lista) {
    const out = [];
    lista.forEach(([c, f], i) => {
      if (i) out.push(' + ');
      if (f === 'e^-') out.push(ELc(c === 1 ? 'e⁻' : `${c} e⁻`));
      else { if (c !== 1) out.push(COEF(c), ' '); out.push(bonita(f)); }
    });
    return out;
  }
  const semiF = r => [...terminosF(r.izq), ' → ', ...terminosF(r.der)];
  const cargaDe = lista => lista.reduce((s, [c, f]) => s + c * MB.especie(f).carga, 0);
  const semiM = (A, B, m) => MB.semirreaccion(A, B, m);
  function permanganato(w, h, e) {
    const qi = -1 + h - e;
    return { pieza: 'quim-reaccion', datos: { vista: 'inventario',
      ecuacion: ['MnO₄⁻ + ', COEF(h), ' H⁺ + ', ELc(`${e} e⁻`), ' → Mn²⁺ + ', COEF(w), ' H₂O'],
      filas: [{ et: 'O', izq: '4', der: String(w), igual: w === 4 }, { et: 'H', izq: String(h), der: String(2 * w), igual: h === 2 * w },
        { et: 'carga', colorEt: 'h', izq: [CARGA(sgC(qi))], der: [CARGA('+2')], igual: qi === 2 }],
      alt: `MnO₄⁻ + ${h} H⁺ + ${e} e⁻ → Mn²⁺ + ${w} H₂O. O: 4 y ${w}; H: ${h} y ${2 * w}; carga: ${sgC(qi)} y +2.` }, estado: {} };
  }
  const lectura6 = v => { const qi = -1 + v.h - v.e, fila = (n, a, b, t = String) => `${n}: ${t(a)} ${a === b ? '=' : '≠'} ${t(b)}`;
    return [fila('O', 4, v.w), SEP, fila('H', v.h, 2 * v.w), SEP, fila('carga', qi, 2, sgC)]; };
  const D_ACIDO = ['Medio ácido: el O se iguala con H₂O, el H con H⁺ y la carga con e⁻', 'Carga de un lado: la suma de coeficiente × carga de cada especie'];
  const D_BASICO = 'Medio básico: a cada lado se suman tantos OH⁻ como H⁺ haya; H⁺ + OH⁻ forman H₂O';
  const D_SUMAR = 'Las dos semirreacciones se multiplican hasta tener los mismos electrones y se suman';

  // Ejemplos de la idea 6. Revisado aparte (verif/todas.js y verif/idea6.js): cada semirreacción y cada ecuación cuadra
  // en átomos y en carga (conteo propio) y coincide con el motor (semirreaccion, ionElectron). Letras correctas de nivel
  // 3: B, E, A, D, C.
  const sm = (A, B, m = 'acido') => semiF(semiM(A, B, m));
  const EJEMPLOS_IE = [
    { nivel: 1, titulo: 'La carga de un lado', enunciado: '¿Cuál es la carga total de Cr₂O₇²⁻ + 14 H⁺?', datos: [D_ACIDO[1]],
      solucion: [{ texto: 'El dicromato aporta −2 y los 14 H⁺, +14.', ecuacion: ['−2 + 14 = ', CARGA('+12')] }], respuesta: [CARGA('+12')] },
    { nivel: 1, titulo: 'El agua del sulfato', enunciado: 'En medio ácido, SO₄²⁻ → SO₂. ¿Cuántas moléculas de agua van y de qué lado?', datos: [D_ACIDO[0]],
      solucion: [{ texto: 'El S ya cuadra; a la izquierda hay 4 O y a la derecha 2, así que faltan 2 O a la derecha y van como agua.', ecuacion: ['SO₄²⁻ → SO₂ + ', COEF(2), ' H₂O'] }], respuesta: [COEF('2'), ' H₂O a la derecha'] },
    { nivel: 1, titulo: 'El hidrógeno', enunciado: 'En medio ácido, ClO₃⁻ → Cl⁻ + 3 H₂O. ¿Cuántos H⁺ van a la izquierda?', datos: [D_ACIDO[0]],
      solucion: [{ texto: 'Las 3 aguas traen 6 H, así que se ponen 6 H⁺ a la izquierda. La carga todavía no cuadra: faltan los electrones.', ecuacion: ['ClO₃⁻ + ', COEF(6), ' H⁺ → Cl⁻ + 3 H₂O'] }], respuesta: [COEF('6'), ' H⁺'] },
    { nivel: 1, titulo: 'Los electrones', enunciado: 'En Cr₂O₇²⁻ + 14 H⁺ → 2 Cr³⁺ + 7 H₂O, ¿cuántos electrones van a la izquierda?', datos: D_ACIDO,
      solucion: [{ texto: 'La carga es −2 + 14 = +12 a la izquierda y 2 × 3 = +6 a la derecha.' }, { texto: 'A la izquierda sobran 6 cargas positivas, así que van 6 e⁻ a ese lado.', ecuacion: sm('Cr2O7^2-', 'Cr^3+') }], respuesta: [ELc('6 e⁻')] },
    { nivel: 1, titulo: 'Sin oxígeno', enunciado: 'Balancea 2 Cl⁻ → Cl₂ con electrones.', datos: D_ACIDO,
      solucion: [{ texto: 'Los átomos ya cuadran; la carga es −2 a la izquierda y 0 a la derecha, así que van 2 e⁻ a la derecha.', ecuacion: sm('Cl^-', 'Cl2') }], respuesta: [...sm('Cl^-', 'Cl2')] },
    { nivel: 2, titulo: 'El clorato', enunciado: 'Balancea en medio ácido: ClO₃⁻ → Cl⁻.', datos: D_ACIDO,
      solucion: [{ texto: 'Los 3 O del clorato piden 3 H₂O a la derecha, y esas aguas piden 6 H⁺ a la izquierda.' }, { texto: 'La carga es −1 + 6 = +5 a la izquierda y −1 a la derecha, así que van 6 e⁻ a la izquierda.', ecuacion: sm('ClO3^-', 'Cl^-') }], respuesta: [...sm('ClO3^-', 'Cl^-')] },
    { nivel: 2, titulo: 'Nitrato a amonio', enunciado: 'Balancea en medio ácido: NO₃⁻ → NH₄⁺.', datos: D_ACIDO,
      solucion: [{ texto: 'Los 3 O piden 3 H₂O a la derecha; con los 4 H del amonio, a la derecha hay 6 + 4 = 10 H, que piden 10 H⁺ a la izquierda.' }, { texto: 'La carga es −1 + 10 = +9 a la izquierda y +1 a la derecha, así que van 8 e⁻ a la izquierda.', ecuacion: sm('NO3^-', 'NH4^+') }], respuesta: [...sm('NO3^-', 'NH4^+')] },
    { nivel: 2, titulo: 'Una oxidación', enunciado: 'Balancea en medio ácido: SO₂ → SO₄²⁻.', datos: D_ACIDO,
      solucion: [{ texto: 'El SO₄²⁻ tiene 2 O más que el SO₂: faltan 2 O a la izquierda, así que van 2 H₂O a la izquierda, y sus 4 H piden 4 H⁺ a la derecha.' }, { texto: 'La carga es 0 a la izquierda y −2 + 4 = +2 a la derecha, así que van 2 e⁻ a la derecha: es una oxidación.', ecuacion: sm('SO2', 'SO4^2-') }], respuesta: [...sm('SO2', 'SO4^2-')] },
    { nivel: 2, titulo: 'Paso al medio básico', enunciado: 'En ácido, ClO⁻ + 2 H⁺ + 2 e⁻ → Cl⁻ + H₂O. ¿Cómo queda en medio básico?', datos: [D_BASICO],
      solucion: [{ texto: 'Se suman 2 OH⁻ a cada lado, y los 2 H⁺ con los 2 OH⁻ forman 2 H₂O.' }, { texto: 'Queda agua a los dos lados, así que se cancela una molécula de cada lado.', ecuacion: sm('ClO^-', 'Cl^-', 'basico') }], respuesta: [...sm('ClO^-', 'Cl^-', 'basico')] },
    { nivel: 2, titulo: 'Sumar dos mitades', enunciado: 'Suma Fe²⁺ → Fe³⁺ + e⁻ con MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O.', datos: [D_SUMAR],
      solucion: [{ texto: 'El hierro da 1 electrón y el manganeso toma 5, así que la semirreacción del hierro se multiplica por 5.' }, { texto: 'Al sumar las dos semirreacciones, los electrones se cancelan.', ecuacion: semiF(MB.ionElectron(['Fe^2+', 'Fe^3+'], ['MnO4^-', 'Mn^2+'], 'acido')) }],
      respuesta: [...semiF(MB.ionElectron(['Fe^2+', 'Fe^3+'], ['MnO4^-', 'Mn^2+'], 'acido'))] },
    { nivel: 3, titulo: 'Hierro y dicromato', enunciado: 'Balancea en medio ácido Fe²⁺ + Cr₂O₇²⁻ → Fe³⁺ + Cr³⁺. ¿Cuánto suman los coeficientes?', datos: [...D_ACIDO, D_SUMAR],
      alternativas: ['26', '36', '30', '72', '35'],
      solucion: [{ texto: 'Fe²⁺ da 1 e⁻; Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O. Para igualar los 6 electrones, la del hierro se multiplica por 6.' }, { texto: '1 + 6 + 14 + 2 + 6 + 7 = 36.', ecuacion: semiF(MB.ionElectron(['Fe^2+', 'Fe^3+'], ['Cr2O7^2-', 'Cr^3+'], 'acido')) },
        { texto: ['La ', letra('A'), ' no iguala los electrones; la ', letra('C'), ' cuenta 3 electrones por cromo y no 6 por dicromato; la ', letra('D'), ' no usa los mínimos, y la ', letra('E'), ' olvida el 1 del Cr₂O₇²⁻.'] }],
      respuesta: [letra('B'), ', ', COEF('36')] },
    { nivel: 3, titulo: 'Oxalato y permanganato', enunciado: 'En medio ácido, C₂O₄²⁻ + MnO₄⁻ → CO₂ + Mn²⁺. Con enteros mínimos, ¿cuál es el coeficiente del H⁺?', datos: [...D_ACIDO, D_SUMAR],
      alternativas: ['8', '2', '5', '10', '16'],
      solucion: [{ texto: 'C₂O₄²⁻ → 2 CO₂ + 2 e⁻; MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O. Se igualan 10 electrones: la del oxalato se multiplica por 5 y la del manganeso por 2.' }, { texto: 'Los 8 H⁺ de la del manganeso, por 2, dan 8 × 2 = 16 H⁺.', ecuacion: semiF(MB.ionElectron(['C2O4^2-', 'CO2'], ['MnO4^-', 'Mn^2+'], 'acido')) },
        { texto: ['La ', letra('A'), ' no multiplica la del manganeso, y la ', letra('B'), ', la ', letra('C'), ' y la ', letra('D'), ' son los coeficientes del MnO₄⁻, del oxalato y del CO₂.'] }],
      respuesta: [letra('E'), ', ', COEF('16')] },
    { nivel: 3, titulo: 'En medio básico', enunciado: 'En medio básico, MnO₄⁻ + SO₃²⁻ → MnO₂ + SO₄²⁻. Con enteros mínimos, ¿cuántos OH⁻ quedan y de qué lado?', datos: [...D_ACIDO, D_BASICO, D_SUMAR],
      alternativas: ['2 a la derecha', '2 a la izquierda', '8 a la derecha', '1 a la derecha', 'Ninguno: se cancelan'],
      solucion: [{ texto: 'En ácido: 2 MnO₄⁻ + 3 SO₃²⁻ + 2 H⁺ → 2 MnO₂ + 3 SO₄²⁻ + H₂O. Con 2 OH⁻ a cada lado, los 2 H⁺ forman 2 H₂O, y una de ellas se cancela con la de la derecha.' },
        { texto: 'Queda así:', ecuacion: semiF(MB.ionElectron(['SO3^2-', 'SO4^2-'], ['MnO4^-', 'MnO2'], 'basico')) },
        { texto: ['La ', letra('B'), ' los pone donde estaban los H⁺; la ', letra('C'), ' no simplifica; la ', letra('D'), ' da el coeficiente del agua que queda, 1, y no el de los OH⁻, y la ', letra('E'), ' cree que se cancelan.'] }],
      respuesta: [letra('A'), ', 2 OH⁻ a la derecha'] },
    { nivel: 3, titulo: 'Zinc y nitrato', enunciado: 'En medio ácido, Zn + NO₃⁻ → Zn²⁺ + NH₄⁺. ¿Cuál es el coeficiente del zinc?', datos: [...D_ACIDO, D_SUMAR],
      alternativas: ['1', '2', '8', '4', '10'],
      solucion: [{ texto: 'El nitrato: sus 3 O piden 3 H₂O a la derecha; con los 4 H del NH₄⁺, son 10 H, que piden 10 H⁺. La carga, +9 contra +1, pide 8 e⁻ a la izquierda.' }, { texto: 'El zinc: Zn → Zn²⁺ + 2 e⁻. Para dar los 8 electrones hacen falta 4 Zn.' }, { texto: 'Queda así:', ecuacion: semiF(MB.ionElectron(['Zn', 'Zn^2+'], ['NO3^-', 'NH4^+'], 'acido')) },
        { texto: ['La ', letra('A'), ' no iguala electrones; la ', letra('B'), ' copia los electrones de un zinc; la ', letra('C'), ' da los electrones totales, y la ', letra('E'), ' da el coeficiente del H⁺.'] }],
      respuesta: [letra('D'), ', ', COEF('4')] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Sobre Cr₂O₇²⁻ + 3 SO₂ + 2 H⁺ → 2 Cr³⁺ + 3 SO₄²⁻ + H₂O: I. El SO₂ es el reductor. II. La carga es +2 a cada lado. III. Se transfieren 6 electrones.', datos: [...D_ACIDO, 'EO: Cr de +6 a +3; S de +4 a +6'],
      alternativas: ['VVV', 'FVV', 'VFV', 'VVF', 'VFF'],
      solucion: [{ texto: 'El S sube de +4 a +6, así que el SO₂ se oxida y es el reductor (I, V). La carga es −2 + 2 = 0 y 6 − 6 = 0, no +2 (II, F).' }, { texto: 'Dos Cr bajan 3 cada uno, así que pasan 6 electrones (III, V).' },
        { texto: ['La ', letra('A'), ' cree que la carga es +2; la ', letra('D'), ' también, y además cuenta 3 electrones; la ', letra('B'), ' cruza los agentes y también cree que la carga es +2, y la ', letra('E'), ' cuenta 3, los de un solo Cr.'] }],
      respuesta: [letra('C'), ', VFV'] },
  ];
  // Así se resuelve y Ahora tú: listas distintas, sin el permanganato a Mn²⁺ sola (juego), el nitrato a NO (Predice y Mira)
  // ni los casos de los ejemplos. Todo sale del motor (semirreaccion, ionElectron).
  const RES6 = [[['Fe^2+', 'Fe^3+'], ['MnO2', 'Mn^2+']], [['NO2^-', 'NO3^-'], ['MnO4^-', 'Mn^2+']], [['Cl^-', 'Cl2'], ['MnO4^-', 'Mn^2+']], [['Cu', 'Cu^2+'], ['NO3^-', 'NO2']], [['I^-', 'I2'], ['Cr2O7^2-', 'Cr^3+']]];
  const AG6 = [['NO3^-', 'NO2'], ['Cr2O7^2-', 'Cr^3+'], ['IO3^-', 'I2'], ['SO2', 'SO4^2-'], ['NO2^-', 'NO3^-'], ['ClO4^-', 'Cl^-'], ['BrO3^-', 'Br^-']];
  const EL6 = [['ClO4^-', 'Cl^-'], ['NO3^-', 'NO2'], ['IO3^-', 'I2'], ['NO2^-', 'NO3^-'], ['MnO4^-', 'MnO2'], ['BrO3^-', 'Br^-'], ['SO2', 'SO4^2-']];
  const GL6 = [[['Fe^2+', 'Fe^3+'], ['MnO4^-', 'Mn^2+'], 'acido'], [['SO2', 'SO4^2-'], ['MnO4^-', 'Mn^2+'], 'acido'], [['I^-', 'I2'], ['NO3^-', 'NO2'], 'acido'],
    [['Cr(OH)3', 'CrO4^2-'], ['ClO^-', 'Cl^-'], 'basico'], [['I^-', 'I2'], ['MnO4^-', 'MnO2'], 'basico'], [['Fe^2+', 'Fe^3+'], ['ClO3^-', 'Cl^-'], 'acido']];
  const BA6 = [['CrO4^2-', 'Cr(OH)3'], ['Zn', 'Zn(OH)2'], ['ClO3^-', 'Cl^-'], ['NO3^-', 'NH3'], ['SO3^2-', 'SO4^2-'], ['BrO3^-', 'Br^-']];
  const lado = l => (l === 'izq' ? 'la izquierda' : 'la derecha');
  const ladoDe = (r, f) => (r.izq.some(x => x[1] === f) ? 'izq' : r.der.some(x => x[1] === f) ? 'der' : null);
  const coefDe = (r, f) => { const t = [...r.izq, ...r.der].find(x => x[1] === f); return t ? t[0] : 0; };
  function casoAgua([A, B]) {
    const r = semiM(A, B, 'acido'), n = coefDe(r, 'H2O'), l = ladoDe(r, 'H2O'), nA = MB.especie(A).atomos.O || 0, otro = l === 'izq' ? 'der' : 'izq';
    const txt = (k, ld) => `${k} H₂O a ${lado(ld)}`;
    const ops = [{ id: 'c', texto: txt(n, l), correcta: true },
      { id: 'lado', texto: txt(n, otro), error: 'QM-AGUA-LADO', siFuera: `El número, ${n}, está bien, pero el agua se escribe donde faltan O, y aquí faltan a ${lado(l)}.` }];
    if (nA !== n) ops.push({ id: 'todo', texto: txt(nA, l), error: 'QM-AGUA-TODO', siFuera: `El lado está bien, pero el ${bonita(B)} también tiene O, así que ${n === 1 ? 'falta solo 1' : `faltan solo ${n}`} y no uno por cada O.` });
    ops.push({ id: 'carga', texto: 'Ninguna: la diferencia se arregla con electrones', error: 'W-CAR', siFuera: 'Los electrones sí entran en la semirreacción, pero solo igualan la carga; los O que faltan se igualan con agua.' });
    if (ops.length < 4) ops.push({ id: 'mas', texto: txt(n + 1, l), error: 'QM-AGUA-TODO', siFuera: `Con ${n + 1} H₂O sobraría un O a ${lado(l)}.` });
    return { pregunta: `En medio ácido, ${bonita(A)} → ${bonita(B)}. ¿Cuántas moléculas de agua se escriben y de qué lado?`, datos: [D_ACIDO[0]], opciones: ops,
      solucion: { texto: `Se iguala primero el elemento central, y después los O que faltan se ponen como H₂O: ${n} a ${lado(l)}.`, ecuacion: semiF(r) } };
  }
  function casoElectrones([A, B]) {
    const r = semiM(A, B, 'acido'), e = r.electrones, l = r.ladoElectrones, otro = l === 'izq' ? 'der' : 'izq', sinE = { izq: r.izq.filter(x => x[1] !== 'e^-'), der: r.der.filter(x => x[1] !== 'e^-') };
    const qi = cargaDe(sinE.izq), qd = cargaDe(sinE.der), txt = (k, ld) => `${k} e⁻ a ${lado(ld)}`;
    const ops = [{ id: 'c', texto: txt(e, l), correcta: true },
      { id: 'lado', texto: txt(e, otro), error: 'QM-ION-E', siFuera: `El número está bien, pero los electrones van del lado de carga más alta, que aquí es ${lado(l)}, con ${sgC(l === 'izq' ? qi : qd)}.` }];
    for (const [id, v, err, sf] of [['suma', Math.abs(qi + qd), 'EC11', `Hay que mirar las dos cargas, pero se restan y no se suman: ${sgC(qi)} y ${sgC(qd)} difieren en ${e}.`],
      ['cargaIzq', Math.abs(qi), 'QM-ION-E', `Esa es solo la carga de la izquierda; los electrones igualan la diferencia entre los dos lados, que es ${e}.`], ['mas', e + 1, 'EC11', `Con ${e + 1} electrones, la izquierda y la derecha no quedan con la misma carga.`]]) {
      if (v > 0 && v !== e && ops.length < 4 && !ops.some(o => o.texto === txt(v, l))) ops.push({ id, texto: txt(v, l), error: err, siFuera: sf });
    }
    const sinTxt = `${[...terminosF(sinE.izq)].map(x => (typeof x === 'string' ? x : x.t)).join('')} → ${[...terminosF(sinE.der)].map(x => (typeof x === 'string' ? x : x.t)).join('')}`;
    return { pregunta: `En medio ácido: ${sinTxt}. ¿Cuántos electrones faltan y de qué lado?`, datos: D_ACIDO, opciones: ops,
      solucion: { texto: `La carga es ${sgC(qi)} a la izquierda y ${sgC(qd)} a la derecha; la diferencia, ${e}, se iguala con electrones.`, ecuacion: semiF(r) } };
  }
  function casoGlobal([o, red, m]) {
    const x = MB.ionElectron(o, red, m), s = x.suma, ops = [{ id: 'c', texto: String(s), correcta: true }];
    for (const [id, v, err, sf] of [['sinIgualar', x.errores.sinIgualar.suma, 'QM-SIN-IGUALAR', `Cada mitad está bien balanceada, pero si se suman sin igualar los electrones, sobran electrones y los coeficientes suman ${x.errores.sinIgualar.suma}.`],
      ['unos', x.errores.sinContarUnos, 'QM-SUMA-SIN-BALANCE', 'Los coeficientes escritos están bien, pero el 1 que no se escribe también se suma.'],
      ['doble', 2 * s, 'H-MIN', `Una suma de ${2 * s} sale con coeficientes que cuadran, pero que no son los enteros más pequeños: es el doble de la suma mínima.`], ['mas', s + 1, 'EC11', `Con coeficientes que sumen ${s + 1}, algún átomo o la carga no queda igual a los dos lados.`]]) {
      if (Number.isInteger(v) && v > 0 && !ops.some(q => q.texto === String(v)) && ops.length < 4) ops.push({ id, texto: String(v), error: err, siFuera: sf });
    }
    const sinC = `${bonita(o[0])} + ${bonita(red[0])} → ${bonita(o[1])} + ${bonita(red[1])}`;
    return { pregunta: `En medio ${m === 'acido' ? 'ácido' : 'básico'}, ${sinC}. Con enteros mínimos, ¿cuánto suman los coeficientes?`, datos: m === 'acido' ? [...D_ACIDO, D_SUMAR] : [...D_ACIDO, D_BASICO, D_SUMAR], opciones: ops,
      solucion: { texto: `Se igualan ${x.electrones} electrones: la oxidación se multiplica por ${x.factores[0]} y la reducción por ${x.factores[1]}.`, ecuacion: semiF(x) } };
  }
  function casoBasico([A, B]) {
    const r = semiM(A, B, 'basico'), n = coefDe(r, 'OH^-'), l = ladoDe(r, 'OH^-'), otro = l === 'izq' ? 'der' : 'izq', ac = semiM(A, B, 'acido'), nH = coefDe(ac, 'H^+'), lH = ladoDe(ac, 'H^+');
    const txt = (k, ld) => `${k} OH⁻ a ${lado(ld)}`;
    const ops = [{ id: 'c', texto: txt(n, l), correcta: true },
      { id: 'h', texto: `${nH} H⁺ a ${lado(lH)}, como en ácido`, error: 'H-MED', siFuera: 'Así queda en medio ácido, pero en medio básico cada H⁺ se junta con un OH⁻ y se vuelve agua.' },
      { id: 'lado', texto: txt(n, otro), error: 'H-MED', siFuera: `El número está bien, pero los OH⁻ quedan en el lado donde no estaban los H⁺: ${lado(l)}.` }];
    if (r.electrones !== n) ops.push({ id: 'e', texto: txt(r.electrones, l), error: 'QM-ION-E', siFuera: `El lado está bien, pero ${r.electrones} son los electrones de la semirreacción, no los OH⁻.` });
    else ops.push({ id: 'mas', texto: txt(n + 1, l), error: 'H-MED', siFuera: `Con ${n + 1} OH⁻ el oxígeno no cuadra.` });
    return { pregunta: `En medio básico, ${bonita(A)} → ${bonita(B)}. ¿Cuántos OH⁻ quedan en la semirreacción y de qué lado?`, datos: [...D_ACIDO, D_BASICO], opciones: ops,
      solucion: { texto: `En medio ácido van ${nH} H⁺ a ${lado(lH)}; se suman otros tantos OH⁻ a cada lado y se cancela el agua que se repite.`, ecuacion: semiF(r) } };
  }

  const ionE = {
    id: 'ion-electron',
    titulo: 'Ion-electrón: ácido y básico',
    pregunta: '¿Cómo se balancea una redox con agua, H⁺ y electrones?',
    temas: ['Balance redox por ion-electrón'],
    pieza: 'quim-reaccion',
    aprendizaje: 'Cada semirreacción se balancea con H₂O para el oxígeno, H⁺ para el hidrógeno y e⁻ para la carga; se igualan electrones y se suman.',
    actividad: 'Agregar agua, H⁺ y electrones a la semirreacción del permanganato hasta que cuadre.',
    lee: {
      tarjetas: [
        { titulo: 'El permanganato', texto: 'El permanganato de potasio, KMnO₄, es una sal morada. En un medio ácido, su ion MnO₄⁻ pasa a Mn²⁺, casi incoloro: por eso el morado desaparece.',
          pieza: 'quim-reaccion', dibujo: { pieza: 'quim-reaccion', datos: { vista: 'objeto', objeto: 'permanganato', etiqueta: 'KMnO₄', nombre: 'Permanganato de potasio' }, estado: {} } },
        { titulo: 'Media reacción', texto: 'Una semirreacción escribe solo una mitad de la redox: la oxidación o la reducción. Se balancea sola y después se junta con la otra mitad.' },
        { titulo: 'Agua y H⁺', texto: 'En una solución ácida hay mucha agua y muchos iones H⁺. Por eso se pueden escribir H₂O y H⁺ donde hagan falta, a cualquier lado.' },
        { titulo: 'Qué mirar', texto: 'En el juego, agrega agua a la derecha, y H⁺ y electrones a la izquierda. Mira la cuenta de O, de H y de carga de cada lado.' },
      ],
    },
    ejemplos: EJEMPLOS_IE,
    juega: {
      consigna: 'Semirreacción del permanganato en medio ácido: MnO₄⁻ pasa a Mn²⁺. Tú eliges cuántos H₂O, H⁺ y e⁻ se escriben.',
      mision: { texto: 'Balancea la semirreacción del permanganato: O, H y carga iguales.', logrado: v => v.w === 4 && v.h === 8 && v.e === 5,
        bien: 'Listo: MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O. Los electrones cerraron la carga.' },
      voz: 'Primero el oxígeno, después el hidrógeno; la carga al final.',
      leyenda: [{ s: 'H⁺', t: 'ion hidrógeno, con carga +1' }, { s: 'H₂O', t: 'agua, sin carga' }, { s: ELc('e⁻'), t: 'electrón, con carga −1' },
        { s: CARGA('carga'), t: 'suma de las cargas de un lado' }],
      controles: [
        { id: 'w', etiqueta: 'H₂O', color: 'c-f', min: 0, max: 6, paso: 1, inicio: 1, decimales: 0 },
        { id: 'h', etiqueta: 'H⁺', color: 'c-f', min: 0, max: 10, paso: 1, inicio: 0, decimales: 0 },
        { id: 'e', etiqueta: 'e⁻', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => permanganato(v.w, v.h, v.e),
      lectura: v => lectura6(v),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-reaccion',
      pregunta: 'En medio ácido, el nitrato pasa a monóxido de nitrógeno: NO₃⁻ → NO. ¿Cuántas moléculas de agua se escriben y de qué lado?',
      voz: 'Cuenta los oxígenos de los dos lados.',
      opciones: [
        { id: 'c', texto: '2 H₂O a la derecha', correcta: true },
        { id: 'todo', texto: '3 H₂O a la derecha, una por cada O del nitrato', error: 'QM-AGUA-TODO', siFuera: 'El lado está bien, pero el NO ya tiene un O, así que a la derecha faltan solo 2 y no 3.' },
        { id: 'lado', texto: '2 H₂O a la izquierda', error: 'QM-AGUA-LADO', siFuera: 'El número está bien, pero los O faltan a la derecha, y el agua se escribe en el lado donde faltan.' },
        { id: 'carga', texto: 'Ninguna: la diferencia se arregla con electrones', error: 'W-CAR', siFuera: 'Los electrones sí entran en la semirreacción, pero solo igualan la carga; los O que faltan se igualan con agua.' },
      ],
      dibujo: { pieza: 'quim-reaccion', datos: { vista: 'inventario', ecuacion: 'NO₃⁻ → NO', filas: [{ et: 'N', izq: '1', der: '1', igual: true }, { et: 'O', izq: '3', der: '1', igual: false }],
        alt: 'NO₃⁻ → NO: el N cuadra, 1 y 1; el O no, 3 a la izquierda y 1 a la derecha.' }, estado: {} },
      revelar: { pieza: 'quim-reaccion', datos: { vista: 'inventario', ecuacion: ['NO₃⁻ → NO + ', COEF(2), ' H₂O'], filas: [{ et: 'N', izq: '1', der: '1', igual: true }, { et: 'O', izq: '3', der: '1 + 2', igual: true }],
        alt: 'NO₃⁻ → NO + 2 H₂O: el O cuadra, 3 y 1 + 2.' }, estado: {} },
      coincide: 'Coincide: el NO ya tiene un O; faltan 2 a la derecha.',
      noCoincide: 'A la derecha el NO ya tiene un O: faltan 2, y van como 2 H₂O a la derecha.',
    },
    mira: {
      datos: { vista: 'inventario', ecuacion: ['NO₃⁻ → NO'],
        filas: [{ et: 'O', izq: '3', der: '1 + 2', igual: true, desde: 1 }, { et: 'H', izq: '4', der: '4', igual: true, desde: 2 },
          { et: 'carga', colorEt: 'h', izq: [CARGA('0')], der: [CARGA('0')], igual: true, desde: 3 }, { et: 'básico', izq: '+ 4 OH⁻', der: '+ 4 OH⁻', desde: 4 }],
        alt: 'NO₃⁻ → NO, contado paso a paso: O 3 y 1 + 2, H 4 y 4, carga 0 y 0. Si el medio fuera básico, se sumarían 4 OH⁻ a cada lado.' },
      voz: 'Primero oxígeno, después hidrógeno, al final la carga.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El N ya cuadra, y a la derecha faltan 2 O, así que se escriben 2 H₂O.', ecuacion: ['NO₃⁻ → NO + ', COEF(2), ' H₂O'] },
        { estado: { corte: 2 }, texto: 'Esas dos aguas traen 4 H, así que se ponen 4 H⁺ a la izquierda.', ecuacion: ['NO₃⁻ + ', COEF(4), ' H⁺ → NO + ', COEF(2), ' H₂O'] },
        { estado: { corte: 3 }, texto: 'La carga es −1 + 4 = +3 a la izquierda y 0 a la derecha, así que van 3 e⁻ a la izquierda.', ecuacion: semiF(semiM('NO3^-', 'NO', 'acido')) },
        { estado: { corte: 4 }, texto: 'En medio básico se suman 4 OH⁻ a cada lado, y los 4 H⁺ se vuelven agua.', ecuacion: semiF(semiM('NO3^-', 'NO', 'basico')) },
      ],
    },
    regla: {
      texto: 'En cada semirreacción se iguala primero el átomo que cambia, después el O con H₂O, el H con H⁺ y la carga con electrones. Luego se igualan los electrones de las dos mitades y se suman.',
      ecuacion: ['MnO₄⁻ + ', COEF(8), ' H⁺ + ', { llave: [ELc('5 e⁻')], nota: 'cierra la carga', color: 'c-i' }, ' → Mn²⁺ + ', COEF(4), ' H₂O'],
      condicion: 'el medio es ácido, con H⁺. En medio básico se hace lo mismo y al final se suman a cada lado tantos OH⁻ como H⁺ haya: cada H⁺ con un OH⁻ forma una H₂O.',
      voz: 'Átomos primero; la carga cierra con electrones.',
    },
    resuelve: {
      generar(s) {
        const [o, red] = RES6[idx(s, RES6.length)], x = MB.ionElectron(o, red, 'acido'), hH = x.coef('H^+');
        return { enunciado: `En medio ácido, ${bonita(o[0])} + ${bonita(red[0])} → ${bonita(o[1])} + ${bonita(red[1])}. Con enteros mínimos, ¿cuál es el coeficiente del H⁺?`, datos: [...D_ACIDO, D_SUMAR],
          pasos: [
            { tipo: 'pide', texto: 'Se pide el coeficiente del H⁺ en la ecuación sumada, con los enteros más pequeños.' },
            { tipo: 'datos', texto: `Se oxida ${bonita(o[0])}, que pasa a ${bonita(o[1])}; se reduce ${bonita(red[0])}, que pasa a ${bonita(red[1])}.` },
            { tipo: 'regla', texto: 'En cada mitad se iguala primero el átomo central, después el O con H₂O, el H con H⁺ y la carga con e⁻; luego se igualan los electrones y se suman las dos mitades.' },
            { tipo: 'cuentas', texto: `Con cada mitad ya balanceada, la oxidación se multiplica por ${x.factores[0]} y la reducción por ${x.factores[1]}, para que las dos tengan ${x.electrones} electrones.`, ecuacion: [...semiF(x.oxidacion), SEP, ...semiF(x.reduccion)] },
            { tipo: 'sentido', texto: `Al sumar las dos mitades, los electrones se cancelan, y el coeficiente del H⁺ queda en ${hH}.`, ecuacion: semiF(x) },
          ],
          respuesta: [COEF(hH), ' H⁺'] };
      },
    },
    ahoraTu: {
      voz: 'Oxígeno con agua, hidrógeno con H⁺, carga con electrones.',
      generar(s) {
        const tipo = ['agua', 'electrones', 'global', 'basico'][idx(s, 4)], k = Math.floor(s / 4);
        if (tipo === 'agua') return casoAgua(AG6[idx(k, AG6.length)]);
        if (tipo === 'electrones') return casoElectrones(EL6[idx(k, EL6.length)]);
        if (tipo === 'global') return casoGlobal(GL6[idx(k, GL6.length)]);
        return casoBasico(BA6[idx(k, BA6.length)]);
      },
    },
  };


  // ---------- Laboratorio (docs/teoria.md §4b y 4g), sin preguntas ----------
  // Mesa 1: la combustión del metano con los cuatro coeficientes libres (la idea 3 deja fija la molécula de CH₄). Así aparece
  // el caso que la idea no deja probar: 2, 4, 2, 4 también cuadra, pero no son los enteros mínimos. Átomos con la paleta de
  // elementos; los coeficientes, en los controles, en violeta.
  const comb = v => lupaEl([
    { titulo: `${v.a} CH₄ + ${v.b} O₂`, forma: 'caja', particulas: [{ e: 'CH4', n: v.a }, { e: 'O2', n: v.b }], cuenta: [['C', v.a], ['H', 4 * v.a], ['O', 2 * v.b]].map(([e, n]) => ({ e, texto: `${e} ${n}` })) },
    { titulo: `${v.c} CO₂ + ${v.d} H₂O`, forma: 'caja', particulas: [{ e: 'CO2', n: v.c }, { e: 'H2O', n: v.d }], cuenta: [['C', v.c], ['H', 2 * v.d], ['O', 2 * v.c + v.d]].map(([e, n]) => ({ e, texto: `${e} ${n}` })) },
  ], { alto: 130, cuentaPorFila: 3, alt: `${v.a} CH₄ + ${v.b} O₂ → ${v.c} CO₂ + ${v.d} H₂O: C ${v.a} y ${v.c}, H ${4 * v.a} y ${2 * v.d}, O ${2 * v.b} y ${2 * v.c + v.d}.` });
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const estadoComb = v => {
    const ok = v.a === v.c && 4 * v.a === 2 * v.d && 2 * v.b === 2 * v.c + v.d;
    return !ok ? 'no cuadra' : [v.a, v.b, v.c, v.d].reduce(mcd) > 1 ? 'cuadra, sin enteros mínimos' : 'balanceada ✓';
  };
  let mayor_ = null;
  const mayorComb = () => {
    if (mayor_ === null) { mayor_ = 0; for (let a = 1; a <= 3; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 3; c++) for (let d = 1; d <= 6; d++) if (estadoComb({ a, b, c, d }) !== 'no cuadra') mayor_ = Math.max(mayor_, a + b + c + d); }
    return mayor_;
  };
  // Mesa 2: cinco semirreacciones en medio ácido, ya con su agua y sus H⁺ (las da el motor); el alumno pone los electrones.
  // Sin el nitrato que pasa a NO (es la Predice de la idea 6): la mesa se abre antes de predecir.
  const SEMI = { mn: ['MnO4^-', 'Mn^2+'], cr: ['Cr2O7^2-', 'Cr^3+'], no2: ['NO3^-', 'NO2'], so: ['SO4^2-', 'SO2'], cl: ['ClO3^-', 'Cl^-'] };
  const semiDe = k => MB.semirreaccion(SEMI[k][0], SEMI[k][1], 'acido');
  const pideSemi = k => semiDe(k).electrones;
  const cargaSin = (k, lado) => cargaDe(semiDe(k)[lado].filter(x => x[1] !== 'e^-'));
  const cuadraSemi = v => cargaSin(v.k, 'izq') - v.n === cargaSin(v.k, 'der');
  const semiMesa = v => { const r = semiDe(v.k), qi = cargaSin(v.k, 'izq') - v.n, qd = cargaSin(v.k, 'der'), sinE = l => l.filter(x => x[1] !== 'e^-');
    return { pieza: 'quim-reaccion', datos: { vista: 'inventario', ecuacion: [...terminosF(sinE(r.izq)), ' + ', ELc(`${v.n} e⁻`), ' → ', ...terminosF(sinE(r.der))],
      filas: [{ et: 'carga', colorEt: 'h', izq: [CARGA(sgC(qi))], der: [CARGA(sgC(qd))], igual: qi === qd }],
      alt: `${bonita(SEMI[v.k][0])} → ${bonita(SEMI[v.k][1])} con ${v.n} electrones: carga ${sgC(qi)} a la izquierda y ${sgC(qd)} a la derecha.` }, estado: {} }; };
  const LAB = [
    {
      id: 'metano-libre', titulo: 'El metano con todo', pieza: 'quim-particulas',
      consigna: 'El O₂ sube y baja solo; tú cambias los otros tres coeficientes. Busca la ecuación balanceada y otra que cuadre con números más grandes.',
      controles: [
        { id: 'a', etiqueta: 'CH₄', color: 'c-f', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'O₂', color: 'c-f', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
        { id: 'c', etiqueta: 'CO₂', color: 'c-f', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'd', etiqueta: 'H₂O', color: 'c-f', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => comb(ent(v, 'b')),
      lectura: v => { v = ent(v, 'b'); return [`${v.a} : ${v.b} : ${v.c} : ${v.d} → ${estadoComb(v)}`]; },
      // Retos: todos los decide estadoComb, el mismo inventario que escribe la lectura.
      invitaciones: [
        { texto: 'Balancea la combustión del metano con los enteros más pequeños.', logrado: v => estadoComb(v) === 'balanceada ✓',
          bien: 'Cada átomo de antes sigue ahí después, solo que con otra pareja.' },
        { texto: 'Encuentra otra ecuación que cuadre, pero sin los enteros mínimos.', logrado: v => estadoComb(v) === 'cuadra, sin enteros mínimos',
          bien: 'Cuadra igual, pero todos se dividen entre un mismo número, y se escribe la mínima.' },
        { texto: 'Balancea usando la mayor cantidad de moléculas que permite la mesa.', logrado: v => estadoComb(v) !== 'no cuadra' && v.a + v.b + v.c + v.d === mayorComb(),
          bien: 'Es la receta mínima multiplicada por tres, con las mismas proporciones entre las moléculas.' },
        { texto: 'Guarda un caso que no cuadre; luego arréglalo cambiando solo el O₂.',
          logrado: (v, g) => estadoComb(v) === 'balanceada ✓'
            && g.some(x => estadoComb(x) === 'no cuadra' && x.a === v.a && x.c === v.c && x.d === v.d && x.b !== v.b)
            && g.some(x => x.a === v.a && x.b === v.b && x.c === v.c && x.d === v.d),
          bien: 'El oxígeno se ajusta al final: está en los dos productos.' },
      ],
    },
    {
      id: 'semirreacciones', titulo: 'Cinco semirreacciones', pieza: 'quim-reaccion',
      consigna: 'Elige una semirreacción en medio ácido, ya con su agua y sus H⁺. Pon los electrones que igualan la carga de los dos lados.',
      controles: [
        { id: 'k', etiqueta: 'Semirreacción', opciones: Object.keys(SEMI).map(k => ({ valor: k, texto: `${bonita(SEMI[k][0])} → ${bonita(SEMI[k][1])}` })) },
        { id: 'n', etiqueta: 'e⁻', color: 'c-i', min: 0, max: 12, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => semiMesa(v),
      lectura: v => { const qi = cargaSin(v.k, 'izq') - v.n, qd = cargaSin(v.k, 'der'); return [`${v.n} e⁻: carga ${sgC(qi)} ${qi === qd ? '=' : '≠'} ${sgC(qd)}`]; },
      // Retos: la carga de cada lado sale del motor, la misma que dibuja la mesa.
      invitaciones: [
        { texto: 'Iguala la carga del permanganato: ¿cuántos electrones pide?', logrado: v => v.k === 'mn' && cuadraSemi(v),
          bien: 'Pide cinco electrones, porque el manganeso baja cinco escalones, de +7 a +2.' },
        { texto: 'Busca la semirreacción que pide más electrones y balancéala.', logrado: v => cuadraSemi(v) && v.n === Math.max(...Object.keys(SEMI).map(pideSemi)),
          bien: 'Seis, en dos casos: dos cromos que bajan tres o un cloro que baja seis.' },
        { texto: 'Pásate de largo: deja la izquierda más negativa que la derecha.', logrado: v => cargaSin(v.k, 'izq') - v.n < cargaSin(v.k, 'der'),
          bien: 'Con electrones de más, la carga tampoco cuadra: solo un número la iguala.' },
        { texto: 'Guarda dos semirreacciones balanceadas: una con el doble de electrones que la otra.',
          logrado: (v, g) => cuadraSemi(v) && g.some(x => cuadraSemi(x) && (v.n === 2 * x.n || x.n === 2 * v.n) && x.n > 0) && g.some(x => x.k === v.k && x.n === v.n),
          bien: 'Para sumarlas, la de menos electrones se multiplica por 2.' },
      ],
    },
  ];


  return {
    unidad: 'quimica.reacciones-y-balance',
    version: '0.2.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/plantillas/balance-reacciones/motor.js', '/nucleo/elementos.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-reaccion.js',
      '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/recta.js'],
    // Tabla de letras (molde §0.4): cada letra con un solo significado en la unidad.
    letras: { a: 'primer coeficiente desconocido', b: 'segundo coeficiente desconocido',
      c: 'tercer coeficiente desconocido', d: 'cuarto coeficiente desconocido',
      s: 'sólido (estado)', l: 'líquido (estado)', g: 'gas (estado)' },
    historia: {
      texto: 'Escribir una transformación de forma compacta exigió un lenguaje común. En 1813, Berzelius propuso símbolos de letras para los elementos, que se difundieron poco a poco, aunque su notación todavía no era la de hoy. Una ecuación moderna suma a esos símbolos el balance de átomos y de carga: se ajustan cantidades, no sustancias.',
      pregunta: '¿Qué tendría que conservarse para que una ecuación sea creíble?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §4.1', url: 'https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations' },
    },
    // Glosario (docs/teoria.md §4d y 4g): las palabras que la unidad estrena en el curso, con su aproximación de todos los días
    // (`simple`) y tres ejemplos. «Estado de oxidación» y «subíndice» vienen de Nomenclatura, «cambio químico» de Materia y
    // energía y «combustión» de Recursos naturales: el lector las marca solas. Ningún ejemplo trae la respuesta de una
    // Predice (glosario-predice): ni el Fe(OH)₃.
    glosario: [
      { termino: 'ecuación química', formas: ['ecuación química', 'ecuaciones químicas', 'ecuación'], simple: 'La receta de una reacción escrita con fórmulas y una flecha.',
        def: 'Reacción escrita con fórmulas: reactivos a la izquierda de la flecha, productos a la derecha, cada uno con su estado.',
        ejemplos: ['C(s) + O₂(g) → CO₂(g): el carbón que arde.', 'H₂O(l) → H₂O(g) no es una reacción: es la misma sustancia.', '2 H₂(g) + O₂(g) → 2 H₂O(l).'], ver: ['reactivo', 'producto'] },
      { termino: 'reactivo', formas: ['reactivo', 'reactivos'], simple: 'Lo que había antes y se va gastando.',
        def: 'Sustancia que se gasta en una reacción. Se escribe a la izquierda de la flecha.',
        ejemplos: ['En C + O₂ → CO₂, el carbón y el oxígeno.', 'El sarro y el ácido muriático, al limpiar una tetera.', 'El zinc, en Zn + 2 HCl → ZnCl₂ + H₂.'], ver: ['producto'] },
      { termino: 'producto', formas: ['producto', 'productos'], simple: 'Lo nuevo que aparece después.',
        def: 'Sustancia nueva que se forma en una reacción. Se escribe a la derecha de la flecha.',
        ejemplos: ['En C + O₂ → CO₂, el dióxido de carbono.', 'El hidrógeno que burbujea en Zn + 2 HCl.', 'El AgCl blanco que aparece al mezclar AgNO₃ y KCl.'], ver: ['reactivo'] },
      { termino: 'precipitado', formas: ['precipitado', 'precipitados', 'precipita', 'precipitar'], simple: 'Un sólido que aparece de golpe al juntar dos líquidos.',
        def: 'Sólido que se forma en una reacción entre sustancias disueltas y que no se disuelve. En la ecuación lleva (s).',
        ejemplos: ['El AgCl blanco de AgNO₃ con KCl.', 'El PbI₂ amarillo de Pb(NO₃)₂ con KI.', 'El CaCO₃ que enturbia el agua de cal al soplar.'], ver: ['producto'] },
      // Idea 2. Ningún ejemplo trae el horno de cal (la Predice).
      { termino: 'exotérmica', formas: ['exotérmica', 'exotérmicas', 'exotérmico', 'exotérmicos'], simple: 'Que suelta calor, como una fogata.',
        def: 'Dicho de una reacción que libera calor al entorno. En la ecuación, el calor va con los productos.',
        ejemplos: ['La quema del gas de la cocina.', 'CaO + H₂O → Ca(OH)₂ + calor: la cal viva que calienta el agua.', '2 H₂ + O₂ → 2 H₂O + calor.'], ver: ['endotérmica'] },
      { termino: 'endotérmica', formas: ['endotérmica', 'endotérmicas', 'endotérmico', 'endotérmicos'], simple: 'Que necesita recibir calor todo el tiempo para seguir.',
        def: 'Dicho de una reacción que absorbe calor del entorno. En la ecuación, el calor va con los reactivos.',
        ejemplos: ['N₂ + O₂ + calor → 2 NO, en un rayo.', 'El bicarbonato que se descompone en el horno.', 'Bicarbonato con vinagre: el vaso se enfría un poco mientras burbujea.'], ver: ['exotérmica'] },
      { termino: 'desplazamiento simple', formas: ['desplazamiento simple'], simple: 'Un elemento suelto que le quita el sitio a otro.',
        def: 'Reacción en que un elemento toma el lugar de otro dentro de un compuesto y lo deja suelto.',
        ejemplos: ['Fe + CuSO₄ → FeSO₄ + Cu.', 'Zn + 2 HCl → ZnCl₂ + H₂.', 'Cl₂ + 2 KBr → 2 KCl + Br₂.'], ver: ['doble desplazamiento'] },
      { termino: 'doble desplazamiento', formas: ['doble desplazamiento'], simple: 'Dos parejas que se cambian de compañero.',
        def: 'Reacción en que dos compuestos intercambian sus partes: AB + XY → AY + XB.',
        ejemplos: ['AgNO₃ + KCl → AgCl + KNO₃.', 'HCl + NaOH → NaCl + H₂O.', 'BaCl₂ + K₂SO₄ → BaSO₄ + 2 KCl.'], ver: ['desplazamiento simple'] },
      // Idea 3. Ningún ejemplo trae el H₂O₂ como respuesta (la Predice).
      { termino: 'coeficiente', formas: ['coeficiente', 'coeficientes'], simple: 'Cuántas moléculas de una sustancia entran o salen.',
        def: 'Número grande delante de una fórmula que dice cuántas moléculas o unidades toman parte; multiplica toda la fórmula.',
        ejemplos: ['3 H₂O: tres moléculas de agua, con 6 H y 3 O.', 'En 2 Mg + O₂ → 2 MgO, los coeficientes son 2, 1 y 2.', '2 Ca(OH)₂: 2 Ca, 4 O y 4 H.'], ver: ['subíndice'] },
      { termino: 'ecuación balanceada', formas: ['ecuación balanceada', 'ecuaciones balanceadas', 'balanceada', 'balancear', 'balance'], simple: 'Una ecuación con los mismos átomos antes y después.',
        def: 'Ecuación química en que cada elemento tiene el mismo número de átomos a los dos lados de la flecha.',
        ejemplos: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O.', 'N₂ + 3 H₂ → 2 NH₃: 2 N y 6 H a cada lado.', 'Fe + O₂ → Fe₂O₃ todavía no lo está.'], ver: ['coeficiente'] },
      { termino: 'tanteo', formas: ['tanteo'], simple: 'Probar un número, revisar y corregir hasta que todo cuadre.',
        def: 'Forma de balancear probando coeficientes, un elemento a la vez, y revisando los demás después de cada cambio.',
        ejemplos: ['Primero el metal, después el no metal; el H y el O al final.', 'En Al + O₂ → Al₂O₃, se empieza por el oxígeno: 6 O.', 'Si sale 5/2, todo se multiplica por 2.'], ver: ['ecuación balanceada'] },
      // Idea 4. Ningún ejemplo trae el alto horno ni el CO (la Predice).
      { termino: 'oxidación', formas: ['oxidación', 'oxidarse', 'se oxida', 'oxida'], simple: 'Perder electrones: el EO del átomo sube.',
        def: 'Pérdida de electrones de un átomo: su EO, el número que lleva la cuenta, sube.',
        ejemplos: ['Zn → Zn²⁺ + 2 e⁻: el zinc va de 0 a +2.', 'Fe²⁺ → Fe³⁺ + e⁻.', 'En 2 Na + Cl₂ → 2 NaCl, el sodio se oxida sin oxígeno.'], ver: ['reducción', 'redox'] },
      { termino: 'reducción', formas: ['reducción', 'reducirse', 'se reduce', 'reduce'], simple: 'Ganar electrones: el EO del átomo baja.',
        def: 'Ganancia de electrones de un átomo: su EO, el número que lleva la cuenta, baja.',
        ejemplos: ['Cu²⁺ + 2 e⁻ → Cu: el cobre va de +2 a 0.', 'El cloro de Cl₂ baja de 0 a −1 en NaCl.', 'Ag⁺ + e⁻ → Ag.'], ver: ['oxidación', 'redox'] },
      { termino: 'agente oxidante', formas: ['agente oxidante', 'oxidante'], simple: 'El que le quita electrones a otro; él mismo se reduce.',
        def: 'Reactivo que oxida a otro quitándole electrones; por eso él mismo se reduce.',
        ejemplos: ['En Zn + Cu²⁺, el Cu²⁺.', 'En 2 Na + Cl₂ → 2 NaCl, el Cl₂.', 'El O₂ en toda combustión.'], ver: ['agente reductor'] },
      { termino: 'agente reductor', formas: ['agente reductor', 'reductor'], simple: 'El que le da electrones a otro; él mismo se oxida.',
        def: 'Reactivo que reduce a otro dándole electrones; por eso él mismo se oxida.',
        ejemplos: ['En Zn + Cu²⁺, el zinc.', 'En 2 Na + Cl₂ → 2 NaCl, el sodio.', 'El H₂ en CuO + H₂ → Cu + H₂O.'], ver: ['agente oxidante'] },
      { termino: 'redox', formas: ['redox'], def: 'Reacción en que algún estado de oxidación cambia: algo se oxida y algo se reduce, a veces el mismo elemento.',
        ejemplos: ['Toda combustión es redox.', 'Zn + CuSO₄ → ZnSO₄ + Cu es redox.', 'HCl + NaOH → NaCl + H₂O no lo es.'], ver: ['oxidación', 'reducción'] },
      // Idea 5. Ningún ejemplo trae el Fe₂O₃ (la Predice).
      { termino: 'electrones transferidos', formas: ['electrones transferidos'], simple: 'Los electrones que pasan del reductor al oxidante.',
        def: 'Electrones que pierde el reductor y gana el oxidante en una reacción balanceada: son los mismos.',
        ejemplos: ['En Zn + Cu²⁺ → Zn²⁺ + Cu, son 2.', 'En 2 Na + Cl₂ → 2 NaCl, son 2.', 'En 2 Al + 3 Cl₂ → 2 AlCl₃, son 6.'], ver: ['redox'] },
      { termino: 'dismutación', formas: ['dismutación', 'desproporción'], simple: 'Un mismo elemento que sube y baja a la vez.',
        def: 'Redox en que un mismo elemento, desde un solo estado, se oxida en parte y en parte se reduce.',
        ejemplos: ['Cl₂ + 2 NaOH → NaCl + NaClO + H₂O.', '2 H₂O₂ → 2 H₂O + O₂: el O de −1 pasa a −2 y a 0.', '3 NO₂ + H₂O → 2 HNO₃ + NO.'], ver: ['redox'] },
      // Idea 6. Ningún ejemplo trae el NO₃⁻ que pasa a NO (la Predice).
      { termino: 'semirreacción', formas: ['semirreacción', 'semirreacciones'], simple: 'La mitad de una redox: solo la oxidación o solo la reducción.',
        def: 'Mitad de una redox escrita aparte, con sus electrones: solo la oxidación o solo la reducción.',
        ejemplos: ['Zn → Zn²⁺ + 2 e⁻.', 'Cu²⁺ + 2 e⁻ → Cu.', 'MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O.'], ver: ['método ion-electrón'] },
      { termino: 'método ion-electrón', formas: ['método ion-electrón', 'ion-electrón'], simple: 'Balancear cada mitad de la redox por separado y después juntarlas.',
        def: 'Forma de balancear una redox: cada semirreacción con H₂O, H⁺ (u OH⁻) y electrones; luego se suman.',
        ejemplos: ['Fe²⁺ → Fe³⁺ + e⁻, por 5, con la del MnO₄⁻.', 'Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O.', 'En básico, cada H⁺ se cancela con un OH⁻.'], ver: ['semirreacción'] },
      { termino: 'medio ácido', formas: ['medio ácido'], simple: 'Una solución con muchos H⁺ disponibles.',
        def: 'Solución donde la reacción ocurre con iones H⁺ de sobra: el hidrógeno se balancea con H⁺.',
        ejemplos: ['El permanganato con ácido sulfúrico.', 'El jugo gástrico del estómago.', 'MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O.'], ver: ['medio básico'] },
      { termino: 'medio básico', formas: ['medio básico'], simple: 'Una solución con muchos OH⁻ disponibles.',
        def: 'Solución donde la reacción ocurre con iones OH⁻ de sobra: los H⁺ se cambian por agua.',
        ejemplos: ['Una solución de NaOH.', 'H⁺ + OH⁻ → H₂O, a cada lado.', 'MnO₄⁻ + 2 H₂O + 3 e⁻ → MnO₂ + 4 OH⁻.'], ver: ['medio ácido'] },
    ],
    // Laboratorio (docs/teoria.md §4b), sin preguntas.
    laboratorio: LAB,
    // A qué idea pertenece cada mesa (docs/teoria.md 4g). La escena vieja (plantillas/balance-reacciones) va a «Más mesas del
    // tema» con "rehacer": true en su plantilla.json.
    laboratorioIdeas: { 'metano-libre': ['tanteo'], 'semirreacciones': ['ion-electron'] },
    ideas: [indicios, clasif, tanteo, redox, cambioEO, ionE],
  };
});
