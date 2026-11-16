/*
 * Teoría de «Materia y energía» (quimica.materia-y-energia). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 1), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 25) y las precisiones de Química del expediente. Errores: docs/investigacion/quimica-materia-nomenclatura-
 * organica-ideas-erroneas.md (MA), atomo-enlace (EN, AT) y gases-soluciones (GQ); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: clasificar una muestra por sus partículas y decidir qué hace el calor y la energía con ella.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: clasifica una muestra nueva, dice si un cambio es físico, químico o nuclear y calcula
 *     Q = mcΔT, Q = mL y E = Δm·c² con sus unidades.
 *   Orden de atención: 1.º la lupa (qué partículas hay) · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿lo uniforme es puro?, ¿el calor siempre sube la temperatura?, ¿de dónde sale la energía nuclear?
 *
 * Colores (regla 4): m masa (y Δm) turquesa c-i, Q calor naranja c-o, T temperatura rojo c-h, E energía verde c-d.
 * En las ideas de partículas, los átomos llevan color y relleno propio (O rojo lleno, H turquesa hueco, Na naranja con
 * punto, Cl verde, C tinta): no comparten pantalla con las variables.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §1.2 y §10.3; IUPAC; NIST (c = 299 792 458 m/s, aquí 3 × 10⁸).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
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
  function cien(x, d = 1) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }

  // ---------- Partículas: átomos y especies de la unidad ----------
  const ATOMOS = { O: { color: 'h', estilo: 'lleno', r: 6 }, H: { color: 'i', estilo: 'hueco', r: 4.5 }, Na: { color: 'o', estilo: 'punto', r: 6 },
    Cl: { color: 'd', estilo: 'lleno', r: 7 }, C: { estilo: 'lleno', r: 5 }, N: { color: 'o', estilo: 'hueco', r: 6 }, He: { color: 'd', estilo: 'punto', r: 5 } };
  const ESPECIES = {
    O2: [['O', -5, 0], ['O', 5, 0]], N2: [['N', -5, 0], ['N', 5, 0]], H2: [['H', -4, 0], ['H', 4, 0]],
    H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]], CO2: [['C', 0, 0], ['O', -9, 0], ['O', 9, 0]], He: [['He', 0, 0]],
    Na: [['Na', 0, 0]], Cl: [['Cl', 0, 0]], C: [['C', 0, 0]], N: [['N', 0, 0]],
    aceite: [['C', -9, 0], ['C', -3, -2], ['C', 3, 0], ['C', 9, -2]], azucar: [['C', -6, -3], ['C', 0, -3], ['C', 6, -3], ['O', -3, 4], ['O', 3, 4]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 24, cajas }, extra), estado: {} });
  // Una partícula por casilla de una rejilla dentro de [x0, x1] × [y0, y1] (fracciones de la región): capas, sólidos.
  function rejilla(e, n, cols, x0, x1, y0, y1, extra = {}) {
    const filas = Math.ceil(n / cols), out = [];
    for (let k = 0; k < n; k++) {
      const c = k % cols, fl = Math.floor(k / cols);
      out.push(Object.assign({ e, n: 1, x: x0 + (x1 - x0) * (cols === 1 ? 0.5 : c / (cols - 1)), y: y0 + (y1 - y0) * (filas === 1 ? 0.5 : fl / (filas - 1)) }, extra));
    }
    return out;
  }

  // ---------- Partículas que se mueven solas (animación, docs/3d.md §6) ----------
  // Modelo cinético, en cámara lenta y determinístico: cada cuadro es una función de t (regla 1), sin azar ni reloj.
  // Un gas vuela en recta y rebota en las paredes; un líquido se desliza alrededor de su lugar sin salir de su capa;
  // un sólido vibra en su sitio. Todas las frecuencias son múltiplos de 1/CICLO: cuando t vuelve a 0, nada salta.
  const CICLO = 8, W2 = 2 * Math.PI / CICLO;
  const h01 = (a, b) => { let h = (Math.imul(a + 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x7F4A7C15, 0xC2B2AE35)) >>> 0; h ^= h >>> 15; h = Math.imul(h, 0x2C1B3C6D); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
  const tri = u => { const w = ((u % 2) + 2) % 2; return w > 1 ? 2 - w : w; };    // ida y vuelta entre 0 y 1: el rebote
  const acota = (u, a = 0.06, b = 0.94) => Math.max(a, Math.min(b, u));
  // particulas: los grupos de una caja; modo: 'gas' | 'liquido' | 'solido' (un grupo puede traer su propio modo).
  // Devuelve una partícula por elemento, con su x, y (fracciones de la región) en el instante t.
  function mover(particulas, modo, t, k = 0, cols0) {
    const lista = [];
    for (const g of particulas || []) { const n = Math.round(g.n === undefined ? 1 : g.n); for (let j = 0; j < n; j++) lista.push(g); }
    const libres = lista.filter(g => !(Number.isFinite(g.x) && Number.isFinite(g.y)));
    const cols = cols0 || Math.max(1, Math.round(Math.sqrt(libres.length * 1.6))), filas = Math.max(1, Math.ceil(libres.length / cols));
    const casilla = libres.map((_, i) => i).sort((a, b) => h01(k + 1, a) - h01(k + 1, b));
    let libre = 0;
    return lista.map((g, i) => {
      const r = j => h01(i * 7 + j, k * 13 + 3), md = g.modo || modo;
      let bx = g.x, by = g.y;
      if (!(Number.isFinite(bx) && Number.isFinite(by))) {
        const c = casilla[libre++], q = c % cols, fl = Math.floor(c / cols);
        bx = 0.14 + 0.72 * (cols === 1 ? 0.5 : q / (cols - 1)); by = 0.16 + 0.68 * (filas === 1 ? 0.5 : fl / (filas - 1));
      }
      let x, y;
      if (md === 'gas') {
        const vx = (2 + Math.floor(r(1) * 3)) * (r(2) < 0.5 ? -1 : 1) * 2 / CICLO, vy = (1 + Math.floor(r(3) * 3)) * (r(4) < 0.5 ? -1 : 1) * 2 / CICLO;
        x = 0.06 + 0.88 * tri(bx + vx * t); y = 0.07 + 0.86 * tri(by + vy * t);
      } else if (md === 'liquido') {
        x = acota(bx + 0.07 * Math.sin(W2 * (1 + Math.floor(r(1) * 2)) * t + 6.3 * r(2)) + 0.03 * Math.sin(W2 * 3 * t + 6.3 * r(3)));
        y = acota(by + 0.05 * Math.sin(W2 * (1 + Math.floor(r(4) * 2)) * t + 6.3 * r(5)), 0.06, 0.95);
      } else {
        x = acota(bx + 0.018 * Math.sin(W2 * (6 + Math.floor(r(1) * 3)) * t + 6.3 * r(2)));
        y = acota(by + 0.018 * Math.sin(W2 * (6 + Math.floor(r(3) * 3)) * t + 6.3 * r(4)), 0.06, 0.96);
      }
      const p = Object.assign({}, g, { n: 1, x, y }); delete p.modo;
      return p;
    });
  }
  const T_ANIMA = { id: 't', etiqueta: 't', min: 0, max: CICLO, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } };

  // ---------- Idea 1: sustancia o mezcla se decide con la lupa ----------
  // Cambia: la muestra · Permanece: la caja y la escala de la lupa · Progresa: de una especie a varias, de una fase
  // a dos · Se reserva: la mezcla que se ve uniforme (agua con azúcar) · Debe verse: cuántas especies hay.
  const MUESTRAS = {
    oxigeno: { titulo: 'Oxígeno', caja: { forma: 'cilindro', nivel: 0.95, particulas: [{ e: 'O2', n: 8 }] }, lee: 'Oxígeno: 1 especie, 1 elemento. Sustancia simple.' },
    agua: { titulo: 'Agua', caja: { forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 14 }] }, lee: 'Agua: 1 especie, 2 elementos. Compuesto.' },
    salada: { titulo: 'Agua salada', caja: { forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 10 }, { e: 'Na', n: 3 }, { e: 'Cl', n: 3 }] }, lee: 'Agua salada: 3 especies, una fase. Mezcla homogénea.' },
    aceite: { titulo: 'Agua y aceite', caja: { forma: 'vaso', nivel: 0.9, particulas: [...rejilla('aceite', 6, 3, 0.18, 0.82, 0.1, 0.3), ...rejilla('H2O', 9, 3, 0.15, 0.85, 0.55, 0.92)] }, lee: 'Agua y aceite: 2 especies, dos fases. Mezcla heterogénea.' },
  };
  const muestra = k => lupa([Object.assign({ titulo: MUESTRAS[k].titulo }, MUESTRAS[k].caja)]);
  // En el juego las partículas se mueven: el oxígeno vuela (gas); el agua y lo disuelto se deslizan (líquido), y el
  // aceite y el agua se mueven cada uno en su capa, sin mezclarse.
  const muestraT = (k, t) => { const c = MUESTRAS[k].caja; return lupa([Object.assign({ titulo: MUESTRAS[k].titulo }, c, { particulas: mover(c.particulas, c.forma === 'cilindro' ? 'gas' : 'liquido', t) })]); };
  // Gesto directo (docs/teoria.md §4b): en las ideas con ejes, la manija es el punto del gráfico. Se ubica con
  // ejes.geometria y se lee con su inversa lineal (como en fisica/movimiento-rectilineo.js).
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));

  // Sin arrastre: el control elige entre muestras distintas; no hay una magnitud que agarrar en la lupa.
  const sustancia = {
    id: 'sustancia-mezcla',
    titulo: 'Sustancia o mezcla: mira dentro',
    temas: ['Qué estudia la química', 'Sustancias y mezclas'],
    pieza: 'quim-particulas',
    // Lee (fase 2): contexto y vocabulario. No dice cómo se clasifica una muestra que se ve uniforme (eso se predice).
    lee: {
      tarjetas: [
        { titulo: '¿De qué está hecho?', texto: 'La química estudia de qué está hecha la materia y cómo se transforma. El cobre de Toquepala, el gas de un balón o la chicha del mercado: todo está formado por partículas diminutas.' },
        { titulo: 'Especie y fase', texto: 'En la lupa, cada dibujo de átomos que se repite igual es una especie de partícula. Una fase es una zona que se ve igual en todos sus puntos: el agua y el aceite forman dos fases, una sobre otra.' },
        { titulo: 'Qué mirar', texto: 'Cuando juegues, cuenta dos cosas en cada muestra: cuántas especies distintas hay y si forman una capa o dos. Después compara lo que contaste con el aspecto de la muestra.' },
      ],
    },
    juega: {
      consigna: 'Las partículas se mueven solas, en cámara lenta. Elige una muestra y cuenta cuántas especies hay y si forman una o dos capas.',
      voz: 'Mira primero cuántas clases de partícula hay. El aspecto viene después.',
      controles: [{ id: 'k', etiqueta: 'Muestra', opciones: Object.keys(MUESTRAS).map(k => ({ valor: k, texto: MUESTRAS[k].titulo })) }, T_ANIMA],
      dibujo: val => muestraT(val.k, val.t),
      lectura: val => [`t = ${f(val.t, 1)} s · `, MUESTRAS[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Agua con azúcar bien disuelta se ve igual que agua pura: transparente y uniforme. Mirada con la lupa, ¿qué es?',
      voz: 'Anota tu predicción antes de abrir la lupa.',
      opciones: [
        { id: 'c', texto: 'Una mezcla homogénea', correcta: true },
        { id: 'pura', texto: 'Una sustancia pura, porque se ve uniforme', error: 'MA10', siFuera: 'Se ve uniforme, es cierto. Sería pura si la lupa mostrara una sola especie de partícula.' },
        { id: 'compuesto', texto: 'Un compuesto, porque tiene varios elementos', error: 'MA9', siFuera: 'Tiene varios elementos, sí. Un compuesto es una sola especie; aquí hay dos especies sueltas.' },
        { id: 'hetero', texto: 'Una mezcla heterogénea, porque tiene dos sustancias', error: 'QM-HOMO', siFuera: 'Hay dos sustancias, bien visto. Sería heterogénea si formaran dos fases separadas.' },
      ],
      dibujo: lupa([{ titulo: 'Agua con azúcar', forma: 'vaso', nivel: 0.85, particulas: [] }]),
      revelar: lupa([{ titulo: 'Agua con azúcar', forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 11 }, { e: 'azucar', n: 3 }] }]),
      coincide: 'Coincide: dos especies repartidas en una sola fase.',
      noCoincide: 'La lupa muestra dos especies mezcladas en una sola fase.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Oxígeno', forma: 'caja', particulas: [{ e: 'O2', n: 5, desde: 1 }] },
        { titulo: 'Agua', forma: 'caja', particulas: [{ e: 'H2O', n: 5, desde: 2 }] },
        { titulo: 'Agua salada', forma: 'caja', particulas: [{ e: 'H2O', n: 4, desde: 3 }, { e: 'Na', n: 2, desde: 3 }, { e: 'Cl', n: 2, desde: 3 }] },
      ], { separacion: 26 }).datos,
      voz: 'Comparemos las tres cajas especie por especie.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Oxígeno: una sola especie, hecha de un solo elemento.', ecuacion: ['sustancia simple: O₂'] },
        { estado: { corte: 2 }, texto: 'Agua: una sola especie con dos elementos unidos.', ecuacion: ['compuesto: H₂O'] },
        { estado: { corte: 3 }, texto: 'Agua salada: varias especies sueltas en una sola fase.', ecuacion: ['mezcla homogénea: H₂O + Na⁺ + Cl⁻'] },
        { estado: { corte: 3 }, texto: 'La química estudia de qué está hecho algo y cómo se transforma.' },
      ],
    },
    regla: {
      texto: 'Una sustancia tiene una sola especie de partícula: elemento si es un tipo de átomo, compuesto si son varios unidos. Una mezcla tiene varias especies.',
      ecuacion: ['homogénea: una fase', '   ·   ', 'heterogénea: varias fases'],
      condicion: 'se decide por las partículas y las fases, no por el aspecto: algo transparente y uniforme puede ser una mezcla.',
      voz: 'Cuenta especies, después fases. En ese orden.',
    },
    // Así se resuelve (fase 2): una muestra de «Ahora tú» con otra semilla, armada igual (mismas especies y rejilla).
    // Los elementos de cada especie los cuenta ESPECIES, la misma lista que dibuja la lupa.
    resuelve: {
      pieza: 'quim-particulas',
      generar(s) {
        const r = azar(s + 900);
        const tipo = ['elemento', 'compuesto', 'homogenea', 'heterogenea'][s % 4];
        let parts, n;
        if (tipo === 'elemento') { const e = r.de(['O2', 'N2', 'He', 'H2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'compuesto') { const e = r.de(['H2O', 'CO2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'homogenea') { const a = r.de([['N2', 'O2'], ['H2O', 'azucar'], ['O2', 'CO2'], ['H2O', 'Na']]); const na = r.ent(5, 8), nb = r.ent(2, 4); n = na + nb; parts = [{ e: a[0], n: na }, { e: a[1], n: nb }]; }
        else { const na = 3 * r.ent(1, 2), nb = 3 * r.ent(2, 3); n = na + nb; parts = [...rejilla('aceite', na, 3, 0.18, 0.82, 0.1, na > 3 ? 0.35 : 0.2), ...rejilla('H2O', nb, 3, 0.15, 0.85, 0.55, 0.92)]; }
        const forma = tipo === 'elemento' || (tipo === 'homogenea' && parts[0].e === 'N2') || (tipo === 'homogenea' && parts[0].e === 'O2') ? 'cilindro' : 'vaso';
        const NOM = { O2: 'oxígeno (O₂)', N2: 'nitrógeno (N₂)', He: 'helio (He)', H2: 'hidrógeno (H₂)', H2O: 'agua (H₂O)', CO2: 'dióxido de carbono (CO₂)', azucar: 'azúcar', Na: 'sodio (Na)', aceite: 'aceite' };
        const especies = [...new Set(parts.map(p => p.e))];
        const cuenta = e => parts.filter(p => p.e === e).reduce((a, p) => a + p.n, 0);
        const clases = e => new Set(ESPECIES[e].map(x => x[0])).size;     // clases de átomo de una especie
        const fases = tipo === 'heterogenea' ? 2 : 1;
        const lista = especies.map(e => `${cuenta(e)} de ${NOM[e]}`).join(' y ');
        const nombres = { elemento: 'Sustancia simple (elemento)', compuesto: 'Compuesto', homogenea: 'Mezcla homogénea', heterogenea: 'Mezcla heterogénea' };
        const e0 = especies[0];
        const aplica = {
          elemento: `Hay una sola especie, ${NOM[e0]}, y ${clases(e0) === 1 ? 'todos sus átomos son de la misma clase' : `tiene ${clases(e0)} clases de átomo`}: es una sustancia simple.`,
          compuesto: `Hay una sola especie, ${NOM[e0]}, pero con ${clases(e0)} clases de átomo unidas: es un compuesto.`,
          homogenea: `Hay ${especies.length} especies sueltas, repartidas en ${fases === 1 ? 'una sola fase' : `${fases} fases`}: es una mezcla homogénea.`,
          heterogenea: `Hay ${especies.length} especies, cada una en su capa: ${fases} fases. Es una mezcla heterogénea.`,
        }[tipo];
        const sentido = {
          elemento: 'Comprobación: si apareciera otra especie sería mezcla, y si sus átomos fueran de dos clases, compuesto.',
          compuesto: 'Comprobación: todas las partículas son iguales entre sí; por eso no es mezcla, aunque lleve dos elementos.',
          homogenea: 'Comprobación: no hay capas ni bordes dentro de la muestra; si los hubiera, sería heterogénea.',
          heterogenea: 'Comprobación: se ve un borde entre las dos capas; con una sola fase sería homogénea.',
        }[tipo];
        const dib = { datos: lupa([{ titulo: 'Muestra', forma, nivel: 0.9, particulas: parts }]).datos, estado: {} };
        return {
          enunciado: `Con la lupa se ven ${n} partículas en la muestra. ¿Cómo se clasifica?`,
          dibujo: dib,
          pasos: [
            { tipo: 'pide', texto: 'Piden clasificar la muestra: elemento, compuesto, mezcla homogénea o mezcla heterogénea.' },
            { tipo: 'datos', texto: `En la lupa cuento ${lista}: ${especies.length} ${especies.length === 1 ? 'especie' : 'especies'} en ${fases} ${fases === 1 ? 'fase' : 'fases'}.` },
            { tipo: 'regla', texto: 'Primero cuento especies: una sola es sustancia; varias, mezcla. Después miro cuántas clases de átomo tiene la especie, o cuántas fases forma la mezcla.' },
            { tipo: 'aplica', texto: aplica, ecuacion: [nombres[tipo]] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: nombres[tipo],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-particulas',
      voz: 'Una muestra nueva. Cuenta especies y fases.',
      generar(s) {
        const r = azar(s);
        const tipo = ['elemento', 'compuesto', 'homogenea', 'heterogenea'][s % 4];
        let parts, n;
        if (tipo === 'elemento') { const e = r.de(['O2', 'N2', 'He', 'H2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'compuesto') { const e = r.de(['H2O', 'CO2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'homogenea') { const a = r.de([['N2', 'O2'], ['H2O', 'azucar'], ['O2', 'CO2'], ['H2O', 'Na']]); const na = r.ent(5, 8), nb = r.ent(2, 4); n = na + nb; parts = [{ e: a[0], n: na }, { e: a[1], n: nb }]; }
        else { const na = 3 * r.ent(1, 2), nb = 3 * r.ent(2, 3); n = na + nb; parts = [...rejilla('aceite', na, 3, 0.18, 0.82, 0.1, na > 3 ? 0.35 : 0.2), ...rejilla('H2O', nb, 3, 0.15, 0.85, 0.55, 0.92)]; }
        const forma = tipo === 'elemento' || (tipo === 'homogenea' && parts[0].e === 'N2') || (tipo === 'homogenea' && parts[0].e === 'O2') ? 'cilindro' : 'vaso';
        const nombres = { elemento: 'Sustancia simple (elemento)', compuesto: 'Compuesto', homogenea: 'Mezcla homogénea', heterogenea: 'Mezcla heterogénea' };
        const si = {
          elemento: 'Sería elemento si hubiera una sola especie con un solo tipo de átomo.',
          compuesto: 'Sería compuesto si hubiera una sola especie con átomos de varios elementos unidos.',
          homogenea: 'Sería mezcla homogénea si hubiera varias especies repartidas en una sola fase.',
          heterogenea: 'Sería heterogénea si hubiera varias especies en fases separadas.',
        };
        const ops = Object.keys(nombres).map(k => (k === tipo ? { id: 'c', texto: nombres[k], correcta: true } : { id: k, texto: nombres[k], error: k === 'elemento' || k === 'compuesto' ? 'MA9' : 'MA10', siFuera: si[k] }));
        const porque = { elemento: 'Una sola especie, de un solo elemento.', compuesto: 'Una sola especie, con átomos de dos elementos unidos.', homogenea: 'Dos especies repartidas en una sola fase.', heterogenea: 'Dos especies en dos capas separadas.' };
        return {
          pregunta: `Con la lupa se ven ${n} partículas en la muestra. ¿Cómo se clasifica?`,
          dibujo: lupa([{ titulo: 'Muestra', forma, nivel: 0.9, particulas: parts }]),
          opciones: ops,
          solucion: { texto: porque[tipo], ecuacion: [nombres[tipo]] },
        };
      },
    },
  };

  // ---------- Idea 2: físico, químico o nuclear: ¿qué partícula cambia? ----------
  // Cambia: el proceso · Permanece: antes a la izquierda, después a la derecha, misma lupa · Progresa: de cambiar el
  // orden (estado) a cambiar las moléculas y, al final, el núcleo · Se reserva: el inventario de átomos que no
  // cambia en la reacción · Debe verse: si las partículas de después son las mismas de antes.
  const solido = e => rejilla(e, 9, 3, 0.2, 0.8, 0.45, 0.95);
  const PROCESOS = {
    funde: { texto: 'Fundir hielo', antes: { titulo: 'Hielo', forma: 'vaso', nivel: 0.95, particulas: solido('H2O') }, despues: { titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, lee: 'Mismas moléculas, otro orden: cambio físico de estado.' },
    hierve: { texto: 'Hervir agua', antes: { titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, despues: { titulo: 'Vapor', forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 5 }] }, lee: 'Mismas moléculas, más separadas: cambio físico de estado.' },
    disuelve: { texto: 'Disolver sal', antes: { titulo: 'Sal y agua', forma: 'vaso', nivel: 0.8, particulas: [...rejilla('Na', 2, 2, 0.3, 0.7, 0.85, 0.85), ...rejilla('Cl', 2, 2, 0.4, 0.8, 0.95, 0.95), ...rejilla('H2O', 6, 3, 0.15, 0.85, 0.1, 0.55)] }, despues: { titulo: 'Agua salada', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 6 }, { e: 'Na', n: 2 }, { e: 'Cl', n: 2 }] }, lee: 'Mismas partículas, ahora mezcladas: cambio físico.' },
    quema: { texto: 'Quemar hidrógeno', antes: { titulo: 'H₂ y O₂', forma: 'caja', particulas: [{ e: 'H2', n: 4 }, { e: 'O2', n: 2 }] }, despues: { titulo: 'Agua', forma: 'caja', particulas: [{ e: 'H2O', n: 4 }] }, lee: 'Aparecen moléculas nuevas con los mismos átomos: cambio químico.' },
    decae: { texto: 'Carbono-14 que decae', antes: { titulo: 'Carbono-14', forma: 'caja', particulas: [{ e: 'C', n: 6 }] }, despues: { titulo: 'Después', forma: 'caja', particulas: [{ e: 'C', n: 3 }, { e: 'N', n: 3, resalta: true }] }, lee: 'Cambia el núcleo: el átomo pasa a otro elemento. Nuclear.' },
  };
  const proceso = k => lupa([PROCESOS[k].antes, PROCESOS[k].despues], { flechas: true });
  // En el juego cada caja se mueve según su estado: el hielo vibra, el agua se desliza, el vapor y los gases vuelan.
  // En «disolver sal», antes, la sal está quieta en el fondo (sólido) y el agua se desliza encima.
  const MODOS = { funde: ['solido', 'liquido'], hierve: ['liquido', 'gas'], disuelve: [null, 'liquido'], quema: ['gas', 'gas'], decae: ['solido', 'solido'] };
  const LEE_CORTO = { funde: 'mismas moléculas, otro orden: físico.', hierve: 'mismas moléculas, más separadas: físico.', disuelve: 'mismas partículas, ahora mezcladas: físico.', quema: 'moléculas nuevas, mismos átomos: químico.', decae: 'cambia el núcleo y el elemento: nuclear.' };
  const procesoT = (k, t) => {
    const P = PROCESOS[k], [ma, md] = MODOS[k];
    const antes = ma ? P.antes.particulas : P.antes.particulas.map(g => Object.assign({ modo: g.e === 'H2O' ? 'liquido' : 'solido' }, g));
    return lupa([Object.assign({}, P.antes, { particulas: mover(antes, ma, t, 0) }), Object.assign({}, P.despues, { particulas: mover(P.despues.particulas, md, t, 1) })], { flechas: true });
  };
  // Sin arrastre: el control elige entre procesos distintos (antes y después); no hay una perilla natural.
  const cambios = {
    id: 'fisico-quimico-nuclear',
    titulo: '¿Qué partícula cambia?',
    temas: ['Estados de agregación', 'Propiedades físicas y químicas', 'Fenómenos físicos, químicos y nucleares'],
    pieza: 'quim-particulas',
    // Lee (fase 2): vocabulario de estados y propiedades. No dice qué hay dentro de las burbujas del hervor.
    lee: {
      tarjetas: [
        { titulo: 'Por fuera no basta', texto: 'Algunas cosas cambian solo de forma o de estado; otras se vuelven sustancias nuevas; en unas pocas cambia el núcleo del átomo. Para saber cuál pasó, no basta mirar por fuera: hay que mirar las partículas.' },
        { titulo: 'Estados de agregación', texto: 'Sólido, líquido y gas son los estados de agregación. En el sólido las partículas vibran en su sitio; en el líquido se deslizan unas junto a otras; en el gas vuelan separadas y chocan con las paredes.' },
        { titulo: 'Propiedades', texto: 'Una propiedad física se mide sin cambiar la sustancia, como la densidad. Una propiedad química aparece solo al transformarla: que el gas del balón arda o que el cobre se ponga verde con los años.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la caja de la izquierda es el antes y la de la derecha, el después. Compara si las partículas de después son las mismas de antes o son otras.' },
      ],
    },
    juega: {
      consigna: 'Elige un proceso: antes a la izquierda, después a la derecha. Las partículas se mueven en cámara lenta. Compara las dos cajas.',
      voz: 'Una observación no es una explicación: mira qué partículas hay después.',
      controles: [{ id: 'k', etiqueta: 'Proceso', opciones: Object.keys(PROCESOS).map(k => ({ valor: k, texto: PROCESOS[k].texto })) }, T_ANIMA],
      dibujo: val => procesoT(val.k, val.t),
      lectura: val => [`t = ${f(val.t, 1)} s · `, LEE_CORTO[val.k]],
      minimo: 3,
    },
    predice: {
      pregunta: 'Hierves agua pura y suben burbujas grandes desde el fondo. ¿Qué hay dentro de esas burbujas?',
      voz: 'Piensa en qué le pasa a cada molécula de agua.',
      opciones: [
        { id: 'c', texto: 'Moléculas de agua en estado gaseoso', correcta: true },
        { id: 'hyo', texto: 'Hidrógeno y oxígeno separados', error: 'EN13', siFuera: 'Separar H y O sería un cambio químico. Al hervir, cada molécula de agua sigue entera.' },
        { id: 'aire', texto: 'Aire que estaba disuelto en el agua', error: 'QM-AIRE', siFuera: 'Al calentar salen burbujitas de aire disuelto, cierto. Las grandes del hervor son de vapor.' },
        { id: 'vacio', texto: 'Nada: son espacios vacíos', error: 'QM-VACIO', siFuera: 'Entre partículas sí hay vacío. Pero la burbuja está llena de moléculas de agua separadas.' },
      ],
      dibujo: lupa([{ titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, { titulo: 'Burbuja', forma: 'caja', particulas: [] }], { flechas: true }),
      revelar: lupa([{ titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, { titulo: 'Burbuja', forma: 'caja', particulas: [{ e: 'H2O', n: 4 }] }], { flechas: true }),
      coincide: 'Coincide: la burbuja tiene las mismas moléculas, más separadas.',
      noCoincide: 'Dentro de la burbuja hay moléculas de agua enteras, solo más separadas.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: 4, desde: 1 }, { e: 'O2', n: 2, desde: 1 }], cuenta: [{ e: 'H', texto: '8', desde: 3 }, { e: 'O', texto: '4', desde: 3 }] },
        { titulo: 'Después', forma: 'caja', particulas: [{ e: 'H2O', n: 4, desde: 2 }], cuenta: [{ e: 'H', texto: '8', desde: 3 }, { e: 'O', texto: '4', desde: 3 }] },
      ], { flechas: true, separacion: 26 }).datos,
      voz: 'Revisemos el inventario de átomos antes y después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Antes: hidrógeno y oxígeno, dos especies distintas.', ecuacion: ['4 H₂ + 2 O₂'] },
        { estado: { corte: 2 }, texto: 'Después: una especie nueva, agua. Eso es un cambio químico.', ecuacion: ['→ 4 H₂O'] },
        { estado: { corte: 3 }, texto: 'Los átomos no cambian: 8 de H y 4 de O, solo reordenados.', ecuacion: ['H: 8 = 8', '   ·   ', 'O: 4 = 4'] },
        { estado: { corte: 3 }, texto: 'Al fundir o hervir, en cambio, las moléculas siguen siendo las mismas.' },
      ],
    },
    regla: {
      texto: 'Cambio físico: las mismas partículas cambian de orden o de estado. Químico: se forman especies nuevas con los mismos átomos. Nuclear: cambia el núcleo y el elemento.',
      ecuacion: ['2 H₂ + O₂ → 2 H₂O'],
      condicion: 'las propiedades físicas (fusión, densidad) se miden sin cambiar la sustancia; las químicas (arder, oxidarse) solo al transformarla.',
      voz: 'Primero el inventario de partículas; el aspecto puede engañar.',
    },
    // Así se resuelve (fase 2): un caso de «Ahora tú» elegido con otra semilla. El caso y su tipo salen del mismo
    // generar de «Ahora tú»; aquí solo se cuenta qué pasa con las partículas en cada caso.
    resuelve: {
      generar(s) {
        const at = cambios.ahoraTu.generar(azar(s + 900).ent(0, 9));
        const caso = String(at.pregunta).replace(/\. ¿Qué tipo de cambio es\?$/, '');
        const nom = at.opciones.find(o => o.correcta).texto, tipo = nom.toLowerCase();
        const PARTICULAS = {
          'Un cubo de hielo se derrite en la mesa': 'Antes y después hay moléculas de H₂O enteras: solo pasan de sólido a líquido.',
          'Un clavo de hierro se oxida al aire': 'El hierro se une al oxígeno del aire y forma óxido de hierro, una sustancia que antes no estaba.',
          'La leña arde en la cocina': 'La madera y el oxígeno se transforman en dióxido de carbono, agua y ceniza: sustancias nuevas.',
          'El azúcar se disuelve en el té': 'Las moléculas de azúcar siguen enteras; solo se reparten entre las moléculas del agua.',
          'El alcohol se evapora de un algodón': 'Las moléculas de alcohol pasan de líquido a gas sin romperse.',
          'Un núcleo de uranio-235 se parte en dos': 'El núcleo de uranio se divide en dos núcleos más livianos, de otros elementos.',
          'La leche se agria con el tiempo': 'Las bacterias transforman el azúcar de la leche en ácido láctico, otra sustancia.',
          'Un vidrio se rompe en pedazos': 'Los pedazos son del mismo vidrio: cambia la forma, no las partículas.',
          'Un átomo de radio-226 emite una partícula alfa y pasa a radón': 'El núcleo suelta dos protones y dos neutrones: el radio pasa a ser otro elemento, radón.',
          'El vinagre y el bicarbonato hacen burbujas de CO₂': 'El ácido del vinagre y el bicarbonato forman CO₂, una sustancia nueva.',
        };
        const sentido = {
          físico: 'Comprobación: si las partículas de después son las mismas de antes, no apareció ninguna sustancia nueva. Es físico.',
          químico: 'Comprobación: los átomos son los mismos antes y después, solo reordenados; por eso no es nuclear.',
          nuclear: 'Comprobación: después hay átomos de otro elemento; en un cambio químico el elemento nunca cambia.',
        }[tipo];
        return {
          enunciado: at.pregunta,
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si el cambio es físico, químico o nuclear.' },
            { tipo: 'regla', texto: 'Miro las partículas: si son las mismas, es físico; si se forman sustancias nuevas, químico; si cambia el núcleo y el elemento, nuclear.' },
            { tipo: 'aplica', texto: PARTICULAS[caso] || at.solucion.texto, ecuacion: [`Cambio ${tipo}`] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `Cambio ${tipo}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Decide por las partículas, no por lo que se ve.',
      generar(s) {
        const CASOS = [
          ['Un cubo de hielo se derrite en la mesa', 'fisico'], ['Un clavo de hierro se oxida al aire', 'quimico'],
          ['La leña arde en la cocina', 'quimico'], ['El azúcar se disuelve en el té', 'fisico'],
          ['El alcohol se evapora de un algodón', 'fisico'], ['Un núcleo de uranio-235 se parte en dos', 'nuclear'],
          ['La leche se agria con el tiempo', 'quimico'], ['Un vidrio se rompe en pedazos', 'fisico'],
          ['Un átomo de radio-226 emite una partícula alfa y pasa a radón', 'nuclear'], ['El vinagre y el bicarbonato hacen burbujas de CO₂', 'quimico'],
        ];
        const [caso, tipo] = CASOS[s % CASOS.length];
        const nom = { fisico: 'Físico', quimico: 'Químico', nuclear: 'Nuclear' };
        const si = { fisico: 'Sería físico si las mismas partículas solo cambiaran de orden o de estado.', quimico: 'Sería químico si aparecieran especies nuevas con los mismos átomos.', nuclear: 'Sería nuclear si cambiara el núcleo y, con él, el elemento.' };
        const err = { fisico: 'MA2', quimico: 'MA1', nuclear: 'QM-NUCLEAR' };
        const porque = { fisico: 'Las partículas son las mismas; solo cambian de orden o de lugar.', quimico: 'Se forman sustancias nuevas con los mismos átomos.', nuclear: 'Cambia el núcleo: el átomo pasa a ser de otro elemento.' };
        return {
          pregunta: `${caso}. ¿Qué tipo de cambio es?`,
          opciones: Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: err[tipo === 'fisico' ? 'quimico' : k] || err[k], siFuera: si[k] })),
          solucion: { texto: porque[tipo], ecuacion: [`Cambio ${nom[tipo].toLowerCase()}`] },
        };
      },
    },
  };

  // ---------- Idea 3: calor sensible y latente (la meseta) ----------
  // Cambia: el calor entregado · Permanece: 10 g de hielo a −20 °C, a 1 atm, y los ejes · Progresa: subida, meseta,
  // subida · Se reserva: la meseta de 0 °C (la temperatura no sube aunque entra calor) · Debe verse: el tramo plano.
  const MASA = 10, C_HIELO = 2.1, C_AGUA = 4.18, LF = 334;               // g, J/(g·°C), J/g
  const Q1 = MASA * C_HIELO * 20 / 1000, Q2 = Q1 + MASA * LF / 1000, Q3 = Q2 + MASA * C_AGUA * 100 / 1000; // kJ
  function estadoCalor(q) {
    if (q <= Q1) return { T: -20 + q * 1000 / (MASA * C_HIELO), fase: 'hielo' };
    if (q <= Q2) return { T: 0, fase: 'fundiendo', frac: (q - Q1) / (Q2 - Q1) };
    if (q <= Q3) return { T: (q - Q2) * 1000 / (MASA * C_AGUA), fase: 'agua' };
    return { T: 100, fase: 'hierve' };
  }
  const CURVA = [[0, -20], [Q1, 0], [Q2, 0], [Q3, 100]];
  const ejesCalor = (extra = {}) => Object.assign({
    x: { min: 0, max: 8, paso: 1, nombre: 'Q', unidad: 'kJ', decimales: 0, color: 'o' },
    y: { min: -20, max: 100, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    curvas: [{ puntos: CURVA, color: 'h' }],
    alt: 'Curva de calentamiento de 10 g de hielo desde −20 °C: sube hasta 0 °C, se queda plana mientras se funde y después sube hasta 100 °C.',
  }, extra);
  // La curva se dibuja hasta el calor entregado; lo que falta queda punteado, como camino por recorrer.
  function hastaQ(curva, q) {
    const out = [curva[0]];
    for (let i = 1; i < curva.length; i++) {
      const [x0, y0] = curva[i - 1], [x1, y1] = curva[i];
      if (q >= x1) { out.push(curva[i]); continue; }
      if (q > x0) out.push([q, y0 + (y1 - y0) * (q - x0) / (x1 - x0)]);
      break;
    }
    return out;
  }
  const dibCalor = val => { const e = estadoCalor(val.q); return { datos: ejesCalor({ curvas: [{ puntos: CURVA, color: 'h', discontinua: true }, { puntos: hastaQ(CURVA, val.q), color: 'h' }], puntos: [{ x: val.q, y: e.T, color: 'h', rotulo: `${f(e.T, 0)} °C` }] }), estado: {} }; };
  const calor = {
    id: 'calor-sensible-latente',
    titulo: 'Calor que no sube temperatura',
    temas: ['Calor sensible y latente'],
    pieza: 'ejes',
    // Lee (fase 2): calor, temperatura y cambios de fase. No dice qué hace la temperatura mientras el hielo se funde.
    lee: {
      tarjetas: [
        { titulo: 'Calor y temperatura', texto: 'El calor es energía que pasa de un cuerpo caliente a uno más frío, y se mide en joules (J). La temperatura dice qué tan caliente está algo, y se mide en grados Celsius. No son lo mismo.' },
        { titulo: 'Cada sustancia pide lo suyo', texto: 'Para subir 1 °C, cada gramo de una sustancia pide su propio calor: es su calor específico. El agua pide mucho; por eso el lago Titicaca tarda en calentarse y en enfriarse, y suaviza el frío de sus orillas.' },
        { titulo: 'Cambios de fase', texto: 'Fundir es pasar de sólido a líquido; hervir, de líquido a gas. En las heladas de Puno, el agua de los charcos se congela de noche y se funde con el sol de la mañana.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el punto avanza a la derecha cuando entra calor y sube cuando sube la temperatura. Fíjate en qué tramos hace las dos cosas y en cuáles solo una.' },
      ],
    },
    juega: {
      consigna: 'El calor entra solo, a ritmo fijo, a 10 g de hielo que empiezan a −20 °C. Mira el tramo donde el punto no sube.',
      voz: 'Fíjate en el tramo donde el punto avanza sin subir.',
      controles: [{ id: 'q', etiqueta: 'Q', color: 'c-o', min: 0, max: 8, paso: 0.5, inicio: 0, unidad: 'kJ', decimales: 1, auto: { velocidad: 0.8 } }],
      dibujo: val => dibCalor(val),
      lectura: val => { const e = estadoCalor(val.q); return [Tm, ` = ${f(e.T, 1)} °C · ${e.fase === 'fundiendo' ? `fundido ${f(100 * e.frac, 0)} %` : e.fase}`]; },
      minimo: 3,
      // Se agarra el punto y se lo empuja a lo largo de la curva: la manija mueve Q y la temperatura responde (o no, en la meseta).
      arrastres: [{ id: 'calor', etiqueta: 'punto de la curva: calor entregado', color: 'c-o',
        donde: val => { const g = EJES().geometria(dibCalor(val).datos); return { x: g.X(val.q), y: g.Y(estadoCalor(val.q).T) }; },
        mover: (pt, val) => ({ q: inversa(EJES().geometria(dibCalor(val).datos).X, 0, 8)(pt.x) }) }],
    },
    predice: {
      pregunta: ['Una muestra de 10 g de hielo a 0 °C recibe 1 kJ y todavía no termina de fundirse. ¿Cuánto subió su ', Tm, '?'],
      voz: 'Tómate tu tiempo; es una pregunta sobre la meseta.',
      opciones: [
        { id: 'c', texto: 'Nada: sigue a 0 °C', correcta: true },
        { id: 'formula', texto: `${f(1000 / (MASA * C_AGUA), 0)} °C, con Q = mcΔT`, error: 'MA6', siFuera: 'Q = mcΔT vale cuando no hay cambio de fase. Aquí el calor se usa en fundir.' },
        { id: 'algo', texto: 'Un poco: todo calor sube la temperatura', error: 'MA6', siFuera: 'Sería cierto fuera de la meseta. Mientras se funde, el calor rompe el orden del sólido.' },
        { id: 'baja', texto: 'Bajó, porque el hielo enfría', error: 'QM-ENFRIA', siFuera: 'El hielo enfría lo que lo rodea, sí. Él mismo recibe calor y no se enfría.' },
      ],
      dibujo: { datos: ejesCalor({ curvas: [{ puntos: CURVA.slice(0, 2), color: 'h' }], puntos: [{ x: Q1, y: 0, color: 'h', rotulo: '0 °C' }] }), estado: {} },
      revelar: { datos: ejesCalor({ puntos: [{ x: Q1, y: 0, color: 'h' }, { x: Q1 + 1, y: 0, color: 'h', rotulo: '+1 kJ: 0 °C', guias: true }] }), estado: {} },
      coincide: 'Coincide: en la meseta el calor funde y la temperatura no cambia.',
      noCoincide: 'Mientras se funde, el calor va al cambio de fase: la temperatura se queda en 0 °C.',
    },
    mira: {
      datos: ejesCalor({
        curvas: [{ puntos: CURVA.slice(0, 2), color: 'h', desde: 1 }, { puntos: CURVA.slice(1, 3), color: 'h', desde: 2 }, { puntos: CURVA.slice(2, 4), color: 'h', desde: 3 }],
        areas: [],
        puntos: [{ x: Q1, y: 0, color: 'o', rotulo: `${f(Q1, 2)} kJ`, desde: 1 }, { x: Q2, y: 0, color: 'o', rotulo: `${f(Q2, 2)} kJ`, desde: 2 }, { x: Q3, y: 100, color: 'o', rotulo: `${f(Q3, 2)} kJ`, desde: 3 }],
      }),
      voz: 'Separemos el calor tramo por tramo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El hielo sube de −20 °C a 0 °C: calor sensible.', ecuacion: [Q, ' = ', m, 'c', dT, ` = ${f(MASA, 0)} · ${f(C_HIELO)} · 20 = ${f(Q1 * 1000, 0)} J`] },
        { estado: { corte: 2 }, texto: 'A 0 °C se funde sin subir: calor latente.', ecuacion: [Q, ' = ', m, 'L', ` = ${f(MASA, 0)} · ${f(LF, 0)} = ${f(MASA * LF, 0)} J`] },
        { estado: { corte: 3 }, texto: 'El agua líquida sube de 0 °C a 100 °C.', ecuacion: [Q, ' = ', m, 'c', dT, ` = ${f(MASA, 0)} · ${f(C_AGUA)} · 100 = ${f(MASA * C_AGUA * 100, 0)} J`] },
        { estado: { corte: 3 }, texto: 'El total es la suma de los tres tramos.', ecuacion: [Q, ` = ${f(Q1 * 1000, 0)} + ${f(MASA * LF, 0)} + ${f(MASA * C_AGUA * 100, 0)} = ${f(Q3 * 1000, 0)} J`] },
      ],
    },
    regla: {
      texto: 'Sin cambio de fase, el calor sube la temperatura (calor sensible). Durante un cambio de fase, la temperatura no cambia y el calor va al cambio (calor latente).',
      ecuacion: [Q, ' = ', m, { llave: ['c'], nota: 'específico' }, ...dT, '   ·   ', Q, ' = ', m, { llave: ['L'], nota: 'latente' }],
      condicion: 'solo para una sustancia pura a presión fija. A 1 atm el agua hierve a 100 °C; en Juliaca, a 87 °C.',
      voz: 'Antes de usar una fórmula, pregunta en qué tramo estás.',
    },
    // Así se resuelve (fase 2): los dos casos de «Ahora tú» (agua que se calienta o hielo que se funde), con otras
    // semillas y las mismas cuentas (C_AGUA, LF). La figura es el tramo de la curva que recorre ese calor.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        // Tope del eje: el menor múltiplo de un paso «redondo» que deja el valor con 5 marcas o menos.
        const tope = v => { const p = [1, 2, 5, 10, 20, 50].find(k => Math.ceil(v / k) <= 5) || 100; return { max: Math.ceil(v / p) * p, paso: p }; };
        if (s % 2) {
          const mm = 10 * r.ent(2, 30), dt = 5 * r.ent(2, 12), q = mm * C_AGUA * dt;
          const ex = tope(q / 1000), ey = tope(dt);
          const ejes = extra => ({ datos: Object.assign({ x: { min: 0, max: ex.max, paso: ex.paso, nombre: 'Q', unidad: 'kJ', decimales: 0, color: 'o' },
            y: { min: 0, max: ey.max, paso: ey.paso, nombre: 'ΔT', unidad: '°C', decimales: 0, color: 'h' }, curvas: [],
            alt: `Calor entregado contra lo que sube la temperatura de ${f(mm, 0)} g de agua líquida.` }, extra), estado: {} });
          return {
            enunciado: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de agua líquida para subir `, ...dT, ` = ${f(dt, 0)} °C? (c = 4,18 J/g·°C)`],
            dibujo: ejes({ puntos: [{ x: 0, y: 0, color: 'h' }] }),
            pasos: [
              { tipo: 'pide', texto: ['Piden el calor ', Q, ' que sube la temperatura del agua. Sigue líquida: no hay cambio de fase.'] },
              { tipo: 'datos', texto: [m, ` = ${f(mm, 0)} g, `, ...dT, ` = ${f(dt, 0)} °C y c = ${f(C_AGUA)} J/(g·°C), el calor específico del agua líquida.`] },
              { tipo: 'regla', texto: 'Sin cambio de fase, el calor sube la temperatura: se multiplica la masa por el calor específico y por lo que sube.',
                ecuacion: [Q, ' = ', m, 'c', ...dT] },
              { tipo: 'cuentas', texto: 'Reemplazo los tres datos.', ecuacion: [Q, ` = ${f(mm, 0)} · ${f(C_AGUA)} · ${f(dt, 0)} = ${f(q, 0)} J`],
                dibujo: ejes({ curvas: [{ puntos: [[0, 0], [q / 1000, dt]], color: 'h' }], puntos: [{ x: q / 1000, y: dt, color: 'h', rotulo: `${f(q / 1000, 1)} kJ`, guias: true }] }) },
              { tipo: 'sentido', texto: `Unidades: g · J/(g·°C) · °C deja joules. Y de vuelta: ${f(q, 0)} J entre ${f(mm, 0)} g y ${f(dt, 0)} °C da ${f(q / (mm * dt))} J/(g·°C), el dato de c.` },
            ],
            respuesta: [Q, ` = ${f(q, 0)} J`],
          };
        }
        const mm = 5 * r.ent(2, 40), q = mm * LF;
        const ex = tope(q / 1000);
        const ejes = extra => ({ datos: Object.assign({ x: { min: 0, max: ex.max, paso: ex.paso, nombre: 'Q', unidad: 'kJ', decimales: 0, color: 'o' },
          y: { min: -10, max: 10, paso: 5, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' }, curvas: [],
          alt: `Calor entregado a ${f(mm, 0)} g de hielo a 0 °C mientras se funde: la temperatura se queda en 0 °C.` }, extra), estado: {} });
        return {
          enunciado: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de hielo a 0 °C para fundirse por completo? (L = 334 J/g)`],
          dibujo: ejes({ puntos: [{ x: 0, y: 0, color: 'h', rotulo: '0 °C' }] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el calor ', Q, ' que funde todo el hielo. Ya está a 0 °C: solo falta el cambio de fase.'] },
            { tipo: 'datos', texto: [m, ` = ${f(mm, 0)} g de hielo y L = ${f(LF, 0)} J/g, el calor latente de fusión.`] },
            { tipo: 'regla', texto: 'Mientras se funde, la temperatura se queda en 0 °C y cada gramo pide su calor latente: masa por L.',
              ecuacion: [Q, ' = ', m, 'L'] },
            { tipo: 'cuentas', texto: 'Reemplazo la masa y el calor latente.', ecuacion: [Q, ` = ${f(mm, 0)} · ${f(LF, 0)} = ${f(q, 0)} J`],
              dibujo: ejes({ curvas: [{ puntos: [[0, 0], [q / 1000, 0]], color: 'h' }], puntos: [{ x: q / 1000, y: 0, color: 'h', rotulo: `${f(q / 1000, 2)} kJ`, guias: true }] }) },
            { tipo: 'sentido', texto: `Unidades: g · J/g deja joules. Y de vuelta: ${f(q, 0)} J entre ${f(mm, 0)} g da ${f(q / mm, 0)} J por gramo, el dato de L.` },
          ],
          respuesta: [Q, ` = ${f(q, 0)} J`],
        };
      },
    },
    ahoraTu: {
      voz: 'Decide primero si hay cambio de fase.',
      generar(s) {
        const r = azar(s);
        if (s % 2) {
          const mm = 10 * r.ent(2, 30), dt = 5 * r.ent(2, 12), q = mm * C_AGUA * dt;
          return {
            pregunta: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de agua líquida para subir `, dT, ` = ${f(dt, 0)} °C? (c = 4,18 J/g·°C)`],
            opciones: opciones(q, [
              { id: 'sin-c', valor: mm * dt, error: 'QM-SIN-C', siFuera: 'Eso multiplica masa por grados. Falta la capacidad calorífica del agua.' },
              { id: 'latente', valor: mm * LF, error: 'MA6', siFuera: 'Eso sería fundir esa masa de hielo. Aquí el agua solo se calienta.' },
              { id: 'sin-m', valor: C_AGUA * dt, error: 'QM-SIN-M', siFuera: 'Eso sería para 1 g. Hay que multiplicar por la masa.' },
            ], n => `${f(n, 0)} J`),
            solucion: { texto: 'No hay cambio de fase: calor sensible.', ecuacion: [Q, ` = ${f(mm, 0)} · 4,18 · ${f(dt, 0)} = ${f(q, 0)} J`] },
          };
        }
        const mm = 5 * r.ent(2, 40), q = mm * LF;
        return {
          pregunta: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de hielo a 0 °C para fundirse por completo? (L = 334 J/g)`],
          opciones: opciones(q, [
            { id: 'cero', valor: 0, error: 'QM-CERO', siFuera: 'La temperatura no cambia, cierto. Pero el calor sí entra: se gasta en fundir.' },
            { id: 'sensible', valor: mm * C_HIELO, error: 'MA6', siFuera: 'Eso usa la capacidad calorífica. En la fusión cuenta el calor latente.' },
            { id: 'sin-m', valor: LF, error: 'QM-SIN-M', siFuera: 'Eso alcanza para 1 g. Hay que multiplicar por la masa.' },
          ], n => `${f(n, 0)} J`),
          solucion: { texto: 'A 0 °C el hielo se funde sin subir de temperatura: calor latente.', ecuacion: [Q, ' = ', m, `L = ${f(mm, 0)} · 334 = ${f(q, 0)} J`] },
        };
      },
    },
  };

  // ---------- Idea 4: la energía nuclear sale de una pérdida de masa ----------
  // Cambia: la masa que desaparece · Permanece: la recta E = Δm·c² y sus ejes · Progresa: de mg a gramos; de lo
  // químico (no se nota) a lo nuclear (se nota) · Se reserva: el punto de la combustión, pegado al origen · Debe
  // verse: que E crece en proporción a Δm con una constante enorme.
  const C2 = 9e16;                                                      // c² en m²/s²
  const ejesMasa = (max, extra = {}) => Object.assign({
    x: { min: 0, max, paso: max / 5, nombre: 'Δm', unidad: 'mg', decimales: 0, color: 'i' },
    y: { min: 0, max: max * 0.09, paso: max * 0.018, nombre: 'E', unidad: 'TJ', decimales: 0, color: 'd' },
    curvas: [{ puntos: [[0, 0], [max, max * 0.09]], color: 'd' }],
    alt: `Recta de la energía contra la masa que desaparece: E = Δm·c². Cada miligramo da 90 000 millones de joules (0,09 TJ).`,
  }, extra);
  const dibMasa = val => ({ datos: ejesMasa(100, { puntos: [{ x: val.mg, y: val.mg * 0.09, color: 'd', rotulo: `${f(val.mg * 0.09, 1)} TJ`, guias: true }] }), estado: {} });
  // Mientras Δm sube y baja sola, se lee en pasos de 10 mg (los del control).
  const mg10 = val => Object.assign({}, val, { mg: Math.round(val.mg / 10) * 10 });
  const energia = {
    id: 'masa-energia',
    titulo: 'La energía nuclear pierde masa',
    temas: ['Equivalencia masa-energía'],
    pieza: 'ejes',
    // Lee (fase 2): contexto y unidades. No da la fórmula ni la cuenta de un gramo (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Masa y energía', texto: 'En 1905, Einstein propuso que la masa y la energía están ligadas: cuando un sistema suelta energía, su masa baja un poquito. En la cuenta entra la rapidez de la luz, que es enorme.' },
        { titulo: 'Químico y nuclear', texto: 'Al quemar el gas de Camisea en una cocina se libera energía por una reacción química: los átomos se reordenan. En un reactor nuclear, en cambio, se transforman los núcleos. Las dos cosas sueltan energía.' },
        { titulo: 'Las unidades', texto: 'La masa que desaparece se mide aquí en miligramos (mg): mil miligramos hacen un gramo. La energía sale en joules (J); un terajoule (TJ) es un billón de joules.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el eje de abajo es la masa que desaparece y el de la izquierda, la energía que sale. Mira qué le pasa a la energía cuando la masa se duplica.' },
      ],
    },
    juega: {
      consigna: 'La masa que desaparece en un proceso nuclear sube y baja sola. Lee cuánta energía sale; pausa o arrastra el punto.',
      voz: 'Mira qué tan empinada es esta recta.',
      controles: [{ id: 'mg', etiqueta: 'Δm', color: 'c-i', min: 10, max: 100, paso: 10, inicio: 10, unidad: 'mg', decimales: 0, auto: { velocidad: 25, modo: 'rebota' } }],
      dibujo: val => dibMasa(mg10(val)),
      lectura: val => [dm, ` = ${f(mg10(val).mg, 0)} mg · `, E, ` = ${cien(mg10(val).mg * 1e-6 * C2)} J`],
      minimo: 3,
      // Se agarra el punto y se lo sube por la recta: la manija mueve Δm y la energía responde en el eje vertical.
      arrastres: [{ id: 'masa', etiqueta: 'punto de la recta: masa que desaparece', color: 'c-i',
        donde: val => { const g = EJES().geometria(dibMasa(val).datos), q = mg10(val).mg; return { x: g.X(q), y: g.Y(q * 0.09) }; },
        mover: (pt, val) => ({ mg: inversa(EJES().geometria(dibMasa(val).datos).X, 0, 100)(pt.x) }) }],
    },
    predice: {
      pregunta: ['En un reactor desaparece 1 g de masa. Con c = 3 × 10⁸ m/s, ¿cuánta energía ', E, ' se libera?'],
      voz: 'Revisa las unidades antes de multiplicar.',
      opciones: [
        { id: 'c', texto: '9 × 10¹³ J', correcta: true },
        { id: 'kg', texto: '9 × 10¹⁶ J', error: 'QM-G-KG', siFuera: 'Ese sería el resultado con 1 kg. Un gramo es 0,001 kg.' },
        { id: 'sin-cuadrado', texto: '3 × 10⁵ J', error: 'QM-MC', siFuera: 'Eso multiplica por c una sola vez. La fórmula usa c al cuadrado.' },
        { id: 'quimica', texto: 'Casi nada, como al quemar algo', error: 'QM-NUCLEAR', siFuera: 'Al quemar, la masa perdida es tan pequeña que no se mide. Aquí desaparece un gramo entero.' },
      ],
      dibujo: { datos: ejesMasa(1000), estado: {} },
      revelar: { datos: ejesMasa(1000, { puntos: [{ x: 1000, y: 90, color: 'd', rotulo: '90 TJ = 9 × 10¹³ J', guias: true }] }), estado: {} },
      coincide: 'Coincide: 0,001 kg por 9 × 10¹⁶ m²/s².',
      noCoincide: 'Un gramo es 0,001 kg; por c² da 9 × 10¹³ J.',
    },
    mira: {
      datos: ejesMasa(1000, {
        puntos: [
          { x: 0.00037, y: 0.000033, color: 'i', rotulo: 'quemar 1 kg de carbón', desde: 1 },
          { x: 911, y: 82, color: 'd', rotulo: 'fisión de 1 kg de uranio-235', guias: true, desde: 2 },
        ],
      }),
      voz: 'Comparemos un proceso químico con uno nuclear.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Quemar 1 kg de carbón libera unos 3,3 × 10⁷ J.', ecuacion: [dm, ' = ', { frac: [E, 'c²'] }, ` = ${cien(3.3e7 / C2)} kg`] },
        { estado: { corte: 1 }, texto: 'Esa masa perdida es tan pequeña que ninguna balanza la nota.' },
        { estado: { corte: 2 }, texto: 'Fisionar 1 kg de uranio-235 libera unos 8,2 × 10¹³ J.', ecuacion: [dm, ' = ', { frac: [E, 'c²'] }, ` = ${f(8.2e13 / C2 * 1e6, 0)} mg`] },
        { estado: { corte: 2 }, texto: 'En lo nuclear se pierde casi un gramo: eso sí se mide.' },
      ],
    },
    regla: {
      texto: 'Cuando un sistema libera energía, su masa disminuye un poco. En lo químico la diferencia no se mide; en lo nuclear, sí.',
      ecuacion: [E, ' = ', { llave: dm, nota: 'masa perdida', color: 'c-i' }, ' · ', { llave: [{ sup: ['c', '2'] }], nota: 'c: la luz' }],
      condicion: 'Δm es la diferencia de masa del sistema antes y después, en kg, no la masa total; c = 3 × 10⁸ m/s.',
      voz: 'La masa no se vuelve calor entera: solo la diferencia.',
    },
    // Así se resuelve (fase 2): el caso de «Ahora tú» con otra semilla, con las mismas cuentas (mg → kg y C2).
    resuelve: {
      generar(s) {
        const r = azar(s + 900), mg = r.ent(2, 90) * 10, kg = mg * 1e-6, e = kg * C2;
        return {
          enunciado: ['En un proceso nuclear desaparecen ', ...dm, ` = ${f(mg, 0)} mg. ¿Cuánta energía `, E, ' se libera? (c = 3 × 10⁸ m/s)'],
          dibujo: { datos: ejesMasa(1000), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la energía ', E, ' que sale cuando desaparece esa masa en el proceso nuclear.'] },
            { tipo: 'datos', texto: [...dm, ` = ${f(mg, 0)} mg. Paso a kilogramos: 1 mg es 10⁻⁶ kg.`], ecuacion: [...dm, ` = ${f(mg, 0)} · 10⁻⁶ = ${cien(kg)} kg`] },
            { tipo: 'regla', texto: 'La energía que sale es la masa perdida, en kilogramos, por la rapidez de la luz al cuadrado.',
              ecuacion: [E, ' = ', ...dm, ' · c², con c² = (3 × 10⁸)² = 9 × 10¹⁶ m²/s²'] },
            { tipo: 'cuentas', texto: 'Multiplico la masa en kilogramos por c².', ecuacion: [E, ` = ${cien(kg)} · 9 × 10¹⁶ = ${cien(e, 2)} J`],
              dibujo: { datos: ejesMasa(1000, { puntos: [{ x: mg, y: mg * 0.09, color: 'd', rotulo: `${f(mg * 0.09, 1)} TJ`, guias: true }] }), estado: {} } },
            { tipo: 'sentido', texto: `Unidades: kg · m²/s² es un joule. Y ${cien(e, 2)} J son ${f(e / 1e12, 1)} TJ, lo que marca la recta en ${f(mg, 0)} mg.` },
          ],
          respuesta: [E, ` = ${cien(e, 2)} J`],
        };
      },
    },
    ahoraTu: {
      voz: 'Pasa la masa a kilogramos primero.',
      generar(s) {
        const r = azar(s), mg = r.ent(2, 90) * 10, kg = mg * 1e-6, e = kg * C2;
        return {
          pregunta: ['En un proceso nuclear desaparecen ', dm, ` = ${f(mg, 0)} mg. ¿Cuánta energía `, E, ' se libera? (c = 3 × 10⁸ m/s)'],
          opciones: opciones(e, [
            { id: 'g', valor: e * 1000, error: 'QM-G-KG', siFuera: 'Eso trata los miligramos como gramos. 1 mg = 10⁻⁶ kg.' },
            { id: 'c1', valor: kg * 3e8, error: 'QM-MC', siFuera: 'Eso usa c una sola vez; la fórmula pide c².' },
            { id: 'mg', valor: mg * C2, error: 'QM-G-KG', siFuera: 'Eso usa los miligramos sin pasarlos a kilogramos.' },
          ], n => `${cien(n)} J`),
          solucion: { texto: `${f(mg, 0)} mg son ${cien(kg)} kg; se multiplica por c².`, ecuacion: [E, ` = ${cien(kg)} · 9 × 10¹⁶ = ${cien(e)} J`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: 10 g de hielo desde la temperatura que se elija, hasta pasar los 100 °C: aparece la segunda meseta
  // (hervir), que la idea 3 no alcanza. Vaporización 2260 J/g y vapor 2,0 J/(g·°C).
  const LV = 2260, C_VAPOR = 2.0;
  function tramos(t0) {
    const a = MASA * C_HIELO * -t0 / 1000, b = a + MASA * LF / 1000, c = b + MASA * C_AGUA * 100 / 1000, d = c + MASA * LV / 1000;
    return { a, b, c, d };
  }
  function estadoLab(t0, q) {
    const k = tramos(t0);
    if (q <= k.a) return { T: t0 + q * 1000 / (MASA * C_HIELO), lee: 'hielo' };
    if (q <= k.b) return { T: 0, lee: `fundido ${f(100 * (q - k.a) / (k.b - k.a), 0)} %` };
    if (q <= k.c) return { T: (q - k.b) * 1000 / (MASA * C_AGUA), lee: 'agua líquida' };
    if (q <= k.d) return { T: 100, lee: `hervido ${f(100 * (q - k.c) / (k.d - k.c), 0)} %` };
    return { T: 100 + (q - k.d) * 1000 / (MASA * C_VAPOR), lee: 'vapor' };
  }
  const QMAX = 32;
  const dibLab = val => {
    const k = tramos(val.t0), e = estadoLab(val.t0, val.q);
    const curva = [[0, val.t0], [k.a, 0], [k.b, 0], [k.c, 100], [k.d, 100], [QMAX, estadoLab(val.t0, QMAX).T]];
    return { datos: ejesCalor({
      x: { min: 0, max: QMAX, paso: 4, nombre: 'Q', unidad: 'kJ', decimales: 0, color: 'o' },
      y: { min: -40, max: 200, paso: 40, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
      curvas: [{ puntos: curva, color: 'h', discontinua: true }, { puntos: hastaQ(curva, val.q), color: 'h' }],
      puntos: [{ x: val.q, y: e.T, color: 'h', rotulo: `${f(e.T, 0)} °C` }],
      alt: `Curva de calentamiento de 10 g de agua desde ${f(val.t0, 0)} °C hasta ${f(QMAX, 0)} kJ: meseta corta a 0 °C (fundir) y meseta larga a 100 °C (hervir). Con ${f(val.q, 1)} kJ está a ${f(e.T, 0)} °C.`,
    }), estado: {} };
  };
  // Mesa 2: hasta un gramo que desaparece, comparado con el carbón que habría que quemar (3,3 × 10⁷ J por kg).
  const E_CARBON = 3.3e7;
  const energiaMg = mg => mg * 1e-6 * C2, carbon = mg => energiaMg(mg) / E_CARBON / 1000;   // J y toneladas de carbón
  const dibGramo = val => ({ datos: ejesMasa(1000, { puntos: [{ x: val.mg, y: val.mg * 0.09, color: 'd', rotulo: `${f(val.mg * 0.09, 1)} TJ`, guias: true }] }), estado: {} });

  return {
    unidad: 'quimica.materia-y-energia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En el siglo XVIII, para entender una combustión había que decidir qué pesar: solo el sólido o también el aire. Las mediciones de Lavoisier y de otros mostraron que una muestra puede ganar masa al tomar un gas. Por eso importa dónde termina el sistema que se estudia. La relación entre masa y energía llegó mucho después, con la física del siglo XX.',
      pregunta: '¿Qué pesarías para saber si algo pierde masa al quemarse?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §1.2', url: 'https://openstax.org/books/chemistry-2e/pages/1-2-phases-and-classification-of-matter' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      { termino: 'sustancia', formas: ['sustancia pura', 'sustancias puras', 'sustancia', 'sustancias'],
        def: 'Materia formada por una sola especie de partícula, con propiedades fijas: el agua, el oxígeno, la sal.',
        ver: ['elemento', 'compuesto', 'mezcla'] },
      { termino: 'elemento', def: 'Sustancia con átomos de una sola clase. No se descompone en otras más simples por medios químicos.',
        ejemplo: 'El oxígeno O₂: moléculas de dos átomos, los dos de oxígeno.', ver: ['compuesto'] },
      { termino: 'compuesto', def: 'Sustancia con dos o más clases de átomos unidos en proporción fija.',
        ejemplo: 'El agua H₂O: siempre 2 átomos de hidrógeno por 1 de oxígeno.', ver: ['elemento', 'molécula'] },
      { termino: 'molécula', def: 'Grupo de átomos unidos que viaja junto: la partícula más pequeña de muchas sustancias.',
        ejemplo: 'Una molécula de CO₂ lleva 1 carbono y 2 oxígenos: 3 átomos.', ver: ['compuesto'] },
      { termino: 'mezcla', def: 'Dos o más sustancias juntas que no se unen químicamente y se pueden separar por medios físicos.',
        ver: ['mezcla homogénea', 'mezcla heterogénea'] },
      { termino: 'mezcla homogénea', formas: ['mezcla homogénea', 'mezclas homogéneas'],
        def: 'Mezcla que se ve igual en todas sus partes: tiene una sola fase.', ejemplo: 'Agua con azúcar disuelta.', ver: ['fase'] },
      { termino: 'mezcla heterogénea', formas: ['mezcla heterogénea', 'mezclas heterogéneas'],
        def: 'Mezcla en la que se distinguen partes distintas: tiene dos o más fases.', ejemplo: 'Agua con aceite: dos capas.', ver: ['fase'] },
      { termino: 'fase', def: 'Parte de un sistema con las mismas propiedades en todos sus puntos, separada de las otras por un borde.',
        ejemplo: 'Hielo flotando en agua: una sola sustancia, dos fases.' },
      { termino: 'cambio físico', formas: ['cambio físico', 'cambios físicos'],
        def: 'Transformación en la que las partículas siguen siendo las mismas: cambian de orden, de lugar o de estado.',
        ejemplo: 'Fundir hielo: antes y después hay moléculas de H₂O.', ver: ['cambio químico'] },
      { termino: 'cambio químico', formas: ['cambio químico', 'cambios químicos'],
        def: 'Transformación en la que aparecen sustancias nuevas, armadas con los mismos átomos reordenados.',
        ejemplo: 'El hierro que se oxida forma óxido de hierro.', ver: ['cambio físico', 'cambio nuclear'] },
      { termino: 'cambio nuclear', formas: ['cambio nuclear', 'cambios nucleares', 'proceso nuclear', 'procesos nucleares'],
        def: 'Transformación del núcleo de los átomos: el elemento pasa a ser otro y se libera mucha energía.',
        ejemplo: 'El radio-226 emite una partícula alfa y queda radón-222.', ver: ['cambio químico'] },
      { termino: 'energía', simbolo: 'E', medida: 'J', def: 'Lo que permite calentar, mover o transformar algo. Se mide en joules.',
        ver: ['calor sensible', 'calor latente'] },
      { termino: 'calor sensible', def: 'Calor que sube o baja la temperatura de un cuerpo sin cambiarle el estado.',
        ejemplo: 'Calentar 10 g de agua 20 °C: 10 · 4,18 · 20 = 836 J.', ver: ['calor específico', 'calor latente'] },
      { termino: 'calor latente', simbolo: 'L', medida: 'J/g', def: 'Calor que cambia el estado de un gramo sin cambiar su temperatura.',
        ejemplo: 'Fundir 10 g de hielo a 0 °C: 10 · 334 = 3340 J.', ver: ['calor sensible', 'fase'] },
      { termino: 'calor específico', simbolo: 'c', medida: 'J/(g·°C)',
        def: 'Calor que necesita un gramo de una sustancia para subir 1 °C.', ejemplo: 'Agua líquida: 4,18 J/(g·°C); hielo: 2,1 J/(g·°C).',
        ver: ['calor sensible'] },
      { termino: 'especie', formas: ['especie', 'especies'], def: 'Cada clase de partícula de una muestra: todas las de una misma clase son iguales entre sí.',
        ejemplo: 'Agua con azúcar: dos especies, las moléculas de agua y las de azúcar.', ver: ['sustancia', 'mezcla'] },
      { termino: 'estado de agregación', formas: ['estado de agregación', 'estados de agregación'],
        def: 'Forma en que se juntan las partículas: sólido (vibran en su sitio), líquido (se deslizan) o gas (vuelan separadas).',
        ver: ['cambio físico', 'fase'] },
      { termino: 'propiedad física', formas: ['propiedad física', 'propiedades físicas'],
        def: 'Rasgo de una sustancia que se mide sin transformarla en otra.', ejemplo: 'La densidad o la temperatura de fusión.', ver: ['propiedad química'] },
      { termino: 'propiedad química', formas: ['propiedad química', 'propiedades químicas'],
        def: 'Rasgo de una sustancia que solo se ve cuando se transforma en otra.', ejemplo: 'Que el gas de un balón arda.', ver: ['propiedad física', 'cambio químico'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera lleva el hielo hasta vapor, con la meseta de
    // hervir que la idea 3 no alcanza; la segunda llega a un gramo y lo traduce a carbón quemado. Las lecturas dicen
    // entradas y resultado, para que un caso guardado se lea solo.
    laboratorio: [
      {
        id: 'hielo-a-vapor', titulo: 'Del hielo al vapor', pieza: 'ejes',
        consigna: 'El calor entra solo y el punto recorre la curva. Compara el largo de las dos mesetas; elige dónde empieza el hielo.',
        controles: [
          { id: 't0', etiqueta: 'T inicial', color: 'c-h', min: -40, max: 0, paso: 5, inicio: -20, unidad: '°C', decimales: 0 },
          { id: 'q', etiqueta: 'Q', color: 'c-o', min: 0, max: QMAX, paso: 0.5, inicio: 2, unidad: 'kJ', decimales: 1, auto: { velocidad: 2.5 } },
        ],
        dibujo: val => dibLab(val),
        lectura: val => { const e = estadoLab(val.t0, val.q); return [`${f(val.t0, 0)} °C + ${f(val.q, 1)} kJ → `, Tm, ` = ${f(e.T, 0)} °C, ${e.lee}`]; },
        arrastres: [{ id: 'calor', etiqueta: 'punto de la curva: calor entregado', color: 'c-o',
          donde: val => { const g = EJES().geometria(dibLab(val).datos); return { x: g.X(val.q), y: g.Y(estadoLab(val.t0, val.q).T) }; },
          mover: (pt, val) => ({ q: inversa(EJES().geometria(dibLab(val).datos).X, 0, QMAX)(pt.x) }) }],
        // Retos comprobados (docs/teoria.md §4d): los mira estadoLab, el mismo cálculo que pone el punto en la curva.
        invitaciones: [
          { texto: 'Busca el menor calor con el que todo el hielo ya es agua líquida.',
            logrado: val => estadoLab(val.t0, val.q).lee === 'agua líquida' && estadoLab(val.t0, val.q - 0.5).lee !== 'agua líquida',
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
        id: 'gramo-carbon', titulo: 'Un gramo contra el carbón', pieza: 'ejes',
        consigna: 'Sube el punto por la recta hasta un gramo. La lectura dice cuánto carbón habría que quemar para igualarlo.',
        controles: [{ id: 'mg', etiqueta: 'Δm', color: 'c-i', min: 10, max: 1000, paso: 10, inicio: 100, unidad: 'mg', decimales: 0 }],
        dibujo: val => dibGramo(val),
        lectura: val => [`${f(val.mg, 0)} mg → `, E, ` = ${cien(energiaMg(val.mg))} J = ${f(carbon(val.mg), 0)} t de carbón`],
        arrastres: [{ id: 'masa', etiqueta: 'punto de la recta: masa que desaparece', color: 'c-i',
          donde: val => { const g = EJES().geometria(dibGramo(val).datos); return { x: g.X(val.mg), y: g.Y(val.mg * 0.09) }; },
          mover: (pt, val) => ({ mg: inversa(EJES().geometria(dibGramo(val).datos).X, 0, 1000)(pt.x) }) }],
        // Retos: toneladas de carbón con la misma cuenta de la lectura (E = Δm·c² entre la energía de un kg de carbón).
        invitaciones: [
          { texto: 'Busca la menor masa que ya equivale a mil toneladas de carbón.',
            logrado: val => carbon(val.mg) >= 1000 && carbon(val.mg - 10) < 1000,
            bien: 'Menos de medio gramo basta. ¿Cuánto carbón valdría un gramo entero?' },
          { texto: 'Guarda dos casos: uno que libere el triple de energía que el otro.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => Math.abs(energiaMg(a.mg) - 3 * energiaMg(b.mg)) < 1e-6 * energiaMg(a.mg))),
            bien: 'Triple de masa perdida, triple de energía: la recta pasa por el cero.' },
          { texto: 'Haz que desaparezca un gramo entero de masa.',
            logrado: val => val.mg === 1000,
            bien: 'Un solo gramo vale miles de toneladas de carbón: c² es enorme.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'hielo-a-vapor': ['calor-sensible-latente'],
      'gramo-carbon': ['masa-energia'],
    },
    ideas: [sustancia, cambios, calor, energia],
  };
});
