/*
 * Motor de «El tablero de las pistas»: orden de información, verdades y mentiras, y certezas.
 *
 * Aquí vive toda la lógica de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorOrden) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Todo se resuelve por fuerza bruta: se arman TODOS los arreglos posibles y se quedan los que cumplen las pistas.
 * Así el motor sabe cuántas soluciones hay, si la respuesta es única, qué pista sobra y qué es seguro o solo posible.
 *
 *   Ordenamiento (un «problema» es un objeto con forma, personas y pistas):
 *     { forma:'lineal', personas:[…], asientos?:n, pistas:[…] }   fila de butacas 1…n, de izquierda a derecha
 *     { forma:'circular', personas:[…], asientos?:n, pistas:[…] } mesa redonda; dos arreglos girados son el mismo
 *     { forma:'cuadro', personas:[…], atributos:{ oficio:[…], ciudad:[…] }, pistas:[…] }   cuadro de doble entrada
 *
 *   resolver(p)                 todas las soluciones (en la mesa, una por cada giro distinto), total y si es única
 *   evaluar(p, parcial)         cada pista: 'cumple' (en todo arreglo que complete lo colocado), 'falla' (en ninguno)
 *                               o 'pendiente'; y cuántas soluciones siguen siendo posibles con lo colocado
 *   posibles(p)                 qué persona puede ir en cada asiento (o qué valor en cada casilla del cuadro)
 *   pasos(p, orden)             lo posible después de aplicar las pistas una por una (para animar la deducción)
 *   quien(p, pregunta)          la respuesta, si es única, y lo que dan los errores típicos
 *   necesario(p, afirmaciones)  cuál es necesariamente cierta (siempre) y cuáles solo posibles (a veces) o nunca
 *   lugaresDe(p, persona)       en qué butacas puede sentarse alguien
 *   sinPista(p, i)              cuántas soluciones quedan si se quita la pista i
 *   analizar(p)                 qué pista sobra, si falta alguna, si hay contradicción y qué pistas la causan
 *   probarPista(p, pista)       qué pasa si se agrega una pista: 'unica', 'reduce', 'sobra' o 'contradice'
 *   variante(p, cual)           el mismo problema leído con un error: 'inmediata' («a la derecha» como
 *                               «inmediatamente a la derecha»), 'olvidaNegativa' (se saltan las pistas con «no»),
 *                               'leeSinNo' (se lee la pista negativa sin el «no»), 'sentidoInvertido' (se cambian
 *                               izquierda y derecha), 'sinDireccion' (se saltan las pistas de izquierda y derecha)
 *                               o 'sinCruce' (en el cuadro, se saltan las pistas que cruzan atributos)
 *   maneras(forma, n)           de cuántas maneras se sientan n personas sin pistas (en fila n!, en la mesa (n − 1)!)
 *   asientosMesa(n), girar(arreglo, k), mismoArreglo(p, a, b), textoPista(pista, p)
 *
 *   Verdades y mentiras:
 *     verdades(p)               p = { personas, culpables?, frases:[{ de, dice }], mienten:{ exactamente:k } | 'libre' }
 *     hipotesis(p, mentirosos)  supone quiénes mienten: qué culpables quedan y qué frases chocan
 *
 *   Certezas:
 *     certeza({ urna, objetivo })   cuántos objetos sacar para estar seguro (el peor caso) y el orden de ese peor caso
 *     llaves(n)                     intentos para saber con seguridad qué llave abre cada uno de n candados
 *
 * Convenciones de la fila: butaca 1 a la izquierda; «izquierda» y «derecha» son las de las personas, que miran
 * hacia el mismo lado que quien mira el dibujo (la pantalla del cine queda arriba). «A está a la izquierda de B» no dice
 * que estén juntos; «inmediatamente a la izquierda» sí.
 * Convenciones de la mesa: las personas miran al centro; el asiento k + 1 está inmediatamente a la derecha del k
 * (visto desde arriba, el sentido antihorario). «Frente a» es el asiento opuesto (n par).
 *
 * Cada respuesta de una predicción trae 'errores' con lo que dan los errores típicos (todos son hipótesis nuestras,
 * salvo el peor caso de las certezas, RM6 del informe, que tampoco tiene cifra): tomar «posible» como «seguro»,
 * olvidar que una pista negativa también restringe, mejor caso en vez de peor caso y leer «a la derecha de» como
 * «inmediatamente a la derecha». Un error que en ese caso da justo la respuesta correcta no se devuelve: no puede
 * ser una opción incorrecta.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorOrden = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- utilidades ----------
  function entero(x, que, min) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (!Number.isInteger(x)) throw new Error(`${que} debe ser un entero`);
    if (min !== undefined && x < min) throw new Error(`${que} debe ser al menos ${min}`);
    return x;
  }
  function fact(n) { let f = 1; for (let k = 2; k <= n; k++) f *= k; return f; }
  // Permutaciones distintas de una lista (con repetidos, como varios asientos vacíos), en orden lexicográfico estable.
  function permutaciones(lista) {
    const out = [], usado = lista.map(() => false), act = [];
    const orden = lista.map((x, i) => i);
    (function rec() {
      if (act.length === lista.length) { out.push(act.slice()); return; }
      const vistos = new Set();
      for (const i of orden) {
        if (usado[i]) continue;
        const k = lista[i] === null ? '∅' : lista[i];
        if (vistos.has(k)) continue;
        vistos.add(k); usado[i] = true; act.push(lista[i]); rec(); act.pop(); usado[i] = false;
      }
    })();
    return out;
  }
  // Quita los errores que dan la respuesta correcta y los que no existen.
  function limpiarErrores(e, correcto) {
    const out = {};
    for (const [k, v] of Object.entries(e)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (v === correcto) continue;
      out[k] = v;
    }
    return out;
  }

  // ---------- pistas ----------
  const TIPOS_FILA = ['izquierda', 'derecha', 'inmIzquierda', 'inmDerecha', 'juntos', 'noJuntos', 'extremo', 'noExtremo', 'lugar', 'noLugar', 'entre', 'separados'];
  const TIPOS_MESA = ['inmIzquierda', 'inmDerecha', 'juntos', 'noJuntos', 'frente', 'noFrente', 'entre'];
  const TIPOS_CUADRO = ['es', 'noEs', 'mismo', 'noMismo'];
  const NEGATIVAS = new Set(['noJuntos', 'noExtremo', 'noLugar', 'noFrente', 'noEs', 'noMismo']);

  function validar(p) {
    if (!p || typeof p !== 'object') throw new Error('falta el problema');
    if (!['lineal', 'circular', 'cuadro'].includes(p.forma)) throw new Error(`forma desconocida: ${p.forma}`);
    if (!Array.isArray(p.personas) || p.personas.length < 2) throw new Error('hacen falta al menos dos personas');
    if (new Set(p.personas).size !== p.personas.length) throw new Error('hay personas repetidas');
    if (p.personas.length > 8) throw new Error('a lo más 8 personas (la fuerza bruta crece como n!)');
    const n = asientosDe(p);
    if (p.forma !== 'cuadro') {
      entero(n, 'el número de asientos', p.personas.length);
      if (n > 8) throw new Error('a lo más 8 asientos');
    } else {
      if (!p.atributos || typeof p.atributos !== 'object' || !Object.keys(p.atributos).length) throw new Error('el cuadro necesita atributos');
      for (const [a, vals] of Object.entries(p.atributos)) {
        if (!Array.isArray(vals) || vals.length !== p.personas.length) throw new Error(`el atributo ${a} debe tener un valor por persona`);
        if (new Set(vals).size !== vals.length) throw new Error(`el atributo ${a} tiene valores repetidos`);
      }
    }
    if (!Array.isArray(p.pistas)) throw new Error('faltan las pistas (puede ser una lista vacía)');
    p.pistas.forEach((q, i) => validarPista(p, q, `pista ${i + 1}`));
    return p;
  }
  function asientosDe(p) { return p.forma === 'cuadro' ? p.personas.length : (p.asientos === undefined ? p.personas.length : p.asientos); }
  function validarPista(p, q, que) {
    if (!q || typeof q !== 'object') throw new Error(`${que}: no es una pista`);
    const tipos = p.forma === 'lineal' ? TIPOS_FILA : p.forma === 'circular' ? TIPOS_MESA : TIPOS_CUADRO;
    if (!tipos.includes(q.tipo)) throw new Error(`${que}: el tipo ${q.tipo} no sirve en la forma ${p.forma}`);
    const per = x => { if (!p.personas.includes(x)) throw new Error(`${que}: no hay nadie llamado ${x}`); };
    const n = asientosDe(p);
    if (p.forma === 'cuadro') {
      const val = (a, v) => { if (!p.atributos[a]) throw new Error(`${que}: no hay atributo ${a}`); if (!p.atributos[a].includes(v)) throw new Error(`${que}: ${v} no es un valor de ${a}`); };
      if (q.tipo === 'es' || q.tipo === 'noEs') { per(q.persona); val(q.atributo, q.valor); }
      else { val(q.atr1, q.val1); val(q.atr2, q.val2); if (q.atr1 === q.atr2) throw new Error(`${que}: los dos valores deben ser de atributos distintos`); }
      return;
    }
    per(q.a);
    if (['izquierda', 'derecha', 'inmIzquierda', 'inmDerecha', 'juntos', 'noJuntos', 'frente', 'noFrente', 'separados', 'entre'].includes(q.tipo)) { per(q.b); if (q.a === q.b) throw new Error(`${que}: la pista compara a alguien consigo mismo`); }
    if (q.tipo === 'entre') { per(q.c); if (q.c === q.a || q.c === q.b) throw new Error(`${que}: «entre» necesita tres personas distintas`); }
    if (q.tipo === 'lugar' || q.tipo === 'noLugar') { entero(q.k, `${que}: la butaca`, 1); if (q.k > n) throw new Error(`${que}: no hay butaca ${q.k}`); }
    if (q.tipo === 'separados') entero(q.k, `${que}: las butacas de en medio`, 0);
    if ((q.tipo === 'frente' || q.tipo === 'noFrente') && n % 2) throw new Error(`${que}: «frente a» necesita un número par de asientos`);
  }

  // ¿Se cumple la pista en un arreglo completo? (lineal y circular: lista de asientos; cuadro: { atributo: [valor por persona] })
  function cumple(p, q, arr) {
    if (p.forma === 'cuadro') {
      if (q.tipo === 'es' || q.tipo === 'noEs') {
        const v = arr[q.atributo][p.personas.indexOf(q.persona)] === q.valor;
        return q.tipo === 'es' ? v : !v;
      }
      const i = arr[q.atr1].indexOf(q.val1), v = arr[q.atr2][i] === q.val2;
      return q.tipo === 'mismo' ? v : !v;
    }
    const n = arr.length, pa = arr.indexOf(q.a), pb = q.b !== undefined ? arr.indexOf(q.b) : -1;
    if (p.forma === 'lineal') {
      switch (q.tipo) {
        case 'izquierda': return pa < pb;
        case 'derecha': return pa > pb;
        case 'inmIzquierda': return pb === pa + 1;
        case 'inmDerecha': return pa === pb + 1;
        case 'juntos': return Math.abs(pa - pb) === 1;
        case 'noJuntos': return Math.abs(pa - pb) !== 1;
        case 'extremo': return pa === 0 || pa === n - 1;
        case 'noExtremo': return pa !== 0 && pa !== n - 1;
        case 'lugar': return pa === q.k - 1;
        case 'noLugar': return pa !== q.k - 1;
        case 'entre': { const pc = arr.indexOf(q.c); return (pb < pa && pa < pc) || (pc < pa && pa < pb); }
        case 'separados': return Math.abs(pa - pb) === q.k + 1;
      }
    }
    const der = i => (i + 1) % n, izq = i => (i - 1 + n) % n;
    switch (q.tipo) {
      case 'inmDerecha': return pa === der(pb);
      case 'inmIzquierda': return pa === izq(pb);
      case 'juntos': return pa === der(pb) || pa === izq(pb);
      case 'noJuntos': return pa !== der(pb) && pa !== izq(pb);
      case 'frente': return pa === (pb + n / 2) % n;
      case 'noFrente': return pa !== (pb + n / 2) % n;
      case 'entre': { const pc = arr.indexOf(q.c); return (pb === der(pa) && pc === izq(pa)) || (pc === der(pa) && pb === izq(pa)); }
    }
    throw new Error(`pista desconocida: ${q.tipo}`);
  }

  // ---------- todos los arreglos ----------
  // En la mesa se guardan todos los giros (para evaluar lo que el alumno coloca donde quiera); 'canonico' deja uno
  // por giro: el que pone a la primera persona en el asiento 1.
  const cacheTodos = new Map();
  function todos(p) {
    const n = asientosDe(p), clave = JSON.stringify([p.forma, p.personas, n, p.atributos || null]);
    if (cacheTodos.has(clave)) return cacheTodos.get(clave);
    let lista;
    if (p.forma === 'cuadro') {
      const ats = Object.keys(p.atributos), perms = ats.map(a => permutaciones(p.atributos[a]));
      lista = [{}];
      ats.forEach((a, j) => { const nueva = []; for (const base of lista) for (const pr of perms[j]) nueva.push(Object.assign({}, base, { [a]: pr })); lista = nueva; });
    } else {
      const base = p.personas.slice(); while (base.length < n) base.push(null);
      lista = permutaciones(base);
    }
    cacheTodos.set(clave, lista);
    return lista;
  }
  function canonico(p, arr) {
    if (p.forma !== 'circular') return arr;
    const k = arr.indexOf(p.personas[0]);
    return girar(arr, -k);
  }
  function girar(arr, k) {
    const n = arr.length; k = ((k % n) + n) % n;
    return arr.map((x, i) => arr[(i - k + n) % n]);
  }
  function clave(p, arr) { return p.forma === 'cuadro' ? JSON.stringify(arr) : canonico(p, arr).map(x => x === null ? '∅' : x).join('|'); }
  function mismoArreglo(p, a, b) { return clave(p, a) === clave(p, b); }

  const cacheSol = new Map();
  function resolver(p) {
    validar(p);
    const k = JSON.stringify(p);
    if (cacheSol.has(k)) return cacheSol.get(k);
    const sol = [];
    for (const arr of todos(p)) {
      if (p.forma === 'circular' && arr[0] !== p.personas[0]) continue;   // un representante por giro
      if (p.pistas.every(q => cumple(p, q, arr))) sol.push(arr);
    }
    const r = { soluciones: sol, total: sol.length, unica: sol.length === 1 };
    cacheSol.set(k, r);
    return r;
  }

  // ---------- lo que el alumno colocó ----------
  function normalizarParcial(p, parcial) {
    if (p.forma === 'cuadro') {
      const out = {};
      for (const a of Object.keys(p.atributos)) {
        const v = (parcial && parcial[a]) || [];
        out[a] = p.personas.map((_, i) => (v[i] === undefined ? null : v[i]));
        out[a].forEach(x => { if (x !== null && !p.atributos[a].includes(x)) throw new Error(`${x} no es un valor de ${a}`); });
        const usados = out[a].filter(x => x !== null); if (new Set(usados).size !== usados.length) throw new Error(`un valor de ${a} está dos veces`);
      }
      return out;
    }
    const n = asientosDe(p);
    if (!Array.isArray(parcial) || parcial.length !== n) throw new Error(`lo colocado debe ser una lista de ${n} asientos`);
    const usados = parcial.filter(x => x !== null && x !== undefined);
    usados.forEach(x => { if (!p.personas.includes(x)) throw new Error(`no hay nadie llamado ${x}`); });
    if (new Set(usados).size !== usados.length) throw new Error('una persona está en dos asientos');
    return parcial.map(x => (x === undefined ? null : x));
  }
  function completa(p, parcial, arr) {
    if (p.forma === 'cuadro') return Object.keys(parcial).every(a => parcial[a].every((v, i) => v === null || arr[a][i] === v));
    // un asiento vacío de lo colocado puede quedar con alguien o vacío; uno ocupado debe coincidir
    return parcial.every((x, i) => x === null || arr[i] === x);
  }
  function evaluar(p, parcial) {
    validar(p);
    const P = normalizarParcial(p, parcial), comp = todos(p).filter(arr => completa(p, P, arr));
    const estados = p.pistas.map(q => {
      let si = 0; for (const arr of comp) if (cumple(p, q, arr)) si++;
      return si === comp.length ? 'cumple' : si === 0 ? 'falla' : 'pendiente';
    });
    const sols = comp.filter(arr => p.pistas.every(q => cumple(p, q, arr)));
    const lleno = p.forma === 'cuadro' ? Object.values(P).every(v => v.every(x => x !== null)) : P.filter(x => x !== null).length === p.personas.length;
    // En la mesa, las soluciones posibles se cuentan sin repetir giros.
    const distintas = new Set(sols.map(a => clave(p, a))).size;
    return { estados, cumplen: estados.filter(e => e === 'cumple').length, fallan: estados.filter(e => e === 'falla').length,
      completo: lleno, esSolucion: lleno && sols.length > 0, posibles: distintas, clave: lleno && sols.length ? clave(p, sols[0]) : null };
  }

  // ---------- qué puede ir en cada lugar ----------
  function posibles(p) {
    const R = resolver(p);
    if (p.forma === 'cuadro') {
      const out = {};
      for (const a of Object.keys(p.atributos)) out[a] = p.personas.map((_, i) => p.atributos[a].filter(v => R.soluciones.some(s => s[a][i] === v)));
      return { total: R.total, casillas: out, seguros: Object.fromEntries(Object.entries(out).map(([a, f]) => [a, f.map(vs => (vs.length === 1 ? vs[0] : null))])) };
    }
    const n = asientosDe(p), por = [];
    for (let i = 0; i < n; i++) { const vs = []; for (const s of R.soluciones) { const x = s[i]; if (!vs.includes(x)) vs.push(x); } por.push(vs); }
    // seguros: quién va con seguridad en cada asiento (null si puede ir más de uno)
    return { total: R.total, asientos: por, seguros: por.map(vs => (vs.length === 1 ? vs[0] : null)) };
  }

  // ---------- variantes: el mismo problema leído con un error ----------
  const INMEDIATA = { izquierda: 'inmIzquierda', derecha: 'inmDerecha' };
  const ESPEJO = { izquierda: 'derecha', derecha: 'izquierda', inmIzquierda: 'inmDerecha', inmDerecha: 'inmIzquierda' };
  function variante(p, cual) {
    const q = Object.assign({}, p, { pistas: p.pistas.map(x => Object.assign({}, x)) });
    if (cual === 'inmediata') q.pistas.forEach(x => { if (INMEDIATA[x.tipo]) x.tipo = INMEDIATA[x.tipo]; });
    else if (cual === 'sentidoInvertido') q.pistas.forEach(x => { if (ESPEJO[x.tipo]) x.tipo = ESPEJO[x.tipo]; });
    else if (cual === 'olvidaNegativa') q.pistas = q.pistas.filter(x => !NEGATIVAS.has(x.tipo));
    else if (cual === 'sinCruce') q.pistas = q.pistas.filter(x => x.tipo !== 'mismo' && x.tipo !== 'noMismo');
    else if (cual === 'sinDireccion') q.pistas = q.pistas.filter(x => !ESPEJO[x.tipo]);
    else if (cual === 'leeSinNo') q.pistas.forEach(x => { if (NEGATIVAS.has(x.tipo)) x.tipo = SIN_NO[x.tipo]; });
    else throw new Error(`variante desconocida: ${cual}`);
    return q;
  }
  const SIN_NO = { noJuntos: 'juntos', noExtremo: 'extremo', noLugar: 'lugar', noFrente: 'frente', noEs: 'es', noMismo: 'mismo' };
  const VARIANTES = ['inmediata', 'olvidaNegativa', 'leeSinNo', 'sentidoInvertido', 'sinDireccion', 'sinCruce'];
  function cambia(p, cual) { return JSON.stringify(variante(p, cual).pistas) !== JSON.stringify(p.pistas); }

  // ---------- preguntas ----------
  function respuesta(p, s, q) {
    switch (q.tipo) {
      case 'lugar': return s[q.k - 1];
      case 'derechaDe': { const i = s.indexOf(q.de), n = s.length; return p.forma === 'circular' ? s[(i + 1) % n] : (i + 1 < n ? s[i + 1] : null); }
      case 'izquierdaDe': { const i = s.indexOf(q.de), n = s.length; return p.forma === 'circular' ? s[(i - 1 + n) % n] : (i > 0 ? s[i - 1] : null); }
      case 'frenteA': { const i = s.indexOf(q.de), n = s.length; return s[(i + n / 2) % n]; }
      case 'valor': return s[q.atributo][p.personas.indexOf(q.persona)];
      case 'quienTiene': return p.personas[s[q.atributo].indexOf(q.valor)];
      case 'lugarDe': return s.indexOf(q.de) + 1;
    }
    throw new Error(`pregunta desconocida: ${q.tipo}`);
  }
  function posiblesRespuestas(p, q) {
    const R = resolver(p), vs = [];
    for (const s of R.soluciones) { const v = respuesta(p, s, q); if (!vs.includes(v)) vs.push(v); }
    return vs;
  }
  // La respuesta y, para cada lectura con error, la primera respuesta posible distinta de la correcta (la que daría
  // quien arma un solo arreglo con esa lectura y responde con él).
  function quien(p, q) {
    const vs = posiblesRespuestas(p, q), unica = vs.length === 1, correcta = unica ? vs[0] : null, e = {}, todas = {};
    for (const c of VARIANTES) {
      if (!cambia(p, c)) continue;
      const otras = posiblesRespuestas(variante(p, c), q).filter(v => v !== correcta);
      if (otras.length) { e[c] = otras[0]; todas[c] = otras; }
    }
    return { respuesta: correcta, posibles: vs, unica, soluciones: resolver(p).total, errores: unica ? limpiarErrores(e, correcta) : {},
      // todas las respuestas que da cada lectura con error (sin la correcta)
      otras: unica ? todas : {} };
  }
  // ¿Cuál de las afirmaciones es necesariamente cierta? Cada una: 'siempre', 'aveces' (posible) o 'nunca'.
  function estadoAfirmacion(p, a) {
    validarPista(p, a, 'afirmación');
    const R = resolver(p); let si = 0;
    for (const s of R.soluciones) if (cumple(p, a, s)) si++;
    return { estado: R.total === 0 ? 'sinSolucion' : si === R.total ? 'siempre' : si === 0 ? 'nunca' : 'aveces', en: si, de: R.total };
  }
  function necesario(p, afirmaciones) {
    if (!Array.isArray(afirmaciones) || afirmaciones.length < 2) throw new Error('hacen falta al menos dos afirmaciones');
    const est = afirmaciones.map(a => estadoAfirmacion(p, a));
    const siempre = est.map((x, i) => (x.estado === 'siempre' ? i : -1)).filter(i => i >= 0);
    if (siempre.length !== 1) throw new Error(`debe haber exactamente una afirmación necesaria y hay ${siempre.length}`);
    const ok = siempre[0], e = {};
    const aveces = est.map((x, i) => (x.estado === 'aveces' ? i : -1)).filter(i => i >= 0);
    if (aveces.length) e.posibleComoSeguro = aveces[0];
    for (const c of VARIANTES) {
      if (!cambia(p, c)) continue;
      const v = variante(p, c); if (!resolver(v).total) continue;
      const j = afirmaciones.findIndex((a, i) => i !== ok && estadoAfirmacion(v, a).estado === 'siempre');
      if (j >= 0) e[c] = j;
    }
    const errores = limpiarErrores(e, ok);
    // el error que explica cada opción incorrecta: 'posibleComoSeguro' si es cierta solo a veces; si no, la lectura con
    // error que la vuelve necesaria; 'nunca' si ninguna lectura la explica
    const errorDe = afirmaciones.map((_, i) => i === ok ? null : est[i].estado === 'aveces' ? 'posibleComoSeguro'
      : (Object.keys(errores).find(k => k !== 'posibleComoSeguro' && errores[k] === i) || 'nunca'));
    return { respuesta: ok, estados: est.map(x => x.estado), en: est.map(x => x.en), total: resolver(p).total, aveces, errores, errorDe };
  }
  // ¿En qué butacas puede sentarse esta persona? (respuesta: lista de números de butaca, de menor a mayor)
  function lugaresDe(p, persona) {
    if (p.forma === 'cuadro') throw new Error('en el cuadro no hay butacas');
    if (!p.personas.includes(persona)) throw new Error(`no hay nadie llamado ${persona}`);
    const lug = q => [...new Set(resolver(q).soluciones.map(s => s.indexOf(persona) + 1))].sort((a, b) => a - b);
    const ok = lug(p), e = {};
    for (const c of VARIANTES) { if (!cambia(p, c)) continue; const v = variante(p, c); if (resolver(v).total) e[c] = lug(v); }
    const out = {};
    for (const [k, v] of Object.entries(e)) if (v.join(',') !== ok.join(',')) out[k] = v;
    return { respuesta: ok, total: resolver(p).total, errores: out };
  }
  // Las pistas aplicadas una por una (en el orden dado): qué queda posible después de cada una. Sirve para animar la
  // deducción: cada pista tacha posibilidades.
  function pasos(p, orden) {
    validar(p);
    orden = orden || p.pistas.map((_, i) => i);
    orden.forEach(i => { entero(i, 'la pista', 0); if (i >= p.pistas.length) throw new Error(`no hay pista ${i + 1}`); });
    const out = [];
    for (let k = 0; k <= orden.length; k++) {
      const q = Object.assign({}, p, { pistas: orden.slice(0, k).map(i => p.pistas[i]) }), P = posibles(q);
      out.push(Object.assign({ usadas: orden.slice(0, k) }, P));
    }
    return out;
  }
  function sinPista(p, i) {
    entero(i, 'la pista', 0); if (i >= p.pistas.length) throw new Error(`no hay pista ${i + 1}`);
    const q = Object.assign({}, p, { pistas: p.pistas.filter((_, j) => j !== i) }), total = resolver(q).total;
    const e = { comoSiSobrara: resolver(p).total, todasLasPermutaciones: resolver(Object.assign({}, p, { pistas: [] })).total };
    for (const c of ['inmediata', 'olvidaNegativa']) if (cambia(q, c)) e[c] = resolver(variante(q, c)).total;
    return { total, conTodas: resolver(p).total, soluciones: resolver(q).soluciones, errores: limpiarErrores(e, total) };
  }
  function analizar(p) {
    const R = resolver(p);
    const porPista = p.pistas.map((_, i) => { const t = resolver(Object.assign({}, p, { pistas: p.pistas.filter((__, j) => j !== i) })).total; return { sin: t, sobra: R.total > 0 && t === R.total }; });
    const out = { total: R.total, unica: R.unica, contradiccion: R.total === 0, falta: R.total > 1, porPista,
      sobran: porPista.map((x, i) => (x.sobra ? i : -1)).filter(i => i >= 0) };
    if (R.total === 0) out.culpables = porPista.map((x, i) => (x.sin > 0 ? i : -1)).filter(i => i >= 0);
    return out;
  }
  // La pista que sobra: la única que se puede quitar sin que cambien las soluciones. Los errores son pistas necesarias.
  function pistaQueSobra(p) {
    const A = analizar(p);
    if (A.sobran.length !== 1) throw new Error(`debe sobrar exactamente una pista y sobran ${A.sobran.length}`);
    const ok = A.sobran[0], e = {};
    const neg = p.pistas.findIndex((q, i) => i !== ok && NEGATIVAS.has(q.tipo)); if (neg >= 0) e.negativaNoRestringe = neg;
    const dir = p.pistas.findIndex((q, i) => i !== ok && INMEDIATA[q.tipo]); if (dir >= 0) e.direccionSinJunto = dir;
    return { respuesta: ok, total: A.total, sin: A.porPista.map(x => x.sin), errores: limpiarErrores(e, ok) };
  }
  function probarPista(p, pista) {
    validarPista(p, pista, 'la pista nueva');
    const antes = resolver(p).total, q = Object.assign({}, p, { pistas: p.pistas.concat([pista]) }), t = resolver(q).total;
    return { antes, despues: t, efecto: t === 0 ? 'contradice' : t === antes ? 'sobra' : t === 1 ? 'unica' : 'reduce', unica: t === 1 };
  }
  // Sin pistas: de cuántas maneras se sientan n personas. En la mesa, los giros son el mismo arreglo.
  function maneras(forma, n) {
    entero(n, 'n', 2); if (n > 8) throw new Error('a lo más 8 personas');
    if (forma !== 'lineal' && forma !== 'circular') throw new Error(`forma desconocida: ${forma}`);
    const personas = Array.from({ length: n }, (_, i) => 'P' + (i + 1));
    const total = resolver({ forma, personas, pistas: [] }).total;
    const e = forma === 'circular' ? { rotacionesDistintas: fact(n), tambienReflejos: n >= 3 ? fact(n - 1) / 2 : null, sinFactorial: n - 1 }
      : { comoMesa: fact(n - 1), sinFactorial: n, soloPares: n * (n - 1) };
    return { total, formula: forma === 'circular' ? fact(n - 1) : fact(n), errores: limpiarErrores(e, total) };
  }
  // Los asientos de una mesa redonda, en coordenadas de un círculo de radio 1 (y hacia abajo, como en la pantalla):
  // el asiento 1 abajo y los siguientes en sentido antihorario visto desde arriba (hacia la derecha de quien se sienta).
  function asientosMesa(n) {
    entero(n, 'n', 2);
    return Array.from({ length: n }, (_, k) => { const a = 2 * Math.PI * k / n; return { x: Math.sin(a), y: Math.cos(a), angulo: a }; });
  }

  // ---------- texto de las pistas ----------
  function textoPista(q, p) {
    const forma = p ? p.forma : 'lineal', lugar = forma === 'circular' ? 'asiento' : 'butaca';
    switch (q.tipo) {
      case 'izquierda': return `${q.a} está a la izquierda de ${q.b}`;
      case 'derecha': return `${q.a} está a la derecha de ${q.b}`;
      case 'inmIzquierda': return `${q.a} está inmediatamente a la izquierda de ${q.b}`;
      case 'inmDerecha': return `${q.a} está inmediatamente a la derecha de ${q.b}`;
      case 'juntos': return `${q.a} se sienta junto a ${q.b}`;
      case 'noJuntos': return `${q.a} no se sienta junto a ${q.b}`;
      case 'extremo': return `${q.a} se sienta en un extremo`;
      case 'noExtremo': return `${q.a} no se sienta en ningún extremo`;
      case 'lugar': return `${q.a} se sienta en la ${lugar} ${q.k}`;
      case 'noLugar': return `${q.a} no se sienta en la ${lugar} ${q.k}`;
      case 'entre': return forma === 'circular' ? `${q.a} se sienta entre ${q.b} y ${q.c}` : `${q.a} se sienta en algún lugar entre ${q.b} y ${q.c}`;
      case 'separados': return q.k === 0 ? `${q.a} se sienta junto a ${q.b}` : `Entre ${q.a} y ${q.b} hay ${q.k} ${q.k === 1 ? 'persona' : 'personas'}`;
      case 'frente': return `${q.a} se sienta frente a ${q.b}`;
      case 'noFrente': return `${q.a} no se sienta frente a ${q.b}`;
      case 'es': return `${q.persona} ${frase(p, q.atributo, q.valor)}`;
      case 'noEs': return `${q.persona} no ${frase(p, q.atributo, q.valor)}`;
      case 'mismo': return `Quien ${frase(p, q.atr1, q.val1)} ${frase(p, q.atr2, q.val2)}`;
      case 'noMismo': return `Quien ${frase(p, q.atr1, q.val1)} no ${frase(p, q.atr2, q.val2)}`;
    }
    throw new Error(`pista desconocida: ${q.tipo}`);
  }
  function frase(p, a, v) { const f = p && p.frases && p.frases[a]; return f ? f.replace('{v}', v) : `es ${v}`; }

  // ================= Verdades y mentiras =================
  // Estado oculto: quién es el culpable (si el problema tiene culpables) y quiénes mienten. Una persona que miente dice
  // una frase falsa; una que dice la verdad, una verdadera. Se prueban todos los estados.
  function validarVerdades(p) {
    if (!p || !Array.isArray(p.personas) || p.personas.length < 2) throw new Error('hacen falta al menos dos personas');
    if (new Set(p.personas).size !== p.personas.length) throw new Error('hay personas repetidas');
    if (!Array.isArray(p.frases) || !p.frases.length) throw new Error('faltan las frases');
    const dicen = p.frases.map(f => f.de);
    dicen.forEach(x => { if (!p.personas.includes(x)) throw new Error(`no hay nadie llamado ${x}`); });
    if (new Set(dicen).size !== dicen.length) throw new Error('cada persona dice una sola frase');
    if (p.culpables !== null && p.culpables !== undefined) p.culpables.forEach(x => { if (!p.personas.includes(x)) throw new Error(`no hay nadie llamado ${x}`); });
    if (p.mienten !== 'libre') { if (!p.mienten || p.mienten.exactamente === undefined) throw new Error("falta cuántos mienten ({ exactamente: k } o 'libre')"); entero(p.mienten.exactamente, 'los que mienten', 0); }
    p.frases.forEach((f, i) => validarProp(p, f.dice, `frase ${i + 1}`));
    return p;
  }
  function validarProp(p, x, que) {
    if (!x || typeof x !== 'object') throw new Error(`${que}: no es una afirmación`);
    const per = y => { if (!p.personas.includes(y)) throw new Error(`${que}: no hay nadie llamado ${y}`); };
    switch (x.tipo) {
      case 'culpable': case 'noCulpable': if (!culpablesDe(p)[0]) throw new Error(`${que}: este problema no tiene culpable`); per(x.x); return;
      case 'miente': case 'veraz': per(x.x); return;
      case 'no': validarProp(p, x.p, que); return;
      case 'y': case 'o': if (!Array.isArray(x.p) || x.p.length < 2) throw new Error(`${que}: «${x.tipo}» necesita dos afirmaciones`); x.p.forEach(z => validarProp(p, z, que)); return;
      case 'cuantosMienten': entero(x.k, `${que}: cuántos mienten`, 0); return;
    }
    throw new Error(`${que}: afirmación desconocida: ${x.tipo}`);
  }
  const culpablesDe = p => (p.culpables === null ? [null] : (p.culpables || p.personas));
  function valor(x, culpable, M) {
    switch (x.tipo) {
      case 'culpable': return culpable === x.x;
      case 'noCulpable': return culpable !== x.x;
      case 'miente': return M.has(x.x);
      case 'veraz': return !M.has(x.x);
      case 'no': return !valor(x.p, culpable, M);
      case 'y': return x.p.every(z => valor(z, culpable, M));
      case 'o': return x.p.some(z => valor(z, culpable, M));
      case 'cuantosMienten': return M.size === x.k;
    }
    throw new Error(`afirmación desconocida: ${x.tipo}`);
  }
  // Los conjuntos de mentirosos posibles: solo quienes hablan pueden mentir.
  function conjuntos(p) {
    const hablan = p.frases.map(f => f.de), out = [];
    for (let m = 0; m < (1 << hablan.length); m++) {
      const S = hablan.filter((_, i) => m & (1 << i));
      if (p.mienten !== 'libre' && S.length !== p.mienten.exactamente) continue;
      out.push(S);
    }
    return out;
  }
  function consistente(p, culpable, S) {
    const M = new Set(S);
    return p.frases.every(f => valor(f.dice, culpable, M) === !M.has(f.de));
  }
  function textoProp(x) {
    switch (x.tipo) {
      case 'culpable': return `Fue ${x.x}`;
      case 'noCulpable': return `No fue ${x.x}`;
      case 'miente': return `${x.x} miente`;
      case 'veraz': return `${x.x} dice la verdad`;
      case 'no': return `No es cierto que ${textoProp(x.p).replace(/^./, c => c.toLowerCase())}`;
      case 'y': return x.p.map(textoProp).join(' y ');
      case 'o': return x.p.map(textoProp).join(' o ');
      case 'cuantosMienten': return x.k === 1 ? 'Aquí miente exactamente uno' : `Aquí mienten exactamente ${x.k}`;
    }
    return '';
  }
  // En primera persona, para el globo de quien habla («Fui yo», «Yo no fui»).
  function textoFrase(f) {
    const x = f.dice;
    if (x.tipo === 'culpable' && x.x === f.de) return 'Fui yo';
    if (x.tipo === 'noCulpable' && x.x === f.de) return 'Yo no fui';
    return textoProp(x);
  }
  function verdades(p) {
    validarVerdades(p);
    const sol = [];
    for (const S of conjuntos(p)) for (const c of culpablesDe(p)) if (consistente(p, c, S)) sol.push({ culpable: c, mentirosos: S });
    const culp = [...new Set(sol.map(s => s.culpable))], ment = [...new Set(sol.map(s => s.mentirosos.join('|')))];
    const out = { soluciones: sol, total: sol.length, unica: sol.length === 1, culpable: culp.length === 1 ? culp[0] : undefined,
      mentirosos: ment.length === 1 ? (ment[0] ? ment[0].split('|') : []) : undefined, pares: paresContradictorios(p), textos: p.frases.map(textoFrase) };
    // Errores para «¿quién miente?» (con un solo mentiroso) y «¿quién es el culpable?»
    if (out.unica) {
      const s = sol[0], L = s.mentirosos;
      if (L.length === 1) {
        const m = L[0], e = {};
        if (s.culpable) e.culpableEsMentiroso = s.culpable;
        const par = out.pares.find(([i, j]) => p.frases[i].de === m || p.frases[j].de === m);
        if (par) e.otroDelPar = p.frases[par[0]].de === m ? p.frases[par[1]].de : p.frases[par[0]].de;
        const acus = p.frases.find(f => f.dice.tipo === 'culpable' && f.dice.x !== f.de && f.dice.x !== m && f.dice.x !== s.culpable);
        if (acus) e.acusadoMiente = acus.dice.x;
        // quien niega haberlo hecho («Yo no fui») parece sospechoso
        const niega = p.frases.find(f => f.dice.tipo === 'noCulpable' && f.dice.x === f.de && f.de !== m);
        if (niega) e.desconfiaDelQueNiega = niega.de;
        out.erroresMiente = limpiarErrores(e, m);
      }
      if (s.culpable) {
        const e = {};
        if (L.length) e.mentirosoEsCulpable = L[0];
        const fm = p.frases.find(f => L.includes(f.de) && f.dice.tipo === 'culpable'); if (fm) e.creeAlMentiroso = fm.dice.x;
        const conf = p.frases.find(f => f.dice.tipo === 'culpable' && f.dice.x === f.de); if (conf) e.creeAlQueConfiesa = conf.de;
        out.erroresCulpable = limpiarErrores(e, s.culpable);
      }
    }
    return out;
  }
  // Dos frases se contradicen si, cuando cada una dice la verdad o miente según su autor, siempre exactamente uno de los
  // dos miente: no pueden ser verdad a la vez ni mentira a la vez.
  function paresContradictorios(p) {
    const out = [], todosS = (() => { const hablan = p.frases.map(f => f.de), o = []; for (let m = 0; m < (1 << hablan.length); m++) o.push(hablan.filter((_, i) => m & (1 << i))); return o; })();
    for (let i = 0; i < p.frases.length; i++) for (let j = i + 1; j < p.frases.length; j++) {
      let alguno = false, siempre = true;
      for (const S of todosS) for (const c of culpablesDe(p)) {
        const M = new Set(S), fi = p.frases[i], fj = p.frases[j];
        if (valor(fi.dice, c, M) !== !M.has(fi.de) || valor(fj.dice, c, M) !== !M.has(fj.de)) continue;
        alguno = true; if (M.has(fi.de) === M.has(fj.de)) siempre = false;
      }
      if (alguno && siempre) out.push([i, j]);
    }
    return out;
  }
  // Supón que mienten estas personas (y nadie más): qué culpables quedan y qué frases chocan.
  function hipotesis(p, mentirosos) {
    validarVerdades(p);
    if (!Array.isArray(mentirosos)) throw new Error('los mentirosos van en una lista');
    mentirosos.forEach(x => { if (!p.frases.some(f => f.de === x)) throw new Error(`${x} no dice nada: no puede mentir`); });
    const M = new Set(mentirosos), C = culpablesDe(p);
    const requiere = p.frases.map(f => !M.has(f.de));   // la frase de quien dice la verdad debe ser verdadera
    const vale = (i, c) => valor(p.frases[i].dice, c, M) === requiere[i];
    const culpables = C.filter(c => p.frases.every((_, i) => vale(i, c)));
    const cuentaOk = p.mienten === 'libre' || M.size === p.mienten.exactamente;
    const choques = [];
    if (!culpables.length) {
      p.frases.forEach((_, i) => { if (!C.some(c => vale(i, c))) choques.push([i]); });
      if (!choques.length) for (let i = 0; i < p.frases.length; i++) for (let j = i + 1; j < p.frases.length; j++) if (!C.some(c => vale(i, c) && vale(j, c))) choques.push([i, j]);
      if (!choques.length) choques.push(p.frases.map((_, i) => i));
    }
    return { consistente: culpables.length > 0 && cuentaOk, cuentaOk, culpables: culpables.filter(c => c !== null), requiere,
      // con el culpable que queda (si queda uno solo), qué valor tiene cada frase
      valores: culpables.length === 1 ? p.frases.map(f => valor(f.dice, culpables[0], M)) : null, choques };
  }

  // ================= Certezas =================
  // ¿Cuántos objetos hay que sacar, sin ver, para estar SEGURO de lograr el objetivo? Se piensa en el peor caso: la
  // mala suerte saca primero todo lo que no sirve.
  function certeza(o) {
    if (!o || !o.urna || typeof o.urna !== 'object') throw new Error('falta la urna');
    const colores = Object.keys(o.urna); if (colores.length < 2) throw new Error('hacen falta al menos dos colores');
    colores.forEach(c => entero(o.urna[c], `las de color ${c}`, 1));
    const cnt = colores.map(c => o.urna[c]), total = cnt.reduce((s, x) => s + x, 0), ob = o.objetivo || {};
    let n, sec = [], e = {};
    if (ob.tipo === 'mismoColor') {
      const k = entero(ob.k, 'k', 2);
      if (!cnt.some(x => x >= k)) throw new Error(`ningún color tiene ${k}: no se puede lograr`);
      n = cnt.reduce((s, x) => s + Math.min(x, k - 1), 0) + 1;
      // peor caso: vueltas de uno de cada color hasta tener k − 1 de cada uno (o todas las que haya)
      const lleva = colores.map(() => 0);
      for (let v = 0; v < k - 1; v++) colores.forEach((c, i) => { if (lleva[i] < Math.min(cnt[i], k - 1)) { lleva[i]++; sec.push(c); } });
      sec.push(colores[cnt.findIndex(x => x >= k)]);
      e = { mejorCaso: k, sinMasUno: n - 1, porColores: k * colores.length, masAbundante: Math.max(...cnt) + 1 };
    } else if (ob.tipo === 'deColor') {
      const k = entero(ob.k, 'k', 1), i = colores.indexOf(ob.color);
      if (i < 0) throw new Error(`no hay color ${ob.color}`);
      if (cnt[i] < k) throw new Error(`solo hay ${cnt[i]} de color ${ob.color}`);
      const otros = total - cnt[i]; n = otros + k;
      colores.forEach((c, j) => { if (j !== i) for (let z = 0; z < cnt[j]; z++) sec.push(c); });
      for (let z = 0; z < k; z++) sec.push(ob.color);
      e = { mejorCaso: k, sinMasUno: n - 1, soloUnOtro: Math.max(...cnt.filter((_, j) => j !== i)) + k,
        confundeMismoColor: cnt.reduce((s, x) => s + Math.min(x, k - 1), 0) + 1 };
    } else if (ob.tipo === 'unoDeCada') {
      const mn = Math.min(...cnt), im = cnt.indexOf(mn); n = total - mn + 1;
      colores.forEach((c, j) => { if (j !== im) for (let z = 0; z < cnt[j]; z++) sec.push(c); });
      sec.push(colores[im]);
      e = { mejorCaso: colores.length, sinMasUno: n - 1, soloElMayor: Math.max(...cnt) + 1 };
    } else if (ob.tipo === 'distintos') {
      const mx = Math.max(...cnt), im = cnt.indexOf(mx); n = mx + 1;
      for (let z = 0; z < mx; z++) sec.push(colores[im]);
      sec.push(colores.find((_, j) => j !== im));
      e = { mejorCaso: 2, sinMasUno: n - 1, comoMismoColor: colores.length + 1 };
    } else throw new Error(`objetivo desconocido: ${ob.tipo}`);
    return { n, total, secuencia: sec, mejorCaso: e.mejorCaso, errores: limpiarErrores(e, n) };
  }
  // ¿Logra el objetivo cualquier extracción de m objetos? (para comprobar el peor caso por fuerza bruta)
  function logra(o, sacadas) {
    const ob = o.objetivo, colores = Object.keys(o.urna), v = colores.map(c => sacadas[c] || 0);
    if (ob.tipo === 'mismoColor') return v.some(x => x >= ob.k);
    if (ob.tipo === 'deColor') return (sacadas[ob.color] || 0) >= ob.k;
    if (ob.tipo === 'unoDeCada') return v.every(x => x >= 1);
    if (ob.tipo === 'distintos') return v.filter(x => x >= 1).length >= 2;
    throw new Error(`objetivo desconocido: ${ob.tipo}`);
  }
  // n llaves y n candados mezclados: en el peor caso, el primer candado necesita n − 1 intentos (si ninguna de las
  // n − 1 primeras abre, la última es la buena), el segundo n − 2, … : (n − 1) + (n − 2) + … + 1 = n(n − 1)/2.
  function llaves(n) {
    entero(n, 'n', 2);
    const porCandado = Array.from({ length: n - 1 }, (_, i) => n - 1 - i), intentos = n * (n - 1) / 2;
    return { intentos, porCandado, errores: limpiarErrores({ sinDescontar: n * (n - 1), nCuadrado: n * n, hastaN: n * (n + 1) / 2, mejorCaso: n - 1 }, intentos) };
  }

  return { resolver, evaluar, cumple, posibles, pasos, quien, necesario, estadoAfirmacion, lugaresDe, sinPista, analizar, pistaQueSobra, probarPista, variante, maneras,
    asientosMesa, girar, mismoArreglo, clave, textoPista, verdades, hipotesis, textoFrase, textoProp, certeza, logra, llaves,
    fact, permutaciones, NEGATIVAS: [...NEGATIVAS], TIPOS_FILA, TIPOS_MESA, TIPOS_CUADRO };
});
