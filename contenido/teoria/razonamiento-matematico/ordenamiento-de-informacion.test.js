// Pruebas propias de «Ordenamiento de información» (etapa 5: las seis ideas rehechas; la idea 1 en la fase 2 y las ideas 2
// a 6 en la fase 3, con sus pruebas al final del archivo, desde «8. Ideas 2 a 6»).
// Todo se vuelve a resolver aquí con un resolvedor propio, que no usa el código de la unidad: lee las pistas del TEXTO que
// ve el alumno (recuadro «Datos»), prueba todos los órdenes y compara con lo que la unidad afirma.
//   1. El juego: 6 → 3 → 2 → 1 órdenes; el puesto de Beto queda fijo con 2 pistas; la misión y la lectura lo dicen.
//   2. La predicción: 4 órdenes de 24; solo la opción correcta vale en los 4; cada explicación dice la cuenta verdadera.
//   3. La regla: dónde puede ir Beto con cada pista (las tres tiras).
//   4. Los 15 ejemplos: la respuesta y, en los de nivel 3, por qué falla cada alternativa.
//   5. «Ahora tú» en 400 semillas: la opción correcta es la única segura, y lo que dice cada explicación («pasa en uno»,
//      «valdría sin la pista N», «con izquierda y derecha cambiadas», «si obligara a ir pegados») es cierto.
//   6. «Así se resuelve» en 120 semillas: cada puesto que un paso descarta rompe de verdad las pistas que nombra.
//   7. La paleta: las figuras de la idea 1 usan solo tinta, gris y violeta, y ningún texto de la idea usa otro color.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const Kit = require('../../../nucleo/kit/kit.js');
const def = require('./ordenamiento-de-informacion.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const idea = def.ideas.find(i => i.id === 'orden-lineal');
const plano = x => Teoria.plano(x);

// ---------- Resolvedor propio: del texto a los órdenes ----------
const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
const N = '([A-ZÁÉÍÓÚ][a-záéíóúñ]+)';
const LEER = [
  [new RegExp(`^${N} está inmediatamente a la izquierda de ${N}$`), (a, b) => o => o.indexOf(a) + 1 === o.indexOf(b)],
  [new RegExp(`^${N} está inmediatamente a la derecha de ${N}$`), (a, b) => o => o.indexOf(a) - 1 === o.indexOf(b)],
  [new RegExp(`^${N} está a la izquierda de ${N}$`), (a, b) => o => o.indexOf(a) < o.indexOf(b)],
  [new RegExp(`^${N} está a la derecha de ${N}$`), (a, b) => o => o.indexOf(a) > o.indexOf(b)],
  [new RegExp(`^${N} está junto a ${N}$`), (a, b) => o => Math.abs(o.indexOf(a) - o.indexOf(b)) === 1],
  [new RegExp(`^${N} no está junto a ${N}$`), (a, b) => o => Math.abs(o.indexOf(a) - o.indexOf(b)) !== 1],
  [new RegExp(`^${N} está en un extremo$`), a => o => o.indexOf(a) === 0 || o.indexOf(a) === o.length - 1],
  [new RegExp(`^${N} no está en un extremo$`), a => o => o.indexOf(a) > 0 && o.indexOf(a) < o.length - 1],
  [new RegExp(`^${N} (?:está|va) en el puesto (\\d)$`), (a, k) => o => o[+k - 1] === a],
  [new RegExp(`^${N} no puede ir en el puesto (\\d)$`), (a, k) => o => o[+k - 1] !== a],
  [new RegExp(`^${N} no queda a la derecha de ${N}$`), (a, b) => o => o.indexOf(a) !== o.indexOf(b) + 1],
];
function leer(frase) {
  const t = frase.trim().replace(/\.$/, '');
  for (const [re, f] of LEER) { const m = t.match(re); if (m) return f(...m.slice(1)); }
  throw new Error(`no sé leer «${frase}»`);
}
// Lo mismo, leído con un error: 'espejo' cambia izquierda y derecha; 'pegado' lee «a la izquierda de» como «inmediatamente».
const conError = (frase, cual) => (cual === 'espejo' ? frase.replace(/izquierda|derecha/, x => (x === 'izquierda' ? 'derecha' : 'izquierda'))
  : /inmediatamente/.test(frase) ? frase : frase.replace(/está a la (izquierda|derecha) de/, 'está inmediatamente a la $1 de'));
const pistasDe = datos => datos.map(plano).filter(d => /^Pista( \d)?: /.test(d)).map(d => d.replace(/^Pista( \d)?: /, ''));
const genteDe = texto => { const m = plano(texto).match(new RegExp(`^((?:${N}, )*${N} y ${N})`)); return m[1].split(/, | y /); };
const quedan = (gente, frases, cual) => perms(gente).filter(o => frases.every(fr => leer(cual ? conError(fr, cual) : fr)(o)));
const fijos = q => q[0].map((_, k) => k).filter(k => q.every(o => o[k] === q[0][k]));

// ---------- 1. El juego ----------
test('el juego: 6 → 3 → 2 → 1 órdenes, y el puesto de Beto queda fijo con 2 pistas', () => {
  const G = ['Ana', 'Beto', 'Ciro', 'Dina'], dado = 'Dina está en el puesto 4';
  const pistas = n => idea.juega.dibujo({ n }).datos.pistas.map(p => p.t);
  assert.deepEqual(pistas(3), ['Ana está a la izquierda de Beto.', 'Ciro no está junto a Dina.', 'Ciro no está en un extremo.']);
  const cuenta = [0, 1, 2, 3].map(n => quedan(G, [dado].concat(pistas(n))));
  assert.deepEqual(cuenta.map(q => q.length), [6, 3, 2, 1]);
  // Beto fijo: no con 0 ni con 1 pista; sí con 2 (en el puesto 3).
  const beto = q => new Set(q.map(o => o.indexOf('Beto'))).size === 1;
  assert.deepEqual(cuenta.map(beto), [false, false, true, true]);
  assert.equal(cuenta[2][0].indexOf('Beto'), 2);
  for (let n = 0; n <= 3; n++) {
    assert.equal(idea.juega.mision.logrado({ n }), n === 2, `misión con ${n} pistas`);
    const d = idea.juega.dibujo({ n }).datos;
    // La figura tacha justo los órdenes que el resolvedor descarta, y enmarca justo los puestos fijos (sin el dado).
    assert.deepEqual(d.ordenes.filter(o => !o.fuera).map(o => o.a.join()), cuenta[n].map(o => o.join()), `órdenes con ${n} pistas`);
    assert.deepEqual(d.fijos.map(x => x.c), fijos(cuenta[n]).filter(k => k !== 3), `fijos con ${n} pistas`);
    assert.deepEqual(d.sentados.map(x => `${x.t}${x.p}${x.seguro ? '*' : ''}`).sort(), ['Dina3'].concat(fijos(cuenta[n]).filter(k => k !== 3).map(k => `${cuenta[n][0][k]}${k}*`)).sort());
  }
  assert.equal(plano(idea.juega.lectura({ n: 0 })), 'Sin pistas: 6 órdenes; solo coincide el puesto 4, de Dina');
  assert.equal(plano(idea.juega.lectura({ n: 1 })), 'Quedan 3 órdenes; en uno, Ciro se sienta entre Ana y Beto');
  assert.equal(plano(idea.juega.lectura({ n: 2 })), 'Quedan 2 órdenes; en ambos, Beto va en el puesto 3: seguro');
  assert.equal(plano(idea.juega.lectura({ n: 3 })), 'Queda 1 orden: Ana, Ciro, Beto, Dina');
  // Lo que dice la lectura con 1 pista: en un solo orden de los 3, Ana y Beto no van pegados, y en medio va Ciro.
  const sueltos = cuenta[1].filter(o => o.indexOf('Beto') - o.indexOf('Ana') > 1);
  assert.equal(sueltos.length, 1);
  assert.equal(sueltos[0][sueltos[0].indexOf('Ana') + 1], 'Ciro');
  assert.match(plano(idea.juega.mision.bien), /^Con 2 pistas: en los 2 órdenes que quedan, Beto va en el puesto 3\.$/);
});

// ---------- 2. La predicción ----------
test('la predicción: quedan 4 órdenes de 24 y solo «Ciro está entre Ana y Beto» vale en los 4', () => {
  const G = ['Ana', 'Beto', 'Ciro', 'Dina'], q = quedan(G, ['Ciro está junto a Ana', 'Ciro está junto a Beto']);
  assert.equal(perms(G).length, 24);
  assert.equal(q.length, 4);
  assert.match(idea.predice.pregunta, /Ciro está junto a Ana y también junto a Beto\. ¿Qué es seguro\?$/);
  const en = (o, x) => o.indexOf(x);
  const dice = {
    c: o => Math.abs(en(o, 'Ciro') - en(o, 'Ana')) === 1 && Math.abs(en(o, 'Ciro') - en(o, 'Beto')) === 1 && (en(o, 'Ana') - en(o, 'Ciro')) * (en(o, 'Beto') - en(o, 'Ciro')) < 0,
    lado: o => en(o, 'Ana') < en(o, 'Ciro'),
    posible: o => en(o, 'Ciro') === 1,
  };
  const ops = Object.fromEntries(idea.predice.opciones.map(x => [x.id, x]));
  assert.equal(ops.posible.texto, 'Ciro está en el puesto 2');
  assert.equal(q.filter(dice.c).length, 4);
  assert.equal(q.filter(dice.lado).length, 2);
  assert.equal(q.filter(dice.posible).length, 2);
  assert.match(ops.lado.siFuera, /^Pasa en 2 de los 4 órdenes que quedan/);
  assert.match(ops.posible.siFuera, /^Pasa en 2 de los 4 órdenes que quedan; en los otros, Ciro va en el puesto 3\.$/);
  assert.deepEqual([...new Set(q.filter(o => !dice.posible(o)).map(o => en(o, 'Ciro') + 1))], [3]);
  assert.equal(idea.predice.opciones.filter(x => x.correcta).length, 1);
  assert.ok(ops.c.correcta);
  // Mira: los números de sus pasos y lo que dice el último (Dina, siempre en un extremo).
  const pasos = idea.mira.pasos.map(p => plano(p.texto));
  assert.match(pasos[2], /^Quedan 4 órdenes de 24\. En todos, Ciro va en medio: seguro\.$/);
  assert.match(pasos[3], /pasa en 2 de 4: posible, no seguro\.$/);
  assert.ok(q.every(o => en(o, 'Dina') === 0 || en(o, 'Dina') === 3));
  // La figura de Mira trae justo esos 4 órdenes; primero los de Ana a la izquierda de Ciro.
  const filas = idea.mira.datos.ordenes.map(o => ({ a: o.a.map(x => (typeof x === 'object' ? x.t : x)), desde: o.desde }));
  assert.deepEqual(filas.map(x => x.a.join()).sort(), q.map(o => o.join()).sort());
  for (const x of filas) assert.equal(x.desde, dice.lado(x.a) ? 1 : 2);
  // El planteamiento de Predice no trae órdenes; el glosario no afirma lo que afirma un distractor.
  assert.equal(idea.predice.dibujo.datos.ordenes, undefined);
  for (const g of def.glosario) assert.ok(!/de qué lado|no dice/.test(g.simple || ''), g.termino);
});

// ---------- 3. La regla ----------
test('la regla: con Ana en el puesto 2, dónde puede ir Beto con cada una de las tres pistas', () => {
  const G = ['Ana', 'Beto', 'Ciro', 'Dina'], tiras = idea.regla.dibujo.datos.tiras;
  const espera = [['Ana está a la izquierda de Beto', [3, 4]], ['Ana está junto a Beto', [1, 3]], ['Ana está inmediatamente a la izquierda de Beto', [3]]];
  espera.forEach(([frase, puestos], i) => {
    const q = quedan(G, ['Ana está en el puesto 2', frase]);
    assert.deepEqual([...new Set(q.map(o => o.indexOf('Beto') + 1))].sort(), puestos, frase);
    const fig = tiras[i].celdas.map((c, k) => (c && c.t === 'Beto' ? k + 1 : null)).filter(Boolean);
    assert.deepEqual(fig, puestos, `tira ${i + 1}`);
    assert.ok(frase.endsWith(tiras[i].rotulo.replace(/^… /, '')), `rótulo ${i + 1}`);
    for (const c of tiras[i].celdas) if (c && c.t === 'Beto') assert.equal(!!c.seguro, puestos.length === 1);
  });
});

// ---------- 4. Los 15 ejemplos ----------
const EJ = idea.ejemplos;
const orden = (i, gente) => quedan(gente, pistasDe(EJ[i].datos));
test('ejemplos 1 a 10: la respuesta de cada uno, por fuerza bruta', () => {
  assert.equal(EJ.length, 15);
  let q = orden(0, ['Ana', 'Beto', 'Ciro']);
  assert.deepEqual(q, [['Ana', 'Ciro', 'Beto']]); assert.equal(plano(EJ[0].respuesta), 'Ana, Ciro, Beto');
  q = orden(1, ['Rosa', 'Iván', 'Nora', 'Leo']);
  const juntos = q.filter(o => Math.abs(o.indexOf('Rosa') - o.indexOf('Iván')) === 1).length;
  assert.deepEqual([q.length, juntos], [12, 6]);
  assert.match(plano(EJ[1].solucion[2].texto), /^De los 12 órdenes que quedan, en 6 están juntos y en 6 no/);
  assert.ok(q.some(o => o[0] === 'Rosa' && o[3] === 'Iván') && q.some(o => o[0] === 'Rosa' && o[1] === 'Iván'));
  q = orden(2, ['Lucho', 'Maru', 'Teo', 'Vilma']);
  assert.deepEqual([...new Set(q.map(o => o.indexOf('Maru') + 1))].sort(), [1, 3]); assert.equal(plano(EJ[2].respuesta), 'En el puesto 1 o en el 3');
  q = orden(3, ['Ana', 'Beto', 'Ciro']);
  assert.deepEqual(q.map(o => o.join(', ')), ['Ana, Ciro, Beto', 'Beto, Ciro, Ana']);
  assert.equal(plano(EJ[3].respuesta), 'Quedan 2 órdenes: Ana, Ciro, Beto y Beto, Ciro, Ana');
  assert.equal(plano(EJ[3].solucion[1].ecuacion), '6 − 4 = 2');
  assert.equal(EJ[3].figura.datos.ordenes.length, 6);
  q = orden(4, ['Sara', 'Gino', 'Pía', 'Omar']);
  assert.deepEqual([...new Set(q.map(o => o.indexOf('Sara') + 1))], [2]);
  assert.ok(quedan(['Sara', 'Gino', 'Pía', 'Omar'], ['Gino está en el puesto 3', 'Sara está a la izquierda de Gino']).some(o => o[0] === 'Sara'));   // «sin inmediatamente, también en el 1»
  const unicos = [[5, ['Ana', 'Beto', 'Ciro', 'Dina'], 'Ana, Dina, Beto, Ciro', /^Beto: el orden es Ana, Dina, Beto, Ciro$/], [6, ['Rosa', 'Iván', 'Nora', 'Leo'], 'Leo, Nora, Iván, Rosa', /^Iván: el orden es Leo, Nora, Iván, Rosa$/],
    [8, ['Sara', 'Gino', 'Pía', 'Omar'], 'Sara, Pía, Gino, Omar', /^Omar: el orden es Sara, Pía, Gino, Omar$/], [9, ['Ana', 'Beto', 'Ciro', 'Dina'], 'Ciro, Beto, Dina, Ana', /^Dina: el orden es Ciro, Beto, Dina, Ana$/]];
  for (const [i, gente, esperado, resp] of unicos) {
    q = orden(i, gente);
    assert.deepEqual(q.map(o => o.join(', ')), [esperado], `ejemplo ${i + 1}`);
    assert.match(plano(EJ[i].respuesta), resp, `ejemplo ${i + 1}`);
  }
  assert.equal(orden(5, ['Ana', 'Beto', 'Ciro', 'Dina'])[0][2], 'Beto');     // 6: ¿quién está en el puesto 3?
  assert.equal(orden(6, ['Rosa', 'Iván', 'Nora', 'Leo'])[0][2], 'Iván');     // 7: ¿quién está en el puesto 3?
  assert.equal(orden(8, ['Sara', 'Gino', 'Pía', 'Omar'])[0][3], 'Omar');     // 9: ¿quién está en el puesto 4?
  assert.equal(orden(9, ['Ana', 'Beto', 'Ciro', 'Dina'])[0][2], 'Dina');     // 10: junto a Ana (puesto 4) está el puesto 3
  q = orden(7, ['Lucho', 'Maru', 'Teo', 'Vilma']);
  assert.deepEqual(q.map(o => o.join(', ')), ['Lucho, Maru, Vilma, Teo', 'Lucho, Vilma, Maru, Teo']);
  assert.deepEqual(fijos(q), [0, 3]); assert.equal(plano(EJ[7].respuesta), 'Seguros: Lucho en el 1 y Teo en el 4');
});

test('ejemplos 11 a 15 (nivel examen): la respuesta, su letra y por qué falla cada alternativa', () => {
  const letra = (i, texto) => 'ABCDE'[EJ[i].alternativas.indexOf(texto)];
  // 11: un solo orden; puesto 2, Ciro. Con izquierda y derecha cambiadas saldría Ana; Beto valdría sin la pista 3.
  const G5 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'];
  let q = orden(10, G5);
  assert.deepEqual(q.map(o => o.join(', ')), ['Dina, Ciro, Beto, Ana, Eva']);
  assert.equal(letra(10, 'Ciro'), 'C'); assert.match(plano(EJ[10].respuesta), /^C: Ciro; el orden es Dina, Ciro, Beto, Ana, Eva$/);
  assert.deepEqual(quedan(G5, pistasDe(EJ[10].datos), 'espejo').map(o => o[1]), ['Ana']);
  // 12: dos órdenes; solo la B vale en los dos.
  const R5 = ['Rosa', 'Iván', 'Nora', 'Leo', 'Maru'];
  q = orden(11, R5);
  assert.deepEqual(q.map(o => o.join(', ')), ['Maru, Rosa, Iván, Nora, Leo', 'Maru, Rosa, Leo, Iván, Nora']);
  const enTodos = EJ[11].alternativas.map(a => q.filter(leer(a)).length);
  assert.deepEqual(enTodos, [1, 2, 1, 1, 0]);
  assert.equal(letra(11, 'Maru está en el puesto 1'), 'B'); assert.equal(plano(EJ[11].respuesta), 'B: Maru está en el puesto 1');
  // 13: un solo orden; Rosa (14) y Leo (17) en los puestos 1 y 2. 30 sale de sentar juntas a Rosa y Nora; 33, del espejo.
  q = orden(12, R5);
  assert.deepEqual(q.map(o => o.join(', ')), ['Rosa, Leo, Nora, Iván, Maru']);
  const edad = Object.fromEntries([...plano(EJ[12].datos[1]).matchAll(new RegExp(`${N} (\\d+)`, 'g'))].map(m => [m[1], +m[2]]));
  assert.deepEqual(edad, { Rosa: 14, Iván: 15, Nora: 16, Leo: 17, Maru: 18 });
  assert.equal(edad[q[0][0]] + edad[q[0][1]], 31);
  assert.equal(letra(12, '31 años'), 'C'); assert.equal(plano(EJ[12].respuesta), 'C: 31 años'); assert.equal(plano(EJ[12].solucion[2].ecuacion), '14 + 17 = 31');
  const esp = quedan(R5, pistasDe(EJ[12].datos), 'espejo');
  assert.equal(esp.length, 1); assert.equal(edad[esp[0][0]] + edad[esp[0][1]], 33);
  assert.equal(edad.Rosa + edad.Nora, 30);
  // 14: tres parejas alternadas, cada uno junto a su pareja: un solo orden; puesto 4, Eva.
  const G6 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'], mujer = new Set(['Ana', 'Dina', 'Eva']), pareja = { Ana: 'Beto', Beto: 'Ana', Dina: 'Ciro', Ciro: 'Dina', Eva: 'Fito', Fito: 'Eva' };
  assert.match(plano(EJ[13].datos[1]), /^Parejas: Ana y Beto, Dina y Ciro, Eva y Fito\./);
  const base = perms(G6).filter(o => o.every((x, i) => i === 0 || mujer.has(x) !== mujer.has(o[i - 1])) && o.every(x => Math.abs(o.indexOf(x) - o.indexOf(pareja[x])) === 1));
  assert.equal(base.length, 12);
  q = base.filter(o => pistasDe(EJ[13].datos).every(fr => leer(fr)(o)));
  assert.deepEqual(q.map(o => o.join(', ')), ['Beto, Ana, Fito, Eva, Ciro, Dina']);
  assert.equal(letra(13, 'Eva'), 'B'); assert.match(plano(EJ[13].respuesta), /^B: Eva; el orden es Beto, Ana, Fito, Eva, Ciro, Dina$/);
  // Lo que dice el resuelto: con Dina en el puesto 1 no hay orden; cada pareja ocupa 1-2, 3-4 o 5-6.
  assert.ok(base.every(o => [0, 2, 4].every(i => pareja[o[i]] === o[i + 1])));
  assert.equal(base.filter(o => o[0] === 'Dina' && pistasDe(EJ[13].datos).every(fr => leer(fr)(o))).length, 0);
  // 15: la foto de frente. Las pistas hablan de la derecha de cada uno; en la foto se dan vuelta.
  const S4 = ['Sara', 'Gino', 'Pía', 'Omar'];
  assert.match(plano(EJ[14].datos[0]), /la derecha de cada uno es la izquierda de quien mira la foto/);
  q = quedan(S4, pistasDe(EJ[14].datos), 'espejo');     // en la foto: cada izquierda y derecha, al revés
  assert.deepEqual(q.map(o => o.join(', ')), ['Gino, Sara, Omar, Pía']);
  assert.equal(letra(14, 'Gino'), 'C');
  assert.deepEqual(quedan(S4, pistasDe(EJ[14].datos)).map(o => o[0]), ['Pía']);   // «sin dar vuelta las pistas saldría Pía»
  assert.match(plano(EJ[14].respuesta), /^C: Gino; sin dar vuelta las pistas saldría Pía$/);
  // La letra de la respuesta no es siempre la misma.
  assert.ok(new Set([10, 11, 12, 13, 14].map(i => plano(EJ[i].respuesta)[0])).size >= 2);
});

test('ejemplos: la figura es el planteamiento (lo que cada pista pone sola) y los datos traen las pistas, una por línea', () => {
  for (const [i, e] of EJ.entries()) {
    const d = e.figura.datos, ps = pistasDe(e.datos);
    assert.ok(ps.length >= 1, `ejemplo ${i + 1}: sin pistas en los datos`);
    assert.ok(!/Pista/.test(plano(e.enunciado)), `ejemplo ${i + 1}: pistas en el enunciado`);
    // Un nombre en la tira (o un sentado en la banca) sale de una pista «está en el puesto k»; uno posible, de «extremo».
    const dados = Object.fromEntries(ps.map(p => p.match(new RegExp(`^${N} está en el puesto (\\d)`))).filter(Boolean).map(m => [+m[2] - 1, m[1]]));
    const enFigura = d.escena ? Object.fromEntries((d.sentados || []).map(x => [x.p, x.t])) : Object.fromEntries((d.fila || []).map((x, k) => [k, x]).filter(([, x]) => x && typeof x !== 'object'));
    assert.deepEqual(enFigura, dados, `ejemplo ${i + 1}: la figura ubica a alguien que ninguna pista ubica (o al revés)`);
    for (const [k, x] of (d.fila || []).entries()) if (x && typeof x === 'object') {
      assert.ok(x.posible && !x.seguro, `ejemplo ${i + 1}`);
      const ext = ps.some(p => p.startsWith(`${x.t} está en un extremo`)), noExt = ps.some(p => p.startsWith(`${x.t} no está en un extremo`));
      assert.ok(ext ? k === 0 || k === d.fila.length - 1 : noExt && k > 0 && k < d.fila.length - 1, `ejemplo ${i + 1}: «${x.t}» posible en el puesto ${k + 1}`);
    }
    assert.ok(!(d.fijos || []).length && !(d.ordenes || []).some(o => o.fuera), `ejemplo ${i + 1}: la figura trae la respuesta`);
  }
});

// ---------- 5. «Ahora tú» ----------
const AFIRMA = [
  [new RegExp(`^${N} va en el puesto (\\d)$`), (a, k) => o => o[+k - 1] === a],
  [new RegExp(`^${N} está en un extremo$`), a => o => o.indexOf(a) === 0 || o.indexOf(a) === o.length - 1],
  [new RegExp(`^${N} está en el puesto (\\d)$`), (a, k) => o => o[+k - 1] === a],
  [new RegExp(`^${N} está a la izquierda de ${N}$`), (a, b) => o => o.indexOf(a) < o.indexOf(b)],
  [new RegExp(`^${N} está junto a ${N}$`), (a, b) => o => Math.abs(o.indexOf(a) - o.indexOf(b)) === 1],
];
const afirma = t => { for (const [re, f] of AFIRMA) { const m = t.match(re); if (m) return f(...m.slice(1)); } return null; };
test('«Ahora tú» (400 semillas): la correcta es la única segura y cada explicación dice una cuenta verdadera', () => {
  const vistos = { RMP72: 0, RMP63: 0, RMP77: 0, RMP78: 0, RMP88: 0, RMP140: 0 }, tipos = [0, 0, 0, 0];
  for (let s = 0; s < 400; s++) {
    const c = idea.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta), gente = genteDe(preg), frases = pistasDe(c.datos);
    assert.ok(frases.length >= 2 && frases.length <= 4, `${d}: ${frases.length} pistas`);
    assert.match(plano(c.datos[0]), new RegExp(`^Fila de ${gente.length} puestos, numerados de izquierda a derecha`), d);
    const q = quedan(gente, frases);
    // Ninguna pista sobra: sin cualquiera de ellas quedan más órdenes.
    frases.forEach((_, i) => assert.ok(quedan(gente, frases.filter((__, j) => j !== i)).length > q.length, `${d}: sobra la pista ${i + 1}`));
    const bien = c.opciones.find(x => x.correcta), mal = c.opciones.filter(x => !x.correcta);
    // Qué afirma cada opción, según la pregunta.
    let dice;
    const mPuesto = preg.match(/¿Quién va en el puesto (\d)\?$/), mDer = preg.match(new RegExp(`¿Quién está inmediatamente a la derecha de ${N}\\?$`));
    if (mPuesto) { tipos[1]++; assert.equal(q.length, 1, d); dice = x => (gente.includes(x) ? o => o[+mPuesto[1] - 1] === x : null); }
    else if (mDer) { tipos[2]++; assert.equal(q.length, 1, d); dice = x => (gente.includes(x) ? o => o.indexOf(x) === o.indexOf(mDer[1]) + 1 : null); }
    else { tipos[/¿Qué es seguro\?$/.test(preg) ? 0 : 3]++; assert.ok(q.length === 1 || q.length === 2, `${d}: ${q.length} órdenes`); dice = afirma; }
    assert.ok(dice(plano(bien.texto)), `${d}: no sé leer la correcta «${bien.texto}»`);
    assert.equal(q.filter(dice(plano(bien.texto))).length, q.length, `${d}: la correcta no vale en todos los órdenes`);
    for (const x of mal) {
      const f = dice(plano(x.texto)), sf = plano(x.siFuera);
      vistos[x.error] = (vistos[x.error] || 0) + 1;
      if (!f) { assert.equal(x.error, 'RMP78', `${d}: «${x.texto}»`); continue; }
      const n = q.filter(f).length;
      assert.ok(n < q.length, `${d}: «${x.texto}» también es segura`);
      let m;
      if ((m = sf.match(/^Pasa en uno de los (\d) órdenes que quedan; en el otro, (.+)\.$/))) {
        assert.equal(x.error, 'RMP77', d); assert.deepEqual([+m[1], n], [q.length, 1], d);
        if (m[2] !== 'no') assert.ok(leer(m[2])(q.find(o => !f(o))), `${d}: «${m[2]}» no pasa en el otro orden`);
      } else if ((m = sf.match(/^Sería seguro si «a la (izquierda|derecha) de» obligara a ir pegados\. Solo ordena: quedan (\d) órdenes\.$/))) {
        assert.equal(x.error, 'RMP88', d); assert.deepEqual([+m[2], n], [q.length, 1], d);
        const pg = quedan(gente, frases, 'pegado');
        assert.ok(pg.length >= 1 && pg.every(f), `${d}: con «inmediatamente» no sería seguro`);
        assert.ok(frases.some(fr => fr.includes(`está a la ${m[1]} de`)), d);
      } else if ((m = sf.match(/^Valdría sin la pista (\d)\. Con todas, (.+)\.$/))) {
        assert.equal(x.error, 'RMP72', d); assert.equal(n, 0, d);
        assert.ok(quedan(gente, frases.filter((_, j) => j !== +m[1] - 1)).some(f), `${d}: sin la pista ${m[1]} tampoco vale «${x.texto}»`);
        if (m[2] !== 'ningún orden lo cumple') assert.ok(q.every(leer(m[2])), `${d}: «${m[2]}»`);
      } else if ((m = sf.match(/^Tendrías que saltarte dos pistas: con todas, (.+)\.$/))) {
        assert.equal(x.error, 'RMP63', d); assert.equal(n, 0, d);
        frases.forEach((_, i) => assert.ok(!quedan(gente, frases.filter((__, j) => j !== i)).some(f), `${d}: valdría sin la pista ${i + 1}`));
      } else if ((m = sf.match(new RegExp(`^Sería ${N} con izquierda y derecha cambiadas\\.`)))) {
        assert.equal(x.error, 'RMP140', d); assert.equal(m[1], plano(x.texto), d);
        const esp = quedan(gente, frases, 'espejo');
        assert.ok(esp.length === 1 && f(esp[0]), `${d}: con izquierda y derecha cambiadas no sale ${m[1]}`);
      } else if ((m = sf.match(new RegExp(`^${N} está a su izquierda\\. La derecha de ${N} es la tuya`)))) {
        assert.equal(x.error, 'RMP140', d); assert.equal(m[1], plano(x.texto), d);
        assert.equal(q[0].indexOf(m[1]), q[0].indexOf(m[2]) - 1, d);
      } else assert.fail(`${d}: explicación sin comprobar: «${sf}»`);
    }
    // La solución dice cuántos órdenes quedan y nombra el orden (o lo seguro) que da el resolvedor.
    const sol = plano(c.solucion.texto);
    if (q.length === 1) assert.ok(sol.includes(q[0].join(', ')), `${d}: «${sol}»`); else assert.match(sol, /^Quedan 2 órdenes y en los dos, /, d);
    const mas = sol.match(/También: (.+)\.$/);
    if (/¿Qué es seguro\?$/.test(preg)) {
      const dados = frases.map(fr => fr.match(/está en el puesto (\d)/)).filter(Boolean).map(m => +m[1] - 1);
      const seg = fijos(q).filter(k => !dados.includes(k)).map(k => `${q[0][k]}${k + 1}`).sort();
      const dichos = [plano(bien.texto).replace(/^(\S+) va en el puesto (\d)$/, '$1$2')].concat(mas ? mas[1].split(/, | y /).map(t => t.replace(/^(\S+) en el (\d)$/, '$1$2')) : []).sort();
      assert.deepEqual(dichos, seg, `${d}: la solución no nombra justo los puestos seguros`);
    }
    // La figura de la solución: los órdenes del resolvedor y sus puestos fijos.
    assert.deepEqual(c.solucion.dibujo.datos.ordenes.map(o => o.a.join()).sort(), q.map(o => o.join()).sort(), d);
  }
  assert.deepEqual(tipos, [100, 100, 100, 100]);
  for (const k of ['RMP72', 'RMP77', 'RMP78', 'RMP140']) assert.ok(vistos[k] > 20, `${k} sale ${vistos[k]} veces`);
});

