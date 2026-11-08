/*
 * Generador: parentesco y deducción con pistas (razonamiento deductivo y ordenamiento de información).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-parentesco']) y en Node (require). No usa ningún motor.
 *
 * Tipos y sus _datos:
 *   cadena    { tipo, ego: 'v'|'m', pasos: ['madre', 'padre', 'hermano', …], unicos: [bool, …], nombre }
 *             una cadena de parentescos dicha por una persona («el hijo del único hermano del padre de mi
 *             madre»). pasos[0] es el eslabón más cercano a quien habla («mi madre»). Se resuelve sobre un
 *             árbol simbólico: línea directa (padre, abuela paterna…), colaterales (hermanos, tíos, primos,
 *             sobrinos, tíos abuelos) y descendientes. El «único» decide cuando en el conjunto entra una
 *             persona de la línea directa (el único hijo de mi abuelo paterno es mi padre); sin «único», la
 *             respuesta queda en dos («su padre o su tío paterno»). Respuesta: clave de parentesco.
 *   arbol     { tipo, arbol: { personas: [{ id, nombre, sexo, padre, madre, conyuge, gen }] }, habla, pasos, dicho }
 *             un árbol de tres generaciones dibujado; quien habla dice una cadena y se pregunta quién es.
 *             Respuesta: el id de la persona.
 *   minimo    { tipo, pedido: { padre: 2, hija: 1, … } } en una reunión hay exactamente esos parentescos
 *             (cada persona cuenta en todos los que tenga). El mínimo de personas se halla recorriendo todas
 *             las familias de hasta 7 personas (cada persona con su padre y su madre, si están presentes).
 *   orden     { tipo, nombres: [4], tema: 'edad'|'dinero', pistas: [{ t: 'suma', a: [i, j], b: [k, l], rel }
 *             | { t: 'simple', a: i, b: j }] } cuatro personas con valores distintos; las pistas comparan
 *             sumas de a dos. Respuesta: el orden de mayor a menor (clave 'orden:i,j,k,l').
 *   billetes  { tipo, montos: [6], nombres: [3], pistas: [...], pide: { t: 'monto', p } | { t: 'dif', p, q } }
 *             seis sobres con montos distintos, dos para cada persona. Respuesta: el monto pedido, que es el
 *             mismo en todos los repartos que cumplen las pistas.
 *   edades    { tipo, nombres: [3], conds: [...], pide: [i, j] } tres hermanos con edades distintas, con
 *             condiciones de paridad, primalidad, orden y suma. Respuesta: la menor suma posible de dos.
 *
 * calc (funciones puras, para el papel y las pruebas):
 *   cadena(ego, pasos, unicos)        → { final, nodos, clave, texto } (final: posición o { amb: [a, b] })
 *   nombre(pos, ego)                  → { clave, texto } o null
 *   minimoPersonas(pedido)            → { n, ejemplo, alMenos } (alMenos: el mínimo si los conteos fueran «al menos»)
 *   roles(personas)                   → conteo de cada parentesco en una familia [{ s: 0|1, f, m }]
 *   ordenes(pistas)                   → órdenes (de mayor a menor) que cumplen las pistas
 *   repartos(montos, pistas)          → repartos [[a, b], [c, d], [e, f]] que cumplen las pistas
 *   edades(conds, opciones)           → ternas de edades que cumplen las condiciones
 *
 * Errores (todos hipótesis salvo donde se dice; ver el informe de respuesta de este módulo):
 *   RMP60-desde-el-inicio   leer la cadena desde el primer eslabón y no desde «mi …»
 *   RMP61-eslabon           responder un eslabón intermedio de la cadena (AR5 por analogía: dar un dato del
 *                           camino en vez del pedido)
 *   RMP62-suma / -por-sexo  contar cada parentesco como una persona distinta; o juntar todos los del mismo
 *                           sexo en una sola persona sin armar la familia
 *   RMP63-*                 no aplicar una condición: el «único», una pista, un tope; o leerla mal (el 1 primo)
 *   RMP64-linea             cambiar la línea paterna por la materna (o la madre por el padre en el árbol)
 *   RMP2-primera            quedarse con la primera familia o el primer reparto que cumple, sin minimizar
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const ht = (id, r, explicacion) => r && ({ id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];
  const VARONES = ['Luis', 'Juan', 'Raúl', 'Hugo', 'Iván', 'Saúl', 'Ciro', 'Teo', 'Noé', 'Leo', 'Abel', 'Omar', 'Rubén', 'Elías', 'Nico', 'Yoni'];
  const MUJERES = ['Ana', 'Rosa', 'Elsa', 'Inés', 'Mery', 'Lía', 'Gina', 'Olga', 'Eva', 'Sara', 'Nora', 'Rut', 'Alba', 'Flor', 'Kati', 'Zoe'];

  // =====================================================================
  // 1. Cadena de parentescos sobre un árbol simbólico
  // =====================================================================
  // Posiciones respecto de quien habla (ego):
  //   { k: 'D', s }      línea directa: s = '' ego, 'P' padre, 'M' madre, 'PM' la madre del padre, …
  //   { k: 'C', d, b, x } colateral: descendiente b generaciones bajo un hermano (x: sexo) de la persona
  //                      directa d (b = 0: hermano de d). C('', 0) hermano; C('P', 0) tío paterno; C('P', 1) primo.
  //   { k: 'H', b, x }   descendiente de ego (b = 1 hijo, 2 nieto)
  const PASOS = {
    padre: { s: 'v', art: 'el', w: 'padre' }, madre: { s: 'm', art: 'la', w: 'madre' },
    hijo: { s: 'v', art: 'el', w: 'hijo' }, hija: { s: 'm', art: 'la', w: 'hija' },
    hermano: { s: 'v', art: 'el', w: 'hermano' }, hermana: { s: 'm', art: 'la', w: 'hermana' },
  };
  const sexoD = (s, ego) => s === '' ? ego : (s[s.length - 1] === 'P' ? 'v' : 'm');
  const D = s => ({ k: 'D', s }), C = (d, b, x) => ({ k: 'C', d, b, x }), H = (b, x) => ({ k: 'H', b, x });

  // Un paso aplicado a una posición: { def, gen } (def: la persona de la línea directa que entra en el
  // conjunto; gen: la clase de colaterales o descendientes). null si el paso no se modela (parientes políticos).
  function paso(pos, nombrePaso, ego) {
    const S = PASOS[nombrePaso].s;
    if (nombrePaso === 'padre' || nombrePaso === 'madre') {
      const L = S === 'v' ? 'P' : 'M';
      if (pos.k === 'D') return { def: D(pos.s + L), gen: null };
      if (pos.k === 'C' && pos.b === 0) return { def: D(pos.d + L), gen: null };
      if (pos.k === 'H' && pos.b === 1 && S === ego) return { def: D(''), gen: null };
      return null;
    }
    if (nombrePaso === 'hijo' || nombrePaso === 'hija') {
      if (pos.k === 'D' && pos.s === '') return { def: null, gen: H(1, S) };
      if (pos.k === 'D') {
        const linea = pos.s.slice(0, -1);
        return { def: sexoD(linea, ego) === S ? D(linea) : null, gen: C(linea, 0, S) };
      }
      if (pos.k === 'C') return { def: null, gen: C(pos.d, pos.b + 1, S) };
      return { def: null, gen: H(pos.b + 1, S) };
    }
    // hermano / hermana
    if (pos.k === 'D') return { def: null, gen: C(pos.s, 0, S) };
    if (pos.k === 'C' && pos.b === 0) return { def: sexoD(pos.d, ego) === S ? D(pos.d) : null, gen: C(pos.d, 0, S) };
    if (pos.k === 'C') return { def: null, gen: C(pos.d, pos.b, S) };
    return { def: null, gen: H(pos.b, S) };
  }

  // Nombre del parentesco en tercera persona («su tío paterno»). null si no tiene un nombre corriente.
  function nombre(pos, ego) {
    if (!pos) return null;
    if (pos.amb) {
      const a = nombre(pos.amb[0], ego), b = nombre(pos.amb[1], ego);
      return a && b ? { clave: 'amb:' + a.clave + '|' + b.clave, texto: a.texto + ' o ' + b.texto } : null;
    }
    const lado = c => c === 'P' ? 'paterno' : 'materno';
    const g = (x, mas, fem) => x === 'v' ? mas : fem;
    if (pos.k === 'D') {
      const s = pos.s, x = sexoD(s, ego);
      const t = s.length === 0 ? g(ego, 'él mismo', 'ella misma')
        : s.length === 1 ? g(x, 'su padre', 'su madre')
        : s.length === 2 ? g(x, 'su abuelo ', 'su abuela ') + (x === 'v' ? lado(s[0]) : lado(s[0]).replace(/o$/, 'a'))
        : s.length === 3 ? g(x, 'su bisabuelo', 'su bisabuela') : null;
      return t && { clave: 'D:' + (s.length === 2 ? s[0] + s.length + x : s.length + x), texto: t };
    }
    if (pos.k === 'H') {
      const t = [null, g(pos.x, 'su hijo', 'su hija'), g(pos.x, 'su nieto', 'su nieta'), g(pos.x, 'su bisnieto', 'su bisnieta')][pos.b];
      return t ? { clave: 'H:' + pos.b + pos.x, texto: t } : null;
    }
    const arriba = pos.d.length + 1, abajo = pos.b + 1, x = pos.x;
    let t = null, clave = 'C:' + arriba + ',' + abajo + x;
    if (arriba === 1 && abajo === 1) t = g(x, 'su hermano', 'su hermana');
    else if (arriba === 1 && abajo === 2) t = g(x, 'su sobrino', 'su sobrina');
    else if (arriba === 1 && abajo === 3) t = g(x, 'su sobrino nieto', 'su sobrina nieta');
    else if (arriba === 2 && abajo === 1) { t = g(x, 'su tío ' + lado(pos.d[0]), 'su tía ' + lado(pos.d[0]).replace(/o$/, 'a')); clave += pos.d[0]; }
    else if (arriba === 2 && abajo === 2) t = g(x, 'su primo', 'su prima');
    else if (arriba === 3 && abajo === 1) t = g(x, 'su tío abuelo', 'su tía abuela');
    return t ? { clave, texto: t } : null;
  }

  // Recorre la cadena. opciones.ignora: índice del paso donde se toma la clase general en vez de la
  // persona de la línea directa (el error de no usar el «único»); opciones.forzarUnico: en cada paso con dos
  // posibilidades se toma la directa (para las lecturas erradas, que no saben de «único»).
  function cadena(ego, pasos, unicos, opciones = {}) {
    let pos = D('');
    const nodos = [];
    // Clases de colaterales o descendientes ya nombradas en singular: si vuelven a salir, la frase se
    // contradice («la única hija del padre de mi hermana»: la hermana ya es otra hija).
    // Y las clases que un «único» dejó vacías («el único hijo del padre de mi padre»: el padre no tiene hermanos).
    const vistas = new Set(), vacias = new Set();
    const k = q => (q.k === 'D' ? null : JSON.stringify(q));
    for (let i = 0; i < pasos.length; i++) {
      const r0 = paso(pos, pasos[i], ego);
      if (!r0) return null;
      const r = { ...r0 };
      if (r.gen && vacias.has(k(r.gen))) { if (!r.def) return null; r.gen = null; }
      let sig;
      if (r.gen && r.def && vistas.has(k(r.gen)) && (unicos[i] || opciones.forzarUnico) && opciones.ignora !== i) return null;
      if (r.def && r.gen) {
        if (opciones.ignora === i) sig = r.gen;
        else if (unicos[i] || opciones.forzarUnico) { sig = r.def; vacias.add(k(r.gen)); }
        else if (i === pasos.length - 1) sig = { amb: [r.def, r.gen] };
        else return null;
      } else sig = r.def || r.gen;
      if (!sig.amb && k(sig)) { if (vistas.has(k(sig))) return null; vistas.add(k(sig)); }
      nodos.push({ pos: sig, dos: !!(r.def && r.gen), def: r.def, gen: r.gen });
      pos = sig;
    }
    const nm = nombre(pos, ego);
    return nm ? { final: pos, nodos, clave: nm.clave, texto: nm.texto } : null;
  }

  // La frase en segmentos (con «mi …» y los «único» amarrados a su color).
  function frase(pasos, unicos, desde = pasos.length - 1, mayuscula = true) {
    const seg = [];
    for (let i = desde; i >= 1; i--) {
      const p = PASOS[pasos[i]];
      if (i === desde) seg.push((mayuscula ? cap(p.art) : p.art) + ' ');
      if (unicos[i]) { seg.push(v('u', p.s === 'v' ? 'único' : 'única')); seg.push(' '); }
      seg.push(p.w);
      const sig = i - 1 >= 1 ? PASOS[pasos[i - 1]] : null;
      seg.push(sig ? (sig.art === 'el' ? ' del ' : ' de la ') : ' de ');
    }
    seg.push(v('a', (desde === 0 && mayuscula ? 'Mi ' : 'mi ') + PASOS[pasos[0]].w));
    return seg;
  }
  const plano = seg => seg.map(s => (typeof s === 'string' ? s : s.t)).join('');
  // Los eslabones que faltan después del k-ésimo: «la madre del padre».
  function afuera(pasos, unicos, k) {
    let t = '';
    for (let i = pasos.length - 1; i > k; i--) {
      const p = PASOS[pasos[i]];
      if (i === pasos.length - 1) t += p.art + ' ';
      t += (unicos[i] ? (p.s === 'v' ? 'único ' : 'única ') : '') + p.w;
      if (i - 1 > k) t += PASOS[pasos[i - 1]].art === 'el' ? ' del ' : ' de la ';
    }
    return t;
  }

  const DICHOS = [['vive en Juliaca', 'vive en Juliaca'], ['me regaló una chompa', 'le regaló una chompa'], ['vende quinua en la feria', 'vende quinua en la feria'],
    ['juega vóley conmigo', 'juega vóley con'], ['me enseñó a tocar charango', 'le enseñó a tocar charango'], ['me ayuda con las tareas', 'ayuda con las tareas'],
    ['trabaja en el mercado de Puno', 'trabaja en el mercado de Puno'], ['cumple años hoy', 'cumple años hoy']];

  function construirCadena(rng, semilla) {
    const ego = rng.moneda() ? 'v' : 'm';
    const nombreEgo = rng.elegir(ego === 'v' ? VARONES : MUJERES);
    for (let intento = 0; intento < 400; intento++) {
      const n = rng.elegir([3, 3, 4, 4, 4, 5]);
      const pasos = [rng.elegir(['padre', 'madre', 'padre', 'madre', 'hermano', 'hermana'])];
      for (let i = 1; i < n; i++) pasos.push(rng.elegir(Object.keys(PASOS)));
      // Primero se arma sin «único» para ver dónde hace falta.
      const unicos = pasos.map(() => false);
      let pos = D(''), ok = true;
      for (let i = 0; i < n && ok; i++) {
        const r = paso(pos, pasos[i], ego);
        if (!r) { ok = false; break; }
        if (r.def && r.gen) { unicos[i] = i < n - 1 || rng.sig() < 0.75; pos = unicos[i] ? r.def : r.gen; }
        else { if (i > 0 && rng.sig() < 0.25 && pasos[i].startsWith('h') && pasos[i] !== 'hija' && pasos[i] !== 'hijo') unicos[i] = true; pos = r.def || r.gen; }
        if (i < n - 1 && !nombre(pos, ego)) ok = false;
      }
      if (!ok) continue;
      const res = cadena(ego, pasos, unicos);
      if (!res) continue;
      const decide = res.nodos.some(x => x.dos);
      if (!decide && rng.sig() < 0.8) continue; // casi siempre con un «único» que decide o una respuesta doble
      const p = armarCadena({ tipo: 'cadena', ego, pasos, unicos, nombre: nombreEgo, dicho: rng.elegir(DICHOS)[0] }, res, rng, semilla);
      if (p) return p;
    }
    return null;
  }

  function armarCadena(d, res, rng, semilla) {
    const { ego, pasos, unicos } = d;
    const n = pasos.length;
    const correcta = { clave: res.clave, texto: cap(res.texto) };
    const errores = [];
    const fr = frase(pasos, unicos);
    const anc = 'mi ' + PASOS[pasos[0]].w;
    // RMP60: leer desde el principio (la cadena al revés).
    const rev = cadena(ego, pasos.slice().reverse(), pasos.map(() => true), { forzarUnico: true });
    if (rev) errores.push(ht('RMP60-desde-el-inicio', { clave: rev.clave, texto: cap(rev.texto) },
      `Leíste la cadena desde el principio, como si «${PASOS[pasos[n - 1]].art} ${PASOS[pasos[n - 1]].w}» fuera de ${d.nombre}. Se lee desde el final: se parte de «${anc}» y se sube un eslabón cada vez.`));
    // RMP64: cambiar la línea (padre por madre en el primer eslabón).
    if (pasos[0] === 'padre' || pasos[0] === 'madre') {
      const otro = pasos.slice(); otro[0] = pasos[0] === 'padre' ? 'madre' : 'padre';
      const r = cadena(ego, otro, unicos);
      if (r) errores.push(ht('RMP64-linea', { clave: r.clave, texto: cap(r.texto) },
        `Seguiste la línea ${otro[0] === 'padre' ? 'paterna' : 'materna'}. La cadena parte de «${anc}»: todo queda del lado ${pasos[0] === 'padre' ? 'paterno' : 'materno'}.`));
    }
    // RMP63: no usar el «único» (o darlo por dicho cuando no está).
    if (res.final.amb) {
      const [a, b] = res.final.amb;
      const na = nombre(a, ego), nb = nombre(b, ego);
      errores.push(ht('RMP63-unico-supuesto', { clave: na.clave, texto: cap(na.texto) }, `Diste por hecho que es ${na.texto}, pero el enunciado no dice «único»: también puede ser ${nb.texto}.`));
      errores.push(ht('RMP63-unico-supuesto', { clave: nb.clave, texto: cap(nb.texto) }, `Pensaste solo en ${nb.texto}, pero ${na.texto} también cumple la cadena, y el enunciado no dice «único». Pueden ser los dos.`));
    }
    for (let i = n - 1; i >= 1; i--) {
      if (!res.nodos[i].dos || !unicos[i]) continue;
      const r = cadena(ego, pasos, unicos, { ignora: i });
      const nd = nombre(res.nodos[i].def, ego), prev = nombre(res.nodos[i - 1].pos, ego);
      if (r && nd && prev) errores.push(ht('RMP63-sin-unico', { clave: r.clave, texto: cap(r.texto) },
        `No usaste el «único». ${cap(nd.texto)} también es ${PASOS[pasos[i]].w} de ${prev.texto.replace(/^su /, 'su ')}; si es ${PASOS[pasos[i]].s === 'v' ? 'el único' : 'la única'}, tiene que ser ${nd.texto}.`));
    }
    // RMP61: quedarse en un eslabón intermedio.
    for (const k of [n - 2, n - 3]) {
      if (k < 0) continue;
      const nm = nombre(res.nodos[k].pos, ego);
      if (!nm) continue;
      const faltan = afuera(pasos, unicos, k);
      errores.push(ht('RMP61-eslabon', { clave: nm.clave, texto: cap(nm.texto) },
        `Te quedaste en «${plano(frase(pasos, unicos, k, false))}», que es ${nm.texto}: es un eslabón del camino. Falta aplicar «${faltan}».`));
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    if (alternativas.length < 4) return null;
    // Solución: de «mi …» hacia afuera.
    const solucion = [['Se lee desde el final, desde lo más cercano a ', d.nombre, ': ', v('a', anc), '.']];
    for (let i = 0; i < n; i++) {
      const nd = res.nodos[i];
      const tramo = plano(frase(pasos, unicos, i, true));
      const nm = nombre(nd.pos, ego);
      if (i === 0) { solucion.push([`«${tramo}» es `, nm.texto, '.']); continue; }
      const prev = nombre(res.nodos[i - 1].pos, ego).texto.replace(/^él mismo$/, 'él').replace(/^ella misma$/, 'ella');
      if (nd.dos && unicos[i]) {
        const ng = nombre(nd.gen, ego);
        solucion.push([`«${tramo}»: ${PASOS[pasos[i]].art === 'el' ? 'los' : 'las'} ${PASOS[pasos[i]].w}s de ${prev} son ${nombre(nd.def, ego).texto}${ng ? ' y, si hubiera, ' + ng.texto.replace(/^su /, 'otro ').replace(/^otro (tía|hermana|prima|hija|sobrina|nieta|abuela)/, 'otra $1') : ''}. Como dice `, v('u', PASOS[pasos[i]].s === 'v' ? 'único' : 'única'), ', es ', i === n - 1 ? v('x', nm.texto) : nm.texto, '.']);
      } else if (nd.pos.amb) {
        solucion.push([`«${tramo}» puede ser ${nombre(nd.def, ego).texto} o ${nombre(nd.gen, ego).texto}: no dice «único», así que la respuesta es `, v('x', nm.texto), '.']);
      } else solucion.push([`«${tramo}»: ${PASOS[pasos[i]].art} ${PASOS[pasos[i]].w} de ${prev} es `, i === n - 1 ? v('x', nm.texto) : nm.texto, '.']);
    }
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { a: { nombre: 'eslabón de partida', color: 'o' }, u: { nombre: 'único', color: 'i' }, x: { nombre: 'parentesco buscado', color: 'h' } },
      enunciado: [`${d.nombre} dice: «`, ...fr, ` ${d.dicho}».`],
      pregunta: [`¿Qué parentesco tiene esa persona con ${d.nombre}?`],
      datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto },
      _datos: d,
    };
  }

  // =====================================================================
  // 2. ¿Quién es? Cadena sobre un árbol dibujado
  // =====================================================================
  function crearArbol(rng) {
    const usadosV = rng.barajar(VARONES), usadosM = rng.barajar(MUJERES);
    let iv = 0, im = 0, id = 0;
    const nuevo = (sexo, gen, extra = {}) => ({ id: id++, nombre: sexo === 'v' ? usadosV[iv++] : usadosM[im++], sexo, padre: null, madre: null, conyuge: null, gen, ...extra });
    const personas = [];
    const ab = nuevo('v', 1), aa = nuevo('m', 1); ab.conyuge = aa.id; aa.conyuge = ab.id; personas.push(ab, aa);
    const sexos = rng.barajar(['v', 'm', rng.moneda() ? 'v' : 'm']);
    let hijosTot = 0;
    sexos.forEach((s, j) => {
      const hijo = nuevo(s, 2, { padre: ab.id, madre: aa.id, col: 2 * j });
      const esp = nuevo(s === 'v' ? 'm' : 'v', 2, { col: 2 * j + 1 });
      hijo.conyuge = esp.id; esp.conyuge = hijo.id; personas.push(hijo, esp);
      const k = rng.elegir([1, 2, 2]);
      for (let t = 0; t < k; t++) {
        const nieto = nuevo(rng.moneda() ? 'v' : 'm', 3, { padre: s === 'v' ? hijo.id : esp.id, madre: s === 'v' ? esp.id : hijo.id, col: k === 1 ? 2 * j + 0.5 : 2 * j + t });
        personas.push(nieto); hijosTot++;
      }
    });
    return { personas };
  }
  const PASOS_ARBOL = ['padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'esposo', 'esposa'];
  function pasoArbol(arbol, id, p) {
    const ps = arbol.personas, yo = ps[id];
    const sx = { padre: 'v', madre: 'm', hijo: 'v', hija: 'm', hermano: 'v', hermana: 'm', esposo: 'v', esposa: 'm' }[p];
    let r = [];
    if (p === 'padre') r = yo.padre === null ? [] : [yo.padre];
    else if (p === 'madre') r = yo.madre === null ? [] : [yo.madre];
    else if (p === 'hijo' || p === 'hija') r = ps.filter(q => q.padre === id || q.madre === id).map(q => q.id);
    else if (p === 'hermano' || p === 'hermana') r = ps.filter(q => q.id !== id && q.padre !== null && q.padre === yo.padre && q.madre === yo.madre).map(q => q.id);
    else r = yo.conyuge === null ? [] : [yo.conyuge];
    return r.filter(q => ps[q].sexo === sx);
  }
  // Recorre la cadena en el árbol: lista de ids tras cada paso, o null si algún paso no da una sola persona.
  function recorrerArbol(arbol, habla, pasos) {
    let id = habla; const ids = [];
    for (const p of pasos) { const r = pasoArbol(arbol, id, p); if (r.length !== 1) return null; id = r[0]; ids.push(id); }
    return ids;
  }
  const ART = { padre: 'el', madre: 'la', hijo: 'el', hija: 'la', hermano: 'el', hermana: 'la', esposo: 'el', esposa: 'la' };
  function fraseArbol(pasos, desde = pasos.length - 1, mayus = true) {
    let t = '';
    for (let i = desde; i >= 1; i--) {
      if (i === desde) t += (mayus ? cap(ART[pasos[i]]) : ART[pasos[i]]) + ' ';
      t += pasos[i] + (i - 1 >= 1 ? (ART[pasos[i - 1]] === 'el' ? ' del ' : ' de la ') : ' de ');
    }
    return t + (desde === 0 && mayus ? 'Mi ' : 'mi ') + pasos[0];
  }

  function figuraArbol(arbol, marcado = null) {
    const ps = arbol.personas, X = col => 36 + 60 * col, Y = { 1: 28, 2: 108, 3: 188 };
    const pos = q => (q.gen === 1 ? { x: q.sexo === 'v' ? X(2) : X(3), y: Y[1] } : { x: X(q.col), y: Y[q.gen] });
    let s = `<svg viewBox="0 0 372 244" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" text-anchor="middle">`;
    const linea = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1.5"/>`;
    // matrimonios
    for (const q of ps) if (q.conyuge !== null && q.id < q.conyuge) { const a = pos(q), b = pos(ps[q.conyuge]); s += linea(Math.min(a.x, b.x) + 26, a.y, Math.max(a.x, b.x) - 26, b.y); }
    // hijos de cada pareja
    const parejas = new Map();
    for (const q of ps) if (q.padre !== null) { const k = q.padre + ',' + q.madre; if (!parejas.has(k)) parejas.set(k, []); parejas.get(k).push(q); }
    for (const [k, hijos] of parejas) {
      const [pa, ma] = k.split(',').map(Number), a = pos(ps[pa]), b = pos(ps[ma]);
      const mx = (a.x + b.x) / 2, yb = a.y + 40;
      s += linea(mx, a.y, mx, yb);
      const xs = hijos.map(q => pos(q).x);
      s += linea(Math.min(mx, ...xs), yb, Math.max(mx, ...xs), yb);
      for (const q of hijos) s += linea(pos(q).x, yb, pos(q).x, pos(q).y - 14);
    }
    for (const q of ps) {
      const { x, y } = pos(q), marca = marcado === q.id;
      s += `<rect x="${x - 26}" y="${y - 14}" width="52" height="28" rx="${q.sexo === 'm' ? 13 : 2}" style="fill:var(--card)${marca ? ';stroke:var(--c-o)' : ''}" stroke="currentColor" stroke-width="${marca ? 3 : 1.5}"/>`;
      s += `<text x="${x}" y="${y + 5}" fill="currentColor">${P.xml(q.nombre)}</text>`;
    }
    s += `<text x="186" y="238" font-size="13" style="fill:var(--muted)">Recuadro: varón · Óvalo: mujer</text></svg>`;
    return s;
  }
  function altArbol(arbol) {
    const ps = arbol.personas, n = id => ps[id].nombre, sx = q => q.sexo === 'v' ? 'varón' : 'mujer';
    const t = [`Árbol familiar de tres generaciones. Abuelos: ${ps[0].nombre} (varón) y ${ps[1].nombre} (mujer), esposos.`];
    const hijos = ps.filter(q => q.gen === 2 && q.padre !== null);
    t.push(`Sus hijos: ${hijos.map(q => `${q.nombre} (${sx(q)}), ${q.sexo === 'v' ? 'casado' : 'casada'} con ${n(q.conyuge)}`).join('; ')}.`);
    for (const q of hijos) {
      const nietos = ps.filter(r => r.padre === q.id || r.madre === q.id);
      const pa = q.sexo === 'v' ? q : ps[q.conyuge], ma = q.sexo === 'v' ? ps[q.conyuge] : q;
      t.push(`${nietos.length === 1 ? (nietos[0].sexo === 'v' ? 'Hijo' : 'Hija') : 'Hijos'} de ${pa.nombre} y ${ma.nombre}: ${lista(nietos.map(r => `${r.nombre} (${sx(r)})`))}.`);
    }
    return t.join(' ');
  }

  const DICHOS_ARBOL = [['me regaló una chompa', 'le regaló una chompa a'], ['me enseñó a tocar charango', 'le enseñó a tocar charango a'],
    ['me ayuda con las tareas', 'ayuda con las tareas a'], ['me llevó a la feria', 'llevó a la feria a'], ['me prestó su bicicleta', 'le prestó su bicicleta a']];

  function construirArbol(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const arbol = crearArbol(rng);
      const nietos = arbol.personas.filter(q => q.gen === 3);
      const habla = rng.elegir(nietos).id;
      const n = rng.elegir([3, 3, 4]);
      const pasos = [rng.elegir(['padre', 'madre'])];
      for (let i = 1; i < n; i++) pasos.push(rng.elegir(PASOS_ARBOL));
      const ids = recorrerArbol(arbol, habla, pasos);
      if (!ids) continue;
      if (new Set([habla, ...ids]).size !== n + 1) continue; // sin volver a pasar por la misma persona
      // «La esposa de mi padre» es la madre: esos rodeos no se piden.
      if (pasos.some((q, i) => i > 0 && ((pasos[i - 1] === 'padre' && q === 'esposa') || (pasos[i - 1] === 'madre' && q === 'esposo')))) continue;
      const d = { tipo: 'arbol', arbol, habla, pasos, dicho: rng.elegir(DICHOS_ARBOL) };
      const p = armarArbol(d, ids, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarArbol(d, ids, rng, semilla) {
    const { arbol, habla, pasos } = d, ps = arbol.personas, n = pasos.length;
    const per = id => ({ clave: 'p' + id, texto: ps[id].nombre });
    const final = ids[n - 1];
    const errores = [];
    const quien = ps[habla].nombre;
    const rev = recorrerArbol(arbol, habla, pasos.slice().reverse());
    if (rev) errores.push(ht('RMP60-desde-el-inicio', per(rev[n - 1]), `Leíste la cadena desde el principio, empezando por «${ART[pasos[n - 1]]} ${pasos[n - 1]}» de ${quien}. Se lee desde el final: primero «mi ${pasos[0]}» y luego hacia afuera.`));
    for (let k = 0; k < n; k++) {
      if (pasos[k] !== 'padre' && pasos[k] !== 'madre') continue;
      const otro = pasos.slice(); otro[k] = pasos[k] === 'padre' ? 'madre' : 'padre';
      const r = recorrerArbol(arbol, habla, otro);
      if (r) errores.push(ht('RMP64-linea', per(r[n - 1]), `Tomaste ${otro[k] === 'padre' ? 'al padre' : 'a la madre'} donde la cadena dice «${pasos[k]}»: cambiaste de línea (paterna por materna o al revés).`));
    }
    for (const k of [n - 2, n - 3]) {
      if (k < 0) continue;
      errores.push(ht('RMP61-eslabon', per(ids[k]), `${ps[ids[k]].nombre} es «${fraseArbol(pasos, k, false)}»: un eslabón del camino. Faltaba seguir hasta «${fraseArbol(pasos, n - 1, false)}».`));
    }
    const alternativas = P.armarTexto({ correcta: per(final), errores: errores.filter(Boolean), rng });
    if (alternativas.length < 4) return null;
    const solucion = [['Se lee desde el final. ', v('a', `«Mi ${pasos[0]}»`), ` de ${quien} es ${ps[ids[0]].nombre}.`]];
    for (let i = 1; i < n; i++) solucion.push([`${cap(ART[pasos[i]])} ${pasos[i]} de ${ps[ids[i - 1]].nombre} es `, i === n - 1 ? v('x', ps[ids[i]].nombre) : ps[ids[i]].nombre, '.']);
    solucion.push(['Es ', v('x', ps[final].nombre), `: «${fraseArbol(pasos)}» de ${quien}.`]);
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { a: { nombre: 'eslabón de partida', color: 'o' }, x: { nombre: 'persona buscada', color: 'h' } },
      enunciado: [`En el árbol de la familia, ${quien} dice: «`, v('a', fraseArbol(pasos)), ` ${d.dicho[0]}».`],
      figura: { svg: figuraArbol(arbol), alt: altArbol(arbol) },
      pregunta: [`¿Quién ${d.dicho[1]} ${quien}?`],
      datos: '', alternativas, solucion,
      figuraSolucion: { svg: figuraArbol(arbol, final), alt: altArbol(arbol) + ` Marcada: ${ps[final].nombre}.` },
      respuesta: { valor: 'p' + final, texto: ps[final].nombre },
      _datos: d,
    };
  }

  // =====================================================================
  // 3. Mínimo de personas con varios parentescos cada una
  // =====================================================================
  const ROLES = ['padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'abuelo', 'abuela', 'nieto', 'nieta'];
  const PLURAL = { padre: 'padres', madre: 'madres', hijo: 'hijos', hija: 'hijas', hermano: 'hermanos', hermana: 'hermanas', abuelo: 'abuelos', abuela: 'abuelas', nieto: 'nietos', nieta: 'nietas' };
  // Conteo de parentescos de una familia: personas [{ s: 0 varón | 1 mujer, f: índice del padre o −1, m: de la madre }].
  function roles(ps) {
    const hijos = ps.map(() => []);
    ps.forEach((p, i) => { if (p.f >= 0) hijos[p.f].push(i); if (p.m >= 0) hijos[p.m].push(i); });
    const cuenta = {}; for (const r of ROLES) cuenta[r] = 0;
    const tieneP = p => p.f >= 0 || p.m >= 0;
    ps.forEach((p, i) => {
      const g = p.s === 0 ? 0 : 1;
      if (hijos[i].length) cuenta[['padre', 'madre'][g]]++;
      if (tieneP(p)) cuenta[['hijo', 'hija'][g]]++;
      if (tieneP(p) && ps.some((q, j) => j !== i && q.f === p.f && q.m === p.m)) cuenta[['hermano', 'hermana'][g]]++;
      if (hijos[i].some(k => hijos[k].length)) cuenta[['abuelo', 'abuela'][g]]++;
      if ((p.f >= 0 && tieneP(ps[p.f])) || (p.m >= 0 && tieneP(ps[p.m]))) cuenta[['nieto', 'nieta'][g]]++;
    });
    return cuenta;
  }
  // Todas las familias de hasta NMAX personas, sin repetir formas: primero los que no tienen padres presentes,
  // luego cada hijo ordenado por sus padres. Cada persona es padre o madre con una sola pareja.
  let TABLA = null;
  const NMAX = 7;
  function familias() {
    if (TABLA) return TABLA;
    const mapa = new Map(), ps = [];
    function rec() {
      if (ps.length) {
        const aislado = ps.some((p, i) => p.f < 0 && p.m < 0 && !ps.some(q => q.f === i || q.m === i));
        if (!aislado) {
          const c = roles(ps), k = ROLES.map(r => c[r]).join(',');
          if (!mapa.has(k)) mapa.set(k, { n: ps.length, cuenta: c, ps: ps.map(p => ({ ...p })) });
        }
      }
      if (ps.length === NMAX) return;
      const n = ps.length, ult = ps[n - 1];
      // Orden: por el padre o la madre que se agregó al último, y luego por padre y madre (así los padres
      // siempre van antes que sus hijos y cada familia sale una sola vez).
      const clave = p => (Math.max(p.f, p.m) + 1) * (NMAX + 1) * (NMAX + 1) + (p.f + 1) * (NMAX + 1) + (p.m + 1);
      const kU = ult ? clave(ult) : 0, sU = ult ? ult.s : 0;
      const pareja = new Map();
      ps.forEach(p => { const t = p.f + '|' + p.m; if (p.f >= 0) pareja.set(p.f, t); if (p.m >= 0) pareja.set(p.m, t); });
      for (let fa = -1; fa < n; fa++) {
        if (fa >= 0 && ps[fa].s !== 0) continue;
        for (let ma = -1; ma < n; ma++) {
          if (ma >= 0 && ps[ma].s !== 1) continue;
          const k = clave({ f: fa, m: ma }), t = fa + '|' + ma;
          if (k < kU || (k > 0 && n === 0)) continue;
          if ((fa >= 0 && pareja.has(fa) && pareja.get(fa) !== t) || (ma >= 0 && pareja.has(ma) && pareja.get(ma) !== t)) continue;
          for (let s = 0; s < 2; s++) { if (k === kU && s < sU) continue; ps.push({ s, f: fa, m: ma }); rec(); ps.pop(); }
        }
      }
    }
    rec();
    TABLA = [...mapa.values()].sort((a, b) => a.n - b.n);
    return TABLA;
  }
  function minimoPersonas(pedido, alMenos = false) {
    const roles_ = Object.keys(pedido);
    for (const e of familias()) if (roles_.every(r => alMenos ? e.cuenta[r] >= pedido[r] : e.cuenta[r] === pedido[r])) return { n: e.n, ejemplo: e.ps };
    return null;
  }
  // Describe una familia con nombres: «Juan y Rosa son padres de Luis y Ana. …».
  function describirFamilia(ps) {
    const nv = VARONES.slice(), nm = MUJERES.slice();
    const nom = ps.map(p => (p.s === 0 ? nv.shift() : nm.shift()));
    const grupos = new Map();
    ps.forEach((p, i) => { if (p.f >= 0 || p.m >= 0) { const k = p.f + '|' + p.m; if (!grupos.has(k)) grupos.set(k, []); grupos.get(k).push(i); } });
    const frases = [];
    for (const [k, hs] of grupos) {
      const [fa, ma] = k.split('|').map(Number);
      const padres = [fa, ma].filter(x => x >= 0).map(x => nom[x]);
      frases.push(`${lista(padres)} ${padres.length > 1 ? 'son padres' : (fa >= 0 ? 'es padre' : 'es madre')} de ${lista(hs.map(x => nom[x]))}`);
    }
    return { nom, texto: frases.join('; ') + '.' };
  }

  function construirMinimo(rng, semilla) {
    const tabla = familias();
    for (let intento = 0; intento < 300; intento++) {
      const base = rng.elegir(tabla.filter(e => e.n >= 4));
      const conRol = ROLES.filter(r => base.cuenta[r] > 0);
      if (conRol.length < 5) continue;
      const k = Math.min(conRol.length, rng.entero(5, 8));
      const elegidos = rng.barajar(conRol).slice(0, k);
      const pedido = {}; for (const r of ROLES) if (elegidos.includes(r)) pedido[r] = base.cuenta[r];
      const ex = minimoPersonas(pedido), am = minimoPersonas(pedido, true);
      if (!ex || !am || ex.n !== am.n) continue;
      const suma = Object.values(pedido).reduce((a, b) => a + b, 0);
      if (suma - ex.n < 3) continue;
      const d = { tipo: 'minimo', pedido };
      const p = armarMinimo(d, ex, base, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarMinimo(d, ex, base, rng, semilla) {
    const { pedido } = d, rs = Object.keys(pedido), N = ex.n;
    const suma = rs.reduce((a, r) => a + pedido[r], 0);
    const varones = Math.max(0, ...rs.filter(r => ROLES.indexOf(r) % 2 === 0).map(r => pedido[r]));
    const mujeres = Math.max(0, ...rs.filter(r => ROLES.indexOf(r) % 2 === 1).map(r => pedido[r]));
    const errores = [h('RMP62-suma', suma, `Sumaste los parentescos (${suma}) como si cada uno fuera una persona distinta. Una misma persona puede ser a la vez padre, hijo, hermano y abuelo.`)];
    if (varones + mujeres !== N) errores.push(h('RMP62-por-sexo', varones + mujeres, `Juntaste a todos los varones en ${varones} y a todas las mujeres en ${mujeres} sin armar la familia. Con ${varones + mujeres} personas no se pueden cumplir todos los parentescos a la vez.`));
    if (base.n !== N) errores.push(h('RMP2-primera', base.n, `Con ${base.n} personas sí se arma una familia que cumple, pero no es la más chica: se puede con menos.`));
    for (const r of rng.barajar(rs)) {
      const otro = {}; for (const q of rs) if (q !== r) otro[q] = pedido[q];
      const m = minimoPersonas(otro);
      if (m && m.n !== N) errores.push(h('RMP63-sin-un-rol', m.n, `Esa cantidad sale si no tomas en cuenta que hay ${pedido[r]} ${pedido[r] === 1 ? r : PLURAL[r]}.`));
    }
    const alternativas = P.armar({ correcta: N, errores, rng });
    if (alternativas.length < 4) return null;
    const fam = describirFamilia(ex.ejemplo), cuenta = roles(ex.ejemplo);
    const quienes = r => fam.nom.filter((_, i) => tieneRol(ex.ejemplo, i, r));
    const textoPedido = rs.map(r => `${pedido[r]} ${pedido[r] === 1 ? r : PLURAL[r]}`);
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { V: { nombre: 'varones como mínimo', color: 'o' }, M: { nombre: 'mujeres como mínimo', color: 'i' }, N: { nombre: 'personas', color: 'h' } },
      enunciado: [`En una reunión familiar hay exactamente ${lista(textoPedido)}. Cada persona se cuenta en todos los parentescos que tiene con alguien de la reunión.`],
      pregunta: ['¿Cuántas personas, como mínimo, hay en la reunión?'],
      datos: '', alternativas,
      solucion: [
        ['Una persona puede tener varios parentescos: el mismo varón puede ser hijo de uno y padre de otro.'],
        ['Hacen falta al menos ', v('V', `${varones} ${varones === 1 ? 'varón' : 'varones'}`), ' y ', v('M', `${mujeres} ${mujeres === 1 ? 'mujer' : 'mujeres'}`), `, porque es lo que pide el parentesco más numeroso de cada sexo${varones + mujeres < N ? '; con eso todavía no alcanza' : ''}.`],
        [`Una familia de ${N} que cumple: ${fam.texto}`],
        ['Cuenta: ' + rs.map(r => `${PLURAL[r]}, ${lista(quienes(r))}`).join('; ') + '.'],
        ['Con menos personas siempre falta o sobra algún parentesco (se revisan todas las familias posibles). Mínimo: ', v('N', `${N} personas`), '.'],
      ].filter(x => cuenta && x),
      respuesta: { valor: N, unidad: 'personas' },
      _datos: d,
    };
  }
  function tieneRol(ps, i, r) {
    const p = ps[i], g = ROLES.indexOf(r) % 2;
    if ((p.s === 0 ? 0 : 1) !== g) return false;
    const hijos = ps.map((q, j) => j).filter(j => ps[j].f === i || ps[j].m === i);
    const tieneP = q => q.f >= 0 || q.m >= 0;
    const base = r.replace(/a$/, 'o').replace(/^madr/, 'padr').replace(/^padro$/, 'padre');
    if (r === 'padre' || r === 'madre') return hijos.length > 0;
    if (base === 'hijo') return tieneP(p);
    if (base === 'hermano') return tieneP(p) && ps.some((q, j) => j !== i && q.f === p.f && q.m === p.m);
    if (base === 'abuelo') return hijos.some(k => ps.some(q => q.f === k || q.m === k));
    if (base === 'nieto') return (p.f >= 0 && tieneP(ps[p.f])) || (p.m >= 0 && tieneP(ps[p.m]));
    return false;
  }

  // =====================================================================
  // 4. Ordenar cuatro personas con sumas de a dos
  // =====================================================================
  let TUPLAS = null;
  function tuplas() { // valores distintos de 1 a 12 para cuatro personas
    if (TUPLAS) return TUPLAS;
    TUPLAS = [];
    for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) for (let c = 1; c <= 12; c++) for (let e = 1; e <= 12; e++)
      if (a !== b && a !== c && a !== e && b !== c && b !== e && c !== e) TUPLAS.push([a, b, c, e]);
    return TUPLAS;
  }
  const cumplePista = (x, p) => {
    if (p.t === 'simple') return x[p.a] > x[p.b];
    const l = x[p.a[0]] + x[p.a[1]], r = x[p.b[0]] + x[p.b[1]];
    return p.rel === '=' ? l === r : p.rel === '>' ? l > r : l < r;
  };
  const ordenDe = x => [0, 1, 2, 3].sort((i, j) => x[j] - x[i]);
  // Para cada pista, qué cuaternas la cumplen (se guarda: las mismas pistas se prueban muchas veces).
  const MASCARAS = new Map();
  let ORD_IDX = null, ORD_LISTA = null;
  function mascara(p) {
    const k = p.t === 'simple' ? `s${p.a}${p.b}` : `${p.a.join('')}${p.rel}${p.b.join('')}`;
    if (!MASCARAS.has(k)) { const T = tuplas(), m = new Uint8Array(T.length); T.forEach((x, i) => { m[i] = cumplePista(x, p) ? 1 : 0; }); MASCARAS.set(k, m); }
    return MASCARAS.get(k);
  }
  function ordenes(pistas) {
    const T = tuplas();
    if (!ORD_IDX) {
      const claves = new Map(); ORD_LISTA = []; ORD_IDX = new Uint8Array(T.length);
      T.forEach((x, i) => { const o = ordenDe(x).join(','); if (!claves.has(o)) { claves.set(o, ORD_LISTA.length); ORD_LISTA.push(o); } ORD_IDX[i] = claves.get(o); });
    }
    const ms = pistas.map(mascara), vistos = new Uint8Array(ORD_LISTA.length);
    for (let i = 0; i < T.length; i++) { let ok = 1; for (const m of ms) if (!m[i]) { ok = 0; break; } if (ok) vistos[ORD_IDX[i]] = 1; }
    return ORD_LISTA.filter((_, j) => vistos[j]).sort().map(t => t.split(',').map(Number));
  }
  // Comparaciones que salen de sumar o restar dos pistas (o de una sola): «C > B».
  function deducciones(pistas) {
    const formas = pistas.map(p => {
      const c = [0, 0, 0, 0];
      if (p.t === 'simple') { c[p.a]++; c[p.b]--; return { c, rel: '>', de: [p] }; }
      p.a.forEach(i => c[i]++); p.b.forEach(i => c[i]--);
      return p.rel === '<' ? { c: c.map(z => -z), rel: '>', de: [p] } : { c, rel: p.rel, de: [p] };
    });
    const res = [];
    const mirar = (c, rel, de, op) => {
      const nz = c.map((z, i) => [z, i]).filter(([z]) => z !== 0);
      if (nz.length === 2 && nz[0][0] === -nz[1][0] && rel === '>') {
        const [mayor, menor] = nz[0][0] > 0 ? [nz[0][1], nz[1][1]] : [nz[1][1], nz[0][1]];
        res.push({ mayor, menor, de, op });
      }
    };
    formas.forEach(F => mirar(F.c, F.rel, F.de, null));
    for (let i = 0; i < formas.length; i++) for (let j = i + 1; j < formas.length; j++) {
      const A = formas[i], B = formas[j];
      for (const sg of [1, -1]) {
        const c = A.c.map((z, k) => z + sg * B.c[k]);
        let rel = null;
        if (A.rel === '=' && B.rel === '=') rel = '=';
        else if (A.rel === '>' && B.rel === '>' && sg === 1) rel = '>';
        else if (A.rel === '>' && B.rel === '=') rel = '>';
        else if (A.rel === '=' && B.rel === '>') { if (sg === 1) rel = '>'; else { mirar(c.map(z => -z), '>', [A.de[0], B.de[0]], 'resta'); continue; } }
        if (rel) mirar(c, rel, [A.de[0], B.de[0]], sg === 1 ? 'suma' : 'resta');
      }
    }
    return res;
  }
  function ordenPorDeducciones(ded) {
    const mayor = Array.from({ length: 4 }, () => new Set());
    ded.forEach(d => mayor[d.mayor].add(d.menor));
    for (let k = 0; k < 4; k++) for (let i = 0; i < 4; i++) for (const j of [...mayor[i]]) for (const t of mayor[j]) mayor[i].add(t);
    const o = [0, 1, 2, 3].sort((i, j) => mayor[j].size - mayor[i].size);
    return o.every((x, k) => mayor[x].size === 3 - k) ? o : null;
  }
  function textoPista(p, nom, tema) {
    if (p.t === 'simple') return tema === 'edad' ? `${nom[p.a]} es mayor que ${nom[p.b]}` : `${nom[p.a]} tiene más dinero que ${nom[p.b]}`;
    const rel = { '=': 'suman lo mismo que', '>': 'suman más que', '<': 'suman menos que' }[p.rel];
    return tema === 'edad' ? `las edades de ${nom[p.a[0]]} y ${nom[p.a[1]]} ${rel} las de ${nom[p.b[0]]} y ${nom[p.b[1]]}`
      : `lo que tienen ${nom[p.a[0]]} y ${nom[p.a[1]]} ${rel.replace('suman', 'suma')} lo que tienen ${nom[p.b[0]]} y ${nom[p.b[1]]}`;
  }
  const claveOrden = o => ({ clave: 'orden:' + o.join(','), texto: null });

  function construirOrden(rng, semilla) {
    const NOM4 = [['Ana', 'Beto', 'Ciro', 'Dina'], ['Elsa', 'Fico', 'Gina', 'Hugo'], ['Inés', 'Juan', 'Kati', 'Lucho'], ['Mery', 'Noé', 'Olga', 'Pepe'], ['Rosa', 'Saúl', 'Tania', 'Uriel']];
    const PARES = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
    for (let intento = 0; intento < 400; intento++) {
      const nombres = rng.barajar(rng.elegir(NOM4));
      const tema = rng.elegir(['edad', 'dinero']);
      const x = rng.elegir(tuplas());
      const pistas = [];
      // Una igualdad de sumas (si los valores la permiten) y desigualdades de sumas; a veces una simple.
      const opciones = [];
      for (const [A, B] of PARES) for (const [a, b] of [[A, B], [B, A]]) {
        const l = x[a[0]] + x[a[1]], r = x[b[0]] + x[b[1]];
        opciones.push({ t: 'suma', a: rng.barajar(a), b: rng.barajar(b), rel: l === r ? '=' : l > r ? '>' : '<' });
      }
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (i !== j && x[i] > x[j]) opciones.push({ t: 'simple', a: i, b: j });
      const sumas = rng.barajar(opciones.filter(p => p.t === 'suma'));
      const iguales = sumas.filter(p => p.rel === '=');
      if (iguales.length) pistas.push(iguales[0]);
      for (const p of sumas) if (pistas.length < 3 && !pistas.some(q => q.t === 'suma' && JSON.stringify([q.a, q.b].map(z => z.slice().sort()).sort()) === JSON.stringify([p.a, p.b].map(z => z.slice().sort()).sort()))) pistas.push(p);
      const simples = rng.barajar(opciones.filter(p => p.t === 'simple'));
      let k = 0;
      while (ordenes(pistas).length > 1 && k < simples.length) pistas.push(simples[k++]);
      if (ordenes(pistas).length !== 1) continue;
      // Quita las pistas que sobran.
      for (let i = pistas.length - 1; i >= 0; i--) { const sin = pistas.filter((_, j) => j !== i); if (ordenes(sin).length === 1) pistas.splice(i, 1); }
      if (pistas.length < 3 || pistas.filter(p => p.t === 'simple').length > 1) continue;
      if (!ordenPorDeducciones(deducciones(pistas))) continue;
      const d = { tipo: 'orden', nombres, tema, pistas: rng.barajar(pistas) };
      const p = armarOrden(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarOrden(d, rng, semilla) {
    const { nombres: nom, tema, pistas } = d;
    const o = ordenes(pistas)[0];
    const txt = or => or.map(i => nom[i]).join(', ');
    const correcta = { clave: 'orden:' + o.join(','), texto: txt(o) };
    const usados = new Set([correcta.clave]);
    const errores = [];
    pistas.forEach((p, i) => {
      const otras = ordenes(pistas.filter((_, j) => j !== i)).filter(or => !usados.has('orden:' + or.join(',')));
      if (!otras.length) return;
      const or = rng.elegir(otras); usados.add('orden:' + or.join(','));
      errores.push(ht('RMP63-sin-pista', { clave: 'orden:' + or.join(','), texto: txt(or) }, `Ese orden cumple todas las pistas menos una: «${textoPista(p, nom, tema)}». Revísalo con esa pista.`));
    });
    const alternativas = P.armarTexto({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const ded = deducciones(pistas);
    // Solo las deducciones que hacen falta para el orden (las de dos personas seguidas en el orden).
    const necesarias = [];
    for (let k = 0; k < 3; k++) {
      const dd = ded.filter(x => x.mayor === o[k] && x.menor === o[k + 1]);
      if (dd.length) necesarias.push(dd.sort((a, b) => a.de.length - b.de.length)[0]);
    }
    const ini = nom.map(n => n[0]);
    const formula = p => p.t === 'simple' ? `${ini[p.a]} > ${ini[p.b]}` : `${ini[p.a[0]]} + ${ini[p.a[1]]} ${p.rel} ${ini[p.b[0]]} + ${ini[p.b[1]]}`;
    const solucion = [['Escribe cada pista con las iniciales: ', pistas.map(formula).join(' ; '), '.']];
    for (const x of necesarias) {
      if (x.de.length === 1) solucion.push([`De ${formula(x.de[0])} sale directo `, v('x', `${ini[x.mayor]} > ${ini[x.menor]}`), '.']);
      else solucion.push([`${x.op === 'suma' ? 'Sumando' : 'Restando'} ${formula(x.de[0])} y ${formula(x.de[1])}, se cancelan los que aparecen a los dos lados y queda `, v('x', `${ini[x.mayor]} > ${ini[x.menor]}`), '.']);
    }
    if (necesarias.length < 3) solucion.push(['Juntando lo anterior (si A > B y B > C, entonces A > C) queda un solo orden.']);
    solucion.push(['De mayor a menor: ', v('x', txt(o)), '.']);
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { x: { nombre: 'comparación deducida', color: 'h' } },
      enunciado: [`${lista(nom)} tienen ${tema === 'edad' ? 'edades' : 'cantidades de dinero'} distintas. Se sabe que: ` + pistas.map(p => textoPista(p, nom, tema)).join('; ') + '.'],
      pregunta: [`¿Cuál es el orden de ${tema === 'edad' ? 'mayor a menor edad' : 'quien tiene más a quien tiene menos'}?`],
      datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto },
      _datos: d,
    };
  }

  // =====================================================================
  // 5. Sobres con montos distintos para tres personas
  // =====================================================================
  function repartos(montos, pistas) {
    const res = [], idx = [0, 1, 2, 3, 4, 5];
    // Todas las formas de dar dos sobres a cada persona (90).
    for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) {
      const r1 = idx.filter(i => i !== a && i !== b);
      for (let c = 0; c < 4; c++) for (let e = c + 1; e < 4; e++) {
        const rep = [[a, b], [r1[c], r1[e]], r1.filter((_, k) => k !== c && k !== e)];
        if (pistas.every(p => cumpleBillete(montos, rep, p))) res.push(rep);
      }
    }
    return res;
  }
  const totalDe = (montos, rep, i) => montos[rep[i][0]] + montos[rep[i][1]];
  function cumpleBillete(montos, rep, p) {
    const T = i => totalDe(montos, rep, i);
    if (p.t === 'mas') return T(p.a) > T(p.b);
    if (p.t === 'dif') return T(p.a) - T(p.b) === p.d;
    if (p.t === 'tope') return p.menos ? T(p.a) < p.k : T(p.a) > p.k;
    if (p.t === 'tiene') return rep[p.a].includes(p.sobre);
    if (p.t === 'notiene') return !rep[p.a].includes(p.sobre);
    return true;
  }
  const valorPedido = (montos, rep, pide) => pide.t === 'monto' ? totalDe(montos, rep, pide.p) : totalDe(montos, rep, pide.p) - totalDe(montos, rep, pide.q);
  function textoBillete(p, nom, montos) {
    if (p.t === 'mas') return `${nom[p.a]} recibió más dinero que ${nom[p.b]}`;
    if (p.t === 'dif') return `${nom[p.a]} recibió S/ ${p.d} más que ${nom[p.b]}`;
    if (p.t === 'tope') return `${nom[p.a]} recibió ${p.menos ? 'menos' : 'más'} de S/ ${p.k}`;
    if (p.t === 'tiene') return `${nom[p.a]} tiene el sobre de S/ ${montos[p.sobre]}`;
    return `${nom[p.a]} no tiene el sobre de S/ ${montos[p.sobre]}`;
  }
  function construirBilletes(rng, semilla) {
    for (let intento = 0; intento < 400; intento++) {
      const montos = rng.barajar([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100]).slice(0, 6).sort((a, b) => a - b);
      const nombres = rng.barajar([['Ana', 'Beto', 'Caro'], ['Lucho', 'Mery', 'Nilo'], ['Rosa', 'Saúl', 'Tito'], ['Elsa', 'Fredy', 'Gaby']][rng.entero(0, 3)]);
      const oculto = rng.elegir(repartos(montos, []));
      const T = i => totalDe(montos, oculto, i);
      if (new Set([T(0), T(1), T(2)]).size < 3) continue;
      const cand = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j && T(i) > T(j)) { cand.push({ t: 'mas', a: i, b: j }); cand.push({ t: 'dif', a: i, b: j, d: T(i) - T(j) }); }
      for (let i = 0; i < 3; i++) {
        const k = rng.moneda() ? T(i) + 5 * rng.entero(1, 3) : Math.max(5, T(i) - 5 * rng.entero(1, 3));
        cand.push({ t: 'tope', a: i, k, menos: k > T(i) });
        cand.push({ t: 'tiene', a: i, sobre: rng.elegir(oculto[i]) });
        cand.push({ t: 'notiene', a: i, sobre: rng.elegir([0, 1, 2, 3, 4, 5].filter(s => !oculto[i].includes(s))) });
      }
      const pide = rng.sig() < 0.6 ? { t: 'monto', p: rng.entero(0, 2) } : (() => { const [p, q] = rng.barajar([0, 1, 2]); return T(p) > T(q) ? { t: 'dif', p, q } : { t: 'dif', p: q, q: p }; })();
      const pistas = [];
      const valores = ps => new Set(repartos(montos, ps).map(r => valorPedido(montos, r, pide)));
      for (const c of rng.barajar(cand)) {
        if (valores(pistas).size === 1) break;
        if (c.t === 'dif' && pide.t === 'dif' && ((c.a === pide.p && c.b === pide.q) || (c.a === pide.q && c.b === pide.p))) continue;
        if (c.t === 'dif' && pistas.some(p => p.t === 'dif')) continue;
        pistas.push(c);
      }
      if (valores(pistas).size !== 1) continue;
      for (let i = pistas.length - 1; i >= 0; i--) { const sin = pistas.filter((_, j) => j !== i); if (valores(sin).size === 1) pistas.splice(i, 1); }
      if (pistas.length < 3 || pistas.length > 5) continue;
      const d = { tipo: 'billetes', montos, nombres, pistas, pide };
      const p = armarBilletes(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarBilletes(d, rng, semilla) {
    const { montos, nombres: nom, pistas, pide } = d;
    const sols = repartos(montos, pistas);
    const correcta = valorPedido(montos, sols[0], pide);
    const errores = [];
    pistas.forEach((p, i) => {
      const otros = [...new Set(repartos(montos, pistas.filter((_, j) => j !== i)).map(r => valorPedido(montos, r, pide)))].filter(x => x !== correcta);
      if (otros.length) errores.push(h('RMP63-sin-pista', rng.elegir(otros), `Ese monto sale de un reparto que no cumple «${textoBillete(p, nom, montos)}». Hay que usar todas las pistas.`));
    });
    if (pide.t === 'monto') {
      const total = montos.reduce((a, b) => a + b, 0);
      if (total % 3 === 0) errores.push(h('RMP63-partes-iguales', total / 3, `Repartiste el total (S/ ${total}) en tres partes iguales. Las pistas dicen que cada uno recibió una cantidad distinta.`));
    }
    const alternativas = P.armar({ correcta, errores, rng }).map(a => ({ ...a, texto: 'S/ ' + a.texto }));
    if (alternativas.length < 4) return null;
    const rep = sols[0];
    const quien = i => `${nom[i]}: S/ ${montos[rep[i][0]]} + S/ ${montos[rep[i][1]]} = S/ ${totalDe(montos, rep, i)}`;
    const pregunta = pide.t === 'monto' ? `¿Cuánto dinero recibió ${nom[pide.p]}?` : `¿Cuánto más que ${nom[pide.q]} recibió ${nom[pide.p]}?`;
    const unarias = pistas.filter(p => p.t === 'tiene' || p.t === 'notiene' || p.t === 'tope');
    const solucion = [['Cada persona recibe dos sobres. Conviene empezar por las pistas que hablan de una sola persona: ', unarias.length ? unarias.map(p => `«${textoBillete(p, nom, montos)}»`).join(', ') : 'no hay; se prueban las sumas posibles', '.']];
    for (let i = 0; i < 3; i++) {
      const sus = unarias.filter(p => p.a === i);
      if (!sus.length) continue;
      const pares = [];
      for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) { const rr = [[a, b], [a, b], [a, b]]; if (sus.every(p => cumpleBillete(montos, rr, p))) pares.push(`${montos[a]} + ${montos[b]}`); }
      solucion.push([`${nom[i]} puede tener: ${pares.join('; ')}.`]);
    }
    solucion.push([`Con las demás pistas solo ${sols.length === 1 ? 'queda un reparto' : `quedan ${sols.length} repartos, y en todos sale lo mismo`}: `, quien(0), '; ', quien(1), '; ', quien(2), '.']);
    solucion.push([pide.t === 'monto' ? `${nom[pide.p]} recibió ` : `${nom[pide.p]} recibió más que ${nom[pide.q]}: `, v('x', `S/ ${f(correcta)}`), '.']);
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { x: { nombre: 'monto pedido', color: 'h' } },
      enunciado: [`Hay seis sobres con S/ ${lista(montos.map(String))}. ${lista(nom)} reciben dos sobres cada uno. Se sabe que: ` + pistas.map(p => textoBillete(p, nom, montos)).join('; ') + '.'],
      pregunta: [pregunta], datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'soles' },
      _datos: d,
    };
  }

  // =====================================================================
  // 6. Edades con paridad y primos: la menor suma posible de dos
  // =====================================================================
  const esPrimo = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
  function cumpleEdad(e, c, op = {}) {
    const x = e[c.p];
    if (c.t === 'primo') return op.unoPrimo ? (x === 1 || esPrimo(x)) : esPrimo(x);
    if (c.t === 'par') return x % 2 === 0;
    if (c.t === 'impar') return x % 2 === 1;
    if (c.t === 'mult') return x % c.k === 0;
    if (c.t === 'mayor') return e[c.p] > e[c.q];
    if (c.t === 'suma') return e[0] + e[1] + e[2] === c.k;
    if (c.t === 'dif') return e[c.p] - e[c.q] === c.k;
    return true;
  }
  function edades(conds, op = {}) {
    const r = [];
    const S = conds.find(k => k.t === 'suma');
    for (let a = 1; a <= 40; a++) for (let b = 1; b <= 40; b++) for (let c = (S ? S.k - a - b : 1); c <= (S ? S.k - a - b : 40); c++) {
      if (a === b || a === c || b === c || c < 1 || c > 40) continue;
      const e = [a, b, c];
      if (conds.every(k => cumpleEdad(e, k, op))) r.push(e);
    }
    return r;
  }
  function textoCond(c, nom) {
    if (c.t === 'primo') return `la edad de ${nom[c.p]} es un número primo`;
    if (c.t === 'par') return `${nom[c.p]} tiene una edad par`;
    if (c.t === 'impar') return `${nom[c.p]} tiene una edad impar`;
    if (c.t === 'mult') return `la edad de ${nom[c.p]} es múltiplo de ${c.k}`;
    if (c.t === 'mayor') return `${nom[c.p]} es mayor que ${nom[c.q]}`;
    if (c.t === 'suma') return `las tres edades suman ${c.k} años`;
    return `${nom[c.p]} tiene ${c.k} años más que ${nom[c.q]}`;
  }
  function construirEdades(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const nom = rng.barajar(rng.elegir([['Ana', 'Beto', 'Ciro'], ['Lía', 'Omar', 'Nico'], ['Rosa', 'Teo', 'Gina'], ['Elsa', 'Iván', 'Flor']]));
      const [a, b, c] = rng.barajar([0, 1, 2]);
      const conds = [{ t: 'primo', p: a }, { t: rng.elegir(['par', 'mult']), p: b, k: rng.elegir([3, 4, 5]) }, { t: 'mayor', p: a, q: c }, { t: 'mayor', p: c, q: b }];
      if (conds[1].t === 'par') delete conds[1].k;
      if (rng.moneda()) conds.push({ t: 'impar', p: c });
      conds.push({ t: 'suma', k: rng.entero(18, 45) });
      if (rng.moneda()) conds.push({ t: 'dif', p: a, q: b, k: rng.entero(3, 12) });
      const pide = rng.barajar([0, 1, 2]).slice(0, 2).sort();
      const sols = edades(conds);
      if (sols.length < 2) continue;
      const sumas = sols.map(e => e[pide[0]] + e[pide[1]]);
      const min = Math.min(...sumas), max = Math.max(...sumas);
      if (max === min) continue;
      const d = { tipo: 'edades', nombres: nom, conds, pide };
      const p = armarEdades(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarEdades(d, rng, semilla) {
    const { nombres: nom, conds, pide } = d;
    const sols = edades(conds);
    const suma = e => e[pide[0]] + e[pide[1]];
    const correcta = Math.min(...sols.map(suma));
    const mejor = sols.find(e => suma(e) === correcta);
    const errores = [];
    // RMP2: la primera terna que aparece al probar edades de menor a mayor para la primera persona de la lista.
    const primera = sols.slice().sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2])[0];
    errores.push(h('RMP2-primera', suma(primera), `Tomaste la primera terna que encontraste (${nom.map((n, i) => `${n} ${primera[i]}`).join(', ')}) sin ver si hay otra con una suma menor.`));
    errores.push(h('RMP2-mayor', Math.max(...sols.map(suma)), 'Esa es la mayor suma posible; la pregunta pide la menor.'));
    const unoP = edades(conds, { unoPrimo: true });
    if (unoP.length) errores.push(h('RMP63-uno-primo', Math.min(...unoP.map(suma)), 'Contaste el 1 como primo. Un primo tiene exactamente dos divisores, y el 1 tiene uno solo.'));
    conds.forEach((c, i) => {
      if (c.t === 'primo' || c.t === 'mayor') {
        const s = edades(conds.filter((_, j) => j !== i));
        if (s.length) errores.push(h('RMP63-sin-pista', Math.min(...s.map(suma)), `Esa suma sale si no usas la condición «${textoCond(c, nom)}».`));
      }
    });
    const alternativas = P.armar({ correcta, errores, rng }).map(a => ({ ...a, texto: a.texto + ' años' }));
    if (alternativas.length < 4) return null;
    const pedidos = `${nom[pide[0]]} y ${nom[pide[1]]}`;
    return {
      id: `rm-parentesco#${semilla}`,
      variables: { x: { nombre: 'suma mínima', color: 'h' } },
      enunciado: [`${lista(nom)} son hermanos de edades distintas (en años cumplidos, de 1 a 40). Se sabe que ` + conds.map(c => textoCond(c, nom)).join('; ') + '.'],
      pregunta: [`¿Cuál es la menor suma posible de las edades de ${pedidos}?`],
      datos: '', alternativas,
      solucion: [
        ['Ordena primero: ' + conds.filter(c => c.t === 'mayor').map(c => `${nom[c.p]} > ${nom[c.q]}`).join(' y ') + '. Luego prueba de forma ordenada las edades que cumplen cada condición (primos: 2, 3, 5, 7, 11, 13, …; el 1 no es primo).'],
        [`Las ternas que cumplen todo son ${sols.length}${sols.length <= 10 ? ': ' + sols.map(e => `(${e.join(', ')})`).join(', ') : ''} (en el orden ${nom.join(', ')}).`],
        [`La de menor suma para ${pedidos} es (${mejor.join(', ')}): `, v('x', `${mejor[pide[0]]} + ${mejor[pide[1]]} = ${correcta} años`), '.'],
      ],
      respuesta: { valor: correcta, unidad: 'años' },
      _datos: d,
    };
  }

  // =====================================================================
  const TIPOS = { cadena: construirCadena, arbol: construirArbol, minimo: construirMinimo, orden: construirOrden, billetes: construirBilletes, edades: construirEdades };
  const SORTEO = ['cadena', 'cadena', 'cadena', 'arbol', 'arbol', 'minimo', 'minimo', 'orden', 'orden', 'billetes', 'edades'];
  function generar(semilla) {
    const rng = Azar.crear('rm-parentesco|' + semilla);
    const tipo = rng.elegir(SORTEO);
    for (let intento = 0; intento < 20; intento++) {
      const p = TIPOS[tipo](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return {
    id: 'rm-parentesco', titulo: 'Parentescos, órdenes y repartos con pistas', generar,
    calc: { cadena, nombre, minimoPersonas, roles, ordenes, repartos, edades, recorrerArbol, esPrimo },
  };
});
