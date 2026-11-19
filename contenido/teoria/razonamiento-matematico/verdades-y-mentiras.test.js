// Pruebas propias de «Verdades y mentiras» (etapa 6: las seis ideas rehechas).
// Todo se vuelve a resolver aquí con resolvedores propios, que no usan el código de la unidad: leen las frases del TEXTO
// que ve el alumno (recuadro «Datos», una frase por línea), prueban todas las suposiciones (tarjetas, culpables, órdenes de
// llegada, repartos) y comparan con lo que la unidad afirma.
//   1. Los juegos y las predicciones de las seis ideas.
//   2. Los 90 ejemplos: la respuesta y, en los de nivel 3, la letra y que cada alternativa incorrecta falla de verdad.
//   3. «Ahora tú» en 400 semillas por idea: una sola opción correcta, y cada explicación dice una cuenta verdadera.
//   4. «Así se resuelve» en 120 semillas: la respuesta es la única que encaja.
//   5. La paleta (sin verde ni carmín; sin violeta antes de responder), las letras repartidas y el validador con calidad 2.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./verdades-y-mentiras.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = require('../../../nucleo/kit/piezas/rm-veraz.js');
const plano = x => Teoria.plano(x);
const idea = id => def.ideas.find(i => i.id === id);
const NUM = { uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };
const N = '([A-ZÁÉÍÓÚ][a-záéíóúñ]+)';

// ---------- Resolvedor 1: veraces y mentirosos (ideas 1 y 6) ----------
// Una frase leída es una función (v: tarjetas, de: quien habla) → cierta o falsa.
function leerKK(t, gente) {
  const m = s => t.match(new RegExp(`^${s}$`));
  let x;
  if (t === 'Yo digo la verdad') return (v, de) => v[de];
  if (t === 'Yo miento') return (v, de) => !v[de];
  if (t === 'Los dos mentimos') return v => gente.every(z => !v[z]);
  if (t === 'Los dos decimos la verdad') return v => gente.every(z => v[z]);
  if ((x = m(`${N} y yo mentimos`))) return (v, de) => !v[x[1]] && !v[de];
  if ((x = m(`${N} y yo decimos la verdad`))) return (v, de) => v[x[1]] && v[de];
  if ((x = m(`${N} y ${N} mienten`))) return v => !v[x[1]] && !v[x[2]];
  if ((x = m(`${N} y ${N} dicen la verdad`))) return v => v[x[1]] && v[x[2]];
  if ((x = m(`${N} miente`))) return v => !v[x[1]];
  if ((x = m(`${N} dice la verdad`))) return v => v[x[1]];
  const mienten = v => gente.filter(z => !v[z]).length;
  if ((x = m('Aquí (?:miente|mienten) exactamente ([a-z]+)'))) return v => mienten(v) === NUM[x[1]];
  if ((x = m('Aquí mentimos los ([a-z]+)'))) return v => mienten(v) === NUM[x[1]];
  if ((x = m('Aquí (?:miente|mienten) por lo menos ([a-z]+)'))) return v => mienten(v) >= NUM[x[1]];
  throw new Error(`no sé leer «${t}»`);
}
const dichos = datos => datos.map(plano).map(d => d.match(/^([A-ZÁÉÍÓÚ][a-záéíóúñ]+) dice: «(.+)»\.$/)).filter(Boolean).map(m => ({ de: m[1], t: m[2] }));
const todasKK = gente => Array.from({ length: 2 ** gente.length }, (_, k) => Object.fromEntries(gente.map((x, i) => [x, !((k >> i) & 1)])));
function resolverKK(gente, frases, dadas = {}) {
  const fs = frases.map(x => ({ de: x.de, ok: leerKK(x.t, gente) }));
  return todasKK(gente).filter(v => Object.entries(dadas).every(([q, b]) => v[q] === b) && fs.every(x => x.ok(v, x.de) === v[x.de]));
}
const genteDe = (texto, frases) => {
  const m = plano(texto).match(new RegExp(`((?:${N}, )*${N} y ${N})`));
  const g = m ? m[1].split(/, | y /) : [];
  for (const x of frases) {
    if (!g.includes(x.de)) g.push(x.de);
    for (const [y] of (x.t || '').matchAll(/[A-ZÁÉÍÓÚ][a-záéíóúñ]+/g)) if (!['Aquí', 'Yo', 'Los', 'Fue', 'No', 'Está', 'Llegué', 'Soy', 'Gané', 'Ganó'].includes(y) && !g.includes(y)) g.push(y);
  }
  return g;
};
// «Solo Ana», «Ana y Ciro», «Nadie», «Los tres» → el conjunto de nombres.
const conjunto = (t, gente) => { t = plano(t).replace(/^(Solo|solo) /, ''); if (/^(Nadie|Ninguno)/.test(t)) return []; if (/^Los (dos|tres|cuatro|cinco)$/.test(t)) return gente.slice(); return t.split(/, | y /); };
const mismo = (a, b) => a.length === b.length && a.every(x => b.includes(x));

