// Pruebas de «Veraces, culpables y mentiras» (rm-verdades): un camino independiente que no usa el generador (lee las
// frases del texto que ve el alumno, en los datos, y prueba todas las tarjetas, culpables, órdenes o edades), una sola
// respuesta en 600 semillas, los tipos por idea, el recuadro «Datos», la paleta, casos.json y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const N = '([A-ZÁÉÍÓÚ][a-záéíóúñ]+)';
const NUM = { uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };
const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
const dichos = datos => datos.map(d => d.match(/^([A-ZÁÉÍÓÚ][a-záéíóúñ]+) dice: «(.+)»\.$/)).filter(Boolean).map(m => ({ de: m[1], t: m[2] }));

function leerKK(t, gente) {
  let x; const m = s => t.match(new RegExp(`^${s}$`)), k = v => gente.filter(z => !v[z]).length;
  if ((x = m(`${N} y yo mentimos`))) return (v, de) => !v[x[1]] && !v[de];
  if ((x = m(`${N} y yo decimos la verdad`))) return (v, de) => v[x[1]] && v[de];
  if ((x = m(`${N} y ${N} mienten`))) return v => !v[x[1]] && !v[x[2]];
  if ((x = m(`${N} y ${N} dicen la verdad`))) return v => v[x[1]] && v[x[2]];
  if ((x = m('Aquí (?:miente|mienten) exactamente ([a-z]+)'))) return v => k(v) === NUM[x[1]];
  if ((x = m('Aquí mentimos los ([a-z]+)'))) return v => k(v) === NUM[x[1]];
  if ((x = m('Aquí (?:miente|mienten) por lo menos ([a-z]+)'))) return v => k(v) >= NUM[x[1]];
  if ((x = m(`${N} miente`))) return v => !v[x[1]];
  if ((x = m(`${N} dice la verdad`))) return v => v[x[1]];
  throw new Error(`no sé leer «${t}»`);
}
function leerC(t, de) {
  let x;
  if (/^(Fui yo|Está en la mía)$/.test(t)) return { si: de };
  if (/^(Yo no fui|No está en la mía)$/.test(t)) return { no: de };
  if ((x = t.match(new RegExp(`^(?:Fue|Está en la de) ${N}$`)))) return { si: x[1] };
  if ((x = t.match(new RegExp(`^(?:No fue|No está en la de) ${N}$`)))) return { no: x[1] };
  if ((x = t.match(new RegExp(`^${N} miente$`)))) return { miente: x[1] };
  throw new Error(`no sé leer «${t}»`);
}
const valC = (f, todas, c) => (f.si ? c === f.si : f.no ? c !== f.no : !valC(todas.find(y => y.de === f.miente).f, todas, c));
const ORD = { primero: 1, primera: 1, segundo: 2, segunda: 2, tercero: 3, tercera: 3, cuarto: 4, cuarta: 4 };