// ---------- 6. «Así se resuelve» ----------
test('«Así se resuelve» (120 semillas): cada puesto descartado rompe de verdad las pistas que el paso nombra, y el orden final es el único', () => {
  const formas = { larga: 0, corta: 0, general: 0 };
  for (let s = 0; s < 120; s++) {
    const c = idea.resuelve.generar(s), d = `semilla ${s}`, gente = genteDe(c.enunciado), frases = pistasDe(c.datos), fs = frases.map(leer);
    const q = quedan(gente, frases), todos = perms(gente);
    assert.equal(q.length, 1, d);
    assert.equal(plano(c.respuesta), q[0].join(', '), d);
    assert.ok(c.pasos.length <= 6 && c.pasos[0].tipo === 'pide' && c.pasos[1].tipo === 'regla', d);
    // Quién tiene puesto desde el inicio: lo dice una pista «está en el puesto k».
    const puesto = {};
    for (const fr of frases) { const m = fr.match(new RegExp(`^${N} está en el puesto (\\d)`)); if (m) puesto[m[1]] = +m[2] - 1; }
    const conLosPuestos = () => todos.filter(o => Object.entries(puesto).every(([x, k]) => o[k] === x));
    const libres = () => gente.map((_, k) => k).filter(k => !Object.values(puesto).includes(k));
    const ap = c.pasos.filter(p => p.tipo === 'aplica');
    for (const [i, p] of ap.entries()) {
      const t = plano(p.texto);
      let m;
      if ((m = t.match(new RegExp(`^Para ${N} y ${N} quedan los puestos (\\d) y (\\d); al revés se rompe la pista (\\d)\\.$`)))) {
        assert.equal(i, ap.length - 1, d);
        assert.deepEqual(libres(), [+m[3] - 1, +m[4] - 1], `${d}: no son los dos puestos libres`);
        assert.ok(q[0][+m[3] - 1] === m[1] && q[0][+m[4] - 1] === m[2], d);
        const alReves = q[0].map((x, k) => (x === m[1] ? m[2] : x === m[2] ? m[1] : x));
        assert.ok(!fs[+m[5] - 1](alReves), `${d}: al revés no se rompe la pista ${m[5]}`);
        assert.equal(plano(p.ecuacion), q[0].join(', '), d);
        continue;
      }
      let x, va;
      if ((m = t.match(new RegExp(`^${N} solo cabe en el (\\d): en los otros puestos libres se rompe alguna pista\\.$`)))) {
        formas.general++; [, x, va] = m;
        for (const k of libres()) if (k !== +va - 1) assert.ok(!conLosPuestos().some(o => o[k] === x && fs.every(f => f(o))), `${d}: ${x} sí cabe en el ${k + 1}`);
      } else {
        m = t.match(new RegExp(`^(?:Pruebo a ${N}(?:, que sale en (\\d) pistas)?\\. )?(?:Ahora )?${N}:? no va en el .*: va en el (\\d)\\.$`));
        assert.ok(m, `${d}: paso sin comprobar: «${t}»`);
        x = m[3]; va = m[4];
        if (m[1]) assert.equal(m[1], x, d);
        if (m[2]) assert.equal(+m[2], frases.filter(fr => new RegExp(`\\b${x}\\b`).test(fr)).length, `${d}: en cuántas pistas sale ${x}`);
        const dichos = [];
        for (const g of t.matchAll(/(?:no va|ni) en el ([\d, yel]+) \(([^)]+)\)/g)) {
          const ks = g[1].match(/\d/g).map(k => +k - 1), cuales = g[2].match(/\d/g).map(a => +a - 1);
          formas[/rompe/.test(g[2]) ? 'larga' : 'corta']++;
          assert.equal(/ o /.test(g[2]), cuales.length > 1, d);
          for (const k of ks) {
            dichos.push(k);
            const aqui = conLosPuestos().filter(o => o[k] === x);
            assert.ok(!aqui.some(o => cuales.every(a => fs[a](o))), `${d}: con ${x} en el ${k + 1} sí se cumplen las pistas ${cuales.map(a => a + 1)}`);
            // Si el paso dice «la 1 o la 3», ninguna de las dos se rompe sola.
            if (cuales.length > 1) for (const a of cuales) assert.ok(aqui.some(fs[a]), `${d}: la pista ${a + 1} se rompe sola con ${x} en el ${k + 1}`);
          }
        }
        assert.deepEqual(dichos.sort(), libres().filter(k => k !== +va - 1), `${d}: no descarta justo los otros puestos libres de ${x}`);
      }
      assert.equal(q[0].indexOf(x), +va - 1, `${d}: ${x} no va en el ${va}`);
      puesto[x] = +va - 1;
      // La figura del paso trae a los ya ubicados, cada uno en su puesto.
      assert.deepEqual(p.dibujo.datos.fila.map(y => (y && typeof y === 'object' ? y.t : y)), q[0].map((y, k) => (puesto[y] === k ? y : null)), d);
    }
    assert.equal(Object.keys(puesto).length, gente.length - 2, `${d}: al final faltan dos`);
    // ¿Tiene sentido?: si nombra a dos que no quedaron pegados, es cierto y lo dice una pista que solo ordena.
    const ult = c.pasos[c.pasos.length - 1];
    const sen = ult.tipo === 'sentido' && plano(ult.texto).match(new RegExp(`${N} quedó a la (izquierda|derecha) de ${N} sin ir pegados`));
    if (sen) {
      assert.ok(Math.abs(q[0].indexOf(sen[1]) - q[0].indexOf(sen[3])) > 1, d);
      assert.ok(frases.includes(`${sen[1]} está a la ${sen[2]} de ${sen[3]}.`), d);
    }
  }
  // Casi todos los pasos dicen qué pista se rompe; la frase general es la excepción.
  assert.ok(formas.general * 8 < formas.larga + formas.corta, JSON.stringify(formas));
});