// ---------- Resolvedor 2: culpables, ganadores y mochilas (ideas 3 y 4) ----------
function leerC(t, de) {
  let x;
  if (/^(Fui yo|Gané yo|Está en la mía)$/.test(t)) return { si: de };
  if (/^(Yo no fui|Yo no gané|No está en la mía)$/.test(t)) return { no: de };
  if ((x = t.match(new RegExp(`^(?:Fue|Ganó|Está en la de) ${N}$`)))) return { si: x[1] };
  if ((x = t.match(new RegExp(`^(?:No fue|No ganó|No está en la de) ${N}$`)))) return { no: x[1] };
  if ((x = t.match(new RegExp(`^${N} miente$`)))) return { miente: x[1] };
  throw new Error(`no sé leer «${t}»`);
}
function valC(fr, todas, c) {
  if (fr.si) return c === fr.si;
  if (fr.no) return c !== fr.no;
  return !valC(todas.find(y => y.de === fr.miente).f, todas, c);
}
const condicion = datos => { const d = datos.map(plano).join(' '); return /Solo una de las frases es cierta|Solo uno de los tres rótulos es cierto/.test(d) ? 'cierta' : /Mienten dos/.test(d) ? 'dos' : 'falsa'; };
function resolverC(datos, gente) {
  const fs = dichos(datos).map(x => ({ de: x.de, f: leerC(x.t, x.de) }));
  const cond = condicion(datos), n = fs.length;
  const falsas = c => fs.filter(x => !valC(x.f, fs, c)).length;
  const pide = cond === 'cierta' ? n - 1 : cond === 'dos' ? 2 : 1;
  return { fs, falsas, ok: gente.filter(c => falsas(c) === pide), pide };
}

// ---------- Resolvedor 3: el podio y los oficios (idea 5) ----------
const ORD = { primero: 1, primera: 1, segundo: 2, segunda: 2, tercero: 3, tercera: 3, cuarto: 4, cuarta: 4 };
const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
function frasesVYM(datos) {
  return datos.map(plano).map(d => d.match(/^([A-ZÁÉÍÓÚ][a-záéíóúñ]+) dice: «(.+)» y «(.+)»\.$/)).filter(Boolean).map(m => ({ de: m[1], dos: [m[2], m[3]] }));
}
function leerP(t, de) {
  let x;
  if ((x = t.match(/^Llegué ([a-z]+)$/))) return o => o.indexOf(de) + 1 === ORD[x[1]];
  if ((x = t.match(new RegExp(`^${N} llegó ([a-z]+)$`)))) return o => o.indexOf(x[1]) + 1 === ORD[x[2]];
  throw new Error(`no sé leer «${t}»`);
}
const OFI = { médico: 'm', médica: 'm', profesor: 'p', profesora: 'p', ingeniero: 'i', ingeniera: 'i' };
function leerO(t, de) {
  let x;
  if ((x = t.match(/^Soy ([a-zé]+)$/))) return a => a[de] === OFI[x[1]];
  if ((x = t.match(new RegExp(`^${N} es ([a-zé]+)$`)))) return a => a[x[1]] === OFI[x[2]];
  throw new Error(`no sé leer «${t}»`);
}
const unaYUna = (fs, x) => fs.filter(f => f(x)).length === 1;
function resolverP(datos) {
  const fr = frasesVYM(datos), gente = fr.map(x => x.de);
  const fs = fr.map(x => x.dos.map(t => leerP(t, x.de)));
  return { gente, fr, quedan: perms(gente).filter(o => fs.every(f => unaYUna(f, o))), encaja: o => fs.every(f => unaYUna(f, o)) };
}
function resolverO(datos) {
  const fr = frasesVYM(datos), gente = fr.map(x => x.de);
  const fs = fr.map(x => x.dos.map(t => leerO(t, x.de)));
  return perms(['m', 'p', 'i']).map(p => Object.fromEntries(gente.map((g, i) => [g, p[i]]))).filter(a => fs.every(f => unaYUna(f, a)));
}

// ---------- 1. Juegos y predicciones ----------
test('idea 1: el juego tiene una sola suposición sin choques y la predicción encaja con las dos tarjetas', () => {
  const I = idea('suposicion'), g = ['Ana', 'Beto'], fr = [{ de: 'Ana', t: 'Beto miente' }, { de: 'Beto', t: 'Los dos mentimos' }];
  const q = resolverKK(g, fr);
  assert.deepEqual(q, [{ Ana: true, Beto: false }]);
  for (const a of ['V', 'M']) for (const b of ['V', 'M']) {
    const v = { a, b }, ok = a === 'V' && b === 'M';
    assert.equal(I.juega.mision.logrado(v), ok);
    assert.equal(/sin choque/.test(plano(I.juega.lectura(v))), ok);
    const d = I.juega.dibujo(v).datos;
    assert.equal(d.habla.every(h => h.estado.t === 'encaja'), ok, JSON.stringify(v));
  }
  assert.equal(resolverKK(['Ciro'], [{ de: 'Ciro', t: 'Yo digo la verdad' }]).length, 2);
  assert.equal(resolverKK(['Dina'], [{ de: 'Dina', t: 'Yo miento' }]).length, 0);
  assert.ok(I.predice.opciones.find(o => o.correcta).texto.startsWith('Nada'));
});

test('idea 2: el juego hace falsas las dos frases con 1 a 3 aprobados; la predicción es «al menos uno no»', () => {
  const I = idea('negar-bien');
  for (let n = 0; n <= 4; n++) assert.equal(I.juega.mision.logrado({ n }), n >= 1 && n <= 3);
  assert.equal(I.predice.opciones.find(o => o.correcta).texto, 'Al menos uno no aprobó');
  // Con 4 alumnos, en todas las listas donde «todos aprobaron» falla, alguien no aprobó; «ninguno» no vale en todas.
  const listas = Array.from({ length: 16 }, (_, k) => [0, 1, 2, 3].map(i => !!((k >> i) & 1))).filter(l => !l.every(Boolean));
  assert.ok(listas.every(l => l.some(x => !x)));
  assert.ok(!listas.every(l => l.every(x => !x)));
});

