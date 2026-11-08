/*
 * Generador: «¿Qué clase de reacción es?» (clasificación de reacciones químicas y redox).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['clasificar-reacciones']) y en Node (require). No usa ningún motor.
 *
 * BANCO: 60 ecuaciones propias, ya balanceadas, con estado de cada sustancia — (s), (l), (g), (ac) — y,
 * cuando se conoce, ΔH en kJ para la ecuación tal como está escrita (valores redondeados de tablas de
 * entalpías de formación; solo importa el signo y el valor dado). «<=>» es doble flecha (reversible); «->»,
 * flecha simple (irreversible). «•OH» es el radical hidroxilo (neutro). Masas molares de academia: H 1, C 12,
 * N 14, O 16, Na 23, Mg 24, Al 27, P 31, S 32, Cl 35,5, K 39, Ca 40, Mn 55, Fe 56, Cu 63,5, Zn 65, Br 80,
 * Ag 108, I 127, Ba 137, Hg 200,6, Pb 207.
 *
 * NÚMEROS DE OXIDACIÓN (por especie; si un elemento aparece varias veces en una fórmula, se da el promedio,
 * como el C de C₃H₈ = −8/3; en pantalla los C de orgánicos con varios C llevan «(promedio)»), reglas
 * escolares en este orden:
 *   1. Una sola clase de átomo: carga ÷ número de átomos (elemento libre 0; ion monoatómico, su carga).
 *   2. Excepciones: H₂O₂, Na₂O₂ y BaO₂ (peróxidos) tienen O −1; el radical •OH tiene O −1 y H +1;
 *      en un hidruro metálico (solo metal e H) el H es −1.
 *   3. Valores fijos: F −1; Li, Na, K, Ag +1; Mg, Ca, Ba, Zn +2; Al +3; H +1; O −2; Cl, Br, I −1 solo si la
 *      especie no tiene O.
 *   4. Si quedan dos elementos sin valor y uno es S con O = 4·S, N con O = 3·N, C con O = 3·C o P con O = 4·P
 *      (sulfato, nitrato, carbonato, fosfato), ese no metal toma +6, +5, +4 o +5.
 *   5. El último elemento sin valor se despeja: Σ (átomos × número de oxidación) = carga de la especie.
 *
 * CLASES (cada clase vale «sí», «no» o «ambigua» para una ecuación; las ambiguas nunca salen como opción
 * incorrecta ni como afirmación de V/F):
 *   redox          para cada elemento se cuentan los átomos (coeficiente × subíndice) que tiene con cada número
 *                  de oxidación, a la izquierda y a la derecha; se quitan los que coinciden. Si sobra algo, el
 *                  elemento cambió: lo que sobra a la izquierda (L) pasó a lo que sobra a la derecha (D). El
 *                  elemento se oxida si en D hay un valor mayor que uno de L; se reduce si hay uno menor. Es redox
 *                  si alguno se oxida y alguno se reduce. (Así el C de CH₃COOH y de NaHCO₃ no «cambia» en
 *                  CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O: 0 y +4 a cada lado.)
 *                  Sustancia que se oxida = agente reductor = reactivo con ese elemento en un valor de L y algún
 *                  valor mayor en D; sustancia que se reduce = agente oxidante = ídem con un valor menor. Forma
 *                  oxidada (reducida) = producto con ese elemento en un valor de D mayor (menor) que alguno de L.
 *   dismutación    redox en que, para un elemento, L tiene un solo valor y D tiene uno mayor y otro menor (un
 *                  mismo elemento se oxida y se reduce).
 *   adición        2 o más reactivos y 1 producto (sustancias distintas, sin contar coeficientes).
 *   descomposición 1 reactivo y 2 o más productos. Con 1 reactivo y 1 producto (2NO₂ ⇌ N₂O₄), las dos son
 *                  ambiguas.
 *   desplazamiento simple  2 reactivos y 2 productos; un elemento libre a cada lado (distintos) y un compuesto
 *                  a cada lado.
 *   doble desplazamiento   2 reactivos y 2 o más productos, todos compuestos neutros, y no redox.
 *   combustión     sí: O₂ entre 2 reactivos, el otro tiene C, y los productos son solo CO₂, CO y H₂O.
 *                  ambigua: O₂ entre los reactivos en cualquier otro caso (H₂, Mg, Fe, SO₂ que «arden»).
 *   neutralización (solo con 2 o más reactivos) sí: un ácido (fórmula que empieza con H, salvo H₂, H₂O y
 *                  H₂O₂; o que termina en COOH) o una sal ácida (metal seguido de H, como NaHCO₃) reacciona con un hidróxido (metal + OH), sale
 *                  H₂O y no es redox. ambigua: no es redox y el ácido reacciona con NH₃ o con OTRA sustancia
 *                  que es carbonato o bicarbonato (metal con C y O = 3·C), o con un hidróxido sin
 *                  que salga H₂O. no: lo demás.
 *   precipitación  sí: 2 o más reactivos, todos (ac), y sale algún (s). ambigua: sale un (s) de algún (ac) en
 *                  otro caso. no: lo demás.
 *   exotérmica / endotérmica  ΔH < 0 / ΔH > 0; sin ΔH en el banco, las dos son ambiguas. En pantalla el calor
 *                  sale como «ΔH = …» o como término «+ Q kJ»: del lado de los productos si se libera
 *                  (exotérmica), del lado de los reactivos si se absorbe (endotérmica).
 *   reversible     doble flecha. Ambigua, marcada a mano en el banco, en las que con → solo van en un sentido
 *                  porque un gas se escapa (horno de cal, bicarbonato al hornear, sarro, caliza disuelta) y en
 *                  NH₃ + HCl → NH₄Cl. También se deja ambigua a mano la neutralización de Ca(HCO₃)₂ + Ca(OH)₂.
 *   comproporción  (2H₂S + SO₂ → 3S + 2H₂O): el mismo elemento parte de dos valores y llega a uno; es redox,
 *                  pero no dismutación.
 *
 * TIPOS de problema (_datos.tipo) y clave de la respuesta (respuesta.valor):
 *   tipo          una ecuación; ¿de qué clase es? (entre adición, descomposición, desplazamiento simple,
 *                 doble desplazamiento, combustión, neutralización y precipitación). Clave 'tipo:<clase>'.
 *   relacionar    cuatro ecuaciones I–IV y cuatro clases a–d; cada ecuación es «sí» en su clase y «no» en las
 *                 otras tres. Clave 'rel:' + letras en el orden I, II, III, IV (p. ej. 'rel:bdac').
 *   redoxSet      cuatro ecuaciones; ¿cuáles son redox? Clave 'set:' + números romanos separados por comas
 *                 ('set:' solo si ninguna).
 *   rol           una redox sin dismutación (opciones con su estado, sin el radical •OH); sub = agenteOxidante | agenteReductor | seOxida | seReduce |
 *                 formaOxidada | formaReducida. Clave 'esp:<fórmula>' (fórmula como en el banco).
 *   dismutacion   una dismutación; ¿qué pasa con el número de oxidación? Clave 'dis:<elemento>'.
 *   calor         una ecuación con ΔH; se dan n mol (en gramos, m = n·M) de una sustancia; ¿cuánto calor y en
 *                 qué sentido? Q = |ΔH| · n ÷ coeficiente de esa sustancia. Clave 'q:libera:<Q>' o
 *                 'q:absorbe:<Q>'.
 *   tipoEnergia   una ecuación con ΔH; clase (entre las de «tipo») y energía. Clave 'te:<clase>:exo|endo'.
 *   aLaVez        dos propiedades X e Y y cuatro o cinco ecuaciones; solo una es «sí» en las dos. Clave
 *                 'una:<id de la reacción>'.
 *   vf            tres afirmaciones sobre una ecuación; clave 'vf:' + V/F en orden (p. ej. 'vf:VVF').
 *   aguaDura      sub = sarro: al hervir agua dura sin agregar nada queda una costra; ¿qué ecuación la explica?
 *                 Clave 'agua:sarro' (Ca(HCO₃)₂ → CaCO₃ + CO₂ + H₂O). sub = bicarbonato: lluvia con CO₂ sobre
 *                 caliza; clave 'agua:caliza-disuelta' (CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂). El sentido lo decide
 *                 el CO₂ (si sobra, disuelve; si se escapa al hervir, precipita).
 *
 * Convenciones: coma decimal en pantalla; los gramos con hasta 1 decimal; Q con hasta 1 decimal.
 * Errores: EC9 (docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md) y códigos QA-…
 * (química admisión, hipótesis; mapa de trampas en docs/clasificacion/trampas-admision-unmsm/quimica.md).
 * Fin de la cabecera: con estas reglas y _datos (trae las ecuaciones y ΔH) se recalcula cada respuesta.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const FUENTE_EC = 'docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md';
  const FUENTE_QA = 'docs/clasificacion/trampas-admision-unmsm/quimica.md';
  const v = P.v;

  const MASAS = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Mn: 55,
    Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Hg: 200.6, Pb: 207 };
  const METALES = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Ba', 'Al', 'Zn', 'Fe', 'Cu', 'Ag', 'Pb', 'Hg', 'Mn'];

  // ---------- Banco: [id, ecuación, ΔH en kJ o null, contexto, extra] ----------
  // extra.ambiguas: clases que se dejan ambiguas a mano; extra.agua: papel en el agua dura.
  const B = (id, ec, dH, contexto, extra = {}) => ({ id, ec, dH, contexto, ambiguas: extra.ambiguas || [], agua: extra.agua || null });
  const BANCO = [
    // Combustiones
    B('metano', 'CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)', -890, 'En la hornilla de una cocina a gas natural'),
    B('propano', 'C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)', -2220, 'En un balón de gas de cocina'),
    B('glucosa', 'C6H12O6(s) + 6O2(g) -> 6CO2(g) + 6H2O(l)', -2800, 'En la respiración de las células'),
    B('etanol', 'C2H5OH(l) + 3O2(g) -> 2CO2(g) + 3H2O(l)', -1370, 'En un mechero de alcohol'),
    B('monoxido', '2CO(g) + O2(g) -> 2CO2(g)', -566, 'En el convertidor catalítico de un auto'),
    B('carbon', 'C(s) + O2(g) -> CO2(g)', -394, 'En una parrilla con carbón'),
    B('metano-incompleta', '2CH4(g) + 3O2(g) -> 2CO(g) + 4H2O(l)', -1214, 'En una estufa con poca ventilación'),
    // Adición
    B('agua', '2H2(g) + O2(g) -> 2H2O(l)', -572, 'En el motor de un cohete'),
    B('amoniaco', 'N2(g) + 3H2(g) <=> 2NH3(g)', -92, 'En una planta de fertilizantes'),
    B('trioxido', '2SO2(g) + O2(g) <=> 2SO3(g)', -198, 'En una fábrica de ácido sulfúrico'),
    B('cal-apagada', 'CaO(s) + H2O(l) -> Ca(OH)2(s)', -65, 'Al apagar cal viva en una obra'),
    B('acido-sulfurico', 'SO3(g) + H2O(l) -> H2SO4(ac)', null, 'En la lluvia ácida'),
    B('acido-carbonico', 'CO2(g) + H2O(l) <=> H2CO3(ac)', null, 'En una botella de agua con gas', { agua: 'gas' }),
    B('magnesio', '2Mg(s) + O2(g) -> 2MgO(s)', -1202, 'Al encender una cinta de magnesio'),
    B('herrumbre', '4Fe(s) + 3O2(g) -> 2Fe2O3(s)', -1648, 'En una reja que se oxida'),
    B('cloruro-hidrogeno', 'H2(g) + Cl2(g) -> 2HCl(g)', -185, 'En un reactor de síntesis'),
    B('metanol', 'CO(g) + 2H2(g) <=> CH3OH(g)', -91, 'En una planta de metanol'),
    B('dimero', '2NO2(g) <=> N2O4(g)', -57, 'En una ampolla cerrada con gas pardo'),
    B('sal', '2Na(s) + Cl2(g) -> 2NaCl(s)', -822, 'En una demostración de laboratorio'),
    B('cloruro-amonio', 'NH3(g) + HCl(g) -> NH4Cl(s)', -176, 'Cuando se acercan dos frascos abiertos, de amoniaco y de ácido clorhídrico', { ambiguas: ['reversible'] }),
    B('caliza-disuelta', 'CaCO3(s) + CO2(g) + H2O(l) -> Ca(HCO3)2(ac)', null, 'En una cueva de roca caliza', { ambiguas: ['reversible'], agua: 'disuelve' }),
    // Descomposición
    B('caliza', 'CaCO3(s) -> CaO(s) + CO2(g)', 178, 'En un horno de cal', { ambiguas: ['reversible'] }),
    B('oxido-mercurio', '2HgO(s) -> 2Hg(l) + O2(g)', 182, 'Al calentar un polvo rojo en un tubo'),
    B('electrolisis', '2H2O(l) -> 2H2(g) + O2(g)', 572, 'En una celda de electrólisis'),
    B('clorato', '2KClO3(s) -> 2KCl(s) + 3O2(g)', -78, 'Al calentar clorato de potasio'),
    B('peroxido', '2H2O2(l) -> 2H2O(l) + O2(g)', -196, 'En un frasco de agua oxigenada'),
    B('bicarbonato', '2NaHCO3(s) -> Na2CO3(s) + H2O(g) + CO2(g)', 136, 'Al hornear un queque', { ambiguas: ['reversible'] }),
    B('sarro', 'Ca(HCO3)2(ac) -> CaCO3(s) + CO2(g) + H2O(l)', null, 'Dentro de una tetera con agua dura', { ambiguas: ['reversible'], agua: 'sarro' }),
    B('pentacloruro', 'PCl5(g) <=> PCl3(g) + Cl2(g)', 88, 'En un recipiente cerrado y caliente'),
    B('perclorato', '4KClO3(s) -> 3KClO4(s) + KCl(s)', -144, 'Al calentar con cuidado clorato de potasio'),
    B('nitroso', '3HNO2(ac) -> HNO3(ac) + 2NO(g) + H2O(l)', null, 'En una disolución de ácido nitroso'),
    B('fermentacion', 'C6H12O6(s) -> 2C2H5OH(l) + 2CO2(g)', -69, 'En la fermentación de la chicha'),
    // Desplazamiento simple
    B('zinc-cobre', 'Zn(s) + CuSO4(ac) -> ZnSO4(ac) + Cu(s)', -218, 'Al sumergir una lámina de zinc'),
    B('hierro-cobre', 'Fe(s) + CuSO4(ac) -> FeSO4(ac) + Cu(s)', -154, 'Al dejar un clavo en sulfato de cobre'),
    B('zinc-acido', 'Zn(s) + 2HCl(ac) -> ZnCl2(ac) + H2(g)', -153, 'Al echar granallas de zinc en ácido'),
    B('cobre-plata', 'Cu(s) + 2AgNO3(ac) -> Cu(NO3)2(ac) + 2Ag(s)', null, 'Al colgar un alambre de cobre en nitrato de plata'),
    B('cloro-bromuro', 'Cl2(g) + 2NaBr(ac) -> 2NaCl(ac) + Br2(l)', null, 'Al burbujear cloro en agua con bromuro'),
    B('sodio-agua', '2Na(s) + 2H2O(l) -> 2NaOH(ac) + H2(g)', -368, 'Al echar un trocito de sodio al agua'),
    B('termita', '2Al(s) + Fe2O3(s) -> Al2O3(s) + 2Fe(s)', -852, 'Al soldar rieles con termita'),
    B('oxido-cobre', 'CuO(s) + H2(g) -> Cu(s) + H2O(l)', -129, 'Al pasar hidrógeno sobre óxido de cobre caliente'),
    // Doble desplazamiento y precipitación
    B('plata-cloruro', 'AgNO3(ac) + NaCl(ac) -> AgCl(s) + NaNO3(ac)', -65, 'Al mezclar dos disoluciones incoloras'),
    B('lluvia-oro', 'Pb(NO3)2(ac) + 2KI(ac) -> PbI2(s) + 2KNO3(ac)', null, 'Al mezclar dos disoluciones en un tubo'),
    B('ablandar', 'CaCl2(ac) + Na2CO3(ac) -> CaCO3(s) + 2NaCl(ac)', null, 'Al ablandar agua dura con soda', { agua: 'ablanda' }),
    B('hierro-hidroxido', 'FeCl3(ac) + 3NaOH(ac) -> Fe(OH)3(s) + 3NaCl(ac)', null, 'Al agregar soda cáustica a una sal de hierro'),
    // Neutralización (ácido-base)
    B('neutra-hcl', 'HCl(ac) + NaOH(ac) -> NaCl(ac) + H2O(l)', -57, 'En una titulación'),
    B('neutra-sulfurico', 'H2SO4(ac) + 2KOH(ac) -> K2SO4(ac) + 2H2O(l)', -114, 'Al neutralizar un derrame de ácido'),
    B('sal-acida-carbonato', 'NaHCO3(ac) + NaOH(ac) -> Na2CO3(ac) + H2O(l)', null, 'Al agregar soda cáustica a agua con bicarbonato'),
    B('sal-acida-sulfato', 'NaHSO4(ac) + NaOH(ac) -> Na2SO4(ac) + H2O(l)', null, 'Al neutralizar un limpiador de baños'),
    B('cal-dureza', 'Ca(HCO3)2(ac) + Ca(OH)2(ac) -> 2CaCO3(s) + 2H2O(l)', null, 'Al tratar agua dura con cal', { ambiguas: ['neutralizacion'], agua: 'ablanda' }),
    B('bario-neutra', 'H2SO4(ac) + Ba(OH)2(ac) -> BaSO4(s) + 2H2O(l)', null, 'Al mezclar un ácido con agua de barita'),
    // Ácido con carbonato o bicarbonato
    B('caliza-acido', 'CaCO3(s) + 2HCl(ac) -> CaCl2(ac) + CO2(g) + H2O(l)', null, 'Al echar ácido sobre una piedra caliza'),
    B('bicarbonato-acido', 'NaHCO3(ac) + HCl(ac) -> NaCl(ac) + CO2(g) + H2O(l)', null, 'En el estómago, con un antiácido'),
    B('vinagre', 'CH3COOH(ac) + NaHCO3(s) -> CH3COONa(ac) + CO2(g) + H2O(l)', null, 'En un volcán de vinagre y bicarbonato'),
    // Otras redox
    B('fenton', 'Fe^2+(ac) + H2O2(ac) -> Fe^3+(ac) + OH^-(ac) + •OH(ac)', null, 'En una célula, con hierro y agua oxigenada'),
    B('dioxido-nitrogeno', '3NO2(g) + H2O(l) -> 2HNO3(ac) + NO(g)', null, 'En el aire contaminado de una ciudad'),
    B('lejia', 'Cl2(g) + 2NaOH(ac) -> NaCl(ac) + NaClO(ac) + H2O(l)', null, 'En una fábrica de lejía'),
    B('azufre', '2H2S(g) + SO2(g) -> 3S(s) + 2H2O(l)', null, 'Cerca de un volcán'),
    B('fotosintesis', '6CO2(g) + 6H2O(l) -> C6H12O6(ac) + 6O2(g)', 2800, 'En las hojas de una planta'),
    B('cobre-nitrico', 'Cu(s) + 4HNO3(ac) -> Cu(NO3)2(ac) + 2NO2(g) + 2H2O(l)', null, 'Al echar ácido nítrico sobre cobre'),
    B('cloro-lab', 'MnO2(s) + 4HCl(ac) -> MnCl2(ac) + Cl2(g) + 2H2O(l)', null, 'Al preparar cloro en el laboratorio'),
  ];

  // ---------- Fórmulas ----------
  function atomos(formula) {
    const f = formula.replace(/^•/, '');
    let i = 0;
    const grupo = () => {
      const r = {};
      while (i < f.length && f[i] !== ')') {
        let sub;
        if (f[i] === '(') { i++; sub = grupo(); if (f[i] !== ')') throw new Error(`falta ")" en ${formula}`); i++; }
        else {
          const e = f.slice(i).match(/^[A-Z][a-z]?/);
          if (!e || !(e[0] in MASAS)) throw new Error(`no entiendo ${formula}`);
          i += e[0].length; sub = { [e[0]]: 1 };
        }
        const d = f.slice(i).match(/^\d+/); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
        for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
      }
      return r;
    };
    const g = grupo();
    if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
    return g;
  }
  // "2Fe^3+(ac)" → { coef: 2, f: 'Fe^3+', base: 'Fe', carga: 3, estado: 'ac', atomos, radical }
  function termino(texto) {
    const m = texto.trim().match(/^(\d+)?(•?[A-Z(][A-Za-z0-9()]*?)(?:\^(\d*)([+-]))?(?:\((s|l|g|ac)\))?$/);
    if (!m) throw new Error(`no entiendo el término ${texto}`);
    const carga = m[4] ? (m[4] === '+' ? 1 : -1) * (m[3] ? Number(m[3]) : 1) : 0;
    const base = m[2];
    return { coef: m[1] ? Number(m[1]) : 1, f: base + (m[4] ? '^' + (m[3] || '') + m[4] : ''), base, carga,
      estado: m[5] || null, atomos: atomos(base), radical: base.startsWith('•') };
  }
  function ecuacion(texto) {
    const rev = texto.includes('<=>');
    const [izq, der] = texto.split(/\s*(?:<=>|->)\s*/);
    const lado = s => s.split(/\s+\+\s+/).map(termino);
    return { reactivos: lado(izq), productos: lado(der), reversible: rev };
  }
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻' };
  function bonita(f) {
    const [base, carga] = f.split('^');
    const b = base.replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + [...d].map(x => SUB[x]).join(''));
    return b + (carga ? [...carga].map(x => SUP[x]).join('') : '');
  }
  const terminoTexto = (t, estados = true) => (t.coef > 1 ? t.coef : '') + bonita(t.f) + (estados && t.estado ? `(${t.estado})` : '');
  // Texto de la ecuación. calor: null (sin calor), 'dH' (ΔH al final) o 'termino' (+ Q kJ en un lado).
  function textoEcuacion(r, calor = null) {
    const ec = ecuacion(r.ec);
    const izq = ec.reactivos.map(t => terminoTexto(t)), der = ec.productos.map(t => terminoTexto(t));
    if (calor === 'termino') { const q = `${P.formatear(Math.abs(r.dH), 1)} kJ`; if (r.dH < 0) der.push(q); else izq.unshift(q); }
    let s = `${izq.join(' + ')} ${ec.reversible ? '⇌' : '→'} ${der.join(' + ')}`;
    if (calor === 'dH') s += `   ΔH = ${dHTexto(r.dH)}`;
    return s;
  }
  const dHTexto = x => `${x > 0 ? '+' : ''}${P.formatear(x, 1)} kJ`;
  const masaMolar = f => Object.entries(atomos(f.split('^')[0])).reduce((s, [e, n]) => s + MASAS[e] * n, 0);

  // ---------- Números de oxidación (reglas 1 a 5 de la cabecera) ----------
  const PEROXIDOS = ['H2O2', 'Na2O2', 'BaO2'];
  const FIJO = { F: -1, Li: 1, Na: 1, K: 1, Ag: 1, Mg: 2, Ca: 2, Ba: 2, Zn: 2, Al: 3, H: 1, O: -2 };
  const OXOANION = { S: [4, 6], N: [3, 5], C: [3, 4], P: [4, 5] };
  // Devuelve { elemento: { n, d } } (fracción reducida).
  function oxidacion(fTexto) {
    const t = typeof fTexto === 'string' ? termino(fTexto) : fTexto;
    const at = t.atomos, els = Object.keys(at), q = t.carga;
    if (els.length === 1) return { [els[0]]: P.frac(q, at[els[0]]) };
    const val = {};
    const base = t.base.replace(/^•/, '');
    if (PEROXIDOS.includes(base)) val.O = -1;
    if (t.radical && base === 'OH') { val.O = -1; val.H = 1; }
    const hidruro = els.length === 2 && at.H && els.some(e => METALES.includes(e));
    if (hidruro) val.H = -1;
    for (const e of els) {
      if (e in val) continue;
      if (e in FIJO) val[e] = FIJO[e];
      else if (['Cl', 'Br', 'I'].includes(e) && !at.O) val[e] = -1;
    }
    let libres = els.filter(e => !(e in val));
    if (libres.length === 2) {
      const nm = libres.find(e => OXOANION[e] && at.O === OXOANION[e][0] * at[e]);
      if (nm) val[nm] = OXOANION[nm][1];
      libres = els.filter(e => !(e in val));
    }
    if (libres.length === 0) { // todo fijo: se comprueba que la suma dé la carga
      if (els.reduce((s, e) => s + at[e] * val[e], 0) !== q) throw new Error(`los valores fijos no suman la carga en ${t.f}`);
      const r = {}; for (const e of els) r[e] = P.frac(val[e]); return r;
    }
    if (libres.length !== 1) throw new Error(`no puedo despejar el número de oxidación en ${t.f}`);
    const u = libres[0];
    const suma = els.filter(e => e !== u).reduce((s, e) => s + at[e] * val[e], 0);
    const r = {};
    for (const e of els) r[e] = e === u ? P.frac(q - suma, at[u]) : P.frac(val[e]);
    return r;
  }
  const num = f => f.n / f.d;
  const eoTexto = f => (f.n > 0 ? '+' : '') + P.textoFraccion(f);

  // ---------- Análisis de una reacción ----------
  const esElemento = t => t.carga === 0 && Object.keys(t.atomos).length === 1;
  const esCompuesto = t => t.carga === 0 && !t.radical && Object.keys(t.atomos).length > 1;
  const esHidroxido = t => new RegExp(`^(${METALES.join('|')})(\\(OH\\)\\d*|OH)$`).test(t.base);
  const esAcido = t => t.carga === 0 && !['H2', 'H2O', 'H2O2'].includes(t.base) && Object.keys(t.atomos).length > 1 && (/^H[A-Z0-9]/.test(t.base) || /COOH$/.test(t.base));
  const esSalAcida = t => new RegExp(`^(${METALES.join('|')})\\(?H[A-Z]`).test(t.base);
  const esCarbonato = t => t.carga === 0 && t.atomos.C && t.atomos.O === 3 * t.atomos.C && Object.keys(t.atomos).some(e => METALES.includes(e));

  const cache = new Map();
  function analizar(r) {
    if (cache.has(r.id)) return cache.get(r.id);
    const ec = ecuacion(r.ec), R = ec.reactivos, Pr = ec.productos;
    const eo = new Map([...R, ...Pr].map(t => [t.f, oxidacion(t)]));
    const els = [...new Set([...R, ...Pr].flatMap(t => Object.keys(t.atomos)))];
    // Para cada elemento: cuántos átomos (coeficiente × subíndice) hay con cada número de oxidación a cada
    // lado. Se quitan los que coinciden; lo que sobra a la izquierda (L) pasó a lo que sobra a la derecha (D).
    const conteo = (lista, e) => { const m = new Map(); for (const t of lista) if (t.atomos[e]) { const x = num(eo.get(t.f)[e]); const k = [...m.keys()].find(y => Math.abs(y - x) < 1e-9) ?? x; m.set(k, (m.get(k) || 0) + t.coef * t.atomos[e]); } return m; };
    const estados = {};
    for (const e of els) {
      const iz = conteo(R, e), de = conteo(Pr, e), L = [], D = [];
      for (const [x, n] of iz) { const y = [...de.keys()].find(z => Math.abs(z - x) < 1e-9); const k = y === undefined ? 0 : de.get(y); if (n - k > 1e-9) L.push(x); }
      for (const [x, n] of de) { const y = [...iz.keys()].find(z => Math.abs(z - x) < 1e-9); const k = y === undefined ? 0 : iz.get(y); if (n - k > 1e-9) D.push(x); }
      estados[e] = { izq: [...iz.keys()], der: [...de.keys()], L, D };
    }
    const sube = els.filter(e => estados[e].D.some(x => estados[e].L.some(y => x > y + 1e-9)));
    const baja = els.filter(e => estados[e].D.some(x => estados[e].L.some(y => x < y - 1e-9)));
    const redox = sube.length > 0 && baja.length > 0;
    const dism = els.filter(e => estados[e].L.length === 1 && estados[e].D.some(x => x > estados[e].L[0] + 1e-9) && estados[e].D.some(x => x < estados[e].L[0] - 1e-9));
    const en = (lista, x) => lista.some(y => Math.abs(y - x) < 1e-9);
    const reacQue = (e, arriba) => R.filter(t => { if (!t.atomos[e]) return false; const x = num(eo.get(t.f)[e]); const s = estados[e];
      return en(s.L, x) && s.D.some(w => (arriba ? w > x + 1e-9 : w < x - 1e-9)); }).map(t => t.f);
    const prodQue = (e, arriba) => Pr.filter(p => { if (!p.atomos[e]) return false; const w = num(eo.get(p.f)[e]); const s = estados[e];
      return en(s.D, w) && s.L.some(x => (arriba ? w > x + 1e-9 : w < x - 1e-9)); }).map(t => t.f);
    const uniq = a => [...new Set(a)];
    const roles = redox ? {
      seOxida: uniq(sube.flatMap(e => reacQue(e, true))), seReduce: uniq(baja.flatMap(e => reacQue(e, false))),
      formaOxidada: uniq(sube.flatMap(e => prodQue(e, true))), formaReducida: uniq(baja.flatMap(e => prodQue(e, false))),
    } : { seOxida: [], seReduce: [], formaOxidada: [], formaReducida: [] };
    roles.agenteReductor = roles.seOxida; roles.agenteOxidante = roles.seReduce;

    // Clases por la forma
    const c = {};
    const nR = R.length, nP = Pr.length;
    c.adicion = nR >= 2 && nP === 1 ? 'si' : nR === 1 && nP === 1 ? 'ambigua' : 'no';
    c.descomposicion = nR === 1 && nP >= 2 ? 'si' : nR === 1 && nP === 1 ? 'ambigua' : 'no';
    const elR = R.filter(esElemento), elP = Pr.filter(esElemento);
    c.simple = nR === 2 && nP === 2 && elR.length === 1 && elP.length === 1 && elR[0].base !== elP[0].base
      && R.filter(esCompuesto).length === 1 && Pr.filter(esCompuesto).length === 1 ? 'si' : 'no';
    c.doble = nR === 2 && nP >= 2 && R.every(esCompuesto) && Pr.every(esCompuesto) && !redox ? 'si' : 'no';
    const conO2 = R.some(t => t.base === 'O2');
    const otro = R.find(t => t.base !== 'O2');
    c.combustion = conO2 && nR === 2 && otro.atomos.C && Pr.every(t => ['CO2', 'CO', 'H2O'].includes(t.base)) ? 'si' : conO2 ? 'ambigua' : 'no';
    const acidos = R.filter(t => esAcido(t) || esSalAcida(t)), acido = nR >= 2 && acidos.length > 0;
    const hidrox = R.some(esHidroxido), agua = Pr.some(t => t.base === 'H2O');
    const otraBase = R.some(t => (t.base === 'NH3' || esCarbonato(t)) && acidos.some(x => x !== t));
    c.neutralizacion = acido && hidrox && agua && !redox ? 'si' : acido && (otraBase || hidrox) && !redox ? 'ambigua' : 'no';
    const solido = Pr.some(t => t.estado === 's');
    c.precipitacion = solido && nR >= 2 && R.every(t => t.estado === 'ac') ? 'si' : solido && R.some(t => t.estado === 'ac') ? 'ambigua' : 'no';
    // Otras propiedades
    c.redox = redox ? 'si' : 'no';
    c.dismutacion = dism.length ? 'si' : 'no';
    c.reversible = ec.reversible ? 'si' : 'no';
    c.exotermica = r.dH == null ? 'ambigua' : r.dH < 0 ? 'si' : 'no';
    c.endotermica = r.dH == null ? 'ambigua' : r.dH > 0 ? 'si' : 'no';
    for (const k of r.ambiguas || []) c[k] = 'ambigua';
    const a = { r, ec, eo, estados, sube, baja, redox, dism, roles, clases: c };
    cache.set(r.id, a);
    return a;
  }
  const porId = id => BANCO.find(r => r.id === id);

  // ---------- Textos de clases ----------
  const FORMAS = ['adicion', 'descomposicion', 'simple', 'doble', 'combustion', 'neutralizacion', 'precipitacion'];
  const NOMBRE = { adicion: 'Adición (síntesis)', descomposicion: 'Descomposición', simple: 'Desplazamiento simple',
    doble: 'Doble desplazamiento (metátesis)', combustion: 'Combustión', neutralizacion: 'Neutralización (ácido-base)',
    precipitacion: 'Precipitación', endotermica: 'Endotérmica', exotermica: 'Exotérmica', redox: 'Redox', reversible: 'Reversible',
    dismutacion: 'Dismutación' };
  const nombreMin = k => NOMBRE[k].charAt(0).toLowerCase() + NOMBRE[k].slice(1);
  // «es de precipitación», «es redox», «es endotérmica», «es una dismutación».
  const esClase = k => k === 'dismutacion' ? 'es una dismutación' : ['redox', 'reversible', 'exotermica', 'endotermica'].includes(k) ? 'es ' + nombreMin(k) : 'es de ' + nombreMin(k);
  const F = f => bonita(f);
  const listaY = l => l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1];

  // Número de oxidación x del elemento e con su texto; en los orgánicos con varios C se avisa que es promedio.
  const promedio = (s, e) => e === 'C' && s.atomos.C > 1 && s.atomos.H;
  function eoDe(a, e, x) {
    const ss = [...a.ec.reactivos, ...a.ec.productos].filter(s => s.atomos[e] && Math.abs(num(a.eo.get(s.f)[e]) - x) < 1e-9);
    if (!ss.length) return String(x);
    return eoTexto(a.eo.get(ss[0].f)[e]) + (ss.every(s => promedio(s, e)) ? ' (promedio)' : '');
  }
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  // Cambios de número de oxidación: «el Zn pasa de 0 a +2; el Cu, de +2 a 0».
  const cambioDe = (a, e) => cambios(a, [e]);
  function cambios(a, cuales = null) {
    const partes = [];
    for (const e of cuales || [...new Set([...a.sube, ...a.baja])]) {
      const desde = a.estados[e].L, hasta = a.estados[e].D;
      const t = x => eoDe(a, e, x);
      partes.push(`el ${e} pasa de ${listaY(desde.map(t))} a ${listaY(hasta.map(t))}`);
    }
    return partes.join('; ');
  }
  function porQueSi(k, a) {
    const n = a.ec.reactivos.length, m = a.ec.productos.length;
    switch (k) {
      case 'adicion': return `${n} sustancias se juntan en un solo producto`;
      case 'descomposicion': return `una sola sustancia se rompe en ${m} sustancias`;
      case 'simple': { const e = a.ec.reactivos.find(esElemento), s = a.ec.productos.find(esElemento); return `el elemento libre ${F(e.f)} toma el lugar del ${F(s.f)} en su compuesto y lo deja libre`; }
      case 'doble': return 'dos compuestos intercambian sus partes (sus iones) y nadie cambia su número de oxidación';
      case 'combustion': return `el ${F(a.ec.reactivos.find(t => t.base !== 'O2').f)} arde con O₂ y da solo ${listaY([...new Set(a.ec.productos.map(t => F(t.base)))])}${a.r.id === 'glucosa' ? ' (en la célula es una combustión lenta, por pasos, sin llama)' : ''}`;
      case 'neutralizacion': return `${listaY(a.ec.reactivos.filter(t => esAcido(t) || esSalAcida(t)).map(t => (esSalAcida(t) ? 'una sal ácida' : 'un ácido') + ` (${F(t.f)})`))} reacciona con un hidróxido y sale agua`;
      case 'precipitacion': return `de disoluciones (ac) sale un sólido (s): ${listaY(a.ec.productos.filter(t => t.estado === 's').map(t => F(t.f)))}`;
      case 'redox': return `cambian números de oxidación: ${cambios(a)}`;
      case 'reversible': return 'se escribe con doble flecha: va en los dos sentidos';
      case 'exotermica': return `ΔH = ${P.formatear(a.r.dH, 1)} kJ es negativo: libera calor`;
      case 'endotermica': return `ΔH = ${dHTexto(a.r.dH)} es positivo: absorbe calor`;
      case 'dismutacion': return `el ${a.dism[0]} se oxida y se reduce a la vez`;
    }
  }
  function porQueNo(k, a) {
    const R = a.ec.reactivos, Pr = a.ec.productos;
    switch (k) {
      case 'adicion': return `En la adición varias sustancias se juntan en un solo producto; aquí ${Pr.length === 1 ? 'sale 1 producto, pero de un solo reactivo' : `salen ${Pr.length} productos`}${R.length === 1 && Pr.length > 1 ? ' de un solo reactivo' : ''}.`;
      case 'descomposicion': return `En la descomposición una sola sustancia se rompe en varias; aquí reaccionan ${R.length} sustancias.`;
      case 'simple': {
        const e = R.filter(esElemento);
        return e.length ? `En el desplazamiento simple un elemento libre desplaza a otro de su compuesto y lo deja libre; aquí ${Pr.some(esElemento) ? 'no hay un solo compuesto a cada lado' : 'no sale ningún elemento libre'}.`
          : 'En el desplazamiento simple un elemento libre (solo, sin combinar) entra a un compuesto y deja libre a otro; aquí no reacciona ningún elemento libre.';
      }
      case 'doble': return a.redox ? `En el doble desplazamiento dos compuestos solo intercambian sus iones, sin cambiar números de oxidación; aquí ${cambios(a)}.`
        : `En el doble desplazamiento reaccionan dos compuestos que intercambian sus partes; aquí ${R.length !== 2 ? `${R.length === 1 ? 'reacciona una sola sustancia' : 'reaccionan ' + R.length + ' sustancias'}` : Pr.length < 2 ? 'sale un solo producto' : 'no todas las sustancias son compuestos'}.`;
      case 'combustion': return R.some(t => t.base === 'O2') ? 'En una combustión un combustible con carbono arde con O₂ y da CO₂, CO o H₂O; aquí no es así.'
        : Pr.some(t => t.base === 'O2') ? 'En una combustión el O₂ se consume; aquí el O₂ sale como producto.' : 'En una combustión algo arde con O₂; aquí no reacciona O₂.';
      case 'neutralizacion': return 'En la neutralización un ácido reacciona con un hidróxido y se forman sal y agua; aquí no hay ese par.';
      case 'precipitacion': return Pr.some(t => t.estado === 's') ? 'En la precipitación se mezclan disoluciones (ac) y de ellas sale un sólido; aquí los reactivos no son todos disoluciones.'
        : 'En la precipitación sale un sólido (s) de disoluciones; aquí no se forma ningún sólido.';
      case 'redox': return 'Ningún elemento cambia su número de oxidación: no hay electrones que pasen de una sustancia a otra.';
      case 'reversible': return 'Se escribe con una sola flecha (→): en estas condiciones va en un solo sentido.';
      case 'exotermica': return `ΔH = ${dHTexto(a.r.dH)} es positivo: la reacción absorbe calor.`;
      case 'endotermica': return `ΔH = ${P.formatear(a.r.dH, 1)} kJ es negativo: la reacción libera calor.`;
      case 'dismutacion': {
        if (!a.redox) return 'Ni siquiera es redox: ningún número de oxidación cambia.';
        const e = a.sube.find(x => a.baja.includes(x) && a.estados[x].L.length >= 2 && a.estados[x].D.length === 1);
        if (e) { const L = [...a.estados[e].L].sort((x, y) => x - y), d = a.estados[e].D[0], t = x => eoDe(a, e, x);
          return `El ${e} se oxida (${t(L[0])} → ${t(d)}) y se reduce (${t(L[L.length - 1])} → ${t(d)}), pero parte de dos números de oxidación distintos y llega a uno solo: es una comproporción, lo contrario de la dismutación.`; }
        return 'Hay redox, pero el elemento que se oxida no es el mismo que se reduce.';
      }
    }
  }
  // Código del error de quien le pone a la reacción `a` la propiedad k que no tiene (o le niega la que tiene).
  const H = (id, explicacion, extra = {}) => ({ id, explicacion, respaldo: 'hipotesis', fuente: FUENTE_QA, ...extra });
  function errorClase(k, a, afirma, calor) {
    const c = a.clases;
    if (k === 'redox') {
      if (afirma) { // dice que es redox y no lo es
        if (c.neutralizacion !== 'no') return H('QA-acido-base-redox', `Llamaste redox a una reacción ácido-base. ${porQueNo('redox', a)} El H⁺ pasa de una sustancia a otra, pero sigue con +1.`);
        if (c.adicion === 'si' && a.ec.reactivos.some(t => t.atomos.O)) return { id: 'EC9-oxidar-es-ganar-oxigeno', respaldo: 'parcial', fuente: FUENTE_EC,
          explicacion: `Se une a un compuesto con oxígeno y parece que «se oxida». Oxidarse no es ganar oxígeno: es perder electrones, y aquí ningún número de oxidación cambia.` };
        if (c.descomposicion === 'si' && a.ec.productos.some(t => t.estado === 'g' && t.atomos.O)) return { id: 'EC9-oxidar-es-ganar-oxigeno', respaldo: 'parcial', fuente: FUENTE_EC,
          explicacion: `Suelta ${listaY(a.ec.productos.filter(t => t.estado === 'g' && t.atomos.O).map(t => F(t.f)))}, ${a.ec.productos.filter(t => t.estado === 'g' && t.atomos.O).length > 1 ? 'que llevan' : 'que lleva'} oxígeno, y parece que algo «se reduce» al perderlo. Reducirse no es perder oxígeno: es ganar electrones, y aquí ningún número de oxidación cambia.` };
        if (c.descomposicion === 'si') return H('QA-descomposicion-redox', `No toda descomposición es redox. ${porQueNo('redox', a)}`);
        if (a.ec.reactivos.length === 1 && a.ec.productos.length === 1) {
          const t = a.ec.reactivos[0], igual = Object.keys(t.atomos).map(e => `el ${e} sigue en ${eoTexto(a.eo.get(t.f)[e])}`);
          return H('QA-redox-sin-cambio', `${t.coef === 2 ? 'Dos' : t.coef} moléculas de ${F(t.f)} se unen; ${listaY(igual)}. No es redox.`);
        }
        if (c.doble === 'si') return H('QA-doble-redox', `${porQueNo('redox', a)} Que cambien de pareja los iones no es redox.`);
        return H('QA-redox-sin-cambio', porQueNo('redox', a));
      }
      if (c.combustion === 'si') return H('QA-combustion-no-redox', `Toda combustión es redox: ${cambios(a)}. El O₂ se reduce y el combustible se oxida.`);
      if (a.dism.length) return H('QA-dismutacion-no-redox', `Sí es redox aunque cambie un solo elemento: ${cambios(a)}.`);
      if (![...a.sube, ...a.baja].includes('O')) { const e = a.sube[0], L = a.estados[e].L, D = a.estados[e].D;
        return { id: 'EC9-oxidar-es-ganar-oxigeno', respaldo: 'parcial', fuente: FUENTE_EC,
          explicacion: `Oxidarse no es ganar oxígeno: es perder electrones. Aquí no se gana ni se pierde oxígeno, pero el ${e} pierde electrones (${eoDe(a, e, L[0])} → ${eoDe(a, e, Math.max(...D))}). Es redox: ${cambios(a)}.` }; }
      if (c.simple === 'si') return H('QA-desplazamiento-no-redox', `Todo desplazamiento simple es redox: ${cambios(a)}.`);
      return H('QA-redox-no-visto', `Sí es redox: ${cambios(a)}.`);
    }
    if (k === 'reversible') {
      if (afirma) return c.descomposicion === 'si' || a.dism.length
        ? H('QA-descomposicion-reversible', `No toda descomposición o dismutación es reversible. Con → va en un solo sentido en estas condiciones${a.ec.productos.some(t => t.estado === 'g') ? `: el ${listaY(a.ec.productos.filter(t => t.estado === 'g').map(t => F(t.f)))} se escapa como gas` : ''}. Si en un recipiente cerrado esa reacción llegara al equilibrio, se escribiría con ⇌.`)
        : H('QA-reversible-sin-doble-flecha', porQueNo('reversible', a));
      return H('QA-reversible-sin-doble-flecha', `Es reversible: ${porQueSi('reversible', a)}.`);
    }
    if (k === 'exotermica' || k === 'endotermica') {
      const exo = a.r.dH < 0;
      const txt = exo ? `ΔH = ${P.formatear(a.r.dH, 1)} kJ: libera calor (exotérmica)` : `ΔH = ${dHTexto(a.r.dH)}: absorbe calor (endotérmica)`;
      if (exo && /calentar/i.test(a.r.contexto || '')) return H('QA-calentar-endotermica', `Que haya que calentarla para que empiece no la vuelve endotérmica: el calor de arranque solo la enciende. Una vez en marcha libera más de lo que recibió: ${txt}.`);
      if (calor === 'termino') return exo
        ? H('QA-calor-en-productos-absorbido', `El calor escrito del lado de los productos es calor que sale: la reacción lo libera, como un producto más. Es exotérmica, con ΔH = ${dHTexto(a.r.dH)}.`)
        : H('QA-calor-en-reactivos-liberado', `El calor escrito del lado de los reactivos es calor que entra: la reacción lo absorbe, como un reactivo más. Es endotérmica, con ΔH = ${dHTexto(a.r.dH)}.`);
      return H('QA-signo-dH', `El signo de ΔH dice el sentido: negativo, la reacción pierde energía y la libera; positivo, la absorbe. Aquí ${txt}.`);
    }
    if (k === 'dismutacion') return afirma
      ? H('QA-dismutacion-otra-redox', porQueNo('dismutacion', a))
      : H('QA-dismutacion-un-sentido', `Sí hay dismutación: ${cambios(a)}.`);
    // Clases por la forma
    return H('QA-tipo-' + k, afirma ? porQueNo(k, a) : `Sí ${esClase(k)}: ${porQueSi(k, a)}.`);
  }

  // ---------- Utilidades ----------
  const ROM = ['I', 'II', 'III', 'IV', 'V'];
  const LET = ['a', 'b', 'c', 'd'];
  // La ecuación como fórmula; el calor (ΔH o «Q kJ»), aparte y con el color de la variable dH (regla 4).
  function ecParte(r, calor) {
    const eq = { t: textoEcuacion(r), formula: true };
    if (!calor) return [eq];
    if (calor === 'dH') return [eq, '   ', v('dH', `ΔH = ${dHTexto(r.dH)}`)];
    const q = v('dH', `${P.formatear(Math.abs(r.dH), 1)} kJ`);
    return r.dH < 0 ? [eq, ' + ', q] : [q, ' + ', eq];
  }
  const VAR_DH = { dH: { nombre: 'calor de la ecuación', color: 'h' } };
  const contexto = r => r.contexto ? `${r.contexto} ocurre la reacción ` : 'Ocurre la reacción ';
  const datosEc = (r, calor) => ({ id: r.id, ec: r.ec, dH: r.dH, ...(calor ? { calor } : {}) });

  function cerrar(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    return { id: `clasificar-reacciones#${semilla}`, variables: o.variables || {}, enunciado: o.enunciado, pregunta: o.pregunta,
      datos: o.datos || '', alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave }, _datos: o._datos };
  }

  // ---- tipo: ¿de qué clase es? ----
  function tipo(rng, semilla) {
    const r = rng.elegir(BANCO), a = analizar(r);
    const si = FORMAS.filter(k => a.clases[k] === 'si'), no = FORMAS.filter(k => a.clases[k] === 'no');
    if (!si.length || no.length < 3) return null;
    const k = rng.elegir(si);
    const errores = rng.barajar(no).map(x => ({ ...errorClase(x, a, true), clave: 'tipo:' + x, texto: NOMBRE[x] }));
    return cerrar(rng, semilla, {
      enunciado: [contexto(r), ...ecParte(r), '.'],
      pregunta: ['¿De qué tipo es esta reacción?'],
      correcta: { clave: 'tipo:' + k, texto: NOMBRE[k] }, errores,
      solucion: [[`Cuenta reactivos y productos y fíjate si hay elementos libres: ${plural(a.ec.reactivos.length, 'reactivo', 'reactivos')} y ${plural(a.ec.productos.length, 'producto', 'productos')}.`],
        [`${esClase(k).replace(/^e/, 'E')}: ${porQueSi(k, a)}.`],
        ...(si.length > 1 ? [[`Además es de ${listaY(si.filter(x => x !== k).map(nombreMin))}: una reacción puede caer en dos clases a la vez.`]] : []),
        [a.redox ? `Por los números de oxidación es redox: ${cambios(a)}.` : 'No es redox: ningún número de oxidación cambia.']],
      _datos: { tipo: 'tipo', reacciones: [datosEc(r)], clase: k },
    });
  }

  // ---- relacionar: cuatro ecuaciones con cuatro clases ----
  const CLASES_REL = [...FORMAS, 'endotermica'];
  function relacionar(rng, semilla) {
    const clases = rng.barajar(CLASES_REL).slice(0, 4);
    const conCalor = clases.includes('endotermica');
    const usadas = [];
    for (const k of clases) {
      const otras = clases.filter(x => x !== k);
      const cand = BANCO.filter(r => !usadas.includes(r) && analizar(r).clases[k] === 'si' && otras.every(x => analizar(r).clases[x] === 'no'));
      if (!cand.length) return null;
      usadas.push(rng.elegir(cand));
    }
    // Orden de presentación: ecuaciones barajadas; letras a–d en el orden de `clases` barajadas aparte.
    const orden = rng.barajar([0, 1, 2, 3]);         // ecuación I = usadas[orden[0]], …
    const letras = rng.barajar([0, 1, 2, 3]);        // letra a = clases[letras[0]], …
    const letraDe = ci => LET[letras.indexOf(ci)];
    const ecs = orden.map(i => usadas[i]), cls = orden.map(i => clases[i]);
    const correcta = cls.map((k, j) => letraDe(clases.indexOf(k)));
    const texto = s => s.map((l, j) => `${ROM[j]}-${l}`).join(', ');
    const errores = [];
    const pares = rng.barajar([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]);
    for (const [i, j] of pares) {
      const s = correcta.slice(); [s[i], s[j]] = [s[j], s[i]];
      const ai = analizar(ecs[i]), aj = analizar(ecs[j]);
      const e = errorClase(cls[j], ai, true);
      errores.push({ ...e, clave: 'rel:' + s.join(''), texto: texto(s),
        explicacion: `Cruzaste ${ROM[i]} y ${ROM[j]}. ${ROM[i]} ${esClase(cls[i])}: ${porQueSi(cls[i], ai)}. ${ROM[j]} ${esClase(cls[j])}: ${porQueSi(cls[j], aj)}.` });
    }
    const enunciado = ['Relaciona cada ecuación con su tipo de reacción. '];
    ecs.forEach((r, j) => enunciado.push(`${ROM[j]}. `, ...ecParte(r, conCalor ? 'dH' : null), j < 3 ? '   ' : ''));
    enunciado.push('   Tipos: ' + LET.map((l, i) => `${l}) ${nombreMin(clases[letras[i]])}`).join('; ') + '.');
    return cerrar(rng, semilla, {
      variables: conCalor ? VAR_DH : {}, enunciado, pregunta: ['¿Cuál es la relación correcta?'],
      correcta: { clave: 'rel:' + correcta.join(''), texto: texto(correcta) }, errores,
      solucion: ecs.map((r, j) => [`${ROM[j]} → ${correcta[j]}) ${nombreMin(cls[j])}: ${porQueSi(cls[j], analizar(r))}.`]),
      _datos: { tipo: 'relacionar', reacciones: ecs.map(r => datosEc(r, conCalor ? 'dH' : null)), clases: LET.map((l, i) => clases[letras[i]]) },
    });
  }

  // ---- redoxSet: ¿cuáles son redox? ----
  const textoSet = s => s.length === 0 ? 'Ninguna' : s.length === 4 ? 'Las cuatro' : s.length === 1 ? `Solo ${s[0]}` : s.length === 2 ? `Solo ${s[0]} y ${s[1]}` : `${s[0]}, ${s[1]} y ${s[2]}`;
  function redoxSet(rng, semilla) {
    const nRedox = rng.elegir([1, 2, 2, 3]);
    const red = rng.barajar(BANCO.filter(r => analizar(r).redox)), no = rng.barajar(BANCO.filter(r => !analizar(r).redox));
    // Que haya al menos una trampa: una combustión o dismutación entre las redox, o una ácido-base entre las otras.
    const ecs = rng.barajar([...red.slice(0, nRedox), ...no.slice(0, 4 - nRedox)]);
    const trampa = ecs.some(r => { const a = analizar(r); return a.redox ? a.clases.combustion === 'si' || a.dism.length > 0 : a.clases.neutralizacion !== 'no'; });
    if (!trampa) return null;
    const set = ecs.map((r, j) => analizar(r).redox ? ROM[j] : null).filter(Boolean);
    const errores = ecs.map((r, j) => {
      const a = analizar(r), s = a.redox ? set.filter(x => x !== ROM[j]) : ROM.slice(0, 4).filter(x => set.includes(x) || x === ROM[j]);
      const e = errorClase('redox', a, !a.redox);
      return { ...e, clave: 'set:' + s.join(','), texto: textoSet(s), explicacion: `${a.redox ? `Dejaste fuera la ${ROM[j]}` : `Contaste la ${ROM[j]}`}. ${e.explicacion}` };
    });
    const enunciado = ['Observa estas ecuaciones. '];
    ecs.forEach((r, j) => enunciado.push(`${ROM[j]}. `, ...ecParte(r), j < 3 ? '   ' : ''));
    return cerrar(rng, semilla, {
      enunciado, pregunta: ['¿Cuáles son reacciones redox?'],
      correcta: { clave: 'set:' + set.join(','), texto: textoSet(set) }, errores,
      solucion: [['Una reacción es redox si algún elemento cambia su número de oxidación entre reactivos y productos.'],
        ...ecs.map((r, j) => { const a = analizar(r); return [`${ROM[j]}: ${a.redox ? 'sí, ' + cambios(a) : 'no, ningún número de oxidación cambia'}.`]; })],
      _datos: { tipo: 'redoxSet', reacciones: ecs.map(r => datosEc(r)) },
    });
  }

  // ---- rol: agente oxidante, reductor, sustancia que se oxida o se reduce, formas oxidada y reducida ----
  // Se pregunta por un reactivo o un producto tal como está escrito (con su estado), para que «se reduce el
  // cobre» no vuelva defendible el Cu(s) cuando se pide el CuSO₄(ac). Con iones, «especie».
  const PREG_ROL = {
    agenteOxidante: q => `¿Qué ${q.reac} es el agente oxidante?`, agenteReductor: q => `¿Qué ${q.reac} es el agente reductor?`,
    seOxida: q => `¿Qué ${q.reac} se oxida?`, seReduce: q => `¿Qué ${q.reac} se reduce?`,
    formaOxidada: q => `¿Qué ${q.prod} es la forma oxidada, es decir, la que se forma por oxidación?`,
    formaReducida: q => `¿Qué ${q.prod} es la forma reducida, es decir, la que se forma por reducción?` };
  const ES_REAC = { agenteOxidante: true, agenteReductor: true, seOxida: true, seReduce: true, formaOxidada: false, formaReducida: false };
    function rolDe(a, f) {
    const R = a.roles;
    if (R.seOxida.includes(f)) return 'oxR';
    if (R.seReduce.includes(f)) return 'redR';
    if (R.formaOxidada.includes(f)) return 'oxP';
    if (R.formaReducida.includes(f)) return 'redP';
    return 'nada';
  }
  function rol(rng, semilla) {
    const cand = BANCO.filter(r => { const a = analizar(r); return a.redox && !a.dism.length && a.roles.seOxida.length === 1 && a.roles.seReduce.length === 1
      && a.roles.seOxida[0] !== a.roles.seReduce[0]; });
    const r = rng.elegir(cand), a = analizar(r);
    const subs = Object.keys(PREG_ROL).filter(s => a.roles[s].length === 1 && !(s.startsWith('forma') && a.roles.formaOxidada.some(f => a.roles.formaReducida.includes(f))));
    const sub = rng.elegir(subs);
    const correcta = a.roles[sub][0];
    const todas = [...new Set([...a.ec.reactivos, ...a.ec.productos].map(t => t.f))].filter(f => f !== correcta && !f.startsWith('•'));
    const term = new Map([...a.ec.reactivos, ...a.ec.productos].map(t => [t.f, t]));
    const T = f => terminoTexto({ ...term.get(f), coef: 1 });
    const iones = [...a.ec.reactivos, ...a.ec.productos].some(t => t.carga !== 0);
    const q = iones ? { reac: 'especie de los reactivos', prod: 'especie de los productos' } : { reac: 'reactivo', prod: 'producto' };
    const ox = a.roles.seOxida[0], rd = a.roles.seReduce[0];
    const errores = todas.map(f => {
      const ro = rolDe(a, f);
      let e;
      if (ES_REAC[sub] && (ro === 'oxR' || ro === 'redR')) {
        e = sub.startsWith('agente')
          ? H('QA-agente-cruzado', `El ${F(f)} ${ro === 'oxR' ? 'se oxida: pierde electrones y se los da al otro, por eso es el agente reductor' : 'se reduce: gana electrones y le quita al otro, por eso es el agente oxidante'}. El agente lleva el nombre de lo que le hace al otro, no de lo que le pasa a él.`)
          : { id: 'EC9-definiciones-al-reves', respaldo: 'parcial', fuente: FUENTE_EC,
            explicacion: `Oxidarse es perder electrones (sube el número de oxidación) y reducirse es ganarlos (baja). El ${F(f)} ${ro === 'oxR' ? 'se oxida' : 'se reduce'}.` };
      } else if (!ES_REAC[sub] && (ro === 'oxP' || ro === 'redP')) {
        e = { id: 'EC9-definiciones-al-reves', respaldo: 'parcial', fuente: FUENTE_EC,
          explicacion: `El ${F(f)} es la forma ${ro === 'oxP' ? 'oxidada' : 'reducida'}: ahí el elemento quedó con un número de oxidación ${ro === 'oxP' ? 'mayor' : 'menor'}. Oxidarse es subir; reducirse, bajar.` };
      } else if (ES_REAC[sub] && (ro === 'oxP' || ro === 'redP')) {
        e = H('QA-producto-por-reactivo', `El ${F(f)} es un producto (${a.roles.formaOxidada.includes(f) && a.roles.formaReducida.includes(f) ? 'forma oxidada y también reducida' : 'la forma ' + (ro === 'oxP' ? 'oxidada' : 'reducida')}). Los agentes y las sustancias que se oxidan o se reducen son reactivos: los que entran a la reacción.`);
      } else if (!ES_REAC[sub] && (ro === 'oxR' || ro === 'redR')) {
        e = H('QA-reactivo-por-producto', `El ${F(f)} es un reactivo (${ro === 'oxR' ? 'el que se oxida' : 'el que se reduce'}). Se pide el producto en que termina el elemento después del cambio.`);
      } else {
        e = H('QA-especie-sin-cambio', `En el ${F(f)} ningún elemento cambió su número de oxidación respecto de los reactivos: no participa en el paso de electrones.`);
      }
      return { ...e, clave: 'esp:' + f, texto: T(f) };
    });
    return cerrar(rng, semilla, {
      variables: { ox: { nombre: 'lo que se oxida', color: 'i' }, red: { nombre: 'lo que se reduce', color: 'o' } },
      enunciado: [contexto(r), ...ecParte(r), '.'],
      pregunta: [PREG_ROL[sub](q)],
      correcta: { clave: 'esp:' + correcta, texto: T(correcta) }, errores: rng.barajar(errores),
      solucion: [['Números de oxidación que cambian: ', ...a.sube.flatMap((e, i) => [i ? '; ' : '', v('ox', cambioDe(a, e))]), '; ', ...a.baja.flatMap((e, i) => [i ? '; ' : '', v('red', cambioDe(a, e))]), '.'],
        ['Se oxida (sube, pierde electrones) el ', v('ox', F(ox)), ': es el agente reductor. Se reduce (baja, gana electrones) el ', v('red', F(rd)), ': es el agente oxidante.'],
        ['Formas que se producen: oxidada, ', v('ox', listaY(a.roles.formaOxidada.map(F))), '; reducida, ', v('red', listaY(a.roles.formaReducida.map(F))), '.']],
      _datos: { tipo: 'rol', sub, reacciones: [datosEc(r)] },
    });
  }

  // ---- dismutacion: un mismo elemento sube y baja ----
  function dismutacion(rng, semilla) {
    const r = rng.elegir(BANCO.filter(x => analizar(x).dism.length === 1 && analizar(x).sube.length === 1 && analizar(x).baja.length === 1));
    const a = analizar(r), E = a.dism[0];
    const t = x => eoDe(a, E, x);
    const v0 = a.estados[E].L[0], arriba = Math.max(...a.estados[E].D), abajo = Math.min(...a.estados[E].D);
    const otro = rng.elegir([...new Set([...a.ec.reactivos, ...a.ec.productos].flatMap(s => Object.keys(s.atomos)))].filter(e => e !== E));
    const correcta = { clave: 'dis:' + E, texto: `El ${E} se oxida y se reduce a la vez: pasa de ${t(v0)} a ${t(arriba)} y a ${t(abajo)}.` };
    const errores = rng.barajar([
      H('QA-dismutacion-un-sentido', `No todo el ${E} va en el mismo sentido: una parte sube a ${t(arriba)} (se oxida) y otra baja a ${t(abajo)} (se reduce).`, { clave: 'dis:sube', texto: `Todo el ${E} se oxida: pasa de ${t(v0)} a ${t(arriba)}.` }),
      H('QA-dismutacion-un-sentido', `No todo el ${E} va en el mismo sentido: una parte baja a ${t(abajo)} (se reduce) y otra sube a ${t(arriba)} (se oxida).`, { clave: 'dis:baja', texto: `Todo el ${E} se reduce: pasa de ${t(v0)} a ${t(abajo)}.` }),
      H('QA-dismutacion-no-redox', `Es redox: ${cambios(a)}. Que el ${E} esté a los dos lados no impide que cambie su número de oxidación.`, { clave: 'dis:no', texto: `No es redox: el ${E} está a los dos lados de la ecuación.` }),
      H('QA-dismutacion-otro-elemento', `El ${otro} no cambia su número de oxidación. El que se oxida y se reduce es el mismo ${E}.`, { clave: 'dis:otro', texto: `El ${E} se oxida y el ${otro} se reduce.` }),
    ]);
    return cerrar(rng, semilla, {
      variables: { ox: { nombre: 'lo que se oxida', color: 'i' }, red: { nombre: 'lo que se reduce', color: 'o' } },
      enunciado: [contexto(r), ...ecParte(r), '.'],
      pregunta: ['¿Qué pasa con los números de oxidación?'],
      correcta, errores,
      solucion: [[`Calcula el número de oxidación del ${E} en cada sustancia. En los reactivos tiene ${t(v0)}.`],
        ['En los productos una parte sube a ', v('ox', t(arriba)), ' (se oxida) y otra baja a ', v('red', t(abajo)), ' (se reduce).'],
        [`Es una dismutación (desproporción): el ${E} es a la vez agente oxidante y reductor.`],
        ...(E === 'C' ? [['En los compuestos orgánicos se usa el promedio de los C: en la glucosa cada C tiene su propio número de oxidación, pero el promedio es 0; en el etanol el promedio es −2, y en el CO₂ el C tiene +4.']] : [])],
      _datos: { tipo: 'dismutacion', reacciones: [datosEc(r)] },
    });
  }

  // ---- calor: cuánto calor y en qué sentido ----
  const limpio = (x, d = 1) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-9;
  function calor(rng, semilla) {
    const r = rng.elegir(BANCO.filter(x => x.dH != null)), a = analizar(r);
    const forma = rng.elegir(['dH', 'termino']);
    const ts = [...a.ec.reactivos, ...a.ec.productos].filter(t => limpio(masaMolar(t.f), 1) && masaMolar(t.f) !== 0);
    const t = rng.elegir(ts), esReac = a.ec.reactivos.includes(t);
    const k = rng.elegir([0.25, 0.5, 1.5, 2, 3]);
    const n = t.coef * k, M = masaMolar(t.f), m = n * M, Q = Math.abs(r.dH) * k;
    if (!limpio(m, 1) || !limpio(Q, 1)) return null;
    const exo = r.dH < 0, sent = exo ? 'libera' : 'absorbe', otro = exo ? 'absorbe' : 'libera';
    const txt = (s, q) => `Se ${s === 'libera' ? 'liberan' : 'absorben'} ${P.formatear(q, 1)} kJ`;
    const op = (s, q) => ({ clave: `q:${s}:${Math.round(q * 10) / 10}`, texto: txt(s, q) });
    const errores = [
      { ...errorClase('exotermica', a, !exo, forma), ...op(otro, Q) },
      H('QA-calor-de-la-ecuacion', `${P.formatear(Math.abs(r.dH), 1)} kJ es el calor de la ecuación tal como está escrita, con ${t.coef} mol de ${F(t.f)}. Aquí hay ${P.formatear(n, 2)} mol: hay que hacer la regla de tres.`, op(sent, Math.abs(r.dH))),
      ...(t.coef > 1 ? [H('QA-calor-sin-coeficiente', `Multiplicaste los moles por el calor de la ecuación como si fuera por 1 mol de ${F(t.f)}. En la ecuación hay ${t.coef} mol: hay que dividir entre el coeficiente.`, op(sent, Math.abs(r.dH) * n)),
        H('QA-calor-por-coeficiente', `Multiplicaste también por el coeficiente ${t.coef}. El calor de la ecuación ya es para ${t.coef} mol de ${F(t.f)}: hay que dividir entre ${t.coef}, no multiplicar.`, op(sent, Math.abs(r.dH) * n * t.coef))] : []),
      H('QA-calor-gramos-como-moles', `Usaste los gramos como si fueran moles. Primero pasa a moles: ${P.formatear(m, 1)} g ÷ ${P.formatear(M, 1)} g/mol = ${P.formatear(n, 2)} mol.`, op(sent, Math.abs(r.dH) * m / t.coef)),
    ].filter(e => limpio(Number(e.clave.split(':')[2]), 1) && Number(e.clave.split(':')[2]) > 0 && Number(e.clave.split(':')[2]) < 1e6);
    const verbo = m === 1 ? (esReac ? 'reacciona' : 'se forma') : (esReac ? 'reaccionan' : 'se forman');
    return cerrar(rng, semilla, {
      variables: { dH: { nombre: 'calor de la ecuación', color: 'h' }, m: { nombre: 'masa', color: 'o' }, Q: { nombre: 'calor pedido', color: 'd' } },
      enunciado: [contexto(r), ...ecParte(r, forma), '. En un ensayo ', verbo, ' ', v('m', `${P.formatear(m, 1)} g de ${F(t.f)}`), '.'],
      pregunta: ['¿Cuánto calor interviene y en qué sentido?'],
      datos: `Masa molar del ${F(t.f)}: ${P.formatear(M, 1)} g/mol.`,
      correcta: op(sent, Q), errores,
      solucion: [[forma === 'dH' ? `ΔH es ${exo ? 'negativo' : 'positivo'}: la reacción ${sent} calor.` : `El calor está escrito del lado de los ${exo ? 'productos: sale, se libera' : 'reactivos: entra, se absorbe'}.`, ' Por la ecuación, ',
        v('dH', `${P.formatear(Math.abs(r.dH), 1)} kJ`), ` por cada ${t.coef} mol de ${F(t.f)}.`],
        ['Moles: ', v('m', `${P.formatear(m, 1)} g`), ` ÷ ${P.formatear(M, 1)} g/mol = ${P.formatear(n, 2)} mol.`],
        ['Regla de tres: ', v('dH', `${P.formatear(Math.abs(r.dH), 1)} kJ`), ` × ${P.formatear(n, 2)} ÷ ${t.coef} = `, v('Q', `${P.formatear(Q, 1)} kJ`), `, que se ${sent === 'libera' ? 'liberan' : 'absorben'}.`]],
      _datos: { tipo: 'calor', reacciones: [datosEc(r, forma)], sustancia: t.f, masa: m },
    });
  }

  // ---- tipoEnergia: clase y energía a la vez ----
  function tipoEnergia(rng, semilla) {
    const r = rng.elegir(BANCO.filter(x => x.dH != null)), a = analizar(r);
    const si = FORMAS.filter(k => a.clases[k] === 'si'), no = rng.barajar(FORMAS.filter(k => a.clases[k] === 'no'));
    if (!si.length || no.length < 2) return null;
    const forma = rng.elegir(['dH', 'termino']);
    const k = rng.elegir(si), en = r.dH < 0 ? 'exo' : 'endo', otra = en === 'exo' ? 'endo' : 'exo';
    const T = (c, e) => ({ clave: `te:${c}:${e}`, texto: `${NOMBRE[c]} y ${e === 'exo' ? 'exotérmica' : 'endotérmica'}` });
    const eCal = errorClase('exotermica', a, en !== 'exo', forma);
    const errores = [
      { ...eCal, ...T(k, otra) },
      { ...errorClase(no[0], a, true), ...T(no[0], en) },
      { ...errorClase(no[1], a, true), ...T(no[1], en) },
      { ...errorClase(no[0], a, true), ...T(no[0], otra), explicacion: `${porQueNo(no[0], a)} ${eCal.explicacion}` },
    ];
    return cerrar(rng, semilla, {
      variables: { dH: { nombre: 'calor de la ecuación', color: 'h' } },
      enunciado: [contexto(r), ...ecParte(r, forma), '.'],
      pregunta: ['¿Cómo se clasifica por su forma y por la energía?'],
      correcta: T(k, en), errores,
      solucion: [[`Por la forma: ${nombreMin(k)}, porque ${porQueSi(k, a)}.`],
        [forma === 'dH' ? 'Por la energía: ' : `Por la energía: el calor está del lado de los ${en === 'exo' ? 'productos (sale)' : 'reactivos (entra)'}; `, v('dH', `ΔH = ${dHTexto(r.dH)}`), en === 'exo' ? ', negativo: exotérmica.' : ', positivo: endotérmica.']],
      _datos: { tipo: 'tipoEnergia', reacciones: [datosEc(r, forma)], clase: k },
    });
  }

  // ---- aLaVez: la que es X y también Y ----
  const PARES = [['redox', 'reversible'], ['combustion', 'exotermica'], ['doble', 'precipitacion'], ['descomposicion', 'redox'],
    ['adicion', 'redox'], ['redox', 'endotermica'], ['neutralizacion', 'precipitacion'], ['descomposicion', 'endotermica'],
    ['adicion', 'reversible'], ['dismutacion', 'descomposicion'], ['simple', 'exotermica'], ['descomposicion', 'reversible']];
  const ENERGIA = ['exotermica', 'endotermica'];
  const frase = k => k === 'dismutacion' ? 'ser una dismutación' : ['redox', 'reversible', ...ENERGIA].includes(k) ? 'ser ' + nombreMin(k) : 'ser de ' + nombreMin(k);
  function aLaVez(rng, semilla) {
    const [X, Y] = rng.elegir(PARES);
    const conCalor = ENERGIA.includes(X) || ENERGIA.includes(Y);
    const forma = conCalor ? rng.elegir(['dH', 'termino']) : null;
    const st = (r, k) => analizar(r).clases[k];
    const buenas = BANCO.filter(r => st(r, X) === 'si' && st(r, Y) === 'si');
    const malas = BANCO.filter(r => [X, Y].every(k => st(r, k) !== 'ambigua') && (st(r, X) === 'no' || st(r, Y) === 'no'));
    const casi = rng.barajar(malas.filter(r => st(r, X) === 'si' || st(r, Y) === 'si'));
    if (!buenas.length || casi.length < 2) return null;
    const r = rng.elegir(buenas);
    const otras = [...casi.slice(0, 3), ...rng.barajar(malas.filter(m => !casi.slice(0, 3).includes(m)))].slice(0, 4);
    const errores = otras.map(m => {
      const a = analizar(m), falla = st(m, X) === 'no' ? X : Y, ambas = st(m, X) === 'no' && st(m, Y) === 'no';
      const e = errorClase(falla, a, true, forma);
      return { ...e, clave: 'una:' + m.id, texto: textoEcuacion(m, forma),
        explicacion: ambas ? `No cumple ninguna de las dos condiciones. ${e.explicacion}` : `Cumple una condición, porque ${esClase(falla === X ? Y : X)}, pero no la otra. ${e.explicacion}` };
    });
    const a = analizar(r);
    return cerrar(rng, semilla, {
      enunciado: [`Entre estas ecuaciones, busca la que cumple dos condiciones a la vez: ${frase(X)} y ${frase(Y)}.`],
      pregunta: ['¿Cuál es?'],
      correcta: { clave: 'una:' + r.id, texto: textoEcuacion(r, forma) }, errores,
      solucion: [[`La correcta ${esClase(X)}: ${porQueSi(X, a)}.`], [`Y ${esClase(Y)}: ${porQueSi(Y, a)}.`],
        ['Las otras fallan en al menos una de las dos condiciones.']],
      _datos: { tipo: 'aLaVez', pareja: [X, Y], reacciones: [r, ...otras].map(m => datosEc(m, forma)) },
    });
  }

  // ---- vf: tres afirmaciones ----
  function vf(rng, semilla) {
    const r = rng.elegir(BANCO), a = analizar(r), c = a.clases;
    const forma = rng.elegir(['dH', 'termino']);
    const pool = [];
    const add = (tipoA, texto, verdad, err) => pool.push({ tipoA, texto, verdad, err });
    add('redox', 'Es una reacción redox.', a.redox, errorClase('redox', a, !a.redox));
    for (const k of FORMAS) if (c[k] !== 'ambigua') add('forma', `Es una reacción de ${nombreMin(k).replace(/ \(.*\)$/, '')}.`, c[k] === 'si', errorClase(k, a, c[k] !== 'si'));
    if (r.dH != null) {
      const e = rng.moneda() ? 'exotermica' : 'endotermica';
      add('energia', e === 'exotermica' ? 'Libera calor: es exotérmica.' : 'Absorbe calor: es endotérmica.', c[e] === 'si', errorClase(e, a, c[e] !== 'si', forma));
    }
    if (c.reversible !== 'ambigua') add('reversible', 'Es reversible.', a.ec.reversible, errorClase('reversible', a, !a.ec.reversible));
    if (a.redox && !a.dism.length && a.roles.seOxida.length === 1 && a.roles.seReduce.length === 1 && a.roles.seOxida[0] !== a.roles.seReduce[0]) {
      const ox = a.roles.seOxida[0], rd = a.roles.seReduce[0], verdad = rng.moneda();
      add('agente', `El ${F(verdad ? rd : ox)} es el agente oxidante.`, verdad,
        H('QA-agente-cruzado', `El agente oxidante es el que se reduce (gana electrones): el ${F(rd)}. El ${F(ox)} se oxida y es el agente reductor.`));
    }
    if (a.dism.length) add('dismutacion', `El ${a.dism[0]} se oxida y se reduce a la vez.`, true, errorClase('dismutacion', a, false));
    // Tres afirmaciones de tipos distintos; la de forma, como mucho dos (una verdadera y una falsa).
    const porTipo = {};
    for (const s of rng.barajar(pool)) (porTipo[s.tipoA] = porTipo[s.tipoA] || []).push(s);
    const tipos = rng.barajar(Object.keys(porTipo));
    if (tipos.length < 3) return null;
    const elegidas = tipos.slice(0, 3).map(tp => porTipo[tp][0]);
    const sec = s => s.map(x => (x ? 'V' : 'F')).join('');
    const ok = elegidas.map(s => s.verdad);
    const errores = elegidas.map((s, i) => {
      const w = ok.slice(); w[i] = !w[i];
      return { ...s.err, clave: 'vf:' + sec(w), texto: sec(w), explicacion: `La afirmación ${ROM[i]} es ${s.verdad ? 'verdadera' : 'falsa'}. ${s.err.explicacion}` };
    });
    const w = ok.map(x => !x);
    errores.push({ ...elegidas[0].err, clave: 'vf:' + sec(w), texto: sec(w), explicacion: `Las tres están al revés. ${elegidas.map((s, i) => `${ROM[i]} es ${s.verdad ? 'verdadera' : 'falsa'}`).join('; ')}. ${elegidas[0].err.explicacion}` });
    const enunciado = [contexto(r), ...ecParte(r, r.dH != null ? forma : null), '. Indica si cada afirmación es verdadera (V) o falsa (F): '];
    elegidas.forEach((s, i) => enunciado.push(`${ROM[i]}. ${s.texto} `));
    return cerrar(rng, semilla, {
      variables: r.dH != null ? VAR_DH : {}, enunciado, pregunta: ['¿Cuál es la secuencia correcta?'],
      correcta: { clave: 'vf:' + sec(ok), texto: sec(ok) }, errores,
      solucion: elegidas.map((s, i) => [`${ROM[i]}. ${s.verdad ? 'V' : 'F'}: ${s.verdad ? s.err.explicacion.replace(/^Sí /, 'Sí ') : s.err.explicacion}`]),
      _datos: { tipo: 'vf', reacciones: [datosEc(r, r.dH != null ? forma : null)], afirmaciones: elegidas.map(s => s.texto) },
    });
  }

  // ---- aguaDura: qué ecuación explica el sarro o el bicarbonato del agua dura ----
  // El sentido lo decide el CO₂: con CO₂ disuelto la caliza se disuelve como Ca(HCO₃)₂; al hervir, el CO₂ se
  // escapa y el Ca(HCO₃)₂ vuelve a CaCO₃ (sarro).
  function aguaDura(rng, semilla) {
    const sub = rng.elegir(['sarro', 'bicarbonato']);
    const E = id => porId(id), Te = id => textoEcuacion(E(id));
    const op = (id, err) => ({ ...err, clave: 'agua:' + id, texto: Te(id) });
    const CO2 = 'El sentido lo decide el CO₂: con CO₂ disuelto, CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂ (la caliza se disuelve); al hervir, el CO₂ se escapa y va al revés, Ca(HCO₃)₂ → CaCO₃ + CO₂ + H₂O (el sarro).';
    let enunciado, pregunta, correcta, errores, solucion;
    if (sub === 'sarro') {
      const abl = rng.elegir(BANCO.filter(r => r.agua === 'ablanda')).id;
      enunciado = ['Al hervir agua dura en una tetera, sin agregar nada, queda una costra blanca en el fondo.'];
      pregunta = ['¿Qué ecuación la explica?'];
      correcta = { clave: 'agua:sarro', texto: Te('sarro') };
      errores = [
        op('caliza-disuelta', H('QA-sentido-invertido', `Es la reacción al revés: así se disuelve la caliza cuando el agua tiene CO₂ de sobra. Al hervir, el CO₂ se escapa y el Ca(HCO₃)₂ disuelto se vuelve CaCO₃ sólido: la costra. ${CO2}`)),
        op('caliza', H('QA-descompone-el-sarro', 'Esa es la descomposición de la caliza en un horno a unos 900 °C, que da cal viva (CaO). En la tetera no se forma CaO: la costra es el mismo CaCO₃, que sale del Ca(HCO₃)₂ disuelto.')),
        op(abl, H('QA-ablandar-no-es-hervir', `Ahí se agrega ${abl === 'ablandar' ? 'soda (Na₂CO₃)' : 'cal (Ca(OH)₂)'} para ablandar el agua. En la tetera no se agregó nada: la costra sale del Ca(HCO₃)₂ que ya estaba disuelto, al perder su CO₂.`)),
        op('acido-carbonico', H('QA-sin-solido', 'Esa ecuación forma ácido carbónico a partir del CO₂ y el agua: no tiene calcio ni da ningún sólido.')),
      ];
      solucion = [['La costra es CaCO₃, un sólido. En el agua dura el calcio está disuelto como Ca(HCO₃)₂.'], [CO2],
        ['Por eso la que explica la costra es ', { t: Te('sarro'), formula: true }, ', una descomposición.']];
    } else {
      enunciado = ['El agua de lluvia lleva CO₂ disuelto. Al pasar por roca caliza (CaCO₃), sale cargada de iones Ca²⁺ y HCO₃⁻: es agua dura.'];
      pregunta = ['¿Qué ecuación explica que se forme el bicarbonato?'];
      correcta = { clave: 'agua:caliza-disuelta', texto: Te('caliza-disuelta') };
      errores = [
        op('sarro', H('QA-sentido-invertido', `Es la reacción al revés: así se forma el sarro cuando el CO₂ se escapa al hervir. Con CO₂ disuelto de sobra, la caliza se disuelve. ${CO2}`)),
        op('caliza-acido', H('QA-caliza-con-acido-fuerte', 'Con ácido clorhídrico la caliza también se disuelve, pero da CaCl₂ y suelta el CO₂: no forma bicarbonato. La lluvia trae CO₂, no HCl.')),
        op('acido-carbonico', H('QA-acido-por-anion', 'Esa forma el ácido carbónico (H₂CO₃), no el ion bicarbonato junto al calcio: falta la caliza, que aporta el Ca²⁺ y el CO₃²⁻.')),
        op('bicarbonato', H('QA-bicarbonato-se-descompone', 'Esa es la descomposición del bicarbonato de sodio al hornear: lo destruye, no lo forma. Además la roca es de calcio, no de sodio.')),
      ];
      solucion = [['La caliza es CaCO₃ y casi no se disuelve en agua pura.'], [CO2],
        ['Por eso la que explica el bicarbonato es ', { t: Te('caliza-disuelta'), formula: true }, ', una adición.']];
    }
    return cerrar(rng, semilla, { enunciado, pregunta, correcta, errores: rng.barajar(errores), solucion,
      _datos: { tipo: 'aguaDura', sub, reacciones: [correcta.clave.slice(5), ...errores.map(e => e.clave.slice(5))].map(id => datosEc(E(id))) } });
  }

  const TIPOS = { tipo, relacionar, redoxSet, rol, dismutacion, calor, tipoEnergia, aLaVez, vf, aguaDura };
  const PESOS = ['tipo', 'aguaDura', 'relacionar', 'relacionar', 'redoxSet', 'redoxSet', 'rol', 'rol', 'dismutacion',
    'calor', 'calor', 'tipoEnergia', 'aLaVez', 'aLaVez', 'vf', 'vf'];
  function generar(semilla) {
    const rng = Azar.crear('clasificar-reacciones|' + semilla);
    const t = rng.elegir(PESOS);
    for (let i = 0; i < 400; i++) {
      const p = TIPOS[t](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error(`No se pudo generar un problema de tipo ${t}`);
  }

  return { id: 'clasificar-reacciones', titulo: '¿Qué clase de reacción es?', generar, BANCO, analizar, oxidacion, ecuacion,
    textoEcuacion, masaMolar, FORMAS, porQueNo, porQueSi };
});
