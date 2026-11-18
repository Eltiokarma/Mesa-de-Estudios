/*
 * Teoría de «Estructura atómica» (quimica.estructura-atomica). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js; forma de química: contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 2), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 26) y las precisiones de Química del expediente. Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md
 * (AT, TP4); los QM- son hipótesis nuevas (ninguno medido).
 *
 * Etapa 4 del plan de calidad (18 nov 2026). Propuesta aprobada por Gerson con todas sus recomendaciones:
 * docs/etapa4/propuesta-quimica.md (decisiones en docs/etapa4/decisiones.md). Seis ideas, en este orden y con estos id
 * (el avance se guarda con ellos): 1 «Partículas, isótopos e iones» (`nucleo-identidad`), 2 «Modelos atómicos»
 * (`modelos-atomicos`), 3 «Niveles, subniveles y orbitales» (`numeros-cuanticos`), 4 «Configuración electrónica»
 * (`configuracion-electronica`), 5 «Configuración de los iones» (`configuracion-iones`, nueva) y 6 «Hund y el último
 * electrón» (`desapareados-isoelectronicos`).
 * Fase 2 del método (docs/metodo/unidad/LEEME.md): la idea 1 está rehecha contra el contrato (calidad 2, comprobado sola
 * en estructura-atomica.test.js); las ideas 2 a 6 quedan con su contenido de antes, reacomodado (la 4 con los átomos
 * neutros hasta Z = 18 y la 5 con los iones), hasta la fase 3. Por eso la unidad todavía no declara calidad: 2.
 *
 * Ficha de tarea (diseno-y-animacion), idea 1
 *   Promesa: contar las partículas de un átomo o ion y decir qué número decide el elemento.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, sin audio, a veces sin
 *     conexión.
 *   Resultado observable: da Z, A, N y electrones de un núclido con carga; distingue isótopo, isóbaro, isótono, ion e
 *     isoelectrónico; resuelve «X³⁻ es isoelectrónico con el Ca²⁺».
 *   Orden de atención: 1.º el núcleo (qué elemento es) · 2.º A = Z + N · 3.º los electrones (qué carga tiene).
 *   Estados: juego sin tocar · misión cumplida · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿quitar un electrón cambia el elemento?
 *
 * Colores (molde §5b; propuesta §8): Z y los protones naranja c-o, N y los neutrones turquesa c-i, los electrones
 * violeta c-f, la carga carmín c-h; A y los números cuánticos en tinta; sin verde (def.colores; lo comprueba la prueba).
 * La pieza quim-atomo los usa con su opción 'zne' (la vieja paleta queda para quien no la pide). Las ideas 2 a 6 ya
 * escriben Z, N y e⁻ con estos colores; sus figuras (quim-cajas, quim-cadena) se ajustan en la fase 3.
 * Letras (propuesta §7): N son los neutrones, como en los libros (A = Z + N); «Lee» lo avisa y el nitrógeno va siempre
 * por su nombre o con su número de masa (¹⁴N). A, el número de masa, nunca va en negrita; la letra de una alternativa sí,
 * en tinta ({ negrita }), porque el violeta es de los electrones.
 * Datos del mundo: el protón pesa unas 1836 veces el electrón (valor de libro, con «unas»); el cobre de Cuajone tiene
 * Z = 29 (hecho sin cifra del mundo). El arándano en el estadio de OpenStax §2.3 no se usa: la página no se pudo abrir
 * desde esta sesión para comprobarlo (18 nov).
 * Datos (ideas 4 a 6): configuraciones por la regla de n + l (Möller) en estado fundamental, Z ≤ 20 en los casos generados.
 * Radios iónicos: Shannon (1976), número de coordinación 6, en pm (los mismos de plantillas/atomo-y-tabla/motor.js).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §2.3 y §6.4; Dalton (1808), Rutherford (1911), Bohr (1913).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/atomo-y-tabla calcula la nube, los nodos y el r90 de la mesa 3D «La nube del orbital».
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/atomo-y-tabla/motor.js'))
    : fabrica(root.Kit, root.MotorAtomo);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MA) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  // Un color fijo por magnitud en toda la unidad (molde §5b; propuesta §8, aprobada el 18 nov): Z y los protones naranja,
  // N y los neutrones turquesa, los electrones violeta, la carga carmín; A y los números cuánticos en tinta; sin verde.
  // La letra de una alternativa va en negrita y en tinta ({ negrita }): aquí el violeta es de los electrones (coordinación,
  // 18 nov). Lo comprueba estructura-atomica.test.js (cada ficha dice su magnitud en m; ninguna letra A–E lleva color).
  const COLORES = { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Pz = ficha('protones'), Nn = ficha('neutrones'), Ee = ficha('electrones'), Qc = ficha('carga');
  const Z = Pz('Z'), N = Nn('N'), e = Ee('e⁻'), A = 'A';
  const letra = L => ({ negrita: [L] });
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
      if (d.valor === undefined || d.valor === null || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUP = { '-': '⁻', '+': '⁺', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  const carga = q => (q === 0 ? '' : sup(`${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`));
  const signo = q => (q > 0 ? `+${q}` : q < 0 ? `−${-q}` : '0');

  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio',
    'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso',
    'hierro', 'cobalto', 'níquel', 'cobre', 'zinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón'];
  // Capas del modelo de Bohr para Z ≤ 20 (2, 8, 8, 2): solo para dibujar el modelo de capas.
  const capas = n => [2, 8, 8, 2].map((c, i, l) => Math.max(0, Math.min(c, n - l.slice(0, i).reduce((a, b) => a + b, 0)))).filter((x, i, l) => x > 0 || l.slice(i).some(y => y > 0));
  // Orden de llenado (n + l, y a igual n + l, menor n) hasta 4p.
  const ORDEN = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
  function config(n) {
    const out = [];
    let resto = n;
    for (const [nom, cap] of ORDEN) { if (resto <= 0) break; const k = Math.min(cap, resto); out.push([nom, k]); resto -= k; }
    return out;
  }
  const textoConfig = c => c.map(([nom, k]) => `${nom}${sup(k)}`).join(' ');
  const cajasDe = nom => ({ s: 1, p: 3, d: 5, f: 7 })[nom.slice(-1)];
  const filasConfig = c => c.map(([nom, k]) => ({ nombre: nom, e: k, cajas: cajasDe(nom) }));

  // Gesto directo (docs/teoria.md §4b) de la mesa «arma-ion»: la manija de la carga va a la derecha del átomo, a la altura
  // del núcleo. A la derecha salen electrones (carga +), a la izquierda llegan (carga −); 18 px por electrón, con la
  // geometría de quim-atomo (cx del átomo k). Es una función de la carga sola, así que mover es su inversa exacta.
  const GA = () => Kit.piezas['quim-atomo'];
  const PASO_Q = 18;
  const manijaCarga = (dib, q, k = 0) => { const a = GA().geometria(dib.datos).atomo(k); return { x: a.cx + 90 + PASO_Q * q, y: a.cy }; };
  const cargaEn = (dib, pt, k = 0) => (pt.x - GA().geometria(dib.datos).atomo(k).cx - 90) / PASO_Q;
  // Animación (docs/3d.md §6): un control con auto avanza sin ajustarse al paso; los conteos se leen enteros.
  const ent = (v, ...ids) => { const w = Object.assign({}, v); for (const k of ids) w[k] = Math.round(w[k]); return w; };

  // ---------- Idea 1 (rehecha, 18 nov): partículas, isótopos e iones ----------
  // Propuesta aprobada: docs/etapa4/propuesta-quimica.md (§3 a §8, idea 1), con todas sus recomendaciones
  // (docs/etapa4/decisiones.md). Objeto de la primera pantalla: el hueso de la llama del museo (el de la idea 6 de Materia
  // y energía) y, por una lupa, dos átomos de su carbono (pieza quim-objeto, dibujo de prueba; los átomos con la paleta
  // 'zne' de quim-atomo).
  // Cambia: protones (Z) y neutrones (N) del átomo que arma el alumno · Permanece: el carbono-12 del hueso, a la
  // izquierda, para comparar · Progresa: de nombrar el elemento por Z a contar A = Z + N · Se reserva: los electrones
  // (el control de la carga sale del juego: es lo que se predice; vuelve en la mesa «arma-ion») · Debe verse: con otro
  // N sigue siendo el mismo elemento; con otro Z, es otro.
  // Errores (hipótesis, docs/investigacion/atomo-enlace-ideas-erroneas.md; los QM- nuevos sin medir): QM-ION-ELEMENTO-E
  // (el elemento por los electrones), QM-ION-ELEMENTO-Q (suma la carga a Z), QM-ION-ISOTOPO (ion por isótopo), AT4
  // (tantos neutrones como protones), QM-CARGA-N (resta la carga en el núcleo), QM-NEUTRONES (da A por N), QM-CARGA-E (el
  // ion con los electrones del neutro), QM-CARGA-SIGNO (la carga al revés), QM-ISOTOPO-N, -A, -ELEMENTO, -REACCIONA, -UNO,
  // QM-NUCLIDO-ISOTOPO, -ISOBARO, -ISOTONO, -NADA, QM-ISO-Z, QM-ISO-NEUTRO, QM-CARGA-A y QM-SUMA-TODO.
  // N son los neutrones (A = Z + N, la notación de los libros): el nitrógeno va siempre por su nombre o con su número de
  // masa (¹⁴N), nunca como «N» suelto (decisiones del 18 nov, pregunta 7; estructura-atomica.test.js lo revisa).
  const ATOMO = o => ({ pieza: 'quim-atomo', datos: Object.assign({ paleta: 'zne' }, o), estado: {} });
  const HUESO = (o, estado) => ({ pieza: 'quim-objeto', datos: Object.assign({ objeto: 'hueso' }, o), estado: estado || {} });
  const nuclido = (z, a, q = 0) => `${sup(a)}${SIMB[z]}${carga(q)}`;
  const DF1 = {
    masa: ['A = ', Z, ' + ', N],
    carga: ['carga = ', Z, ' − ', e],
    nota: 'Número de arriba a la izquierda: A; arriba a la derecha: la carga',
    neutro: 'En un átomo neutro, electrones = protones',
    familias: 'Isótopos: mismo Z. Isóbaros: mismo A. Isótonos: mismo N',
    iso: 'Isoelectrónicos: la misma cantidad de electrones',
  };
  // El carbono-12 del hueso, a la izquierda del juego: para comparar.
  const REF12 = { Z: 6, N: 6, titulo: 'carbono-12', rotulo: 'A = 12' };
  const juegoHueso = v => HUESO({ atomos: [REF12, { Z: v.z, N: v.n, titulo: 'Tu átomo', rotulo: `A = ${v.z + v.n}` }] });

  // Ahora tú (seis tipos, del más simple al de examen). Cada uno da sus datos (contrato, punto 13).
  const IONES1 = [[8, 16, -2], [11, 23, 1], [12, 24, 2], [13, 27, 3], [16, 32, -2], [17, 35, -1], [17, 37, -1], [19, 39, 1], [20, 40, 2],
    [26, 56, 3], [26, 56, 2], [9, 19, -1], [7, 14, -3], [29, 63, 2], [30, 65, 2], [35, 80, -1]];
  function casoNeutrones(r) {
    const [z, a, q] = r.de(IONES1);
    return {
      pregunta: ['El ion ', nuclido(z, a, q), ' tiene ', Z, ` = ${z}. ¿Cuántos neutrones tiene su núcleo?`],
      datos: [DF1.masa, DF1.nota],
      opciones: opciones(a - z, [
        { id: 'carga', valor: a - z - q, error: 'QM-CARGA-N', siFuera: 'Bien usar A − Z. Pero la carga es de los electrones: no se resta en el núcleo.' },
        { id: 'a', valor: a, error: 'QM-NEUTRONES', siFuera: 'Ese es A, bien leído del símbolo. Pero A junta protones y neutrones: falta quitar Z.' },
        { id: 'z', valor: z, error: 'AT4', siFuera: 'Ese es Z, bien. Pero no siempre hay tantos neutrones como protones: usa A.' },
        { id: 'suma', valor: a + z, error: 'QM-NEUTRONES', siFuera: 'Bien usar A y Z. Pero los neutrones son lo que queda al quitar Z, no al sumarlo.' },
      ], x => `${x}`),
      solucion: { texto: 'Los neutrones son A − Z; la carga es de los electrones y no toca el núcleo.', ecuacion: [N, ` = ${a} − ${z} = `, Nn(a - z)] },
    };
  }
  function casoElectrones(r) {
    const [z, a, q] = r.de(IONES1);
    return {
      pregunta: ['El ion ', nuclido(z, a, q), ' tiene ', Z, ` = ${z}. ¿Cuántos electrones tiene?`],
      datos: [DF1.carga, DF1.nota],
      opciones: opciones(z - q, [
        { id: 'signo', valor: z + q, error: 'QM-CARGA-SIGNO', siFuera: 'Bien usar la carga. Pero con carga positiva faltan electrones; con negativa, sobran.' },
        { id: 'neutro', valor: z, error: 'QM-CARGA-E', siFuera: 'Así sería el átomo neutro, bien. Pero la carga dice que ganó o perdió electrones.' },
        { id: 'neutrones', valor: a - z, error: 'QM-NEUTRONES', siFuera: 'A − Z está bien restado, pero cuenta neutrones del núcleo, no electrones.' },
        { id: 'a', valor: a - q, error: 'QM-CARGA-A', siFuera: 'Bien usar la carga con su signo. Pero se aplica a Z, los protones, no a A.' },
      ], x => `${x}`),
      solucion: { texto: `Carga ${signo(q)}: ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} respecto de los ${z} electrones del átomo neutro.`, ecuacion: [e, ` = ${z} − (${signo(q)}) = `, Ee(z - q)] },
    };
  }
  const PARES_ISOTOPOS = [[6, 12, 14], [17, 35, 37], [8, 16, 18], [1, 1, 2], [19, 39, 41], [12, 24, 26]];
  function casoIsotopos(r) {
    const [z, a1, a2] = r.de(PARES_ISOTOPOS), x1 = nuclido(z, a1), x2 = nuclido(z, a2), nom = NOMBRE[z];
    if (r() < 0.5) return {
      pregunta: ['El ', x1, ' y el ', x2, ` son isótopos del ${nom}. ¿Qué tienen igual estos dos átomos neutros?`],
      datos: [`Z del ${nom} = ${z}`, DF1.masa, DF1.neutro],
      opciones: [
        { id: 'c', texto: 'Protones y electrones', correcta: true },
        { id: 'n', texto: 'Neutrones', error: 'QM-ISOTOPO-N', siFuera: `Bien buscar lo que comparten. Pero los neutrones es lo que cambia: ${a1 - z} y ${a2 - z}.` },
        { id: 'a', texto: 'Número de masa', error: 'QM-ISOTOPO-A', siFuera: `Sería cierto en dos isóbaros. Aquí los números de masa son ${a1} y ${a2}.` },
        { id: 'nada', texto: 'Nada: son elementos distintos', error: 'QM-ISOTOPO-ELEMENTO', siFuera: `Sería así si cambiara Z. Los dos tienen Z = ${z}: son ${nom}.` },
      ],
      solucion: { texto: `Los dos tienen ${z} ${z === 1 ? 'protón' : 'protones'} y, neutros, ${z} ${z === 1 ? 'electrón' : 'electrones'}; cambian los neutrones.`, ecuacion: [Z, ` = ${z} y `, e, ` = ${z} en los dos   ·   `, N, ` = ${a1 - z} y ${a2 - z}`] },
    };
    return {
      pregunta: ['El ', x1, ' y el ', x2, ` son átomos neutros del ${nom}. ¿Cómo son sus reacciones químicas, comparadas?`],
      datos: [`Z del ${nom} = ${z}`, 'Una reacción química depende de los electrones', DF1.neutro],
      opciones: [
        { id: 'c', texto: 'Iguales: tienen los mismos electrones', correcta: true },
        { id: 'n', texto: 'Distintas: tienen distintos neutrones', error: 'QM-ISOTOPO-REACCIONA', siFuera: 'Bien: sus neutrones son distintos. Pero las reacciones las deciden los electrones, y son iguales.' },
        { id: 'uno', texto: 'Solo reacciona el más liviano', error: 'QM-ISOTOPO-UNO', siFuera: 'Bien notar que uno pesa más. Pero los dos tienen los mismos electrones: los dos reaccionan.' },
        { id: 'nada', texto: 'Distintas: son elementos distintos', error: 'QM-ISOTOPO-ELEMENTO', siFuera: `Sería así si cambiara Z. Los dos tienen Z = ${z}: son ${nom}.` },
      ],
      solucion: { texto: `Mismo Z, y neutros, los mismos ${z} electrones: reaccionan igual.`, ecuacion: [e, ` = ${z} en los dos`] },
    };
  }
  // Pares de núclidos neutros y qué son: isótopos (mismo Z), isóbaros (mismo A) o isótonos (mismo N).
  const PARES_NUCLIDOS = [[[6, 14], [7, 14]], [[6, 13], [7, 14]], [[18, 40], [20, 40]], [[19, 39], [20, 40]], [[17, 35], [17, 37]],
    [[11, 23], [12, 24]], [[8, 16], [8, 18]], [[15, 32], [16, 32]], [[1, 3], [2, 3]], [[5, 11], [6, 12]]];
  function casoNuclidos(r) {
    const [[z1, a1], [z2, a2]] = r.de(PARES_NUCLIDOS), n1 = a1 - z1, n2 = a2 - z2;
    const es = z1 === z2 ? 'isotopos' : a1 === a2 ? 'isobaros' : 'isotonos';
    const TXT = { isotopos: 'Isótopos', isobaros: 'Isóbaros', isotonos: 'Isótonos' };
    const zDatos = z1 === z2 ? `Z del ${NOMBRE[z1]} = ${z1}` : `Z del ${NOMBRE[z1]} = ${z1}; Z del ${NOMBRE[z2]} = ${z2}`;
    const NO = {
      isotopos: { error: 'QM-NUCLIDO-ISOTOPO', siFuera: `Bien comparar los núcleos. Pero isótopos tendrían el mismo Z, y aquí Z es ${z1} y ${z2}.` },
      isobaros: { error: 'QM-NUCLIDO-ISOBARO', siFuera: `Bien comparar los núcleos. Pero isóbaros tendrían el mismo A, y aquí A es ${a1} y ${a2}.` },
      isotonos: { error: 'QM-NUCLIDO-ISOTONO', siFuera: `Bien comparar los núcleos. Pero isótonos tendrían el mismo N, y aquí N es ${n1} y ${n2}.` },
    };
    const comun = es === 'isotopos' ? [Z, ` = ${z1} en los dos`] : es === 'isobaros' ? [A, ` = ${a1} en los dos`] : [N, ' = ', Nn(n1), ' en los dos'];
    return {
      pregunta: ['¿Qué son entre sí el ', nuclido(z1, a1), ' y el ', nuclido(z2, a2), '?'],
      datos: [zDatos, DF1.familias, DF1.masa],
      opciones: Object.keys(TXT).map(k => (k === es ? { id: 'c', texto: TXT[k], correcta: true } : Object.assign({ id: k, texto: TXT[k] }, NO[k])))
        .concat([{ id: 'nada', texto: 'Nada: no comparten ningún número', error: 'QM-NUCLIDO-NADA', siFuera: 'Sería así si Z, A y N fueran distintos. Compara los tres: uno coincide.' }]),
      solucion: { texto: `Z: ${z1} y ${z2}. A: ${a1} y ${a2}. N: ${n1} y ${n2}. Coincide ${es === 'isotopos' ? 'Z' : es === 'isobaros' ? 'A' : 'N'}.`, ecuacion: comun },
    };
  }
  // Especies con su carga para el caso «isoelectrónico»: [Z, carga].
  const ISO_Y = [[20, 2], [19, 1], [17, -1], [16, -2], [11, 1], [12, 2], [9, -1], [8, -2], [13, 3]];
  function casoIsoelectronico(r) {
    for (let i = 0; ; i++) {
      const [zy, qy] = r.de(ISO_Y), qx = r.de([-3, -2, -1, 1, 2, 3]), ey = zy - qy, zx = ey + qx;
      if (zx === zy || zx < 1 || (i < 50 && Math.abs(qx) === Math.abs(qy) && Math.sign(qx) === Math.sign(qy))) continue;
      const y = `${SIMB[zy]}${carga(qy)}`;
      const ops = opciones(zx, [
        { id: 'z-igual', valor: ey, error: 'QM-ISO-Z', siFuera: `Bien: X también tiene ${ey} electrones. Pero X tiene carga: Z no es igual a sus electrones.` },
        { id: 'signo', valor: ey - qx, error: 'QM-CARGA-SIGNO', siFuera: `Bien partir de ${ey} electrones. Revisa el signo: carga = Z − electrones.` },
        { id: 'neutro', valor: zy + qx, error: 'QM-ISO-NEUTRO', siFuera: `Bien usar la carga de X. Pero el ${y} ya no tiene ${zy} electrones.` },
        { id: 'suma', valor: zy - qx, error: 'QM-ISO-NEUTRO', siFuera: `Bien igualar electrones. Pero el ${y} no tiene ${zy}: tiene ${ey}.` },
      ], x => `${x}`);
      if (ops.length < 4) continue;
      return {
        pregunta: ['El ion X', carga(qx), ' es isoelectrónico con el ', y, '. ¿Cuál es el número atómico de X?'],
        datos: [`Z del ${NOMBRE[zy]} = ${zy}`, DF1.carga, DF1.iso],
        opciones: ops,
        solucion: { texto: `El ${y} tiene ${ey} electrones; X también, con carga ${signo(qx)}.`, ecuacion: [Z, ` = ${ey} + (${signo(qx)}) = `, Pz(zx)] },
      };
    }
  }
  function casoMasaIon(r) {
    for (;;) {
      const z = r.ent(8, 30), q = r.de([-3, -2, -1, 1, 2, 3]), el = z - q, nN = z + r.ent(0, 6), a = z + nN;
      const ops = opciones(a, [
        { id: 'e', valor: el + nN, error: 'QM-CARGA-E', siFuera: `Bien sumar los ${nN} neutrones. Pero el ion tiene carga: sus protones no son ${el}.` },
        { id: 'signo', valor: el - q + nN, error: 'QM-CARGA-SIGNO', siFuera: 'Bien usar la carga. Revisa el signo: carga = Z − electrones.' },
        { id: 'z', valor: z, error: 'QM-NEUTRONES', siFuera: `Ese es Z, bien calculado. Falta sumar los ${nN} neutrones: A = Z + N.` },
        { id: 'todo', valor: a + el, error: 'QM-SUMA-TODO', siFuera: `Bien Z y N. Pero A cuenta solo el núcleo: los ${el} electrones no van.` },
      ], x => `${x}`);
      if (ops.length < 4) continue;
      return {
        pregunta: ['Un ion X', carga(q), ` tiene ${el} electrones y ${nN} neutrones. ¿Cuál es su número de masa?`],
        datos: [DF1.carga, DF1.masa],
        opciones: ops,
        solucion: { texto: `Primero los protones con la carga; después, A con los neutrones.`, ecuacion: [Z, ` = ${el} + (${signo(q)}) = `, Pz(z), '   ·   ', A, ` = ${z} + ${nN} = ${a}`] },
      };
    }
  }
  // Así se resuelve: las tres partículas de un núclido con carga (Ahora tú nunca pide las tres juntas).
  const IONES_R = [[17, 37, -1], [12, 26, 2], [16, 34, -2], [19, 41, 1], [20, 44, 2], [13, 27, 3], [8, 17, -2], [11, 23, 1], [26, 54, 2], [9, 19, -1]];

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h; molde §3 con las reglas del 18 nov: el dibujo muestra lo
  // que cada dato marca por sí solo, nunca lo que sale de juntarlos). Cuentas rehechas aparte, sin el código de la unidad
  // (scratchpad, e4-qui/cuentas-idea1.py): ⁶³Cu A = 29 + 34 = 63 · ¹⁸O N = 18 − 8 = 10 · Ca²⁺ e = 20 − 2 = 18 · 17 p →
  // cloro · ¹H y ²H: Z = 1 los dos · ³⁵Cl⁻: 17, 18, 18 · Al: 13 − 10 = +3 · ³⁵Cl y ³⁷Cl: N 18 y 20, e 17 y 17 · agua
  // pesada: 2 · (2 − 1) + (16 − 8) = 10 · con el neón: Na⁺ 10, Mg 12, F⁻ 10, O²⁻ 10, Cl⁻ 18 → 3 · X³⁻ con Ca²⁺: 18 − 3 =
  // 15 (errores 18, 21, 17, 23) · X²⁺ con 24 e y 30 n: 26 + 30 = 56 (errores 54, 52, 26, 58) · ⁴⁰Ar, ⁴⁰Ca, ³⁹K: N 22, 20,
  // 20 → isóbaros Ar y Ca, isótonos K y Ca · isótopos: protones y propiedades químicas · A = 52, N = 28: 24 + 28 + 24 = 76
  // (errores 52, 80, 104, 48).
  const EJEMPLOS_NUCLEO = [
    { nivel: 1, titulo: 'El cobre de Cuajone',
      enunciado: 'Un átomo del cobre que sale de la mina de Cuajone tiene 29 protones y 34 neutrones. ¿Cuál es su número de masa?',
      datos: [DF1.masa],
      figura: ATOMO({ atomos: [{ Z: 29, N: 34, e: null, titulo: 'cobre', rotulo: 'A = ?' }] }),
      solucion: [{ texto: 'El número de masa cuenta todo lo que hay en el núcleo: protones más neutrones.', ecuacion: [A, ' = ', Pz(29), ' + ', Nn(34), ' = 63'] }],
      respuesta: [A, ' = 63'] },
    { nivel: 1, titulo: 'Los neutrones del oxígeno-18',
      enunciado: 'Un átomo de oxígeno-18 tiene 8 protones. ¿Cuántos neutrones tiene?',
      datos: [DF1.masa, 'En «oxígeno-18», 18 es el número de masa A'],
      figura: ATOMO({ atomos: [{ Z: 8, N: 10, e: null, titulo: 'oxígeno-18', oculto: ['N'], rotulo: 'A = 18' }] }),
      solucion: [{ texto: 'Del número de masa quito los protones: lo que queda son los neutrones.', ecuacion: [N, ' = 18 − ', Pz(8), ' = ', Nn(10)] }],
      respuesta: [Nn(10), ' neutrones'] },
    { nivel: 1, titulo: 'Los electrones del Ca²⁺',
      enunciado: '¿Cuántos electrones tiene el ion Ca²⁺?',
      datos: ['Z del calcio = 20', DF1.carga],
      figura: ATOMO({ atomos: [{ Z: 20, N: null, e: 18, titulo: 'Ca', carga: 2, oculto: ['e'] }] }),
      solucion: [{ texto: 'Despejo los electrones: son los protones menos la carga. Carga +2: perdió dos.', ecuacion: [e, ' = ', Pz(20), ' − ', Qc('(+2)'), ' = ', Ee(18)] }],
      respuesta: [Ee(18), ' electrones'] },
    { nivel: 1, titulo: '¿Qué elemento es?',
      enunciado: 'Un átomo tiene 17 protones, 18 neutrones y 17 electrones. ¿De qué elemento es?',
      datos: ['Z del azufre = 16', 'Z del cloro = 17', 'Z del argón = 18'],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, titulo: '?' }] }),
      solucion: [{ texto: 'El elemento lo decide Z, los protones: 17 es el cloro. Los 18 neutrones no cambian el nombre: no es argón.', ecuacion: [Z, ' = ', Pz(17), ': cloro'] }],
      respuesta: ['Cloro: ', Z, ' = ', Pz(17)] },
    { nivel: 1, titulo: 'Hidrógeno y deuterio',
      enunciado: 'Un átomo de hidrógeno común tiene 1 protón, ningún neutrón y 1 electrón. Uno de deuterio tiene 1 protón, 1 neutrón y 1 electrón. ¿Son el mismo elemento?',
      datos: ['Z del hidrógeno = 1', DF1.familias],
      figura: ATOMO({ atomos: [{ Z: 1, N: 0, titulo: 'hidrógeno' }, { Z: 1, N: 1, titulo: 'deuterio' }] }),
      solucion: [{ texto: 'Los dos tienen 1 protón: el mismo Z, el mismo elemento. Solo cambia N: son isótopos.', ecuacion: [Z, ' = ', Pz(1), ' en los dos   ·   ', N, ' = ', Nn(0), ' y ', Nn(1)] }],
      respuesta: ['Sí: los dos tienen ', Z, ' = ', Pz(1), '; son isótopos'] },
    { nivel: 2, titulo: 'Las tres partículas',
      enunciado: '¿Cuántos protones, neutrones y electrones tiene el ion ³⁵Cl⁻?',
      datos: ['Z del cloro = 17', DF1.masa, DF1.carga, DF1.nota],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, e: 18, titulo: '³⁵Cl', carga: -1, oculto: ['N', 'e'], rotulo: 'A = 35' }] }),
      solucion: [
        { texto: 'Los protones son Z. Los neutrones salen del número de masa.', ecuacion: [Pz(17), ' protones   ·   ', N, ' = 35 − 17 = ', Nn(18)] },
        { texto: 'Carga −1: ganó un electrón.', ecuacion: [e, ' = 17 − ', Qc('(−1)'), ' = ', Ee(18)] },
      ],
      respuesta: [Pz(17), ' protones, ', Nn(18), ' neutrones y ', Ee(18), ' electrones'] },
    { nivel: 2, titulo: 'El ion del aluminio',
      enunciado: 'Un ion de aluminio tiene 13 protones y 10 electrones. ¿Cuál es su carga y cómo se escribe?',
      datos: [DF1.carga],
      figura: ATOMO({ atomos: [{ Z: 13, N: null, e: 10, titulo: 'Al ?' }] }),
      solucion: [
        { texto: 'La carga es protones menos electrones.', ecuacion: ['carga = ', Pz(13), ' − ', Ee(10), ' = ', Qc('+3')] },
        { texto: 'La carga va arriba a la derecha del símbolo, con su signo.', ecuacion: ['Al', Qc('³⁺')] },
      ],
      respuesta: ['Carga ', Qc('+3'), ': Al', Qc('³⁺')] },
    { nivel: 2, titulo: 'Dos átomos de cloro',
      enunciado: 'El cloro-35 y el cloro-37 son átomos neutros. ¿En qué se diferencian sus partículas?',
      datos: ['Z del cloro = 17', DF1.masa, DF1.neutro],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, titulo: 'cloro-35', oculto: ['N', 'e'], rotulo: 'A = 35' }, { Z: 17, N: 20, titulo: 'cloro-37', oculto: ['N', 'e'], rotulo: 'A = 37' }] }),
      solucion: [
        { texto: 'Los neutrones salen del número de masa de cada uno.', ecuacion: [N, ' = 35 − 17 = ', Nn(18), '   ·   ', N, ' = 37 − 17 = ', Nn(20)] },
        { texto: 'Neutros, los dos tienen tantos electrones como protones: 17. Solo cambian los neutrones.', ecuacion: [e, ' = ', Ee(17), ' en los dos'] },
      ],
      respuesta: ['El cloro-37 tiene ', Nn(2), ' neutrones más; los electrones son iguales'] },
    { nivel: 2, titulo: 'El agua pesada',
      enunciado: 'En el agua pesada, cada molécula tiene 2 átomos de deuterio (hidrógeno-2) y 1 de oxígeno-16. ¿Cuántos neutrones tiene una molécula?',
      datos: ['Z del hidrógeno = 1', 'Z del oxígeno = 8', DF1.masa],
      solucion: [
        { texto: 'Cada deuterio: 2 − 1 = 1 neutrón; son dos átomos. El oxígeno-16: 16 − 8 = 8.', ecuacion: [N, ' = 2 · ', Nn(1), ' + ', Nn(8)] },
        { texto: 'Se suman los neutrones de los tres átomos.', ecuacion: ['2 + 8 = ', Nn(10)] },
      ],
      respuesta: [Nn(10), ' neutrones'] },
    { nivel: 2, titulo: 'Los que se parecen al neón',
      enunciado: '¿Cuántas de estas especies son isoelectrónicas con el átomo de neón: Na⁺, Mg, F⁻, O²⁻ y Cl⁻?',
      datos: ['Z: oxígeno 8, flúor 9, neón 10, sodio 11, magnesio 12, cloro 17', DF1.carga, DF1.iso],
      solucion: [
        { texto: 'El neón, neutro, tiene 10 electrones. Cuento los de cada especie con su carga.', ecuacion: ['Na⁺: ', Ee(10), '   ·   Mg: ', Ee(12), '   ·   F⁻: ', Ee(10), '   ·   O²⁻: ', Ee(10), '   ·   Cl⁻: ', Ee(18)] },
        { texto: 'Tienen 10 electrones el Na⁺, el F⁻ y el O²⁻.' },
      ],
      respuesta: 'Tres: Na⁺, F⁻ y O²⁻' },
    { nivel: 3, titulo: 'X³⁻ y el calcio',
      enunciado: 'El ion X³⁻ es isoelectrónico con el Ca²⁺. ¿Cuál es el número atómico de X?',
      alternativas: ['15', '18', '21', '17', '23'],
      datos: ['Z del calcio = 20', DF1.carga, DF1.iso],
      solucion: [
        { texto: 'El Ca²⁺ perdió 2 electrones: le quedan 18. X³⁻ tiene esos mismos 18.', ecuacion: [e, ' = 20 − (+2) = ', Ee(18)] },
        { texto: 'Para X, la carga es −3: Z − 18 = −3.', ecuacion: [Z, ' = 18 + (−3) = ', Pz(15)] },
        { texto: ['La ', letra('B'), ' toma Z igual a los electrones. La ', letra('C'), ' suma el 3: 18 + 3.'] },
        { texto: ['La ', letra('D'), ' usa los 20 del calcio neutro: 20 − 3. La ', letra('E'), ' hace 20 + 3.'] },
      ],
      respuesta: [letra('A'), ', ', Z, ' = ', Pz(15)] },
    { nivel: 3, titulo: 'Número de masa de un ion',
      enunciado: 'Un ion X²⁺ tiene 24 electrones y 30 neutrones. ¿Cuál es su número de masa?',
      alternativas: ['54', '56', '52', '26', '58'],
      datos: [DF1.carga, DF1.masa],
      solucion: [
        { texto: 'Carga +2: perdió dos electrones. Tiene 2 protones más que electrones.', ecuacion: [Z, ' = 24 + 2 = ', Pz(26)] },
        { texto: 'El número de masa junta protones y neutrones.', ecuacion: [A, ' = ', Pz(26), ' + ', Nn(30), ' = 56'] },
        { texto: ['La ', letra('A'), ' suma electrones y neutrones: 24 + 30. La ', letra('C'), ' resta la carga: 22 + 30.'] },
        { texto: ['La ', letra('D'), ' se queda en Z. La ', letra('E'), ' suma la carga dos veces: 26 + 30 + 2.'] },
      ],
      respuesta: [letra('B'), ', ', A, ' = 56'] },
    { nivel: 3, titulo: 'Isóbaros e isótonos',
      enunciado: 'Del ⁴⁰Ar, el ⁴⁰Ca y el ³⁹K, ¿qué par es de isóbaros y qué par es de isótonos?',
      alternativas: ['Isóbaros: Ar y K; isótonos: K y Ca', 'Isóbaros: Ar y Ca; isótonos: Ar y K', 'Isóbaros: Ar y Ca; isótonos: K y Ca', 'Isótopos: Ar y Ca; isótonos: K y Ca', 'Isóbaros: K y Ca; isótonos: Ar y Ca'],
      datos: ['Z del argón = 18; Z del potasio = 19; Z del calcio = 20', DF1.familias, DF1.masa],
      solucion: [
        { texto: 'Isóbaros: mismo A. El ⁴⁰Ar y el ⁴⁰Ca tienen A = 40.' },
        { texto: 'Isótonos: mismo N. Calculo los neutrones de cada uno.', ecuacion: ['Ar: ', N, ' = 40 − 18 = ', Nn(22), '   ·   Ca: ', N, ' = 40 − 20 = ', Nn(20), '   ·   K: ', N, ' = 39 − 19 = ', Nn(20)] },
        { texto: ['El K y el Ca tienen 20 neutrones. La ', letra('D'), ' llama isótopos al Ar y al Ca: tienen distinto Z.'] },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ' y la ', letra('E'), ' cambian los pares: Ar y K no comparten A ni N.'] },
      ],
      respuesta: [letra('C'), ', isóbaros: Ar y Ca; isótonos: K y Ca'] },
    { nivel: 3, titulo: 'Lo que comparten dos isótopos',
      enunciado: 'El cloro-35 y el cloro-37 son isótopos y están como átomos neutros. ¿Qué tienen igual?',
      alternativas: ['Neutrones y número de masa', 'Número de masa y electrones', 'Protones y propiedades químicas', 'Neutrones y electrones', 'Nada: son elementos distintos'],
      datos: ['Z del cloro = 17', DF1.familias, DF1.neutro, 'Una reacción química depende de los electrones'],
      solucion: [
        { texto: 'Isótopos: mismo Z, 17 protones. Neutros, también los mismos 17 electrones.' },
        { texto: 'Como las reacciones dependen de los electrones, sus propiedades químicas son iguales.' },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' dan los neutrones, que es lo que cambia: 18 y 20. La ', letra('B'), ' da A: 35 y 37.'] },
        { texto: ['La ', letra('E'), ' olvida que el mismo Z es el mismo elemento.'] },
      ],
      respuesta: [letra('C'), ', protones y propiedades químicas'] },
    { nivel: 3, titulo: 'Todas las partículas',
      enunciado: 'Un átomo neutro tiene número de masa 52 y 28 neutrones. ¿Cuántas partículas tiene en total, entre protones, neutrones y electrones?',
      alternativas: ['76', '52', '80', '104', '48'],
      datos: [DF1.masa, DF1.neutro],
      solucion: [
        { texto: 'Los protones salen de A − N. Neutro: tantos electrones como protones.', ecuacion: [Z, ' = 52 − 28 = ', Pz(24), '   ·   ', e, ' = ', Ee(24)] },
        { texto: 'Sumo las tres partículas.', ecuacion: [Pz(24), ' + ', Nn(28), ' + ', Ee(24), ' = 76'] },
        { texto: ['La ', letra('B'), ' cuenta solo el núcleo: 52. La ', letra('C'), ' suma A con N: 52 + 28.'] },
        { texto: ['La ', letra('D'), ' suma A dos veces: 104. La ', letra('E'), ' cuenta protones y electrones sin los neutrones.'] },
      ],
      respuesta: [letra('A'), ', 76 partículas'] },
  ];

  const nucleo = {
    id: 'nucleo-identidad',
    titulo: 'Partículas, isótopos e iones',
    pregunta: '¿Qué cambia en un átomo si cambian sus protones, sus neutrones o sus electrones?',
    temas: ['Partículas subatómicas', 'Número atómico y de masa', 'Isótopos'],
    pieza: 'quim-objeto',
    aprendizaje: 'Los protones (Z) deciden el elemento y A = Z + N. Con otros neutrones es un isótopo; con otros electrones, un ion: carga = Z − e⁻.',
    actividad: 'Armar un átomo con protones y neutrones y buscar el carbono-14 del hueso.',
    // Lee: el hueso, las tres partículas y los tres números. No dice qué le pasa a un átomo que pierde un electrón.
    lee: {
      tarjetas: [
        { titulo: 'El hueso del museo', texto: 'En un museo hay un hueso de llama muy antiguo. Su carbono es de dos clases: casi todo es carbono-12, y hay un poco de carbono-14. Las dos clases son carbono. ¿En qué se diferencian sus átomos?',
          pieza: 'quim-objeto', dibujo: HUESO({ atomos: [{ Z: 6, N: 6, titulo: 'carbono-12', oculto: ['Z', 'N', 'e'] }, { Z: 6, N: 8, titulo: 'carbono-14', oculto: ['Z', 'N', 'e'] }] }) },
        { titulo: 'Tres partículas', texto: 'Al centro del átomo está el núcleo, con protones (carga positiva) y neutrones (sin carga). Afuera se mueven los electrones (carga negativa). Las cargas opuestas se atraen. Un protón pesa unas 1836 veces lo que un electrón.',
          pieza: 'quim-atomo', dibujo: ATOMO({ atomos: [{ Z: 2, N: 2, titulo: 'un átomo de helio' }] }) },
        { titulo: 'Tres números', texto: 'Z, el número atómico, cuenta los protones; N, los neutrones; A, el número de masa, los dos juntos. En ¹⁴₆C, arriba va A = 14 y abajo, Z = 6. Ojo: aquí N son neutrones; al nitrógeno lo llamamos por su nombre o ¹⁴N.' },
        { titulo: 'Qué mirar', texto: 'En el juego armas un átomo con protones y neutrones, al lado de un carbono-12 del hueso. Mira con cuál de los dos números cambia el nombre del elemento.' },
      ],
    },
    ejemplos: EJEMPLOS_NUCLEO,
    juega: {
      pieza: 'quim-objeto',
      consigna: 'El hueso guarda carbono-12 y un poco de carbono-14: los dos son carbono. A la derecha armas tu propio átomo.',
      mision: {
        texto: 'Arma un átomo de carbono-14.',
        logrado: v => v.z === 6 && v.z + v.n === 14,
        bien: '6 protones y 8 neutrones. Con 6 neutrones también es carbono: lo decide Z.',
      },
      voz: 'Mueve una cosa a la vez y lee el nombre.',
      leyenda: [
        { s: Z, t: 'número atómico: los protones del núcleo' },
        { s: N, t: 'los neutrones del núcleo' },
        { s: 'A', t: 'número de masa: protones más neutrones' },
        { s: Pz('p⁺'), t: 'protón: va en el núcleo, con carga +' },
        { s: Nn('n⁰'), t: 'neutrón: va en el núcleo, sin carga' },
        { s: Ee('e⁻'), t: 'electrón: va afuera, con carga −' },
      ],
      controles: [
        { id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 12, paso: 1, inicio: 5, decimales: 0 },
        { id: 'n', etiqueta: 'Neutrones (N)', color: 'c-i', min: 0, max: 14, paso: 1, inicio: 6, decimales: 0 },
      ],
      dibujo: v => juegoHueso(v),
      // La relación: Z nombra el elemento; A = Z + N.
      lectura: v => {
        const a = v.z + v.n, nom = NOMBRE[v.z];
        if (v.z === 6) return [Z, ' = 6: carbono. ', A, ` = 6 + ${v.n} = ${a}: carbono-${a}.`];
        if (a === 14) return [Z, ` = ${v.z}: ${nom}. `, A, ' = 14, como el carbono-14: otro elemento.'];
        return [Z, ` = ${v.z}: ${nom}. `, A, ` = ${v.z} + ${v.n} = ${a}.`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-atomo',
      pregunta: 'Un átomo de sodio tiene 11 protones, 12 neutrones y 11 electrones. Si pierde un electrón, ¿qué es ahora?',
      datos: ['Z del neón = 10', 'Z del magnesio = 12'],
      voz: 'Piensa qué cambió y qué se quedó igual.',
      opciones: [
        { id: 'c', texto: 'Un ion Na⁺: sigue siendo sodio', correcta: true },
        { id: 'neon', texto: 'Neón, porque ahora tiene 10 electrones', error: 'QM-ION-ELEMENTO-E', siFuera: 'El neón tiene 10 electrones, cierto. Pero el elemento lo deciden los protones, y siguen siendo 11.' },
        { id: 'magnesio', texto: 'Magnesio, porque queda con carga +1', error: 'QM-ION-ELEMENTO-Q', siFuera: 'La carga cambió a +1, bien visto. Pero el magnesio tiene 12 protones; aquí siguen siendo 11.' },
        { id: 'isotopo', texto: 'Un isótopo del sodio', error: 'QM-ION-ISOTOPO', siFuera: 'Seguir siendo sodio está bien. Pero un isótopo cambia sus neutrones; aquí cambió un electrón.' },
      ],
      dibujo: ATOMO({ atomos: [{ Z: 11, N: 12, titulo: 'Antes: sodio' }, { Z: 11, N: 12, e: 10, oculto: ['Z', 'N'], titulo: 'Después: ?', sale: { n: 1 } }] }),
      revelar: ATOMO({ atomos: [{ Z: 11, N: 12, titulo: 'Antes: sodio' }, { Z: 11, N: 12, e: 10, titulo: 'Na', carga: 1, sale: { n: 1 }, rotulo: 'carga: 11 − 10 = +1', rotuloColor: 'h' }] }),
      coincide: 'Coincide: el núcleo no cambió, solo salió un electrón. Es el ion Na⁺.',
      noCoincide: 'Mira el núcleo: siguen 11 protones. Es sodio con carga +1, el Na⁺.',
    },
    // Mira cierra el hueso de Materia y energía: del carbono-14 al nitrógeno-14 cambia un neutrón por un protón (sin
    // nombrar la radiactividad beta: decisiones del 18 nov, pregunta 13).
    mira: {
      pieza: 'quim-objeto',
      datos: { objeto: 'hueso', lugares: 2, flecha: { desde: 3 }, atomos: [
        { Z: 6, N: 6, titulo: 'carbono-12', rotulo: 'A = 12', lugar: 0, desde: 1, hasta: 2 },
        { Z: 6, N: 8, titulo: 'carbono-14', rotulo: 'A = 14', lugar: 1, desde: 1, hasta: 2 },
        { Z: 6, N: 8, titulo: 'carbono-14', rotulo: 'A = 14', lugar: 0, desde: 3 },
        { Z: 7, N: 7, titulo: 'nitrógeno-14', rotulo: 'A = 14', lugar: 1, desde: 3 },
      ] },
      voz: 'Miremos los átomos del hueso hoy y miles de años después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el hueso hay carbono-12 y un poco de carbono-14.', ecuacion: [Z, ' = ', Pz(6), ' en los dos: los dos son carbono'] },
        { estado: { corte: 2 }, texto: 'Mismo Z y distinto N: son isótopos, con los mismos 6 electrones.', ecuacion: [A, ' = ', Pz(6), ' + ', Nn(6), ' = 12   ·   ', A, ' = ', Pz(6), ' + ', Nn(8), ' = 14'] },
        { estado: { corte: 3 }, texto: 'Con los años, en un carbono-14 un neutrón del núcleo pasa a protón.', ecuacion: [Nn(8), ' − 1 = ', Nn(7), '   ·   ', Pz(6), ' + 1 = ', Pz(7)] },
        { estado: { corte: 3 }, texto: 'Ahora hay 7 protones: Z = 7 es el nitrógeno, el ¹⁴N.', ecuacion: [Z, ' = ', Pz(7), ': nitrógeno'] },
        { estado: { corte: 3 }, texto: 'A no cambió. Cambió Z, y con Z cambió el elemento.', ecuacion: [A, ' = ', Pz(7), ' + ', Nn(7), ' = 14'] },
      ],
    },
    regla: {
      texto: 'Z, los protones, decide el elemento; A = Z + N. Los isótopos cambian N y reaccionan igual. Isóbaros: mismo A. Isótonos: mismo N. Isoelectrónicos: mismos electrones.',
      ecuacion: [A, ' = ', { llave: [Z], nota: 'protones', color: 'c-o' }, ' + ', { llave: [N], nota: 'neutrones', color: 'c-i' }, '   ·   ',
        { llave: ['carga'], nota: 'con signo', color: 'c-h' }, ' = ', Z, ' − ', { llave: [e], nota: 'electrones', color: 'c-f' }],
      condicion: 'el núcleo no cambia, como en una reacción química: un ion solo ganó o perdió electrones.',
      voz: 'Primero el núcleo; después, los electrones.',
    },
    resuelve: {
      pieza: 'quim-atomo',
      generar(s) {
        const [z, a, q] = azar(s + 900).de(IONES_R), n = a - z, el = z - q, x = nuclido(z, a, q);
        const fig = ocultos => ATOMO({ atomos: [{ Z: z, N: n, e: el, titulo: `${sup(a)}${SIMB[z]}`, carga: q, oculto: ocultos, rotulo: `A = ${a}` }] });
        return {
          enunciado: ['¿Cuántos protones, neutrones y electrones tiene el ion ', x, '?'],
          datos: [`Z del ${NOMBRE[z]} = ${z}`, DF1.masa, DF1.carga, DF1.nota],
          dibujo: fig(['N', 'e']),
          pasos: [
            { tipo: 'pide', texto: 'Piden las tres partículas: protones y neutrones del núcleo, y electrones de afuera.' },
            { tipo: 'datos', texto: ['Del símbolo: ', A, ` = ${a} y carga ${signo(q)}. De los datos: `, Z, ` = ${z}.`] },
            { tipo: 'regla', texto: 'Los protones son Z. Los neutrones salen del número de masa; los electrones, de la carga.', ecuacion: [N, ' = ', A, ' − ', Z, '   ·   ', e, ' = ', Z, ' − carga'] },
            { tipo: 'cuentas', texto: `Carga ${signo(q)}: ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} ${Math.abs(q) === 1 ? 'electrón' : 'electrones'}.`,
              ecuacion: [N, ` = ${a} − ${z} = `, Nn(n), '   ·   ', e, ` = ${z} − (${signo(q)}) = `, Ee(el)], dibujo: fig([]) },
            { tipo: 'sentido', texto: `De vuelta: ${z} + ${n} = ${a}, el A del símbolo, y ${z} − ${el} = ${signo(z - el)}, su carga.` },
          ],
          respuesta: `${z} protones, ${n} neutrones y ${el} electrones`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-atomo',
      voz: 'Separa lo que está en el núcleo de lo que está afuera.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 6;
        return [casoNeutrones, casoElectrones, casoIsotopos, casoNuclidos, casoIsoelectronico, casoMasaIon][tipo](r);
      },
    },
  };

  // ---------- Idea 2: cada modelo respondió a una evidencia ----------
  // Cambia: el modelo elegido · Permanece: la cadena evidencia → modelo → lo que no explicaba · Progresa: de Dalton
  // al modelo actual · Se reserva: la lámina de oro de Rutherford (se predice) · Debe verse: qué evidencia obligó a
  // cambiar de modelo.
  const MODELOS = {
    dalton: { titulo: 'Dalton, 1808', nodos: ['Los elementos se combinan en proporciones fijas de masa', 'Átomos indivisibles, iguales en cada elemento', 'No explica la electricidad ni los electrones'] },
    thomson: { titulo: 'Thomson, 1904', nodos: ['Los rayos catódicos llevan partículas negativas', 'Electrones en una esfera de carga positiva', 'No explica por qué rebotan las partículas alfa'] },
    bohr: { titulo: 'Bohr, 1913', nodos: ['El hidrógeno solo emite ciertos colores', 'Electrones en niveles de energía permitidos', 'Solo funciona bien con el hidrógeno'] },
    actual: { titulo: 'Modelo actual, 1926', nodos: ['El electrón se comporta como onda', 'Orbitales: regiones donde es probable hallarlo', 'Es el modelo que se usa hoy'] },
  };
  const cadenaModelo = k => ({ datos: { columnas: [{ titulo: MODELOS[k].titulo, nodos: MODELOS[k].nodos.map((t, i) => ({ texto: t, color: ['d', 'o', undefined][i] })) }] }, estado: {} });
  // Animación: la cadena se recorre sola de arriba abajo (2 s por paso); lo que aún no se lee queda tenue.
  const PARTE = ['Evidencia', 'Modelo', 'Límite'], pasoDe = t => Math.min(2, Math.floor(t / 2));
  const cadenaModeloT = (k, t) => { const d = cadenaModelo(k); d.datos.columnas[0].nodos.forEach((n, i) => { if (i > pasoDe(t)) n.tenue = true; }); return d; };
  // Sin arrastre: el control elige entre cuatro modelos históricos; no hay una magnitud que agarrar en la cadena.
  const modelos = {
    id: 'modelos-atomicos',
    titulo: 'Modelos atómicos',
    temas: ['Modelos atómicos de Dalton a Bohr', 'Modelo actual'],
    pieza: 'quim-cadena',
    // Lee (fase 2): qué es un modelo y cómo se lee la cadena. No dice qué concluyó Rutherford (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Saber sin ver', texto: 'Nadie ha visto un átomo a simple vista. Lo que sabemos de él salió de experimentos: se observa algo, se propone una explicación y se pone a prueba con observaciones nuevas.' },
        { titulo: 'Qué es un modelo', texto: 'Un modelo es una explicación simplificada, como un mapa de Juliaca: no es la ciudad, pero sirve para ubicarse. Cuando una observación nueva no encaja, el modelo se corrige o se cambia por otro.' },
        { titulo: 'Qué mirar', texto: 'Cada cadena del juego tiene tres partes: arriba, lo que se observó; al medio, el modelo; abajo, lo que ese modelo no podía explicar. Compara el límite de un modelo con la evidencia del siguiente.' },
      ],
    },
    juega: {
      consigna: 'La cadena se recorre sola: arriba lo que se observó, al medio el modelo que lo explicaba, abajo lo que no explicaba. Elige un modelo.',
      voz: 'Lee cada cadena de arriba abajo: evidencia, modelo, límite.',
      controles: [{ id: 'k', etiqueta: 'Modelo', opciones: Object.keys(MODELOS).map(k => ({ valor: k, texto: MODELOS[k].titulo.split(',')[0] })) },
        { id: 't', etiqueta: 't', min: 0, max: 6, paso: 0.1, inicio: 6, unidad: 's', decimales: 1, auto: { velocidad: 1 } }],
      dibujo: v => cadenaModeloT(v.k, v.t),
      lectura: v => [`${PARTE[pasoDe(v.t)]}: ${MODELOS[v.k].nodos[pasoDe(v.t)]}`.split(' ').slice(0, 12).join(' ')],
      minimo: 3,
    },
    predice: {
      pregunta: 'Rutherford lanzó partículas alfa contra una lámina muy fina de oro. Casi todas la atravesaron y unas pocas rebotaron. ¿Qué concluyó?',
      voz: 'Piensa qué tendría que haber dentro del átomo para que pase eso.',
      opciones: [
        { id: 'c', texto: 'Casi todo es vacío; la masa está en un núcleo diminuto', correcta: true },
        { id: 'orbitas', texto: 'Los electrones giran en órbitas fijas', error: 'AT5', siFuera: 'Las órbitas fijas son de Bohr, dos años después, para explicar los colores del hidrógeno.' },
        { id: 'macizo', texto: 'El átomo es una esfera maciza e indivisible', error: 'QM-MODELO', siFuera: 'Así lo pensaba Dalton. Si fuera macizo, casi ninguna partícula pasaría.' },
        { id: 'thomson', texto: 'La carga positiva está repartida en todo el átomo', error: 'QM-MODELO', siFuera: 'Era el modelo de Thomson. Con la carga repartida, ninguna partícula rebotaría hacia atrás.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: 'Rutherford, 1911', nodos: [{ texto: 'Casi todas las alfa atraviesan el oro; pocas rebotan', color: 'd' }, { texto: '¿?', tenue: true }, { texto: '¿?', tenue: true }] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'Rutherford, 1911', nodos: [{ texto: 'Casi todas las alfa atraviesan el oro; pocas rebotan', color: 'd' }, { texto: 'Núcleo diminuto y positivo; electrones afuera', color: 'o' }, { texto: 'No explica por qué el electrón no cae al núcleo' }] }] }, estado: {} },
      coincide: 'Coincide: solo un núcleo pequeño y denso hace rebotar a unas pocas.',
      noCoincide: 'Si unas pocas rebotan, la masa positiva está concentrada en un núcleo pequeño.',
    },
    mira: {
      datos: { columnas: [{ titulo: 'Evidencia y modelo', nodos: [
        { texto: 'Dalton: átomos indivisibles', desde: 1 },
        { texto: 'Thomson: aparecen los electrones', desde: 2 },
        { texto: 'Rutherford: núcleo pequeño y denso', desde: 3 },
        { texto: 'Bohr: niveles de energía', desde: 4 },
        { texto: 'Actual: orbitales, no órbitas', color: 'i', desde: 5 },
      ] }] },
      voz: 'Sigamos la cadena: cada evidencia nueva cambió el modelo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las proporciones fijas de masa llevaron a pensar en átomos.' },
        { estado: { corte: 2 }, texto: 'Los rayos catódicos mostraron partículas negativas dentro del átomo.' },
        { estado: { corte: 3 }, texto: 'La lámina de oro mostró un núcleo pequeño, denso y positivo.' },
        { estado: { corte: 4 }, texto: 'Los colores del hidrógeno pidieron niveles de energía permitidos.' },
        { estado: { corte: 5 }, texto: 'Hoy: el orbital es una región de probabilidad, no un camino.' },
      ],
    },
    regla: {
      texto: 'Cada modelo explicó una evidencia que el anterior no podía. En el modelo actual, el electrón no sigue una órbita: un orbital es una región donde es probable encontrarlo.',
      condicion: 'el modelo de Bohr sirve para el hidrógeno y para contar niveles; no es una foto del átomo.',
      voz: 'Un modelo vale por lo que explica, no por lo bonito del dibujo.',
    },
    // Así se resuelve (fase 2): una evidencia de «Ahora tú» elegida con otra semilla. La evidencia, el modelo y lo
    // que propuso salen del mismo generar de «Ahora tú»; la cadena los dibuja como en el juego.
    resuelve: {
      generar(s) {
        const at = modelos.ahoraTu.generar(azar(s + 900).ent(0, 4));
        const ev = String(at.pregunta).match(/«(.+)»/)[1], mod = at.opciones.find(o => o.correcta).texto;
        const ENCAJA = {
          Dalton: 'Encaja con la historia: en 1808 todavía no se conocían partículas con carga; bastaba con átomos de masa propia.',
          Thomson: 'Encaja con la historia: los átomos de Dalton no tenían partes con carga; Thomson, en 1904, puso electrones dentro.',
          Rutherford: 'Encaja con la historia: con la carga repartida de Thomson, ninguna alfa rebotaría; Rutherford, en 1911, propuso el núcleo.',
          Bohr: 'Encaja con la historia: el núcleo de Rutherford no explicaba los colores del hidrógeno; Bohr, en 1913, propuso niveles.',
          'El modelo actual (orbitales)': 'Encaja con la historia: Bohr solo funcionaba bien con el hidrógeno; desde 1926 el electrón se describe con orbitales.',
        };
        const cadena = modelo => ({ datos: { columnas: [{ titulo: 'Evidencia y modelo', nodos: [{ texto: ev.replace(/\.$/, ''), color: 'd' },
          modelo ? { texto: modelo, color: 'o' } : { texto: '¿?', tenue: true }] }] }, estado: {} });
        return {
          enunciado: at.pregunta,
          dibujo: cadena(null),
          pasos: [
            { tipo: 'pide', texto: 'Piden el modelo atómico que se propuso para explicar esa observación.' },
            { tipo: 'regla', texto: 'Cada modelo nació para explicar una evidencia que el anterior no podía. Busco qué tendría que haber en el átomo para que pase lo observado.' },
            { tipo: 'aplica', texto: at.solucion.texto, ecuacion: [mod], dibujo: cadena(at.solucion.texto.replace(/ para explicarlo\.$/, '')) },
            { tipo: 'sentido', texto: ENCAJA[mod] || 'Encaja con la historia: cada modelo llegó cuando el anterior dejó de explicar algo.' },
          ],
          respuesta: mod,
        };
      },
    },
    ahoraTu: {
      voz: 'Relaciona la evidencia con el modelo que la explicó.',
      generar(s) {
        const CASOS = [
          ['Las sustancias se combinan siempre en proporciones fijas de masa.', 'Dalton'],
          ['Los rayos catódicos tienen partículas negativas, sea cual sea el metal.', 'Thomson'],
          ['Unas pocas partículas alfa rebotan al chocar con una lámina de oro.', 'Rutherford'],
          ['El hidrógeno caliente solo emite luz de ciertos colores.', 'Bohr'],
          ['Del electrón solo se puede dar la probabilidad de hallarlo en una región.', 'Actual'],
        ];
        const [ev, mod] = CASOS[s % CASOS.length];
        const nombres = { Dalton: 'Dalton', Thomson: 'Thomson', Rutherford: 'Rutherford', Bohr: 'Bohr', Actual: 'El modelo actual (orbitales)' };
        const que = { Dalton: 'átomos indivisibles con masa propia', Thomson: 'electrones dentro del átomo', Rutherford: 'un núcleo pequeño y denso', Bohr: 'niveles de energía permitidos', Actual: 'orbitales como regiones de probabilidad' };
        return {
          pregunta: `«${ev}» ¿Qué modelo se propuso para explicar esta evidencia?`,
          opciones: Object.keys(nombres).map(k => (k === mod ? { id: 'c', texto: nombres[k], correcta: true }
            : { id: k.toLowerCase(), texto: nombres[k], error: k === 'Bohr' ? 'AT5' : 'QM-MODELO', siFuera: `Ese modelo propuso ${que[k]}; explicaba otra evidencia.` })),
          solucion: { texto: `${nombres[mod]} propuso ${que[mod]} para explicarlo.` },
        };
      },
    },
  };

  // ---------- Idea 3: números cuánticos ----------
  // Cambia: el nivel n y el subnivel l · Permanece: una caja por orbital, dos flechas por caja · Progresa: de 1
  // subnivel a 3, de 2 a 18 electrones · Se reserva: el nivel 4 con su subnivel f · Debe verse: cuántas cajas y
  // flechas tiene cada nivel.
  const LETRA = 'spdf';
  const nivel = (n, sel, lleno = true) => ({ filas: Array.from({ length: n }, (_, l) => ({ nombre: `${n}${LETRA[l]}`, e: lleno ? 2 * (2 * l + 1) : 0, cajas: 2 * l + 1, color: l === sel ? 'o' : undefined })) });
  // Gesto directo: la manija va bajo la última fila; jalarla hacia abajo agrega un subnivel, es decir, sube n.
  // Con quim-cajas: y = top + n · fila − 4 (entre la última caja y la siguiente), inversa exacta en mover.
  const GC = () => Kit.piezas['quim-cajas'];
  const dibNivel = v => ({ datos: Object.assign(nivel(v.n, v.l), { rotulo: `nivel ${v.n}: ${2 * v.n * v.n} e⁻ como máximo` }), estado: {} });
  const cuanticos = {
    id: 'numeros-cuanticos',
    titulo: 'Niveles, subniveles y orbitales',
    temas: ['Números cuánticos y orbitales'],
    pieza: 'quim-cajas',
    // Lee (fase 2): la dirección del electrón y las letras. No cuenta cuántos electrones caben en un nivel.
    lee: {
      tarjetas: [
        { titulo: 'Una dirección', texto: 'Para ubicar un electrón se usan cuatro números cuánticos, como una dirección: el nivel n es el barrio, el subnivel l la calle, el orbital mₗ la casa y el espín mₛ dice cuál de los dos que viven ahí.' },
        { titulo: 'Las letras', texto: 'Los subniveles se nombran con letras: l = 0 es s, l = 1 es p, l = 2 es d y l = 3 es f. En el diagrama, cada caja es un orbital y cada flecha, un electrón.' },
        { titulo: 'Qué mirar', texto: 'En el juego, n sube y baja solo. Cuenta cuántas filas, cuántas cajas y cuántas flechas aparecen en cada nivel, y busca cómo crecen.' },
      ],
    },
    juega: {
      consigna: 'El número cuántico n sube y baja solo. Cuenta las cajas (orbitales) y las flechas (electrones) que caben; cambia también l.',
      voz: 'Prueba también un l igual o mayor que n.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, auto: { velocidad: 0.7, modo: 'rebota' } },
        { id: 'l', etiqueta: 'l', min: 0, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => dibNivel(ent(v, 'n')),
      lectura: v => { v = ent(v, 'n'); return v.l >= v.n ? [`l = ${v.l} no existe con n = ${v.n}: l es menor que n`] : [`${v.n}${LETRA[v.l]}: ${2 * v.l + 1} orbitales, ${2 * (2 * v.l + 1)} electrones como máximo`]; },
      minimo: 4,
      // Se jala el borde de abajo del nivel: aparece (o se va) un subnivel, y la lectura cuenta las cajas.
      arrastres: [{ id: 'nivel', etiqueta: 'borde del nivel: abajo, n mayor',
        donde: v => { v = ent(v, 'n'); const g = GC().geometria(dibNivel(v).datos); return { x: 26, y: g.top + v.n * g.fila - 4 }; },
        mover: (pt, v) => { v = ent(v, 'n'); const g = GC().geometria(dibNivel(v).datos); return { n: (pt.y + 4 - g.top) / g.fila }; } }],
    },
    predice: {
      pregunta: '¿Cuántos electrones caben, como máximo, en el nivel n = 4?',
      voz: 'Piensa qué subniveles aparecen al subir de nivel.',
      opciones: [
        { id: 'c', texto: '32', correcta: true },
        { id: 'octeto', texto: '8', error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de la capa de valencia, no lo que cabe en un nivel completo.' },
        { id: 'orbitales', texto: '16', error: 'QM-ORBITAL-ELECTRON', siFuera: 'Dieciséis son los orbitales del nivel 4. En cada orbital caben dos electrones.' },
        { id: 'periodo', texto: '18', error: 'QM-PERIODO-NIVEL', siFuera: 'Dieciocho elementos tiene el periodo 4, pero el nivel 4 también tiene 4d y 4f.' },
      ],
      dibujo: { datos: Object.assign(nivel(4, -1, false), { filas: nivel(4, -1, false).filas.slice(0, 3), rotulo: 'nivel 4: 4s, 4p, 4d y 4f' }), estado: {} },
      revelar: { datos: Object.assign(nivel(4, -1), { filas: nivel(4, -1).filas.slice(0, 3), rotulo: '+ 4f (7 cajas, 14 e⁻) = 32 e⁻' }), estado: {} },
      coincide: 'Coincide: 2 + 6 + 10 + 14 = 32.',
      noCoincide: 'El nivel 4 tiene 16 orbitales: 2 + 6 + 10 + 14 = 32 electrones.',
    },
    mira: {
      datos: { filas: [
        { nombre: '3s', e: 2, cajas: 1, desde: 1 }, { nombre: '3p', e: 6, cajas: 3, desde: 2 }, { nombre: '3d', e: 10, cajas: 5, desde: 3 },
      ], rotulo: 'nivel 3: 9 orbitales, 18 e⁻' },
      voz: 'Armemos el nivel 3 subnivel por subnivel.',
      pasos: [
        { estado: { corte: 1 }, texto: 'n = 3 es el tercer nivel. Con l = 0 está el 3s: un orbital.', ecuacion: ['l = 0 (s):  mₗ = 0'] },
        { estado: { corte: 2 }, texto: 'Con l = 1, el 3p: tres orbitales.', ecuacion: ['l = 1 (p):  mₗ = −1, 0, +1'] },
        { estado: { corte: 3 }, texto: 'Con l = 2, el 3d: cinco orbitales.', ecuacion: ['l = 2 (d):  mₗ = −2 … +2'] },
        { estado: { corte: 3 }, texto: 'En cada caja caben dos electrones con espín opuesto.', ecuacion: ['mₛ = +½ o −½'] },
        { estado: { corte: 3 }, texto: 'Total del nivel 3: 9 orbitales y 18 electrones.', ecuacion: ['2 · 3² = 18'] },
      ],
    },
    regla: {
      texto: 'n da el nivel; l, de 0 a n − 1, da el subnivel (s, p, d, f); mₗ, de −l a +l, da una caja por orbital; mₛ = ±½.',
      ecuacion: ['orbitales = 2', { llave: ['l'], nota: 'subnivel' }, ' + 1', '   ·   ', 'electrones = 2', { llave: [{ sup: ['n', '2'] }], nota: 'nivel' }],
      condicion: 'cada orbital admite dos electrones de espín opuesto (Pauli); un orbital es una región de probabilidad, no una órbita.',
      voz: 'Cuenta cajas y después flechas.',
    },
    // Así se resuelve (fase 2): los tres casos de «Ahora tú» (orbitales de un subnivel, electrones de un subnivel,
    // electrones de un nivel), con otras semillas y las mismas cuentas (2l + 1 y 2n²). El nivel llega hasta n = 4
    // porque las letras de la figura llegan a f.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3, menos = k => (k < 0 ? `−${-k}` : k > 0 ? `+${k}` : '0');
        if (tipo === 2) {
          const n = r.ent(1, 4), subs = Array.from({ length: n }, (_, l) => `${n}${LETRA[l]}`), orbs = Array.from({ length: n }, (_, l) => 2 * l + 1);
          const tot = orbs.reduce((a, b) => a + b, 0);
          return {
            enunciado: `¿Cuántos electrones caben, como máximo, en el nivel n = ${n}?`,
            dibujo: { datos: nivel(n, -1, false), estado: {} },
            pasos: [
              { tipo: 'pide', texto: `Piden cuántos electrones caben en todo el nivel ${n}, con todos sus subniveles llenos.` },
              { tipo: 'datos', texto: `Con n = ${n}, l va de 0 a ${n - 1}: ${n === 1 ? 'un solo subnivel' : 'los subniveles'} ${subs.join(', ')}.` },
              { tipo: 'regla', texto: 'Sumo los orbitales de cada subnivel (2l + 1 cada uno) y pongo dos electrones de espín opuesto en cada orbital.' },
              { tipo: 'cuentas', texto: 'Cuento cajas por subnivel y después las flechas.', ecuacion: [`orbitales = ${orbs.join(' + ')} = ${tot}   ·   electrones = 2 · ${tot} = ${2 * tot}`],
                dibujo: { datos: Object.assign(nivel(n, -1), { rotulo: `nivel ${n}: ${tot} orbitales, ${2 * tot} e⁻` }), estado: {} } },
              { tipo: 'sentido', texto: `De vuelta, con la regla corta: 2n² = 2 · ${n}² = ${2 * n * n}. Coincide con la suma subnivel por subnivel.` },
            ],
            respuesta: `${2 * tot} electrones`,
          };
        }
        const n = r.ent(2, 5), l = r.ent(0, Math.min(3, n - 1)), sub = `${n}${LETRA[l]}`, orb = 2 * l + 1;
        const ml = Array.from({ length: orb }, (_, k) => menos(k - l)).join(', ');
        const vacio = { datos: { filas: [{ nombre: sub, e: 0, cajas: orb }] }, estado: {} }, lleno = { datos: { filas: [{ nombre: sub, e: 2 * orb, cajas: orb }] }, estado: {} };
        const datos = { tipo: 'datos', texto: `En ${sub}, el ${n} es el nivel y la letra ${LETRA[l]} dice el subnivel: l = ${l}.` };
        if (tipo === 0) return {
          enunciado: `¿Cuántos orbitales tiene el subnivel ${sub}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos orbitales, es decir, cuántas cajas, tiene el subnivel ${sub}.` },
            datos,
            { tipo: 'regla', texto: 'Hay un orbital por cada valor de mₗ, que va de −l a +l pasando por 0.', ecuacion: ['orbitales = 2l + 1'] },
            { tipo: 'cuentas', texto: `Con l = ${l}, mₗ toma ${orb === 1 ? 'un solo valor' : `${orb} valores`}.`, ecuacion: [`mₗ = ${ml}   ·   2 · ${l} + 1 = ${orb}`], dibujo: vacio },
            { tipo: 'sentido', texto: `De vuelta: la figura tiene ${orb} ${orb === 1 ? 'caja' : 'cajas'}. Y el nivel no cambia la cuenta: todo subnivel ${LETRA[l]} tiene ${orb}.` },
          ],
          respuesta: `${orb} ${orb === 1 ? 'orbital' : 'orbitales'}`,
        };
        return {
          enunciado: `¿Cuántos electrones caben, como máximo, en el subnivel ${sub}?`,
          dibujo: vacio,
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos electrones caben en el subnivel ${sub} cuando está lleno.` },
            datos,
            { tipo: 'regla', texto: 'Primero cuento los orbitales, uno por cada valor de mₗ; en cada orbital caben dos electrones de espín opuesto.', ecuacion: ['electrones = 2 · (2l + 1)'] },
            { tipo: 'cuentas', texto: `Con l = ${l} hay ${orb} ${orb === 1 ? 'orbital' : 'orbitales'}; cada uno lleva dos flechas.`, ecuacion: [`2 · (2 · ${l} + 1) = 2 · ${orb} = ${2 * orb}`], dibujo: lleno },
            { tipo: 'sentido', texto: `De vuelta: ${orb} ${orb === 1 ? 'caja' : 'cajas'} con dos flechas son ${2 * orb}. Es menos que los ${2 * n * n} del nivel ${n} entero, como debe ser.` },
          ],
          respuesta: `${2 * orb} electrones`,
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el subnivel, después las cajas.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const n = r.ent(1, 6);
          return {
            pregunta: `¿Cuántos electrones caben, como máximo, en el nivel n = ${n}?`,
            opciones: opciones(2 * n * n, [
              { id: 'n2', valor: n * n, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Eso cuenta los orbitales. En cada orbital caben dos electrones.' },
              { id: 'ocho', valor: 8, error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de valencia, no la capacidad de un nivel.' },
              { id: 'dos-n', valor: 2 * n, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Eso multiplica por n una sola vez; la regla es 2n².' },
            ], x => `${x}`),
            solucion: { texto: `El nivel ${n} tiene ${n * n} orbitales con dos electrones cada uno.`, ecuacion: [`2 · ${n}² = ${2 * n * n}`] },
          };
        }
        const n = r.ent(2, 5), l = r.ent(0, Math.min(3, n - 1)), sub = `${n}${LETRA[l]}`;
        if (tipo === 0) return {
          pregunta: `¿Cuántos orbitales tiene el subnivel ${sub}?`,
          opciones: opciones(2 * l + 1, [
            { id: 'electrones', valor: 2 * (2 * l + 1), error: 'QM-ORBITAL-ELECTRON', siFuera: 'Esos son los electrones que caben. Cada orbital lleva dos.' },
            { id: 'n', valor: n, error: 'QM-N-L', siFuera: 'Eso es el nivel. Los orbitales dependen de l, no de n.' },
            { id: 'l', valor: l + 3, error: 'QM-N-L', siFuera: 'Los orbitales son 2l + 1, uno por cada valor de mₗ.' },
          ], x => `${x}`),
          solucion: { texto: `${LETRA[l]} es l = ${l}; mₗ va de −${l} a +${l}.`, ecuacion: [`2 · ${l} + 1 = ${2 * l + 1}`] },
        };
        return {
          pregunta: `¿Cuántos electrones caben, como máximo, en el subnivel ${sub}?`,
          opciones: opciones(2 * (2 * l + 1), [
            { id: 'orbitales', valor: 2 * l + 1, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Esos son los orbitales. En cada uno caben dos electrones.' },
            { id: 'nivel', valor: 2 * n * n, error: 'QM-N-L', siFuera: 'Eso cabe en todo el nivel, no en un solo subnivel.' },
            { id: 'ocho', valor: 8, error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de valencia, no la capacidad de un subnivel.' },
          ], x => `${x}`),
          solucion: { texto: `${LETRA[l]} tiene ${2 * l + 1} orbitales, con dos electrones cada uno.`, ecuacion: [`2 · (2 · ${l} + 1) = ${2 * (2 * l + 1)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: configuración electrónica (átomos neutros) ----------
  // Cambia: el número de electrones · Permanece: el orden de llenado 1s 2s 2p 3s 3p 4s · Progresa: de llenar un
  // átomo a ganar electrones (anión) y a perderlos (catión) · Se reserva: el 4s que sale antes que el 3d · Debe verse:
  // qué subnivel recibe o pierde cada electrón.
  // Gesto directo: se agarra la última flecha y se la lleva a otra caja. Cada flecha posible (1s↑, 1s↓, 2s↑…) tiene
  // un sitio fijo en quim-cajas (fila del subnivel, caja por Hund, ↑ o ↓); mover elige el sitio más cercano y su
  // número de orden es la cantidad de electrones.
  function sitioFlecha(e) {
    const c = config(e), i = c.length - 1, [nom, k] = c[i], cajas = cajasDe(nom), m = k - 1;
    return GC().geometria({ filas: [{ cajas: 1 }] }).flecha(i, m < cajas ? m : m - cajas, m < cajas ? 0 : 1);
  }
  const masCercana = (pt, max) => { let mejor = 1, dm = Infinity; for (let e = 1; e <= max; e++) { const s = sitioFlecha(e), d = (s.x - pt.x) ** 2 + (s.y - pt.y) ** 2; if (d < dm) { dm = d; mejor = e; } } return mejor; };
  // Fase 2 (18 nov): reacomodo sin reescribir. La idea 4 se queda con los átomos neutros (juego hasta Z = 18, para que el
  // electrón 19 de su predicción no se vea antes) y los iones pasan a la idea 5, nueva, con la predicción del Fe²⁺ que
  // estaba aquí. Las dos se rehacen contra el contrato en la fase 3.
  const LISTA_NEUTROS = [[7, 0], [8, 0], [11, 0], [13, 0], [15, 0], [16, 0], [19, 0], [20, 0], [9, 0], [17, 0], [12, 0], [14, 0]];
  const LISTA_IONES = [[11, 1], [12, 2], [13, 3], [8, -2], [9, -1], [16, -2], [17, -1], [19, 1], [20, 2], [7, -3]];
  function resuelveConfig(s, LISTA) {
    const [z, q] = LISTA[azar(s + 900).ent(0, LISTA.length - 1)], el = z - q, sim = `${SIMB[z]}${carga(q)}`, c = config(el);
    const vacias = { datos: { filas: filasConfig(config(20)).map(x => Object.assign(x, { e: 0 })) }, estado: {} };
    return {
      enunciado: ['¿Cuál es la configuración electrónica del ', sim, ' (', Z, ` = ${z})?`],
      dibujo: vacias,
      pasos: [
        { tipo: 'pide', texto: `Piden la configuración del ${sim}: cómo se reparten sus electrones entre los subniveles.` },
        { tipo: 'datos', texto: q ? [Z, ` = ${z} y carga ${signo(q)}: ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} ${Math.abs(q) === 1 ? 'electrón' : 'electrones'}.`] : [Z, ` = ${z} y sin carga: tiene tantos electrones como protones.`],
          ecuacion: q ? [e, ` = ${z} − (${signo(q)}) = ${el}`] : [e, ' = ', Z, ` = ${el}`] },
        { tipo: 'regla', texto: 'Lleno los subniveles en orden de energía, 1s 2s 2p 3s 3p 4s, sin pasar el tope de cada uno: 2 en un s y 6 en un p.' },
        { tipo: 'cuentas', texto: `Reparto los ${el} electrones hasta que se acaban.`, ecuacion: [`${sim}: ${textoConfig(c)}`],
          dibujo: { datos: { filas: filasConfig(c) }, estado: {} } },
        { tipo: 'sentido', texto: `De vuelta: sumo los superíndices, ${c.map(x => x[1]).join(' + ')} = ${c.reduce((a, x) => a + x[1], 0)}, los electrones del ${sim}.` },
      ],
      respuesta: `${sim}: ${textoConfig(c)}`,
    };
  }
  function ahoraConfig(s, LISTA) {
    const [z, q] = LISTA[s % LISTA.length], el = z - q, sim = `${SIMB[z]}${carga(q)}`;
    const tres = n => { const c = config(n); return n >= 19 ? textoConfig(c.filter(x => x[0] !== '4s').concat([['3d', n - 18]])) : null; };
    return {
      pregunta: ['¿Cuál es la configuración electrónica del ', sim, ' (', Z, ` = ${z})?`],
      opciones: opciones(textoConfig(config(el)), [
        q ? { id: 'neutro', valor: textoConfig(config(z)), error: 'QM-CARGA-E', siFuera: 'Esa es la del átomo neutro. La carga cambia el número de electrones.' } : {},
        q ? { id: 'signo', valor: textoConfig(config(z + q)), error: 'QM-CARGA-E', siFuera: 'Eso aplica la carga al revés: positivo es perder electrones.' } : {},
        el >= 19 ? { id: '3d', valor: tres(el), error: 'QM-3D-ANTES', siFuera: 'El 3d viene después del 4s al llenar; el 4s tiene menos energía.' } : {},
        { id: 'mas', valor: textoConfig(config(el + 1)), error: 'QM-CUENTA', siFuera: 'Esa tiene un electrón de más. Cuenta de nuevo los superíndices.' },
        { id: 'menos', valor: textoConfig(config(el - 1)), error: 'QM-CUENTA', siFuera: 'Esa tiene un electrón de menos. Cuenta de nuevo los superíndices.' },
      ], x => x),
      solucion: { texto: `${sim} tiene ${el} electrones; se llenan en orden de energía.`, ecuacion: [`${sim}: ${textoConfig(config(el))}`] },
    };
  }
  const configuracion = {
    id: 'configuracion-electronica',
    titulo: 'Configuración electrónica',
    temas: ['Configuración electrónica de átomos e iones'],
    pieza: 'quim-cajas',
    // Lee (fase 2): cómo se escribe una configuración. No dice adónde va el electrón 19 (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'De abajo hacia arriba', texto: 'Los electrones ocupan primero los subniveles de menor energía, como el agua que llena un balde desde el fondo. Cada subnivel tiene un tope: el s se llena con 2 y el p, con 6.' },
        { titulo: 'Cómo se escribe', texto: `La configuración se escribe con cada subnivel y un superíndice que cuenta sus electrones. ${textoConfig(config(7))} es el nitrógeno: ${config(7).map(x => x[1]).join(' + ')} = ${config(7).reduce((a, x) => a + x[1], 0)} electrones.` },
        { titulo: 'Qué mirar', texto: 'En el juego, los electrones entran de uno en uno. Mira en qué orden se llenan las filas y cuándo se pasa a la siguiente.' },
      ],
    },
    juega: {
      consigna: 'Los electrones entran solos, uno por uno, del hidrógeno al argón. Mira en qué subnivel entra cada uno; pausa o arrastra el último.',
      voz: 'Fíjate cuándo se llena cada fila.',
      controles: [{ id: 'z', etiqueta: 'Z', color: 'c-o', min: 1, max: 18, paso: 1, inicio: 6, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } }],
      dibujo: v => ({ datos: { filas: filasConfig(config(Math.round(v.z))) }, estado: {} }),
      lectura: v => { const z = Math.round(v.z); return [Z, ` = ${z} (${NOMBRE[z]}): ${textoConfig(config(z))}`]; },
      minimo: 4,
      // Se agarra el último electrón y se lo pone en otra caja: Z sigue a la flecha, y la configuración se reescribe.
      arrastres: [{ id: 'ultimo', etiqueta: 'último electrón: llévalo a otra caja', color: 'c-f',
        donde: v => sitioFlecha(Math.round(v.z)),
        mover: pt => ({ z: masCercana(pt, 18) }) }],
    },
    predice: {
      pregunta: 'El argón llenó hasta el 3p. El potasio tiene un electrón más. ¿Adónde va el electrón 19?',
      datos: ['argón (Z = 18): 1s² 2s² 2p⁶ 3s² 3p⁶', 'potasio: Z = 19'],
      voz: 'Piensa qué subnivel tiene menos energía.',
      opciones: [
        { id: 'c', texto: 'Al 4s', correcta: true },
        { id: '3d', texto: 'Al 3d: el nivel 3 todavía tiene sitio', error: 'QM-3D-ANTES', siFuera: 'El nivel 3 tiene sitio en el 3d, cierto. Pero el 4s tiene menos energía y se llena antes.' },
        { id: '4p', texto: 'Al 4p', error: 'QM-4P', siFuera: 'Bien que pase al nivel 4. Pero antes del 4p va el 4s.' },
        { id: 'lleno', texto: 'A ninguno: el argón ya está lleno', error: 'QM-LLENO-NO-ENTRA', siFuera: 'El 3p del argón está lleno, cierto. Pero hay subniveles más arriba con sitio.' },
      ],
      dibujo: { datos: { filas: filasConfig(config(18)).concat([{ nombre: '4s', e: 0, cajas: 1 }, { nombre: '3d', e: 0, cajas: 5 }]), rotulo: 'K: ¿dónde va el electrón 19?' }, estado: {} },
      revelar: { datos: { filas: filasConfig(config(18)).concat([{ nombre: '4s', e: 1, cajas: 1 }, { nombre: '3d', e: 0, cajas: 5 }]), rotulo: 'K: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹' }, estado: {} },
      coincide: 'Coincide: el 4s tiene menos energía que el 3d.',
      noCoincide: 'El electrón 19 va al 4s: tiene menos energía que el 3d.',
    },
    mira: {
      datos: { filas: [
        { nombre: '1s', e: 2, cajas: 1, desde: 1 }, { nombre: '2s', e: 2, cajas: 1, desde: 2 }, { nombre: '2p', e: 6, cajas: 3, desde: 2 },
        { nombre: '3s', e: 2, cajas: 1, desde: 3 }, { nombre: '3p', e: 6, cajas: 3, desde: 3 }, { nombre: '4s', e: 1, cajas: 1, desde: 4, color: 'o' },
      ] },
      voz: 'Llenemos el potasio electrón por electrón.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se llena el subnivel de menor energía, el 1s.', ecuacion: ['1s²'] },
        { estado: { corte: 2 }, texto: 'Después el 2s y el 2p: el nivel 2 se completa con 8.', ecuacion: ['2s² 2p⁶'] },
        { estado: { corte: 3 }, texto: 'El 3s y el 3p: con 18 electrones, es el argón.', ecuacion: ['Ar: 1s² 2s² 2p⁶ 3s² 3p⁶'] },
        { estado: { corte: 4 }, texto: 'El electrón 19 del potasio va al 4s, antes que al 3d.', ecuacion: ['K: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹'] },
      ],
    },
    regla: {
      texto: 'Los subniveles se llenan en orden de energía: 1s 2s 2p 3s 3p 4s 3d 4p. El 4s se llena antes que el 3d.',
      ecuacion: ['1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p'],
      condicion: 'en estado fundamental. Hay excepciones verificadas: el Cr y el Cu pasan un electrón del 4s al 3d.',
      voz: 'Cuenta los electrones antes de escribir la configuración.',
    },
    resuelve: { generar: s => resuelveConfig(s, LISTA_NEUTROS) },
    ahoraTu: { voz: 'Cuenta primero los electrones del átomo.', generar: s => ahoraConfig(s, LISTA_NEUTROS) },
  };

  // ---------- Idea 5 (nueva, 18 nov): configuración de los iones ----------
  // Reacomodo de fase 2 con lo que había de iones en la idea 4 (la mesa «cajas-ion», la predicción del Fe²⁺ y el S²⁻ de
  // «Mira»); se rehace contra el contrato en la fase 3 (propuesta §3, idea 5: el salero de Maras y el sulfato ferroso).
  const dibIonJ = v => dibIon(ent(v, 'z'));
  const configIones = {
    id: 'configuracion-iones',
    titulo: 'Configuración de los iones',
    temas: ['Configuración electrónica de átomos e iones'],
    pieza: 'quim-cajas',
    lee: {
      tarjetas: [
        { titulo: 'Átomos e iones', texto: 'Un ion es un átomo que ganó o perdió electrones. Antes de escribir su configuración, cuenta cuántos electrones tiene de verdad: no siempre son tantos como protones.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges el elemento y su carga. Mira qué subnivel gana o pierde electrones cuando cambias la carga.' },
      ],
    },
    juega: {
      consigna: 'El elemento cambia solo, del hidrógeno al calcio. Elige una carga y mira qué subnivel gana o pierde electrones.',
      voz: 'Cambia la carga y compara las cajas.',
      controles: [
        { id: 'z', etiqueta: 'Z', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 17, decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
        { id: 'q', etiqueta: 'Carga', color: 'c-h', min: -3, max: 3, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: v => dibIonJ(v),
      lectura: v => { v = ent(v, 'z'); return v.z - v.q < 0 ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`] : v.z === v.q ? [`${SIMB_Q(v.z, v.q)}: sin electrones`]
        : [`${SIMB_Q(v.z, v.q)}: ${v.z - v.q} `, e, ` → ${textoConfig(config(v.z - v.q))}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Al formar el ion Fe²⁺, el hierro pierde dos electrones. ¿De qué subnivel salen?',
      datos: ['hierro (Z = 26): [Ar] 4s² 3d⁶', '[Ar]: los 18 electrones del argón'],
      voz: 'Anota tu predicción; aquí el orden de salida importa.',
      opciones: [
        { id: 'c', texto: 'Del 4s: queda [Ar] 3d⁶', correcta: true },
        { id: 'ultimo', texto: 'Del 3d, el último en llenarse: [Ar] 4s² 3d⁴', error: 'QM-ULTIMO', siFuera: 'El 3d se llena después, cierto. Pero al quitar, sale primero el nivel n = 4, el más externo.' },
        { id: 'reparte', texto: 'Uno de cada uno: [Ar] 4s¹ 3d⁵', error: 'QM-REPARTE', siFuera: 'Sería así si salieran parejos. Salen primero los del nivel más alto, el 4s.' },
        { id: 'neutro', texto: 'De ninguno: es [Ar] 4s² 3d⁶ con carga 2+', error: 'QM-CARGA-E', siFuera: 'La carga 2+ está bien. Pero esa es la del átomo neutro: dos electrones tienen que salir.' },
      ],
      dibujo: { datos: { filas: [{ nombre: '4s', e: 2, cajas: 1 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe: [Ar] más estos' }, estado: {} },
      revelar: { datos: { filas: [{ nombre: '4s', e: 2, cajas: 1, sale: 2 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe²⁺: [Ar] 3d⁶' }, estado: {} },
      coincide: 'Coincide: salen primero los del nivel más externo, el 4s.',
      noCoincide: 'Los dos electrones salen del 4s, el nivel más externo.',
    },
    mira: {
      datos: { filas: [
        { nombre: '1s', e: 2, cajas: 1, desde: 1 }, { nombre: '2s', e: 2, cajas: 1, desde: 1 }, { nombre: '2p', e: 6, cajas: 3, desde: 1 },
        { nombre: '3s', e: 2, cajas: 1, desde: 1 }, { nombre: '3p', e: 4, cajas: 3, desde: 1 }, { nombre: 'S²⁻', e: 6, cajas: 3, desde: 2, color: 'o' },
      ] },
      voz: 'Del azufre a su anión, y después un catión.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El azufre tiene 16 electrones: quedan 4 para el 3p.', ecuacion: ['S: 1s² 2s² 2p⁶ 3s² 3p⁴'] },
        { estado: { corte: 2 }, texto: 'El S²⁻ gana dos electrones: completa el 3p, como el argón.', ecuacion: ['S²⁻: 1s² 2s² 2p⁶ 3s² 3p⁶'] },
        { estado: { corte: 2 }, texto: 'En un catión salen primero los del n más alto: 4s antes que 3d.' },
      ],
    },
    regla: {
      texto: 'Un anión suma electrones en el orden de llenado. Un catión pierde primero los del nivel más alto: el 4s antes que el 3d.',
      ecuacion: [e, ' = ', Z, ' − ', { llave: ['carga'], nota: 'positiva: perdió', color: 'c-h' }],
      condicion: 'en estado fundamental: primero se cuentan los electrones de la especie.',
      voz: 'Cuenta los electrones antes de escribir la configuración.',
    },
    resuelve: { generar: s => resuelveConfig(s, LISTA_IONES) },
    ahoraTu: { voz: 'Cuenta primero los electrones de la especie.', generar: s => ahoraConfig(s, LISTA_IONES) },
  };

  // ---------- Idea 6: Hund y el último electrón (contenido de antes, sin rehacer: fase 3) ----------
  // Cambia: la especie · Permanece: las cajas de valencia y la marca de los desapareados · Progresa: de 3 a 0
  // desapareados; de O²⁻ a Mg²⁺ con los mismos 10 electrones · Se reserva: el tamaño de los isoelectrónicos (se
  // predice en la recta) · Debe verse: las cajas con una sola flecha y el radio que baja con Z.
  const VALENCIA = {
    C: { filas: [['2s', 2, 1], ['2p', 2, 3]], d: 2 }, N: { filas: [['2s', 2, 1], ['2p', 3, 3]], d: 3 }, O: { filas: [['2s', 2, 1], ['2p', 4, 3]], d: 2 },
    F: { filas: [['2s', 2, 1], ['2p', 5, 3]], d: 1 }, Ne: { filas: [['2s', 2, 1], ['2p', 6, 3]], d: 0 }, 'Fe²⁺': { filas: [['4s', 0, 1], ['3d', 6, 5]], d: 4 },
    Mg: { filas: [['3s', 2, 1], ['3p', 0, 3]], d: 0 }, P: { filas: [['3s', 2, 1], ['3p', 3, 3]], d: 3 }, S: { filas: [['3s', 2, 1], ['3p', 4, 3]], d: 2 },
    Cl: { filas: [['3s', 2, 1], ['3p', 5, 3]], d: 1 }, 'Mn²⁺': { filas: [['4s', 0, 1], ['3d', 5, 5]], d: 5 }, 'Zn²⁺': { filas: [['4s', 0, 1], ['3d', 10, 5]], d: 0 }, B: { filas: [['2s', 2, 1], ['2p', 1, 3]], d: 1 },
  };
  const cajasValencia = k => ({ datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })), desapareados: true, rotulo: `${VALENCIA[k].d} desapareados · ${VALENCIA[k].d ? 'paramagnético' : 'diamagnético'}` }, estado: {} });
  // Animación: los electrones de valencia entran de a uno (uno por segundo, 2 s quieto al empezar), por subnivel y,
  // dentro de él, como dice Hund (la pieza llena así cuando no se le dan flechas). Al final quedan 3 s completos.
  // Los desapareados de cada momento los cuenta el mismo llenado de Hund.
  const hund = (e, cajas) => (e <= cajas ? e : 2 * cajas - e);
  function llenado(k, t) {
    const filas = VALENCIA[k].filas, total = filas.reduce((a, r) => a + r[1], 0), puestos = Math.max(0, Math.min(total, Math.floor(t - 1)));
    let resto = puestos, d = 0;
    const parcial = filas.map(([nombre, e, cajas]) => { const x = Math.min(e, resto); resto -= x; d += hund(x, cajas); return { nombre, e: x, cajas }; });
    return { total, puestos, d, filas: parcial };
  }
  const cajasLlenando = (k, t) => { const q = llenado(k, t); return { datos: { filas: q.filas, desapareados: true, rotulo: `${q.d} ${q.d === 1 ? 'desapareado' : 'desapareados'}${q.puestos === q.total ? ` · ${q.d ? 'paramagnético' : 'diamagnético'}` : ''}` }, estado: {} }; };
  // Radios iónicos de Shannon (1976), NC 6, en pm.
  const ISO10 = [['O²⁻', 8, 140], ['F⁻', 9, 133], ['Na⁺', 11, 102], ['Mg²⁺', 12, 72], ['Al³⁺', 13, 53.5]];
  const ISO18 = [['S²⁻', 16, 184], ['Cl⁻', 17, 181], ['K⁺', 19, 138], ['Ca²⁺', 20, 100]];
  const rectaRadios = (lista, desde = false) => ({
    min: 40, max: 150, paso: 10, cada: 2, sufijo: ' pm', decimales: 1, variable: 'r (pm)', filas: 2,
    elementos: lista.map(([s, z, r], i) => ({ tipo: 'punto', x: r, rotulo: `${s} (${z} p)`, fila: 1 + (i % 2), desde: desde ? i + 1 : 0 })),
    alt: `Radios iónicos (Shannon, en pm) de especies con 10 electrones: ${lista.map(([s, z, r]) => `${s} con ${z} protones, ${f(r, 1)} pm`).join('; ')}.`,
  });
  const ISO_PRED = ISO10.slice(0, 4);
  // Sin arrastre en el juego: el control elige entre especies distintas; no hay una magnitud que agarrar.
  // Hallazgo 9 de la auditoría: son dos representaciones a propósito. Las cajas cuentan los desapareados de una
  // especie; la recta de «Mira» compara el tamaño de varias isoelectrónicas, que en cajas se verían idénticas
  // (lo dice el último paso).
  const desapareados = {
    id: 'desapareados-isoelectronicos',
    titulo: 'Hund y el último electrón',
    temas: ['Paramagnetismo y especies isoelectrónicas'],
    pieza: 'quim-cajas',
    // Lee (fase 2): electrones como imanes, Hund y la palabra isoelectrónico. No compara tamaños (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Imanes diminutos', texto: 'Cada electrón se porta como un imán muy pequeño. Si dos comparten un orbital con espín opuesto, sus efectos se anulan. Un electrón solo, en cambio, hace que un imán atraiga un poco a la sustancia.' },
        { titulo: 'Primero una por caja', texto: 'Al llenar un subnivel, los electrones ocupan primero las cajas vacías, uno en cada una, y recién después se aparean. Es como en una combi: nadie se sienta junto a otro si todavía hay filas libres.' },
        { titulo: 'Isoelectrónicos', texto: 'Dos especies son isoelectrónicas si tienen la misma cantidad de electrones, aunque sus núcleos sean distintos. El Na⁺ y el átomo de neón, por ejemplo, tienen los mismos electrones.' },
        { titulo: 'Qué mirar', texto: 'En el juego, espera a que terminen de entrar los electrones y cuenta las cajas con una sola flecha: la figura las marca.' },
      ],
    },
    juega: {
      consigna: 'Los electrones de valencia entran solos, uno por uno: primero uno en cada caja. Elige una especie y cuenta las cajas marcadas.',
      voz: 'Cuenta solo las cajas marcadas.',
      controles: [{ id: 'k', etiqueta: 'Especie', opciones: ['N', 'O', 'F', 'Ne', 'Fe²⁺'].map(k => ({ valor: k, texto: k })) },
        { id: 't', etiqueta: 't', min: 0, max: 12, paso: 0.1, inicio: 12, unidad: 's', decimales: 1, auto: { velocidad: 1.5 } }],
      dibujo: v => cajasLlenando(v.k, v.t),
      lectura: v => { const q = llenado(v.k, v.t); return [`${v.k}: ${q.puestos} de ${q.total} electrones · ${q.d} ${q.d === 1 ? 'desapareado' : 'desapareados'}${q.puestos === q.total ? (q.d ? ': lo atrae un imán' : ': no lo atrae un imán') : ''}`]; },
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: 'O²⁻, F⁻, Na⁺ y Mg²⁺ tienen 10 electrones cada uno. ¿Cuál de los cuatro es el más pequeño?',
      voz: 'Mismos electrones; mira qué cambia en el núcleo.',
      opciones: [
        { id: 'c', texto: 'Mg²⁺', correcta: true },
        { id: 'iguales', texto: 'Los cuatro miden lo mismo', error: 'QM-ISO-RADIO', siFuera: 'Tienen los mismos electrones, cierto. Pero el núcleo atrae distinto: hay de 8 a 12 protones.' },
        { id: 'o', texto: 'O²⁻, porque tiene menos protones', error: 'QM-ISO-ORDEN', siFuera: 'Menos protones atraen menos a los mismos 10 electrones: el O²⁻ es el más grande.' },
        { id: 'na', texto: 'Na⁺, porque perdió un electrón', error: 'QM-ISO-ORDEN', siFuera: 'Perdió un electrón, cierto. El Mg²⁺ tiene los mismos 10 electrones y un protón más.' },
      ],
      dibujo: { datos: Object.assign(rectaRadios([]), { alt: 'Recta de radios en pm, todavía sin especies.' }), estado: {} },
      revelar: { datos: rectaRadios(ISO_PRED), estado: {} },
      coincide: 'Coincide: con 12 protones, el Mg²⁺ atrae más a los mismos electrones.',
      noCoincide: 'El de más protones atrae más a los mismos 10 electrones: el Mg²⁺.',
    },
    mira: {
      pieza: 'recta',
      datos: rectaRadios(ISO10, true),
      voz: 'Ubiquemos los cinco en la recta, en orden de protones.',
      pasos: [
        { estado: { corte: 1 }, texto: 'O²⁻: 8 protones para 10 electrones.', ecuacion: ['r = 140 pm'] },
        { estado: { corte: 2 }, texto: 'F⁻: un protón más, los mismos electrones.', ecuacion: ['r = 133 pm'] },
        { estado: { corte: 3 }, texto: 'Na⁺: 11 protones jalan más fuerte.', ecuacion: ['r = 102 pm'] },
        { estado: { corte: 5 }, texto: 'Mg²⁺ y Al³⁺: más protones, más pequeños todavía.', ecuacion: ['r = 72 pm y 53,5 pm'] },
        { estado: { corte: 5 }, texto: 'Las cajas de los cinco son iguales: 1s² 2s² 2p⁶, sin desapareados.' },
      ],
    },
    regla: {
      texto: 'Con electrones desapareados, la especie es paramagnética; con todos apareados, diamagnética. Isoelectrónicas: mismos electrones; la de más protones es la más pequeña.',
      condicion: 'Hund: los electrones ocupan cajas vacías antes de aparearse. Los radios se comparan en una misma escala (aquí, Shannon).',
      voz: 'Cajas con una flecha sola: ahí está el paramagnetismo.',
    },
    // Así se resuelve (fase 2): el caso de las cajas de valencia de «Ahora tú» (la variante de los radios usa otra
    // figura), con otra semilla. Los desapareados los cuenta hund(), el mismo llenado de la animación del juego.
    resuelve: {
      generar(s) {
        const k = azar(s + 900).de(Object.keys(VALENCIA)), filas = VALENCIA[k].filas;
        const totalE = filas.reduce((a, x) => a + x[1], 0), solosDe = filas.map(([, e_, cj]) => hund(e_, cj)), d = solosDe.reduce((a, b) => a + b, 0);
        const imán = d ? 'paramagnético' : 'diamagnético';
        const cajas = marca => ({ datos: Object.assign({ filas: filas.map(([nombre, e_, cj]) => ({ nombre, e: e_, cajas: cj })) }, marca ? { desapareados: true, rotulo: `${d} ${d === 1 ? 'desapareado' : 'desapareados'} · ${imán}` } : {}), estado: {} });
        return {
          enunciado: `Estas son las cajas de valencia del ${k}. ¿Cuántos electrones desapareados tiene y cómo responde a un imán?`,
          dibujo: cajas(false),
          pasos: [
            { tipo: 'pide', texto: `Piden los electrones solos del ${k}, uno por caja sin pareja, y si un imán lo atrae.` },
            { tipo: 'datos', texto: `Sus subniveles de valencia: ${filas.map(([nom, e_]) => `${nom}${sup(e_)}`).join(' ')}, con ${totalE} electrones en total.` },
            { tipo: 'regla', texto: 'Por Hund, pongo una flecha en cada caja vacía antes de aparear. Si queda alguna sola, es paramagnético; si todas tienen pareja, diamagnético.' },
            { tipo: 'cuentas', texto: 'Subnivel por subnivel: electrones, cajas y las que quedan con una sola flecha.',
              ecuacion: [filas.map(([nom, e_, cj], i) => `${nom}: ${e_} en ${cj} → ${solosDe[i]}`).join('   ·   '), `   ·   total: ${d}`], dibujo: cajas(true) },
            { tipo: 'sentido', texto: `De vuelta: ${totalE - d} electrones en pareja y ${d} ${d === 1 ? 'solo' : 'solos'} suman ${totalE}, los de valencia.` },
          ],
          respuesta: `${d} ${d === 1 ? 'desapareado' : 'desapareados'}: ${imán}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Cuenta las cajas con una sola flecha.',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const serie = r.de([ISO10, ISO18]).slice();
          const tres = serie.filter((_, i) => i !== r.ent(0, serie.length - 1)).slice(0, 3);
          const menor = tres.reduce((a, b) => (b[1] > a[1] ? b : a)), mayor = tres.reduce((a, b) => (b[1] < a[1] ? b : a));
          return {
            pregunta: `${tres.map(x => x[0]).join(', ')} tienen los mismos electrones. ¿Cuál es el más pequeño?`,
            opciones: [
              { id: 'c', texto: menor[0], correcta: true },
              { id: 'mayor', texto: mayor[0], error: 'QM-ISO-ORDEN', siFuera: 'Ese tiene menos protones para los mismos electrones: es el más grande.' },
              { id: 'iguales', texto: 'Miden lo mismo', error: 'QM-ISO-RADIO', siFuera: 'Mismos electrones no es mismo tamaño: el núcleo de cada uno atrae distinto.' },
            ],
            solucion: { texto: `${menor[0]} tiene ${menor[1]} protones: atrae más a los mismos electrones.` },
          };
        }
        const k = r.de(Object.keys(VALENCIA)), d = VALENCIA[k].d, txt = n => `${n}: ${n ? 'paramagnético' : 'diamagnético'}`;
        const totalE = VALENCIA[k].filas.reduce((a, x) => a + x[1], 0);
        return {
          pregunta: `Estas son las cajas de valencia del ${k}. ¿Cuántos electrones desapareados tiene y cómo responde a un imán?`,
          dibujo: { datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })) }, estado: {} },
          opciones: opciones(txt(d), [
            { id: 'par', valor: txt(totalE % 2), error: 'QM-HUND', siFuera: 'Eso aparea los electrones antes de llenar las cajas vacías. Hund dice lo contrario.' },
            { id: 'uno-mas', valor: txt(d + 1), error: 'QM-CUENTA', siFuera: 'Cuenta solo las cajas con una flecha.' },
            { id: 'cero', valor: txt(0), error: 'QM-HUND', siFuera: 'Sería diamagnético si todas las cajas tuvieran dos flechas.' },
            { id: 'todos', valor: txt(totalE), error: 'QM-HUND', siFuera: 'Eso cuenta todos los electrones de valencia, no solo los que están solos.' },
          ], x => x),
          solucion: { texto: `Por Hund quedan ${d} cajas con una sola flecha.`, ecuacion: [`${k}: ${txt(d)}`], dibujo: { datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })), desapareados: true }, estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: cualquier átomo o ion hasta el calcio, con más neutrones y cargas de −3 a +3 que la idea 1.
  const SIMB_Q = (z, q) => `${SIMB[z]}${carga(q)}`;
  // Mesa «arma-ion» (de la idea 1): el átomo con la paleta 'zne'; los electrones que salen van afuera y los que llegan,
  // con su aro.
  const mesaIon = v => ATOMO({ atomos: [{ Z: v.z, N: v.n, e: Math.max(0, v.z - v.q), carga: v.q, titulo: v.q > v.z ? SIMB[v.z] : nuclido(v.z, v.z + v.n),
    sale: v.q > 0 ? { n: Math.min(v.q, v.z) } : undefined, llega: v.q < 0 ? { n: -v.q } : undefined, rotulo: `A = ${v.z + v.n}` }] });
  // Mesa 2: el ion y sus cajas a la vez (ideas 4 y 5 juntas): Z y carga deciden los electrones; se marcan los solos.
  const solos = c => c.reduce((a, [nom, k]) => { const cj = cajasDe(nom); return a + (k <= cj ? k : 2 * cj - k); }, 0);
  // El máximo de electrones solos que alcanza la mesa (hasta 23 electrones), calculado con las mismas cajas.
  const MAX_SOLOS = Math.max(...Array.from({ length: 23 }, (_, k) => solos(config(k + 1))));
  const dibIon = v => {
    const el = v.z - v.q, c = el > 0 ? config(el) : [];
    return { datos: { filas: filasConfig(c), desapareados: true, rotulo: el > 0 ? `${SIMB_Q(v.z, v.q)}: ${solos(c)} desapareados` : el === 0 ? `${SIMB_Q(v.z, v.q)}: sin electrones` : `${SIMB[v.z]} no tiene tantos electrones` }, estado: {} };
  };

  // Mesa 3D «La nube del orbital»: los datos de la pieza quim-orbital-3d, todos del motor (regla 1).
  const ESC_COMUN = 2.4 / MA.orbital(MA.mayorOrbital()).r90;
  const nubeDe = v => {
    const o = MA.orbital(v.orb), nb = MA.nube(v.orb, { corte: v.cor === 1 });
    return { datos: { puntos: nb.puntos, escala: v.esc === 1 ? 2.2 / o.r90 : ESC_COMUN, nombre: o.nombre, corte: nb.corte, lobulos: MA.lobulos(v.orb),
      vista: o.corte === 'z' ? { giro: 30, inclinacion: 55 } : { giro: 30, inclinacion: 20 },   // dxy y dx²−y²: mejor desde arriba
      nodos: v.nod === 1 ? { radiales: o.radiales, planos: o.planos, conos: o.conos } : null, medidas: medidasDe(v, nb) }, estado: {} };
  };
  // Animación (ronda 5): la nube se arma sola, medida a medida (los puntos del motor salen en orden de azar), en 8 s.
  // Sin t (casos guardados de antes), la nube entera.
  const medidasDe = (v, nb) => (Number.isFinite(v.t) ? Math.round(nb.puntos.length * (0.04 + 0.96 * Math.min(1, v.t / 8))) : nb.puntos.length);

  return {
    unidad: 'quimica.estructura-atomica',
    version: '0.2.0',
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-atomo.js', '/nucleo/kit/piezas/quim-objeto.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-cajas.js', '/nucleo/kit/piezas/recta.js',
      '/plantillas/atomo-y-tabla/motor.js', '/nucleo/kit/piezas/quim-orbital-3d.js'],
    historia: {
      texto: 'Desde 1808, John Dalton explicó las proporciones de combinación con átomos de masa propia; algunas de sus fórmulas estaban equivocadas. En 1911, la dispersión de partículas alfa llevó a Rutherford al núcleo, y en 1913 Bohr propuso niveles de energía. El modelo actual no es una foto: es la descripción que mejor explica las evidencias que tenemos.',
      pregunta: '¿Cómo sabes qué hay dentro de algo que no puedes ver?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §2.3', url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      // Idea 1 (rehecha, 18 nov): cada término con 3 ejemplos o más; los tres que el Resumen muestra llevan `simple`. Ningún
      // `simple` dice qué le pasa a un átomo que pierde un electrón (es la predicción de la idea).
      { termino: 'átomo', formas: ['átomo', 'átomos'], def: 'Partícula más pequeña de un elemento: un núcleo con protones y neutrones, rodeado de electrones.',
        ejemplos: ['Un átomo de helio: 2 protones y 2 neutrones en el núcleo, 2 electrones afuera.', 'En un hueso hay muchísimos átomos de carbono.', 'Un átomo de carbono-12 tiene 6 protones, 6 neutrones y 6 electrones.'],
        ver: ['protón', 'electrón', 'elemento'] },
      { termino: 'protón', formas: ['protón', 'protones'], def: 'Partícula del núcleo con carga positiva. Cuántos hay es el número atómico.',
        ejemplos: ['El carbono tiene 6 protones en su núcleo.', 'Un protón pesa unas 1836 veces lo que un electrón.', 'En el dibujo, «6p⁺» son 6 protones.'],
        ver: ['número atómico'] },
      { termino: 'neutrón', formas: ['neutrón', 'neutrones'], def: 'Partícula del núcleo sin carga, con masa casi igual a la del protón.',
        ejemplos: ['El carbono-14 tiene 8 neutrones; el carbono-12, 6.', 'El hidrógeno común no tiene neutrones.', 'En el dibujo, «8n⁰» son 8 neutrones.'],
        ver: ['isótopo', 'número de masa'] },
      { termino: 'electrón', formas: ['electrón', 'electrones'], def: 'Partícula muy liviana con carga negativa que se mueve alrededor del núcleo.',
        ejemplos: ['Un átomo de helio neutro tiene 2 electrones.', 'Se escribe e⁻: carga negativa.', 'Los electrones y los protones se atraen: sus cargas son opuestas.'],
        ver: ['orbital', 'ion'] },
      { termino: 'número atómico', formas: ['número atómico', 'números atómicos'], simbolo: 'Z', def: 'Cantidad de protones del núcleo. Cada elemento tiene el suyo.',
        simple: 'Cuántos protones hay en el núcleo del átomo.',
        ejemplos: ['El carbono tiene Z = 6: seis protones.', 'El cobre de Cuajone tiene Z = 29.', 'El calcio tiene Z = 20.'], ver: ['protón'] },
      { termino: 'número de masa', formas: ['número de masa', 'números de masa'], simbolo: 'A', def: 'Protones más neutrones de un núcleo: A = Z + N.',
        simple: 'Cuántas partículas hay en el núcleo: protones y neutrones juntos.',
        ejemplos: ['Carbono con 6 protones y 8 neutrones: A = 6 + 8 = 14.', 'En «cloro-37», 37 es el número de masa.', 'En ²³Na, el 23 de arriba es A.'],
        ver: ['número atómico', 'neutrón'] },
      { termino: 'isótopo', formas: ['isótopo', 'isótopos'], def: 'Átomos del mismo elemento con distinto número de neutrones, y por eso distinto número de masa.',
        simple: 'Otro átomo del mismo elemento, con más o menos neutrones.',
        ejemplos: ['Carbono-12 y carbono-14: 6 protones los dos; 6 y 8 neutrones.', 'Cloro-35 y cloro-37: 17 protones; 18 y 20 neutrones.', 'Hidrógeno común y deuterio: 1 protón; 0 y 1 neutrón.'],
        ver: ['número de masa'] },
      { termino: 'isóbaro', formas: ['isóbaro', 'isóbaros'], def: 'Dicho de dos átomos de elementos distintos con el mismo número de masa.',
        ejemplos: ['¹⁴C y ¹⁴N: los dos con A = 14.', '⁴⁰Ar y ⁴⁰Ca: los dos con A = 40.', '³²P y ³²S: los dos con A = 32.'],
        ver: ['número de masa', 'isótopo'] },
      { termino: 'isótono', formas: ['isótono', 'isótonos'], def: 'Dicho de dos átomos con el mismo número de neutrones.',
        ejemplos: ['³⁹K y ⁴⁰Ca: 20 neutrones cada uno.', '¹³C y ¹⁴N: 7 neutrones cada uno.', '²³Na y ²⁴Mg: 12 neutrones cada uno.'],
        ver: ['neutrón', 'isóbaro'] },
      { termino: 'ion', formas: ['ion', 'iones'], def: 'Átomo o grupo de átomos con carga eléctrica: sus protones y sus electrones no son la misma cantidad.',
        ejemplos: ['Cl⁻: 17 protones y 18 electrones, carga 17 − 18 = −1.', 'Ca²⁺: 20 protones y 18 electrones, carga +2.', 'Al³⁺: 13 protones y 10 electrones, carga +3.'],
        ver: ['catión', 'anión'] },
      { termino: 'catión', formas: ['catión', 'cationes'], def: 'Ion positivo: tiene menos electrones que protones.', ejemplo: 'Ca²⁺ perdió 2 electrones.', ver: ['anión'] },
      { termino: 'anión', formas: ['anión', 'aniones'], def: 'Ion negativo: tiene más electrones que protones.', ejemplo: 'Cl⁻ ganó 1 electrón: 18 en total.', ver: ['catión'] },
      { termino: 'orbital', def: 'Región alrededor del núcleo donde es probable hallar un electrón. Caben dos, con espín opuesto.',
        ver: ['números cuánticos'] },
      { termino: 'números cuánticos', formas: ['números cuánticos', 'número cuántico'], simbolo: 'n, l, mₗ, mₛ',
        def: 'Cuatro valores que describen a un electrón: nivel, subnivel, orbital y espín.',
        ejemplo: 'n = 3, l = 1 es el subnivel 3p.', ver: ['orbital'] },
      { termino: 'configuración electrónica', formas: ['configuración electrónica', 'configuraciones electrónicas', 'configuración'],
        def: 'Cómo se reparten los electrones de una especie en sus subniveles, del de menor energía al de mayor.',
        ejemplo: 'Cl, con 17 electrones: 1s² 2s² 2p⁶ 3s² 3p⁵.', ver: ['orbital'] },
      { termino: 'electrón desapareado', formas: ['electrón desapareado', 'electrones desapareados', 'desapareados', 'desapareado'],
        def: 'Electrón solo en su orbital, sin otro de espín opuesto a su lado.',
        ejemplo: 'El nitrógeno tiene 3 en el 2p, uno por caja.', ver: ['orbital'] },
      { termino: 'isoelectrónico', formas: ['isoelectrónico', 'isoelectrónicos', 'isoelectrónica', 'isoelectrónicas'],
        def: 'Dicho de dos especies distintas que tienen la misma cantidad de electrones.',
        ejemplos: ['Na⁺, Ne y F⁻: los tres con 10 electrones.', 'Cl⁻ y Ca²⁺: los dos con 18 electrones.', 'O²⁻ y Mg²⁺: los dos con 10 electrones.'], ver: ['ion'] },
      { termino: 'nodo', formas: ['nodo', 'nodos', 'nodo esférico', 'nodos esféricos'],
        def: 'Lugar de un orbital donde la probabilidad de hallar al electrón es cero.',
        ejemplo: 'El 2s tiene un nodo esférico a 2 a₀ del núcleo.', ver: ['orbital', 'plano nodal'] },
      { termino: 'plano nodal', formas: ['plano nodal', 'planos nodales'],
        def: 'Plano que pasa por el núcleo y en el que un orbital no tiene ningún punto.',
        ejemplo: 'El 2pz tiene uno: el plano xy.', ver: ['nodo'] },
      { termino: 'radio de Bohr', formas: ['radio de Bohr', 'radios de Bohr'], simbolo: 'a₀', medida: 'pm',
        def: 'Unidad de distancia dentro del átomo de hidrógeno: 52,9 pm. En un milímetro caben unos 19 millones.',
        ver: ['orbital'] },
      { termino: 'subnivel', formas: ['subnivel', 'subniveles'], def: 'Parte de un nivel con orbitales del mismo tipo; se nombra con una letra: s, p, d o f.',
        ejemplo: 'El 3p tiene 3 orbitales.', ver: ['orbital', 'números cuánticos'] },
      { termino: 'espín', simbolo: 'mₛ', def: 'Propiedad del electrón que se dibuja como una flecha hacia arriba o hacia abajo: vale +½ o −½.',
        ver: ['orbital', 'electrón desapareado'] },
      { termino: 'regla de Hund', formas: ['regla de Hund', 'Hund'], def: 'En un subnivel, los electrones ocupan primero orbitales vacíos, uno en cada uno, y después se aparean.',
        ejemplo: 'El nitrógeno pone sus 3 electrones 2p en 3 cajas distintas.', ver: ['electrón desapareado'] },
      { termino: 'paramagnético', formas: ['paramagnético', 'paramagnética', 'paramagnéticos', 'paramagnetismo'],
        def: 'Dicho de una especie con electrones desapareados: un imán la atrae un poco.', ver: ['diamagnético', 'electrón desapareado'] },
      { termino: 'diamagnético', formas: ['diamagnético', 'diamagnética', 'diamagnéticos'],
        def: 'Dicho de una especie con todos sus electrones en pareja: un imán no la atrae.', ver: ['paramagnético'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La 3D (la nube del orbital) va primera. La segunda abre los rangos de la idea 1 (hasta Z = 20 y
    // cargas de ±3); la tercera junta la configuración de un ion con sus desapareados. La lectura dice la especie y
    // lo que resulta, para que un caso guardado se lea solo.
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        // La nube, los nodos y el r90 salen del motor de plantillas/atomo-y-tabla (orbital, nube): solo el hidrógeno.
        id: 'nube-orbital', titulo: 'La nube del orbital', pieza: 'quim-orbital-3d',
        consigna: 'La nube se arma sola, medida a medida: cada punto es un lugar probable del electrón. Gírala, córtala y compara tamaños en radios de Bohr.',
        controles: [
          { id: 'orb', etiqueta: 'Orbital', opciones: MA.ORBITALES.map(k => ({ valor: k, texto: MA.orbital(k).nombre })) },
          { id: 'cor', etiqueta: 'Nube', opciones: [{ valor: 0, texto: 'Entera' }, { valor: 1, texto: 'Cortada' }] },
          { id: 'nod', etiqueta: 'Nodos', opciones: [{ valor: 0, texto: 'Ocultos' }, { valor: 1, texto: 'A la vista' }] },
          { id: 'esc', etiqueta: 'Tamaño', opciones: [{ valor: 1, texto: 'Ampliado' }, { valor: 0, texto: 'Misma escala' }] },
          { id: 't', etiqueta: 't', min: 0, max: 8, paso: 0.5, inicio: 8, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
        ],
        dibujo: v => nubeDe(v),
        lectura: v => { const o = MA.orbital(v.orb); return [`${nubeDe(v).datos.medidas} puntos · ${o.nombre}: ${o.nodos} ${o.nodos === 1 ? 'nodo' : 'nodos'} · 90 % dentro de ${f(o.r90, 1)} a₀`]; },
        // Retos comprobados con el mismo motor que arma la nube (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Corta la nube y encuentra un orbital con un hueco esférico por dentro.',
            logrado: v => v.cor === 1 && MA.orbital(v.orb).nodosRadiales >= 1,
            bien: 'Ese hueco es un nodo: ahí el electrón no aparece nunca.',
            pista: 'Prueba los orbitales s de n = 2 o 3, con la nube cortada.' },
          { texto: 'Busca un orbital con dos planos nodales: planos sin un solo punto.',
            logrado: v => MA.orbital(v.orb).planos.length === 2,
            bien: 'Dos planos nodales y cuatro lóbulos, como un trébol: es un orbital d.',
            pista: 'Enciende los nodos y recorre los orbitales 3d.' },
          { texto: 'Pon un orbital p con sus dos lóbulos sobre el eje z.',
            logrado: v => MA.orbital(v.orb).l === 1 && MA.orbital(v.orb).eje === 'z',
            bien: 'Un lóbulo ψ + y otro ψ −: es el signo de ψ, no una carga.',
            pista: 'Mira los rótulos x, y, z y elige el p que va por z.' },
          { texto: 'A la misma escala, encuentra el orbital más grande de la lista.',
            logrado: v => v.esc === 0 && v.orb === MA.mayorOrbital(),
            bien: 'Con n crece la nube. Córtalo: ¿cuántos nodos esconde?',
            pista: 'Deja «Misma escala» y compara los orbitales de n = 3.' },
          { texto: 'Guarda un 2p y un 3p del mismo eje, a la misma escala.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => {
              const x = MA.orbital(a.orb), y = MA.orbital(b.orb);
              return a.esc === 0 && b.esc === 0 && x.l === 1 && y.l === 1 && x.eje === y.eje && x.n === 2 && y.n === 3;
            })),
            bien: 'Misma forma, más grande. Y el 3p esconde un nodo esférico.',
            pista: 'Guarda el 2pz, cambia al 3pz y guárdalo también.' },
        ],
      },
      {
        id: 'arma-ion', titulo: 'Arma cualquier átomo o ion', pieza: 'quim-atomo',
        consigna: 'Elige protones, neutrones y carga hasta el calcio. Saca o trae electrones con la manija y mira qué no cambia.',
        controles: [
          { id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 11, decimales: 0 },
          { id: 'n', etiqueta: 'Neutrones (N)', color: 'c-i', min: 0, max: 24, paso: 1, inicio: 12, decimales: 0 },
          { id: 'q', etiqueta: 'Carga', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => mesaIon(v),
        // Con su número de masa (²³Na): así el nitrógeno nunca sale como «N» suelto junto a los neutrones.
        lectura: v => (v.q > v.z ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`]
          : [Pz(`${v.z} p⁺`), ', ', Nn(`${v.n} n⁰`), ' y ', Ee(`${v.z - v.q} e⁻`), ` → ${nuclido(v.z, v.z + v.n, v.q)}, `, A, ` = ${v.z + v.n}`]),
        arrastres: [{ id: 'carga', etiqueta: 'carga: a la derecha salen electrones', color: 'c-f',
          donde: v => manijaCarga(mesaIon(v), v.q),
          mover: (pt, v) => ({ q: cargaEn(mesaIon(v), pt) }) }],
        // Retos comprobados (docs/teoria.md §4d): miden protones, neutrones y carga, lo mismo que arma el dibujo.
        invitaciones: [
          { texto: 'Arma otro isótopo del sodio: mismo número atómico, número de masa 25.',
            logrado: v => v.z === 11 && v.z + v.n === 25 && v.q <= v.z,
            bien: 'Más neutrones y sigue siendo sodio: el elemento lo deciden los protones.' },
          { texto: 'Arma un anión con tantos electrones como el argón.',
            logrado: v => v.q < 0 && v.z - v.q === 18,
            bien: 'Mismos electrones que el argón, otro núcleo. ¿Cuál será el más grande?' },
          { texto: 'Deja un catión sin un solo electrón.',
            logrado: v => v.q > 0 && v.z - v.q === 0,
            bien: 'Solo queda el núcleo. La carga es igual a los protones.' },
          { texto: 'Guarda dos núcleos de elementos distintos con el mismo número de masa.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.z !== b.z && a.z + a.n === b.z + b.n)),
            bien: 'Mismo A, distinto Z: no son isótopos, son elementos diferentes.' },
        ],
      },
      {
        id: 'cajas-ion', titulo: 'Las cajas de un ion', pieza: 'quim-cajas',
        consigna: 'Elige el elemento y su carga: sale su configuración electrónica. Lleva la última flecha a otra caja y mira los electrones solos.',
        controles: [
          { id: 'z', etiqueta: 'Z', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 17, decimales: 0 },
          { id: 'q', etiqueta: 'Carga', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => dibIon(v),
        lectura: v => (v.z - v.q < 0 ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`] : v.z === v.q ? [`${SIMB_Q(v.z, v.q)}: sin electrones, no hay cajas que llenar`]
          : [`${SIMB_Q(v.z, v.q)} · ${v.z - v.q} `, e, ` → ${textoConfig(config(v.z - v.q))}`]),
        arrastres: [{ id: 'ultimo', etiqueta: 'último electrón: llévalo a otra caja', color: 'c-f',
          donde: v => sitioFlecha(Math.max(1, v.z - v.q)),
          mover: (pt, v) => ({ q: v.z - masCercana(pt, 23) }) }],
        // Retos: los electrones solos y el último subnivel salen de config() y solos(), lo mismo que pinta las cajas.
        invitaciones: [
          { texto: 'Encuentra un catión con todos sus electrones apareados.',
            logrado: v => v.q > 0 && v.z - v.q > 0 && solos(config(v.z - v.q)) === 0,
            bien: 'Ninguna flecha sola: a ese catión no lo atrae un imán. ¿Le pasa a todo catión?' },
          { texto: 'Busca la especie con más electrones desapareados que puedas armar.',
            logrado: v => v.z - v.q > 0 && solos(config(v.z - v.q)) === MAX_SOLOS,
            bien: 'Una flecha por caja antes de aparear: así reparte Hund.' },
          { texto: 'Haz que el último electrón caiga en una caja 4s.',
            logrado: v => { const c = v.z - v.q > 0 ? config(v.z - v.q) : []; return c.length > 0 && c[c.length - 1][0] === '4s'; },
            bien: 'El 4s se llena antes que el 3d: tiene menos energía.' },
          { texto: 'Guarda dos especies distintas con la misma configuración del neón.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.z !== b.z && a.z - a.q === 10 && b.z - b.q === 10)),
            bien: 'Isoelectrónicas: mismas cajas, distinto núcleo. La de más protones es la más chica.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'nube-orbital': ['numeros-cuanticos'],
      'arma-ion': ['nucleo-identidad'],
      'cajas-ion': ['configuracion-iones', 'desapareados-isoelectronicos'],
    },
    ideas: [nucleo, modelos, cuanticos, configuracion, configIones, desapareados],
  };
});
