/*
 * Generador «El cuadro que descarta»: cuadros de doble entrada (razonamiento-matematico.razonamiento-deductivo, ideas 1
 * y 2). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['rm-cuadros']) y en
 * Node (require).
 *
 * Todo lo resuelve el motor de «El tablero de las pistas» (plantillas/orden-informacion/motor.js, modo `cuadro`), por
 * fuerza bruta: arma todos los repartos y se queda con los que cumplen las pistas (regla 1). Este archivo no copia esa
 * lógica: elige el reparto y las pistas, pregunta al motor cuántos repartos quedan y escribe el problema. En el
 * navegador, si la escena todavía no cargó el motor, lo carga del mismo servidor antes de registrarse (ver abajo).
 *
 * Tipos (propuesta de la etapa 3, §7; docs/etapa3/decisiones.md):
 *   cuadro      idea 1 (doble-entrada): 3 o 4 personas y una lista (deportes, talleres, kermés, comisiones), con pistas
 *               «X juega…» y «X no juega…».
 *   atributos   idea 2 (dos-atributos): 3 o 4 personas y dos o tres listas (instrumento, ciudad, edad…), con al menos
 *               una pista que cruza dos listas sin nombrar a nadie («Quien toca charango vive en Juliaca»).
 *   Subtipos de los dos:
 *     quien     las pistas dejan un solo reparto; se pregunta qué tiene alguien, quién tiene algo o (en atributos) qué
 *               tiene quien tiene otra cosa. Opciones: los valores de la lista y «Faltan datos».
 *     seguro    las pistas dejan 2 o 3 repartos; se pregunta cuál afirmación es segura (vale en todos).
 *   _datos: { tipo, sub, nivel, contexto, personas, listas: [{ id, items }], pistas (formato del motor), pide }, con
 *   pide = { t: 'valor', persona, atributo } | { t: 'quienTiene', atributo, valor } | { t: 'cruce', atr1, val1, atr2 }
 *   | { t: 'seguro', opciones: [afirmaciones en formato de pista del motor, o { tipo: 'nada' }] }.
 *   Niveles: 1, cuadro de 3; 2, cuadro de 4 o atributos de 3 × 2; 3, atributos de 4 × 2 o de 3 × 3.
 *   Cada pista hace falta (sin una cambia lo que queda), y en atributos alguna pista que cruza hace falta.
 *
 * Paleta de deducción (decisión de Gerson, 17 nov; la misma de la teoría): las ideas 1 y 2 usan solo violeta, para lo
 * seguro y lo pedido ya comprobado (la ✓, la respuesta); personas, cosas y pistas en tinta; lo descartado (✗) en gris.
 * La pregunta va en tinta: el violeta aparece recién en la solución. Sin naranja, turquesa, verde ni carmín.
 *
 * Errores (códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis; los mismos de la teoría):
 *   RMP72-pista-sin-revisar  vale con todas las pistas menos una (que la descarta)
 *   RMP63-sin-cruce          vale si se salta la pista que no nombra a nadie (idea 2)
 *   RMP63-dos-pistas         choca con dos pistas o más
 *   RMP77-posible            pasa en un reparto de los que quedan, no en todos
 *   RMP78-faltan-datos       creer que no se puede saber nada todavía
 *
 * calc: repartos(problema) (los que cumplen todas las pistas, del motor), estado(problema, afirmación) ('siempre',
 * 'aveces' o 'nunca'), textoPista(problema, pista).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../orden-informacion/motor.js') : (root.MotorOrden || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  // La app carga un solo archivo por generador (app/practica.js). El motor del cuadro vive en la escena
  // orden-informacion (y el service worker ya lo guarda, porque es archivo de esa plantilla): se pide al mismo servidor
  // y se ejecuta como un script en línea, antes de registrar el generador.
  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../orden-informacion/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('rm-cuadros: no se pudo cargar el motor del cuadro');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorOrden) throw new Error('rm-cuadros: el motor del cuadro no se registró');
    return r.MotorOrden;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'rm-cuadros';
  const v = P.v;
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  const lista = (xs, y = 'y') => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}`);
  const err = (id, op, explicacion) => ({ id, clave: op.clave, texto: op.texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo', 'Inés', 'Luis', 'Rosa', 'Saúl'];

  // ---------- Listas y cómo se dicen (las mismas palabras que la teoría) ----------
  // frase: cómo se dice en una pista («toca {v}»); preg: la pregunta por una persona; cruce: la misma pregunta por
  // «quien…»; op: cómo se escribe un valor como alternativa.
  const LISTAS = {
    deporte: { plural: 'deportes', sing: 'deporte', frase: 'juega {v}', preg: '¿Qué deporte juega', items: ['fútbol', 'vóley', 'ajedrez', 'básquet'],
      regla: 'Cada uno juega un solo deporte, y ningún deporte se repite.' },
    taller: { plural: 'talleres', sing: 'taller', frase: 'está en el taller de {v}', preg: '¿En qué taller está', items: ['danza', 'teatro', 'dibujo', 'oratoria'],
      regla: 'Cada uno está en un solo taller, y ningún taller se repite.' },
    venta: { plural: 'productos', sing: 'producto', frase: 'vende {v}', preg: '¿Qué vende', items: ['tamales', 'jugos', 'choclo', 'queso'],
      regla: 'Cada uno vende una sola cosa, y ninguna se repite.' },
    comision: { plural: 'comisiones', sing: 'comisión', frase: 'está en la comisión de {v}', preg: '¿En qué comisión está', items: ['adornos', 'música', 'juegos', 'limpieza'],
      regla: 'Cada uno está en una sola comisión, y ninguna se repite.' },
    instrumento: { plural: 'instrumentos', frase: 'toca {v}', preg: '¿Qué toca', items: ['quena', 'charango', 'bombo', 'zampoña'] },
    ciudad: { plural: 'ciudades', frase: 'vive en {v}', preg: '¿Dónde vive', items: ['Puno', 'Juliaca', 'Ilave', 'Ayaviri'] },
    edad: { plural: 'edades', frase: 'tiene {v} años', preg: '¿Cuántos años tiene', items: ['15', '16', '17', '18'], op: x => `${x} años` },
    producto: { plural: 'productos', frase: 'vende {v}', preg: '¿Qué vende', items: ['tamales', 'jugos', 'choclo', 'queso'] },
    mandil: { plural: 'mandiles', frase: 'usa mandil {v}', preg: '¿De qué color es el mandil de', items: ['rojo', 'azul', 'blanco', 'negro'] },
    juego: { plural: 'deportes', frase: 'juega {v}', preg: '¿Qué juega', items: ['fútbol', 'vóley', 'básquet', 'ajedrez'] },
    numero: { plural: 'números', frase: 'lleva el número {v}', preg: '¿Qué número lleva', items: ['5', '7', '9', '10'], op: x => `El número ${x}` },
  };
  const opV = (L, x) => mayus(LISTAS[L].op ? LISTAS[L].op(x) : x);
  const opMin = (L, x) => (LISTAS[L].op ? minus(LISTAS[L].op(x)) : x);
  // Un valor dentro de la lista del enunciado: «15 años», pero el número va solo («5, 7 y 9»).
  const itemEn = (L, x) => (L === 'numero' ? x : opMin(L, x));
  // Contextos. Idea 1: una lista. Idea 2: dos o tres listas.
  const CTX1 = [
    { id: 'campeonato', lista: 'deporte', intro: 'se inscribieron en el campeonato del aniversario del colegio, cada uno en un deporte distinto' },
    { id: 'talleres', lista: 'taller', intro: 'están cada uno en un taller distinto del colegio' },
    { id: 'kermes', lista: 'venta', intro: 'venden cada uno algo distinto en la kermés del aniversario' },
    { id: 'comisiones', lista: 'comision', intro: 'están cada uno en una comisión distinta del aniversario' },
  ];
  const CTX2 = [
    { id: 'comparsa', listas: ['instrumento', 'ciudad', 'edad'], intro: 'tocan en la comparsa del colegio' },
    { id: 'puesto', listas: ['producto', 'mandil'], intro: 'atienden cada uno un puesto en la kermés' },
    { id: 'olimpiada', listas: ['juego', 'numero', 'edad'], intro: 'compiten en la olimpiada del colegio' },
  ];
  const R_LISTAS = 'Cada uno tiene una sola cosa de cada lista, y nada se repite.';
  const D_QUIEN = 'Una pista con «quien…» habla de una sola persona, aunque no diga su nombre.';
  const D_SEGURO = 'Seguro: se cumple en todos los repartos que dejan las pistas.';
  const D_REPARTO = 'Reparto: una manera de darle a cada uno lo suyo que cumple la regla.';

  // ---------- El problema en el formato del motor ----------
  function problema(personas, listas, pistas) {
    const atributos = {}, frases = {};
    for (const L of listas) { atributos[L.id] = L.items; frases[L.id] = LISTAS[L.id].frase; }
    return { forma: 'cuadro', personas, atributos, frases, pistas };
  }
  const repartos = p => M.resolver(p).soluciones;
  const total = p => M.resolver(p).total;
  const conPistas = (p, pistas) => Object.assign({}, p, { pistas });
  const deDel = t => t.replace(/\bde el\b/g, 'del');
  const textoPista = (p, q) => mayus(deDel(M.textoPista(q, p)));
  // La misma pista dentro de una frase: los nombres siguen con mayúscula; «Quien» pasa a «quien».
  const enFrase = (p, q) => deDel(M.textoPista(q, p)).replace(/^Quien /, 'quien ');
  const igualPista = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // Una afirmación (mismo formato que una pista) en todos los repartos que quedan: 'siempre', 'aveces' o 'nunca'.
  const estado = (p, a) => M.estadoAfirmacion(p, a).estado;
  const reparto1 = (p, s) => p.personas.map((x, i) => `${x}: ${lista(Object.keys(p.atributos).map(L => opMin(L, s[L][i])))}`).join('; ');

  // Todas las pistas verdaderas en el reparto sol (las que podrían decirse).
  function pistasVerdaderas(p, sol) {
    const ats = Object.keys(p.atributos), out = [];
    p.personas.forEach((persona, i) => {
      for (const a of ats) for (const x of p.atributos[a]) out.push(x === sol[a][i] ? { tipo: 'es', persona, atributo: a, valor: x } : { tipo: 'noEs', persona, atributo: a, valor: x });
    });
    for (const a1 of ats) for (const a2 of ats) {
      if (a1 >= a2) continue;
      for (const x of p.atributos[a1]) for (const y of p.atributos[a2]) {
        const i = sol[a1].indexOf(x);
        out.push(sol[a2][i] === y ? { tipo: 'mismo', atr1: a1, val1: x, atr2: a2, val2: y } : { tipo: 'noMismo', atr1: a1, val1: x, atr2: a2, val2: y });
      }
    }
    return out;
  }
  const esCruce = q => q.tipo === 'mismo' || q.tipo === 'noMismo';

  // Elige pistas verdaderas hasta que queden entre `min` y `max` repartos; después quita las que sobran.
  function elegirPistas(rng, p, sol, { min, max, cruce, maxPistas }) {
    const cand = rng.barajar(pistasVerdaderas(p, sol));
    // Peso: las negativas y las que cruzan, primero; una sola «X tiene…» como mucho.
    const peso = q => (q.tipo === 'noEs' ? 2 : q.tipo === 'noMismo' ? 2 : q.tipo === 'mismo' ? 2.4 : 1) + rng.sig() * 2;
    cand.sort((a, b) => peso(b) - peso(a));
    let pistas = [];
    for (const q of cand) {
      if (q.tipo === 'es' && pistas.some(x => x.tipo === 'es')) continue;
      if (!cruce && esCruce(q)) continue;
      const antes = total(conPistas(p, pistas)), despues = total(conPistas(p, pistas.concat([q])));
      if (despues === antes) continue;
      if (despues < min) continue;
      pistas.push(q);
      if (despues <= max) break;
    }
    const t = total(conPistas(p, pistas));
    if (t < min || t > max) return null;
    // Cada pista hace falta: se quitan las que sobran (sin ellas quedan los mismos repartos).
    for (const q of rng.barajar(pistas.slice())) {
      const sin = pistas.filter(x => x !== q);
      if (total(conPistas(p, sin)) === t) pistas = sin;
    }
    if (pistas.length > maxPistas) return null;
    if (cruce && !pistas.some(esCruce)) return null;
    return rng.barajar(pistas);
  }

  // ---------- Construcción ----------
  function construir(rng, tipo, sub, nivelFijo) {
    const nivel = nivelFijo || (tipo === 'cuadro' ? (rng.sig() < 0.5 ? 1 : 2) : (rng.sig() < 0.45 ? 2 : 3));
    let ctx, listasId, k;
    if (tipo === 'cuadro') { ctx = rng.elegir(CTX1); listasId = [ctx.lista]; k = nivel === 1 ? 3 : 4; }
    else {
      ctx = rng.elegir(CTX2);
      if (nivel === 2) { k = 3; listasId = ctx.listas.slice(0, 2); }
      else if (ctx.listas.length === 3 && rng.moneda()) { k = 3; listasId = ctx.listas.slice(); }
      else { k = 4; listasId = ctx.listas.slice(0, 2); }
    }
    const personas = rng.barajar(GENTE).slice(0, k).sort((a, b) => GENTE.indexOf(a) - GENTE.indexOf(b));
    const listas = listasId.map(id => ({ id, items: LISTAS[id].items.slice(0, k) }));
    const base = problema(personas, listas, []);
    const sol = {};
    for (const L of listas) sol[L.id] = rng.barajar(L.items);
    const cruce = tipo === 'atributos';
    const maxPistas = tipo === 'cuadro' ? (k === 3 ? 3 : 6) : k === 3 ? (listas.length === 2 ? 5 : 7) : 8;
    const pistas = elegirPistas(rng, base, sol, sub === 'quien' ? { min: 1, max: 1, cruce, maxPistas } : { min: 2, max: 3, cruce, maxPistas });
    if (!pistas) return null;
    if (tipo === 'cuadro' && pistas.filter(q => q.tipo === 'noEs').length < 2) return null;
    const p = conPistas(base, pistas);
    const d = { tipo, sub, nivel, contexto: ctx.id, personas, listas, pistas };
    return sub === 'quien' ? armarQuien(rng, p, d, ctx) : armarSeguro(rng, p, d, ctx);
  }

  // La pregunta de «quien»: algo que ninguna pista dice tal cual.
  function elegirPregunta(rng, p, d, sol) {
    const ats = Object.keys(p.atributos), dichas = d.pistas;
    const opciones = [];
    p.personas.forEach((persona, i) => ats.forEach(a => {
      if (!dichas.some(q => q.tipo === 'es' && q.persona === persona && q.atributo === a)) opciones.push({ t: 'valor', persona, atributo: a, peso: 3 });
    }));
    for (const a of ats) for (const x of p.atributos[a]) if (!dichas.some(q => q.tipo === 'es' && q.atributo === a && q.valor === x)) opciones.push({ t: 'quienTiene', atributo: a, valor: x, peso: 2 });
    if (ats.length > 1) for (const a1 of ats) for (const a2 of ats) {
      if (a1 === a2) continue;
      for (const x of p.atributos[a1]) {
        const dicha = dichas.some(q => q.tipo === 'mismo' && ((q.atr1 === a1 && q.val1 === x && q.atr2 === a2) || (q.atr2 === a1 && q.val2 === x && q.atr1 === a2)));
        if (!dicha) opciones.push({ t: 'cruce', atr1: a1, val1: x, atr2: a2, peso: 3 });
      }
    }
    if (!opciones.length) return null;
    const bolsa = opciones.flatMap(o => Array(o.peso).fill(o));
    const { peso, ...pide } = rng.elegir(bolsa);
    return pide;
  }
  // La respuesta de la pregunta en un reparto s: el valor (o la persona) que se pide.
  function respuestaEn(p, pide, s) {
    if (pide.t === 'valor') return s[pide.atributo][p.personas.indexOf(pide.persona)];
    if (pide.t === 'quienTiene') return p.personas[s[pide.atributo].indexOf(pide.valor)];
    return s[pide.atr2][s[pide.atr1].indexOf(pide.val1)];
  }
  const respuestasPosibles = (p, pide) => [...new Set(repartos(p).map(s => respuestaEn(p, pide, s)))];
  const listaPedida = pide => (pide.t === 'valor' ? pide.atributo : pide.t === 'cruce' ? pide.atr2 : null);
  const textoRespuesta = (pide, x) => (listaPedida(pide) ? opV(listaPedida(pide), x) : x);
  // «Ana juega vóley» / «quien toca charango vive en Juliaca», dicho con el valor x como respuesta.
  function dicho(p, pide, x) {
    if (pide.t === 'valor') return enFrase(p, { tipo: 'es', persona: pide.persona, atributo: pide.atributo, valor: x });
    if (pide.t === 'quienTiene') return enFrase(p, { tipo: 'es', persona: x, atributo: pide.atributo, valor: pide.valor });
    return enFrase(p, { tipo: 'mismo', atr1: pide.atr1, val1: pide.val1, atr2: pide.atr2, val2: x });
  }
  function textoPregunta(p, pide) {
    const L = id => LISTAS[id];
    if (pide.t === 'valor') return `${L(pide.atributo).preg} ${pide.persona}?`;
    if (pide.t === 'quienTiene') return `¿Quién ${L(pide.atributo).frase.replace('{v}', pide.valor)}?`;
    return `${L(pide.atr2).preg} quien ${L(pide.atr1).frase.replace('{v}', pide.val1)}?`;
  }

  // Por qué se elegiría x (que no es la respuesta): la pista que lo descarta, si es una sola.
  function porQueNo(rng, p, d, cumpleX, textoX) {
    // Primero las pistas que cruzan (la trampa de la idea 2); entre las demás, cualquiera que lo descarte.
    const orden = rng.barajar([...d.pistas.keys()]).sort((i, j) => esCruce(d.pistas[j]) - esCruce(d.pistas[i]));
    for (const i of orden) {
      const sin = conPistas(p, d.pistas.filter((_, j) => j !== i));
      if (!repartos(sin).some(cumpleX)) continue;
      const q = d.pistas[i], tq = `«${textoPista(p, q)}»`;
      if (esCruce(q)) return { id: 'RMP63-sin-cruce', ex: `Bien: usaste las pistas que nombran a alguien. Pero la pista ${ROM[i]}, ${tq}, no nombra a nadie y también cuenta: con ella no queda ningún reparto donde ${textoX}.` };
      return { id: 'RMP72-pista-sin-revisar', ex: `Bien: con todas las pistas menos la ${ROM[i]} sí hay un reparto donde ${textoX}. Pero la pista ${ROM[i]}, ${tq}, también cuenta: con ella, ese reparto se tacha.` };
    }
    return { id: 'RMP63-dos-pistas', ex: `Bien: eso cumple la regla del cuadro. Pero para tener un reparto donde ${textoX} tendrías que saltarte dos pistas o más: con todas, ninguno queda.` };
  }

  function armarQuien(rng, p, d, ctx) {
    const [sol] = repartos(p);
    const pide = elegirPregunta(rng, p, d, sol);
    if (!pide) return null;
    const vs = respuestasPosibles(p, pide);
    if (vs.length !== 1) return null;
    const ok = vs[0];
    // La respuesta no sale con una sola pista: hace falta juntar por lo menos dos.
    if (d.pistas.some(q => total(conPistas(p, [q])) && respuestasPosibles(conPistas(p, [q]), pide).length === 1)) return null;
    const dominio = pide.t === 'quienTiene' ? p.personas : p.atributos[listaPedida(pide)];
    const correcta = { clave: `r:${ok}`, texto: textoRespuesta(pide, ok) };
    const errores = [];
    for (const x of rng.barajar(dominio.filter(y => y !== ok))) {
      const e = porQueNo(rng, p, d, s => respuestaEn(p, pide, s) === x, dicho(p, pide, x));
      errores.push(err(e.id, { clave: `r:${x}`, texto: textoRespuesta(pide, x) }, e.ex));
    }
    errores.push(err('RMP78-faltan-datos', { clave: 'nada', texto: 'Faltan datos para saberlo' },
      `Bien: no diste nada por seguro sin revisarlo. Pero las pistas sí alcanzan: dejan un solo reparto, y en él ${dicho(p, pide, ok)}.`));
    const alternativas = P.armarTexto({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const pregunta = [textoPregunta(p, pide)];
    d.pide = pide;
    const solucion = pasosSolucion(p, d);
    solucion.push([`Queda un solo reparto: ${reparto1(p, sol)}.`]);
    solucion.push(['Respuesta: ', v('x', mayus(dicho(p, pide, ok))), '.']);
    return cerrar(p, d, ctx, { pregunta, alternativas, correcta, solucion });
  }

  // Afirmaciones posibles para «¿cuál es segura?»: «X tiene…» y, con dos listas, «quien… …».
  function afirmaciones(p) {
    const ats = Object.keys(p.atributos), out = [];
    p.personas.forEach(persona => ats.forEach(a => p.atributos[a].forEach(x => out.push({ tipo: 'es', persona, atributo: a, valor: x }))));
    for (const a1 of ats) for (const a2 of ats) if (a1 < a2) for (const x of p.atributos[a1]) for (const y of p.atributos[a2]) out.push({ tipo: 'mismo', atr1: a1, val1: x, atr2: a2, val2: y });
    return out;
  }
  function armarSeguro(rng, p, d, ctx) {
    const rs = repartos(p), n = rs.length;
    const todas = afirmaciones(p).filter(a => !d.pistas.some(q => igualPista(q, a)));
    const siempre = todas.filter(a => estado(p, a) === 'siempre');
    if (!siempre.length) return null;
    // Que lo seguro necesite más de una pista.
    const pref = siempre.filter(a => !d.pistas.some(q => estado(conPistas(p, [q]), a) === 'siempre'));
    if (!pref.length) return null;
    const ok = rng.elegir(d.tipo === 'atributos' && rng.sig() < 0.4 && pref.some(esCruce) ? pref.filter(esCruce) : pref);
    const op = a => ({ clave: `a:${JSON.stringify(a)}`, texto: textoPista(p, a) }); // sin punto: la app agrega el suyo
    const correcta = op(ok);
    const errores = [];
    // Posibles pero no seguras (RMP77): la mitad de las veces, del mismo tipo que la correcta.
    const aveces = rng.barajar(todas.filter(a => estado(p, a) === 'aveces'));
    aveces.sort((a, b) => (b.tipo === ok.tipo) - (a.tipo === ok.tipo));
    for (const a of aveces.slice(0, 2)) {
      const no = rs.find(s => !M.cumple(p, a, s)), si = rs.filter(s => M.cumple(p, a, s)).length;
      errores.push(err('RMP77-posible', op(a), `Bien: ${si === 1 ? 'hay un reparto' : `hay ${si} repartos`} con todas las pistas donde ${enFrase(p, a)}. Pero no en todos los ${n}: en el reparto ${reparto1(p, no)}, no pasa. Seguro es lo que vale en todos.`));
    }
    // Imposibles que una sola pista descarta (RMP72 o RMP63).
    for (const a of rng.barajar(todas.filter(a => estado(p, a) === 'nunca'))) {
      if (errores.length >= 3) break;
      const e = porQueNo(rng, p, d, s => M.cumple(p, a, s), enFrase(p, a));
      if (e.id === 'RMP63-dos-pistas') continue;
      errores.push(err(e.id, op(a), e.ex));
    }
    errores.push(err('RMP78-faltan-datos', { clave: 'nada', texto: 'Ninguna: faltan pistas' },
      `Bien: es cierto que las pistas no alcanzan para saberlo todo. Pero en los ${n} repartos que quedan, ${enFrase(p, ok)}: eso ya es seguro.`));
    if (errores.length < 4) return null;
    const alternativas = P.armarTexto({ correcta, errores, rng });
    if (alternativas.length < 5) return null;
    d.pide = { t: 'seguro', opciones: alternativas.map(x => (x.valor === 'nada' ? { tipo: 'nada' } : JSON.parse(x.valor.slice(2)))) };
    const pregunta = ['¿Cuál de estas afirmaciones es segura?'];
    const solucion = pasosSolucion(p, d);
    solucion.push([`Quedan ${n} repartos: ${rs.map((s, i) => `(${i + 1}) ${reparto1(p, s)}`).join('; ')}.`]);
    solucion.push([`En ${n === 2 ? 'los dos' : `los ${n}`}, `, v('x', enFrase(p, ok)), '. Las otras afirmaciones fallan en por lo menos uno.']);
    return cerrar(p, d, ctx, { pregunta, alternativas, correcta, solucion });
  }

  // Pista por pista: qué se marca y qué se vuelve seguro (✓) con las pistas usadas hasta ahí (lo calcula el motor).
  function pasosSolucion(p, d) {
    const ats = Object.keys(p.atributos), pasos = M.pasos(p);
    const lineas = [];
    const una = ats.length === 1;
    lineas.push([una
      ? `Se arma un cuadro: una fila por persona y una columna por cada ${LISTAS[ats[0]].sing}. Sin pistas hay ${M.fact(p.personas.length)} repartos.`
      : `Se arma un cuadro por lista (${lista(ats.map(a => LISTAS[a].plural))}), con una fila por persona. Una pista con «quien…» une dos listas.`]);
    const clave = (a, i) => `${a}|${i}`;
    let antes = new Set();
    d.pistas.forEach((q, k) => {
      const ahora = pasos[k + 1].seguros, nuevos = [];
      for (const a of ats) ahora[a].forEach((x, i) => { if (x !== null && !antes.has(clave(a, i))) nuevos.push({ a, i, x }); });
      antes = new Set(ats.flatMap(a => ahora[a].map((x, i) => (x !== null ? clave(a, i) : null)).filter(Boolean)));
      const marca = q.tipo === 'noEs' ? ' Se tacha esa casilla (✗).' : q.tipo === 'es' ? ' Se marca ✓ y se tacha el resto de su fila y de su columna.'
        : q.tipo === 'mismo' ? ` Une ${opMin(q.atr1, q.val1)} con ${opMin(q.atr2, q.val2)}: si una persona tiene una, tiene la otra.`
          : deDel(` Separa ${opMin(q.atr1, q.val1)} de ${opMin(q.atr2, q.val2)}: nadie tiene las dos.`);
      const segs = [`Pista ${ROM[k]}: ${textoPista(p, q)}.${marca}`];
      const sinLaDicha = nuevos.filter(n => !(q.tipo === 'es' && n.a === q.atributo && p.personas[n.i] === q.persona));
      if (sinLaDicha.length) {
        segs.push(' Con lo que va, ya es seguro: ');
        sinLaDicha.forEach((n, j) => {
          if (j) segs.push(j === sinLaDicha.length - 1 ? ' y ' : ', ');
          segs.push(v('x', enFrase(p, { tipo: 'es', persona: p.personas[n.i], atributo: n.a, valor: n.x })));
        });
        segs.push('.');
      }
      lineas.push(segs);
    });
    return lineas;
  }

  // ---------- Figura de la solución: el cuadro final ----------
  // Filas: las personas. Un bloque de columnas por lista. ✓ violeta (seguro), ✗ gris (imposible), vacío (no se sabe).
  function figuraCuadro(p, sub) {
    const ats = Object.keys(p.atributos), k = p.personas.length, Lk = ats.length;
    const pos = M.posibles(p).casillas;
    const W = 320, izq = 56, gap = Lk > 1 ? 12 : 0;
    const c = Math.min(36, Math.floor((W - 4 - izq - gap * (Lk - 1)) / (k * Lk)));
    const largo = Math.max(...ats.flatMap(a => p.atributos[a].map(x => opMin(a, x).length)));
    const cab = 18 + Math.ceil(largo * 6.6) + 8, H = cab + k * c + 6;
    let s = '';
    const x0 = j => izq + j * (k * c + gap);
    ats.forEach((a, j) => {
      s += `<text x="${x0(j) + (k * c) / 2}" y="13" text-anchor="middle" style="font-size:12px;font-weight:bold;fill:currentColor">${P.xml(LISTAS[a].plural)}</text>`;
      p.atributos[a].forEach((x, m) => {
        const cx = x0(j) + m * c + c / 2 + 4, cy = cab - 4;
        s += `<text transform="translate(${cx} ${cy}) rotate(-90)" style="font-size:12px;fill:currentColor">${P.xml(opMin(a, x))}</text>`;
      });
    });
    p.personas.forEach((persona, i) => {
      const y = cab + i * c;
      s += `<text x="${izq - 6}" y="${y + c / 2 + 4}" text-anchor="end" style="font-size:12px;fill:currentColor">${P.xml(persona)}</text>`;
      ats.forEach((a, j) => p.atributos[a].forEach((x, m) => {
        const X = x0(j) + m * c, vs = pos[a][i];
        s += `<rect x="${X}" y="${y}" width="${c}" height="${c}" style="fill:none;stroke:currentColor;stroke-opacity:.35"/>`;
        if (vs.length === 1 && vs[0] === x) s += `<text x="${X + c / 2}" y="${y + c / 2 + 6}" text-anchor="middle" style="font-size:18px;font-weight:bold;fill:var(--c-f)">✓</text>`;
        else if (!vs.includes(x)) s += `<text x="${X + c / 2}" y="${y + c / 2 + 5}" text-anchor="middle" style="font-size:15px;fill:currentColor;opacity:.55">✗</text>`;
      }));
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">${s}</svg>`;
    const seguros = [], dudas = [];
    p.personas.forEach((persona, i) => ats.forEach(a => {
      const vs = pos[a][i];
      if (vs.length === 1) seguros.push(`${persona}, ${opMin(a, vs[0])}`);
      else dudas.push(`${persona}, ${lista(vs.map(x => opMin(a, x)), 'o')}`);
    }));
    const alt = `Cuadro ${sub === 'quien' ? 'final' : 'con lo que dejan las pistas'}: una fila por persona y una columna por cada valor. Con ✓ (seguro): ${seguros.length ? seguros.join('; ') : 'ninguna casilla'}.`
      + (dudas.length ? ` Sin decidir: ${dudas.join('; ')}. Lo demás, tachado con ✗.` : ' Lo demás, tachado con ✗.');
    return { svg, alt };
  }

  function cerrar(p, d, ctx, o) {
    const ats = Object.keys(p.atributos);
    const nombres = lista(p.personas);
    const listasTexto = ats.map(a => `${LISTAS[a].plural}: ${lista(p.atributos[a].map(x => itemEn(a, x)), 'y')}`);
    const enunciado = [`${nombres} ${ctx.intro}. ${mayus(listasTexto.join('; '))}. Se sabe que:`];
    d.pistas.forEach((q, i) => enunciado.push(` ${ROM[i]}. ${textoPista(p, q)}.`));
    const datos = [ats.length === 1 ? LISTAS[ats[0]].regla : R_LISTAS, D_REPARTO];
    if (ats.length > 1) datos.push(D_QUIEN);
    if (d.sub === 'seguro') datos.push(D_SEGURO);
    return {
      variables: { x: { nombre: 'lo seguro (lo que se pide, ya comprobado)', color: 'f' } },
      enunciado, pregunta: o.pregunta, datos, alternativas: o.alternativas, solucion: o.solucion,
      respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' },
      figuraSolucion: figuraCuadro(p, d.sub), _datos: d,
    };
  }

  // ---------- generar ----------
  const SORTEO = [['cuadro', 'quien'], ['cuadro', 'quien'], ['cuadro', 'seguro'], ['atributos', 'quien'], ['atributos', 'quien'], ['atributos', 'seguro']];
  // Las pruebas de entrada y salida: formas paralelas, el mismo tipo en el mismo lugar.
  const PRUEBA = [['cuadro', 'quien'], ['atributos', 'quien'], ['cuadro', 'seguro']];
  // Lápiz y papel (herramientas/papel-generador.js toma papel-1, papel-2…; los tres primeros son «básico», los tres
  // siguientes «intermedio» y los dos últimos «avanzado»): el nivel de cada uno, para que el rótulo diga la verdad.
  const PAPEL = [['cuadro', 'quien', 1], ['cuadro', 'seguro', 1], ['cuadro', 'quien', 1], ['cuadro', 'quien', 2], ['atributos', 'quien', 2],
    ['atributos', 'seguro', 2], ['atributos', 'quien', 3], ['atributos', 'seguro', 3]];
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const prueba = /^(entrada|salida)-(\d+)$/.exec(String(semilla)), papel = /^papel-(\d+)$/.exec(String(semilla));
    const [tipo, sub, nivel] = prueba ? PRUEBA[(+prueba[2] - 1) % PRUEBA.length] : papel ? PAPEL[(+papel[1] - 1) % PAPEL.length] : rng.elegir(SORTEO);
    for (let intento = 0; intento < 400; intento++) {
      const pr = construir(rng, tipo, sub, nivel);
      if (pr) return Object.assign({ id: `${ID}#${semilla}` }, pr);
    }
    throw new Error(`${ID}: no se pudo generar un problema (${tipo}/${sub})`);
  }

  const calc = {
    repartos: p => repartos(p),
    estado,
    textoPista,
  };
  return { id: ID, titulo: 'El cuadro que descarta', generar, calc, tiposPorUnidad: { 'razonamiento-matematico.razonamiento-deductivo': ['cuadro', 'atributos'] } };
});
