/*
 * Teoría de «Geometría molecular y fuerzas intermoleculares» (quimica.geometria-molecular). Molde: docs/teoria.md y
 * docs/molde-unidad.md; unidad modelo: contenido/teoria/quimica/propiedades-periodicas.js. Compañera: Bruna (castora).
 *
 * Unidad nueva (19 nov 2026, etapa 6 del plan de calidad, criterio delegado): nace al partir «Enlace químico y fuerzas
 * intermoleculares» en dos (docs/etapa6/propuesta-quimica.md §3 y §12). Aquí va la forma de lo que se formó y cómo se
 * atraen las moléculas. Cuatro ideas, en este orden y con estos id: 1 «Forma por repulsión de pares» (`forma-repulsion`,
 * nueva), 2 «Hibridación y enlaces sigma y pi» (`hibridacion`, nueva), 3 «Polaridad de la molécula» (`forma-polaridad`,
 * viene de Enlace químico con otra predicción) y 4 «Fuerzas entre moléculas» (`fuerzas-intermoleculares`, viene de Enlace
 * químico). El avance de esas dos ideas, de las mesas `molecula-gira` y `dos-dipolos` y de sus palabras se migra con la
 * partición partidoEN (nucleo/avance.js). Lleva calidad: 2 desde el 19 nov (lector en frío y auditor).
 *
 * Mapa de colores (propuesta §8B, un color fijo por magnitud): el dipolo (la flecha) naranja (c-o; así lo dibujan
 * quim-molecula y quim-molecula-3d), el ángulo turquesa (c-i), los pares libres y los electrones violeta (c-f), la carga
 * parcial δ y la temperatura de ebullición carmín (c-h; nunca en el mismo ejercicio); la electronegatividad, en tinta
 * (aquí solo es un dato); sin verde. Los átomos del 3D llevan la paleta de elementos (nucleo/elementos.js).
 * Objetos de la primera pantalla (quim-enlace, de prueba): globos amarrados (1, analogía que «Lee» presenta con su
 * límite), el soplete de soldar (2), el chorrito de agua junto al peine (3) y la olla que hierve en Juliaca (4).
 *
 * Datos (con su fuente; no van al alumno): formas, ángulos ideales, hibridación y polaridad del motor de
 * plantillas/enlace (regla 1); ángulos medidos OpenStax, Chemistry 2e, §7.6 (H₂O 104,5°, NH₃ 107°); puntos de ebullición a
 * 1 atm, CRC Handbook / NIST WebBook (H₂O 100, H₂S −60, H₂Se −41, H₂Te −2, NH₃ −33, PH₃ −88, HF 20, HCl −85, CH₃OH 65,
 * CH₄ −162, etanol 78, CH₃OCH₃ −24, Cl₂ −34, Br₂ 59, n-pentano 36, neopentano 10 °C); el agua de Juliaca, unos 87 °C.
 * Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md (EN8 a EN16); los QM- son hipótesis.
 * Cuentas rehechas aparte en scratchpad (e6-quimica/cuentas-b.js), por otro camino que el de este archivo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/enlace/motor.js'))
    : fabrica(root.Kit, root.MotorEnlace);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  const COLORES = { dipolo: 'o', angulo: 'i', e: 'f', carga: 'h', temp: 'h' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Mu = ficha('dipolo'), An = ficha('angulo'), El = ficha('e'), Cq = ficha('carga'), Te = ficha('temp');
  const mu = Mu('μ');
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  function ops(correcta, ...malas) {
    const vistos = new Set([correcta]), out = [{ id: 'c', texto: correcta, correcta: true }];
    malas.forEach(([texto, error, siFuera], k) => { if (texto && !vistos.has(texto)) { vistos.add(texto); out.push({ id: `e${k}`, texto, error, siFuera }); } });
    return out.slice(0, 4);
  }
  const vf = l => l.map(x => (x ? 'V' : 'F')).join('');
  const ROMANO = ['I', 'II', 'III'];
  function vfDe(r, banco, datos) {
    const tres = r.baraja(banco.map((_, i) => i)).slice(0, 3).sort((a, b) => a - b).map(i => banco[i]), bien = tres.map(x => x[1]);
    const o = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => { const otra = bien.slice(); otra[i] = !otra[i]; o.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA', siFuera: `Las otras dos están bien juzgadas, pero la ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` }); });
    const clave = tres.find(x => !x[1]) || tres[0], ci = tres.indexOf(clave);
    return { pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.map((x, i) => `${ROMANO[i]}. ${x[0]} `)], datos, opciones: o,
      solucion: { texto: `${tres.map((x, i) => `${ROMANO[i]} ${x[1] ? 'V' : 'F'}`).join(', ')}. La ${ROMANO[ci]} es ${clave[1] ? 'verdadera' : 'falsa'}: ${clave[2]}.` } };
  }
  const HIB = { sp: 'sp', sp2: 'sp²', sp3: 'sp³', sp3d: 'sp³d', sp3d2: 'sp³d²' };
  const grad = a => `${f(Math.round(a * 10) / 10, 1).replace(/,0$/, '')}°`;
  const val = s => M.elemento(s).valencia;
  const valTxt = ss => `Electrones de valencia: ${[...new Set(ss)].map(s => `${s} ${val(s)}`).join('; ')}`;
  const ligTxt = L => [L.central, ...L.ligandos.map(x => x.simbolo)];
  const parTxt = m => (m === 0 ? 'ningún par libre' : `${m} par${m > 1 ? 'es' : ''} libre${m > 1 ? 's' : ''}`);
  const subAXE = t => t.replace(/(\d)/g, d => '₀₁₂₃₄₅₆'[d]);
  const FIG = { lineal: 'una línea', 'trigonal plana': 'un triángulo plano', 'tetraédrica': 'un tetraedro', 'bipirámide trigonal': 'una bipirámide trigonal', 'octaédrica': 'un octaedro' };

  // ---------- Moléculas en 3D (todo del motor de plantillas/enlace) ----------
  // Un enlace lleva flecha si el motor no lo llama «covalente apolar»; la flecha apunta al átomo que atrae más.
  const enlacesPolares = k => { const x = M.molecula(k); return x.ligandos.some(l => M.tipoEnlace(x.central, l).tipo !== 'covalente apolar'); };
  function mol3d(k, o = {}) {
    const x = M.molecula(k);
    const atomos = o.soloCentral ? [{ id: 'c', t: x.central, pos: [0, 0, 0] }] : [{ id: 'c', t: x.central, pos: [0, 0, 0] }, ...x.ligandos.map((t, i) => ({ id: `l${i}`, t, pos: x.posiciones.ligandos[i] }))];
    const enlaces = o.soloCentral ? [] : x.ligandos.map((t, i) => {
      const te = M.tipoEnlace(x.central, t);
      return { a: 'c', b: `l${i}`, orden: (x.lewis.ligandos[i] || {}).orden || 1, dipolo: te.tipo === 'covalente apolar' ? undefined : te.mas === t ? 'b' : 'a' };
    });
    const pares = o.soloCentral ? [] : x.posiciones.pares.map(dir => ({ en: 'c', dir }));
    return { pieza: 'quim-molecula-3d', datos: { atomos, enlaces, pares, total: x.polaridad.polar ? x.polaridad.total : null, simbolos: true,
      alt: o.alt || `${x.formula} en 3D: forma ${x.vsepr.geometria}, ${x.ligandos.length} enlaces y ${pares.length} pares libres en el átomo central${o.conPolar ? `; ${x.polaridad.polar ? 'polar' : 'apolar'}` : ''}.` },
    estado: { dipolos: !!o.dipolos, pares: o.pares !== false } };
  }
  const FORMA = k => M.vsepr(k).geometria;
  // Predice se dibuja quieta (una sola pieza para la pregunta y la respuesta): la respuesta es la molécula en 3D vista en
  // perspectiva, con la proyección de quim-molecula-3d (se pide al revelar, cuando ya están cargadas las piezas).
  // Sin la pieza cargada (al armar el catálogo) queda la molécula en 3D, que la app también dibuja quieta.
  const proyeccion = m => { const P = Kit.piezas && Kit.piezas['quim-molecula-3d']; return P ? { pieza: 'quim-molecula', datos: Object.assign(P.plano(m.datos, m.estado), { alt: m.datos.alt }), estado: {} } : m; };

  // ---------- Idea 1 (nueva, 19 nov): forma por repulsión de pares ----------
  // Propuesta B1. Objeto de la primera pantalla: globos amarrados por el nudo (quim-enlace, de prueba; analogía).
  // Cambia: el número de regiones del átomo central · Permanece: la molécula en 3D, que se gira con el dedo · Progresa:
  // de 2 a 6 regiones, todas enlaces · Se reserva: los pares libres (Predice: el NH₃), que no salen en el juego · Debe
  // verse: el ángulo entre dos enlaces vecinos.
  // Errores: EN8 (la forma del papel; 51 % de error en Karonen y otros 2021), EN9 (el par libre la dobla),
  // QM-FORMA-DOMINIOS (nombra la forma de las regiones), QM-FORMA-LIGANDOS (cuenta solo los átomos unidos),
  // QM-ANGULO-PLANO (ángulos del papel), QM-REGION-DOBLE (un doble cuenta como dos regiones).
  const JUEGO_N = { 2: 'BeCl2', 3: 'BF3', 4: 'CH4', 5: 'PCl5', 6: 'SF6' };
  const angTxt = k => M.vsepr(k).angulos.filter(a => a < 179.9).map(grad).join(' y ') || '180°';
  const D1 = { region: 'Región de electrones: cada enlace (simple, doble o triple) o par libre del átomo central',
    formas: 'Con 2 regiones, lineal; con 3, trigonal plana; con 4, tetraédrica (las regiones; la forma se nombra por los átomos)',
    // Auditoría (19 nov, A1 y M3): los nombres con pares libres y las formas de 5 y 6 regiones van en Datos.
    nombres: 'Con pares libres: 4 regiones y 1 par, piramidal trigonal; 4 regiones y 2 pares, o 3 y 1, angular',
    reg56: 'Con 5 regiones, bipirámide trigonal; con 6, octaédrica (las regiones)',
    exp5: 'Con 5 regiones (pares al ecuador): 1 par, balancín; 2 pares, forma de T; 3 pares, lineal',
    exp6: 'Con 6 regiones (pares opuestos): 1 par, pirámide cuadrada; 2 pares, cuadrada plana',
    lewis: 'Pares libres del central: arma la estructura de Lewis (completa octetos; el H con 2) y cuenta lo que sobra' };
  const datosForma = (n, m) => (n + m >= 5 ? [D1.region, D1.reg56, D1.exp5, D1.exp6] : m ? [D1.region, D1.formas, D1.nombres] : [D1.region, D1.formas]);
  const FORMAS_TODAS = ['lineal', 'angular', 'trigonal plana', 'piramidal trigonal', 'tetraédrica', 'bipirámide trigonal', 'balancín', 'forma de T', 'octaédrica', 'pirámide cuadrada', 'cuadrada plana'];
  const FORMA_A = ['H2O', 'PCl3', 'SO2', 'CH2O', 'CCl4', 'H2S', 'NF3', 'BCl3', 'HCN', 'SCl2', 'SF4', 'ClF3', 'XeF4', 'BrF5', 'XeF2'];
  const FORMA_R = ['H2O', 'PCl3', 'SO2', 'XeF4'];
  const regiones = k => M.vsepr(k).dominios;
  const libresC = k => M.lewis(k).paresLibres;
  function casoForma(r) {
    const k = r.de(FORMA_A.filter(x => !FORMA_R.includes(x))), v = M.vsepr(k), L = M.lewis(k), fm = v.geometria, n = L.ligandos.length, m = L.paresLibres;
    const dom = v.geometriaDominios, plano = { 2: 'lineal', 3: 'trigonal plana', 4: 'cuadrada plana', 5: 'bipirámide trigonal', 6: 'octaédrica' }[n];
    return {
      pregunta: `El átomo central del ${L.formula} está unido a ${n} átomos y ${m === 0 ? 'no tiene pares libres' : `tiene ${m} par${m > 1 ? 'es' : ''} libre${m > 1 ? 's' : ''}`}. ¿Qué forma tiene la molécula?`,
      datos: datosForma(n, m),
      opciones: ops(fm, [dom, 'QM-FORMA-DOMINIOS', `Sería así si la forma se nombrara por las ${n + m} regiones. Se nombra solo por los átomos, sin contar los pares libres.`],
        [plano, 'EN8', 'Sería así si los átomos se repartieran por igual en el plano del papel, como en el dibujo. En el espacio, las regiones se alejan más.'], [FORMA({ 2: 'CO2', 3: 'BF3', 4: 'CH4', 5: 'PCl5', 6: 'SF6' }[n]), 'QM-FORMA-LIGANDOS', 'Sería así si el átomo central no tuviera pares libres. Los pares libres también ocupan lugar y empujan a los átomos.'],
        ...r.baraja(FORMAS_TODAS.filter(x => x !== fm)).slice(0, 3).map(x => [x, 'EN9', 'Sería así con otro número de regiones o de pares libres.'])),
      solucion: { texto: `El central tiene ${n} enlaces y ${parTxt(m)}: son ${n + m} regiones (${subAXE(v.AXE)}). La forma se nombra solo por los átomos.`, ecuacion: [`${L.formula}: ${fm}`] },
    };
  }
  function casoRegiones(r) {
    const k = r.de(['H2O', 'PCl3', 'CO2', 'CH2O', 'HCN', 'SO2', 'SF4', 'XeF2', 'CCl4', 'BF3']), L = M.lewis(k), n = L.ligandos.length, m = L.paresLibres, multi = L.ligandos.some(x => x.orden > 1);
    return {
      pregunta: `¿Cuántas regiones de electrones tiene el átomo central del ${L.formula}?`,
      datos: [valTxt(ligTxt(L)), D1.region, D1.lewis],
      opciones: ops(String(n + m), [String(n), 'QM-FORMA-LIGANDOS', 'Sería así si el central no tuviera pares libres. Cada par libre también es una región, igual que cada enlace.'],
        multi ? [String(L.paresEnlazantes + m), 'QM-REGION-DOBLE', 'Sería así si cada par compartido fuera una región. Un enlace doble o triple cuenta como una sola región.'] : [String(n + 2 * m), 'QM-REGION-PARES', 'Sería así si cada par libre contara dos veces. Un par libre es una sola región.'],
        [String(4), 'QM-REGION-OCTETO', 'Sería así si siempre hubiera cuatro, como pide el octeto. Se cuentan los enlaces y los pares libres que tiene de verdad el central.'],
        [String(2 * (n + m)), 'QM-REGION-ELECTRONES', 'Sería así si se contaran dos electrones por región. Se cuentan regiones: una por cada enlace y una por cada par libre.'],
        [String(n + m + 1), 'QM-REGION-UNO', 'Sobra una región. Vuelve a contar los pares libres del central en su estructura de Lewis.'], [String(n + m - 1), 'QM-REGION-UNO', 'Falta una región. Cuenta todos los enlaces del central y también sus pares libres.']),
      solucion: { texto: `El central tiene ${n} enlace${n > 1 ? 's' : ''} y ${parTxt(m)}${multi ? '; cada doble o triple cuenta como una sola región' : ''}.`, ecuacion: [`${n} + ${m} = ${n + m} regiones`] },
    };
  }
  function casoAngulo(r) {
    const k = r.de(['BeCl2', 'BF3', 'CCl4', 'CO2', 'BCl3', 'CH2O', 'SF6']), v = M.vsepr(k), a = Math.min(...v.angulos), L = M.lewis(k);
    const T = [180, 120, 109.5, 90];
    return {
      pregunta: `¿Cuánto mide el ángulo más pequeño entre dos enlaces del ${L.formula}, según la repulsión de pares?`,
      datos: [D1.region, 'Ángulos de las formas: lineal 180°; trigonal plana 120°; tetraédrica 109,5°; octaédrica 90°'],
      opciones: ops(grad(a), ...T.filter(x => Math.abs(x - a) > 0.5).map(x => [grad(x), x === 90 ? 'QM-ANGULO-PLANO' : 'QM-ANGULO-OTRA', x === 90 ? 'Sería así si los enlaces formaran una cruz, como en el dibujo del papel. En el espacio, los enlaces se alejan más.' : `Sería así con otro número de regiones. Aquí el central tiene ${v.dominios}.`])),
      solucion: { texto: `El central tiene ${v.dominios} regiones, todas enlaces, así que la forma es ${v.geometria}.`, ecuacion: [An(grad(a))] },
    };
  }
  const AFIRMA_F = [
    ['El NH₃ es plano, como se dibuja en el papel.', false, 'el par libre del N empuja a los H hacia abajo, así que es piramidal'],
    ['Un enlace doble cuenta como una sola región.', true, 'sus dos pares apuntan en una sola dirección'],
    ['La forma se nombra contando también los pares libres.', false, 'la forma se nombra solo por los átomos'],
    ['El CH₄ tiene ángulos de 109,5°.', true, 'sus cuatro regiones apuntan a las puntas de un tetraedro'],
    ['El H₂O y el CO₂ tienen la misma forma.', false, 'el agua es angular y el CO₂, lineal'],
    ['Los pares libres cierran un poco los ángulos.', true, 'un par libre empuja más que un enlace'],
  ];

  // Ejemplos de la idea 1. Cuentas rehechas aparte (cuentas-b.js): CO₂ 2 regiones · BF₃ 120° · CH₄ 4, tetraédrica · SF₆ 6
  // · H₂O 2 + 2 = 4 · CH₂O 3 regiones · PCl₃ 3 + 1 · SO₂ 2 + 1 angular · BeCl₂ y H₂O · XeF₄ 4 + 2 cuadrada plana ·
  // SF₄ 4 + 1 balancín · ClF₃ 3 + 2 forma de T · NH₃ 107° < 109,5°.
  const EJEMPLOS_FORMA = [
    { nivel: 1, titulo: 'Las regiones del CO₂',
      enunciado: 'En el O=C=O, ¿cuántas regiones de electrones tiene el carbono?',
      datos: [D1.region],
      solucion: [{ texto: 'El carbono tiene dos enlaces dobles y ningún par libre, y cada doble cuenta como una sola región.', ecuacion: ['2 regiones'] }],
      respuesta: ['2 regiones'] },
    { nivel: 1, titulo: 'El ángulo del BF₃',
      enunciado: 'El boro del BF₃ tiene tres enlaces y ningún par libre. ¿Qué ángulo hay entre dos enlaces?',
      datos: [D1.region, 'Tres regiones en un plano: se reparten una vuelta de 360°'],
      solucion: [{ texto: 'Las tres regiones se alejan al máximo y quedan en un mismo plano, así que se reparten la vuelta en tres partes iguales.', ecuacion: ['360° ÷ 3 = ', An('120°')] }],
      respuesta: [An('120°')] },
    { nivel: 1, titulo: 'La forma del metano',
      enunciado: 'El carbono del CH₄ tiene cuatro enlaces y ningún par libre. ¿Qué forma tiene la molécula?',
      datos: [D1.region, D1.formas],
      figura: mol3d('CH4'),
      solucion: [{ texto: 'Las cuatro regiones tienen átomos y se alejan hacia las puntas de un tetraedro.' }],
      respuesta: ['Tetraédrica'] },
    { nivel: 1, titulo: 'Seis flúor alrededor',
      enunciado: 'En el SF₆, ¿cuántas regiones de electrones tiene el azufre, que forma seis enlaces simples y no tiene pares libres?',
      datos: [D1.region],
      solucion: [{ texto: 'Cada uno de los seis enlaces simples es una región, y no hay pares libres que sumar.', ecuacion: ['6 regiones: forma octaédrica'] }],
      respuesta: ['6 regiones'] },
    { nivel: 1, titulo: 'Las regiones del agua',
      enunciado: 'El oxígeno del H₂O tiene dos enlaces y dos pares libres. ¿Cuántas regiones de electrones tiene?',
      datos: [D1.region],
      solucion: [{ texto: 'Los enlaces y los pares libres cuentan igual: cada uno es una región.', ecuacion: ['2 + 2 = 4 regiones'] }],
      respuesta: ['4 regiones'] },
    { nivel: 2, titulo: 'Un doble entre tres',
      enunciado: 'El carbono del CH₂O tiene dos enlaces simples con H y uno doble con O. ¿Cuántas regiones tiene y qué forma toma?',
      datos: [D1.region, D1.formas],
      solucion: [
        { texto: 'El doble cuenta como una sola región: 1 + 1 + 1 = 3, sin pares libres.' },
        { texto: 'Las tres regiones tienen átomos, así que la forma es trigonal plana, con ángulos de unos 120°.' },
      ],
      respuesta: ['3 regiones; trigonal plana'] },
    { nivel: 2, titulo: 'El fósforo con tres cloros',
      enunciado: 'En el PCl₃, el fósforo forma tres enlaces y tiene un par libre. ¿Qué forma tiene la molécula?',
      datos: [D1.region, D1.formas, D1.nombres],
      solucion: [
        { texto: 'Los tres enlaces y el par libre son cuatro regiones, que se ordenan como un tetraedro.', ecuacion: ['3 + 1 = 4'] },
        { texto: 'Sin contar el par, los átomos forman una pirámide de base triangular.' },
      ],
      respuesta: ['Piramidal trigonal'] },
    { nivel: 2, titulo: 'Un gas de los volcanes',
      enunciado: 'El azufre del SO₂ tiene dos enlaces dobles con oxígeno y un par libre. ¿Qué forma tiene la molécula?',
      datos: [D1.region, D1.formas, D1.nombres],
      solucion: [
        { texto: 'Cada doble es una región y el par libre es otra: son 3 regiones, repartidas en un plano.' },
        { texto: 'Sin contar el par, los tres átomos no quedan en línea: forma angular.' },
      ],
      respuesta: ['Angular'] },
    { nivel: 2, titulo: 'Dos moléculas de tres átomos',
      enunciado: 'El BeCl₂ y el H₂O tienen tres átomos cada una. El Be no tiene pares libres; el O tiene dos. ¿Qué forma tiene cada una?',
      datos: [D1.region, D1.formas, D1.nombres],
      solucion: [
        { texto: 'El Be del BeCl₂ tiene 2 regiones, que quedan opuestas: la molécula es lineal.' },
        { texto: 'El O del H₂O tiene 4 regiones, en tetraedro; sin contar los dos pares, los tres átomos quedan en ángulo.' },
      ],
      respuesta: ['Lineal y angular'] },
    { nivel: 2, titulo: 'El xenón con cuatro flúor',
      enunciado: 'En el XeF₄, el xenón forma cuatro enlaces y tiene dos pares libres. ¿Qué forma tiene la molécula?',
      datos: [D1.region, 'Con 6 regiones: octaédrica; dos pares libres quedan opuestos'],
      solucion: [
        { texto: 'Las seis regiones se ordenan en un octaedro, y los dos pares libres se ponen opuestos, uno arriba y otro abajo.' },
        { texto: 'Así, los cuatro F quedan en un mismo plano, en cruz.' },
      ],
      respuesta: ['Cuadrada plana'] },
    { nivel: 3, titulo: 'Octeto expandido y pares',
      enunciado: 'El azufre del SF₄ tiene cuatro enlaces y un par libre. ¿Qué afirmación es correcta?',
      alternativas: ['Tiene 5 regiones y forma de balancín.', 'Tiene 4 regiones y es tetraédrica.', 'Tiene 5 regiones y es bipirámide trigonal.', 'Tiene 6 regiones y es octaédrica.', 'Tiene 4 regiones y es cuadrada plana.'],
      datos: [D1.region, 'Con 5 regiones: bipirámide trigonal; un par libre va al ecuador'],
      solucion: [
        { texto: 'Cuatro enlaces y un par libre suman 5 regiones, que se ordenan en una bipirámide. Sin contar el par, los átomos forman un balancín.' },
        { texto: ['La ', letra('B'), ' y la ', letra('E'), ' olvidan el par libre. La ', letra('C'), ' nombra la forma de las regiones, con el par.'] },
        { texto: ['La ', letra('D'), ' cuenta una región de más.'] },
      ],
      respuesta: [letra('A'), ', balancín'] },
    { nivel: 3, titulo: 'Tres moléculas, tres formas',
      enunciado: '¿Qué forma tienen el BF₃, el NH₃ y el H₂O, en ese orden?',
      alternativas: ['Las tres trigonales planas', 'Trigonal plana, piramidal y angular', 'Piramidal, trigonal plana y lineal', 'Trigonal plana, tetraédrica y lineal', 'Tetraédrica, piramidal y angular'],
      datos: [D1.region, D1.formas, D1.nombres, 'Pares libres del central: B 0; N 1; O 2'],
      solucion: [
        { texto: 'El BF₃ tiene 3 regiones, todas con átomos. El NH₃ tiene 4, y una es par libre. El H₂O tiene 4, y dos son pares libres.' },
        { texto: ['La ', letra('A'), ' las lee planas, como en el papel. La ', letra('C'), ' invierte las dos primeras.'] },
        { texto: ['La ', letra('D'), ' nombra la forma de las regiones del NH₃ y pone el agua en línea. La ', letra('E'), ' le da al BF₃ cuatro regiones, como si tuviera un par libre.'] },
      ],
      respuesta: [letra('B'), ', trigonal plana, piramidal y angular'] },
    { nivel: 3, titulo: 'Un ángulo que se cierra',
      enunciado: 'El NH₃ y el CH₄ tienen 4 regiones cada uno. ¿Qué afirmación sobre sus ángulos es correcta?',
      alternativas: ['Los dos miden 109,5°.', 'El del NH₃ mide 120°.', 'El del NH₃ es mayor: tiene un enlace menos.', 'El del NH₃ mide 90°: es una pirámide.', 'El del NH₃ es algo menor: su par libre empuja más.'],
      datos: [D1.region, 'Ángulo medido: H–N–H unos 107°; H–C–H 109,5°'],
      solucion: [
        { texto: 'El par libre del N empuja más que un enlace y cierra un poco el ángulo H–N–H.', ecuacion: [An('107°'), ' < ', An('109,5°')] },
        { texto: ['La ', letra('A'), ' olvida el empuje del par. La ', letra('B'), ' toma el NH₃ por plano. La ', letra('C'), ' invierte el efecto.'] },
        { texto: ['La ', letra('D'), ' usa el ángulo de una cruz en el papel.'] },
      ],
      respuesta: [letra('E'), ', unos 107°'] },
    { nivel: 3, titulo: 'Dos pares en forma de T',
      enunciado: 'El cloro del ClF₃ tiene tres enlaces y dos pares libres. ¿Qué forma tiene la molécula?',
      alternativas: ['Trigonal plana', 'Piramidal trigonal', 'Forma de T', 'Bipirámide trigonal', 'Angular'],
      datos: [D1.region, 'Con 5 regiones: bipirámide trigonal; dos pares libres van al ecuador'],
      solucion: [
        { texto: 'El cloro tiene cinco regiones. Los dos pares van al ecuador, y los tres F quedan en una T: uno arriba, uno abajo y uno al costado.' },
        { texto: ['La ', letra('A'), ' olvida los pares. La ', letra('B'), ' cuenta un solo par. La ', letra('D'), ' nombra la forma de las regiones.'] },
        { texto: ['La ', letra('E'), ' es la forma de una molécula de tres átomos; aquí hay cuatro.'] },
      ],
      respuesta: [letra('C'), ', forma de T'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. Un enlace doble cuenta como una sola región. II. La forma se nombra contando los pares libres. III. El CH₄ tiene ángulos de 109,5°.',
      alternativas: ['VVV', 'VFF', 'FFV', 'VFV', 'FVF'],
      datos: [D1.region, D1.formas],
      solucion: [
        { texto: 'I es verdadera. II es falsa: se nombra solo por los átomos (el agua es angular, no tetraédrica). III es verdadera.', ecuacion: ['VFV'] },
        { texto: ['La ', letra('A'), ' nombra la forma con los pares. La ', letra('B'), ' niega el tetraedro del metano.'] },
        { texto: ['La ', letra('C'), ' cuenta el doble como dos regiones. La ', letra('E'), ' invierte las tres.'] },
      ],
      respuesta: [letra('D'), ', VFV'] },
  ];

  const formaIdea = {
    id: 'forma-repulsion',
    titulo: 'Forma por repulsión de pares',
    pregunta: '¿Por qué el agua no es una molécula recta?',
    temas: ['Hibridación y geometría molecular'],
    pieza: 'quim-molecula-3d',
    aprendizaje: 'Las regiones de electrones del átomo central se alejan lo más posible; la forma se nombra por los átomos, pero los pares libres también empujan.',
    actividad: 'Cambiar cuántas regiones rodean al átomo central y medir sus ángulos.',
    lee: {
      tarjetas: [
        { titulo: 'Globos amarrados', texto: 'Amarra dos, tres o cuatro globos por el nudo: se acomodan solos, lo más lejos que pueden uno de otro. Los globos son solo una comparación: no tienen carga.',
          pieza: 'quim-enlace', dibujo: { pieza: 'quim-enlace', datos: { vista: 'objeto', objeto: 'globos', n: 4, nombre: 'Cuatro globos amarrados' }, estado: {} } },
        { titulo: 'Regiones de electrones', texto: 'Alrededor del átomo central, cada enlace (simple, doble o triple) y cada par libre es una región de electrones. Un par libre son dos electrones sin enlace, como los que viste en la estructura de Lewis. Las regiones se repelen, como los globos.' },
        { titulo: 'En tres dimensiones', texto: 'Una molécula no es plana como su dibujo de Lewis: sus átomos ocupan el espacio. En el juego la puedes girar con el dedo para verla de costado.' },
        { titulo: 'Qué mirar', texto: 'Cambia cuántas regiones rodean al átomo central y lee el ángulo de enlace entre dos vecinos. Gira la molécula para comprobarlo.' },
      ],
    },
    ejemplos: EJEMPLOS_FORMA,
    juega: {
      pieza: 'quim-molecula-3d',
      consigna: 'Cada enlace es una región de electrones del átomo central. Cambia cuántas hay y gira la molécula con el dedo.',
      mision: {
        texto: 'Arma la forma en que todos los enlaces quedan a 120° entre sí.',
        logrado: v => v.n === 3,
        bien: 'Tres regiones se reparten una vuelta en un plano: 360° ÷ 3 = 120°. Así queda el BF₃.',
      },
      voz: 'Mira cómo se alejan los enlaces al sumar uno.',
      leyenda: [
        { s: 'región', t: 'un enlace; un par libre también lo es' },
        { s: An('109,5°'), t: 'ángulo entre dos enlaces vecinos' },
        { s: 'esfera', t: 'un átomo, con el color de su elemento' },
      ],
      controles: [{ id: 'n', etiqueta: 'Regiones', opciones: [2, 3, 4, 5, 6].map(n => ({ valor: n, texto: String(n) })), inicio: 4 }],
      dibujo: v => mol3d(JUEGO_N[v.n]),
      lectura: v => [`${v.n} regiones: ${FORMA(JUEGO_N[v.n])}, `, An(angTxt(JUEGO_N[v.n])), ' entre enlaces'],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'El nitrógeno del NH₃ forma tres enlaces con hidrógeno y tiene además un par libre. ¿Qué forma tiene la molécula?',
      datos: ['Nitrógeno del NH₃: 3 enlaces y 1 par libre', 'En el papel se dibuja con los tres H alrededor del N'],
      voz: 'Piensa qué hace el par libre con los tres enlaces.',
      opciones: [
        { id: 'c', texto: 'Piramidal: los tres H abajo y el par arriba', correcta: true },
        { id: 'plana', texto: 'Trigonal plana, como se ve en el papel', error: 'EN8', siFuera: 'Sería así si el par libre no ocupara lugar. Lo ocupa, y empuja a los tres H fuera del plano.' },
        { id: 'tetra', texto: 'Tetraédrica, porque hay cuatro regiones', error: 'QM-FORMA-DOMINIOS', siFuera: 'Sería así si la forma se nombrara por las regiones. Las cuatro sí van en tetraedro, pero la forma se nombra solo por los átomos.' },
        { id: 'angular', texto: 'Angular: el par libre dobla la molécula', error: 'EN9', siFuera: 'Sería así con dos H, como en el agua. El NH₃ tiene tres H alrededor del N, y con tres no queda angular.' },
      ],
      dibujo: { pieza: 'quim-molecula', datos: { atomos: [{ id: 'n', t: 'N', x: 0, y: 0 }, { id: 'h1', t: 'H', x: -1.1, y: 0 }, { id: 'h2', t: 'H', x: 1.1, y: 0 }, { id: 'h3', t: 'H', x: 0, y: 1.1 }],
        enlaces: [{ a: 'n', b: 'h1' }, { a: 'n', b: 'h2' }, { a: 'n', b: 'h3' }], pares: [{ en: 'n', ang: -90, color: 'f' }], escala: 60, alto: 170, alt: 'El NH₃ como se dibuja en el papel: el N con sus tres H alrededor y un par libre. Su forma en el espacio es lo que se pregunta.' }, estado: {} },
      get revelar() { return proyeccion(mol3d('NH3')); },
      coincide: 'Coincide: piramidal, con el par libre en la punta.',
      noCoincide: 'Es piramidal: el par libre ocupa la cuarta punta del tetraedro.',
    },
    mira: {
      pieza: 'quim-molecula-3d',
      datos: mol3d('NH3').datos,
      voz: 'Giremos el NH₃ y contemos sus regiones.',
      pasos: [
        { estado: { pares: true }, texto: 'El N del NH₃ tiene 4 regiones: tres enlaces y un par libre.', ecuacion: ['3 + 1 = 4 regiones'] },
        { estado: { pares: true }, texto: 'Las cuatro regiones se alejan hacia las puntas de un tetraedro.', ecuacion: [An('109,5°'), ' en el tetraedro'] },
        { estado: { pares: false }, texto: 'Si no se cuenta el par, los cuatro átomos forman una pirámide: la forma es piramidal.' },
        { estado: { pares: true }, texto: 'El par libre empuja más que un enlace, así que el ángulo H–N–H se cierra un poco.', ecuacion: [An('unos 107°')] },
        { estado: { pares: true }, texto: 'Con dos pares, como en el agua, la forma es angular.', ecuacion: ['H₂O: ', An('unos 104,5°')] },
      ],
    },
    regla: {
      texto: 'Las regiones de electrones del átomo central, enlaces y pares libres, se alejan lo más posible. La forma molecular se nombra solo por los átomos, aunque los pares libres también empujan.',
      ecuacion: ['2 regiones: lineal, ', An('180°'), SEP, '3: trigonal plana, ', An('120°'), SEP, '4: tetraédrica, ', An('109,5°'), SEP, '4 con 1 par: piramidal', SEP, '4 con 2 pares, o 3 con 1: angular'],
      condicion: 'el central tiene hasta cuatro regiones, y cada doble o triple cuenta como una; con cinco salen bipirámide, balancín, forma de T o lineal, y con seis, octaédrica, pirámide cuadrada o cuadrada plana.',
      voz: 'Cuenta las regiones, pero nombra la forma por los átomos.',
      dibujo: mol3d('H2O'),
    },
    resuelve: {
      pieza: 'quim-molecula-3d',
      generar(s) {
        const k = FORMA_R[s % FORMA_R.length], v = M.vsepr(k), L = M.lewis(k), n = L.ligandos.length, m = L.paresLibres;
        return {
          enunciado: `El átomo central del ${L.formula} está unido a ${n} átomos y tiene ${m} par${m > 1 ? 'es' : ''} libre${m > 1 ? 's' : ''}. ¿Qué forma tiene la molécula?`,
          datos: datosForma(n, m),
          pasos: [
            { tipo: 'pide', texto: 'Piden la forma de la molécula: dónde quedan los átomos.' },
            { tipo: 'datos', texto: `El ${L.central} tiene ${n} enlaces y ${parTxt(m)}.` },
            { tipo: 'regla', texto: 'Cuento todas las regiones y las ordeno lo más lejos posible; después nombro la forma solo por los átomos.' },
            { tipo: 'cuentas', texto: `Son ${n} + ${m} = ${n + m} regiones, que se alejan lo más posible y se ordenan como ${FIG[v.geometriaDominios]}.`,
              ecuacion: [subAXE(v.AXE), ` → ${v.geometria}`], dibujo: mol3d(k) },
            { tipo: 'sentido', texto: `Los pares libres no se nombran, pero empujan: por eso los átomos quedan en forma ${v.geometria}.` },
          ],
          respuesta: [`${v.geometria.charAt(0).toUpperCase()}${v.geometria.slice(1)}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula-3d',
      voz: 'Cuenta enlaces y pares libres del central.',
      generar(sem) {
        const r = azar(sem * 71 + 23), tipo = sem % 4;
        if (tipo === 3) return vfDe(r, AFIRMA_F.slice(1), [D1.region, D1.formas]);
        return [casoForma, casoRegiones, casoAngulo][tipo](r);
      },
    },
  };


  // ---------- Idea 2 (nueva, 19 nov): hibridación y enlaces sigma y pi ----------
  // Propuesta B2. Objeto de la primera pantalla: un soplete de soldar, con su gas de carbono e hidrógeno (quim-enlace).
  // Cambia: la molécula · Permanece: la cuenta de regiones de cada carbono y de enlaces sigma y pi · Progresa: de solo
  // simples (sp³) a un doble (sp²) y a dos dobles (sp) · Se reserva: el triple enlace (Predice: el etino del soplete),
  // que no sale en el juego · Debe verse: que todo enlace tiene un sigma y que el doble suma un pi.
  // Errores: QM-HIB-TRIPLE-SP2 (sp² en un triple; trampa 29 de San Marcos, unas 12 veces), QM-HIB-ENLACES (cuenta los
  // pares compartidos como regiones), QM-HIB-CUENTA, EN12 (hibridación sin relación con la forma), QM-PI-SIGMA (el doble
  // como dos sigma), QM-PI-ELECTRONES (enlaces pi contra electrones pi; trampa 30), QM-SIGMA-SOLO-CC (olvida los C–H).
  const Ah = (id, t, x, y) => ({ id, t, x, y }), Bh = (a, b, orden = 1) => ({ a, b, orden });
  const HC = {
    CH4: { t: 'CH₄', atomos: [Ah('c', 'C', 0, 0), Ah('h1', 'H', 0, -1.1), Ah('h2', 'H', 0, 1.1), Ah('h3', 'H', -1.1, 0), Ah('h4', 'H', 1.1, 0)], enlaces: [Bh('c', 'h1'), Bh('c', 'h2'), Bh('c', 'h3'), Bh('c', 'h4')], pares: [], hib: 'sp3' },
    C2H6: { t: 'C₂H₆', atomos: [Ah('c1', 'C', -0.7, 0), Ah('c2', 'C', 0.7, 0), Ah('h1', 'H', -0.7, -1.1), Ah('h2', 'H', -0.7, 1.1), Ah('h3', 'H', -1.8, 0), Ah('h4', 'H', 0.7, -1.1), Ah('h5', 'H', 0.7, 1.1), Ah('h6', 'H', 1.8, 0)],
      enlaces: [Bh('c1', 'c2'), Bh('c1', 'h1'), Bh('c1', 'h2'), Bh('c1', 'h3'), Bh('c2', 'h4'), Bh('c2', 'h5'), Bh('c2', 'h6')], pares: [], hib: 'sp3' },
    C2H4: { t: 'C₂H₄', atomos: [Ah('c1', 'C', -0.65, 0), Ah('c2', 'C', 0.65, 0), Ah('h1', 'H', -1.15, -0.866), Ah('h2', 'H', -1.15, 0.866), Ah('h3', 'H', 1.15, -0.866), Ah('h4', 'H', 1.15, 0.866)],
      enlaces: [Bh('c1', 'c2', 2), Bh('c1', 'h1'), Bh('c1', 'h2'), Bh('c2', 'h3'), Bh('c2', 'h4')], pares: [], hib: 'sp2' },
    CH2O: { t: 'CH₂O', atomos: [Ah('c', 'C', 0, 0.2), Ah('o', 'O', 0, -1.0), Ah('h1', 'H', -1, 0.9), Ah('h2', 'H', 1, 0.9)], enlaces: [Bh('c', 'o', 2), Bh('c', 'h1'), Bh('c', 'h2')],
      pares: [{ en: 'o', ang: -135, color: 'f' }, { en: 'o', ang: -45, color: 'f' }], hib: 'sp2' },
    CO2: { t: 'CO₂', atomos: [Ah('o1', 'O', -1.25, 0), Ah('c', 'C', 0, 0), Ah('o2', 'O', 1.25, 0)], enlaces: [Bh('o1', 'c', 2), Bh('c', 'o2', 2)],
      pares: [135, -135].map(ang => ({ en: 'o1', ang, color: 'f' })).concat([45, -45].map(ang => ({ en: 'o2', ang, color: 'f' }))), hib: 'sp' },
    C2H2: { t: 'C₂H₂', atomos: [Ah('h1', 'H', -1.9, 0), Ah('c1', 'C', -0.65, 0), Ah('c2', 'C', 0.65, 0), Ah('h2', 'H', 1.9, 0)], enlaces: [Bh('h1', 'c1'), Bh('c1', 'c2', 3), Bh('c2', 'h2')], pares: [], hib: 'sp' },
  };
  const sigma = k => HC[k].enlaces.length, pi = k => HC[k].enlaces.reduce((a, e) => a + e.orden - 1, 0);
  const hcDib = (k, o = {}) => ({ pieza: 'quim-molecula', datos: Object.assign({ atomos: HC[k].atomos, enlaces: HC[k].enlaces, pares: HC[k].pares, escala: 56, alto: 170,
    alt: `Estructura del ${HC[k].t}: ${sigma(k)} enlaces sigma y ${pi(k)} pi.` }, o), estado: {} });
  const JUEGO_H = ['CH4', 'C2H6', 'C2H4', 'CH2O', 'CO2'];
  const MAX_PI = Math.max(...JUEGO_H.map(pi));
  const D2 = { hib: 'Hibridación por regiones del átomo: 2, sp; 3, sp²; 4, sp³; 5, sp³d; 6, sp³d²', sp: 'Enlace simple: 1 sigma (σ); doble: 1 σ y 1 pi (π); triple: 1 σ y 2 π',
    epi: 'Cada enlace pi tiene 2 electrones',
    rayas: 'Cada raya es un enlace; cada H escrito junto a un C (CH₃, H₂C) es un enlace C–H más' };
  // Moléculas escritas: [fórmula, σ, π].
  const SP_A = [['H₂C=CH₂', 5, 1, 4], ['H₂C=CH–CH₃', 8, 1, 6], ['O=C=O', 2, 2, 0], ['H–C≡N', 2, 2, 1], ['H₂C=O', 3, 1, 2], ['CH₃–CH₃', 7, 0, 6], ['N≡N', 1, 2, 0], ['H₂C=C=CH₂', 6, 2, 4]];
  const SP_R = [['H₂C=CH–CH=CH₂', 9, 2], ['HC≡C–CH₃', 6, 2], ['CH₃–C≡N', 5, 2]];
  const hTxt = h => HIB[h];
  function casoHibCentral(r) {
    const k = r.de(['CH4', 'BF3', 'H2O', 'NH3', 'CO2', 'BeCl2', 'CH2O', 'PCl5', 'SF6', 'SO2', 'HCN', 'XeF4']), v = M.vsepr(k), L = M.lewis(k), n = L.ligandos.length, m = L.paresLibres;
    const porLig = M.vsepr({ n, m: 0 }).hibridacion, porPares = L.paresEnlazantes + m;
    return {
      pregunta: `¿Qué hibridación tiene el átomo central del ${L.formula}, con ${n} enlaces y ${m === 0 ? 'ningún par libre' : `${m} par${m === 1 ? '' : 'es'} libre${m === 1 ? '' : 's'}`}?`,
      datos: [D2.hib, 'Región: cada enlace (simple, doble o triple) o par libre'],
      opciones: ops(hTxt(v.hibridacion), m ? [hTxt(porLig), 'QM-FORMA-LIGANDOS', 'Sería así si el central no tuviera pares libres. Sus pares libres también son regiones y cambian la hibridación.'] : ['sp³', 'QM-HIB-SIEMPRE-SP3', 'Sería así con cuatro regiones, como el carbono del metano. Cuenta las regiones que tiene este átomo central.'],
        porPares !== n + m && porPares <= 6 ? [hTxt(M.vsepr({ n: porPares, m: 0 }).hibridacion), 'QM-HIB-ENLACES', 'Sería así si cada par compartido fuera una región. Un enlace doble o triple es una sola región, no dos o tres.'] : ['sp²', 'QM-HIB-CUENTA', 'Sería sp² con tres regiones.'],
        ['sp', 'QM-HIB-CUENTA', 'Sería sp con dos regiones.'], ['sp³d', 'QM-HIB-CUENTA', 'Sería sp³d con cinco regiones.']),
      solucion: { texto: `El central tiene ${n} enlaces y ${parTxt(m)}, así que tiene ${n + m} regiones de electrones.`, ecuacion: [`${n + m} regiones → ${hTxt(v.hibridacion)}`] },
    };
  }
  function casoSigmaPi(r) {
    const [fo, s, p, nH] = r.de(SP_A);
    const tx = (a, b) => `${a} σ y ${b} π`;
    return {
      pregunta: `¿Cuántos enlaces sigma (σ) y cuántos pi (π) tiene el ${fo}?`,
      datos: [D2.sp, D2.rayas],
      opciones: ops(tx(s, p), [tx(s + p, 0), 'QM-PI-SIGMA', 'Sería así si todo par compartido fuera sigma. En un doble o un triple, el segundo y el tercer par son pi.'],
        [tx(s, 2 * p), 'QM-PI-ELECTRONES', 'Los sigma están bien, pero ese número cuenta electrones pi. Se piden enlaces pi, y cada uno tiene 2 electrones.'],
        nH ? [tx(s - nH, p), 'QM-SIGMA-SOLO-CC', 'Faltan los enlaces con los H. Cada uno es un enlace simple, así que también es sigma.'] : [tx(s, p + 1), 'QM-PI-CUENTA', 'Sobra un pi. Revisa cuántos dobles y triples hay: el doble aporta uno y el triple, dos.'],
        [tx(s + 1, p), 'QM-PI-SIGMA', 'Sobra un sigma. Un enlace doble o triple tiene un solo sigma, igual que uno simple.']),
      solucion: { texto: 'Cada enlace tiene un sigma, y los pi salen de los múltiples: uno por cada doble y dos por cada triple.', ecuacion: [`${s} σ`, SEP, `${p} π`] },
    };
  }
  const CARBONOS = [['H₂C=CH–CH₃', 'el carbono del CH₃', 'sp3'], ['H₂C=CH–CH₃', 'el carbono del medio', 'sp2'], ['HC≡C–CH₃', 'el carbono del medio', 'sp'],
    ['H₂C=C=CH₂', 'el carbono del medio', 'sp'], ['H₂C=C=CH₂', 'un carbono de la punta', 'sp2'], ['CH₃–C≡N', 'el carbono unido al N', 'sp'], ['H₂C=O', 'el carbono', 'sp2'], ['CH₃–CH₃', 'un carbono', 'sp3']];
  function casoCarbono(r) {
    const [fo, cual, h] = r.de(CARBONOS);
    const MALA = { sp: ['sp²', 'QM-HIB-TRIPLE-SP2', 'Sería sp² con tres regiones, como un carbono con un doble. Un triple o dos dobles le dejan solo dos.'], sp2: ['sp³', 'QM-HIB-ENLACES', 'Sería así si cada par del doble fuera una región. El doble es una sola región, así que son tres.'], sp3: ['sp²', 'QM-HIB-CUENTA', 'Sería sp² si el carbono tuviera un doble. Aquí todos sus enlaces son simples, así que tiene cuatro regiones.'] };
    const reg = { sp: 2, sp2: 3, sp3: 4 }[h];
    return {
      pregunta: `En el ${fo}, ¿qué hibridación tiene ${cual}?`,
      datos: [D2.hib, 'Región: cada enlace (simple, doble o triple) o par libre'],
      opciones: ops(hTxt(h), MALA[h], ...['sp', 'sp2', 'sp3'].filter(x => x !== h && hTxt(x) !== MALA[h][0]).map(x => [hTxt(x), 'QM-HIB-CUENTA', `Sería ${hTxt(x)} con ${{ sp: 2, sp2: 3, sp3: 4 }[x]} regiones.`]),
        ['sp³d', 'QM-HIB-CUENTA', 'Sería así con cinco regiones, y un carbono no pasa de cuatro.']),
      solucion: { texto: `Ese carbono tiene ${reg} regiones de electrones, contando cada doble o triple como una sola.`, ecuacion: [`${reg} regiones → ${hTxt(h)}`] },
    };
  }
  function casoElectronesPi(r) {
    const [fo, , p] = r.de(SP_A.filter(x => x[2] > 0));
    return {
      pregunta: `¿Cuántos electrones pi tiene el ${fo}?`,
      datos: [D2.sp, D2.epi],
      opciones: ops(String(2 * p), [String(p), 'QM-PI-ELECTRONES', 'Ese número cuenta enlaces pi, no electrones. Cada enlace pi tiene 2 electrones.'],
        [String(4 * p), 'QM-PI-DOBLE', 'Sería así si cada enlace pi tuviera 4 electrones. Cada uno tiene solo 2.'], [String(2 * p + 2), 'QM-PI-SIGMA', 'Sobran 2 electrones. Los del sigma no son electrones pi.']),
      solucion: { texto: p > 1 ? `Hay ${p} enlaces pi, con 2 electrones cada uno.` : 'Hay 1 enlace pi, que tiene 2 electrones.', ecuacion: [`${p} · 2 = `, El(`${2 * p} e⁻ π`)] },
    };
  }
  const AFIRMA_H = [
    ['Todo enlace tiene un sigma.', true, 'el primer par de cualquier enlace forma un sigma'],
    ['Un enlace doble tiene dos sigma.', false, 'un doble tiene un sigma y un pi'],
    ['El carbono del CH₄ es sp³.', true, 'ese carbono tiene cuatro regiones'],
    ['En el CO₂, el carbono es sp².', false, 'ese carbono tiene dos regiones, así que es sp'],
    ['El eteno, H₂C=CH₂, tiene 2 electrones pi.', true, 'el eteno tiene un enlace pi, con 2 electrones'],
    ['Un carbono sp² tiene cuatro regiones.', false, 'un carbono sp² tiene tres regiones'],
  ];

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas-b.js): CH₄ 4 → sp³ · H₂C=CH₂ 5 σ 1 π · CO₂ sp · N≡N 1 σ 2 π ·
  // BF₃ 3 → sp² · H₂C=CH–CH₃ 8 σ 1 π · H₂C=O sp², 3 σ 1 π · H₂O 4 → sp³ · HC≡C–CH₃ 6 σ 2 π, 4 e⁻ π · PCl₅ sp³d · CH₃–C≡N
  // sp³ y sp · H₂C=CH–CH=CH₂ 9 σ 2 π, 4 e⁻ π · SF₆ sp³d² · H₂C=C=CH₂ sp², sp, sp².
  const EJEMPLOS_HIB = [
    { nivel: 1, titulo: 'El carbono del metano',
      enunciado: 'El carbono del CH₄ tiene cuatro enlaces simples y ningún par libre. ¿Qué hibridación tiene?',
      datos: [D2.hib],
      solucion: [{ texto: 'Sus cuatro enlaces simples son cuatro regiones de electrones.', ecuacion: ['4 regiones → sp³'] }],
      respuesta: ['sp³'] },
    { nivel: 1, titulo: 'Sigma y pi del eteno',
      enunciado: '¿Cuántos enlaces sigma y pi tiene el eteno, H₂C=CH₂?',
      datos: [D2.sp],
      figura: hcDib('C2H4'),
      solucion: [{ texto: 'Hay cuatro C–H y un C=C: son cinco enlaces, así que hay cinco sigma. El doble suma además un pi.', ecuacion: ['5 σ', SEP, '1 π'] }],
      respuesta: ['5 σ y 1 π'] },
    { nivel: 1, titulo: 'El carbono del CO₂',
      enunciado: 'El carbono del O=C=O tiene dos enlaces dobles y ningún par libre. ¿Qué hibridación tiene?',
      datos: [D2.hib],
      solucion: [{ texto: 'Cada doble cuenta como una región, así que el carbono tiene dos.', ecuacion: ['2 regiones → sp'] }],
      respuesta: ['sp'] },
    { nivel: 1, titulo: 'El triple del nitrógeno',
      enunciado: '¿Cuántos enlaces sigma y pi tiene el N≡N?',
      datos: [D2.sp],
      solucion: [{ texto: 'Hay un solo enlace, y es triple: tiene un sigma y dos pi.', ecuacion: ['1 σ', SEP, '2 π'] }],
      respuesta: ['1 σ y 2 π'] },
    { nivel: 1, titulo: 'El boro del BF₃',
      enunciado: 'El boro del BF₃ tiene tres enlaces y ningún par libre. ¿Qué hibridación tiene?',
      datos: [D2.hib],
      solucion: [{ texto: 'Sus tres enlaces son tres regiones de electrones.', ecuacion: ['3 regiones → sp²'] }],
      respuesta: ['sp²'] },
    { nivel: 2, titulo: 'Tres carbonos y un doble',
      enunciado: '¿Cuántos enlaces sigma y pi tiene el H₂C=CH–CH₃?',
      datos: [D2.sp, D2.rayas],
      solucion: [
        { texto: 'Cuento los enlaces: seis C–H, un C=C y un C–C.', ecuacion: ['6 + 1 + 1 = 8 σ'] },
        { texto: 'Cada enlace aporta un sigma, y el doble suma además un pi.', ecuacion: ['1 π'] },
      ],
      respuesta: ['8 σ y 1 π'] },
    { nivel: 2, titulo: 'El carbono del CH₂O',
      enunciado: 'En el H₂C=O, ¿qué hibridación tiene el carbono y cuántos enlaces sigma y pi hay?',
      datos: [D2.hib, D2.sp],
      solucion: [
        { texto: 'El carbono tiene dos C–H y un C=O: tres regiones.', ecuacion: ['3 regiones → sp²'] },
        { texto: 'Hay tres enlaces, así que hay tres sigma, y el doble suma un pi.', ecuacion: ['3 σ', SEP, '1 π'] },
      ],
      respuesta: ['sp²; 3 σ y 1 π'] },
    { nivel: 2, titulo: 'El oxígeno del agua',
      enunciado: 'El oxígeno del H₂O tiene dos enlaces y dos pares libres. ¿Qué hibridación tiene?',
      datos: [D2.hib, 'Región: cada enlace (simple, doble o triple) o par libre'],
      solucion: [
        { texto: 'Los dos pares libres del oxígeno también son regiones.', ecuacion: ['2 + 2 = 4 regiones'] },
        { texto: 'Con cuatro regiones, el oxígeno es sp³, aunque la molécula tenga solo tres átomos.' },
      ],
      respuesta: ['sp³'] },
    { nivel: 2, titulo: 'Electrones pi de un triple',
      enunciado: 'En el HC≡C–CH₃, ¿cuántos enlaces pi hay y cuántos electrones pi?',
      datos: [D2.sp, D2.epi],
      solucion: [
        { texto: 'Solo el triple tiene enlaces pi, y tiene dos.', ecuacion: ['2 π'] },
        { texto: 'Cada pi tiene 2 electrones.', ecuacion: ['2 · 2 = ', El('4 e⁻ π')] },
      ],
      respuesta: ['2 enlaces pi y ', El('4 electrones pi')] },
    { nivel: 2, titulo: 'El fósforo con cinco cloros',
      enunciado: 'El fósforo del PCl₅ tiene cinco enlaces y ningún par libre. ¿Qué hibridación tiene?',
      datos: [D2.hib],
      solucion: [
        { texto: 'Para cinco regiones no alcanzan un orbital s y tres p: hace falta además un orbital d.', ecuacion: ['5 regiones → sp³d'] },
        { texto: 'El fósforo puede usarlo porque es del periodo 3, donde ya hay orbitales d.' },
      ],
      respuesta: ['sp³d'] },
    { nivel: 3, titulo: 'Dos carbonos del CH₃–C≡N',
      enunciado: 'En el CH₃–C≡N, ¿qué hibridación tienen el carbono del CH₃ y el carbono unido al N?',
      alternativas: ['sp³ y sp²', 'sp² y sp', 'sp y sp', 'sp³ y sp³', 'sp³ y sp'],
      datos: [D2.hib, 'Región: cada enlace (simple, doble o triple) o par libre'],
      solucion: [
        { texto: 'El carbono del CH₃ tiene cuatro enlaces simples, que son 4 regiones. El otro tiene un C–C y un triple, que son 2.', ecuacion: ['sp³', SEP, 'sp'] },
        { texto: ['La ', letra('A'), ' le da sp² al carbono del triple: esa es la trampa del examen. La ', letra('B'), ' y la ', letra('C'), ' le dan al carbono del CH₃ una hibridación que no es sp³.'] },
        { texto: ['La ', letra('D'), ' cuenta los pares del triple como regiones.'] },
      ],
      respuesta: [letra('E'), ', sp³ y sp'] },
    { nivel: 3, titulo: 'Una cadena con dos dobles',
      enunciado: '¿Cuántos enlaces sigma y electrones pi tiene el H₂C=CH–CH=CH₂?',
      alternativas: ['9 σ y 2 electrones pi', '9 σ y 4 electrones pi', '11 σ y 0 electrones pi', '7 σ y 4 electrones pi', '9 σ y 8 electrones pi'],
      datos: [D2.sp, D2.epi, D2.rayas],
      solucion: [
        { texto: 'Hay seis C–H y tres enlaces entre carbonos: nueve sigma. Los dos dobles aportan dos pi, con 2 electrones cada uno.', ecuacion: ['6 + 3 = 9 σ', SEP, '2 · 2 = ', El('4 e⁻ π')] },
        { texto: ['La ', letra('A'), ' cuenta enlaces pi, no electrones. La ', letra('C'), ' toma cada doble como dos sigma.'] },
        { texto: ['La ', letra('D'), ' olvida dos sigma. La ', letra('E'), ' cuenta los 4 electrones de cada doble entero.'] },
      ],
      respuesta: [letra('B'), ', 9 σ y 4 electrones pi'] },
    { nivel: 3, titulo: 'Las hibridaciones del azufre',
      enunciado: 'El azufre del SF₆ tiene seis enlaces y ningún par libre. ¿Qué hibridación y qué forma tiene?',
      alternativas: ['sp³, tetraédrica', 'sp³d, bipirámide trigonal', 'sp³d², octaédrica', 'sp², trigonal plana', 'sp³d², cuadrada plana'],
      datos: [D2.hib, 'Formas: 4 regiones tetraédrica; 5 bipirámide trigonal; 6 octaédrica'],
      solucion: [
        { texto: 'El azufre tiene seis regiones, todas con átomos.', ecuacion: ['6 regiones → sp³d², octaédrica'] },
        { texto: ['La ', letra('A'), ' cree que el S cumple el octeto (4 regiones). La ', letra('D'), ' cuenta la mitad de las regiones. La ', letra('B'), ' cuenta una región menos.'] },
        { texto: ['La ', letra('E'), ' es la forma del XeF₄, con dos pares libres.'] },
      ],
      respuesta: [letra('C'), ', sp³d² y octaédrica'] },
    { nivel: 3, titulo: 'Tres carbonos seguidos',
      enunciado: 'En el H₂C=C=CH₂, ¿qué hibridación tiene cada carbono, de izquierda a derecha?',
      alternativas: ['sp², sp y sp²', 'sp³, sp³ y sp³', 'sp², sp² y sp²', 'sp, sp y sp', 'sp², sp³ y sp²'],
      datos: [D2.hib, 'Región: cada enlace (simple, doble o triple) o par libre'],
      solucion: [
        { texto: 'Cada carbono de las puntas tiene dos C–H y un doble: 3 regiones. El del medio tiene dos dobles: 2 regiones.', ecuacion: ['sp²', SEP, 'sp', SEP, 'sp²'] },
        { texto: ['La ', letra('B'), ' cuenta cada par compartido como región. La ', letra('E'), ' hace lo mismo, pero solo en el del medio. La ', letra('C'), ' olvida que el del medio tiene dos dobles.'] },
        { texto: ['La ', letra('D'), ' les da a todos la hibridación del carbono del medio.'] },
      ],
      respuesta: [letra('A'), ', sp², sp y sp²'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. Todo enlace tiene un sigma. II. Un enlace doble tiene dos sigma. III. En el CO₂, el carbono es sp².',
      alternativas: ['VVV', 'VVF', 'FFV', 'VFF', 'VFV'],
      datos: [D2.hib, D2.sp],
      solucion: [
        { texto: 'I es verdadera. II es falsa: un doble tiene un sigma y un pi. III es falsa: el carbono del CO₂ tiene dos regiones, es sp.', ecuacion: ['VFF'] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' toman el doble como dos sigma. La ', letra('C'), ' niega el sigma de todo enlace.'] },
        { texto: ['La ', letra('E'), ' cuenta los dos dobles del CO₂ como tres regiones.'] },
      ],
      respuesta: [letra('D'), ', VFF'] },
  ];

  const hibridacion = {
    id: 'hibridacion',
    titulo: 'Hibridación y enlaces sigma y pi',
    pregunta: '¿Qué tienen de distinto un enlace simple, uno doble y uno triple?',
    temas: ['Hibridación y geometría molecular', 'Enlaces sigma y pi'],
    pieza: 'quim-molecula',
    aprendizaje: 'Las regiones dan la hibridación: 2, sp; 3, sp²; 4, sp³. Todo enlace tiene un sigma; el doble suma un pi y el triple, dos.',
    actividad: 'Contar regiones y enlaces sigma y pi en cinco moléculas.',
    lee: {
      tarjetas: [
        { titulo: 'El soplete', texto: 'Un soplete de soldar quema acetileno, un gas de carbono e hidrógeno, con oxígeno: su llama llega a unos 3000 °C. Sus dos carbonos están unidos por un enlace múltiple.',
          pieza: 'quim-enlace', dibujo: { pieza: 'quim-enlace', datos: { vista: 'objeto', objeto: 'soplete', nombre: 'Un soplete de soldar' }, estado: {} } },
        { titulo: 'Orbitales que se mezclan', texto: 'Para apuntar hacia sus regiones de electrones, un átomo mezcla sus orbitales s y p: eso es la hibridación. Su nombre cuenta los orbitales mezclados, uno por región: sp³ junta un s y tres p (cuatro); sp², un s y dos p (tres).' },
        { titulo: 'Sigma y pi', texto: 'El primer par que comparten dos átomos va justo entre ellos: es el enlace sigma (σ). El segundo y el tercero, en un doble o un triple, van por los costados: son enlaces pi (π).' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges una molécula. Cuenta las regiones de cada carbono y cuántos enlaces sigma y pi tiene en total.' },
      ],
    },
    ejemplos: EJEMPLOS_HIB,
    juega: {
      pieza: 'quim-molecula',
      consigna: 'Recorre las cinco moléculas. Cuenta las regiones de cada carbono y los enlaces sigma y pi de toda la molécula.',
      mision: {
        texto: 'Encuentra la molécula que tiene dos enlaces pi.',
        logrado: v => pi(v.k) === MAX_PI,
        bien: 'El CO₂: cada doble tiene un sigma y un pi, y su carbono es sp.',
      },
      voz: 'Todo enlace trae un sigma; el doble trae además un pi.',
      leyenda: [
        { s: 'σ', t: 'enlace sigma: hay uno en todo enlace' },
        { s: 'π', t: 'enlace pi: extra del doble y del triple' },
        { s: 'sp³', t: 'hibridación: orbitales mezclados del átomo' },
      ],
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: JUEGO_H.map(k => ({ valor: k, texto: HC[k].t })), inicio: 'CH4' }],
      dibujo: v => hcDib(v.k),
      lectura: v => [`${HC[v.k].t}: ${sigma(v.k)} σ y ${pi(v.k)} π; ${v.k === 'CH2O' || v.k === 'CO2' || v.k === 'CH4' ? 'el C' : 'cada C'}, ${hTxt(HC[v.k].hib)}`],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'En el gas del soplete, H–C≡C–H, cada carbono tiene un enlace simple con un hidrógeno y uno triple con el otro carbono. ¿Qué hibridación tiene cada carbono?',
      datos: ['Cada carbono: 1 enlace simple y 1 enlace triple', 'Ningún par libre en los carbonos'],
      voz: 'Cuenta regiones, no pares compartidos.',
      opciones: [
        { id: 'c', texto: 'sp', correcta: true },
        { id: 'sp2', texto: 'sp²', error: 'QM-HIB-TRIPLE-SP2', siFuera: 'Sería sp² con tres regiones, como un carbono con un doble. Aquí cada carbono tiene dos: el C–H y el triple.' },
        { id: 'sp3', texto: 'sp³', error: 'QM-HIB-ENLACES', siFuera: 'Sería así si cada par compartido fuera una región. El triple es una sola región, igual que el enlace simple.' },
        { id: 'sp3d', texto: 'sp³d', error: 'QM-HIB-CUENTA', siFuera: 'Sería así con cinco regiones, y un carbono no pasa de cuatro.' },
      ],
      dibujo: hcDib('C2H2', { textos: [{ x: -0.65, y: -0.75, t: '?' }, { x: 0.65, y: -0.75, t: '?' }], alt: 'Estructura del H–C≡C–H; la hibridación de cada carbono es lo que se pregunta.' }),
      revelar: hcDib('C2H2', { textos: [{ x: -0.65, y: -0.75, t: 'sp' }, { x: 0.65, y: -0.75, t: 'sp' }], alt: 'Estructura del H–C≡C–H: cada carbono, con dos regiones, es sp; la molécula es lineal.' }),
      coincide: 'Coincide: dos regiones por carbono, sp, y la molécula es lineal.',
      noCoincide: 'Es sp: cada carbono tiene dos regiones, el C–H y el triple.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: Object.assign(hcDib('C2H4').datos, { textos: [{ x: 0, y: -0.55, t: 'π', desde: 3 }, { x: -0.65, y: 0.65, t: 'sp²', desde: 2 }, { x: 0.65, y: 0.65, t: 'sp²', desde: 2 }],
        alt: 'El eteno H₂C=CH₂: cada carbono con tres regiones, sp²; el segundo par del doble enlace es un enlace pi.' }),
      voz: 'Contemos las regiones de cada carbono del eteno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada C del eteno tiene tres regiones: dos C–H y el doble.', ecuacion: ['1 + 1 + 1 = 3'] },
        { estado: { corte: 2 }, texto: 'Con tres regiones, cada carbono es sp²: sus tres orbitales quedan en un plano, a 120°.', ecuacion: ['3 regiones → sp²'] },
        { estado: { corte: 3 }, texto: 'Todo enlace tiene un sigma; el doble suma un pi por los costados.', ecuacion: ['C=C: 1 σ + 1 π'] },
        { estado: { corte: 3 }, texto: 'En total, el eteno tiene cinco sigma y un pi.', ecuacion: ['4 C–H + 1 C=C = 5 σ', SEP, '1 π'] },
        { estado: { corte: 3 }, texto: 'Con cuatro regiones el átomo es sp³, como el carbono del metano; con dos es sp, como el del CO₂.' },
      ],
    },
    regla: {
      texto: 'Las regiones de un átomo dan su hibridación: 2, sp; 3, sp²; 4, sp³. Todo enlace tiene un sigma; el doble suma un pi y el triple, dos. Cada enlace pi tiene 2 electrones.',
      ecuacion: ['2: sp', SEP, '3: sp²', SEP, '4: sp³', SEP, '5: sp³d; 6: sp³d²', SEP, 'doble:\u00a01\u00a0σ\u00a0+\u00a01\u00a0π', SEP, 'triple:\u00a01\u00a0σ\u00a0+\u00a02\u00a0π'],
      condicion: 'los pares libres se cuentan como regiones y cada enlace doble o triple se cuenta como una sola.',
      voz: 'Regiones para la hibridación; rayas para sigma y pi.',
      dibujo: hcDib('C2H4'),
    },
    resuelve: {
      pieza: 'quim-molecula',
      generar(s) {
        const [fo, sg, p] = SP_R[s % SP_R.length];
        return {
          enunciado: `¿Cuántos enlaces sigma (σ) y pi (π) tiene el ${fo}?`,
          datos: [D2.sp, D2.rayas],
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos enlaces sigma y cuántos pi tiene el ${fo}.` },
            { tipo: 'datos', texto: 'Las rayas de la fórmula son enlaces, y cada H escrito junto a un C (CH₃, CH₂, CH) es un enlace C–H que no lleva raya.' },
            { tipo: 'regla', texto: 'Cada enlace tiene un sigma; además, cada doble suma un pi y cada triple, dos.' },
            { tipo: 'cuentas', texto: 'Cuento todos los enlaces, con los C–H escondidos, y cada uno da un sigma; después sumo los pi de los dobles y triples.', ecuacion: [`${sg} σ`, SEP, `${p} π`] },
            { tipo: 'sentido', texto: 'Los enlaces con H son siempre simples: solo aportan sigma.' },
          ],
          respuesta: [`${sg} σ y ${p} π`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Regiones para la hibridación; enlaces para sigma y pi.',
      generar(sem) {
        const r = azar(sem * 67 + 29), tipo = sem % 5;
        if (tipo === 4) return vfDe(r, AFIRMA_H, [D2.hib, D2.sp]);
        return [casoHibCentral, casoSigmaPi, casoCarbono, casoElectronesPi][tipo](r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): polaridad de la molécula ----------
  // Propuesta B3. Objeto de la primera pantalla: un chorrito de agua que se dobla junto a un peine frotado (quim-enlace).
  // Cambia: la molécula · Permanece: las flechas de dipolo de cada enlace en 3D · Progresa: de las que dejan una flecha
  // total a las que la anulan · Se reserva: el CH₂Cl₂ (Predice; 26 % de acierto en Karonen y otros 2021), que no está en
  // el juego · Debe verse: si las flechas, en el espacio, se anulan o no.
  // Errores: EN10 (polaridad desde el dibujo plano; 56 % antes y 71 % después), EN11 (un solo factor: «simétrica,
  // apolar», «átomos distintos, polar», «enlaces polares, polar»), QM-POL-ENLACE (enlaces apolares), QM-POL-PARES (los pares
  // libres no cuentan para la forma).
  const JUEGO_P = ['H2O', 'NH3', 'CO2', 'BF3', 'CH4', 'CCl4', 'CHCl3', 'HCN'];
  const polar = k => M.polaridad(k).polar;
  const D3 = { dipolo: 'Dipolo de enlace: flecha hacia el átomo de mayor electronegatividad', suma: 'Molécula polar: sus dipolos de enlace, sumados en 3D, no dan cero',
    en: 'EN: H 2,20; C 2,55; N 3,04; O 3,44; F 3,98; Cl 3,16; B 2,04; S 2,58; P 2,19; Be 1,57' };
  const POL_A = ['SO2', 'BCl3', 'PCl3', 'CH3Cl', 'BeCl2', 'H2S', 'NF3', 'SF6', 'XeF4', 'COCl2', 'SCl2', 'SO3'], POL_R = ['CCl4', 'CHCl3', 'H2O', 'BF3'];
  const POL_TXT = { si: 'Polar: sus dipolos no se anulan', no: 'Apolar: sus dipolos se anulan' };
  function casoPolar(r) {
    const k = r.de(POL_A), x = M.molecula(k), pol = x.polaridad.polar, fm = x.vsepr.geometria;
    return {
      // El S–H (ΔEN 0,38) es apenas polar, como el C–H (0,35) que la unidad llama «casi no polar»: se dice «algo polares».
      pregunta: `El ${x.formula} tiene forma ${fm} y enlaces ${k === 'H2S' ? 'algo ' : ''}polares. ¿La molécula es polar?`,
      datos: [D3.dipolo, D3.suma],
      opciones: ops(POL_TXT[pol ? 'si' : 'no'], pol ? [POL_TXT.no, 'EN10', 'Sería así si la forma fuera simétrica y los átomos de alrededor, iguales. Aquí falta una de las dos cosas, así que las flechas no se anulan.'] : [POL_TXT.si, 'EN11', 'Sería así si la forma no repartiera las flechas por igual. Aquí la forma es simétrica y las flechas se anulan.'],
        ['Apolar: sus enlaces no son polares', 'QM-POL-ENLACE', 'Sería así con enlaces apolares, pero el enunciado dice que sus enlaces son polares.'],
        pol ? (new Set(x.ligandos).size === 1 ? ['Apolar: sus átomos de alrededor son iguales', 'EN11', 'Los átomos de alrededor sí son iguales, pero los pares libres del central rompen la simetría y dejan una flecha total.']
          : ['Apolar: su forma es simétrica', 'EN11', 'Sería así si los átomos de alrededor fueran iguales. La forma es simétrica, pero esos átomos no son todos iguales.']) : ['Polar: tiene átomos distintos', 'EN11', 'Sería así si la forma no anulara las flechas. Tener átomos distintos no basta: aquí las flechas se anulan.']),
      solucion: { texto: pol ? 'La forma no reparte las flechas por igual, así que queda una flecha total.' : 'La forma es simétrica y los átomos de alrededor son iguales, así que las flechas suman cero.', ecuacion: [mu, pol ? ' ≠ 0' : ' = 0'] },
    };
  }
  function casoCualPolar(r) {
    const si = r.de(['H2O', 'NH3', 'SO2', 'PCl3', 'CHCl3', 'H2S', 'HCN']), no = r.baraja(['CO2', 'BF3', 'CCl4', 'CH4', 'BeCl2', 'SF6', 'SO3']).slice(0, 3);
    const t = k => M.molecula(k).formula, lista = r.baraja([si, ...no]);
    return {
      pregunta: `¿Cuál de estas moléculas es polar: ${lista.map(t).join(', ')}?`,
      datos: [D3.suma, `Formas: ${lista.map(k => `${t(k)} ${FORMA(k)}`).join('; ')}`],
      opciones: ops(t(si), ...no.map(k => [t(k), enlacesPolares(k) ? 'EN11' : 'QM-POL-ENLACE', enlacesPolares(k) ? `El ${t(k)} tiene enlaces polares, pero su forma ${FORMA(k)} anula sus flechas.` : `El ${t(k)} es apolar porque sus enlaces casi no son polares.`])),
      solucion: { texto: `El ${t(si)} es polar: con su forma ${FORMA(si)}, sus flechas no se anulan.`, ecuacion: [t(si), ': ', mu, ' ≠ 0'] },
    };
  }
  const AFIRMA_P = [
    ['El CO₂ es apolar aunque sus enlaces son polares.', true, 'sus dos flechas son iguales y opuestas'],
    ['Toda molécula con átomos distintos es polar.', false, 'el CO₂ y el CCl₄ tienen átomos distintos y son apolares'],
    ['El CCl₄ es polar porque el Cl jala más que el C.', false, 'sus cuatro flechas se anulan en el tetraedro'],
    ['El agua es polar.', true, 'el agua es angular y sus flechas no se anulan'],
    ['El BF₃ es polar por tener un par libre.', false, 'el boro no tiene pares libres y la molécula es apolar'],
    ['El NH₃ es polar.', true, 'es piramidal, y su par libre deja una flecha total'],
  ];

  // «Mira» en el plano: el CO₂ (lineal) y el H₂O (angular) lado a lado, con sus flechas.
  const Am = (id, t, x, y, o) => Object.assign({ id, t, x, y }, o || {});
  const MIRA_P = {
    atomos: [Am('ao1', 'O', -3.2, 0, { desde: 1 }), Am('ac', 'C', -1.7, 0, { desde: 1 }), Am('ao2', 'O', -0.2, 0, { desde: 1 }),
      Am('bo', 'O', 1.9, -0.45, { desde: 3 }), Am('bh1', 'H', 0.79, 0.41, { desde: 3 }), Am('bh2', 'H', 3.01, 0.41, { desde: 3 })],
    enlaces: [{ a: 'ao1', b: 'ac', orden: 2, dipolo: 'a', desde: 1 }, { a: 'ac', b: 'ao2', orden: 2, dipolo: 'b', desde: 1 },
      { a: 'bo', b: 'bh1', dipolo: 'a', desde: 3 }, { a: 'bo', b: 'bh2', dipolo: 'a', desde: 3 }],
    pares: [{ en: 'bo', ang: -125, color: 'f', desde: 4 }, { en: 'bo', ang: -55, color: 'f', desde: 4 }],
    angulos: [{ en: 'bo', de: 'bh1', a: 'bh2', texto: '104,5°', color: 'i', desde: 4 }],
    flechas: [{ de: [1.9, 1.9], a: [1.9, 1.2], dipolo: true, color: 'o', desde: 4 }],
    textos: [{ x: -1.7, y: 0.95, t: 'suma: 0', color: 'o', desde: 2 }],
    escala: 46, alto: 220,
    alt: 'A la izquierda, O=C=O con sus dos flechas opuestas: suman cero. A la derecha, el agua angular, a 104,5°, con dos pares libres en el O y una flecha total hacia abajo.',
  };

  // Ejemplos de la idea 3. Comprobados con el motor de plantillas/enlace y aparte (cuentas-b.js): CO₂ apolar · H₂O polar ·
  // BF₃ apolar · NH₃ polar · CH₄ apolar · CCl₄ apolar, CHCl₃ polar · SO₂ polar · BeCl₂ apolar, H₂S polar · CH₃Cl polar ·
  // XeF₄ apolar · PCl₅ apolar · NF₃ polar · SO₃ apolar.
  const EJEMPLOS_POL = [
    { nivel: 1, titulo: 'Dos flechas opuestas',
      enunciado: 'El CO₂ es lineal y sus dos enlaces C=O son polares. ¿La molécula es polar?',
      datos: [D3.dipolo, D3.suma],
      solucion: [{ texto: 'Las dos flechas son iguales y apuntan en sentidos opuestos: se anulan.', ecuacion: [mu, ' = 0'] }],
      respuesta: ['Apolar'] },
    { nivel: 1, titulo: 'El agua dobla el chorro',
      enunciado: 'El agua es angular y sus dos enlaces O–H son polares. ¿La molécula es polar?',
      datos: [D3.dipolo, D3.suma],
      solucion: [{ texto: 'Las dos flechas apuntan hacia el O, en ángulo: no se anulan y queda una flecha total.', ecuacion: [mu, ' ≠ 0'] }],
      respuesta: ['Polar'] },
    { nivel: 1, titulo: 'Tres flechas en un plano',
      enunciado: 'El BF₃ es trigonal plano, con tres enlaces B–F iguales. ¿La molécula es polar?',
      datos: [D3.dipolo, D3.suma],
      figura: mol3d('BF3', { dipolos: true, conPolar: false, alt: 'El BF₃ en 3D, con sus tres flechas de enlace hacia los flúor.' }),
      solucion: [{ texto: 'Las tres flechas son iguales y quedan a 120°: se reparten por igual y suman cero.', ecuacion: [mu, ' = 0'] }],
      respuesta: ['Apolar'] },
    { nivel: 1, titulo: 'La pirámide del amoníaco',
      enunciado: 'El NH₃ es piramidal: tres H abajo y un par libre arriba. ¿La molécula es polar?',
      datos: [D3.dipolo, D3.suma],
      solucion: [{ texto: 'Las tres flechas apuntan hacia el N y no se anulan: queda una flecha total hacia arriba.', ecuacion: [mu, ' ≠ 0'] }],
      respuesta: ['Polar'] },
    { nivel: 1, titulo: 'El metano',
      enunciado: 'El CH₄ es tetraédrico, con cuatro C–H iguales que casi no son polares. ¿La molécula es polar?',
      datos: [D3.suma, 'EN: C 2,55; H 2,20'],
      solucion: [{ texto: 'Sus enlaces casi no tienen flecha y, además, las cuatro se anularían en el tetraedro.' }],
      respuesta: ['Apolar'] },
    { nivel: 2, titulo: 'Un cloro cambiado',
      enunciado: 'El CCl₄ y el CHCl₃ son tetraédricos. ¿Cuál es polar?',
      datos: [D3.dipolo, D3.suma, 'EN: H 2,20; C 2,55; Cl 3,16'],
      solucion: [
        { texto: 'En el CCl₄, las cuatro flechas son iguales y se anulan en el tetraedro.' },
        { texto: 'En el CHCl₃, un H en lugar de un Cl rompe la simetría, y queda una flecha total.', ecuacion: ['CHCl₃: ', mu, ' ≠ 0'] },
      ],
      respuesta: ['El CHCl₃'] },
    { nivel: 2, titulo: 'Un gas angular',
      enunciado: 'El azufre del SO₂ tiene dos dobles con O y un par libre. ¿Qué forma tiene y es polar?',
      datos: [D3.dipolo, D3.suma, 'Con 3 regiones y un par libre: forma angular'],
      solucion: [
        { texto: 'El azufre tiene tres regiones y una es par libre, así que la forma es angular.' },
        { texto: 'Las dos flechas S→O quedan en ángulo: no se anulan.', ecuacion: [mu, ' ≠ 0'] },
      ],
      respuesta: ['Angular y polar'] },
    { nivel: 2, titulo: 'Dos moléculas de tres átomos',
      enunciado: 'El BeCl₂ es lineal y el H₂S es angular. Los dos tienen enlaces polares (los S–H, apenas). ¿Cuál es polar?',
      datos: [D3.dipolo, D3.suma],
      solucion: [
        { texto: 'En el BeCl₂, las dos flechas son opuestas y se anulan. En el H₂S quedan en ángulo, y queda una flecha total.' },
      ],
      respuesta: ['El H₂S'] },
    { nivel: 2, titulo: 'El metano con un cloro',
      enunciado: 'El CH₃Cl es tetraédrico, con tres C–H y un C–Cl. ¿Es polar?',
      datos: [D3.suma, 'EN: H 2,20; C 2,55; Cl 3,16'],
      solucion: [
        { texto: 'El C–Cl es mucho más polar que los C–H: su flecha no tiene otra que la anule.', ecuacion: [mu, ' ≠ 0'] },
      ],
      respuesta: ['Polar'] },
    { nivel: 2, titulo: 'Cuatro flúor en cruz',
      enunciado: 'El XeF₄ es cuadrado plano: cuatro F en cruz y dos pares libres, arriba y abajo. ¿Es polar?',
      datos: [D3.dipolo, D3.suma],
      solucion: [
        { texto: 'Las cuatro flechas Xe→F se anulan de dos en dos, y los dos pares libres quedan opuestos.', ecuacion: [mu, ' = 0'] },
        { texto: 'Tener pares libres no la hace polar, porque aquí los pares también quedan opuestos.' },
      ],
      respuesta: ['Apolar'] },
    { nivel: 3, titulo: 'Polar y apolar',
      enunciado: '¿Cuál de estas moléculas es polar: CO₂, BF₃, CCl₄, NF₃ o SO₃?',
      alternativas: ['CO₂', 'BF₃', 'CCl₄', 'SO₃', 'NF₃'],
      datos: [D3.suma, 'Formas: CO₂ lineal; BF₃ y SO₃ trigonal plana; CCl₄ tetraédrica; NF₃ piramidal'],
      solucion: [
        { texto: 'El NF₃ es piramidal, con un par libre en el N: sus flechas no se anulan.' },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ', la ', letra('C'), ' y la ', letra('D'), ' tienen enlaces polares, pero formas simétricas que los anulan.'] },
      ],
      respuesta: [letra('E'), ', el NF₃'] },
    { nivel: 3, titulo: 'La razón del CCl₄',
      enunciado: 'El CCl₄ tiene cuatro enlaces C–Cl polares. ¿Qué afirmación es correcta?',
      alternativas: ['Es apolar: sus cuatro dipolos se anulan en el tetraedro.', 'Es polar: el Cl jala más que el C.', 'Es polar: tiene átomos distintos.', 'Es apolar: sus enlaces no son polares.', 'Es polar: en el papel se ve como una cruz.'],
      datos: [D3.dipolo, D3.suma, 'EN: C 2,55; Cl 3,16'],
      solucion: [
        { texto: 'Las cuatro flechas son iguales y apuntan a las puntas de un tetraedro, así que la suma da cero.' },
        { texto: ['La ', letra('B'), ' y la ', letra('C'), ' miran un solo factor. La ', letra('D'), ' acierta en apolar con una razón falsa: los C–Cl sí son polares.'] },
        { texto: ['La ', letra('E'), ' lee la molécula en el plano.'] },
      ],
      respuesta: [letra('A'), ', apolar por su forma'] },
    { nivel: 3, titulo: 'Pares libres y polaridad',
      enunciado: 'El H₂O y el XeF₂ tienen pares libres en su átomo central. El agua es angular y el XeF₂, lineal. ¿Qué afirmación es correcta?',
      alternativas: ['Los dos son polares: tienen pares libres.', 'El H₂O es polar y el XeF₂, apolar.', 'Los dos son apolares.', 'El XeF₂ es polar y el H₂O, apolar.', 'El H₂O es apolar porque sus dos H son iguales.'],
      datos: [D3.dipolo, D3.suma],
      solucion: [
        { texto: 'El H₂O es angular y sus flechas no se anulan. El XeF₂ es lineal, y sus dos flechas opuestas se anulan.' },
        { texto: ['La ', letra('A'), ' cree que un par libre basta. La ', letra('C'), ' y la ', letra('E'), ' olvidan el ángulo del agua.'] },
        { texto: ['La ', letra('D'), ' invierte las dos.'] },
      ],
      respuesta: [letra('B'), ', el H₂O polar y el XeF₂ apolar'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. El CO₂ es apolar aunque sus enlaces son polares. II. Toda molécula con átomos distintos es polar. III. El agua es polar.',
      alternativas: ['VVV', 'VFF', 'FVV', 'VFV', 'FFV'],
      datos: [D3.dipolo, D3.suma],
      solucion: [
        { texto: 'I es verdadera: las flechas del CO₂ son opuestas. II es falsa: el CO₂ y el CCl₄ son apolares. III es verdadera.', ecuacion: ['VFV'] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' creen que basta tener átomos distintos. La ', letra('B'), ' olvida el ángulo del agua.'] },
        { texto: ['La ', letra('E'), ' niega que el CO₂ sea apolar.'] },
      ],
      respuesta: [letra('D'), ', VFV'] },
    { nivel: 3, titulo: 'Tres moléculas, dos factores',
      enunciado: '¿Cuáles de estas moléculas son polares: PCl₅, SO₃ y CH₃Cl?',
      alternativas: ['Las tres', 'Solo el PCl₅', 'Solo el CH₃Cl', 'El PCl₅ y el SO₃', 'Ninguna'],
      datos: [D3.suma, 'Formas: PCl₅ bipirámide trigonal; SO₃ trigonal plana; CH₃Cl tetraédrica'],
      solucion: [
        { texto: 'El PCl₅ y el SO₃ tienen formas simétricas con átomos iguales alrededor, y sus flechas se anulan. En el CH₃Cl, un Cl entre tres H rompe la simetría.' },
        { texto: ['La ', letra('A'), ' cree que todo enlace polar da molécula polar. La ', letra('B'), ' y la ', letra('D'), ' llaman polar al PCl₅ por tener cinco cloros.'] },
        { texto: ['La ', letra('E'), ' olvida el C–Cl, que no tiene otra flecha que lo anule.'] },
      ],
      respuesta: [letra('C'), ', solo el CH₃Cl'] },
  ];

  const polaridad = {
    id: 'forma-polaridad',
    titulo: 'Polaridad de la molécula',
    pregunta: '¿Por qué el agua es polar y el CO₂ no?',
    temas: ['Polaridad'],
    pieza: 'quim-molecula-3d',
    aprendizaje: 'Una molécula es polar si sus enlaces son polares y la forma no anula sus dipolos; se mira en 3D, no en el papel.',
    actividad: 'Girar moléculas en 3D con sus flechas de dipolo y ver si se anulan.',
    lee: {
      tarjetas: [
        { titulo: 'El chorro y el peine', texto: 'Frota un peine de plástico con el pelo y acércalo a un chorrito delgado de agua: el chorro se dobla hacia el peine. Con un chorrito de aceite casi no pasa nada.',
          pieza: 'quim-enlace', dibujo: { pieza: 'quim-enlace', datos: { vista: 'objeto', objeto: 'chorro', nombre: 'El chorro se dobla hacia el peine' }, estado: {} } },
        { titulo: 'Flechas de dipolo', texto: 'En un enlace polar, el par se corre hacia el átomo que jala más. Eso se dibuja con una flecha naranja hacia ese átomo; la cola, con una cruz, marca el lado algo positivo. El dipolo se escribe μ.' },
        { titulo: 'Varias flechas', texto: 'Una molécula tiene una flecha por cada enlace polar. En el juego verás si, juntas en el espacio, dejan una flecha total.' },
        { titulo: 'Qué mirar', texto: 'Gira cada molécula con el dedo. Busca la flecha gruesa del centro: si está, la molécula es polar; si no aparece, las flechas se anularon.' },
      ],
    },
    ejemplos: EJEMPLOS_POL,
    juega: {
      pieza: 'quim-molecula-3d',
      consigna: 'Cada flecha delgada es un enlace polar; la gruesa, la suma de todas. Gira las moléculas y compara.',
      mision: {
        texto: 'Encuentra una molécula con enlaces polares que en total sea apolar.',
        logrado: v => enlacesPolares(v.k) && !polar(v.k),
        bien: 'Sus enlaces son polares, pero la forma anula sus flechas: la molécula es apolar.',
      },
      voz: 'Mira si queda la flecha gruesa del centro.',
      leyenda: [
        { s: Mu('→'), t: 'flecha de dipolo de un enlace polar' },
        { s: 'flecha gruesa', t: 'la suma: dipolo de la molécula' },
        { s: 'nube', t: 'un par libre del átomo central' },
      ],
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: JUEGO_P.map(k => ({ valor: k, texto: M.molecula(k).formula })), inicio: 'H2O' }],
      dibujo: v => mol3d(v.k, { dipolos: true, conPolar: true }),
      lectura: v => [`${M.molecula(v.k).formula}: ${FORMA(v.k)}; `, polar(v.k) ? 'queda una flecha total: polar' : 'las flechas se anulan: apolar'],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'El CH₂Cl₂ tiene un carbono al centro, unido a dos H y a dos Cl, en forma de tetraedro. ¿La molécula es polar?',
      datos: ['EN: C 2,55; H 2,20; Cl 3,16', 'Forma: tetraédrica, como la del CH₄'],
      voz: 'Piensa en las flechas en el espacio, no en el papel.',
      opciones: [
        { id: 'c', texto: 'Polar: en 3D las flechas de los Cl no se anulan', correcta: true },
        { id: 'plano', texto: 'Apolar: en el dibujo los Cl quedan opuestos', error: 'EN10', siFuera: 'Sería así si la molécula fuera plana, como en el papel. En el tetraedro, los dos Cl quedan del mismo lado.' },
        { id: 'tetra', texto: 'Apolar: es tetraédrica, como el CH₄', error: 'EN11', siFuera: 'Sería así si los cuatro átomos de alrededor fueran iguales, como en el CH₄. Aquí hay dos H y dos Cl.' },
        { id: 'distintos', texto: 'Polar: tiene átomos distintos', error: 'EN11', siFuera: 'Acierta en polar, pero la razón no basta: el CO₂ tiene átomos distintos y es apolar.' },
      ],
      dibujo: { pieza: 'quim-molecula', datos: { atomos: [Am('c', 'C', 0, 0), Am('h1', 'H', 0, -1.1), Am('h2', 'H', 0, 1.1), Am('cl1', 'Cl', -1.25, 0), Am('cl2', 'Cl', 1.25, 0)],
        enlaces: [{ a: 'c', b: 'h1' }, { a: 'c', b: 'h2' }, { a: 'c', b: 'cl1' }, { a: 'c', b: 'cl2' }], escala: 56, alto: 170,
        alt: 'El CH₂Cl₂ como se dibuja en el papel, en cruz, con los dos Cl opuestos. Si en 3D es polar es lo que se pregunta.' }, estado: {} },
      get revelar() { return proyeccion(mol3d('CH2Cl2', { dipolos: true, conPolar: true })); },
      coincide: 'Coincide: los dos Cl quedan del mismo lado en 3D; hay flecha total.',
      noCoincide: 'Es polar: en el tetraedro los dos Cl quedan del mismo lado.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: MIRA_P,
      voz: 'Comparemos dos moléculas de tres átomos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El CO₂ tiene dos flechas C→O, iguales y opuestas.', ecuacion: ['lineal, ', An('180°')] },
        { estado: { corte: 2 }, texto: 'Se anulan: el CO₂ es una molécula apolar, con enlaces polares.', ecuacion: [mu, ' = 0'] },
        { estado: { corte: 3 }, texto: 'El H₂O también tiene dos flechas hacia el O, pero no están en línea.' },
        { estado: { corte: 4 }, texto: 'Sus dos pares libres doblan la molécula, que es angular, y queda una flecha total.', ecuacion: [An('104,5°'), SEP, mu, ' ≠ 0'] },
        { estado: { corte: 4 }, texto: 'Por eso el chorro de agua se dobla hacia el peine.' },
      ],
    },
    regla: {
      texto: 'Una molécula es polar si tiene enlaces polares y su forma no anula los dipolos. Una forma simétrica con átomos iguales alrededor los anula. Un par libre o un átomo distinto alrededor deja una flecha total, salvo si los pares quedan opuestos (XeF₂, XeF₄).',
      ecuacion: ['polar: enlaces polares y suma en 3D ≠ 0', SEP, 'apolar: lineal, trigonal plana o tetraédrica con átomos iguales'],
      condicion: 'la forma se mira en 3D, no en el dibujo del papel.',
      voz: 'Primero la forma; después suma las flechas.',
      dibujo: mol3d('H2O', { dipolos: true, conPolar: true }),
    },
    resuelve: {
      pieza: 'quim-molecula-3d',
      generar(s) {
        const k = POL_R[s % POL_R.length], x = M.molecula(k), pol = x.polaridad.polar;
        return {
          enunciado: `¿El ${x.formula} es una molécula polar?`,
          datos: [D3.dipolo, D3.suma, D3.en],
          dibujo: mol3d(k, { dipolos: false }),
          pasos: [
            { tipo: 'pide', texto: `Piden si el ${x.formula}, entero, queda con un extremo algo positivo y otro algo negativo.` },
            { tipo: 'datos', texto: `El ${x.central} tiene ${x.ligandos.length} enlaces y ${parTxt(x.lewis.paresLibres)}, así que su forma es ${x.vsepr.geometria}.` },
            { tipo: 'regla', texto: 'Es polar si tiene enlaces polares y su forma no los anula en 3D.' },
            { tipo: 'aplica', texto: pol ? (x.lewis.paresLibres ? 'Los pares libres del central rompen la simetría, así que las flechas no se anulan.' : 'Los átomos de alrededor no son todos iguales, así que las flechas no se anulan.') : 'La forma es simétrica y los átomos de alrededor son iguales, así que las flechas se anulan.',
              ecuacion: [mu, pol ? ' ≠ 0' : ' = 0'], dibujo: mol3d(k, { dipolos: true, conPolar: true }) },
            { tipo: 'sentido', texto: 'Girando la molécula se ve lo mismo desde cualquier lado: la suma no depende de cómo se mire.' },
          ],
          respuesta: [pol ? 'Polar' : 'Apolar'],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula-3d',
      voz: 'Forma primero; después las flechas.',
      generar(sem) {
        const r = azar(sem * 59 + 31), tipo = sem % 3;
        if (tipo === 2) return vfDe(r, AFIRMA_P, [D3.dipolo, D3.suma]);
        return [casoPolar, casoCualPolar][tipo](r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): fuerzas entre moléculas ----------
  // Propuesta B4. Objeto de la primera pantalla: la olla que hierve en Juliaca (quim-enlace, de prueba).
  // Cambia: la sustancia y la temperatura · Permanece: dos moléculas vecinas y la atracción entre ellas (punteada) ·
  // Progresa: de la dispersión sola al dipolo-dipolo y al puente de hidrógeno · Se reserva: el agua contra el H₂S
  // (Predice), que no sale en el juego · Debe verse: que al separarse, los enlaces de adentro siguen enteros.
  // Errores: EN14 (el O–H más fuerte; 36,3 % en Kumpha y otros 2014), EN16 (la masa decide), EN13 (hervir rompe enlaces),
  // EN15 (puente de H con cualquier O; 31 a 34 % en Schmidt 1996), QM-GRUPO-EB (mismo grupo, misma ebullición),
  // QM-RAMA-EB (la ramificada hierve más), QM-FUERZA-ORDEN (invierte el orden de las fuerzas).
  const Bm = (a, b, o) => Object.assign({ a, b, orden: 1 }, o || {});
  const SUST = {
    metano: { t: 'CH₄', eb: -162, f: 'solo fuerzas de London', d: () => vecinas('CH₄', null) },
    hcl: { t: 'HCl', eb: -85, f: 'dipolo-dipolo', d: () => vecinas('Cl', 'H', 'dipolo-dipolo') },
    metanol: { t: 'CH₃OH', eb: 65, f: 'puente de hidrógeno', d: () => vecinas('CH₃O', 'H', 'puente de H') },
    agua: { t: 'H₂O', eb: 100, f: 'puente de hidrógeno', d: () => vecinas('HO', 'H', 'puente de H') },
  };
  // Dos moléculas vecinas y la atracción entre ellas (línea punteada): no es un enlace.
  function vecinas(x, h, que) {
    const atomos = [], enlaces = [], textos = [];
    if (!h) { atomos.push(Am('a', x, -1.3, 0), Am('b', x, 1.3, 0)); textos.push({ x: 0, y: 0.9, t: 'London' }); }
    else {
      atomos.push(Am('x1', x, -2.1, 0), Am('h1', h, -0.95, 0), Am('x2', x, 0.55, 0), Am('h2', h, 1.75, 0));
      enlaces.push(Bm('x1', 'h1'), Bm('x2', 'h2'), Bm('h1', 'x2', { discontinuo: true }));
      textos.push({ x: -0.2, y: 0.9, t: que });
    }
    return { pieza: 'quim-molecula', datos: { atomos, enlaces, textos, escala: 48, alto: 140, alt: `Dos moléculas de ${x === 'CH₄' ? 'CH₄' : x === 'Cl' ? 'HCl' : x === 'HO' ? 'agua' : 'metanol'} vecinas; la línea punteada es la atracción entre ellas, no un enlace.` }, estado: {} };
  }
  // Al pasar su temperatura de ebullición, la segunda molécula se aleja entera: la punteada desaparece y nada se rompe adentro.
  function vecinasT(k, T) {
    const d = SUST[k].d(), dd = Object.assign({}, d.datos);
    if (T < SUST[k].eb) return d;
    const lejos = new Set(k === 'metano' ? ['b'] : ['x2', 'h2']);
    dd.atomos = dd.atomos.map(a => (lejos.has(a.id) ? Object.assign({}, a, { x: a.x + 1.1 }) : a));
    dd.enlaces = dd.enlaces.filter(e => !e.discontinuo);
    dd.textos = [{ x: 0.2, y: 0.9, t: 'se separan enteras' }];
    dd.alt = `${dd.alt} Ya pasó su temperatura de ebullición: se separaron enteras.`;
    return { pieza: 'quim-molecula', datos: dd, estado: d.estado };
  }
  const HIDRUROS = [[2, 100, 'H₂O'], [3, -60, 'H₂S'], [4, -41, 'H₂Se'], [5, -2, 'H₂Te']];
  const ejesEb = (extra = {}) => ({ pieza: 'ejes', datos: Object.assign({
    x: { min: 1.5, max: 6, paso: 1, nombre: 'periodo', decimales: 0 },
    y: { min: -100, max: 120, paso: 20, nombre: 'ebullición', unidad: '°C', decimales: 0, color: 'h' },
    alt: 'Temperatura de ebullición de los hidruros del grupo 16 contra su periodo.',
  }, extra), estado: {} });
  const D4 = { atr: 'Atracciones entre moléculas: puente de hidrógeno > dipolo-dipolo > London', puente: 'Puente de hidrógeno: un H unido a N, O o F atrae un par libre de N, O o F vecino',
    london: 'London: la tienen todas; crece con el tamaño y con la superficie de contacto', mismaP: 'Temperaturas de ebullición a 1 atm' };
  // Pares [mayor, Tₑ, menor, Tₑ, razón]; sin el H₂O con el H₂S de la predicción. Unos para «Ahora tú», otros para «Así se resuelve».
  // Masas molares (g/mol), para que la opción «es más pesado» (EN16) solo salga cuando el otro lo es de verdad.
  const EB_A = [['NH₃', -33, 'PH₃', -88, 'forma puentes de hidrógeno', 17, 34], ['HF', 20, 'HCl', -85, 'forma puentes de hidrógeno', 20, 36.5], ['CH₃OH', 65, 'CH₄', -162, 'forma puentes de hidrógeno', 32, 16],
    ['Br₂', 59, 'Cl₂', -34, 'es más grande, con más fuerzas de London', 160, 71], ['n-pentano', 36, 'neopentano', 10, 'es alargado, con más contacto y más London', 72, 72]];
  const EB_R = [['etanol (C₂H₅OH)', 78, 'CH₃OCH₃', -24, 'forma puentes de hidrógeno y el CH₃OCH₃ no'], ['HCl', -85, 'F₂', -188, 'es polar y suma dipolo-dipolo a las fuerzas de London'], ['NH₃', -33, 'CH₄', -162, 'forma puentes de hidrógeno']];
  const tC = x => `${x < 0 ? '−' : ''}${Math.abs(x)} °C`;
  function casoEb(r) {
    const [a, ea, b, eb, razon, ma, mb] = r.de(EB_A), [x, y] = r.baraja([a, b]);
    const masa = mb > ma ? [`El ${b}: es más pesado`, 'EN16', `Sería así si solo importaran las fuerzas de London, que crecen con la masa. Aquí pesa más otra cosa: el ${a} ${razon}.`]
      : mb === ma ? ['Los dos igual: tienen la misma masa', 'EN16', 'Sería así si solo importara la masa. Los dos pesan lo mismo, pero la forma cambia cuánto se tocan y se atraen.']
        : [`El ${b}: sus moléculas se atraen más`, 'QM-FUERZA-ORDEN', `Es al revés, porque el ${a} ${razon}.`];
    return {
      pregunta: `¿Cuál hierve a mayor temperatura, a 1 atm: el ${x} o el ${y}?`,
      datos: [D4.atr, D4.puente, D4.london],
      opciones: ops(`El ${a}: ${razon}`, masa,
        [`El ${a}: sus enlaces internos son más fuertes`, 'EN14', 'Elegiste bien la sustancia, pero no la razón: al hervir se separan moléculas y no se rompe ningún enlace interno.'],
        ['Los dos igual: son parecidos', 'QM-GRUPO-EB', 'Sería así si sus moléculas se atrajeran igual. Se parecen, pero no tienen las mismas atracciones.']),
      solucion: { texto: `El ${a} ${razon}, así que sus moléculas se atraen más.`, ecuacion: [`${a}: `, Te(tC(ea)), SEP, `${b}: `, Te(tC(eb))] },
    };
  }
  const FZ = [['CH₄', 'Solo London'], ['HCl', 'Dipolo-dipolo y London'], ['NH₃', 'Puente de hidrógeno, dipolo-dipolo y London'], ['CO₂', 'Solo London'], ['HF', 'Puente de hidrógeno, dipolo-dipolo y London'],
    ['CH₃OCH₃', 'Dipolo-dipolo y London'], ['Cl₂', 'Solo London'], ['CH₃OH', 'Puente de hidrógeno, dipolo-dipolo y London'], ['H₂S', 'Dipolo-dipolo y London'], ['CCl₄', 'Solo London']];
  const FZ_POL = { 'CH₄': 'apolar', HCl: 'polar', 'NH₃': 'polar', 'CO₂': 'apolar', HF: 'polar', 'CH₃OCH₃': 'polar', 'Cl₂': 'apolar', 'CH₃OH': 'polar', 'H₂S': 'polar', 'CCl₄': 'apolar' };
  const FZ_HNO = { 'CH₄': 'sus H están unidos a C', HCl: 'no tiene H unido a N, O o F', 'NH₃': 'tiene H unido a N', 'CO₂': 'no tiene H', HF: 'tiene H unido a F', 'CH₃OCH₃': 'sus H están unidos a C',
    'Cl₂': 'no tiene H', 'CH₃OH': 'tiene un H unido a O', 'H₂S': 'sus H están unidos a S', 'CCl₄': 'no tiene H' };
  function casoFuerza(r) {
    const [fo, bien] = r.de(FZ);
    const TODAS = ['Solo London', 'Dipolo-dipolo y London', 'Puente de hidrógeno, dipolo-dipolo y London', 'Puente de hidrógeno y nada más'];
    const SI = { 'Solo London': ['QM-FUERZA-POLAR', `Sería así si el ${fo} fuera apolar. Es polar, así que suma la atracción dipolo-dipolo.`], 'Dipolo-dipolo y London': ['EN15', 'Sería así si la molécula fuera polar y no tuviera H unido a N, O o F.'],
      'Puente de hidrógeno, dipolo-dipolo y London': ['EN15', 'Sería así si la molécula tuviera un H unido a N, O o F.'], 'Puente de hidrógeno y nada más': ['QM-FUERZA-SOLO', 'Aunque hubiera puente de hidrógeno, toda molécula tiene además fuerzas de London.'] };
    return {
      pregunta: `¿Qué atracciones hay entre las moléculas de ${fo}?`,
      datos: [D4.puente, D4.london, `${fo}: molécula ${FZ_POL[fo]}; ${FZ_HNO[fo]}`],
      opciones: ops(bien, ...TODAS.filter(x => x !== bien).map(x => [x, SI[x][0], SI[x][1]])),
      solucion: { texto: `El ${fo} es una molécula ${FZ_POL[fo]} y ${FZ_HNO[fo]}.`, ecuacion: [bien] },
    };
  }
  function casoPuente(r) {
    const si = r.de(['NH₃', 'HF', 'CH₃OH', 'H₂O₂', 'CH₃NH₂']), no = r.baraja(['CH₃OCH₃', 'CH₃F', 'HCl', 'H₂S', 'CH₄', 'CH₂O']).slice(0, 3);
    return {
      pregunta: `¿Cuál de estas sustancias forma puentes de hidrógeno entre sus moléculas: ${r.baraja([si, ...no]).join(', ')}?`,
      datos: [D4.puente, 'En las fórmulas, un H escrito junto a O o N (OH, NH) está unido a ese átomo; en CH, al carbono'],
      opciones: ops(si, ...no.map(x => [x, /O|F/.test(x) ? 'EN15' : 'QM-PUENTE-POLAR', /O|F/.test(x) ? 'Sería así si tuviera un H unido al O o al F. Tiene uno de esos átomos, pero sus H están unidos a C.'
        : x === 'CH₄' ? 'Sería así con un H unido a N, O o F. Es apolar y sus H están unidos a C, así que solo tiene London.' : `Es polar, pero ${x === 'HCl' ? 'su H no está unido' : 'sus H no están unidos'} a N, O ni F, así que solo tiene dipolo-dipolo y London.`])),
      solucion: { texto: `El ${si} tiene un H unido a ${/F/.test(si) ? 'F' : /N/.test(si) ? 'N' : 'O'}, así que forma puentes de hidrógeno.`, ecuacion: [`${si}: puente de hidrógeno`] },
    };
  }
  const AFIRMA_E = [
    ['Al hervir el agua, se rompen sus enlaces O–H.', false, 'al hervir se separan moléculas enteras'],
    ['Toda molécula tiene fuerzas de London.', true, 'las fuerzas de London aparecen en todas, polares o no'],
    ['El CH₃OCH₃ forma puentes de hidrógeno.', false, 'sus H están unidos a C, no al O'],
    ['El HF forma puentes de hidrógeno.', true, 'el HF tiene un H unido a F'],
    ['Las burbujas del agua que hierve son de hidrógeno y oxígeno.', false, 'son vapor, es decir, moléculas de agua enteras'],
    ['El n-pentano hierve más alto que el neopentano.', true, 'el n-pentano es alargado y sus moléculas se tocan más'],
  ];

  // Ejemplos de la idea 4. Temperaturas a 1 atm (CRC/NIST), comprobadas aparte (cuentas-b.js): H₂O 100, H₂S −60 ·
  // CH₄ −162 · NH₃ −33 > PH₃ −88 (55) · HF 20 > HCl −85 · Br₂ 59 > Cl₂ −34 · n-pentano 36 > neopentano 10 · etanol 78 >
  // CH₃OCH₃ −24 (102) · H₂O 100 − 87 = 13.
  const EJEMPLOS_FZ = [
    { nivel: 1, titulo: 'Las burbujas del agua',
      enunciado: '¿Qué hay dentro de las burbujas del agua que hierve en una olla?',
      datos: ['Al hervir, un líquido pasa a gas'],
      solucion: [{ texto: 'Hay moléculas de agua que se separaron de sus vecinas y pasaron a gas; sus enlaces O–H siguen enteros.' }],
      respuesta: ['Vapor: moléculas de agua enteras'] },
    { nivel: 1, titulo: 'Lo que atrae al metano',
      enunciado: 'El CH₄ es apolar y sus H están unidos a C. ¿Qué atracción hay entre sus moléculas?',
      datos: [D4.puente, D4.london],
      solucion: [{ texto: 'Como es apolar, no hay dipolo-dipolo, y como no tiene H unido a N, O o F, no hay puente de hidrógeno. Solo quedan las fuerzas de London.' }],
      respuesta: ['Solo fuerzas de London'] },
    { nivel: 1, titulo: 'El amoníaco y sus puentes',
      enunciado: '¿El NH₃ forma puentes de hidrógeno entre sus moléculas?',
      datos: [D4.puente, 'NH₃: tres H unidos al N, que tiene un par libre'],
      figura: { pieza: 'quim-molecula', datos: { atomos: [Am('n', 'N', 0, 0), Am('h1', 'H', -1, 0.6), Am('h2', 'H', 1, 0.6), Am('h3', 'H', 0, 1.15)], enlaces: [Bm('n', 'h1'), Bm('n', 'h2'), Bm('n', 'h3')],
        pares: [{ en: 'n', ang: -90, color: 'f' }], escala: 60, alto: 150, alt: 'Una molécula de NH₃: el N con tres H y un par libre.' }, estado: {} },
      solucion: [{ texto: 'Tiene H unidos a N y un par libre en el N, así que el N de una molécula puede atraer un H de la vecina.' }],
      respuesta: ['Sí'] },
    { nivel: 1, titulo: 'Cuánto más hierve el agua',
      enunciado: 'A 1 atm, el agua hierve a 100 °C y el H₂S a −60 °C. ¿Cuántos grados más necesita el agua?',
      datos: [D4.mismaP],
      solucion: [{ texto: 'Para saber cuántos grados más necesita, resto las dos temperaturas.', ecuacion: ['100 − (−60) = ', Te('160 °C')] }],
      respuesta: [Te('160 °C'), ' más'] },
    { nivel: 1, titulo: 'La atracción del HCl',
      enunciado: 'El HCl es polar, pero su H está unido a Cl. ¿Qué atracción hay entre sus moléculas, además de London?',
      datos: [D4.puente, D4.london],
      solucion: [{ texto: 'Como es polar, el extremo algo positivo (δ+) de una molécula atrae al algo negativo (δ−) de la vecina. No es puente de hidrógeno, porque el Cl no es N, O ni F.' }],
      respuesta: ['Dipolo-dipolo'] },
    { nivel: 2, titulo: 'El amoníaco y su vecino',
      enunciado: 'El NH₃ hierve a −33 °C y el PH₃ a −88 °C, a 1 atm. ¿Por qué el NH₃ hierve más alto, si es más liviano?',
      datos: [D4.puente, D4.london],
      solucion: [
        { texto: 'El NH₃ tiene H unidos a N, así que forma puentes de hidrógeno. El PH₃ no los forma, porque el P no es N, O ni F.' },
        { texto: 'Esa atracción pesa más que la diferencia de tamaño entre las dos moléculas.', ecuacion: ['−33 − (−88) = ', Te('55 °C')] },
      ],
      respuesta: ['Por sus puentes de hidrógeno'] },
    { nivel: 2, titulo: 'Dos halógenos',
      enunciado: 'El Br₂ es líquido y el Cl₂ es gas a 20 °C. Los dos son apolares. ¿Por qué el Br₂ hierve más alto?',
      datos: [D4.london, 'Br₂: 59 °C; Cl₂: −34 °C (a 1 atm)'],
      solucion: [
        { texto: 'Los dos solo tienen fuerzas de London. El Br₂ es más grande: sus nubes de electrones se deforman más y se atraen más.' },
        { texto: 'Por eso a 20 °C el Br₂ todavía no hierve.', ecuacion: [Te('59 °C'), ' > 20 °C > ', Te('−34 °C')] },
      ],
      respuesta: ['Es más grande: más fuerzas de London'] },
    { nivel: 2, titulo: 'Alargado o ramificado',
      enunciado: 'El n-pentano y el neopentano tienen la misma fórmula, C₅H₁₂. El primero es una cadena alargada; el segundo, una bola. Los dos son apolares. ¿Cuál hierve más alto?',
      datos: [D4.london],
      solucion: [
        { texto: 'Los dos son apolares, así que solo tienen fuerzas de London. La cadena alargada toca más a sus vecinas.' },
        { texto: 'Con más contacto hay más atracción, y por eso hierve más alto.', ecuacion: ['n-pentano ', Te('36 °C'), ' > neopentano ', Te('10 °C')] },
      ],
      respuesta: ['El n-pentano'] },
    { nivel: 2, titulo: 'Un mismo grupo, dos casos',
      enunciado: 'El HF hierve a 20 °C y el HCl a −85 °C. Los dos son del grupo 17 con hidrógeno. ¿Qué atracción explica la diferencia?',
      datos: [D4.puente, D4.atr],
      solucion: [
        { texto: 'El HF tiene un H unido a F: forma puentes de hidrógeno. El HCl solo tiene dipolo-dipolo y London.' },
        { texto: 'La diferencia entre las dos temperaturas es:', ecuacion: ['20 − (−85) = ', Te('105 °C')] },
      ],
      respuesta: ['El puente de hidrógeno del HF'] },
    { nivel: 2, titulo: 'Hervir en Juliaca',
      enunciado: 'En Juliaca el agua hierve a unos 87 °C. ¿Cuántos grados menos que a 1 atm? ¿Se rompen enlaces O–H al hervir?',
      datos: ['Agua a 1 atm: 100 °C', 'Al hervir, un líquido pasa a gas'],
      solucion: [
        { texto: 'En la altura hay menos aire empujando sobre el agua, así que basta menos temperatura para que hierva.', ecuacion: ['100 − 87 = ', Te('13 °C')] },
        { texto: 'Al hervir solo se separan moléculas: los O–H siguen enteros.' },
      ],
      respuesta: ['Unos ', Te('13 °C'), ' menos; no se rompen'] },
    { nivel: 3, titulo: 'El agua y su vecino',
      enunciado: 'El H₂O hierve a 100 °C y el H₂S, más pesado, a −60 °C. ¿Qué afirmación es correcta?',
      alternativas: ['El H₂S hierve más alto porque es más pesado.', 'Hierven distinto porque el enlace O–H es más fuerte que el S–H.', 'Los dos tienen solo fuerzas de London.',
        'El agua forma puentes de hidrógeno y el H₂S no.', 'Al hervir, el agua se rompe en H₂ y O₂.'],
      datos: [D4.puente, D4.atr],
      solucion: [
        { texto: 'El agua tiene H unidos a O, así que forma puentes de hidrógeno. El H₂S, con H unidos a S, solo tiene dipolo-dipolo y London.' },
        { texto: ['La ', letra('A'), ' mira solo la masa. La ', letra('B'), ' confunde enlace con atracción: al hervir no se rompe ningún O–H.'] },
        { texto: ['La ', letra('C'), ' olvida que los dos son polares. La ', letra('E'), ' cree que hervir rompe la molécula.'] },
      ],
      respuesta: [letra('D'), ', puentes de hidrógeno en el agua'] },
    { nivel: 3, titulo: 'Tres sustancias para ordenar',
      enunciado: 'Ordena de mayor a menor temperatura de ebullición: CH₄, CH₃OH y HCl.',
      alternativas: ['CH₄ > HCl > CH₃OH', 'HCl > CH₃OH > CH₄', 'CH₃OH > HCl > CH₄', 'CH₃OH > CH₄ > HCl', 'Las tres iguales'],
      datos: [D4.atr, 'CH₄: apolar; HCl: polar; CH₃OH: H unido a O'],
      solucion: [
        { texto: 'El CH₃OH forma puentes de hidrógeno, el HCl tiene dipolo-dipolo y el CH₄ solo tiene London.', ecuacion: [Te('65 °C'), ' > ', Te('−85 °C'), ' > ', Te('−162 °C')] },
        { texto: ['La ', letra('A'), ' invierte el orden. La ', letra('B'), ' pone el dipolo-dipolo sobre el puente de hidrógeno.'] },
        { texto: ['La ', letra('D'), ' pone al metano sobre el HCl. La ', letra('E'), ' olvida que se atraen distinto.'] },
      ],
      respuesta: [letra('C'), ', CH₃OH > HCl > CH₄'] },
    { nivel: 3, titulo: 'Quién forma puentes',
      enunciado: '¿Cuál de estas sustancias forma puentes de hidrógeno entre sus moléculas: CH₃OCH₃, CH₃F, NH₃, HCl o CH₄?',
      alternativas: ['CH₃OCH₃', 'NH₃', 'CH₃F', 'HCl', 'CH₄'],
      datos: [D4.puente, 'En las fórmulas, el H escrito junto a C (CH) está unido al carbono'],
      solucion: [
        { texto: 'Solo el NH₃ tiene H unidos a N, O o F.' },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' tienen O o F, pero sus H están unidos a C: esa es la trampa del examen.'] },
        { texto: ['La ', letra('D'), ' tiene H unido a Cl. La ', letra('E'), ' es apolar.'] },
      ],
      respuesta: [letra('B'), ', el NH₃'] },
    { nivel: 3, titulo: 'Dos líquidos de la misma fórmula',
      enunciado: 'El etanol, C₂H₅OH, y el CH₃OCH₃ tienen la misma fórmula, C₂H₆O. ¿Qué afirmación es correcta?',
      alternativas: ['Hierven igual: tienen la misma masa.', 'El CH₃OCH₃ hierve más alto: tiene un O al centro.', 'Los dos forman puentes de hidrógeno.', 'Ninguno es polar.',
        'El etanol hierve más alto: tiene un H unido a O.'],
      datos: [D4.puente, D4.atr],
      solucion: [
        { texto: 'El etanol tiene un O–H: forma puentes de hidrógeno. En el CH₃OCH₃ todos los H están unidos a C. Medido a 1 atm, el etanol hierve mucho más alto:', ecuacion: ['etanol ', Te('78 °C'), ' > CH₃OCH₃ ', Te('−24 °C')] },
        { texto: ['La ', letra('A'), ' mira solo la masa. La ', letra('B'), ' y la ', letra('C'), ' creen que basta tener oxígeno.'] },
        { texto: ['La ', letra('D'), ' olvida que los dos tienen un O que hace polar la molécula.'] },
      ],
      respuesta: [letra('E'), ', el etanol, por su O–H'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. Al hervir el agua se rompen sus enlaces O–H. II. Toda molécula tiene fuerzas de London. III. El CH₃OCH₃ forma puentes de hidrógeno.',
      alternativas: ['FVF', 'VVF', 'FVV', 'VFV', 'FFF'],
      datos: [D4.puente, D4.london],
      solucion: [
        { texto: 'I es falsa: se separan moléculas enteras. II es verdadera. III es falsa: sus H están unidos a C.', ecuacion: ['FVF'] },
        { texto: ['La ', letra('B'), ' y la ', letra('D'), ' creen que hervir rompe enlaces. La ', letra('C'), ' y la ', letra('D'), ' ven puentes donde no hay H unido a O.'] },
        { texto: ['La ', letra('E'), ' niega las fuerzas de London, que tienen todas.'] },
      ],
      respuesta: [letra('A'), ', FVF'] },
  ];

  const fuerzas = {
    id: 'fuerzas-intermoleculares',
    titulo: 'Fuerzas entre moléculas',
    pregunta: '¿Qué se separa cuando el agua hierve?',
    temas: ['Fuerzas intermoleculares'],
    pieza: 'quim-molecula',
    aprendizaje: 'Al hervir se separan moléculas, no átomos. Hierve más alto la de más atracción: puente de hidrógeno, dipolo-dipolo y, siempre, London.',
    actividad: 'Calentar cuatro sustancias hasta que sus moléculas se separen.',
    lee: {
      tarjetas: [
        { titulo: 'La olla en Juliaca', texto: 'En Juliaca el agua hierve a unos 87 °C, porque arriba hay menos aire empujando. Por eso las temperaturas de ebullición se comparan siempre a la misma presión: 1 atm.',
          pieza: 'quim-enlace', dibujo: { pieza: 'quim-enlace', datos: { vista: 'objeto', objeto: 'olla', nombre: 'El agua hierve en la olla' }, estado: {} } },
        { titulo: 'Adentro y afuera', texto: 'Los enlaces unen a los átomos dentro de una molécula. Las fuerzas intermoleculares son atracciones entre moléculas vecinas, mucho más débiles que los enlaces.' },
        { titulo: 'Tres atracciones', texto: 'Todas las moléculas tienen fuerzas de London. Las polares suman la atracción dipolo-dipolo, y las que tienen un H unido a N, O o F suman además el puente de hidrógeno.' },
        { titulo: 'Qué mirar', texto: 'En el juego subes la temperatura. Anota a cuántos grados se separan las dos moléculas de cada sustancia y qué atracción las unía.' },
      ],
    },
    ejemplos: EJEMPLOS_FZ,
    juega: {
      pieza: 'quim-molecula',
      consigna: 'Elige una sustancia y sube la temperatura. La línea punteada es la atracción entre dos moléculas vecinas, no un enlace.',
      mision: {
        texto: 'Haz hervir el metanol: sube la temperatura hasta que sus moléculas se separen.',
        logrado: v => v.k === 'metanol' && v.T >= SUST.metanol.eb,
        bien: 'A 65 °C, las moléculas se separan enteras: su enlace O–H sigue en su lugar.',
      },
      voz: 'Lo que se rompe es la línea punteada, no los enlaces.',
      leyenda: [
        { s: '- - -', t: 'atracción entre moléculas' },
        { s: '—', t: 'enlace dentro de una molécula' },
        { s: Te('T'), t: 'temperatura de la sustancia, en °C' },
      ],
      controles: [{ id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(SUST).map(k => ({ valor: k, texto: SUST[k].t })), inicio: 'hcl' },
        { id: 'T', etiqueta: 'T', color: 'c-h', min: -180, max: 120, paso: 5, inicio: -120, unidad: '°C', decimales: 0 }],
      dibujo: v => vecinasT(v.k, v.T),
      lectura: v => { const P = SUST[v.k]; return [`${P.t} a `, Te(tC(v.T)), v.T < P.eb ? `: siguen unidas (${P.f})` : `: ya pasó ${tC(P.eb)}, se separan`]; },
      minimo: 4,
    },
    predice: {
      pieza: 'ejes',
      pregunta: 'El H₂S es más pesado que el H₂O, y su azufre está debajo del oxígeno en la tabla. ¿Cuál hierve a mayor temperatura?',
      datos: ['H₂O: 18 g por cada mol; H₂S: 34 g por cada mol', 'H₂Se: −41 °C; H₂Te: −2 °C (a 1 atm)'],
      voz: 'Piensa en lo que une a las moléculas, no en su masa.',
      opciones: [
        { id: 'c', texto: 'El H₂O, por sus puentes de hidrógeno', correcta: true },
        { id: 'masa', texto: 'El H₂S, porque es más pesado', error: 'EN16', siFuera: 'Sería así si solo importaran las fuerzas de London, que crecen con la masa. Aquí pesa más el puente de hidrógeno del agua.' },
        { id: 'igual', texto: 'Igual: los dos son del grupo 16', error: 'QM-GRUPO-EB', siFuera: 'Sería así si se atrajeran igual. Comparten grupo, pero solo el agua forma puentes de hidrógeno.' },
        { id: 'enlace', texto: 'El H₂O, porque su enlace O–H es más fuerte', error: 'EN14', siFuera: 'El O–H es fuerte, pero al hervir no se rompe: lo que se separa son moléculas enteras.' },
      ],
      dibujo: ejesEb({ puntos: HIDRUROS.slice(2).map(([x, y, t]) => ({ x, y, color: 'h', rotulo: t })), alt: 'Ebullición del H₂Se (−41 °C) y del H₂Te (−2 °C); el H₂S y el H₂O todavía no están: es lo que se pregunta.' }),
      revelar: ejesEb({ puntos: HIDRUROS.map(([x, y, t]) => ({ x, y, color: 'h', rotulo: x === 2 ? `${t} ${tC(y)}` : t })), curvas: [{ puntos: HIDRUROS.slice(1).map(([x, y]) => [x, y]), color: 'h' }],
        alt: 'Ebullición de los hidruros del grupo 16: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C y H₂O 100 °C, muy por encima de la tendencia.' }),
      coincide: 'Coincide: el agua hierve 160 °C por encima del H₂S.',
      noCoincide: 'El agua hierve a 100 °C y el H₂S a −60 °C: pesan los puentes de hidrógeno.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesEb({
        curvas: [{ puntos: HIDRUROS.slice(1).map(([x, y]) => [x, y]), color: 'h', desde: 1 }, { puntos: [[3, -60], [2, -80]], color: 'h', discontinua: true, desde: 2 }],
        puntos: [...HIDRUROS.slice(1).map(([x, y, t]) => ({ x, y, color: 'h', rotulo: t, desde: 1 })), { x: 2, y: 100, color: 'h', rotulo: 'H₂O 100 °C', guias: true, desde: 3 }],
        alt: 'Ebullición de los hidruros del grupo 16: del H₂Te al H₂S baja con el tamaño; el agua, a 100 °C, se sale de la tendencia.',
      }).datos,
      voz: 'Sigamos la tendencia y veamos quién se sale.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Del H₂Te al H₂S las moléculas se achican, tienen menos London y hierven más bajo.' },
        { estado: { corte: 2 }, texto: 'Siguiendo esa tendencia, el agua herviría cerca de −80 °C.' },
        { estado: { corte: 3 }, texto: 'Pero hierve a 100 °C, porque sus moléculas forman puentes de hidrógeno.', ecuacion: ['O–H ··· O'] },
        { estado: { corte: 3 }, texto: 'Al hervir se separan moléculas; los enlaces O–H siguen enteros.' },
        { estado: { corte: 3 }, texto: 'Entre moléculas sin puentes, hierve más alto la más grande o la más alargada.' },
      ],
    },
    regla: {
      texto: 'Entre moléculas hay fuerzas de London (siempre), dipolo-dipolo (si son polares) y puente de hidrógeno (H unido a N, O o F). A más atracción, mayor temperatura de ebullición, porque al hervir se separan moléculas sin romper enlaces.',
      ecuacion: ['puente de hidrógeno > dipolo-dipolo > London', SEP, 'a igual atracción: más grande o más alargada, hierve más alto'],
      condicion: 'las moléculas tienen un tamaño parecido, o si una forma puentes de hidrógeno: el puente gana aun frente a una molécula más pesada, como el NH₃ frente al PH₃.',
      voz: 'Compara la atracción entre moléculas, no los enlaces de adentro.',
    },
    resuelve: {
      pieza: 'quim-molecula',
      generar(s) {
        const [a, ea, b, eb, razon] = EB_R[s % EB_R.length], [x, y] = s % 2 ? [b, a] : [a, b];
        return {
          enunciado: `¿Cuál hierve a mayor temperatura, a 1 atm: el ${x} o el ${y}?`,
          datos: [D4.atr, D4.puente, D4.london],
          pasos: [
            { tipo: 'pide', texto: 'Piden cuál necesita más temperatura para hervir, a la misma presión.' },
            { tipo: 'datos', texto: 'Los datos dan el orden de las atracciones y dicen cuándo hay puente de hidrógeno.' },
            { tipo: 'regla', texto: 'Al hervir se separan moléculas. Hierve más alto la de más atracción entre ellas.' },
            { tipo: 'aplica', texto: `Las moléculas del ${a} se atraen más, porque el ${a} ${razon}.` },
            { tipo: 'sentido', texto: 'La respuesta cuadra con las temperaturas medidas a 1 atm:', ecuacion: [`${a} `, Te(tC(ea)), SEP, `${b} `, Te(tC(eb))] },
          ],
          respuesta: [`El ${a}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Busca qué atracción tiene cada una.',
      generar(sem) {
        const r = azar(sem * 43 + 37), tipo = sem % 4;
        if (tipo === 3) return vfDe(r, AFIRMA_E, [D4.puente, D4.london]);
        return [casoEb, casoFuerza, casoPuente][tipo](r);
      },
    },
  };

  // ---------- Laboratorio (dos mesas que vienen de Enlace químico; el avance se migra con partidoEN) ----------
  const GIRA = ['CH4', 'NH3', 'H2O', 'CO2', 'SO2', 'BF3', 'CCl4', 'CHCl3', 'PCl5', 'SF6', 'XeF4'];
  const TH_MIN = 60, MB_MAX = 2, ESC_MU = 0.32;
  const muTotal = v => 2 * v.mb * Math.cos(v.th / 2 * Math.PI / 180);
  const QM = () => Kit.piezas['quim-molecula'];
  function dosDipolos(v) {
    const h = v.th / 2 * Math.PI / 180, L = 1.15, mt = muTotal(v);
    const datos = {
      atomos: [Am('o', 'O', 0, 0), Am('h1', 'H', -L * Math.sin(h), L * Math.cos(h)), Am('h2', 'H', L * Math.sin(h), L * Math.cos(h))],
      enlaces: [Bm('o', 'h1', { dipolo: 'a' }), Bm('o', 'h2', { dipolo: 'a' })],
      angulos: [{ en: 'o', de: 'h1', a: 'h2', texto: `${f(v.th, 0)}°`, color: 'i' }],
      textos: [{ x: 0, y: -2.25, t: mt > 0.005 ? `μ total = ${f(mt)} D` : 'μ total = 0: se anulan', color: 'o', peso: 700 }, { x: 0, y: 1.65, t: `cada enlace: ${f(v.mb, 1)} D`, color: 'o' }],
      escala: 60, alto: 260,
      alt: `Dos enlaces de ${f(v.mb, 1)} D separados ${f(v.th, 0)}°; su suma da un dipolo total de ${f(mt)} D, hacia arriba.`,
    };
    if (mt > 0.005) datos.flechas = [{ de: [0, -0.5], a: [0, -0.5 - ESC_MU * mt], dipolo: true, color: 'o' }];
    return { datos, estado: {} };
  }
  const manijaH = v => { const g = QM().encuadre(dosDipolos(v).datos), h = v.th / 2 * Math.PI / 180; return { x: g.X(1.15 * Math.sin(h)), y: g.Y(1.15 * Math.cos(h)) }; };
  const anguloEn = (pt, v) => { const g = QM().encuadre(dosDipolos(v).datos); return 2 * Math.atan2(pt.x - g.X(0), pt.y - g.Y(0)) * 180 / Math.PI; };

  return {
    unidad: 'quimica.geometria-molecular',
    version: '0.1.2',
    calidad: 2,  // 19 nov: correcciones de la auditoría y del lector en frío (rutinas/auditoria/quimica.geometria-molecular.md)
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/elementos.js', '/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/quim-molecula-3d.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/quim-enlace.js', '/plantillas/enlace/motor.js'],
    // Tabla de letras (propuesta §7; regla letras-datos). En AXₙEₘ, A es el átomo central (no el número de masa).
    letras: { A: 'átomo central (en AXₙEₘ)', X: 'átomo unido al central (en AXₙEₘ)', E: 'par libre del central (en AXₙEₘ)', 'σ': 'enlace sigma', 'π': 'enlace pi', 'μ': 'dipolo', T: 'temperatura', 'δ': 'carga parcial', e: 'electrón' },
    historia: {
      texto: 'En 1957, Ronald Gillespie y Ronald Nyholm ordenaron una idea sencilla: los pares de electrones de un átomo se repelen y se alejan lo más posible. Con eso se predice la forma de muchas moléculas sin ningún cálculo. La forma decide si una molécula es polar, y eso, cómo se atraen y a qué temperatura hierven.',
      pregunta: '¿Cómo se sabe la forma de una molécula que nadie puede ver?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §7.6 y §10.1', url: 'https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity' },
    },
    glosario: [
      { termino: 'región de electrones', formas: ['región de electrones', 'regiones de electrones', 'región', 'regiones'],
        def: 'Cada enlace (simple, doble o triple) o par libre alrededor del átomo central; se repelen entre sí.',
        simple: 'Cada lugar alrededor de un átomo donde hay electrones.',
        ejemplos: ['El C del CO₂ tiene 2.', 'El B del BF₃ tiene 3.', 'El S del SF₆ tiene 6.'], ver: ['par libre', 'forma molecular'] },
      { termino: 'forma molecular', formas: ['forma molecular', 'formas moleculares', 'geometría molecular'],
        def: 'Figura que dibujan los átomos alrededor del átomo central; se nombra sin contar los pares libres.',
        simple: 'La figura que forman los átomos de una molécula en el espacio.',
        ejemplos: ['El CO₂: lineal.', 'El BF₃: trigonal plana.', 'El CH₄: tetraédrica.'], ver: ['región de electrones'] },
      { termino: 'ángulo de enlace', formas: ['ángulo de enlace', 'ángulos de enlace'], medida: '°',
        def: 'Ángulo entre dos enlaces de un mismo átomo, medido en el átomo central.',
        simple: 'Lo que se abren dos enlaces de un mismo átomo.',
        ejemplos: ['En el BeCl₂: 180°.', 'En el BF₃: 120°.', 'En el CH₄: 109,5°.'], ver: ['forma molecular'] },
      { termino: 'hibridación', formas: ['hibridación', 'hibridaciones', 'híbridos', 'orbitales híbridos'],
        def: 'Mezcla de orbitales s, p (y d) de un átomo, uno por cada lugar con electrones: sp, sp², sp³, sp³d.',
        simple: 'Orbitales de un átomo que se mezclan para apuntar a sus regiones.',
        ejemplos: ['El C del CH₄: sp³.', 'El B del BF₃: sp².', 'El C del CO₂: sp.'], ver: ['orbital', 'región de electrones'] },
      { termino: 'enlace sigma', simbolo: 'σ', formas: ['enlace sigma', 'enlaces sigma', 'sigma'],
        def: 'El primer enlace entre dos átomos, con el par justo en la línea que los une. Todo enlace tiene uno.',
        simple: 'El primer enlace entre dos átomos, el que va justo entre ellos.',
        ejemplos: ['Cada C–H del metano.', 'El primero de un C=C.', 'El primero de un N≡N.'], ver: ['enlace pi'] },
      { termino: 'enlace pi', simbolo: 'π', formas: ['enlace pi', 'enlaces pi', 'pi'],
        def: 'El segundo y el tercer enlace de uno múltiple, con el par por los costados de los átomos.',
        simple: 'El enlace extra de un doble o un triple, por los costados.',
        ejemplos: ['Un C=C tiene uno.', 'Un N≡N tiene dos.', 'Un C–H no tiene ninguno.'], ver: ['enlace sigma', 'enlace múltiple'] },
      { termino: 'dipolo', simbolo: 'μ', formas: ['dipolo', 'dipolos'],
        def: 'Separación de carga entre dos extremos, uno algo positivo y otro algo negativo; se dibuja como una flecha.',
        simple: 'Una flecha que va del lado algo positivo al algo negativo.',
        ejemplos: ['El del enlace H–Cl, hacia el Cl.', 'El total del agua, hacia el O.', 'El CO₂ no tiene dipolo total.'], ver: ['carga parcial', 'molécula polar'] },
      { termino: 'molécula polar', formas: ['molécula polar', 'moléculas polares'],
        def: 'Molécula cuyos dipolos de enlace no se anulan: le queda una flecha total.',
        simple: 'Una molécula con un lado algo positivo y otro algo negativo.',
        ejemplos: ['El H₂O.', 'El NH₃.', 'El HCl.'], ver: ['dipolo'] },
      { termino: 'molécula apolar', formas: ['molécula apolar', 'moléculas apolares'],
        def: 'Molécula sin dipolo total: no tiene enlaces polares o sus dipolos se anulan por la forma.',
        simple: 'Una molécula sin un lado algo positivo y otro algo negativo.',
        ejemplos: ['El CO₂.', 'El CH₄.', 'El Cl₂.'], ver: ['molécula polar'] },
      { termino: 'fuerzas intermoleculares', formas: ['fuerzas intermoleculares', 'fuerza intermolecular'],
        def: 'Atracciones entre moléculas vecinas, mucho más débiles que los enlaces de dentro de cada una.',
        simple: 'Lo que mantiene juntas a las moléculas de un líquido o un sólido.',
        ejemplos: ['Las que se rompen al hervir.', 'El puente de hidrógeno del agua.', 'Las fuerzas de London del metano.'], ver: ['puente de hidrógeno', 'fuerzas de London'] },
      { termino: 'puente de hidrógeno', formas: ['puente de hidrógeno', 'puentes de hidrógeno', 'puente de H'],
        def: 'Atracción entre un H unido a N, O o F y un par libre de otra molécula vecina.',
        simple: 'Un hidrógeno de una molécula que se pega a la vecina.',
        ejemplos: ['Entre moléculas de NH₃.', 'Entre moléculas de HF.', 'Entre moléculas de CH₃OH.'], ver: ['fuerzas intermoleculares'] },
      { termino: 'fuerzas de London', formas: ['fuerzas de London', 'fuerza de London', 'London', 'dispersión'],
        def: 'Atracción débil entre dipolos pasajeros de las nubes de electrones; la tienen todas las moléculas y crece con el tamaño.',
        simple: 'Una atracción débil que tienen todas las moléculas.',
        ejemplos: ['La única del CH₄.', 'Más fuerte en el Br₂ que en el Cl₂.', 'Más en el n-pentano que en el neopentano.'], ver: ['fuerzas intermoleculares'] },
      { termino: 'dipolo-dipolo', formas: ['dipolo-dipolo'],
        def: 'Atracción entre moléculas polares: el extremo algo positivo de una jala el algo negativo de la vecina.',
        simple: 'Moléculas polares que se ordenan positivo con negativo.',
        ejemplos: ['HCl con HCl.', 'H₂S con H₂S.', 'CH₃OCH₃ con CH₃OCH₃.'], ver: ['molécula polar', 'fuerzas intermoleculares'] },
    ],
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        id: 'molecula-gira', titulo: 'La molécula que gira', pieza: 'quim-molecula-3d',
        consigna: 'La molécula gira sola: su forma no cambia. Pausa, gírala con el dedo y toca un átomo. Cambia de molécula y enciende los dipolos.',
        controles: [
          { id: 'mol', etiqueta: 'Molécula', opciones: GIRA.map(k => ({ valor: k, texto: M.molecula(k).formula })) },
          { id: 'dip', etiqueta: 'Dipolos', opciones: [{ valor: 0, texto: 'Ocultos' }, { valor: 1, texto: 'A la vista' }] },
          { id: 'par', etiqueta: 'Pares libres', opciones: [{ valor: 1, texto: 'A la vista' }, { valor: 0, texto: 'Ocultos' }] },
          { id: 'giro', etiqueta: 'Giro', min: 0, max: 360, paso: 30, inicio: 0, unidad: '°', decimales: 0, auto: { velocidad: 30 } },
        ],
        dibujo: v => { const d = mol3d(v.mol); return { datos: Object.assign({}, d.datos, { giro: v.giro || 0 }), estado: { dipolos: v.dip === 1, pares: v.par === 1 } }; },
        lectura: v => { const x = M.molecula(v.mol); return [`${x.formula}: ${x.vsepr.geometria}, ${HIB[x.vsepr.hibridacion]}, ${x.polaridad.polar ? 'polar' : 'apolar'}`]; },
        invitaciones: [
          { texto: 'Encuentra una molécula con enlaces polares que, en total, sea apolar.', logrado: v => enlacesPolares(v.mol) && !M.molecula(v.mol).polaridad.polar,
            bien: 'Sus dipolos de enlace se anulan por la forma. Míralo con los dipolos a la vista.', pista: 'Enciende los dipolos: busca flechas en los enlaces, pero ninguna gruesa en el centro.' },
          { texto: 'Busca una molécula cuyo átomo central tenga dos pares libres.', logrado: v => M.molecula(v.mol).posiciones.pares.length === 2,
            bien: 'Los pares libres también ocupan lugar: empujan a los enlaces.', pista: 'Deja los pares libres a la vista y cuenta las nubes violetas sobre el átomo central.' },
          { texto: 'Encuentra la molécula que tiene ángulos de 90° y de 120° a la vez.', logrado: v => { const a = M.molecula(v.mol).vsepr.angulos.map(Math.round); return a.includes(90) && a.includes(120); },
            bien: 'La bipirámide: tres átomos en el ecuador y dos en los polos.', pista: 'Busca una molécula con cinco átomos alrededor del central. Gírala hasta verla de costado.' },
          { texto: 'Guarda dos moléculas con la misma forma: una polar y otra apolar.',
            logrado: (v, g) => g.some(a => g.some(b => { const x = M.molecula(a.mol), y = M.molecula(b.mol); return x.vsepr.geometria === y.vsepr.geometria && x.polaridad.polar && !y.polaridad.polar; })),
            bien: 'La forma no basta: también importa qué átomos rodean al central.', pista: 'Compara CH₄ y CHCl₃: misma forma. Guarda las dos y mira la lectura.' },
        ],
      },
      {
        id: 'dos-dipolos', titulo: 'Dos dipolos que giran', pieza: 'quim-molecula',
        consigna: 'Agarra el hidrógeno de la derecha y abre o cierra el ángulo. Cambia también la polaridad de cada enlace. ¿Cuándo se anulan?',
        controles: [
          { id: 'th', etiqueta: 'θ', color: 'c-i', min: TH_MIN, max: 180, paso: 5, inicio: 105, unidad: '°', decimales: 0 },
          { id: 'mb', etiqueta: 'Dipolo de enlace', color: 'c-o', min: 0.5, max: MB_MAX, paso: 0.1, inicio: 1.5, unidad: 'D', decimales: 1 },
        ],
        dibujo: v => dosDipolos(v),
        lectura: v => [An(`θ = ${f(v.th, 0)}°`), `; enlace ${f(v.mb, 1)} D → `, mu, ` total = ${f(muTotal(v))} D`],
        arrastres: [{ id: 'hidrogeno', etiqueta: 'hidrógeno: abre o cierra el ángulo', color: 'c-i', donde: v => manijaH(v), mover: (pt, v) => ({ th: anguloEn(pt, v) }) }],
        invitaciones: [
          { texto: 'Haz que los dos dipolos se anulen por completo.', logrado: v => muTotal(v) < 0.005, bien: 'A 180° queda lineal: sus enlaces son polares, pero ella es apolar, como el CO₂.' },
          { texto: 'Consigue un dipolo total igual al de un solo enlace.', logrado: v => Math.abs(muTotal(v) - v.mb) < 0.005, bien: 'A 120°, dos flechas suman lo mismo que una. ¿Y a 90°?' },
          { texto: 'Busca el dipolo total más grande que permite la mesa.', logrado: v => Math.abs(muTotal(v) - muTotal({ th: TH_MIN, mb: MB_MAX })) < 1e-9,
            bien: 'Con el ángulo cerrado y los enlaces muy polares, las dos flechas casi se suman enteras.' },
        ],
      },
    ],
    laboratorioIdeas: { 'molecula-gira': ['forma-repulsion', 'forma-polaridad'], 'dos-dipolos': ['forma-polaridad'] },
    ideas: [formaIdea, hibridacion, polaridad, fuerzas],
  };
});
