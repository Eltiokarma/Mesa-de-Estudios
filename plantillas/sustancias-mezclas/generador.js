/*
 * Generador «¿Sustancia pura o mezcla?»: práctica de la idea 1 de «Materia y energía» (quimica.materia-y-energia;
 * contenido/teoria/quimica/materia-y-energia.js, idea «sustancia-mezcla»). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['sustancias-mezclas']) y en Node (require).
 * No usa ningún motor de escena: la clasificación sale de contar clases de partícula, clases de átomo y fases, con las
 * mismas reglas de la teoría (una clase de partícula: sustancia pura; de una clase de átomo: elemento; varias clases
 * en una fase: homogénea; en varias: heterogénea; lo disuelto no es otra fase; el hielo es agua).
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   lupa      (1) la lupa de una muestra (figura de partículas, sin colores de variable): ¿cómo se clasifica?
 *   material  (2) un material de todos los días con su composición en los datos: ¿cómo se clasifica?
 *   formada   (3) como San Marcos 2019-I: ¿la mezcla es de elementos, de compuestos o de los dos?
 *   fases     (3) un vaso descrito con palabras: ¿cuántas fases y cuántos componentes?
 *   contar    (3) una lista de cinco materiales: ¿cuántos son mezclas, compuestos o elementos?
 * _datos: lupa { tipo, nivel, capas: [[[especie, n], …], …] } (cada capa es una fase); material { tipo, nivel, m };
 *   formada { tipo, nivel, m, formulas }; fases { tipo, nivel, partes: ['hielo'|'sal'|'azucar'|'aceite'|'arena'] }
 *   (más el agua líquida, siempre); contar { tipo, nivel, pide: 'mezclas'|'compuestos'|'elementos', lista: [ids] }.
 * Respuestas: lupa y material, clave 'clase:elemento|compuesto|homogenea|heterogenea'; formada, 'formada:el|co|am';
 *   fases, 'fc:F|C'; contar, un número.
 *
 * Figura (lupa): de partículas, nunca de variables (docs/etapa2/decisiones.md). Átomos en tinta (currentColor), cada
 * uno con su símbolo y un relleno por elemento para leerse en grises (el N, oscuro, para no confundirse con el H hueco);
 * la línea punteada es el borde entre dos fases. Toda molécula lleva los átomos de su fórmula (auditoría, 17 nov: nada
 * en corto; el aceite, que no cabe entero, ya no se dibuja). La sal disuelta va como iones sueltos, Na⁺ y Cl⁻, entre el
 * agua (Gerson, 17 nov); en el cristal, como par NaCl. generador.test.js cuenta los átomos contra la fórmula.
 * No dice la clase. El papel no lleva figura (herramientas/papel-generador.js salta esos problemas).
 * Datos (docs/plan-calidad.md §3, punto 13): las definiciones entre las que se elige, nunca la clase ya decidida.
 * Errores: MA9 y MA10 (docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md, respaldo parcial:
 *   el informe los mide con otros ítems); los de la teoría QM-HOMO, QM-HETERO, QM-FASE-DISUELTO,
 *   QM-INVIERTE, AQ-solo-elementos, AQ-solo-compuestos y AQ-elementos-y-compuestos (hipótesis), y los nuevos
 *   QM-COMP-FASES (cuenta los componentes como si fueran las fases), QM-SIN-AGUA (no cuenta el agua como componente) y QM-CONTEO (uno de más o de menos en la lista),
 *   hipótesis.
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
  const ID = 'sustancias-mezclas';
  const FMA = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  // Un código del informe va como «parcial» (el informe lo mide con otro ítem); los nuevos, «hipotesis».
  const DEL_INFORME = new Set(['MA9', 'MA10']);
  const err = (id, explicacion) => (DEL_INFORME.has(id)
    ? { id, explicacion, respaldo: 'parcial', fuente: FMA } : { id, explicacion, respaldo: 'hipotesis', fuente: null });
  const SUBI = '₀₁₂₃₄₅₆₇₈₉';
  const fm = x => String(x).replace(/\d/g, c => SUBI[c]);
  const lista = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);

  // ---- Definiciones que van en los datos (las mismas de la teoría) ----
  const DEF_LUPA = 'En la lupa, cada bolita es un átomo; los átomos pegados forman una partícula';
  const DEF_SM = 'Sustancia pura: una sola clase de partícula. Mezcla: varias clases';
  const DEF_EC = 'Elemento: átomos de una sola clase. Compuesto: átomos distintos unidos';
  const DEF_HH = 'Mezcla homogénea: una sola fase. Heterogénea: dos fases o más';
  const DEF_BORDE = 'La línea punteada de la lupa es el borde entre dos fases';
  const DEF_FASE = 'Fase: zona que se ve igual en todos sus puntos, con un borde';
  const DEF_COMP = 'Componente: cada sustancia distinta del sistema';
  const DEF_FORM = 'En una fórmula, cada símbolo es una clase de átomo: CO₂ tiene C y O';

  // ---- Especies: los átomos que dibuja la lupa y su fórmula ----
  // Átomos: radio y relleno (0 hueco, 1 claro, 2 medio) para leerse en grises; el símbolo va dentro.
  // Relleno: 0 hueco, 1 claro, 2 medio, 3 oscuro (con la letra en el color de la tarjeta).
  const ATOMO = { H: [6, 0], O: [8.5, 2], C: [8.5, 1], N: [8.5, 3], Na: [9, 1], Cl: [9.5, 2], Si: [8.5, 1], Cu: [10, 2], Sn: [10, 1], He: [8, 0], Ar: [9, 1] };
  const ROT = { Na: 'Na⁺', Cl: 'Cl⁻' };
  const ESP = {
    H2O: { formula: 'H2O', nombre: 'agua', at: [['O', 0, -2], ['H', -11, 6], ['H', 11, 6]] },
    O2: { formula: 'O2', nombre: 'oxígeno', at: [['O', -8, 0], ['O', 8, 0]] },
    N2: { formula: 'N2', nombre: 'nitrógeno', at: [['N', -8, 0], ['N', 8, 0]] },
    O3: { formula: 'O3', nombre: 'ozono', at: [['O', -15, 5], ['O', 0, -4], ['O', 15, 5]] },
    CO2: { formula: 'CO2', nombre: 'dióxido de carbono', at: [['O', -16, 0], ['C', 0, 0], ['O', 16, 0]] },
    NaCl: { formula: 'NaCl', nombre: 'sal', at: [['Na', -9, 0], ['Cl', 9.5, 0]] },
    // La sal disuelta: sus iones sueltos entre el agua. Cuentan como una sola sustancia, la sal (clasificar).
    'Na+': { formula: 'Na', nombre: 'ion sodio', rotulo: 'Na⁺', de: 'NaCl', at: [['Na', 0, 0]] },
    'Cl-': { formula: 'Cl', nombre: 'ion cloruro', rotulo: 'Cl⁻', de: 'NaCl', at: [['Cl', 0, 0]] },
    He: { formula: 'He', nombre: 'helio', at: [['He', 0, 0]] },
    Ar: { formula: 'Ar', nombre: 'argón', at: [['Ar', 0, 0]] },
    Cu: { formula: 'Cu', nombre: 'cobre', at: [['Cu', 0, 0]] },
    Sn: { formula: 'Sn', nombre: 'estaño', at: [['Sn', 0, 0]] },
    SiO2: { formula: 'SiO2', nombre: 'arena', at: [['O', -16, 0], ['Si', 0, 0], ['O', 16, 0]] },
  };
  const elementosDe = f => [...new Set(String(f).match(/[A-Z][a-z]?/g))];

  // Clasificación por las reglas de la teoría. capas: [[[especie, n], …], …]; cada capa es una fase.
  // La sustancia de una partícula dibujada: los iones sueltos son de la sal.
  const sustancia = e => ESP[e].de || e;
  function clasificar(capas) {
    const especies = [...new Set(capas.flat().filter(([, n]) => n > 0).map(([e]) => sustancia(e)))];
    if (especies.length === 1) return elementosDe(ESP[especies[0]].formula).length === 1 ? 'elemento' : 'compuesto';
    return capas.length === 1 ? 'homogenea' : 'heterogenea';
  }

  // ---- Las cuatro clases como alternativas (armarTexto) ----
  const NOMBRE = { elemento: 'Un elemento', compuesto: 'Un compuesto', homogenea: 'Una mezcla homogénea', heterogenea: 'Una mezcla heterogénea' };
  const CORTO = { elemento: 'elemento', compuesto: 'compuesto', homogenea: 'mezcla homogénea', heterogenea: 'mezcla heterogénea' };
  const pura = x => x === 'elemento' || x === 'compuesto';
  // Por qué no es la elegida: empieza por lo que el alumno vio bien; el código es el error que lleva a elegirla.
  function siFuera(elegida, real) {
    if (pura(elegida) && pura(real)) return elegida === 'elemento'
      ? ['MA9', 'Hay una sola clase de partícula, bien visto: es sustancia pura. Pero cada partícula une átomos de elementos distintos, y eso la hace compuesto; un elemento tendría átomos de un solo tipo.']
      : ['MA9', 'Hay una sola clase de partícula, bien visto: es sustancia pura. Pero sus átomos son todos del mismo elemento, aunque vayan pegados de a dos o de a tres: es elemento, no compuesto.'];
    if (pura(elegida)) return real === 'homogenea'
      ? ['MA10', 'Se reparte parejo, en una sola fase, bien visto. Pero verse parejo no la vuelve pura: hay más de una clase de partícula, así que es mezcla, como el agua con azúcar.']
      : ['MA9', 'Miraste las partículas, bien. Pero hay más de una clase, sueltas y en zonas distintas, así que es mezcla: una sustancia pura tendría todas sus partículas iguales.'];
    if (pura(real)) return real === 'compuesto'
      ? ['MA9', 'Viste dos clases de átomo, bien. Pero van unidos dentro de cada partícula, y todas las partículas son iguales: hay una sola clase, así que no es mezcla sino compuesto.']
      : ['MA9', 'Para ser mezcla haría falta más de una clase de partícula, y aquí todas son iguales, con átomos de un mismo elemento. Juntar varios átomos iguales no cambia la clase.'];
    return elegida === 'homogenea'
      ? ['QM-HOMO', 'Hay más de una clase de partícula, bien: es mezcla. Pero forman zonas distintas con un borde entre ellas, así que hay dos fases o más; homogénea sería una sola zona pareja.']
      : ['QM-HETERO', 'Hay más de una clase de partícula, bien: es mezcla. Pero se reparten juntas en una sola zona, sin bordes, así que hay una sola fase; heterogénea tendría zonas separadas por un borde.'];
  }
  function alternativasClase(real, rng) {
    const errores = Object.keys(NOMBRE).filter(k => k !== real).map(k => {
      const [id, explicacion] = siFuera(k, real);
      return { clave: 'clase:' + k, texto: NOMBRE[k], ...err(id, explicacion) };
    });
    return P.armarTexto({ correcta: { clave: 'clase:' + real, texto: NOMBRE[real] }, errores, rng });
  }
  const PORQUE = {
    elemento: 'Hay una sola clase de partícula, y todos sus átomos son del mismo elemento.',
    compuesto: 'Hay una sola clase de partícula, y cada una une átomos de elementos distintos.',
    homogenea: 'Hay más de una clase de partícula, y todas se reparten en una sola fase, sin bordes.',
    heterogenea: 'Hay más de una clase de partícula, y forman zonas distintas, con bordes entre ellas: dos fases o más.',
  };

  // ---- Figura de la lupa: paneles con sus capas (de arriba abajo), en tinta ----
  const W = 320;
  const xml = P.xml;
  // Escala de las partículas en la lupa (la figura mide 320 de ancho, como la del celular).
  const K = 1.45;
  function ancho(e) { const at = ESP[e].at; return K * (Math.max(...at.map(([s, x]) => x + ATOMO[s][0])) - Math.min(...at.map(([s, x]) => x - ATOMO[s][0]))); }
  const izq = e => K * Math.min(...ESP[e].at.map(([s, x]) => x - ATOMO[s][0]));
  // La partícula con su borde izquierdo en x0.
  function particula(e, x0, cy) {
    const cx = x0 - izq(e);
    return ESP[e].at.map(([s, dx, dy]) => {
      const r = n1(K * ATOMO[s][0]), rel = ATOMO[s][1], x = n1(cx + K * dx), y = n1(cy + K * dy);
      const relleno = rel === 0 ? 'none' : 'currentColor';
      const op = rel === 0 ? '' : ` fill-opacity="${[0, 0.12, 0.28, 0.62][rel]}"`;
      const t = ROT[s] || s, fs = n1(K * (t.length > 2 ? 7.5 : s === 'H' ? 7.5 : 9));
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${relleno}"${op} stroke="currentColor" stroke-width="1.2"/>`
 + `<text x="${x}" y="${n1(y + fs * 0.36)}" font-size="${fs}" text-anchor="middle" fill="${rel === 3 ? 'var(--card)' : 'currentColor'}">${xml(t)}</text>`;
    }).join('');
  }
  // Las partículas de una capa, intercaladas (una de cada especie por turno) y en filas.
  function intercalar(capa) {
    const quedan = capa.map(([e, n]) => [e, n]), out = [];
    while (quedan.some(q => q[1] > 0)) for (const q of quedan) if (q[1] > 0) { out.push(q[0]); q[1]--; }
    return out;
  }
  const FILA = 44;
  const n1 = x => Math.round(x * 10) / 10;
  function filas(capa, anchoUtil) {
    const ps = intercalar(capa), rs = [[]];
    let x = 0;
    for (const e of ps) {
      const a = ancho(e) + 10;
      if (x + a > anchoUtil && rs[rs.length - 1].length) { rs.push([]); x = 0; }
      rs[rs.length - 1].push(e); x += a;
    }
    return rs;
  }
  function figuraLupa(paneles) {
    const n = paneles.length, gap = 12, pw = (W - 8 - gap * (n - 1)) / n;
    const altos = paneles.map(pn => pn.capas.reduce((t, c) => t + filas(c, pw - 16).length * FILA + 12, 0));
    const H = Math.max(...altos), top = 22, alto = Math.round(top + H + 6);
    let s = `<svg viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}" xmlns="http://www.w3.org/2000/svg">`;
    paneles.forEach((pn, k) => {
      const x0 = 4 + k * (pw + gap);
      s += `<text x="${x0 + pw / 2}" y="15" font-size="12" text-anchor="middle" fill="currentColor">${xml(pn.titulo)}</text>`;
      s += `<rect x="${x0}" y="${top}" width="${pw}" height="${H}" rx="12" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      let y = top;
      pn.capas.forEach((c, j) => {
        const rs = filas(c, pw - 16), hc = (j === pn.capas.length - 1) ? top + H - y : rs.length * FILA + 12;
        if (j > 0) s += `<line x1="${x0 + 4}" y1="${y}" x2="${x0 + pw - 4}" y2="${y}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5 4"/>`;
        const y0 = y + (hc - rs.length * FILA) / 2 + FILA / 2;
        rs.forEach((fila, i) => {
          const total = fila.reduce((t, e) => t + ancho(e) + 10, 0) - 10;
          let x = x0 + (pw - total) / 2;
          for (const e of fila) { s += particula(e, x, y0 + i * FILA); x += ancho(e) + 10; }
        });
        y += hc;
      });
    });
    return s + '</svg>';
  }
  function altLupa(paneles) {
    const capa = c => lista(c.filter(([, n]) => n > 0).map(([e, n]) => (ESP[e].de ? `${n} ${n === 1 ? ESP[e].nombre : ESP[e].nombre.replace('ion', 'iones')} (${ESP[e].rotulo}) sueltos`
      : `${n} ${n === 1 ? 'partícula' : 'partículas'} de ${ESP[e].nombre} (${fm(ESP[e].formula)})`)));
    return 'Lupa de una muestra, un modelo y no una foto: cada bolita es un átomo con su símbolo. '
      + paneles.map(pn => (pn.capas.length === 1 ? `En una sola zona: ${capa(pn.capas[0])}.`
        : `${pn.capas.length} zonas separadas por una línea punteada. ` + pn.capas.map((c, i) => `${i === 0 ? 'Arriba' : i === pn.capas.length - 1 ? 'abajo' : 'en medio'}, ${capa(c)}`).join('; ') + '.')).join(' ');
  }

  // ---- Tipo lupa: las muestras (una capa por fase) ----
  const LUPAS = [
    { titulo: 'Agua destilada', capas: [[['H2O', 6]]] },
    { titulo: 'Un frasco de gas', capas: [[['O2', 6]]] },
    { titulo: 'Un frasco de gas', capas: [[['N2', 6]]] },
    { titulo: 'Un globo', capas: [[['He', 7]]] },
    { titulo: 'Un frasco de gas', capas: [[['O3', 5]]] },
    { titulo: 'Un extintor', capas: [[['CO2', 5]]] },
    { titulo: 'Un cristal', capas: [[['NaCl', 6]]] },
    { titulo: 'Un frasco de gas', capas: [[['N2', 4], ['O2', 2]]] },
    { titulo: 'Un vaso', capas: [[['H2O', 4], ['Na+', 2], ['Cl-', 2]]] },
    { titulo: 'Un frasco de gas', capas: [[['N2', 3], ['Ar', 2]]] },
    { titulo: 'Un trozo de metal', capas: [[['Cu', 5], ['Sn', 2]]] },
    { titulo: 'Un vaso', capas: [[['H2O', 3], ['CO2', 2]]] },
    { titulo: 'Un vaso', capas: [[['H2O', 4]], [['SiO2', 3]]] },
    { titulo: 'Un vaso', capas: [[['H2O', 3], ['Na+', 1], ['Cl-', 1]], [['SiO2', 3]]] },
  ];
  function tLupa(rng) {
    // Primero la clase (las cuatro salen igual de seguido) y después una muestra de esa clase.
    const real = rng.elegir(Object.keys(NOMBRE));
    const m = rng.elegir(LUPAS.filter(x => clasificar(x.capas) === real));
    const paneles = [{ titulo: m.titulo, capas: m.capas }];
    const datos = [DEF_LUPA, DEF_SM, DEF_EC, DEF_HH];
    if (m.capas.length > 1) datos.push(DEF_BORDE);
    const ps = m.capas.flat(), clases = [...new Set(ps.map(([e]) => sustancia(e)))];
    return {
      variables: {}, enunciado: ['La figura muestra la lupa de una muestra.'], pregunta: ['¿Cómo se clasifica?'], datos,
      figura: { svg: figuraLupa(paneles), alt: altLupa(paneles) },
      alternativas: alternativasClase(real, rng), respuesta: { valor: 'clase:' + real, texto: NOMBRE[real], unidad: '' },
      solucion: [
        [`En la lupa hay ${clases.length === 1 ? 'una sola clase de partícula' : `${clases.length} sustancias`}: ${lista(clases.map(e => (e === 'NaCl' && ps.some(([x]) => x === 'Na+') ? 'la sal (sus iones Na⁺ y Cl⁻, sueltos)' : fm(ESP[e].formula))))}.`],
        [clases.length === 1 ? (pura(real) && real === 'elemento' ? 'Todos sus átomos son de la misma clase.' : 'Cada partícula une átomos de elementos distintos.')
          : m.capas.length === 1 ? 'Están repartidas en una sola zona, sin bordes, así que hay una fase.' : 'Una línea punteada separa dos zonas, así que hay dos fases.'],
        [PORQUE[real], ' Es ', NOMBRE[real].toLowerCase(), '.'],
      ],
      _datos: { tipo: 'lupa', nivel: 1, capas: m.capas },
    };
  }

  // ---- Tipo material: lo que tiene cada material va en los datos ----
  // clase: la que dan las reglas con su composición (comprobada aparte en casos.json).
  const MATERIALES = [
    { id: 'bronce', nombre: 'el bronce de una campana', dato: 'Bronce: cobre y estaño fundidos juntos; se ve parejo', clase: 'homogenea' },
    { id: 'aire', nombre: 'el aire limpio y seco', dato: 'Aire seco: nitrógeno (N₂), oxígeno (O₂) y otros gases, repartidos parejo', clase: 'homogenea' },
    { id: 'diamante', nombre: 'un diamante', dato: 'Diamante: solo átomos de carbono, unidos en una red', clase: 'elemento' },
    { id: 'sal', nombre: 'la sal de mesa', dato: 'Sal de mesa: cloruro de sodio, NaCl; un sodio por cada cloro', clase: 'compuesto' },
    { id: 'ozono', nombre: 'el ozono', dato: 'Ozono: moléculas O₃, de tres átomos de oxígeno', clase: 'elemento' },
    { id: 'granito', nombre: 'un trozo de granito', dato: 'Granito: roca con granos de cuarzo, feldespato y mica que se ven a simple vista', clase: 'heterogenea' },
    { id: 'mar', nombre: 'el agua de mar', dato: 'Agua de mar: agua con sales disueltas; se ve transparente', clase: 'homogenea' },
    { id: 'oro', nombre: 'una joya de oro de 24 quilates', dato: 'Oro de 24 quilates: solo átomos de oro', clase: 'elemento' },
    { id: 'azucar', nombre: 'el azúcar de la azucarera', dato: 'Azúcar: moléculas C₁₂H₂₂O₁₁, todas iguales', clase: 'compuesto' },
    { id: 'acero', nombre: 'una varilla de acero', dato: 'Acero: hierro con un poco de carbono, fundidos juntos; se ve parejo', clase: 'homogenea' },
    { id: 'chicha', nombre: 'una chicha morada con hielo', dato: 'Chicha con hielo: agua, azúcar y otras sustancias disueltas, y cubitos de hielo que flotan', clase: 'heterogenea' },
    { id: 'destilada', nombre: 'el agua destilada de la farmacia', dato: 'Agua destilada: solo moléculas H₂O', clase: 'compuesto' },
    { id: 'gaseosa', nombre: 'una gaseosa recién abierta, con burbujas', dato: 'Gaseosa con burbujas: líquido con azúcar disuelto y burbujas de CO₂ que suben', clase: 'heterogenea' },
    { id: 'hielo-seco', nombre: 'un trozo de hielo seco', dato: 'Hielo seco: CO₂ sólido; solo moléculas CO₂', clase: 'compuesto' },
  ];
  function tMaterial(rng) {
    const real = rng.elegir(Object.keys(NOMBRE));
    const m = rng.elegir(MATERIALES.filter(x => x.clase === real));
    return {
      variables: {}, enunciado: [`Piensa en ${m.nombre}.`], pregunta: ['¿Cómo se clasifica?'],
      datos: [m.dato, DEF_SM, DEF_EC, DEF_HH],
      alternativas: alternativasClase(real, rng), respuesta: { valor: 'clase:' + real, texto: NOMBRE[real], unidad: '' },
      solucion: [
        [`El dato dice qué tiene ${m.nombre}: ${m.dato.split(': ')[1]}.`],
        ['Primero se cuentan las clases de partícula: si hay una, es sustancia pura, y si hay varias, es mezcla. Después se miran los átomos de la sustancia o las fases de la mezcla.'],
        [PORQUE[real], ' Es ', NOMBRE[real].toLowerCase(), '.'],
      ],
      _datos: { tipo: 'material', nivel: 2, m: m.id },
    };
  }

  // ---- Tipo formada: de qué está hecha una mezcla (San Marcos 2019-I) ----
  const MEZCLAS = [
    { id: 'aire-humedo', nombre: 'el aire húmedo', dato: 'Aire húmedo: N₂, O₂, CO₂ y vapor de agua (H₂O), repartidos parejo', formulas: ['N2', 'O2', 'CO2', 'H2O'] },
    { id: 'pecera', nombre: 'el agua de una pecera', dato: 'Agua de pecera: agua (H₂O) con oxígeno (O₂) disuelto', formulas: ['H2O', 'O2'] },
    { id: 'encendedor', nombre: 'el gas de un encendedor', dato: 'Gas de encendedor: butano (C₄H₁₀) y propano (C₃H₈) mezclados', formulas: ['C4H10', 'C3H8'] },
    { id: 'con-gas', nombre: 'el agua con gas', dato: 'Agua con gas: agua (H₂O) con dióxido de carbono (CO₂) disuelto', formulas: ['H2O', 'CO2'] },
    { id: 'bronce', nombre: 'el bronce', dato: 'Bronce: cobre (Cu) y estaño (Sn) fundidos juntos', formulas: ['Cu', 'Sn'] },
    { id: 'acero', nombre: 'el acero', dato: 'Acero: hierro (Fe) con un poco de carbono (C), fundidos juntos', formulas: ['Fe', 'C'] },
    { id: 'nitrox', nombre: 'el nitrox de un tanque de buceo', dato: 'Nitrox: gas para bucear, de nitrógeno (N₂) y oxígeno (O₂) mezclados', formulas: ['N2', 'O2'] },
    { id: 'salmuera', nombre: 'la salmuera de las aceitunas', dato: 'Salmuera: agua (H₂O) con sal (NaCl) disuelta', formulas: ['H2O', 'NaCl'] },
    { id: 'aire-seco', nombre: 'el aire seco', dato: 'Aire seco: N₂, O₂ y argón (Ar), con un poco de CO₂', formulas: ['N2', 'O2', 'Ar', 'CO2'] },
  ];
  const FORMADA = { el: 'Una mezcla de elementos solamente', co: 'Una mezcla de compuestos solamente', am: 'Una mezcla de elementos y compuestos', uno: 'Un compuesto de varios elementos' };
  const formadaDe = fs => { const t = fs.map(x => elementosDe(x).length === 1); return t.every(Boolean) ? 'el' : t.every(x => !x) ? 'co' : 'am'; };
  const SI_FORMADA = {
    el: ['AQ-solo-elementos', 'Sería así si cada fórmula tuviera un solo símbolo. Pero una fórmula de dos símbolos o más une átomos de elementos distintos, y eso es un compuesto.'],
    co: ['AQ-solo-compuestos', 'Sería así si todas las fórmulas tuvieran dos símbolos o más. Pero una fórmula de un solo símbolo, como O₂, tiene átomos de un solo elemento: es un elemento.'],
    am: ['AQ-elementos-y-compuestos', 'Sería así si hubiera fórmulas de un solo símbolo y también de varios. Pero aquí todas son del mismo tipo, así que la mezcla no junta elementos con compuestos.'],
    uno: ['MA9', 'Tiene varios elementos, cierto. Pero no están unidos en una sola clase de partícula: cada fórmula es una sustancia aparte, y varias sustancias sueltas forman una mezcla.'],
  };
  function tFormada(rng) {
    const m = rng.elegir(MEZCLAS), real = formadaDe(m.formulas);
    const els = m.formulas.filter(x => elementosDe(x).length === 1), cos = m.formulas.filter(x => elementosDe(x).length > 1);
    const partes = [];
    if (els.length) partes.push(`${lista(els.map(fm))} ${els.length === 1 ? 'tiene un solo símbolo, así que es un elemento' : 'tienen un solo símbolo cada uno, así que son elementos'}`);
    if (cos.length) partes.push(`${lista(cos.map(fm))} ${cos.length === 1 ? 'tiene dos símbolos o más, así que es un compuesto' : 'tienen dos símbolos o más cada uno, así que son compuestos'}`);
    const errores = Object.keys(FORMADA).filter(k => k !== real).map(k => ({ clave: 'formada:' + k, texto: FORMADA[k], ...err(SI_FORMADA[k][0], SI_FORMADA[k][1]) }));
    return {
      variables: {}, enunciado: [`Piensa en ${m.nombre}.`], pregunta: ['¿De qué está formado?'],
      datos: [m.dato, DEF_SM, DEF_EC, DEF_FORM],
      alternativas: P.armarTexto({ correcta: { clave: 'formada:' + real, texto: FORMADA[real] }, errores, rng }),
      respuesta: { valor: 'formada:' + real, texto: FORMADA[real], unidad: '' },
      solucion: [
        [`Tiene ${m.formulas.length} clases de partícula, así que es una mezcla.`],
        [`${partes.join('; ')}.`],
        ['El subíndice no cambia la clase: el O₂, por ejemplo, tiene dos átomos y sigue siendo un elemento.'],
      ],
      _datos: { tipo: 'formada', nivel: 3, m: m.id, formulas: m.formulas },
    };
  }

  // ---- Tipo fases: un vaso con agua y otras cosas ----
  const PARTES = {
    hielo: { nombre: 'cubitos de hielo', fase: true, comp: false },
    sal: { nombre: 'sal disuelta', fase: false, comp: true },
    azucar: { nombre: 'azúcar disuelto', fase: false, comp: true },
    aceite: { nombre: 'una capa de aceite', fase: true, comp: true },
    arena: { nombre: 'arena en el fondo', fase: true, comp: true },
  };
  const SISTEMAS = [];
  for (const hielo of [0, 1]) for (const dis of [null, 'sal', 'azucar']) for (const aceite of [0, 1]) for (const arena of [0, 1]) {
    const ps = [hielo && 'hielo', dis, aceite && 'aceite', arena && 'arena'].filter(Boolean);
    if ((hielo || dis) && ps.length >= 2) SISTEMAS.push(ps);
  }
  const fc = (F, C) => `${F} ${F === 1 ? 'fase' : 'fases'} y ${C} ${C === 1 ? 'componente' : 'componentes'}`;
  function contarSistema(ps) {
    const F = 1 + ps.filter(p => PARTES[p].fase).length, C = 1 + ps.filter(p => PARTES[p].comp).length;
    return { F, C };
  }
  function tFases(rng) {
    const ps = rng.elegir(SISTEMAS), { F, C } = contarSistema(ps);
    const dis = ps.some(p => p === 'sal' || p === 'azucar'), hielo = ps.includes('hielo');
    const cand = [];
    if (dis) cand.push([F + 1, C, 'QM-FASE-DISUELTO', `Los componentes están bien. Pero lo disuelto no forma otra fase, porque se reparte entre el agua y no hace una zona con borde. Así contaste ${F + 1} fases.`]);
    if (hielo) cand.push([F, C + 1, 'MA9', `Las fases están bien. Pero el hielo es agua sólida, H₂O: forma otra fase porque tiene borde, pero es el mismo componente. Así contaste ${C + 1} componentes.`]);
    cand.push([F, C - 1, 'QM-SIN-AGUA', `Las fases están bien. Pero el agua también es una sustancia del sistema, aunque sea la que lo contiene todo: es un componente más. Así contaste ${C - 1}.`]);
    if (dis && hielo) cand.push([F + 1, C + 1, 'QM-FASE-DISUELTO', 'La idea de contar zonas y sustancias está bien. Pero lo disuelto no forma zona aparte, así que no es otra fase, y el hielo es agua, así que no es otro componente.']);
    cand.push([C, F, 'QM-INVIERTE', 'Los dos números están bien, pero al revés. Las fases son las zonas con borde que se ven; los componentes son las sustancias distintas, aunque estén disueltas.']);
    cand.push([F, F, 'QM-COMP-FASES', `Las fases están bien. Pero los componentes son las sustancias, no las zonas: en una misma zona puede haber varias sustancias. No son ${F}.`]);
    cand.push([C, C, 'QM-COMP-FASES', `Los componentes están bien. Pero las fases son las zonas con borde, no las sustancias: lo disuelto comparte zona con el agua. No son ${C}.`]);
    const errores = cand.filter(([f, c]) => f !== F || c !== C).map(([f, c, id, ex]) => ({ clave: `fc:${f}|${c}`, texto: fc(f, c), ...err(id, ex) }));
    const fases = ['el agua líquida', ...ps.filter(p => PARTES[p].fase).map(p => ({ hielo: 'el hielo', aceite: 'el aceite', arena: 'la arena' })[p])];
    const comps = ['agua', ...ps.filter(p => PARTES[p].comp).map(p => ({ sal: 'sal', azucar: 'azúcar', aceite: 'aceite', arena: 'arena' })[p])];
    const datos = [DEF_FASE, DEF_COMP];
    if (hielo) datos.push('Hielo: agua en estado sólido, H₂O');
    return {
      variables: {}, enunciado: [`Un vaso tiene agua, ${lista(ps.map(p => PARTES[p].nombre))}.`],
      pregunta: ['¿Cuántas fases y cuántos componentes tiene el sistema?'], datos,
      alternativas: P.armarTexto({ correcta: { clave: `fc:${F}|${C}`, texto: fc(F, C) }, errores, rng }),
      respuesta: { valor: `fc:${F}|${C}`, texto: fc(F, C), unidad: '' },
      solucion: [
        [`Las fases son las zonas con borde: ${lista(fases)}${dis ? ', con lo disuelto dentro del agua' : ''}. Son ${F}.`],
        [`Los componentes son las sustancias: ${lista(comps)}. Son ${C}.`],
        [dis && hielo ? 'Lo disuelto no forma otra fase, y el hielo es agua: forma otra fase, pero es el mismo componente.'
          : dis ? 'Lo disuelto no forma otra fase, porque queda repartido dentro del agua.' : 'El hielo es agua, así que forma otra fase pero es el mismo componente.'],
      ],
      _datos: { tipo: 'fases', nivel: 3, partes: ps },
    };
  }

  // ---- Tipo contar: cinco materiales en una lista ----
  // clase y, para los errores: mol (elemento de moléculas de varios átomos, como O₂), homo (mezcla que se ve pareja).
  const LISTA = {
    aire: { corto: 'el aire seco', dato: 'Aire seco: N₂, O₂ y otros gases', clase: 'homogenea' },
    destilada: { corto: 'el agua destilada', dato: 'Agua destilada: solo H₂O', clase: 'compuesto' },
    ozono: { corto: 'el ozono (O₃)', dato: 'Ozono: moléculas O₃', clase: 'elemento', mol: true },
    bronce: { corto: 'el bronce', dato: 'Bronce: cobre y estaño fundidos juntos', clase: 'homogenea' },
    sal: { corto: 'la sal de mesa (NaCl)', dato: 'Sal de mesa: NaCl', clase: 'compuesto' },
    diamante: { corto: 'el diamante', dato: 'Diamante: solo átomos de carbono', clase: 'elemento' },
    mar: { corto: 'el agua de mar', dato: 'Agua de mar: agua con sales disueltas', clase: 'homogenea' },
    granito: { corto: 'el granito', dato: 'Granito: granos de cuarzo, feldespato y mica', clase: 'heterogenea' },
    oxigeno: { corto: 'el oxígeno (O₂)', dato: 'Oxígeno: moléculas O₂', clase: 'elemento', mol: true },
    azucar: { corto: 'el azúcar', dato: 'Azúcar: moléculas C₁₂H₂₂O₁₁', clase: 'compuesto' },
    acero: { corto: 'el acero', dato: 'Acero: hierro con un poco de carbono, fundidos juntos', clase: 'homogenea' },
    cobre: { corto: 'un alambre de cobre', dato: 'Alambre de cobre: solo átomos de cobre', clase: 'elemento' },
    hieloSeco: { corto: 'el hielo seco (CO₂)', dato: 'Hielo seco: moléculas CO₂', clase: 'compuesto' },
    nitrogeno: { corto: 'el nitrógeno (N₂)', dato: 'Nitrógeno: moléculas N₂', clase: 'elemento', mol: true },
    arenaAgua: { corto: 'el agua con arena', dato: 'Agua con arena: la arena se asienta en el fondo', clase: 'heterogenea' },
  };
  const PIDE = {
    mezclas: { texto: 'mezclas', es: x => !pura(x.clase) },
    compuestos: { texto: 'compuestos', es: x => x.clase === 'compuesto' },
    elementos: { texto: 'elementos', es: x => x.clase === 'elemento' },
  };
  function tContar(rng) {
    const pide = rng.elegir(Object.keys(PIDE)), ids = rng.barajar(Object.keys(LISTA)).slice(0, 5);
    const xs = ids.map(k => LISTA[k]), n = xs.filter(PIDE[pide].es).length;
    if (n === 0) return null;
    const homo = xs.filter(x => x.clase === 'homogenea').length, comp = xs.filter(x => x.clase === 'compuesto').length;
    const mol = xs.filter(x => x.mol).length;
    const e = [];
    if (pide === 'mezclas') {
      e.push(h(n - homo, 'MA10', `Las mezclas que se ven por partes están bien. Pero lo que se ve parejo también puede ser mezcla, como el aire o el bronce: así contaste ${n - homo}.`));
      e.push(h(n + comp, 'MA9', `Las mezclas están bien. Pero un compuesto une átomos distintos dentro de una sola clase de partícula, así que es sustancia pura y no mezcla. Así contaste ${n + comp}.`));
    } else if (pide === 'compuestos') {
      e.push(h(n + mol, 'MA9', `Los compuestos están bien. Pero O₂, O₃ o N₂ tienen una sola clase de átomo, aunque junten varios: son elementos. Así contaste ${n + mol}.`));
      e.push(h(n + homo, 'MA10', `Los compuestos están bien. Pero una mezcla pareja, como el aire, tiene varias clases de partícula: no es sustancia pura ni compuesto. Así contaste ${n + homo}.`));
    } else {
      e.push(h(n - mol, 'MA9', `Los elementos de átomos sueltos están bien. Pero O₂, O₃ o N₂ también son elementos: tienen varios átomos, todos del mismo tipo. Así contaste ${n - mol}.`));
      e.push(h(n + xs.filter(x => x.clase === 'homogenea' && /cobre|hierro/.test(x.dato)).length, 'MA10', 'Los elementos están bien. Pero una aleación junta dos metales distintos, como cobre y estaño, así que tiene dos clases de partícula: es mezcla, no elemento.'));
    }
    e.push(h(n + 1, 'QM-CONTEO', `El criterio está bien, pero sobra uno: revisa cada material con su dato y cuenta sus clases de partícula. Así son ${n + 1}.`));
    e.push(h(n - 1, 'QM-CONTEO', `El criterio está bien, pero falta uno: revisa cada material con su dato y cuenta sus clases de partícula. Así son ${n - 1}.`));
    e.push(h(n + 2, 'QM-CONTEO', `El criterio está bien, pero sobran dos: revisa cada material con su dato y cuenta sus clases de partícula. Así son ${n + 2}.`));
    const errores = e.filter(x => x.valor !== n && x.valor > 0 && x.valor <= 5);
    const alternativas = P.armar({ correcta: n, errores, rng, texto: x => String(x) });
    const cuales = xs.filter(PIDE[pide].es).map(x => x.corto);
    const defs = pide === 'mezclas' ? [DEF_SM] : [DEF_SM, DEF_EC];
    return {
      variables: {}, enunciado: [`Mira esta lista: ${lista(xs.map(x => x.corto))}.`],
      pregunta: [`¿Cuántos de estos materiales son ${PIDE[pide].texto}?`],
      datos: [...xs.map(x => x.dato), ...defs], alternativas,
      respuesta: { valor: n, unidad: '' },
      solucion: [
        [pide === 'mezclas' ? 'Es mezcla lo que tiene varias clases de partícula, se vea parejo o no.' : pide === 'compuestos' ? 'Es compuesto lo que tiene una sola clase de partícula, con átomos distintos unidos.' : 'Es elemento lo que tiene átomos de una sola clase, sueltos o en moléculas como O₂.'],
        [n === 1 ? `Solo lo cumple ${lista(cuales)}.` : `Lo cumplen ${lista(cuales)}.`],
        [n === 1 ? 'En total es 1.' : `En total son ${n}.`],
      ],
      _datos: { tipo: 'contar', nivel: 3, pide, lista: ids },
    };
  }
  function h(valor, id, explicacion) { return { valor, ...err(id, explicacion) }; }

  const TIPOS = ['lupa', 'lupa', 'lupa', 'material', 'material', 'material', 'formada', 'formada', 'fases', 'fases', 'fases', 'contar', 'contar'];
  const NIVEL = { lupa: 1, material: 2, formada: 3, fases: 3, contar: 3 };
  const CONSTRUIR = { lupa: tLupa, material: tMaterial, formada: tFormada, fases: tFases, contar: tContar };
  // Papel (regla 6): herramientas/papel-generador.js usa «papel-1», «papel-2», …; la lupa lleva figura y no va.
  const PAPEL = { 'papel-1': 'material', 'papel-2': 'material', 'papel-3': 'material', 'papel-4': 'formada', 'papel-5': 'fases',
    'papel-6': 'formada', 'papel-7': 'fases', 'papel-8': 'contar' };

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

  return { id: ID, titulo: '¿Sustancia pura o mezcla?', generar, NIVEL, LUPAS, MATERIALES, MEZCLAS, PARTES, LISTA, ESP, clasificar };
});
