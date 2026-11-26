/*
 * Teoría de «Mol, masa molar y composición» (quimica.mol-y-composicion). Molde: docs/teoria.md y docs/molde-unidad.md;
 * unidad modelo: contenido/teoria/quimica/nomenclatura-inorganica.js. Compañera: Bruna (castora).
 *
 * Etapa 8 del plan de calidad (19 nov 2026), con criterio delegado (docs/metodo/unidad/etapa-delegada.md). Propuesta:
 * docs/etapa8/propuesta-quimica.md. Primera unidad de la rama «Cálculos químicos». Seis ideas, en este orden y con estos
 * id: 1 «Masa atómica promedio» (`masa-atomica-promedio`), 2 «Mol y masa molar» (`mol-masa-molar`), 3 «Moles de átomos
 * en una fórmula» (`relaciones-en-formula`), 4 «Composición centesimal» (`composicion-formula-empirica`, conserva el id y
 * la predicción del CH₄), 5 «Fórmula empírica y molecular» (`formula-empirica-molecular`, nueva) y 6 «Leyes ponderales»
 * (`leyes-ponderales`).
 *
 * Regla 1: las masas molares, los porcentajes y las fórmulas empírica y molecular salen del motor de la escena
 * (plantillas/mol-composicion/motor.js, con sus casos); los promedios, los moles y los números de entidades, de las cuentas
 * de este archivo. Nada se escribe a mano si sale de una cuenta. Cuentas rehechas aparte, por otro camino
 * (scratchpad e8-quimica/verif/cuentas.js).
 *
 * Tabla de letras (propuesta §7, también en `letras`): n moles (cantidad de sustancia), m masa en g, M masa molar en g/mol,
 * N número de entidades (en Estructura atómica N son los neutrones: aquí los neutrones se dicen con su palabra y se avisa
 * en «Lee»), Nₐ el número de Avogadro, u la unidad de masa atómica, k las veces que la empírica cabe en la molecular,
 * x e y los átomos de C y de H de un hidrocarburo (idea 5), p el porcentaje del isótopo liviano (idea 1), X un elemento sin nombre.
 * Mapa de colores (propuesta §8, un color fijo por magnitud): m naranja (c-o), M y la masa atómica turquesa (c-i), n violeta
 * (c-f), N y los porcentajes carmín (c-h; nunca juntos en un ejercicio); Nₐ, fórmulas, subíndices y nombres en tinta; sin
 * verde. Las partículas van con la paleta de elementos (nucleo/elementos.js) y nunca junto a un color de variable. La
 * prueba de la unidad lo revisa.
 * Objetos de la primera pantalla (quim-mol, de prueba): el cuadro del cloro en la tabla de la pared (1), la balanza de
 * cocina con un vaso de agua (2), la caja de tizas (3), el paquete de sal (4), la botella de vinagre (5) y el frasco
 * cerrado sobre la balanza (6).
 * Datos del mundo: masas de los isótopos y abundancias de NIST (Atomic Weights and Isotopic Compositions); masas atómicas
 * de la tabla de IUPAC/CIAAW (tarjeta «Convención del examen» de la idea 2); Nₐ del BIPM (SI 2019). En los ejercicios, las
 * masas atómicas van redondeadas, como en el examen («masas atómicas redondeadas: C = 12…»).
 * Errores: docs/investigacion/estequiometria-ideas-erroneas.md (ES3, ES4, ES6, ES7, ES11, ES13, ES14, ES16 a ES19) y AT4
 * (atomo-enlace); los QM- son hipótesis.
 * Cierre (20 nov, rutinas/auditoria/quimica.mol-y-composicion.md): las masas atómicas de Datos van sin «=» («N 14»), para
 * que «N = n · Nₐ (N: número de entidades)» no comparta letra con el nitrógeno en un mismo recuadro; Nₐ se escribe igual en
 * texto y ecuaciones; un resultado redondeado va con «≈» (`ig`); la balanza va sin su «1» (`numeros: false`).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/mol-composicion/motor.js'))
    : fabrica(root.Kit, root.MotorMol);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MM) {
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
  const idx = (s, n) => ((s % n) + n) % n;
  // ---------- Colores y fichas (un color fijo por magnitud) ----------
  const COL = { masa: 'o', molar: 'i', mol: 'f', num: 'h', pct: 'h' };
  const ficha = mag => t => ({ v: `c-${COL[mag]}`, t: String(t), m: mag });
  const Ms = ficha('masa'), Mm = ficha('molar'), Mo = ficha('mol'), Nn = ficha('num'), Pc = ficha('pct');
  const m_ = Ms('m'), M_ = Mm('M'), n_ = Mo('n'), N_ = Nn('N');
  const NA = { sub: ['N', 'a'] };  // la misma Nₐ del texto (antes N_A en las ecuaciones y Nₐ en el texto)
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = k => (k === 1 ? '' : String(k).split('').map(c => SUBS[+c]).join(''));
  const sup = k => String(k).replace('-', '⁻').split('').map(c => (c === '⁻' ? c : SUPS[+c])).join('');
  // Fórmula del motor («Al2(SO4)3», «CuSO4·5H2O») escrita como en el libro.
  const bonita = t => String(t).split('·').map((p, i) => (i ? p.replace(/^(\d+)/, '$1\u0000') : p).replace(/([A-Za-z)])(\d+)/g, (x, a, d) => a + sub(+d)).replace('\u0000', '')).join('·');
  // Notación científica con coma: 1,20 × 10²⁴. d decimales en la mantisa.
  function cien(x, d = 2) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), man = x / 10 ** e;
    if (Math.abs(+man.toFixed(d)) >= 10) { e += 1; man /= 10; }
    return `${f(man, d)} × 10${sup(e)}`;
  }
  const NAV = 6.02e23, NA_TXT = '6,02 × 10²³';
  // Cierre (20 nov): el valor que se lee en un número escrito («1,71 × 10²¹», «82,4 %», «0,25 mol») y el signo que le toca:
  // «=» si la cuenta da justo eso, «≈» si se redondeó.
  const SUPV = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const leido = t => { const m = String(t).match(/(-?[\d\s]*\d(?:,\d+)?)(?: × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))?/); if (!m) return NaN;
    const v = +m[1].replace(/\s/g, '').replace(',', '.'); return m[2] ? v * 10 ** +m[2].replace('⁻', '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => SUPV.indexOf(c)) : v; };
  // Redacción (26 nov): tolerancia relativa; con la absoluta, «28 / 6,02 × 10²³ = 4,651 × 10⁻²³» salía con «=».
  const ig = (exacto, txt) => (Math.abs(exacto - leido(txt)) <= 1e-9 * Math.abs(exacto) || exacto === leido(txt) ? ' = ' : ' ≈ ');
  // Tres decimales siempre (los aportes de un promedio: «20,030», no «20,03»).
  const f3 = x => x.toFixed(3).replace('.', ',');
  const MASAS = MM.MASAS;
  const Mde = fo => MM.masaMolar(fo).valor;
  const atomosDe = fo => MM.atomos(fo);
  const NOMBRE = { H: 'hidrógeno', C: 'carbono', N: 'nitrógeno', O: 'oxígeno', Na: 'sodio', Mg: 'magnesio', Al: 'aluminio', S: 'azufre', Cl: 'cloro', K: 'potasio',
    Ca: 'calcio', Fe: 'hierro', P: 'fósforo', Cu: 'cobre', Ba: 'bario', Zn: 'zinc', F: 'flúor', Si: 'silicio', Br: 'bromo', Mn: 'manganeso', Cr: 'cromo' };
  // La línea de Datos con las masas atómicas redondeadas que usa un ejercicio, en el orden de la fórmula.
  // Sin «=» (cierre, 20 nov): «N = 14» y «N = n · Nₐ» se leían como la misma N en un mismo recuadro.
  const masasTxt = els => `Masas atómicas redondeadas: ${els.map(e => `${e}\u00a0${f(MASAS[e], 1)}`).join('; ')}`;
  const masasDe = (...fos) => masasTxt([...new Set(fos.flatMap(fo => Object.keys(atomosDe(fo))))]);
  const listaY = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`);
  // Opciones con valores: la correcta y los errores, sin repetir el texto; hasta 4.
  function opciones(bien, malas, fmt) {
    const vistos = new Set([fmt(bien)]), ops = [{ id: 'c', texto: fmt(bien), correcta: true }];
    for (const d of malas) {
      if (!d || d.valor === undefined || d.valor === null || (typeof d.valor === 'number' && (!Number.isFinite(d.valor) || d.valor < 0))) continue;
      const t = fmt(d.valor);
      if (vistos.has(t) || ops.length >= 4) continue;
      vistos.add(t); ops.push({ id: d.id, texto: t, error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }
  const opsTexto = (bien, malas) => opciones(bien, malas.map(([t, id, error, siFuera]) => ({ valor: t, id, error, siFuera })), x => x);

  // ---------- Idea 1 (rehecha, 19 nov): masa atómica promedio ----------
  // Propuesta §3 idea 1. Objeto de la primera pantalla: el cuadro del cloro en la tabla de la pared (quim-mol).
  // Cambia: cuántos de los 25 átomos de la lupa son de cloro-35 · Permanece: las dos masas de los isótopos · Progresa: el
  // promedio se corre hacia el isótopo que más abunda · Se reserva: el magnesio y los tres isótopos (Predice) · Debe verse:
  // que en la lupa solo hay átomos de dos masas y que el promedio cae entre ellas.
  // Errores: QM-PROMEDIO-SIMPLE (el punto medio, sin las abundancias), AT4 (la masa del isótopo más común como masa de
  // todos), QM-PROMEDIO-CRUZADO (cada abundancia con la masa del otro isótopo), QM-ABUND-DIFERENCIA, QM-U-RELATIVA.
  // Masas de los isótopos y abundancias: NIST, Atomic Weights and Isotopic Compositions for All Elements.
  const FUENTE_NIST = 'NIST, Atomic Weights and Isotopic Compositions for All Elements';
  const CL35 = 34.969, CL37 = 36.966;
  const pctCl = n35 => 4 * n35;
  const promCl = n35 => (pctCl(n35) * CL35 + (100 - pctCl(n35)) * CL37) / 100;
  const r2 = x => Math.round(x * 100) / 100;
  function lupaCl(n35, extra = {}) {
    return { pieza: 'quim-particulas', datos: Object.assign({
      atomos: { a: { el: 'Cl', estilo: 'lleno', r: 6 }, b: { el: 'Cl', estilo: 'hueco', r: 7.5 } },
      especies: { c35: [['a', 0, 0]], c37: [['b', 0, 0]] }, separacion: 26, alto: 150,
      cajas: [{ titulo: '25 átomos de cloro', forma: 'caja', particulas: [{ e: 'c35', n: n35 }, { e: 'c37', n: 25 - n35 }],
        cuenta: [{ e: 'c35', texto: `cloro-35: ${n35}` }, { e: 'c37', texto: `cloro-37: ${25 - n35}` }] }],
      alt: `Lupa (un modelo, no a escala) con 25 átomos de cloro: ${n35} de cloro-35, llenos, y ${25 - n35} de cloro-37, huecos.` }, extra), estado: {} };
  }
  function lectura1(n35) {
    const p = pctCl(n35), x = promCl(n35);
    return [Pc(`${p} %`), ' de cloro-35 da ', Mm(`${f(x, 2)} u`), p === 50 ? ', justo al medio' : p > 50 ? ', cerca del cloro-35' : ', cerca del cloro-37'];
  }
  // Las barras de abundancia (quim-composicion): un tramo por isótopo, todos en carmín (son abundancias).
  const barraIso = (titulo, isos) => ({ pieza: 'quim-composicion', datos: { filas: [{ titulo, tramos: isos.map(([nom, p]) => ({ valor: p, texto: `${nom} ${f(p, 2)} %`, color: 'h' })) }],
    alt: `Barra de 100 %: ${isos.map(([nom, p]) => `${nom} ${f(p, 2)} %`).join(', ')}. ${titulo}.` }, estado: {} });
  // En dos renglones (ecuaciones-ancho: la fracción con toda la suma se partía después del «=»).
  const ECU_PROM = ['masa atómica = aporte₁ + aporte₂ + …', SEP, 'aporte = ', Mm('masa'), ' × ', { frac: [Pc('%'), '100'] }];
  const D_PROM = 'masa atómica = masa₁ × %₁ / 100 + masa₂ × %₂ / 100 (+ … con más isótopos)';
  const D_CASI = 'La masa de un isótopo, en u, es casi su número de masa';
  const prom = isos => isos.reduce((a, [, m, p]) => a + m * p / 100, 0);
  // «0,7217 × 84,912 + 0,2783 × 86,909»: la cuenta con las fracciones a la vista.
  const cuentaProm = isos => isos.map(([, m, p]) => `${f(p / 100, 4)} × ${f(m, 3)}`).join(' + ');
  // Lo que aporta cada isótopo, redondeado a 3 decimales, y su suma (la suma de lo que se ve, para que la igualdad cuadre).
  const r3 = x => Math.round(x * 1000) / 1000;
  const aportes = isos => isos.map(([, m, p]) => r3(m * p / 100));
  const aporteTxt = isos => isos.map(([nom, m, p]) => `el ${nom} aporta ${f(p / 100, 4)} × ${f(m, 3)}${ig(m * p / 100, f3(r3(m * p / 100)))}${f3(r3(m * p / 100))}`).join('; ');
  const sumaAportes = isos => { const s = aportes(isos).reduce((a, b) => a + b, 0), t = `${f(s, 2)} u`; return [`${aportes(isos).map(f3).join(' + ')}${ig(s, t)}`, Mm(t)]; };

  // Ejemplos de la idea 1. Cuentas rehechas aparte (verif/cuentas.js): S 8/3 · 12 = 32 · Li 6,94 · Cu 63,55 · Br 79,90 ·
  // 35,5 · Si 28,09 · Ga (69,72 más cerca de 68,926) · Ag 107,87 · otro isótopo 11 · K 39,10 · Cu-63 70 % · Ne 20,19 ·
  // 9 de ⁷X por cada ⁶X · FVV · número de masa 35.
  const isoTxt = isos => isos.map(([nom, m, p]) => `${nom}: ${f(m, 3)} u y ${f(p, 2)} %`);
  const ejProm = (nivel, titulo, enunciado, isos, extra = {}) => Object.assign({ nivel, titulo, enunciado, datos: [...isoTxt(isos), D_PROM],
    solucion: [{ texto: `Cada isótopo aporta su masa por su abundancia entre 100: ${aporteTxt(isos)}.` }, { texto: 'La masa atómica es la suma de los aportes:', ecuacion: sumaAportes(isos) },
      { texto: `El promedio queda entre ${f(Math.min(...isos.map(x => x[1])), 3)} u y ${f(Math.max(...isos.map(x => x[1])), 3)} u, más cerca de la masa del isótopo que más abunda.` }],
    respuesta: [Mm(`${f(prom(isos), 2)} u`)], fuente: FUENTE_NIST }, extra);
  const LI = [['litio-6', 6.015, 7.59], ['litio-7', 7.016, 92.41]], CU = [['cobre-63', 62.930, 69.15], ['cobre-65', 64.928, 30.85]];
  const BR = [['bromo-79', 78.918, 50.69], ['bromo-81', 80.916, 49.31]], AG = [['plata-107', 106.905, 51.84], ['plata-109', 108.905, 48.16]];
  const SI = [['silicio-28', 27.977, 92.23], ['silicio-29', 28.976, 4.68], ['silicio-30', 29.974, 3.09]];
  const K3 = [['potasio-39', 38.964, 93.26], ['potasio-40', 39.964, 0.01], ['potasio-41', 40.962, 6.73]];
  const EJEMPLOS_PROM = [
    { nivel: 1, titulo: 'Un átomo comparado con el carbono', enunciado: 'Un átomo de azufre-32 pesa 8/3 de lo que pesa un átomo de carbono-12. ¿Cuánto pesa en u?',
      datos: ['1 u es la doceava parte de la masa de un átomo de carbono-12', 'Un átomo de carbono-12 pesa 12 u'],
      solucion: [{ texto: 'El átomo de azufre-32 pesa ocho tercios de lo que pesa un carbono-12, que pesa 12 u.', ecuacion: ['8/3 × 12 = ', Mm('32 u')] }], respuesta: [Mm('32 u')] },
    ejProm(1, 'El litio de las baterías', 'El litio de la naturaleza es una mezcla de litio-6 y litio-7. ¿Cuál es su masa atómica?', LI),
    ejProm(1, 'El cobre de los cables', 'El cobre de un cable es una mezcla de cobre-63 y cobre-65. ¿Cuál es su masa atómica?', CU),
    ejProm(1, 'Bromo casi mitad y mitad', 'El bromo tiene dos isótopos casi igual de abundantes. ¿Cuál es su masa atómica?', BR),
    { nivel: 1, titulo: 'Con los números de masa', enunciado: 'De cada 100 átomos de un elemento X, 75 tienen número de masa 35 y 25, número de masa 37. ¿Cuál es su masa atómica?',
      datos: [D_CASI, D_PROM],
      solucion: [{ texto: 'Como la masa de un isótopo es casi su número de masa, se usan 35 u y 37 u, cada una por su abundancia entre 100.', ecuacion: ['0,75 × 35 + 0,25 × 37 = ', Mm('35,5 u')] }], respuesta: [Mm('35,5 u')] },
    ejProm(2, 'Tres isótopos del silicio', 'El silicio de un chip tiene tres isótopos. ¿Cuál es su masa atómica?', SI),
    { nivel: 2, titulo: 'Cuál abunda más', enunciado: 'La masa atómica del galio es 69,72 u. Sus dos isótopos pesan 68,926 u (galio-69) y 70,925 u (galio-71). ¿Cuál abunda más?',
      datos: ['La masa atómica es un promedio de las masas de los isótopos, pesado por sus abundancias'],
      solucion: [{ texto: 'Si los dos isótopos abundaran igual, la masa atómica sería el punto medio de sus masas, 69,93 u.', ecuacion: ['(68,926 + 70,925) / 2 ≈ 69,93 u'] },
        { texto: 'La masa atómica real, 69,72 u, queda por debajo del punto medio y más cerca del galio-69, así que ese isótopo abunda más.' }],
      respuesta: ['El galio-69'], fuente: FUENTE_NIST },
    { nivel: 2, titulo: 'La plata de una medalla', enunciado: 'La plata tiene solo dos isótopos: plata-107, de 106,905 u y 51,84 %, y plata-109, de 108,905 u. ¿Cuál es su masa atómica?',
      datos: ['Las abundancias de todos los isótopos suman 100 %', D_PROM],
      solucion: [{ texto: 'Como las abundancias suman 100 %, la plata-109 es el resto:', ecuacion: ['100 − 51,84 = 48,16 %'] },
        { texto: `Cada isótopo aporta su masa por su abundancia entre 100: ${aporteTxt(AG)}.` }, { texto: 'La masa atómica es la suma de los aportes:', ecuacion: sumaAportes(AG) }],
      respuesta: [Mm(`${f(prom(AG), 2)} u`)], fuente: FUENTE_NIST },
    { nivel: 2, titulo: 'La masa que falta', enunciado: 'Un elemento X tiene dos isótopos: uno de 10 u, con 20 %, y otro, con 80 %. Su masa atómica es 10,8 u. ¿Cuánto pesa el otro isótopo?',
      datos: [D_PROM],
      solucion: [{ texto: 'El isótopo de 10 u aporta 0,20 × 10 = 2 u, así que el otro aporta lo que falta para llegar a 10,8 u.', ecuacion: ['10,8 − 2 = 8,8 u'] },
        { texto: 'Esos 8,8 u son el 80 % de la masa del otro isótopo, así que esa masa sale de dividir entre 0,80.', ecuacion: ['8,8 / 0,80 = ', Mm('11 u')] }],
      respuesta: [Mm('11 u')] },
    ejProm(2, 'Potasio con un isótopo raro', 'El potasio tiene tres isótopos; uno de ellos casi no aparece. ¿Cuál es su masa atómica?', K3),
    { nivel: 3, titulo: 'La abundancia del cobre', enunciado: 'El cobre tiene isótopos de números de masa 63 y 65, y su masa atómica es 63,6 u. ¿Qué porcentaje de sus átomos es cobre-63?',
      alternativas: ['30 %', '50 %', '70 %', '60 %', '0,7 %'], datos: [D_CASI, D_PROM],
      solucion: [{ texto: ['Con ', Pc('p'), ' el porcentaje de cobre-63, el promedio se plantea así:'], ecuacion: ['63 · ', Pc('p'), ' + 65 · (100 − ', Pc('p'), ') = 6360'] },
        { texto: 'Al desarrollar queda 6500 − 2p = 6360, de donde p = 70 %.' },
        { texto: ['La ', letra('A'), ' es el porcentaje del cobre-65. Con la ', letra('B'), ', la masa atómica sería el punto medio, 64 u, y con la ', letra('D'), ' sería 63,8 u.'] },
        { texto: ['La ', letra('E'), ' es la fracción 0,7 escrita como si fuera un porcentaje.'] }],
      respuesta: [letra('C'), ', ', Pc('70 %')] },
    { nivel: 3, titulo: 'El neón de los letreros', enunciado: 'De cada 1000 átomos de neón, 905 son ²⁰Ne, 3 son ²¹Ne y 92 son ²²Ne. ¿Cuál es su masa atómica, con números de masa como masas?',
      alternativas: ['21,00 u', '20,19 u', '20,00 u', '21,81 u', '18,16 u'], datos: [D_CASI, D_PROM],
      solucion: [{ texto: 'Cada isótopo aporta su número de masa por su fracción de los átomos: 0,905 × 20 = 18,1; 0,003 × 21 = 0,063; 0,092 × 22 = 2,024.', ecuacion: ['18,1 + 0,063 + 2,024 ≈ ', Mm('20,19 u')] },
        { texto: ['La ', letra('A'), ' es el promedio simple de 20, 21 y 22, sin las abundancias, y la ', letra('C'), ' es la masa del isótopo más abundante.'] },
        { texto: ['La ', letra('D'), ' sale de cruzar las abundancias del ²⁰Ne y del ²²Ne, y la ', letra('E'), ', de olvidar el ²²Ne.'] }],
      respuesta: [letra('B'), ', ', Mm('20,19 u')] },
    { nivel: 3, titulo: 'Cuántos de cada uno', enunciado: 'Un elemento X tiene isótopos de 6 u y 7 u, y su masa atómica es 6,9 u. ¿Cuántos átomos de 7 u hay por cada átomo de 6 u?',
      alternativas: ['10', '1/9', '0,9', '9', '90'], datos: [D_PROM],
      solucion: [{ texto: ['Con ', Pc('p'), ' el porcentaje del isótopo de 6 u, el promedio se plantea así:'], ecuacion: ['6 · ', Pc('p'), ' + 7 · (100 − ', Pc('p'), ') = 690'] },
        { texto: 'Al desarrollar queda 700 − p = 690, de donde p = 10 %. Los átomos de 7 u son el 90 %, así que por cada átomo de 6 u hay 90 / 10 = 9.' },
        { texto: ['La ', letra('A'), ' es el porcentaje del liviano, y la ', letra('B'), ' es la razón al revés. La ', letra('C'), ' es la fracción del pesado, 0,9, y la ', letra('E'), ', su porcentaje.'] }],
      respuesta: [letra('D'), ', 9'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Sobre el cloro, ¿qué es verdadero (V) y qué es falso (F)? I. Hay átomos de cloro de 35,45 u. II. Su masa atómica queda más cerca de 34,969 u. III. Con 50 % de cada isótopo, sería el punto medio.',
      alternativas: ['VVV', 'FFV', 'VFV', 'FVF', 'FVV'], datos: ['cloro-35: 34,969 u y 75,76 %', 'cloro-37: 36,966 u y 24,24 %', 'Masa atómica del cloro: 35,45 u', D_PROM],
      solucion: [{ texto: 'I es falsa: cada átomo pesa unos 34,969 u o unos 36,966 u; 35,45 u es el promedio.' },
        { texto: 'II es verdadera porque el cloro-35 es el que más abunda. III también es verdadera: con 50 % de cada uno, los dos isótopos cuentan igual en el promedio.' },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' dan por cierto que hay átomos de 35,45 u; la ', letra('B'), ' da por falsa la II, y la ', letra('D'), ', la III.'] }],
      respuesta: [letra('E'), ', FVV'] },
    { nivel: 3, titulo: 'El número de masa del liviano', enunciado: 'Un elemento tiene dos isótopos cuyos números de masa difieren en 2. El liviano es el 60 % y la masa atómica es 35,8 u. ¿Cuál es el número de masa del liviano?',
      alternativas: ['35', '36', '37', '34', '35,8'], datos: [D_CASI, D_PROM],
      solucion: [{ texto: 'Con A el número de masa del liviano, el pesado tiene A + 2.', ecuacion: ['0,6 · A + 0,4 · (A + 2) = 35,8'] },
        { texto: 'Al desarrollar queda A + 0,8 = 35,8, así que A = 35 y el pesado tiene 37.' },
        { texto: 'El 36 redondea la masa atómica, y el 37 es el número de masa del pesado. El 34 sale de restar 2 a 35,8 y redondear, y el 35,8 no puede ser, porque un número de masa es entero.' }],
      respuesta: ['35'] },
  ];

  // Ahora tú y Así se resuelve: listas distintas (resuelve-repite), sin el cloro del juego, el magnesio de Predice ni los
  // casos de los ejemplos (Etapa 5, reglas 8 y 15). Así se resuelve, con elementos reales (NIST); Ahora tú, con un elemento
  // X y números de masa, como en el examen.
  const RES1 = [
    ['rubidio', [['rubidio-85', 84.912, 72.17], ['rubidio-87', 86.909, 27.83]]], ['antimonio', [['antimonio-121', 120.904, 57.21], ['antimonio-123', 122.904, 42.79]]],
    ['iridio', [['iridio-191', 190.961, 37.3], ['iridio-193', 192.963, 62.7]]], ['talio', [['talio-203', 202.972, 29.52], ['talio-205', 204.974, 70.48]]],
    ['europio', [['europio-151', 150.920, 47.81], ['europio-153', 152.921, 52.19]]],
  ];
  const RELATIVA = [['4/3', 4 / 3], ['7/6', 7 / 6], ['5/3', 5 / 3], ['3', 3], ['2', 2], ['9/4', 9 / 4], ['10/3', 10 / 3], ['3/2', 3 / 2]];
  const uTxt = x => `${f(x, 2)} u`;
  function casoDos(r) {
    let a, d, p;
    do { a = r.ent(6, 90); d = r.de([1, 2]); p = 5 * r.ent(3, 17); } while (p === 50 || (a === 35 && d === 2 && p === 75));
    const b = a + d, bien = (p * a + (100 - p) * b) / 100, mas = p > 50 ? a : b;
    return { pregunta: `Un elemento X tiene dos isótopos: ${p} % con número de masa ${a} y ${100 - p} % con número de masa ${b}. ¿Cuál es su masa atómica?`,
      datos: [D_CASI, D_PROM],
      opciones: opciones(bien, [
        { id: 'simple', valor: (a + b) / 2, error: 'QM-PROMEDIO-SIMPLE', siFuera: `La masa atómica sería ${uTxt((a + b) / 2)} si los dos isótopos fueran igual de abundantes; aquí abunda más el de ${mas} u, que jala el promedio hacia su masa.` },
        { id: 'cruzado', valor: ((100 - p) * a + p * b) / 100, error: 'QM-PROMEDIO-CRUZADO', siFuera: `Pesar cada masa por su abundancia está bien, pero las abundancias quedaron cruzadas: el ${p} % va con ${a} u, no con ${b} u.` },
        { id: 'comun', valor: mas, error: 'AT4', siFuera: `Sería ${mas} u si todos los átomos fueran del isótopo que más abunda, pero el otro también aporta y mueve el promedio.` },
      ], uTxt),
      solucion: { texto: 'Cada masa se multiplica por su abundancia entre 100, y los dos productos se suman.', ecuacion: [`${f(p / 100, 2)} × ${a} + ${f((100 - p) / 100, 2)} × ${b} = `, Mm(uTxt(bien))] } };
  }
  function casoTres(r) {
    let a, ps;
    do { a = r.ent(10, 80); const p1 = 5 * r.ent(10, 17), p2 = 5 * r.ent(1, (100 - p1) / 5 - 1); ps = r.baraja([p1, p2, 100 - p1 - p2]); } while (new Set(ps).size < 3 || a === 20);
    const ms = [a, a + 1, a + 2], bien = ms.reduce((t, m, i) => t + m * ps[i] / 100, 0), cr = ms.reduce((t, m, i) => t + m * ps[2 - i] / 100, 0);
    const kmax = ps.indexOf(Math.max(...ps));
    return { pregunta: `Un elemento X tiene tres isótopos, de números de masa ${ms.join(', ').replace(/, (\d+)$/, ' y $1')}, con abundancias de ${ps[0]} %, ${ps[1]} % y ${ps[2]} %. ¿Cuál es su masa atómica?`,
      datos: [D_CASI, D_PROM],
      opciones: opciones(bien, [
        { id: 'simple', valor: a + 1, error: 'QM-PROMEDIO-SIMPLE', siFuera: `La masa atómica sería ${uTxt(a + 1)} si los tres isótopos fueran igual de abundantes, pero sus abundancias son distintas.` },
        { id: 'comun', valor: ms[kmax], error: 'AT4', siFuera: `Sería ${ms[kmax]} u si todos los átomos fueran del isótopo que más abunda, pero los otros dos también aportan al promedio.` },
        { id: 'cruzado', valor: cr, error: 'QM-PROMEDIO-CRUZADO', siFuera: `Pesar cada masa por su abundancia está bien, pero las abundancias quedaron al revés: el ${ps[0]} % va con ${a} u.` },
        { id: 'suma', valor: ms[0] + ms[1] + ms[2], error: 'QM-PROMEDIO-SIMPLE', siFuera: 'Sumar las tres masas no da un promedio: antes de sumar, cada masa se multiplica por su abundancia entre 100.' },
      ], uTxt),
      solucion: { texto: 'Cada masa se multiplica por su abundancia entre 100, y se suman los tres productos.', ecuacion: [`${ms.map((m, i) => `${f(ps[i] / 100, 2)} × ${m}`).join(' + ')} = `, Mm(uTxt(bien))] } };
  }
  function casoAbund(r) {
    let a, p;
    do { a = r.ent(10, 90); p = 5 * r.ent(11, 19); } while ((a === 63 && p === 70) || (a === 35 && p === 75) || (a === 6 && p === 10));
    const b = a + 2, x = a + 2 * (100 - p) / 100;
    return { pregunta: `Un elemento X tiene isótopos de números de masa ${a} y ${b}, y su masa atómica es ${f(x, 2)} u. ¿Qué porcentaje de sus átomos tiene número de masa ${a}?`,
      datos: [D_CASI, D_PROM],
      opciones: opciones(p, [
        { id: 'cruzado', valor: 100 - p, error: 'QM-PROMEDIO-CRUZADO', siFuera: `El planteo del promedio está bien, pero ${100 - p} % es la abundancia del isótopo de ${b} u, no la del de ${a} u.` },
        { id: 'mitad', valor: 50, error: 'QM-PROMEDIO-SIMPLE', siFuera: `Con 50 % de cada uno, el promedio sería ${a + 1} u, no ${f(x, 2)} u.` },
        { id: 'resta', valor: 2 * (100 - p), error: 'QM-ABUND-DIFERENCIA', siFuera: `Restar ${f(x, 2)} − ${a} va bien, pero falta dividir entre 2, la diferencia de masas: eso da el ${100 - p} % del isótopo pesado, no del liviano.` },
      ], x => `${f(x, 0)} %`),
      solucion: { texto: ['Con ', Pc('p'), ` el porcentaje del isótopo de ${a} u, el promedio se plantea así:`], ecuacion: [`${a} · `, Pc('p'), ` + ${b} · (100 − `, Pc('p'), `) = ${100 * a + 2 * (100 - p)}`, SEP, Pc('p'), ' = ', Pc(`${p} %`)] } };
  }
  function casoRelativa(r) {
    const [t, k] = r.de(RELATIVA), bien = 12 * k;
    return { pregunta: `Un átomo de un elemento X pesa ${Number.isInteger(k) ? `${t} veces lo` : `${t} de lo`} que pesa un átomo de carbono-12. ¿Cuánto pesa en u?`,
      datos: ['1 u es la doceava parte de la masa de un átomo de carbono-12', 'Un átomo de carbono-12 pesa 12 u'],
      opciones: opciones(bien, [
        { id: 'sin12', valor: k, error: 'QM-U-RELATIVA', siFuera: `El factor ${t} está bien, pero compara con un átomo de carbono-12 entero, que pesa 12 u, no con 1 u.` },
        { id: 'divide', valor: 12 / k, error: 'QM-U-RELATIVA', siFuera: `Los 12 u están bien, pero se multiplican por ${t}, no se dividen: un átomo de X pesa más que el carbono-12, no menos.` },
        { id: 'doceava', valor: k / 12, error: 'QM-U-RELATIVA', siFuera: 'La doceava parte del carbono-12 es la u, y el átomo de X se compara con el carbono-12 entero, que pesa 12 u.' },
      ], uTxt),
      solucion: { texto: `Un átomo de carbono-12 pesa 12 u, y uno de X pesa ${Number.isInteger(k) ? `${t} veces eso` : `${t} de eso`}.`, ecuacion: [`${t} × 12 = `, Mm(uTxt(bien))] } };
  }

  const masaProm = {
    id: 'masa-atomica-promedio',
    titulo: 'Masa atómica promedio',
    pregunta: '¿De dónde sale el decimal de la masa atómica de la tabla?',
    temas: ['Unidad de masa atómica y masa atómica promedio'],
    pieza: 'quim-particulas',
    aprendizaje: 'La masa atómica de la tabla es el promedio de las masas de los isótopos, pesado por su abundancia; ningún átomo pesa ese promedio.',
    actividad: 'Cambiar cuántos átomos de cada isótopo hay en la lupa y leer la masa promedio.',
    lee: {
      tarjetas: [
        { titulo: 'El cuadro del cloro', texto: 'En la tabla periódica de la pared del aula, el cuadro del cloro trae su número atómico, 17, y su masa atómica, 35,45. Ese decimal no es la masa que tiene cada átomo de cloro.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'tabla', celda: { z: '17', simbolo: 'Cl', masa: '35,45', color: 'i' }, nombre: 'El cuadro del cloro' }, estado: {} } },
        { titulo: 'La unidad u', texto: 'Los átomos se pesan en u, la unidad de masa atómica, que es la doceava parte de la masa de un átomo de carbono-12. Un átomo de cloro-35 pesa 34,969 u, casi lo mismo que su número de masa, 35.' },
        { titulo: 'Dos clases de cloro', texto: 'Todo átomo de cloro tiene 17 protones, pero unos tienen 18 neutrones y otros 20: son dos isótopos, el cloro-35 y el cloro-37. En la naturaleza vienen mezclados, en una proporción que casi no cambia de una muestra a otra.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cambia cuántos de los 25 átomos de la lupa son de cloro-35 y mira hacia dónde se mueve la masa promedio.' },
      ],
    },
    ejemplos: EJEMPLOS_PROM,
    juega: {
      consigna: 'La lupa tiene 25 átomos de cloro: los llenos son cloro-35, de 34,969 u, y los huecos, cloro-37, de 36,966 u.',
      mision: { texto: 'Arma la mezcla de 25 átomos que da 35,45 u, la masa de la tabla.', logrado: v => v.n35 === 19,
        bien: 'Listo: 19 de cada 25 son cloro-35, y el promedio queda cerca de su masa.' },
      voz: 'Cuenta cuántos hay de cada uno: el isótopo que más abunda jala más el promedio.',
      leyenda: [
        { s: 'lleno', t: 'un átomo de cloro-35' },
        { s: 'hueco', t: 'un átomo de cloro-37' },
        { s: Pc('%'), t: 'de cada 100 átomos, cuántos son cloro-35' },
        { s: Mm('u'), t: 'unidad de masa atómica' },
      ],
      controles: [{ id: 'n35', etiqueta: 'átomos de cloro-35', min: 0, max: 25, paso: 1, inicio: 10, decimales: 0 }],
      dibujo: v => lupaCl(v.n35),
      lectura: v => lectura1(v.n35),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-composicion',
      pregunta: 'El magnesio tiene tres isótopos: de cada 100 átomos, 79 son ²⁴Mg, 10 son ²⁵Mg y 11 son ²⁶Mg. ¿Cuál es su masa atómica?',
      datos: ['La masa de cada isótopo es casi su número de masa: 24 u, 25 u y 26 u'],
      voz: 'Piensa hacia qué isótopo se corre el promedio.',
      opciones: [
        { id: 'c', texto: 'Unas 24,3 u', correcta: true },
        { id: 'simple', texto: '25 u', error: 'QM-PROMEDIO-SIMPLE', siFuera: 'El promedio sería 25 u si los tres isótopos fueran igual de abundantes, pero el ²⁴Mg es casi 8 de cada 10 átomos y lo jala hacia 24 u.' },
        { id: 'comun', texto: '24 u', error: 'AT4', siFuera: 'Sería 24 u si todos los átomos fueran ²⁴Mg, pero los otros dos isótopos, más pesados, suben un poco el promedio.' },
        { id: 'cruzado', texto: 'Unas 25,7 u', error: 'QM-PROMEDIO-CRUZADO', siFuera: 'Pesar cada masa por su abundancia está bien, pero aquí las abundancias quedaron cruzadas: el 79 % va con 24 u, no con 26 u.' },
      ],
      dibujo: barraIso('Magnesio: masa atómica ?', [['²⁴Mg', 79], ['²⁵Mg', 10], ['²⁶Mg', 11]]),
      revelar: barraIso(`Magnesio: masa atómica ${f(0.79 * 24 + 0.10 * 25 + 0.11 * 26, 2)} u`, [['²⁴Mg', 79], ['²⁵Mg', 10], ['²⁶Mg', 11]]),
      coincide: `Coincide: 0,79 · 24 + 0,10 · 25 + 0,11 · 26 = ${f(0.79 * 24 + 0.10 * 25 + 0.11 * 26, 2)} u. La tabla dice 24,305 u.`,
      noCoincide: `Cada masa cuenta según su abundancia: 0,79 · 24 + 0,10 · 25 + 0,11 · 26 = ${f(0.79 * 24 + 0.10 * 25 + 0.11 * 26, 2)} u.`,
    },
    mira: {
      datos: lupaCl(19, { cajas: [Object.assign({}, lupaCl(19).datos.cajas[0], { particulas: [{ e: 'c35', n: 19, desde: 1 }, { e: 'c37', n: 6, desde: 2 }],
        cuenta: [{ e: 'c35', texto: 'cloro-35: 19', desde: 1 }, { e: 'c37', texto: 'cloro-37: 6', desde: 2 }] })] }).datos,
      voz: 'Sumemos lo que aporta cada isótopo del cloro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De cada 100 átomos, 75,76 son de cloro-35; en la lupa de 25 se ven 19. Aportan su masa por esa fracción.', ecuacion: [`0,7576 × 34,969 ≈ `, Mm(`${f(0.7576 * CL35, 2)} u`)] },
        { estado: { corte: 2 }, texto: 'Los otros 24,24 de cada 100 son de cloro-37, y aportan su masa por esa fracción.', ecuacion: [`0,2424 × 36,966 ≈ `, Mm(`${f(0.2424 * CL37, 2)} u`)] },
        { estado: { corte: 2 }, texto: 'La suma de los dos aportes es la masa atómica que trae la tabla.', ecuacion: [`${f(r2(0.7576 * CL35), 2)} + ${f(r2(0.2424 * CL37), 2)} = `, Mm(`${f(r2(0.7576 * CL35) + r2(0.2424 * CL37), 2)} u`)] },
        { estado: { corte: 2 }, texto: 'Ningún átomo de cloro pesa 35,45 u: cada uno pesa 34,969 u o 36,966 u, y 35,45 u es el promedio.' },
      ],
    },
    regla: {
      texto: 'La masa atómica de la tabla es un promedio: cada isótopo aporta su masa multiplicada por su abundancia entre 100, y se suman los aportes. Por eso queda más cerca del isótopo que más abunda.',
      ecuacion: ECU_PROM,
      condicion: 'las abundancias de todos los isótopos del elemento suman 100 %.',
      voz: 'Pesa más en el promedio el isótopo que más abunda.',
      dibujo: barraIso('Cloro: masa atómica 35,45 u', [['cloro-35', 75.76], ['cloro-37', 24.24]]),
    },
    resuelve: {
      pieza: 'quim-composicion',
      generar(s) {
        const [nom, isos] = RES1[idx(s, RES1.length)], x = prom(isos), [A, B] = isos;
        return { enunciado: `El ${nom} de la naturaleza es una mezcla de ${A[0]} y ${B[0]}. ¿Cuál es su masa atómica?`, datos: [...isoTxt(isos), D_PROM],
          dibujo: barraIso(`${nom[0].toUpperCase() + nom.slice(1)}: masa atómica ?`, isos.map(([n, , p]) => [n, p])),
          pasos: [
            { tipo: 'pide', texto: `Se pide la masa atómica del ${nom}, en u, que es el promedio de las masas de sus dos isótopos.` },
            { tipo: 'datos', texto: `El ${A[0]} pesa ${f(A[1], 3)} u y es el ${f(A[2], 2)} % de los átomos; el ${B[0]} pesa ${f(B[1], 3)} u y es el ${f(B[2], 2)} %.` },
            { tipo: 'regla', texto: 'Cada isótopo aporta su masa por su abundancia entre 100.', ecuacion: ECU_PROM },
            { tipo: 'cuentas', texto: `Con los datos, ${aporteTxt(isos)}. Los aportes se suman.`, ecuacion: sumaAportes(isos) },
            { tipo: 'sentido', texto: `El resultado queda entre ${f(A[1], 3)} u y ${f(B[1], 3)} u, y más cerca del ${A[2] > B[2] ? A[0] : B[0]}, que es el que más abunda.` },
          ],
          respuesta: [Mm(uTxt(x))] };
      },
    },
    ahoraTu: {
      pieza: 'quim-composicion',
      voz: 'Multiplica cada masa por su abundancia entre 100 y después suma.',
      generar(s) {
        const r = azar(s + 7), tipo = ['dos', 'tres', 'abundancia', 'relativa'][idx(s, 4)];
        return { dos: casoDos, tres: casoTres, abundancia: casoAbund, relativa: casoRelativa }[tipo](r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 19 nov): mol y masa molar ----------
  // Propuesta §3 idea 2. Objeto de la primera pantalla: una balanza de cocina con un vaso de agua (quim-mol).
  // Cambia: la sustancia y los moles en el platillo · Permanece: la pesa de 90 g del otro platillo · Progresa: de pocos a
  // muchos moles; la masa sube con la masa molar · Se reserva: dos sustancias de igual masa (Predice: 18 g de agua contra
  // 18 g de azúcar) · Debe verse: que los mismos moles de dos sustancias pesan distinto.
  // Errores: ES3 (el mol es una masa), ES4 (a igual masa, igual número), ES6 (moléculas por átomos), ES7 (n = m/M al revés),
  // ES18 (la masa molar sin los subíndices), QM-NA (dividir entre Nₐ en vez de multiplicar), QU (mg tomados como g).
  const D_NA = 'Nₐ = 6,02 × 10²³ entidades por mol (número de Avogadro)';
  const D_NM = 'n = m / M (M: la masa molar, en g/mol)';
  const D_NN = 'N = n · Nₐ (N: número de entidades)';
  const D_M = 'M: suma de las masas atómicas de la fórmula, cada una por su subíndice';
  const molTxt = x => `${f(x, 3)} mol`, gTxt = x => `${f(x, 2)} g`, nTxt = (x, que = 'moléculas') => `${cien(x, 3)} ${que}`;
  const SUST2 = { H2O: 'agua', NaCl: 'sal', CaCO3: 'tiza', C2H6O: 'alcohol', C12H22O11: 'azúcar' };
  const PESA = 90;
  function balanza2(k, n) {
    const M = Mde(k), m = n * M;
    // numeros: false (cierre): una sola balanza no lleva el «1» gris. El rastro dice la sustancia por su nombre: la fórmula
    // en la letra de la pieza (sin serifa) se leía mal («NaCI»).
    return { pieza: 'balanza', datos: { unidad: 'g', numeros: false, balanzas: [{ izq: { saco: +m.toFixed(2) }, der: { pesa: PESA }, estado: Math.abs(m - PESA) < 1e-9 ? 'equilibrio' : m > PESA ? 'izq-baja' : 'der-baja' }],
      alt: `Balanza: a la izquierda, ${f(n, 1)} mol de ${bonita(k)} (${SUST2[k]}), que pesan ${f(m, 2)} g; a la derecha, una pesa de ${PESA} g.` },
      estado: { rastros: { 0: [{ t: `${f(n, 1)} mol de ${SUST2[k]}`, c: 'f' }] } } };
  }
  const lectura2 = (k, n) => [n_, ` = ${f(n, 1)} mol de ${bonita(k)}, que pesan `, m_, ` = ${f(n, 1)} · ${f(Mde(k), 1)} = ${f(n * Mde(k), 2)} g`];
  const cuentaM = fo => { const a = atomosDe(fo); return Object.keys(a).map(e => (a[e] > 1 ? `${a[e]} · ${f(MASAS[e], 1)}` : f(MASAS[e], 1))).join(' + '); };
  // «M(H₂O) = 2 · 1 + 16 = 18 g/mol»
  const ecM = fo => [M_, `(${bonita(fo)}) = ${cuentaM(fo)} = `, Mm(`${f(Mde(fo), 1)} g/mol`)];
  // Corta: la suma va en el texto del paso y la ecuación solo dice el resultado (ecuaciones-ancho).
  const ecMc = fo => [M_, `(${bonita(fo)}) = `, Mm(`${f(Mde(fo), 1)} g/mol`)];

  // Ejemplos de la idea 2. Cuentas rehechas aparte (verif/cuentas.js): 54 g de agua 3 mol · M(CO₂) 44 · 2 mol de O₂
  // 1,204 × 10²⁴ · 0,5 mol de NaCl 29,25 g · 6,02 × 10²³ átomos de Fe 56 g · 88 g de CO₂ 1,204 × 10²⁴ · M(Ca(OH)₂) 74 ·
  // 3,01 × 10²³ de H₂O 9 g · una molécula de agua 2,99 × 10⁻²³ g · 10 g de H₂ 5 mol y de O₂ 0,3125 mol · paracetamol
  // 3,31 mmol · agua del cuerpo 1,00 × 10²⁷ · M = 44 (CO₂) · cafeína 2,95 × 10²⁰ · FVF.
  const EJEMPLOS_MOL = [
    { nivel: 1, titulo: 'Moles de agua', enunciado: 'Un vaso tiene 54 g de agua, H₂O. ¿Cuántos moles de agua son?', datos: [masasDe('H2O'), D_NM],
      solucion: [{ texto: 'Primero, la masa molar del agua:', ecuacion: ecM('H2O') }, { texto: 'Los moles salen de dividir los gramos entre la masa molar:', ecuacion: [n_, ' = ', { frac: ['54', '18'] }, ' = ', Mo('3 mol')] }],
      respuesta: [Mo('3 mol')] },
    { nivel: 1, titulo: 'La masa molar del CO₂', enunciado: '¿Cuál es la masa molar del dióxido de carbono, CO₂?', datos: [masasDe('CO2'), D_M],
      solucion: [{ texto: 'La fórmula tiene un átomo de carbono y dos de oxígeno.', ecuacion: ecM('CO2') }], respuesta: [Mm('44 g/mol')] },
    { nivel: 1, titulo: 'Moléculas en dos moles', enunciado: '¿Cuántas moléculas hay en 2 mol de oxígeno, O₂?', datos: [D_NA, D_NN],
      solucion: [{ texto: 'Cada mol trae Nₐ moléculas, así que 2 mol traen el doble.', ecuacion: [N_, ' = 2 · 6,02 × 10²³ = ', Nn(nTxt(2 * NAV))] }], respuesta: [Nn(nTxt(2 * NAV))] },
    { nivel: 1, titulo: 'Media mol de sal', enunciado: '¿Cuántos gramos pesan 0,5 mol de sal, NaCl?', datos: [masasDe('NaCl'), 'm = n · M'],
      solucion: [{ texto: 'La masa molar es M(NaCl) = 23 + 35,5 = 58,5 g/mol, y se multiplica por los moles.', ecuacion: [m_, ' = 0,5 · 58,5 = ', Ms('29,25 g')] }], respuesta: [Ms('29,25 g')] },
    { nivel: 1, titulo: 'Un mol de átomos de hierro', enunciado: '¿Cuántos gramos pesan 6,02 × 10²³ átomos de hierro, Fe?', datos: [masasDe('Fe'), D_NA],
      solucion: [{ texto: 'Son Nₐ átomos, es decir, un mol, y un mol de átomos de Fe pesa su masa atómica en gramos.', ecuacion: [m_, ' = 1 · 56 = ', Ms('56 g')] }], respuesta: [Ms('56 g')] },
    { nivel: 2, titulo: 'De gramos a moléculas', enunciado: '¿Cuántas moléculas hay en 88 g de CO₂?', datos: [masasDe('CO2'), D_NM, D_NN, D_NA],
      solucion: [{ texto: 'Con M(CO₂) = 12 + 2 · 16 = 44 g/mol, los moles son:', ecuacion: [n_, ' = ', { frac: ['88', '44'] }, ' = ', Mo('2 mol')] },
        { texto: 'Cada mol trae Nₐ moléculas:', ecuacion: [N_, ' = 2 · 6,02 × 10²³ = ', Nn(nTxt(2 * NAV))] }], respuesta: [Nn(nTxt(2 * NAV))] },
    { nivel: 2, titulo: 'Masa molar con paréntesis', enunciado: 'La cal apagada es Ca(OH)₂. ¿Cuál es su masa molar?', datos: [masasDe('Ca(OH)2'), D_M, 'El subíndice de afuera del paréntesis multiplica todo lo de adentro'],
      solucion: [{ texto: 'Hay un Ca, dos O y dos H, porque el 2 de afuera repite el grupo OH.', ecuacion: [M_, ' = 40 + 2 · (16 + 1) = ', Mm('74 g/mol')] }], respuesta: [Mm('74 g/mol')] },
    { nivel: 2, titulo: 'De moléculas a gramos', enunciado: 'El agua de una cuchara tiene 3,01 × 10²³ moléculas de H₂O. ¿Cuántos gramos pesa?', datos: [masasDe('H2O'), D_NA, D_NN, 'm = n · M'],
      solucion: [{ texto: 'Los moles salen de dividir las moléculas entre Nₐ:', ecuacion: [n_, ' = ', { frac: ['3,01 × 10²³', '6,02 × 10²³'] }, ' = ', Mo('0,5 mol')] },
        { texto: 'Con M(H₂O) = 18 g/mol, la masa es:', ecuacion: [m_, ' = 0,5 · 18 = ', Ms('9 g')] }], respuesta: [Ms('9 g')] },
    { nivel: 2, titulo: 'Una sola molécula de agua', enunciado: '¿Cuántos gramos pesa una sola molécula de agua, H₂O?', datos: [masasDe('H2O'), D_NA, 'Un mol de agua pesa M gramos y tiene Nₐ moléculas'],
      solucion: [{ texto: 'Un mol de agua pesa 18 g y tiene Nₐ moléculas, así que cada una pesa 18 g entre Nₐ.', ecuacion: [{ frac: ['18', '6,02 × 10²³'] }, ig(18 / NAV, cien(18 / NAV, 2)), Ms(`${cien(18 / NAV, 2)} g`)] }], respuesta: [Ms(`${cien(18 / NAV, 2)} g`)] },
    { nivel: 2, titulo: 'Igual masa, otros moles', enunciado: 'Un globo grande tiene 10 g de hidrógeno, H₂, y otro, 10 g de oxígeno, O₂. ¿Cuántos moles hay en cada uno?', datos: [masasDe('H2', 'O2'), D_NM],
      solucion: [{ texto: 'Las masas molares son M(H₂) = 2 g/mol y M(O₂) = 32 g/mol.', ecuacion: [n_, '(H₂) = ', { frac: ['10', '2'] }, ' = 5 mol', SEP, n_, '(O₂) = ', { frac: ['10', '32'] }, ' = 0,3125 mol'] },
        { texto: 'Con la misma masa hay más moles del gas de menor masa molar: del hidrógeno hay 16 veces más.' }],
      respuesta: [Mo('5 mol'), ' de H₂ y ', Mo('0,3125 mol'), ' de O₂'] },
    { nivel: 3, titulo: 'La tableta de paracetamol', enunciado: 'Una tableta tiene 500 mg de paracetamol, C₈H₉NO₂. ¿Cuántos milimoles de paracetamol tiene?',
      alternativas: ['3,31 mmol', '0,302 mmol', '3,31 mol', '11,6 mmol', '33,1 mmol'], datos: [masasDe('C8H9NO2'), '1 g = 1000 mg; 1 mol = 1000 mmol', D_NM],
      solucion: [{ texto: 'La masa molar es M = 8 · 12 + 9 · 1 + 14 + 2 · 16 = 151 g/mol, y 500 mg son 0,5 g.', ecuacion: [n_, ' = ', { frac: ['0,5', '151'] }, ' ≈ ', Mo('0,00331 mol')] },
        { texto: ['Esos 0,00331 mol son 3,31 mmol. La ', letra('B'), ' invierte n = m/M, y la ', letra('C'), ' toma los 500 mg como si fueran 500 g.'] },
        { texto: ['La ', letra('D'), ' suma cada masa atómica una sola vez, sin los subíndices, y usa 43 g/mol; la ', letra('E'), ' corre la coma un lugar.'] }],
      respuesta: [letra('A'), ', ', Mo('3,31 mmol')] },
    { nivel: 3, titulo: 'El agua de tu cuerpo', enunciado: 'Una estudiante de 50 kg tiene unos 60 % de su masa en agua. ¿Cuántas moléculas de agua tiene, más o menos?',
      alternativas: ['1,67 × 10²⁷', '1,67 × 10³', '1,00 × 10²⁷', '1,00 × 10²⁴', '1,81 × 10²⁸'], datos: [masasDe('H2O'), '1 kg = 1000 g', D_NM, D_NN, D_NA],
      solucion: [{ texto: 'El agua es el 60 % de 50 kg, es decir, 30 kg o 30 000 g.', ecuacion: [n_, ' = ', { frac: ['30 000', '18'] }, ' ≈ 1667 mol'] },
        { texto: 'Las moléculas son los moles por Nₐ:', ecuacion: [N_, ' ≈ 1667 · 6,02 × 10²³ ≈ ', Nn('1,00 × 10²⁷')] },
        { texto: ['La ', letra('A'), ' olvida el 60 %, y la ', letra('B'), ' da los moles, no las moléculas. La ', letra('D'), ' toma los 30 kg como si fueran 30 g, y la ', letra('E'), ' no divide entre 18.'] }],
      respuesta: [letra('C'), ', ', Nn('1,00 × 10²⁷')] },
    { nivel: 3, titulo: 'Qué gas es', enunciado: 'Una muestra de 0,25 mol de un gas pesa 11 g. ¿Cuál de estos gases puede ser?',
      alternativas: ['N₂', 'O₂', 'CH₄', 'SO₂', 'CO₂'], datos: [masasDe('N2', 'CH4', 'SO2', 'CO2'), D_NM],
      solucion: [{ texto: 'La masa molar sale de despejar M en n = m/M:', ecuacion: [M_, ' = ', { frac: ['11', '0,25'] }, ' = ', Mm('44 g/mol')] },
        { texto: 'Las masas molares son N₂ 28, O₂ 32, CH₄ 16, SO₂ 64 y CO₂ 44 g/mol, así que solo el CO₂ calza.' },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ', la ', letra('C'), ' y la ', letra('D'), ' tienen otra masa molar.'] }],
      respuesta: [letra('E'), ', CO₂'] },
    { nivel: 3, titulo: 'La cafeína de una taza', enunciado: 'Una taza de café tiene unos 95 mg de cafeína, C₈H₁₀N₄O₂ (194 g/mol). ¿Cuántas moléculas de cafeína tiene?',
      alternativas: ['2,95 × 10²³', '2,95 × 10²⁰', '4,90 × 10⁻⁴', '1,23 × 10²⁷', '8,14 × 10⁻²⁸'], datos: ['1 g = 1000 mg', D_NM, D_NN, D_NA],
      solucion: [{ texto: 'Primero se pasa a gramos: 95 mg son 0,095 g, y los moles son:', ecuacion: [n_, ' = ', { frac: ['0,095', '194'] }, ' ≈ 4,90 × 10⁻⁴ mol'] },
        { texto: 'Las moléculas son los moles por Nₐ:', ecuacion: [N_, ' ≈ 4,90 × 10⁻⁴ · 6,02 × 10²³ ≈ ', Nn('2,95 × 10²⁰')] },
        { texto: ['La ', letra('A'), ' toma los 95 mg como si fueran 95 g, y la ', letra('C'), ' da los moles. La ', letra('D'), ' invierte n = m/M, y la ', letra('E'), ' divide los moles entre Nₐ en vez de multiplicar.'] }],
      respuesta: [letra('B'), ', ', Nn('2,95 × 10²⁰')] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: '¿Qué es verdadero (V) o falso (F)? I. 1 mol de H₂O y 1 mol de CO₂ tienen igual número de moléculas. II. 1 mol de O₂ pesa 16 g. III. 1 mol de NH₃ tiene 6,02 × 10²³ átomos.',
      alternativas: ['VVF', 'VFV', 'FFF', 'VFF', 'VVV'], datos: [masasDe('O2', 'NH3'), D_NA],
      solucion: [{ texto: 'I es verdadera, porque un mol de cualquier sustancia tiene Nₐ entidades. II es falsa: un mol de O₂ pesa 2 · 16 = 32 g.' },
        { texto: 'III es falsa: 1 mol de NH₃ tiene 6,02 × 10²³ moléculas, y como cada una trae 4 átomos, los átomos son cuatro veces más.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' dan por cierto que un mol de O₂ pesa 16 g; la ', letra('B'), ' cuenta las moléculas como si fueran átomos, y la ', letra('C'), ' da por falsa la I.'] }],
      respuesta: [letra('D'), ', VFF'] },
  ];

  // Ahora tú y Así se resuelve: listas distintas (resuelve-repite), sin las sustancias del juego (agua, sal, tiza, alcohol,
  // azúcar), ni las de los ejemplos.
  const AT2 = ['HNO3', 'H3PO4', 'KOH', 'MgO', 'Na2CO3', 'SO2', 'NaOH', 'Ca(OH)2', 'CO', 'N2', 'Fe2O3', 'C3H8', 'K2SO4'];
  // Para contar moléculas, solo sustancias moleculares (un compuesto iónico tiene unidades fórmula).
  const AT2M = ['HNO3', 'H3PO4', 'SO2', 'CO', 'N2', 'C3H8', 'SO3', 'C2H2', 'N2O4', 'PH3'];
  const RES2 = [['NH3', 34], ['CH4', 8], ['O2', 64], ['C6H12O6', 90], ['H2SO4', 49], ['N2O', 22]];
  const DOSIS = [['paracetamol', 'C8H9NO2', 500, 'una tableta'], ['ibuprofeno', 'C13H18O2', 400, 'una tableta'], ['ácido acetilsalicílico', 'C9H8O4', 500, 'una tableta'],
    ['vitamina C', 'C6H8O6', 500, 'una tableta'], ['ibuprofeno', 'C13H18O2', 200, 'una cápsula']];
  const sinSub = fo => MM.masaMolar(fo).sinSubindices;
  function casoGramosMoles(r) {
    const fo = r.de(AT2), M = Mde(fo), n = r.de([0.25, 0.5, 1.5, 2, 2.5, 3, 4, 5]), m = n * M;
    return { pregunta: `¿Cuántos moles hay en ${f(m, 2)} g de ${bonita(fo)}?`, datos: [masasDe(fo), D_M, D_NM],
      opciones: opciones(n, [
        { id: 'inv', valor: M / m, error: 'ES7', siFuera: `La masa molar, ${f(M, 1)} g/mol, está bien, pero va abajo: n = m/M, porque más gramos tienen que dar más moles.` },
        { id: 'sinsub', valor: m / sinSub(fo), error: 'ES18', siFuera: `Dividir entre la masa molar está bien, pero en ella cada masa atómica va por su subíndice, y así no da ${f(sinSub(fo), 1)} g/mol.` },
        { id: 'masa', valor: m, error: 'ES3', siFuera: 'Ese número son los gramos, y un mol no es un gramo: falta dividir la masa entre la masa molar.' },
      ], molTxt),
      solucion: { texto: `La masa molar es M(${bonita(fo)}) = ${cuentaM(fo)} = ${f(M, 1)} g/mol, y la masa se divide entre ella.`, ecuacion: [n_, ' = ', { frac: [f(m, 2), f(M, 1)] }, ' = ', Mo(molTxt(n))] } };
  }
  function casoMolesMasa(r) {
    const fo = r.de(AT2), M = Mde(fo), n = r.de([0.2, 0.25, 0.5, 1.5, 2.5, 3, 4]), m = n * M;
    return { pregunta: `¿Cuántos gramos pesan ${f(n, 2)} mol de ${bonita(fo)}?`, datos: [masasDe(fo), D_M, 'm = n · M'],
      opciones: opciones(m, [
        { id: 'inv', valor: M / n, error: 'ES7', siFuera: `La masa molar está bien, pero se multiplica por los moles: ${f(n, 2)} mol pesan ${f(n, 2)} veces lo que pesa un mol.` },
        { id: 'sinsub', valor: n * sinSub(fo), error: 'ES18', siFuera: `Multiplicar está bien, pero en la masa molar cada masa atómica va por su subíndice, y así no da ${f(sinSub(fo), 1)} g/mol.` },
        { id: 'uno', valor: M, error: 'ES3', siFuera: `Eso es lo que pesa un mol, y aquí hay ${f(n, 2)} mol: falta multiplicar por ${f(n, 2)}.` },
      ], gTxt),
      solucion: { texto: `La masa molar es M(${bonita(fo)}) = ${cuentaM(fo)} = ${f(M, 1)} g/mol, y se multiplica por los moles.`, ecuacion: [m_, ` = ${f(n, 2)} · ${f(M, 1)} = `, Ms(gTxt(m))] } };
  }
  function casoMolesN(r) {
    const fo = r.de(AT2M), n = r.de([0.25, 0.5, 1.5, 2, 2.5, 3, 4]), at = MM.totalAtomos(fo);
    return { pregunta: `¿Cuántas moléculas hay en ${f(n, 2)} mol de ${bonita(fo)}?`, datos: [D_NA, D_NN],
      opciones: opciones(n * NAV, [
        { id: 'div', valor: NAV / n, error: 'QM-NA', siFuera: `Usar Nₐ está bien, pero cada mol trae Nₐ moléculas, así que Nₐ se multiplica por ${f(n, 2)}, no se divide.` },
        { id: 'uno', valor: NAV, error: 'ES6', siFuera: `Esas son las moléculas de un solo mol, y aquí hay ${f(n, 2)} mol.` },
        { id: 'atomos', valor: n * NAV * at, error: 'ES6', siFuera: `Ese número cuenta átomos: cada molécula de ${bonita(fo)} trae ${at}, y se piden moléculas.` },
      ], x => cien(x, 3)),
      solucion: { texto: 'Cada mol trae Nₐ moléculas, así que los moles se multiplican por Nₐ.', ecuacion: [N_, ` = ${f(n, 2)} · 6,02 × 10²³ = `, Nn(cien(n * NAV, 3))] } };
  }
  function casoUnaMolecula(r) {
    const fo = r.de(AT2M), M = Mde(fo), bien = M / NAV;
    return { pregunta: `¿Cuántos gramos pesa una sola molécula de ${bonita(fo)}?`, datos: [masasDe(fo), D_M, D_NA, 'Un mol pesa M gramos y tiene Nₐ moléculas'],
      opciones: opciones(bien, [
        { id: 'por', valor: M * NAV, error: 'QM-NA', siFuera: `Usar ${f(M, 1)} g y Nₐ está bien, pero un mol se reparte entre Nₐ moléculas, así que se divide, no se multiplica.` },
        { id: 'mol', valor: M, error: 'ES1', siFuera: `${f(M, 1)} g es lo que pesa un mol entero; una sola molécula pesa ${f(M, 1)} u, que en gramos es muchísimo menos.` },
        { id: 'inv', valor: NAV / M, error: 'ES7', siFuera: 'Dividir está bien, pero la fracción quedó al revés: la masa del mol va arriba y Nₐ, abajo.' },
      ], x => `${cien(x, 3)} g`),
      solucion: { texto: `Un mol pesa ${f(M, 1)} g y tiene Nₐ moléculas, así que cada una pesa ${f(M, 1)} g entre Nₐ.`, ecuacion: [{ frac: [f(M, 1), '6,02 × 10²³'] }, ig(bien, cien(bien, 3)), Ms(`${cien(bien, 3)} g`)] } };
  }
  function casoDosis(r) {
    const [nom, fo, mg, que] = r.de(DOSIS), M = Mde(fo), n = mg / 1000 / M, bien = n * NAV;
    return { pregunta: `${que[0].toUpperCase() + que.slice(1)} de ${nom}, ${bonita(fo)}, tiene ${mg} mg. ¿Cuántas moléculas de ${nom} tiene?`,
      datos: [masasDe(fo), D_M, '1 g = 1000 mg', D_NM, D_NN, D_NA],
      opciones: opciones(bien, [
        { id: 'mg', valor: mg / M * NAV, error: 'QU', siFuera: `El camino está bien, pero ${mg} mg son ${f(mg / 1000, 2)} g, y hay que pasar a gramos antes de dividir entre la masa molar.` },
        { id: 'inv', valor: M / (mg / 1000) * NAV, error: 'ES7', siFuera: `Pasar a ${f(mg / 1000, 2)} g está bien, pero n = m/M: la masa molar va abajo, no arriba.` },
        { id: 'div', valor: n / NAV, error: 'QM-NA', siFuera: 'Los moles están bien, pero cada mol trae Nₐ moléculas, así que se multiplica por Nₐ, no se divide.' },
      ], x => cien(x, 3)),
      solucion: { texto: `La masa molar es ${f(M, 1)} g/mol y ${mg} mg son ${f(mg / 1000, 2)} g; los moles por Nₐ dan las moléculas.`, ecuacion: [N_, ' = ', { frac: [f(mg / 1000, 2), f(M, 1)] }, ` · 6,02 × 10²³${ig(bien, cien(bien, 3))}`, Nn(cien(bien, 3))] } };
  }

  const mol = {
    id: 'mol-masa-molar',
    titulo: 'Mol y masa molar',
    pregunta: '¿Cómo se cuentan átomos y moléculas pesándolos?',
    temas: ['Número de Avogadro y mol', 'Masa molar'],
    pieza: 'balanza',
    aprendizaje: 'Un mol son 6,02 × 10²³ entidades y la masa molar es lo que pesa un mol: n = m/M y N = n · Nₐ.',
    actividad: 'Poner moles de una sustancia en la balanza hasta igualar una pesa.',
    lee: {
      tarjetas: [
        { titulo: 'Pesar para contar', texto: 'En la bodega, el arroz se vende por kilo y nadie cuenta los granos. Con los átomos pasa algo parecido: son tan pequeños que se cuentan pesándolos. La balanza de la figura pesa un vaso con 18 g de agua.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'balanza', etiqueta: '18 g', nombre: 'Un vaso de agua en la balanza' }, estado: {} } },
        { titulo: 'El mol, una docena enorme', texto: 'Así como una docena son 12 cosas, un mol son 6,02 × 10²³ entidades: átomos, moléculas o iones. Ese número se llama número de Avogadro, Nₐ. En esta unidad, n son los moles y N es el número de entidades, no el de neutrones.',
          ecuacion: [NA, ' = 6,02 × 10²³ por mol'] },
        { titulo: 'Lo que pesa un mol', texto: 'Un átomo de carbono-12 pesa 12 u, y un mol de esos átomos pesa 12 g. Lo mismo vale para cualquier sustancia: su masa molar, M, en g/mol, tiene el mismo número que la masa de su fórmula en u.' },
        { titulo: 'Convención del examen', texto: 'En el examen se usan masas atómicas redondeadas (H 1, C 12, O 16, Cl 35,5) y Nₐ = 6,02 × 10²³. En la universidad verás las de la IUPAC, con más decimales: H 1,008; C 12,011; O 15,999; Cl 35,45.' },
      ],
    },
    ejemplos: EJEMPLOS_MOL,
    juega: {
      consigna: ['Un platillo lleva la sustancia y el otro, una pesa de 90 g. La masa molar, ', M_, ', es lo que pesa un mol.'],
      mision: { texto: 'Equilibra la pesa de 90 g con agua.', logrado: v => v.k === 'H2O' && Math.abs(v.n - 5) < 1e-9,
        bien: 'Listo: cinco veces 18 g de agua dan justo los 90 g de la pesa.' },
      voz: 'Si pones los mismos moles de otra sustancia, ¿pesan lo mismo?',
      leyenda: [
        { s: n_, t: 'cantidad de sustancia, en moles' },
        { s: m_, t: 'masa en el platillo, en gramos' },
        { s: M_, t: 'masa molar: los gramos de un mol' },
      ],
      controles: [
        { id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(SUST2).map(k => ({ valor: k, texto: `${SUST2[k]}, ${bonita(k)}` })) },
        { id: 'n', etiqueta: 'n', color: 'c-f', min: 0.5, max: 6, paso: 0.5, inicio: 1, unidad: 'mol', decimales: 1 },
      ],
      dibujo: v => balanza2(v.k, v.n),
      lectura: v => lectura2(v.k, v.n),
      minimo: 4,
    },
    predice: {
      pieza: 'balanza',
      pregunta: 'Un vaso tiene 18 g de agua y otro, 18 g de azúcar. ¿Dónde hay más moléculas?',
      datos: ['M del agua, H₂O: 18 g/mol', 'M del azúcar, C₁₂H₂₂O₁₁: 342 g/mol'],
      voz: 'Piensa cuánto pesa una sola molécula de cada uno.',
      opciones: [
        { id: 'c', texto: 'En el agua: unas 19 veces más', correcta: true },
        { id: 'igual', texto: 'Igual en los dos: pesan lo mismo', error: 'ES4', siFuera: 'Habría igual número de moléculas con 1 mol de cada uno, no con la misma masa: en 18 g caben más moléculas si cada una pesa menos.' },
        { id: 'azucar', texto: 'En el azúcar: cada molécula trae más átomos', error: 'ES6', siFuera: 'Es cierto que cada molécula de azúcar trae más átomos, pero por eso mismo pesa más, y en 18 g caben menos moléculas.' },
        { id: 'nose', texto: 'No se sabe sin contarlas una por una', error: 'ES3', siFuera: 'No hace falta contarlas: la masa molar dice cuánto pesa un mol, así que con la masa se sabe cuántos moles, y cuántas moléculas, hay.' },
      ],
      dibujo: { datos: { unidad: 'g', numeros: false, balanzas: [{ izq: { saco: 18 }, der: { saco: 18 }, estado: 'equilibrio' }], alt: 'Balanza en equilibrio: 18 g de agua a la izquierda y 18 g de azúcar a la derecha.' },
        estado: { rastros: { 0: ['izquierda: agua · derecha: azúcar'] } } },
      revelar: { datos: { unidad: 'g', numeros: false, balanzas: [{ izq: { saco: 18 }, der: { saco: 18 }, estado: 'equilibrio' }], alt: 'La balanza sigue en equilibrio, pero el agua tiene 1 mol y el azúcar solo unos 0,053 mol.' },
        estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }, ' · ', { t: 'azúcar: 0,053 mol', c: 'f' }] } } },
      coincide: `Coincide: 18 g de agua son 1 mol; 18 g de azúcar, solo 18/342 ≈ ${f(18 / 342, 3)} mol.`,
      noCoincide: `En 18 g de agua hay 1 mol, y en 18 g de azúcar solo 18/342 ≈ ${f(18 / 342, 3)} mol: 19 veces menos moles, y por eso 19 veces menos moléculas.`,
    },
    mira: {
      datos: { unidad: 'g', numeros: false, balanzas: [{ izq: { saco: 18 }, der: { saco: 18 }, estado: 'equilibrio' }], alt: 'Balanza con 18 g de agua a la izquierda y 18 g de azúcar a la derecha, en equilibrio.' },
      voz: 'Separemos contar de pesar.',
      pasos: [
        { estado: { rastros: { 0: ['izquierda: agua · derecha: azúcar'] } }, texto: 'Un mol de cualquier sustancia tiene el mismo número de entidades: el número de Avogadro.', ecuacion: [NA, ' = 6,02 × 10²³ por mol'] },
        { estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }] } }, texto: 'Como la masa molar del agua es 18 g/mol, sus 18 g son justo un mol.', ecuacion: [n_, ' = ', { frac: ['18', '18'] }, ' = ', Mo('1 mol')] },
        { estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }, ' · ', { t: 'azúcar: 0,053 mol', c: 'f' }] } }, texto: 'La masa molar del azúcar es 342 g/mol, así que sus 18 g son mucho menos de un mol.', ecuacion: [n_, ' = ', { frac: ['18', '342'] }, ' ≈ ', Mo(`${f(18 / 342, 3)} mol`)] },
        { estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }, ' · ', { t: 'azúcar: 0,053 mol', c: 'f' }] } }, texto: 'El número de moléculas de agua es el de moles por Nₐ.', ecuacion: [N_, ' = 1 · 6,02 × 10²³ = ', Nn('6,02 × 10²³')] },
        { estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }, ' · ', { t: 'azúcar: 0,053 mol', c: 'f' }] } }, texto: 'En el azúcar hay 19 veces menos moléculas que en el agua.', ecuacion: [N_, ` ≈ ${f(18 / 342, 3)} · 6,02 × 10²³ ≈ `, Nn(cien(18 / 342 * NAV, 2))] },
        { estado: { rastros: { 0: [{ t: 'agua: 1 mol', c: 'f' }, ' · ', { t: 'azúcar: 0,053 mol', c: 'f' }] } }, texto: 'Cada molécula de azúcar pesa 19 veces lo que una de agua; por eso, a igual masa, hay más moléculas de agua.', ecuacion: ['342 / 18 = 19'] },
      ],
    },
    regla: {
      texto: 'Un mol tiene 6,02 × 10²³ entidades, y la masa molar M, en g/mol, es lo que pesa un mol. Los moles n salen de dividir la masa entre M, y N, el número de entidades, es n por Nₐ.',
      ecuacion: [n_, ' = ', { frac: [m_, M_] }, SEP, N_, ' = ', n_, ' · ', NA],
      condicion: 'la masa molar suma cada masa atómica por su subíndice y queda dicho qué entidades se cuentan: moléculas, átomos o iones.',
      voz: 'Contar y pesar son dos cosas: el mol las une.',
      dibujo: { pieza: 'quim-mol', datos: { vista: 'cuenta', formula: 'H₂O', cabeza: ['átomos', 'masa (g/mol)'],
        filas: [{ el: 'H', por: '2', total: '2 · 1 = 2' }, { el: 'O', por: '1', total: '16' }, { el: '', por: 'M:', total: '18 g/mol', color: 'i' }] }, estado: {} },
    },
    resuelve: {
      pieza: 'quim-mol',
      generar(s) {
        const [fo, m] = RES2[idx(s, RES2.length)], M = Mde(fo), n = m / M;
        return { enunciado: `¿Cuántas moléculas hay en ${m} g de ${bonita(fo)}?`, datos: [masasDe(fo), D_M, D_NM, D_NN, D_NA],
          pasos: [
            { tipo: 'pide', texto: `Se pide el número de moléculas, N, que hay en ${m} g de ${bonita(fo)}.` },
            { tipo: 'datos', texto: `Se conoce la masa, ${m} g, y las masas atómicas de los elementos de la fórmula.` },
            { tipo: 'regla', texto: 'Primero se calculan los moles con la masa molar, y después cada mol se multiplica por Nₐ.', ecuacion: [n_, ' = ', { frac: [m_, M_] }, SEP, N_, ' = ', n_, ' · ', NA] },
            { tipo: 'cuentas', texto: `La masa molar es ${cuentaM(fo)} = ${f(M, 1)} g/mol, y con ella salen los moles:`, ecuacion: [n_, ' = ', { frac: [String(m), f(M, 1)] }, ' = ', Mo(molTxt(n))] },
            { tipo: 'cuentas', texto: 'Las moléculas son los moles por Nₐ:', ecuacion: [N_, ` = ${f(n, 3)} · 6,02 × 10²³ = `, Nn(cien(n * NAV, 3))] },
            { tipo: 'sentido', texto: n < 1 ? 'Hay menos de un mol, así que el resultado tiene que ser menor que 6,02 × 10²³ moléculas.' : 'Hay más de un mol, así que el resultado tiene que pasar de 6,02 × 10²³ moléculas.' },
          ],
          respuesta: [Nn(`${cien(n * NAV, 3)} moléculas`)] };
      },
    },
    ahoraTu: {
      voz: 'Empieza por la masa molar y después saca los moles.',
      generar(s) {
        const r = azar(s + 13), tipo = ['gramosMoles', 'molesN', 'molesMasa', 'unaMolecula', 'dosis'][idx(s, 5)];
        return { gramosMoles: casoGramosMoles, molesMasa: casoMolesMasa, molesN: casoMolesN, unaMolecula: casoUnaMolecula, dosis: casoDosis }[tipo](r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): moles de átomos en una fórmula ----------
  // Propuesta §3 idea 3. Objeto de la primera pantalla: una caja de tizas (CaCO₃, quim-mol).
  // Cambia: la sustancia y cuántas moléculas hay en la lupa · Permanece: la cuenta de átomos por elemento, abajo ·
  // Progresa: de una molécula a seis; cada elemento crece por su subíndice · Se reserva: el paréntesis (ninguna fórmula
  // del juego lo tiene; Predice: el Al₂(SO₄)₃) · Debe verse: que los átomos de cada elemento son moléculas × subíndice.
  // Errores: ES18 (el subíndice de afuera del paréntesis olvidado), QM-POR-N (los átomos de una sola unidad), ES14 (los
  // moles del compuesto como moles del elemento), ES11 (suma de subíndices sueltos), ES6 (moléculas por átomos),
  // QM-IONES-UNO (contar un solo tipo de ion), QM-IONES-ATOMOS (contar átomos en vez de iones).
  // Las partículas van con la paleta de elementos (nucleo/elementos.js): es un dibujo de partículas, sin variables.
  const LUPA_AT = { H: { el: 'H', estilo: 'hueco', r: 6 }, O: { el: 'O', estilo: 'lleno', r: 8 }, C: { el: 'C', estilo: 'lleno', r: 7.5 }, N: { el: 'N', estilo: 'hueco', r: 8 }, S: { el: 'S', estilo: 'lleno', r: 9 } };
  const MOLEC0 = {
    H2O: [['O', 0, 0], ['H', -7, 6], ['H', 7, 6]], CO2: [['C', 0, 0], ['O', -10, 0], ['O', 10, 0]], NH3: [['N', 0, -2], ['H', -8, 5], ['H', 8, 5], ['H', 0, 9]],
    CH4: [['C', 0, 0], ['H', -8, -6], ['H', 8, -6], ['H', -8, 6], ['H', 8, 6]], H2SO4: [['S', 0, 0], ['O', -9, -7], ['O', 9, -7], ['O', -9, 7], ['O', 9, 7], ['H', -17, -7], ['H', 17, 7]],
    C2H6O: [['C', -6, 0], ['C', 6, 0], ['O', 15, -5], ['H', 18, 3], ['H', -12, -7], ['H', -14, 4], ['H', -6, 9], ['H', 6, -9], ['H', 9, 8]],
  };
  // Las mismas moléculas, al 160 % (en la lupa se veían diminutas).
  const MOLEC = Object.fromEntries(Object.entries(MOLEC0).map(([k, l]) => [k, l.map(([e, x, y]) => [e, x * 1.6, y * 1.6])]));
  const NOM3 = { H2O: 'agua', CO2: 'dióxido de carbono', NH3: 'amoníaco', CH4: 'metano', H2SO4: 'ácido sulfúrico', C2H6O: 'alcohol' };
  function lupaFormula(k, u) {
    const a = atomosDe(k), els = Object.keys(a);
    const especies = Object.assign({ [k]: MOLEC[k] }, Object.fromEntries(els.map(e => [e, [[e, 0, 0]]])));
    return { pieza: 'quim-particulas', datos: { atomos: LUPA_AT, especies, separacion: 70, alto: 160,
      cajas: [{ titulo: `${u} ${u === 1 ? 'molécula' : 'moléculas'} de ${bonita(k)}`, forma: 'caja', particulas: [{ e: k, n: u }], cuenta: els.map(e => ({ e, texto: `${e}: ${u * a[e]}` })) }],
      alt: `Lupa (un modelo, no a escala) con ${u} ${u === 1 ? 'molécula' : 'moléculas'} de ${bonita(k)}: ${listaY(els.map(e => `${u * a[e]} ${u * a[e] === 1 ? 'átomo' : 'átomos'} de ${NOMBRE[e]}`))}.` }, estado: {} };
  }
  const lectura3 = (k, u) => { const a = atomosDe(k); return [`En ${u} ${bonita(k)} hay `, listaY(Object.keys(a).map(e => `${u * a[e]} ${e}`))]; };
  // La tarjeta de conteo (quim-mol): la fórmula con sus moles y una fila por elemento.
  const cuenta = (fo, n, filas, extra = {}) => ({ pieza: 'quim-mol', datos: Object.assign({ vista: 'cuenta', formula: n === null ? bonita(fo) : [Mo(`${f(n, 2)} mol`), ` de ${bonita(fo)}`], cabeza: ['por unidad', n === null ? 'en total' : `en ${f(n, 2)} mol`], filas }, extra), estado: {} });
  const D_REL = 'n(elemento) = n(compuesto) × átomos del elemento por unidad';
  const D_PAR = 'Un subíndice fuera del paréntesis multiplica todo lo de adentro';
  const D_HID = 'En un hidrato, ·5H₂O son 5 moléculas de agua por unidad';
  // Átomos de un elemento sin el subíndice de afuera del paréntesis (ni el número del agua de un hidrato): el error ES18.
  const sinPar = (fo, e) => atomosDe(fo.replace(/\)\d+/g, ')').replace(/·\d+/, '·'))[e] || 0;

  // Ejemplos de la idea 3. Cuentas rehechas aparte (verif/cuentas.js): 2 mol de CaCO₃ 6 mol de O · 0,5 mol de CH₄ 2 mol de H
  // · 3 mol de glucosa 18 mol de C · 1,5 mol de urea 3 mol de N · H₂SO₄ 7 átomos · 36 g de agua 4 mol de H · 2 mol de
  // Ca(NO₃)₂ 12 mol de O · 0,5 mol de CuSO₄·5H₂O 4,5 mol de O · 0,5 mol de NH₃ 9,03 × 10²³ átomos de H · 2 mol de K₂SO₄
  // 6 mol de iones · amoxicilina 20,5 mmol de O · 160 g de Fe₂O₃ · 2,5 mol de iones · 62 g de Ca₃(PO₄)₂ 2,408 × 10²³ · 6 mol de CO₂.
  const EJEMPLOS_REL = [
    { nivel: 1, titulo: 'Los oxígenos de la tiza', enunciado: '¿Cuántos moles de átomos de oxígeno hay en 2 mol de CaCO₃?', datos: [D_REL],
      figura: cuenta('CaCO3', 2, [{ el: 'O', por: '3', oculto: true }]),
      solucion: [{ texto: 'Cada unidad de CaCO₃ trae 3 átomos de O, así que hay 3 veces más moles de O que de compuesto.', ecuacion: [n_, '(O) = 2 · 3 = ', Mo('6 mol')] }], respuesta: [Mo('6 mol'), ' de O'] },
    { nivel: 1, titulo: 'Los hidrógenos del metano', enunciado: '¿Cuántos moles de átomos de hidrógeno hay en 0,5 mol de metano, CH₄?', datos: [D_REL],
      solucion: [{ texto: 'Cada molécula de CH₄ trae 4 átomos de H, así que hay 4 veces más moles de H.', ecuacion: [n_, '(H) = 0,5 · 4 = ', Mo('2 mol')] }], respuesta: [Mo('2 mol'), ' de H'] },
    { nivel: 1, titulo: 'Los carbonos de la glucosa', enunciado: '¿Cuántos moles de átomos de carbono hay en 3 mol de glucosa, C₆H₁₂O₆?', datos: [D_REL],
      solucion: [{ texto: 'Cada molécula de glucosa trae 6 átomos de C, así que hay 6 veces más moles de C.', ecuacion: [n_, '(C) = 3 · 6 = ', Mo('18 mol')] }], respuesta: [Mo('18 mol'), ' de C'] },
    { nivel: 1, titulo: 'Los nitrógenos de la urea', enunciado: 'La urea, abono de las chacras, es CO(NH₂)₂. ¿Cuántos moles de átomos de nitrógeno hay en 1,5 mol de urea?', datos: [D_REL, D_PAR],
      solucion: [{ texto: 'El 2 de afuera repite el grupo NH₂, así que cada molécula trae 2 átomos de N.', ecuacion: [n_, '(N) = 1,5 · 2 = ', Mo('3 mol')] }], respuesta: [Mo('3 mol'), ' de N'] },
    { nivel: 1, titulo: 'Átomos de una molécula', enunciado: '¿Cuántos átomos tiene, en total, una molécula de ácido sulfúrico, H₂SO₄?', datos: ['Cada subíndice cuenta los átomos de su elemento; sin subíndice, 1'],
      solucion: [{ texto: 'La molécula tiene 2 átomos de H, 1 de S y 4 de O.', ecuacion: ['2 + 1 + 4 = 7'] }], respuesta: ['7 átomos'] },
    { nivel: 2, titulo: 'Del gramo al átomo', enunciado: '¿Cuántos moles de átomos de hidrógeno hay en 36 g de agua, H₂O?', datos: [masasDe('H2O'), D_NM, D_REL],
      solucion: [{ texto: 'Con M(H₂O) = 18 g/mol, los moles de agua son:', ecuacion: [n_, '(H₂O) = ', { frac: ['36', '18'] }, ' = 2 mol'] }, { texto: 'Cada molécula de agua trae 2 átomos de H:', ecuacion: [n_, '(H) = 2 · 2 = ', Mo('4 mol')] }],
      respuesta: [Mo('4 mol'), ' de H'] },
    { nivel: 2, titulo: 'Un paréntesis que multiplica', enunciado: '¿Cuántos moles de átomos de oxígeno hay en 2 mol de nitrato de calcio, Ca(NO₃)₂?', datos: [D_REL, D_PAR],
      figura: cuenta('Ca(NO3)2', 2, [{ el: 'Ca', por: '1', total: '2 mol', color: 'f' }, { el: 'N', por: '2', total: '4 mol', color: 'f' }, { el: 'O', por: '?', oculto: true }]),
      solucion: [{ texto: 'El 2 de afuera repite el NO₃, así que cada unidad trae 2 · 3 = 6 átomos de O.', ecuacion: [n_, '(O) = 2 · 6 = ', Mo('12 mol')] }], respuesta: [Mo('12 mol'), ' de O'] },
    { nivel: 2, titulo: 'El agua de un hidrato', enunciado: '¿Cuántos moles de átomos de oxígeno hay en 0,5 mol de CuSO₄·5H₂O?', datos: [D_REL, D_HID],
      solucion: [{ texto: 'El CuSO₄ trae 4 átomos de O y cada una de las 5 aguas trae 1 más, así que cada unidad tiene 4 + 5 = 9 átomos de O.', ecuacion: [n_, '(O) = 0,5 · 9 = ', Mo('4,5 mol')] }], respuesta: [Mo('4,5 mol'), ' de O'] },
    { nivel: 2, titulo: 'Átomos, no moles', enunciado: '¿Cuántos átomos de hidrógeno hay en 0,5 mol de amoníaco, NH₃?', datos: [D_REL, D_NN, D_NA],
      solucion: [{ texto: 'Cada NH₃ trae 3 H, así que hay 0,5 · 3 = 1,5 mol de átomos de H, y cada mol trae Nₐ átomos.', ecuacion: [N_, '(H) = 1,5 · 6,02 × 10²³ = ', Nn(cien(1.5 * NAV, 3))] }], respuesta: [Nn(`${cien(1.5 * NAV, 3)} átomos`)] },
    { nivel: 2, titulo: 'Iones de una sal', enunciado: 'En agua, el K₂SO₄ se separa en sus iones, K⁺ y SO₄²⁻. ¿Cuántos moles de iones da 2 mol de K₂SO₄?', datos: ['Un ion poliatómico, como el SO₄²⁻, cuenta como un solo ion', D_REL],
      solucion: [{ texto: 'Cada unidad da 2 K⁺ y 1 SO₄²⁻, es decir, 3 iones.', ecuacion: [n_, '(iones) = 2 · 3 = ', Mo('6 mol')] }], respuesta: [Mo('6 mol'), ' de iones'] },
    { nivel: 3, titulo: 'El oxígeno del antibiótico', enunciado: 'Un tratamiento de un día da 3 cápsulas de 500 mg de amoxicilina, C₁₆H₁₉N₃O₅S (365 g/mol). ¿Cuántos milimoles de átomos de oxígeno recibe el paciente?',
      alternativas: ['4,11 mmol', '6,85 mmol', '20,5 mmol', '20,5 mol', '1,37 mmol'], datos: ['1 g = 1000 mg; 1 mol = 1000 mmol', D_NM, D_REL],
      solucion: [{ texto: 'Las 3 cápsulas suman 3 · 500 mg = 1,5 g, que son 4,11 mmol de amoxicilina:', ecuacion: [n_, ' = ', { frac: ['1,5', '365'] }, ' ≈ 0,00411 mol'] },
        { texto: 'Cada molécula trae 5 átomos de O, así que hay 5 veces más milimoles de O:', ecuacion: [n_, '(O) ≈ 5 · 4,11 ≈ ', Mo('20,5 mmol')] },
        { texto: ['La ', letra('A'), ' da los milimoles de amoxicilina, no de oxígeno, y la ', letra('B'), ' cuenta una sola cápsula. La ', letra('D'), ' toma los mg como si fueran g, y la ', letra('E'), ' es una sola cápsula sin multiplicar por 5.'] }],
      respuesta: [letra('C'), ', ', Mo('20,5 mmol')] },
    { nivel: 3, titulo: 'Cuánta herrumbre', enunciado: '¿Qué masa de Fe₂O₃ contiene 3 mol de átomos de oxígeno?',
      alternativas: ['480 g', '48 g', '53,3 g', '320 g', '160 g'], datos: [masasDe('Fe2O3'), D_REL, 'm = n · M'],
      solucion: [{ texto: 'Cada unidad trae 3 átomos de O, así que 3 mol de O vienen de 1 mol de Fe₂O₃, que pesa su masa molar:', ecuacion: [M_, ' = 2 · 56 + 3 · 16 = 160 g/mol'] },
        { texto: ['La ', letra('A'), ' multiplica 160 por 3, y la ', letra('B'), ' es solo la masa del oxígeno. La ', letra('C'), ' divide 160 entre 3, y la ', letra('D'), ' toma 2 mol de Fe₂O₃.'] }],
      respuesta: [letra('E'), ', ', Ms('160 g')] },
    { nivel: 3, titulo: 'Todos los iones', enunciado: 'En agua, el Fe₂(SO₄)₃ se separa en Fe³⁺ y SO₄²⁻. ¿Cuántos moles de iones en total da 0,5 mol de Fe₂(SO₄)₃?',
      alternativas: ['1,5 mol', '2,5 mol', '1 mol', '8,5 mol', '5 mol'], datos: ['Un ion poliatómico, como el SO₄²⁻, cuenta como un solo ion', D_REL],
      solucion: [{ texto: 'Cada unidad da 2 Fe³⁺ y 3 SO₄²⁻, es decir, 5 iones.', ecuacion: [n_, '(iones) = 0,5 · 5 = ', Mo('2,5 mol')] },
        { texto: ['La ', letra('A'), ' cuenta solo los aniones, y la ', letra('C'), ', solo los cationes. La ', letra('D'), ' cuenta los 17 átomos de la fórmula, y la ', letra('E'), ' olvida los 0,5 mol.'] }],
      respuesta: [letra('B'), ', ', Mo('2,5 mol')] },
    { nivel: 3, titulo: 'El fósforo de los huesos', enunciado: 'Los huesos tienen fosfato de calcio, Ca₃(PO₄)₂. ¿Cuántos átomos de fósforo hay en 62 g de Ca₃(PO₄)₂?',
      alternativas: ['1,204 × 10²³', '0,4', '2,408 × 10²³', '4,816 × 10²³', '1,204 × 10²⁴'], datos: [masasDe('Ca3(PO4)2'), D_PAR, D_NM, D_REL, D_NN, D_NA],
      solucion: [{ texto: 'Con M = 3 · 40 + 2 · 31 + 8 · 16 = 310 g/mol salen los moles de sal, y con el 2 del paréntesis, los de P:', ecuacion: [n_, ' = ', { frac: ['62', '310'] }, ' = 0,2 mol', SEP, n_, '(P) = 0,2 · 2 = 0,4 mol'] },
        { texto: 'Los átomos de P son sus moles por Nₐ:', ecuacion: [N_, '(P) = 0,4 · 6,02 × 10²³ = ', Nn('2,408 × 10²³')] },
        { texto: ['La ', letra('A'), ' olvida el 2 del paréntesis, y la ', letra('B'), ' da los moles de P, no los átomos. La ', letra('D'), ' cuenta 4 P por unidad, y la ', letra('E'), ' usa 2 mol de P, como si hubiera 1 mol de fosfato.'] }],
      respuesta: [letra('C'), ', ', Nn('2,408 × 10²³')] },
    { nivel: 3, titulo: 'Tantos oxígenos como', enunciado: '¿Cuántos moles de CO₂ tienen tantos átomos de oxígeno como 3 mol de H₂SO₄?',
      alternativas: ['12 mol', '3 mol', '1,5 mol', '6 mol', '24 mol'], datos: [D_REL],
      solucion: [{ texto: 'Como cada H₂SO₄ trae 4 O, 3 mol de H₂SO₄ tienen 3 · 4 = 12 mol de O.' },
        { texto: 'Cada CO₂ trae 2 O, así que hace falta la mitad de moles de CO₂:', ecuacion: [n_, '(CO₂) = ', { frac: ['12', '2'] }, ' = ', Mo('6 mol')] },
        { texto: ['La ', letra('A'), ' da los moles de O, y la ', letra('B'), ' copia los 3 mol. La ', letra('C'), ' divide entre 8, y la ', letra('E'), ' multiplica por 2 en vez de dividir.'] }],
      respuesta: [letra('D'), ', ', Mo('6 mol')] },
  ];

  // Ahora tú y Así se resuelve: listas distintas, sin las fórmulas del juego, el Al₂(SO₄)₃ de Predice ni los casos de los
  // ejemplos.
  const AT3 = ['Mg(NO3)2', 'Fe2(SO4)3', '(NH4)3PO4', 'Mg3(PO4)2', 'MgSO4·7H2O', 'Na2CO3·10H2O', 'C3H8', 'Ba(OH)2', 'K2Cr2O7', 'Al(OH)3', 'C12H22O11', 'Zn(NO3)2'];
  const RES3 = [['CaCO3', 50, 'O'], ['Mg(OH)2', 29, 'H'], ['C6H12O6', 36, 'C'], ['(NH4)2SO4', 66, 'H'], ['Ca3(PO4)2', 31, 'O']];
  // Sales y sus iones: [fórmula, cationes, aniones, catión, anión].
  const IONES3 = [['Na2SO4', 2, 1, 'Na⁺', 'SO₄²⁻'], ['K3PO4', 3, 1, 'K⁺', 'PO₄³⁻'], ['Mg(NO3)2', 1, 2, 'Mg²⁺', 'NO₃⁻'], ['(NH4)2CO3', 2, 1, 'NH₄⁺', 'CO₃²⁻'],
    ['Mg3(PO4)2', 3, 2, 'Mg²⁺', 'PO₄³⁻'], ['Al(NO3)3', 1, 3, 'Al³⁺', 'NO₃⁻'], ['Ba(OH)2', 1, 2, 'Ba²⁺', 'OH⁻'], ['Na3PO4', 3, 1, 'Na⁺', 'PO₄³⁻']];
  const datosFo = fo => [D_REL, ...(/\(/.test(fo) ? [D_PAR] : []), ...(/·/.test(fo) ? [D_HID.replace('·5', `·${fo.match(/·(\d+)/)[1]}`).replace('5 moléculas', `${fo.match(/·(\d+)/)[1]} moléculas`)] : [])];
  const elDe = (r, fo) => { const a = atomosDe(fo), conPar = Object.keys(a).filter(e => sinPar(fo, e) !== a[e]); return r.de(conPar.length && r() < 0.7 ? conPar : Object.keys(a)); };
  const pluralAt = (x, e) => `${x} ${x === 1 ? 'átomo' : 'átomos'} de ${e}`;
  function casoAtomos(r) {
    const fo = r.de(AT3), e = elDe(r, fo), c = atomosDe(fo)[e], n = r.de([0.5, 2, 3, 0.25, 1.5, 4]);
    return { pregunta: ['¿Cuántos moles de átomos de ', NOMBRE[e], ` hay en ${f(n, 2)} mol de ${bonita(fo)}?`], datos: datosFo(fo),
      opciones: opciones(n * c, [
        { id: 'par', valor: sinPar(fo, e) !== c ? n * sinPar(fo, e) : null, error: 'ES18', siFuera: `Multiplicar por ${f(n, 2)} está bien, pero ${/·/.test(fo) ? 'el número delante del H₂O' : 'el subíndice de afuera del paréntesis'} también multiplica: cada unidad trae ${pluralAt(c, e)}, no ${sinPar(fo, e)}.` },
        { id: 'uno', valor: c, error: 'QM-POR-N', siFuera: `Una sola unidad trae ${pluralAt(c, e)}, pero aquí hay ${f(n, 2)} mol de unidades, así que falta multiplicar.` },
        { id: 'n', valor: n, error: 'ES14', siFuera: `Esos son los moles de ${bonita(fo)}, y cada unidad trae ${pluralAt(c, e)}: falta multiplicar por ${c}.` },
        { id: 'doble', valor: n * c * 2, error: 'QM-POR-N', siFuera: `Contar ${pluralAt(c, e)} por unidad y usar los ${f(n, 2)} mol está bien, pero sobra multiplicar otra vez por 2.` },
        { id: 'todos', valor: n * MM.totalAtomos(fo), error: 'ES6', siFuera: `Ese número cuenta los ${MM.totalAtomos(fo)} átomos de cada unidad, y se piden solo los de ${e}.` },
        { id: 'masa', valor: n * c * MASAS[e], error: 'ES3', siFuera: `Los moles de ${e} iban bien, pero al multiplicar por su masa atómica se pasaron a gramos, y se piden moles.` },
      ], molTxt),
      solucion: { texto: `Cada unidad de ${bonita(fo)} trae ${pluralAt(c, e)}, así que se multiplica por los moles.`, ecuacion: [n_, `(${e}) = ${f(n, 2)} · ${c} = `, Mo(molTxt(n * c))] } };
  }
  function casoMasaAtomos(r) {
    const fo = r.de(AT3.filter(x => !/·/.test(x))), e = elDe(r, fo), c = atomosDe(fo)[e], M = Mde(fo), n = r.de([0.1, 0.2, 0.25, 0.5, 2]), m = n * M;
    return { pregunta: ['¿Cuántos moles de átomos de ', NOMBRE[e], ` hay en ${f(m, 2)} g de ${bonita(fo)}?`], datos: [masasDe(fo), D_M, D_NM, ...datosFo(fo)],
      opciones: opciones(n * c, [
        { id: 'n', valor: n, error: 'ES14', siFuera: `Los moles de ${bonita(fo)}, ${f(n, 3)} mol, están bien, pero falta multiplicar por ${c}, los átomos de ${e} de cada unidad.` },
        { id: 'par', valor: sinPar(fo, e) !== c ? n * sinPar(fo, e) : null, error: 'ES18', siFuera: `El camino está bien, pero el número de afuera del paréntesis también multiplica: cada unidad trae ${pluralAt(c, e)}.` },
        { id: 'atomica', valor: m / MASAS[e], error: 'QM-MASA-ATOMICA', siFuera: `Ese número divide toda la masa entre la masa atómica del ${e}, como si la muestra fuera solo ${e}.` },
        { id: 'inv', valor: M / m * c, error: 'ES7', siFuera: 'Multiplicar por el subíndice está bien, pero n = m/M: la masa molar va abajo, no arriba.' },
      ], molTxt),
      solucion: { texto: `Con M = ${f(M, 1)} g/mol hay ${f(n, 3)} mol de ${bonita(fo)}, y cada unidad trae ${pluralAt(c, e)}.`, ecuacion: [n_, `(${e}) = ${f(n, 3)} · ${c} = `, Mo(molTxt(n * c))] } };
  }
  function casoIones(r) {
    const [fo, a, b, ca, an] = r.de(IONES3), n = r.de([0.5, 2, 3, 1.5, 0.25]), at = MM.totalAtomos(fo);
    return { pregunta: `En agua, el ${bonita(fo)} se separa en ${ca} y ${an}. ¿Cuántos moles de iones en total da ${f(n, 2)} mol de ${bonita(fo)}?`,
      datos: ['Un ion poliatómico cuenta como un solo ion', 'La sal es neutra: las cargas de sus iones suman 0', D_REL],
      opciones: opciones(n * (a + b), [
        { id: 'aniones', valor: n * b, error: 'QM-IONES-UNO', siFuera: `Ese número cuenta solo los ${an}, pero los ${ca} también son iones.` },
        { id: 'cationes', valor: n * a, error: 'QM-IONES-UNO', siFuera: `Ese número cuenta solo los ${ca}, pero los ${an} también son iones.` },
        { id: 'atomos', valor: n * at, error: 'QM-IONES-ATOMOS', siFuera: `Ese número cuenta los ${at} átomos de la fórmula, pero un ion poliatómico cuenta como un solo ion.` },
        { id: 'uno', valor: a + b, error: 'QM-POR-N', siFuera: `Una sola unidad da ${a + b} iones, pero aquí hay ${f(n, 2)} mol de unidades.` },
      ], molTxt),
      solucion: { texto: `Cada unidad da ${a} ${ca} y ${b} ${an}, es decir, ${a + b} iones.`, ecuacion: [n_, `(iones) = ${f(n, 2)} · ${a + b} = `, Mo(molTxt(n * (a + b)))] } };
  }
  function casoNumero(r) {
    const fo = r.de(['C3H8', 'C12H22O11', 'Al(OH)3', 'Ba(OH)2', 'Mg(NO3)2', 'K2Cr2O7']), e = elDe(r, fo), c = atomosDe(fo)[e], n = r.de([0.5, 2, 0.25, 1.5, 3]), at = MM.totalAtomos(fo);
    return { pregunta: ['¿Cuántos átomos de ', NOMBRE[e], ` hay en ${f(n, 2)} mol de ${bonita(fo)}?`], datos: [...datosFo(fo), D_NN, D_NA],
      opciones: opciones(n * c * NAV, [
        { id: 'moleculas', valor: n * NAV, error: 'ES6', siFuera: `Ese número cuenta las unidades de ${bonita(fo)}, y cada una trae ${pluralAt(c, e)}.` },
        { id: 'todos', valor: n * at * NAV, error: 'ES6', siFuera: `Ese número cuenta los ${at} átomos de cada unidad, y se piden solo los de ${e}.` },
        { id: 'par', valor: sinPar(fo, e) !== c ? n * sinPar(fo, e) * NAV : null, error: 'ES18', siFuera: `El camino está bien, pero el número de afuera del paréntesis también multiplica: cada unidad trae ${pluralAt(c, e)}.` },
        { id: 'div', valor: n * c / NAV, error: 'QM-NA', siFuera: 'Los moles de átomos están bien, pero cada mol trae Nₐ átomos, así que se multiplica por Nₐ, no se divide.' },
      ], x => cien(x, 3)),
      solucion: { texto: `Los moles de ${e} son ${f(n, 2)} · ${c} = ${f(n * c, 2)} mol, y cada mol trae Nₐ átomos.`, ecuacion: [N_, `(${e === 'N' ? 'nitrógeno' : e}) = ${f(n * c, 2)} · 6,02 × 10²³${ig(n * c * NAV, cien(n * c * NAV, 3))}`, Nn(cien(n * c * NAV, 3))] } };
  }

  const relaciones = {
    id: 'relaciones-en-formula',
    titulo: 'Moles de átomos en una fórmula',
    pregunta: '¿Cuántos moles de cada átomo hay en los moles de un compuesto?',
    temas: ['Relaciones molares en una fórmula'],
    pieza: 'quim-particulas',
    aprendizaje: 'Los subíndices cuentan los átomos de cada elemento en una unidad; los moles de un elemento son los del compuesto por su subíndice.',
    actividad: 'Juntar moléculas en la lupa y contar los átomos de cada elemento.',
    lee: {
      tarjetas: [
        { titulo: 'La tiza', texto: 'Las tizas de esta caja son casi todas de carbonato de calcio, CaCO₃; hay otras de yeso. La fórmula química dice qué átomos tiene y cuántos de cada uno: por cada unidad, un átomo de calcio, uno de carbono y tres de oxígeno.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'tiza', etiqueta: 'CaCO₃', nombre: 'Una caja de tizas' }, estado: {} } },
        { titulo: 'Unidad fórmula', texto: 'El CaCO₃ es iónico: no hay moléculas, sino iones Ca²⁺ y CO₃²⁻ que se repiten. A cada grupo «un Ca²⁺ y un CO₃²⁻» se le llama unidad fórmula, y se cuenta en moles igual que una molécula.' },
        { titulo: 'Qué mirar', texto: 'En el juego, elige una sustancia y cuántas moléculas pones en la lupa. Abajo se cuentan los átomos de cada elemento: compáralos con los subíndices.' },
      ],
    },
    ejemplos: EJEMPLOS_REL,
    juega: {
      consigna: 'Las moléculas de la lupa son de una sola sustancia. Debajo se cuentan los átomos de cada elemento.',
      mision: { texto: 'Junta 8 átomos de oxígeno con solo 2 moléculas.', logrado: v => v.k === 'H2SO4' && v.u === 2,
        bien: 'Listo: cada H₂SO₄ trae 4 O, y dos moléculas traen 8.' },
      voz: 'Cuenta los átomos de una molécula y multiplica por las moléculas.',
      leyenda: [
        { s: 'bolita', t: 'un átomo; su color dice el elemento' },
        { s: 'abajo', t: 'cuántos átomos hay de cada elemento' },
      ],
      controles: [
        { id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(MOLEC).map(k => ({ valor: k, texto: `${NOM3[k]}, ${bonita(k)}` })) },
        { id: 'u', etiqueta: 'moléculas', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => lupaFormula(v.k, v.u),
      lectura: v => lectura3(v.k, v.u),
      minimo: 4,
    },
    predice: {
      pieza: 'quim-mol',
      pregunta: '¿Cuántos moles de átomos de oxígeno hay en 2 mol de Al₂(SO₄)₃?',
      voz: 'Mira bien qué abarca el paréntesis.',
      opciones: [
        { id: 'c', texto: '24 mol', correcta: true },
        { id: 'parentesis', texto: '8 mol', error: 'ES18', siFuera: 'Multiplicar por los 2 mol está bien, pero el 3 de afuera repite el SO₄ tres veces: hay 12 O por unidad, no 4.' },
        { id: 'uno', texto: '12 mol', error: 'QM-POR-N', siFuera: 'Los 12 O están bien contados, pero son los de una sola unidad, y aquí hay 2 mol de unidades.' },
        { id: 'formula', texto: '7 mol', error: 'ES11', siFuera: 'Ese 7 sale de sumar los subíndices 4 y 3, pero el 3 multiplica al 4, y además faltan los 2 mol.' },
      ],
      dibujo: cuenta('Al2(SO4)3', 2, [{ el: 'O', por: '?', oculto: true }], { alt: 'Tarjeta de 2 mol de Al₂(SO₄)₃: los oxígenos por unidad y en 2 mol, con «?».' }),
      revelar: cuenta('Al2(SO4)3', 2, [{ el: 'Al', por: '2', total: '4 mol', color: 'f' }, { el: 'S', por: '3', total: '6 mol', color: 'f' }, { el: 'O', por: '3 × 4 = 12', total: '24 mol', color: 'f' }]),
      coincide: 'Coincide: 3 × 4 = 12 O por unidad, y 2 · 12 = 24 mol.',
      noCoincide: 'Cada unidad tiene 3 grupos SO₄, así que trae 3 × 4 = 12 O, y en 2 mol hay 2 · 12 = 24 mol de O.',
    },
    mira: {
      pieza: 'quim-mol',
      datos: { vista: 'cuenta', formula: [Mo('2 mol'), ' de Al₂(SO₄)₃'], cabeza: ['por unidad', 'en 2 mol'],
        filas: [{ el: 'Al', por: '2', total: '4 mol', color: 'f', desde: 2 }, { el: 'S', por: '3', total: '6 mol', color: 'f', desde: 2 }, { el: 'O', por: '3 × 4 = 12', total: '24 mol', color: 'f', desde: 3 }] },
      voz: 'Primero contamos una unidad y después los moles.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Una unidad tiene 2 Al y 3 grupos SO₄, es decir, 3 S y 12 O.', ecuacion: ['O: 3 × 4 = 12'] },
        { estado: { corte: 2 }, texto: 'En 2 mol de unidades hay el doble de cada uno.', ecuacion: [n_, '(Al) = 2 · 2 = 4 mol', SEP, n_, '(S) = 2 · 3 = 6 mol'] },
        { estado: { corte: 3 }, texto: 'Con los oxígenos pasa lo mismo: 2 mol de unidades traen el doble de 12.', ecuacion: [n_, '(O) = 2 · 12 = ', Mo('24 mol')] },
        { estado: { corte: 3 }, texto: 'Si la sal se separa en iones, cada unidad da 2 Al³⁺ y 3 SO₄²⁻, que son 5 iones.', ecuacion: [n_, '(iones) = 2 · 5 = 10 mol'] },
        { estado: { corte: 3 }, texto: 'Para pasar de moles al número de átomos, se multiplica por Nₐ.', ecuacion: [N_, '(O) = 24 · 6,02 × 10²³ = ', Nn(cien(24 * NAV, 4))] },
      ],
    },
    regla: {
      texto: 'Los moles de un elemento X son los moles del compuesto, n, por los átomos de X en una unidad. Un subíndice fuera del paréntesis multiplica todo lo de adentro.',
      ecuacion: [n_, '(X) = ', n_, ' × ', { llave: ['átomos de X'], nota: 'en una unidad' }],
      condicion: 'se cuentan todos los átomos de una unidad, con el paréntesis y el agua de los hidratos (CuSO₄·5H₂O: 5 aguas por unidad); los iones de una sal se cuentan igual.',
      voz: 'Cuenta primero los átomos de una unidad y después multiplica por los moles.',
      dibujo: cuenta('Al2(SO4)3', 2, [{ el: 'Al', por: '2', total: '4 mol', color: 'f' }, { el: 'S', por: '3', total: '6 mol', color: 'f' }, { el: 'O', por: '3 × 4 = 12', total: '24 mol', color: 'f' }]),
    },
    resuelve: {
      pieza: 'quim-mol',
      generar(s) {
        const [fo, m, e] = RES3[idx(s, RES3.length)], M = Mde(fo), n = m / M, c = atomosDe(fo)[e];
        return { enunciado: ['¿Cuántos moles de átomos de ', NOMBRE[e], ` hay en ${m} g de ${bonita(fo)}?`], datos: [masasDe(fo), D_M, D_NM, ...datosFo(fo)],
          dibujo: cuenta(fo, null, [{ el: e, por: String(c), oculto: true }], { alt: `Tarjeta de ${bonita(fo)}: ${c} átomos de ${e} por unidad; los moles de ${e}, con «?».` }),
          pasos: [
            { tipo: 'pide', texto: `Se piden los moles de átomos de ${e} que hay en ${m} g de ${bonita(fo)}.` },
            { tipo: 'datos', texto: `Se conocen la masa, ${m} g, las masas atómicas y la fórmula, que trae ${pluralAt(c, e)} por unidad.` },
            { tipo: 'regla', texto: 'Primero se calculan los moles del compuesto, y después se multiplican por los átomos del elemento en cada unidad.', ecuacion: [n_, ' = ', { frac: [m_, M_] }, SEP, n_, '(elemento) = ', n_, ' × átomos por unidad'] },
            { tipo: 'cuentas', texto: `La masa molar es ${cuentaM(fo)} = ${f(M, 1)} g/mol, y con ella salen los moles del compuesto:`, ecuacion: [n_, ' = ', { frac: [String(m), f(M, 1)] }, ` = ${f(n, 2)} mol`] },
            { tipo: 'cuentas', texto: `Cada unidad trae ${pluralAt(c, e)}, así que se multiplica por ${c}:`, ecuacion: [n_, `(${e}) = ${f(n, 2)} · ${c} = `, Mo(molTxt(n * c))] },
            { tipo: 'sentido', texto: `El resultado es ${c} veces los moles del compuesto, porque cada unidad trae ${pluralAt(c, e)}.` },
          ],
          respuesta: [Mo(molTxt(n * c)), ` de ${e}`] };
      },
    },
    ahoraTu: {
      pieza: 'quim-mol',
      voz: 'Cuenta los átomos de una unidad sin olvidar el paréntesis.',
      generar(s) {
        const r = azar(s + 17), tipo = ['atomos', 'masaAtomos', 'iones', 'numero'][idx(s, 4)];
        return { atomos: casoAtomos, masaAtomos: casoMasaAtomos, iones: casoIones, numero: casoNumero }[tipo](r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): composición centesimal ----------
  // Propuesta §3 idea 4 (conserva el id `composicion-formula-empirica` y su Predice del CH₄; la fórmula empírica pasó a la
  // idea 5). Objeto de la primera pantalla: un paquete de sal con su tabla de nutrición (quim-mol).
  // Cambia: el compuesto · Permanece: dos barras, arriba los átomos y abajo la masa · Progresa: el elemento con más
  // átomos no siempre pesa más · Se reserva: el metano (Predice) · Debe verse: que el % de átomos no es el % de masa.
  // Errores: ES19 (el % de átomos como % de masa), ES18 (un solo átomo del elemento), QM-PORCENTAJE (el resto, o el %
  // sobre otro elemento), QM-HIDRATO-ANHIDRA (la masa de la sal sin agua en vez de la del hidrato), QM-PCT-GRAMOS.
  const pctDe = (fo, e) => MM.composicion(fo).porcentajes[e];
  const pTxt = x => `${f(x, 1)} %`;
  const COMP4 = { H2O: 'agua', NH3: 'amoníaco', CO2: 'dióxido de carbono', SO2: 'dióxido de azufre', SO3: 'trióxido de azufre', MgO: 'óxido de magnesio', CaCO3: 'tiza', C6H12O6: 'glucosa' };
  const focoDe = fo => (atomosDe(fo).O ? 'O' : Object.keys(atomosDe(fo)).slice(-1)[0]);
  // Dos barras de quim-composicion: arriba los átomos (no es masa), abajo la masa de cada elemento en un mol. El tramo del
  // elemento que se sigue va en carmín en la barra de masa (su porcentaje); los demás, en tinta.
  function barras4(fo, foco, oculto = false) {
    const a = atomosDe(fo), els = Object.keys(a), M = Mde(fo), tot = MM.totalAtomos(fo);
    const filaAt = { titulo: `átomos de ${bonita(fo)} (no es masa)`, tramos: els.map(e => ({ valor: a[e], texto: `${a[e]} ${e}` })) };
    const filaM = { titulo: `masa: ${f(M, 1)} g/mol`, tramos: els.map(e => ({ valor: a[e] * MASAS[e], texto: oculto ? (e === foco ? `${e} ?` : e) : `${e} ${pTxt(pctDe(fo, e))}`, color: e === foco ? 'h' : undefined })) };
    return { pieza: 'quim-composicion', datos: { filas: [filaAt, filaM],
      alt: `Dos barras de ${bonita(fo)}: arriba los átomos, ${listaY(els.map(e => `${a[e]} de ${e}`))} (de ${tot}); abajo la masa, ${oculto ? `repartida entre ${listaY(els)}, con el ${foco} en «?»` : listaY(els.map(e => `${e} ${pTxt(pctDe(fo, e))}`))}.` }, estado: {} };
  }
  const lectura4 = fo => { const e = focoDe(fo), a = atomosDe(fo); return [`El ${e} es ${a[e]} de ${MM.totalAtomos(fo)} átomos y `, Pc(pTxt(pctDe(fo, e))), ' de la masa']; };
  const D_PCT = '% del elemento = 100 · (átomos × masa atómica) / M';
  const D_MUESTRA = 'masa del elemento en una muestra = % × masa de la muestra / 100';
  const ecPct = (fo, e) => { const a = atomosDe(fo)[e]; return [Pc(`% ${e}`), ' = 100 · ', { frac: [a > 1 ? `${a} · ${f(MASAS[e], 1)}` : f(MASAS[e], 1), f(Mde(fo), 1)] }, ig(pctDe(fo, e), pTxt(pctDe(fo, e))), Pc(pTxt(pctDe(fo, e)))]; };

  // Ejemplos de la idea 4. Cuentas rehechas aparte (verif/cuentas.js): H en H₂O 11,1 % · O en CO₂ 72,7 % · N en NH₃
  // 82,4 % · Ca en CaCO₃ 40 % · O en SO₃ 60 % · Na en 5 g de sal 1,97 g · Fe en Fe₂O₃ 70 % · urea 46,7 % y NH₄NO₃ 35 % ·
  // agua del yeso 20,9 % · C en la glucosa 40 % · Cu en CuSO₄ 39,8 % · MO con 40 % de O: 24 · urea con más N · C de la
  // quercetina 59,6 % · O en 25 g de CaCO₃ 12 g.
  const ejPct = (nivel, titulo, enunciado, fo, e, extra = {}) => Object.assign({ nivel, titulo, enunciado, datos: [masasDe(fo), D_PCT],
    solucion: [{ texto: `La masa molar es M(${bonita(fo)}) = ${cuentaM(fo)} = ${f(Mde(fo), 1)} g/mol, y el porcentaje es la parte del elemento entre ella:`, ecuacion: ecPct(fo, e) }], respuesta: [Pc(pTxt(pctDe(fo, e))), ` de ${e}`] }, extra);
  const EJEMPLOS_PCT = [
    ejPct(1, 'El hidrógeno del agua', '¿Qué porcentaje de la masa del agua, H₂O, es hidrógeno?', 'H2O', 'H'),
    ejPct(1, 'El oxígeno del CO₂', '¿Qué porcentaje de la masa del CO₂ es oxígeno?', 'CO2', 'O'),
    ejPct(1, 'El nitrógeno del amoníaco', '¿Qué porcentaje de la masa del amoníaco, NH₃, es nitrógeno?', 'NH3', 'N'),
    ejPct(1, 'El calcio de la tiza', '¿Qué porcentaje de la masa de la tiza, CaCO₃, es calcio?', 'CaCO3', 'Ca'),
    { nivel: 1, titulo: 'Los porcentajes suman 100', enunciado: 'En el SO₃, el azufre es el 40 % de la masa. ¿Qué porcentaje es oxígeno?', datos: ['Los porcentajes de todos los elementos de un compuesto suman 100 %'],
      solucion: [{ texto: 'El SO₃ solo tiene dos elementos, así que el oxígeno es lo que falta para 100 %.', ecuacion: ['100 − 40 = ', Pc('60 %')] }], respuesta: [Pc('60 %'), ' de O'] },
    { nivel: 2, titulo: 'El sodio de la sal', enunciado: 'Una receta lleva 5 g de sal, NaCl. ¿Cuántos gramos de sodio aporta?', datos: [masasDe('NaCl'), D_PCT, D_MUESTRA],
      solucion: [{ texto: 'Con M(NaCl) = 23 + 35,5 = 58,5 g/mol, el sodio es esta parte de la masa:', ecuacion: ecPct('NaCl', 'Na') }, { texto: 'En 5 g de sal, el sodio pesa esa fracción de los 5 g:', ecuacion: [`5 · ${f(23 / 58.5, 3)} ≈ `, Ms('1,97 g')] }],
      respuesta: [Ms('1,97 g'), ' de sodio'] },
    ejPct(2, 'El hierro de la herrumbre', '¿Qué porcentaje de la masa de la herrumbre, Fe₂O₃, es hierro?', 'Fe2O3', 'Fe'),
    { nivel: 2, titulo: 'Dos abonos', enunciado: '¿Qué abono tiene mayor porcentaje de nitrógeno: la urea, CO(NH₂)₂, o el nitrato de amonio, NH₄NO₃?', datos: [masasDe('CO(NH2)2', 'NH4NO3'), D_PCT],
      solucion: [{ texto: 'Cada uno trae 2 átomos de N, que pesan 28 g por mol; la urea pesa 60 g/mol y el NH₄NO₃, 80 g/mol.', ecuacion: [Pc('% N'), '(urea) = 100 · ', { frac: ['28', '60'] }, ' ≈ 46,7 %', SEP, Pc('% N'), '(NH₄NO₃) = 100 · ', { frac: ['28', '80'] }, ' = 35 %'] },
        { texto: 'Los dos traen el mismo nitrógeno, pero la urea pesa menos, así que su porcentaje es mayor.' }],
      respuesta: ['La urea, con ', Pc('46,7 %')] },
    { nivel: 2, titulo: 'El agua del yeso', enunciado: 'El yeso es CaSO₄·2H₂O. ¿Qué porcentaje de su masa es agua?', datos: [masasDe('CaSO4·2H2O'), D_HID.replace('·5', '·2').replace('5 moléculas', '2 moléculas'), '% de agua = 100 · masa del agua / M'],
      solucion: [{ texto: 'La masa molar es M = 40 + 32 + 4 · 16 + 2 · 18 = 172 g/mol, y el agua pesa 2 · 18 = 36 g de ella.', ecuacion: [Pc('% agua'), ' = 100 · ', { frac: ['36', '172'] }, ' ≈ ', Pc('20,9 %')] }],
      respuesta: [Pc('20,9 %'), ' de agua'] },
    ejPct(2, 'El carbono de la glucosa', 'El suero de los hospitales lleva glucosa, C₆H₁₂O₆. ¿Qué porcentaje de su masa es carbono?', 'C6H12O6', 'C'),
    { nivel: 3, titulo: 'La sal que se seca', enunciado: 'Se calienta CuSO₄·5H₂O hasta que pierde toda su agua y queda CuSO₄. ¿Qué porcentaje de la masa de la sal que queda es cobre?',
      alternativas: ['39,8 %', '25,5 %', '63,5 %', '36,1 %', '20,1 %'], datos: [masasDe('CuSO4·5H2O'), D_PCT],
      solucion: [{ texto: 'Lo que queda es CuSO₄, de masa molar M = 63,5 + 32 + 4 · 16 = 159,5 g/mol.', ecuacion: [Pc('% Cu'), ' = 100 · ', { frac: ['63,5', '159,5'] }, ' ≈ ', Pc('39,8 %')] },
        { texto: ['La ', letra('B'), ' usa la masa molar del hidrato, 249,5 g/mol, y la ', letra('C'), ' toma la masa atómica del cobre como si fuera un porcentaje.'] },
        { texto: ['La ', letra('D'), ' es el porcentaje de agua del hidrato, y la ', letra('E'), ', el del azufre en el CuSO₄.'] }],
      respuesta: [letra('A'), ', ', Pc('39,8 %')] },
    { nivel: 3, titulo: 'El metal desconocido', enunciado: 'Un óxido XO, de un metal X, tiene 40 % de oxígeno en masa. ¿Cuál es la masa atómica de X?',
      alternativas: ['16', '40', '60', '32', '24'], datos: [masasDe('O'), D_PCT],
      solucion: [{ texto: 'Los 16 g del O son el 40 % de la masa molar, así que esa masa molar es:', ecuacion: [M_, '(XO) = ', { frac: ['16', '0,40'] }, ' = 40 g/mol'] },
        { texto: 'Al restar el oxígeno queda la masa atómica de X: 40 − 16 = 24.' },
        { texto: ['La ', letra('A'), ' es la masa atómica del O, y la ', letra('B'), ', la masa molar del óxido. La ', letra('C'), ' toma el 60 % del metal como si fuera su masa, y la ', letra('D'), ' es el doble de 16.'] }],
      respuesta: [letra('E'), ', ', Mm('24')] },
    { nivel: 3, titulo: 'El abono más rico', enunciado: '¿Cuál de estos abonos tiene mayor porcentaje de nitrógeno en masa?',
      alternativas: ['(NH₄)₂SO₄', 'CO(NH₂)₂', 'NH₄NO₃', 'KNO₃', 'Ca(NO₃)₂'], datos: [masasDe('(NH4)2SO4', 'CO(NH2)2', 'KNO3', 'Ca(NO3)2'), D_PCT],
      solucion: [{ texto: 'Los porcentajes de N son: (NH₄)₂SO₄ 21,2 %; CO(NH₂)₂ 46,7 %; NH₄NO₃ 35 %; KNO₃ 13,9 %; Ca(NO₃)₂ 17,1 %.' },
        { texto: ['La ', letra('A'), ', la ', letra('C'), ', la ', letra('D'), ' y la ', letra('E'), ' acompañan su nitrógeno con más masa de otros elementos, así que su porcentaje es menor.'] }],
      respuesta: [letra('B'), ', la urea'] },
    { nivel: 3, titulo: 'El carbono de un flavonoide', enunciado: 'La quercetina, C₁₅H₁₀O₇, abunda en las capas de afuera de la cebolla. ¿Qué porcentaje de su masa es carbono?',
      alternativas: ['3,97 %', '46,9 %', '40,4 %', '59,6 %', '15,0 %'], datos: [masasDe('C15H10O7'), D_PCT],
      solucion: [{ texto: 'La masa molar es M = 15 · 12 + 10 · 1 + 7 · 16 = 302 g/mol, y los 15 C pesan 180 g:', ecuacion: [Pc('% C'), ' = 100 · ', { frac: ['180', '302'] }, ' ≈ ', Pc('59,6 %')] },
        { texto: ['La ', letra('A'), ' cuenta un solo C, y la ', letra('B'), ' es el porcentaje de átomos, 15 de 32. La ', letra('C'), ' es el resto de la masa, y la ', letra('E'), ' toma el subíndice como si fuera un porcentaje.'] }],
      respuesta: [letra('D'), ', ', Pc('59,6 %')] },
    { nivel: 3, titulo: 'El oxígeno de una muestra', enunciado: '¿Cuántos gramos de oxígeno hay en 25 g de carbonato de calcio, CaCO₃?',
      alternativas: ['12 g', '4 g', '15 g', '10 g', '48 g'], datos: [masasDe('CaCO3'), D_PCT, D_MUESTRA],
      solucion: [{ texto: 'Con M = 100 g/mol, los tres O pesan 48 de cada 100 g, es decir, el 48 %.', ecuacion: [Ms('masa de O'), ' = ', { frac: ['48 · 25', '100'] }, ' = ', Ms('12 g')] },
        { texto: ['Los 4 g cuentan un solo O, y los 15 g toman el 60 % de los átomos. Los 10 g son el calcio, y los 48 g, el oxígeno de un mol entero.'] }],
      respuesta: [Ms('12 g')] },
  ];

  // Ahora tú y Así se resuelve: listas distintas, sin el metano de Predice, las del juego ni las de los ejemplos.
  const AT4 = ['HNO3', 'KOH', 'Na2CO3', 'C3H8', 'Al2O3', 'NaOH', 'K2SO4', 'C12H22O11', 'MgSO4', 'NaHCO3'];
  const RES4 = [['NH4NO3', 'N'], ['C2H6O', 'C'], ['CuSO4', 'S'], ['KNO3', 'K'], ['Ca(OH)2', 'Ca'], ['H3PO4', 'P']];
  const HIDR4 = ['MgSO4·7H2O', 'Na2CO3·10H2O', 'FeSO4·7H2O', 'Na2SO4·10H2O', 'ZnSO4·7H2O'];
  const OXIDOS4 = [['XO', 1, 1, 64], ['XO', 1, 1, 40], ['X₂O₃', 2, 3, 27], ['X₂O', 2, 1, 39], ['XO₂', 1, 2, 48]];
  const elPct = (r, fo) => r.de(Object.keys(atomosDe(fo)));
  function casoPct(r) {
    const fo = r.de(AT4), e = elPct(r, fo), a = atomosDe(fo), p = pctDe(fo, e), tot = MM.totalAtomos(fo);
    return { pregunta: ['¿Qué porcentaje de la masa del ', bonita(fo), ' es ', NOMBRE[e], '?'], datos: [masasDe(fo), D_M, D_PCT],
      opciones: opciones(p, [
        { id: 'atomos', valor: 100 * a[e] / tot, error: 'ES19', siFuera: `Ese es el porcentaje de átomos, ${a[e]} de ${tot}, pero en masa cuenta lo que pesa cada uno.` },
        { id: 'uno', valor: a[e] > 1 ? MM.composicion(fo).unAtomo[e] : null, error: 'ES18', siFuera: `Dividir entre ${f(Mde(fo), 1)} está bien, pero cada unidad trae ${pluralAt(a[e], e)}, así que su masa atómica va por ${a[e]}.` },
        { id: 'resto', valor: 100 - p, error: 'QM-PORCENTAJE', siFuera: `Ese es el porcentaje de los otros elementos, que sumado con el del ${e} da 100 %.` },
        { id: 'sinsub', valor: MM.composicion(fo).sinSubindices[e], error: 'ES18', siFuera: 'El camino está bien, pero en la masa molar cada masa atómica va por su subíndice.' },
      ], pTxt),
      solucion: { texto: `Con M(${bonita(fo)}) = ${f(Mde(fo), 1)} g/mol, el ${e} aporta ${a[e] > 1 ? `${a[e]} · ${f(MASAS[e], 1)}` : f(MASAS[e], 1)} g de cada mol:`, ecuacion: ecPct(fo, e) } };
  }
  function casoMasaEn(r) {
    const fo = r.de(AT4), e = elPct(r, fo), a = atomosDe(fo), M = Mde(fo), m = M * r.de([0.5, 2, 1.5, 0.25, 3]), bien = m * a[e] * MASAS[e] / M, tot = MM.totalAtomos(fo);
    return { pregunta: ['¿Cuántos gramos de ', NOMBRE[e], ` hay en ${f(m, 2)} g de ${bonita(fo)}?`], datos: [masasDe(fo), D_M, D_PCT, D_MUESTRA],
      opciones: opciones(bien, [
        { id: 'uno', valor: a[e] > 1 ? m * MASAS[e] / M : null, error: 'ES18', siFuera: `La proporción está bien, pero cada unidad trae ${pluralAt(a[e], e)}, así que su masa atómica va por ${a[e]}.` },
        { id: 'atomos', valor: m * a[e] / tot, error: 'ES19', siFuera: `Ese número reparte la masa según los átomos, ${a[e]} de ${tot}, pero cada átomo pesa distinto.` },
        { id: 'mol', valor: a[e] * MASAS[e] !== bien ? a[e] * MASAS[e] : null, error: 'QM-PCT-GRAMOS', siFuera: `En un mol, ${f(M, 1)} g, hay ${f(a[e] * MASAS[e], 1)} g de ${e}, pero aquí la muestra es de ${f(m, 2)} g.` },
        { id: 'resto', valor: m - bien, error: 'QM-PORCENTAJE', siFuera: `Ese número es lo que pesan los otros elementos; el ${e} es el resto de la muestra.` },
      ], gTxt),
      solucion: { texto: `El ${e} es el ${f(pctDe(fo, e), 2)} % de la masa, así que en la muestra pesa:`, ecuacion: [Ms(`masa de ${e}`), ' = ', { frac: [`${f(a[e] * MASAS[e], 1)} · ${f(m, 2)}`, f(M, 1)] }, ig(bien, gTxt(bien)), Ms(gTxt(bien))] } };
  }
  function casoHidrato(r) {
    const fo = r.de(HIDR4), x = +fo.match(/·(\d+)/)[1], sal = fo.split('·')[0], M = Mde(fo), agua = 18 * x, p = 100 * agua / M;
    return { pregunta: `¿Qué porcentaje de la masa del ${bonita(fo)} es agua?`, datos: [masasDe(fo), `En un hidrato, ·${x}H₂O son ${x} moléculas de agua por unidad`, '% de agua = 100 · masa del agua / M'],
      opciones: opciones(p, [
        { id: 'anhidra', valor: 100 * agua / Mde(sal), error: 'QM-HIDRATO-ANHIDRA', siFuera: `La masa del agua, ${agua} g, está bien, pero se divide entre la masa molar de todo el hidrato, ${f(M, 1)} g/mol.` },
        { id: 'una', valor: 100 * 18 / M, error: 'ES18', siFuera: `Ese número cuenta una sola molécula de agua, y el hidrato trae ${x}.` },
        { id: 'resto', valor: 100 - p, error: 'QM-PORCENTAJE', siFuera: 'Ese es el porcentaje de la sal sin agua, y se pide el del agua.' },
      ], pTxt),
      solucion: { texto: `La masa molar es ${f(M, 1)} g/mol, y el agua pesa ${x} · 18 = ${agua} g de ella.`, ecuacion: [Pc('% agua'), ' = 100 · ', { frac: [String(agua), f(M, 1)] }, ig(p, pTxt(p)), Pc(pTxt(p))] } };
  }
  function casoInverso(r) {
    const [tipo, a, b, Ma] = r.de(OXIDOS4), M = a * Ma + 16 * b, p = 100 * 16 * b / M;
    return { pregunta: `Un óxido ${tipo}, de un metal X, tiene ${f(p, 2)} % de oxígeno en masa. ¿Cuál es la masa atómica de X?`, datos: [masasDe('O'), D_PCT],
      opciones: opciones(Ma, [
        { id: 'total', valor: M, error: 'QM-INV-TOTAL', siFuera: `Esa es la masa molar del óxido, y falta quitarle los ${16 * b} g de oxígeno${a > 1 ? ` y repartir el resto entre ${a}` : ''}.` },
        { id: 'pct', valor: +f(100 - p, 2).replace(',', '.'), error: 'QM-PORCENTAJE', siFuera: 'Ese número es el porcentaje en masa del metal, no su masa atómica.' },
        { id: 'sinA', valor: a > 1 ? a * Ma : null, error: 'QM-INV-TOTAL', siFuera: `Restar el oxígeno está bien, pero la fórmula trae ${a} átomos de X, así que el resto se reparte entre ${a}.` },
        { id: 'por', valor: 16 * b * p / 100, error: 'QM-PORCENTAJE', siFuera: `Usar los ${16 * b} g de O está bien, pero son el ${f(p, 2)} % de la masa molar, así que se dividen entre ${f(p / 100, 4)}, no se multiplican.` },
        { id: 'suma', valor: (M + 16 * b) / a, error: 'QM-INV-TOTAL', siFuera: `La masa molar, ${f(M, 0)} g/mol, está bien, pero el oxígeno se resta, no se suma.` },
      ], x => f(x, 2)),
      solucion: { texto: `Los ${16 * b} g de O son el ${f(p, 2)} %, así que M ≈ ${f(M, 0)} g/mol; después se quita el O${a > 1 ? ` y se reparte entre ${a}` : ''}.`,
        ecuacion: [a > 1 ? { frac: [`${f(M, 0)} − ${16 * b}`, String(a)] } : `${f(M, 0)} − ${16 * b}`, ' = ', Mm(f(Ma, 2))] } };
  }

  const composicion = {
    id: 'composicion-formula-empirica',
    titulo: 'Composición centesimal',
    pregunta: '¿Qué parte de la masa de un compuesto pone cada elemento?',
    temas: ['Composición centesimal'],
    pieza: 'quim-composicion',
    aprendizaje: 'El porcentaje en masa de un elemento es su masa en un mol entre la masa molar: cuenta lo que pesa cada átomo.',
    actividad: 'Comparar en dos barras cuántos átomos pone cada elemento y cuánta masa.',
    lee: {
      tarjetas: [
        { titulo: 'La sal no es todo sodio', texto: 'La tabla de nutrición de un paquete de sal dice cuánto sodio tiene, porque la sal, NaCl, no es todo sodio: una parte de su masa es cloro.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'sal', etiqueta: 'NaCl', nombre: 'Un paquete de sal de cocina' }, estado: {} } },
        { titulo: 'Porcentaje en masa', texto: 'El porcentaje en masa de un elemento dice cuántos gramos de ese elemento hay en cada 100 g del compuesto. Los porcentajes de todos sus elementos suman 100 %, y juntos forman su composición centesimal.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la barra de arriba cuenta los átomos y la de abajo reparte la masa de un mol. Compara las dos: ¿el elemento con más átomos es el que más pesa?' },
      ],
    },
    ejemplos: EJEMPLOS_PCT,
    juega: {
      consigna: 'Elige un compuesto: la barra de arriba cuenta sus átomos y la de abajo dice cuánto pesa cada elemento en un mol.',
      mision: { texto: 'Encuentra el compuesto con la mitad de su masa en oxígeno.', logrado: v => v.k === 'SO2',
        bien: 'Listo: en el SO₂, los dos O pesan 32 g, lo mismo que el S.' },
      voz: 'Más átomos no siempre es más masa: cada átomo pesa distinto.',
      leyenda: [
        { s: 'arriba', t: 'cuántos átomos de cada elemento (no es masa)' },
        { s: 'abajo', t: 'cuánto pesa cada elemento en un mol' },
        { s: Pc('%'), t: 'porcentaje en masa del elemento' },
      ],
      controles: [{ id: 'k', etiqueta: 'Compuesto', opciones: Object.keys(COMP4).map(k => ({ valor: k, texto: `${COMP4[k]}, ${bonita(k)}` })) }],
      dibujo: v => barras4(v.k, focoDe(v.k)),
      lectura: v => lectura4(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-composicion',
      pregunta: 'En el metano, CH₄, hay 4 átomos de hidrógeno por cada átomo de carbono. ¿Qué porcentaje de su masa es hidrógeno?',
      datos: ['Masas atómicas redondeadas: C\u00a012; H\u00a01'],
      voz: 'Piensa en lo que pesa cada átomo, no solo en cuántos hay.',
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'atomos', texto: '80 %', error: 'ES19', siFuera: 'Es cierto que el 80 % de los átomos son H, pero en masa cuenta lo que pesa cada uno, y un C pesa 12 veces más que un H.' },
        { id: 'carbono', texto: '75 %', error: 'QM-PORCENTAJE', siFuera: 'La cuenta de masas está bien, pero ese 75 % es el del carbono, 12 de los 16 g, y se pide el del hidrógeno.' },
        { id: 'cuatro', texto: '4 %', error: 'QM-PORCENTAJE', siFuera: 'Los 4 g de H están bien, pero se comparan con los 16 g de un mol de metano, no con 100 g.' },
      ],
      dibujo: { datos: { filas: [{ titulo: 'átomos de CH₄ (no es masa)', tramos: [{ valor: 1, texto: '1 C' }, { valor: 4, texto: '4 H' }] }, { titulo: 'masa: ¿?', tramos: [{ valor: 100, texto: '¿cuánto es H?' }] }],
        alt: 'Arriba, los átomos del CH₄: 1 C y 4 H. Abajo, la barra de su masa, sin repartir.' }, estado: {} },
      revelar: barras4('CH4', 'H'),
      coincide: 'Coincide: en un mol de metano, el H pesa 4 g de 16 g, y 100 · 4/16 = 25 %.',
      noCoincide: 'El H aporta 4 g de los 16 g de un mol: 100 · 4/16 = 25 % de la masa, aunque sea el 80 % de los átomos.',
    },
    mira: {
      pieza: 'quim-composicion',
      datos: { filas: [
        { titulo: 'urea, CO(NH₂)₂: 60 g/mol', tramos: [{ valor: 12, texto: 'C 12' }, { valor: 16, texto: 'O 16' }, { valor: 28, texto: 'N 28', color: 'h' }, { valor: 4, texto: 'H 4' }], desde: 1 },
      ], alt: 'Barra de la masa de un mol de urea, 60 g: C 12 g, O 16 g, N 28 g (en carmín) y H 4 g.' },
      voz: 'Sigamos el nitrógeno de un saco de urea.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La urea es un abono, y su masa molar suma 12 + 16 + 2 · 14 + 4 · 1.', ecuacion: [M_, ' = ', Mm('60 g/mol')] },
        { estado: { corte: 1 }, texto: 'Sus dos nitrógenos pesan 28 g por mol.', ecuacion: [Ms('masa de N'), ' = 2 · 14 = ', Ms('28 g')] },
        { estado: { corte: 1 }, texto: 'El porcentaje es esa parte entre la masa molar, por 100.', ecuacion: [Pc('% N'), ' = 100 · ', { frac: ['28', '60'] }, ' ≈ ', Pc('46,7 %')] },
        { estado: { corte: 1 }, texto: 'Por eso los sacos de urea dicen que tienen 46 % de nitrógeno.' },
        { estado: { corte: 1 }, texto: 'En un saco de 50 kg hay unos 23 kg de N.', ecuacion: ['50 · 46,7 / 100 ≈ 23,3 kg'] },
      ],
    },
    regla: {
      texto: 'El porcentaje en masa de un elemento X es la masa de sus átomos en un mol (átomos × masa atómica) entre la masa molar, por 100. En m gramos del compuesto hay % · m / 100 gramos de X.',
      ecuacion: [Pc('% de X'), ' = ', { frac: [['100 · ', Ms('masa de X')], M_] }],
      condicion: 'M es la masa molar de la fórmula completa, también con el agua cuando el compuesto es un hidrato.',
      voz: 'Pesa la masa de cada átomo, no solo cuántos hay.',
    },
    resuelve: {
      pieza: 'quim-composicion',
      generar(s) {
        const [fo, e] = RES4[idx(s, RES4.length)], a = atomosDe(fo)[e], M = Mde(fo), p = pctDe(fo, e);
        return { enunciado: ['¿Qué porcentaje de la masa del ', bonita(fo), ' es ', NOMBRE[e], '?'], datos: [masasDe(fo), D_M, D_PCT],
          dibujo: barras4(fo, e, true),
          pasos: [
            { tipo: 'pide', texto: `Se pide el porcentaje en masa del ${e} en el ${bonita(fo)}.` },
            { tipo: 'datos', texto: `Se conocen la fórmula, con ${a} ${a === 1 ? 'átomo' : 'átomos'} de ${e} por unidad, y las masas atómicas.` },
            { tipo: 'regla', texto: 'El porcentaje es la masa del elemento en un mol (átomos × masa atómica) entre la masa molar, por 100.', ecuacion: [Pc('%'), ' = ', { frac: [Ms('masa del elemento'), M_] }, ' · 100'] },
            { tipo: 'cuentas', texto: `La masa molar suma ${cuentaM(fo)}:`, ecuacion: ecMc(fo) },
            { tipo: 'cuentas', texto: `El ${e} aporta ${a > 1 ? `${a} · ${f(MASAS[e], 1)} = ` : ''}${f(a * MASAS[e], 1)} g de cada mol.`, ecuacion: ecPct(fo, e) },
            { tipo: 'sentido', texto: `El resultado está entre 0 y 100 %, y los demás elementos ponen el ${pTxt(100 - p)} que falta.` },
          ],
          respuesta: [Pc(pTxt(p)), ` de ${e}`] };
      },
    },
    ahoraTu: {
      pieza: 'quim-composicion',
      voz: 'Usa la masa de cada átomo, no solo cuántos hay.',
      generar(s) {
        const r = azar(s + 19), tipo = ['pct', 'masaEn', 'hidrato', 'inverso'][idx(s, 4)];
        return { pct: casoPct, masaEn: casoMasaEn, hidrato: casoHidrato, inverso: casoInverso }[tipo](r);
      },
    },
  };

  // ---------- Idea 5 (nueva, 19 nov): fórmula empírica y molecular ----------
  // Propuesta §3 idea 5. Objeto de la primera pantalla: una botella de vinagre (ácido acético, C₂H₄O₂; quim-mol).
  // Cambia: los átomos de C (x) y de H (y) de un hidrocarburo · Permanece: la barra de su masa, partida en C y H ·
  // Progresa: fórmulas distintas con la misma razón dan los mismos porcentajes · Se reserva: un compuesto que no es de C y H
  // con razón 1 : 1,5 (Predice: el N₂O₃) · Debe verse: que el análisis da la razón de átomos, no cuántos hay.
  // Errores: ES16 (la empírica como razón de masas), ES17 (la empírica como la molecular), QM-REDONDEO (1,5 redondeado a
  // 1 o a 2), QM-EMP-INVERTIDA (los subíndices al revés), QM-FACTOR (k a un solo subíndice o un k equivocado).
  const fx = (x, y) => `C${sub(x)}H${sub(y)}`;
  const masaCH = (x, y) => 12 * x + y;
  function barras5(x, y) {
    const M = masaCH(x, y), pc = 100 * 12 * x / M;
    return { pieza: 'quim-composicion', datos: { filas: [
      { titulo: `átomos de ${fx(x, y)} (no es masa)`, tramos: [{ valor: x, texto: `${x} C` }, { valor: y, texto: `${y} H` }] },
      { titulo: `masa: ${M} g/mol`, tramos: [{ valor: 12 * x, texto: `C ${pTxt(pc)}`, color: 'h' }, { valor: y, texto: `H ${pTxt(100 - pc)}`, color: 'h' }] }],
      alt: `Dos barras de ${fx(x, y)}: arriba, ${x} C y ${y} H; abajo, su masa de ${M} g/mol: C ${pTxt(pc)} y H ${pTxt(100 - pc)}.` }, estado: {} };
  }
  const mcd5 = (a, b) => (b ? mcd5(b, a % b) : a);
  const lectura5 = (x, y) => { const pc = 100 * 12 * x / masaCH(x, y), g = mcd5(x, y); return [`${fx(x, y)}: C `, Pc(pTxt(pc)), ' y H ', Pc(pTxt(100 - pc)), `; C : H = ${x}\u00a0:\u00a0${y}${g > 1 ? ` = ${x / g}\u00a0:\u00a0${y / g}` : ''}`]; };
  const D_EMP1 = 'n(elemento) = masa del elemento / masa atómica';
  const D_EMP2 = 'Empírica: se dividen los moles entre el menor';
  // Cierre: los casos dan cocientes de 1,5, 2,5, 3,5, 1,33 y 1,67; el Dato los cubre todos.
  const D_EMP3 = 'Si un cociente termina en ,5, todo por 2; en ,33 o ,67, por 3; en ,25 o ,75, por 4';
  const D_100 = 'En 100 g del compuesto, el % de cada elemento es su masa en gramos';
  const D_K = 'molecular = k × empírica, con k = M / M(empírica), un entero';
  const fEsc = sb => bonita(MM.escribir(sb));
  const masasEls = els => masasTxt(els);

  // Ejemplos de la idea 5. Cuentas rehechas aparte (verif/cuentas.js) y con el motor: C₆H₁₂O₆ → CH₂O · H₂O₂ → HO · C₄H₁₀ → C₂H₅ ·
  // CO₂ · 24 g de C 2 mol · 85,7/14,3 → CH₂ · 40/60 → SO₃ · 52,9/47,1 → Al₂O₃ · CH y 78 → C₆H₆ · 1,2 g C y 0,25 g H → C₂H₅ ·
  // 81,8/18,2 → C₃H₈ · 40/6,7/53,3 y 60 → C₂H₄O₂ · 72,4/27,6 → Fe₃O₄ · CH₂O y 150 → 20 átomos · VFV.
  const EJEMPLOS_EMP = [
    { nivel: 1, titulo: 'La empírica de la glucosa', enunciado: 'La glucosa es C₆H₁₂O₆. ¿Cuál es su fórmula empírica?', datos: ['Empírica: la razón de enteros más simple entre los átomos de la fórmula'],
      solucion: [{ texto: 'Los subíndices 6, 12 y 6 se dividen entre 6, el mayor número que los divide a todos.', ecuacion: ['6 : 12 : 6 = 1 : 2 : 1'] }], respuesta: ['CH₂O'] },
    { nivel: 1, titulo: 'El agua oxigenada', enunciado: 'El agua oxigenada es H₂O₂. ¿Cuál es su fórmula empírica?', datos: ['Empírica: la razón de enteros más simple entre los átomos de la fórmula'],
      solucion: [{ texto: 'La razón de los subíndices, 2 : 2, se simplifica a 1 : 1.' }], respuesta: ['HO'] },
    { nivel: 1, titulo: 'El gas del balón', enunciado: 'El butano de algunos balones de gas es C₄H₁₀. ¿Cuál es su fórmula empírica?', datos: ['Empírica: la razón de enteros más simple entre los átomos de la fórmula'],
      solucion: [{ texto: 'Los subíndices 4 y 10 se dividen entre 2, y ya no hay otro número que divida a los dos.', ecuacion: ['4 : 10 = 2 : 5'] }], respuesta: ['C₂H₅'] },
    { nivel: 1, titulo: 'Ya es la más simple', enunciado: 'El dióxido de carbono es CO₂. ¿Cuál es su fórmula empírica?', datos: ['Empírica: la razón de enteros más simple entre los átomos de la fórmula'],
      solucion: [{ texto: 'La razón 1 : 2 no se puede simplificar, así que la molecular y la empírica coinciden.' }], respuesta: ['CO₂'] },
    { nivel: 1, titulo: 'Moles de un elemento', enunciado: 'En 100 g de un compuesto hay 24 g de carbono. ¿Cuántos moles de átomos de carbono son?', datos: [masasEls(['C']), D_EMP1],
      solucion: [{ texto: 'Los moles salen de dividir la masa entre la masa atómica del carbono.', ecuacion: [n_, '(C) = ', { frac: ['24', '12'] }, ' = ', Mo('2 mol')] }], respuesta: [Mo('2 mol')] },
    { nivel: 2, titulo: 'De porcentajes a fórmula', enunciado: 'Un hidrocarburo tiene 85,7 % de C y 14,3 % de H. ¿Cuál es su fórmula empírica?', datos: [masasEls(['C', 'H']), D_100, D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'En 100 g hay 85,7 g de C y 14,3 g de H, y sus moles son:', ecuacion: [n_, '(C) = ', { frac: ['85,7', '12'] }, ' ≈ 7,14', SEP, n_, '(H) = ', { frac: ['14,3', '1'] }, ' = 14,3'] },
        { texto: 'Al dividir entre el menor queda 1 : 2,00.' }], respuesta: ['CH₂'] },
    { nivel: 2, titulo: 'Un óxido de azufre', enunciado: 'Un óxido de azufre tiene 40 % de S y 60 % de O. ¿Cuál es su fórmula empírica?', datos: [masasEls(['S', 'O']), D_100, D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'En 100 g hay 40 g de S y 60 g de O, y sus moles son:', ecuacion: [n_, '(S) = ', { frac: ['40', '32'] }, ' = 1,25', SEP, n_, '(O) = ', { frac: ['60', '16'] }, ' = 3,75'] },
        { texto: 'Al dividir entre el menor queda 1 : 3.' }], respuesta: ['SO₃'] },
    { nivel: 2, titulo: 'Una razón de 1,5', enunciado: 'Un óxido de aluminio tiene 52,9 % de Al y 47,1 % de O. ¿Cuál es su fórmula empírica?', datos: [masasEls(['Al', 'O']), D_100, D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'En 100 g, los moles de cada elemento son:', ecuacion: [n_, '(Al) = ', { frac: ['52,9', '27'] }, ' ≈ 1,96', SEP, n_, '(O) = ', { frac: ['47,1', '16'] }, ' ≈ 2,94'] },
        { texto: 'Al dividir entre el menor queda 1 : 1,5, y al multiplicar por 2, 2 : 3.' }], respuesta: ['Al₂O₃'] },
    { nivel: 2, titulo: 'De la empírica a la molecular', enunciado: 'Un líquido tiene fórmula empírica CH y masa molar 78 g/mol. ¿Cuál es su fórmula molecular?', datos: [masasEls(['C', 'H']), D_K],
      solucion: [{ texto: 'La empírica pesa M(CH) = 13 g/mol, así que k es:', ecuacion: ['k = ', { frac: ['78', '13'] }, ' = 6'] }, { texto: 'Cada subíndice de CH se multiplica por 6.' }], respuesta: ['C₆H₆'] },
    { nivel: 2, titulo: 'Con las masas de una muestra', enunciado: 'Una muestra de un hidrocarburo tiene 1,2 g de C y 0,25 g de H. ¿Cuál es su fórmula empírica?', datos: [masasEls(['C', 'H']), D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'Los moles de cada elemento son:', ecuacion: [n_, '(C) = ', { frac: ['1,2', '12'] }, ' = 0,1', SEP, n_, '(H) = ', { frac: ['0,25', '1'] }, ' = 0,25'] },
        { texto: 'Al dividir entre el menor queda 1 : 2,5, y al multiplicar por 2, 2 : 5.' }], respuesta: ['C₂H₅'] },
    { nivel: 3, titulo: 'El hidrocarburo del examen', enunciado: 'Un hidrocarburo tiene 81,8 % de C y 18,2 % de H en masa. ¿Cuál es su fórmula empírica?',
      alternativas: ['CH₃', 'C₃H₈', 'C₉H₂', 'CH₂', 'C₆H₁₆'], datos: [masasEls(['C', 'H']), D_100, D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'En 100 g, los moles son:', ecuacion: [n_, '(C) = ', { frac: ['81,8', '12'] }, ' ≈ 6,82', SEP, n_, '(H) = 18,2'] },
        { texto: 'Al dividir entre el menor queda 1 : 2,67 ≈ 1 : 8/3, y al multiplicar por 3, 3 : 8.' },
        { texto: ['La ', letra('A'), ' redondea 2,67 a 3, y la ', letra('C'), ' usa la razón de masas, 81,8 : 18,2 ≈ 9 : 2. La ', letra('D'), ' redondea a 2, y la ', letra('E'), ' no simplifica.'] }],
      respuesta: [letra('B'), ', C₃H₈'] },
    { nivel: 3, titulo: 'El ácido del vinagre', enunciado: 'El ácido del vinagre tiene 40 % de C, 6,7 % de H y 53,3 % de O, y masa molar 60 g/mol. ¿Cuál es su fórmula molecular?',
      alternativas: ['CH₂O', 'C₂H₂O', 'C₆H₁₂O₆', 'C₄H₈O₄', 'C₂H₄O₂'], datos: [masasEls(['C', 'H', 'O']), D_100, D_EMP1, D_EMP2, D_EMP3, D_K],
      solucion: [{ texto: 'En 100 g, los moles son 3,33; 6,7 y 3,33, y al dividir entre el menor queda 1 : 2 : 1: la empírica es CH₂O, de 30 g/mol.', ecuacion: ['k = ', { frac: ['60', '30'] }, ' = 2'] },
        { texto: ['La ', letra('A'), ' es la empírica, y la ', letra('B'), ' multiplica solo el C. La ', letra('C'), ' pesa 180 g/mol y la ', letra('D'), ', 120 g/mol, no 60.'] }],
      respuesta: [letra('E'), ', C₂H₄O₂'] },
    { nivel: 3, titulo: 'El óxido del imán', enunciado: 'La magnetita, un mineral que atrae al imán, tiene 72,4 % de Fe y 27,6 % de O. ¿Cuál es su fórmula empírica?',
      alternativas: ['FeO', 'Fe₂O₃', 'Fe₃O₄', 'Fe₅O₂', 'Fe₄O₃'], datos: [masasEls(['Fe', 'O']), D_100, D_EMP1, D_EMP2, D_EMP3],
      solucion: [{ texto: 'En 100 g, los moles son:', ecuacion: [n_, '(Fe) = ', { frac: ['72,4', '56'] }, ' ≈ 1,293', SEP, n_, '(O) = ', { frac: ['27,6', '16'] }, ' = 1,725'] },
        { texto: 'Al dividir entre el menor queda 1 : 1,33, y al multiplicar por 3, 3 : 4.' },
        { texto: ['La ', letra('A'), ' redondea 1,33 a 1, y la ', letra('B'), ' multiplica por 2 en vez de por 3 y después redondea 2 : 2,67 a 2 : 3. La ', letra('D'), ' usa la razón de masas, y la ', letra('E'), ' pone la razón al revés.'] }],
      respuesta: [letra('C'), ', Fe₃O₄'] },
    { nivel: 3, titulo: 'Cuántos átomos tiene', enunciado: 'Un azúcar tiene fórmula empírica CH₂O y masa molar 150 g/mol. ¿Cuántos átomos tiene una molécula?',
      alternativas: ['4', '5', '25', '20', '15'], datos: [masasEls(['C', 'H', 'O']), D_K],
      solucion: [{ texto: 'La empírica pesa M(CH₂O) = 30 g/mol, y k dice cuántas veces cabe en 150:', ecuacion: ['k = ', { frac: ['150', '30'] }, ' = 5   →   C₅H₁₀O₅'] },
        { texto: 'La molécula C₅H₁₀O₅ tiene 5 + 10 + 5 = 20 átomos.' },
        { texto: ['La ', letra('A'), ' cuenta los átomos de la empírica, y la ', letra('B'), ' es k. La ', letra('C'), ' le suma k a 20, y la ', letra('E'), ' olvida los 5 O.'] }],
      respuesta: [letra('D'), ', 20'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: '¿Qué es verdadero (V) y qué es falso (F)? I. C₂H₄ y C₃H₆ tienen la misma fórmula empírica. II. La empírica siempre tiene menos átomos que la molecular. III. Con la empírica y la masa molar se halla la molecular.',
      alternativas: ['VFV', 'VVV', 'FFV', 'VVF', 'FVF'], datos: ['Empírica: la razón de enteros más simple entre los átomos', D_K],
      solucion: [{ texto: 'I es verdadera, porque las dos se simplifican a CH₂. II es falsa: en el agua, H₂O, la empírica y la molecular coinciden.' },
        { texto: 'III es verdadera: k = M / M(empírica) dice cuántas veces se repite la empírica en la molécula.' },
        { texto: ['La ', letra('B'), ' y la ', letra('D'), ' dan por cierta la II; la ', letra('C'), ' da por falsa la I, y la ', letra('E'), ', la I y la III.'] }],
      respuesta: [letra('A'), ', VFV'] },
  ];

  // Ahora tú y Así se resuelve: listas distintas, sin la fórmula de la misión (CH₃), el N₂O₃ de Predice ni las de los
  // ejemplos. Los porcentajes salen del motor, redondeados a una cifra decimal; el caso se usa solo si el motor, con esos
  // porcentajes redondeados, vuelve a dar la fórmula (si no, se elige otro).
  const RES5 = [{ C: 82.8, H: 17.2 }, { N: 30.4, O: 69.6 }, { P: 43.7, O: 56.3 }, { Ca: 40, C: 12, O: 48 }, { K: 56.5, C: 8.7, O: 34.8 }];
  // Sin las de razón 1 : 1 (sus errores de masas y de razón al revés darían la misma fórmula).
  const ENTERA5 = ['Na2O', 'N2O', 'Cu2O', 'K2O', 'CS2', 'CaF2', 'Na2S', 'K2S', 'H2S', 'CO2', 'MgF2'];
  const MEDIO5 = ['Fe2O3', 'N2O5', 'Cr2O3', 'Mn2O7', 'C3H4', 'Mn3O4', 'C3H5', 'P2O3'];
  // Empíricas con los factores k de moléculas que existen (C₂H₂, C₆H₆, los alquenos, los azúcares, N₂O₄, P₄O₁₀, C₄H₁₀…).
  const EMP5 = [['CH', [2, 4, 8]], ['CH2', [2, 3, 4, 5, 6]], ['CH2O', [3, 4]], ['NO2', [2]], ['C2H5', [2]], ['P2O5', [2]], ['C3H4', [3]], ['CHO', [4]], ['C2H3', [2, 4]], ['CH3O', [2]]];
  const COMPLETA5 = ['C4H8O2', 'C2H6O2', 'C3H6O3', 'C4H10O2', 'C6H8O6', 'C8H8O2', 'C2H2O4'];
  const pcts = fo => { const p = MM.composicion(fo).porcentajes; return Object.fromEntries(Object.keys(p).map(e => [e, Math.round(p[e] * 10) / 10])); };
  const pctTxt = d => listaY(Object.keys(d).map(e => `${f(d[e], 1)} % de ${e}`));
  // Las alternativas de una empírica: la razón de masas (ES16), el redondeo sin multiplicar (QM-REDONDEO), los subíndices al
  // revés (QM-EMP-INVERTIDA) y el doble (ES17). Cada explicación da el porcentaje que tendría esa fórmula de verdad.
  function erroresEmp(d, emp) {
    const e = MM.empirica(d), els = Object.keys(d), sb = e.subindices, primero = els[0], pDe = fo => pctDe(fo, primero);
    const out = [];
    const con = (fo, id, error, que) => { try { const fe = MM.escribir(MM.atomos(fo)); if (fe === emp) return; out.push({ valor: bonita(fe), id, error, siFuera: `${que} Con ${bonita(fe)}, ${primero} sería ${pTxt(pDe(fe))}.` }); } catch (x) { /* fórmula sin masa */ } };
    con(e.porMasas, 'masas', 'ES16', 'Buscar enteros está bien, pero esa razón compara masas, no moles.');
    if (e.multiplicador > 1) con(e.redondeando, 'redondeo', 'QM-REDONDEO', `Los moles están bien, pero esa fórmula redondea en vez de multiplicar por ${e.multiplicador}.`);
    if (els.length === 2) con(MM.escribir({ [els[0]]: sb[els[1]], [els[1]]: sb[els[0]] }), 'invertida', 'QM-EMP-INVERTIDA', 'La razón está bien, pero con los subíndices al revés.');
    con(MM.escribir(Object.fromEntries(els.map(x => [x, 2 * sb[x]]))), 'doble', 'ES17', 'La razón de átomos está bien, pero la empírica es la más simple, y esa se puede dividir entre 2.');
    return out;
  }
  function casoEmpirica(r, lista) {
    for (let k = 0; k < 40; k++) {
      const fo = r.de(lista), d = pcts(fo), emp = MM.escribir(MM.atomos(fo));
      let e; try { e = MM.empirica(d); } catch (x) { continue; }
      if (e.formula !== emp) continue;
      const els = Object.keys(d);
      return { pregunta: `Un compuesto tiene ${pctTxt(d)} en masa. ¿Cuál es su fórmula empírica?`, datos: [masasEls(els), D_100, D_EMP1, D_EMP2, D_EMP3],
        opciones: opsTexto(bonita(emp), erroresEmp(d, emp).map(x => [x.valor, x.id, x.error, x.siFuera])),
        solucion: { texto: `Los moles de 100 g, divididos entre el menor, dan ${els.map(x => f(e.razon[x], 2)).join(' : ')}${e.multiplicador > 1 ? `, y se multiplica todo por ${e.multiplicador}` : ''}.`, ecuacion: [els.map(x => `${x}: ${f(d[x], 1)}/${f(MASAS[x], 1)} ≈ ${f(e.moles[x], 2)}`).join(SEP)] } };
    }
    throw new Error('sin caso de empírica');
  }
  function casoMolecular(r) {
    const [emp, ks] = r.de(EMP5), k = r.de(ks);
    const Me = Mde(emp), M = Me * k, at = MM.atomos(emp), els = Object.keys(at), bien = MM.escribir(Object.fromEntries(els.map(x => [x, at[x] * k])));
    const otro = (sb, id, error, que) => { const fo = MM.escribir(sb); return fo === bien || fo === emp ? null : [bonita(fo), id, error, `${que} ${bonita(fo)} pesaría ${f(Mde(fo), 1)} g/mol.`]; };
    return { pregunta: `Un compuesto tiene fórmula empírica ${bonita(emp)} y masa molar ${f(M, 1)} g/mol. ¿Cuál es su fórmula molecular?`, datos: [masasEls(els), D_K],
      opciones: opsTexto(bonita(bien), [
        [bonita(emp), 'emp', 'ES17', `Esa es la empírica, que pesa ${f(Me, 1)} g/mol; sería la molecular si las dos masas molares coincidieran.`],
        otro(Object.fromEntries(els.map((x, i) => [x, i ? at[x] : at[x] * k])), 'soloPrimero', 'QM-FACTOR', `El factor ${k} está bien, pero multiplica a todos los subíndices, no solo al primero.`),
        otro(Object.fromEntries(els.map(x => [x, at[x] * (k + 1)])), 'otroK', 'QM-FACTOR', `El factor es ${f(M, 1)} / ${f(Me, 1)} = ${k}, no ${k + 1}.`),
        otro(Object.fromEntries(els.map(x => [x, at[x] + k])), 'suma', 'QM-FACTOR', `El factor ${k} está bien, pero multiplica los subíndices, no se les suma.`),
      ].filter(Boolean)),
      solucion: { texto: `La empírica pesa M(${bonita(emp)}) = ${f(Me, 1)} g/mol, y k dice cuántas veces cabe en la masa molar:`, ecuacion: ['k = ', { frac: [f(M, 1), f(Me, 1)] }, ` = ${k}`, SEP, `${bonita(emp)} × ${k} = ${bonita(bien)}`] } };
  }
  function casoCompleta(r) {
    for (let t = 0; t < 40; t++) {
      const fo = r.de(COMPLETA5), d = pcts(fo), M = Mde(fo), mol = MM.escribir(MM.atomos(fo));
      let e; try { e = MM.empirica(d); } catch (x) { continue; }
      const k = M / e.M; if (Math.abs(k - Math.round(k)) > 1e-9) continue;
      const els = Object.keys(d);
      const otro = (sb, id, error, que) => { const x = MM.escribir(sb); return x === mol ? null : [bonita(x), id, error, `${que} ${bonita(x)} pesaría ${f(Mde(x), 1)} g/mol.`]; };
      return { pregunta: `Un compuesto tiene ${pctTxt(d)} en masa, y masa molar ${f(M, 1)} g/mol. ¿Cuál es su fórmula molecular?`, datos: [masasEls(els), D_100, D_EMP1, D_EMP2, D_EMP3, D_K],
        opciones: opsTexto(bonita(mol), [
          otro(e.subindices, 'emp', 'ES17', `Esa es la empírica, y la masa molar del compuesto es ${k} veces la suya.`),
          otro(Object.fromEntries(els.map((x, i) => [x, i ? e.subindices[x] : e.subindices[x] * k])), 'soloPrimero', 'QM-FACTOR', `El factor ${k} está bien, pero multiplica a todos los subíndices, no solo al primero.`),
          otro(Object.fromEntries(els.map(x => [x, e.subindices[x] * (k + 1)])), 'otroK', 'QM-FACTOR', `El factor es ${f(M, 1)} / ${f(e.M, 1)} = ${k}, no ${k + 1}.`),
        ].filter(Boolean)),
        solucion: { texto: `Con los moles de 100 g divididos entre el menor sale la empírica ${bonita(e.formula)}, de ${f(e.M, 1)} g/mol:`, ecuacion: ['k = ', { frac: [f(M, 1), f(e.M, 1)] }, ` = ${Math.round(k)}`, SEP, bonita(mol)] } };
    }
    throw new Error('sin caso de molecular');
  }

  const empirica = {
    id: 'formula-empirica-molecular',
    titulo: 'Fórmula empírica y molecular',
    pregunta: '¿Cómo se pasa de los porcentajes de un análisis a una fórmula?',
    temas: ['Fórmula empírica y molecular'],
    pieza: 'quim-composicion',
    aprendizaje: 'La empírica sale de pasar cada masa a moles y dividir entre el menor; la molecular es k veces la empírica.',
    actividad: 'Armar un hidrocarburo con sus átomos de C y de H y leer su análisis.',
    lee: {
      tarjetas: [
        { titulo: 'El vinagre y el suero', texto: 'El vinagre tiene ácido acético, C₂H₄O₂, y el suero de los hospitales, glucosa, C₆H₁₂O₆. Son sustancias distintas, pero las dos tienen 2 H y 1 O por cada C.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'vinagre', etiqueta: 'Vinagre', nombre: 'Una botella de vinagre' }, estado: {} } },
        { titulo: 'Dos fórmulas', texto: 'La fórmula molecular dice cuántos átomos de cada elemento tiene la molécula, como C₂H₄O₂. La fórmula empírica dice solo la razón más simple entre ellos, CH₂O. Un análisis de laboratorio, en cambio, da porcentajes en masa.' },
        { titulo: 'Qué mirar', texto: 'En el juego armas un hidrocarburo: eliges cuántos átomos de C y cuántos de H tiene una molécula. Mira su análisis: qué porcentaje de su masa es carbono y cuál hidrógeno.' },
      ],
    },
    ejemplos: EJEMPLOS_EMP,
    juega: {
      consigna: ['Arma un hidrocarburo ', { sub: ['C', 'x'] }, { sub: ['H', 'y'] }, ', con x átomos de carbono e y de hidrógeno. La barra de abajo muestra su análisis en masa.'],
      mision: { texto: 'Arma la fórmula más simple que da 80 % de C y 20 % de H.', logrado: v => v.x === 1 && v.y === 3,
        bien: 'Listo: es CH₃. El C₂H₆ da el mismo análisis, porque los porcentajes dicen solo la razón.' },
      voz: 'Prueba fórmulas con la misma razón: ¿cambia el análisis?',
      leyenda: [
        { s: 'x', t: 'átomos de carbono en la fórmula' },
        { s: 'y', t: 'átomos de hidrógeno en la fórmula' },
        { s: Pc('%'), t: 'porcentaje en masa de cada elemento' },
      ],
      controles: [
        { id: 'x', etiqueta: 'x (átomos de C)', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 'y', etiqueta: 'y (átomos de H)', min: 1, max: 14, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => barras5(v.x, v.y),
      lectura: v => lectura5(v.x, v.y),
      minimo: 4,
    },
    predice: {
      pieza: 'quim-composicion',
      pregunta: 'Un óxido de nitrógeno tiene 36,8 % de N y 63,2 % de O en masa. ¿Cuál es su fórmula empírica?',
      datos: ['Masas atómicas redondeadas: N\u00a014; O\u00a016'],
      voz: 'Piensa qué cuentan los subíndices de una fórmula.',
      opciones: [
        { id: 'c', texto: 'N₂O₃', correcta: true },
        { id: 'masas', texto: 'N₇O₁₂', error: 'ES16', siFuera: 'Es cierto que 36,8 : 63,2 se parece a 7 : 12, pero esa es la razón de masas, y los subíndices cuentan átomos.' },
        { id: 'redondeo', texto: 'NO₂', error: 'QM-REDONDEO', siFuera: 'Pasar a moles está bien, 2,63 y 3,95, pero su cociente da 1,5, no 2, y un 1,5 no se redondea: se multiplica todo por 2.' },
        { id: 'uno', texto: 'NO', error: 'QM-REDONDEO', siFuera: 'Pasar a moles está bien, pero 3,95 / 2,63 da 1,5, y un 1,5 no se redondea a 1: se multiplica todo por 2.' },
      ],
      dibujo: { datos: { filas: [{ titulo: 'óxido de nitrógeno: fórmula ?', tramos: [{ valor: 36.8, texto: 'N 36,8 %', color: 'h' }, { valor: 63.2, texto: 'O 63,2 %', color: 'h' }] }],
        alt: 'Barra de 100 % del óxido de nitrógeno: N 36,8 % y O 63,2 %; la fórmula con «?».' }, estado: {} },
      revelar: { datos: { filas: [
        { titulo: 'en 100 g', tramos: [{ valor: 36.8, texto: 'N 36,8 g', color: 'o' }, { valor: 63.2, texto: 'O 63,2 g', color: 'o' }] },
        { titulo: 'en moles', tramos: [{ valor: 36.8 / 14, texto: `N ${f(36.8 / 14, 2)}`, color: 'f' }, { valor: 63.2 / 16, texto: `O ${f(63.2 / 16, 2)}`, color: 'f' }] },
        { titulo: 'entre el menor, por 2: N₂O₃', tramos: [{ valor: 2, texto: 'N 2' }, { valor: 3, texto: 'O 3' }] }],
        alt: 'En 100 g, 36,8 g de N y 63,2 g de O; en moles, 2,63 y 3,95; entre el menor, 1 : 1,5; por 2, N₂O₃.' }, estado: {} },
      coincide: `Coincide: hay ${f(36.8 / 14, 2)} mol de N y ${f(63.2 / 16, 2)} mol de O, en razón 1 : 1,5, y por 2 queda N₂O₃.`,
      noCoincide: `En moles, 36,8/14 ≈ ${f(36.8 / 14, 2)} y 63,2/16 ≈ ${f(63.2 / 16, 2)}, que están en razón 1 : 1,5; al multiplicar por 2 queda N₂O₃.`,
    },
    mira: {
      pieza: 'quim-composicion',
      datos: { filas: [
        { titulo: 'en 100 g de un azúcar', tramos: [{ valor: 40, texto: 'C 40 g', color: 'o' }, { valor: 6.7, texto: 'H 6,7 g', color: 'o' }, { valor: 53.3, texto: 'O 53,3 g', color: 'o' }], desde: 1 },
        { titulo: 'en moles', tramos: [{ valor: 40 / 12, texto: `C ${f(40 / 12, 2)}`, color: 'f' }, { valor: 6.7, texto: 'H 6,7', color: 'f' }, { valor: 53.3 / 16, texto: `O ${f(53.3 / 16, 2)}`, color: 'f' }], desde: 2 },
        { titulo: 'entre el menor', tramos: [{ valor: 1, texto: 'C 1' }, { valor: 2, texto: 'H 2' }, { valor: 1, texto: 'O 1' }], desde: 3 },
      ], alt: 'Tres barras: en 100 g, C 40 g, H 6,7 g y O 53,3 g; en moles, 3,33, 6,7 y 3,33; entre el menor, 1 : 2 : 1.' },
      voz: 'Sigamos la receta con un azúcar de 180 g/mol.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En 100 g del azúcar, cada porcentaje se lee como gramos de su elemento.', ecuacion: ['C 40 g', SEP, 'H 6,7 g', SEP, 'O 53,3 g'] },
        { estado: { corte: 2 }, texto: 'Cada masa dividida entre su masa atómica da los moles de ese elemento.', ecuacion: [`40/12 ≈ ${f(40 / 12, 2)}`, SEP, '6,7/1 = 6,7', SEP, `53,3/16 ≈ ${f(53.3 / 16, 2)}`] },
        { estado: { corte: 3 }, texto: 'Al dividir entre el menor sale 1 : 2 : 1, así que la empírica es CH₂O.', ecuacion: [`6,7 / ${f(40 / 12, 2)} ≈ ${f(6.7 / (40 / 12), 2)}`] },
        { estado: { corte: 3 }, texto: 'La empírica pesa 30 g/mol; con 180 g/mol, la molecular es 6 veces la empírica.', ecuacion: ['k = ', { frac: ['180', '30'] }, ' = 6', SEP, 'C₆H₁₂O₆'] },
        { estado: { corte: 3 }, texto: 'Si un cociente sale 1,5, no se redondea: se multiplica todo por 2 para tener enteros.', ecuacion: ['1 : 1,5 = 2 : 3'] },
      ],
    },
    regla: {
      texto: 'Para la empírica, pasa cada masa a moles y divide entre el menor; si un cociente termina en ,5, multiplica todo por 2, y si termina en ,33 o ,67, por 3. La molecular es k veces la empírica.',
      ecuacion: [n_, ' = ', { frac: [m_, Mm('masa atómica')] }, SEP, 'k = ', { frac: [M_, 'M(empírica)'] }],
      condicion: 'cada porcentaje se lee como gramos en 100 g del compuesto y k sale entero; sin la masa molar, solo se puede hallar la empírica.',
      voz: 'Gramos, después moles, después la razón entera.',
    },
    resuelve: {
      pieza: 'quim-composicion',
      generar(s) {
        const d = RES5[idx(s, RES5.length)], e = MM.empirica(d), els = Object.keys(d);
        return { enunciado: `Un compuesto tiene ${pctTxt(d)} en masa. ¿Cuál es su fórmula empírica?`, datos: [masasEls(els), D_100, D_EMP1, D_EMP2, D_EMP3],
          pasos: [
            { tipo: 'pide', texto: 'Se pide la fórmula empírica, es decir, la razón de enteros más simple entre los átomos.' },
            { tipo: 'datos', texto: `En 100 g del compuesto hay ${listaY(els.map(x => `${f(d[x], 1)} g de ${x}`))}.` },
            { tipo: 'regla', texto: 'Cada masa se pasa a moles, y después todos se dividen entre el menor.', ecuacion: [n_, ' = ', { frac: [m_, Mm('masa atómica')] }] },
            { tipo: 'cuentas', texto: 'Los moles de cada elemento salen de su masa entre su masa atómica:', ecuacion: [els.map(x => `${x}: ${f(d[x], 1)}/${f(MASAS[x], 1)} ≈ ${f(e.moles[x], 3)}`).join(SEP)] },
            { tipo: 'cuentas', texto: `Al dividir entre el menor queda ${els.map(x => f(e.razon[x], 2)).join(' : ')}${e.multiplicador > 1 ? `, y al multiplicar por ${e.multiplicador} quedan enteros` : ''}.` },
            { tipo: 'sentido', texto: `Con ${bonita(e.formula)}, los porcentajes vuelven a dar ${listaY(els.map(x => `${x} ${pTxt(pctDe(e.formula, x))}`))}, como el análisis.` },
          ],
          respuesta: [bonita(e.formula)] };
      },
    },
    ahoraTu: {
      voz: 'Pasa primero a moles y después busca la razón entera.',
      generar(s) {
        const r = azar(s + 23), tipo = ['entera', 'medio', 'molecular', 'completa'][idx(s, 4)];
        return tipo === 'entera' ? casoEmpirica(r, ENTERA5) : tipo === 'medio' ? casoEmpirica(r, MEDIO5) : tipo === 'molecular' ? casoMolecular(r) : casoCompleta(r);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): leyes ponderales ----------
  // Propuesta §3 idea 6. Objeto de la primera pantalla: un frasco cerrado sobre una balanza (quim-mol).
  // Cambia: la masa de una muestra de agua · Permanece: una muestra de 72 g para comparar, a la misma escala · Progresa: la
  // barra crece y sus dos tramos crecen juntos · Se reserva: el CO y el CO₂ (Predice: dos compuestos de los mismos
  // elementos) · Debe verse: que la razón O : H no cambia con la cantidad.
  // Errores: ES13 (el gas no pesa; en un frasco cerrado la masa baja), ES15 (la masa que se forma, solo la de uno de los
  // dos), QM-PROPORCION (otra razón de masas; el mismo compuesto con otra razón), QM-ABIERTO (en un vaso abierto la
  // balanza no cambia), QM-PROUST-SUMA (sumar la diferencia de masas en vez de mantener la razón).
  // Sin balance de ecuaciones (Reacciones y balance) ni reactivo limitante (Estequiometría): las combinaciones dicen que
  // todo reacciona, y se habla de «lo de antes» y «lo que se forma».
  const alPaso = (x, paso, min) => min + Math.round((x - min) / paso) * paso;
  const REF6 = 72;
  const agua6 = (g, titulo) => ({ titulo: titulo || `${f(g, 0)} g de agua`, tramos: [{ valor: g / 9, texto: `H ${f(g / 9, 0)} g`, color: 'o' }, { valor: 8 * g / 9, texto: `O ${f(8 * g / 9, 0)} g`, color: 'o' }] });
  const muestras6 = g => ({ escala: 'comun', filas: [agua6(REF6, `${REF6} g de agua de lluvia (para comparar)`), agua6(g, `${f(g, 0)} g de agua del caño`)],
    alt: `Dos barras a la misma escala: ${REF6} g de agua, con 8 g de H y 64 g de O; y ${f(g, 0)} g de agua, con ${f(g / 9, 0)} g de H y ${f(8 * g / 9, 0)} g de O.` });
  const PC = () => Kit.piezas['quim-composicion'];
  const lectura6 = g => [`En ${f(g, 0)} g de agua, O : H = `, Ms(f(8 * g / 9, 0)), ' : ', Ms(f(g / 9, 0)), ' = 8 : 1'];
  const D_LAV = 'Sistema cerrado: masa de lo de antes = masa de lo que se forma';
  const D_PROUST = 'Un compuesto tiene siempre la misma razón entre las masas de sus elementos';
  const D_DALTON = 'Si dos elementos forman dos compuestos, las masas de uno unidas a la misma masa del otro van como enteros pequeños';
  const barrasCO = (o2, oculto) => ({ pieza: 'quim-composicion', datos: { escala: 'comun', filas: [
    { titulo: 'CO', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 16, texto: 'O 16 g', color: 'o' }] },
    // Con «?» la fila del CO₂ no dibuja el tramo del O: su largo, a la misma escala, era la respuesta (lector B).
    { titulo: oculto ? 'CO₂: 12 g de C con ¿cuánto O?' : 'CO₂', tramos: oculto ? [{ valor: 12, texto: 'C 12 g' }] : [{ valor: 12, texto: 'C 12 g' }, { valor: 32, texto: 'O 32 g', color: 'o' }] }],
    alt: oculto ? 'CO: 12 g de C con 16 g de O. CO₂: 12 g de C con una masa de O que se pregunta.' : 'A la misma escala: CO con 12 g de C y 16 g de O; CO₂ con 12 g de C y 32 g de O, el doble.' }, estado: {} });

  // Ejemplos de la idea 6. Cuentas rehechas aparte (verif/cuentas.js): 3,1 + 4 = 7,1 g · 2 + 16 = 18 g · 45 g de agua 40 g
  // de O · 15,9 g de CuO 12,7 g de Cu · SO₂ y SO₃ 2 : 3 · 60 + 5 − 62,4 = 2,6 g · clavo 0,8 g · 7 g de N 8 g de O ·
  // N₂O y NO₂ 1 : 4 · 30 kg de urea 14 kg de N · FVV · Mn 2 : 3 : 4 · 20 − 11,2 = 8,8 g · 32,5 g de Zn · FeO y Fe₂O₃ 2 : 3.
  const EJEMPLOS_LEY = [
    { nivel: 1, titulo: 'Fósforo en un frasco cerrado', enunciado: 'En un frasco cerrado arden 3,1 g de fósforo con 4 g de oxígeno, y todo reacciona. ¿Cuántos gramos de óxido se forman?', datos: [D_LAV],
      solucion: [{ texto: 'Nada entra ni sale del frasco, así que el óxido pesa lo mismo que lo de antes.', ecuacion: ['3,1 + 4 = ', Ms('7,1 g')] }], respuesta: [Ms('7,1 g')] },
    { nivel: 1, titulo: 'El agua que se forma', enunciado: 'En un recipiente cerrado, 2 g de hidrógeno y 16 g de oxígeno forman agua, y no queda nada de lo de antes. ¿Cuánta agua se forma?', datos: [D_LAV],
      solucion: [{ texto: 'En un recipiente cerrado, la masa de lo de antes es la de lo que se forma.', ecuacion: ['2 + 16 = ', Ms('18 g')] }], respuesta: [Ms('18 g')] },
    { nivel: 1, titulo: 'El oxígeno del agua', enunciado: 'El agua tiene siempre 8 g de oxígeno por cada 1 g de hidrógeno. ¿Cuántos gramos de oxígeno hay en 45 g de agua?', datos: [D_PROUST],
      solucion: [{ texto: '8 g de oxígeno y 1 g de hidrógeno forman 9 g de agua: de cada 9 g, 8 g son de oxígeno.', ecuacion: ['45 · 8/9 = ', Ms('40 g')] }], respuesta: [Ms('40 g')] },
    { nivel: 1, titulo: 'Otra muestra del mismo óxido', enunciado: 'Una muestra de 79,5 g de óxido de cobre(II) tiene 63,5 g de cobre. ¿Cuánto cobre hay en 15,9 g del mismo óxido?', datos: [D_PROUST],
      solucion: [{ texto: '15,9 g son la quinta parte de 79,5 g, así que la muestra tiene la quinta parte del cobre.', ecuacion: ['63,5 · ', { frac: ['15,9', '79,5'] }, ' = ', Ms('12,7 g')] }], respuesta: [Ms('12,7 g')] },
    { nivel: 1, titulo: 'Dos óxidos del azufre', enunciado: 'Con 32 g de azufre, el SO₂ lleva 32 g de oxígeno y el SO₃, 48 g. ¿En qué razón están esas masas de oxígeno?', datos: [D_DALTON],
      solucion: [{ texto: 'Se simplifica 32 : 48 dividiendo entre 16.', ecuacion: ['32 : 48 = 2 : 3'] }], respuesta: ['2 : 3'] },
    { nivel: 2, titulo: 'El gas que escapa', enunciado: 'En un vaso abierto se juntan 60 g de vinagre y 5,0 g de bicarbonato; burbujea y al final la balanza marca 62,4 g. ¿Cuánto gas escapó?', datos: [D_LAV],
      solucion: [{ texto: 'Antes había 65,0 g, y lo que falta en la balanza es el gas que salió del vaso.', ecuacion: ['60 + 5,0 − 62,4 = ', Ms('2,6 g')] },
        { texto: 'La masa no desapareció: el vaso abierto no es un sistema cerrado.' }], respuesta: [Ms('2,6 g'), ' de gas'] },
    { nivel: 2, titulo: 'El clavo que se oxida', enunciado: 'Un clavo de 10,0 g se oxida al aire y su herrumbre pesa 10,8 g. ¿Se cumple la conservación de la masa?', datos: [D_LAV],
      solucion: [{ texto: 'El hierro se unió al oxígeno del aire, y ese oxígeno también estaba antes, aunque fuera del clavo.', ecuacion: ['10,8 − 10,0 = 0,8 g de oxígeno'] },
        { texto: 'Si se cuenta ese oxígeno, la masa se conserva.' }], respuesta: ['Sí: ganó 0,8 g de oxígeno del aire'] },
    { nivel: 2, titulo: 'Cuánto oxígeno se une', enunciado: 'En el NO, 14 g de nitrógeno se unen con 16 g de oxígeno. ¿Cuántos gramos de oxígeno se unen con 7 g de nitrógeno para formar NO?', datos: [D_PROUST],
      solucion: [{ texto: '7 g son la mitad de 14 g, así que se une la mitad del oxígeno.', ecuacion: ['16 · ', { frac: ['7', '14'] }, ' = ', Ms('8 g')] }], respuesta: [Ms('8 g'), ' de O'] },
    { nivel: 2, titulo: 'Dos óxidos del nitrógeno', enunciado: 'Con 28 g de nitrógeno, el N₂O lleva 16 g de oxígeno. En el NO₂, ¿en qué razón está el oxígeno unido a los mismos 28 g?', datos: [masasDe('N2O', 'NO2'), D_DALTON],
      solucion: [{ texto: '28 g de N son 2 mol de átomos, y en el NO₂ van con 4 mol de O, que pesan 64 g.', ecuacion: ['16 : 64 = 1 : 4'] }], respuesta: ['1 : 4'] },
    { nivel: 2, titulo: 'El nitrógeno de un saco', enunciado: 'La urea tiene 28 g de nitrógeno en cada 60 g. ¿Cuántos kilogramos de nitrógeno hay en un saco de 30 kg de urea?', datos: [D_PROUST],
      solucion: [{ texto: 'La razón 28 : 60 vale para cualquier cantidad de urea, también en kilogramos.', ecuacion: ['30 · ', { frac: ['28', '60'] }, ' = ', Ms('14 kg')] }], respuesta: [Ms('14 kg')] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: '¿Qué es verdadero (V) o falso (F)? I. Si papel arde en un plato abierto y queda menos masa, la masa desapareció. II. En un frasco cerrado la masa no cambia. III. Un clavo que se oxida pesa más.',
      alternativas: ['VVF', 'FVF', 'FFV', 'FVV', 'VVV'], datos: [D_LAV],
      solucion: [{ texto: 'I es falsa, porque los gases salen al aire. II es verdadera: en un frasco cerrado nada entra ni sale.' },
        { texto: 'III es verdadera: el hierro gana oxígeno del aire.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' dan por cierto que la masa desaparece; la ', letra('B'), ' da por falsa la III, y la ', letra('C'), ', la II.'] }],
      respuesta: [letra('D'), ', FVV'] },
    { nivel: 3, titulo: 'Tres óxidos del manganeso', enunciado: 'Con 110 g de manganeso, el MnO lleva 32 g de O, el Mn₂O₃ 48 g y el MnO₂ 64 g. ¿En qué razón están esas masas de oxígeno?',
      alternativas: ['1 : 3 : 2', '2 : 3 : 4', '1 : 1 : 1', '4 : 3 : 2', '2 : 4 : 3'], datos: [D_DALTON],
      solucion: [{ texto: 'Se dividen 32, 48 y 64 entre 16.', ecuacion: ['32 : 48 : 64 = 2 : 3 : 4'] },
        { texto: ['La ', letra('A'), ' copia los subíndices del O sin igualar el Mn, y la ', letra('C'), ' supone que el oxígeno no cambia. La ', letra('D'), ' va al revés, y la ', letra('E'), ' cruza dos óxidos.'] }],
      respuesta: [letra('B'), ', 2 : 3 : 4'] },
    { nivel: 3, titulo: 'Lo que escapa del crisol', enunciado: 'En un crisol abierto se calientan 20 g de carbonato de calcio y quedan 11,2 g de óxido de calcio; el resto se fue como gas. ¿Cuántos gramos de gas escaparon?',
      alternativas: ['11,2 g', '31,2 g', '8,8 g', '20 g', '0 g'], datos: [D_LAV],
      solucion: [{ texto: 'Lo de antes pesaba 20 g y lo que queda pesa 11,2 g, así que la diferencia es el gas:', ecuacion: ['20 − 11,2 = ', Ms('8,8 g')] },
        { texto: ['La ', letra('A'), ' es lo que queda, y la ', letra('B'), ' suma en vez de restar. La ', letra('D'), ' es todo lo de antes, y la ', letra('E'), ' supone que nada se fue.'] }],
      respuesta: [letra('C'), ', ', Ms('8,8 g')] },
    { nivel: 3, titulo: 'Proust al revés', enunciado: 'Una muestra de óxido de zinc tiene 13 g de zinc y 3,2 g de oxígeno. ¿Cuántos gramos de zinc se unen con 8 g de oxígeno?',
      alternativas: ['32,5 g', '1,97 g', '17,8 g', '8 g', '21 g'], datos: [D_PROUST],
      solucion: [{ texto: 'La razón entre el zinc y el oxígeno no cambia, así que el zinc crece en la misma proporción que el oxígeno:', ecuacion: ['13 · ', { frac: ['8', '3,2'] }, ' = ', Ms('32,5 g')] },
        { texto: ['La ', letra('B'), ' pone la razón al revés, y la ', letra('C'), ' suma la diferencia, 13 + 4,8. La ', letra('D'), ' copia los 8 g, y la ', letra('E'), ' suma 13 + 8.'] }],
      respuesta: [letra('A'), ', ', Ms('32,5 g')] },
    { nivel: 3, titulo: 'Dos óxidos del hierro', enunciado: 'Con 56 g de hierro, el FeO lleva 16 g de oxígeno y el Fe₂O₃ lleva 24 g. ¿En qué razón están esas masas de oxígeno?',
      alternativas: ['1 : 1', '1 : 3', '3 : 2', '2 : 1', '2 : 3'], datos: [D_DALTON],
      solucion: [{ texto: 'Se simplifica 16 : 24 dividiendo entre 8.', ecuacion: ['16 : 24 = 2 : 3'] },
        { texto: ['La ', letra('A'), ' supone que son iguales, y la ', letra('B'), ' compara los subíndices del O, 1 y 3. La ', letra('C'), ' va al revés, y la ', letra('D'), ' compara los subíndices del Fe.'] }],
      respuesta: [letra('E'), ', 2 : 3'] },
  ];

  // Ahora tú y Así se resuelve: listas distintas, sin el agua del juego, el CO y el CO₂ de Predice ni los de los ejemplos.
  const RES6 = [['óxido de magnesio', 10, 6, 35, 'magnesio'], ['sulfuro de hierro(II)', 22, 14, 66, 'hierro'], ['óxido de calcio', 14, 10, 42, 'calcio'], ['fluoruro de calcio', 39, 20, 117, 'calcio']];
  const PROUST6 = [['óxido de zinc', 16.2, 13, 'zinc'], ['óxido de aluminio', 51, 27, 'aluminio'], ['amoníaco', 34, 28, 'nitrógeno'], ['dióxido de azufre', 16, 8, 'azufre'], ['sulfuro de zinc', 19.4, 13, 'zinc'], ['óxido de sodio', 31, 23, 'sodio']];
  const DALTON6 = [['N₂O', 'NO', 28, 16, 32, 'nitrógeno'], ['NO', 'NO₂', 14, 16, 32, 'nitrógeno'], ['N₂O₃', 'N₂O₅', 28, 48, 80, 'nitrógeno'], ['Cu₂O', 'CuO', 127, 16, 32, 'cobre'], ['H₂O', 'H₂O₂', 2, 16, 32, 'hidrógeno'], ['PbO', 'PbO₂', 207, 16, 32, 'plomo'], ['SnO', 'SnO₂', 119, 16, 32, 'estaño']];
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const razon = (a, b) => { const g = mcd(a, b); return `${a / g} : ${b / g}`; };
  function casoCerrado(r) {
    const k = r.ent(1, 8) / 2, c = 3 * k, o = 8 * k;
    return { pregunta: `En un frasco cerrado arden ${f(c, 1)} g de carbón con ${f(o, 1)} g de oxígeno, y todo reacciona. ¿Cuántos gramos de gas se forman?`, datos: [D_LAV],
      opciones: opciones(c + o, [
        { id: 'oxigeno', valor: o, error: 'ES15', siFuera: 'Ese número es solo el oxígeno, pero el carbón también queda en el gas que se forma.' },
        { id: 'resta', valor: o - c, error: 'ES13', siFuera: 'En un frasco cerrado no se pierde masa, así que las masas de lo de antes se suman, no se restan.' },
        { id: 'carbon', valor: c, error: 'ES13', siFuera: 'Ese número es solo el carbón, y el gas también pesa: lleva el carbón y el oxígeno.' },
      ], x => `${f(x, 1)} g`),
      solucion: { texto: 'El frasco está cerrado y todo reacciona, así que lo que se forma pesa lo mismo que lo de antes.', ecuacion: [`${f(c, 1)} + ${f(o, 1)} = `, Ms(`${f(c + o, 1)} g`)] } };
  }
  function casoAbierto(r) {
    const v = r.ent(4, 12) * 10, b = r.ent(4, 10) / 2, gas = Math.round(b * 0.52 * 10) / 10, final = v + b - gas;
    return { pregunta: `En un vaso abierto se juntan ${v} g de vinagre y ${f(b, 1)} g de bicarbonato. Sale gas y al final la balanza marca ${f(final, 1)} g. ¿Cuántos gramos de gas escaparon?`, datos: [D_LAV],
      opciones: opciones(gas, [
        { id: 'final', valor: final, error: 'QM-ABIERTO', siFuera: 'Ese número es lo que quedó en el vaso, y el gas es lo que falta para llegar a la masa de antes.' },
        { id: 'bicarbonato', valor: b, error: 'ES15', siFuera: 'Ese número es el bicarbonato, y el gas es lo que falta: lo de antes menos lo que marca al final.' },
        { id: 'suma', valor: v + b, error: 'ES13', siFuera: 'Ese número es todo lo de antes, y falta restarle lo que quedó en el vaso.' },
        { id: 'cero', valor: 0, error: 'QM-ABIERTO', siFuera: 'Sería cierto en un frasco cerrado, pero en un vaso abierto el gas sale al aire.' },
      ], x => `${f(x, 1)} g`),
      solucion: { texto: 'Lo que falta en la balanza es el gas que escapó.', ecuacion: [`${v} + ${f(b, 1)} − ${f(final, 1)} = `, Ms(`${f(gas, 1)} g`)] } };
  }
  function casoProust(r) {
    const [nom, m1, x1, el] = r.de(PROUST6), k = r.de([2, 3, 0.5, 1.5, 2.5]), m = +(m1 * k).toFixed(2), bien = x1 * k;
    return { pregunta: `Una muestra de ${f(m1, 1)} g de ${nom} tiene ${f(x1, 1)} g de ${el}. ¿Cuánto ${el} hay en ${f(m, 2)} g del mismo compuesto?`, datos: [D_PROUST],
      opciones: opciones(bien, [
        { id: 'inv', valor: m * m1 / x1, error: 'QM-PROPORCION', siFuera: `Usar la razón está bien, pero quedó al revés: el ${el} es ${f(x1, 1)} g de cada ${f(m1, 1)} g.` },
        { id: 'suma', valor: x1 + (m - m1), error: 'QM-PROUST-SUMA', siFuera: `Ese número suma la diferencia de masas al ${el}, pero la razón se mantiene multiplicando, no sumando.` },
        { id: 'igual', valor: x1, error: 'QM-PROPORCION', siFuera: `Esos ${f(x1, 1)} g son de la primera muestra, y una muestra más ${m > m1 ? 'grande' : 'pequeña'} tiene ${m > m1 ? 'más' : 'menos'} ${el}.` },
      ], x => `${f(x, 2)} g`),
      solucion: { texto: `La razón entre el ${el} y el compuesto no cambia (Proust), así que:`, ecuacion: [`${f(x1, 1)} · `, { frac: [f(m, 2), f(m1, 1)] }, ' = ', Ms(`${f(bien, 2)} g`)] } };
  }
  function casoDalton(r) {
    const [a, b, base, o1, o2, el] = r.de(DALTON6), bien = razon(o1, o2);
    return { pregunta: `Con la misma masa de ${el}, ¿en qué razón están las masas de oxígeno del ${a} y del ${b}?`, datos: [masasTxt(['O']), D_DALTON, `Con ${base} g de ${el}, el ${a} lleva ${o1} g de O`],
      opciones: opsTexto(bien, [
        ['1 : 1', 'igual', 'QM-PROPORCION', 'Serían iguales si fueran el mismo compuesto, pero aquí la fórmula cambia.'],
        [razon(o2, o1), 'reves', 'QM-PROPORCION', 'La razón está bien, pero al revés: primero va el oxígeno del primer compuesto.'],
        [`${o1} : ${o2 + o1}`, 'suma', 'QM-PROPORCION', `Empezar con ${o1} g está bien, pero el ${b} lleva ${o2} g de O, no ${o1 + o2} g.`],
      ]),
      solucion: { texto: `Con ${base} g de ${el}, el ${b} lleva ${o2} g de O, y la razón se simplifica:`, ecuacion: [`${o1} : ${o2} = ${bien}`] } };
  }

  const leyes = {
    id: 'leyes-ponderales',
    titulo: 'Leyes ponderales',
    pregunta: '¿Qué cumplen siempre las masas cuando las sustancias se combinan?',
    temas: ['Leyes ponderales'],
    pieza: 'quim-composicion',
    aprendizaje: 'En un sistema cerrado la masa se conserva; un compuesto tiene razón de masas fija, y dos compuestos de lo mismo, razón de enteros pequeños.',
    actividad: 'Estirar una muestra de agua y comparar la masa de oxígeno con la de hidrógeno.',
    lee: {
      tarjetas: [
        { titulo: 'El frasco cerrado', texto: 'Sobre una balanza hay un frasco cerrado con un poco de carbón y aire. Si el carbón arde dentro, nada entra ni sale del frasco, y eso es lo que se llama un sistema cerrado.',
          pieza: 'quim-mol', dibujo: { pieza: 'quim-mol', datos: { vista: 'objeto', objeto: 'frasco', etiqueta: '250,0 g', nombre: 'Un frasco cerrado sobre la balanza' }, estado: {} } },
        { titulo: 'Pesar antes y después', texto: 'En el siglo XVIII, Lavoisier pesó frascos cerrados antes y después de calentar metales dentro de ellos. Desde entonces, pesar antes y después de una reacción es una de las pruebas básicas de la química.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay dos muestras de agua de lugares distintos. Estira la de abajo y mira si cambia la razón entre la masa de oxígeno y la de hidrógeno.' },
      ],
    },
    ejemplos: EJEMPLOS_LEY,
    juega: {
      consigna: ['Arriba van 72 g de agua de lluvia; abajo, la del caño, a igual escala; cada barra parte la masa, ', m_, ', en H y O.'],
      mision: { texto: 'Estira la barra de abajo hasta que el agua tenga 4 g de hidrógeno.', logrado: v => alPaso(v.g, 9, 18) === 36,
        bien: 'Listo: 36 g de agua, con 4 g de H y 32 g de O.' },
      voz: 'Divide el oxígeno entre el hidrógeno en cada muestra.',
      leyenda: [
        { s: m_, t: 'masa de cada elemento, en gramos' },
        { s: 'barra', t: 'el agua entera, partida en H y O' },
      ],
      controles: [{ id: 'g', etiqueta: 'agua del caño', color: 'c-o', min: 18, max: 72, paso: 9, inicio: 18, unidad: 'g', decimales: 0 }],
      dibujo: v => ({ pieza: 'quim-composicion', datos: muestras6(alPaso(v.g, 9, 18)), estado: {} }),
      lectura: v => lectura6(alPaso(v.g, 9, 18)),
      minimo: 3,
      // Se agarra el extremo de la barra de abajo y se estira: el agua crece y sus dos tramos crecen juntos, así que la razón
      // O : H de la lectura no cambia. La barra de 72 g fija la escala común.
      arrastres: [{ id: 'muestra', etiqueta: 'extremo de la barra del agua del caño', color: 'c-o',
        donde: v => { const q = alPaso(v.g, 9, 18), g = PC().geometria(muestras6(q)); return { x: g.xDe(1, q), y: g.y(1) + g.hb / 2 }; },
        mover: pt => ({ g: Math.max(18, Math.min(72, PC().geometria(muestras6(18)).valorEn(1, pt.x))) }) }],
    },
    predice: {
      pieza: 'quim-composicion',
      pregunta: 'Con 12 g de carbono, el CO lleva 16 g de oxígeno. En el CO₂, ¿cuánto oxígeno se une a los mismos 12 g de carbono?',
      datos: ['Masas atómicas redondeadas: C\u00a012; O\u00a016'],
      voz: 'Son dos sustancias distintas hechas de lo mismo.',
      opciones: [
        { id: 'c', texto: '32 g', correcta: true },
        { id: 'igual', texto: '16 g, porque son los mismos elementos', error: 'QM-PROPORCION', siFuera: 'Serían 16 g si fuera el mismo compuesto, pero el CO₂ es otra sustancia, con otra razón entre sus masas.' },
        { id: 'molar', texto: '44 g', error: 'QM-PROPORCION', siFuera: 'La suma 12 + 32 está bien hecha, pero 44 g es todo el CO₂, carbono y oxígeno juntos, y se pide solo el oxígeno.' },
        { id: 'medio', texto: '24 g', error: 'QM-PROPORCION', siFuera: 'Es cierto que lleva más oxígeno, pero cada C del CO₂ tiene 2 O, el doble que en el CO, no una vez y media.' },
      ],
      dibujo: barrasCO(32, true),
      revelar: barrasCO(32, false),
      coincide: 'Coincide: 16 g y 32 g están en razón 1 : 2, como dice la ley de las proporciones múltiples.',
      noCoincide: 'En el CO₂ se unen 32 g de oxígeno, el doble que en el CO, así que están en razón 1 : 2.',
    },
    mira: {
      pieza: 'quim-composicion',
      datos: { escala: 'comun', filas: [
        { titulo: 'antes: carbón y oxígeno', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 32, texto: 'O₂ 32 g', color: 'o' }], desde: 1 },
        { titulo: 'después: CO₂', tramos: [{ valor: 44, texto: 'CO₂ 44 g', color: 'o' }], desde: 2 },
        { titulo: 'CO: con los mismos 12 g de C', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 16, texto: 'O 16 g', color: 'o' }], desde: 4 },
      ], alt: 'Barras a la misma escala: antes, 12 g de C y 32 g de O₂; después, 44 g de CO₂; y el CO, con 12 g de C y 16 g de O.' },
      voz: 'Comparemos antes y después con la misma escala.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En un frasco cerrado hay, antes de arder, 12 g de carbono y 32 g de oxígeno.', ecuacion: ['12 + 32 = 44 g'] },
        { estado: { corte: 2 }, texto: 'Después quedan 44 g de CO₂, así que la masa se conserva (Lavoisier).', ecuacion: ['antes 44 g, después 44 g'] },
        { estado: { corte: 2 }, texto: 'En todo CO₂, el carbono y el oxígeno están en razón 12 a 32, o 3 a 8 (Proust).', ecuacion: ['12 : 32 = 3 : 8'] },
        { estado: { corte: 4 }, texto: 'En el CO, los mismos 12 g de C llevan 16 g de O, y 16 g y 32 g están en razón 1 : 2.', ecuacion: ['16 : 32 = 1 : 2 (Dalton)'] },
        { estado: { corte: 4 }, texto: 'En un frasco abierto, el CO₂ se va al aire y la balanza marca menos, aunque la masa no desaparece.' },
      ],
    },
    regla: {
      texto: 'En un sistema cerrado, la masa no cambia (Lavoisier). Un compuesto tiene siempre la misma razón entre las masas de sus elementos (Proust). Si dos elementos forman dos compuestos, las masas de uno unidas a la misma masa del otro van como enteros pequeños (Dalton).',
      ecuacion: [m_, ' antes = ', m_, ' después', SEP, 'O con 12 g de C: 16 : 32 = 1 : 2'],
      condicion: 'el sistema está cerrado, como pide Lavoisier: si un gas sale o entra, la balanza cambia, aunque la masa no desaparezca.',
      voz: 'Antes de calcular, revisa que la masa cuadre.',
      dibujo: barrasCO(32, false),
    },
    resuelve: {
      pieza: 'quim-composicion',
      generar(s) {
        const [nom, m1, x1, m, el] = RES6[idx(s, RES6.length)], bien = x1 * m / m1;
        return { enunciado: `Una muestra de ${m1} g de ${nom} tiene ${x1} g de ${el}. ¿Cuántos gramos de ${el} hay en ${m} g del mismo compuesto?`, datos: [D_PROUST],
          pasos: [
            { tipo: 'pide', texto: `Se pide la masa de ${el} en otra muestra del mismo compuesto, de ${m} g.` },
            { tipo: 'datos', texto: `Se sabe que en ${m1} g del compuesto hay ${x1} g de ${el}.` },
            { tipo: 'regla', texto: 'Por la ley de Proust, la razón entre la masa del elemento y la del compuesto no cambia.' },
            { tipo: 'cuentas', texto: `La muestra nueva es ${f(m / m1, 2)} veces la primera, así que tiene ${f(m / m1, 2)} veces el ${el}:`, ecuacion: [`${x1} · `, { frac: [String(m), String(m1)] }, ' = ', Ms(`${f(bien, 2)} g`)] },
            { tipo: 'sentido', texto: `Los ${f(bien, 2)} g de ${el} en ${m} g son la misma fracción que ${x1} g en ${m1} g.` },
          ],
          respuesta: [Ms(`${f(bien, 2)} g`), ` de ${el}`] };
      },
    },
    ahoraTu: {
      pieza: 'quim-composicion',
      voz: 'Busca qué no cambia: la masa total o la razón.',
      generar(s) {
        const r = azar(s + 29), tipo = ['cerrado', 'abierto', 'proust', 'dalton'][idx(s, 4)];
        return { cerrado: casoCerrado, abierto: casoAbierto, proust: casoProust, dalton: casoDalton }[tipo](r);
      },
    },
  };

  // ---------- Laboratorio (docs/teoria.md §4b y 4g), sin preguntas ----------
  // Mesa 1: dos isótopos cualesquiera en una barra de 100 %; el borde entre los tramos es la abundancia del liviano. Las
  // dos abundancias en carmín (porcentajes), como en la idea 1.
  const promIso = v => (v.p * v.a + (100 - v.p) * (v.a + v.d)) / 100;
  const isoBarra = v => ({ filas: [{ titulo: `masa atómica: ${f(promIso(v), 2)} u`, tramos: [
    { valor: v.p, texto: `${v.a} u: ${v.p} %`, color: 'h' }, { valor: 100 - v.p, texto: `${v.a + v.d} u: ${100 - v.p} %`, color: 'h' }] }],
    alt: `Barra de 100 %: ${v.p} % del isótopo de ${v.a} u y ${100 - v.p} % del de ${v.a + v.d} u; masa atómica ${f(promIso(v), 2)} u.` });
  // Mesa 2: una molécula de C, H y O armada a mano. Arriba, los átomos (no es masa); abajo, la masa. Las dos barras ocupan el
  // ancho entero, para comparar el % de átomos con el % de masa (ES19). En tinta: los tramos son elementos, no magnitudes.
  const formulaCHO = v => [['C', v.c], ['H', v.h], ['O', v.o]].filter(([, k]) => k > 0).map(([el, k]) => el + sub(k)).join('');
  const masaDe = v => 12 * v.c + v.h + 16 * v.o;
  let maxH_ = null;
  const maxH = () => {
    if (maxH_ === null) { maxH_ = 0; for (let c = 1; c <= 6; c++) for (let h = 0; h <= 14; h++) for (let o = 0; o <= 6; o++) maxH_ = Math.max(maxH_, h / masaDe({ c, h, o })); }
    return maxH_;
  };
  const dosBarras = v => {
    const els = [['C', v.c, 12], ['H', v.h, 1], ['O', v.o, 16]];
    return { filas: [
      { titulo: `átomos de ${formulaCHO(v)} (no es masa)`, tramos: els.map(([el, k]) => ({ valor: k, texto: k ? `${k} ${el}` : '' })) },
      { titulo: `masa: ${f(masaDe(v), 0)} g/mol`, tramos: els.map(([el, k, ma]) => ({ valor: k * ma, texto: k ? `${el} ${f(100 * k * ma / masaDe(v), 1)} %` : '' })) },
    ], alt: `Dos barras de ${formulaCHO(v)}: arriba, ${v.c} C, ${v.h} H y ${v.o} O; abajo, la masa: ${els.filter(e => e[1]).map(([el, k, ma]) => `${el} ${f(100 * k * ma / masaDe(v), 1)} %`).join(', ')}.` };
  };

  return {
    unidad: 'quimica.mol-y-composicion',
    version: '0.2.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/plantillas/mol-composicion/motor.js', '/nucleo/elementos.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/balanza.js', '/nucleo/kit/piezas/quim-composicion.js', '/nucleo/kit/piezas/quim-mol.js'],
    // Tabla de letras (molde §0.4): cada letra con un solo significado en la unidad.
    letras: { n: 'cantidad de sustancia, en mol', m: 'masa de una muestra, en g', M: 'masa molar, en g/mol', N: 'número de entidades (no los neutrones)',
      k: 'veces que la empírica cabe en la molecular', x: 'átomos de carbono del hidrocarburo', y: 'átomos de hidrógeno del hidrocarburo',
      p: 'porcentaje del isótopo liviano', X: 'un elemento sin nombre', A: 'número de masa' },
    historia: {
      texto: 'Contar partículas pesando exigió separar masa, número de entidades y cantidad de sustancia. En 1811, Avogadro propuso que volúmenes iguales de gases, en iguales condiciones, tienen el mismo número de moléculas; no midió el número que hoy lleva su nombre. Desde 2019, el mol se define fijando ese número: 6,02214076 × 10²³ entidades.',
      pregunta: '¿Cómo cuentas granos de arroz sin contarlos uno por uno?',
      fuente: { titulo: 'BIPM, unidad base mol', url: 'https://www.bipm.org/en/si-base-units/mole' },
    },
    // «porcentaje en masa» es local: aquí es el de un elemento en un compuesto; en Soluciones, el de un soluto en una mezcla.
    // Glosario (docs/teoria.md §4d y 4g): las palabras que la unidad estrena en el curso, con su aproximación de todos los días
    // (`simple`) y tres ejemplos. Ningún ejemplo trae la respuesta de una Predice (glosario-predice): ni el magnesio, ni los
    // 18 g de agua y de azúcar, ni el Al₂(SO₄)₃, ni el metano, ni el N₂O₃, ni el CO y el CO₂.
    glosario: [
      { termino: 'unidad de masa atómica', simbolo: 'u', formas: ['unidad de masa atómica', 'uma'], simple: 'La unidad muy pequeña con que se pesan los átomos.',
        def: 'La doceava parte de la masa de un átomo de carbono-12. Con ella se pesan átomos y moléculas.',
        ejemplos: ['Un átomo de carbono-12 pesa 12 u, por definición.', 'Un átomo de hidrógeno-1 pesa unos 1,008 u.', 'Un átomo de oxígeno-16 pesa unos 15,995 u, casi 16.'], ver: ['masa atómica'] },
      { termino: 'masa atómica', formas: ['masa atómica promedio', 'masa atómica', 'masas atómicas'], simple: 'Lo que pesa, en promedio, un átomo de un elemento.',
        def: 'Promedio de las masas de los isótopos de un elemento, pesadas por su abundancia. Es el número de la tabla.',
        ejemplos: ['Cloro: 35,45 u, entre 34,969 u y 36,966 u.', 'Carbono: 12,011 u, casi todo carbono-12.', 'Cobre: 63,55 u, entre 62,930 u y 64,928 u.'], ver: ['abundancia', 'unidad de masa atómica'] },
      { termino: 'abundancia', formas: ['abundancia', 'abundancias'], medida: '%', simple: 'De cada 100 átomos, cuántos son de una clase.',
        def: 'De cada 100 átomos de un elemento en la naturaleza, cuántos son de un isótopo dado.',
        ejemplos: ['El 75,76 % del cloro es cloro-35.', 'Del carbono, casi el 99 % es carbono-12.', 'Las abundancias de un elemento suman 100 %.'], ver: ['masa atómica'] },
      { termino: 'mol', formas: ['mol', 'moles'], simple: 'Un paquete de 6,02 × 10²³ cosas, como una docena enorme.',
        def: 'Unidad de la cantidad de sustancia: un paquete de 6,02 × 10²³ entidades. Sirve para contar partículas pesando.',
        ejemplos: ['1 mol de átomos de carbono-12 pesa 12 g.', '2 mol de CO₂ son 1,204 × 10²⁴ moléculas.', '0,5 mol de NaCl pesan 29,25 g.'], ver: ['número de Avogadro', 'masa molar'] },
      { termino: 'número de Avogadro', simbolo: 'Nₐ', medida: 'mol⁻¹', formas: ['número de Avogadro', 'Avogadro'], simple: 'Cuántas cosas trae un mol: 6,02 × 10²³.',
        def: 'Cuántas entidades hay en un mol: 6,02214076 × 10²³, un valor fijado en 2019.',
        ejemplos: ['1 mol de hierro tiene 6,02 × 10²³ átomos.', '3 mol de O₂ tienen 3 · 6,02 × 10²³ = 1,806 × 10²⁴ moléculas.', 'Una docena son 12; un mol, 6,02 × 10²³.'], ver: ['mol'] },
      { termino: 'masa molar', simbolo: 'M', medida: 'g/mol', formas: ['masa molar', 'masas molares'], simple: 'Cuántos gramos pesa un paquete de 6,02 × 10²³.',
        def: 'Masa de un mol, en g/mol: la suma de las masas atómicas de la fórmula, cada una por su subíndice.',
        ejemplos: ['CO₂: 12 + 2 · 16 = 44 g/mol.', 'NaCl: 23 + 35,5 = 58,5 g/mol.', 'Ca(OH)₂: 40 + 2 · 17 = 74 g/mol.'], ver: ['mol', 'masa atómica'] },
      { termino: 'cantidad de sustancia', simbolo: 'n', medida: 'mol', formas: ['cantidad de sustancia'], simple: 'Cuántas partículas hay, contadas en moles.',
        def: 'Magnitud que dice cuántas entidades hay, contadas en moles. No es la masa: n = m / M.',
        ejemplos: ['88 g de CO₂ son n = 2 mol.', '54 g de agua son n = 3 mol.', 'Con los mismos moles hay el mismo número de moléculas.'], ver: ['mol'] },
      { termino: 'entidad', formas: ['entidad', 'entidades'], def: 'Cada cosa que se cuenta en química: un átomo, una molécula, un ion o una unidad fórmula.',
        ejemplos: ['En el agua, la entidad es la molécula H₂O.', 'En la sal, se cuentan unidades fórmula de NaCl.', 'Al contar átomos de O, la entidad es el átomo.'], ver: ['mol'] },
      { termino: 'fórmula química', formas: ['fórmula química', 'fórmulas químicas'], simple: 'Letras y números que dicen qué átomos tiene una sustancia y cuántos.',
        def: 'Los símbolos de los elementos de una sustancia y, como subíndice, cuántos átomos de cada uno hay.',
        ejemplos: ['H₂O: dos H y un O.', 'CaCO₃: un Ca, un C y tres O.', 'Ca(NO₃)₂: un Ca, dos N y seis O.'], ver: ['subíndice'] },
      { termino: 'unidad fórmula', formas: ['unidad fórmula', 'unidades fórmula'], simple: 'El grupo de iones más pequeño que se repite en una sal.',
        def: 'En un compuesto iónico, el grupo de iones que dice su fórmula. Se cuenta en moles como una molécula.',
        ejemplos: ['NaCl: un Na⁺ y un Cl⁻.', 'CaCO₃: un Ca²⁺ y un CO₃²⁻.', 'K₂SO₄: dos K⁺ y un SO₄²⁻.'], ver: ['compuesto iónico'] },
      { termino: 'composición centesimal', formas: ['composición centesimal'], simple: 'La lista de cuánto pesa cada elemento en 100 g.',
        def: 'Los porcentajes en masa de todos los elementos de un compuesto. Suman 100 %.',
        ejemplos: ['Agua: 11,1 % de H y 88,9 % de O.', 'CO₂: 27,3 % de C y 72,7 % de O.', 'NaCl: 39,3 % de Na y 60,7 % de Cl.'], ver: ['porcentaje en masa'] },
      { termino: 'porcentaje en masa', formas: ['porcentaje en masa', 'porcentajes en masa'], local: true, simple: 'Cuántos gramos de algo hay en cada 100 g.',
        def: 'De cada 100 g de un compuesto, cuántos gramos son de un elemento.',
        ejemplos: ['El calcio es el 40 % de la masa de la tiza.', 'En el NH₃, el N es el 82,4 % de la masa.', 'En 50 g de algo con 20 % de C hay 10 g de C.'], ver: ['composición centesimal'] },
      { termino: 'fórmula empírica', formas: ['fórmula empírica', 'fórmulas empíricas', 'empírica'], simple: 'La receta más corta: solo la razón entre los átomos.',
        def: 'La razón de enteros más simple entre los átomos de un compuesto. Sale de un análisis en masa.',
        ejemplos: ['C₆H₁₂O₆ → CH₂O.', 'C₄H₁₀ → C₂H₅.', 'H₂O ya es empírica: 2 : 1.'], ver: ['fórmula molecular'] },
      { termino: 'fórmula molecular', formas: ['fórmula molecular', 'fórmulas moleculares', 'molecular'], simple: 'Cuántos átomos de cada clase tiene de verdad una molécula.',
        def: 'Cuántos átomos de cada elemento tiene una molécula: un múltiplo entero de la empírica.',
        ejemplos: ['Empírica CH y 78 g/mol: C₆H₆.', 'Empírica CH₂O y 60 g/mol: C₂H₄O₂.', 'C₂H₄ y C₃H₆ comparten la empírica CH₂.'], ver: ['fórmula empírica'] },
      { termino: 'sistema cerrado', formas: ['sistema cerrado', 'frasco cerrado', 'recipiente cerrado'], simple: 'Un frasco del que nada sale y al que nada entra.',
        def: 'Recipiente o lugar que no deja entrar ni salir materia. Dentro, la masa total no cambia.',
        ejemplos: ['Una botella tapada con agua y una pastilla efervescente.', 'Un frasco sellado donde arde una vela.', 'Un vaso abierto no lo es: el gas sale al aire.'], ver: ['ley de Lavoisier'] },
      { termino: 'ley de Lavoisier', formas: ['ley de Lavoisier', 'Lavoisier', 'conservación de la masa'], simple: 'Lo que pesa antes es lo que pesa después, si nada se escapa.',
        def: 'En un sistema cerrado, la masa total de lo de antes es igual a la de lo que se forma.',
        ejemplos: ['2 g de hidrógeno y 16 g de oxígeno dan 18 g de agua.', '3,1 g de fósforo y 4 g de oxígeno dan 7,1 g de óxido.', 'Un clavo que se oxida pesa más: ganó oxígeno del aire.'], ver: ['sistema cerrado'] },
      { termino: 'ley de Proust', formas: ['ley de Proust', 'Proust', 'proporciones definidas'], simple: 'Un compuesto siempre tiene la misma receta en masa.',
        def: 'Un compuesto puro tiene siempre la misma razón entre las masas de sus elementos, venga de donde venga.',
        ejemplos: ['En el agua, O : H = 8 : 1 en masa, siempre.', 'Todo CaCO₃ puro tiene 40 % de calcio, sea de tiza o de concha.', 'En el NO, 14 g de N van con 16 g de O.'], ver: ['ley de Lavoisier'] },
      { termino: 'proporciones múltiples', formas: ['ley de las proporciones múltiples', 'proporciones múltiples', 'Dalton'], simple: 'Dos elementos que forman varios compuestos, como el agua y el agua oxigenada.',
        def: 'Si dos elementos forman varios compuestos, las masas de uno unidas a igual masa del otro van como enteros pequeños.',
        ejemplos: ['Con 32 g de S: 32 g de O en SO₂ y 48 g en SO₃, 2 : 3.', 'Con 56 g de Fe: 16 g de O en FeO y 24 g en Fe₂O₃.', 'Con 14 g de N: 16 g de O en NO y 32 g en NO₂.'], ver: ['ley de Proust'] },
    ],
    // Laboratorio (docs/teoria.md §4b), sin preguntas. La primera mesa saca el promedio de la lupa del cloro a cualquier par de
    // isótopos; la segunda pone lado a lado el % de átomos y el % de masa de una molécula que el alumno arma.
    laboratorio: [
      {
        id: 'isotopos', titulo: 'Dos isótopos en una barra', pieza: 'quim-composicion',
        consigna: 'La abundancia del isótopo liviano cambia sola, y la masa atómica la sigue. Elige las masas de los isótopos o mueve tú el borde.',
        controles: [
          { id: 'a', etiqueta: 'isótopo liviano', min: 6, max: 80, paso: 1, inicio: 35, unidad: 'u', decimales: 0 },
          { id: 'd', etiqueta: 'el otro pesa más', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'u', decimales: 0 },
          { id: 'p', etiqueta: '% del liviano', color: 'c-h', min: 0, max: 100, paso: 1, inicio: 76, unidad: '%', decimales: 0, auto: { velocidad: 15, modo: 'rebota' } },
        ],
        dibujo: v => ({ datos: isoBarra(Object.assign({}, v, { p: Math.round(v.p) })), estado: {} }),
        lectura: v => { v = Object.assign({}, v, { p: Math.round(v.p) }); return [`${v.p} % de ${v.a} u y ${100 - v.p} % de ${v.a + v.d} u dan `, Mm(`${f(promIso(v), 2)} u`)]; },
        arrastres: [{ id: 'borde', etiqueta: 'borde entre los dos isótopos', color: 'c-h',
          donde: v => { v = Object.assign({}, v, { p: Math.round(v.p) }); const g = PC().geometria(isoBarra(v)); return { x: g.xDe(0, v.p), y: g.y(0) + g.hb / 2 }; },
          mover: (pt, v) => ({ p: PC().geometria(isoBarra(v)).valorEn(0, pt.x) }) }],
        // Retos: cada logrado usa promIso, el mismo promedio que dibuja la barra y escribe su título.
        invitaciones: [
          { texto: 'Arma el cloro de los exámenes: isótopos de 35 y 37 u, masa 35,5 u.',
            logrado: v => v.a === 35 && v.d === 2 && Math.abs(promIso(v) - 35.5) < 1e-9,
            bien: 'Tres de cada cuatro son de 35 u: por eso el promedio queda cerca de 35.' },
          { texto: 'Haz que el promedio caiga justo a la mitad entre las dos masas.',
            logrado: v => Math.abs(promIso(v) - (v.a + v.d / 2)) < 1e-9,
            bien: 'Con mitad y mitad, el promedio cae al medio. ¿Hacia dónde va si sube el liviano?' },
          { texto: 'Consigue que la masa promedio sea igual a la de un isótopo.',
            logrado: v => Math.abs(promIso(v) - v.a) < 1e-9 || Math.abs(promIso(v) - (v.a + v.d)) < 1e-9,
            bien: 'Solo pasa con un isótopo al 100 %; con los dos presentes, el promedio cae entre ellos.' },
          { texto: 'Guarda dos casos con la misma masa promedio y distinta abundancia.',
            logrado: (v, g) => g.some(x => x.p !== v.p && Math.abs(promIso(x) - promIso(v)) < 1e-9)
              && g.some(x => x.a === v.a && x.d === v.d && x.p === v.p),
            bien: 'El promedio, por sí solo, no dice qué isótopos hay: hace falta conocer sus masas.' },
        ],
      },
      {
        id: 'atomos-o-masa', titulo: 'Átomos contra masa', pieza: 'quim-composicion',
        consigna: 'Arma una molécula con carbono, hidrógeno y oxígeno. Arrastra el borde del carbono arriba y mira cuánto cambia abajo, en masa.',
        controles: [
          { id: 'c', etiqueta: 'C', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
          { id: 'h', etiqueta: 'H', min: 0, max: 14, paso: 1, inicio: 4, decimales: 0 },
          { id: 'o', etiqueta: 'O', min: 0, max: 6, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => ({ datos: dosBarras(v), estado: {} }),
        lectura: v => [`${formulaCHO(v)}: `, [['C', v.c, 12], ['H', v.h, 1], ['O', v.o, 16]].filter(e => e[1]).map(([el, k, ma]) => `${el} ${f(100 * k * ma / masaDe(v), 1)} %`).join(', '), ' de la masa'],
        // El borde del tramo del carbono en la barra de átomos: correrlo pone más átomos de C (con H y O fijos); la barra de
        // masa responde mucho más, porque cada C pesa 12 veces un H. Fracción f → C = f·(H + O)/(1 − f).
        arrastres: [{ id: 'carbono', etiqueta: 'borde de los átomos de carbono',
          donde: v => { const g = PC().geometria(dosBarras(v)); return { x: g.xDe(0, v.c), y: g.y(0) + g.hb / 2 }; },
          mover: (pt, v) => { const g = PC().geometria(dosBarras(v)), fr = Math.max(0, Math.min(0.95, (pt.x - g.x0) / g.largo(0))); return { c: fr * (v.h + v.o) / (1 - fr) }; } }],
        invitaciones: [
          { texto: 'Haz que el oxígeno pese más de la mitad, con menos de un tercio de átomos.',
            logrado: v => v.o / (v.c + v.h + v.o) < 1 / 3 && 16 * v.o / masaDe(v) > 0.5,
            bien: 'Pocos átomos de O, pero cada uno pesa 16 veces un H. ¿Y el carbono?' },
          { texto: 'Arma una molécula con exactamente 40 % de carbono en masa.',
            logrado: v => Math.abs(100 * 12 * v.c / masaDe(v) - 40) < 1e-9,
            bien: 'CH₂O da 40 %, y la glucosa también: comparten fórmula empírica.' },
          { texto: 'Busca la molécula con el mayor porcentaje de hidrógeno en masa.',
            logrado: v => Math.abs(v.h / masaDe(v) - maxH()) < 1e-12,
            bien: 'El H pasa la mitad, pero esa molécula no existe; el CH₄ real tiene 25 %.' },
          { texto: 'Guarda dos fórmulas distintas con los mismos porcentajes en masa.',
            logrado: (v, g) => g.some(x => formulaCHO(x) !== formulaCHO(v) && [[12, 'c'], [1, 'h'], [16, 'o']].every(([ma, e]) => Math.abs(ma * x[e] / masaDe(x) - ma * v[e] / masaDe(v)) < 1e-9))
              && g.some(x => x.c === v.c && x.h === v.h && x.o === v.o),
            bien: 'Misma razón de átomos, mismos porcentajes: el análisis no distingue CH₂ de C₂H₄.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa (docs/teoria.md 4g). La escena vieja (plantillas/mol-composicion) va a «Más mesas del
    // tema» con "rehacer": true en su plantilla.json.
    laboratorioIdeas: {
      'isotopos': ['masa-atomica-promedio'],
      'atomos-o-masa': ['composicion-formula-empirica', 'formula-empirica-molecular'],
    },
    ideas: [masaProm, mol, relaciones, composicion, empirica, leyes],
  };
});