// La respuesta (clave), calculada sin el generador.
function recalcular(p) {
  const d = p._datos, datos = p.datos;
  const unica = xs => (xs.length === 1 ? xs[0] : null);
  if (d.forma === 'tarjetas') {
    const fr = dichos(datos), g = d.gente;
    const q = Array.from({ length: 2 ** g.length }, (_, k) => Object.fromEntries(g.map((x, i) => [x, !((k >> i) & 1)])))
      .filter(v => fr.every(x => leerKK(x.t, g)(v, x.de) === v[x.de]));
    if (q.length !== 1) return null;
    const v = q[0];
    if (d.pide === 'cuantos') return `k:${g.filter(x => !v[x]).length}`;
    const qs = g.filter(x => (d.pide === 'mienten' ? !v[x] : v[x]));
    return `t:${!qs.length ? 'Nadie' : qs.length === g.length ? `Los ${['', '', 'dos', 'tres', 'cuatro'][g.length]}` : qs.length === 1 ? `Solo ${qs[0]}` : qs.length === 2 ? `${qs[0]} y ${qs[1]}` : `${qs.slice(0, -1).join(', ')} y ${qs[qs.length - 1]}`}`;
  }
  if (d.forma === 'culpa') {
    const fs = dichos(datos).map(x => ({ de: x.de, f: leerC(x.t, x.de) })), n = fs.length, pide = d.falsas;
    const ok = d.gente.filter(c => fs.filter(x => !valC(x.f, fs, c)).length === pide);
    if (ok.length !== 1) return null;
    if (d.pide === 'miente') return unica(fs.filter(x => !valC(x.f, fs, ok[0])).map(x => `p:${x.de}`));
    void n;
    return `p:${ok[0]}`;
  }
  if (d.forma === 'podio') {
    const fr = datos.map(x => x.match(/^([A-ZÁÉÍÓÚ][a-záéíóúñ]+) dice: «(.+)» y «(.+)»\.$/)).filter(Boolean);
    const lee = (t, de) => { let m; if ((m = t.match(/^Llegué ([a-z]+)$/))) return o => o.indexOf(de) + 1 === ORD[m[1]]; m = t.match(new RegExp(`^${N} llegó ([a-z]+)$`)); return o => o.indexOf(m[1]) + 1 === ORD[m[2]]; };
    const fs = fr.map(m => [lee(m[2], m[1]), lee(m[3], m[1])]);
    const q = perms(d.gente).filter(o => fs.every(f => f.filter(g => g(o)).length === 1));
    return q.length === 1 ? `p:${q[0][0]}` : null;
  }
  if (d.forma === 'edad') {
    const ok = Array.from({ length: 40 }, (_, e) => e).filter(e => d.frases.every(t => { let m; if ((m = t.match(/menos de (\d+)/))) return !(e < +m[1]); if ((m = t.match(/más de (\d+)/))) return !(e > +m[1]); return e !== +t.match(/(\d+)/)[1]; }));
    return ok.length === 1 ? `e:${ok[0]}` : null;
  }
  if (d.forma === 'grupo' || d.forma === 'cantidad') return 'ok';
  return null;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

test('tipos por idea: generar(semilla, { idea }) da solo los tipos de esa idea, y las seis ideas tienen tipos', () => {
  const T = gen.TIPOS_POR_IDEA;
  assert.deepEqual(Object.keys(T), ['suposicion', 'negar-bien', 'contradictorias', 'solo-uno-veraz', 'verdad-y-mentira', 'cuantos-mienten']);
  for (const [idea, tipos] of Object.entries(T)) for (let s = 0; s < 60; s++) {
    const p = gen.generar(`i${s}`, { idea });
    assert.ok(tipos.includes(p._datos.tipo), `${idea}: tipo ${p._datos.tipo}`);
    assert.equal(p._datos.idea, idea);
  }
  const niveles = new Set([...Array(300).keys()].map(s => gen.generar(s)._datos.nivel));
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('«Lo contrario»: la correcta vale justo cuando la frase del mentiroso falla, y los distractores no', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s, { idea: 'negar-bien' });
    if (p._datos.tipo !== 'negar') continue;
    const dice = p._datos.dice, ok = p.alternativas.find(a => a.correcta).texto;
    let m;
    if ((m = dice.match(/^Tengo (más|menos) de (\d+) (soles|años)$/))) {
      const k = +m[2], falla = x => !(m[1] === 'más' ? x > k : x < k), xs = Array.from({ length: 300 }, (_, x) => x);
      const lee = t => { const z = t.match(/tiene (\d+) \S+ (o menos|o más|justos)|tiene (más|menos) de (\d+)/); if (!z) return null; return z[1] ? (x => (z[2] === 'o menos' ? x <= +z[1] : z[2] === 'o más' ? x >= +z[1] : x === +z[1])) : (x => (z[3] === 'más' ? x > +z[4] : x < +z[4])); };
      for (const a of p.alternativas) { const f = lee(a.texto); if (!f) { assert.ok(!a.correcta); continue; } assert.equal(xs.every(x => falla(x) === f(x)), a.correcta, `semilla ${s}: ${a.texto}`); }
      continue;
    }
    const todos = /^(Todos|Todas)/.test(dice), listas = Array.from({ length: 16 }, (_, k) => [0, 1, 2, 3].map(i => !!((k >> i) & 1)));
    const falla = l => (todos ? !l.every(Boolean) : l.some(Boolean));
    const lee = t => { if (/^Al menos/.test(t)) return /^no /.test(t.replace(/^Al menos (uno|una) de (los de su grupo|sus primos|las cajas del aula) /, '')) ? (l => l.some(z => !z)) : (l => l.some(Boolean));
      if (/^(Ninguno|Ninguna)/.test(t)) return l => !l.some(Boolean); if (/^(Todos|Todas)/.test(t)) return l => l.every(Boolean); if (/^(Algunos|Algunas)/.test(t)) return l => l.some(Boolean) && l.some(z => !z); return null; };
    for (const a of p.alternativas) { const f = lee(a.texto); if (!f) { assert.ok(!a.correcta); continue; } assert.equal(listas.every(l => falla(l) === f(l)), a.correcta, `semilla ${s}: ${a.texto}`); }
    assert.ok(ok);
  }
});

test('datos: lista de líneas cortas, con las frases aparte del enunciado y sin la respuesta', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = `semilla ${s}`;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6, d);
    for (const l of p.datos) {
      assert.equal(typeof l, 'string', d);
      assert.ok((l.match(/[\p{L}\p{N}]+/gu) || []).length <= 22, `${d}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate|Primero)/.test(l), `${d}: consejo en datos`);
    }
    if (p._datos.tipo !== 'negar') assert.ok(!/ dice: «/.test(plano(p.enunciado) + plano(p.pregunta)), `${d}: frases en el enunciado`);
  }
});

test('paleta de deducción: solo violeta (x), y solo en la solución', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(s);
    assert.deepEqual(Object.keys(p.variables), ['x']);
    assert.equal(p.variables.x.color, 'f');
    assert.ok(!/"v":/.test(JSON.stringify([p.enunciado, p.pregunta])), `semilla ${s}: color en la pregunta`);
    assert.ok(JSON.stringify(p.solucion).includes('"v":"x"'), `semilla ${s}: la solución no marca lo pedido`);
  }
});

test('casos.json: cada caso vuelve a salir igual y su respuesta la confirma el camino independiente', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}`);
    assert.equal(p.respuesta.valor, c.esperado.clave, `semilla ${c.semilla}`);
    assert.equal(p.respuesta.texto, c.esperado.texto, `semilla ${c.semilla}`);
    assert.equal(recalcular(p), c.esperado.clave, `semilla ${c.semilla}`);
  }
});

test('papel: 8 problemas al día con el generador, con sus datos', () => {
  assert.equal(papel.problemas.length, 8);
  for (const pr of papel.problemas) assert.match(pr.enunciado, / Datos: /);
});