// ---------- 7. La paleta y el contrato de la idea 1 ----------
test('la idea 1 usa solo violeta (lo seguro y lo pedido): ni naranja, ni turquesa, ni verde, ni carmín, en figuras y textos', () => {
  const colores = new Set();
  const ir = x => { if (Array.isArray(x)) x.forEach(ir); else if (x && typeof x === 'object') { if (typeof x.v === 'string') colores.add(x.v); if (typeof x.color === 'string') colores.add(x.color); Object.values(x).forEach(ir); } };
  ir(idea.lee); ir(idea.juega.leyenda); ir(idea.predice); ir(idea.mira); ir(idea.regla); ir(idea.ejemplos);
  for (let s = 0; s < 40; s++) { ir(idea.ahoraTu.generar(s)); ir(idea.resuelve.generar(s)); }
  for (let n = 0; n <= 3; n++) ir(idea.juega.lectura({ n }));
  assert.deepEqual([...colores], ['c-f']);
  const P = Kit.piezas['rm-orden'];
  for (let n = 0; n <= 3; n++) assert.ok(!/var\(--c-[oidh]\)/.test(P.dibujar(idea.juega.dibujo({ n }).datos, {})));
});

// ---------- 8. Ideas 2 a 6: un resolvedor propio que lee el texto ----------
// Cada pista se lee del texto que ve el alumno (los datos), se arman todos los arreglos (pisos con huecos, órdenes de
// llegada, tallas o edades, repartos de valores, mesas con una persona fija o con sillas numeradas) y se compara con lo
// que la unidad afirma: la opción correcta vale en todos los arreglos que quedan, cada incorrecta falla en alguno, y la
// respuesta de «Así se resuelve» es la única.
const IDEA = id => def.ideas.find(i => i.id === id);
const NUMS = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };
const conHuecos = (gente, n) => { const out = [], ir = (pre, resto) => { if (pre.length === n) { if (!resto.length) out.push(pre); return; } if (n - pre.length > resto.length) ir(pre.concat(null), resto); resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1)))); }; ir([], gente); return out; };
const L = (o, x) => o.indexOf(x) + 1;
const LEER2 = [
  [new RegExp(`^${N} vive (un|dos|tres|cuatro|cinco) pisos? más (arriba|abajo) que ${N}$`), (a, k, d, b) => o => (L(o, a) - L(o, b)) * (d === 'arriba' ? 1 : -1) === NUMS[k]],
  [new RegExp(`^${N} vive más (arriba|abajo) que ${N}$`), (a, d, b) => o => (d === 'arriba' ? L(o, a) > L(o, b) : L(o, a) < L(o, b))],
  [new RegExp(`^${N} vive en el piso (\\d)$`), (a, p) => o => L(o, a) === +p],
  [new RegExp(`^${N} no vive en el piso (\\d)$`), (a, p) => o => L(o, a) !== +p],
  [/^El piso (\d) está vacío$/, p => o => o[+p - 1] === null],
  [new RegExp(`^${N} y ${N} viven en pisos vecinos$`), (a, b) => o => Math.abs(L(o, a) - L(o, b)) === 1],
  [new RegExp(`^${N} llegó (un|dos|tres|cuatro|cinco) puestos? después que ${N}$`), (a, k, b) => o => L(o, a) - L(o, b) === NUMS[k]],
  [new RegExp(`^${N} llegó justo después de ${N}$`), (a, b) => o => L(o, a) - L(o, b) === 1],
  [new RegExp(`^${N} llegó antes que ${N}$`), (a, b) => o => L(o, a) < L(o, b)],
  [new RegExp(`^${N} llegó en el puesto (\\d)$`), (a, p) => o => L(o, a) === +p],
  [new RegExp(`^${N} no llegó primero$`), a => o => L(o, a) !== 1],
  [new RegExp(`^${N} llegó en el último puesto$`), a => o => L(o, a) === o.length],
];
const leerCon = (tabla, frase) => { const t = frase.trim().replace(/\.$/, ''); for (const [re, f] of tabla) { const m = t.match(re); if (m) return f(...m.slice(1)); } throw new Error(`no sé leer «${frase}»`); };
let vistosBloque = 0;
test('idea 2: el juego, la predicción y «Ahora tú» y «Así se resuelve» en 200 semillas, leídos del texto', () => {
  const I2 = IDEA('posiciones');
  // Juego: con Ana en el piso a, Beto en a + 2; Ciro en el 3. Solo a = 2 cumple todo y cabe.
  const ok = [1, 2, 3, 4, 5].filter(a => a + 2 <= 5 && a !== 3 && a + 2 !== 3);
  assert.deepEqual(ok, [2]);
  for (let a = 1; a <= 5; a++) assert.equal(I2.juega.mision.logrado({ a }), a === 2);
  assert.match(plano(I2.juega.lectura({ a: 4 })), /piso 6: el bloque no cabe/);
  // Predicción: dos casos y dos pisos en medio en los dos.
  const q = conHuecos(['Eva', 'Fito'], 5).filter(o => L(o, 'Fito') - L(o, 'Eva') === 3);
  assert.deepEqual([...new Set(q.map(o => L(o, 'Fito') - L(o, 'Eva') - 1))], [2]);
  assert.equal(plano(I2.predice.opciones.find(x => x.correcta).texto), 'Dos');
  // «Mira» narra los casos en el orden en que se dibujan: el caso 1 con Eva en el 1 y Fito en el 4; el 2, en el 2 y el 5.
  const casosMira = I2.mira.datos.edificios.map(e => [e.ocupa.find(x => x.t === 'Eva').piso, e.ocupa.find(x => x.t === 'Fito').piso]);
  assert.deepEqual(casosMira, [[1, 4], [2, 5]]);
  assert.match(plano(I2.mira.pasos[0].texto), /^Eva en el 1: Fito, tres pisos más arriba, en el 4\.$/);
  assert.match(plano(I2.mira.pasos[1].texto), /^Eva en el 2: Fito en el 5\./);
  for (let s = 0; s < 200; s++) {
    const c = I2.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta), gente = genteDe(preg);
    const k = +((plano(c.datos[0]).match(/(?:Edificio|Carrera) de (\d)/) || [])[1]);
    const fs = pistasDe(c.datos).map(t => leerCon(LEER2, t));
    const qq = conHuecos(gente, k).filter(o => fs.every(f => f(o)));
    assert.ok(qq.length >= 1, `${d}: sin arreglos`);
    let dice;
    let m;
    if ((m = preg.match(new RegExp(`¿En qué piso vive ${N}\\?$`)))) dice = t => { const z = t.match(/^En el piso (\d)$/); return z && (o => L(o, m[1]) === +z[1]); };
    else if ((m = preg.match(new RegExp(`¿Cuántos llegaron entre ${N} y ${N}\\?$`)))) dice = t => (/^\d$/.test(t) ? o => Math.abs(L(o, m[1]) - L(o, m[2])) - 1 === +t : null);
    else if (/¿Qué piso queda vacío\?$/.test(preg)) dice = t => { const z = t.match(/^El piso (\d)$/); return z && (o => o[+z[1] - 1] === null); };
    else dice = t => { let z;
      if ((z = t.match(new RegExp(`^${N} vive en el piso (\\d)$`)))) return o => L(o, z[1]) === +z[2];
      if ((z = t.match(new RegExp(`^${N} vive más arriba que ${N}$`)))) return o => L(o, z[1]) > L(o, z[2]);
      if ((z = t.match(/^El piso (\d) está vacío$/))) return o => o[+z[1] - 1] === null;
      return null; };
    const bien = c.opciones.find(x => x.correcta);
    assert.ok(dice(plano(bien.texto)) && qq.every(dice(plano(bien.texto))), `${d}: la correcta no vale en todos`);
    for (const x of c.opciones.filter(y => !y.correcta)) {
      const f = dice(plano(x.texto));
      if (!f) { assert.equal(x.error, 'RMP78', `${d}: «${x.texto}»`); continue; }
      assert.ok(!qq.every(f), `${d}: «${x.texto}» también vale en todos`);
      if (x.error === 'RMP72') { const j = +plano(x.siFuera).match(/sin la pista (\d)/)[1] - 1; assert.ok(conHuecos(gente, k).filter(o => fs.every((g, i) => i === j || g(o))).some(f), `${d}: sin la pista ${j + 1} tampoco`); }
    }
    const r = I2.resuelve.generar(s), gr = genteDe(r.enunciado), kr = +plano(r.datos[0]).match(/Edificio de (\d)/)[1];
    const fr = pistasDe(r.datos).map(t => leerCon(LEER2, t)), qr = conHuecos(gr, kr).filter(o => fr.every(f => f(o)));
    assert.equal(qr.length, 1, `${d}: «Así se resuelve» con ${qr.length} arreglos`);
    assert.equal(plano(r.respuesta), gr.map(x => `${x} ${L(qr[0], x)}`).join(', '), d);
    // Cada lugar del bloque que el paso descarta rompe de verdad la pista (o el par de pistas) que nombra.
    const bloque = pistasDe(r.datos)[0].match(new RegExp(`^${N} vive (un|dos|tres|cuatro|cinco) pisos? más (arriba|abajo) que ${N}`));
    const [arriba, abajo] = bloque[3] === 'arriba' ? [bloque[1], bloque[4]] : [bloque[4], bloque[1]];
    for (const z of plano(r.pasos[2].texto).matchAll(/en (\d) y (\d) rompe la pista ([\d, ola]+?)(?=;|\.|$)/g)) {
      const cuales = z[3].match(/\d/g).map(k => +k - 1);
      const aqui = conHuecos(gr, kr).filter(o => L(o, abajo) === +z[1] && L(o, arriba) === +z[2]);
      assert.ok(!aqui.some(o => cuales.every(j => fr[j](o))), `${d}: con el bloque en ${z[1]} y ${z[2]} se cumplen las pistas ${z[3]}`);
    }
    assert.ok(!/\?/.test(plano(r.pasos[2].texto)), d);
    vistosBloque += [...plano(r.pasos[2].texto).matchAll(/rompe la pista/g)].length;
  }
});

