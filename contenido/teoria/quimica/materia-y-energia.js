/*
 * Teoría de «Materia y energía» (quimica.materia-y-energia). Molde: docs/teoria.md y docs/molde-unidad.md. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 1), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 25) y las precisiones de Química del expediente. Errores: docs/investigacion/quimica-materia-nomenclatura-
 * organica-ideas-erroneas.md (MA), atomo-enlace (EN, AT) y gases-soluciones (GQ); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: clasificar una muestra por sus partículas y decidir qué hace el calor y la energía con ella.
 *   Persona y condiciones: alumno de 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, sin audio,
 *     a veces sin conexión.
 *   Resultado observable: clasifica una muestra nueva, dice si un cambio es físico, químico o nuclear y calcula
 *     Q = m·cₑ·ΔT, Q = m·L y E = Δm·c² con sus unidades.
 *   Orden de atención: 1.º la lupa (qué partículas hay) · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿lo uniforme es puro?, ¿el calor siempre sube la temperatura?, ¿de dónde sale la energía nuclear?
 *
 * Etapa 2 (17 nov 2026, docs/etapa2/propuesta-quimica.md y decisiones.md): cinco ideas, sustancia-mezcla,
 * propiedades (nueva), fisico-quimico-nuclear, calor-sensible-latente y masa-energia, todas contra el contrato «se
 * entiende sin profesor» (misión, leyenda, datos, 15 ejemplos por idea): la unidad declara calidad: 2. Después, la
 * mesa de revisión (decisiones.md, «Cambios posteriores») devolvió la vida media: idea 6, vida-media, con el hueso de
 * carbono-14 de la idea 3 (lupa de átomos, quim-vasos) y su curva de masa (quim-cocina).
 * Un dibujo es de partículas o de variables, nunca de los dos. Partículas (ideas 1 y 3, piezas quim-vasos y
 * quim-particulas): la paleta de elementos (nucleo/elementos.js, var(--el-*)) con su relleno (O lleno, H hueco, Na con
 * punto o con su signo de ion). Variables (ideas 2, 4 y 5, pieza quim-cocina): colores por papel del molde §5b, naranja el
 * primer dato, turquesa el segundo o el factor, violeta lo que se pide, verde un tercer dato: m, V y ρ; m, ΔT o L, cₑ y Q;
 * Δm, c², E y la energía de un balón; en la idea 6, m y m₀ naranja (masa), t turquesa, t₁/₂ violeta y n carmín. Letras: cₑ es el calor específico porque c es la rapidez de la luz; T es la
 * temperatura (en física también es el período o la dimensión tiempo: es la notación de los libros).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §1.2 y §10.3; IUPAC; NIST (c = 299 792 458 m/s, aquí 3 × 10⁸).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/materia-energia/motor.js')) : fabrica(root.Kit, root.MotorMateria);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, Motor) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const m = { v: 'c-i', t: 'm' }, Q = { v: 'c-o', t: 'Q' }, Tm = { v: 'c-h', t: 'T' }, E = { v: 'c-d', t: 'E' };
  const dT = ['Δ', Tm], dm = ['Δ', m];
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // 9 × 10¹³ (notación científica con superíndices).
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  // Entre 0,01 y 10 000 va el número tal cual (3 g, no 3 × 10⁰ g).
  function cien(x, d = 1) {
    if (x === 0) return '0';
    if (Math.abs(x) >= 0.01 && Math.abs(x) < 1e4) return f(x, 3);
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }

  // ---------- Idea 1: ¿sustancia pura o mezcla? Se cuentan las clases de partícula ----------
  // Rehecha el 17 nov contra el contrato «se entiende sin profesor» (docs/plan-calidad.md §3; propuesta aprobada en
  // docs/etapa2/propuesta-quimica.md, con docs/etapa2/decisiones.md). Primera pantalla: tres vasos sobre una mesa (pieza
  // quim-vasos, objetos de prueba) y, al jugar, la lupa debajo de cada uno.
  // Cambia: lo que se echa al agua y cuánto se revuelve · Permanece: el vaso de agua destilada al lado, como referencia ·
  // Progresa: el montoncito del fondo se disuelve hasta que el vaso se ve igual que el de agua sola · Se reserva: el
  // hielo (una sustancia en dos fases), que es la predicción · Debe verse: cuántas clases de partícula hay y si forman
  // una fase o dos.
  // Un dibujo de partículas, nunca de variables: los átomos van con la paleta de elementos (AT1, `el`) y los vasos en
  // tinta. Los pares que no se distinguen (C–Na, N–Fe; Elementos.CERCANOS) no comparten dibujo: por eso el trío de
  // «Lee» y «Mira» es agua destilada, agua con azúcar y agua con aceite (la propuesta decía sal; sal y aceite juntarían
  // Na con C). La sal sale en el juego y en los ejemplos, nunca junto al azúcar ni al aceite. Lo comprueba
  // contenido/teoria/quimica/materia-y-energia.test.js en todos los dibujos de la idea.
  // La sal se dibuja como un par de iones, Na⁺ y Cl⁻, con su signo dentro de cada átomo (Gerson, 17 nov: «ponerle las
  // cargas desde ya»). La leyenda dice que son partículas con carga; el porqué de la carga es de estructura atómica y de
  // enlace (punto 9), y aquí no se explica. El agua es «destilada» y no «hervida»: el agua hervida de la llave conserva sales disueltas.
  // La clasificación la decide el motor de la escena materia-energia (MotorMateria.clasificarCaja y contarSistema), con
  // la misma lista de partículas que dibuja la lupa (regla 1).
  // Códigos: MA9 (dos clases de átomo = compuesto, o hielo y agua = dos sustancias), MA10 (uniforme a la vista = pura),
  // QM-HOMO (mezcla de una fase porque «todo es agua»), y las hipótesis nuevas QM-HETERO (dos clases repartidas = dos
  // fases), QM-FASE-DISUELTO (lo disuelto como fase aparte), QM-CADA-COSA (cada cosa nombrada, una fase), QM-INVIERTE
  // (fases y componentes al revés) y AQ-rama-por-sustancia (la rama se elige por la sustancia, no por la tarea).
  const AT1 = {
    H: { el: 'H', estilo: 'hueco', r: 3.6 }, O: { el: 'O', estilo: 'lleno', r: 5 }, C: { el: 'C', estilo: 'lleno', r: 4.2 },
    N: { el: 'N', estilo: 'lleno', r: 5 }, Na: { el: 'Na', estilo: 'punto', r: 5, carga: '+' }, Cl: { el: 'Cl', estilo: 'lleno', r: 5.6, carga: '-' },
    Si: { el: 'Si', estilo: 'punto', r: 5 }, Cu: { el: 'Cu', estilo: 'lleno', r: 6 }, Sn: { el: 'Sn', estilo: 'punto', r: 6 },
    // El mismo hidrógeno, más chico, para las moléculas de muchos átomos (propano, alcohol): así caben todos sus átomos.
    h: { el: 'H', estilo: 'hueco', r: 3 },
  };
  const ESP1 = {
    H2O: [['O', 0, -1.5], ['H', -5.5, 3.5], ['H', 5.5, 3.5]], NaCl: [['Na', -5.2, 0], ['Cl', 5.6, 0]],
    azucar: [['C', -5, -2.5], ['C', 5, -2.5], ['H', 0, -4], ['O', 0, 4]],
    aceite: [['C', -5.5, 2], ['C', 0, -2], ['C', 5.5, 2]], SiO2: [['O', -6, 0], ['O', 6, 0], ['Si', 0, 0]],
    O2: [['O', -4, 0], ['O', 4, 0]], N2: [['N', -4, 0], ['N', 4, 0]], O3: [['O', -5, 2], ['O', 0, -2.5], ['O', 5, 2]],
    CO2: [['O', -6, 0], ['O', 6, 0], ['C', 0, 0]], Cu: [['Cu', 0, 0]], Sn: [['Sn', 0, 0]],
    // La sal disuelta (Gerson, 17 nov): sus iones se separan y quedan sueltos entre las moléculas de agua. En el cristal
    // y en el fondo sin disolver siguen juntos, como par NaCl.
    'Na+': [['Na', 0, 0]], 'Cl-': [['Cl', 0, 0]],
  };
  const NOM1 = { H2O: 'agua (H₂O)', NaCl: 'sal (NaCl)', 'Na+': 'ion sodio (Na⁺)', 'Cl-': 'ion cloruro (Cl⁻)', azucar: 'azúcar', aceite: 'aceite', SiO2: 'arena (SiO₂)', O2: 'oxígeno (O₂)',
    N2: 'nitrógeno (N₂)', O3: 'ozono (O₃)', CO2: 'dióxido de carbono (CO₂)', Cu: 'cobre (Cu)', Sn: 'estaño (Sn)' };
  // La fórmula que entiende el motor por cada especie dibujada (el aceite es una mezcla de grasas: va como una sustancia).
  // Los iones sueltos de la sal disuelta cuentan como NaCl, una vez por par (el Cl⁻ no se cuenta aparte).
  const FORMULA1 = { H2O: { formula: 'H2O' }, NaCl: { formula: 'NaCl' }, 'Na+': { formula: 'NaCl' }, azucar: { formula: 'C12H22O11' }, aceite: { formula: 'C18H34O2', sustancia: 'aceite' },
    SiO2: { formula: 'SiO2' }, O2: { formula: 'O2' }, N2: { formula: 'N2' }, O3: { formula: 'O3' }, CO2: { formula: 'CO2' }, Cu: { formula: 'Cu' }, Sn: { formula: 'Sn' } };
  const mesa1 = (recipientes, extra = {}) => ({ datos: Object.assign({ atomos: AT1, especies: ESP1, nombres: NOM1, clave: true, recipientes }, extra), estado: {} });
  // Las partículas de una lupa como las cuenta el motor: cada capa de la lupa es una fase.
  const listaDe = capas => capas.flatMap((c, k) => (c.particulas || []).filter(p => p.n > 0 && p.e !== 'Cl-').map(p => Object.assign({ n: p.n, fase: `fase ${k + 1}` }, FORMULA1[p.e])));
  // Lo disuelto, en la lupa: la sal como iones sueltos, Na⁺ y Cl⁻; lo demás, como su partícula.
  const disuelto = (e, n) => (e === 'NaCl' ? [{ e: 'Na+', n }, { e: 'Cl-', n }] : [{ e, n }]);
  // elemento | compuesto | homogenea | heterogenea, según el motor.
  const claseDe = capas => { const c = Motor.clasificarCaja(listaDe(capas)); return c.pura ? c.tipo : c.sistema === 'homogéneo' ? 'homogenea' : 'heterogenea'; };
  const dR = t => ({ v: 'c-f', t });

  // Los recipientes que se repiten: el agua destilada de referencia y el trío de «Lee» y «Mira».
  const AGUA9 = [{ particulas: [{ e: 'H2O', n: 8 }] }];
  const destilada = (lupa = true, desde = 0) => ({ tipo: 'vaso', titulo: 'Agua destilada', lupa: lupa ? { foco: 0.4, desde, capas: AGUA9 } : undefined });
  const conAzucar = (lupa = true, desde = 0) => ({ tipo: 'vaso', titulo: 'Agua con azúcar', lupa: lupa ? { foco: 0.4, desde, capas: [{ particulas: [{ e: 'H2O', n: 4 }, { e: 'azucar', n: 3 }] }] } : undefined });
  const conAceite = (lupa = true, desde = 0) => ({ tipo: 'vaso', titulo: 'Agua con aceite', capa: { alto: 0.22 },
    lupa: lupa ? { foco: 0.53, desde, capas: [{ alto: 0.42, particulas: [{ e: 'aceite', n: 2 }], orden: 'filas' }, { alto: 0.58, particulas: [{ e: 'H2O', n: 3 }] }] } : undefined });

  // ---- El juego: un vaso de agua destilada al lado de otro al que le echas algo y lo revuelves ----
  // Lo que se echa se disuelve en DISUELVE segundos de revolver (un modelo para jugar, no una medida): el montoncito del
  // fondo baja de N_SOL partículas a 0. Mientras quede algo sin disolver, el vaso tiene dos fases (el líquido y el sólido
  // del fondo); cuando ya no queda, una sola. El aceite y la arena no se disuelven por más que se revuelva.
  const DISUELVE = 20, N_SOL = 3;
  const ECHA = { azucar: { texto: 'Azúcar', e: 'azucar', nombre: 'el azúcar', disuelve: true }, sal: { texto: 'Sal', e: 'NaCl', nombre: 'la sal', disuelve: true },
    aceite: { texto: 'Aceite', e: 'aceite' }, arena: { texto: 'Arena', e: 'SiO2' }, nada: { texto: 'Nada' } };
  const quedan = t => Math.round(N_SOL * (1 - Math.min(1, Math.max(0, t) / DISUELVE)));
  function tuVaso(echa, t) {
    const x = ECHA[echa];
    if (x.disuelve) {
      const k = quedan(t);
      const capas = k > 0
        ? [{ alto: 0.6, particulas: [{ e: 'H2O', n: 4 }, ...disuelto(x.e, N_SOL - k)] }, { alto: 0.4, particulas: [{ e: x.e, n: k }], orden: 'filas' }]
        : [{ particulas: [{ e: 'H2O', n: 4 }, ...disuelto(x.e, N_SOL)] }];
      return { tipo: 'vaso', titulo: 'Tu vaso', fondo: { tipo: 'sal', cantidad: k / N_SOL }, lupa: { foco: 0.12, capas } };
    }
    if (echa === 'aceite') return Object.assign(conAceite(), { titulo: 'Tu vaso' });
    if (echa === 'arena') return { tipo: 'vaso', titulo: 'Tu vaso', fondo: { tipo: 'arena' }, lupa: { foco: 0.1, capas: [{ alto: 0.55, particulas: [{ e: 'H2O', n: 3 }] }, { alto: 0.45, particulas: [{ e: 'SiO2', n: 3 }], orden: 'filas' }] } };
    return { tipo: 'vaso', titulo: 'Tu vaso', lupa: { foco: 0.4, capas: AGUA9 } };
  }
  const juego1 = v => mesa1([destilada(), tuVaso(v.echa, v.t)]);
  const lectura1 = v => {
    const x = ECHA[v.echa];
    if (x.disuelve) {
      const k = quedan(v.t);
      if (k > 0) return [k === 1 ? 'Queda 1 partícula' : `Quedan ${k} partículas`, ` de ${x.texto.toLowerCase()} sin disolver en el fondo: 2 fases.`];
      return [x.e === 'NaCl' ? 'La sal se disolvió: iones sueltos entre el agua, 1 fase.' : `Ya no se ve ${x.nombre}: 2 clases de partícula, 1 fase.`];
    }
    if (v.echa === 'aceite') return ['El aceite no se mezcla: queda en su capa. 2 fases.'];
    if (v.echa === 'arena') return ['La arena no se disuelve: se asienta abajo. 2 fases.'];
    return ['Solo agua: 1 clase de partícula, como el agua destilada.'];
  };

  // ---- Definiciones que van en `datos` (contrato, punto 13: si el ejercicio practica elegir, van las definiciones
  // entre las que se elige; nunca la clase ya decidida) ----
  const DEF_LUPA = 'En la lupa, cada bolita es un átomo; los átomos pegados forman una partícula';
  const DEF_SM = 'Sustancia pura: una sola clase de partícula. Mezcla: varias clases';
  const DEF_EC = 'Elemento: átomos de una sola clase. Compuesto: átomos distintos unidos';
  const DEF_HH = 'Mezcla homogénea: una sola fase. Heterogénea: dos fases o más';
  const DEF_FASE = 'Fase: zona que se ve igual en todos sus puntos, con un borde';
  const DEF_COMP = 'Componente: cada sustancia distinta del sistema';
  const DEF_FORM = 'En una fórmula, cada símbolo es una clase de átomo: CO₂ tiene C y O';
  const NOMBRE_CLASE = { elemento: 'Un elemento', compuesto: 'Un compuesto', homogenea: 'Una mezcla homogénea', heterogenea: 'Una mezcla heterogénea' };
  const CORTO_CLASE = { elemento: 'un elemento', compuesto: 'un compuesto', homogenea: 'una mezcla homogénea', heterogenea: 'una mezcla heterogénea' };
  // Por qué no es la opción elegida (empieza por lo que el alumno vio bien) y el código del error.
  function siFueraClase(elegida, real) {
    const pura = x => x === 'elemento' || x === 'compuesto';
    if (pura(elegida) && pura(real)) return elegida === 'elemento'
      ? ['MA9', 'Hay una sola clase de partícula, bien. Sería elemento si sus átomos fueran todos de una clase.']
      : ['MA9', 'Hay una sola clase de partícula, bien. Sería compuesto si uniera átomos de elementos distintos.'];
    if (pura(elegida)) return [real === 'homogenea' ? 'MA10' : 'MA9', 'Cada partícula está bien mirada. Sería sustancia pura si todas fueran de una sola clase.'];
    if (pura(real)) return ['MA9', real === 'compuesto' ? 'Hay dos clases de átomo, bien visto. Sería mezcla si estuvieran sueltos; aquí van unidos.' : 'Viste partículas de varios átomos, bien. Pero todas son iguales: una sola clase.'];
    return elegida === 'homogenea'
      ? ['QM-HOMO', 'Son dos clases de partícula, bien. Sería homogénea si formaran una sola fase; hay un borde.']
      : ['QM-HETERO', 'Son dos clases, bien contadas. Sería heterogénea si formaran capas; aquí se reparten en una fase.'];
  }
  const opcionesClase = real => Object.keys(NOMBRE_CLASE).map(k => (k === real ? { id: 'c', texto: NOMBRE_CLASE[k], correcta: true }
    : (([error, siFuera]) => ({ id: k, texto: NOMBRE_CLASE[k], error, siFuera }))(siFueraClase(k, real))));

  // Tipo 0: una muestra vista con la lupa. La clase la decide el motor con las mismas capas que se dibujan.
  const LUPAS = [
    { tipo: 'vaso', capas: [{ particulas: [{ e: 'H2O', n: 8 }] }] },
    { tipo: 'frasco', capas: [{ particulas: [{ e: 'O2', n: 6 }] }] },
    { tipo: 'frasco', capas: [{ particulas: [{ e: 'N2', n: 6 }] }] },
    { tipo: 'frasco', capas: [{ particulas: [{ e: 'CO2', n: 5 }] }] },
    { tipo: 'frasco', capas: [{ particulas: [{ e: 'O3', n: 5 }] }] },
    { tipo: 'frasco', capas: [{ particulas: [{ e: 'N2', n: 5 }, { e: 'O2', n: 2 }] }] },
    { tipo: 'vaso', capas: [{ particulas: [{ e: 'H2O', n: 5 }, { e: 'azucar', n: 3 }] }] },
    { tipo: 'vaso', capas: [{ particulas: [{ e: 'H2O', n: 5 }, ...disuelto('NaCl', 3)] }] },
    { tipo: 'vaso', capa: { alto: 0.22 }, foco: 0.53, capas: [{ alto: 0.42, particulas: [{ e: 'aceite', n: 2 }], orden: 'filas' }, { alto: 0.58, particulas: [{ e: 'H2O', n: 3 }] }] },
    { tipo: 'vaso', fondo: { tipo: 'arena' }, foco: 0.1, capas: [{ alto: 0.55, particulas: [{ e: 'H2O', n: 3 }] }, { alto: 0.45, particulas: [{ e: 'SiO2', n: 3 }], orden: 'filas' }] },
  ];
  const muestraLupa = m => mesa1([{ tipo: m.tipo, titulo: 'Muestra', capa: m.capa, fondo: m.fondo, lupa: { foco: m.foco === undefined ? 0.4 : m.foco, capas: m.capas } }]);
  const PORQUE_CLASE = {
    elemento: 'Una sola clase de partícula, y todos sus átomos son de la misma clase.',
    compuesto: 'Una sola clase de partícula, y cada una une átomos de elementos distintos.',
    homogenea: 'Dos clases de partícula repartidas en una sola fase, sin bordes.',
    heterogenea: 'Dos clases de partícula, cada una en su zona: hay un borde, dos fases.',
  };
  // Con sal disuelta, la lupa tiene agua y dos clases de ion: el porqué lo dice (sigue siendo una mezcla de una fase).
  const porqueClase = (real, m) => (real === 'homogenea' && m.capas.some(c => (c.particulas || []).some(p => p.e === 'Na+'))
    ? 'Agua e iones de la sal, Na⁺ y Cl⁻, repartidos en una sola fase, sin bordes.' : PORQUE_CLASE[real]);

  // Tipo 1: un material de todos los días, con lo que tiene escrito en los datos. Lo clasifica Motor.material.
  const MATERIALES1 = [
    { nombre: 'el bronce de una campana', corto: 'El bronce', dato: 'Bronce: cobre y estaño fundidos juntos; se ve parejo', motor: 'bronce' },
    { nombre: 'el aire limpio y seco', corto: 'El aire seco', dato: 'Aire seco: nitrógeno (N₂), oxígeno (O₂) y otros gases, repartidos parejo', motor: 'aire' },
    { nombre: 'un diamante', corto: 'El diamante', dato: 'Diamante: solo átomos de carbono, unidos en una red', motor: 'diamante' },
    { nombre: 'la sal de mesa', corto: 'La sal de mesa', dato: 'Sal de mesa: cloruro de sodio, NaCl; un sodio por cada cloro', motor: 'sal de mesa (NaCl)' },
    { nombre: 'el ozono', corto: 'El ozono', dato: 'Ozono: moléculas O₃, de tres átomos de oxígeno', motor: 'ozono' },
    { nombre: 'un trozo de granito', corto: 'El granito', dato: 'Granito: roca con granos de cuarzo, feldespato y mica que se ven a simple vista', motor: 'granito' },
    { nombre: 'el agua de mar', corto: 'El agua de mar', dato: 'Agua de mar: agua con sales disueltas; se ve transparente', motor: 'agua de mar' },
    { nombre: 'una joya de oro de 24 quilates', corto: 'El oro de 24 quilates', dato: 'Oro de 24 quilates: solo átomos de oro', motor: 'oro de 24 quilates' },
    { nombre: 'el azúcar de la azucarera', corto: 'El azúcar', dato: 'Azúcar: moléculas C₁₂H₂₂O₁₁, todas iguales', motor: 'azúcar' },
    { nombre: 'una varilla de acero', corto: 'El acero', dato: 'Acero: hierro con un poco de carbono, fundidos juntos; se ve parejo', motor: 'acero' },
  ];
  const claseMaterial = m => { const c = Motor.material(m.motor); return c.pura ? c.tipo : c.sistema === 'homogéneo' ? 'homogenea' : 'heterogenea'; };

  // Tipo 2 (examen): fases y componentes de un vaso descrito con palabras. Cuenta Motor.contarSistema.
  const PARTES1 = {
    hielo: { nombre: 'cubitos de hielo', sustancia: 'H2O', formula: 'H2O', fase: 'hielo', estado: 's' },
    sal: { nombre: 'sal disuelta', sustancia: 'NaCl', formula: 'NaCl', fase: 'líquido', estado: 's', disuelto: true },
    azucar: { nombre: 'azúcar disuelto', sustancia: 'C12H22O11', formula: 'C12H22O11', fase: 'líquido', estado: 's', disuelto: true },
    aceite: { nombre: 'una capa de aceite', sustancia: 'aceite', fase: 'aceite', estado: 'l' },
    arena: { nombre: 'arena en el fondo', sustancia: 'SiO2', formula: 'SiO2', fase: 'arena', estado: 's' },
  };
  const AGUA_L = { nombre: 'agua', sustancia: 'H2O', formula: 'H2O', fase: 'líquido', estado: 'l' };
  // Combinaciones con hielo o algo disuelto (así siempre hay una trampa que contar) y con tres partes o más.
  const SISTEMAS = [];
  for (const hielo of [0, 1]) for (const dis of [null, 'sal', 'azucar']) for (const aceite of [0, 1]) for (const arena of [0, 1]) {
    const ps = [hielo && 'hielo', dis, aceite && 'aceite', arena && 'arena'].filter(Boolean);
    if ((hielo || dis) && ps.length >= 2) SISTEMAS.push(ps);
  }
  const listaPalabras = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  function sistema(ps) {
    const partes = [AGUA_L, ...ps.map(p => PARTES1[p])], c = Motor.contarSistema(partes);
    const vaso = { tipo: 'vaso', titulo: 'El vaso', capa: ps.includes('aceite') ? { alto: 0.2 } : undefined,
      fondo: ps.includes('arena') ? { tipo: 'arena' } : undefined, cubitos: ps.includes('hielo') ? 2 : 0 };
    const datos = [DEF_FASE, DEF_COMP];
    if (ps.includes('hielo')) datos.push('Hielo: agua en estado sólido, H₂O');
    return { partes, c, vaso, datos, texto: listaPalabras(partes.map(p => p.nombre)) };
  }
  const fc = (F, C) => `${F} ${F === 1 ? 'fase' : 'fases'} y ${C} ${C === 1 ? 'componente' : 'componentes'}`;
  function opcionesSistema(S) {
    const F = S.c.nFases, C = S.c.nComponentes, ds = [];
    if (S.partes.some(p => p.disuelto)) ds.push({ id: 'disuelto', F: S.c.errores.disueltoEsFase, C, error: 'QM-FASE-DISUELTO', siFuera: 'Contaste bien los componentes. Lo disuelto no forma otra fase: queda repartido dentro del agua.' });
    if (S.partes.some(p => p.nombre === 'cubitos de hielo')) ds.push({ id: 'hielo', F, C: S.c.errores.hieloOtroComponente, error: 'MA9', siFuera: 'Las fases están bien contadas. El hielo es agua: el mismo componente, en otra fase.' });
    ds.push({ id: 'cada', F: S.c.errores.cadaCosaUnaFase, C, error: 'QM-CADA-COSA', siFuera: 'Los componentes están bien. Una fase no es cada cosa nombrada: es cada zona con borde.' });
    ds.push({ id: 'reves', F: C, C: F, error: 'QM-INVIERTE', siFuera: 'Contaste los dos números, pero al revés: fases son zonas; componentes, sustancias.' });
    const ops = [{ id: 'c', texto: fc(F, C), correcta: true }], vistos = new Set([fc(F, C)]);
    for (const d of ds) { const t = fc(d.F, d.C); if (vistos.has(t)) continue; vistos.add(t); ops.push({ id: d.id, texto: t, error: d.error, siFuera: d.siFuera }); }
    return ops.slice(0, 4);
  }

  // Tipo 3 (examen): entre cuatro materiales, el único que es mezcla (o el único que es sustancia pura).
  const esPura = m => { const c = claseMaterial(m); return c === 'elemento' || c === 'compuesto'; };
  function cuatro(r, buscaMezcla) {
    const unos = MATERIALES1.filter(m => esPura(m) === buscaMezcla), otros = MATERIALES1.filter(m => esPura(m) !== buscaMezcla);   // unos: los distractores
    const bueno = r.de(otros), resto = [];
    while (resto.length < 3) { const m = r.de(unos); if (!resto.includes(m)) resto.push(m); }
    const todos = [bueno, ...resto].sort((a, b) => MATERIALES1.indexOf(a) - MATERIALES1.indexOf(b));
    return { bueno, resto, todos };
  }

  // Tipo 4 (examen, como San Marcos 2019-I): de qué sustancias está hecha una mezcla. Lo decide Motor.especie.
  const MEZCLAS1 = [
    { nombre: 'el aire húmedo', dato: 'Aire húmedo: N₂, O₂, CO₂ y vapor de agua (H₂O), repartidos parejo', formulas: ['N2', 'O2', 'CO2', 'H2O'] },
    { nombre: 'el agua de una pecera', dato: 'Agua de pecera: agua (H₂O) con oxígeno (O₂) disuelto', formulas: ['H2O', 'O2'] },
    { nombre: 'el gas de un encendedor', dato: 'Gas de encendedor: butano (C₄H₁₀) y propano (C₃H₈) mezclados', formulas: ['C4H10', 'C3H8'] },
    { nombre: 'el agua con gas', dato: 'Agua con gas: agua (H₂O) con dióxido de carbono (CO₂) disuelto', formulas: ['H2O', 'CO2'] },
    { nombre: 'el bronce', dato: 'Bronce: cobre (Cu) y estaño (Sn) fundidos juntos', formulas: ['Cu', 'Sn'] },
    { nombre: 'el acero', dato: 'Acero: hierro (Fe) con un poco de carbono (C), fundidos juntos', formulas: ['Fe', 'C'] },
    { nombre: 'el nitrox de un tanque de buceo', dato: 'Nitrox: gas para bucear, de nitrógeno (N₂) y oxígeno (O₂) mezclados', formulas: ['N2', 'O2'] },
  ];
  const FORMADA = { el: 'Una mezcla de elementos solamente', co: 'Una mezcla de compuestos solamente', am: 'Una mezcla de elementos y compuestos', uno: 'Un compuesto, porque tiene varios elementos' };
  const formadaDe = m => { const t = m.formulas.map(x => Motor.especie(x).tipo); return t.every(x => x === 'elemento') ? 'el' : t.every(x => x === 'compuesto') ? 'co' : 'am'; };
  const SI_FORMADA = {
    el: ['AQ-solo-elementos', 'Viste elementos en la lista, bien. Faltan los que unen átomos distintos: esos son compuestos.'],
    co: ['AQ-solo-compuestos', 'Viste compuestos en la lista, bien. Revisa las fórmulas de un solo símbolo: son elementos.'],
    am: ['AQ-elementos-y-compuestos', 'Revisaste cada fórmula, bien. Sería así si hubiera elementos y compuestos a la vez.'],
    uno: ['MA9', 'Tiene varios elementos, cierto. Pero están en sustancias distintas y sueltas: es una mezcla.'],
  };
  function porqueFormada(m) {
    const els = m.formulas.filter(x => Motor.especie(x).tipo === 'elemento'), cos = m.formulas.filter(x => Motor.especie(x).tipo !== 'elemento');
    const sub = x => x.replace(/\d+/g, d => [...d].map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join(''));
    const partes = [];
    if (els.length) partes.push(`${listaPalabras(els.map(sub))}: ${els.length === 1 ? 'elemento' : 'elementos'}`);
    if (cos.length) partes.push(`${listaPalabras(cos.map(sub))}: ${cos.length === 1 ? 'compuesto' : 'compuestos'}`);
    return partes.join('; ');
  }

  // Un caso de cada tipo. «Ahora tú» toma el índice de azar(s); «Así se resuelve», otro distinto con la misma semilla.
  const TIPOS1 = 5;
  const idx = (s, n, otro) => { const a = Math.floor(azar(s)() * n); return otro ? (a + 1 + Math.floor(azar(s + 900)() * (n - 1))) % n : a; };

  function caso1(s, otro) {
    const tipo = s % TIPOS1;
    if (tipo === 0) {
      const m = LUPAS[idx(s, LUPAS.length, otro)], real = claseDe(m.capas);
      return { tipo, dibujo: muestraLupa(m), real, datos: [DEF_LUPA, DEF_SM, DEF_EC, DEF_HH],
        pregunta: 'Esta es la lupa de una muestra. ¿Cómo se clasifica?', opciones: opcionesClase(real), porque: porqueClase(real, m) };
    }
    if (tipo === 1) {
      const m = MATERIALES1[idx(s, MATERIALES1.length, otro)], real = claseMaterial(m);
      return { tipo, m, real, datos: [m.dato, DEF_SM, DEF_EC, DEF_HH], pregunta: `¿Cómo se clasifica ${m.nombre}?`, opciones: opcionesClase(real), porque: PORQUE_CLASE[real] };
    }
    if (tipo === 2) {
      const S = sistema(SISTEMAS[idx(s, SISTEMAS.length, otro)]);
      return { tipo, S, dibujo: mesa1([S.vaso], { clave: false }), datos: S.datos,
        pregunta: `Un vaso tiene ${S.texto}. ¿Cuántas fases y cuántos componentes tiene el sistema?`, opciones: opcionesSistema(S) };
    }
    if (tipo === 3) {
      const r = azar(s + (otro ? 900 : 0)), buscaMezcla = r() < 0.5, q = cuatro(r, buscaMezcla);
      const opciones = q.todos.map(m => (m === q.bueno ? { id: 'c', texto: m.corto, correcta: true }
        : { id: m.motor.replace(/[^a-z0-9]+/g, '-'), texto: m.corto, error: buscaMezcla ? 'MA9' : 'MA10',
          siFuera: `Revisaste su dato, bien. ${m.corto} tiene ${buscaMezcla ? 'una sola clase de partícula: es sustancia pura' : 'varias clases de partícula: es mezcla'}.` }));
      return { tipo, q, buscaMezcla, datos: [...q.todos.map(m => m.dato), DEF_SM],
        pregunta: buscaMezcla ? '¿Cuál de estos materiales es una mezcla?' : '¿Cuál de estos materiales es una sustancia pura?', opciones };
    }
    const m = MEZCLAS1[idx(s, MEZCLAS1.length, otro)], real = formadaDe(m);
    return { tipo, m, real, datos: [m.dato, DEF_SM, DEF_EC, DEF_FORM], pregunta: `¿Qué es ${m.nombre}?`,
      opciones: Object.keys(FORMADA).map(k => (k === real ? { id: 'c', texto: FORMADA[k], correcta: true } : { id: k, texto: FORMADA[k], error: SI_FORMADA[k][0], siFuera: SI_FORMADA[k][1] })) };
  }

  // Ejemplos resueltos de la idea 1 (pestaña «Ejemplos»): 5 por nivel. N1, un paso (contar clases o fases en la lupa);
  // N2, dos pasos (sustancia o mezcla y después de qué tipo; o elegir la rama por la tarea); N3, de examen (la lista de
  // San Marcos, fases y componentes con lo disuelto y los líquidos que se mezclan, O₃ contra O₂). Ninguno usa hielo: es
  // la predicción de la idea. La figura muestra la muestra o el vaso, nunca la clase.
  // Cuentas revisadas aparte (17 nov, script fuera del repo que no usa este archivo ni el motor): ejemplo 12, mezclas
  // aire y bronce, elementos O₃ y C, compuestos H₂O y NaCl → 2, 2 y 2; ejemplo 13, fases {aceite, agua con sal, arena} = 3
  // y componentes {agua, aceite, sal, arena} = 4; ejemplo 15, fases {aceite, agua con alcohol y sal} = 2 y componentes
  // {agua, alcohol, sal, aceite} = 4; ejemplo 11, cinco clases, elementos N₂, O₂, Ar y compuestos CO₂, H₂O.
  const vasoLupa = (titulo, capas, extra = {}) => Object.assign({ tipo: 'vaso', titulo, lupa: { foco: extra.foco === undefined ? 0.4 : extra.foco, capas } }, extra);
  const frascoLupa = (titulo, capas) => ({ tipo: 'frasco', titulo, lupa: { foco: 0.4, capas } });
  // El bronce como un sólido lleno: 17 de cobre y 4 de estaño repartidos por toda la lupa (en filas, para que no queden
  // huecos). Las celdas en filas son 3, 5, 5, 5 y 3: el estaño va en la 1.ª, la 8.ª, la 11.ª y la 20.ª (arriba a la
  // izquierda, a la derecha, al centro y abajo), no en una franja (lector en frío, 17 nov: «parece otra fase»).
  const BRONCE = [{ e: 'Sn', n: 1 }, { e: 'Cu', n: 6 }, { e: 'Sn', n: 1 }, { e: 'Cu', n: 2 }, { e: 'Sn', n: 1 }, { e: 'Cu', n: 8 }, { e: 'Sn', n: 1 }, { e: 'Cu', n: 1 }];
  const EJEMPLOS_SUSTANCIA = [
    { nivel: 1, titulo: 'Agua destilada de la farmacia',
      enunciado: 'En la farmacia venden agua destilada. La figura muestra su lupa. ¿Es una sustancia pura o una mezcla?',
      datos: [DEF_LUPA, DEF_SM],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([vasoLupa('Agua destilada', [{ particulas: [{ e: 'H2O', n: 9 }] }])])),
      solucion: [{ texto: ['En la lupa todas las partículas son iguales, H₂O: hay ', dR('una sola clase de partícula'), '.'] }],
      respuesta: [dR('Sustancia pura')] },
    { nivel: 1, titulo: 'Agua con azúcar',
      enunciado: 'Un vaso de agua con una cucharadita de azúcar bien disuelta se ve transparente, como el agua sola. Con su lupa, ¿es una sustancia pura o una mezcla?',
      datos: [DEF_LUPA, DEF_SM],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([vasoLupa('Agua con azúcar', [{ particulas: [{ e: 'H2O', n: 6 }, { e: 'azucar', n: 3 }] }])])),
      solucion: [{ texto: ['La lupa muestra dos clases de partícula: las de agua y las de azúcar. Que se vea transparente no cambia eso.'] }],
      respuesta: [dR('Mezcla')] },
    { nivel: 1, titulo: 'Un frasco de oxígeno',
      enunciado: 'Un frasco cerrado tiene oxígeno, O₂. Su lupa está en la figura. ¿Es un elemento o un compuesto?',
      datos: [DEF_LUPA, DEF_EC],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([frascoLupa('Oxígeno', [{ particulas: [{ e: 'O2', n: 7 }] }])])),
      solucion: [{ texto: ['Cada partícula tiene dos átomos, pero los dos son de oxígeno: ', dR('una sola clase de átomo'), '.'] }],
      respuesta: [dR('Elemento')] },
    { nivel: 1, titulo: 'El gas de un extintor',
      enunciado: 'Algunos extintores tienen dióxido de carbono, CO₂. La figura muestra la lupa de ese gas en un frasco. ¿Es un elemento o un compuesto?',
      datos: [DEF_LUPA, DEF_EC],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([frascoLupa('Dióxido de carbono', [{ particulas: [{ e: 'CO2', n: 6 }] }])])),
      solucion: [{ texto: ['Cada partícula une un átomo de carbono con dos de oxígeno: ', dR('dos clases de átomo unidas'), '.'] }],
      respuesta: [dR('Compuesto')] },
    { nivel: 1, titulo: 'Arena en un vaso',
      enunciado: 'Echas arena a un vaso de agua, revuelves y esperas un rato. ¿Cuántas fases ves en el vaso?',
      datos: [DEF_FASE],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([{ tipo: 'vaso', titulo: 'Agua con arena', fondo: { tipo: 'arena' } }], { clave: false })),
      solucion: [{ texto: ['Hay dos zonas con un borde entre ellas: el agua arriba y la arena asentada en el fondo.'] }],
      respuesta: [dR('2 fases')] },
    { nivel: 2, titulo: 'El agua de mar',
      enunciado: 'El agua de mar se ve transparente. Su lupa está en la figura. ¿Es una sustancia pura o una mezcla, y de qué tipo?',
      datos: [DEF_LUPA, DEF_SM, DEF_HH],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([vasoLupa('Agua de mar', [{ particulas: [{ e: 'H2O', n: 6 }, ...disuelto('NaCl', 3)] }])])),
      solucion: [
        { texto: ['Primero, las partículas: agua y los iones de la sal, Na⁺ y Cl⁻. Hay más de una clase: es una ', dR('mezcla'), '.'] },
        { texto: ['Después, las fases: todo está repartido en una sola zona, sin bordes. Una fase: ', dR('homogénea'), '.'] },
      ],
      respuesta: [dR('Mezcla homogénea')] },
    { nivel: 2, titulo: 'El aire de un frasco',
      enunciado: 'Un frasco tiene aire limpio y seco; su lupa muestra moléculas N₂ y O₂. ¿Cómo se clasifica el aire, y sus partículas son de elementos o de compuestos?',
      datos: [DEF_LUPA, DEF_SM, DEF_EC, DEF_HH],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([frascoLupa('Aire seco', [{ particulas: [{ e: 'N2', n: 6 }, { e: 'O2', n: 2 }] }])])),
      solucion: [
        { texto: ['Hay dos clases de partícula, N₂ y O₂, repartidas por todo el frasco sin capas: mezcla de una sola fase.'] },
        { texto: ['Cada clase tiene un solo tipo de átomo: el N₂ solo nitrógeno y el O₂ solo oxígeno. Las dos son elementos.'] },
      ],
      respuesta: [dR('Mezcla homogénea'), ' de dos elementos'] },
    { nivel: 2, titulo: 'Una campana de bronce',
      enunciado: 'El bronce de una campana se ve como un solo metal, parejo. La figura muestra la lupa de un trozo. ¿Es una sustancia pura o una mezcla, y de qué tipo?',
      datos: [DEF_LUPA, DEF_SM, DEF_HH, 'Bronce: cobre (Cu) y estaño (Sn) fundidos juntos'],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([{ tipo: 'trozo', titulo: 'Bronce', material: 'metal', lupa: { foco: 0.5, capas: [{ particulas: BRONCE, orden: 'filas' }] } }], { separacion: 17 })),
      solucion: [
        { texto: ['En la lupa hay átomos de dos clases, cobre y estaño, sueltos y no unidos: dos sustancias. Es una ', dR('mezcla'), '.'] },
        { texto: ['Se reparten parejo en todo el trozo: una sola fase. Una mezcla así de metales se llama aleación.'] },
      ],
      respuesta: [dR('Mezcla homogénea'), ' (una aleación)'] },
    { nivel: 2, titulo: 'Un cristal de sal',
      enunciado: 'Un cristal de sal de mesa es transparente y parejo. Su lupa está en la figura. ¿Es un elemento, un compuesto o una mezcla?',
      datos: [DEF_LUPA, DEF_SM, DEF_EC],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([{ tipo: 'trozo', titulo: 'Sal de mesa', material: 'cristal', lupa: { foco: 0.5, capas: [{ particulas: [{ e: 'NaCl', n: 12 }], orden: 'filas' }] } }])),
      solucion: [
        { texto: ['Todas las partículas son iguales: un sodio (Na⁺) junto a un cloro (Cl⁻), los dos con carga. Una sola clase: sustancia pura.'] },
        { texto: ['Cada partícula une átomos de dos elementos distintos: es un ', dR('compuesto'), '.'] },
      ],
      respuesta: [dR('Compuesto')] },
    { nivel: 2, titulo: 'La cafeína de una bebida',
      enunciado: 'Un laboratorio mide cuánta cafeína tiene una lata de bebida energética. La cafeína es un compuesto del carbono. ¿Qué rama de la química hace ese trabajo?',
      datos: ['Química orgánica: estudia los compuestos del carbono', 'Química analítica: averigua qué sustancias hay en una muestra y cuánto de cada una', 'Bioquímica: estudia las sustancias y las reacciones de los seres vivos'],
      solucion: [
        { texto: ['La rama se elige por la tarea, no por la sustancia. Aquí la tarea es medir cuánto hay de algo.'] },
        { texto: ['Que la cafeína sea un compuesto del carbono es la trampa: medir cuánto hay es trabajo de la ', dR('química analítica'), '.'] },
      ],
      respuesta: [dR('Química analítica')] },
    { nivel: 3, titulo: 'El aire que respiramos',
      enunciado: 'El aire húmedo tiene nitrógeno (N₂), oxígeno (O₂), argón (Ar), dióxido de carbono (CO₂) y vapor de agua (H₂O), repartidos parejo. ¿Cómo se clasifica y de qué sustancias está formado?',
      datos: [DEF_SM, DEF_EC, DEF_HH, DEF_FORM],
      solucion: [
        { texto: ['Cinco clases de partícula en una sola fase: es una mezcla homogénea.'] },
        { texto: ['N₂, O₂ y Ar tienen una sola clase de átomo: son elementos. CO₂ y H₂O unen átomos distintos: son compuestos.'] },
        { texto: ['Error típico: decir «solo elementos» porque el aire tiene nitrógeno y oxígeno, y olvidar el CO₂ y el agua.'] },
      ],
      respuesta: [dR('Mezcla homogénea'), ' de elementos y compuestos'] },
    { nivel: 3, titulo: 'Contar en una lista',
      enunciado: 'Clasifica el aire, el agua destilada, el ozono (O₃), el bronce, la sal de mesa (NaCl) y el diamante. ¿Cuántos son elementos, cuántos compuestos y cuántas mezclas?',
      datos: ['Aire: N₂, O₂ y otros gases', 'Agua destilada: solo H₂O', 'Bronce: cobre y estaño fundidos juntos', 'Diamante: solo átomos de carbono', DEF_SM, DEF_EC],
      solucion: [
        { texto: ['Mezclas, con varias clases de partícula: el aire y el bronce.'] },
        { texto: ['Elementos, con una sola clase de átomo: el ozono (solo O, aunque tenga tres átomos) y el diamante (solo C).'] },
        { texto: ['Compuestos, con átomos distintos unidos: el agua (H y O) y la sal (Na y Cl).'] },
      ],
      respuesta: [dR('2 elementos'), ', ', dR('2 compuestos'), ' y ', dR('2 mezclas')] },
    { nivel: 3, titulo: 'Un vaso con cuatro cosas',
      enunciado: 'Un vaso tiene agua, una capa de aceite encima, sal disuelta y arena en el fondo. ¿Cuántas fases y cuántos componentes tiene el sistema?',
      datos: [DEF_FASE, DEF_COMP],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([{ tipo: 'vaso', titulo: 'El vaso', capa: { alto: 0.2 }, fondo: { tipo: 'arena' } }], { clave: false })),
      solucion: [
        { texto: ['Fases, las zonas con borde: el aceite, el agua con la sal y la arena. Son ', dR('3'), '.'] },
        { texto: ['La sal disuelta no es otra fase: está repartida dentro del agua. Contarla aparte es el error típico.'] },
        { texto: ['Componentes, las sustancias: agua, aceite, sal y arena. Son ', dR('4'), '.'] },
      ],
      respuesta: [dR('3 fases y 4 componentes')] },
    // Nivel 3 de verdad (lector en frío, 17 nov: «la 03 es más fácil que la 02»): dos trampas a la vez, el subíndice y
    // «solo un elemento, entonces es un elemento». La clase la comprueba el motor (prueba de la unidad).
    { nivel: 3, titulo: 'Oxígeno con ozono',
      enunciado: 'Un frasco tiene oxígeno (O₂) y ozono (O₃) mezclados; su lupa está en la figura. Un alumno dice: «Es un elemento, porque solo tiene átomos de oxígeno». ¿Tiene razón? ¿Cómo se clasifica?',
      datos: [DEF_LUPA, DEF_SM, DEF_EC, DEF_HH],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([frascoLupa('Oxígeno y ozono', [{ particulas: [{ e: 'O2', n: 4 }, { e: 'O3', n: 3 }] }])])),
      solucion: [
        { texto: ['Primero, las clases de partícula: O₂ y O₃ son dos sustancias distintas. Con dos clases, es una mezcla, no una sustancia pura.'] },
        { texto: ['Las dos están repartidas por todo el frasco, sin capas: una sola fase. Es una ', dR('mezcla homogénea'), '.'] },
        { texto: ['Cada una sí es un elemento, porque solo tiene oxígeno. Error típico: mirar los átomos antes de contar las clases de partícula.'] },
      ],
      respuesta: [dR('No'), ': es una ', dR('mezcla homogénea'), ' de dos elementos'] },
    { nivel: 3, titulo: 'Dos líquidos que se mezclan',
      enunciado: 'Un vaso tiene agua, alcohol, sal disuelta y una capa de aceite encima. El alcohol se mezcla del todo con el agua. ¿Cuántas fases y cuántos componentes tiene?',
      datos: [DEF_FASE, DEF_COMP],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([{ tipo: 'vaso', titulo: 'El vaso', capa: { alto: 0.2 } }], { clave: false })),
      solucion: [
        { texto: ['El alcohol y la sal no forman capas: quedan dentro del agua, en una sola zona.'] },
        { texto: ['Fases: el aceite y el agua con el alcohol y la sal. Son ', dR('2'), '.'] },
        { texto: ['Componentes: agua, alcohol, sal y aceite. Son ', dR('4'), '.'] },
      ],
      respuesta: [dR('2 fases y 4 componentes')] },
  ];

  const sustancia = {
    id: 'sustancia-mezcla',
    titulo: '¿Sustancia pura o mezcla?',
    pregunta: '¿Cómo sabes si algo es puro o es una mezcla?',
    temas: ['Qué estudia la química', 'Sustancias y mezclas'],
    pieza: 'quim-vasos',
    actividad: 'Echar cosas a un vaso de agua y mirar con una lupa qué partículas hay.',
    aprendizaje: 'Para saber si algo es puro se cuentan las clases de partícula, no se mira el aspecto. Una mezcla de una sola fase es homogénea.',
    ejemplos: EJEMPLOS_SUSTANCIA,
    // Lee: qué estudia la química, sus ramas (decisiones, 17 nov), la lupa como modelo y qué es una fase. No dice qué es
    // una sustancia pura ni una mezcla (eso se descubre al jugar) ni nombra el hielo (es la predicción).
    lee: {
      tarjetas: [
        { titulo: '¿Qué estudia la química?', texto: 'La química estudia la materia: de qué está hecha, cómo cambia y cuánta energía gana o pierde al cambiar. Materia es todo lo que tiene masa y ocupa un lugar: el agua de estos vasos, el aire, tu chompa.',
          pieza: 'quim-vasos', dibujo: mesa1([destilada(false), conAzucar(false), conAceite(false)], { clave: false }) },
        { titulo: 'Las ramas de la química', texto: 'La química general estudia lo común a toda la materia; la inorgánica, los minerales, las sales y los metales; la orgánica, los compuestos del carbono; la bioquímica, los seres vivos; la analítica averigua qué hay y cuánto; la fisicoquímica, la energía de los cambios.' },
        { titulo: 'Una lupa imaginaria', texto: 'La materia está hecha de partículas diminutas, que no se ven. La lupa las dibuja como bolitas: es un modelo, no una foto. Cada bolita es un átomo, y su color y su relleno dicen de qué elemento es. Los átomos pegados forman una partícula.',
          pieza: 'quim-vasos', dibujo: mesa1([destilada()]) },
        { titulo: 'Qué mirar al jugar', texto: 'Una fase es una zona que se ve igual en todos sus puntos, con un borde que la separa de otra: el aceite forma una fase sobre el agua. Al jugar, mira el vaso por fuera y, en la lupa, cuántas clases de partícula hay.' },
      ],
    },
    juega: {
      pieza: 'quim-vasos',
      consigna: 'Endulzaste un vaso de agua destilada con una cucharadita de azúcar. Revuelve, prueba otras cosas y compara con el vaso de agua sola.',
      mision: {
        texto: 'Haz que tu vaso se vea igual que el agua destilada, pero que sea una mezcla.',
        // Lo decide el motor con las partículas de la lupa: mezcla (varias sustancias) en una sola fase.
        logrado: v => { const c = Motor.clasificarCaja(listaDe(tuVaso(v.echa, v.t).lupa.capas)); return !c.pura && c.sistema === 'homogéneo'; },
        bien: 'Listo: se ve igual que el agua destilada, pero la lupa muestra dos clases de partícula.',
      },
      voz: 'Mira el vaso por fuera y después la lupa. ¿Dicen lo mismo?',
      leyenda: [
        { s: 'O', t: 'oxígeno: bolita roja llena' },
        { s: 'H', t: 'hidrógeno: bolita turquesa hueca' },
        { s: 'C', t: 'carbono: bolita gris llena' },
        { s: 'Na⁺  Cl⁻', t: 'iones de la sal; disuelta, van sueltos' },
        { s: 'Si', t: 'silicio: con dos oxígenos forma la arena' },
        { s: '- - -', t: 'en la lupa, el borde entre dos fases' },
        { s: '▫▫▫', t: 'en el vaso, granitos todavía sin disolver' },
        { s: 'azúcar, aceite', t: 'moléculas grandes: la lupa las dibuja en corto' },
      ],
      controles: [
        { id: 'echa', etiqueta: 'Le echas al agua', opciones: Object.keys(ECHA).map(k => ({ valor: k, texto: ECHA[k].texto })) },
        { id: 't', etiqueta: 'Tiempo revolviendo', min: 0, max: 30, paso: 2, inicio: 0, unidad: 's', decimales: 0, auto: { velocidad: 3 } },
      ],
      dibujo: v => juego1(v),
      lectura: v => lectura1(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'En un vaso de agua flotan unos cubitos de hielo. Por fuera se ven dos partes. Con la lupa, ¿qué hay en el vaso?',
      datos: ['El agua se congela a 0 °C', 'Agua: partículas H₂O, de 1 oxígeno y 2 hidrógenos'],
      voz: 'Antes de mirar, decide qué esperas ver en la lupa.',
      pieza: 'quim-vasos',
      opciones: [
        { id: 'c', texto: 'Una sola sustancia, el agua, en dos fases', correcta: true },
        { id: 'vista', texto: 'Una mezcla, porque se ven dos partes', error: 'MA10', siFuera: 'Se ven dos partes, bien visto: son dos fases. Sería mezcla si hubiera dos clases de partícula.' },
        { id: 'dos', texto: 'Dos sustancias distintas: el hielo y el agua', error: 'MA9', siFuera: 'Hielo y agua se ven distintos, es cierto. Serían dos sustancias si sus partículas fueran distintas.' },
        { id: 'homo', texto: 'Una mezcla de una sola fase, porque todo es agua', error: 'QM-HOMO', siFuera: 'Todo es agua, eso sí. Pero el hielo forma otra zona con borde: son dos fases.' },
      ],
      dibujo: mesa1([{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 2, lupa: { vacia: true, foco: 0.74 } }]),
      revelar: mesa1([{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 2, lupa: { foco: 0.74, capas: [{ alto: 0.45, particulas: [{ e: 'H2O', n: 4 }], orden: 'filas' }, { alto: 0.55, particulas: [{ e: 'H2O', n: 4 }] }] } }]),
      coincide: 'Coincide: una sola clase de partícula, H₂O, en dos fases: hielo y agua líquida.',
      noCoincide: 'La lupa muestra una sola clase de partícula, H₂O, en dos fases: hielo arriba y agua abajo.',
    },
    mira: {
      pieza: 'quim-vasos',
      datos: mesa1([destilada(true, 1), conAzucar(true, 3), conAceite(true, 4)]).datos,
      voz: 'Comparemos los tres vasos: primero por fuera, después con la lupa.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Por fuera, el agua destilada y el agua con azúcar se ven iguales.' },
        { estado: { corte: 1 }, texto: 'Agua destilada: todas sus partículas son H₂O. Una sola clase: sustancia pura.', ecuacion: ['sustancia pura: 1 clase de partícula'] },
        { estado: { corte: 2 }, texto: 'Cada H₂O une átomos de dos elementos, oxígeno e hidrógeno: es un compuesto.', ecuacion: ['compuesto: átomos distintos unidos'] },
        { estado: { corte: 3 }, texto: 'Agua con azúcar: dos clases de partícula, repartidas en una sola fase.', ecuacion: ['mezcla homogénea: 1 fase'] },
        { estado: { corte: 4 }, texto: 'Agua con aceite: dos clases, cada una en su capa. Son dos fases.', ecuacion: ['mezcla heterogénea: 2 fases o más'] },
        { estado: { corte: 4 }, texto: 'El azúcar disuelto no forma otra fase: queda dentro del agua.', ecuacion: ['agua con azúcar: 2 componentes, 1 fase'] },
      ],
    },
    regla: {
      texto: 'Una sustancia pura tiene una sola clase de partícula; una mezcla tiene varias. Si sus átomos son de una clase, es elemento; si son distintos, compuesto.',
      ecuacion: ['homogénea: 1 fase', '   ·   ', 'heterogénea: 2 fases o más', '   ·   ', 'componentes: cuántas sustancias hay'],
      condicion: 'Se decide por las partículas, no por el aspecto. Lo disuelto no forma otra fase; el hielo es agua en otra fase.',
      voz: 'Primero cuenta clases de partícula; después, fases.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso1(s, true)).
    resuelve: {
      pieza: 'quim-vasos',
      generar(s) {
        const c = caso1(s, true);
        if (c.tipo === 0) return {
          enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden clasificar la muestra: elemento, compuesto, mezcla homogénea o mezcla heterogénea.' },
            { tipo: 'datos', texto: `En la lupa hay ${c.real === 'elemento' || c.real === 'compuesto' ? 'una sola clase de partícula' : c.porque.startsWith('Agua e iones') ? 'agua y los iones de la sal' : 'dos clases de partícula'}${c.real === 'heterogenea' ? ', separadas por un borde' : ''}.` },
            { tipo: 'regla', texto: 'Primero cuento clases de partícula: una es sustancia pura; varias, mezcla. Después miro los átomos de la sustancia, o las fases de la mezcla.' },
            { tipo: 'aplica', texto: c.porque, ecuacion: [dR(NOMBRE_CLASE[c.real])] },
            { tipo: 'sentido', texto: 'Comprobación: el aspecto no decidió nada; lo decidieron las partículas de la lupa.' },
          ],
          respuesta: NOMBRE_CLASE[c.real],
        };
        if (c.tipo === 1) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: `Piden clasificar ${c.m.nombre}.` },
            { tipo: 'datos', texto: `El dato dice qué tiene: ${c.m.dato.split(': ')[1]}.` },
            { tipo: 'regla', texto: 'Una clase de partícula es sustancia pura (elemento o compuesto); varias, mezcla (homogénea con una fase, heterogénea con más).' },
            { tipo: 'aplica', texto: `${c.porque} Por eso es ${CORTO_CLASE[c.real]}.`, ecuacion: [dR(NOMBRE_CLASE[c.real])] },
            { tipo: 'sentido', texto: c.real === 'homogenea' ? 'Comprobación: se ve parejo y aun así es mezcla; lo parejo dice homogénea, no pura.' : 'Comprobación: la clase sale de lo que tiene adentro, no de cómo se ve.' },
          ],
          respuesta: NOMBRE_CLASE[c.real],
        };
        if (c.tipo === 2) {
          const F = c.S.c.nFases, C = c.S.c.nComponentes;
          return {
            enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo,
            pasos: [
              { tipo: 'pide', texto: 'Piden dos números: las fases (zonas con borde) y los componentes (sustancias distintas).' },
              { tipo: 'datos', texto: `En el vaso hay ${c.S.texto}.` },
              { tipo: 'regla', texto: 'Lo disuelto queda dentro del líquido, en su misma fase. El hielo es agua: otra fase, pero el mismo componente.' },
              { tipo: 'aplica', texto: `Fases: ${listaPalabras(c.S.c.fases.map(x => ({ líquido: 'el líquido', hielo: 'el hielo', aceite: 'el aceite', arena: 'la arena' })[x]))}. Componentes: ${listaPalabras(c.S.c.componentes.map(x => ({ H2O: 'agua', NaCl: 'sal', C12H22O11: 'azúcar', aceite: 'aceite', SiO2: 'arena' })[x]))}.`, ecuacion: [dR(fc(F, C))] },
              { tipo: 'sentido', texto: 'Comprobación: cada fase es una zona que se ve con borde en la figura; lo disuelto no se ve.' },
            ],
            respuesta: fc(F, C),
          };
        }
        if (c.tipo === 3) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: `Piden el único material que es ${c.buscaMezcla ? 'mezcla' : 'sustancia pura'}.` },
            { tipo: 'datos', texto: 'Cada dato dice qué partículas tiene cada material.' },
            { tipo: 'regla', texto: 'Una sola clase de partícula es sustancia pura; varias clases, mezcla. Lo parejo a la vista no decide.' },
            { tipo: 'aplica', texto: `${c.q.bueno.corto} tiene ${c.buscaMezcla ? 'varias clases de partícula' : 'una sola clase de partícula'}; los otros tres, ${c.buscaMezcla ? 'una sola' : 'varias'}.`, ecuacion: [dR(c.q.bueno.corto)] },
            { tipo: 'sentido', texto: 'Comprobación: solo una opción cumple; si dos cumplieran, habría que revisar los datos.' },
          ],
          respuesta: c.q.bueno.corto,
        };
        return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden si las sustancias de la mezcla son elementos, compuestos o de las dos clases.' },
            { tipo: 'datos', texto: `La mezcla tiene ${c.m.formulas.length} sustancias; sus fórmulas están en el dato.` },
            { tipo: 'regla', texto: 'Una fórmula con un solo símbolo es un elemento; con dos símbolos o más, un compuesto.' },
            { tipo: 'aplica', texto: `${porqueFormada(c.m)}.`, ecuacion: [dR(FORMADA[c.real])] },
            { tipo: 'sentido', texto: 'Comprobación: el subíndice no cuenta. O₂ tiene dos átomos y sigue siendo un elemento.' },
          ],
          respuesta: FORMADA[c.real],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-vasos',
      voz: 'Primero cuenta clases de partícula; después, fases.',
      generar(s) {
        const c = caso1(s, false);
        let solucion;
        if (c.tipo === 0 || c.tipo === 1) solucion = { texto: c.porque, ecuacion: [dR(NOMBRE_CLASE[c.real])] };
        else if (c.tipo === 2) solucion = { texto: 'Fases: zonas con borde; lo disuelto no cuenta aparte. Componentes: sustancias; el hielo es agua.', ecuacion: [dR(fc(c.S.c.nFases, c.S.c.nComponentes))] };
        else if (c.tipo === 3) solucion = { texto: `${c.q.bueno.corto} es el único con ${c.buscaMezcla ? 'varias clases de partícula' : 'una sola clase de partícula'}.`, ecuacion: [dR(c.q.bueno.corto)] };
        else solucion = { texto: `${porqueFormada(c.m)}.`, ecuacion: [dR(FORMADA[c.real])] };
        return { pregunta: c.pregunta, datos: c.datos, dibujo: c.dibujo, opciones: c.opciones, solucion };
      },
    },
  };


  // ---------- Idea 2: lo que no cambia al partir (propiedades, densidad y separación de mezclas) ----------
  // Escrita el 17 nov contra el contrato (docs/etapa2/propuesta-quimica.md, idea 2, con docs/etapa2/decisiones.md: la
  // separación de mezclas va aquí). Primera pantalla: tres objetos dorados, una balanza de cocina y una probeta (pieza
  // quim-cocina, objetos de prueba). Un dibujo de variables, nunca de partículas: m naranja (c-o, primer dato), V turquesa
  // (c-i, segundo dato), ρ violeta (c-f, lo que más se pide). Cada magnitud conserva su color en toda la idea, también
  // cuando es la que se pide (corrección del 17 nov: «la misma magnitud con el mismo color de un ejemplo a otro»; el
  // resultado lleva el color de su magnitud, molde §3). La temperatura va en verde (c-d) en toda la unidad.
  // Cambia: el objeto y si se parte · Permanece: la balanza y la probeta, con el agua en 50 mL · Progresa: del objeto
  // grande que engaña al chico que es de oro, y de entero a la mitad · Se reserva: la temperatura de ebullición, que no
  // depende de cuánta agua hay (es la predicción) · Debe verse: masa y volumen se parten; los gramos de cada cm³, no.
  // Los objetos dorados: el de oro es el más chico (unos 19,3 g/cm³; un lingote de 100 g mide unos 5,2 cm³). El grande es
  // de latón (8,5 g/cm³) y la medalla, de bronce (8,9): valores de un modelo para jugar, sin dato del mundo que citar.
  // Códigos: Q4 (la temperatura de ebullición depende de la cantidad; Rodríguez y Díaz-Higson 2012, en
  // docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md), AT1/MA11 (lo que se mide depende de cuánto hay) y
  // las hipótesis nuevas QM-RHO-INVIERTE (V/m), QM-RHO-PRODUCTO (m·V), QM-PROBETA (dividir entre la lectura y no entre lo
  // que subió), QM-L-ML (no pasar los litros a mL), QM-TIEMPO-HIERVE, QM-FILTRA-DISUELTO, QM-DECANTA-MISCIBLE y
  // QM-METODO (un método que no separa esa mezcla).
  const vO = t => ({ v: 'c-o', t }), vI = t => ({ v: 'c-i', t }), vD = t => ({ v: 'c-d', t }), vH = t => ({ v: 'c-h', t });
  const mR = vO('m'), Vr = vI('V'), rho = dR('ρ');
  const coc = (objetos, extra = {}) => ({ datos: Object.assign({ objetos }, extra), estado: {} });
  const OBJ2 = {
    grande: { texto: 'Lingote grande', carga: 'lingote-grande', m: 170, V: 20 },
    medalla: { texto: 'Medalla', carga: 'medalla', m: 71.2, V: 8 },
    chico: { texto: 'Lingote chico', carga: 'lingote', m: 96.5, V: 5 },
  };
  const AGUA0 = 50;   // mL de agua en la probeta antes de meter el objeto
  const mideObj = (o, trozo) => { const k = trozo / 100; return { m: o.m * k, V: o.V * k }; };
  // Balanza y probeta con el mismo objeto: la masa en la pantalla y lo que sube el agua.
  const pesaYMide = (titulo, carga, m, V, o = {}) => [
    { tipo: 'balanza', titulo, carga, pantalla: `${f(m)} g`, color: 'o', rotulos: [{ texto: `m = ${f(m)} g`, color: 'o' }] },
    { tipo: 'probeta', titulo: o.tituloP || 'En la probeta', antes: o.antes || AGUA0, despues: (o.antes || AGUA0) + V, max: o.max || 100, carga, marcas: true,
      rotulos: o.sinV ? [] : [{ texto: o.vPide ? 'V = ?' : `V = ${f(V)} cm³`, color: o.vPide ? undefined : 'i' }] },
  ];
  const juego2 = v => { const o = OBJ2[v.cual], x = mideObj(o, v.trozo); return coc(pesaYMide(v.trozo < 100 ? `${o.texto}, el ${f(v.trozo, 0)} %` : o.texto, o.carga, x.m, x.V)); };
  const lectura2 = v => { const x = mideObj(OBJ2[v.cual], v.trozo); return [vO(`${f(x.m)} g`), ' en ', vI(`${f(x.V)} cm³`), ': ', dR(`${f(x.m / x.V)} g en cada cm³`), '.']; };

  // Definiciones y fórmulas que van en `datos` (contrato, punto 13).
  const DEF_RHO = ['Densidad: ', rho, ' = ', mR, ' / ', Vr];
  const DEF_ML = '1 mL = 1 cm³';
  const DEF_SUBE = 'El volumen de un objeto es lo que sube el agua al meterlo';
  const DEF_INT = 'Propiedad intensiva: no depende de cuánta muestra hay';
  const DEF_EXT = 'Propiedad extensiva: depende de cuánta muestra hay';
  const METODOS2 = {
    filtracion: { nombre: 'Filtración', dato: 'Filtración: un papel retiene el sólido sin disolver y deja pasar el líquido' },
    decantacion: { nombre: 'Decantación', dato: 'Decantación: se deja asentar y se vierte la capa de arriba, la menos densa' },
    destilacion: { nombre: 'Destilación', dato: 'Destilación: se hierve; el vapor del que hierve antes se enfría y se recoge aparte' },
    evaporacion: { nombre: 'Evaporación', dato: 'Evaporación: el líquido se va al aire y queda lo que estaba disuelto' },
    imantacion: { nombre: 'Imantación', dato: 'Imantación: un imán atrae al hierro y deja lo demás' },
  };
  // Tipo 0: densidad de un objeto (balanza y probeta).
  const OBJETOS2 = [
    { nombre: 'una piedra de río', titulo: 'Piedra', carga: 'piedra', m: 81, V: 30 },
    { nombre: 'un trozo de hierro', titulo: 'Hierro', carga: 'cubo', m: 158, V: 20 },
    { nombre: 'una moneda de plata', titulo: 'Moneda', carga: 'moneda', m: 31.5, V: 3 },
    { nombre: 'una pepita de oro', titulo: 'Pepita', carga: 'piedra', m: 38.6, V: 2 },
    { nombre: 'un trozo de aluminio', titulo: 'Aluminio', carga: 'cubo', m: 54, V: 20 },
    { nombre: 'una tuerca de cobre', titulo: 'Tuerca', carga: 'anillo', m: 44.5, V: 5 },
    { nombre: 'un trozo de vidrio', titulo: 'Vidrio', carga: 'piedra', m: 50, V: 20 },
  ];
  // Tipo 1: masa o volumen de un líquido, con su densidad de libro («unos»).
  const LIQUIDOS2 = [
    { nombre: 'aceite', rho: 0.92 }, { nombre: 'alcohol', rho: 0.79 }, { nombre: 'leche', rho: 1.03 }, { nombre: 'miel', rho: 1.4 },
  ];
  // Tipo 2: qué cambia al partir. Tipo 3: cuántas intensivas hay en una lista (como San Marcos). Las decide el motor.
  const MATERIAL2 = ['un trozo de cobre', 'un queso', 'una barra de chocolate', 'un trozo de hielo', 'una vela'];
  const EXT2 = ['masa', 'volumen', 'peso'], INT2 = ['densidad', 'temperatura de fusión', 'color', 'dureza', 'olor', 'brillo'];
  const LISTAS2 = [
    ['masa', 'densidad', 'color', 'volumen', 'temperatura de ebullición'],
    ['temperatura', 'peso', 'olor', 'calor absorbido', 'dureza'],
    ['volumen', 'temperatura de fusión', 'masa', 'viscosidad', 'brillo'],
    ['longitud', 'densidad', 'temperatura', 'sabor', 'masa'],
    ['peso', 'volumen', 'temperatura de ebullición', 'conductividad eléctrica', 'longitud'],
  ];
  // Tipo 4: el método para separar una mezcla (MotorMateria.metodoPara). En agua con arena sirven filtrar y decantar:
  // la pregunta pide uno y el otro no está entre las opciones; lo mismo con la sal (evaporar o destilar).
  const SEPARAR2 = [
    { mezcla: 'agua-arena', texto: 'separar la arena del agua de un balde', pide: 'filtracion', fuera: 'decantacion',
      vaso: { tipo: 'vaso', titulo: 'Agua con arena', fondo: { tipo: 'arena' } }, dato: 'La arena no se disuelve en el agua',
      si: { destilacion: 'Destilar separa por la ebullición, pero gasta mucho calor: la arena se retiene con un papel.', evaporacion: 'Evaporar te deja la arena, cierto, pero pierdes el agua. El papel la retiene y conserva ambas.', imantacion: 'Buscas una diferencia, bien. Pero la arena no la atrae un imán.' } },
    { mezcla: 'agua-aceite', texto: 'separar el aceite del agua de una olla', pide: 'decantacion',
      vaso: { tipo: 'vaso', titulo: 'Agua con aceite', capa: { alto: 0.22 } }, dato: 'El aceite no se mezcla con el agua y flota sobre ella',
      si: { filtracion: 'Filtrar retiene granos sólidos. Dos líquidos pasan juntos por el papel.', evaporacion: 'Evaporar se lleva el agua al aire: no la recuperas.', imantacion: 'Buscas una diferencia, bien. Pero ni el agua ni el aceite los atrae un imán.' } },
    { mezcla: 'agua-alcohol', texto: 'separar el alcohol del agua', pide: 'destilacion',
      vaso: { tipo: 'vaso', titulo: 'Agua con alcohol' }, dato: 'El alcohol se mezcla del todo con el agua; hierve a unos 78 °C y el agua a 100 °C',
      si: { decantacion: 'Decantar sirve con dos capas. Agua y alcohol forman una sola fase.', filtracion: 'Filtrar retiene granos sólidos. Los dos líquidos pasan juntos por el papel.', evaporacion: 'Evaporar se lleva los dos al aire: no queda nada que recoger.' } },
    { mezcla: 'hierro-azufre', texto: 'separar limaduras de hierro de azufre en polvo', pide: 'imantacion',
      vaso: { tipo: 'vaso', titulo: 'Hierro y azufre', nivel: 0, polvo: true }, dato: 'Hierro y azufre: dos polvos sólidos mezclados',
      si: { filtracion: 'Filtrar necesita un líquido que pase. Aquí los dos son polvos sólidos.', decantacion: 'Decantar necesita un líquido. Aquí los dos son polvos sólidos.', destilacion: 'Destilar necesita un líquido que hierva. Aquí no hay líquido.' } },
    { mezcla: 'agua-sal', texto: 'sacar la sal del agua de mar; el agua no importa', pide: 'evaporacion', fuera: 'destilacion',
      vaso: { tipo: 'vaso', titulo: 'Agua de mar' }, dato: 'La sal está disuelta en el agua: no se ve',
      si: { filtracion: 'Filtrar retiene un sólido sin disolver. La sal disuelta pasa por el papel.', decantacion: 'Decantar necesita dos capas. La sal disuelta forma una sola fase.', imantacion: 'Buscas una diferencia, bien. Pero un imán no atrae a la sal.' } },
    { mezcla: 'agua-sal', texto: 'recuperar el agua y también la sal de un agua salada', pide: 'destilacion', fuera: 'evaporacion',
      vaso: { tipo: 'vaso', titulo: 'Agua salada' }, dato: 'La sal está disuelta en el agua: no se ve',
      si: { filtracion: 'Filtrar retiene un sólido sin disolver. La sal disuelta pasa por el papel.', decantacion: 'Decantar necesita dos capas. La sal disuelta forma una sola fase.', imantacion: 'Buscas una diferencia, bien. Pero un imán no atrae a la sal.' } },
  ];
  const ERR_MET = { filtracion: 'QM-FILTRA-DISUELTO', decantacion: 'QM-DECANTA-MISCIBLE', destilacion: 'QM-METODO', evaporacion: 'QM-METODO', imantacion: 'QM-METODO' };
  const vaso2 = v => fig2([Object.assign({}, v)]);
  const fig2 = (objetos, extra) => Object.assign({ pieza: 'quim-cocina' }, coc(objetos, extra));
  const unos = x => `unos ${f(x)}`;
  const opcionesNum = (correcta, ds, fmt) => opciones(correcta, ds, fmt);

  function caso2(s, otro) {
    const tipo = s % 5, r = azar(s + (otro ? 900 : 0));
    if (tipo === 0) {
      const o = OBJETOS2[idx(s, OBJETOS2.length, otro)], rh = o.m / o.V, despues = AGUA0 + o.V;
      return { tipo, o, rh, despues, dibujo: coc(pesaYMide(o.titulo, o.carga, o.m, o.V, { sinV: true })),
        datos: [DEF_RHO, DEF_ML, DEF_SUBE],
        pregunta: ['La balanza marca ', vO(`${f(o.m)} g`), ` para ${o.nombre}. En la probeta, el agua sube de ${AGUA0} mL a ${f(despues)} mL. ¿Cuál es su densidad?`],
        opciones: opcionesNum(rh, [
          { id: 'inv', valor: o.V / o.m, error: 'QM-RHO-INVIERTE', siFuera: 'Usaste masa y volumen, bien. Pero va masa entre volumen, no al revés.' },
          { id: 'lect', valor: o.m / despues, error: 'QM-PROBETA', siFuera: 'Dividiste la masa, bien. El volumen es lo que subió el agua, no la lectura final.' },
          { id: 'prod', valor: o.m * o.V, error: 'QM-RHO-PRODUCTO', siFuera: 'Usaste masa y volumen, bien. Se dividen: gramos en cada cm³.' },
        ], x => `${f(x)} g/cm³`) };
    }
    if (tipo === 1) {
      const l = LIQUIDOS2[idx(s, LIQUIDOS2.length, otro)], litros = r.de([0.5, 1.5, 2, 2.5, 3]), mL = litros * 1000, masa = l.rho * mL;
      const pideM = (Math.floor(s / 5) + (otro ? 1 : 0)) % 2 === 0;
      const datos = [DEF_RHO, `${l.nombre[0].toUpperCase()}${l.nombre.slice(1)}: ${unos(l.rho)} g/mL`, '1 L = 1000 mL'];
      if (pideM) return { tipo, l, litros, mL, masa, pideM, datos,
        pregunta: ['¿Cuál es la masa de ', vI(`${f(litros)} L`), ` de ${l.nombre}?`],
        opciones: opcionesNum(masa, [
          { id: 'sinml', valor: l.rho * litros, error: 'QM-L-ML', siFuera: 'Multiplicaste densidad por volumen, bien. Faltó pasar los litros a mL.' },
          { id: 'div', valor: mL / l.rho, error: 'QM-RHO-INVIERTE', siFuera: 'Pasaste a mL, bien. La masa es densidad por volumen, no volumen entre densidad.' },
          { id: 'agua', valor: mL, error: 'QM-COMO-AGUA', siFuera: 'Así sería con agua, de 1 g/mL. Cada líquido tiene su densidad.' },
        ], x => `${f(x)} g`) };
      return { tipo, l, litros, mL, masa, pideM, datos,
        pregunta: ['¿Qué volumen ocupan ', vO(`${f(masa)} g`), ` de ${l.nombre}? Responde en mL.`],
        opciones: opcionesNum(mL, [
          { id: 'mult', valor: masa * l.rho, error: 'QM-RHO-PRODUCTO', siFuera: 'Usaste la masa y la densidad, bien. Se divide la masa entre la densidad.' },
          { id: 'agua', valor: masa, error: 'QM-COMO-AGUA', siFuera: 'Así sería con agua, de 1 g/mL. Cada líquido tiene su densidad.' },
          { id: 'litros', valor: masa / l.rho / 1000, error: 'QM-L-ML', siFuera: 'La división está bien, pero eso son litros. Piden mililitros.' },
        ], x => `${f(x)} mL`) };
    }
    if (tipo === 2) {
      const mat = MATERIAL2[idx(s, MATERIAL2.length, otro)], pideExt = r() < 0.5;
      const buenas = pideExt ? EXT2 : INT2, malas = pideExt ? INT2 : EXT2.concat(['longitud']);
      const buena = r.de(buenas), otras = [];
      while (otras.length < 3) { const x = r.de(malas); if (!otras.includes(x)) otras.push(x); }
      const lista = [buena, ...otras].sort();
      const may = x => x[0].toUpperCase() + x.slice(1);
      return { tipo, mat, pideExt, buena, datos: [DEF_INT, DEF_EXT],
        pregunta: pideExt ? `Partes ${mat} en dos pedazos iguales. ¿Qué propiedad de cada pedazo es la mitad de la del entero?`
          : `Partes ${mat} en dos pedazos iguales. ¿Qué propiedad de cada pedazo es igual a la del entero?`,
        opciones: lista.map(x => (x === buena ? { id: 'c', texto: may(x), correcta: true }
          : { id: x.replace(/\s+/g, '-'), texto: may(x), error: 'AT1',
            siFuera: Motor.propiedad(x).tipo === 'intensiva' ? `Buscaste algo que se mide, bien. Pero ${x === 'densidad' ? 'la densidad' : x === 'dureza' ? 'la dureza' : `el ${x}`} no depende de cuánto hay.`
              : `Se mide, bien. Pero ${x === 'masa' ? 'la masa' : `el ${x}`} depende de cuánto hay: se parte con el trozo.` })) };
    }
    if (tipo === 3) {
      const lista = LISTAS2[idx(s, LISTAS2.length, otro)], c = Motor.clasificarPropiedades(lista);
      return { tipo, lista, c, datos: [DEF_INT, DEF_EXT],
        pregunta: `De esta lista, ¿cuántas son propiedades intensivas? ${listaPalabras(lista)}.`,
        opciones: opcionesNum(c.nIntensivas, [
          { id: 'medible', valor: lista.length - c.errores.medibleEsExtensiva, error: 'AT1', siFuera: 'Viste las que dependen de la cantidad. Medirse con un número no la vuelve extensiva.' },
          { id: 'temp', valor: lista.length - c.errores.temperaturaExtensiva, error: 'Q4', siFuera: 'Casi todas bien. Las temperaturas no se suman al juntar dos muestras: son intensivas.' },
          { id: 'mas', valor: c.nIntensivas + 1, error: 'AT1', siFuera: 'Contaste las intensivas, bien. Revisa cuál de ellas crece si hay más muestra.' },
          { id: 'menos', valor: c.nIntensivas - 1, error: 'AT1', siFuera: 'Contaste las intensivas, bien. Revisa cuál de ellas no cambia si hay más muestra.' },
        ], x => String(x)) };
    }
    const q = SEPARAR2[idx(s, SEPARAR2.length, otro)], ad = Motor.metodoPara(q.mezcla).adecuados;
    const metodos = Object.keys(METODOS2).filter(k => k !== q.fuera), malos = metodos.filter(k => k !== q.pide && q.si[k]).slice(0, 3);
    return { tipo, q, ad, dibujo: coc([q.vaso]), datos: [q.dato, ...metodos.map(k => METODOS2[k].dato)].slice(0, 6),
      pregunta: `Quieres ${q.texto}. ¿Qué método usas?`,
      opciones: [{ id: 'c', texto: METODOS2[q.pide].nombre, correcta: true }, ...malos.map(k => ({ id: k, texto: METODOS2[k].nombre, error: ERR_MET[k], siFuera: q.si[k] }))] };
  }
  const ARGUMENTO_SEP = {
    filtracion: 'La arena es un sólido sin disolver: el papel la retiene y el agua pasa.',
    decantacion: 'El aceite no se mezcla y es menos denso: queda arriba y se vierte aparte.',
    destilacion: 'Lo que difiere es la temperatura de ebullición: el que hierve antes se va como vapor y se recoge.',
    evaporacion: 'Basta con que el agua se vaya al aire: la sal disuelta queda en el fondo.',
    imantacion: 'Solo el hierro es atraído por un imán: el azufre se queda.',
  };

  // Ejemplos resueltos de la idea 2 (pestaña «Ejemplos»): 5 por nivel. N1, un paso (ρ = m/V, leer la probeta, intensiva o
  // extensiva, un método); N2, dos pasos (litros a mL, despejar, identificar el metal, contar intensivas); N3, de examen
  // (la corona, dos métodos en orden, kg y cm³ mezclados, las tres partes del hierro, método y propiedad a la vez).
  // La figura muestra el planteamiento: lo pedido va con «?» y en tinta.
  // Cuentas revisadas aparte (17 nov, script fuera del repo, cuentas-materia.py, que no usa este
  // archivo): 96,5/5 = 19,3; 62 − 50 = 12; 2·1000·0,92 = 1840; 55 − 50 = 5 y 44,5/5 = 8,9; 395/0,79 = 500; 3 de 5
  // intensivas; 90 − 50 = 40 y 579/40 = 14,475 ≈ 14,5 < 19,3; 10³ = 1000 y 2700/1000 = 2,7; 237/3 = 79, 237/30 = 7,9
  // y 79/10 = 7,9.
  // Correcciones del 17 nov (lector en frío), rehechas con otro script fuera del repo (cuentas-corr.py, sin este archivo):
  // todas las respuestas que cambiaron de forma o de color dan lo mismo; ver rutinas/frio/quimica.materia-y-energia.md.
  const EJEMPLOS_PROPIEDADES = [
    { nivel: 1, titulo: 'Un lingote chico',
      enunciado: ['Un lingote dorado tiene una masa de ', vO('96,5 g'), ' y un volumen de ', vI('5 cm³'), '. ¿Cuál es su densidad?'],
      datos: [DEF_RHO],
      figura: fig2([{ tipo: 'balanza', titulo: 'Lingote', carga: 'lingote', pantalla: '96,5 g', color: 'o', rotulos: [{ texto: 'ρ = ?' }] }]),
      solucion: [{ texto: ['Se divide la masa entre el volumen: cuántos gramos hay en cada cm³.'], ecuacion: [rho, ' = ', { frac: [vO('96,5 g'), vI('5 cm³')] }, ' = ', dR('19,3 g/cm³')] }],
      respuesta: [dR('19,3 g/cm³')] },
    { nivel: 1, titulo: 'Una piedra en la probeta',
      enunciado: ['El agua de una probeta marca ', vI('50 mL'), '. Al meter una piedra, sube a ', vI('62 mL'), '. ¿Cuál es el volumen de la piedra?'],
      datos: [DEF_SUBE, DEF_ML],
      figura: fig2([{ tipo: 'probeta', titulo: 'Con la piedra', antes: 50, despues: 62, carga: 'piedra', marcas: true, rotulos: [{ texto: 'V = ?' }] }]),
      solucion: [{ texto: ['La piedra ocupa lo que subió el agua.'], ecuacion: [vI('62 mL'), ' − ', vI('50 mL'), ' = ', vI('12 mL'), ' = ', vI('12 cm³')] }],
      respuesta: [vI('12 cm³')] },
    { nivel: 1, titulo: 'Un saco de papa',
      enunciado: 'En el mercado pesan un saco de papa. ¿Su masa es una propiedad intensiva o extensiva?',
      datos: [DEF_INT, DEF_EXT],
      solucion: [{ texto: ['Medio saco pesa la mitad, y dos sacos, el doble: la masa depende de cuánta papa hay. Es ', dR('extensiva'), '.'] }],
      respuesta: [dR('Extensiva')] },
    { nivel: 1, titulo: 'Arena en el agua',
      enunciado: 'Un balde tiene agua con arena que no se disuelve. ¿Con qué método separas la arena, sin perder el agua?',
      datos: [METODOS2.filtracion.dato, METODOS2.evaporacion.dato, METODOS2.destilacion.dato],
      figura: vaso2({ tipo: 'vaso', titulo: 'Agua con arena', fondo: { tipo: 'arena' } }),
      solucion: [{ texto: ['La arena es un sólido sin disolver: el papel la retiene y el agua pasa. Evaporar perdería el agua.'] }],
      respuesta: [dR('Filtración')] },
    { nivel: 1, titulo: 'Medio queso',
      enunciado: 'Partes un queso por la mitad. ¿Cambia la densidad de cada mitad?',
      datos: [DEF_RHO, DEF_INT],
      solucion: [{ texto: ['Cada mitad tiene la mitad de la masa y la mitad del volumen; la división da lo mismo. La densidad ', dR('no cambia'), '.'] }],
      respuesta: [dR('No'), ': es la misma'] },
    { nivel: 2, titulo: 'Una botella de aceite',
      enunciado: ['¿Cuál es la masa de una botella con ', vI('2 L'), ' de aceite?'],
      datos: [DEF_RHO, 'Aceite: unos 0,92 g/mL', '1 L = 1000 mL'],
      solucion: [
        { texto: ['Primero, el volumen en mL, porque la densidad está en g/mL.'], ecuacion: [vI('2 L'), ' = ', vI('2000 mL')] },
        { texto: ['Después, de ρ = m/V se despeja la masa: densidad por volumen.'], ecuacion: [mR, ' = ', dR('0,92 g/mL'), ' · ', vI('2000 mL'), ' = ', vO('1840 g')] },
      ],
      respuesta: [vO('1840 g'), ', unos 1,84 kg'] },
    { nivel: 2, titulo: '¿De qué metal es?',
      enunciado: ['Una tuerca tiene ', vO('44,5 g'), ' y en la probeta el agua sube de 50 mL a 55 mL. ¿De qué metal puede ser?'],
      datos: [DEF_RHO, DEF_SUBE, 'Unos: oro 19,3; plata 10,5; cobre 8,9; aluminio 2,7 (g/cm³)'],
      figura: fig2(pesaYMide('Tuerca', 'anillo', 44.5, 5, { vPide: true })),
      solucion: [
        { texto: ['El volumen es lo que subió el agua.'], ecuacion: [Vr, ' = 55 − 50 = ', vI('5 cm³')] },
        { texto: ['Su densidad se compara con la tabla.'], ecuacion: [rho, ' = ', { frac: [vO('44,5 g'), vI('5 cm³')] }, ' = ', dR('8,9 g/cm³'), ': cobre'] },
      ],
      respuesta: [dR('Cobre')] },
    { nivel: 2, titulo: 'Alcohol para el botiquín',
      enunciado: ['¿Qué volumen ocupan ', vO('395 g'), ' de alcohol?'],
      datos: [DEF_RHO, 'Alcohol: unos 0,79 g/mL'],
      solucion: [
        { texto: ['De ρ = m/V se despeja el volumen: la masa entre la densidad.'], ecuacion: [Vr, ' = ', { frac: [mR, rho] }] },
        { texto: ['Reemplazo; los gramos se van y quedan mL.'], ecuacion: [Vr, ' = ', { frac: [vO('395 g'), dR('0,79 g/mL')] }, ' = ', vI('500 mL')] },
      ],
      respuesta: [vI('500 mL')] },
    { nivel: 2, titulo: 'Cinco propiedades',
      enunciado: 'De esta lista, ¿cuántas son propiedades intensivas? Masa, densidad, color, volumen y temperatura de ebullición.',
      datos: [DEF_INT, DEF_EXT],
      solucion: [
        { texto: ['Dependen de cuánto hay: la masa y el volumen. Son extensivas.'] },
        { texto: ['No dependen: densidad, color y temperatura de ebullición. Medirse con un número no las vuelve extensivas.'] },
      ],
      respuesta: [dR('3'), ' intensivas'] },
    { nivel: 2, titulo: 'Sal y agua a la vez',
      enunciado: 'En un laboratorio quieren recuperar el agua y también la sal de un agua salada. ¿Qué método usan?',
      datos: [METODOS2.filtracion.dato, METODOS2.evaporacion.dato, METODOS2.destilacion.dato, 'La sal está disuelta en el agua: no se ve'],
      figura: vaso2({ tipo: 'vaso', titulo: 'Agua salada' }),
      solucion: [
        { texto: ['La sal disuelta pasa por un filtro, así que filtrar no sirve. Evaporar deja la sal, pero el agua se pierde en el aire.'] },
        { texto: ['Al destilar, el agua hierve, su vapor se enfría y se recoge aparte; la sal queda en el fondo.'] },
      ],
      respuesta: [dR('Destilación')] },
    { nivel: 3, titulo: 'La corona del rey',
      enunciado: ['Una corona dorada tiene ', vO('579 g'), '. En una probeta, el agua sube de 50 mL a 90 mL. ¿Es de oro puro?'],
      datos: [DEF_RHO, DEF_SUBE, DEF_ML, 'Oro: unos 19,3 g/cm³'],
      figura: fig2(pesaYMide('Corona', 'corona', 579, 40, { vPide: true })),
      solucion: [
        { texto: ['El volumen es lo que subió el agua, no la lectura final de 90 mL (error típico).'], ecuacion: [Vr, ' = 90 − 50 = ', vI('40 cm³')] },
        { texto: ['Su densidad:'], ecuacion: [rho, ' = ', { frac: [vO('579 g'), vI('40 cm³')] }, ' ≈ ', dR('14,5 g/cm³')] },
        { texto: ['Es menos que los 19,3 g/cm³ del oro: tiene otro metal, más liviano por cm³.'] },
      ],
      respuesta: [dR('No'), ': su densidad es unos 14,5 g/cm³'] },
    { nivel: 3, titulo: 'Agua, aceite y arena',
      enunciado: 'Un balde tiene agua, una capa de aceite encima y arena en el fondo. ¿Qué dos métodos usas, y en qué orden, para separar las tres cosas?',
      datos: [METODOS2.filtracion.dato, METODOS2.decantacion.dato, METODOS2.destilacion.dato],
      figura: vaso2({ tipo: 'vaso', titulo: 'El balde', capa: { alto: 0.2 }, fondo: { tipo: 'arena' } }),
      solucion: [
        { texto: ['Primero se filtra: el papel retiene la arena, y el agua con el aceite pasan juntos.'] },
        { texto: ['Después se decanta: el aceite, menos denso, queda arriba y se vierte aparte.'] },
        { texto: ['Cada método separa por una propiedad distinta: el tamaño del sólido y la densidad.'] },
      ],
      respuesta: [dR('Filtración'), ' y después ', dR('decantación')] },
    { nivel: 3, titulo: 'Un cubo de 10 cm',
      enunciado: ['Un cubo de metal de ', vI('10 cm'), ' de lado tiene una masa de ', vO('2,7 kg'), '. ¿Cuál es su densidad en g/cm³?'],
      datos: [DEF_RHO, 'Volumen de un cubo: lado × lado × lado', '1 kg = 1000 g'],
      figura: fig2([{ tipo: 'balanza', titulo: 'El cubo', carga: 'cubo', pantalla: '2,7 kg', color: 'o', rotulos: [{ texto: 'ρ = ?' }] }]),
      solucion: [
        { texto: ['El volumen del cubo y la masa en gramos, para que salga en g/cm³.'], ecuacion: [Vr, ' = 10 · 10 · 10 = ', vI('1000 cm³'), ';  ', mR, ' = ', vO('2700 g')] },
        { texto: ['Divido.'], ecuacion: [rho, ' = ', { frac: [vO('2700 g'), vI('1000 cm³')] }, ' = ', dR('2,7 g/cm³')] },
        { texto: ['Error típico: dividir 2,7 entre 1000 sin pasar los kg a g, y obtener 0,0027.'] },
      ],
      respuesta: [dR('2,7 g/cm³')] },
    { nivel: 3, titulo: 'Una barra en tres',
      enunciado: ['Una barra de hierro de ', vO('237 g'), ' ocupa ', vI('30 cm³'), '. Se corta en tres partes iguales. ¿Qué masa y qué densidad tiene cada parte?'],
      datos: [DEF_RHO, DEF_INT, DEF_EXT],
      figura: fig2([{ tipo: 'balanza', titulo: 'La barra entera', carga: 'lingote-grande', pantalla: '237 g', color: 'o', rotulos: [{ texto: 'V = 30 cm³', color: 'i' }] }]),
      solucion: [
        { texto: ['La masa y el volumen son extensivos: cada parte tiene un tercio.'], ecuacion: [mR, ' = 237 ÷ 3 = ', vO('79 g'), ';  ', Vr, ' = 30 ÷ 3 = ', vI('10 cm³')] },
        { texto: ['La densidad de cada parte:'], ecuacion: [rho, ' = ', { frac: [vO('79 g'), vI('10 cm³')] }, ' = ', dR('7,9 g/cm³')] },
        { texto: ['La de la barra entera da lo mismo, porque la densidad es intensiva.'], ecuacion: [rho, ' = ', { frac: [vO('237 g'), vI('30 cm³')] }, ' = ', dR('7,9 g/cm³')] },
      ],
      respuesta: [vO('79 g'), ' y ', dR('7,9 g/cm³')] },
    { nivel: 3, titulo: 'Alcohol y agua',
      enunciado: 'Un líquido es agua con alcohol, mezclados del todo. ¿Con qué método se separan, y qué propiedad hace posible separarlos?',
      datos: [METODOS2.decantacion.dato, METODOS2.destilacion.dato, METODOS2.filtracion.dato, 'Alcohol: hierve a unos 78 °C; agua, a 100 °C', 'Alcohol: unos 0,79 g/mL; agua, 1 g/mL'],
      figura: vaso2({ tipo: 'vaso', titulo: 'Agua con alcohol' }),
      solucion: [
        { texto: ['Forman una sola fase: no hay capas que decantar ni sólido que filtrar, aunque sus densidades sean distintas.'] },
        { texto: ['Al calentar, el alcohol hierve primero, a unos 78 °C; su vapor se enfría y se recoge aparte.'] },
      ],
      respuesta: [dR('Destilación'), ', por la ', dR('temperatura de ebullición')] },
  ];

  const propiedades = {
    id: 'propiedades',
    titulo: 'Lo que no cambia al partir',
    pregunta: '¿Qué propiedades de una muestra no cambian al partirla?',
    temas: ['Propiedades físicas y químicas'],
    pieza: 'quim-cocina',
    actividad: 'Pesar tres objetos dorados, medirlos en una probeta y partir el de oro.',
    aprendizaje: 'Al partir una muestra, masa y volumen se parten; densidad y temperatura de ebullición no. Esas reconocen la sustancia y separan mezclas.',
    ejemplos: EJEMPLOS_PROPIEDADES,
    // Lee: cómo se mide masa y volumen, qué es una propiedad y la densidad como gramos en cada cm³. No dice qué pasa al
    // partir ni nombra la temperatura de ebullición (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Pesar y medir', texto: 'La balanza mide la masa, m, en gramos. La probeta con agua mide el volumen, V: al meter un objeto, el agua sube justo lo que el objeto ocupa. Un mililitro (mL) es lo mismo que un centímetro cúbico (cm³).',
          pieza: 'quim-cocina', dibujo: coc(pesaYMide('Una piedra', 'piedra', 81, 30)) },
        { titulo: 'Propiedades', texto: 'Una propiedad es algo que se observa o se mide en una muestra: su masa, su color, su dureza. Una propiedad física se mide sin convertir la sustancia en otra. Algunas cambian si tienes más muestra; otras, no.' },
        { titulo: 'Gramos en cada cm³', texto: 'Para comparar objetos de distinto tamaño, se divide la masa entre el volumen: cuántos gramos hay en cada cm³. Esa cuenta es la densidad. El oro tiene unos 19,3 g en cada cm³.' },
        { titulo: 'Qué mirar', texto: 'En el juego, tres objetos dorados: solo uno es de oro. Pésalos, mídelos en la probeta y fíjate en qué cambia y qué no cuando pesas solo un trozo.' },
      ],
    },
    juega: {
      pieza: 'quim-cocina',
      consigna: 'Los tres objetos se ven dorados, pero solo uno es de oro, que tiene unos 19,3 g en cada cm³.',
      mision: {
        texto: 'Encuentra el objeto de oro y pártelo por la mitad. ¿Cambian sus gramos por cm³?',
        logrado: v => v.cual === 'chico' && v.trozo === 50,
        bien: 'Listo: la mitad pesa la mitad, pero sigue con 19,3 g en cada cm³.',
      },
      voz: 'El más grande no es el más pesado por cada cm³.',
      leyenda: [
        { s: mR, t: 'masa: lo que marca la balanza' },
        { s: Vr, t: 'volumen: lo que sube el agua' },
        { s: 'g', t: 'gramo, unidad de masa' },
        { s: 'mL', t: 'mililitro: 1 mL = 1 cm³' },
        { s: 'cm³', t: 'centímetro cúbico, unidad de volumen' },
        { s: '%', t: 'qué parte del objeto entero es el pedazo' },
      ],
      controles: [
        { id: 'cual', etiqueta: 'Objeto', opciones: Object.keys(OBJ2).map(k => ({ valor: k, texto: OBJ2[k].texto })) },
        { id: 'trozo', etiqueta: 'Pedazo que cortas y pesas', min: 25, max: 100, paso: 25, inicio: 100, unidad: '%', decimales: 0, auto: { velocidad: 15, modo: 'rebota' } },
      ],
      dibujo: v => juego2(v),
      lectura: v => lectura2(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'En una misma cocina de Juliaca hierven dos ollas destapadas: una con 1 L de agua y otra con 3 L. Las dos hierven hace rato. ¿Qué marcan sus termómetros?',
      voz: 'Antes de mirar, decide con lo que ya sabes del agua que hierve.',
      pieza: 'quim-cocina',
      opciones: [
        { id: 'c', texto: 'Lo mismo en las dos', correcta: true },
        { id: 'mas3', texto: 'Más la de 3 L, porque tiene más agua', error: 'Q4', siFuera: 'La de 3 L pidió más calor, cierto. Pero hervir no la deja más caliente.' },
        { id: 'mas1', texto: 'Más la de 1 L, porque se calienta más rápido', error: 'Q4', siFuera: 'La de 1 L llegó antes a hervir, cierto. Después, las dos quedan igual.' },
        { id: 'tiempo', texto: 'Depende de cuánto tiempo lleva hirviendo', error: 'QM-TIEMPO-HIERVE', siFuera: 'El tiempo importa antes de hervir. Mientras hierve, la temperatura ya no sube.' },
      ],
      dibujo: coc([
        { tipo: 'olla', titulo: '1 L de agua', tam: 0.75, nivel: 0.55, fuego: true, hierve: true, vapor: 1, termometro: '?' },
        { tipo: 'olla', titulo: '3 L de agua', tam: 1.1, nivel: 0.75, fuego: true, hierve: true, vapor: 1, termometro: '?' },
      ]),
      revelar: coc([
        { tipo: 'olla', titulo: '1 L de agua', tam: 0.75, nivel: 0.55, fuego: true, hierve: true, vapor: 1, termometro: '87 °C', colorT: 'd' },
        { tipo: 'olla', titulo: '3 L de agua', tam: 1.1, nivel: 0.75, fuego: true, hierve: true, vapor: 1, termometro: '87 °C', colorT: 'd' },
      ]),
      coincide: 'Coincide: las dos marcan unos 87 °C. Hervir no depende de cuánta agua hay.',
      noCoincide: 'Las dos marcan unos 87 °C: la temperatura de ebullición no depende de cuánta agua hay.',
    },
    mira: {
      pieza: 'quim-cocina',
      datos: coc([
        { tipo: 'olla', titulo: '1 L de agua', tam: 0.75, nivel: 0.55, fuego: true, hierve: true, vapor: 1, termometro: '87 °C', colorT: 'd',
          rotulos: [{ texto: 'm = 1000 g', color: 'o', desde: 2 }, { texto: 'ρ = 1 g/cm³', color: 'f', desde: 3 }] },
        { tipo: 'olla', titulo: '3 L de agua', tam: 1.1, nivel: 0.75, fuego: true, hierve: true, vapor: 1, termometro: '87 °C', colorT: 'd',
          rotulos: [{ texto: 'm = 3000 g', color: 'o', desde: 2 }, { texto: 'ρ = 1 g/cm³', color: 'f', desde: 3 }] },
      ]).datos,
      voz: 'Comparemos qué cambia entre las dos ollas y qué no.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las dos marcan unos 87 °C: no depende de cuánta agua hierve.', ecuacion: ['temperatura de ebullición: ', { llave: ['intensiva'], nota: 'no depende de cuánto hay' }] },
        // Por qué 87 °C y no 100 °C (lector en frío, 17 nov). Juliaca, a unos 3800 m de altura.
        { estado: { corte: 1 }, texto: 'Juliaca está a unos 3800 m: con menos aire encima, el agua hierve antes.', ecuacion: ['en Juliaca: unos ', vD('87 °C'), ';  al nivel del mar: ', vD('100 °C')] },
        { estado: { corte: 2 }, texto: 'La masa sí cambia: la olla grande tiene el triple.', ecuacion: [mR, ': 1000 g y 3000 g → extensiva'] },
        { estado: { corte: 3 }, texto: 'Gramos en cada cm³: en las dos ollas, lo mismo.', ecuacion: [rho, ' = ', { frac: [mR, Vr] }, ' = ', { frac: ['3000 g', '3000 cm³'] }, ' = 1 g/cm³'] },
        { estado: { corte: 3 }, texto: 'Las intensivas dicen qué sustancia es: 19,3 g/cm³ es oro.', ecuacion: ['oro: unos 19,3 g/cm³;  agua: 1 g/cm³'] },
        { estado: { corte: 3 }, texto: 'En una mezcla, cada componente conserva sus intensivas: por ellas se separa.', ecuacion: ['agua con alcohol: hierve primero el alcohol → destilación'] },
        { estado: { corte: 3 }, texto: 'Arena sin disolver: se filtra. Aceite: se decanta. Sal disuelta: se evapora el agua.' },
      ],
    },
    regla: {
      texto: 'Las propiedades intensivas, como la densidad y la temperatura de ebullición, no dependen de cuánto hay; las extensivas, como la masa y el volumen, sí.',
      ecuacion: [{ llave: [rho], nota: 'densidad', color: 'c-f' }, ' = ', { frac: [{ llave: [mR], nota: 'masa', color: 'c-o' }, { llave: [Vr], nota: 'volumen', color: 'c-i' }] }],
      condicion: 'Las intensivas reconocen una sustancia y separan mezclas: filtrar (sólido sin disolver), decantar (densidad), destilar (ebullición), imantar (hierro).',
      voz: 'Antes de calcular, pregunta si la propiedad depende de cuánto hay.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso2(s, true)).
    resuelve: {
      pieza: 'quim-cocina',
      generar(s) {
        const c = caso2(s, true);
        if (c.tipo === 0) return {
          enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo,
          pasos: [
            { tipo: 'pide', texto: ['Piden la densidad ', rho, ': cuántos gramos hay en cada cm³ del objeto.'] },
            { tipo: 'datos', texto: ['La masa, ', vO(`${f(c.o.m)} g`), '. El volumen es lo que subió el agua: ', `${f(c.despues)} − ${AGUA0} = `, vI(`${f(c.o.V)} cm³`), '.'] },
            { tipo: 'regla', texto: 'La densidad es la masa entre el volumen.', ecuacion: [rho, ' = ', { frac: [mR, Vr] }] },
            { tipo: 'cuentas', texto: 'Reemplazo los dos datos.', ecuacion: [rho, ' = ', { frac: [vO(`${f(c.o.m)} g`), vI(`${f(c.o.V)} cm³`)] }, ' = ', dR(`${f(c.rh)} g/cm³`)] },
            { tipo: 'sentido', texto: `Unidades: g entre cm³ da g/cm³. Y de vuelta: ${f(c.rh)} · ${f(c.o.V)} = ${f(c.o.m)} g, la masa de la balanza.` },
          ],
          respuesta: [dR(`${f(c.rh)} g/cm³`)],
        };
        if (c.tipo === 1) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: c.pideM ? ['Piden la masa ', mR, ` de ${f(c.litros)} L de ${c.l.nombre}.`] : ['Piden el volumen ', Vr, `, en mL, de ${f(c.masa)} g de ${c.l.nombre}.`] },
            { tipo: 'datos', texto: c.pideM ? [`La densidad, ${f(c.l.rho)} g/mL, está en mL: paso los litros a mL.`] : [`La densidad, ${f(c.l.rho)} g/mL, y la masa, ${f(c.masa)} g.`],
              ecuacion: c.pideM ? [vI(`${f(c.litros)} L`), ' = ', vI(`${f(c.mL)} mL`)] : undefined },
            { tipo: 'regla', texto: c.pideM ? 'De ρ = m/V despejo la masa: densidad por volumen.' : 'De ρ = m/V despejo el volumen: masa entre densidad.',
              ecuacion: c.pideM ? [mR, ' = ', rho, ' · ', Vr] : [Vr, ' = ', { frac: [mR, rho] }] },
            { tipo: 'cuentas', texto: 'Reemplazo.', ecuacion: c.pideM ? [mR, ' = ', dR(`${f(c.l.rho)} g/mL`), ' · ', vI(`${f(c.mL)} mL`), ' = ', vO(`${f(c.masa)} g`)]
              : [Vr, ' = ', { frac: [vO(`${f(c.masa)} g`), dR(`${f(c.l.rho)} g/mL`)] }, ' = ', vI(`${f(c.mL)} mL`)] },
            { tipo: 'sentido', texto: c.l.rho < 1 ? 'Es más liviano que el agua: la masa en g es menor que el volumen en mL.' : 'Es más denso que el agua: la masa en g es mayor que el volumen en mL.' },
          ],
          respuesta: c.pideM ? [vO(`${f(c.masa)} g`)] : [vI(`${f(c.mL)} mL`)],
        };
        if (c.tipo === 2) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: c.pideExt ? 'Piden la propiedad que se parte con el trozo.' : 'Piden la propiedad que no cambia al partir.' },
            { tipo: 'regla', texto: 'Las extensivas dependen de cuánta muestra hay y se parten; las intensivas, no.' },
            { tipo: 'aplica', texto: c.pideExt ? `${c.buena[0].toUpperCase() + c.buena.slice(1)} depende de cuánto hay: cada pedazo tiene la mitad. Las otras no cambian.` : `${c.buena[0].toUpperCase() + c.buena.slice(1)} no depende de cuánto hay: es igual en cada pedazo.`,
              ecuacion: [dR(c.buena[0].toUpperCase() + c.buena.slice(1))] },
            { tipo: 'sentido', texto: 'Comprobación: piensa en juntar dos pedazos. Lo extensivo se suma; lo intensivo queda igual.' },
          ],
          respuesta: [dR(c.buena[0].toUpperCase() + c.buena.slice(1))],
        };
        if (c.tipo === 3) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántas de la lista no dependen de cuánta muestra hay.' },
            { tipo: 'regla', texto: 'Pregunto por cada una: si tengo el doble de muestra, ¿también es el doble? Si sí, es extensiva.' },
            { tipo: 'aplica', texto: `Extensivas: ${listaPalabras(c.c.extensivas)}. Intensivas: ${listaPalabras(c.c.intensivas)}.`, ecuacion: [dR(`${c.c.nIntensivas} intensivas`)] },
            { tipo: 'sentido', texto: 'Comprobación: medir con un número no la vuelve extensiva; la temperatura se mide y es intensiva.' },
          ],
          respuesta: [dR(`${c.c.nIntensivas}`), ' intensivas'],
        };
        return {
          enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden el método que separa esta mezcla.' },
            { tipo: 'datos', texto: c.q.dato + '.' },
            { tipo: 'regla', texto: 'Se separa por una propiedad en que los componentes difieren: tamaño del sólido, densidad, ebullición o magnetismo.' },
            { tipo: 'aplica', texto: ARGUMENTO_SEP[c.q.pide], ecuacion: [dR(METODOS2[c.q.pide].nombre)] },
            { tipo: 'sentido', texto: 'Comprobación: los otros métodos dejan juntos los componentes o pierden uno de ellos.' },
          ],
          respuesta: [dR(METODOS2[c.q.pide].nombre)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-cocina',
      voz: 'Pregunta primero si depende de cuánto hay.',
      generar(s) {
        const c = caso2(s, false);
        let solucion;
        if (c.tipo === 0) solucion = { texto: 'El volumen es lo que subió el agua; se divide la masa entre ese volumen.', ecuacion: [rho, ' = ', { frac: [vO(`${f(c.o.m)} g`), vI(`${f(c.o.V)} cm³`)] }, ' = ', dR(`${f(c.rh)} g/cm³`)] };
        else if (c.tipo === 1) solucion = c.pideM ? { texto: 'Los litros a mL; después, densidad por volumen.', ecuacion: [mR, ` = ${f(c.l.rho)} · ${f(c.mL)} = `, vO(`${f(c.masa)} g`)] }
          : { texto: 'Masa entre densidad.', ecuacion: [Vr, ` = ${f(c.masa)} ÷ ${f(c.l.rho)} = `, vI(`${f(c.mL)} mL`)] };
        else if (c.tipo === 2) solucion = { texto: c.pideExt ? 'Lo extensivo se parte con el trozo; lo intensivo queda igual.' : 'Lo intensivo no depende de cuánto hay: queda igual.', ecuacion: [dR(c.buena[0].toUpperCase() + c.buena.slice(1))] };
        else if (c.tipo === 3) solucion = { texto: `Intensivas: ${listaPalabras(c.c.intensivas)}.`, ecuacion: [dR(`${c.c.nIntensivas}`)] };
        else solucion = { texto: ARGUMENTO_SEP[c.q.pide], ecuacion: [dR(METODOS2[c.q.pide].nombre)] };
        // El vaso del tipo 4 es de quim-vasos: la pieza va en el dibujo.
        return { pregunta: c.pregunta, datos: c.datos, dibujo: c.dibujo, opciones: c.opciones, solucion };
      },
    },
  };

  // ---------- Idea 3: ¿siguen siendo las mismas partículas? (cambio físico, químico o nuclear) ----------
  // Rehecha el 17 nov contra el contrato (docs/etapa2/propuesta-quimica.md, idea 3, con docs/etapa2/decisiones.md).
  // Primera pantalla: una cocina de Juliaca con seis cosas que cambian (quim-vasos: olla, porongo de chicha, ropa en el
  // cordel, clavo, hornilla y un hueso antiguo; objetos de prueba), cada una antes y después con su lupa.
  // Un dibujo de partículas, nunca de variables: átomos con la paleta de elementos (AT1). El clavo va sin el N₂ del aire
  // (N–Fe no se distinguen; Elementos.CERCANOS). Sin ecuaciones balanceadas: en «Mira» se cuentan los átomos en la lupa
  // (el balance es de quimica.reacciones-y-balance). Lo nuclear, un solo ejemplo: el carbono-14 de un hueso que pasa a
  // nitrógeno-14, sin partículas subatómicas (decisiones, 17 nov); la lupa del hueso muestra solo sus átomos de C-14 y no
  // dice cuánto tarda (eso es la idea 6, vida-media).
  // Cambia: el proceso · Permanece: antes a la izquierda, después a la derecha, con la misma lupa · Progresa: de cambiar
  // de estado a formar sustancias nuevas y, al final, a cambiar de elemento · Se reserva: las gotitas de la botella fría
  // (la predicción) y que los átomos de cada elemento se conservan (Mira) · Debe verse: si después hay las mismas
  // partículas.
  // El tipo de cambio lo decide el motor de la escena materia-energia (MotorMateria.cambio) con las mismas partículas que
  // dibuja la lupa (regla 1). En el gas de la cocina se dibuja el propano (C₃H₈) del balón; en la chicha, la glucosa
  // que fermenta (C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂).
  // Códigos: MA1 (un cambio de estado es químico; las gotitas salen del O₂ y el H₂ del aire: Salame y Casino 2021, ítem 3,
  // 32,8 % y 34,9 %), MA2 (el hierro sigue siendo hierro: el óxido sería físico), MA4/MA5 (la balanza en frasco abierto o
  // cerrado), y las hipótesis QM-ATRAVIESA, QM-FRIO-AGUA, QM-NUCLEAR, QM-CUENTA-O y QM-MASA-SE-VA.
  Object.assign(AT1, { Fe: { el: 'Fe', estilo: 'punto', r: 5 } });
  Object.assign(ESP1, {
    Fe: [['Fe', 0, 0]], Fe2O3: [['Fe', -5.4, -3.4], ['Fe', 5.4, -3.4], ['O', -7.6, 4.8], ['O', 0, 4.2], ['O', 7.6, 4.8]],
    // Toda molécula con fórmula a la vista lleva todos sus átomos (lector en frío, 17 nov: el propano salía con 2 H y
    // no con 8). El propano y el alcohol usan el hidrógeno chico (h) para caber en su celda: la prueba de la unidad
    // cuenta los átomos de cada especie contra su fórmula y mide que ninguna pise a sus vecinas.
    C3H8: [['C', -8, 1], ['C', 0, -3], ['C', 8, 1], ['h', -14, -3], ['h', -13, 6.5], ['h', -6, 7.5], ['h', -4, -8.5], ['h', 4, -8.5], ['h', 14, -3], ['h', 13, 6.5], ['h', 6, 7.5]],
    // La glucosa (24 átomos), como el azúcar y el aceite, es una molécula grande: la lupa la dibuja en corto y lo dice.
    glucosa: [['C', -5, -2.5], ['C', 5, -2.5], ['H', 0, -4], ['O', 0, 4]],
    alcohol: [['C', -8, 1], ['C', 0, -2], ['O', 8, 1], ['h', -14, -2.5], ['h', -12, 7], ['h', -5, 7.5], ['h', -3.5, -8.5], ['h', 3.5, -8.5], ['h', 13.5, 5]], H2: [['H', -3.8, 0], ['H', 3.8, 0]],
    NH3: [['N', 0, 0], ['H', -6, 4], ['H', 6, 4], ['H', 0, -6.5]], C: [['C', 0, 0]], N: [['N', 0, 0]],
  });
  Object.assign(NOM1, { Fe: 'hierro (Fe)', Fe2O3: 'óxido de hierro (Fe₂O₃)', C3H8: 'propano (C₃H₈)', glucosa: 'glucosa', alcohol: 'alcohol (C₂H₅OH)',
    H2: 'hidrógeno (H₂)', NH3: 'amoniaco (NH₃)', C: 'carbono-14', N: 'nitrógeno-14' });
  const FORM3 = { H2O: 'H2O', O2: 'O2', N2: 'N2', CO2: 'CO2', Fe: 'Fe', Fe2O3: 'Fe2O3', C3H8: 'C3H8', glucosa: 'C6H12O6', alcohol: 'C2H5OH', H2: 'H2',
    NH3: 'NH3', C: 'C', N: 'N', azucar: 'C12H22O11', NaCl: 'NaCl' };
  const SUBI = '₀₁₂₃₄₅₆₇₈₉';
  const fm = x => String(x).replace(/\d/g, c => SUBI[c]);
  const mesa3 = (recipientes, extra = {}) => ({ datos: Object.assign({ atomos: AT1, especies: ESP1, nombres: NOM1, clave: true, flechas: true, separacion: 26, recipientes }, extra), estado: {} });
  const L3 = (foco, capas) => ({ foco, capas });
  // Cada proceso: el objeto antes y después, con su lupa; `est` da el estado de cada capa para el motor.
  const PROC3 = {
    olla: { texto: 'La olla que hierve', tipoObj: 'olla',
      antes: { titulo: 'Antes: agua en la olla', fuego: true, lupa: L3(0.3, [{ particulas: [{ e: 'H2O', n: 6 }], est: 'l' }]) },
      despues: { titulo: 'Después: el vapor', fuego: true, hierve: true, vapor: 3, nivel: 0.45, lupa: L3(0.95, [{ particulas: [{ e: 'H2O', n: 3 }], est: 'g' }]) } },
    // Celdas de 28 en la chicha: el alcohol lleva sus 9 átomos y con 26 rozaba a sus vecinas (prueba de la unidad).
    chicha: { texto: 'La chicha que fermenta', tipoObj: 'jarra', sep: 28,
      antes: { titulo: 'Antes: chicha recién hecha', lupa: L3(0.4, [{ particulas: [{ e: 'H2O', n: 3 }, { e: 'glucosa', n: 1 }], est: 'l' }]) },
      despues: { titulo: 'Después: fermentó', espuma: true, lupa: L3(0.4, [{ particulas: [{ e: 'H2O', n: 3 }, { e: 'alcohol', n: 2 }, { e: 'CO2', n: 2 }], est: 'l' }]) } },
    ropa: { texto: 'La ropa que se seca', tipoObj: 'ropa',
      antes: { titulo: 'Antes: polo mojado', mojada: true, lupa: L3(0.55, [{ particulas: [{ e: 'H2O', n: 6 }], est: 'l' }]) },
      despues: { titulo: 'Después: seco', lupa: L3(0.95, [{ particulas: [{ e: 'H2O', n: 3 }], est: 'g' }]) } },
    clavo: { texto: 'El clavo que se oxida', tipoObj: 'clavo', sep: 24,
      antes: { titulo: 'Antes: clavo nuevo', lupa: L3(0.1, [{ alto: 0.5, particulas: [{ e: 'O2', n: 3 }], est: 'g' }, { alto: 0.5, particulas: [{ e: 'Fe', n: 4 }], orden: 'filas', est: 's' }]) },
      despues: { titulo: 'Después: oxidado', oxido: true, lupa: L3(0.1, [{ particulas: [{ e: 'Fe2O3', n: 2 }], est: 's' }]) } },
    gas: { texto: 'El gas de la hornilla', tipoObj: 'hornilla',
      antes: { titulo: 'Antes: sale el gas', lupa: L3(0.62, [{ particulas: [{ e: 'C3H8', n: 1 }, { e: 'O2', n: 5 }], est: 'g' }]) },
      despues: { titulo: 'Después: arde', llama: true, lupa: L3(0.62, [{ particulas: [{ e: 'CO2', n: 3 }, { e: 'H2O', n: 4 }], est: 'g' }]) } },
    hueso: { texto: 'Un hueso muy antiguo', tipoObj: 'hueso',
      antes: { titulo: 'Antes: carbono-14', lupa: L3(0.1, [{ particulas: [{ e: 'C', n: 7 }], orden: 'filas', est: 's' }]) },
      despues: { titulo: 'Miles de años después', lupa: L3(0.1, [{ particulas: [{ e: 'C', n: 4 }, { e: 'N', n: 3 }], orden: 'filas', est: 's' }]) } },
  };
  const motor3 = lupa => lupa.capas.flatMap(c => (c.particulas || []).filter(p => p.n > 0).map(p => ({ formula: FORM3[p.e], n: p.n, estado: c.est })));
  const cambio3 = k => Motor.cambio(motor3(PROC3[k].antes.lupa), motor3(PROC3[k].despues.lupa));
  // El tiempo que pasa: con menos de la mitad, el objeto de la derecha todavía está como antes (las mismas partículas).
  const YA = 50;
  const dib3 = (k, t = 100) => mesa3([Object.assign({ tipo: PROC3[k].tipoObj }, PROC3[k].antes),
    t >= YA ? Object.assign({ tipo: PROC3[k].tipoObj }, PROC3[k].despues) : Object.assign({ tipo: PROC3[k].tipoObj }, PROC3[k].antes, { titulo: 'Todavía no cambia' })],
  PROC3[k].sep ? { separacion: PROC3[k].sep } : {});
  const ESTADO = { s: 'sólido', l: 'líquido', g: 'gas' };
  const lectura3 = (k, t = 100) => {
    if (t < YA) return ['Todavía no pasa nada: a los dos lados, las mismas partículas.'];
    const c = cambio3(k);
    if (c.tipo === 'nuclear') return ['Después hay átomos de nitrógeno: otro elemento.'];
    if (c.tipo === 'químico') return [c.nuevas.length > 1 ? `Después aparecen ${listaPalabras(c.nuevas.map(fm))}, que antes no estaban.` : `Después aparece ${fm(c.nuevas[0])}, que antes no estaba.`];
    const e0 = PROC3[k].antes.lupa.capas[0].est, e1 = PROC3[k].despues.lupa.capas[0].est;
    // En el gas, las mismas moléculas quedan más separadas: en la lupa caben menos (lector en frío: «¿se perdieron?»).
    return [`Antes y después, ${fm(c.sustanciasAntes[0])}: de ${ESTADO[e0]} a ${ESTADO[e1]}${e1 === 'g' ? ', más separadas' : ''}.`];
  };

  // Datos (contrato, punto 13): las definiciones entre las que se elige.
  const DEF_FIS = 'Cambio físico: las mismas partículas cambian de estado, de forma o de lugar';
  const DEF_QUI = 'Cambio químico: aparecen sustancias nuevas, hechas con los mismos átomos';
  const DEF_NUC = 'Cambio nuclear: un átomo pasa a ser de otro elemento';
  const DEF_PF = 'Propiedad física: se mide sin transformar la sustancia en otra';
  const DEF_PQ = 'Propiedad química: solo se ve cuando la sustancia se transforma en otra';
  const NOM_T = { 'físico': 'Físico', 'químico': 'Químico', nuclear: 'Nuclear' };
  const SI_T = {
    'físico': ['MA2', 'Viste que algo cambió, bien. Sería físico si las partículas de después fueran las mismas.'],
    'químico': ['MA1', 'Algo cambió a la vista, cierto. Sería químico si aparecieran sustancias nuevas.'],
    nuclear: ['QM-NUCLEAR', 'Cambió algo, bien visto. Sería nuclear si un átomo pasara a ser de otro elemento.'],
  };
  const opcionesTipo = real => Object.keys(NOM_T).map(k => (k === real ? { id: 'c', texto: NOM_T[k], correcta: true }
    : { id: k === 'físico' ? 'fisico' : k === 'químico' ? 'quimico' : k, texto: NOM_T[k], error: SI_T[k][0], siFuera: SI_T[k][1] }));
  // Tipo 0: un fenómeno contado con palabras, con sus partículas para el motor.
  const FEN3 = [
    { texto: 'En una helada de Puno, se forma escarcha sobre el pasto', corto: 'Se forma escarcha en el pasto', a: [['H2O', 2, 'g']], d: [['H2O', 2, 's']], porque: 'El vapor de agua del aire pasa a sólido: siguen siendo moléculas de H₂O.' },
    { texto: 'Un clavo de hierro se oxida en el patio', corto: 'Un clavo se oxida', fen: 'oxidar-hierro', porque: 'El hierro y el oxígeno forman óxido de hierro, una sustancia que antes no estaba.' },
    { texto: 'La leña arde en el fogón', corto: 'La leña arde', a: [['C6H10O5', 1, 's'], ['O2', 6, 'g']], d: [['CO2', 6, 'g'], ['H2O', 5, 'g']], porque: 'La madera y el oxígeno forman dióxido de carbono y agua: sustancias nuevas.' },
    { texto: 'El azúcar se disuelve en el té', corto: 'El azúcar se disuelve en el té', fen: 'disolver-azucar', porque: 'Las moléculas de azúcar siguen enteras; solo se reparten entre las del agua.' },
    { texto: 'El alcohol de un algodón se evapora', corto: 'El alcohol se evapora', a: [['C2H5OH', 2, 'l']], d: [['C2H5OH', 2, 'g']], porque: 'Las moléculas de alcohol pasan de líquido a gas sin romperse.' },
    { texto: 'El carbono-14 de un hueso antiguo pasa a nitrógeno-14', corto: 'El carbono-14 pasa a nitrógeno-14', a: [['C', 3]], d: [['C', 2], ['N', 1]], porque: 'Un átomo de carbono pasa a ser de nitrógeno: cambia el elemento.' },
    { texto: 'El vinagre con bicarbonato hace burbujas', corto: 'El vinagre con bicarbonato burbujea', a: [['CH3COOH', 1, 'l'], ['NaHCO3', 1, 's']], d: [['CH3COONa', 1, 'disuelto'], ['H2O', 1, 'l'], ['CO2', 1, 'g']], porque: 'Se forma CO₂, un gas que antes no estaba: sustancias nuevas.' },
    { texto: 'Un vidrio se rompe en pedazos', corto: 'Un vidrio se rompe', a: [['SiO2', 4, 's']], d: [['SiO2', 4, 's']], porque: 'Los pedazos son del mismo vidrio: cambia la forma, no las partículas.' },
    { texto: 'El espejo del baño se empaña con la ducha', corto: 'El espejo se empaña', fen: 'condensar-vapor', porque: 'El vapor de agua se enfría en el espejo y pasa a líquido: sigue siendo H₂O.' },
    // (17 nov) Antes iba «el gas natural arde», que repetía el caso de Mira con otro nombre (lector en frío).
    { texto: 'La leche se agria en la mesa', corto: 'La leche se agria', a: [['C12H22O11', 1, 'disuelto'], ['H2O', 1, 'l']], d: [['C3H6O3', 4, 'disuelto']], porque: 'El azúcar de la leche pasa a ácido láctico, una sustancia que antes no estaba.' },
  ];
  const lista3 = xs => xs.map(([formula, n, estado]) => ({ formula, n, estado }));
  const tipoFen = x => (x.fen ? Motor.fenomeno(x.fen) : Motor.cambio(lista3(x.a), lista3(x.d))).tipo;
  // Tipo 1: dos lupas dibujadas, antes y después, en un frasco cerrado.
  const LUPAS3 = [
    { antes: [{ particulas: [{ e: 'H2', n: 4 }, { e: 'O2', n: 2 }] }], despues: [{ particulas: [{ e: 'H2O', n: 4 }] }], est: ['g', 'g'] },
    { antes: [{ particulas: [{ e: 'H2O', n: 6 }], orden: 'filas' }], despues: [{ particulas: [{ e: 'H2O', n: 6 }] }], est: ['s', 'l'] },
    { antes: [{ particulas: [{ e: 'N2', n: 1 }, { e: 'H2', n: 3 }] }], despues: [{ particulas: [{ e: 'NH3', n: 2 }] }], est: ['g', 'g'] },
    { antes: [{ particulas: [{ e: 'C', n: 6 }], orden: 'filas' }], despues: [{ particulas: [{ e: 'C', n: 4 }, { e: 'N', n: 2 }], orden: 'filas' }], est: ['s', 's'] },
    { antes: [{ particulas: [{ e: 'H2O', n: 5 }] }], despues: [{ particulas: [{ e: 'H2O', n: 3 }] }], est: ['l', 'g'] },
    { antes: [{ particulas: [{ e: 'C3H8', n: 1 }, { e: 'O2', n: 5 }] }], despues: [{ particulas: [{ e: 'CO2', n: 3 }, { e: 'H2O', n: 4 }] }], est: ['g', 'g'] },
  ];
  const lupaMotor = (capas, est) => capas.flatMap(c => c.particulas.map(p => ({ formula: FORM3[p.e], n: p.n, estado: est })));
  const tipoLupa = x => Motor.cambio(lupaMotor(x.antes, x.est[0]), lupaMotor(x.despues, x.est[1])).tipo;
  const dibLupas = (x, despuesVacia) => mesa3([{ tipo: 'frasco', titulo: 'Antes', lupa: L3(0.45, x.antes) },
    { tipo: 'frasco', titulo: 'Después', lupa: despuesVacia ? { vacia: true, foco: 0.45 } : L3(0.45, x.despues) }]);
  // Tipo 2: ¿propiedad física o química? La clase la da MotorMateria.propiedad.
  const PROP3 = [
    { texto: 'El cobre conduce la electricidad', p: 'conductividad eléctrica' }, { texto: 'El gas de la cocina arde', p: 'combustibilidad' },
    { texto: 'El hierro se oxida con el aire húmedo', p: 'oxidabilidad' }, { texto: 'El alcohol hierve a unos 78 °C', p: 'temperatura de ebullición' },
    { texto: 'El zinc reacciona con los ácidos', p: 'reactividad con ácidos' }, { texto: 'El oro brilla', p: 'brillo' },
    { texto: 'El papel se enciende con facilidad', p: 'inflamabilidad' }, { texto: 'El aceite tiene unos 0,92 g/mL', p: 'densidad' },
  ];
  // Tipo 3: contar moléculas después contando átomos (sin balancear: la lupa de antes y la cuenta de un elemento).
  const CONTAR3 = [
    { antes: [['C3H8', 1], ['O2', 5]], fijo: ['CO2', 3], pide: 'H2O', el: 'H' },
    { antes: [['H2', 4], ['O2', 2]], fijo: null, pide: 'H2O', el: 'H' },
    { antes: [['Fe', 4], ['O2', 3]], fijo: null, pide: 'Fe2O3', el: 'Fe' },
    { antes: [['N2', 1], ['H2', 3]], fijo: null, pide: 'NH3', el: 'N' },
    { antes: [['C3H8', 1], ['O2', 5]], fijo: ['H2O', 4], pide: 'CO2', el: 'C' },
  ];
  const ATOMOS_EN = { H2O: { H: 2, O: 1 }, CO2: { C: 1, O: 2 }, Fe2O3: { Fe: 2, O: 3 }, NH3: { N: 1, H: 3 }, C3H8: { C: 3, H: 8 }, O2: { O: 2 }, H2: { H: 2 }, N2: { N: 2 }, Fe: { Fe: 1 } };
  function cuenta3(x) {
    const at = Motor.cuentaAtomos(x.antes.map(([e, n]) => ({ formula: FORM3[e], n })));
    const k = ATOMOS_EN[x.pide][x.el], fijos = x.fijo ? (ATOMOS_EN[x.fijo[0]][x.el] || 0) * x.fijo[1] : 0;
    return { at, n: (at[x.el] - fijos) / k };
  }
  // Tipo 4: cuántos de una lista son químicos (como San Marcos), o la balanza con un frasco abierto o cerrado.
  const NUM = ['I', 'II', 'III', 'IV'];

  function caso3(s, otro) {
    const tipo = s % 5, r = azar(s + (otro ? 900 : 0));
    if (tipo === 0) {
      const x = FEN3[idx(s, FEN3.length, otro)], real = tipoFen(x);
      return { tipo, x, real, datos: [DEF_FIS, DEF_QUI, DEF_NUC], pregunta: `${x.texto}. ¿Qué tipo de cambio es?`, opciones: opcionesTipo(real), porque: x.porque };
    }
    if (tipo === 1) {
      const x = LUPAS3[idx(s, LUPAS3.length, otro)], real = tipoLupa(x);
      return { tipo, x, real, dibujo: dibLupas(x), datos: [DEF_LUPA, DEF_FIS, DEF_QUI, DEF_NUC],
        pregunta: 'La figura muestra la lupa de una muestra, antes y después de un cambio. ¿Qué tipo de cambio es?', opciones: opcionesTipo(real) };
    }
    if (tipo === 2) {
      const x = PROP3[idx(s, PROP3.length, otro)], clase = Motor.propiedad(x.p).clase;
      return { tipo, x, clase, datos: [DEF_PF, DEF_PQ], pregunta: `«${x.texto}». ¿Es una propiedad física o química?`,
        opciones: [
          clase === 'física' ? { id: 'c', texto: 'Propiedad física', correcta: true } : { id: 'fis', texto: 'Propiedad física', error: 'MA2', siFuera: 'Se observa, bien. Sería física si al observarla la sustancia no se transformara.' },
          clase === 'química' ? { id: 'c', texto: 'Propiedad química', correcta: true } : { id: 'qui', texto: 'Propiedad química', error: 'MA1', siFuera: 'Es un rasgo de la sustancia, bien. Sería química si solo se viera al transformarla.' },
        ] };
    }
    if (tipo === 3) {
      const x = CONTAR3[idx(s, CONTAR3.length, otro)], c = cuenta3(x);
      const antes = listaPalabras(x.antes.map(([e, n]) => `${n} ${fm(FORM3[e])}`));
      const otroEl = Object.keys(ATOMOS_EN[x.pide]).find(e => e !== x.el), malo = c.at[otroEl] / ATOMOS_EN[x.pide][otroEl];
      const ds = [
        { id: 'otro', valor: Number.isInteger(malo) ? malo : c.n * 2, error: 'QM-CUENTA-O', siFuera: `Contaste átomos, bien. Pero ${fm(otroEl)} también está en otras moléculas: cuenta un elemento que solo esté en ${fm(FORM3[x.pide])}.` },
        { id: 'igual', valor: x.antes.reduce((a, [, n]) => a + n, 0), error: 'QM-MOLECULAS-IGUALES', siFuera: 'Lo que se conserva son los átomos de cada elemento, no el número de moléculas.' },
        { id: 'mas', valor: c.n + 1, error: 'QM-CUENTA-O', siFuera: 'Casi: revisa cuántos átomos lleva cada molécula de lo que se forma.' },
      ];
      return { tipo, x, c, dibujo: dibLupas({ antes: [{ particulas: x.antes.map(([e, n]) => ({ e, n })) }] }, true),
        datos: ['En un cambio químico, los átomos de cada elemento son los mismos antes y después', `${fm(FORM3[x.pide])}: ${listaPalabras(Object.entries(ATOMOS_EN[x.pide]).map(([e, k]) => `${k} de ${e}`))}`],
        pregunta: `En un frasco cerrado, antes hay ${antes}. Después de reaccionar hay ${x.fijo ? `${x.fijo[1]} ${fm(FORM3[x.fijo[0]])} y ` : 'solo '}moléculas de ${fm(FORM3[x.pide])}. ¿Cuántas de ${fm(FORM3[x.pide])}?`,
        opciones: opciones(c.n, ds, v => String(v)) };
    }
    if ((Math.floor(s / 5) + (otro ? 1 : 0)) % 2 === 0) {
      const xs = [];
      while (xs.length < 4) { const x = r.de(FEN3); if (!xs.includes(x)) xs.push(x); }
      const n = xs.filter(x => tipoFen(x) === 'químico').length, estado = xs.filter(x => tipoFen(x) === 'físico' && /escarcha|empaña|evapora/.test(x.texto)).length;
      return { tipo, xs, n, datos: [DEF_FIS, DEF_QUI, DEF_NUC],
        pregunta: `¿Cuántos de estos son cambios químicos? ${xs.map((x, i) => `${NUM[i]}. ${x.corto}.`).join(' ')}`,
        opciones: opciones(n, [
          { id: 'estado', valor: n + estado, error: 'MA1', siFuera: 'Contaste los químicos, bien. Un cambio de estado no forma sustancias nuevas: es físico.' },
          { id: 'menos', valor: n - 1, error: 'MA2', siFuera: 'Casi. Revisa cuál forma una sustancia que antes no estaba.' },
          { id: 'mas', valor: n + 1, error: 'MA1', siFuera: 'Casi. Revisa cuál deja las mismas partículas, aunque cambie de aspecto.' },
          { id: 'todos', valor: 4, error: 'MA1', siFuera: 'En todos cambia algo, cierto. Pero solo en algunos aparecen sustancias nuevas.' },
        ].filter(d => d.valor >= 0 && d.valor <= 4), v => String(v)) };
    }
    const cerrado = r() < 0.5, lana = r.de([2.8, 5.6, 11.2]), frasco = r.de([150, 200, 250]), q = Motor.quemarMetal({ metal: 'Fe', oxido: 'Fe2O3', masa: lana, recipiente: frasco - lana, cerrado });
    return { tipo, cerrado, lana, frasco, q, datos: ['Al arder, el hierro se une al oxígeno y forma óxido de hierro', 'Cada 56 g de hierro toman 24 g de oxígeno'],
      pregunta: `Sobre una balanza, un frasco ${cerrado ? 'cerrado' : 'abierto'} con ${f(lana)} g de lana de acero (hierro) marca ${f(frasco)} g. La lana arde${cerrado ? ' con el oxígeno de adentro' : ' con el oxígeno del aire'}. ¿Qué marca al final?`,
      opciones: opciones(q.despues, [
        { id: 'baja', valor: frasco - lana / 2, error: 'QM-MASA-SE-VA', siFuera: 'Cambió la sustancia, bien. Pero arder no destruye los átomos: no se pierde masa.' },
        cerrado ? { id: 'sube', valor: frasco + q.oxigeno, error: 'MA5', siFuera: 'El hierro sí toma oxígeno. Pero ese oxígeno ya estaba dentro del frasco cerrado.' }
          : { id: 'igual', valor: frasco, error: 'MA4', siFuera: 'Los átomos se conservan, bien. Pero aquí entra oxígeno del aire y se suma.' },
        { id: 'oxido', valor: q.masaOxido, error: 'QM-SOLO-SOLIDO', siFuera: 'Esa es la masa del óxido. La balanza pesa también el frasco.' },
      ], v => `${f(v)} g`) };
  }

  // Ejemplos resueltos de la idea 3 (pestaña «Ejemplos»): 5 por nivel. N1, un paso (un fenómeno, una propiedad, una
  // lupa); N2, dos pasos (sustancia nueva y por qué; contar átomos; estado de partida y de llegada); N3, de examen (la
  // lista de San Marcos, la balanza abierta y cerrada, contar moléculas sin balancear, el error de las burbujas). Las
  // figuras muestran el antes y el después, nunca el tipo de cambio.
  // Cuentas revisadas aparte (17 nov, script fuera del repo, cuentas-materia.py, que no usa este archivo ni el motor): H₂ + O₂: H
  // 8 = 4·2, O 4 = 4·1; clavo 4 Fe + 3 O₂ → 2 Fe₂O₃: Fe 4 = 4, O 6 = 6; propano: H 8 → 8/2 = 4 H₂O; C 3 → 3 CO₂; lista
  // de San Marcos: 2 químicos; lana de 5,6 g: 5,6·24/56 = 2,4 g, 200 + 2,4 = 202,4 g; cerrado: 200 g.
  const fig3 = (recipientes, extra) => Object.assign({ pieza: 'quim-vasos' }, mesa3(recipientes, extra));
  const EJEMPLOS_CAMBIOS = [
    { nivel: 1, titulo: 'Un cubo de hielo',
      enunciado: 'Un cubo de hielo se derrite sobre la mesa. ¿Qué tipo de cambio es?',
      datos: [DEF_FIS, DEF_QUI],
      solucion: [{ texto: ['Antes y después hay moléculas de H₂O: solo pasan de sólido a líquido. Es un ', dR('cambio físico'), '.'] }],
      respuesta: [dR('Físico')] },
    { nivel: 1, titulo: 'Una hoja que arde',
      enunciado: 'Una hoja de papel arde y quedan cenizas y humo. ¿Qué tipo de cambio es?',
      datos: [DEF_FIS, DEF_QUI],
      solucion: [{ texto: ['El papel y el oxígeno forman dióxido de carbono, agua y cenizas: sustancias que antes no estaban. Es un ', dR('cambio químico'), '.'] }],
      respuesta: [dR('Químico')] },
    // El enunciado no dice qué pasó con los átomos (lector en frío, 17 nov: con «pasaron a nitrógeno» los datos
    // regalaban la respuesta): eso se lee en la lupa, y los datos traen las tres definiciones entre las que se elige.
    { nivel: 1, titulo: 'El hueso del museo',
      enunciado: 'Un museo guarda un hueso muy antiguo. La figura muestra la lupa de sus átomos de carbono-14 al principio y miles de años después. ¿Qué tipo de cambio es?',
      datos: [DEF_FIS, DEF_QUI, DEF_NUC],
      figura: fig3([Object.assign({ tipo: 'hueso' }, PROC3.hueso.antes), Object.assign({ tipo: 'hueso' }, PROC3.hueso.despues)]),
      solucion: [{ texto: ['En la lupa de después hay átomos de N que antes no estaban: un átomo de carbono pasó a ser de nitrógeno. Cambió el elemento: ', dR('cambio nuclear'), '.'] }],
      respuesta: [dR('Nuclear')] },
    { nivel: 1, titulo: 'El gas que arde',
      enunciado: '«El gas del balón arde con facilidad». ¿Es una propiedad física o química del gas?',
      datos: [DEF_PF, DEF_PQ],
      solucion: [{ texto: ['Para ver que arde hay que quemarlo, y al quemarse se vuelve otras sustancias. Es una ', dR('propiedad química'), '.'] }],
      respuesta: [dR('Química')] },
    { nivel: 1, titulo: 'Sal en el agua',
      enunciado: 'Se echa sal a un vaso de agua y se disuelve. La figura muestra la lupa antes y después. ¿Qué tipo de cambio es?',
      datos: [DEF_LUPA, DEF_FIS, DEF_QUI],
      figura: fig3([{ tipo: 'vaso', titulo: 'Antes', fondo: { tipo: 'sal' }, lupa: L3(0.1, [{ alto: 0.55, particulas: [{ e: 'H2O', n: 4 }] }, { alto: 0.45, particulas: [{ e: 'NaCl', n: 2 }], orden: 'filas' }]) },
        { tipo: 'vaso', titulo: 'Después', lupa: L3(0.4, [{ particulas: [{ e: 'H2O', n: 3 }, ...disuelto('NaCl', 2)] }]) }]),
      solucion: [{ texto: ['Los iones Na⁺ y Cl⁻ de la sal solo se separaron y se repartieron entre el agua: ninguna sustancia nueva. Es un ', dR('cambio físico'), '.'] }],
      respuesta: [dR('Físico')] },
    { nivel: 2, titulo: 'Hidrógeno y oxígeno',
      enunciado: 'En un frasco cerrado, el hidrógeno reacciona con el oxígeno. Con la lupa de la figura, ¿qué tipo de cambio es y se conservan los átomos de H?',
      datos: [DEF_LUPA, DEF_QUI],
      figura: fig3([{ tipo: 'frasco', titulo: 'Antes', lupa: L3(0.45, LUPAS3[0].antes) }, { tipo: 'frasco', titulo: 'Después', lupa: L3(0.45, LUPAS3[0].despues) }]),
      solucion: [
        { texto: ['Antes, H₂ y O₂; después, H₂O, una sustancia nueva: ', dR('cambio químico'), '.'] },
        { texto: ['Átomos de H: antes, 4 moléculas de H₂ con 2 cada una; después, 4 de H₂O con 2 cada una.'], ecuacion: ['H: 4 · 2 = 8;  después: 4 · 2 = ', dR('8')] },
      ],
      respuesta: [dR('Químico'), '; los 8 átomos de H se conservan'] },
    { nivel: 2, titulo: 'Escarcha en la helada',
      enunciado: 'En una helada de Puno se forma escarcha sobre el pasto: el vapor de agua del aire pasa a sólido. ¿Qué tipo de cambio es y de qué estado a qué estado?',
      datos: [DEF_FIS, DEF_QUI],
      solucion: [
        { texto: ['El vapor es H₂O y la escarcha también: no aparece ninguna sustancia nueva. Es un cambio físico.'] },
        { texto: ['Pasa de gas a sólido sin ser líquido en el medio.'] },
      ],
      respuesta: [dR('Físico'), ', de gas a sólido'] },
    { nivel: 2, titulo: 'El óxido del clavo',
      enunciado: 'Un clavo se oxida: antes, 4 átomos de Fe y 3 moléculas de O₂; después, 2 de Fe₂O₃. ¿Se conservan los átomos de oxígeno?',
      datos: ['En una fórmula, el subíndice dice cuántos átomos de ese elemento hay', DEF_QUI, 'En la lupa, la línea punteada separa dos fases: el aire y el hierro'],
      figura: fig3([Object.assign({ tipo: 'clavo' }, PROC3.clavo.antes), Object.assign({ tipo: 'clavo' }, PROC3.clavo.despues)], { separacion: 24 }),
      solucion: [
        { texto: ['Antes: 3 moléculas de O₂ con 2 átomos cada una.'], ecuacion: ['O: 3 · 2 = 6'] },
        { texto: ['Después: 2 de Fe₂O₃ con 3 átomos de O cada una.'], ecuacion: ['O: 2 · 3 = ', dR('6')] },
      ],
      respuesta: [dR('Sí'), ': 6 antes y 6 después'] },
    { nivel: 2, titulo: 'Un huevo frito',
      enunciado: 'Al freír un huevo, la clara pasa de transparente a blanca, y al enfriarse no vuelve a ser transparente. ¿Qué tipo de cambio es?',
      datos: [DEF_FIS, DEF_QUI],
      solucion: [
        { texto: ['Cambió el color, pero el color solo no decide. Hay que ver si aparece una sustancia nueva.'] },
        { texto: ['Con el calor, las proteínas de la clara se transforman en otras: por eso no vuelve a ser como antes. Es un ', dR('cambio químico'), '.'] },
      ],
      respuesta: [dR('Químico')] },
    { nivel: 2, titulo: 'Dos rasgos del cobre',
      enunciado: 'El cobre es rojizo y, con los años, al aire húmedo se cubre de una capa verde. ¿Cuál de esos rasgos es una propiedad física y cuál química?',
      datos: [DEF_PF, DEF_PQ],
      solucion: [
        { texto: ['El color rojizo se ve sin transformar el cobre: propiedad física.'] },
        { texto: ['La capa verde es una sustancia nueva que forma el cobre con el aire: poder hacerla es una propiedad química.'] },
      ],
      respuesta: [dR('Color: física'), '; ', dR('capa verde: química')] },
    { nivel: 3, titulo: 'Cuatro fenómenos',
      enunciado: '¿Cuántos son cambios químicos? I. El espejo se empaña. II. La leña arde. III. El azúcar se disuelve en el té. IV. El vinagre con bicarbonato hace burbujas.',
      datos: [DEF_FIS, DEF_QUI],
      solucion: [
        { texto: ['I y III: las mismas partículas, agua que pasa a líquido y azúcar que se reparte. Físicos.'] },
        { texto: ['II y IV: aparecen sustancias nuevas, CO₂ y agua al arder; CO₂ en las burbujas. Químicos.'] },
        { texto: ['Error típico: contar el espejo como químico porque «aparece agua». Esa agua ya estaba en el aire, como vapor.'] },
      ],
      respuesta: [dR('2'), ': II y IV'] },
    { nivel: 3, titulo: 'Lana de acero abierta',
      enunciado: 'Sobre una balanza, un frasco abierto con 5,6 g de lana de acero marca 200 g. La lana arde con el oxígeno del aire. ¿Qué marca al final?',
      datos: ['Al arder, el hierro se une al oxígeno y forma óxido de hierro', 'Cada 56 g de hierro toman 24 g de oxígeno'],
      solucion: [
        { texto: ['El frasco está abierto: el oxígeno entra del aire y se queda en el óxido.'], ecuacion: [{ frac: ['5,6 · 24', '56'] }, ' = 2,4 g de oxígeno'] },
        { texto: ['Esa masa se suma a lo que había.'], ecuacion: ['200 + 2,4 = ', vO('202,4 g')] },
        { texto: ['Error típico: decir que baja porque «se quema». Arder no destruye átomos: aquí los suma.'] },
      ],
      respuesta: [vO('202,4 g')] },
    { nivel: 3, titulo: 'Lana de acero cerrada',
      enunciado: 'Ahora el frasco con 5,6 g de lana de acero está cerrado y marca 200 g. La lana arde con el oxígeno de adentro. ¿Qué marca al final?',
      datos: ['Al arder, el hierro se une al oxígeno y forma óxido de hierro', 'Cada 56 g de hierro toman 24 g de oxígeno'],
      solucion: [
        { texto: ['El hierro toma 2,4 g de oxígeno, pero ese oxígeno ya estaba dentro del frasco y ya se pesaba.'] },
        { texto: ['Nada entra ni sale: los átomos se reordenan adentro. La masa total no cambia.'], ecuacion: ['masa antes = masa después = ', vO('200 g')] },
      ],
      respuesta: [vO('200 g')] },
    { nivel: 3, titulo: 'Contar sin balancear',
      enunciado: 'En la lupa, antes hay 1 C₃H₈ y 5 O₂. Después hay moléculas de CO₂ y de H₂O, y nada más. ¿Cuántas de cada una?',
      datos: ['En un cambio químico, los átomos de cada elemento son los mismos antes y después', 'En una fórmula, el subíndice dice cuántos átomos hay; sin subíndice, hay 1: CO₂ tiene 1 C y 2 O', DEF_LUPA],
      figura: fig3([{ tipo: 'frasco', titulo: 'Antes', lupa: L3(0.45, [{ particulas: [{ e: 'C3H8', n: 1 }, { e: 'O2', n: 5 }] }]) }, { tipo: 'frasco', titulo: 'Después', lupa: { vacia: true, foco: 0.45 } }]),
      solucion: [
        { texto: ['El carbono solo va en el CO₂: 3 átomos de C dan 3 CO₂.'], ecuacion: ['C: 3 → ', dR('3 CO₂')] },
        { texto: ['El hidrógeno solo va en el H₂O: 8 átomos de H, de 2 en 2.'], ecuacion: ['H: 8 ÷ 2 → ', dR('4 H₂O')] },
        { texto: ['Comprobación con el oxígeno: antes 5 · 2 = 10; después 3 · 2 + 4 · 1 = 10.'] },
      ],
      respuesta: [dR('3 CO₂'), ' y ', dR('4 H₂O')] },
    { nivel: 3, titulo: 'Las burbujas del hervor',
      enunciado: 'Un alumno dice: «Cuando el agua hierve, las burbujas son de hidrógeno y oxígeno, así que hervir es un cambio químico». ¿Tiene razón?',
      datos: [DEF_FIS, DEF_QUI, 'Agua: moléculas H₂O, de 1 oxígeno y 2 hidrógenos'],
      figura: fig3([Object.assign({ tipo: 'olla' }, PROC3.olla.antes), Object.assign({ tipo: 'olla' }, PROC3.olla.despues)]),
      solucion: [
        { texto: ['En las burbujas hay moléculas de H₂O enteras, en estado gaseoso: el vapor del agua.'] },
        { texto: ['Separar el agua en hidrógeno y oxígeno sí sería químico, pero hervir no lo hace. Es un cambio físico.'] },
      ],
      respuesta: [dR('No'), ': hervir es un cambio físico'] },
  ];

  const cambios = {
    id: 'fisico-quimico-nuclear',
    titulo: '¿Siguen siendo las mismas partículas?',
    pregunta: '¿Cómo sabes si un cambio es físico, químico o nuclear?',
    temas: ['Estados de agregación', 'Propiedades físicas y químicas', 'Fenómenos físicos, químicos y nucleares'],
    pieza: 'quim-vasos',
    actividad: 'Mirar con la lupa seis cosas de la cocina, antes y después de cambiar.',
    aprendizaje: 'El tipo de cambio lo deciden las partículas de después: las mismas, físico; sustancias nuevas con los mismos átomos, químico; otro elemento, nuclear.',
    ejemplos: EJEMPLOS_CAMBIOS,
    // Lee: por fuera no basta, los estados de agregación, la propiedad química y qué mirar. No dice qué tipo es cada
    // cambio ni que los átomos se conservan (eso se ve en Mira), ni nombra la botella fría (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Por fuera no basta', texto: 'En una cocina todo cambia: el agua hierve, la ropa se seca, el clavo se oxida. Unas cosas solo cambian de forma o de estado; en otras aparece algo nuevo. Para saber cuál pasó, hay que mirar las partículas.',
          pieza: 'quim-vasos', dibujo: mesa3([{ tipo: 'olla', titulo: 'La olla', fuego: true }, { tipo: 'jarra', titulo: 'La chicha' }, { tipo: 'clavo', titulo: 'El clavo' }], { clave: false, flechas: false }) },
        { titulo: 'Estados de agregación', texto: 'Sólido, líquido y gas son los estados de agregación. En un sólido, las partículas quedan en su sitio, ordenadas; en un líquido, se deslizan unas junto a otras; en un gas, vuelan separadas.' },
        { titulo: 'Propiedades químicas', texto: 'Una propiedad química solo se ve cuando la sustancia se transforma en otra: que el gas del balón arda, que el hierro se oxide. La densidad, en cambio, se mide sin transformarla.' },
        { titulo: 'Qué mirar', texto: 'En el juego, a la izquierda está el antes y a la derecha, el después, cada uno con su lupa. La lupa del hueso muestra solo sus átomos de carbono-14. Compara las partículas de los dos lados.' },
      ],
    },
    juega: {
      pieza: 'quim-vasos',
      consigna: 'En una cocina de Juliaca pasan seis cosas. Elige una y deja pasar el tiempo: a la izquierda, antes; a la derecha, después.',
      mision: {
        texto: 'Encuentra un cambio con partículas nuevas, armadas con los mismos átomos de antes.',
        // Lo decide el motor con las partículas de las dos lupas.
        logrado: v => v.tiempo >= YA && cambio3(v.k).tipo === 'químico',
        bien: 'Listo: después hay sustancias que antes no estaban, hechas con los mismos átomos.',
      },
      voz: 'Compara las lupas, no el aspecto de las cosas.',
      leyenda: [
        { s: 'O', t: 'oxígeno: bolita roja llena' },
        { s: 'H', t: 'hidrógeno: bolita turquesa hueca' },
        { s: 'C', t: 'carbono: bolita gris llena' },
        { s: 'Fe', t: 'hierro: bolita azul con punto' },
        { s: 'N', t: 'nitrógeno: bolita azul llena' },
        { s: 'glucosa', t: 'molécula grande: la lupa la dibuja en corto' },
        { s: '→', t: 'de antes a después' },
        { s: '- - -', t: 'en la lupa, el borde entre dos fases' },
      ],
      controles: [{ id: 'k', etiqueta: 'En la cocina', opciones: Object.keys(PROC3).map(k => ({ valor: k, texto: PROC3[k].texto })) },
        { id: 'tiempo', etiqueta: 'Tiempo que pasa', min: 0, max: 100, paso: 10, inicio: 100, unidad: '%', decimales: 0, auto: { velocidad: 25, modo: 'rebota' } }],
      dibujo: v => dib3(v.k, v.tiempo),
      lectura: v => lectura3(v.k, v.tiempo),
      minimo: 3,
    },
    predice: {
      pregunta: 'Sacas del refrigerador una botella de agua cerrada y seca. En unos minutos se llena de gotitas por fuera. ¿De dónde salen?',
      datos: ['El aire tiene nitrógeno (N₂), oxígeno (O₂) y algo de vapor de agua (H₂O)'],
      voz: 'Piensa en qué partículas hay alrededor de la botella.',
      pieza: 'quim-vasos',
      opciones: [
        { id: 'c', texto: 'Del vapor de agua del aire, que se enfría y se vuelve líquido', correcta: true },
        { id: 'hyo', texto: 'Del oxígeno y el hidrógeno del aire, que se juntaron', error: 'MA1', siFuera: 'Pensaste en partículas, bien. Pero el aire casi no tiene hidrógeno: el agua ya estaba, como vapor.' },
        { id: 'atraviesa', texto: 'Del agua de adentro, que atraviesa el vidrio', error: 'QM-ATRAVIESA', siFuera: 'El agua de adentro está fría, cierto. Pero el vidrio no la deja pasar: la botella está cerrada.' },
        { id: 'frio', texto: 'El frío del vidrio se convierte en agua', error: 'QM-FRIO-AGUA', siFuera: 'El frío importa, bien. Pero el frío no es una sustancia: enfría algo que ya estaba.' },
      ],
      dibujo: mesa3([{ tipo: 'botella', titulo: 'Recién sacada' }, { tipo: 'botella', titulo: 'Unos minutos después', gotas: true, lupa: { vacia: true, foco: 0.5 } }], { separacion: 24 }),
      revelar: mesa3([{ tipo: 'botella', titulo: 'Recién sacada' }, { tipo: 'botella', titulo: 'Unos minutos después', gotas: true,
        lupa: L3(0.5, [{ alto: 0.5, particulas: [{ e: 'N2', n: 1 }, { e: 'O2', n: 1 }, { e: 'H2O', n: 1 }] }, { alto: 0.5, particulas: [{ e: 'H2O', n: 4 }] }]) }], { separacion: 24 }),
      coincide: 'Coincide: son moléculas de H₂O del aire, que pasaron de gas a líquido.',
      noCoincide: 'Las gotitas son moléculas de H₂O del aire: pasaron de gas a líquido sobre el vidrio frío.',
    },
    mira: {
      pieza: 'quim-particulas',
      datos: { atomos: AT1, especies: ESP1, flechas: true, alto: 140, separacion: 30, cajas: [
        { titulo: 'Antes', particulas: [{ e: 'O2', n: 1, desde: 1 }, { e: 'C3H8', n: 1, desde: 1 }, { e: 'O2', n: 4, desde: 1 }], rotulo: 'C 3 · O 10 · H 8' },
        { titulo: 'Después', particulas: [{ e: 'CO2', n: 3, desde: 2 }, { e: 'H2O', n: 4, desde: 2 }] },
      ], alt: 'Lupa del gas de la hornilla antes y después de arder: antes, 1 molécula de propano y 5 de oxígeno; después, 3 de dióxido de carbono y 4 de agua. Debajo, la cuenta de átomos: 3 de carbono, 8 de hidrógeno y 10 de oxígeno en los dos lados.' },
      // La cuenta de átomos va como un rótulo bajo la caja de antes (lector en frío, 17 nov: la fila de átomos con «O: 10» tocaba
      // el borde y, en el celular, el número pisaba al átomo siguiente); la de después la dice el paso 3, para no mostrarla con la caja vacía. El propano va segundo en la lista para caer en
      // una celda de adentro: con sus 11 átomos, en una celda del borde tocaba la caja.
      voz: 'Contemos los átomos del gas que arde, antes y después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Antes: gas de la hornilla (C₃H₈) y oxígeno. Cuenta los átomos de cada elemento.', ecuacion: ['C: 3;  O: 10;  H: 8'] },
        { estado: { corte: 2 }, texto: 'Después: dióxido de carbono y agua, sustancias que antes no estaban.', ecuacion: ['sustancias nuevas → cambio químico'] },
        { estado: { corte: 3 }, texto: 'Los átomos de cada elemento son los mismos: solo se reordenaron.', ecuacion: ['C: 3 = 3;  O: 10 = 10;  H: 8 = 8'] },
        { estado: { corte: 3 }, texto: 'Por eso, en un frasco cerrado, la balanza marca lo mismo antes y después.', ecuacion: ['masa antes = masa después'] },
        { estado: { corte: 3 }, texto: 'En la olla que hierve, las moléculas siguen siendo H₂O: cambio físico.' },
        { estado: { corte: 3 }, texto: 'En el hueso, un átomo de carbono-14 pasa a nitrógeno-14: cambio nuclear.', ecuacion: ['otro elemento → cambio nuclear'] },
      ],
    },
    regla: {
      texto: 'Cambio físico: las mismas partículas cambian de estado, forma o lugar. Químico: aparecen sustancias nuevas con los mismos átomos. Nuclear: un átomo pasa a ser de otro elemento.',
      ecuacion: ['en un cambio químico: átomos de cada elemento antes = después'],
      condicion: 'Propiedad física: se mide sin transformar la sustancia, como la densidad. Propiedad química: solo se ve al transformarla, como arder.',
      voz: 'Primero el inventario de partículas; el aspecto puede engañar.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso3(s, true)).
    resuelve: {
      pieza: 'quim-vasos',
      generar(s) {
        const c = caso3(s, true);
        const pasosTipo = (datos, aplica, real) => [
          { tipo: 'pide', texto: 'Piden decidir si el cambio es físico, químico o nuclear.' },
          { tipo: 'datos', texto: datos },
          { tipo: 'regla', texto: 'Miro las partículas de después: las mismas, físico; sustancias nuevas con los mismos átomos, químico; otro elemento, nuclear.' },
          { tipo: 'aplica', texto: aplica, ecuacion: [dR(`Cambio ${real}`)] },
          { tipo: 'sentido', texto: { 'físico': 'Comprobación: no apareció ninguna sustancia nueva, aunque cambiara el aspecto.', 'químico': 'Comprobación: los elementos son los mismos antes y después; por eso no es nuclear.', nuclear: 'Comprobación: después hay un elemento que antes no estaba; en un cambio químico eso nunca pasa.' }[real] },
        ];
        if (c.tipo === 0) return { enunciado: c.pregunta, datos: c.datos, pasos: pasosTipo(`${c.x.texto}.`, c.porque, c.real), respuesta: [dR(NOM_T[c.real])] };
        if (c.tipo === 1) {
          const t = tipoLupa(c.x), ma = Motor.cambio(lupaMotor(c.x.antes, c.x.est[0]), lupaMotor(c.x.despues, c.x.est[1]));
          const aplica = t === 'nuclear' ? 'Antes solo hay átomos de carbono; después aparecen átomos de nitrógeno.'
            : t === 'químico' ? `Antes: ${listaPalabras(ma.sustanciasAntes.map(fm))}. Después: ${listaPalabras(ma.sustanciasDespues.map(fm))}, que antes no estaba.`
            : `Antes y después, ${fm(ma.sustanciasAntes[0])}: de ${ESTADO[c.x.est[0]]} a ${ESTADO[c.x.est[1]]}.`;
          return { enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo, pasos: pasosTipo('La lupa de antes y la de después, en un frasco cerrado.', aplica, t), respuesta: [dR(NOM_T[t])] };
        }
        if (c.tipo === 2) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden si ese rasgo se ve sin transformar la sustancia o solo al transformarla.' },
            { tipo: 'regla', texto: 'Física: se mide sin que la sustancia se vuelva otra. Química: solo se ve cuando se vuelve otra.' },
            { tipo: 'aplica', texto: c.clase === 'química' ? 'Para ver ese rasgo, la sustancia tiene que transformarse en otra.' : 'Ese rasgo se mide u observa y la sustancia sigue siendo la misma.', ecuacion: [dR(`Propiedad ${c.clase}`)] },
            { tipo: 'sentido', texto: 'Comprobación: después de observarlo, ¿queda la misma sustancia? Si sí, es física.' },
          ],
          respuesta: [dR(`Propiedad ${c.clase}`)],
        };
        if (c.tipo === 3) {
          const p = fm(FORM3[c.x.pide]), k = ATOMOS_EN[c.x.pide][c.x.el];
          return {
            enunciado: c.pregunta, datos: c.datos, dibujo: c.dibujo,
            pasos: [
              { tipo: 'pide', texto: `Piden cuántas moléculas de ${p} hay después.` },
              { tipo: 'regla', texto: 'En un cambio químico, los átomos de cada elemento se conservan. Cuento un elemento que solo esté en lo que piden.' },
              { tipo: 'cuentas', texto: `Átomos de ${c.x.el} antes: ${c.c.at[c.x.el]}.${c.x.fijo ? ` Ya van ${(ATOMOS_EN[c.x.fijo[0]][c.x.el] || 0) * c.x.fijo[1]} en ${fm(FORM3[c.x.fijo[0]])}.` : ''} Cada ${p} lleva ${k}.`, ecuacion: [`${c.x.el}: ${c.c.at[c.x.el] - (c.x.fijo ? (ATOMOS_EN[c.x.fijo[0]][c.x.el] || 0) * c.x.fijo[1] : 0)} ÷ ${k} = `, dR(`${c.c.n}`)] },
              { tipo: 'sentido', texto: 'Comprobación: con ese número, los átomos de los otros elementos también dan lo mismo antes y después.' },
            ],
            respuesta: [dR(`${c.c.n} ${p}`)],
          };
        }
        if (c.xs) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden contar los cambios en que aparecen sustancias nuevas.' },
            { tipo: 'regla', texto: 'Químico solo si después hay sustancias que antes no estaban; un cambio de estado o una mezcla son físicos.' },
            { tipo: 'aplica', texto: c.xs.map((x, i) => `${NUM[i]}: ${tipoFen(x)}`).join('; ') + '.', ecuacion: [dR(`${c.n} químicos`)] },
            { tipo: 'sentido', texto: 'Comprobación: en los químicos se puede nombrar la sustancia nueva; en los físicos, no.' },
          ],
          respuesta: [dR(String(c.n))],
        };
        return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que marca la balanza después de que la lana arde.' },
            { tipo: 'regla', texto: 'Los átomos se conservan. La balanza solo cambia si algo entra o sale del frasco.' },
            { tipo: 'cuentas', texto: c.cerrado ? 'El frasco está cerrado: el oxígeno que se une ya estaba adentro.' : `El frasco está abierto: entra oxígeno del aire, ${f(c.lana)} · 24 ÷ 56 = ${f(c.q.oxigeno)} g.`,
              ecuacion: c.cerrado ? ['masa antes = masa después = ', vO(`${f(c.q.despues)} g`)] : [`${f(c.frasco)} + ${f(c.q.oxigeno)} = `, vO(`${f(c.q.despues)} g`)] },
            { tipo: 'sentido', texto: 'Comprobación: arder no destruye átomos; si la masa cambia, es porque algo entró o salió.' },
          ],
          respuesta: [vO(`${f(c.q.despues)} g`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-vasos',
      voz: 'Decide por las partículas, no por lo que se ve.',
      generar(s) {
        const c = caso3(s, false);
        let solucion;
        if (c.tipo === 0) solucion = { texto: c.porque, ecuacion: [dR(`Cambio ${c.real}`)] };
        else if (c.tipo === 1) solucion = { texto: { 'físico': 'Las mismas partículas, en otro estado.', 'químico': 'Después hay una sustancia nueva, con los mismos átomos.', nuclear: 'Después hay átomos de otro elemento.' }[c.real], ecuacion: [dR(`Cambio ${c.real}`)] };
        else if (c.tipo === 2) solucion = { texto: c.clase === 'química' ? 'Solo se ve al transformar la sustancia en otra.' : 'Se observa sin transformar la sustancia.', ecuacion: [dR(`Propiedad ${c.clase}`)] };
        else if (c.tipo === 3) solucion = { texto: `Se cuenta un elemento que solo esté en ${fm(FORM3[c.x.pide])}.`, ecuacion: [dR(`${c.c.n} ${fm(FORM3[c.x.pide])}`)] };
        else if (c.xs) solucion = { texto: c.xs.map((x, i) => `${NUM[i]}: ${tipoFen(x)}`).join('; ') + '.', ecuacion: [dR(String(c.n))] };
        else solucion = { texto: c.cerrado ? 'Cerrado: nada entra ni sale, la masa no cambia.' : 'Abierto: se suma el oxígeno que entra del aire.', ecuacion: [vO(`${f(c.q.despues)} g`)] };
        return { pregunta: c.pregunta, datos: c.datos, dibujo: c.dibujo, opciones: c.opciones, solucion };
      },
    },
  };

  // ---------- Idea 4: calor que no sube la temperatura (calor sensible y latente) ----------
  // Rehecha el 17 nov contra el contrato (docs/etapa2/propuesta-quimica.md, idea 4, con docs/etapa2/decisiones.md): el
  // calor se queda en química, en calorías, con «1 cal ≈ 4,18 J» en los datos; el calor específico se escribe cₑ (la c
  // es la de la luz, idea 5); las escalas, solo como variaciones (ΔK = Δ°C, Δ°F = 1,8 · Δ°C). Primera pantalla: una olla
  // con 1 L de agua en la hornilla, con su termómetro, y la curva temperatura–calor debajo (quim-cocina, objetos de
  // prueba). Un dibujo de variables, con un color por magnitud en toda la idea (corrección del 17 nov, lector en frío:
  // «Q naranja en el juego y violeta en la fórmula»): Q violeta (c-f) en el juego, el eje, Mira, la regla y las cuentas;
  // m naranja (c-o); cₑ y L turquesa (c-i: lo que pide cada gramo de la sustancia; nunca van en la misma fórmula); la
  // temperatura y ΔT verde (c-d, como en toda la unidad), así ΔT y L no comparten color. El resultado lleva el color de
  // su magnitud. Verde y naranja se acercan en protanopía: por eso cada uno va siempre con su letra (m, ΔT).
  // Agua que hierve en Juliaca: «unos 87 °C» (decisiones, 17 nov; sale de un modelo de presión y de la curva de presión
  // de vapor, sin medición citada). Valores de libro, con «unos»: cₑ del agua 1 cal/(g·°C), del hielo 0,5; fusión
  // 80 cal/g; vaporización 540 cal/g (a 100 °C; a 87 °C es algo más, y aquí se usa el valor de academia).
  // Cambia: el calor entregado · Permanece: 1 L de agua desde 10 °C y la curva entera, punteada · Progresa: sube hasta
  // 87 °C y después hierve sin subir · Se reserva: la meseta del hielo que se funde (la predicción) · Debe verse: el
  // tramo largo y plano.
  // Códigos: MA6/Q7 (la temperatura sube mientras se funde; Georgiou y Sharma 2010, 30 % a 48 %), Q8, y las hipótesis
  // QM-BAJO-CERO, QM-T-COCINA, QM-SIN-CE, QM-SIN-M, QM-T-FINAL, QM-CERO, QM-SIN-LATENTE, QM-SOLO-LATENTE, QM-LECTURA-PUNTO
  // (sumar 32 o 273 a una variación) y QM-ESCALA-SIN-FACTOR.
  const CE_AGUA = 1, CE_HIELO = 0.5, LF4 = 80, LV4 = 540, TEB_JUL = 87, T0_OLLA = 10, M_OLLA = 1000;   // cal/(g·°C), cal/g, °C, g
  const QS_OLLA = M_OLLA * CE_AGUA * (TEB_JUL - T0_OLLA) / 1000, QV_OLLA = M_OLLA * LV4 / 1000;            // kcal
  const QMAX4 = 640;
  function olla4(q) {
    if (q <= QS_OLLA) return { T: T0_OLLA + q * 1000 / (M_OLLA * CE_AGUA), frac: 0 };
    return { T: TEB_JUL, frac: Math.min(1, (q - QS_OLLA) / QV_OLLA) };
  }
  const CURVA4 = [[0, T0_OLLA], [QS_OLLA, TEB_JUL], [QS_OLLA + QV_OLLA, TEB_JUL]];
  const Td = vD('T'), Qf = dR('Q'), ceD = vI('cₑ'), dTi = vD('ΔT'), Li = vI('L');
  // Sin la curva entera punteada ni la marca de 87 °C en el eje (lector en frío, 17 nov: la punteada mostraba la meseta
  // antes de jugar y daba la respuesta de la misión y del Predice). El tramo aparece solo cuando el calor llega.
  const curvaOlla = (q, extra = {}) => Object.assign({ tipo: 'curva', fila: 1, puntos: CURVA4, hasta: q, xmax: QMAX4, ymin: 0, ymax: 100,
    xMarcas: [0, 200, 400], yMarcas: [0, 50, 100], x: 'Q (kcal)', y: 'T (°C)', colorX: 'f', colorY: 'd', completa: false }, extra);
  const ollaJuego = q => { const e = olla4(q); return { tipo: 'olla', titulo: '1 L de agua en Juliaca', fuego: true, nivel: 0.7 * (1 - e.frac) + 0.02,
    hierve: e.T >= TEB_JUL && e.frac < 1, vapor: e.frac > 0 ? 1 : 0, termometro: `${f(e.T, 0)} °C`, colorT: 'd', rotulos: [{ texto: `Q = ${f(q, 0)} kcal`, color: 'f' }] }; };
  const juego4 = v => coc([ollaJuego(v.q), curvaOlla(v.q)]);
  const lectura4 = v => {
    const e = olla4(v.q);
    if (e.frac >= 1) return [dR(`${f(v.q, 0)} kcal`), ': ya hirvió toda el agua.'];
    if (e.frac > 0) return ['Hierve a ', vD(`${TEB_JUL} °C`), `: ya se fue el ${f(100 * e.frac, 0)} % del agua.`];
    return [dR(`${f(v.q, 0)} kcal`), ': el agua subió de 10 °C a ', vD(`${f(e.T, 0)} °C`), '.'];
  };
  const DEF_SENS = ['Calor sensible: ', Qf, ' = ', mR, ' · ', ceD, ' · ', dTi];
  const DEF_LAT = ['Calor latente: ', Qf, ' = ', mR, ' · ', Li];
  const DEF_LAT_T = ['Calor latente: ', Qf, ' = ', mR, ' · ', Li];
  const DEF_DT = 'ΔT: temperatura final menos temperatura inicial';
  const DEF_CAL = '1 kcal = 1000 cal;  1 cal ≈ 4,18 J';
  // Escalas (punto 13): para leer un punto y para una variación, juntas, porque el ejercicio practica elegir.
  const DEF_ESCALAS = ['Para leer un punto: K = °C + 273 y °F = 1,8 · °C + 32', 'En una variación: ΔK = Δ°C y Δ°F = 1,8 · Δ°C'];
  const D_AGUA = 'Agua líquida: cₑ = 1 cal/(g·°C)', D_FUS = 'Hielo: se funde a 0 °C con L = 80 cal/g', D_VAP = 'Agua: al hervir, L = 540 cal/g';
  // Tipo 0: calor sensible de una sustancia (valores de libro, con «unos»).
  const SUST4 = [
    { nombre: 'agua', dato: D_AGUA, ce: 1 }, { nombre: 'aceite', dato: 'Aceite: cₑ = unos 0,5 cal/(g·°C)', ce: 0.5 },
    { nombre: 'aluminio', dato: 'Aluminio: cₑ = unos 0,22 cal/(g·°C)', ce: 0.22 }, { nombre: 'hierro', dato: 'Hierro: cₑ = unos 0,11 cal/(g·°C)', ce: 0.11 },
  ];
  function caso4(s, otro) {
    const tipo = s % 5, r = azar(s + (otro ? 900 : 0));
    if (tipo === 0) {
      const x = SUST4[idx(s, SUST4.length, otro)], m = r.de([50, 100, 200, 250, 500]), t0 = r.de([10, 15, 20]), t1 = t0 + r.de([20, 30, 40, 50]), q = m * x.ce * (t1 - t0);
      return { tipo, x, m, t0, t1, q, datos: [DEF_SENS, x.dato, DEF_DT],
        pregunta: ['¿Cuánto calor necesitan ', vO(`${m} g`), ` de ${x.nombre} para pasar de ${t0} °C a ${t1} °C?`],
        opciones: opciones(q, [
          { id: 'tfin', valor: m * x.ce * t1, error: 'QM-T-FINAL', siFuera: 'Usaste masa y cₑ, bien. Pero ΔT es lo que sube: final menos inicial.' },
          { id: 'sinm', valor: x.ce * (t1 - t0), error: 'QM-SIN-M', siFuera: 'Eso alcanza para 1 g. Hay que multiplicar por la masa.' },
          x.ce === 1 ? { id: 'lat', valor: m * LV4, error: 'MA6', siFuera: 'Eso sería hervir esa masa. Aquí solo se calienta, sin cambio de estado.' }
            : { id: 'since', valor: m * (t1 - t0), error: 'QM-SIN-CE', siFuera: `Usaste masa y ΔT, bien. Falta el calor específico del ${x.nombre}.` },
        ], v => `${f(v)} cal`) };
    }
    if (tipo === 1) {
      const funde = r() < 0.5, m = r.de([20, 50, 100, 150, 200, 250]), L = funde ? LF4 : LV4, q = m * L;
      return { tipo, funde, m, L, q, datos: [DEF_LAT, D_FUS, D_VAP],
        pregunta: funde ? ['¿Cuánto calor necesitan ', vO(`${m} g`), ' de hielo a 0 °C para fundirse por completo?']
          : ['¿Cuánto calor necesitan ', vO(`${m} g`), ' de agua que ya hierve para volverse vapor por completo?'],
        opciones: opciones(q, [
          { id: 'cero', valor: 0, error: 'QM-CERO', siFuera: 'La temperatura no cambia, cierto. Pero el calor sí entra: se usa en el cambio de estado.' },
          { id: 'otroL', valor: m * (funde ? LV4 : LF4), error: 'QM-OTRO-L', siFuera: `Usaste Q = m · L, bien. Pero ese L es el de ${funde ? 'hervir' : 'fundir'}.` },
          { id: 'sinm', valor: L, error: 'QM-SIN-M', siFuera: 'Eso alcanza para 1 g. Hay que multiplicar por la masa.' },
        ], v => `${f(v)} cal`) };
    }
    if (tipo === 2) {
      const m = r.de([50, 100, 200]), t = r.de([10, 20, 25, 30, 40]), q1 = m * LF4, q2 = m * CE_AGUA * t, q = q1 + q2;
      return { tipo, m, t, q1, q2, q, datos: [DEF_LAT_T, DEF_SENS, D_FUS, D_AGUA],
        pregunta: ['¿Cuánto calor hace falta para llevar ', vO(`${m} g`), ` de hielo a 0 °C hasta agua líquida a ${t} °C?`],
        opciones: opciones(q, [
          { id: 'solofus', valor: q1, error: 'QM-SOLO-LATENTE', siFuera: 'Fundir está bien calculado. Falta calentar el agua desde 0 °C.' },
          { id: 'solosens', valor: q2, error: 'MA6', siFuera: 'Calentar está bien. Pero antes hay que fundir el hielo, sin que suba la temperatura.' },
          { id: 'hervir', valor: m * LV4 + q2, error: 'QM-OTRO-L', siFuera: 'Sumaste dos tramos, bien. Pero fundir pide 80 cal/g; 540 es hervir.' },
        ], v => `${f(v)} cal`) };
    }
    if (tipo === 3) {
      const t0 = r.de([-10, 5, 12, 15, 20]), t1 = r.de([60, 70, 80, 87, 90]), d = t1 - t0, aF = r() < 0.6;
      return { tipo, t0, t1, d, aF, datos: DEF_ESCALAS,
        pregunta: [`Un líquido pasa de ${t0} °C a ${t1} °C. ¿Cuánto varió su temperatura en `, aF ? '°F?' : 'kelvin?'],
        opciones: aF ? opciones(1.8 * d, [
          { id: 'mas32', valor: 1.8 * d + 32, error: 'QM-LECTURA-PUNTO', siFuera: 'Multiplicaste por 1,8, bien. El +32 es para leer un punto, no para una variación.' },
          { id: 'sin', valor: d, error: 'QM-ESCALA-SIN-FACTOR', siFuera: 'Esa es la variación en °C. Un grado Celsius equivale a 1,8 °F.' },
          { id: 'div', valor: d / 1.8, error: 'QM-ESCALA-SIN-FACTOR', siFuera: 'El factor es 1,8, bien, pero va multiplicando: el °F es más chico.' },
        ], v => `${f(v)} °F`) : opciones(d, [
          { id: 'mas273', valor: d + 273, error: 'QM-LECTURA-PUNTO', siFuera: 'Sumar 273 sirve para leer un punto. En una variación, ΔK = Δ°C.' },
          { id: 'por18', valor: 1.8 * d, error: 'QM-ESCALA-SIN-FACTOR', siFuera: 'El 1,8 es de los °F. Un kelvin mide lo mismo que un °C.' },
          { id: 'final', valor: t1 + 273, error: 'QM-LECTURA-PUNTO', siFuera: 'Eso es la temperatura final en kelvin, no cuánto varió.' },
        ], v => `${f(v)} K`) };
    }
    const m = r.de([50, 100, 200]), t = r.de([10, 20, 30, 40, 50]), q = m * LF4 + m * CE_AGUA * t;
    return { tipo, m, t, q, datos: [DEF_LAT_T, DEF_SENS, D_FUS, D_AGUA],
      pregunta: [vO(`${m} g`), ' de hielo a 0 °C reciben ', dR(`${f(q)} cal`), '. ¿A qué temperatura queda el agua?'],
      opciones: opciones(t, [
        { id: 'todo', valor: q / m, error: 'QM-SIN-LATENTE', siFuera: 'Usaste Q = m · cₑ · ΔT, bien. Pero primero el hielo se funde y gasta 80 cal por gramo.' },
        { id: 'cero', valor: 0, error: 'MA6', siFuera: 'Mientras se funde, sí está a 0 °C. Pero el calor alcanza para fundirlo y sobra.' },
        { id: 'mas', valor: t + 80, error: 'QM-SUMA-L', siFuera: 'Fundir pide calor, no suma grados. El calor que sobra es el que calienta.' },
      ], v => `${f(v)} °C`) };
  }

  // Ejemplos resueltos de la idea 4: 5 por nivel. N1, un paso (Q = m·cₑ·ΔT, Q = m·L, una variación en K, cal a J); N2,
  // dos pasos (litros a gramos, despejar cₑ o m, °F, dos tramos); N3, de examen (la curva entera, ¿alcanza el calor?,
  // Juliaca contra Lima, la variación en K y en °F de San Marcos, kcal a kJ). Lo pedido va con «?» en las figuras.
  // Cuentas revisadas aparte (17 nov, script fuera del repo, cuentas-materia.py, que no usa este archivo): 500·1·10 = 5000;
  // 200·80 = 16 000; 100·540 = 54 000; 25 K; 1000·4,18 = 4180; 1000·1·77 = 77 000; 440/(200·10) = 0,22; 1,8·20 = 36;
  // 100·0,5·10 + 100·80 = 8500; 27 000/540 = 50; 10·80 + 10·100 + 10·540 = 7200; 10 000 − 8000 = 2000, 2000/100 = 20;
  // 1000·(100 − 17) − 1000·(87 − 17) = 13 000; 70 − (−10) = 80 K, 1,8·80 = 144; 2000·50 = 100 000 cal, ·4,18 = 418 000 J.
  // Correcciones del 17 nov (lector en frío), rehechas con otro script fuera del repo (cuentas-corr.py, sin este archivo):
  // todas las respuestas que cambiaron de forma o de color dan lo mismo; ver rutinas/frio/quimica.materia-y-energia.md.
  const EJEMPLOS_CALOR = [
    { nivel: 1, titulo: 'Agua tibia para el mate',
      enunciado: ['¿Cuánto calor necesitan ', vO('500 g'), ' de agua para pasar de 20 °C a 30 °C?'],
      datos: [DEF_SENS, D_AGUA, DEF_DT],
      solucion: [{ texto: ['Sin cambio de estado: calor sensible, con ', dTi, ' = 30 − 20 = ', vD('10 °C'), '.'], ecuacion: [Qf, ' = ', vO('500'), ' · ', vI('1'), ' · ', vD('10'), ' = ', dR('5000 cal')] }],
      respuesta: [dR('5000 cal')] },
    { nivel: 1, titulo: 'Hielo que se funde',
      enunciado: ['¿Cuánto calor necesitan ', vO('200 g'), ' de hielo a 0 °C para fundirse por completo?'],
      datos: [DEF_LAT, D_FUS],
      figura: fig2([{ tipo: 'vaso', titulo: '200 g de hielo', nivel: 0.15, cubitos: 3, rotulos: [{ texto: 'Q = ?' }] }]),
      solucion: [{ texto: ['Ya está a 0 °C: todo el calor va a fundirlo, sin subir la temperatura.'], ecuacion: [Qf, ' = ', vO('200'), ' · ', vI('80'), ' = ', dR('16 000 cal')] }],
      respuesta: [dR('16 000 cal')] },
    { nivel: 1, titulo: 'Agua que se va en vapor',
      enunciado: ['Una olla hierve. ¿Cuánto calor hace falta para que ', vO('100 g'), ' de esa agua se vuelvan vapor?'],
      datos: [DEF_LAT, D_VAP],
      solucion: [{ texto: ['El agua ya hierve: el calor solo cambia el estado.'], ecuacion: [Qf, ' = ', vO('100 g'), ' · ', vI('540 cal/g'), ' = ', dR('54 000 cal')] }],
      respuesta: [dR('54 000 cal')] },
    { nivel: 1, titulo: 'Una variación en kelvin',
      enunciado: ['El agua de una tetera sube ', vD('25 °C'), '. ¿Cuántos kelvin subió?'],
      datos: ['En una variación: ΔK = Δ°C'],
      solucion: [{ texto: ['Un kelvin mide lo mismo que un grado Celsius: la variación es el mismo número.'], ecuacion: ['ΔK = Δ°C = ', vD('25 K')] }],
      respuesta: [vD('25 K')] },
    { nivel: 1, titulo: 'Calorías a joules',
      enunciado: ['Una taza de agua recibió ', dR('1000 cal'), '. ¿Cuántos joules son?'],
      datos: ['1 cal ≈ 4,18 J'],
      solucion: [{ texto: ['Cada caloría son unos 4,18 joules.'], ecuacion: [dR('1000 cal'), ' · ', { frac: [vI('4,18 J'), '1 cal'] }, ' = ', dR('4180 J')] }],
      respuesta: [dR('4180 J')] },
    { nivel: 2, titulo: 'Una olla en Juliaca',
      enunciado: ['En Juliaca, 1 L de agua a ', vD('10 °C'), ' se pone a hervir. ¿Cuánto calor necesita para empezar a hervir?'],
      datos: [DEF_SENS, D_AGUA, '1 L de agua = 1000 g', 'En Juliaca el agua hierve a unos 87 °C'],
      figura: fig2([{ tipo: 'olla', titulo: '1 L de agua', fuego: true, termometro: '10 °C', rotulos: [{ texto: 'Q = ?' }] }]),
      solucion: [
        { texto: ['La masa en gramos y lo que sube: de 10 °C a 87 °C.'], ecuacion: [mR, ' = ', vO('1000 g'), ';  ', dTi, ' = 87 − 10 = ', vD('77 °C')] },
        { texto: ['Calor sensible.'], ecuacion: [Qf, ' = ', vO('1000'), ' · ', vI('1'), ' · ', vD('77'), ' = ', dR('77 000 cal')] },
      ],
      respuesta: [dR('77 000 cal'), ' = 77 kcal'] },
    { nivel: 2, titulo: 'El calor específico de un metal',
      enunciado: [vO('200 g'), ' de un metal suben ', vD('10 °C'), ' con ', dR('440 cal'), '. ¿Cuál es su calor específico?'],
      datos: [['Calor sensible: Q = ', mR, ' · ', ceD, ' · ', dTi]],
      solucion: [
        { texto: ['De la fórmula, se despeja cₑ: el calor entre la masa y lo que sube.'], ecuacion: [ceD, ' = ', { frac: [Qf, [mR, ' · ', dTi]] }] },
        { texto: ['Reemplazo.'], ecuacion: [ceD, ' = ', { frac: [dR('440 cal'), [vO('200 g'), ' · ', vD('10 °C')]] }, ' = ', vI('0,22 cal/(g·°C)')] },
      ],
      respuesta: [vI('0,22 cal/(g·°C)'), ', como el aluminio'] },
    { nivel: 2, titulo: 'Una variación en °F',
      enunciado: ['Una sopa pasa de ', vD('15 °C'), ' a ', vD('35 °C'), '. ¿Cuánto varió su temperatura en °F?'],
      datos: DEF_ESCALAS,
      solucion: [
        { texto: ['Primero la variación en °C.'], ecuacion: ['Δ°C = 35 − 15 = ', vD('20 °C')] },
        { texto: ['Es una variación: Δ°F = 1,8 · Δ°C, sin el + 32 de los datos, que es para leer un punto.'], ecuacion: ['Δ°F = ', vI('1,8'), ' · ', vD('20'), ' = ', vD('36 °F')] },
      ],
      respuesta: [vD('36 °F')] },
    { nivel: 2, titulo: 'Hielo de la helada',
      enunciado: ['¿Cuánto calor necesitan ', vO('100 g'), ' de hielo a −10 °C para quedar fundidos a 0 °C?'],
      datos: [DEF_LAT_T, DEF_SENS, 'Hielo: cₑ = 0,5 cal/(g·°C)', D_FUS],
      solucion: [
        { texto: ['Primero el hielo sube de −10 °C a 0 °C, sin fundirse.'], ecuacion: [Qf, ' = ', vO('100'), ' · ', vI('0,5'), ' · ', vD('10'), ' = 500 cal'] },
        { texto: ['Después se funde a 0 °C.'], ecuacion: [Qf, ' = ', vO('100'), ' · 80 = 8000 cal'] },
        { texto: ['Se suman los dos tramos.'], ecuacion: ['500 + 8000 = ', dR('8500 cal')] },
      ],
      respuesta: [dR('8500 cal')] },
    { nivel: 2, titulo: '¿Cuánta agua se fue?',
      enunciado: ['Una olla que ya hierve recibe ', dR('27 000 cal'), ' más. ¿Cuántos gramos de agua se vuelven vapor?'],
      datos: [DEF_LAT, D_VAP],
      solucion: [
        { texto: ['Mientras hierve, todo el calor va a cambiar el estado: se despeja la masa.'], ecuacion: [mR, ' = ', { frac: [Qf, Li] }] },
        { texto: ['Reemplazo.'], ecuacion: [mR, ' = ', { frac: [dR('27 000'), vI('540')] }, ' = ', vO('50 g')] },
      ],
      respuesta: [vO('50 g')] },
    { nivel: 3, titulo: 'Del hielo al vapor',
      enunciado: ['¿Cuánto calor necesitan ', vO('10 g'), ' de hielo a 0 °C para volverse vapor a 100 °C, al nivel del mar?'],
      datos: [DEF_LAT_T, DEF_SENS, D_FUS, D_AGUA, D_VAP, 'Al nivel del mar, el agua hierve a 100 °C'],
      figura: fig2([{ tipo: 'curva', titulo: '10 g de agua', puntos: [[0, 0], [0.8, 0], [1.8, 100], [7.2, 100]], xmax: 8, ymin: 0, ymax: 110, xMarcas: [], yMarcas: [0, 100], x: 'Q', y: 'T (°C)', completa: false, colorX: 'tinta', colorY: 'tinta' }]),
      solucion: [
        { texto: ['Fundir a 0 °C y calentar el agua de 0 °C a 100 °C.'], ecuacion: ['10 · 80 = 800 cal;  10 · 1 · 100 = 1000 cal'] },
        { texto: ['Hervir a 100 °C, el tramo plano y más largo.'], ecuacion: ['10 · 540 = 5400 cal'] },
        { texto: ['Se suman los tres tramos.'], ecuacion: ['800 + 1000 + 5400 = ', dR('7200 cal')] },
      ],
      respuesta: [dR('7200 cal')] },
    { nivel: 3, titulo: '¿Alcanza el calor?',
      enunciado: ['A ', vO('100 g'), ' de hielo a 0 °C se le dan ', dR('10 000 cal'), '. ¿A qué temperatura queda el agua?'],
      datos: [DEF_LAT_T, DEF_SENS, D_FUS, D_AGUA],
      solucion: [
        { texto: ['Fundir todo pide 100 · 80 = 8000 cal. Alcanza, y sobran 2000 cal.'], ecuacion: ['10 000 − 8000 = 2000 cal'] },
        { texto: ['Lo que sobra calienta el agua desde 0 °C.'], ecuacion: [dTi, ' = ', { frac: ['2000', [vO('100'), ' · ', vI('1')]] }, ' = ', vD('20 °C')] },
        { texto: ['Error típico: hacer 10 000 ÷ 100 = 100 °C, sin gastar primero el calor de fundir.'] },
      ],
      respuesta: [vD('20 °C')] },
    { nivel: 3, titulo: 'Juliaca contra Lima',
      enunciado: 'En Juliaca y en Lima se pone a hervir 1 L de agua a 17 °C. ¿Cuántas calorías más hacen falta en Lima para que empiece a hervir?',
      datos: [DEF_SENS, D_AGUA, '1 L de agua = 1000 g', 'Hierve a unos 87 °C en Juliaca y a unos 100 °C en Lima'],
      figura: fig2([{ tipo: 'olla', titulo: 'En Juliaca', tam: 0.9, fuego: true, termometro: '17 °C' }, { tipo: 'olla', titulo: 'En Lima', tam: 0.9, fuego: true, termometro: '17 °C', rotulos: [{ texto: 'Q más = ?' }] }]),
      solucion: [
        { texto: ['Juliaca: sube 70 °C. Lima: sube 83 °C.'], ecuacion: ['1000 · 1 · 70 = 70 000 cal;  1000 · 1 · 83 = 83 000 cal'] },
        { texto: ['La diferencia.'], ecuacion: ['83 000 − 70 000 = ', dR('13 000 cal')] },
        { texto: ['Por eso, en la altura, el agua hierve antes, pero a menos temperatura.'] },
      ],
      respuesta: [dR('13 000 cal'), ' más en Lima'] },
    // Con su curva dibujada (lector en frío, 17 nov: el enunciado hablaba de una curva que no estaba). Los datos se leen
    // en la figura, con la meseta de fundir en medio: el nivel sube por leer la curva y elegir la fórmula de los datos.
    { nivel: 3, titulo: 'Una curva de examen',
      enunciado: 'La figura muestra la curva temperatura–tiempo de una sustancia que se calienta. Del inicio al final de la curva, ¿cuánto varió su temperatura en kelvin y en °F?',
      datos: DEF_ESCALAS,
      figura: fig2([{ tipo: 'curva', titulo: 'Una sustancia que se calienta', puntos: [[0, -10], [2, 0], [5, 0], [8, 70]], xmax: 9, ymin: -20, ymax: 80, xMarcas: [], yMarcas: [-10, 70], x: 't', y: 'T (°C)', completa: false, colorX: 'tinta', colorY: 'tinta' }]),
      solucion: [
        { texto: ['En la curva, empieza a −10 °C y termina a 70 °C; la meseta del medio no cambia el inicio ni el final.'], ecuacion: ['Δ°C = 70 − (−10) = ', vD('80 °C')] },
        { texto: ['Es una variación: en kelvin, el mismo número; en °F, por 1,8.'], ecuacion: ['ΔK = ', vD('80 K'), ';  Δ°F = ', vI('1,8'), ' · 80 = ', vD('144 °F')] },
        { texto: ['Error típico: sumar 273 o 32, que en los datos sirven para leer un punto, no una variación.'] },
      ],
      respuesta: [vD('80 K'), ' y ', vD('144 °F')] },
    { nivel: 3, titulo: 'La terma en joules',
      enunciado: ['Una terma calienta ', vO('2 kg'), ' de agua de 20 °C a 70 °C. ¿Cuánto calor recibe el agua, en kJ?'],
      datos: [DEF_SENS, D_AGUA, '1 kg = 1000 g', DEF_CAL, '1 kJ = 1000 J'],
      solucion: [
        { texto: ['La masa en gramos y lo que sube.'], ecuacion: [mR, ' = ', vO('2000 g'), ';  ', dTi, ' = ', vD('50 °C')] },
        { texto: ['Calor sensible, en calorías.'], ecuacion: [Qf, ' = ', vO('2000'), ' · ', vI('1'), ' · ', vD('50'), ' = 100 000 cal'] },
        { texto: ['A joules y a kJ.'], ecuacion: ['100 000 · 4,18 = 418 000 J = ', dR('418 kJ')] },
      ],
      respuesta: [dR('418 kJ')] },
  ];

  const calor = {
    id: 'calor-sensible-latente',
    titulo: 'Calor que no sube la temperatura',
    pregunta: '¿Por qué el agua que hierve no se calienta más?',
    temas: ['Calor sensible y latente'],
    pieza: 'quim-cocina',
    actividad: 'Darle calor a una olla con agua y mirar el termómetro y la curva.',
    aprendizaje: 'Mientras el agua hierve o el hielo se funde, la temperatura no sube aunque entre calor: Q = m·L. Si no, Q = m·cₑ·ΔT.',
    ejemplos: EJEMPLOS_CALOR,
    // Lee: calor y temperatura, el calor específico, los cambios de estado y qué mirar. No dice qué hace el termómetro
    // durante un cambio de estado (es lo que se juega y se predice).
    lee: {
      tarjetas: [
        { titulo: 'Calor y temperatura', texto: 'El calor es energía que pasa de algo caliente a algo más frío; aquí se mide en calorías (cal) y kilocalorías (1 kcal = 1000 cal). La temperatura dice qué tan caliente está algo, en grados Celsius. No son lo mismo.',
          pieza: 'quim-cocina', dibujo: coc([{ tipo: 'olla', titulo: '1 L de agua', fuego: true, termometro: '10 °C', colorT: 'd' }]) },
        { titulo: 'Cada sustancia pide lo suyo', texto: 'Para subir 1 °C, cada gramo de agua pide 1 caloría: es su calor específico, cₑ. El aceite pide la mitad y se calienta más rápido. Por eso el lago Titicaca tarda en calentarse y en enfriarse.' },
        { titulo: 'Cambios de estado', texto: 'Fundir es pasar de sólido a líquido; hervir, de líquido a gas. En las heladas de Puno, el agua de los charcos se congela de noche y se funde con el sol de la mañana.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el punto de la curva avanza a la derecha cuando entra calor y sube cuando sube la temperatura. Fíjate qué hace el termómetro en cada momento.' },
      ],
    },
    juega: {
      pieza: 'quim-cocina',
      consigna: 'La hornilla le da calor a 1 L de agua que empieza a 10 °C, en una cocina de Juliaca.',
      mision: {
        texto: 'Deja hervida la mitad del agua. ¿Cuánto subió el termómetro mientras hervía?',
        // La mitad del agua se fue en vapor (entre 45 % y 55 %), con el mismo cálculo que dibuja la olla.
        logrado: v => { const e = olla4(v.q); return e.frac >= 0.45 && e.frac <= 0.55; },
        bien: 'Listo: media olla se fue en vapor y el termómetro siguió en 87 °C.',
      },
      voz: 'Mira el termómetro mientras el agua hierve.',
      leyenda: [
        { s: Qf, t: 'calor que da la hornilla' },
        { s: Td, t: 'temperatura del agua' },
        { s: 'kcal', t: 'kilocaloría: 1000 calorías' },
        { s: '°C', t: 'grado Celsius' },
      ],
      controles: [{ id: 'q', etiqueta: 'Calor entregado, Q', color: 'c-f', min: 0, max: QMAX4, paso: 10, inicio: 0, unidad: 'kcal', decimales: 0, auto: { velocidad: 40 } }],
      dibujo: v => juego4(v),
      lectura: v => lectura4(v),
      minimo: 3,
      // Se agarra el punto de la curva y se lo empuja: la manija mueve Q y el termómetro responde (o no, en la meseta).
      arrastres: [{ id: 'calor', etiqueta: 'punto de la curva: calor entregado', color: 'c-f',
        donde: v => { const g = Kit.piezas['quim-cocina'].geoCurva(juego4(v).datos, 1); return { x: g.X(v.q), y: g.Y(olla4(v.q).T) }; },
        mover: (pt, v) => { const g = Kit.piezas['quim-cocina'].geoCurva(juego4(v).datos, 1); return { q: (pt.x - g.x0) / (g.x1 - g.x0) * QMAX4 }; } }],
    },
    predice: {
      pregunta: 'En un vaso hay agua con cubitos de hielo que se están derritiendo. ¿Qué marca el termómetro mientras queda hielo?',
      datos: ['El hielo se funde a 0 °C', 'La cocina está a unos 18 °C'],
      voz: 'Piensa en lo que viste en la olla que hervía.',
      pieza: 'quim-cocina',
      opciones: [
        { id: 'c', texto: '0 °C todo el tiempo', correcta: true },
        { id: 'sube', texto: 'Va subiendo poco a poco mientras se derrite', error: 'MA6', siFuera: 'Entra calor de la cocina, cierto. Pero mientras queda hielo, ese calor se usa en fundir.' },
        { id: 'bajo', texto: 'Menos de 0 °C, porque el hielo está bajo cero', error: 'QM-BAJO-CERO', siFuera: 'El hielo puede estar bajo cero, sí. Pero mientras se funde con agua, está justo a 0 °C.' },
        { id: 'cocina', texto: 'La temperatura de la cocina, unos 18 °C', error: 'QM-T-COCINA', siFuera: 'El vaso irá hacia 18 °C, cierto. Pero solo cuando ya no quede hielo.' },
      ],
      dibujo: coc([{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 3, termometro: '?' }]),
      revelar: coc([{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 3, termometro: '0 °C', colorT: 'd' }]),
      coincide: 'Coincide: mientras queda hielo, el calor funde y el termómetro se queda en 0 °C.',
      noCoincide: 'Mientras queda hielo, el calor se usa en fundir: el termómetro se queda en 0 °C.',
    },
    mira: {
      pieza: 'quim-cocina',
      datos: coc([
        { tipo: 'vaso', titulo: '200 g de hielo en agua', cubitos: 3, termometro: '0 °C', colorT: 'd' },
        { tipo: 'curva', fila: 1, puntos: [[0, 0], [16, 0], [19.6, 18]], xmax: 22, ymin: 0, ymax: 25, xMarcas: [0, 8, 16], yMarcas: [0, 18], x: 'Q (kcal)', y: 'T (°C)', colorX: 'f', colorY: 'd', completa: false },
      ]).datos,
      voz: 'Separemos el calor tramo por tramo.',
      pasos: [
        // L y su 80 cal/g se dicen en la llave (lector en frío: «no dicen qué es L, ni que el 80 son cal por gramo»).
        { estado: { corte: 1 }, texto: 'Mientras queda hielo, el termómetro marca 0 °C: el calor funde, no calienta.',
          ecuacion: [Qf, ' = ', mR, ' · ', { llave: [Li], nota: 'calor latente: lo que pide cada gramo para fundirse', color: 'c-i' }, ' = ', vO('200 g'), ' · ', vI('80 cal/g'), ' = ', dR('16 000 cal'), ' = ', dR('16 kcal')] },
        { estado: { corte: 1 }, texto: 'Ya sin hielo, el agua sube de 0 °C a 18 °C.', ecuacion: [Qf, ' = ', mR, ' · ', ceD, ' · ', dTi, ' = ', vO('200 g'), ' · ', vI('1 cal/(g·°C)'), ' · ', vD('18 °C'), ' = ', dR('3600 cal')] },
        { estado: { corte: 1 }, texto: 'Fundir pidió más de cuatro veces lo que pidió calentar.', ecuacion: [dR('16 000 cal'), ' contra ', dR('3600 cal')] },
        { estado: { corte: 1 }, texto: 'Hervir pide aún más: 540 cal por gramo, casi siete veces fundirlo.', ecuacion: ['ebullición: ', Li, ' = ', vI('540 cal/g'), ';  fusión: ', Li, ' = ', vI('80 cal/g')] },
        { estado: { corte: 1 }, texto: 'En kelvin (K) la variación es la misma; en grados Fahrenheit (°F), 1,8 veces.', ecuacion: ['ΔK = Δ°C = ', vD('18 K'), ';  Δ°F = 1,8 · 18 = ', vD('32,4 °F')] },
      ],
    },
    regla: {
      texto: 'Sin cambio de estado, el calor sube la temperatura: calor sensible. Durante un cambio de estado, la temperatura no cambia y el calor va al cambio: calor latente.',
      // Cada fórmula en su línea (el separador '   ·   ' las parte; lector en frío: «Q = m·cₑ· ·ΔT Q =» y «m·L» abajo).
      ecuacion: [Qf, ' = ', mR, ' · ', { llave: [ceD], nota: 'calor específico', color: 'c-i' }, ' · ', dTi, '   ·   ', Qf, ' = ', mR, ' · ', { llave: [Li], nota: 'calor latente', color: 'c-i' }],
      // Sin repetir «Vale» (el lector pone «Vale si» delante; lector en frío: «Vale si Vale para…»).
      condicion: 'la sustancia es pura y la presión, fija. Un punto: K = °C + 273 y °F = 1,8 · °C + 32; una variación, sin sumar.',
      voz: 'Antes de usar una fórmula, pregunta en qué tramo estás.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso4(s, true)).
    resuelve: {
      pieza: 'quim-cocina',
      generar(s) {
        const c = caso4(s, true);
        if (c.tipo === 0) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden el calor ', Qf, ` que calienta el ${c.x.nombre}, sin cambio de estado.`] },
            { tipo: 'datos', texto: [mR, ` = ${c.m} g, `, ceD, ` = ${f(c.x.ce)} cal/(g·°C) y `, dTi, ` = ${c.t1} − ${c.t0} = ${c.t1 - c.t0} °C.`] },
            { tipo: 'regla', texto: 'Sin cambio de estado: calor sensible.', ecuacion: [Qf, ' = ', mR, ' · ', ceD, ' · ', dTi] },
            { tipo: 'cuentas', texto: 'Reemplazo.', ecuacion: [Qf, ' = ', vO(`${c.m}`), ' · ', vI(f(c.x.ce)), ' · ', vD(`${c.t1 - c.t0}`), ' = ', dR(`${f(c.q)} cal`)] },
            { tipo: 'sentido', texto: 'Unidades: g · cal/(g·°C) · °C deja calorías. Con el doble de masa, el doble de calor.' },
          ],
          respuesta: [dR(`${f(c.q)} cal`)],
        };
        if (c.tipo === 1) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden el calor ', Qf, c.funde ? ' que funde todo el hielo.' : ' que vuelve vapor toda esa agua.'] },
            { tipo: 'datos', texto: c.funde ? 'Ya está a 0 °C: no hay que calentarlo, solo fundirlo. L de fusión: 80 cal/g.' : 'Ya hierve: no hay que calentarla, solo cambiarle el estado. L de ebullición: 540 cal/g.' },
            { tipo: 'regla', texto: 'Durante un cambio de estado, la temperatura no cambia y cada gramo pide su calor latente.', ecuacion: [Qf, ' = ', mR, ' · ', Li] },
            { tipo: 'cuentas', texto: 'Reemplazo.', ecuacion: [Qf, ' = ', vO(`${c.m}`), ' · ', vI(`${c.L}`), ' = ', dR(`${f(c.q)} cal`)] },
            { tipo: 'sentido', texto: 'Comprobación: aunque el termómetro no se mueva, el calor no es cero: se gasta en el cambio de estado.' },
          ],
          respuesta: [dR(`${f(c.q)} cal`)],
        };
        if (c.tipo === 2) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden el calor de dos tramos: fundir el hielo y calentar el agua que queda.' },
            { tipo: 'regla', texto: 'Cada tramo con su fórmula: el que cambia de estado con Q = m · L; el que sube de temperatura con Q = m · cₑ · ΔT.' },
            { tipo: 'cuentas', texto: 'Fundir a 0 °C, y después subir el agua.', ecuacion: [`${c.m} · 80 = ${f(c.q1)} cal;  `, vO(`${c.m}`), ' · ', vI('1'), ' · ', vD(`${c.t}`), ` = ${f(c.q2)} cal`] },
            { tipo: 'cuentas', texto: 'Sumo los dos tramos.', ecuacion: [`${f(c.q1)} + ${f(c.q2)} = `, dR(`${f(c.q)} cal`)] },
            { tipo: 'sentido', texto: 'Comprobación: fundir pide más que calentar unos grados; el tramo plano es el más largo.' },
          ],
          respuesta: [dR(`${f(c.q)} cal`)],
        };
        if (c.tipo === 3) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: `Piden cuánto varió la temperatura, en ${c.aF ? '°F' : 'kelvin'}: una variación, no una lectura.` },
            { tipo: 'regla', texto: c.aF ? 'En una variación, Δ°F = 1,8 · Δ°C, sin sumar 32.' : 'En una variación, ΔK = Δ°C, sin sumar 273.' },
            { tipo: 'cuentas', texto: 'Primero la variación en °C; después, la otra escala.', ecuacion: [`Δ°C = ${c.t1} − (${c.t0}) = `, vD(`${c.d}`), ';  ', c.aF ? `Δ°F = 1,8 · ${c.d} = ` : 'ΔK = ', vD(c.aF ? `${f(1.8 * c.d)} °F` : `${c.d} K`)] },
            { tipo: 'sentido', texto: c.aF ? 'Un °F es más chico que un °C: el número en °F tiene que salir mayor.' : 'Un kelvin y un °C miden lo mismo: el número no cambia.' },
          ],
          respuesta: [vD(c.aF ? `${f(1.8 * c.d)} °F` : `${c.d} K`)],
        };
        return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden la temperatura final del agua.' },
            { tipo: 'regla', texto: 'Primero se funde todo el hielo, sin que suba la temperatura; el calor que sobra calienta el agua.' },
            { tipo: 'cuentas', texto: `Fundir pide ${c.m} · 80 = ${f(c.m * LF4)} cal. Sobran ${f(c.q - c.m * LF4)} cal.`, ecuacion: [dTi, ' = ', { frac: [`${f(c.q - c.m * LF4)}`, [vO(`${c.m}`), ' · ', vI('1')]] }, ' = ', vD(`${c.t} °C`)] },
            { tipo: 'sentido', texto: 'Comprobación: si el calor no alcanzara para fundir todo, quedaría hielo y el agua estaría a 0 °C.' },
          ],
          respuesta: [vD(`${c.t} °C`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-cocina',
      voz: 'Decide primero si hay cambio de estado.',
      generar(s) {
        const c = caso4(s, false);
        let solucion;
        if (c.tipo === 0) solucion = { texto: 'Sin cambio de estado: calor sensible.', ecuacion: [Qf, ` = ${c.m} · ${f(c.x.ce)} · ${c.t1 - c.t0} = `, dR(`${f(c.q)} cal`)] };
        else if (c.tipo === 1) solucion = { texto: 'Cambio de estado: calor latente.', ecuacion: [Qf, ` = ${c.m} · ${c.L} = `, dR(`${f(c.q)} cal`)] };
        else if (c.tipo === 2) solucion = { texto: 'Fundir y después calentar: dos tramos que se suman.', ecuacion: [`${f(c.q1)} + ${f(c.q2)} = `, dR(`${f(c.q)} cal`)] };
        else if (c.tipo === 3) solucion = { texto: c.aF ? 'Variación: por 1,8, sin sumar 32.' : 'Variación: ΔK = Δ°C.', ecuacion: [vD(c.aF ? `${f(1.8 * c.d)} °F` : `${c.d} K`)] };
        else solucion = { texto: 'Primero se funde todo; lo que sobra calienta el agua.', ecuacion: [vD(`${c.t} °C`)] };
        return { pregunta: c.pregunta, datos: c.datos, opciones: c.opciones, solucion };
      },
    },
  };

  // ---------- Idea 5: poca masa, muchísima energía (E = Δm · c²) ----------
  // Rehecha el 17 nov contra el contrato (docs/etapa2/propuesta-quimica.md, idea 5, con docs/etapa2/decisiones.md: solo
  // E = Δm · c²; la radiactividad y la vida media van aparte, en la idea 6). Primera pantalla: una balanza con un granito
  // de unos miligramos y una fila de balones de gas con la misma energía (quim-cocina, objetos de prueba). Un dibujo de
  // variables: Δm naranja (c-o), c² turquesa (c-i), E violeta (c-f), la energía de un balón verde (c-d, tercer dato) y el
  // número de balones en carmín (c-h: esta unidad no tiene ángulos, y el número no puede compartir el violeta de E en un
  // mismo problema). Cada magnitud conserva su color en todos los ejemplos, también cuando es la que se pide (corrección
  // del 17 nov, lector en frío: «Δm morado en la 13 y café en la 15»).
  // Las potencias de 10 van como potencias de la ecuación ({ sup }) y no con los superíndices de Unicode: la fuente de la
  // app no trae ⁰ ni ⁻ y «10⁻²⁷» salía desarmado (lector en frío). Lo hace potencias(), al final de la idea.
  // Valores de libro, con «unos»: un balón de gas de 10 kg da unos 4,6 × 10⁸ J al quemarse (unos 46 MJ por kg de gas);
  // H ≈ 1,0078 u y He-4 ≈ 4,0026 u; c = 3 × 10⁸ m/s (valor de academia; NIST: 299 792 458 m/s).
  // Cambia: la masa que desaparece · Permanece: un balón de gas como medida · Progresa: de unas decenas a miles de balones
  // · Se reserva: que el helio del Sol pesa menos que los cuatro hidrógenos (la predicción) · Debe verse: que unos
  // miligramos equivalen a cientos de balones.
  // Las cuentas las hace el motor de la escena materia-energia (MotorMateria.energia, masaDeEnergia y defectoMasa) con
  // c = 3 × 10⁸ m/s. Códigos: QM-MASA-IGUAL y QM-TODA-MASA (Taber y Riggs 2023, sin cifra, en el informe de materia),
  // QM-MAS-PESADO, QM-G-KG (no pasar a kg), QM-MC (c sin elevar), QM-C-KM (c en km/s), QM-MULTIPLICA (el inverso).
  const C2 = Motor.C * Motor.C, E_BALON = 4.6e8;
  const dmO = vO('Δm'), Ef = dR('E'), c2i = { sup: [vI('c'), '2'] };
  // La masa del control se redondea a su décima antes de calcular: la lectura muestra 1,1 mg y la cuenta usa 1,1 mg, no el
  // 1,08 que deja la animación a medio camino (lector en frío: «1,1 mg da 9,9 × 10¹⁰, no 9,7»).
  const mg1 = mg => Math.round(mg * 10) / 10;
  const balones5 = mg => Motor.energia(mg * 1e-6).E / E_BALON;
  const redondo = x => (x >= 100 ? Math.round(x / 10 ** (Math.floor(Math.log10(x)) - 2)) * 10 ** (Math.floor(Math.log10(x)) - 2) : Math.round(x));
  // Cada balón dibujado vale 100 y la caja punteada es la meta de 1000: lo dice el título de la fila (lector en frío:
  // «hay 20 balones dibujados y dice 211»).
  const juego5 = v => { const n = balones5(mg1(v.mg)); return coc([
    { tipo: 'balanza', titulo: 'Masa que desaparece', carga: 'pizca', pantalla: `${f(mg1(v.mg), 1)} mg`, color: 'o' },
    { tipo: 'balon', titulo: 'Un balón de gas', rotulos: [{ texto: 'unos 4,6 × 10⁸ J', color: 'd' }] },
    { tipo: 'balones', fila: 1, titulo: 'Cada balón dibujado vale 100; la caja punteada, 1000', valor: n, por: 100, total: 20, meta: 1000, color: 'h', rotulos: [{ texto: `unos ${f(redondo(n), 0)} balones`, color: 'h' }] },
  ]); };
  const lectura5 = v => [vO(`${f(mg1(v.mg), 1)} mg`), ' → ', dR(`${cien(Motor.energia(mg1(v.mg) * 1e-6).E)} J`), ': ', vH(`unos ${f(redondo(balones5(mg1(v.mg))), 0)} balones`), '.'];
  const DEF_E = ['E = ', dmO, ' · ', c2i];
  const DEF_C = 'c = 3 × 10⁸ m/s, la rapidez de la luz';
  const DEF_MG = '1 g = 1000 mg;  1 kg = 1000 g';
  const DEF_BALON = 'Un balón de gas de 10 kg da unos 4,6 × 10⁸ J al quemarse';
  const DEF_POT = 'Potencias de 10: al multiplicar, los exponentes se suman';
  // Tipo 0 a 4 (el caso del Así se resuelve sale de otra lista con la misma semilla).
  const MASAS5 = [[2, 'mg'], [5, 'mg'], [20, 'mg'], [50, 'mg'], [0.5, 'g'], [2, 'g']];
  const ENERGIAS5 = [9e10, 4.5e13, 1.8e12, 2.7e14, 9e13];
  const DEFECTOS5 = [{ texto: 'una reacción nuclear en el Sol', antes: 4.0312, despues: 4.0026, u: 'g' }, { texto: 'una reacción nuclear', antes: 2000, despues: 1998, u: 'g' },
    { texto: 'la fisión de un trozo de uranio', antes: 1000, despues: 999.1, u: 'g' }, { texto: 'una reacción nuclear', antes: 10, despues: 9.99, u: 'g' }];
  const aKg = (x, u) => (u === 'mg' ? x * 1e-6 : u === 'g' ? x * 1e-3 : x);
  function caso5(s, otro) {
    const tipo = s % 5, r = azar(s + (otro ? 900 : 0));
    if (tipo === 0) {
      const [x, u] = MASAS5[idx(s, MASAS5.length, otro)], kg = aKg(x, u), e = Motor.energia(kg);
      return { tipo, x, u, kg, e, datos: [DEF_E, DEF_C, DEF_MG],
        pregunta: ['En un proceso nuclear desaparecen ', vO(`${f(x)} ${u}`), ' de masa. ¿Cuánta energía se libera?'],
        opciones: opciones(e.E, [
          { id: 'sinkg', valor: x * C2, error: 'QM-G-KG', siFuera: `Multiplicaste por c², bien. Pero la masa va en kg: ${f(x)} ${u} no son ${f(x)} kg.` },
          { id: 'sinc2', valor: e.errores.sinCuadrado, error: 'QM-MC', siFuera: 'Pasaste a kg, bien. Pero c va al cuadrado: por 9 × 10¹⁶, no por 3 × 10⁸.' },
          { id: 'mil', valor: e.E * 1000, error: 'QM-G-KG', siFuera: 'Multiplicaste por c², bien. Revisa el paso a kg: te sobra un factor 1000.' },
        ], v => `${cien(v)} J`) };
    }
    if (tipo === 1) {
      const E = ENERGIAS5[idx(s, ENERGIAS5.length, otro)], m = Motor.masaDeEnergia(E);
      return { tipo, E, m, datos: ['E = Δm · c²', DEF_C, '1 kg = 1000 g'],
        pregunta: ['Un proceso nuclear libera ', dR(`${cien(E)} J`), '. ¿Cuántos gramos de masa desaparecieron?'],
        opciones: opciones(m.g, [
          { id: 'kg', valor: m.kg, error: 'QM-G-KG', siFuera: 'Dividiste entre c², bien. Ese resultado está en kg: falta pasarlo a gramos.' },
          { id: 'sinc2', valor: m.errores.sinCuadrado * 1000, error: 'QM-MC', siFuera: 'Despejaste bien. Pero se divide entre c², no entre c.' },
          { id: 'mult', valor: Math.min(m.errores.multiplica, 1e40) * 1000, error: 'QM-MULTIPLICA', siFuera: 'Usaste c², bien. Para hallar la masa, se divide la energía entre c².' },
        ], v => `${cien(v)} g`) };
    }
    if (tipo === 2) {
      const x = DEFECTOS5[idx(s, DEFECTOS5.length, otro)], dmg = Math.round((x.antes - x.despues) * 1e6) / 1e6, kg = dmg / 1000, E = kg * C2;
      return { tipo, x, dmg, kg, E, datos: [['E = ', dmO, ' · ', c2i, ', con ', dmO, ': masa antes menos masa después'], DEF_C, '1 kg = 1000 g'],
        pregunta: [`En ${x.texto}, la masa pasa de ${f(x.antes, 4)} g a ${f(x.despues, 4)} g. ¿Cuánta energía se liberó?`],
        opciones: opciones(E, [
          { id: 'total', valor: x.antes / 1000 * C2, error: 'QM-TODA-MASA', siFuera: 'Usaste c², bien. Pero solo la masa que falta se vuelve energía, no toda.' },
          { id: 'sinkg', valor: dmg * C2, error: 'QM-G-KG', siFuera: 'Restaste bien las masas. Falta pasar los gramos a kg.' },
          { id: 'sinc2', valor: kg * Motor.C, error: 'QM-MC', siFuera: 'La masa que falta está bien. Pero c va al cuadrado.' },
        ], v => `${cien(v)} J`) };
    }
    if (tipo === 3) {
      const mg = r.de([1, 2, 5, 10, 50]), e = Motor.energia(mg * 1e-6).E, n = e / E_BALON;
      return { tipo, mg, e, n, datos: [DEF_E, DEF_C, '1 kg = 1 000 000 mg', DEF_BALON],
        pregunta: ['Si desaparecen ', vO(`${mg} mg`), ' en un proceso nuclear, ¿a cuántos balones de gas equivale la energía que sale?'],
        opciones: opciones(redondo(n), [
          { id: 'g', valor: redondo(n * 1000), error: 'QM-G-KG', siFuera: 'La idea está bien. Revisa el paso de mg a kg: sobra un factor 1000.' },
          { id: 'uno', valor: redondo(n / 1000), error: 'QM-G-KG', siFuera: 'La idea está bien. Revisa el paso de mg a kg: falta un factor 1000.' },
        ], v => `Unos ${f(v, v < 1 ? 3 : 0)}`) };
    }
    if ((Math.floor(s / 5) + (otro ? 1 : 0)) % 2 === 0) {
      const mg = r.de([2, 4, 6, 8]), kg = mg * 1e-6, e = Motor.energia(kg);
      return { tipo, km: true, mg, kg, e, datos: ['E = Δm · c²', 'c = 300 000 km/s', '1 km = 1000 m', '1 kg = 1 000 000 mg'],
        pregunta: ['Desaparecen ', vO(`${mg} mg`), ' de masa en un proceso nuclear. ¿Cuántos joules salen?'],
        opciones: opciones(e.E, [
          { id: 'km', valor: e.errores.cEnKmPorS, error: 'QM-C-KM', siFuera: 'Pasaste la masa a kg, bien. Pero c tiene que estar en m/s: 3 × 10⁸ m/s.' },
          { id: 'sinkg', valor: mg * C2, error: 'QM-G-KG', siFuera: 'c está bien en m/s. Falta pasar los mg a kg.' },
          { id: 'sinc2', valor: e.errores.sinCuadrado, error: 'QM-MC', siFuera: 'Las unidades están bien. Pero c va al cuadrado.' },
        ], v => `${cien(v)} J`) };
    }
    const kgU = r.de([1, 2, 5]), dmg = 0.9 * kgU, E = dmg / 1000 * C2;
    return { tipo, km: false, kgU, dmg, E, datos: ['E = Δm · c²', DEF_C, '1 kg = 1000 g'],
      pregunta: [`En un reactor, ${kgU} kg de uranio se ${kgU === 1 ? 'fisiona' : 'fisionan'} y, al final, a los productos les faltan `, vO(`${f(dmg)} g`), '. ¿Cuánta energía salió?'],
      opciones: opciones(E, [
        { id: 'total', valor: kgU * C2, error: 'QM-TODA-MASA', siFuera: 'Usaste c², bien. Pero solo la masa que falta se vuelve energía, no todo el uranio.' },
        { id: 'sinkg', valor: dmg * C2, error: 'QM-G-KG', siFuera: 'Tomaste la masa que falta, bien. Falta pasarla a kg.' },
        { id: 'resta', valor: (kgU - dmg / 1000) * C2, error: 'QM-TODA-MASA', siFuera: 'Esa es la masa que queda. Se usa la que falta.' },
      ], v => `${cien(v)} J`) };
  }

  // Ejemplos resueltos de la idea 5: 5 por nivel. N1, un paso (E de 1 g y de 1 kg, Δm de una energía, c², mg a kg); N2,
  // dos pasos (mg a kg y por c², la masa que falta, el inverso en gramos, balones, c en km/s); N3, de examen (el Sol,
  // el balón que casi no pierde masa, la masa total como error, un gramo en balones, el reactor). Lo pedido va con «?».
  // Cuentas revisadas aparte (17 nov, script fuera del repo, cuentas-materia.py, que no usa este archivo ni el motor): 10⁻³·9·10¹⁶ =
  // 9·10¹³; 9·10¹⁶; 9·10¹⁰/9·10¹⁶ = 10⁻⁶ kg = 1 mg; (3·10⁸)² = 9·10¹⁶; 5 mg = 5·10⁻⁶ kg; 2·10⁻⁵·9·10¹⁶ = 1,8·10¹²;
  // 2000 − 1998 = 2 g, 2·10⁻³·9·10¹⁶ = 1,8·10¹⁴; 4,5·10¹³/9·10¹⁶ = 5·10⁻⁴ kg = 0,5 g; 9·10¹⁰/4,6·10⁸ ≈ 195,7;
  // 3·10⁵ km/s = 3·10⁸ m/s, 2·10⁻⁶·9·10¹⁶ = 1,8·10¹¹; 4,0312 − 4,0026 = 0,0286 g, 2,86·10⁻⁵·9·10¹⁶ ≈ 2,6·10¹²;
  // 4,6·10⁸/9·10¹⁶ ≈ 5,1·10⁻⁹ kg; 0,9 g → 8,1·10¹³ (no 9·10¹⁶); 9·10¹³/4,6·10⁸ ≈ 195 652; 0,0071 kg·9·10¹⁶ ≈ 6,4·10¹⁴.
  // Correcciones del 17 nov (lector en frío), rehechas con otro script fuera del repo (cuentas-corr.py, sin este archivo):
  // todas las respuestas que cambiaron de forma o de color dan lo mismo; ver rutinas/frio/quimica.materia-y-energia.md.
  const EJEMPLOS_MASA = [
    { nivel: 1, titulo: 'Un gramo que desaparece',
      enunciado: ['En un proceso nuclear desaparece ', vO('1 g'), ' de masa, o sea 0,001 kg. ¿Cuánta energía sale?'],
      datos: [DEF_E, 'c² = 9 × 10¹⁶ m²/s²'],
      solucion: [{ texto: ['Se multiplica la masa en kg por c².'], ecuacion: [Ef, ' = ', vO('0,001'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('9 × 10¹³ J')] }],
      respuesta: [dR('9 × 10¹³ J')] },
    { nivel: 1, titulo: 'Un kilogramo entero',
      enunciado: ['Si desapareciera ', vO('1 kg'), ' de masa entero, ¿cuánta energía saldría?'],
      datos: [DEF_E, 'c² = 9 × 10¹⁶ m²/s²'],
      solucion: [{ texto: ['La masa ya está en kg.'], ecuacion: [Ef, ' = ', vO('1'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('9 × 10¹⁶ J')] }],
      respuesta: [dR('9 × 10¹⁶ J')] },
    { nivel: 1, titulo: 'De la energía a la masa',
      enunciado: ['Un proceso nuclear libera ', dR('9 × 10¹⁰ J'), '. ¿Cuántos kg de masa desaparecieron?'],
      datos: [DEF_E, 'c² = 9 × 10¹⁶ m²/s²'],
      solucion: [{ texto: ['Se despeja la masa: la energía entre c².'], ecuacion: [dmO, ' = ', { frac: [dR('9 × 10¹⁰'), vI('9 × 10¹⁶')] }, ' = ', vO('10⁻⁶ kg'), ', un miligramo'] }],
      respuesta: [vO('10⁻⁶ kg'), ' = 1 mg'] },
    { nivel: 1, titulo: 'La luz al cuadrado',
      enunciado: 'La rapidez de la luz es c = 3 × 10⁸ m/s. ¿Cuánto vale c²?',
      datos: [DEF_C, 'Potencia de una potencia: (10⁸)² = 10¹⁶'],
      solucion: [{ texto: ['Se eleva al cuadrado el 3 y también la potencia de 10.'], ecuacion: ['(3 × 10⁸)² = 9 × 10¹⁶ ', '= ', dR('9 × 10¹⁶ m²/s²')] }],
      respuesta: [dR('9 × 10¹⁶ m²/s²')] },
    { nivel: 1, titulo: 'Miligramos a kilogramos',
      enunciado: ['¿Cuántos kilogramos son ', vO('5 mg'), '?'],
      datos: ['1 kg = 1 000 000 mg = 10⁶ mg'],
      solucion: [{ texto: ['Un millón de miligramos hacen un kilogramo: se divide entre 10⁶.'], ecuacion: [vO('5'), ' ÷ 10⁶ = ', dR('5 × 10⁻⁶ kg')] }],
      respuesta: [dR('5 × 10⁻⁶ kg')] },
    { nivel: 2, titulo: 'Veinte miligramos',
      enunciado: ['En un proceso nuclear desaparecen ', vO('20 mg'), '. ¿Cuánta energía sale?'],
      datos: [DEF_E, DEF_C, '1 kg = 10⁶ mg', DEF_POT],
      figura: fig2([{ tipo: 'balanza', titulo: 'Masa que desaparece', carga: 'pizca', pantalla: '20 mg', color: 'o', rotulos: [{ texto: 'E = ?' }] }]),
      solucion: [
        { texto: ['Primero a kg.'], ecuacion: [dmO, ' = 20 ÷ 10⁶ = ', vO('2 × 10⁻⁵ kg')] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('2 × 10⁻⁵'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('1,8 × 10¹² J')] },
      ],
      respuesta: [dR('1,8 × 10¹² J')] },
    { nivel: 2, titulo: 'La masa que falta',
      enunciado: 'En una reacción nuclear, la masa pasa de 2000 g a 1998 g. ¿Cuánta energía se liberó?',
      datos: [['E = ', dmO, ' · ', c2i, ', con ', dmO, ': masa antes menos masa después'], DEF_C, '1 kg = 1000 g'],
      solucion: [
        { texto: ['La masa que falta, en kg.'], ecuacion: [dmO, ' = 2000 − 1998 = 2 g = ', vO('0,002 kg')] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('0,002'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('1,8 × 10¹⁴ J')] },
      ],
      respuesta: [dR('1,8 × 10¹⁴ J')] },
    { nivel: 2, titulo: 'Cuánta masa, en gramos',
      enunciado: ['Un reactor libera ', dR('4,5 × 10¹³ J'), '. ¿Cuántos gramos de masa desaparecieron?'],
      datos: [DEF_E, DEF_C, '1 kg = 1000 g', DEF_POT],
      solucion: [
        { texto: ['Primero c²: se eleva al cuadrado el 3 y también la potencia de 10.'], ecuacion: [c2i, ' = (3 × 10⁸)² = 3² × 10⁸ · 10⁸ = ', vI('9 × 10¹⁶')] },
        { texto: ['Se despeja la masa; sale en kg.'], ecuacion: [dmO, ' = ', { frac: [dR('4,5 × 10¹³'), vI('9 × 10¹⁶')] }, ' = ', vO('5 × 10⁻⁴ kg')] },
        { texto: ['A gramos.'], ecuacion: ['5 × 10⁻⁴ · 1000 = ', vO('0,5 g')] },
      ],
      respuesta: [vO('0,5 g')] },
    { nivel: 2, titulo: 'Un miligramo en balones',
      enunciado: ['Si desaparece 1 mg de masa, sale ', dR('9 × 10¹⁰ J'), '. ¿A cuántos balones de gas de cocina equivale?'],
      datos: [DEF_BALON],
      figura: fig2([{ tipo: 'balanza', titulo: 'Masa que desaparece', carga: 'pizca', pantalla: '1 mg', color: 'o' }, { tipo: 'balon', titulo: 'Un balón de gas', rotulos: [{ texto: 'unos 4,6 × 10⁸ J', color: 'd' }] }]),
      solucion: [
        { texto: ['Se divide la energía entre la de un balón.'], ecuacion: [{ frac: [dR('9 × 10¹⁰ J'), vD('4,6 × 10⁸ J')] }, ' ≈ ', vH('196')] },
        { texto: ['Unos 196 balones: lo que una familia gasta en muchos años.'] },
      ],
      respuesta: [vH('Unos 196 balones')] },
    { nivel: 2, titulo: 'La luz en km/s',
      enunciado: ['Desaparecen ', vO('2 mg'), ' de masa. Si c = 300 000 km/s, ¿cuántos joules salen?'],
      datos: ['E = Δm · c²', '1 km = 1000 m', '1 kg = 10⁶ mg'],
      solucion: [
        { texto: ['Todo en kg y m/s.'], ecuacion: [vO('2 × 10⁻⁶ kg'), ';  ', vI('c'), ' = 300 000 · 1000 = 3 × 10⁸ m/s'] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('2 × 10⁻⁶'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('1,8 × 10¹¹ J')] },
      ],
      respuesta: [dR('1,8 × 10¹¹ J')] },
    { nivel: 3, titulo: 'Lo que pierde el Sol',
      enunciado: 'En el Sol, núcleos de hidrógeno con 4,0312 g de masa forman núcleos de helio con 4,0026 g. ¿Cuánta energía se libera?',
      datos: [['E = ', dmO, ' · ', c2i, ', con ', dmO, ': masa antes menos masa después'], DEF_C, '1 kg = 1000 g'],
      figura: fig2([{ tipo: 'balanza2', titulo: 'En el Sol', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'izq', rotulos: [{ texto: 'E = ?' }] }]),
      solucion: [
        { texto: ['La masa que falta, en kg.'], ecuacion: [dmO, ' = 4,0312 − 4,0026 = 0,0286 g = ', vO('2,86 × 10⁻⁵ kg')] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('2,86 × 10⁻⁵'), ' · ', vI('9 × 10¹⁶'), ' ≈ ', dR('2,6 × 10¹² J')] },
        { texto: ['Error típico: usar los 4,0312 g enteros. Solo la masa que falta se vuelve energía.'] },
      ],
      respuesta: [dR('Unos 2,6 × 10¹² J')] },
    { nivel: 3, titulo: 'El balón que casi no pierde',
      enunciado: ['Al quemarse, un balón de gas de 10 kg da unos ', vD('4,6 × 10⁸ J'), '. ¿Cuánta masa pierde el sistema? ¿Se nota en una balanza?'],
      datos: ['E = Δm · c²', DEF_C],
      solucion: [
        { texto: ['Se despeja la masa que falta, con c² = (3 × 10⁸)² = 9 × 10¹⁶; la energía es la del balón.'], ecuacion: [dmO, ' = ', { frac: [vD('4,6 × 10⁸'), vI('9 × 10¹⁶')] }, ' ≈ ', vO('5 × 10⁻⁹ kg')] },
        { texto: ['Son unas cinco millonésimas de gramo, en 10 kg de gas: ninguna balanza la nota.'] },
        { texto: ['Por eso, en un cambio químico, se dice que la masa se conserva.'] },
      ],
      respuesta: [vO('Unos 5 × 10⁻⁹ kg'), '; no se nota'] },
    { nivel: 3, titulo: 'No toda la masa',
      enunciado: ['En un reactor, 1 kg de uranio se fisiona y a los productos les faltan ', vO('0,9 g'), '. ¿Cuánta energía salió?'],
      datos: ['E = Δm · c²', DEF_C, '1 kg = 1000 g'],
      solucion: [
        { texto: ['Solo la masa que falta se vuelve energía: 0,9 g = 9 × 10⁻⁴ kg.'] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('9 × 10⁻⁴'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('8,1 × 10¹³ J')] },
        { texto: ['Error típico: usar 1 kg entero y obtener 9 × 10¹⁶ J, mil veces más.'] },
      ],
      respuesta: [dR('8,1 × 10¹³ J')] },
    { nivel: 3, titulo: 'Un gramo en balones',
      enunciado: ['¿A cuántos balones de gas de 10 kg equivale la energía de ', vO('1 g'), ' de masa que desaparece?'],
      datos: [DEF_E, DEF_C, '1 kg = 1000 g', DEF_POT, DEF_BALON],
      figura: fig2([{ tipo: 'balanza', titulo: 'Masa que desaparece', carga: 'pizca', pantalla: '1 g', color: 'o' }, { tipo: 'balon', titulo: 'Un balón de gas', rotulos: [{ texto: 'unos 4,6 × 10⁸ J', color: 'd' }] }]),
      solucion: [
        { texto: ['La masa en kg y c al cuadrado.'], ecuacion: [dmO, ' = 1 ÷ 1000 = ', vO('0,001 kg'), ';  ', c2i, ' = (3 × 10⁸)² = ', vI('9 × 10¹⁶')] },
        { texto: ['La energía del gramo.'], ecuacion: [Ef, ' = ', vO('0,001'), ' · ', vI('9 × 10¹⁶'), ' = ', dR('9 × 10¹³ J')] },
        { texto: ['Entre la de un balón.'], ecuacion: [{ frac: [dR('9 × 10¹³'), vD('4,6 × 10⁸')] }, ' ≈ ', vH('195 652')] },
        { texto: ['Unos 200 000 balones: un solo gramo.'] },
      ],
      respuesta: [vH('Unos 200 000 balones')] },
    { nivel: 3, titulo: 'Un kilogramo de hidrógeno',
      enunciado: 'En el Sol, al formar helio, a cada kilogramo de hidrógeno le faltan unos 7,1 g. ¿Cuánta energía sale por cada kilogramo?',
      datos: ['E = Δm · c²', DEF_C, '1 kg = 1000 g'],
      solucion: [
        { texto: ['La masa que falta, en kg.'], ecuacion: [dmO, ' = 7,1 g = ', vO('0,0071 kg')] },
        { texto: ['Por c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.'], ecuacion: [Ef, ' = ', vO('0,0071'), ' · ', vI('9 × 10¹⁶'), ' ≈ ', dR('6,4 × 10¹⁴ J')] },
        { texto: ['Es lo que darían más de un millón de balones de gas.'] },
      ],
      respuesta: [dR('Unos 6,4 × 10¹⁴ J')] },
  ];

  // Potencias de 10 escritas con superíndices de Unicode («10⁻⁶») → potencias de la ecuación ({ sup: ['10', '−6'] }).
  // Dentro de una variable con color, la base y el exponente quedan del mismo color y la unidad sigue en tinta.
  const SUP_A = { '⁻': '−', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  const RE_POT = /10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/;
  // En los textos con tope corto (siFuera, pasos de Mira, lecturas, tarjetas) solo se cambian los exponentes con ⁰ o ⁻,
  // los que la fuente no trae: una potencia de la ecuación se cuenta como «elevado a» y suma palabras.
  const MALO = /10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁻⁰][⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/;
  const potCorto = x => (typeof x === 'string' ? (MALO.test(x) ? potencias(x) : x) : Array.isArray(x) ? x.map(potCorto)
    : x && typeof x === 'object' && 'v' in x ? (MALO.test(x.t) ? potencias(x) : x) : x);
  const deSup = x => [...x].map(c => SUP_A[c]).join('');
  function trozosPot(t, envolver) {
    const out = [];
    let resto = String(t), m;
    while ((m = resto.match(RE_POT))) {
      const antes = resto.slice(0, m.index);
      out.push({ sup: [envolver(`${antes}10`), envolver(deSup(m[1]))] });
      resto = resto.slice(m.index + m[0].length);
    }
    if (resto) out.push(resto);
    return out;
  }
  function potencias(x) {
    if (x === null || x === undefined || typeof x === 'number') return x;
    if (typeof x === 'string') return RE_POT.test(x) ? trozosPot(x, String) : x;
    if (Array.isArray(x)) return x.map(potencias);
    if (typeof x !== 'object') return x;
    if ('v' in x) return RE_POT.test(x.t) ? trozosPot(x.t, t => ({ v: x.v, t })) : x;
    const y = {};
    for (const [k, v] of Object.entries(x)) y[k] = ['nota', 'llave', 'frac', 'sup', 'raiz', 'par', 'abs', 'tacha', 'vec'].includes(k) ? potencias(v) : v;
    return y;
  }
  const potCaso = c => Object.assign({}, c, ...['enunciado', 'pregunta', 'datos', 'respuesta'].filter(k => k in c).map(k => ({ [k]: potencias(c[k]) })),
    c.pasos ? { pasos: c.pasos.map(p => Object.assign({}, p, { texto: potencias(p.texto), ecuacion: p.ecuacion && potencias(p.ecuacion) })) } : {},
    c.solucion ? { solucion: Array.isArray(c.solucion) ? c.solucion.map(p => Object.assign({}, p, { texto: potencias(p.texto), ecuacion: p.ecuacion && potencias(p.ecuacion) }))
      : Object.assign({}, c.solucion, { texto: potencias(c.solucion.texto), ecuacion: c.solucion.ecuacion && potencias(c.solucion.ecuacion) }) } : {},
    c.opciones ? { opciones: c.opciones.map(o => Object.assign({}, o, { texto: potencias(o.texto), siFuera: o.siFuera && potCorto(o.siFuera) })) } : {});

  const energia = {
    id: 'masa-energia',
    titulo: 'Poca masa, muchísima energía',
    pregunta: '¿De dónde sale la enorme energía de lo nuclear?',
    temas: ['Equivalencia masa-energía'],
    pieza: 'quim-cocina',
    actividad: 'Hacer desaparecer unos miligramos y contar a cuántos balones de gas equivalen.',
    aprendizaje: 'Cuando un proceso nuclear libera energía, lo que queda pesa un poco menos: E = Δm·c². Un gramo equivale a unos 200 000 balones.',
    ejemplos: EJEMPLOS_MASA,
    // Lee: Einstein, químico contra nuclear, las unidades y qué mirar. No dice que el sistema pierde masa al soltar
    // energía (es la predicción) ni da la fórmula.
    lee: {
      tarjetas: [
        { titulo: 'Masa y energía', texto: 'En 1905, Einstein propuso que la masa y la energía están ligadas, y que en esa relación entra la rapidez de la luz, c: unos 300 000 km por segundo, 3 × 10⁸ m/s. La energía se mide en joules (J).' },
        { titulo: 'Químico y nuclear', texto: 'Al quemar el gas de un balón, los átomos se reordenan: es un cambio químico. En el Sol, núcleos de hidrógeno se unen y forman helio: es la fusión nuclear. Los dos sueltan energía, pero no la misma.',
          pieza: 'quim-cocina', dibujo: coc([{ tipo: 'balon', titulo: 'Un balón de gas', rotulos: [{ texto: 'unos 4,6 × 10⁸ J', color: 'd' }] }]) },
        { titulo: 'Números muy grandes y muy chicos', texto: 'Un miligramo (mg) es la milésima parte de un gramo, y un kilogramo tiene un millón de miligramos. La energía se mide en joules (J). 10⁸ es un 1 seguido de ocho ceros.' },
        { titulo: 'Qué mirar', texto: 'En el juego, una masa diminuta desaparece en un proceso nuclear. Cada balón dibujado vale por cien balones de gas: mira cuántos hacen falta para igualar esa energía.' },
      ],
    },
    juega: {
      pieza: 'quim-cocina',
      consigna: 'Un balón de gas de 10 kg da unos 4,6 × 10⁸ J al quemarse. Aquí, en cambio, solo desaparecen unos miligramos.',
      mision: {
        texto: 'Encuentra la menor masa que, al desaparecer, da tanta energía como 1000 balones.',
        // Lo comprueba el motor (MotorMateria.energia) con c = 3 × 10⁸ m/s: la menor masa de la grilla que llega a 1000.
        logrado: v => balones5(v.mg) >= 1000 && balones5(v.mg - 0.1) < 1000,
        bien: 'Listo: unos 5,2 mg bastan para mil balones de gas.',
      },
      voz: 'Mira cuántos balones vale cada miligramo.',
      leyenda: [
        { s: dmO, t: 'masa que desaparece' },
        { s: Ef, t: 'energía que sale de esa masa' },
        { s: vD('un balón'), t: 'la energía de un balón, para comparar' },
        { s: vH('balones'), t: 'a cuántos balones equivale E' },
        { s: 'mg', t: 'miligramo: milésima de gramo' },
        { s: 'J', t: 'joule, unidad de energía' },
        { s: '× 10⁸', t: 'por cien millones' },
      ],
      controles: [{ id: 'mg', etiqueta: 'Masa que desaparece, Δm', color: 'c-o', min: 0.1, max: 10, paso: 0.1, inicio: 0.5, unidad: 'mg', decimales: 1, auto: { velocidad: 1, modo: 'rebota' } }],
      dibujo: v => juego5(v),
      lectura: v => lectura5(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'En el Sol, cuatro núcleos de hidrógeno se juntan y forman uno de helio, y sale mucha luz y calor. ¿Cuánto pesa el helio que se formó, comparado con los cuatro hidrógenos?',
      voz: 'Piensa de dónde sale la luz del Sol.',
      pieza: 'quim-cocina',
      opciones: [
        { id: 'c', texto: 'Un poquito menos', correcta: true },
        { id: 'igual', texto: 'Exactamente lo mismo: la masa siempre se conserva', error: 'QM-MASA-IGUAL', siFuera: 'En lo químico, eso es casi exacto. En lo nuclear, la energía que sale se lleva masa.' },
        { id: 'nada', texto: 'Nada: toda la masa se volvió luz', error: 'QM-TODA-MASA', siFuera: 'Sale masa como luz, bien. Pero solo un poquito: casi todo queda como helio.' },
        { id: 'mas', texto: 'Más, porque el helio es un núcleo más grande', error: 'QM-MAS-PESADO', siFuera: 'El helio es más grande que cada hidrógeno, cierto. Pero pesa menos que los cuatro juntos.' },
      ],
      dibujo: coc([{ tipo: 'balanza2', titulo: 'En el Sol', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'duda' }]),
      revelar: coc([{ tipo: 'balanza2', titulo: 'En el Sol', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'izq',
        rotulos: [{ texto: '4,0312 u contra 4,0026 u' }] }]),
      coincide: 'Coincide: el helio pesa cerca de 0,7 % menos. Esa masa salió como luz y calor.',
      noCoincide: 'El helio pesa un poquito menos, cerca de 0,7 %: esa masa salió como luz y calor.',
    },
    mira: {
      pieza: 'quim-cocina',
      datos: coc([{ tipo: 'balanza2', titulo: 'En el Sol', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'izq',
        rotulos: [{ texto: 'unos 4,0312 u contra 4,0026 u', desde: 1 }, { texto: 'Δm = 0,0286 u', color: 'o', desde: 2 }] }]).datos,
      voz: 'Sigamos la masa que falta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los cuatro hidrógenos tienen unos 4,0312 u; el helio, unos 4,0026 u.', ecuacion: ['u: unidad de masa para átomos, unos 1,66 × 10⁻²⁷ kg'] },
        { estado: { corte: 2 }, texto: 'Falta un poco de masa: 0,0286 u, cerca del 0,7 %.', ecuacion: [dmO, ' = 4,0312 − 4,0026 = 0,0286 u'] },
        { estado: { corte: 2 }, texto: 'Esa masa que falta salió como luz y calor.', ecuacion: [Ef, ' = ', dmO, ' · ', c2i] },
        { estado: { corte: 2 }, texto: 'En 1 kg de hidrógeno faltan unos 7 g: salen unos 6,4 × 10¹⁴ J.', ecuacion: [Ef, ' = 0,0071 · 9 × 10¹⁶ ≈ 6,4 × 10¹⁴ J'] },
        { estado: { corte: 2 }, texto: 'Un balón que arde da unos 4,6 × 10⁸ J: pierde muy poca masa.', ecuacion: [dmO, ' = ', { frac: [Ef, c2i] }, ' ≈ 5 × 10⁻⁹ kg'] },
        { estado: { corte: 2 }, texto: 'En lo químico, ninguna balanza nota esa masa; en lo nuclear, sí se mide.' },
      ],
    },
    regla: {
      texto: 'Cuando un sistema suelta energía, su masa baja un poco. Esa masa que falta, por la rapidez de la luz al cuadrado, da la energía.',
      ecuacion: [Ef, ' = ', { llave: [dmO], nota: 'masa que falta', color: 'c-o' }, ' · ', { llave: [c2i], nota: 'c = 3 × 10⁸ m/s', color: 'c-i' }],
      condicion: 'Δm es la masa antes menos la masa después, en kg; no la masa total. E sale en joules.',
      voz: 'La masa no se vuelve energía entera: solo la diferencia.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso5(s, true)).
    resuelve: {
      pieza: 'quim-cocina',
      generar(s) {
        const c = caso5(s, true);
        const sentido = 'Unidades: kg · m²/s² es un joule. Y un número enorme: c² es enorme.';
        if (c.tipo === 0) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden la energía ', Ef, ' que sale cuando desaparece esa masa.'] },
            { tipo: 'datos', texto: [`La masa, ${f(c.x)} ${c.u}, va en kg.`], ecuacion: [dmO, ` = ${f(c.x)} ${c.u} = `, vO(`${cien(c.kg)} kg`)] },
            { tipo: 'regla', texto: 'La energía es la masa que falta por c².', ecuacion: [Ef, ' = ', dmO, ' · ', c2i, ', con c² = (3 × 10⁸)² = 9 × 10¹⁶ m²/s²'] },
            { tipo: 'cuentas', texto: 'Multiplico.', ecuacion: [Ef, ' = ', vO(cien(c.kg)), ' · ', vI('9 × 10¹⁶'), ' = ', dR(`${cien(c.e.E)} J`)] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: [dR(`${cien(c.e.E)} J`)],
        };
        if (c.tipo === 1) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden la masa que desapareció, en gramos.' },
            { tipo: 'regla', texto: 'De E = Δm · c² se despeja la masa: la energía entre c², con c² = (3 × 10⁸)² = 9 × 10¹⁶.', ecuacion: [dmO, ' = ', { frac: [Ef, c2i] }] },
            { tipo: 'cuentas', texto: 'Divido, y paso los kg a gramos.', ecuacion: [dmO, ' = ', { frac: [dR(cien(c.E)), vI('9 × 10¹⁶')] }, ` = ${cien(c.m.kg)} kg = `, vO(`${cien(c.m.g)} g`)] },
            { tipo: 'sentido', texto: 'Comprobación: de vuelta, la masa en kg por 9 × 10¹⁶ da la energía del dato.' },
          ],
          respuesta: [vO(`${cien(c.m.g)} g`)],
        };
        if (c.tipo === 2) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden la energía ', Ef, ' que salió.'] },
            { tipo: 'datos', texto: 'Solo la masa que falta se vuelve energía: antes menos después.', ecuacion: [dmO, ` = ${f(c.x.antes, 4)} − ${f(c.x.despues, 4)} = ${f(c.dmg, 4)} g = `, vO(`${cien(c.kg)} kg`)] },
            { tipo: 'regla', texto: 'La energía es la masa que falta por c².', ecuacion: [Ef, ' = ', dmO, ' · ', c2i] },
            { tipo: 'cuentas', texto: 'Multiplico.', ecuacion: [Ef, ' = ', vO(cien(c.kg)), ' · ', vI('9 × 10¹⁶'), ' = ', dR(`${cien(c.E)} J`)] },
            { tipo: 'sentido', texto: 'Comprobación: con la masa total saldría muchísimo más; casi toda la masa sigue ahí.' },
          ],
          respuesta: [dR(`${cien(c.E)} J`)],
        };
        if (c.tipo === 3) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántos balones de gas dan la misma energía.' },
            { tipo: 'regla', texto: 'Primero la energía, E = Δm · c², con la masa en kg; después, cuántas veces cabe la energía de un balón.' },
            { tipo: 'cuentas', texto: `${c.mg} mg = ${cien(c.mg * 1e-6)} kg.`, ecuacion: [Ef, ` = ${cien(c.mg * 1e-6)} · 9 × 10¹⁶ = `, dR(`${cien(c.e)} J`), ';  ', { frac: [dR(cien(c.e)), vD('4,6 × 10⁸')] }, ' ≈ ', vH(f(redondo(c.n), 0))] },
            { tipo: 'sentido', texto: 'Comprobación: unos miligramos valen cientos o miles de balones, como en el juego.' },
          ],
          respuesta: [vH(`Unos ${f(redondo(c.n), 0)} balones`)],
        };
        if (c.km) return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden la energía ', Ef, ' en joules.'] },
            { tipo: 'datos', texto: 'Para que salgan joules, la masa en kg y c en m/s.', ecuacion: [vO(`${cien(c.kg)} kg`), ';  ', vI('c'), ' = 300 000 · 1000 = 3 × 10⁸ m/s'] },
            { tipo: 'regla', texto: 'La energía es la masa que falta por c².', ecuacion: [Ef, ' = ', dmO, ' · ', c2i] },
            { tipo: 'cuentas', texto: 'Multiplico.', ecuacion: [Ef, ' = ', vO(cien(c.kg)), ' · ', vI('9 × 10¹⁶'), ' = ', dR(`${cien(c.e.E)} J`)] },
            { tipo: 'sentido', texto: 'Comprobación: con c en km/s el resultado sale un millón de veces menor.' },
          ],
          respuesta: [dR(`${cien(c.e.E)} J`)],
        };
        return {
          enunciado: c.pregunta, datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: ['Piden la energía ', Ef, ' que salió del reactor.'] },
            { tipo: 'datos', texto: `Solo cuenta la masa que falta, ${f(c.dmg)} g, no los ${c.kgU} kg de uranio.`, ecuacion: [dmO, ` = ${f(c.dmg)} g = `, vO(`${cien(c.dmg / 1000)} kg`)] },
            { tipo: 'regla', texto: 'La energía es la masa que falta por c².', ecuacion: [Ef, ' = ', dmO, ' · ', c2i] },
            { tipo: 'cuentas', texto: 'Multiplico.', ecuacion: [Ef, ' = ', vO(cien(c.dmg / 1000)), ' · ', vI('9 × 10¹⁶'), ' = ', dR(`${cien(c.E)} J`)] },
            { tipo: 'sentido', texto: 'Comprobación: con el uranio entero saldría unas mil veces más.' },
          ],
          respuesta: [dR(`${cien(c.E)} J`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-cocina',
      voz: 'Pasa la masa a kilogramos primero.',
      generar(s) {
        const c = caso5(s, false);
        let solucion;
        if (c.tipo === 0) solucion = { texto: `${f(c.x)} ${c.u} = ${cien(c.kg)} kg; por c².`, ecuacion: [Ef, ` = ${cien(c.kg)} · 9 × 10¹⁶ = `, dR(`${cien(c.e.E)} J`)] };
        else if (c.tipo === 1) solucion = { texto: 'Energía entre c², y de kg a gramos.', ecuacion: [vO(`${cien(c.m.g)} g`)] };
        else if (c.tipo === 2) solucion = { texto: 'Solo la masa que falta, en kg, por c².', ecuacion: [Ef, ` = ${cien(c.kg)} · 9 × 10¹⁶ = `, dR(`${cien(c.E)} J`)] };
        else if (c.tipo === 3) solucion = { texto: 'Energía con E = Δm · c², y después entre la de un balón.', ecuacion: [vH(`Unos ${f(redondo(c.n), 0)}`)] };
        else if (c.km) solucion = { texto: 'Masa en kg y c en m/s: 3 × 10⁸.', ecuacion: [Ef, ` = ${cien(c.kg)} · 9 × 10¹⁶ = `, dR(`${cien(c.e.E)} J`)] };
        else solucion = { texto: 'Solo la masa que falta, en kg, por c².', ecuacion: [dR(`${cien(c.E)} J`)] };
        return { pregunta: c.pregunta, datos: c.datos, opciones: c.opciones, solucion };
      },
    },
  };

  // Las potencias de 10 de toda la idea, como potencias de la ecuación (ver potencias()).
  energia.ejemplos = EJEMPLOS_MASA.map(potCaso);
  for (const t of energia.lee.tarjetas) t.texto = potCorto(t.texto);
  energia.juega.consigna = potCorto(energia.juega.consigna);
  energia.juega.lectura = v => potCorto(lectura5(v));
  energia.mira.pasos = energia.mira.pasos.map(p => Object.assign({}, p, { texto: potCorto(p.texto), ecuacion: p.ecuacion && potencias(p.ecuacion) }));
  energia.regla.ecuacion = potencias(energia.regla.ecuacion);
  for (const m of ['resuelve', 'ahoraTu']) { const g = energia[m].generar; energia[m].generar = s => potCaso(g(s)); }

  // ---------- Idea 6: la mitad cada cierto tiempo (vida media) ----------
  // Pedido de Gerson en la mesa de revisión (17 nov, docs/etapa2/decisiones.md, «Cambios posteriores»): la vida media
  // vuelve a la unidad como idea propia, con el hueso de C-14 que la idea 3 ya mostró. Sin partículas subatómicas: los
  // átomos de carbono-14 se cuentan en la lupa, no se desarman (ni protones ni neutrones, ni alfa ni beta; tampoco la
  // palabra «isótopo», que el glosario del curso define con neutrones en estructura atómica).
  // Primera pantalla: el hueso de una llama en un museo (quim-vasos, objeto de prueba), con su lupa de 16 átomos de C-14.
  // Cambia: los años que pasan · Permanece: el hueso al morir, a la izquierda, con sus 16 átomos · Progresa: los átomos de
  // C-14 que pasan a N-14 · Se reserva: la segunda vida media (es la predicción: el juego llega solo hasta 5730 años) ·
  // Debe verse: en una vida media se va la mitad, y después la mitad de lo que queda.
  // Un dibujo es de partículas o de variables, nunca de los dos: el hueso y su lupa van con la paleta de elementos (C y N,
  // un par que sí se distingue: Elementos.VISTAS), y la curva de masa de los ejemplos y de «Ahora tú» va en quim-cocina con
  // los colores de variable. Colores (un color por magnitud en toda la unidad): la masa y lo que queda o se desintegró de
  // la sustancia radiactiva (m, m₀, átomos, fracción o porcentaje), naranja, como la masa de las ideas 2 a 5; el tiempo que
  // pasa (t), turquesa; la vida media (t₁/₂), violeta; las vidas medias que caben (n), carmín, como las cuentas de la
  // idea 5. Letras: t₁/₂ es la de los libros de academia; n no choca con nada en la unidad.
  // Vidas medias de libro, con «unos» y sin fuente (molde §4): carbono-14 unos 5730 años (el valor de los libros y los
  // exámenes; NUBASE2020 da 5700 ± 30), cobalto-60 unos 5,3 años, cesio-137 unos 30, estroncio-90 unos 29, yodo-131 unos
  // 8 días, fósforo-32 unos 14 días y tecnecio-99m unas 6 horas. Masas creíbles (contrato, punto 10): en gramos solo las
  // fuentes grandes que existen (cobalto de una planta que irradia alimentos, cesio de un equipo de radioterapia,
  // estroncio de un generador de faro); lo de hospital y el carbono-14 de un hueso van en fracción o porcentaje.
  // La cuenta la hace el motor de la escena materia-energia (MotorMateria.desintegracion y atomosQueQuedan; regla 1).
  // Códigos (hipótesis, docs/investigacion/cinetica-ideas-erroneas.md, «Vida media»; los AQ-vm-* son los de
  // conversiones-quimica y de la plantilla vida-media): AQ-vm-lineal (se pierde lo mismo cada vida media: en dos se acaba),
  // AQ-vm-divide-entre-2n, AQ-vm-desintegrada (lo que se fue por lo que queda), AQ-vm-tiempo-como-una-vida,
  // AQ-vm-una-vida-de-menos y de-mas, AQ-vm-multiplica-fraccion, AQ-vm-divide-vida-media, AQ-vm-sin-convertir (un día como
  // una vida media de horas), AQ-vm-lee-tiempo-sin-mitad, AQ-vm-lee-otra-marca (leer en la curva otro punto que la mitad)
  // y las nuevas QM-VM-SE-DETIENE (lo que queda ya no cambia) y QM-VM-CUENTA-DOBLE (dividir lo que queda entre 2ⁿ).
  const VM_C14 = 5730, N_HUESO = 16;
  // 5730, no «5 730»; 11 460 con un espacio que no parte la línea (un título partía «Tras 11 / 460 años»).
  const ent6 = x => f(Math.round(x * 100) / 100, 2).replace(/^(−?\d)\s(\d{3})(?=,|$)/, '$1$2').replace(/(\d)\s(\d{3})/g, '$1\u00a0$2');
  const v6m = t => vO(t), v6t = t => vI(t), v6v = t => dR(t), v6n = t => vH(t);
  const mS = v6m('m'), m0S = { sub: [v6m('m'), v6m('0')] }, nS = v6n('n'), tS = v6t('t'), thS = { sub: [v6v('t'), v6v('1/2')] };
  const pot2 = n => ({ sup: ['2', n] });
  // Fracciones de potencias de 2 (1/8, 15/16) y porcentajes (87,5 %).
  const fr6 = x => { for (let d = 1; d <= 4096; d *= 2) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return d === 1 ? String(Math.round(x)) : `${Math.round(x * d)}/${d}`; return f(x, 3); };
  const pc6 = x => `${f(Math.round(x * 1e4) / 100, 2)} %`;
  const des6 = (m0, tMedia, t) => Motor.desintegracion({ m0, tMedia, t });
  const quedan6 = t => Motor.atomosQueQuedan(N_HUESO, t, VM_C14);
  // El hueso con su lupa: k átomos de C-14 y el resto ya de N-14 (las mismas celdas: los que cambian se ven en su sitio).
  const hueso6 = (titulo, k, desde) => ({ tipo: 'hueso', titulo, lupa: Object.assign(L3(0.1, [{ particulas: [{ e: 'C', n: k }, { e: 'N', n: N_HUESO - k }] }]), desde ? { desde } : {}) });
  const huesos6 = (rs, sep) => mesa3(rs, { separacion: sep || (rs.length === 3 ? 16 : 18) });
  // El tiempo del juego, en años enteros (el control animado pasa por valores intermedios).
  const ano6 = t => Math.round(t);
  const juego6 = v => huesos6([hueso6('Al morir', N_HUESO), hueso6(ano6(v.t) === 0 ? 'Recién muerta' : `${ent6(ano6(v.t))} años después`, quedan6(ano6(v.t)))]);
  const lectura6 = v => [v6t(`${ent6(ano6(v.t))} años`), ': quedan ', v6m(`${quedan6(ano6(v.t))} de 16`), ' átomos de carbono-14.'];
  // Datos (contrato, punto 13): la definición y las fórmulas generales, nunca la cuenta hecha.
  const DEF_VM6 = 'Vida media: tiempo en que se desintegra la mitad de lo que hay';
  const DEF_M6 = ['Tras ', nS, ' vidas medias queda ', mS, ' = ', { frac: [m0S, pot2(nS)] }, ', con ', m0S, ' lo que había al inicio'];
  const DEF_N6 = [nS, ' = ', { frac: [tS, thS] }, ', con ', thS, ' la vida media: vidas medias que caben en el tiempo ', tS];
  const DEF_F6 = ['Fracción que queda tras ', nS, ' vidas medias: 1/', pot2(nS)];
  const DEF_D6 = 'Lo desintegrado es lo que falta: lo que había menos lo que queda';
  const vida6 = (nombre, txt) => [`Vida media del ${nombre}: `, thS, ' = ', v6v(txt)];
  // Fuentes con masa creíble (en gramos) y sustancias de hospital (en fracción o porcentaje).
  const GRANDES6 = [
    { nombre: 'cobalto-60', vm: 5.3, txt: 'unos 5,3 años', donde: 'Una planta que irradia alimentos tiene', masas: [20, 40, 64, 80] },
    { nombre: 'cesio-137', vm: 30, txt: 'unos 30 años', donde: 'Un equipo antiguo de radioterapia guarda', masas: [4, 8, 12, 16] },
    { nombre: 'estroncio-90', vm: 29, txt: 'unos 29 años', donde: 'El generador eléctrico de un faro antiguo tiene', masas: [40, 80, 120, 160] },
  ];
  const HOSPITAL6 = [
    { nombre: 'yodo-131', vm: 8, u: 'días', txt: 'unos 8 días', uso: 'se usa para tratar la tiroides' },
    { nombre: 'tecnecio-99m', vm: 6, u: 'horas', txt: 'unas 6 horas', uso: 'se usa para tomar imágenes en hospitales' },
    { nombre: 'fósforo-32', vm: 14, u: 'días', txt: 'unos 14 días', uso: 'se usa en algunos tratamientos médicos' },
  ];
  const g6 = x => `${ent6(x)} g`;
  const anos6 = x => `${ent6(x)} años`;
  // Un caso de cada tipo; «Así se resuelve» toma otro (otro = true): otra fuente y, en los tipos con dos variantes, la otra.
  function caso6(s, otro) {
    const tipo = s % 5, r = azar(s + (otro ? 900 : 0)), alterna = (Math.floor(s / 5) + (otro ? 1 : 0)) % 2 === 0;
    if (tipo === 0) {   // masa que queda
      const x = GRANDES6[idx(s, GRANDES6.length, otro)], m0 = r.de(x.masas), n = r.de([2, 3]), t = Math.round(n * x.vm * 100) / 100, d = des6(m0, x.vm, t);
      return { tipo, x, m0, n, t, d, datos: [DEF_M6, DEF_N6, vida6(x.nombre, x.txt)],
        pregunta: [`${x.donde} `, v6m(`${m0} g`), ` de ${x.nombre}. ¿Cuántos gramos quedarán dentro de `, v6t(anos6(t)), '?'],
        opciones: opciones(d.queda, [
          { id: 'n2', valor: d.errores.entre2n, error: 'AQ-vm-divide-entre-2n', siFuera: `Contaste ${n} vidas medias, bien. Pero cada una divide entre 2 lo que queda: entre 2${SUP[n]}, no entre 2 × ${n}.` },
          { id: 'des', valor: d.desintegrado, error: 'AQ-vm-desintegrada', siFuera: 'Hiciste bien las mitades. Pero ese número es lo que se desintegró; piden lo que queda.' },
          { id: 'una', valor: d.errores.unaSola, error: 'AQ-vm-tiempo-como-una-vida', siFuera: `Dividiste entre 2, bien. Pero en ${anos6(t)} caben ${n} vidas medias, no una.` },
          { id: 'lin', valor: d.errores.lineal, error: 'AQ-vm-lineal', siFuera: 'Se va perdiendo, bien. Pero cada vida media se va la mitad de lo que queda: nunca se acaba.' },
          { id: 'menos', valor: m0 / 2 ** (n - 1), error: 'AQ-vm-una-vida-de-menos', siFuera: `Dividiste entre 2 cada vida media, bien. Pero en ${anos6(t)} caben ${n}, no ${n - 1}.` },
          { id: 'mas', valor: m0 / 2 ** (n + 1), error: 'AQ-vm-una-vida-de-mas', siFuera: `Dividiste entre 2 cada vida media, bien. Pero en ${anos6(t)} caben ${n}, no ${n + 1}.` },
        ], g6) };
    }
    if (tipo === 1) {   // tiempo que pasó
      if (alterna) {
        const n = r.de([2, 3]), t = n * VM_C14, q = 2 ** -n, txt = r.de([0, 1]) ? `la ${n === 2 ? 'cuarta' : 'octava'} parte` : `el ${pc6(q).replace(' %', '')} %`;
        return { tipo, c14: true, n, t, q, datos: [DEF_F6, DEF_N6, vida6('carbono-14', 'unos 5730 años')],
          pregunta: ['Un hueso hallado en una cueva de los Andes conserva ', v6m(txt), ' del carbono-14 que tenía al morir el animal. ¿Hace cuántos años murió?'],
          opciones: opciones(t, [
            { id: 'pot', valor: 2 ** n * VM_C14, error: 'AQ-vm-multiplica-fraccion', siFuera: `Usaste la vida media, bien. Pero ${2 ** n} es 2${SUP[n]}: son ${n} vidas medias, no ${2 ** n}.` },
            { id: 'menos', valor: (n - 1) * VM_C14, error: 'AQ-vm-una-vida-de-menos', siFuera: `Multiplicaste por la vida media, bien. Pero para quedar 1/${2 ** n} hacen falta ${n} mitades.` },
            { id: 'mas', valor: (n + 1) * VM_C14, error: 'AQ-vm-una-vida-de-mas', siFuera: `Multiplicaste por la vida media, bien. Pero contaste una mitad de más: 1/${2 ** n} son ${n}.` },
          ], anos6) };
      }
      const x = HOSPITAL6[idx(s, HOSPITAL6.length, otro)], n = r.de([3, 4]), t = n * x.vm;
      return { tipo, c14: false, x, n, t, datos: [DEF_F6, DEF_N6, vida6(x.nombre, x.txt)],
        pregunta: [`El ${x.nombre} ${x.uso}. ¿Cuánto tiempo pasa hasta que de una dosis quede `, v6m(`1/${2 ** n}`), '?'],
        opciones: opciones(t, [
          { id: 'pot', valor: 2 ** n * x.vm, error: 'AQ-vm-multiplica-fraccion', siFuera: `Usaste la vida media, bien. Pero ${2 ** n} es 2${SUP[n]}: son ${n} vidas medias.` },
          { id: 'menos', valor: (n - 1) * x.vm, error: 'AQ-vm-una-vida-de-menos', siFuera: `Multiplicaste por la vida media, bien. Pero para llegar a 1/${2 ** n} hacen falta ${n} mitades.` },
          { id: 'div', valor: x.vm / 2 ** n, error: 'AQ-vm-divide-vida-media', siFuera: 'Usaste la fracción, bien. Pero mientras menos queda, más tiempo pasó: se multiplica la vida media.' },
        ], v => `${ent6(v)} ${x.u}`) };
    }
    if (tipo === 2) {   // porcentaje que se desintegra
      const x = HOSPITAL6[idx(s, HOSPITAL6.length, otro)], n = r.de([2, 3, 4]), t = n * x.vm, d = des6(100, x.vm, t);
      return { tipo, x, n, t, d, datos: [DEF_N6, DEF_F6, DEF_D6, vida6(x.nombre, x.txt)],
        pregunta: [`El ${x.nombre} ${x.uso}. ¿Qué porcentaje de una dosis se desintegra en `, v6t(`${t} ${x.u}`), '?'],
        opciones: opciones(d.desintegrado, [
          { id: 'queda', valor: d.queda, error: 'AQ-vm-desintegrada', siFuera: `Hiciste bien las ${n} mitades. Pero ese es el porcentaje que queda; piden el que se desintegra.` },
          ...(n === 2 ? [{ id: 'lin', valor: 100, error: 'AQ-vm-lineal', siFuera: 'Se desintegra más con el tiempo, bien. Pero cada vida media se va la mitad de lo que queda.' }] : []),
          { id: 'una', valor: 50, error: 'AQ-vm-tiempo-como-una-vida', siFuera: `La mitad en una vida media, bien. Pero en ${t} ${x.u} caben ${n} vidas medias.` },
          { id: 'menos', valor: 100 * (1 - 2 ** -(n - 1)), error: 'AQ-vm-una-vida-de-menos', siFuera: `Calculaste lo desintegrado, bien. Pero en ${t} ${x.u} caben ${n} vidas medias, no ${n - 1}.` },
        ], v => pc6(v / 100)) };
    }
    if (tipo === 3) {   // hallar la vida media: de dos masas o leída en la curva
      const x = GRANDES6[idx(s, 2, otro)], m0 = x.nombre === 'cesio-137' ? 16 : 48, n = 2, t = Math.round(n * x.vm * 100) / 100;
      const vm6 = v => `${ent6(v)} años`;
      if (alterna) return { tipo, curva: true, x, m0, n, t, datos: [DEF_VM6],
        dibujo: curva6(x, m0),
        pregunta: [`La gráfica muestra cómo baja la masa de ${x.nombre} de una fuente. ¿Cuál es su vida media?`],
        opciones: opciones(x.vm, [
          { id: 'cuarto', valor: 2 * x.vm, error: 'AQ-vm-lee-otra-marca', siFuera: `Leíste bien el eje del tiempo. Pero a ${vm6(2 * x.vm)} queda la cuarta parte, no la mitad.` },
          { id: 'medio', valor: x.vm / 2, error: 'AQ-vm-lee-otra-marca', siFuera: `Buscaste en el eje del tiempo, bien. Pero a ${vm6(x.vm / 2)} todavía no se va la mitad.` },
          { id: 'fin', valor: 4 * x.vm, error: 'AQ-vm-lineal', siFuera: 'La curva baja, bien. Pero la vida media no es cuando casi se acaba: es cuando queda la mitad.' },
        ], vm6) };
      return { tipo, curva: false, x, m0, n, t, datos: [DEF_VM6, DEF_N6],
        pregunta: [`Una fuente de ${x.nombre} pasa de `, v6m(`${m0} g`), ' a ', v6m(`${m0 / 4} g`), ' en ', v6t(anos6(t)), '. ¿Cuál es su vida media?'],
        opciones: opciones(x.vm, [
          { id: 'todo', valor: t, error: 'AQ-vm-tiempo-como-una-vida', siFuera: `Usaste el tiempo, bien. Pero en ${anos6(t)} no queda la mitad sino la cuarta parte: son 2 vidas medias.` },
          { id: 'cuatro', valor: t / 4, error: 'AQ-vm-divide-entre-2n', siFuera: 'Viste que queda la cuarta parte, bien. Pero 1/4 son 2 mitades: el tiempo se divide entre 2.' },
          { id: 'doble', valor: 2 * t, error: 'AQ-vm-multiplica-fraccion', siFuera: 'Contaste 2 mitades, bien. Pero esas 2 vidas medias caben en el tiempo dado: se divide, no se multiplica.' },
        ], vm6) };
    }
    if (alterna) {   // examen: unidades mezcladas (horas y días, días y semanas)
      const x = otro ? HOSPITAL6[2] : HOSPITAL6[1], n = x.u === 'horas' ? 4 : 3, eq = x.u === 'horas' ? '1 día = 24 h' : '1 semana = 7 días';
      const cuando = x.u === 'horas' ? 'un día después' : 'seis semanas después', q = 2 ** -n;
      return { tipo, mezcla: true, x, n, eq, q, datos: [DEF_N6, DEF_F6, vida6(x.nombre, x.txt), eq],
        pregunta: [`A un paciente le aplican ${x.nombre}, que ${x.uso}. ¿Qué fracción de la dosis queda `, v6t(cuando), '?'],
        opciones: opciones(q, [
          { id: 'sin', valor: x.u === 'horas' ? 0.5 : 2 ** -6, error: 'AQ-vm-sin-convertir', siFuera: `Dividiste entre 2, bien. Pero el tiempo y la vida media van en la misma unidad: ${eq}.` },
          { id: 'des', valor: 1 - q, error: 'AQ-vm-desintegrada', siFuera: 'Contaste bien las vidas medias. Pero esa fracción es la que se desintegró; piden la que queda.' },
          { id: 'menos', valor: 2 * q, error: 'AQ-vm-una-vida-de-menos', siFuera: `Pasaste a la misma unidad, bien. Pero caben ${n} vidas medias, no ${n - 1}.` },
        ], fr6) };
    }
    // examen: la vida media sale de los datos y después se usa (como lo pregunta San Marcos)
    const x = otro ? GRANDES6[0] : GRANDES6[1], m0 = x.nombre === 'cesio-137' ? 64 : 80, t1 = Math.round(2 * x.vm * 100) / 100, t2 = Math.round(5 * x.vm * 100) / 100, d = des6(m0, x.vm, t2);
    return { tipo, mezcla: false, x, m0, t1, t2, d, datos: [DEF_VM6, DEF_M6, DEF_N6],
      pregunta: [`Una fuente de ${x.nombre} pasa de `, v6m(`${m0} g`), ' a ', v6m(`${m0 / 4} g`), ' en ', v6t(anos6(t1)), '. ¿Cuántos gramos quedarán a los ', v6t(anos6(t2)), ' de empezar?'],
      opciones: opciones(d.queda, [
        { id: 'sinmitad', valor: m0 / 2 ** (t2 / t1), error: 'AQ-vm-lee-tiempo-sin-mitad', siFuera: `Dividiste entre 2 por tramo, bien. Pero en ${anos6(t1)} no se fue la mitad: pasaron 2 vidas medias.` },
        { id: 'des', valor: d.desintegrado, error: 'AQ-vm-desintegrada', siFuera: 'Hallaste bien la vida media. Pero ese número es lo que se desintegró; piden lo que queda.' },
        { id: 'menos', valor: m0 / 2 ** 4, error: 'AQ-vm-una-vida-de-menos', siFuera: `La vida media está bien. Pero en ${anos6(t2)} caben 5, no 4.` },
      ], g6) };
  }
  // La curva de masa de una fuente: lo que se pide (la vida media) no va rotulado; el eje del tiempo marca cada vida media.
  function curva6(x, m0) {
    const xmax = 4.5 * x.vm, pts = Array.from({ length: 46 }, (_, i) => [xmax * i / 45, m0 * 2 ** -(4.5 * i / 45)]);
    return coc([{ tipo: 'curva', titulo: `Masa de ${x.nombre}`, puntos: pts, xmax, ymin: 0, ymax: m0 * 1.1, xMarcas: [0, 1, 2, 3].map(k => Math.round(k * x.vm * 100) / 100),
      yMarcas: [0, m0 / 4, m0 / 2, m0], x: 't (años)', y: 'm (g)', colorX: 'i', colorY: 'o' }],
    { alt: `Curva de la masa de ${x.nombre} de una fuente: empieza en ${m0} g y baja cada vez más despacio; el eje del tiempo va de 0 a ${ent6(xmax)} años.` });
  }

  // Ejemplos resueltos de la idea 6: 5 por nivel. N1, un paso (una mitad, contar vidas medias, la fracción, lo
  // desintegrado, la lupa del hueso); N2, dos pasos (masa con n, edad de un hueso, porcentaje desintegrado, hallar la vida
  // media, leerla en la curva); N3, de examen (un perezoso gigante en porcentaje, la fracción desintegrada, horas y días,
  // la vida media que sale de los datos y se usa, cuánto falta). Lo pedido no va en la figura.
  // Cuentas revisadas aparte (17 nov, script fuera del repo, cuentas-vida-media.py en el scratchpad de la sesión, con
  // fracciones exactas, que no usa este archivo ni el motor): 12/2 = 6; 24/8 = 3; (1/2)³ = 1/8; 16 − 4 = 12; 16 → 8 → 4 son 2; 15,9/5,3 = 3, 40/8 = 5; 1/4 = (1/2)²,
  // 2 · 5730 = 11 460; 18/6 = 3, 100 − 12,5 = 87,5; 48 → 24 → 12 son 2, 10,6/2 = 5,3; la curva de 16 g pasa por 8 g a
  // los 30 años; 6,25 % = 1/16 = (1/2)⁴, 4 · 5730 = 22 920; 32/8 = 4, 1 − 1/16 = 15/16; 24/6 = 4, 1/16 = 6,25 %;
  // 64 → 16 en 60 años son 2 vidas medias de 30, 150/30 = 5, 64/32 = 2; de 1/4 a 1/16 son 2 mitades más, 11 460 años.
  const EJEMPLOS_VIDA = [
    { nivel: 1, titulo: 'Una sola vida media',
      enunciado: ['Un equipo antiguo de radioterapia guarda ', v6m('12 g'), ' de cesio-137. ¿Cuántos gramos quedan después de una vida media?'],
      datos: [DEF_VM6],
      solucion: [{ texto: ['En una vida media se desintegra la mitad de lo que hay.'], ecuacion: [v6m('12'), ' ÷ 2 = ', v6m('6 g')] }],
      respuesta: [v6m('6 g')] },
    { nivel: 1, titulo: 'Contar vidas medias',
      enunciado: ['El yodo-131 se usa para tratar la tiroides. ¿Cuántas vidas medias pasan en ', v6t('24 días'), '?'],
      datos: [DEF_N6, vida6('yodo-131', 'unos 8 días')],
      solucion: [{ texto: ['Se ve cuántas veces cabe la vida media en el tiempo.'], ecuacion: [nS, ' = ', { frac: [v6t('24'), v6v('8')] }, ' = ', v6n('3')] }],
      respuesta: [v6n('3 vidas medias')] },
    { nivel: 1, titulo: 'La fracción que queda',
      enunciado: '¿Qué fracción del carbono-14 que tenía al morir conserva un hueso después de 3 vidas medias?',
      datos: [DEF_VM6],
      solucion: [{ texto: ['Cada vida media deja la mitad de lo que había.'], ecuacion: ['1 → 1/2 → 1/4 → ', v6m('1/8')] }],
      respuesta: [v6m('1/8')] },
    { nivel: 1, titulo: 'Lo que se desintegró',
      enunciado: ['Una fuente tenía ', v6m('16 g'), ' de cesio-137 y hoy le quedan ', v6m('4 g'), '. ¿Cuántos gramos se desintegraron?'],
      datos: [DEF_D6],
      solucion: [{ texto: ['Lo desintegrado es lo que falta.'], ecuacion: [v6m('16'), ' − ', v6m('4'), ' = ', v6m('12 g')] }],
      respuesta: [v6m('12 g')] },
    { nivel: 1, titulo: 'El hueso del museo',
      enunciado: 'La lupa muestra los átomos de carbono-14 de un hueso al morir el animal y hoy. ¿Cuántas vidas medias pasaron?',
      datos: [DEF_VM6],
      figura: Object.assign({ pieza: 'quim-vasos' }, huesos6([hueso6('Al morir', 16), hueso6('Hoy', 4)])),
      solucion: [{ texto: ['Al morir había 16 bolitas grises; hoy hay 4. Cada vida media deja la mitad.'], ecuacion: [v6m('16'), ' → ', v6m('8'), ' → ', v6m('4'), ': ', v6n('2'), ' mitades'] }],
      respuesta: [v6n('2 vidas medias')] },
    { nivel: 2, titulo: 'El cobalto que irradia',
      enunciado: ['Una planta que irradia alimentos tiene ', v6m('40 g'), ' de cobalto-60. ¿Cuántos gramos quedarán dentro de ', v6t('15,9 años'), '?'],
      datos: [DEF_M6, DEF_N6, vida6('cobalto-60', 'unos 5,3 años')],
      solucion: [
        { texto: ['Primero, cuántas vidas medias caben.'], ecuacion: [nS, ' = ', { frac: [v6t('15,9'), v6v('5,3')] }, ' = ', v6n('3')] },
        { texto: ['Después, se divide entre 2 tres veces.'], ecuacion: [mS, ' = ', { frac: [v6m('40'), pot2(v6n('3'))] }, ' = ', { frac: [v6m('40'), '8'] }, ' = ', v6m('5 g')] },
      ],
      respuesta: [v6m('5 g')] },
    { nivel: 2, titulo: 'La edad de un hueso',
      enunciado: ['Un hueso hallado en una cueva de los Andes conserva ', v6m('la cuarta parte'), ' del carbono-14 que tenía al morir el animal. ¿Hace cuántos años murió?'],
      datos: [DEF_F6, DEF_N6, vida6('carbono-14', 'unos 5730 años')],
      solucion: [
        { texto: ['La cuarta parte es la mitad de la mitad.'], ecuacion: [v6m('1/4'), ' = 1/', pot2(v6n('2')), ': ', v6n('2'), ' vidas medias'] },
        { texto: ['El tiempo es n veces la vida media.'], ecuacion: [tS, ' = ', v6n('2'), ' · ', v6v('5730'), ' = ', v6t('11 460 años')] },
      ],
      respuesta: [v6t('Unos 11 460 años')] },
    { nivel: 2, titulo: 'El porcentaje que se va',
      enunciado: ['El tecnecio-99m se usa para tomar imágenes en hospitales. ¿Qué porcentaje de una dosis se desintegra en ', v6t('18 horas'), '?'],
      datos: [DEF_N6, DEF_F6, DEF_D6, vida6('tecnecio-99m', 'unas 6 horas')],
      solucion: [
        { texto: ['Caben 3 vidas medias, así que queda 1/8.'], ecuacion: [nS, ' = ', { frac: [v6t('18'), v6v('6')] }, ' = ', v6n('3'), ';  1/', pot2(v6n('3')), ' = ', v6m('1/8'), ' = ', v6m('12,5 %')] },
        { texto: ['Lo que se desintegra es lo que falta.'], ecuacion: ['100 % − ', v6m('12,5 %'), ' = ', v6m('87,5 %')] },
      ],
      respuesta: [v6m('87,5 %')] },
    { nivel: 2, titulo: 'Hallar la vida media',
      enunciado: ['Una fuente de cobalto-60 pasa de ', v6m('48 g'), ' a ', v6m('12 g'), ' en ', v6t('10,6 años'), '. ¿Cuál es su vida media?'],
      datos: [DEF_VM6, DEF_N6],
      solucion: [
        { texto: ['Se cuentan las mitades.'], ecuacion: [v6m('48'), ' → ', v6m('24'), ' → ', v6m('12'), ': ', v6n('2'), ' vidas medias'] },
        { texto: ['Esas dos vidas medias caben en el tiempo dado.'], ecuacion: [thS, ' = ', { frac: [v6t('10,6'), v6n('2')] }, ' = ', v6v('5,3 años')] },
      ],
      respuesta: [v6v('5,3 años')] },
    { nivel: 2, titulo: 'Leer la curva',
      enunciado: 'La gráfica muestra cómo baja la masa de cesio-137 de una fuente sellada. ¿Cuál es su vida media?',
      datos: [DEF_VM6],
      figura: Object.assign({ pieza: 'quim-cocina' }, curva6(GRANDES6[1], 16)),
      solucion: [
        { texto: ['Al inicio hay 16 g; la mitad son 8 g.'], ecuacion: [v6m('16 g'), ' ÷ 2 = ', v6m('8 g')] },
        { texto: ['La curva pasa por 8 g en la marca de 30 años: esa es la vida media. Comprobación: a los 60 años quedan 4 g.'] },
      ],
      respuesta: [v6v('30 años')] },
    { nivel: 3, titulo: 'Un perezoso gigante',
      enunciado: ['Un hueso de perezoso gigante conserva el ', v6m('6,25 %'), ' del carbono-14 que tenía al morir. ¿Hace cuántos años murió?'],
      datos: [DEF_F6, DEF_N6, vida6('carbono-14', 'unos 5730 años')],
      figura: Object.assign({ pieza: 'quim-vasos' }, huesos6([hueso6('Al morir', 16), hueso6('Hoy', 1)])),
      solucion: [
        { texto: ['El porcentaje como fracción de potencia de 2.'], ecuacion: [v6m('6,25 %'), ' = ', v6m('1/16'), ' = 1/', pot2(v6n('4')), ': ', v6n('4'), ' vidas medias'] },
        { texto: ['El tiempo.'], ecuacion: [tS, ' = ', v6n('4'), ' · ', v6v('5730'), ' = ', v6t('22 920 años')] },
        { texto: ['Error típico: 100 ÷ 6,25 = 16 y tomar 16 vidas medias. Son 4, porque 16 = 2⁴.'] },
      ],
      respuesta: [v6t('Unos 22 920 años')] },
    { nivel: 3, titulo: 'La dosis de yodo',
      enunciado: ['El yodo-131 se usa para tratar la tiroides. ¿Qué fracción de una dosis se desintegra en ', v6t('32 días'), '?'],
      datos: [DEF_N6, DEF_F6, DEF_D6, vida6('yodo-131', 'unos 8 días')],
      solucion: [
        { texto: ['Cuántas vidas medias caben y qué fracción queda.'], ecuacion: [nS, ' = ', { frac: [v6t('32'), v6v('8')] }, ' = ', v6n('4'), ';  queda 1/', pot2(v6n('4')), ' = ', v6m('1/16')] },
        { texto: ['Lo desintegrado es lo que falta.'], ecuacion: ['1 − ', v6m('1/16'), ' = ', v6m('15/16')] },
        { texto: ['Error típico: responder 1/16, que es lo que queda, no lo que se desintegró.'] },
      ],
      respuesta: [v6m('15/16')] },
    { nivel: 3, titulo: 'De un día al otro',
      enunciado: ['A un paciente le aplican tecnecio-99m a las 8 de la mañana. ¿Qué porcentaje de la dosis queda ', v6t('a las 8 del día siguiente'), '?'],
      datos: [DEF_N6, DEF_F6, vida6('tecnecio-99m', 'unas 6 horas'), '1 día = 24 h'],
      solucion: [
        { texto: ['El tiempo y la vida media, los dos en horas.'], ecuacion: [tS, ' = ', v6t('24 h'), ';  ', nS, ' = ', { frac: [v6t('24'), v6v('6')] }, ' = ', v6n('4')] },
        { texto: ['Lo que queda.'], ecuacion: ['1/', pot2(v6n('4')), ' = ', v6m('1/16'), ' = ', v6m('6,25 %')] },
        { texto: ['Error típico: tomar el día como una vida media y responder 50 %.'] },
      ],
      respuesta: [v6m('6,25 %')] },
    { nivel: 3, titulo: 'La vida media escondida',
      enunciado: ['Una fuente de cesio-137 pasa de ', v6m('64 g'), ' a ', v6m('16 g'), ' en ', v6t('60 años'), '. ¿Cuántos gramos quedarán a los ', v6t('150 años'), ' de empezar?'],
      datos: [DEF_VM6, DEF_M6, DEF_N6],
      solucion: [
        { texto: ['De 64 g a 16 g hay 2 mitades: caben 2 vidas medias en 60 años.'], ecuacion: [thS, ' = ', { frac: [v6t('60'), v6n('2')] }, ' = ', v6v('30 años')] },
        { texto: ['En 150 años caben 5.'], ecuacion: [nS, ' = ', { frac: [v6t('150'), v6v('30')] }, ' = ', v6n('5'), ';  ', mS, ' = ', { frac: [v6m('64'), pot2(v6n('5'))] }, ' = ', v6m('2 g')] },
        { texto: ['Error típico: 150 ÷ 60 = 2,5 tramos, como si en 60 años se fuera la mitad.'] },
      ],
      respuesta: [v6m('2 g')] },
    { nivel: 3, titulo: 'Cuánto falta todavía',
      enunciado: ['Un hueso conserva hoy ', v6m('la cuarta parte'), ' de su carbono-14. ¿Cuántos años más deben pasar para que conserve ', v6m('la dieciseisava parte'), '?'],
      datos: [DEF_F6, DEF_N6, vida6('carbono-14', 'unos 5730 años')],
      solucion: [
        { texto: ['Cada vida media divide entre 2 lo que queda.'], ecuacion: [v6m('1/4'), ' → ', v6m('1/8'), ' → ', v6m('1/16'), ': ', v6n('2'), ' vidas medias más'] },
        { texto: ['El tiempo que falta.'], ecuacion: [tS, ' = ', v6n('2'), ' · ', v6v('5730'), ' = ', v6t('11 460 años')] },
        { texto: ['Error típico: 16 ÷ 4 = 4 y tomar 4 vidas medias. De 1/4 a 1/16 solo hay 2 mitades.'] },
      ],
      respuesta: [v6t('11 460 años'), ' más'] },
  ];

  const vida = {
    id: 'vida-media',
    titulo: 'La mitad cada cierto tiempo',
    pregunta: '¿Cuánto queda de una sustancia radiactiva cuando pasa el tiempo?',
    temas: ['Vida media'],
    pieza: 'quim-vasos',
    actividad: 'Dejar pasar los años sobre un hueso y contar su carbono-14 en la lupa.',
    aprendizaje: 'En cada vida media se desintegra la mitad de lo que queda: tras n vidas medias queda m₀/2ⁿ, y en dos no se acaba.',
    ejemplos: EJEMPLOS_VIDA,
    // Lee: el hueso y su carbono-14 (lo nuclear de la idea 3), qué es desintegrarse y qué mirar. No dice cuánto tarda la
    // mitad (es la misión) ni qué pasa en la segunda vida media (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El reloj del hueso', texto: 'Los seres vivos tienen un poco de carbono-14 en el cuerpo y lo reponen al comer. Cuando un animal muere, ya no lo repone: sus átomos de carbono-14 pasan, de a pocos, a nitrógeno-14. Es el cambio nuclear de la idea 3.',
          pieza: 'quim-vasos', dibujo: huesos6([hueso6('Hueso de llama', N_HUESO)], 18) },
        { titulo: 'Desintegrarse', texto: 'Que un átomo cambie solo de elemento se llama desintegración, y una sustancia con átomos así es radiactiva. Nadie sabe qué átomo cambiará primero, pero con muchos átomos el ritmo siempre es el mismo.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la lupa muestra 16 átomos de carbono-14 del hueso: a la izquierda, al morir la llama; a la derecha, años después. Mueve el tiempo y cuenta cuántas bolitas grises quedan.' },
      ],
    },
    juega: {
      pieza: 'quim-vasos',
      consigna: 'Un museo guarda el hueso de una llama de una tumba antigua. Al morir el animal, su carbono-14 empezó a pasar a nitrógeno-14.',
      mision: {
        texto: 'Deja en el hueso la mitad de su carbono-14: 8 de 16 átomos.',
        // Lo comprueba el motor (MotorMateria.atomosQueQuedan) con la vida media del carbono-14, unos 5730 años.
        logrado: v => quedan6(ano6(v.t)) === N_HUESO / 2,
        bien: 'Listo: unos 5730 años. Ese tiempo es la vida media del carbono-14.',
      },
      voz: 'Cuenta las bolitas grises de la derecha.',
      leyenda: [
        { s: 'C', t: 'carbono-14: bolita gris llena' },
        { s: 'N', t: 'nitrógeno-14: bolita azul llena' },
        { s: v6t('años'), t: 'tiempo desde que murió la llama' },
        { s: v6m('de 16'), t: 'átomos de carbono-14 que quedan' },
        { s: '→', t: 'del hueso al morir al de después' },
        { s: 'lupa', t: 'modelo: 16 átomos de carbono-14 del hueso' },
      ],
      controles: [{ id: 't', etiqueta: 'Años desde que murió la llama, t', color: 'c-i', min: 0, max: VM_C14, paso: VM_C14 / 10, inicio: 0, unidad: 'años', decimales: 0, auto: { velocidad: VM_C14 / 10, modo: 'rebota' } }],
      dibujo: v => juego6(v),
      lectura: v => lectura6(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'Tras unos 5730 años, al hueso le quedan 8 de sus 16 átomos de carbono-14. Si pasan otros 5730 años, ¿cuántos átomos de carbono-14 le quedarán?',
      datos: ['Al morir la llama: 16 átomos de carbono-14 en la lupa', 'Vida media del carbono-14: unos 5730 años'],
      voz: 'Mira cuántas bolitas grises tiene la lupa del medio.',
      pieza: 'quim-vasos',
      opciones: [
        { id: 'c', texto: '4: se va la mitad de los 8', correcta: true },
        { id: 'acaba', texto: '0: se van los otros 8', error: 'AQ-vm-lineal', siFuera: 'Sigue bajando, bien. Pero cada 5730 años se va la mitad de lo que queda, no lo mismo que antes.' },
        { id: 'dos', texto: '2: los 8 se dividen entre 4', error: 'QM-VM-CUENTA-DOBLE', siFuera: 'Dividir otra vez es la idea, bien. Pero en 5730 años pasa una sola vida media: 8 ÷ 2.' },
        { id: 'ocho', texto: '8: lo que queda ya no cambia', error: 'QM-VM-SE-DETIENE', siFuera: 'Lo que queda es carbono-14, cierto. Pero se sigue desintegrando al mismo ritmo: otra mitad se va.' },
      ],
      dibujo: huesos6([hueso6('Al morir', N_HUESO), hueso6('5730 años después', 8), { tipo: 'hueso', titulo: '11 460 años después', lupa: { vacia: true, foco: 0.1 } }]),
      revelar: huesos6([hueso6('Al morir', N_HUESO), hueso6('5730 años después', 8), hueso6('11 460 años después', quedan6(2 * VM_C14))]),
      coincide: 'Coincide: quedan 4, la mitad de 8. Cada vida media se lleva la mitad de lo que queda.',
      noCoincide: 'Quedan 4, la mitad de los 8: cada vida media se lleva la mitad de lo que queda, no lo mismo.',
    },
    mira: {
      pieza: 'quim-vasos',
      datos: huesos6([hueso6('Tras 5730 años', 8, 1), hueso6('Tras 11 460 años', 4, 2), hueso6('Tras 17 190 años', 2, 3)]).datos,
      voz: 'Sigamos el hueso tres vidas medias.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Tras una vida media, unos 5730 años, quedan 8 de los 16 átomos.', ecuacion: [v6m('16'), ' ÷ 2 = ', v6m('8')] },
        { estado: { corte: 2 }, texto: 'Tras otra vida media se va la mitad de los 8: quedan 4.', ecuacion: [v6m('8'), ' ÷ 2 = ', v6m('4'), ', la cuarta parte de 16'] },
        { estado: { corte: 3 }, texto: 'Tras la tercera quedan 2: un octavo. Cada vida media divide entre 2.', ecuacion: [v6m('16'), ' ÷ 2 ÷ 2 ÷ 2 = ', { frac: [v6m('16'), pot2(v6n('3'))] }, ' = ', v6m('2')] },
        { estado: { corte: 3 }, texto: 'La masa de carbono-14 baja igual: entre 2 en cada vida media.', ecuacion: [mS, ' = ', { frac: [m0S, pot2(nS)] }] },
        { estado: { corte: 3 }, texto: 'n son las vidas medias que caben en el tiempo t.', ecuacion: [nS, ' = ', { frac: [tS, thS] }, ' = ', { frac: [v6t('17 190'), v6v('5730')] }, ' = ', v6n('3')] },
        { estado: { corte: 3 }, texto: 'Lo desintegrado es lo que falta: 14 de los 16 ya son nitrógeno-14.', ecuacion: [v6m('16'), ' − ', v6m('2'), ' = ', v6m('14'), ', o sea ', v6m('7/8')] },
      ],
    },
    regla: {
      texto: 'En cada vida media se desintegra la mitad de lo que queda. Tras n vidas medias queda lo inicial dividido entre 2ⁿ, y nunca se acaba de golpe.',
      ecuacion: [{ llave: [mS], nota: 'lo que queda', color: 'c-o' }, ' = ', { frac: [m0S, pot2(nS)] }, '   ·   ', { llave: [nS], nota: 'vidas medias', color: 'c-h' }, ' = ', { frac: [tS, thS] }],
      condicion: 't y la vida media, en la misma unidad. Lo desintegrado es m₀ − m; la fracción que queda, 1/2ⁿ.',
      voz: 'Cada vida media parte en dos lo que queda.',
    },
    // Así se resuelve: el mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (caso6(s, true)).
    resuelve: {
      pieza: 'quim-cocina',
      generar(s) {
        const c = caso6(s, true), base = { enunciado: c.pregunta, datos: c.datos };
        if (c.tipo === 0) return Object.assign(base, {
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa ', mS, ' que queda dentro de ', v6t(anos6(c.t)), '.'] },
            { tipo: 'regla', texto: 'Primero cuántas vidas medias caben; después, dividir entre 2 una vez por cada una.', ecuacion: [nS, ' = ', { frac: [tS, thS] }, ';  ', mS, ' = ', { frac: [m0S, pot2(nS)] }] },
            { tipo: 'cuentas', texto: 'Cuento y divido.', ecuacion: [nS, ' = ', { frac: [v6t(ent6(c.t)), v6v(ent6(c.x.vm))] }, ' = ', v6n(String(c.n)), ';  ', mS, ' = ', { frac: [v6m(String(c.m0)), pot2(v6n(String(c.n)))] }, ' = ', v6m(g6(c.d.queda))] },
            { tipo: 'sentido', texto: `Comprobación: de mitad en mitad, ${[...Array(c.n + 1).keys()].map(k => ent6(c.m0 / 2 ** k)).join(' → ')} g.` },
          ],
          respuesta: [v6m(g6(c.d.queda))] });
        if (c.tipo === 1) {
          const vm = c.c14 ? VM_C14 : c.x.vm, u = c.c14 ? 'años' : c.x.u;
          return Object.assign(base, {
            pasos: [
              { tipo: 'pide', texto: ['Piden el tiempo ', tS, ' que pasó.'] },
              { tipo: 'datos', texto: 'Lo que queda, como fracción con una potencia de 2.', ecuacion: [v6m(`1/${2 ** c.n}`), ' = 1/', pot2(v6n(String(c.n))), ': ', v6n(String(c.n)), ' vidas medias'] },
              { tipo: 'regla', texto: 'El tiempo es n veces la vida media.', ecuacion: [tS, ' = ', nS, ' · ', thS] },
              { tipo: 'cuentas', texto: 'Multiplico.', ecuacion: [tS, ' = ', v6n(String(c.n)), ' · ', v6v(ent6(vm)), ' = ', v6t(`${ent6(c.t)} ${u}`)] },
              { tipo: 'sentido', texto: 'Comprobación: menos queda, más tiempo pasó; con 1/2 sería una sola vida media.' },
            ],
            respuesta: [v6t(`${c.c14 ? 'Unos ' : ''}${ent6(c.t)} ${u}`)] });
        }
        if (c.tipo === 2) return Object.assign(base, {
          pasos: [
            { tipo: 'pide', texto: 'Piden el porcentaje que se desintegra, no el que queda.' },
            { tipo: 'regla', texto: 'Cuántas vidas medias caben, qué fracción queda y lo que falta para el 100 %.', ecuacion: [nS, ' = ', { frac: [tS, thS] }, ';  queda 1/', pot2(nS)] },
            { tipo: 'cuentas', texto: 'Cuento, calculo lo que queda y resto.', ecuacion: [nS, ' = ', { frac: [v6t(String(c.t)), v6v(String(c.x.vm))] }, ' = ', v6n(String(c.n)), ';  queda ', v6m(pc6(c.d.fraccionQueda)), ';  100 % − ', v6m(pc6(c.d.fraccionQueda)), ' = ', v6m(pc6(c.d.fraccionDesintegrada))] },
            { tipo: 'sentido', texto: 'Comprobación: lo que queda más lo desintegrado da 100 %.' },
          ],
          respuesta: [v6m(pc6(c.d.fraccionDesintegrada))] });
        if (c.tipo === 3) return Object.assign(base, c.curva ? { dibujo: c.dibujo } : {}, {
          pasos: c.curva ? [
            { tipo: 'pide', texto: ['Piden la vida media ', thS, ': cuándo queda la mitad.'] },
            { tipo: 'regla', texto: 'La vida media es el tiempo en que la masa baja a la mitad de la inicial.' },
            { tipo: 'cuentas', texto: `Al inicio hay ${c.m0} g; la mitad son ${c.m0 / 2} g, y la curva pasa por ahí en la primera marca del tiempo.`, ecuacion: [v6m(`${c.m0} g`), ' ÷ 2 = ', v6m(`${c.m0 / 2} g`), ' → ', thS, ' = ', v6v(anos6(c.x.vm))] },
            { tipo: 'sentido', texto: `Comprobación: en la marca siguiente quedan ${c.m0 / 4} g, la mitad de la mitad.` },
          ] : [
            { tipo: 'pide', texto: ['Piden la vida media ', thS, '.'] },
            { tipo: 'datos', texto: 'Se cuentan las mitades entre las dos masas.', ecuacion: [v6m(String(c.m0)), ' → ', v6m(String(c.m0 / 2)), ' → ', v6m(String(c.m0 / 4)), ': ', v6n('2'), ' vidas medias'] },
            { tipo: 'regla', texto: 'Esas vidas medias caben en el tiempo dado.', ecuacion: [thS, ' = ', { frac: [tS, nS] }] },
            { tipo: 'cuentas', texto: 'Divido.', ecuacion: [thS, ' = ', { frac: [v6t(ent6(c.t)), v6n('2')] }, ' = ', v6v(anos6(c.x.vm))] },
            { tipo: 'sentido', texto: 'Comprobación: dos vidas medias de ese largo dejan la cuarta parte.' },
          ],
          respuesta: [v6v(anos6(c.x.vm))] });
        if (c.mezcla) return Object.assign(base, {
          pasos: [
            { tipo: 'pide', texto: 'Piden la fracción de la dosis que queda.' },
            { tipo: 'datos', texto: `El tiempo, en la misma unidad que la vida media: ${c.eq}.`, ecuacion: [tS, ' = ', v6t(`${c.n * c.x.vm} ${c.x.u}`)] },
            { tipo: 'regla', texto: 'Cuántas vidas medias caben y qué fracción queda.', ecuacion: [nS, ' = ', { frac: [tS, thS] }, ';  queda 1/', pot2(nS)] },
            { tipo: 'cuentas', texto: 'Cuento y escribo la fracción.', ecuacion: [nS, ' = ', { frac: [v6t(String(c.n * c.x.vm)), v6v(String(c.x.vm))] }, ' = ', v6n(String(c.n)), ';  1/', pot2(v6n(String(c.n))), ' = ', v6m(fr6(c.q))] },
            { tipo: 'sentido', texto: `Comprobación: ${c.n} vidas medias de ${c.x.vm} ${c.x.u} suman ${c.n * c.x.vm} ${c.x.u}, el tiempo dado.` },
          ],
          respuesta: [v6m(fr6(c.q))] });
        return Object.assign(base, {
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa ', mS, ` que queda a los ${anos6(c.t2)}.`] },
            { tipo: 'datos', texto: 'De la primera masa a la segunda hay 2 mitades: 2 vidas medias.', ecuacion: [thS, ' = ', { frac: [v6t(ent6(c.t1)), v6n('2')] }, ' = ', v6v(anos6(c.x.vm))] },
            { tipo: 'regla', texto: 'Con la vida media, n y la masa que queda.', ecuacion: [nS, ' = ', { frac: [tS, thS] }, ';  ', mS, ' = ', { frac: [m0S, pot2(nS)] }] },
            { tipo: 'cuentas', texto: 'Cuento y divido.', ecuacion: [nS, ' = ', { frac: [v6t(ent6(c.t2)), v6v(ent6(c.x.vm))] }, ' = ', v6n('5'), ';  ', mS, ' = ', { frac: [v6m(String(c.m0)), pot2(v6n('5'))] }, ' = ', v6m(g6(c.d.queda))] },
            { tipo: 'sentido', texto: 'Comprobación: en el tiempo dado no se fue la mitad, sino tres cuartos; por eso no se divide por tramos.' },
          ],
          respuesta: [v6m(g6(c.d.queda))] });
      },
    },
    ahoraTu: {
      pieza: 'quim-cocina',
      voz: 'Cuenta cuántas veces se parte en dos.',
      generar(s) {
        const c = caso6(s, false);
        let solucion;
        if (c.tipo === 0) solucion = { texto: `Caben ${c.n} vidas medias: se divide ${c.n} veces entre 2.`, ecuacion: [mS, ' = ', { frac: [v6m(String(c.m0)), pot2(v6n(String(c.n)))] }, ' = ', v6m(g6(c.d.queda))] };
        else if (c.tipo === 1) solucion = { texto: `1/${2 ** c.n} son ${c.n} mitades: ${c.n} vidas medias.`, ecuacion: [tS, ' = ', v6n(String(c.n)), ' · ', v6v(ent6(c.c14 ? VM_C14 : c.x.vm)), ' = ', v6t(`${ent6(c.t)} ${c.c14 ? 'años' : c.x.u}`)] };
        else if (c.tipo === 2) solucion = { texto: `Caben ${c.n} vidas medias: queda ${pc6(c.d.fraccionQueda)}, y se desintegra lo demás.`, ecuacion: [v6m(pc6(c.d.fraccionDesintegrada))] };
        else if (c.tipo === 3) solucion = c.curva ? { texto: `La mitad de ${c.m0} g son ${c.m0 / 2} g: la curva pasa por ahí en esa marca.`, ecuacion: [thS, ' = ', v6v(anos6(c.x.vm))] }
          : { texto: 'Hay 2 mitades entre las masas: el tiempo entre 2.', ecuacion: [thS, ' = ', { frac: [v6t(ent6(c.t)), v6n('2')] }, ' = ', v6v(anos6(c.x.vm))] };
        else if (c.mezcla) solucion = { texto: `Todo en ${c.x.u}: caben ${c.n} vidas medias.`, ecuacion: ['1/', pot2(v6n(String(c.n))), ' = ', v6m(fr6(c.q))] };
        else solucion = { texto: 'La vida media sale de las 2 mitades; después caben 5.', ecuacion: [mS, ' = ', { frac: [v6m(String(c.m0)), pot2(v6n('5'))] }, ' = ', v6m(g6(c.d.queda))] };
        return { pregunta: c.pregunta, datos: c.datos, dibujo: c.dibujo, opciones: c.opciones, solucion };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: 10 g de hielo desde la temperatura que se elija, al nivel del mar, hasta pasar los 100 °C: aparece la meseta
  // de hervir junto a la de fundir. En calorías, con valores de libro: hielo y vapor 0,5 cal/(g·°C), agua 1; fusión 80 y
  // ebullición 540 cal/g.
  const M_LAB = 10, CE_VAPOR = 0.5, QMAX = 8;
  function tramos(t0) {
    const a = M_LAB * CE_HIELO * -t0 / 1000, b = a + M_LAB * LF4 / 1000, c = b + M_LAB * CE_AGUA * 100 / 1000, d = c + M_LAB * LV4 / 1000;
    return { a, b, c, d };
  }
  function estadoLab(t0, q) {
    const k = tramos(t0);
    if (q <= k.a) return { T: t0 + q * 1000 / (M_LAB * CE_HIELO), lee: 'hielo' };
    if (q <= k.b) return { T: 0, lee: `fundido ${f(100 * (q - k.a) / (k.b - k.a), 0)} %` };
    if (q <= k.c) return { T: (q - k.b) * 1000 / (M_LAB * CE_AGUA), lee: 'agua líquida' };
    if (q <= k.d) return { T: 100, lee: `hervido ${f(100 * (q - k.c) / (k.d - k.c), 0)} %` };
    return { T: 100 + (q - k.d) * 1000 / (M_LAB * CE_VAPOR), lee: 'vapor' };
  }
  const dibLab = val => {
    const k = tramos(val.t0), e = estadoLab(val.t0, val.q);
    const curva = [[0, val.t0], [k.a, 0], [k.b, 0], [k.c, 100], [k.d, 100], [QMAX, estadoLab(val.t0, QMAX).T]];
    return coc([{ tipo: 'curva', puntos: curva, hasta: val.q, xmax: QMAX, ymin: -40, ymax: 250, xMarcas: [0, 2, 4, 6], yMarcas: [0, 100, 200],
      x: 'Q (kcal)', y: 'T (°C)', colorX: 'f', colorY: 'd', punto: `${f(e.T, 0)} °C`, titulo: '10 g de agua, al nivel del mar' }],
      { alt: `Curva de calentamiento de 10 g de agua desde ${f(val.t0, 0)} °C: meseta corta a 0 °C (fundir) y meseta larga a 100 °C (hervir). Con ${f(val.q, 1)} kcal está a ${f(e.T, 0)} °C.` });
  };
  // Mesa 2: hasta un gramo que desaparece, contado en balones de gas (cada ícono, 10 000 balones; lo dice el título).
  const dibGramo = val => coc([
    { tipo: 'balanza', titulo: 'Masa que desaparece', carga: 'pizca', pantalla: `${f(val.mg, 0)} mg`, color: 'o' },
    { tipo: 'balones', fila: 1, titulo: 'Cada balón dibujado vale 10 000; la caja punteada, 100 000', valor: balones5(val.mg), por: 10000, total: 20, meta: 100000, color: 'h', rotulos: [{ texto: `unos ${f(redondo(balones5(val.mg)), 0)} balones`, color: 'h' }] },
  ]);
  return {
    unidad: 'quimica.materia-y-energia',
    version: '0.2.0',
    calidad: 2,
    estado: 'completa',
    // En orden: la paleta de elementos antes que quim-particulas (define las variables --el-*), el motor de la escena
    // antes que la unidad, y quim-particulas antes que quim-vasos (que dibuja sus especies).
    requiere: ['/nucleo/elementos.js', '/plantillas/materia-energia/motor.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-vasos.js', '/nucleo/kit/piezas/quim-cocina.js'],
    historia: {
      texto: 'En el siglo XVIII, para entender una combustión había que decidir qué pesar: solo el sólido o también el aire. Las mediciones de Lavoisier y de otros mostraron que una muestra puede ganar masa al tomar un gas. Por eso importa dónde termina el sistema que se estudia. La relación entre masa y energía llegó mucho después, con la física del siglo XX.',
      pregunta: '¿Qué pesarías para saber si algo pierde masa al quemarse?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §1.2', url: 'https://openstax.org/books/chemistry-2e/pages/1-2-phases-and-classification-of-matter' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      // Idea 1 (17 nov): los cuatro con `simple` son los que el Resumen muestra como «Palabras de esta idea»; ningún
      // ejemplo usa el hielo, que es la predicción de la idea.
      { termino: 'sustancia', formas: ['sustancia pura', 'sustancias puras', 'sustancia', 'sustancias'],
        def: 'Materia formada por una sola clase de partícula, con propiedades fijas: el agua, el oxígeno, la sal.',
        simple: 'Una sola cosa, sin nada más mezclado: agua destilada, oro puro, azúcar.',
        ejemplos: ['El agua destilada: todas sus partículas son H₂O.', 'El oxígeno de un balón medicinal: solo moléculas O₂.',
          'La sal de mesa: solo NaCl, aunque esté molida en granitos.'],
        ver: ['elemento', 'compuesto', 'mezcla'] },
      { termino: 'elemento', def: 'Sustancia con átomos de una sola clase. No se descompone en otras más simples por medios químicos.',
        simple: 'Lo que tiene átomos de una sola clase: oxígeno, oro, diamante.',
        ejemplos: ['El oxígeno O₂: moléculas de dos átomos, los dos de oxígeno.', 'El ozono O₃: tres átomos, todos de oxígeno.',
          'El diamante: solo átomos de carbono.'], ver: ['compuesto'] },
      { termino: 'compuesto', def: 'Sustancia con dos o más clases de átomos unidos en proporción fija.',
        ejemplos: ['El agua H₂O: siempre 2 átomos de hidrógeno por 1 de oxígeno.', 'El dióxido de carbono CO₂: 1 carbono y 2 oxígenos unidos.',
          'La sal de mesa NaCl: un sodio por cada cloro.'], ver: ['elemento', 'molécula'] },
      { termino: 'molécula', def: 'Grupo de átomos unidos que viaja junto: la partícula más pequeña de muchas sustancias.',
        ejemplos: ['Una molécula de CO₂ lleva 1 carbono y 2 oxígenos: 3 átomos.', 'Una molécula de agua: 1 oxígeno y 2 hidrógenos.',
          'Una molécula de O₂: dos átomos de oxígeno unidos.'], ver: ['compuesto'] },
      { termino: 'mezcla', formas: ['mezcla', 'mezclas'], def: 'Dos o más sustancias juntas que no se unen químicamente y se pueden separar por medios físicos.',
        simple: 'Varias sustancias juntas que no se vuelven una: agua con azúcar, aire.',
        ejemplos: ['Agua con azúcar: moléculas de agua y de azúcar sueltas, en una fase.', 'El aire: nitrógeno, oxígeno y otros gases repartidos parejo.',
          'Agua con aceite: dos sustancias en dos capas.'],
        ver: ['mezcla homogénea', 'mezcla heterogénea'] },
      { termino: 'mezcla homogénea', formas: ['mezcla homogénea', 'mezclas homogéneas'],
        def: 'Mezcla que se ve igual en todas sus partes: tiene una sola fase.',
        ejemplos: ['Agua con azúcar bien disuelta.', 'El aire limpio y seco.', 'El bronce: cobre y estaño fundidos juntos.'], ver: ['fase'] },
      { termino: 'mezcla heterogénea', formas: ['mezcla heterogénea', 'mezclas heterogéneas'],
        def: 'Mezcla en la que se distinguen partes distintas: tiene dos o más fases.',
        ejemplos: ['Agua con aceite: dos capas.', 'Agua con arena: la arena se asienta en el fondo.', 'El granito: se ven granos de distintos colores.'], ver: ['fase'] },
      { termino: 'fase', formas: ['fase', 'fases'], def: 'Parte de un sistema con las mismas propiedades en todos sus puntos, separada de las otras por un borde.',
        simple: 'Una zona pareja, con un borde que la separa de otra.',
        ejemplos: ['Agua con aceite: dos fases, una sobre otra.', 'Agua con azúcar disuelto: una sola fase.',
          'Agua con arena en el fondo: dos fases, la del agua y la de la arena.'], ver: ['componente'] },
      { termino: 'componente', formas: ['componente', 'componentes'], def: 'Cada sustancia distinta de un sistema o de una mezcla.',
        ejemplos: ['Agua con azúcar: dos componentes, el agua y el azúcar.', 'Agua con aceite y arena: tres componentes.',
          'El agua destilada: un solo componente.'], ver: ['fase', 'mezcla'] },
      // Vuelven «especie» y «energía» (Gerson, 17 nov: el tope del glosario sube a 30 términos).
      { termino: 'especie', formas: ['especie', 'especies', 'clase de partícula', 'clases de partícula'], def: 'Cada tipo distinto de partícula que hay en una muestra: las partículas de un mismo tipo son iguales entre sí.',
        ejemplos: ['Agua con azúcar: dos especies, las moléculas de agua y las de azúcar.', 'El agua destilada: una sola especie, la molécula de agua.',
          'El aire seco: varias especies, como las moléculas de nitrógeno y las de oxígeno.'], ver: ['sustancia', 'mezcla'] },
      // Idea 3 (17 nov): los tres cambios, con su `simple`; lo nuclear con el carbono-14 del hueso, el Sol (idea 5) y el
      // reactor, sin radiactividad ni vida media (las estrena la idea 6).
      { termino: 'cambio físico', formas: ['cambio físico', 'cambios físicos'],
        def: 'Transformación en la que las partículas siguen siendo las mismas: cambian de orden, de lugar o de estado.',
        simple: 'Algo cambia de forma o de estado, pero sigue siendo lo mismo.',
        ejemplos: ['Fundir hielo: antes y después hay moléculas de H₂O.', 'Secar la ropa: el agua pasa a vapor y sigue siendo agua.',
          'Romper un vidrio: los pedazos son del mismo vidrio.'], ver: ['cambio químico'] },
      { termino: 'cambio químico', formas: ['cambio químico', 'cambios químicos'],
        def: 'Transformación en la que aparecen sustancias nuevas, armadas con los mismos átomos reordenados.',
        simple: 'Aparece algo que antes no estaba: algo arde, se oxida o fermenta.',
        ejemplos: ['El hierro que se oxida forma óxido de hierro.', 'El gas de la hornilla arde y forma dióxido de carbono y agua.',
          'La chicha fermenta: el azúcar pasa a alcohol y CO₂.'], ver: ['cambio físico', 'cambio nuclear'] },
      { termino: 'cambio nuclear', formas: ['cambio nuclear', 'cambios nucleares', 'proceso nuclear', 'procesos nucleares'],
        def: 'Transformación del núcleo de los átomos: el elemento pasa a ser otro y se libera mucha energía.',
        simple: 'Un átomo se vuelve de otro elemento.',
        ejemplos: ['En un hueso antiguo, el carbono-14 pasa a nitrógeno-14.', 'En el Sol, núcleos de hidrógeno se unen y forman helio.',
          'En un reactor, el uranio se parte en átomos de otros elementos.'], ver: ['cambio químico'] },
      { termino: 'estado de agregación', formas: ['estado de agregación', 'estados de agregación'],
        def: 'Forma en que se juntan las partículas: sólido (en su sitio), líquido (se deslizan) o gas (vuelan separadas).',
        ejemplos: ['El hielo es agua en estado sólido.', 'El agua de la olla está en estado líquido.', 'El vapor que sale de la olla es agua en estado gaseoso.'],
        ver: ['cambio físico', 'fase'] },
      // Idea 4 (17 nov): en calorías, con cₑ para el calor específico (la c es la de la luz, idea 5). El `simple` del
      // calor latente no dice qué hace el termómetro (es la predicción).
      { termino: 'energía', simbolo: 'E', def: 'Lo que permite calentar, mover o transformar algo. Se mide en joules (J) o en calorías (cal).',
        ejemplos: ['La hornilla le da energía al agua de la olla y la calienta.', 'Al quemarse, el gas de un balón libera energía como calor y luz.',
          'Al caminar, una persona gasta energía; al comer, la recupera.'], ver: ['calor sensible', 'calor latente'] },
      { termino: 'calor sensible', def: 'Calor que sube o baja la temperatura de un cuerpo sin cambiarle el estado.',
        simple: 'El calor que entibia o calienta algo sin fundirlo ni hervirlo.',
        ejemplos: ['Calentar 500 g de agua de 20 °C a 30 °C: 5000 cal.', 'Entibiar el agua del mate antes de que hierva.', 'Calentar una olla de aluminio vacía.'],
        ver: ['calor específico', 'calor latente'] },
      { termino: 'calor latente', simbolo: 'L', medida: 'cal/g', def: 'Calor que cambia el estado de un gramo de una sustancia, a temperatura fija.',
        simple: 'El calor que se usa en fundir o en hervir algo.',
        ejemplos: ['Fundir 1 g de hielo pide 80 cal.', 'Hervir 1 g de agua pide 540 cal.', 'Fundir 200 g de hielo: 200 · 80 = 16 000 cal.'],
        ver: ['calor sensible', 'estado de agregación'] },
      { termino: 'calor específico', simbolo: 'cₑ', medida: 'cal/(g·°C)', def: 'Calor que necesita un gramo de una sustancia para subir 1 °C.',
        simple: 'Cuánto calor pide un gramo para subir un grado.',
        ejemplos: ['Agua líquida: 1 cal/(g·°C).', 'Hielo: unos 0,5 cal/(g·°C).', 'Hierro: unos 0,11 cal/(g·°C); por eso se calienta rápido.'],
        ver: ['calor sensible'] },
      { termino: 'caloría', formas: ['caloría', 'calorías', 'kilocaloría', 'kilocalorías'], simbolo: 'cal', medida: 'cal',
        def: 'Unidad de calor: lo que sube 1 °C a 1 g de agua. Equivale a unos 4,18 joules.',
        simple: 'Una medida chica de calor: unos 4 joules.',
        ejemplos: ['1 kcal = 1000 cal.', '1000 cal son unos 4180 J.', 'Subir 1 L de agua de 10 °C a 87 °C pide 77 000 cal.'],
        ver: ['calor específico'] },
      // Idea 5 (17 nov): la masa que falta y la fusión del Sol, con su `simple` (ninguno dice que el helio pesa menos:
      // es la predicción).
      { termino: 'defecto de masa', formas: ['defecto de masa', 'masa que falta', 'masa que desaparece'], simbolo: 'Δm', medida: 'kg',
        def: 'Diferencia entre la masa de un sistema antes y después de un proceso nuclear; sale como energía.',
        simple: 'Lo poquito que se pierde de peso cuando algo suelta muchísima energía.',
        ejemplos: ['A cada kilogramo de hidrógeno que forma helio en el Sol le faltan unos 7 g.', 'Al fisionarse 1 kg de uranio faltan unos 0,9 g.',
          'Al quemar un balón de gas faltan unos 5 × 10⁻⁹ kg: no se mide.'], ver: ['fusión nuclear', 'cambio nuclear'] },
      { termino: 'fusión nuclear', formas: ['fusión nuclear'],
        def: 'Proceso en que núcleos livianos se unen y forman uno más pesado, liberando muchísima energía.',
        simple: 'Núcleos chicos que se juntan en uno más grande, como en el Sol.',
        ejemplos: ['En el Sol, cuatro núcleos de hidrógeno forman uno de helio.', 'La luz y el calor del Sol salen de la fusión.',
          'Un kilogramo de hidrógeno fusionado da unos 6,4 × 10¹⁴ J.'], ver: ['defecto de masa'] },
      // Idea 6 (17 nov): la vida media (local: en cinética química, la vida media de una reacción tiene su propia
      // definición) y la desintegración, con su `simple` («radiactiva» lo dice la tarjeta 2 de «Lee») (ninguno dice qué queda tras dos vidas medias: es
      // la predicción).
      { termino: 'vida media', formas: ['vida media', 'vidas medias'], simbolo: 't₁/₂', medida: 'años, días u h', local: true,
        def: 'Tiempo en que se desintegra la mitad de los átomos radiactivos que tiene una muestra.',
        simple: 'El tiempo que tarda una muestra en quedarse con la mitad.',
        ejemplos: ['Carbono-14: unos 5730 años.', 'Yodo-131, que se usa en hospitales: unos 8 días.', 'Cobalto-60, que se usa para irradiar alimentos: unos 5,3 años.'],
        ver: ['desintegración'] },
      { termino: 'desintegración', formas: ['desintegración', 'desintegraciones', 'se desintegra', 'se desintegran', 'desintegrarse', 'desintegrado', 'desintegrada', 'desintegra', 'desintegran'],
        def: 'Cambio nuclear en que un átomo inestable pasa, por sí solo, a ser de otro elemento.',
        simple: 'Cuando un átomo cambia solo y se vuelve de otro elemento.',
        ejemplos: ['El carbono-14 de un hueso se desintegra y deja nitrógeno-14.', 'El yodo-131 de un tratamiento casi se acaba en unas semanas.',
          'El uranio de una roca se desintegra muy despacio: tarda miles de millones de años.'], ver: ['cambio nuclear', 'vida media'] },
      // Idea 2 (17 nov): densidad, intensiva, extensiva y propiedad física, con su `simple` (ninguno nombra la
      // temperatura de ebullición, que es la predicción de la idea).
      { termino: 'densidad', simbolo: 'ρ', medida: 'g/cm³', def: 'Masa de cada unidad de volumen de un material: su masa entre su volumen, ρ = m/V.',
        simple: 'Cuántos gramos hay en cada cm³: el oro, muchos; el corcho, pocos.',
        ejemplos: ['Oro: unos 19,3 g en cada cm³.', 'Agua: 1 g en cada cm³, o sea 1 g/mL.', 'Aceite: unos 0,92 g/mL; por eso flota sobre el agua.'],
        ver: ['propiedad intensiva'] },
      { termino: 'propiedad intensiva', formas: ['propiedad intensiva', 'propiedades intensivas', 'intensiva', 'intensivas'],
        def: 'Rasgo de una muestra que no depende de cuánta muestra hay.',
        simple: 'Lo que no cambia si tienes más o menos de algo: color, sabor.',
        ejemplos: ['La densidad: un anillo de oro y un lingote de oro tienen la misma.', 'El color del cobre: igual en un alambre que en una olla.',
          'La temperatura: dos tazas de té a 70 °C juntas siguen a 70 °C.'],
        ver: ['propiedad extensiva', 'densidad'] },
      { termino: 'propiedad extensiva', formas: ['propiedad extensiva', 'propiedades extensivas', 'extensiva', 'extensivas'],
        def: 'Rasgo de una muestra que depende de cuánta muestra hay: crece si hay más.',
        simple: 'Lo que crece si tienes más de algo: su masa, su volumen.',
        ejemplos: ['La masa: dos sacos de papa pesan el doble que uno.', 'El volumen: 3 L de agua ocupan el triple que 1 L.',
          'El calor para hervir: más agua pide más calor.'],
        ver: ['propiedad intensiva'] },
      { termino: 'propiedad física', formas: ['propiedad física', 'propiedades físicas'],
        def: 'Rasgo de una sustancia que se observa o se mide sin transformarla en otra.',
        simple: 'Lo que mides sin convertir la sustancia en otra: color, densidad.',
        ejemplos: ['La densidad del cobre: unos 8,9 g/cm³.', 'El color amarillo del azufre.', 'La temperatura a la que se funde el hielo: 0 °C.'],
        ver: ['propiedad química'] },
      { termino: 'propiedad química', formas: ['propiedad química', 'propiedades químicas'],
        def: 'Rasgo de una sustancia que solo se ve cuando se transforma en otra.',
        ejemplos: ['Que el gas de un balón arda.', 'Que el hierro se oxide con el aire húmedo.', 'Que el cobre se cubra de una capa verde con los años.'],
        ver: ['propiedad física', 'cambio químico'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera lleva el hielo hasta vapor, con la meseta de
    // hervir que la idea 3 no alcanza; la segunda llega a un gramo y lo traduce a carbón quemado. Las lecturas dicen
    // entradas y resultado, para que un caso guardado se lea solo.
    laboratorio: [
      {
        id: 'hielo-a-vapor', titulo: 'Del hielo al vapor', pieza: 'quim-cocina',
        consigna: 'El calor entra solo y el punto recorre la curva. Compara el largo de las dos mesetas; elige dónde empieza el hielo.',
        controles: [
          { id: 't0', etiqueta: 'T inicial del hielo', min: -40, max: 0, paso: 5, inicio: -20, unidad: '°C', decimales: 0 },
          { id: 'q', etiqueta: 'Calor entregado, Q', color: 'c-f', min: 0, max: QMAX, paso: 0.1, inicio: 0.5, unidad: 'kcal', decimales: 1, auto: { velocidad: 0.6 } },
        ],
        dibujo: val => dibLab(val),
        lectura: val => { const e = estadoLab(val.t0, val.q); return [vD(`${f(val.t0, 0)} °C`), ' + ', dR(`${f(val.q, 1)} kcal`), ' → ', vD(`${f(e.T, 0)} °C`), `, ${e.lee}`]; },
        arrastres: [{ id: 'calor', etiqueta: 'punto de la curva: calor entregado', color: 'c-f',
          donde: val => { const g = Kit.piezas['quim-cocina'].geoCurva(dibLab(val).datos, 0); return { x: g.X(val.q), y: g.Y(estadoLab(val.t0, val.q).T) }; },
          mover: (pt, val) => { const g = Kit.piezas['quim-cocina'].geoCurva(dibLab(val).datos, 0); return { q: (pt.x - g.x0) / (g.x1 - g.x0) * QMAX }; } }],
        // Retos comprobados (docs/teoria.md §4d): los mira estadoLab, el mismo cálculo que pone el punto en la curva.
        invitaciones: [
          { texto: 'Busca el menor calor con el que todo el hielo ya es agua líquida.',
            logrado: val => estadoLab(val.t0, val.q).lee === 'agua líquida' && estadoLab(val.t0, val.q - 0.1).lee !== 'agua líquida',
            bien: 'Ahí terminó la meseta de fundir. ¿Y si el hielo empieza más frío?' },
          { texto: 'Guarda dos casos con distinto calor y la misma temperatura.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.q !== b.q
              && Math.abs(estadoLab(a.t0, a.q).T - estadoLab(b.t0, b.q).T) < 1e-9)),
            bien: 'Más calor y el mismo termómetro: ese calor cambió el estado, no la temperatura.' },
          { texto: 'Deja la mitad del agua hervida y la otra mitad líquida, a 100 °C.',
            logrado: val => { const k = tramos(val.t0), x = (val.q - k.c) / (k.d - k.c); return x >= 0.45 && x <= 0.55; },
            bien: 'Media meseta larga. Hervir pide mucho más calor que fundir.' },
          { texto: 'Calienta el vapor por encima de 120 °C.',
            logrado: val => estadoLab(val.t0, val.q).lee === 'vapor' && estadoLab(val.t0, val.q).T > 120,
            bien: 'Sin cambio de estado, el calor específico manda otra vez: la curva vuelve a subir.' },
        ],
      },
      {
        id: 'gramo-carbon', titulo: 'Un gramo contra el gas', pieza: 'quim-cocina',
        consigna: 'Sube la masa que desaparece hasta un gramo. Cada balón dibujado vale por diez mil balones de gas de cocina.',
        controles: [{ id: 'mg', etiqueta: 'Masa que desaparece, Δm', color: 'c-o', min: 10, max: 1000, paso: 10, inicio: 100, unidad: 'mg', decimales: 0 }],
        dibujo: val => dibGramo(val),
        lectura: val => potCorto([vO(`${f(val.mg, 0)} mg`), ' → ', dR(`${cien(Motor.energia(val.mg * 1e-6).E)} J`), ': ', vH(`unos ${f(redondo(balones5(val.mg)), 0)} balones`)]),
        // Retos: balones con la misma cuenta de la lectura (E = Δm·c² entre la energía de un balón).
        invitaciones: [
          { texto: 'Busca la menor masa que ya equivale a cien mil balones de gas.',
            logrado: val => balones5(val.mg) >= 1e5 && balones5(val.mg - 10) < 1e5,
            bien: 'Medio gramo basta. ¿Cuántos balones valdría un gramo entero?' },
          { texto: 'Guarda dos casos: uno que libere el triple de energía que el otro.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => Math.abs(balones5(a.mg) - 3 * balones5(b.mg)) < 1e-6 * balones5(a.mg))),
            bien: 'Triple de masa perdida, triple de energía.' },
          { texto: 'Haz que desaparezca un gramo entero de masa.',
            logrado: val => val.mg === 1000,
            bien: 'Un solo gramo vale unos 200 000 balones de gas: c² es enorme.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'hielo-a-vapor': ['calor-sensible-latente'],
      'gramo-carbon': ['masa-energia'],
    },
    ideas: [sustancia, propiedades, cambios, calor, energia, vida],
  };
});
