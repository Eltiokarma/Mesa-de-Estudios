// Pruebas del motor de «El tablero de las pistas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con problemas al azar (semilla fija): el conteo de soluciones coincide con una fuerza bruta escrita
//    aparte (sin usar las funciones del motor); la mesa redonda no cambia al girar; lo colocado a medias es coherente;
//    verdades y mentiras contra otra fuerza bruta; las certezas contra todas las extracciones posibles; y NINGÚN error
//    típico da la respuesta correcta (no puede ser una opción incorrecta).
// 3. Cada acertijo de la escena tiene UNA sola respuesta, comprobada por fuerza bruta, y sus opciones son distintas.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...JSON.parse(JSON.stringify(args)));
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  if (!Object.keys(espera).length) { assert.equal(r, true, `${que}: se esperaba true`); return r; }
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    assert.deepEqual(x, v, `${que} · ${k}`);
  }
  return r;
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'orden-informacion');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const elige = xs => xs[ent(0, xs.length - 1)];
const GENTE = ['Flor', 'Gael', 'Hugo', 'Iris', 'Juan', 'Kai'];
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function sinErrorCorrecto(errores, correcto, que) {
  assert.ok(errores && typeof errores === 'object', `${que}: falta errores`);
  for (const [k, v] of Object.entries(errores)) assert.ok(!igual(v, correcto), `${que}: el error ${k} da la respuesta correcta (${JSON.stringify(v)})`);
}

// Fuerza bruta escrita aparte: permutaciones propias y el significado de cada pista vuelto a escribir.
function perms(xs) { if (xs.length <= 1) return [xs.slice()]; const out = []; xs.forEach((x, i) => { for (const r of perms(xs.slice(0, i).concat(xs.slice(i + 1)))) out.push([x].concat(r)); }); return out; }
function vale(forma, q, arr) {
  const n = arr.length, i = arr.indexOf(q.a), j = arr.indexOf(q.b), d = forma === 'lineal' ? j - i : null;
  const sig = x => (x + 1) % n, ant = x => (x + n - 1) % n;
  if (forma === 'lineal') return ({
    izquierda: i < j, derecha: i > j, inmIzquierda: d === 1, inmDerecha: d === -1, juntos: Math.abs(d) === 1, noJuntos: Math.abs(d) !== 1,
    extremo: i === 0 || i === n - 1, noExtremo: i > 0 && i < n - 1, lugar: i + 1 === q.k, noLugar: i + 1 !== q.k })[q.tipo];
  return ({ inmDerecha: i === sig(j), inmIzquierda: i === ant(j), juntos: i === sig(j) || i === ant(j), noJuntos: i !== sig(j) && i !== ant(j),
    frente: i === (j + n / 2) % n, noFrente: i !== (j + n / 2) % n })[q.tipo];
}
function contarAparte(p) {
  let c = 0;
  for (const arr of perms(p.personas)) {
    if (p.forma === 'circular' && arr[0] !== p.personas[0]) continue;
    if (p.pistas.every(q => vale(p.forma, q, arr))) c++;
  }
  return c;
}
function pistaAlAzar(forma, gente, n) {
  const a = elige(gente); let b = elige(gente); while (b === a) b = elige(gente);
  const tipos = forma === 'lineal' ? ['izquierda', 'derecha', 'inmIzquierda', 'inmDerecha', 'juntos', 'noJuntos', 'extremo', 'noExtremo', 'lugar', 'noLugar']
    : ['inmDerecha', 'inmIzquierda', 'juntos', 'noJuntos'].concat(n % 2 ? [] : ['frente', 'noFrente']);
  const tipo = elige(tipos), q = { tipo, a };
  if (!['extremo', 'noExtremo', 'lugar', 'noLugar'].includes(tipo)) q.b = b;
  if (tipo === 'lugar' || tipo === 'noLugar') q.k = ent(1, n);
  return q;
}
function problemaAlAzar(forma) {
  const n = ent(3, forma === 'circular' ? 6 : 5), gente = GENTE.slice(0, n), m = ent(1, 4);
  return { forma, personas: gente, pistas: Array.from({ length: m }, () => pistaAlAzar(forma, gente, n)) };
}

