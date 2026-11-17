/*
 * Teoría de «Materia y energía» (quimica.materia-y-energia). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 1), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 25) y las precisiones de Química del expediente. Errores: docs/investigacion/quimica-materia-nomenclatura-
 * organica-ideas-erroneas.md (MA), atomo-enlace (EN, AT) y gases-soluciones (GQ); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: clasificar una muestra por sus partículas y decidir qué hace el calor y la energía con ella.
 *   Persona y condiciones: alumno de 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, sin audio,
 *     a veces sin conexión.
 *   Resultado observable: clasifica una muestra nueva, dice si un cambio es físico, químico o nuclear y calcula
 *     Q = mcΔT, Q = mL y E = Δm·c² con sus unidades.
 *   Orden de atención: 1.º la lupa (qué partículas hay) · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿lo uniforme es puro?, ¿el calor siempre sube la temperatura?, ¿de dónde sale la energía nuclear?
 *
 * Etapa 2 (17 nov 2026, docs/etapa2/propuesta-quimica.md y decisiones.md): orden de las ideas sustancia-mezcla,
 * propiedades (nueva, por escribir), fisico-quimico-nuclear, calor-sensible-latente y masa-energia. La idea 1 ya pasó
 * por el contrato «se entiende sin profesor» (misión, leyenda, datos, 15 ejemplos); las otras siguen como estaban y la
 * unidad todavía no declara calidad: 2.
 * Colores (regla 4): m masa (y Δm) turquesa c-i, Q calor naranja c-o, T temperatura rojo c-h, E energía verde c-d
 * (pendiente: pasar a §5b del molde cuando se rehagan las ideas 4 y 5).
 * En los dibujos de partículas, los átomos llevan la paleta de elementos (nucleo/elementos.js, var(--el-*)) y su
 * relleno (O lleno, H hueco, Na con punto): un dibujo es de partículas o de variables, nunca de los dos.
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
  function cien(x, d = 1) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }

  // ---------- Partículas: átomos y especies de la unidad ----------
  // Paleta de elementos (nucleo/elementos.js, var(--el-*)), no colores de variable: un dibujo es de partículas o de
  // variables, nunca de los dos (docs/etapa2/decisiones.md, 17 nov). El relleno distingue también en grises.
  const ATOMOS = { O: { el: 'O', estilo: 'lleno', r: 6 }, H: { el: 'H', estilo: 'hueco', r: 4.5 }, Na: { el: 'Na', estilo: 'punto', r: 6 },
    Cl: { el: 'Cl', estilo: 'lleno', r: 7 }, C: { el: 'C', estilo: 'lleno', r: 5 }, N: { el: 'N', estilo: 'hueco', r: 6 }, He: { el: 'He', estilo: 'punto', r: 5 } };
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

  // Gesto directo (docs/teoria.md §4b): en las ideas con ejes, la manija es el punto del gráfico. Se ubica con
  // ejes.geometria y se lee con su inversa lineal (como en fisica/movimiento-rectilineo.js).
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));

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
  // La sal se dibuja como «partícula de sal» (Na y Cl juntos, sin cargas): la idea va antes de estructura atómica y de
  // enlace (punto 9). El agua es «destilada» y no «hervida»: el agua hervida de la llave conserva sales disueltas.
  // La clasificación la decide el motor de la escena materia-energia (MotorMateria.clasificarCaja y contarSistema), con
  // la misma lista de partículas que dibuja la lupa (regla 1).
  // Códigos: MA9 (dos clases de átomo = compuesto, o hielo y agua = dos sustancias), MA10 (uniforme a la vista = pura),
  // QM-HOMO (mezcla de una fase porque «todo es agua»), y las hipótesis nuevas QM-HETERO (dos clases repartidas = dos
  // fases), QM-FASE-DISUELTO (lo disuelto como fase aparte), QM-CADA-COSA (cada cosa nombrada, una fase), QM-INVIERTE
  // (fases y componentes al revés) y AQ-rama-por-sustancia (la rama se elige por la sustancia, no por la tarea).
  const AT1 = {
    H: { el: 'H', estilo: 'hueco', r: 3.6 }, O: { el: 'O', estilo: 'lleno', r: 5 }, C: { el: 'C', estilo: 'lleno', r: 4.2 },
    N: { el: 'N', estilo: 'hueco', r: 5 }, Na: { el: 'Na', estilo: 'punto', r: 4.6 }, Cl: { el: 'Cl', estilo: 'lleno', r: 5.4 },
    Si: { el: 'Si', estilo: 'punto', r: 5 }, Cu: { el: 'Cu', estilo: 'lleno', r: 6 }, Sn: { el: 'Sn', estilo: 'punto', r: 6 },
  };
  const ESP1 = {
    H2O: [['O', 0, -1.5], ['H', -5.5, 3.5], ['H', 5.5, 3.5]], NaCl: [['Na', -4.6, 0], ['Cl', 5, 0]],
    azucar: [['C', -5, -2.5], ['C', 5, -2.5], ['H', 0, -4], ['O', 0, 4]],
    aceite: [['C', -5.5, 2], ['C', 0, -2], ['C', 5.5, 2]], SiO2: [['O', -6, 0], ['O', 6, 0], ['Si', 0, 0]],
    O2: [['O', -4, 0], ['O', 4, 0]], N2: [['N', -4, 0], ['N', 4, 0]], O3: [['O', -5, 2], ['O', 0, -2.5], ['O', 5, 2]],
    CO2: [['O', -6, 0], ['O', 6, 0], ['C', 0, 0]], Cu: [['Cu', 0, 0]], Sn: [['Sn', 0, 0]],
  };
  const NOM1 = { H2O: 'agua (H₂O)', NaCl: 'sal (NaCl)', azucar: 'azúcar', aceite: 'aceite', SiO2: 'arena (SiO₂)', O2: 'oxígeno (O₂)',
    N2: 'nitrógeno (N₂)', O3: 'ozono (O₃)', CO2: 'dióxido de carbono (CO₂)', Cu: 'cobre (Cu)', Sn: 'estaño (Sn)' };
  // La fórmula que entiende el motor por cada especie dibujada (el aceite es una mezcla de grasas: va como una sustancia).
  const FORMULA1 = { H2O: { formula: 'H2O' }, NaCl: { formula: 'NaCl' }, azucar: { formula: 'C12H22O11' }, aceite: { formula: 'C18H34O2', sustancia: 'aceite' },
    SiO2: { formula: 'SiO2' }, O2: { formula: 'O2' }, N2: { formula: 'N2' }, O3: { formula: 'O3' }, CO2: { formula: 'CO2' }, Cu: { formula: 'Cu' }, Sn: { formula: 'Sn' } };
  const mesa1 = (recipientes, extra = {}) => ({ datos: Object.assign({ atomos: AT1, especies: ESP1, nombres: NOM1, clave: true, recipientes }, extra), estado: {} });
  // Las partículas de una lupa como las cuenta el motor: cada capa de la lupa es una fase.
  const listaDe = capas => capas.flatMap((c, k) => (c.particulas || []).filter(p => p.n > 0).map(p => Object.assign({ n: p.n, fase: `fase ${k + 1}` }, FORMULA1[p.e])));
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
        ? [{ alto: 0.6, particulas: [{ e: 'H2O', n: 4 }, { e: x.e, n: N_SOL - k }] }, { alto: 0.4, particulas: [{ e: x.e, n: k }], orden: 'filas' }]
        : [{ particulas: [{ e: 'H2O', n: 4 }, { e: x.e, n: N_SOL }] }];
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
      return [`Ya no se ve ${x.nombre}: 2 clases de partícula, 1 fase.`];
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
    { tipo: 'vaso', capas: [{ particulas: [{ e: 'H2O', n: 5 }, { e: 'NaCl', n: 3 }] }] },
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
        pregunta: 'Esta es la lupa de una muestra. ¿Cómo se clasifica?', opciones: opcionesClase(real), porque: PORQUE_CLASE[real] };
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
  // El bronce como un sólido lleno: 17 de cobre y 4 de estaño intercalados (en filas, para que no queden huecos).
  const BRONCE = [...Array.from({ length: 4 }, () => [{ e: 'Cu', n: 4 }, { e: 'Sn', n: 1 }]).flat(), { e: 'Cu', n: 1 }];
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
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([vasoLupa('Agua de mar', [{ particulas: [{ e: 'H2O', n: 6 }, { e: 'NaCl', n: 3 }] }])])),
      solucion: [
        { texto: ['Primero, las clases de partícula: agua y sal. Son dos: es una ', dR('mezcla'), '.'] },
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
        { texto: ['Todas las partículas son iguales: un sodio pegado a un cloro. Una sola clase: es una sustancia pura.'] },
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
    { nivel: 3, titulo: 'Oxígeno y ozono',
      enunciado: 'El oxígeno que respiramos es O₂ y el ozono de la alta atmósfera es O₃. Un alumno dice: «El O₃ es un compuesto, porque tiene tres átomos». ¿Tiene razón?',
      datos: [DEF_EC, 'En una fórmula, cada símbolo es una clase de átomo y el subíndice dice cuántos hay'],
      figura: Object.assign({ pieza: 'quim-vasos' }, mesa1([frascoLupa('Oxígeno, O₂', [{ particulas: [{ e: 'O2', n: 6 }] }]), frascoLupa('Ozono, O₃', [{ particulas: [{ e: 'O3', n: 5 }] }])])),
      solucion: [
        { texto: ['Un compuesto une átomos de elementos distintos. En el O₃ los tres átomos son de oxígeno: una sola clase.'] },
        { texto: ['Tener más átomos no lo vuelve compuesto. O₂ y O₃ son dos sustancias distintas del mismo elemento, el oxígeno.'] },
      ],
      respuesta: [dR('No'), ': el O₃ es un elemento, como el O₂'] },
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
        { s: 'C', t: 'carbono, en el azúcar y el aceite' },
        { s: 'Na  Cl', t: 'sodio y cloro: juntos forman la sal' },
        { s: 'Si', t: 'silicio: con dos oxígenos forma la arena' },
        { s: '- - -', t: 'en la lupa, el borde entre dos fases' },
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
            { tipo: 'datos', texto: `En la lupa hay ${c.real === 'elemento' || c.real === 'compuesto' ? 'una sola clase de partícula' : 'dos clases de partícula'}${c.real === 'heterogenea' ? ', separadas por un borde' : ''}.` },
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
    // En orden: la paleta de elementos antes que quim-particulas (define las variables --el-*), el motor de la escena
    // antes que la unidad, y quim-particulas antes que quim-vasos (que dibuja sus especies).
    requiere: ['/nucleo/elementos.js', '/plantillas/materia-energia/motor.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-vasos.js', '/nucleo/kit/piezas/ejes.js'],
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
        ejemplos: ['La cocina a gas le da energía al agua de la olla y la calienta.', 'Al quemarse, el gas de un balón libera energía como calor y luz.',
          'Al caminar, una persona gasta energía; al comer, la recupera.'],
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