const LEER3 = [
  [new RegExp(`^${N} es (mayor|menor) que ${N}$`), (a, d, b) => e => (d === 'mayor' ? e[a] > e[b] : e[a] < e[b])],
  [new RegExp(`^${N} es más (alto|alta|bajo|baja) que ${N}$`), (a, d, b) => e => (/alt/.test(d) ? e[a] > e[b] : e[a] < e[b])],
  [new RegExp(`^${N} no es (mayor|menor) que ${N}$`), (a, d, b) => e => (d === 'mayor' ? !(e[a] > e[b]) : !(e[a] < e[b]))],
];
const valores = (gente, empates) => { const out = [], n = gente.length, ir = pre => { if (pre.length === n) { if (empates || new Set(pre).size === n) out.push(Object.fromEntries(gente.map((x, i) => [x, pre[i]]))); return; } for (let v = 1; v <= n; v++) ir(pre.concat(v)); }; ir([]); return out; };
test('idea 3: el juego, la predicción y «Ahora tú» y «Así se resuelve» en 200 semillas, leídos del texto', () => {
  const I3 = IDEA('comparaciones');
  const pistas = n => I3.juega.dibujo({ n }).datos.pistas.map(p => p.t);
  const G = ['Ana', 'Beto', 'Ciro', 'Dina'];
  assert.deepEqual([0, 1, 2, 3].map(n => valores(G, false).filter(e => pistas(n).every(t => leerCon(LEER3, t)(e))).length), [24, 12, 8, 2]);
  assert.ok([0, 1, 2, 3].every(n => I3.juega.mision.logrado({ n }) === (n === 3)));
  // Predicción: «no es más alta» con empates: dos casos, nunca más alta.
  const q = valores(['Eva', 'Fito'], true).filter(e => !(e.Eva > e.Fito));
  assert.ok(q.some(e => e.Eva === e.Fito) && q.some(e => e.Eva < e.Fito) && !q.some(e => e.Eva > e.Fito));
  for (let s = 0; s < 200; s++) {
    const c = I3.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta), gente = genteDe(preg);
    const empates = /mellizos/.test(preg), fs = pistasDe(c.datos).map(t => leerCon(LEER3, t));
    const qq = valores(gente, empates).filter(e => fs.every(f => f(e)));
    const vale = f => (qq.every(f) ? 'siempre' : qq.some(f) ? 'aveces' : 'nunca');
    let m;
    const afirm = t => { let z;
      if ((z = t.match(new RegExp(`^${N} es (mayor|menor) que ${N}$`)))) return e => (z[2] === 'mayor' ? e[z[1]] > e[z[3]] : e[z[1]] < e[z[3]]);
      if ((z = t.match(new RegExp(`^${N} y ${N} tienen la misma edad$`)))) return e => e[z[1]] === e[z[2]];
      return null; };
    const bien = c.opciones.find(x => x.correcta), mal = c.opciones.filter(x => !x.correcta);
    if ((m = preg.match(/¿Quién es el (primero|segundo|tercero|cuarto) contando desde el (mayor|menor)\?$/))) {
      const k = ['primero', 'segundo', 'tercero', 'cuarto'].indexOf(m[1]), pos = e => (m[2] === 'mayor' ? gente.length - 1 - k : k);
      const quien = e => Object.keys(e).sort((a, b) => e[a] - e[b])[pos(e)];
      assert.equal(qq.length, 1, d); assert.equal(plano(bien.texto), quien(qq[0]), d);
      for (const x of mal) if (x.error !== 'RMP78') assert.notEqual(plano(x.texto), quien(qq[0]), d);
    } else if (/¿Cuál no se puede asegurar\?$/.test(preg)) {
      assert.equal(vale(afirm(plano(bien.texto))), 'aveces', d);
      for (const x of mal) assert.equal(vale(afirm(plano(x.texto))), 'siempre', `${d}: «${x.texto}»`);
    } else if (/¿Qué es seguro\?$/.test(preg)) {
      assert.equal(vale(afirm(plano(bien.texto))), 'siempre', d);
      for (const x of mal) assert.notEqual(vale(afirm(plano(x.texto))), 'siempre', `${d}: «${x.texto}»`);
      assert.equal(vale(afirm(plano(mal.find(x => x.error === 'RMP141').texto))), 'aveces', d);
    } else {
      m = preg.match(new RegExp(`¿Cuántos son, con seguridad, mayores que ${N}\\?$`));
      assert.ok(m, `${d}: pregunta sin comprobar «${preg}»`);
      const n = gente.filter(y => y !== m[1] && qq.every(e => e[y] > e[m[1]])).length;
      assert.equal(plano(bien.texto), String(n), d);
      const pos = gente.filter(y => y !== m[1] && qq.some(e => e[y] > e[m[1]])).length;
      assert.equal(plano(mal.find(x => x.error === 'RMP77').texto), String(pos), d);
    }
    const r = I3.resuelve.generar(s), gr = genteDe(r.enunciado), fr = pistasDe(r.datos).map(t => leerCon(LEER3, t));
    const qr = valores(gr, false).filter(e => fr.every(f => f(e)));
    assert.equal(qr.length, 1, d);
    assert.equal(plano(r.respuesta), Object.keys(qr[0]).sort((a, b) => qr[0][a] - qr[0][b]).join(', '), d);
  }
});

