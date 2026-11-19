/*
 * Generador «Veraces, culpables y mentiras»: práctica de «Verdades y mentiras»
 * (razonamiento-matematico.verdades-y-mentiras; contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js), con
 * los tipos separados por idea. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-verdades']) y en Node (require). Todo se resuelve por fuerza bruta (regla 1): todas las
 * tarjetas, todos los culpables, todos los órdenes de llegada o todas las edades, y se queda lo que encaja.
 *
 * Tipos por idea (TIPOS_POR_IDEA; los id de las ideas de la teoría). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso.
 *   suposicion        tarjetas (2) tres personas, ¿quiénes dicen la verdad? · cuatro (3) cuatro personas, ¿quiénes mienten?
 *   negar-bien        negar (1) lo seguro cuando un mentiroso dice «todos», «ninguno», «más de» o «menos de» · edad (3)
 *                     tres frases de un mentiroso sobre su edad
 *   contradictorias   culpable (2) cuatro sospechosos, solo uno miente: ¿quién fue? · quien-miente (3) cinco: ¿quién miente?
 *   solo-uno-veraz    escondido (2) la pelota en una de cuatro mochilas, solo uno dice la verdad · veraz5 (3) cinco
 *                     sospechosos, solo uno dice la verdad: ¿quién fue?
 *   verdad-y-mentira  podio (2) tres atletas, una verdad y una mentira cada uno: ¿quién ganó? · podio4 (3) cuatro atletas
 *   cuantos-mienten   cuantos (2) cada uno dice cuántos mienten (exactamente) · por-lo-menos (3) con «por lo menos»
 *
 * Convenciones, las de la teoría: cada uno es veraz o mentiroso (tarjetas VERAZ o MIENTE); «cierta» y «falsa» para las
 * frases; las frases van en los datos, una por línea. Paleta de deducción: solo violeta (x), para lo pedido ya
 * comprobado en la solución. Las personas van por su nombre: las letras A a E son solo las de las alternativas.
 * Errores (códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis; los mismos de la teoría):
 *   RMP72-choca  una suposición que choca con una frase       RMP77-posible  lo posible por lo seguro
 *   RMP78-nada   creer que faltan datos                       RMP49-cree     creerle a quien miente
 *   RMP146-ninguno  negar «todos» con «ninguno»               RMP147-borde   negar «más de k» como «menos de k»
 *   RMP148-par   no ver el par que se contradice              RMP149-fuera   creerle a quien está fuera del par
 *   RMP150-una   creerle la primera frase a quien dice una verdad y una mentira
 *   RMP151-cuenta  creerle a la frase sobre cuántos mienten
 * Cuentas comprobadas con un camino aparte (generador.test.js lee las frases del texto) y en casos.json.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-verdades', UNIDAD = 'razonamiento-matematico.verdades-y-mentiras';
  const v = P.v;
  const lista = (xs, y = 'y') => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}`);
  const err = (id, clave, texto, explicacion) => ({ id, clave, texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo', 'Rosa', 'Nora'];   // ningún par empieza igual
  const FEM = new Set(['Ana', 'Dina', 'Eva', 'Gaby', 'Rosa', 'Nora']);
  const NUMS = ['ninguno', 'uno', 'dos', 'tres', 'cuatro', 'cinco'];
  const vf = b => (b ? 'cierta' : 'falsa');
  const D_TARJ = 'Veraz: siempre dice la verdad; mentiroso: siempre miente.';
  const permutar = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permutar(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));

  // ======================= Veraces y mentirosos (ideas 1 y 6) =======================
  function textoKK(de, f, gente) {
    if (f.m) return `${f.m} miente`;
    if (f.v) return `${f.v} dice la verdad`;
    if (f.k !== undefined) return f.k === gente.length ? `Aquí mentimos los ${NUMS[f.k]}` : `Aquí ${f.k === 1 ? 'miente' : 'mienten'} exactamente ${NUMS[f.k]}`;
    if (f.alMenos !== undefined) return `Aquí ${f.alMenos === 1 ? 'miente' : 'mienten'} por lo menos ${NUMS[f.alMenos]}`;
    const xs = f.mm || f.vv, mienten = !!f.mm;
    if (xs.includes(de)) return `${xs.find(x => x !== de)} y yo ${mienten ? 'mentimos' : 'decimos la verdad'}`;
    return `${xs[0]} y ${xs[1]} ${mienten ? 'mienten' : 'dicen la verdad'}`;
  }
  function valorKK(f, w) {
    if (f.m) return !w[f.m];
    if (f.v) return w[f.v];
    if (f.mm) return f.mm.every(x => !w[x]);
    if (f.vv) return f.vv.every(x => w[x]);
    const k = Object.values(w).filter(x => !x).length;
    return f.k !== undefined ? k === f.k : k >= f.alMenos;
  }
  const tarjetas = gente => Array.from({ length: 2 ** gente.length }, (_, m) => Object.fromEntries(gente.map((x, i) => [x, !((m >> i) & 1)])));
  const encajaKK = (fr, w) => fr.every(x => valorKK(x.f, w) === w[x.de]);
  const chocaKK = (fr, w) => fr.find(x => valorKK(x.f, w) !== w[x.de]);
  const dichoKK = (x, gente) => `${x.de} dice: «${textoKK(x.de, x.f, gente)}».`;
  const veracesTxt = (gente, w, mienten) => { const q = gente.filter(x => (mienten ? !w[x] : w[x])); return !q.length ? 'Nadie' : q.length === gente.length ? `Los ${NUMS[gente.length]}` : q.length === 1 ? `Solo ${q[0]}` : lista(q); };
  function casoKK(rng, n, modo) {
    for (let t = 0; t < 4000; t++) {
      const gente = rng.barajar(GENTE).slice(0, n).sort((a, b) => GENTE.indexOf(a) - GENTE.indexOf(b));
      const fr = gente.map(de => {
        const otros = gente.filter(x => x !== de), x = rng.elegir(otros), y = rng.elegir(otros.filter(z => z !== x).concat([de]));
        if (modo === 'cuantos') return { de, f: { k: rng.entero(1, n) } };
        if (modo === 'menos') return { de, f: rng.elegir([{ alMenos: rng.entero(1, n) }, { alMenos: rng.entero(1, n) }, { k: rng.entero(1, n) }, { m: x }, { v: x }]) };
        const par = [x, y].sort((a, b) => gente.indexOf(a) - gente.indexOf(b));
        return { de, f: rng.elegir([{ m: x }, { m: x }, { v: x }, { mm: par }, { vv: par }]) };
      });
      if (new Set(fr.map(x => textoKK(x.de, x.f, gente))).size < (modo === 'cuantos' ? 2 : n)) continue;
      // Con «cuantos», nunca los n números distintos: es el acertijo del juego de la teoría, con la misma respuesta.
      if (modo === 'cuantos' && new Set(fr.map(x => x.f.k)).size === n) continue;
      const q = tarjetas(gente).filter(w => encajaKK(fr, w));
      if (q.length !== 1) continue;
      return { gente, fr, sol: q[0] };
    }
    return null;
  }
  function tarjetasTipo(rng, n, mienten) {
    const c = casoKK(rng, n, 'normal');
    if (!c) return null;
    const bien = veracesTxt(c.gente, c.sol, mienten);
    const otras = tarjetas(c.gente).filter(w => !encajaKK(c.fr, w)).sort((a, b) => c.gente.filter(x => a[x] !== c.sol[x]).length - c.gente.filter(x => b[x] !== c.sol[x]).length);
    const errores = otras.map(w => {
      const x = chocaKK(c.fr, w), t = veracesTxt(c.gente, w, mienten);
      return err('RMP72-choca', `t:${t}`, t, `Bien: probaste una suposición. Pero con ella, la frase de ${x.de} sale ${vf(valorKK(x.f, w))} y ${x.de} ${w[x.de] ? 'es veraz' : 'miente'}: choca.`);
    });
    errores.splice(2, 0, err('RMP78-nada', 'nada', 'No se puede saber', 'Bien: no diste nada por seguro sin probarlo. Pero de todas las suposiciones, una sola encaja.'));
    return { enunciado: [`En el juego de las tarjetas hablan ${lista(c.gente)}.`], pregunta: [`¿Quiénes ${mienten ? 'mienten' : 'dicen la verdad'}?`],
      datos: [D_TARJ, ...c.fr.map(x => dichoKK(x, c.gente))], correcta: { clave: `t:${bien}`, texto: bien }, errores,
      solucion: [['Se supone la tarjeta de cada uno y se revisa cada frase: la suposición que no choca es una sola.'], [`${mienten ? 'Mienten' : 'Dicen la verdad'}: `, v('x', bien), '.']],
      _datos: { forma: 'tarjetas', gente: c.gente, frases: c.fr.map(x => textoKK(x.de, x.f, c.gente)), pide: mienten ? 'mienten' : 'veraces' } };
  }
  const tarjetasT = rng => tarjetasTipo(rng, 3, false);
  const cuatro = rng => tarjetasTipo(rng, 4, true);
  // ¿Cuántos mienten? Con k mentirosos, las frases ciertas deben ser n − k.
  function cuantosTipo(rng, modo) {
    const n = 4, c = casoKK(rng, n, modo);
    if (!c) return null;
    const k = c.gente.filter(x => !c.sol[x]).length, num = j => (j === 0 ? 'Ninguno' : j === n ? 'Los cuatro' : NUMS[j].replace(/^./, m => m.toUpperCase()));
    const ciertasCon = j => { const w = Object.fromEntries(c.gente.map((x, i) => [x, i >= j])); return c.fr.filter(x => (x.f.m || x.f.v ? null : valorKK(x.f, w))).length; };
    const errores = [];
    for (let j = 0; j <= n; j++) {
      if (j === k) continue;
      const lo = c.fr.some(x => x.f.k === j || x.f.alMenos === j);
      errores.push(err(lo ? 'RMP151-cuenta' : 'RMP72-choca', `k:${j}`, num(j), lo ? `Bien: tomaste en cuenta lo que dice alguien. Pero que lo diga no lo hace cierto: con ${j} mintiendo, las tarjetas no cuadran.`
        : `Bien: probaste esa cuenta. Pero con ${j} mintiendo, alguna frase no va con la tarjeta de quien la dice.`));
    }
    void ciertasCon;
    return { enunciado: [`En la última ronda del juego de las tarjetas hablan ${lista(c.gente)}.`], pregunta: ['¿Cuántos de ellos mienten?'],
      datos: [`${D_TARJ} Cada frase cuenta a todos, también a quien habla.`, ...(modo === 'menos' ? ['Por lo menos 2: 2 o más.'] : []), ...c.fr.map(x => dichoKK(x, c.gente))],
      correcta: { clave: `k:${k}`, texto: num(k) }, errores,
      solucion: [['Se supone cuántos mienten: las frases que salen ciertas tienen que ser justo las de los veraces.'], ['Solo cuadra con ', v('x', String(k)), ' mintiendo.']],
      _datos: { forma: 'tarjetas', gente: c.gente, frases: c.fr.map(x => textoKK(x.de, x.f, c.gente)), pide: 'cuantos' } };
  }

  // ======================= Lo contrario (idea 2) =======================
  const GRUPOS = [
    { g: 'los de mi grupo', s3: 'los de su grupo', pl: 'aprobaron', sg: 'aprobó', no: 'no aprobó', fem: false },
    { g: 'mis primos', s3: 'sus primos', pl: 'son de Puno', sg: 'es de Puno', no: 'no es de Puno', fem: false },
    { g: 'las cajas del aula', s3: 'las cajas del aula', pl: 'están llenas', sg: 'está llena', no: 'no está llena', fem: true },
  ];
  // Solo lo que el caso usa (lectores en frío, 19 nov: «A lo más 5» no servía y daba la forma de la respuesta).
  const D_MIENTE = 'Lo que dice quien siempre miente es falso.', D_NEG = [D_MIENTE, 'Al menos uno: uno o más.'];
  function negar(rng) {
    const q = rng.elegir(GENTE), tipo = rng.entero(0, 2), G = rng.elegir(GRUPOS), uno = G.fem ? 'una' : 'uno';
    const Todos = G.fem ? 'Todas' : 'Todos', Ning = G.fem ? 'Ninguna' : 'Ninguno', Alg = G.fem ? 'Algunas' : 'Algunos', otros = G.fem ? 'otras' : 'otros';
    let dice, ok, errores;
    if (tipo === 0) {
      dice = `${Todos} ${G.g} ${G.pl}`; ok = `Al menos ${uno} de ${G.s3} ${G.no}`;
      errores = [err('RMP146-ninguno', 'ninguno', `${Ning} de ${G.s3} ${G.sg}`, `Bien: la frase es falsa. Pero «${Todos.toLowerCase()}» también falla si solo ${uno} ${G.no}: «ninguno» es un caso, no lo seguro.`),
        err('RMP77-posible', 'algunos', `${Alg} ${G.pl} y ${otros} no`, `Bien: puede pasar. Pero también es posible que ${Ning.toLowerCase()} ${G.sg}: no es seguro.`),
        err('RMP49-cree', 'cree', `${Todos} ${G.s3} ${G.pl}`, 'Eso es creerle. Quien siempre miente dice algo falso.')];
    } else if (tipo === 1) {
      dice = `${Ning} de ${G.g} ${G.sg}`; ok = `Al menos ${uno} de ${G.s3} ${G.sg}`;
      errores = [err('RMP146-ninguno', 'todos', `${Todos} ${G.s3} ${G.pl}`, `Bien: la frase es falsa. Pero «${Ning.toLowerCase()}» también falla si solo ${uno} ${G.sg}.`),
        err('RMP77-posible', 'algunos', `${Alg} ${G.pl} y ${otros} no`, `Bien: puede pasar. Pero también es posible que ${Todos.toLowerCase()} ${G.pl}.`),
        err('RMP49-cree', 'cree', `${Ning} de ${G.s3} ${G.sg}`, 'Eso es creerle. Quien siempre miente dice algo falso.')];
    } else {
      const mas = rng.entero(0, 1) === 1, soles = rng.entero(0, 1) === 1, k = soles ? rng.elegir([10, 20, 30, 50]) : rng.entero(14, 17), u = soles ? 'soles' : 'años';
      dice = `Tengo ${mas ? 'más' : 'menos'} de ${k} ${u}`; ok = `${q} tiene ${k} ${u} o ${mas ? 'menos' : 'más'}`;
      errores = [err('RMP147-borde', 'borde', `${q} tiene ${mas ? 'menos' : 'más'} de ${k} ${u}`, `Bien: diste vuelta la frase. Pero falta el ${k}: con ${k} ${u} justos, la frase dicha también es falsa.`),
        err('RMP49-cree', 'cree', `${q} tiene ${mas ? 'más' : 'menos'} de ${k} ${u}`, 'Eso es creerle. Quien siempre miente dice algo falso.'),
        err('RMP77-posible', 'justo', `${q} tiene ${k} ${u} justos`, `Bien: ${k} hace falsa la frase. Pero ${mas ? k - 1 : k + 1} también: no es lo único posible.`)];
      return { enunciado: [`${q} siempre miente.`], pregunta: [`${q} dice: «${dice}». ¿Qué es seguro?`], datos: [D_MIENTE], correcta: { clave: 'ok', texto: ok },
        errores: errores.concat([err('RMP78-nada', 'nada', 'No se puede saber nada', 'Bien: no se sabe la cantidad exacta. Pero sí un límite: lo contrario de lo que dijo.')]),
        solucion: [[`La frase es falsa. Lo contrario de «${mas ? 'más' : 'menos'} de ${k}» es «${k} o ${mas ? 'menos' : 'más'}»: el ${k} entra.`], ['Es seguro: ', v('x', ok), '.']],
        _datos: { forma: 'cantidad', dice, pide: 'seguro' } };
    }
    return { enunciado: [`${q} siempre miente.`], pregunta: [`${q} dice: «${dice}». ¿Qué es seguro?`], datos: D_NEG.slice(), correcta: { clave: 'ok', texto: ok },
      errores: errores.concat([err('RMP78-nada', 'nada', 'No se puede saber nada', 'Bien: no se sabe quiénes. Pero sí algo: basta un caso para romper la frase.')]),
      solucion: [['La frase es falsa. Una frase con «todos» o «ninguno» se rompe con un solo caso.'], ['Es seguro: ', v('x', ok), '.']],
      _datos: { forma: 'grupo', dice, pide: 'seguro' } };
  }
  function edad(rng) {
    const q = rng.elegir(GENTE), a = rng.entero(14, 17), frases = [`Tengo menos de ${a} años`, `Tengo más de ${a + 1} años`, `Tengo ${a + 1} años`];
    return { enunciado: [`${q} siempre miente. Dice tres frases sobre su edad.`], pregunta: ['¿Cuántos años tiene?'],
      datos: [D_MIENTE, ...frases.map((t, i) => `Frase ${i + 1}: «${t}».`)], correcta: { clave: `e:${a}`, texto: `${a} años` },
      errores: [err('RMP72-choca', `e:${a + 1}`, `${a + 1} años`, `Bien: diste vuelta las frases 1 y 2. Pero la frase 3 dice ${a + 1}, y es falsa.`),
        err('RMP49-cree', `e:${a - 1}`, `${a - 1} años`, `Eso es creerle la frase 1. Como miente, tiene ${a} años o más.`),
        err('RMP49-cree', `e:${a + 2}`, `${a + 2} años`, `Eso es creerle la frase 2. Como miente, tiene ${a + 1} años o menos.`),
        err('RMP78-nada', 'nada', 'No se puede saber', `Bien: cada frase sola no basta. Pero juntas dejan una sola edad.`)],
      solucion: [[`Lo contrario de cada frase: ${a} o más, ${a + 1} o menos, y no ${a + 1}.`], ['Tiene ', v('x', `${a} años`), '.']],
      _datos: { forma: 'edad', frases, pide: 'edad' } };
  }

  // ======================= Culpables y mochilas (ideas 3 y 4) =======================
  const CTX = {
    fue: { si: (x, de) => (x === de ? 'Fui yo' : `Fue ${x}`), no: (x, de) => (x === de ? 'Yo no fui' : `No fue ${x}`) },
    mochila: { si: (x, de) => (x === de ? 'Está en la mía' : `Está en la de ${x}`), no: (x, de) => (x === de ? 'No está en la mía' : `No está en la de ${x}`) },
  };
  const textoC = (x, ctx) => (x.f.si ? CTX[ctx].si(x.f.si, x.de) : x.f.no ? CTX[ctx].no(x.f.no, x.de) : `${x.f.miente} miente`);
  const valorC = (fr, x, c) => (x.f.si ? c === x.f.si : x.f.no ? c !== x.f.no : !valorC(fr, fr.find(y => y.de === x.f.miente), c));
  const falsasC = (fr, c) => fr.filter(x => !valorC(fr, x, c)).length;
  const paresC = (gente, fr) => { const out = []; for (let i = 0; i < fr.length; i++) for (let j = i + 1; j < fr.length; j++) if (gente.every(c => valorC(fr, fr[i], c) !== valorC(fr, fr[j], c))) out.push([fr[i].de, fr[j].de]); return out; };
  function casoC(rng, n, falsas, ctx) {
    for (let t = 0; t < 4000; t++) {
      const gente = rng.barajar(GENTE).slice(0, n);
      const fr = gente.map(de => {
        const tipo = rng.elegir(['si', 'no', 'si', 'no', 'miente']);
        return tipo === 'miente' ? { de, f: { miente: rng.elegir(gente.filter(z => z !== de)) } } : { de, f: { [tipo]: rng.elegir(gente) } };
      });
      if (fr.some(x => x.f.miente && fr.find(y => y.de === x.f.miente).f.miente)) continue;
      if (new Set(fr.map(x => textoC(x, ctx))).size < n) continue;
      const sol = gente.filter(c => falsasC(fr, c) === falsas), pares = paresC(gente, fr);
      // Un solo par que se contradice: con dos, «X está fuera del par» sería falso para quien está en el otro (auditoría,
      // 19 nov).
      if (sol.length !== 1 || pares.length !== 1) continue;
      return { gente, fr, c: sol[0], par: pares[0] };
    }
    return null;
  }
  function culpaTipo(rng, n, falsas, ctx, pide) {
    const c = casoC(rng, n, falsas, ctx);
    if (!c) return null;
    const cond = falsas === 1 ? 'Solo una de las frases es falsa: solo uno miente.' : 'Solo una de las frases es cierta: solo uno dice la verdad.';
    const datos = [cond, ...c.fr.map(x => `${x.de} dice: «${textoC(x, ctx)}».`)];
    const fuera = c.fr.filter(x => !c.par.includes(x.de));
    const texto = z => (ctx === 'mochila' ? `En la de ${z}` : z);
    if (pide === 'miente') {
      const m = c.fr.find(x => !valorC(c.fr, x, c.c)).de;
      const errores = c.gente.filter(z => z !== m).map(z => (c.par.includes(z)
        ? err('RMP148-par', `p:${z}`, z, `Bien: viste que ${c.par[0]} y ${c.par[1]} se contradicen. Pero si mintiera ${z}, ningún culpable dejaría ciertas las demás frases.`)
        : err('RMP72-choca', `p:${z}`, z, `Bien: revisaste las frases. Pero ${z} está fuera del par que se contradice: dice la verdad.`)));
      return { enunciado: [`Uno de los ${n === 4 ? 'cuatro' : 'cinco'} sospechosos rompió una maceta del patio.`], pregunta: ['¿Quién miente?'], datos, correcta: { clave: `p:${m}`, texto: m }, errores,
        solucion: [[`${c.par[0]} y ${c.par[1]} se contradicen: la frase falsa es una de las dos. Los demás dicen la verdad.`], [`Con lo que dicen, fue ${c.c}, y miente `, v('x', m), '.']],
        _datos: { forma: 'culpa', ctx, gente: c.gente, frases: datos.slice(1), falsas, pide: 'miente' } };
    }
    const cree = fuera.find(x => x.f.si && x.f.si !== c.c);
    const errores = c.gente.filter(z => z !== c.c).map(z => {
      const k = falsasC(c.fr, z), n2 = falsas === 1 ? k : n - k, que = falsas === 1 ? 'falsas' : 'ciertas';
      if (cree && cree.f.si === z) return err(falsas === 1 ? 'RMP49-cree' : 'RMP149-fuera', `p:${z}`, texto(z), `Bien: le hiciste caso a ${cree.de}. Pero ${falsas === 1 ? 'eso deja' : `${cree.de} está fuera del par y miente; eso deja`} ${n2} frases ${que}, y el dato pide 1.`);
      return err('RMP72-choca', `p:${z}`, texto(z), `Bien: probaste ese ${ctx === 'mochila' ? 'lugar' : 'culpable'}. Pero así quedan ${n2} ${n2 === 1 ? `frase ${que.slice(0, -1)}` : `frases ${que}`}, y el dato pide 1.`);
    });
    errores.push(err('RMP78-nada', 'nada', 'No se puede saber', `Bien: no supusiste nada sin probar. Pero ${c.par[0]} y ${c.par[1]} se contradicen, y eso decide.`));
    const intro = ctx === 'mochila' ? 'La pelota está en una de las mochilas de ' + lista(c.gente) + '.' : `Uno de los ${n === 4 ? 'cuatro' : 'cinco'} sospechosos dejó la puerta abierta.`;
    return { enunciado: [intro], pregunta: [ctx === 'mochila' ? '¿En qué mochila está la pelota?' : '¿Quién fue?'], datos, correcta: { clave: `p:${c.c}`, texto: texto(c.c) }, errores,
      solucion: [[`${c.par[0]} y ${c.par[1]} se contradicen: ahí está ${falsas === 1 ? 'el que miente' : 'el único veraz'}. Los demás ${falsas === 1 ? 'dicen la verdad' : 'mienten'}.`],
        [`Con eso, solo ${ctx === 'mochila' ? 'en la de' : 'con'} `, v('x', c.c), ` queda ${falsas === 1 ? 'una frase falsa' : 'una frase cierta'}.`]],
      _datos: { forma: 'culpa', ctx, gente: c.gente, frases: datos.slice(1), falsas, pide: 'quien' } };
  }
  const culpable = rng => culpaTipo(rng, 4, 1, 'fue', 'quien');
  const quienMiente = rng => culpaTipo(rng, 5, 1, 'fue', 'miente');
  const escondido = rng => culpaTipo(rng, 4, 3, 'mochila', 'quien');
  const veraz5 = rng => culpaTipo(rng, 5, 4, 'fue', 'quien');

  // ======================= Una verdad y una mentira (idea 5) =======================
  const ORDM = ['primero', 'segundo', 'tercero', 'cuarto'], ORDF = ['primera', 'segunda', 'tercera', 'cuarta'];
  const ord = (x, k) => (FEM.has(x) ? ORDF : ORDM)[k - 1];
  const textoP = (de, p) => (p.x === de ? `Llegué ${ord(de, p.k)}` : `${p.x} llegó ${ord(p.x, p.k)}`);
  const unaYUna = (y, o) => y.dos.filter(p => o.indexOf(p.x) + 1 === p.k).length === 1;
  function podioTipo(rng, n) {
    for (let t = 0; t < 4000; t++) {
      const gente = rng.barajar(GENTE).slice(0, n), todos = permutar(gente);
      const fr = gente.map(de => { const a = { x: de, k: rng.entero(1, n) }, b = { x: rng.elegir(gente.filter(z => z !== de)), k: rng.entero(1, n) }; return { de, dos: rng.entero(0, 1) ? [a, b] : [b, a] }; });
      const claves = fr.flatMap(y => y.dos.map(p => `${p.x}${p.k}`));
      if (new Set(claves).size < claves.length) continue;
      const q = todos.filter(o => fr.every(y => unaYUna(y, o)));
      if (q.length !== 1) continue;
      const o = q[0], gana = o[0];
      const errores = gente.filter(z => z !== gana).map(z => {
        const cree = fr.find(y => y.dos[0].x === z && y.dos[0].k === 1);
        return cree ? err('RMP150-una', `p:${z}`, z, `Bien: tomaste en cuenta lo que dijo ${cree.de}. Pero esa frase puede ser su mentira: con ${z} primero, alguien diría dos verdades o dos mentiras.`)
          : err('RMP72-choca', `p:${z}`, z, `Bien: probaste a ${z} en el primer puesto. Pero así, en cada orden posible, alguien dice dos verdades o dos mentiras.`);
      });
      errores.push(err('RMP78-nada', 'nada', 'No se puede saber', 'Bien: no sabías cuál frase de cada uno es la cierta. Pero al probar, queda un solo orden.'));
      const datos = ['Cada uno dice dos frases: una es cierta y la otra, falsa.', ...fr.map(y => `${y.de} dice: «${textoP(y.de, y.dos[0])}» y «${textoP(y.de, y.dos[1])}».`)];
      return { enunciado: [`${lista(gente)} llegaron en los ${n === 3 ? 'tres' : 'cuatro'} primeros puestos de la carrera del aniversario.`], pregunta: ['¿Quién ganó?'], datos,
        correcta: { clave: `p:${gana}`, texto: gana }, errores,
        solucion: [['Se supone cierta una frase de alguien: la otra queda falsa. Si algo choca, la cierta era la otra.'], [`Queda un solo orden: ${o.join(', ')}. Ganó `, v('x', gana), '.']],
        _datos: { forma: 'podio', gente, frases: datos.slice(1), pide: 'gana' } };
    }
    return null;
  }

  // ---- Tipos por idea ----
  const CONSTRUIR = { tarjetas: tarjetasT, cuatro, negar, edad, culpable, 'quien-miente': quienMiente, escondido, veraz5,
    podio: rng => podioTipo(rng, 3), podio4: rng => podioTipo(rng, 4), cuantos: rng => cuantosTipo(rng, 'cuantos'), 'por-lo-menos': rng => cuantosTipo(rng, 'menos') };
  const TIPOS_POR_IDEA = {
    suposicion: ['tarjetas', 'cuatro'],
    'negar-bien': ['negar', 'edad'],
    contradictorias: ['culpable', 'quien-miente'],
    'solo-uno-veraz': ['escondido', 'veraz5'],
    'verdad-y-mentira': ['podio', 'podio4'],
    'cuantos-mienten': ['cuantos', 'por-lo-menos'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { tarjetas: 2, cuatro: 3, negar: 1, edad: 3, culpable: 2, 'quien-miente': 3, escondido: 2, veraz5: 3, podio: 2, podio4: 3, cuantos: 2, 'por-lo-menos': 3 };
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»: 3 básicos, 3 intermedios y 2 avanzados).
  const PAPEL = { 'papel-1': 'negar', 'papel-2': 'tarjetas', 'papel-3': 'culpable', 'papel-4': 'escondido', 'papel-5': 'podio', 'papel-6': 'cuantos', 'papel-7': 'quien-miente', 'papel-8': 'edad' };
  const PRUEBA = ['culpable', 'escondido', 'tarjetas'];

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(`${ID}|${semilla}`);
    const prueba = /^(entrada|salida)-(\d+)$/.exec(String(semilla));
    let tipo;
    if (!o.idea && PAPEL[String(semilla)]) tipo = PAPEL[String(semilla)];
    else if (!o.idea && prueba) tipo = PRUEBA[(+prueba[2] - 1) % PRUEBA.length];
    else tipo = rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (!pr) continue;
      const alternativas = P.armarTexto({ correcta: pr.correcta, errores: pr.errores, rng });
      if (alternativas.length < 4) continue;
      return {
        id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD,
        variables: { x: { nombre: 'lo pedido, ya comprobado', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta.clave, texto: pr.correcta.texto, unidad: '' },
        _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, pr._datos),
      };
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Veraces, culpables y mentiras', generar, TIPOS_POR_IDEA, tiposPorUnidad: TIPOS_POR_UNIDAD };
});