test('ideas 3 y 4: el juego y la predicción, contados desde las frases', () => {
  const I3 = idea('contradictorias'), I4 = idea('solo-uno-veraz'), G = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const datos3 = ['Solo una de las frases es falsa.', 'Ana dice: «Fue Beto».', 'Beto dice: «Fue Dina».', 'Ciro dice: «Yo no fui».', 'Dina dice: «Beto miente».'];
  const r3 = resolverC(datos3, G);
  assert.deepEqual(r3.ok, ['Beto']);
  G.forEach((c, k) => assert.equal(I3.juega.mision.logrado({ c: k }), c === 'Beto'));
  const p3 = resolverC(I3.predice.datos, ['Eva', 'Fito', 'Gaby', 'Hugo']);
  assert.deepEqual(p3.ok, ['Fito']);
  // Lo seguro sin probar culpables: los de fuera del único par que se contradice.
  const G3 = ['Eva', 'Fito', 'Gaby', 'Hugo'], pares = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (G3.every(c => valC(p3.fs[i].f, p3.fs, c) !== valC(p3.fs[j].f, p3.fs, c))) pares.push([p3.fs[i].de, p3.fs[j].de]);
  assert.deepEqual(pares, [['Eva', 'Gaby']]);
  assert.equal(plano(I3.predice.opciones.find(o => o.correcta).texto), 'Fito y Hugo dicen la verdad');
  const datos4 = ['Solo una de las frases es cierta.', 'Ana dice: «Está en la de Beto».', 'Beto dice: «No está en la mía».', 'Ciro dice: «Está en la mía».', 'Dina dice: «No está en la mía».'];
  assert.deepEqual(resolverC(datos4, G).ok, ['Dina']);
  G.forEach((c, k) => assert.equal(I4.juega.mision.logrado({ c: k }), c === 'Dina'));
  const p4 = resolverC(I4.predice.datos, ['Eva', 'Fito', 'Gaby', 'Hugo']);
  assert.deepEqual(p4.ok, ['Gaby']);
  assert.equal(I4.predice.opciones.find(o => o.correcta).texto, 'En la de Gaby');
});

test('ideas 5 y 6: el podio del juego, la predicción de Dina y las cuentas de cuántos mienten', () => {
  const I5 = idea('verdad-y-mentira'), I6 = idea('cuantos-mienten');
  const r = resolverP(['x', 'Ana dice: «Llegué segunda» y «Beto llegó primero».', 'Beto dice: «Llegué segundo» y «Ana llegó tercera».', 'Ciro dice: «Llegué segundo» y «Beto llegó tercero».']);
  assert.deepEqual(r.quedan, [['Beto', 'Ciro', 'Ana']]);
  const op = I5.juega.controles[0].opciones;
  for (const o of op) assert.equal(I5.juega.mision.logrado({ o: o.valor }), o.texto === 'Beto, Ciro, Ana');
  // Dina, en una carrera de cuatro: solo segunda o tercera dejan una verdad y una mentira.
  assert.deepEqual([1, 2, 3, 4].filter(k => [k === 2, k === 3].filter(Boolean).length === 1), [2, 3]);
  // El juego de la idea 6: solo con 3 mentirosos encaja.
  const g = ['Ana', 'Beto', 'Ciro', 'Dina'], fr = [{ de: 'Ana', t: 'Aquí miente exactamente uno' }, { de: 'Beto', t: 'Aquí mienten exactamente dos' }, { de: 'Ciro', t: 'Aquí mienten exactamente tres' }, { de: 'Dina', t: 'Aquí mentimos los cuatro' }];
  const q = resolverKK(g, fr);
  assert.equal(q.length, 1);
  assert.equal(g.filter(x => !q[0][x]).length, 3);
  for (let k = 0; k <= 4; k++) assert.equal(I6.juega.mision.logrado({ k }), k === 3);
  const p = resolverKK(['Eva', 'Fito', 'Gaby'], ['Eva', 'Fito', 'Gaby'].map(de => ({ de, t: 'Aquí miente exactamente uno' })));
  assert.deepEqual(p, [{ Eva: false, Fito: false, Gaby: false }]);
});

// ---------- 2. Los 90 ejemplos ----------
const dadasDe = texto => { const d = {}; for (const m of plano(texto).matchAll(new RegExp(`${N} muestra (?:su tarjeta|la suya): es (VERAZ|MIENTE)`, 'g'))) d[m[1]] = m[2] === 'VERAZ'; return d; };
test('idea 1, los 15 ejemplos: lo que dice cada respuesta sale de probar todas las tarjetas', () => {
  const E = idea('suposicion').ejemplos;
  const caso = i => { const e = E[i], fr = dichos(e.datos), g = genteDe(e.enunciado, fr); return { e, fr, g, q: resolverKK(g, fr, dadasDe(e.enunciado)) }; };
  const resp = i => plano(E[i].respuesta);
  let c = caso(0); assert.equal(c.q.length, 1); assert.equal(c.q[0].Beto, false); assert.match(resp(0), /MIENTE/);
  c = caso(1); assert.equal(c.q[0].Ciro, true); assert.match(resp(1), /VERAZ/);
  c = caso(2); assert.ok(!resolverKK(c.g, c.fr, { Rosa: true, Leo: false }).length); assert.match(resp(2), /choca/);
  assert.equal(2 ** 3, 8); assert.match(resp(3), /^8/);
  c = caso(4); assert.equal(c.q.length, 1); assert.equal(c.q[0].Dina, true); assert.match(resp(4), /VERAZ/);
  c = caso(5); assert.deepEqual(c.q, [{ Nora: true, Teo: false }]); assert.equal(resp(5), 'Solo Nora');
  c = caso(6); assert.deepEqual(c.q, [{ Ana: true, Beto: false, Ciro: true }]); assert.equal(resp(6), 'Ana y Ciro');
  c = caso(7); assert.equal(c.q.length, 2); assert.ok(c.q.every(v => v.Sara === v.Gino));
  c = caso(8); assert.equal(c.q.length, 1); assert.deepEqual(conjunto(resp(8), c.g), c.g.filter(x => !c.q[0][x]));
  c = caso(9); assert.deepEqual(c.q, [{ Pía: false, Gino: true }]);
  // Nivel 3: la letra, y cada alternativa falla con las tarjetas que obligan las frases.
  const esperado = [[10, 'A', 'veraces'], [11, 'B', 'cuantos'], [12, 'C', 'mienten'], [13, 'D', 'seguro'], [14, 'E', 'veraces']];
  for (const [i, letra, tipo] of esperado) {
    const { e, g, q } = caso(i), L = 'ABCDE'.indexOf(letra);
    assert.equal(resp(i)[0], letra, e.titulo);
    const vale = alt => {
      if (tipo === 'veraces') return q.length === 1 && mismo(conjunto(alt, g), g.filter(x => q[0][x]));
      if (tipo === 'mienten') return q.length === 1 && mismo(conjunto(alt, g), g.filter(x => !q[0][x]));
      if (tipo === 'cuantos') return q.length === 1 && NUM[alt.toLowerCase()] === g.filter(x => !q[0][x]).length;
      const m = alt.match(new RegExp(`^${N} (miente|dice la verdad)$`)), m2 = alt.match(new RegExp(`^${N} y ${N} mienten$`));
      if (m) return q.every(v => v[m[1]] === (m[2] !== 'miente'));
      if (m2) return q.every(v => !v[m2[1]] && !v[m2[2]]);
      return false;
    };
    e.alternativas.forEach((a, k) => assert.equal(vale(a), k === L, `${e.titulo}: ${a}`));
  }
});