const permsV = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permsV(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
const LEER4 = [
  [new RegExp(`^${N} y ${N} juntos recibieron (\\d+) soles$`), (a, b, v) => e => e[a] + e[b] === +v],
  [new RegExp(`^${N} recibió (más|menos) que ${N}$`), (a, d, b) => e => (d === 'más' ? e[a] > e[b] : e[a] < e[b])],
  [new RegExp(`^Las edades de ${N} y ${N} suman (\\d+) años$`), (a, b, v) => e => e[a] + e[b] === +v],
  [new RegExp(`^${N} es (mayor|menor) que ${N}$`), (a, d, b) => e => (d === 'mayor' ? e[a] > e[b] : e[a] < e[b])],
];
test('idea 4: el juego, la predicción y «Ahora tú» y «Así se resuelve» en 200 semillas, leídos del texto', () => {
  const I4 = IDEA('con-numeros');
  const reparto = (gente, vals) => permsV(vals).map(p => Object.fromEntries(gente.map((x, i) => [x, p[i]])));
  const pj = n => I4.juega.dibujo({ n }).datos.pistas.map(p => p.t);
  assert.deepEqual([0, 1, 2].map(n => reparto(['Ana', 'Beto', 'Ciro'], [20, 50, 100]).filter(e => pj(n).every(t => leerCon(LEER4, t)(e))).length), [6, 2, 1]);
  // Predicción y su tipo de «Ahora tú»: A + B = C + D con edades distintas de 10 a 25.
  const dos = (a, b, c, d, mayor) => { const out = []; for (let x = 10; x <= 25; x++) for (let y = 10; y <= 25; y++) for (let z = 10; z <= 25; z++) { const w = x + y - z; if (w >= 10 && w <= 25 && new Set([x, y, z, w]).size === 4 && (mayor ? x > z : x < z)) out.push({ [a]: x, [b]: y, [c]: z, [d]: w }); } return out; };
  assert.ok(dos('Ana', 'Beto', 'Ciro', 'Dina', true).every(e => e.Beto < e.Dina));
  for (let s = 0; s < 200; s++) {
    const c = I4.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta);
    const bien = c.opciones.find(x => x.correcta), mal = c.opciones.filter(x => !x.correcta);
    let m;
    if ((m = preg.match(new RegExp(`^Las edades de ${N} y ${N} suman lo mismo que las de ${N} y ${N}\\.`)))) {
      const mayor = /es mayor que/.test(plano(c.datos[1])), qq = dos(m[1], m[2], m[3], m[4], mayor);
      const af = t => { const z = t.match(new RegExp(`^${N} es (mayor|menor) que ${N}$`)) || t.match(new RegExp(`^${N} y ${N} tienen la misma edad$`)); if (!z) return null; return z.length === 4 ? e => (z[2] === 'mayor' ? e[z[1]] > e[z[3]] : e[z[1]] < e[z[3]]) : e => e[z[1]] === e[z[2]]; };
      assert.ok(qq.every(af(plano(bien.texto))), d);
      for (const x of mal) { const f = af(plano(x.texto)); if (f) assert.ok(!qq.some(f), `${d}: «${x.texto}» puede pasar`); else assert.equal(x.error, 'RMP78', d); }
      continue;
    }
    const lista3 = preg.match(/con ([\d, y]+) soles|tienen ([\d, y]+) años/);
    const vals = (lista3[1] || lista3[2]).split(/, | y /).map(Number);
    const gente = (preg.match(/uno para cada uno: (.+?)\. ¿/) || preg.match(/^(.+?) tienen [\d, y]+ años/))[1].split(/, | y /);
    const fs = pistasDe(c.datos).map(t => leerCon(LEER4, t)), qq = reparto(gente, vals).filter(e => fs.every(f => f(e)));
    if ((m = preg.match(new RegExp(`¿Cuánto recibió ${N}\\?$`))) || (m = preg.match(new RegExp(`¿Cuántos años tiene ${N}\\?$`)))) {
      const v = +plano(bien.texto).match(/^(\d+)/)[1];
      assert.ok(qq.length >= 1 && qq.every(e => e[m[1]] === v), d);
      for (const x of mal) { const z = plano(x.texto).match(/^(\d+)/); if (!z) { assert.equal(x.error, 'RMP78', d); continue; } assert.ok(!qq.every(e => e[m[1]] === +z[1]), d); }
    } else {
      m = preg.match(/¿Quién recibió (\d+) soles\?$/);
      assert.ok(m, `${d}: pregunta sin comprobar «${preg}»`);
      assert.equal(qq.length, 1, d);
      assert.equal(qq[0][plano(bien.texto)], +m[1], d);
      for (const x of mal) if (gente.includes(plano(x.texto))) assert.notEqual(qq[0][plano(x.texto)], +m[1], d);
    }
    const r = I4.resuelve.generar(s), vr = plano(r.enunciado).match(/con ([\d, y]+) soles/)[1].split(/, | y /).map(Number);
    const gr = plano(r.enunciado).match(/uno para cada uno: (.+?)\. ¿/)[1].split(/, | y /);
    const qr = reparto(gr, vr).filter(e => pistasDe(r.datos).every(t => leerCon(LEER4, t)(e)));
    assert.equal(qr.length, 1, d);
    assert.equal(plano(r.respuesta), gr.map(x => `${x} ${qr[0][x]}`).join(', '), d);
  }
});

