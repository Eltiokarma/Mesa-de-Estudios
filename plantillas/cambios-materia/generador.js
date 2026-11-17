/*
 * Generador «¿Físico, químico o nuclear?»: práctica de la idea 3 de «Materia y energía» (quimica.materia-y-energia;
 * contenido/teoria/quimica/materia-y-energia.js, idea «fisico-quimico-nuclear»). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['cambios-materia']) y en Node (require). No usa
 * ningún motor de escena: el tipo de cambio sale de comparar las partículas de antes y de después, con las reglas de la
 * teoría (las mismas sustancias: físico; sustancias nuevas con los mismos elementos: químico; otro elemento: nuclear), y
 * las cuentas, de contar átomos (los átomos de cada elemento se conservan en un cambio químico).
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   cual       (1) entre cuatro fenómenos, el único químico (o el único físico)
 *   propiedad  (1) entre cuatro rasgos, la única propiedad química (o la única física)
 *   lupa       (2) la lupa de un frasco cerrado antes y después (figura de partículas): ¿qué cambio fue?
 *   atomos     (2) contando átomos, cuántas moléculas de un producto hay después (sin balancear la ecuación)
 *   contar     (3) como San Marcos: cuántos de una lista I a IV son cambios químicos
 *   balanza    (3) lana de acero que arde sobre una balanza, en un frasco abierto o cerrado: ¿qué marca al final?
 * _datos: cual { tipo, nivel, pide: 'quimico'|'fisico', ids }; propiedad { tipo, nivel, pide, ids }; lupa { tipo, nivel,
 *   caso }; atomos { tipo, nivel, caso }; contar { tipo, nivel, ids }; balanza { tipo, nivel, cerrado, frasco (g), lana (g) }.
 * Respuestas: cual y propiedad, 'fen:<id>' y 'prop:<id>'; lupa, 'cambio:fisico|quimico|nuclear'; atomos y contar, un
 *   número; balanza, la masa en g.
 *
 * Figura (lupa): de partículas, nunca de variables (docs/etapa2/decisiones.md): átomos en tinta con su símbolo, el antes
 * a la izquierda y el después a la derecha, cada uno con su estado (sólido, líquido o gas) en el título. No dice el tipo
 * de cambio. Lo nuclear, un solo ejemplo, como en la teoría: el carbono-14 que pasa a nitrógeno-14, sin partículas
 * subatómicas ni vida media. El papel no lleva figura.
 * Colores por papel (balanza): la masa del frasco, naranja (o); la lana, turquesa (i); lo que se pide, violeta (f).
 * Datos (docs/plan-calidad.md §3, punto 13): las definiciones de los tres cambios o de las dos propiedades entre las que
 * se elige; la conservación de los átomos y lo que lleva cada molécula; «cada 56 g de hierro toman 24 g de oxígeno».
 * Errores: MA1, MA2, MA3, MA4 y MA5 (docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md,
 *   respaldo parcial: el informe los mide con otros ítems); los de la teoría QM-NUCLEAR, QM-CUENTA-O,
 *   QM-MOLECULAS-IGUALES, QM-MASA-SE-VA y QM-SOLO-SOLIDO, y los nuevos QM-FORMA (romper o moler como cambio de
 *   sustancia), QM-SUBINDICE (cuenta los átomos sin dividir entre los de cada molécula), QM-SUMA-OXIDO (suma el óxido
 *   entero, sin restar el hierro que ya estaba) y QM-CONTEO, todos hipótesis.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'cambios-materia';
  const FMA = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const err = (id, explicacion) => (/^MA\d/.test(id)
    ? { id, explicacion, respaldo: 'parcial', fuente: FMA } : { id, explicacion, respaldo: 'hipotesis', fuente: null });
  const e = (valor, id, explicacion) => ({ valor, ...err(id, explicacion) });
  const v = P.v;
  const limpio = x => Number(x.toPrecision(12));
  const f = (x, d = 2) => P.formatear(limpio(x), d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  const SUBI = '₀₁₂₃₄₅₆₇₈₉';
  const fm = x => String(x).replace(/\d/g, c => SUBI[c]);
  const lista = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  const NUM = ['I', 'II', 'III', 'IV'];

  // ---- Definiciones (las mismas de la teoría) ----
  const DEF_FIS = 'Cambio físico: las mismas partículas cambian de estado, de forma o de lugar';
  const DEF_QUI = 'Cambio químico: aparecen sustancias nuevas, hechas con los mismos átomos';
  const DEF_NUC = 'Cambio nuclear: un átomo pasa a ser de otro elemento';
  const DEF_PF = 'Propiedad física: se mide sin transformar la sustancia en otra';
  const DEF_PQ = 'Propiedad química: solo se ve cuando la sustancia se transforma en otra';
  const DEF_LUPA = 'En la lupa, cada bolita es un átomo; los átomos pegados forman una partícula';
  const DEF_CONS = 'En un cambio químico, los átomos de cada elemento son los mismos antes y después';

  // ---- Fenómenos: tipo de cambio y clase (para el error) ----
  // clase: estado (cambio de estado), disolver, forma (romper, moler), quimico, nuclear.
  const FEN = {
    escarcha: { texto: 'Se forma escarcha sobre el pasto en una helada', clase: 'estado' },
    clavo: { texto: 'Un clavo de hierro se oxida en el patio', clase: 'quimico' },
    lena: { texto: 'La leña arde en el fogón', clase: 'quimico' },
    azucar: { texto: 'El azúcar se disuelve en el té', clase: 'disolver' },
    alcohol: { texto: 'El alcohol de un algodón se evapora', clase: 'estado' },
    c14: { texto: 'El carbono-14 de un hueso antiguo pasa a nitrógeno-14', clase: 'nuclear' },
    vinagre: { texto: 'El vinagre con bicarbonato hace burbujas de un gas nuevo', clase: 'quimico' },
    vidrio: { texto: 'Un vidrio se rompe en pedazos', clase: 'forma' },
    espejo: { texto: 'El espejo del baño se empaña con la ducha', clase: 'estado' },
    gas: { texto: 'El gas de la cocina arde en la hornilla', clase: 'quimico' },
    leche: { texto: 'La leche se agria y se corta', clase: 'quimico' },
    hielo: { texto: 'Un cubo de hielo se derrite en la mesa', clase: 'estado' },
    sal: { texto: 'La sal se disuelve en la sopa', clase: 'disolver' },
    papa: { texto: 'Se muele el maíz para hacer harina', clase: 'forma' },
    pan: { texto: 'El pan se tuesta y se pone negro', clase: 'quimico' },
    chicha: { texto: 'La chicha fermenta y se vuelve ácida', clase: 'quimico' },
  };
  const tipoDe = c => (c === 'quimico' ? 'quimico' : c === 'nuclear' ? 'nuclear' : 'fisico');
  const POR_QUE = {
    estado: 'Las mismas moléculas pasan a otro estado: no aparece ninguna sustancia nueva.',
    disolver: 'Las partículas se reparten en el líquido, pero siguen siendo las mismas.',
    forma: 'Cambia la forma o el tamaño; las partículas son las mismas.',
    quimico: 'Aparece una sustancia que antes no estaba, con los mismos átomos.',
    nuclear: 'Un átomo pasa a ser de otro elemento: eso no ocurre en un cambio químico.',
  };
  // Por qué no es la elegida, según su clase y lo que se pide.
  function siFueraFen(clase, pide) {
    if (clase === 'nuclear') return ['QM-NUCLEAR', 'Bien: algo cambia. Pero el carbono-14 pasa a ser otro elemento: es nuclear, no químico ni físico.'];
    if (pide === 'quimico') return {
      estado: ['MA1', 'Bien: algo cambió a la vista. Pero las mismas moléculas solo cambiaron de estado: es físico.'],
      disolver: ['MA3', 'Bien: el azúcar o la sal desaparecen a la vista. Pero sus partículas siguen enteras en el líquido: es físico.'],
      forma: ['QM-FORMA', 'Bien: cambió la forma. Pero los pedazos son del mismo material: es físico.'],
    }[clase];
    return ['MA2', 'Bien: algo cambió a la vista. Pero aparece una sustancia que antes no estaba: es químico, no físico.'];
  }
  function tCual(rng) {
    const pide = rng.elegir(['quimico', 'fisico']);
    const buenos = Object.keys(FEN).filter(k => tipoDe(FEN[k].clase) === pide);
    const malos = Object.keys(FEN).filter(k => tipoDe(FEN[k].clase) !== pide);
    const bueno = rng.elegir(buenos), otros = rng.barajar(malos).slice(0, 3);
    const errores = otros.map(k => { const [id, ex] = siFueraFen(FEN[k].clase, pide); return { clave: 'fen:' + k, texto: FEN[k].texto, ...err(id, ex) }; });
    return {
      variables: {}, enunciado: ['Mira estos fenómenos.'], pregunta: [`¿Cuál es un cambio ${pide === 'quimico' ? 'químico' : 'físico'}?`],
      datos: [DEF_FIS, DEF_QUI, DEF_NUC],
      alternativas: P.armarTexto({ correcta: { clave: 'fen:' + bueno, texto: FEN[bueno].texto }, errores, rng }),
      respuesta: { valor: 'fen:' + bueno, texto: FEN[bueno].texto, unidad: '' },
      solucion: [
        [`Para cada uno, pregunta si después hay las mismas partículas.`],
        [`${FEN[bueno].texto}: ${POR_QUE[FEN[bueno].clase].toLowerCase()}`],
        [`Los otros: ${lista(otros.map(k => `«${FEN[k].texto.toLowerCase()}», ${tipoDe(FEN[k].clase) === 'quimico' ? 'químico' : tipoDe(FEN[k].clase) === 'nuclear' ? 'nuclear' : 'físico'}`))}.`],
      ],
      _datos: { tipo: 'cual', nivel: 1, pide, ids: [bueno, ...otros] },
    };
  }

  // ---- Propiedades: física o química ----
  const PROP = {
    arde: { texto: 'El gas de la cocina arde', clase: 'quimica' }, oxida: { texto: 'El hierro se oxida con el aire húmedo', clase: 'quimica' },
    zinc: { texto: 'El zinc reacciona con los ácidos', clase: 'quimica' }, papel: { texto: 'El papel se enciende con facilidad', clase: 'quimica' },
    agria: { texto: 'La leche se agria con el tiempo', clase: 'quimica' }, bicarbonato: { texto: 'El bicarbonato reacciona con el vinagre', clase: 'quimica' },
    conduce: { texto: 'El cobre conduce la electricidad', clase: 'fisica' }, hierve: { texto: 'El alcohol hierve a unos 78 °C', clase: 'fisica' },
    brilla: { texto: 'El oro brilla', clase: 'fisica' }, densidad: { texto: 'El aceite tiene unos 0,92 g/mL', clase: 'fisica' },
    funde: { texto: 'El hielo se funde a 0 °C', clase: 'fisica' }, duro: { texto: 'El diamante es muy duro', clase: 'fisica' },
    disuelve: { texto: 'El azúcar se disuelve en agua', clase: 'fisica' },
  };
  function tPropiedad(rng) {
    const pide = rng.elegir(['quimica', 'fisica']);
    const bueno = rng.elegir(Object.keys(PROP).filter(k => PROP[k].clase === pide));
    const otros = rng.barajar(Object.keys(PROP).filter(k => PROP[k].clase !== pide)).slice(0, 3);
    const errores = otros.map(k => ({ clave: 'prop:' + k, texto: PROP[k].texto, ...(pide === 'quimica'
      ? err('MA1', 'Bien: es un rasgo de la sustancia. Pero se observa sin que la sustancia se vuelva otra: es física.')
      : err('MA2', 'Bien: es un rasgo de la sustancia. Pero solo se ve cuando la sustancia se transforma en otra: es química.')) }));
    return {
      variables: {}, enunciado: ['Mira estos rasgos de algunas sustancias.'], pregunta: [`¿Cuál es una propiedad ${pide === 'quimica' ? 'química' : 'física'}?`],
      datos: [DEF_PF, DEF_PQ],
      alternativas: P.armarTexto({ correcta: { clave: 'prop:' + bueno, texto: PROP[bueno].texto }, errores, rng }),
      respuesta: { valor: 'prop:' + bueno, texto: PROP[bueno].texto, unidad: '' },
      solucion: [
        ['Pregunta por cada rasgo: después de observarlo, ¿queda la misma sustancia? Si sí, es una propiedad física.'],
        [`«${PROP[bueno].texto}»: ${pide === 'quimica' ? 'para verlo, la sustancia se transforma en otra.' : 'se observa y la sustancia sigue siendo la misma.'}`],
        [`Los otros tres ${pide === 'quimica' ? 'se observan sin transformar la sustancia: son físicos' : 'solo se ven al transformarla: son químicos'}.`],
      ],
      _datos: { tipo: 'propiedad', nivel: 1, pide, ids: [bueno, ...otros] },
    };
  }

  // ---- Figura: la lupa de antes y la de después ----
  const ATOMO = { H: [6, 0], O: [8.5, 2], C: [8.5, 1], N: [8.5, 0], Fe: [9.5, 1] };
  const ESP = {
    H2O: { formula: 'H2O', nombre: 'agua', at: [['O', 0, -2], ['H', -11, 6], ['H', 11, 6]] },
    O2: { formula: 'O2', nombre: 'oxígeno', at: [['O', -8, 0], ['O', 8, 0]] },
    H2: { formula: 'H2', nombre: 'hidrógeno', at: [['H', -6, 0], ['H', 6, 0]] },
    N2: { formula: 'N2', nombre: 'nitrógeno', at: [['N', -8, 0], ['N', 8, 0]] },
    NH3: { formula: 'NH3', nombre: 'amoniaco', at: [['N', 0, 2], ['H', -12, 6], ['H', 12, 6], ['H', 0, -11]] },
    CO2: { formula: 'CO2', nombre: 'dióxido de carbono', at: [['O', -16, 0], ['C', 0, 0], ['O', 16, 0]] },
    C3H8: { formula: 'C3H8', nombre: 'propano', at: [['C', -15, 0], ['C', 0, 0], ['C', 15, 0], ['H', -15, -12], ['H', 15, 12]] },
    Fe: { formula: 'Fe', nombre: 'hierro', at: [['Fe', 0, 0]] },
    Fe2O3: { formula: 'Fe2O3', nombre: 'óxido de hierro', at: [['Fe', -9, -6], ['Fe', 9, -6], ['O', -14, 8], ['O', 0, 8], ['O', 14, 8]] },
    C: { formula: 'C', nombre: 'carbono-14', at: [['C', 0, 0]] },
    N: { formula: 'N', nombre: 'nitrógeno-14', at: [['N', 0, 0]] },
  };
  const ESTADO = { s: 'sólido', l: 'líquido', g: 'gas' };
  // Casos de la lupa: partículas de antes y de después y su estado.
  const LUPAS = {
    agua: { antes: [['H2', 4], ['O2', 2]], despues: [['H2O', 4]], est: ['g', 'g'] },
    funde: { antes: [['H2O', 5]], despues: [['H2O', 5]], est: ['s', 'l'] },
    amoniaco: { antes: [['N2', 2], ['H2', 6]], despues: [['NH3', 4]], est: ['g', 'g'] },
    c14: { antes: [['C', 6]], despues: [['C', 4], ['N', 2]], est: ['s', 's'] },
    hierve: { antes: [['H2O', 4]], despues: [['H2O', 4]], est: ['l', 'g'] },
    propano: { antes: [['C3H8', 1], ['O2', 5]], despues: [['CO2', 3], ['H2O', 4]], est: ['g', 'g'] },
    oxido: { antes: [['Fe', 4], ['O2', 3]], despues: [['Fe2O3', 2]], est: ['s', 's'] },
    condensa: { antes: [['H2O', 4]], despues: [['H2O', 4]], est: ['g', 'l'] },
  };
  const W = 320, K = 1.4;
  const n1 = x => Math.round(x * 10) / 10;
  const xml = P.xml;
  const ancho = s => K * (Math.max(...ESP[s].at.map(([a, x]) => x + ATOMO[a][0])) - Math.min(...ESP[s].at.map(([a, x]) => x - ATOMO[a][0])));
  const izq = s => K * Math.min(...ESP[s].at.map(([a, x]) => x - ATOMO[a][0]));
  function particula(s, x0, cy) {
    const cx = x0 - izq(s);
    return ESP[s].at.map(([a, dx, dy]) => {
      const r = n1(K * ATOMO[a][0]), rel = ATOMO[a][1], x = n1(cx + K * dx), y = n1(cy + K * dy), fs = n1(K * (a.length > 1 || a === 'H' ? 7.5 : 9));
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${rel ? 'currentColor' : 'none'}"${rel ? ` fill-opacity="${rel === 1 ? 0.12 : 0.28}"` : ''} stroke="currentColor" stroke-width="1.2"/>`
        + `<text x="${x}" y="${n1(y + fs * 0.36)}" font-size="${fs}" text-anchor="middle" fill="currentColor">${xml(a)}</text>`;
    }).join('');
  }
  function filas(capa, util) {
    const quedan = capa.map(([s, n]) => [s, n]), ps = [];
    while (quedan.some(q => q[1] > 0)) for (const q of quedan) if (q[1] > 0) { ps.push(q[0]); q[1]--; }
    const rs = [[]]; let x = 0;
    for (const s of ps) { const a = ancho(s) + 8; if (x + a > util && rs[rs.length - 1].length) { rs.push([]); x = 0; } rs[rs.length - 1].push(s); x += a; }
    return rs;
  }
  // Alto de una partícula y distancia de su centro a su borde de arriba (cada fila mide lo que su partícula más alta).
  const altoP = s => K * (Math.max(...ESP[s].at.map(([a, , y]) => y + ATOMO[a][0])) - Math.min(...ESP[s].at.map(([a, , y]) => y - ATOMO[a][0])));
  const arriba = s => -K * Math.min(...ESP[s].at.map(([a, , y]) => y - ATOMO[a][0]));
  const altoFila = fila => Math.max(...fila.map(altoP)) + 8;
  function figuraLupas(c) {
    const gap = 18, pw = (W - 8 - gap) / 2, top = 22;
    const paneles = [{ titulo: `Antes, ${ESTADO[c.est[0]]}`, capa: c.antes }, { titulo: `Después, ${ESTADO[c.est[1]]}`, capa: c.despues }];
    const altoDe = rs => rs.reduce((t, fila) => t + altoFila(fila), 0);
    const H = n1(Math.max(...paneles.map(pn => altoDe(filas(pn.capa, pw - 12)) + 14))), alto = Math.round(top + H + 6);
    let s = `<svg viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}" xmlns="http://www.w3.org/2000/svg">`;
    paneles.forEach((pn, k) => {
      const x0 = 4 + k * (pw + gap), rs = filas(pn.capa, pw - 12);
      let y = top + (H - altoDe(rs)) / 2;
      s += `<text x="${n1(x0 + pw / 2)}" y="15" font-size="12" text-anchor="middle" fill="currentColor">${xml(pn.titulo)}</text>`;
      s += `<rect x="${n1(x0)}" y="${top}" width="${n1(pw)}" height="${H}" rx="12" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      rs.forEach(fila => {
        const hf = altoFila(fila);
        let x = x0 + (pw - (fila.reduce((t, q) => t + ancho(q) + 8, 0) - 8)) / 2;
        for (const q of fila) { s += particula(q, x, y + (hf - altoP(q)) / 2 + arriba(q)); x += ancho(q) + 8; }
        y += hf;
      });
    });
    const xm = n1(4 + pw + gap / 2), ym = n1(top + H / 2);
    s += `<path d="M${n1(xm - 6)} ${ym}h11m-5 -5l5 5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
    return s + '</svg>';
  }
  const describe = capa => lista(capa.map(([s, n]) => `${n} ${n === 1 ? 'partícula' : 'partículas'} de ${ESP[s].nombre} (${fm(ESP[s].formula)})`));
  // El tipo de cambio por las partículas: las mismas sustancias, físico; si no, ¿cambian los elementos?
  const elementos = capa => [...new Set(capa.flatMap(([s]) => ESP[s].formula.match(/[A-Z][a-z]?/g)))].sort().join();
  function tipoLupa(c) {
    const sa = c.antes.map(([s]) => s).sort().join(), sd = c.despues.map(([s]) => s).sort().join();
    if (sa === sd) return 'fisico';
    return elementos(c.antes) === elementos(c.despues) ? 'quimico' : 'nuclear';
  }
  const OPC = {
    fisico: 'Físico: las mismas partículas, en otro estado',
    quimico: 'Químico: otras partículas, los mismos átomos',
    nuclear: 'Nuclear: aparecen átomos de otro elemento',
  };
  // La cuarta opción: el error típico de cada caso, con el mismo largo que las otras.
  const CUARTA = {
    fisico: ['quimico-estado', 'Químico: al cambiar de estado, es otra sustancia', 'MA1', 'Bien: cambió el estado. Pero las partículas son las mismas: un cambio de estado es físico.'],
    quimico: ['fisico-atomos', 'Físico: los átomos son los mismos que antes', 'MA2', 'Bien: los átomos se conservan. Pero se unieron de otra forma: hay partículas nuevas, es químico.'],
    nuclear: ['quimico-nuclear', 'Químico: los átomos de carbono se reordenan', 'QM-NUCLEAR', 'Bien: algo cambió en la lupa. Pero aparecen átomos de nitrógeno que antes no estaban: es nuclear.'],
  };
  const SI_LUPA = {
    fisico: ['MA2', 'Bien: miraste las dos lupas. Pero después hay partículas que antes no estaban: no es físico.'],
    quimico: ['MA1', 'Bien: algo cambió. Pero las partículas de después son las mismas de antes: no es químico.'],
    nuclear: ['QM-NUCLEAR', 'Bien: algo cambió. Pero los elementos son los mismos antes y después: no es nuclear.'],
  };
  function tLupa(rng) {
    const real = rng.elegir(['fisico', 'quimico', 'nuclear', 'quimico', 'fisico']);
    const caso = rng.elegir(Object.keys(LUPAS).filter(k => tipoLupa(LUPAS[k]) === real)), c = LUPAS[caso];
    const errores = Object.keys(OPC).filter(k => k !== real).map(k => {
      const [id, ex] = real === 'nuclear' && k === 'quimico' ? ['QM-NUCLEAR', 'Bien: hay un cambio. Pero un cambio químico no crea átomos de otro elemento, y aquí aparece el nitrógeno.'] : SI_LUPA[k];
      return { clave: 'cambio:' + k, texto: OPC[k], ...err(id, ex) };
    });
    const [cid, ctx, cerr, cex] = CUARTA[real];
    errores.push({ clave: 'cambio:' + cid, texto: ctx, ...err(cerr, cex) });
    return {
      variables: {}, enunciado: ['La figura muestra la lupa de un frasco cerrado, antes y después de un cambio.'], pregunta: ['¿Qué tipo de cambio es?'],
      datos: [DEF_LUPA, DEF_FIS, DEF_QUI, DEF_NUC],
      figura: { svg: figuraLupas(c), alt: `Lupa de un frasco cerrado, un modelo y no una foto; cada bolita es un átomo con su símbolo. Antes, en estado ${ESTADO[c.est[0]]}: ${describe(c.antes)}. Después, en estado ${ESTADO[c.est[1]]}: ${describe(c.despues)}.` },
      alternativas: P.armarTexto({ correcta: { clave: 'cambio:' + real, texto: OPC[real] }, errores, rng }),
      respuesta: { valor: 'cambio:' + real, texto: OPC[real], unidad: '' },
      solucion: [
        [`Antes: ${lista(c.antes.map(([s]) => fm(ESP[s].formula)))}. Después: ${lista(c.despues.map(([s]) => fm(ESP[s].formula)))}.`],
        [real === 'fisico' ? `Las mismas partículas: solo pasan de ${ESTADO[c.est[0]]} a ${ESTADO[c.est[1]]}.`
          : real === 'quimico' ? 'Hay partículas nuevas, pero los elementos son los mismos: los átomos se unieron de otra forma.'
            : 'Aparecen átomos de nitrógeno, que antes no estaban: un átomo de carbono pasó a ser de otro elemento.'],
        [`Es un cambio ${real === 'fisico' ? 'físico' : real === 'quimico' ? 'químico' : 'nuclear'}.`],
      ],
      _datos: { tipo: 'lupa', nivel: 2, caso },
    };
  }

  // ---- Contar moléculas contando átomos ----
  // antes: [fórmula, n]; fijo: un producto que ya se dice cuántos hay; pide: el producto que se cuenta; el: el elemento
  // que solo está en lo que se pide (después).
  const ATOMOS = {
    propano: { antes: [['C3H8', 1], ['O2', 5]], fijo: ['CO2', 3], pide: 'H2O', el: 'H' },
    propanoC: { antes: [['C3H8', 1], ['O2', 5]], fijo: ['H2O', 4], pide: 'CO2', el: 'C' },
    agua: { antes: [['H2', 4], ['O2', 2]], fijo: null, pide: 'H2O', el: 'H' },
    oxido: { antes: [['Fe', 4], ['O2', 3]], fijo: null, pide: 'Fe2O3', el: 'Fe' },
    amoniaco: { antes: [['N2', 2], ['H2', 6]], fijo: null, pide: 'NH3', el: 'N' },
    metano: { antes: [['CH4', 2], ['O2', 4]], fijo: ['CO2', 2], pide: 'H2O', el: 'H' },
    etano: { antes: [['C2H6', 2], ['O2', 7]], fijo: ['CO2', 4], pide: 'H2O', el: 'H' },
  };
  const cuenta = f => { const r = {}; for (const [, s, n] of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) r[s] = (r[s] || 0) + (+n || 1); return r; };
  function tAtomos(rng) {
    const caso = rng.elegir(Object.keys(ATOMOS)), x = ATOMOS[caso];
    const at = {}; for (const [fo, n] of x.antes) for (const [s, k] of Object.entries(cuenta(fo))) at[s] = (at[s] || 0) + k * n;
    const enPide = cuenta(x.pide), k = enPide[x.el];
    const correcta = at[x.el] / k;
    const errores = [];
    // El otro elemento de lo que se pide, contado como si todo fuera a parar ahí.
    const otro = Object.keys(enPide).find(s => s !== x.el);
    if (otro && x.fijo && cuenta(x.fijo[0])[otro]) {
      const malo = at[otro] / enPide[otro];
      errores.push(e(malo, 'QM-CUENTA-O', `Bien contar átomos. Pero el ${otro} también va en el ${fm(x.fijo[0])}: no todo termina en ${fm(x.pide)}. Así salen ${f(malo)}.`));
    }
    errores.push(e(x.antes.reduce((t, [, n]) => t + n, 0), 'QM-MOLECULAS-IGUALES', `Bien la idea de que algo se conserva. Pero son los átomos, no las moléculas: antes hay ${x.antes.reduce((t, [, n]) => t + n, 0)} moléculas.`));
    if (k > 1) errores.push(e(at[x.el], 'QM-SUBINDICE', `Bien: ${at[x.el]} átomos de ${x.el}. Pero cada ${fm(x.pide)} lleva ${k}: hay que repartirlos de ${k} en ${k}.`));
    errores.push(e(correcta + 1, 'QM-CONTEO', `Bien contar átomos de ${x.el}. Pero revisa cuántos lleva cada ${fm(x.pide)}: con ${correcta + 1} sobrarían átomos.`));
    errores.push(e(correcta - 1, 'QM-CONTEO', `Bien contar átomos de ${x.el}. Pero revisa cuántos lleva cada ${fm(x.pide)}: con ${correcta - 1} faltarían átomos.`));
    const antes = lista(x.antes.map(([fo, n]) => `${n} ${n === 1 ? 'molécula' : 'moléculas'} de ${fm(fo)}`));
    return {
      variables: {}, enunciado: [`En un frasco cerrado hay ${antes}. Reaccionan del todo y, después, hay ${x.fijo ? `${x.fijo[1]} moléculas de ${fm(x.fijo[0])} y ` : 'solo '}moléculas de ${fm(x.pide)}.`],
      pregunta: [`¿Cuántas moléculas de ${fm(x.pide)} hay después?`],
      datos: [DEF_CONS, 'En una fórmula, el subíndice dice cuántos átomos de ese elemento hay'],
      alternativas: P.armar({ correcta, errores: errores.filter(q => q.valor > 0 && q.valor !== correcta && P.enEscala(q.valor, correcta, q.id)), rng, texto: q => String(q) }),
      respuesta: { valor: correcta, unidad: '' },
      solucion: [
        [`Se cuenta un elemento que después solo esté en ${fm(x.pide)}: el ${x.el}.`],
        [`Átomos de ${x.el} antes: ${x.antes.filter(([fo]) => cuenta(fo)[x.el]).map(([fo, n]) => `${n} × ${cuenta(fo)[x.el]}`).join(' + ')} = ${at[x.el]}.`],
        [`Cada ${fm(x.pide)} lleva ${k}: ${at[x.el]} ÷ ${k} = ${correcta} moléculas.`],
      ],
      _datos: { tipo: 'atomos', nivel: 2, caso },
    };
  }

  // ---- Contar los químicos de una lista (San Marcos) ----
  function tContar(rng) {
    const ids = rng.barajar(Object.keys(FEN)).slice(0, 4), n = ids.filter(k => FEN[k].clase === 'quimico').length;
    if (n === 0 || n === 4) return null;
    const estado = ids.filter(k => FEN[k].clase === 'estado').length, dis = ids.filter(k => FEN[k].clase === 'disolver').length;
    const nuc = ids.filter(k => FEN[k].clase === 'nuclear').length;
    const errores = [
      e(n + estado, 'MA1', `Bien los químicos. Pero un cambio de estado no forma sustancias nuevas: es físico. Así contaste ${n + estado}.`),
      e(n + dis, 'MA3', `Bien los químicos. Pero disolver no forma sustancias nuevas: es físico. Así contaste ${n + dis}.`),
      e(n + nuc, 'QM-NUCLEAR', `Bien los químicos. Pero el carbono-14 que pasa a nitrógeno es nuclear, no químico. Así contaste ${n + nuc}.`),
      e(n - 1, 'MA2', `Bien el criterio. Pero se te pasó uno que forma una sustancia nueva. Así contaste ${n - 1}.`),
      e(n + 1, 'QM-CONTEO', `Bien el criterio. Pero contaste uno que deja las mismas partículas. Así contaste ${n + 1}.`),
      e(4, 'MA1', 'Bien: en todos cambia algo. Pero solo en algunos aparecen sustancias nuevas. Así contaste 4.'),
    ].filter(q => q.valor !== n && q.valor > 0 && q.valor <= 4);
    return {
      variables: {}, enunciado: [`Mira estos fenómenos: ${ids.map((k, i) => `${NUM[i]}. ${FEN[k].texto}.`).join(' ')}`],
      pregunta: ['¿Cuántos son cambios químicos?'], datos: [DEF_FIS, DEF_QUI, DEF_NUC],
      alternativas: P.armar({ correcta: n, errores, rng, texto: q => String(q) }), respuesta: { valor: n, unidad: '' },
      solucion: [
        ['Químico solo si después hay una sustancia que antes no estaba; un cambio de estado, disolver o romper son físicos.'],
        [ids.map((k, i) => `${NUM[i]}: ${tipoDe(FEN[k].clase) === 'quimico' ? 'químico' : tipoDe(FEN[k].clase) === 'nuclear' ? 'nuclear' : 'físico'}`).join('; ') + '.'],
        [`Son ${n} químicos.`],
      ],
      _datos: { tipo: 'contar', nivel: 3, ids },
    };
  }

  // ---- La balanza: lana de acero que arde ----
  function tBalanza(rng) {
    const cerrado = rng.moneda(), lana = rng.elegir([2.8, 5.6, 11.2]), frasco = rng.elegir([150, 200, 250]);
    const O = limpio(lana * 24 / 56), oxido = limpio(lana + O), correcta = cerrado ? frasco : limpio(frasco + O);
    const errores = cerrado ? [
      e(frasco + O, 'MA5', `Bien: el hierro toma ${f(O)} g de oxígeno. Pero ese oxígeno ya estaba dentro del frasco cerrado: ${f(frasco + O)} g lo cuenta dos veces.`),
      e(frasco - lana, 'QM-MASA-SE-VA', `Bien: el hierro se transforma. Pero arder no destruye átomos: la lana no desaparece. Así saldrían ${f(frasco - lana)} g.`),
      e(frasco - O, 'QM-MASA-SE-VA', `Bien: se gasta oxígeno del aire de adentro. Pero queda en el óxido, dentro del frasco. Así saldrían ${f(frasco - O)} g.`),
      e(oxido, 'QM-SOLO-SOLIDO', `Bien la masa del óxido, ${f(oxido)} g. Pero la balanza pesa todo el frasco, no solo el óxido.`),
    ] : [
      e(frasco, 'MA4', `Bien: los átomos se conservan. Pero el frasco está abierto: entra oxígeno del aire y se suma. Así dirías ${f(frasco)} g.`),
      e(frasco - lana, 'QM-MASA-SE-VA', `Bien: el hierro se transforma. Pero arder no destruye átomos: la lana no desaparece. Así saldrían ${f(frasco - lana)} g.`),
      e(frasco + oxido, 'QM-SUMA-OXIDO', `Bien sumar el óxido que se forma. Pero el hierro ya estaba en la balanza: solo se suma el oxígeno. Así saldrían ${f(frasco + oxido)} g.`),
      e(oxido, 'QM-SOLO-SOLIDO', `Bien la masa del óxido, ${f(oxido)} g. Pero la balanza pesa todo el frasco, no solo el óxido.`),
    ];
    return {
      variables: { m: { nombre: 'masa del frasco con la lana', color: 'o' }, l: { nombre: 'lana de acero', color: 'i' }, x: { nombre: 'lo que marca al final', color: 'f' } },
      enunciado: [`Sobre una balanza, un frasco ${cerrado ? 'cerrado' : 'abierto'} con `, v('l', `${f(lana)} g`), ' de lana de acero (hierro) marca ', v('m', `${f(frasco)} g`),
        `. La lana arde por completo${cerrado ? ' con el oxígeno de adentro' : ' con el oxígeno del aire'}.`],
      pregunta: ['¿Qué ', v('x', 'marca la balanza'), ' al final?'],
      datos: ['Al arder, el hierro se une al oxígeno y forma óxido de hierro', 'Cada 56 g de hierro toman 24 g de oxígeno', 'Los átomos no se crean ni se destruyen'],
      alternativas: P.armar({ correcta, errores: errores.filter(q => q.valor > 0 && P.enEscala(q.valor, correcta, q.id)), rng, texto: q => `${f(q)} g` }),
      respuesta: { valor: correcta, unidad: 'g' },
      solucion: [
        ['El oxígeno que toma la lana: ', v('l', `${f(lana)} g`), ` × 24 ÷ 56 = ${f(O)} g.`],
        [cerrado ? 'El frasco está cerrado: ese oxígeno ya estaba adentro, y nada entra ni sale.' : 'El frasco está abierto: ese oxígeno entra del aire y se suma.'],
        [cerrado ? ['La balanza marca lo mismo: ', v('x', `${f(correcta)} g`), '.'] : [v('m', `${f(frasco)} g`), ` + ${f(O)} g = `, v('x', `${f(correcta)} g`), '.']].flat(),
      ],
      _datos: { tipo: 'balanza', nivel: 3, cerrado, frasco, lana },
    };
  }

  const TIPOS = ['cual', 'cual', 'propiedad', 'propiedad', 'lupa', 'lupa', 'lupa', 'atomos', 'atomos', 'contar', 'contar', 'balanza', 'balanza'];
  const NIVEL = { cual: 1, propiedad: 1, lupa: 2, atomos: 2, contar: 3, balanza: 3 };
  const CONSTRUIR = { cual: tCual, propiedad: tPropiedad, lupa: tLupa, atomos: tAtomos, contar: tContar, balanza: tBalanza };
  // Papel (regla 6); la lupa lleva figura y no va.
  const PAPEL = { 'papel-1': 'cual', 'papel-2': 'propiedad', 'papel-3': 'cual', 'papel-4': 'atomos', 'papel-5': 'atomos',
    'papel-6': 'contar', 'papel-7': 'balanza', 'papel-8': 'balanza' };

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = PAPEL[String(semilla)] || rng.elegir(TIPOS);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (pr && pr.alternativas.length >= 4) {
        return { id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
          alternativas: pr.alternativas, solucion: pr.solucion, respuesta: pr.respuesta, _datos: pr._datos,
          ...(pr.figura ? { figura: pr.figura } : {}) };
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: '¿Físico, químico o nuclear?', generar, NIVEL, FEN, PROP, LUPAS, ATOMOS, ESP };
});
