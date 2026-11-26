/*
 * Teoría de «Reducción al primer cuadrante» (trigonometria.reduccion-al-primer-cuadrante), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: la propuesta docs/etapa9/propuesta-trigonometria.md (Etapa 9, 26 nov; Gerson
 * delegó el criterio: sus decisiones están en la sección 9), con la investigación de
 * docs/investigacion/etapa9/trigonometria.reduccion-al-primer-cuadrante.md contrastada contra la rama. Compañera: Mara
 * (coneja), cercana y rigurosa: el tamaño sale del ángulo agudo; el signo, del cuadrante del ángulo original.
 *
 * Cinco ideas: `angulo-referencia` (el agudo hasta el eje x), `misma-razon` (misma razón de α, signo del cuadrante de θ),
 * `opuestos` (θ y −θ: la paridad), `mayores-negativos` (primero se quitan las vueltas) y `cofuncion` (con 90° y 270°
 * la razón cambia a su cofunción). Objeto de cada primera pantalla (pieza trig-pos, dibujos de prueba): la veleta de la
 * plaza, la rueda de la fortuna, el reloj de pared, la rueda de bicicleta y un ventilador de techo.
 *
 * REGLA DE COLORES DE LA UNIDAD (la de la rama, con α aparte; propuesta §6; molde §5b, «un color fijo por magnitud»):
 *   - carmín (h): los ángulos θ, φ y β, con su arco desde el eje x positivo;
 *   - violeta (f): el ángulo de referencia α, con su arco del lado final al eje x (sin flecha). Nota de la sesión (26 nov,
 *     idea 1): «un color por variable»; θ y α no comparten el carmín;
 *   - naranja (o): la ordenada y, lo que sube o baja P;
 *   - turquesa (i): la abscisa x, lo que P avanza a la derecha o a la izquierda;
 *   - tinta: el lado final, los objetos, los ejes, lo que se pide («?»), un signo o un cuadrante, y el valor de una razón
 *     en la respuesta (en negrita: el violeta ya es de α).
 *   Verde: no se usa (junto al naranja de y no se distingue en protanopía). Un ángulo de respuesta lleva su color.
 *   Lo comprueba reduccion-al-primer-cuadrante.test.js en las figuras y los textos.
 * Letras (propuesta §5, campo `letras`): θ el ángulo que se reduce; α su ángulo de referencia (en «Ángulos en posición
 * normal» α era otro ángulo: aquí no); β otro ángulo del problema; φ un ángulo agudo junto a 90°, 180°, 270° o 360°; P la
 * punta del objeto (P′ su reflejo o su gemela); x e y sus coordenadas; r el largo de la flecha, del aspa o el radio; n un
 * número entero de vueltas.
 * Lo que no entra: la circunferencia de radio 1 y las líneas (Circunferencia trigonométrica), sen² + cos² = 1 y
 * tan = sen/cos (Identidades fundamentales), el seno de una suma (Arcos compuestos), minutos y segundos.
 * Convención (Etapa 2): en `datos`, «sen 37° = 3/5 (convención del examen)»; respuestas racionalizadas.
 * Errores: TR11, TR12, TR14, TR15 y TR16 son de docs/investigacion/trigonometria-ideas-erroneas.md (parciales); TRNEG-TODO-NEG
 * viene de «Ángulos en posición normal»; los TRRD-* son hipótesis de aula (propuesta, decisión 12).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cualquier razón de cualquier ángulo se escribe como ± una razón de un ángulo agudo, con su porqué.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión.
 *   Resultado observable: halla α, pone el signo con el cuadrante de θ, reduce −θ y ángulos de varias vueltas, y decide
 *     cuándo la razón cambia a su cofunción.
 *   Orden de atención: 1.º el lado final de θ · 2.º el agudo α hasta el eje x · acción: girar el objeto · fondo: el objeto.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿de dónde sale el agudo, de dónde el signo, y cuándo el seno se vuelve coseno?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/trig-pos.js')) : fabrica(root.Kit, root.Kit.piezas['trig-pos']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, TPOS) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const SEP = '   ·   ';
  const PZ = 'trig-pos';
  const TP = () => Kit.piezas[PZ] || TPOS;
  // junto() es solo una marca: la app (nucleo/ecuacion.js) ya no parte una cuenta junto a + − × ÷ · ni antes de «=», y
  // la parte después de un «=» si no cabe. Antes decía que cambiaba los espacios por espacios duros, pero cambiaba un
  // espacio por otro igual; con espacios duros de verdad, 35 cuentas y datos se salían de su caja a 390 px (auditoría,
  // 26 nov: herramientas/ecuaciones-ancho.js). Por eso no cambia nada.
  const junto = x => x;
  // Colores de la unidad (cabecera).
  const dH = t => ({ v: 'c-h', t }), dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const neg = t => ({ negrita: [t] });
  const th = dH('θ'), al = dF('α'), be = dH('β'), fi = dH('φ');
  const X = dI('x'), Y = dO('y');
  const frac = (a, b) => ({ frac: [a, b] });
  const rad = g => g * Math.PI / 180;
  const mod360 = g => ((g % 360) + 360) % 360;
  // Un ángulo en grados como se escribe en el examen: «250°», «−1110°» (sin espacio de miles).
  const gr = g => `${String(g).replace('-', '−')}°`;
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Un texto con **A** en negrita (la letra de una alternativa): «**A** olvida el signo» → [neg('A'), ' olvida el signo'].
  const nb = s => s.split(/\*\*(.+?)\*\*/).map((t, i) => (i % 2 ? neg(t) : t)).filter(t => t !== '');
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };

  // ---------- Cuadrante, ángulo de referencia y signos ----------
  const ROM = ['un eje', 'I', 'II', 'III', 'IV'];
  const cuad = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const refDe = g => { const m = mod360(g); return m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m; };
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  const NOMBRE = { sen: 'seno', cos: 'coseno', tan: 'tangente', cot: 'cotangente', sec: 'secante', csc: 'cosecante' };
  const COF = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  // La razón dicha en palabras, con su artículo y su adjetivo de signo: «el seno es negativo», «la tangente es positiva».
  const FEM = { tan: true, cot: true, sec: true, csc: true };
  const elN = fn => `${FEM[fn] ? 'la' : 'el'} ${NOMBRE[fn]}`;
  const delN = fn => `${FEM[fn] ? 'de la' : 'del'} ${NOMBRE[fn]}`;
  const sgTxt = (fn, s) => (s < 0 ? (FEM[fn] ? 'negativa' : 'negativo') : (FEM[fn] ? 'positiva' : 'positivo'));
  // Signo de cada razón en cada cuadrante (la regla de la unidad anterior): + o −.
  const POSITIVAS = { 1: FNS, 2: ['sen', 'csc'], 3: ['tan', 'cot'], 4: ['cos', 'sec'] };
  const signo = (fn, q) => (POSITIVAS[q].includes(fn) ? 1 : -1);
  // Valores de los ángulos notables (los de «Razones»), exactos, como texto.
  const VAL = {
    30: { sen: '1/2', cos: '√3/2', tan: '√3/3', cot: '√3', sec: '2√3/3', csc: '2' },
    45: { sen: '√2/2', cos: '√2/2', tan: '1', cot: '1', sec: '√2', csc: '√2' },
    60: { sen: '√3/2', cos: '1/2', tan: '√3', cot: '√3/3', sec: '2', csc: '2√3/3' },
    37: { sen: '3/5', cos: '4/5', tan: '3/4', cot: '4/3', sec: '5/4', csc: '5/3' },
    53: { sen: '4/5', cos: '3/5', tan: '4/3', cot: '3/4', sec: '5/3', csc: '5/4' },
  };
  const conSigno = (s, t) => (s < 0 ? `−${t}` : t);
  const opuesto = t => (t === '0' ? t : t[0] === '−' ? t.slice(1) : `−${t}`);
  // El valor de una razón de θ (en grados) cuando su α es notable: el tamaño de VAL y el signo del cuadrante de θ.
  const valorDe = (fn, g) => { const q = cuad(g), a = refDe(g); if (!q) throw new Error(`${g}° está sobre un eje`); return conSigno(signo(fn, q), VAL[a][fn]); };
  // Valor numérico de un texto como «−2√3/3», «4/5», «√2» (para las pruebas y las cuentas de los distractores).
  function num(t) {
    const s = String(t).replace(/−/g, '-').replace(/\s/g, '');
    let m = s.match(/^(-?)(\d*)√(\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]) / +m[4];
    m = s.match(/^(-?)(\d*)√(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]);
    m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
    return +s.replace(',', '.');
  }

  // ---------- Figuras (pieza trig-pos) ----------
  // Un giro θ con su lado final de largo L (la flecha, la cabina, el minutero, la válvula o el aspa), su arco desde el eje x
  // positivo y, si o.alfa, el arco de α del lado final al eje x más cercano (sin flecha). o.tramos: x turquesa e y
  // naranja; o.gemela: la copia en el cuadrante I (el lado final de α, discontinuo, con su punto hueco P′).
  function figRed(g, o = {}) {
    const L = o.L || 4, V = o.V || 6.4, m = mod360(g), x = L * Math.cos(rad(m)), y = L * Math.sin(rad(m)), q = cuad(m), a = refDe(m);
    const ladoP = y >= -1e-9 ? (x >= -1e-9 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so');
    const seg = [];
    if (o.tramos && q) seg.push({ de: [0, 0], a: [x, 0], color: 'i', rotulo: o.rotX, lado: x * y < 0 ? 'adentro' : undefined }, { de: [x, 0], a: [x, y], color: 'o', rotulo: o.rotY });
    const gx = L * Math.cos(rad(a)), gy = L * Math.sin(rad(a));
    if (o.gemela && q > 1) {
      if (o.tramos) seg.push({ de: [0, 0], a: [gx, 0], color: 'i', discontinua: true }, { de: [gx, 0], a: [gx, gy], color: 'o', discontinua: true });
      seg.push({ de: [0, 0], a: [gx, gy], discontinua: true });
    }
    seg.push({ de: [0, 0], a: [x, y], grosor: 'variable', punta: o.punta });
    const arcos = [];
    // El arco de θ termina un poco antes del lado final: así su punta de flecha no queda encima del segmento OP.
    if (g && !o.sinTheta) arcos.push({ de: 0, a: g - Math.sign(g) * Math.min(8, Math.abs(g) / 3), r: o.rArco || 1.3, espiral: Math.abs(g) > 360 ? (o.espiral === undefined ? 6 : o.espiral) : 0, color: 'h', rotulo: o.rotTheta === undefined ? 'θ' : o.rotTheta });
    if (o.alfa && q > 1) {
      const [de, hasta] = q === 2 ? [m, 180] : q === 3 ? [180, m] : [m, 360];
      arcos.push({ de, a: hasta, r: o.rAlfa || L * 0.62, espiral: 0, flecha: false, color: 'f', rotulo: o.rotAlfa === undefined ? 'α' : o.rotAlfa });
    }
    const puntos = o.sinP ? [] : [{ x, y, rotulo: o.rotP === undefined ? 'P' : o.rotP, lado: o.ladoP || ladoP }];
    if (o.gemela && q > 1) puntos.push({ x: gx, y: gy, abierto: true, rotulo: 'P′', lado: 'ne' });
    return {
      ventana: { x: [-V, V], y: [-V, V] }, objeto: o.objeto,
      segmentos: seg, arcos, puntos, rotulos: o.rotulos || [],
      alt: o.alt || `Giro θ de ${f(g)} grados${q ? `, en el cuadrante ${ROM[q]}, con ángulo de referencia de ${f(a)} grados` : ', sobre un eje'}`,
    };
  }
  const fig = d => ({ pieza: PZ, datos: d, estado: {} });

  // ---------- Datos (una línea cada uno; herramientas, no el paso hecho) ----------
  const D = {
    alfa: ['Ángulo de referencia ', al, ': el ángulo agudo entre el lado final de ', th, ' y el eje x.'],
    cuad: 'Cuadrantes: I, de 0° a 90°; II, de 90° a 180°; III, de 180° a 270°; IV, de 270° a 360°.',
    formulas: ['Cuenta de ', al, ': en el II, 180° − ', th, '; en el III, ', th, ' − 180°; en el IV, 360° − ', th, '.'],
    vuelta: '1 vuelta = 360°; media vuelta = 180°.',
  };

  // ====================================================================================================================
  // Idea 1: el ángulo de referencia
  // ====================================================================================================================
  // Objeto de la primera pantalla: la veleta de la plaza vista desde arriba; la flecha es el lado final de θ y su punta, P.
  // Cambia: el giro θ, de 0° a 180° (la mitad norte). · Permanece: la cruz de los puntos cardinales (los ejes). · Progresa:
  // el arco de α, que va de la flecha a la línea este–oeste. · Se reserva: un ángulo del III (la predicción, 250°, fuera de
  // la grilla del juego). · Debe verse: α se mide hasta el eje x, por el lado más corto.
  // Errores: TRRD-EJE-Y (mide el agudo hasta el eje y: E-REF de la investigación), TRRD-FORMULA (usa la cuenta de otro
  // cuadrante, como 360° − θ en el III), TRRD-THETA (toma θ por α), hipótesis.
  const RV = 4;
  const veleta = (g, o = {}) => figRed(g, Object.assign({ L: RV, V: 6.4, punta: true, rArco: 2.2, rAlfa: 3.2, objeto: { tipo: 'veleta', r: RV, flecha: mod360(g) } }, o,
    { alt: o.alt || `Veleta vista desde arriba: la flecha gira ${f(g)} grados desde el este${cuad(g) ? `, hasta el cuadrante ${ROM[cuad(g)]}` : ''}` }));
  // El rótulo de P se aparta de los puntos cardinales escritos (este, norte, oeste) cuando la flecha pasa cerca de ellos.
  const ladoVeleta = g => (g <= 10 || g >= 170 ? 's' : g <= 30 || g >= 150 ? 'n' : g >= 60 && g <= 120 ? 'o' : undefined);
  const veletaJ = g => veleta(g, { alfa: true, ladoP: ladoVeleta(g), alt: `Veleta: la flecha gira ${f(g)} grados desde el este; ${cuad(g) ? `se aparta ${f(refDe(g))} grados de la línea este–oeste` : 'queda sobre un eje'}` });

  // Ejemplos resueltos de la idea 1 (molde §3). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e9-trig/cuentas.js): cada α por su cuadrante, cada θ desde su α, y el valor de cada alternativa equivocada.
  const ALT1 = {
    tercio: ['120°', '60°', '135°', '45°', '150°'],
    cuarta: ['240°', '144°', '288°', '225°', '60°'],
    suma: ['360°', '720°', '140°', '685°', '700°'],
    septimos: ['252°', '80°', '140°', '40°', '280°'],
    dif: ['70°', '110°', '20°', '35°', '145°'],
  };
  const E1 = (g, o = {}) => fig(figRed(g, Object.assign({ alfa: true, rotTheta: gr(g), rotAlfa: 'α = ?' }, o)));
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'La flecha al noroeste', figura: fig(veleta(160, { alfa: true, rotTheta: '160°', rotAlfa: 'α = ?' })),
      enunciado: 'La flecha de la veleta gira 160° desde el este. ¿Cuánto mide su ángulo de referencia α, lo que se aparta de la línea este–oeste?',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [{ texto: ['160° está entre 90° y 180°, en el cuadrante II, así que α es lo que le falta a la flecha para llegar al oeste, que está a 180°:'], ecuacion: junto([al, ' = 180° − 160° = ', dF('20°')]) }],
      respuesta: ['α = ', dF('20°')] },
    { nivel: 1, titulo: 'Un ángulo del III', figura: E1(215),
      enunciado: 'θ = 215° está en posición normal. ¿Cuánto mide su ángulo de referencia α?',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [{ texto: ['215° pasa de 180° y no llega a 270°, así que está en el cuadrante III; ahí α es lo que el giro pasa de 180°:'], ecuacion: junto([al, ' = 215° − 180° = ', dF('35°')]) }],
      respuesta: ['α = ', dF('35°')] },
    { nivel: 1, titulo: 'Un ángulo del IV', figura: E1(290),
      enunciado: 'θ = 290° está en posición normal. ¿Cuánto mide su ángulo de referencia α?',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [{ texto: ['290° está entre 270° y 360°, en el cuadrante IV; ahí α es lo que le falta al giro para completar la vuelta:'], ecuacion: junto([al, ' = 360° − 290° = ', dF('70°')]) }],
      respuesta: ['α = ', dF('70°')] },
    { nivel: 1, titulo: 'Ya es agudo', figura: fig(figRed(65, { rotTheta: '65°' })),
      enunciado: 'θ = 65° está en posición normal. ¿Cuánto mide su ángulo de referencia α?',
      datos: [D.alfa, D.cuad],
      solucion: [{ texto: ['65° está en el I, así que el lado final ya forma 65° con el eje x positivo y no hay nada que restar:'], ecuacion: junto([al, ' = ', th, ' = ', dF('65°')]) }],
      respuesta: ['α = ', dF('65°')] },
    { nivel: 1, titulo: 'La cabina de la rueda', figura: fig(figRed(128, { L: 10, V: 14, rArco: 1.6, alfa: true, rotTheta: '128°', rotAlfa: 'α = ?', objeto: { tipo: 'rueda', r: 10, cabina: 128 } })),
      enunciado: 'En la rueda de la fortuna, la cabina P giró 128° desde la derecha del centro. ¿Qué ángulo forma el rayo de la cabina con la línea horizontal del centro?',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [{ texto: ['El ángulo entre el rayo y la línea horizontal es α, y como 128° está en el II, se resta de 180°:'], ecuacion: junto([al, ' = 180° − 128° = ', dF('52°')]) }],
      respuesta: ['α = ', dF('52°')] },
    { nivel: 2, titulo: 'θ desde α, en el III', figura: fig(figRed(245, { alfa: true, rotTheta: 'θ = ?', rotAlfa: '25°' })),
      enunciado: 'Un ángulo θ del cuadrante III, entre 0° y 360°, tiene ángulo de referencia α = 25°. ¿Cuánto mide θ? El dibujo no está a escala.',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [
        { texto: ['En el III se cumple α = θ − 180°; para hallar θ, se despeja:'], ecuacion: junto([th, ' = 180° + ', al]) },
        { texto: ['Se reemplaza α por 25°:'], ecuacion: junto([th, ' = 180° + 25° = ', dH('205°')]) },
      ],
      respuesta: ['θ = ', dH('205°')] },
    { nivel: 2, titulo: 'θ desde α, en el IV', figura: fig(figRed(295, { alfa: true, rotTheta: 'θ = ?', rotAlfa: '18°' })),
      enunciado: 'Un ángulo θ del cuadrante IV, entre 0° y 360°, tiene ángulo de referencia α = 18°. ¿Cuánto mide θ? El dibujo no está a escala.',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [
        { texto: ['En el IV se cumple α = 360° − θ; para hallar θ, se despeja:'], ecuacion: junto([th, ' = 360° − ', al]) },
        { texto: ['Se reemplaza α por 18°:'], ecuacion: junto([th, ' = 360° − 18° = ', dH('342°')]) },
      ],
      respuesta: ['θ = ', dH('342°')] },
    { nivel: 2, titulo: 'Un ángulo sobre un eje', figura: fig(veleta(270, { rotTheta: '270°' })),
      enunciado: 'La flecha de la veleta gira 270° desde el este y apunta al sur. ¿Tiene ángulo de referencia?',
      datos: [D.alfa, D.cuad],
      solucion: [
        { texto: ['270° cae justo sobre la parte de abajo del eje y, así que es un ángulo cuadrantal: su lado final está sobre un eje.'] },
        { texto: ['Con el eje x forma 90°, que no es agudo, así que no tiene ángulo de referencia. Sus razones salen de las coordenadas del punto, (0, −r), donde r es el largo de la flecha.'] },
      ],
      respuesta: [neg('No'), ': 270° es cuadrantal'] },
    { nivel: 2, titulo: 'Los cuatro con α = 50°', figura: fig(Object.assign(figRed(50, { sinTheta: true, sinP: true }), {
        segmentos: [50, 130, 230, 310].map(g => ({ de: [0, 0], a: [4 * Math.cos(rad(g)), 4 * Math.sin(rad(g))], grosor: 'variable' })),
        puntos: [50, 130, 230, 310].map((g, k) => ({ x: 4 * Math.cos(rad(g)), y: 4 * Math.sin(rad(g)), rotulo: ['P₁', 'P₂', 'P₃', 'P₄'][k], lado: ['ne', 'no', 'so', 'se'][k] })),
        arcos: [{ de: 0, a: 50, r: 2.4, espiral: 0, flecha: false, color: 'f', rotulo: '50°' }],
        alt: 'Cuatro lados finales, uno en cada cuadrante, cada uno a 50 grados del eje x' })),
      enunciado: '¿Qué ángulos entre 0° y 360° tienen ángulo de referencia α = 50°?',
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [
        { texto: ['Hay un ángulo en cada cuadrante a 50° del eje x. El del I es el mismo α, porque ahí θ = α:'], ecuacion: junto(['50°']) },
        { texto: ['En el II, en el III y en el IV, θ se despeja de la cuenta de cada cuadrante. En el II:'], ecuacion: junto(['180° − 50° = 130°']) },
        { texto: ['En el III:'], ecuacion: junto(['180° + 50° = 230°']) },
        { texto: ['En el IV:'], ecuacion: junto(['360° − 50° = 310°']) },
      ],
      respuesta: [dH('50°'), ', ', dH('130°'), ', ', dH('230°'), ' y ', dH('310°')] },
    { nivel: 2, titulo: 'Dos tercios de vuelta', figura: E1(240, { rotTheta: 'θ' }),
      enunciado: 'Un ángulo θ mide 2/3 de vuelta. ¿Cuánto mide su ángulo de referencia α?',
      datos: [D.vuelta, D.alfa, D.cuad, D.formulas],
      solucion: [
        { texto: ['Primero se pasa θ a grados: una vuelta mide 360°.'], ecuacion: junto([th, ' = ', frac('2', '3'), ' · 360° = 240°']) },
        { texto: ['240° está en el III, así que α es lo que el giro pasa de 180°:'], ecuacion: junto([al, ' = 240° − 180° = ', dF('60°')]) },
      ],
      respuesta: ['α = ', dF('60°')] },
    // Nivel 3, tipo examen, con cinco alternativas. Letras de las correctas: C, A, B, E, D (sin puntos con letras en las
    // figuras: las alternativas se nombran por su letra).
    { nivel: 3, titulo: 'α es un tercio de θ', figura: fig(figRed(155, { alfa: true, rotTheta: 'θ', rotAlfa: 'α' })),
      enunciado: 'θ está en el cuadrante II y su ángulo de referencia mide la tercera parte de θ. ¿Cuánto mide θ? El dibujo no está a escala.',
      alternativas: ALT1.tercio,
      datos: [D.alfa, D.formulas],
      solucion: [
        { texto: ['En el II, α = 180° − θ, y el enunciado dice que α es la tercera parte de θ:'], ecuacion: junto(['180° − ', th, ' = ', frac(th, '3')]) },
        { texto: ['Al multiplicar por 3 queda 540° − 3θ = θ, es decir, 4θ = 540°:'], ecuacion: junto([th, ' = 135°']) },
        { texto: ['Comprobación: con θ = 135°, α = 180° − 135° = 45°, que es un tercio de 135°.'] },
        { texto: nb('**A** y **E** están en el II, pero sus α, 60° y 30°, no son un tercio de θ; **B** no está en el II, y **D** es α, no θ.') },
      ],
      respuesta: [letra(ALT1.tercio, '135°'), ', ', dH('135°')] },
    { nivel: 3, titulo: 'α es un cuarto de θ', figura: fig(figRed(205, { alfa: true, rotTheta: 'θ', rotAlfa: 'α' })),
      enunciado: 'θ está en el cuadrante III y su ángulo de referencia mide la cuarta parte de θ. ¿Cuánto mide θ? El dibujo no está a escala.',
      alternativas: ALT1.cuarta,
      datos: [D.alfa, D.formulas],
      solucion: [
        { texto: ['En el III, α = θ − 180°, y el enunciado dice que α es la cuarta parte de θ:'], ecuacion: junto([th, ' − 180° = ', frac(th, '4')]) },
        { texto: ['Al multiplicar por 4 queda 4θ − 720° = θ, es decir, 3θ = 720°:'], ecuacion: junto([th, ' = 240°']) },
        { texto: ['Comprobación: con θ = 240°, α = 240° − 180° = 60°, que es un cuarto de 240°.'] },
        { texto: nb('**B** usa la cuenta del II, 180° − θ, y **C** la del IV, 360° − θ; **D** tiene α = 45°, que no es un cuarto de 225°, y **E** multiplica por 4 solo θ.') },
      ],
      respuesta: [letra(ALT1.cuarta, '240°'), ', ', dH('240°')] },
    { nivel: 3, titulo: 'Todos los de α = 35°', figura: fig(Object.assign(figRed(35, { sinTheta: true, sinP: true }), {
        segmentos: [35, 145, 215, 325].map(g => ({ de: [0, 0], a: [4 * Math.cos(rad(g)), 4 * Math.sin(rad(g))], grosor: 'variable' })),
        puntos: [], arcos: [{ de: 0, a: 35, r: 2.4, espiral: 0, flecha: false, color: 'f', rotulo: '35°' }],
        alt: 'Cuatro lados finales, uno en cada cuadrante, cada uno a 35 grados del eje x' })),
      enunciado: '¿Cuánto suman todos los ángulos entre 0° y 360° cuyo ángulo de referencia mide 35°?',
      alternativas: ALT1.suma,
      datos: [D.alfa, D.cuad, D.formulas],
      solucion: [
        { texto: ['Hay un ángulo por cuadrante, cada uno con la cuenta de su cuadrante: en el I es el mismo 35°; en el II, 180° − 35° = 145°; en el III, 180° + 35° = 215°, y en el IV, 360° − 35° = 325°.'] },
        { texto: ['Al sumar, los 35° se cancelan de dos en dos y quedan 180° + 180° + 360°:'], ecuacion: junto(['35 + 145 + 215 + 325 = 720']) },
        { texto: nb('**A** suma solo el del I y el del IV; **C** suma cuatro veces 35°; **D** olvida el del I; **E** mide los otros tres desde el eje y.') },
      ],
      respuesta: [letra(ALT1.suma, '720°'), ', ', dH('720°')] },
    { nivel: 3, titulo: 'α son dos séptimos de θ', figura: fig(figRed(300, { alfa: true, rotTheta: 'θ', rotAlfa: 'α' })),
      enunciado: 'θ está en el cuadrante IV y su ángulo de referencia mide 2/7 de θ. ¿Cuánto mide θ? El dibujo no está a escala.',
      alternativas: ALT1.septimos,
      datos: [D.alfa, D.formulas],
      solucion: [
        { texto: ['En el IV, α = 360° − θ, y el enunciado dice que α es 2/7 de θ:'], ecuacion: junto(['360° − ', th, ' = ', frac(['2', th], '7')]) },
        { texto: ['Al multiplicar por 7 queda 2520° − 7θ = 2θ, es decir, 9θ = 2520°:'], ecuacion: junto([th, ' = 280°']) },
        { texto: ['Comprobación: con θ = 280°, α = 360° − 280° = 80°, y 2/7 de 280° es 80°.'] },
        { texto: nb('**A** usa la cuenta del III, θ − 180°, y **C** la del II, 180° − θ; **B** es α y no θ, y **D** multiplica por 7 solo θ, no los 360°.') },
      ],
      respuesta: [letra(ALT1.septimos, '280°'), ', ', dH('280°')] },
    { nivel: 3, titulo: 'Se diferencian en 70°', figura: fig(Object.assign(figRed(115, { sinTheta: true, sinP: true }), {
        segmentos: [115, 245].map(g => ({ de: [0, 0], a: [4 * Math.cos(rad(g)), 4 * Math.sin(rad(g))], grosor: 'variable' })),
        puntos: [], arcos: [{ de: 0, a: 109, r: 0.9, espiral: 0, color: 'h', rotulo: 'θ' }, { de: 0, a: 239, r: 1.7, espiral: 0, color: 'h', rotulo: 'β' }],
        alt: 'Dos lados finales, uno en el cuadrante II y otro en el III, simétricos respecto del eje x' })),
      enunciado: 'θ está en el II y β en el III; los dos tienen el mismo ángulo de referencia α, y β − θ = 70°. ¿Cuánto mide α? El dibujo no está a escala.',
      alternativas: ALT1.dif,
      datos: [D.alfa, D.formulas],
      solucion: [
        { texto: ['Con las cuentas del II y del III, θ = 180° − α y β = 180° + α, así que su diferencia es 2α:'], ecuacion: junto([be, ' − ', th, ' = (180° + ', al, ') − (180° − ', al, ') = 2', al]) },
        { texto: ['Como β − θ = 70°, se tiene 2α = 70°, y α es la mitad:'], ecuacion: junto([al, ' = ', dF('35°')]) },
        { texto: nb('**A** toma la diferencia como si fuera α; **B** es 180° − 70°; **C** es 90° − 70°, medido hasta el eje y, y **E** es θ, no α.') },
      ],
      respuesta: [letra(ALT1.dif, '35°'), ', ', dF('35°')] },
  ];

  // «Ahora tú» de la idea 1: tres tipos (α de un θ, θ desde α y su cuadrante, y la suma de dos ángulos con el mismo α).
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (!d || !d.texto || vistos.has(d.texto)) continue;
      vistos.add(d.texto);
      ops.push({ id: d.id, texto: d.texto, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Un θ del cuadrante q con su α entre 11° y 79° (lejos de los ejes, para que el dibujo no se confunda).
  function thetaEn(rr, q) {
    const a = rr.ent(11, 79);
    return { a, g: q === 1 ? a : q === 2 ? 180 - a : q === 3 ? 180 + a : 360 - a };
  }
  const ejeY = g => Math.abs(mod360(g) - (mod360(g) < 180 ? 90 : 270));
  const otraCuenta = g => { const q = cuad(g), m = mod360(g); return q === 2 ? 360 - m : q === 3 ? 360 - m : m - 180; };
  const OTRA_TXT = { 2: 'la cuenta del IV, 360° − θ', 3: 'la cuenta del IV, 360° − θ', 4: 'la cuenta del III, θ − 180°' };
  const casoFig = (g, o) => fig(figRed(g, Object.assign({ alfa: true, rotTheta: gr(g), rotAlfa: 'α = ?' }, o)));
  function casoReferencia(rr) {
    const q = rr.ent(2, 4), { a, g } = thetaEn(rr, q);
    return {
      pregunta: `θ = ${gr(g)} está en posición normal. ¿Cuánto mide su ángulo de referencia α?`,
      datos: [D.alfa, D.cuad, D.formulas],
      dibujo: casoFig(g),
      opciones: opciones(gr(a), [
        { id: 'eje-y', texto: gr(ejeY(g)), error: 'TRRD-EJE-Y', siFuera: `Buscar un ángulo agudo está bien, pero ${gr(ejeY(g))} es lo que el lado final se aparta del eje y; α se mide hasta el eje x.` },
        { id: 'otra', texto: gr(otraCuenta(g)), error: 'TRRD-FORMULA', siFuera: `Restar está bien, pero ${gr(otraCuenta(g))} sale de ${OTRA_TXT[q]}, y ${gr(g)} está en el ${ROM[q]}.` },
        { id: 'theta', texto: gr(g), error: 'TRRD-THETA', siFuera: `${gr(g)} es θ, el giro completo desde el eje x positivo; α es solo el ángulo agudo entre su lado final y el eje x.` },
      ]),
      solucion: { texto: `${gr(g)} está en el cuadrante ${ROM[q]}, así que α es ${q === 2 ? 'lo que le falta para llegar a 180°' : q === 3 ? 'lo que pasa de 180°' : 'lo que le falta para completar 360°'}.`, ecuacion: junto([al, ' = ', q === 2 ? `180° − ${gr(g)}` : q === 3 ? `${gr(g)} − 180°` : `360° − ${gr(g)}`, ' = ', dF(gr(a))]) },
    };
  }
  const NE = ' El dibujo no está a escala.';
  const deAlfa = (a, q) => (q === 1 ? a : q === 2 ? 180 - a : q === 3 ? 180 + a : 360 - a);
  const FORM_THETA = { 2: a => `180° − ${gr(a)}`, 3: a => `180° + ${gr(a)}`, 4: a => `360° − ${gr(a)}` };
  function casoTheta(rr) {
    const q = rr.ent(2, 4), a = rr.ent(11, 79), g = deAlfa(a, q);
    const otros = [2, 3, 4].filter(k => k !== q);
    return {
      pregunta: `Un ángulo θ del cuadrante ${ROM[q]}, entre 0° y 360°, tiene ángulo de referencia α = ${gr(a)}. ¿Cuánto mide θ?${NE}`,
      datos: [D.alfa, D.cuad, D.formulas],
      dibujo: fig(figRed(deAlfa(a >= 40 ? 25 : 65, q), { alfa: true, rotTheta: 'θ = ?', rotAlfa: gr(a) })),
      opciones: opciones(gr(g), [
        { id: 'otro-1', texto: gr(deAlfa(a, otros[0])), error: 'TRRD-FORMULA', siFuera: `Usar α está bien, pero ${gr(deAlfa(a, otros[0]))} es el ángulo del ${ROM[otros[0]]} con ese α, y piden el del ${ROM[q]}.` },
        { id: 'otro-2', texto: gr(deAlfa(a, otros[1])), error: 'TRRD-FORMULA', siFuera: `Usar α está bien, pero ${gr(deAlfa(a, otros[1]))} es el ángulo del ${ROM[otros[1]]} con ese α, y piden el del ${ROM[q]}.` },
        { id: 'eje-y', texto: gr(q === 2 ? 90 + a : q === 3 ? 270 - a : 270 + a), error: 'TRRD-EJE-Y', siFuera: `Sumar o restar α está bien, pero desde el eje y y no desde el eje x: así sale ${gr(q === 2 ? 90 + a : q === 3 ? 270 - a : 270 + a)}.` },
      ]),
      solucion: { texto: `En el ${ROM[q]}, ${{ 2: 'α = 180° − θ; al despejar, θ = 180° − α', 3: 'α = θ − 180°; al despejar, θ = 180° + α', 4: 'α = 360° − θ; al despejar, θ = 360° − α' }[q]}.`, ecuacion: junto([th, ' = ', FORM_THETA[q](a), ' = ', dH(gr(g))]) },
    };
  }
  // θ y β, de dos cuadrantes distintos, con el mismo α: θ + β. Nivel examen (dos fórmulas a la vez).
  const PARES = [[2, 3], [2, 4], [3, 4], [1, 2], [1, 3]];
  function casoSuma(rr) {
    const [q1, q2] = rr.uno(PARES), a = rr.ent(12, 78), g1 = deAlfa(a, q1), g2 = deAlfa(a, q2), ok = g1 + g2;
    const d1 = deAlfa(a >= 40 ? 25 : 65, q1), d2 = deAlfa(a >= 40 ? 25 : 65, q2);   // dibujo sin escala: no se mide la suma
    const mal2 = q2 === 4 ? 180 + a : 360 - a;   // el segundo con la cuenta de otro cuadrante (III o IV)
    const desdeY = q => (q === 1 ? 90 - a : q === 2 ? 90 + a : q === 3 ? 270 - a : 270 + a);   // los dos medidos desde el eje y
    return {
      pregunta: `θ está en el cuadrante ${ROM[q1]} y β en el ${ROM[q2]}, entre 0° y 360°, y los dos tienen ángulo de referencia ${gr(a)}. ¿Cuánto vale θ + β?${NE}`,
      datos: [D.alfa, D.formulas],
      dibujo: fig(Object.assign(figRed(d1, { sinTheta: true, sinP: true }), {
        segmentos: [d1, d2].map(g => ({ de: [0, 0], a: [4 * Math.cos(rad(g)), 4 * Math.sin(rad(g))], grosor: 'variable' })),
        puntos: [], arcos: [{ de: 0, a: d1 - 6, r: 0.9, espiral: 0, color: 'h', rotulo: 'θ' }, { de: 0, a: d2 - 6, r: 1.7, espiral: 0, color: 'h', rotulo: 'β' }], alt: `Dos lados finales, en los cuadrantes ${ROM[q1]} y ${ROM[q2]}, a la misma distancia angular del eje x` })),
      opciones: opciones(gr(ok), [
        { id: 'dos-alfa', texto: gr(2 * a), error: 'TRRD-THETA', siFuera: `${gr(a)} es el α de los dos ángulos, y ${gr(2 * a)} suma solo sus α; θ + β suma los giros completos.` },
        { id: 'otra', texto: gr(g1 + mal2), error: 'TRRD-FORMULA', siFuera: `θ = ${gr(g1)} está bien, pero β = ${gr(mal2)} sale de la cuenta de otro cuadrante, no de la del ${ROM[q2]}.` },
        { id: 'eje-y', texto: gr(desdeY(q1) + desdeY(q2)), error: 'TRRD-EJE-Y', siFuera: `Sumar los dos giros está bien, pero se midieron desde el eje y: ${gr(desdeY(q1))} + ${gr(desdeY(q2))}.` },
      ]),
      solucion: { texto: `θ = ${gr(g1)} y β = ${gr(g2)}, cada uno con la fórmula de su cuadrante.`, ecuacion: junto([th, ' + ', be, ` = ${gr(g1)} + ${gr(g2)} = `, dH(gr(ok))]) },
    };
  }
  // «Ahora tú» no repite un ejemplo ni la predicción de su idea: si un caso sale con los mismos números, se arma otro.
  // Con φ, los números son los de los cuadrantes (90°, 270°…): dos casos son el mismo solo si dicen lo mismo.
  const firma = t => { const p = Kit.plano(t).replace(/ /g, ' '); if (/φ/.test(p)) return p.replace(/\s+/g, ' ').trim(); const ns = (p.match(/\d+(?:,\d+)?/g) || []).filter(x => x !== '0'); return ns.length ? ns.sort().join('|') : p.replace(/\s+/g, ' ').trim(); };
  // Tampoco repite, letra por letra, un caso de «Así se resuelve» (sus 12 primeros).
  const resueltos = new Map();
  const deResuelve = idea => { if (!resueltos.has(idea.id)) resueltos.set(idea.id, new Set(Array.from({ length: 12 }, (_, s) => Kit.plano(idea.resuelve.generar(s).enunciado)))); return resueltos.get(idea.id); };
  function sinRepetir(caso, sem, idea) {
    const previos = new Set((idea.ejemplos || []).map(e => firma(e.enunciado)).concat([firma(idea.predice.pregunta)]));
    for (let i = 0; i < 80; i++) {
      const c = conCuatro(caso, azar(sem * 7 + 17 + i * 7919)), k = firma(c.pregunta);
      if ((k === '' || !previos.has(k)) && !(idea.resuelve && deResuelve(idea).has(Kit.plano(c.pregunta)))) return c;
    }
    throw new Error(`${caso.name}: no salió un caso distinto de los ejemplos`);
  }
  function conCuatro(caso, rr) {
    for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // «Así se resuelve» usa estos θ (α múltiplo de 5); «Ahora tú» los saca de 11° a 79° con otras semillas: no se repiten
  // (la prueba propia lo comprueba en 400 semillas).
  const RES1 = [305, 112, 236, 163, 341, 207, 98, 254, 318, 145];

  const referencia = {
    id: 'angulo-referencia',
    titulo: 'El ángulo de referencia',
    pregunta: '¿Qué ángulo agudo acompaña a un ángulo de cualquier cuadrante?',
    temas: ['Ángulo de referencia'],
    pieza: PZ,
    aprendizaje: 'El ángulo de referencia α es el agudo entre el lado final y el eje x; su cuenta depende del cuadrante de θ.',
    actividad: 'Girar la flecha de una veleta y medir cuánto se aparta de la línea este–oeste.',
    // Lee: el objeto, la línea este–oeste como eje x y el nombre de α. No dice cómo se calcula en el III (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La veleta de la plaza', texto: ['Vista desde arriba, la flecha de la veleta gira sobre la cruz de los puntos cardinales. El poste es el origen y la flecha es el lado final de ', th, ': el giro empieza en el este y va en sentido antihorario.'],
          pieza: PZ, dibujo: { datos: veleta(120, { rotTheta: 'θ', alt: 'Veleta vista desde arriba: la flecha gira 120 grados desde el este, hacia el noroeste' }), estado: {} } },
        { titulo: 'La línea este–oeste', texto: 'La línea que va del este al oeste es el eje x. Si la flecha no apunta justo a un punto cardinal, forma con esa línea un ángulo agudo, del lado que tenga más cerca.' },
        { titulo: 'El ángulo de referencia', texto: ['Ese ángulo agudo, entre el lado final y el eje x, se llama ángulo de referencia y se escribe ', al, ' (alfa). En las ideas que siguen verás que ', al, ' da el tamaño de las razones de ', th, '.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Gira la flecha por el lado norte, del este al oeste. Mira cuánto mide ', th, ' y cuánto ', al, ': ¿qué cuenta los une?'] },
      ],
    },
    ejemplos: EJEMPLOS_1,
    juega: {
      consigna: [th, ' gira desde el este en sentido antihorario; ', al, ' es lo que la flecha se aparta de la línea este–oeste.'],
      mision: {
        texto: 'Deja la flecha al noroeste, a 40° de la línea este–oeste.',
        logrado: val => val.g === 140,
        bien: 'Listo: θ = 140° y α = 180° − 140° = 40°.',
      },
      voz: '¿Hasta qué lado de la línea este–oeste mides α?',
      leyenda: [
        { s: th, t: 'giro antihorario desde el este' },
        { s: al, t: 'ángulo agudo hasta la línea este–oeste' },
        { s: 'P', t: 'la punta de la flecha' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 10, inicio: 50, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: veletaJ(val.g), estado: {} }),
      lectura: val => {
        if (val.g === 0 || val.g === 180) return [th, ` = ${gr(val.g)}: la flecha está sobre la línea; no hay `, al, '.'];
        if (val.g === 90) return [th, ' = 90°: apunta al norte; no hay ', al, '.'];
        return val.g < 90 ? junto([th, ` = ${gr(val.g)} ya es agudo: `, al, ' = ', th, '.'])
          : junto([th, ` = ${gr(val.g)}: `, al, ` = 180° − ${gr(val.g)} = ${gr(180 - val.g)}`]);
      },
      minimo: 3,
      // Se arrastra la punta de la flecha alrededor del poste; θ y el arco de α la siguen (solo la mitad norte).
      arrastres: [{ id: 'punta', etiqueta: 'la punta de la flecha',
        donde: val => TP().enPx(veletaJ(val.g), RV * Math.cos(rad(val.g)), RV * Math.sin(rad(val.g))),
        mover: (pt, val) => { const g = TP().anguloDe(veletaJ(val.g), pt, { cerca: val.g }); return { g: Math.max(0, Math.min(180, Math.round(mod360(g) > 270 ? 0 : mod360(g) / 10) * 10)) }; } }],
    },
    predice: {
      pregunta: 'Ahora la flecha gira 250°, hasta el suroeste. ¿Cuánto mide su ángulo de referencia α?',
      datos: ['1 vuelta = 360°; media vuelta = 180°.', 'θ = 250°, medido desde el este.'],
      voz: 'En el juego la flecha no bajó del este–oeste: ahora sí.',
      opciones: [
        { id: 'c', texto: '70°', correcta: true },
        { id: 'eje-y', texto: '20°', error: 'TRRD-EJE-Y', siFuera: 'Buscar un ángulo agudo está bien, pero 20° es lo que falta hasta el sur, que está sobre el eje y; α se mide hasta el eje x.' },
        { id: 'otra', texto: '110°', error: 'TRRD-FORMULA', siFuera: '360° − 250° = 110° es lo que le falta a la flecha para completar la vuelta; como no es agudo, no puede ser α.' },
        { id: 'theta', texto: '250°', error: 'TRRD-THETA', siFuera: '250° es θ, el giro completo desde el este; α es solo el ángulo agudo entre la flecha y la línea este–oeste.' },
      ],
      dibujo: { datos: veleta(250, { rotTheta: '250°', alt: 'Veleta: la flecha gira 250 grados desde el este, hasta el suroeste' }), estado: {} },
      revelar: { datos: veleta(250, { alfa: true, rotTheta: '250°', rotAlfa: 'α = 70°', alt: 'Veleta: la flecha gira 250 grados y se aparta 70 grados de la línea este–oeste, del lado oeste' }), estado: {} },
      coincide: 'Coincide: la flecha pasa 70° más allá del oeste, que está a 180°.',
      noCoincide: 'Revisemos: α se mide desde la flecha hasta el eje x, que aquí es el lado oeste.',
    },
    // «Mira» arma la figura del juego con el θ = 250° de la predicción.
    mira: {
      datos: Object.assign(veleta(250, { rotTheta: '250°', alt: 'Veleta: la flecha gira 250 grados; su ángulo de referencia, hasta el oeste, mide 70 grados' }), {
        arcos: [{ de: 0, a: 242, r: 2.2, espiral: 0, color: 'h', rotulo: '250°', desde: 0 }, { de: 180, a: 250, r: 3.2, espiral: 0, flecha: false, color: 'f', rotulo: 'α = 70°', desde: 2 }],
      }),
      voz: 'Primero el cuadrante; después, la cuenta hasta el eje x.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El giro de 250° pasa del oeste, que está a 180°, y no llega al sur, que está a 270°.', ecuacion: junto(['180° < 250° < 270°']) },
        { estado: { corte: 1 }, texto: 'La flecha termina en el cuadrante III, debajo de la línea este–oeste.', ecuacion: junto(['250° = 180° + 70°']) },
        { estado: { corte: 2 }, texto: 'α se mide de la flecha al oeste, porque ese es el lado del eje x más cercano.', ecuacion: junto([al, ' = 250° − 180° = ', dF('70°')]) },
        { estado: { corte: 2 }, texto: 'Hasta el sur faltan 20°, pero ese ángulo se mide hasta el eje y: no es α.', ecuacion: junto(['270° − 250° = 20°']) },
      ],
    },
    regla: {
      texto: 'El ángulo de referencia α es el ángulo agudo que forma el lado final de θ con el eje x, medido por el lado más corto. La cuenta para hallarlo depende del cuadrante donde termina θ.',
      ecuacion: [{ llave: junto([al, ' = 180° − ', th]), nota: 'en el II' }, SEP, { llave: junto([al, ' = ', th, ' − 180°']), nota: 'en el III' }, SEP, { llave: junto([al, ' = 360° − ', th]), nota: 'en el IV' }],
      condicion: 'θ termina dentro de un cuadrante; en el I, α = θ. Si el lado final cae sobre un eje, no hay ángulo agudo y las razones salen de las coordenadas del punto.',
      voz: 'α siempre llega al eje x: al este o al oeste, nunca al norte ni al sur.',
      dibujo: { pieza: PZ, datos: Object.assign(figRed(320, { alfa: true, rotTheta: '', rotAlfa: 'α', rotulos: [{ x: -2.1, y: -0.9, texto: 'θ', color: 'h' }] }), { alt: 'Ángulo θ en el cuadrante IV y su ángulo de referencia α, entre el lado final y el eje x positivo' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const g = RES1[((sem % RES1.length) + RES1.length) % RES1.length], q = cuad(g), a = refDe(g);
        const cuenta = q === 2 ? `180° − ${gr(g)}` : q === 3 ? `${gr(g)} − 180°` : `360° − ${gr(g)}`;
        const lim = { 2: ['90°', '180°'], 3: ['180°', '270°'], 4: ['270°', '360°'] }[q];
        return {
          enunciado: `θ = ${gr(g)} está en posición normal. ¿Cuánto mide su ángulo de referencia α?`,
          datos: [D.alfa, D.cuad, D.formulas],
          dibujo: casoFig(g),
          pasos: [
            { tipo: 'pide', texto: ['Piden α: el ángulo agudo entre el lado final de θ y el eje x.'] },
            { tipo: 'datos', texto: [`${gr(g)} está entre ${lim[0]} y ${lim[1]}: el lado final queda en el cuadrante ${ROM[q]}.`] },
            { tipo: 'regla', texto: [`En el ${ROM[q]}, el eje x más cercano es el ${q === 4 ? 'positivo, que está a 360°' : 'negativo, que está a 180°'}, así que α es ${q === 3 ? 'lo que θ pasa de 180°' : 'lo que le falta a θ para llegar ahí'}:`], ecuacion: junto([al, ' = ', q === 2 ? ['180° − ', th] : q === 3 ? [th, ' − 180°'] : ['360° − ', th]]) },
            { tipo: 'cuentas', texto: [`Se reemplaza θ por ${gr(g)}:`], ecuacion: junto([al, ` = ${cuenta} = `, dF(gr(a))]),
              dibujo: fig(figRed(g, { alfa: true, rotTheta: gr(g), rotAlfa: gr(a) })) },
            { tipo: 'sentido', texto: [`Comprobación: ${gr(a)} es agudo, y ${q === 2 ? `${gr(g)} + ${gr(a)} = 180°` : q === 3 ? `180° + ${gr(a)} = ${gr(g)}` : `${gr(g)} + ${gr(a)} = 360°`}, así que la cuenta llega justo al eje x.`] },
          ],
          respuesta: ['α = ', dF(gr(a))],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el cuadrante; después, la cuenta hasta el eje x.',
      generar(sem) { return sinRepetir([casoReferencia, casoTheta, casoSuma][((sem % 3) + 3) % 3], sem, referencia); },
    },
  };

  // ---------- Herramientas de las ideas 2 a 5 ----------
  // La respuesta de una razón va en tinta y negrita (el violeta es de α en esta unidad; sesión, 26 nov).
  const R = t => neg(t);
  const CONV = '(convención del examen)';
  const D_RAC = 'Racionalizar: a/√b = a√b/b.';
  // Una línea de Datos con valores notables: notab([['sen', 30], ['cos', 30]]) → «sen 30° = 1/2; cos 30° = √3/2.».
  const notab = pares => `${pares.map(([fn, a]) => `${fn} ${a}° = ${VAL[a][fn]}`).join('; ')}${pares.some(([, a]) => a === 37 || a === 53) ? ` ${CONV}` : ''}.`;
  // Los datos de una razón de un ángulo con α notable: la razón pedida y su cofunción (practica elegir).
  const notabDe = (fn, a) => notab([[fn, a], [COF[fn], a]]);
  Object.assign(D, {
    signos: 'Positivas: I, todas; II, sen y csc; III, tan y cot; IV, cos y sec. Las demás son negativas.',
    reduce: junto(['Una razón de ', th, ' vale ± la misma razón de ', al, '; el signo es el de esa razón en el cuadrante de ', th, '.']),
    par: ['Con −', th, ', cambian de signo sen, tan, cot y csc; cos y sec quedan igual.'],
    vueltas: junto(['Una razón de ', th, ' vale lo mismo que esa razón de ', th, ' − 360° · n, con n entero.']),
    pi: 'π rad = 180°.',
    cof: junto(['Con 90° ± ', fi, ' o 270° ± ', fi, ', la razón cambia a su cofunción; con 180° ± ', fi, ' o 360° − ', fi, ', se queda.']),
    parejas: 'Cofunciones: sen y cos; tan y cot; sec y csc.',
    fiAgudo: junto([fi, ': un ángulo agudo.']),
    rec: 'cot = 1/tan; sec = 1/cos; csc = 1/sen.',
  });
  const PAR = { sen: -1, cos: 1, tan: -1, cot: -1, sec: 1, csc: -1 };   // fn(−θ) = PAR · fn(θ)
  // Fracciones (para las expresiones con 37° y 53°, que dan números racionales).
  const gcdN = (a, b) => (b ? gcdN(b, a % b) : Math.abs(a));
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const m = gcdN(n, d) || 1; return [n / m, d / m]; };
  const frTxt = ([n, d]) => (n === 0 ? '0' : `${n < 0 ? '−' : ''}${Math.abs(n)}${d === 1 ? '' : '/' + d}`);
  const frDe = t => { const s = t.replace('−', '-'), m = s.match(/^(-?\d+)(?:\/(\d+))?$/); if (!m) throw new Error(`no es racional: ${t}`); return fr(+m[1], m[2] ? +m[2] : 1); };
  const frSuma = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const frPor = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const qDe = g => cuad(g);

  // ====================================================================================================================
  // Idea 2: misma razón, signo del cuadrante
  // ====================================================================================================================
  // Objeto de la primera pantalla: la rueda de la fortuna (unos 10 m de radio); la cabina es P y su gemela P′, en el I.
  // Cambia: el giro θ de 0° a 360°, de 15° en 15°. · Permanece: la rueda. · Progresa: la altura de la cabina contra la de su
  // gemela. · Se reserva: el coseno (la predicción, cos 240°; la lectura solo da el seno). · Debe verse: mismo tamaño, el
  // signo lo pone el lado del centro donde está la cabina.
  // Errores: TR12 y TRRD-SIGNO-REF (el signo de α, siempre +), TR14 (cambia a la cofunción con 180° o 360°), TRRD-EJE-Y.
  const RR = 10;
  const rueda = (g, o = {}) => figRed(g, Object.assign({ L: RR, V: 14, rArco: 1.7, rAlfa: 5.2, objeto: { tipo: 'rueda', r: RR, cabina: mod360(g) } }, o,
    { alt: o.alt || `Rueda de la fortuna: la cabina P giró ${f(g)} grados desde la derecha del centro${cuad(g) ? `, hasta el cuadrante ${ROM[cuad(g)]}` : ''}` }));
  const ruedaJ = g => rueda(g, { alfa: true, gemela: true, tramos: true, rotTheta: 'θ', rotAlfa: 'α' });
  const EXACTO = { 30: 1, 45: 1, 60: 1 };
  function lecturaSen(g) {
    const q = cuad(g), a = refDe(g), v = Math.sin(rad(g));
    if (!q) return [`sen ${gr(g)} = ${f(Math.round(v))}: la cabina está sobre un eje.`];
    if (q === 1) return junto([`sen ${gr(g)} `, EXACTO[a] ? `= ${VAL[a].sen}` : `≈ ${f(v)}`, ': P′ coincide con P.']);
    const sg = signo('sen', q) < 0 ? '−' : '';
    return junto([`sen ${gr(g)} = ${sg}sen ${gr(a)} `, EXACTO[a] ? `= ${conSigno(signo('sen', q), VAL[a].sen)}` : `≈ ${f(v)}`]);
  }
  const E2 = (g, o = {}) => fig(figRed(g, Object.assign({ alfa: true, tramos: true, rotTheta: gr(g), rotAlfa: 'α' }, o)));
  // Ejemplos de la idea 2. Cuentas rehechas aparte (scratchpad e9-trig/cuentas.js): el cuadrante, α, el signo y el valor
  // de cada razón, y el valor de cada alternativa equivocada.
  const ALT2 = {
    doblez: ['3/5', '−3/5', '−4/5', '4/5', '−3/4'],
    expr: ['−1', '7', '1', '−8', '−7'],
    tres: ['−4', '4', '0', '−3'],
    rueda: ['−5 m', '5√3 m', '−10 m', '−5√3 m', '5 m'],
    tercer: ['10', '−10', '2', '−2'],
  };
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'El seno de 150°', figura: E2(150),
      enunciado: '¿Cuánto vale sen 150°?',
      datos: [D.formulas, D.signos, notabDe('sen', 30)],
      solucion: [{ texto: ['150° está en el II, con α = 180° − 150° = 30°, y en el II el seno es positivo:'], ecuacion: junto(['sen 150° = +sen 30° = ', R('1/2')]) }],
      respuesta: ['sen 150° = ', R('1/2')] },
    { nivel: 1, titulo: 'El coseno de 135°', figura: E2(135),
      enunciado: '¿Cuánto vale cos 135°?',
      datos: [D.formulas, D.signos, notabDe('cos', 45)],
      solucion: [{ texto: ['135° está en el II, con α = 45°, y en el II el coseno es negativo porque x es negativa:'], ecuacion: junto(['cos 135° = −cos 45° = ', R('−√2/2')]) }],
      respuesta: ['cos 135° = ', R('−√2/2')] },
    { nivel: 1, titulo: 'La tangente de 240°', figura: E2(240),
      enunciado: '¿Cuánto vale tan 240°?',
      datos: [D.formulas, D.signos, notabDe('tan', 60)],
      solucion: [{ texto: ['240° está en el III, con α = 60°; ahí la tangente es positiva, porque es y entre x y las dos son negativas:'], ecuacion: junto(['tan 240° = +tan 60° = ', R('√3')]) }],
      respuesta: ['tan 240° = ', R('√3')] },
    { nivel: 1, titulo: 'El seno de 330°', figura: E2(330),
      enunciado: '¿Cuánto vale sen 330°?',
      datos: [D.formulas, D.signos, notabDe('sen', 30)],
      solucion: [{ texto: ['330° está en el IV, con α = 30°, y en el IV el seno es negativo porque y es negativa:'], ecuacion: junto(['sen 330° = −sen 30° = ', R('−1/2')]) }],
      respuesta: ['sen 330° = ', R('−1/2')] },
    { nivel: 1, titulo: 'El coseno de 217°', figura: E2(217),
      enunciado: '¿Cuánto vale cos 217°?',
      datos: [D.formulas, D.signos, notabDe('cos', 37)],
      solucion: [{ texto: ['217° está en el III, con α = 217° − 180° = 37°, y en el III el coseno es negativo:'], ecuacion: junto(['cos 217° = −cos 37° = ', R('−4/5')]) }],
      respuesta: ['cos 217° = ', R('−4/5')] },
    { nivel: 2, titulo: 'La secante de 120°', figura: E2(120),
      enunciado: '¿Cuánto vale sec 120°?',
      datos: [D.formulas, D.signos, D.rec, notab([['cos', 60], ['sen', 60]])],
      solucion: [
        { texto: ['120° está en el II, con α = 60°; la secante tiene el signo del coseno, y en el II es negativa:'], ecuacion: junto(['sec 120° = −sec 60°']) },
        { texto: ['Como sec 60° = 1/cos 60° = 2, queda:'], ecuacion: junto(['sec 120° = ', R('−2')]) },
      ],
      respuesta: ['sec 120° = ', R('−2')] },
    { nivel: 2, titulo: 'La cosecante de 225°', figura: E2(225),
      enunciado: '¿Cuánto vale csc 225°?',
      datos: [D.formulas, D.signos, D.rec, notab([['sen', 45]]), D_RAC],
      solucion: [
        { texto: ['225° está en el III, con α = 45°; la cosecante tiene el signo del seno, y en el III es negativa:'], ecuacion: junto(['csc 225° = −csc 45°']) },
        { texto: ['Como csc 45° = 1/(√2/2) = 2/√2 = √2, queda:'], ecuacion: junto(['csc 225° = ', R('−√2')]) },
      ],
      respuesta: ['csc 225° = ', R('−√2')] },
    { nivel: 2, titulo: 'La cotangente de 300°', figura: E2(300),
      enunciado: '¿Cuánto vale cot 300°?',
      datos: [D.formulas, D.signos, D.rec, notab([['tan', 60]]), D_RAC],
      solucion: [
        { texto: ['300° está en el IV, con α = 60°, y en el IV la cotangente es negativa:'], ecuacion: junto(['cot 300° = −cot 60°']) },
        { texto: ['Como cot 60° = 1/√3 = √3/3, queda:'], ecuacion: junto(['cot 300° = ', R('−√3/3')]) },
      ],
      respuesta: ['cot 300° = ', R('−√3/3')] },
    { nivel: 2, titulo: 'La cabina debajo del centro', figura: fig(rueda(233, { alfa: true, tramos: true, rotTheta: '233°', rotAlfa: 'α', rotY: 'y = ?' })),
      enunciado: 'La rueda de la fortuna tiene unos 10 m de radio. La cabina P giró 233° desde la derecha del centro. ¿Cuánto vale y, su altura respecto del centro?',
      datos: [junto([Y, ' = r · sen ', th, ', con r = 10 m.']), D.formulas, D.signos, notabDe('sen', 53)],
      solucion: [
        { texto: ['233° está en el III, con α = 53°, y ahí el seno es negativo:'], ecuacion: junto(['sen 233° = −sen 53° = −4/5']) },
        { texto: ['La altura es el radio por ese seno:'], ecuacion: junto([Y, ' = 10 · (−4/5) = ', R('−8 m')]) },
      ],
      respuesta: ['y = ', R('−8 m'), ': 8 m debajo del centro'] },
    { nivel: 2, titulo: 'Seno más coseno de 143°', figura: E2(143),
      enunciado: '¿Cuánto vale sen 143° + cos 143°?',
      datos: [D.formulas, D.signos, notabDe('sen', 37)],
      solucion: [
        { texto: ['143° está en el II, con α = 37°; ahí el seno es positivo y el coseno, negativo:'], ecuacion: [junto(['sen 143° = 3/5']), ' y ', junto(['cos 143° = −4/5'])] },
        { texto: ['Se suman los dos valores:'], ecuacion: junto([frac('3', '5'), ' − ', frac('4', '5'), ' = ', R('−1/5')]) },
      ],
      respuesta: [R('−1/5')] },
    // Nivel 3, con alternativas. Letras de las correctas: B, E, A, D, D (sin puntos con letras: se nombran por su letra).
    { nivel: 3, titulo: 'El ángulo del doblez', figura: E2(127, { rotAlfa: 'α' }),
      enunciado: 'Al doblar una hoja se forma un ángulo de 127°. ¿Cuánto vale su coseno?',
      alternativas: ALT2.doblez,
      datos: [D.formulas, D.signos, notabDe('cos', 53), notab([['tan', 53]])],
      solucion: [
        { texto: ['127° está en el II, con α = 180° − 127° = 53°, y ahí el coseno es negativo:'], ecuacion: junto(['cos 127° = −cos 53° = −3/5']) },
        { texto: nb('**A** olvida el signo; **C** cambia el coseno por sen 53°, su cofunción; **D** hace ese cambio y además olvida el signo, y **E** es la cotangente, −cot 53°.') },
      ],
      respuesta: [letra(ALT2.doblez, '−3/5'), ', ', R('−3/5')] },
    { nivel: 3, titulo: 'Una suma con dos cuadrantes', figura: null,
      enunciado: 'Calcula E = 5 sen 217° + 4 tan 135°.',
      alternativas: ALT2.expr,
      datos: [D.formulas, D.signos, notabDe('sen', 37), notab([['tan', 45]])],
      solucion: [
        { texto: ['217° está en el III, con α = 37° y seno negativo; 135° está en el II, con α = 45° y tangente negativa:'], ecuacion: [junto(['sen 217° = −3/5']), ' y ', junto(['tan 135° = −1'])] },
        { texto: ['Se reemplazan los dos valores:'], ecuacion: junto(['E = 5 · (−3/5) + 4 · (−1)']) },
        { texto: ['Se hacen los productos y se suma:'], ecuacion: junto(['E = −3 − 4 = ', R('−7')]) },
        { texto: nb('**A** olvida el signo del seno; **B** toma todo positivo; **C** olvida el signo de la tangente; **D** usa cos 37°.') },
      ],
      respuesta: [letra(ALT2.expr, '−7'), ', ', R('−7')] },
    { nivel: 3, titulo: 'Secante, tangente y cosecante', figura: null,
      enunciado: 'Calcula E = sec 120° + tan 315° · csc 150°.',
      alternativas: ALT2.tres,
      datos: [D.formulas, D.signos, D.rec, notab([['cos', 60], ['tan', 45], ['sen', 30]])],
      solucion: [
        { texto: ['sec 120° = −2, porque en el II la secante sigue al coseno; tan 315° = −1, porque está en el IV, y csc 150° = 2, porque en el II la cosecante sigue al seno.'] },
        { texto: ['Primero se hace el producto y después la suma:'], ecuacion: junto(['E = −2 + (−1) · 2 = −2 − 2 = ', R('−4')]) },
        { texto: nb('**B** toma todo positivo; **C** toma sec 120° positiva, y así sale 2 − 2; **D** suma tan 315° y no la multiplica por csc 150°.') },
      ],
      respuesta: [letra(ALT2.tres, '−4'), ', ', R('−4')] },
    { nivel: 3, titulo: 'La cabina a 300°', figura: fig(rueda(300, { alfa: true, tramos: true, rotTheta: '300°', rotAlfa: 'α', rotY: 'y = ?' })),
      enunciado: 'En la rueda de la fortuna de unos 10 m de radio, la cabina giró 300° desde la derecha del centro. ¿Cuánto vale y, su altura respecto del centro?',
      alternativas: ALT2.rueda,
      datos: [junto([Y, ' = r · sen ', th, ', con r = 10 m.']), D.formulas, D.signos, notabDe('sen', 60)],
      solucion: [
        { texto: ['300° está en el IV, con α = 60°, y ahí el seno es negativo:'], ecuacion: junto(['sen 300° = −sen 60° = −√3/2']) },
        { texto: ['La altura es el radio por ese seno:'], ecuacion: junto([Y, ' = 10 · (−√3/2) = ', R('−5√3 m')]) },
        { texto: nb('**A** usa cos 60°, la cofunción; **B** olvida el signo; **C** es el radio con signo; **E** usa la cofunción sin signo.') },
      ],
      respuesta: [letra(ALT2.rueda, '−5√3 m'), ', ', R('−5√3 m')] },
    { nivel: 3, titulo: 'En el III, con α = 37°', figura: fig(figRed(217, { alfa: true, tramos: true, rotTheta: 'θ', rotAlfa: '37°' })),
      enunciado: 'θ está en el III y su ángulo de referencia mide 37°. Calcula E = 10 sen θ + 3 cot θ.',
      alternativas: ALT2.tercer,
      datos: [D.reduce, D.signos, notab([['sen', 37], ['cot', 37]])],
      solucion: [
        { texto: ['En el III, el seno es negativo y la cotangente es positiva; los tamaños son los de 37°:'], ecuacion: [junto(['sen ', th, ' = −3/5']), ' y ', junto(['cot ', th, ' = 4/3'])] },
        { texto: ['Se reemplazan los dos valores:'], ecuacion: junto(['E = 10 · (−3/5) + 3 · (4/3)']) },
        { texto: ['Se hacen los productos y se suma:'], ecuacion: junto(['E = −6 + 4 = ', R('−2')]) },
        { texto: nb('**A** toma todo positivo; **B** toma todo negativo; **C** cambia los dos signos de lugar.') },
      ],
      respuesta: [letra(ALT2.tercer, '−2'), ', ', R('−2')] },
  ];

  // «Ahora tú» de la idea 2: una razón con α notable, sen θ ± cos θ (o sec θ + tan θ) con 37° y 53°, y una expresión.
  const ALFAS = [30, 45, 60, 37, 53];
  const deG = (a, q) => deAlfa(a, q);
  const casoFig2 = g => fig(figRed(g, { alfa: true, tramos: true, rotTheta: gr(g), rotAlfa: 'α' }));
  function distractoresValor(fn, a, q, ok) {
    const s = signo(fn, q), cof = conSigno(s, VAL[a][COF[fn]]), ejeY = conSigno(s, VAL[90 - a] ? VAL[90 - a][fn] : VAL[a][fn]);
    return [
      { id: 'signo', texto: opuesto(ok), error: s < 0 ? 'TR12' : 'TRRD-SIGNO-REF', siFuera: `El tamaño, ${VAL[a][fn]}, está bien, pero en el ${ROM[q]} ${elN(fn)} es ${sgTxt(fn, s)}: sale ${ok}.` },
      { id: 'cof', texto: cof, error: 'TR14', siFuera: `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al reducir con 180° o con 360°, la razón no cambia.` },
      { id: 'cof-signo', texto: opuesto(cof), error: 'TR14', siFuera: `${opuesto(cof)} cambia la razón a ${COF[fn]} y además el signo; aquí se queda ${fn}, con el signo del ${ROM[q]}.` },
      { id: 'eje-y', texto: ejeY, error: 'TRRD-EJE-Y', siFuera: `El signo está bien, pero ${ejeY} usa ${gr(90 - a)}, que se mide hasta el eje y; α mide ${gr(a)}.` },
    ];
  }
  function casoValor(rr) {
    const fn = rr.uno(FNS), a = rr.uno(ALFAS), q = rr.ent(2, 4), g = deG(a, q), ok = valorDe(fn, g);
    return {
      pregunta: `¿Cuánto vale ${fn} ${gr(g)}?`,
      datos: [D.formulas, D.signos, notabDe(fn, a)],
      dibujo: casoFig2(g),
      opciones: opciones(ok, distractoresValor(fn, a, q, ok)),
      solucion: { texto: `${gr(g)} está en el ${ROM[q]}, con α = ${gr(a)}, y ahí ${elN(fn)} es ${sgTxt(fn, signo(fn, q))}.`, ecuacion: junto([`${fn} ${gr(g)} = ${signo(fn, q) < 0 ? '−' : '+'}${fn} ${gr(a)} = `, R(ok)]) },
    };
  }
  const DOS = [['sen', 'cos', 1], ['sen', 'cos', -1], ['sec', 'tan', 1], ['csc', 'cot', 1]];
  function casoDos(rr) {
    const [f1, f2, op] = rr.uno(DOS), a = rr.uno([37, 53]), q = rr.ent(2, 4), g = deG(a, q);
    const v = (fn, s) => frDe(conSigno(s, VAL[a][fn]));
    const t = (s1, s2) => frTxt(frSuma(v(f1, s1), frPor(fr(op), v(f2, s2))));
    const s1 = signo(f1, q), s2 = signo(f2, q), ok = t(s1, s2), E = `${f1} θ ${op > 0 ? '+' : '−'} ${f2} θ`;
    return {
      pregunta: `θ = ${gr(g)}. Calcula E = ${E}.`,
      datos: [D.formulas, D.signos, notab([[f1, a], [f2, a]])],
      dibujo: casoFig2(g),
      opciones: opciones(ok, [
        { id: 'todo-mas', texto: t(1, 1), error: 'TR12', siFuera: `Los tamaños están bien, pero en el ${ROM[q]} las dos razones no son positivas; con las dos positivas sale ${t(1, 1)}.` },
        { id: 'signo-1', texto: t(-s1, s2), error: 'TR12', siFuera: `${f2} θ está bien, pero el signo de ${f1} θ quedó cambiado: en el ${ROM[q]}, ${elN(f1)} es ${sgTxt(f1, s1)}.` },
        { id: 'signo-2', texto: t(s1, -s2), error: 'TR12', siFuera: `${f1} θ está bien, pero el signo de ${f2} θ quedó cambiado: en el ${ROM[q]}, ${elN(f2)} es ${sgTxt(f2, s2)}.` },
        { id: 'todo-menos', texto: t(-1, -1), error: 'TRPN-TODO-NEG', siFuera: `Los tamaños están bien, pero fuera del I no todas las razones son negativas; con las dos negativas sale ${t(-1, -1)}.` },
      ]),
      solucion: { texto: `${gr(g)} está en el ${ROM[q]} con α = ${gr(a)}: ${f1} θ = ${frTxt(v(f1, s1))} y ${f2} θ = ${frTxt(v(f2, s2))}.`, ecuacion: junto(['E = ', R(ok)]) },
    };
  }
  // E = c₁·f₁(g₁) + c₂·f₂(g₂), con c el denominador del valor: cada término es un entero.
  const RACIONAL = [[37, FNS], [53, FNS], [45, ['tan', 'cot']], [30, ['sen', 'csc']], [60, ['cos', 'sec']]];
  function terminoAzar(rr) {
    const [a, fns] = rr.uno(RACIONAL), fn = rr.uno(fns), q = rr.ent(2, 4), g = deG(a, q), [, den] = frDe(VAL[a][fn]);
    return { a, fn, q, g, c: den };
  }
  const termTxt = t => `${t.c === 1 ? '' : t.c + ' '}${t.fn} ${gr(t.g)}`;
  const termVal = (t, s, fn = t.fn) => frPor(fr(t.c), frDe(conSigno(s, VAL[t.a][fn])));
  function casoExpr2(rr) {
    for (let i = 0; i < 50; i++) {
      const t1 = terminoAzar(rr), t2 = terminoAzar(rr), op = rr.ent(0, 1) ? 1 : -1;
      if (t1.g === t2.g) continue;
      const E = (a, b) => frTxt(frSuma(a, frPor(fr(op), b)));
      const s1 = signo(t1.fn, t1.q), s2 = signo(t2.fn, t2.q), ok = E(termVal(t1, s1), termVal(t2, s2));
      const ds = [
        { id: 'todo-mas', texto: E(termVal(t1, 1), termVal(t2, 1)), error: 'TR12', siFuera: `Las razones están bien elegidas, pero fuera del I no todas son positivas; con todo positivo sale ${E(termVal(t1, 1), termVal(t2, 1))}.` },
        { id: 'signo-1', texto: E(termVal(t1, -s1), termVal(t2, s2)), error: 'TR12', siFuera: `El segundo término está bien, pero a ${t1.fn} ${gr(t1.g)} se le puso el signo contrario al de su cuadrante.` },
        { id: 'signo-2', texto: E(termVal(t1, s1), termVal(t2, -s2)), error: 'TR12', siFuera: `El primer término está bien, pero a ${t2.fn} ${gr(t2.g)} se le puso el signo contrario al de su cuadrante.` },
      ];
      if (new Set([ok, ...ds.map(d => d.texto)]).size < 4) continue;
      const Etxt = `${termTxt(t1)} ${op > 0 ? '+' : '−'} ${termTxt(t2)}`;
      return {
        pregunta: `Calcula E = ${Etxt}.`,
        datos: [D.formulas, D.signos, notab([[t1.fn, t1.a], [t2.fn, t2.a]])],
        opciones: opciones(ok, ds),
        solucion: { texto: `${t1.fn} ${gr(t1.g)} = ${conSigno(s1, VAL[t1.a][t1.fn])} y ${t2.fn} ${gr(t2.g)} = ${conSigno(s2, VAL[t2.a][t2.fn])}, cada una con el signo de su cuadrante.`, ecuacion: junto(['E = ', R(ok)]) },
      };
    }
    throw new Error('casoExpr2: sin caso');
  }
  const RES2 = [['sen', 210], ['cos', 300], ['tan', 150], ['sec', 225], ['cos', 143], ['csc', 240], ['sen', 307], ['cot', 120], ['cos', 233], ['tan', 330]];

  const mismaRazon = {
    id: 'misma-razon',
    titulo: 'Misma razón, signo del cuadrante',
    pregunta: '¿Cómo se calcula una razón de 150° o de 240° con un ángulo agudo?',
    temas: ['Ángulos menores de una vuelta'],
    pieza: PZ,
    aprendizaje: 'Una razón de θ vale lo mismo que la misma razón de α, con el signo que esa razón tiene en el cuadrante de θ.',
    actividad: 'Girar la rueda de la fortuna y comparar la altura de dos cabinas gemelas.',
    lee: {
      tarjetas: [
        { titulo: 'La rueda de la fortuna', texto: ['El centro de la rueda es el origen y la cabina es el punto P. La cabina gira ', th, ' desde la derecha del centro, en sentido antihorario, en una rueda de unos 10 m de radio.'],
          pieza: PZ, dibujo: { datos: rueda(150, { rotTheta: 'θ', alt: 'Rueda de la fortuna con la cabina P a 150 grados, arriba a la izquierda' }), estado: {} } },
        { titulo: 'La cabina gemela', texto: ['P′ es la gemela de P en el cuadrante I: la cabina que forma el mismo ángulo ', al, ' con la línea horizontal del centro y está igual de lejos de él.'] },
        { titulo: 'Altura con signo', texto: ['Si r es el radio de la rueda, la altura de la cabina respecto del centro es ', Y, '\u00a0=\u00a0r\u00a0·\u00a0sen\u00a0', th, ': es positiva arriba del centro y negativa debajo.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Compara la altura de P con la de P′. ¿Qué tienen igual y qué puede cambiar?'] },
      ],
    },
    ejemplos: EJEMPLOS_2,
    juega: {
      consigna: ['La cabina P gira ', th, '; su gemela P′ forma el mismo ángulo ', al, ' con la horizontal. Con r el radio, sen ', th, ' = ', Y, '/r.'],
      mision: {
        texto: 'Pon la cabina abajo a la izquierda, con sen θ = −1/2.',
        logrado: val => val.g === 210,
        bien: 'Listo: sen 210° = −sen 30° = −1/2. La gemela sube lo mismo que P baja.',
      },
      voz: '¿La gemela sube lo mismo que la cabina baja?',
      leyenda: [
        { s: th, t: 'giro de la cabina desde la derecha' },
        { s: al, t: 'ángulo agudo hasta la horizontal' },
        { s: Y, t: 'altura de la cabina respecto del centro' },
        { s: X, t: 'distancia a la derecha (+) o izquierda (−)' },
        { s: 'P′', t: 'la cabina gemela, en el I' },
        { s: 'r', t: 'el radio de la rueda, unos 10 m' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 360, paso: 15, inicio: 45, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: ruedaJ(val.g), estado: {} }),
      lectura: val => lecturaSen(val.g),
      minimo: 3,
      arrastres: [{ id: 'cabina', etiqueta: 'la cabina P',
        donde: val => TP().enPx(ruedaJ(val.g), RR * Math.cos(rad(val.g)), RR * Math.sin(rad(val.g))),
        mover: (pt, val) => { const g = TP().anguloDe(ruedaJ(val.g), pt, { cerca: val.g }); return { g: Math.max(0, Math.min(360, Math.round(g / 15) * 15)) }; } }],
    },
    predice: {
      pregunta: 'cos 60° = 1/2. ¿Cuánto vale cos 240°?',
      datos: ['cos 60° = 1/2; sen 60° = √3/2.', 'El coseno es la abscisa x de la cabina dividida entre r, el radio de la rueda.'],
      voz: 'El juego te dio senos; ahora es el coseno.',
      opciones: [
        { id: 'c', texto: '−1/2', correcta: true },
        { id: 'signo', texto: '1/2', error: 'TR12', siFuera: 'El tamaño, 1/2, está bien, pero a 240° la cabina queda a la izquierda del centro, donde x es negativa, y el coseno también.' },
        { id: 'cof', texto: '−√3/2', error: 'TR14', siFuera: 'El signo está bien, pero √3/2 es el valor de sen 60°; como 240° = 180° + 60°, el coseno se queda coseno.' },
        { id: 'cof-signo', texto: '√3/2', error: 'TR14', siFuera: '√3/2 es sen 60° y además no lleva signo; aquí se queda el coseno, que a la izquierda del centro es negativo.' },
      ],
      dibujo: { datos: rueda(240, { rotTheta: '240°', alt: 'Rueda de la fortuna con la cabina a 240 grados, abajo a la izquierda' }), estado: {} },
      revelar: { datos: rueda(240, { alfa: true, gemela: true, tramos: true, rotTheta: '240°', rotAlfa: 'α = 60°', rotX: 'x < 0' }), estado: {} },
      coincide: 'Coincide: cos 240° = −cos 60° = −1/2.',
      noCoincide: 'Revisemos: el tamaño sale de cos 60°, y el signo, del lado izquierdo del centro, donde x es negativa.',
    },
    mira: {
      datos: Object.assign(rueda(240, { rotTheta: '240°', alt: 'Rueda de la fortuna con la cabina a 240 grados, su gemela a 60 grados y sus distancias al eje y' }), {
        segmentos: [
          { de: [0, 0], a: [RR * Math.cos(rad(240)), RR * Math.sin(rad(240))], grosor: 'variable', desde: 0 },
          { de: [0, 0], a: [RR * Math.cos(rad(60)), RR * Math.sin(rad(60))], discontinua: true, desde: 1 },
          { de: [0, 0], a: [RR * Math.cos(rad(240)), 0], color: 'i', rotulo: 'x < 0', lado: 'adentro', desde: 2 },
          { de: [0, 0], a: [RR * Math.cos(rad(60)), 0], color: 'i', discontinua: true, desde: 2 },
        ],
        arcos: [{ de: 0, a: 232, r: 1.7, espiral: 0, color: 'h', rotulo: '240°' }, { de: 180, a: 240, r: 5.2, espiral: 0, flecha: false, color: 'f', rotulo: 'α', desde: 1 }],
        puntos: [{ x: RR * Math.cos(rad(240)), y: RR * Math.sin(rad(240)), rotulo: 'P', lado: 'so' }, { x: RR * Math.cos(rad(60)), y: RR * Math.sin(rad(60)), abierto: true, rotulo: 'P′', lado: 'ne', desde: 1 }],
      }),
      voz: 'Primero el tamaño; el signo viene después.',
      pasos: [
        { estado: { corte: 0 }, texto: '240° termina en el III, abajo a la izquierda del centro.', ecuacion: junto(['180° < 240° < 270°']) },
        { estado: { corte: 1 }, texto: 'Su ángulo de referencia es lo que el giro pasa de 180°.', ecuacion: junto([al, ' = 240° − 180° = 60°']) },
        { estado: { corte: 2 }, texto: 'P y P′ están igual de lejos del eje y, así que sus cosenos miden lo mismo sin contar el signo.', ecuacion: junto(['|cos 240°| = cos 60° = 1/2']) },
        { estado: { corte: 2 }, texto: 'En el III la cabina está a la izquierda del centro, con x negativa, así que el coseno es negativo.', ecuacion: junto(['cos 240° = −cos 60° = ', R('−1/2')]) },
      ],
    },
    regla: {
      texto: 'Reducir al primer cuadrante es cambiar una razón de θ por la misma razón de α: las dos miden lo mismo, y el signo es el que esa razón tiene en el cuadrante de θ.',
      ecuacion: [junto(['sen 150° = +sen 30°']), SEP, junto(['cos 240° = −cos 60°']), SEP, junto(['tan 315° = −tan 45°'])],
      condicion: 'θ no está sobre un eje. Signo del cuadrante de θ: positivas en el I, todas; en el II, sen y csc; en el III, tan y cot; en el IV, cos y sec.',
      voz: 'El tamaño sale del agudo; el signo, del cuadrante del ángulo original.',
      dibujo: { pieza: PZ, datos: Object.assign(rueda(150, { alfa: true, gemela: true, tramos: true, rotTheta: '150°', rotAlfa: '30°' }), { alt: 'Rueda de la fortuna: la cabina a 150 grados y su gemela a 30 grados están a la misma altura' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [fn, g] = RES2[((sem % RES2.length) + RES2.length) % RES2.length], q = cuad(g), a = refDe(g), s = signo(fn, q), ok = valorDe(fn, g);
        return {
          enunciado: `¿Cuánto vale ${fn} ${gr(g)}?`,
          datos: [D.formulas, D.signos, notabDe(fn, a)],
          dibujo: casoFig2(g),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${fn} ${gr(g)}, una razón de un ángulo que no es agudo.`] },
            { tipo: 'datos', texto: [`${gr(g)} está en el cuadrante ${ROM[q]}; su ángulo de referencia es α = ${gr(a)}.`] },
            { tipo: 'regla', texto: [`La razón no cambia: se usa ${fn} de α. En el ${ROM[q]}, ${elN(fn)} es ${sgTxt(fn, s)}, así que va el signo ${s < 0 ? 'menos' : 'más'}.`], ecuacion: junto([`${fn} ${gr(g)} = ${s < 0 ? '−' : '+'}${fn} ${gr(a)}`]) },
            { tipo: 'cuentas', texto: [`Con el valor de ${fn} ${gr(a)} que dan los datos:`], ecuacion: junto([`${fn} ${gr(g)} = `, R(ok)]) },
            { tipo: 'sentido', texto: [`Comprobación: el tamaño es el de ${fn} ${gr(a)} y el signo es el del cuadrante ${ROM[q]}; con el signo contrario, el ángulo tendría que estar en otro cuadrante.`] },
          ],
          respuesta: [`${fn} ${gr(g)} = `, R(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero α; después, el signo en el cuadrante de θ.',
      generar(sem) { return sinRepetir([casoValor, casoDos, casoExpr2][((sem % 3) + 3) % 3], sem, mismaRazon); },
    },
  };

  // ====================================================================================================================
  // Idea 3: giros opuestos, θ y −θ
  // ====================================================================================================================
  // Objeto de la primera pantalla: el reloj de pared; el minutero gira −θ desde el 3 (horario) y P, la punta que giraría θ
  // hacia atrás, queda de reflejo. Cambia: θ de 0° a 180°, de 30° en 30° (un número por paso). · Permanece: el reloj. ·
  // Progresa: la altura de las dos puntas. · Se reserva: el coseno de −60° (la predicción; la lectura solo da el seno). ·
  // Debe verse: la x es la misma, la y cambia de signo.
  // Errores: TRNEG-TODO-NEG (un ángulo negativo tiene razones negativas; de la unidad anterior), TR15 (olvida el signo del
  // seno de −θ), TR11 (cruza x e y).
  const RL = 5, LM = 4.2;
  function figOp(g, o = {}) {
    const x = LM * Math.cos(rad(g)), y = LM * Math.sin(rad(g)), V = 6.4, conTramos = o.tramos !== false && Math.abs(y) > 1e-9;
    const gap = v => v - Math.sign(v) * Math.min(8, Math.abs(v) / 3);
    return {
      ventana: { x: [-V, V], y: [-V, V] }, objeto: o.objeto === undefined ? { tipo: 'reloj', r: RL } : o.objeto,
      segmentos: (conTramos ? [{ de: [0, 0], a: [x, 0], color: 'i', rotulo: o.rotX }, { de: [x, 0], a: [x, y], color: 'o', discontinua: true }, { de: [x, 0], a: [x, -y], color: 'o' }] : [])
        .concat([{ de: [0, 0], a: [x, y], discontinua: true }, { de: [0, 0], a: [x, -y], grosor: 'variable' }]),
      arcos: g ? [{ de: 0, a: gap(g), r: 1.3, espiral: 0, color: 'h', rotulo: o.rotTheta === undefined ? 'θ' : o.rotTheta }, { de: 0, a: gap(-g), r: 2.5, espiral: 0, color: 'h', rotulo: o.rotMenos === undefined ? '−θ' : o.rotMenos }] : [],
      puntos: [{ x, y, abierto: true, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }, { x, y: -y, rotulo: 'P′', lado: y >= 0 ? (x >= 0 ? 'se' : 'so') : (x >= 0 ? 'ne' : 'no') }],
      rotulos: o.rotulos || [],
      alt: o.alt || `Reloj: el minutero giró ${f(-g)} grados desde el 3 y su punta P′ es el reflejo de P, la de ${f(g)} grados, en el eje x`,
    };
  }
  const numReloj = g => { const k = Math.round(mod360(90 - g) / 30) % 12; return k === 0 ? 12 : k; };
  function lecturaOp(g) {
    if (g === 0) return ['θ = 0°: las dos puntas están en el 3.'];
    const v = -Math.sin(rad(g)), a = refDe(g), q = cuad(g);
    const exacto = q ? (EXACTO[a] ? ` = ${conSigno(-signo('sen', q), VAL[a].sen)}` : '') : ` = ${f(Math.round(v))}`;
    return junto([`sen(−${gr(g)}) = −sen ${gr(g)}${exacto}`]);
  }
  const ALT3 = {
    tres: ['2', '0', '−1', '−2', '1'],
    coc: ['−2', '0', '2'],
    prod: ['0', '−2', '2'],
    reloj: ['0 cm', '6 cm', '12 cm', '12√3 cm', '6√3 cm'],
    mix: ['0', '−1', '1', '−√3'],
  };
  const E3 = (g, o = {}) => fig(figOp(g, Object.assign({ objeto: null, rotTheta: gr(g), rotMenos: gr(-g) }, o)));
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'El seno de −30°', figura: E3(30),
      enunciado: '¿Cuánto vale sen(−30°)?',
      datos: [D.par, notab([['sen', 30], ['cos', 30]])],
      solucion: [{ texto: ['−30° es el reflejo de 30° en el eje x: la y cambia de signo, y el seno también:'], ecuacion: junto(['sen(−30°) = −sen 30° = ', R('−1/2')]) }],
      respuesta: ['sen(−30°) = ', R('−1/2')] },
    { nivel: 1, titulo: 'El coseno de −45°', figura: E3(45),
      enunciado: '¿Cuánto vale cos(−45°)?',
      datos: [D.par, notab([['cos', 45]])],
      solucion: [{ texto: ['El reflejo en el eje x no mueve la x, así que el coseno no cambia:'], ecuacion: junto(['cos(−45°) = cos 45° = ', R('√2/2')]) }],
      respuesta: ['cos(−45°) = ', R('√2/2')] },
    { nivel: 1, titulo: 'La tangente de −60°', figura: E3(60),
      enunciado: '¿Cuánto vale tan(−60°)?',
      datos: [D.par, notab([['tan', 60]])],
      solucion: [{ texto: ['La tangente es y entre x; con el reflejo, y cambia de signo y x no, así que la tangente cambia de signo:'], ecuacion: junto(['tan(−60°) = −tan 60° = ', R('−√3')]) }],
      respuesta: ['tan(−60°) = ', R('−√3')] },
    { nivel: 1, titulo: 'La secante de −60°', figura: E3(60),
      enunciado: '¿Cuánto vale sec(−60°)?',
      datos: [D.par, notab([['cos', 60]]), D.rec],
      solucion: [{ texto: ['La secante es r entre x, y ninguna de las dos cambia con el reflejo; además, sec 60° = 1/cos 60° = 2:'], ecuacion: junto(['sec(−60°) = sec 60° = ', R('2')]) }],
      respuesta: ['sec(−60°) = ', R('2')] },
    { nivel: 1, titulo: 'El minutero en el 4', figura: fig(figOp(30, { rotulos: [] })),
      enunciado: 'El minutero de un reloj mide 10 cm y apunta al 4: giró −30° desde el 3. ¿Cuánto vale y, la altura de su punta respecto del centro?',
      datos: [junto([Y, ' = r · sen ', th, ', con r = 10 cm.']), D.par, notab([['sen', 30]])],
      solucion: [{ texto: ['Con el reflejo, el seno cambia de signo: sen(−30°) = −sen 30° = −1/2. La altura es el largo por ese seno:'], ecuacion: junto([Y, ' = 10 · (−1/2) = ', R('−5 cm')]) }],
      respuesta: ['y = ', R('−5 cm'), ': 5 cm debajo del centro'] },
    { nivel: 2, titulo: 'El coseno de −120°', figura: E3(120),
      enunciado: '¿Cuánto vale cos(−120°)?',
      datos: [D.par, D.formulas, D.signos, notab([['cos', 60]])],
      solucion: [
        { texto: ['Primero se quita el menos: con el reflejo, el coseno no cambia.'], ecuacion: junto(['cos(−120°) = cos 120°']) },
        { texto: ['120° está en el II, con α = 60°, y ahí el coseno es negativo:'], ecuacion: junto(['cos 120° = −cos 60° = ', R('−1/2')]) },
      ],
      respuesta: ['cos(−120°) = ', R('−1/2')] },
    { nivel: 2, titulo: 'El seno de −135°', figura: E3(135),
      enunciado: '¿Cuánto vale sen(−135°)?',
      datos: [D.par, D.formulas, D.signos, notab([['sen', 45]])],
      solucion: [
        { texto: ['Primero se quita el menos: el reflejo cambia el signo del seno.'], ecuacion: junto(['sen(−135°) = −sen 135°']) },
        { texto: ['135° está en el II, donde el seno es positivo: sen 135° = sen 45° = √2/2. Entonces:'], ecuacion: junto(['sen(−135°) = ', R('−√2/2')]) },
      ],
      respuesta: ['sen(−135°) = ', R('−√2/2')] },
    { nivel: 2, titulo: 'La cosecante de −37°', figura: E3(37),
      enunciado: '¿Cuánto vale csc(−37°)?',
      datos: [D.par, D.rec, notab([['sen', 37]])],
      solucion: [
        { texto: ['La cosecante es r entre y, así que, como el seno, cambia de signo:'], ecuacion: junto(['csc(−37°) = −csc 37°']) },
        { texto: ['Como csc 37° = 1/(3/5) = 5/3, queda:'], ecuacion: junto(['csc(−37°) = ', R('−5/3')]) },
      ],
      respuesta: ['csc(−37°) = ', R('−5/3')] },
    { nivel: 2, titulo: 'La tangente de −300°', figura: E3(300, { rotTheta: '300°', rotMenos: '−300°' }),
      enunciado: '¿Cuánto vale tan(−300°)?',
      datos: [D.par, D.formulas, D.signos, notab([['tan', 60]])],
      solucion: [
        { texto: ['Primero se quita el menos: el reflejo cambia el signo de la tangente.'], ecuacion: junto(['tan(−300°) = −tan 300°']) },
        { texto: ['300° está en el IV, donde la tangente es negativa: tan 300° = −tan 60° = −√3. Los dos signos menos se cancelan:'], ecuacion: junto(['tan(−300°) = −(−√3) = ', R('√3')]) },
      ],
      respuesta: ['tan(−300°) = ', R('√3')] },
    { nivel: 2, titulo: 'Un seno y su opuesto', figura: E3(40, { rotTheta: 'θ', rotMenos: '−θ' }),
      enunciado: 'Para cualquier ángulo θ, ¿cuánto vale sen(−θ) + sen θ?',
      datos: [D.par],
      solucion: [
        { texto: ['sen(−θ) = −sen θ, porque las alturas de P y P′ miden lo mismo con signo contrario:'], ecuacion: junto(['sen(−', th, ') + sen ', th, ' = −sen ', th, ' + sen ', th, ' = ', R('0')]) },
        { texto: ['Esto vale con cualquier θ, porque P y P′ siempre están a la misma distancia del eje x, uno arriba y otro abajo.'] },
      ],
      respuesta: [R('0'), ', para cualquier θ'] },
    // Nivel 3, con alternativas. Letras de las correctas: C, A, B, C, A.
    { nivel: 3, titulo: 'Tres razones de negativos', figura: null,
      enunciado: 'Calcula E = cos(−60°) + sen(−30°) + tan(−45°).',
      alternativas: ALT3.tres,
      datos: [D.par, notab([['cos', 60], ['sen', 30], ['tan', 45]])],
      solucion: [
        { texto: ['Con el menos, el coseno no cambia, y el seno y la tangente cambian de signo:'], ecuacion: junto(['E = 1/2 + (−1/2) + (−1)']) },
        { texto: ['Se suman los tres valores:'], ecuacion: junto(['E = ', R('−1')]) },
        { texto: nb('**A** deja todo positivo; **B** olvida el signo del seno; **D** pone negativo también el coseno; **E** olvida el signo de la tangente.') },
      ],
      respuesta: [letra(ALT3.tres, '−1'), ', ', R('−1')] },
    { nivel: 3, titulo: 'Dos cocientes con −θ', figura: null,
      enunciado: 'θ no está sobre un eje. Simplifica E = sen(−θ)/sen θ − cos(−θ)/cos θ.',
      alternativas: ALT3.coc,
      datos: [D.par],
      solucion: [
        { texto: ['sen(−θ) = −sen θ y cos(−θ) = cos θ:'], ecuacion: junto(['E = ', frac(['−sen ', th], ['sen ', th]), ' − ', frac(['cos ', th], ['cos ', th]), ' = −1 − 1 = ', R('−2')]) },
        { texto: nb('**B** deja negativo también el coseno: −1 − (−1) = 0; **C** pone los signos al revés en los dos cocientes: 1 − (−1) = 2.') },
      ],
      respuesta: [letra(ALT3.coc, '−2'), ', ', R('−2')] },
    { nivel: 3, titulo: 'Dos productos con −θ', figura: null,
      enunciado: 'θ no está sobre un eje. Calcula E = tan(−θ) · cot θ − sec(−θ) · cos θ.',
      alternativas: ALT3.prod,
      datos: [D.par, D.rec],
      solucion: [
        { texto: ['tan(−θ) = −tan θ y sec(−θ) = sec θ; además, cada razón por su recíproca da 1:'], ecuacion: junto(['E = −tan ', th, ' · cot ', th, ' − sec ', th, ' · cos ', th]) },
        { texto: ['Cada producto vale 1:'], ecuacion: junto(['E = −1 − 1 = ', R('−2')]) },
        { texto: nb('**A** olvida el signo de tan(−θ): 1 − 1 = 0; **C** pone los signos al revés en los dos productos: 1 − (−1) = 2.') },
      ],
      respuesta: [letra(ALT3.prod, '−2'), ', ', R('−2')] },
    { nivel: 3, titulo: 'Minutero en el 2 y 4', figura: fig(figOp(30, { rotTheta: '30°', rotMenos: '−30°' })),
      enunciado: 'El minutero de un reloj mide 12 cm. ¿Cuántos centímetros hay, en vertical, entre su punta cuando apunta al 2 (30°) y cuando apunta al 4 (−30°)?',
      alternativas: ALT3.reloj,
      datos: [junto([Y, ' = r · sen ', th, ', con r = 12 cm.']), D.par, notab([['sen', 30], ['cos', 30]])],
      solucion: [
        { texto: ['Cuando apunta al 2, y = 12 · sen 30° = 6 cm; cuando apunta al 4, y = 12 · sen(−30°) = −6 cm.'] },
        { texto: ['La distancia vertical entre las dos puntas es la diferencia de alturas:'], ecuacion: junto(['6 − (−6) = ', R('12 cm')]) },
        { texto: nb('**A** deja las dos puntas arriba; **B** da una sola altura; **D** y **E** usan cos 30°, la otra coordenada.') },
      ],
      respuesta: [letra(ALT3.reloj, '12 cm'), ', ', R('12 cm')] },
    { nivel: 3, titulo: 'Coseno y seno de negativos', figura: null,
      enunciado: 'Calcula E = cos(−240°) + sen(−210°).',
      alternativas: ALT3.mix,
      datos: [D.par, D.formulas, D.signos, notab([['cos', 60], ['sen', 30], ['cos', 30], ['sen', 60]])],
      solucion: [
        { texto: ['El coseno no cambia con el menos, y 240° está en el III: cos(−240°) = cos 240° = −cos 60° = −1/2.'] },
        { texto: ['El seno sí cambia, y 210° está en el III: sen(−210°) = −sen 210° = −(−sen 30°) = 1/2. Se suman:'], ecuacion: junto(['E = −1/2 + 1/2 = ', R('0')]) },
        { texto: nb('**B** olvida el menos de sen(−210°); **C** pone negativo el coseno de −240°; **D** mide los agudos hasta el eje y, 30° y 60°, y además olvida el menos de sen(−210°): −√3/2 − √3/2 = −√3.') },
      ],
      respuesta: [letra(ALT3.mix, '0'), ', ', R('0')] },
  ];

  // «Ahora tú» de la idea 3: una razón de −α, una de −θ con θ de 90° a 360°, y un cociente o un producto con −θ.
  function casoOpuesto(rr) {
    const fn = rr.uno(FNS), a = rr.uno(ALFAS), p = PAR[fn], ok = conSigno(p, VAL[a][fn]), cof = conSigno(p, VAL[a][COF[fn]]);
    return {
      pregunta: `¿Cuánto vale ${fn}(−${gr(a)})?`,
      datos: [D.par, notabDe(fn, a)],
      dibujo: fig(figOp(a, { objeto: null, rotTheta: gr(a), rotMenos: gr(-a) })),
      opciones: opciones(ok, [
        p < 0 ? { id: 'sin-menos', texto: VAL[a][fn], error: 'TR15', siFuera: `El tamaño, ${VAL[a][fn]}, está bien, pero ${elN(fn)} usa la y, así que cambia de signo con −θ.` }
          : { id: 'todo-neg', texto: opuesto(ok), error: 'TRNEG-TODO-NEG', siFuera: `El tamaño está bien, pero ${fn}(−θ) = ${fn} θ: ${elN(fn)} usa x y r, que no cambian con el reflejo.` },
        { id: 'cof', texto: cof, error: 'TR11', siFuera: `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; con −θ la razón no cambia a su cofunción.` },
        { id: 'cof-signo', texto: opuesto(cof), error: 'TR11', siFuera: `${opuesto(cof)} usa ${COF[fn]} y otro signo; con −θ la razón se queda ${fn}.` },
      ]),
      solucion: { texto: `Con −θ, ${elN(fn)} ${p < 0 ? 'cambia de signo' : 'no cambia'}: ${fn}(−θ) = ${p < 0 ? '−' : ''}${fn} θ.`, ecuacion: junto([`${fn}(−${gr(a)}) = ${p < 0 ? '−' : ''}${fn} ${gr(a)} = `, R(ok)]) },
    };
  }
  function casoOpuestoGrande(rr) {
    const fn = rr.uno(FNS), a = rr.uno(ALFAS), q = rr.ent(2, 4), g = deG(a, q), p = PAR[fn], ok = conSigno(p * signo(fn, q), VAL[a][fn]);
    const sinPar = conSigno(signo(fn, q), VAL[a][fn]), sinCuad = conSigno(p, VAL[a][fn]), cof = conSigno(p * signo(fn, q), VAL[a][COF[fn]]);
    return {
      pregunta: `¿Cuánto vale ${fn}(−${gr(g)})?`,
      datos: [D.par, D.formulas, D.signos, notabDe(fn, a)],
      dibujo: fig(figOp(g, { objeto: null, rotTheta: gr(g), rotMenos: gr(-g) })),
      opciones: opciones(ok, [
        { id: 'sin-par', texto: sinPar, error: p < 0 ? 'TR15' : 'TRNEG-TODO-NEG', siFuera: `${fn} ${gr(g)} = ${sinPar} está bien, ${p < 0 ? `pero falta el menos de ${fn}(−θ) = −${fn} θ` : 'y con −θ no se agrega otro menos'}.` },
        { id: 'sin-cuad', texto: sinCuad, error: 'TR12', siFuera: `Quitar el menos de −θ está bien, pero falta el signo ${delN(fn)} en el ${ROM[q]}.` },
        { id: 'cof', texto: cof, error: 'TR14', siFuera: `Los signos están bien, pero ${cof} usa ${COF[fn]}; como ${gr(g)} se reduce con 180° o con 360°, se queda ${fn}.` },
        { id: 'cof-signo', texto: opuesto(cof), error: 'TR14', siFuera: `${opuesto(cof)} usa ${COF[fn]} y otro signo; aquí se queda ${fn}, con signo ${ok[0] === '−' ? 'menos' : 'más'}.` },
        { id: 'todo-neg', texto: opuesto(ok), error: 'TRNEG-TODO-NEG', siFuera: `El tamaño está bien, pero el signo no: ${fn}(−${gr(g)}) da un valor ${ok[0] === '−' ? 'negativo' : 'positivo'}.` },
      ]),
      solucion: { texto: `${fn}(−${gr(g)}) = ${p < 0 ? '−' : ''}${fn} ${gr(g)}, y ${gr(g)} está en el ${ROM[q]} con α = ${gr(a)}.`, ecuacion: junto([`${fn}(−${gr(g)}) = `, R(ok)]) },
    };
  }
  // E = f₁(−θ)/f₁(θ) ± f₂(−θ)/f₂(θ) o con productos f(−θ) · recíproca(θ): cada pieza vale PAR = ±1.
  const RECIP = { sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' };
  function casoCociente(rr) {
    for (let i = 0; i < 40; i++) {
      const f1 = rr.uno(FNS), f2 = rr.uno(FNS), op = rr.ent(0, 1) ? 1 : -1, prod = rr.ent(0, 1);
      if (f1 === f2) continue;
      const pieza = fn => (prod ? `${fn}(−θ) · ${RECIP[fn]} θ` : `${fn}(−θ)/${fn} θ`);
      const E = (p1, p2) => String(p1 + op * p2).replace('-', '−');
      const ok = E(PAR[f1], PAR[f2]);
      const ds = [
        { id: 'sin-signos', texto: E(1, 1), error: 'TR15', siFuera: `Ver que cada pieza vale 1 o −1 está bien, pero ${E(1, 1)} olvida que algunas razones cambian de signo con −θ.` },
        { id: 'todo-neg', texto: E(-1, -1), error: 'TRNEG-TODO-NEG', siFuera: `Ver que cada pieza vale 1 o −1 está bien, pero no todas cambian de signo: el coseno y la secante no cambian.` },
        { id: 'al-reves', texto: E(-PAR[f1], -PAR[f2]), error: 'TR15', siFuera: `Ver que cada pieza vale 1 o −1 está bien, pero los signos quedaron al revés en las dos piezas.` },
      ];
      if (new Set([ok, ...ds.map(d => d.texto)]).size < 3) continue;
      return {
        pregunta: `θ no está sobre un eje. Simplifica E = ${pieza(f1)} ${op > 0 ? '+' : '−'} ${pieza(f2)}.`,
        datos: [D.par].concat(prod ? [D.rec] : []),
        opciones: opciones(ok, ds),
        solucion: { texto: `${f1}(−θ) = ${PAR[f1] < 0 ? '−' : ''}${f1} θ y ${f2}(−θ) = ${PAR[f2] < 0 ? '−' : ''}${f2} θ; por eso las piezas valen ${PAR[f1]} y ${PAR[f2]}.`.replace(/-1/g, '−1'), ecuacion: junto(['E = ', R(ok)]) },
      };
    }
    throw new Error('casoCociente: sin caso');
  }
  const RES3 = [['cos', 30], ['sen', 45], ['tan', 30], ['cos', 150], ['sen', 240], ['csc', 60], ['sec', 135], ['tan', 315], ['cot', 37], ['sen', 53]];
  // En «Ahora tú», casoCociente da tres opciones posibles: se acepta con tres (no cuatro).
  function conOpciones(caso, rr, min) { for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= min) return c; } throw new Error(`${caso.name}: sin opciones`); }

  const opuestos = {
    id: 'opuestos',
    titulo: 'Ángulos opuestos: θ y −θ',
    pregunta: '¿Qué cambia entre las razones de 60° y las de −60°?',
    temas: ['Ángulos negativos'],
    pieza: PZ,
    aprendizaje: '−θ refleja θ en el eje x: la x se queda y la y cambia de signo; solo coseno y secante no cambian.',
    actividad: 'Mover el minutero de un reloj hacia atrás y hacia adelante desde el 3.',
    lee: {
      tarjetas: [
        { titulo: 'El reloj de pared', texto: ['El centro del reloj es el origen y el 3 marca el eje x positivo. El minutero gira en sentido horario, así que, medido desde el 3, su giro es negativo: −', th, '.'],
          pieza: PZ, dibujo: { datos: figOp(30, { tramos: false, alt: 'Reloj de pared: el minutero apunta al 4, 30 grados debajo del 3; la línea punteada apunta al 2' }), estado: {} } },
        { titulo: 'Dos giros opuestos', texto: [th, ' y −', th, ' giran lo mismo desde el 3, uno hacia arriba y el otro hacia abajo. P es donde queda la punta tras girar ', th, ', y P′, donde queda tras girar −', th, '.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Compara P y P′: ¿cuánto se alejan del centro hacia la derecha o la izquierda (', X, '), y cuánto suben o bajan (', Y, ')?'] },
      ],
    },
    ejemplos: EJEMPLOS_3,
    juega: {
      consigna: ['El minutero gira −', th, ' desde el 3, en sentido horario; la línea punteada marca el giro ', th, ', del mismo tamaño, en sentido antihorario.'],
      mision: {
        texto: 'Haz que el minutero, que gira −θ, apunte al 5.',
        logrado: val => val.g === 60,
        bien: 'Listo: −60°. Su punta baja lo mismo que P sube: sen(−60°) = −sen 60°.',
      },
      voz: '¿Qué coordenada comparten P y P′?',
      leyenda: [
        { s: th, t: 'giro antihorario desde el 3' },
        { s: '−θ', t: 'giro del minutero, horario' },
        { s: X, t: 'a la derecha (+) o izquierda (−) del centro' },
        { s: Y, t: 'arriba (+) o abajo (−) del centro' },
        { s: 'P′', t: 'la punta del minutero' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: figOp(val.g), estado: {} }),
      lectura: val => lecturaOp(val.g),
      minimo: 3,
      arrastres: [{ id: 'minutero', etiqueta: 'la punta del minutero',
        donde: val => TP().enPx(figOp(val.g), LM * Math.cos(rad(val.g)), -LM * Math.sin(rad(val.g))),
        mover: (pt, val) => { const g = -TP().anguloDe(figOp(val.g), pt, { cerca: -val.g }); return { g: Math.max(0, Math.min(180, Math.round(g / 30) * 30)) }; } }],
    },
    predice: {
      pregunta: 'cos 60° = 1/2. ¿Cuánto vale cos(−60°)?',
      datos: ['cos 60° = 1/2; sen 60° = √3/2.', 'El coseno es la abscisa x de la punta dividida entre r.'],
      voz: 'El juego te dio senos; ahora es el coseno.',
      opciones: [
        { id: 'c', texto: '1/2', correcta: true },
        { id: 'todo-neg', texto: '−1/2', error: 'TRNEG-TODO-NEG', siFuera: 'El tamaño, 1/2, está bien, pero un ángulo negativo no vuelve negativas todas sus razones: el reflejo en el eje x no mueve la x.' },
        { id: 'cruza-neg', texto: '−√3/2', error: 'TR11', siFuera: '−√3/2 es sen(−60°), que sale de la altura de la punta; el coseno sale de su x.' },
        { id: 'cruza', texto: '√3/2', error: 'TR11', siFuera: '√3/2 es sen 60°, que sale de la altura de P; el coseno sale de la x.' },
      ],
      dibujo: { datos: figOp(60, { tramos: false, objeto: { tipo: 'reloj', r: RL }, rotTheta: '60°', rotMenos: '−60°', alt: 'Reloj: el minutero en el 5, a −60 grados, y la línea punteada en el 1, a 60 grados' }), estado: {} },
      revelar: { datos: figOp(60, { rotTheta: '60°', rotMenos: '−60°', rotX: 'la misma x' }), estado: {} },
      coincide: 'Coincide: P y P′ tienen la misma x; cos(−60°) = cos 60° = 1/2.',
      noCoincide: 'Revisemos: el reflejo en el eje x sube o baja la punta, pero no la mueve a los lados, así que la x no cambia.',
    },
    mira: {
      datos: Object.assign(figOp(60, { rotTheta: '60°', rotMenos: '−60°' }), {
        segmentos: [
          { de: [0, 0], a: [LM * Math.cos(rad(60)), LM * Math.sin(rad(60))], discontinua: true, desde: 0 },
          { de: [0, 0], a: [LM * Math.cos(rad(60)), -LM * Math.sin(rad(60))], grosor: 'variable', desde: 0 },
          { de: [LM * Math.cos(rad(60)), 0], a: [LM * Math.cos(rad(60)), LM * Math.sin(rad(60))], color: 'o', discontinua: true, desde: 1 },
          { de: [LM * Math.cos(rad(60)), 0], a: [LM * Math.cos(rad(60)), -LM * Math.sin(rad(60))], color: 'o', desde: 1 },
          { de: [0, 0], a: [LM * Math.cos(rad(60)), 0], color: 'i', desde: 2 },
        ],
        alt: 'Reloj: las puntas a 60 y a −60 grados son reflejos en el eje x; comparten la x y tienen y opuestas',
      }),
      voz: 'El espejo es el eje x: lo de arriba pasa abajo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El giro de 60° sube desde el 3 hasta el 1, y el de −60° baja hasta el 5.', ecuacion: junto([th, ' = 60°', SEP, '−', th, ' = −60°']) },
        { estado: { corte: 1 }, texto: 'P′ baja lo mismo que P sube, así que sus y son opuestas y el seno cambia de signo.', ecuacion: junto(['sen(−60°) = −sen 60°']) },
        { estado: { corte: 2 }, texto: 'Las dos puntas están igual de lejos hacia la derecha del centro: tienen la misma x y el mismo coseno.', ecuacion: junto(['cos(−60°) = cos 60° = ', R('1/2')]) },
      ],
    },
    regla: {
      texto: 'Los lados finales de θ y −θ son reflejos en el eje x: la x se queda igual y la y cambia de signo. Por eso el coseno y la secante, que no usan la y, no cambian; las otras cuatro razones cambian de signo.',
      ecuacion: [junto(['sen(−', th, ') = −sen ', th]), SEP, junto(['cos(−', th, ') = cos ', th]), SEP, junto(['tan(−', th, ') = −tan ', th]),
        SEP, junto(['cot(−', th, ') = −cot ', th]), SEP, junto(['sec(−', th, ') = sec ', th]), SEP, junto(['csc(−', th, ') = −csc ', th])],
      condicion: 'la razón de θ existe, sea θ agudo o no. Si θ no es agudo, después de quitar el menos se reduce como en la idea anterior.',
      voz: 'Lo que usa la y cambia de signo; lo que usa solo x y r, no.',
      dibujo: { pieza: PZ, datos: figOp(50, { objeto: null, alt: 'Ángulos θ y −θ: sus puntos P y P′ comparten la x y tienen y opuestas' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [fn, g] = RES3[((sem % RES3.length) + RES3.length) % RES3.length], p = PAR[fn], q = cuad(g), a = refDe(g);
        const ok = conSigno(p * signo(fn, q), VAL[a][fn]), interm = q > 1;
        return {
          enunciado: `¿Cuánto vale ${fn}(−${gr(g)})?`,
          datos: [D.par].concat(interm ? [D.formulas, D.signos] : [], [notabDe(fn, a)]),
          dibujo: fig(figOp(g, { objeto: null, rotTheta: gr(g), rotMenos: gr(-g) })),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${fn}(−${gr(g)}), la razón de un ángulo negativo.`] },
            { tipo: 'datos', texto: [`El lado final de −${gr(g)} es el reflejo del de ${gr(g)} en el eje x.`] },
            { tipo: 'regla', texto: [p < 0 ? `${elN(fn)[0].toUpperCase() + elN(fn).slice(1)} usa la y, que cambia de signo con el reflejo, así que ${elN(fn)} también cambia de signo:` : `${elN(fn)[0].toUpperCase() + elN(fn).slice(1)} no usa la y, solo x y r, que no cambian con el reflejo, así que ${elN(fn)} no cambia:`], ecuacion: junto([`${fn}(−${gr(g)}) = ${p < 0 ? '−' : ''}${fn} ${gr(g)}`]) },
            { tipo: 'cuentas', texto: [interm ? `${gr(g)} está en el ${ROM[q]}, con α = ${gr(a)}, así que ${fn} ${gr(g)} = ${valorDe(fn, g)}. Se reemplaza:` : `Los datos dan ${fn} ${gr(g)} = ${VAL[a][fn]}. Se reemplaza:`], ecuacion: junto([`${fn}(−${gr(g)}) = `, R(ok)]) },
            { tipo: 'sentido', texto: [`Comprobación: −${gr(g)} termina en el cuadrante ${ROM[cuad(-g)]}, y ahí ${elN(fn)} es ${sgTxt(fn, ok[0] === '−' ? -1 : 1)}, como el resultado.`] },
          ],
          respuesta: [`${fn}(−${gr(g)}) = `, R(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el reflejo; si el ángulo no es agudo, después el cuadrante.',
      generar(sem) {
        const k = ((sem % 3) + 3) % 3;
        if (k < 2) return sinRepetir([casoOpuesto, casoOpuestoGrande][k], sem, opuestos);
        return conOpciones(casoCociente, azar(sem * 7 + 17), 3);
      },
    },
  };

  // ====================================================================================================================
  // Idea 4: primero se quitan las vueltas
  // ====================================================================================================================
  // Objeto de la primera pantalla: la rueda de bicicleta levantada en el taller; la válvula es P.
  // Cambia: el giro θ de 360° a 1080°, de 30° en 30°. · Permanece: la rueda. · Progresa: dónde queda la válvula tras quitar
  // las vueltas, y su α. · Se reserva: el valor de una razón con signo (la predicción, cos 480°; la lectura no da valores).
  // · Debe verse: las vueltas enteras no cambian nada; después se reduce como siempre.
  // Errores: TR12 (olvida el signo tras quitar la vuelta), TRRD-EJE-Y, TRRD-VUELTAS (quita medias vueltas, 180° · k, como
  // si fueran enteras), TR15 (con −θ, olvida el menos).
  const RB = 4, LB = 3.6;
  const bici = (g, o = {}) => figRed(g, Object.assign({ L: LB, V: 5.4, rArco: 0.9, espiral: 6, rAlfa: 2.4, objeto: { tipo: 'bici', r: RB, valvula: mod360(g) } }, o,
    { alt: o.alt || `Rueda de bicicleta: la válvula giró ${f(g)} grados y quedó donde quedaría con ${f(mod360(g))} grados` }));
  const biciJ = g => bici(g, { alfa: true, rotTheta: gr(g), rotAlfa: 'α' });
  const vueltasDe = g => Math.floor(g / 360);
  const ALT4 = {
    suma: ['1', '−1', '0', '√3'],
    tanque: ['20 L', '−20 L', '20√3 L', '−20√3 L'],
    neg: ['1/2', '−√3/2', '√3/2', '−1/2'],
    rad: ['−1/2', '1/2', '√3/2', '−√3/2'],
    prod: ['1/2', '−√3/2', '√3/2', '−1', '−1/2'],
  };
  const E4 = (g, o = {}) => fig(figRed(g, Object.assign({ alfa: true, rotTheta: gr(g), rotAlfa: 'α', espiral: 6 }, o)));
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'El seno de 390°', figura: E4(390),
      enunciado: '¿Cuánto vale sen 390°?',
      datos: [D.vueltas, notab([['sen', 30]])],
      solucion: [{ texto: ['390° es una vuelta y 30° más, así que se quita la vuelta:'], ecuacion: junto(['sen 390° = sen(390° − 360°) = sen 30° = ', R('1/2')]) }],
      respuesta: ['sen 390° = ', R('1/2')] },
    { nivel: 1, titulo: 'El coseno de 405°', figura: E4(405),
      enunciado: '¿Cuánto vale cos 405°?',
      datos: [D.vueltas, notab([['cos', 45]])],
      solucion: [{ texto: ['405° es una vuelta y 45° más: al quitar la vuelta queda 405° − 360° = 45°.'], ecuacion: junto(['cos 405° = cos 45° = ', R('√2/2')]) }],
      respuesta: ['cos 405° = ', R('√2/2')] },
    { nivel: 1, titulo: 'La tangente de 420°', figura: E4(420),
      enunciado: '¿Cuánto vale tan 420°?',
      datos: [D.vueltas, notab([['tan', 60]])],
      solucion: [{ texto: ['420° es una vuelta y 60° más: al quitar la vuelta queda 420° − 360° = 60°.'], ecuacion: junto(['tan 420° = tan 60° = ', R('√3')]) }],
      respuesta: ['tan 420° = ', R('√3')] },
    { nivel: 1, titulo: 'La secante de 780°', figura: E4(780),
      enunciado: '¿Cuánto vale sec 780°?',
      datos: [D.vueltas, D.rec, notab([['cos', 60]])],
      solucion: [{ texto: ['780° son dos vueltas y 60° más: 780° − 720° = 60°. Además, sec 60° = 1/cos 60° = 2:'], ecuacion: junto(['sec 780° = sec 60° = ', R('2')]) }],
      respuesta: ['sec 780° = ', R('2')] },
    { nivel: 1, titulo: 'La válvula arriba', figura: fig(bici(810, { rotTheta: '810°' })),
      enunciado: 'La rueda gira 810°. ¿Cuánto vale sen 810°?',
      datos: [D.vueltas, 'Sobre el eje y positivo: x = 0 e y = r.'],
      solucion: [{ texto: ['810° − 720° = 90°, así que la válvula queda arriba, sobre el eje y. Ahí no hay α: el seno sale del punto, y/r = r/r = 1.'], ecuacion: junto(['sen 810° = sen 90° = ', R('1')]) }],
      respuesta: ['sen 810° = ', R('1')] },
    { nivel: 2, titulo: 'El seno de 840°', figura: E4(840),
      enunciado: '¿Cuánto vale sen 840°?',
      datos: [D.vueltas, D.formulas, D.signos, notabDe('sen', 60)],
      solucion: [
        { texto: ['En 840° caben dos vueltas, que suman 720°, y se quitan:'], ecuacion: junto(['840° − 720° = 120°']) },
        { texto: ['120° está en el II, con α = 60°, y ahí el seno es positivo:'], ecuacion: junto(['sen 840° = sen 60° = ', R('√3/2')]) },
      ],
      respuesta: ['sen 840° = ', R('√3/2')] },
    { nivel: 2, titulo: 'La tangente de 1035°', figura: E4(1035),
      enunciado: '¿Cuánto vale tan 1035°?',
      datos: [D.vueltas, D.formulas, D.signos, notab([['tan', 45]])],
      solucion: [
        { texto: ['1035° = 2 · 360° + 315°, así que se quitan dos vueltas:'], ecuacion: junto(['1035° − 720° = 315°']) },
        { texto: ['315° está en el IV, con α = 45°, y ahí la tangente es negativa:'], ecuacion: junto(['tan 1035° = −tan 45° = ', R('−1')]) },
      ],
      respuesta: ['tan 1035° = ', R('−1')] },
    { nivel: 2, titulo: 'El coseno de −390°', figura: E4(-390, { rotTheta: '−390°', alfa: false }),
      enunciado: '¿Cuánto vale cos(−390°)?',
      datos: [D.par, D.vueltas, notab([['cos', 30]])],
      solucion: [
        { texto: ['Primero el menos: el coseno no cambia con −θ.'], ecuacion: junto(['cos(−390°) = cos 390°']) },
        { texto: ['Después se quita una vuelta, porque 390° − 360° = 30°:'], ecuacion: junto(['cos 390° = cos 30° = ', R('√3/2')]) },
      ],
      respuesta: ['cos(−390°) = ', R('√3/2')] },
    { nivel: 2, titulo: 'El seno de −1110°', figura: E4(-1110, { rotTheta: '−1110°' }),
      enunciado: '¿Cuánto vale sen(−1110°)?',
      datos: [D.par, D.vueltas, notab([['sen', 30]])],
      solucion: [
        { texto: ['Primero el menos: el seno cambia de signo con −θ.'], ecuacion: junto(['sen(−1110°) = −sen 1110°']) },
        { texto: ['En 1110° caben tres vueltas, que suman 1080°, y queda 1110° − 1080° = 30°:'], ecuacion: junto(['−sen 30° = ', R('−1/2')]) },
      ],
      respuesta: ['sen(−1110°) = ', R('−1/2')] },
    { nivel: 2, titulo: 'La válvula tras 1230°', figura: fig(bici(1230, { alfa: true, tramos: true, rotTheta: '1230°', rotAlfa: 'α', rotY: 'y = ?' })),
      enunciado: 'La válvula está a 30 cm del eje de la rueda. La rueda gira 1230°. ¿Cuánto vale y, la altura de la válvula respecto del eje?',
      datos: [junto([Y, ' = r · sen ', th, ', con r = 30 cm.']), D.vueltas, D.formulas, D.signos, notabDe('sen', 30)],
      solucion: [
        { texto: ['1230° − 1080° = 150°, que está en el II, con α = 30°; ahí el seno es positivo:'], ecuacion: junto(['sen 1230° = sen 30° = 1/2']) },
        { texto: ['La altura es el radio por ese seno:'], ecuacion: junto([Y, ' = 30 · 1/2 = ', R('15 cm')]) },
      ],
      respuesta: ['y = ', R('15 cm'), ', sobre el eje'] },
    // Nivel 3, con alternativas. Letras de las correctas: C, A, D, B, E.
    { nivel: 3, titulo: 'Dos ángulos de varias vueltas', figura: null,
      enunciado: 'Calcula E = sen 1230° + cos 1200°.',
      alternativas: ALT4.suma,
      datos: [D.vueltas, D.formulas, D.signos, notab([['sen', 30], ['cos', 60], ['sen', 60], ['cos', 30]])],
      solucion: [
        { texto: ['A cada ángulo se le quitan tres vueltas: 1230° − 1080° = 150° y 1200° − 1080° = 120°, los dos en el II:'], ecuacion: [junto(['sen 150° = 1/2']), ' y ', junto(['cos 120° = −1/2'])] },
        { texto: ['Se suman los dos valores:'], ecuacion: junto(['E = 1/2 − 1/2 = ', R('0')]) },
        { texto: nb('**A** olvida el signo del coseno; **B** pone negativo también el seno; **D** mide los agudos hasta el eje y y olvida los signos.') },
      ],
      respuesta: [letra(ALT4.suma, '0'), ', ', R('0')] },
    { nivel: 3, titulo: 'La pérdida del tanque', figura: null,
      enunciado: 'Un modelo de la pérdida de agua de un tanque, en litros, es V = 40 · cos 2220°. ¿Cuántos litros da?',
      alternativas: ALT4.tanque,
      datos: [D.vueltas, D.formulas, D.signos, notab([['cos', 60], ['cos', 30]])],
      solucion: [
        { texto: ['2220° = 6 · 360° + 60°: se quitan seis vueltas.'], ecuacion: junto(['2220° − 2160° = 60°']) },
        { texto: ['Se reemplaza en el modelo:'], ecuacion: junto(['V = 40 · cos 60° = 40 · 1/2 = ', R('20 L')]) },
        { texto: nb('**B** quita medias vueltas: 2220° − 11 · 180° = 240°; **C** usa cos 30°; **D** junta los dos errores.') },
      ],
      respuesta: [letra(ALT4.tanque, '20 L'), ', ', R('20 L')] },
    { nivel: 3, titulo: 'Un negativo de cinco vueltas', figura: null,
      enunciado: '¿Cuánto vale sen(−1950°)?',
      alternativas: ALT4.neg,
      datos: [D.par, D.vueltas, D.formulas, D.signos, notab([['sen', 30], ['cos', 30]])],
      solucion: [
        { texto: ['Primero el menos, sen(−1950°) = −sen 1950°; después se quitan cinco vueltas: 1950° − 1800° = 150°.'] },
        { texto: ['150° está en el II, donde el seno es positivo: sen 150° = sen 30° = 1/2. Con el menos:'], ecuacion: junto(['sen(−1950°) = ', R('−1/2')]) },
        { texto: nb('**A** olvida el menos de −θ; **B** y **C** usan cos 30°, la cofunción.') },
      ],
      respuesta: [letra(ALT4.neg, '−1/2'), ', ', R('−1/2')] },
    { nivel: 3, titulo: 'Un ángulo en radianes', figura: E4(510, { rotTheta: '17π/6' }),
      enunciado: '¿Cuánto vale sen(17π/6)?',
      alternativas: ALT4.rad,
      datos: [D.pi, D.vueltas, D.formulas, D.signos, notab([['sen', 30], ['cos', 30]])],
      solucion: [
        { texto: ['Primero se pasa a grados, con π rad = 180°:'], ecuacion: junto(['17π/6 = 17 · 180°/6 = 510°']) },
        { texto: ['Después se quita una vuelta:'], ecuacion: junto(['510° − 360° = 150°']) },
        { texto: ['150° está en el II, con α = 30°, y ahí el seno es positivo:'], ecuacion: junto(['sen(17π/6) = sen 30° = ', R('1/2')]) },
        { texto: nb('**A** pone el signo de otro cuadrante; **C** usa cos 30°; **D** usa cos 30° con signo menos.') },
      ],
      respuesta: [letra(ALT4.rad, '1/2'), ', ', R('1/2')] },
    { nivel: 3, titulo: 'Tangente por coseno, en radianes', figura: null,
      enunciado: 'Calcula E = tan(11π/4) · cos(13π/3).',
      alternativas: ALT4.prod,
      datos: [D.pi, D.vueltas, D.formulas, D.signos, notab([['tan', 45], ['cos', 60], ['cos', 30]])],
      solucion: [
        { texto: ['11π/4 = 495°, que sin la vuelta es 135°, en el II: tan 135° = −1. 13π/3 = 780°, que sin dos vueltas es 60°: cos 60° = 1/2.'] },
        { texto: ['Se multiplican los dos valores:'], ecuacion: junto(['E = (−1) · 1/2 = ', R('−1/2')]) },
        { texto: nb('**A** olvida el signo de la tangente; **B** usa cos 30°; **C** usa cos 30° y olvida el signo; **D** olvida el coseno.') },
      ],
      respuesta: [letra(ALT4.prod, '−1/2'), ', ', R('−1/2')] },
  ];

  // «Ahora tú» de la idea 4: una razón de varias vueltas, una de −θ con vueltas, y una en radianes.
  function casoVueltas(rr) {
    const fn = rr.uno(FNS), a = rr.uno(ALFAS), q = rr.ent(2, 4), n = rr.ent(1, 3), g0 = deG(a, q), g = g0 + 360 * n, ok = valorDe(fn, g0);
    const medias = valorDe(fn, g0 + 180), cof = conSigno(signo(fn, q), VAL[a][COF[fn]]);
    return {
      pregunta: `¿Cuánto vale ${fn} ${gr(g)}?`,
      datos: [D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
      dibujo: fig(figRed(g, { alfa: true, rotTheta: gr(g), rotAlfa: 'α', espiral: 6 })),
      opciones: opciones(ok, [
        { id: 'signo', texto: opuesto(ok), error: 'TR12', siFuera: `Quitar las vueltas, ${gr(g)} − ${360 * n}° = ${gr(g0)}, está bien, pero falta el signo ${delN(fn)} en el ${ROM[q]}.` },
        { id: 'medias', texto: medias, error: 'TRRD-VUELTAS', siFuera: `Quitar vueltas está bien, pero se quitan de 360° en 360°; con 180° de más, el ángulo queda en ${gr(mod360(g0 + 180))}, otro cuadrante.` },
        { id: 'cof', texto: cof, error: 'TR14', siFuera: `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir con 180° o 360°, la razón no cambia.` },
        { id: 'eje-y', texto: conSigno(signo(fn, q), VAL[90 - a] ? VAL[90 - a][fn] : VAL[a][fn]), error: 'TRRD-EJE-Y', siFuera: `El signo está bien, pero esa opción usa ${gr(90 - a)}, que se mide hasta el eje y; α mide ${gr(a)}.` },
        { id: 'cof-signo', texto: opuesto(cof), error: 'TR14', siFuera: `Esa opción usa ${COF[fn]} ${gr(a)} y otro signo; aquí la razón se queda ${fn}.` },
      ]),
      solucion: { texto: `${gr(g)} − ${360 * n}° = ${gr(g0)}, que está en el cuadrante ${ROM[q]}, con α = ${gr(a)}; ahí ${elN(fn)} es ${sgTxt(fn, signo(fn, q))}.`, ecuacion: junto([`${fn} ${gr(g)} = `, R(ok)]) },
    };
  }
  function casoNegGrande(rr) {
    const fn = rr.uno(FNS), a = rr.uno(ALFAS), q = rr.ent(1, 4), n = rr.ent(1, 3), g0 = deG(a, q), g = g0 + 360 * n, p = PAR[fn];
    const v0 = q === 1 ? VAL[a][fn] : valorDe(fn, g0), ok = p < 0 ? opuesto(v0) : v0;
    return {
      pregunta: `¿Cuánto vale ${fn}(−${gr(g)})?`,
      datos: [D.par, D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
      dibujo: fig(figRed(-g, { alfa: true, rotTheta: gr(-g), rotAlfa: 'α', espiral: 6 })),
      opciones: opciones(ok, [
        { id: 'par', texto: opuesto(ok), error: p < 0 ? 'TR15' : 'TRNEG-TODO-NEG', siFuera: `${fn} ${gr(g)} = ${v0} está bien, ${p < 0 ? `pero falta el menos de ${fn}(−θ) = −${fn} θ` : `pero ${fn}(−θ) = ${fn} θ, así que no se agrega un menos`}.` },
        { id: 'cof', texto: conSigno(ok[0] === '−' ? -1 : 1, VAL[a][COF[fn]]), error: 'TR14', siFuera: `Los signos están bien, pero esa opción usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir, la razón no cambia.` },
        { id: 'cof-signo', texto: opuesto(conSigno(ok[0] === '−' ? -1 : 1, VAL[a][COF[fn]])), error: 'TR14', siFuera: `Esa opción usa ${COF[fn]} ${gr(a)} y otro signo; aquí la razón se queda ${fn}.` },
      ]),
      solucion: { texto: `Primero el menos: ${fn}(−${gr(g)}) = ${p < 0 ? '−' : ''}${fn} ${gr(g)}. Después se quitan las vueltas: ${gr(g)} − ${360 * n}° = ${gr(g0)}.`, ecuacion: junto([`${fn}(−${gr(g)}) = `, R(ok)]) },
    };
  }
  // Radianes: kπ/d con d = 6, 4 o 3, más de una vuelta y fuera de los ejes.
  function casoRad(rr) {
    for (let i = 0; i < 60; i++) {
      const d = rr.uno([6, 4, 3]), k = rr.ent(2 * d + 1, 6 * d), g = 180 * k / d;
      if (gcdN(k, d) !== 1 || !cuad(g) || mod360(g) < 90) continue;
      const fn = rr.uno(['sen', 'cos', 'tan']), a = refDe(g), q = cuad(g), ok = valorDe(fn, g), cof = conSigno(signo(fn, q), VAL[a][COF[fn]]);
      return {
        pregunta: `¿Cuánto vale ${fn}(${k}π/${d})?`,
        datos: [D.pi, D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
        opciones: opciones(ok, [
          { id: 'signo', texto: opuesto(ok), error: 'TR12', siFuera: `${k}π/${d} = ${gr(g)} está bien, pero falta el signo ${delN(fn)} en el ${ROM[q]}.` },
          { id: 'cof', texto: cof, error: 'TR14', siFuera: `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir, la razón no cambia.` },
          { id: 'cof-signo', texto: opuesto(cof), error: 'TR14', siFuera: `Esa opción usa ${COF[fn]} ${gr(a)} y otro signo; aquí la razón se queda ${fn}.` },
        ]),
        solucion: { texto: `${k}π/${d} = ${k} · 180°/${d} = ${gr(g)}, y ${gr(g)} − ${360 * vueltasDe(g)}° = ${gr(mod360(g))}, en el ${ROM[q]}, con α = ${gr(a)}.`, ecuacion: junto([`${fn}(${k}π/${d}) = `, R(ok)]) },
      };
    }
    throw new Error('casoRad: sin caso');
  }
  const RES4 = [['sen', 855], ['cos', 1020], ['tan', 600], ['cos', 1140], ['sen', 945], ['tan', 1110], ['cos', 750], ['sen', 1305], ['sec', 840], ['csc', 1050]];

  const vueltas = {
    id: 'mayores-negativos',
    titulo: 'Primero se quitan las vueltas',
    pregunta: '¿Cómo se reduce un ángulo de más de una vuelta, como 1110°?',
    temas: ['Ángulos mayores de una vuelta'],
    pieza: PZ,
    aprendizaje: 'A un ángulo de más de una vuelta se le quitan vueltas enteras, θ − 360° · n; con un negativo, primero −θ. Después se reduce.',
    actividad: 'Hacer girar la rueda de una bicicleta varias vueltas y ver dónde queda la válvula.',
    lee: {
      tarjetas: [
        { titulo: 'La rueda del taller', texto: ['En el taller, la bicicleta está de cabeza y la rueda gira sin avanzar. El eje de la rueda es el origen y la válvula es P. Como la rueda puede dar varias vueltas, ', th, ' puede pasar de 360°.'],
          pieza: PZ, dibujo: { datos: bici(480, { rotTheta: '', alt: 'Rueda de bicicleta: la válvula dio más de una vuelta' }), estado: {} } },
        { titulo: 'Una vuelta no cambia nada', texto: ['Tras una vuelta entera, de 360°, la válvula vuelve al mismo lugar. Por eso, como viste en la unidad anterior, dos ángulos que se diferencian en vueltas enteras tienen las mismas razones.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Gira la rueda varias vueltas. Mira cuántas vueltas enteras da, dónde queda la válvula y cuánto mide su ', al, '.'] },
      ],
    },
    ejemplos: EJEMPLOS_4,
    juega: {
      consigna: ['La rueda gira ', th, ' desde la derecha del eje; la lectura le quita a ', th, ' las vueltas enteras y da ', al, '.'],
      mision: {
        texto: 'Con más de dos vueltas, deja la válvula en el IV, 30° debajo del eje x.',
        logrado: val => val.g === 1050,
        bien: 'Listo: 1050° − 2 · 360° = 330°, en el IV, con α = 30°.',
      },
      voz: '¿Cuántas vueltas enteras caben en el giro?',
      leyenda: [
        { s: th, t: 'giro total de la rueda' },
        { s: al, t: 'ángulo agudo hasta el eje x' },
        { s: 'P', t: 'la válvula' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 360, max: 1080, paso: 30, inicio: 420, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: biciJ(val.g), estado: {} }),
      lectura: val => {
        const n = vueltasDe(val.g), m = val.g - 360 * n;
        if (!cuad(m)) return [`${gr(val.g)} − ${n} · 360° = ${gr(m)}: queda sobre un eje.`];
        return junto([`${gr(val.g)} − ${n} · 360° = ${gr(m)}; `, al, ` = ${gr(refDe(m))}`]);
      },
      minimo: 3,
      arrastres: [{ id: 'valvula', etiqueta: 'la válvula P',
        donde: val => TP().enPx(biciJ(val.g), LB * Math.cos(rad(val.g)), LB * Math.sin(rad(val.g))),
        mover: (pt, val) => { const g = TP().anguloDe(biciJ(val.g), pt, { cerca: val.g }); return { g: Math.max(360, Math.min(1080, Math.round(g / 30) * 30)) }; } }],
    },
    predice: {
      pregunta: '¿Cuánto vale cos 480°?',
      datos: ['1 vuelta = 360°.', 'cos 60° = 1/2; cos 30° = √3/2.'],
      voz: 'El juego quitó vueltas; ahora falta el valor con su signo.',
      opciones: [
        { id: 'c', texto: '−1/2', correcta: true },
        { id: 'signo', texto: '1/2', error: 'TR12', siFuera: 'Quitar la vuelta está bien, pero queda 120°, que está en el II, donde el coseno es negativo.' },
        { id: 'eje-y', texto: '−√3/2', error: 'TRRD-EJE-Y', siFuera: 'El signo está bien, pero 30° es lo que 120° se aparta del eje y; α se mide hasta el eje x y es 60°.' },
        { id: 'dos', texto: '√3/2', error: 'TRRD-EJE-Y', siFuera: '√3/2 usa el ángulo medido hasta el eje y y, además, olvida que en el II el coseno es negativo.' },
      ],
      dibujo: { datos: bici(480, { rotTheta: '480°' }), estado: {} },
      revelar: { datos: bici(480, { alfa: true, tramos: true, rotTheta: '480°', rotAlfa: 'α = 60°', rotX: 'x < 0' }), estado: {} },
      coincide: 'Coincide: cos 480° = cos 120° = −cos 60° = −1/2.',
      noCoincide: 'Revisemos: al quitar la vuelta queda 120°, que está en el II.',
    },
    mira: {
      datos: Object.assign(bici(480, { rotTheta: '480°' }), {
        segmentos: [
          { de: [0, 0], a: [LB * Math.cos(rad(120)), LB * Math.sin(rad(120))], grosor: 'variable', desde: 0 },
          { de: [0, 0], a: [LB * Math.cos(rad(120)), 0], color: 'i', rotulo: 'x < 0', lado: 'adentro', desde: 2 },
        ],
        arcos: [{ de: 0, a: 472, r: 0.9, espiral: 6, color: 'h', rotulo: '480°' }, { de: 120, a: 180, r: 2.4, espiral: 0, flecha: false, color: 'f', rotulo: 'α', desde: 1 }],
        alt: 'Rueda de bicicleta: la válvula giró 480 grados y quedó como en 120 grados, a 60 grados del eje x negativo',
      }),
      voz: 'Las vueltas enteras no cuentan.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Al dividir 480° entre 360°, el cociente entero es 1 y el resto es 120°: cabe una vuelta.', ecuacion: junto(['480° − 360° = 120°']) },
        { estado: { corte: 1 }, texto: '120° está en el II, así que su ángulo de referencia se mide hasta el eje x negativo.', ecuacion: junto([al, ' = 180° − 120° = 60°']) },
        { estado: { corte: 2 }, texto: 'En el II la x es negativa, así que el coseno también es negativo.', ecuacion: junto(['cos 480° = cos 120° = −cos 60° = ', R('−1/2')]) },
        { estado: { corte: 2 }, texto: 'Con un ángulo negativo, primero se quita el menos (el coseno no cambia con −θ) y después las vueltas.', ecuacion: junto(['cos(−480°) = cos 480° = −1/2']) },
      ],
    },
    regla: {
      texto: 'Si θ pasa de 360°, se le quitan las vueltas enteras: θ − 360° · n queda entre 0° y 360° y tiene las mismas razones que θ. Si el ángulo es negativo, primero se quita el menos, como en la idea anterior.',
      ecuacion: [junto(['sen ', th, ' = sen(', th, ' − 360° · n)']), SEP, junto(['sen(−', th, ') = −sen ', th])],
      condicion: 'n es el número de vueltas enteras que caben en θ, es decir, el cociente entero de θ entre 360°.',
      voz: 'Primero las vueltas, después el agudo, al final el signo.',
      dibujo: { pieza: PZ, datos: Object.assign(bici(1110, { alfa: true, rotTheta: '1110°', rotAlfa: 'α' }), { alt: 'Rueda de bicicleta: 1110 grados son tres vueltas y 30 grados más' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [fn, g] = RES4[((sem % RES4.length) + RES4.length) % RES4.length], n = vueltasDe(g), m = g - 360 * n, q = cuad(m), a = refDe(m), ok = valorDe(fn, m);
        return {
          enunciado: `¿Cuánto vale ${fn} ${gr(g)}?`,
          datos: [D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
          dibujo: fig(figRed(g, { alfa: true, rotTheta: gr(g), rotAlfa: 'α', espiral: 6 })),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${fn} ${gr(g)}, la razón de un ángulo de más de una vuelta.`] },
            { tipo: 'datos', texto: [n === 1 ? `En ${gr(g)} cabe una vuelta entera, de 360°, y se quita:` : `En ${gr(g)} caben ${n} vueltas enteras, que suman ${360 * n}°, y se quitan:`], ecuacion: junto([`${gr(g)} − ${360 * n}° = ${gr(m)}`]) },
            { tipo: 'regla', texto: [`${gr(g)} tiene las mismas razones que ${gr(m)}, que está en el ${ROM[q]}, con α = ${gr(a)}; ahí ${elN(fn)} es ${sgTxt(fn, signo(fn, q))}.`] },
            { tipo: 'cuentas', texto: ['Se reduce con α y se pone el signo:'], ecuacion: junto([`${fn} ${gr(g)} = ${fn} ${gr(m)} = ${signo(fn, q) < 0 ? '−' : '+'}${fn} ${gr(a)} = `, R(ok)]) },
            { tipo: 'sentido', texto: [`Comprobación: ${gr(m)} + ${360 * n}° = ${gr(g)}, así que las vueltas cuadran y el lado final queda en el ${ROM[q]}.`] },
          ],
          respuesta: [`${fn} ${gr(g)} = `, R(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Quita vueltas, busca α y pon el signo.',
      generar(sem) { return sinRepetir([casoVueltas, casoNegGrande, casoRad][((sem % 3) + 3) % 3], sem, vueltas); },
    },
  };

  // ====================================================================================================================
  // Idea 5: con 90° y 270°, la cofunción
  // ====================================================================================================================
  // Objeto de la primera pantalla: un ventilador de techo visto desde abajo, con cuatro aspas a 90°; la punta del aspa A
  // es P (a φ) y la del aspa B, P′ (a 90° + φ). Cambia: φ de 0° a 80°, de 10° en 10°. · Permanece: las aspas y su largo. ·
  // Progresa: lo que sube B contra lo que avanza A. · Se reserva: el coseno de 90° + φ (la predicción; la lectura solo da el
  // seno). · Debe verse: un cuarto de vuelta cambia x por y: (x, y) pasa a (−y, x).
  // Errores: TR14 (conserva la razón con 90° o 270°, o la cambia con 180°), TR12 (olvida el signo), TR16 (reparte la razón).
  const RF = 4;
  function figVent(p, o = {}) {
    const ax = RF * Math.cos(rad(p)), ay = RF * Math.sin(rad(p)), bx = -ay, by = ax, V = 5.6;
    const seg = [];
    if (o.tramosA !== false) seg.push({ de: [0, 0], a: [ax, 0], color: 'i' }, { de: [ax, 0], a: [ax, ay], color: 'o' });
    if (o.tramosB !== false) seg.push({ de: [0, 0], a: [bx, 0], color: 'i' }, { de: [bx, 0], a: [bx, by], color: 'o' });
    seg.push({ de: [0, 0], a: [ax, ay], grosor: 'variable' }, { de: [0, 0], a: [bx, by], grosor: 'variable' });
    return {
      ventana: { x: [-V, V], y: [-V, V] }, objeto: o.objeto === undefined ? { tipo: 'ventilador', r: RF, aspa: p } : o.objeto,
      segmentos: seg,
      arcos: (p ? [{ de: 0, a: p - Math.min(6, p / 3), r: 2.7, espiral: 0, color: 'h', rotulo: 'φ' }] : []).concat([{ de: 0, a: 90 + p - 6, r: 1.8, espiral: 0, color: 'h', rotulo: o.rotB === undefined ? '90° + φ' : o.rotB }]),
      puntos: [{ x: ax, y: ay, rotulo: 'P', lado: 'ne' }, { x: bx, y: by, rotulo: 'P′', lado: 'no' }],
      rotulos: o.rotulos || [],
      alt: o.alt || `Ventilador de techo visto desde abajo: el aspa A forma ${f(p)} grados con el eje x y el aspa B, ${f(90 + p)} grados`,
    };
  }
  function lecturaCof(p) {
    if (p === 0) return ['φ = 0°: el aspa B apunta arriba; sen 90° = cos 0° = 1.'];
    const v = Math.cos(rad(p));
    return junto([`sen(90° + ${gr(p)}) = cos ${gr(p)} `, EXACTO[p] ? `= ${VAL[p].cos}` : `≈ ${f(v)}`]);
  }
  const ALT5 = {
    prods: ['0', '2', '−2'],
    abs: ['8/3', '10/3', '−10/3', '2/3', '3'],
    tan: ['5/12', '−12/5', '12/5', '−5/12', '13/5'],
    aspa: ['−30 cm', '40 cm', '−40 cm', '30 cm', '−50 cm'],
    coc: ['0', '2', '−2'],
  };
  const E5 = (K, s, o = {}) => fig(figRed(K + s * 25, Object.assign({ rotTheta: `${K}° ${s > 0 ? '+' : '−'} φ`, rArco: 1.3 }, o)));
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'El coseno de 90° + φ', figura: E5(90, 1),
      enunciado: 'φ es agudo. Escribe cos(90° + φ) con una razón de φ.',
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      solucion: [{ texto: ['Con 90°, el coseno cambia a seno, y 90° + φ está en el II, donde el coseno es negativo:'], ecuacion: junto(['cos(90° + ', fi, ') = ', R('−sen φ')]) }],
      respuesta: [R('−sen φ')] },
    { nivel: 1, titulo: 'El seno de 270° − φ', figura: E5(270, -1),
      enunciado: 'φ es agudo. Escribe sen(270° − φ) con una razón de φ.',
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      solucion: [{ texto: ['Con 270°, el seno cambia a coseno, y 270° − φ está en el III, donde el seno es negativo:'], ecuacion: junto(['sen(270° − ', fi, ') = ', R('−cos φ')]) }],
      respuesta: [R('−cos φ')] },
    { nivel: 1, titulo: 'La tangente de 90° + φ', figura: E5(90, 1),
      enunciado: 'φ es agudo. Escribe tan(90° + φ) con una razón de φ.',
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      solucion: [{ texto: ['Con 90°, la tangente cambia a cotangente, y 90° + φ está en el II, donde la tangente es negativa:'], ecuacion: junto(['tan(90° + ', fi, ') = ', R('−cot φ')]) }],
      respuesta: [R('−cot φ')] },
    { nivel: 1, titulo: 'La secante de 270° + φ', figura: E5(270, 1),
      enunciado: 'φ es agudo. Escribe sec(270° + φ) con una razón de φ.',
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      solucion: [{ texto: ['Con 270°, la secante cambia a cosecante, y 270° + φ está en el IV, donde la secante es positiva:'], ecuacion: junto(['sec(270° + ', fi, ') = ', R('csc φ')]) }],
      respuesta: [R('csc φ')] },
    { nivel: 1, titulo: 'Con 180°, se queda', figura: E5(180, -1),
      enunciado: 'φ es agudo. Escribe cos(180° − φ) con una razón de φ.',
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      solucion: [{ texto: ['Con 180°, la razón se queda, y 180° − φ está en el II, donde el coseno es negativo:'], ecuacion: junto(['cos(180° − ', fi, ') = ', R('−cos φ')]) }],
      respuesta: [R('−cos φ')] },
    { nivel: 2, titulo: 'El seno de 110°', figura: fig(figVent(20, { rotB: '110°' })),
      enunciado: 'sen 20° ≈ 0,34 y cos 20° ≈ 0,94. ¿Cuánto vale sen 110°?',
      datos: [D.cof, D.parejas, D.signos],
      solucion: [
        { texto: ['110° = 90° + 20°, así que el seno cambia a coseno; en el II el seno es positivo:'], ecuacion: junto(['sen 110° = cos 20°']) },
        { texto: ['Con el valor de cos 20° del enunciado:'], ecuacion: junto(['sen 110° ≈ ', R('0,94')]) },
      ],
      respuesta: ['sen 110° ≈ ', R('0,94')] },
    { nivel: 2, titulo: 'El coseno de 250°', figura: E5(270, -1, { rotTheta: '250°' }),
      enunciado: 'sen 20° ≈ 0,34 y cos 20° ≈ 0,94. ¿Cuánto vale cos 250°?',
      datos: [D.cof, D.parejas, D.signos],
      solucion: [
        { texto: ['250° = 270° − 20°, así que el coseno cambia a seno; en el III el coseno es negativo:'], ecuacion: junto(['cos 250° = −sen 20°']) },
        { texto: ['Con el valor de sen 20° del enunciado:'], ecuacion: junto(['cos 250° ≈ ', R('−0,34')]) },
      ],
      respuesta: ['cos 250° ≈ ', R('−0,34')] },
    { nivel: 2, titulo: 'El aspa siguiente', figura: fig(figVent(30, { tramosA: false, rotulos: [{ x: -1.5, y: 0.45, texto: 'x = ?' }] })),
      enunciado: 'Las aspas del ventilador miden 60 cm. El aspa A, con su punta en P, forma 30° con el eje x; el aspa B, con su punta en P′, está a 90° + 30°. ¿Cuánto vale la x de P′?',
      datos: [junto([X, ' = r · cos ', th, ', con ', th, ' el ángulo del aspa desde el eje x y r = 60 cm.']), D.cof, D.signos, notab([['sen', 30], ['cos', 30]])],
      solucion: [
        { texto: ['Con 90°, el coseno cambia a seno, y en el II es negativo: cos(90° + 30°) = −sen 30° = −1/2.'] },
        { texto: ['La x es el largo del aspa por ese coseno:'], ecuacion: junto([X, ' = 60 · (−1/2) = ', R('−30 cm')]) },
      ],
      respuesta: ['x = ', R('−30 cm'), ': 30 cm a la izquierda del eje'] },
    { nivel: 2, titulo: 'La tangente de 270° + φ', figura: E5(270, 1),
      enunciado: 'φ es agudo y tan φ = 3/4. ¿Cuánto vale tan(270° + φ)?',
      datos: [D.cof, D.parejas, D.signos, D.rec],
      solucion: [
        { texto: ['Con 270°, la tangente cambia a cotangente, y 270° + φ está en el IV, donde la tangente es negativa:'], ecuacion: junto(['tan(270° + ', fi, ') = −cot ', fi]) },
        { texto: ['Como cot φ = 1/tan φ = 4/3, queda:'], ecuacion: junto(['tan(270° + ', fi, ') = ', R('−4/3')]) },
      ],
      respuesta: [R('−4/3')] },
    { nivel: 2, titulo: 'Un producto que da 1', figura: null,
      enunciado: 'φ es agudo. Simplifica E = sen(90° + φ) · sec φ.',
      datos: [D.cof, D.parejas, D.signos, 'Razones recíprocas: sec y cos; csc y sen; cot y tan.'],
      solucion: [
        { texto: ['Con 90°, el seno cambia a coseno, y en el II el seno es positivo: sen(90° + φ) = cos φ.'] },
        { texto: ['Como la secante es la recíproca del coseno, el producto da 1:'], ecuacion: junto(['E = cos ', fi, ' · sec ', fi, ' = ', R('1')]) },
      ],
      respuesta: ['E = ', R('1')] },
    // Nivel 3, con alternativas. Letras de las correctas: B, B, C, C, C.
    { nivel: 3, titulo: 'Dos productos de cofunciones', figura: null,
      enunciado: 'φ es agudo. Calcula E = sen(90° + φ) · sec(360° − φ) + tan(270° − φ) · tan(180° + φ).',
      alternativas: ALT5.prods,
      datos: [D.cof, D.parejas, D.signos, D.rec],
      solucion: [
        { texto: ['Cada razón se reduce con su cuadrante: sen(90° + φ) = cos φ, sec(360° − φ) = sec φ, tan(270° − φ) = cot φ y tan(180° + φ) = tan φ.'] },
        { texto: ['Cada producto es una razón por su recíproca, así que cada uno vale 1:'], ecuacion: junto(['E = 1 + 1 = ', R('2')]) },
        { texto: nb('**A** toma tan(270° − φ) negativa; **C** toma negativos los dos productos.') },
      ],
      respuesta: [letra(ALT5.prods, '2'), ', ', R('2')] },
    { nivel: 3, titulo: 'Un valor absoluto', figura: null,
      enunciado: 'φ es agudo y tan φ = 1/3. Calcula |tan(90° + φ) + tan(180° − φ)|.',
      alternativas: ALT5.abs,
      datos: [D.cof, D.parejas, D.signos, D.rec, 'Valor absoluto: |a| es a sin su signo.'],
      solucion: [
        { texto: ['Los dos ángulos están en el II, donde la tangente es negativa: tan(90° + φ) = −cot φ = −3 y tan(180° − φ) = −tan φ = −1/3.'] },
        { texto: ['Se suman y se quita el signo:'], ecuacion: junto(['|−3 − 1/3| = |−10/3| = ', R('10/3')]) },
        { texto: nb('**A** toma tan(180° − φ) positiva; **C** olvida el valor absoluto; **D** deja la tangente en el primer término; **E** suma solo el primero.') },
      ],
      respuesta: [letra(ALT5.abs, '10/3'), ', ', R('10/3')] },
    { nivel: 3, titulo: 'Con el coseno dado', figura: null,
      enunciado: 'φ es agudo, sen φ = 5/13 y cos φ = 12/13. ¿Cuánto vale tan(270° − φ)?',
      alternativas: ALT5.tan,
      datos: [D.cof, D.parejas, D.signos, 'tan φ = sen φ/cos φ; cot φ = cos φ/sen φ.'],
      solucion: [
        { texto: ['Con 270°, la tangente cambia a cotangente; 270° − φ está en el III, donde es positiva.'], ecuacion: junto(['tan(270° − ', fi, ') = cot ', fi]) },
        { texto: ['Como cot φ = cos φ/sen φ = (12/13)/(5/13), queda:'], ecuacion: junto(['tan(270° − ', fi, ') = ', R('12/5')]) },
        { texto: nb('**A** se queda con la tangente; **B** pone el signo menos; **D** junta los dos errores; **E** es la cosecante.') },
      ],
      respuesta: [letra(ALT5.tan, '12/5'), ', ', R('12/5')] },
    { nivel: 3, titulo: 'Tres cuartos de vuelta después', figura: fig(Object.assign((d => Object.assign(d, { arcos: d.arcos.concat([{ de: 0, a: 31, r: 2.6, espiral: 0, color: 'h', rotulo: 'φ' }]), segmentos: d.segmentos.concat([{ de: [0, 0], a: [0.85 * RF * Math.cos(rad(37)), 0.85 * RF * Math.sin(rad(37))], discontinua: true }]) }))(figRed(307, { L: RF, V: 5.6, rotTheta: '270° + φ', objeto: { tipo: 'ventilador', r: RF, aspa: 37 } })), { alt: 'Ventilador: un aspa a 37 grados y la punta P de otra a 270 grados más 37' })),
      enunciado: 'Las aspas del ventilador miden 50 cm. Una de ellas forma φ = 37° con el eje x, y la que está tres cuartos de vuelta después, a 270° + φ, tiene su punta en P. ¿Cuánto vale la y de P?',
      alternativas: ALT5.aspa,
      datos: [junto([Y, ' = r · sen ', th, ', con ', th, ' el ángulo del aspa desde el eje x y r = 50 cm.']), D.cof, D.signos, notab([['sen', 37], ['cos', 37]])],
      solucion: [
        { texto: ['Con 270°, el seno cambia a coseno, y en el IV el seno es negativo:'], ecuacion: junto(['sen(270° + 37°) = −cos 37° = −4/5']) },
        { texto: ['La y es el largo del aspa por ese seno:'], ecuacion: junto([Y, ' = 50 · (−4/5) = ', R('−40 cm')]) },
        { texto: nb('**A** se queda con el seno; **B** olvida el signo; **D** junta los dos errores; **E** es el largo del aspa.') },
      ],
      respuesta: [letra(ALT5.aspa, '−40 cm'), ', ', R('−40 cm')] },
    { nivel: 3, titulo: 'Dos cocientes con cofunciones', figura: null,
      enunciado: 'φ es agudo. Simplifica E = cos(90° + φ)/sen(180° − φ) − sec(270° − φ)/csc(180° + φ).',
      alternativas: ALT5.coc,
      datos: [D.cof, D.parejas, D.signos],
      solucion: [
        { texto: ['cos(90° + φ) = −sen φ y sen(180° − φ) = sen φ: el primer cociente es −1.'] },
        { texto: ['sec(270° − φ) = −csc φ y csc(180° + φ) = −csc φ: el segundo cociente es 1, y se resta.'], ecuacion: junto(['E = −1 − 1 = ', R('−2')]) },
        { texto: nb('**A** toma 1 en los dos cocientes; **B** cambia el signo de los dos.') },
      ],
      respuesta: [letra(ALT5.coc, '−2'), ', ', R('−2')] },
  ];

  // «Ahora tú» de la idea 5: la expresión reducida de K ± φ, su valor con sen φ y cos φ dados, y una expresión de examen.
  const sgCof = (fn, K, s) => signo(fn, cuad(K + s * 30));   // el signo con φ agudo: se mira en el cuadrante de K ± φ
  const cofDe = (fn, K) => (K % 180 ? COF[fn] : fn);
  const angTxt = (K, s) => `${K}° ${s > 0 ? '+' : '−'} φ`;
  function casoCofSimb(rr) {
    const K = rr.uno([90, 90, 270, 270, 180, 360]), s = K === 360 ? -1 : rr.ent(0, 1) ? 1 : -1, fn = rr.uno(FNS);
    const nueva = cofDe(fn, K), sg = sgCof(fn, K, s), txtR = (g, f2) => `${g < 0 ? '−' : ''}${f2} φ`, ok = txtR(sg, nueva), otra = K % 180 ? fn : COF[fn];
    return {
      pregunta: `φ es agudo. ¿A qué es igual ${fn}(${angTxt(K, s)})?`,
      datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
      dibujo: fig(figRed(K + s * 25, { rotTheta: angTxt(K, s), rArco: 1.3 })),
      opciones: opciones(ok, [
        { id: 'otra', texto: txtR(sg, otra), error: 'TR14', siFuera: `El signo está bien, pero con ${K}° la razón ${K % 180 ? 'cambia a su cofunción' : 'se queda'}, así que queda ${ok}.` },
        { id: 'signo', texto: txtR(-sg, nueva), error: 'TR12', siFuera: `La razón está bien elegida, pero ${angTxt(K, s)} está en el ${ROM[cuad(K + s * 30)]}, donde ${elN(fn)} es ${sgTxt(fn, sg)}.` },
        { id: 'los-dos', texto: txtR(-sg, otra), error: 'TR14', siFuera: `${txtR(-sg, otra)} se equivoca en la razón y en el signo; la forma correcta es ${ok}.` },
      ]),
      solucion: { texto: `Con ${K}°, la razón ${K % 180 ? 'cambia a su cofunción' : 'se queda'}, y en el ${ROM[cuad(K + s * 30)]} ${elN(fn)} es ${sgTxt(fn, sg)}.`, ecuacion: junto([`${fn}(${angTxt(K, s)}) = `, R(ok)]) },
    };
  }
  const TERNAS = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  function casoCofValor(rr) {
    const [a, b, c] = rr.uno(TERNAS), K = rr.uno([90, 270]), s = rr.ent(0, 1) ? 1 : -1, fn = rr.uno(['sen', 'cos', 'tan']);
    const val = { sen: fr(a, c), cos: fr(b, c), tan: fr(a, b), cot: fr(b, a) };
    const nueva = cofDe(fn, K), sg = sgCof(fn, K, s), con = (g, f2) => frTxt(frPor(fr(g), val[f2]));
    const ok = con(sg, nueva);
    return {
      pregunta: `φ es agudo, sen φ = ${a}/${c} y cos φ = ${b}/${c}. ¿Cuánto vale ${fn}(${angTxt(K, s)})?`,
      datos: [D.cof, D.parejas, D.signos, 'tan φ = sen φ/cos φ; cot φ = cos φ/sen φ.'],
      opciones: opciones(ok, [
        { id: 'queda', texto: con(sg, fn), error: 'TR14', siFuera: `El signo está bien, pero con ${K}° ${fn} cambia a ${nueva}: sale ${ok}.` },
        { id: 'signo', texto: con(-sg, nueva), error: 'TR12', siFuera: `Cambiar a ${nueva} está bien, pero el signo es el ${delN(fn)} en el ${ROM[cuad(K + s * 30)]}, donde es ${sgTxt(fn, sg)}.` },
        { id: 'los-dos', texto: con(-sg, fn), error: 'TR14', siFuera: `${con(-sg, fn)} se queda con ${fn} y cambia el signo; es ${ok}.` },
      ]),
      solucion: { texto: `${fn}(${angTxt(K, s)}) = ${sg < 0 ? '−' : ''}${nueva} φ: cambia a la cofunción, con el signo del ${ROM[cuad(K + s * 30)]}.`, ecuacion: junto([`${fn}(${angTxt(K, s)}) = `, R(ok)]) },
    };
  }
  // E = f₁(A) · f₂(B) ± f₃(C) · f₄(D): cada producto, reducido, es una razón de φ por su recíproca, con signo: ±1.
  const BASES = [[90, 1], [90, -1], [180, 1], [180, -1], [270, 1], [270, -1], [360, -1]];
  function piezaQueDa(rr, g) {   // un ángulo K ± φ y una razón cuya reducción es ±g φ
    const [K, s] = rr.uno(BASES), fn = K % 180 ? COF[g] : g;
    return { K, s, fn, sg: sgCof(fn, K, s) };
  }
  function casoCofExpr(rr) {
    for (let i = 0; i < 60; i++) {
      const g1 = rr.uno(['sen', 'cos', 'tan']), g2 = rr.uno(['sen', 'cos', 'tan']), op = rr.ent(0, 1) ? 1 : -1;
      const a1 = piezaQueDa(rr, g1), b1 = piezaQueDa(rr, RECIP[g1]), a2 = piezaQueDa(rr, g2), b2 = piezaQueDa(rr, RECIP[g2]);
      if (a1.K === b1.K && a1.s === b1.s) continue;
      const P1 = a1.sg * b1.sg, P2 = a2.sg * b2.sg, E = (p, q) => String(p + op * q).replace('-', '−'), ok = E(P1, P2);
      const ds = [
        { id: 'todo-mas', texto: E(1, 1), error: 'TR12', siFuera: `Ver que cada producto vale 1 o −1 está bien, pero no todos son positivos; con todo positivo sale ${E(1, 1)}.` },
        { id: 'signo-1', texto: E(-P1, P2), error: 'TR12', siFuera: `El segundo producto está bien, pero el primero vale ${P1} por los signos de sus cuadrantes.`.replace('-1', '−1') },
        { id: 'signo-2', texto: E(P1, -P2), error: 'TR12', siFuera: `El primer producto está bien, pero el segundo vale ${P2} por los signos de sus cuadrantes.`.replace('-1', '−1') },
      ];
      if (new Set([ok, ...ds.map(d => d.texto)]).size < 3) continue;
      const pz = (x, y) => `${x.fn}(${angTxt(x.K, x.s)}) · ${y.fn}(${angTxt(y.K, y.s)})`;
      return {
        pregunta: `φ es agudo. Calcula E = ${pz(a1, b1)} ${op > 0 ? '+' : '−'} ${pz(a2, b2)}.`,
        datos: [D.cof, D.parejas, D.signos, D.rec],
        opciones: opciones(ok, ds),
        solucion: { texto: `Al reducir, cada producto queda como una razón de φ por su recíproca, con signo: valen ${P1} y ${P2}.`.replace(/-1/g, '−1'), ecuacion: junto(['E = ', R(ok)]) },
      };
    }
    throw new Error('casoCofExpr: sin caso');
  }
  const RES5 = [['sen', 90, 1], ['cos', 270, -1], ['tan', 90, -1], ['sec', 90, 1], ['csc', 270, 1], ['cot', 270, -1], ['sen', 270, 1], ['cos', 90, -1], ['tan', 270, 1], ['csc', 90, 1]];

  const cofuncion = {
    id: 'cofuncion',
    titulo: 'Con 90° y 270°, la cofunción',
    pregunta: '¿Cuándo, al reducir, el seno se vuelve coseno?',
    temas: ['Cofunción con 90° y 270°'],
    pieza: PZ,
    aprendizaje: 'Con 90° ± φ o 270° ± φ la razón cambia a su cofunción; con 180° ± φ o 360° − φ se queda. El signo, el del cuadrante.',
    actividad: 'Girar un ventilador de techo y comparar dos aspas seguidas.',
    lee: {
      tarjetas: [
        { titulo: 'El ventilador de techo', texto: ['Visto desde abajo, el ventilador tiene cuatro aspas a 90° y su eje es el origen. El aspa A (punta P) forma ', fi, ' con el eje x; la siguiente, B (punta P′), va un cuarto de vuelta después: a 90° + ', fi, '.'],
          pieza: PZ, dibujo: { datos: figVent(20, { tramosA: false, tramosB: false, alt: 'Ventilador de techo visto desde abajo, con el aspa A a 20 grados y el aspa B a 110 grados' }), estado: {} } },
        { titulo: 'La cofunción', texto: 'Las cofunciones van en parejas: el seno con el coseno, la tangente con la cotangente y la secante con la cosecante. Con ángulos complementarios viste que sen(90° − φ) = cos φ.' },
        { titulo: 'Qué mirar al jugar', texto: ['Compara cuánto sube la punta de B (su ', Y, ') con cuánto avanza a la derecha la punta de A (su ', X, ').'] },
      ],
    },
    ejemplos: EJEMPLOS_5,
    juega: {
      consigna: ['El aspa A (punta P) forma ', fi, ' con el eje x; el aspa B (punta P′) va un cuarto de vuelta después, a 90° + ', fi, '.'],
      mision: {
        texto: 'Deja P′, la punta de B, a una altura de medio largo del aspa.',
        logrado: val => val.p === 60,
        bien: 'Listo: φ = 60°. P′ sube medio largo porque sen 150° = cos 60° = 1/2.',
      },
      voz: '¿Lo que sube B es lo que avanza A?',
      leyenda: [
        { s: fi, t: 'ángulo del aspa A con el eje x' },
        { s: X, t: 'a la derecha (+) o izquierda (−) del eje' },
        { s: Y, t: 'arriba (+) o abajo (−) del eje' },
        { s: 'P, P′', t: 'puntas de las aspas A y B' },
      ],
      controles: [{ id: 'p', etiqueta: 'φ', color: 'c-h', min: 0, max: 80, paso: 10, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: figVent(val.p), estado: {} }),
      lectura: val => lecturaCof(val.p),
      minimo: 3,
      arrastres: [{ id: 'aspa', etiqueta: 'la punta del aspa A',
        donde: val => TP().enPx(figVent(val.p), RF * Math.cos(rad(val.p)), RF * Math.sin(rad(val.p))),
        mover: (pt, val) => { const g = mod360(TP().anguloDe(figVent(val.p), pt, { cerca: val.p })); return { p: Math.max(0, Math.min(80, Math.round((g > 270 ? 0 : g) / 10) * 10)) }; } }],
    },
    predice: {
      pregunta: 'Ahora el aspa A forma 20° con el eje x y el aspa B está a 110°. ¿Cuánto vale cos 110°?',
      datos: ['sen 20° ≈ 0,34; cos 20° ≈ 0,94.', '110° = 90° + 20°.'],
      voz: 'El juego te dio el seno de B; ahora es su coseno.',
      opciones: [
        { id: 'c', texto: '≈ −0,34', correcta: true },
        { id: 'queda', texto: '≈ −0,94', error: 'TR14', siFuera: 'El signo está bien, pero 110° = 90° + 20°, y con 90° el coseno no se queda: cambia a seno.' },
        { id: 'signo', texto: '≈ 0,34', error: 'TR12', siFuera: 'Cambiar a seno está bien, pero B queda a la izquierda del eje, donde x es negativa, así que su coseno es negativo.' },
        { id: 'los-dos', texto: '≈ 0,94', error: 'TR14', siFuera: '0,94 se queda con el coseno y sin signo; B está a la izquierda del eje, y con 90° el coseno cambia a seno.' },
      ],
      dibujo: { datos: figVent(20, { tramosA: false, tramosB: false, rotB: '110°' }), estado: {} },
      revelar: { datos: figVent(20, { rotB: '110°' }), estado: {} },
      coincide: 'Coincide: cos 110° = −sen 20° ≈ −0,34.',
      noCoincide: 'Revisemos: lo que B se aparta hacia la izquierda es lo mismo que sube A.',
    },
    mira: {
      datos: Object.assign(figVent(20, { rotB: '110°' }), {
        segmentos: [
          { de: [0, 0], a: [RF * Math.cos(rad(20)), RF * Math.sin(rad(20))], grosor: 'variable', desde: 0 },
          { de: [0, 0], a: [-RF * Math.sin(rad(20)), RF * Math.cos(rad(20))], grosor: 'variable', desde: 0 },
          { de: [RF * Math.cos(rad(20)), 0], a: [RF * Math.cos(rad(20)), RF * Math.sin(rad(20))], color: 'o', desde: 1 },
          { de: [0, 0], a: [-RF * Math.sin(rad(20)), 0], color: 'i', rotulo: 'x < 0', desde: 2 },
        ],
        alt: 'Ventilador: el aspa A a 20 grados y el aspa B a 110 grados; lo que A sube es lo que B avanza hacia la izquierda',
      }),
      voz: 'Un cuarto de vuelta cambia x por y.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El aspa B va un cuarto de vuelta, 90°, después del aspa A.', ecuacion: junto(['110° = 90° + 20°']) },
        { estado: { corte: 1 }, texto: 'La punta de A sube una altura y igual al largo del aspa por sen 20°, que vale cerca de 0,34.', ecuacion: junto([Y, ' de A = r · sen 20°']) },
        { estado: { corte: 2 }, texto: 'Al girar un cuarto de vuelta, esa altura se vuelve lo que la punta de B se aparta hacia la izquierda.', ecuacion: junto([X, ' de B = −', Y, ' de A']) },
        { estado: { corte: 2 }, texto: 'Por eso el coseno de 110° cambia a seno, y es negativo porque B está en el II.', ecuacion: junto(['cos 110° = −sen 20° ≈ ', R('−0,34')]) },
      ],
    },
    regla: {
      texto: 'Con 90° ± φ o 270° ± φ, la razón cambia a su cofunción; con 180° ± φ o 360° − φ, se queda. El signo es el que tiene la razón original en el cuadrante del ángulo.',
      ecuacion: [junto(['sen(90° + ', fi, ') = cos ', fi]), SEP, junto(['cos(90° + ', fi, ') = −sen ', fi]), SEP, junto(['tan(270° − ', fi, ') = cot ', fi]), SEP, junto(['sec(270° + ', fi, ') = csc ', fi])],
      condicion: 'φ es agudo: así se sabe el cuadrante del ángulo, porque 90° + φ cae en el II, 270° − φ en el III y 270° + φ en el IV.',
      voz: 'Un cuarto de vuelta cambia x por y; media vuelta, no.',
      dibujo: { pieza: PZ, datos: figVent(30, { objeto: null, alt: 'Dos puntos a 30 y a 120 grados: la x de uno es, con signo menos, la y del otro' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [fn, K, s] = RES5[((sem % RES5.length) + RES5.length) % RES5.length], nueva = cofDe(fn, K), sg = sgCof(fn, K, s), q = cuad(K + s * 30), ok = `${sg < 0 ? '−' : ''}${nueva} φ`;
        return {
          enunciado: `φ es agudo. Escribe ${fn}(${angTxt(K, s)}) con una razón de φ.`,
          datos: [D.fiAgudo, D.cof, D.parejas, D.signos],
          dibujo: fig(figRed(K + s * 25, { rotTheta: angTxt(K, s), rArco: 1.3 })),
          pasos: [
            { tipo: 'pide', texto: [`Piden escribir ${fn}(${angTxt(K, s)}) con una razón de φ.`] },
            { tipo: 'datos', texto: [`Como φ es agudo, ${angTxt(K, s)} cae en el cuadrante ${ROM[q]}.`] },
            { tipo: 'regla', texto: [`Con ${K}°, la razón cambia a su cofunción: ${fn} pasa a ${nueva}. El signo es el ${delN(fn)} en el ${ROM[q]}.`] },
            { tipo: 'cuentas', texto: [`En el ${ROM[q]}, ${elN(fn)} es ${sgTxt(fn, sg)}, así que:`], ecuacion: junto([`${fn}(${angTxt(K, s)}) = `, R(ok)]) },
            { tipo: 'sentido', texto: [`Comprobación con φ = 30°: ${fn} ${gr(K + s * 30)} y ${sg < 0 ? '−' : ''}${nueva} 30° tienen el mismo signo y el mismo tamaño.`] },
          ],
          respuesta: [`${fn}(${angTxt(K, s)}) = `, R(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero mira el ángulo: con 90° o 270° la razón cambia; con 180° o 360°, se queda. Después, el signo.',
      generar(sem) {
        const k = ((sem % 3) + 3) % 3;
        if (k < 2) return sinRepetir([casoCofSimb, casoCofValor][k], sem, cofuncion);
        return conOpciones(casoCofExpr, azar(sem * 7 + 17), 3);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: un giro cualquiera, de −720° a 1080° de 15 en 15: se quitan vueltas, se busca α y se decide el signo.
  const labGiro = g => {
    const d = figRed(g, { alfa: true, tramos: true, rotTheta: gr(g), rArco: 0.7, espiral: 8, alt: `Giro de ${f(g)} grados: termina como ${f(mod360(g))} grados, con ángulo de referencia de ${f(refDe(g))} grados` });
    return d;
  };
  // Mesa 2: θ agudo y un ángulo relacionado (90°, 180°, 270° o 360° ± θ): la pareja P′ y su razón.
  const RELS = [[90, 1], [90, -1], [180, -1], [180, 1], [270, -1], [270, 1], [360, -1]];
  const relTxt = ([a, sg]) => `${a}° ${sg > 0 ? '+' : '−'} θ`;
  const relPartes = ([a, sg]) => [`(${a}° ${sg > 0 ? '+' : '−'} `, th, ')'];
  const FNUM = { sen: g => Math.sin(rad(g)), cos: g => Math.cos(rad(g)), tan: g => (Math.abs(Math.cos(rad(g))) < 1e-9 ? NaN : Math.tan(rad(g))) };
  function relacion(val) {
    const [a, sg] = RELS[val.rel], h = a + sg * val.g, L = 4;
    const x = L * Math.cos(rad(val.g)), y = L * Math.sin(rad(val.g)), x2 = L * Math.cos(rad(h)), y2 = L * Math.sin(rad(h));
    return {
      ventana: { x: [-6, 6], y: [-6, 6] },
      segmentos: [{ de: [0, 0], a: [x, 0], color: 'i' }, { de: [x, 0], a: [x, y], color: 'o' }, { de: [0, 0], a: [x, y], grosor: 'variable' },
        { de: [0, 0], a: [x2, 0], color: 'i', discontinua: true }, { de: [x2, 0], a: [x2, y2], color: 'o', discontinua: true }, { de: [0, 0], a: [x2, y2], discontinua: true }],
      arcos: val.g ? [{ de: 0, a: val.g, r: 0.9, espiral: 0, color: 'h', rotulo: 'θ' }] : [],
      puntos: [{ x, y, rotulo: 'P', lado: 'ne' }, { x: x2, y: y2, rotulo: 'P′', lado: y2 < 0 ? (x2 < 0 ? 'so' : 'se') : (x2 < 0 ? 'no' : 'ne') }],
      alt: `θ = ${f(val.g)} grados y ${relTxt(RELS[val.rel])} = ${f(h)} grados, con sus coordenadas`,
    };
  }
  // sen(a ± θ) = σ · (sen o cos) θ: la razón y el signo se deciden evaluando en un agudo genérico (10°), por código.
  function reducida(fn, [a, sg]) {
    const nueva = a % 180 ? COF[fn] : fn, v = FNUM[fn](a + sg * 10) / FNUM[nueva](10);
    return [`${v < 0 ? '−' : ''}${nueva} `, th];
  }
  const CTR_GIRO = { id: 'g', etiqueta: 'θ', color: 'c-h', min: -720, max: 1080, paso: 15, inicio: 855, unidad: '°', decimales: 0 };
  const parejaDe = val => { const [a, sg] = RELS[val.rel]; return a + sg * val.g; };   // el ángulo de P′
  const MAS_180 = RELS.findIndex(([a, sg]) => a === 180 && sg > 0), MENOS_90 = RELS.findIndex(([a, sg]) => a === 90 && sg < 0);
  const laboratorio = [
    {
      id: 'cualquier-giro', titulo: 'Cualquier giro, paso a paso', pieza: PZ,
      consigna: 'Gira P hasta tres vueltas, en cualquier sentido, y elige la razón. La lectura quita las vueltas y da α y el signo.',
      controles: [
        CTR_GIRO,
        { id: 'fn', etiqueta: 'razón', opciones: ['sen', 'cos', 'tan'].map(v => ({ valor: v, texto: v })) },
      ],
      dibujo: val => ({ datos: labGiro(val.g), estado: {} }),
      lectura: val => {
        const m = mod360(val.g), a = refDe(m), v = FNUM[val.fn](val.g);
        if (!Number.isFinite(v)) return [`${val.fn}(${gr(val.g)}) = ${val.fn} ${gr(m)}: no está definida`];
        if (!cuad(m)) return [`${val.fn}(${gr(val.g)}) = ${val.fn} ${gr(m)}: sobre un eje`];
        const sg = v < 0 ? '−' : '+';
        return [`${val.fn}(${gr(val.g)}) = ${val.fn} ${gr(m)} = ${sg}${val.fn} `, al, ` = ${sg}${val.fn} ${gr(a)}`];
      },
      arrastres: [{ id: 'punta', etiqueta: 'punta del giro θ', color: 'c-h',
        donde: val => TP().enPx(labGiro(val.g), 4 * Math.cos(rad(val.g)), 4 * Math.sin(rad(val.g))),
        mover: (pt, val) => ({ g: TP().anguloDe(labGiro(val.g), pt, { cerca: val.g }) }) }],
      invitaciones: [
        { texto: 'Consigue una razón negativa cuyo ángulo de referencia mida 60°.',
          logrado: val => cuad(val.g) > 0 && refDe(val.g) === 60 && FNUM[val.fn](val.g) < -1e-9,
          bien: 'El tamaño lo puso 60°; el signo, el cuadrante del giro.' },
        { texto: 'Busca un giro del cuadrante III donde la razón elegida sea positiva.',
          logrado: val => cuad(val.g) === 3 && FNUM[val.fn](val.g) > 1e-9,
          bien: 'En el III solo la tangente es positiva: menos entre menos.' },
        { texto: 'Haz que la tangente no esté definida con un giro negativo.',
          logrado: val => val.fn === 'tan' && val.g < 0 && !Number.isFinite(FNUM.tan(val.g)),
          bien: 'El lado final quedó sobre el eje y, donde x = 0 y no se puede dividir.' },
        { texto: 'Busca el giro más negativo de la mesa con el lado final de 855°.',
          logrado: val => mod360(val.g) === mod360(CTR_GIRO.inicio) && val.g - 360 < CTR_GIRO.min,
          bien: 'Quitando vueltas, los dos quedan en 135°: mismas razones.' },
        { texto: 'Guarda dos giros de cuadrantes distintos con la misma razón y el mismo valor.',
          logrado: (val, guardados) => cuad(val.g) > 0 && guardados.some(c => c.fn === val.fn && cuad(c.g) > 0
            && cuad(c.g) !== cuad(val.g) && Math.abs(FNUM[c.fn](c.g) - FNUM[val.fn](val.g)) < 1e-9),
          bien: 'Mismo α en los dos giros, y la razón tiene el mismo signo en sus cuadrantes.' },
      ],
    },
    {
      id: 'siete-relaciones', titulo: 'Espejos y cuartos de vuelta', pieza: PZ,
      consigna: 'Mueve θ o su pareja P′ y elige la pareja. La lectura dice si la razón se queda o cambia a su cofunción.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 90, paso: 5, inicio: 35, unidad: '°', decimales: 0 },
        { id: 'rel', etiqueta: 'pareja', opciones: RELS.map((r, k) => ({ valor: k, texto: relTxt(r) })) },
      ],
      dibujo: val => ({ datos: relacion(val), estado: {} }),
      lectura: val => {
        const r = RELS[val.rel];
        return ['sen', ...relPartes(r), ' = ', ...reducida('sen', r), SEP, 'cos', ...relPartes(r), ' = ', ...reducida('cos', r)];
      },
      arrastres: [
        { id: 'punto-p', etiqueta: 'punto P en θ', color: 'c-h',
          donde: val => TP().enPx(relacion(val), 4 * Math.cos(rad(val.g)), 4 * Math.sin(rad(val.g))),
          mover: (pt, val) => ({ g: TP().anguloDe(relacion(val), pt, { cerca: val.g }) }) },
        { id: 'pareja', etiqueta: 'punto P′ de la pareja', color: 'c-h',
          donde: val => { const h = parejaDe(val); return TP().enPx(relacion(val), 4 * Math.cos(rad(h)), 4 * Math.sin(rad(h))); },
          mover: (pt, val) => { const [a, sg] = RELS[val.rel]; return { g: sg * (TP().anguloDe(relacion(val), pt, { cerca: a + sg * val.g }) - a) }; } },
      ],
      invitaciones: [
        { texto: 'Con la pareja 90° − θ, haz que P′ caiga justo sobre P.',
          logrado: val => val.rel === MENOS_90 && Math.abs(Math.cos(rad(parejaDe(val))) - Math.cos(rad(val.g))) < 1e-9
            && Math.abs(Math.sin(rad(parejaDe(val))) - Math.sin(rad(val.g))) < 1e-9,
          bien: 'En 45° seno y coseno son iguales: la cofunción da lo mismo.' },
        { texto: 'Haz que la lectura cambie a la cofunción y dé los dos signos negativos.',
          logrado: val => { const r = RELS[val.rel]; return reducida('sen', r)[0] === '−cos ' && reducida('cos', r)[0] === '−sen '; },
          bien: 'Con 270° − θ, P′ cae en el III: seno y coseno negativos.' },
        { texto: 'Con la pareja 180° + θ, deja a P′ lo más abajo posible.',
          logrado: val => val.rel === MAS_180 && Math.abs(Math.sin(rad(parejaDe(val))) + 1) < 1e-9,
          bien: 'Con θ = 90°, P′ queda en 270°, el punto más bajo: su seno es −1.' },
        { texto: 'Con el mismo θ, guarda dos parejas cuyos P′ sean puntos distintos a la misma altura.',
          logrado: (val, guardados) => guardados.some(c => c.g === val.g && c.rel !== val.rel
            && Math.abs(Math.sin(rad(parejaDe(c))) - Math.sin(rad(parejaDe(val)))) < 1e-9
            && Math.abs(Math.cos(rad(parejaDe(c))) - Math.cos(rad(parejaDe(val)))) > 1e-9),
          bien: 'Misma altura, mismo seno: uno es el reflejo del otro en el eje y.' },
      ],
    },
  ];

  const ideas = [referencia, mismaRazon, opuestos, vueltas, cofuncion];
  return {
    unidad: 'trigonometria.reduccion-al-primer-cuadrante',
    version: '0.2.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/trig-pos.js'],
    letras: { 'θ': 'el ángulo que se reduce', 'α': 'el ángulo de referencia de θ', 'β': 'otro ángulo del mismo problema',
      'φ': 'un ángulo agudo junto a 90°, 180°, 270° o 360°', P: 'la punta del objeto, en el lado final', 'P′': 'el reflejo o la gemela de P',
      x: 'la abscisa de P', y: 'la ordenada de P', r: 'el largo de la flecha, del aspa o el radio', n: 'un número entero de vueltas' },
    glosario: [
      { termino: 'ángulo de referencia', simbolo: 'α', formas: ['ángulo de referencia', 'ángulos de referencia'],
        simple: 'El ángulo agudo que el lado final se aparta del eje x.',
        def: 'Ángulo agudo entre el lado final de θ y el eje x, por el lado más corto; aquí, α.',
        ejemplos: ['160° está en el II: α = 180° − 160° = 20°.', '215° está en el III: α = 215° − 180° = 35°.', '300° está en el IV: α = 360° − 300° = 60°.'],
        ver: ['noroeste'] },
      { termino: 'noroeste', formas: ['noroeste', 'suroeste', 'noreste', 'sureste'], simple: 'La dirección a mitad de camino entre el norte y el oeste.',
        def: 'Dirección a mitad de camino entre el norte y el oeste. Las otras tres intermedias se nombran igual.',
        ejemplos: ['Una flecha al noroeste está en el cuadrante II.', 'Al sureste, la flecha queda en el IV: abajo y a la derecha.', 'Al suroeste, en el III.'],
        ver: ['ángulo de referencia'] },
      // Idea 2
      { termino: 'reducir al primer cuadrante', formas: ['reducir al primer cuadrante', 'reducción al primer cuadrante', 'reducir'],
        simple: 'Cambiar la razón de un ángulo no agudo por la de uno agudo.',
        def: 'Escribir una razón de cualquier ángulo como ± la misma razón de su ángulo de referencia.',
        ejemplos: ['sen 150° = sen 30° = 1/2.', 'tan 300° = −tan 60° = −√3.', 'cos 217° = −cos 37°, que vale −4/5 con la convención del examen.'],
        ver: ['ángulo de referencia', 'gemela'] },
      { termino: 'gemela', formas: ['gemela', 'gemelas'], simple: 'La copia de P en el primer cuadrante, con el mismo ángulo agudo.',
        def: 'Punto P′ del cuadrante I con el mismo ángulo de referencia que P y a la misma distancia del origen.',
        ejemplos: ['La gemela de la cabina a 150° está a 30°.', 'La gemela de 210° también está a 30°, pero arriba.', 'P y su gemela tienen las coordenadas del mismo tamaño.'],
        ver: ['reducir al primer cuadrante'] },
      // Idea 3
      { termino: 'giros opuestos', formas: ['giros opuestos', 'giro opuesto'], simple: 'Dos giros iguales, uno hacia cada lado.',
        def: 'Dos giros del mismo tamaño desde el eje x positivo, uno antihorario y otro horario, como θ y −θ.',
        ejemplos: ['30° y −30°: el minutero en el 2 y en el 4.', '−90° es el opuesto de 90°: abajo y arriba.', '200° y −200° terminan en el III y en el II.'],
        ver: ['simétrico'] },
      { termino: 'simétrico', formas: ['simétrico', 'simétricos', 'simétrica', 'simétricas', 'reflejo'], simple: 'Lo que se ve en un espejo puesto sobre una línea.',
        def: 'Dos puntos lo son respecto de una recta si esa recta hace de espejo entre los dos.',
        ejemplos: ['(3, 2) y (3, −2) son simétricos respecto del eje x.', '(3, 2) y (−3, 2), respecto del eje y.', 'La punta en el 1 y la punta en el 5 del reloj.'],
        ver: ['giros opuestos'] },
      // Idea 4
      { termino: 'cociente entero', formas: ['cociente entero'], simple: 'Cuántas veces cabe completo un número en otro.',
        def: 'En una división, cuántas veces entra completo el divisor en el dividendo.',
        ejemplos: ['En 1110 caben 3 veces 360: 3 · 360 = 1080.', 'En 750 caben 2 veces 360.', 'En 300 no cabe ninguna: el cociente entero es 0.'],
        ver: ['resto'] },
      { termino: 'resto', formas: ['resto', 'restos'], simple: 'Lo que sobra al repartir en partes iguales.',
        def: 'Lo que queda de una división entera: dividendo menos divisor por cociente entero.',
        ejemplos: ['1110 entre 360: resto 1110 − 1080 = 30.', '750 entre 360: resto 30.', '725 entre 360: resto 5.'],
        ver: ['cociente entero'] },
      // Idea 5
      { termino: 'cuarto de vuelta', formas: ['cuarto de vuelta', 'cuartos de vuelta'], simple: 'Un giro de 90°, como el del minutero de las 12 a las 3.',
        def: 'Giro de 90°, la cuarta parte de una vuelta. El punto (x, y) pasa a (−y, x).',
        ejemplos: ['(1, 0) gira un cuarto de vuelta y queda en (0, 1).', '(3, 4) queda en (−4, 3).', 'Tres cuartos de vuelta son 270°.'],
        ver: ['ventilador de techo'] },
      { termino: 'ventilador de techo', formas: ['ventilador de techo', 'ventilador'], simple: 'Aparato colgado del techo con aspas que giran para mover el aire.',
        def: 'Aparato colgado del techo, con aspas iguales repartidas alrededor de su eje.',
        ejemplos: ['Con cuatro aspas, cada una está a 90° de la siguiente.', 'Visto desde abajo, su eje es el origen.', 'Sus aspas giran sin que el eje se mueva.'],
        ver: ['cuarto de vuelta'] },
    ],
    laboratorio,
    historia: {
      texto: 'En el siglo XVI, Rheticus se propuso calcular tablas de las seis razones con muchas cifras, pero murió sin terminarlas; sus colaboradores siguieron el trabajo, y Valentin Otho publicó el Opus Palatinum. Calcular cada ángulo por separado era una tarea enorme. Las simetrías la acortan: si dos ángulos se relacionan, basta calcular uno, y reducir al primer cuadrante es usar esas simetrías.',
      pregunta: '¿Cuántos valores de seno necesitarías calcular para cubrir toda la vuelta?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Georg Joachim Rheticus», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Rheticus/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov).
    laboratorioIdeas: {
      'cualquier-giro': ['mayores-negativos', 'misma-razon'],
      'siete-relaciones': ['cofuncion', 'opuestos'],
    },
    ideas,
  };
});