// Mesas: la silla s + 1 es la derecha de quien está en la s, mirando al centro (contra el reloj).
const LEER5 = n => [
  [new RegExp(`^${N} se sienta a la (derecha|izquierda) de ${N}$`), (a, d, b) => o => o.indexOf(a) === (o.indexOf(b) + (d === 'derecha' ? 1 : n - 1)) % n],
  [new RegExp(`^${N} se sienta junto a ${N}$`), (a, b) => o => [1, n - 1].includes((o.indexOf(a) - o.indexOf(b) + n) % n)],
  [new RegExp(`^${N} no se sienta junto a ${N}$`), (a, b) => o => ![1, n - 1].includes((o.indexOf(a) - o.indexOf(b) + n) % n)],
  [new RegExp(`^${N} se sienta entre ${N} y ${N}$`), (a, b, c) => o => [b, c].every(x => [1, n - 1].includes((o.indexOf(a) - o.indexOf(x) + n) % n))],
  [new RegExp(`^${N} se sienta frente a ${N}$`), (a, b) => o => o.indexOf(a) === (o.indexOf(b) + n / 2) % n],
  [new RegExp(`^${N} se sienta en la silla (\\d)$`), (a, k) => o => o.indexOf(a) === +k - 1],
];
const mesasFijas = (gente, n, ref) => conHuecos(gente.filter(x => x !== ref), n - 1).map(o => [ref].concat(o));
test('idea 5: el juego, la predicción y «Ahora tú» y «Así se resuelve» en 200 semillas, leídos del texto', () => {
  const I5 = IDEA('orden-circular');
  // La silla s + 1 queda del lado de la mano derecha de quien está en la s y mira al centro (pantalla: y hacia abajo).
  for (const n of [4, 5, 6, 8]) for (let s = 0; s < n; s++) {
    const a = 2 * Math.PI * s / n, b = 2 * Math.PI * (s + 1) / n;
    assert.ok((Math.sin(b) - Math.sin(a)) * Math.cos(a) + (Math.cos(b) - Math.cos(a)) * -Math.sin(a) > 0);
  }
  assert.ok([1, 2, 3, 4].every(b => I5.juega.mision.logrado({ b }) === (b === 1)));
  // Predicción: Dina arriba (silla 3 de 6); su derecha, la silla 4, queda a la izquierda del dibujo (x < 0).
  assert.ok(Math.sin(2 * Math.PI * 4 / 6) < 0);
  assert.equal(plano(I5.predice.opciones.find(x => x.correcta).texto), 'A la izquierda del dibujo');
  for (let s = 0; s < 200; s++) {
    const c = I5.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta), gente = genteDe(preg), n = gente.length;
    const fs = pistasDe(c.datos).map(t => leerCon(LEER5(n), t)), ref = c.dibujo.datos.sentados[0].t;
    const qq = mesasFijas(gente, n, ref).filter(o => fs.every(f => f(o)));
    const bien = c.opciones.find(x => x.correcta), mal = c.opciones.filter(x => !x.correcta);
    let m, dice;
    if ((m = preg.match(new RegExp(`¿Quién se sienta a la (derecha|izquierda) de ${N}\\?$`)))) dice = t => (gente.includes(t) ? o => o[(o.indexOf(m[2]) + (m[1] === 'derecha' ? 1 : n - 1)) % n] === t : null);
    else if ((m = preg.match(new RegExp(`¿Quién se sienta entre ${N} y ${N}\\?$`)))) dice = t => (gente.includes(t) ? leerCon(LEER5(n), `${t} se sienta entre ${m[1]} y ${m[2]}`) : null);
    else { assert.match(preg, /¿Cuál es necesariamente verdadera\?$/, d); dice = t => { try { return leerCon(LEER5(n), t); } catch (e) { return null; } }; }
    assert.ok(qq.length >= 1 && qq.every(dice(plano(bien.texto))), `${d}: la correcta no vale en todas`);
    for (const x of mal) { const f = dice(plano(x.texto)); if (!f) { assert.equal(x.error, 'RMP78', d); continue; } assert.ok(!qq.every(f), `${d}: «${x.texto}»`); }
    const izq = mal.find(x => x.error === 'RMP140' && m && m[1]);
    if (izq) assert.ok(qq.every(o => o[(o.indexOf(m[2]) + (m[1] === 'derecha' ? n - 1 : 1)) % n] === plano(izq.texto)), `${d}: RMP140 no es el otro vecino`);
    const r = I5.resuelve.generar(s), gr = genteDe(r.enunciado), nr = gr.length, rr = r.dibujo.datos.sentados[0].t;
    const qr = mesasFijas(gr, nr, rr).filter(o => pistasDe(r.datos).every(t => leerCon(LEER5(nr), t)(o)));
    assert.equal(qr.length, 1, d);
    assert.equal(plano(r.respuesta), qr[0].join(', '), d);
  }
});

