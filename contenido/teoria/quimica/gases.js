/*
 * Teoría de «Gases» (quimica.gases). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida: fija qué queda constante antes de calcular.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 9), historia-ecuaciones (Boyle, 1661) y las precisiones de
 * Química del expediente. Errores: docs/investigacion/gases-soluciones-ideas-erroneas.md (GQ), estequiometria (ES5);
 * los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: predecir qué pasa con un gas cuando cambia una sola condición y calcular con PV = nRT.
 *   Persona y condiciones: postulante de 4.º–5.º (muchos en la altura de Puno), celular de 360 px, sin audio.
 *   Resultado observable: aplica Boyle, Charles y Gay-Lussac con kelvin, calcula volumen molar, densidad, presiones
 *     parciales, la razón de Graham y el volumen de un gas producido en una reacción.
 *   Orden de atención: 1.º el émbolo y las partículas · 2.º la lectura P, V, T · acción: cambiar una condición · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿22,4 L vale siempre?, ¿se puede usar °C?, ¿el gas más pesado escapa antes?
 *
 * Colores (regla 4): P presión naranja c-o, V volumen turquesa c-i, T temperatura rojo c-h, n moles verde c-d.
 * Partículas (bolitas): N₂ tinta con punto, O₂ rojo lleno, He verde hueco, H₂ turquesa hueco.
 * Datos: R = 0,082 atm·L/(mol·K). Presión en Juliaca (3825 m): ≈ 0,62 atm con la atmósfera estándar
 * (p = 101,325 kPa · (1 − 2,2558 × 10⁻⁵ · h)^5,256 → 63 kPa); se usa 0,62 atm y 283 K como caso típico.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §9.2 y §9.3; IUPAC (condiciones estándar).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const P = { v: 'c-o', t: 'P' }, V = { v: 'c-i', t: 'V' }, T = { v: 'c-h', t: 'T' }, n = { v: 'c-d', t: 'n' };
  const R = 0.082;
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
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  const ATOMOS = { N: { estilo: 'punto', r: 5.5 }, O: { color: 'h', estilo: 'lleno', r: 5.5 }, He: { color: 'd', estilo: 'hueco', r: 5 }, H: { color: 'i', estilo: 'hueco', r: 4.5 } };
  const ESPECIES = { N2: [['N', -5, 0], ['N', 5, 0]], O2: [['O', -5, 0], ['O', 5, 0]], He: [['He', 0, 0]], H2: [['H', -4, 0], ['H', 4, 0]] };
  // Gesto directo (docs/teoria.md §4b): la manija del émbolo va en el centro de su placa, con la geometría de la pieza.
  // La placa ocupa de r.y − 10 a r.y − 2 (quim-particulas: yp = r.y − 4); nivel es la fracción de la caja bajo ella.
  const PZ = () => Kit.piezas['quim-particulas'];
  const embolo = dib => { const g = PZ().geometria(dib.datos), r = PZ().region(dib.datos.cajas[0], g, 0); return { x: g.x(0) + g.ancho / 2, y: r.y - 6 }; };
  const nivelEn = (dib, y) => { const g = PZ().geometria(dib.datos); return (g.y1 - (y + 2)) / (g.alto - 8); };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 22, cajas }, extra), estado: {} });

  // ---------- Idea 1: una sola condición a la vez (Boyle, Charles, Gay-Lussac) ----------
  // Cambia: el volumen del émbolo y la temperatura · Permanece: los mismos 8 moles-modelo de gas (n fijo) · Progresa: la
  // presión sube cuando el émbolo baja · Se reserva: el producto P·V que no cambia a T fija · Debe verse: la altura del
  // émbolo (volumen) junto a la presión que se lee.
  const N_MOL = 0.1;
  const piston = (vol, max = 4) => lupa([{ titulo: '0,1 mol de gas', forma: 'cilindro', nivel: vol / max, particulas: [{ e: 'N2', n: 8 }], rotulo: `${f(vol, 1)} L` }]);
  const leyes = {
    id: 'una-condicion',
    titulo: 'Cambia una condición a la vez',
    temas: ['Presión y temperatura', 'Leyes de Boyle, Charles y Gay-Lussac'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'El cilindro tiene siempre el mismo gas. Mueve el émbolo (volumen) y cambia la temperatura en kelvin. Lee la presión.',
      voz: 'Cambia una sola cosa y mira qué pasa con la presión.',
      controles: [
        { id: 'v', etiqueta: 'V', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 4, unidad: 'L', decimales: 1 },
        { id: 't', etiqueta: 'T', color: 'c-h', min: 200, max: 400, paso: 50, inicio: 300, unidad: 'K', decimales: 0 },
      ],
      dibujo: val => piston(val.v),
      lectura: val => [P, ` = ${f(N_MOL * R * val.t / val.v, 2)} atm · `, P, V, ` = ${f(N_MOL * R * val.t, 2)} atm·L`],
      minimo: 3,
      // El émbolo se agarra y se empuja: el volumen es la variable del fenómeno; la presión responde en la lectura.
      arrastres: [{ id: 'embolo', etiqueta: 'émbolo del cilindro', color: 'c-i',
        donde: val => embolo(piston(val.v)),
        mover: (pt, val) => ({ v: nivelEn(piston(val.v), pt.y) * 4 }) }],
    },
    predice: {
      pregunta: ['Con la temperatura fija, el émbolo baja de ', V, ' = 4 L a 2 L. Si la presión era 0,6 atm, ¿cuánto vale ahora ', P, '?'],
      voz: 'Piensa qué pasa con los choques contra las paredes.',
      opciones: [
        { id: 'c', texto: '1,2 atm', correcta: true },
        { id: 'directa', texto: '0,3 atm', error: 'QM-BOYLE-DIRECTA', siFuera: 'Así sería si P y V crecieran juntos. A T fija, al bajar V la presión sube.' },
        { id: 'igual', texto: '0,6 atm', error: 'QM-P-FIJA', siFuera: 'Sería cierto si el gas pudiera escapar o enfriarse. Aquí las mismas partículas chocan en menos espacio.' },
        { id: 'cuatro', texto: '2,4 atm', error: 'QM-BOYLE-CUADRADO', siFuera: 'Eso sería un volumen de 1 L. Con la mitad del volumen, la presión se duplica.' },
      ],
      dibujo: piston(4),
      revelar: lupa([{ titulo: '0,1 mol de gas', forma: 'cilindro', nivel: 0.5, particulas: [{ e: 'N2', n: 8 }], rotulo: '2 L · 1,2 atm' }]),
      coincide: 'Coincide: la mitad de volumen, el doble de presión.',
      noCoincide: 'Con T fija, P·V se mantiene: 0,6 · 4 = 1,2 · 2.',
    },
    // Hallazgo 9 de la auditoría: son dos representaciones a propósito. El émbolo da un estado a la vez; la curva P–V
    // junta los estados que el alumno probó en una sola figura, con el mismo color de V y P que el cilindro.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 4, paso: 1, nombre: 'V', unidad: 'L', decimales: 0, color: 'i' },
        y: { min: 0, max: 2.5, paso: 0.5, nombre: 'P', unidad: 'atm', decimales: 1, color: 'o' },
        curvas: [{ puntos: Array.from({ length: 31 }, (_, k) => { const v = 0.96 + k * 0.1; return [v, 2.4 / v]; }), color: 'o', desde: 2 }],
        puntos: [
          { x: 4, y: 0.6, color: 'o', rotulo: '4 L · 0,6 atm', desde: 1 },
          { x: 2, y: 1.2, color: 'o', rotulo: '2 L · 1,2 atm', guias: true, desde: 2 },
          { x: 1, y: 2.4, color: 'o', rotulo: '1 L · 2,4 atm', desde: 3 },
        ],
        alt: 'Curva de presión contra volumen a temperatura fija: 4 L con 0,6 atm, 2 L con 1,2 atm y 1 L con 2,4 atm. El producto P·V vale 2,4 en los tres puntos.',
      },
      voz: 'Registremos tres estados y su producto P·V.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Estado inicial: 4 L a 0,6 atm.', ecuacion: [P, V, ' = 0,6 · 4 = 2,4 atm·L'] },
        { estado: { corte: 2 }, texto: 'Mitad de volumen, doble de presión: el producto no cambia.', ecuacion: [P, V, ' = 1,2 · 2 = 2,4 atm·L'] },
        { estado: { corte: 3 }, texto: 'A 1 L, la presión es cuatro veces la inicial.', ecuacion: [P, V, ' = 2,4 · 1 = 2,4 atm·L'] },
        { estado: { corte: 3 }, texto: 'Si en cambio se calienta a P fija, V crece con T en kelvin.', ecuacion: [{ frac: [{ sub: [V, '1'] }, { sub: [T, '1'] }] }, ' = ', { frac: [{ sub: [V, '2'] }, { sub: [T, '2'] }] }] },
      ],
    },
    regla: {
      texto: 'Con n y T fijos, P·V no cambia (Boyle). Con n y P fijos, V/T no cambia (Charles). Con n y V fijos, P/T tampoco (Gay-Lussac).',
      ecuacion: [{ llave: [{ sub: [P, '1'] }, { sub: [V, '1'] }], nota: 'antes' }, ' = ', { llave: [{ sub: [P, '2'] }, { sub: [V, '2'] }], nota: 'después' }, '   ·   ', { frac: [{ sub: [V, '1'] }, { sub: [T, '1'] }] }, ' = ', { frac: [{ sub: [V, '2'] }, { sub: [T, '2'] }] }, '   ·   ', { frac: [{ sub: [P, '1'] }, { sub: [T, '1'] }] }, ' = ', { frac: [{ sub: [P, '2'] }, { sub: [T, '2'] }] }],
      condicion: 'T en kelvin (T = t + 273) y P absoluta; cada ley vale solo si las otras dos variables no cambian.',
      voz: 'Primero anota qué queda fijo. Después elige la ley.',
    },
    ahoraTu: {
      voz: 'Anota qué queda fijo antes de calcular.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const p1 = r.de([0.5, 0.8, 1, 1.5, 2]), v1 = r.ent(2, 12), v2 = r.de([1, 2, 3, 4, 6].filter(x => x !== v1)), p2 = p1 * v1 / v2;
          return {
            pregunta: ['Un gas a temperatura fija pasa de ', V, ` = ${v1} L a ${v2} L. Si estaba a `, P, ` = ${f(p1, 1)} atm, ¿cuál es la nueva presión?`],
            opciones: opciones(p2, [
              { id: 'directa', valor: p1 * v2 / v1, error: 'QM-BOYLE-DIRECTA', siFuera: 'Eso hace que P y V cambien en el mismo sentido. A T fija, uno sube si el otro baja.' },
              { id: 'igual', valor: p1, error: 'QM-P-FIJA', siFuera: 'La presión se mantendría si el volumen no cambiara.' },
              { id: 'suma', valor: p1 + v1 - v2, error: 'QM-RESTA', siFuera: 'Eso suma y resta los datos; P·V es lo que se conserva.' },
            ], x => `${f(x, 2)} atm`),
            solucion: { texto: 'A T fija, P·V se conserva.', ecuacion: [{ sub: [P, '2'] }, ` = ${f(p1, 1)} · ${v1} / ${v2} = ${f(p2, 2)} atm`] },
          };
        }
        const t1 = r.de([7, 17, 27, 37, 47]), t2 = t1 + r.de([50, 100, 150]), x1 = r.ent(2, 9);
        const K1 = t1 + 273, K2 = t2 + 273, x2 = x1 * K2 / K1;
        const charles = tipo === 1, var1 = charles ? V : P, u = charles ? 'L' : 'atm', fijo = charles ? 'presión' : 'volumen';
        return {
          pregunta: [`Un gas a ${fijo} fija se calienta de ${t1} °C a ${t2} °C. Si `, var1, ` = ${x1} ${u}, ¿cuánto vale al final?`],
          opciones: opciones(x2, [
            { id: 'celsius', valor: x1 * t2 / t1, error: 'QM-CELSIUS', siFuera: 'Eso usa grados Celsius. Las leyes de gases piden kelvin: t + 273.' },
            { id: 'igual', valor: x1, error: 'GQ20', siFuera: `Se mantendría si la temperatura no cambiara.` },
            { id: 'inversa', valor: x1 * K1 / K2, error: 'QM-BOYLE-DIRECTA', siFuera: 'Eso la hace bajar al calentar; con la otra variable fija, sube con T.' },
          ], x => `${f(x, 2)} ${u}`),
          solucion: { texto: `En kelvin: ${K1} K y ${K2} K.`, ecuacion: [var1, ` = ${x1} · ${K2} / ${K1} = ${f(x2, 2)} ${u}`] },
        };
      },
    },
  };

  // ---------- Idea 2: PV = nRT, volumen molar y densidad ----------
  // Cambia: la presión y la temperatura · Permanece: 1 mol de gas · Progresa: el émbolo sube al bajar P o al subir T ·
  // Se reserva: 22,4 L, que aparece solo en 273 K y 1 atm · Debe verse: el volumen de 1 mol en Juliaca frente al de Lima.
  const VMAX = 70;
  const unMol = (p, t) => lupa([{ titulo: '1 mol de gas', forma: 'cilindro', nivel: (R * t / p) / VMAX, particulas: [{ e: 'N2', n: 6 }], rotulo: `${f(R * t / p, 1)} L` }]);
  const estado = {
    id: 'ecuacion-estado',
    titulo: 'Cuánto ocupa un mol',
    temas: ['Ecuación de estado', 'Densidad y masa molar de un gas', 'Volumen molar y condiciones normales'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Hay 1 mol de gas. Cambia la presión y la temperatura; el émbolo sube o baja hasta que el volumen cumple PV = nRT.',
      voz: 'Busca en qué condiciones el volumen da 22,4 L.',
      controles: [
        { id: 'p', etiqueta: 'P', color: 'c-o', min: 0.5, max: 2, paso: 0.25, inicio: 1, unidad: 'atm', decimales: 2 },
        { id: 't', etiqueta: 'T', color: 'c-h', min: 273, max: 373, paso: 25, inicio: 298, unidad: 'K', decimales: 0 },
      ],
      dibujo: val => unMol(val.p, val.t),
      lectura: val => [V, ` = ${f(R * val.t / val.p, 1)} L por mol`],
      minimo: 3,
      // Empujar el émbolo es subir la presión: la manija mueve P (V = RT/P), y el volumen que se lee es el que dejó.
      arrastres: [{ id: 'embolo-p', etiqueta: 'émbolo: más abajo, más presión', color: 'c-o',
        donde: val => embolo(unMol(val.p, val.t)),
        mover: (pt, val) => { const v = Math.max(1, nivelEn(unMol(val.p, val.t), pt.y) * VMAX); return { p: R * val.t / v }; } }],
    },
    predice: {
      pregunta: ['En Juliaca la presión es unos 0,62 atm y una mañana T = 283 K. ¿Cuánto ', V, ' ocupa 1 mol de gas?'],
      voz: 'Revisa qué condiciones vienen con el 22,4.',
      opciones: [
        { id: 'c', texto: `${f(R * 283 / 0.62, 1)} L`, correcta: true },
        { id: 'cn', texto: '22,4 L', error: 'ES5', siFuera: '22,4 L es el volumen de 1 mol a 273 K y 1 atm. En Juliaca la presión es menor.' },
        { id: 'por', texto: `${f(R * 283 * 0.62, 1)} L`, error: 'QM-PV-DESPEJE', siFuera: 'Eso multiplica por P. Al despejar V, la presión divide: V = nRT/P.' },
        { id: 'celsius', texto: `${f(R * 10 / 0.62, 1)} L`, error: 'QM-CELSIUS', siFuera: 'Eso usa 10 °C en vez de 283 K. La ecuación pide kelvin.' },
      ],
      dibujo: unMol(1, 273),
      revelar: unMol(0.62, 283),
      coincide: `Coincide: V = 0,082 · 283 / 0,62 ≈ ${f(R * 283 / 0.62, 1)} L.`,
      noCoincide: `Con menos presión, el mismo mol ocupa más: ${f(R * 283 / 0.62, 1)} L.`,
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 260, max: 380, paso: 20, nombre: 'T', unidad: 'K', decimales: 0, color: 'h' },
        y: { min: 0, max: 60, paso: 10, nombre: 'V', unidad: 'L', decimales: 0, color: 'i' },
        curvas: [
          { puntos: [[260, R * 260], [380, R * 380]], color: 'i', rotulo: '1 atm', desde: 1 },
          { puntos: [[260, R * 260 / 0.62], [380, R * 380 / 0.62]], color: 'i', rotulo: '0,62 atm', discontinua: true, desde: 3 },
        ],
        puntos: [
          { x: 273, y: R * 273, color: 'i', rotulo: '22,4 L', guias: true, desde: 2 },
          { x: 283, y: R * 283 / 0.62, color: 'i', rotulo: `${f(R * 283 / 0.62, 1)} L`, desde: 3 },
        ],
        alt: 'Volumen de 1 mol de gas contra temperatura: una recta para 1 atm (22,4 L a 273 K) y otra más alta para 0,62 atm (37,4 L a 283 K).',
      },
      voz: 'El volumen de un mol depende de dónde y cuándo lo mides.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Para 1 mol a 1 atm, el volumen crece en proporción a T.', ecuacion: [V, ' = ', { frac: [[n, 'R', T], P] }] },
        { estado: { corte: 2 }, texto: 'A 273 K y 1 atm (condiciones normales) da 22,4 L.', ecuacion: [V, ' = 0,082 · 273 / 1 = 22,4 L'] },
        { estado: { corte: 3 }, texto: 'A 0,62 atm, la misma cantidad ocupa más.', ecuacion: [V, ` = 0,082 · 283 / 0,62 = ${f(R * 283 / 0.62, 1)} L`] },
        { estado: { corte: 3 }, texto: 'Masa entre volumen da la densidad del gas.', ecuacion: ['ρ = ', { frac: [[P, 'M'], ['R', T]] }] },
      ],
    },
    regla: {
      texto: 'PV = nRT une presión, volumen, moles y temperatura. Un mol ocupa RT/P: 22,4 L solo a 273 K y 1 atm. Despejando, la densidad es ρ = PM/RT.',
      ecuacion: [{ llave: [P], nota: 'absoluta', color: 'c-o' }, V, ' = ', n, 'R', { llave: [T], nota: 'en kelvin', color: 'c-h' }, '   ·   ', 'ρ = ', { frac: [[P, 'M'], ['R', T]] }],
      condicion: 'gas ideal (presión baja, lejos de condensar), T en kelvin, P absoluta y R = 0,082 atm·L/(mol·K).',
      voz: 'El 22,4 trae sus condiciones pegadas. Revísalas.',
    },
    ahoraTu: {
      voz: 'Despeja primero, reemplaza después.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        const p = r.de([0.5, 0.62, 0.8, 1.5, 2]), t = r.de([273, 283, 300, 320, 350]);
        if (tipo === 0) {
          const nn = r.de([0.5, 1, 2, 3]), v = nn * R * t / p;
          return {
            pregunta: ['¿Qué volumen ocupan ', n, ` = ${f(nn, 1)} mol de gas a `, P, ` = ${f(p, 2)} atm y `, T, ` = ${t} K?`],
            opciones: opciones(v, [
              { id: 'cn', valor: nn * 22.4, error: 'ES5', siFuera: '22,4 L por mol vale a 273 K y 1 atm. Aquí las condiciones son otras.' },
              { id: 'por', valor: nn * R * t * p, error: 'QM-PV-DESPEJE', siFuera: 'Eso multiplica por la presión; al despejar V, P divide.' },
              { id: 'celsius', valor: nn * R * (t - 273) / p || -1, error: 'QM-CELSIUS', siFuera: 'Eso usa grados Celsius. La ecuación pide kelvin.' },
            ], x => `${f(x, 1)} L`),
            solucion: { texto: 'Se despeja V de PV = nRT.', ecuacion: [V, ` = ${f(nn, 1)} · 0,082 · ${t} / ${f(p, 2)} = ${f(v, 1)} L`] },
          };
        }
        const gas = r.de([['CO₂', 44], ['O₂', 32], ['N₂', 28], ['CH₄', 16], ['He', 4]]), rho = p * gas[1] / (R * t);
        if (tipo === 1) return {
          pregunta: [`¿Cuál es la densidad del ${gas[0]} (${gas[1]} g/mol) a `, P, ` = ${f(p, 2)} atm y `, T, ` = ${t} K?`],
          opciones: opciones(rho, [
            { id: 'cn', valor: gas[1] / 22.4, error: 'ES5', siFuera: 'Eso usa 22,4 L/mol, que vale solo a 273 K y 1 atm.' },
            { id: 'inv', valor: R * t / (p * gas[1]), error: 'QM-PV-DESPEJE', siFuera: 'Eso invierte la fórmula: la densidad crece con M y con P.' },
            { id: 'sin-p', valor: gas[1] / (R * t), error: 'QM-SIN-P', siFuera: 'Eso olvida la presión; sería cierto solo a 1 atm.' },
          ], x => `${f(x, 2)} g/L`),
          solucion: { texto: 'Densidad de un gas ideal.', ecuacion: [`ρ = ${f(p, 2)} · ${gas[1]} / (0,082 · ${t}) = ${f(rho, 2)} g/L`] },
        };
        return {
          pregunta: [`Un gas tiene densidad ${f(rho, 3)} g/L a `, P, ` = ${f(p, 2)} atm y `, T, ` = ${t} K. ¿Cuál es su masa molar?`],
          opciones: opciones(gas[1], [
            { id: 'cn', valor: rho * 22.4, error: 'ES5', siFuera: 'Eso usa 22,4 L/mol; aquí no son condiciones normales.' },
            { id: 'inv', valor: p / (rho * R * t), error: 'QM-PV-DESPEJE', siFuera: 'Eso invierte el despeje: M = ρRT/P.' },
            { id: 'sin-p', valor: rho * R * t, error: 'QM-SIN-P', siFuera: 'Eso olvida dividir entre la presión.' },
          ], x => `${f(x, 1)} g/mol`),
          solucion: { texto: 'Se despeja M de ρ = PM/RT.', ecuacion: [`M = ${f(rho, 3)} · 0,082 · ${t} / ${f(p, 2)} = ${f(gas[1], 1)} g/mol`] },
        };
      },
    },
  };

  // ---------- Idea 3: cada gas empuja como si estuviera solo (Dalton y Amagat) ----------
  // Cambia: cuántas partículas de N₂ y de O₂ hay · Permanece: caja rígida, misma T · Progresa: la presión total crece con
  // cada partícula, sea del gas que sea · Se reserva: el He que se agrega sin tocar la presión del N₂ · Debe verse: que
  // cada partícula aporta lo mismo.
  const K = 0.1;                                                  // atm por partícula-modelo en esta caja y esta T
  const mezcla = (a, b, he = 0, extra = {}) => lupa([{ titulo: 'Caja rígida', forma: 'caja', particulas: [{ e: 'N2', n: a }, { e: 'O2', n: b }, { e: 'He', n: he, desde: extra.heDesde || 0 }],
    cuenta: [{ e: 'N2', texto: `${f(a * K, 1)} atm` }, { e: 'O2', texto: `${f(b * K, 1)} atm` }].concat(he ? [{ e: 'He', texto: `${f(he * K, 1)}`, desde: extra.heDesde || 0 }] : []) }]);
  const dalton = {
    id: 'presiones-parciales',
    titulo: 'Cada gas empuja por su cuenta',
    temas: ['Mezclas: Dalton y Amagat'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'En esta caja rígida, a T fija, cada partícula aporta 0,1 atm. Agrega N₂ y O₂ y lee la presión de cada gas.',
      voz: 'Compara lo que aporta una partícula de N₂ con una de O₂.',
      controles: [
        { id: 'a', etiqueta: 'N₂', min: 1, max: 8, paso: 1, inicio: 6, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'O₂', min: 1, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: val => mezcla(val.a, val.b),
      lectura: val => [{ sub: [P, 'total'] }, ` = ${f(val.a * K, 1)} + ${f(val.b * K, 1)} = ${f((val.a + val.b) * K, 1)} atm`],
      minimo: 3,
    },
    predice: {
      pregunta: ['La caja tiene 0,6 atm de N₂ y 0,2 atm de O₂. Se agregan 2 partículas de He, sin cambiar V ni T. ¿Qué pasa con la presión del N₂?'],
      voz: 'Piensa en los choques del N₂ contra las paredes.',
      opciones: [
        { id: 'c', texto: 'Sigue en 0,6 atm; sube la presión total', correcta: true },
        { id: 'baja', texto: 'Baja, porque ahora es menor parte de la mezcla', error: 'QM-DALTON-FRACCION', siFuera: 'Su fracción baja, cierto. Bajaría su presión si la total no subiera, a P fija.' },
        { id: 'sube', texto: 'Sube, porque el He lo comprime', error: 'QM-DALTON-EMPUJE', siFuera: 'Subiría si el volumen se achicara. En caja rígida, el N₂ choca igual que antes.' },
      ],
      dibujo: mezcla(6, 2),
      revelar: mezcla(6, 2, 2),
      coincide: 'Coincide: el N₂ choca igual; la total pasa a 1 atm.',
      noCoincide: 'El N₂ tiene las mismas partículas en el mismo volumen: sigue en 0,6 atm.',
    },
    mira: {
      datos: mezcla(6, 2, 2, { heDesde: 3 }).datos,
      voz: 'Sumemos presiones gas por gas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El N₂ solo, en esta caja, empujaría 0,6 atm.', ecuacion: [{ sub: [P, 'N₂'] }, ' = 0,6 atm'] },
        { estado: { corte: 1 }, texto: 'El O₂ solo empujaría 0,2 atm. Juntos, se suman.', ecuacion: [{ sub: [P, 'total'] }, ' = 0,6 + 0,2 = 0,8 atm'] },
        { estado: { corte: 2 }, texto: 'Cada presión parcial es la fracción molar por la total.', ecuacion: [{ sub: [P, 'N₂'] }, ' = ', { frac: ['6', '8'] }, ' · 0,8 = 0,6 atm'] },
        { estado: { corte: 3 }, texto: 'El He suma su parte; la del N₂ no cambia.', ecuacion: [{ sub: [P, 'total'] }, ' = 0,6 + 0,2 + 0,2 = 1 atm'] },
        { estado: { corte: 3 }, texto: 'A igual P y T, los volúmenes parciales también suman (Amagat).', ecuacion: [{ sub: [V, 'total'] }, ' = Σ', { sub: [V, 'i'] }] },
      ],
    },
    regla: {
      texto: 'En una mezcla de gases ideales, cada gas empuja como si estuviera solo en todo el recipiente. La presión total es la suma de las parciales.',
      ecuacion: [{ sub: [P, 'total'] }, ' = Σ', { sub: [P, 'i'] }, '   ·   ', { sub: [P, 'i'] }, ' = ', { sub: ['y', 'i'] }, ' · ', { sub: [P, 'total'] }, '   ·   ', { llave: [{ sub: ['y', 'i'] }], nota: 'fracción molar' }, ' = ', { frac: [{ sub: [n, 'i'] }, { sub: [n, 'total'] }] }],
      condicion: 'gases ideales que no reaccionan, a la misma T y en el mismo volumen. Amagat suma volúmenes a igual P y T.',
      voz: 'Cada gas se cuenta por separado y después se suma.',
    },
    ahoraTu: {
      voz: 'Calcula la fracción molar primero.',
      generar(s) {
        const r = azar(s), a = r.ent(1, 6), b = r.ent(1, 6), pt = r.de([1, 1.5, 2, 3, 4]);
        const gases = r.de([['N₂', 'O₂'], ['CH₄', 'CO₂'], ['He', 'Ar'], ['H₂', 'N₂']]), pa = a / (a + b) * pt;
        return {
          pregunta: [`Una mezcla tiene ${a} mol de ${gases[0]} y ${b} mol de ${gases[1]} a `, { sub: [P, 'total'] }, ` = ${f(pt, 1)} atm. ¿Cuál es la presión parcial del ${gases[0]}?`],
          opciones: opciones(pa, [
            { id: 'otro', valor: b / (a + b) * pt, error: 'QM-DALTON-FRACCION', siFuera: `Esa es la presión del ${gases[1]}. La fracción va con los moles del gas pedido.` },
            { id: 'mitad', valor: pt / 2, error: 'QM-DALTON-MITAD', siFuera: 'La mitad sería cierta si hubiera igual cantidad de los dos gases.' },
            { id: 'razon', valor: a / b * pt, error: 'QM-DALTON-FRACCION', siFuera: 'Eso divide entre los moles del otro gas; la fracción usa el total.' },
          ], x => `${f(x, 2)} atm`),
          solucion: { texto: `Fracción molar: ${a} de ${a + b}.`, ecuacion: [{ sub: [P, 'i'] }, ` = ${a}/${a + b} · ${f(pt, 1)} = ${f(pa, 2)} atm`] },
        };
      },
    },
  };

  // ---------- Idea 4: el más liviano escapa primero (Graham) ----------
  // Cambia: el gas · Permanece: el O₂ como referencia, misma P y T · Progresa: la rapidez relativa baja con la raíz de M ·
  // Se reserva: que la rapidez no es inversa a M sino a √M · Debe verse: la curva que no es recta.
  const GASES = { H2: ['H₂', 2], He: ['He', 4], CH4: ['CH₄', 16], N2: ['N₂', 28], O2: ['O₂', 32], CO2: ['CO₂', 44] };
  const curvaGraham = Array.from({ length: 48 }, (_, k) => { const M = 2 + k; return [M, Math.sqrt(32 / M)]; });
  const ejesGraham = extra => Object.assign({
    x: { min: 0, max: 50, paso: 10, nombre: 'M', unidad: 'g/mol', decimales: 0 },
    y: { min: 0, max: 4.5, paso: 1, nombre: 'rapidez frente al O₂', decimales: 0 },
    curvas: [{ puntos: curvaGraham, color: 'd' }],
    alt: 'Rapidez de efusión de un gas comparada con la del O₂, contra su masa molar: baja como 1 entre la raíz de M. El H₂ sale 4 veces más rápido; el CO₂, 0,85 veces.',
  }, extra);
  const graham = {
    id: 'graham',
    titulo: 'El más liviano escapa primero',
    temas: ['Difusión y efusión: Graham'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige un gas y compara qué tan rápido sale por un agujero pequeño frente al O₂, a la misma presión y temperatura.',
      voz: 'Mira cuánto cambia la rapidez entre gases livianos y pesados.',
      controles: [{ id: 'g', etiqueta: 'Gas', opciones: Object.keys(GASES).map(k => ({ valor: k, texto: GASES[k][0] })) }],
      dibujo: val => { const [nom, M] = GASES[val.g]; return { datos: ejesGraham({ puntos: [{ x: M, y: Math.sqrt(32 / M), color: 'd', rotulo: `${nom}: ${f(Math.sqrt(32 / M), 2)}`, guias: true }] }), estado: {} }; },
      lectura: val => { const [nom, M] = GASES[val.g]; return [val.g === 'O2' ? 'El O₂ es la referencia: rapidez 1' : `${nom} sale ${f(Math.sqrt(32 / M), 2)} veces lo que el O₂`]; },
      minimo: 3,
      // El punto se desliza por la curva: al soltarlo cae en el gas de masa molar más cercana (el control es de opciones).
      arrastres: [{ id: 'gas', etiqueta: 'gas sobre la curva', color: 'c-d',
        donde: val => { const g = Kit.piezas.ejes.geometria(ejesGraham({})), M = GASES[val.g][1]; return { x: g.X(M), y: g.Y(Math.sqrt(32 / M)) }; },
        mover: pt => {
          const g = Kit.piezas.ejes.geometria(ejesGraham({}));
          const M = 0 + (pt.x - g.X(0)) * 50 / (g.X(50) - g.X(0));
          return { g: Object.keys(GASES).reduce((a, b) => (Math.abs(GASES[b][1] - M) < Math.abs(GASES[a][1] - M) ? b : a)) };
        } }],
    },
    predice: {
      pregunta: ['El He (4 g/mol) y el CH₄ (16 g/mol) escapan por el mismo agujero, a igual P y T. ¿Cuántas veces más rápido sale el He?'],
      voz: 'La masa es cuatro veces; piensa si la rapidez también.',
      opciones: [
        { id: 'c', texto: '2 veces', correcta: true },
        { id: 'cuatro', texto: '4 veces', error: 'QM-GRAHAM-SIN-RAIZ', siFuera: 'Así sería si la rapidez fuera inversa a M. Es inversa a la raíz de M.' },
        { id: 'mitad', texto: 'La mitad: el He sale más lento', error: 'GQ11', siFuera: 'Eso pasaría si el más pesado fuera más rápido. A igual T, el liviano se mueve más rápido.' },
        { id: 'igual', texto: 'Igual de rápido', error: 'GQ9', siFuera: 'Tienen la misma energía media, cierto. Con menos masa, el He necesita más rapidez.' },
      ],
      dibujo: { datos: ejesGraham({ curvas: [], puntos: [{ x: 4, y: 0.2, color: 'd', rotulo: 'He' }, { x: 16, y: 0.2, color: 'd', rotulo: 'CH₄' }] }), estado: {} },
      revelar: { datos: ejesGraham({ puntos: [{ x: 4, y: Math.sqrt(8), color: 'd', rotulo: 'He: 2,83', guias: true }, { x: 16, y: Math.sqrt(2), color: 'd', rotulo: 'CH₄: 1,41', guias: true }] }), estado: {} },
      coincide: 'Coincide: 2,83 / 1,41 = 2, la raíz de 16/4.',
      noCoincide: 'La razón de rapideces es la raíz de 16/4: 2 veces.',
    },
    mira: {
      datos: ejesGraham({ puntos: [
        { x: 32, y: 1, color: 'd', rotulo: 'O₂: 1', desde: 1 },
        { x: 2, y: 4, color: 'd', rotulo: 'H₂: 4', guias: true, desde: 2 },
        { x: 44, y: Math.sqrt(32 / 44), color: 'd', rotulo: `CO₂: ${f(Math.sqrt(32 / 44), 2)}`, desde: 3 },
      ] }),
      voz: 'Comparemos tres gases con el O₂.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El O₂ es la referencia: su rapidez vale 1.', ecuacion: ['M = 32 g/mol'] },
        { estado: { corte: 2 }, texto: 'El H₂ tiene 16 veces menos masa y sale 4 veces más rápido.', ecuacion: [{ frac: [{ sub: ['v', 'H₂'] }, { sub: ['v', 'O₂'] }] }, ' = ', { raiz: { frac: ['32', '2'] } }, ' = 4'] },
        { estado: { corte: 3 }, texto: 'El CO₂, más pesado que el O₂, sale algo más lento.', ecuacion: [{ frac: [{ sub: ['v', 'CO₂'] }, { sub: ['v', 'O₂'] }] }, ' = ', { raiz: { frac: ['32', '44'] } }, ` = ${f(Math.sqrt(32 / 44), 2)}`] },
      ],
    },
    regla: {
      texto: 'A igual presión y temperatura, la rapidez de efusión es inversa a la raíz de la masa molar: el gas más liviano sale antes.',
      ecuacion: [{ llave: [{ frac: [{ sub: ['v', '1'] }, { sub: ['v', '2'] }] }], nota: 'rapideces' }, ' = ', { llave: [{ raiz: { frac: [{ sub: ['M', '2'] }, { sub: ['M', '1'] }] } }], nota: 'masas molares' }, '   ·   ', { frac: [{ sub: ['t', '1'] }, { sub: ['t', '2'] }] }, ' = ', { raiz: { frac: [{ sub: ['M', '1'] }, { sub: ['M', '2'] }] } }],
      condicion: 'efusión por un orificio pequeño, a la misma P y T; la difusión real también depende de choques y corrientes.',
      voz: 'La raíz no se olvida: masa cuatro veces, rapidez dos.',
    },
    ahoraTu: {
      voz: 'Arma la razón con la raíz.',
      generar(s) {
        const PARES = [['H₂', 2, 'O₂', 32], ['He', 4, 'CH₄', 16], ['He', 4, 'O₂', 32], ['CH₄', 16, 'SO₂', 64], ['H₂', 2, 'CH₄', 16], ['He', 4, 'SO₃', 80], ['O₂', 32, 'HI', 128]];
        const [a, Ma, b, Mb] = PARES[s % PARES.length], raz = Math.sqrt(Mb / Ma);
        return {
          pregunta: [`A igual P y T, ¿cuántas veces más rápido escapa el ${a} (${Ma} g/mol) que el ${b} (${Mb} g/mol)?`],
          opciones: opciones(raz, [
            { id: 'sin-raiz', valor: Mb / Ma, error: 'QM-GRAHAM-SIN-RAIZ', siFuera: 'Eso usa la razón de masas sin raíz.' },
            { id: 'invertida', valor: Math.sqrt(Ma / Mb), error: 'GQ11', siFuera: 'Eso pone al gas pesado como el más rápido.' },
            { id: 'mitad', valor: Mb / Ma / 2, error: 'QM-GRAHAM-SIN-RAIZ', siFuera: 'Eso divide la razón entre 2; la relación es una raíz cuadrada.' },
          ], x => `${f(x, 2)} veces`),
          solucion: { texto: 'Rapidez inversa a la raíz de M.', ecuacion: [{ frac: [{ sub: ['v', a] }, { sub: ['v', b] }] }, ' = ', { raiz: { frac: [String(Mb), String(Ma)] } }, ` = ${f(raz, 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: gas que sale de una reacción ----------
  // Cambia: los gramos de Zn y las condiciones · Permanece: Zn + 2 HCl → ZnCl₂ + H₂ · Progresa: masa → mol → mol de gas →
  // volumen con PV = nRT · Se reserva: que el último paso usa las condiciones del enunciado · Debe verse: la cadena completa.
  const COND = { cn: ['273 K y 1 atm', 273, 1], amb: ['298 K y 1 atm', 298, 1], jul: ['Juliaca: 283 K y 0,62 atm', 283, 0.62] };
  const cadena = (gZn, c, extra = {}) => {
    const [txt, t, p] = COND[c], nn = gZn / 65, v = nn * R * t / p;
    return { datos: { columnas: [{ titulo: 'Zn + 2 HCl → ZnCl₂ + H₂', nodos: [
      { texto: `${f(gZn, 1)} g de Zn`, color: 'o', desde: extra.d ? 1 : 0 },
      { texto: `÷ 65 g/mol = ${f(nn, 2)} mol de Zn`, color: 'd', desde: extra.d ? 2 : 0 },
      { texto: `1 : 1 → ${f(nn, 2)} mol de H₂`, color: 'd', desde: extra.d ? 3 : 0 },
      { texto: `a ${txt}: ${f(v, 2)} L de H₂`, color: 'i', desde: extra.d ? 4 : 0 },
    ] }] }, estado: {} };
  };
  const reaccion = {
    id: 'gas-de-reaccion',
    titulo: 'El gas de una reacción',
    temas: ['Estequiometría con gases'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'El zinc reacciona con ácido y desprende H₂. Elige cuántos gramos de Zn y en qué condiciones se mide el gas.',
      voz: 'Sigue la cadena: gramos, moles, receta, litros.',
      controles: [
        { id: 'z', etiqueta: 'Zn', min: 6.5, max: 32.5, paso: 6.5, inicio: 13, unidad: 'g', decimales: 1 },
        { id: 'c', etiqueta: 'Condiciones', opciones: Object.keys(COND).map(k => ({ valor: k, texto: COND[k][0] })) },
      ],
      dibujo: val => cadena(val.z, val.c),
      lectura: val => { const [, t, p] = COND[val.c], v = val.z / 65 * R * t / p; return [V, ` = ${f(v, 2)} L de H₂`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se forman 2 mol de H₂ y se recogen en Juliaca, a 283 K y 0,62 atm. ¿Qué ', V, ' ocupan?'],
      voz: 'Revisa en qué condiciones se mide el gas.',
      opciones: [
        { id: 'c', texto: `${f(2 * R * 283 / 0.62, 1)} L`, correcta: true },
        { id: 'cn', texto: '44,8 L', error: 'ES5', siFuera: '44,8 L sería a 273 K y 1 atm. En Juliaca la presión es menor y el gas ocupa más.' },
        { id: 'un-mol', texto: `${f(R * 283 / 0.62, 1)} L`, error: 'QM-SIN-N', siFuera: 'Ese es el volumen de 1 mol; aquí hay 2.' },
        { id: 'por', texto: `${f(2 * R * 283 * 0.62, 1)} L`, error: 'QM-PV-DESPEJE', siFuera: 'Eso multiplica por la presión; V = nRT/P.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: 'Gas recogido', nodos: [{ texto: '2 mol de H₂', color: 'd' }, { texto: 'a 283 K y 0,62 atm: ¿V?', color: 'i' }] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'Gas recogido', nodos: [{ texto: '2 mol de H₂', color: 'd' }, { texto: `a 283 K y 0,62 atm: ${f(2 * R * 283 / 0.62, 1)} L`, color: 'i' }] }] }, estado: {} },
      coincide: `Coincide: V = 2 · 0,082 · 283 / 0,62 ≈ ${f(2 * R * 283 / 0.62, 1)} L.`,
      noCoincide: `Con PV = nRT en esas condiciones: ${f(2 * R * 283 / 0.62, 1)} L.`,
    },
    mira: {
      datos: cadena(13, 'jul', { d: true }).datos,
      voz: 'Paso a paso, sin saltarse la receta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se pesan 13 g de zinc.', ecuacion: ['m = 13 g'] },
        { estado: { corte: 2 }, texto: 'A moles: 13 g entre 65 g/mol.', ecuacion: [n, ' = 13 / 65 = 0,2 mol'] },
        { estado: { corte: 3 }, texto: 'La receta da 1 H₂ por cada Zn.', ecuacion: [{ sub: [n, 'H₂'] }, ' = 0,2 mol'] },
        { estado: { corte: 4 }, texto: 'El volumen sale de PV = nRT con las condiciones dadas.', ecuacion: [V, ` = 0,2 · 0,082 · 283 / 0,62 = ${f(0.2 * R * 283 / 0.62, 2)} L`] },
      ],
    },
    regla: {
      texto: 'Con gases, la receta da los moles del gas; el volumen se calcula después con PV = nRT en las condiciones en que se mide.',
      ecuacion: [{ sub: [n, 'gas'] }, ' = ', { sub: [n, 'A'] }, ' · ', { llave: [{ frac: [{ sub: ['ν', 'gas'] }, { sub: ['ν', 'A'] }] }], nota: 'coeficientes' }, '   ·   ', V, ' = ', { frac: [[n, 'R', T], P] }],
      condicion: '22,4 L/mol solo si el gas se mide a 273 K y 1 atm; si no, la ecuación de estado.',
      voz: 'Separa la cantidad que se forma del espacio que ocupa.',
    },
    ahoraTu: {
      voz: 'Primero los moles de gas, después el volumen.',
      generar(s) {
        const r = azar(s);
        const RX = [['CaCO₃ → CaO + CO₂', 'CaCO₃', 100, 'CO₂', 1], ['Zn + 2 HCl → ZnCl₂ + H₂', 'Zn', 65, 'H₂', 1], ['2 KClO₃ → 2 KCl + 3 O₂', 'KClO₃', 122.5, 'O₂', 1.5]][s % 3];
        const [ec, a, Ma, gas, raz] = RX, k = r.ent(1, 4), mA = Ma * k / (RX[4] === 1.5 ? 1 : 2);
        const nA = mA / Ma, ng = nA * raz, [txt, t, p] = COND[r.de(['amb', 'jul', 'cn'])], v = ng * R * t / p;
        return {
          pregunta: [`En ${ec}, reaccionan ${f(mA, 1)} g de ${a} (${f(Ma, 1)} g/mol). ¿Qué volumen de ${gas} se recoge a ${txt}?`],
          opciones: opciones(v, [
            { id: 'cn', valor: ng * 22.4, error: 'ES5', siFuera: '22,4 L por mol vale solo a 273 K y 1 atm.' },
            { id: 'sin-receta', valor: nA * R * t / p, error: 'ES8', siFuera: 'Eso olvida la receta: los moles de gas no son los del reactivo.' },
            { id: 'por', valor: ng * R * t * p, error: 'QM-PV-DESPEJE', siFuera: 'Eso multiplica por la presión; V = nRT/P.' },
          ], x => `${f(x, 2)} L`),
          solucion: { texto: `${f(nA, 2)} mol de ${a} dan ${f(ng, 2)} mol de ${gas}.`, ecuacion: [V, ` = ${f(ng, 2)} · 0,082 · ${t} / ${f(p, 2)} = ${f(v, 2)} L`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Cilindro de 6 L como máximo; una bolita cada 0,05 mol (hasta 12). La presión va en el rótulo de la caja.
  const labCilindro = val => lupa([{ titulo: `${f(val.n, 2)} mol a ${f(val.t, 0)} K`, forma: 'cilindro', nivel: val.v / 6,
    particulas: [{ e: 'N2', n: Math.round(val.n / 0.05) }], rotulo: `${f(val.v, 1)} L · ${f(val.n * R * val.t / val.v, 2)} atm` }]);
  // Mezcla: cada partícula es 0,01 mol a 300 K, así que aporta 0,246 atm·L; la presión parcial es eso entre V.
  const KP = 0.01 * R * 300;
  const labMezcla = val => lupa([{ titulo: `Mezcla en ${f(val.v, 1)} L`, forma: 'cilindro', nivel: val.v / 4,
    particulas: [{ e: 'N2', n: val.a }, { e: 'O2', n: val.b }, { e: 'He', n: val.c }],
    cuenta: [['N2', val.a], ['O2', val.b], ['He', val.c]].filter(([, k]) => k > 0).map(([e, k]) => ({ e, texto: `${f(k * KP / val.v, 2)} atm` })) }], { alto: 170 });

  return {
    unidad: 'quimica.gases',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/quim-cadena.js'],
    historia: {
      texto: 'Comprimir aire permitió estudiar algo invisible con medidas que se repiten. Un manuscrito de Robert Boyle de 1661, guardado por la Royal Society, anota cuánto se comprimía el aire y la presión del mercurio. Esa relación todavía no era la ecuación de los gases. Otros trabajos sumaron después la temperatura y la cantidad. Siempre conviene preguntar qué se dejó fijo en cada ensayo.',
      pregunta: '¿Qué tendrías que dejar fijo para comparar dos medidas?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §9.2', url: 'https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law' },
    },
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera junta n, V y T con rangos más amplios que las
    // ideas (llega a presiones altas y a 100 K); la segunda junta Dalton con el émbolo: tres gases y un volumen que cambia.
    // El título y el rótulo de cada caja dicen sus condiciones, para que una miniatura guardada se lea sola.
    laboratorio: [
      {
        id: 'cilindro-completo', titulo: 'El cilindro con todo', pieza: 'quim-particulas',
        consigna: 'Cambia la cantidad de gas, el volumen y la temperatura. Empuja el émbolo y busca la presión más alta y la más baja.',
        controles: [
          { id: 'n', etiqueta: 'n', color: 'c-d', min: 0.05, max: 0.6, paso: 0.05, inicio: 0.2, unidad: 'mol', decimales: 2 },
          { id: 'v', etiqueta: 'V', color: 'c-i', min: 0.5, max: 6, paso: 0.5, inicio: 4, unidad: 'L', decimales: 1 },
          { id: 't', etiqueta: 'T', color: 'c-h', min: 100, max: 600, paso: 50, inicio: 300, unidad: 'K', decimales: 0 },
        ],
        dibujo: val => labCilindro(val),
        lectura: val => [`${f(val.n, 2)} mol · ${f(val.v, 1)} L · ${f(val.t, 0)} K → `, P, ` = ${f(val.n * R * val.t / val.v, 2)} atm`],
        arrastres: [{ id: 'embolo', etiqueta: 'émbolo del cilindro', color: 'c-i',
          donde: val => embolo(labCilindro(val)),
          mover: (pt, val) => ({ v: nivelEn(labCilindro(val), pt.y) * 6 }) }],
      },
      {
        id: 'mezcla-embolo', titulo: 'Tres gases bajo el émbolo', pieza: 'quim-particulas',
        consigna: 'A 300 K, cada partícula es 0,01 mol. Agrega N₂, O₂ y He y mueve el émbolo: mira la presión de cada gas.',
        controles: [
          { id: 'a', etiqueta: 'N₂', min: 0, max: 10, paso: 1, inicio: 6, unidad: '', decimales: 0 },
          { id: 'b', etiqueta: 'O₂', min: 0, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0 },
          { id: 'c', etiqueta: 'He', min: 0, max: 6, paso: 1, inicio: 0, unidad: '', decimales: 0 },
          { id: 'v', etiqueta: 'V', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'L', decimales: 1 },
        ],
        dibujo: val => labMezcla(val),
        lectura: val => [`${val.a} N₂ + ${val.b} O₂ + ${val.c} He en ${f(val.v, 1)} L → `, { sub: [P, 'total'] }, ` = ${f((val.a + val.b + val.c) * KP / val.v, 2)} atm`],
        arrastres: [{ id: 'embolo', etiqueta: 'émbolo del cilindro', color: 'c-i',
          donde: val => embolo(labMezcla(val)),
          mover: (pt, val) => ({ v: nivelEn(labMezcla(val), pt.y) * 4 }) }],
      },
    ],
    ideas: [leyes, estado, dalton, graham, reaccion],
  };
});