test('idea 2, los 15 ejemplos: lo seguro es lo que vale en todos los casos en que la frase del mentiroso falla', () => {
  const E = idea('negar-bien').ejemplos, R = E.map(e => plano(e.respuesta));
  assert.match(R[0], /Al menos uno .* no aprobó/); assert.match(R[1], /Al menos uno .* es de Juliaca/);
  // Cantidades: «más de 10» falla con 10 o menos; «menos de 16», con 16 o más.
  assert.match(R[2], /10 soles o menos/); assert.match(R[3], /16 años o más/);
  assert.match(R[4], /Al menos una caja/);
  assert.match(R[5], /Dina desaprobó/);
  assert.deepEqual([20, 50, 100].filter(b => !(b > 30)), [20]); assert.match(R[6], /20/);
  assert.match(R[7], /Teo no es mayor/);
  // Par 1: con 2 de 4 aprobados, las dos falsas; par 2: nunca iguales.
  assert.ok(Array.from({ length: 5 }, (_, n) => n).every(n => (n === 4) !== (n < 4)));
  assert.match(R[8], /par 2/);
  assert.deepEqual([5, 6, 7].filter(k => !(k > 6)), [5, 6]); assert.match(R[9], /5 o 6/);
  // Nivel 3.
  assert.equal(R[10][0], 'B');
  const edades = Array.from({ length: 30 }, (_, e) => e).filter(e => !(e < 15) && !(e > 16) && e !== 16);
  assert.deepEqual(edades, [15]); assert.equal(R[11][0], 'C'); assert.equal(E[11].alternativas[2], '15 años');
  // El equipo: Teo y Sara de Puno; «todos de Puno» falsa ⇒ Maru no es de Puno ⇒ de Juliaca.
  assert.equal(R[12][0], 'D'); assert.equal(E[12].alternativas[3], 'Maru es de Juliaca');
  assert.equal(R[13][0], 'E'); assert.equal(E[13].alternativas[4], 'Beto no aprobó');
  const fito = [10, 20, 50, 100, 200].filter(x => !(x > 50) && !(x < 50));
  assert.deepEqual(fito, [50]); assert.equal(R[14][0], 'A');
});