test('idea 6: el juego, la predicción y «Ahora tú» y «Así se resuelve» en 200 semillas, leídos del texto', () => {
  const I6 = IDEA('mesa-cuadrada');
  // Frente en la cuadrada, con coordenadas: la silla del otro borde con la misma x (o la misma y a los costados).
  const pos = (i, k) => { const lado = Math.floor(i / k), t = (i % k + 0.5) / k; return [[-1 + 2 * t, -1.4], [1.4, -1 + 2 * t], [1 - 2 * t, 1.4], [-1.4, 1 - 2 * t]][lado]; };
  const frenteQ = (i, k) => { const [x, y] = pos(i, k), meta = Math.abs(y) > 1.2 ? [x, -y] : [-x, y]; return [...Array(4 * k).keys()].find(j => Math.hypot(pos(j, k)[0] - meta[0], pos(j, k)[1] - meta[1]) < 1e-9); };
  assert.equal(frenteQ(0, 2) + 1, 6);
  assert.equal(plano(I6.predice.opciones.find(x => x.correcta).texto), 'La 6');
  assert.ok([1, 2, 3, 4, 5, 6, 7, 8].every(s => I6.juega.mision.logrado({ s }) === (s === 3)));
  for (let s = 0; s < 200; s++) {
    const c = I6.ahoraTu.generar(s), d = `semilla ${s}`, preg = plano(c.pregunta);
    const bien = c.opciones.find(x => x.correcta), mal = c.opciones.filter(x => !x.correcta);
    let m;
    if ((m = preg.match(/con (dos|tres) sillas por lado, numeradas del 1 al (\d+)\. ¿Qué silla (queda frente a|comparte el lado con) la (\d+)\?$/))) {
      const k = NUMS[m[1]], i = +m[4] - 1, dice = t => +t.match(/^La (\d+)$/)[1] - 1;
      const correcta = m[3] === 'queda frente a' ? frenteQ(i, k) : [...Array(4 * k).keys()].find(j => j !== i && Math.floor(j / k) === Math.floor(i / k));
      if (m[3] === 'queda frente a') assert.equal(dice(plano(bien.texto)), correcta, d);
      else assert.equal(Math.floor(dice(plano(bien.texto)) / k), Math.floor(i / k), d);
      for (const x of mal) assert.notEqual(dice(plano(x.texto)), correcta, d);
      continue;
    }
    const gente = genteDe(preg), num = /numeradas/.test(preg), n = +preg.match(/de (\d) sillas/)[1];
    const fs = pistasDe(c.datos).map(t => leerCon(LEER5(n), t));
    const alt = c.datos.some(t => /alternados/.test(plano(t)));
    const FEMS = new Set(['Ana', 'Dina', 'Eva', 'Rosa']);
    const base = (num ? conHuecos(gente, n) : mesasFijas(gente, n, c.dibujo.datos.sentados[0].t)).filter(o => !alt || o.every((x, i) => FEMS.has(x) !== FEMS.has(o[(i + 1) % n])));
    const qq = base.filter(o => fs.every(f => f(o)));
    assert.ok(qq.length >= 1, d);
    if ((m = preg.match(new RegExp(`¿Quién se sienta frente a ${N}\\?$`)))) {
      const fr = o => o[(o.indexOf(m[1]) + n / 2) % n];
      assert.ok(qq.every(o => fr(o) === plano(bien.texto)), d);
      for (const x of mal) if (gente.includes(plano(x.texto))) assert.ok(!qq.every(o => fr(o) === plano(x.texto)), d); else assert.equal(x.error, 'RMP78', d);
    } else {
      assert.match(preg, /una queda vacía\. ¿Cuál\?$/, d);
      const v = +plano(bien.texto).match(/^La (\d)$/)[1];
      assert.ok(qq.every(o => o[v - 1] === null), d);
      for (const x of mal) { const z = plano(x.texto).match(/^La (\d)$/); if (z) assert.ok(!qq.every(o => o[+z[1] - 1] === null), d); else assert.equal(x.error, 'RMP78', d); }
    }
    const r = I6.resuelve.generar(s), k = /dos sillas/.test(plano(r.enunciado)) ? 2 : 3, ps = pistasDe(r.datos);
    const silla = {}, z0 = ps[0].match(new RegExp(`^${N} se sienta en la silla (\\d+)`)); silla[z0[1]] = +z0[2] - 1;
    for (const t of ps.slice(1)) {
      let z;
      if ((z = t.match(new RegExp(`^${N} se sienta frente a ${N}`)))) silla[z[1]] = frenteQ(silla[z[2]], k);
      else { z = t.match(new RegExp(`^${N} se sienta a la (derecha|izquierda) de ${N}`)); silla[z[1]] = (silla[z[3]] + (z[2] === 'derecha' ? 1 : 4 * k - 1)) % (4 * k); }
    }
    assert.equal(plano(r.respuesta), Object.entries(silla).map(([x, p]) => `${x} ${p + 1}`).join(', '), d);
  }
});

// ---------- 9. La paleta de las ideas 2 a 6 y el contrato de calidad 2 ----------
test('ideas 2 a 4 solo con violeta; ideas 5 y 6 con naranja (desde quién) y turquesa (hacia dónde) en la mesa', () => {
  const P = Kit.piezas['rm-orden'];
  for (const [id, permitidos] of [['posiciones', ['c-f']], ['comparaciones', ['c-f']], ['con-numeros', ['c-f']], ['orden-circular', ['c-f', 'c-o', 'c-i']], ['mesa-cuadrada', ['c-f', 'c-o', 'c-i']]]) {
    const I = IDEA(id), colores = new Set();
    const ir = x => { if (Array.isArray(x)) x.forEach(ir); else if (x && typeof x === 'object') { if (typeof x.v === 'string') colores.add(x.v); Object.values(x).forEach(ir); } };
    ir(I.lee); ir(I.juega.leyenda); ir(I.predice); ir(I.mira); ir(I.regla); ir(I.ejemplos);
    for (let s = 0; s < 40; s++) { ir(I.ahoraTu.generar(s)); ir(I.resuelve.generar(s)); }
    for (const c of colores) assert.ok(permitidos.includes(c), `${id}: color ${c}`);
    // Ninguna figura de antes de responder trae violeta; y sin verde ni carmín en ninguna.
    const antes = [I.predice.dibujo].concat(I.ejemplos.map(e => e.figura)).concat([...Array(40).keys()].map(s => I.ahoraTu.generar(s).dibujo));
    for (const f of antes) assert.ok(!/var\(--c-f\)/.test(P.dibujar(f.datos, f.estado || {})), `${id}: violeta antes de responder`);
    if (permitidos.length === 1) for (const f of antes) assert.ok(!/var\(--c-[oi]\)/.test(P.dibujar(f.datos, f.estado || {})), `${id}: naranja o turquesa fuera de la mesa`);
  }
});

test('la unidad cumple el contrato de calidad 2, lo declara y conserva sus ids', () => {
  const cat = require('../../../catalogo/cursos/razonamiento-matematico.json').unidades.find(u => u.id === def.unidad);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 40 }), []);
  assert.deepEqual(Teoria.problemas(def, { temas: cat.temas }), []);
  assert.deepEqual(def.ideas.map(i => i.id), ['orden-lineal', 'posiciones', 'comparaciones', 'con-numeros', 'orden-circular', 'mesa-cuadrada']);
  // La letra de la respuesta de los 30 ejemplos de nivel examen: cada una 6 veces.
  const letras = def.ideas.flatMap(i => i.ejemplos.filter(e => e.alternativas).map(e => plano(e.respuesta)[0]));
  assert.deepEqual(['A', 'B', 'C', 'D', 'E'].map(l => letras.filter(x => x === l).length), [6, 6, 6, 6, 6]);
  // Los ejercicios dan sus datos, con las pistas una por línea y fuera del enunciado.
  for (const I of def.ideas) for (let s = 0; s < 30; s++) for (const c of [I.ahoraTu.generar(s), I.resuelve.generar(s)]) {
    assert.ok(c.datos && c.datos.length <= 6, `${I.id} semilla ${s}`);
    assert.ok(!/Pista \d/.test(plano(c.pregunta || c.enunciado)), `${I.id} semilla ${s}`);
  }
});

// ---------- 10. Auditoría del 19 nov (rutinas/auditoria/razonamiento-matematico.ordenamiento-de-informacion.md) ----------
// Cada prueba falla con la versión de antes de las correcciones.
const NOMBRES_U = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo', 'Rosa', 'Iván', 'Nora', 'Leo', 'Maru', 'Teo', 'Gino', 'Lucho', 'Vilma', 'Sara', 'Pía', 'Omar'];
const MUJERES_U = new Set(['Ana', 'Dina', 'Eva', 'Rosa', 'Nora', 'Maru', 'Sara', 'Pía', 'Vilma', 'Gaby']);

test('auditoría A2: el ejemplo 15 de «Frente a frente» deja 3 mesas, y el resuelto lo dice', () => {
  const e = IDEA('mesa-cuadrada').ejemplos[14], n = 8, ps = pistasDe(e.datos);
  const gente = ['Eva', 'Fito', 'Gino', 'Hugo', 'Iván', 'Ana'];
  const fs = ps.map(t => leerCon(LEER5(n), t));
  const q = mesasFijas(gente, n, 'Eva').filter(o => fs.every(f => f(o)));
  assert.equal(q.length, 3);
  assert.ok(q.every(o => o[(o.indexOf('Fito') + 1) % n] === 'Hugo'), 'E vale en las 3');
  const sol = e.solucion.map(l => plano(l.texto)).join(' ');
  assert.match(sol, /quedan 3 mesas/);
  assert.ok(!/dos sillas posibles/.test(sol));
});

