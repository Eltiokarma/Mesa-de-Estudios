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
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
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
  const estados = {
    id: 'orden-y-libertad',
    titulo: 'Orden y libertad de las partículas',
    temas: ['Propiedades de los estados de agregación', 'Sólidos cristalinos y amorfos'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un estado y mira dónde están las partículas: si tienen lugar fijo, si se repite un patrón y si llenan el recipiente.',
      voz: 'Compara el orden de los dos sólidos.',
      controles: [{ id: 'k', etiqueta: 'Estado', opciones: Object.keys(ESTADOS).map(k => ({ valor: k, texto: ESTADOS[k].texto })) }],
      dibujo: val => muestra(val.k),
      lectura: val => [ESTADOS[val.k].lee],
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
      ecuacion: ['cristalino: funde a una temperatura fija   ·   amorfo: se ablanda poco a poco'],
      condicion: 'es un modelo de partículas: las distancias no están a escala y las partículas del sólido también vibran.',
      voz: 'Lugar fijo, orden y espacio libre: tres preguntas, tres respuestas.',
    },
    ahoraTu: {
      voz: 'Decide por cómo están las partículas.',
      generar(s) {
        const CASOS = [
          ['La sal de mesa se rompe en cubitos de caras planas', 'cristal'], ['El vidrio de una ventana se rompe en bordes curvos', 'amorfo'],
          ['La cera de una vela se ablanda poco a poco, sin temperatura fija', 'amorfo'], ['El cuarzo forma prismas con caras planas', 'cristal'],
          ['El aceite toma la forma del frasco pero no lo llena', 'liquido'], ['El aire llena toda la habitación', 'gas'],
          ['La miel fluye lento y toma la forma del plato', 'liquido'], ['El vapor de una olla se esparce por la cocina', 'gas'],
          ['La nieve forma copos de seis puntas', 'cristal'], ['Un caramelo duro se rompe como vidrio, sin caras planas', 'amorfo'],
        ];
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
  const capilar = {
    id: 'capilaridad',
    titulo: 'La superficie que jala',
    temas: ['Tensión superficial, viscosidad y capilaridad'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un tubo de vidrio delgado entra en un líquido y el líquido sube. Elige el radio del tubo y el líquido, y lee la altura.',
      voz: 'Prueba tubos cada vez más angostos.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.25, max: 2, paso: 0.25, inicio: 1, unidad: 'mm', decimales: 2 },
        { id: 'l', etiqueta: 'Líquido', opciones: Object.keys(LIQ).map(k => ({ valor: k, texto: LIQ[k][0] })) },
      ],
      dibujo: val => ({ datos: ejesCap({ curvas: [{ puntos: curvaH(val.l), color: 'i', rotulo: LIQ[val.l][0].toLowerCase() }], puntos: [{ x: val.r, y: kJ(val.l) / val.r, color: 'i', rotulo: `${f(kJ(val.l) / val.r, 1)} mm`, guias: true }] }), estado: {} }),
      lectura: val => [`${LIQ[val.l][0]}: `, h, ` = ${f(kJ(val.l) / val.r, 1)} mm en un tubo de ${f(val.r, 2)} mm`],
      minimo: 3,
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
      texto: 'La tensión superficial y la viscosidad crecen con las fuerzas entre moléculas. En un tubo delgado, un líquido que moja sube más cuanto más angosto es el tubo.',
      ecuacion: [h, ' = ', { frac: ['2γ', ['ρg', r]] }],
      condicion: 'vale para un líquido que moja el vidrio (ángulo de contacto cercano a 0); el mercurio no lo moja y baja.',
      voz: 'Tubo más angosto, subida mayor. Comprueba con la curva.',
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
  const vapor = {
    id: 'presion-vapor',
    titulo: 'Hervir es igualar la presión',
    temas: ['Presión de vapor y punto de ebullición'],
    pieza: 'ejes',
    juega: {
      consigna: 'La curva es la presión del vapor del agua a cada temperatura. Cambia la presión de afuera y mira dónde la corta.',
      voz: 'Busca la temperatura de ebullición en Juliaca.',
      controles: [{ id: 'p', etiqueta: 'P externa', color: 'c-o', min: 40, max: 200, paso: 10, inicio: 100, unidad: 'kPa', decimales: 0 }],
      dibujo: val => ({ datos: ejesPv({ curvas: [{ puntos: curvaPv, color: 'o' }, linea(val.p)], puntos: [{ x: ebulle(val.p), y: val.p, color: 'h', rotulo: `${f(ebulle(val.p), 0)} °C`, guias: true }] }), estado: {} }),
      lectura: val => [`Con ${f(val.p, 0)} kPa afuera, hierve a `, T, ` = ${f(ebulle(val.p), 1)} °C`],
      minimo: 3,
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
      ecuacion: [{ sub: [P, 'vapor'] }, '(', { sub: [T, 'eb'] }, ') = ', { sub: [P, 'externa'] }],
      condicion: 'sustancia pura; la presión de vapor depende de la temperatura, no de cuánto líquido hay ni del tamaño del frasco.',
      voz: 'Antes de hervir ya hay vapor. Hervir es otra cosa.',
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
  const diagrama = {
    id: 'diagrama-fases',
    titulo: 'El mapa de las fases',
    temas: ['Diagrama de fases'],
    pieza: 'ejes',
    juega: {
      consigna: 'Este es el diagrama de fases del CO₂. Mueve el punto con la temperatura y la presión y lee en qué fase está.',
      voz: 'Busca dónde está el CO₂ líquido.',
      controles: [
        { id: 't', etiqueta: 'T', color: 'c-h', min: -90, max: 40, paso: 10, inicio: -90, unidad: '°C', decimales: 0 },
        { id: 'p', etiqueta: 'P', color: 'c-o', min: 1, max: 76, paso: 5, inicio: 1, unidad: 'atm', decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesFase({ puntos: [{ x: val.t, y: val.p, color: 'o', rotulo: fase(val.t, val.p) }] }), estado: {} }),
      lectura: val => [`A ${f(val.t, 0)} °C y ${f(val.p, 0)} atm: ${fase(val.t, val.p)}`],
      minimo: 4,
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
      ecuacion: ['curva: 2 fases   ·   punto triple: 3 fases'],
      condicion: 'es el equilibrio de una sustancia pura: no dice cuánto tarda el cambio. Cada sustancia tiene su propio diagrama.',
      voz: 'Ubica el punto y lee la región. El mapa no corre solo.',
    },
    ahoraTu: {
      voz: 'Ubica el punto en el mapa.',
      generar(s) {
        const PUNTOS = [[-80, 10], [-40, 1], [0, 60], [20, 30], [-60, 2], [10, 70], [-20, 40], [35, 76], [-90, 40], [25, 66]];
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
  const humedad = {
    id: 'gas-humedo',
    titulo: 'Aire húmedo y rocío',
    temas: ['Gases húmedos y humedad relativa'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Cada molécula de agua en el aire aporta 0,5 kPa de vapor. Agrega vapor y cambia la temperatura; lo que no cabe se condensa.',
      voz: 'Mira cuánto vapor cabe a cada temperatura.',
      controles: [
        { id: 'v', etiqueta: 'Vapor', min: 1, max: 8, paso: 1, inicio: 4, unidad: 'moléculas', decimales: 0 },
        { id: 't', etiqueta: 'T', opciones: [10, 20, 30].map(x => ({ valor: x, texto: `${x} °C` })) },
      ],
      dibujo: val => lupa([cajaHumeda(val.v, val.t)]),
      lectura: val => { const H = humedo(val.v, val.t); return H.gotas ? [`Satura a ${f(PSAT[val.t], 2)} kPa: ${H.gotas} se condensan`] : [{ sub: [P, 'vapor'] }, ` = ${f(H.pv, 1)} kPa · HR = ${f(H.hr, 0)} %`]; },
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
      ecuacion: ['HR = 100 · ', { frac: [{ sub: [P, 'vapor'] }, { sub: [P, 'sat'] }] }, ' %   ·   ', { sub: [P, 'seco'] }, ' = ', { sub: [P, 'total'] }, ' − ', { sub: [P, 'vapor'] }],
      condicion: 'gas ideal; la presión de saturación es la del agua a la misma temperatura del aire.',
      voz: 'Primero cuánto cabe; después cuánto hay.',
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

  return {
    unidad: 'quimica.liquidos-y-solidos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Saber cuándo pueden convivir hielo, agua y vapor pide más que nombrar estados. En 1878, Josiah Willard Gibbs publicó un estudio sobre el equilibrio de sustancias con varias fases que ordenó esas observaciones con temperatura y presión. Un diagrama de fases actual resume esas condiciones de equilibrio. No es una película del calentamiento: dice qué fase es estable, no cuánto tarda en cambiar.',
      pregunta: '¿Por qué en Juliaca el agua hierve antes que en Lima?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §10.4', url: 'https://openstax.org/books/chemistry-2e/pages/10-4-phase-diagrams' },
    },
    ideas: [estados, capilar, vapor, diagrama, humedad],
  };
});
