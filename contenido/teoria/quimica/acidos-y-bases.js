/*
 * Teoría de «Ácidos y bases» (quimica.acidos-y-bases). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 14), historia-ecuaciones-2.pdf y las precisiones de
 * Química del expediente: «diluir diez veces sube 1 de pH» vale solo para ácido fuerte lejos del agua; el pH de un
 * ácido diluido con agua nunca pasa a básico; el pH de equivalencia no siempre es 7.
 * Errores: docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md (AB); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: decidir quién da el protón, separar fuerza de concentración y calcular pH sin recetas ciegas.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: nombra el par conjugado de una especie nueva, calcula el pH de un ácido fuerte o débil,
 *     predice cuánto cambia al diluir y el volumen de base en la equivalencia.
 *   Orden de atención: 1.º la figura (protón, partículas, escala, curva) · 2.º la lectura en vivo · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿fuerte es concentrado?, ¿diluir siempre sube 1?, ¿neutralizar deja pH 7?
 *
 * Colores (regla 4): concentración C turquesa c-i, pH rojo c-h, volumen V naranja c-o, Ka (y Kb, Kw) verde c-d.
 * En la figura de moléculas, el protón que pasa va en naranja (es el mismo H⁺ en las dos filas).
 * Todo pH se calcula con el balance de cargas completo (incluye el agua), no con la aproximación: así se ve cuándo
 * la aproximación falla. Ka de OpenStax Chemistry 2e, apéndice H: CH₃COOH 1,8 × 10⁻⁵; HF 7,2 × 10⁻⁴. Kw = 1,0 × 10⁻¹⁴ (25 °C).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §14.2 y §14.3; IUPAC Gold Book, pH.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const fp = n => Kit.formatear(n, 2).replace(/^(−?\d+)$/, '$1,00').replace(/,(\d)$/, ',$10');   // pH siempre con dos decimales
  const C = { v: 'c-i', t: 'C' }, pH = { v: 'c-h', t: 'pH' }, V = { v: 'c-o', t: 'V' };
  const Ka = { sub: [{ v: 'c-d', t: 'K' }, 'a'] }, Kb = { sub: [{ v: 'c-d', t: 'K' }, 'b'] }, Kw = { sub: [{ v: 'c-d', t: 'K' }, 'w'] };
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
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const exp = e => String(e).split('').map(c => SUP[c]).join('');
  function cien(x, d = 1) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${exp(e)}`;
  }

  // ---------- Química del pH (balance de cargas con el agua) ----------
  const KW = 1e-14, KA = { acetico: 1.8e-5, hf: 7.2e-4 };
  // Raíz de g(h) creciente en h, buscada en log10 h ∈ [−14, 1].
  function raiz(g) {
    let a = -14, b = 1;
    for (let k = 0; k < 80; k++) { const m = (a + b) / 2; if (g(10 ** m) > 0) b = m; else a = m; }
    return 10 ** ((a + b) / 2);
  }
  // [H₃O⁺] de un ácido de concentración c (Ka = Infinity: fuerte), con Na⁺ de base fuerte opcional.
  const hAcido = (c, ka, na = 0) => raiz(h => h + na - KW / h - (ka === Infinity ? c : c * ka / (ka + h)));
  const pHde = h => -Math.log10(h);
  const alfa = (c, ka) => { if (ka === Infinity) return 1; const h = hAcido(c, ka); return (c * ka / (ka + h)) / c; };

  // ---------- Idea 1: el ácido da un protón, la base lo recibe ----------
  // Cambia: el par de sustancias · Permanece: reactivos arriba, productos abajo, el protón en naranja · Progresa: de
  // ácido y base a sus conjugados · Se reserva: el agua que hace de ácido con el amoníaco · Debe verse: a quién pasa el H⁺.
  const PARES = {
    hcl: { texto: 'HCl + H₂O', a: 'Cl', b: 'H₂O', ac: 'Cl⁻', bc: 'OH₂⁺', lee: 'El HCl da un H⁺ al agua: HCl es el ácido.' },
    nh3: { texto: 'NH₃ + H₂O', a: 'OH', b: 'NH₃', ac: 'OH⁻', bc: 'NH₃⁺', lee: 'El agua da un H⁺ al NH₃: aquí el agua es ácido.' },
    acetico: { texto: 'CH₃COOH + H₂O', a: 'CH₃COO', b: 'H₂O', ac: 'CH₃COO⁻', bc: 'OH₂⁺', lee: 'El CH₃COOH da un H⁺ al agua: es el ácido.' },
    lewis: { texto: 'BF₃ + NH₃', lewis: true, lee: 'Sin protón: el NH₃ da un par de electrones. Base de Lewis.' },
  };
  function parDibujo(k, corte = 0, rot = true) {
    const P = PARES[k];
    if (P.lewis) {
      return { datos: { escala: 44, alto: 200,
        atomos: [{ id: 'b', t: 'BF₃', x: 0, y: 0 }, { id: 'n', t: 'NH₃', x: 2.6, y: 0, color: 'i' }, { id: 'b2', t: 'F₃B', x: 0.6, y: 1.8 }, { id: 'n2', t: 'NH₃', x: 2.2, y: 1.8, color: 'i' }],
        enlaces: [{ a: 'b2', b: 'n2' }], pares: [{ en: 'n', ang: 180 }],
        textos: [{ x: 1.3, y: 0, t: '+' }, { x: 3.6, y: 0.9, t: '↓' }, ...(rot ? [{ x: 0, y: 0.75, t: 'ácido de Lewis', color: 'h' }, { x: 2.6, y: 0.75, t: 'base de Lewis', color: 'i' }] : [])],
        flechas: [{ de: [2.05, 0], a: [0.6, 0], color: 'o' }],
        alt: 'El NH₃ usa su par libre para unirse al BF₃: se forma F₃B–NH₃ sin pasar ningún protón.' }, estado: { corte } };
    }
    return { datos: { escala: 50, alto: 230,
      atomos: [{ id: 'a', t: P.a, x: 0, y: 0 }, { id: 'h', t: 'H', x: 1.15, y: 0, color: 'o' }, { id: 'b', t: P.b, x: 3.4, y: 0 },
        { id: 'a2', t: P.ac, x: 0.1, y: 1.9, desde: 2 }, { id: 'h2', t: 'H', x: 2.5, y: 1.9, color: 'o', desde: 2 }, { id: 'b2', t: P.bc, x: 3.6, y: 1.9, desde: 2 }],
      enlaces: [{ a: 'a', b: 'h' }, { a: 'h2', b: 'b2', desde: 2 }],
      textos: [{ x: 2.3, y: 0, t: '+' }, { x: 1.35, y: 1.9, t: '+', desde: 2 }, { x: 1.7, y: 0.95, t: '↓', desde: 1 }],
      flechas: [{ de: [1.3, -0.5], a: [3.1, -0.5], color: 'o', desde: 1 }],
      resaltos: rot ? [{ atomos: ['a', 'h', 'a2'], texto: 'par 1', color: 'h', desde: 3 }, { atomos: ['b', 'b2'], texto: 'par 2', color: 'i', desde: 4 }] : [],
      alt: `${P.texto}: el H⁺ pasa del ${P.a}H al ${P.b}; quedan ${P.ac} y H–${P.bc}.` }, estado: { corte } };
  }
  // Animación (ronda 5): el traspaso en cámara lenta, en una sola fila y en un ciclo de 4 s. Hasta 1 s, el ácido entero;
  // de 1 a 2,5 s, el H⁺ viaja en línea recta hasta la base; después quedan los conjugados. En Lewis, el NH₃ se acerca
  // con su par libre y se une al BF₃. Es un esquema del orden de los hechos: el traspaso real dura mucho menos.
  const SALE = 1, LLEGA = 2.5;
  const QUIEN = { hcl: ['HCl', 'H₂O', 'HCl dio el H⁺: es el ácido.'], nh3: ['H₂O', 'NH₃', 'El agua dio el H⁺: aquí es ácido.'],
    acetico: ['CH₃COOH', 'H₂O', 'CH₃COOH dio el H⁺: es el ácido.'], lewis: ['NH₃', 'BF₃', 'NH₃ dio su par: base de Lewis.'] };
  const avance = t => Math.min(1, Math.max(0, (t - SALE) / (LLEGA - SALE)));
  function traspaso(k, t) {
    const P = PARES[k], q = avance(t);
    if (P.lewis) {
      const unido = t >= LLEGA, xn = 2.6 - 1.2 * q;
      return { datos: { escala: 44, alto: 130,
        atomos: [{ id: 'b', t: unido ? 'F₃B' : 'BF₃', x: 0, y: 0 }, { id: 'n', t: 'NH₃', x: xn, y: 0, color: 'i' }],
        enlaces: unido ? [{ a: 'b', b: 'n' }] : [], pares: unido ? [] : [{ en: 'n', ang: 180 }],
        flechas: [{ de: [2.6, -0.8], a: [0.6, -0.8], color: 'o' }],
        alt: unido ? 'El NH₃ ya se unió al BF₃ con su par de electrones: F₃B–NH₃, sin pasar ningún protón.' : 'El NH₃ se acerca al BF₃ con su par libre por delante.' }, estado: {} };
    }
    const vuela = t >= SALE && t < LLEGA, llego = t >= LLEGA, xh = 1.15 + (2.3 - 1.15) * q;
    return { datos: { escala: 50, alto: 130,
      atomos: [{ id: 'a', t: t < SALE ? P.a : P.ac, x: 0, y: 0 }, { id: 'h', t: vuela ? 'H⁺' : 'H', x: xh, y: 0, color: 'o' }, { id: 'b', t: llego ? P.bc : P.b, x: 3.4, y: 0 }],
      enlaces: t < SALE ? [{ a: 'a', b: 'h' }] : llego ? [{ a: 'h', b: 'b' }] : [],
      textos: t < SALE ? [{ x: 2.3, y: 0, t: '+' }] : llego ? [{ x: 1.15, y: 0, t: '+' }] : [],
      flechas: [{ de: [1.3, -0.8], a: [3.1, -0.8], color: 'o' }],
      alt: `${P.texto}: ${t < SALE ? `el H⁺ todavía está en el ${P.a}H` : vuela ? `el H⁺ va del ${P.a} al ${P.b}` : `quedan ${P.ac} y H–${P.bc}`}.` }, estado: {} };
  }
  const leeTraspaso = (k, t) => {
    const [da, recibe, fin] = QUIEN[k], s = `${f(t, 1)} s · `;
    if (k === 'lewis') return [s + (t < LLEGA ? `el ${da} acerca su par al ${recibe}` : fin)];
    return [s + (t < SALE ? `el ${da} tiene el H⁺` : t < LLEGA ? `el H⁺ va del ${da} al ${recibe}` : fin)];
  };
  const proton = {
    id: 'acido-da-proton',
    titulo: 'El ácido da, la base recibe',
    temas: ['Teorías de Arrhenius, Brønsted-Lowry y Lewis', 'Pares conjugados y fuerza relativa'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'En cámara lenta, el H⁺ naranja salta de una sustancia a otra. Elige el par y mira quién lo da y quién lo recibe.',
      voz: 'Sigue al protón; el nombre de la sustancia viene después.',
      controles: [
        { id: 'k', etiqueta: 'Par', opciones: Object.keys(PARES).map(k => ({ valor: k, texto: PARES[k].texto })) },
        { id: 't', etiqueta: 't', min: 0, max: 4, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
      ],
      dibujo: val => traspaso(val.k, val.t),
      lectura: val => leeTraspaso(val.k, val.t),
      minimo: 3,
    },
    predice: {
      pregunta: 'En NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, ¿qué papel cumple el agua?',
      voz: 'Mira quién se queda con el protón.',
      opciones: [
        { id: 'c', texto: 'Ácido: le da un H⁺ al NH₃', correcta: true },
        { id: 'base', texto: 'Base, como en todas las reacciones', error: 'QM-AGUA-FIJA', siFuera: 'Con HCl el agua sí es base. Con NH₃ es al revés: el agua entrega el protón.' },
        { id: 'oh', texto: 'Base, porque tiene OH', error: 'AB1', siFuera: 'Arrhenius mira el OH⁻ en agua. Brønsted mira quién da el H⁺: aquí lo da el agua.' },
        { id: 'nada', texto: 'Ninguno: solo disuelve al NH₃', error: 'QM-AGUA-NEUTRA', siFuera: 'Disolver sería si el NH₃ quedara entero. Aquí aparece NH₄⁺: hubo traspaso de un protón.' },
      ],
      dibujo: parDibujo('nh3', 0, false),
      revelar: parDibujo('nh3', 4, true),
      coincide: 'Coincide: el agua cede el H⁺ y queda como OH⁻.',
      noCoincide: 'El H⁺ sale del agua y llega al NH₃: aquí el agua es el ácido.',
    },
    mira: {
      datos: parDibujo('hcl', 0, true).datos,
      voz: 'Revisemos el protón y los dos pares, uno por uno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El HCl entrega su H⁺ al agua.', ecuacion: ['HCl + H₂O → Cl⁻ + H₃O⁺'] },
        { estado: { corte: 2 }, texto: 'El H⁺ queda unido al agua: se forma H₃O⁺.', ecuacion: ['H⁺ + H₂O → H₃O⁺'] },
        { estado: { corte: 3 }, texto: 'HCl y Cl⁻ difieren en un H⁺: son un par conjugado.', ecuacion: ['HCl / Cl⁻'] },
        { estado: { corte: 4 }, texto: 'H₂O y H₃O⁺ forman el otro par conjugado.', ecuacion: ['H₂O / H₃O⁺'] },
      ],
    },
    regla: {
      texto: 'Brønsted-Lowry: el ácido da un H⁺ y la base lo recibe; quedan conjugados. Arrhenius mira H⁺ y OH⁻ en agua; una base de Lewis cede un par de electrones.',
      ecuacion: [{ llave: ['HA + B'], nota: 'ácido y base' }, ' ⇌ ', { llave: ['A⁻ + HB⁺'], nota: 'sus conjugados' }],
      condicion: 'el papel depende de la reacción: el agua es base frente al HCl y ácido frente al NH₃.',
      voz: 'Primero ubica el protón; el nombre de cada papel sale solo.',
    },
    ahoraTu: {
      voz: 'Quita o pon un solo H⁺, con su carga.',
      generar(s) {
        // [especie, papel, correcta, sin carga (H quitado como átomo), otro sentido o dos H⁺]
        const T = [
          ['HCl', 'ácido', 'Cl⁻', 'Cl', 'H₂Cl⁺'], ['HNO₃', 'ácido', 'NO₃⁻', 'NO₃', 'H₂NO₃⁺'], ['H₂SO₄', 'ácido', 'HSO₄⁻', 'HSO₄', 'SO₄²⁻'],
          ['HCO₃⁻', 'ácido', 'CO₃²⁻', 'CO₃⁻', 'H₂CO₃'], ['NH₄⁺', 'ácido', 'NH₃', 'NH₄', 'NH₂⁻'], ['HF', 'ácido', 'F⁻', 'F', 'H₂F⁺'],
          ['CH₃COOH', 'ácido', 'CH₃COO⁻', 'CH₃COO', 'CH₃COOH₂⁺'], ['NH₃', 'base', 'NH₄⁺', 'NH₄', 'NH₂⁻'], ['OH⁻', 'base', 'H₂O', 'HOH⁻', 'O²⁻'],
          ['CO₃²⁻', 'base', 'HCO₃⁻', 'HCO₃²⁻', 'H₂CO₃'], ['H₂O', 'base', 'H₃O⁺', 'H₃O', 'OH⁻'],
        ];
        const [esp, papel, bien, sinCarga, otro] = T[s % T.length];
        const pide = papel === 'ácido' ? 'la base conjugada' : 'el ácido conjugado';
        const verbo = papel === 'ácido' ? 'quitarle' : 'agregarle';
        return {
          pregunta: `¿Cuál es ${pide} de ${esp}?`,
          opciones: [
            { id: 'c', texto: bien, correcta: true },
            { id: 'carga', texto: sinCarga, error: 'QM-CONJ-CARGA', siFuera: `Se movió un H, bien. Pero sale como H⁺: la carga cambia en una unidad.` },
            { id: 'otro', texto: otro, error: 'QM-CONJ-SENTIDO', siFuera: `Eso sería ${papel === 'ácido' ? 'agregar un H⁺ o quitar dos' : 'quitar un H⁺ o agregar dos'}. El conjugado difiere en un solo H⁺.` },
          ],
          solucion: { texto: `Para ${pide} hay que ${verbo} un H⁺: la carga cambia en una unidad.`, ecuacion: [`${esp} ${papel === 'ácido' ? '− H⁺' : '+ H⁺'} → ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: fuerte no es lo mismo que concentrado ----------
  // Cambia: el ácido y su concentración · Permanece: 24 moléculas de ácido en la caja (el agua no se dibuja) ·
  // Progresa: de ionizado entero a casi nada · Se reserva: el débil concentrado que gana al fuerte diluido ·
  // Debe verse: cuántas moléculas se separaron en iones.
  const ATOMOS = { H: { color: 'i', estilo: 'hueco', r: 4.5 }, A: { color: 'd', estilo: 'lleno', r: 6.5 }, Am: { color: 'd', estilo: 'punto', r: 7 }, O: { color: 'h', estilo: 'lleno', r: 6 } };
  const ESPECIES = { HA: [['A', -4, 0], ['H', 6, 0]], H3O: [['O', 0, 1], ['H', -6, 5], ['H', 6, 5], ['H', 0, -6]], Am: [['Am', 0, 0]] };
  const ACIDOS = { hcl: { texto: 'HCl (fuerte)', ka: Infinity }, hf: { texto: 'HF (débil)', ka: KA.hf }, acetico: { texto: 'CH₃COOH (débil)', ka: KA.acetico } };
  const N_MOL = 24;
  function caja(k, c, titulo, desde = 0, N = N_MOL) {
    const ka = ACIDOS[k].ka, ion = Math.round(N * alfa(c, ka));
    return { titulo, forma: 'vaso', nivel: 0.95, particulas: [{ e: 'HA', n: N - ion, desde }, { e: 'H3O', n: ion, desde }, { e: 'Am', n: ion, desde }] };
  }
  const lupaAcido = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 20, cajas,
    alt: `Lupa (modelo; el agua no se dibuja): ${cajas.map(c => `${c.titulo}, ${c.particulas[0].n} moléculas enteras y ${c.particulas[1].n} pares de iones`).join('; ')}.` }, extra), estado: {} });
  const fuerza = {
    id: 'fuerte-no-es-concentrado',
    titulo: 'Fuerte no es concentrado',
    temas: ['Pares conjugados y fuerza relativa', 'Ka, Kb y Kw'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un ácido: su concentración sube y baja sola. La lupa muestra 24 moléculas (sin el agua): cuenta las que se separan en iones.',
      voz: 'Compara el fuerte con los débiles a la misma concentración.',
      // Animación (ronda 5): C barre de 0,01 a 0,1 M y vuelve. La fracción ionizada sale del balance de cargas con la C
      // del momento; las moléculas tiemblan (agitación térmica, sin cálculo).
      controles: [
        { id: 'k', etiqueta: 'Ácido', opciones: Object.keys(ACIDOS).map(k => ({ valor: k, texto: ACIDOS[k].texto })) },
        { id: 'c', etiqueta: 'C', color: 'c-i', min: 0.01, max: 0.1, paso: 0.01, inicio: 0.1, unidad: 'M', decimales: 2, auto: { velocidad: 0.03, modo: 'rebota' } },
      ],
      dibujo: val => lupaAcido([caja(val.k, val.c, `${ACIDOS[val.k].texto}, ${f(val.c, 2)} M`)], { agita: val.c * 40, agitaAmp: 1.5 }),
      lectura: val => [C, ` = ${f(val.c, 2)} M · ioniza ${f(100 * alfa(val.c, ACIDOS[val.k].ka), 1)} % · `, pH, ` = ${fp(pHde(hAcido(val.c, ACIDOS[val.k].ka)))}`],
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: 'Comparas HCl 0,001 M (fuerte, diluido) con CH₃COOH 0,1 M (débil, concentrado). ¿Cuál tiene más H₃O⁺, es decir, menor pH?',
      voz: 'Separa dos preguntas: qué fracción se ioniza y cuánto ácido hay.',
      opciones: [
        { id: 'c', texto: `El CH₃COOH 0,1 M: pH ${fp(pHde(hAcido(0.1, KA.acetico)))}`, correcta: true },
        { id: 'fuerte', texto: 'El HCl, porque es un ácido fuerte', error: 'AB2', siFuera: 'El HCl se ioniza todo, cierto. Pero hay 100 veces menos ácido: el débil compensa con cantidad.' },
        { id: 'igual', texto: 'Tienen el mismo pH', error: 'QM-PH-IGUAL', siFuera: 'Serían iguales si el acético diera exactamente 0,001 M de H₃O⁺. Da un poco más.' },
        { id: 'debil', texto: 'El HCl: el débil casi no se ioniza', error: 'AB2', siFuera: 'Se ioniza poco, sí: cerca del 1 %. Pero el 1 % de 0,1 M ya supera a 0,001 M.' },
      ],
      dibujo: { datos: { min: 0, max: 7, paso: 1, cada: 1, variable: 'pH', color: 'h', decimales: 2, filas: 2, elementos: [] }, estado: {} },
      revelar: { datos: { min: 0, max: 7, paso: 1, cada: 1, variable: 'pH', color: 'h', decimales: 2, filas: 2, elementos: [
        { tipo: 'punto', x: pHde(hAcido(0.001, Infinity)), color: 'h', rotulo: `HCl 0,001 M: ${fp(pHde(hAcido(0.001, Infinity)))}`, fila: 1 },
        { tipo: 'punto', x: pHde(hAcido(0.1, KA.acetico)), color: 'h', rotulo: `CH₃COOH 0,1 M: ${fp(pHde(hAcido(0.1, KA.acetico)))}`, fila: 2 }] }, estado: {} },
      coincide: 'Coincide: el débil se ioniza poco, pero hay cien veces más ácido.',
      noCoincide: 'El 1,3 % de 0,1 M da más H₃O⁺ que todo 0,001 M.',
    },
    mira: {
      datos: lupaAcido([caja('hcl', 0.1, 'HCl 0,1 M', 1, 12), caja('hf', 0.1, 'HF 0,1 M', 2, 12)], { separacion: 22 }).datos,
      voz: 'Contemos iones caja por caja.',
      pasos: [
        { estado: { corte: 1 }, texto: 'HCl: las 12 moléculas se separan en iones. Es un ácido fuerte.', ecuacion: ['HCl + H₂O → H₃O⁺ + Cl⁻'] },
        { estado: { corte: 2 }, texto: `HF a la misma concentración: solo ${Math.round(12 * alfa(0.1, KA.hf))} de 12, cerca del ${f(100 * alfa(0.1, KA.hf), 0)} %.`, ecuacion: ['HF + H₂O ⇌ H₃O⁺ + F⁻'] },
        { estado: { corte: 2 }, texto: 'Cuánto se ioniza lo dice su constante de acidez.', ecuacion: [Ka, ' = ', { frac: ['[H₃O⁺][F⁻]', '[HF]'] }, ` = ${cien(KA.hf)}`] },
        { estado: { corte: 2 }, texto: 'Su base conjugada, F⁻, es una base muy débil.', ecuacion: [Kb, ' = ', { frac: [Kw, Ka] }, ` = ${cien(KW / KA.hf)}`] },
      ],
    },
    regla: {
      texto: 'Un ácido fuerte se ioniza casi por completo; uno débil, solo en parte, según su Ka. La fuerza no es la concentración. En un par conjugado, Ka·Kb = Kw.',
      ecuacion: [{ llave: [Ka], nota: 'de acidez', color: 'c-d' }, ' = ', { frac: ['[H₃O⁺][A⁻]', '[HA]'] }, '   ·   ', Ka, Kb, ' = ', { llave: [Kw], nota: 'del agua', color: 'c-d' }],
      condicion: 'a 25 °C (Kw = 1,0 × 10⁻¹⁴) y en disolución diluida; Ka y Kw cambian con la temperatura.',
      voz: 'Dos preguntas distintas: qué tanto se ioniza y cuánto hay.',
    },
    ahoraTu: {
      voz: 'Decide primero si el ácido es fuerte o débil.',
      generar(s) {
        const r = azar(s);
        if (s % 2) {
          const ka = r.de([1.8e-5, 7.2e-4, 6.2e-10, 4.5e-4, 6.3e-5]), kb = KW / ka;
          return {
            pregunta: ['Un ácido débil tiene ', Ka, ` = ${cien(ka)}. ¿Cuánto vale `, Kb, ' de su base conjugada a 25 °C?'],
            opciones: opciones(kb, [
              { id: 'igual', valor: ka, error: 'QM-KAKB', siFuera: 'Eso repite Ka. La base conjugada tiene su propia constante: Kw dividido entre Ka.' },
              { id: 'producto', valor: KW * ka, error: 'QM-KAKB', siFuera: 'Eso multiplica. El producto Ka·Kb es el que vale Kw.' },
              { id: 'inverso', valor: 1 / ka, error: 'QM-KAKB', siFuera: 'Eso olvida Kw. Ka·Kb = 1,0 × 10⁻¹⁴, no 1.' },
            ], n => cien(n)),
            solucion: { texto: 'En un par conjugado, Ka·Kb = Kw.', ecuacion: [Kb, ' = ', { frac: ['1,0 × 10⁻¹⁴', cien(ka)] }, ` = ${cien(kb)}`] },
          };
        }
        const [nom, ka] = r.de([['CH₃COOH', KA.acetico], ['HF', KA.hf]]), c = r.de([0.1, 0.05, 0.2, 0.5]);
        const p = pHde(hAcido(c, ka));
        return {
          pregunta: [`¿Qué pH tiene una disolución de ${nom} con `, C, ` = ${f(c)} M? (`, Ka, ` = ${cien(ka)})`],
          opciones: opciones(p, [
            { id: 'fuerte', valor: -Math.log10(c), error: 'AB2', siFuera: 'Eso supone que se ioniza todo, como un ácido fuerte. Este es débil.' },
            { id: 'sin-raiz', valor: -Math.log10(ka * c), error: 'QM-SIN-RAIZ', siFuera: 'Eso olvida la raíz: [H₃O⁺]² ≈ Ka·C.' },
            { id: 'pka', valor: -Math.log10(ka), error: 'QM-PKA', siFuera: 'pH = pKa solo cuando hay tanto ácido como base conjugada. Aquí solo hay ácido.' },
          ], n => fp(n)),
          solucion: { texto: 'Se ioniza poco: [H₃O⁺]² ≈ Ka·C.', ecuacion: ['[H₃O⁺] ≈ ', { raiz: [`${cien(ka)} · ${f(c)}`] }, ` = ${cien(hAcido(c, ka), 2)} M → `, pH, ` = ${fp(p)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la escala de pH y lo que pasa al diluir ----------
  // Cambia: cuántas veces se diluye (cada vez, ×10) · Permanece: la escala de 0 a 14 con el 7 marcado · Progresa: el pH
  // del ácido fuerte sube de uno en uno · Se reserva: el último paso, que se frena antes de 7 · Debe verse: que nunca cruza a básico.
  const ESC = (elementos, extra = {}) => Object.assign({ min: 0, max: 14, paso: 1, cada: 2, variable: 'pH', color: 'h', decimales: 2, filas: 2, elementos: [{ tipo: 'punto', x: 7, rotulo: 'neutro', fila: 0, abierto: true }, ...elementos] }, extra);
  const DILUIDOS = { hcl: { texto: 'HCl (fuerte)', ka: Infinity }, acetico: { texto: 'CH₃COOH (débil)', ka: KA.acetico } };
  const phDil = (k, i) => pHde(hAcido(0.1 / 10 ** i, DILUIDOS[k].ka));
  const escala = {
    id: 'ph-al-diluir',
    titulo: 'El pH al diluir',
    temas: ['pH y pOH'],
    pieza: 'recta',
    juega: {
      consigna: 'Empiezas con 0,1 M de un ácido. El agua pura entra sola: cada segundo, el volumen se multiplica por 10. Mira el pH.',
      voz: 'Prueba muchas diluciones seguidas con el ácido fuerte.',
      // Animación (ronda 5): n avanza solo y continuo (entre dos diluciones enteras, el volumen crece como 10ⁿ); los
      // puntos huecos quedan en cada dilución entera ya pasada. Al llegar a 8, vuelve a empezar con un vaso nuevo.
      controles: [
        { id: 'k', etiqueta: 'Ácido', opciones: Object.keys(DILUIDOS).map(k => ({ valor: k, texto: DILUIDOS[k].texto })) },
        { id: 'n', etiqueta: 'Diluciones ×10', min: 0, max: 8, paso: 1, inicio: 0, decimales: 0, auto: { velocidad: 1 } },
      ],
      dibujo: val => {
        const ka = DILUIDOS[val.k].ka, pts = [];
        for (let i = 0; i <= val.n; i++) pts.push({ tipo: 'punto', x: pHde(hAcido(0.1 / 10 ** i, ka)), color: 'h', fila: 1, abierto: i < val.n });
        const p = pHde(hAcido(0.1 / 10 ** val.n, ka));
        pts.push({ tipo: 'punto', x: p, color: 'h', rotulo: fp(p), fila: 2 });
        return { datos: ESC(pts), estado: {} };
      },
      lectura: val => [C, ` = ${cien(0.1 / 10 ** val.n, Number.isInteger(val.n) ? 0 : 1)} M · `, pH, ` = ${fp(pHde(hAcido(0.1 / 10 ** val.n, DILUIDOS[val.k].ka)))}`],
      minimo: 4,
      // El punto del pH final se corre por la recta: al soltarlo cae en el número de diluciones cuyo pH está más cerca.
      // Se ve que hacia el 7 el punto ya no avanza aunque se diluya más.
      arrastres: [{ id: 'ph-final', etiqueta: 'pH después de diluir', color: 'c-h',
        donde: val => { const g = Kit.piezas.recta.geometria(ESC([])); return { x: g.x(phDil(val.k, val.n)), y: g.filaY(2) }; },
        mover: (pt, val) => {
          const g = Kit.piezas.recta.geometria(ESC([])), x = (pt.x - g.x(0)) * 14 / (g.x(14) - g.x(0));
          let mejor = 0;
          for (let i = 0; i <= 8; i++) if (Math.abs(phDil(val.k, i) - x) < Math.abs(phDil(val.k, mejor) - x)) mejor = i;
          return { n: mejor };
        } }],
    },
    predice: {
      pregunta: `Diluyes 10 veces HCl 0,1 M (pH 1,00) y también CH₃COOH 0,1 M (pH ${fp(pHde(hAcido(0.1, KA.acetico)))}). ¿Ambos suben exactamente una unidad de pH?`,
      voz: 'Piensa en lo que hace el débil cuando hay más agua.',
      opciones: [
        { id: 'c', texto: `No: el HCl sube 1; el acético, ${fp(pHde(hAcido(0.01, KA.acetico)) - pHde(hAcido(0.1, KA.acetico)))}`, correcta: true },
        { id: 'ambos', texto: 'Sí, diluir 10 veces siempre sube 1', error: 'QM-DILUIR-PH', siFuera: 'Vale para el fuerte. El débil se ioniza más al diluirse y su pH sube menos.' },
        { id: 'nada', texto: 'Ninguno cambia: el ácido sigue siendo el mismo', error: 'AB6', siFuera: 'La sustancia es la misma, sí. Pero hay menos H₃O⁺ por litro, y el pH sube.' },
        { id: 'baja', texto: 'Los dos bajan: más agua, más ácido', error: 'AB5', siFuera: 'El agua no agrega H₃O⁺ de más. Al diluir, la concentración baja y el pH sube.' },
      ],
      dibujo: { datos: ESC([{ tipo: 'punto', x: 1, color: 'h', rotulo: 'HCl', fila: 1 }, { tipo: 'punto', x: pHde(hAcido(0.1, KA.acetico)), color: 'h', rotulo: 'acético', fila: 2 }]), estado: {} },
      revelar: { datos: ESC([
        { tipo: 'salto', a: 1, b: 2, color: 'h', rotulo: '+1,00', fila: 1 },
        { tipo: 'salto', a: pHde(hAcido(0.1, KA.acetico)), b: pHde(hAcido(0.01, KA.acetico)), color: 'h', rotulo: `+${fp(pHde(hAcido(0.01, KA.acetico)) - pHde(hAcido(0.1, KA.acetico)))}`, fila: 2 }]), estado: {} },
      coincide: 'Coincide: solo el ácido fuerte sube una unidad entera.',
      noCoincide: 'El débil se ioniza más al diluirse: su pH sube menos de 1.',
    },
    mira: {
      datos: ESC([
        ...[1, 2, 3].map(p => ({ tipo: 'punto', x: p, color: 'h', fila: 1, desde: 1 })),
        ...[4, 5, 6].map(p => ({ tipo: 'punto', x: pHde(hAcido(10 ** -p, Infinity)), color: 'h', fila: 1, desde: 2 })),
        { tipo: 'punto', x: pHde(hAcido(1e-8, Infinity)), color: 'h', rotulo: `10⁻⁸ M: ${fp(pHde(hAcido(1e-8, Infinity)))}`, fila: 2, desde: 3 },
        { tipo: 'distancia', a: 7, b: 14, rotulo: 'básico', fila: 1, desde: 4 },
      ]),
      voz: 'Sigamos al ácido fuerte dilución por dilución.',
      pasos: [
        { estado: { corte: 1 }, texto: '0,1 M, 0,01 M y 0,001 M: el pH sube de uno en uno.', ecuacion: [pH, ' = −log[H₃O⁺] = 1, 2, 3'] },
        { estado: { corte: 2 }, texto: `Hasta 10⁻⁶ M sigue así: pH ${fp(pHde(hAcido(1e-6, Infinity)))}.`, ecuacion: ['[H₃O⁺] ≈ ', C] },
        { estado: { corte: 3 }, texto: `Con 10⁻⁸ M manda el agua: pH ${fp(pHde(hAcido(1e-8, Infinity)))}, no 8.`, ecuacion: ['[H₃O⁺] = ', C, ' + [OH⁻]'] },
        { estado: { corte: 4 }, texto: 'Un ácido diluido con agua nunca llega a la zona básica.', ecuacion: [pH, ' + pOH = 14 (25 °C)'] },
      ],
    },
    regla: {
      texto: 'pH = −log[H₃O⁺] y pH + pOH = 14. Diluir 10 veces un ácido fuerte sube 1 el pH solo lejos de 7; un débil sube menos. Nunca se vuelve básico.',
      ecuacion: [pH, ' = −log', { llave: ['[H₃O⁺]'], nota: 'en mol/L' }, '   ·   ', pH, ' + pOH = 14'],
      condicion: 'a 25 °C y en disolución diluida; −log de la concentración es una aproximación de la actividad.',
      voz: 'Antes de sumar 1, pregunta si es fuerte y si estás lejos de 7.',
    },
    ahoraTu: {
      voz: 'Calcula primero [H₃O⁺] o [OH⁻].',
      generar(s) {
        const r = azar(s), a = r.de([1, 2, 5]), n = r.ent(1, 4), c = a * 10 ** -n, base = s % 2 === 1;
        const pOH = base ? -Math.log10(c) : 14 + Math.log10(c), p = 14 - pOH;
        return {
          pregunta: base ? ['¿Qué pH tiene NaOH (base fuerte) con ', C, ` = ${f(a, 0)} × 10${exp(-n)} M a 25 °C?`] : ['¿Qué pH tiene HCl (ácido fuerte) con ', C, ` = ${f(a, 0)} × 10${exp(-n)} M a 25 °C?`],
          opciones: opciones(p, [
            { id: 'poh', valor: pOH, error: 'AB7', siFuera: base ? 'Eso es el pOH. El pH es 14 menos el pOH.' : 'Eso es el pOH. Para un ácido, el pH sale directo de −log[H₃O⁺].' },
            { id: 'exponente', valor: base ? 14 - n : n, error: 'QM-EXPONENTE', siFuera: `Eso usa solo el exponente. El ${f(a, 0)} también cuenta en el logaritmo.` },
            { id: 'signo', valor: base ? -Math.log10(c) + 7 : 7 - (-Math.log10(c)), error: 'AB4', siFuera: 'La escala no se mide desde 7. Se usa el logaritmo de la concentración.' },
          ], n2 => fp(n2)),
          solucion: base
            ? { texto: 'Base fuerte: [OH⁻] = C. Primero pOH, después pH.', ecuacion: [`pOH = −log(${f(a, 0)} × 10${exp(-n)}) = ${fp(pOH)} → `, pH, ` = ${fp(p)}`] }
            : { texto: 'Ácido fuerte: [H₃O⁺] = C.', ecuacion: [pH, ` = −log(${f(a, 0)} × 10${exp(-n)}) = ${f(p)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: neutralizar y titular ----------
  // Cambia: el volumen de NaOH agregado · Permanece: 25 mL de ácido 0,1 M y NaOH 0,1 M; los ejes · Progresa: la curva
  // sube despacio, salta en la equivalencia y se aplana · Se reserva: la equivalencia del ácido débil, sobre 7 ·
  // Debe verse: dónde está la equivalencia y qué pH tiene.
  const VA = 25, CA = 0.1, CB = 0.1;
  const pHtit = (vb, ka, ca = CA) => { const v = VA + vb; return pHde(hAcido(ca * VA / v, ka, CB * vb / v)); };
  const curva = (ka, ca = CA) => Array.from({ length: 101 }, (_, i) => [i / 2, pHtit(i / 2, ka, ca)]);
  // El punto de la curva se agarra y se corre: su abscisa es el volumen de NaOH (la inversa de X de la pieza ejes).
  const vEn = pt => { const g = Kit.piezas.ejes.geometria(ejesTit()); return (pt.x - g.X(0)) * 50 / (g.X(50) - g.X(0)); };
  const puntoTit = (v, ka, ca = CA) => { const g = Kit.piezas.ejes.geometria(ejesTit()); return { x: g.X(v), y: g.Y(pHtit(v, ka, ca)) }; };
  const ejesTit = (extra = {}) => Object.assign({
    x: { min: 0, max: 50, paso: 10, nombre: 'V NaOH', unidad: 'mL', decimales: 0, color: 'o' },
    y: { min: 0, max: 14, paso: 2, nombre: 'pH', decimales: 0, color: 'h' },
    alt: 'Curva de titulación: pH contra el volumen de NaOH 0,1 M agregado a 25 mL de ácido 0,1 M.',
  }, extra);
  const titulacion = {
    id: 'neutralizacion',
    titulo: 'Neutralizar no siempre da 7',
    temas: ['Neutralización y titulación'],
    pieza: 'ejes',
    juega: {
      consigna: 'Titulación en cámara rápida: cae NaOH 0,1 M sobre 25 mL de HCl 0,1 M, 50 mL en 10 s. Mira dónde salta el pH.',
      voz: 'Busca el volumen donde la curva salta.',
      // Animación (ronda 5): la bureta gotea sola a 5 mL/s y la curva se dibuja hasta el volumen del momento.
      controles: [{ id: 'v', etiqueta: 'V', color: 'c-o', min: 0, max: 50, paso: 2.5, inicio: 0, unidad: 'mL', decimales: 1, auto: { velocidad: 5 } }],
      dibujo: val => ({ datos: ejesTit({ curvas: [{ puntos: curva(Infinity).filter(p => p[0] < val.v).concat([[val.v, pHtit(val.v, Infinity)]]), color: 'h' }], puntos: [{ x: val.v, y: pHtit(val.v, Infinity), color: 'o', rotulo: fp(pHtit(val.v, Infinity)), guias: true }] }), estado: {} }),
      lectura: val => [V, ` = ${f(val.v, 1)} mL · `, pH, ` = ${fp(pHtit(val.v, Infinity))}`],
      minimo: 4,
      // El punto naranja se arrastra a lo largo de la curva: el dedo elige el volumen de base y el pH responde.
      arrastres: [{ id: 'base-agregada', etiqueta: 'volumen de NaOH sobre la curva', color: 'c-o',
        donde: val => puntoTit(val.v, Infinity),
        mover: pt => ({ v: vEn(pt) }) }],
    },
    predice: {
      pregunta: 'Ahora titulas 25 mL de CH₃COOH 0,1 M (débil) con el mismo NaOH. En el punto de equivalencia, con 25 mL agregados, ¿qué pH hay?',
      voz: 'Piensa qué queda en el vaso justo en la equivalencia.',
      opciones: [
        { id: 'c', texto: 'Mayor que 7', correcta: true },
        { id: 'siete', texto: 'Exactamente 7, como toda neutralización', error: 'AB9', siFuera: 'Con HCl fue 7, bien visto. Con un ácido débil queda acetato, que es una base.' },
        { id: 'menor', texto: 'Menor que 7, porque el ácido era ácido', error: 'QM-EQUIV-ACIDA', siFuera: 'Antes de la equivalencia, sí. En ella ya no queda ácido acético libre.' },
      ],
      dibujo: { datos: ejesTit({ curvas: [{ puntos: curva(KA.acetico).filter(p => p[0] <= 20), color: 'h' }] }), estado: {} },
      revelar: { datos: ejesTit({ curvas: [{ puntos: curva(KA.acetico), color: 'h' }, { puntos: curva(Infinity), color: 'h', discontinua: true }], puntos: [{ x: 25, y: pHtit(25, KA.acetico), color: 'o', rotulo: `equivalencia: ${fp(pHtit(25, KA.acetico))}`, guias: true }] }), estado: {} },
      coincide: 'Coincide: en la equivalencia queda acetato, y el acetato es básico.',
      noCoincide: `En la equivalencia queda acetato, una base: pH ${fp(pHtit(25, KA.acetico))}.`,
    },
    // Hallazgo 9: el juego y «Mira» usan la misma figura (la curva de titulación); «Mira» cambia al ácido débil porque es el
    // caso que la predicción acaba de abrir, y la curva del HCl que el alumno recorrió ya quedó dibujada en el revelado.
    mira: {
      datos: ejesTit({
        curvas: [{ puntos: curva(KA.acetico), color: 'h' }],
        puntos: [
          { x: 0, y: pHtit(0, KA.acetico), color: 'o', rotulo: fp(pHtit(0, KA.acetico)), desde: 1 },
          { x: 12.5, y: pHtit(12.5, KA.acetico), color: 'o', rotulo: `${fp(pHtit(12.5, KA.acetico))} ≈ pKa`, guias: true, desde: 2 },
          { x: 25, y: pHtit(25, KA.acetico), color: 'o', rotulo: fp(pHtit(25, KA.acetico)), guias: true, desde: 3 },
          { x: 40, y: pHtit(40, KA.acetico), color: 'o', rotulo: fp(pHtit(40, KA.acetico)), desde: 4 },
        ],
      }),
      voz: 'Recorramos la curva del ácido débil por tramos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Al inicio solo hay ácido débil.', ecuacion: [pH, ` = ${fp(pHtit(0, KA.acetico))}`] },
        { estado: { corte: 2 }, texto: 'A media neutralización hay tanto ácido como acetato: pH ≈ pKa.', ecuacion: [pH, ' ≈ −log ', Ka, ` = ${fp(-Math.log10(KA.acetico))}`] },
        { estado: { corte: 3 }, texto: 'En la equivalencia, los moles de base igualan a los de ácido.', ecuacion: [{ sub: [C, 'a'] }, { sub: [V, 'a'] }, ' = ', { sub: [C, 'b'] }, { sub: [V, 'b'] }, ' → 25 mL'] },
        { estado: { corte: 3 }, texto: `Queda acetato, que toma H⁺ del agua: pH ${fp(pHtit(25, KA.acetico))}.`, ecuacion: ['CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻'] },
        { estado: { corte: 4 }, texto: 'Después, la base en exceso manda el pH.' },
      ],
    },
    regla: {
      texto: 'Primero la estequiometría: en la equivalencia, los moles de base igualan a los de ácido. Después el equilibrio: el pH ahí es 7 solo con ácido y base fuertes.',
      ecuacion: [{ llave: [{ sub: [C, 'a'] }, { sub: [V, 'a'] }], nota: 'moles de ácido' }, ' = ', { llave: [{ sub: [C, 'b'] }, { sub: [V, 'b'] }], nota: 'moles de base' }],
      condicion: 'ácido monoprótico con base fuerte a 25 °C; el indicador marca el punto final, que debe caer cerca de la equivalencia.',
      voz: 'Cuenta moles primero; el pH viene después.',
    },
    ahoraTu: {
      voz: 'Iguala moles de ácido y de base.',
      generar(s) {
        const r = azar(s), va = 5 * r.ent(2, 10), ca = r.de([0.1, 0.2, 0.05, 0.15]), cb = r.de([0.1, 0.2, 0.25, 0.5]);
        const vb = ca * va / cb;
        return {
          pregunta: [`Titulas `, { sub: [V, 'a'] }, ` = ${f(va, 0)} mL de HCl `, { sub: [C, 'a'] }, ` = ${f(ca)} M con NaOH `, { sub: [C, 'b'] }, ` = ${f(cb)} M. ¿Cuánta base llega a la equivalencia?`],
          opciones: opciones(vb, [
            { id: 'invertido', valor: cb * va / ca, error: 'QM-CV-INVERTIDO', siFuera: 'Eso invierte las concentraciones. A base más concentrada, menos volumen.' },
            { id: 'igual', valor: va, error: 'QM-V-IGUAL', siFuera: 'Serían iguales si las dos concentraciones lo fueran. Se igualan moles, no volúmenes.' },
            { id: 'producto', valor: ca * cb * va, error: 'QM-CV-INVERTIDO', siFuera: 'Eso multiplica las concentraciones. Se despeja: Vb = Ca·Va / Cb.' },
          ], n => `${f(n)} mL`),
          solucion: { texto: 'En la equivalencia, moles de HCl = moles de NaOH.', ecuacion: [{ sub: [V, 'b'] }, ` = ${f(ca)} · ${f(va, 0)} / ${f(cb)} = ${f(vb)} mL`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Vaso: 12 moléculas-modelo de ácido; el nivel es V/1 L. La fracción ionizada sale del balance de cargas con C = m/V.
  const PZ = () => Kit.piezas['quim-particulas'];
  const labPH = val => pHde(hAcido(val.m / val.v, ACIDOS[val.k].ka));   // el pH que da la lectura
  const labC = val => { const c = val.m / val.v; return c >= 0.01 ? f(c, 3) : cien(c, 1); };
  const labVaso = val => {
    const ka = ACIDOS[val.k].ka, ion = Math.round(12 * alfa(val.m / val.v, ka));
    return { datos: { atomos: ATOMOS, especies: ESPECIES, alto: 170, separacion: 18, agita: val.v * 20, agitaAmp: 1.5,
      cajas: [{ titulo: `${ACIDOS[val.k].texto}, ${f(val.m, 4)} mol`, forma: 'vaso', nivel: val.v, rotulo: `${f(val.v, 2)} L`,
        particulas: [{ e: 'HA', n: 12 - ion }, { e: 'H3O', n: ion }, { e: 'Am', n: ion }] }],
      alt: `Lupa (modelo; el agua no se dibuja): ${ACIDOS[val.k].texto} en ${f(val.v, 2)} L, ${12 - ion} moléculas enteras y ${ion} pares de iones de 12.` }, estado: {} };
  };
  // La superficie del líquido está en r.y − 4 (quim-particulas: region); el nivel es la fracción del alto útil.
  const nivelVaso = dib => { const g = PZ().geometria(dib.datos), r = PZ().region(dib.datos.cajas[0], g, 0); return { x: g.x(0) + g.ancho / 2, y: r.y - 4 }; };
  const volumenEn = (dib, y) => { const g = PZ().geometria(dib.datos); return (g.y1 - y) / (g.alto - 8); };
  const labTit = val => {
    const ka = ACIDOS[val.k].ka, ve = val.c * VA / CB;
    return { datos: ejesTit({
      curvas: [{ puntos: curva(Infinity, val.c), color: 'h', discontinua: ka !== Infinity }].concat(ka === Infinity ? [] : [{ puntos: curva(ka, val.c), color: 'h' }]),
      puntos: [{ x: val.v, y: pHtit(val.v, ka, val.c), color: 'o', rotulo: fp(pHtit(val.v, ka, val.c)), guias: true }],
      alt: `Curva de titulación de 25 mL de ${ACIDOS[val.k].texto} ${f(val.c)} M con NaOH 0,1 M; equivalencia en ${f(ve, 1)} mL. La curva punteada es la del HCl.` }), estado: {} };
  };

  return {
    unidad: 'quimica.acidos-y-bases',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Medir la acidez fue clave para comparar procesos químicos y biológicos. En 1909, Søren Sørensen, en el laboratorio Carlsberg, propuso la escala de pH mientras estudiaba cómo la acidez afectaba reacciones. La escala logarítmica convirtió concentraciones que cambian millones de veces en números manejables. Hoy la definición usa la actividad del ion hidrógeno.',
      pregunta: '¿Cómo compararías dos números que difieren un millón de veces?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §14.2; IUPAC Gold Book, pH', url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso. Los ejemplos se calculan aquí.
    glosario: [
      { termino: 'ácido', def: 'Sustancia que entrega un H⁺ a otra; en agua aumenta la cantidad de H₃O⁺.',
        ejemplo: 'HCl + H₂O → Cl⁻ + H₃O⁺: el HCl da su H⁺ al agua.', ver: ['base', 'Brønsted-Lowry'] },
      { termino: 'base', def: 'Sustancia que recibe un H⁺ de otra; en agua aumenta la cantidad de OH⁻.',
        ejemplo: 'NH₃ + H₂O → NH₄⁺ + OH⁻: el NH₃ recibe el H⁺.', ver: ['ácido', 'base de Lewis'] },
      { termino: 'Brønsted-Lowry', formas: ['Brønsted-Lowry', 'Brønsted'], def: 'Modelo en que el ácido da un protón y la base lo recibe; sirve también fuera del agua.',
        ver: ['par conjugado'] },
      { termino: 'base de Lewis', formas: ['base de Lewis', 'bases de Lewis'], def: 'Especie que entrega un par de electrones para formar un enlace, aunque no haya protones.',
        ejemplo: 'En BF₃ + NH₃, el NH₃ da su par libre.', ver: ['base'] },
      { termino: 'par conjugado', formas: ['par conjugado', 'pares conjugados', 'conjugado', 'conjugada', 'conjugados'],
        def: 'Dos especies que se diferencian solo en un H⁺, como HCl y Cl⁻.', ver: ['Brønsted-Lowry'] },
      { termino: 'ionización', formas: ['ionización', 'ioniza', 'ionizan', 'ionizada', 'ionizadas'],
        def: 'Separación de una molécula en iones al disolverse, como HF → H⁺ + F⁻.', ver: ['ácido fuerte', 'ácido débil'] },
      { termino: 'ácido fuerte', formas: ['ácido fuerte', 'ácidos fuertes'], def: 'El que se separa en iones casi por completo en agua, como el HCl.',
        ver: ['ácido débil'] },
      { termino: 'ácido débil', formas: ['ácido débil', 'ácidos débiles'], def: 'El que se separa en iones solo en parte: la mayoría de sus moléculas siguen enteras.',
        ejemplo: `CH₃COOH 0,1 M: solo el ${f(100 * alfa(0.1, KA.acetico), 1)} % se separa.`, ver: ['constante de acidez'] },
      { termino: 'constante de acidez', simbolo: 'Kₐ', def: 'Número que mide cuánto se separa en iones un ácido débil: mientras mayor, más fuerte.',
        ejemplo: `HF: ${cien(KA.hf)}; ácido acético: ${cien(KA.acetico)}. El HF es más fuerte.`, ver: ['pKa'] },
      { termino: 'pKa', def: 'Menos el logaritmo de Kₐ: mientras menor, más fuerte es el ácido.',
        ejemplo: `Ácido acético: −log(${cien(KA.acetico)}) = ${fp(-Math.log10(KA.acetico))}.`, ver: ['constante de acidez'] },
      { termino: 'escala de pH', formas: ['escala de pH', 'pH'], def: 'Medida de la acidez: menos el logaritmo de [H₃O⁺]. Bajo 7 es ácido y sobre 7, básico, a 25 °C.',
        ejemplo: `[H₃O⁺] = 0,001 M: pH = ${fp(-Math.log10(0.001))}.`, ver: ['pOH'] },
      { termino: 'pOH', def: 'Lo mismo que el pH, pero con los OH⁻: −log[OH⁻]. A 25 °C, sumado al pH da 14.',
        ejemplo: `[OH⁻] = 0,01 M: pOH = ${fp(-Math.log10(0.01))} y pH = ${fp(14 + Math.log10(0.01))}.`, ver: ['escala de pH'] },
      { termino: 'neutralización', def: 'Reacción de un ácido con una base: los H⁺ y los OH⁻ forman agua y queda una sal.',
        ver: ['titulación'] },
      { termino: 'titulación', def: 'Agregar poco a poco una solución de concentración conocida para medir cuánto ácido o base hay.',
        ver: ['punto de equivalencia'] },
      { termino: 'punto de equivalencia', formas: ['punto de equivalencia', 'equivalencia'],
        def: 'Momento de la titulación en que los moles de base agregados igualan a los de ácido.',
        ejemplo: `25 mL de HCl 0,1 M piden ${f(0.1 * VA / CB, 0)} mL de NaOH 0,1 M.`, ver: ['titulación'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera junta fuerza y concentración en un solo vaso: se
    // agrega agua arrastrando el nivel y se ve que el débil se ioniza más al diluirse (lo que la idea 2 no deja probar).
    // La segunda titula cualquiera de los tres ácidos a tres concentraciones, con la curva del HCl de fondo para comparar.
    // Las lecturas dicen ácido, cantidades y resultado, para que un caso guardado se lea solo.
    laboratorio: [
      {
        id: 'vaso-que-se-diluye', titulo: 'El ácido que se diluye', pieza: 'quim-particulas',
        consigna: 'Elige el ácido y cuántos moles hay. El agua entra sola al vaso; también puedes subir su nivel. Cuenta los iones y mira el pH.',
        // Animación (ronda 5): el vaso se llena solo de 0,5 a 1 L en 5 s y vuelve a empezar; las moléculas tiemblan.
        controles: [
          { id: 'k', etiqueta: 'Ácido', opciones: Object.keys(ACIDOS).map(k => ({ valor: k, texto: ACIDOS[k].texto })) },
          { id: 'm', etiqueta: 'Cantidad', opciones: [{ valor: 0.1, texto: '0,1 mol' }, { valor: 0.01, texto: '0,01 mol' }, { valor: 0.001, texto: '0,001 mol' }, { valor: 0.0001, texto: '0,0001 mol' }] },
          { id: 'v', etiqueta: 'V', color: 'c-o', min: 0.5, max: 1, paso: 0.05, inicio: 0.5, unidad: 'L', decimales: 2, auto: { velocidad: 0.1 } },
        ],
        dibujo: val => labVaso(val),
        lectura: val => [`${ACIDOS[val.k].texto.split(' ')[0]} `, C, ` = ${labC(val)} M → ${f(100 * alfa(val.m / val.v, ACIDOS[val.k].ka), 0)} % · `, pH, ` = ${fp(pHde(hAcido(val.m / val.v, ACIDOS[val.k].ka)))}`],
        // La superficie del líquido se agarra: subirla es agregar agua (V); la fracción ionizada responde en la lupa.
        arrastres: [{ id: 'nivel', etiqueta: 'nivel del vaso: más arriba, más agua', color: 'c-o',
          donde: val => nivelVaso(labVaso(val)),
          mover: (pt, val) => ({ v: volumenEn(labVaso(val), pt.y) }) }],
        // Retos (docs/teoria.md §4d): los comprueban alfa y hAcido, las mismas cuentas de la lupa y la lectura.
        invitaciones: [
          { texto: 'Con un ácido débil, logra que más de la mitad de la lupa esté ionizada.',
            logrado: val => val.k !== 'hcl' && Math.round(12 * alfa(val.m / val.v, ACIDOS[val.k].ka)) > 6,
            bien: 'Muy diluido, el débil se ioniza casi entero. Kₐ es la misma; cambió C.' },
          { texto: 'Con HCl, deja el pH justo en 3.',
            logrado: val => val.k === 'hcl' && Math.abs(labPH(val) - 3) < 0.005,
            bien: 'Una milésima de mol por litro: pH 3. ¿Qué cantidad daría pH 4?' },
          { texto: 'Busca el pH más alto que permite la mesa.',
            logrado: val => Object.keys(ACIDOS).every(k => labPH(val) >= labPH({ k, m: 0.0001, v: 1 }) - 1e-9),
            bien: 'Poco ácido, mucha agua y el más débil. Aun así, no llega a 7.' },
          { texto: 'Guarda HF y CH₃COOH con la misma cantidad y el mismo volumen.',
            logrado: (val, guardados) => val.k !== 'hcl' && guardados.some(g => g.k !== 'hcl' && g.k !== val.k && g.m === val.m && g.v === val.v)
              && guardados.some(g => g.k === val.k && g.m === val.m && g.v === val.v),
            bien: 'Misma concentración, distinta Kₐ: el HF se ioniza más y su pH es menor.' },
        ],
      },
      {
        id: 'titula-cualquiera', titulo: 'Titula cualquier ácido', pieza: 'ejes',
        consigna: 'Elige el ácido y su concentración. Arrastra el punto por la curva y compara con la del HCl punteada.',
        controles: [
          { id: 'k', etiqueta: 'Ácido', opciones: Object.keys(ACIDOS).map(k => ({ valor: k, texto: ACIDOS[k].texto })) },
          { id: 'c', etiqueta: 'C', color: 'c-i', opciones: [{ valor: 0.05, texto: '0,05 M' }, { valor: 0.1, texto: '0,1 M' }, { valor: 0.15, texto: '0,15 M' }] },
          { id: 'v', etiqueta: 'V', color: 'c-o', min: 0, max: 50, paso: 1, inicio: 10, unidad: 'mL', decimales: 0 },
        ],
        dibujo: val => labTit(val),
        lectura: val => [`25 mL ${ACIDOS[val.k].texto.split(' ')[0]} ${f(val.c)} M + ${f(val.v, 0)} mL → `, pH, ` = ${fp(pHtit(val.v, ACIDOS[val.k].ka, val.c))}`],
        arrastres: [{ id: 'base-agregada', etiqueta: 'volumen de NaOH sobre la curva', color: 'c-o',
          donde: val => puntoTit(val.v, ACIDOS[val.k].ka, val.c),
          mover: pt => ({ v: vEn(pt) }) }],
        // Retos: los comprueban pHtit y los moles de la equivalencia (C·25 mL = 0,1 M·V), lo mismo que traza la curva.
        invitaciones: [
          { texto: 'Deja el punto justo en el punto de equivalencia.',
            logrado: val => Math.abs(val.v - val.c * VA / CB) < 1e-9,
            bien: 'Moles de base iguales a los de ácido. ¿Ahí el pH es 7 con todos?' },
          { texto: 'Con un ácido débil, busca el punto donde el pH vale su pKa.',
            logrado: val => val.k !== 'hcl' && Math.abs(pHtit(val.v, ACIDOS[val.k].ka, val.c) + Math.log10(ACIDOS[val.k].ka)) < 0.1,
            bien: 'Es la media neutralización: tanto ácido como su base conjugada.' },
          { texto: 'Pasa la equivalencia y lleva el pH por encima de 12.',
            logrado: val => pHtit(val.v, ACIDOS[val.k].ka, val.c) > 12,
            bien: 'Ya no queda ácido: la base que sobra manda el pH.' },
          { texto: 'Guarda HCl y HF de igual concentración, sin base agregada.',
            logrado: (val, guardados) => val.v === 0 && guardados.some(g => g.v === 0 && g.c === val.c && ((g.k === 'hcl') !== (val.k === 'hcl')) && (g.k === 'hf' || val.k === 'hf'))
              && guardados.some(g => g.k === val.k && g.c === val.c && g.v === val.v),
            bien: 'Misma concentración, distinto pH: la fuerza decide cuánto se ioniza.' },
        ],
      },
    ],
    ideas: [proton, fuerza, escala, titulacion],
  };
});
