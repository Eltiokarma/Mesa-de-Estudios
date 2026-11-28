/*
 * Teoría de «Ordenamiento de información» (razonamiento-matematico.ordenamiento-de-informacion). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Etapa 5 del plan de calidad (docs/plan-calidad.md §7), segunda unidad de la rama «Lógica», después
 * de Razonamiento deductivo. Propuesta: docs/etapa5/propuesta-razonamiento-matematico.md (Gerson delegó el criterio y
 * revisa después). Seis ideas: 1. orden-lineal «Ordenar en una fila» (la banca, fase 2) · 2. posiciones «Pisos y puestos
 * de llegada» (el edificio) · 3. comparaciones «Más que, menos que» (la formación por talla) · 4. con-numeros «Ordenar con
 * sumas y diferencias» (los sobres de la rifa) · 5. orden-circular «La mesa redonda» (el almuerzo, con cucharas) ·
 * 6. mesa-cuadrada «Frente a frente» (la mesa del compartir). Las ideas 2 a 6 se escribieron en la fase 3 (19 nov). Los
 * ids publicados no cambian. La unidad declara calidad: 2 desde el 19 nov (la marcó la sesión después del lector en frío y
 * el auditor); su prueba propia comprueba que pasaría.
 * Público: 5.º de secundaria y preuniversitario.
 *
 * Paleta de deducción (la de la rama Lógica, decisión de Gerson del 17 nov para Razonamiento deductivo): un papel fijo
 * por color en la teoría, los ejemplos, la escena y la práctica.
 *   tinta ....... lo que amarra: personas, puestos, pisos, pistas, la banca, el edificio, los sobres, la mesa
 *   f violeta ... lo seguro y lo pedido, ya comprobado (antes de comprobar, en tinta o «?»)
 *   gris ........ lo descartado: el orden tachado (tinta al 55 %, con su raya)
 *   o naranja e i turquesa, solo en las mesas (ideas 5 y 6): la referencia, desde quién se mide (naranja), y la flecha
 *   de «a la derecha» o la línea de «frente a», hacia dónde se mide (turquesa). Sin verde ni carmín en toda la unidad.
 *   La pieza rm-orden fija esos papeles y ordenamiento-de-informacion.test.js falla si una figura de antes de responder
 *   trae violeta, o si naranja o turquesa salen fuera de la mesa.
 * Letras y símbolos: los números bajo la banca son los puestos, de izquierda a derecha; los pisos se cuentan desde abajo;
 * las sillas de la mesa, contra el reloj desde la de abajo (en la cuadrada, desde la de abajo a la izquierda); «+2» junto
 * al edificio es el bloque de «dos pisos más arriba»; la flecha de la formación va del más bajo al más alto. Las personas
 * nunca se abrevian por su inicial. Las alternativas de los ejemplos tipo examen van en su propia línea (campo
 * alternativas, A a E; la letra correcta, 6 veces cada una en los 30 de nivel examen).
 * La fila se ve de espaldas: todos miran hacia donde mira el alumno. En la mesa, todos miran al centro: la derecha de
 * cada uno es la silla siguiente contra el reloj; quien está arriba, de cara al alumno, tiene su derecha a la izquierda
 * del dibujo (la cuchara lo muestra).
 * Errores: códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis (no hay datos de alumnos): RMP1
 * diferencia por lugares de en medio, RMP61 el extremo, RMP63 saltarse una pista, RMP64 al revés, RMP72 quedarse con algo
 * que choca con una pista, RMP77 lo posible por lo necesario, RMP78 creer que no se deduce nada, RMP88 «a la izquierda
 * de» como «inmediatamente», RMP89 «junto a» con un lado fijo, RMP140 izquierda por derecha, RMP141 «no es mayor» sin el
 * empate, RMP142 «frente» en la mesa con lados, RMP143 la comparación llevada en el mismo sentido al otro par.
 * Historia: Boole (SEP). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: ordenar a cuatro o cinco personas en una fila con pistas y decir qué puesto ya es seguro.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice qué permite cada pista («a la izquierda de» ordena, «junto a» pega) y qué puesto coincide
 *     en todos los órdenes que quedan.
 *   Orden de atención: 1.º la banca y sus puestos · 2.º la lista de órdenes y lo que se tacha · acción: el control «Pistas».
 *   Estados: juego sin pistas · pistas agregadas · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «"a la izquierda de" ¿quiere decir "junto a"?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (vistos.has(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }
  function permutaciones(xs) {
    if (xs.length <= 1) return [xs.slice()];
    return xs.flatMap((x, i) => permutaciones(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p)));
  }

  const plural = (n, uno, varios) => `${f(n, 0)} ${n === 1 ? uno : varios}`;
  // ---------- Idea 1: ordenar en una fila (etapa 5, 19 nov; docs/etapa5/propuesta-razonamiento-matematico.md) ----------
  // Objeto de la primera pantalla: la banca frente a la cancha del campeonato del colegio, vista desde atrás (rm-orden,
  // escena «banca», dibujo de prueba). Dina ya ocupa el puesto 4; Ana, Beto y Ciro esperan de pie. Cambia: cuántas pistas
  // se usan. · Permanece: los 6 órdenes, alineados con los puestos. · Progresa: los órdenes tachados. · Se reserva: dos
  // «junto a» que dejan a alguien en medio (la predicción; el juego muestra que «a la izquierda de» no pega). · Debe
  // verse: un puesto queda fijo antes de saberlo todo, cuando todos los órdenes que quedan coinciden ahí.
  // Todo lo que se ve sale de contar órdenes (permutar, cumplen, fijosDe): ningún tachado ni marco se escribe a mano.
  const OR = 'rm-orden';
  const F = t => ({ v: 'c-f', t });   // lo seguro y lo pedido, en violeta (paleta de deducción)
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const sinPunto = t => t.replace(/\.$/, '');
  const permCache = {};
  const permutar = xs => {
    const key = xs.join('|');
    if (!permCache[key]) {
      const out = [], ir = (pre, resto) => { if (!resto.length) { out.push(pre); return; } resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1)))); };
      ir([], xs);
      permCache[key] = out;
    }
    return permCache[key];
  };
  const en = (o, x) => o.indexOf(x);
  const pegados = (o, a, b) => Math.abs(en(o, a) - en(o, b)) === 1;
  // Las pistas de la fila. Cada una dice cómo se lee (t) y qué órdenes cumple (ok). «A la izquierda de» solo ordena;
  // «junto a» solo pega; «inmediatamente» hace las dos cosas.
  const PZ = {
    izq: (a, b) => ({ tipo: 'izq', a, b, t: `${a} está a la izquierda de ${b}.`, ok: o => en(o, a) < en(o, b) }),
    der: (a, b) => ({ tipo: 'der', a, b, t: `${a} está a la derecha de ${b}.`, ok: o => en(o, a) > en(o, b) }),
    inmIzq: (a, b) => ({ tipo: 'inmIzq', a, b, t: `${a} está inmediatamente a la izquierda de ${b}.`, ok: o => en(o, a) + 1 === en(o, b) }),
    inmDer: (a, b) => ({ tipo: 'inmDer', a, b, t: `${a} está inmediatamente a la derecha de ${b}.`, ok: o => en(o, a) - 1 === en(o, b) }),
    junto: (a, b) => ({ tipo: 'junto', a, b, t: `${a} está junto a ${b}.`, ok: o => pegados(o, a, b) }),
    noJunto: (a, b) => ({ tipo: 'noJunto', a, b, t: `${a} no está junto a ${b}.`, ok: o => !pegados(o, a, b) }),
    extremo: a => ({ tipo: 'extremo', a, t: `${a} está en un extremo.`, ok: o => en(o, a) === 0 || en(o, a) === o.length - 1 }),
    noExtremo: a => ({ tipo: 'noExtremo', a, t: `${a} no está en un extremo.`, ok: o => en(o, a) > 0 && en(o, a) < o.length - 1 }),
    puesto: (a, k) => ({ tipo: 'puesto', a, k, t: `${a} está en el puesto ${k + 1}.`, ok: o => o[k] === a }),
  };
  const cumplen = (gente, ps, base) => (base || permutar(gente)).filter(o => ps.every(p => p.ok(o)));
  // Los puestos que coinciden en todos los órdenes que quedan (la regla de la idea, contada).
  const fijosDe = ords => (ords.length ? ords[0].map((_, k) => k).filter(k => ords.every(o => o[k] === ords[0][k])) : []);
  // Recuadro «Datos» de los ejercicios de la fila: las reglas del problema y lo que dice cada palabra (una línea por dato).
  const D_FILA = k => `Fila de ${k} puestos, numerados de izquierda a derecha, uno por persona. Todos miran hacia donde miras tú.`;
  const D_IZQ = 'A la izquierda de: en un puesto de número menor.';   // auditoría, 19 nov: lo que el resuelto usa va en los datos
  const D_PISTAS = 'A la izquierda de: no obliga a ir pegados. Junto a: vale por ambos lados. Inmediatamente: en el puesto de al lado.';
  const PIS = (...xs) => xs.map((t, i) => `Pista ${i + 1}: ${t}`);

  // El juego: Dina ya ocupa el puesto 4 (un dato, no una pista) y se agregan tres pistas, en este orden.
  const G4 = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const P_DADO = 3;
  const BASE_J = cumplen(G4, [PZ.puesto('Dina', P_DADO)]);
  const PJ = [PZ.izq('Ana', 'Beto'), PZ.noJunto('Ciro', 'Dina'), PZ.noExtremo('Ciro')];
  const quedanJ = n => cumplen(G4, PJ.slice(0, n), BASE_J);
  const fijosJ = n => fijosDe(quedanJ(n)).filter(k => k !== P_DADO);   // los puestos seguros que no son el dado
  // La misión: con cuántas pistas queda fijo el puesto de Beto (se cuenta, no se escribe).
  const N_BETO = PJ.map((_, k) => k).concat(PJ.length).find(n => { const q = quedanJ(n); return q.every(o => en(o, 'Beto') === en(q[0], 'Beto')); });
  const P_BETO = en(quedanJ(N_BETO)[0], 'Beto');
  // La figura de la banca: quién está sentado, los 6 órdenes y las pistas. o.planteo: sin marcas (Lee y Predice).
  function banca(n, o = {}) {
    const q = quedanJ(n);
    return { escena: 'banca', puestos: 4, nombres: G4,
      sentados: [{ p: P_DADO, t: 'Dina' }].concat(fijosJ(n).map(k => ({ p: k, t: q[0][k], seguro: true }))),
      ordenes: BASE_J.map(a => ({ a, fuera: !PJ.slice(0, n).every(p => p.ok(a)) })),
      fijos: fijosJ(n).map(c => ({ c })),
      pistas: o.sinPistas ? undefined : PJ.slice(0, n).map((p, k) => ({ t: p.t, nueva: k === n - 1 })), lineas: o.sinPistas ? 0 : PJ.length };
  }
  // La lectura dice la relación: cuántos órdenes quedan y qué coincide en ellos (o qué deja suelto la pista).
  function lecturaJ(n) {
    const q = quedanJ(n), fij = fijosJ(n), p = PJ[n - 1];
    if (q.length === 1) return [`Queda 1 orden: ${q[0].join(', ')}`];
    if (fij.length) return [`Quedan ${q.length} órdenes; en ${q.length === 2 ? 'ambos' : 'todos'}, ${q[0][fij[0]]} va en el puesto ${fij[0] + 1}: `, F('seguro')];
    if (p && p.tipo === 'izq') {
      // «A la izquierda de» deja órdenes donde los dos no van pegados: quién queda en medio.
      const sep = q.filter(o => !pegados(o, p.a, p.b));
      if (sep.length) return [`Quedan ${q.length} órdenes; en ${sep.length === 1 ? 'uno' : f(sep.length, 0)}, ${sep[0][en(sep[0], p.a) + 1]} se sienta entre ${p.a} y ${p.b}`];
    }
    return [`${n ? '' : 'Sin pistas: '}${q.length} órdenes; solo coincide el puesto ${P_DADO + 1}, de Dina`];
  }

  // La predicción: otra banca, vacía, con dos «junto a». Lo seguro no es un puesto: Ciro queda en medio.
  const PP = [PZ.junto('Ciro', 'Ana'), PZ.junto('Ciro', 'Beto')];
  const QP = cumplen(G4, PP);
  const cuantos = (ords, ok) => ords.filter(ok).length;
  const ENTRE_P = o => pegados(o, 'Ciro', 'Ana') && pegados(o, 'Ciro', 'Beto');
  const LADO_P = o => en(o, 'Ana') < en(o, 'Ciro');
  const P_CIRO = en(QP[0], 'Ciro');                                             // un puesto de Ciro que es solo posible
  const OTRO_P = [...new Set(QP.map(o => en(o, 'Ciro')))].filter(k => k !== P_CIRO);
  if (cuantos(QP, ENTRE_P) !== QP.length || cuantos(QP, LADO_P) === QP.length || OTRO_P.length !== 1) throw new Error('predicción de la fila: las cuentas no cuadran');
  // Los órdenes que quedan, primero los de Ana a la izquierda de Ciro (así los cuenta «Mira»).
  const QP_MIRA = QP.filter(LADO_P).concat(QP.filter(o => !LADO_P(o)));
  const bancaP = (o = {}) => ({ escena: 'banca', puestos: 4, nombres: G4, sentados: [],
    ordenes: o.planteo ? undefined : QP_MIRA.map(a => ({ desde: o.mira ? (LADO_P(a) ? 1 : 2) : 0,
      a: a.map(x => (x === 'Ciro' ? { t: x, seguro: o.mira ? 3 : true } : x === 'Dina' && o.mira ? { t: x, seguro: 4 } : x)) })),
    pistas: PP.map(p => ({ t: p.t })), lineas: PP.length });
  // La figura de la regla: Ana en el puesto 2 y, con cada pista, dónde puede ir Beto (contado sobre los 24 órdenes).
  const TIRAS_R = [['… a la izquierda de Beto', PZ.izq('Ana', 'Beto')], ['… junto a Beto', PZ.junto('Ana', 'Beto')], ['… inmediatamente a la izquierda de Beto', PZ.inmIzq('Ana', 'Beto')]].map(([rotulo, p]) => {
    const donde = new Set(cumplen(G4, [PZ.puesto('Ana', 1), p]).map(o => en(o, 'Beto')));
    return { rotulo, celdas: G4.map((_, k) => (k === 1 ? 'Ana' : donde.has(k) ? (donde.size === 1 ? { t: 'Beto', seguro: true } : { t: 'Beto', posible: true }) : null)) };
  });

  // ---------- Casos de «Así se resuelve» y «Ahora tú» ----------
  const NOMBRES = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo'];   // ningún par empieza con la misma letra
  const INTROS = [
    (g, k) => `${lista(g)} miran el partido desde una banca de ${k} puestos.`,
    (g, k) => `${lista(g)} ven el desfile del aniversario desde una banca de ${k} puestos.`,
    (g, k) => `${lista(g)} se sientan en la primera fila del auditorio, de ${k} puestos.`,
  ];
  // Todas las pistas verdaderas de un orden, por tipo.
  function pozo(sol) {
    const k = sol.length, P = { izq: [], der: [], inm: [], junto: [], noJunto: [], extremo: [], noExtremo: [], puesto: [] };
    sol.forEach((a, i) => {
      P[i === 0 || i === k - 1 ? 'extremo' : 'noExtremo'].push((i === 0 || i === k - 1 ? PZ.extremo : PZ.noExtremo)(a));
      P.puesto.push(PZ.puesto(a, i));
      sol.forEach((b, j) => {
        if (i === j) return;
        if (i < j) P.izq.push(PZ.izq(a, b)); else P.der.push(PZ.der(a, b));
        if (i + 1 === j) P.inm.push(PZ.inmIzq(a, b));
        if (i - 1 === j) P.inm.push(PZ.inmDer(a, b));
        if (a < b) P[Math.abs(i - j) === 1 ? 'junto' : 'noJunto'].push((Math.abs(i - j) === 1 ? PZ.junto : PZ.noJunto)(a, b));
      });
    });
    return P;
  }
  // Arma un caso: k personas, pistas (4 como máximo, sin ninguna que sobre) y los órdenes que quedan (o.quedan: 1 o 2).
  function armar(r, o) {
    const gente = r.barajar(NOMBRES).slice(0, o.k).sort(), todos = permutar(gente);
    for (let intento = 0; intento < 300; intento++) {
      const P = pozo(r.elegir(todos));
      let ps = [];
      for (let j = 0; j < 12 && cumplen(gente, ps, todos).length > o.quedan; j++) {
        const c = r.elegir(P[r.elegir(o.tipos)]);
        if (c && !ps.some(x => x.t === c.t)) ps.push(c);
      }
      if (cumplen(gente, ps, todos).length !== o.quedan) continue;
      // Sin pistas que sobren: se quita cada una que no cambia lo que queda.
      for (let i = ps.length - 1; i >= 0; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (cumplen(gente, sin, todos).length === o.quedan) ps = sin; }
      if (ps.length > 4 || ps.length < 2) continue;
      if (!ps.some(p => p.tipo === 'izq' || p.tipo === 'der')) continue;        // siempre una pista que solo ordena
      if (ps.filter(p => p.tipo === 'puesto').length > 1) continue;
      const q = cumplen(gente, ps, todos), dados = ps.filter(p => p.tipo === 'puesto').map(p => p.k);
      if (o.quedan === 2 && !fijosDe(q).some(k => !dados.includes(k))) continue;   // con 2 órdenes, algún puesto seguro
      return { k: o.k, gente, ps, q, sol: q[0], dados };
    }
    return null;
  }
  // Caso de respaldo (si el azar no arma uno): la banca del juego, con Dina puesta por una pista.
  function caso(r, o) {
    const c = armar(r, o);
    if (c) return c;
    const ps = [PZ.puesto('Dina', P_DADO)].concat(PJ.slice(0, o.quedan === 2 ? 2 : 3)), q = cumplen(G4, ps);
    return { k: 4, gente: G4, ps, q, sol: q[0], dados: [P_DADO] };
  }
  const datosDe = c => [D_FILA(c.k), D_PISTAS, ...PIS(...c.ps.map(p => p.t))];
  // La tira de puestos con lo que cada pista pone por sí sola: quien tiene puesto dado. Nada de lo que sale de juntar
  // pistas (molde §3). Los lugares posibles (línea cortada) quedan para los ejemplos, donde el resuelto los nombra.
  function directas(c) {
    const fila = Array(c.k).fill(null);
    for (const p of c.ps) if (p.tipo === 'puesto') fila[p.k] = p.a;
    return fila;
  }
  const figFila = (c, extra) => ({ datos: Object.assign({ puestos: c.k, nombres: c.gente, fila: directas(c) }, extra || {}), estado: {} });
  // La figura de la solución: los órdenes que quedan, con lo seguro enmarcado.
  const figSol = c => figFila(c, { ordenes: c.q.map(a => ({ a })), fijos: fijosDe(c.q).filter(k => !c.dados.includes(k)).map(k => ({ c: k })) });
  // Por qué no vale algo que ningún orden cumple: la primera pista sin la cual sí cabría.
  function porQueNo(c, ok, dicho) {
    for (let i = 0; i < c.ps.length; i++) {
      if (cumplen(c.gente, c.ps.filter((_, j) => j !== i)).some(ok)) return { error: 'RMP72', siFuera: `Valdría sin la pista ${i + 1}. Con todas, ${dicho}.` };
    }
    return { error: 'RMP63', siFuera: `Tendrías que saltarte dos pistas: con todas, ${dicho}.` };
  }
  // El mismo caso leído con izquierda y derecha cambiadas: si deja un solo orden, es el que arma ese error.
  const ESPEJO = { izq: 'der', der: 'izq', inmIzq: 'inmDer', inmDer: 'inmIzq' };
  const alEspejo = c => { const q = cumplen(c.gente, c.ps.map(p => (ESPEJO[p.tipo] ? PZ[ESPEJO[p.tipo]](p.a, p.b) : p))); return q.length === 1 ? q[0] : null; };
  // El mismo caso leído con «a la izquierda de» como «inmediatamente»: los órdenes que deja esa lectura.
  const PEGADO = { izq: 'inmIzq', der: 'inmDer' };
  const alPegar = c => cumplen(c.gente, c.ps.map(p => (PEGADO[p.tipo] ? PZ[PEGADO[p.tipo]](p.a, p.b) : p)));
  const ladoDe = c => (c.ps.find(p => p.tipo === 'izq') ? 'izquierda' : 'derecha');
  // Algo que pasa en un orden de los que quedan y no en el otro: posible, no seguro. Si es justo lo que queda al leer
  // «a la izquierda de» como «inmediatamente», el error tiene nombre.
  function soloPosible(c, ok, enElOtro) {
    const pg = alPegar(c);
    if (pg.length && pg.length < c.q.length && pg.every(ok)) return { error: 'RMP88', siFuera: `Sería seguro si «a la ${ladoDe(c)} de» obligara a ir pegados. Solo ordena: quedan ${c.q.length} órdenes.` };
    return { error: 'RMP77', siFuera: `Pasa en uno de los ${c.q.length} órdenes que quedan; en el otro, ${enElOtro}.` };
  }
  const enPuesto = (x, k) => `${x} va en el puesto ${k + 1}`;

  const ideaFila = {
    id: 'orden-lineal',
    titulo: 'Ordenar en una fila',
    pregunta: '¿«A la izquierda de» quiere decir «junto a»?',
    temas: ['Ordenamiento lineal'],
    pieza: OR,
    aprendizaje: '«A la izquierda de» ordena sin pegar y «junto a» pega sin ordenar; un puesto es seguro si coincide en todos los órdenes que quedan.',
    actividad: 'Agregar pistas una a una y mirar qué órdenes quedan en pie.',
    // Lee: la banca vista de espaldas, qué es un orden y las palabras de las pistas. No dice si «a la izquierda de» pega
    // (eso lo muestra el juego) ni qué pasa con dos «junto a» (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'La banca del campeonato', texto: 'En el campeonato del aniversario, Ana, Beto, Ciro y Dina miran el partido desde una banca. Los ves de espaldas: miran hacia la cancha, igual que tú. Por eso su izquierda es también la tuya. Dina ya se sentó.',
          pieza: OR, dibujo: { datos: Object.assign(banca(0), { panel: false }), estado: {} } },
        { titulo: `${BASE_J.length} órdenes`, texto: `La banca tiene cuatro puestos, numerados de izquierda a derecha. Un orden dice quién va en cada puesto: es un reparto de personas en puestos. Con Dina en el puesto ${P_DADO + 1}, para los otros tres quedan ${BASE_J.length} órdenes.`,
          ecuacion: [`3 × 2 × 1 = ${BASE_J.length} órdenes`],
          pieza: OR, dibujo: { datos: banca(0, { sinPistas: true }), estado: {} } },
        { titulo: 'Las palabras de las pistas', texto: 'Ubicar gente en una fila con pistas es un ordenamiento lineal. «A la izquierda de»: en un puesto de número menor. «Junto a»: en el puesto de al lado. Extremo: el primer puesto o el último.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a agregar tres pistas, una a una. Cada pista tacha los órdenes que no la cumplen. Mira cuáles quedan en pie y busca el momento en que el puesto de Beto ya no cambia.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: `Ana, Beto, Ciro y Dina miran el partido desde la banca, de espaldas a ti. Dina ya ocupa el puesto ${P_DADO + 1}.`,
      mision: {
        texto: 'Agrega pistas una a una: ¿con cuántas queda fijo el puesto de Beto?',
        logrado: v => v.n === N_BETO,
        bien: [`Con ${N_BETO} pistas: en los ${quedanJ(N_BETO).length} órdenes que quedan, Beto va en el puesto ${P_BETO + 1}.`],
      },
      voz: 'Mira qué órdenes quedan en pie con cada pista.',
      leyenda: [
        { s: '1, 2, 3, 4', t: 'los puestos, de izquierda a derecha' },
        { s: 'Orden', t: 'una manera de sentar a los cuatro' },
        { s: 'gris tachado', t: 'orden que una pista descarta' },
        { s: F('marco violeta'), t: 'seguro: coincide en los órdenes que quedan' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: banca(v.n), estado: {} }),
      lectura: v => lecturaJ(v.n),
      minimo: PJ.length + 1,
    },
    predice: {
      pregunta: `Otra banca de cuatro, vacía, con otras pistas: ${sinPunto(PP[0].t)} y también ${sinPunto(PP[1].t).replace(/^Ciro está /, '')}. ¿Qué es seguro?`,
      datos: ['Cada puesto es de una sola persona.', 'Los cuatro miran hacia la cancha, igual que tú.'],
      voz: 'Prueba de qué lado de Ciro puede ir cada uno.',
      opciones: [
        { id: 'c', texto: 'Ciro está entre Ana y Beto', correcta: true },
        { id: 'lado', texto: 'Ana está a la izquierda de Ciro', error: 'RMP89',
          siFuera: `Pasa en ${cuantos(QP, LADO_P)} de los ${QP.length} órdenes que quedan: «junto a» también vale con Ana a la derecha.` },
        { id: 'posible', texto: `Ciro está en el puesto ${P_CIRO + 1}`, error: 'RMP77',
          siFuera: `Pasa en ${cuantos(QP, o => en(o, 'Ciro') === P_CIRO)} de los ${QP.length} órdenes que quedan; en los otros, Ciro va en el puesto ${OTRO_P[0] + 1}.` },
        { id: 'nada', texto: 'Nada: «junto a» no dice de qué lado', error: 'RMP78',
          siFuera: 'Es cierto que no dice el lado, pero con dos vecinos Ciro queda en medio de los dos.' },
      ],
      // El planteamiento: la banca vacía, los cuatro de pie y las dos pistas, sin órdenes ni marcas.
      dibujo: { datos: bancaP({ planteo: true }), estado: {} },
      revelar: { datos: bancaP(), estado: {} },
      coincide: `Coincide: con un vecino a cada lado, Ciro queda entre Ana y Beto en los ${QP.length} órdenes.`,
      noCoincide: `Revisemos: en los ${QP.length} órdenes que quedan, Ciro tiene a Ana de un lado y a Beto del otro.`,
    },
    mira: {
      pieza: OR,
      datos: bancaP({ mira: true }),
      voz: 'Prueba los dos lados de Ciro y mira qué se repite.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si Ana va a la izquierda de Ciro, Beto va a su derecha.' },
        { estado: { corte: 2 }, texto: 'Si Ana va a su derecha, Beto va a su izquierda.' },
        { estado: { corte: 3 }, texto: ['Quedan ', String(QP.length), ` órdenes de ${permutar(G4).length}. En todos, Ciro va en medio: `, F('seguro'), '.'] },
        { estado: { corte: 3 }, texto: `«Ana a la izquierda de Ciro» pasa en ${cuantos(QP, LADO_P)} de ${QP.length}: posible, no seguro.` },
        { estado: { corte: 4 }, texto: 'A Dina le queda siempre un extremo: también es seguro.' },
      ],
    },
    regla: {
      texto: 'A la izquierda de: ordena, sin pegar. Junto a: pega, sin decir el lado. Inmediatamente a la izquierda: las dos cosas. Seguro: lo que coincide en todos los órdenes.',
      ecuacion: [{ llave: ['a la izquierda de'], nota: 'ordena' }, '   ·   ', { llave: ['junto a'], nota: 'pega' }, '   ·   ', { llave: ['inmediatamente'], nota: 'ordena y pega' }],
      condicion: 'todos miran hacia donde miras tú y cada puesto es de una sola persona. Con «derecha» es igual, al revés.',
      voz: 'Antes de sentar a alguien, mira si la pista ordena, pega o hace las dos.',
      // Dibujo propio de la regla: la misma Ana y las tres pistas, lado a lado (lo que se compara se ve junto).
      dibujo: { pieza: OR, datos: { titulo: 'Ana, en el puesto 2, está…', tiras: TIRAS_R }, estado: {} },
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_FILA)
    // Así se resuelve: el orden completo, probando los puestos de una persona y diciendo qué pista rompe cada puesto
    // que no vale; después, lo mismo con la siguiente. Cada razón se calcula: «rompe la
    // pista N» solo si ningún orden con esa persona ahí cumple esa pista. «Ahora tú» no pide el orden completo: pide qué
    // es seguro, quién va en un puesto, quién está a la derecha o cuál afirmación es verdadera.
    resuelve: {
      pieza: OR,
      generar(s) {
        const r = azar(s + 900), k = s % 3 === 2 ? 5 : 4;
        const c = caso(r, { k, quedan: 1, tipos: k === 5 ? ['izq', 'der', 'inm', 'extremo', 'noJunto', 'puesto', 'junto'] : ['izq', 'der', 'inm', 'extremo', 'noJunto', 'noExtremo', 'junto'] });
        const todos = permutar(c.gente), nPistas = x => c.ps.filter(p => p.a === x || p.b === x).length;
        const puestos = {};                                   // quién ya tiene puesto: persona → puesto
        for (const p of c.ps) if (p.tipo === 'puesto') puestos[p.a] = p.k;
        // Por qué una persona no puede ir en cada puesto libre, con los ya ubicados en su sitio: el grupo más chico de
        // pistas que ningún orden así cumple a la vez (una que se rompe sola, o dos o tres que no caben juntas). Los puestos se
        // agrupan por razón.
        const grupos = n => { const out = [], ir = (pre, desde) => { if (pre.length === n) { out.push(pre); return; } for (let a = desde; a < c.ps.length; a++) ir(pre.concat(a), a + 1); }; ir([], 0); return out; };
        function probar(x) {
          const base = todos.filter(o => Object.entries(puestos).every(([y, j]) => o[j] === y)), libres = c.sol.map((_, j) => j).filter(j => !Object.values(puestos).includes(j));
          const razones = [];
          for (const j of libres) {
            const aqui = base.filter(o => o[j] === x);
            if (aqui.some(o => c.ps.every(p => p.ok(o)))) continue;
            let cuales = null;
            for (let n = 1; n <= c.ps.length && !cuales; n++) cuales = grupos(n).find(g => !aqui.some(o => g.every(a => c.ps[a].ok(o)))) || null;
            const clave = cuales.join(), g = razones.find(z => z.clave === clave);
            if (g) g.js.push(j); else razones.push({ clave, cuales, js: [j] });
          }
          return razones;
        }
        const elLos = js => js.map(j => String(j + 1)).join(js.length > 2 ? ', el ' : ' y el ').replace(/, el (\d)$/, ' y el $1');
        // Cómo se dice, de más largo a más corto: «rompe la pista 2» y «rompe la pista 1 o la 3» (con esa persona ahí
        // no se cumplen las dos a la vez), o «pista 2» y «pista 1 o 3»; se usa la forma más larga que entra en las 30
        // palabras del paso. Sin «chocan»: «choque» lo estrena la unidad siguiente (Verdades y mentiras).
        const razon = (z, corto) => { const ns = z.cuales.map(a => String(a + 1)); return corto ? `pista ${lista(ns, 'o')}` : `rompe la pista ${lista(ns.map((a, i) => (i ? `la ${a}` : a)), 'o')}`; };
        function decir(x, primero) {
          const rs = probar(x), va = c.sol.indexOf(x) + 1, n = nPistas(x);
          const cuerpo = corto => rs.map((z, i) => `${i ? 'ni' : 'no va'} en el ${elLos(z.js)} (${razon(z, corto)})`).join(', ');
          const larga = primero ? `Pruebo a ${x}${n > 1 ? `, que sale en ${n} pistas` : ''}. ${x} ` : `Ahora ${x}: `, corta = primero ? `${x} ` : `Ahora ${x}: `;
          for (const t of [`${larga}${cuerpo(false)}: va en el ${va}.`, `${corta}${cuerpo(false)}: va en el ${va}.`, `${corta}${cuerpo(true)}: va en el ${va}.`]) if (Kit.palabras(t) <= 30) return t;
          return `${x} solo cabe en el ${va}: en los otros puestos libres se rompe alguna pista.`;
        }
        // A quién ubicar ahora: a quien se descarta con menos palabras (pocas razones, de una sola pista); si empatan,
        // a quien sale en más pistas.
        const costo = x => probar(x).reduce((t, z) => t + 3 + z.js.length + 3 * z.cuales.length, 0);
        const tiraCon = seguros => figFila(c, { fila: c.sol.map((x, j) => (puestos[x] === j ? (seguros.includes(x) ? { t: x, seguro: true } : x) : null)) });
        const pasos = [
          { tipo: 'pide', texto: `Piden el orden completo de la fila, del puesto 1 al ${c.k}.` },
          { tipo: 'regla', texto: 'Pruebo los puestos de una persona y descarto los que rompen alguna pista. A la izquierda de: solo ordena. Junto a: solo pega.' },
        ];
        // Se ubica de uno en uno, hasta que falten dos personas.
        const seguros = [];
        const faltan = () => c.gente.filter(y => puestos[y] === undefined);
        while (faltan().length > 2) {
          const x = faltan().sort((a, b) => costo(a) - costo(b) || nPistas(b) - nPistas(a))[0], t = decir(x, !seguros.length);
          puestos[x] = c.sol.indexOf(x); seguros.push(x);
          pasos.push({ tipo: 'aplica', texto: t, dibujo: tiraCon(seguros) });
        }
        // Las dos que faltan: al revés se rompe una pista.
        const resto = faltan(), libres = resto.map(y => c.sol.indexOf(y)).sort((a, b) => a - b);
        const alReves = c.sol.map((z, j) => (j === libres[0] ? c.sol[libres[1]] : j === libres[1] ? c.sol[libres[0]] : z));
        pasos.push({ tipo: 'aplica', texto: `Para ${c.sol[libres[0]]} y ${c.sol[libres[1]]} quedan los puestos ${libres[0] + 1} y ${libres[1] + 1}; al revés se rompe la pista ${c.ps.findIndex(p => !p.ok(alReves)) + 1}.`,
          ecuacion: [c.sol.join(', ')], dibujo: figFila(c, { fila: c.sol.map((x, j) => (c.dados.includes(j) ? x : { t: x, seguro: true })) }) });
        // ¿Tiene sentido? (si quedan pasos): la pista que solo ordena se cumple aunque los dos no queden pegados.
        const suelta = c.ps.find(p => (p.tipo === 'izq' || p.tipo === 'der') && !pegados(c.sol, p.a, p.b));
        if (pasos.length < 6) pasos.push({ tipo: 'sentido', texto: suelta ? `Compruebo cada pista con el orden. ${suelta.a} quedó a la ${suelta.tipo === 'izq' ? 'izquierda' : 'derecha'} de ${suelta.b} sin ir pegados: la pista lo permite.`
          : 'Compruebo cada pista con el orden: ninguna se rompe y nadie repite puesto.' });
        return {
          enunciado: `${INTROS[s % INTROS.length](c.gente, c.k)} ¿En qué orden se sientan, del puesto 1 al ${c.k}?`,
          datos: datosDe(c),
          dibujo: figFila(c),
          pasos,
          respuesta: [F(c.sol.join(', '))],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 qué es seguro con dos órdenes en pie (4 personas); 1 quién va en un puesto
    // (4 personas, un solo orden); 2 quién está inmediatamente a la derecha (5 personas); 3 nivel examen (5 personas,
    // «¿cuál es necesariamente verdadera?», con uno o dos órdenes en pie). Cada opción y su explicación salen de contar
    // órdenes: «pasa en uno», «valdría sin la pista N» y «sería así con izquierda y derecha cambiadas» se comprueban.
    ahoraTu: {
      pieza: OR,
      voz: 'Dibuja la fila, ubica lo que fija cada pista y prueba lo que queda.',
      generar(s) {
        const r = azar(s), tipo = s % 4, intro = INTROS[Math.floor(s / 4) % INTROS.length];
        if (tipo === 0) {
          const c = caso(r, { k: 4, quedan: 2, tipos: ['izq', 'der', 'inm', 'extremo', 'noJunto', 'noExtremo', 'junto', 'puesto'] });
          const seg = fijosDe(c.q).filter(k => !c.dados.includes(k)), k = r.elegir(seg), x = c.q[0][k];
          const ops = [{ id: 'c', texto: enPuesto(x, k), correcta: true },
            { id: 'nada', texto: 'Nada todavía: faltan pistas', error: 'RMP78', siFuera: `Faltan para saberlo todo, pero en los ${c.q.length} órdenes que quedan, ${enPuesto(x, k)}.` }];
          const posibles = [], imposibles = [];
          for (const y of c.gente) for (let j = 0; j < c.k; j++) {
            const m = c.q.filter(o => o[j] === y).length;
            if (m > 0 && m < c.q.length) posibles.push([y, j]); else if (m === 0 && y !== x && j !== k) imposibles.push([y, j]);
          }
          if (posibles.length) { const [y, j] = r.elegir(posibles); ops.push(Object.assign({ id: 'posible', texto: enPuesto(y, j) }, soloPosible(c, o => o[j] === y, enPuesto(y, en(c.q.find(o => o[j] !== y), y)))) ); }
          if (imposibles.length) { const [y, j] = r.elegir(imposibles); ops.push(Object.assign({ id: 'choca', texto: enPuesto(y, j) }, porQueNo(c, o => o[j] === y, `${y} no puede ir en el puesto ${j + 1}`))); }
          const mas = seg.filter(j => j !== k).map(j => `${c.q[0][j]} en el ${j + 1}`);
          return { pregunta: `${intro(c.gente, c.k)} ¿Qué es seguro?`, datos: datosDe(c), dibujo: figFila(c), opciones: ops,
            solucion: { texto: `Quedan ${c.q.length} órdenes y en los dos, ${enPuesto(x, k)}.${mas.length ? ` También: ${lista(mas)}.` : ''}`, dibujo: figSol(c) } };
        }
        if (tipo === 1) {
          const c = caso(r, { k: 4, quedan: 1, tipos: ['izq', 'der', 'inm', 'extremo', 'noJunto', 'noExtremo', 'junto'] });
          const libres = c.sol.map((_, j) => j).filter(j => !c.dados.includes(j)), k = r.elegir(libres), x = c.sol[k], esp = alEspejo(c);
          const ops = c.gente.map((y, i) => {
            if (y === x) return { id: 'c', texto: y, correcta: true };
            if (esp && esp[k] === y) return { id: `g${i}`, texto: y, error: 'RMP140', siFuera: `Sería ${y} con izquierda y derecha cambiadas. Todos miran hacia donde miras tú.` };
            return Object.assign({ id: `g${i}`, texto: y }, porQueNo(c, o => o[k] === y, `${y} no puede ir en el puesto ${k + 1}`));
          });
          ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada lugar queda un solo orden.' });
          return { pregunta: `${intro(c.gente, c.k)} ¿Quién va en el puesto ${k + 1}?`, datos: datosDe(c), dibujo: figFila(c), opciones: ops,
            solucion: { texto: `Queda un solo orden: ${c.sol.join(', ')}. En el puesto ${k + 1} va ${x}.`, dibujo: figSol(c) } };
        }
        if (tipo === 2) {
          const c = caso(r, { k: 5, quedan: 1, tipos: ['izq', 'der', 'inm', 'extremo', 'noJunto', 'puesto', 'junto'] });
          // Se pregunta por alguien que no está en el extremo derecho y cuyo vecino de la derecha no lo da una pista sola.
          const cands = c.sol.slice(0, -1).filter((a, i) => !c.ps.some(p => /^inm/.test(p.tipo) && [p.a, p.b].includes(a) && [p.a, p.b].includes(c.sol[i + 1])));
          const a = r.elegir(cands.length ? cands : c.sol.slice(0, -1)), i = en(c.sol, a), x = c.sol[i + 1], izq = i > 0 ? c.sol[i - 1] : null;
          const der = y => o => en(o, y) === en(o, a) + 1;
          const ops = [{ id: 'c', texto: x, correcta: true }];
          if (izq) ops.push({ id: 'izq', texto: izq, error: 'RMP140', siFuera: `${izq} está a su izquierda. La derecha de ${a} es la tuya: todos miran hacia donde miras tú.` });
          for (const y of r.barajar(c.gente.filter(y => ![a, x, izq].includes(y)))) {
            if (ops.length >= 4) break;
            ops.push(Object.assign({ id: `g${en(c.gente, y)}`, texto: y }, porQueNo(c, der(y), `${y} no queda a la derecha de ${a}`)));
          }
          ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada lugar queda un solo orden.' });
          return { pregunta: `${intro(c.gente, c.k)} ¿Quién está inmediatamente a la derecha de ${a}?`, datos: datosDe(c), dibujo: figFila(c), opciones: ops,
            solucion: { texto: `Queda un solo orden: ${c.sol.join(', ')}. A la derecha de ${a} va ${x}.`, dibujo: figSol(c) } };
        }
        // Nivel examen: «¿Cuál es necesariamente verdadera?» con uno o dos órdenes en pie.
        const quedan = 1 + (Math.floor(s / 4) % 2);
        const c = caso(r, { k: 5, quedan, tipos: ['izq', 'der', 'inm', 'extremo', 'noJunto', 'puesto', 'junto'] });
        // Afirmaciones posibles; se dejan fuera las que una sola pista ya dice (o implica).
        const af = [];
        for (const a of c.gente) {
          af.push({ t: `${a} está en un extremo`, ok: o => en(o, a) === 0 || en(o, a) === c.k - 1 });
          for (let j = 0; j < c.k; j++) af.push({ t: `${a} está en el puesto ${j + 1}`, ok: o => o[j] === a });
          for (const b of c.gente) if (a !== b) {
            af.push({ t: `${a} está a la izquierda de ${b}`, ok: o => en(o, a) < en(o, b) });
            if (a < b) af.push({ t: `${a} está junto a ${b}`, ok: o => pegados(o, a, b) });
          }
        }
        const todos = permutar(c.gente);
        const utiles = af.filter(x => !c.ps.some(p => todos.filter(o => p.ok(o)).every(x.ok)));
        const cuenta = x => c.q.filter(x.ok).length;
        const seguras = utiles.filter(x => cuenta(x) === c.q.length), posibles = utiles.filter(x => cuenta(x) > 0 && cuenta(x) < c.q.length), imposibles = utiles.filter(x => cuenta(x) === 0);
        const bien = r.elegir(seguras);
        const ops = [{ id: 'c', texto: bien.t, correcta: true }];
        if (posibles.length) { const x = r.elegir(posibles); ops.push(Object.assign({ id: 'posible', texto: x.t }, soloPosible(c, x.ok, 'no'))); }
        for (const x of r.barajar(imposibles)) {
          if (ops.length >= 4) break;
          ops.push(Object.assign({ id: `x${ops.length}`, texto: x.t }, porQueNo(c, x.ok, 'ningún orden lo cumple')));
        }
        return { pregunta: `${intro(c.gente, c.k)} ¿Cuál es necesariamente verdadera?`, datos: datosDe(c), dibujo: figFila(c), opciones: ops,
          solucion: { texto: quedan === 1 ? `Queda un solo orden, ${c.sol.join(', ')}: ${bien.t}.` : `Quedan 2 órdenes y en los dos, ${bien.t}.`, dibujo: figSol(c) } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Ordenar en una fila» (pestaña «Ejemplos»; molde §3) ----------
  // Cada uno se resolvió aparte con un script que no usa el código de la unidad (scratchpad e5-rm/recalculo.py): prueba
  // todos los órdenes y comprueba que lo que se pregunta tiene una sola respuesta (1: Ana, Ciro, Beto; 2: quedan 12 órdenes,
  // 6 con Rosa e Iván juntos y 6 no; 3: Maru en el 1 o en el 3; 4: quedan 2 de 6; 5: Sara en el 2; 6, 7, 9, 10, 11, 13, 14 y
  // 15: un solo orden; 8 y 12: 2 órdenes; en el 12 solo la B vale en los dos; 13: 14 + 17 = 31; 15: leído sin dar vuelta
  // las pistas sale el orden al revés, con Pía primero). También rehace el juego (6 → 3 → 2 → 1, Beto fijo con 2 pistas),
  // la predicción (4 órdenes de 24, Ciro en medio en los 4) y las tres tiras de la regla. La prueba de la unidad repite
  // esas cuentas con un resolvedor propio. La figura es el planteamiento: la tira de puestos con lo que cada pista pone
  // por sí sola (quien tiene puesto dado; con línea cortada, los lugares de quien «está en un extremo» o «no está en un
  // extremo»), nunca lo que sale de juntar pistas. Las pistas van en los datos, una por línea; la respuesta, en violeta.
  // Las alternativas de nivel 3 van en su propia línea (campo alternativas).
  const tira = (nombres, fila, extra) => ({ pieza: OR, datos: Object.assign({ puestos: fila.length, nombres, fila }, extra || {}), estado: {} });
  const Q = t => ({ t, posible: true });   // lugar posible que da una pista sola (línea cortada)
  const G3 = ['Ana', 'Beto', 'Ciro'], R4 = ['Rosa', 'Iván', 'Nora', 'Leo'], L4 = ['Lucho', 'Maru', 'Teo', 'Vilma'], S4 = ['Sara', 'Gino', 'Pía', 'Omar'];
  const G5 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], R5 = ['Rosa', 'Iván', 'Nora', 'Leo', 'Maru'], G6 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'];
  // Ejemplo 2: los órdenes que deja «Rosa está a la izquierda de Iván» y en cuántos van pegados (se cuentan).
  const E2 = cumplen(R4, [PZ.izq('Rosa', 'Iván')]), E2_J = cuantos(E2, o => pegados(o, 'Rosa', 'Iván'));
  // Ejemplo 4: los 6 órdenes de la banca de tres y los que deja «Ciro no está en un extremo».
  const E4 = permutar(G3), E4_Q = cumplen(G3, [PZ.noExtremo('Ciro')]);
  const EDAD = { Rosa: 14, Iván: 15, Nora: 16, Leo: 17, Maru: 18 };
  const EJEMPLOS_FILA = [
    { nivel: 1, titulo: 'El puesto que sobra',
      figura: { pieza: OR, datos: { escena: 'banca', puestos: 3, nombres: G3, sentados: [{ p: 2, t: 'Beto' }] }, estado: {} },
      enunciado: 'Ana, Beto y Ciro miran el partido desde una banca de tres puestos. ¿En qué orden se sientan?',
      datos: [D_FILA(3), D_IZQ, ...PIS('Beto está en el puesto 3.', 'Ana está a la izquierda de Ciro.')],
      solucion: [
        { texto: 'La pista 1 sienta a Beto en el puesto 3. Para Ana y Ciro quedan los puestos 1 y 2.' },
        { texto: ['«A la izquierda de» ordena: Ana va antes que Ciro. Ana en el 1 y Ciro en el 2: ', F('un solo orden'), '.'] },
      ],
      respuesta: [F('Ana, Ciro, Beto')] },
    { nivel: 1, titulo: '¿Juntos o no?', figura: tira(R4, [null, null, null, null]),
      enunciado: 'Rosa, Iván, Nora y Leo se sientan en una fila de cuatro puestos. Iván dice: «Entonces Rosa está junto a mí». ¿Es seguro?',
      datos: [D_FILA(4), D_IZQ, 'Pista: Rosa está a la izquierda de Iván.'],
      solucion: [
        { texto: '«A la izquierda de» solo ordena: Rosa va en un puesto de número menor que el de Iván.' },
        { texto: 'Rosa en el 1 e Iván en el 4 cumple la pista, y no están juntos. Rosa en el 1 e Iván en el 2 también la cumple.' },
        { texto: `De los ${E2.length} órdenes que quedan, en ${E2_J} están juntos y en ${E2.length - E2_J} no: es posible, no seguro.` },
      ],
      respuesta: [F('No es seguro'), ': pueden quedar juntos, o con uno o dos puestos en medio'] },
    { nivel: 1, titulo: 'Junto a, ¿de qué lado?', figura: tira(L4, [null, 'Lucho', null, null]),
      enunciado: 'Lucho, Maru, Teo y Vilma se sientan en una fila de cuatro puestos. ¿En qué puestos puede estar Maru?',
      datos: [D_FILA(4), ...PIS('Lucho está en el puesto 2.', 'Maru está junto a Lucho.')],
      solucion: [
        { texto: 'Lucho ocupa el puesto 2. Sus vecinos son los puestos 1 y 3.' },
        { texto: ['«Junto a» pega, pero no dice el lado: Maru puede ir en el ', F('1'), ' o en el ', F('3'), '. Las dos maneras cumplen la pista.'] },
      ],
      respuesta: [F('En el puesto 1 o en el 3')] },
    { nivel: 1, titulo: '¿Cuántos órdenes quedan?', figura: tira(G3, [null, Q('Ciro'), null], { ordenes: E4.map(a => ({ a })) }),
      enunciado: 'Ana, Beto y Ciro se sientan en una banca de tres puestos. Con la pista de abajo, ¿cuántos órdenes quedan?',
      datos: [D_FILA(3), 'Extremos: el puesto 1 y el último.', `Sin pistas hay ${E4.length} órdenes: los ${E4.length} de la figura.`, 'Pista: Ciro no está en un extremo.'],
      solucion: [
        { texto: 'Los extremos son los puestos 1 y 3. A Ciro le queda el puesto 2, el de la línea cortada.' },
        { texto: `Con Ciro en el 2, Ana y Beto ocupan los extremos de ${E4_Q.length} maneras. Se tachan los otros ${E4.length - E4_Q.length} órdenes.`,
          ecuacion: [`${E4.length} − ${E4.length - E4_Q.length} = `, F(String(E4_Q.length))] },
      ],
      respuesta: [F(`Quedan ${E4_Q.length} órdenes`), `: ${E4_Q.map(o => o.join(', ')).join(' y ')}`] },
    { nivel: 1, titulo: 'Inmediatamente', figura: tira(S4, [null, null, 'Gino', null]),
      enunciado: 'Sara, Gino, Pía y Omar se sientan en una fila de cuatro puestos. ¿En qué puesto está Sara?',
      datos: [D_FILA(4), D_PISTAS, ...PIS('Gino está en el puesto 3.', 'Sara está inmediatamente a la izquierda de Gino.')],
      solucion: [
        { texto: '«Inmediatamente a la izquierda» ordena y pega: Sara va justo antes de Gino, sin nadie en medio.' },
        { texto: ['Gino está en el puesto 3: Sara va en el ', F('2'), '. Sin «inmediatamente», también podría ir en el 1.'] },
      ],
      respuesta: [F('Sara está en el puesto 2')] },
    { nivel: 2, titulo: 'Dos pistas en cadena',
      figura: { pieza: OR, datos: { escena: 'banca', puestos: 4, nombres: G4, sentados: [{ p: 1, t: 'Dina' }] }, estado: {} },
      enunciado: 'Ana, Beto, Ciro y Dina miran el partido desde una banca de cuatro puestos. ¿Quién está en el puesto 3?',
      datos: [D_FILA(4), D_IZQ, ...PIS('Ana está a la izquierda de Beto.', 'Beto está a la izquierda de Ciro.', 'Dina está en el puesto 2.')],
      solucion: [
        { texto: 'Las pistas 1 y 2 hacen una cadena: Ana, después Beto, después Ciro, sin decir si van pegados.' },
        { texto: 'Dina ocupa el puesto 2. Los otros tres llenan los puestos 1, 3 y 4 en el orden de la cadena.' },
        { texto: ['Ana va en el 1; Beto, en el ', F('3'), ', y Ciro, en el 4. Ana y Beto no quedaron juntos, y la pista 1 se cumple.'] },
      ],
      respuesta: [F('Beto'), ': el orden es Ana, Dina, Beto, Ciro'] },
    { nivel: 2, titulo: 'El extremo que queda', figura: tira(R4, [Q('Leo'), null, null, Q('Leo')]),
      enunciado: 'Rosa, Iván, Nora y Leo se sientan en una fila de cuatro puestos. ¿Quién está en el puesto 3?',
      datos: [D_FILA(4), D_PISTAS, ...PIS('Leo está en un extremo.', 'Nora está inmediatamente a la derecha de Leo.', 'Rosa no está junto a Nora.')],
      solucion: [
        { texto: 'Leo va en el puesto 1 o en el 4. En el 4 no tendría a nadie a su derecha: Leo va en el 1 y Nora, en el 2.' },
        { texto: 'Rosa no está junto a Nora: no puede ir en el 3. Rosa va en el 4.' },
        { texto: ['El puesto 3 es el único libre: lo ocupa ', F('Iván'), ', a quien ninguna pista nombra.'] },
      ],
      respuesta: [F('Iván'), ': el orden es Leo, Nora, Iván, Rosa'] },
    { nivel: 2, titulo: '¿Qué es seguro y qué no?', figura: tira(L4, [null, Q('Vilma'), Q('Vilma'), null]),
      enunciado: 'Lucho, Maru, Teo y Vilma se sientan en una fila de cuatro puestos. ¿Qué puestos son seguros?',
      datos: [D_FILA(4), D_PISTAS, ...PIS('Lucho está a la izquierda de Maru.', 'Maru está a la izquierda de Teo.', 'Vilma no está en un extremo.')],
      solucion: [
        { texto: 'Cadena: Lucho, después Maru, después Teo. Vilma va en el puesto 2 o en el 3.' },
        { texto: 'Con Vilma en el 2: Lucho, Vilma, Maru, Teo. Con Vilma en el 3: Lucho, Maru, Vilma, Teo. Los dos órdenes cumplen todo.' },
        { texto: ['En los 2 órdenes, Lucho va en el 1 y Teo en el 4: ', F('seguros'), '. Maru y Vilma cambian de lugar: solo posible.'] },
      ],
      respuesta: [F('Seguros: Lucho en el 1 y Teo en el 4')] },
    { nivel: 2, titulo: 'Dos vecinos', figura: tira(S4, ['Sara', null, null, null]),
      enunciado: 'Sara, Gino, Pía y Omar se sientan en una fila de cuatro puestos. ¿Quién está en el puesto 4?',
      datos: [D_FILA(4), D_PISTAS, ...PIS('Pía está junto a Sara.', 'Pía está junto a Gino.', 'Sara está en el puesto 1.')],
      solucion: [
        { texto: 'Sara está en el puesto 1 y su único vecino es el puesto 2: ahí va Pía.' },
        { texto: 'Pía también está junto a Gino. Su otro vecino es el puesto 3: ahí va Gino.' },
        { texto: ['Queda libre el puesto 4, para ', F('Omar'), '.'] },
      ],
      respuesta: [F('Omar'), ': el orden es Sara, Pía, Gino, Omar'] },
    { nivel: 2, titulo: 'Una pista con «no»', figura: tira(G4, [null, 'Beto', null, null]),
      enunciado: 'Ana, Beto, Ciro y Dina se sientan en una fila de cuatro puestos. ¿Quién se sienta junto a Ana?',
      datos: [D_FILA(4), D_IZQ, ...PIS('Beto está en el puesto 2.', 'Ana no está junto a Beto.', 'Ciro está a la izquierda de Dina.')],
      solucion: [
        { texto: 'Beto está en el puesto 2: sus vecinos son el 1 y el 3. Ana no puede ir ahí: va en el 4.' },
        { texto: 'Quedan los puestos 1 y 3 para Ciro y Dina. Ciro va a la izquierda: Ciro en el 1 y Dina en el 3.' },
        { texto: ['El único vecino de Ana, que está en el puesto 4, es el puesto 3: ', F('Dina'), '.'] },
      ],
      respuesta: [F('Dina'), ': el orden es Ciro, Beto, Dina, Ana'] },
    { nivel: 3, titulo: 'Cinco en la banca', figura: tira(G5, [Q('Eva'), null, null, null, Q('Eva')]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva miran el partido desde una banca de cinco puestos. ¿Quién ocupa el puesto 2?',
      alternativas: ['Ana', 'Beto', 'Ciro', 'Dina', 'No se puede saber'],
      datos: [D_FILA(5), D_PISTAS, ...PIS('Eva está en un extremo.', 'Ana está inmediatamente a la izquierda de Eva.', 'Beto no está junto a Dina.', 'Ciro está a la derecha de Dina.')],
      solucion: [
        { texto: 'Ana va justo a la izquierda de Eva: Eva no puede estar en el puesto 1. Eva va en el 5 y Ana, en el 4.' },
        { texto: 'Beto, Ciro y Dina ocupan los puestos 1, 2 y 3. Dina no va en el 3: Ciro no cabría a su derecha.' },
        { texto: ['Tampoco en el 2: tendría a Beto al lado. Dina va en el 1; Beto, en el 3, y ', F('Ciro'), ', en el 2.'] },
        { texto: 'En el puesto 2 no puede ir Ana, que está en el 4, ni Beto, ni Dina. «No se puede saber» no vale: queda un solo orden.' },
      ],
      respuesta: [F('C'), ': Ciro; el orden es Dina, Ciro, Beto, Ana, Eva'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: tira(R5, [null, Q('Rosa'), Q('Rosa'), Q('Rosa'), null]),
      enunciado: 'Rosa, Iván, Nora, Leo y Maru se sientan en una fila de cinco puestos. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Leo está en un extremo', 'Maru está en el puesto 1', 'Iván está junto a Rosa', 'Nora está en el puesto 5', 'Rosa está junto a Nora'],
      datos: [D_FILA(5), D_PISTAS, ...PIS('Rosa está a la izquierda de Leo.', 'Rosa no está en un extremo.', 'Rosa está a la izquierda de Nora.', 'Nora está inmediatamente a la derecha de Iván.')],
      solucion: [
        { texto: 'Rosa no va en un extremo y tiene a Leo y a Nora a su derecha. Iván va pegado a Nora, justo antes.' },
        { texto: 'Rosa no va en el 4 ni en el 3: a su derecha no cabrían Leo y Nora con Iván pegado. Rosa va en el 2.' },
        { texto: 'En los puestos 3, 4 y 5 van Iván, Nora y Leo, con Iván justo antes de Nora: Iván, Nora, Leo o Leo, Iván, Nora.' },
        { texto: ['En los 2 órdenes, el puesto 1 es de Maru: ', F('seguro'), '. A, C y D pasan en un solo orden: posibles. E no pasa en ninguno.'] },
      ],
      respuesta: [F('B'), ': Maru está en el puesto 1'] },
    { nivel: 3, titulo: 'Las edades de los dos primeros', figura: tira(R5, [null, null, null, null, null]),
      enunciado: 'Rosa, Iván, Nora, Leo y Maru se sientan en una fila de cinco puestos. ¿Cuánto suman las edades de quienes ocupan los puestos 1 y 2?',
      alternativas: ['29 años', '30 años', '31 años', '32 años', '33 años'],
      datos: [D_FILA(5), `Edades: ${lista(R5.map(x => `${x} ${EDAD[x]}`))} años.`,
        ...PIS('Rosa no está junto a Nora.', 'Rosa está a la izquierda de Nora.', 'Nora está a la izquierda de Maru.', 'Iván está inmediatamente a la izquierda de Maru.')],
      solucion: [
        { texto: 'Iván va justo antes de Maru, y Nora va antes que los dos. Cadena: Rosa, Nora, Iván, Maru.' },
        { texto: 'Rosa y Nora no van juntas: entre las dos se sienta alguien. Solo queda Leo.' },
        { texto: 'El orden es Rosa, Leo, Nora, Iván, Maru. En los puestos 1 y 2 están Rosa y Leo.',
          ecuacion: [`${EDAD.Rosa} + ${EDAD.Leo} = `, F(String(EDAD.Rosa + EDAD.Leo))] },
        { texto: '30 sumaría a Rosa con Nora; 33 sale con izquierda y derecha cambiadas; 29 y 32 ponen a otra persona en el puesto 2.' },
      ],
      respuesta: [F('C'), `: ${EDAD.Rosa + EDAD.Leo} años`] },
    { nivel: 3, titulo: 'Tres parejas en fila', figura: tira(G6, [Q('Dina'), null, null, null, null, Q('Dina')]),
      enunciado: 'Tres parejas se sientan en una fila de seis puestos, alternando varón y mujer. ¿Quién ocupa el puesto 4?',
      alternativas: ['Ana', 'Eva', 'Fito', 'Beto', 'Ciro'],
      datos: [D_FILA(6), 'Parejas: Ana y Beto, Dina y Ciro, Eva y Fito. Cada persona se sienta junto a su pareja.',
        'Mujeres (Ana, Dina y Eva) y varones (Beto, Ciro y Fito), alternados: nunca dos varones ni dos mujeres juntos.',
        ...PIS('Beto está a la izquierda de Fito.', 'Dina está en un extremo.', 'Ana no está junto a Ciro.')],
      solucion: [
        { texto: 'Cada pareja ocupa dos puestos seguidos: 1 y 2, 3 y 4, 5 y 6. Dina va en el 1 o en el 6, con Ciro al lado.' },
        { texto: 'Con Dina en el 1, Ana y Beto irían en el 3 y el 4 (Ana toca a Ciro) o al final (Beto, a la derecha de Fito): no vale.' },
        { texto: 'Dina va en el 6 y Ciro en el 5; la fila empieza con varón. Beto va antes que Fito: Beto 1, Ana 2, Fito 3.' },
        { texto: ['En el puesto 4 va la pareja de Fito: ', F('Eva'), '. Ana, en el 2, no queda junto a Ciro.'] },
      ],
      respuesta: [F('B'), ': Eva; el orden es Beto, Ana, Fito, Eva, Ciro, Dina'] },
    { nivel: 3, titulo: 'La foto de frente', figura: tira(S4, [Q('Pía'), null, null, Q('Pía')]),
      enunciado: 'Sara, Gino, Pía y Omar posan en fila para una foto, de cara a la cámara. En la foto, ¿quién aparece primero por la izquierda?',
      alternativas: ['Pía', 'Sara', 'Gino', 'Omar', 'No se puede saber'],
      datos: ['Miran a la cámara: la derecha de cada uno es la izquierda de quien mira la foto.', D_PISTAS,
        ...PIS('Gino está inmediatamente a la derecha de Sara.', 'Omar está a la izquierda de Sara.', 'Pía está en un extremo.', 'Pía no está junto a Gino.')],
      solucion: [
        { texto: 'Ellos miran hacia ti: lo que está a su derecha, tú lo ves a su izquierda. Cada pista se da vuelta.' },
        { texto: 'En la foto: Gino queda justo a la izquierda de Sara, y Omar, a la derecha de Sara.' },
        { texto: 'Pía va en un extremo y no junto a Gino: no puede ir antes de Gino. Va al final, a la derecha.' },
        { texto: ['En la foto, de izquierda a derecha: ', F('Gino'), ', Sara, Omar, Pía. Queda un solo orden: no vale «No se puede saber».'] },
      ],
      respuesta: [F('C'), ': Gino; sin dar vuelta las pistas saldría Pía'] },
  ];
  ideaFila.ejemplos = EJEMPLOS_FILA;

  // =====================================================================================================================
  // Fase 3 (19 nov): las ideas 2 a 6 rehechas contra el contrato, con la misma paleta de deducción (tinta, violeta y gris;
  // naranja y turquesa solo en las mesas) y la pieza rm-orden (escenas edificio, talla, sobres, barras y mesa).
  // =====================================================================================================================
  // Lugares con huecos (pisos vacíos, una silla libre): todos los arreglos de la gente en n lugares, sin repetir.
  const arrCache = {};
  function arreglos(gente, n) {
    const key = `${gente.join('|')}#${n}`;
    if (!arrCache[key]) {
      const out = [], ir = (pre, resto) => {
        if (pre.length === n) { if (!resto.length) out.push(pre); return; }
        if (n - pre.length > resto.length) ir(pre.concat(null), resto);
        resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1))));
      };
      ir([], gente);
      arrCache[key] = out;
    }
    return arrCache[key];
  }
  const NUM = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco'];
  const pisosTxt = k => `${NUM[k]} ${k === 1 ? 'piso' : 'pisos'}`;
  const puestosTxt = k => `${NUM[k]} ${k === 1 ? 'puesto' : 'puestos'}`;
  const lugar = (o, x) => o.indexOf(x) + 1;                   // piso o puesto de llegada (desde 1)
  const quienEn = (o, p) => o[p - 1];
  // Pistas de pisos (edificio) y de llegadas (carrera). Cada una dice cómo se lee (t) y qué arreglos cumple (ok).
  const PE = {
    arriba: (a, b, k) => ({ tipo: 'arriba', a, b, k, t: `${a} vive ${pisosTxt(k)} más arriba que ${b}.`, ok: o => lugar(o, a) - lugar(o, b) === k }),
    abajo: (a, b, k) => ({ tipo: 'abajo', a, b, k, t: `${a} vive ${pisosTxt(k)} más abajo que ${b}.`, ok: o => lugar(o, b) - lugar(o, a) === k }),
    encima: (a, b) => ({ tipo: 'encima', a, b, t: `${a} vive más arriba que ${b}.`, ok: o => lugar(o, a) > lugar(o, b) }),
    debajo: (a, b) => ({ tipo: 'debajo', a, b, t: `${a} vive más abajo que ${b}.`, ok: o => lugar(o, a) < lugar(o, b) }),
    piso: (a, p) => ({ tipo: 'piso', a, k: p, t: `${a} vive en el piso ${p}.`, ok: o => lugar(o, a) === p }),
    noPiso: (a, p) => ({ tipo: 'noPiso', a, k: p, t: `${a} no vive en el piso ${p}.`, ok: o => lugar(o, a) !== p }),
    vacio: p => ({ tipo: 'vacio', k: p, t: `El piso ${p} está vacío.`, ok: o => o[p - 1] === null }),
    vecinos: (a, b) => ({ tipo: 'vecinos', a, b, t: `${a} y ${b} viven en pisos vecinos.`, ok: o => Math.abs(lugar(o, a) - lugar(o, b)) === 1 }),
    medio: (a, b, k) => ({ tipo: 'medio', a, b, k, t: `Entre los pisos de ${a} y ${b} hay ${pisosTxt(k)}.`, ok: o => Math.abs(lugar(o, a) - lugar(o, b)) === k + 1 }),
  };
  const PL = {
    despues: (a, b, k) => ({ tipo: 'despues', a, b, k, t: `${a} llegó ${puestosTxt(k)} después que ${b}.`, ok: o => lugar(o, a) - lugar(o, b) === k }),
    justo: (a, b) => ({ tipo: 'justo', a, b, k: 1, t: `${a} llegó justo después de ${b}.`, ok: o => lugar(o, a) - lugar(o, b) === 1 }),
    antes: (a, b) => ({ tipo: 'antes', a, b, t: `${a} llegó antes que ${b}.`, ok: o => lugar(o, a) < lugar(o, b) }),
    puesto: (a, p) => ({ tipo: 'puesto', a, k: p, t: `${a} llegó en el puesto ${p}.`, ok: o => lugar(o, a) === p }),
    noPrimero: a => ({ tipo: 'noPrimero', a, t: `${a} no llegó primero.`, ok: o => lugar(o, a) !== 1 }),
    ultimo: a => ({ tipo: 'ultimo', a, t: `${a} llegó en el último puesto.`, ok: o => lugar(o, a) === o.length }),
    entre: (a, b, k) => ({ tipo: 'entre', a, b, k, t: `Entre ${a} y ${b} llegaron ${NUM[k] === 'un' ? 'una persona' : `${NUM[k]} personas`}.`, ok: o => Math.abs(lugar(o, a) - lugar(o, b)) === k + 1 }),
  };
  const cumplenEn = (base, ps) => base.filter(o => ps.every(p => p.ok(o)));
  const D_EDIF = k => `Edificio de ${k} pisos, contados desde abajo: el piso 1 da a la calle.`;
  const D_FAMILIA = 'En cada piso vive una sola persona, o ninguna: puede haber pisos vacíos.';
  const D_CARRERA = k => `Carrera de ${k}, sin empates: el puesto 1 es de quien llegó primero.`;
  const D_DIST = 'Tres pisos más arriba: tres pisos de diferencia, con dos en medio.';
  // Lo que se ve de un arreglo en la figura del edificio.
  const ocupaDe = (o, seguros = []) => o.map((x, i) => (x ? { piso: i + 1, t: x, seguro: seguros.includes(x) } : null)).filter(Boolean);
  const figEd = (k, ocupa, extra) => ({ pieza: OR, datos: Object.assign({ escena: 'edificio', pisos: k, ocupa }, extra || {}), estado: {} });
  const figLlegada = (k, nombres, fila, extra) => ({ pieza: OR, datos: Object.assign({ puestos: k, nombres, fila, rotulo: 'Llegada' }, extra || {}), estado: {} });

  // ---------- Idea 2: pisos y puestos de llegada ----------
  // Objeto: un edificio de cinco pisos con una ventana por piso (escena «edificio», dibujo de prueba). Cambia: el piso de
  // Ana · Permanece: Ciro en el 3 y el bloque «dos pisos más arriba» · Progresa: dónde cae Beto · Se reserva: cuántos
  // pisos quedan en medio de dos que se separan tres (la predicción) · Debe verse: el bloque sube y baja entero, y solo un
  // lugar no rompe nada.
  const J2_PISOS = 5, J2_CIRO = 3, J2_DIST = 2;
  const PJ2 = [PE.arriba('Beto', 'Ana', J2_DIST), PE.piso('Ciro', J2_CIRO)];
  // Dónde cae cada uno con Ana en el piso a, y qué se rompe (contado: el piso de Beto, el de Ciro, el techo).
  const j2 = a => {
    const b = a + J2_DIST;
    return { a, b, fuera: b > J2_PISOS, conCiro: a === J2_CIRO ? 'Ana' : b === J2_CIRO ? 'Beto' : null };
  };
  const J2_BIEN = [1, 2, 3, 4, 5].filter(a => { const x = j2(a); return !x.fuera && !x.conCiro; });
  if (J2_BIEN.length !== 1) throw new Error('juego de los pisos: debe haber un solo lugar');
  function edificioJ(a, o = {}) {
    const x = j2(a), ok = !x.fuera && !x.conCiro;
    return { escena: 'edificio', pisos: J2_PISOS, sobre: 2,
      ocupa: [{ piso: J2_CIRO, t: 'Ciro' }, { piso: a, t: 'Ana', seguro: ok, tacha: x.conCiro === 'Ana' }, { piso: x.b, t: 'Beto', seguro: ok, tacha: x.conCiro === 'Beto' }],
      bloque: { de: a, a: x.b, texto: '+2' },
      pistas: o.sinPistas ? undefined : PJ2.map(p => ({ t: p.t })), lineas: o.sinPistas ? 0 : PJ2.length };
  }
  function lecturaJ2(a) {
    const x = j2(a);
    if (x.fuera) return [`Beto caería en el piso ${x.b}: el bloque no cabe`];
    if (x.conCiro) return [`${x.conCiro} cae en el piso ${J2_CIRO}, que es de Ciro`];
    return [`Ana en el ${a} y Beto en el ${x.b}: `, F('no rompe ninguna pista')];
  }
  // La predicción: Eva vive tres pisos más abajo que Fito, en otro edificio de 5. ¿Cuántos pisos quedan entre los dos?
  const P2_DIST = 3, P2_PISOS = 5;
  const P2_CASOS = arreglos(['Eva', 'Fito'], P2_PISOS).filter(o => PE.abajo('Eva', 'Fito', P2_DIST).ok(o)).sort((x, y) => lugar(x, 'Eva') - lugar(y, 'Eva'));
  const P2_MEDIO = [...new Set(P2_CASOS.map(o => Math.abs(lugar(o, 'Fito') - lugar(o, 'Eva')) - 1))];
  if (P2_CASOS.length !== 2 || P2_MEDIO.length !== 1 || P2_MEDIO[0] !== 2 || lugar(P2_CASOS[0], 'Eva') !== 1) throw new Error('predicción de los pisos: las cuentas no cuadran');
  const edP2 = (o, k, desde) => ({ titulo: `Caso ${k}`, ocupa: [{ piso: lugar(o, 'Eva'), t: 'Eva', desde }, { piso: lugar(o, 'Fito'), t: 'Fito', desde }],
    bloque: { de: lugar(o, 'Eva'), a: lugar(o, 'Fito'), texto: '+3', desde },
    enMedio: Array.from({ length: P2_DIST - 1 }, (_, i) => lugar(o, 'Eva') + 1 + i), enMedioDesde: 3 });
  const D_P2 = [D_EDIF(P2_PISOS), 'Cada persona vive en un solo piso.'];
  // La regla: el mismo bloque de +3 en el edificio de 5, en el único otro lugar donde cabe, con sus dos pisos de en medio.
  const ideaPosiciones = {
    id: 'posiciones',
    titulo: 'Pisos y puestos de llegada',
    pregunta: '¿Cómo se ubica a dos vecinos separados por dos pisos?',
    temas: ['Ordenamiento lineal'],
    pieza: OR,
    aprendizaje: '«Dos pisos más arriba» amarra a dos personas en un bloque que sube y baja entero; se prueba cada lugar donde el bloque cabe.',
    actividad: 'Mover a Ana de piso y mirar dónde cae Beto.',
    lee: {
      tarjetas: [
        { titulo: 'El edificio del barrio', texto: 'Ana, Beto y Ciro viven en un edificio de cinco pisos. Cada uno vive en un piso distinto, y hay pisos donde no vive ninguno de ellos.',
          pieza: OR, dibujo: { datos: Object.assign(edificioJ(1, { sinPistas: true }), { ocupa: [], bloque: undefined, sobre: 0 }), estado: {} } },
        { titulo: 'Contar desde abajo', texto: 'Los pisos se cuentan desde la calle: el 1 es el de abajo. «Más arriba que» dice quién vive en un piso de número mayor. En una carrera, el puesto 1 es de quien llegó primero.',
          pieza: OR, dibujo: figLlegada(5, [], [null, null, null, null, null]) },
        { titulo: 'Pistas con distancia', texto: '«Beto vive dos pisos más arriba que Ana» dice cuánto: del piso de Ana al de Beto se suben dos pisos. Ana y Beto quedan amarrados en un bloque.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover a Ana de piso. Beto sube y baja con ella. Mira dónde cae Beto y qué pista se rompe en cada lugar.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: `Beto vive dos pisos más arriba que Ana. Ciro vive en el piso ${J2_CIRO}. Cada uno vive en un piso distinto.`,
      mision: {
        texto: 'Mueve a Ana de piso hasta que no se rompa ninguna pista.',
        logrado: v => v.a === J2_BIEN[0],
        bien: [`Ana en el ${J2_BIEN[0]} y Beto en el ${J2_BIEN[0] + J2_DIST}: el único lugar sin romper pistas.`],
      },
      voz: 'Beto sube y baja con Ana: muévelos juntos.',
      leyenda: [
        { s: '1 a 5', t: 'los pisos, contados desde abajo' },
        { s: '+2', t: 'el bloque: dos pisos más arriba' },
        { s: 'gris tachado', t: 'quien cae en un piso ocupado' },
        { s: F('violeta'), t: 'los nombres, si no rompen ninguna pista' },
      ],
      controles: [{ id: 'a', etiqueta: 'Piso de Ana', min: 1, max: J2_PISOS, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => ({ datos: edificioJ(v.a), estado: {} }),
      lectura: v => lecturaJ2(v.a),
      minimo: 3,
      // Se arrastra a Ana a otro piso: el bloque la sigue.
      arrastres: [{ id: 'ana', etiqueta: 'piso de Ana (Beto sube con ella)',   // sin c-f: el violeta es lo seguro
        donde: v => { const g = Kit.piezas[OR].geometria(edificioJ(v.a)); return { x: g.bx(0) + 20, y: g.yPiso(v.a) + PH2 / 2 }; },
        mover: (pt, v) => { const g = Kit.piezas[OR].geometria(edificioJ(v.a)); const a = Math.max(1, Math.min(J2_PISOS, Math.floor((g.ySuelo - pt.y) / PH2) + 1)); return a === v.a ? {} : { a }; } }],
    },
    predice: {
      pregunta: `En otro edificio de ${P2_PISOS} pisos, Eva vive tres pisos más abajo que Fito. ¿Cuántos pisos hay entre los de ellos dos?`,
      datos: D_P2,
      voz: 'Prueba dónde puede vivir Eva.',
      opciones: [
        { id: 'c', texto: 'Dos', correcta: true },
        { id: 'tres', texto: 'Tres', error: 'RMP1', siFuera: 'Tres es la distancia: los pisos que sube Fito desde Eva. En medio queda uno menos.' },
        { id: 'depende', texto: 'Depende de en qué piso viva Eva', error: 'RMP78', siFuera: 'El bloque sube y baja, pero el hueco entre los dos no cambia.' },
        { id: 'uno', texto: 'Uno', error: 'RMP1', siFuera: 'Con un piso en medio, Fito viviría solo dos pisos más arriba.' },
      ],
      dibujo: { datos: { escena: 'edificio', pisos: P2_PISOS, ocupa: [], pistas: [{ t: 'Eva vive tres pisos más abajo que Fito.' }], lineas: 1 }, estado: {} },
      revelar: { datos: { escena: 'edificio', pisos: P2_PISOS, edificios: P2_CASOS.map((o, k) => Object.assign(edP2(o, k + 1, 0), { enMedioDesde: 0 })) }, estado: {} },
      coincide: 'Coincide: tres pisos de diferencia dejan dos en medio, en cualquier lugar donde cabe el bloque.',
      noCoincide: 'Revisemos: Eva en el 1 y Fito en el 4, o Eva en el 2 y Fito en el 5. En los dos casos, dos pisos en medio.',
    },
    mira: {
      pieza: OR,
      datos: { escena: 'edificio', pisos: P2_PISOS, edificios: P2_CASOS.map((o, k) => edP2(o, k + 1, k + 1)) },
      voz: 'Prueba cada lugar del bloque y cuenta lo de en medio.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Eva en el 1: Fito, tres pisos más arriba, en el 4.' },
        { estado: { corte: 2 }, texto: 'Eva en el 2: Fito en el 5. Más arriba no cabe.' },
        { estado: { corte: 3 }, texto: 'En medio quedan el 2 y el 3, o el 3 y el 4.' },
        { estado: { corte: 3 }, texto: ['En los dos casos, dos pisos en medio: ', F('seguro'), '.'] },
        { estado: { corte: 3 }, texto: 'Tres pisos de diferencia son tres saltos; en medio queda uno menos.' },
      ],
    },
    regla: {
      texto: '«Tres pisos más arriba» amarra a dos en un bloque, con dos pisos en medio (en gris). Se prueba dónde cabe y se tacha lo que rompe otra pista.',
      ecuacion: [{ llave: ['pisos en medio'], nota: 'la diferencia, menos 1' }],
      condicion: 'los pisos se cuentan desde abajo y en cada piso vive una persona o ninguna.',
      voz: 'Antes de ubicar a alguien, prueba dónde cabe el bloque.',
      dibujo: { pieza: OR, datos: { escena: 'edificio', pisos: P2_PISOS, edificios: [edP2(P2_CASOS[0], 1, 0), edP2(P2_CASOS[1], 2, 0)].map(e => Object.assign(e, { enMedioDesde: 0 })) }, estado: {} },
    },
    ejemplos: null,   // EJEMPLOS_POS, abajo
    // Así se resuelve: el arreglo completo de un edificio, probando cada lugar del bloque y diciendo qué pista rompe cada
    // uno que no vale (se calcula: «rompe la pista N» solo si ningún arreglo con el bloque ahí la cumple). «Ahora tú»
    // pregunta otra cosa: un piso, cuántos llegaron en medio, qué piso queda vacío o qué es seguro.
    resuelve: {
      pieza: OR,
      generar(s) {
        const c = casoPisos(azar(s + 900), { k: s % 2 ? 6 : 5, gente: 3 + (s % 2), quedan: 1 });
        const bl = c.ps.find(p => p.k !== undefined && p.b), todos = arreglos(c.gente, c.k);
        const [ab, ar] = bl.tipo === 'arriba' ? [bl.b, bl.a] : [bl.a, bl.b];   // quien va abajo y quien arriba en el bloque
        const d = bl.k;
        const razones = [];
        for (let p = 1; p + d <= c.k; p++) {
          const aqui = todos.filter(o => lugar(o, ab) === p && lugar(o, ar) === p + d);
          if (aqui.some(o => c.ps.every(q => q.ok(o)))) continue;
          // La pista que se rompe sola con el bloque ahí; si ninguna, el par de pistas que no caben juntas.
          const otras = c.ps.map((q, j) => j).filter(j => c.ps[j] !== bl);
          const grupos = []; for (let m = 1; m < 1 << otras.length; m++) grupos.push(otras.filter((_, b2) => m & (1 << b2)));
          grupos.sort((x, y) => x.length - y.length);
          const cuales = grupos.find(g2 => !aqui.some(o => g2.every(j => c.ps[j].ok(o))));
          razones.push({ p, cuales });
        }
        const va = lugar(c.sol, ab);
        const cuerpo = razones.map(z => `en ${z.p} y ${z.p + d} rompe la pista ${lista(z.cuales.map((j, i) => (i ? `la ${j + 1}` : String(j + 1))), 'o')}`).join('; ');
        const pasos = [
          { tipo: 'pide', texto: `Piden el piso de cada uno, del 1 al ${c.k}.` },
          { tipo: 'regla', texto: `${ar} y ${ab} forman un bloque: ${pisosTxt(d)} de diferencia. Pruebo cada lugar donde cabe y tacho el que rompe otra pista.` },
          { tipo: 'aplica', texto: Kit.palabras(`El bloque ${cuerpo}; en ${va} y ${va + d} no rompe nada.`) <= 30 ? `El bloque ${cuerpo}; en ${va} y ${va + d} no rompe nada.` : `El bloque solo cabe sin romper pistas en los pisos ${va} y ${va + d}.`,
            dibujo: figEd(c.k, ocupaDe(c.sol.map(x => ([ab, ar].includes(x) ? x : null)), [ab, ar]), { bloque: { de: va, a: va + d, texto: `+${d}` } }) },
        ];
        const resto = c.gente.filter(x => ![ab, ar].includes(x));
        pasos.push({ tipo: 'aplica', texto: `Con el bloque en su lugar, ${lista(resto.map(x => `${x} va en el ${lugar(c.sol, x)}`))}. ${vacios(c.sol).length ? `${vacios(c.sol).length === 1 ? 'Queda vacío el piso' : 'Quedan vacíos los pisos'} ${lista(vacios(c.sol).map(String))}.` : ''}`.trim(),
          dibujo: figEd(c.k, ocupaDe(c.sol, c.gente)) });
        pasos.push({ tipo: 'sentido', texto: `Compruebo: entre ${ab} y ${ar} quedan ${d - 1 === 1 ? 'un piso' : pisosTxt(d - 1)}, uno menos que la diferencia, y nadie comparte piso.` });
        return { enunciado: `${lista(c.gente)} viven en un edificio de ${c.k} pisos. ¿En qué piso vive cada uno?`, datos: c.datos, dibujo: figEd(c.k, directasPisos(c)), pasos,
          respuesta: [F(c.gente.map(x => `${x} ${lugar(c.sol, x)}`).join(', '))] };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 el piso de alguien (4 o 5 pisos); 1 cuántos llegaron entre dos (carrera de 5 o
    // 6); 2 qué piso queda vacío; 3 nivel examen, «¿cuál es necesariamente verdadera?» (6 pisos, uno o dos arreglos en pie).
    // Cada opción y su explicación se cuentan sobre los arreglos: la distancia leída como «pisos en medio», lo que
    // valdría sin una pista, lo que pasa solo en algún arreglo y «faltan datos» cuando no faltan.
    ahoraTu: {
      pieza: OR,
      voz: 'Ubica primero el bloque: prueba dónde cabe.',
      generar(s) { return ahoraPos(s); },
    },
  };
  const PH2 = 28;   // el alto de un piso en la pieza (rm-orden, escena «edificio»)
  const vacios = o => o.map((x, i) => (x === null ? i + 1 : 0)).filter(Boolean);
  // Lo que cada pista pone por sí sola en la figura: quien tiene piso dado.
  const directasPisos = c => c.ps.filter(p => p.tipo === 'piso' || p.tipo === 'puesto').map(p => ({ piso: p.k, t: p.a }));
  // Un caso de pisos: k pisos, g personas, una pista con distancia (el bloque) y otras, sin ninguna que sobre.
  const NOMBRES_P = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'];
  function casoPisos(r, o) {
    for (let intento = 0; intento < 400; intento++) {
      const gente = r.barajar(NOMBRES_P).slice(0, o.gente).sort(), todos = arreglos(gente, o.k), sol = r.elegir(todos);
      const [x, y] = r.barajar(gente), d = lugar(sol, x) - lugar(sol, y);
      if (Math.abs(d) < 2) continue;
      const bl = d > 0 ? PE.arriba(x, y, d) : PE.abajo(x, y, -d);
      const pozo = [];
      for (const a of gente) {
        pozo.push(PE.piso(a, lugar(sol, a)));
        for (let p = 1; p <= o.k; p++) if (p !== lugar(sol, a) && r() < 0.25) pozo.push(PE.noPiso(a, p));
        for (const b of gente) if (a !== b && !([x, y].includes(a) && [x, y].includes(b))) {
          if (lugar(sol, a) > lugar(sol, b)) pozo.push(PE.encima(a, b));
          if (Math.abs(lugar(sol, a) - lugar(sol, b)) === 1 && a < b) pozo.push(PE.vecinos(a, b));
        }
      }
      if (!o.sinVacio) for (const p of vacios(sol)) pozo.push(PE.vacio(p));
      let ps = [bl];
      for (const p of r.barajar(pozo)) {
        if (cumplenEn(todos, ps).length <= o.quedan) break;
        if (p.tipo === 'piso' && [x, y].includes(p.a)) continue;          // el bloque no se regala con un piso dado
        if (cumplenEn(todos, ps.concat(p)).length < cumplenEn(todos, ps).length) ps.push(p);
      }
      const q = cumplenEn(todos, ps);
      if (q.length !== o.quedan || ps.length > 4) continue;
      // Sin pistas que sobren (el bloque se queda siempre).
      for (let i = ps.length - 1; i >= 1; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (cumplenEn(todos, sin).length === o.quedan) ps = sin; }
      if (ps.length < 2 || ps.length > 4) continue;
      if (ps.filter(p => p.tipo === 'piso').length > 1) continue;
      // El bloque tiene que poder probarse en dos lugares o más, y alguno tiene que caer.
      const lugares = []; for (let p = 1; p + Math.abs(d) <= o.k; p++) lugares.push(p);
      if (lugares.length < 2) continue;
      const orden = [ps[0]].concat(r.barajar(ps.slice(1)));
      return { k: o.k, gente, ps: orden, q, sol: q[0], datos: [D_EDIF(o.k), D_FAMILIA, ...PIS(...orden.map(p => p.t))] };
    }
    throw new Error('casoPisos: no se armó un caso');
  }
  // Un caso de carrera: k corredores, una pista con distancia y otras; quedan órdenes (o.quedan como máximo) y lo pedido
  // (o.pide: la cantidad entre dos) es el mismo en todos.
  const NOMBRES_L = ['Rosa', 'Iván', 'Nora', 'Leo', 'Maru', 'Teo'];
  function casoCarrera(r, o) {
    for (let intento = 0; intento < 400; intento++) {
      const gente = r.barajar(NOMBRES_L).slice(0, o.k).sort(), todos = arreglos(gente, o.k), sol = r.elegir(todos);
      const [x, y] = r.barajar(gente), d = lugar(sol, x) - lugar(sol, y);
      if (Math.abs(d) < 2) continue;
      const bl = d > 0 ? PL.despues(x, y, d) : PL.despues(y, x, -d);
      const pozo = [];
      for (const a of gente) {
        if (lugar(sol, a) !== 1) pozo.push(PL.noPrimero(a));
        if (lugar(sol, a) === o.k) pozo.push(PL.ultimo(a));
        pozo.push(PL.puesto(a, lugar(sol, a)));
        for (const b of gente) if (a !== b) {
          if (lugar(sol, a) < lugar(sol, b)) pozo.push(PL.antes(a, b));
          if (lugar(sol, a) - lugar(sol, b) === 1) pozo.push(PL.justo(a, b));
        }
      }
      let ps = [bl];
      const meta = q => q.length >= 1 && q.length <= o.quedan && o.listo(q, bl);
      for (const p of r.barajar(pozo)) {
        if (meta(cumplenEn(todos, ps))) break;
        if (p.tipo === 'puesto' && [x, y].includes(p.a)) continue;
        if (cumplenEn(todos, ps.concat(p)).length < cumplenEn(todos, ps).length) ps.push(p);
      }
      if (!meta(cumplenEn(todos, ps)) || ps.length > 4) continue;
      for (let i = ps.length - 1; i >= 1; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (meta(cumplenEn(todos, sin))) ps = sin; }
      if (ps.length < 2 || ps.filter(p => p.tipo === 'puesto').length > 1) continue;
      const orden = [ps[0]].concat(r.barajar(ps.slice(1))), q = cumplenEn(todos, orden);
      return { k: o.k, gente, ps: orden, q, sol: q[0], bl, datos: [D_CARRERA(o.k), ...PIS(...orden.map(p => p.t))] };
    }
    throw new Error('casoCarrera: no se armó un caso');
  }
  // Por qué no vale algo que ningún arreglo cumple: la primera pista sin la cual sí cabría (o que hay que saltarse dos).
  function porQueNoEn(base, ps, ok, dicho) {
    for (let i = 0; i < ps.length; i++) if (cumplenEn(base, ps.filter((_, j) => j !== i)).some(ok)) return { error: 'RMP72', siFuera: `Valdría sin la pista ${i + 1}. Con todas, ${dicho}.` };
    return { error: 'RMP63', siFuera: `Tendrías que saltarte dos pistas: con todas, ${dicho}.` };
  }
  // La lectura del error RMP1: la distancia del bloque tomada como «pisos en medio» (uno de más).
  const conHueco = p => (p.tipo === 'arriba' ? PE.arriba(p.a, p.b, p.k + 1) : p.tipo === 'abajo' ? PE.abajo(p.a, p.b, p.k + 1) : p.tipo === 'despues' ? PL.despues(p.a, p.b, p.k + 1) : p);
  function ahoraPos(s) {
    const r = azar(s), tipo = s % 4;
    if (tipo === 0) {
      const c = casoPisos(r, { k: 4 + (Math.floor(s / 4) % 2), gente: 3, quedan: 1 }), todos = arreglos(c.gente, c.k);
      const bl = c.ps[0], cand = [bl.a, bl.b], x = r.elegir(cand), p = lugar(c.sol, x);
      const ops = [{ id: 'c', texto: `En el piso ${p}`, correcta: true }];
      const err = cumplenEn(todos, c.ps.map(conHueco));
      if (err.length === 1 && lugar(err[0], x) !== p) ops.push({ id: 'hueco', texto: `En el piso ${lugar(err[0], x)}`, error: 'RMP1', siFuera: `Sería así si «${pisosTxt(bl.k)}» fueran los pisos de en medio. Son la diferencia: ${pisosTxt(bl.k - 1)} en medio.` });
      for (let q = 1; q <= c.k && ops.length < 4; q++) {
        if (q === p || ops.some(z => z.texto === `En el piso ${q}`)) continue;
        ops.push(Object.assign({ id: `p${q}`, texto: `En el piso ${q}` }, porQueNoEn(todos, c.ps, o => lugar(o, x) === q, `${x} no puede vivir en el piso ${q}`)));
      }
      ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada lugar del bloque queda uno solo.' });
      return { pregunta: `${lista(c.gente)} viven en un edificio de ${c.k} pisos. ¿En qué piso vive ${x}?`, datos: c.datos, dibujo: figEd(c.k, directasPisos(c)), opciones: ops,
        solucion: { texto: `El bloque cabe en un solo lugar: ${lista(c.gente.map(y => `${y} en el ${lugar(c.sol, y)}`))}.`, dibujo: figEd(c.k, ocupaDe(c.sol, [x])) } };
    }
    if (tipo === 1) {
      // Cuántos llegaron entre dos: lo que se pregunta no siempre es el bloque; cuenta en todos los órdenes que quedan.
      const k = 5 + (Math.floor(s / 4) % 2);
      let par = null;
      const c = casoCarrera(r, { k, quedan: 3, listo: (q, bl) => {
        const gente = q[0].filter(Boolean), pares = [];
        for (const a of gente) for (const b of gente) if (a < b && !(bl.a === a && bl.b === b) && !(bl.a === b && bl.b === a)) {
          const m = new Set(q.map(o => Math.abs(lugar(o, a) - lugar(o, b)) - 1));
          if (m.size === 1 && [...m][0] >= 1) pares.push([a, b, [...m][0]]);
        }
        par = pares.length ? pares[0] : null;
        return !!par;
      } });
      const cuenta = (q, a, b) => [...new Set(q.map(o => Math.abs(lugar(o, a) - lugar(o, b)) - 1))];
      const pares = [];
      for (const a of c.gente) for (const b of c.gente) if (a < b && !([c.bl.a, c.bl.b].includes(a) && [c.bl.a, c.bl.b].includes(b))) { const m = cuenta(c.q, a, b); if (m.length === 1 && m[0] >= 1) pares.push([a, b, m[0]]); }
      const [a, b, m] = r.elegir(pares);
      const ops = [{ id: 'c', texto: String(m), correcta: true },
        { id: 'salto', texto: String(m + 1), error: 'RMP1', siFuera: `${m + 1} es la diferencia de puestos entre ${a} y ${b}. En medio quedan uno menos.` },
        { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: `${c.q.length === 1 ? 'Queda 1 orden' : `Quedan ${c.q.length} órdenes`}, pero en ${c.q.length === 1 ? 'él' : c.q.length === 2 ? 'los dos' : 'todos'} hay ${m} en medio.` }];
      if (m > 1) ops.push({ id: 'menos', texto: String(m - 1), error: 'RMP1', siFuera: `Con ${m - 1} en medio, la diferencia de puestos sería ${m}. Aquí es ${m + 1}.` });
      else ops.push({ id: 'cero', texto: String(m + 2), error: 'RMP1', siFuera: `Sería así si se contaran también ${a} y ${b}. En medio solo van los de entre ellos.` });
      return { pregunta: `${lista(c.gente)} corren la carrera del aniversario. ¿Cuántos llegaron entre ${a} y ${b}?`, datos: c.datos,
        dibujo: figLlegada(k, c.gente, Array(k).fill(null).map((_, i) => (c.ps.find(p => p.tipo === 'puesto' && p.k === i + 1) || {}).a || null)), opciones: ops,
        solucion: { texto: `${c.q.length === 1 ? 'Queda un orden' : `Quedan ${c.q.length} órdenes`}; en ${c.q.length === 1 ? 'él' : c.q.length === 2 ? 'los dos' : 'todos'}, entre ${a} y ${b} llegan ${m}.`,
          dibujo: figLlegada(k, c.gente, Array(k).fill(null), { ordenes: c.q.map(o => ({ a: o })), rotuloOrden: 'Orden' }) } };
    }
    if (tipo === 2) {
      const c = casoPisos(r, { k: 5, gente: 4, quedan: 1, sinVacio: true }), todos = arreglos(c.gente, c.k), v = vacios(c.sol)[0];
      const ops = [{ id: 'c', texto: `El piso ${v}`, correcta: true }];
      for (const p of r.barajar([1, 2, 3, 4, 5].filter(p => p !== v))) {
        if (ops.length >= 4) break;
        ops.push(Object.assign({ id: `v${p}`, texto: `El piso ${p}` }, porQueNoEn(todos, c.ps, o => o[p - 1] === null, `en el piso ${p} vive ${quienEn(c.sol, p)}`)));
      }
      ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar el bloque queda un solo arreglo.' });
      return { pregunta: `${lista(c.gente)} viven en un edificio de ${c.k} pisos. ¿Qué piso queda vacío?`, datos: c.datos, dibujo: figEd(c.k, directasPisos(c)), opciones: ops,
        solucion: { texto: `Al probar el bloque queda un solo arreglo, el de la figura: el piso ${v} queda vacío.`, dibujo: figEd(c.k, ocupaDe(c.sol)) } };
    }
    // Nivel examen: 6 pisos, 4 o 5 personas, uno o dos arreglos en pie, «¿cuál es necesariamente verdadera?».
    const quedan = 1 + (Math.floor(s / 4) % 2);
    const c = casoPisos(r, { k: 6, gente: 4 + (Math.floor(s / 8) % 2), quedan }), todos = arreglos(c.gente, c.k);
    const af = [];
    for (const a of c.gente) {
      for (let p = 1; p <= c.k; p++) af.push({ t: `${a} vive en el piso ${p}`, ok: o => lugar(o, a) === p });
      for (const b of c.gente) if (a !== b) af.push({ t: `${a} vive más arriba que ${b}`, ok: o => lugar(o, a) > lugar(o, b) });
    }
    for (let p = 1; p <= c.k; p++) af.push({ t: `El piso ${p} está vacío`, ok: o => o[p - 1] === null });
    const utiles = af.filter(x => !c.ps.some(p => todos.filter(o => p.ok(o)).every(x.ok)));
    const cuenta = x => c.q.filter(x.ok).length;
    const seguras = utiles.filter(x => cuenta(x) === c.q.length), posibles = utiles.filter(x => cuenta(x) > 0 && cuenta(x) < c.q.length), imposibles = utiles.filter(x => cuenta(x) === 0);
    const bien = r.elegir(seguras);
    const ops = [{ id: 'c', texto: bien.t, correcta: true }];
    if (posibles.length) { const x = r.elegir(posibles); ops.push({ id: 'posible', texto: x.t, error: 'RMP77', siFuera: `Pasa en uno de los ${c.q.length} arreglos que quedan; en el otro, no.` }); }
    for (const x of r.barajar(imposibles)) { if (ops.length >= 4) break; ops.push(Object.assign({ id: `x${ops.length}`, texto: x.t }, porQueNoEn(todos, c.ps, x.ok, 'ningún arreglo lo cumple'))); }
    return { pregunta: `${lista(c.gente)} viven en un edificio de ${c.k} pisos. ¿Cuál es necesariamente verdadera?`, datos: c.datos, dibujo: figEd(c.k, directasPisos(c)), opciones: ops,
      solucion: { texto: quedan === 1 ? `Queda un solo arreglo, el de la figura: ${minus(bien.t)}.` : `Quedan 2 arreglos y en los dos, ${minus(bien.t)}.`, dibujo: figEd(c.k, ocupaDe(c.sol)) } };
  }
  // Solo «El piso…» baja a minúscula; una afirmación que empieza por un nombre lo conserva (auditoría, 19 nov).
  const minus = t => (/^(El|La|Los|Las) /.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

  // ---------- Ejemplos resueltos de «Pisos y puestos de llegada» ----------
  // Cada uno se resolvió aparte, por fuerza bruta, con un script que no usa el código de la unidad (scratchpad
  // e5-rm/f3/v2.py: 19 comprobaciones). 1: Beto en el 3 · 2: Leo en el 6, tres en medio · 3: Nora en el 1 o en el 2 ·
  // 4: Pía en el 1 · 5: vacío el 1 · 6: vacío el 1 (el bloque solo cabe en 2 y 4) · 7: Iván, Eva, Hugo, Fito, Gino ·
  // 8: Leo en el 4 · 9: Gino y Teo · 10: vacíos el 3 y el 4 · 11: Ciro en el 2 · 12: tres entre Nora y Leo · 13: quedan 4
  // arreglos; «Leo más abajo que Nora» en los 4, Rosa en el 1 en 2, Nora en el 5 en 3, Iván en el 3 en 2, el 4 vacío en
  // 1 · 14: vacíos el 5 y el 7 · 15: Teo, justo antes de Vilma. La figura es el planteamiento: el edificio o la tira de
  // llegadas con quien tiene lugar dado por una pista; nunca lo que sale de juntar pistas.
  const ED = (k, ocupa) => figEd(k, ocupa);
  const LL = (k, fila) => figLlegada(k, [], fila);
  const D_VECINOS = 'Pisos vecinos: uno justo encima del otro.';
  const EJEMPLOS_POS = [
    { nivel: 1, titulo: 'Dos pisos más arriba', figura: ED(4, [{ piso: 1, t: 'Ana' }]),
      enunciado: 'Ana y Beto viven en un edificio de cuatro pisos. ¿En qué piso vive Beto?',
      datos: [D_EDIF(4), ...PIS('Ana vive en el piso 1.', 'Beto vive dos pisos más arriba que Ana.')],
      solucion: [{ texto: ['Dos pisos más arriba: desde el piso 1 de Ana se sube al 2 y después al ', F('3'), '.'], ecuacion: ['1 + 2 = ', F('3')] }],
      respuesta: [F('Beto vive en el piso 3')] },
    { nivel: 1, titulo: '¿Cuántos llegaron en medio?', figura: LL(6, [null, 'Rosa', null, null, null, null]),
      enunciado: 'Seis amigos corren la carrera del aniversario. ¿Cuántos llegaron entre Rosa y Leo?',
      datos: [D_CARRERA(6), ...PIS('Rosa llegó en el puesto 2.', 'Leo llegó cuatro puestos después que Rosa.')],
      solucion: [
        { texto: 'Cuatro puestos después del 2: Leo llegó en el puesto 6.', ecuacion: ['2 + 4 = 6'] },
        { texto: ['En medio quedan los puestos 3, 4 y 5: ', F('tres'), ' personas, una menos que la diferencia de puestos.'] },
      ],
      respuesta: [F('Tres personas')] },
    { nivel: 1, titulo: '¿Dónde cabe el bloque?', figura: ED(5, []),
      enunciado: 'Iván y Nora viven en un edificio de cinco pisos. ¿En qué pisos puede vivir Nora?',
      datos: [D_EDIF(5), 'Pista: Iván vive tres pisos más arriba que Nora.'],
      solucion: [
        { texto: 'Nora en el 1 pone a Iván en el 4. Nora en el 2 pone a Iván en el 5.' },
        { texto: 'Nora en el 3 pondría a Iván en el 6, y el edificio tiene 5 pisos: ahí el bloque no cabe.' },
      ],
      respuesta: [F('En el piso 1 o en el 2')] },
    { nivel: 1, titulo: 'Antes que, con un puesto dado', figura: LL(4, [null, 'Omar', null, null]),
      enunciado: 'Sara, Gino, Pía y Omar corren una carrera. ¿En qué puesto llegó Pía?',
      datos: [D_CARRERA(4), ...PIS('Omar llegó en el puesto 2.', 'Pía llegó antes que Omar.')],
      solucion: [{ texto: ['«Antes que» pide un puesto de número menor que el de Omar. Antes del 2 solo está el ', F('1'), '.'] }],
      respuesta: [F('En el puesto 1')] },
    { nivel: 1, titulo: 'El piso vacío', figura: ED(4, [{ piso: 4, t: 'Teo' }]),
      enunciado: 'Lucho, Maru y Teo viven en un edificio de cuatro pisos. ¿Qué piso está vacío?',
      datos: [D_EDIF(4), D_FAMILIA, ...PIS('Teo vive en el piso 4.', 'Maru vive dos pisos más abajo que Teo.', 'Lucho no vive en el piso 1.')],
      solucion: [
        { texto: 'Maru vive dos pisos más abajo que Teo.', ecuacion: ['4 − 2 = 2'] },
        { texto: ['Quedan el 1 y el 3. Lucho no vive en el 1: va en el 3. El piso que nadie ocupa es el ', F('1'), '.'] },
      ],
      respuesta: [F('El piso 1')] },
    { nivel: 2, titulo: 'El bloque que esquiva', figura: ED(5, [{ piso: 3, t: 'Ciro' }]),
      enunciado: 'Ana, Beto, Ciro y Dina viven en un edificio de cinco pisos. ¿Qué piso queda vacío?',
      datos: [D_EDIF(5), D_FAMILIA, ...PIS('Ana vive dos pisos más arriba que Beto.', 'Ciro vive en el piso 3.', 'Dina vive más arriba que Ana.')],
      solucion: [
        { texto: 'El bloque de Beto y Ana cabe en 1 y 3, en 2 y 4 o en 3 y 5.' },
        { texto: 'El 3 es de Ciro: Beto va en el 2 y Ana en el 4. Dina vive más arriba que Ana: en el 5.' },
        { texto: ['Ocupados: 2, 3, 4 y 5. Nadie vive en el piso ', F('1'), '.'] },
      ],
      respuesta: [F('El piso 1')] },
    { nivel: 2, titulo: 'Dos distancias', figura: LL(5, [null, null, null, null, null]),
      enunciado: 'Eva, Fito, Gino, Hugo e Iván corren una carrera. ¿Quién llegó en el puesto 3?',
      datos: [D_CARRERA(5), ...PIS('Fito llegó dos puestos después que Eva.', 'Gino llegó justo después de Fito.', 'Hugo no llegó primero.', 'Iván llegó antes que Eva.')],
      solucion: [
        { texto: 'Eva, un puesto libre, Fito y Gino: el bloque ocupa cuatro puestos, del 1 al 4 o del 2 al 5.' },
        { texto: 'Iván llegó antes que Eva: Eva no es primera. Iván 1, Eva 2, Fito 4 y Gino 5.' },
        { texto: ['El puesto libre del bloque, el 3, es para ', F('Hugo'), ', que no llegó primero.'] },
      ],
      respuesta: [F('Hugo'), ': el orden es Iván, Eva, Hugo, Fito, Gino'] },
    { nivel: 2, titulo: 'Dos pisos en medio', figura: ED(5, [{ piso: 2, t: 'Nora' }]),
      enunciado: 'Rosa, Leo y Nora viven en un edificio de cinco pisos. ¿En qué piso vive Leo?',
      datos: [D_EDIF(5), D_FAMILIA, ...PIS('Entre los pisos de Rosa y Leo hay dos pisos.', 'Nora vive en el piso 2.', 'Leo vive más arriba que Rosa.')],
      solucion: [
        { texto: 'Dos pisos en medio son tres de diferencia. Con Rosa abajo y Leo arriba: 1 y 4, o 2 y 5.' },
        { texto: ['El piso 2 es de Nora: Rosa no va ahí. Rosa vive en el 1 y Leo, en el ', F('4'), '.'] },
      ],
      respuesta: [F('En el piso 4')] },
    { nivel: 2, titulo: '¿Quiénes llegaron en medio?', figura: LL(5, [null, null, null, null, null]),
      enunciado: 'Sara, Gino, Pía, Omar y Teo corren una carrera. ¿Quiénes llegaron entre Sara y Pía?',
      datos: [D_CARRERA(5), ...PIS('Pía llegó tres puestos después que Sara.', 'Omar llegó justo después de Pía.', 'Teo no llegó en el puesto 2.')],
      solucion: [
        { texto: 'Sara y Pía, tres puestos de diferencia: 1 y 4, o 2 y 5. Omar llega justo después de Pía, así que Pía no es la última.' },
        { texto: 'Sara 1, Pía 4 y Omar 5. En medio quedan los puestos 2 y 3, para Gino y Teo.' },
        { texto: ['Teo no llegó en el 2: Teo va en el 3 y Gino en el 2. Entre Sara y Pía llegaron ', F('Gino y Teo'), '.'] },
      ],
      respuesta: [F('Gino y Teo')] },
    { nivel: 2, titulo: 'Dos pisos vacíos', figura: ED(6, [{ piso: 6, t: 'Teo' }, { piso: 1, t: 'Maru' }]),
      enunciado: 'Lucho, Maru, Teo y Vilma viven en un edificio de seis pisos. ¿Qué pisos están vacíos?',
      datos: [D_EDIF(6), 'En cada piso vive una sola persona, o ninguna. Pisos vecinos: uno justo encima del otro.', ...PIS('Lucho y Maru viven en pisos vecinos.', 'Teo vive en el piso 6.', 'Vilma vive tres pisos más arriba que Lucho.', 'Maru vive en el piso 1.')],
      solucion: [
        { texto: 'Maru vive en el 1: su único piso vecino es el 2, para Lucho.' },
        { texto: 'Vilma vive tres pisos más arriba que Lucho.', ecuacion: ['2 + 3 = 5'] },
        { texto: ['Ocupados: 1, 2, 5 y 6. Vacíos: el ', F('3'), ' y el ', F('4'), '.'] },
      ],
      respuesta: [F('El 3 y el 4')] },
    { nivel: 3, titulo: 'Cinco familias, seis pisos', figura: ED(6, [{ piso: 4, t: 'Eva' }]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva viven en un edificio de seis pisos. ¿Quién vive en el piso 2?',
      alternativas: ['Ciro', 'Ana', 'Beto', 'Dina', 'Eva'],
      datos: [D_EDIF(6), D_FAMILIA, ...PIS('Beto vive dos pisos más arriba que Ana.', 'Dina vive tres pisos más arriba que Ciro.', 'Eva vive en el piso 4.', 'El piso 6 está vacío.')],
      solucion: [
        { texto: 'Eva tiene el 4 y el 6 está vacío: para los otros cuatro quedan el 1, el 2, el 3 y el 5.' },
        { texto: 'Ciro y Dina, tres de diferencia: en 1 y 4 rompen la pista 3, y en 3 y 6, la 4. Solo caben en 2 y 5.' },
        { texto: ['Ana y Beto toman el 1 y el 3; Eva vive en el 4 y Dina en el 5. En el piso 2 vive ', F('Ciro'), '.'] },
      ],
      respuesta: [F('A'), ': Ciro'] },
    { nivel: 3, titulo: 'Los de en medio', figura: LL(6, [null, null, null, null, null, null]),
      enunciado: 'Rosa, Iván, Nora, Leo, Maru y Teo corren la carrera del aniversario. ¿Cuántos llegaron entre Nora y Leo?',
      alternativas: ['1', '2', '3', '4', '5'],
      datos: [D_CARRERA(6), ...PIS('Leo llegó tres puestos después que Rosa.', 'Iván llegó justo después de Maru.', 'Nora llegó antes que Rosa.', 'Teo llegó en el último puesto.')],
      solucion: [
        { texto: 'Teo es el 6. Rosa y Leo, tres puestos de diferencia: 1 y 4, o 2 y 5. Nora llegó antes que Rosa: Rosa no es primera.' },
        { texto: 'Rosa 2, Leo 5 y Nora 1. Maru e Iván, seguidos, ocupan el 3 y el 4.' },
        { texto: ['Entre Nora, en el 1, y Leo, en el 5, llegaron Rosa, Maru e Iván: ', F('3'), '.'] },
        { texto: 'El 4 es la diferencia de puestos, 5 − 1; el 5 cuenta también a Nora y a Leo; el 1 y el 2 dejan fuera a alguien de en medio.' },
      ],
      respuesta: [F('C'), ': 3'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: ED(5, []),
      enunciado: 'Rosa, Iván, Nora y Leo viven en un edificio de cinco pisos. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Rosa vive en el piso 1', 'Nora vive en el piso 5', 'Iván vive en el piso 3', 'El piso 4 está vacío', 'Leo vive más abajo que Nora'],
      datos: [D_EDIF(5), D_FAMILIA, ...PIS('Iván vive dos pisos más arriba que Rosa.', 'Nora vive más arriba que Iván.', 'Leo vive más abajo que Iván.')],
      solucion: [
        { texto: 'El bloque de Rosa e Iván cabe en 1 y 3, en 2 y 4 o en 3 y 5. En 3 y 5, Nora no tendría piso sobre Iván.' },
        { texto: 'Con Rosa en el 1 e Iván en el 3: Leo en el 2, y Nora en el 4 o en el 5.' },
        { texto: 'Con Rosa en el 2 e Iván en el 4: Nora en el 5, y Leo en el 1 o en el 3.' },
        { texto: ['Leo vive debajo de Iván, y Nora encima: en los 4 arreglos, ', F('Leo vive más abajo que Nora'), '. Las demás pasan solo en algunos.'] },
      ],
      respuesta: [F('E'), ': Leo vive más abajo que Nora'] },
    { nivel: 3, titulo: 'Siete pisos, dos vacíos', figura: ED(7, [{ piso: 2, t: 'Pía' }]),
      enunciado: 'Sara, Gino, Pía, Omar y Teo viven en un edificio de siete pisos. ¿Qué pisos quedan vacíos?',
      alternativas: ['El 4 y el 6', 'El 5 y el 7', 'El 1 y el 7', 'El 3 y el 5', 'El 6 y el 7'],
      datos: [D_EDIF(7), D_FAMILIA, ...PIS('Gino vive tres pisos más arriba que Sara.', 'Omar vive dos pisos más arriba que Gino.', 'Pía vive en el piso 2.', 'Teo vive justo encima de Pía.')],
      solucion: [
        { texto: 'Teo, justo encima de Pía, vive en el 3. Sara, Gino y Omar forman un bloque: Gino 3 más arriba que Sara y Omar 2 más arriba que Gino.' },
        { texto: 'Omar vive 5 pisos más arriba que Sara: Sara en el 1 o en el 2. El 2 es de Pía: Sara 1, Gino 4 y Omar 6.', ecuacion: ['3 + 2 = 5'] },
        { texto: ['Ocupados: 1, 2, 3, 4 y 6. Vacíos: ', F('el 5 y el 7'), '.'] },
        { texto: 'En el 4 vive Gino y en el 6, Omar; en el 1, Sara; en el 3, Teo: las otras alternativas tienen un piso ocupado.' },
      ],
      respuesta: [F('B'), ': el 5 y el 7'] },
    { nivel: 3, titulo: 'Justo antes', figura: LL(5, [null, null, null, null, null]),
      enunciado: 'Lucho, Maru, Teo, Vilma y Ana llegan a la fiesta de promoción, uno tras otro. ¿Quién llegó justo antes que Vilma?',
      alternativas: ['Ana', 'Lucho', 'Maru', 'Teo', 'Faltan datos'],
      datos: ['Llegan de uno en uno: el puesto 1 es de quien llegó primero.', ...PIS('Maru llegó antes que Lucho.', 'Vilma llegó tres puestos después que Maru.', 'Teo llegó justo después de Ana.', 'Ana no llegó primera.')],
      solucion: [
        { texto: 'Maru y Vilma, tres puestos de diferencia: 1 y 4, o 2 y 5. Ana y Teo van seguidos, Ana primero.' },
        { texto: 'Con Maru 2 y Vilma 5, Ana y Teo irían en el 3 y el 4, y Lucho en el 1, antes que Maru: no vale.' },
        { texto: 'Ana no es primera y Teo va justo después de ella: Ana 2 y Teo 3. Lucho, después de Maru, llega 5.' },
        { texto: ['Justo antes que Vilma llegó ', F('Teo'), '. Ana llegó 2.ª, Maru 1.ª y Lucho 5.º; «Faltan datos» no: queda un solo orden.'] },
      ],
      respuesta: [F('D'), ': Teo'] },
  ];
  ideaPosiciones.ejemplos = EJEMPLOS_POS;

  // ---------- Idea 3: más que, menos que ----------
  // Objeto: la formación por talla para el desfile escolar (escena «talla», dibujo de prueba): cuatro alumnos de la misma
  // altura en el dibujo, porque nadie sabe cuánto mide cada uno, y debajo la cadena de flechas, del más bajo al más alto.
  // Cambia: cuántas pistas · Permanece: los cuatro y las tallas que nadie mide · Progresa: las flechas y los órdenes que
  // quedan · Se reserva: «no es más alta que», que admite el empate (la predicción) · Debe verse: dos personas sin cadena
  // entre ellas quedan sin ordenar.
  const FEM = new Set(['Ana', 'Dina', 'Eva', 'Rosa', 'Nora', 'Maru', 'Sara', 'Pía', 'Vilma', 'Gaby', 'Inés']);
  const alto = x => (FEM.has(x) ? 'alta' : 'alto'), bajo = x => (FEM.has(x) ? 'baja' : 'bajo');
  // Una comparación: menor y mayor, y cómo se dice (talla o edad). ok mira un orden (lista del menor al mayor).
  const PC = {
    alto: (a, b) => ({ tipo: 'mas', menor: b, mayor: a, t: `${a} es más ${alto(a)} que ${b}.`, ok: o => o.indexOf(a) > o.indexOf(b) }),
    bajo: (a, b) => ({ tipo: 'mas', menor: a, mayor: b, t: `${a} es más ${bajo(a)} que ${b}.`, ok: o => o.indexOf(a) < o.indexOf(b) }),
    mayor: (a, b) => ({ tipo: 'mas', menor: b, mayor: a, t: `${a} es mayor que ${b}.`, ok: o => o.indexOf(a) > o.indexOf(b) }),
    menor: (a, b) => ({ tipo: 'mas', menor: a, mayor: b, t: `${a} es menor que ${b}.`, ok: o => o.indexOf(a) < o.indexOf(b) }),
  };
  // La cadena para la figura: cada persona en una columna (de la más baja a la más alta) según las flechas dadas; quien
  // no tiene flechas va aparte. Una flecha nunca salta una columna: quien solo tiene flechas que salen se corre a la
  // derecha, junto a la columna de su siguiente.
  function cadenaDe(gente, rel) {
    const nodos = gente.filter(x => rel.some(([a, b]) => a === x || b === x)), aparte = gente.filter(x => !nodos.includes(x));
    const nivel = {};
    const ir = x => { if (nivel[x] !== undefined) return nivel[x]; const ant = rel.filter(([, b]) => b === x).map(([a]) => a); nivel[x] = ant.length ? 1 + Math.max(...ant.map(ir)) : 0; return nivel[x]; };
    nodos.forEach(ir);
    for (let vuelta = 0; vuelta < 4; vuelta++) for (const x of nodos) {
      const sig = rel.filter(([a]) => a === x).map(([, b]) => nivel[b]);
      if (sig.length) nivel[x] = Math.max(nivel[x], Math.min(...sig) - 1);
    }
    const L = nodos.length ? Math.max(...nodos.map(x => nivel[x])) + 1 : 0;
    // En cada columna, primero quien tiene una flecha que salta columnas: esa flecha va por arriba, desde el primer renglón.
    const salta = x => rel.some(([a, b]) => (a === x || b === x) && nivel[b] - nivel[a] > 1);
    const cad = Array.from({ length: L }, (_, i) => nodos.filter(x => nivel[x] === i).sort((a, b) => salta(b) - salta(a) || (a < b ? -1 : 1)));
    // limpia: cada flecha que salta columnas sale y llega al primer renglón, y no hay dos que salten (se cruzarían).
    const largas = rel.filter(([a, b]) => nivel[b] - nivel[a] > 1);
    const limpia = largas.length <= 1 && largas.every(([a, b]) => cad[nivel[a]][0] === a && cad[nivel[b]][0] === b);
    return { cadena: cad, aparte, flechas: rel.map(([de, a]) => ({ de, a, tipo: 'menor' })), limpia };
  }
  const G3J = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const PJ3 = [PC.alto('Ana', 'Beto'), PC.alto('Ciro', 'Beto'), PC.bajo('Dina', 'Beto')];
  const ordenesC = (gente, ps) => permutar(gente).filter(o => ps.every(p => p.ok(o)));   // del menor al mayor
  const quedanJ3 = n => ordenesC(G3J, PJ3.slice(0, n));
  const masBajoJ3 = n => { const q = quedanJ3(n); return q.every(o => o[0] === q[0][0]) ? q[0][0] : null; };
  const N_BAJO = [0, 1, 2, 3].find(n => masBajoJ3(n));
  const D_TALLA = 'Nadie mide lo mismo: las cuatro tallas son distintas.';
  function tallaJ(n, o = {}) {
    const c = cadenaDe(G3J, PJ3.slice(0, n).map(p => [p.menor, p.mayor])), b = masBajoJ3(n);
    c.flechas.forEach((f, k) => { f.nueva = k === n - 1; });
    return { escena: 'talla', nombres: G3J, casos: [Object.assign(c, { titulo: n ? 'Del más bajo al más alto' : 'Todavía sin flechas', seguros: b ? [b] : [] })],
      pistas: o.sinPistas ? undefined : PJ3.slice(0, n).map((p, k) => ({ t: p.t, nueva: k === n - 1 })), lineas: o.sinPistas ? 0 : PJ3.length,
      nota: `Órdenes de talla posibles: ${quedanJ3(n).length}` };
  }
  function lecturaJ3(n) {
    const q = quedanJ3(n), b = masBajoJ3(n);
    if (!n) return [`Sin pistas: ${q.length} órdenes; nadie está comparado`];
    if (b) return [`Quedan ${q.length}: el más bajo es ${b}, `, F('seguro')];
    if (n === 1) return [`Quedan ${q.length}: ${PJ3[0].menor} es más bajo que ${PJ3[0].mayor}, y nada más`];
    return [`Quedan ${q.length}: Ana y Ciro superan a Beto; entre ellos, nada`];
  }
  if (N_BAJO !== 3 || quedanJ3(2).length !== 8 || quedanJ3(1).length !== 12 || quedanJ3(3).length !== 2) throw new Error('juego de las tallas: las cuentas no cuadran');
  // La predicción: Eva no es más alta que Fito. Dos casos (más baja, o igual); nunca más alta.
  const tallaP = (o = {}) => ({ escena: 'talla', nombres: ['Eva', 'Fito'], casos: o.planteo ? [] : [
    { titulo: 'Si Eva es más baja', cadena: [['Eva'], ['Fito']], flechas: [{ de: 'Eva', a: 'Fito', tipo: 'menor', desde: o.mira ? 1 : 0 }] },
    { titulo: 'Si miden lo mismo', cadena: [['Eva', 'Fito']], flechas: [{ de: 'Eva', a: 'Fito', tipo: 'igual', desde: o.mira ? 2 : 0 }] }],
    pistas: o.planteo ? [{ t: 'Eva no es más alta que Fito.' }] : undefined, lineas: o.planteo ? 1 : 0 });
  const ideaComparar = {
    id: 'comparaciones',
    titulo: 'Más que, menos que',
    pregunta: '¿Cuándo dos comparaciones alcanzan para ordenar a tres?',
    temas: ['Ordenamiento por comparación'],
    pieza: OR,
    aprendizaje: 'Cada comparación es una flecha del menor al mayor; solo se ordena lo que una cadena une. «No es mayor» admite el empate.',
    actividad: 'Agregar pistas de talla y mirar qué flechas se encadenan.',
    lee: {
      tarjetas: [
        { titulo: 'La formación del desfile', texto: 'Para el desfile del colegio, Ana, Beto, Ciro y Dina se forman por talla, del más bajo al más alto. Nadie tiene una cinta métrica: solo se sabe quién es más alto que quién.',
          pieza: OR, dibujo: { datos: { escena: 'talla', nombres: G3J, casos: [] }, estado: {} } },
        { titulo: 'Sin puestos ni números', texto: 'Aquí no hay sillas ni pisos. Una pista compara a dos personas: «Ana es más alta que Beto». No dice cuánto mide nadie.' },
        { titulo: 'Una flecha por pista', texto: 'Cada pista se dibuja como una flecha del más bajo al más alto. Un orden de talla es una manera de formarlos a todos que cumple las flechas.' },
        { titulo: 'Qué mirar al jugar', texto: 'Agrega las pistas una a una. Mira qué flechas se unen en una cadena y cuántos órdenes de talla quedan.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: 'Ana, Beto, Ciro y Dina se forman por talla para el desfile. Nadie mide lo mismo.',
      mision: {
        texto: 'Agrega pistas hasta saber quién es el más bajo.',
        logrado: v => v.n === N_BAJO,
        bien: [`Con ${N_BAJO} pistas: Dina es más baja que Beto, y Beto, que los otros dos.`],
      },
      voz: 'Sigue las flechas: cada una sube del más bajo al más alto.',
      leyenda: [
        { s: 'flecha', t: 'va del más bajo al más alto' },
        { s: 'columnas', t: 'en la misma: todavía sin comparar' },
        { s: 'marco cortado', t: 'sin flechas todavía' },
        { s: F('marco violeta'), t: 'su lugar ya es seguro' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ3.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: tallaJ(v.n), estado: {} }),
      lectura: v => lecturaJ3(v.n),
      minimo: PJ3.length + 1,
    },
    predice: {
      pregunta: 'En otra formación, se sabe una sola cosa: Eva no es más alta que Fito. ¿Qué se puede asegurar?',
      voz: 'Piensa en todos los casos que deja la pista.',
      opciones: [
        { id: 'c', texto: 'Eva mide menos que Fito, o lo mismo', correcta: true },
        { id: 'menor', texto: 'Eva es más baja que Fito', error: 'RMP141', siFuera: 'Sería seguro si no pudieran medir lo mismo. «No es más alta» deja abierto el empate.' },
        { id: 'alreves', texto: 'Fito es más bajo que Eva', error: 'RMP64', siFuera: 'Eso es al revés: si Fito fuera más bajo, Eva sería más alta que él.' },
        { id: 'nada', texto: 'Nada: no dice cuánto miden', error: 'RMP78', siFuera: 'No hacen falta las medidas: la pista descarta que Eva sea la más alta de los dos.' },
      ],
      dibujo: { datos: tallaP({ planteo: true }), estado: {} },
      revelar: { datos: tallaP(), estado: {} },
      coincide: 'Coincide: «no es más alta» junta dos casos, ser más baja o medir lo mismo.',
      noCoincide: 'Revisemos: la pista solo descarta que Eva sea más alta. Quedan dos casos: más baja, o de la misma talla.',
    },
    mira: {
      pieza: OR,
      datos: tallaP({ mira: true }),
      voz: 'Mira los dos casos que la pista deja en pie.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si Eva es más baja que Fito, no es más alta: cumple.' },
        { estado: { corte: 2 }, texto: 'Si miden lo mismo, Eva tampoco es más alta: cumple.' },
        { estado: { corte: 2 }, texto: 'Solo se descarta un caso: que Eva sea más alta.' },
        { estado: { corte: 2 }, texto: ['Seguro: Eva mide menos que Fito, ', F('o lo mismo'), '.'] },
        { estado: { corte: 2 }, texto: 'Para decir «más baja» falta saber que no miden lo mismo.' },
      ],
    },
    regla: {
      texto: 'Cada comparación es una flecha del menor al mayor, y las flechas se encadenan. Entre dos sin cadena, no se sabe. «No es mayor que» admite el empate.',
      ecuacion: [{ llave: ['no es mayor que'], nota: 'menor, o igual' }],
      condicion: 'se comparan tallas, edades o puntajes de a dos. Si los datos dicen que todos son distintos, no hay empates.',
      voz: 'Une las flechas que comparten a alguien.',
      dibujo: { pieza: OR, datos: { escena: 'talla', nombres: G3J, casos: [Object.assign(cadenaDe(G3J, PJ3.map(p => [p.menor, p.mayor])), { titulo: 'Ana y Ciro: sin cadena entre ellos' })] }, estado: {} },
    },
    ejemplos: null,   // EJEMPLOS_COMP, abajo
    // Así se resuelve: el orden completo, uniendo una a una las pistas que comparten a alguien (la cadena crece por un
    // extremo). «Ahora tú» pregunta otra cosa: un lugar de la cadena, qué no se puede asegurar, lo seguro con «no es
    // mayor» o cuántos son mayores que alguien.
    resuelve: {
      pieza: OR,
      generar(s) {
        const r = azar(s + 900), k = 4 + (s % 2), gente = r.barajar(NOMBRES_C).slice(0, k).sort(), sol = r.barajar(gente);   // del menor al mayor
        const ps = r.barajar(sol.slice(1).map((x, i) => (r() < 0.5 ? PC.mayor(x, sol[i]) : PC.menor(sol[i], x))));
        // Se une desde la primera pista; cada paso agrega la que comparte a alguien con la cadena.
        let cad = [ps[0].menor, ps[0].mayor];
        const usadas = [0], pasos = [
          { tipo: 'pide', texto: `Piden el orden de edades, del menor al mayor, de los ${k}.` },
          { tipo: 'regla', texto: 'Cada pista es una flecha del menor al mayor. Uno las pistas que comparten a alguien: así crece la cadena.' },
        ];
        const tramos = [];
        while (usadas.length < ps.length) {
          const i = ps.findIndex((p, j) => !usadas.includes(j) && (cad.includes(p.menor) || cad.includes(p.mayor)));
          const p = ps[i];
          if (cad[cad.length - 1] === p.menor) cad = cad.concat(p.mayor); else cad = [p.menor].concat(cad);
          usadas.push(i);
          tramos.push(`la ${i + 1} pone a ${cad[0] === p.menor ? `${p.menor} antes de ${p.mayor}` : `${p.mayor} después de ${p.menor}`}`);
        }
        const fig = (rel, seg) => ({ datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [Object.assign(cadenaDe(gente, rel), { titulo: 'Del menor al mayor', seguros: seg || [] })] }, estado: {} });
        const rel = ps.map(p => [p.menor, p.mayor]);
        const mitad = Math.ceil(tramos.length / 2);
        pasos.push({ tipo: 'aplica', texto: `Empiezo con la pista 1: ${ps[0].menor} es menor que ${ps[0].mayor}. Después, ${lista(tramos.slice(0, mitad))}.`, dibujo: fig(rel.filter((_, j) => usadas.slice(0, mitad + 1).includes(j))) });
        if (tramos.length > mitad) pasos.push({ tipo: 'aplica', texto: `Por último, ${lista(tramos.slice(mitad))}.`, dibujo: fig(rel, gente) });
        pasos.push({ tipo: 'sentido', texto: `Una sola cadena une a los ${k}: cada uno queda comparado con todos, y hay un solo orden.` });
        return { enunciado: `${lista(gente)} son primos. ¿En qué orden van sus edades, del menor al mayor?`, datos: ['Las edades son distintas.', ...PIS(...ps.map(p => p.t))],
          dibujo: fig([]), pasos, respuesta: [F(sol.join(', '))] };
      },
    },
    ahoraTu: {
      pieza: OR,
      voz: 'Dibuja una flecha por pista y únelas.',
      generar(s) { return ahoraComp(s); },
    },
  };
  const NOMBRES_C = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Rosa', 'Iván', 'Leo'];
  const ORD = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto'];
  const D_EDADES = 'Las edades son distintas: no hay dos de la misma edad.';
  // Las edades con empate posible (para «no es mayor que»): cada arreglo da a cada uno un valor de 1 a k (se repiten).
  function edadesConEmpate(gente) {
    const out = [], ir = (pre) => { if (pre.length === gente.length) { out.push(Object.fromEntries(gente.map((x, i) => [x, pre[i]]))); return; } for (let v = 1; v <= gente.length; v++) ir(pre.concat(v)); };
    ir([]);
    return out;
  }
  function ahoraComp(s) {
    const r = azar(s), tipo = s % 4;
    if (tipo === 0) {
      // Una cadena de 4: ¿quién es el k-ésimo, contando desde el mayor (o desde el menor)?
      const gente = r.barajar(NOMBRES_C).slice(0, 4).sort(), sol = r.barajar(gente);
      const ps = r.barajar(sol.slice(1).map((x, i) => (r() < 0.5 ? PC.mayor(x, sol[i]) : PC.menor(sol[i], x))));
      const desdeMayor = r() < 0.5, k = r.ent(1, 2), x = desdeMayor ? sol[sol.length - 1 - k] : sol[k];
      const otroLado = desdeMayor ? sol[k] : sol[sol.length - 1 - k];
      const extremo = desdeMayor ? sol[sol.length - 1] : sol[0];
      const ops = [{ id: 'c', texto: x, correcta: true },
        { id: 'reves', texto: otroLado, error: 'RMP64', siFuera: `${otroLado} es el ${ORD[k]} contando desde el ${desdeMayor ? 'menor' : 'mayor'}. Piden contar desde el ${desdeMayor ? 'mayor' : 'menor'}.` },
        { id: 'extremo', texto: extremo, error: 'RMP61', siFuera: `${extremo} es el ${desdeMayor ? 'mayor' : 'menor'} de todos: ahí empieza a contarse.` },
        { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'Las tres pistas forman una sola cadena de cuatro: sí se sabe.' }];
      const fig = { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [Object.assign(cadenaDe(gente, ps.map(p => [p.menor, p.mayor])), { titulo: 'Del menor al mayor', seguros: [x] })] }, estado: {} };
      return { pregunta: `${lista(gente)} son primos. ¿Quién es el ${ORD[k]} contando desde el ${desdeMayor ? 'mayor' : 'menor'}?`, datos: [D_EDADES, ...PIS(...ps.map(p => p.t))],
        dibujo: { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [] }, estado: {} }, opciones: ops,
        solucion: { texto: `Del menor al mayor: ${sol.join(', ')}. Desde el ${desdeMayor ? 'mayor' : 'menor'}, el ${ORD[k]} es ${x}.`, dibujo: fig } };
    }
    if (tipo === 1) {
      // ¿Cuál no se puede asegurar? Tres pistas que dejan a dos sin cadena.
      for (let intento = 0; intento < 200; intento++) {
        const gente = r.barajar(NOMBRES_C).slice(0, 4).sort(), sol = r.barajar(gente);
        const pares = [];
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pares.push([sol[i], sol[j]]);
        const ps = r.barajar(pares).slice(0, 3).map(([a, b]) => (r() < 0.5 ? PC.mayor(b, a) : PC.menor(a, b)));
        const q = ordenesC(gente, ps);
        if (ps.some((_, i) => ordenesC(gente, ps.filter((__, j) => j !== i)).length === q.length)) continue;   // ninguna sobra
        const seguro = (a, b) => q.every(o => o.indexOf(a) < o.indexOf(b));
        const sueltos = pares.filter(([a, b]) => !seguro(a, b) && !seguro(b, a));
        const seguros = pares.filter(([a, b]) => seguro(a, b) || seguro(b, a)).map(([a, b]) => (seguro(a, b) ? [a, b] : [b, a]));
        const dados = new Set(ps.map(p => `${p.menor}|${p.mayor}`));
        const deducidos = seguros.filter(([a, b]) => !dados.has(`${a}|${b}`));
        if (!sueltos.length || !deducidos.length || seguros.length < 3 || !cadenaDe(gente, ps.map(p => [p.menor, p.mayor])).limpia) continue;
        const [a, b] = r.elegir(sueltos), dicho = r() < 0.5 ? `${a} es menor que ${b}` : `${b} es mayor que ${a}`;
        const ops = [{ id: 'c', texto: dicho, correcta: true }];
        for (const [u, v] of r.barajar(deducidos).concat(r.barajar(seguros.filter(([u, v]) => dados.has(`${u}|${v}`))))) {
          if (ops.length >= 4) break;
          ops.push({ id: `s${ops.length}`, texto: r() < 0.5 ? `${u} es menor que ${v}` : `${v} es mayor que ${u}`, error: 'RMP78',
            siFuera: dados.has(`${u}|${v}`) ? 'Esa la dice una pista: es segura.' : `Sí se asegura: una cadena de flechas va de ${u} a ${v}.` });
        }
        if (ops.length < 4) continue;
        const fig = { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [Object.assign(cadenaDe(gente, ps.map(p => [p.menor, p.mayor])), { titulo: 'Del menor al mayor' })] }, estado: {} };
        return { pregunta: `${lista(gente)} son primos. ¿Cuál no se puede asegurar?`, datos: [D_EDADES, ...PIS(...ps.map(p => p.t))],
          dibujo: { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [] }, estado: {} }, opciones: ops,
          solucion: { texto: `Quedan ${q.length} órdenes. Entre ${a} y ${b} no hay cadena de flechas: no se sabe quién es mayor.`, dibujo: fig } };
      }
      throw new Error('ahoraComp: no se armó un caso de «no se puede asegurar»');
    }
    if (tipo === 2) {
      // «No es mayor que» con empates posibles: A no es mayor que B y C es mayor que B (o la cadena al revés).
      const [a, b, c] = r.barajar(NOMBRES_C).slice(0, 3), gente = [a, b, c].sort(), arriba = r() < 0.5;
      const ps = arriba
        ? [{ t: `${a} no es mayor que ${b}.`, ok: e => !(e[a] > e[b]) }, { t: `${c} es mayor que ${b}.`, ok: e => e[c] > e[b] }]
        : [{ t: `${a} no es menor que ${b}.`, ok: e => !(e[a] < e[b]) }, { t: `${c} es menor que ${b}.`, ok: e => e[c] < e[b] }];
      const q = edadesConEmpate(gente).filter(e => ps.every(p => p.ok(e)));
      const vale = f => (q.every(f) ? 'siempre' : q.some(f) ? 'aveces' : 'nunca');
      const bien = arriba ? `${a} es menor que ${c}` : `${a} es mayor que ${c}`;
      if (vale(e => (arriba ? e[a] < e[c] : e[a] > e[c])) !== 'siempre') throw new Error('comparaciones: lo seguro no lo es');
      const ops = [{ id: 'c', texto: bien, correcta: true },
        { id: 'sinEmpate', texto: arriba ? `${a} es menor que ${b}` : `${a} es mayor que ${b}`, error: 'RMP141', siFuera: `Sería seguro si no pudieran tener la misma edad. «No es ${arriba ? 'mayor' : 'menor'}» deja el empate.` },
        { id: 'igual', texto: `${a} y ${b} tienen la misma edad`, error: 'RMP77', siFuera: 'Puede pasar, pero también puede no pasar: es posible, no seguro.' },
        { id: 'reves', texto: arriba ? `${b} es menor que ${a}` : `${b} es mayor que ${a}`, error: 'RMP64', siFuera: `Eso es al revés: la pista 1 dice que ${a} no es ${arriba ? 'mayor' : 'menor'} que ${b}.` }];
      if (vale(e => (arriba ? e[a] < e[b] : e[a] > e[b])) !== 'aveces' || vale(e => e[a] === e[b]) !== 'aveces' || vale(e => (arriba ? e[b] < e[a] : e[b] > e[a])) !== 'nunca') throw new Error('comparaciones: las opciones no cuadran');
      const fig = { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [
        { titulo: `Si ${a} y ${b} no empatan`, cadena: arriba ? [[a], [b], [c]] : [[c], [b], [a]], flechas: arriba ? [{ de: a, a: b, tipo: 'menor' }, { de: b, a: c, tipo: 'menor' }] : [{ de: c, a: b, tipo: 'menor' }, { de: b, a, tipo: 'menor' }] },
        { titulo: `Si ${a} y ${b} empatan`, cadena: arriba ? [[a, b], [c]] : [[c], [a, b]], flechas: [{ de: a, a: b, tipo: 'igual' }, arriba ? { de: b, a: c, tipo: 'menor' } : { de: c, a: b, tipo: 'menor' }] }] }, estado: {} };
      return { pregunta: `${lista(gente)} son hermanos; puede haber mellizos. ¿Qué es seguro?`, datos: ['Mellizos: hermanos de la misma edad.', ...PIS(...ps.map(p => p.t))],
        dibujo: { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [] }, estado: {} }, opciones: ops,
        solucion: { texto: arriba ? `${a} no supera a ${b}, y ${c} sí supera a ${b}: en todos los casos, ${bien}.` : `${b} no supera a ${a}, y ${b} supera a ${c}: en todos los casos, ${bien}.`, dibujo: fig } };
    }
    // Nivel examen: cinco primos y cuatro pistas; ¿cuántos son, con seguridad, mayores que alguien?
    for (let intento = 0; intento < 400; intento++) {
      const gente = r.barajar(NOMBRES_C).slice(0, 5).sort(), sol = r.barajar(gente), pares = [];
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pares.push([sol[i], sol[j]]);
      const ps = r.barajar(pares).slice(0, 4).map(([a, b]) => (r() < 0.5 ? PC.mayor(b, a) : PC.menor(a, b)));
      const q = ordenesC(gente, ps);
      if (ps.some((_, i) => ordenesC(gente, ps.filter((__, j) => j !== i)).length === q.length)) continue;
      const x = r.elegir(gente);
      const seguros = gente.filter(y => y !== x && q.every(o => o.indexOf(y) > o.indexOf(x))).length;
      const posibles = gente.filter(y => y !== x && q.some(o => o.indexOf(y) > o.indexOf(x)) && !q.every(o => o.indexOf(y) > o.indexOf(x))).length;
      const directos = new Set(ps.filter(p => p.menor === x).map(p => p.mayor)).size;
      if (!posibles || directos === seguros || seguros === 0 || !cadenaDe(gente, ps.map(p => [p.menor, p.mayor])).limpia) continue;
      const ops = [{ id: 'c', texto: String(seguros), correcta: true },
        { id: 'posibles', texto: String(seguros + posibles), error: 'RMP77', siFuera: `Así se cuentan también ${posibles === 1 ? 'el que puede' : `los ${posibles} que pueden`} ser mayores o no: posibles, no seguros.` },
        { id: 'directos', texto: String(directos), error: 'RMP63', siFuera: `${directos} son los que una pista compara con ${x} directamente. Las cadenas de flechas suman más.` },
        { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'No se sabe el orden completo, pero sí cuántos quedan con seguridad por encima.' }];
      if (new Set(ops.map(o => o.texto)).size < 4) continue;
      const fig = { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [Object.assign(cadenaDe(gente, ps.map(p => [p.menor, p.mayor])), { titulo: 'Del menor al mayor' })] }, estado: {} };
      return { pregunta: `${lista(gente)} son primos. ¿Cuántos son, con seguridad, mayores que ${x}?`, datos: [D_EDADES, ...PIS(...ps.map(p => p.t))],
        dibujo: { datos: { escena: 'talla', tallimetro: false, nombres: gente, casos: [] }, estado: {} }, opciones: ops,
        solucion: { texto: `Desde ${x}, las flechas suben hasta ${lista(gente.filter(y => y !== x && q.every(o => o.indexOf(y) > o.indexOf(x))))}: ${seguros === 1 ? '1 mayor' : `${seguros} mayores`} con seguridad.`, dibujo: fig } };
    }
    throw new Error('ahoraComp: no se armó un caso');
  }

  // ---------- Ejemplos resueltos de «Más que, menos que» ----------
  // Recalculados aparte por fuerza bruta (scratchpad e5-rm/f3/v3.py, 21 comprobaciones, también el juego y la
  // predicción): 1 Ciro · 2 «Leo es más alto que Rosa» · 3 no se sabe · 4 Eva menor · 5 quedan 3 · 6 Maru · 7 Sara u Omar
  // (3 órdenes) · 8 no se puede asegurar (ver su nota) · 9 la misma talla · 10 solo Ciro (3 órdenes) · 11 «Ana es menor que Ciro» (las otras: dos
  // posibles por el empate y dos que nunca pasan) · 12 Nora · 13 «Maru es más alta que Lucho» (3 órdenes) · 14 quedan 6 ·
  // 15 tres. La figura es el planteamiento: los alumnos de la formación, sin cadena; la cadena va en el resuelto.
  // Sin tallímetro cuando se comparan edades o puntajes (auditoría, 19 nov: el dibujo es lo que nombra el texto).
  const TA = (nombres, sinTalla) => ({ pieza: OR, datos: Object.assign({ escena: 'talla', nombres, casos: [] }, sinTalla ? { tallimetro: false } : {}), estado: {} });
  const D_EMPATE = 'Puede haber empates: dos con la misma talla.';
  const EJEMPLOS_COMP = [
    { nivel: 1, titulo: 'Una cadena de tres', figura: TA(['Ana', 'Beto', 'Ciro'], true),
      enunciado: 'Ana, Beto y Ciro son hermanos. ¿Quién es el menor?',
      datos: [D_EDADES, ...PIS('Ana es mayor que Beto.', 'Beto es mayor que Ciro.')],
      solucion: [{ texto: ['Dos flechas, Ciro → Beto y Beto → Ana, comparten a Beto: Ciro, después Beto, después Ana. El menor es ', F('Ciro'), '.'] }],
      respuesta: [F('Ciro')] },
    { nivel: 1, titulo: 'Dicho al revés', figura: TA(['Rosa', 'Leo']),
      enunciado: 'La pista dice: «Rosa es más baja que Leo». ¿Cuál de estas frases dice lo mismo: «Leo es más alto que Rosa» o «Rosa es más alta que Leo»?',
      datos: ['Rosa y Leo no miden lo mismo.'],
      solucion: [{ texto: ['«Rosa es más baja que Leo»: flecha de Rosa a Leo. ', F('«Leo es más alto que Rosa»'), ' es la misma flecha; «Rosa es más alta que Leo», la contraria.'] }],
      respuesta: [F('«Leo es más alto que Rosa»')] },
    { nivel: 1, titulo: 'Sin cadena', figura: TA(['Ana', 'Beto', 'Ciro']),
      enunciado: 'Ana, Beto y Ciro se forman por talla. ¿Se sabe quién es más alto entre Ana y Ciro?',
      datos: [D_TALLA.replace('las cuatro', 'las tres'), ...PIS('Ana es más alta que Beto.', 'Ciro es más alto que Beto.')],
      solucion: [
        { texto: 'Cada pista es una flecha del más bajo al más alto: Beto → Ana y Beto → Ciro. Las dos salen de Beto.' },
        { texto: ['Ninguna cadena une a Ana con Ciro: Beto, Ana, Ciro y Beto, Ciro, Ana cumplen las dos pistas. ', F('No se sabe'), '.'] },
      ],
      respuesta: [F('No se sabe'), ': solo que los dos son más altos que Beto'] },
    { nivel: 1, titulo: 'No mayor, sin empates', figura: TA(['Eva', 'Fito'], true),
      enunciado: 'Eva y Fito son primos. ¿Qué se sabe de sus edades?',
      datos: ['Eva y Fito no tienen la misma edad.', 'Pista: Eva no es mayor que Fito.'],
      solucion: [{ texto: ['«No es mayor» deja dos casos: menor o de la misma edad. Las edades son distintas: queda ', F('Eva es menor que Fito'), '.'] }],
      respuesta: [F('Eva es menor que Fito')] },
    { nivel: 1, titulo: '¿Cuántos órdenes quedan?', figura: TA(['Ana', 'Beto', 'Ciro']),
      enunciado: 'Ana, Beto y Ciro se forman por talla. Con la pista de abajo, ¿cuántos órdenes de talla quedan?',
      datos: [D_TALLA.replace('las cuatro', 'las tres'), 'Sin pistas hay 6 órdenes de talla.', 'Pista: Ana es más alta que Beto.'],
      solucion: [
        { texto: 'En cada orden, Ana va antes o después de Beto. La pista se queda con los que tienen a Beto antes, del más bajo al más alto.' },
        { texto: ['Beto, Ana, Ciro · Beto, Ciro, Ana · Ciro, Beto, Ana: ', F('3'), ', la mitad de 6.'] },
      ],
      respuesta: [F('Quedan 3 órdenes')] },
    { nivel: 2, titulo: 'Dos cadenas que se juntan', figura: TA(['Lucho', 'Maru', 'Teo', 'Vilma']),
      enunciado: 'Lucho, Maru, Teo y Vilma se forman por talla para el desfile. ¿Quién es el segundo más alto?',
      datos: [D_TALLA, ...PIS('Maru es más alta que Teo.', 'Lucho es más bajo que Teo.', 'Vilma es más alta que Maru.')],
      solucion: [
        { texto: 'Las pistas 1 y 2 comparten a Teo: Lucho, Teo, Maru. La pista 3 pone a Vilma después de Maru.' },
        { texto: ['Del más bajo al más alto: Lucho, Teo, Maru, Vilma. La más alta es Vilma; la segunda, ', F('Maru'), '.'] },
      ],
      respuesta: [F('Maru')] },
    { nivel: 2, titulo: '¿Quién puede ser el más alto?', figura: TA(['Sara', 'Gino', 'Pía', 'Omar']),
      enunciado: 'Sara, Gino, Pía y Omar se forman por talla. ¿Quiénes pueden ser el más alto?',
      datos: [D_TALLA, ...PIS('Sara es más alta que Gino.', 'Gino es más alto que Pía.', 'Omar es más alto que Pía.')],
      solucion: [
        { texto: 'Cadena: Pía, Gino, Sara. Omar solo se compara con Pía: va en algún lugar después de ella.' },
        { texto: 'Omar entre Pía y Gino, entre Gino y Sara, o al final: quedan 3 órdenes.' },
        { texto: ['El más alto es Sara en dos de ellos y Omar en el otro: ', F('Sara u Omar'), '. Pía es siempre la más baja.'] },
      ],
      respuesta: [F('Sara u Omar')] },
    // Apertura (piedra, papel o tijera; aperturas-para-la-teoria, 28 nov): una relación que no se encadena. Comprobado
    // aparte: con las dos pistas, la partida de Gino con Omar puede ganarla cualquiera de los dos (Gino gana a los dos, o
    // Gino a Pía, Pía a Omar y Omar a Gino); las dos maneras cumplen las pistas.
    { nivel: 2, titulo: 'Ganar una partida no encadena', figura: TA(['Gino', 'Pía', 'Omar'], true),
      enunciado: 'Gino, Pía y Omar juegan tenis de mesa en el recreo, y cada uno juega una partida contra cada uno de los otros dos. ¿Se puede asegurar que Gino le ganó a Omar?',
      datos: ['En tenis de mesa no hay empates: cada partida la gana alguien.', ...PIS('Gino le ganó a Pía.', 'Pía le ganó a Omar.')],
      solucion: [
        { texto: 'Con «es más alto que» sí habría cadena: si Gino es más alto que Pía y Pía es más alta que Omar, Gino es más alto que Omar, porque cada uno tiene una sola talla.' },
        { texto: '«Le ganó a» no compara una medida que cada uno tenga, sino el resultado de una partida. Gino le gana a Pía, Pía a Omar y Omar a Gino cumple las dos pistas, como piedra, papel y tijera.' },
        { texto: ['Las pistas no deciden la tercera partida, así que ', F('no se puede asegurar'), '. Solo las comparaciones de una misma medida, como la talla, la edad o el puntaje, forman fila.'] },
      ],
      respuesta: [F('No se puede asegurar'), ': la partida de Gino con Omar pudo ganarla cualquiera'] },
    { nivel: 2, titulo: 'Dos «no es más alto»', figura: TA(['Eva', 'Fito']),
      enunciado: 'Eva y Fito están en la formación del desfile. ¿Qué se sabe de sus tallas?',
      datos: [D_EMPATE, ...PIS('Eva no es más alta que Fito.', 'Fito no es más alto que Eva.')],
      solucion: [
        { texto: 'La pista 1 deja: Eva más baja, o igual. La pista 2 deja: Fito más bajo, o igual.' },
        { texto: ['El único caso que cumple las dos: ', F('miden lo mismo'), '.'] },
      ],
      respuesta: [F('Eva y Fito tienen la misma talla')] },
    { nivel: 2, titulo: 'Mayores con seguridad', figura: TA(['Ana', 'Beto', 'Ciro', 'Dina'], true),
      enunciado: 'Ana, Beto, Ciro y Dina son primos. ¿Quiénes son, con seguridad, mayores que Beto?',
      datos: [D_EDADES, ...PIS('Beto es menor que Ciro.', 'Dina es menor que Beto.', 'Ana es mayor que Dina.')],
      solucion: [
        { texto: 'Cadena: Dina, Beto, Ciro. Ana solo se compara con Dina: va después de ella, sin saber dónde.' },
        { texto: 'Ana puede ir entre Dina y Beto, entre Beto y Ciro, o al final: 3 órdenes. En uno, Ana es menor que Beto.' },
        { texto: ['Mayor que Beto en los 3: solo ', F('Ciro'), '.'] },
      ],
      respuesta: [F('Solo Ciro')] },
    { nivel: 3, titulo: 'Mellizos en la familia', figura: TA(['Ana', 'Beto', 'Ciro', 'Dina'], true),
      enunciado: 'Ana, Beto, Ciro y Dina son hermanos; en la familia hay mellizos. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Ana es menor que Beto', 'Dina es mayor que Ciro', 'Beto es menor que Ana', 'Ciro es mayor que Dina', 'Ana es menor que Ciro'],
      datos: ['Mellizos: hermanos de la misma edad.', ...PIS('Ana no es mayor que Beto.', 'Ciro es mayor que Beto.', 'Dina no es menor que Ciro.')],
      solucion: [
        { texto: 'Pista 1: Ana menor que Beto, o igual. Pista 3: Dina mayor que Ciro, o igual. Cadena: Ana, Beto, Ciro, Dina, con dos empates posibles.' },
        { texto: ['Ana no pasa a Beto y Beto es menor que Ciro: ', F('Ana es menor que Ciro'), ', siempre.'] },
        { texto: 'A y B olvidan el empate: Ana y Beto, o Ciro y Dina, pueden ser mellizos. C y D dan vuelta una pista: nunca pasan.' },
      ],
      respuesta: [F('E'), ': Ana es menor que Ciro'] },
    { nivel: 3, titulo: 'El segundo puesto', figura: TA(['Rosa', 'Iván', 'Nora', 'Leo', 'Maru'], true),
      enunciado: 'Rosa, Iván, Nora, Leo y Maru participan en el concurso de oratoria. ¿Quién quedó segundo, contando desde el que sacó más puntos?',
      alternativas: ['Nora', 'Iván', 'Maru', 'Rosa', 'Leo'],
      datos: ['Los cinco puntajes son distintos.', ...PIS('Rosa sacó más puntos que Iván, pero menos que Nora.', 'Leo sacó menos puntos que Iván.', 'Maru sacó más puntos que Nora.')],
      solucion: [
        { texto: 'La pista 1 son dos flechas: Iván → Rosa → Nora. La 2 pone a Leo antes de Iván; la 3, a Maru después de Nora.' },
        { texto: ['Del que sacó menos al que sacó más: Leo, Iván, Rosa, Nora, Maru. El segundo desde arriba es ', F('Nora'), '.'] },
        { texto: 'Maru es la primera; Rosa, la tercera; Iván es el segundo contando desde abajo, y Leo, el último.' },
      ],
      respuesta: [F('A'), ': Nora'] },
    { nivel: 3, titulo: '¿Cuál no se puede asegurar?', figura: TA(['Teo', 'Lucho', 'Vilma', 'Maru']),
      enunciado: 'Teo, Lucho, Vilma y Maru se forman por talla para el desfile. ¿Cuál no se puede asegurar?',
      alternativas: ['Teo es más alto que Vilma', 'Vilma es la más baja', 'Lucho es más bajo que Teo', 'Maru es más alta que Lucho', 'Vilma es más baja que Maru'],
      datos: [D_TALLA, ...PIS('Teo es más alto que Lucho.', 'Vilma es más baja que Lucho.', 'Maru es más alta que Vilma.')],
      solucion: [
        { texto: 'Cadena: Vilma, Lucho, Teo. Maru solo se compara con Vilma: va después de ella, en uno de 3 lugares.' },
        { texto: ['Con Maru entre Vilma y Lucho, ella es más baja que Lucho. ', F('«Maru es más alta que Lucho»'), ' no se puede asegurar.'] },
        { texto: 'Las otras se aseguran: A sale de la cadena, B también (Vilma queda debajo de todos), y C y E las dicen las pistas.' },
      ],
      respuesta: [F('D'), ': Maru es más alta que Lucho'] },
    { nivel: 3, titulo: 'Dos pistas sueltas', figura: TA(['Ana', 'Beto', 'Ciro', 'Dina'], true),
      enunciado: 'Ana, Beto, Ciro y Dina son primos. ¿Cuántos órdenes de edad, del menor al mayor, cumplen las dos pistas?',
      alternativas: ['4', '6', '8', '12', '24'],
      datos: [D_EDADES, 'Sin pistas, cuatro personas se ordenan de 24 maneras.', ...PIS('Ana es mayor que Beto.', 'Ciro es mayor que Dina.')],
      solucion: [
        { texto: 'Cada pista se queda con la mitad de los órdenes: en la mitad, Beto es menor que Ana; en la otra mitad, mayor.' },
        { texto: ['Las dos pistas no comparten a nadie: cada una corta a la mitad lo que deja la otra. ', F('6'), ' órdenes.'], ecuacion: ['24 ÷ 2 ÷ 2 = ', F('6')] },
        { texto: '24 son los órdenes sin pistas, y 12, con una sola. 8 y 4 no salen de partir en mitades.' },
      ],
      respuesta: [F('B'), ': 6'] },
    { nivel: 3, titulo: 'Los menores que Teo', figura: TA(['Lucho', 'Maru', 'Teo', 'Vilma', 'Ana'], true),
      enunciado: 'Lucho, Maru, Teo, Vilma y Ana son hermanos. ¿Cuántos de ellos son menores que Teo?',
      alternativas: ['1', '2', '3', '4', '5'],
      datos: [D_EDADES, ...PIS('Lucho es mayor que Maru y menor que Teo.', 'Vilma es menor que Maru.', 'Ana es mayor que Teo.')],
      solucion: [
        { texto: 'Pista 1: Maru → Lucho → Teo. Pista 2: Vilma → Maru. Pista 3: Teo → Ana.' },
        { texto: ['Cadena del menor al mayor: Vilma, Maru, Lucho, Teo, Ana. Antes de Teo van ', F('3'), '.'] },
        { texto: '1 cuenta solo a Lucho, que la pista compara con Teo; 2 olvida a Vilma, unida por Maru; 4 cuenta a Teo o a Ana; 5 son todos.' },
      ],
      respuesta: [F('C'), ': 3'] },
  ];
  ideaComparar.ejemplos = EJEMPLOS_COMP;

  // ---------- Idea 4: ordenar con sumas y diferencias ----------
  // Objeto: los tres sobres de la rifa del aniversario, con 20, 50 y 100 soles (escena «sobres», dibujo de prueba), y
  // debajo los 6 repartos posibles. Cambia: cuántas pistas · Permanece: los tres montos a la vista · Progresa: los
  // repartos tachados · Se reserva: dos sumas iguales (la predicción, con dos barras del mismo largo) · Debe verse: una
  // suma dice qué par es, y con eso queda el sobre de quien la pista no nombra.
  const SOBRES = [20, 50, 100], TRES = ['Ana', 'Beto', 'Ciro'];
  const soles = v => `S/ ${v}`;
  const PJ4 = [
    { t: 'Beto y Ciro juntos recibieron 120 soles.', ok: x => x[1] + x[2] === 120 },
    { t: 'Ana recibió más que Beto.', ok: x => x[0] > x[1] },
  ];
  const REP4 = permutar(SOBRES);
  const quedanJ4 = n => REP4.filter(x => PJ4.slice(0, n).every(p => p.ok(x)));
  const fijosJ4 = n => fijosDe(quedanJ4(n));
  function sobresJ(n, o = {}) {
    return { escena: 'sobres', sobres: SOBRES.map(soles), columnas: TRES, rotuloOrden: 'Reparto',
      ordenes: o.sinOrdenes ? undefined : REP4.map(x => ({ a: x.map(soles), fuera: !PJ4.slice(0, n).every(p => p.ok(x)) })),
      fijos: o.sinOrdenes ? undefined : fijosJ4(n).map(c => ({ c })),
      pistas: o.sinPistas ? undefined : PJ4.slice(0, n).map((p, k) => ({ t: p.t, nueva: k === n - 1 })), lineas: o.sinPistas ? 0 : PJ4.length };
  }
  function lecturaJ4(n) {
    const q = quedanJ4(n), fij = fijosJ4(n);
    if (!n) return [`Sin pistas: ${q.length} repartos de los tres sobres`];
    if (q.length === 1) return ['Queda 1 reparto: ', F(q[0].map((v, k) => `${TRES[k]} ${v}`).join(', '))];
    return [`120 = 20 + 100: Ana tiene el de ${q[0][fij[0]]}, aunque no la nombran`];
  }
  if (quedanJ4(1).length !== 2 || fijosJ4(1).join() !== '0' || quedanJ4(2).length !== 1) throw new Error('juego de los sobres: las cuentas no cuadran');
  // La predicción: Ana + Beto = Ciro + Dina y Ana es mayor que Ciro. Un caso que lo cumple, comprobado, para la figura.
  const EP = { Ana: 17, Beto: 14, Ciro: 15, Dina: 16 };
  if (EP.Ana + EP.Beto !== EP.Ciro + EP.Dina || !(EP.Ana > EP.Ciro && EP.Beto < EP.Dina)) throw new Error('predicción de las sumas: el caso no cumple');
  const barrasP = (o = {}) => ({ barras: o.planteo
    ? [{ rotulo: 'Edades de Ana y Beto, juntas', partes: [{ t: 'Ana + Beto', v: EP.Ana + EP.Beto, texto: '?' }] }, { rotulo: 'Edades de Ciro y Dina, juntas', partes: [{ t: 'Ciro + Dina', v: EP.Ciro + EP.Dina, texto: '?' }] }]
    : [{ rotulo: 'Edades de Ana y Beto', partes: [{ t: 'Ana', v: EP.Ana, texto: String(EP.Ana), desde: o.mira ? 1 : 0 }, { t: 'Beto', v: EP.Beto, texto: String(EP.Beto), desde: o.mira ? 1 : 0, seguro: !o.mira }] },
      { rotulo: 'Edades de Ciro y Dina', partes: [{ t: 'Ciro', v: EP.Ciro, texto: String(EP.Ciro), desde: o.mira ? 1 : 0 }, { t: 'Dina', v: EP.Dina, texto: String(EP.Dina), desde: o.mira ? 1 : 0, seguro: !o.mira }] }],
    banda: o.planteo ? undefined : { de: EP.Ciro, a: EP.Ana, desde: o.mira ? 2 : 0 } });
  const ideaNumeros = {
    id: 'con-numeros',
    titulo: 'Ordenar con sumas y diferencias',
    pregunta: '¿Qué dice una suma sobre quién tiene más?',
    temas: ['Ordenamiento por comparación'],
    pieza: OR,
    aprendizaje: 'Con los valores a la vista, una suma dice qué par es; si dos pares suman igual, quien gana en uno pierde en el otro.',
    actividad: 'Agregar pistas de sumas y mirar qué repartos quedan.',
    lee: {
      tarjetas: [
        { titulo: 'La rifa del aniversario', texto: 'En la rifa del aniversario hay tres sobres: uno de 20, uno de 50 y uno de 100 soles. Ana, Beto y Ciro ganan uno cada uno.',
          pieza: OR, dibujo: { datos: sobresJ(0, { sinOrdenes: true, sinPistas: true }), estado: {} } },
        { titulo: 'Los repartos', texto: 'Un reparto dice qué sobre recibe cada uno, como un orden dice quién va en cada puesto. Con tres sobres distintos hay 3 × 2 × 1 = 6 repartos.' },
        { titulo: 'Pistas con números', texto: 'Ahora las pistas traen números: «Beto y Ciro juntos recibieron 120 soles» suma lo de dos personas. Se compara con las sumas que pueden dar los sobres.' },
        { titulo: 'Qué mirar al jugar', texto: 'Agrega las pistas una a una. Mira qué repartos se tachan y qué sobre queda fijo, aunque la pista no nombre a su dueño.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: 'Tres sobres de la rifa: 20, 50 y 100 soles. Ana, Beto y Ciro reciben uno cada uno.',
      mision: {
        texto: 'Agrega pistas hasta saber cuánto recibió cada uno.',
        logrado: v => v.n === PJ4.length,
        bien: ['Con las dos pistas queda un solo reparto.'],
      },
      voz: 'Busca qué dos sobres dan la suma de la pista.',
      leyenda: [
        { s: 'S/', t: 'soles: lo que trae cada sobre' },
        { s: 'Reparto', t: 'quién recibe cada sobre' },
        { s: 'gris tachado', t: 'reparto que una pista descarta' },
        { s: F('marco violeta'), t: 'monto seguro' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ4.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: sobresJ(v.n), estado: {} }),
      lectura: v => lecturaJ4(v.n),
      minimo: PJ4.length + 1,
    },
    predice: {
      pregunta: 'Las edades de Ana y Beto suman lo mismo que las de Ciro y Dina. Ana es mayor que Ciro. ¿Qué se puede asegurar?',
      datos: ['Las cuatro edades son distintas.'],
      voz: 'Compara las dos barras: miden lo mismo.',
      opciones: [
        { id: 'c', texto: 'Beto es menor que Dina', correcta: true },
        { id: 'mismo', texto: 'Beto es mayor que Dina', error: 'RMP143', siFuera: 'Así, Ana y Beto juntos sumarían más que Ciro y Dina, y suman lo mismo.' },
        { id: 'igual', texto: 'Beto y Dina tienen la misma edad', error: 'RMP72', siFuera: 'Con Beto y Dina iguales, Ana y Ciro también lo serían, y Ana es mayor.' },
        { id: 'nada', texto: 'Nada: faltan las edades', error: 'RMP78', siFuera: 'No hacen falta: lo que Ana le gana a Ciro, Beto lo pierde con Dina.' },
      ],
      dibujo: { datos: barrasP({ planteo: true }), estado: {} },
      revelar: { datos: barrasP(), estado: {} },
      coincide: 'Coincide: las dos barras miden lo mismo; lo que Ana le gana a Ciro, Dina se lo gana a Beto.',
      noCoincide: `Revisemos un caso: ${EP.Ana} + ${EP.Beto} = ${EP.Ciro} + ${EP.Dina}. Ana le gana 2 a Ciro, y Dina le gana 2 a Beto.`,
    },
    mira: {
      pieza: OR,
      datos: barrasP({ mira: true }),
      voz: 'Compara las barras; después, la franja.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las dos barras miden lo mismo: las sumas son iguales.' },
        { estado: { corte: 1 }, texto: `Un caso: Ana ${EP.Ana} y Beto ${EP.Beto}; Ciro ${EP.Ciro} y Dina ${EP.Dina}.` },
        { estado: { corte: 2 }, texto: `Ana le gana ${EP.Ana - EP.Ciro} años a Ciro: es la franja.` },
        { estado: { corte: 2 }, texto: 'Abajo, esa misma franja es de Dina: le gana lo mismo a Beto.' },
        { estado: { corte: 2 }, texto: ['Con otras edades pasa igual: ', F('Beto es menor que Dina'), '.'] },
      ],
    },
    regla: {
      texto: 'Si sabes qué valores hay, una suma dice cuáles dos la forman. Con dos sumas iguales, lo que uno le gana a alguien del otro par, su compañero lo pierde.',
      ecuacion: [{ llave: ['Ana + Beto = Ciro + Dina'], nota: 'si Ana supera a Ciro, Dina supera a Beto' }],
      condicion: 'cada persona tiene un solo valor y los valores son distintos, salvo que los datos digan otra cosa.',
      voz: 'Busca primero qué par da la suma.',
      dibujo: { pieza: OR, datos: barrasP(), estado: {} },
    },
    ejemplos: null,   // EJEMPLOS_NUM, abajo
    // Así se resuelve: el reparto completo de cuatro sobres; primero qué par da la suma, después las comparaciones.
    // «Ahora tú» pregunta otra cosa: un monto con tres sobres, lo seguro con dos sumas iguales, una edad con valores
    // seguidos o, en nivel examen, quién tiene una edad.
    resuelve: {
      pieza: OR,
      generar(s) {
        const r = azar(s + 900), vals = r.elegir(CUATRO), gente = r.barajar(NOMBRES_C).slice(0, 4).sort();
        for (let intento = 0; intento < 300; intento++) {
          const rep = r.barajar(vals), [a, b, c, d] = r.barajar([0, 1, 2, 3]);
          const suma = rep[a] + rep[b];
          const pares = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (vals[i] + vals[j] === suma) pares.push([vals[i], vals[j]]);
          if (pares.length !== 1) continue;
          const [m1, m2] = rep[a] > rep[b] ? [a, b] : [b, a], [m3, m4] = rep[c] > rep[d] ? [c, d] : [d, c];
          const ps = [{ t: `${gente[a]} y ${gente[b]} juntos recibieron ${suma} soles.`, ok: x => x[a] + x[b] === suma },
            { t: `${gente[m1]} recibió más que ${gente[m2]}.`, ok: x => x[m1] > x[m2] }, { t: `${gente[m4]} recibió menos que ${gente[m3]}.`, ok: x => x[m4] < x[m3] }];
          const q = permutar(vals).filter(x => ps.every(p => p.ok(x)));
          if (q.length !== 1) continue;
          const resto = vals.filter(v => !pares[0].includes(v));
          const fig = (seg, n) => ({ datos: { escena: 'sobres', sobres: vals.map(soles), columnas: gente, rotuloOrden: 'Reparto', ordenes: n ? [{ a: rep.map((v, k) => (seg.includes(k) ? soles(v) : '?')) }] : undefined, fijos: n ? seg.map(k => ({ c: k })) : undefined }, estado: {} });
          return {
            enunciado: `Cuatro sobres de la rifa, con ${lista(vals.map(String))} soles, uno para cada uno: ${lista(gente)}. ¿Cuánto recibió cada uno?`,
            datos: ['Cada persona recibe un solo sobre.', ...PIS(...ps.map(p => p.t))],
            dibujo: fig([], 0),
            pasos: [
              { tipo: 'pide', texto: 'Piden el sobre de cada uno.' },
              { tipo: 'regla', texto: 'Una suma dice qué par de sobres es: la comparo con las sumas que pueden dar los sobres. Después ordeno cada par con su comparación.' },
              { tipo: 'aplica', texto: `Solo ${pares[0][0]} + ${pares[0][1]} da ${suma}: son los sobres de ${gente[a]} y ${gente[b]}. A ${gente[c]} y ${gente[d]} les quedan ${resto[0]} y ${resto[1]}.`, ecuacion: [`${pares[0][0]} + ${pares[0][1]} = ${suma}`] },
              { tipo: 'aplica', texto: `La pista 2 da el sobre mayor del par a ${gente[m1]}, y la 3, el menor a ${gente[m4]}.`, dibujo: fig([0, 1, 2, 3], 1) },
              { tipo: 'sentido', texto: `Compruebo la suma: ${rep[a]} + ${rep[b]} = ${suma}, y cada uno tiene un sobre distinto.` },
            ],
            respuesta: [F(gente.map((x, k) => `${x} ${rep[k]}`).join(', '))],
          };
        }
        throw new Error('resuelve de los sobres: no se armó un caso');
      },
    },
    ahoraTu: {
      pieza: OR,
      voz: 'Busca primero qué valores dan esa suma.',
      generar(s) { return ahoraNum(s); },
    },
  };
  const TRIOS = [[20, 50, 100], [10, 20, 50], [50, 100, 200], [10, 50, 100], [20, 100, 200], [10, 20, 100]];
  const CUATRO = [[10, 20, 50, 100], [20, 50, 100, 200], [10, 50, 100, 200], [10, 20, 100, 200]];
  const SEGUIDAS = [[13, 14, 15, 16], [14, 15, 16, 17], [15, 16, 17, 18], [12, 13, 14, 15]];
  function ahoraNum(s) {
    const r = azar(s), tipo = s % 4;
    if (tipo === 0) {
      // Tres sobres: una suma y una comparación.
      const trio = r.elegir(TRIOS), gente = r.barajar(NOMBRES_C).slice(0, 3).sort();
      const rep = r.barajar(trio), [a, b, c] = r.barajar([0, 1, 2]);   // a: quien no entra en la suma
      const [mas, menos] = rep[b] > rep[c] ? [b, c] : [c, b], x = r() < 0.5 ? b : c, otro = x === b ? c : b, suma = rep[b] + rep[c];
      const pistas = r.barajar([`${gente[b]} y ${gente[c]} juntos recibieron ${suma} soles.`, `${gente[mas]} recibió más que ${gente[menos]}.`]);
      const fig = (marcar) => ({ datos: { escena: 'sobres', sobres: trio.map(soles), columnas: gente, rotuloOrden: 'Reparto', ordenes: marcar ? [{ a: rep.map(soles) }] : undefined, fijos: marcar ? [{ c: x }] : undefined }, estado: {} });
      return { pregunta: `Tres sobres con ${lista(trio.map(String))} soles, uno para cada uno: ${lista(gente)}. ¿Cuánto recibió ${gente[x]}?`,
        datos: ['Cada persona recibe un solo sobre.', ...PIS(...pistas)], dibujo: fig(false),
        opciones: [
          { id: 'c', texto: `${rep[x]} soles`, correcta: true },
          { id: 'otro', texto: `${rep[otro]} soles`, error: 'RMP64', siFuera: `Sería así con la comparación al revés: ${gente[mas]} recibió más que ${gente[menos]}.` },
          { id: 'fuera', texto: `${rep[a]} soles`, error: 'RMP72', siFuera: `Ese sobre es de ${gente[a]}: con él, ${gente[b]} y ${gente[c]} no sumarían ${suma}.` },
          { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'La suma deja dos repartos y la comparación descarta uno.' },
        ],
        solucion: { texto: `Solo ${Math.min(rep[b], rep[c])} + ${Math.max(rep[b], rep[c])} da ${suma}. ${gente[mas]} recibió más: ${gente[x]} tiene ${rep[x]} soles.`, dibujo: fig(true) } };
    }
    if (tipo === 1) {
      // Dos sumas iguales y una comparación: lo que uno gana, el otro lo pierde.
      const [a, b, c, d] = r.barajar(NOMBRES_C).slice(0, 4), mayor = r() < 0.5;
      const bien = mayor ? `${b} es menor que ${d}` : `${b} es mayor que ${d}`;
      return { pregunta: `Las edades de ${a} y ${b} suman lo mismo que las de ${c} y ${d}. ¿Qué se puede asegurar?`,
        datos: ['Las cuatro edades son distintas.', `Pista: ${a} es ${mayor ? 'mayor' : 'menor'} que ${c}.`],
        dibujo: { datos: { barras: [{ rotulo: `Edades de ${a} y ${b}, juntas`, partes: [{ t: `${a} + ${b}`, v: 31, texto: '?' }] }, { rotulo: `Edades de ${c} y ${d}, juntas`, partes: [{ t: `${c} + ${d}`, v: 31, texto: '?' }] }] }, estado: {} },
        opciones: [
          { id: 'c', texto: bien, correcta: true },
          { id: 'mismo', texto: mayor ? `${b} es mayor que ${d}` : `${b} es menor que ${d}`, error: 'RMP143', siFuera: `Así, una suma ${mayor ? 'pasaría' : 'quedaría debajo de'} la otra, y son iguales.` },
          { id: 'igual', texto: `${b} y ${d} tienen la misma edad`, error: 'RMP72', siFuera: `Con ${b} y ${d} iguales, ${a} y ${c} también lo serían.` },
          { id: 'nada', texto: 'Nada: faltan las edades', error: 'RMP78', siFuera: `No hacen falta: lo que ${a} le ${mayor ? 'gana' : 'pierde'} a ${c}, ${b} lo ${mayor ? 'pierde' : 'gana'} con ${d}.` },
        ],
        solucion: { texto: `Las dos sumas son iguales y ${a} es ${mayor ? 'mayor' : 'menor'} que ${c}: para compensar, ${bien}.`,
          dibujo: { datos: { barras: [{ rotulo: `Un caso: ${a} y ${b}`, partes: [{ t: a, v: mayor ? 17 : 15, texto: String(mayor ? 17 : 15) }, { t: b, v: mayor ? 14 : 16, texto: String(mayor ? 14 : 16), seguro: true }] },
            { rotulo: `${c} y ${d}`, partes: [{ t: c, v: mayor ? 15 : 17, texto: String(mayor ? 15 : 17) }, { t: d, v: mayor ? 16 : 14, texto: String(mayor ? 16 : 14), seguro: true }] }], banda: { de: 15, a: 17 } }, estado: {} } } };
    }
    if (tipo === 2) {
      // Edades seguidas: una suma y una comparación; ¿cuántos años tiene alguien?
      for (let intento = 0; intento < 300; intento++) {
        const vals = r.elegir(SEGUIDAS), gente = r.barajar(NOMBRES_C).slice(0, 4).sort(), rep = r.barajar(vals);
        const [a, b, c, d] = r.barajar([0, 1, 2, 3]), suma = rep[a] + rep[b];
        const [m3, m4] = rep[c] > rep[d] ? [c, d] : [d, c];
        const ps = [{ t: `Las edades de ${gente[a]} y ${gente[b]} suman ${suma} años.`, ok: x => x[a] + x[b] === suma }, { t: `${gente[m3]} es mayor que ${gente[m4]}.`, ok: x => x[m3] > x[m4] }];
        const q = permutar(vals).filter(x => ps.every(p => p.ok(x)));
        const x = r.elegir([c, d]);
        if (!(q.length >= 1 && q.every(y => y[x] === rep[x]))) continue;
        const otro = x === c ? d : c;
        // Sin la comparación puede salir la otra edad del par; con la suma leída para el otro par, otra.
        const ops = [{ id: 'c', texto: `${rep[x]} años`, correcta: true }, { id: 'reves', texto: `${rep[otro]} años`, error: 'RMP64', siFuera: `Esa es la edad de ${gente[otro]}: sería de ${gente[x]} con la pista 2 al revés.` }];
        for (const k of [a, b]) if (!ops.some(o => o.texto === `${rep[k]} años`)) ops.push({ id: `s${k}`, texto: `${rep[k]} años`, error: 'RMP72', siFuera: `${rep[k]} es de ${gente[a]} o de ${gente[b]}: es parte de la suma ${suma}, que no incluye a ${gente[x]}.` });
        if (ops.length < 4) continue;
        return { pregunta: `${lista(gente)} tienen ${lista(vals.map(String))} años, no se sabe quién cuántos. ¿Cuántos años tiene ${gente[x]}?`,
          datos: ['Cada uno tiene una de esas edades, y no se repiten.', ...PIS(...ps.map(p => p.t))],
          dibujo: { datos: { escena: 'sobres', forma: 'tarjeta', sobres: vals.map(v => `${v} años`), columnas: gente, rotuloOrden: 'Reparto' }, estado: {} },
          opciones: ops.slice(0, 4).concat({ id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'La suma fija qué par es; la comparación ordena el otro.' }),
          solucion: { texto: `Solo ${Math.min(rep[a], rep[b])} + ${Math.max(rep[a], rep[b])} dan ${suma}. De las otras dos edades, a ${gente[x]} le toca ${rep[x]}.`,
            dibujo: { datos: { escena: 'sobres', forma: 'tarjeta', sobres: vals.map(v => `${v} años`), columnas: gente, rotuloOrden: 'Reparto', ordenes: q.map(y => ({ a: y.map(v => `${v}`) })), fijos: [{ c: x }] }, estado: {} } } };
      }
    }
    // Nivel examen: cuatro sobres, dos pistas de suma y una comparación; ¿quién recibió un monto?
    for (let intento = 0; intento < 400; intento++) {
      const vals = r.elegir(CUATRO), gente = r.barajar(NOMBRES_C).slice(0, 4).sort(), rep = r.barajar(vals);
      const [a, b, c, d] = r.barajar([0, 1, 2, 3]), s1 = rep[a] + rep[b], s2 = rep[a] + rep[c];
      const ps = [{ t: `${gente[a]} y ${gente[b]} juntos recibieron ${s1} soles.`, ok: x => x[a] + x[b] === s1 },
        { t: `${gente[a]} y ${gente[c]} juntos recibieron ${s2} soles.`, ok: x => x[a] + x[c] === s2 }];
      const q = permutar(vals).filter(x => ps.every(p => p.ok(x)));
      if (q.length !== 1) continue;
      if (permutar(vals).filter(x => ps[0].ok(x)).length < 2 || permutar(vals).filter(x => ps[1].ok(x)).length < 2) continue;
      const v = r.elegir(vals), k = rep.indexOf(v);
      const ops = gente.map((y, i) => (i === k ? { id: 'c', texto: y, correcta: true }
        : Object.assign({ id: `g${i}`, texto: y }, (() => {
          const sin = j => permutar(vals).filter(x => ps.filter((_, z) => z !== j).every(p => p.ok(x)));
          for (let j = 0; j < ps.length; j++) if (sin(j).some(x => x[i] === v)) return { error: 'RMP72', siFuera: `Valdría sin la pista ${j + 1}. Con las dos, ${y} recibió ${rep[i]} soles.` };
          return { error: 'RMP63', siFuera: `Tendrías que saltarte las dos pistas: ${y} recibió ${rep[i]} soles.` };
        })())));
      ops.push({ id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'Cada suma deja pocos pares; juntas dejan un solo reparto.' });
      return { pregunta: `Cuatro sobres de la rifa, con ${lista(vals.map(String))} soles, uno para cada uno: ${lista(gente)}. ¿Quién recibió ${v} soles?`,
        datos: ['Cada persona recibe un solo sobre.', ...PIS(...ps.map(p => p.t))],
        dibujo: { datos: { escena: 'sobres', sobres: vals.map(soles), columnas: gente }, estado: {} }, opciones: ops,
        solucion: { texto: `${gente[a]} está en las dos sumas, con ${rep[a]}. Queda un reparto: ${gente.map((y, i) => `${y} ${rep[i]}`).join(', ')}.`,
          dibujo: { datos: { escena: 'sobres', sobres: vals.map(soles), columnas: gente, rotuloOrden: 'Reparto', ordenes: [{ a: rep.map(soles) }], fijos: [{ c: k }] }, estado: {} } } };
    }
    throw new Error('ahoraNum: no se armó un caso');
  }

  // ---------- Ejemplos resueltos de «Ordenar con sumas y diferencias» ----------
  // Recalculados aparte por fuerza bruta (scratchpad e5-rm/f3/v4.py, 20 comprobaciones; las de dos sumas iguales, sobre
  // todas las edades de 10 a 25): 1 Ana 100 · 2 Beto 20 o 100 · 3 Nora 2 · 4 Maru 16 · 5 Gino 14 · 6 Dina 20 · 7 Iván 17 ·
  // 8 Vilma · 9 Gino 5 · 10 Ciro 17 · 11 «Ana es la mayor» siempre (Dina mayor que Ciro, a veces; las otras, nunca) ·
  // 12 Leo 17 · 13 Teo y Vilma, 110 (quedan 2 repartos) · 14 Pía 13 · 15 Ana. La figura: los sobres (o las edades) a la
  // vista, sin ningún reparto.
  const SB = (vals, gente, fmt = soles, forma) => ({ pieza: OR, datos: Object.assign({ escena: 'sobres', sobres: vals.map(fmt), columnas: gente }, forma ? { forma } : {}), estado: {} });
  const anios = v => `${v} años`;
  const D_SOBRE = 'Cada persona recibe un solo sobre.';
  const D_EDAD1 = 'Cada uno tiene una de esas edades, y no se repiten.';
  const EJEMPLOS_NUM = [
    { nivel: 1, titulo: 'La suma que delata', figura: SB(SOBRES, TRES),
      enunciado: 'Tres sobres de la rifa, con 20, 50 y 100 soles, uno para cada uno: Ana, Beto y Ciro. ¿Cuánto recibió Ana?',
      datos: [D_SOBRE, 'Pista: Beto y Ciro juntos recibieron 70 soles.'],
      solucion: [{ texto: ['Las sumas de dos sobres: 20 + 50 = 70, 20 + 100 = 120 y 50 + 100 = 150. Solo 20 + 50 da 70: a Ana le queda el de ', F('100'), '.'] }],
      respuesta: [F('Ana recibió 100 soles')] },
    { nivel: 1, titulo: 'Dos repartos posibles', figura: SB(SOBRES, TRES),
      enunciado: 'Los mismos tres sobres de 20, 50 y 100 soles, para Ana, Beto y Ciro. ¿Qué se sabe de lo que recibió Beto?',
      datos: [D_SOBRE, 'Pista: Beto y Ciro juntos recibieron 120 soles.'],
      solucion: [
        { texto: 'Solo 20 + 100 da 120: Beto y Ciro tienen esos dos sobres, y Ana, el de 50.' },
        { texto: ['Cuál es de Beto y cuál de Ciro, la pista no lo dice: Beto recibió ', F('20 o 100'), '.'] },
      ],
      respuesta: [F('20 o 100 soles'), ': falta otra pista'] },
    { nivel: 1, titulo: 'Tres dados', figura: SB([2, 4, 6], ['Rosa', 'Iván', 'Nora'], String, 'dado'),
      enunciado: 'Rosa, Iván y Nora lanzan un dado cada uno y salen 2, 4 y 6, uno por persona. ¿Cuánto sacó Nora?',
      datos: ['Cada uno sacó uno de esos puntajes, sin repetir.', 'Pista: Rosa e Iván suman 10 puntos.'],
      solucion: [{ texto: ['2 + 4 = 6, 2 + 6 = 8 y 4 + 6 = 10. Rosa e Iván tienen el 4 y el 6: Nora sacó ', F('2'), '.'] }],
      respuesta: [F('Nora sacó 2')] },
    { nivel: 1, titulo: 'Edades en cadena', figura: SB([15, 16, 17], ['Leo', 'Maru', 'Teo'], anios, 'tarjeta'),
      enunciado: 'Leo, Maru y Teo tienen 15, 16 y 17 años, no se sabe quién cuántos. ¿Cuántos años tiene Maru?',
      datos: [D_EDAD1, ...PIS('Leo es mayor que Maru.', 'Maru es mayor que Teo.')],
      solucion: [{ texto: ['Cadena: Teo, Maru, Leo, del menor al mayor. Con 15, 16 y 17 en ese orden, Maru tiene ', F('16'), '.'] }],
      respuesta: [F('16 años')] },
    { nivel: 1, titulo: 'Le lleva tres años', figura: SB([14, 17], ['Sara', 'Gino'], anios, 'tarjeta'),
      enunciado: 'Sara y Gino tienen 14 y 17 años, no se sabe quién cuántos. ¿Cuántos años tiene Gino?',
      datos: [D_EDAD1, 'Pista: Sara le lleva 3 años a Gino.', 'Le lleva 3 años: es 3 años mayor.'],
      solucion: [{ texto: ['Sara es la mayor de los dos: 17. Gino tiene ', F('14'), ', y 17 − 14 = 3 cumple la pista.'] }],
      respuesta: [F('Gino tiene 14 años')] },
    { nivel: 2, titulo: 'Suma y comparación', figura: SB([10, 20, 50, 100], ['Ana', 'Beto', 'Ciro', 'Dina']),
      enunciado: 'Cuatro sobres de la rifa, con 10, 20, 50 y 100 soles, para Ana, Beto, Ciro y Dina. ¿Cuánto recibió Dina?',
      datos: [D_SOBRE, ...PIS('Ana y Beto juntos recibieron 60 soles.', 'Ciro recibió más que Dina.')],
      solucion: [
        { texto: 'De las sumas de dos sobres, solo 10 + 50 da 60: son de Ana y Beto. A Ciro y Dina les quedan 20 y 100.' },
        { texto: ['Ciro recibió más: Ciro 100 y Dina ', F('20'), '.'] },
      ],
      respuesta: [F('Dina recibió 20 soles')] },
    { nivel: 2, titulo: 'Dos pares que empatan', figura: SB([14, 15, 16, 17], ['Rosa', 'Iván', 'Nora', 'Leo'], anios, 'tarjeta'),
      enunciado: 'Rosa, Iván, Nora y Leo tienen 14, 15, 16 y 17 años. ¿Cuántos años tiene Iván?',
      datos: [D_EDAD1, ...PIS('Las edades de Rosa e Iván suman lo mismo que las de Nora y Leo.', 'Rosa es la menor.')],
      solucion: [
        { texto: 'Los cuatro suman 62: cada par suma 31. Las dos maneras de hacer 31 son 14 + 17 y 15 + 16.', ecuacion: ['14 + 15 + 16 + 17 = 62'] },
        { texto: ['Rosa, la menor, tiene 14: su pareja de suma, Iván, tiene ', F('17'), '. Nora y Leo, 15 y 16.'] },
      ],
      respuesta: [F('Iván tiene 17 años')] },
    { nivel: 2, titulo: 'Lo que gana uno', figura: { pieza: OR, datos: { barras: [{ rotulo: 'Edades de Maru y Teo, juntas', partes: [{ t: 'Maru + Teo', v: 31, texto: '?' }] }, { rotulo: 'Edades de Lucho y Vilma, juntas', partes: [{ t: 'Lucho + Vilma', v: 31, texto: '?' }] }] }, estado: {} },
      enunciado: 'Las edades de Maru y Teo suman lo mismo que las de Lucho y Vilma. ¿Quién es mayor: Teo o Vilma?',
      datos: ['Las cuatro edades son distintas.', 'Pista: Maru es mayor que Lucho.'],
      solucion: [
        { texto: 'Las dos sumas son dos barras del mismo largo: una de Maru y Teo, otra de Lucho y Vilma. Maru es mayor que Lucho: su trozo es más largo.' },
        { texto: ['Para que las barras sigan iguales, el trozo de Teo tiene que ser más corto que el de Vilma: ', F('Vilma'), ' es mayor que Teo.'] },
      ],
      respuesta: [F('Vilma')] },
    { nivel: 2, titulo: 'Los dados de la kermés', figura: SB([3, 5, 6], ['Sara', 'Gino', 'Pía'], String, 'dado'),
      enunciado: 'En la kermés, Sara, Gino y Pía lanzan un dado cada uno y salen 3, 5 y 6. ¿Cuánto sacó Gino?',
      datos: ['Cada uno sacó uno de esos puntajes, sin repetir.', ...PIS('Sara y Gino suman 11 puntos.', 'Sara sacó más que Gino.')],
      solucion: [
        { texto: '3 + 5 = 8, 3 + 6 = 9 y 5 + 6 = 11: Sara y Gino tienen el 5 y el 6, y Pía, el 3.' },
        { texto: ['Sara sacó más: Sara 6 y Gino ', F('5'), '.'] },
      ],
      respuesta: [F('Gino sacó 5')] },
    { nivel: 2, titulo: 'Cuatro edades seguidas', figura: SB([14, 15, 16, 17], ['Ana', 'Beto', 'Ciro', 'Dina'], anios, 'tarjeta'),
      enunciado: 'Ana, Beto, Ciro y Dina tienen 14, 15, 16 y 17 años. ¿Cuántos años tiene Ciro?',
      datos: [D_EDAD1, ...PIS('Las edades de Ana y Beto suman 29.', 'Ciro es mayor que Dina.', 'Beto es mayor que Ana.')],
      solucion: [
        { texto: 'Con estas edades, solo 14 + 15 da 29: Ana y Beto son los menores, y por la pista 3, Ana 14 y Beto 15.' },
        { texto: ['A Ciro y Dina les quedan 16 y 17. Ciro es el mayor de los dos: ', F('17'), '.'] },
      ],
      respuesta: [F('Ciro tiene 17 años')] },
    { nivel: 3, titulo: 'Dos parejas que suman igual', figura: { pieza: OR, datos: { barras: [{ rotulo: 'Edades de Ana y Beto, juntas', partes: [{ t: 'Ana + Beto', v: 31, texto: '?' }] }, { rotulo: 'Edades de Ciro y Dina, juntas', partes: [{ t: 'Ciro + Dina', v: 31, texto: '?' }] }] }, estado: {} },
      enunciado: 'Las edades de Ana y Beto suman lo mismo que las de Ciro y Dina. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Ana es la mayor de los cuatro', 'Dina es mayor que Ciro', 'Dina es menor que Beto', 'Dina es mayor que Ana', 'Beto es mayor que Ciro'],
      datos: ['Las cuatro edades son distintas.', 'Pista: Ana es mayor que Ciro, y Ciro es mayor que Beto.'],
      solucion: [
        { texto: 'Ana le gana a Ciro: en las barras iguales, Dina le gana lo mismo a Beto. Dina es mayor que Beto.' },
        { texto: 'Y Ciro le gana a Beto: del mismo modo, Ana le gana a Dina. Ana supera a Ciro, a Beto y a Dina.' },
        { texto: ['Seguro: ', F('Ana es la mayor'), '. «Dina es mayor que Ciro» depende de las edades: posible.'] },
        { texto: 'C lleva la comparación en el mismo sentido al otro par. D va contra el paso 2, y E, contra la pista.' },
      ],
      respuesta: [F('A'), ': Ana es la mayor de los cuatro'] },
    { nivel: 3, titulo: 'Edades consecutivas', figura: SB([15, 16, 17, 18], ['Rosa', 'Iván', 'Nora', 'Leo'], anios, 'tarjeta'),
      enunciado: 'Rosa, Iván, Nora y Leo tienen edades consecutivas: 15, 16, 17 y 18 años. ¿Cuántos años tiene Leo?',
      alternativas: ['14', '15', '16', '17', '18'],
      datos: [D_EDAD1, ...PIS('Rosa es la mayor.', 'Las edades de Iván y Nora suman 31.')],
      solucion: [
        { texto: 'Rosa, la mayor, tiene 18. Para los otros tres quedan 15, 16 y 17.' },
        { texto: ['Solo 15 + 16 da 31: son de Iván y Nora. A Leo le queda ', F('17'), '.'] },
        { texto: '15 y 16 son de Iván y Nora, 18 es de Rosa y 14 no es ninguna de las edades.' },
      ],
      respuesta: [F('D'), ': 17 años'] },
    { nivel: 3, titulo: 'Cuatro sobres', figura: SB([10, 20, 50, 100], ['Lucho', 'Maru', 'Teo', 'Vilma']),
      enunciado: 'Cuatro sobres, con 10, 20, 50 y 100 soles, para Lucho, Maru, Teo y Vilma. ¿Cuánto recibieron Teo y Vilma juntos?',
      alternativas: ['S/ 30', 'S/ 60', 'S/ 70', 'S/ 90', 'S/ 110'],
      datos: [D_SOBRE, ...PIS('Lucho y Maru juntos recibieron 70 soles.', 'Teo recibió más que Lucho.', 'Vilma recibió menos que Maru.')],
      solucion: [
        { texto: 'Solo 20 + 50 da 70: son de Lucho y Maru, en algún orden. A Teo y Vilma les quedan 10 y 100.' },
        { texto: 'Teo recibió más que Lucho, que tiene 20 o 50: Teo no puede tener 10. Teo 100 y Vilma 10.' },
        { texto: ['Quedan 2 repartos, pero en los dos Teo y Vilma juntan ', F('110'), '.'], ecuacion: ['100 + 10 = ', F('110')] },
        { texto: '70 es lo de Lucho y Maru; 30 y 60 sumarían el sobre de 10 con el de 20 o el de 50; 90 resta en vez de sumar.' },
      ],
      respuesta: [F('E'), ': S/ 110'] },
    { nivel: 3, titulo: 'Par e impar', figura: SB([13, 14, 15], ['Omar', 'Pía', 'Gino'], anios, 'tarjeta'),
      enunciado: 'Omar, Pía y Gino tienen 13, 14 y 15 años, no se sabe quién cuántos. ¿Cuántos años tiene Pía?',
      alternativas: ['13', '14', '15', '16', 'No se puede saber'],
      datos: [D_EDAD1, 'Par: se divide entre 2 sin que sobre nada.', ...PIS('La edad de Omar es un número par.', 'Gino es mayor que Pía.')],
      solucion: [
        { texto: 'De 13, 14 y 15, el único par es 14: Omar tiene 14. A Pía y Gino les quedan 13 y 15.' },
        { texto: ['Gino es mayor: Gino 15 y Pía ', F('13'), '.'] },
        { texto: '14 es de Omar y 15, de Gino; 16 no es ninguna de las edades. «No se puede saber» no vale: queda un solo reparto.' },
      ],
      respuesta: [F('A'), ': 13 años'] },
    { nivel: 3, titulo: '¿Quién es el mayor?', figura: SB([14, 16, 19], TRES, anios, 'tarjeta'),
      enunciado: 'Ana, Beto y Ciro tienen 14, 16 y 19 años, no se sabe en qué orden. ¿Quién es el mayor?',
      alternativas: ['Ciro', 'Ana', 'Beto', 'Ana y Ciro tienen la misma edad', 'No se puede saber'],
      datos: [D_EDAD1, ...PIS('Las edades de Ana y Beto suman 33.', 'Beto es menor que Ciro.')],
      solucion: [
        { texto: '14 + 16 = 30, 14 + 19 = 33 y 16 + 19 = 35. Ana y Beto tienen 14 y 19; Ciro, 16.' },
        { texto: ['Beto es menor que Ciro, que tiene 16: Beto 14 y Ana 19. El mayor es ', F('Ana'), '.'] },
        { texto: 'Ciro tiene 16 y Beto 14: ninguno es el mayor. «Ana y Ciro tienen la misma edad» no: 19 y 16. «No se puede saber» tampoco.' },
      ],
      respuesta: [F('B'), ': Ana'] },
  ];
  ideaNumeros.ejemplos = EJEMPLOS_NUM;

  // ---------- Idea 5: la mesa redonda ----------
  // Objeto: el almuerzo en la mesa redonda, visto desde arriba, con un plato de chairo y una cuchara a la derecha de cada
  // uno (escena «mesa», dibujo de prueba). Ana abajo, de espaldas al alumno, como en la banca. Cambia: la silla de Beto ·
  // Permanece: Ana abajo y las cucharas · Progresa: dónde queda Beto respecto de la cuchara de Ana · Se reserva: la
  // derecha de quien está arriba, de cara al alumno (la predicción) · Debe verse: la derecha de quien mira al centro va
  // contra el reloj, y no es siempre la derecha del dibujo.
  // Sillas: la 0 abajo, y siguen contra el reloj (hacia la derecha de quien mira al centro). Papeles: la referencia en
  // naranja (desde quién se mide), la flecha de «a la derecha» en turquesa (hacia dónde), lo seguro en violeta.
  const PM = {
    der: (a, b) => ({ tipo: 'der', a, b, t: `${a} se sienta a la derecha de ${b}.`, ok: o => o.indexOf(a) === (o.indexOf(b) + 1) % o.length }),
    izq: (a, b) => ({ tipo: 'izq', a, b, t: `${a} se sienta a la izquierda de ${b}.`, ok: o => o.indexOf(a) === (o.indexOf(b) + o.length - 1) % o.length }),
    junto: (a, b) => ({ tipo: 'junto', a, b, t: `${a} se sienta junto a ${b}.`, ok: o => juntoM(o, a, b) }),
    noJunto: (a, b) => ({ tipo: 'noJunto', a, b, t: `${a} no se sienta junto a ${b}.`, ok: o => !juntoM(o, a, b) }),
    entre: (a, b, c) => ({ tipo: 'entre', a, b, c, t: `${a} se sienta entre ${b} y ${c}.`, ok: o => juntoM(o, a, b) && juntoM(o, a, c) }),
  };
  const juntoM = (o, a, b) => { const n = o.length, d = (o.indexOf(a) - o.indexOf(b) + n) % n; return d === 1 || d === n - 1; };
  const derDe = (o, x) => o[(o.indexOf(x) + 1) % o.length], izqDe = (o, x) => o[(o.indexOf(x) + o.length - 1) % o.length];
  // Todas las mesas con la referencia en la silla 0 (girar a todos da la misma mesa).
  const mesasDe = (gente, n, ref) => arreglos(gente.filter(x => x !== ref), n - 1).map(o => [ref].concat(o));
  const D_MESA = n => `Mesa redonda de ${n} sillas, sin numerar; todos miran al centro.`;
  const D_DER = 'A la derecha de: en la silla de al lado, del lado de su mano derecha.';
  const sentar = (o, extra = {}) => o.map((t, s) => (t ? Object.assign({ s, t }, extra[t] || {}) : null)).filter(Boolean);
  const figMesa = (n, sentados, extra) => ({ pieza: OR, datos: Object.assign({ escena: 'mesa', forma: 'redonda', sillas: n, sentados }, extra || {}), estado: {} });
  // El juego: Ana abajo (silla 0); Beto se sienta en la silla b, de 1 a 4. A la derecha de Ana está la silla 1.
  const N5 = 5;
  function mesaJ(b, o = {}) {
    const bien = b === 1;
    return { escena: 'mesa', forma: 'redonda', sillas: N5, cucharas: true,
      sentados: [{ s: 0, t: 'Ana', ref: true }].concat(o.soloAna ? [] : [{ s: b, t: 'Beto', seguro: bien }]),
      flechas: bien && !o.soloAna ? [{ s: 0, sentido: 'derecha' }] : [] };
  }
  const lecturaJ5 = b => (b === 1 ? ['Beto está a la derecha de Ana: ', F('del lado de su cuchara')]
    : b === N5 - 1 ? ['Beto quedó a la izquierda de Ana: lejos de su cuchara']
      : ['Beto no está junto a Ana: queda una silla en medio']);
  const sillaCerca = (d, pt, excluir) => { const g = Kit.piezas[OR].geometria(d); let mejor = -1, dm = Infinity; for (let s = 0; s < g.N; s++) { if (s === excluir) continue; const p = g.silla(s), dd = Math.hypot(p.x - pt.x, p.y - pt.y); if (dd < dm) { dm = dd; mejor = s; } } return mejor; };
  // La predicción: Dina arriba (silla 3 de 6), de cara al alumno. Eva a su derecha: la silla 4, a la izquierda del dibujo.
  const N6 = 6, S_ARRIBA = 3;
  const mesaP = (o = {}) => ({ escena: 'mesa', forma: 'redonda', sillas: N6, cucharas: !o.planteo,
    sentados: [{ s: S_ARRIBA, t: 'Dina', ref: !o.mira }].concat(o.planteo ? [] : [{ s: S_ARRIBA + 1, t: 'Eva', seguro: true, desde: o.mira ? 3 : 0 }]).concat(o.mira ? [{ s: 0, t: 'Ana', desde: 1 }] : []),
    flechas: o.planteo ? [] : o.mira ? [{ s: 0, desde: 1 }, { s: S_ARRIBA, desde: 2 }] : [{ s: S_ARRIBA }],
    espera: o.planteo ? ['Eva'] : undefined, pistas: o.planteo ? [{ t: 'Eva se sienta a la derecha de Dina.' }] : undefined, lineas: o.planteo ? 1 : 0 });
  const circular = {
    id: 'orden-circular',
    titulo: 'La mesa redonda',
    pregunta: '¿Hacia dónde queda la derecha de quien mira al centro?',
    temas: ['Ordenamiento circular'],
    pieza: OR,
    aprendizaje: 'Mirando al centro, la derecha de cada uno va contra el reloj; girar a todos no cambia el orden, por eso se fija a uno.',
    actividad: 'Sentar a Beto en una silla y mirar la cuchara de Ana.',
    lee: {
      tarjetas: [
        { titulo: 'El almuerzo', texto: 'En un almuerzo familiar en Puno, cinco personas se sientan alrededor de una mesa redonda, cada una con su plato de chairo. La ves desde arriba: Ana está abajo, de espaldas a ti.',
          pieza: OR, dibujo: { datos: mesaJ(1, { soloAna: true }), estado: {} } },
        { titulo: 'Mirar al centro', texto: 'Todos miran hacia el centro de la mesa. Cada uno tiene la cuchara junto a su mano derecha: así se ve de qué lado le queda la derecha a cada uno.' },
        { titulo: 'Sin primera silla', texto: 'Una ronda no tiene extremos ni primer lugar. Ubicar gente alrededor de una mesa redonda es un ordenamiento circular.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a sentar a Beto en una silla libre. Mira la cuchara de Ana: dice de qué lado está su derecha.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: 'Ana está abajo, de espaldas a ti, mirando al centro de la mesa. Las otras sillas están libres.',
      mision: {
        texto: 'Sienta a Beto a la derecha de Ana.',
        logrado: v => v.b === 1,
        bien: ['Beto quedó del lado de la cuchara de Ana: su derecha, contra el reloj.'],
      },
      voz: 'La cuchara de cada uno está junto a su mano derecha.',
      leyenda: [
        { s: 'cuchara', t: 'junto a la mano derecha de cada uno' },
        { s: { v: 'c-o', t: 'naranja' }, t: 'Ana: desde ella se mide' },
        { s: { v: 'c-i', t: 'flecha turquesa' }, t: 'al acertar: su derecha, contra el reloj' },
        { s: F('violeta'), t: 'la silla pedida, ya comprobada' },
      ],
      controles: [{ id: 'b', etiqueta: 'Silla de Beto', min: 1, max: N5 - 1, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: v => ({ datos: mesaJ(v.b), estado: {} }),
      lectura: v => lecturaJ5(v.b),
      minimo: 3,
      arrastres: [{ id: 'beto', etiqueta: 'silla de Beto',
        donde: v => { const g = Kit.piezas[OR].geometria(mesaJ(v.b)), p = g.silla(v.b); return { x: p.x, y: p.y }; },
        mover: (pt, v) => { const s = sillaCerca(mesaJ(v.b), pt, 0); return s === v.b ? {} : { b: s }; } }],
    },
    predice: {
      pregunta: 'Otra mesa, de seis. Dina se sienta arriba, de cara a ti, y mira al centro. Eva se sienta a la derecha de Dina. En el dibujo, ¿de qué lado de Dina queda Eva?',
      datos: ['Todos miran al centro de la mesa.', D_DER],
      voz: 'Ponte en el lugar de Dina, mirando al centro.',
      opciones: [
        { id: 'c', texto: 'A la izquierda del dibujo', correcta: true },
        { id: 'dibujo', texto: 'A la derecha del dibujo', error: 'RMP140', siFuera: 'Esa es tu derecha. Dina te mira de frente: su derecha queda del otro lado.' },
        { id: 'depende', texto: 'Depende de cómo se gire la mesa', error: 'RMP78', siFuera: 'Girar la mesa mueve a todos juntos: Eva sigue del lado de la mano derecha de Dina.' },
      ],
      dibujo: { datos: mesaP({ planteo: true }), estado: {} },
      revelar: { datos: mesaP(), estado: {} },
      coincide: 'Coincide: Dina te mira de frente; su derecha es tu izquierda.',
      noCoincide: 'Revisemos: mira la cuchara de Dina. Ella te mira de frente, así que su derecha queda a la izquierda del dibujo.',
    },
    mira: {
      pieza: OR,
      datos: mesaP({ mira: true }),
      voz: 'Sigue la flecha de cada uno: contra el reloj.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Ana mira al centro desde abajo: su derecha es la tuya.' },
        { estado: { corte: 2 }, texto: 'Dina mira al centro desde arriba, de cara a ti.' },
        { estado: { corte: 2 }, texto: 'Su cuchara queda a tu izquierda: su derecha es tu izquierda.' },
        { estado: { corte: 2 }, texto: 'Las dos flechas giran igual: contra el reloj.' },
        { estado: { corte: 3 }, texto: ['Eva, a la derecha de Dina, queda a la ', F('izquierda del dibujo'), '.'] },
      ],
    },
    regla: {
      texto: 'Mirando al centro, la derecha de cada uno es la silla siguiente contra el reloj, y la izquierda, la siguiente con el reloj. Un giro no cambia el orden.',
      ecuacion: [{ llave: ['a la derecha'], nota: 'contra el reloj' }, '   ·   ', { llave: ['a la izquierda'], nota: 'con el reloj' }],
      condicion: 'todos miran al centro y las sillas no tienen número; por eso se fija a una persona de referencia.',
      voz: 'Fija a una persona y sigue contra el reloj.',
      dibujo: { pieza: OR, datos: Object.assign(mesaP({ mira: true }), { sentados: [{ s: 0, t: 'Ana' }, { s: S_ARRIBA, t: 'Dina' }] }), estado: { corte: 2 } },
    },
    ejemplos: null,   // EJEMPLOS_CIRC, abajo
    // Así se resuelve: la mesa completa, con la referencia abajo; se sienta a cada uno desde quien ya tiene silla,
    // siguiendo las pistas de derecha e izquierda, y se prueba lo que queda. «Ahora tú» pregunta otra cosa.
    resuelve: {
      pieza: OR,
      generar(s) {
        const c = casoMesa(azar(s + 900), { n: 5 + (s % 2), quedan: 1, cadena: true });
        const o = c.sol, ref = o[0];
        const pasos = [
          { tipo: 'pide', texto: 'Piden cómo se sientan todos alrededor de la mesa.' },
          { tipo: 'regla', texto: `Fijo a ${ref} en la silla de abajo: girar la mesa no cambia nada. Su derecha es la silla que sigue contra el reloj.` },
        ];
        // Se sienta primero a quien una pista de derecha o izquierda ata a alguien ya sentado.
        const sent = new Set([ref]), dichos = [];
        let cambio = true;
        while (cambio) {
          cambio = false;
          for (const p of c.ps) {
            if (!['der', 'izq'].includes(p.tipo)) continue;
            const [nuevo, base] = sent.has(p.b) && !sent.has(p.a) ? [p.a, p.b] : sent.has(p.a) && !sent.has(p.b) ? [p.b, p.a] : [null];
            if (!nuevo) continue;
            sent.add(nuevo); cambio = true;
            dichos.push(`${nuevo} va a la ${(p.tipo === 'der') === (nuevo === p.a) ? 'derecha' : 'izquierda'} de ${base}`);
          }
        }
        const fig1 = figMesa(c.n, sentar(o.map(x => (sent.has(x) ? x : null)), { [ref]: { ref: true } }));
        pasos.push({ tipo: 'aplica', texto: dichos.length ? `Con las pistas de derecha e izquierda: ${lista(dichos)}.` : `${ref} queda abajo; las pistas no dicen todavía de qué lado va nadie.`, dibujo: fig1 });
        const resto = o.filter(x => x && !sent.has(x));
        pasos.push({ tipo: 'aplica', texto: resto.length ? `Para ${lista(resto)} quedan ${resto.length === 1 ? 'una silla' : `${resto.length} sillas`}; ${resto.length === 1 ? 'es la suya' : 'pruebo cada manera y solo una cumple las otras pistas'}.` : 'Ya no queda nadie de pie.',
          dibujo: figMesa(c.n, sentar(o, { [ref]: { ref: true } })) });
        pasos.push({ tipo: 'sentido', texto: `Compruebo cada pista dando la vuelta contra el reloj desde ${ref}: ${o.filter(Boolean).join(', ')}.` });
        return { enunciado: `${lista(c.gente)} almuerzan en una mesa redonda de ${c.n} sillas. ¿Cómo se sientan, desde ${ref} y contra el reloj?`, datos: c.datos,
          dibujo: figMesa(c.n, [{ s: 0, t: ref, ref: true }]), pasos, respuesta: [F(o.filter(Boolean).join(', '))] };
      },
    },
    ahoraTu: {
      pieza: OR,
      voz: 'Sienta primero a quien tenga una pista de derecha o izquierda.',
      generar(s) { return ahoraMesa(s); },
    },
  };
  // Un caso de mesa redonda: n sillas, todos sentados; la primera persona (en orden alfabético) es la referencia. o.cadena:
  // al menos una pista de derecha o izquierda que toca a la referencia (para «Así se resuelve»).
  const NOMBRES_M = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gino'];
  function casoMesa(r, o) {
    for (let intento = 0; intento < 400; intento++) {
      const gente = r.barajar(NOMBRES_M).slice(0, o.n).sort(), ref = gente[0], todos = mesasDe(gente, o.n, ref), sol = r.elegir(todos);
      const pozo = [];
      for (const a of gente) for (const b of gente) if (a !== b) {
        if (derDe(sol, b) === a) pozo.push(PM.der(a, b), PM.izq(b, a));
        if (a < b) pozo.push(juntoM(sol, a, b) ? PM.junto(a, b) : PM.noJunto(a, b));
        for (const c of gente) if (b < c && c !== a && juntoM(sol, a, b) && juntoM(sol, a, c)) pozo.push(PM.entre(a, b, c));
      }
      let ps = [];
      for (const p of r.barajar(pozo)) {
        if (cumplenEn(todos, ps).length <= o.quedan) break;
        if (cumplenEn(todos, ps.concat(p)).length < cumplenEn(todos, ps).length) ps.push(p);
      }
      if (cumplenEn(todos, ps).length !== o.quedan) continue;
      for (let i = ps.length - 1; i >= 0; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (cumplenEn(todos, sin).length === o.quedan) ps = sin; }
      if (ps.length < 2 || ps.length > 4) continue;
      if (!ps.some(p => p.tipo === 'der' || p.tipo === 'izq')) continue;
      if (o.cadena && !ps.some(p => ['der', 'izq'].includes(p.tipo) && (p.a === ref || p.b === ref))) continue;
      if (Kit.palabras(ps.map(p => p.t).join(' ')) > 40) continue;
      const q = cumplenEn(todos, ps);
      return { n: o.n, gente, ref, ps, q, sol: q[0], todos, datos: [D_MESA(o.n), D_DER, ...PIS(...ps.map(p => p.t))] };
    }
    throw new Error('casoMesa: no se armó un caso');
  }
  // El mismo caso con derecha e izquierda cambiadas: la mesa que deja esa lectura, si es una sola.
  const espejoMesa = c => { const q = cumplenEn(c.todos, c.ps.map(p => (p.tipo === 'der' ? PM.izq(p.a, p.b) : p.tipo === 'izq' ? PM.der(p.a, p.b) : p))); return q.length === 1 ? q[0] : null; };
  function ahoraMesa(s) {
    const r = azar(s), tipo = s % 4;
    if (tipo === 0 || tipo === 2) {
      // ¿Quién se sienta a la derecha (tipo 0) o a la izquierda (tipo 2) de alguien?
      const c = casoMesa(r, { n: tipo === 0 ? 5 : 6, quedan: 1 }), der = tipo === 0;
      const cand = c.gente.filter(x => !c.ps.some(p => ['der', 'izq'].includes(p.tipo) && [p.a, p.b].includes(x) && [p.a, p.b].includes(der ? derDe(c.sol, x) : izqDe(c.sol, x))));
      const x = r.elegir(cand.length ? cand : c.gente), bien = der ? derDe(c.sol, x) : izqDe(c.sol, x), otro = der ? izqDe(c.sol, x) : derDe(c.sol, x);
      const ok = y => o => (der ? derDe(o, x) : izqDe(o, x)) === y;
      const ops = [{ id: 'c', texto: bien, correcta: true },
        { id: 'lado', texto: otro, error: 'RMP140', siFuera: `${otro} se sienta a su ${der ? 'izquierda' : 'derecha'}. Mirando al centro, la derecha de ${x} va contra el reloj.` }];
      for (const y of r.barajar(c.gente.filter(y => ![x, bien, otro].includes(y)))) {
        if (ops.length >= 4) break;
        ops.push(Object.assign({ id: `g${c.gente.indexOf(y)}`, texto: y }, porQueNoEn(c.todos, c.ps, ok(y), `${y} no queda a la ${der ? 'derecha' : 'izquierda'} de ${x}`)));
      }
      ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada silla queda una sola mesa.' });
      return { pregunta: `${lista(c.gente)} almuerzan en una mesa redonda. ¿Quién se sienta a la ${der ? 'derecha' : 'izquierda'} de ${x}?`, datos: c.datos,
        dibujo: figMesa(c.n, [{ s: 0, t: c.ref }]), opciones: ops,
        solucion: { texto: `Dando la vuelta contra el reloj: ${lista(c.sol)}. A la ${der ? 'derecha' : 'izquierda'} de ${x} está ${bien}.`,
          dibujo: figMesa(c.n, sentar(c.sol, { [x]: { ref: true }, [bien]: { seguro: true } }), { flechas: [{ s: c.sol.indexOf(x), sentido: der ? 'derecha' : 'izquierda' }] }) } };
    }
    if (tipo === 1) {
      // ¿Quién se sienta entre dos?
      for (let intento = 0; intento < 60; intento++) {
        const c = casoMesa(r, { n: 6, quedan: 1 });
        const ternas = c.sol.map((x, i) => [izqDe(c.sol, x), x, derDe(c.sol, x)]).filter(([a, x, b]) => !c.ps.some(p => p.tipo === 'entre' && p.a === x));
        if (!ternas.length) continue;
        const [a, x, b] = r.elegir(ternas), ok = y => o => juntoM(o, y, a) && juntoM(o, y, b);
        const ops = [{ id: 'c', texto: x, correcta: true }];
        for (const y of r.barajar(c.gente.filter(y => ![a, b, x].includes(y)))) { if (ops.length >= 4) break; ops.push(Object.assign({ id: `g${c.gente.indexOf(y)}`, texto: y }, porQueNoEn(c.todos, c.ps, ok(y), `${y} no queda entre ${a} y ${b}`))); }
        ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada silla queda una sola mesa.' });
        return { pregunta: `${lista(c.gente)} almuerzan en una mesa redonda. ¿Quién se sienta entre ${a} y ${b}?`, datos: c.datos,
          dibujo: figMesa(c.n, [{ s: 0, t: c.ref }]), opciones: ops,
          solucion: { texto: `Dando la vuelta contra el reloj: ${lista(c.sol)}. Entre ${a} y ${b} se sienta ${x}.`, dibujo: figMesa(c.n, sentar(c.sol, { [x]: { seguro: true } })) } };
      }
    }
    // Nivel examen: 6 personas, una o dos mesas en pie, «¿cuál es necesariamente verdadera?».
    const quedan = 1 + (Math.floor(s / 4) % 2);
    const c = casoMesa(r, { n: 6, quedan });
    const af = [];
    for (const a of c.gente) for (const b of c.gente) if (a !== b) {
      af.push({ t: `${a} se sienta a la derecha de ${b}`, ok: o => derDe(o, b) === a });
      if (a < b) af.push({ t: `${a} se sienta junto a ${b}`, ok: o => juntoM(o, a, b) });
      for (const z of c.gente) if (b < z && z !== a) af.push({ t: `${a} se sienta entre ${b} y ${z}`, ok: o => juntoM(o, a, b) && juntoM(o, a, z) });
    }
    const utiles = af.filter(x => !c.ps.some(p => c.todos.filter(o => p.ok(o)).every(x.ok)));
    const cuenta = x => c.q.filter(x.ok).length;
    const seguras = utiles.filter(x => cuenta(x) === c.q.length), posibles = utiles.filter(x => cuenta(x) > 0 && cuenta(x) < c.q.length), imposibles = utiles.filter(x => cuenta(x) === 0);
    const bien = r.elegir(seguras), ops = [{ id: 'c', texto: bien.t, correcta: true }];
    const esp = espejoMesa(c);
    const espejada = esp && imposibles.find(x => x.ok(esp) && /a la derecha de/.test(x.t));
    if (espejada) ops.push({ id: 'espejo', texto: espejada.t, error: 'RMP140', siFuera: 'Sería así con derecha e izquierda cambiadas. Mirando al centro, la derecha va contra el reloj.' });
    if (posibles.length) { const x = r.elegir(posibles); ops.push({ id: 'posible', texto: x.t, error: 'RMP77', siFuera: `Pasa en una de las ${c.q.length} mesas que quedan; en la otra, no.` }); }
    for (const x of r.barajar(imposibles.filter(x => x !== espejada))) { if (ops.length >= 4) break; ops.push(Object.assign({ id: `x${ops.length}`, texto: x.t }, porQueNoEn(c.todos, c.ps, x.ok, 'ninguna mesa lo cumple'))); }
    return { pregunta: `${lista(c.gente)} almuerzan en una mesa redonda. ¿Cuál es necesariamente verdadera?`, datos: c.datos,
      dibujo: figMesa(c.n, [{ s: 0, t: c.ref }]), opciones: ops,
      solucion: { texto: quedan === 1 ? `Queda una sola mesa: ${lista(c.sol)}, contra el reloj.` : `Quedan 2 mesas y en las dos, ${minus(bien.t)}.`, dibujo: figMesa(c.n, sentar(c.sol)) } };
  }

  // ---------- Ejemplos resueltos de «La mesa redonda» ----------
  // Recalculados aparte (scratchpad e5-rm/f3/v5.py, 42 comprobaciones): primero, que la silla siguiente contra el reloj
  // queda hacia la mano derecha de quien mira al centro, en mesas de 4, 5, 6 y 8; después cada ejemplo, por fuerza bruta
  // con una persona fija. 1 la derecha del dibujo · 2 la izquierda del dibujo · 3 Ciro · 4 Ana · 5 Dina · 6 Ciro ·
  // 7 Teo · 8 Dina y Eva (2 mesas) · 9 Gino (2 mesas) · 10 Dina · 11 Teo · 12 «Maru entre Teo y Vilma» en las 2 mesas ·
  // 13 no se puede saber (3 mesas: Ana en 2, Teo en 1) · 14 Iván · 15 Iván. La figura: la mesa con quien sirve de
  // referencia (y, si hace falta, quien espera de pie); nunca la mesa resuelta.
  const D_ENTRE = 'Entre dos: junto a los dos, uno de cada lado.';
  const MS = (n, sentados, extra) => figMesa(n, sentados, extra);
  const EJEMPLOS_CIRC = [
    { nivel: 1, titulo: 'La derecha de Ana', figura: MS(4, [{ s: 0, t: 'Ana' }], { espera: ['Beto'] }),
      enunciado: 'Ana almuerza en una mesa redonda de cuatro sillas; está abajo, de espaldas a ti. Beto se sienta a su derecha. ¿En qué silla del dibujo va Beto?',
      datos: ['Todos miran al centro de la mesa.', D_DER],
      solucion: [{ texto: ['Ana mira hacia donde miras tú: su mano derecha es la tuya. Beto va en la silla de la ', F('derecha del dibujo'), '.'] }],
      respuesta: [F('En la de la derecha del dibujo')] },
    { nivel: 1, titulo: 'De cara a ti', figura: MS(4, [{ s: 2, t: 'Ciro' }], { espera: ['Dina'] }),
      enunciado: 'Ciro almuerza en una mesa redonda de cuatro sillas; está arriba, de cara a ti. Dina se sienta a su derecha. ¿En qué silla del dibujo va Dina?',
      datos: ['Todos miran al centro de la mesa.', D_DER],
      solucion: [
        { texto: 'Ciro te mira de cara: su mano derecha queda del lado de tu mano izquierda.' },
        { texto: ['Dina va en la silla de la ', F('izquierda del dibujo'), ': la que sigue a Ciro contra el reloj.'] },
      ],
      respuesta: [F('En la de la izquierda del dibujo')] },
    { nivel: 1, titulo: 'Tres en la mesa', figura: MS(3, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto y Ciro almuerzan en una mesa redonda de tres sillas. ¿Quién se sienta a la izquierda de Ana?',
      datos: [D_MESA(3), D_DER, 'Pista: Beto se sienta a la derecha de Ana.'],
      solucion: [{ texto: ['En una mesa de tres, cada uno tiene dos vecinos, uno de cada lado. Beto es el de la derecha de Ana; el de la izquierda es ', F('Ciro'), '.'] }],
      respuesta: [F('Ciro')] },
    { nivel: 1, titulo: 'Con dos vecinos', figura: MS(5, [{ s: 0, t: 'Beto' }]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva almuerzan en una mesa redonda. ¿Quién se sienta entre Beto y Ciro?',
      datos: [D_MESA(5), D_ENTRE, 'Pista: Ana se sienta junto a Beto y también junto a Ciro.'],
      solucion: [{ texto: ['Ana tiene dos vecinos, uno de cada lado, y son Beto y Ciro. Entre los dos se sienta ', F('Ana'), '.'] }],
      respuesta: [F('Ana')] },
    { nivel: 1, titulo: 'La vuelta completa', figura: MS(4, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro y Dina almuerzan en una mesa redonda de cuatro sillas. ¿Quién se sienta a la izquierda de Ana?',
      datos: [D_MESA(4), D_DER, ...PIS('Beto se sienta a la derecha de Ana.', 'Ciro se sienta a la derecha de Beto.')],
      solucion: [
        { texto: 'Contra el reloj desde Ana: Beto, y después Ciro. Queda una silla, para Dina.' },
        { texto: ['Esa silla sigue a Ana con el reloj: es su izquierda. Ahí va ', F('Dina'), '.'] },
      ],
      respuesta: [F('Dina')] },
    { nivel: 2, titulo: 'Una pista con «no»', figura: MS(5, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva almuerzan en una mesa redonda. ¿Quién se sienta a la izquierda de Ana?',
      datos: [D_MESA(5), D_DER, ...PIS('Beto se sienta a la derecha de Ana.', 'Dina no se sienta junto a Ana.', 'Eva se sienta a la izquierda de Ciro.')],
      solucion: [
        { texto: 'Contra el reloj desde Ana: Ana, Beto y tres sillas libres. Dina no va en la última, que toca a Ana.' },
        { texto: 'Eva y Ciro van seguidos, con Eva primero contra el reloj. Si Dina tomara la del medio, no habría dos sillas seguidas para ellos.' },
        { texto: ['Dina va en la primera libre; Eva y Ciro, en las otras dos. A la izquierda de Ana se sienta ', F('Ciro'), '.'] },
      ],
      respuesta: [F('Ciro'), ': Ana, Beto, Dina, Eva, Ciro'] },
    { nivel: 2, titulo: 'Entre dos', figura: MS(6, [{ s: 0, t: 'Rosa' }]),
      enunciado: 'Rosa, Iván, Nora, Leo, Maru y Teo almuerzan en una mesa redonda. ¿Quién se sienta a la izquierda de Rosa?',
      datos: [D_MESA(6), D_DER, D_ENTRE, ...PIS('Iván se sienta a la derecha de Rosa.', 'Nora se sienta entre Iván y Leo.', 'Maru no se sienta junto a Rosa.')],
      solucion: [
        { texto: 'Contra el reloj desde Rosa: Iván. Nora tiene a Iván de un lado y a Leo del otro: Rosa, Iván, Nora, Leo.' },
        { texto: ['Quedan dos sillas. Maru no toca a Rosa: va después de Leo, y ', F('Teo'), ' cierra la vuelta, a la izquierda de Rosa.'] },
      ],
      respuesta: [F('Teo')] },
    { nivel: 2, titulo: '¿Entre quiénes?', figura: MS(5, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva almuerzan en una mesa redonda. ¿Entre quiénes se sienta Beto?',
      datos: [D_MESA(5), D_DER, ...PIS('Ciro se sienta a la izquierda de Ana.', 'Beto no se sienta junto a Ciro.', 'Dina no se sienta junto a Eva.')],
      solucion: [
        { texto: 'Contra el reloj desde Ana, Ciro ocupa la última silla. Quedan tres seguidas para Beto, Dina y Eva.' },
        { texto: 'Dina y Eva no van juntas: ocupan la primera y la tercera, y Beto, la del medio, que no toca a Ciro.' },
        { texto: ['Quedan 2 mesas, pero en las dos Beto se sienta entre ', F('Dina y Eva'), '.'] },
      ],
      respuesta: [F('Entre Dina y Eva')] },
    { nivel: 2, titulo: 'Lo que queda seguro', figura: MS(6, [{ s: 0, t: 'Sara' }]),
      enunciado: 'Sara, Gino, Pía, Omar, Teo y Vilma almuerzan en una mesa redonda. ¿Quién se sienta entre Pía y Sara?',
      datos: [D_MESA(6), D_DER, ...PIS('Gino se sienta a la izquierda de Sara.', 'Pía se sienta a la izquierda de Gino.', 'Omar se sienta a la derecha de Sara.', 'Teo no se sienta junto a Gino.')],
      solucion: [
        { texto: 'Con el reloj desde Sara: Gino, y después Pía. Contra el reloj desde Sara: Omar.' },
        { texto: 'Teo y Vilma toman las dos sillas que quedan, entre Omar y Pía, en un orden o en el otro: quedan 2 mesas.' },
        { texto: ['En las dos, entre Pía y Sara se sienta ', F('Gino'), '.'] },
      ],
      respuesta: [F('Gino')] },
    { nivel: 2, titulo: 'Dos a la derecha', figura: MS(5, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva almuerzan en una mesa redonda. ¿Quién se sienta a la derecha de Ciro?',
      datos: [D_MESA(5), D_DER, ...PIS('Beto se sienta a la derecha de Ana.', 'Ciro se sienta a la derecha de Beto.', 'Eva no se sienta junto a Ciro.')],
      solucion: [
        { texto: 'Contra el reloj desde Ana: Beto, Ciro y dos sillas libres. La primera toca a Ciro; la segunda, a Ana.' },
        { texto: ['Eva no toca a Ciro: va en la segunda. A la derecha de Ciro se sienta ', F('Dina'), '.'] },
      ],
      respuesta: [F('Dina')] },
    { nivel: 3, titulo: 'La derecha de Iván', figura: MS(6, [{ s: 0, t: 'Rosa' }]),
      enunciado: 'Rosa, Iván, Nora, Leo, Maru y Teo almuerzan en una mesa redonda. ¿Quién se sienta a la derecha de Iván?',
      alternativas: ['Maru', 'Rosa', 'Nora', 'Teo', 'Faltan datos'],
      datos: [D_MESA(6), D_DER, ...PIS('Leo se sienta a la derecha de Rosa.', 'Iván no se sienta junto a Rosa ni junto a Leo.', 'Maru se sienta a la izquierda de Iván.', 'Nora se sienta a la derecha de Leo.')],
      solucion: [
        { texto: 'Contra el reloj desde Rosa: Leo y Nora; quedan tres sillas. Iván no toca a Rosa: no va en la última. En la primera, Maru caería donde Nora.' },
        { texto: 'Iván va en la del medio y Maru, a su izquierda, en la de antes. La última, junto a Rosa, es de Teo: Rosa, Leo, Nora, Maru, Iván, Teo.' },
        { texto: ['A la derecha de Iván se sienta ', F('Teo'), '. Maru es su izquierda; Rosa y Nora no lo tocan; y no faltan datos.'] },
      ],
      respuesta: [F('D'), ': Teo'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: MS(5, [{ s: 0, t: 'Lucho' }]),
      enunciado: 'Lucho, Maru, Teo, Vilma y Ana almuerzan en una mesa redonda. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Maru se sienta entre Teo y Vilma', 'Teo se sienta junto a Ana', 'Vilma se sienta a la izquierda de Lucho', 'Maru se sienta junto a Ana', 'Teo se sienta a la derecha de Ana'],
      datos: [D_MESA(5), D_DER, D_ENTRE, ...PIS('Lucho no se sienta junto a Maru.', 'Teo no se sienta junto a Vilma.', 'Ana se sienta a la derecha de Lucho.')],
      solucion: [
        { texto: 'Contra el reloj desde Lucho: Ana y tres sillas libres. Maru no toca a Lucho: va en la primera o en la del medio.' },
        { texto: 'Si Maru tomara la primera, Teo y Vilma quedarían juntos. Maru va en la del medio, entre Teo y Vilma.' },
        { texto: ['Quedan 2 mesas, con Teo y Vilma en un orden o en el otro: ', F('Maru se sienta entre Teo y Vilma'), ' en las dos.'] },
        { texto: 'B, C y E pasan en una sola de las dos mesas: posibles. D nunca: Ana tiene a Lucho y a Teo o a Vilma.' },
      ],
      respuesta: [F('A'), ': Maru se sienta entre Teo y Vilma'] },
    { nivel: 3, titulo: 'Cuando no alcanza', figura: MS(5, [{ s: 0, t: 'Lucho' }]),
      enunciado: 'Lucho, Maru, Teo, Vilma y Ana almuerzan en una mesa redonda. ¿Quién se sienta a la izquierda de Lucho?',
      alternativas: ['Ana', 'Teo', 'Maru', 'Vilma', 'No se puede saber'],
      datos: [D_MESA(5), D_DER, ...PIS('Maru se sienta a la derecha de Lucho.', 'Ana no se sienta junto a Maru.', 'Vilma no se sienta junto a Lucho.')],
      solucion: [
        { texto: 'Contra el reloj desde Lucho: Maru y tres sillas libres. Vilma no toca a Lucho: no va en la última.' },
        { texto: 'Ana no toca a Maru: no va en la primera libre. Quedan 3 mesas: Lucho, Maru, y después Teo, Vilma, Ana; Vilma, Teo, Ana; o Vilma, Ana, Teo.' },
        { texto: ['A la izquierda de Lucho va Ana en dos mesas y Teo en una: ', F('no se puede saber'), '.'] },
        { texto: 'A y B son posibles, no seguras. Maru es su derecha; Vilma no lo toca.' },
      ],
      respuesta: [F('E'), ': no se puede saber'] },
    { nivel: 3, titulo: 'La derecha de Hugo', figura: MS(6, [{ s: 0, t: 'Eva' }]),
      enunciado: 'Eva, Fito, Gino, Hugo, Iván y Ana almuerzan en una mesa redonda. ¿Quién se sienta a la derecha de Hugo?',
      alternativas: ['Gino', 'Ana', 'Fito', 'Eva', 'Iván'],
      datos: [D_MESA(6), D_DER, ...PIS('Fito se sienta entre Eva y Gino.', 'Hugo se sienta a la derecha de Gino.', 'Iván no se sienta junto a Eva.', 'Ana se sienta a la izquierda de Eva.')],
      solucion: [
        { texto: 'Ana va con el reloj desde Eva. Fito toca a Eva del otro lado: contra el reloj desde Eva van Fito y Gino.' },
        { texto: 'Hugo va justo después de Gino. Queda una silla, entre Hugo y Ana, y es de Iván, que así no toca a Eva.' },
        { texto: ['Contra el reloj: Eva, Fito, Gino, Hugo, Iván, Ana. A la derecha de Hugo se sienta ', F('Iván'), '.'] },
        { texto: 'Gino es su izquierda. Ana, Fito y Eva no lo tocan.' },
      ],
      respuesta: [F('E'), ': Iván'] },
    { nivel: 3, titulo: 'Arriba, de cara a ti', figura: MS(6, [{ s: S_ARRIBA, t: 'Nora' }]),
      enunciado: 'Seis amigos almuerzan en una mesa redonda. En el dibujo, Nora está arriba, de cara a ti. ¿Quién se sienta junto a Nora, en la silla de la derecha del dibujo?',
      alternativas: ['Leo', 'Rosa', 'Iván', 'Teo', 'Maru'],
      datos: [D_MESA(6), D_DER, ...PIS('Iván se sienta a la izquierda de Nora.', 'Leo se sienta a la derecha de Nora.', 'Rosa no se sienta junto a Iván.', 'Teo se sienta junto a Leo.')],
      solucion: [
        { texto: 'Nora te mira de frente: su derecha queda a tu izquierda. La silla de la derecha del dibujo es su izquierda.' },
        { texto: ['A la izquierda de Nora se sienta Iván: va en la silla de la derecha del dibujo. Es ', F('Iván'), '.'] },
        { texto: 'Leo, a su derecha, queda a la izquierda del dibujo: es el error de tomar tu derecha por la suya. Rosa, Teo y Maru no tocan a Nora.' },
      ],
      respuesta: [F('C'), ': Iván'] },
  ];
  circular.ejemplos = EJEMPLOS_CIRC;

  // ---------- Idea 6: frente a frente ----------
  // Objeto: la mesa del compartir del aula, con un cartel de número en cada silla (escena «mesa»): primero una ronda de 8
  // sillas, después las carpetas juntas en cuadrado, con dos sillas por lado. Cambia: la silla de Ana · Permanece: los
  // números, contra el reloj desde la de abajo · Progresa: la línea que cruza la mesa · Se reserva: «frente a» en la
  // cuadrada, que no es media vuelta (la predicción) · Debe verse: «frente a» es la silla que se mira al cruzar la mesa.
  // Sillas: la 1 abajo (en la cuadrada, abajo a la izquierda) y siguen contra el reloj, hacia la derecha de quien mira a la
  // mesa; así «a la derecha de» es la silla siguiente, como en la idea 5.
  const frR = (s, n) => (s + n / 2) % n;
  const frQ = (i, k) => { const lado = Math.floor(i / k), j = i % k; return ((lado + 2) % 4) * k + (k - 1 - j); };
  const numeros = n => Array.from({ length: n }, (_, i) => String(i + 1));
  const N8 = 8;
  const figRonda = (n, extra) => ({ pieza: OR, datos: Object.assign({ escena: 'mesa', forma: 'redonda', sillas: n, numeros: numeros(n) }, extra || {}), estado: {} });
  const figCuad = (k, extra) => ({ pieza: OR, datos: Object.assign({ escena: 'mesa', forma: 'cuadrada', porLado: k, numeros: numeros(4 * k) }, extra || {}), estado: {} });
  // El juego: la ronda de 8; Ana en la silla s (de 1 a 8) y la línea que cruza hasta la de enfrente.
  const J6_META = 7, J6_BIEN = [1, 2, 3, 4, 5, 6, 7, 8].filter(s => frR(s - 1, N8) + 1 === J6_META);
  if (J6_BIEN.length !== 1) throw new Error('juego de frente: una sola silla');
  function rondaJ(s) {
    const bien = s === J6_BIEN[0];
    return { escena: 'mesa', forma: 'redonda', sillas: N8, numeros: numeros(N8),
      sentados: [{ s: s - 1, t: 'Ana', ref: !bien, seguro: bien }], frente: [{ de: s - 1, a: frR(s - 1, N8) }], marcas: [{ s: J6_META - 1 }] };
  }
  const lecturaJ6 = s => [`Frente a la silla ${s} está la ${frR(s - 1, N8) + 1}: cuatro sillas más allá`];
  // La predicción: la mesa cuadrada de 8; frente a la 1 está la 6 (no la 5, que es media vuelta).
  const P6_FRENTE = frQ(0, 2) + 1;
  if (P6_FRENTE !== 6) throw new Error('predicción de la cuadrada: frente a la 1 debe ser la 6');
  const ideaFrente = {
    id: 'mesa-cuadrada',
    titulo: 'Frente a frente',
    pregunta: '¿Qué silla queda frente a otra en cada mesa?',
    temas: ['Ordenamiento circular', 'Ordenamiento poligonal'],
    pieza: OR,
    aprendizaje: '«Frente a» es la silla que queda al cruzar la mesa: en la redonda con sillas pares, media vuelta; en la cuadrada, el lado opuesto.',
    actividad: 'Mover a Ana de silla y mirar cuál queda al cruzar la mesa.',
    lee: {
      tarjetas: [
        { titulo: 'El compartir del aula', texto: 'Para el compartir del aula, juntan sillas alrededor de una mesa redonda. Cada silla tiene un cartel con su número, del 1 al 8, contados en orden.',
          pieza: OR, dibujo: figRonda(N8) },
        { titulo: 'Sillas con número', texto: 'Con números, cada silla es distinta: girar a todos cambia en qué silla queda cada uno. Los números siguen contra el reloj desde la silla 1, la de abajo.' },
        { titulo: 'Cruzar la mesa', texto: 'Hay preguntas sobre quién queda «frente a» alguien: la persona que se ve al otro lado, cruzando la mesa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve a Ana de silla. La línea cruza la mesa hasta la silla de enfrente: mira cuántas sillas quedan entre las dos.' },
      ],
    },
    juega: {
      pieza: OR,
      consigna: 'Ronda de 8 sillas numeradas en orden, contra el reloj desde la de abajo. Ana elige dónde sentarse.',
      mision: {
        texto: `Sienta a Ana frente a la silla ${J6_META}.`,
        logrado: v => v.s === J6_BIEN[0],
        bien: [`Ana en la ${J6_BIEN[0]}: la línea cruza la mesa y llega a la ${J6_META}.`],
      },
      voz: 'Sigue la línea: cruza la mesa por el centro.',
      leyenda: [
        { s: '1 a 8', t: 'el número de cada silla' },
        { s: { v: 'c-o', t: 'naranja' }, t: 'Ana, desde quien se mira' },
        { s: { v: 'c-i', t: 'línea turquesa' }, t: 'cruza la mesa: frente a' },
        { s: F('violeta'), t: 'la silla pedida, ya comprobada' },
      ],
      controles: [{ id: 's', etiqueta: 'Silla de Ana', min: 1, max: N8, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => ({ datos: rondaJ(v.s), estado: {} }),
      lectura: v => lecturaJ6(v.s),
      minimo: 3,
      arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-o',
        donde: v => { const g = Kit.piezas[OR].geometria(rondaJ(v.s)), p = g.silla(v.s - 1); return { x: p.x, y: p.y }; },
        mover: (pt, v) => { const s = sillaCerca(rondaJ(v.s), pt, -1) + 1; return s === v.s ? {} : { s }; } }],
    },
    predice: {
      pregunta: 'Ahora la mesa es cuadrada, de carpetas juntas, con dos sillas por lado, numeradas del 1 al 8 en orden. ¿Qué silla queda frente a la 1?',
      datos: ['«Frente a»: la silla que se mira al cruzar la mesa.'],
      orden: 'fijo',
      voz: 'Mira desde la silla 1 hacia el otro lado.',
      opciones: [
        { id: 'cinco', texto: 'La 5', error: 'RMP142', siFuera: 'La 5 está a media vuelta, como en la redonda. Aquí queda en diagonal, no enfrente.' },
        { id: 'c', texto: 'La 6', correcta: true },
        { id: 'dos', texto: 'La 2', error: 'RMP142', siFuera: 'La 2 está a su lado, en el mismo borde de la mesa.' },
        { id: 'ocho', texto: 'La 8', error: 'RMP142', siFuera: 'La 8 está al doblar la esquina, no enfrente.' },
      ],
      dibujo: figCuad(2, { sentados: [{ s: 0, t: 'Ana', ref: true }] }),
      revelar: figCuad(2, { sentados: [{ s: 0, t: 'Ana', ref: true }], frente: [{ de: 0, a: frQ(0, 2) }], marcas: [{ s: frQ(0, 2), seguro: true }] }),
      coincide: `Coincide: la 1 y la ${P6_FRENTE} se miran al cruzar la mesa.`,
      noCoincide: `Revisemos: desde la 1, al cruzar la mesa se llega a la ${P6_FRENTE}, en el lado de arriba. La 5 queda en diagonal.`,
    },
    mira: {
      pieza: OR,
      datos: { escena: 'mesa', forma: 'cuadrada', porLado: 2, numeros: numeros(8), sentados: [{ s: 0, t: 'Ana', ref: true }],
        marcas: [{ s: 1, desde: 1 }, { s: 7, desde: 2 }, { s: 4, desde: 3 }, { s: frQ(0, 2), seguro: true, desde: 4 }], frente: [{ de: 0, a: frQ(0, 2), desde: 4 }] },
      voz: 'Desde la 1, mira cuál de estas sillas te queda al cruzar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La 2 comparte con la 1 el lado de abajo.' },
        { estado: { corte: 2 }, texto: 'La 8 está en el lado izquierdo, al doblar la esquina.' },
        { estado: { corte: 3 }, texto: 'La 5 está a media vuelta, pero en diagonal: no se miran.' },
        { estado: { corte: 4 }, texto: ['Al cruzar la mesa, frente a la 1 está la ', F(String(P6_FRENTE)), '.'] },
        { estado: { corte: 4 }, texto: 'En la cuadrada, frente es el lado opuesto, alineado.' },
      ],
    },
    regla: {
      texto: '«Frente a» es la silla que se mira al cruzar la mesa. En la redonda con sillas pares, a media vuelta; en la cuadrada, en el lado opuesto, alineada.',
      ecuacion: [{ llave: ['media vuelta'], nota: 'la mitad de las sillas más allá' }],
      condicion: 'todos miran a la mesa. En la mesa redonda con un número impar de sillas, nadie queda justo enfrente.',
      voz: 'Antes de contar sillas, mira qué forma tiene la mesa.',
      // Dos pares, uno de arriba a abajo y otro de lado a lado (con los cuatro, las líneas formaban un cuadrado en el centro).
      dibujo: figCuad(2, { frente: [0, 2].map(i => ({ de: i, a: frQ(i, 2) })), marcas: [0, 2].flatMap(i => [{ s: i }, { s: frQ(i, 2) }]) }),
    },
    ejemplos: null,   // EJEMPLOS_FRENTE, abajo
    // Así se resuelve: la mesa cuadrada numerada, con cuatro personas; se sienta a cada uno desde el anterior (frente a,
    // a la derecha de). «Ahora tú» pregunta otra cosa: un número de silla, quién queda enfrente o qué silla queda vacía.
    resuelve: {
      pieza: OR,
      generar(s) {
        const r = azar(s + 900), k = 2 + (s % 2), N = 4 * k, gente = r.barajar(NOMBRES_M).slice(0, 4);
        const [a, b, c, d] = gente, pa = r.ent(0, N - 1), pb = frQ(pa, k), lado = r() < 0.5 ? 'derecha' : 'izquierda';
        const pc = lado === 'derecha' ? (pb + 1) % N : (pb + N - 1) % N, pd = frQ(pc, k);
        const ps = [`${a} se sienta en la silla ${pa + 1}.`, `${b} se sienta frente a ${a}.`, `${c} se sienta a la ${lado} de ${b}.`, `${d} se sienta frente a ${c}.`];
        const sit = (xs, seg) => xs.map(([t, p]) => ({ s: p, t, seguro: seg.includes(t) }));
        return {
          enunciado: `${lista(gente.slice().sort())} se sientan en una mesa cuadrada de ${k === 2 ? 'dos' : 'tres'} sillas por lado, numeradas del 1 al ${N}. ¿En qué silla se sienta cada uno?`,
          datos: [`Sillas numeradas contra el reloj desde la de abajo a la izquierda.`, D_DER, ...PIS(...ps)],
          dibujo: figCuad(k, { sentados: [{ s: pa, t: a, ref: true }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la silla de cada uno.' },
            { tipo: 'regla', texto: 'En la cuadrada, «frente a» es la silla del lado opuesto, alineada; «a la derecha» es la silla siguiente contra el reloj.' },
            { tipo: 'aplica', texto: `${a} está en la ${pa + 1}. Cruzo la mesa: ${b} queda en la ${pb + 1}. A la ${lado} de ${b}, ${c} va en la ${pc + 1}.`,
              dibujo: figCuad(k, { sentados: sit([[a, pa], [b, pb], [c, pc]], [b, c]), frente: [{ de: pa, a: pb }] }) },
            { tipo: 'aplica', texto: `Cruzo la mesa desde la ${pc + 1}: ${d} queda en la ${pd + 1}.`, dibujo: figCuad(k, { sentados: sit([[a, pa], [b, pb], [c, pc], [d, pd]], [b, c, d]), frente: [{ de: pa, a: pb }, { de: pc, a: pd }] }) },
            { tipo: 'sentido', texto: `La ${(pa + N / 2) % N + 1}, a media vuelta de la ${pa + 1}, ${(pa + N / 2) % N === pb ? 'coincide aquí con la de enfrente' : 'no es la de enfrente: en la cuadrada queda en diagonal'}.` },
          ],
          respuesta: [F(`${a} ${pa + 1}, ${b} ${pb + 1}, ${c} ${pc + 1}, ${d} ${pd + 1}`)],
        };
      },
    },
    ahoraTu: {
      pieza: OR,
      voz: 'Cruza la mesa con el dedo antes de contar sillas.',
      generar(s) { return ahoraFrente(s); },
    },
  };
  const D_NUM = n => `${n} sillas numeradas en orden, contra el reloj desde la de abajo.`;
  function ahoraFrente(s) {
    const r = azar(s), tipo = s % 4;
    if (tipo === 0) {
      // La cuadrada: frente a una silla, o la que comparte su lado.
      for (let intento = 0; intento < 50; intento++) {
        const k = 2 + (Math.floor(s / 4) % 2), N = 4 * k, i = r.ent(0, N - 1), pide = k === 2 && Math.floor(s / 8) % 2 ? 'lado' : 'frente';   // con tres por lado, «comparte el lado» tendría dos respuestas
        const fr = frQ(i, k), mv = (i + N / 2) % N, lado = Math.floor(i / k), mismo = [0, 1, 2].map(j => lado * k + j).filter(j => j < (lado + 1) * k && j !== i)[0];
        const esq = i % k === 0 ? (i + N - 1) % N : i % k === k - 1 ? (i + 1) % N : null;
        const bien = pide === 'frente' ? fr : mismo;
        const cand = [[mv, 'RMP142', 'Esa está a media vuelta, como en la redonda; en la cuadrada queda en diagonal.'],
          [pide === 'frente' ? mismo : fr, 'RMP142', pide === 'frente' ? 'Esa comparte el lado; frente es el lado opuesto.' : 'Esa está enfrente, cruzando la mesa.'],
          [esq, 'RMP142', 'Esa está al doblar la esquina, en otro lado.']].filter(([x]) => x !== null && x !== bien);
        const ops = [{ id: 'c', texto: `La ${bien + 1}`, correcta: true }];
        for (const [x, e, t] of cand) if (!ops.some(o => o.texto === `La ${x + 1}`)) ops.push({ id: `x${ops.length}`, texto: `La ${x + 1}`, error: e, siFuera: t });
        if (ops.length < 3) continue;
        return { pregunta: `Mesa cuadrada de carpetas, con ${k === 2 ? 'dos' : 'tres'} sillas por lado, numeradas del 1 al ${N}. ¿Qué silla ${pide === 'frente' ? 'queda frente a' : 'comparte el lado con'} la ${i + 1}?`,
          datos: [D_NUM(N).replace('la de abajo', 'la de abajo a la izquierda'), '«Frente a»: la silla que se mira al cruzar la mesa.'],
          dibujo: figCuad(k), opciones: ops,
          solucion: { texto: pide === 'frente' ? `Desde la ${i + 1} se cruza al lado opuesto, alineado: la ${fr + 1}.` : `En el mismo borde que la ${i + 1} está la ${mismo + 1}.`,
            dibujo: figCuad(k, { marcas: [{ s: i }, { s: bien, seguro: true }], frente: pide === 'frente' ? [{ de: i, a: fr }] : [] }) } };
      }
    }
    if (tipo === 1 || tipo === 3) {
      // Redonda sin números, con «frente a» entre las pistas: ¿quién se sienta frente a alguien? (nivel examen: de 8, con
      // varones y mujeres alternados).
      const n = 6, alt = tipo === 3;
      for (let intento = 0; intento < 400; intento++) {
        const gente = (alt ? r.barajar(['Ana', 'Dina', 'Eva', 'Rosa']).slice(0, 3).concat(r.barajar(['Beto', 'Ciro', 'Fito', 'Gino']).slice(0, 3)) : r.barajar(NOMBRES_M).slice(0, n)).sort();
        const ref = gente[0], todos = mesasDe(gente, n, ref).filter(o => !alt || o.every((x, i) => FEM.has(x) !== FEM.has(o[(i + 1) % n]))), sol = r.elegir(todos);
        const pozo = [];
        for (const a of gente) for (const b of gente) if (a < b) {
          if (sol[frR(sol.indexOf(a), n)] === b) pozo.push({ t: `${a} se sienta frente a ${b}.`, a, b, frente: true, ok: o => o[frR(o.indexOf(a), n)] === b });
          if (derDe(sol, b) === a) pozo.push(PM.der(a, b)); if (derDe(sol, a) === b) pozo.push(PM.der(b, a));
          if (!juntoM(sol, a, b) && sol[frR(sol.indexOf(a), n)] !== b) pozo.push(PM.noJunto(a, b));
        }
        let ps = [];
        for (const p of r.barajar(pozo)) { if (cumplenEn(todos, ps).length <= 1) break; if (cumplenEn(todos, ps.concat(p)).length < cumplenEn(todos, ps).length) ps.push(p); }
        if (cumplenEn(todos, ps).length !== 1) continue;
        for (let i = ps.length - 1; i >= 0; i--) { const sin = ps.slice(0, i).concat(ps.slice(i + 1)); if (cumplenEn(todos, sin).length === 1) ps = sin; }
        if (ps.length > (alt ? 3 : 4) || !ps.some(p => p.frente)) continue;
        const x = r.elegir(gente.filter(y => !ps.some(p => p.frente && [p.a, p.b].includes(y))));
        if (!x) continue;
        const bien = sol[frR(sol.indexOf(x), n)], lados = [izqDe(sol, bien), derDe(sol, bien)].filter(y => y !== x);
        const ops = [{ id: 'c', texto: bien, correcta: true }];
        for (const y of lados) ops.push({ id: `v${ops.length}`, texto: y, error: 'RMP1', siFuera: `${y} está junto a quien queda frente a ${x}: una silla de más o de menos.` });
        for (const y of r.barajar(gente.filter(y => ![x, bien, ...lados].includes(y)))) { if (ops.length >= 4) break; ops.push(Object.assign({ id: `g${gente.indexOf(y)}`, texto: y }, porQueNoEn(todos, ps, o => o[frR(o.indexOf(x), n)] === y, `${y} no queda frente a ${x}`))); }
        ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada silla queda una sola mesa.' });
        return { pregunta: `${lista(gente)} ${tipo === 1 ? 'almuerzan en' : 'comparten un almuerzo en'} una mesa redonda de ${n} sillas. ¿Quién se sienta frente a ${x}?`,
          datos: [D_MESA(n), D_DER].concat(alt ? [`Mujeres (${lista(gente.filter(y => FEM.has(y)))}) y varones (${lista(gente.filter(y => !FEM.has(y)))}), alternados: nunca dos mujeres ni dos varones juntos.`] : [], PIS(...ps.map(p => p.t))), dibujo: figMesa(n, [{ s: 0, t: ref }]), opciones: ops,
          solucion: { texto: `Dando la vuelta contra el reloj: ${lista(sol)}. A media vuelta de ${x} está ${bien}.`,
            dibujo: figMesa(n, sentar(sol, { [x]: { ref: true }, [bien]: { seguro: true } }), { frente: [{ de: sol.indexOf(x), a: frR(sol.indexOf(x), n) }] }) } };
      }
    }
    // La silla vacía: redonda de 6 numerada, con cinco personas.
    for (let intento = 0; intento < 400; intento++) {
      const gente = r.barajar(NOMBRES_M).slice(0, 5).sort(), todos = arreglos(gente, 6), sol = r.elegir(todos), x = gente[0];
      const pozo = [{ t: `${x} se sienta en la silla ${sol.indexOf(x) + 1}.`, ok: o => o.indexOf(x) === sol.indexOf(x) }];
      for (const a of gente) for (const b of gente) if (a < b) {
        if (sol[frR(sol.indexOf(a), 6)] === b) pozo.push({ t: `${a} se sienta frente a ${b}.`, ok: o => o[frR(o.indexOf(a), 6)] === b });
        if (sol[(sol.indexOf(b) + 1) % 6] === a) pozo.push({ t: `${a} se sienta a la derecha de ${b}.`, ok: o => o[(o.indexOf(b) + 1) % 6] === a });
        if (sol[(sol.indexOf(a) + 1) % 6] === b) pozo.push({ t: `${b} se sienta a la derecha de ${a}.`, ok: o => o[(o.indexOf(a) + 1) % 6] === b });
      }
      let ps = [pozo[0]];
      for (const p of r.barajar(pozo.slice(1))) { if (cumplenEn(todos, ps).length <= 1) break; if (cumplenEn(todos, ps.concat(p)).length < cumplenEn(todos, ps).length) ps.push(p); }
      if (cumplenEn(todos, ps).length !== 1 || ps.length > 4) continue;
      const v = sol.indexOf(null);
      const ops = [{ id: 'c', texto: `La ${v + 1}`, correcta: true }];
      for (const j of r.barajar([0, 1, 2, 3, 4, 5].filter(j => j !== v))) { if (ops.length >= 4) break; ops.push(Object.assign({ id: `s${j}`, texto: `La ${j + 1}` }, porQueNoEn(todos, ps, o => o[j] === null, `en la silla ${j + 1} se sienta ${sol[j]}`))); }
      ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero al probar cada silla queda un solo arreglo.' });
      return { pregunta: `${lista(gente)} se sientan en una mesa redonda de 6 sillas numeradas; una queda vacía. ¿Cuál?`,
        datos: [D_NUM(6), D_DER, ...PIS(...ps.map(p => p.t))], dibujo: figRonda(6), opciones: ops,
        solucion: { texto: `Al probar cada silla queda un arreglo, el de la figura: la silla ${v + 1} queda vacía.`,
          dibujo: figRonda(6, { sentados: sentar(sol), marcas: [{ s: v, seguro: true }] }) } };
    }
    throw new Error('ahoraFrente: no se armó un caso');
  }

  // ---------- Ejemplos resueltos de «Frente a frente» ----------
  // Recalculados aparte (scratchpad e5-rm/f3/v6.py, 43 comprobaciones): la silla de enfrente en la cuadrada se busca con
  // coordenadas (la misma x del otro borde, o la misma y del otro costado) y coincide con la fórmula de la unidad para 1, 2
  // y 3 sillas por lado; después cada ejemplo por fuerza bruta. 1 la 5 · 2 la 8 · 3 ninguna · 4 la 3 · 5 la 9 · 6 Dina ·
  // 7 la 3 · 8 la 2 · 9 Maru · 10 la 4 · 11 Fito · 12 Omar · 13 la 6 (con la derecha al revés, la 4; media vuelta de la
  // 1, la 5) · 14 la 8 (media vuelta 7 y su izquierda 6; derecha de Iván, 10) · 15 «Hugo a la derecha de Fito», en las 3
  // mesas (auditoría, 19 nov: Ana cabe junto a Iván, junto a Hugo o junto a Eva). La figura: la mesa con sus números y quien tiene silla dada; nunca lo que se deduce.
  const RD = (n, sentados) => figRonda(n, sentados ? { sentados } : {});
  const CQ = (k, sentados) => figCuad(k, sentados ? { sentados } : {});
  const D_FRENTE = '«Frente a»: la silla que se mira al cruzar la mesa.';
  const D_NQ = n => `${n} sillas numeradas contra el reloj desde la de abajo a la izquierda.`;
  const EJEMPLOS_FRENTE = [
    { nivel: 1, titulo: 'Media vuelta', figura: RD(6),
      enunciado: 'En una mesa redonda de 6 sillas numeradas en orden, ¿qué silla queda frente a la 2?',
      datos: [D_NUM(6), D_FRENTE],
      solucion: [{ texto: ['En la redonda con sillas pares, enfrente está a media vuelta: la mitad de 6 son 3 sillas más allá. ', F('La 5'), '.'], ecuacion: ['2 + 3 = ', F('5')] }],
      respuesta: [F('La silla 5')] },
    { nivel: 1, titulo: 'Frente en la cuadrada', figura: CQ(2),
      enunciado: 'En una mesa cuadrada de carpetas, con dos sillas por lado y numeradas del 1 al 8, ¿qué silla queda frente a la 3?',
      datos: [D_NQ(8), D_FRENTE],
      solucion: [{ texto: ['La 3 está en el lado derecho, abajo. Al cruzar la mesa se llega al lado izquierdo, abajo: la ', F('8'), '.'] }],
      respuesta: [F('La silla 8')] },
    { nivel: 1, titulo: 'Con sillas impares', figura: RD(5),
      enunciado: 'En una mesa redonda de 5 sillas numeradas en orden, ¿qué silla queda frente a la 1?',
      datos: [D_NUM(5), D_FRENTE],
      solucion: [{ texto: ['Media vuelta desde la 1 cae entre la 3 y la 4: con un número impar de sillas, ', F('ninguna'), ' queda justo enfrente.'] }],
      respuesta: [F('Ninguna'), ': la media vuelta cae entre dos sillas'] },
    { nivel: 1, titulo: 'El mismo lado', figura: CQ(2),
      enunciado: 'En la mesa cuadrada de dos sillas por lado, numeradas del 1 al 8, ¿qué silla comparte el lado con la 4?',
      datos: [D_NQ(8)],
      solucion: [{ texto: ['Las sillas 3 y 4 están en el lado derecho. La 4 comparte su lado con la ', F('3'), '; la 5 ya está en el lado de arriba.'] }],
      respuesta: [F('La silla 3')] },
    { nivel: 1, titulo: 'Doce sillas', figura: CQ(3),
      enunciado: 'Una mesa cuadrada más grande tiene tres sillas por lado, numeradas del 1 al 12. ¿Qué silla queda frente a la 1?',
      datos: [D_NQ(12), D_FRENTE],
      solucion: [{ texto: ['La 1 está abajo, a la izquierda. Al cruzar la mesa se llega arriba, a la izquierda: la ', F('9'), ', no la 7, que está a media vuelta.'] }],
      respuesta: [F('La silla 9')] },
    { nivel: 2, titulo: 'Frente con nombres', figura: figMesa(6, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro, Dina, Eva y Fito almuerzan en una mesa redonda de 6 sillas. ¿Quién se sienta frente a Ciro?',
      datos: [D_MESA(6), D_DER, ...PIS('Beto se sienta frente a Ana.', 'Ciro se sienta a la derecha de Ana.', 'Dina se sienta a la derecha de Beto.', 'Eva se sienta junto a Ciro.')],
      solucion: [
        { texto: 'Con Ana abajo, contra el reloj: Ciro en la siguiente, Beto a media vuelta y Dina justo después de Beto.' },
        { texto: 'Quedan dos sillas: una junto a Ciro, que es de Eva, y la otra, de Fito.' },
        { texto: ['Ana, Ciro, Eva, Beto, Dina, Fito. A media vuelta de Ciro se sienta ', F('Dina'), '.'] },
      ],
      respuesta: [F('Dina')] },
    { nivel: 2, titulo: 'La silla vacía', figura: RD(6, [{ s: 0, t: 'Rosa' }]),
      enunciado: 'Rosa, Iván, Nora, Leo y Maru se sientan en una mesa redonda de 6 sillas numeradas; una queda vacía. ¿Cuál?',
      datos: ['6 sillas numeradas contra el reloj desde la de abajo; la derecha de cada uno es la silla siguiente.', ...PIS('Rosa se sienta en la silla 1.', 'Iván se sienta frente a Rosa.', 'Nora se sienta a la derecha de Rosa.', 'Leo se sienta frente a Nora.', 'Maru no se sienta junto a Nora.')],
      solucion: [
        { texto: 'Rosa en la 1 e Iván enfrente, en la 4. Nora en la 2, a la derecha de Rosa, y Leo enfrente de Nora, en la 5.' },
        { texto: ['Quedan la 3 y la 6. Maru no toca a Nora, que está en la 2: va en la 6. Vacía: la ', F('3'), '.'] },
      ],
      respuesta: [F('La silla 3')] },
    { nivel: 2, titulo: 'Ronda de ocho', figura: RD(8, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Beto, Ciro y Dina se sientan en una mesa redonda de 8 sillas numeradas. ¿En qué silla se sienta Dina?',
      datos: [D_NUM(8), D_DER, ...PIS('Ana se sienta en la silla 1.', 'Beto se sienta frente a Ana.', 'Ciro se sienta a la derecha de Beto.', 'Dina se sienta frente a Ciro.')],
      solucion: [
        { texto: 'Frente a la 1, a media vuelta, está la 5: ahí va Beto. A su derecha, la 6, va Ciro.' },
        { texto: ['Media vuelta son 4 sillas: contando 4 hacia atrás desde la 6 se llega a la ', F('2'), ', la de Dina.'], ecuacion: ['6 − 4 = ', F('2')] },
      ],
      respuesta: [F('En la silla 2')] },
    { nivel: 2, titulo: 'Parejas frente a frente', figura: figMesa(6, [{ s: 0, t: 'Rosa' }]),
      enunciado: 'Tres parejas almuerzan en una mesa redonda de 6 sillas: Rosa e Iván, Nora y Leo, Maru y Teo. ¿Quién se sienta entre Leo e Iván?',
      datos: [D_MESA(6), 'Cada uno se sienta frente a su pareja.', ...PIS('Leo se sienta a la derecha de Rosa.', 'Teo se sienta a la izquierda de Rosa.')],
      solucion: [
        { texto: 'Con Rosa abajo, Iván va enfrente, a media vuelta. Leo va a la derecha de Rosa, y Nora, frente a Leo.' },
        { texto: 'Teo va a la izquierda de Rosa, y Maru, frente a Teo: en la silla que queda entre Leo e Iván.' },
        { texto: ['Contra el reloj: Rosa, Leo, Maru, Iván, Nora, Teo. Entre Leo e Iván se sienta ', F('Maru'), '.'] },
      ],
      respuesta: [F('Maru')] },
    { nivel: 2, titulo: 'Cuadrada con nombres', figura: CQ(2, [{ s: 0, t: 'Sara' }]),
      enunciado: 'Sara, Gino, Pía y Omar se sientan en la mesa cuadrada de dos sillas por lado, numeradas del 1 al 8. ¿En qué silla se sienta Omar?',
      datos: [D_NQ(8), D_DER, ...PIS('Sara se sienta en la silla 1.', 'Gino se sienta frente a Sara.', 'Pía se sienta a la derecha de Gino.', 'Omar se sienta frente a Pía.')],
      solucion: [
        { texto: 'Frente a la 1, al cruzar la mesa, está la 6: ahí va Gino. Su derecha es la silla siguiente contra el reloj: Pía, en la 7.' },
        { texto: ['La 7 está en el lado izquierdo, arriba. Al cruzar se llega al lado derecho, arriba: Omar, en la ', F('4'), '.'] },
      ],
      respuesta: [F('En la silla 4')] },
    { nivel: 3, titulo: 'Varones y mujeres', figura: figMesa(6, [{ s: 0, t: 'Ana' }]),
      enunciado: 'Ana, Dina y Eva, y Beto, Ciro y Fito almuerzan en una mesa redonda de 6 sillas, alternando mujer y varón. ¿Quién se sienta frente a Eva?',
      alternativas: ['Beto', 'Ciro', 'Dina', 'Fito', 'Ana'],
      datos: [D_MESA(6), D_DER, 'Mujeres (Ana, Dina y Eva) y varones (Beto, Ciro y Fito), alternados: nunca dos mujeres ni dos varones juntos.', ...PIS('Beto se sienta frente a Ana.', 'Ciro se sienta a la derecha de Ana.', 'Dina no se sienta junto a Ciro.')],
      solucion: [
        { texto: 'Con Ana abajo, Ciro a su derecha y Beto enfrente. Las otras dos sillas de mujer están junto a Ciro y junto a Beto, del otro lado.' },
        { texto: 'Dina no toca a Ciro: va después de Beto. Eva va junto a Ciro, y Fito cierra la vuelta: Ana, Ciro, Eva, Beto, Dina, Fito.' },
        { texto: ['A media vuelta de Eva se sienta ', F('Fito'), '. Beto está frente a Ana, y Dina frente a Ciro; Ciro y Beto son vecinos de Eva.'] },
      ],
      respuesta: [F('D'), ': Fito'] },
    { nivel: 3, titulo: 'Frente a la silla vacía', figura: RD(6, [{ s: 0, t: 'Sara' }]).datos ? figMesa(6, [{ s: 0, t: 'Sara' }]) : null,
      enunciado: 'Sara, Gino, Pía, Omar y Teo almuerzan en una mesa redonda de 6 sillas, y una queda vacía. ¿Quién se sienta frente a la silla vacía?',
      alternativas: ['Teo', 'Omar', 'Gino', 'Pía', 'Sara'],
      datos: [D_MESA(6), D_DER, ...PIS('Gino se sienta frente a Sara.', 'Pía se sienta a la derecha de Gino.', 'Omar no se sienta junto a Pía.', 'Teo se sienta frente a Pía.')],
      solucion: [
        { texto: 'Con Sara abajo, Gino va enfrente y Pía justo después de Gino. Teo va frente a Pía: justo después de Sara.' },
        { texto: 'Quedan dos sillas: una entre Teo y Gino, y otra junto a Pía. Omar no toca a Pía: va entre Teo y Gino.' },
        { texto: ['La vacía es la que sigue a Pía; frente a ella se sienta ', F('Omar'), '. Teo y Gino miran a otras sillas; Pía y Sara son vecinas de la vacía.'] },
      ],
      respuesta: [F('B'), ': Omar'] },
    { nivel: 3, titulo: 'La derecha y enfrente', figura: CQ(2, [{ s: 2, t: 'Lucho' }]),
      enunciado: 'Lucho, Maru, Teo y Vilma se sientan en la mesa cuadrada de dos sillas por lado, numeradas del 1 al 8. ¿En qué silla se sienta Vilma?',
      alternativas: ['La 6', 'La 5', 'La 2', 'La 7', 'La 4'],
      datos: [D_NQ(8), D_DER, ...PIS('Lucho se sienta en la silla 3.', 'Maru se sienta frente a Lucho.', 'Teo se sienta a la derecha de Maru.', 'Vilma se sienta frente a Teo.')],
      solucion: [
        { texto: 'La 3 está en el lado derecho, abajo: enfrente, la 8, de Maru. A la derecha de Maru, la siguiente contra el reloj: la 1, de Teo.' },
        { texto: ['Frente a la 1 está la ', F('6'), ': ahí se sienta Vilma.'] },
        { texto: 'La 5 es la media vuelta de la 1; la 2, su vecina. Con la derecha de Maru al revés, Vilma iría en la 4, y Teo, en la 7.' },
      ],
      respuesta: [F('A'), ': la 6'] },
    { nivel: 3, titulo: 'Doce sillas, tres personas', figura: CQ(3, [{ s: 0, t: 'Rosa' }]),
      enunciado: 'Rosa, Iván y Nora se sientan en una mesa cuadrada de tres sillas por lado, numeradas del 1 al 12. ¿En qué silla se sienta Nora?',
      alternativas: ['La 7', 'La 10', 'La 3', 'La 8', 'La 6'],
      datos: [D_NQ(12), D_DER, ...PIS('Rosa se sienta en la silla 1.', 'Iván se sienta frente a Rosa.', 'Nora se sienta a la izquierda de Iván.')],
      solucion: [
        { texto: 'La 1 está abajo, a la izquierda. Al cruzar la mesa se llega arriba, a la izquierda: Iván, en la 9.' },
        { texto: ['Su izquierda es la silla anterior contra el reloj: Nora, en la ', F('8'), '.'] },
        { texto: 'La 10 es su derecha. La 7 es la media vuelta de la 1, y la 6, la izquierda de la 7. La 3 está en el lado de Rosa.' },
      ],
      respuesta: [F('D'), ': la 8'] },
    { nivel: 3, titulo: 'Ocho sillas, dos vacías', figura: figMesa(8, [{ s: 0, t: 'Eva' }]),
      enunciado: 'Eva, Fito, Gino, Hugo, Iván y Ana se sientan en una mesa redonda de 8 sillas; dos quedan vacías. ¿Cuál es necesariamente verdadera?',
      alternativas: ['Ana se sienta junto a Iván', 'Ana se sienta frente a Gino', 'Hugo se sienta frente a Eva', 'Ana se sienta a la derecha de Hugo', 'Hugo se sienta a la derecha de Fito'],
      datos: [D_MESA(8), D_DER, ...PIS('Fito se sienta frente a Eva.', 'Gino se sienta a la derecha de Eva.', 'Hugo se sienta frente a Gino.', 'Iván se sienta a la izquierda de Fito.')],
      solucion: [
        { texto: 'Con Eva abajo: Fito a media vuelta y Gino a la derecha de Eva. Frente a Gino, la silla que sigue a Fito: la de Hugo.' },
        { texto: ['Hugo queda justo después de Fito, contra el reloj: ', F('Hugo se sienta a la derecha de Fito'), ', siempre.'] },
        { texto: 'Iván va justo antes de Fito. Ana puede ir junto a Iván, junto a Hugo o junto a Eva: quedan 3 mesas, y A y D pasan en una sola.' },
        { texto: 'B y C nunca: frente a Gino está Hugo, y frente a Eva, Fito.' },
      ],
      respuesta: [F('E'), ': Hugo se sienta a la derecha de Fito'] },
  ];
  ideaFrente.ejemplos = EJEMPLOS_FRENTE;

  // La fila de la versión vieja: la usa la mesa «Pistas a elegir» del laboratorio.
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const pos = (p, x) => p.indexOf(x);
  const PISTAS_L = [
    { t: 'Ana está a la izquierda de Beto', ok: p => pos(p, 'Ana') < pos(p, 'Beto') },
    { t: 'Ciro está junto a Beto', ok: p => Math.abs(pos(p, 'Ciro') - pos(p, 'Beto')) === 1 },
    { t: 'Dina está en un extremo', ok: p => [0, 3].includes(pos(p, 'Dina')) },
    { t: 'Ana no está junto a Ciro', ok: p => Math.abs(pos(p, 'Ana') - pos(p, 'Ciro')) !== 1 },
  ];
  // Un tablero con los órdenes que quedan (se ven 4 como máximo); en violeta, el lugar que ya es igual en todos.
  function filaOrdenes(ords, extra = {}) {
    const vis = ords.slice(0, 4);
    const seguro = k => ords.length > 0 && ords.every(p => p[k] === ords[0][k]);
    return {
      columnas: ['1.º', '2.º', '3.º', '4.º'], filas: vis.map((_, k) => `Orden ${k + 1}`).concat(vis.length ? [] : ['—']), ancho: 62,
      celdas: (vis.length ? vis : [['', '', '', '']]).map(p => p.map((x, k) => ({ t: x, color: seguro(k) && ords.length ? 'f' : undefined }))),
      notas: [{ t: extra.nota || (ords.length > 4 ? `Órdenes posibles: ${ords.length} (se ven 4)` : `Órdenes posibles: ${ords.length}`) }],
    };
  }


  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1 (idea 1): sentar a los cuatro con el dedo en la banca, con las pistas del juego y Dina en el puesto 4 como
  // una pista más. Cada control es el puesto de alguien (0: de pie). Si dos eligen el mismo puesto, se sienta el primero
  // de la lista y el otro sigue de pie; al arrastrar a alguien a un puesto ocupado, los dos se cambian.
  const PL1 = [PZ.puesto('Dina', P_DADO)].concat(PJ);
  const LETRA = { Ana: 'a', Beto: 'b', Ciro: 'c', Dina: 'd' };
  const sentadosLab = v => { const ocup = {}; for (const x of G4) { const p = v[LETRA[x]]; if (p > 0 && ocup[p] === undefined) ocup[p] = x; } return ocup; };
  const ordenLab = v => { const ocup = sentadosLab(v); return [1, 2, 3, 4].map(p => ocup[p] || null); };
  const completoLab = v => ordenLab(v).every(Boolean);
  const rotasLab = v => (completoLab(v) ? PL1.map((p, k) => (p.ok(ordenLab(v)) ? null : k + 1)).filter(Boolean) : null);
  function bancaLab(v) {
    const o = ordenLab(v), rotas = rotasLab(v) || [];
    return { escena: 'banca', puestos: 4, nombres: G4, sentados: o.map((t, k) => (t ? { p: k, t } : null)).filter(Boolean),
      pistas: PL1.map((p, k) => ({ t: p.t, nueva: rotas.includes(k + 1) })), lineas: PL1.length };
  }
  const mesaFichas = {
    id: 'sentar-fichas', titulo: 'Sentar con el dedo', pieza: OR,
    consigna: 'Arrastra a cada uno a un puesto de la banca, o usa los controles. Mira qué pistas cumple cada orden.',
    controles: G4.map(x => ({ id: LETRA[x], etiqueta: `Puesto de ${x}`, min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 })),
    dibujo: v => ({ datos: bancaLab(v), estado: {} }),
    lectura: v => { const r = rotasLab(v); if (!r) return [`Faltan ${4 - ordenLab(v).filter(Boolean).length} por sentar`]; return r.length ? [`Se rompe${r.length > 1 ? 'n' : ''} ${r.length > 1 ? 'las pistas' : 'la pista'} ${lista(r.map(String))} (en negrita)`] : ['Cumple las ', F('cuatro pistas')]; },
    invitaciones: [
      { texto: 'Sienta a los cuatro sin romper ninguna pista.', logrado: v => !!rotasLab(v) && !rotasLab(v).length, bien: 'Es el único orden que cumple todo: Ana, Ciro, Beto, Dina.' },
      { texto: 'Sienta a los cuatro rompiendo solo la pista 4.', logrado: v => { const r = rotasLab(v); return !!r && r.length === 1 && r[0] === 4; }, bien: 'Ciro quedó en un extremo: las otras tres pistas no lo impiden.' },
      { texto: 'Sienta a Ana a la izquierda de Beto, pero sin que queden juntos.', logrado: v => { const o = ordenLab(v); return completoLab(v) && o.indexOf('Ana') + 1 < o.indexOf('Beto'); }, bien: '«A la izquierda de» no obliga a ir pegados.' },
      { texto: 'Guarda dos órdenes distintos que cumplan las pistas 1 y 2.', logrado: (v, g) => g.filter(x => completoLab(x) && [0, 1].every(k => PL1[k].ok(ordenLab(x)))).map(x => ordenLab(x).join()).filter((t, i, a) => a.indexOf(t) === i).length >= 2,
        bien: 'Con Dina fija y «a la izquierda de», todavía caben varios órdenes.', testigo: [{ a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 3, c: 2, d: 4 }] },
    ],
    arrastres: G4.map((x, i) => ({ id: `ficha-${LETRA[x]}`, etiqueta: `${x} (arrástralo a un puesto)`,
      donde: v => { const d = bancaLab(v), g = Kit.piezas[OR].geometria(d), s = (d.sentados.find(y => y.t === x) || {}).p; if (s !== undefined) return { x: g.centro(s), y: 66 };
        const espera = G4.filter(y => !d.sentados.some(z => z.t === y)); return { x: 22 + espera.indexOf(x) * 34, y: 66 }; },
      mover: (pt, v) => {
        const d = bancaLab(v), g = Kit.piezas[OR].geometria(d), antes = v[LETRA[x]];
        const p = pt.x < g.x0 - 4 ? 0 : Math.max(1, Math.min(4, Math.floor((pt.x - g.x0) / g.sw) + 1));
        if (p === antes || (p === 0 && !(d.sentados.some(y => y.t === x)))) return {};
        const otro = p > 0 ? sentadosLab(v)[p] : null, cambio = { [LETRA[x]]: p };
        if (otro && otro !== x) cambio[LETRA[otro]] = antes;
        return cambio;
      } })),
  };
  // Mesa 2 (ideas 5 y 6): la mesa redonda de 4 a 8, con Ana (naranja) que se arrastra; la flecha turquesa va hacia su
  // derecha y la línea turquesa cruza la mesa hasta quien está enfrente (si las sillas son pares).
  const NOM8 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gina', 'Hugo'];
  const ronda = v => {
    const n = v.n, g = v.g % n;
    const sentados = Array.from({ length: n }, (_, k) => ({ s: (k + g) % n, t: NOM8[k], ref: k === 0 }));
    return { escena: 'mesa', forma: 'redonda', sillas: n, sentados, flechas: [{ s: g }], frente: n % 2 ? [] : [{ de: g, a: (g + n / 2) % n }] };
  };
  const mesaRonda = {
    id: 'mesa-redonda', titulo: 'Mesa redonda libre', pieza: OR,
    consigna: 'Elige cuántos se sientan y arrastra a Ana: todos giran con ella. Mira quién queda a su derecha y quién enfrente.',
    controles: [
      { id: 'n', etiqueta: 'Personas', min: 4, max: 8, paso: 1, inicio: 6, decimales: 0 },
      { id: 'g', etiqueta: 'Silla de Ana', min: 0, max: 7, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
    ],
    dibujo: v => ({ datos: ronda(v), estado: {} }),
    lectura: v => [`Derecha de Ana: ${NOM8[1]}; enfrente: ${v.n % 2 ? 'nadie, son impares' : NOM8[v.n / 2]}`],
    invitaciones: [
      { texto: 'Gira la mesa hasta que Ana quede en la silla de más arriba.', logrado: v => v.n % 2 === 0 && v.g % v.n === v.n / 2, bien: 'Ana cambió de silla, pero su vecino de la derecha es el mismo.' },
      { texto: 'Haz que Eva quede enfrente de Ana.', logrado: v => v.n === 8, bien: 'Con 8 personas, enfrente queda a media vuelta: cuatro sillas más allá.' },
      { texto: 'Sienta a tanta gente que nadie quede justo enfrente de Ana.', logrado: v => v.n % 2 === 1, bien: 'Con un número impar, la media vuelta cae entre dos sillas.' },
      { texto: 'Guarda dos casos con Ana en sillas distintas. ¿Quién queda a su derecha?', logrado: (v, g) => g.some(x => g.some(y => x.n === y.n && x.g % x.n !== y.g % y.n)),
        bien: 'El mismo vecino en los dos: girar a todos no cambia el orden.' },
    ],
    arrastres: [{ id: 'ana', etiqueta: 'silla de Ana (gira la mesa)', color: 'c-o',
      donde: v => { const g = Kit.piezas[OR].geometria(ronda(v)), p = g.silla(v.g % v.n); return { x: p.x, y: p.y }; },
      mover: (pt, v) => { const s = sillaCerca(ronda(v), pt, -1); return s === v.g % v.n ? {} : { g: s }; } }],
  };
  // Mesa 3 (idea 6): la mesa cuadrada con 1, 2 o 3 sillas por lado; Ana se arrastra; la línea turquesa cruza hasta la
  // silla de enfrente y se señalan las sillas que comparten su lado.
  const cuadLab = v => { const N = 4 * v.k, a = (v.s - 1) % N, lado = Math.floor(a / v.k), mismo = [];
    for (let j = 0; j < v.k; j++) if (lado * v.k + j !== a) mismo.push(lado * v.k + j);
    return { escena: 'mesa', forma: 'cuadrada', porLado: v.k, numeros: numeros(N), sentados: [{ s: a, t: 'Ana', ref: true }], frente: [{ de: a, a: frQ(a, v.k) }], marcas: mismo.map(s => ({ s })) }; };
  const anaCuad = v => (v.s - 1) % (4 * v.k);
  const mesaCuad = {
    id: 'mesa-cuadrada-libre', titulo: 'Mesa cuadrada libre', pieza: OR,
    consigna: 'Elige cuántas sillas hay por lado y arrastra a Ana. La línea cruza hasta quien está enfrente; con marco grueso, las de su lado.',
    controles: [
      { id: 'k', etiqueta: 'Sillas por lado', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      { id: 's', etiqueta: 'Silla de Ana', min: 1, max: 12, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
    ],
    dibujo: v => ({ datos: cuadLab(v), estado: {} }),
    lectura: v => [`Silla ${anaCuad(v) + 1}: enfrente, la ${frQ(anaCuad(v), v.k) + 1}${v.k > 1 ? `; en su lado, ${plural(v.k - 1, 'silla', 'sillas')} más` : '; sola en su lado'}`],
    invitaciones: [
      { texto: 'Con dos sillas por lado, sienta a Ana frente a la silla 3.', logrado: v => v.k === 2 && frQ(anaCuad(v), 2) === 2, bien: 'Frente a la 3 está la 8: se cruza la mesa, no se cuentan sillas.' },
      { texto: 'Deja a Ana sola en su lado de la mesa.', logrado: v => v.k === 1, bien: 'Con una silla por lado, la cuadrada se parece a la redonda de 4.' },
      { texto: 'Busca una silla donde la de enfrente esté justo a media vuelta.', logrado: v => v.k === 3 && frQ(anaCuad(v), 3) === (anaCuad(v) + 6) % 12, bien: 'Con tres por lado, la silla del medio de cada lado coincide con su media vuelta.' },
      { texto: 'Guarda dos mesas distintas con Ana en la silla 1 y compara quién queda enfrente.', logrado: (v, g) => g.some(x => g.some(y => x.k !== y.k && anaCuad(x) === 0 && anaCuad(y) === 0)),
        bien: 'Frente a la 1 cambia con la mesa: depende de cuántas sillas hay por lado.' },
    ],
    arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-o',
      donde: v => { const g = Kit.piezas[OR].geometria(cuadLab(v)), p = g.silla(anaCuad(v)); return { x: p.x, y: p.y }; },
      mover: (pt, v) => { const s = sillaCerca(cuadLab(v), pt, -1); return s === anaCuad(v) ? {} : { s: s + 1 }; } }],
  };

  // Mesa 4 (idea 1): las cuatro pistas de la fila, cada una se pone o se quita: ¿cuántos órdenes deja cada combinación?
  // Sin arrastre: las pistas son frases.
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const ordenesSel = val => permutaciones(GENTE).filter(p => PISTAS_L.every((c, k) => !val['p' + k] || c.ok(p)));
  const nPistas = val => PISTAS_L.filter((_, k) => val['p' + k]).length;
  const TODAS = Object.fromEntries(PISTAS_L.map((_, k) => ['p' + k, 1]));
  // Lo menos que dejan dos pistas juntas, buscado entre todos los pares.
  const MIN_DOS = Math.min(...PISTAS_L.flatMap((_, i) => PISTAS_L.map((_, j) => (i < j ? ordenesSel({ ['p' + i]: 1, ['p' + j]: 1 }).length : Infinity))));
  const mesaPistas = {
    id: 'pistas-a-elegir', titulo: 'Pistas a elegir', pieza: 'rm-tablero',
    consigna: 'Pon o quita cada pista de la fila de cuatro. ¿Qué pistas sobran y cuáles hacen falta?',
    controles: PISTAS_L.map((c, k) => ({ id: 'p' + k, etiqueta: c.t, opciones: SINO })),
    dibujo: val => ({ datos: filaOrdenes(ordenesSel(val)), estado: {} }),
    lectura: val => { const n = PISTAS_L.filter((_, k) => val['p' + k]).length, o = ordenesSel(val).length; return [`${plural(n, 'pista', 'pistas')}: `, plural(o, 'orden posible', 'órdenes posibles')]; },
    // Retos: cuentan con ordenesSel(), el mismo filtro que llena el tablero de órdenes.
    invitaciones: [
      { texto: 'Quita una pista sin que cambie el número de órdenes posibles.',
        logrado: val => nPistas(val) === PISTAS_L.length - 1 && ordenesSel(val).length === ordenesSel(TODAS).length,
        bien: 'Esa pista sobraba: lo que tacha ya lo tachaban las otras.' },
      { texto: 'Quita todas las pistas y mira cuántos órdenes caben en la fila.',
        logrado: val => nPistas(val) === 0,
        bien: `Sin pistas, ${permutaciones(GENTE).length} órdenes: 4 · 3 · 2 · 1. Cada pista va tachando.` },
      { texto: 'Deja solo dos pistas que juntas dejen la menor cantidad de órdenes.',
        logrado: val => nPistas(val) === 2 && ordenesSel(val).length === MIN_DOS,
        bien: 'Dos pistas que tachan cosas distintas rinden más que dos parecidas.' },
      { texto: 'Guarda dos casos con una sola pista cada uno, distintas, y compara sus órdenes.',
        logrado: (val, guardados) => guardados.some(x => guardados.some(y => nPistas(x) === 1 && nPistas(y) === 1
          && PISTAS_L.some((_, k) => x['p' + k] !== y['p' + k]))),
        bien: `Cada una sola deja ${ordenesSel({ p0: 1 }).length} de ${permutaciones(GENTE).length}. Ninguna basta: hacen falta juntas.` },
    ],
  };


  return {
    unidad: 'razonamiento-matematico.ordenamiento-de-informacion',
    version: '0.5.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-orden.js', '/nucleo/kit/piezas/rm-tablero.js'],
    // La tabla de letras de la unidad (molde §0.4): aquí casi no hay letras de fórmula; las personas van por su nombre.
    letras: {},
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso, de 2 a 4 por idea con su `simple`.
    glosario: [
      // Idea 1
      { termino: 'ordenamiento lineal', def: 'Ubicar personas o cosas en una fila, de un extremo al otro, según unas pistas.',
        simple: 'Poner a todos en una fila siguiendo pistas.',
        formas: ['ordenamiento lineal'], ejemplos: [
          'Cuatro amigos en una banca de cuatro puestos, con tres pistas.',
          'Cinco primos que posan en fila para una foto.',
          'Tres parejas en una fila de seis butacas, varón y mujer alternados.'], ver: ['a la izquierda de', 'junto a'] },
      { termino: 'a la izquierda de', def: 'En una fila, en algún puesto anterior, sin decir cuántos puestos hay de por medio.',
        simple: 'En un puesto de número menor; no siempre el de al lado.',
        formas: ['a la izquierda de'], ejemplos: [
          'Eva en el puesto 1 y Fito en el 4: Eva está a la izquierda de Fito.',
          'Ana en el 2 y Beto en el 3: Ana también está a la izquierda de Beto.',
          'Si Ana está a la izquierda de Beto y Beto a la izquierda de Ciro, Ana va antes que Ciro.'], ver: ['inmediatamente', 'junto a'] },
      { termino: 'junto a', def: 'Al lado, sin nadie en medio, sea a la izquierda o a la derecha.',
        simple: 'En el puesto de al lado, de cualquiera de los dos lados.',
        formas: ['junto a'], ejemplos: [
          'Lucho en el puesto 2: junto a Lucho están los puestos 1 y 3.',
          'Quien está en un extremo tiene a una sola persona al lado.',
          'Ana en el 1 y Beto en el 3 no están pegados: Ciro puede sentarse entre los dos.'], ver: ['inmediatamente'] },
      { termino: 'inmediatamente', def: 'Sin nadie en medio: en el lugar de al lado.',
        simple: 'Justo al lado, sin nadie en medio.', ejemplos: [
          'Eva justo a la izquierda de Fito: Eva en el puesto 2 y Fito en el 3.',
          'Con Gino en el puesto 3, quien va justo a su izquierda ocupa el 2.',
          'Quien va justo a la derecha del puesto 4 ocupa el 5.'], ver: ['junto a'] },
      { termino: 'a la derecha de', def: 'Del lado de la mano derecha: en la fila, un puesto mayor; en la mesa, la silla siguiente.',
        formas: ['a la derecha de'], ejemplos: [
          'En la banca, Fito en el 4 está a la derecha de Eva, que está en el 1.',
          'En la mesa, la cuchara de cada uno está a su derecha.',
          'Quien mira al centro tiene a su derecha la silla que sigue contra el reloj.'], ver: ['a la izquierda de', 'sentido antihorario'] },
      // Idea 2
      { termino: 'más arriba que', def: 'En un piso de número mayor, sin decir cuántos pisos hay de por medio.',
        simple: 'En un piso de número mayor; no siempre el de encima.',
        formas: ['más arriba que', 'más abajo que'], ejemplos: [
          'Lucho en el piso 2 y Vilma en el 5: Vilma vive más arriba que Lucho.',
          'Quien vive en el piso 1 no vive más arriba que nadie.',
          '«Más abajo que» es lo mismo al revés: Lucho vive más abajo que Vilma.'], ver: ['bloque'] },
      { termino: 'bloque', def: 'Dos o más personas que una pista amarra a una distancia fija: se mueven juntas.',
        simple: 'Un grupo que sube o baja entero, sin separarse.',
        formas: ['bloque', 'bloques'], ejemplos: [
          '«Teo vive un piso más arriba que Pía» arma un bloque de dos pisos seguidos.',
          'En una carrera, «Leo llegó justo después de Nora» también es un bloque.',
          'Un bloque de cuatro pisos no cabe en un edificio de tres.'], ver: ['más arriba que'] },
      { termino: 'piso vacío', def: 'Piso del edificio donde no vive ninguna de las personas del problema.',
        simple: 'Un piso donde no vive nadie del problema.',
        formas: ['piso vacío', 'pisos vacíos'], ejemplos: [
          'Tres familias en un edificio de cinco pisos dejan dos pisos vacíos.',
          '«El piso 6 está vacío» es una pista: nadie puede ir ahí.',
          'Con un piso vacío, el bloque puede quedar con un hueco de por medio.'] },
      // Idea 3
      { termino: 'comparación', def: 'Pista que dice quién tiene más y quién menos entre dos personas, sin decir cuánto.',
        simple: 'Una pista que dice quién tiene más de algo.',
        formas: ['comparación', 'comparaciones'], ejemplos: [
          '«Rosa es más alta que Leo» es una comparación de tallas.',
          '«Iván sacó menos puntos que Nora» compara puntajes.',
          'Una comparación no dice cuánto mide ni cuánto sacó nadie.'], ver: ['cadena de flechas'] },
      { termino: 'cadena de flechas', def: 'Flechas que se siguen una tras otra, del menor al mayor, y comparan a quienes no estaban comparados.',
        simple: 'Flechas unidas: del menor, pasando por otros, al mayor.',
        formas: ['cadena de flechas'], ejemplos: [
          'Leo → Iván → Rosa: Leo es menor que Rosa, aunque ninguna pista los compare.',
          'Dos flechas que no comparten a nadie no forman una cadena.',
          'Una cadena de cinco personas deja un solo orden.'], ver: ['comparación'] },
      { termino: 'orden de talla', def: 'Una manera de formar a todos del más bajo al más alto que cumple las pistas.',
        simple: 'Una manera de formar a todos, del más bajo al más alto.',
        formas: ['orden de talla', 'órdenes de talla'], ejemplos: [
          'Con tres alumnos y ninguna pista hay 6 órdenes de talla.',
          'La pista «Ana es más alta que Beto» deja la mitad.',
          'Si queda un solo orden de talla, se sabe el lugar de cada uno.'] },
      // Idea 4
      { termino: 'monto', def: 'Cantidad de dinero: lo que trae un sobre o lo que recibe alguien.',
        simple: 'Una cantidad de dinero.',
        formas: ['monto', 'montos'], ejemplos: [
          'Los sobres de la rifa traen montos de 20, 50 y 100 soles.',
          'Dos montos juntos: 20 + 50 = 70 soles.',
          'Si los montos son distintos, nadie recibe lo mismo que otro.'] },
      { termino: 'le lleva', def: 'Es mayor por esa cantidad: si Sara tiene 17 y Gino 14, Sara es 3 años mayor.',
        simple: 'Le gana por esa cantidad.',
        formas: ['le lleva', 'le llevan'], ejemplos: [
          'Teo tiene 16 y Pía 14: Teo le lleva 2 años a Pía.',
          'Si Omar le lleva 5 puntos a Gino, Omar sacó 5 más.',
          'Quien le lleva años a otro es el mayor de los dos.'] },
      { termino: 'suman lo mismo', def: 'Dos pares cuyas cantidades, juntas, dan el mismo total.',
        simple: 'Dos pares que juntos dan el mismo total.',
        formas: ['suman lo mismo', 'suma lo mismo'], ejemplos: [
          '20 + 10 y 18 + 12 suman lo mismo: 30.',
          'Dos barras del mismo largo, partidas en dos trozos cada una.',
          'Si dos pares suman lo mismo, los cuatro juntos suman el doble de un par.'] },
      // Idea 5
      { termino: 'ordenamiento circular', def: 'Ubicar personas alrededor de una mesa redonda, donde no hay primer ni último lugar.',
        simple: 'Poner a todos alrededor de una mesa redonda siguiendo pistas.',
        formas: ['ordenamiento circular'], ejemplos: [
          'Cinco personas almuerzan alrededor de una mesa redonda.',
          'Una ronda de seis amigos en el patio, mirando al centro.',
          'En la mesa redonda nadie está en un extremo.'], ver: ['referencia', 'sentido antihorario'] },
      { termino: 'referencia', def: 'Persona o lugar fijo desde el que se ubica a todos los demás.',
        simple: 'Alguien fijo desde quien se cuenta.',
        ejemplos: [
          'Con Ana fija abajo, «a su derecha» ya señala una sola silla.',
          'Si nadie se fija, girar la mesa daría otra respuesta a «¿en qué silla está?».',
          'Cualquiera sirve de referencia; se elige al que tiene más pistas.'], ver: ['ordenamiento circular'] },
      { termino: 'sentido antihorario', def: 'Giro contrario al de las agujas del reloj.',
        simple: 'Al revés de como giran las agujas del reloj.',
        formas: ['sentido antihorario', 'antihorario', 'contra el reloj'], ejemplos: [
          'Desde las 3, contra el reloj se pasa por las 2, la 1 y las 12…',
          'Visto desde arriba, quien sale de abajo contra el reloj va primero hacia la derecha.',
          'Con el reloj es el otro sentido: desde las 12, a la 1 y a las 2.'], ver: ['a la derecha de'] },
      { termino: 'giro', def: 'Vuelta de una ronda o de una figura alrededor de su centro, sin cambiar su forma.',
        formas: ['giro', 'giros'], ejemplos: [
          'En una mesa de 5, correr a todos una silla es un giro: el orden no cambia.',
          'Con sillas numeradas, un giro sí cambia en qué silla está cada uno.',
          'Cinco giros de una silla en una mesa de 5 dejan a todos donde estaban.'] },
      // Idea 6
      { termino: 'frente a', def: 'En una mesa, en la silla del otro lado: la que se mira cruzando la mesa.',
        simple: 'En la silla que se ve al cruzar la mesa.',
        formas: ['frente a', 'enfrente'], ejemplos: [
          'En una ronda de 6 sillas, frente a la 2 está la 5.',
          'En una mesa de cinco sillas redondas, nadie queda justo enfrente de nadie.',
          'Quien está frente a ti te mira de cara.'], ver: ['media vuelta'] },
      { termino: 'media vuelta', def: 'La mitad de una vuelta completa: en una ronda, la mitad de las sillas más allá.',
        simple: 'La mitad de una vuelta: la mitad de las sillas más allá.',
        formas: ['media vuelta'], ejemplos: [
          'En una ronda de 8 sillas, media vuelta son 4 sillas.',
          'En una ronda de 10, media vuelta desde la 3 llega a la 8.',
          'Con 7 sillas, media vuelta cae entre dos sillas.'], ver: ['frente a'] },
      { termino: 'silla vacía', def: 'Silla de la mesa donde no se sienta ninguna de las personas del problema.',
        simple: 'Una silla donde no se sienta nadie del problema.',
        formas: ['silla vacía', 'sillas vacías'], ejemplos: [
          'Cinco amigos en una mesa de seis sillas dejan una silla vacía.',
          'La silla vacía también tiene vecinos y una silla enfrente.',
          'Dos sillas vacías pueden quedar juntas o separadas.'] },
    ],
    // Laboratorio: sentar a los cuatro de la banca con el dedo, la mesa redonda de 4 a 8 con derecha y enfrente, la
    // cuadrada con 1 a 3 sillas por lado y las pistas de la fila puestas o quitadas una a una.
    laboratorio: [mesaFichas, mesaRonda, mesaCuad, mesaPistas],
    historia: {
      texto: 'En 1854, George Boole publicó Las leyes del pensamiento, donde trató el razonamiento como un cálculo con clases. No inventó los acertijos de asientos, pero ayudó a escribir con precisión cómo una frase reduce las posibilidades. Ordenar es eso: ver qué opciones deja en pie cada pista.',
      pregunta: '¿Cuántos órdenes deja vivos una sola pista?',
      fuente: { titulo: 'George Boole · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/archives/sum2021/entries/boole/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'sentar-fichas': ['orden-lineal'],
      'mesa-redonda': ['orden-circular', 'mesa-cuadrada'],
      'mesa-cuadrada-libre': ['mesa-cuadrada'],
      'pistas-a-elegir': ['orden-lineal'],
    },
    // Orden nuevo (docs/etapa5/propuesta-razonamiento-matematico.md): los ids publicados no cambian; posiciones,
    // comparaciones y con-numeros son nuevas.
    ideas: [ideaFila, ideaPosiciones, ideaComparar, ideaNumeros, circular, ideaFrente],
  };
});