test('fila y mesa: el número de soluciones coincide con una fuerza bruta escrita aparte', () => {
  for (let k = 0; k < 500; k++) {
    const p = problemaAlAzar(k % 2 ? 'circular' : 'lineal');
    assert.equal(motor.resolver(p).total, contarAparte(p), JSON.stringify(p));
  }
  // sin pistas: n! en fila y (n − 1)! en la mesa
  for (let n = 2; n <= 7; n++) {
    assert.equal(motor.maneras('lineal', n).total, motor.fact(n));
    assert.equal(motor.maneras('circular', n).total, motor.fact(n - 1));
    sinErrorCorrecto(motor.maneras('circular', n).errores, motor.fact(n - 1), `mesa de ${n}`);
    sinErrorCorrecto(motor.maneras('lineal', n).errores, motor.fact(n), `fila de ${n}`);
  }
});
test('mesa redonda: girar a todos no cambia ninguna pista ni la solución', () => {
  for (let k = 0; k < 200; k++) {
    const p = problemaAlAzar('circular'), n = p.personas.length, arr = perms(p.personas)[ent(0, motor.fact(n) - 1)];
    const giro = ent(1, n - 1), arr2 = motor.girar(arr, giro);
    for (const q of p.pistas) assert.equal(motor.cumple(p, q, arr), motor.cumple(p, q, arr2), `${JSON.stringify(q)} con giro ${giro}`);
    assert.ok(motor.mismoArreglo(p, arr, arr2));
    assert.deepEqual(motor.evaluar(p, arr).estados, motor.evaluar(p, arr2).estados);
    assert.equal(motor.evaluar(p, arr).clave, motor.evaluar(p, arr2).clave);
  }
  // la derecha de quien se sienta es el asiento siguiente (antihorario visto desde arriba, con y hacia abajo)
  const A = motor.asientosMesa(4);
  assert.ok(Math.abs(A[0].x) < 1e-12 && A[0].y > 0.99, 'el asiento 1 va abajo');
  assert.ok(A[1].x > 0.99, 'el asiento 2 va a la derecha de quien está abajo mirando al centro');
});
test('lo colocado a medias: cumple y falla son definitivos; un arreglo completo que cumple todo es solución', () => {
  for (let k = 0; k < 300; k++) {
    const p = problemaAlAzar(k % 3 ? 'lineal' : 'circular'), n = p.personas.length, arr = perms(p.personas)[ent(0, motor.fact(n) - 1)];
    const lleno = motor.evaluar(p, arr);
    lleno.estados.forEach((e, i) => assert.equal(e, motor.cumple(p, p.pistas[i], arr) ? 'cumple' : 'falla'));
    assert.equal(lleno.esSolucion, p.pistas.every(q => motor.cumple(p, q, arr)));
    // quitar personas solo puede volver 'pendiente' lo que era 'cumple' o 'falla', nunca cambiarlo al contrario
    const medio = arr.map(x => (rnd() < 0.5 ? null : x)), E = motor.evaluar(p, medio);
    E.estados.forEach((e, i) => { if (e !== 'pendiente') assert.equal(e, lleno.estados[i]); });
    // las soluciones posibles con lo colocado nunca son más que todas
    assert.ok(E.posibles <= motor.resolver(p).total);
    if (lleno.esSolucion) assert.ok(E.posibles >= 1);
  }
});
test('preguntas con respuesta única: ningún error típico da la respuesta correcta', () => {
  let conErrores = 0;
  for (let k = 0; k < 400; k++) {
    const p = problemaAlAzar(k % 2 ? 'circular' : 'lineal'); if (!motor.resolver(p).total) continue;
    const n = p.personas.length;
    const q = p.forma === 'lineal' ? { tipo: 'lugar', k: ent(1, n) } : { tipo: 'derechaDe', de: elige(p.personas) };
    const Q = motor.quien(p, q);
    if (Q.unica) { sinErrorCorrecto(Q.errores, Q.respuesta, `quien ${JSON.stringify(p.pistas)}`); for (const v of Object.values(Q.otras)) assert.ok(!v.includes(Q.respuesta)); if (Object.keys(Q.errores).length) conErrores++; }
    if (p.forma === 'lineal') { const L = motor.lugaresDe(p, elige(p.personas)); sinErrorCorrecto(L.errores, L.respuesta, 'lugaresDe'); }
    for (let i = 0; i < p.pistas.length; i++) { const S = motor.sinPista(p, i); sinErrorCorrecto(S.errores, S.total, 'sinPista'); assert.ok(S.total >= motor.resolver(p).total); }
    // necesario: con afirmaciones al azar, cuando hay exactamente una necesaria
    const af = Array.from({ length: 4 }, () => pistaAlAzar(p.forma, p.personas, n));
    let N; try { N = motor.necesario(p, af); } catch (e) { assert.match(e.message, /exactamente una afirmación necesaria/); continue; }
    sinErrorCorrecto(N.errores, N.respuesta, 'necesario');
    N.errorDe.forEach((e, i) => assert.equal(e === null, i === N.respuesta));
    assert.equal(N.estados.filter(e => e === 'siempre').length, 1);
  }
  assert.ok(conErrores > 20, 'los errores típicos casi siempre dan algo');
});
test('la pista que sobra: quitarla no cambia nada; quitar cualquiera de las otras sí', () => {
  let probadas = 0;
  for (let k = 0; k < 600; k++) {
    const p = problemaAlAzar('lineal'); if (p.pistas.length < 2 || !motor.resolver(p).total) continue;
    const A = motor.analizar(p);
    A.porPista.forEach((x, i) => assert.equal(x.sobra, x.sin === A.total));
    let S; try { S = motor.pistaQueSobra(p); } catch (e) { assert.match(e.message, /debe sobrar exactamente una/); continue; }
    probadas++;
    sinErrorCorrecto(S.errores, S.respuesta, 'pista que sobra');
    S.sin.forEach((t, i) => assert.equal(t === S.total, i === S.respuesta));
  }
  assert.ok(probadas > 10);
  // agregar una pista nunca aumenta las soluciones
  for (let k = 0; k < 200; k++) { const p = problemaAlAzar('lineal'), q = pistaAlAzar('lineal', p.personas, p.personas.length), R = motor.probarPista(p, q);
    assert.ok(R.despues <= R.antes); assert.equal(R.efecto === 'contradice', R.despues === 0); }
});
test('cuadro de doble entrada: el conteo coincide con una fuerza bruta aparte; ningún error es la respuesta', () => {
  const per = ['Gael', 'Iris', 'Juan'], A = { oficio: ['chef', 'docente', 'piloto'], ciudad: ['Puno', 'Cusco', 'Arequipa'] };
  const valeC = (q, s) => {
    if (q.tipo === 'es') return s[q.atributo][per.indexOf(q.persona)] === q.valor;
    if (q.tipo === 'noEs') return s[q.atributo][per.indexOf(q.persona)] !== q.valor;
    const i = s[q.atr1].indexOf(q.val1); return q.tipo === 'mismo' ? s[q.atr2][i] === q.val2 : s[q.atr2][i] !== q.val2;
  };
  const todos = []; for (const o of perms(A.oficio)) for (const c of perms(A.ciudad)) todos.push({ oficio: o, ciudad: c });
  for (let k = 0; k < 300; k++) {
    const pistas = Array.from({ length: ent(1, 4) }, () => {
      const t = elige(['es', 'noEs', 'mismo', 'noMismo']);
      if (t === 'es' || t === 'noEs') { const at = elige(['oficio', 'ciudad']); return { tipo: t, persona: elige(per), atributo: at, valor: elige(A[at]) }; }
      return { tipo: t, atr1: 'oficio', val1: elige(A.oficio), atr2: 'ciudad', val2: elige(A.ciudad) };
    });
    const p = { forma: 'cuadro', personas: per, atributos: A, pistas };
    assert.equal(motor.resolver(p).total, todos.filter(s => pistas.every(q => valeC(q, s))).length);
    if (!motor.resolver(p).total) continue;
    const Q = motor.quien(p, { tipo: 'valor', persona: elige(per), atributo: elige(['oficio', 'ciudad']) });
    if (Q.unica) sinErrorCorrecto(Q.errores, Q.respuesta, 'cuadro');
  }
});
test('verdades y mentiras: contra una fuerza bruta aparte; la hipótesis encaja solo con una solución', () => {
  const props = gente => gente.flatMap(x => [{ tipo: 'culpable', x }, { tipo: 'noCulpable', x }, { tipo: 'miente', x }, { tipo: 'veraz', x }]);
  const val = (x, c, M) => ({ culpable: () => c === x.x, noCulpable: () => c !== x.x, miente: () => M.includes(x.x), veraz: () => !M.includes(x.x) })[x.tipo]();
  let probadas = 0;
  for (let k = 0; k < 400; k++) {
    const gente = GENTE.slice(0, ent(3, 5)), frases = gente.map(de => ({ de, dice: elige(props(gente)) }));
    const kM = ent(0, 2), p = { personas: gente, frases, mienten: { exactamente: kM } };
    // aparte: todos los (culpable, mentirosos) con kM mentirosos
    const sol = [];
    for (let m = 0; m < (1 << gente.length); m++) {
      const M = gente.filter((_, i) => m & (1 << i)); if (M.length !== kM) continue;
      for (const c of gente) if (frases.every(f => val(f.dice, c, M) === !M.includes(f.de))) sol.push(c + ':' + M.join(','));
    }
    const V = motor.verdades(p);
    assert.deepEqual(V.soluciones.map(s => s.culpable + ':' + s.mentirosos.join(',')).sort(), sol.sort());
    for (const [i, j] of V.pares) for (const s of V.soluciones) assert.notEqual(s.mentirosos.includes(frases[i].de), s.mentirosos.includes(frases[j].de), 'en un par que se contradice, miente exactamente uno');
    if (V.unica) {
      probadas++;
      if (V.erroresMiente) sinErrorCorrecto(V.erroresMiente, V.mentirosos[0], 'quién miente');
      if (V.erroresCulpable) sinErrorCorrecto(V.erroresCulpable, V.culpable, 'quién es culpable');
      // con un mentiroso: solo la hipótesis correcta encaja, y da el culpable correcto
      if (kM === 1) for (const x of gente) { const H = motor.hipotesis(p, [x]); assert.equal(H.consistente, x === V.mentirosos[0]); if (H.consistente) assert.deepEqual(H.culpables, [V.culpable]); else assert.ok(H.choques.length); }
    }
  }
  assert.ok(probadas > 20);
});
test('certezas: el peor caso coincide con todas las extracciones posibles; ningún error es la respuesta', () => {
  // ¿toda extracción de m objetos logra el objetivo? (aparte: se recorren todas las combinaciones de cantidades)
  function todasLogran(urna, ob, m) {
    const cs = Object.keys(urna);
    const rec = (i, falta, acc) => {
      if (i === cs.length) return falta === 0 ? [acc] : [];
      const out = []; for (let x = 0; x <= Math.min(urna[cs[i]], falta); x++) out.push(...rec(i + 1, falta - x, Object.assign({}, acc, { [cs[i]]: x })));
      return out;
    };
    return rec(0, m, {}).every(s => motor.logra({ urna, objetivo: ob }, s));
  }
  const COLORES = ['roja', 'azul', 'verde', 'negra'];
  let probadas = 0;
  for (let k = 0; k < 300; k++) {
    const urna = {}; COLORES.slice(0, ent(2, 4)).forEach(c => { urna[c] = ent(1, 6); });
    const cs = Object.keys(urna), t = elige(['mismoColor', 'deColor', 'unoDeCada', 'distintos']);
    const ob = t === 'mismoColor' ? { tipo: t, k: ent(2, 4) } : t === 'deColor' ? { tipo: t, color: elige(cs), k: ent(1, 3) } : { tipo: t };
    let C; try { C = motor.certeza({ urna, objetivo: ob }); } catch (e) { assert.match(e.message, /no se puede lograr|solo hay/); continue; }
    probadas++;
    const total = cs.reduce((s, c) => s + urna[c], 0);
    assert.ok(todasLogran(urna, ob, C.n), `${JSON.stringify(urna)} ${JSON.stringify(ob)}: con ${C.n} no siempre se logra`);
    if (C.n > 1) assert.ok(!todasLogran(urna, ob, C.n - 1), `${JSON.stringify(urna)} ${JSON.stringify(ob)}: ${C.n - 1} ya bastaba`);
    assert.ok(C.n <= total);
    // la secuencia del peor caso: se puede sacar, no logra el objetivo antes del final y lo logra al final
    assert.equal(C.secuencia.length, C.n);
    const cuenta = {}; C.secuencia.forEach((c, i) => { cuenta[c] = (cuenta[c] || 0) + 1; assert.ok(cuenta[c] <= urna[c]);
      assert.equal(motor.logra({ urna, objetivo: ob }, cuenta), i === C.n - 1, `peor caso ${C.secuencia.join(',')}`); });
    sinErrorCorrecto(C.errores, C.n, `certeza ${JSON.stringify(ob)}`);
  }
  assert.ok(probadas > 150);
  for (let n = 2; n <= 12; n++) { const L = motor.llaves(n); assert.equal(L.intentos, L.porCandado.reduce((s, x) => s + x, 0)); sinErrorCorrecto(L.errores, L.intentos, `llaves ${n}`); }
});