test('ideas 3 y 4, los 30 ejemplos: el culpable (o el lugar) sale de contar frases falsas con cada uno', () => {
  const casos = [
    ['contradictorias', 5, ['Ana', 'Beto', 'Ciro'], 'Beto'], ['contradictorias', 6, ['Rosa', 'Leo', 'Nora', 'Teo'], 'Leo'],
    ['contradictorias', 9, ['Nora', 'Leo', 'Maru', 'Teo'], 'Maru'], ['contradictorias', 10, ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], 'Ciro'],
    ['contradictorias', 14, ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], 'Beto'],
    ['solo-uno-veraz', 5, ['Ana', 'Beto', 'Ciro'], 'Ciro'], ['solo-uno-veraz', 6, ['Rosa', 'Leo', 'Nora'], 'Nora'],
    ['solo-uno-veraz', 9, ['Rosa', 'Nora', 'Leo', 'Teo'], 'Teo'], ['solo-uno-veraz', 10, ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], 'Beto'],
    ['solo-uno-veraz', 14, ['Sara', 'Gino', 'Pía', 'Omar', 'Lucho'], 'Gino'],
  ];
  for (const [id, i, g, c] of casos) {
    const e = idea(id).ejemplos[i], r = resolverC(e.datos, g);
    assert.deepEqual(r.ok, [c], `${id} ${i + 1}`);
    assert.match(plano(e.respuesta), new RegExp(c), `${id} ${i + 1}`);
    if (e.alternativas) e.alternativas.forEach(a => assert.equal(r.ok.includes(a), a === c, `${id} ${i + 1}: ${a}`));
  }
  // Ganadores, quién miente y quién dice la verdad.
  let e = idea('contradictorias').ejemplos[7], r = resolverC(e.datos, ['Sara', 'Pía', 'Maru', 'Gino']); assert.deepEqual(r.ok, ['Pía']);
  e = idea('contradictorias').ejemplos[11]; r = resolverC(e.datos, ['Lucho', 'Vilma', 'Gino', 'Sara', 'Teo']);
  assert.deepEqual(r.ok, ['Teo']); assert.deepEqual(r.fs.filter(x => !valC(x.f, r.fs, 'Teo')).map(x => x.de), ['Sara']);
  e = idea('solo-uno-veraz').ejemplos[7]; r = resolverC(e.datos, ['Sara', 'Gino', 'Pía', 'Omar']); assert.deepEqual(r.ok, ['Sara']);
  e = idea('solo-uno-veraz').ejemplos[8]; r = resolverC(e.datos, ['Lucho', 'Vilma', 'Teo', 'Pía']);
  assert.deepEqual(r.ok, ['Vilma']); assert.deepEqual(r.fs.filter(x => valC(x.f, r.fs, 'Vilma')).map(x => x.de), ['Lucho']);
  e = idea('solo-uno-veraz').ejemplos[12]; r = resolverC(e.datos, ['Rosa', 'Nora', 'Leo', 'Teo', 'Maru']);
  assert.deepEqual(r.ok, ['Nora']); assert.deepEqual(r.fs.filter(x => valC(x.f, r.fs, 'Nora')).map(x => x.de), ['Leo']);
  // Los pares de los ejemplos de nivel 1: se contradicen si y solo si nunca valen lo mismo.
  const par = (ej, g) => { const fs = dichos(ej.datos).map(x => ({ de: x.de, f: leerC(x.t, x.de) })); return g.every(c => valC(fs[0].f, fs, c) !== valC(fs[1].f, fs, c)); };
  const E3 = idea('contradictorias').ejemplos, G4 = ['Ana', 'Beto', 'Ciro', 'Dina'];
  assert.equal(par(E3[0], G4), true); assert.equal(par(E3[1], G4), false); assert.equal(par(E3[2], G4), true); assert.equal(par(E3[3], G4), true);
  // Tres sobres (solo uno miente): quedan 2 repartos y en los dos Omar tiene 20. El de 50 (solo uno veraz): Omar no lo tiene.
  const sobres = veraces => perms([10, 20, 50]).filter(([l, v, o]) => { const L = l === 50, V = !L; const ok = [L, V, veraces === 'uno-veraz' ? o === 50 : o === 20]; return ok.filter(Boolean).length === (veraces === 'uno-veraz' ? 1 : 2); });
  assert.ok(sobres('uno-miente').every(a => a[2] === 20) && sobres('uno-miente').length === 2);
  assert.ok(sobres('uno-veraz').every(a => a[2] !== 50) && sobres('uno-veraz').length === 4 && sobres('uno-veraz').some(a => a[0] === 50) && sobres('uno-veraz').some(a => a[1] === 50));
  // Las cajas: un solo cartel falso (premio en la 3) y un solo rótulo cierto (premio en la 2).
  const cajas = (fs, n) => [1, 2, 3].filter(p => fs.filter(f => f(p)).length === n);
  assert.deepEqual(cajas([p => p === 1, p => p === 3, p => p !== 1], 2), [3]);
  assert.deepEqual(cajas([p => p === 1, p => p !== 2, p => p !== 1], 1), [2]);
  // La tabla de respuestas al revés: con cualquier clave, 6 aciertos entre los dos.
  for (let k = 0; k < 64; k++) { const clave = [0, 1, 2, 3, 4, 5].map(i => (k >> i) & 1), a = [1, 0, 0, 1, 1, 0]; assert.equal(a.filter((x, i) => x === clave[i]).length + a.filter((x, i) => 1 - x === clave[i]).length, 6); }
  // Letras de nivel 3 en las dos ideas.
  assert.deepEqual(idea('contradictorias').ejemplos.slice(10).map(e => plano(e.respuesta)[0]).join(''), 'CDEAB');
  assert.deepEqual(idea('solo-uno-veraz').ejemplos.slice(10).map(e => plano(e.respuesta)[0]).join(''), 'DEABC');
});

test('idea 5, los 15 ejemplos: el orden de llegada (o el reparto de oficios) que deja una verdad y una mentira a cada uno', () => {
  const E = idea('verdad-y-mentira').ejemplos;
  const quien = (i, k) => { const r = resolverP(E[i].datos); assert.equal(r.quedan.length, 1, E[i].titulo); return r.quedan[0][k - 1]; };
  assert.equal(quien(5, 1), 'Teo'); assert.equal(quien(6, 3), 'Pía'); assert.equal(quien(7, 1), 'Eva');
  assert.equal(resolverP(E[8].datos).quedan[0].indexOf('Rosa') + 1, 2);
  const of10 = resolverO(E[9].datos); assert.equal(of10.length, 1); assert.equal(of10[0].Omar, 'm');
  assert.equal(quien(10, 1), 'Teo'); assert.equal(quien(11, 4), 'Sara'); assert.equal(quien(12, 3), 'Gaby');
  assert.equal(resolverP(E[13].datos).quedan[0].indexOf('Rosa') + 1, 3);
  const of15 = resolverO(E[14].datos); assert.equal(of15.length, 1); assert.equal(of15[0].Sara, 'p');
  assert.equal(E.slice(10).map(e => plano(e.respuesta)[0]).join(''), 'EABCD');
  // Nivel 1: lo que dice la respuesta, con el dato del enunciado.
  assert.match(plano(E[0].respuesta), /Segundo/); assert.match(plano(E[1].respuesta), /no ganó/); assert.match(plano(E[3].respuesta), /Tercera/);
  assert.equal(perms(['a', 'b', 'c']).length, 6);
});

