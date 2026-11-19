/*
 * Teoría de «Enlace químico» (quimica.enlace-quimico). Molde: docs/teoria.md y docs/molde-unidad.md; unidad modelo:
 * contenido/teoria/quimica/propiedades-periodicas.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 *
 * Etapa 6 del plan de calidad (19 nov 2026), con criterio delegado (docs/metodo/unidad/etapa-delegada.md): la unidad de
 * antes, «Enlace químico y fuerzas intermoleculares», se partió en dos (docs/etapa6/propuesta-quimica.md §3 y §12). Aquí
 * queda cómo se unen los átomos; la forma, la hibridación, la polaridad de la molécula y las fuerzas entre moléculas
 * pasaron a quimica.geometria-molecular, con su avance (partición partidoEN, nucleo/avance.js).
 * Cinco ideas, en este orden y con estos id: 1 «Iónico, covalente y metálico» (`tres-enlaces`), 2 «Enlace iónico: iones
 * y fórmula» (`enlace-ionico`, nueva), 3 «Estructuras de Lewis y octeto» (`lewis-octeto`), 4 «Enlace dativo y
 * excepciones al octeto» (`dativo-excepciones`, nueva) y 5 «Resonancia» (`resonancia`). No declara calidad: 2 (la
 * sesión la marca después del lector en frío y el auditor); su prueba simula la marca.
 *
 * Mapa de colores (propuesta §8A, un color fijo por magnitud): Z naranja (c-o), electronegatividad y ΔEN turquesa (c-i),
 * electrones (de valencia, pares, puntos, los que pasan de un átomo a otro) violeta (c-f), carga (del ion, parcial δ,
 * formal) carmín (c-h); tipos de enlace, fórmulas y símbolos en tinta; sin verde. Cada ficha lleva su magnitud (m) y la
 * prueba de la unidad revisa que su color sea el del mapa.
 * Objetos de la primera pantalla (quim-enlace, de prueba): el probador con el vaso (1), la sal en la cuchara (2), el
 * aire por la ventana (3), el limpiador con amoníaco (4) y la tiza (5).
 * Nada de nombres de compuestos ni de funciones: se dicen por su fórmula (Nomenclatura inorgánica es la que sigue).
 *
 * Datos (con su fuente; no van al alumno):
 *   electronegatividad: Pauling revisada por Allred (1961), tabla del CRC (las mismas de Propiedades periódicas y del motor
 *     de plantillas/enlace);
 *   Lewis, cargas formales y resonancia de átomo central: el motor de plantillas/enlace (regla 1), con sus casos;
 *   puntos de fusión de libro, con «unos»: NaCl 801 °C, KCl 770 °C, MgO 2852 °C, Cu 1085 °C, Fe 1538 °C, Al 660 °C, la
 *     parafina unos 60 °C, el hielo 0 °C (CRC Handbook).
 * Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md (EN1 a EN7); los QM- son hipótesis nuevas de esta unidad.
 * Cuentas rehechas aparte en scratchpad (e6-quimica/cuentas-a.js), por otro camino que el de este archivo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/enlace da los electrones de valencia, la ΔEN, el Lewis de átomo central y la resonancia.
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
  // ---------- Colores, fichas y letras ----------
  const COLORES = { z: 'o', en: 'i', e: 'f', carga: 'h' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Pz = ficha('z'), Ne = ficha('en'), El = ficha('e'), Cq = ficha('carga');
  const ENf = Ne('EN'), dENf = Ne('ΔEN');
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  const SUBS = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sub = x => (x === 1 ? '' : String(x).split('').map(c => SUBS[c]).join(''));
  // Opciones de una pregunta: la primera es la correcta; las demás, [texto, error, siFuera]. Sin repetidas.
  function ops(correcta, ...malas) {
    const vistos = new Set([correcta]), out = [{ id: 'c', texto: correcta, correcta: true }];
    malas.forEach(([texto, error, siFuera], k) => { if (texto && !vistos.has(texto)) { vistos.add(texto); out.push({ id: `e${k}`, texto, error, siFuera }); } });
    return out.slice(0, 4);
  }
  const vf = l => l.map(x => (x ? 'V' : 'F')).join('');
  const ROMANO = ['I', 'II', 'III'];
  // V/F de tres afirmaciones de un banco [[texto, verdad, por qué, datos?]…], con un distractor por afirmación invertida.
  function vfDe(r, banco, datosBase) {
    const tres = r.baraja(banco.map((_, i) => i)).slice(0, 3).sort((a, b) => a - b).map(i => banco[i]), bien = tres.map(x => x[1]);
    const o = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => { const otra = bien.slice(); otra[i] = !otra[i]; o.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA', siFuera: `Bien las otras dos. La ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` }); });
    const clave = tres.find(x => !x[1]) || tres[0];
    const datos = [...new Set([...(datosBase || []), ...tres.flatMap(x => x[3] || [])])];
    return { pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.map((x, i) => `${ROMANO[i]}. ${x[0]} `)], datos, opciones: o,
      solucion: { texto: `${tres.map((x, i) => `${ROMANO[i]} ${x[1] ? 'V' : 'F'}`).join(', ')}. ${clave[2].replace(/^./, m => m.toUpperCase())}.` } };
  }

  // ---------- Datos de los elementos (del motor; los metales que el motor no trae, de la misma tabla de Allred) ----------
  const EXTRA = { Cu: [29, 1.90, true, 'cobre', 1], Fe: [26, 1.83, true, 'hierro', 2], Zn: [30, 1.65, true, 'cinc', 2], Ag: [47, 1.93, true, 'plata', 1] };
  const el = s => (EXTRA[s] ? { simbolo: s, Z: EXTRA[s][0], en: EXTRA[s][1], metal: true, nombre: EXTRA[s][3], valencia: EXTRA[s][4] } : M.elemento(s));
  const EN = s => el(s).en;
  const enTxt = s => f(EN(s), 2);
  const nombre = s => el(s).nombre;
  const dEN = (a, b) => Math.round(Math.abs(EN(a) - EN(b)) * 100) / 100;
  const mayorEN = (a, b) => (EN(a) >= EN(b) ? a : b);
  const enLinea = ss => `EN: ${ss.map(s => `${s} ${enTxt(s)}`).join('; ')}`;
  // Las líneas de Datos que se repiten.
  const D = {
    delta: 'ΔEN = EN del mayor − EN del menor',
    guia: 'Guía de ΔEN: 1,7 o más suele ser iónico; menos de 1,7, covalente polar; 0, covalente apolar',
    metales: 'Metales: a la izquierda de la escalera de la tabla (litio, sodio, potasio, magnesio, calcio, aluminio, hierro, cobre, cinc, plata)',
    noMetales: 'No metales: a la derecha de la escalera (hidrógeno, carbono, nitrógeno, oxígeno, flúor, fósforo, azufre, cloro, bromo, yodo)',
    carga: 'Carga de un ion = protones − electrones',
  };

  // ---------- Idea 1 (rehecha, 19 nov): iónico, covalente y metálico ----------
  // Propuesta A1. Objeto de la primera pantalla: el probador de foquito con el vaso (quim-enlace, de prueba).
  // Cambia: lo que tocan los cables · Permanece: el foquito, que prende si algo con carga se mueve · Progresa: del metal
  // al agua con sal y a lo que no prende · Se reserva: lo que hay dentro del grano de sal (Predice), sin lupa en el juego
  // · Debe verse: que la sal seca no prende y disuelta sí.
  // Errores: EN1 (el NaCl hecho de moléculas; 92 % en Kumpha y otros 2014), EN2 (átomos neutros), EN5 (clasificar al
  // revés), QM-TIPO-METAL (llamar metálico a un compuesto con un metal), QM-SIN-ENLACE, QM-POL-IGUALES (polar con átomos
  // iguales), QM-DELTA-SIGNO (el δ− al que jala menos), QM-HF-CORTE (el corte de 1,7 por encima de los elementos),
  // QM-CONDUCE-IONICO (el iónico conduce sólido; trampa 31 de San Marcos).
  const MATERIALES = {
    cobre: { texto: 'Cable de cobre', prende: 2, lee: 'Cobre: el foquito prende fuerte; es un metal.' },
    sal: { texto: 'Trozo de sal', prende: 0, lee: 'Sal seca: no prende, aunque es la misma del agua salada.' },
    'agua-sal': { texto: 'Agua con sal', prende: 2, lee: 'Agua con sal: prende; con agua destilada, no.' },
    'agua-azucar': { texto: 'Agua con azúcar', prende: 0, lee: 'Agua con azúcar: no prende, como el agua destilada.' },
    agua: { texto: 'Agua destilada', prende: 0, lee: 'Agua destilada: no prende; no tiene nada disuelto.' },
  };
  const probador = (m, nombreObj) => ({ pieza: 'quim-enlace', datos: { vista: 'objeto', objeto: 'probador', contenido: m, prende: MATERIALES[m].prende, nombre: nombreObj }, estado: {} });
  const OBJ = (objeto, o) => ({ pieza: 'quim-enlace', datos: Object.assign({ vista: 'objeto', objeto }, o), estado: {} });
  // La lupa de «Mira»: partículas con la paleta de elementos (un dibujo de partículas, sin variables).
  const ATOMOS = { Na: { el: 'Na', estilo: 'punto', r: 6, carga: '+' }, Cl: { el: 'Cl', estilo: 'hueco', r: 8, carga: '-' }, Cu: { el: 'Cu', estilo: 'punto', r: 7, carga: '+' },
    e: { estilo: 'lleno', r: 2.5 }, O: { el: 'O', estilo: 'lleno', r: 6 }, H: { el: 'H', estilo: 'hueco', r: 4 }, C: { el: 'C', estilo: 'lleno', r: 6 } };
  const ESPECIES = { H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]] };
  function red(a, b, cols, filas, x0, x1, y0, y1, extra = {}) {
    const out = [];
    for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) {
      const e = b && (i + j) % 2 ? b : a;
      out.push(Object.assign({ e, n: 1, x: x0 + (x1 - x0) * j / (cols - 1), y: y0 + (y1 - y0) * i / (filas - 1) }, extra));
    }
    return out;
  }
  // Iones sueltos en el agua: posiciones fijas, desordenadas (sin azar: la figura es pura).
  const SUELTOS = [[0.18, 0.2, 'Na'], [0.62, 0.15, 'Cl'], [0.4, 0.42, 'Cl'], [0.82, 0.38, 'Na'], [0.22, 0.7, 'Cl'], [0.58, 0.68, 'Na'], [0.85, 0.82, 'Cl'], [0.4, 0.88, 'Na']];
  const lupa = (cajas, extra = {}) => ({ pieza: 'quim-particulas', datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 22, cajas,
    alt: 'Lupa (modelo, no a escala): partículas dentro de cada material.' }, extra), estado: {} });
  const CAJA_SAL = { titulo: 'Sal seca', forma: 'caja', particulas: red('Na', 'Cl', 4, 5, 0.14, 0.86, 0.1, 0.9) };
  const CAJA_AGUA_SAL = { titulo: 'Agua con sal', forma: 'vaso', nivel: 0.92, particulas: SUELTOS.map(([x, y, e]) => ({ e, n: 1, x, y })) };
  const CAJA_COBRE = { titulo: 'Cobre', forma: 'caja', particulas: [...red('Cu', null, 3, 4, 0.2, 0.8, 0.14, 0.86), { e: 'e', n: 9 }] };
  const desde = (c, k) => Object.assign({}, c, { particulas: c.particulas.map(p => Object.assign({}, p, { desde: k })) });

  // Sustancias para clasificar por sus elementos: fórmula, elementos, tipo.
  const TIPO_TXT = { ionico: 'Iónico', covalente: 'Covalente', metalico: 'Metálico' };
  const tipoPorElementos = els => { const m = els.filter(s => el(s).metal), nm = els.filter(s => !el(s).metal); return m.length && nm.length ? 'ionico' : m.length ? 'metalico' : 'covalente'; };
  const SUST_A = [['KBr', ['K', 'Br']], ['Fe', ['Fe']], ['CO₂', ['C', 'O']], ['MgO', ['Mg', 'O']], ['Al', ['Al']], ['NH₃', ['N', 'H']], ['CaF₂', ['Ca', 'F']], ['Cl₂', ['Cl']],
    ['Cu', ['Cu']], ['CH₄', ['C', 'H']], ['Li₂O', ['Li', 'O']], ['H₂S', ['H', 'S']], ['Zn', ['Zn']], ['NaI', ['Na', 'I']]];
  const SUST_R = [['KCl', ['K', 'Cl']], ['Ag', ['Ag']], ['PCl₃', ['P', 'Cl']], ['CaO', ['Ca', 'O']], ['Mg', ['Mg']], ['SO₂', ['S', 'O']], ['Na₂S', ['Na', 'S']], ['N₂', ['N']]];
  const clase = s => (el(s).metal ? 'metal' : 'no metal');
  const quien = (fo, els) => (fo === els[0] ? `${nombre(fo)} (${fo})` : fo);
  const elemTxt = els => els.map(s => `${s} (${clase(s)})`).join(' y ');
  const POR_QUE = {
    ionico: 'Un metal con un no metal: el metal cede electrones y quedan iones que se atraen.',
    covalente: 'Solo no metales: sus átomos comparten pares de electrones.',
    metalico: 'Un metal solo: sus átomos sueltan electrones a un mar común.',
  };
  const SI_TIPO = {
    ionico: ['QM-IONICO-MAL', 'Sería iónico si se uniera un metal con un no metal.'],
    covalente: ['EN5', 'Sería covalente si solo hubiera no metales compartiendo pares.'],
    metalico: ['QM-TIPO-METAL', 'Sería metálico si fuera un metal solo, sin no metales.'],
  };
  function casoTipo(r) {
    const [fo, els] = r.de(SUST_A), t = tipoPorElementos(els);
    const malas = Object.keys(TIPO_TXT).filter(k => k !== t).map(k => [TIPO_TXT[k], SI_TIPO[k][0], `Bien mirar los elementos. ${SI_TIPO[k][1]}`]);
    return {
      pregunta: `¿Qué tipo de enlace une las partículas del ${quien(fo, els)}?`,
      datos: [D.metales, D.noMetales],
      opciones: ops(TIPO_TXT[t], ...malas, ['Ninguno: sus átomos están sueltos', 'QM-SIN-ENLACE', 'Es un sólido, un líquido o un gas estable: sus partículas están unidas.']),
      solucion: { texto: POR_QUE[t], ecuacion: [`${fo}: ${elemTxt(els)} → enlace ${TIPO_TXT[t].toLowerCase()}`] },
    };
  }
  // Propiedades de un sólido → tipo de enlace (valores de libro con «unos»).
  const PROPS = [
    ['ionico', 'Un sólido blanco y duro funde a unos 770 °C. Sólido no conduce la corriente; disuelto en agua, sí.'],
    ['ionico', 'Un sólido funde a unos 2800 °C, se quiebra al golpearlo y conduce la corriente solo cuando está fundido.'],
    ['metalico', 'Un sólido brillante funde a unos 1085 °C, se deja estirar en alambres y conduce la corriente en estado sólido.'],
    ['metalico', 'Un sólido gris funde a unos 660 °C, se lamina en hojas delgadas y conduce la corriente y el calor en estado sólido.'],
    ['covalente', 'Un sólido blanco y blando funde a unos 60 °C y no conduce la corriente, ni sólido ni fundido.'],
    ['covalente', 'Un líquido hierve a unos 77 °C, no conduce la corriente y no se mezcla con el agua.'],
  ];
  const D_PROPS = ['Iónico: sólido de alto punto de fusión; conduce fundido o disuelto, no sólido', 'Metálico: conduce sólido; brilla y se deja laminar',
    'Covalente molecular: punto de fusión bajo; no conduce'];
  function casoPropiedades(r) {
    const [t, txt] = r.de(PROPS);
    const SI = {
      ionico: ['QM-CONDUCE-IONICO', 'Bien mirar si conduce. Un iónico conduce fundido o disuelto, pero nunca sólido.'],
      covalente: ['QM-PF-ALTO', 'Bien mirar la fusión. Un covalente molecular funde bajo y no conduce.'],
      metalico: ['QM-CONDUCE-METAL', 'Bien mirar si conduce. Un metal conduce también en estado sólido.'],
    };
    return {
      pregunta: `${txt} ¿Qué tipo de enlace tiene?`,
      datos: D_PROPS,
      opciones: ops(TIPO_TXT[t], ...Object.keys(TIPO_TXT).filter(k => k !== t).map(k => [TIPO_TXT[k], SI[k][0], SI[k][1]]),
        ['No se puede saber sin su fórmula', 'QM-SIN-LEY', 'Las propiedades ya lo dicen: la conducción y la fusión.']),
      solucion: { texto: { ionico: 'Conduce solo fundido o disuelto: sus iones se mueven recién ahí.', metalico: 'Conduce sólido: tiene electrones que se mueven entre sus átomos.', covalente: 'Funde bajo y no conduce: son moléculas sin carga.' }[t],
        ecuacion: [`enlace ${TIPO_TXT[t].toLowerCase()}`] },
    };
  }
  // Pares por ΔEN: los tres tipos, sin el HF y sin diferencias chicas entre átomos distintos (la guía no se pone de acuerdo).
  const PARES_DEN = [['Na', 'Cl'], ['K', 'F'], ['Mg', 'O'], ['Ca', 'O'], ['Li', 'F'], ['K', 'Cl'], ['H', 'Cl'], ['H', 'O'], ['N', 'H'], ['C', 'O'], ['P', 'Cl'], ['C', 'Cl'],
    ['S', 'O'], ['Cl', 'Cl'], ['O', 'O'], ['N', 'N'], ['H', 'H'], ['F', 'F']];
  const tipoDEN = (a, b) => (a === b ? 'apolar' : dEN(a, b) >= 1.7 ? 'ionico' : 'polar');
  const TIPO_DEN = { ionico: 'Iónico', polar: 'Covalente polar', apolar: 'Covalente apolar' };
  const enlaceTxt = (a, b) => `${a}–${b}`;
  function casoDEN(r) {
    const [a, b] = r.baraja(r.de(PARES_DEN)), t = tipoDEN(a, b), d = dEN(a, b);
    const SI = {
      ionico: ['QM-DEN-IONICO', 'Bien calcular ΔEN. Sería iónico con 1,7 o más, entre un metal y un no metal.'],
      polar: ['QM-POL-IGUALES', 'Bien calcular ΔEN. Sería polar si los dos átomos jalaran distinto.'],
      apolar: ['QM-APOLAR-DIST', 'Bien calcular ΔEN. Sería apolar si los dos jalaran igual: ΔEN = 0.'],
    };
    return {
      pregunta: a === b ? `¿Qué tipo de enlace une los dos átomos de la molécula ${a}₂?` : `¿Qué tipo de enlace hay entre ${nombre(a)} y ${nombre(b)} (${enlaceTxt(a, b)})?`,
      datos: [enLinea([...new Set([a, b])]), D.delta, D.guia],
      opciones: ops(TIPO_DEN[t], ...Object.keys(TIPO_DEN).filter(k => k !== t).map(k => [TIPO_DEN[k], SI[k][0], SI[k][1]]),
        ['Metálico', 'QM-TIPO-METAL', 'Sería metálico si los dos fueran metales. Aquí no.']),
      solucion: { texto: a === b ? 'Dos átomos iguales jalan igual el par: queda al medio.' : `ΔEN = ${f(d)}. ${t === 'ionico' ? 'Metal con no metal y 1,7 o más.' : 'Dos no metales que jalan distinto.'}`,
        ecuacion: ['ΔEN = ', Ne(f(d)), `: ${TIPO_DEN[t].toLowerCase()}`] },
    };
  }
  // Polares entre no metales: quién queda con δ−.
  const PARES_DELTA = [['H', 'Cl'], ['H', 'O'], ['N', 'H'], ['C', 'O'], ['P', 'Cl'], ['C', 'Cl'], ['S', 'O'], ['H', 'Br'], ['C', 'N'], ['H', 'S'], ['O', 'F'], ['N', 'Cl'], ['C', 'H'], ['B', 'F']];
  function casoDelta(r) {
    const [a, b] = r.baraja(r.de(PARES_DELTA)), m = mayorEN(a, b), o = m === a ? b : a;
    return {
      pregunta: `En el enlace ${enlaceTxt(a, b)}, ¿qué átomo queda con carga parcial negativa, δ−?`,
      datos: [enLinea([a, b])],
      opciones: ops(`El ${nombre(m)} (${m})`, [`El ${nombre(o)} (${o})`, 'QM-DELTA-SIGNO', `Bien buscar quién jala. Pero el par se corre hacia el de mayor EN: el ${m}.`],
        ['Ninguno: los dos comparten el par', 'QM-DELTA-CERO', 'Comparten el par, cierto. Pero no por igual: jalan distinto.'],
        ['Los dos: el par está entre ellos', 'QM-DELTA-LOS-DOS', 'El par está entre ellos, cierto. Pero se corre hacia uno solo.']),
      solucion: { texto: `El par se corre hacia el ${m}, que jala más: ahí queda δ−; el ${o}, con δ+.`,
        ecuacion: [Ne(`EN (${m}) = ${enTxt(m)}`), ' > ', Ne(`EN (${o}) = ${enTxt(o)}`)] },
    };
  }

  // Ejemplos de la idea 1. Cuentas rehechas aparte (cuentas-a.js): Mg–O 3,44 − 1,31 = 2,13 · N–H 3,04 − 2,20 = 0,84 ·
  // H–O 1,24 > H–Cl 0,96 > H–N 0,84 · K–Cl 3,16 − 0,82 = 2,34 · H–F 3,98 − 2,20 = 1,78 · Z 19 → K (grupo 1), Z 17 → Cl.
  const EJEMPLOS_TIPOS = [
    { nivel: 1, titulo: 'La sal de potasio',
      enunciado: '¿Qué tipo de enlace hay en el KBr, el sólido que forman el potasio y el bromo?',
      datos: [D.metales, D.noMetales],
      solucion: [{ texto: 'El potasio es un metal y el bromo, un no metal: el potasio cede su electrón y quedan iones K⁺ y Br⁻ que se atraen.' }],
      respuesta: ['Iónico'] },
    { nivel: 1, titulo: 'El cable de la casa',
      enunciado: '¿Qué tipo de enlace une los átomos del cobre de un cable eléctrico?',
      datos: [D.metales],
      figura: probador('cobre', 'Un cable de cobre en el probador'),
      solucion: [{ texto: 'Hay un solo elemento y es un metal: sus átomos sueltan electrones que se mueven entre todos. Por eso el cable conduce.' }],
      respuesta: ['Metálico'] },
    { nivel: 1, titulo: 'El gas de Camisea',
      enunciado: 'El gas natural de Camisea es sobre todo metano, CH₄. ¿Qué tipo de enlace une sus átomos?',
      datos: [D.noMetales],
      solucion: [{ texto: 'El carbono y el hidrógeno son no metales: comparten pares de electrones y forman moléculas.' }],
      respuesta: ['Covalente'] },
    { nivel: 1, titulo: 'La diferencia en el MgO',
      enunciado: '¿Cuánto vale la diferencia de electronegatividad, ΔEN, entre el magnesio y el oxígeno?',
      datos: [enLinea(['Mg', 'O']), D.delta],
      solucion: [{ texto: 'Resto la menor de la mayor.', ecuacion: ['ΔEN = ', Ne('3,44'), ' − ', Ne('1,31'), ' = ', Ne('2,13')] }],
      respuesta: ['ΔEN = ', Ne('2,13')] },
    { nivel: 1, titulo: 'La δ del H–Cl',
      enunciado: 'En el enlace H–Cl, ¿qué átomo queda con carga parcial negativa, δ−?',
      datos: [enLinea(['H', 'Cl'])],
      solucion: [{ texto: 'El cloro jala más el par compartido: el par se le acerca y ahí queda la carga parcial negativa.', ecuacion: [Ne('3,16'), ' > ', Ne('2,20')] }],
      respuesta: ['El cloro: ', Cq('δ−')] },
    { nivel: 2, titulo: 'Tres sustancias, tres enlaces',
      enunciado: 'Indica el tipo de enlace de cada una: CaO (calcio y oxígeno), Cl₂ (dos cloros) y Fe (hierro).',
      datos: [D.metales, D.noMetales],
      solucion: [
        { texto: 'CaO: metal con no metal, iónico. Cl₂: un solo no metal, covalente; los dos cloros jalan igual, así que es apolar.' },
        { texto: 'Fe: un metal solo, metálico.', ecuacion: ['CaO iónico', SEP, 'Cl₂ covalente apolar', SEP, 'Fe metálico'] },
      ],
      respuesta: ['Iónico, covalente apolar y metálico'] },
    { nivel: 2, titulo: 'Un sólido que conduce disuelto',
      enunciado: 'Un sólido blanco y duro funde a unos 770 °C. Sólido no conduce la corriente; disuelto en agua, sí. ¿Qué tipo de enlace tiene?',
      datos: D_PROPS,
      solucion: [
        { texto: 'Sólido no conduce: no es un metal. Disuelto sí: tiene partículas con carga que se sueltan en el agua.' },
        { texto: 'Esas partículas son iones, y su alto punto de fusión lo confirma.' },
      ],
      respuesta: ['Iónico'] },
    { nivel: 2, titulo: 'El enlace del amoníaco',
      enunciado: 'En el enlace N–H del amoníaco, ¿cuánto vale ΔEN, qué tipo de enlace es y hacia qué átomo se corre el par?',
      datos: [enLinea(['N', 'H']), D.delta, D.guia],
      solucion: [
        { texto: 'Resto las electronegatividades.', ecuacion: ['ΔEN = ', Ne('3,04'), ' − ', Ne('2,20'), ' = ', Ne('0,84')] },
        { texto: 'Dos no metales que jalan distinto: covalente polar. El par se corre hacia el nitrógeno.' },
      ],
      respuesta: ['ΔEN = ', Ne('0,84'), '; covalente polar, hacia el N'] },
    { nivel: 2, titulo: 'Por qué conduce el cable',
      enunciado: 'El cobre conduce la corriente en estado sólido y la sal, no. ¿Qué tiene el cobre que la sal sólida no tiene?',
      datos: ['La corriente pasa si hay algo con carga que se pueda mover'],
      solucion: [
        { texto: 'En el cobre, los átomos sueltan electrones a un mar común: esos electrones se mueven entre todos.' },
        { texto: 'En la sal sólida también hay cargas, los iones, pero están fijos en sus lugares.' },
      ],
      respuesta: ['Electrones que se mueven libres'] },
    { nivel: 2, titulo: 'Tres enlaces del hidrógeno',
      enunciado: 'Ordena los enlaces H–Cl, H–O y H–N del más polar al menos polar.',
      datos: [enLinea(['H', 'Cl', 'O', 'N']), D.delta],
      solucion: [
        { texto: 'Calculo las tres diferencias.', ecuacion: ['H–O: ', Ne('1,24'), SEP, 'H–Cl: ', Ne('0,96'), SEP, 'H–N: ', Ne('0,84')] },
        { texto: 'Más diferencia, más se corre el par: más polar.' },
      ],
      respuesta: ['H–O > H–Cl > H–N'] },
    { nivel: 3, titulo: 'Cada sustancia con su enlace',
      enunciado: '¿Qué tipo de enlace tienen, en este orden, el KCl, el H₂O y la plata (Ag)?',
      alternativas: ['Covalente, iónico y metálico', 'Iónico, covalente y metálico', 'Iónico, iónico y metálico', 'Metálico, covalente e iónico', 'Iónico, covalente y covalente'],
      datos: [D.metales, D.noMetales],
      solucion: [
        { texto: 'KCl: metal con no metal, iónico. H₂O: dos no metales, covalente. Ag: un metal solo, metálico.' },
        { texto: ['La ', letra('A'), ' invierte los dos primeros. La ', letra('C'), ' cree que el agua es iónica por tener oxígeno.'] },
        { texto: ['La ', letra('D'), ' llama metálico al KCl por tener un metal. La ', letra('E'), ' olvida que la plata es un metal.'] },
      ],
      respuesta: [letra('B'), ', iónico, covalente y metálico'] },
    { nivel: 3, titulo: 'Tres sólidos en el laboratorio',
      enunciado: 'X funde a unos 801 °C y conduce solo fundido. Q funde a unos 60 °C y no conduce. R conduce sólido y se lamina. ¿Qué enlace tiene cada uno?',
      alternativas: ['X metálico, Q iónico, R covalente', 'X covalente, Q iónico, R metálico', 'X iónico, Q metálico, R covalente', 'X iónico, Q covalente, R metálico', 'X metálico, Q covalente, R iónico'],
      datos: D_PROPS,
      solucion: [
        { texto: 'X conduce solo fundido y funde alto: iónico. Q funde bajo y no conduce: covalente molecular. R conduce sólido: metálico.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' toman a X por metálico, aunque sólido no conduce. La ', letra('B'), ' llama iónico a Q, que funde a 60 °C.'] },
        { texto: ['La ', letra('C'), ' cambia a Q y a R: el que conduce sólido es el metal.'] },
      ],
      respuesta: [letra('D'), ', X iónico, Q covalente, R metálico'] },
    { nivel: 3, titulo: 'El caso del HF',
      enunciado: 'En el HF, el hidrógeno y el flúor tienen ΔEN = 1,78. ¿Qué afirmación es correcta?',
      alternativas: ['Es covalente polar: son dos no metales que comparten el par.', 'Es iónico: su ΔEN pasa de 1,7.', 'Es covalente apolar: el H y el F están unidos.',
        'Es metálico: el hidrógeno está en el grupo 1.', 'Es iónico: el flúor le quita el electrón al hidrógeno.'],
      datos: [enLinea(['H', 'F']), D.guia, D.noMetales],
      solucion: [
        { texto: 'El hidrógeno y el flúor son no metales: comparten el par, que se corre mucho hacia el flúor.' },
        { texto: 'La guía de 1,7 es una ayuda, no una ley: primero se mira qué elementos son.' },
        { texto: ['La ', letra('B'), ' y la ', letra('E'), ' usan solo el corte. La ', letra('C'), ' olvida la diferencia: jalan muy distinto.'] },
        { texto: ['La ', letra('D'), ' toma al hidrógeno por metal porque encabeza el grupo 1.'] },
      ],
      respuesta: [letra('A'), ', covalente polar'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. La sal sólida conduce la corriente. II. En la molécula Cl₂, el par queda al medio. III. En un metal, hay electrones que se mueven entre sus átomos.',
      alternativas: ['VVV', 'VFV', 'FFV', 'VVF', 'FVV'],
      datos: D_PROPS,
      solucion: [
        { texto: 'I es falsa: en la sal sólida los iones no se mueven. II es verdadera: dos cloros jalan igual. III es verdadera.', ecuacion: ['FVV'] },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ' y la ', letra('D'), ' creen que la sal sólida conduce; la ', letra('B'), ' también corre el par del Cl₂.'] },
        { texto: ['La ', letra('C'), ' acierta con la sal, pero el par del Cl₂ no se corre hacia ningún lado.'] },
      ],
      respuesta: [letra('E'), ', FVV'] },
    { nivel: 3, titulo: 'Dos elementos sin nombre',
      enunciado: 'X tiene Z = 19 y Q, Z = 17. ¿Qué enlace hay en el compuesto de X con Q y cuál en la molécula Q₂?',
      alternativas: ['Covalente en los dos', 'Iónico en los dos', 'Iónico en X con Q; covalente apolar en Q₂', 'Metálico en X con Q; iónico en Q₂', 'Covalente polar en X con Q; iónico en Q₂'],
      datos: ['Gases nobles: Z = 2, 10, 18 y 36', D.metales, D.noMetales],
      solucion: [
        { texto: 'X está uno después del argón (18): grupo 1, un metal. Q está uno antes: grupo 17, un no metal.', ecuacion: [Pz('Z = 19'), ': grupo 1', SEP, Pz('Z = 17'), ': grupo 17'] },
        { texto: 'X con Q: metal con no metal, iónico. Q₂: dos átomos iguales del no metal, covalente apolar.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' toman a X por no metal. La ', letra('B'), ' y la ', letra('D'), ' llaman iónico a Q₂, que no tiene metal.'] },
      ],
      respuesta: [letra('C'), ', iónico y covalente apolar'] },
  ];

  const tres = {
    id: 'tres-enlaces',
    titulo: 'Iónico, covalente y metálico',
    pregunta: '¿De qué maneras se unen los átomos?',
    temas: ['Tipos de enlace y propiedades', 'Enlace metálico', 'Polaridad del enlace'],
    pieza: 'quim-enlace',
    aprendizaje: 'Metal con no metal forma iones que se atraen; los no metales comparten pares; un metal suelta electrones a un mar común.',
    actividad: 'Tocar cinco materiales con el probador y ver cuáles prenden el foquito.',
    lee: {
      tarjetas: [
        { titulo: 'El probador', texto: 'Una pila, un foquito y dos cables. Si lo que tocan los cables deja pasar la corriente, el foquito prende. La corriente pasa cuando algo con carga eléctrica se puede mover.',
          pieza: 'quim-enlace', dibujo: probador('agua', 'Los cables tocan agua destilada') },
        { titulo: 'Metales y no metales', texto: 'En la tabla, los metales están a la izquierda de la escalera y los no metales, a la derecha. El sodio es un metal; el cloro, un no metal. La sal de mesa, NaCl, tiene los dos.' },
        { titulo: 'Los electrones de afuera', texto: 'Los átomos se unen reacomodando sus electrones de valencia. Esa unión se llama enlace químico. No todas las sustancias se unen de la misma manera.' },
        { titulo: 'Qué mirar', texto: 'En el juego tocas cinco materiales: un metal, un trozo de sal seca y tres vasos con agua. Anota cuáles prenden el foquito y cuáles no.' },
      ],
    },
    ejemplos: EJEMPLOS_TIPOS,
    juega: {
      pieza: 'quim-enlace',
      consigna: 'El foquito prende si algo con carga eléctrica se mueve por lo que tocan los cables. Prueba los cinco materiales.',
      mision: {
        texto: 'Prende el foquito con algo que no sea un metal.',
        logrado: v => v.m === 'agua-sal',
        bien: 'El agua con sal. La sal seca no prendía: algo cambió al disolverla.',
      },
      voz: 'Compara la sal seca con la sal disuelta.',
      leyenda: [
        { s: 'foquito', t: 'prende si pasa la corriente' },
        { s: 'cobre', t: 'un metal' },
        { s: 'agua destilada', t: 'agua pura, sin nada disuelto' },
      ],
      controles: [{ id: 'm', etiqueta: 'Material', opciones: Object.keys(MATERIALES).map(k => ({ valor: k, texto: MATERIALES[k].texto })), inicio: 'agua' }],
      dibujo: v => probador(v.m, MATERIALES[v.m].texto),
      lectura: v => [MATERIALES[v.m].lee],
      minimo: 3,
    },
    predice: {
      pieza: 'quim-particulas',
      pregunta: 'La sal seca no prende el foquito; disuelta en agua, sí. Con una lupa enorme, ¿qué habría dentro de un grano de sal?',
      datos: ['Sodio (Na): metal del grupo 1', 'Cloro (Cl): no metal del grupo 17'],
      voz: 'Piensa qué tiene carga y por qué no se mueve en la sal seca.',
      opciones: [
        { id: 'c', texto: 'Iones de sodio y de cloro alternados en filas', correcta: true },
        { id: 'moleculas', texto: 'Moléculas sueltas, cada una con un sodio y un cloro', error: 'EN1', siFuera: 'La fórmula dice uno a uno, cierto. Pero cada ion queda rodeado de varios del otro, sin pares sueltos.' },
        { id: 'comparten', texto: 'Átomos de sodio y de cloro que comparten sus electrones', error: 'EN5', siFuera: 'Compartir sería covalente, entre no metales. El sodio es un metal: cede su electrón.' },
        { id: 'neutros', texto: 'Átomos neutros de sodio y cloro, mezclados', error: 'EN2', siFuera: 'Antes de unirse eran neutros. Si siguieran así, el agua salada tampoco conduciría.' },
      ],
      dibujo: lupa([{ titulo: 'Grano de sal', rotulo: 'Por dentro: ?', forma: 'caja', particulas: [] }], { alt: 'Lupa sobre un grano de sal, todavía vacía: lo que hay dentro es lo que se pregunta.' }),
      revelar: lupa([CAJA_SAL], { alt: 'Lupa sobre un grano de sal (modelo): iones de sodio y de cloro alternados en filas.' }),
      coincide: 'Coincide: iones Na⁺ y Cl⁻ alternados, sin moléculas sueltas.',
      noCoincide: 'Dentro hay iones Na⁺ y Cl⁻ alternados, fijos en una red.',
    },
    mira: {
      pieza: 'quim-particulas',
      datos: lupa([desde(CAJA_SAL, 1), desde(CAJA_AGUA_SAL, 2), desde(CAJA_COBRE, 3)], { separacion: 18,
        alt: 'Tres lupas (modelo, no a escala): la sal seca con sus iones en filas, el agua con sal con los iones sueltos y el cobre con sus iones en un mar de electrones.' }).datos,
      voz: 'Miremos por dentro lo que probaste.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Sal seca: iones Na⁺ y Cl⁻ fijos en una red; no pueden moverse.', ecuacion: ['Na', Cq('⁺'), ' Cl', Cq('⁻'), ' Na', Cq('⁺'), ' Cl', Cq('⁻'), ' …'] },
        { estado: { corte: 2 }, texto: 'En el agua, los iones se separan y se mueven: el foquito prende.' },
        { estado: { corte: 3 }, texto: 'Cobre: iones de cobre en un mar de electrones que se mueven.', ecuacion: ['Cu', Cq('⁺'), ' + ', El('e⁻'), ' que se mueven'] },
        { estado: { corte: 3 }, texto: 'Azúcar y agua destilada: moléculas sin carga, el foquito no prende.' },
        { estado: { corte: 3 }, texto: 'Entre no metales se comparten pares; si jalan distinto, el enlace es polar.', ecuacion: ['H', Cq('δ+'), '–Cl', Cq('δ−'), ': ', dENf, ' = 0,96'] },
      ],
    },
    regla: {
      texto: 'Metal con no metal: iónico, iones que se atraen en una red. Solo no metales: covalente, pares compartidos, polar si jalan distinto. Un metal solo: metálico, mar de electrones.',
      ecuacion: [dENf, ' ≥ 1,7: suele ser iónico', SEP, dENf, ' < 1,7: covalente polar', SEP, dENf, ' = 0: covalente apolar'],
      condicion: 'la ΔEN es una guía: primero mira qué elementos se unen (el HF, con 1,78, es covalente polar).',
      voz: 'Primero los elementos; la ΔEN confirma.',
      dibujo: lupa([CAJA_SAL, CAJA_AGUA_SAL, CAJA_COBRE], { separacion: 18, alt: 'Las tres lupas: iones fijos en la sal seca, iones sueltos en el agua con sal y el cobre con su mar de electrones.' }),
    },
    resuelve: {
      pieza: 'quim-enlace',
      generar(s) {
        const [fo, els] = SUST_R[s % SUST_R.length], t = tipoPorElementos(els);
        const prop = { ionico: 'Cuadra con una propiedad: un iónico sólido no conduce; fundido o disuelto, sí.', covalente: 'Cuadra: se forman moléculas sin carga, que no conducen.',
          metalico: 'Cuadra con una propiedad: un metal conduce la corriente en estado sólido.' }[t];
        return {
          enunciado: `¿Qué tipo de enlace une las partículas del ${quien(fo, els)}?`,
          datos: [D.metales, D.noMetales],
          pasos: [
            { tipo: 'pide', texto: `Piden el tipo de enlace del ${fo}: iónico, covalente o metálico.` },
            { tipo: 'datos', texto: els.length === 1 ? `El ${fo} tiene un solo elemento: ${elemTxt(els)}.` : `En el ${fo} hay ${elemTxt(els)}.` },
            { tipo: 'regla', texto: 'Metal con no metal: iónico. Solo no metales: covalente. Un metal solo: metálico.' },
            { tipo: 'aplica', texto: POR_QUE[t], ecuacion: [`${fo}: enlace ${TIPO_TXT[t].toLowerCase()}`] },
            { tipo: 'sentido', texto: prop },
          ],
          respuesta: [`Enlace ${TIPO_TXT[t].toLowerCase()}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-enlace',
      voz: 'Primero mira qué elementos se unen.',
      generar(sem) {
        const r = azar(sem * 89 + 7), tipo = sem % 4;
        return [casoTipo, casoPropiedades, casoDEN, casoDelta][tipo](r);
      },
    },
  };


  // ---------- Idea 2 (nueva, 19 nov): enlace iónico, iones y fórmula ----------
  // Propuesta A2. Objeto de la primera pantalla: granos de sal en una cuchara (quim-enlace, de prueba).
  // Cambia: el metal y el no metal · Permanece: los símbolos de Lewis con sus puntos y los iones entre corchetes ·
  // Progresa: de uno a uno (NaCl) a 1:2 y 2:3 · Se reserva: el nitrógeno (Predice: Mg₃N₂), que no está en el juego ·
  // Debe verse: que los electrones que entrega el metal son los que recibe el no metal.
  // Errores: QM-FORM-UNO (uno de cada), QM-FORM-INVERSA (cada ion con su propia carga como subíndice), QM-FORM-NO-CALZA
  // («no se unen si no calzan uno a uno»), QM-FORM-SIN-SIMPLIFICAR, QM-ION-SIGNO (el metal gana), QM-ION-OCTETO (gana 8 −
  // grupo), QM-ION-UNO, QM-TRANSF-UNO (cuenta un solo átomo), QM-TRANSF-ATOMOS (cuenta átomos), QM-TRANSF-SUMA (suma las
  // cargas), EN1 (moléculas en el sólido), QM-CONDUCE-IONICO. Todas hipótesis salvo EN1.
  const val = s => M.elemento(s).valencia;
  const qIon = s => (el(s).metal ? val(s) : val(s) - 8);
  const cargaSup = q => `${Math.abs(q) === 1 ? '' : sup(Math.abs(q))}${q > 0 ? '⁺' : '⁻'}`;
  const ionTxt = s => `${s}${cargaSup(qIon(s))}`;
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  // Fórmula del compuesto: los subíndices que dan carga total cero, simplificados.
  function formula(m, x) {
    const qm = qIon(m), qx = -qIon(x), g = mcd(qm, qx), a = qx / g, b = qm / g;
    return { a, b, qm, qx, texto: `${m}${sub(a)}${x}${sub(b)}`, transfiere: a * qm };
  }
  const atomoL = s => ({ s, puntos: val(s) });
  const ionL = s => ({ s, corchetes: true, carga: cargaSup(qIon(s)), puntos: el(s).metal ? 0 : 8 });
  const coef = k => (k > 1 ? [String(k)] : []);
  function filasCompuesto(m, x, conIones = true) {
    const F = formula(m, x), fila1 = [...coef(F.a), atomoL(m), '+', ...coef(F.b), atomoL(x)];
    const fila2 = ['→', ...coef(F.a), ionL(m), ...coef(F.b), ionL(x)];
    return { filas: conIones ? [fila1, fila2] : [fila1], transfiere: [[0, F.a > 1 ? 1 : 0, fila1.length - 1]], F };
  }
  const simb = (filas, o) => ({ pieza: 'quim-enlace', datos: Object.assign({ vista: 'simbolos', filas }, o), estado: {} });
  const NOBLE = { 2: 'helio', 10: 'neón', 18: 'argón', 36: 'kriptón', 54: 'xenón' };
  const grupoTxt = s => { const g = M.elemento(s).grupo, R = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 15: 'VA', 16: 'VIA', 17: 'VIIA' }; return `grupo ${g} (${R[g]})`; };
  const lugarTxt = s => `${nombre(s).charAt(0).toUpperCase()}${nombre(s).slice(1)} (${s}): ${grupoTxt(s)}, ${val(s)} electrón${val(s) > 1 ? 'es' : ''} de valencia`;
  const D2 = { cero: 'Carga total de un compuesto iónico = 0', octeto: 'Gas noble: 8 electrones en su último nivel (el helio, 2)' };
  const METALES_I = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'], NO_METALES_I = ['F', 'Cl', 'Br', 'I', 'O', 'S', 'N'];
  // Pares de «Ahora tú» (sin el Mg con N de la predicción) y los de «Así se resuelve», en listas distintas.
  const PARES_I = METALES_I.flatMap(m => NO_METALES_I.map(x => [m, x])).filter(([m, x]) => !(m === 'Mg' && x === 'N') && !(m === 'Na' && x === 'N'));
  const PARES_IR = [['Na', 'S'], ['Ca', 'Cl'], ['Al', 'F'], ['K', 'O'], ['Mg', 'Br'], ['Li', 'N'], ['Al', 'O'], ['Ca', 'S']];
  const PARES_IA = PARES_I.filter(([m, x]) => !PARES_IR.some(([a, b]) => a === m && b === x));
  function casoCarga(r) {
    const s = r.de([...METALES_I, 'F', 'Cl', 'Br', 'O', 'S', 'N']), q = qIon(s), v = val(s), met = el(s).metal;
    const t = q2 => `${s}${cargaSup(q2)}`;
    return {
      pregunta: `¿Qué ion forma el ${nombre(s)} al unirse con ${met ? 'un no metal' : 'un metal'}?`,
      datos: [lugarTxt(s), D2.octeto],
      opciones: ops(t(q), [t(-q), 'QM-ION-SIGNO', met ? 'Bien la cantidad. Pero un metal entrega electrones: queda positivo.' : 'Bien la cantidad. Pero un no metal recibe electrones: queda negativo.'],
        [met ? t(v - 8) : t(v), 'QM-ION-OCTETO', met ? `Bien buscar el 8. Pero entregar ${v} es más fácil que recibir ${8 - v}.` : `Bien mirar sus ${v}. Pero recibir ${8 - v} es más fácil que entregar ${v}.`],
        [Math.abs(q) === 1 ? t(2 * q) : t(Math.sign(q)), 'QM-ION-UNO', `Bien el signo. Pero cambian ${Math.abs(q)} electrón${Math.abs(q) > 1 ? 'es' : ''}: ${met ? 'los de valencia' : 'los que le faltan para 8'}.`]),
      solucion: { texto: met ? `Entrega sus ${v} de valencia y queda como el gas noble anterior.` : `Recibe ${8 - v} y completa 8, como el gas noble que le sigue.`,
        ecuacion: [s, ' → ', `${s}`, Cq(cargaSup(q))] },
    };
  }
  function casoFormula(r) {
    const [m, x] = r.de(PARES_IA), F = formula(m, x), fo = (a, b) => `${m}${sub(a)}${x}${sub(b)}`;
    // Candidatos, cada uno con el error que lo produce; se quedan los tres primeros distintos de la correcta.
    const cand = [
      [fo(1, 1), 'QM-FORM-UNO', `Bien juntar los dos. Pero las cargas ${cargaSup(F.qm)} y ${cargaSup(-F.qx)} no se anulan uno a uno.`],
      [fo(F.qm, F.qx), 'QM-FORM-INVERSA', 'Bien usar las cargas. Pero así la carga total no da 0: cada ion lleva la cantidad del otro.'],
      [fo(F.qx, F.qm), 'QM-FORM-SIN-SIMPLIFICAR', 'Bien la proporción. Pero se simplifica: es la misma, en números menores.'],
      [fo(F.b, F.a), 'QM-FORM-INVERSA', 'Así la carga total no da 0: cada ion lleva la cantidad del otro.'],
      [fo(1, 2), 'QM-FORM-CARGA', `Así la carga total no da 0: un ${ionTxt(m)} no alcanza para dos ${ionTxt(x)}.`],
      [fo(2, 1), 'QM-FORM-CARGA', `Así la carga total no da 0: dos ${ionTxt(m)} son demasiados para un ${ionTxt(x)}.`],
      [fo(2 * F.a, 2 * F.b), 'QM-FORM-SIN-SIMPLIFICAR', 'Bien la proporción. Pero se escribe con los números más chicos.'],
    ];
    const vistos = new Set([F.texto]), malas = cand.filter(([t]) => !vistos.has(t) && vistos.add(t)).slice(0, 3);
    return {
      pregunta: `¿Cuál es la fórmula del compuesto iónico que forman el ${nombre(m)} y el ${nombre(x)}?`,
      datos: [`Iones: ${ionTxt(m)} y ${ionTxt(x)}`, D2.cero],
      opciones: ops(F.texto, ...malas),
      solucion: { texto: `${F.a} · (+${F.qm}) + ${F.b} · (−${F.qx}) = 0.`, ecuacion: [Cq(ionTxt(m)), ' y ', Cq(ionTxt(x)), ` → ${F.texto}`] },
    };
  }
  function casoTransfiere(r) {
    const [m, x] = r.de(PARES_IA.filter(([a, b]) => formula(a, b).a > 1)), F = formula(m, x);
    return {
      pregunta: `En el ${F.texto}, ¿cuántos electrones pasan en total del ${nombre(m)} al ${nombre(x)} por cada unidad de la fórmula?`,
      datos: [`Iones: ${ionTxt(m)} y ${ionTxt(x)}`],
      opciones: ops(String(F.transfiere), [String(F.qm), 'QM-TRANSF-UNO', `Bien la carga del ${ionTxt(m)}. Pero la fórmula tiene ${F.a} átomo${F.a > 1 ? 's' : ''} de ${m}.`],
        [String(F.a + F.b), 'QM-TRANSF-ATOMOS', 'Eso cuenta átomos de la fórmula. Se cuentan los electrones que entrega cada metal.'],
        [String(F.qm + F.qx), 'QM-TRANSF-SUMA', 'Eso suma las dos cargas. Los que entrega el metal son los que recibe el no metal.'],
        [String(2 * F.transfiere), 'QM-TRANSF-DOBLE', 'Eso cuenta dos veces: lo que entrega uno es lo que recibe el otro.']),
      solucion: { texto: `Cada ${m} entrega ${F.qm}; hay ${F.a}.`, ecuacion: [`${F.a} · ${F.qm} = `, El(`${F.transfiere} e⁻`)] },
    };
  }
  const AFIRMA_I = [
    ['El KBr sólido está hecho de moléculas.', false, 'es una red de iones K⁺ y Br⁻, sin moléculas'],
    ['El Mg²⁺ tiene tantos electrones como el neón.', true, 'tiene 12 − 2 = 10, como el neón', ['Magnesio: Z = 12; neón: Z = 10']],
    ['Un iónico sólido conduce la corriente.', false, 'sus iones están fijos; conduce fundido o disuelto', [D_PROPS[0]]],
    ['El CaCl₂ tiene dos Cl⁻ por cada Ca²⁺.', true, 'así la carga total da cero', [D2.cero]],
    ['El oxígeno pierde dos electrones al formar su ion.', false, 'recibe dos: queda como O²⁻', ['Oxígeno: grupo 16 (VIA), 6 electrones de valencia']],
    ['Los compuestos iónicos funden a temperatura alta.', true, 'los iones se atraen fuerte en toda la red', [D_PROPS[0]]],
    ['En el Na₂O cada sodio entrega un electrón.', true, 'el sodio tiene un solo electrón de valencia', ['Sodio: grupo 1 (IA), 1 electrón de valencia']],
  ];

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas-a.js): K⁺ · S²⁻ (6 + 2 = 8) · Cl⁻ 8 puntos · Al 3 e⁻ ·
  // Ca²⁺ con 2 Cl⁻ · Na₂O: 2 · (+1) + (−2) = 0 · AlCl₃: (+3) + 3 · (−1) = 0 · Al₂O₃: 2 · 3 = 6 · CaBr₂ · Li₃N: 3 · 1 = 3
  // · CaCl₂ · Al₂S₃: 2 · 3 = 6 = 3 · 2 · MgF₂: Mg²⁺ 12 − 2 = 10, F⁻ 9 + 1 = 10.
  const EJEMPLOS_IONICO = [
    { nivel: 1, titulo: 'El ion del potasio',
      enunciado: '¿Qué ion forma el potasio al unirse con un no metal?',
      datos: [lugarTxt('K'), D2.octeto],
      solucion: [{ texto: 'Le es más fácil entregar su único electrón de valencia que recibir siete: queda con una carga positiva.', ecuacion: ['K → K', Cq('⁺'), ' + ', El('1 e⁻')] }],
      respuesta: [Cq('K⁺')] },
    { nivel: 1, titulo: 'El ion del azufre',
      enunciado: '¿Qué ion forma el azufre al unirse con un metal?',
      datos: [lugarTxt('S'), D2.octeto],
      solucion: [{ texto: 'Tiene 6 de valencia: recibe 2 y completa 8. Queda con dos cargas negativas.', ecuacion: ['S + ', El('2 e⁻'), ' → S', Cq('²⁻')] }],
      respuesta: [Cq('S²⁻')] },
    { nivel: 1, titulo: 'Los puntos del Cl⁻',
      enunciado: 'En el símbolo de Lewis del ion Cl⁻, ¿cuántos puntos van alrededor del cloro?',
      datos: [lugarTxt('Cl'), 'Cada punto: un electrón de valencia'],
      figura: simb([[{ s: 'Cl', corchetes: true, carga: '⁻', oculto: true }]]),
      solucion: [{ texto: 'El cloro tiene 7 y recibió uno.', ecuacion: ['7 + 1 = ', El('8')] }],
      respuesta: [El('8 puntos')] },
    { nivel: 1, titulo: 'Lo que entrega el aluminio',
      enunciado: 'Al formar su ion, ¿cuántos electrones entrega cada átomo de aluminio?',
      datos: [lugarTxt('Al')],
      solucion: [{ texto: 'Entrega sus electrones de valencia y queda como el neón.', ecuacion: ['Al → Al', Cq('³⁺'), ' + ', El('3 e⁻')] }],
      respuesta: [El('3 electrones')] },
    { nivel: 1, titulo: 'Los cloros de un calcio',
      enunciado: 'En el compuesto del calcio con el cloro, ¿cuántos iones Cl⁻ hay por cada ion Ca²⁺?',
      datos: [D2.cero],
      solucion: [{ texto: 'Un Ca²⁺ tiene dos cargas positivas: hacen falta dos cargas negativas.', ecuacion: ['(+2) + 2 · (−1) = 0'] }],
      respuesta: ['2 iones Cl⁻'] },
    { nivel: 2, titulo: 'El sodio con el oxígeno',
      enunciado: '¿Cuál es la fórmula del compuesto iónico del sodio con el oxígeno?',
      datos: [lugarTxt('Na'), lugarTxt('O'), D2.cero],
      solucion: [
        { texto: 'El sodio forma Na⁺ y el oxígeno, O²⁻.', ecuacion: [Cq('Na⁺'), SEP, Cq('O²⁻')] },
        { texto: 'Hacen falta dos Na⁺ para un O²⁻.', ecuacion: ['2 · (+1) + (−2) = 0 → Na₂O'] },
      ],
      respuesta: ['Na₂O'] },
    { nivel: 2, titulo: 'El aluminio con el cloro',
      enunciado: '¿Cuál es la fórmula del compuesto iónico del aluminio con el cloro?',
      datos: [lugarTxt('Al'), lugarTxt('Cl'), D2.cero],
      figura: simb(filasCompuesto('Al', 'Cl', false).filas),
      solucion: [
        { texto: 'El aluminio entrega 3; cada cloro recibe 1.', ecuacion: [Cq('Al³⁺'), SEP, Cq('Cl⁻')] },
        { texto: 'Tres cloros reciben los tres electrones.', ecuacion: ['(+3) + 3 · (−1) = 0 → AlCl₃'] },
      ],
      respuesta: ['AlCl₃'] },
    { nivel: 2, titulo: 'Los electrones del Al₂O₃',
      enunciado: 'En el Al₂O₃, ¿cuántos electrones pasan del aluminio al oxígeno por cada unidad de la fórmula?',
      datos: ['Iones: Al³⁺ y O²⁻'],
      solucion: [
        { texto: 'Hay dos aluminios y cada uno entrega 3.', ecuacion: ['2 · 3 = ', El('6 e⁻')] },
        { texto: 'Lo comprueba el otro lado: tres oxígenos reciben 2 cada uno.', ecuacion: ['3 · 2 = ', El('6 e⁻')] },
      ],
      respuesta: [El('6 electrones')] },
    { nivel: 2, titulo: 'El calcio con el bromo',
      enunciado: 'Escribe la fórmula del compuesto iónico del calcio con el bromo y di cuántos puntos lleva cada ion bromo en su Lewis.',
      datos: [lugarTxt('Ca'), lugarTxt('Br'), D2.cero],
      solucion: [
        { texto: 'Ca²⁺ con Br⁻: hacen falta dos Br⁻.', ecuacion: ['(+2) + 2 · (−1) = 0 → CaBr₂'] },
        { texto: 'Cada bromo tenía 7 y recibió uno.', ecuacion: ['[Br]⁻: 7 + 1 = ', El('8 puntos')] },
      ],
      respuesta: ['CaBr₂; ', El('8 puntos')] },
    { nivel: 2, titulo: 'Por qué funde tan alto',
      enunciado: 'El KCl funde a unos 770 °C; la parafina de una vela, a unos 60 °C. ¿Por qué el KCl necesita tanto más calor?',
      datos: [D_PROPS[0], D_PROPS[2]],
      solucion: [
        { texto: 'En el KCl, cada K⁺ atrae a todos los Cl⁻ que lo rodean y al revés: es una red de iones.' },
        { texto: 'Para fundirlo hay que soltar esa red. La parafina es de moléculas, que se separan con poco calor.' },
      ],
      respuesta: ['Sus iones se atraen fuerte en toda la red'] },
    { nivel: 3, titulo: 'Dos elementos sin nombre',
      enunciado: 'X tiene Z = 20 y Q, Z = 17. Forman un compuesto iónico. ¿Qué afirmación es correcta?',
      alternativas: ['X recibe dos electrones y queda X²⁻.', 'La fórmula es XQ.', 'X forma X²⁺ y la fórmula es XQ₂.', 'La fórmula es X₂Q.', 'Q entrega un electrón y queda Q⁺.'],
      datos: ['Gases nobles: Z = 2, 10, 18 y 36', D2.cero],
      solucion: [
        { texto: 'X está dos después del argón (18): grupo 2, un metal. Q está uno antes del argón: grupo 17.', ecuacion: [Pz('Z = 20'), ': X²⁺', SEP, Pz('Z = 17'), ': Q⁻'] },
        { texto: 'Un X²⁺ pide dos Q⁻.', ecuacion: ['(+2) + 2 · (−1) = 0 → XQ₂'] },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' invierten quién entrega. La ', letra('B'), ' junta uno de cada. La ', letra('D'), ' pone la carga al revés.'] },
      ],
      respuesta: [letra('C'), ', XQ₂'] },
    { nivel: 3, titulo: 'El litio con el nitrógeno',
      enunciado: 'El litio y el nitrógeno forman un compuesto iónico. ¿Cuántos electrones pasan en total por cada unidad de la fórmula?',
      alternativas: ['1', '4', '6', '8', '3'],
      datos: [lugarTxt('Li'), lugarTxt('N'), D2.cero],
      solucion: [
        { texto: 'El litio forma Li⁺ y el nitrógeno, N³⁻: hacen falta tres Li⁺.', ecuacion: ['3 · (+1) + (−3) = 0 → Li₃N'] },
        { texto: 'Tres litios entregan uno cada uno.', ecuacion: ['3 · 1 = ', El('3 e⁻')] },
        { texto: ['La ', letra('A'), ' cuenta un solo litio. La ', letra('B'), ' cuenta los átomos de la fórmula. La ', letra('C'), ' cuenta dos veces lo que pasa.'] },
        { texto: ['La ', letra('D'), ' cuenta los 8 puntos del N³⁻, no los que recibió.'] },
      ],
      respuesta: [letra('E'), ', ', El('3 electrones')] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F) sobre el Al₂S₃. I. Cada aluminio entrega 3 electrones. II. Cada azufre recibe 3 electrones. III. En total pasan 6 electrones por unidad de la fórmula.',
      alternativas: ['VVV', 'VFV', 'FVF', 'VVF', 'FFV'],
      datos: [lugarTxt('Al'), lugarTxt('S')],
      solucion: [
        { texto: 'I es verdadera: el Al tiene 3 de valencia. II es falsa: el azufre recibe 2 y queda S²⁻. III es verdadera.', ecuacion: ['2 · 3 = 3 · 2 = ', El('6 e⁻')] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' creen que el azufre recibe lo mismo que entrega el aluminio.'] },
        { texto: ['La ', letra('C'), ' invierte las tres. La ', letra('E'), ' duda del aluminio, que sí entrega 3.'] },
      ],
      respuesta: [letra('B'), ', VFV'] },
    { nivel: 3, titulo: 'Un sólido iónico',
      enunciado: 'Sobre un compuesto iónico como el CaO, ¿qué afirmación es correcta?',
      alternativas: ['Fundido o disuelto conduce la corriente; sólido, no.', 'Conduce la corriente en estado sólido.', 'Está hecho de moléculas de CaO.',
        'Funde a menos de 100 °C.', 'Sus átomos comparten pares de electrones.'],
      datos: D_PROPS,
      solucion: [
        { texto: 'En el sólido los iones están fijos en la red; fundido o disuelto se mueven y llevan la corriente.' },
        { texto: ['La ', letra('B'), ' le da al iónico lo que es del metal. La ', letra('C'), ' ve moléculas donde hay una red.'] },
        { texto: ['La ', letra('D'), ' olvida que la red se suelta recién con mucho calor. La ', letra('E'), ' lo confunde con un covalente.'] },
      ],
      respuesta: [letra('A'), ', conduce fundido o disuelto'] },
    { nivel: 3, titulo: 'Los iones del MgF₂',
      enunciado: 'En el MgF₂, ¿qué afirmación sobre sus iones es correcta?',
      alternativas: ['El Mg²⁺ tiene 12 electrones.', 'El F⁻ tiene 8 electrones.', 'Los dos iones tienen 18 electrones.', 'Los dos iones tienen 10 electrones, como el neón.', 'El Mg recibe dos electrones de cada F.'],
      datos: ['Protones: magnesio 12, flúor 9; neón: Z = 10', D.carga],
      solucion: [
        { texto: 'Cuento: el Mg²⁺ perdió 2 y el F⁻ ganó 1.', ecuacion: ['Mg²⁺: 12 − 2 = 10', SEP, 'F⁻: 9 + 1 = 10'] },
        { texto: ['La ', letra('A'), ' olvida los que entregó. La ', letra('B'), ' cuenta los 8 de afuera, no todos. La ', letra('C'), ' los toma por el argón.'] },
        { texto: ['La ', letra('E'), ' invierte quién entrega: el metal da sus dos electrones.'] },
      ],
      respuesta: [letra('D'), ', 10 electrones cada uno'] },
  ];

  const ionico = {
    id: 'enlace-ionico',
    titulo: 'Enlace iónico: iones y fórmula',
    pregunta: '¿Por qué la sal es NaCl y no NaCl₂?',
    temas: ['Enlace iónico', 'Regla del octeto'],
    pieza: 'quim-enlace',
    aprendizaje: 'El metal entrega y el no metal recibe electrones hasta quedar como un gas noble; la fórmula junta los iones con carga total cero.',
    actividad: 'Juntar un metal y un no metal y contar cuántos átomos de cada uno hacen falta.',
    lee: {
      tarjetas: [
        { titulo: 'Un grano de sal', texto: 'La sal de mesa se forma con sodio, un metal, y cloro, un no metal. En cada grano hay billones de partículas de los dos, en una proporción fija.',
          pieza: 'quim-enlace', dibujo: OBJ('sal', { nombre: 'Sal en una cuchara' }) },
        { titulo: 'Los gases nobles', texto: 'El neón, el argón y los demás gases nobles casi no reaccionan: tienen 8 electrones en su último nivel (el helio, 2). Al formar iones, muchos átomos quedan con esa misma cantidad.' },
        { titulo: 'Puntos de Lewis', texto: 'Cada punto alrededor de un símbolo es un electrón de valencia: el sodio tiene 1 y el cloro, 7. Un ion va entre corchetes, con su carga arriba a la derecha.',
          pieza: 'quim-enlace', dibujo: simb([[atomoL('Na'), atomoL('Cl')]]) },
        { titulo: 'Qué mirar', texto: 'En el juego eliges un metal y un no metal. Cuenta cuántos electrones entrega cada átomo del metal y cuántos recibe cada átomo del no metal.' },
      ],
    },
    ejemplos: EJEMPLOS_IONICO,
    juega: {
      pieza: 'quim-enlace',
      consigna: 'Cada átomo del metal entrega electrones; cada átomo del no metal los recibe. El juego pone los átomos que hacen falta de cada uno.',
      mision: {
        texto: 'Arma un compuesto con dos átomos del metal por cada tres del no metal.',
        logrado: v => v.a === 'Al' && (v.b === 'O' || v.b === 'S'),
        bien: 'El aluminio entrega 3 y cada átomo del no metal recibe 2: seis y seis.',
      },
      voz: 'Lo que entrega el metal es lo que recibe el no metal.',
      leyenda: [
        { s: El('•'), t: 'un electrón de valencia' },
        { s: '[ ]', t: 'un ion, con su carga arriba' },
        { s: '→', t: 'se forman los iones' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Metal', opciones: ['Na', 'K', 'Mg', 'Ca', 'Al'].map(x => ({ valor: x, texto: x })), inicio: 'Na' },
        { id: 'b', etiqueta: 'No metal', opciones: ['F', 'Cl', 'O', 'S'].map(x => ({ valor: x, texto: x })), inicio: 'Cl' },
      ],
      dibujo: v => { const c = filasCompuesto(v.a, v.b); return simb(c.filas, { transfiere: c.transfiere }); },
      lectura: v => { const F = formula(v.a, v.b); return [Cq(ionTxt(v.a)), ' y ', Cq(ionTxt(v.b)), `: ${F.a} · (+${F.qm}) + ${F.b} · (−${F.qx}) = 0, ${F.texto}`]; },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-enlace',
      pregunta: 'El magnesio forma el ion Mg²⁺ y el nitrógeno, el ion N³⁻. ¿Cuál es la fórmula del compuesto que forman?',
      datos: ['Ion del magnesio: Mg²⁺', 'Ion del nitrógeno: N³⁻'],
      voz: 'Piensa cuántos electrones entrega uno y cuántos pide el otro.',
      opciones: [
        { id: 'c', texto: 'Mg₃N₂', correcta: true },
        { id: 'uno', texto: 'MgN', error: 'QM-FORM-UNO', siFuera: 'Bien juntar los dos. Pero +2 y −3 no se anulan uno a uno.' },
        { id: 'inversa', texto: 'Mg₂N₃', error: 'QM-FORM-INVERSA', siFuera: 'Bien usar las cargas. Pero así da 2 · (+2) + 3 · (−3) = −5, no 0.' },
        { id: 'no-calza', texto: 'Ninguna: no calzan', error: 'QM-FORM-NO-CALZA', siFuera: 'No calzan uno a uno, cierto. Con tres Mg y dos N, sí: seis y seis.' },
      ],
      dibujo: simb([[atomoL('Mg'), '+', atomoL('N'), '→', '?']]),
      revelar: simb(filasCompuesto('Mg', 'N').filas, { transfiere: filasCompuesto('Mg', 'N').transfiere }),
      coincide: 'Coincide: tres Mg entregan 6 electrones y dos N los reciben.',
      noCoincide: 'Es Mg₃N₂: 3 · (+2) + 2 · (−3) = 0.',
    },
    mira: {
      pieza: 'quim-enlace',
      datos: { vista: 'simbolos', filas: [{ fichas: [atomoL('Na'), '+', atomoL('Cl'), '→', ionL('Na'), ionL('Cl')], desde: 1 },
        { fichas: [atomoL('Mg'), '+', '2', atomoL('Cl'), '→', 'MgCl₂'], desde: 3 }], transfiere: [[0, 0, 2], [1, 0, 3]],
        alt: 'El sodio entrega su electrón al cloro y quedan Na⁺ y Cl⁻ entre corchetes; abajo, un magnesio entrega dos electrones a dos cloros: MgCl₂.' },
      voz: 'Sigamos cada electrón que pasa.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El sodio entrega su único electrón de valencia al cloro.', ecuacion: ['Na', El('•'), ' + Cl → Na', Cq('⁺'), ' + Cl', Cq('⁻')] },
        { estado: { corte: 1 }, texto: 'Los dos quedan con 8 afuera, como un gas noble: la regla del octeto.', ecuacion: ['Na⁺: como el neón', SEP, 'Cl⁻: como el argón'] },
        { estado: { corte: 3 }, texto: 'El magnesio entrega dos: hacen falta dos cloros para recibirlos.', ecuacion: ['Mg', Cq('²⁺'), ' + 2 Cl', Cq('⁻'), ' → MgCl₂'] },
        { estado: { corte: 3 }, texto: 'La fórmula junta los iones en la proporción de carga total cero.', ecuacion: ['(+2) + 2 · (−1) = 0'] },
        { estado: { corte: 3 }, texto: 'En el sólido no hay moléculas: la fórmula dice la proporción de la red.' },
        { estado: { corte: 3 }, texto: 'Por eso funde alto, se quiebra y conduce solo fundido o disuelto.' },
      ],
    },
    regla: {
      texto: 'El metal entrega sus electrones de valencia y el no metal recibe los que le faltan para 8: quedan como un gas noble. La fórmula da carga total cero.',
      ecuacion: ['metal: ', El('pierde sus e⁻ de valencia'), SEP, 'no metal: ', El('gana hasta 8'), SEP, 'carga total = 0'],
      condicion: 'metales de los grupos 1, 2 y 13 con no metales de los grupos 15, 16 y 17.',
      voz: 'Cuenta lo que entrega y lo que recibe: deben ser iguales.',
      dibujo: simb(filasCompuesto('Al', 'O').filas, { transfiere: filasCompuesto('Al', 'O').transfiere }),
    },
    resuelve: {
      pieza: 'quim-enlace',
      generar(s) {
        const [m, x] = PARES_IR[s % PARES_IR.length], F = formula(m, x), c = filasCompuesto(m, x, false);
        return {
          enunciado: `¿Cuál es la fórmula del compuesto iónico que forman el ${nombre(m)} y el ${nombre(x)}?`,
          datos: [lugarTxt(m), lugarTxt(x), D2.cero],
          dibujo: simb([[atomoL(m), '+', atomoL(x)]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden la fórmula: cuántos iones de cada uno hacen carga total cero.' },
            { tipo: 'datos', texto: `El ${nombre(m)} tiene ${F.qm} de valencia; al ${nombre(x)} le faltan ${F.qx} para llegar a 8.` },
            { tipo: 'regla', texto: 'El metal entrega sus electrones de valencia y el no metal recibe los que le faltan. La fórmula da carga total cero.' },
            { tipo: 'cuentas', texto: `Los iones son ${ionTxt(m)} y ${ionTxt(x)}.`, ecuacion: [`${F.a} · (+${F.qm}) + ${F.b} · (−${F.qx}) = 0 → ${F.texto}`],
              dibujo: simb(c.filas, { transfiere: c.transfiere }) },
            { tipo: 'sentido', texto: `Lo que entregan los ${m} (${F.transfiere}) es lo que reciben los ${x} (${F.b} · ${F.qx}).` },
          ],
          respuesta: [F.texto],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-enlace',
      voz: 'Cuenta lo que entrega el metal y lo que recibe el no metal.',
      generar(sem) {
        const r = azar(sem * 73 + 5), tipo = sem % 4;
        if (tipo === 3) return vfDe(r, AFIRMA_I, [D2.cero]);
        return [casoCarga, casoFormula, casoTransfiere][tipo](r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): estructuras de Lewis y octeto ----------
  // Propuesta A3. Objeto de la primera pantalla: el aire por la ventana, moléculas de N₂ y O₂ (quim-enlace, de prueba).
  // Cambia: la molécula · Permanece: los electrones de valencia que se reparten, en rayas y pares libres · Progresa: de
  // enlaces simples (H₂, HCl, H₂O) a dobles (O₂, CO₂) · Se reserva: el triple enlace (Predice: el N₂), que no sale en el
  // juego · Debe verse: que rayas y pares libres suman los electrones de valencia.
  // Errores: QM-N2-DOBLE (trampa de San Marcos 2025-II n.º 93), QM-OCTETO-FALTA, QM-SIN-ENLACE, EN4 (no contar la carga o
  // contar enlaces), QM-NVAL-SIGNO (la carga al revés), QM-LIBRES-TODOS (todos los pares del central como libres),
  // QM-LIBRES-ELECTRONES (electrones como pares), QM-ORDEN-SIMPLE (todo enlace es simple), QM-ELEMENTO-COMPUESTO (el O₂
  // como compuesto; San Marcos 2024-I n.º 87).
  const At = (id, t, x, y) => ({ id, t, x, y });
  const Bo = (a, b, orden = 1) => ({ a, b, orden });
  const Pa = (en, ...angs) => angs.map(ang => ({ en, ang, color: 'f' }));
  // Estructuras de Lewis dibujadas: átomos, enlaces y pares libres; la cuenta se comprueba contra los electrones de valencia.
  const LEWIS = {
    H2: { t: 'H₂', atomos: [At('a', 'H', -0.6, 0), At('b', 'H', 0.6, 0)], enlaces: [Bo('a', 'b')], pares: [] },
    Cl2: { t: 'Cl₂', atomos: [At('a', 'Cl', -0.75, 0), At('b', 'Cl', 0.75, 0)], enlaces: [Bo('a', 'b')], pares: [...Pa('a', 180, -90, 90), ...Pa('b', 0, -90, 90)] },
    HCl: { t: 'HCl', atomos: [At('a', 'H', -0.75, 0), At('b', 'Cl', 0.75, 0)], enlaces: [Bo('a', 'b')], pares: Pa('b', 0, -90, 90) },
    H2O: { t: 'H₂O', atomos: [At('o', 'O', 0, 0), At('h1', 'H', -0.95, 0.7), At('h2', 'H', 0.95, 0.7)], enlaces: [Bo('o', 'h1'), Bo('o', 'h2')], pares: Pa('o', -135, -45) },
    NH3: { t: 'NH₃', atomos: [At('n', 'N', 0, 0), At('h1', 'H', -1, 0.6), At('h2', 'H', 1, 0.6), At('h3', 'H', 0, 1.15)], enlaces: [Bo('n', 'h1'), Bo('n', 'h2'), Bo('n', 'h3')], pares: Pa('n', -90) },
    CH4: { t: 'CH₄', atomos: [At('c', 'C', 0, 0), At('h1', 'H', 0, -1.1), At('h2', 'H', 0, 1.1), At('h3', 'H', -1.1, 0), At('h4', 'H', 1.1, 0)],
      enlaces: [Bo('c', 'h1'), Bo('c', 'h2'), Bo('c', 'h3'), Bo('c', 'h4')], pares: [] },
    O2: { t: 'O₂', atomos: [At('a', 'O', -0.65, 0), At('b', 'O', 0.65, 0)], enlaces: [Bo('a', 'b', 2)], pares: [...Pa('a', 135, -135), ...Pa('b', 45, -45)] },
    CO2: { t: 'CO₂', atomos: [At('o1', 'O', -1.25, 0), At('c', 'C', 0, 0), At('o2', 'O', 1.25, 0)], enlaces: [Bo('o1', 'c', 2), Bo('c', 'o2', 2)], pares: [...Pa('o1', 135, -135), ...Pa('o2', 45, -45)] },
    N2: { t: 'N₂', atomos: [At('a', 'N', -0.65, 0), At('b', 'N', 0.65, 0)], enlaces: [Bo('a', 'b', 3)], pares: [...Pa('a', 180), ...Pa('b', 0)] },
    HCN: { t: 'HCN', atomos: [At('h', 'H', -1.25, 0), At('c', 'C', 0, 0), At('n', 'N', 1.25, 0)], enlaces: [Bo('h', 'c'), Bo('c', 'n', 3)], pares: Pa('n', 0) },
    CH2O: { t: 'CH₂O', atomos: [At('c', 'C', 0, 0), At('o', 'O', 0, -1.2), At('h1', 'H', -1, 0.7), At('h2', 'H', 1, 0.7)], enlaces: [Bo('c', 'o', 2), Bo('c', 'h1'), Bo('c', 'h2')], pares: Pa('o', -135, -45) },
  };
  const valTotal = k => LEWIS[k].atomos.reduce((a, x) => a + val(x.t), 0);
  const compartidos = k => LEWIS[k].enlaces.reduce((a, e) => a + e.orden, 0);
  const libres = k => LEWIS[k].pares.length;
  for (const k of Object.keys(LEWIS)) if (2 * compartidos(k) + 2 * libres(k) !== valTotal(k)) throw new Error(`Lewis ${k}: no cuadra la cuenta`);
  const lewisDib = (k, o = {}) => ({ pieza: 'quim-molecula', datos: Object.assign({ atomos: LEWIS[k].atomos, enlaces: LEWIS[k].enlaces, pares: LEWIS[k].pares, escala: 62, alto: 170,
    alt: `Estructura de Lewis del ${LEWIS[k].t}: ${compartidos(k)} par${compartidos(k) > 1 ? 'es' : ''} compartido${compartidos(k) > 1 ? 's' : ''} y ${libres(k)} par${libres(k) === 1 ? '' : 'es'} libre${libres(k) === 1 ? '' : 's'}.` }, o), estado: {} });
  const JUEGO_L = ['H2', 'Cl2', 'HCl', 'H2O', 'NH3', 'CH4', 'O2', 'CO2'];
  const MAX_LIBRES = Math.max(...JUEGO_L.map(libres));
  const enlTxt = n => `${n} enlace${n > 1 ? 's' : ''}`;
  const pTxt = n => (n === 0 ? 'ningún par libre' : `${n} par${n > 1 ? 'es' : ''} libre${n > 1 ? 's' : ''}`);
  const D3 = { enlace: 'Cada raya: un par compartido (2 electrones)', par: 'Cada par libre: 2 electrones', meta: 'Octeto: 8 electrones alrededor de cada átomo (el H, 2)', carga: 'Electrones a repartir = suma de los de valencia − carga del ion' };
  const valTxt = ss => `Electrones de valencia: ${[...new Set(ss)].map(s => `${s} ${val(s)}`).join('; ')}`;
  // Especies para contar electrones a repartir: [texto, átomos, carga].
  const ESPECIES_A = [['NH₄⁺', ['N', 'H', 'H', 'H', 'H'], 1], ['H₃O⁺', ['O', 'H', 'H', 'H'], 1], ['OH⁻', ['O', 'H'], -1], ['CN⁻', ['C', 'N'], -1], ['NO₃⁻', ['N', 'O', 'O', 'O'], -1],
    ['PO₄³⁻', ['P', 'O', 'O', 'O', 'O'], -3], ['ClO₄⁻', ['Cl', 'O', 'O', 'O', 'O'], -1], ['CCl₄', ['C', 'Cl', 'Cl', 'Cl', 'Cl'], 0], ['NF₃', ['N', 'F', 'F', 'F'], 0], ['H₂S', ['H', 'H', 'S'], 0],
    ['SO₃²⁻', ['S', 'O', 'O', 'O'], -2], ['NO₂⁻', ['N', 'O', 'O'], -1]];
  const ESPECIES_R = [['CO₃²⁻', ['C', 'O', 'O', 'O'], -2], ['PCl₃', ['P', 'Cl', 'Cl', 'Cl'], 0], ['NH₂⁻', ['N', 'H', 'H'], -1], ['SO₄²⁻', ['S', 'O', 'O', 'O', 'O'], -2], ['CH₂O', ['C', 'H', 'H', 'O'], 0], ['BH₄⁻', ['B', 'H', 'H', 'H', 'H'], -1]];
  const sumaVal = ats => ats.reduce((a, s) => a + val(s), 0);
  const qTxt = q => (q === 0 ? 'sin carga' : `carga ${q > 0 ? '+' : '−'}${Math.abs(q)}`);
  function casoElectrones3(r) {
    const [t, ats, q] = r.de(ESPECIES_A), n = sumaVal(ats) - q;
    return {
      pregunta: `¿Cuántos electrones hay que repartir en la estructura de Lewis del ${t}?`,
      datos: [valTxt(ats), D3.carga],
      opciones: ops(String(n), q ? [String(sumaVal(ats)), 'EN4', 'Bien sumar los de valencia. Pero falta la carga del ion.'] : [String(ats.length - 1), 'EN4', 'Eso cuenta enlaces. Se reparten electrones.'],
        q ? [String(sumaVal(ats) + q), 'QM-NVAL-SIGNO', q > 0 ? 'Bien usar la carga. Pero un catión perdió electrones: se resta.' : 'Bien usar la carga. Pero un anión ganó electrones: se suman.'] : [String(8 * ats.filter(s => s !== 'H').length + 2 * ats.filter(s => s === 'H').length), 'QM-NVAL-OCTETOS', 'Eso suma los octetos. Se reparten los de valencia.'],
        [String(ats.length), 'EN4', 'Eso cuenta átomos. Cada átomo aporta sus electrones de valencia.'],
        [String(n / 2), 'QM-LIBRES-ELECTRONES', 'Eso cuenta pares. Se piden electrones.']),
      solucion: { texto: q ? `Sumo los de valencia y ${q > 0 ? 'resto' : 'sumo'} la carga.` : 'Sumo los de valencia de todos los átomos.', ecuacion: [`${sumaVal(ats)}${q ? ` ${q > 0 ? '−' : '+'} ${Math.abs(q)}` : ''} = `, El(`${n} e⁻`)] },
    };
  }
  // Pares libres del átomo central (molécula neutra con octeto, del motor de plantillas/enlace).
  const CENTRALES_A = ['H2S', 'PCl3', 'NF3', 'SCl2', 'CCl4', 'NH3', 'CH4'], CENTRALES_R = ['H2O', 'PH3', 'OF2', 'SiH4'];
  const especie = k => ({ H2S: { central: 'S', ligandos: ['H', 'H'] }, PH3: { central: 'P', ligandos: ['H', 'H', 'H'] }, OF2: { central: 'O', ligandos: ['F', 'F'] },
    SiH4: { central: 'Si', ligandos: ['H', 'H', 'H', 'H'] } }[k] || k);
  const textoK = k => M.lewis(especie(k)).formula;
  function casoLibresCentral(r) {
    const k = r.de(CENTRALES_A), L = M.lewis(especie(k)), c = L.central, lig = L.ligandos.length;
    return {
      pregunta: `En la estructura de Lewis del ${L.formula}, ¿cuántos pares libres tiene el átomo central, el ${c}?`,
      datos: [valTxt([c, ...L.ligandos.map(x => x.simbolo)]), D3.enlace, D3.meta],
      opciones: ops(String(L.paresLibres), [String(4), 'QM-LIBRES-TODOS', `Bien la meta de 8. Pero ${lig} de sus 4 pares se comparten.`],
        [String(val(c) - lig), 'QM-LIBRES-ELECTRONES', `Eso cuenta electrones sueltos, no pares: los ${val(c) - lig} van de a dos.`],
        [String(L.paresLibres + lig), 'QM-LIBRES-TODOS', 'Eso suma también los pares de los enlaces.'], [String(L.paresLibres + 1), 'QM-LIBRES-UNO', 'Sobra uno: cuenta de nuevo los 8.']),
      solucion: { texto: `El ${c} pone ${lig} electrones en ${lig} enlaces; le quedan ${val(c) - lig}, en pares.`, ecuacion: [`(${val(c)} − ${lig}) ÷ 2 = `, El(`${L.paresLibres} pares libres`)] },
    };
  }
  // El enlace entre dos átomos (simple, doble o triple), sin el N₂ de la predicción.
  const ORDEN_A = [['O2', 'a', 'b', 'los dos oxígenos del O₂'], ['CO2', 'c', 'o1', 'el carbono y un oxígeno del CO₂'], ['HCN', 'c', 'n', 'el carbono y el nitrógeno del HCN'],
    ['CH2O', 'c', 'o', 'el carbono y el oxígeno del CH₂O'], ['Cl2', 'a', 'b', 'los dos cloros del Cl₂'], ['HCl', 'a', 'b', 'el hidrógeno y el cloro del HCl'], ['HCN', 'h', 'c', 'el hidrógeno y el carbono del HCN']];
  const ORDEN_TXT = { 1: 'Simple: un par compartido', 2: 'Doble: dos pares compartidos', 3: 'Triple: tres pares compartidos' };
  function casoOrden(r) {
    const [k, a, b, quien] = r.de(ORDEN_A), o = LEWIS[k].enlaces.find(e => (e.a === a && e.b === b) || (e.a === b && e.b === a)).orden;
    const ats = LEWIS[k].atomos.map(x => x.t);
    return {
      pregunta: `¿Cómo es el enlace entre ${quien}?`,
      datos: [valTxt(ats), D3.meta],
      opciones: ops(ORDEN_TXT[o], ...[1, 2, 3].filter(x => x !== o).map(x => [ORDEN_TXT[x], x < o ? 'QM-OCTETO-FALTA' : 'QM-OCTETO-SOBRA', x < o ? 'Bien unirlos. Pero así a alguno le faltan electrones para su octeto.' : 'Bien buscar el octeto. Pero así alguno pasa de 8.']),
        ['Iónico: un átomo le entrega electrones al otro', 'EN5', 'Entregar sería con un metal. Aquí solo hay no metales.']),
      solucion: { texto: `Con ${enlTxt(compartidos(k))} entre todos y ${pTxt(libres(k))}, cada átomo llega a su meta.`, ecuacion: [`${LEWIS[k].t}: ${2 * compartidos(k)} + ${2 * libres(k)} = `, El(`${valTotal(k)} e⁻`)] },
    };
  }
  function casoPares(r) {
    const k = r.de(['HCN', 'CH2O', 'CO2', 'O2', 'Cl2', 'NH3']), c = compartidos(k), l = libres(k), tot = valTotal(k) / 2;
    const tx = (a, b) => `${a} compartido${a > 1 ? 's' : ''} y ${b} libre${b === 1 ? '' : 's'}`;
    return {
      pregunta: `En la estructura de Lewis del ${LEWIS[k].t}, ¿cuántos pares compartidos y cuántos pares libres hay en total?`,
      datos: [valTxt(LEWIS[k].atomos.map(x => x.t)), D3.enlace, D3.meta],
      opciones: ops(tx(c, l), [tx(LEWIS[k].enlaces.length, tot - LEWIS[k].enlaces.length), 'QM-ORDEN-SIMPLE', 'Bien contar las uniones. Pero un enlace doble o triple comparte más de un par.'],
        [tx(c, 2 * l), 'QM-LIBRES-ELECTRONES', 'Bien los compartidos. Pero contaste electrones libres, no pares.'], [tx(l, c), 'QM-PARES-INVERSO', 'Tiene esos números, pero al revés.'],
        [tx(c, tot), 'QM-PARES-TOTAL', 'Bien los compartidos. Pero los libres son los que sobran, no todos.']),
      solucion: { texto: `${valTotal(k)} electrones son ${tot} pares: ${c} en los enlaces y el resto libres.`, ecuacion: [`${tot} − ${c} = `, El(`${l} pares libres`)] },
    };
  }
  const AFIRMA_L = [
    ['El O₂ es un compuesto.', false, 'tiene un solo elemento'],
    ['El CO₂ tiene dos enlaces dobles.', true, 'así todos llegan a 8'],
    ['En el H₂O, el oxígeno tiene dos pares libres.', true, 'le quedan 4 de sus 6 electrones'],
    ['En el HCl hay dos pares compartidos.', false, 'hay uno solo, H–Cl'],
    ['El hidrógeno queda con 8 electrones en el H₂.', false, 'su meta es 2, como el helio'],
    ['El NH₃ tiene ocho electrones de valencia.', true, '5 del N y 1 de cada H'],
  ];
  const D_AFIRMA_L = [valTxt(['H', 'C', 'N', 'O', 'Cl']), D3.meta];

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas-a.js): H₂O 6 + 2 = 8 · NH₄⁺ 5 + 4 − 1 = 8 · HCl 7 − 1 = 6,
  // 3 pares · CO₃²⁻ 4 + 18 + 2 = 24 · O₂ 12 = 2 · 2 + 4 · 2 · H₂S (6 − 2) ÷ 2 = 2 · CH₂O 12 = 4 · 2 + 2 · 2 · CN⁻ 4 + 5 + 1 =
  // 10 · NH₃ 3 y 1 · N₂ 10 = 3 · 2 + 2 · 2; O₂ 12 · HCN 10 = 4 · 2 + 1 · 2 · PH₃ (5 − 3) ÷ 2 = 1; H₂S 2 · SO₄²⁻ 6 + 24 + 2 = 32.
  const EJEMPLOS_LEWIS = [
    { nivel: 1, titulo: 'Los electrones del agua',
      enunciado: '¿Cuántos electrones de valencia hay que repartir en la estructura de Lewis del H₂O?',
      datos: [valTxt(['H', 'O'])],
      solucion: [{ texto: 'Sumo los del oxígeno y los de los dos hidrógenos.', ecuacion: ['6 + 2 · 1 = ', El('8 e⁻')] }],
      respuesta: [El('8 electrones')] },
    { nivel: 1, titulo: 'Un catión de cinco átomos',
      enunciado: '¿Cuántos electrones hay que repartir en la estructura de Lewis del ion NH₄⁺?',
      datos: [valTxt(['N', 'H']), D3.carga],
      solucion: [{ texto: 'Sumo los de valencia y resto 1: el catión perdió un electrón.', ecuacion: ['5 + 4 · 1 − 1 = ', El('8 e⁻')] }],
      respuesta: [El('8 electrones')] },
    { nivel: 1, titulo: 'Los pares del cloro',
      enunciado: 'En la estructura de Lewis del HCl, ¿cuántos pares libres tiene el cloro?',
      datos: [valTxt(['H', 'Cl']), D3.enlace],
      figura: lewisDib('HCl', { pares: [], textos: [{ x: 0.75, y: -0.75, t: '?' }] }),
      solucion: [{ texto: 'El cloro pone 1 de sus 7 en el enlace; le quedan 6, que son 3 pares.', ecuacion: ['(7 − 1) ÷ 2 = ', El('3 pares libres')] }],
      respuesta: [El('3 pares libres')] },
    { nivel: 1, titulo: 'Lo que comparte un doble',
      enunciado: '¿Cuántos electrones comparten dos átomos unidos por un enlace doble?',
      datos: [D3.enlace],
      solucion: [{ texto: 'Un enlace doble son dos rayas: dos pares compartidos.', ecuacion: ['2 · 2 = ', El('4 e⁻')] }],
      respuesta: [El('4 electrones')] },
    { nivel: 1, titulo: 'El ion de la tiza',
      enunciado: '¿Cuántos electrones hay que repartir en la estructura de Lewis del ion CO₃²⁻?',
      datos: [valTxt(['C', 'O']), D3.carga],
      solucion: [{ texto: 'Sumo los de valencia y 2 más: el anión ganó dos electrones.', ecuacion: ['4 + 3 · 6 + 2 = ', El('24 e⁻')] }],
      respuesta: [El('24 electrones')] },
    { nivel: 2, titulo: 'El oxígeno que respiras',
      enunciado: '¿Cómo es la estructura de Lewis del O₂? Di el tipo de enlace y cuántos pares libres tiene cada oxígeno.',
      datos: [valTxt(['O']), D3.enlace, D3.meta],
      solucion: [
        { texto: 'Hay 12 electrones. Con un enlace simple, a cada O le faltarían 2 para su octeto: comparten un par más.' },
        { texto: 'Con un enlace doble, cada O tiene 4 compartidos y 2 pares libres: 8.', ecuacion: ['2 · 2 + 4 · 2 = ', El('12 e⁻')] },
      ],
      respuesta: ['Enlace doble; ', El('2 pares libres'), ' en cada O'] },
    { nivel: 2, titulo: 'El gas de los huevos podridos',
      enunciado: 'En el H₂S, ¿cuántos pares libres tiene el azufre, que es el átomo central?',
      datos: [valTxt(['H', 'S']), D3.enlace, D3.meta],
      solucion: [
        { texto: 'El azufre forma un enlace con cada hidrógeno: usa 2 de sus 6.' },
        { texto: 'Le quedan 4, en pares.', ecuacion: ['(6 − 2) ÷ 2 = ', El('2 pares libres')] },
      ],
      respuesta: [El('2 pares libres')] },
    { nivel: 2, titulo: 'Un doble en el CH₂O',
      enunciado: 'En el CH₂O, el carbono está al centro, unido a dos H y a un O. ¿Qué enlace hay entre el C y el O, y cuántos pares libres tiene el O?',
      datos: [valTxt(['H', 'C', 'O']), D3.meta],
      solucion: [
        { texto: 'Hay 12 electrones. Con tres enlaces simples, al carbono le faltan 2: el O comparte un par más.', ecuacion: ['4 + 2 · 1 + 6 = 12'] },
        { texto: 'C=O doble; el oxígeno queda con 4 compartidos y 2 pares libres.' },
      ],
      respuesta: ['Doble; ', El('2 pares libres')] },
    { nivel: 2, titulo: 'Un anión de dos átomos',
      enunciado: 'El ion CN⁻ tiene un carbono y un nitrógeno. ¿Cuántos electrones reparte y cómo es su enlace?',
      datos: [valTxt(['C', 'N']), D3.carga, D3.meta],
      solucion: [
        { texto: 'Sumo y agrego 1 por la carga.', ecuacion: ['4 + 5 + 1 = ', El('10 e⁻')] },
        { texto: 'Con un triple enlace (6) y un par libre en cada átomo (4), los dos llegan a 8.' },
      ],
      respuesta: [El('10 electrones'), '; enlace triple'] },
    { nivel: 2, titulo: 'Los pares del amoníaco',
      enunciado: 'En la estructura de Lewis del NH₃, ¿cuántos pares compartidos y cuántos pares libres hay?',
      datos: [valTxt(['N', 'H']), D3.enlace],
      solucion: [
        { texto: 'Hay 8 electrones: 4 pares.', ecuacion: ['5 + 3 · 1 = 8'] },
        { texto: 'Tres pares van en los enlaces N–H; el que sobra es libre, en el nitrógeno.' },
      ],
      respuesta: ['3 compartidos y ', El('1 libre')] },
    { nivel: 3, titulo: 'Los dos gases del aire',
      enunciado: 'Sobre el N₂ y el O₂ del aire, ¿qué afirmación es correcta?',
      alternativas: ['Los dos tienen un enlace doble.', 'El N₂ tiene un enlace doble y el O₂, uno triple.', 'Los dos son compuestos.',
        'El O₂ tiene cuatro pares libres en cada átomo.', 'El N₂ tiene un enlace triple y el O₂, uno doble.'],
      datos: [valTxt(['N', 'O']), D3.meta],
      solucion: [
        { texto: 'N₂: 10 electrones; con un triple (6) y un par libre en cada N, los dos llegan a 8.' },
        { texto: 'O₂: 12 electrones; con un doble y dos pares libres en cada O.' },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' le dan al N₂ un doble: así cada N quedaría con 6 y un par de más.'] },
        { texto: ['La ', letra('C'), ' olvida que tienen un solo elemento. La ', letra('D'), ' cuenta electrones, no pares: son 2 pares por O.'] },
      ],
      respuesta: [letra('E'), ', triple en el N₂ y doble en el O₂'] },
    { nivel: 3, titulo: 'La estructura del HCN',
      enunciado: 'En el HCN, el carbono está al centro. ¿Qué afirmación sobre su estructura de Lewis es correcta?',
      alternativas: ['Tiene un enlace triple C≡N y un par libre en el nitrógeno.', 'Tiene dos enlaces dobles.', 'El carbono tiene dos pares libres.',
        'Reparte 12 electrones.', 'Tiene un enlace triple H≡C.'],
      datos: [valTxt(['H', 'C', 'N']), D3.meta],
      solucion: [
        { texto: 'Hay 1 + 4 + 5 = 10 electrones. H–C usa 2; C≡N usa 6 y queda un par libre en el N.', ecuacion: ['2 + 6 + 2 = ', El('10 e⁻')] },
        { texto: ['La ', letra('B'), ' pondría un doble con el H, que solo admite 2. La ', letra('C'), ' deja al C con 10.'] },
        { texto: ['La ', letra('D'), ' suma mal: son 10. La ', letra('E'), ' le da al hidrógeno 6 compartidos.'] },
      ],
      respuesta: [letra('A'), ', triple C≡N'] },
    { nivel: 3, titulo: 'Dos moléculas con hidrógeno',
      enunciado: 'En el PH₃ y el H₂S, ¿cuántos pares libres tiene el átomo central de cada uno?',
      alternativas: ['0 y 0', '1 y 1', '2 y 1', '1 y 2', '3 y 2'],
      datos: [valTxt(['H', 'P', 'S']), D3.enlace, D3.meta],
      solucion: [
        { texto: 'El P pone 3 de sus 5 en enlaces; el S, 2 de sus 6.', ecuacion: ['P: (5 − 3) ÷ 2 = 1', SEP, 'S: (6 − 2) ÷ 2 = 2'] },
        { texto: ['La ', letra('A'), ' cree que estas moléculas no tienen pares libres. La ', letra('B'), ' le da al S los mismos que al P.'] },
        { texto: ['La ', letra('C'), ' los invierte. La ', letra('E'), ' cuenta electrones del P, no pares, y acierta en el S por casualidad.'] },
      ],
      respuesta: [letra('D'), ', 1 y 2'] },
    { nivel: 3, titulo: 'Un anión de cinco átomos',
      enunciado: '¿Cuántos electrones hay que repartir en la estructura de Lewis del ion SO₄²⁻?',
      alternativas: ['30', '24', '32', '34', '28'],
      datos: [valTxt(['S', 'O']), D3.carga],
      solucion: [
        { texto: 'Sumo los de valencia: el azufre y los cuatro oxígenos tienen 6 cada uno. El anión ganó dos.', ecuacion: ['6 + 4 · 6 + 2 = ', El('32 e⁻')] },
        { texto: ['La ', letra('A'), ' olvida la carga. La ', letra('B'), ' cuenta solo los cuatro oxígenos. La ', letra('D'), ' suma la carga dos veces.'] },
        { texto: ['La ', letra('E'), ' resta la carga, como si fuera un catión.'] },
      ],
      respuesta: [letra('C'), ', ', El('32 electrones')] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. El O₂ es un compuesto. II. El CO₂ tiene dos enlaces dobles. III. En el H₂O, el oxígeno tiene dos pares libres.',
      alternativas: ['VVV', 'FVV', 'FVF', 'VFV', 'FFV'],
      datos: D_AFIRMA_L,
      solucion: [
        { texto: 'I es falsa: el O₂ tiene un solo elemento. II es verdadera: O=C=O. III es verdadera: le quedan 4 electrones.', ecuacion: ['FVV'] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' llaman compuesto al O₂. La ', letra('C'), ' olvida los pares del oxígeno.'] },
        { texto: ['La ', letra('E'), ' le pone enlaces simples al CO₂, que dejarían al C con 4.'] },
      ],
      respuesta: [letra('B'), ', FVV'] },
  ];

  const lewisIdea = {
    id: 'lewis-octeto',
    titulo: 'Estructuras de Lewis y octeto',
    pregunta: '¿Cómo se reparten los electrones en una molécula?',
    temas: ['Enlace covalente y estructuras de Lewis', 'Regla del octeto'],
    pieza: 'quim-molecula',
    aprendizaje: 'Se suman los electrones de valencia con la carga; se ponen enlaces y pares libres hasta el octeto y, si faltan, enlaces dobles o triples.',
    actividad: 'Revisar dónde quedó cada electrón de valencia en ocho moléculas.',
    lee: {
      tarjetas: [
        { titulo: 'El aire de la ventana', texto: 'De cada 100 partículas del aire, unas 78 son de nitrógeno y unas 21 de oxígeno. Cada una es una molécula de dos átomos iguales: N₂ u O₂.',
          pieza: 'quim-enlace', dibujo: OBJ('ventana', { nombre: 'El aire: moléculas de dos átomos' }) },
        { titulo: 'Una cuenta dibujada', texto: 'Una estructura de Lewis reparte los electrones de valencia de todos los átomos: cada raya es un par compartido y cada par de puntos, un par libre.' },
        { titulo: 'La meta de ocho', texto: 'Como en los iones, los átomos que comparten quedan con 8 electrones alrededor, contando los compartidos. El hidrógeno se conforma con 2.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges una molécula. Cuenta sus electrones de valencia y busca dónde quedó cada uno: en las rayas o en los pares libres.' },
      ],
    },
    ejemplos: EJEMPLOS_LEWIS,
    juega: {
      pieza: 'quim-molecula',
      consigna: 'Cada raya es un par compartido y cada par de puntos, un par libre. Revisa que los electrones de valencia estén todos.',
      mision: {
        texto: 'Busca la molécula del juego con más pares libres en total.',
        logrado: v => libres(v.k) === MAX_LIBRES,
        bien: 'El Cl₂: un solo par compartido y seis pares libres, tres en cada cloro.',
      },
      voz: 'Las rayas y los puntos suman todos los electrones de valencia.',
      leyenda: [
        { s: '—', t: 'enlace: un par compartido' },
        { s: '=', t: 'enlace doble: dos pares compartidos' },
        { s: El('••'), t: 'un par libre' },
      ],
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: JUEGO_L.map(k => ({ valor: k, texto: LEWIS[k].t })), inicio: 'H2O' }],
      dibujo: v => lewisDib(v.k),
      lectura: v => [`${LEWIS[v.k].t}: `, El(`${valTotal(v.k)} e⁻`), ` = ${enlTxt(compartidos(v.k))} (${2 * compartidos(v.k)}) + ${pTxt(libres(v.k))} (${2 * libres(v.k)})`],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'En el N₂ del aire, cada nitrógeno aporta 5 electrones de valencia. ¿Cómo quedan unidos los dos átomos?',
      datos: ['Nitrógeno: 5 electrones de valencia', 'Octeto: 8 electrones alrededor de cada átomo'],
      voz: 'Cuenta cuántos tiene cada N alrededor en cada caso.',
      opciones: [
        { id: 'c', texto: 'Con un enlace triple y un par libre en cada N', correcta: true },
        { id: 'doble', texto: 'Con un enlace doble y dos pares libres en cada N', error: 'QM-N2-DOBLE', siFuera: 'Bien buscar un enlace múltiple. Pero así se usan 12 electrones, y solo hay 10.' },
        { id: 'simple', texto: 'Con un enlace simple y tres pares libres en cada N', error: 'QM-OCTETO-FALTA', siFuera: 'Bien un par compartido. Pero son 14 electrones; con 10, a cada N le faltan.' },
        { id: 'no', texto: 'No se unen: cada N ya tiene sus electrones', error: 'QM-SIN-ENLACE', siFuera: 'Cada N tiene 5, no 8: le faltan 3. Compartiendo los consigue.' },
      ],
      dibujo: { pieza: 'quim-molecula', datos: { atomos: LEWIS.N2.atomos, enlaces: [], pares: [], textos: [{ x: 0, y: -0.2, t: '?' }], escala: 62, alto: 170,
        alt: 'Dos átomos de nitrógeno, todavía sin enlace dibujado: cómo se unen es lo que se pregunta.' }, estado: {} },
      revelar: lewisDib('N2'),
      coincide: 'Coincide: N≡N usa 6 y los dos pares libres, 4: son los 10.',
      noCoincide: 'Es N≡N, con un par libre en cada N: 6 + 4 = 10 electrones.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: { atomos: LEWIS.CO2.atomos,
        enlaces: [{ a: 'o1', b: 'c', orden: 1, desde: 2, hasta: 3 }, { a: 'c', b: 'o2', orden: 1, desde: 2, hasta: 3 }, { a: 'o1', b: 'c', orden: 2, desde: 4 }, { a: 'c', b: 'o2', orden: 2, desde: 4 }],
        pares: [...Pa('o1', 90, 180, -90).map(p => Object.assign(p, { desde: 3, hasta: 3 })), ...Pa('o2', 90, 0, -90).map(p => Object.assign(p, { desde: 3, hasta: 3 })),
          ...Pa('o1', 135, -135).map(p => Object.assign(p, { desde: 4 })), ...Pa('o2', 45, -45).map(p => Object.assign(p, { desde: 4 }))],
        escala: 62, alto: 170, alt: 'Lewis del CO₂ paso a paso: dos enlaces simples, después los pares libres y al final dos enlaces dobles O=C=O.' },
      voz: 'Llevemos la cuenta de electrones en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'CO₂: el carbono aporta 4 y cada oxígeno, 6.', ecuacion: [El('4 + 6 + 6 = 16 e⁻')] },
        { estado: { corte: 2 }, texto: 'Un enlace simple con cada oxígeno usa 4 electrones.', ecuacion: ['16 − 4 = 12 por repartir'] },
        { estado: { corte: 3 }, texto: 'Los 12 van como pares en los oxígenos; el carbono queda con 4.', ecuacion: ['O: 8', SEP, 'C: 4, le faltan 4'] },
        { estado: { corte: 4 }, texto: 'Cada oxígeno comparte un par más: dos dobles, y todos con 8.', ecuacion: ['O=C=O: 4 · 2 + 4 · 2 = 16'] },
        { estado: { corte: 4 }, texto: 'Si faltan más, se comparte un tercer par: enlace triple, como en el HCN.' },
      ],
    },
    regla: {
      texto: 'Suma los electrones de valencia, con la carga del ion. Pon un enlace a cada átomo y completa octetos con pares libres; si faltan, forma enlaces dobles o triples.',
      ecuacion: [El('electrones a repartir'), ' = valencia − carga', SEP, 'cada raya: ', El('2 e⁻'), SEP, 'H: 2; los demás: 8'],
      condicion: 'en la mayoría de las moléculas con átomos del periodo 2; las excepciones vienen en la idea siguiente.',
      voz: 'Primero contar, después dibujar.',
      dibujo: lewisDib('CO2'),
    },
    resuelve: {
      pieza: 'quim-molecula',
      generar(s) {
        const k = CENTRALES_R[s % CENTRALES_R.length], L = M.lewis(especie(k)), c = L.central, lig = L.ligandos.length, ats = [c, ...L.ligandos.map(x => x.simbolo)];
        return {
          enunciado: `En la estructura de Lewis del ${L.formula}, ¿cuántos electrones se reparten y cuántos pares libres tiene el átomo central, el ${c}?`,
          datos: [valTxt(ats), D3.enlace, D3.meta],
          pasos: [
            { tipo: 'pide', texto: `Piden dos números: los electrones de valencia del ${L.formula} y los pares libres del ${c}.` },
            { tipo: 'datos', texto: `El ${c} está al centro, unido a ${lig} átomos; tiene ${val(c)} electrones de valencia.` },
            { tipo: 'regla', texto: 'Sumo los de valencia. Cada enlace usa uno del central; lo que le queda va en pares libres.' },
            { tipo: 'cuentas', texto: `${ats.map(val).join(' + ')} = ${L.electrones}. El ${c} usa ${lig} y le quedan ${val(c) - lig}.`, ecuacion: [El(`${L.electrones} e⁻`), SEP, `(${val(c)} − ${lig}) ÷ 2 = `, El(`${L.paresLibres}`)] },
            { tipo: 'sentido', texto: `El ${c} queda con ${2 * lig} compartidos y ${2 * L.paresLibres} libres: ${2 * lig + 2 * L.paresLibres}, su octeto.` },
          ],
          respuesta: [El(`${L.electrones} electrones`), `; ${pTxt(L.paresLibres)} en el ${c}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Cuenta primero; las rayas y los puntos vienen después.',
      generar(sem) {
        const r = azar(sem * 61 + 13), tipo = sem % 5;
        if (tipo === 4) return vfDe(r, AFIRMA_L, D_AFIRMA_L);
        return [casoElectrones3, casoLibresCentral, casoOrden, casoPares][tipo](r);
      },
    },
  };

  // ---------- Idea 4 (nueva, 19 nov): enlace dativo y excepciones al octeto ----------
  // Propuesta A4. Objeto de la primera pantalla: un frasco de limpiador con amoníaco (quim-enlace, de prueba).
  // Cambia: la especie · Permanece: la cuenta de electrones alrededor del átomo central · Progresa: de 4 y 6 (Be, B) a 8,
  // a 10 y 12 (P, S) y al impar (NO) · Se reserva: el enlace dativo (Predice: el NH₄⁺), que no sale en el juego · Debe
  // verse: cuántos electrones rodean al átomo central en cada caso.
  // Errores: QM-DATIVO-UNO (cada uno pone uno), EN3 (el octeto como ley), QM-DATIVO-QUITA, QM-CENTRAL-OCHO (siempre 8),
  // QM-CENTRAL-ENLACES (cuenta enlaces, no electrones), QM-CENTRAL-SIN-LIBRES (olvida los pares libres del central),
  // QM-RADICAL-ION (llama radical a un ion; San Marcos 2025-II n.º 96), QM-EXPANDE-N (el N expande su octeto), QM-DATIVO-ACEPTA
  // (el que recibe pone el par).
  const HAL = new Set(['F', 'Cl', 'Br', 'I']);
  // Estructura radial: el central al medio, los ligandos alrededor; cada halógeno con sus tres pares hacia afuera.
  function radial(k, o = {}) {
    const L = M.lewis(k), n = L.ligandos.length, R = n > 4 ? 1.3 : 1.2, a0 = n === 2 ? 180 : -90;
    const atomos = [{ id: 'c', t: L.central, x: 0, y: 0 }], enlaces = [], pares = [];
    L.ligandos.forEach((l, i) => {
      const ang = a0 + 360 * i / n, rad = ang * Math.PI / 180, id = `l${i}`;
      atomos.push({ id, t: l.simbolo, x: Math.round(R * Math.cos(rad) * 100) / 100, y: Math.round(R * Math.sin(rad) * 100) / 100 });
      enlaces.push({ a: 'c', b: id, orden: l.orden, color: o.dativo === i ? 'f' : undefined });
      if (HAL.has(l.simbolo)) for (const da of [0, -75, 75]) pares.push({ en: id, ang: ang + da, color: 'f' });
    });
    const huecos = L.paresLibres ? (n === 3 ? [90] : n === 4 ? [] : n === 2 ? [-90, 90] : []) : [];
    for (const ang of huecos.slice(0, L.paresLibres)) pares.push({ en: 'c', ang, color: 'f' });
    return { pieza: 'quim-molecula', datos: { atomos, enlaces, pares, escala: n > 4 ? 46 : 54, alto: n > 4 ? 210 : 180,
      alt: o.alt || `Estructura de Lewis del ${L.formula}: el ${L.central} al centro con ${n} enlaces${L.paresLibres ? ` y ${pTxt(L.paresLibres)}` : ''}; lo rodean ${L.electronesCentral} electrones.` }, estado: {} };
  }
  // El NO: N=O, el N con un par libre y un electrón sin pareja; el O con dos pares.
  const NO_DIB = { pieza: 'quim-molecula', datos: { atomos: [At('n', 'N', -0.65, 0), At('o', 'O', 0.65, 0)], enlaces: [Bo('n', 'o', 2)], pares: [...Pa('n', 150), ...Pa('o', 45, -45)],
    textos: [{ x: -1.0, y: -0.42, t: '•', color: 'f', peso: 700 }], escala: 62, alto: 170,
    alt: 'Estructura de Lewis del NO: un enlace doble; el nitrógeno con un par libre y un electrón sin pareja; el oxígeno con dos pares libres.' }, estado: {} };
  const JUEGO_X = ['BeCl2', 'BF3', 'NH3', 'PCl5', 'SF6', 'NO'];
  const alrededor = k => (k === 'NO' ? 7 : M.lewis(k).electronesCentral);
  const formulaX = k => (k === 'NO' ? 'NO' : M.lewis(k).formula);
  const centralX = k => (k === 'NO' ? 'N' : M.lewis(k).central);
  const LEE_X = k => { const e = alrededor(k), c = centralX(k); return k === 'NO' ? 'NO: 11 electrones; al N le queda uno sin pareja.' : `${formulaX(k)}: el ${c} queda con ${e} electrones, ${e < 8 ? 'menos de 8' : e > 8 ? 'más de 8' : 'su octeto'}.`; };
  const D4 = { cuenta: 'Alrededor del central: 2 por cada enlace simple + 2 por cada par libre suyo', dativo: 'Enlace dativo: un solo átomo pone los dos electrones del par', expande: 'Solo los átomos del periodo 3 en adelante pueden tener más de 8' };
  const AROUND_A = ['BeCl2', 'BF3', 'BCl3', 'PCl5', 'SF6', 'SF4', 'ClF3', 'XeF4', 'BrF5', 'ICl4^-'], AROUND_R = ['AlCl3', 'XeF2', 'I3^-', 'PCl3'];
  function casoAlrededor(r) {
    const k = r.de(AROUND_A), L = M.lewis(k), n = L.ligandos.length, e = L.electronesCentral;
    return {
      pregunta: `En la estructura de Lewis del ${L.formula}, ¿cuántos electrones rodean al átomo central, el ${L.central}?`,
      datos: [valTxt([L.central, ...L.ligandos.map(x => x.simbolo)]), D3.carga, D4.cuenta],
      opciones: ops(String(e), [String(8), 'QM-CENTRAL-OCHO', `Bien la idea del octeto. Pero el ${L.central} ${e < 8 ? 'no llega' : 'pasa'}: cuenta sus enlaces y pares.`],
        [String(n), 'QM-CENTRAL-ENLACES', 'Eso cuenta enlaces. Cada enlace son 2 electrones.'],
        [String(2 * n), L.paresLibres ? 'QM-CENTRAL-SIN-LIBRES' : 'QM-CENTRAL-ENLACES', L.paresLibres ? `Bien los enlaces. Pero el ${L.central} tiene además ${pTxt(L.paresLibres)}.` : 'Bien contar de a dos. Revisa cuántos enlaces son.'],
        [String(e + 2), 'QM-CENTRAL-UNO', 'Sobran dos: revisa los pares libres del central.']),
      solucion: { texto: `${n} enlaces${L.paresLibres ? ` y ${pTxt(L.paresLibres)}` : ''} alrededor del ${L.central}.`, ecuacion: [`2 · ${n}${L.paresLibres ? ` + 2 · ${L.paresLibres}` : ''} = `, El(`${e} e⁻`)] },
    };
  }
  const CLASE_X = { incompleto: 'Octeto incompleto: menos de 8', completo: 'Cumple el octeto: 8', expandido: 'Octeto expandido: más de 8', impar: 'Impar: un electrón sin pareja' };
  const CLASIF_A = ['BeCl2', 'BF3', 'BCl3', 'PCl5', 'SF6', 'XeF4', 'NH3', 'H2O', 'CH4', 'PCl3', 'NO2', 'ClO2'];
  const IMPARES = { NO2: ['NO₂', ['N', 'O', 'O']], ClO2: ['ClO₂', ['Cl', 'O', 'O']], NO: ['NO', ['N', 'O']] };
  function casoClase(r) {
    const k = r.de(CLASIF_A), imp = IMPARES[k], t = imp ? 'impar' : M.lewis(k).octeto, fo = imp ? imp[0] : M.lewis(k).formula;
    const ats = imp ? imp[1] : [M.lewis(k).central, ...M.lewis(k).ligandos.map(x => x.simbolo)];
    const SI = { incompleto: ['QM-CENTRAL-OCHO', 'Sería así si el central quedara con menos de 8.'], completo: ['EN3', 'Sería así si el central quedara con 8 justos.'],
      expandido: ['QM-EXPANDE-N', 'Sería así si el central pasara de 8.'], impar: ['QM-RADICAL-ION', 'Sería así con un número impar de electrones.'] };
    return {
      pregunta: `¿Cómo queda el octeto del átomo central en el ${fo}?`,
      datos: [valTxt(ats), D4.cuenta, D4.expande],
      opciones: ops(CLASE_X[t], ...Object.keys(CLASE_X).filter(x => x !== t).map(x => [CLASE_X[x], SI[x][0], `Bien revisar el central. ${SI[x][1]}`])),
      solucion: { texto: imp ? `${ats.map(val).join(' + ')} = ${sumaVal(ats)}: impar, uno queda sin pareja.` : `El ${M.lewis(k).central} queda con ${M.lewis(k).electronesCentral} electrones.`,
        ecuacion: [`${fo}: ${CLASE_X[t].split(':')[0].toLowerCase()}`] },
    };
  }
  // Quién pone el par del enlace dativo.
  const DATIVOS = [['NH₄⁺', 'N', 'el NH₃ recibe un H⁺', ['N', 'H']], ['H₃O⁺', 'O', 'el H₂O recibe un H⁺', ['O', 'H']], ['BF₄⁻', 'F', 'el BF₃ recibe un F⁻', ['B', 'F']],
    ['H₃N–BF₃', 'N', 'el NH₃ se une al BF₃', ['N', 'B']], ['AlCl₄⁻', 'Cl', 'el AlCl₃ recibe un Cl⁻', ['Al', 'Cl']]];
  function casoDativo(r) {
    const [fo, pone, como, dos] = r.de(DATIVOS), otro = dos.find(x => x !== pone);
    return {
      pregunta: `El ${fo} se forma cuando ${como}. ¿Qué átomo pone los dos electrones del enlace dativo?`,
      datos: [D4.dativo, D3.meta],
      opciones: ops(`El ${nombre(pone)}`, [`El ${nombre(otro)}`, 'QM-DATIVO-ACEPTA', `El ${nombre(otro)} recibe el par. Lo pone el que tiene un par libre.`],
        ['Cada uno pone un electrón', 'QM-DATIVO-UNO', 'Así es un enlace común. En el dativo, un solo átomo pone el par.'],
        ['Ninguno: es un enlace iónico', 'EN5', 'Comparten un par, cierto: es covalente, aunque lo ponga uno solo.']),
      solucion: { texto: `El ${nombre(pone)} tiene un par libre y lo comparte entero.`, ecuacion: [`${pone} → ${otro}`] },
    };
  }
  // Radicales: número impar de electrones de valencia.
  const ESPECIES_RAD = [['NO', ['N', 'O'], 0], ['NO₂', ['N', 'O', 'O'], 0], ['OH', ['O', 'H'], 0], ['ClO₂', ['Cl', 'O', 'O'], 0], ['OH⁻', ['O', 'H'], -1], ['H₂O₂', ['H', 'H', 'O', 'O'], 0],
    ['O₂²⁻', ['O', 'O'], -2], ['HO₂⁻', ['H', 'O', 'O'], -1], ['NO₂⁻', ['N', 'O', 'O'], -1], ['NO⁺', ['N', 'O'], 1], ['CN⁻', ['C', 'N'], -1], ['H₂O', ['H', 'H', 'O'], 0]];
  const nE = x => sumaVal(x[1]) - x[2];
  function casoRadical(r) {
    const rad = r.de(ESPECIES_RAD.filter(x => nE(x) % 2)), no = r.baraja(ESPECIES_RAD.filter(x => nE(x) % 2 === 0)).slice(0, 3);
    const ats = [...new Set([...rad[1], ...no.flatMap(x => x[1])])];
    return {
      pregunta: `¿Cuál de estas especies es un radical libre: ${r.baraja([rad, ...no]).map(x => x[0]).join(', ')}?`,
      datos: [valTxt(ats), D3.carga, 'Radical libre: especie con un electrón sin pareja'],
      opciones: ops(rad[0], ...no.map(x => [x[0], x[2] ? 'QM-RADICAL-ION' : 'QM-RADICAL-PAR', `${x[0]}: ${nE(x)} electrones, número par. ${x[2] ? 'Tener carga no la hace radical.' : 'Todos tienen pareja.'}`])),
      solucion: { texto: `${rad[0]}: ${rad[1].map(val).join(' + ')} = ${nE(rad)}, impar: uno queda sin pareja.`, ecuacion: [El(`${nE(rad)} e⁻`), ': impar'] },
    };
  }
  const AFIRMA_X = [
    ['En el BF₃, el boro queda con 6 electrones.', true, 'tres enlaces y ningún par libre'],
    ['El nitrógeno puede tener 10 electrones alrededor.', false, 'es del periodo 2: no pasa de 8'],
    ['En el SF₆, el azufre tiene 12 electrones alrededor.', true, 'seis enlaces de 2 electrones'],
    ['El NO tiene un electrón sin pareja.', true, 'tiene 5 + 6 = 11 electrones'],
    ['El OH⁻ es un radical libre.', false, 'tiene 6 + 1 + 1 = 8, todos en pares'],
    ['En el NH₄⁺ hay un enlace dativo.', true, 'el N pone su par libre para el H⁺'],
  ];
  const D_AFIRMA_X = [valTxt(['H', 'B', 'N', 'O', 'F', 'S']), D4.cuenta, D4.expande];

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas-a.js): BF₃ 2 · 3 = 6 · SF₆ 2 · 6 = 12 · NO 5 + 6 = 11 · BeCl₂
  // 2 · 2 = 4 · NH₄⁺ 1 dativo · PCl₅ 2 · 5 = 10, (5 − 5) ÷ 2 = 0 · H₃O⁺ el O · NO₂ 5 + 12 = 17 · XeF₂ 2 · 2 + 2 · 3 = 10 ·
  // SF₄ (6 − 4) ÷ 2 = 1, ClF₃ (7 − 3) ÷ 2 = 2, XeF₄ (8 − 4) ÷ 2 = 2 · OH 6 + 1 = 7 · H₃N–BF₃: el N.
  const EJEMPLOS_EXC = [
    { nivel: 1, titulo: 'El boro se queda corto',
      enunciado: 'En el BF₃, el boro forma un enlace simple con cada flúor y no tiene pares libres. ¿Cuántos electrones lo rodean?',
      datos: [D4.cuenta],
      solucion: [{ texto: 'Tres enlaces, de 2 electrones cada uno.', ecuacion: ['2 · 3 = ', El('6 e⁻'), ': menos de 8'] }],
      respuesta: [El('6 electrones')] },
    { nivel: 1, titulo: 'El azufre con seis flúor',
      enunciado: 'En el SF₆, el azufre forma un enlace simple con cada flúor y no tiene pares libres. ¿Cuántos electrones lo rodean?',
      datos: [D4.cuenta, D4.expande],
      figura: radial('SF6', { alt: 'Estructura de Lewis del SF₆: el azufre al centro con seis enlaces a flúor; cada flúor con tres pares libres.' }),
      solucion: [{ texto: 'Seis enlaces, de 2 electrones cada uno: más de 8, porque el azufre es del periodo 3.', ecuacion: ['2 · 6 = ', El('12 e⁻')] }],
      respuesta: [El('12 electrones')] },
    { nivel: 1, titulo: 'Un gas del escape',
      enunciado: 'El NO sale del escape de los autos. ¿Tiene un electrón sin pareja?',
      datos: [valTxt(['N', 'O'])],
      solucion: [{ texto: 'Sumo sus electrones de valencia: un número impar no se puede repartir todo en pares.', ecuacion: ['5 + 6 = ', El('11'), ': impar'] }],
      respuesta: ['Sí: es un radical libre'] },
    { nivel: 1, titulo: 'El berilio con dos cloros',
      enunciado: 'En el BeCl₂, el berilio forma un enlace simple con cada cloro y no tiene pares libres. ¿Cuántos electrones lo rodean?',
      datos: [D4.cuenta],
      solucion: [{ texto: 'Dos enlaces, de 2 electrones cada uno.', ecuacion: ['2 · 2 = ', El('4 e⁻'), ': menos de 8'] }],
      respuesta: [El('4 electrones')] },
    { nivel: 1, titulo: 'Los enlaces del NH₄⁺',
      enunciado: 'El NH₄⁺ se forma cuando el NH₃ recibe un H⁺, que no trae electrones. ¿Cuántos de sus cuatro enlaces son dativos?',
      datos: [D4.dativo],
      solucion: [{ texto: 'Los tres N–H del NH₃ ya estaban. El cuarto lo forma el par libre del N, que lo pone entero.' }],
      respuesta: ['Uno'] },
    { nivel: 2, titulo: 'El fósforo con cinco cloros',
      enunciado: 'En el PCl₅, el fósforo está unido a cinco cloros. ¿Cuántos electrones lo rodean y cuántos pares libres tiene?',
      datos: [valTxt(['P', 'Cl']), D4.cuenta, D4.expande],
      solucion: [
        { texto: 'El P pone sus 5 electrones en cinco enlaces: no le queda ninguno.', ecuacion: ['(5 − 5) ÷ 2 = ', El('0 pares libres')] },
        { texto: 'Cinco enlaces de 2 electrones.', ecuacion: ['2 · 5 = ', El('10 e⁻')] },
      ],
      respuesta: [El('10 electrones'), '; ningún par libre'] },
    { nivel: 2, titulo: 'El ion del agua ácida',
      enunciado: 'El H₃O⁺ se forma cuando el H₂O recibe un H⁺. ¿Qué átomo pone los dos electrones del enlace nuevo y cuántos pares libres le quedan?',
      datos: [D4.dativo, valTxt(['O', 'H'])],
      solucion: [
        { texto: 'El oxígeno del agua tiene dos pares libres y presta uno entero al H⁺: es un enlace dativo.' },
        { texto: 'Le queda un par libre.', ecuacion: ['2 − 1 = ', El('1 par libre')] },
      ],
      respuesta: ['El oxígeno; le queda ', El('1 par libre')] },
    { nivel: 2, titulo: 'El gas café de la ciudad',
      enunciado: 'El NO₂ es un gas café del aire contaminado. ¿Es un radical libre?',
      datos: [valTxt(['N', 'O']), 'Radical libre: especie con un electrón sin pareja'],
      solucion: [
        { texto: 'Sumo los electrones de valencia.', ecuacion: ['5 + 2 · 6 = ', El('17')] },
        { texto: 'Diecisiete es impar: al repartirlos en pares, uno queda solo.' },
      ],
      respuesta: ['Sí: 17 electrones, impar'] },
    { nivel: 2, titulo: 'El xenón también se une',
      enunciado: 'En el XeF₂, el xenón forma un enlace con cada flúor y tiene 3 pares libres. ¿Cuántos electrones lo rodean?',
      datos: [D4.cuenta, D4.expande],
      solucion: [
        { texto: 'Dos enlaces y tres pares libres.', ecuacion: ['2 · 2 + 2 · 3 = ', El('10 e⁻')] },
        { texto: 'Un gas noble del periodo 5 que forma enlaces: el octeto no es una ley.' },
      ],
      respuesta: [El('10 electrones')] },
    { nivel: 2, titulo: 'Tres moléculas, tres casos',
      enunciado: 'Indica si el átomo central cumple el octeto, queda con menos o con más de 8 en el BF₃, el NH₃ y el PCl₅.',
      datos: [valTxt(['B', 'N', 'P', 'F', 'H', 'Cl']), D4.cuenta],
      solucion: [
        { texto: 'BF₃: tres enlaces, 6. NH₃: tres enlaces y un par libre, 8. PCl₅: cinco enlaces, 10.', ecuacion: ['6', SEP, '8', SEP, '10'] },
      ],
      respuesta: ['Menos de 8, cumple y más de 8'] },
    { nivel: 3, titulo: 'Pares libres con más de ocho',
      enunciado: '¿Cuántos pares libres tiene el átomo central en el SF₄, el ClF₃ y el XeF₄, en ese orden?',
      alternativas: ['0, 0 y 0', '2, 1 y 2', '1, 1 y 1', '1, 2 y 2', '2, 2 y 4'],
      datos: [valTxt(['S', 'Cl', 'Xe', 'F']), D4.expande],
      solucion: [
        { texto: 'Cada central pone un electrón en cada enlace; lo que le queda, en pares.', ecuacion: ['S: (6 − 4) ÷ 2 = 1', SEP, 'Cl: (7 − 3) ÷ 2 = 2', SEP, 'Xe: (8 − 4) ÷ 2 = 2'] },
        { texto: ['La ', letra('A'), ' cree que con más de 8 no quedan pares. La ', letra('B'), ' cambia el azufre y el cloro.'] },
        { texto: ['La ', letra('C'), ' supone un par para todos. La ', letra('E'), ' cuenta electrones, no pares, en el xenón.'] },
      ],
      respuesta: [letra('D'), ', 1, 2 y 2'] },
    { nivel: 3, titulo: 'Un radical en la lista',
      enunciado: '¿Cuál de estas especies tiene un electrón sin pareja: OH⁻, HO₂⁻, OH, H₂O₂ o H₂O?',
      alternativas: ['OH⁻', 'OH', 'HO₂⁻', 'H₂O₂', 'H₂O'],
      datos: [valTxt(['H', 'O']), D3.carga],
      solucion: [
        { texto: 'Cuento los electrones de valencia de cada una.', ecuacion: ['OH: 6 + 1 = 7', SEP, 'OH⁻: 8', SEP, 'HO₂⁻: 14', SEP, 'H₂O₂: 14', SEP, 'H₂O: 8'] },
        { texto: ['Solo el OH tiene un número impar. La ', letra('A'), ' y la ', letra('C'), ' son iones con todos sus electrones en pares.'] },
        { texto: ['La ', letra('D'), ' y la ', letra('E'), ' tienen 14 y 8: números pares.'] },
      ],
      respuesta: [letra('B'), ', el OH'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F) sobre el NH₄⁺. I. Tiene un enlace dativo. II. Su enlace dativo es más largo que los otros. III. El nitrógeno queda con 8 electrones alrededor.',
      alternativas: ['VVV', 'FVF', 'VVF', 'FFV', 'VFV'],
      datos: [D4.dativo, D4.cuenta],
      solucion: [
        { texto: 'I es verdadera. II es falsa: ya formado, es igual a los otros tres. III es verdadera: cuatro enlaces, 8.', ecuacion: ['VFV'] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' creen que el dativo se distingue después. La ', letra('B'), ' niega el dativo y el octeto.'] },
        { texto: ['La ', letra('D'), ' niega el dativo: el cuarto par lo puso el nitrógeno.'] },
      ],
      respuesta: [letra('E'), ', VFV'] },
    { nivel: 3, titulo: 'El amoníaco y el boro',
      enunciado: 'El NH₃ y el BF₃ se unen y forman H₃N–BF₃. ¿Qué afirmación es correcta?',
      alternativas: ['El N pone su par libre y el B completa su octeto.', 'El B pone un par y el N lo recibe.', 'Cada uno pone un electrón del enlace nuevo.', 'El enlace nuevo es iónico.', 'El B queda con 10 electrones.'],
      datos: [D4.dativo, valTxt(['N', 'B']), D4.cuenta],
      solucion: [
        { texto: 'El N del NH₃ tiene un par libre; al B del BF₃ le faltan 2 para 8. El N lo pone entero.', ecuacion: ['N → B: B con 6 + 2 = ', El('8 e⁻')] },
        { texto: ['La ', letra('B'), ' invierte quién pone el par: el B no tiene pares libres. La ', letra('C'), ' lo trata como un enlace común.'] },
        { texto: ['La ', letra('D'), ' olvida que se comparte el par. La ', letra('E'), ' suma de más: el B llega justo a 8.'] },
      ],
      respuesta: [letra('A'), ', el N pone su par'] },
    { nivel: 3, titulo: 'Quién no se expande',
      enunciado: '¿Cuál de estos átomos no puede quedar con más de 8 electrones alrededor: P, S, N, Cl o Xe?',
      alternativas: ['P', 'S', 'N', 'Cl', 'Xe'],
      datos: [D4.expande, 'Periodo de cada uno: N, 2; P, S y Cl, 3; Xe, 5'],
      solucion: [
        { texto: 'El nitrógeno es del periodo 2: alrededor de él caben solo 8.' },
        { texto: ['La ', letra('A'), ' (PCl₅), la ', letra('B'), ' (SF₆), la ', letra('D'), ' (ClF₃) y la ', letra('E'), ' (XeF₄) pasan de 8 en los ejemplos.'] },
      ],
      respuesta: [letra('C'), ', el nitrógeno'] },
  ];

  const excepciones = {
    id: 'dativo-excepciones',
    titulo: 'Enlace dativo y excepciones al octeto',
    pregunta: '¿Todos los átomos quedan con ocho electrones?',
    temas: ['Enlace dativo y excepciones al octeto'],
    pieza: 'quim-molecula',
    aprendizaje: 'En el enlace dativo un átomo pone el par. El boro queda con 6, el azufre puede pasar de 8; lo impar es radical.',
    actividad: 'Contar los electrones que rodean al átomo central en seis especies.',
    lee: {
      tarjetas: [
        { titulo: 'El limpiador', texto: 'Muchos limpiadores de vidrios llevan amoníaco, NH₃, disuelto en agua. Ahí, parte del NH₃ recibe un ion H⁺ y se forma el ion NH₄⁺.',
          pieza: 'quim-enlace', dibujo: OBJ('limpiador', { nombre: 'Limpiador con amoníaco' }) },
        { titulo: 'No siempre ocho', texto: 'La regla del octeto es una guía. El berilio y el boro se quedan con menos de 8; el fósforo y el azufre, del periodo 3, pueden tener más.' },
        { titulo: 'Un número impar', texto: 'Si una especie tiene un número impar de electrones de valencia, uno queda sin pareja. Esas especies se llaman radicales libres y reaccionan rápido.' },
        { titulo: 'Qué mirar', texto: 'En el juego cuenta los electrones que rodean al átomo central: 2 por cada raya que lo toca y 2 por cada par libre suyo.' },
      ],
    },
    ejemplos: EJEMPLOS_EXC,
    juega: {
      pieza: 'quim-molecula',
      consigna: 'Alrededor del átomo central no siempre quedan 8 electrones. Recorre las seis especies y cuenta los de cada una.',
      mision: {
        texto: 'Encuentra la especie que tiene un electrón sin pareja.',
        logrado: v => v.k === 'NO',
        bien: 'El NO: 5 + 6 = 11 electrones; uno no puede quedar en un par.',
      },
      voz: 'Cuenta 2 por cada raya del central y 2 por cada par suyo.',
      leyenda: [
        { s: '—', t: 'un par compartido' },
        { s: El('••'), t: 'un par libre' },
        { s: El('•'), t: 'un electrón sin pareja' },
      ],
      controles: [{ id: 'k', etiqueta: 'Especie', opciones: JUEGO_X.map(k => ({ valor: k, texto: formulaX(k) })), inicio: 'NH3' }],
      dibujo: v => (v.k === 'NO' ? NO_DIB : radial(v.k)),
      lectura: v => [LEE_X(v.k)],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'En el limpiador, el NH₃ recibe un H⁺ y se forma el NH₄⁺: el par libre del N queda como un cuarto enlace, un enlace dativo. Ya formado el ion, ¿cómo son sus cuatro enlaces N–H?',
      datos: ['NH₄⁺: el N unido a cuatro H', 'El H⁺ no trae electrones'],
      voz: 'Piensa si un enlace recuerda de dónde salió su par.',
      opciones: [
        { id: 'c', texto: 'Iguales los cuatro: no se sabe cuál fue el dativo', correcta: true },
        { id: 'distinto', texto: 'Tres iguales y uno distinto, el dativo', error: 'QM-DATIVO-DISTINTO', siFuera: 'Fue distinto al formarse, cierto. Después, los cuatro pares se comparten igual.' },
        { id: 'ionico', texto: 'El dativo es iónico, porque el H⁺ tenía carga', error: 'QM-DATIVO-IONICO', siFuera: 'El H⁺ traía carga, cierto. Pero el par se comparte: es covalente.' },
        { id: 'debil', texto: 'El dativo es más débil: lo armó un solo átomo', error: 'QM-DATIVO-DEBIL', siFuera: 'Lo armó uno solo, cierto. Pero un par compartido une igual, venga de donde venga.' },
      ],
      dibujo: { pieza: 'quim-molecula', datos: { atomos: [At('n', 'N', 0, 0), At('h1', 'H', 0, -1.1), At('h2', 'H', -1.1, 0), At('h3', 'H', 0, 1.1), At('h4', 'H', 1.1, 0)],
        enlaces: [Bo('n', 'h1'), Bo('n', 'h2'), Bo('n', 'h3'), { a: 'n', b: 'h4', orden: 1, discontinuo: true }], pares: [], textos: [{ x: 1.1, y: -0.6, t: '?' }, { x: 1.05, y: -1.15, t: '+', color: 'h', peso: 700 }], escala: 58, alto: 180,
        alt: 'El ion NH₄⁺: tres enlaces N–H dibujados y el cuarto, el dativo, punteado con un signo de pregunta.' }, estado: {} },
      revelar: { pieza: 'quim-molecula', datos: { atomos: [At('n', 'N', 0, 0), At('h1', 'H', 0, -1.1), At('h2', 'H', -1.1, 0), At('h3', 'H', 0, 1.1), At('h4', 'H', 1.1, 0)],
        enlaces: [Bo('n', 'h1'), Bo('n', 'h2'), Bo('n', 'h3'), Bo('n', 'h4')], pares: [], textos: [{ x: 1.05, y: -1.15, t: '+', color: 'h', peso: 700 }], escala: 58, alto: 180,
        alt: 'El ion NH₄⁺ con sus cuatro enlaces N–H iguales; la carga + es del ion entero.' }, estado: {} },
      coincide: 'Coincide: ya formados, los cuatro N–H son iguales.',
      noCoincide: 'Los cuatro N–H son iguales: el dativo solo dice de dónde salió el par.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: { atomos: [At('n', 'N', 0, 0), At('h1', 'H', 0, -1.1), At('h2', 'H', -1.1, 0), At('h3', 'H', 0, 1.1), At('h4', 'H', 1.25, 0)],
        enlaces: [Bo('n', 'h1'), Bo('n', 'h2'), Bo('n', 'h3'), { a: 'n', b: 'h4', orden: 1, color: 'f', desde: 2 }], pares: [{ en: 'n', ang: 0, color: 'f', hasta: 1 }],
        textos: [{ x: 1.1, y: -1.0, t: '+', color: 'h', peso: 700, desde: 2 }], escala: 58, alto: 180,
        alt: 'El NH₃ con su par libre y un H⁺ al lado; después, el par del nitrógeno queda como cuarto enlace del NH₄⁺.' },
      voz: 'Sigamos el par libre del nitrógeno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El N del NH₃ tiene un par libre; el H⁺ no trae electrones.', ecuacion: ['NH₃ + H', Cq('⁺')] },
        { estado: { corte: 2 }, texto: 'El N pone su par entero: es un enlace dativo.', ecuacion: ['N → H', SEP, 'NH₄', Cq('⁺')] },
        { estado: { corte: 2 }, texto: 'Ya formado, el dativo es igual a los otros tres N–H.', ecuacion: ['NH₄⁺: 4 enlaces iguales'] },
        { estado: { corte: 2 }, texto: 'Así también se forma el H₃O⁺: el O del agua pone un par.', ecuacion: ['H₂O + H⁺ → H₃O⁺'] },
        { estado: { corte: 2 }, texto: 'Excepciones: el boro queda con 6; el azufre del SF₆, con 12.', ecuacion: ['BF₃: ', El('6 e⁻'), SEP, 'SF₆: ', El('12 e⁻')] },
        { estado: { corte: 2 }, texto: 'Con un número impar de electrones, uno queda sin pareja: un radical.', ecuacion: ['NO: 5 + 6 = ', El('11 e⁻')] },
      ],
    },
    regla: {
      texto: 'En el enlace dativo, un átomo pone el par. Excepciones al octeto: Be y B quedan con menos de 8; P y S, con más; lo impar es radical.',
      ecuacion: ['dativo: un átomo pone los ', El('2 e⁻'), SEP, 'Be: ', El('4'), '; B: ', El('6'), SEP, 'P: hasta ', El('10'), '; S: hasta ', El('12'), SEP, 'número impar: radical'],
      condicion: 'solo los átomos del periodo 3 en adelante (P, S, Cl, Xe) pasan de 8; los del periodo 2, nunca.',
      voz: 'El octeto es una guía; cuenta siempre.',
      dibujo: radial('PCl5', { alt: 'Estructura de Lewis del PCl₅: el fósforo con cinco enlaces, 10 electrones alrededor.' }),
    },
    resuelve: {
      pieza: 'quim-molecula',
      generar(s) {
        const k = AROUND_R[s % AROUND_R.length], L = M.lewis(k), n = L.ligandos.length, e = L.electronesCentral;
        return {
          enunciado: `En la estructura de Lewis del ${L.formula}, ¿cuántos electrones rodean al ${L.central}? ¿Cumple el octeto?`,
          datos: [valTxt([L.central, ...L.ligandos.map(x => x.simbolo)]), D3.carga, D4.cuenta],
          dibujo: radial(k),
          pasos: [
            { tipo: 'pide', texto: `Piden los electrones que rodean al ${L.central} y si son 8.` },
            { tipo: 'datos', texto: `El ${L.central} tiene ${n} enlaces simples${L.paresLibres ? ` y ${pTxt(L.paresLibres)}` : ' y ningún par libre'}.` },
            { tipo: 'regla', texto: 'Cuento 2 por cada enlace y 2 por cada par libre del central. Menos de 8 es incompleto; más de 8, expandido.' },
            { tipo: 'cuentas', texto: 'Sumo.', ecuacion: [`2 · ${n}${L.paresLibres ? ` + 2 · ${L.paresLibres}` : ''} = `, El(`${e} e⁻`)] },
            { tipo: 'sentido', texto: e > 8 ? `Más de 8: el ${L.central} es del periodo ${M.elemento(L.central).periodo}, puede expandirse.` : e < 8 ? `Menos de 8: el ${L.central} se queda corto.` : 'Ocho justos: cumple.' },
          ],
          respuesta: [El(`${e} electrones`), `; ${e > 8 ? 'octeto expandido' : e < 8 ? 'octeto incompleto' : 'cumple el octeto'}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Cuenta los electrones del central antes de decidir.',
      generar(sem) {
        const r = azar(sem * 53 + 17), tipo = sem % 5;
        if (tipo === 4) return vfDe(r, AFIRMA_X, D_AFIRMA_X);
        return [casoAlrededor, casoClase, casoDativo, casoRadical][tipo](r);
      },
    },
  };

  // ---------- Idea 5 (rehecha, 19 nov): resonancia ----------
  // Propuesta A5. Objeto de la primera pantalla: una tiza junto a la pizarra (lleva el ion CO₃²⁻; quim-enlace, de prueba).
  // Cambia: dónde va el doble enlace · Permanece: los átomos en su lugar y los 24 electrones · Progresa: tres dibujos
  // válidos y después su promedio · Se reserva: cómo son los enlaces del ion real (Predice: el NO₃⁻) · Debe verse: que
  // los átomos no se mueven entre dibujos; solo cambia dónde va un par.
  // Errores: EN6 (la resonancia como algo que salta; 37,5 % en Uyulgan y Akkuzu 2016), QM-RES-UNO (un solo dibujo es el
  // real), QM-RES-TODOS (todos dobles), QM-RES-CUENTA (otra fracción), QM-RES-POSICIONES (cuenta mal los dibujos),
  // QM-CF-CARGA (carga formal = carga del ion; EN7), QM-CF-SIGNO, QM-RES-CUALQUIERA (resonancia en toda molécula con dobles).
  const PUNTAS = [[0, -1.25, -90], [-1.08, 0.62, 150], [1.08, 0.62, 30]];
  // El ion triangular (NO₃⁻ o CO₃²⁻) con el doble enlace en `dobleEn` (0 arriba, 1 izquierda, 2 derecha), o el híbrido (null).
  function triangular(central, dobleEn, o = {}) {
    const atomos = [At('x', central, 0, 0), ...PUNTAS.map(([x, y], k) => At(`o${k}`, 'O', x, y))];
    if (dobleEn === null) {
      const textos = PUNTAS.map(([x, y, a]) => { const r = a * Math.PI / 180; return { x: x / 2 + 0.38 * Math.cos(r + Math.PI / 2), y: y / 2 + 0.38 * Math.sin(r + Math.PI / 2), t: '4/3', peso: 700 }; });
      return { pieza: 'quim-molecula', datos: { atomos, enlaces: PUNTAS.map((_, k) => ({ a: 'x', b: `o${k}`, orden: 1 })), pares: [], textos, escala: 60, alto: 200,
        alt: o.alt || `Híbrido del ${central === 'N' ? 'NO₃⁻' : 'CO₃²⁻'}: tres enlaces iguales, cada uno de orden 4/3.` }, estado: {} };
    }
    const enlaces = PUNTAS.map((_, k) => Bo('x', `o${k}`, k === dobleEn ? 2 : 1));
    const pares = PUNTAS.flatMap(([, , a], k) => (k === dobleEn ? Pa(`o${k}`, a - 55, a + 55) : Pa(`o${k}`, a, a - 90, a + 90)));
    const cargas = PUNTAS.flatMap(([, , a], k) => (k === dobleEn ? [] : [{ en: `o${k}`, t: '−', ang: a + 50, color: 'h' }]));
    if (central === 'N') cargas.push({ en: 'x', t: '+', ang: -150, color: 'h' });
    return { pieza: 'quim-molecula', datos: { atomos, enlaces, pares, cargas, escala: 60, alto: 200,
      alt: o.alt || `Una estructura de resonancia del ${central === 'N' ? 'NO₃⁻' : 'CO₃²⁻'}: el doble enlace ${['arriba', 'a la izquierda', 'a la derecha'][dobleEn]}; los oxígenos con enlace simple llevan carga −.` }, estado: {} };
  }
  const LADO = ['arriba', 'a la izquierda', 'a la derecha'];
  // Especies con resonancia: [texto, enlace, pares compartidos en esos enlaces, posiciones equivalentes].
  const RES_A = [['O₃', 'O–O', 3, 2], ['NO₃⁻', 'N–O', 4, 3], ['CH₃COO⁻', 'C–O', 3, 2], ['SO₃', 'S–O', 4, 3]];
  const RES_R = [['NO₂⁻', 'N–O', 3, 2], ['CO₃²⁻', 'C–O', 4, 3], ['HCOO⁻', 'C–O', 3, 2]];
  const fr = (a, b) => (a === 4 && b === 3 ? '4/3' : a === 3 && b === 2 ? '3/2' : `${a}/${b}`);
  const frDec = (a, b) => (a === 4 && b === 3 ? '4/3 ≈ 1,33' : '3/2 = 1,5');
  const D5 = { orden: 'Orden de enlace: 1 en un simple, 2 en un doble, 3 en un triple', promedio: 'Orden promedio = pares compartidos en esos enlaces ÷ número de esos enlaces',
    cf: 'Carga formal = electrones de valencia − electrones de sus pares libres − enlaces que forma', largo: 'Más orden de enlace: enlace más corto' };
  function casoOrdenRes(r) {
    const [fo, enl, tot, pos] = r.de(RES_A);
    return {
      pregunta: `El ${fo} tiene ${pos} estructuras de resonancia; en cada una, un ${enl} es doble y ${pos === 2 ? 'el otro, simple' : 'los otros, simples'}. ¿Qué orden tiene cada ${enl} en la especie real?`,
      datos: [D5.orden, D5.promedio],
      opciones: ops(fr(tot, pos), ['2', 'QM-RES-UNO', 'Sería 2 si el doble enlace estuviera fijo. En la especie real se reparte.'],
        ['1', 'QM-RES-UNO', 'Sería 1 sin ningún doble. Hay uno, repartido entre todos.'],
        [tot === 4 ? '3/2' : '4/3', 'QM-RES-CUENTA', `Esa fracción es de otro número de enlaces: aquí son ${pos}.`]),
      solucion: { texto: `${tot} pares compartidos repartidos en ${pos} enlaces iguales.`, ecuacion: ['orden = ', { frac: [String(tot), String(pos)] }, ` = ${frDec(tot, pos)}`] },
    };
  }
  function casoCuantas(r) {
    const [fo, enl, , pos] = r.de([...RES_A, ['CO₃²⁻', 'C–O', 4, 3], ['NO₂⁻', 'N–O', 3, 2]]);
    return {
      pregunta: `En el ${fo}, el doble enlace puede ir en cualquiera de sus enlaces ${enl} iguales. ¿Cuántas estructuras de resonancia tiene?`,
      datos: [`${fo}: ${pos} enlaces ${enl}, uno de ellos doble en cada dibujo`],
      opciones: ops(String(pos), ['1', 'QM-RES-UNO', 'Bien dibujar una. Pero el doble puede ir en otro lugar igual de válido.'],
        [String(pos + 1), 'QM-RES-POSICIONES', 'Eso cuenta también el híbrido. El híbrido no es una estructura más: es el promedio.'],
        [String(2 * pos), 'QM-RES-POSICIONES', 'Eso cuenta dos veces cada lugar del doble.']),
      solucion: { texto: 'Un dibujo por cada enlace donde puede ir el doble.', ecuacion: [`${pos} estructuras`] },
    };
  }
  const CON_RES = ['O₃', 'NO₃⁻', 'CO₃²⁻', 'NO₂⁻', 'SO₃'], SIN_RES = ['CO₂', 'H₂O', 'NH₃', 'CH₄', 'HCN', 'N₂', 'CH₂O'];
  function casoCual(r) {
    const si = r.de(CON_RES), no = r.baraja(SIN_RES).slice(0, 3), conDoble = no.filter(x => ['CO₂', 'HCN', 'N₂', 'CH₂O'].includes(x));
    return {
      pregunta: `¿Cuál de estas especies tiene estructuras de resonancia: ${r.baraja([si, ...no]).join(', ')}?`,
      datos: ['Resonancia: varias estructuras válidas que solo cambian dónde va un par, entre átomos iguales'],
      opciones: ops(si, ...no.map(x => [x, conDoble.includes(x) ? 'QM-RES-CUALQUIERA' : 'QM-RES-SIMPLE', conDoble.includes(x) ? `Tiene enlaces múltiples, cierto. Pero solo se pueden dibujar en un lugar.` : 'Solo tiene enlaces simples: no hay un par que mover.'])),
      solucion: { texto: `En el ${si}, el doble enlace puede ir en más de un lugar igual.`, ecuacion: [`${si}: resonancia`] },
    };
  }
  // Carga formal de un átomo en una estructura: [quién, valencia, electrones libres, enlaces, especie].
  const CF_A = [['un oxígeno con enlace simple y tres pares libres', 6, 6, 1, 'NO₃⁻'], ['el oxígeno del doble enlace, con dos pares libres', 6, 4, 2, 'CO₃²⁻'],
    ['el nitrógeno central, con cuatro enlaces y sin pares libres', 5, 0, 4, 'NO₃⁻'], ['el oxígeno central, con tres enlaces y un par libre', 6, 2, 3, 'O₃'],
    ['el carbono central, con cuatro enlaces y sin pares libres', 4, 0, 4, 'CO₃²⁻'], ['el oxígeno de la punta con enlace simple y tres pares libres', 6, 6, 1, 'O₃']];
  const cfTxt = x => (x === 0 ? '0' : `${x > 0 ? '+' : '−'}${Math.abs(x)}`);
  function casoCF(r) {
    const [quien, v, l, b, sp] = r.de(CF_A), cf = v - l - b;
    return {
      pregunta: `En una estructura de resonancia del ${sp}, ¿qué carga formal tiene ${quien}?`,
      datos: [D5.cf],
      opciones: ops(cfTxt(cf), [cfTxt(-cf || 1), cf ? 'QM-CF-SIGNO' : 'QM-CF-CARGA', cf ? 'Bien la cuenta. Pero el signo va al revés: valencia menos lo que tiene.' : 'Ese átomo tiene justo sus electrones: queda en 0.'],
        [cfTxt(v - l / 2 - b), 'QM-CF-PARES', 'Bien restar los libres. Pero se restan electrones, no pares.'],
        [cfTxt(v - l - 2 * b), 'QM-CF-ENLACES', 'Bien restar los enlaces. Pero de cada enlace le toca un electrón, no dos.'],
        [sp === 'CO₃²⁻' ? '−2' : sp === 'NO₃⁻' ? '−1' : '+2', 'QM-CF-CARGA', 'Esa es la carga del ion entero. La carga formal se cuenta átomo por átomo.']),
      solucion: { texto: 'Valencia menos electrones libres menos enlaces.', ecuacion: [`${v} − ${l} − ${b} = `, Cq(cfTxt(cf))] },
    };
  }
  const AFIRMA_R = [
    ['En el NO₃⁻, el doble salta de un O a otro.', false, 'el ion real es el promedio de los dibujos'],
    ['En la resonancia, los átomos no se mueven.', true, 'solo cambia dónde va un par'],
    ['El O₃ tiene dos estructuras de resonancia.', true, 'el doble va a un lado o al otro'],
    ['El CO₂ tiene resonancia como el CO₃²⁻.', false, 'sus dos dobles van fijos'],
    ['Los tres C–O del CO₃²⁻ miden igual.', true, 'cada uno tiene orden 4/3'],
    ['El híbrido de resonancia es una estructura más.', false, 'es el promedio de todas'],
  ];

  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas-a.js): O₃ 3 · 6 = 18 · CO₃²⁻ 3 posiciones · CF 6 − 6 − 1 = −1 ·
  // O₃ 3/2 · NO₃⁻ 4/3 · CH₃COO⁻ 3/2 · N en NO₃⁻ 5 − 0 − 4 = +1 · CO₃²⁻ 4/3 < 2 · N₂O 5 + 5 + 6 = 16, 16 − 8 = 8 → 4
  // pares · CO 3 > CO₂ 2 > CO₃²⁻ 4/3 · O₃: 6 − 2 − 3 = +1, 6 − 6 − 1 = −1, 6 − 4 − 2 = 0, suma 0.
  const EJEMPLOS_RES = [
    { nivel: 1, titulo: 'Los electrones del ozono',
      enunciado: '¿Cuántos electrones hay que repartir en la estructura de Lewis del ozono, O₃?',
      datos: [valTxt(['O'])],
      solucion: [{ texto: 'Tres oxígenos, de 6 cada uno.', ecuacion: ['3 · 6 = ', El('18 e⁻')] }],
      respuesta: [El('18 electrones')] },
    { nivel: 1, titulo: 'El orden de un doble',
      enunciado: '¿Qué orden tiene un enlace doble?',
      datos: [D5.orden],
      solucion: [{ texto: 'El orden cuenta los pares compartidos: un doble comparte dos.' }],
      respuesta: ['Orden 2'] },
    { nivel: 1, titulo: 'Lo que cambia entre dibujos',
      enunciado: 'Entre dos estructuras de resonancia del O₃, ¿qué cambia: los átomos o un par de electrones?',
      datos: ['Resonancia: varias estructuras válidas de la misma especie'],
      solucion: [{ texto: 'Los tres oxígenos quedan en su lugar; solo cambia de qué lado va el par que forma el doble enlace.' }],
      respuesta: ['Solo un par de electrones'] },
    { nivel: 1, titulo: 'Los dibujos de la tiza',
      enunciado: '¿Cuántas estructuras de resonancia tiene el ion CO₃²⁻ de la tiza?',
      datos: ['CO₃²⁻: tres enlaces C–O; uno es doble en cada dibujo'],
      figura: triangular('C', 0),
      solucion: [{ texto: 'El doble enlace puede ir con cualquiera de los tres oxígenos: un dibujo por cada uno.' }],
      respuesta: ['3 estructuras'] },
    { nivel: 1, titulo: 'Un oxígeno con carga',
      enunciado: 'En una estructura del NO₃⁻, un oxígeno tiene un enlace simple y tres pares libres. ¿Qué carga formal tiene?',
      datos: [D5.cf, valTxt(['O'])],
      solucion: [{ texto: 'Tiene 6 de valencia, 6 electrones en sus pares y 1 enlace.', ecuacion: ['6 − 6 − 1 = ', Cq('−1')] }],
      respuesta: ['Carga formal ', Cq('−1')] },
    { nivel: 2, titulo: 'El ozono promedio',
      enunciado: 'El O₃ tiene dos estructuras de resonancia: en cada una, un O–O es doble y el otro, simple. ¿Qué orden tiene cada O–O en el ozono real?',
      datos: [D5.orden, D5.promedio],
      solucion: [
        { texto: 'En cada dibujo hay 2 + 1 = 3 pares compartidos en los dos enlaces O–O.' },
        { texto: 'En el ozono real se reparten por igual.', ecuacion: ['orden = ', { frac: ['3', '2'] }, ' = 1,5'] },
      ],
      respuesta: ['Orden 3/2 = 1,5'] },
    { nivel: 2, titulo: 'El nitrato promedio',
      enunciado: 'El NO₃⁻ tiene tres estructuras: en cada una, un N–O es doble y dos son simples. ¿Qué orden tiene cada N–O en el ion real?',
      datos: [D5.orden, D5.promedio],
      solucion: [
        { texto: 'En cada dibujo hay 2 + 1 + 1 = 4 pares compartidos en los tres enlaces.' },
        { texto: 'Se reparten entre los tres.', ecuacion: ['orden = ', { frac: ['4', '3'] }, ' ≈ 1,33'] },
      ],
      respuesta: ['Orden 4/3 ≈ 1,33'] },
    { nivel: 2, titulo: 'El ion que deja el vinagre',
      enunciado: 'En el ion CH₃COO⁻, el carbono del grupo COO⁻ se une a dos oxígenos: con uno por un doble y con otro por un simple, en dos estructuras. ¿Qué orden tiene cada C–O?',
      datos: [D5.orden, D5.promedio],
      solucion: [
        { texto: 'Dos estructuras: el doble va con un oxígeno o con el otro. Son 2 + 1 = 3 pares en dos enlaces.' },
        { texto: 'Se reparten por igual.', ecuacion: ['orden = ', { frac: ['3', '2'] }, ' = 1,5'] },
      ],
      respuesta: ['Orden 3/2 = 1,5'] },
    { nivel: 2, titulo: 'La carga del nitrógeno',
      enunciado: 'En el NO₃⁻, el nitrógeno central forma cuatro enlaces (uno doble y dos simples) y no tiene pares libres. ¿Qué carga formal tiene?',
      datos: [D5.cf, valTxt(['N'])],
      solucion: [
        { texto: 'Un doble y dos simples son 4 enlaces.', ecuacion: ['2 + 1 + 1 = 4'] },
        { texto: 'Valencia menos libres menos enlaces.', ecuacion: ['5 − 0 − 4 = ', Cq('+1')] },
      ],
      respuesta: ['Carga formal ', Cq('+1')] },
    { nivel: 2, titulo: 'Dos enlaces C–O',
      enunciado: '¿Qué enlace es más largo: un C=O del CO₂ (orden 2) o un C–O del CO₃²⁻ (orden 4/3)?',
      datos: [D5.largo],
      solucion: [
        { texto: 'Comparo los órdenes: 4/3 ≈ 1,33 es menor que 2.', ecuacion: ['4/3 < 2'] },
        { texto: 'Menos pares compartidos, enlace más largo.' },
      ],
      respuesta: ['El C–O del CO₃²⁻'] },
    { nivel: 3, titulo: 'Una molécula lineal: N₂O',
      enunciado: 'Una estructura del N₂O es N≡N–O, con 16 electrones. ¿Cuántos pares libres tiene en total?',
      alternativas: ['4', '8', '2', '6', '3'],
      datos: [valTxt(['N', 'O']), D3.enlace, D3.meta],
      solucion: [
        { texto: 'El triple y el simple usan 6 + 2 = 8 electrones. Quedan 8, que son 4 pares: uno en el N de la punta y tres en el O.', ecuacion: ['16 − 8 = 8 → ', El('4 pares')] },
        { texto: ['La ', letra('B'), ' cuenta electrones, no pares. La ', letra('C'), ' olvida los del oxígeno. La ', letra('D'), ' suma también los pares compartidos que no son del triple.'] },
        { texto: ['La ', letra('E'), ' cuenta solo los del oxígeno.'] },
      ],
      respuesta: [letra('A'), ', ', El('4 pares libres')] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. En el NO₃⁻, el doble enlace salta de un oxígeno a otro. II. Entre dos estructuras de resonancia, los átomos no se mueven. III. El O₃ tiene dos estructuras de resonancia.',
      alternativas: ['VVV', 'FVV', 'VFV', 'FVF', 'VVF'],
      datos: ['Resonancia: varias estructuras válidas que solo cambian dónde va un par'],
      solucion: [
        { texto: 'I es falsa: los dibujos se alternan en el papel; el ion real es el promedio. II y III son verdaderas.', ecuacion: ['FVV'] },
        { texto: ['La ', letra('A'), ', la ', letra('C'), ' y la ', letra('E'), ' creen que el ion salta entre dibujos.'] },
        { texto: ['La ', letra('D'), ' cuenta un solo dibujo para el ozono.'] },
      ],
      respuesta: [letra('B'), ', FVV'] },
    { nivel: 3, titulo: 'Tres enlaces carbono–oxígeno',
      enunciado: 'El CO tiene un enlace triple; el CO₂, dos dobles, y el CO₃²⁻, tres enlaces de orden 4/3. ¿Cuál es el orden de largo de su enlace carbono–oxígeno, de mayor a menor?',
      alternativas: ['CO > CO₂ > CO₃²⁻', 'CO₂ > CO > CO₃²⁻', 'CO₃²⁻ > CO₂ > CO', 'Los tres miden igual', 'CO₂ > CO₃²⁻ > CO'],
      datos: [D5.largo],
      solucion: [
        { texto: 'Los órdenes son 3, 2 y 4/3. El de menor orden es el más largo.', ecuacion: ['4/3 < 2 < 3 → CO₃²⁻ > CO₂ > CO'] },
        { texto: ['La ', letra('A'), ' invierte el orden. La ', letra('B'), ' y la ', letra('E'), ' ponen mal el triple.'] },
        { texto: ['La ', letra('D'), ' olvida que un enlace con más pares compartidos es más corto.'] },
      ],
      respuesta: [letra('C'), ', CO₃²⁻ > CO₂ > CO'] },
    { nivel: 3, titulo: 'Quién tiene resonancia',
      enunciado: '¿Cuál de estas especies tiene estructuras de resonancia: CO₂, H₂O, CH₄, O₃ o NH₃?',
      alternativas: ['CO₂', 'H₂O', 'CH₄', 'O₃', 'NH₃'],
      datos: ['Resonancia: varias estructuras válidas que solo cambian dónde va un par, entre átomos iguales'],
      solucion: [
        { texto: 'En el O₃ el doble enlace puede ir de un lado o del otro del oxígeno central.' },
        { texto: ['La ', letra('A'), ' tiene dobles, pero fijos: no hay otro lugar. La ', letra('B'), ', la ', letra('C'), ' y la ', letra('E'), ' solo tienen enlaces simples.'] },
      ],
      respuesta: [letra('D'), ', el O₃'] },
    { nivel: 3, titulo: 'Las cargas del ozono',
      enunciado: 'En la estructura O=O–O del ozono, el oxígeno central tiene un par libre; el de la izquierda, dos, y el de la derecha, tres. ¿Qué cargas formales tienen, de izquierda a derecha?',
      alternativas: ['0, 0 y 0', '−1, +1 y 0', '0, −1 y +1', '+1, 0 y −1', '0, +1 y −1'],
      datos: [D5.cf, valTxt(['O'])],
      solucion: [
        { texto: 'Valencia menos libres menos enlaces, en cada oxígeno.', ecuacion: ['6 − 4 − 2 = 0', SEP, '6 − 2 − 3 = +1', SEP, '6 − 6 − 1 = −1'] },
        { texto: ['La ', letra('A'), ' cree que una molécula sin carga no tiene cargas formales. La ', letra('B'), ' y la ', letra('D'), ' las cambian de lugar.'] },
        { texto: ['La ', letra('C'), ' pone la −1 en el central, que tiene un solo par libre. Suman 0, como la molécula.'] },
      ],
      respuesta: [letra('E'), ', 0, +1 y −1'] },
  ];

  const resonancia = {
    id: 'resonancia',
    titulo: 'Resonancia',
    pregunta: '¿Qué pasa cuando una molécula se puede dibujar de varias maneras?',
    temas: ['Resonancia'],
    pieza: 'quim-molecula',
    aprendizaje: 'Si una estructura se puede dibujar de varias maneras que solo mueven pares, la especie real es el promedio: enlaces iguales, de orden intermedio.',
    actividad: 'Mover el doble enlace del ion de la tiza de un oxígeno a otro.',
    lee: {
      tarjetas: [
        { titulo: 'La tiza', texto: 'La tiza de la pizarra está hecha de iones Ca²⁺ y CO₃²⁻. El ion CO₃²⁻ tiene un carbono al centro y tres oxígenos, con 24 electrones de valencia.',
          pieza: 'quim-enlace', dibujo: OBJ('tiza', { nombre: 'Una tiza: iones Ca²⁺ y CO₃²⁻' }) },
        { titulo: 'Orden de enlace', texto: 'El orden de enlace cuenta cuántos pares comparten dos átomos: 1 en un simple, 2 en un doble y 3 en un triple. Un enlace doble es más corto que uno simple.' },
        { titulo: 'Varias maneras', texto: 'A veces la misma especie se dibuja de varias maneras válidas que solo cambian dónde va un par. Esas son sus estructuras de resonancia.' },
        { titulo: 'Qué mirar', texto: 'En el juego llevas el doble enlace del CO₃²⁻ a cada oxígeno. Fíjate qué cambia entre un dibujo y otro, y qué se queda en su lugar.' },
      ],
    },
    ejemplos: EJEMPLOS_RES,
    juega: {
      pieza: 'quim-molecula',
      consigna: 'En el ion CO₃²⁻ de la tiza, uno de los tres enlaces C–O es doble. Elige con cuál oxígeno va y mira qué cambia.',
      mision: {
        texto: 'Deja sin carga al oxígeno de la izquierda.',
        logrado: v => v.k === 1,
        bien: 'El doble pasó a ese oxígeno y la carga, a los otros. Ningún átomo se movió.',
      },
      voz: 'Mira qué se mueve y qué se queda quieto.',
      leyenda: [
        { s: '=', t: 'enlace doble' },
        { s: Cq('−'), t: 'carga de ese oxígeno en el dibujo' },
        { s: El('••'), t: 'un par libre' },
      ],
      controles: [{ id: 'k', etiqueta: 'Doble enlace', opciones: [0, 1, 2].map(k => ({ valor: k, texto: ['Arriba', 'Izquierda', 'Derecha'][k] })), inicio: 0 }],
      dibujo: v => triangular('C', v.k),
      lectura: v => [`Doble ${LADO[v.k]}: `, El('24 e⁻'), ', como en los otros dibujos.'],
      minimo: 3,
    },
    predice: {
      pieza: 'quim-molecula',
      pregunta: 'El ion NO₃⁻ también tiene tres dibujos válidos, con el doble en cualquiera de sus oxígenos. En el ion real se miden los tres enlaces N–O. ¿Cómo son?',
      datos: ['Enlace doble: más corto que uno simple', 'NO₃⁻: tres estructuras de Lewis válidas'],
      voz: 'Piensa qué describe el ion real, no el dibujo.',
      opciones: [
        { id: 'c', texto: 'Los tres iguales, de largo intermedio', correcta: true },
        { id: 'uno', texto: 'Uno corto, el doble, y dos largos, los simples', error: 'QM-RES-UNO', siFuera: 'Sería así si un solo dibujo fuera el real. Los tres valen a la vez.' },
        { id: 'salta', texto: 'Cambian: el doble salta de un oxígeno a otro', error: 'EN6', siFuera: 'Los dibujos se alternan en el papel, no en el ion. El ion no oscila.' },
        { id: 'todos', texto: 'Los tres cortos, como dobles', error: 'QM-RES-TODOS', siFuera: 'Sería así con tres dobles, pero no alcanzan los electrones: hay un solo doble.' },
      ],
      dibujo: triangular('N', 0),
      revelar: triangular('N', null),
      coincide: 'Coincide: el par se reparte y cada enlace tiene orden 4/3.',
      noCoincide: 'El ion real es el promedio: tres enlaces iguales, de orden 4/3.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: (() => {
        const ls = [0, 1, 2].map(k => triangular('C', k).datos), h = triangular('C', null).datos, d = Object.assign({}, ls[0]);
        d.enlaces = [...ls.flatMap((l, k) => l.enlaces.map(e => Object.assign({}, e, { desde: k + 1, hasta: k + 1 }))), ...h.enlaces.map(e => Object.assign({}, e, { desde: 4 }))];
        d.pares = ls.flatMap((l, k) => l.pares.map(p => Object.assign({}, p, { desde: k + 1, hasta: k + 1 })));
        d.cargas = ls.flatMap((l, k) => l.cargas.map(c => Object.assign({}, c, { desde: k + 1, hasta: k + 1 })));
        d.textos = h.textos.map(t => Object.assign({}, t, { desde: 4 }));
        d.alt = 'El ion CO₃²⁻ dibujado tres veces, con el doble enlace en cada oxígeno, y al final el híbrido con tres enlaces iguales de orden 4/3.';
        return d;
      })(),
      voz: 'Sigamos el par que cambia de lugar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'CO₃²⁻: un dibujo con el doble enlace arriba.', ecuacion: [El('4 + 3 · 6 + 2 = 24 e⁻')] },
        { estado: { corte: 2 }, texto: 'Otro dibujo igual de válido: el doble, a la izquierda.' },
        { estado: { corte: 3 }, texto: 'Y un tercero. Los átomos nunca se movieron; solo el par.' },
        { estado: { corte: 4 }, texto: 'El ion real es el promedio: el híbrido, con tres enlaces iguales.', ecuacion: ['orden = ', { frac: ['4 pares', '3 enlaces'] }, ' ≈ 1,33'] },
        { estado: { corte: 4 }, texto: 'Cada C–O queda entre un simple y un doble.', ecuacion: ['1 < 4/3 < 2'] },
      ],
    },
    regla: {
      texto: 'Si varias estructuras de Lewis válidas solo difieren en dónde va un par, la especie real es un híbrido: los electrones se reparten y esos enlaces quedan iguales.',
      ecuacion: ['orden promedio = ', { frac: ['pares compartidos', 'número de enlaces'] }],
      condicion: 'las estructuras mueven electrones, nunca átomos, y van entre átomos iguales; la especie no salta de un dibujo a otro.',
      voz: 'Varios dibujos, una sola especie.',
      dibujo: triangular('C', null, { alt: 'Híbrido del CO₃²⁻: tres enlaces C–O iguales, cada uno de orden 4/3.' }),
    },
    resuelve: {
      pieza: 'quim-molecula',
      generar(s) {
        const [fo, enl, tot, pos] = RES_R[s % RES_R.length], TRI = fo === 'CO₃²⁻' ? 'C' : null;
        return {
          enunciado: `El ${fo} tiene ${pos} estructuras de resonancia; en cada una, un enlace ${enl} es doble. ¿Qué orden tiene cada enlace ${enl} en la especie real?`,
          datos: [D5.orden, D5.promedio],
          dibujo: TRI ? triangular(TRI, 0) : undefined,
          pasos: [
            { tipo: 'pide', texto: `Piden el orden de cada enlace ${enl} en el híbrido, la especie real.` },
            { tipo: 'datos', texto: `Hay ${pos} enlaces ${enl} iguales; en cada dibujo, uno es doble y ${pos - 1 === 1 ? 'el otro, simple' : `los otros ${pos - 1}, simples`}.`,
              ecuacion: [`pares en esos enlaces: 2 + ${Array(pos - 1).fill('1').join(' + ')} = ${tot}`] },
            { tipo: 'regla', texto: 'En la especie real el doble no está fijo: se reparte por igual. Divido los pares compartidos entre los enlaces.' },
            { tipo: 'cuentas', texto: `Reparto ${tot} pares entre ${pos} enlaces.`, ecuacion: ['orden = ', { frac: [String(tot), String(pos)] }, ` = ${frDec(tot, pos)}`], dibujo: TRI ? triangular(TRI, null) : undefined },
            { tipo: 'sentido', texto: `Queda entre 1 (simple) y 2 (doble): cada enlace ${enl} tiene un poco del doble.`, ecuacion: [`1 < ${fr(tot, pos)} < 2`] },
          ],
          respuesta: [`Orden ${frDec(tot, pos)}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Cuenta los pares y repártelos.',
      generar(sem) {
        const r = azar(sem * 47 + 19), tipo = sem % 5;
        if (tipo === 4) return vfDe(r, AFIRMA_R, ['Resonancia: varias estructuras válidas que solo cambian dónde va un par', D5.orden]);
        return [casoOrdenRes, casoCuantas, casoCual, casoCF][tipo](r);
      },
    },
  };

  // Mesa de la idea 5: los dos iones triangulares y su híbrido como cuarta posición; el doble enlace se agarra.
  const QM = () => Kit.piezas['quim-molecula'];
  const IONES_R = { NO3: { t: 'NO₃⁻', c: 'N' }, CO3: { t: 'CO₃²⁻', c: 'C' } };
  const resDib = v => triangular(IONES_R[v.ion].c, v.k === 3 ? null : v.k);
  const mitad = (dib, k) => { const g = QM().encuadre(dib.datos); return k === 3 ? { x: g.X(0), y: g.Y(0) } : { x: g.X(PUNTAS[k][0] / 2), y: g.Y(PUNTAS[k][1] / 2) }; };
  const dobleCerca = (dib, pt) => [0, 1, 2, 3].reduce((a, b) => { const pa = mitad(dib, a), pb = mitad(dib, b); return (pb.x - pt.x) ** 2 + (pb.y - pt.y) ** 2 < (pa.x - pt.x) ** 2 + (pa.y - pt.y) ** 2 ? b : a; });

  // ---------- Laboratorio ----------
  // Mesa de la idea 1: dos átomos y el enlace que forman. El tipo por los elementos (metal con no metal, iónico) manda;
  // la ΔEN y la guía de 1,7 se muestran al lado, para ver dónde coinciden y dónde no (Mg–Br, Na–H).
  const MESA_A = ['Li', 'Na', 'K', 'Mg', 'Ca', 'H', 'C', 'N', 'Cl'], MESA_B = ['H', 'C', 'N', 'O', 'F', 'Cl', 'Br'];
  const CARGA_ION = s => { const g = M.elemento(s).grupo; return el(s).metal ? (g === 1 ? '+' : `${g}+`) : s === 'H' ? '−' : g === 17 ? '−' : g === 16 ? '2−' : '3−'; };
  const tipoMesa = (a, b) => (a === b ? 'apolar' : el(a).metal !== el(b).metal ? 'ionico' : 'polar');
  function dibujoMesa(v) {
    const a = v.a, b = v.b, t = tipoMesa(a, b), d = dEN(a, b), m = mayorEN(a, b);
    const atomos = [{ id: 'a', t: a, x: -1.1, y: 0 }, { id: 'b', t: b, x: 1.1, y: 0 }];
    const enlaces = t === 'ionico' ? [] : [{ a: 'a', b: 'b' }];
    const cargas = t === 'ionico' ? [{ en: 'a', t: CARGA_ION(a), ang: -60, color: 'h' }, { en: 'b', t: CARGA_ION(b), ang: -60, color: 'h' }]
      : t === 'polar' ? [{ en: m === a ? 'a' : 'b', t: 'δ−', ang: -90, color: 'h' }, { en: m === a ? 'b' : 'a', t: 'δ+', ang: -90, color: 'h' }] : [];
    return { pieza: 'quim-molecula', datos: { atomos, enlaces, cargas, textos: [{ x: 0, y: 1.25, t: `ΔEN = ${f(d)}`, color: 'i', peso: 700 }], escala: 60, alto: 170,
      alt: `${a} y ${b}: ${t === 'ionico' ? 'iones de carga opuesta, sin par compartido' : t === 'polar' ? `un par compartido, corrido hacia el ${m}` : 'un par compartido justo al medio'}; ΔEN = ${f(d)}.` }, estado: {} };
  }
  const TIPO_MESA = { ionico: 'iónico', polar: 'covalente polar', apolar: 'covalente apolar' };
  const guiaDice = d => (d >= 1.7 ? 'iónico' : d > 0 ? 'covalente polar' : 'covalente apolar');
  const MAX_MESA = Math.max(...MESA_A.flatMap(a => MESA_B.map(b => dEN(a, b))));

  return {
    unidad: 'quimica.enlace-quimico',
    version: '0.2.0',
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/elementos.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/quim-enlace.js', '/plantillas/enlace/motor.js'],
    // Tabla de letras (propuesta §7; regla letras-datos).
    letras: { Z: 'número atómico', X: 'un elemento sin nombre', Q: 'un elemento sin nombre', R: 'un elemento sin nombre', e: 'electrón', 'δ': 'carga parcial' },
    glosarioSin: ['red cristalina'],
    historia: {
      texto: 'En 1916, Gilbert N. Lewis propuso que dos átomos pueden quedar unidos compartiendo un par de electrones, y Walther Kossel, que otros se unen pasándose electrones y quedando con carga. Las dos ideas, dibujadas con puntos, siguen sirviendo para contar enlaces. Son una contabilidad útil, no una foto del átomo.',
      pregunta: '¿Por qué el agua es H₂O y no H₃O?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §7.1 y §7.3', url: 'https://openstax.org/books/chemistry-2e/pages/7-1-ionic-bonding' },
    },
    glosario: [
      { termino: 'enlace químico', formas: ['enlace químico', 'enlaces químicos', 'enlace', 'enlaces'],
        def: 'Unión que mantiene juntos a dos átomos o iones, según cómo se reparten sus electrones de valencia.',
        ejemplos: ['El que une al H y al O en el agua.', 'El que une los iones de la sal.', 'El que une los átomos de un cable de cobre.'], ver: ['enlace iónico', 'enlace covalente', 'enlace metálico'] },
      { termino: 'enlace iónico', formas: ['enlace iónico', 'enlaces iónicos', 'iónico', 'iónicos', 'iónica'],
        def: 'Atracción entre cationes y aniones que se forman cuando un metal cede electrones a un no metal.',
        simple: 'Iones con cargas opuestas que se atraen, todos con todos.',
        ejemplos: ['El KBr: iones K⁺ y Br⁻.', 'El MgO: iones Mg²⁺ y O²⁻.', 'El CaF₂: un Ca²⁺ por cada dos F⁻.'], ver: ['catión', 'anión'] },
      { termino: 'enlace covalente', formas: ['enlace covalente', 'enlaces covalentes', 'covalente', 'covalentes'],
        def: 'Unión de dos átomos, casi siempre no metales, que comparten uno o más pares de electrones.',
        simple: 'Dos átomos que se quedan juntos compartiendo electrones.',
        ejemplos: ['Cada H–O del agua.', 'El C–H del metano.', 'El Cl–Cl de la molécula de cloro.'], ver: ['par compartido'] },
      { termino: 'enlace metálico', formas: ['enlace metálico', 'enlaces metálicos', 'metálico', 'metálicos'],
        def: 'Unión de los átomos de un metal: sus cationes quedan en un mar de electrones que se mueven entre todos.',
        simple: 'Átomos de un metal que comparten sus electrones con todos los vecinos.',
        ejemplos: ['El cobre de un cable.', 'El hierro de un clavo.', 'El aluminio del papel de cocina.'], ver: ['metal'] },
      { termino: 'carga parcial', simbolo: 'δ', formas: ['carga parcial', 'cargas parciales'],
        def: 'Carga menor que la de un ion en los extremos de un enlace polar; δ− donde se corre el par.',
        simple: 'Un poquito de carga, menos que la de un ion.',
        ejemplos: ['En el H–Cl: H con δ+ y Cl con δ−.', 'En el C–O: el O con δ−.', 'En el Cl–Cl no hay: jalan igual.'], ver: ['electronegatividad', 'par compartido'] },
      { termino: 'regla del octeto', formas: ['regla del octeto', 'octeto', 'octetos'],
        def: 'Tendencia de muchos átomos a quedar con 8 electrones en su último nivel al unirse, como un gas noble.',
        simple: 'Quedar con ocho electrones afuera, como un gas noble.',
        ejemplos: ['El K⁺ queda como el argón.', 'El O²⁻ queda como el neón.', 'El hidrógeno se conforma con 2, como el helio.'], ver: ['gas noble', 'electrones de valencia'] },
      { termino: 'compuesto iónico', formas: ['compuesto iónico', 'compuestos iónicos'],
        def: 'Sustancia formada por cationes y aniones en una red; su fórmula da la proporción con carga total cero.',
        simple: 'Un sólido hecho de iones positivos y negativos juntos.',
        ejemplos: ['El KBr.', 'El CaF₂: un Ca²⁺ por cada dos F⁻.', 'El Al₂O₃.'], ver: ['enlace iónico', 'red de iones'] },
      { termino: 'red de iones', formas: ['red de iones', 'redes de iones'],
        def: 'Orden de cationes y aniones que se repite en las tres direcciones; cada ion, rodeado de los de carga opuesta.',
        simple: 'Iones ordenados en filas, que se repiten en todas las direcciones.',
        ejemplos: ['En el KBr, cada K⁺ rodeado de seis Br⁻.', 'En el CaO, Ca²⁺ y O²⁻ alternados.', 'La de un cristal de sal.'], ver: ['compuesto iónico'] },
      { termino: 'estructura de Lewis', formas: ['estructura de Lewis', 'estructuras de Lewis'],
        def: 'Dibujo de una molécula o ion con sus enlaces como rayas y sus pares sin compartir como puntos.',
        simple: 'Un dibujo que reparte los electrones de valencia entre los átomos.',
        ejemplos: ['H–Cl con tres pares en el cloro.', 'O=C=O con dos pares en cada oxígeno.', 'NH₃ con un par en el nitrógeno.'], ver: ['par libre', 'símbolo de Lewis'] },
      { termino: 'par libre', formas: ['par libre', 'pares libres', 'par sin compartir'],
        def: 'Par de electrones de valencia de un átomo que no forma parte de ningún enlace.',
        simple: 'Dos electrones de un átomo que no se comparten.',
        ejemplos: ['El oxígeno del agua tiene dos.', 'El nitrógeno del NH₃ tiene uno.', 'El carbono del CH₄ no tiene.'], ver: ['estructura de Lewis'] },
      { termino: 'enlace múltiple', formas: ['enlace múltiple', 'enlaces múltiples', 'enlace doble', 'enlaces dobles', 'enlace triple', 'enlaces triples'],
        def: 'Enlace en el que dos átomos comparten dos pares (doble) o tres pares (triple) de electrones.',
        simple: 'Dos átomos que comparten más de un par de electrones.',
        ejemplos: ['O=C=O: dos enlaces dobles.', 'H–C≡N: un enlace triple.', 'El O₂: un enlace doble.'], ver: ['enlace covalente'] },
      { termino: 'enlace dativo', formas: ['enlace dativo', 'enlaces dativos', 'dativo', 'dativos', 'enlace coordinado'],
        def: 'Enlace covalente cuyo par compartido sale entero de uno de los dos átomos.',
        simple: 'Un enlace en el que un solo átomo pone el par.',
        ejemplos: ['El cuarto N–H del NH₄⁺.', 'El tercer O–H del H₃O⁺.', 'El N–B del H₃N–BF₃.'], ver: ['par libre', 'enlace covalente'] },
      { termino: 'octeto incompleto', formas: ['octeto incompleto'],
        def: 'Caso del átomo central que queda con menos de 8 electrones alrededor, como el berilio y el boro.',
        simple: 'Un átomo que se queda con menos de ocho.',
        ejemplos: ['El Be del BeCl₂: 4.', 'El B del BF₃: 6.', 'El Al del AlCl₃: 6.'], ver: ['regla del octeto'] },
      { termino: 'octeto expandido', formas: ['octeto expandido'],
        def: 'Caso del átomo central, del periodo 3 en adelante, que queda con más de 8 electrones alrededor.',
        simple: 'Un átomo que llega a tener más de ocho.',
        ejemplos: ['El P del PCl₅: 10.', 'El S del SF₆: 12.', 'El Xe del XeF₄: 12.'], ver: ['regla del octeto'] },
      { termino: 'radical libre', formas: ['radical libre', 'radicales libres', 'radical', 'radicales'],
        def: 'Especie con un número impar de electrones de valencia: uno queda sin pareja. Suele reaccionar rápido.',
        simple: 'Una partícula con un electrón que se quedó sin pareja.',
        ejemplos: ['El NO: 11 electrones.', 'El NO₂: 17 electrones.', 'El OH sin carga: 7 electrones.'], ver: ['electrón desapareado'] },
      { termino: 'resonancia', formas: ['resonancia', 'estructuras de resonancia', 'estructura de resonancia'],
        def: 'Caso de una especie que tiene varias estructuras de Lewis válidas que solo cambian dónde va un par.',
        simple: 'Una misma especie que se puede dibujar de varias maneras.',
        ejemplos: ['El O₃: dos dibujos.', 'El CO₃²⁻: tres dibujos.', 'El NO₂⁻: dos dibujos.'], ver: ['híbrido de resonancia'] },
      { termino: 'híbrido de resonancia', formas: ['híbrido de resonancia', 'híbrido'],
        def: 'La especie real cuando hay resonancia: el promedio de sus estructuras, con los pares repartidos.',
        simple: 'El promedio de todos los dibujos: así es de verdad.',
        ejemplos: ['El del O₃: dos O–O iguales.', 'El del CO₃²⁻: tres C–O iguales.', 'El del NO₂⁻: dos N–O iguales.'], ver: ['resonancia', 'orden de enlace'] },
      { termino: 'orden de enlace', formas: ['orden de enlace', 'órdenes de enlace'],
        def: 'Número de pares que comparten dos átomos: 1 en el simple, 2 en el doble, 3 en el triple.',
        simple: 'Cuántos pares comparten dos átomos.',
        ejemplos: ['C–H: 1.', 'O=O: 2.', 'N≡N: 3.'], ver: ['enlace múltiple'] },
      { termino: 'carga formal', formas: ['carga formal', 'cargas formales'],
        def: 'Cuenta de un átomo dentro de una estructura: valencia menos electrones de sus pares libres menos enlaces.',
        simple: 'La carga que le toca a un átomo en un dibujo de Lewis.',
        ejemplos: ['El O del H₂O: 0.', 'Un O con un enlace y tres pares: −1.', 'El N del NH₄⁺: +1.'], ver: ['estructura de Lewis'] },
    ],
    laboratorio: [
      {
        id: 'dos-atomos', titulo: 'Dos átomos, un enlace', pieza: 'quim-molecula',
        consigna: 'Elige dos átomos. Mira si quedan iones o comparten un par, y compara el tipo con lo que dice la guía de ΔEN.',
        controles: [
          { id: 'a', etiqueta: 'Primer átomo', opciones: MESA_A.map(x => ({ valor: x, texto: x })), inicio: 'Na' },
          { id: 'b', etiqueta: 'Segundo átomo', opciones: MESA_B.map(x => ({ valor: x, texto: x })), inicio: 'Cl' },
        ],
        dibujo: v => dibujoMesa(v),
        lectura: v => [`${v.a}–${v.b}: ${TIPO_MESA[tipoMesa(v.a, v.b)]}; según la guía de `, dENf, `, ${guiaDice(dEN(v.a, v.b))}`],
        invitaciones: [
          { texto: 'Arma un enlace donde el par quede justo al medio.', logrado: v => tipoMesa(v.a, v.b) === 'apolar', bien: 'Dos átomos iguales jalan igual: covalente apolar.' },
          { texto: 'Busca el par con la mayor diferencia de electronegatividad.', logrado: v => dEN(v.a, v.b) === MAX_MESA, bien: 'El metal más a la izquierda con el no metal que más jala: iones.' },
          { texto: 'Encuentra un metal con un no metal que la guía de 1,7 no llame iónico.', logrado: v => tipoMesa(v.a, v.b) === 'ionico' && dEN(v.a, v.b) < 1.7,
            bien: 'La guía es una ayuda: un metal con un no metal igual forma iones.' },
        ],
      },
      {
        id: 'resonancia-libre', titulo: 'El par que se reparte', pieza: 'quim-molecula',
        consigna: 'Elige el ion. Lleva el doble enlace a cada oxígeno y después al centro: ahí está el híbrido, el ion real.',
        controles: [
          { id: 'ion', etiqueta: 'Ion', opciones: Object.keys(IONES_R).map(k => ({ valor: k, texto: IONES_R[k].t })) },
          { id: 'k', etiqueta: 'Doble enlace', opciones: [{ valor: 0, texto: 'Arriba' }, { valor: 1, texto: 'Izquierda' }, { valor: 2, texto: 'Derecha' }, { valor: 3, texto: 'Híbrido' }] },
        ],
        dibujo: v => resDib(v),
        lectura: v => (v.k === 3 ? [`${IONES_R[v.ion].t}, híbrido: tres enlaces iguales, de orden 4/3`] : [`${IONES_R[v.ion].t}, doble ${LADO[v.k]}: `, El('24 e⁻'), ' en el dibujo']),
        arrastres: [{ id: 'doble', etiqueta: 'doble enlace: llévalo a un oxígeno o al centro', color: 'c-f', donde: v => mitad(resDib(v), v.k), mover: (pt, v) => ({ k: dobleCerca(resDib(v), pt) }) }],
        invitaciones: [
          { texto: 'Lleva el ion de la tiza a su híbrido: el ion real.', logrado: v => v.ion === 'CO3' && v.k === 3, bien: 'Tres enlaces iguales: el par doble está repartido entre los tres oxígenos.' },
          { texto: 'Guarda dos estructuras del mismo ion que solo cambien dónde va el doble enlace.',
            logrado: (v, g) => g.some(a => g.some(b => a.ion === b.ion && a.k !== b.k && a.k < 3 && b.k < 3)), bien: 'Mismos átomos; solo se mueve un par. Eso es resonancia.' },
          { texto: 'Guarda una estructura de cada ion: ¿cuál tiene carga en el átomo central?',
            logrado: (v, g) => g.some(a => g.some(b => a.ion !== b.ion && a.k < 3 && b.k < 3)), bien: 'El N del NO₃⁻ lleva +1; el C del CO₃²⁻, nada. Los dos tienen 24 electrones.' },
        ],
      },
    ],
    laboratorioIdeas: { 'dos-atomos': ['tres-enlaces'], 'resonancia-libre': ['resonancia'] },
    ideas: [tres, ionico, lewisIdea, excepciones, resonancia],
  };
});
