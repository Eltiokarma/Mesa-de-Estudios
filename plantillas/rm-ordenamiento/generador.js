/*
 * Generador «Filas, pisos y mesas»: práctica de «Ordenamiento de información»
 * (razonamiento-matematico.ordenamiento-de-informacion; contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js),
 * con los tipos separados por idea. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-ordenamiento']) y en Node (require).
 *
 * La fila y la mesa las resuelve el motor de «El tablero de las pistas» (plantillas/orden-informacion/motor.js, modos
 * `lineal` y `circular`), por fuerza bruta (regla 1): este archivo no copia su lógica, elige el arreglo y las pistas y
 * le pregunta al motor qué queda. Los pisos, las llegadas, las comparaciones, los montos y la mesa cuadrada se
 * resuelven aquí, también por fuerza bruta (todos los arreglos, y se quedan los que cumplen). En el navegador, si la
 * escena todavía no cargó el motor, lo carga del mismo servidor (como rm-cuadros).
 *
 * Tipos por idea (TIPOS_POR_IDEA; los id de las ideas de la teoría). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso.
 *   orden-lineal    fila (1) ¿quién va en el puesto k? · fila-segura (3) ¿cuál es necesariamente verdadera?
 *   posiciones      pisos (2) ¿en qué piso vive X?, con un bloque de distancia y pisos vacíos · llegada (2) ¿cuántos
 *                   llegaron entre X e Y?
 *   comparaciones   cadena (1) ¿quién es el k-ésimo? · no-mayor (3) «no es mayor que», con mellizos: ¿qué es seguro?
 *   con-numeros     montos (2) sobres de la rifa: una suma y una comparación · seguidas (3) edades seguidas, una suma y
 *                   una comparación (San Marcos 2024-I, 16)
 *   orden-circular  mesa (2) ¿quién se sienta a la derecha o a la izquierda de X? (5 o 6 personas)
 *   mesa-cuadrada   frente (3) mesa redonda de 6 con «frente a» · cuadrada (1) la silla de enfrente en la mesa cuadrada
 *
 * Convenciones, las de la teoría: los puestos de la fila se numeran de izquierda a derecha y todos miran hacia donde
 * mira el alumno; los pisos, desde abajo; en la mesa, todos miran al centro y la derecha de cada uno es la silla
 * siguiente contra el reloj; en la cuadrada, las sillas se numeran contra el reloj desde la de abajo a la izquierda.
 * Paleta de deducción: solo violeta (x), para lo pedido ya comprobado en la solución. Sin naranja, turquesa, verde ni
 * carmín. Las personas van por su nombre completo: las letras A a E son solo las de las alternativas.
 * Datos (contrato, punto 13): las reglas del problema, lo que quiere decir cada palabra de las pistas y las pistas, una
 * por línea; nunca el paso hecho ni la respuesta.
 * Errores (códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis; los mismos de la teoría):
 *   RMP72-pista   vale con todas las pistas menos una          RMP63-dos     choca con dos pistas o más
 *   RMP77-posible pasa en algún arreglo, no en todos           RMP78-nada    creer que faltan datos
 *   RMP140-lado   izquierda y derecha cambiadas                 RMP1-salto    la diferencia de puestos por los de en medio
 *   RMP64-reves   contar desde el otro extremo o dar vuelta una comparación
 *   RMP141-empate leer «no es mayor» como «es menor»           RMP142-frente media vuelta, mismo lado o esquina
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../orden-informacion/motor.js') : (root.MotorOrden || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../orden-informacion/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('rm-ordenamiento: no se pudo cargar el motor del orden');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorOrden) throw new Error('rm-ordenamiento: el motor del orden no se registró');
    return r.MotorOrden;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'rm-ordenamiento', UNIDAD = 'razonamiento-matematico.ordenamiento-de-informacion';
  const v = P.v;
  const lista = (xs, y = 'y') => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}`);
  const err = (id, clave, texto, explicacion) => ({ id, clave, texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const NUM = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco'];
  const ORD = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto'];
  const PIS = ps => ps.map((p, i) => `Pista ${i + 1}: ${p.t}`);
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Rosa', 'Iván', 'Leo'];   // ningún par empieza igual
  const FEM = new Set(['Ana', 'Dina', 'Eva', 'Rosa']);
  // Todos los arreglos de la gente en n lugares (null: lugar vacío).
  function arreglos(gente, n) {
    const out = [], ir = (pre, resto) => {
      if (pre.length === n) { if (!resto.length) out.push(pre); return; }
      if (n - pre.length > resto.length) ir(pre.concat(null), resto);
      resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1))));
    };
    ir([], gente);
    return out;
  }
  const lugar = (o, x) => o.indexOf(x) + 1;
  const quedan = (base, ps) => base.filter(o => ps.every(p => p.ok(o)));
  // Las pistas mínimas: se agregan mientras tachan algo y se quitan las que sobran. meta(q): ¿ya alcanza?
  function elegirPistas(rng, base, pozo, meta, max) {
    let ps = [];
    for (const p of rng.barajar(pozo)) {
      if (meta(quedan(base, ps))) break;
      if (quedan(base, ps.concat(p)).length < quedan(base, ps).length) ps.push(p);
    }
    if (!meta(quedan(base, ps))) return null;
    for (let i = ps.length - 1; i >= 0; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (meta(quedan(base, sin))) ps = sin; }
    return ps.length >= 2 && ps.length <= max ? ps : null;
  }
  // Por qué no vale lo que ninguna mesa o fila cumple: la pista sin la cual sí valdría.
  function porQueNo(base, ps, ok, dicho) {
    for (let i = 0; i < ps.length; i++) if (quedan(base, ps.filter((_, j) => j !== i)).some(ok)) return { id: 'RMP72-pista', ex: `Bien: cumple todas las pistas menos la ${i + 1}. Pero la pista ${i + 1} también cuenta: con todas, ${dicho}.` };
    return { id: 'RMP63-dos', ex: `Bien: revisaste las pistas una por una. Pero para eso tendrías que saltarte dos o más: con todas, ${dicho}.` };
  }
  const nada = (texto, ex) => err('RMP78-nada', 'nada', texto, ex);

  // ======================= Idea 1: la fila (motor, modo lineal) =======================
  const D_FILA = k => `Fila de ${k} puestos, numerados de izquierda a derecha; todos miran hacia donde miras tú.`;
  const D_PALABRAS = 'A la izquierda de: no obliga a ir pegados. Junto a: al lado, por cualquier lado. Inmediatamente: justo al lado.';
  const TXT_FILA = {
    izquierda: q => `${q.a} está a la izquierda de ${q.b}.`, derecha: q => `${q.a} está a la derecha de ${q.b}.`,
    inmDerecha: q => `${q.a} está inmediatamente a la derecha de ${q.b}.`, juntos: q => `${q.a} está junto a ${q.b}.`,
    noJuntos: q => `${q.a} no está junto a ${q.b}.`, extremo: q => `${q.a} está en un extremo.`, lugar: q => `${q.a} está en el puesto ${q.k}.`,
  };
  function casoFila(rng, k, quedanMax) {
    for (let intento = 0; intento < 300; intento++) {
      const gente = rng.barajar(GENTE).slice(0, k).sort(), sol = rng.barajar(gente), pos = x => sol.indexOf(x);
      const pozo = [];
      for (const a of gente) {
        if (pos(a) === 0 || pos(a) === k - 1) pozo.push({ tipo: 'extremo', a });
        for (const b of gente) if (a !== b) {
          if (pos(a) < pos(b)) pozo.push({ tipo: 'izquierda', a, b }); else pozo.push({ tipo: 'derecha', a, b });
          if (pos(a) === pos(b) + 1) pozo.push({ tipo: 'inmDerecha', a, b });
          if (a < b) pozo.push({ tipo: Math.abs(pos(a) - pos(b)) === 1 ? 'juntos' : 'noJuntos', a, b });
        }
      }
      pozo.push({ tipo: 'lugar', a: rng.elegir(gente), k: 0 }); pozo[pozo.length - 1].k = pos(pozo[pozo.length - 1].a) + 1;
      const pr = ps => ({ forma: 'lineal', personas: gente, pistas: ps });
      const base = M.resolver(pr([])).soluciones;
      const pistasOk = pozo.map(q => Object.assign({ t: TXT_FILA[q.tipo](q), ok: o => M.cumple(pr([]), q, o) }, { q }));
      const ps = elegirPistas(rng, base, pistasOk, q => q.length >= 1 && q.length <= quedanMax, 4);
      if (!ps || !ps.some(p => ['izquierda', 'derecha'].includes(p.q.tipo))) continue;
      const q = M.resolver(pr(ps.map(p => p.q))).soluciones;
      return { gente, k, ps, q, base, sol: q[0] };
    }
    return null;
  }
  function fila(rng) {
    const c = casoFila(rng, 5, 1);
    if (!c) return null;
    const dados = c.ps.filter(p => p.q.tipo === 'lugar').map(p => p.q.k), libres = [1, 2, 3, 4, 5].filter(k => !dados.includes(k)), k = rng.elegir(libres), x = c.sol[k - 1];
    const espejo = M.resolver(M.variante({ forma: 'lineal', personas: c.gente, pistas: c.ps.map(p => p.q) }, 'sentidoInvertido')).soluciones;
    const errores = [];
    for (const y of rng.barajar(c.gente.filter(y => y !== x))) {
      if (espejo.length === 1 && espejo[0][k - 1] === y) { errores.unshift(err('RMP140-lado', `p:${y}`, y, `Bien: usaste todas las pistas. Pero cambiaste izquierda y derecha: todos miran hacia donde miras tú, y así ${y} no va en el puesto ${k}.`)); continue; }
      const e = porQueNo(c.base, c.ps, o => o[k - 1] === y, `${y} no puede ir en el puesto ${k}`);
      errores.push(err(e.id, `p:${y}`, y, e.ex));
    }
    errores.splice(3);
    errores.push(nada('Faltan datos', `Bien: no diste nada por seguro sin probarlo. Pero las pistas dejan un solo orden: ${c.sol.join(', ')}.`));
    return { enunciado: [`${lista(c.gente)} miran el partido desde una banca de 5 puestos.`], pregunta: [`¿Quién va en el puesto ${k}?`],
      datos: [D_FILA(5), D_PALABRAS, ...PIS(c.ps)], correcta: { clave: `p:${x}`, texto: x }, errores,
      solucion: [[`Se prueban los puestos de quien sale en más pistas, y se tacha el que rompe alguna. Queda un solo orden: ${c.sol.join(', ')}.`], ['En el puesto ', String(k), ' va ', v('x', x), '.']],
      _datos: { forma: 'fila', gente: c.gente, n: 5, pistas: c.ps.map(p => p.t), pide: { t: 'puesto', k } } };
  }
  function filaSegura(rng) {
    const c = casoFila(rng, 5, 2);
    if (!c || c.q.length !== 2) return null;
    const af = [];
    for (const a of c.gente) {
      for (let j = 1; j <= 5; j++) af.push({ t: `${a} está en el puesto ${j}`, ok: o => o[j - 1] === a });
      for (const b of c.gente) if (a < b) af.push({ t: `${a} está junto a ${b}`, ok: o => Math.abs(o.indexOf(a) - o.indexOf(b)) === 1 });
    }
    const util = af.filter(x => !c.ps.some(p => c.base.filter(p.ok).every(x.ok)));
    const n = x => c.q.filter(x.ok).length;
    const seguras = util.filter(x => n(x) === 2), posibles = util.filter(x => n(x) === 1), nunca = util.filter(x => n(x) === 0);
    if (!seguras.length || posibles.length < 2 || !nunca.length) return null;
    const ok = rng.elegir(seguras), errores = [];
    for (const x of rng.barajar(posibles).slice(0, 2)) errores.push(err('RMP77-posible', `a:${x.t}`, x.t, `Bien: pasa en uno de los 2 órdenes que quedan. Pero en el otro no pasa: es posible, no necesario.`));
    const x = rng.elegir(nunca), e = porQueNo(c.base, c.ps, x.ok, 'ningún orden lo cumple');
    errores.push(err(e.id, `a:${x.t}`, x.t, e.ex));
    errores.push(nada('Ninguna: faltan pistas', `Bien: las pistas no dicen todo el orden. Pero en los 2 órdenes que quedan, ${ok.t.charAt(0).toLowerCase() + ok.t.slice(1)}.`));
    return { enunciado: [`${lista(c.gente)} se sientan en la primera fila del auditorio, de 5 puestos.`], pregunta: ['¿Cuál es necesariamente verdadera?'],
      datos: [D_FILA(5), D_PALABRAS, ...PIS(c.ps)], correcta: { clave: `a:${ok.t}`, texto: ok.t }, errores,
      solucion: [[`Quedan 2 órdenes: ${c.q.map(o => o.join(', ')).join(' y ')}.`], ['En los dos, ', v('x', ok.t.charAt(0).toLowerCase() + ok.t.slice(1)), '.']],
      _datos: { forma: 'fila', gente: c.gente, n: 5, pistas: c.ps.map(p => p.t), pide: { t: 'segura', opciones: [ok.t].concat(errores.map(z => z.texto)) } } };
  }

  // ======================= Idea 2: pisos y llegadas =======================
  const pisosTxt = k => `${NUM[k]} ${k === 1 ? 'piso' : 'pisos'}`, puestosTxt = k => `${NUM[k]} ${k === 1 ? 'puesto' : 'puestos'}`;
  function pisos(rng) {
    const n = 5, gente = rng.barajar(GENTE).slice(0, 3).sort(), base = arreglos(gente, n), sol = rng.elegir(base);
    const [x, y] = rng.barajar(gente), d = lugar(sol, x) - lugar(sol, y);
    if (Math.abs(d) < 2) return null;
    const bloque = d > 0 ? { t: `${x} vive ${pisosTxt(d)} más arriba que ${y}.`, ok: o => lugar(o, x) - lugar(o, y) === d } : { t: `${x} vive ${pisosTxt(-d)} más abajo que ${y}.`, ok: o => lugar(o, y) - lugar(o, x) === -d };
    const pozo = [];
    for (const a of gente) {
      if (![x, y].includes(a)) pozo.push({ t: `${a} vive en el piso ${lugar(sol, a)}.`, ok: o => lugar(o, a) === lugar(sol, a) });
      for (let p = 1; p <= n; p++) if (p !== lugar(sol, a)) pozo.push({ t: `${a} no vive en el piso ${p}.`, ok: o => lugar(o, a) !== p });
      for (const b of gente) if (a !== b && lugar(sol, a) > lugar(sol, b) && !([x, y].includes(a) && [x, y].includes(b))) pozo.push({ t: `${a} vive más arriba que ${b}.`, ok: o => lugar(o, a) > lugar(o, b) });
    }
    const resto = elegirPistas(rng, quedan(base, [bloque]), pozo, q => q.length === 1, 3);
    if (!resto) return null;
    const ps = [bloque].concat(resto), q = quedan(base, ps), z = rng.elegir([x, y]), p = lugar(q[0], z);
    const errores = [];
    const hueco = quedan(base, [d > 0 ? { ok: o => lugar(o, x) - lugar(o, y) === d + 1 } : { ok: o => lugar(o, y) - lugar(o, x) === 1 - d }].concat(resto));
    if (hueco.length === 1 && lugar(hueco[0], z) !== p) errores.push(err('RMP1-salto', `p:${lugar(hueco[0], z)}`, `En el piso ${lugar(hueco[0], z)}`, `Bien: armaste el bloque. Pero contaste ${pisosTxt(Math.abs(d))} en medio: «${pisosTxt(Math.abs(d))} más» es la diferencia, con uno menos en medio.`));
    for (let r = 1; r <= n; r++) if (r !== p && !errores.some(e => e.clave === `p:${r}`)) { const e = porQueNo(base, ps, o => lugar(o, z) === r, `${z} no puede vivir en el piso ${r}`); errores.push(err(e.id, `p:${r}`, `En el piso ${r}`, e.ex)); }
    errores.splice(3);
    errores.push(nada('Faltan datos', 'Bien: no diste nada por seguro sin probarlo. Pero al probar cada lugar del bloque queda uno solo.'));
    return { enunciado: [`${lista(gente)} viven en un edificio de ${n} pisos.`], pregunta: [`¿En qué piso vive ${z}?`],
      datos: [`Edificio de ${n} pisos, contados desde abajo: el piso 1 da a la calle.`, 'En cada piso vive una sola persona, o ninguna: puede haber pisos vacíos.', ...PIS(ps)],
      correcta: { clave: `p:${p}`, texto: `En el piso ${p}` }, errores,
      solucion: [[`El bloque de ${x} y ${y} se prueba en cada lugar donde cabe; las otras pistas dejan uno solo.`], [`${lista(gente.map(g => `${g} vive en el ${lugar(q[0], g)}`))}. `, v('x', `${z}, en el piso ${p}`), '.']],
      _datos: { forma: 'pisos', gente, n, pistas: ps.map(t => t.t), pide: { t: 'lugar', x: z } } };
  }
  function llegada(rng) {
    const n = 5 + rng.entero(0, 1), gente = rng.barajar(GENTE).slice(0, n).sort(), base = arreglos(gente, n), sol = rng.elegir(base);
    const pozo = [];
    for (const a of gente) {
      if (lugar(sol, a) !== 1) pozo.push({ t: `${a} no llegó primero.`, ok: o => lugar(o, a) !== 1 });
      for (const b of gente) if (a !== b) {
        if (lugar(sol, a) < lugar(sol, b)) pozo.push({ t: `${a} llegó antes que ${b}.`, ok: o => lugar(o, a) < lugar(o, b) });
        const d = lugar(sol, a) - lugar(sol, b);
        if (d === 1) pozo.push({ t: `${a} llegó justo después de ${b}.`, ok: o => lugar(o, a) - lugar(o, b) === 1 });
        if (d >= 2) pozo.push({ t: `${a} llegó ${puestosTxt(d)} después que ${b}.`, ok: o => lugar(o, a) - lugar(o, b) === d });
      }
    }
    let par = null;
    const meta = q => { if (!q.length || q.length > 3) return false; par = null;
      for (const a of gente) for (const b of gente) if (a < b) { const m = new Set(q.map(o => Math.abs(lugar(o, a) - lugar(o, b)) - 1)); if (m.size === 1 && [...m][0] >= 1) par = par || [a, b, [...m][0]]; }
      return !!par; };
    const ps = elegirPistas(rng, base, pozo, meta, 4);
    if (!ps) return null;
    meta(quedan(base, ps));
    const [a, b, m] = par;
    if (ps.some(p => p.t.startsWith(`${a} llegó`) && p.t.includes(b) && /puestos? después/.test(p.t)) || ps.some(p => p.t.startsWith(`${b} llegó`) && p.t.includes(a) && /puestos? después/.test(p.t))) return null;
    const errores = [err('RMP1-salto', `n:${m + 1}`, String(m + 1), `Bien: ubicaste a ${a} y a ${b}. Pero ${m + 1} es la diferencia de sus puestos: en medio llega uno menos.`),
      err('RMP1-salto', `n:${m + 2}`, String(m + 2), `Bien: contaste los puestos de en medio. Pero contaste también a ${a} y a ${b}, que no llegaron entre ellos.`)];
    if (m > 1) errores.push(err('RMP63-dos', `n:${m - 1}`, String(m - 1), 'Bien: contaste a los de en medio. Pero dejaste fuera a uno: revisa cada puesto entre los dos.'));
    errores.push(nada('No se puede saber', `Bien: no se sabe el orden completo. Pero en todos los órdenes que quedan, entre ${a} y ${b} llegan ${m}.`));
    return { enunciado: [`${lista(gente)} corren la carrera del aniversario.`], pregunta: [`¿Cuántos llegaron entre ${a} y ${b}?`],
      datos: [`Carrera de ${n}, sin empates: el puesto 1 es de quien llegó primero.`, ...PIS(ps)],
      correcta: { clave: `n:${m}`, texto: String(m) }, errores,
      solucion: [[`Quedan ${quedan(base, ps).length === 1 ? 'un orden' : `${quedan(base, ps).length} órdenes`}: ${quedan(base, ps).map(o => o.join(', ')).join('; ')}.`], [`En ${quedan(base, ps).length === 1 ? 'él' : 'todos'}, entre ${a} y ${b} llegan `, v('x', String(m)), '.']],
      _datos: { forma: 'llegada', gente, n, pistas: ps.map(p => p.t), pide: { t: 'entre', a, b } } };
  }

  // ======================= Idea 3: comparaciones =======================
  function cadena(rng) {
    const gente = rng.barajar(GENTE).slice(0, 4).sort(), sol = rng.barajar(gente);   // del menor al mayor
    const ps = rng.barajar(sol.slice(1).map((x, i) => (rng.sig() < 0.5 ? { t: `${x} es mayor que ${sol[i]}.` } : { t: `${sol[i]} es menor que ${x}.` })));
    const desdeMayor = rng.sig() < 0.5, k = rng.entero(1, 2), x = desdeMayor ? sol[3 - k] : sol[k], otro = desdeMayor ? sol[k] : sol[3 - k];
    const extremo = desdeMayor ? sol[3] : sol[0];
    const errores = [err('RMP64-reves', `p:${otro}`, otro, `Bien: armaste la cadena. Pero contaste desde el ${desdeMayor ? 'menor' : 'mayor'}: piden contar desde el ${desdeMayor ? 'mayor' : 'menor'}.`),
      err('RMP61-extremo', `p:${extremo}`, extremo, `Bien: ${extremo} es el ${desdeMayor ? 'mayor' : 'menor'} de todos. Pero ahí empieza la cuenta: piden el ${ORD[k]}.`)];
    const resto = gente.find(y => ![x, otro, extremo].includes(y));
    if (resto) errores.push(err('RMP72-pista', `p:${resto}`, resto, `Bien: lo ubicaste en la cadena. Pero cuenta otra vez los lugares desde el ${desdeMayor ? 'mayor' : 'menor'}.`));
    errores.push(nada('No se puede saber', 'Bien: ninguna pista lo dice sola. Pero las tres forman una sola cadena de cuatro: sí se sabe.'));
    return { enunciado: [`${lista(gente)} son primos.`], pregunta: [`¿Quién es el ${ORD[k]} contando desde el ${desdeMayor ? 'mayor' : 'menor'}?`],
      datos: ['Las edades son distintas: no hay dos de la misma edad.', ...PIS(ps)], correcta: { clave: `p:${x}`, texto: x }, errores,
      solucion: [['Cada pista es una flecha del menor al mayor; las tres se encadenan.'], [`Del menor al mayor: ${sol.join(', ')}. El ${ORD[k]} desde el ${desdeMayor ? 'mayor' : 'menor'} es `, v('x', x), '.']],
      _datos: { forma: 'edades', gente, pistas: ps.map(p => p.t), pide: { t: 'kesimo', k, desdeMayor } } };
  }
  function noMayor(rng) {
    const [a, b, c] = rng.barajar(GENTE).slice(0, 3), gente = [a, b, c].sort(), arriba = rng.sig() < 0.5;
    const ps = arriba ? [{ t: `${a} no es mayor que ${b}.` }, { t: `${c} es mayor que ${b}.` }] : [{ t: `${a} no es menor que ${b}.` }, { t: `${c} es menor que ${b}.` }];
    const bien = arriba ? `${a} es menor que ${c}` : `${a} es mayor que ${c}`;
    const errores = [err('RMP141-empate', `a:1`, arriba ? `${a} es menor que ${b}` : `${a} es mayor que ${b}`, `Bien: leíste la pista 1. Pero «no es ${arriba ? 'mayor' : 'menor'}» deja también el empate: pueden ser mellizos.`),
      err('RMP77-posible', 'a:2', `${a} y ${b} tienen la misma edad`, 'Bien: puede pasar. Pero también puede no pasar: es posible, no seguro.'),
      err('RMP64-reves', 'a:3', arriba ? `${b} es menor que ${a}` : `${b} es mayor que ${a}`, `Bien: comparaste a los dos. Pero diste vuelta la pista 1: ${a} no es ${arriba ? 'mayor' : 'menor'} que ${b}.`),
      nada('Nada: faltan las edades', `Bien: no se sabe cuántos años tiene nadie. Pero las flechas alcanzan: ${bien}.`)];
    return { enunciado: [`${lista(gente)} son hermanos; en la familia puede haber mellizos.`], pregunta: ['¿Qué es seguro?'],
      datos: ['Mellizos: hermanos de la misma edad.', ...PIS(ps)], correcta: { clave: 'a:0', texto: bien }, errores,
      solucion: [[arriba ? `${a} tiene la edad de ${b} o es menor; ${c} es mayor que ${b}.` : `${a} tiene la edad de ${b} o es mayor; ${c} es menor que ${b}.`], ['En los dos casos, ', v('x', bien), '.']],
      _datos: { forma: 'empates', gente, pistas: ps.map(p => p.t), pide: { t: 'segura', opciones: [bien].concat(errores.map(e => e.texto)) } } };
  }

  // ======================= Idea 4: sumas y diferencias =======================
  const TRIOS = [[20, 50, 100], [10, 20, 50], [50, 100, 200], [10, 50, 100], [20, 100, 200], [10, 20, 100]];
  const SEGUIDAS = [[13, 14, 15, 16], [14, 15, 16, 17], [15, 16, 17, 18]];
  function permutar(xs) { return xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permutar(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))); }
  function montos(rng) {
    const trio = rng.elegir(TRIOS), gente = rng.barajar(GENTE).slice(0, 3).sort(), rep = rng.barajar(trio), [a, b, c] = rng.barajar([0, 1, 2]);
    const [mas, menos] = rep[b] > rep[c] ? [b, c] : [c, b], x = rng.sig() < 0.5 ? b : c, otro = x === b ? c : b, suma = rep[b] + rep[c];
    if (trio.some((u, i) => trio.some((w, j) => i < j && u + w === suma && !(u === rep[b] && w === rep[c]) && !(w === rep[b] && u === rep[c])))) return null;
    const ps = rng.barajar([{ t: `${gente[b]} y ${gente[c]} juntos recibieron ${suma} soles.` }, { t: `${gente[mas]} recibió más que ${gente[menos]}.` }]);
    const errores = [err('RMP64-reves', `s:${rep[otro]}`, `${rep[otro]} soles`, `Bien: hallaste el par de la suma. Pero diste vuelta la comparación: ${gente[mas]} recibió más que ${gente[menos]}.`),
      err('RMP72-pista', `s:${rep[a]}`, `${rep[a]} soles`, `Bien: miraste los tres sobres. Pero ese es de ${gente[a]}: con él, ${gente[b]} y ${gente[c]} no suman ${suma}.`),
      nada('No se puede saber', 'Bien: la suma sola deja dos repartos. Pero la comparación tacha uno.')];
    return { enunciado: [`Tres sobres de la rifa del aniversario, con ${lista(trio.map(String))} soles, uno para cada uno: ${lista(gente)}.`], pregunta: [`¿Cuánto recibió ${gente[x]}?`],
      datos: ['Cada persona recibe un solo sobre.', ...PIS(ps)], correcta: { clave: `s:${rep[x]}`, texto: `${rep[x]} soles` }, errores,
      solucion: [[`De las sumas de dos sobres, solo ${Math.min(rep[b], rep[c])} + ${Math.max(rep[b], rep[c])} da ${suma}: son de ${gente[b]} y ${gente[c]}.`], [`${gente[mas]} recibió más: ${gente[x]} recibió `, v('x', `${rep[x]} soles`), '.']],
      _datos: { forma: 'montos', gente, valores: trio, pistas: ps.map(p => p.t), pide: { t: 'valor', x: gente[x] } } };
  }
  function seguidas(rng) {
    const vals = rng.elegir(SEGUIDAS), gente = rng.barajar(GENTE).slice(0, 4).sort(), rep = rng.barajar(vals), [a, b, c, d] = rng.barajar([0, 1, 2, 3]), suma = rep[a] + rep[b];
    const [m3, m4] = rep[c] > rep[d] ? [c, d] : [d, c];
    const ps = [{ t: `Las edades de ${gente[a]} y ${gente[b]} suman ${suma} años.`, ok: y => y[a] + y[b] === suma }, { t: `${gente[m3]} es mayor que ${gente[m4]}.`, ok: y => y[m3] > y[m4] }];
    const q = permutar(vals).filter(y => ps.every(p => p.ok(y))), x = rng.elegir([c, d]);
    if (!q.length || !q.every(y => y[x] === rep[x])) return null;
    const otro = x === c ? d : c;
    const errores = [err('RMP64-reves', `e:${rep[otro]}`, `${rep[otro]} años`, `Bien: separaste el par de la suma. Pero esa es la edad de ${gente[otro]}: diste vuelta la pista 2.`)];
    for (const k of [a, b]) if (!errores.some(e => e.clave === `e:${rep[k]}`)) errores.push(err('RMP72-pista', `e:${rep[k]}`, `${rep[k]} años`, `Bien: usaste las edades dadas. Pero ${rep[k]} es de ${gente[a]} o de ${gente[b]}, el par que suma ${suma}.`));
    errores.push(nada('No se puede saber', 'Bien: la suma no dice quién es quién. Pero sí dice qué par es, y la comparación ordena el otro.'));
    return { enunciado: [`${lista(gente)} tienen ${lista(vals.map(String))} años, no se sabe quién cuántos.`], pregunta: [`¿Cuántos años tiene ${gente[x]}?`],
      datos: ['Cada uno tiene una de esas edades, y no se repiten.', ...PIS(ps)], correcta: { clave: `e:${rep[x]}`, texto: `${rep[x]} años` }, errores,
      solucion: [[`Solo ${Math.min(rep[a], rep[b])} + ${Math.max(rep[a], rep[b])} da ${suma}: son de ${gente[a]} y ${gente[b]}.`], [`A los otros dos les quedan las otras edades, y la pista 2 las ordena: ${gente[x]} tiene `, v('x', `${rep[x]} años`), '.']],
      _datos: { forma: 'montos', gente, valores: vals, pistas: ps.map(p => p.t), pide: { t: 'valor', x: gente[x] } } };
  }

  // ======================= Ideas 5 y 6: la mesa (motor, modo circular) =======================
  const D_MESA = n => `Mesa redonda de ${n} sillas, sin numerar; todos miran al centro.`;
  const D_DER = 'A la derecha de: en la silla de al lado, del lado de su mano derecha.';
  const TXT_MESA = {
    inmDerecha: q => `${q.a} se sienta a la derecha de ${q.b}.`, inmIzquierda: q => `${q.a} se sienta a la izquierda de ${q.b}.`,
    juntos: q => `${q.a} se sienta junto a ${q.b}.`, noJuntos: q => `${q.a} no se sienta junto a ${q.b}.`, frente: q => `${q.a} se sienta frente a ${q.b}.`,
  };
  function casoMesa(rng, n, conFrente) {
    for (let intento = 0; intento < 300; intento++) {
      const gente = rng.barajar(GENTE).slice(0, n).sort(), sol = [gente[0]].concat(rng.barajar(gente.slice(1))), pos = x => sol.indexOf(x);
      const pozo = [];
      for (const a of gente) for (const b of gente) if (a !== b) {
        if (pos(a) === (pos(b) + 1) % n) pozo.push({ tipo: 'inmDerecha', a, b }, { tipo: 'inmIzquierda', a: b, b: a });
        if (a < b) { const d = (pos(a) - pos(b) + n) % n; pozo.push({ tipo: d === 1 || d === n - 1 ? 'juntos' : 'noJuntos', a, b }); if (conFrente && d === n / 2) pozo.push({ tipo: 'frente', a, b }); }
      }
      const pr = qs => ({ forma: 'circular', personas: gente, pistas: qs });
      const base = M.resolver(pr([])).soluciones;
      const cand = pozo.map(q => ({ q, t: TXT_MESA[q.tipo](q), ok: o => M.cumple(pr([]), q, o) }));
      const ps = elegirPistas(rng, base, cand, q => q.length === 1, conFrente ? 3 : 4);
      if (!ps || (conFrente && !ps.some(p => p.q.tipo === 'frente')) || !ps.some(p => /Derecha|Izquierda/.test(p.q.tipo))) continue;
      return { gente, n, ps, base, sol: M.resolver(pr(ps.map(p => p.q))).soluciones[0] };
    }
    return null;
  }
  function mesa(rng) {
    const n = 5 + rng.entero(0, 1), c = casoMesa(rng, n, false);
    if (!c) return null;
    const der = rng.sig() < 0.5, x = rng.elegir(c.gente), o = c.sol, i = o.indexOf(x), bien = o[(i + (der ? 1 : n - 1)) % n], otro = o[(i + (der ? n - 1 : 1)) % n];
    const errores = [err('RMP140-lado', `p:${otro}`, otro, `Bien: ${otro} se sienta junto a ${x}. Pero del otro lado: mirando al centro, la derecha va contra el reloj.`)];
    for (const y of rng.barajar(c.gente.filter(y => ![x, bien, otro].includes(y))).slice(0, 2)) {
      const e = porQueNo(c.base, c.ps, z => z[(z.indexOf(x) + (der ? 1 : n - 1)) % n] === y, `${y} no queda a la ${der ? 'derecha' : 'izquierda'} de ${x}`);
      errores.push(err(e.id, `p:${y}`, y, e.ex));
    }
    errores.push(nada('Faltan datos', 'Bien: no diste nada por seguro sin probarlo. Pero las pistas dejan una sola mesa.'));
    return { enunciado: [`${lista(c.gente)} almuerzan en una mesa redonda.`], pregunta: [`¿Quién se sienta a la ${der ? 'derecha' : 'izquierda'} de ${x}?`],
      datos: [D_MESA(n), D_DER, ...PIS(c.ps)], correcta: { clave: `p:${bien}`, texto: bien }, errores,
      solucion: [[`Se fija a ${o[0]} y se sienta a cada uno desde ahí. Contra el reloj, queda una sola mesa: ${o.join(', ')}.`], [`A la ${der ? 'derecha' : 'izquierda'} de ${x} se sienta `, v('x', bien), '.']],
      _datos: { forma: 'mesa', gente: c.gente, n, pistas: c.ps.map(p => p.t), pide: { t: der ? 'derecha' : 'izquierda', x } } };
  }
  function frente(rng) {
    const c = casoMesa(rng, 6, true);
    if (!c) return null;
    const o = c.sol, x = rng.elegir(c.gente.filter(y => !c.ps.some(p => p.q.tipo === 'frente' && [p.q.a, p.q.b].includes(y))));
    if (!x) return null;
    const i = o.indexOf(x), bien = o[(i + 3) % 6], vecinos = [o[(i + 2) % 6], o[(i + 4) % 6]].filter(y => y !== x);
    const errores = vecinos.map(y => err('RMP1-salto', `p:${y}`, y, `Bien: cruzaste la mesa. Pero contaste una silla de más o de menos: ${y} está junto a quien queda frente a ${x}.`));
    const resto = c.gente.find(y => ![x, bien, ...vecinos].includes(y));
    if (resto) { const e = porQueNo(c.base, c.ps, z => z[(z.indexOf(x) + 3) % 6] === resto, `${resto} no queda frente a ${x}`); errores.push(err(e.id, `p:${resto}`, resto, e.ex)); }
    errores.push(nada('Faltan datos', 'Bien: no diste nada por seguro sin probarlo. Pero las pistas dejan una sola mesa.'));
    return { enunciado: [`${lista(c.gente)} almuerzan en una mesa redonda de 6 sillas.`], pregunta: [`¿Quién se sienta frente a ${x}?`],
      datos: [D_MESA(6), D_DER, '«Frente a»: la silla que se mira al cruzar la mesa.', ...PIS(c.ps)], correcta: { clave: `p:${bien}`, texto: bien }, errores,
      solucion: [[`Queda una sola mesa: ${o.join(', ')}, contra el reloj desde ${o[0]}.`], ['En la redonda de 6, frente a cada uno está quien queda a media vuelta: frente a ', x, ' se sienta ', v('x', bien), '.']],
      _datos: { forma: 'mesa', gente: c.gente, n: 6, pistas: c.ps.map(p => p.t), pide: { t: 'frente', x } } };
  }
  // La mesa cuadrada: k sillas por lado, numeradas contra el reloj desde la de abajo a la izquierda.
  const frQ = (i, k) => { const lado = Math.floor(i / k), j = i % k; return ((lado + 2) % 4) * k + (k - 1 - j); };
  function cuadrada(rng) {
    const k = rng.entero(2, 3), N = 4 * k, i = rng.entero(0, N - 1), fr = frQ(i, k), mv = (i + N / 2) % N;
    const lado = Math.floor(i / k), mismo = lado * k + ((i % k + 1) % k), esq = i % k === 0 ? (i + N - 1) % N : i % k === k - 1 ? (i + 1) % N : null;
    if (mv === fr) return null;
    const errores = [err('RMP142-frente', `s:${mv}`, `La ${mv + 1}`, 'Bien: buscaste la silla del otro lado. Pero tomaste la media vuelta, como en la redonda: en la cuadrada queda en diagonal.'),
      err('RMP142-frente', `s:${mismo}`, `La ${mismo + 1}`, `Bien: ${mismo + 1} está cerca de la ${i + 1}. Pero comparte su lado: frente es el lado opuesto.`)];
    if (esq !== null && ![fr, mv, mismo].includes(esq)) errores.push(err('RMP142-frente', `s:${esq}`, `La ${esq + 1}`, `Bien: la ${esq + 1} es vecina de la ${i + 1}. Pero está al doblar la esquina, en otro lado.`));
    errores.push(nada('Ninguna: depende de cómo se sienten', 'Bien: en una mesa con un número impar de sillas redondas, nadie queda justo enfrente. Pero esta es cuadrada y con sillas pares.'));
    return { enunciado: [`En el compartir del aula juntan carpetas en una mesa cuadrada, con ${k === 2 ? 'dos' : 'tres'} sillas por lado, numeradas del 1 al ${N}.`], pregunta: [`¿Qué silla queda frente a la ${i + 1}?`],
      datos: [`Sillas numeradas contra el reloj desde la de abajo a la izquierda.`, '«Frente a»: la silla que se mira al cruzar la mesa.'],
      correcta: { clave: `s:${fr}`, texto: `La ${fr + 1}` }, errores,
      solucion: [[`La ${i + 1} está en el lado ${['de abajo', 'derecho', 'de arriba', 'izquierdo'][lado]}. Frente a ella, el lado ${['de arriba', 'izquierdo', 'de abajo', 'derecho'][lado]}, alineada.`], ['Frente a la ', String(i + 1), ' está la ', v('x', String(fr + 1)), '.']],
      _datos: { forma: 'cuadrada', k, pide: { t: 'frente', i } } };
  }

  // ---- Tipos por idea ----
  const CONSTRUIR = { fila, 'fila-segura': filaSegura, pisos, llegada, cadena, 'no-mayor': noMayor, montos, seguidas, mesa, frente, cuadrada };
  const TIPOS_POR_IDEA = {
    'orden-lineal': ['fila', 'fila-segura'],
    posiciones: ['pisos', 'llegada'],
    comparaciones: ['cadena', 'no-mayor'],
    'con-numeros': ['montos', 'seguidas'],
    'orden-circular': ['mesa'],
    'mesa-cuadrada': ['frente', 'cuadrada'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { fila: 1, 'fila-segura': 3, pisos: 2, llegada: 2, cadena: 1, 'no-mayor': 3, montos: 2, seguidas: 3, mesa: 2, frente: 3, cuadrada: 1 };
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): uno de cada idea, del más fácil al de examen.
  const PAPEL = { 'papel-1': 'cadena', 'papel-2': 'cuadrada', 'papel-3': 'fila', 'papel-4': 'pisos', 'papel-5': 'montos', 'papel-6': 'mesa', 'papel-7': 'fila-segura', 'papel-8': 'seguidas' };
  // Las pruebas de entrada y salida del curso: formas paralelas, el mismo tipo en el mismo lugar.
  const PRUEBA = ['fila', 'mesa', 'llegada'];

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
  return { id: ID, titulo: 'Filas, pisos y mesas', generar, TIPOS_POR_IDEA, tiposPorUnidad: TIPOS_POR_UNIDAD, calc: { frQ, arreglos } };
});