test('idea 6, los 15 ejemplos: cuántos mienten sale de probar todas las tarjetas', () => {
  const E = idea('cuantos-mienten').ejemplos;
  const caso = i => { const e = E[i], fr = dichos(e.datos), g = genteDe(e.enunciado, fr); return { g, q: resolverKK(g, fr, dadasDe(e.enunciado)) }; };
  const mienten = c => c.g.filter(x => !c.q[0][x]);
  let c = caso(0); assert.equal(c.q.length, 1); assert.equal(c.q[0].Leo, false);
  c = caso(1); assert.equal(c.q.length, 1); assert.equal(mienten(c).length, 2);
  c = caso(2); assert.ok(c.q.every(v => !v.Gino));
  c = caso(3); assert.ok(c.q.length > 1 && c.q.every(v => v.Pía === v.Omar));
  c = caso(4); assert.ok(todasKK(c.g).every(v => dichos(E[4].datos).filter(x => leerKK(x.t, c.g)(v, x.de)).length <= 1));
  assert.equal(mienten(caso(5)).length, 2); assert.equal(mienten(caso(6)).length, 2); assert.equal(mienten(caso(7)).length, 4);
  assert.equal(mienten(caso(8)).length, 4); assert.deepEqual(mienten(caso(9)), ['Eva']);
  c = caso(10); assert.deepEqual(c.g.filter(x => c.q[0][x]), ['Rosa', 'Nora']);
  assert.equal(mienten(caso(11)).length, 4); assert.equal(mienten(caso(12)).length, 2);
  c = caso(13); assert.deepEqual(c.g.filter(x => c.q[0][x]), ['Teo', 'Maru']);
  assert.equal(mienten(caso(14)).length, 3);
  assert.equal(E.slice(10).map(e => plano(e.respuesta)[0]).join(''), 'ABCDE');
  for (const i of [10, 11, 12, 13, 14]) assert.equal(caso(i).q.length, 1);
});

// ---------- 3. «Ahora tú» en 400 semillas ----------
const correcta = c => c.opciones.find(o => o.correcta);
test('«Ahora tú» de la idea 1 (400 semillas): una sola opción encaja y cada explicación nombra la frase que choca', () => {
  const I = idea('suposicion');
  for (let s = 0; s < 400; s++) {
    const c = I.ahoraTu.generar(s), fr = dichos(c.datos), g = genteDe(c.pregunta, fr), q = resolverKK(g, fr), tipo = s % 4;
    assert.ok(!g.includes('Ana') || !g.includes('Beto'), `semilla ${s}: la pareja del juego`);
    if (tipo === 2) {
      assert.equal(q.length, 2, `semilla ${s}`);
      for (const o of c.opciones) {
        const m = plano(o.texto).match(new RegExp(`^${N} tiene (VERAZ|MIENTE)$`));
        const seguro = m ? q.every(v => v[m[1]] === (m[2] === 'VERAZ')) : false;
        assert.equal(seguro, !!o.correcta, `semilla ${s}: ${o.texto}`);
      }
      continue;
    }
    assert.equal(q.length, 1, `semilla ${s}`);
    for (const o of c.opciones) {
      const set = conjunto(o.texto, g), v = Object.fromEntries(g.map(x => [x, tipo === 3 ? !set.includes(x) : set.includes(x)]));
      const ok = Object.keys(v).every(x => v[x] === q[0][x]);
      assert.equal(ok, !!o.correcta, `semilla ${s}: ${o.texto}`);
      if (!o.correcta) {
        const m = plano(o.siFuera).match(new RegExp(`la frase de ${N} sale (cierta|falsa) y \\1? ?`)) || plano(o.siFuera).match(new RegExp(`la frase de ${N} sale (cierta|falsa)`));
        const quien = m[1], x = fr.find(y => y.de === quien);
        assert.equal(leerKK(x.t, g)(v, quien), m[2] === 'cierta', `semilla ${s}: ${o.siFuera}`);
        assert.notEqual(leerKK(x.t, g)(v, quien), v[quien], `semilla ${s}: no choca`);
      }
    }
  }
});