test('auditoría M1: la regla de los pisos dice la distancia que dibuja, y los pisos de en medio son uno menos', () => {
  const R2 = IDEA('posiciones').regla, eds = R2.dibujo.datos.edificios;
  const PAL = { dos: 2, tres: 3, cuatro: 4 };
  const [, w0, m] = plano(R2.texto).match(/«(\w+) pisos más arriba» amarra a dos en un bloque, con (\w+) pisos? en medio/);
  const w = w0.toLowerCase();
  for (const ed of eds) {
    assert.equal(ed.bloque.texto, `+${PAL[w]}`);
    assert.equal(ed.enMedio.length, PAL[m]);
    assert.equal(PAL[m], PAL[w] - 1);
  }
});

test('auditoría M2: ningún nombre de persona sale en minúscula (200 semillas de «Ahora tú» y «Así se resuelve»)', () => {
  const re = new RegExp(`\\b(${NOMBRES_U.map(x => x.toLowerCase()).join('|')})\\b`);
  for (const I of def.ideas) for (let s = 0; s < 200; s++) for (const c of [I.ahoraTu.generar(s), I.resuelve.generar(s)]) {
    const t = JSON.stringify([c.pregunta, c.enunciado, c.solucion && c.solucion.texto, (c.pasos || []).map(p => p.texto), (c.opciones || []).map(o => [o.texto, o.siFuera]), c.respuesta].map(x => (Array.isArray(x) && x.length && Array.isArray(x[0]) ? x.map(y => y.map(plano)) : plano(x))));
    assert.ok(!re.test(t), `${I.id} semilla ${s}: ${(t.match(re) || [])[0]}`);
  }
});

test('auditoría M3: cada «¿Qué silla…?» de la cuadrada tiene una sola silla que responde', () => {
  for (let s = 0; s < 400; s += 4) {
    const c = IDEA('mesa-cuadrada').ahoraTu.generar(s), preg = plano(c.pregunta);
    if (/comparte el lado/.test(preg)) assert.match(preg, /dos sillas por lado/, `semilla ${s}: con tres por lado hay dos sillas en su lado`);
  }
});

test('auditoría M4: si se alternan mujeres y varones, Datos dice quién es cada uno', () => {
  const todos = [];
  for (const I of def.ideas) {
    for (const e of I.ejemplos) todos.push([`${I.id} ${e.titulo}`, e.datos, e.enunciado]);
    for (let s = 0; s < 200; s++) { const c = I.ahoraTu.generar(s); todos.push([`${I.id} ${s}`, c.datos, c.pregunta]); }
  }
  for (const [d, datos, texto] of todos) {
    const ls = datos.map(plano);
    if (!ls.some(l => /alternad/i.test(l))) continue;
    const linea = ls.find(l => /^Mujeres \(/.test(l));
    assert.ok(linea, `${d}: no dice quién es mujer y quién varón`);
    const [, muj, var_] = linea.match(/^Mujeres \(([^)]*)\) y varones \(([^)]*)\)/);
    for (const x of muj.split(/, | y /)) assert.ok(MUJERES_U.has(x), `${d}: ${x}`);
    for (const x of var_.split(/, | y /)) assert.ok(!MUJERES_U.has(x), `${d}: ${x}`);
    assert.ok(!/mujeres y varones, comparten/.test(plano(texto)), d);
  }
});

test('auditoría M5: el glosario no da la clave de las predicciones 4 y 5, y «frente a» lo estrena «Frente a frente»', () => {
  const G = require('../../../nucleo/glosario.js');
  const por = G.porIdea(def), k6 = def.ideas.findIndex(i => i.id === 'mesa-cuadrada'), k5 = def.ideas.findIndex(i => i.id === 'orden-circular');
  assert.ok(por[k6].some(e => (e.termino || e) === 'frente a'), '«frente a» en la idea 6');
  assert.ok(!por[k5].some(e => (e.termino || e) === 'frente a'), '«frente a» no en la idea 5');
  const ej = t => def.glosario.find(g => g.termino === t).ejemplos.join(' ');
  assert.ok(!/crece.*se achica|gana.*pierde/.test(ej('suman lo mismo')), 'suman lo mismo: la compensación es la predicción de la idea 4');
  assert.ok(!/las 12, contra el reloj se pasa por las 11/.test(ej('sentido antihorario')), 'desde arriba (las 12), contra el reloj: la predicción de la idea 5');
});

test('auditoría M6: en la mesa redonda, nadie de pie a un lado ni cucharas cuando se pregunta de qué lado va', () => {
  const I5 = IDEA('orden-circular');
  const P = Kit.piezas['rm-orden'];
  for (const f of [I5.predice.dibujo].concat(I5.ejemplos.map(e => e.figura))) {
    if (!(f.datos.espera || []).length) continue;
    const svg = P.dibujar(f.datos, f.estado || {});
    const m = svg.match(/<text[^>]*x="([\d.]+)"[^>]*>De pie: /);
    assert.ok(m, 'quien espera se escribe «De pie: …»');
    assert.ok(Math.abs(+m[1] - 160) < 1, `centrado (x = ${m[1]})`);
  }
  for (const e of I5.ejemplos) if (/¿En qué silla del dibujo/.test(plano(e.enunciado))) assert.ok(!e.figura.datos.cucharas, e.titulo);
});

test('auditoría M7: ningún asa de arrastre lleva el violeta de lo seguro', () => {
  for (const I of def.ideas) for (const a of I.juega.arrastres || []) assert.notEqual(a.color, 'c-f', `${I.id} ${a.id}`);
  for (const m of def.laboratorio) for (const a of m.arrastres || []) assert.notEqual(a.color, 'c-f', `${m.id} ${a.id}`);
  const fl = IDEA('orden-circular').juega.leyenda.find(x => /flecha/.test(plano(x.s)));
  assert.match(plano(fl.t), /al acertar/);
});

test('auditoría M8: sin pistas, la formación no se rotula «del más bajo al más alto»', () => {
  const j = IDEA('comparaciones').juega, d = j.dibujo(Object.assign(Teoria.inicio(j), { n: 0 })).datos;
  assert.ok(!/más bajo al más alto/.test(d.casos[0].titulo));
  assert.match(plano(j.leyenda.find(x => plano(x.s) === 'columnas').t), /sin comparar/);
});

test('auditoría M9: el dibujo es lo que nombra el texto (dados, tarjetas de edad, sin tallímetro para edades y puntos)', () => {
  for (const I of def.ideas) for (const e of I.ejemplos) {
    const t = plano(e.enunciado), d = e.figura && e.figura.datos;
    if (!d) continue;
    if (/dado/.test(t)) assert.equal(d.forma, 'dado', e.titulo);
    if (d.escena === 'sobres' && (d.sobres || []).some(x => /años/.test(x))) assert.equal(d.forma, 'tarjeta', e.titulo);
    if (d.escena === 'talla' && /(años|puntos|primos|hermanos|edad)/.test(t)) assert.equal(d.tallimetro, false, e.titulo);
  }
  const I3 = IDEA('comparaciones');
  for (let s = 0; s < 40; s++) for (const c of [I3.ahoraTu.generar(s), I3.resuelve.generar(s)]) assert.equal(c.dibujo.datos.tallimetro, false, `semilla ${s}`);
});

test('auditoría M10 y M11: el resuelto escribe las flechas que nombra, y los datos dicen lo que el resuelto usa', () => {
  for (const e of IDEA('comparaciones').ejemplos) {
    const sol = e.solucion.map(l => plano(l.texto)).join(' ');
    if (/flechas? (salen|que comparten)/.test(sol)) assert.match(sol, /→/, e.titulo);
  }
  for (const e of IDEA('posiciones').ejemplos) {
    const gente = new Set(pistasDe(e.datos).flatMap(t => t.match(new RegExp(N, 'g')).filter(x => NOMBRES_U.includes(x))));
    if (/edificio/.test(plano(e.enunciado)) && gente.size >= 3) assert.ok(e.datos.map(plano).some(l => /una sola persona/.test(l)), e.titulo);
  }
  for (const e of IDEA('orden-lineal').ejemplos) {
    if (e.nivel === 3 || !pistasDe(e.datos).some(t => /está a la (izquierda|derecha) de/.test(t))) continue;   // en nivel examen ya se sabe
    assert.ok(e.datos.map(plano).some(l => /^A la izquierda de: /.test(l)), e.titulo);
  }
});

test('auditoría M12: el papel de la escena que se ve en «Más mesas del tema» dice de qué unidad es cada problema', () => {
  const papel = require('../../../plantillas/orden-informacion/papel.json');
  for (const p of papel.problemas) assert.ok(Array.isArray(p.unidades) && p.unidades.length, p.id);
  const deAqui = papel.problemas.filter(p => p.unidades.includes(def.unidad));
  for (const p of deAqui) assert.ok(!/miente|verdad|con seguridad|sin ver/.test(p.enunciado), `${p.id}: es de otra unidad`);
});

test('auditoría A1 (texto), M14 a M16 y bajas: redacción', () => {
  assert.ok(!/sillas redondas/.test(plano(IDEA('mesa-cuadrada').regla.condicion)));
  assert.ok(!/cercanas a la 6/.test(plano(IDEA('mesa-cuadrada').mira.voz)));
  assert.ok(!/Con los valores a la vista|si Ana gana, Beto pierde/.test(plano(IDEA('con-numeros').regla.texto) + JSON.stringify(IDEA('con-numeros').regla.ecuacion)));
  assert.ok(!/franja/.test(IDEA('con-numeros').mira.voz.split(';')[0]), 'la voz no nombra la franja antes de que se vea');
  const e11 = IDEA('orden-circular').ejemplos[10].solucion.map(l => plano(l.texto)).join(' ');
  assert.match(e11, /no va en la última/);
  for (const I of def.ideas) for (const e of I.ejemplos) assert.ok(!/\bchoca\b/.test(e.solucion.map(l => plano(l.texto)).join(' ')), `${I.id} ${e.titulo}`);
  for (let s = 0; s < 200; s++) {
    const t = JSON.stringify(IDEA('posiciones').ahoraTu.generar(s).opciones.map(o => o.siFuera));
    assert.ok(!/Quedan 1 orden/.test(t) && !/Quedan 2 órdenes, pero en todos/.test(t), `semilla ${s}`);
  }
  // El ejemplo 11 de la idea 4: dos alternativas no dicen lo mismo con otras palabras.
  const alts = IDEA('con-numeros').ejemplos[10].alternativas;
  const rel = t => { const m = t.match(new RegExp(`^${N} es (mayor|menor) que ${N}$`)); return m && (m[2] === 'mayor' ? `${m[3]}<${m[1]}` : `${m[1]}<${m[3]}`); };
  const rs = alts.map(rel).filter(Boolean);
  assert.equal(new Set(rs).size, rs.length);
});
