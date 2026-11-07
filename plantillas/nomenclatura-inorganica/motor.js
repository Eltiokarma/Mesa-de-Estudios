/*
 * Motor de «El árbol de las funciones: nomenclatura inorgánica».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorNomenclatura) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Qué calcula:
 *   - Átomos y carga de una fórmula o ion: "Fe2O3", "Al2(SO4)3", "FeSO4·7H2O", "SO4^2-", "NH4^+", "HCl(ac)".
 *   - El estado de oxidación de cada elemento, con fracciones exactas (Fe₃O₄ → +8/3, Na₂S₂O₃ → +2).
 *   - La fórmula que sale de juntar dos iones (fichas) hasta que la carga sume cero: cruce y simplificación,
 *     con paréntesis para los iones poliatómicos; el peróxido O₂²⁻ es una ficha que no se parte.
 *   - Las fichas de una fórmula (descomponer), la función química (clasificar) y la fórmula por el árbol
 *     (formar): metal + O₂ → óxido básico → + H₂O → hidróxido; no metal + O₂ → óxido ácido → + H₂O → oxácido;
 *     elemento + H₂ → hidruro (en agua, hidrácido); ácido + hidróxido → sal + agua (neutralizar).
 *   - Los nombres en las tres nomenclaturas, cada parte con el elemento que la colorea, y el camino de vuelta:
 *     del nombre a la fórmula (formulaDeNombre), para todo lo que el motor sabe formar.
 * Cada función que alimenta una predicción devuelve además `errores`: lo que da cada error típico (de la tabla
 * «Lo que no tiene respaldo» y del bloque NO de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md).
 *
 * CONVENCIONES (las de academia peruana; el informe pide decirlas):
 *   1. Estados de oxidación de la tabla ESTADOS, de academia: «valencia» y «estado de oxidación» se usan casi igual.
 *      Metales: Li, Na, K, Ag +1; Mg, Ca, Ba, Zn +2; Al +3; Cu y Hg +1, +2; Au +1, +3; Fe, Co, Ni +2, +3;
 *      Sn y Pb +2, +4; Cr +2, +3 (y +6 como no metal); Mn +2, +3 (y +4, +6, +7 como no metal).
 *      No metales (estados positivos, para óxidos ácidos y oxácidos): B +3; C +2, +4 (el CO es óxido neutro: no da
 *      ácido); Si +4; N +1, +3, +5; P +1, +3, +5; S +2, +4, +6; Se +4, +6; Cl, Br, I +1, +3, +5, +7. Negativos (hidruros y sales
 *      haloideas): H −1 con metales; F, Cl, Br, I −1; S, Se −2; N, P −3; C −4.
 *   2. Estado de oxidación por suma de cargas: 0 en una sustancia neutra y la carga en un ion. F −1, alcalinos +1,
 *      alcalinotérreos +2, Al +3, H +1 y O −2; el último elemento se despeja. Así salen solos el H −1 de los
 *      hidruros metálicos, el O −1 de los peróxidos y el O +2 del OF₂. En una sal, primero se separan sus iones.
 *   3. Tradicional: con un estado, -ico (ácido carbónico) o «de» + metal (óxido de sodio); con dos, -oso el menor e
 *      -ico el mayor; con tres (N, P, S), hipo-…-oso, -oso e -ico (H₂SO₂ hiposulfuroso, HNO hiponitroso, H₃PO₂
 *      hipofosforoso); con cuatro (Cl, Br, I), hipo-…-oso, -oso, -ico y per-…-ico. Mn como no metal: +4 -oso, +6 -ico
 *      y +7 per-…-ico. Los óxidos de no metal se llaman «anhídrido» en la tradicional (anhídrido sulfúrico) y
 *      «óxido» en las otras dos. Las sales cambian -oso → -ito, -ico → -ato e -hídrico → -uro.
 *   4. Stock: número romano entre paréntesis, pegado al nombre del elemento como pide la IUPAC («óxido de
 *      hierro(III)»; el parser acepta también «hierro (III)»), solo si el elemento tiene más de un estado en la
 *      tabla. Para los oxácidos, la «stock» de academia es la funcional, con espacio tras la raíz: «ácido
 *      tetraoxosulfúrico (VI)»; igual en la sistemática de academia: «tetraoxosulfato (VI) de hidrógeno».
 *   5. Sistemática: prefijos mono-, di-, tri-… con la cantidad de cada átomo («trióxido de dihierro»). Delante de
 *      «óxido» se elide la vocal, como en las academias: monóxido, dióxido, trióxido, tetróxido, pentóxido, heptóxido
 *      (el parser acepta también pentaóxido, heptaóxido…). Mono- se escribe delante de «óxido» y delante de lo que
 *      se nombra primero cuando el metal tiene más de un estado, para distinguir (monosulfuro de hierro frente a
 *      trisulfuro de dihierro; monohidróxido de cobre); en lo demás se omite (cloruro de sodio, hidruro de sodio).
 *      Oxácidos y oxisales con la forma de academia: «tetraoxosulfato (VI) de hidrógeno», «tetraoxosulfato (VI) de
 *      hierro(III)». Los hidruros de S, Se y halógenos: «cloruro de hidrógeno», «sulfuro de hidrógeno», sin prefijo.
 *   6. Hidrácidos: «HCl(ac)» es el hidrácido (ácido clorhídrico); «HCl» sin (ac) es el gas, cloruro de hidrógeno.
 *   7. P y B forman por defecto el oxácido orto (óxido + 3 H₂O): ácido fosfórico H₃PO₄, ácido bórico H₃BO₃; con P
 *      también meta (+1 H₂O) y piro (+2 H₂O). Cr y S también forman el di- (dos óxidos + 1 H₂O): ácido dicrómico.
 *   8. Sal ácida: «carbonato ácido de potasio» (tradicional), «hidrogenocarbonato de potasio» (stock); el nombre
 *      común con bi- (bicarbonato) solo con un H de un ácido de dos H. Sal básica: «cloruro básico de calcio»,
 *      «hidroxicloruro de calcio». Hidratos: «… heptahidratado», con el agua escrita «·7H2O».
 *   9. Notas. El MnO₂ es en realidad anfótero; la academia lo pone como «anhídrido manganoso» por la tabla de Mn como
 *      no metal, y el nombre «dióxido de manganeso» (u «óxido de manganeso(IV)») es el más aceptado. El H₃PO₃ (ácido
 *      fosforoso) tiene en realidad solo 2 H ácidos (uno va unido al P); la academia lo trata como si tuviera 3, y
 *      así lo hace el motor (fosfito PO₃³⁻). Los peróxidos se forman solo con H, alcalinos, alcalinotérreos y Zn.
 *  10. Masas atómicas de academia: H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, P 31, S 32, Cl 35,5, K 39, Ca 40,
 *      Fe 56, Cu 63,5, Zn 65, Pb 207 (las demás, redondeadas).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorNomenclatura = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- Tabla de elementos (academia) ----------
  // m: estados como metal; nm: estados positivos como no metal (óxidos ácidos, oxácidos); neg: estado negativo.
  // oso/ico: raíces de los adjetivos (ferroso, férrico); an: raíz de los aniones (sulfito, sulfato); uro: raíz del
  // anión sin oxígeno (sulfuro); hidr: raíz del hidrácido (sulfhídrico). orto: forma el orto por defecto.
  const ESTADOS = {
    H:  { nombre:'hidrógeno', grupo:1,  nm:[1], neg:-1, uro:'hidr' },
    Li: { nombre:'litio', m:[1], grupo:1 },  Na: { nombre:'sodio', m:[1], grupo:1 },  K: { nombre:'potasio', m:[1], grupo:1 },
    Ag: { nombre:'plata', m:[1] },
    Mg: { nombre:'magnesio', m:[2], grupo:2 }, Ca: { nombre:'calcio', m:[2], grupo:2 }, Ba: { nombre:'bario', m:[2], grupo:2 },
    Zn: { nombre:'zinc', m:[2] },  Al: { nombre:'aluminio', m:[3], grupo:13 },
    Fe: { nombre:'hierro', m:[2, 3], oso:'ferr', ico:'férr' },
    Cu: { nombre:'cobre', m:[1, 2], oso:'cupr', ico:'cúpr' },
    Pb: { nombre:'plomo', m:[2, 4], oso:'plumb', ico:'plúmb' },
    Sn: { nombre:'estaño', m:[2, 4], oso:'estann', ico:'estánn' },
    Hg: { nombre:'mercurio', m:[1, 2], oso:'mercuri', ico:'mercúr' },
    Au: { nombre:'oro', m:[1, 3], oso:'aur', ico:'áur' },
    Ni: { nombre:'níquel', m:[2, 3], oso:'niquel', ico:'niquél' },
    Co: { nombre:'cobalto', m:[2, 3], oso:'cobalt', ico:'cobált' },
    Cr: { nombre:'cromo', m:[2, 3], nm:[6], oso:'crom', ico:'cróm', an:'crom' },
    Mn: { nombre:'manganeso', m:[2, 3], nm:[4, 6, 7], oso:'mangan', ico:'mangán', an:'mangan', trad:{ 4:['', 'oso'], 6:['', 'ico'], 7:['per', 'ico'] } },
    B:  { nombre:'boro', grupo:13, nm:[3], oso:'bor', ico:'bór', an:'bor', orto:true },
    C:  { nombre:'carbono', grupo:14, nm:[2, 4], neutros:[2], neg:-4, oso:'carbon', ico:'carbón', an:'carbon', uro:'carb' },
    Si: { nombre:'silicio', grupo:14, nm:[4], oso:'silic', ico:'silíc', an:'silic' },
    N:  { nombre:'nitrógeno', grupo:15, nm:[1, 3, 5], neg:-3, oso:'nitr', ico:'nítr', an:'nitr', uro:'nitr' },
    P:  { nombre:'fósforo', grupo:15, nm:[1, 3, 5], neg:-3, oso:'fosfor', ico:'fosfór', an:'fosf', uro:'fosf', orto:true },
    S:  { nombre:'azufre', grupo:16, nm:[2, 4, 6], neg:-2, oso:'sulfur', ico:'sulfúr', an:'sulf', uro:'sulf', hidr:'sulfh' },
    Se: { nombre:'selenio', grupo:16, nm:[4, 6], neg:-2, oso:'seleni', ico:'selén', an:'selen', uro:'seleni', hidr:'selenh' },
    F:  { nombre:'flúor', grupo:17, nm:[], neg:-1, uro:'fluor', hidr:'fluorh' },
    Cl: { nombre:'cloro', grupo:17, nm:[1, 3, 5, 7], neg:-1, oso:'clor', ico:'clór', an:'clor', uro:'clor', hidr:'clorh' },
    Br: { nombre:'bromo', grupo:17, nm:[1, 3, 5, 7], neg:-1, oso:'brom', ico:'bróm', an:'brom', uro:'brom', hidr:'bromh' },
    I:  { nombre:'yodo', grupo:17, nm:[1, 3, 5, 7], neg:-1, oso:'yod', ico:'yód', an:'yod', uro:'yod', hidr:'yodh' },
    O:  { nombre:'oxígeno', grupo:16, neg:-2 },
  };
  const MASAS = Object.freeze({ H:1, Li:7, B:11, C:12, N:14, O:16, F:19, Na:23, Mg:24, Al:27, Si:28, P:31, S:32, Cl:35.5, K:39, Ca:40,
    Cr:52, Mn:55, Fe:56, Co:59, Ni:59, Cu:63.5, Zn:65, Se:79, Br:80, Ag:108, Sn:119, I:127, Ba:137, Au:197, Hg:200.6, Pb:207 });
  const esMetal = e => !!(ESTADOS[e] && ESTADOS[e].m);
  const todos = e => { const t = ESTADOS[e]; return [...new Set([...(t.m || []), ...(t.nm || [])])].sort((a, b) => a - b); };
  const varios = e => todos(e).length > 1;

  // ---------- Fracciones exactas ----------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const fr = (n, d) => { if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } const g = mcd(n, d) || 1; return [n / g, d / g]; };
  const fsum = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fmul = (a, k) => fr(a[0] * k, a[1]);
  const fdiv = (a, k) => fr(a[0], a[1] * k);
  const ftexto = ([n, d]) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d);

  // ---------- Fórmulas e iones ----------
  // "Fe2O3", "Al2(SO4)3", "FeSO4·7H2O" (también con "." o "*"), "SO4^2-", "NH4^+", "HCl(ac)".
  function especie(texto) {
    let t = String(texto).replace(/\s/g, '');
    const ac = /\(ac\)$/.test(t); if (ac) t = t.slice(0, -4);
    const m = t.match(/^(.*?)(?:\^(\d*)([+-]))?$/);
    const cuerpo = m[1], carga = m[3] ? (m[3] === '+' ? 1 : -1) * (m[2] ? Number(m[2]) : 1) : 0;
    const partes = cuerpo.split(/[·.*]/), agua = partes.length > 1 ? hidrato(partes[1], texto) : 0;
    return { formula: t + (ac ? '(ac)' : ''), cuerpo: partes[0], atomos: atomos(cuerpo), base: atomos(partes[0]), agua, carga, acuoso: ac };
  }
  function hidrato(p, texto) { const m = p.match(/^(\d*)H2O$/); if (!m) throw new Error(`no entiendo el agua de hidratación en ${texto}`); return m[1] ? Number(m[1]) : 1; }
  function atomos(formula) {
    const partes = String(formula).replace(/\s/g, '').replace(/\(ac\)$/, '').replace(/\^.*$/, '').split(/[·.*]/), total = {};
    for (const parte of partes) {
      const m = parte.match(/^(\d+)(.*)$/), veces = m ? Number(m[1]) : 1, f = m ? m[2] : parte;
      let i = 0;
      const grupo = () => {
        const r = {};
        while (i < f.length && f[i] !== ')') {
          let sub;
          if (f[i] === '(') { i++; sub = grupo(); if (f[i] !== ')') throw new Error(`falta ")" en ${formula}`); i++; }
          else {
            const e = f.slice(i).match(/^[A-Z][a-z]?/);
            if (!e) throw new Error(`no entiendo la fórmula ${formula}`);
            if (!(e[0] in ESTADOS)) throw new Error(`no conozco el elemento ${e[0]}`);
            i += e[0].length; sub = { [e[0]]: 1 };
          }
          const d = f.slice(i).match(/^\d+/); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
          for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
        }
        return r;
      };
      const g = grupo();
      if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
      for (const [el, n] of Object.entries(g)) total[el] = (total[el] || 0) + n * veces;
    }
    if (!Object.keys(total).length) throw new Error(`fórmula vacía: ${formula}`);
    return total;
  }
  const masaMolar = f => Object.entries(atomos(f)).reduce((s, [e, n]) => s + MASAS[e] * n, 0);
  const igualesAtomos = (a, b) => { const k = new Set([...Object.keys(a), ...Object.keys(b)]); for (const e of k) if ((a[e] || 0) !== (b[e] || 0)) return false; return true; };
  // Texto de una fórmula desde una lista ordenada de [elemento, cantidad].
  const plana = lista => lista.map(([e, n]) => e + (n === 1 ? '' : n)).join('');

  // ---------- Iones (fichas) ----------
  // Cada ion: { formula:'SO4^2-', cuerpo:'SO4', carga:-2, atomos, poli, central, estado, tipo }.
  const sup = q => (Math.abs(q) === 1 ? '' : Math.abs(q)) + (q > 0 ? '+' : '-');
  function ionDe(cuerpo, carga, extra) { return { formula: `${cuerpo}^${sup(carga)}`, cuerpo, carga, atomos: atomos(cuerpo), poli: Object.values(atomos(cuerpo)).reduce((s, n) => s + n, 0) > 1, ...extra }; }
  // Oxácido de un no metal (o del Cr o Mn) con un estado: óxido + agua (meta 1, piro 2, orto 3; di: 2 óxidos + 1 agua).
  function oxacidoDe(e, v, forma) {
    const t = ESTADOS[e]; if (!t || !(t.nm || []).includes(v)) throw new Error(`${e} no forma oxácido con ${ftexto([v, 1])}`);
    if (t.neutros && t.neutros.includes(v)) throw new Error(`el óxido de ${t.nombre} con ${ftexto([v, 1])} es neutro: no forma ácido`);
    const ox = oxido(e, v);
    let f = forma || (t.orto && v % 2 === 1 ? 'orto' : 'normal');
    let nOx = 1, nAgua = 1;
    if (f === 'meta') nAgua = 1; else if (f === 'piro') nAgua = 2; else if (f === 'orto') nAgua = v % 2 === 1 ? 3 : 2; else if (f === 'di') { nOx = 2; nAgua = 1; }
    if ((f === 'meta' || f === 'piro' || f === 'orto') && !t.orto) throw new Error(`meta, piro y orto solo con P y B en esta escena`);
    if (f === 'di' && !['S', 'Cr'].includes(e)) throw new Error(`el di- solo con S y Cr en esta escena`);
    const H = 2 * nAgua, X = ox.a * nOx, O = ox.b * nOx + nAgua, g = mcd(mcd(H, X), O);
    return { H: H / g, X: X / g, O: O / g, forma: f, oxidoFormula: ox.formula, nOx, nAgua, sinSimplificar: { H, X, O } };
  }
  function oxoanion(e, v, forma, hRestantes) {
    const a = oxacidoDe(e, v, forma), h = hRestantes || 0;
    if (h >= a.H) throw new Error('un anión tiene que perder al menos un H');
    const cuerpo = (h ? 'H' + (h > 1 ? h : '') : '') + plana([[e, a.X], ['O', a.O]]);
    return ionDe(cuerpo, -(a.H - h), { central: e, estado: v, tipo: 'oxoanion', forma: a.forma, h, hAcido: a.H, X: a.X, O: a.O });
  }
  function anionSimple(e) {
    const t = ESTADOS[e]; if (!t || t.neg === undefined) throw new Error(`${e} no forma anión simple`);
    if (e === 'O') return ionDe('O', -2, { central: 'O', estado: -2, tipo: 'oxido' });
    return ionDe(e, t.neg, { central: e, estado: t.neg, tipo: e === 'H' ? 'hidruro' : 'haloideo' });
  }
  const PEROXIDO = ionDe('O2', -2, { central: 'O', estado: -1, tipo: 'peroxido' });
  // Peróxidos que se estudian: de los metales alcalinos y alcalinotérreos, del zinc y del hidrógeno. Con otros
  // cationes la fórmula saldría inventada (Al₂O₆, FeO₂, PbO₄): formulaDeIones lo rechaza.
  const FORMAN_PEROXIDO = ['H', 'Li', 'Na', 'K', 'Mg', 'Ca', 'Ba', 'Zn'];
  // Lo que la escena deja elegir en la mesa libre y en el árbol libre (motor.test.js recorre todas las parejas).
  const LIBRES = {
    cationes: ['Na^+', 'K^+', 'Ca^2+', 'Al^3+', 'Fe^2+', 'Fe^3+', 'Zn^2+', 'Pb^2+', 'Pb^4+', 'NH4^+'],
    aniones: ['O^2-', 'O2^2-', 'OH^-', 'Cl^-', 'S^2-', 'SO4^2-', 'SO3^2-', 'NO3^-', 'NO2^-', 'CO3^2-', 'HCO3^-', 'PO4^3-', 'ClO^-', 'ClO4^-'],
    metales: ['Na', 'K', 'Ca', 'Al', 'Fe', 'Zn', 'Pb'],
    noMetales: ['C', 'N', 'P', 'S', 'Cl'],
  };
  // ¿Se puede formar un compuesto con estas dos fichas? null si sí; si no, el porqué.
  function permitido(C, A) {
    if (A.tipo === 'peroxido' && !FORMAN_PEROXIDO.includes(C.central === 'N' && C.tipo === 'amonio' ? 'NH4' : C.central)) return 'no forma peróxido';
    if (C.tipo === 'amonio' && ['oxido', 'hidruro'].includes(A.tipo)) return 'el amonio no forma óxido ni hidruro';
    return null;
  }
  const HIDROXIDO = ionDe('OH', -1, { central: 'O', tipo: 'hidroxido' });
  const AMONIO = ionDe('NH4', 1, { central: 'N', estado: -3, tipo: 'amonio' });
  const cation = (e, v) => { if (e === 'NH4') return AMONIO; if (e === 'H') return ionDe('H', 1, { central: 'H', estado: 1, tipo: 'proton' });
    if (!esMetal(e) || !ESTADOS[e].m.includes(v)) throw new Error(`${e} no forma catión con ${ftexto([v, 1])}`); return ionDe(e, v, { central: e, estado: v, tipo: 'metal' }); };
  // Lista de aniones que el motor conoce (para descomponer y para el parser de nombres).
  let _aniones = null;
  function aniones() {
    if (_aniones) return _aniones;
    const r = [anionSimple('O'), PEROXIDO, HIDROXIDO, anionSimple('H')];
    for (const e of ['F', 'Cl', 'Br', 'I', 'S', 'Se', 'N', 'P', 'C']) r.push(anionSimple(e));
    for (const e of ['S', 'Se']) r.push(ionDe('H' + e, -1, { central: e, estado: -2, tipo: 'haloideo', h: 1, hAcido: 2 }));
    for (const [e, t] of Object.entries(ESTADOS)) for (const v of t.nm || []) {
      if (e === 'H' || (t.neutros && t.neutros.includes(v))) continue;
      const formas = t.orto ? (e === 'P' && v === 5 ? ['orto', 'meta', 'piro'] : ['orto']) : (e === 'S' && v === 6) || e === 'Cr' ? ['normal', 'di'] : ['normal'];
      for (const f of formas) { const a = oxacidoDe(e, v, f); for (let h = 0; h < a.H; h++) r.push(oxoanion(e, v, f, h)); }
    }
    return (_aniones = r);
  }
  function cationes() {
    const r = [AMONIO, cation('H')];
    for (const [e, t] of Object.entries(ESTADOS)) for (const v of t.m || []) r.push(cation(e, v));
    return r;
  }
  // Busca un ion por su texto: "SO4^2-", "Fe^3+", "NH4^+", "O2^2-".
  function ion(texto) {
    const s = String(texto).replace(/\s/g, '');
    const x = [...cationes(), ...aniones()].find(i => i.formula === s);
    if (!x) throw new Error(`no conozco el ion ${texto}`);
    return x;
  }

  // ---------- Fórmula desde dos fichas: cruce y simplificación ----------
  const parte = (i, n) => (n === 1 ? i.cuerpo : multiplica(i.cuerpo, n));
  // El peróxido (O2) y los iones de un solo elemento se escriben multiplicando el subíndice: O2 × 2 → O4.
  function multiplica(cuerpo, n) { const a = atomos(cuerpo), ks = Object.keys(a); if (ks.length > 1) return `(${cuerpo})${n}`; return ks[0] + (a[ks[0]] * n); }
  function escribirSal(cat, nC, an, nA) { return parte(cat, nC) + parte(an, nA); }
  function formulaDeIones(c, a) {
    const C = typeof c === 'string' ? ion(c) : c, A = typeof a === 'string' ? ion(a) : a;
    if (C.carga <= 0 || A.carga >= 0) throw new Error('hace falta un catión (+) y un anión (−)');
    const no = permitido(C, A); if (no) throw new Error(`${C.formula} con ${A.formula}: ${no}`);
    const p = C.carga, q = -A.carga, g = mcd(p, q), nC = q / g, nA = p / g;
    const formula = escribirSal(C, nC, A, nA);
    // Errores: cruzar sin simplificar, cruzar al revés, escribir el ion sin paréntesis, juntar uno con uno sin contar
    // cargas y "simplificar" el peróxido dividiendo los subíndices escritos.
    const sinSimp = escribirSal(C, q, A, p);
    const conParen = i => i.poli && !(i === PEROXIDO);
    const sinParen = (conParen(C) && nC > 1 ? C.cuerpo + nC : parte(C, nC)) + (conParen(A) && nA > 1 ? A.cuerpo + nA : parte(A, nA));
    const errores = {
      sinSimplificar: g > 1 ? sinSimp : null,
      cruceInvertido: p === q ? null : escribirSal(C, nA, A, nC),
      sinParentesis: (conParen(A) && nA > 1) || (conParen(C) && nC > 1) ? sinParen : null,
      unoAUno: p === q ? null : C.cuerpo + A.cuerpo,
      simplificaTodo: null,
    };
    const at = atomos(formula), gg = Object.values(at).reduce((s, n) => mcd(s, n), 0);
    if (gg > 1 && !C.poli && !(A.poli && A !== PEROXIDO)) errores.simplificaTodo = plana(Object.entries(at).map(([e, n]) => [e, n / gg]));
    return { formula, cation: C.formula, anion: A.formula, nCation: nC, nAnion: nA, cargaPorCation: p, cargaPorAnion: -q, cargaTotalCation: p * nC, cargaTotalAnion: -q * nA, suma: 0,
      cruce: { nCation: q, nAnion: p, formula: sinSimp }, simplifica: g > 1, divisor: g, atomos: at, errores };
  }

  // ---------- Fichas de una fórmula ----------
  // Un tipo de catión y uno o dos tipos de anión (el segundo, solo OH⁻: sal básica). Se prefiere O²⁻ antes que O₂²⁻
  // (PbO₂ es óxido de plomo(IV), no peróxido) y menos tipos de anión.
  function descomponer(f) {
    const s = especie(f), base = s.base, carga = s.carga, cs = cationes(), as = aniones();
    const cands = [];
    for (const C of cs) {
      if (!Object.keys(C.atomos).every(e => base[e])) continue;
      for (const A of as) {
        if (!Object.keys(A.atomos).every(e => base[e])) continue;
        for (const B of [null, HIDROXIDO]) {
          if (B === A) continue;
          for (let nC = 1; nC <= 6; nC++) for (let nA = 1; nA <= 6; nA++) for (let nB = B ? 1 : 0; nB <= (B ? 3 : 0); nB++) {
            if (nC * C.carga + nA * A.carga + nB * (B ? B.carga : 0) !== carga) continue;
            const t = {};
            for (const [e, n] of Object.entries(C.atomos)) t[e] = (t[e] || 0) + n * nC;
            for (const [e, n] of Object.entries(A.atomos)) t[e] = (t[e] || 0) + n * nA;
            if (B) for (const [e, n] of Object.entries(B.atomos)) t[e] = (t[e] || 0) + n * nB;
            if (igualesAtomos(t, base)) cands.push({ cation: C, nCation: nC, anion: A, nAnion: nA, oh: B ? nB : 0 });
          }
        }
      }
    }
    if (!cands.length) return null;
    const peso = x => (x.oh ? 10 : 0) + (x.anion === PEROXIDO ? 5 : 0) + (x.cation.tipo === 'proton' && x.anion.h ? 3 : 0) + (x.anion.forma === 'di' ? 1 : 0);
    cands.sort((a, b) => peso(a) - peso(b));
    const r = cands[0];
    return { cation: r.cation.formula, nCation: r.nCation, anion: r.anion.formula, nAnion: r.nAnion, hidroxidos: r.oh, agua: s.agua, _c: r.cation, _a: r.anion };
  }

  // ---------- Estado de oxidación ----------
  const FIJO = { F: -1, Li: 1, Na: 1, K: 1, Ag: 1, Mg: 2, Ca: 2, Ba: 2, Zn: 2, Al: 3, H: 1, O: -2, Cl: -1, Br: -1, I: -1, S: -2, Se: -2, N: -3, P: -3 };
  const RANGO = { F: 10, Li: 9, Na: 9, K: 9, Ag: 9, Mg: 8, Ca: 8, Ba: 8, Zn: 8, Al: 7, H: 6, O: 5, Cl: 4, Br: 4, I: 4, S: 3, Se: 3, N: 2, P: 2 };
  // Por reglas: todos con su valor fijo salvo el de menor rango, que se despeja de la carga.
  function porReglas(at, carga, f) {
    const els = Object.keys(at);
    if (els.length === 1) return { [els[0]]: fr(carga, at[els[0]]) };
    const orden = [...els].sort((a, b) => (RANGO[b] || 0) - (RANGO[a] || 0) || els.indexOf(a) - els.indexOf(b));
    const ultimo = orden.pop(), r = {}; let suma = [0, 1];
    for (const e of orden) { if (!(e in FIJO)) throw new Error(`no puedo despejar el estado de oxidación en ${f}`); r[e] = fr(FIJO[e]); suma = fsum(suma, fr(FIJO[e] * at[e])); }
    r[ultimo] = fdiv(fsum(fr(carga), fr(-suma[0], suma[1])), at[ultimo]);
    return r;
  }
  // { porElemento: { Fe:[8,3] }, valor: { Fe:2.67 }, texto: { Fe:'+8/3' }, porIon }.
  function oxidacion(f) {
    const s = especie(f), at = s.base, els = Object.keys(at);
    let r = null, porIon = null, reglas = null;
    if (els.length < 3 || s.carga !== 0) { try { reglas = porReglas(at, s.carga, f); } catch (e) { reglas = null; } }
    if (!reglas && s.carga === 0) {
      const d = descomponer(s.cuerpo);
      if (d) {
        const lista = [[d._c, d.nCation], [d._a, d.nAnion]]; if (d.hidroxidos) lista.push([HIDROXIDO, d.hidroxidos]);
        porIon = lista.map(([i, n]) => ({ ion: i.formula, n, estados: Object.fromEntries(Object.entries(porReglas(i.atomos, i.carga, i.formula)).map(([e, x]) => [e, ftexto(x)])) }));
        const tot = {};
        for (const [i, n] of lista) for (const [e, x] of Object.entries(porReglas(i.atomos, i.carga, i.formula))) tot[e] = fsum(tot[e] || [0, 1], fmul(x, i.atomos[e] * n));
        r = {}; for (const e of els) r[e] = fdiv(tot[e], at[e]);
      }
    }
    if (!r) r = reglas || porReglas(at, s.carga, f);
    const valor = {}, texto = {};
    for (const e of els) { valor[e] = r[e][0] / r[e][1]; texto[e] = ftexto(r[e]); }
    if (s.agua) for (const [e, v] of [['H', 1], ['O', -2]]) if (valor[e] === undefined) { r[e] = fr(v); valor[e] = v; texto[e] = ftexto(fr(v)); }
    return { porElemento: r, valor, texto, carga: s.carga, porIon };
  }
  // El estado de un elemento en una fórmula, con lo que da cada error típico.
  function estado(f, e) {
    const s = especie(f), o = oxidacion(f);
    if (!(e in o.porElemento)) throw new Error(`no hay ${e} en ${f}`);
    const x = o.porElemento[e], n = s.base[e];
    // Lo que aportan los demás (suma de cargas sin el elemento): el elemento debe compensar −resto en total.
    let resto = fr(s.carga); for (const [k, v] of Object.entries(o.porElemento)) if (k !== e) resto = fsum(resto, fr(-v[0] * s.base[k], v[1]));
    const total = resto;                         // estado × átomos
    const sinCarga = s.carga ? ftexto(fdiv(fsum(total, fr(-s.carga)), n)) : null;
    return { numero: x[0] / x[1], texto: ftexto(x), fraccion: x, atomos: n, total: ftexto(total),
      errores: {
        subindice: n > 1 ? ftexto(fr(Math.sign(x[0]) * n)) : null,     // "hay 2 Fe → +2"
        sinDividir: n > 1 ? ftexto(total) : null,                      // la carga de todos los átomos, sin dividir
        signo: ftexto(fr(-x[0], x[1])),
        sumaCero: sinCarga,                                            // en un ion, igualar a 0 y no a la carga
      } };
  }

  // ---------- Prefijos, romanos y nombres por partes ----------
  const PREF = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];
  const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const pre = (n, mono) => (n === 1 ? (mono ? 'mono' : '') : PREF[n]);
  const romano = n => ROM[n];
  // Prefijo delante de «óxido», con la elisión de academia: monóxido, dióxido, trióxido, tetróxido, pentóxido, heptóxido.
  const preOxido = n => { const x = pre(n, true); return (/[ao]$/.test(x) && x !== 'di' ? x.slice(0, -1) : x) + 'óxido'; };
  // Un nombre es una lista de partes { t, k }: k es el elemento que da el color, o 'ink'.
  const P = (t, k) => ({ t, k: k || 'ink' });
  const texto = partes => partes ? partes.map(p => p.t).join('').replace(/\s+/g, ' ').trim() : null;
  const nombreEl = (e, n) => (n > 1 ? PREF[n] : '') + ESTADOS[e].nombre;
  // Prefijo y terminación tradicional de un elemento con un estado: ['hipo', 'oso'], ['', 'ico'], ['per', 'ico'].
  function terminacion(e, v, como) {
    const t = ESTADOS[e];
    if (como === 'nm' && t.trad && t.trad[v]) return { prefijo: t.trad[v][0], sufijo: t.trad[v][1], estados: t.nm.length };
    const lista = como === 'm' ? t.m : (t.nm || []);
    const k = lista.indexOf(v); if (k < 0) throw new Error(`${e} no tiene el estado ${ftexto([v, 1])}`);
    const n = lista.length;
    if (n === 1) return { prefijo: '', sufijo: 'ico', estados: 1 };
    if (n === 2) return { prefijo: '', sufijo: k === 0 ? 'oso' : 'ico', estados: 2 };
    if (n === 3) return { prefijo: k === 0 ? 'hipo' : '', sufijo: k === 2 ? 'ico' : 'oso', estados: 3 };
    return { prefijo: k === 0 ? 'hipo' : k === 3 ? 'per' : '', sufijo: k <= 1 ? 'oso' : 'ico', estados: n };
  }
  const adj = (e, v, como) => { const t = terminacion(e, v, como); return t.prefijo + ESTADOS[e][t.sufijo] + t.sufijo; };
  const swap = s => (s === 'oso' ? 'ico' : 'oso');
  // Nombre tradicional del catión dentro de un compuesto: "férrico" (varios estados) o "de sodio".
  function catTrad(C) {
    if (C.tipo === 'amonio') return [P(' de '), P('amonio', 'N')];
    if (C.tipo === 'proton') return [P(' de '), P('hidrógeno', 'H')];
    return ESTADOS[C.central].m.length > 1 ? [P(' '), P(adj(C.central, C.estado, 'm'), C.central)] : [P(' de '), P(ESTADOS[C.central].nombre, C.central)];
  }
  // "de hierro(III)" o "de sodio".
  function catStock(C, n) {
    if (C.tipo === 'amonio') return [P(' de '), P('amonio', 'N')];
    if (C.tipo === 'proton') return [P(' de '), P(nombreEl('H', n || 1), 'H')];
    return [P(' de '), P((n > 1 ? PREF[n] : '') + ESTADOS[C.central].nombre, C.central), ...(varios(C.central) ? [P(`(${romano(C.estado)})`)] : [])];
  }
  // Nombre del anión: tradicional (sulfato), sistemático (tetraoxosulfato (VI)).
  function anTrad(A) {
    if (A.tipo === 'oxido') return [P('óxido', 'O')];
    if (A.tipo === 'peroxido') return [P('peróxido', 'O')];
    if (A.tipo === 'hidroxido') return [P('hidróxido', 'O')];
    if (A.tipo === 'hidruro') return [P('hidruro', 'H')];
    if (A.tipo === 'haloideo') return [P(ESTADOS[A.central].uro + 'uro', A.central)];
    const t = terminacion(A.central, A.estado, 'nm'), forma = A.forma === 'meta' || A.forma === 'piro' ? A.forma : A.forma === 'di' ? 'di' : '';
    return [P(forma + t.prefijo + ESTADOS[A.central].an + (t.sufijo === 'oso' ? 'ito' : 'ato'), A.central)];
  }
  function anSist(A) {
    if (A.tipo !== 'oxoanion') return anTrad(A);
    return [P(pre(A.O) + 'oxo', 'O'), P(pre(A.X) + ESTADOS[A.central].an + 'ato', A.central), P(` (${romano(A.estado)})`)];
  }
  const conH = (h, partes) => (h ? [P((h > 1 ? PREF[h] : '') + 'hidrogeno', 'H'), ...partes] : partes);

  // Nombre de un ion suelto, para rotular las fichas: «sulfato», «hidrogenocarbonato», «hierro(III)», «amonio».
  function nombreIon(t) {
    const I = typeof t === 'string' ? ion(t) : t;
    if (I.carga > 0) return I.tipo === 'amonio' ? 'amonio' : I.tipo === 'proton' ? 'hidrógeno' : ESTADOS[I.central].nombre + (varios(I.central) ? `(${romano(I.carga)})` : '');
    if (I.h && I.tipo === 'oxoanion') return texto(conH(I.h, anTrad({ ...I, h: 0 })));
    if (I.h) return 'hidrogeno' + texto(anTrad(I));
    return texto(anTrad(I));
  }

  // ---------- Clasificar ----------
  function clasificar(f) {
    const s = especie(f), at = s.base, els = Object.keys(at);
    if (s.carga) return { funcion: s.carga > 0 ? 'catión' : 'anión', grupo: 'ion' };
    const r = clasificarBase(s, at, els, f);
    if (s.agua) return { ...r, funcion: 'sal hidratada', base: r.funcion, agua: s.agua };
    return r;
  }
  function clasificarBase(s, at, els, f) {
    if (els.length === 1) return { funcion: 'elemento' };
    if (els.length === 2 && at.H === 2 && at.O === 1) return { funcion: 'agua' };
    if (els.length === 2 && at.O) {
      const e = els.find(x => x !== 'O');
      if (e === 'H') return { funcion: 'peróxido', elemento: 'H' };
      if (e === 'F') return { funcion: 'fluoruro de oxígeno' };
      const o = oxidacion(f).porElemento, v = o[e], t = ESTADOS[e];
      if (o.O[0] === -1 && o.O[1] === 1) return FORMAN_PEROXIDO.includes(e) ? { funcion: 'peróxido', elemento: e, estado: v[0] / v[1] } : { funcion: 'otra' };
      if (v[1] !== 1) return { funcion: 'óxido salino (doble)', elemento: e, estado: v[0] / v[1] };
      if (esMetal(e) && t.m.includes(v[0])) return { funcion: 'óxido básico', elemento: e, estado: v[0] };
      if ((t.nm || []).includes(v[0])) return { funcion: (t.neutros || []).includes(v[0]) ? 'óxido neutro' : 'óxido ácido', elemento: e, estado: v[0] };
      if (esMetal(e) && t.m.includes(v[0] / 2)) return { funcion: 'peróxido', elemento: e, estado: v[0] / 2 };
      return { funcion: 'óxido', elemento: e, estado: v[0] };
    }
    if (els.length === 2 && at.H) {
      const e = els.find(x => x !== 'H');
      if (esMetal(e)) return { funcion: 'hidruro metálico', elemento: e, estado: at.H / at[e] };
      if (ESTADOS[e].hidr) return { funcion: s.acuoso ? 'hidrácido' : 'hidruro no metálico', elemento: e, enAgua: 'hidrácido' };
      return { funcion: 'hidruro no metálico', elemento: e };
    }
    const d = descomponer(s.cuerpo);
    if (!d) return { funcion: 'otra' };
    const C = d._c, A = d._a;
    if (C.tipo === 'proton') {
      if (A.tipo === 'oxoanion') return { funcion: 'oxácido', elemento: A.central, estado: A.estado };
      return { funcion: s.acuoso ? 'hidrácido' : 'hidruro no metálico', elemento: A.central };
    }
    if (d.hidroxidos) return { funcion: 'sal básica', anion: A.formula };
    if (permitido(C, A)) return { funcion: 'otra' };
    if (A.tipo === 'hidroxido') return { funcion: 'hidróxido', elemento: C.central, estado: C.estado };
    if (A.tipo === 'hidruro') return { funcion: 'hidruro metálico', elemento: C.central };
    if (A.tipo === 'peroxido') return { funcion: 'peróxido', elemento: C.central };
    if (A.tipo === 'oxido') return { funcion: 'óxido básico', elemento: C.central };
    if (A.h) return { funcion: 'sal ácida', anion: A.formula, de: A.tipo === 'oxoanion' ? 'oxisal' : 'haloidea' };
    if (A.tipo === 'oxoanion') return { funcion: 'oxisal', anion: A.formula };
    return { funcion: 'sal haloidea', anion: A.formula };
  }

  // ---------- Formar por el árbol ----------
  function oxido(e, v) {
    const g = mcd(2, v), a = 2 / g, b = v / g;
    return { a, b, formula: plana([[e, a], ['O', b]]), sinSimplificar: plana([[e, 2], ['O', v]]) };
  }
  const coefTxt = (c, f) => (c === 1 ? '' : c) + f;
  function ecuacionTxt(izq, der) { return izq.map(([c, f]) => coefTxt(c, f)).join(' + ') + ' -> ' + der.map(([c, f]) => coefTxt(c, f)).join(' + '); }
  // Elemento con O₂: x E + y O₂ → z EaOb (menores enteros). El elemento se escribe como E (O₂ y H₂ como moléculas).
  function conO2(e, a, b) { let x = a, y = b, z = 1; if (b % 2) { x *= 2; y = b; z = 2; } else y = b / 2; const g = mcd(mcd(x, y), z); return [[x / g, e], [y / g, 'O2'], [z / g]]; }
  function formar(funcion, e, v, op) {
    op = op || {};
    const t = ESTADOS[e]; if (!t) throw new Error(`no conozco el elemento ${e}`);
    if (funcion === 'oxido' || funcion === 'oxidoBasico' || funcion === 'oxidoAcido') {
      const basico = esMetal(e) && t.m.includes(v) && funcion !== 'oxidoAcido';
      if (!basico && !(t.nm || []).includes(v)) throw new Error(`${e} no tiene el estado ${ftexto([v, 1])}`);
      const o = oxido(e, v), [x, y, z] = conO2(e, o.a, o.b);
      const eo = estado(o.formula, e);
      return { formula: o.formula, funcion: basico ? 'óxido básico' : clasificar(o.formula).funcion, reaccion: ecuacionTxt([x, y], [[z[0], o.formula]]),
        nombres: nombrar(o.formula), errores: { sinSimplificar: o.sinSimplificar !== o.formula ? o.sinSimplificar : null, cruceInvertido: v === 2 ? null : plana([[e, v / mcd(2, v)], ['O', 2 / mcd(2, v)]]), subindiceComoEstado: eo.errores.subindice } };
    }
    if (funcion === 'hidroxido') {
      if (!esMetal(e) || !t.m.includes(v)) throw new Error(`${e} no forma hidróxido con ${ftexto([v, 1])}`);
      const f = formulaDeIones(cation(e, v), HIDROXIDO).formula, o = oxido(e, v);
      // óxido + agua → hidróxido: EaOb + b H2O → a E(OH)v (a ≤ 2).
      const cOx = 1, cAg = o.b, cHi = o.a;
      return { formula: f, funcion: 'hidróxido', reaccion: ecuacionTxt([[cOx, o.formula], [cAg, 'H2O']], [[cHi, f]]), nombres: nombrar(f),
        errores: { sinParentesis: v > 1 ? e + 'OH' + v : null, unSoloOH: v > 1 ? e + 'OH' : null } };
    }
    if (funcion === 'oxacido') {
      const a = oxacidoDe(e, v, op.forma), f = plana([['H', a.H], [e, a.X], ['O', a.O]]);
      const sin = a.sinSimplificar, sinTxt = plana([['H', sin.H], [e, sin.X], ['O', sin.O]]);
      const otro = (t.nm || []).filter(x => x !== v && !(t.neutros || []).includes(x));
      const vecino = otro.length ? otro.reduce((m, x) => (Math.abs(x - v) < Math.abs(m - v) ? x : m)) : null;
      const reac = ecuacionTxt([[a.nOx, a.oxidoFormula], [a.nAgua, 'H2O']], [[sin.H / a.H, f]]);
      const errores = {
        sinSimplificar: sinTxt !== f ? sinTxt : null,
        unSoloH: a.H > 1 ? plana([['H', 1], [e, a.X], ['O', a.O]]) : null,
        otroEstado: vecino !== null ? (b => plana([['H', b.H], [e, b.X], ['O', b.O]]))(oxacidoDe(e, vecino)) : null,
        hidracidoYOxigeno: e === 'S' && v === 6 && !op.forma ? 'H2S + 2O2' : null,
        dosH: a.H === 1 ? plana([['H', 2], [e, a.X], ['O', a.O]]) : null,
      };
      return { formula: f, funcion: 'oxácido', forma: a.forma, oxido: a.oxidoFormula, agua: a.nAgua, reaccion: reac, nombres: nombrar(f), errores };
    }
    if (funcion === 'hidruro' || funcion === 'hidracido') {
      let f;
      if (esMetal(e)) { if (funcion === 'hidracido') throw new Error('un metal no forma hidrácido'); f = formulaDeIones(cation(e, v), anionSimple('H')).formula; }
      else {
        const n = -t.neg; if (!n) throw new Error(`${e} no forma hidruro`);
        f = t.grupo >= 16 ? plana([['H', n], [e, 1]]) : plana([[e, 1], ['H', n]]);
        if (funcion === 'hidracido') { if (!t.hidr) throw new Error(`${e} no forma hidrácido`); f += '(ac)'; }
      }
      return { formula: f, funcion: clasificar(f).funcion, nombres: nombrar(f) };
    }
    throw new Error(`no conozco la función ${funcion}`);
  }
  // Ácido + hidróxido → sal + agua. op.quitar: cuántos H se quitan a cada molécula de ácido (sal ácida si quedan H).
  function neutralizar(acido, base, op) {
    op = op || {};
    const da = descomponer(especie(acido).cuerpo), db = descomponer(base);
    const sa = especie(acido);
    let A;
    if (da && da._c.tipo === 'proton') A = da._a;
    else if (Object.keys(sa.base).length === 2 && sa.base.H) { const e = Object.keys(sa.base).find(x => x !== 'H'); A = anionSimple(e); }
    if (!A || !db || db._a.tipo !== 'hidroxido') throw new Error('hace falta un ácido y un hidróxido');
    const hTotal = sa.base.H, quitar = op.quitar || hTotal;
    if (quitar > hTotal || quitar < 1) throw new Error('no se pueden quitar tantos H');
    const quedan = hTotal - quitar;
    const An = quedan ? [...aniones()].find(x => x.central === A.central && x.estado === A.estado && x.forma === A.forma && (x.h || 0) === quedan && x.tipo === A.tipo) : (A.h ? aniones().find(x => x.central === A.central && x.estado === A.estado && x.forma === A.forma && !x.h && x.tipo === A.tipo) : A);
    if (!An) throw new Error('no conozco ese anión');
    const C = db._c, sal = formulaDeIones(C, An), m = C.carga;
    const cAc = sal.nAnion, cBa = sal.nCation, cAg = cBa * m;
    const ec = ecuacionTxt([[cAc, especie(acido).cuerpo], [cBa, base]], [[1, sal.formula], [cAg, 'H2O']]);
    const nTodo = quedan ? formulaDeIones(C, aniones().find(x => x.central === An.central && x.estado === An.estado && x.forma === An.forma && !x.h && x.tipo === An.tipo)).formula : null;
    return { sal: sal.formula, agua: cAg, coefs: [cAc, cBa, 1, cAg], ecuacion: ec, anion: An.formula, cation: C.formula, nombres: nombrar(sal.formula),
      errores: { ...sal.errores, quitaTodos: nTodo, sinQuitar: quedan ? (C.cuerpo + 'H' + (quedan + 1 > 1 ? quedan + 1 : '') + plana([[An.central, An.X], ['O', An.O]])) : null,
        // Le deja al anión con H la carga del anión sin H (HCO₃ con −2): K₂HCO₃.
        cargaSinH: quedan && C.carga === 1 ? parte(C, hTotal) + An.cuerpo : null } };
  }

  // ---------- Nombrar ----------
  function nombrar(f) {
    const s = especie(f), at = s.base, els = Object.keys(at), cl = clasificar(f);
    const fn = cl.funcion === 'sal hidratada' ? cl.base : cl.funcion;
    if (['otra', 'óxido', 'catión', 'anión', 'fluoruro de oxígeno'].includes(fn)) throw new Error(`no sé nombrar ${f}: no es un compuesto de las funciones de esta escena`);
    let sis = null, sto = null, tra = null, comun = null; const err = {};
    const ox = () => oxidacion(s.cuerpo).porElemento;
    if (fn === 'agua') { sis = [P('monóxido', 'O'), P(' de '), P('dihidrógeno', 'H')]; tra = [P('agua')]; comun = 'agua'; }
    else if (fn === 'óxido básico' || fn === 'óxido ácido' || fn === 'óxido neutro') {
      const e = cl.elemento, v = cl.estado, b = at.O, a = at[e];
      sis = [P(preOxido(b), 'O'), P(' de '), P(nombreEl(e, a), e)];
      sto = [P('óxido', 'O'), P(' de '), P(ESTADOS[e].nombre, e), ...(varios(e) ? [P(`(${romano(v)})`)] : [])];
      if (fn === 'óxido básico') tra = ESTADOS[e].m.length > 1 ? [P('óxido', 'O'), P(' '), P(adj(e, v, 'm'), e)] : [P('óxido', 'O'), P(' de '), P(ESTADOS[e].nombre, e)];
      else if (fn === 'óxido ácido') tra = [P('anhídrido', 'O'), P(' '), P(adj(e, v, 'nm'), e)];
      if (varios(e)) {
        const roman = k => (k >= 1 && k <= 8 ? [P('óxido', 'O'), P(' de '), P(ESTADOS[e].nombre, e), P(`(${romano(k)})`)] : null);
        err.stockSubindice = a !== v ? texto(roman(a)) : null;
        err.stockSinDividir = a > 1 ? texto(roman(v * a)) : null;
        err.stockSinNumero = texto([P('óxido de ' + ESTADOS[e].nombre)]);
        if (fn === 'óxido básico' && ESTADOS[e].m.length === 2) err.tradicionalAlReves = 'óxido ' + ESTADOS[e][swap(terminacion(e, v, 'm').sufijo)] + swap(terminacion(e, v, 'm').sufijo);
      }
    } else if (fn === 'óxido salino (doble)') {
      const e = cl.elemento; sis = [P(preOxido(at.O), 'O'), P(' de '), P(nombreEl(e, at[e]), e)]; comun = e === 'Fe' ? 'magnetita' : null;
      tra = ESTADOS[e].m.length === 2 ? [P('óxido', 'O'), P(' '), P(ESTADOS[e].oso + 'oso', e), P('-'), P(ESTADOS[e].ico + 'ico', e)] : null;
    } else if (fn === 'peróxido') {
      const e = els.find(x => x !== 'O');
      sis = [P(preOxido(at.O), 'O'), P(' de '), P(nombreEl(e, at[e]), e)];
      sto = [P('peróxido', 'O'), P(' de '), P(ESTADOS[e].nombre, e)]; tra = sto.slice();
      if (e === 'H') { comun = 'agua oxigenada'; sto = null; }
    } else if (fn === 'hidruro no metálico' || fn === 'hidrácido') {
      const e = cl.elemento, t = ESTADOS[e];
      if (t.grupo >= 16) {
        const g = [P(t.uro + 'uro', e), P(' de '), P('hidrógeno', 'H')];
        if (fn === 'hidrácido') { tra = [P('ácido', 'H'), P(' '), P(t.hidr + 'ídrico', e)]; err.sinAgua = texto(g); }
        else { sis = g; tra = g.slice(); err.enAgua = 'ácido ' + t.hidr + 'ídrico'; }
      } else {
        sis = [P(pre(at.H) + 'hidruro', 'H'), P(' de '), P(t.nombre, e)];
        comun = { N: 'amoniaco', C: 'metano', P: 'fosfina', Si: 'silano', B: 'borano' }[e] || null; tra = comun ? [P(comun, e)] : null;
      }
    } else if (cl.funcion === 'elemento') { tra = [P(ESTADOS[els[0]].nombre, els[0])]; }
    else {
      const d = descomponer(s.cuerpo); if (!d) throw new Error(`no sé nombrar ${f}`);
      const C = d._c, A = d._a, nC = d.nCation, nA = d.nAnion;
      if (fn === 'oxácido') {
        const e = A.central, v = A.estado, tt = terminacion(e, v, 'nm'), forma = A.forma === 'normal' ? '' : A.forma === 'orto' ? '' : A.forma;
        tra = [P('ácido', 'H'), P(' '), P(forma + tt.prefijo + ESTADOS[e][tt.sufijo] + tt.sufijo, e)];
        if (A.forma === 'orto' && e === 'P' && v === 5) comun = 'ácido orto' + ESTADOS[e][tt.sufijo] + tt.sufijo;
        sis = [...anSist(A), P(' de '), P('hidrógeno', 'H')];
        sto = [P('ácido', 'H'), P(' '), P(pre(A.O) + 'oxo', 'O'), P(pre(A.X) + ESTADOS[e].ico + 'ico', e), P(` (${romano(v)})`)];
        const t2 = { ...tt, sufijo: swap(tt.sufijo) };
        err.terminacionAlReves = 'ácido ' + t2.prefijo + ESTADOS[e][t2.sufijo] + t2.sufijo;
      } else if (fn === 'hidróxido' && C.tipo === 'amonio') {
        sis = [P('hidróxido', 'O'), P(' de '), P('amonio', 'N')]; sto = sis.slice(); tra = sis.slice();
      } else if (fn === 'hidróxido') {
        const e = C.central;
        sis = [P(pre(nA, varios(e)) + 'hidróxido', 'O'), P(' de '), P(ESTADOS[e].nombre, e)];
        sto = [P('hidróxido', 'O'), ...catStock(C)]; tra = [P('hidróxido', 'O'), ...catTrad(C)];
        if (ESTADOS[e].m.length === 2) err.tradicionalAlReves = 'hidróxido ' + ESTADOS[e][swap(terminacion(e, C.estado, 'm').sufijo)] + swap(terminacion(e, C.estado, 'm').sufijo);
      } else if (fn === 'hidruro metálico') {
        const e = C.central;
        sis = [P(pre(nA, varios(e)) + 'hidruro', 'H'), P(' de '), P(ESTADOS[e].nombre, e)];
        sto = [P('hidruro', 'H'), ...catStock(C)]; tra = [P('hidruro', 'H'), ...catTrad(C)];
      } else if (fn === 'sal haloidea' || (fn === 'sal ácida' && A.tipo === 'haloideo')) {
        if (A.h) {
          sto = [P('hidrogeno', 'H'), ...anTrad(A), ...catStock(C)]; sis = sto.slice();
          tra = [...anTrad(A), P(' ácido'), ...catTrad(C)]; comun = 'bi' + texto(anTrad(A)) + ' ' + texto(catStock(C));
        } else {
          sis = [P(pre(nA, C.tipo === 'metal' && varios(C.central)) + ESTADOS[A.central].uro + 'uro', A.central), P(' de '), P(nombreEl(C.central, nC), C.central)];
          if (C.tipo === 'amonio') sis = [P(pre(nA) + ESTADOS[A.central].uro + 'uro', A.central), P(' de '), P('amonio', 'N')];
          sto = [...anTrad(A), ...catStock(C)]; tra = [...anTrad(A), ...catTrad(C)];
        }
        Object.assign(err, erroresAnion(A, C));
      } else if (fn === 'oxisal' || fn === 'sal ácida') {
        const h = A.h || 0;
        const aT = anTrad(A).map(p => ({ ...p })), aS = anSist(A).map(p => ({ ...p }));
        if (h) {
          // Sal ácida: el anión con sus H. Tradicional "carbonato ácido de potasio"; stock "hidrogenocarbonato de potasio".
          const base = { ...A, h: 0 }, bT = anTrad(base);
          tra = [...bT, P(' ' + (h > 1 ? PREF[h] : '') + 'ácido'), ...(C.tipo === 'metal' && ESTADOS[C.central].m.length === 1 ? [P(' de '), P(ESTADOS[C.central].nombre, C.central)] : catTrad(C))];
          sto = [...conH(h, bT), ...catStock(C)];
          sis = [...conH(h, anSist(base)), ...catStock(C)];
          if (h === 1 && A.hAcido === 2) comun = 'bi' + texto(bT) + ' ' + texto(catStock(C));
        } else { tra = [...aT, ...catTrad(C)]; sto = [...aT, ...catStock(C)]; sis = [...aS, ...catStock(C)]; }
        Object.assign(err, erroresAnion(A, C));
      } else if (fn === 'sal básica') {
        const k = d.hidroxidos, pk = k > 1 ? PREF[k] : '';
        tra = [...anTrad(A), P(k > 1 ? ' dibásico' : ' básico'), P(' de '), P(ESTADOS[C.central].nombre, C.central), ...(varios(C.central) ? [P(`(${romano(C.estado)})`)] : [])];
        sto = [P(pk + 'hidroxi', 'O'), ...anTrad(A), ...catStock(C)]; sis = sto.slice();
      }
    }
    if (cl.funcion === 'sal hidratada') {
      const fin = [P(' ' + pre(s.agua, true) + 'hidratado', 'H')];
      sis = sis && [...sis, ...fin]; sto = sto && [...sto, ...fin]; tra = tra && [...tra, ...fin];
      if (comun) comun += ' ' + pre(s.agua, true) + 'hidratado';
    }
    const fuera = x => x && x.filter(p => p.t !== '');
    return { formula: s.formula, funcion: cl.funcion, base: cl.base || null,
      sistematica: texto(sis), stock: texto(sto), tradicional: texto(tra), comun,
      partes: { sistematica: fuera(sis), stock: fuera(sto), tradicional: fuera(tra) }, errores: err };
  }
  // Errores de la terminación del anión en las sales (tradicional, con el mismo catión).
  function erroresAnion(A, C) {
    const cat = texto(catTrad(C)), e = A.central, r = {};
    if (A.tipo === 'oxoanion') {
      const t = terminacion(e, A.estado, 'nm'), an = ESTADOS[e].an, forma = A.forma === 'meta' || A.forma === 'piro' || A.forma === 'di' ? A.forma : '';
      const hTxt = A.h ? ' ' + (A.h > 1 ? PREF[A.h] : '') + 'ácido' : '';
      r.terminacionAlReves = forma + t.prefijo + an + (t.sufijo === 'oso' ? 'ato' : 'ito') + hTxt + ' ' + cat.trim();
      if (ESTADOS[e].uro) r.terminacionUro = ESTADOS[e].uro + 'uro' + hTxt + ' ' + cat.trim();
      r.sinCambiar = forma + t.prefijo + ESTADOS[e][t.sufijo] + t.sufijo + hTxt + ' ' + cat.trim();
      // Hipo- con el estado -oso que no es el menor (hiposulfito por sulfito: el hiposulfito es el del S +2).
      if (t.sufijo === 'oso' && !t.prefijo) r.hipoEnVezDeOso = 'hipo' + an + 'ito' + hTxt + ' ' + cat.trim();
      for (const k of Object.keys(r)) r[k] = r[k].replace(/\s+/g, ' ').replace(/ de de /, ' de ');
    } else if (A.tipo === 'haloideo') {
      r.sinCambiar = ESTADOS[e].hidr ? (ESTADOS[e].hidr + 'ídrico ' + cat.trim()).replace(/\s+/g, ' ') : null;
      r.conOxigeno = ESTADOS[e].an ? (ESTADOS[e].an + 'ato ' + cat.trim()).replace(/\s+/g, ' ') : null;
    }
    return r;
  }

  // ---------- Del nombre a la fórmula ----------
  // Se arma el diccionario con los nombres de todo lo que el motor sabe formar (en las tres nomenclaturas y los
  // nombres comunes) y se busca el nombre normalizado. Los hidratos se reconocen por su terminación.
  const normal = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s*\(\s*/g, ' (').replace(/\s*\)/g, ')')
    .replace(/\bacido\b/g, 'acido').replace(/amoniaco/g, 'amoniaco').replace(/\s+/g, ' ').trim();
  let _dic = null;
  function universo() {
    const fs = new Set();
    const metales = Object.keys(ESTADOS).filter(esMetal);
    for (const e of metales) for (const v of ESTADOS[e].m) {
      fs.add(formar('oxido', e, v).formula); fs.add(formar('hidroxido', e, v).formula); fs.add(formar('hidruro', e, v).formula);
    }
    for (const [e, t] of Object.entries(ESTADOS)) {
      if (e === 'O' || e === 'H') continue;
      for (const v of t.nm || []) { fs.add(oxido(e, v).formula); if (!(t.neutros || []).includes(v)) { fs.add(formar('oxacido', e, v).formula); } }
      if (t.neg !== undefined && !esMetal(e)) { fs.add(formar('hidruro', e).formula); if (t.hidr) fs.add(formar('hidracido', e).formula); }
    }
    fs.add('H2O'); fs.add('H2O2'); fs.add('HPO3'); fs.add('H4P2O7'); fs.add('H2Cr2O7'); fs.add('H2S2O7');
    for (const e of FORMAN_PEROXIDO.filter(x => x !== 'H')) fs.add(formulaDeIones(cation(e, ESTADOS[e].m[0]), PEROXIDO).formula);
    fs.add('NH4OH');
    const ans = aniones().filter(a => a.tipo === 'oxoanion' || (a.tipo === 'haloideo' && ['F', 'Cl', 'Br', 'I', 'S', 'Se'].includes(a.central)));
    const cats = cationes().filter(c => c.tipo !== 'proton');
    // Sin sales de Cr o Mn con aniones de Cr o Mn (CrMnO₄ y MnCrO₄ no se distinguen por sus átomos).
    for (const C of cats) for (const A of ans) if (!permitido(C, A) && !(['Cr', 'Mn'].includes(C.central) && ['Cr', 'Mn'].includes(A.central))) fs.add(formulaDeIones(C, A).formula);
    // Sales básicas comunes (un OH).
    for (const e of ['Mg', 'Ca', 'Ba', 'Zn']) for (const x of ['Cl', 'Br', 'I']) fs.add(`${e}(OH)${x}`);
    for (const e of ['Mg', 'Ca']) fs.add(`${e}(OH)NO3`);
    fs.add('Al(OH)2Cl'); fs.add('Al(OH)SO4');
    return [...fs];
  }
  function diccionario() {
    if (_dic) return _dic;
    const d = new Map(), poner = (n, f) => { if (!n) return; const k = normal(n); if (!d.has(k)) d.set(k, f); };
    for (const f of universo()) {
      let r; try { r = nombrar(f); } catch (e) { continue; }
      for (const n of [r.sistematica, r.stock, r.tradicional, r.comun]) poner(n, f);
      // Variantes aceptadas: sin espacio antes del romano, pentóxido/heptóxido, «óxido sódico», «óxido de hierro» con un estado.
      for (const n of [r.sistematica, r.stock, r.tradicional]) if (n) {
        poner(n.replace(/ \(/g, '('), f);
        poner(n.replace(/pentóxido/, 'pentaóxido').replace(/heptóxido/, 'heptaóxido').replace(/hexóxido/, 'hexaóxido').replace(/tetróxido/, 'tetraóxido'), f);
        poner(n.replace(/^mono(?!xido)/, ''), f);
        poner(n.replace(/^monóxido de/, 'óxido de'), f);
      }
      if (r.funcion === 'hidrácido') poner(r.tradicional + ' (ac)', f);
    }
    poner('amoníaco', 'NH3'); poner('ácido ortofosfórico', 'H3PO4'); poner('ácido metafosfórico', 'HPO3'); poner('ácido pirofosfórico', 'H4P2O7');
    return (_dic = d);
  }
  function formulaDeNombre(nombre) {
    let n = normal(nombre), agua = 0;
    const m = n.match(/^(.*) (mono|di|tri|tetra|penta|hexa|hepta|octa|nona|deca)hidratad[oa]$/);
    if (m) { n = m[1]; agua = PREF.indexOf(m[2]); }
    const f = diccionario().get(n);
    if (!f) throw new Error(`no conozco el nombre «${nombre}»`);
    const formula = agua ? `${f}·${agua === 1 ? '' : agua}H2O` : f;
    return { formula, funcion: clasificar(formula).funcion };
  }

  // ---------- Hidratos (para la predicción y el papel) ----------
  function hidratoDe(sal, n) {
    const f = `${sal}·${n === 1 ? '' : n}H2O`, d = descomponer(sal), mm = masaMolar(f), ma = 18 * n;
    const C = d._c;
    // Errores: leer el romano como subíndice del metal; juntar el agua en la fórmula (subíndices en vez de coeficiente);
    // cruzar y no simplificar.
    const romanoSub = C.tipo === 'metal' && C.estado > 1 ? `${multiplica(C.cuerpo, C.estado)}${d.nAnion === 1 ? d._a.cuerpo : `(${d._a.cuerpo})${d.nAnion}`}·${n}H2O` : null;
    const g = d._a.carga, sinSimp = C.tipo === 'metal' && mcd(C.carga, -g) > 1 && d.nCation === 1 && d.nAnion === 1 ? `${C.cuerpo}${-g}(${d._a.cuerpo})${C.carga}·${n}H2O` : null;
    return { formula: f, masaMolar: mm, masaAgua: ma, porcentajeAgua: 100 * ma / mm, nombres: nombrar(f),
      errores: { romanoComoSubindice: romanoSub, juntaElAgua: d._c.cuerpo + (d.nAnion === 1 ? d._a.cuerpo : `(${d._a.cuerpo})${d.nAnion}`) + 'H' + 2 * n + 'O' + n, sinSimplificar: sinSimp,
        porcentajeUnaAgua: 100 * 18 / (mm - ma + 18), porcentajeSobreAnhidra: 100 * ma / (mm - ma) } };
  }

  return { ESTADOS, MASAS, especie, atomos, masaMolar, ion, cationes, aniones, formulaDeIones, descomponer, oxidacion, estado,
    clasificar, formar, oxido, neutralizar, nombrar, formulaDeNombre, universo, LIBRES, nombreIon, permitido: (c, a) => permitido(typeof c === 'string' ? ion(c) : c, typeof a === 'string' ? ion(a) : a), FORMAN_PEROXIDO, terminacion, romano, hidratoDe, mcd, fraccionTexto: ftexto };
});
