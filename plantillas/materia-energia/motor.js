/*
 * Motor de «La lupa y la balanza: materia y energía».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorMateria) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * La idea que manda: la lupa de partículas decide. Un sistema es una lista de partículas
 *   { formula: 'H2O', n: 6, fase: 'agua', estado: 'l', sustancia: 'NaCl' (si es un ion de una sal disuelta) }
 * y de esa lista sale todo:
 *   - especie(f): átomos de una fórmula ("H2O", "C12H22O11", "Na^+", "n" el neutrón) y si es elemento (un solo tipo
 *     de átomo, aunque forme moléculas como O₂ u O₃) o compuesto (dos o más tipos de átomo unidos).
 *   - clasificarCaja(lista): sustancia pura (elemento o compuesto) o mezcla; homogénea o heterogénea según sus fases.
 *     Las sustancias se cuentan por fórmula (o por `sustancia`, para los iones de una sal disuelta).
 *   - contarSistema(partes): el conteo de academia de un sistema descrito por sus partes (agua, hielo, sal disuelta…):
 *     fases (zonas con propiedades distintas; la sal disuelta está en la fase del agua), componentes (sustancias:
 *     el hielo y el agua son una sola), elementos (especies atómicas) y átomos por unidad de cada componente.
 *   - cambio(antes, despues): físico (las mismas sustancias, reacomodadas o en otro estado), químico (aparecen sustancias
 *     nuevas con los mismos átomos) o nuclear (cambian los elementos). FENOMENOS trae los de examen.
 *   - burbujas(f): qué hay en las burbujas de un líquido que hierve (su propio vapor).
 *   - evaporar(...) y quemarMetal(...): la balanza en frasco cerrado y abierto (Lavoisier). En cerrado la masa no cambia
 *     nunca; en abierto baja en lo que sale como gas y sube en lo que entra del aire.
 *   - separar(mezcla, metodo) y metodoPara(mezcla): qué hace cada método (filtración, decantación, destilación,
 *     imantación, evaporación) según la propiedad que difiere, también con el método equivocado. MEZCLAS trae las de la escena.
 *   - energia(m, unidad), masaDeEnergia(E), defectoMasa(antes, despues) y balanzaNuclear(E): E = mc² con c = 3 × 10⁸ m/s.
 *   - propiedad(nombre) y clasificarPropiedades(lista): intensivas o extensivas, físicas o químicas, y si una sola
 *     partícula las tiene (AT1/MA11).
 *   - hervir(...): la meseta de la ebullición (MA6/MA7), corta; la escena completa es plantillas/calorimetria/.
 *   - material(nombre): sustancias y mezclas de examen (aire, acero, agua de mar, diamante…), clasificadas con su lupa.
 * Cada función que alimenta una predicción devuelve además `errores`: lo que da cada error típico (MA1 a MA11 y la tabla
 * «Lo que no tiene respaldo» de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md).
 * Masas atómicas de academia (H = 1, C = 12, O = 16, Na = 23, Cl = 35,5, Fe = 56…); masas en gramos. Donde hay
 * cuentas con decimales, se hacen con fracciones exactas (enteros escalados) y se devuelven como número.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMateria = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = Object.freeze({ H: 1, He: 4, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, Si: 28, S: 32, Cl: 35.5, K: 39,
    Ca: 40, Fe: 56, Cu: 63.5, Zn: 65, Kr: 84, Ag: 108, Sn: 119, I: 127, Ba: 137, Au: 197, Hg: 200.6, Pb: 207, U: 235 });
  const NOMBRES = Object.freeze({ H: 'hidrógeno', He: 'helio', C: 'carbono', N: 'nitrógeno', O: 'oxígeno', Na: 'sodio',
    Mg: 'magnesio', Al: 'aluminio', Si: 'silicio', S: 'azufre', Cl: 'cloro', K: 'potasio', Ca: 'calcio', Fe: 'hierro',
    Cu: 'cobre', Zn: 'zinc', Kr: 'kriptón', Ag: 'plata', Sn: 'estaño', I: 'yodo', Ba: 'bario', Au: 'oro', Hg: 'mercurio',
    Pb: 'plomo', U: 'uranio' });
  // Elementos que en estado libre forman moléculas de dos átomos (para el error «las burbujas son H₂ y O₂»).
  const DIATOMICOS = ['H', 'N', 'O', 'Cl'];

  // ---------- Números exactos ----------
  // Las masas de la escena tienen a lo más 4 decimales: se suman como enteros en diezmilésimas.
  const ESC = 10000;
  const ent = x => Math.round(x * ESC);
  const num = k => k / ESC;
  const suma = (...xs) => num(xs.reduce((s, x) => s + ent(x), 0));
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // ---------- Especies ----------
  // "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }; "Na^+" → { Na: 1 } con carga +1; "n" es el neutrón (sin átomos).
  function atomos(formula) {
    const f = String(formula).replace(/\s/g, '').replace(/\^.*$/, '');
    if (f === 'n') return {};
    let i = 0;
    const grupo = () => {
      const r = {};
      while (i < f.length && f[i] !== ')') {
        let sub;
        if (f[i] === '(') { i++; sub = grupo(); if (f[i] !== ')') throw new Error(`falta ")" en ${formula}`); i++; }
        else {
          const e = f.slice(i).match(/^[A-Z][a-z]?/);
          if (!e) throw new Error(`no entiendo la fórmula ${formula}`);
          if (!(e[0] in MASAS)) throw new Error(`elemento sin masa atómica: ${e[0]}`);
          i += e[0].length; sub = { [e[0]]: 1 };
        }
        const d = f.slice(i).match(/^\d+/); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
        for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
      }
      return r;
    };
    const g = grupo();
    if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
    if (!Object.keys(g).length) throw new Error(`fórmula vacía: ${formula}`);
    return g;
  }
  function carga(formula) {
    const m = String(formula).replace(/\s/g, '').match(/\^(\d*)([+-])$/);
    return m ? (m[2] === '+' ? 1 : -1) * (m[1] ? Number(m[1]) : 1) : 0;
  }
  // Una especie: elemento si tiene un solo tipo de átomo (He, Fe, O₂, O₃, S₈), compuesto si tiene dos o más.
  // errores.porUnion (MA9): «si sus átomos están unidos es compuesto», aunque sean todos iguales (O₂).
  function especie(formula) {
    const neutron = String(formula).trim() === 'n';
    const a = atomos(formula), els = Object.keys(a), nAtomos = Object.values(a).reduce((s, x) => s + x, 0);
    const masa = num(els.reduce((s, e) => s + ent(MASAS[e]) * a[e], 0));
    return { formula: String(formula), atomos: a, elementos: els, nAtomos, carga: carga(formula), neutron,
      tipo: neutron ? 'partícula' : els.length === 1 ? 'elemento' : 'compuesto', masaMolar: masa,
      errores: { porUnion: neutron ? 'partícula' : nAtomos > 1 ? 'compuesto' : 'elemento' } };
  }

  // ---------- Una caja de partículas ----------
  const sustanciaDe = p => p.sustancia || p.formula;
  function clasificarCaja(lista) {
    if (!Array.isArray(lista) || !lista.length) throw new Error('la caja está vacía');
    const sust = [], fases = [], elems = new Set(), porSust = {};
    let particulas = 0, nAtomos = 0, conMolecula = false, todasSueltas = true;
    for (const p of lista) {
      if (!(p.n > 0)) throw new Error(`cantidad no válida para ${p.formula}`);
      const s = especie(p.formula), k = sustanciaDe(p), fa = p.fase || 'única';
      if (!sust.includes(k)) sust.push(k);
      if (!fases.includes(fa)) fases.push(fa);
      s.elementos.forEach(e => elems.add(e));
      particulas += p.n; nAtomos += p.n * s.nAtomos;
      if (s.nAtomos > 1) { conMolecula = true; todasSueltas = false; }
      porSust[k] = (porSust[k] || 0) + p.n;
    }
    const elementos = [...elems], pura = sust.length === 1;
    const tipoPura = pura ? (Object.keys(atomosDeSustancia(sust[0], lista)).length === 1 ? 'elemento' : 'compuesto') : null;
    const tipo = pura ? tipoPura : 'mezcla', sistema = fases.length > 1 ? 'heterogéneo' : 'homogéneo';
    const nombre = pura ? `sustancia pura (${tipoPura})` : `mezcla ${sistema === 'homogéneo' ? 'homogénea' : 'heterogénea'}`;
    return { sustancias: sust, nSustancias: sust.length, porSustancia: porSust, elementos, nElementos: elementos.length,
      particulas, atomos: nAtomos, fases, nFases: fases.length, pura, tipo, sistema, nombre,
      errores: {
        // MA9: «dos clases de átomos = compuesto», sin mirar si están unidos.
        dosClasesDeAtomos: elementos.length > 1 ? 'compuesto' : 'elemento',
        // MA9: «átomos unidos = compuesto», aunque sean del mismo elemento.
        atomosUnidos: conMolecula ? 'compuesto' : 'elemento',
        // MA9 (hipótesis): «átomo y sustancia son lo mismo»: cada átomo suelto contaría como una sustancia.
        cadaAtomoUnaSustancia: todasSueltas ? particulas : sust.length,
        // MA10: «homogénea a la vista = sustancia pura».
        aLaVista: sistema === 'homogéneo' ? 'sustancia pura' : nombre,
      } };
  }
  function atomosDeSustancia(k, lista) {
    const r = {};
    for (const p of lista) if (sustanciaDe(p) === k) for (const [e, n] of Object.entries(especie(p.formula).atomos)) r[e] = (r[e] || 0) + n;
    return r;
  }

  // ---------- El conteo de academia ----------
  // partes: [{ nombre, sustancia, formula?, fase, estado: 's'|'l'|'g', disuelto? }]. Una parte sin fórmula (el aceite,
  // que es en realidad una mezcla de grasas y la academia cuenta como un componente) no entra en el conteo de elementos.
  const NOM_FASES = ['', 'monofásico', 'difásico', 'trifásico', 'tetrafásico', 'pentafásico', 'hexafásico'];
  const NOM_COMP = ['', 'de un componente', 'binario', 'ternario', 'cuaternario', 'quinario', 'de seis componentes'];
  function contarSistema(partes) {
    if (!Array.isArray(partes) || !partes.length) throw new Error('el sistema no tiene partes');
    const fases = [], comp = [], elems = new Set(), porUnidad = {};
    let todosConFormula = true;
    for (const p of partes) {
      if (!p.sustancia || !p.fase) throw new Error(`a "${p.nombre}" le falta la sustancia o la fase`);
      if (!fases.includes(p.fase)) fases.push(p.fase);
      if (!comp.includes(p.sustancia)) comp.push(p.sustancia);
      if (p.formula) { const s = especie(p.formula); s.elementos.forEach(e => elems.add(e)); porUnidad[p.sustancia] = s.nAtomos; }
      else todosConFormula = false;
    }
    const nF = fases.length, nC = comp.length;
    const estados = new Set(partes.map(p => `${p.sustancia}|${p.estado || ''}`));
    const disueltos = partes.filter(p => p.disuelto).length;
    return { fases, nFases: nF, componentes: comp, nComponentes: nC,
      elementos: todosConFormula ? [...elems] : null, nElementos: todosConFormula ? elems.size : null,
      atomosPorUnidad: porUnidad, sistema: nF > 1 ? 'heterogéneo' : 'homogéneo',
      nombre: `${NOM_FASES[nF] || nF + ' fases'} y ${NOM_COMP[nC] || nC + ' componentes'}`,
      errores: {
        cadaCosaUnaFase: partes.length,          // cada cosa nombrada sería una fase
        cadaCosaUnComponente: partes.length,     // cada cosa nombrada sería un componente
        hieloOtroComponente: estados.size,       // el hielo y el agua como dos componentes
        disueltoEsFase: nF + disueltos,          // la sal disuelta como una fase aparte
      } };
  }

  // ---------- Fenómenos ----------
  function cuentaAtomos(lista) {
    const r = {};
    for (const p of lista) for (const [e, k] of Object.entries(especie(p.formula).atomos)) r[e] = (r[e] || 0) + p.n * k;
    return r;
  }
  const igualesConj = (a, b) => a.length === b.length && a.every(x => b.includes(x));
  // antes y despues: listas de partículas. pistas (opcional): { reversible, cambiaColor, saleGas, sinTapa } para los
  // errores de «a la vista». errores.* dice qué tipo diría quien razona con esa idea.
  function cambio(antes, despues, pistas) {
    pistas = pistas || {};
    const sA = [...new Set(antes.filter(p => !especie(p.formula).neutron).map(sustanciaDe))];
    const sD = [...new Set(despues.filter(p => !especie(p.formula).neutron).map(sustanciaDe))];
    const aA = cuentaAtomos(antes), aD = cuentaAtomos(despues);
    const eA = Object.keys(aA), eD = Object.keys(aD);
    const mismosElementos = igualesConj(eA, eD);
    const conservaAtomos = mismosElementos && eA.every(e => aA[e] === aD[e]);
    const tipo = !mismosElementos ? 'nuclear' : igualesConj(sA, sD) ? 'físico' : 'químico';
    if (tipo === 'químico' && !conservaAtomos) throw new Error('en un cambio químico deben quedar los mismos átomos de cada elemento');
    const est = l => new Set(l.map(p => `${sustanciaDe(p)}|${p.estado || p.fase || ''}`));
    const cambiaEstado = [...est(antes)].some(x => !est(despues).has(x)) || [...est(despues)].some(x => !est(antes).has(x));
    return { tipo, sustanciasAntes: sA, sustanciasDespues: sD, nuevas: sD.filter(s => !sA.includes(s)), seVan: sA.filter(s => !sD.includes(s)),
      elementosAntes: eA, elementosDespues: eD, atomosAntes: aA, atomosDespues: aD, conservaAtomos, cambiaEstado,
      errores: {
        cambioDeEstadoEsQuimico: tipo === 'físico' && cambiaEstado ? 'químico' : tipo,            // MA1
        reversibleEsFisico: pistas.reversible === undefined ? null : pistas.reversible ? 'físico' : 'químico',
        colorEsQuimico: pistas.cambiaColor ? 'químico' : null,
        nuclearEsQuimico: tipo === 'nuclear' ? 'químico' : null,                                  // «sale energía: es química»
        sigueSiendoElMismo: tipo === 'químico' ? 'físico' : null,                                  // MA2: «el hierro sigue siendo hierro»
      } };
  }
  // Los fenómenos de examen, cada uno con sus partículas (los átomos de cada elemento se conservan salvo en el nuclear).
  const FENOMENOS = Object.freeze({
    'fundir-hielo':    { nombre: 'Fundir hielo', antes: [{ formula: 'H2O', n: 6, estado: 's' }], despues: [{ formula: 'H2O', n: 6, estado: 'l' }], pistas: { reversible: true } },
    'hervir-agua':     { nombre: 'Hervir agua', antes: [{ formula: 'H2O', n: 6, estado: 'l' }], despues: [{ formula: 'H2O', n: 4, estado: 'l' }, { formula: 'H2O', n: 2, estado: 'g' }], pistas: { reversible: true, saleGas: true } },
    'condensar-vapor': { nombre: 'El agua que aparece afuera de un vaso frío', antes: [{ formula: 'H2O', n: 3, estado: 'g' }], despues: [{ formula: 'H2O', n: 3, estado: 'l' }], pistas: { reversible: true } },
    'disolver-sal':    { nombre: 'Disolver sal en agua', antes: [{ formula: 'NaCl', n: 2, estado: 's' }, { formula: 'H2O', n: 8, estado: 'l' }],
                         despues: [{ formula: 'Na^+', n: 2, sustancia: 'NaCl', estado: 'disuelto' }, { formula: 'Cl^-', n: 2, sustancia: 'NaCl', estado: 'disuelto' }, { formula: 'H2O', n: 8, estado: 'l' }], pistas: { reversible: true } },
    'disolver-azucar': { nombre: 'Disolver azúcar en agua', antes: [{ formula: 'C12H22O11', n: 3, estado: 's' }, { formula: 'H2O', n: 12, estado: 'l' }],
                         despues: [{ formula: 'C12H22O11', n: 3, estado: 'disuelto' }, { formula: 'H2O', n: 12, estado: 'l' }], pistas: { reversible: true } },
    'oxidar-hierro':   { nombre: 'Un clavo de hierro que se oxida', antes: [{ formula: 'Fe', n: 4, estado: 's' }, { formula: 'O2', n: 3, estado: 'g' }, { formula: 'H2O', n: 4, estado: 'l' }],
                         despues: [{ formula: 'Fe2O3', n: 2, estado: 's' }, { formula: 'H2O', n: 4, estado: 'l' }], pistas: { reversible: false, cambiaColor: true } },
    'quemar-metano':   { nombre: 'Quemar metano (gas natural)', antes: [{ formula: 'CH4', n: 1, estado: 'g' }, { formula: 'O2', n: 2, estado: 'g' }],
                         despues: [{ formula: 'CO2', n: 1, estado: 'g' }, { formula: 'H2O', n: 2, estado: 'g' }], pistas: { reversible: false, saleGas: true } },
    'electrolisis-agua': { nombre: 'Electrólisis del agua', antes: [{ formula: 'H2O', n: 2, estado: 'l' }], despues: [{ formula: 'H2', n: 2, estado: 'g' }, { formula: 'O2', n: 1, estado: 'g' }], pistas: { reversible: true, saleGas: true } },
    'fision-uranio':   { nombre: 'Fisión del uranio-235', antes: [{ formula: 'U', n: 1 }, { formula: 'n', n: 1 }], despues: [{ formula: 'Ba', n: 1 }, { formula: 'Kr', n: 1 }, { formula: 'n', n: 3 }] },
  });
  function fenomeno(id) {
    const f = FENOMENOS[id]; if (!f) throw new Error(`fenómeno desconocido: ${id}`);
    return Object.assign({ id, nombre: f.nombre }, cambio(f.antes, f.despues, f.pistas));
  }
  // MA1: en las burbujas de un líquido que hierve está su propio vapor. Errores: los elementos sueltos (H₂ y O₂),
  // aire, o nada (un hueco vacío).
  function burbujas(formula) {
    const s = especie(formula);
    return { contiene: [formula], nuevas: [], tipo: 'físico',
      errores: { elementos: s.elementos.map(e => (DIATOMICOS.includes(e) ? e + '2' : e)), aire: ['N2', 'O2'], vacio: [] } };
  }

  // ---------- La balanza ----------
  // Evaporar en frasco cerrado o abierto. o = { recipiente, masa (g de líquido), fraccion (0 a 1 que se evapora), cerrado }.
  function evaporar(o) {
    const fr = o.fraccion === undefined ? 1 : o.fraccion;
    if (fr < 0 || fr > 1) throw new Error('la fracción que se evapora va de 0 a 1');
    const antes = suma(o.recipiente, o.masa), vapor = num(Math.round(ent(o.masa) * fr));
    const despues = o.cerrado ? antes : suma(antes, -vapor);
    return { antes, despues, vapor, liquidoQueQueda: suma(o.masa, -vapor), seVa: o.cerrado ? 0 : vapor,
      errores: { vaporNoPesa: suma(antes, -vapor), vaporPesaMenos: [suma(antes, -vapor), antes], vaporEmpuja: 'más', siempreIgual: antes } };
  }
  // Un metal que arde y forma su óxido (lana de acero: Fe → Fe₂O₃). En abierto el oxígeno entra del aire y la masa sube;
  // en cerrado el oxígeno ya estaba adentro y la balanza no se mueve.
  function quemarMetal(o) {
    const met = o.metal, ox = especie(o.oxido);
    if (!ox.atomos[met] || !ox.atomos.O) throw new Error(`${o.oxido} no es un óxido de ${met}`);
    const moles = o.masa / MASAS[met];
    // O que se une: (átomos de O por átomo de metal) × moles × 16, con fracciones exactas.
    const g = mcd(ox.atomos.O, ox.atomos[met]), pO = ox.atomos.O / g, pM = ox.atomos[met] / g;
    const oxigeno = num(Math.round(ent(o.masa) * pO * MASAS.O / (pM * MASAS[met])));
    const masaOxido = suma(o.masa, oxigeno), recip = o.recipiente || 0, antes = suma(recip, o.masa);
    return { antes, despues: o.cerrado ? antes : suma(antes, oxigeno), moles, oxigeno, masaOxido, oxido: o.oxido,
      sube: o.cerrado ? 0 : oxigeno,
      errores: { conservaSiempre: antes, seConsume: 'baja', calorPesa: 'sube sin oxígeno', cerradoSube: suma(antes, oxigeno) } };
  }

  // ---------- Separación de mezclas ----------
  // Cada componente con lo que hace falta para decidir: estado, si está disuelto, si se mezcla con el agua, densidad
  // (g/mL), temperatura de ebullición (°C, a 1 atm) y magnetismo. Datos redondeados de tabla.
  const AGUA = { sustancia: 'H2O', formula: 'H2O', nombre: 'agua', estado: 'l', densidad: 1, tEb: 100 };
  const MEZCLAS = Object.freeze({
    'agua-sal':      { nombre: 'Agua con sal disuelta', partes: [AGUA, { sustancia: 'NaCl', formula: 'NaCl', nombre: 'sal', estado: 's', disuelto: true, densidad: 2.2, tEb: 1413 }] },
    'agua-arena':    { nombre: 'Agua con arena', partes: [AGUA, { sustancia: 'SiO2', formula: 'SiO2', nombre: 'arena', estado: 's', disuelto: false, densidad: 2.6, tEb: 2230 }] },
    'agua-aceite':   { nombre: 'Agua con aceite', partes: [AGUA, { sustancia: 'aceite', nombre: 'aceite', estado: 'l', miscible: false, densidad: 0.92, tEb: 300 }] },
    'agua-alcohol':  { nombre: 'Agua con alcohol', partes: [AGUA, { sustancia: 'C2H5OH', formula: 'C2H5OH', nombre: 'alcohol', estado: 'l', miscible: true, densidad: 0.79, tEb: 78 }] },
    'hierro-azufre': { nombre: 'Limaduras de hierro con azufre en polvo', partes: [
      { sustancia: 'Fe', formula: 'Fe', nombre: 'hierro', estado: 's', magnetico: true, densidad: 7.9, tEb: 2862 },
      { sustancia: 'S', formula: 'S8', nombre: 'azufre', estado: 's', magnetico: false, densidad: 2.1, tEb: 445 }] },
  });
  const METODOS = Object.freeze({
    filtracion:  { nombre: 'filtración', propiedad: 'el tamaño de las partículas (un sólido sin disolver)' },
    decantacion: { nombre: 'decantación', propiedad: 'la densidad (líquidos que no se mezclan, o un sólido que se asienta)' },
    destilacion: { nombre: 'destilación', propiedad: 'la temperatura de ebullición' },
    imantacion:  { nombre: 'imantación', propiedad: 'el magnetismo' },
    evaporacion: { nombre: 'evaporación', propiedad: 'la volatilidad: el líquido se va al aire y el sólido disuelto queda' },
  });
  const mezclaDe = m => (typeof m === 'string' ? (MEZCLAS[m] ? MEZCLAS[m].partes : null) : m);
  // Lo que hace un método con una mezcla: fracciones que se obtienen (cada una, una lista de nombres), lo que se pierde
  // al aire y si separó algo. Un método equivocado puede no separar nada (filtrar agua con sal).
  function separar(m, metodo) {
    const P = mezclaDe(m); if (!P) throw new Error(`mezcla desconocida: ${m}`);
    if (!METODOS[metodo]) throw new Error(`método desconocido: ${metodo}`);
    const nom = l => l.map(p => p.nombre), liq = P.filter(p => p.estado === 'l'), hayLiq = liq.length > 0;
    let fr = [nom(P)], pierde = [], razon = '';
    if (metodo === 'filtracion') {
      const queda = P.filter(p => p.estado === 's' && !p.disuelto), pasa = P.filter(p => !queda.includes(p));
      if (hayLiq && queda.length && pasa.length) { fr = [nom(queda), nom(pasa)]; razon = 'el papel retiene los granos sólidos y deja pasar el líquido'; }
      else if (!hayLiq) razon = 'sin un líquido, todo queda junto sobre el papel';
      else { fr = [[], nom(P)];
        razon = P.some(p => p.disuelto) ? 'todo pasa por el papel: lo disuelto está repartido en partículas sueltas, más chicas que los poros'
          : 'los dos líquidos pasan por el papel: un filtro solo retiene granos sólidos'; }
    } else if (metodo === 'decantacion') {
      const inm = liq.length > 1 && liq.some(p => p.miscible === false), asienta = hayLiq && P.some(p => p.estado === 's' && !p.disuelto);
      if (inm || asienta) { const orden = P.slice().sort((a, b) => a.densidad - b.densidad); fr = [nom(orden.slice(0, 1)), nom(orden.slice(1))];
        razon = inm ? 'los líquidos no se mezclan: el menos denso queda arriba y se vierte o se saca por la llave' : 'el sólido, más denso, se asienta y el líquido se vierte con cuidado'; }
      else razon = hayLiq ? 'nada se asienta ni forma otra capa: la mezcla es una sola fase' : 'sin un líquido no hay nada que verter';
    } else if (metodo === 'destilacion') {
      if (!hayLiq) razon = 'no hay líquido que hervir';
      else { const orden = P.slice().sort((a, b) => a.tEb - b.tEb); fr = [nom(orden.slice(0, 1)), nom(orden.slice(1))];
        razon = `hierve primero ${orden[0].nombre} (${orden[0].tEb} °C), su vapor se enfría en el tubo y se recoge aparte`; }
    } else if (metodo === 'imantacion') {
      const iman = P.filter(p => p.magnetico);
      if (iman.length && iman.length < P.length) { fr = [nom(iman), nom(P.filter(p => !p.magnetico))]; razon = 'el imán atrae al hierro y deja lo demás'; }
      else razon = 'ningún componente es atraído por el imán';
    } else if (metodo === 'evaporacion') {
      const vol = P.filter(p => p.estado === 'l' && p.tEb <= 100), resto = P.filter(p => !vol.includes(p));
      if (vol.length && resto.length) { fr = [nom(resto)]; pierde = nom(vol); razon = `${nom(vol).join(' y ')} se va al aire como vapor; queda ${nom(resto).join(' y ')}`; }
      else if (!vol.length) razon = 'no hay líquido que se evapore';
      else { fr = []; pierde = nom(vol); razon = 'todo se evapora: no queda nada que recoger'; }
    }
    const separa = fr.filter(f => f.length).length + (pierde.length ? 1 : 0) >= 2 && fr.some(f => f.length);
    const ad = metodoPara(P).adecuados;
    return { metodo, nombre: METODOS[metodo].nombre, propiedad: METODOS[metodo].propiedad, separa, fracciones: fr, pierde,
      adecuado: ad.includes(metodo), razon };
  }
  // El método de academia según la propiedad que difiere. errores.* : lo que elige quien razona con cada idea errónea.
  function metodoPara(m) {
    const P = mezclaDe(m); if (!P) throw new Error(`mezcla desconocida: ${m}`);
    const liq = P.filter(p => p.estado === 'l'), ad = [];
    let difiere = '';
    if (P.some(p => p.magnetico) && P.some(p => !p.magnetico)) { ad.push('imantacion'); difiere = 'el magnetismo'; }
    else if (liq.length && P.some(p => p.estado === 's' && !p.disuelto)) { ad.push('filtracion', 'decantacion'); difiere = 'el tamaño de las partículas y la densidad'; }
    else if (liq.length > 1 && liq.some(p => p.miscible === false)) { ad.push('decantacion'); difiere = 'la densidad (y que no se mezclan)'; }
    else if (liq.length && P.some(p => p.estado === 's' && p.disuelto)) { ad.push('evaporacion', 'destilacion'); difiere = 'la temperatura de ebullición'; }
    else if (liq.length > 1) { ad.push('destilacion'); difiere = 'la temperatura de ebullición'; }
    const homogenea = !(P.some(p => p.estado === 's' && !p.disuelto) || P.some(p => p.miscible === false));
    return { adecuados: ad, difiere, homogenea,
      errores: { filtrarLoDisuelto: homogenea && P.some(p => p.disuelto) ? 'filtracion' : null,
        decantarLoMiscible: homogenea && liq.length > 1 ? 'decantacion' : null,
        noSeSepara: homogenea ? 'ninguno' : null } };
  }

  // ---------- E = mc² ----------
  const C = 3e8;                 // m/s
  const KWH = 3.6e6;             // J en 1 kWh
  const U_KG = 1.66054e-27;      // kg en 1 u
  const MEV_U = 931.5;           // MeV por cada u de masa (dato de academia)
  // m en kg o en g. errores: masa en gramos sin pasar a kg, c en km/s, c sin elevar al cuadrado.
  function energia(m, unidad) {
    const kg = unidad === 'g' ? m / 1000 : m, g = kg * 1000;
    return { kg, g, c: C, E: kg * C * C, kWh: kg * C * C / KWH,
      errores: { gramosSinConvertir: g * C * C, cEnKmPorS: kg * (C / 1000) * (C / 1000), sinCuadrado: kg * C } };
  }
  // La masa que se transforma (o el defecto de masa) para una energía E en J.
  function masaDeEnergia(E) {
    const kg = E / (C * C);
    return { E, kg, g: kg * 1000,
      errores: { kgComoGramos: kg, cEnKmPorS: E / ((C / 1000) * (C / 1000)), sinCuadrado: E / C, multiplica: E * C * C, conservaMasa: 0 } };
  }
  // Defecto de masa de una reacción nuclear con las masas en u de cada lado.
  function defectoMasa(antes, despues) {
    const sum = l => l.reduce((s, x) => s + ent(x), 0);
    const dmU = num(sum(antes) - sum(despues));
    const dmKg = dmU * U_KG;
    return { masaAntes: num(sum(antes)), masaDespues: num(sum(despues)), dmU, dmKg, E: dmKg * C * C, MeV: dmU * MEV_U,
      errores: { conservaMasa: 0, masaTotal: num(sum(antes)) * U_KG * C * C } };
  }
  // La balanza de un reactor (si se pudiera pesar todo junto, cerrado): baja en E/c².
  function balanzaNuclear(E) {
    const m = masaDeEnergia(E);
    return { baja: m.g, bajaKg: m.kg, errores: { conservaMasa: 0, kgComoGramos: m.kg, cEnKmPorS: m.errores.cEnKmPorS } };
  }

  // ---------- Propiedades ----------
  // tipo: intensiva (no depende de la cantidad) o extensiva; clase: física o química; deUnaParticula: si un solo átomo o
  // molécula la tiene (AT1/MA11: el color, la fusión, la dureza o la densidad son del conjunto).
  const PROPIEDADES = Object.freeze({
    'masa': ['extensiva', 'física', true], 'peso': ['extensiva', 'física', true], 'volumen': ['extensiva', 'física', false],
    'longitud': ['extensiva', 'física', false], 'calor absorbido': ['extensiva', 'física', false], 'número de partículas': ['extensiva', 'física', false],
    'densidad': ['intensiva', 'física', false], 'temperatura': ['intensiva', 'física', false],
    'temperatura de ebullición': ['intensiva', 'física', false], 'temperatura de fusión': ['intensiva', 'física', false],
    'color': ['intensiva', 'física', false], 'olor': ['intensiva', 'física', false], 'sabor': ['intensiva', 'física', false],
    'dureza': ['intensiva', 'física', false], 'brillo': ['intensiva', 'física', false], 'maleabilidad': ['intensiva', 'física', false],
    'ductilidad': ['intensiva', 'física', false], 'conductividad eléctrica': ['intensiva', 'física', false],
    'solubilidad': ['intensiva', 'física', false], 'viscosidad': ['intensiva', 'física', false], 'calor específico': ['intensiva', 'física', false],
    'combustibilidad': ['intensiva', 'química', true], 'oxidabilidad': ['intensiva', 'química', true],
    'reactividad con ácidos': ['intensiva', 'química', true], 'inflamabilidad': ['intensiva', 'química', true],
  });
  // Las que se miden con un instrumento y un número (error: «si se mide, depende de cuánto hay»).
  const MEDIBLES = ['masa', 'peso', 'volumen', 'longitud', 'calor absorbido', 'densidad', 'temperatura', 'temperatura de ebullición', 'temperatura de fusión', 'viscosidad', 'calor específico'];
  function propiedad(nombre) {
    const p = PROPIEDADES[nombre]; if (!p) throw new Error(`propiedad desconocida: ${nombre}`);
    return { nombre, tipo: p[0], clase: p[1], deUnaParticula: p[2] };
  }
  function clasificarPropiedades(lista) {
    const ps = lista.map(propiedad), f = (k, v) => ps.filter(p => p[k] === v).map(p => p.nombre);
    const intensivas = f('tipo', 'intensiva'), extensivas = f('tipo', 'extensiva');
    return { intensivas, extensivas, fisicas: f('clase', 'física'), quimicas: f('clase', 'química'),
      nIntensivas: intensivas.length, nExtensivas: extensivas.length,
      errores: { medibleEsExtensiva: lista.filter(n => MEDIBLES.includes(n) || PROPIEDADES[n][0] === 'extensiva').length,
        temperaturaExtensiva: extensivas.length + (lista.includes('temperatura') ? 1 : 0) } };
  }
  // Lo que tiene una partícula sola de una sustancia, comparado con la sustancia (MA11).
  function particula(formula, propiedadesDeLaSustancia) {
    const s = especie(formula), tiene = [], noTiene = [];
    for (const n of propiedadesDeLaSustancia) (propiedad(n).deUnaParticula ? tiene : noTiene).push(n);
    return { formula, elementos: s.elementos, tiene, noTiene, errores: { todasIguales: propiedadesDeLaSustancia.slice() } };
  }

  // ---------- Meseta de la ebullición (corta; la escena completa es plantillas/calorimetria/) ----------
  // Agua que ya hierve a Teb (°C) recibe calor durante `minutos` con `potencia` cal/min. c = 1 cal/(g °C), Lv = 540 cal/g.
  function hervir(o) {
    const Q = o.potencia * o.minutos, vapor = Q / 540;
    if (vapor > o.masa) throw new Error('se acaba el agua antes de ese tiempo');
    return { T: o.Teb, Q, vapor, queda: o.masa - vapor,
      errores: { siempre100: 100, sigueSubiendo: o.Teb + Q / o.masa, seEnfria: 'menos' } };
  }

  // ---------- Materiales de examen ----------
  // Cada uno con una lupa de muestra (unas pocas partículas representativas) y sus fases; se clasifica con clasificarCaja.
  const MATERIALES = Object.freeze({
    'agua destilada': [{ formula: 'H2O', n: 6 }],
    'oxígeno del aire (O₂)': [{ formula: 'O2', n: 6 }],
    'ozono': [{ formula: 'O3', n: 6 }],
    'diamante': [{ formula: 'C', n: 8 }],
    'grafito': [{ formula: 'C', n: 8 }],
    'oro de 24 quilates': [{ formula: 'Au', n: 8 }],
    'sal de mesa (NaCl)': [{ formula: 'NaCl', n: 6 }],
    'azúcar': [{ formula: 'C12H22O11', n: 4 }],
    'aire': [{ formula: 'N2', n: 8 }, { formula: 'O2', n: 2 }],
    'agua de mar': [{ formula: 'H2O', n: 10 }, { formula: 'Na^+', n: 1, sustancia: 'NaCl' }, { formula: 'Cl^-', n: 1, sustancia: 'NaCl' }],
    'acero': [{ formula: 'Fe', n: 9 }, { formula: 'C', n: 1 }],
    'bronce': [{ formula: 'Cu', n: 8 }, { formula: 'Sn', n: 2 }],
    'agua con aceite': [{ formula: 'H2O', n: 6, fase: 'agua' }, { formula: 'C18H34O2', n: 2, sustancia: 'aceite', fase: 'aceite' }],
    'granito': [{ formula: 'SiO2', n: 4, fase: 'cuarzo' }, { formula: 'KAlSi3O8', n: 3, fase: 'feldespato' }],
    'agua con hielo': [{ formula: 'H2O', n: 6, fase: 'líquida' }, { formula: 'H2O', n: 6, fase: 'hielo' }],
  });
  function material(nombre) {
    const l = MATERIALES[nombre]; if (!l) throw new Error(`material desconocido: ${nombre}`);
    const r = clasificarCaja(l);
    return Object.assign({ material: nombre }, r);
  }

  // ---------- Lo que usa la escena ----------
  // Las cuatro cajas del paso 2 (sin rótulo en el dibujo: el alumno decide).
  const CAJAS = Object.freeze({
    1: [{ formula: 'O2', n: 6 }],
    2: [{ formula: 'H2O', n: 6 }],
    3: [{ formula: 'Fe', n: 9 }],
    4: [{ formula: 'H2', n: 5 }, { formula: 'O2', n: 3 }],
  });
  // El vaso del paso 3.
  const VASO = Object.freeze([
    { nombre: 'agua líquida', sustancia: 'H2O', formula: 'H2O', fase: 'agua con sal', estado: 'l' },
    { nombre: 'cubitos de hielo', sustancia: 'H2O', formula: 'H2O', fase: 'hielo', estado: 's' },
    { nombre: 'sal disuelta', sustancia: 'NaCl', formula: 'NaCl', fase: 'agua con sal', estado: 's', disuelto: true },
    { nombre: 'una capa de aceite', sustancia: 'aceite', fase: 'aceite', estado: 'l' },
    { nombre: 'arena en el fondo', sustancia: 'SiO2', formula: 'SiO2', fase: 'arena', estado: 's' },
  ]);

  return { MASAS, NOMBRES, C, KWH, U_KG, MEV_U, FENOMENOS, MEZCLAS, METODOS, PROPIEDADES, MATERIALES, CAJAS, VASO,
    atomos, carga, especie, clasificarCaja, contarSistema, cuentaAtomos, cambio, fenomeno, burbujas, evaporar, quemarMetal,
    separar, metodoPara, energia, masaDeEnergia, defectoMasa, balanzaNuclear, propiedad, clasificarPropiedades, particula,
    hervir, material, suma };
});
