/*
 * Teoría de «Razonamiento deductivo y parentesco» (razonamiento-matematico.razonamiento-deductivo). Molde: docs/teoria.md
 * y docs/molde-unidad.md. Etapa 3 del plan de calidad (docs/plan-calidad.md §7), rehecha idea por idea con lo aprobado por
 * Gerson (docs/etapa3/propuesta-razonamiento-matematico.md, con todas las recomendaciones de su §9; manda
 * docs/etapa3/decisiones.md). Orden aprobado (17 nov): 1. doble-entrada «El cuadro que descarta» (aprobada en la mesa) ·
 * 2. dos-atributos «Pistas que cruzan dos listas» (nueva) · 3. conclusion-necesaria «Lo que vale en todo dibujo» ·
 * 4. si-entonces «Si llueve, la pista se moja» · 5. parentesco «Subir y bajar por el árbol». Los ids no cambian.
 * Público: 5.º de secundaria y preuniversitario. La práctica (generadores por idea) es la fase 5: todavía no.
 *
 * Paleta de deducción (decisión de Gerson, 17 nov; el equivalente de molde §5b en un curso sin magnitudes): un papel fijo
 * por color en toda la unidad, en la teoría, los ejemplos, la escena y la práctica.
 *   o naranja ... lo primero: el primer grupo (los quenistas, A), p en el condicional (la lluvia), quien habla en el árbol
 *   i turquesa .. lo segundo: el segundo grupo (la diablada, C), q en el condicional (la pista mojada)
 *   tinta ....... lo que amarra: personas, cosas, filas, columnas, pistas, el grupo del medio (la banda, B), la regla, la
 *                 cisterna, las líneas y el camino del árbol
 *   f violeta ... lo seguro y lo pedido: la ✓, la conclusión necesaria, el caso que queda solo, la persona pedida y la
 *                 respuesta (antes de comprobar, en tinta o «?»)
 *   gris ........ lo descartado: la ✗, el reparto, el dibujo o el caso tachado (tinta al 55 %, con su forma)
 *   sin verde ni carmín (naranja–verde y rojo–verde no se distinguen con protanopía y deuteranopía; el carmín es de los
 *   ángulos). Las piezas fijan esos papeles (rm-objeto, rm-aros, rm-casos y rm-familia exportan PAPELES), y
 *   razonamiento-deductivo.test.js falla si un papel cambia de color en cualquier figura o texto de la unidad: las ideas 1
 *   y 2 usan solo violeta; la 3, naranja para el primer grupo y turquesa para el segundo; la 4, naranja para p y turquesa
 *   para q; la 5, naranja para quien habla.
 * Letras y símbolos: ✓ seguro, ✗ imposible; «reparto» es una manera de cumplir todos los datos (en la idea 3 se llama
 * dibujo; en la 4, caso). A, B y C solo nombran grupos en la forma general de la idea 3 (regla); p y q, las dos partes de un
 * condicional, dichas en palabras la primera vez; sin ⇒, →, ~ ni ⊂ (son de aritmetica.logica-proposicional y conjuntos).
 * Las personas nunca se abrevian por su inicial. Las alternativas de los ejemplos tipo examen van en su propia línea
 * (campo alternativas, A a E; Gerson, mesa del 17 nov); la letra de la respuesta va en negrita violeta y las alternativas
 * descartadas se nombran por su texto.
 * Errores: códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis (no hay datos de alumnos): RMP61
 * responder un paso intermedio, RMP62 contar papeles como personas, RMP63 ignorar una pista, RMP64 cambiar el que sube por
 * el que baja, RMP70 tomar el condicional como si fuera también al revés, RMP71 negar las dos partes, RMP72 quedarse con
 * algo que choca con una pista, RMP73 leer «todos» al revés, RMP74 cambiar «algunos» y «ningún», RMP76 encadenar por un
 * grupo del medio que no amarra, RMP77 elegir lo posible y no lo necesario, RMP78 creer que no se deduce nada, RMP87
 * (nueva) agregarle a la regla algo que no dice.
 * Historia: Aristóteles (SEP). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), por idea:
 *   Promesa: saber qué es seguro con unas pistas, aunque no se sepa todo (1, 2); qué conclusión no puede fallar (3, 4);
 *     leer un parentesco desde «mi» (5).
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice qué es seguro y por qué (vale en todos los repartos, dibujos o casos que quedan).
 *   Orden de atención: 1.º el objeto y su cuadro, aros, tabla o árbol · 2.º lo que se tacha · acción: el control del juego.
 *   Duda que resuelve: «¿tengo que saberlo todo para asegurar algo?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  // Opciones de texto: la correcta y los distractores que no repiten texto (máximo 4 en total).
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (vistos.has(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }

  // ---------- Idea 1: el cuadro que descarta (etapa 3, 17 nov; docs/etapa3/propuesta-razonamiento-matematico.md) ----------
  // Objeto de la primera pantalla: tres amigos inscritos en el campeonato del aniversario del colegio (rm-objeto, escena
  // «campeonato», dibujo de prueba). Cambia: cuántas pistas se usan. · Permanece: los 6 repartos, alineados con las filas
  // del cuadro. · Progresa: los repartos tachados. · Se reserva: una ✓ que sale por columna (la predicción; el juego la da
  // por fila). · Debe verse: la ✓ aparece antes de saberlo todo, cuando todos los repartos que quedan coinciden.
  // Todo lo que se ve sale de contar repartos (perms, cumple, marcasDe): ningún ✓ ni ✗ se escribe a mano (regla 1).
  const OB = 'rm-objeto';
  const perms = k => {
    const out = [], ir = (pre, resto) => { if (!resto.length) { out.push(pre); return; } resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1)))); };
    ir([], Array.from({ length: k }, (_, i) => i));
    return out;
  };
  const PERM3 = perms(3);
  // Una pista prohíbe una casilla ({ q, c }: q no hace c) o la obliga ({ q, c, si: true }: q hace c).
  const cumple = (p, ps) => ps.every(x => (x.si ? p[x.q] === x.c : p[x.q] !== x.c));
  const quedanR = (k, ps) => perms(k).filter(p => cumple(p, ps));
  // ✓ si la casilla vale en todos los repartos que quedan; ✗ si en ninguno (la regla de la idea, contada).
  function marcasDe(k, ps) {
    const v = quedanR(k, ps), m = {};
    if (!v.length) return m;
    for (let q = 0; q < k; q++) for (let c = 0; c < k; c++) {
      const n = v.filter(p => p[q] === c).length;
      if (n === 0) m[`${q},${c}`] = 'no'; else if (n === v.length) m[`${q},${c}`] = 'si';
    }
    return m;
  }
  const segurosDe = (k, ps) => Object.entries(marcasDe(k, ps)).filter(([, x]) => x === 'si').map(([key]) => key.split(',').map(Number));
  const F = t => ({ v: 'c-f', t });   // lo seguro y lo pedido, en violeta (paleta de deducción)
  const O = t => ({ v: 'c-o', t }), I = t => ({ v: 'c-i', t });   // lo primero y lo segundo (ideas 3 a 5)
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const P3 = ['Ana', 'Beto', 'Ciro'], D3 = ['fútbol', 'vóley', 'ajedrez'], I3 = ['futbol', 'voley', 'ajedrez'];
  const R3 = 'Cada uno juega un solo deporte, y ningún deporte se repite.';
  const pista = (q, c, si) => ({ q, c, si, t: `${P3[q]}${si ? '' : ' no'} juega ${D3[c]}.` });
  // La figura del campeonato: la escena, el cuadro, los 6 repartos y las pistas. o.sinMarcas: el planteamiento (Predice).
  function campeonato(ps, o = {}) {
    const marcas = o.sinMarcas ? {} : marcasDe(3, ps);
    const ult = ps[ps.length - 1];
    if (o.nueva && ult && !ult.si && marcas[`${ult.q},${ult.c}`]) marcas[`${ult.q},${ult.c}`] = { m: 'no', nueva: true };
    return { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, marcas,
      repartos: PERM3.map(a => (o.sinMarcas || cumple(a, ps) ? { a } : { a, fuera: true })),
      pistas: ps.map((p, k) => ({ t: p.t, nueva: !!o.nueva && k === ps.length - 1 })), lineas: 3,
      manos: o.sinMarcas ? [] : segurosDe(3, ps).map(([f, c]) => ({ f, c })) };
  }
  // El juego: tres pistas, en este orden (propuesta aprobada, §3). La misión es encontrar con cuántas sale la primera ✓.
  const PJ = [pista(0, 1), pista(0, 2), pista(2, 1)];
  const PRIMERA = Array.from({ length: PJ.length + 1 }, (_, k) => k).find(k => segurosDe(3, PJ.slice(0, k)).length > 0);
  const quedanJ = n => quedanR(3, PJ.slice(0, n)).length;
  const segJ = segurosDe(3, PJ.slice(0, PRIMERA))[0];
  // La predicción: otras dos pistas; la ✓ sale por la columna del ajedrez (el juego la mostró por fila).
  const PP = [pista(0, 2), pista(1, 2)];
  const QP = quedanR(3, PP), SP = segurosDe(3, PP)[0];
  const quienJuega = (ps, c) => P3[segurosDe(3, ps).find(([, x]) => x === c)[0]];
  // Un caso posible pero no seguro de la predicción (RMP77): vale en un reparto de los que quedan y no en el otro.
  const POSIBLE_P = (() => { for (let q = 0; q < 3; q++) for (let c = 0; c < 3; c++) { const n = QP.filter(p => p[q] === c).length; if (n > 0 && n < QP.length) return [q, c]; } return null; })();
  const otroDe = (q, c) => QP.find(p => p[q] !== c)[q];
  // Mira: las marcas de la predicción, paso a paso (corte 1: las ✗ de las pistas; 2: repartos tachados; 3: la ✓;
  // 4: lo que esa ✓ tacha). Todo sale de marcasDe y cumple.
  const MIRA_P = (() => {
    const d = campeonato(PP), directas = new Set(PP.map(p => `${p.q},${p.c}`));
    d.marcas = Object.fromEntries(Object.entries(marcasDe(3, PP)).map(([k, x]) => [k, { m: x, desde: x === 'si' ? 3 : directas.has(k) ? 1 : 4 }]));
    d.repartos = PERM3.map(a => (cumple(a, PP) ? { a } : { a, fuera: 2 }));
    d.manos = segurosDe(3, PP).map(([f, c]) => ({ f, c, desde: 3 }));
    return d;
  })();

  // ---------- Contextos de «Así se resuelve» y «Ahora tú» (situaciones del colegio; los nombres no se abrevian) ----------
  // Cabeceras de 8 letras o menos: en un cuadro de 4 columnas caben a 14 px (prueba de la pieza).
  const CTX = [
    { cosas: ['fútbol', 'vóley', 'ajedrez', 'básquet'], hace: 'juega', ni: 'ni', que: p => `¿Qué juega ${p}?`, todo: '¿Quién juega qué?', intro: 'se inscribieron en el campeonato del colegio, cada uno en un deporte',
      regla: 'Cada uno juega un solo deporte, y ningún deporte se repite.' },
    { cosas: ['danza', 'teatro', 'dibujo', 'banda'], hace: 'está en', ni: 'ni en', que: p => `¿En qué taller está ${p}?`, todo: '¿Quién está en qué taller?', intro: 'están cada uno en un taller distinto del colegio',
      regla: 'Cada uno está en un solo taller, y ningún taller se repite.' },
    { cosas: ['tamales', 'jugos', 'choclo', 'queso'], hace: 'vende', ni: 'ni', que: p => `¿Qué vende ${p}?`, todo: '¿Quién vende qué?', intro: 'venden cada uno algo distinto en la kermés del aniversario',
      regla: 'Cada uno vende una sola cosa, y ninguna se repite.' },
    { cosas: ['adornos', 'música', 'juegos', 'limpieza'], hace: 'está en', ni: 'ni en', que: p => `¿En qué comisión está ${p}?`, todo: '¿Quién está en qué comisión?', intro: 'están cada uno en una comisión distinta del aniversario',
      regla: 'Cada uno está en una sola comisión, y ninguna se repite.' },
  ];
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo'];
  const REL = ['conversa con', 'almuerza con', 'estudia con', 'viaja con'];
  // Lector en frío, ronda 2: «si una pista nombra a dos personas» confundía cuando la pista nombra a tres.
  const D_DOS = 'Las personas que junta una pista son distintas: «Ana conversa con quien vende jugos» dice que Ana no vende jugos.';
  // Las líneas de pista posibles. Cada una dice qué casillas prohíbe u obliga (items) y cómo se lee (t).
  function lineaPista(r, ctx, ps, sol, tipo) {
    const k = ps.length, fal = [];
    for (let q = 0; q < k; q++) for (let c = 0; c < k; c++) if (sol[q] !== c) fal.push([q, c]);
    const [q, c] = r.elegir(fal), co = ctx.cosas;
    if (tipo === 'si') { const q2 = r.ent(0, k - 1); return { items: [{ q: q2, c: sol[q2], si: true }], t: `${ps[q2]} ${ctx.hace} ${co[sol[q2]]}.` }; }
    if (tipo === 'rel') return { items: [{ q, c }], t: `${ps[q]} ${r.elegir(REL)} quien ${ctx.hace} ${co[c]}.`, rel: true };
    if (tipo === 'dos') {
      // Dos ✗ en la misma fila («X no hace a ni b») o en la misma columna («Quien hace c … con X y con Y»).
      const misma = fal.filter(([a, b]) => a === q && b !== c), col = fal.filter(([a, b]) => b === c && a !== q);
      if (r() < 0.5 && misma.length) { const [, c2] = r.elegir(misma); return { items: [{ q, c }, { q, c: c2 }], t: `${ps[q]} no ${ctx.hace} ${co[c]} ${ctx.ni} ${co[c2]}.` }; }
      if (col.length) { const [q2] = r.elegir(col); return { items: [{ q, c }, { q: q2, c }], t: `Quien ${ctx.hace} ${co[c]} ${r.elegir(REL)} ${ps[q]} y con ${ps[q2]}.`, rel: true }; }
    }
    return { items: [{ q, c }], t: `${ps[q]} no ${ctx.hace} ${co[c]}.` };
  }
  const itemsDe = lineas => lineas.flatMap(l => l.items);
  // Resolver como se enseña: una fila o una columna con una sola casilla libre lleva la ✓, y la ✓ tacha su fila y su
  // columna. Devuelve las ✓ en el orden en que salen (con por qué: 'fila' o 'columna') y si llegó al reparto completo.
  function propagar(k, items) {
    const no = new Set(), si = new Map(), orden = [];
    const poner = (q, c, por) => { if (si.has(q)) return; si.set(q, c); orden.push({ q, c, por }); for (let x = 0; x < k; x++) { if (x !== c) no.add(`${q},${x}`); if (x !== q) no.add(`${x},${c}`); } };
    for (const it of items) if (!it.si) no.add(`${it.q},${it.c}`);
    for (const it of items) if (it.si) poner(it.q, it.c, 'pista');
    for (let vuelta = 0; vuelta < 3 * k; vuelta++) {
      let cambio = false;
      for (let q = 0; q < k; q++) { if (si.has(q)) continue; const libres = [...Array(k).keys()].filter(c => !no.has(`${q},${c}`)); if (libres.length === 1) { poner(q, libres[0], 'fila'); cambio = true; } }
      for (let c = 0; c < k; c++) { if ([...si.values()].includes(c)) continue; const libres = [...Array(k).keys()].filter(q => !no.has(`${q},${c}`)); if (libres.length === 1) { poner(libres[0], c, 'columna'); cambio = true; } }
      if (!cambio) break;
    }
    return { orden, completo: si.size === k };
  }
  // Arma un caso: personas, contexto, pistas (líneas), los repartos que quedan. o.quedan: 1 (reparto único que se
  // resuelve con filas y columnas) o 2; o.tipos: qué líneas se usan; o.max: tope de líneas (los datos llevan 6 o menos).
  function armar(r, o) {
    const k = o.k, ctx = o.ctx || r.elegir(CTX), ps = r.barajar(GENTE).slice(0, k);
    for (let intento = 0; intento < 400; intento++) {
      const sol = r.elegir(perms(k));
      let lineas = [];
      for (let j = 0; j < 12 && quedanR(k, itemsDe(lineas)).length > o.quedan; j++) lineas.push(lineaPista(r, ctx, ps, sol, r.elegir(o.tipos)));
      if (quedanR(k, itemsDe(lineas)).length !== o.quedan) continue;
      // Sin líneas que sobren: se quita cada una que no cambia lo que queda.
      for (let i = lineas.length - 1; i >= 0; i--) { const sin = lineas.slice(0, i).concat(lineas.slice(i + 1)); if (quedanR(k, itemsDe(sin)).length === o.quedan) lineas = sin; }
      if (lineas.length > o.max || lineas.length < 2) continue;
      if (o.quedan === 1 && !propagar(k, itemsDe(lineas)).completo) continue;
      if (o.conRel && !lineas.some(l => l.rel)) continue;
      if (o.conSi && !lineas.some(l => l.items.some(x => x.si))) continue;
      const q = quedanR(k, itemsDe(lineas));
      if (o.quedan === 2 && !segurosDe(k, itemsDe(lineas)).length) continue;
      return { k, ctx, ps, sol: q[0], lineas, items: itemsDe(lineas), quedan: q };
    }
    return null;
  }
  // Caso de respaldo (si el azar no arma uno): el de la predicción, con su contexto.
  const RESPALDO = { k: 3, ctx: CTX[0], ps: P3, lineas: [{ items: [{ q: 0, c: 2 }], t: 'Ana no juega ajedrez.' }, { items: [{ q: 1, c: 2 }], t: 'Beto no juega ajedrez.' }, { items: [{ q: 0, c: 1 }], t: 'Ana no juega vóley.' }] };
  function caso(r, o) {
    const c = armar(r, o) || Object.assign({}, RESPALDO, { items: itemsDe(RESPALDO.lineas) });
    c.quedan = quedanR(c.k, c.items); c.sol = c.quedan[0];
    return c;
  }
  const datosDe = c => [c.ctx.regla, ...(c.lineas.some(l => l.rel) ? [D_DOS] : []), ...c.lineas.map((l, i) => `Pista ${i + 1}: ${l.t}`)];
  const introDe = c => `${lista(c.ps)} ${c.ctx.intro}: ${lista(c.ctx.cosas.slice(0, c.k), 'o')}.`;
  const figCuadro = (c, marcas) => ({ datos: { filas: c.ps, columnas: c.ctx.cosas.slice(0, c.k), marcas: marcas || {} }, estado: {} });
  const hace = (c, q, x) => `${c.ps[q]} ${c.ctx.hace} ${c.ctx.cosas[x]}`;
  // Por qué no vale una casilla (q, x) que ningún reparto permite: la primera pista sin la cual sí cabría.
  function sinLaPista(c, q, x) {
    for (let i = 0; i < c.lineas.length; i++) {
      const otras = c.lineas.filter((_, j) => j !== i);
      if (quedanR(c.k, itemsDe(otras)).some(p => p[q] === x)) return i;
    }
    return -1;
  }
  function porQueNo(c, q, x) {
    const i = sinLaPista(c, q, x);
    return i >= 0 ? { error: 'RMP72', siFuera: `Valdría sin la pista ${i + 1}. Con todas, en ningún reparto ${hace(c, q, x)}.` }
      : { error: 'RMP63', siFuera: `Tendrías que saltarte dos pistas: con todas, en ningún reparto ${hace(c, q, x)}.` };
  }

  const ideaCuadro = {
    id: 'doble-entrada',
    titulo: 'El cuadro que descarta',
    pregunta: '¿Cuándo es segura una casilla del cuadro?',
    temas: ['Cuadros de doble entrada'],
    pieza: OB,
    aprendizaje: 'Una ✓ es segura cuando vale en todos los repartos que quedan; cada ✓ tacha el resto de su fila y de su columna.',
    actividad: 'Agregar pistas una a una y mirar qué repartos quedan en pie.',
    // Lee: el campeonato, qué es un reparto, el cuadro y sus dos marcas. No dice cuándo sale una ✓ (eso se descubre).
    lee: {
      tarjetas: [
        { titulo: 'El campeonato del aniversario', texto: 'Ana, Beto y Ciro se inscribieron en el campeonato del aniversario del colegio. Cada uno juega un deporte distinto: fútbol, vóley o ajedrez. Sus fichas de inscripción siguen en blanco: todavía no se sabe quién juega qué.',
          pieza: OB, dibujo: { datos: { escena: 'campeonato', cuadro: false, filas: P3, columnas: D3, iconos: I3 }, estado: {} } },
        { titulo: `${PERM3.length} repartos`, texto: `Un reparto dice quién juega qué: por ejemplo, Ana fútbol, Beto vóley y Ciro ajedrez. Sin pistas hay ${PERM3.length}: Ana puede tener 3 deportes; Beto, los 2 que quedan, y Ciro, el último. En el panel, cada columna es un reparto.`,
          ecuacion: [`3 × 2 × 1 = ${PERM3.length} repartos`],
          pieza: OB, dibujo: { datos: Object.assign(campeonato([]), { pistas: undefined }), estado: {} } },
        { titulo: 'El cuadro y sus marcas', texto: 'En el cuadro de doble entrada, las personas van en las filas y los deportes en las columnas. Cada casilla pregunta: ¿esta persona juega esto? ✗ quiere decir imposible; ✓, seguro. Una pista como «Ana no juega vóley» descarta los repartos donde Ana juega vóley.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a agregar las pistas una a una. Mira cuántos repartos quedan en pie después de cada una y en qué momento aparece la primera ✓.' },
      ],
    },
    juega: {
      pieza: OB,
      consigna: 'Ana, Beto y Ciro se inscribieron en el campeonato del colegio. Cada uno juega un deporte distinto: fútbol, vóley o ajedrez.',
      mision: {
        texto: 'Agrega pistas una a una: ¿con cuántas pistas aparece la primera ✓?',
        logrado: v => v.n === PRIMERA,
        bien: [`Con ${PRIMERA} pistas, antes de saberlo todo: ${P3[segJ[0]]} juega ${D3[segJ[1]]} en los ${quedanJ(PRIMERA)} repartos.`],
      },
      voz: 'Mira qué repartos quedan en pie con cada pista.',
      leyenda: [
        { s: F('✓'), t: 'seguro: coincide en todos los repartos que quedan' },
        { s: '✗', t: 'imposible: ningún reparto que queda lo tiene' },
        { s: 'Repartos', t: 'cada columna dice quién juega qué' },
        { s: 'gris tachado', t: 'reparto que una pista descarta' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: campeonato(PJ.slice(0, v.n), { nueva: true }), estado: {} }),
      // La lectura dice la relación: cuántos repartos quedan y si alguna casilla coincide en todos.
      lectura: v => {
        const ps = PJ.slice(0, v.n), q = quedanR(3, ps), seg = segurosDe(3, ps);
        if (q.length === 1) return [`Queda 1 reparto: ${P3.map((p, f) => `${p} ${D3[q[0][f]]}`).join(', ')}`];
        if (seg.length) return [`Quedan ${q.length} repartos; en ${q.length === 2 ? 'ambos' : 'todos'}, ${P3[seg[0][0]]} juega ${D3[seg[0][1]]}: `, F('✓ segura')];
        return [`${v.n ? PJ[v.n - 1].t.replace(/\.$/, '') : 'Sin pistas'}: ${q.length} repartos; ninguna casilla coincide en todos`];
      },
      minimo: PJ.length + 1,
    },
    predice: {
      pregunta: `Otras pistas para los mismos tres: ${PP[0].t.replace(/\.$/, '')} y ${PP[1].t.replace(/\.$/, '')}. ¿Qué es seguro?`,
      datos: [R3],
      voz: 'Revisa qué repartos quedan en pie con estas dos pistas.',
      opciones: [
        { id: 'c', texto: `${P3[SP[0]]} juega ${D3[SP[1]]}`, correcta: true },
        { id: 'nada', texto: `Nada todavía: ninguna pista habla de ${P3[SP[0]]}`, error: 'RMP78',
          siFuera: `Es cierto que ninguna lo nombra, pero la columna del ${D3[SP[1]]} le deja una sola casilla.` },
        { id: 'posible', texto: `${P3[POSIBLE_P[0]]} juega ${D3[POSIBLE_P[1]]}`, error: 'RMP77',
          siFuera: `Pasa en uno de los ${QP.length} repartos que quedan; en el otro, ${P3[POSIBLE_P[0]]} juega ${D3[otroDe(...POSIBLE_P)]}.` },
        { id: 'choca', texto: `${P3[SP[0]]} juega ${D3[0]}`, error: 'RMP72',
          siFuera: `Sin pistas sería posible; con estas dos, nadie podría jugar ${D3[SP[1]]}.` },
      ],
      // El planteamiento: las pistas y los 6 repartos, sin marcas ni tachados (no delata la columna).
      dibujo: { datos: campeonato(PP, { sinMarcas: true }), estado: {} },
      revelar: { datos: campeonato(PP), estado: {} },
      coincide: `Coincide: la columna del ${D3[SP[1]]} dejó una sola casilla libre, la de ${P3[SP[0]]}.`,
      noCoincide: `Revisemos: en los ${QP.length} repartos que quedan, el ${D3[SP[1]]} es de ${P3[SP[0]]}.`,
    },
    mira: {
      pieza: OB,
      datos: MIRA_P,
      voz: 'Primero tachan las pistas; después se mira qué coincide.',
      pasos: [
        { estado: { corte: 1 }, texto: `Cada pista pone una ✗ en la columna del ${D3[SP[1]]}.` },
        { estado: { corte: 2 }, texto: `Y descarta los repartos donde pasa lo que prohíbe: quedan ${QP.length} de ${PERM3.length}.`,
          ecuacion: [`${PERM3.length} − ${PERM3.length - QP.length} = ${QP.length} repartos`] },
        { estado: { corte: 3 }, texto: ['En los ', String(QP.length), ` que quedan, el ${D3[SP[1]]} es de ${P3[SP[0]]}: `, F('✓ segura'), '.'] },
        { estado: { corte: 4 }, texto: `Esa ✓ tacha el resto de la fila de ${P3[SP[0]]}: ni ${D3.filter((_, c) => c !== SP[1]).join(' ni ')}.` },
        { estado: { corte: 4 }, texto: `${lista(P3.filter((_, q) => q !== SP[0]))} se reparten ${lista(D3.filter((_, c) => c !== SP[1]))} de ${QP.length} maneras: ahí no hay ✓.` },
      ],
    },
    regla: {
      texto: 'Una casilla es segura (✓) si vale en todos los repartos que quedan; imposible (✗), si no vale en ninguno. Cada ✓ tacha el resto de su fila y columna.',
      ecuacion: [{ llave: [F('✓')], nota: 'seguro' }, ' si vale en todos los repartos', '   ·   ', { llave: ['✗'], nota: 'imposible' }, ' si no vale en ninguno'],
      // El ejemplo es del campeonato del dibujo (lector en frío, ronda 2: «almuerza» no tenía que ver con la figura).
      condicion: 'una ✓ por fila y columna. «Ana entrena con quien juega vóley» junta a dos personas distintas: ✗ en Ana y vóley.',
      voz: 'Una ✓ no espera a que se sepa todo.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_CUADRO)
    // Así se resuelve: el reparto completo, con la cadena de ✓ contada por propagar(). «Ahora tú» no pide el reparto
    // completo: pide qué hace una persona, qué es seguro o cuál afirmación es verdadera.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900), k = s % 3 === 2 ? 4 : 3;
        const c = caso(r, { k, quedan: 1, tipos: k === 4 ? ['no', 'no', 'dos', 'rel', 'si'] : ['no', 'no', 'rel'], max: 4 });
        const pr = propagar(c.k, c.items), co = c.ctx.cosas;
        const directas = Object.fromEntries(c.items.map(x => [`${x.q},${x.c}`, x.si ? 'si' : 'no']));
        const nX = c.items.filter(x => !x.si).length, nSi = c.items.filter(x => x.si).length;
        const cuenta = ({ q, c: x, por }) => (por === 'pista' ? `La pista da la ✓ de ${c.ps[q]} en ${co[x]}.` : por === 'fila' ? `En la fila de ${c.ps[q]} solo queda ${co[x]}: ✓.` : `En la columna de ${co[x]} solo queda ${c.ps[q]}: ✓.`);
        // La cadena entera de ✓, en dos pasos con su cuadro (auditoría M8, 17 nov: antes saltaba a «Las demás salen
        // igual»). Cada cuadro tiene las ✗ de las pistas y las ✓ puestas hasta ahí, con lo que cada ✓ tacha.
        const mitad = Math.ceil(pr.orden.length / 2);
        const hasta = n => {
          const m = {};
          for (const it of c.items) if (!it.si) m[`${it.q},${it.c}`] = 'no';
          for (const { q, c: x } of pr.orden.slice(0, n)) { for (let y = 0; y < c.k; y++) { m[`${q},${y}`] = 'no'; m[`${y},${x}`] = 'no'; } m[`${q},${x}`] = 'si'; }
          return m;
        };
        const repartoTxt = c.ps.map((p, q) => `${p} ${co[c.sol[q]]}`).join(', ');
        return {
          enunciado: `${introDe(c)} ${c.ctx.todo}`,
          datos: datosDe(c),
          dibujo: figCuadro(c),
          pasos: [
            { tipo: 'pide', texto: `Piden el reparto completo: ${c.ctx.todo.replace(/[¿?]/g, '').toLowerCase()}.` },
            { tipo: 'regla', texto: 'Si una fila o una columna queda con una sola casilla libre, ahí va la ✓: vale en todos los repartos. Cada ✓ tacha su fila y su columna.' },
            { tipo: 'aplica', texto: `Marco lo que dice cada pista${c.lineas.some(l => l.rel) ? ' (las personas que junta una pista son distintas)' : ''}: ${nX} ✗${nSi ? ` y ${nSi} ✓` : ''}.`, dibujo: figCuadro(c, directas) },
            { tipo: 'aplica', texto: pr.orden.slice(0, mitad).map(cuenta).join(' '), dibujo: figCuadro(c, hasta(mitad)) },
            { tipo: 'aplica', texto: `${pr.orden.slice(mitad).map(cuenta).join(' ')} Queda un solo reparto.`.trim(), ecuacion: [repartoTxt], dibujo: figCuadro(c, marcasDe(c.k, c.items)) },
            { tipo: 'sentido', texto: 'Compruebo cada pista con el reparto: ninguna se rompe y nadie repite.' },
          ],
          respuesta: [F(repartoTxt)],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 qué es seguro con dos repartos en pie; 1 qué hace una persona (3 × 3, cadena);
    // 2 qué hace una persona (4 × 4, con una ✓ en la pista o una pista de dos personas); 3 nivel examen (4 × 4, «¿cuál es
    // necesariamente verdadera?», como los cuadros de San Marcos). Las ✓, las ✗ y cada opción salen de contar repartos.
    ahoraTu: {
      pieza: OB,
      voz: 'Marca las ✗ en tu cuadro y busca la fila o columna con una sola casilla.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const c = caso(r, { k: r() < 0.5 ? 3 : 4, quedan: 2, tipos: ['no', 'no', 'dos', 'rel'], max: 4 });
          const seg = segurosDe(c.k, c.items), [q, x] = r.elegir(seg), co = c.ctx.cosas;
          const ops = [{ id: 'c', texto: hace(c, q, x), correcta: true },
            { id: 'nada', texto: 'Nada todavía: faltan pistas', error: 'RMP78', siFuera: `Faltan para saberlo todo, pero en los ${c.quedan.length} repartos que quedan, ${hace(c, q, x)}.` }];
          const posibles = [], imposibles = [];
          for (let a = 0; a < c.k; a++) for (let b = 0; b < c.k; b++) { const n = c.quedan.filter(p => p[a] === b).length; if (n > 0 && n < c.quedan.length) posibles.push([a, b]); else if (n === 0 && a !== q) imposibles.push([a, b]); }
          if (posibles.length) { const [a, b] = r.elegir(posibles); ops.push({ id: 'posible', texto: hace(c, a, b), error: 'RMP77', siFuera: `Pasa en uno de los ${c.quedan.length} repartos que quedan; en el otro, ${hace(c, a, c.quedan.find(p => p[a] !== b)[a])}.` }); }
          if (imposibles.length) { const [a, b] = r.elegir(imposibles); ops.push(Object.assign({ id: 'choca', texto: hace(c, a, b) }, porQueNo(c, a, b))); }
          return { pregunta: `${introDe(c)} ¿Qué es seguro?`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
            // Se nombran todas las ✓, no solo la de la correcta (auditoría A3: a veces hay más de una).
            solucion: { texto: `Quedan ${c.quedan.length} repartos y en los dos, ${hace(c, q, x)}.${seg.length > 1 ? ` También es seguro: ${lista(seg.filter(([a]) => a !== q).map(([a, b]) => `${c.ps[a]} ${co[b]}`))}.` : ''}`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
        }
        if (tipo === 1 || tipo === 2) {
          const k = tipo === 1 ? 3 : 4;
          const c = caso(r, { k, quedan: 1, tipos: k === 3 ? ['no', 'no', 'rel'] : ['no', 'dos', 'rel', 'si'], max: 4, conRel: k === 4 });
          // Se pregunta por la persona cuya ✓ sale al final de la cadena (no la da ninguna pista sola).
          const pr = propagar(c.k, c.items), ult = pr.orden[pr.orden.length - 1], q = ult.q, co = c.ctx.cosas.slice(0, c.k);
          const ops = co.map((t, x) => (x === c.sol[q] ? { id: 'c', texto: t, correcta: true } : Object.assign({ id: `x${x}`, texto: t }, porQueNo(c, q, x))));
          ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero cada ✓ tacha su fila y su columna, y al final queda una casilla.' });
          return { pregunta: `${introDe(c)} ${c.ctx.que(c.ps[q])}`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
            solucion: { texto: `Con las ✗ y las ✓ que tachan, a ${c.ps[q]} le queda una sola casilla: ${co[c.sol[q]]}.`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
        }
        // Nivel examen: «¿Cuál es necesariamente verdadera?» con uno o dos repartos en pie.
        const quedan = 1 + (Math.floor(s / 4) % 2);
        const c = caso(r, { k: 4, quedan, tipos: ['no', 'dos', 'rel', 'rel'], max: 4, conRel: true });
        const seg = segurosDe(c.k, c.items), [q, x] = r.elegir(seg);
        const ops = [{ id: 'c', texto: hace(c, q, x), correcta: true }], usados = new Set([q]);
        const posibles = [], imposibles = [];
        for (let a = 0; a < c.k; a++) for (let b = 0; b < c.k; b++) { const n = c.quedan.filter(p => p[a] === b).length; if (n > 0 && n < c.quedan.length) posibles.push([a, b]); else if (n === 0) imposibles.push([a, b]); }
        if (posibles.length) { const [a, b] = r.elegir(posibles); usados.add(a); ops.push({ id: 'posible', texto: hace(c, a, b), error: 'RMP77', siFuera: `Pasa en uno de los ${c.quedan.length} repartos que quedan, no en los dos.` }); }
        for (const [a, b] of r.barajar(imposibles)) {
          if (ops.length >= 4 || usados.has(a)) continue;
          usados.add(a); ops.push(Object.assign({ id: `x${a}${b}`, texto: hace(c, a, b) }, porQueNo(c, a, b)));
        }
        return { pregunta: `${introDe(c)} ¿Cuál es necesariamente verdadera?`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
          solucion: { texto: `${quedan === 1 ? 'Queda un solo reparto' : 'Quedan 2 repartos'}, y en ${quedan === 1 ? 'él' : 'los dos'} ${hace(c, q, x)}.`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «El cuadro que descarta» (pestaña «Ejemplos»; molde §3) ----------
  // Cada uno se resolvió aparte con un script que no usa el código de la unidad (scratchpad e3-rm/ejemplos.py): prueba
  // todos los repartos y comprueba que lo que se pregunta tiene una sola respuesta (1 y 2: Beto vóley e Iván teatro con 2
  // repartos en pie; 3: 4 casillas tachadas; 4: quedan 4 de 6, se tachan el 2 y el 5; 5: 2 repartos, Gino cambia y Sara
  // adornos; 6, 7, 9, 10, 11, 12 y 14: un solo reparto; 8: 2 repartos, seguros Dina y Ana; 13: 2 repartos y solo la E vale
  // en los dos; 15: 2 repartos y la música es de Pía en los dos). También rehace el juego (6 → 4 → 2 → 1, primera ✓ con 2
  // pistas) y la predicción (Ciro ajedrez). La figura es el planteamiento: el cuadro sin marcas, nunca la respuesta.
  // Las pistas van en los datos, una por línea (contrato, punto 13); la respuesta, en violeta, con la letra en negrita.
  // Las alternativas de nivel 3 van en su propia línea (campo alternativas; Gerson, mesa del 17 nov: no pegadas al enunciado).
  const T3 = ['danza', 'teatro', 'dibujo'], K3 = ['picarones', 'emoliente', 'choclo'], C3 = ['adornos', 'música', 'juegos'];
  const R_TALLER = 'Cada uno está en un solo taller, y ningún taller se repite.', R_KERMES = 'Cada uno vende una sola cosa, y ninguna se repite.';
  const R_COMISION = 'Cada uno está en una sola comisión, y ninguna se repite.';
  // El dibujo de cada ejemplo (lector en frío, ronda 2, 18 nov: «el resuelto habla de ✓ y ✗, y el cuadro está vacío»):
  // el cuadro con lo que cada pista marca por sí sola, la primera línea del resuelto. No trae lo que sale de juntar pistas
  // (la ✓ que se deduce, lo que tacha una ✓, los repartos tachados): eso es la respuesta, y el molde (§3) la deja fuera
  // de la figura. Si lo que se pregunta es justo dónde va una marca, el cuadro va sin marcas. Las marcas se dan por
  // nombre: X('Beto', 'fútbol', 'ajedrez') son dos ✗ en la fila de Beto; S('Maru', 'emoliente'), una ✓ que da la pista.
  const X = (p, ...cs) => cs.map(c => [p, c, false]), S = (p, c) => [[p, c, true]];
  const marcasN = (filas, columnas, ms) => Object.fromEntries(ms.flat().map(([p, c, si]) => {
    const f = filas.indexOf(p), k = columnas.indexOf(c);
    if (f < 0 || k < 0) throw new Error(`marca sin casilla: ${p} y ${c}`);
    return [`${f},${k}`, si ? 'si' : 'no'];
  }));
  const figC = (filas, columnas, ...ms) => ({ pieza: OB, datos: { filas, columnas, marcas: marcasN(filas, columnas, ms) }, estado: {} });
  const figCamp = (...ms) => ({ pieza: OB, datos: { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, marcas: marcasN(P3, D3, ms) }, estado: {} });
  const PIS = (...xs) => xs.map((t, i) => `Pista ${i + 1}: ${t}`);
  // Ejemplo 4: los repartos del panel en los que Ciro juega vóley (se cuentan con PERM3, el mismo orden del dibujo).
  const CON_CIRO_VOLEY = PERM3.map((p, i) => [p, i + 1]).filter(([p]) => p[2] === 1).map(([, i]) => i);
  const EJEMPLOS_CUADRO = [
    { nivel: 1, titulo: 'La ficha de Beto', figura: figCamp(X('Beto', 'fútbol', 'ajedrez')),
      enunciado: 'Ana, Beto y Ciro se inscribieron en el campeonato: cada uno juega fútbol, vóley o ajedrez, sin repetir. ¿Qué juega Beto?',
      datos: [R3, ...PIS('Beto no juega fútbol.', 'Beto no juega ajedrez.')],
      solucion: [
        { texto: 'Las dos pistas caen en la fila de Beto: ✗ en fútbol y ✗ en ajedrez.' },
        { texto: ['A Beto le queda una sola casilla, vóley. En todos los repartos que quedan, Beto juega vóley: ', F('✓'), '.'] },
      ],
      respuesta: [F('Beto juega vóley')] },
    { nivel: 1, titulo: 'La columna del teatro', figura: figC(['Rosa', 'Iván', 'Nora'], T3, X('Rosa', 'teatro'), X('Nora', 'teatro')),
      enunciado: 'Rosa, Iván y Nora están cada uno en un taller distinto del colegio: danza, teatro o dibujo. ¿Quién está en teatro?',
      datos: [R_TALLER, ...PIS('Rosa no está en teatro.', 'Nora no está en teatro.')],
      solucion: [
        { texto: 'Las dos pistas caen en la columna de teatro: ✗ para Rosa y ✗ para Nora.' },
        { texto: ['En esa columna queda una sola casilla libre, la de Iván. Alguien tiene que estar en teatro: es Iván, ', F('✓'), '.'] },
      ],
      respuesta: [F('Iván está en teatro')] },
    { nivel: 1, titulo: 'Una pista que dice sí', figura: figC(['Lucho', 'Maru', 'Teo'], K3, S('Maru', 'emoliente')),
      enunciado: 'En la kermés del aniversario, Lucho, Maru y Teo venden cada uno algo distinto: picarones, emoliente o choclo. Si solo se sabe la pista de abajo, ¿cuántas casillas se tachan?',
      datos: [R_KERMES, 'Pista: Maru vende emoliente.'],
      solucion: [
        { texto: ['La pista pone una ', F('✓'), ' en Maru y emoliente: es seguro.'] },
        { texto: 'Maru no vende nada más: ✗ en picarones y en choclo. Nadie más vende emoliente: ✗ para Lucho y para Teo.' },
      ],
      respuesta: [F('4 casillas'), ': 2 en la fila de Maru y 2 de emoliente'] },
    { nivel: 1, titulo: '¿Cuántos repartos quedan?', figura: { pieza: OB, datos: Object.assign(campeonato([]), { pistas: undefined, marcas: marcasN(P3, D3, [X('Ciro', 'vóley')]) }), estado: {} },
      enunciado: 'Ana, Beto y Ciro juegan cada uno fútbol, vóley o ajedrez, sin repetir. Se sabe que Ciro no juega vóley. ¿Cuántos repartos quedan?',
      datos: [R3, `Sin pistas hay ${PERM3.length} repartos: los ${PERM3.length} del panel.`],
      solucion: [
        { texto: `En ${CON_CIRO_VOLEY.length} de los ${PERM3.length} repartos del panel, Ciro juega vóley: el ${lista(CON_CIRO_VOLEY.map(String), 'y el')}.` },
        { texto: 'La pista descarta esos repartos; los demás la cumplen.', ecuacion: [`${PERM3.length} − ${CON_CIRO_VOLEY.length} = `, F(String(PERM3.length - CON_CIRO_VOLEY.length))] },
      ],
      respuesta: [F(`Quedan ${PERM3.length - CON_CIRO_VOLEY.length} repartos`)] },
    { nivel: 1, titulo: '¿Seguro o solo posible?', figura: figC(['Sara', 'Gino', 'Pía'], C3, X('Sara', 'música', 'juegos')),
      enunciado: 'Sara, Gino y Pía están cada uno en una comisión distinta del aniversario: adornos, música o juegos. Gino dice: «Yo estoy en música, seguro». ¿Es seguro?',
      datos: [R_COMISION, ...PIS('Sara no está en música.', 'Sara no está en juegos.')],
      solucion: [
        { texto: ['A Sara solo le queda adornos: ', F('✓'), '.'] },
        { texto: 'Gino y Pía se reparten música y juegos. Quedan 2 repartos: en uno Gino está en música; en el otro, en juegos.' },
        { texto: 'Lo de Gino es posible, pero no seguro: no vale en los dos repartos.' },
      ],
      respuesta: [F('No es seguro'), ': solo es seguro que Sara está en adornos'] },
    { nivel: 2, titulo: 'Una ✓ que tacha', figura: figCamp(X('Ana', 'fútbol'), X('Beto', 'fútbol', 'vóley')),
      enunciado: 'Ana, Beto y Ciro juegan cada uno fútbol, vóley o ajedrez en el campeonato, sin repetir. ¿Quién juega qué?',
      datos: [R3, ...PIS('Ana no juega fútbol.', 'Beto no juega fútbol.', 'Beto no juega vóley.')],
      solucion: [
        { texto: ['En la columna de fútbol solo queda Ciro: ', F('✓'), '. Esa ✓ tacha el resto de la fila de Ciro.'] },
        { texto: ['En la fila de Beto ya hay ✗ en fútbol y en vóley: le queda ajedrez, ', F('✓'), '.'] },
        { texto: 'A Ana le queda lo único libre de su fila: vóley.' },
      ],
      respuesta: [F('Ana vóley, Beto ajedrez, Ciro fútbol')] },
    { nivel: 2, titulo: 'De la columna a la fila', figura: figC(['Rosa', 'Iván', 'Nora'], T3, X('Iván', 'dibujo', 'teatro'), X('Nora', 'dibujo')),
      enunciado: 'Rosa, Iván y Nora están cada uno en un taller distinto: danza, teatro o dibujo. ¿En qué taller está Nora?',
      datos: [R_TALLER, ...PIS('Iván no está en dibujo.', 'Nora no está en dibujo.', 'Iván no está en teatro.')],
      solucion: [
        { texto: ['En la columna de dibujo solo queda Rosa: ', F('✓'), '. Esa ✓ tacha el resto de la fila de Rosa.'] },
        { texto: ['A Iván le quedan danza y teatro, y la pista 3 tacha teatro: Iván está en danza, ', F('✓'), '.'] },
        { texto: 'Esa ✓ tacha danza para Nora. A Nora le queda una sola casilla: teatro.' },
      ],
      respuesta: [F('Nora está en teatro')] },
    { nivel: 2, titulo: 'Cuatro amigos: ¿qué es seguro?', figura: figC(['Ana', 'Beto', 'Ciro', 'Dina'], CTX[0].cosas, S('Dina', 'básquet'), X('Ana', 'vóley', 'ajedrez')),
      enunciado: 'Ana, Beto, Ciro y Dina juegan cada uno fútbol, vóley, ajedrez o básquet, sin repetir. ¿Qué es seguro y qué no?',
      datos: [R3, ...PIS('Dina juega básquet.', 'Ana no juega vóley.', 'Ana no juega ajedrez.')],
      solucion: [
        { texto: ['La pista 1 es una ', F('✓'), ': tacha el resto de la fila de Dina y de la columna de básquet.'] },
        { texto: ['A Ana le quedan fútbol, vóley y ajedrez; las pistas 2 y 3 tachan dos: Ana juega fútbol, ', F('✓'), '.'] },
        { texto: ['Beto y Ciro se reparten vóley y ajedrez de 2 maneras: en esas casillas no hay ninguna ', F('✓'), ' segura.'] },
      ],
      respuesta: [F('Seguro: Dina básquet y Ana fútbol'), '; Beto y Ciro se reparten vóley y ajedrez'] },
    { nivel: 2, titulo: 'Quien conversa no es', figura: figC(['Lucho', 'Maru', 'Teo'], K3, X('Lucho', 'emoliente'), X('Teo', 'emoliente', 'picarones')),
      enunciado: 'En la kermés, Lucho, Maru y Teo venden cada uno algo distinto: picarones, emoliente o choclo. ¿Qué vende Lucho?',
      datos: [R_KERMES, D_DOS, ...PIS('Lucho conversa con quien vende emoliente.', 'Teo no vende emoliente.', 'Quien vende picarones es primo de Teo.')],
      solucion: [
        { texto: 'Las pistas 1 y 3 juntan a personas distintas: Lucho no vende emoliente, y Teo no vende picarones.' },
        { texto: ['En la columna de emoliente solo queda Maru: ', F('✓'), '. A Teo, con dos ✗, le queda choclo: ', F('✓'), '.'] },
        { texto: 'A Lucho le queda la única casilla libre de su fila: picarones.' },
      ],
      respuesta: [F('Lucho vende picarones')] },
    { nivel: 2, titulo: 'Una ✓ que viene en la pista', figura: figC(['Rosa', 'Iván', 'Nora', 'Leo'], CTX[1].cosas, X('Rosa', 'teatro', 'danza'), X('Iván', 'teatro'), S('Leo', 'banda')),
      enunciado: 'Rosa, Iván, Nora y Leo están cada uno en un taller distinto: danza, teatro, dibujo o banda. ¿Quién está en teatro?',
      datos: [R_TALLER, ...PIS('Ni Rosa ni Iván están en teatro.', 'Leo está en banda.', 'Rosa no está en danza.')],
      solucion: [
        { texto: 'La pista 1 pone dos ✗ en la columna de teatro: Rosa e Iván.' },
        { texto: ['La pista 2 es una ', F('✓'), ' para Leo y tacha el resto de su fila: Leo no está en teatro.'] },
        { texto: ['En la columna de teatro solo queda Nora: ', F('✓'), '. La pista 3 sirve para el resto del cuadro.'] },
      ],
      respuesta: [F('Nora está en teatro')] },
    { nivel: 3, titulo: 'Las cuatro de la posta', figura: figC(['Carla', 'Delia', 'Elsa', 'Flor'], ['médica', 'obstetra', 'dentista', 'técnica'], X('Carla', 'médica', 'dentista'), X('Delia', 'médica', 'dentista', 'obstetra'), X('Elsa', 'dentista')),
      enunciado: 'Carla, Delia, Elsa y Flor trabajan en la posta de salud: una es médica; otra, obstetra; otra, dentista, y otra, técnica. ¿Qué es Carla?',
      alternativas: ['médica', 'dentista', 'obstetra', 'técnica', 'no se puede saber'],
      datos: ['Cada una tiene una sola profesión, y ninguna se repite.', D_DOS, ...PIS('La médica almuerza con Carla y con Delia.', 'Delia vive con la dentista y es hermana de la obstetra.', 'La dentista se turna con Carla y con Elsa.')],
      solucion: [
        { texto: 'Cada pista junta a personas distintas. Pista 1: ✗ médica para Carla y Delia. Pista 2: ✗ dentista y obstetra para Delia. Pista 3: ✗ dentista para Carla y Elsa.' },
        { texto: ['A Delia solo le queda técnica: ', F('✓'), '. En la columna de dentista solo queda Flor: ', F('✓'), '.'] },
        { texto: ['A Carla, con médica y dentista tachadas y técnica tomada, le queda obstetra: ', F('✓'), '.'] },
      ],
      respuesta: [F('C'), ': Carla es obstetra'] },
    { nivel: 3, titulo: 'Papás e hijas', figura: figC(['Raúl', 'Saúl', 'Tito', 'Uriel'], ['Gaby', 'Hilda', 'Inés', 'Julia'], X('Raúl', 'Gaby', 'Inés', 'Hilda'), X('Saúl', 'Gaby', 'Inés'), X('Tito', 'Gaby'), X('Uriel', 'Hilda')),
      enunciado: 'Raúl, Saúl, Tito y Uriel son los papás de Gaby, Hilda, Inés y Julia, una hija cada uno. ¿Quién es el papá de Julia?',
      alternativas: ['Saúl', 'Tito', 'Uriel', 'Raúl', 'no se puede saber'],
      datos: ['Cada papá tiene una sola hija, y ninguna se repite.', ...PIS('Gaby no es hija de Raúl ni de Saúl.', 'Inés no es hija de Raúl ni de Saúl.', 'El papá de Hilda es Saúl o Tito.', 'Tito no es el papá de Gaby.')],
      solucion: [
        { texto: ['Gaby: las pistas 1 y 4 tachan a Raúl, Saúl y Tito. Su papá es Uriel: ', F('✓'), '.'] },
        { texto: ['Inés: la pista 2 tacha a Raúl y a Saúl, y Uriel ya está tomado. Su papá es Tito: ', F('✓'), '.'] },
        { texto: 'Hilda: Saúl o Tito, y Tito ya está tomado: Saúl. A Julia le queda Raúl.' },
        { texto: 'Ninguna pista nombra a Julia, pero las otras tres casillas de su columna quedaron tachadas: sí se sabe.' },
      ],
      respuesta: [F('D'), ': Raúl es el papá de Julia'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: figC(['Ana', 'Beto', 'Ciro', 'Dina'], CTX[0].cosas, X('Ana', 'vóley'), X('Beto', 'ajedrez', 'fútbol'), X('Dina', 'ajedrez', 'fútbol'), X('Ciro', 'fútbol', 'básquet')),
      enunciado: 'Ana, Beto, Ciro y Dina juegan cada uno fútbol, vóley, ajedrez o básquet, sin repetir. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Beto juega vóley', 'Dina juega básquet', 'Ana juega vóley', 'Dina juega fútbol', 'Ciro juega ajedrez'],
      datos: ['Cada uno juega un solo deporte; las personas que junta una pista son distintas.', 'Fútbol, vóley y básquet se juegan con pelota; el ajedrez, no.',
        ...PIS('Ana y quien juega vóley son vecinos.', 'Beto y Dina juegan con pelota.', 'Ciro no juega fútbol ni básquet.', 'Quien juega fútbol entrena con Beto y con Dina.')],
      solucion: [
        { texto: 'Las pistas tachan: vóley para Ana; ajedrez para Beto y Dina; fútbol y básquet para Ciro; fútbol para Beto y Dina.' },
        { texto: ['En la columna de fútbol solo queda Ana: ', F('✓'), '. En la de ajedrez, solo Ciro: ', F('✓'), '.'] },
        { texto: 'Beto y Dina se reparten vóley y básquet de 2 maneras: «Beto juega vóley» es posible, pero no seguro.' },
      ],
      respuesta: [F('E'), ': Ciro juega ajedrez'] },
    { nivel: 3, titulo: 'Los puestos de la kermés', figura: figC(['Lucho', 'Maru', 'Teo', 'Vilma'], CTX[2].cosas, X('Lucho', 'jugos', 'choclo', 'tamales'), X('Teo', 'jugos', 'choclo'), X('Maru', 'jugos', 'queso')),
      enunciado: 'En la kermés, Lucho, Maru, Teo y Vilma venden cada uno algo distinto: tamales, jugos, choclo o queso. ¿Qué vende Maru?',
      alternativas: ['jugos', 'choclo', 'tamales', 'queso', 'no se puede saber'],
      datos: [R_KERMES, D_DOS, ...PIS('Quien vende jugos le presta su olla a Lucho y a Teo.', 'Maru no vende jugos ni queso.', 'Teo y Lucho le compran choclo a la misma persona.', 'Lucho no vende tamales.')],
      solucion: [
        { texto: 'La pista 1 junta a tres personas distintas: quien vende jugos no es Lucho ni Teo. La 3, igual con el choclo. ✗ jugos y ✗ choclo para Lucho y para Teo.' },
        { texto: ['En la columna de jugos solo queda Vilma (la pista 2 tacha a Maru): ', F('✓'), ' Vilma, jugos.'] },
        { texto: ['A Lucho le quedan tamales y queso; la pista 4 tacha tamales: queso, ', F('✓'), '.'] },
        { texto: ['Teo no vende jugos ni choclo, y el queso es de Lucho: Teo vende tamales. A Maru le queda choclo, ', F('✓'), '.'] },
      ],
      respuesta: [F('B'), ': Maru vende choclo'] },
    { nivel: 3, titulo: 'Las comisiones del aniversario', figura: figC(['Sara', 'Gino', 'Pía', 'Omar'], CTX[3].cosas, X('Sara', 'adornos', 'música'), X('Gino', 'adornos', 'música'), X('Omar', 'música')),
      enunciado: 'Sara, Gino, Pía y Omar están cada uno en una comisión distinta: adornos, música, juegos o limpieza. ¿Quién está en música?',
      alternativas: ['Pía', 'Sara', 'Gino', 'Omar', 'no se puede saber'],
      datos: [R_COMISION, D_DOS, ...PIS('Sara está en juegos o en limpieza.', 'Gino también está en juegos o en limpieza.', 'Quien está en música le presta parlantes a Omar.')],
      solucion: [
        { texto: 'Las pistas 1 y 2 tachan adornos y música para Sara y Gino. Entre los dos ocupan juegos y limpieza: esas columnas quedan tachadas para Pía y Omar.' },
        { texto: 'La pista 3 tacha música para Omar.' },
        { texto: ['En la columna de música solo queda Pía: ', F('✓'), '. De Sara y Gino no se sabe cuál es cuál, pero no hace falta.'] },
      ],
      respuesta: [F('A'), ': Pía está en música'] },
  ];
  ideaCuadro.ejemplos = EJEMPLOS_CUADRO;

  // ---------- Idea 2: pistas que cruzan dos listas (etapa 3, 17 nov; docs/etapa3/propuesta-razonamiento-matematico.md) ----------
  // Objeto de la primera pantalla: los tres músicos de la comparsa del colegio bajan de la combi, con la quena, el charango
  // y el bombo en la parrilla del techo (rm-objeto, escena «comparsa», dibujo de prueba). Cambia: cuántas pistas se usan. ·
  // Permanece: el cuadro en L (personas e instrumentos, personas y ciudades, ciudades e instrumentos). · Progresa: las ✓ y
  // ✗ que pasan de un cuadro a otro. · Se reserva: una pista de ciudad que decide un instrumento (la predicción). · Debe
  // verse: la pista que no nombra a nadie cae en el cuadro de abajo y desde ahí tacha una casilla de una persona.
  // Todo sale de contar repartos (repsL, cumpleL, marcasL): ningún ✓ ni ✗ se escribe a mano (regla 1).
  const permsCache = {};
  const permsDe = k => permsCache[k] || (permsCache[k] = perms(k));
  // Un reparto con m listas: rep[L][q] = el item de la lista L que tiene la persona q.
  const repCache = {};
  function repsL(k, m) {
    const key = `${k},${m}`;
    if (!repCache[key]) { let out = [[]]; for (let L = 0; L < m; L++) out = out.flatMap(r => permsDe(k).map(p => r.concat([p]))); repCache[key] = out; }
    return repCache[key];
  }
  // Una entidad es 'p:q' (la persona q) o 'L:j' (quien tiene el item j de la lista L). Una pista dice si dos entidades son
  // o no la misma persona: { a, b, si }.
  const dueno = (rep, e) => { const [g, i] = e.split(':'); return g === 'p' ? +i : rep[+g].indexOf(+i); };
  const cumpleL = (rep, ps) => ps.every(x => (dueno(rep, x.a) === dueno(rep, x.b)) === !!x.si);
  const quedanL = (k, m, ps, base) => (base || repsL(k, m)).filter(r => cumpleL(r, ps));
  // La clave de una casilla del cuadro en L (el mismo orden que rm-objeto.clave: la persona en la fila; entre dos listas,
  // la de número mayor en la fila).
  const claveL = (a, b) => { const ga = a.split(':')[0], gb = b.split(':')[0]; return gb === 'p' || (ga !== 'p' && +gb > +ga) ? `${b}|${a}` : `${a}|${b}`; };
  const gruposL = m => ['p', ...Array.from({ length: m }, (_, L) => String(L))];
  function paresL(k, m) {
    const g = gruposL(m), out = [];
    for (let A = 0; A < g.length; A++) for (let B = A + 1; B < g.length; B++) for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) out.push([`${g[A]}:${i}`, `${g[B]}:${j}`]);
    return out;
  }
  // ✓ si dos entidades son la misma persona en todos los repartos que quedan; ✗ si en ninguno.
  function marcasL(k, m, q) {
    const out = {};
    if (!q.length) return out;
    for (const [a, b] of paresL(k, m)) { const n = q.filter(r => dueno(r, a) === dueno(r, b)).length; if (n === 0) out[claveL(a, b)] = 'no'; else if (n === q.length) out[claveL(a, b)] = 'si'; }
    return out;
  }
  // Resolver como se enseña: en cada cuadro, una fila o columna con una sola casilla libre lleva la ✓ y la ✓ tacha su fila
  // y su columna; y lo que se sabe de una cosa pasa a su dueño (si x y y son la misma persona, x y z valen lo que y y z).
  // Devuelve lo que se fue sabiendo, en orden, con su porqué ('pista', 'fila', 'columna', 'tacha' o 'cruce' con via).
  function propagarL(k, m, ps) {
    const st = new Map(), orden = [], G = gruposL(m);
    const poner = (a, b, v, por, via) => { const key = claveL(a, b); if (st.has(key)) return false; st.set(key, v); orden.push({ a, b, v, por, via }); return true; };
    for (const x of ps) poner(x.a, x.b, x.si ? 'si' : 'no', 'pista');
    for (let vuelta = 0, cambio = true; cambio && vuelta < 80; vuelta++) {
      cambio = false;
      for (let A = 0; A < G.length; A++) for (let B = A + 1; B < G.length; B++) for (const [X, Y, por] of [[G[A], G[B], 'fila'], [G[B], G[A], 'columna']]) for (let i = 0; i < k; i++) {
        const ea = `${X}:${i}`, celdas = Array.from({ length: k }, (_, j) => `${Y}:${j}`);
        const si = celdas.find(eb => st.get(claveL(ea, eb)) === 'si');
        if (si) { for (const eb of celdas) if (eb !== si && poner(ea, eb, 'no', 'tacha')) cambio = true; }
        else { const libres = celdas.filter(eb => st.get(claveL(ea, eb)) !== 'no'); if (libres.length === 1 && poner(ea, libres[0], 'si', por)) cambio = true; }
      }
      for (const [key, v] of [...st]) {
        if (v !== 'si') continue;
        const [x, y] = key.split('|');
        for (const J of G) {
          if (J === x.split(':')[0] || J === y.split(':')[0]) continue;
          for (let j = 0; j < k; j++) for (const [u, w] of [[x, y], [y, x]]) { const s2 = st.get(claveL(w, `${J}:${j}`)); if (s2 && poner(u, `${J}:${j}`, s2, 'cruce', w)) cambio = true; }
        }
      }
    }
    const completo = Array.from({ length: k }, (_, q) => G.slice(1).every(L => Array.from({ length: k }, (_, j) => st.get(claveL(`p:${q}`, `${L}:${j}`))).includes('si'))).every(Boolean);
    return { st, orden, completo };
  }

  // ---------- Las listas y cómo se dicen ----------
  // Cada lista: su nombre, el verbo con que se dice («toca quena»), su plural (para nombrar los cuadros), la pregunta
  // («¿Qué toca…?») y un sufijo para el número de años. Nada se abrevia: el texto se arma con el verbo entero.
  const LISTA = {
    instrumento: { nombre: 'instrumento', plural: 'instrumentos', verbo: 'toca', preg: '¿Qué toca', items: ['quena', 'charango', 'bombo', 'zampoña'] },
    ciudad: { nombre: 'ciudad', plural: 'ciudades', verbo: 'vive en', ni: 'ni en', preg: '¿Dónde vive', items: ['Puno', 'Juliaca', 'Lampa', 'Ayaviri'] },
    edad: { nombre: 'edad', plural: 'edades', verbo: 'tiene', suf: ' años', preg: '¿Cuántos años tiene', items: ['15', '16', '17', '18'] },
    producto: { nombre: 'producto', plural: 'productos', verbo: 'vende', preg: '¿Qué vende', items: ['tamales', 'jugos', 'choclo', 'queso'] },
    mandil: { nombre: 'mandil', plural: 'mandiles', verbo: 'usa mandil', preg: '¿De qué color es el mandil de', items: ['rojo', 'azul', 'blanco', 'negro'] },
    deporte: { nombre: 'deporte', plural: 'deportes', verbo: 'juega', preg: '¿Qué juega', items: ['fútbol', 'vóley', 'básquet', 'ajedrez'] },
    numero: { nombre: 'número', plural: 'números', verbo: 'lleva el número', preg: '¿Qué número lleva', items: ['5', '7', '9', '10'] },
  };
  const CTX2 = [
    { intro: 'tocan en la comparsa del colegio', listas: ['instrumento', 'ciudad', 'edad'] },
    { intro: 'atienden un puesto en la kermés', listas: ['producto', 'mandil'] },
    { intro: 'compiten en la olimpiada del colegio', listas: ['deporte', 'numero', 'edad'] },
  ];
  const R_LISTAS = 'Cada uno tiene una sola cosa de cada lista, y nada se repite.';
  // El texto de un item («16 años» con su sufijo) y de una lista de items («15, 16 o 17 años»: el sufijo al final).
  const itemT = (c, L, j) => `${c.listas[L].items[j]}${c.listas[L].suf || ''}`;
  const itemsT = (c, L) => `${lista(c.listas[L].items.slice(0, c.k), 'o')}${c.listas[L].suf || ''}`;
  const yE = (a, b) => `${a} ${/^h?[ií]/i.test(b) ? 'e' : 'y'} ${b}`;
  const cuadroDe = (c, A, B) => `el cuadro de ${yE(A === 'p' ? 'personas' : c.listas[+A].plural, B === 'p' ? 'personas' : c.listas[+B].plural)}`;
  // Una afirmación «x es (o no es) la misma persona que y», dicha como en el examen.
  function afirma(c, x, y, si) {
    if (y.startsWith('p:')) [x, y] = [y, x];
    const [gy, jy] = y.split(':'), Ly = c.listas[+gy], pred = `${si ? '' : 'no '}${Ly.verbo} ${itemT(c, +gy, +jy)}`;
    if (x.startsWith('p:')) return `${c.ps[+x.split(':')[1]]} ${pred}`;
    const [gx, jx] = x.split(':');
    return `quien ${c.listas[+gx].verbo} ${itemT(c, +gx, +jx)} ${pred}`;
  }
  const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  const pistaL = (c, a, b, si) => ({ items: [{ a, b, si }], t: `${mayus(afirma(c, a, b, si))}.`, cruce: !a.startsWith('p:') && !b.startsWith('p:') });

  // ---------- El juego, la predicción y «Mira»: la comparsa ----------
  const C2 = { k: 3, ps: P3, listas: [LISTA.instrumento, LISTA.ciudad].map(L => Object.assign({}, L, { items: L.items.slice(0, 3) })) };
  const INS = C2.listas[0], CIU = C2.listas[1];
  const PJ2 = [pistaL(C2, 'p:1', '1:2', true), pistaL(C2, '0:1', '1:1', true), pistaL(C2, 'p:1', '0:0', false)];
  const PP2 = PJ2.concat([pistaL(C2, 'p:0', '1:1', false)]);
  const TOTAL2 = repsL(3, 2).length;
  const q2 = ps => quedanL(3, 2, ps.flatMap(p => p.items));
  const mk2 = ps => marcasL(3, 2, q2(ps));
  // Qué toca cada persona, si ya es seguro: [{ f, c }] (el instrumento pasa a su mano).
  const manos2 = marcas => P3.map((_, f) => ({ f, c: [0, 1, 2].find(j => marcas[claveL(`p:${f}`, `0:${j}`)] === 'si') })).filter(x => x.c !== undefined);
  function comparsa(ps, o = {}) {
    const marcas = o.sinMarcas ? {} : mk2(ps), ult = ps[ps.length - 1];
    if (o.nueva && ult) { const it = ult.items[0], key = claveL(it.a, it.b); marcas[key] = { m: marcas[key] || (it.si ? 'si' : 'no'), nueva: true }; }
    const seg = Object.fromEntries(Object.entries(marcas).map(([k2, x]) => [k2, typeof x === 'string' ? x : x.m]));
    return { escena: 'comparsa', personas: P3, listas: C2.listas, marcas, manos: o.sinMarcas ? [] : manos2(seg),
      pistas: ps.map((p, k) => ({ t: p.t, nueva: !!o.nueva && k === ps.length - 1 })), lineas: o.lineas || 3,
      nota: o.sinMarcas ? `Sin marcas: ${TOTAL2} repartos posibles` : `Quedan ${q2(ps).length} de ${TOTAL2} repartos` };
  }
  // La misión: con cuántas pistas se sabe qué toca Beto (contado, no escrito a mano).
  const BETO = 1;
  const sabeBeto = n => [0, 1, 2].some(j => mk2(PJ2.slice(0, n))[claveL(`p:${BETO}`, `0:${j}`)] === 'si');
  const N_BETO = [0, 1, 2, 3].find(sabeBeto);
  const tocaBeto = () => INS.items[[0, 1, 2].find(j => mk2(PJ2)[claveL(`p:${BETO}`, `0:${j}`)] === 'si')];
  // La ✗ de Beto que pone la pista que no nombra a nadie (con las dos primeras pistas, no con la primera sola).
  const X_CRUCE = [0, 1, 2].find(j => mk2(PJ2.slice(0, 2))[claveL(`p:${BETO}`, `0:${j}`)] === 'no' && mk2(PJ2.slice(0, 1))[claveL(`p:${BETO}`, `0:${j}`)] !== 'no');
  const ciudadDe = (ps, f) => CIU.items[[0, 1, 2].find(j => mk2(ps)[claveL(`p:${f}`, `1:${j}`)] === 'si')];
  const cosaCiudad = (ps, j) => CIU.items[[0, 1, 2].find(c => mk2(ps)[claveL(`1:${c}`, `0:${j}`)] === 'si')];
  // Predicción: qué toca Ana con la cuarta pista (contado).
  const ANA_P = INS.items[[0, 1, 2].find(j => mk2(PP2)[claveL('p:0', `0:${j}`)] === 'si')];
  // Mira: cada marca aparece en el corte en que se sabe; la pista sin nombre primero en su cuadro (corte 2) y lo que pasa
  // a las personas después (corte 3). Pistas 3 y 4 en los cortes 4 y 5.
  const MIRA2 = (() => {
    const d = comparsa(PP2, { lineas: 4 }), primera = {};
    for (let s = 1; s <= PP2.length; s++) for (const [key, x] of Object.entries(mk2(PP2.slice(0, s)))) if (!(key in primera)) primera[key] = { s, x };
    const corte = (key, s) => (s === 1 ? 1 : s === 2 ? (key.startsWith('p:') ? 3 : 2) : s + 1);
    d.marcas = Object.fromEntries(Object.entries(primera).map(([key, { s, x }]) => [key, { m: x, desde: corte(key, s) }]));
    d.manos = manos2(mk2(PP2)).map(x => ({ f: x.f, c: x.c, desde: corte('p:', primera[claveL(`p:${x.f}`, `0:${x.c}`)].s) }));
    d.pistas = PP2.map((p, k) => ({ t: p.t, desde: [1, 2, 4, 5][k] }));
    d.nota = [{ t: `${TOTAL2} repartos posibles` }].concat(PP2.map((_, k) => ({ t: `Quedan ${q2(PP2.slice(0, k + 1)).length} de ${TOTAL2} repartos`, desde: [1, 2, 4, 5][k] })));
    return d;
  })();

  // ---------- Casos generados: «Así se resuelve» y «Ahora tú» ----------
  // Una pista posible, cierta en el reparto sol. tipo: 'no' y 'si' (persona y cosa), 'cruce' y 'cruceNo' (dos cosas, sin
  // nombrar a nadie), 'rel' (una persona que se junta con quien tiene una cosa: no es ella) y 'dos' (dos ✗ de una persona).
  function lineaL(r, c, sol, tipo) {
    const k = c.k, m = c.listas.length, q = r.ent(0, k - 1), L = r.ent(0, m - 1);
    const de = (L2, persona) => sol[L2][persona];
    const otro = (L2, persona) => r.elegir(Array.from({ length: k }, (_, j) => j).filter(j => j !== de(L2, persona)));
    if (tipo === 'si') return pistaL(c, `p:${q}`, `${L}:${de(L, q)}`, true);
    if (tipo === 'cruce' || tipo === 'cruceNo') {
      const [A, B] = r.barajar(Array.from({ length: m }, (_, i) => i)).slice(0, 2), quien = r.ent(0, k - 1);
      return tipo === 'cruce' ? pistaL(c, `${A}:${de(A, quien)}`, `${B}:${de(B, quien)}`, true) : pistaL(c, `${A}:${de(A, quien)}`, `${B}:${otro(B, quien)}`, false);
    }
    if (tipo === 'rel') { const j = otro(L, q); return { items: [{ a: `p:${q}`, b: `${L}:${j}`, si: false }], t: `${c.ps[q]} ${r.elegir(REL)} quien ${c.listas[L].verbo} ${itemT(c, L, j)}.`, rel: true }; }
    if (tipo === 'dos') {
      if (m > 1 && r() < 0.5) {
        const [A, B] = r.barajar(Array.from({ length: m }, (_, i) => i)).slice(0, 2), ja = otro(A, q), jb = otro(B, q);
        return { items: [{ a: `p:${q}`, b: `${A}:${ja}`, si: false }, { a: `p:${q}`, b: `${B}:${jb}`, si: false }], t: `${c.ps[q]} no ${c.listas[A].verbo} ${itemT(c, A, ja)} ni ${c.listas[B].verbo} ${itemT(c, B, jb)}.` };
      }
      const [j1, j2] = r.barajar(Array.from({ length: k }, (_, j) => j).filter(j => j !== de(L, q))).slice(0, 2);
      if (j2 !== undefined) return { items: [{ a: `p:${q}`, b: `${L}:${j1}`, si: false }, { a: `p:${q}`, b: `${L}:${j2}`, si: false }], t: `${c.ps[q]} no ${c.listas[L].verbo} ${itemT(c, L, j1)} ${c.listas[L].ni || 'ni'} ${itemT(c, L, j2)}.` };
    }
    return pistaL(c, `p:${q}`, `${L}:${otro(L, q)}`, false);
  }
  const itemsL = lineas => lineas.flatMap(l => l.items);
  // Las casillas que se pueden preguntar: persona y cosa (forma 'persona') o dos cosas (forma 'cruce'), con su valor
  // único en los repartos que quedan. Solo sirven las que no se sabrían sin las pistas que no nombran a nadie.
  function objetivos(c, forma) {
    const sinCruce = quedanL(c.k, c.listas.length, itemsL(c.lineas.filter(l => !l.cruce)));
    const out = [], m = c.listas.length;
    const valor = (q, e, L) => { const vs = new Set(q.map(r => r[L][dueno(r, e)])); return vs.size === 1 ? [...vs][0] : null; };
    for (let L = 0; L < m; L++) {
      const fuentes = forma === 'persona' ? Array.from({ length: c.k }, (_, i) => `p:${i}`) : Array.from({ length: m }, (_, A) => A).filter(A => A !== L).flatMap(A => Array.from({ length: c.k }, (_, i) => `${A}:${i}`));
      for (const e of fuentes) { const v = valor(c.quedan, e, L); if (v !== null && valor(sinCruce, e, L) === null) out.push({ e, L, v }); }
    }
    return out;
  }
  // Arma un caso. o: { k, m, ctx?, quedan (1 o 2) o forma ('persona' | 'cruce': basta que esa casilla quede decidida),
  // tipos, max, conRel }.
  function armarL(r, o) {
    const ctx = o.ctx || r.elegir(CTX2.filter(x => x.listas.length >= o.m));
    const listas = ctx.listas.slice(0, o.m).map(n => LISTA[n]);
    const ps = r.barajar(GENTE).slice(0, o.k), m = o.m, k = o.k;
    const c0 = { k, ps, listas, ctx };
    for (let intento = 0; intento < 300; intento++) {
      const sol = Array.from({ length: m }, () => r.elegir(permsDe(k)));
      const listo = c => (o.forma ? objetivos(c, o.forma).length > 0 : c.quedan.length <= o.quedan);
      let lineas = [], q = repsL(k, m);
      const caso = ls => Object.assign({}, c0, { lineas: ls, quedan: quedanL(k, m, itemsL(ls)) });
      for (let j = 0; j < 12; j++) {
        const l = lineaL(r, c0, sol, r.elegir(o.tipos));
        lineas.push(l); q = q.filter(x => cumpleL(x, l.items));
        if (o.forma ? listo(caso(lineas)) : q.length <= o.quedan) break;
      }
      let c = caso(lineas);
      if (!listo(c) || (!o.forma && c.quedan.length !== o.quedan)) continue;
      // Sin líneas que sobren: se quita cada una que no cambia lo que se pide.
      for (let i = lineas.length - 1; i >= 0; i--) {
        const sin = lineas.slice(0, i).concat(lineas.slice(i + 1)), cs = caso(sin);
        if (o.forma ? listo(cs) : cs.quedan.length === o.quedan) { lineas = sin; c = cs; }
      }
      if (lineas.length > o.max || lineas.length < 2 || !lineas.some(l => l.cruce)) continue;
      if (o.conRel && !lineas.some(l => l.rel)) continue;
      if (lineas.some(l => l.rel) && lineas.length > o.max - 1) continue;
      if (!o.forma && objetivos(c, 'persona').length + objetivos(c, 'cruce').length === 0) continue;
      const pr = propagarL(k, m, itemsL(lineas));
      if (o.quedan === 1 && !pr.completo) continue;
      if (o.forma) {
        // Lo que se pregunta tiene que salir con el método de la idea (cuadros y cruces), no solo contando repartos.
        const objs = objetivos(c, o.forma).filter(t => pr.st.get(claveL(t.e, `${t.L}:${t.v}`)) === 'si');
        if (!objs.length) continue;
        c.objs = objs;
      }
      c.pr = pr;
      return c;
    }
    return null;
  }
  // Caso de respaldo (si el azar no arma uno): el de la predicción, con la comparsa.
  function respaldo2() {
    const c = Object.assign({}, C2, { ctx: CTX2[0], lineas: PP2, quedan: q2(PP2) });
    c.pr = propagarL(3, 2, itemsL(PP2)); c.objs = objetivos(c, 'persona');
    return c;
  }
  const introL = c => {
    const ls = c.listas.map((L, i) => `${L.verbo} ${itemsT(c, i)}`);
    return `${lista(c.ps)} ${c.ctx.intro}. Cada uno ${ls.length === 3 ? `${ls[0]}; ${ls[1]}, y ${ls[2]}` : `${ls[0]}, y ${ls[1]}`}.`;
  };
  const datosL = c => [R_LISTAS, ...(c.lineas.some(l => l.rel) ? [D_DOS] : []), ...c.lineas.map((l, i) => `Pista ${i + 1}: ${l.t}`)];
  const figL = (c, marcas) => ({ datos: { personas: c.ps, listas: c.listas.map((L, i) => ({ nombre: L.nombre, items: Array.from({ length: c.k }, (_, j) => itemT(c, i, j)) })), marcas: marcas || {} }, estado: {} });
  const marcasCaso = c => marcasL(c.k, c.listas.length, c.quedan);
  // Una deducción que pasa de un cuadro a otro, dicha en palabras: «Beto vive en Lampa, y quien vive en Lampa no toca
  // charango: Beto no toca charango».
  const cuentaCruce = (c, d) => `${mayus(afirma(c, d.a, d.via, true))}, y ${afirma(c, d.via, d.b, d.v === 'si')}: ${afirma(c, d.a, d.b, d.v === 'si')}.`;
  // Por qué no vale una casilla (e es la entidad; L, j lo que se afirma): la primera pista sin la cual sí cabría.
  function porQueNoL(c, e, L, j) {
    for (let i = 0; i < c.lineas.length; i++) {
      const otras = c.lineas.filter((_, x) => x !== i);
      if (quedanL(c.k, c.listas.length, itemsL(otras)).some(r => r[L][dueno(r, e)] === j)) {
        return c.lineas[i].cruce ? { error: 'RMP63', siFuera: `Valdría sin la pista ${i + 1}, que no nombra a nadie. Con ella, no cabe en ningún reparto.` }
          : { error: 'RMP72', siFuera: `Valdría sin la pista ${i + 1}. Con todas las pistas, no cabe en ningún reparto.` };
      }
    }
    return { error: 'RMP63', siFuera: 'Tendrías que saltarte dos pistas: con todas, no cabe en ningún reparto.' };
  }
  const sujetoT = (c, e) => (e.startsWith('p:') ? c.ps[+e.split(':')[1]] : `quien ${c.listas[+e.split(':')[0]].verbo} ${itemT(c, +e.split(':')[0], +e.split(':')[1])}`);
  const preguntaL = (c, e, L) => `${c.listas[L].preg} ${sujetoT(c, e)}?`;

  const ideaListas = {
    id: 'dos-atributos',
    titulo: 'Pistas que cruzan dos listas',
    pregunta: '¿Dónde se marca una pista que no nombra a nadie?',
    temas: ['Cuadros de doble entrada'],
    pieza: OB,
    aprendizaje: 'Una pista que une dos listas sin nombrar a nadie va en el cuadro de esas dos listas; de ahí pasa a las personas.',
    actividad: 'Agregar pistas una a una y mirar en qué parte del cuadro cae cada una.',
    // Lee: la comparsa, el reparto con dos listas, el cuadro en L. No dice dónde va una pista sin nombre (eso se juega).
    lee: {
      tarjetas: [
        { titulo: 'La comparsa del colegio', texto: `${lista(P3)} tocan en la comparsa. Bajan de la combi con la correa del instrumento cruzada en el pecho; quena, charango y bombo van en el techo. Cada uno toca uno distinto y vive en una ciudad distinta: ${lista(CIU.items, 'o')}.`,
          pieza: OB, dibujo: { datos: { escena: 'comparsa', cuadro: false, personas: P3, listas: C2.listas }, estado: {} } },
        { titulo: 'Dos listas, más repartos', texto: `Ahora cada uno tiene un atributo de cada lista: un instrumento y una ciudad. Un reparto dice las dos cosas de cada uno. Los instrumentos se reparten de ${permsDe(3).length} maneras, y las ciudades, también.`,
          ecuacion: [`${permsDe(3).length} × ${permsDe(3).length} = ${TOTAL2} repartos`] },
        { titulo: 'Un cuadro en tres partes', texto: 'Arriba van personas e instrumentos, y personas y ciudades. Abajo, ciudades e instrumentos: ahí no hay nombres. «Beto vive en Lampa» va en el cuadro de personas y ciudades.',
          pieza: OB, dibujo: { datos: { personas: P3, listas: C2.listas }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a agregar tres pistas, una a una. Mira en qué parte del cuadro cae cada pista y qué casillas tacha en las otras partes.' },
      ],
    },
    juega: {
      pieza: OB,
      consigna: `${lista(P3)} bajan de la combi con su quena, su charango y su bombo. Cada uno vive en una ciudad distinta.`,
      mision: {
        texto: 'Agrega pistas una a una hasta saber qué toca Beto.',
        logrado: v => v.n === N_BETO,
        bien: [`La pista 2 no nombraba a Beto, pero le tachó el ${INS.items[X_CRUCE]}.`],
      },
      voz: 'Mira en qué parte del cuadro cae cada pista.',
      leyenda: [
        { s: F('✓'), t: 'seguro: vale en todos los repartos que quedan' },
        { s: '✗', t: 'imposible: no vale en ningún reparto' },
        { s: 'cuadro de abajo', t: 'ciudades e instrumentos, sin nombrar a nadie' },
        { s: 'casilla punteada', t: 'donde cae la pista nueva' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ2.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: comparsa(PJ2.slice(0, v.n), { nueva: true }), estado: {} }),
      // La lectura dice dónde cae la pista nueva y qué hace en las otras partes del cuadro.
      lectura: v => {
        if (v.n === 0) return [`Sin pistas: ${TOTAL2} repartos; ninguna casilla es segura`];
        if (v.n === 1) return [`${PJ2[0].t.replace(/\.$/, '')}: va al cuadro de personas y ciudades`];
        if (v.n === 2) return [`${mayus(INS.items[X_CRUCE])} en ${cosaCiudad(PJ2.slice(0, 2), X_CRUCE)} y Beto en ${ciudadDe(PJ2.slice(0, 1), BETO)}: Beto no toca ${INS.items[X_CRUCE]}`];
        return [`Beto toca ${tocaBeto()}: el ${tocaBeto()} es de ${ciudadDe(PJ2, BETO)}, `, F('✓ segura')];
      },
      minimo: PJ2.length + 1,
    },
    predice: {
      pregunta: `Se agrega una cuarta pista: ${PP2[3].t.replace(/\.$/, '')}. ¿Qué toca Ana?`,
      datos: ['Cada músico toca un solo instrumento y vive en una sola ciudad; nada se repite.'],
      voz: 'Sigue la ciudad de Ana hasta su instrumento.',
      opciones: [
        { id: 'c', texto: mayus(ANA_P), correcta: true },
        { id: 'cruce', texto: mayus(INS.items[1]), error: 'RMP63', siFuera: 'Sin la pista 2 podría ser. Esa pista amarra el charango a Juliaca, y Ana no vive ahí.' },
        { id: 'nada', texto: 'No se sabe: la pista habla de ciudades', error: 'RMP78', siFuera: 'Es cierto que habla de ciudades, pero el cuadro de abajo pasa cada ciudad a su instrumento.' },
        { id: 'choca', texto: mayus(tocaBeto()), error: 'RMP72', siFuera: `Sin la pista 3 podría ser; con ella, el ${tocaBeto()} ya es de Beto.` },
      ],
      dibujo: { datos: comparsa(PP2, { sinMarcas: true, lineas: 4 }), estado: {} },
      revelar: { datos: comparsa(PP2, { lineas: 4 }), estado: {} },
      coincide: `Coincide: Ana vive en ${ciudadDe(PP2, 0)}, y en ${ciudadDe(PP2, 0)} se toca ${ANA_P}.`,
      noCoincide: `Revisemos: Ana vive en ${ciudadDe(PP2, 0)}, y el cuadro de abajo dice que en ${ciudadDe(PP2, 0)} se toca ${ANA_P}.`,
    },
    mira: {
      pieza: OB,
      datos: MIRA2,
      voz: 'Cada pista va a su cuadro; después, lo sabido pasa a las personas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La pista 1 nombra a Beto: va al cuadro de personas y ciudades.' },
        { estado: { corte: 2 }, texto: 'La pista 2 no nombra a nadie: va al cuadro de ciudades e instrumentos.' },
        { estado: { corte: 3 }, texto: `Beto vive en ${ciudadDe(PJ2.slice(0, 1), BETO)}, y el ${INS.items[X_CRUCE]} es de ${cosaCiudad(PJ2.slice(0, 2), X_CRUCE)}: Beto no toca ${INS.items[X_CRUCE]}.` },
        { estado: { corte: 4 }, texto: `Pista 3: le queda el ${tocaBeto()}, y el ${tocaBeto()} pasa a ser de ${ciudadDe(PJ2, BETO)}.` },
        { estado: { corte: 5 }, texto: `Pista 4: Ana vive en ${ciudadDe(PP2, 0)}, y en ${ciudadDe(PP2, 0)} se toca ${ANA_P}.`, ecuacion: ['Ana ', F('✓'), ` ${ciudadDe(PP2, 0)}  y  ${ciudadDe(PP2, 0)} `, F('✓'), ` ${ANA_P},  entonces Ana `, F('✓'), ` ${ANA_P}`] },
      ],
    },
    regla: {
      texto: 'Una pista que une dos listas sin nombrar a nadie va al cuadro de esas listas. Lo que se sabe de una cosa pasa a su dueño, y al revés.',
      ecuacion: [{ llave: ['Beto ', F('✓'), ' Lampa'], nota: 'con nombre' }, '   y   ', { llave: ['Lampa ', F('✓'), ' bombo'], nota: 'sin nombre' }, ',   entonces Beto ', F('✓'), ' bombo'],
      condicion: 'cada uno tiene una sola cosa de cada lista; una pista que nombra dos cosas habla de una misma persona.',
      voz: 'Una pista sin nombre también tacha casillas de las personas.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_LISTAS)
    // Así se resuelve: el reparto completo de 3 personas con dos listas, con al menos una pista que no nombra a nadie;
    // la cadena de deducciones la cuenta propagarL. «Ahora tú» no pide el reparto completo.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900);
        const c = armarL(r, { k: 3, m: 2, quedan: 1, tipos: ['no', 'si', 'cruce', 'cruce', 'cruceNo', 'rel'], max: 5 }) || respaldo2();
        const directas = {};
        for (const x of itemsL(c.lineas)) directas[claveL(x.a, x.b)] = x.si ? 'si' : 'no';
        // La cadena entera (auditoría M8): primero un cruce, de preferencia una ✓ (no un ✗ derivado que parezca pista), con
        // el cuadro hasta ahí; después, las ✓ de las personas que faltan, con el cuadro completo.
        const cruces = c.pr.orden.filter(d => d.por === 'cruce'), cruce = cruces.find(d => d.v === 'si') || cruces[0];
        const iCruce = c.pr.orden.indexOf(cruce);
        const hastaL = n => Object.fromEntries(c.pr.orden.slice(0, n).map(d => [claveL(d.a, d.b), d.v]));
        const vistas = new Set(c.pr.orden.slice(0, iCruce + 1).filter(d => d.v === 'si').map(d => claveL(d.a, d.b)));
        const restan = c.pr.orden.filter(d => d.v === 'si' && (d.a.startsWith('p:') || d.b.startsWith('p:')) && !vistas.has(claveL(d.a, d.b)) && d.por !== 'pista');
        const rep = c.quedan[0];
        const repTxt = c.ps.map((p, q) => `${p}: ${c.listas.map((_, L) => itemT(c, L, rep[L][q])).join(', ')}`).join('. ');
        const nC = c.lineas.filter(l => l.cruce).length;
        return {
          enunciado: `${introL(c)} ¿Qué tiene cada uno?`,
          datos: datosL(c),
          dibujo: figL(c),
          pasos: [
            { tipo: 'pide', texto: `Piden el reparto completo: ${c.listas[0].nombre} y ${c.listas[1].nombre} de cada uno.` },
            { tipo: 'regla', texto: 'Cada pista va al cuadro de las dos cosas que nombra. Lo que se sabe de una cosa pasa a su dueño; cada ✓ tacha su fila y su columna.' },
            { tipo: 'aplica', texto: `Marco cada pista en su cuadro${c.lineas.some(l => l.rel) ? ' (las personas que junta una pista son distintas)' : ''}. ${nC === 1 ? 'La que no nombra' : `Las ${nC} que no nombran`} a nadie ${nC === 1 ? 'va' : 'van'} al cuadro de abajo.`, dibujo: figL(c, directas) },
            { tipo: 'aplica', texto: cuentaCruce(c, cruce), dibujo: figL(c, hastaL(iCruce + 1)) },
            { tipo: 'aplica', texto: restan.length ? `Con filas, columnas y cruces salen las ✓ que faltan: ${lista(restan.map(d => afirma(c, d.a, d.b, true)))}.` : 'Con eso ya está todo el reparto.', ecuacion: [repTxt], dibujo: figL(c, marcasCaso(c)) },
            { tipo: 'sentido', texto: 'Compruebo cada pista con el reparto: ninguna se rompe y nada se repite.' },
          ],
          respuesta: [F(repTxt)],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 qué tiene una persona (3 personas, 2 listas); 1 qué tiene quien tiene una cosa
    // (la pregunta tampoco nombra a nadie); 2 «¿cuál es necesariamente verdadera?» (4 personas, 2 listas, 1 o 2 repartos);
    // 3 nivel examen: 3 personas y 3 listas, y se pregunta por dos cosas. Cada opción sale de contar repartos.
    ahoraTu: {
      pieza: OB,
      voz: 'Pon cada pista en su cuadro y pasa lo que sabes a las personas.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 2) {
          const quedan = 1 + (Math.floor(s / 4) % 2);
          const c = armarL(r, { k: 4, m: 2, quedan, tipos: ['no', 'si', 'cruce', 'cruce', 'cruceNo', 'dos', 'rel'], max: 5 }) || respaldo2();
          const objs = objetivos(c, 'persona').concat(objetivos(c, 'cruce'));
          const t = objs.length ? r.elegir(objs) : { e: 'p:0', L: 0, v: c.quedan[0][0][0] };
          const dice = (e, L, j) => mayus(`${sujetoT(c, e)} ${c.listas[L].verbo} ${itemT(c, L, j)}`);
          const ops = [{ id: 'c', texto: dice(t.e, t.L, t.v), correcta: true }];
          const posibles = [], imposibles = [];
          for (let q = 0; q < c.k; q++) for (let L = 0; L < 2; L++) for (let j = 0; j < c.k; j++) {
            const n = c.quedan.filter(x => x[L][q] === j).length;
            if (n > 0 && n < c.quedan.length) posibles.push([q, L, j]); else if (n === 0) imposibles.push([q, L, j]);
          }
          if (posibles.length) { const [q, L, j] = r.elegir(posibles); ops.push({ id: 'posible', texto: dice(`p:${q}`, L, j), error: 'RMP77', siFuera: `Pasa en uno de los ${c.quedan.length} repartos que quedan, no en los dos.` }); }
          for (const [q, L, j] of r.barajar(imposibles)) {
            if (ops.length >= 4) break;
            const texto = dice(`p:${q}`, L, j);
            if (ops.some(o => o.texto === texto)) continue;
            ops.push(Object.assign({ id: `x${q}${L}${j}`, texto }, porQueNoL(c, `p:${q}`, L, j)));
          }
          return { pregunta: `${introL(c)} ¿Cuál es necesariamente verdadera?`, datos: datosL(c), dibujo: figL(c), opciones: ops,
            solucion: { texto: `${c.quedan.length === 1 ? 'Queda un solo reparto' : 'Quedan 2 repartos'}, y en ${c.quedan.length === 1 ? 'él' : 'los dos'}: ${dice(t.e, t.L, t.v)}.`, dibujo: figL(c, marcasCaso(c)) } };
        }
        const examen = tipo === 3, forma = tipo === 0 ? 'persona' : 'cruce';
        const c = armarL(r, examen ? { k: 3, m: 3, forma: 'cruce', tipos: ['no', 'si', 'cruce', 'cruce', 'cruceNo', 'dos'], max: 5 }
          : { k: 3, m: 2, forma, tipos: ['no', 'si', 'cruce', 'cruce', 'cruceNo', 'rel'], max: 4 }) || respaldo2();
        const objs = c.objs || objetivos(c, forma);
        // En el examen se pregunta, si se puede, por la lista que no es la primera (sale de dos cruces).
        const t = (examen && objs.find(x => x.L === 2 || x.e.startsWith('2:'))) || r.elegir(objs);
        const ops = Array.from({ length: c.k }, (_, j) => (j === t.v ? { id: 'c', texto: mayus(itemT(c, t.L, j)), correcta: true }
          : Object.assign({ id: `x${j}`, texto: mayus(itemT(c, t.L, j)) }, porQueNoL(c, t.e, t.L, j))));
        ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero las pistas sin nombre pasan lo que dicen a las personas.' });
        return { pregunta: `${introL(c)} ${preguntaL(c, t.e, t.L)}`, datos: datosL(c), dibujo: figL(c), opciones: ops,
          solucion: { texto: `Pasando lo sabido de un cuadro a otro, ${sujetoT(c, t.e)} ${c.listas[t.L].verbo} ${itemT(c, t.L, t.v)}.`, dibujo: figL(c, marcasCaso(c)) } };
      },
    },
  };


  // ---------- Idea 3: lo que vale en todo dibujo (etapa 3, 17 nov) ----------
  // Objeto de la primera pantalla: los aros de educación física en el patio, con alumnos parados adentro (rm-aros, escena
  // «patio», dibujo de prueba). Cambia: dónde cae el aro de la diablada. · Permanece: el aro de quenistas dentro del de la
  // banda. · Progresa: los dibujos que cumplen las premisas. · Se reserva: «ningún» (la predicción). · Debe verse: que la
  // premisa no obliga a que el aro de la diablada toque a los quenistas.
  // Todo sale de mirar quién está dentro de qué aro (dentro, tocan): ninguna lectura se escribe a mano (regla 1). Las
  // conclusiones de los ejercicios salen de contar dibujos: cada dibujo es una manera de llenar las zonas del diagrama de
  // Venn que cumple las premisas (modelosVenn); es seguro lo que vale en todos.
  const AR = 'rm-aros';
  // Ronda 2 del lector (18 nov): los alumnos ya no se paran sobre la línea de un aro. Cada uno queda entero (de los pies a
  // la cabeza) dentro o fuera de cada aro, en todos los lugares del juego, y los nombres van dentro de su aro o pegados a
  // él, sin cruzar ninguna línea ni pisar a nadie (buscado con scratchpad deductivo-r2/patio-opt2.js; lo comprueba
  // rm-aros.test.js con números). Los quenistas son dos: uno baila con el aro en «cruza»; el otro, no.
  const BANDA = { nombre: 'banda', papel: 'medio', x: 4.15, y: 4.65, r: 3.95, en: [5.6, 2.4] };
  const QUEN = { nombre: 'quenistas', papel: 'primero', x: 3.35, y: 5.75, r: 1.8, en: [2.3, 2.95] };
  const LUGAR = {
    cruza: { x: 6.0, y: 5.7, r: 2.65, en: [6.5, 8.85] },
    cubre: { x: 3.4, y: 5.85, r: 2.25, en: [2.35, 9.0] },
    lejos: { x: 7.5, y: 4.75, r: 1.6, en: [8.8, 6.8] },
    fuera: { x: 8.85, y: 1.55, r: 1.3, en: [9.1, 3.35] },
  };
  // Los dos quenistas, dos de la banda (uno baila con el aro «lejos») y uno fuera de todo (baila con el aro «fuera»).
  const NINOS3 = [[2.9, 6.05], [4.1, 6.35], [4.05, 3.1], [6.8, 5.45], [8.65, 2.4]];
  const dentro = (p, a) => Math.hypot(p[0] - a.x, p[1] - a.y) < a.r - 1e-9;
  const tocanA = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r - 1e-9;
  // Lo que pasa en el patio con la diablada en el lugar c: quiénes bailan, y si se cumple la premisa 2.
  function patioDe(c) {
    const D = LUGAR[c], q = NINOS3.filter(p => dentro(p, QUEN)), b = NINOS3.filter(p => dentro(p, BANDA));
    return { cumple: b.some(p => dentro(p, D)) && tocanA(D, BANDA), bailanQ: q.filter(p => dentro(p, D)).length, nQ: q.length };
  }
  const aroD = (c, extra = {}) => Object.assign({ nombre: 'diablada', papel: 'segundo' }, LUGAR[c], extra);
  const patio = (c, o = {}) => ({ escena: 'patio', aros: [BANDA, QUEN].concat(c ? [aroD(c, { cumple: o.cumple === undefined ? patioDe(c).cumple : o.cumple })] : []), ninos: NINOS3, nota: o.nota });
  const lecturaPatio = c => {
    const x = patioDe(c);
    if (!x.cumple) return ['No cumple: nadie de la banda baila diablada'];
    return ['Cumple las dos premisas, y ', x.bailanQ === 0 ? 'ningún quenista baila' : x.bailanQ === x.nQ ? 'todos los quenistas bailan' : 'algún quenista baila diablada'];
  };
  // Mira: dos dibujos de Venn lado a lado (los aros vistos desde arriba): la diablada cruza a los quenistas en uno y no los
  // toca en el otro. Los dos cumplen las premisas (se comprueba en la prueba de la unidad).
  // Los mismos dibujos de «algunos» de los ejercicios (ALG1 y ALG2, más abajo); los nombres los ubica rotularVenn.
  const aroAlg = (L, k, nombre, papel, extra) => Object.assign({ nombre, papel, x: L[k][0], y: L[k][1], r: L[k][2] }, extra);
  const MIRA3_ = () => ({ alto: ALTO_ALG, apilar: true, diagramas: [
    { titulo: 'Dibujo 1', aros: [aroAlg(ALG1, 0, 'banda', 'medio'), aroAlg(ALG1, 1, 'quenistas', 'primero', { desde: 1 }), aroAlg(ALG1, 2, 'diablada', 'segundo', { desde: 2 })] },
    { titulo: 'Dibujo 2', desde: 3, aros: [aroAlg(ALG2, 0, 'banda', 'medio'), aroAlg(ALG2, 1, 'quenistas', 'primero'), aroAlg(ALG2, 2, 'diablada', 'segundo')] }] });

  // ---------- Dibujos de Venn contados: las zonas que pueden tener gente ----------
  // Con n grupos hay 2ⁿ − 1 zonas (cada una dice en qué grupos está quien se para ahí). Un dibujo dice qué zonas tienen a
  // alguien; cada grupo tiene al menos un integrante (va en los datos). Se cuentan una vez por forma (caché).
  const modelosCache = {};
  function modelosVenn(n, premisas, clave) {
    if (clave && modelosCache[clave]) return modelosCache[clave];
    const zonas = Array.from({ length: (1 << n) - 1 }, (_, i) => i + 1), out = [];
    for (let b = 0; b < 1 << zonas.length; b++) {
      const on = zonas.filter((_, i) => (b >> i) & 1);
      if (!Array.from({ length: n }, (_, g) => on.some(z => (z >> g) & 1)).every(Boolean)) continue;
      if (premisas.every(p => vale(on, p))) out.push(on);
    }
    if (clave) modelosCache[clave] = out;
    return out;
  }
  // Una afirmación: { q: 'todos' | 'ningun' | 'algunos' | 'algunosNo', x, y } (x y y: números de grupo).
  function vale(on, a) {
    const en = (z, g) => (z >> g) & 1;
    if (a.q === 'todos') return !on.some(z => en(z, a.x) && !en(z, a.y));
    if (a.q === 'ningun') return !on.some(z => en(z, a.x) && en(z, a.y));
    if (a.q === 'algunos') return on.some(z => en(z, a.x) && en(z, a.y));
    return on.some(z => en(z, a.x) && !en(z, a.y));
  }
  const segura = (ms, a) => ms.every(on => vale(on, a));
  const posible = (ms, a) => ms.some(on => vale(on, a));
  // Grupos: [plural, singular]. Frases como en el examen.
  function frase(g, a) {
    const [px, sx] = g[a.x], [py, sy] = g[a.y];
    return a.q === 'todos' ? `Todos los ${px} son ${py}` : a.q === 'ningun' ? `Ningún ${sx} es ${sy}` : a.q === 'algunos' ? `Algunos ${px} son ${py}` : `Algunos ${px} no son ${py}`;
  }
  const D_TODOS = '«Todos los … son …»: ninguno del primer grupo queda fuera del segundo.';
  const D_ALG = '«Algunos … son …»: al menos uno está en los dos grupos, y quizás todos.';
  const D_NING = '«Ningún … es …»: nadie está en los dos grupos a la vez.';
  const D_ALGNO = '«Algunos … no son …»: al menos uno del primer grupo está fuera del segundo.';
  const D_UNO = 'Cada grupo tiene al menos un integrante.';
  const datosVenn = afs => [...new Set(afs.map(a => ({ todos: D_TODOS, algunos: D_ALG, ningun: D_NING, algunosNo: D_ALGNO })[a.q]))].concat([D_UNO]);
  // Las formas que se practican (A = 0 primero, naranja; B = 1 del medio, tinta; C = 2 segundo, turquesa; D = 3, tinta).
  // La conclusión que se busca y el dibujo de muestra (uno o dos diagramas) de cada una.
  const T_ = (q, x, y) => ({ q, x, y });
  const FORMAS = [
    { p: [T_('todos', 0, 1), T_('todos', 1, 2)], c: T_('todos', 0, 2) },
    { p: [T_('todos', 0, 1), T_('algunos', 1, 2)], c: null },
    { p: [T_('ningun', 0, 1), T_('todos', 2, 1)], c: T_('ningun', 2, 0) },
    { p: [T_('todos', 0, 1), T_('ningun', 1, 2)], c: T_('ningun', 0, 2) },
    { p: [T_('algunos', 0, 1), T_('todos', 1, 2)], c: T_('algunos', 0, 2) },
    { p: [T_('algunos', 0, 1), T_('ningun', 1, 2)], c: T_('algunosNo', 0, 2) },
    { p: [T_('todos', 0, 1), T_('todos', 1, 2), T_('ningun', 2, 3)], c: T_('ningun', 0, 3), n: 4 },
  ];
  // Dibujo de muestra de cada forma: aros por grupo (x, y, r) y dónde va su nombre; la forma sin conclusión lleva dos.
  const ARO = (g, x, y, r, papel) => ({ g, x, y, r, papel });
  // Los dibujos de «algunos» (todos los A son B, algunos B son C): en el dibujo 1, C cruza a B y a A; en el 2, cruza a B
  // lejos de A. Los usan «Así se resuelve», «Ahora tú», «Mira» y dos ejemplos, apilados (alto 8). Buscados con el nombre
  // más largo de la unidad (ajedrecistas) en cada aro: cada nombre cabe en su aro o pegado a él, y ningún aro queda al
  // borde de otro (ronda 2 del lector, 18 nov; scratchpad deductivo-r2/opt.js).
  // Forma 6 (cuatro grupos): tres aros uno dentro de otro y un cuarto aparte.
  const F6_MUESTRA = [[ARO(2, 6.15, 5.15, 3.45, 'medio'), ARO(1, 6.15, 5.15, 2.95, 'medio'), ARO(0, 5.65, 5.2, 1.8, 'primero'), ARO(3, 1.55, 1.45, 1.2, 'segundo')]], F6_ALTO = 9;
  const ALG1 = [[7.15, 3.9, 3.7], [7.15, 3.9, 2.75], [4.45, 5.6, 1.45]], ALG2 = [[2.15, 3.9, 3.7], [1.8, 4.0, 2.4], [8.15, 3.7, 3.25]];
  const ALTO_ALG = 8;
  const deALG = (L, gs) => ['medio', 'primero', 'segundo'].map((papel, k) => ({ g: gs[k], papel, x: L[k][0], y: L[k][1], r: L[k][2] }));
  const MUESTRA = [
    [[ARO(2, 6.3, 3.6, 3.45, 'segundo'), ARO(1, 6.3, 3.6, 2.8, 'medio'), ARO(0, 6.2, 3.25, 1.9, 'primero')]],
    [deALG(ALG1, [1, 0, 2]), deALG(ALG2, [1, 0, 2])],
    [[ARO(0, 1.4, 5.65, 1.25, 'primero'), ARO(1, 6.75, 3.85, 3.2, 'medio'), ARO(2, 6.95, 3.9, 1.75, 'segundo')]],
    [[ARO(1, 6.75, 3.85, 3.2, 'medio'), ARO(0, 6.95, 3.9, 1.75, 'primero'), ARO(2, 1.4, 5.65, 1.25, 'segundo')]],
    [[ARO(2, 5.9, 3.55, 3.2, 'segundo'), ARO(1, 5.9, 3.55, 2.1, 'medio'), ARO(0, 3.5, 2.5, 1.85, 'primero')]],
    [[ARO(0, 1.85, 2.15, 1.55, 'primero'), ARO(1, 2.45, 4.15, 2.05, 'medio'), ARO(2, 7.8, 5.1, 1.3, 'segundo')]],
    F6_MUESTRA,
  ];
  // Alto de cada forma; con la primera premisa sola, la forma 1 usa el dibujo de la 3 (un aro dentro de otro, sin apilar).
  const ALTO_M = [7.2, ALTO_ALG, 7.2, 7.2, 7.2, 7.2, F6_ALTO];
  const SOLO_M = { 1: [[ARO(1, 6.75, 3.85, 3.2, 'medio'), ARO(0, 6.95, 3.9, 1.75, 'primero')]] };

  // Dónde va el nombre de cada aro de un diagrama de Venn. Se busca en una rejilla un lugar donde el nombre no cruce
  // ninguna línea de aro ni pise otro nombre, con dos reglas (lector en frío, ronda 2, 18 nov: «quenistas» quedaba fuera
  // de la banda y «cantantes» dentro de ajedrecistas, lejos de su aro):
  //   1. de preferencia, dentro de su aro y fuera de todo aro que no lo contiene (su pedazo propio);
  //   2. si no cabe, afuera de todos los aros y pegado al suyo (a 8 px o menos), más cerca del suyo que de cualquier otro.
  // Nunca dentro de un aro que no es el suyo. Por eso un aro que va dentro de otro se dibuja lo bastante grande para que
  // su nombre quepa adentro. Si ningún lugar cumple (solo pasa en el laboratorio, donde el alumno mueve los aros), va el
  // lugar libre más cerca de su aro. La escala es la de rm-aros (geometria): 30,4 px por unidad con un diagrama, 22
  // apilados (apilados, el diagrama tiene 1,9 unidades libres a cada lado). rm-aros.test.js lo comprueba con números en
  // todas las figuras de la unidad.
  const T_ANCHO = t => { let w = 0; for (const ch of String(t)) w += /\s/.test(ch) ? 0.28 : /[ilI.,:;'|!]/.test(ch) ? 0.28 : /[mwMW%]/.test(ch) ? 0.82 : 0.55; return w * 14 * 1.05; };
  const rotulosCache = new Map();
  function rotularVenn(datos) {
    const k = datos.diagramas.length, apilar = !!datos.apilar && k > 1, alto = datos.alto || 6, mx = apilar ? (304 / 22 - 10) / 2 : datos.margen || 0;
    const esc = apilar ? 22 : k === 1 ? 304 / (10 + 2 * mx) : ((320 - 8 - 8) / 2 - 8) / 10, m = 3 / esc, pegado = 8 / esc;
    const clave = JSON.stringify([k, apilar, alto, mx, datos.diagramas.map(D => D.aros.map(a => [a.nombre, a.x, a.y, a.r]))]);
    if (rotulosCache.has(clave)) return rotulosCache.get(clave);
    const caja = (u, v, w) => ({ x0: u - w / 2, x1: u + w / 2, y0: v - 6.2 / esc, y1: v + 8.5 / esc });
    const dist = (b, K) => {
      const nx = Math.max(b.x0, Math.min(K.x, b.x1)), ny = Math.max(b.y0, Math.min(K.y, b.y1));
      return [Math.hypot(nx - K.x, ny - K.y), Math.max(...[[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => Math.hypot(x - K.x, y - K.y)))];
    };
    const contiene = (K, A) => Math.hypot(K.x - A.x, K.y - A.y) + A.r <= K.r + 1e-9;
    const out = datos.diagramas.map(D => {
      // Primero los aros chicos (los que tienen menos lugar), después los grandes; el orden del dibujo no cambia.
      const puestas = [], en = new Map();
      D.aros.slice().sort((a, b) => a.r - b.r).forEach(A => {
        const w = T_ANCHO(A.nombre) / esc, i = D.aros.indexOf(A);
        let mejor = null;
        for (let u = -mx; u <= 10 + mx + 0.001; u += 0.1) for (let v = 0; v <= alto + 0.001; v += 0.1) {
          const b = caja(u, v, w);
          if (b.x0 < -mx || b.x1 > 10 + mx || b.y0 < 0 || b.y1 > alto) continue;
          if (puestas.some(q => b.x0 < q.x1 + m && q.x0 < b.x1 + m && b.y0 < q.y1 + m && q.y0 < b.y1 + m)) continue;
          const ds = D.aros.map(K => dist(b, K));
          if (D.aros.some((K, j) => ds[j][0] < K.r + m && ds[j][1] > K.r - m)) continue;
          const dentroDe = j => ds[j][1] <= D.aros[j].r - m;
          const holgura = Math.min(...D.aros.map((K, j) => (ds[j][1] <= K.r ? K.r - ds[j][1] : ds[j][0] - K.r)));
          let puntos;
          if (dentroDe(i) && D.aros.every((K, j) => K === A || !dentroDe(j) || contiene(K, A))) puntos = 100 + Math.min(holgura, 0.6) * 10 - Math.hypot(u - A.x, v - A.y) * 0.01;
          else {
            const gap = ds[i][0] - A.r;
            const regla2 = D.aros.every((K, j) => !dentroDe(j)) && gap <= pegado && D.aros.every((K, j) => K === A || ds[j][0] - K.r > gap + 4 / esc);
            puntos = regla2 ? 50 - gap * 10 : -gap;
          }
          if (!mejor || puntos > mejor.puntos + 1e-9) mejor = { puntos, u, v, b };
        }
        if (!mejor) return;
        puestas.push(mejor.b);
        en.set(A, [Math.round(mejor.u * 10) / 10, Math.round(mejor.v * 10) / 10]);
      });
      return Object.assign({}, D, { aros: D.aros.map(A => (en.has(A) ? Object.assign({}, A, { en: en.get(A) }) : A)) });
    });
    rotulosCache.set(clave, out);
    return out;
  }
  const venn = d => Object.assign({}, d, { diagramas: rotularVenn(d) });
  const figVenn = (f, g, solo) => {
    const base = solo && SOLO_M[f] ? SOLO_M[f] : MUESTRA[f];
    const ds = base.map((aros, i) => ({ titulo: base.length > 1 ? `Dibujo ${i + 1}` : undefined, aros: aros.filter(a => !solo || solo.includes(a.g)).map(a => ({ nombre: g[a.g][0], papel: a.papel, x: a.x, y: a.y, r: a.r })) }));
    return { pieza: AR, datos: venn({ diagramas: solo ? ds.slice(0, 1) : ds, alto: solo && SOLO_M[f] ? 7.2 : ALTO_M[f], apilar: !solo && ds.length > 1 }), estado: {} };
  };
  // Las opciones de un silogismo: la conclusión (o «nada seguro») y afirmaciones entre los grupos de las puntas que no
  // son seguras, cada una con el error que la produce (hipótesis RMP de docs/investigacion/codigos-rm-procesos.md).
  function opcionesVenn(f, g, r) {
    const F_ = FORMAS[f], n = F_.n || 3, ms = modelosVenn(n, F_.p, `f${f}`), A = 0, Z = n - 1;
    const nada = `Nada seguro entre ${g[A][0]} y ${g[Z][0]}`;
    const ok = F_.c ? frase(g, F_.c) : nada;
    // Cada candidata se clasifica contando dibujos (auditoría A1, 17 nov): si cabe en alguno, «pasa en un dibujo, pero no
    // en todos»; si no cabe en ninguno, «choca con las premisas». La explicación nunca dice que pasa lo que no pasa.
    const cands = [T_('algunos', A, Z), T_('ningun', A, Z), T_('todos', A, Z), T_('todos', Z, A), T_('algunosNo', A, Z), T_('algunos', Z, 1)]
      .filter(a => !segura(ms, a)).map(a => {
        const texto = frase(g, a), cabe = posible(ms, a);
        const cambia = F_.c && ((F_.c.q === 'ningun' && a.q === 'algunos') || (F_.c.q === 'algunos' && a.q !== 'algunos'));
        const err = !cabe ? (cambia ? 'RMP74' : 'RMP72') : a.q === 'todos' && a.x === Z ? 'RMP73' : !F_.c ? 'RMP76' : cambia ? 'RMP74' : 'RMP77';
        const siFuera = !cabe ? (cambia ? `Cambia «${F_.c.q === 'ningun' ? 'ningún' : 'algunos'}» por otra palabra, y choca con las premisas: no cabe en ningún dibujo.`
          : 'Choca con las premisas: no cabe en ningún dibujo que las cumpla.')
          : err === 'RMP73' ? 'Lee «todos» al revés: pasa en un dibujo, pero no en todos los que cumplen las premisas.'
            : err === 'RMP76' ? 'Pasa en un dibujo, pero en otro no: el grupo del medio no amarra a los otros dos.'
              : err === 'RMP74' ? `Cambia «${F_.c.q === 'ningun' ? 'ningún' : 'algunos'}» por otra palabra: pasa en un dibujo, pero otro que cumple las premisas la rompe.`
                : 'Pasa en un dibujo posible, pero no en todos los que cumplen las premisas.';
        return { id: `${a.q}${a.x}${a.y}`, texto, error: err, siFuera, cabe };
      });
    const ops = [{ id: 'c', texto: ok, correcta: true }].concat(r.barajar(cands).slice(0, 3).map(({ cabe, ...o }) => o));
    if (F_.c && ops.length < 5) ops.push({ id: 'nada', texto: nada, error: 'RMP78', siFuera: 'En todos los dibujos que cumplen las premisas pasa lo mismo: sí hay conclusión.' });
    return ops;
  }
  const CAT = [['ajedrecistas', 'ajedrecista'], ['músicos', 'músico'], ['ciclistas', 'ciclista'], ['lectores', 'lector'], ['nadadores', 'nadador'], ['pintores', 'pintor'], ['cantantes', 'cantante'], ['danzantes', 'danzante'], ['delegados', 'delegado']];
  const premisasT = (g, F_) => F_.p.map(a => `${frase(g, a)}.`).join(' ');

  const ideaVenn = {
    id: 'conclusion-necesaria',
    titulo: 'Lo que vale en todo dibujo',
    pregunta: '¿Cuándo se puede asegurar una conclusión?',
    temas: ['Diagramas lineales y de Venn-Euler'],
    pieza: AR,
    aprendizaje: 'Una conclusión es segura si se cumple en todos los dibujos que respetan las premisas; basta un dibujo que la rompa para descartarla.',
    actividad: 'Mover el aro de la diablada y ver qué dibujos cumplen las premisas.',
    // Lee: el patio, premisa y conclusión, «algunos». No dice si la diablada tiene que tocar a los quenistas (es el juego).
    lee: {
      tarjetas: [
        { titulo: 'Los aros del patio', texto: 'En educación física, el profesor pone aros en el patio. Cada aro es un grupo: dentro del aro de la banda se paran los de la banda; dentro del de quenistas, los que tocan quena.',
          pieza: AR, dibujo: { datos: patio(null), estado: {} } },
        { titulo: 'Premisas y conclusión', texto: 'Una premisa es un dato que se acepta para razonar: «todos los quenistas están en la banda». Se dibuja con el aro de quenistas entero dentro del de la banda. Lo que se afirma a partir de las premisas es la conclusión.' },
        { titulo: 'Qué dice «algunos»', texto: '«Algunos de la banda bailan diablada» dice que al menos uno lo hace, y quizás todos. No quiere decir «unos sí y otros no». En el dibujo, los dos aros comparten un pedazo con alguien adentro.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover el aro de la diablada. En cada lugar, revisa si se cumplen las dos premisas y si algún quenista queda dentro de ese aro.' },
      ],
    },
    juega: {
      pieza: AR,
      consigna: 'Premisas: todos los quenistas están en la banda; algunos de la banda bailan diablada. Cada aro del patio es un grupo.',
      mision: {
        texto: 'Pon el aro de la diablada sin tocar a ningún quenista.',
        logrado: v => patioDe(v.c).cumple && patioDe(v.c).bailanQ === 0 && !tocanA(LUGAR[v.c], QUEN),
        bien: ['Las premisas permiten este dibujo: no obligan a que algún quenista baile.'],
      },
      voz: 'Cada lugar del aro es un dibujo posible. Probemos todos.',
      leyenda: [
        { s: O('quenistas'), t: 'aro de los que tocan quena' },
        { s: 'banda', t: 'aro de los que tocan en la banda' },
        { s: I('diablada'), t: 'aro de los que bailan diablada' },
        { s: 'aro gris punteado', t: 'dibujo que no cumple las premisas' },
      ],
      controles: [{ id: 'c', etiqueta: 'Aro de la diablada', inicio: 'cruza', opciones: [{ valor: 'cruza', texto: 'Cruza' }, { valor: 'cubre', texto: 'Cubre' }, { valor: 'lejos', texto: 'Lejos' }, { valor: 'fuera', texto: 'Fuera' }] }],
      dibujo: v => ({ datos: patio(v.c), estado: {} }),
      lectura: v => lecturaPatio(v.c),
      minimo: 3,
      // Arrastra el aro de la diablada: cae en el lugar posible más cercano.
      arrastres: [{ id: 'aro-diablada', etiqueta: 'aro de la diablada', color: 'c-i',
        donde: v => Kit.piezas[AR].patioPx(LUGAR[v.c].x, LUGAR[v.c].y),
        mover: (pt, v) => { const p = Kit.piezas[AR].patioPiso(pt); return { c: Object.keys(LUGAR).reduce((m, k) => (Math.hypot(LUGAR[k].x - p.x, LUGAR[k].y - p.y) < Math.hypot(LUGAR[m].x - p.x, LUGAR[m].y - p.y) ? k : m), v.c) }; } }],
    },
    predice: {
      pregunta: 'Otras premisas: todos los quenistas están en la banda; ningún integrante de la banda baila diablada. ¿Qué se puede asegurar?',
      datos: ['«Ningún … es …»: nadie está en los dos grupos a la vez.'],
      voz: 'Busca dónde puede ir el aro de la diablada.',
      opciones: [
        { id: 'c', texto: 'Ningún quenista baila diablada', correcta: true },
        { id: 'algunos', texto: 'Algunos quenistas bailan diablada', error: 'RMP74', siFuera: 'Valdría si los aros pudieran tocarse. «Ningún» los separa, y los quenistas van dentro de la banda.' },
        { id: 'nada', texto: 'Nada: no juntan a quenistas y los de la diablada', error: 'RMP78', siFuera: 'Es cierto que no los nombra juntos; pero los quenistas van dentro de la banda, lejos de la diablada.' },
        { id: 'reves', texto: 'Todos los de la banda tocan quena', error: 'RMP73', siFuera: 'Es la premisa al revés: dice que los quenistas están en la banda, no que toda la banda toque quena.' },
      ],
      dibujo: { datos: patio(null, { nota: 'Banda y quenistas; falta la diablada' }), estado: {} },
      revelar: { datos: patio('fuera', { cumple: true, nota: 'Fuera de la banda: lejos de los quenistas' }), estado: {} },
      coincide: 'Coincide: la diablada no puede tocar a la banda, y los quenistas están dentro de la banda.',
      noCoincide: 'Revisemos: «ningún» deja la diablada fuera de la banda, y con ella, lejos de todo quenista.',
    },
    mira: {
      pieza: AR,
      datos: venn(MIRA3_()),
      voz: 'Los aros vistos desde arriba forman un diagrama de Venn.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Premisa 1: el aro de quenistas va entero dentro del de la banda.' },
        { estado: { corte: 2 }, texto: 'Dibujo 1: la diablada toca a la banda y cruza a los quenistas.', ecuacion: ['aquí algún ', O('quenista'), ' baila ', I('diablada')] },
        { estado: { corte: 3 }, texto: 'Dibujo 2: la diablada toca a la banda lejos de los quenistas.', ecuacion: ['aquí ningún ', O('quenista'), ' baila ', I('diablada')] },
        { estado: { corte: 3 }, texto: 'Los dos cumplen las premisas y se contradicen: no se asegura nada.' },
      ],
    },
    regla: {
      texto: 'Una conclusión es segura solo si se cumple en todos los dibujos que respetan las premisas. Basta un dibujo que la rompa para descartarla.',
      // A y B en tinta: en la forma general ninguno es «el primero» ni «el segundo» (auditoría B9).
      ecuacion: [{ llave: ['todos los A son B'], nota: 'A adentro' }, '   ·   ', { llave: ['ningún A es B'], nota: 'no se tocan' }, '   ·   ', { llave: ['algunos A son B'], nota: 'comparten un pedazo' }],
      condicion: 'cada premisa se dibuja tal como dice, sin agregar nada: «algunos» no dice cuáles ni cuántos.',
      voz: 'Una conclusión vale si resiste el dibujo que intenta romperla.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_VENN)
    // Así se resuelve: un silogismo (formas 0 a 5), la primera premisa dibujada en el enunciado y los dibujos que cumplen
    // las dos en la solución. «Ahora tú» pregunta otra forma y otros grupos (semilla + 900).
    resuelve: {
      pieza: AR,
      generar(s) {
        const r = azar(s + 900), f = (s + 3) % 6, F_ = FORMAS[f], g = r.barajar(CAT).slice(0, 3);
        // Para «¿Tiene sentido?» se elige, si la hay, una opción que pasa en algún dibujo (el error más tentador).
        const ops = opcionesVenn(f, g, r), ok = ops.find(o => o.correcta), malas = ops.filter(o => !o.correcta && o.id !== 'nada');
        const mal = malas.find(o => /^Pasa en un dibujo/.test(o.siFuera)) || malas.find(o => /pasa en un dibujo/.test(o.siFuera)) || malas[0] || ops.find(o => !o.correcta);
        const dos = MUESTRA[f].length > 1;
        return {
          enunciado: `${premisasT(g, F_)} ¿Qué se concluye con certeza sobre ${g[0][0]} y ${g[2][0]}?`,
          datos: datosVenn(F_.p),
          dibujo: figVenn(f, g, [0, 1]),
          pasos: [
            { tipo: 'pide', texto: `Piden lo que vale en todo dibujo que cumpla las dos premisas, sobre ${g[0][0]} y ${g[2][0]}.` },
            { tipo: 'datos', texto: `Premisa 1: ${frase(g, F_.p[0]).toLowerCase()}. Premisa 2: ${frase(g, F_.p[1]).toLowerCase()}.` },
            { tipo: 'regla', texto: 'Dibujo cada grupo como un aro, tal como dicen las premisas, sin agregar nada. Es seguro solo lo que pasa en todos los dibujos posibles.' },
            { tipo: 'aplica', texto: dos ? `Hay dibujos que dicen cosas distintas: en uno los aros de ${g[0][0]} y ${g[2][0]} se cruzan; en otro, no.` : `En todo dibujo que cumple las dos premisas pasa lo mismo: ${ok.texto.charAt(0).toLowerCase()}${ok.texto.slice(1)}.`, dibujo: figVenn(f, g) },
            { tipo: 'sentido', texto: `¿Y «${mal.texto}»? ${mal.siFuera}` },
          ],
          respuesta: [F(ok.texto)],
        };
      },
    },
    // Ahora tú: las siete formas; la 5 (algunos y ningún) y la 6 (tres premisas) son de examen, con «¿cuál es
    // necesariamente verdadera?». Cada opción se cuenta en los dibujos (modelosVenn).
    ahoraTu: {
      pieza: AR,
      voz: 'Dibuja las premisas y busca un dibujo que rompa cada opción.',
      generar(s) {
        const r = azar(s), f = s % 7, F_ = FORMAS[f], n = F_.n || 3, g = r.barajar(CAT).slice(0, n);
        const examen = f >= 5;
        return {
          pregunta: `${premisasT(g, F_)} ${examen ? '¿Cuál es necesariamente verdadera?' : '¿Qué se concluye con certeza?'}`,
          datos: datosVenn(F_.p),
          opciones: opcionesVenn(f, g, r),
          solucion: { texto: F_.c ? `En todo dibujo que cumple las premisas: ${frase(g, F_.c).charAt(0).toLowerCase()}${frase(g, F_.c).slice(1)}.` : `Hay un dibujo donde ${g[0][0]} y ${g[2][0]} se cruzan y otro donde no: nada seguro.`, dibujo: figVenn(f, g) },
        };
      },
    },
  };


  // ---------- Idea 4: si llueve, la pista se moja (etapa 3, 17 nov) ----------
  // Objeto de la primera pantalla: la calle frente al colegio, con una nube, un camión cisterna y la pista (rm-casos, escena
  // «calle», dibujo de prueba), y la tabla de los cuatro casos al lado. Cambia: el dato que se sabe. · Permanece: la regla y
  // los cuatro casos. · Progresa: los casos tachados. · Se reserva: «la pista está seca» (la forma indirecta, la
  // predicción). · Debe verse: se concluye solo cuando queda un caso, y la cisterna explica «mojada sin lluvia».
  // Todo sale de tachar casos (casosQuedan): ninguna fila se tacha a mano (regla 1). Sin tabla de verdad ni símbolos de
  // lógica: p y q se dicen en palabras (docs/etapa3/propuesta-razonamiento-matematico.md, pregunta 9.3).
  const CA = 'rm-casos';
  const CASOS4 = [[true, true], [true, false], [false, true], [false, false]];
  const prohibe = c => c[0] && !c[1];   // la regla «si p, q» solo prohíbe p sin q
  const DATO4 = { nada: () => true, llueve: c => c[0], 'no-llueve': c => !c[0], mojada: c => c[1], seca: c => !c[1] };
  const casosQuedan = d => CASOS4.filter(c => !prohibe(c) && DATO4[d](c));
  const V4 = [{ t: 'Llueve', papel: 'primero', si: 'llueve', no: 'no llueve' }, { t: 'Pista', papel: 'segundo', si: 'mojada', no: 'seca' }];
  const CALLE4 = { nada: { lluvia: null, pista: null }, llueve: { lluvia: true, pista: null }, 'no-llueve': { lluvia: false, pista: null }, mojada: { lluvia: null, pista: true }, seca: { lluvia: null, pista: false } };
  const REGLA4 = 'Regla: si llueve, la pista se moja.';
  // Las filas de un dato: tachadas por la regla (desde dReg) o por el dato (desde dDato); la que queda sola, segura.
  const filas4 = (d, o = {}) => {
    const q = casosQuedan(d);
    return CASOS4.map(c => ({ v: c, fuera: prohibe(c) ? 'regla' : !DATO4[d](c) ? 'dato' : false, desde: prohibe(c) ? o.dReg || 0 : o.dDato || 0,
      seguro: q.length === 1 && q[0] === c ? (o.dSeg === undefined ? true : o.dSeg) : false }));
  };
  const calle4 = (d, o = {}) => ({ escena: 'calle', calle: CALLE4[d], regla: REGLA4, tablas: [{ vars: V4, filas: o.sinSeguro ? filas4(d).map(f => Object.assign({}, f, { seguro: false })) : filas4(d) }], nota: o.nota });
  const dicho4 = c => `${c[0] ? 'llueve' : 'no llueve'} y la pista está ${c[1] ? 'mojada' : 'seca'}`;
  const lectura4 = d => {
    const q = casosQuedan(d);
    if (d === 'nada') return [`Sin dato, la regla tacha un caso: quedan ${q.length}`];
    if (q.length === 1) return ['Queda un solo caso: ', F(dicho4(q[0]))];
    return d === 'mojada' ? [`Quedan ${q.length}: lluvia o cisterna; no se sabe si llovió`] : [`Quedan ${q.length}: pista seca, o mojada por la cisterna`];
  };
  // Mira: «seca» y «mojada», lado a lado (lo que se compara se ve junto).
  const MIRA4 = { tablas: [
    { titulo: 'Dato: seca', vars: V4.map(v => Object.assign({}, v, { t: v.t })), filas: filas4('seca', { dReg: 0, dDato: 1, dSeg: 2 }) },
    { titulo: 'Dato: mojada', vars: V4, filas: filas4('mojada', { dReg: 0, dDato: 3 }) }] };

  // ---------- Casos generados ----------
  // Reglas de todos los días: [p, no p, lo que trae (corto), q, no q]. Una frase con «no» se niega quitándolo.
  const SITUACIONES = [
    ['Luis estudia', 'Luis no estudia', 'aprueba', 'Luis aprueba', 'Luis no aprueba'],
    ['el foco está prendido', 'el foco no está prendido', 'hay corriente', 'hay corriente', 'no hay corriente'],
    ['un número termina en 0', 'el número no termina en 0', 'es par', 'el número es par', 'el número no es par'],
    ['el pan está en el horno', 'el pan no está en el horno', 'está caliente', 'el pan está caliente', 'el pan no está caliente'],
    ['la puerta está abierta', 'la puerta no está abierta', 'entra el gato', 'entra el gato', 'no entra el gato'],
    ['Rosa tiene fiebre', 'Rosa no tiene fiebre', 'falta al colegio', 'Rosa falta al colegio', 'Rosa no falta al colegio'],
  ];
  const D_SI = '«Si p, entonces q»: siempre que pasa p, también pasa q.';
  const tablaPQ = (sit, dato, o = {}) => {
    const v = [{ t: 'p', papel: 'primero', si: 'sí', no: 'no' }, { t: 'q', papel: 'segundo', si: 'sí', no: 'no' }];
    // Sin dato, la tabla va limpia (el planteamiento): la regla tacha recién cuando se aplica.
    const filas = CASOS4.map(c => ({ v: c, fuera: !dato ? false : prohibe(c) ? 'regla' : !DATO4[dato](c) ? 'dato' : false, seguro: !o.sinSeguro && !!dato && casosQuedan(dato).length === 1 && casosQuedan(dato)[0] === c }));
    return { pieza: CA, datos: { tablas: [{ vars: v, filas }] }, estado: {} };
  };
  // Un caso simple: regla «si p, q» y un dato (p, no q, q o no p). Lo que se concluye sale de los casos que quedan.
  function simple4(r) {
    const sit = r.elegir(SITUACIONES), tipo = r.ent(0, 3);
    const dato = ['llueve', 'seca', 'mojada', 'no-llueve'][tipo], sabe = [sit[0], sit[4], sit[3], sit[1]][tipo];
    const q = casosQuedan(dato);
    // Con p se concluye q (directa); con «no q», «no p» (indirecta); con q o con «no p», nada.
    const concl = q.length === 1 ? (q[0][0] ? `Que ${sit[3]}` : `Que ${sit[1]}`) : 'Nada con certeza';
    return { sit, tipo, dato, sabe, q, concl };
  }
  // Las opciones de un caso simple, cada una explicada con los casos que de verdad quedan (auditoría A2, 17 nov): si
  // contradice el dato, si choca con la regla (es el caso que prohíbe) o si pasa en uno de los casos que quedan, y no en
  // el otro. Cada opción afirma una parte: [j, v] (j = 0 es p, j = 1 es q; v: pasa o no pasa).
  function opcionesSimple4(c) {
    const enDato = CASOS4.filter(x => DATO4[c.dato](x)), quedan = c.q;
    const textoDe = (j, v) => `Que ${c.sit[j === 0 ? (v ? 0 : 1) : (v ? 3 : 4)]}`;
    const explica = (j, v) => {
      if (!enDato.some(x => x[j] === v)) return { error: 'RMP72', siFuera: `Contradice el dato: se sabe que ${c.sabe}.` };
      if (!quedan.some(x => x[j] === v)) return { error: 'RMP72', siFuera: '«p sí, q no» es justo el caso que la regla prohíbe: con el dato, no queda ningún caso así.' };
      const n = quedan.length;
      if (j === 0 && v) return { error: 'RMP70', siFuera: `Valdría si la regla también fuera al revés. Con este dato quedan ${n} casos, y en uno no pasa p.` };
      if (j === 1 && !v) return { error: 'RMP71', siFuera: `Valdría si la regla dijera también «si no p, no q». Quedan ${n} casos, y en uno pasa q.` };
      return { error: 'RMP77', siFuera: `Pasa en uno de los ${n} casos que quedan, pero no en el otro.` };
    };
    const ops = [{ id: 'nada', texto: 'Nada con certeza', error: 'RMP78', siFuera: 'La regla y el dato dejan un solo caso en pie: sí hay conclusión.' }];
    for (const [id, j, v] of [['q', 1, true], ['p', 0, true], ['nq', 1, false], ['np', 0, false]]) ops.push(Object.assign({ id, texto: textoDe(j, v) }, explica(j, v)));
    return ops;
  }

  // Cadena de dos reglas: «si p, q» y «si q, r», con un dato. 8 casos de p, q y r.
  const CADENAS = [
    [['el frasco es rojo', 'el frasco no es rojo'], ['tiene canicas', 'no tiene canicas'], ['pesa más de 1 kg', 'no pesa más de 1 kg']],
    [['Ana llega temprano', 'Ana no llega temprano'], ['ayuda a ordenar', 'no ayuda a ordenar'], ['sale primero al recreo', 'no sale primero al recreo']],
    [['hay examen', 'no hay examen'], ['Beto estudia de noche', 'Beto no estudia de noche'], ['Beto duerme poco', 'Beto no duerme poco']],
    [['la tienda abre', 'la tienda no abre'], ['venden pan', 'no venden pan'], ['hay fila en la puerta', 'no hay fila en la puerta']],
  ];
  const CASOS8 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => [!(i & 4), !(i & 2), !(i & 1)]);
  const prohibe8 = c => (c[0] && !c[1]) || (c[1] && !c[2]);

  // Reparto con una regla (asignación, como San Marcos 2021): «si X hace a, Y hace b», más pistas de idea 1.
  function asignacion(r) {
    const ctx = CTX[0], ps = r.barajar(GENTE).slice(0, 3), co = ctx.cosas.slice(0, 3);
    for (let intento = 0; intento < 300; intento++) {
      const sol = r.elegir(PERM3);
      // La regla «si X hace a, Y hace b»: su segunda parte es falsa en el reparto (y la pista 1 lo dice), así que se usa
      // la forma indirecta: X no hace a.
      const x = r.ent(0, 2), a = r.elegir([0, 1, 2].filter(j => j !== sol[x])), y = r.elegir([0, 1, 2].filter(i => i !== x));
      const b = r.elegir([0, 1, 2].filter(j => j !== sol[y]));
      const regla = p => p[x] !== a || p[y] === b;
      const lineas = [{ q: y, c: b }];
      const quedan = (conRegla, ls) => PERM3.filter(p => (!conRegla || regla(p)) && ls.every(l => p[l.q] !== l.c));
      for (let j = 0; j < 4 && quedan(true, lineas).length > 1; j++) {
        const q = r.ent(0, 2), c = r.elegir([0, 1, 2].filter(k => k !== sol[q]));
        if (!lineas.some(l => l.q === q && l.c === c)) lineas.push({ q, c });
      }
      const ok = quedan(true, lineas);
      if (ok.length !== 1 || lineas.length > 4) continue;
      // La regla tiene que hacer falta: sin ella, la persona por la que se pregunta no queda decidida.
      const sinRegla = quedan(false, lineas);
      const preg = [0, 1, 2].find(i => new Set(sinRegla.map(p => p[i])).size > 1);
      if (preg === undefined) continue;
      return { ps, co, ctx, x, a, y, b, lineas, sol: ok[0], preg, sinRegla };
    }
    return null;
  }

  const ideaSi = {
    id: 'si-entonces',
    titulo: 'Si llueve, la pista se moja',
    pregunta: '¿Qué se concluye de un «si…, entonces…»?',
    temas: ['Deductivo directo e indirecto'],
    pieza: CA,
    aprendizaje: 'Un «si…, entonces…» solo prohíbe un caso: que pase lo primero sin lo segundo. Por eso, si no pasó lo segundo, no pasó lo primero.',
    actividad: 'Elegir qué se sabe de la calle y contar cuántos casos quedan en pie.',
    // Lee: el condicional y sus dos partes, los cuatro casos y la cisterna. No dice qué pasa con «la pista está seca».
    lee: {
      tarjetas: [
        { titulo: 'La calle del colegio', texto: 'Frente al colegio pasa la pista. Cuando llueve, se moja. Pero también se moja cuando pasa el camión cisterna que riega la calle.',
          pieza: CA, dibujo: { datos: { escena: 'calle', calle: CALLE4.nada }, estado: {} } },
        { titulo: 'Una regla con «si»', texto: '«Si llueve, la pista se moja» es un condicional. Tiene dos partes: lo primero, que se llama p (llueve), y lo que trae consigo, que se llama q (la pista se moja).',
          ecuacion: ['si ', O('p'), ', entonces ', I('q')] },
        { titulo: 'Cuatro casos', texto: 'Antes de saber nada pueden pasar cuatro cosas: llueve o no llueve, y la pista queda mojada o seca. La tabla pone cada caso en una fila. La regla prohíbe uno: que llueva y la pista siga seca.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir qué se sabe de la calle. Cuenta cuántos casos quedan en pie: si queda uno solo, se sabe todo lo que pasó.' },
      ],
    },
    juega: {
      pieza: CA,
      consigna: 'Regla: si llueve, la pista se moja. La cisterna también la moja cuando riega la calle.',
      mision: {
        texto: 'Elige un dato con el que quede un solo caso.',
        logrado: v => casosQuedan(v.dato).length === 1,
        bien: ['Con lluvia solo cabe la pista mojada: es lo que asegura la regla.'],
      },
      voz: 'Lo que quede en pie es todo lo que puede pasar.',
      leyenda: [
        { s: O('llueve'), t: 'lo primero (p): la lluvia' },
        { s: I('mojada'), t: 'lo segundo (q): la pista mojada' },
        { s: 'fila tachada', t: 'caso que la regla o el dato prohíben' },
        { s: F('✓'), t: 'el único caso que queda: se concluye' },
      ],
      controles: [{ id: 'dato', etiqueta: 'Se sabe', opciones: [{ valor: 'nada', texto: 'Nada aún' }, { valor: 'llueve', texto: 'Llueve' }, { valor: 'no-llueve', texto: 'No llueve' }, { valor: 'mojada', texto: 'Está mojada' }] }],
      dibujo: v => ({ datos: calle4(v.dato), estado: {} }),
      lectura: v => lectura4(v.dato),
      minimo: 4,
    },
    predice: {
      pregunta: 'Misma regla. Pasas por la calle y la pista está seca. ¿Qué se puede asegurar?',
      voz: 'Tacha los casos que no pueden ser.',
      opciones: [
        { id: 'c', texto: 'Que no llovió', correcta: true },
        { id: 'nada', texto: 'Nada: la regla solo habla de cuando llueve', error: 'RMP78', siFuera: 'Es cierto que la regla empieza con la lluvia, pero prohíbe justo «llueve y la pista seca».' },
        { id: 'secó', texto: 'Que llovió y ya se secó', error: 'RMP87', siFuera: 'Eso le agrega tiempo a la regla. Tal como está, con lluvia la pista no queda seca.' },
      ],
      dibujo: { datos: calle4('nada', { sinSeguro: true }), estado: {} },
      revelar: { datos: calle4('seca'), estado: {} },
      coincide: 'Coincide: con la pista seca, el único caso que queda es «no llueve».',
      noCoincide: 'Revisemos: la regla tacha «llueve y seca», y el dato tacha los casos con pista mojada. Queda «no llueve».',
    },
    mira: {
      pieza: CA,
      datos: MIRA4,
      voz: 'Primero tacha la regla; después, el dato.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La regla tacha el caso 2: llueve y la pista sigue seca.' },
        { estado: { corte: 1 }, texto: 'Con «seca», el dato tacha los casos con pista mojada.' },
        { estado: { corte: 2 }, texto: 'Queda un solo caso: no llovió. Es la forma indirecta.', ecuacion: ['«si ', O('p'), ', entonces ', I('q'), '» y no pasa ', I('q'), ': se concluye ', F('no p')] },
        { estado: { corte: 3 }, texto: 'Con «mojada» quedan dos casos: lluvia o cisterna. No se sabe si llovió.' },
      ],
    },
    regla: {
      texto: '«Si p, entonces q» solo prohíbe un caso: p sin q. Si pasa p, pasa q. Si no pasa q, no pasó p. Saber q o «no p» no basta.',
      // En palabras, sin «;» ni «:» como signos propios (auditoría M3, 17 nov).
      // «si p, entonces q», con «entonces» y entre comillas (lector en frío, ronda 2: «si p, q» con una sola coma se leía mal).
      ecuacion: [{ llave: ['«si ', O('p'), ', entonces ', I('q'), '» y pasa ', O('p')], nota: 'forma directa' }, ' se concluye ', F('q'), '   ·   ', { llave: ['«si ', O('p'), ', entonces ', I('q'), '» y no pasa ', I('q')], nota: 'forma indirecta' }, ' se concluye ', F('no p')],
      condicion: 'la regla vale siempre, sin excepciones, y p y q significan lo mismo en todo el razonamiento.',
      voz: 'Con q o con «no p» quedan dos casos: no se concluye.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_SI)
    // Así se resuelve: una regla de todos los días y un dato, con la tabla de cuatro casos (semilla + 900).
    resuelve: {
      pieza: CA,
      generar(s) {
        const r = azar(s + 900), c = simple4(r), una = c.q.length === 1;
        const filasQ = CASOS4.map((x, k) => k).filter(k => !prohibe(CASOS4[k]) && DATO4[c.dato](CASOS4[k]));
        const caso = k => `${CASOS4[k][0] ? c.sit[0] : c.sit[1]} y ${CASOS4[k][1] ? c.sit[3] : c.sit[4]}`;
        return {
          enunciado: `Regla: si ${c.sit[0]}, ${c.sit[2]}. Se sabe que ${c.sabe}. ¿Qué se concluye con certeza?`,
          datos: [D_SI, `p: ${c.sit[0]}. q: ${c.sit[3]}.`],
          dibujo: tablaPQ(c.sit, null, { sinSeguro: true }),
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que es seguro sabiendo la regla y el dato.' },
            { tipo: 'datos', texto: `p: ${c.sit[0]}. q: ${c.sit[3]}. El dato dice: ${c.sabe}.` },
            { tipo: 'regla', texto: 'Armo los cuatro casos de p y q. La regla tacha «p sí, q no»; el dato tacha los que no lo cumplen. Si queda uno, se concluye.' },
            { tipo: 'aplica', texto: una ? `La regla tacha el caso 2 y el dato deja solo el caso ${filasQ[0] + 1}: ${caso(filasQ[0])}.` : `La regla tacha el caso 2, pero el dato deja dos casos en pie: el ${filasQ[0] + 1} y el ${filasQ[1] + 1}.`, dibujo: tablaPQ(c.sit, c.dato) },
            { tipo: 'sentido', texto: una ? 'Compruebo: en ese caso se cumplen la regla y el dato a la vez, y en ningún otro.' : 'Compruebo: los dos casos cumplen la regla y el dato, pero dicen cosas distintas. Nada vale en los dos.' },
          ],
          respuesta: [F(c.concl)],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 y 1, una regla y un dato (forma directa, indirecta, o nada); 2, dos reglas en
    // cadena (frascos y horarios, como San Marcos 2023-II); 3, un reparto con una regla (San Marcos 2021).
    ahoraTu: {
      pieza: CA,
      voz: 'Arma los casos y tacha lo que la regla y el dato prohíben.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo <= 1) {
          const c = simple4(r);
          return {
            pregunta: `Regla: si ${c.sit[0]}, ${c.sit[2]}. Se sabe que ${c.sabe}. ¿Qué se concluye con certeza?`,
            datos: [D_SI],
            opciones: opcionesTexto(c.concl, opcionesSimple4(c).filter(o => o.texto !== c.concl && o.texto !== `Que ${c.sabe}`)),
            solucion: { texto: c.q.length === 1 ? 'La regla y el dato tachan todos los casos menos uno.' : 'Quedan dos casos que dicen cosas distintas: no se decide.', dibujo: tablaPQ(c.sit, c.dato) },
          };
        }
        if (tipo === 2) {
          const cad = r.elegir(CADENAS), k = r.ent(0, 3), dice = (j, v) => cad[j][v ? 0 : 1];
          // Dato: p (directa en cadena), no r (indirecta en cadena), r o no p (no se concluye nada nuevo).
          const dj = [0, 2, 2, 0][k], dv = [true, false, true, false][k];
          const quedan = CASOS8.filter(x => !prohibe8(x) && x[dj] === dv);
          const estado = (j, v) => (quedan.every(x => x[j] === v) ? 'seguro' : quedan.some(x => x[j] === v) ? 'posible' : 'imposible');
          const ok = k === 0 ? `Que ${dice(2, true)}` : k === 1 ? `Que ${dice(0, false)}` : 'Nada nuevo con certeza';
          const ops = [{ id: 'c', texto: ok, correcta: true }];
          if (k <= 1) ops.push({ id: 'nada', texto: 'Nada nuevo con certeza', error: 'RMP78', siFuera: 'Las dos reglas encadenadas dejan un solo caso para la otra punta: sí hay conclusión.' });
          for (const [j, v] of r.barajar([[0, true], [0, false], [1, true], [1, false], [2, true], [2, false]])) {
            if (ops.length >= 4 || j === dj || estado(j, v) === 'seguro') continue;
            // Al revés: afirmar lo de antes desde lo de después (dato r). Negar las dos: negar lo de después desde «no p».
            const pos = estado(j, v) === 'posible', reves = v && dv && j < dj, niega = !v && !dv && j > dj;
            ops.push({ id: `x${j}${v ? 1 : 0}`, texto: `Que ${dice(j, v)}`, error: !pos ? 'RMP72' : reves ? 'RMP70' : niega ? 'RMP71' : 'RMP77',
              siFuera: !pos ? 'Choca con las reglas: con el dato, ese caso queda tachado.' : reves ? 'Pasa en un caso posible, pero no en todos: las reglas no van al revés.'
                : niega ? 'Pasa en un caso posible, pero no en todos: las reglas no dicen qué pasa sin lo primero.' : 'Pasa en un caso posible, pero no en todos los que quedan.' });
          }
          const v3 = [{ t: 'p', papel: 'primero', si: 'sí', no: 'no' }, { t: 'q', papel: 'segundo', si: 'sí', no: 'no' }, { t: 'r', papel: 'tercero', si: 'sí', no: 'no' }];
          return {
            pregunta: `Reglas: si ${dice(0, true)}, ${dice(1, true)}; y si ${dice(1, true)}, ${dice(2, true)}. Se sabe que ${dice(dj, dv)}. ¿Qué es siempre cierto?`,
            datos: [D_SI, `p: ${dice(0, true)}. q: ${dice(1, true)}. r: ${dice(2, true)}.`],
            opciones: ops,
            solucion: { texto: k <= 1 ? 'Las reglas y el dato dejan un solo valor para la otra punta de la cadena.' : 'Quedan casos que dicen cosas distintas: no se decide nada nuevo.',
              dibujo: { pieza: CA, datos: { tablas: [{ vars: v3, filas: CASOS8.map(x => ({ v: x, fuera: prohibe8(x) ? 'regla' : x[dj] !== dv ? 'dato' : false, seguro: quedan.length === 1 && quedan[0] === x })) }] }, estado: {} } },
          };
        }
        const c = asignacion(r);
        if (!c) return this.generar(s + 4);
        const hace = (i, j) => `${c.ps[i]} ${c.ctx.hace} ${c.co[j]}`;
        const ops = c.co.map((t, j) => (j === c.sol[c.preg] ? { id: 'c', texto: mayus(t), correcta: true }
          : { id: `x${j}`, texto: mayus(t), error: c.sinRegla.some(p => p[c.preg] === j) ? 'RMP63' : 'RMP72', siFuera: c.sinRegla.some(p => p[c.preg] === j) ? 'Valdría sin la regla. Como la segunda parte no pasa, la primera tampoco: eso tacha este reparto.' : 'Choca con una de las pistas: revisa cada una.' }));
        ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'La regla también tacha: como su segunda parte no pasa, la primera tampoco.' });
        return {
          pregunta: `${lista(c.ps)} ${c.ctx.intro}: ${lista(c.co, 'o')}. ${c.ctx.que(c.ps[c.preg])}`,
          datos: [c.ctx.regla, `Regla: si ${hace(c.x, c.a)}, ${hace(c.y, c.b)}.`, ...c.lineas.map((l, i) => `Pista ${i + 1}: ${c.ps[l.q]} no ${c.ctx.hace} ${c.co[l.c]}.`)],
          opciones: ops,
          solucion: { texto: `Como ${c.ps[c.y]} no ${c.ctx.hace} ${c.co[c.b]}, ${c.ps[c.x]} no ${c.ctx.hace} ${c.co[c.a]}. Con las pistas, ${hace(c.preg, c.sol[c.preg])}.` },
        };
      },
    },
  };


  // ---------- Idea 5: subir y bajar por el árbol (etapa 3, 17 nov) ----------
  // Objeto de la primera pantalla: las fotos de la familia de Ana pegadas en un árbol, en el cumpleaños del abuelo Raúl
  // (rm-familia, escena «fotos», dibujo de prueba). Cambia: a quién llega el camino. · Permanece: el árbol de tres
  // generaciones. · Progresa: las líneas que se recorren. · Se reserva: una persona con dos papeles (la predicción). · Debe
  // verse: el camino se lee desde «mi», y un papel no es una persona nueva.
  // Todo sale del árbol (PADRE5, caminoDe): ningún parentesco se escribe a mano (regla 1).
  const FA = 'rm-familia';
  const PER5 = [
    { id: 'raul', nombre: 'Raúl', x: 5, g: 0, cara: 'abuelo' },
    { id: 'pedro', nombre: 'Pedro', x: 2.4, g: 1, cara: 'hombre' }, { id: 'tomas', nombre: 'Tomás', x: 7.6, g: 1, cara: 'hombre' },
    { id: 'ana', nombre: 'Ana', x: 1.0, g: 2, cara: 'nina' }, { id: 'luis', nombre: 'Luis', x: 3.8, g: 2, cara: 'nino' }, { id: 'ivan', nombre: 'Iván', x: 7.6, g: 2, cara: 'nino' },
  ];
  const PADRE5 = { pedro: 'raul', tomas: 'raul', ana: 'pedro', luis: 'pedro', ivan: 'tomas' };
  const LINEAS5 = Object.entries(PADRE5).map(([h, p]) => [p, h]);
  const NOM5 = Object.fromEntries(PER5.map(p => [p.id, p.nombre]));
  const subir = id => { const xs = [id]; while (PADRE5[xs[xs.length - 1]]) xs.push(PADRE5[xs[xs.length - 1]]); return xs; };
  // El camino de una persona a otra: sube hasta el antepasado común y baja.
  function caminoDe(de, a) {
    const sa = subir(de), sb = subir(a), comun = sa.find(x => sb.includes(x));
    const u = sa.indexOf(comun), d = sb.indexOf(comun);
    return { u, d, ids: sa.slice(0, u + 1).concat(sb.slice(0, d).reverse()) };
  }
  // Los nombres de cada camino (sube, baja), para un hombre y para una mujer.
  const NOMBRE = { '1,0': ['padre', 'madre'], '2,0': ['abuelo', 'abuela'], '3,0': ['bisabuelo', 'bisabuela'], '0,1': ['hijo', 'hija'], '0,2': ['nieto', 'nieta'], '0,3': ['bisnieto', 'bisnieta'],
    '1,1': ['hermano', 'hermana'], '2,1': ['tío', 'tía'], '1,2': ['sobrino', 'sobrina'], '2,2': ['primo', 'prima'], '3,1': ['tío abuelo', 'tía abuela'], '1,3': ['sobrino nieto', 'sobrina nieta'] };
  const MUJER = new Set(['ana']);
  const relDe = (de, a) => { const c = caminoDe(de, a); return NOMBRE[`${c.u},${c.d}`][MUJER.has(a) ? 1 : 0]; };
  const FRASE5 = '«el hijo del único hermano de mi papá»';
  const familia = (o = {}) => Object.assign({ escena: 'fotos', personas: PER5, lineas: LINEAS5 }, o);
  const juego5 = c => { const k = caminoDe('ana', c); return familia({ habla: 'ana', elegida: c, camino: { ids: k.ids }, nota: `Sube ${k.u} y baja ${k.d}` }); };
  const OPC5 = ['pedro', 'raul', 'tomas', 'ivan', 'luis'];
  const META5 = 'ivan';
  const H = (id, t, desde, lado) => ({ id, t, desde, lado });
  // Mira: la frase de Ana, tramo por tramo, desde «mi».
  const MIRA5 = familia({ habla: 'ana', pedida: { id: META5, desde: 4 },
    camino: [{ ids: ['ana', 'pedro'], desde: 2 }, { ids: ['pedro', 'raul', 'tomas'], desde: 3 }, { ids: ['tomas', 'ivan'], desde: 4 }],
    papeles: [H('pedro', 'mi papá', 2, 'izq'), H('tomas', 'su hermano', 3, 'izq'), H('ivan', 'su hijo', 4, 'izq')],
    nota: [{ t: 'Se lee desde «mi»: Ana', desde: 1 }, { t: 'Sube 1', desde: 2 }, { t: 'Sube 2 y baja 1', desde: 3 }, { t: `Sube 2 y baja 2: ${relDe('ana', META5)}`, desde: 4 }, { t: 'Pedro: hijo de Raúl y padre de Ana', desde: 5 }] });

  // ---------- Casos generados: cadenas de parentesco ----------
  // Cada relación: [nombre, sube, baja, 'm' | 'f']. Se componen solo las que no vuelven por la misma línea.
  const REL5 = [['padre', 1, 0, 'm'], ['madre', 1, 0, 'f'], ['hermano', 1, 1, 'm'], ['hermana', 1, 1, 'f'], ['hijo', 0, 1, 'm'], ['hija', 0, 1, 'f'], ['abuelo', 2, 0, 'm'], ['tío', 2, 1, 'm'], ['tía', 2, 1, 'f']];
  // Los nombres entre los que se elige (molde §4: si el ejercicio practica elegir, van todas las opciones).
  // Cada nombre en masculino y en femenino (lector en frío, ronda 2: «la lista dice sobrino y aquí es una hija»).
  const D_CAMINOS = ['Cada padre o madre: sube 1 línea. Cada hijo o hija: baja 1 línea.', 'Hermano o hermana: sube 1, baja 1. Tío o tía: sube 2, baja 1. Primo o prima: sube 2, baja 2.',
    'Abuelo o abuela: sube 2. Nieto o nieta: baja 2. Sobrino o sobrina: sube 1, baja 2.', 'Bisabuelo o bisabuela: sube 3. Bisnieto o bisnieta: baja 3.',
    'Tío abuelo o tía abuela: sube 3, baja 1. Sobrino nieto o sobrina nieta: sube 1, baja 3.'];
  function cadena5(r) {
    let r1, r2, u, d;
    for (;;) {
      r1 = r.elegir(REL5); r2 = r.elegir(REL5);
      if (r1[2] > 0 && r2[1] > 0) continue;               // bajar y volver a subir: no se sabe a quién se llega
      if (r1[2] === 0 && r2[1] === 0 && r2[2] > 0) continue; // subir y bajar por un hijo: puede volver a la misma rama
      u = r1[1] + r2[1]; d = r1[2] + r2[2];
      if (NOMBRE[`${u},${d}`]) break;
    }
    const yo = r.elegir([['Ana', 'f'], ['Rosa', 'f'], ['Luis', 'm'], ['Iván', 'm']]);
    const de = r1[3] === 'f' ? 'de la' : 'del', g2 = r2[3] === 'f' ? 1 : 0, gy = yo[1] === 'f' ? 1 : 0;
    // La frase desde «mi», como en el examen («el tío de mi madre»), y dicha desde afuera («el tío de la madre de Rosa»).
    const art = r2[3] === 'f' ? 'la' : 'el';
    const fraseMi = `${art} ${r2[0]} de mi ${r1[0]}`, fraseDe = `${art} ${r2[0]} ${de} ${r1[0]} de ${yo[0]}`;
    const datos = D_CAMINOS;
    const otro = r2[3] === 'f' ? 'Carmen' : 'Carlos';
    return { r1, r2, u, d, yo, fraseMi, fraseDe, g2, gy, datos, otro, nombre: NOMBRE[`${u},${d}`][g2], vuelta: NOMBRE[`${d},${u}`][gy] };
  }
  // El camino dibujado: a la izquierda lo que sube, arriba el antepasado común, a la derecha lo que baja. o.hasta: 'medio'
  // dibuja solo el primer tramo; o.fin: el nombre del parentesco al final (si no, «?»); o.camino: en trazo grueso.
  function caminoFig(c, o = {}) {
    const medio = c.r1[2] === 0 ? `u${c.r1[1]}` : `d${c.r1[2]}`, fin = c.d ? `d${c.d}` : `u${c.u}`;
    const P = [], L = [], ids = [];
    for (let i = 0; i <= c.u; i++) { P.push({ id: `u${i}`, x: i === c.u && c.d > 0 ? 5 : 1.6, g: c.u - i }); if (i) L.push([`u${i}`, `u${i - 1}`]); ids.push(`u${i}`); }
    for (let j = 1; j <= c.d; j++) { P.push({ id: `d${j}`, x: 8.4, g: j }); L.push([j === 1 ? `u${c.u}` : `d${j - 1}`, `d${j}`]); ids.push(`d${j}`); }
    for (const p of P) {
      p.nombre = p.id === 'u0' ? c.yo[0] : p.id === fin ? (o.fin || '?') : p.id === medio ? c.r1[0] : '…';
      if (p.id === fin && !o.fin) p.incognita = true;
    }
    const corte = o.hasta === 'medio' ? ids.slice(0, ids.indexOf(medio) + 1) : ids;
    const dentro = new Set(corte);
    return { pieza: FA, datos: { personas: P.filter(p => dentro.has(p.id)), lineas: L.filter(([a, b]) => dentro.has(a) && dentro.has(b)), habla: 'u0',
      pedida: o.fin ? fin : undefined, camino: o.camino ? { ids: corte } : undefined, nota: o.nota }, estado: {} };
  }

  const ideaFamilia = {
    id: 'parentesco',
    titulo: 'Subir y bajar por el árbol',
    pregunta: '¿Cómo se lee una cadena de parentescos?',
    temas: ['Parentesco'],
    pieza: FA,
    aprendizaje: 'Un parentesco es un camino que se lee desde «mi»: sube a los padres, baja a los hijos; una persona puede tener dos papeles.',
    actividad: 'Llevar la manija por el árbol hasta la persona que nombra Ana.',
    // Lee: las fotos en el árbol, subir y bajar, tíos y primos. No cuenta papeles (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Las fotos de la familia', texto: 'En el cumpleaños del abuelo Raúl, Ana pegó en un árbol las fotos de su familia: el abuelo arriba; sus dos hijos, Pedro y Tomás, al medio; y los nietos abajo.',
          pieza: FA, dibujo: { datos: familia(), estado: {} } },
        { titulo: 'Subir y bajar', texto: 'Cada línea une a un padre o una madre con su hijo o su hija. Ir de una persona a su padre es subir una línea; ir a su hijo, bajar una. Cada piso del árbol es una generación.',
          ecuacion: ['hermano: sube 1, baja 1'] },
        { titulo: 'Tíos y primos', texto: 'El tío es el hermano de tu padre o de tu madre: sube 2 y baja 1. El primo es el hijo de tu tío: sube 2 y baja 2.' },
        { titulo: 'Qué mirar al jugar', texto: `Ana dice: ${FRASE5}. Lleva la manija a cada persona y mira el camino desde Ana: cuántas líneas sube y cuántas baja.` },
      ],
    },
    juega: {
      pieza: FA,
      consigna: `Ana dice: ${FRASE5}. Las fotos son de su familia, en el cumpleaños del abuelo Raúl.`,
      mision: {
        texto: 'Lleva la manija hasta la persona que nombra Ana.',
        logrado: v => v.c === META5,
        bien: [`Se lee desde «mi papá»: Pedro, su hermano Tomás y el hijo de Tomás, ${NOM5[META5]}.`],
      },
      voz: 'Subir es ir a los padres; bajar, a los hijos.',
      leyenda: [
        { s: O('Ana'), t: 'quien habla: el camino sale de ella' },
        { s: 'línea gruesa', t: 'el camino desde Ana' },
        { s: 'marco punteado', t: 'donde está la manija' },
      ],
      controles: [{ id: 'c', etiqueta: 'Manija en', inicio: 'pedro', opciones: OPC5.map(id => ({ valor: id, texto: NOM5[id] })) }],
      dibujo: v => ({ datos: juego5(v.c), estado: {} }),
      lectura: v => { const k = caminoDe('ana', v.c); return [`Para Ana, ${NOM5[v.c]} es su ${relDe('ana', v.c)}: sube ${k.u}, baja ${k.d}`]; },
      minimo: 3,
      // La manija va de foto en foto: cae en la persona más cercana (Ana no, porque habla ella).
      arrastres: [{ id: 'pariente', etiqueta: 'pariente de Ana', color: 'c-f',
        donde: v => { const g = Kit.piezas[FA].geometria(juego5(v.c)), p = PER5.find(x => x.id === v.c); return { x: g.X(p.x) + 30, y: g.Y(p.g) }; },
        mover: (pt, v) => { const g = Kit.piezas[FA].geometria(juego5(v.c)); return { c: OPC5.reduce((m, id) => { const p = PER5.find(x => x.id === id), q = PER5.find(x => x.id === m); return Math.hypot(g.X(p.x) + 30 - pt.x, g.Y(p.g) - pt.y) < Math.hypot(g.X(q.x) + 30 - pt.x, g.Y(q.g) - pt.y) ? id : m; }, v.c) }; } }],
    },
    predice: {
      pregunta: 'Dos padres y dos hijos fueron a pescar a la laguna. ¿Cuántas personas son, como mínimo?',
      voz: 'Mira cuántos papeles puede tener una persona.',
      opciones: [
        { id: 'c', texto: 'Tres', correcta: true },
        { id: 'cuatro', texto: 'Cuatro', error: 'RMP62', siFuera: 'Cuatro sería cierto si cada papel fuera otra persona. Una puede ser padre e hijo.' },
        { id: 'nose', texto: 'No se sabe sin sus nombres', error: 'RMP78', siFuera: 'Los nombres no hacen falta: basta buscar la familia más chica que cumple todo.' },
      ],
      dibujo: { datos: familia(), estado: {} },
      revelar: { datos: familia({ pedida: 'pedro', papeles: [H('raul', 'padre', 0, 'der'), H('pedro', 'hijo y padre', 0, 'der'), H('luis', 'hijo', 0, 'der')], nota: 'Raúl, Pedro y Luis: 2 padres, 2 hijos' }), estado: {} },
      coincide: 'Coincide: Pedro es hijo de Raúl y padre de Luis a la vez.',
      noCoincide: 'Revisemos: Raúl, Pedro y Luis ya son dos padres y dos hijos. Pedro tiene los dos papeles.',
    },
    mira: {
      pieza: FA,
      datos: MIRA5,
      voz: 'La frase se lee al revés: desde «mi».',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se empieza por «mi»: quien habla es Ana.' },
        { estado: { corte: 2 }, texto: '«Mi papá»: sube una línea, hasta Pedro.' },
        { estado: { corte: 3 }, texto: '«El único hermano de mi papá»: sube a Raúl y baja a Tomás.' },
        { estado: { corte: 4 }, texto: `«El hijo» de Tomás: baja a ${NOM5[META5]}. Sube 2 y baja 2: su ${relDe('ana', META5)}.`, ecuacion: ['sube 2, baja 2:  ', F(relDe('ana', META5))] },
        { estado: { corte: 5 }, texto: 'Pedro es hijo de Raúl y padre de Ana: una persona, dos papeles.' },
      ],
    },
    regla: {
      texto: 'Un parentesco es un camino que se lee desde «mi»: cada padre o madre sube una línea; cada hijo o hija baja una. Una persona puede tener dos papeles.',
      ecuacion: ['hermano: sube 1, baja 1', '   ·   ', 'tío: sube 2, baja 1', '   ·   ', 'primo: sube 2, baja 2'],
      // Sin «sexo» (lector en frío, ronda 2: no se entendía): dicho con las palabras de todos los días.
      condicion: 'no se supone nada que el enunciado no diga: hombre o mujer, casado, hijo único. Cada uno cuenta una vez.',
      voz: 'Primero «mi»; después, cada palabra es un paso.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_FAMILIA)
    // Así se resuelve: una cadena de dos parentescos desde «mi», con el camino dibujado (semilla + 900).
    resuelve: {
      pieza: FA,
      generar(s) {
        const r = azar(s + 900), c = cadena5(r);
        return {
          enunciado: `${c.yo[0]} cuenta: «Ayer llamó ${c.fraseMi}». ¿Qué parentesco tiene esa persona con ${c.yo[0]}?`,
          datos: c.datos,
          dibujo: { pieza: FA, datos: { personas: [{ id: 'u0', nombre: c.yo[0], x: 1.6, g: 0 }], lineas: [], habla: 'u0', nota: 'Se parte de quien habla' }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden qué es para ${c.yo[0]} la persona que nombra: ${c.fraseMi}.` },
            { tipo: 'datos', texto: `Se lee desde «mi»: primero «mi ${c.r1[0]}», y después «${c.r2[0]}» de esa persona.`, dibujo: caminoFig(c, { hasta: 'medio', camino: true, nota: `Primer tramo: mi ${c.r1[0]}` }) },
            { tipo: 'regla', texto: 'Cada parentesco es un camino: subo una línea por cada padre o madre y bajo una por cada hijo o hija; sumo los tramos.' },
            { tipo: 'cuentas', texto: `${mayus(c.r1[0])}: sube ${c.r1[1]}, baja ${c.r1[2]}. ${mayus(c.r2[0])}: sube ${c.r2[1]}, baja ${c.r2[2]}.`,
              ecuacion: [`sube ${c.r1[1]} + ${c.r2[1]} = ${c.u}   ·   baja ${c.r1[2]} + ${c.r2[2]} = ${c.d}`], dibujo: caminoFig(c, { camino: true, fin: c.nombre, nota: `Sube ${c.u} y baja ${c.d}` }) },
            { tipo: 'sentido', texto: `Compruebo al revés: desde esa persona se sube ${c.d} y se baja ${c.u}, y ${c.yo[0]} es su ${c.vuelta}. Cuadra.` },
          ],
          respuesta: [F(`Es su ${c.nombre}`)],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 3): 0, una cadena desde «mi»; 1, la misma al revés («¿qué es Ana de Carmen?»);
    // 2, el menor número de personas (padres e hijos en una sola línea, como San Marcos 2022).
    ahoraTu: {
      pieza: FA,
      voz: 'Dibuja el camino con los pasos que dice la frase.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const L = r.ent(3, 5), k = L - 1, conAbuelo = r() < 0.5 && L >= 3;
          const roles = `${k} padres y ${k} hijos${conAbuelo ? `, entre ellos ${L - 2} ${L - 2 === 1 ? 'abuelo' : 'abuelos'} y ${L - 2} ${L - 2 === 1 ? 'nieto' : 'nietos'}` : ''}`;
          return {
            pregunta: `En el almuerzo del domingo hay ${roles}. ¿Cuántas personas hay, como mínimo?`,
            // Sin «se cuentan personas, no papeles»: es la trampa misma, no un dato (auditoría M1, 17 nov).
            datos: ['Padre: tiene un hijo en el almuerzo. Hijo: su padre está en el almuerzo.', ...(conAbuelo ? ['Abuelo: tiene un nieto en el almuerzo. Nieto: su abuelo está en el almuerzo.'] : [])],
            opciones: [
              { id: 'c', texto: String(L), correcta: true },
              { id: 'suma', texto: String(2 * k), error: 'RMP62', siFuera: 'Contaste cada papel como una persona. Una misma persona puede ser hijo de uno y padre de otro.' },
              { id: 'menos', texto: String(k), error: 'RMP61', siFuera: `Con ${k} personas en línea, la de arriba no es hija de nadie: solo hay ${k - 1} hijos.` },
              { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'Se busca la familia más chica que cumple todo: una sola línea de padres e hijos.' },
            ],
            solucion: { texto: `Una línea de ${L} personas, cada una hija de la anterior: ${k} padres y ${k} hijos. Con menos, falta uno.` },
          };
        }
        const c = cadena5(r), inversa = tipo === 1;
        const nombre = inversa ? c.vuelta : c.nombre, genero = inversa ? c.gy : c.g2;
        const pregunta = inversa ? `${c.otro} es ${c.fraseDe}. ¿Qué es ${c.yo[0]} de ${c.otro}?` : `${c.yo[0]} dice: «Me visitó ${c.fraseMi}». ¿Qué es esa persona de ${c.yo[0]}?`;
        const vecinos = [`${c.u},${c.d}`, `${c.d},${c.u}`, `${c.u + 1},${c.d}`, `${c.u},${c.d + 1}`, `${Math.max(0, c.u - 1)},${c.d}`, `${c.u},${Math.max(0, c.d - 1)}`]
          .map(k => (inversa ? k.split(',').reverse().join(',') : k)).filter(k => NOMBRE[k]).map(k => NOMBRE[k][genero]);
        return {
          pregunta,
          datos: c.datos,
          // Si los vecinos no llegan a tres distractores, se completa con «No se puede saber» (auditoría B6).
          opciones: (ops => (ops.length < 4 ? ops.concat([{ id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'Sí se puede: cada palabra de la frase es un tramo del camino, y se suman.' }]) : ops))(
            opcionesTexto(mayus(nombre), vecinos.map((t, k) => ({ id: 'v' + k, texto: mayus(t), error: k === 1 ? 'RMP64' : 'RMP61', siFuera: k === 1 ? 'Ese es el parentesco visto desde la otra persona: cambiaste el que sube por el que baja.' : 'Cuenta otra vez cuántas líneas sube y cuántas baja el camino.' })))),
          solucion: { texto: `El camino sube ${inversa ? c.d : c.u} y baja ${inversa ? c.u : c.d} líneas: ${nombre}.`, dibujo: caminoFig(c, { camino: true, fin: c.nombre }) },
        };
      },
    },
  };


  // ---------- Ejemplos resueltos de las ideas 2 a 5 (pestaña «Ejemplos»; molde §3) ----------
  // Cada uno se resolvió aparte con un script que no usa el código de la unidad (scratchpad e3/dos.py, e3/silo.py y
  // e3/si.py) y vuelve a resolverse en razonamiento-deductivo.test.js por fuerza bruta (repartos, dibujos de Venn y
  // casos), con las pistas escritas otra vez en la prueba. La figura es el planteamiento: el cuadro sin marcas, la primera
  // premisa, la tabla sin tachar o el árbol sin el parentesco pedido. Las alternativas de nivel 3 van en su línea
  // (alternativas), y la letra de la respuesta, en negrita violeta.
  const LE = (nombre, items) => ({ nombre, items });
  // Con lo que cada pista marca por sí sola (como en la idea 1): SI_('Rosa', 'Puno') es una ✓, NO_('bombo', 'Lampa') una ✗;
  // cada nombre es una persona o una cosa de alguna lista, y la casilla sale de claveL (la misma de la figura).
  const SI_ = (a, b) => [[a, b, true]], NO_ = (a, b) => [[a, b, false]];
  function marcasLE(personas, listas, ms) {
    const ent = t => { const q = personas.indexOf(t); if (q >= 0) return `p:${q}`; const L = listas.findIndex(l => l.items.includes(t)); if (L < 0) throw new Error(`sin lista: ${t}`); return `${L}:${listas[L].items.indexOf(t)}`; };
    return Object.fromEntries(ms.flat().map(([a, b, si]) => [claveL(ent(a), ent(b)), si ? 'si' : 'no']));
  }
  const figLE = (personas, listas, escena, ...ms) => ({ pieza: OB, datos: Object.assign(escena ? { escena } : {}, { personas, listas, marcas: marcasLE(personas, listas, ms) }), estado: {} });
  const IN3 = LE('instrumento', ['quena', 'charango', 'bombo']), CI3 = LE('ciudad', ['Puno', 'Juliaca', 'Lampa']);
  const PIS2 = (...xs) => xs.map((t, i) => `Pista ${i + 1}: ${t}`);
  // Ejemplo 1: el cuadro donde va «Quien toca charango vive en Juliaca» (la clave sale de claveL, la misma de la figura).
  const EJ_CLAVE = claveL('0:1', '1:1');
  const EJEMPLOS_LISTAS = [
    { nivel: 1, titulo: 'La pista sin nombre', figura: figLE(P3, [IN3, CI3], 'comparsa'),
      enunciado: 'Ana, Beto y Ciro tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. ¿En qué parte del cuadro va la pista, y con qué marca?',
      datos: [R_LISTAS, 'Pista: Quien toca charango vive en Juliaca.'],
      solucion: [
        { texto: 'La pista no nombra a ninguna persona: habla de un instrumento y de una ciudad.' },
        { texto: ['Va en el cuadro de abajo, el de ciudades e instrumentos: ', F('✓'), ' en Juliaca y charango. Esa ✓ tacha el resto de su fila y de su columna.'] },
      ],
      respuesta: [F('✓ en Juliaca y charango'), ', en el cuadro de abajo'] },
    { nivel: 1, titulo: 'De la ciudad al instrumento', figura: figLE(['Rosa', 'Iván', 'Nora'], [IN3, CI3], null, SI_('Rosa', 'Puno'), SI_('Puno', 'quena')),
      enunciado: 'Rosa, Iván y Nora tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. ¿Qué toca Rosa?',
      datos: [R_LISTAS, ...PIS2('Rosa vive en Puno.', 'Quien vive en Puno toca quena.')],
      solucion: [
        { texto: 'La pista 1 pone ✓ en Rosa y Puno; la 2 no nombra a nadie: ✓ en Puno y quena, en el cuadro de abajo.' },
        { texto: ['Rosa es la de Puno, y quien vive en Puno toca quena: lo que se sabe de Puno pasa a Rosa, ', F('✓'), '.'] },
      ],
      respuesta: [F('Rosa toca quena')] },
    { nivel: 1, titulo: 'Una ✗ que pasa de cuadro', figura: figLE(['Rosa', 'Iván', 'Nora'], [IN3, CI3], null, SI_('Iván', 'bombo'), NO_('bombo', 'Lampa')),
      enunciado: 'Rosa, Iván y Nora tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. ¿Puede Iván vivir en Lampa?',
      datos: [R_LISTAS, ...PIS2('Iván toca bombo.', 'Quien toca bombo no vive en Lampa.')],
      solucion: [
        { texto: 'Iván es quien toca bombo (pista 1). La pista 2 pone ✗ en Lampa y bombo, en el cuadro de abajo.' },
        { texto: 'Esa ✗ pasa al dueño del bombo: Iván no vive en Lampa.' },
      ],
      respuesta: [F('No'), ': Iván no vive en Lampa'] },
    { nivel: 1, titulo: '¿Cuántos repartos hay?', figura: figLE(P3, [IN3, CI3], 'comparsa'),
      enunciado: 'Ana, Beto y Ciro tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. Sin pistas, ¿cuántos repartos hay?',
      datos: [R_LISTAS, 'Tres cosas se reparten entre tres personas de 3 × 2 × 1 = 6 maneras.'],
      solucion: [
        { texto: 'Los instrumentos se reparten de 6 maneras. Para cada una, las ciudades se reparten de otras 6.', ecuacion: [`${permsDe(3).length} × ${permsDe(3).length} = `, F(String(TOTAL2))] },
      ],
      respuesta: [F(`${TOTAL2} repartos`)] },
    { nivel: 1, titulo: '¿Seguro o solo posible?', figura: figLE(P3, [IN3, CI3], null, SI_('charango', 'Juliaca'), NO_('Ana', 'charango')),
      enunciado: 'Ana, Beto y Ciro tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. ¿Es seguro que Ana no vive en Juliaca?',
      datos: [R_LISTAS, ...PIS2('Quien toca charango vive en Juliaca.', 'Ana no toca charango.')],
      solucion: [
        { texto: 'Por la pista 1, el del charango y el de Juliaca son la misma persona.' },
        { texto: 'Ana no es la del charango (pista 2): entonces tampoco es la de Juliaca. La ✗ pasa del instrumento a la ciudad.' },
      ],
      respuesta: [F('Sí es seguro'), ': Ana no vive en Juliaca'] },
    { nivel: 2, titulo: 'Un mandil que descarta', figura: figLE(['Lucho', 'Maru', 'Teo'], [LE('producto', ['tamales', 'jugos', 'choclo']), LE('mandil', ['rojo', 'azul', 'blanco'])], null, SI_('Maru', 'azul'), SI_('jugos', 'rojo'), NO_('Maru', 'tamales')),
      enunciado: 'Lucho, Maru y Teo atienden un puesto en la kermés. Cada uno vende tamales, jugos o choclo, y usa mandil rojo, azul o blanco. ¿Qué vende Maru?',
      datos: [R_LISTAS, ...PIS2('Maru usa mandil azul.', 'Quien vende jugos usa mandil rojo.', 'Maru no vende tamales.')],
      solucion: [
        { texto: 'Maru usa azul, y quien vende jugos usa rojo: Maru no vende jugos. La ✗ pasa del cuadro de abajo a Maru.' },
        { texto: ['La pista 3 tacha tamales. A Maru le queda una sola casilla, choclo: ', F('✓'), '.'] },
      ],
      respuesta: [F('Maru vende choclo')] },
    { nivel: 2, titulo: 'La ciudad del bombo', figura: figLE(P3, [IN3, CI3], null, SI_('Ciro', 'bombo'), SI_('Ana', 'Puno'), NO_('Beto', 'Lampa')),
      enunciado: 'Ana, Beto y Ciro tocan en la comparsa: cada uno toca quena, charango o bombo, y vive en Puno, Juliaca o Lampa. ¿Dónde vive quien toca bombo?',
      datos: [R_LISTAS, ...PIS2('Ciro toca bombo.', 'Ana vive en Puno.', 'Beto no vive en Lampa.')],
      solucion: [
        { texto: ['Ana vive en Puno. Beto, sin Puno ni Lampa, vive en Juliaca. A Ciro le queda Lampa: ', F('✓'), '.'] },
        { texto: 'Quien toca bombo es Ciro (pista 1), y Ciro vive en Lampa: esa ✓ pasa al cuadro de abajo.' },
      ],
      respuesta: [F('En Lampa')] },
    { nivel: 2, titulo: 'El número del vóley', figura: figLE(['Dina', 'Eva', 'Fito'], [LE('deporte', ['fútbol', 'vóley', 'ajedrez']), LE('número', ['5', '7', '9'])], null, SI_('vóley', '7'), SI_('Eva', '5'), NO_('Fito', 'vóley')),
      enunciado: 'Dina, Eva y Fito compiten en la olimpiada del colegio. Cada uno juega fútbol, vóley o ajedrez, y lleva el número 5, 7 o 9. ¿Qué juega Dina?',
      datos: [R_LISTAS, ...PIS2('Quien juega vóley lleva el número 7.', 'Eva lleva el número 5.', 'Fito no juega vóley.')],
      solucion: [
        { texto: 'Eva lleva el 5, y el vóley va con el 7: Eva no juega vóley.' },
        { texto: ['La pista 3 tacha a Fito. En la columna del vóley solo queda Dina: ', F('✓'), '.'] },
      ],
      respuesta: [F('Dina juega vóley')] },
    { nivel: 2, titulo: 'Dos pistas sin nombre', figura: figLE(['Gaby', 'Hugo', 'Inés'], [IN3, LE('edad', ['15 años', '16 años', '17 años'])], null, NO_('quena', '15 años'), NO_('charango', '15 años'), SI_('Hugo', '15 años')),
      enunciado: 'Gaby, Hugo e Inés tocan en la comparsa: cada uno toca quena, charango o bombo, y tiene 15, 16 o 17 años. ¿Qué toca Hugo?',
      datos: [R_LISTAS, ...PIS2('Quien toca quena no tiene 15 años.', 'Quien toca charango no tiene 15 años.', 'Hugo tiene 15 años.')],
      solucion: [
        { texto: ['Las pistas 1 y 2 van al cuadro de edades e instrumentos: en la fila de 15 años solo queda bombo, ', F('✓'), '.'] },
        { texto: 'Hugo tiene 15 años (pista 3), y quien tiene 15 años toca bombo: esa ✓ pasa a Hugo.' },
      ],
      respuesta: [F('Hugo toca bombo')] },
    { nivel: 2, titulo: 'Cuatro en la olimpiada', figura: figLE(['Ana', 'Beto', 'Ciro', 'Dina'], [LE('deporte', ['fútbol', 'vóley', 'básquet', 'ajedrez']), LE('número', ['5', '7', '9', '10'])], null, SI_('Ana', '10'), NO_('10', 'fútbol'), NO_('10', 'vóley'), SI_('Beto', 'ajedrez')),
      enunciado: 'Ana, Beto, Ciro y Dina compiten en la olimpiada. Cada uno juega fútbol, vóley, básquet o ajedrez, y lleva el número 5, 7, 9 o 10. ¿Qué juega Ana?',
      datos: [R_LISTAS, ...PIS2('Ana lleva el número 10.', 'Quien lleva el número 10 no juega fútbol ni vóley.', 'Beto juega ajedrez.')],
      solucion: [
        { texto: 'Ana lleva el 10, y quien lleva el 10 no juega fútbol ni vóley: esas dos ✗ pasan a Ana.' },
        { texto: ['El ajedrez ya es de Beto. A Ana le queda básquet: ', F('✓'), '.'] },
      ],
      respuesta: [F('Ana juega básquet')] },
    { nivel: 3, titulo: 'La zampoña de Juliaca', figura: figLE(['Ana', 'Beto', 'Ciro', 'Dina'], [LE('instrumento', ['quena', 'charango', 'bombo', 'zampoña']), LE('ciudad', ['Puno', 'Juliaca', 'Lampa', 'Ayaviri'])], null, SI_('zampoña', 'Juliaca'), NO_('Ana', 'zampoña'), SI_('Ciro', 'charango'), SI_('Beto', 'Puno')),
      enunciado: 'Ana, Beto, Ciro y Dina tocan en la comparsa. Cada uno toca quena, charango, bombo o zampoña, y vive en Puno, Juliaca, Lampa o Ayaviri. ¿Quién vive en Juliaca?',
      alternativas: ['Ana', 'Beto', 'Ciro', 'Dina', 'No se puede saber'],
      datos: [R_LISTAS, D_DOS, ...PIS2('Quien toca zampoña vive en Juliaca.', 'Ana ensaya con quien toca zampoña.', 'Ciro toca charango.', 'Beto vive en Puno.')],
      solucion: [
        { texto: 'La pista 2 junta a dos personas distintas: Ana no toca zampoña. Ciro toca charango (pista 3).' },
        { texto: 'Beto vive en Puno, y el de la zampoña vive en Juliaca: Beto no toca zampoña.' },
        { texto: ['En la columna de la zampoña solo queda Dina: ', F('✓'), '. Por la pista 1, Dina vive en Juliaca.'] },
      ],
      respuesta: [F('D'), ': Dina vive en Juliaca'] },
    { nivel: 3, titulo: 'La edad de la quena', figura: figLE(['Gaby', 'Hugo', 'Inés'], [IN3, CI3, LE('edad', ['15 años', '16 años', '17 años'])], null, SI_('quena', 'Lampa'), NO_('Lampa', '15 años'), SI_('Gaby', '16 años'), NO_('Gaby', 'quena')),
      enunciado: 'Gaby, Hugo e Inés tocan en la comparsa. Cada uno toca quena, charango o bombo; vive en Puno, Juliaca o Lampa, y tiene 15, 16 o 17 años. ¿Cuántos años tiene quien toca quena?',
      alternativas: ['15 años', '16 años', '17 años', '15 o 17 años', 'No se puede saber'],
      datos: [R_LISTAS, ...PIS2('Quien toca quena vive en Lampa.', 'Quien vive en Lampa no tiene 15 años.', 'Gaby tiene 16 años.', 'Gaby no toca quena.')],
      solucion: [
        { texto: 'Las pistas 1 y 2 no nombran a nadie: quien toca quena es el de Lampa, y ese no tiene 15 años.' },
        { texto: 'La de 16 años es Gaby, y Gaby no toca quena: quien toca quena tampoco tiene 16.' },
        { texto: ['Sin 15 ni 16, quien toca quena tiene 17 años: ', F('✓'), '. No hizo falta saber quién es.'] },
      ],
      respuesta: [F('C'), ': quien toca quena tiene 17 años'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: figLE(['Lucho', 'Maru', 'Teo', 'Vilma'], [LE('producto', ['tamales', 'jugos', 'choclo', 'queso']), LE('mandil', ['rojo', 'azul', 'blanco', 'negro'])], null, SI_('jugos', 'azul'), SI_('Maru', 'rojo'), SI_('Teo', 'queso'), NO_('negro', 'tamales'), NO_('Lucho', 'azul')),
      enunciado: 'Lucho, Maru, Teo y Vilma atienden un puesto en la kermés. Cada uno vende tamales, jugos, choclo o queso, y usa mandil rojo, azul, blanco o negro. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Lucho vende choclo', 'Teo usa mandil negro', 'Vilma usa mandil azul', 'Maru vende tamales', 'Lucho usa mandil negro'],
      datos: [R_LISTAS, ...PIS2('Quien vende jugos usa mandil azul.', 'Maru usa mandil rojo.', 'Teo vende queso.', 'Quien usa mandil negro no vende tamales.', 'Lucho no usa mandil azul.')],
      solucion: [
        { texto: 'Maru usa rojo y Lucho no usa azul: ninguno de los dos vende jugos (pista 1). Teo vende queso.' },
        { texto: ['En la columna de jugos solo queda Vilma: ', F('✓'), '. Con la pista 1, Vilma usa mandil azul.'] },
        { texto: 'Quedan 3 repartos para lo demás: las otras cuatro pasan en alguno, pero no en todos.' },
      ],
      respuesta: [F('C'), ': Vilma usa mandil azul'] },
    // Pista 3 («Beto sacó más que Ana») no pone ninguna marca por sí sola: compara dos números.
    { nivel: 3, titulo: 'Los dados de colores', figura: figLE(['Ana', 'Beto', 'Ciro'], [LE('número', ['2', '3', '5']), LE('dado', ['rojo', 'azul', 'blanco'])], null, NO_('rojo', '3'), NO_('rojo', '5'), NO_('Ciro', '3'), NO_('Ciro', '5'), NO_('Ana', 'azul')),
      enunciado: 'Ana, Beto y Ciro lanzan un dado cada uno y sacan 2, 3 o 5, sin repetir. Cada dado es de un color: rojo, azul o blanco. ¿Qué número sacó quien tiene el dado azul?',
      alternativas: ['2', '3', '5', '3 o 5', 'No se puede saber'],
      datos: ['Cada uno sacó un número distinto y tiene un dado de color distinto.', 'Par: número que se divide entre 2 sin que sobre nada, como 2, 4 o 6.',
        ...PIS2('El dado rojo salió par.', 'Ciro sacó un número par.', 'Beto sacó más que Ana.', 'Ana no tiene el dado azul.')],
      solucion: [
        { texto: 'Solo 2 es par: el dado rojo salió 2, y Ciro sacó 2. Entonces Ciro tiene el dado rojo.' },
        { texto: 'Ana y Beto se reparten 3 y 5, y Beto sacó más: Beto sacó 5 y Ana, 3.' },
        { texto: ['Ana no tiene el azul: le queda el blanco. El azul es de Beto, que sacó 5: ', F('✓'), '.'] },
      ],
      respuesta: [F('C'), ': quien tiene el dado azul sacó 5'] },
    { nivel: 3, titulo: 'Los billetes de la tienda', figura: figLE(['Rosa', 'Nora', 'Lía'], [LE('billete', ['10 soles', '20 soles', '50 soles']), LE('compra', ['pan', 'fruta', 'leche'])], null, SI_('pan', '10 soles'), NO_('Nora', '10 soles'), NO_('leche', '50 soles')),
      enunciado: 'Rosa, Nora y Lía pagan en la tienda con un billete de 10, 20 o 50 soles, uno distinto cada una. Cada una compra pan, fruta o leche. ¿Qué compra Rosa?',
      alternativas: ['Fruta', 'Leche', 'Pan', 'Pan o leche', 'No se puede saber'],
      datos: ['Cada una tiene un billete distinto y compra una cosa distinta.', ...PIS2('Quien compra pan paga con el billete de menor valor.', 'Nora no tiene el billete de 10 soles.', 'Lía tiene más dinero que Rosa.', 'Quien compra leche no paga con 50 soles.')],
      solucion: [
        { texto: 'Pista 1: el pan va con el billete de 10 soles. Nora no lo tiene (pista 2).' },
        { texto: 'Lía tiene más que Rosa: si Lía tuviera el de 10, Rosa tendría menos de 10. Entonces el de 10 es de Rosa.' },
        { texto: ['Rosa paga con 10, y con 10 se compra el pan: ', F('✓'), '. De Nora y Lía no se sabe todo, pero no hace falta.'] },
      ],
      respuesta: [F('C'), ': Rosa compra pan'] },
  ];
  ideaListas.ejemplos = EJEMPLOS_LISTAS;

  // Idea 3: en nivel 1, la figura dibuja la premisa; en nivel 2 y 3, todas las premisas en un dibujo que las cumple (o en
  // dos que se contradicen, cuando no hay conclusión), sin marcar la conclusión: cada aro que nombra el resuelto está en
  // la figura (auditoría M2, 17 nov). El nombre de cada aro lo ubica rotularVenn, sin montarlo sobre ninguna línea.
  const aro = (nombre, papel, x, y, r) => ({ nombre, papel, x, y, r });
  const figV = (...aros) => ({ pieza: AR, datos: venn({ diagramas: [{ aros }], alto: 6.4 }), estado: {} });
  const figVA = (alto, ...aros) => ({ pieza: AR, datos: venn({ diagramas: [{ aros }], alto }), estado: {} });
  const figV2 = (a1, a2) => ({ pieza: AR, datos: venn({ diagramas: [{ titulo: 'Dibujo 1', aros: a1 }, { titulo: 'Dibujo 2', aros: a2 }], alto: ALTO_ALG, apilar: true }), estado: {} });
  // Los dos dibujos de «todos los A son B; algunos B son C» (ALG1 y ALG2): medio, primero y segundo.
  const figAlg = (m, p, q) => figV2([aroAlg(ALG1, 0, m, 'medio'), aroAlg(ALG1, 1, p, 'primero'), aroAlg(ALG1, 2, q, 'segundo')], [aroAlg(ALG2, 0, m, 'medio'), aroAlg(ALG2, 1, p, 'primero'), aroAlg(ALG2, 2, q, 'segundo')]);
  const D_V = { todos: D_TODOS, algunos: D_ALG, ningun: D_NING, algunosNo: D_ALGNO, uno: D_UNO };
  const EJEMPLOS_VENN = [
    { nivel: 1, titulo: 'Al revés no vale', figura: figV(aro('banda', 'medio', 5, 3.2, 2.8), aro('quenistas', 'primero', 4.2, 3.6, 1.3)),
      enunciado: 'Todos los quenistas están en la banda. ¿Es seguro que todos los de la banda tocan quena?',
      datos: [D_V.todos],
      solucion: [
        { texto: 'El aro de quenistas va dentro del de la banda. La banda puede tener a alguien fuera de ese aro.' },
        { texto: 'Ese dibujo cumple la premisa y tiene un integrante de la banda que no toca quena: la conclusión se rompe.' },
      ],
      respuesta: [F('No es seguro')] },
    { nivel: 1, titulo: '«Ningún» se lee igual al revés', figura: figV(aro('ciclistas', 'primero', 2.6, 3.2, 1.8), aro('nadadores', 'segundo', 7.4, 3.2, 1.8)),
      enunciado: 'Ningún ciclista es nadador. ¿Es seguro que ningún nadador es ciclista?',
      datos: [D_V.ningun],
      solucion: [
        { texto: '«Ningún» deja los dos aros separados: nadie está en los dos.' },
        { texto: 'Si nadie es ciclista y nadador a la vez, tampoco hay un nadador que sea ciclista.' },
      ],
      respuesta: [F('Sí es seguro')] },
    // Apertura (Rosa, banco y robótica; aperturas-para-la-teoria, 28 nov): «A y B» frente a «A». Quien está en el pedazo
    // compartido está también en cada aro, así que «músico y pintor» nunca tiene más casos que «músico»; empatan solo si
    // el aro de músicos cabe entero en el de pintores. La prueba de la unidad lo comprueba con la geometría de los aros.
    { nivel: 1, titulo: 'Con «y», nunca hay más', figura: figV(aro('músicos', 'primero', 3.6, 3.2, 2.1), aro('pintores', 'segundo', 6.4, 3.2, 2.1)),
      enunciado: 'Algunos músicos del colegio son pintores. ¿Puede haber más alumnos que son músicos y pintores que alumnos músicos?',
      datos: [D_V.algunos],
      solucion: [
        { texto: 'Los músicos que pintan están en el pedazo que comparten los dos aros, y ese pedazo queda entero dentro del aro de músicos.' },
        { texto: ['Cada alumno que es músico y pintor se cuenta también entre los músicos, así que ', F('no puede haber más'), ': como mucho son los mismos, si todos los músicos pintan.'] },
      ],
      respuesta: [F('No'), ': «músico y pintor» nunca tiene más alumnos que «músico»'] },
    { nivel: 1, titulo: '«Algunos» no dice «solo algunos»', figura: figV(aro('lectores', 'primero', 3.6, 3.2, 2.1), aro('nadadores', 'segundo', 6.4, 3.2, 2.1)),
      enunciado: 'Algunos lectores son nadadores. ¿Es seguro que algún lector no es nadador?',
      datos: [D_V.algunos],
      solucion: [
        { texto: '«Algunos» dice que al menos un lector nada; no dice que otros no.' },
        { texto: 'El aro de lectores puede ir entero dentro del de nadadores: ese dibujo cumple la premisa y ahí todo lector nada.' },
      ],
      respuesta: [F('No es seguro')] },
    { nivel: 1, titulo: 'Una persona del grupo', figura: figV(aro('músicos', 'medio', 5, 3.2, 2.8), aro('coristas', 'primero', 5, 3.7, 1.5)),
      enunciado: 'Todos los coristas son músicos. Lucía es corista. ¿Es seguro que Lucía es música?',
      datos: [D_V.todos],
      solucion: [
        { texto: 'Lucía está dentro del aro de coristas.' },
        { texto: 'Ese aro va entero dentro del de músicos: donde esté Lucía, también está dentro de músicos.' },
      ],
      respuesta: [F('Sí: Lucía es música')] },
    { nivel: 2, titulo: 'La cadena de aros', figura: figVA(7.2, aro('puntuales', 'segundo', 5.2, 3.6, 3.4), aro('lectores', 'medio', 4.9, 4.1, 2.55), aro('ajedrecistas', 'primero', 4.6, 4.6, 1.75)),
      enunciado: 'Todos los ajedrecistas son lectores. Todos los lectores son puntuales. ¿Qué se concluye con certeza sobre ajedrecistas y puntuales?',
      datos: [D_V.todos],
      solucion: [
        { texto: 'Ajedrecistas va dentro de lectores (premisa 1), y lectores va dentro de puntuales (premisa 2).' },
        { texto: ['Un aro dentro de otro que está dentro de un tercero queda dentro del tercero, en todo dibujo: ', F('todos los ajedrecistas son puntuales'), '.'] },
      ],
      respuesta: [F('Todos los ajedrecistas son puntuales')] },
    { nivel: 2, titulo: 'El grupo del medio no amarra', figura: figAlg('deportistas', 'ciclistas', 'nadadores'),
      enunciado: 'Todos los ciclistas son deportistas. Algunos deportistas son nadadores. ¿Es seguro que algún ciclista es nadador?',
      datos: [D_V.todos, D_V.algunos],
      solucion: [
        { texto: 'El aro de nadadores tiene que compartir un pedazo con deportistas. En el dibujo 1 cruza a ciclistas; en el 2, lo hace lejos de ellos.' },
        { texto: 'El dibujo 2 cumple las dos premisas y ningún ciclista nada: «algún ciclista es nadador» no es seguro.' },
      ],
      respuesta: [F('No es seguro')] },
    { nivel: 2, titulo: 'Dentro, y lejos del otro', figura: figV(aro('lectores', 'medio', 3.6, 3.3, 2.7), aro('delegados', 'primero', 3.3, 3.9, 1.6), aro('impuntuales', 'segundo', 8.2, 3.3, 1.5)),
      enunciado: 'Todos los delegados son lectores. Ningún lector es impuntual. ¿Qué se concluye con certeza sobre delegados e impuntuales?',
      datos: [D_V.todos, D_V.ningun],
      solucion: [
        { texto: 'Delegados va dentro de lectores. Impuntuales va separado de lectores (premisa 2).' },
        { texto: ['Lo que está dentro de lectores no toca a impuntuales, en ningún dibujo: ', F('ningún delegado es impuntual'), '.'] },
      ],
      respuesta: [F('Ningún delegado es impuntual')] },
    { nivel: 2, titulo: 'El pedazo que queda adentro', figura: figV(aro('banda', 'segundo', 6.4, 3.3, 2.7), aro('músicos', 'medio', 6.6, 3.6, 1.5), aro('danzantes', 'primero', 3.4, 3.3, 2.1)),
      enunciado: 'Algunos danzantes son músicos. Todos los músicos son de la banda. ¿Qué se concluye con certeza sobre danzantes y la banda?',
      datos: [D_V.algunos, D_V.todos],
      solucion: [
        { texto: 'Hay alguien en el pedazo compartido de danzantes y músicos (premisa 1).' },
        { texto: ['El aro de músicos va entero dentro del de la banda: ese alguien también está en la banda. ', F('Algunos danzantes son de la banda'), '.'] },
      ],
      respuesta: [F('Algunos danzantes son de la banda')] },
    { nivel: 2, titulo: 'Un aro dentro, otro afuera', figura: figV(aro('ciclistas', 'medio', 6.6, 3.3, 2.6), aro('nadadores', 'primero', 6.9, 3.7, 1.4), aro('pintores', 'segundo', 2.0, 3.3, 1.5)),
      enunciado: 'Ningún pintor es ciclista. Todos los nadadores son ciclistas. ¿Qué se concluye con certeza sobre nadadores y pintores?',
      datos: [D_V.ningun, D_V.todos],
      solucion: [
        { texto: 'Pintores va separado de ciclistas, y nadadores va dentro de ciclistas.' },
        { texto: ['Nadadores queda lejos de pintores en todo dibujo: ', F('ningún nadador es pintor'), '.'] },
      ],
      respuesta: [F('Ningún nadador es pintor')] },
    { nivel: 3, titulo: 'Tres premisas en cadena', figura: figVA(7.2, aro('estudiosos', 'medio', 4.0, 3.7, 3.3), aro('lectores', 'medio', 3.7, 4.2, 2.5), aro('ajedrecistas', 'primero', 3.4, 4.7, 1.7), aro('impuntuales', 'segundo', 8.7, 2.0, 1.1)),
      enunciado: 'Todos los ajedrecistas son lectores. Todos los lectores son estudiosos. Ningún estudioso es impuntual. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Algunos ajedrecistas son impuntuales', 'Todos los estudiosos son ajedrecistas', 'Ningún ajedrecista es impuntual', 'Algunos estudiosos son impuntuales', 'Nada se puede concluir'],
      datos: [D_V.todos, D_V.ningun, D_V.uno],
      solucion: [
        { texto: 'Ajedrecistas va dentro de lectores, y lectores dentro de estudiosos. Impuntuales va separado de estudiosos.' },
        { texto: ['Todo lo que está dentro de estudiosos queda lejos de impuntuales: ningún ajedrecista es impuntual, ', F('✓'), '.'] },
        { texto: '«Todos los estudiosos son ajedrecistas» es la cadena al revés: un dibujo con estudiosos fuera de ajedrecistas la rompe.' },
      ],
      respuesta: [F('C'), ': ningún ajedrecista es impuntual'] },
    { nivel: 3, titulo: '¿Cuál no se puede concluir?', figura: figVA(7.2, aro('lectores', 'segundo', 5.2, 3.6, 3.4), aro('puntuales', 'medio', 4.9, 4.1, 2.55), aro('delegados', 'primero', 4.6, 4.6, 1.75)),
      enunciado: 'Todos los delegados son puntuales. Todos los puntuales son lectores. ¿Cuál no se puede concluir?',
      alternativas: ['Todos los delegados son lectores', 'Algunos delegados son lectores', 'Algunos lectores son delegados', 'Algunos puntuales son delegados', 'Todos los lectores son puntuales'],
      datos: [D_V.todos, D_V.algunos, D_V.uno],
      solucion: [
        { texto: 'Delegados va dentro de puntuales, y puntuales dentro de lectores. Cada grupo tiene a alguien.' },
        { texto: 'Hay un delegado: es puntual y lector. Por eso valen las de «todos» y las de «algunos» sobre delegados.' },
        { texto: ['«Todos los lectores son puntuales» es la premisa 2 al revés: un lector fuera de puntuales la rompe. Esa ', F('no se concluye'), '.'] },
      ],
      respuesta: [F('E'), ': todos los lectores son puntuales'] },
    { nivel: 3, titulo: '«Algunos» y «ningún» juntos', figura: figV(aro('ciclistas', 'primero', 3.3, 3.0, 2.0), aro('nadadores', 'medio', 5.9, 3.0, 1.5), aro('fumadores', 'segundo', 2.0, 5.2, 1.0)),
      enunciado: 'Algunos ciclistas son nadadores. Ningún nadador es fumador. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Ningún ciclista es fumador', 'Algunos ciclistas son fumadores', 'Algunos ciclistas no son fumadores', 'Algunos nadadores no son ciclistas', 'Nada se puede concluir'],
      datos: [D_V.algunos, D_V.ningun, D_V.algunosNo],
      solucion: [
        { texto: 'Hay alguien en el pedazo de ciclistas y nadadores. Fumadores va separado de nadadores.' },
        { texto: ['Ese ciclista que nada no fuma, en todo dibujo: algunos ciclistas no son fumadores, ', F('✓'), '.'] },
        { texto: 'Sobre los demás ciclistas no se sabe: pueden fumar o no. Por eso no vale «ningún ciclista es fumador».' },
      ],
      respuesta: [F('C'), ': algunos ciclistas no son fumadores'] },
    { nivel: 3, titulo: 'La trampa del grupo del medio', figura: figAlg('músicos', 'quenistas', 'cantantes'),
      enunciado: 'Todos los quenistas son músicos. Algunos músicos son cantantes. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Algunos quenistas son cantantes', 'Ningún quenista es cantante', 'Todos los músicos son quenistas', 'Algunos músicos son quenistas', 'Ningún cantante es quenista'],
      datos: [D_V.todos, D_V.algunos, D_V.uno],
      solucion: [
        { texto: 'Cantantes comparte un pedazo con músicos: en el dibujo 1 cruza a quenistas; en el 2, no. Las alternativas con cantantes (A, B y E) no son seguras.' },
        { texto: ['Hay al menos un quenista, y está dentro de músicos: algunos músicos son quenistas, ', F('✓'), '.'] },
        // Por qué falla, con el dibujo (lector en frío, ronda 2: «no explica por qué al revés no vale»).
        { texto: '«Todos los músicos son quenistas» es la premisa 1 al revés, y falla en el dibujo 2: los músicos que cantan no tocan quena.' },
      ],
      respuesta: [F('D'), ': algunos músicos son quenistas'] },
    { nivel: 3, titulo: 'La encuesta del aula', figura: figV(aro('lectores', 'medio', 4.0, 3.3, 2.8), aro('ajedrecistas', 'primero', 3.2, 3.5, 1.7), aro('nadadores', 'segundo', 6.9, 3.3, 1.5)),
      enunciado: 'En un aula, todos los ajedrecistas son lectores, algunos lectores son nadadores y ningún nadador es ajedrecista. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Algunos ajedrecistas son nadadores', 'Todos los lectores son ajedrecistas', 'Algunos lectores no son ajedrecistas', 'Ningún lector es nadador', 'Todos los nadadores son lectores'],
      datos: [D_V.todos, D_V.algunos, D_V.ningun, D_V.algunosNo],
      solucion: [
        { texto: 'Hay alguien en el pedazo de lectores y nadadores, y ese alguien no es ajedrecista (premisa 3).' },
        { texto: ['Es un lector fuera de ajedrecistas, en todo dibujo: algunos lectores no son ajedrecistas, ', F('✓'), '.'] },
        { texto: '«Todos los nadadores son lectores» pasa en un dibujo, pero no en todos: es posible, no necesaria.' },
      ],
      respuesta: [F('C'), ': algunos lectores no son ajedrecistas'] },
  ];
  ideaVenn.ejemplos = EJEMPLOS_VENN;

  // Idea 4: la figura es la tabla de casos sin tachar (el planteamiento); p y q se dicen en los datos.
  const VPQ = [{ t: 'p', papel: 'primero', si: 'sí', no: 'no' }, { t: 'q', papel: 'segundo', si: 'sí', no: 'no' }];
  const VPQR = VPQ.concat([{ t: 'r', papel: 'tercero', si: 'sí', no: 'no' }]);
  // La tabla trae tachado lo que tachan las reglas por sí solas (lector en frío, ronda 2: «la tabla no tiene nada
  // tachado; el tachado lo hago en mi cabeza»): con dos partes, «p sí, q no»; con tres, la cadena «si p, entonces q» y
  // «si q, entonces r». El dato no se aplica en la figura: el caso que queda es la respuesta (molde §3), y lo hace el
  // resuelto. sinRegla: la pregunta es justo qué caso tacha la regla.
  const prohibeT = v => (v.length === 2 ? v[0] && !v[1] : (v[0] && !v[1]) || (v[1] && !v[2]));
  const figT = (vars, n, sinRegla) => ({ pieza: CA, datos: { tablas: [{ vars, filas: (n === 2 ? CASOS4 : CASOS8).map(v => ({ v, fuera: !sinRegla && prohibeT(v) ? 'regla' : false })) }] }, estado: {} });
  // p y q (y r) dichos en los datos con el color de su columna: naranja, turquesa y, la tercera, tinta.
  const PQ = (...xs) => xs.flatMap((t, i) => [i ? ' ' : '', [O, I, x => x][i](['p', 'q', 'r'][i]), `: ${t}.`]).filter(x => x !== '');
  const EJEMPLOS_SI = [
    { nivel: 1, titulo: 'La forma directa', figura: figT(VPQ, 2),
      enunciado: 'Regla del colegio: si suena el timbre largo, empieza el recreo. Hoy sonó el timbre largo. ¿Qué se concluye con certeza?',
      datos: [D_SI, PQ('suena el timbre largo', 'empieza el recreo')],
      solucion: [
        { texto: 'La regla tacha el caso «p sí, q no». El dato «p sí» tacha los dos casos con «p no».' },
        { texto: ['Queda un solo caso: p sí, q sí. ', F('Empieza el recreo'), '.'] },
      ],
      respuesta: [F('Empezó el recreo')] },
    { nivel: 1, titulo: 'La forma indirecta', figura: figT(VPQ, 2),
      enunciado: 'Regla de la tienda: si la tienda está abierta, la luz del letrero está prendida. Ahora la luz está apagada. ¿Qué se concluye con certeza?',
      datos: [D_SI, PQ('la tienda está abierta', 'la luz del letrero está prendida')],
      solucion: [
        { texto: 'La regla tacha «p sí, q no». El dato «q no» tacha los dos casos con «q sí».' },
        { texto: ['Queda un solo caso: p no, q no. ', F('La tienda no está abierta'), '.'] },
      ],
      respuesta: [F('La tienda no está abierta')] },
    { nivel: 1, titulo: 'Saber lo segundo no basta', figura: figT(VPQ, 2),
      enunciado: 'Si Rosa tiene fiebre, falta al colegio. Hoy Rosa faltó al colegio. ¿Es seguro que tiene fiebre?',
      datos: [D_SI, PQ('Rosa tiene fiebre', 'Rosa falta al colegio')],
      solucion: [
        { texto: 'El dato «q sí» deja dos casos: p sí, q sí; y p no, q sí. La regla no tacha ninguno de los dos.' },
        { texto: 'Pudo faltar con fiebre o por otra razón: no es seguro.' },
      ],
      respuesta: [F('No es seguro')] },
    { nivel: 1, titulo: 'Negar lo primero no basta', figura: figT(VPQ, 2),
      enunciado: 'Si llueve, la pista se moja. Hoy no llovió. ¿Es seguro que la pista está seca?',
      datos: [D_SI, PQ('llueve', 'la pista se moja'), 'La cisterna también riega la calle.'],
      solucion: [
        { texto: 'El dato «p no» deja dos casos: p no, q sí; y p no, q no. La regla solo tacha «p sí, q no».' },
        { texto: 'La pista pudo mojarse con la cisterna: no es seguro que esté seca.' },
      ],
      respuesta: [F('No es seguro')] },
    { nivel: 1, titulo: 'El caso que la regla prohíbe', figura: figT(VPQ, 2, true),
      enunciado: 'Regla: si un número termina en 0, es par. ¿Cuál de los cuatro casos de la tabla no puede pasar?',
      datos: [D_SI, PQ('el número termina en 0', 'el número es par')],
      solucion: [
        { texto: 'Una regla «si p, entonces q» solo prohíbe que pase p sin q.' },
        { texto: ['El caso prohibido es p sí, q no: ', F('un número que termina en 0 y no es par'), '.'] },
      ],
      respuesta: [F('Terminar en 0 y no ser par')] },
    { nivel: 2, titulo: 'Dos reglas en cadena', figura: figT(VPQR, 3),
      enunciado: 'Si Ana llega temprano, ayuda a ordenar. Si ayuda a ordenar, sale primero al recreo. Hoy Ana llegó temprano. ¿Qué se concluye con certeza?',
      datos: [D_SI, PQ('Ana llega temprano', 'ayuda a ordenar', 'sale primero al recreo')],
      solucion: [
        { texto: 'Con p, la primera regla da q: ayuda a ordenar.' },
        { texto: ['Con q, la segunda regla da r: ', F('sale primero al recreo'), '. En la tabla queda un solo caso: p, q y r sí.'] },
      ],
      respuesta: [F('Ana sale primero al recreo')] },
    { nivel: 2, titulo: 'La cadena al revés', figura: figT(VPQR, 3),
      enunciado: 'Si Ana llega temprano, ayuda a ordenar. Si ayuda a ordenar, sale primero al recreo. Hoy Ana no salió primero al recreo. ¿Qué se concluye con certeza?',
      datos: [D_SI, PQ('Ana llega temprano', 'ayuda a ordenar', 'sale primero al recreo')],
      solucion: [
        { texto: 'Sin r, la segunda regla dice que no hubo q (forma indirecta): no ayudó a ordenar.' },
        { texto: ['Sin q, la primera regla dice que no hubo p: ', F('Ana no llegó temprano'), '. En la tabla queda solo la última fila: p, q y r no.'] },
      ],
      respuesta: [F('Ana no llegó temprano')] },
    { nivel: 2, titulo: 'Una regla que empieza con «no»', figura: figT(VPQ, 2),
      enunciado: 'Si no hay examen, Beto juega fútbol en la tarde. Hoy Beto no jugó fútbol en la tarde. ¿Qué se concluye con certeza?',
      datos: [D_SI, PQ('no hay examen', 'Beto juega fútbol en la tarde')],
      solucion: [
        { texto: 'Aquí p es «no hay examen». La regla tacha «p sí, q no». El dato es «q no»: tacha los casos con «q sí».' },
        { texto: ['Queda un caso: p no, q no. Que p no pase quiere decir que no es cierto que «no hay examen»: ', F('hay examen'), '.'] },
      ],
      respuesta: [F('Hoy hay examen')] },
    { nivel: 2, titulo: '¿Cuántos casos quedan?', figura: figT(VPQ, 2),
      enunciado: 'Si la puerta está abierta, entra el gato. Hoy entró el gato. ¿Cuántos casos quedan en pie, y qué se concluye?',
      datos: [D_SI, PQ('la puerta está abierta', 'entra el gato')],
      solucion: [
        { texto: 'La regla tacha «p sí, q no». El dato «q sí» tacha los dos casos con «q no».' },
        { texto: 'Quedan 2 casos: puerta abierta y entra; puerta cerrada y entra (por otro lado). Dicen cosas distintas de la puerta.' },
      ],
      respuesta: [F('Quedan 2 casos'), ': no se concluye nada de la puerta'] },
    { nivel: 2, titulo: 'Una regla en el reparto', figura: figC(P3, D3, X('Beto', 'ajedrez'), X('Ciro', 'fútbol')),
      enunciado: 'Ana, Beto y Ciro juegan cada uno fútbol, vóley o ajedrez, sin repetir. ¿Quién juega fútbol?',
      datos: [R3, 'Regla: si Ana juega fútbol, Beto juega ajedrez.', ...PIS('Beto no juega ajedrez.', 'Ciro no juega fútbol.')],
      solucion: [
        { texto: 'Beto no juega ajedrez: no pasó lo segundo de la regla. Forma indirecta: Ana no juega fútbol.' },
        { texto: ['En la columna de fútbol hay ✗ para Ana y para Ciro: solo queda Beto, ', F('✓'), '.'] },
      ],
      respuesta: [F('Beto juega fútbol')] },
    { nivel: 3, titulo: 'El frasco que pesa poco', figura: figT(VPQR, 3),
      enunciado: 'En la feria de ciencias hay frascos. Si un frasco es rojo, tiene canicas. Si tiene canicas, pesa más de 1 kg. Un frasco no pesa más de 1 kg. ¿Qué es siempre cierto de ese frasco?',
      alternativas: ['Es rojo', 'Tiene canicas', 'No tiene canicas y no es rojo', 'No es rojo, pero puede tener canicas', 'Nada se puede asegurar'],
      datos: [D_SI, PQ('el frasco es rojo', 'tiene canicas', 'pesa más de 1 kg')],
      solucion: [
        { texto: 'No pasa r: por la segunda regla, no pasa q. No tiene canicas.' },
        { texto: ['Sin q, por la primera regla, no pasa p: no es rojo. En la tabla queda solo la última fila (p, q y r no): las dos cosas son seguras, ', F('✓'), '.'] },
        { texto: '«No es rojo, pero puede tener canicas» falla: tener canicas lo haría pesar más de 1 kg.' },
      ],
      respuesta: [F('C'), ': no tiene canicas y no es rojo'] },
    { nivel: 3, titulo: 'Si fuera…, sería…', figura: figC(P3, ['médico', 'profesor', 'abogado'], S('Ciro', 'abogado')),
      enunciado: 'Ana, Beto y Ciro son médico, profesor y abogado, uno cada uno. Si Beto no fuera el profesor, Ciro sería el médico. Ciro es el abogado. ¿Qué es Beto?',
      alternativas: ['Médico', 'Abogado', 'Profesor', 'Médico o profesor', 'No se puede saber'],
      // Sin «Regla: si Beto no es el profesor, Ciro es el médico»: era el paso hecho (auditoría M4, 17 nov).
      // El contrafáctico se lee así en toda la unidad y su práctica (Gerson, cuarta ronda, 18 nov): esta línea es la misma
      // que usa plantillas/rm-deduccion/ (lineas.contrafactico); la prueba de la unidad compara las dos.
      datos: ['Cada uno tiene una sola profesión, y ninguna se repite.', '«Si fuera p, sería q» se lee como «si p, entonces q»: no dice que p pase.'],
      solucion: [
        { texto: '«Beto no fuera el profesor» no es un dato: es lo primero de una regla.' },
        { texto: 'Ciro es el abogado, así que no es el médico: no pasa lo segundo. Forma indirecta: no pasa lo primero.' },
        { texto: ['Lo contrario de «Beto no es el profesor» es ', F('Beto es el profesor'), '. Ana queda de médica.'] },
      ],
      respuesta: [F('C'), ': Beto es el profesor'] },
    // Nivel 3 (auditoría M7, 17 nov): una regla con «no» en sus dos partes, escondida en un reparto de cuatro.
    { nivel: 3, titulo: 'Una regla con dos «no»', figura: figC(['Ana', 'Beto', 'Ciro', 'Dina'], CTX[0].cosas, S('Dina', 'básquet'), X('Beto', 'vóley')),
      enunciado: 'Ana, Beto, Ciro y Dina juegan cada uno fútbol, vóley, ajedrez o básquet, sin repetir. ¿Qué juega Beto?',
      alternativas: ['Fútbol', 'Vóley', 'Ajedrez', 'Básquet', 'No se puede saber'],
      datos: ['Cada uno juega un solo deporte, y ningún deporte se repite.', 'Regla: si Ana no juega fútbol, Dina no juega básquet.', ...PIS('Dina juega básquet.', 'Beto no juega vóley.')],
      solucion: [
        { texto: 'Lo segundo de la regla es «Dina no juega básquet», y la pista 1 dice lo contrario: lo segundo no pasa.' },
        { texto: ['Forma indirecta: lo primero tampoco pasa. No es cierto que Ana no juegue fútbol: Ana juega fútbol, ', F('✓'), '.'] },
        { texto: ['A Beto le tachan fútbol (Ana), básquet (Dina) y vóley (pista 2): le queda ajedrez, ', F('✓'), '.'] },
      ],
      respuesta: [F('C'), ': Beto juega ajedrez'] },
    // Sin «Hoy es lunes» (auditoría M5, 17 nov): con ese dato la tabla deja un solo caso y «si lleva buzo, es lunes» se
    // cumple en él. Ahora se pregunta qué sale de las dos reglas solas, y la tabla decide.
    { nivel: 3, titulo: '¿Cuál no se concluye?', figura: figT(VPQR, 3),
      enunciado: 'Si es lunes, hay educación física. Si hay educación física, Luis lleva buzo. ¿Cuál no se puede concluir de estas dos reglas?',
      alternativas: ['Si es lunes, Luis lleva buzo', 'Si Luis no lleva buzo, no hay educación física', 'Si no hay educación física, no es lunes', 'Si Luis lleva buzo, es lunes', 'Si Luis no lleva buzo, no es lunes'],
      datos: [D_SI, PQ('es lunes', 'hay educación física', 'Luis lleva buzo'), 'Una afirmación se concluye si se cumple en todos los casos que dejan las reglas.'],
      solucion: [
        { texto: 'Las reglas tachan p sin q y q sin r. De los 8 casos quedan 4: sí, sí, sí; no, sí, sí; no, no, sí; no, no, no.' },
        // En palabras, sin fórmulas de p, q y r (lector en frío, ronda 2: «tuve que traducirlas una por una»).
        { texto: 'En esos 4 casos, si es lunes, Luis lleva buzo; y si no lleva buzo, no hay educación física ni es lunes.' },
        { texto: 'Y si no hay educación física, no es lunes. Esas cuatro alternativas se concluyen.' },
        { texto: ['«Si Luis lleva buzo, es lunes» falla en el caso no, sí, sí: educación física otro día. Esa ', F('no se concluye'), '.'] },
      ],
      respuesta: [F('D'), ': si Luis lleva buzo, es lunes'] },
    { nivel: 3, titulo: 'La llamada que no llegó', figura: figT(VPQR, 3),
      enunciado: 'Si Rosa tiene fiebre, falta al colegio. Si falta, su mamá llama al colegio. Hoy la mamá de Rosa no llamó. ¿Qué es siempre cierto?',
      alternativas: ['Rosa tiene fiebre', 'Rosa faltó', 'Rosa no faltó y no tiene fiebre', 'Rosa faltó sin fiebre', 'Nada se puede asegurar'],
      datos: [D_SI, PQ('Rosa tiene fiebre', 'Rosa falta', 'su mamá llama al colegio')],
      solucion: [
        { texto: 'No pasa r: por la segunda regla, no pasa q. Rosa no faltó.' },
        { texto: ['Sin q, por la primera regla, no pasa p: no tiene fiebre. En la tabla queda solo la última fila: las dos son seguras, ', F('✓'), '.'] },
      ],
      respuesta: [F('C'), ': Rosa no faltó y no tiene fiebre'] },
  ];
  ideaSi.ejemplos = EJEMPLOS_SI;

  // Idea 5: el árbol de la familia de Luis (quien habla, en naranja), con todos los nombres y sin el parentesco pedido.
  const FAM_EJ = [
    { id: 'elena', nombre: 'Elena', x: 5.2, g: 0 },
    { id: 'raul', nombre: 'Raúl', x: 3.0, g: 1 }, { id: 'marta', nombre: 'Marta', x: 7.6, g: 1 },
    { id: 'pedro', nombre: 'Pedro', x: 1.6, g: 2 }, { id: 'tomas', nombre: 'Tomás', x: 4.6, g: 2 },
    { id: 'luis', nombre: 'Luis', x: 0.4, g: 3 }, { id: 'rosa', nombre: 'Rosa', x: 2.6, g: 3 }, { id: 'ivan', nombre: 'Iván', x: 4.6, g: 3 },
    { id: 'sara', nombre: 'Sara', x: 2.6, g: 4 },
  ];
  const LIN_EJ = [['elena', 'raul'], ['elena', 'marta'], ['raul', 'pedro'], ['raul', 'tomas'], ['pedro', 'luis'], ['pedro', 'rosa'], ['tomas', 'ivan'], ['rosa', 'sara']];
  const figF = { pieza: FA, datos: { personas: FAM_EJ, lineas: LIN_EJ, habla: 'luis' }, estado: {} };
  const D_SUBE = 'Cada padre o madre: sube 1 línea. Cada hijo o hija: baja 1 línea.';
  // Los nombres en masculino y en femenino (lector en frío, ronda 2: «dice sobrino y aquí es una hija»).
  const D_NOMB = 'Tío o tía: sube 2, baja 1. Sobrino o sobrina: sube 1, baja 2. Primo o prima: sube 2, baja 2.';
  const D_NOMB2 = ['Abuelo o abuela: sube 2. Nieto o nieta: baja 2.', 'Bisabuelo o bisabuela: sube 3. Tío abuelo o tía abuela: sube 3, baja 1.'];
  const EJEMPLOS_FAMILIA = [
    { nivel: 1, titulo: 'El hermano de mi papá', figura: figF,
      enunciado: 'Luis señala el árbol de su familia y dice: «Él es el hermano de mi papá». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, 'Hermano: sube 1, baja 1.', D_NOMB],
      solucion: [
        { texto: 'Se lee desde «mi»: «mi papá» sube 1, a Pedro. «Su hermano» sube 1 y baja 1: a Tomás.' },
        { texto: ['En total sube 2 y baja 1: ', F('tío'), '.'] },
      ],
      respuesta: [F('Es su tío')] },
    { nivel: 1, titulo: 'La hija de mi hermana', figura: figF,
      enunciado: 'Luis dice: «Ella es la hija de mi hermana». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, 'Hermana: sube 1, baja 1.', D_NOMB],
      solucion: [
        { texto: '«Mi hermana» sube 1 y baja 1: Rosa. «Su hija» baja 1: Sara.' },
        { texto: ['En total sube 1 y baja 2: ', F('sobrina'), '.'] },
      ],
      respuesta: [F('Es su sobrina')] },
    { nivel: 1, titulo: 'El papá de mi papá', figura: figF,
      enunciado: 'Luis dice: «Él es el papá de mi papá». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, ...D_NOMB2],
      solucion: [
        { texto: '«Mi papá» sube 1: Pedro. «Su papá» sube 1 más: Raúl.' },
        { texto: ['Sube 2 y no baja: ', F('abuelo'), '.'] },
      ],
      respuesta: [F('Es su abuelo')] },
    { nivel: 1, titulo: 'El hijo de mi tío', figura: figF,
      enunciado: 'Luis dice: «Él es el hijo de mi tío Tomás». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, D_NOMB],
      solucion: [
        { texto: '«Mi tío» sube 2 y baja 1: Tomás. «Su hijo» baja 1 más: Iván.' },
        { texto: ['En total sube 2 y baja 2: ', F('primo'), '.'] },
      ],
      respuesta: [F('Es su primo')] },
    { nivel: 1, titulo: 'La mamá de mi abuelo', figura: figF,
      enunciado: 'Luis dice: «Ella es la mamá de mi abuelo Raúl». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, ...D_NOMB2],
      solucion: [
        { texto: '«Mi abuelo» sube 2: Raúl. «Su mamá» sube 1 más: Elena.' },
        { texto: ['Sube 3 y no baja: ', F('bisabuela'), '.'] },
      ],
      respuesta: [F('Es su bisabuela')] },
    { nivel: 2, titulo: 'El abuelo de mi hermana', figura: figF,
      enunciado: 'Luis dice: «Él es el abuelo paterno de mi hermana Rosa». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, 'Abuelo paterno: el papá del papá.', 'Hermana: sube 1, baja 1.'],
      solucion: [
        { texto: '«Mi hermana» sube 1 y baja 1: Rosa. «Su abuelo paterno» vuelve a subir: al papá de Pedro, Raúl.' },
        { texto: ['Rosa y Luis tienen el mismo papá: el abuelo paterno de Rosa es el de Luis. ', F('Es su abuelo'), '.'] },
      ],
      respuesta: [F('Es su abuelo')] },
    { nivel: 2, titulo: 'Un camino que vuelve', figura: figF,
      enunciado: 'Luis dice: «Ella es la mamá de la hija de mi hermana». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, 'Hermana: sube 1, baja 1.'],
      solucion: [
        { texto: '«Mi hermana» es Rosa. «Su hija» baja 1: Sara. «La mamá» de Sara sube 1 y vuelve a Rosa.' },
        { texto: ['El camino vuelve por la misma línea: ', F('es su hermana'), '.'] },
      ],
      respuesta: [F('Es su hermana')] },
    { nivel: 2, titulo: 'El sobrino de mi papá', figura: figF,
      enunciado: 'Luis dice: «Él es sobrino de mi papá». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, D_NOMB],
      solucion: [
        { texto: 'Los sobrinos de Pedro son los hijos de sus hermanos: el hijo de Tomás, Iván.' },
        { texto: ['Desde Luis: sube 2 (Pedro, Raúl) y baja 2 (Tomás, Iván): ', F('primo'), '.'] },
      ],
      respuesta: [F('Es su primo')] },
    { nivel: 2, titulo: 'El mismo camino al revés', figura: figF,
      enunciado: 'Tomás es el tío de Luis. ¿Qué es Luis de Tomás?',
      datos: [D_SUBE, D_NOMB],
      solucion: [
        { texto: 'De Luis a Tomás: sube 2 y baja 1.' },
        { texto: ['De Tomás a Luis, el camino se recorre al revés: sube 1 y baja 2. ', F('Sobrino'), '.'] },
      ],
      respuesta: [F('Luis es su sobrino')] },
    { nivel: 2, titulo: 'La hermana de mi abuelo', figura: figF,
      enunciado: 'Luis dice: «Ella es la hermana del papá de mi papá». ¿Qué es esa persona de Luis?',
      datos: [D_SUBE, 'Hermana: sube 1, baja 1.', ...D_NOMB2],
      solucion: [
        { texto: '«Mi papá» sube 1: Pedro. «Su papá» sube 1: Raúl. «Su hermana» sube 1 y baja 1: Marta.' },
        { texto: ['En total sube 3 y baja 1: ', F('tía abuela'), '.'] },
      ],
      respuesta: [F('Es su tía abuela')] },
    // Nivel 3 (auditoría M7, 17 nov): cadenas con «único», que hacen volver el camino por la misma línea, y conteos sin el
    // consejo en los datos. Sin el árbol de Luis (otros nombres: auditoría B3).
    { nivel: 3, titulo: 'El hijo del único hijo',
      enunciado: 'Óscar es hijo único y dice: «Él es el hijo del único hijo de mi abuelo paterno». ¿Quién es esa persona para Óscar?',
      alternativas: ['Su hermano', 'Su primo', 'Él mismo', 'Su sobrino', 'Su padre'],
      datos: [D_SUBE, 'Abuelo paterno: el papá del papá.', 'Hijo único: no tiene hermanos ni hermanas.', D_NOMB],
      solucion: [
        { texto: '«Mi abuelo paterno» sube 2: al papá del papá de Óscar.' },
        { texto: '«Su único hijo» baja 1. Como es el único, es el papá de Óscar: el camino vuelve por la línea por la que subió.' },
        { texto: ['«El hijo» del papá de Óscar baja 1 más. Óscar es hijo único: es ', F('él mismo'), '. Contar sube 2 y baja 2 daría «primo».'] },
      ],
      respuesta: [F('C'), ': es él mismo'] },
    { nivel: 3, titulo: 'La única hija de mi abuela',
      enunciado: 'Luis dice: «La mamá de Rosa es la única hija de mi abuela materna». ¿Qué es Luis de Rosa?',
      alternativas: ['Su primo', 'Su tío', 'Su sobrino', 'Su hermano', 'Su padre'],
      datos: [D_SUBE, 'Abuela materna: la mamá de la mamá.', 'Hermano: sube 1, baja 1.'],
      solucion: [
        { texto: 'La única hija de la abuela materna de Luis es la mamá de Luis.' },
        { texto: ['Entonces Rosa y Luis tienen la misma mamá: sube 1 y baja 1. Luis es ', F('su hermano'), '.'] },
      ],
      respuesta: [F('D'), ': Luis es su hermano'] },
    { nivel: 3, titulo: 'El almuerzo del domingo',
      enunciado: 'En el almuerzo del domingo hay 1 abuelo, 2 padres, 2 hijos y 1 nieto. ¿Cuántas personas hay, como mínimo?',
      alternativas: ['6', '4', '3', '5', '2'],
      datos: ['Abuelo: su nieto está en el almuerzo. Nieto: su abuelo está en el almuerzo.', 'Padre: su hijo está en el almuerzo. Hijo: su padre está en el almuerzo.'],
      solucion: [
        { texto: 'Hay 2 hijos: alguien tiene que estar arriba de los dos, así que hay al menos 3 personas.' },
        { texto: ['Con 3 alcanza: abuelo, padre e hijo. El del medio es hijo y padre; el abuelo es padre; el de abajo es hijo y nieto. ', F('Tres'), '.'] },
      ],
      respuesta: [F('C'), ': 3 personas'] },
    { nivel: 3, titulo: 'Los hijos de doña Rufina',
      enunciado: 'Doña Rufina tiene tres hijos varones, y cada uno tiene una sola hermana. ¿Cuántos hijos tiene doña Rufina en total?',
      alternativas: ['4', '6', '3', '5', '7'],
      // «Hermanos» con la misma definición que la práctica (rm-parentesco; auditoría B4).
      datos: ['Hermanos: hijos del mismo padre y de la misma madre.', 'Todos los hijos de doña Rufina son del mismo padre.'],
      solucion: [
        { texto: 'La hermana de cada varón es hija de doña Rufina. Como cada uno tiene una sola, es la misma para los tres.' },
        { texto: ['Tres varones y una mujer: ', F('4 hijos'), '. Contar una hermana por varón daría 6.'] },
      ],
      respuesta: [F('A'), ': 4 hijos'] },
    { nivel: 3, titulo: 'La única hija de la bisabuela',
      enunciado: 'Nora dice: «Él es el hijo de la única hija de la abuela materna de mi mamá». ¿Qué es esa persona de Nora?',
      alternativas: ['Tío abuelo', 'Primo', 'Tío', 'Abuelo', 'Sobrino'],
      datos: [D_SUBE, 'Abuela materna: la mamá de la mamá.', 'Tío: sube 2, baja 1. Primo: sube 2, baja 2. Tío abuelo: sube 3, baja 1.'],
      solucion: [
        { texto: '«Mi mamá» sube 1; «su abuela materna» sube 2 más. En total, Nora sube 3.' },
        { texto: '«Su única hija» baja 1. Como es la única, es la abuela de Nora: el camino baja por la línea por la que subió, y queda en sube 2.' },
        { texto: ['«El hijo» de esa abuela baja 1: sube 2 y baja 1. Es un hermano de la mamá de Nora: ', F('tío'), '.'] },
      ],
      respuesta: [F('C'), ': es su tío'] },
  ];
  ideaFamilia.ejemplos = EJEMPLOS_FAMILIA;


  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa de la idea 3: el aro de la diablada se mueve y crece libre (no solo cuatro lugares): se ve cuándo cumple
  // «algunos de la banda bailan» y si toca a los quenistas. Conserva su id y los de sus controles (cx, cr).
  const VBL = { nombre: 'banda', papel: 'medio', x: 4, y: 3.2, r: 2.7, en: [4, 0.25] }, VQL = { nombre: 'quenistas', papel: 'primero', x: 3, y: 3.2, r: 1.2, en: [3, 3.2] };
  const dLibre = val => ({ x: val.cx, y: 3.2, r: val.cr });
  const vennLibre = val => {
    const D = dLibre(val), ok = tocanA(VBL, D);
    return venn({ diagramas: [{ aros: [VBL, VQL, Object.assign({ nombre: 'diablada', papel: 'segundo', en: [val.cx, Math.min(6.1, 3.2 + val.cr + 0.55)] }, D, ok ? {} : { cumple: false })] }], alto: 6.4, margen: 1,
      nota: ok ? 'Cumple: algún integrante de la banda baila' : 'No cumple: el aro no toca a la banda' });
  };
  const mesaVenn = {
    id: 'venn-libre', titulo: 'El aro donde quieras', pieza: AR,
    consigna: 'Todos los quenistas están en la banda. Mueve y agranda el aro de la diablada: busca dibujos que cumplan «algunos de la banda bailan».',
    controles: [
      { id: 'cx', etiqueta: 'Lugar del aro', min: 1, max: 8, paso: 0.1, inicio: 7.2, decimales: 1, color: 'c-i' },
      { id: 'cr', etiqueta: 'Tamaño del aro', min: 0.5, max: 2, paso: 0.1, inicio: 1.5, decimales: 1, color: 'c-i' },
    ],
    dibujo: val => ({ datos: vennLibre(val), estado: {} }),
    lectura: val => (!tocanA(VBL, dLibre(val)) ? ['No toca a la banda: no vale como dibujo'] : ['Dibujo válido: ', tocanA(VQL, dLibre(val)) ? 'algún quenista baila' : 'ningún quenista baila']),
    // Retos: cada logrado usa tocanA(), la misma prueba que decide la nota y el aro gris del dibujo.
    invitaciones: [
      { texto: 'Haz un dibujo que cumpla las premisas y donde algún quenista baile.',
        logrado: val => tocanA(VBL, dLibre(val)) && tocanA(VQL, dLibre(val)),
        bien: 'Este dibujo dice «sí». Falta ver si todos los dibujos dicen lo mismo.' },
      { texto: 'Pon el aro a la izquierda de los quenistas, cumpliendo las premisas y sin tocarlos.',
        logrado: val => val.cx < VQL.x && tocanA(VBL, dLibre(val)) && !tocanA(VQL, dLibre(val)),
        bien: 'El aro puede tocar a la banda por cualquier lado: no queda amarrado a los quenistas.' },
      { texto: 'Mueve el aro a la derecha hasta el último lugar donde toca a la banda.',
        // Un paso más (0,1) a la derecha y ya no tocaría a la banda.
        logrado: val => tocanA(VBL, dLibre(val)) && !tocanA(VBL, dLibre({ cx: Math.round(val.cx * 10 + 1) / 10, cr: val.cr })),
        bien: 'Ese es el borde: un paso más y la banda ya no tiene danzantes.' },
      { texto: 'Guarda dos dibujos que cumplan: en uno algún quenista baila; en otro, ninguno.',
        logrado: (val, guardados) => guardados.some(g => tocanA(VBL, dLibre(g)) && tocanA(VQL, dLibre(g)))
          && guardados.some(g => tocanA(VBL, dLibre(g)) && !tocanA(VQL, dLibre(g))),
        bien: 'Los dos cumplen las premisas y dicen lo contrario: no hay conclusión sobre quenistas y diablada.' },
    ],
    arrastres: [
      { id: 'centro-c', etiqueta: 'lugar del aro de la diablada', color: 'c-i',
        donde: val => Kit.piezas[AR].vennPx(vennLibre(val), 0, val.cx, 3.2), mover: (pt, val) => ({ cx: Kit.piezas[AR].vennPiso(vennLibre(val), 0, pt).x }) },
      { id: 'borde-c', etiqueta: 'tamaño del aro de la diablada', color: 'c-i',
        donde: val => Kit.piezas[AR].vennPx(vennLibre(val), 0, val.cx, 3.2 + val.cr), mover: (pt, val) => ({ cr: Kit.piezas[AR].vennPiso(vennLibre(val), 0, pt).y - 3.2 }) },
    ],
  };

  // Mesa de la idea 1: las cuatro pistas del reparto, cada una prendida o apagada: el orden no importa, importa cuáles.
  // Conserva su id y los de sus controles (p0 a p3: la colección guarda { mesa, valores }).
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const PL = [pista(0, 1), pista(1, 0), pista(2, 2), pista(0, 2)];
  const activas = val => PL.filter((_, k) => val['p' + k]);
  const nRep = val => quedanR(3, activas(val)).length;
  // El grupo más chico de pistas que deja un solo reparto (contado, no escrito a mano).
  const MIN_PISTAS = Math.min(...Array.from({ length: 1 << PL.length }, (_, m) => PL.filter((_, k) => (m >> k) & 1))
    .filter(ps => quedanR(3, ps).length === 1).map(ps => ps.length));
  const mesaCuadro = {
    id: 'pistas-a-eleccion', titulo: 'Pistas a elección', pieza: OB,
    consigna: 'Prende y apaga cada pista. Busca el grupo más chico de pistas que deja un solo reparto.',
    controles: PL.map((p, k) => ({ id: 'p' + k, etiqueta: p.t.replace(/\.$/, ''), opciones: SINO, inicio: k < 3 ? 1 : 0 })),
    dibujo: val => ({ datos: Object.assign(campeonato(activas(val)), { lineas: PL.length }), estado: {} }),
    lectura: val => { const k = activas(val).length, n = nRep(val); return [`${k} ${k === 1 ? 'pista' : 'pistas'}: ${n} ${n === 1 ? 'reparto queda' : 'repartos quedan'}`]; },
    // Retos: cuentan con quedanR() y segurosDe(), lo mismo que pone las ✗, las ✓ y los repartos tachados.
    invitaciones: [
      { texto: 'Prende y apaga pistas hasta que quede un solo reparto posible.',
        logrado: val => nRep(val) === 1,
        bien: 'Un solo reparto: cada fila y cada columna quedó con su ✓.' },
      { texto: 'Deja un solo reparto con el menor número de pistas. ¿Cuál sobraba?',
        logrado: val => nRep(val) === 1 && activas(val).length === MIN_PISTAS,
        bien: 'Una pista no aportaba nada: lo que tachaba ya lo tachaban las otras.' },
      { texto: 'Consigue una ✓ segura aunque todavía quede más de un reparto.',
        logrado: val => nRep(val) > 1 && segurosDe(3, activas(val)).length > 0,
        bien: 'Esa casilla coincide en todos los repartos que quedan: es seguro sin saberlo todo.' },
      { texto: 'Apaga todas las pistas y cuenta cuántos repartos son posibles sin datos.',
        logrado: val => activas(val).length === 0,
        bien: `Sin pistas quedan los ${PERM3.length} repartos. Cada pista va descartando algunos.` },
      { texto: 'Guarda dos grupos de pistas distintos que dejen un solo reparto.',
        logrado: (val, guardados) => new Set(guardados.filter(g => nRep(g) === 1).map(g => activas(g).map(p => p.t).join('|'))).size >= 2,
        bien: 'Dos caminos distintos llegan al mismo reparto. ¿Cuál usa menos pistas?' },
    ],
  };
  // Mesa nueva de la idea 1: el cuadro se marca a mano, tocando cada casilla (vacía → ✗ → ✓). Las pistas están fijas y
  // el motor dice si cada marca cuadra con ellas (data-toque en rm-objeto; Gerson, 17 nov: marcar tocando el cuadro).
  const PM = [pista(1, 0), pista(2, 0), pista(2, 2)];
  const SOL_M = quedanR(3, PM)[0];
  const MARCAS = [{ valor: 'vacia', texto: 'Vacía' }, { valor: 'no', texto: '✗' }, { valor: 'si', texto: '✓' }];
  const celdas = [];
  for (let q = 0; q < 3; q++) for (let c = 0; c < 3; c++) celdas.push({ q, c, id: `m${q}${c}` });
  // Una marca choca si pone ✓ donde el único reparto no lo tiene, o ✗ donde sí lo tiene.
  const choca = (val, x) => (val[x.id] === 'si' && SOL_M[x.q] !== x.c) || (val[x.id] === 'no' && SOL_M[x.q] === x.c);
  const malas = val => celdas.filter(x => choca(val, x));
  const puestas = (val, m) => celdas.filter(x => val[x.id] === m);
  const mesaMarca = {
    id: 'marca-tu-cuadro', titulo: 'Marca tú el cuadro', pieza: OB,
    consigna: 'Toca una casilla para marcarla: una vez ✗, otra vez ✓, otra vez vacía. Las pistas no cambian.',
    controles: celdas.map(x => ({ id: x.id, etiqueta: `${P3[x.q]} y ${D3[x.c]}`, opciones: MARCAS })),
    dibujo: val => ({ datos: { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3,
      marcas: Object.fromEntries(celdas.filter(x => val[x.id] !== 'vacia').map(x => [`${x.q},${x.c}`, val[x.id]])),
      toques: Object.fromEntries(celdas.map(x => [`${x.q},${x.c}`, x.id])),
      manos: celdas.filter(x => val[x.id] === 'si' && !choca(val, x)).map(x => ({ f: x.q, c: x.c })),
      pistas: PM.map(p => ({ t: p.t })), lineas: PM.length }, estado: {} }),
    lectura: val => {
      const m = malas(val);
      if (m.length) return [`${P3[m[0].q]} y ${D3[m[0].c]}: esa marca choca con las pistas`];
      const n = celdas.filter(x => val[x.id] !== 'vacia').length;
      if (n === celdas.length) return ['Cuadro completo: una ', F('✓'), ' por fila y por columna'];
      return [n ? `${n} ${n === 1 ? 'marca' : 'marcas'}, todas de acuerdo con las pistas` : 'Sin marcas: toca una casilla'];
    },
    // Retos: todos leen choca(), lo mismo que decide la lectura y qué cosa pasa a la mano de su dueño.
    invitaciones: [
      { texto: 'Marca las ✗ que ponen las pistas, sin poner ninguna ✓.',
        logrado: val => PM.every(p => val[`m${p.q}${p.c}`] === 'no') && !puestas(val, 'si').length && !malas(val).length,
        bien: 'Esas tres ✗ salen directo de las pistas. ¿Alguna fila o columna quedó con una sola casilla?' },
      { texto: 'Pon una ✓ que sea segura, sin ninguna marca que choque.',
        logrado: val => puestas(val, 'si').length > 0 && !malas(val).length,
        bien: 'Segura: vale en el único reparto que dejan las pistas. Mira la mano de su dueño.' },
      { texto: 'Completa el cuadro: una ✓ en cada fila y ✗ en todo lo demás.',
        logrado: val => puestas(val, 'si').length === 3 && puestas(val, 'no').length === 6 && !malas(val).length,
        bien: 'Cuadro completo: cada ✓ tachó su fila y su columna.' },
    ],
  };
  // Mesa de la idea 5: el parentesco entre dos personas cualesquiera de las fotos, con el camino que sube y baja.
  // Conserva su id y los de sus controles (de, a).
  const PERSONAS5 = PER5.map(p => ({ valor: p.id, texto: p.nombre }));
  const largo = (de, a) => { const c = caminoDe(de, a); return c.u + c.d; };
  const parFig = val => familia({ habla: val.de, elegida: val.a !== val.de ? val.a : undefined, camino: val.a !== val.de ? { ids: caminoDe(val.de, val.a).ids } : undefined });
  const lugarFoto = (val, id, dx) => { const g = Kit.piezas[FA].geometria(parFig(val)), p = PER5.find(x => x.id === id); return { x: g.X(p.x) + dx, y: g.Y(p.g) }; };
  const masCerca = (val, pt, dx) => PER5.reduce((m, p) => { const a = lugarFoto(val, p.id, dx), b = lugarFoto(val, m, dx); return Math.hypot(a.x - pt.x, a.y - pt.y) < Math.hypot(b.x - pt.x, b.y - pt.y) ? p.id : m; }, PER5[0].id);
  const mesaFamilia = {
    id: 'cualquier-pariente', titulo: 'Dos personas cualesquiera', pieza: FA,
    consigna: 'Elige quién habla y a quién nombra. El camino entre sus fotos dice el parentesco: cuántas líneas sube y cuántas baja.',
    controles: [{ id: 'de', etiqueta: 'Habla', opciones: PERSONAS5, inicio: 'ivan' }, { id: 'a', etiqueta: 'Nombra a', opciones: PERSONAS5, inicio: 'ana' }],
    dibujo: val => ({ datos: parFig(val), estado: {} }),
    lectura: val => {
      if (val.de === val.a) return ['Es la misma persona'];
      const c = caminoDe(val.de, val.a);
      return [`Para ${NOM5[val.de]}, ${NOM5[val.a]} es su ${relDe(val.de, val.a)}: sube ${c.u}, baja ${c.d}`];
    },
    // Retos: todos leen caminoDe(), el mismo que pinta las líneas del árbol.
    invitaciones: [
      { texto: 'Busca a la persona que es tío de Ana.',
        logrado: val => val.de === 'ana' && val.a !== 'ana' && caminoDe('ana', val.a).u === 2 && caminoDe('ana', val.a).d === 1,
        bien: 'Tomás: sube dos líneas hasta Raúl y baja una. ¿Quién es sobrino de Tomás?' },
      { texto: 'Busca el pariente más lejano de Luis: el camino con más líneas.',
        logrado: val => val.de === 'luis' && val.a !== 'luis' && largo('luis', val.a) === Math.max(...PER5.map(p => largo('luis', p.id))),
        bien: 'Su primo Iván: sube dos y baja dos. Ningún camino desde Luis es más largo.' },
      { texto: 'Guarda dos casos donde la misma persona sea padre de alguien y también hijo.',
        logrado: (val, guardados) => guardados.some(x => { const c = caminoDe(x.de, x.a); return c.u === 1 && c.d === 0
          && guardados.some(y => { const e = caminoDe(y.de, y.a); return y.a === x.a && e.u === 0 && e.d === 1; }); }),
        bien: 'Una persona, dos papeles. Por eso dos padres y dos hijos pueden ser tres.' },
      { texto: 'Guarda un par y después el mismo par al revés, con otro nombre de parentesco.',
        logrado: (val, guardados) => guardados.some(x => x.de !== x.a && caminoDe(x.de, x.a).u !== caminoDe(x.de, x.a).d
          && guardados.some(y => y.de === x.a && y.a === x.de)),
        bien: 'Al voltear el par, lo que subía ahora baja: tío se vuelve sobrino.' },
    ],
    arrastres: [
      { id: 'desde', etiqueta: 'persona que habla', color: 'c-o', donde: val => lugarFoto(val, val.de, -30), mover: (pt, val) => ({ de: masCerca(val, pt, -30) }) },
      { id: 'hasta', etiqueta: 'persona que nombra', color: 'c-f', donde: val => lugarFoto(val, val.a, 30), mover: (pt, val) => ({ a: masCerca(val, pt, 30) }) },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.razonamiento-deductivo',
    calidad: 2,
    // Laboratorio: las pistas a elección y el cuadro marcado a mano (idea 1), el aro libre (idea 3) y el parentesco entre
    // dos personas cualesquiera (idea 5). Las ideas 2 y 4 aportan su juego.
    laboratorio: [mesaCuadro, mesaMarca, mesaVenn, mesaFamilia],
    version: '0.4.0',
    estado: 'completa',
    // Glosario (docs/teoria.md, 4d y 4g): las palabras que esta unidad estrena en el curso, cada una con su aproximación de
    // todos los días (simple) y 3 ejemplos. Cada término va en la primera idea que lo usa (Glosario.porIdea).
    glosario: [
      // Idea 1
      { termino: 'cuadro de doble entrada', def: 'Tabla con un grupo en las filas y otro en las columnas, para marcar qué va con qué.',
        simple: 'Una tabla para marcar quién va con qué.',
        formas: ['cuadro de doble entrada', 'cuadro'], ejemplos: [
          'Personas en las filas y deportes en las columnas: cada casilla pregunta «¿esta persona juega esto?».',
          'Papás en las filas e hijas en las columnas: cada casilla pregunta «¿es su hija?».',
          'Vendedores en las filas y productos en las columnas, para una kermés.'], ver: ['reparto'] },
      { termino: 'reparto', formas: ['reparto', 'repartos'], def: 'Forma de asignar a cada persona una sola cosa distinta, sin que dos personas compartan la misma.',
        simple: 'Una manera de darle a cada uno una cosa distinta.', ejemplos: [
          'Ana fútbol, Beto vóley y Ciro ajedrez es un reparto de tres deportes.',
          'Con tres personas y tres cosas hay 6 repartos: 3 × 2 × 1.',
          'Con cuatro personas y cuatro cosas hay 24 repartos: 4 × 3 × 2 × 1.'], ver: ['cuadro de doble entrada'] },
      { termino: 'descartar', formas: ['descartar', 'descarta', 'descartan', 'descartado', 'descartada', 'descartados', 'descartadas'],
        def: 'Dejar de lado una posibilidad porque choca con un dato.',
        simple: 'Tachar lo que ya no puede ser.', ejemplos: [
          '«Beto no juega fútbol» descarta los repartos donde Beto juega fútbol.',
          'Si Ana ya tiene el fútbol, se descarta el fútbol para todos los demás.',
          'Un reparto que choca con una sola pista también queda descartado.'], ver: ['reparto'] },
      // Idea 2
      { termino: 'atributo', formas: ['atributo', 'atributos'], def: 'Rasgo que se dice de cada persona en un problema: lo que toca, dónde vive, su edad.',
        simple: 'Algo que se dice de una persona: su instrumento, su ciudad.', ejemplos: [
          'En la comparsa, el instrumento y la ciudad son dos atributos de cada músico.',
          'En la olimpiada, el deporte y el número de camiseta.',
          'Con dos atributos, un reparto dice dos cosas de cada persona.'], ver: ['reparto'] },
      { termino: 'dueño', formas: ['dueño', 'dueña', 'dueños'], def: 'En un reparto, la persona que tiene una cosa.',
        simple: 'Quien tiene esa cosa.', ejemplos: [
          'Si Beto toca bombo, Beto es el dueño del bombo.',
          'Lo que se sabe del bombo («viene de Lampa») pasa a su dueño.',
          'Cada cosa tiene un solo dueño, porque nada se repite.'], ver: ['atributo'] },
      // Idea 3
      { termino: 'premisa', def: 'Dato o afirmación que se acepta como punto de partida para razonar.',
        simple: 'Lo que se da por cierto para empezar.', ejemplos: [
          '«Todos los quenistas están en la banda» es una premisa.',
          'En un silogismo hay dos premisas y una conclusión.',
          'Una premisa no se discute: se usa tal como está dicha.'], ver: ['conclusión'] },
      { termino: 'conclusión', def: 'Lo que se afirma a partir de las premisas. Es segura solo si vale en todos los casos posibles.',
        simple: 'Lo que se saca de los datos.', ejemplos: [
          'De «todo A es B» y «todo B es C» sale: todo A es C.',
          'De «ningún B es C» y «todo A es B» sale: ningún A es C.',
          'Si un dibujo que cumple las premisas la rompe, no es segura.'], ver: ['premisa', 'certeza'] },
      { termino: 'algunos', def: 'En lógica: al menos uno, y quizás todos. No dice cuáles ni cuántos.',
        simple: 'Al menos uno; quizás todos.',
        formas: ['algunos', 'algunas', 'algún'], ejemplos: [
          '«Algunos músicos son pintores» se cumple aunque un solo músico pinte.',
          '«Algunos músicos son pintores» también se cumple si todos los músicos pintan.',
          '«Algunos lectores no nadan»: al menos un lector queda fuera de los que nadan.'] },
      { termino: 'diagrama de Venn', def: 'Dibujo con un aro por grupo: muestra qué grupos están dentro de otros, se cruzan o se separan.',
        simple: 'Aros dibujados: cada uno es un grupo.',
        formas: ['diagrama de Venn', 'diagramas de Venn'], ejemplos: [
          '«Todos los quenistas están en la banda»: un aro dentro del otro.',
          '«Ningún pintor es ciclista»: dos aros que no se tocan.',
          '«Algunos músicos son pintores»: dos aros que comparten un pedazo.'] },
      { termino: 'certeza', def: 'Seguridad total: algo vale en todos los casos que permiten los datos, sin excepción.', ejemplos: [
        'Si en los dos repartos que quedan Ana juega fútbol, eso se sabe con certeza.',
        'Con lluvia, la pista mojada es una certeza de la regla.',
        'Lo que pasa en un solo dibujo posible no es una certeza.'], ver: ['conclusión'] },
      // Idea 4
      { termino: 'condicional', def: 'Frase «si p, entonces q»: asegura que siempre que pasa p, también pasa q.',
        simple: 'Una regla con «si…, entonces…».', ejemplos: [
          '«Si llueve, la pista se moja»: con lluvia, la pista no puede quedar seca.',
          '«Si suena el timbre largo, empieza el recreo.»',
          'Un condicional no dice qué pasa cuando no pasa lo primero.'], ver: ['forma directa', 'forma indirecta'] },
      { termino: 'forma directa', def: 'Razonar desde «si p, entonces q» y «pasa p» hasta «pasa q».',
        simple: 'Pasó lo primero: entonces pasa lo segundo.', ejemplos: [
          'Si llueve, se moja. Llueve. Entonces está mojada.',
          'Si suena el timbre, empieza el recreo. Sonó. Empieza el recreo.',
          'Si Ana llega temprano, ayuda. Llegó temprano. Ayuda.'], ver: ['condicional', 'forma indirecta'] },
      { termino: 'forma indirecta', def: 'Razonar desde «si p, entonces q» y «no pasa q» hasta «no pasa p».',
        simple: 'No pasó lo segundo: entonces no pasó lo primero.', ejemplos: [
          'Si llueve, se moja. Está seca. Entonces no llovió.',
          'Si la tienda está abierta, la luz se prende. Está apagada: la tienda no está abierta.',
          'Si el frasco tiene canicas, pesa más de 1 kg. No pesa tanto: no tiene canicas.'], ver: ['condicional', 'forma directa'] },
      // Idea 5
      { termino: 'parentesco', def: 'Relación de familia entre dos personas, como padre, tío o primo.',
        simple: 'Qué es una persona de otra en su familia.',
        formas: ['parentesco', 'parentescos'], ejemplos: [
          'El hijo de tu tío es tu primo.',
          'La hija de tu hermana es tu sobrina.',
          'El papá de tu papá es tu abuelo.'], ver: ['árbol genealógico'] },
      { termino: 'árbol genealógico', def: 'Dibujo de una familia: cada línea une a un padre o una madre con un hijo o una hija.',
        simple: 'El dibujo de una familia, con líneas de padres a hijos.',
        formas: ['árbol genealógico', 'árbol', 'árboles'], ejemplos: [
          'De Ana a su primo Iván: el camino sube 2 líneas y baja 2.',
          'Los abuelos van arriba; los nietos, abajo.',
          'Dos hermanos cuelgan de la misma línea de sus padres.'], ver: ['parentesco', 'generación'] },
      { termino: 'generación', formas: ['generación', 'generaciones'], def: 'Cada piso de un árbol genealógico: abuelos, padres, nietos.',
        simple: 'Un piso del árbol: los abuelos, los padres o los nietos.', ejemplos: [
          'Raúl es de la primera generación del árbol; Ana, de la tercera.',
          'Hermanos y primos están en la misma generación.',
          'Subir una línea es pasar a la generación de arriba.'], ver: ['árbol genealógico'] },
    ],
    requiere: ['/nucleo/kit/piezas/rm-objeto.js', '/nucleo/kit/piezas/rm-aros.js', '/nucleo/kit/piezas/rm-casos.js', '/nucleo/kit/piezas/rm-familia.js'],
    historia: {
      texto: 'En el siglo IV a. C., Aristóteles estudió qué conclusiones se siguen necesariamente de unas premisas. Separó dos cosas: que las premisas sean verdaderas y que el paso hacia la conclusión sea válido. Los acertijos de familias y repartos de hoy son otra aplicación de esa misma pregunta.',
      pregunta: '¿Cuándo una conclusión no puede fallar?',
      fuente: { titulo: 'Aristotle’s Logic · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/aristotle-logic/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'venn-libre': ['conclusion-necesaria'],
      'cualquier-pariente': ['parentesco'],
      'pistas-a-eleccion': ['doble-entrada'],
      'marca-tu-cuadro': ['doble-entrada'],
    },
    // Orden aprobado (docs/etapa3/decisiones.md): los ids no cambian (guardan el avance); dos-atributos es nueva.
    ideas: [ideaCuadro, ideaListas, ideaVenn, ideaSi, ideaFamilia],
  };
});