// 3. Los acertijos de la escena (los mismos objetos que usa index.html)
const PER = ['Flor', 'Gael', 'Hugo', 'Iris', 'Juan'];
const ESC = {
  cine: { forma: 'lineal', personas: PER, pistas: [{ tipo: 'izquierda', a: 'Flor', b: 'Gael' }, { tipo: 'noJuntos', a: 'Gael', b: 'Hugo' }, { tipo: 'lugar', a: 'Flor', k: 2 }, { tipo: 'noExtremo', a: 'Hugo' }] },
  sobra: { forma: 'lineal', personas: PER, pistas: [{ tipo: 'lugar', a: 'Flor', k: 2 }, { tipo: 'noJuntos', a: 'Flor', b: 'Gael' }, { tipo: 'izquierda', a: 'Flor', b: 'Gael' }, { tipo: 'inmIzquierda', a: 'Hugo', b: 'Iris' }] },
  derecha: { forma: 'lineal', personas: PER, pistas: [{ tipo: 'derecha', a: 'Juan', b: 'Iris' }, { tipo: 'lugar', a: 'Iris', k: 2 }] },
  mesa: { forma: 'circular', personas: PER, pistas: [{ tipo: 'inmDerecha', a: 'Gael', b: 'Flor' }, { tipo: 'noJuntos', a: 'Hugo', b: 'Flor' }, { tipo: 'juntos', a: 'Iris', b: 'Gael' }] },
  cuadro: { forma: 'cuadro', personas: ['Gael', 'Iris', 'Juan'], atributos: { oficio: ['chef', 'docente', 'piloto'], ciudad: ['Puno', 'Cusco', 'Arequipa'] }, frases: { oficio: 'es {v}', ciudad: 'es de {v}' },
    pistas: [{ tipo: 'es', persona: 'Gael', atributo: 'oficio', valor: 'chef' }, { tipo: 'noEs', persona: 'Gael', atributo: 'ciudad', valor: 'Puno' }, { tipo: 'noEs', persona: 'Iris', atributo: 'oficio', valor: 'docente' }, { tipo: 'mismo', atr1: 'oficio', val1: 'docente', atr2: 'ciudad', val2: 'Cusco' }] },
  ventana: { personas: ['Flor', 'Gael', 'Hugo', 'Iris'], frases: [{ de: 'Flor', dice: { tipo: 'culpable', x: 'Flor' } }, { de: 'Gael', dice: { tipo: 'culpable', x: 'Flor' } }, { de: 'Hugo', dice: { tipo: 'culpable', x: 'Gael' } }, { de: 'Iris', dice: { tipo: 'noCulpable', x: 'Gael' } }], mienten: { exactamente: 1 } },
};
const distintos = (xs, que) => assert.equal(new Set(xs.map(x => JSON.stringify(x))).size, xs.length, `${que}: ${JSON.stringify(xs)}`);
test('acertijos de la escena: una sola respuesta por fuerza bruta y opciones distintas', () => {
  const C = motor.quien(ESC.cine, { tipo: 'lugar', k: 3 });
  assert.ok(C.unica); assert.equal(contarAparte(ESC.cine), 2);
  distintos([C.respuesta, C.errores.olvidaNegativa, C.errores.leeSinNo, C.errores.sentidoInvertido], 'paso 1');
  const AF = [{ tipo: 'extremo', a: 'Iris' }, { tipo: 'noJuntos', a: 'Iris', b: 'Juan' }, { tipo: 'juntos', a: 'Hugo', b: 'Juan' }, { tipo: 'izquierda', a: 'Gael', b: 'Juan' }];
  const N = motor.necesario(ESC.cine, AF); assert.equal(N.respuesta, 1); assert.ok(N.errorDe.every((e, i) => (i === 1) === (e === null)));
  assert.ok(!N.errorDe.includes('nunca'), 'cada opción incorrecta sale de un error');
  const S = motor.sinPista(ESC.cine, 3); distintos([S.total, S.errores.comoSiSobrara, S.errores.inmediata, S.errores.olvidaNegativa], 'paso 4');
  const ef = [{ tipo: 'juntos', a: 'Iris', b: 'Flor' }, { tipo: 'izquierda', a: 'Hugo', b: 'Gael' }, { tipo: 'juntos', a: 'Flor', b: 'Gael' }].map(q => motor.probarPista(ESC.cine, q).efecto);
  assert.deepEqual(ef, ['unica', 'sobra', 'contradice']);
  // con la quinta pista que la vuelve única, la solución es una sola (y la escena la muestra)
  assert.equal(motor.resolver(Object.assign({}, ESC.cine, { pistas: ESC.cine.pistas.concat([{ tipo: 'juntos', a: 'Iris', b: 'Flor' }]) })).total, 1);
  const V = motor.verdades(ESC.ventana); assert.ok(V.unica);
  distintos([V.mentirosos[0], V.erroresMiente.culpableEsMentiroso, V.erroresMiente.otroDelPar, V.erroresMiente.acusadoMiente], 'paso 6');
  assert.deepEqual(ESC.ventana.personas.filter(x => motor.hipotesis(ESC.ventana, [x]).consistente), ['Hugo']);
  const U = motor.certeza({ urna: { roja: 6, azul: 5, verde: 4 }, objetivo: { tipo: 'mismoColor', k: 2 } });
  distintos([U.n, U.errores.mejorCaso, U.errores.sinMasUno, U.errores.porColores], 'paso 8');
  const Ps = motor.pistaQueSobra(ESC.sobra); assert.equal(Ps.respuesta, 2); assert.ok(motor.resolver(ESC.sobra).unica);
  const L = motor.lugaresDe(ESC.derecha, 'Juan'); distintos([L.respuesta, L.errores.inmediata, L.errores.sentidoInvertido, L.errores.sinDireccion], 'qué pasa si 2');
  const Mn = motor.maneras('circular', 5); distintos([Mn.total, Mn.errores.rotacionesDistintas, Mn.errores.tambienReflejos, Mn.errores.sinFactorial], 'qué pasa si 3');
  assert.ok(motor.resolver(ESC.mesa).unica);
  const Q = motor.quien(ESC.cuadro, { tipo: 'valor', persona: 'Iris', atributo: 'ciudad' }); assert.ok(motor.resolver(ESC.cuadro).unica);
  distintos([Q.respuesta, Q.errores.olvidaNegativa, Q.errores.sinCruce], 'qué pasa si 4');
  const R = motor.certeza({ urna: { roja: 6, azul: 5, verde: 4 }, objetivo: { tipo: 'deColor', color: 'roja', k: 2 } });
  distintos([R.n, R.errores.mejorCaso, R.errores.soloUnOtro, R.errores.sinMasUno], 'qué pasa si 5');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  const P = { forma: 'lineal', personas: PER, pistas: [] };
  assert.throws(() => motor.resolver({ forma: 'espiral', personas: PER, pistas: [] }), /forma desconocida/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: ['Flor'], pistas: [] }), /al menos dos/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: ['Flor', 'Flor'], pistas: [] }), /repetidas/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: PER, pistas: [{ tipo: 'lugar', a: 'Flor', k: 7 }] }), /no hay butaca/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: PER, pistas: [{ tipo: 'izquierda', a: 'Flor', b: 'Ana' }] }), /nadie llamado Ana/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: PER, pistas: [{ tipo: 'juntos', a: 'Flor', b: 'Flor' }] }), /consigo mismo/);
  assert.throws(() => motor.resolver({ forma: 'circular', personas: PER, pistas: [{ tipo: 'izquierda', a: 'Flor', b: 'Gael' }] }), /no sirve en la forma circular/);
  assert.throws(() => motor.resolver({ forma: 'circular', personas: PER, pistas: [{ tipo: 'frente', a: 'Flor', b: 'Gael' }] }), /número par/);
  assert.throws(() => motor.resolver({ forma: 'lineal', personas: PER, asientos: 4, pistas: [] }), /al menos 5/);
  assert.throws(() => motor.resolver({ forma: 'cuadro', personas: ['A', 'B'], atributos: { color: ['x'] }, pistas: [] }), /un valor por persona/);
  assert.throws(() => motor.evaluar(P, ['Flor', 'Flor', null, null, null]), /dos asientos/);
  assert.throws(() => motor.evaluar(P, ['Flor']), /lista de 5/);
  assert.throws(() => motor.necesario(P, [{ tipo: 'extremo', a: 'Flor' }, { tipo: 'extremo', a: 'Gael' }]), /exactamente una afirmación necesaria/);
  assert.throws(() => motor.sinPista(P, 0), /no hay pista 1/);
  assert.throws(() => motor.pistaQueSobra(P), /debe sobrar exactamente una/);
  assert.throws(() => motor.maneras('circular', 1), /al menos 2/);
  assert.throws(() => motor.verdades({ personas: ['Flor', 'Gael'], frases: [{ de: 'Flor', dice: { tipo: 'miente', x: 'Gael' } }, { de: 'Flor', dice: { tipo: 'miente', x: 'Gael' } }], mienten: 'libre' }), /una sola frase/);
  assert.throws(() => motor.verdades({ personas: ['Flor', 'Gael'], frases: [{ de: 'Flor', dice: { tipo: 'grita', x: 'Gael' } }], mienten: 'libre' }), /desconocida/);
  assert.throws(() => motor.verdades({ personas: ['Flor', 'Gael'], frases: [{ de: 'Flor', dice: { tipo: 'miente', x: 'Gael' } }] }), /cuántos mienten/);
  assert.throws(() => motor.hipotesis(ESC.ventana, ['Juan']), /no dice nada/);
  assert.throws(() => motor.certeza({ urna: { roja: 1, azul: 1 }, objetivo: { tipo: 'mismoColor', k: 2 } }), /no se puede lograr/);
  assert.throws(() => motor.certeza({ urna: { roja: 1, azul: 3 }, objetivo: { tipo: 'deColor', color: 'roja', k: 2 } }), /solo hay 1/);
  assert.throws(() => motor.certeza({ urna: { roja: 0, azul: 3 }, objetivo: { tipo: 'distintos' } }), /al menos 1/);
  assert.throws(() => motor.certeza({ urna: { roja: 2 }, objetivo: { tipo: 'distintos' } }), /dos colores/);
  assert.throws(() => motor.certeza({ urna: { roja: 2, azul: 2 }, objetivo: { tipo: 'arcoiris' } }), /objetivo desconocido/);
  assert.throws(() => motor.llaves(1.5), /entero/);
});

// 5. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
  // si la verificación pide una respuesta única, la fuerza bruta lo confirma
  for (const v of p.verificar) { const r = llamar(v.fn, v.args); if (v.espera.respuesta !== undefined && r.posibles) assert.equal(r.posibles.length, 1, `${p.id}: la respuesta no es única`); }
});
