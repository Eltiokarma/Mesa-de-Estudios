/*
 * Teoría de «Líquidos, sólidos y cambios de fase» (quimica.liquidos-y-solidos). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 10), historia-ecuaciones (Gibbs, 1878) y las precisiones
 * de Química del expediente. Errores: docs/investigacion/gases-soluciones-ideas-erroneas.md (GQ18, GQ19),
 * quimica-materia-nomenclatura-organica (MA7) y atomo-enlace (EN14); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: explicar por qué un líquido hierve a otra temperatura en la altura y leer un diagrama de fases.
 *   Persona y condiciones: postulante de 4.º–5.º en Puno o en la costa, celular de 360 px, sin audio.
 *   Resultado observable: clasifica estados y sólidos, predice la subida capilar, da la temperatura de ebullición a
 *     una presión externa, lee la fase de un punto (T, P) y calcula presión de gas seco y humedad relativa.
 *   Orden de atención: 1.º la figura (partículas o curva) · 2.º la lectura en vivo · acción: cambiar una condición.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿el vapor aparece solo al hervir?, ¿el agua siempre hierve a 100 °C?, ¿el vidrio es líquido?
 *
 * Colores (regla 4): P presión naranja c-o, T temperatura rojo c-h, h altura que sube turquesa c-i, r radio del tubo
 * verde c-d. Partículas: Na naranja con punto, Cl verde lleno, O rojo lleno, H turquesa hueco, «aire» y vidrio en tinta.
 * Datos (no van al alumno):
 *   - Presión de vapor del agua: ecuación de Antoine con A = 8,07131, B = 1730,63, C = 233,426 (mmHg, °C; válida de 1 a
 *     100 °C y usada hasta 120 °C con error < 1 %). Tabla: 10 °C 1,23 kPa; 15 °C 1,71; 20 °C 2,34; 25 °C 3,17; 30 °C 4,25
 *     (CRC Handbook). Juliaca: 0,62 atm ≈ 63 kPa → hierve a ≈ 87 °C.
 *   - Capilaridad (ley de Jurin, ángulo de contacto ≈ 0): agua γ = 0,0728 N/m, ρ = 998 kg/m³; etanol γ = 0,0223 N/m,
 *     ρ = 789 kg/m³; g = 9,81 m/s².
 *   - CO₂: punto triple −56,6 °C y 5,11 atm; punto crítico 31,0 °C y 72,9 atm; sublima a −78,5 °C a 1 atm. Curvas de
 *     sublimación y vaporización con Clausius-Clapeyron ajustado a esos puntos; la de fusión, casi vertical, es
 *     esquemática (pendiente de 0,0125 °C/atm). NIST WebBook.
 * Fuentes: OpenStax Chemistry 2e §10.3 y §10.4; NIST Chemistry WebBook (CO₂, agua).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/liquidos-y-solidos calcula las celdas y los bloques de la mesa 3D «La celda que se repite».
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/liquidos-y-solidos/motor.js'))
    : fabrica(root.Kit, root.MotorLiquidos);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, ML) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const P = { v: 'c-o', t: 'P' }, T = { v: 'c-h', t: 'T' }, h = { v: 'c-i', t: 'h' }, r = { v: 'c-d', t: 'r' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const a = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    a.ent = (lo, hi) => lo + Math.floor(a() * (hi - lo + 1));
    a.de = l => l[Math.floor(a() * l.length)];
    return a;
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

  const ATOMOS = { Na: { color: 'o', estilo: 'punto', r: 6 }, Cl: { color: 'd', estilo: 'lleno', r: 7 }, X: { estilo: 'lleno', r: 6.5 },
    O: { color: 'h', estilo: 'lleno', r: 5.5 }, H: { color: 'i', estilo: 'hueco', r: 4 }, A: { estilo: 'punto', r: 5 } };
  const ESPECIES = { Na: [['Na', 0, 0]], Cl: [['Cl', 0, 0]], X: [['X', 0, 0]], H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]], aire: [['A', -4, 0], ['A', 4, 0]] };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 24, cajas }, extra), estado: {} });
  const fijo = (e, x, y, extra = {}) => Object.assign({ e, n: 1, x, y }, extra);
  // Gesto directo (docs/teoria.md §4b): en las ideas con ejes, la manija es el punto del gráfico. Se ubica con
  // ejes.geometria y se lee con su inversa lineal (como en fisica/movimiento-rectilineo.js).
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));

  // ---------- Idea 1: orden y libertad de las partículas ----------
  // Cambia: el estado de la muestra · Permanece: la caja y la escala · Progresa: de partículas fijas y ordenadas a fijas
  // sin orden, a juntas que se deslizan, a separadas · Se reserva: el sólido amorfo (vidrio) · Debe verse: si el orden se
  // repite y si las partículas llenan el recipiente.
  const RED = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) RED.push(fijo((i + j) % 2 ? 'Cl' : 'Na', 0.1 + 0.2 * i, 0.1 + 0.27 * j));
  const AMORFO = (() => { const a = azar(7), out = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) out.push(fijo('X', Math.min(0.95, Math.max(0.05, 0.1 + 0.2 * i + (a() - 0.5) * 0.12)), Math.min(0.95, Math.max(0.05, 0.1 + 0.27 * j + (a() - 0.5) * 0.16)))); return out; })();
  const ESTADOS = {
    cristal: { texto: 'Sólido cristalino', caja: { forma: 'caja', particulas: RED }, lee: 'Partículas fijas en un orden que se repite.' },
    amorfo: { texto: 'Sólido amorfo', caja: { forma: 'caja', particulas: AMORFO }, lee: 'Partículas fijas, pero sin un orden que se repita.' },
    liquido: { texto: 'Líquido', caja: { forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 12 }] }, lee: 'Juntas pero se deslizan: toma la forma del vaso.' },
    gas: { texto: 'Gas', caja: { forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 5 }] }, lee: 'Separadas y libres: llena todo el recipiente.' },
  };
  const muestra = k => lupa([Object.assign({ titulo: ESTADOS[k].texto }, ESTADOS[k].caja)]);
  // ---------- Partículas que se mueven solas (animación, docs/3d.md §6) ----------
  // Modelo cinético, en cámara lenta y determinístico (regla 1: cada cuadro es función de t). Las que tienen un lugar
  // fijo (los dos sólidos) vibran en su sitio; en un vaso se deslizan alrededor de su lugar (líquido); en un cilindro o
  // una caja sin lugares fijos vuelan en recta y rebotan (gas). Frecuencias múltiplos de 1/CICLO: nada salta.
  const CICLO = 8, W2 = 2 * Math.PI / CICLO;
  const h01 = (a, b) => { let x = (Math.imul(a + 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x7F4A7C15, 0xC2B2AE35)) >>> 0; x ^= x >>> 15; x = Math.imul(x, 0x2C1B3C6D); x ^= x >>> 12; return (x >>> 0) / 4294967296; };
  const tri = u => { const w = ((u % 2) + 2) % 2; return w > 1 ? 2 - w : w; };
  const acota = (u, a = 0.06, b = 0.94) => Math.max(a, Math.min(b, u));
  function mover(caja, t, k = 0) {
    const lista = [];
    for (const g of caja.particulas || []) { const n = Math.round(g.n === undefined ? 1 : g.n); for (let j = 0; j < n; j++) lista.push(g); }
    const libres = lista.filter(g => !(Number.isFinite(g.x) && Number.isFinite(g.y)));
    const cols = Math.max(1, Math.round(Math.sqrt(libres.length * 1.6))), filas = Math.max(1, Math.ceil(libres.length / cols));
    const casilla = libres.map((_, i) => i).sort((a, b) => h01(k + 1, a) - h01(k + 1, b));
    const gas = caja.forma !== 'vaso';
    let libre = 0;
    const particulas = lista.map((g, i) => {
      const r = j => h01(i * 7 + j, k * 13 + 3);
      if (Number.isFinite(g.x) && Number.isFinite(g.y)) {
        return Object.assign({}, g, { n: 1, x: acota(g.x + 0.018 * Math.sin(W2 * (6 + Math.floor(r(1) * 3)) * t + 6.3 * r(2))), y: acota(g.y + 0.018 * Math.sin(W2 * (6 + Math.floor(r(3) * 3)) * t + 6.3 * r(4)), 0.06, 0.96) });
      }
      const c = casilla[libre++], bx = 0.14 + 0.72 * (cols === 1 ? 0.5 : (c % cols) / (cols - 1)), by = 0.16 + 0.68 * (filas === 1 ? 0.5 : Math.floor(c / cols) / (filas - 1));
      if (gas) {
        const vx = (2 + Math.floor(r(1) * 3)) * (r(2) < 0.5 ? -1 : 1) * 2 / CICLO, vy = (1 + Math.floor(r(3) * 3)) * (r(4) < 0.5 ? -1 : 1) * 2 / CICLO;
        return Object.assign({}, g, { n: 1, x: 0.06 + 0.88 * tri(bx + vx * t), y: 0.07 + 0.86 * tri(by + vy * t) });
      }
      return Object.assign({}, g, { n: 1, x: acota(bx + 0.07 * Math.sin(W2 * (1 + Math.floor(r(1) * 2)) * t + 6.3 * r(2)) + 0.03 * Math.sin(W2 * 3 * t + 6.3 * r(3))),
        y: acota(by + 0.05 * Math.sin(W2 * (1 + Math.floor(r(4) * 2)) * t + 6.3 * r(5)), 0.06, 0.95) });
    });
    return Object.assign({}, caja, { particulas });
  }
  // Casos de «Ahora tú» y de «Así se resuelve»: una pista que se ve a simple vista y el estado que la explica.
  const CASOS = [
    ['La sal de mesa se rompe en cubitos de caras planas', 'cristal'], ['El vidrio de una ventana se rompe en bordes curvos', 'amorfo'],
    ['La cera de una vela se ablanda poco a poco, sin temperatura fija', 'amorfo'], ['El cuarzo forma prismas con caras planas', 'cristal'],
    ['El aceite toma la forma del frasco pero no lo llena', 'liquido'], ['El aire llena toda la habitación', 'gas'],
    ['La miel fluye lento y toma la forma del plato', 'liquido'], ['El vapor de una olla se esparce por la cocina', 'gas'],
    ['La nieve forma copos de seis puntas', 'cristal'], ['Un caramelo duro se rompe como vidrio, sin caras planas', 'amorfo'],
  ];
  const T_ANIMA = { id: 's', etiqueta: 't', min: 0, max: CICLO, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } };
  // Sin arrastre: el control elige entre estados y sólidos distintos; no hay una magnitud que agarrar en la lupa.
  const estados = {
    id: 'orden-y-libertad',
    titulo: 'Orden y libertad de las partículas',
    temas: ['Propiedades de los estados de agregación', 'Sólidos cristalinos y amorfos'],
    pieza: 'quim-particulas',
    // Lee (fase 2): estados con ejemplos de Puno y la sal de Maras. No dice por qué el vidrio no tiene caras («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'La misma agua', texto: 'El agua del Titicaca es líquida, en los nevados de la cordillera hay agua sólida y en el aire de Juliaca hay vapor de agua que no se ve. Es la misma sustancia; cambia cómo están sus partículas.' },
        { titulo: 'Forma y volumen', texto: 'Un sólido tiene forma y volumen propios. Un líquido guarda su volumen, pero toma la forma del recipiente. Un gas no guarda ninguno de los dos: ocupa todo el espacio que le den.' },
        { titulo: 'La sal de Maras', texto: 'En las salineras de Maras, en el Cusco, el sol seca el agua salada de las pozas y queda la sal. Con una lupa, sus granos se ven como cubitos de caras planas.' },
        { titulo: 'Qué mirar', texto: 'En el juego, elige cada estado y responde tres preguntas: ¿cada partícula tiene un lugar fijo?, ¿se repite un patrón?, ¿llenan todo el recipiente?' },
      ],
    },
    juega: {
      consigna: 'Elige un estado; las partículas se mueven en cámara lenta. Mira si tienen lugar fijo, si se repite un patrón y si llenan el recipiente.',
      voz: 'Compara el orden de los dos sólidos.',
      controles: [{ id: 'k', etiqueta: 'Estado', opciones: Object.keys(ESTADOS).map(k => ({ valor: k, texto: ESTADOS[k].texto })) }, T_ANIMA],
      dibujo: val => lupa([mover(Object.assign({ titulo: ESTADOS[val.k].texto }, ESTADOS[val.k].caja), val.s)]),
      lectura: val => [`${f(val.s, 1)} s · ${ESTADOS[val.k].lee}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'El vidrio es sólido, pero al romperse no deja caras planas ni ángulos fijos, como la sal. Mirado con la lupa, ¿por qué?',
      voz: 'Piensa en el orden, no en la dureza.',
      opciones: [
        { id: 'c', texto: 'Sus partículas están fijas pero sin orden repetido', correcta: true },
        { id: 'liquido', texto: 'Porque en realidad es un líquido muy lento', error: 'QM-VIDRIO-LIQUIDO', siFuera: 'Fluiría si sus partículas se deslizaran. En el vidrio quedan fijas, aunque sin patrón.' },
        { id: 'libres', texto: 'Porque sus partículas se mueven libremente', error: 'QM-SOLIDO-LIBRE', siFuera: 'Eso pasa en un gas. En el vidrio cada partícula vibra en su lugar.' },
        { id: 'mezcla', texto: 'Porque es una mezcla y no una sustancia', error: 'MA10', siFuera: 'El vidrio común sí es mezcla, pero una sal mezclada también tendría caras. Lo decide el orden.' },
      ],
      dibujo: lupa([{ titulo: 'Sal', forma: 'caja', particulas: RED }, { titulo: 'Vidrio', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: 'Sal', forma: 'caja', particulas: RED, rotulo: 'cristalino' }, { titulo: 'Vidrio', forma: 'caja', particulas: AMORFO, rotulo: 'amorfo' }]),
      coincide: 'Coincide: fijas, pero sin un patrón que se repita.',
      noCoincide: 'Sus partículas están fijas, pero sin patrón: es un sólido amorfo.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Sólido', forma: 'caja', particulas: RED.map(p => Object.assign({}, p, { desde: 1 })) },
        { titulo: 'Líquido', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 8, desde: 2 }] },
        { titulo: 'Gas', forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 4, desde: 3 }] },
      ], { separacion: 22 }).datos,
      voz: 'Revisemos forma y volumen en cada estado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Sólido: cada partícula vibra en su lugar. Forma y volumen propios.' },
        { estado: { corte: 2 }, texto: 'Líquido: juntas, pero se deslizan. Volumen propio, forma del recipiente.' },
        { estado: { corte: 3 }, texto: 'Gas: separadas y libres. Llena todo el recipiente y se comprime.' },
        { estado: { corte: 3 }, texto: 'Un sólido amorfo, como el vidrio, tiene partículas fijas sin orden repetido.' },
      ],
    },
    regla: {
      texto: 'Sólido: partículas fijas (cristalino si su orden se repite, amorfo si no). Líquido: juntas pero se deslizan. Gas: separadas y libres, llenan el recipiente.',
      ecuacion: ['cristalino: funde a T fija', '   ·   ', 'amorfo: se ablanda'],
      condicion: 'es un modelo de partículas: las distancias no están a escala y las partículas del sólido también vibran.',
      voz: 'Lugar fijo, orden y espacio libre: tres preguntas, tres respuestas.',
    },
    // Así se resuelve (fase 2): un caso de «Ahora tú» elegido con azar(s + 900). No hay cuentas: se aplica la regla
    // (paso «aplica»). La figura pone lado a lado el estado que explica el caso y su vecino más parecido.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [caso, tipo] = r.de(CASOS);
        const VECINO = { cristal: 'amorfo', amorfo: 'cristal', liquido: 'gas', gas: 'liquido' }, otro = VECINO[tipo];
        const par = Object.keys(ESTADOS).filter(k => k === tipo || k === otro);
        const caja = (k, rot) => Object.assign({ titulo: ESTADOS[k].texto }, ESTADOS[k].caja, rot ? { rotulo: rot } : {});
        const APLICA = {
          cristal: 'Una forma regular, con caras planas o puntas iguales, solo sale si las partículas están fijas y siguen un patrón que se repite.',
          amorfo: 'No fluye, así que es sólido. Pero no muestra caras planas ni un punto de fusión fijo: partículas fijas, sin patrón.',
          liquido: 'Toma la forma del recipiente, pero no se esparce para llenarlo: las partículas siguen juntas y se deslizan unas sobre otras.',
          gas: 'Ocupa todo el espacio que tiene: las partículas están separadas y se mueven libres en todas las direcciones.',
        };
        const CONTRA = {
          cristal: 'Si fuera cristalino, se rompería en caras planas y fundiría a una temperatura fija.',
          amorfo: 'Si fuera amorfo, no tendría formas regulares y se ablandaría poco a poco.',
          liquido: 'Si fuera líquido, se juntaría abajo y no llenaría todo el espacio.',
          gas: 'Si fuera gas, no se quedaría abajo: llenaría todo el recipiente.',
        };
        return {
          enunciado: `${caso}. Por cómo están sus partículas, ¿es un ${ESTADOS[par[0]].texto.toLowerCase()} o un ${ESTADOS[par[1]].texto.toLowerCase()}?`,
          dibujo: lupa(par.map(k => caja(k))),
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir cómo están las partículas a partir de lo que se ve a simple vista.' },
            { tipo: 'datos', texto: `La pista: «${caso.charAt(0).toLowerCase() + caso.slice(1)}».` },
            { tipo: 'regla', texto: 'Me hago tres preguntas: ¿cada partícula tiene un lugar fijo?, ¿forman un patrón que se repite?, ¿llenan todo el recipiente?' },
            { tipo: 'aplica', texto: APLICA[tipo], ecuacion: [ESTADOS[tipo].texto], dibujo: lupa(par.map(k => caja(k, k === tipo ? 'este' : 'no'))) },
            { tipo: 'sentido', texto: `Compruebo con el vecino: ${CONTRA[otro].charAt(0).toLowerCase() + CONTRA[otro].slice(1)} Eso no pasa aquí.` },
          ],
          respuesta: ESTADOS[tipo].texto,
        };
      },
    },
    ahoraTu: {
      voz: 'Decide por cómo están las partículas.',
      generar(s) {
        const [caso, tipo] = CASOS[s % CASOS.length];
        const si = { cristal: 'Sería cristalino si sus partículas formaran un patrón que se repite.', amorfo: 'Sería amorfo si sus partículas estuvieran fijas sin un patrón.', liquido: 'Sería líquido si sus partículas se deslizaran pero siguieran juntas.', gas: 'Sería gas si sus partículas estuvieran separadas y llenaran el recipiente.' };
        const porque = { cristal: 'Partículas fijas en un orden que se repite.', amorfo: 'Partículas fijas, sin un orden repetido.', liquido: 'Partículas juntas que se deslizan.', gas: 'Partículas separadas que llenan el recipiente.' };
        return {
          pregunta: `${caso}. ¿Qué describe mejor sus partículas?`,
          opciones: Object.keys(ESTADOS).map(k => (k === tipo ? { id: 'c', texto: ESTADOS[k].texto, correcta: true } : { id: k, texto: ESTADOS[k].texto, error: k === 'liquido' && tipo === 'amorfo' ? 'QM-VIDRIO-LIQUIDO' : 'QM-ESTADO', siFuera: si[k] })),
          solucion: { texto: porque[tipo], ecuacion: [ESTADOS[tipo].texto] },
        };
      },
    },
  };

  // ---------- Idea 2: tensión superficial, viscosidad y capilaridad ----------
  // Cambia: el radio del tubo y el líquido · Permanece: líquidos que mojan el vidrio, a 20 °C · Progresa: la altura sube
  // al angostar el tubo · Se reserva: la viscosidad, que no cambia la altura final · Debe verse: la curva h contra r.
  const LIQ = { agua: ['Agua', 0.0728, 998], etanol: ['Etanol', 0.0223, 789] };
  const kJ = k => 2 * LIQ[k][1] / (LIQ[k][2] * 9.81) * 1e6;          // h·r en mm²
  const curvaH = k => Array.from({ length: 36 }, (_, i) => { const rr = 0.25 + i * 0.05; return [rr, kJ(k) / rr]; });
  const ejesCap = extra => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'r', unidad: 'mm', decimales: 1, color: 'd' },
    y: { min: 0, max: 60, paso: 10, nombre: 'h', unidad: 'mm', decimales: 0, color: 'i' },
    curvas: [{ puntos: curvaH('agua'), color: 'i', rotulo: 'agua' }],
    alt: 'Altura que sube un líquido en un tubo delgado contra el radio del tubo: la curva baja como 1 entre r. El agua sube 14,9 mm en un tubo de 1 mm y 29,7 mm en uno de 0,5 mm; el etanol sube menos.',
  }, extra);
  const dibCap = val => ({ datos: ejesCap({ curvas: [{ puntos: curvaH(val.l), color: 'i', rotulo: LIQ[val.l][0].toLowerCase() }], puntos: [{ x: val.r, y: kJ(val.l) / val.r, color: 'i', rotulo: `${f(kJ(val.l) / val.r, 1)} mm`, guias: true }] }), estado: {} });
  const capilar = {
    id: 'capilaridad',
    titulo: 'La superficie que jala',
    temas: ['Tensión superficial, viscosidad y capilaridad'],
    pieza: 'ejes',
    // Lee (fase 2): la piel del agua, la miel y la servilleta; cómo leer la curva. No dice cómo cambia h con r («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'La piel del agua', texto: 'Algunos insectos caminan sobre el agua de una poza sin hundirse. Las moléculas de la superficie se jalan entre sí y forman algo parecido a una piel: es la tensión superficial.' },
        { titulo: 'Miel y agua', texto: 'La miel cae lenta y el agua, rápida: la miel es más viscosa. La viscosidad mide cuánto le cuesta a un líquido fluir; no es lo mismo que la tensión superficial.' },
        { titulo: 'Subir solo', texto: 'Si mojas la punta de una servilleta, el agua sube por ella sola. En un tubo de vidrio muy delgado pasa algo parecido: el agua moja la pared y trepa. Eso es capilaridad.' },
        { titulo: 'Qué mirar', texto: ['El juego no dibuja el tubo: muestra una curva. Abajo va el radio del tubo, ', r, '; a la izquierda, la altura que sube el líquido, ', h, '. Mira qué le pasa a ', h, ' cuando ', r, ' se achica.'] },
      ],
    },
    juega: {
      // Pedido de Gerson (objetos que la figura no dibuja): la figura es la curva h–r, no el tubo; el texto dice lo que se ve.
      consigna: 'Un líquido sube por un tubo de vidrio delgado. La curva da la altura para cada radio; el punto la recorre solo. Elige el líquido.',
      voz: 'Lleva el punto a radios cada vez más chicos.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.25, max: 2, paso: 0.25, inicio: 1, unidad: 'mm', decimales: 2, auto: { velocidad: 0.35, modo: 'rebota' } },
        { id: 'l', etiqueta: 'Líquido', opciones: Object.keys(LIQ).map(k => ({ valor: k, texto: LIQ[k][0] })) },
      ],
      dibujo: val => dibCap(val),
      lectura: val => [`${LIQ[val.l][0]}: `, h, ` = ${f(kJ(val.l) / val.r, 1)} mm en un tubo de ${f(val.r, 2)} mm`],
      minimo: 3,
      // Se agarra el punto y se lo corre por la curva: la manija mueve el radio y la altura responde en el eje vertical.
      arrastres: [{ id: 'radio', etiqueta: 'punto sobre la curva: radio del tubo', color: 'c-d',
        donde: val => { const g = EJES().geometria(dibCap(val).datos); return { x: g.X(val.r), y: g.Y(kJ(val.l) / val.r) }; },
        mover: (pt, val) => ({ r: inversa(EJES().geometria(dibCap(val).datos).X, 0, 2)(pt.x) }) }],
    },
    predice: {
      pregunta: ['En un tubo de ', r, ' = 1 mm el agua sube 14,9 mm. ¿Cuánto sube en un tubo de 0,5 mm?'],
      voz: 'Piensa en cuánta pared moja al líquido por cada gota.',
      opciones: [
        { id: 'c', texto: `${f(kJ('agua') / 0.5, 1)} mm`, correcta: true },
        { id: 'menos', texto: `${f(kJ('agua') / 2, 1)} mm`, error: 'QM-CAPILAR-MENOS', siFuera: 'Así sería si un tubo angosto dejara pasar menos líquido. Aquí la pared jala más por gota.' },
        { id: 'igual', texto: `${f(kJ('agua'), 1)} mm`, error: 'QM-CAPILAR-IGUAL', siFuera: 'La altura sería la misma si no dependiera del tubo. Depende del radio.' },
        { id: 'cuatro', texto: `${f(4 * kJ('agua'), 1)} mm`, error: 'QM-CAPILAR-AREA', siFuera: 'Eso usa el área del tubo (r²). La altura va como 1 entre r.' },
      ],
      dibujo: { datos: ejesCap({ curvas: [], puntos: [{ x: 1, y: kJ('agua'), color: 'i', rotulo: '14,9 mm' }] }), estado: {} },
      revelar: { datos: ejesCap({ puntos: [{ x: 1, y: kJ('agua'), color: 'i', rotulo: '14,9 mm' }, { x: 0.5, y: kJ('agua') / 0.5, color: 'i', rotulo: `${f(kJ('agua') / 0.5, 1)} mm`, guias: true }] }), estado: {} },
      coincide: 'Coincide: la mitad de radio, el doble de altura.',
      noCoincide: 'Con la mitad de radio, el agua sube el doble.',
    },
    mira: {
      datos: ejesCap({
        curvas: [{ puntos: curvaH('agua'), color: 'i', rotulo: 'agua', en: [1.7, kJ('agua') / 1.7], desde: 1 }, { puntos: curvaH('etanol'), color: 'i', rotulo: 'etanol', en: [0.45, kJ('etanol') / 0.45], discontinua: true, desde: 3 }],
        puntos: [{ x: 1, y: kJ('agua'), color: 'i', rotulo: '14,9 mm', desde: 1 }, { x: 0.5, y: kJ('agua') / 0.5, color: 'i', rotulo: `${f(kJ('agua') / 0.5, 1)} mm`, desde: 2 }],
      }),
      voz: 'Separemos lo que jala del líquido de lo que lo frena.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En la superficie, las moléculas solo son jaladas hacia adentro: tensión superficial.', ecuacion: ['agua: γ = 0,0728 N/m'] },
        { estado: { corte: 2 }, texto: 'El agua moja el vidrio y sube; en un tubo angosto, más.', ecuacion: [h, ' · ', r, ' = constante'] },
        { estado: { corte: 3 }, texto: 'El etanol, con fuerzas más débiles, sube menos.', ecuacion: ['etanol: γ = 0,0223 N/m'] },
        { estado: { corte: 3 }, texto: 'La viscosidad mide cuánto cuesta fluir: cambia la rapidez, no la altura final.' },
      ],
    },
    regla: {
      texto: 'La tensión superficial y la viscosidad crecen con las fuerzas entre moléculas. Por capilaridad, un líquido que moja sube en un tubo más cuanto más angosto es.',
      ecuacion: [{ llave: [h], nota: 'lo que sube', color: 'c-i' }, ' = ', { frac: ['2γ', ['ρg', r]] }],
      condicion: 'vale para un líquido que moja el vidrio (ángulo de contacto cercano a 0); el mercurio no lo moja y baja.',
      voz: 'Tubo más angosto, subida mayor. Comprueba con la curva.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con azar(s + 900) y la misma cuenta (h·r se mantiene). La
    // figura: la curva h = (h₁r₁)/r de ese líquido, con ejes que alcanzan a los dos tubos. Para que sea creíble, h₁ se
    // elige con h·r ≤ 14,8 mm² (el agua, que es de los líquidos que más suben, da 14,9 mm²).
    resuelve: {
      generar(s) {
        const a = azar(s + 900), r1 = a.de([0.5, 1, 1.5, 2]), r2 = a.de([0.25, 0.5, 0.75, 1, 2, 3].filter(x => x !== r1)), h1 = 2 * a.ent(2, Math.floor(7.4 / r1)), h2 = h1 * r1 / r2;
        const kk = h1 * r1, xmax = Math.max(r1, r2) <= 2 ? 2 : 3.5, ymax = Math.ceil(Math.max(h1, h2) / 10) * 10 + 10, desde = kk / ymax;
        const ejes = extra => ({ datos: ejesCap(Object.assign({
          x: { min: 0, max: xmax, paso: 0.5, nombre: 'r', unidad: 'mm', decimales: 1, color: 'd' },
          y: { min: 0, max: ymax, paso: ymax > 100 ? 20 : 10, nombre: 'h', unidad: 'mm', decimales: 0, color: 'i' },
          curvas: [], alt: `Altura que sube el líquido contra el radio del tubo: ${h1} mm con ${f(r1, 2)} mm de radio y ${f(h2, 1)} mm con ${f(r2, 2)} mm. h por r vale ${f(kk, 1)} mm².` }, extra)), estado: {} });
        const curva = { puntos: Array.from({ length: 40 }, (_, i) => { const rr = desde + i * (xmax - desde) / 39; return [rr, kk / rr]; }), color: 'i' };
        const p1 = { x: r1, y: h1, color: 'i', rotulo: `${h1} mm` };
        const menor = r2 < r1;
        return {
          enunciado: ['Un líquido sube ', h, ` = ${h1} mm en un tubo de `, r, ` = ${f(r1, 2)} mm. ¿Cuánto sube el mismo líquido en un tubo de ${f(r2, 2)} mm?`],
          dibujo: ejes({ puntos: [p1] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la altura ', h, ` que sube el mismo líquido en el tubo de ${f(r2, 2)} mm.`] },
            { tipo: 'datos', texto: [`En el tubo de ${f(r1, 2)} mm sube ${h1} mm. Es el mismo líquido y el mismo vidrio.`] },
            { tipo: 'regla', texto: ['Con el mismo líquido, la altura que sube por el radio del tubo da siempre lo mismo: tubo más angosto, subida mayor.'],
              ecuacion: [{ sub: [h, '1'] }, ' · ', { sub: [r, '1'] }, ' = ', { sub: [h, '2'] }, ' · ', { sub: [r, '2'] }] },
            { tipo: 'cuentas', texto: ['Calculo el producto ', h, ' · ', r, ' del primer tubo y lo divido entre el radio nuevo.'],
              ecuacion: [h, ' · ', r, ` = ${h1} · ${f(r1, 2)} = ${f(kk, 1)} mm²   →   `, h, ` = ${f(kk, 1)} / ${f(r2, 2)} = ${f(h2, 1)} mm`],
              dibujo: ejes({ curvas: [curva], puntos: [p1, { x: r2, y: h2, color: 'i', rotulo: `${f(h2, 1)} mm`, guias: true }] }) },
            { tipo: 'sentido', texto: [`El tubo nuevo es más ${menor ? 'angosto' : 'ancho'}, así que el líquido debía subir ${menor ? 'más' : 'menos'}: de ${h1} a ${f(h2, 1)} mm. De vuelta, ${f(h2, 1)} · ${f(r2, 2)} da otra vez unos ${f(h2 * r2, 1)} mm².`] },
          ],
          respuesta: [h, ` = ${f(h2, 1)} mm`],
        };
      },
    },
    ahoraTu: {
      voz: 'Usa que h por r se mantiene.',
      generar(s) {
        const a = azar(s), r1 = a.de([0.5, 1, 1.5, 2]), r2 = a.de([0.25, 0.5, 0.75, 1, 2, 3].filter(x => x !== r1)), h1 = 2 * a.ent(4, 15), h2 = h1 * r1 / r2;
        return {
          pregunta: ['Un líquido sube ', h, ` = ${h1} mm en un tubo de `, r, ` = ${f(r1, 2)} mm. ¿Cuánto sube el mismo líquido en un tubo de ${f(r2, 2)} mm?`],
          opciones: opciones(h2, [
            { id: 'directa', valor: h1 * r2 / r1, error: 'QM-CAPILAR-MENOS', siFuera: 'Eso hace subir más en el tubo ancho. La altura va como 1 entre r.' },
            { id: 'igual', valor: h1, error: 'QM-CAPILAR-IGUAL', siFuera: 'Sería igual si el tubo tuviera el mismo radio.' },
            { id: 'area', valor: h1 * (r1 / r2) ** 2, error: 'QM-CAPILAR-AREA', siFuera: 'Eso usa el cuadrado del radio; la ley de capilaridad usa r.' },
          ], x => `${f(x, 1)} mm`),
          solucion: { texto: 'La altura por el radio se mantiene.', ecuacion: [h, ` = ${h1} · ${f(r1, 2)} / ${f(r2, 2)} = ${f(h2, 1)} mm`] },
        };
      },
    },
  };

  // ---------- Idea 3: hierve cuando su presión de vapor alcanza a la de afuera ----------
  // Cambia: la presión externa · Permanece: el agua y su curva de presión de vapor · Progresa: la línea de presión
  // externa sube o baja y corta la curva en otra temperatura · Se reserva: que a 20 °C ya hay vapor · Debe verse: el
  // corte entre la curva y la línea.
  const antoine = t => 10 ** (8.07131 - 1730.63 / (233.426 + t)) * 0.133322;      // kPa
  const ebulle = pk => 1730.63 / (8.07131 - Math.log10(pk / 0.133322)) - 233.426; // °C
  const curvaPv = Array.from({ length: 25 }, (_, i) => { const t = 5 * i; return [t, antoine(t)]; });
  const ejesPv = extra => Object.assign({
    x: { min: 0, max: 120, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    y: { min: 0, max: 210, paso: 50, nombre: 'P', unidad: 'kPa', decimales: 0, color: 'o' },
    curvas: [{ puntos: curvaPv, color: 'o', rotulo: 'presión de vapor' , en: [20, 30] }],
    alt: 'Presión de vapor del agua contra la temperatura: sube cada vez más rápido. Corta los 101 kPa a 100 °C, los 63 kPa (Juliaca) a 87 °C y los 200 kPa a 120 °C.',
  }, extra);
  const linea = (pk, extra = {}) => Object.assign({ puntos: [[0, pk], [120, pk]], color: 'o', discontinua: true }, extra);
  const dibPv = val => ({ datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(val.p)], puntos: [{ x: ebulle(val.p), y: val.p, color: 'h', rotulo: `${f(ebulle(val.p), 0)} °C`, guias: true }] }), estado: {} });
  const vapor = {
    id: 'presion-vapor',
    titulo: 'Hervir es igualar la presión',
    temas: ['Presión de vapor y punto de ebullición'],
    pieza: 'ejes',
    // Lee (fase 2): evaporar, presión de vapor y hervir, y cómo leer la figura. No dice hacia dónde se mueve la ebullición
    // cuando la presión de afuera sube («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Secarse sin hervir', texto: 'La ropa tendida en Juliaca se seca aunque el agua nunca hierva. Del líquido siempre escapan algunas moléculas hacia el aire: el agua se evapora poco a poco.' },
        { titulo: 'Presión de vapor', texto: 'En un frasco cerrado, las moléculas que escapan del líquido forman vapor y empujan. Cuando escapan tantas como vuelven al líquido, esa presión ya no cambia: es la presión de vapor.' },
        { titulo: 'Hervir es otra cosa', texto: 'Al hervir, se forman burbujas de vapor dentro del líquido, no solo en la superficie. Evaporarse, en cambio, pasa solo en la superficie y a cualquier temperatura.' },
        { titulo: 'Qué mirar', texto: ['En el juego, la curva es la presión de vapor del agua y la línea punteada, la presión de afuera. Mira en qué temperatura ', T, ' se cortan.'] },
      ],
    },
    juega: {
      consigna: 'La curva es la presión del vapor del agua a cada temperatura. La presión de afuera sube y baja sola: mira dónde corta la curva.',
      voz: 'Busca la temperatura de ebullición en Juliaca.',
      controles: [{ id: 'p', etiqueta: 'P externa', color: 'c-o', min: 40, max: 200, paso: 10, inicio: 100, unidad: 'kPa', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } }],
      dibujo: val => dibPv(val),
      lectura: val => [`Con ${f(val.p, 0)} kPa afuera, hierve a `, T, ` = ${f(ebulle(val.p), 1)} °C`],
      minimo: 3,
      // Se agarra la línea de la presión de afuera (en su corte con la curva) y se la sube o baja: responde T de ebullición.
      arrastres: [{ id: 'presion', etiqueta: 'línea de la presión de afuera', color: 'c-o',
        donde: val => { const g = EJES().geometria(dibPv(val).datos); return { x: g.X(ebulle(val.p)), y: g.Y(val.p) }; },
        mover: (pt, val) => ({ p: inversa(EJES().geometria(dibPv(val).datos).Y, 0, 210)(pt.y) }) }],
    },
    predice: {
      pregunta: ['En una olla a presión, el agua soporta ', P, ' = 200 kPa por encima. ¿A qué temperatura hierve?'],
      voz: 'Piensa qué presión tiene que alcanzar el vapor.',
      opciones: [
        { id: 'c', texto: `${f(ebulle(200), 0)} °C`, correcta: true },
        { id: 'cien', texto: '100 °C, como siempre', error: 'MA7', siFuera: '100 °C es a 101 kPa. Con más presión afuera, el vapor necesita más temperatura.' },
        { id: 'doble', texto: '200 °C', error: 'QM-PROPORCIONAL', siFuera: 'Eso supone que T crece en proporción a P. La curva no es recta.' },
        { id: 'menos', texto: '87 °C', error: 'QM-EBULLICION-INVERSA', siFuera: '87 °C es con menos presión, como en Juliaca. Con más presión, hierve más caliente.' },
      ],
      dibujo: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(200)] }), estado: {} },
      revelar: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(200)], puntos: [{ x: ebulle(200), y: 200, color: 'h', rotulo: `${f(ebulle(200), 0)} °C`, guias: true }] }), estado: {} },
      coincide: 'Coincide: el vapor alcanza 200 kPa cerca de 120 °C.',
      noCoincide: 'El vapor llega a 200 kPa recién cerca de 120 °C.',
    },
    mira: {
      datos: ejesPv({
        curvas: [{ puntos: curvaPv, color: 'o', desde: 1 }, linea(101.3, { desde: 2 }), linea(63, { desde: 3 })],
        puntos: [
          { x: 20, y: antoine(20), color: 'o', rotulo: `20 °C: ${f(antoine(20), 1)} kPa`, desde: 1 },
          { x: 100, y: 101.3, color: 'h', rotulo: '100 °C', guias: true, desde: 2 },
          { x: ebulle(63), y: 63, color: 'h', rotulo: `${f(ebulle(63), 0)} °C`, guias: true, desde: 3 },
        ],
      }),
      voz: 'Miremos el vapor antes de que hierva.',
      pasos: [
        { estado: { corte: 1 }, texto: 'A 20 °C ya hay vapor: evaporación y condensación se igualan.', ecuacion: [{ sub: [P, 'vapor'] }, ` = ${f(antoine(20), 1)} kPa`] },
        { estado: { corte: 2 }, texto: 'Al nivel del mar, con 101 kPa afuera, hierve a 100 °C.', ecuacion: [{ sub: [P, 'vapor'] }, ' = ', { sub: [P, 'ext'] }, ' = 101 kPa'] },
        { estado: { corte: 3 }, texto: `En Juliaca, con 63 kPa, hierve a unos ${f(ebulle(63), 0)} °C.`, ecuacion: [{ sub: [P, 'vapor'] }, ' = 63 kPa'] },
      ],
    },
    regla: {
      texto: 'Un líquido hierve cuando su presión de vapor iguala a la presión de afuera. A menor presión externa, hierve a menor temperatura.',
      ecuacion: [{ llave: [{ sub: [P, 'vapor'] }, '(', { sub: [T, 'eb'] }, ')'], nota: 'del líquido', color: 'c-o' }, ' = ', { llave: [{ sub: [P, 'externa'] }], nota: 'de afuera', color: 'c-o' }],
      condicion: 'sustancia pura; la presión de vapor depende de la temperatura, no de cuánto líquido hay ni del tamaño del frasco.',
      voz: 'Antes de hervir ya hay vapor. Hervir es otra cosa.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con azar(s + 900) y la misma curva (Antoine, ebulle()).
    resuelve: {
      generar(s) {
        const a = azar(s + 900), pk = a.de([50, 60, 70, 80, 90, 120, 140, 160, 180]), tb = ebulle(pk), tr = Math.round(tb);
        const alta = pk < 101, lugar = alta ? 'en una ciudad alta' : 'en una olla a presión';
        const Teb = { sub: [T, 'eb'] };
        return {
          enunciado: [`El agua está ${lugar}, con `, P, ` = ${pk} kPa sobre ella. Según su curva de presión de vapor, ¿a qué temperatura hierve?`],
          dibujo: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(pk)] }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la temperatura ', Teb, ` a la que hierve el agua con ${pk} kPa encima.`] },
            { tipo: 'datos', texto: ['La presión de afuera es ', P, ` = ${pk} kPa. Al nivel del mar sería unos 101 kPa.`] },
            { tipo: 'regla', texto: ['El agua hierve cuando la presión de su vapor alcanza a la presión de afuera. Busco en la curva dónde el vapor llega a ese valor.'],
              ecuacion: [{ sub: [P, 'vapor'] }, '(', Teb, ') = ', { sub: [P, 'externa'] }] },
            { tipo: 'cuentas', texto: [`Sigo la línea de ${pk} kPa hasta la curva y bajo al eje de temperatura. A ${tr} °C, la curva marca ${f(antoine(tr), 0)} kPa.`],
              ecuacion: [Teb, ` ≈ ${f(tb, 0)} °C`],
              dibujo: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(pk)], puntos: [{ x: tb, y: pk, color: 'h', rotulo: `${f(tb, 0)} °C`, guias: true }] }), estado: {} } },
            { tipo: 'sentido', texto: [`Hay ${alta ? 'menos' : 'más'} presión que al nivel del mar, así que hierve ${alta ? 'antes' : 'después'} de los 100 °C: a unos ${f(tb, 0)} °C. Cuadra.`] },
          ],
          respuesta: [`Hierve a unos ${f(tb, 0)} °C.`],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca dónde la curva alcanza esa presión.',
      generar(s) {
        const a = azar(s), pk = a.de([50, 60, 70, 80, 90, 120, 140, 160, 180]), tb = ebulle(pk);
        const lugar = pk < 101 ? 'en una ciudad alta' : 'en una olla a presión';
        return {
          pregunta: [`El agua está ${lugar}, con `, P, ` = ${pk} kPa sobre ella. Según su curva de presión de vapor, ¿a qué temperatura hierve?`],
          dibujo: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(pk)] }), estado: {} },
          opciones: opciones(Math.round(tb), [
            { id: 'cien', valor: 100, error: 'MA7', siFuera: '100 °C es solo con 101 kPa afuera.' },
            { id: 'prop', valor: Math.round(100 * pk / 101.3), error: 'QM-PROPORCIONAL', siFuera: 'Eso supone que T crece en proporción a P; la curva no es recta.' },
            { id: 'inversa', valor: Math.round(200 - tb), error: 'QM-EBULLICION-INVERSA', siFuera: 'Eso cambia el sentido: con más presión afuera, hierve más caliente.' },
          ], x => `${f(x, 0)} °C`),
          solucion: { texto: `La curva alcanza ${pk} kPa cerca de ${f(tb, 0)} °C.`, ecuacion: [{ sub: [T, 'eb'] }, ` ≈ ${f(tb, 0)} °C`], dibujo: { datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(pk)], puntos: [{ x: tb, y: pk, color: 'h', rotulo: `${f(tb, 0)} °C`, guias: true }] }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: el diagrama de fases es un mapa ----------
  // Cambia: la temperatura y la presión del punto · Permanece: las tres curvas del CO₂ · Progresa: el punto cruza de una
  // región a otra · Se reserva: a 1 atm el CO₂ sólido pasa directo a gas · Debe verse: en qué región está el punto.
  const TP = [-56.6, 5.11], TC = [31, 72.9];
  const psub = t => 5.11 * Math.exp(3140 * (1 / 216.55 - 1 / (t + 273.15)));
  const pvap = t => 5.11 * Math.exp(1998.5 * (1 / 216.55 - 1 / (t + 273.15)));
  const tfus = p => -56.6 + 0.0125 * (p - 5.11);
  function fase(t, p) {
    if (t >= TC[0] && p >= TC[1]) return 'supercrítico';
    if (t <= TP[0]) return p > psub(t) ? 'sólido' : 'gas';
    if (t < tfus(p)) return 'sólido';
    if (t < TC[0] && p > pvap(t)) return 'líquido';
    return 'gas';
  }
  const CURVAS_CO2 = [
    { puntos: Array.from({ length: 15 }, (_, i) => { const t = -100 + i * (43.4 / 14); return [t, psub(t)]; }), color: 'h' },
    { puntos: [TP, [tfus(100), 100]], color: 'h' },
    { puntos: Array.from({ length: 16 }, (_, i) => { const t = TP[0] + i * (87.6 / 15); return [t, pvap(t)]; }), color: 'h' },
  ];
  const ejesFase = extra => Object.assign({
    x: { min: -100, max: 40, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    y: { min: 0, max: 100, paso: 20, nombre: 'P', unidad: 'atm', decimales: 0, color: 'o' },
    curvas: CURVAS_CO2,
    alt: 'Diagrama de fases del CO₂: sólido a la izquierda arriba, líquido en el centro arriba y gas abajo. Punto triple a −56,6 °C y 5,1 atm; punto crítico a 31 °C y 72,9 atm.',
  }, extra);
  // Puntos (T en °C, P en atm) de «Ahora tú» y de «Así se resuelve».
  const PUNTOS = [[-80, 10], [-40, 1], [0, 60], [20, 30], [-60, 2], [10, 70], [-20, 40], [35, 76], [-90, 40], [25, 66]];
  const dibFase = val => ({ datos: ejesFase({ puntos: [{ x: val.t, y: val.p, color: 'o', rotulo: fase(val.t, val.p) }] }), estado: {} });
  const arrastreFase = { id: 'punto', etiqueta: 'punto del mapa: temperatura y presión', color: 'c-o',
    donde: val => { const g = EJES().geometria(dibFase(val).datos); return { x: g.X(val.t), y: g.Y(val.p) }; },
    mover: (pt, val) => { const g = EJES().geometria(dibFase(val).datos); return { t: inversa(g.X, -100, 40)(pt.x), p: inversa(g.Y, 0, 100)(pt.y) }; } };
  const diagrama = {
    id: 'diagrama-fases',
    titulo: 'El mapa de las fases',
    temas: ['Diagrama de fases'],
    pieza: 'ejes',
    // Lee (fase 2): el mapa, sus fronteras y el hielo seco. No dice qué le pasa al CO₂ sólido a 1 atm («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un mapa', texto: ['Un diagrama de fases es un mapa. La temperatura ', T, ' va en el eje horizontal y la presión ', P, ' en el vertical. Cada punto dice en qué fase está la sustancia con esas condiciones.'] },
        { titulo: 'Las fronteras', texto: 'Las curvas del mapa son fronteras entre regiones. Sobre una frontera conviven dos fases, como el agua y el hielo de una jarra a 0 °C y 1 atm.' },
        { titulo: 'El CO₂', texto: 'El dióxido de carbono, CO₂, es el gas que exhalas y el de las burbujas de una gaseosa. Sólido se llama hielo seco y se usa para mantener muy frías las vacunas y los helados.' },
        { titulo: 'Qué mirar', texto: 'En el juego, mueve el punto por el mapa del CO₂ y lee en qué fase queda. Fíjate qué curva cruzas al pasar de una región a otra.' },
      ],
    },
    juega: {
      consigna: 'Diagrama de fases del CO₂. La presión sube y baja sola: lee en qué fase está. Cambia la temperatura y mueve el punto.',
      voz: 'Busca dónde está el CO₂ líquido.',
      controles: [
        { id: 't', etiqueta: 'T', color: 'c-h', min: -90, max: 40, paso: 10, inicio: -20, unidad: '°C', decimales: 0 },
        { id: 'p', etiqueta: 'P', color: 'c-o', min: 1, max: 76, paso: 1, inicio: 1, unidad: 'atm', decimales: 0, auto: { velocidad: 12, modo: 'rebota' } },
      ],
      dibujo: val => dibFase(Object.assign({}, val, { p: Math.round(val.p) })),
      lectura: val => [`A ${f(val.t, 0)} °C y ${f(Math.round(val.p), 0)} atm: ${fase(val.t, Math.round(val.p))}`],
      minimo: 4,
      // Se agarra el punto y se lo pasea por el mapa: x es la temperatura, y la presión; la fase se lee en el rótulo.
      arrastres: [arrastreFase],
    },
    predice: {
      pregunta: ['A 1 atm calientas hielo seco (CO₂ sólido) desde −90 °C. ¿Qué le pasa al llegar a unos −78 °C?'],
      voz: 'Sigue la recta de 1 atm de izquierda a derecha.',
      opciones: [
        { id: 'c', texto: 'Pasa directo a gas', correcta: true },
        { id: 'funde', texto: 'Se funde y después hierve', error: 'QM-SIEMPRE-LIQUIDO', siFuera: 'Así pasa con el agua a 1 atm. El CO₂ líquido solo existe sobre 5,1 atm.' },
        { id: 'cero', texto: 'Nada; se funde recién a 0 °C', error: 'QM-SIEMPRE-LIQUIDO', siFuera: '0 °C es la fusión del agua. Cada sustancia tiene su propio diagrama.' },
      ],
      dibujo: { datos: ejesFase({ curvas: [{ puntos: [[-100, 1], [40, 1]], color: 'o', discontinua: true }], puntos: [{ x: -90, y: 1, color: 'o', rotulo: '−90 °C, 1 atm' }] }), estado: {} },
      revelar: { datos: ejesFase({ curvas: [...CURVAS_CO2, { puntos: [[-100, 1], [40, 1]], color: 'o', discontinua: true }], puntos: [{ x: -78.5, y: 1, color: 'o', rotulo: '−78,5 °C: sublima' }] }), estado: {} },
      coincide: 'Coincide: a 1 atm la recta cruza del sólido al gas sin pasar por líquido.',
      noCoincide: 'A 1 atm la recta va del sólido al gas: sublima a −78,5 °C.',
    },
    mira: {
      datos: ejesFase({
        curvas: CURVAS_CO2.map((c, i) => Object.assign({}, c, { desde: i + 1 })),
        puntos: [{ x: TP[0], y: TP[1], color: 'o', rotulo: 'punto triple', desde: 4 }, { x: TC[0], y: TC[1], color: 'o', rotulo: 'punto crítico', desde: 5 }],
      }),
      voz: 'Leamos el mapa curva por curva.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Abajo a la izquierda: sólido y gas conviven sobre esta curva.', ecuacion: ['sublimación'] },
        { estado: { corte: 2 }, texto: 'Esta línea separa sólido de líquido: fusión.', ecuacion: ['fusión'] },
        { estado: { corte: 3 }, texto: 'Esta curva separa líquido de gas: vaporización.', ecuacion: ['vaporización'] },
        { estado: { corte: 4 }, texto: 'En el punto triple conviven las tres fases.', ecuacion: ['−56,6 °C y 5,1 atm'] },
        { estado: { corte: 5 }, texto: 'Pasado el punto crítico, líquido y gas ya no se distinguen.', ecuacion: ['31 °C y 72,9 atm'] },
      ],
    },
    regla: {
      texto: 'Cada región del diagrama es una fase estable; sobre una curva conviven dos fases y en el punto triple, tres. Un cambio a presión fija se lee como recta horizontal.',
      ecuacion: ['curva: 2 fases', '   ·   ', 'punto triple: 3 fases'],
      condicion: 'es el equilibrio de una sustancia pura: no dice cuánto tarda el cambio. Cada sustancia tiene su propio diagrama.',
      voz: 'Ubica el punto y lee la región. El mapa no corre solo.',
    },
    // Así se resuelve (fase 2): un punto de «Ahora tú» elegido con azar(s + 900). Las cuentas comparan el punto con la
    // frontera que le toca, con las mismas curvas que usa fase() (psub, pvap, tfus y el punto crítico).
    resuelve: {
      generar(s) {
        const a = azar(s + 900), [t, p] = a.de(PUNTOS), ok = fase(t, p);
        let txt, ec, ref;
        if (t >= TC[0]) {
          txt = `Pasa de 31 °C, la temperatura del punto crítico. Ahí no hay líquido: si la presión pasa de 72,9 atm es supercrítico; si no, gas.`;
          ec = [P, ` = ${p} atm ${p >= TC[1] ? '≥' : '<'} 72,9 atm`]; ref = { x: TC[0], y: TC[1], color: 'h', rotulo: 'punto crítico' };
        } else if (t <= TP[0]) {
          const ps = psub(t);
          txt = `A ${f(t, 0)} °C, más frío que el punto triple, la frontera es la curva de sublimación. Arriba de ella es sólido; abajo, gas.`;
          ec = [{ sub: [P, 'sub'] }, `(${f(t, 0)} °C) ≈ ${f(ps, 1)} atm ${p > ps ? '<' : '≥'} ${p} atm`]; ref = { x: t, y: ps, color: 'h', rotulo: `${f(ps, 1)} atm` };
        } else if (t < tfus(p)) {
          const tf = tfus(p);
          txt = `A ${p} atm, la línea de fusión está en ${f(tf, 1)} °C. El punto queda a su izquierda: sólido.`;
          ec = [T, ` = ${f(t, 0)} °C < ${f(tf, 1)} °C`]; ref = { x: tf, y: p, color: 'h', rotulo: `${f(tf, 1)} °C` };
        } else {
          const pv = pvap(t);
          txt = `A ${f(t, 0)} °C ya pasó la línea de fusión; la frontera es la curva de vaporización. Arriba de ella es líquido; abajo, gas.`;
          ec = [{ sub: [P, 'vap'] }, `(${f(t, 0)} °C) ≈ ${f(pv, 1)} atm ${p > pv ? '<' : '≥'} ${p} atm`]; ref = { x: t, y: pv, color: 'h', rotulo: `${f(pv, 1)} atm` };
        }
        const lado = { 'sólido': 'arriba de la sublimación', 'líquido': 'arriba de la vaporización', gas: 'debajo de las curvas', 'supercrítico': 'pasado el punto crítico' }[ok];
        return {
          enunciado: ['Según el diagrama del CO₂, ¿en qué fase está a ', T, ` = ${f(t, 0)} °C y `, P, ` = ${p} atm?`],
          dibujo: { datos: ejesFase({ puntos: [{ x: t, y: p, color: 'o', rotulo: '?' }] }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la fase del CO₂ a ', T, ` = ${f(t, 0)} °C y `, P, ` = ${p} atm: en qué región del mapa cae el punto.`] },
            { tipo: 'datos', texto: 'Punto triple del CO₂: −56,6 °C y 5,1 atm. Punto crítico: 31 °C y 72,9 atm.' },
            { tipo: 'regla', texto: 'Cada región del mapa es una fase. Ubico el punto y lo comparo con la curva que hace de frontera a esa temperatura.' },
            { tipo: 'cuentas', texto: txt, ecuacion: ec, dibujo: { datos: ejesFase({ puntos: [ref, { x: t, y: p, color: 'o', rotulo: ok }] }), estado: {} } },
            { tipo: 'sentido', texto: `En el dibujo, el punto queda ${lado}: en la región del ${ok}. Las cuentas y el mapa dicen lo mismo.` },
          ],
          respuesta: [`${f(t, 0)} °C y ${p} atm: ${ok}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica el punto en el mapa.',
      generar(s) {
        const [t, p] = PUNTOS[s % PUNTOS.length], ok = fase(t, p);
        const todas = ['sólido', 'líquido', 'gas', 'supercrítico'];
        const si = { 'sólido': 'Sería sólido si el punto quedara a la izquierda de la fusión y sobre la sublimación.', 'líquido': 'Sería líquido si estuviera entre la fusión y la curva de vaporización.', gas: 'Sería gas si quedara debajo de las curvas de sublimación y vaporización.', 'supercrítico': 'Sería supercrítico si pasara de 31 °C y de 72,9 atm a la vez.' };
        return {
          pregunta: [`Según el diagrama del CO₂, ¿en qué fase está a `, T, ` = ${t} °C y `, P, ` = ${p} atm?`],
          dibujo: { datos: ejesFase({ puntos: [{ x: t, y: p, color: 'o', rotulo: '?' }] }), estado: {} },
          opciones: todas.map(k => (k === ok ? { id: 'c', texto: k, correcta: true } : { id: k.slice(0, 4), texto: k, error: 'QM-FASE-LECTURA', siFuera: si[k] })),
          solucion: { texto: `El punto cae en la región del ${ok}.`, ecuacion: [`${t} °C, ${p} atm → ${ok}`], dibujo: { datos: ejesFase({ puntos: [{ x: t, y: p, color: 'o', rotulo: ok }] }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: gases húmedos y humedad relativa ----------
  // Cambia: cuánto vapor hay y la temperatura · Permanece: el aire de la caja · Progresa: al enfriar, la misma cantidad de
  // vapor se acerca a la saturación · Se reserva: el rocío, cuando el vapor sobra · Debe verse: cuántas moléculas de agua
  // caben como vapor a cada temperatura.
  const PSAT = { 10: 1.23, 15: 1.71, 20: 2.34, 25: 3.17, 30: 4.25 };     // kPa (CRC)
  const KV = 0.5;                                                        // kPa por molécula-modelo de vapor
  function humedo(nv, t) {
    const cabe = Math.floor(PSAT[t] / KV + 1e-9), gas = Math.min(nv, cabe), gotas = nv - gas;
    return { gas, gotas, pv: gas * KV, hr: Math.min(100, 100 * nv * KV / PSAT[t]) };
  }
  const cajaHumeda = (nv, t, extra = {}) => {
    const H = humedo(nv, t);
    return Object.assign({ titulo: `${t} °C`, forma: 'caja', particulas: [{ e: 'aire', n: 5 }, { e: 'H2O', n: H.gas }, ...Array.from({ length: H.gotas }, (_, i) => fijo('H2O', 0.15 + 0.14 * i, 0.92, { resalta: true }))], rotulo: H.gotas ? 'rocío' : `HR ${f(H.hr, 0)} %` }, extra);
  };
  // Sin arrastre: agregar moléculas de vapor no tiene una manija natural en la caja, y la temperatura es de opciones
  // sin lugar en la figura. Queda con − y +.
  const humedad = {
    id: 'gas-humedo',
    titulo: 'Aire húmedo y rocío',
    temas: ['Gases húmedos y humedad relativa'],
    pieza: 'quim-particulas',
    // Lee (fase 2): vapor en el aire, qué es la humedad relativa y el gas recogido sobre agua. No dice qué pasa al
    // enfriar el aire («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Vapor que no se ve', texto: 'El aire siempre lleva algo de vapor de agua, aunque no se vea. En la selva hay mucho; en el altiplano, en los meses secos, muy poco. Ese vapor suma su propia presión a la del aire.' },
        { titulo: 'Humedad relativa', texto: ['Cuando el pronóstico dice «humedad 60 %», habla de la humedad relativa. Compara el vapor que hay en el aire con el máximo que podría tener a esa temperatura, la presión de saturación.'],
          ecuacion: ['HR = 100 · ', { frac: [{ sub: [P, 'vapor'] }, { sub: [P, 'sat'] }] }, ' %'] },
        { titulo: 'Gas sobre agua', texto: 'En el laboratorio, a veces un gas se recoge haciéndolo burbujear dentro de un frasco lleno de agua, puesto boca abajo. Ese gas sale húmedo: lleva vapor de agua mezclado.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cada bolita de agua que flota es vapor. Cambia la temperatura y cuenta cuántas caben flotando; las que no caben quedan abajo, como gotas.' },
      ],
    },
    juega: {
      consigna: 'Cada molécula de agua en el aire aporta 0,5 kPa. El vapor entra y sale solo; cambia la temperatura. Lo que no cabe se condensa.',
      voz: 'Mira cuánto vapor cabe a cada temperatura.',
      controles: [
        { id: 'v', etiqueta: 'Vapor', min: 1, max: 8, paso: 1, inicio: 4, unidad: 'moléculas', decimales: 0, auto: { velocidad: 1.2, modo: 'rebota' } },
        { id: 't', etiqueta: 'T', opciones: [10, 20, 30].map(x => ({ valor: x, texto: `${x} °C` })) },
      ],
      dibujo: val => lupa([cajaHumeda(Math.round(val.v), val.t)]),
      lectura: val => { const H = humedo(Math.round(val.v), val.t); return H.gotas ? [`Satura a ${f(PSAT[val.t], 2)} kPa: ${H.gotas} se condensan`] : [{ sub: [P, 'vapor'] }, ` = ${f(H.pv, 1)} kPa · HR = ${f(H.hr, 0)} %`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Aire a 30 °C con 50 % de humedad relativa se enfría a 10 °C en la noche, sin ganar ni perder vapor. ¿Qué pasa?',
      voz: 'Compara el vapor que hay con el que cabe a 10 °C.',
      opciones: [
        { id: 'c', texto: 'Se forma rocío: el vapor sobra', correcta: true },
        { id: 'baja', texto: 'La humedad relativa baja, porque hace frío', error: 'QM-HR-FRIO', siFuera: 'Bajaría si se calentara. Al enfriar, cabe menos vapor y la humedad relativa sube.' },
        { id: 'igual', texto: 'Sigue en 50 %: no entró ni salió vapor', error: 'QM-HR-FIJA', siFuera: 'El vapor es el mismo, cierto. Pero a 10 °C cabe mucho menos: la proporción cambia.' },
      ],
      dibujo: lupa([cajaHumeda(4, 30), { titulo: '10 °C', forma: 'caja', particulas: [{ e: 'aire', n: 5 }] }], { flechas: true }),
      revelar: lupa([cajaHumeda(4, 30), cajaHumeda(4, 10)], { flechas: true }),
      coincide: 'Coincide: hay 2,1 kPa de vapor y a 10 °C solo caben 1,23 kPa.',
      noCoincide: 'A 10 °C caben 1,23 kPa de vapor; había 2,1 kPa: el resto se condensa.',
    },
    mira: {
      datos: lupa([cajaHumeda(4, 30, { titulo: '30 °C' }), cajaHumeda(4, 20), cajaHumeda(4, 10)].map((c, i) => Object.assign(c, { particulas: c.particulas.map(p => Object.assign({}, p, { desde: i + 1 })) })), { flechas: true, separacion: 20 }).datos,
      voz: 'Enfriemos paso a paso sin cambiar el vapor.',
      pasos: [
        { estado: { corte: 1 }, texto: 'A 30 °C, 2 kPa de vapor son el 47 % de lo que cabe.', ecuacion: ['HR = ', { frac: [{ sub: [P, 'vapor'] }, { sub: [P, 'sat'] }] }, ' = ', { frac: ['2', '4,25'] }, ' = 47 %'] },
        { estado: { corte: 2 }, texto: 'A 20 °C caben 2,34 kPa: la humedad sube al 85 %.', ecuacion: ['HR = ', { frac: ['2', '2,34'] }, ' = 85 %'] },
        { estado: { corte: 3 }, texto: 'A 10 °C caben 1,23 kPa: el vapor que sobra se condensa.', ecuacion: [{ sub: [P, 'vapor'] }, ' = ', { sub: [P, 'sat'] }, ' = 1,23 kPa'] },
        { estado: { corte: 3 }, texto: 'Un gas recogido sobre agua lleva vapor: se resta para el gas seco.', ecuacion: [{ sub: [P, 'seco'] }, ' = ', { sub: [P, 'total'] }, ' − ', { sub: [P, 'vapor'] }] },
      ],
    },
    regla: {
      texto: 'La humedad relativa compara el vapor que hay con el que cabe a esa temperatura. En un gas húmedo, el gas seco tiene la presión total menos la del vapor.',
      ecuacion: ['HR = 100 · ', { frac: [{ sub: [P, 'vapor'] }, { sub: [P, 'sat'] }] }, ' %', '   ·   ', { sub: [P, 'seco'] }, ' = ', { sub: [P, 'total'] }, ' − ', { llave: [{ sub: [P, 'vapor'] }], nota: 'del agua', color: 'c-o' }],
      condicion: 'gas ideal; la presión de saturación es la del agua a la misma temperatura del aire.',
      voz: 'Primero cuánto cabe; después cuánto hay.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» (gas seco si s es impar, humedad relativa si es par), con
    // azar(s + 900) y las mismas cuentas. En la humedad relativa el vapor va de 0,5 en 0,5 kPa, para que la caja use el
    // modelo del juego (0,5 kPa por molécula, humedo() y cajaHumeda()).
    resuelve: {
      generar(s) {
        const a = azar(s + 900), t = a.de([15, 20, 25, 30]), ps = PSAT[t];
        if (s % 2) {
          const pt = a.ent(95, 101), seco = pt - ps;
          const caja = (to, tv) => lupa([{ titulo: `${t} °C, sobre agua`, forma: 'caja', particulas: [{ e: 'O2', n: 6 }, { e: 'H2O', n: 1 }],
            cuenta: [{ e: 'O2', texto: to }, { e: 'H2O', texto: tv }], rotulo: `${pt} kPa en total` }], { especies: Object.assign({}, ESPECIES, { O2: [['O', -5, 0], ['O', 5, 0]] }) });
          const Ps = { sub: [P, 'seco'] }, Pt = { sub: [P, 'total'] }, Pv = { sub: [P, 'vapor'] };
          return {
            enunciado: [`Se recoge oxígeno sobre agua a ${t} °C; la presión total es `, Pt, ` = ${pt} kPa. ¿Cuál es la presión del oxígeno seco? (agua a ${t} °C: ${f(ps, 2)} kPa)`],
            dibujo: caja('¿?', `${f(ps, 2)} kPa`),
            pasos: [
              { tipo: 'pide', texto: ['Piden la presión del oxígeno seco: la que tendría sin el vapor de agua que se le mezcló.'] },
              { tipo: 'datos', texto: ['La presión total es ', Pt, ` = ${pt} kPa a ${t} °C. A esa temperatura, el vapor de agua aporta ${f(ps, 2)} kPa.`] },
              { tipo: 'regla', texto: ['Un gas recogido sobre agua sale húmedo: la presión total es la del gas más la del vapor. Para el gas seco, resto el vapor.'],
                ecuacion: [Ps, ' = ', Pt, ' − ', Pv] },
              { tipo: 'cuentas', texto: [`Resto la presión del vapor de agua a ${t} °C.`], ecuacion: [Ps, ` = ${pt} − ${f(ps, 2)} = ${f(seco, 2)} kPa`],
                dibujo: caja(`${f(seco, 2)} kPa`, `${f(ps, 2)} kPa`) },
              { tipo: 'sentido', texto: [`El oxígeno seco da un poco menos que la total, y de vuelta: ${f(seco, 2)} + ${f(ps, 2)} = ${pt} kPa. Cuadra.`] },
            ],
            respuesta: [Ps, ` = ${f(seco, 2)} kPa`],
          };
        }
        const nv = a.de([1, 2, 3]), pv = nv * KV, hr = 100 * pv / ps;
        return {
          enunciado: [`El aire a ${t} °C tiene `, { sub: [P, 'vapor'] }, ` = ${f(pv, 1)} kPa. ¿Cuál es su humedad relativa? (saturación a ${t} °C: ${f(ps, 2)} kPa)`],
          dibujo: lupa([cajaHumeda(nv, t, { rotulo: 'HR = ¿?' })]),
          pasos: [
            { tipo: 'pide', texto: [`Piden la humedad relativa del aire a ${t} °C, en porcentaje.`] },
            { tipo: 'datos', texto: ['Hay ', { sub: [P, 'vapor'] }, ` = ${f(pv, 1)} kPa de vapor. A ${t} °C, el aire se satura con ${f(ps, 2)} kPa.`] },
            { tipo: 'regla', texto: ['La humedad relativa compara el vapor que hay con el máximo que cabe a esa temperatura, y lo dice en porcentaje.'],
              ecuacion: ['HR = 100 · ', { frac: [{ sub: [P, 'vapor'] }, { sub: [P, 'sat'] }] }, ' %'] },
            { tipo: 'cuentas', texto: ['Divido el vapor que hay entre el que cabe y multiplico por 100.'], ecuacion: [`HR = 100 · ${f(pv, 1)} / ${f(ps, 2)} = ${f(hr, 0)} %`],
              dibujo: lupa([cajaHumeda(nv, t)]) },
            { tipo: 'sentido', texto: [`Hay menos vapor del que cabe, así que la humedad debía quedar debajo de 100 %: ${f(hr, 0)} %. En la caja, ninguna molécula queda abajo como gota.`] },
          ],
          respuesta: [`HR = ${f(hr, 0)} %`],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca la presión de saturación a esa temperatura.',
      generar(s) {
        const a = azar(s), t = a.de([15, 20, 25, 30]), ps = PSAT[t];
        if (s % 2) {
          const pt = a.ent(95, 101), seco = pt - ps;
          return {
            pregunta: [`Se recoge oxígeno sobre agua a ${t} °C; la presión total es `, { sub: [P, 'total'] }, ` = ${pt} kPa. ¿Cuál es la presión del oxígeno seco? (agua a ${t} °C: ${f(ps, 2)} kPa)`],
            opciones: opciones(seco, [
              { id: 'total', valor: pt, error: 'QM-GAS-HUMEDO', siFuera: 'Eso sería cierto si el gas estuviera seco; sobre agua lleva vapor.' },
              { id: 'suma', valor: pt + ps, error: 'QM-GAS-HUMEDO', siFuera: 'El vapor ya está dentro de la presión total; se resta, no se suma.' },
              { id: 'vapor', valor: ps, error: 'QM-GAS-HUMEDO', siFuera: 'Esa es la presión del vapor de agua, no la del oxígeno.' },
            ], x => `${f(x, 2)} kPa`),
            solucion: { texto: 'Se resta el aporte del vapor.', ecuacion: [{ sub: [P, 'seco'] }, ` = ${pt} − ${f(ps, 2)} = ${f(seco, 2)} kPa`] },
          };
        }
        const pv = a.de([0.6, 0.8, 1, 1.2, 1.5]), hr = 100 * pv / ps;
        return {
          pregunta: [`El aire a ${t} °C tiene `, { sub: [P, 'vapor'] }, ` = ${f(pv, 1)} kPa. ¿Cuál es su humedad relativa? (saturación a ${t} °C: ${f(ps, 2)} kPa)`],
          opciones: opciones(hr, [
            { id: 'inv', valor: 100 * ps / pv, error: 'QM-HR-INVERTIDA', siFuera: 'Eso invierte la fracción; la humedad relativa no pasa de 100 %.' },
            { id: 'kpa', valor: pv * 10, error: 'QM-HR-FIJA', siFuera: 'Eso convierte la presión en porcentaje sin dividir entre la de saturación.' },
            { id: 'otra', valor: 100 * pv / PSAT[30 === t ? 10 : 30], error: 'QM-HR-FRIO', siFuera: 'Eso usa la saturación de otra temperatura.' },
          ], x => `${f(x, 0)} %`),
          solucion: { texto: 'Vapor que hay entre vapor que cabe.', ecuacion: [`HR = 100 · ${f(pv, 1)} / ${f(ps, 2)} = ${f(hr, 0)} %`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: agua y etanol bajo la misma presión de afuera. Etanol: Antoine (mmHg, °C) A = 8,20417, B = 1642,89,
  // C = 230,3, válido de −57 a 80 °C; por eso la presión llega hasta 101 kPa (el etanol hierve a 78 °C).
  const antoineE = t => 10 ** (8.20417 - 1642.89 / (230.3 + t)) * 0.133322;
  const ebulleE = pk => 1642.89 / (8.20417 - Math.log10(pk / 0.133322)) - 230.3;
  const curvaE = Array.from({ length: 17 }, (_, i) => { const t = 5 * i; return [t, antoineE(t)]; });
  const dibDos = val => ({ datos: ejesPv({
    x: { min: 0, max: 110, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    y: { min: 0, max: 110, paso: 20, nombre: 'P', unidad: 'kPa', decimales: 0, color: 'o' },
    curvas: [{ puntos: curvaPv.filter(([t]) => t <= 105), color: 'o', rotulo: 'agua', en: [88, 30] }, { puntos: curvaE, color: 'd', rotulo: 'etanol', en: [30, 30] }, linea(val.p, { puntos: [[0, val.p], [110, val.p]] })],
    puntos: [{ x: ebulle(val.p), y: val.p, color: 'h', rotulo: `${f(ebulle(val.p), 0)} °C`, guias: true }, { x: ebulleE(val.p), y: val.p, color: 'd', rotulo: `${f(ebulleE(val.p), 0)} °C`, guias: true }],
    alt: `Presión de vapor del agua y del etanol contra la temperatura. Con ${f(val.p, 0)} kPa afuera, el agua hierve a ${f(ebulle(val.p), 0)} °C y el etanol a ${f(ebulleE(val.p), 0)} °C.`,
  }), estado: {} });
  // Mesa 2: el mapa del CO₂ con pasos finos y más presión que la idea 4 (pasa el punto crítico con holgura).
  // Para los retos: la menor presión de la grilla en que el CO₂ queda líquido, con la misma fase() que rotula el punto.
  let minLiq_ = null;
  const minLiq = () => {
    if (minLiq_ === null) { minLiq_ = Infinity; for (let t = -100; t <= 40; t += 2) for (let p = 1; p <= 100; p++) if (fase(t, p) === 'líquido') minLiq_ = Math.min(minLiq_, p); }
    return minLiq_;
  };
  const sinLiquido = q => q === 'sólido' || q === 'gas';
  const dibFase2 = val => ({ datos: ejesFase({ puntos: [{ x: val.t, y: val.p, color: 'o', rotulo: fase(val.t, val.p) }, { x: TP[0], y: TP[1], color: 'h', rotulo: 'triple' }, { x: TC[0], y: TC[1], color: 'h', rotulo: 'crítico' }] }), estado: {} });

  // Mesa 3D «La celda que se repite»: datos de la pieza quim-red-3d, todos del motor (celda, bloqueRed; regla 1).
  const redDe = v => {
    const c = ML.celda(v.red);
    return { datos: v.vis === 1
      ? { modo: 'bloque', bloque: ML.bloqueRed(v.red, 2), radio: v.tam === 1 ? c.radio : 0.12, nombre: c.nombre }
      : { modo: 'celda', sitios: c.sitios, radio: v.tam === 1 ? c.radio : 0.14, nombre: c.nombre }, estado: {} };
  };
  const MAS_LLENA = ML.REDES_ORDEN.reduce((m, k) => (ML.celda(k).empaquetamiento > ML.celda(m).empaquetamiento ? k : m));
  const Nc = { v: 'c-i', t: 'N' };

  return {
    unidad: 'quimica.liquidos-y-solidos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js',
      '/plantillas/liquidos-y-solidos/motor.js', '/nucleo/kit/piezas/quim-red-3d.js'],
    historia: {
      texto: 'Saber cuándo pueden convivir hielo, agua y vapor pide más que nombrar estados. En 1878, Josiah Willard Gibbs publicó un estudio sobre el equilibrio de sustancias con varias fases que ordenó esas observaciones con temperatura y presión. Un diagrama de fases actual resume esas condiciones de equilibrio. No es una película del calentamiento: dice qué fase es estable, no cuánto tarda en cambiar.',
      pregunta: '¿Por qué en Juliaca el agua hierve antes que en Lima?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §10.4', url: 'https://openstax.org/books/chemistry-2e/pages/10-4-phase-diagrams' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que este tema estrena en química. Fase, presión y gas ideal vienen de
    // unidades anteriores; el lector las marca solas.
    glosario: [
      { termino: 'sólido cristalino', def: 'Sólido cuyas partículas siguen un orden que se repite. Funde a una temperatura fija.',
        formas: ['sólido cristalino', 'sólidos cristalinos', 'cristalino'], ejemplo: 'La sal y el hielo.', ver: ['sólido amorfo'] },
      { termino: 'sólido amorfo', def: 'Sólido con partículas fijas pero sin orden que se repita. Al calentarlo se ablanda poco a poco.',
        formas: ['sólido amorfo', 'sólidos amorfos', 'amorfo'], ejemplo: 'El vidrio.', ver: ['sólido cristalino'] },
      { termino: 'tensión superficial', simbolo: 'γ', medida: 'N/m', def: 'Tirón hacia adentro que sienten las moléculas de la superficie de un líquido; la hace como una piel.',
        ejemplo: 'Agua: 0,0728 N/m; etanol: 0,0223 N/m.', ver: ['capilaridad'] },
      { termino: 'viscosidad', def: 'Cuánto le cuesta fluir a un líquido. La miel tiene mucha; el agua, poca.',
        ver: ['tensión superficial'] },
      { termino: 'capilaridad', def: 'Subida o bajada de un líquido en un tubo muy delgado, por su tensión superficial y cómo moja la pared.',
        ejemplo: 'Agua en un tubo de 0,5 mm de radio: sube unos 3 cm.', ver: ['tensión superficial'] },
      { termino: 'presión de vapor', medida: 'kPa', def: 'Presión del vapor sobre su líquido en un frasco cerrado, cuando se evapora tanto como se condensa.',
        formas: ['presión de vapor', 'presiones de vapor'], ejemplo: 'Agua a 20 °C: 2,3 kPa.', ver: ['ebullición'] },
      { termino: 'evaporación', def: 'Paso lento de líquido a gas por la superficie, a cualquier temperatura y sin burbujas.',
        formas: ['evaporación', 'evapora', 'evaporarse'], ejemplo: 'La ropa tendida se seca sin que el agua hierva.', ver: ['ebullición', 'presión de vapor'] },
      { termino: 'ebullición', def: 'Cuando la presión de vapor de un líquido iguala la de afuera: se forman burbujas de vapor en todo él.',
        formas: ['temperatura de ebullición', 'ebullición', 'hierve', 'hervir'], ejemplo: 'En Juliaca, a 63 kPa, el agua lo hace a 87 °C.', ver: ['presión de vapor'] },
      { termino: 'diagrama de fases', def: 'Mapa de presión contra temperatura que dice en qué estado está estable una sustancia.',
        formas: ['diagrama de fases', 'diagramas de fases'], ver: ['punto triple', 'punto crítico'] },
      { termino: 'punto triple', def: 'La única presión y temperatura donde sólido, líquido y gas de una sustancia conviven.',
        ejemplo: 'CO₂: −56,6 °C y 5,1 atm.', ver: ['diagrama de fases'] },
      { termino: 'punto crítico', def: 'Presión y temperatura desde las cuales ya no se distingue el líquido del gas.',
        ejemplo: 'CO₂: 31 °C y 72,9 atm.', ver: ['fluido supercrítico'] },
      { termino: 'fluido supercrítico', def: 'Estado pasado el punto crítico: llena el recipiente como un gas, pero es denso como un líquido.',
        formas: ['fluido supercrítico', 'supercrítico'], ver: ['punto crítico'] },
      { termino: 'sublimación', def: 'Paso directo de sólido a gas, sin fundirse primero.',
        formas: ['sublimación', 'sublima', 'sublimar'], ejemplo: 'El hielo seco a 1 atm.', ver: ['diagrama de fases'] },
      { termino: 'humedad relativa', medida: '%', def: 'Cuánto vapor de agua tiene el aire comparado con el máximo que cabe a esa temperatura.',
        ver: ['presión de vapor'] },
      { termino: 'presión de saturación', simbolo: 'Pₛₐₜ', medida: 'kPa', def: 'La mayor presión de vapor de agua que cabe en el aire a una temperatura; lo que sobra se condensa.',
        ejemplo: 'A 20 °C: 2,34 kPa.', ver: ['humedad relativa', 'presión de vapor'] },
      { termino: 'gas húmedo', def: 'Gas recogido sobre agua: lleva vapor de agua mezclado, que suma su presión.',
        formas: ['gas húmedo', 'gases húmedos'], ver: ['gas seco'] },
      { termino: 'gas seco', def: 'La parte del gas húmedo que no es vapor: su presión es la total menos la del vapor.',
        ver: ['gas húmedo'] },
      { termino: 'red cristalina', formas: ['red cristalina', 'redes cristalinas', 'red', 'redes'],
        def: 'Orden de puntos que se repite igual en las tres direcciones; en cada punto hay un átomo o ion.',
        ver: ['celda unitaria', 'sólido cristalino'] },
      { termino: 'celda unitaria', formas: ['celda unitaria', 'celdas unitarias', 'celda', 'celdas'],
        def: 'La caja más pequeña que, repetida como ladrillos, arma toda la red cristalina.',
        ejemplo: 'Un átomo en un vértice se reparte entre 8 de ellas: cuenta ⅛.', ver: ['red cristalina'] },
      { termino: 'número de coordinación', formas: ['número de coordinación', 'números de coordinación'],
        def: 'Cuántos átomos tocan a uno dado en una red: los que están más cerca de él.',
        ejemplo: 'Cúbica simple: 6; centrada en el cuerpo: 8; centrada en las caras: 12.', ver: ['red cristalina'] },
      { termino: 'empaquetamiento', formas: ['empaquetamiento', 'fracción de empaquetamiento'], medida: '%',
        def: 'Parte del volumen de la celda que ocupan las esferas; el resto es espacio vacío.',
        ejemplo: 'Centrada en las caras: 74 %, lo más que se puede con esferas iguales.', ver: ['celda unitaria'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La 3D (la celda que se repite) va primera. La segunda pone dos líquidos bajo la misma presión (la
    // idea 3 solo tiene agua); la tercera recorre el mapa del CO₂ con pasos finos, de 0 a 100 atm. Las lecturas dicen
    // las condiciones y el resultado, para que un caso guardado se lea solo.
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        // Fracciones, átomos por celda, vecinos y empaquetamiento salen del motor (celda, bloqueRed).
        id: 'celda-se-repite', titulo: 'La celda que se repite', pieza: 'quim-red-3d',
        consigna: 'La celda gira sola: de cada esfera solo cuenta el trozo de adentro. Pausa y gírala con el dedo. Cambia de red; mira ocho celdas.',
        controles: [
          { id: 'red', etiqueta: 'Red', opciones: ML.REDES_ORDEN.map(k => ({ valor: k, texto: { cs: 'Cúbica simple', bcc: 'Centrada en el cuerpo', fcc: 'Centrada en las caras' }[k] })) },
          { id: 'vis', etiqueta: 'Ver', opciones: [{ valor: 0, texto: 'Una celda' }, { valor: 1, texto: 'Ocho celdas' }] },
          { id: 'tam', etiqueta: 'Esferas', opciones: [{ valor: 1, texto: 'Tamaño real' }, { valor: 0, texto: 'Chicas' }] },
          // Animación (ronda 5): la figura gira sola sobre su eje vertical, 30° por segundo (la pieza mueve, no rearma).
          { id: 'giro', etiqueta: 'Giro', min: 0, max: 360, paso: 30, inicio: 0, unidad: '°', decimales: 0, auto: { velocidad: 30 } },
        ],
        dibujo: v => { const d = redDe(v); d.datos.giro = v.giro || 0; return d; },
        lectura: v => { const c = ML.celda(v.red); return [`${c.sigla}: `, Nc, ` = ${f(c.atomosPorCelda, 0)} por celda, ${c.coordinacion} vecinos, ${f(100 * c.empaquetamiento, 0)} % lleno · ${f(v.giro || 0, 0)}°`]; },
        // Retos comprobados con el mismo motor que arma la celda (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Arma una celda con 4 átomos en total, contando solo los trozos de adentro.',
            logrado: v => v.vis === 0 && ML.celda(v.red).atomosPorCelda === 4,
            bien: 'Ocho octavos y seis mitades: 1 + 3 = 4. No son 14.',
            pista: 'Prueba la red con un átomo en el centro de cada cara.' },
          { texto: 'Mira ocho celdas y busca la red donde cada átomo toca a 8 vecinos.',
            logrado: v => v.vis === 1 && ML.celda(v.red).coordinacion === 8,
            bien: 'Número de coordinación 8: el del centro toca a los ocho vértices.',
            pista: 'Elige «Ocho celdas» y esferas chicas, y cuenta las naranjas.' },
          { texto: 'Encuentra la red que deja menos espacio vacío entre sus esferas.',
            logrado: v => v.red === MAS_LLENA,
            bien: 'El mayor empaquetamiento: así se apilan las naranjas en el mercado.',
            pista: 'Compara el porcentaje lleno de la lectura en las tres redes.' },
          { texto: 'Con esferas chicas, encuentra un átomo que cuente entero para la celda.',
            logrado: v => v.tam === 0 && v.vis === 0 && ML.celda(v.red).sitios.some(s => s.fraccion === 1),
            bien: 'El del centro no se reparte con otra celda: cuenta 1.',
            pista: 'Busca una red con un átomo justo en el centro del cubo.' },
          { texto: 'Guarda dos redes: una con el doble de átomos por celda que la otra.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => ML.celda(a.red).atomosPorCelda === 2 * ML.celda(b.red).atomosPorCelda)),
            bien: 'Más átomos en el mismo cubo: más masa en el mismo volumen.',
            pista: 'Guarda la cúbica simple y después la centrada en el cuerpo.' },
        ],
      },
      {
        id: 'dos-liquidos', titulo: 'Agua y etanol, misma presión', pieza: 'ejes',
        consigna: 'Sube o baja la presión de afuera, como si cambiaras de altura. Compara dónde hierve cada líquido.',
        controles: [{ id: 'p', etiqueta: 'P externa', color: 'c-o', min: 20, max: 101, paso: 1, inicio: 63, unidad: 'kPa', decimales: 0 }],
        dibujo: val => dibDos(val),
        lectura: val => [`${f(val.p, 0)} kPa → agua ${f(ebulle(val.p), 0)} °C · etanol ${f(ebulleE(val.p), 0)} °C`],
        arrastres: [{ id: 'presion', etiqueta: 'línea de la presión de afuera', color: 'c-o',
          donde: val => { const g = EJES().geometria(dibDos(val).datos); return { x: g.X(ebulle(val.p)), y: g.Y(val.p) }; },
          mover: (pt, val) => ({ p: inversa(EJES().geometria(dibDos(val).datos).Y, 0, 110)(pt.y) }) }],
        // Retos: con ebulle y ebulleE, las mismas curvas que ponen los puntos de ebullición en la gráfica.
        invitaciones: [
          { texto: 'Busca la presión de afuera a la que el agua hierve a 90 °C.',
            logrado: val => f(ebulle(val.p), 0) === '90',
            bien: 'Es como a unos 3000 m de altura. ¿Y el etanol, dónde hierve ahí?' },
          { texto: 'Consigue que el agua hierva por debajo de 70 °C.',
            logrado: val => ebulle(val.p) < 70,
            bien: 'Con tan poca presión, un huevo tarda muchísimo en cocerse.' },
          { texto: 'Busca la presión más baja en que el etanol todavía hierve sobre 60 °C.',
            logrado: val => val.p > 20 && ebulleE(val.p) > 60 && ebulleE(val.p - 1) <= 60,
            bien: 'Un kilopascal menos y ya hierve bajo 60 °C. La curva manda.' },
          { texto: 'Guarda dos casos: que el agua del segundo hierva donde hervía el etanol del primero.',
            logrado: (val, g) => g.some(x => x.p !== val.p && f(ebulle(val.p), 0) === f(ebulleE(x.p), 0))
              && g.some(x => x.p === val.p),
            bien: 'Bajando la presión, el agua imita al etanol: lo que cambió fue afuera.' },
        ],
      },
      {
        id: 'mapa-co2', titulo: 'El mapa completo del CO₂', pieza: 'ejes',
        consigna: 'Pasea el punto por todo el mapa. Busca el hielo seco que sublima, el CO₂ líquido y el fluido supercrítico.',
        controles: [
          { id: 't', etiqueta: 'T', color: 'c-h', min: -100, max: 40, paso: 2, inicio: -78, unidad: '°C', decimales: 0 },
          { id: 'p', etiqueta: 'P', color: 'c-o', min: 1, max: 100, paso: 1, inicio: 1, unidad: 'atm', decimales: 0 },
        ],
        dibujo: val => dibFase2(val),
        lectura: val => [`${f(val.t, 0)} °C y ${f(val.p, 0)} atm → ${fase(val.t, val.p)}`],
        arrastres: [{ id: 'punto', etiqueta: 'punto del mapa: temperatura y presión', color: 'c-o',
          donde: val => { const g = EJES().geometria(dibFase2(val).datos); return { x: g.X(val.t), y: g.Y(val.p) }; },
          mover: (pt, val) => { const g = EJES().geometria(dibFase2(val).datos); return { t: inversa(g.X, -100, 40)(pt.x), p: inversa(g.Y, 0, 100)(pt.y) }; } }],
        // Retos: los decide fase(), la misma que rotula el punto del mapa.
        invitaciones: [
          { texto: 'Pon el CO₂ líquido a 20 °C, temperatura de una sala.',
            logrado: val => val.t === 20 && fase(val.t, val.p) === 'líquido',
            bien: 'A 20 °C pide decenas de atmósferas: así viaja en los extintores.' },
          { texto: 'Busca la menor presión a la que el CO₂ puede ser líquido.',
            logrado: val => fase(val.t, val.p) === 'líquido' && val.p === minLiq(),
            bien: 'Bajo el punto triple no hay líquido: por eso el hielo seco no moja.' },
          { texto: 'Lleva el punto a la zona del fluido supercrítico.',
            logrado: val => fase(val.t, val.p) === 'supercrítico',
            bien: 'Pasado el punto crítico, ya no se distingue líquido de gas.' },
          { texto: 'Guarda dos casos a la misma presión: uno sólido y otro gas, sin líquido entre ellos.',
            logrado: (val, g) => val.p < TP[1] && sinLiquido(fase(val.t, val.p))
              && g.some(x => x.p === val.p && sinLiquido(fase(x.t, x.p)) && fase(x.t, x.p) !== fase(val.t, val.p))
              && g.some(x => x.t === val.t && x.p === val.p),
            bien: 'Bajo 5,1 atm, el sólido pasa directo a gas: eso es sublimar.' },
        ],
      },
    ],
    ideas: [estados, capilar, vapor, diagrama, humedad],
  };
});