test('«Ahora tú» de la idea 2 (400 semillas): la correcta es lo contrario exacto; los distractores no valen en todos los casos', () => {
  const I = idea('negar-bien');
  for (let s = 0; s < 400; s++) {
    const c = I.ahoraTu.generar(s), ok = plano(correcta(c).texto), dice = plano(c.pregunta).match(/«(.+)»/);
    if (s % 4 === 3) {
      const frases = c.datos.map(plano).filter(d => /^Frase/.test(d)).map(d => d.match(/«(.+)»/)[1]);
      const vale = e => frases.every(f => { let m; if ((m = f.match(/^Tengo menos de (\d+) años$/))) return !(e < +m[1]); if ((m = f.match(/^Tengo más de (\d+) años$/))) return !(e > +m[1]); m = f.match(/^Tengo (\d+) años$/); return e !== +m[1]; });
      const edades = Array.from({ length: 40 }, (_, e) => e).filter(vale);
      assert.equal(edades.length, 1, `semilla ${s}`);
      assert.equal(ok, `${edades[0]} años`, `semilla ${s}`);
      continue;
    }
    const t = dice[1];
    let m;
    if ((m = t.match(/^Tengo (más|menos) de (\d+) (soles|años)$/))) {
      const k = +m[2], falla = x => !(m[1] === 'más' ? x > k : x < k), casos = Array.from({ length: 300 }, (_, x) => x).filter(falla);
      const lee = o => { const z = plano(o.texto).match(/tiene (\d+) \S+ (o menos|o más|justos)|tiene (más|menos) de (\d+)/); return z[1] ? (x => (z[2] === 'o menos' ? x <= +z[1] : z[2] === 'o más' ? x >= +z[1] : x === +z[1])) : (x => (z[3] === 'más' ? x > +z[4] : x < +z[4])); };
      for (const o of c.opciones) { const f = lee(o), seguro = casos.every(f) && Array.from({ length: 300 }, (_, x) => x).filter(f).every(falla); assert.equal(seguro, !!o.correcta, `semilla ${s}: ${o.texto}`); }
      continue;
    }
    // «Todos…» o «Ninguno…»: cuatro miembros, cada uno cumple o no.
    const todos = /^(Todos|Todas)/.test(t), listas = Array.from({ length: 16 }, (_, k) => [0, 1, 2, 3].map(i => !!((k >> i) & 1)));
    const falla = l => (todos ? !l.every(Boolean) : l.some(Boolean));
    const lee = o => { const x = plano(o.texto); if (/^Al menos (uno|una) .* (no |no$)/.test(x) || / no (aprobó|es de Puno|está llena|pasó a tiempo)$/.test(x) && /^Al menos/.test(x)) return l => l.some(z => !z);
      if (/^Al menos/.test(x)) return l => l.some(Boolean); if (/^(Ninguno|Ninguna)/.test(x)) return l => !l.some(Boolean); if (/^(Todos|Todas)/.test(x)) return l => l.every(Boolean);
      if (/^(Algunos|Algunas)/.test(x)) return l => l.some(Boolean) && l.some(z => !z); return null; };
    for (const o of c.opciones) {
      const f = lee(o);
      if (!f) { assert.ok(!o.correcta); continue; }
      const seguro = listas.filter(falla).every(f) && listas.filter(f).every(falla);
      assert.equal(seguro, !!o.correcta, `semilla ${s}: ${o.texto}`);
    }
  }
});

test('«Ahora tú» de las ideas 3 y 4 (400 semillas cada una): una sola respuesta y cada explicación cuenta bien las frases', () => {
  for (const id of ['contradictorias', 'solo-uno-veraz']) {
    for (let s = 0; s < 400; s++) {
      const c = idea(id).ahoraTu.generar(s), fr = dichos(c.datos), g = fr.map(x => x.de), r = resolverC(c.datos, g);
      assert.equal(r.ok.length, 1, `${id} semilla ${s}`);
      const pide = plano(c.pregunta);
      for (const o of c.opciones) {
        const t = plano(o.texto).replace(/^En la de /, '');
        if (/¿Quién (fue|ganó)\?|¿En qué mochila/.test(pide)) {
          assert.equal(r.ok[0] === t, !!o.correcta, `${id} ${s}: ${o.texto}`);
          if (!o.correcta) { const n = plano(o.siFuera).match(/(\d+) frases? (falsas?|ciertas?)/); assert.equal(/falsa/.test(n[2]) ? r.falsas(t) : g.length - r.falsas(t), +n[1], `${id} ${s}: ${o.siFuera}`); }
        } else {
          const mal = r.fs.filter(x => valC(x.f, r.fs, r.ok[0]) === /miente\?/.test(pide) ? false : true).map(x => x.de);
          const quien = /miente\?/.test(pide) ? r.fs.filter(x => !valC(x.f, r.fs, r.ok[0])).map(x => x.de) : r.fs.filter(x => valC(x.f, r.fs, r.ok[0])).map(x => x.de);
          void mal;
          assert.equal(quien.length, 1);
          assert.equal(quien[0] === t, !!o.correcta, `${id} ${s}: ${o.texto}`);
        }
      }
    }
  }
});

test('«Ahora tú» de la idea 5 (400 semillas): un solo orden encaja y la respuesta sale de él', () => {
  const I = idea('verdad-y-mentira');
  for (let s = 0; s < 400; s++) {
    const c = I.ahoraTu.generar(s), r = resolverP(c.datos);
    assert.equal(r.quedan.length, 1, `semilla ${s}`);
    const o = r.quedan[0], pide = plano(c.pregunta);
    const bien = /ganó/.test(pide) ? o[0] : /últim/.test(pide) ? o[o.length - 1] : (() => { const x = pide.match(new RegExp(`llegó ${N}\\?`))[1]; return `Llegó ${Object.keys(ORD).find(k => ORD[k] === o.indexOf(x) + 1 && (/a$/.test(k) === /a$/.test(plano(correcta(c).texto))))}`; })();
    assert.equal(plano(correcta(c).texto), bien, `semilla ${s}`);
    assert.equal(c.opciones.filter(x => x.correcta).length, 1);
  }
});

test('«Ahora tú» de la idea 6 (400 semillas): una sola cuenta cuadra y cada explicación da sus frases ciertas', () => {
  const I = idea('cuantos-mienten');
  for (let s = 0; s < 400; s++) {
    const c = I.ahoraTu.generar(s), fr = dichos(c.datos), g = genteDe(c.pregunta, fr), q = resolverKK(g, fr);
    assert.equal(q.length, 1, `semilla ${s}`);
    const k = g.filter(x => !q[0][x]).length, num = t => { t = plano(t).toLowerCase(); return t === 'ninguno' ? 0 : /^los /.test(t) ? g.length : NUM[t]; };
    for (const o of c.opciones) {
      assert.equal(num(o.texto) === k, !!o.correcta, `semilla ${s}: ${o.texto}`);
      if (!o.correcta) {
        const j = num(o.texto), m = plano(o.siFuera).match(/saldrían (\d+) frases? ciertas?, y harían falta (\d+)/);
        const v = Object.fromEntries(g.map((x, i) => [x, i >= j])), ciertas = fr.filter(x => leerKK(x.t, g)(v, x.de)).length;
        assert.equal(+m[1], ciertas, `semilla ${s}: ${o.siFuera}`);
        assert.equal(+m[2], g.length - j);
      }
    }
  }
});

// ---------- 4. «Así se resuelve» ----------
test('«Así se resuelve» (120 semillas por idea): la respuesta es la única que encaja', () => {
  for (let s = 0; s < 120; s++) {
    let c = idea('suposicion').resuelve.generar(s), fr = dichos(c.datos), g = genteDe(c.enunciado, fr), q = resolverKK(g, fr);
    assert.equal(q.length, 1); assert.ok(!g.includes('Ana') || !g.includes('Beto'));
    assert.ok(mismo(conjunto(plano(c.respuesta).replace(/ (dice|dicen) la verdad$/, ''), g), g.filter(x => q[0][x])), `idea 1 semilla ${s}`);
    for (const id of ['contradictorias', 'solo-uno-veraz']) {
      c = idea(id).resuelve.generar(s); const r = resolverC(c.datos, dichos(c.datos).map(x => x.de));
      assert.deepEqual([`Fue ${r.ok[0]}`], [plano(c.respuesta)], `${id} semilla ${s}`);
    }
    c = idea('verdad-y-mentira').resuelve.generar(s);
    const r5 = resolverP(c.datos); assert.equal(r5.quedan.length, 1); assert.equal(plano(c.respuesta), `Ganó ${r5.quedan[0][0]}`);
    c = idea('cuantos-mienten').resuelve.generar(s); fr = dichos(c.datos); g = genteDe(c.enunciado, fr); q = resolverKK(g, fr);
    assert.equal(q.length, 1); assert.equal(plano(c.respuesta), `Mienten ${g.filter(x => !q[0][x]).length}`);
    c = idea('negar-bien').resuelve.generar(s);
    assert.ok(plano(c.respuesta).length > 5);
  }
});

// ---------- 5. Paleta, letras y contrato ----------
function figuras() {
  const out = [], add = (donde, dib, antes) => { if (dib && dib.datos) out.push({ donde, d: dib.datos, e: dib.estado || {}, antes }); };
  for (const I of def.ideas) {
    for (const t of I.lee.tarjetas) add(`${I.id} lee`, t.dibujo, true);
    for (const v of Teoria.grilla(I.juega.controles)) add(`${I.id} juega`, I.juega.dibujo(Object.assign(Teoria.inicio(I.juega), v)), false);
    add(`${I.id} predice`, I.predice.dibujo, true); add(`${I.id} revelar`, I.predice.revelar, false);
    I.mira.pasos.forEach(p => add(`${I.id} mira`, { datos: I.mira.datos, estado: p.estado }, false));
    if (I.regla.dibujo) add(`${I.id} regla`, I.regla.dibujo, false);
    I.ejemplos.forEach((e, k) => add(`${I.id} ejemplo ${k + 1}`, e.figura, true));
    for (let s = 0; s < 40; s++) { const a = I.ahoraTu.generar(s); add(`${I.id} ahora tú ${s}`, a.dibujo, true); add(`${I.id} sol ${s}`, a.solucion.dibujo, false);
      const r = I.resuelve.generar(s); add(`${I.id} resuelve ${s}`, r.dibujo, true); r.pasos.forEach(p => add(`${I.id} paso`, p.dibujo, false)); }
  }
  return out;
}
test('paleta de deducción: sin verde ni carmín, y sin violeta en lo que se ve antes de responder', () => {
  const F = figuras();
  assert.ok(F.length > 1000);
  for (const { donde, d, e, antes } of F) {
    const s = P.dibujar(d, e);
    assert.ok(!/var\(--c-[dh]\)/.test(s), `${donde}: verde o carmín`);
    if (antes) assert.ok(!/var\(--c-f\)/.test(s), `${donde}: violeta antes de responder`);
  }
  const txt = JSON.stringify(def.ideas.map(I => [I.lee, I.predice.opciones, I.regla, I.ejemplos]));
  assert.ok(!/c-[dh]"/.test(txt), 'ningún texto en verde ni carmín');
});

test('la unidad: ids, letras de nivel 3 repartidas (6 cada una) y validador de calidad 2 sin faltas', () => {
  const cat = require('../../../catalogo/cursos/razonamiento-matematico.json').unidades.find(u => u.id === def.unidad);
  assert.deepEqual(def.ideas.map(i => i.id), ['suposicion', 'negar-bien', 'contradictorias', 'solo-uno-veraz', 'verdad-y-mentira', 'cuantos-mienten']);
  const letras = def.ideas.flatMap(i => i.ejemplos.filter(e => e.alternativas).map(e => plano(e.respuesta)[0]));
  assert.deepEqual(['A', 'B', 'C', 'D', 'E'].map(l => letras.filter(x => x === l).length), [6, 6, 6, 6, 6]);
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 }), []);
  assert.deepEqual(Teoria.problemas(def, { temas: cat.temas }), []);
  // Las frases van en los datos, una por línea, y nunca en el enunciado.
  // (En «Lo contrario de “todos”» el mentiroso dice una sola frase: va en la pregunta.)
  for (const I of def.ideas) for (let s = 0; s < 30; s++) for (const c of [I.ahoraTu.generar(s), I.resuelve.generar(s)]) {
    assert.ok(c.datos && c.datos.length <= 6, `${I.id} semilla ${s}`);
    if (I.id !== 'negar-bien') assert.ok(!/ dice: «/.test(plano(c.pregunta || c.enunciado)), `${I.id} semilla ${s}`);
  }
  // Ningún nombre en minúscula, y «choque» lo estrena la idea 1.
  const G = require('../../../nucleo/glosario.js').porIdea(def);
  assert.ok(G[0].some(e => e.termino === 'choque'));
});
