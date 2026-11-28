// Pruebas propias de «Razonamiento inductivo» (etapa 8: las seis ideas rehechas).
// Todo se vuelve a resolver aquí sin el código de la unidad: un resolvedor lee el TEXTO que ve el alumno (enunciado o
// pregunta) y rehace la cuenta por otro camino:
//   · fósforos: arma la figura como un conjunto de lados de una cuadrícula (o de una malla de triángulos) y los cuenta;
//   · chapitas y monedas: ajusta la parábola que pasa por los tres primeros casos (Lagrange) y la evalúa;
//   · latas: escribe la lista de impares (o 1, 2, 3…, o la pirámide de sumas) fila por fila y suma;
//   · cuentas largas: multiplica con BigInt el número escrito entero y suma sus cifras;
//   · ciclos: escribe la lista término por término hasta el lugar pedido;
//   · primos: prueba divisores uno por uno.
//   1. Los juegos (la misión tiene una sola salida y no está cumplida al abrir) y las predicciones.
//   2. Los 90 ejemplos: la respuesta y, en los de nivel 3, que la correcta es la única alternativa con ese valor.
//   3. «Ahora tú» en 400 semillas por idea: una sola opción correcta, la del resolvedor; varios errores dan su valor.
//   4. «Así se resuelve» en 200 semillas: la respuesta es la del resolvedor.
//   5. Lo que no se repite (juego, predicción y ejemplos en «Ahora tú» y «Así se resuelve»), la paleta (sin verde ni
//      carmín), toda igualdad escrita en «Mira», «Ahora tú» y «Así se resuelve» y el validador con calidad 2.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./razonamiento-inductivo.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const plano = x => Teoria.plano(x).replace(/[  ]/g, ' ');
const idea = id => def.ideas.find(i => i.id === id);
const num = s => +String(s).replace(/[\s  ]/g, '');
const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const primo = x => x > 1 && rango(2, Math.floor(Math.sqrt(x))).every(d => x % d);

// ---------- Fósforos: lados de una cuadrícula o de una malla de triángulos ----------
function lados(forma, k) {
  const L = new Set(), seg = (a, b) => L.add([a, b].map(p => p.join(',')).sort().join('|'));
  for (let i = 0; i < k; i++) {
    if (forma === 'cuadrado') { seg([i, 0], [i + 1, 0]); seg([i, 1], [i + 1, 1]); seg([i, 0], [i, 1]); seg([i + 1, 0], [i + 1, 1]); }
    if (forma === 'doble') for (const y of [0, 1]) { seg([i, y], [i + 1, y]); seg([i, y + 1], [i + 1, y + 1]); seg([i, y], [i, y + 1]); seg([i + 1, y], [i + 1, y + 1]); }
    if (forma === 'casita') { seg([2 * i, 0], [2 * i + 2, 0]); seg([2 * i, 2], [2 * i + 2, 2]); seg([2 * i, 0], [2 * i, 2]); seg([2 * i + 2, 0], [2 * i + 2, 2]); seg([2 * i, 0], [2 * i + 1, -2]); seg([2 * i + 2, 0], [2 * i + 1, -2]); }
    // Triángulo i de la tira: vértices en dos rectas (abajo b0, b1…; arriba a0, a1…), alternados.
    if (forma === 'triangulo') { const j = Math.floor(i / 2); if (i % 2 === 0) { seg(['b', j], ['b', j + 1]); seg(['b', j], ['a', j]); seg(['a', j], ['b', j + 1]); } else { seg(['a', j], ['a', j + 1]); seg(['a', j], ['b', j + 1]); seg(['a', j + 1], ['b', j + 1]); } }
  }
  return L.size;
}
const formaDe = t => (/casitas/.test(t) ? 'casita' : /columnas de dos/.test(t) ? 'doble' : /triángulos/.test(t) ? 'triangulo' : /cuadrados/.test(t) ? 'cuadrado' : null);
// Lagrange por tres puntos (x = 1, 2, 3 o los que se den).
const parabola = ps => x => ps.reduce((s, [xi, yi], i) => s + yi * ps.reduce((p, [xj], j) => (j === i ? p : p * (x - xj) / (xi - xj)), 1), 0);
const fila = (tipo, i) => {
  if (tipo === 'pascal') { let f = [1]; for (let k = 1; k < i; k++) { const g = [1]; for (let j = 1; j < f.length; j++) g.push(f[j - 1] + f[j]); g.push(1); f = g; } return f; }
  let n0 = 0; for (let k = 1; k < i; k++) n0 += k;
  return rango(1, i).map(j => (tipo === 'impares' ? 2 * (n0 + j) - 1 : n0 + j));
};
const cuad = s => (BigInt(s) * BigInt(s)).toString();
const sumaCif = s => String(s).split('').reduce((a, c) => a + +c, 0);
const COLOR = { roja: 'R', verde: 'V', negra: 'N', blanca: 'B', dorada: 'D', celeste: 'C' };
function polinomio(t) {
  let m;
  if ((m = t.match(/n × n \+ n \+ (\d+)/))) return n => n * n + n + +m[1];
  if ((m = t.match(/n × n − n \+ (\d+)/))) return n => n * n - n + +m[1];
  if ((m = t.match(/6 × n ([+−]) 1/))) return n => 6 * n + (m[1] === '+' ? 1 : -1);
  if (/2 × n × n \+ 11/.test(t)) return n => 2 * n * n + 11;
  if (/2 × n \+ 1\b/.test(t)) return n => 2 * n + 1;
  return null;
}

// ---------- El resolvedor: lee el texto y devuelve la respuesta (número o texto) ----------
function resolver(t) {
  let m;
  t = t.replace(/[  ]/g, ' ').replace(/(\d) (?=\d{3}(?!\d))/g, '$1');
  // Idea 3, la cuadrícula de la apertura: cuadrados de todos los tamaños, contados esquina por esquina.
  if ((m = t.match(/cuadrículas de n × n.*¿Cuántos tiene la de (\d+) × \1\?/))) {
    const n = +m[1]; let c = 0;
    for (let k = 1; k <= n; k++) for (let x = 0; x + k <= n; x++) for (let y = 0; y + k <= n; y++) c++;
    return c;
  }
  // Idea 1
  const fo = formaDe(t);
  if (fo && /fósforos/.test(t)) {
    if ((m = t.match(/dos cajas con (\d+) fósforos/))) { const T = 2 * +m[1]; let k = 1; while (lados(fo, k + 1) <= T) k++; return k; }
    if (/cuántos fósforos trae cada/.test(t)) return lados(fo, 2) - lados(fo, 1);
    if ((m = t.match(/más tiene la figura (\d+) que la figura (\d+)/))) return lados(fo, +m[1]) - lados(fo, +m[2]);
    if ((m = t.match(/usa (\d+) fósforos/))) { for (let k = 1; k < 500; k++) if (lados(fo, k) === +m[1]) return k; return null; }
    if ((m = t.match(/tiene la (?:figura|fila de) (\d+)/))) return lados(fo, +m[1]);
  }
  // Idea 2
  const P = polinomio(t);
  if (P && (m = t.match(/desde (\d+)/))) {
    if (/primer n que no cumple/.test(t)) { for (let x = +m[1]; ; x++) if (!primo(P(x))) return `n = ${x}`; }
    return { contra: x => !primo(P(x)) };
  }
  if ((m = t.match(/La lista (\d+), (\d+), (\d+) sigue esta regla: (.*?)\. ¿Cuál es el (cuarto|quinto)/))) {
    const xs = [+m[1], +m[2], +m[3]], hasta = m[5] === 'cuarto' ? 4 : 5;
    let d = xs[2] - xs[1], paso = /crece de (\d+) en/.test(m[4]) ? +m[4].match(/crece de (\d+) en/)[1] : /después 2, después 3/.test(m[4]) ? 1 : 0;
    while (xs.length < hasta) {
      if (/doble del anterior, más 1/.test(m[4])) xs.push(2 * xs[xs.length - 1] + 1);
      else if (/doble del anterior/.test(m[4])) xs.push(2 * xs[xs.length - 1]);
      else { d += paso; xs.push(xs[xs.length - 1] + d); }
    }
    return xs[hasta - 1];
  }
  // Idea 3
  if ((m = t.match(/las figuras 1, 2 y 3 tienen (\d+), (\d+) y (\d+) chapitas/))) {
    const f = parabola([[1, +m[1]], [2, +m[2]], [3, +m[3]]]);
    if ((m = t.match(/figura (\d+)\?/)) && /Cuántas tiene/.test(t)) return Math.round(f(+m[1]));
    if ((m = t.match(/Qué figura tiene (\d+) chapitas/))) { for (let k = 1; k < 200; k++) if (Math.round(f(k)) === +m[1]) return k; }
    if ((m = t.match(/pasar de la figura (\d+) a la (\d+)/))) return Math.round(f(+m[2]) - f(+m[1]));
  }
  if (/monedas en triángulo/.test(t)) {
    const f = parabola([[1, 1], [2, 3], [3, 6]]);
    if ((m = t.match(/monedas tiene la figura (\d+)/))) return Math.round(f(+m[1]));
    if ((m = t.match(/Qué figura tiene (\d+) monedas/))) { for (let k = 1; k < 200; k++) if (Math.round(f(k)) === +m[1]) return k; }
  }
  if ((m = t.match(/Con 2 monedas por lado hay (\d+) puntos de contacto; con 3, (\d+); con 4, (\d+)\. ¿Cuántos hay con (\d+) por lado/))) return Math.round(parabola([[2, +m[1]], [3, +m[2]], [4, +m[3]]])(+m[4]));
  // Idea 4
  const tipo = /impares en orden/.test(t) ? 'impares' : /1, 2, 3, 4… en orden/.test(t) ? 'naturales' : /suma de los dos que tiene encima/.test(t) ? 'pascal' : null;
  if (tipo) {
    if ((m = t.match(/suman las latas de la fila (\d+)|suma la fila (\d+)/))) return fila(tipo, +(m[1] || m[2])).reduce((a, b) => a + b, 0);
    if ((m = t.match(/última lata de la fila (\d+)/))) { const f = fila(tipo, +m[1]); return f[f.length - 1]; }
    if ((m = t.match(/primera lata de la fila (\d+)/))) return fila(tipo, +m[1])[0];
    if ((m = t.match(/lata con el (\d+)/))) { for (let k = 1; ; k++) if (fila(tipo, k).includes(+m[1])) return k; }
    if ((m = t.match(/fila 4 termina en (\d+)\. ¿Qué número lleva la última lata de la fila 5/))) { const f = fila(tipo, 5); return f[f.length - 1]; }
  }
  // Idea 5
  if ((m = t.match(/(\d)\1*…\1 × \d+…\d, con (\d+) (?:nueves|cifras \d)/))) {
    const d = m[1], n = +m[2], r = cuad(d.repeat(n));
    if (/suman las cifras/.test(t)) return sumaCif(r);
    if (/Cuántas cifras tiene/.test(t)) return r.length;
    if (/Cuántos ceros/.test(t)) return (r.match(/0/g) || []).length;
    if (/Cuántas cifras 9/.test(t)) return (r.match(/9/g) || []).length;
    if ((m = t.match(/ocupa el lugar (\d+)/))) return +r[+m[1] - 1];
  }
  if ((m = t.match(/(?:resultado de|cifras de) ((?:\d[  ]?)+) × ((?:\d[  ]?)+)\?/))) {
    const r = cuad(String(num(m[1])));
    if (/suman las cifras/.test(t)) return sumaCif(r);
    if (/Cuántas cifras tiene/.test(t)) return r.length;
    if (/en el medio/.test(t)) return +r[(r.length - 1) / 2];
  }
  // Idea 6
  if ((m = t.match(/pulsera repite (.*?), siempre en ese orden\. ¿De qué color es la mostacilla del lugar (\d+)/))) {
    const ciclo = m[1].split(/, | y /).map(x => COLOR[x]), lista = []; while (lista.length < +m[2]) lista.push(...ciclo);
    return lista[+m[2] - 1];
  }
  if ((m = t.match(/(?:Un número empieza con (\d) y sigue con el bloque|Se escribe el bloque) (\d+) (?:repetido|una y otra vez)/))) {
    const pre = m[1] || '', bloque = m[2]; let s = pre; while (s.length < 400) s += bloque;
    if ((m = t.match(/suman las (\d+) primeras cifras/))) return sumaCif(s.slice(0, +m[1]));
    if ((m = t.match(/ocupa el lugar (\d+)/))) return +s[+m[1] - 1];
  }
  if ((m = t.match(/sucesión empieza (\d), (\d)\. Desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores.*?¿Cuál es el término (\d+)/))) {
    const s = [+m[1], +m[2]]; while (s.length < +m[3]) s.push(s[s.length - 1] * s[s.length - 2] % 10); return s[+m[3] - 1];
  }
  return undefined;
}
// Una respuesta escrita (opción, alternativa o respuesta de un ejemplo) contra la del resolvedor.
function vale(texto, bien) {
  const t = plano(texto);
  if (typeof bien === 'number') { const ns = t.match(/\d[\d  ]*/g); return !!ns && ns.some(x => num(x) === bien) && !(ns.length > 1 && /figura|fila/.test(t) && num(ns[ns.length - 1]) !== bien); }
  if (typeof bien === 'string' && bien.length === 1) return Object.entries(COLOR).some(([k, v]) => v === bien && new RegExp(`\\b${k}\\b`, 'i').test(t));
  return new RegExp(bien.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!\\d)').test(t);
}

test('juegos: cada misión tiene una sola salida en la grilla y no está cumplida al abrir', () => {
  for (const i of def.ideas) {
    const j = i.juega, ini = Teoria.inicio(j), g = Teoria.grilla(j.controles);
    assert.ok(!j.mision.logrado(ini), `${i.id}: cumplida al abrir`);
    const si = g.filter(v => j.mision.logrado(Object.assign({}, ini, v)));
    assert.ok(si.length >= 1, i.id);
    if (i.id !== 'lo-que-se-repite') assert.equal(si.length, 1, `${i.id}: ${JSON.stringify(si)}`);
    else assert.deepEqual(si.map(v => v.k), [24, 28]);
  }
  // Las cuentas de las misiones, rehechas: 19 fósforos, 8 pedazos, 30 chapitas, 64 en la fila, 36 en las cifras.
  assert.equal(lados('cuadrado', 6), 19);
  assert.equal(fila('impares', 4).reduce((a, b) => a + b, 0), 64);
  assert.equal(sumaCif(cuad('9999')), 36);
});

test('predicciones: la opción correcta es la del resolvedor y los errores dan su valor', () => {
  const P = id => idea(id).predice, ok = id => P(id).opciones.find(o => o.correcta).texto;
  assert.ok(vale(ok('figuras-que-crecen'), lados('cuadrado', 20)));
  assert.ok(vale(P('figuras-que-crecen').opciones.find(o => o.id === 'prop').texto, 4 * lados('cuadrado', 5)));
  assert.ok(vale(ok('tres-casos-no-prueban'), 31));   // la torta de 6 velitas: lo cuenta la prueba de rm-patrones
  assert.ok(vale(ok('cada-caso-con-su-lugar'), Math.round(parabola([[1, 2], [2, 6], [3, 12]])(10))));
  assert.ok(vale(P('cada-caso-con-su-lugar').opciones.find(o => o.id === 'lineal').texto, 2 + 4 * 9));
  assert.ok(vale(ok('arreglo-triangular'), fila('impares', 10).reduce((a, b) => a + b, 0)));
  assert.ok(vale(P('arreglo-triangular').opciones.find(o => o.id === 'cien').texto, rango(1, 10).map(k => 2 * k - 1).reduce((a, b) => a + b, 0)));
  assert.ok(vale(P('arreglo-triangular').opciones.find(o => o.id === 'lineal').texto, 27 + 19 * 7));
  assert.ok(vale(ok('cuenta-larga'), sumaCif(cuad('9'.repeat(25)))));
  assert.ok(vale(P('cuenta-larga').opciones.find(o => o.id === 'solo9').texto, 9 * 24));
  const pul = []; while (pul.length < 50) pul.push('R', 'V', 'N', 'B');
  assert.ok(vale(ok('lo-que-se-repite'), pul[49]));
  assert.ok(vale(P('lo-que-se-repite').opciones.find(o => o.id === 'negra').texto, pul[50]) && vale(P('lo-que-se-repite').opciones.find(o => o.id === 'roja').texto, pul[48]));
});

test('ejemplos: 15 por idea, la respuesta es la del resolvedor y, con alternativas, una sola vale', () => {
  let n = 0;
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const [k, e] of i.ejemplos.entries()) {
      const t = plano(e.enunciado), bien = resolver(t), donde = `${i.id} ejemplo ${k + 1}`;
      if (bien === undefined) continue;   // los conceptuales (sí o no, cuál regla) se miran abajo, uno por uno
      n++;
      if (bien && bien.contra) { const ok = (e.alternativas || []).filter(a => bien.contra(+plano(a).match(/\d+/)[0])); if (e.alternativas) assert.equal(ok.length, 1, donde); continue; }
      assert.ok(vale(e.respuesta, bien), `${donde}: «${plano(e.respuesta)}» y el resolvedor da ${bien}`);
      if (e.alternativas) assert.equal(e.alternativas.filter(a => vale(a, bien)).length, 1, `${donde}: alternativas`);
    }
  }
  assert.ok(n >= 75, `${n} ejemplos resueltos aparte`);
  // Los conceptuales, a mano: 27 es el único compuesto; 3 × 3 + 1 = 10 es par; 2047 = 23 × 89; 2 + 3 es la única suma impar.
  assert.ok(!primo(27) && [7, 17, 37].every(primo) && (3 * 3 + 1) % 2 === 0 && 23 * 89 === 2047 && [3, 7, 31, 127].every(primo));
  assert.deepEqual([[3, 5], [5, 7], [11, 13], [7, 7], [2, 3]].filter(([a, b]) => (a + b) % 2 === 1), [[2, 3]]);
  assert.deepEqual([1, 2, 3, 4, 5].map(x => x * x - x + 11).every(primo), true);
  assert.ok(primo(6 * 6 - 1 + 6) && primo(1601) && !primo(1681));
});

test('«Ahora tú» en 400 semillas: una sola opción correcta, la del resolvedor; los errores no la repiten', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), t = plano(a.pregunta), bien = resolver(t), donde = `${i.id} semilla ${s}: ${t}`;
    assert.notEqual(bien, undefined, donde);
    const buenas = a.opciones.filter(o => (bien.contra ? bien.contra(+plano(o.texto).match(/\d+/)[0]) : vale(o.texto, bien)));
    assert.equal(buenas.length, 1, `${donde} → ${a.opciones.map(o => o.texto).join(' / ')} (${bien.contra ? 'contraejemplo' : bien})`);
    assert.ok(buenas[0].correcta, `${donde}: la marcada no es la del resolvedor`);
    for (const o of a.opciones) if (!o.correcta) assert.ok(o.error && o.siFuera, donde);
    // Valores de errores que se rehacen: el de RMP161 (el caso siguiente) y el de RMP160 (sin lo de la primera figura).
    const sig = a.opciones.find(o => o.id === 'sig'), mT = t.match(/(?:figura|fila) (\d+)\?/);
    if (sig && mT && i.id !== 'cuenta-larga' && !/última lata/.test(t)) assert.ok(vale(sig.texto, resolver(t.replace(/(figura|fila) \d+\?/, `$1 ${+mT[1] + 1}?`))), `${donde}: «${sig.texto}» no es el caso siguiente`);
  }
});

test('«Así se resuelve» en 200 semillas: la respuesta es la del resolvedor', () => {
  for (const i of def.ideas) for (let s = 0; s < 200; s++) {
    const r = i.resuelve.generar(s), t = plano(r.enunciado), bien = resolver(t);
    assert.notEqual(bien, undefined, `${i.id} ${s}: ${t}`);
    assert.ok(vale(r.respuesta, bien), `${i.id} ${s}: «${plano(r.respuesta)}» y el resolvedor da ${bien} (${t})`);
  }
});

test('no se repite: «Ahora tú» y «Así se resuelve» no traen el caso de un ejemplo, del juego ni de la predicción', () => {
  // Firma: los números del enunciado y lo que se pide.
  const firma = t => `${(t.match(/\d[\d  ]*/g) || []).map(num).join(',')}|${t.replace(/\d[\d  ]*/g, '#')}`;
  for (const i of def.ideas) {
    const vistas = new Set(i.ejemplos.map(e => firma(plano(e.enunciado))).concat([firma(plano(i.predice.pregunta))]));
    for (let s = 0; s < 400; s++) {
      const a = plano(i.ahoraTu.generar(s).pregunta), r = s < 200 ? plano(i.resuelve.generar(s).enunciado) : null;
      assert.ok(!vistas.has(firma(a)), `${i.id} «Ahora tú» ${s} repite: ${a}`);
      if (r) assert.ok(!vistas.has(firma(r)), `${i.id} «Así se resuelve» ${s} repite: ${r}`);
    }
  }
  // Las de la predicción, en particular: la fila de 20, la torta de 6, la figura 10, la fila 10, 25 nueves y el lugar 50.
  const ahora = (id, n) => rango(0, n - 1).map(s => plano(idea(id).ahoraTu.generar(s).pregunta));
  assert.ok(!ahora('figuras-que-crecen', 400).some(t => /cuadrados pegados\. ¿Cuántos fósforos tiene la figura 20\?/.test(t)));
  assert.ok(!ahora('lo-que-se-repite', 400).some(t => /roja, verde, negra y blanca, siempre en ese orden\. ¿De qué color es la mostacilla del lugar 50\?/.test(t)));
});

test('igualdades: toda cuenta escrita con números en «Mira», ejemplos, «Ahora tú» y «Así se resuelve» se cumple', () => {
  // a × b = c, a + b = c, a − b = c, a ÷ b = c (con números y espacios de miles); los ⇒ y los «≠» no se miran.
  const cuentas = s => [...s.replace(/[  ]/g, ' ').matchAll(/((?:\(?\d[\d ]*\)?\s*[×+−÷]\s*)+\(?\d[\d ]*\)?)\s*=\s*(\d[\d ]*\d|\d)(?![\d,])(?!\s*[×+−÷])/g)];
  const evalua = e => Function(`return (${e.replace(/(\d) (?=\d{3})/g, '$1').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')})`)();
  const mirar = (s, donde) => { for (const [, izq, der] of cuentas(s)) { if ((izq.match(/\(/g) || []).length !== (izq.match(/\)/g) || []).length) continue; const v = evalua(izq); assert.ok(Math.abs(v - num(der)) < 1e-9, `${donde}: ${izq} = ${der} (da ${v})`); } };
  for (const i of def.ideas) {
    for (const p of i.mira.pasos) mirar(plano(p.ecuacion || '') + ' ' + plano(p.texto), `${i.id} mira`);
    for (const [k, e] of i.ejemplos.entries()) for (const l of e.solucion) mirar(plano(l.texto) + ' ' + plano(l.ecuacion || ''), `${i.id} ejemplo ${k + 1}`);
    for (let s = 0; s < 400; s++) {
      const a = i.ahoraTu.generar(s); mirar(plano(a.solucion.texto) + ' ' + plano(a.solucion.ecuacion || ''), `${i.id} ahora tú ${s}`);
      if (s < 200) for (const p of i.resuelve.generar(s).pasos) mirar(plano(p.texto) + ' ' + plano(p.ecuacion || ''), `${i.id} resuelve ${s}`);
    }
  }
});

test('paleta: sin verde ni carmín en la unidad; violeta solo en lo pedido', () => {
  const todo = JSON.stringify(def, (k, v) => (typeof v === 'function' ? undefined : v));
  assert.ok(!/c-[dh]\b/.test(todo), 'verde o carmín en la unidad');
  for (const i of def.ideas) {
    const j = i.juega;
    assert.ok(!/c-f/.test(JSON.stringify(j.leyenda)) && !/c-f/.test(JSON.stringify(i.lee)), `${i.id}: violeta antes de jugar`);
  }
});

test('lleva calidad 2 y el validador no encuentra nada (200 semillas)', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  const C = require('../../../catalogo/cursos/razonamiento-matematico.json'), u = C.unidades.find(x => x.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: 200 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('afirmaciones de los distractores en 400 semillas: «con n = X sale Y, que es primo» y «la figura k tiene Y» son ciertas', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), t = plano(a.pregunta).replace(/(\d) (?=\d{3}(?!\d))/g, '$1'), P = polinomio(t);
    for (const o of a.opciones) {
      const sf = plano(o.siFuera || '').replace(/(\d) (?=\d{3}(?!\d))/g, '$1');
      let m;
      if (P && (m = sf.match(/Con n = (\d+) sale (\d+), que es primo/))) { assert.equal(P(+m[1]), +m[2], `${i.id} ${s}: ${sf}`); assert.ok(primo(+m[2]), sf); }
      if ((m = sf.match(/La figura (\d+) tiene (\d+)/)) && /chapitas/.test(t)) {
        const v = t.match(/tienen (\d+), (\d+) y (\d+) chapitas/), f = parabola([[1, +v[1]], [2, +v[2]], [3, +v[3]]]);
        assert.equal(Math.round(f(+m[1])), +m[2], `${i.id} ${s}: ${sf}`);
      }
      if ((m = sf.match(/esa va en el lugar (\d+)/)) && /pulsera/.test(t)) {
        const r = resolver(t.replace(/lugar \d+\?/, `lugar ${m[1]}?`));
        assert.ok(vale(o.texto, r), `${i.id} ${s}: ${o.texto} no va en el lugar ${m[1]}`);
      }
    }
  }
});

// ---------- Cierre (20 nov 2026): rutinas/auditoria/razonamiento-matematico.razonamiento-inductivo.md ----------
// Todos los textos que ve el alumno, por idea: Lee, juego (en toda su grilla), predicción, Mira, regla, ejemplos y 400
// semillas de «Ahora tú» y «Así se resuelve».
function textosDe(I) {
  const out = [];
  const push = x => out.push(plano(x));
  for (const t of I.lee.tarjetas) push(t.texto);
  push(I.juega.consigna); push(I.juega.mision.texto); push(I.juega.mision.bien); push(I.juega.voz);
  for (const v of Teoria.grilla(I.juega.controles)) push(I.juega.lectura(Object.assign(Teoria.inicio(I.juega), v)));
  push(I.predice.pregunta); push(I.predice.datos); for (const o of I.predice.opciones) { push(o.texto); push(o.siFuera || ''); }
  push(I.predice.coincide); push(I.predice.noCoincide);
  for (const q of I.mira.pasos) { push(q.texto); push(q.ecuacion || ''); }
  push(I.regla.texto); push(I.regla.ecuacion); push(I.regla.condicion); push(I.aprendizaje);
  for (const e of I.ejemplos) { push(e.enunciado); push(e.datos); push(e.solucion.map(x => [x.texto, x.ecuacion || ''])); }
  for (let s = 0; s < 400; s++) {
    const a = I.ahoraTu.generar(s); push(a.pregunta); push(a.datos || ''); push(a.solucion.texto); for (const o of a.opciones) push(o.siFuera || '');
    const r = I.resuelve.generar(s); push(r.enunciado); push(r.datos || ''); for (const q of r.pasos) { push(q.texto); push(q.ecuacion || ''); }
  }
  return out;
}
const TEXTOS = Object.fromEntries(def.ideas.map(I => [I.id, textosDe(I)]));

test('cierre A1: ningún texto dice que un caso más «prueba» una regla (la idea 2 enseña que solo descarta)', () => {
  const MAL = [/se prueba con/i, /se prueba en/i, /\bprueba tu respuesta/i, /lo prueba\b/i, /pruébalo/i, /para probar/i, /\bpruebo\b/i, /\bpruebas con\b/i, /sigue probando/i];
  for (const [id, ts] of Object.entries(TEXTOS)) for (const t of ts) for (const m of MAL) assert.ok(!m.test(t), `${id}: «${t}»`);
  assert.match(plano(idea('cuenta-larga').regla.ecuacion), /lo comprueba/);
  assert.match(idea('cada-caso-con-su-lugar').regla.condicion, /solo la comprueba/);
});

test('cierre A2: «cada fila suma el doble» siempre dice por qué (es la lista 1, 2, 4, 8 que en la torta falla)', () => {
  const I = idea('arreglo-triangular');
  for (const e of I.ejemplos) if (/suma de los dos que tiene encima/.test(e.enunciado)) assert.match(plano(e.solucion.map(x => x.texto)), /dos latas que tiene debajo/, e.titulo);
  for (let s = 0; s < 400; s++) { const a = I.ahoraTu.generar(s); if (/suma de los dos que tiene encima/.test(a.pregunta)) assert.match(a.solucion.texto, /dos latas de abajo/, `${s}`); }
  // y el porqué es cierto: en las 30 primeras filas, cada número de una fila aparece en dos sumas de la siguiente
  for (let i = 1; i < 30; i++) { const f = fila('pascal', i), g = fila('pascal', i + 1); assert.equal(g.reduce((a, b) => a + b, 0), 2 * f.reduce((a, b) => a + b, 0)); }
});

test('cierre A3: las explicaciones no afirman algo falso (24 pedazos; «Es falsa» con solo cinco casos)', () => {
  const o = idea('tres-casos-no-prueban').predice.opciones.find(x => x.id === 'mas');
  assert.match(o.siFuera, /de 4 a 5 velitas/); assert.ok(!/de 3 a 4/.test(o.siFuera));
  const e13 = idea('tres-casos-no-prueban').ejemplos[12];
  assert.match(e13.enunciado, /Con solo esos cinco casos/);
  assert.ok(!/confunde sin probar con falso/.test(plano(e13.solucion.map(x => x.texto))));
});

test('cierre M1: «Ahora tú» y «Así se resuelve» no repiten los ejemplos 9, 11 y 15 de la idea 2 ni el 3 de la idea 5', () => {
  for (let s = 0; s < 400; s++) {
    assert.ok(!/6 × n − 1/.test(idea('tres-casos-no-prueban').resuelve.generar(s).enunciado), `res ${s}`);
    const a = idea('tres-casos-no-prueban').ahoraTu.generar(s).pregunta;
    assert.ok(!/n \+ 41/.test(a) && !/La lista 2, 4, 8 /.test(a), `ahora ${s}: ${a}`);
    assert.ok(!/11 111 × 11 111\?/.test(plano(idea('cuenta-larga').resuelve.generar(s).enunciado)), `larga ${s}`);
  }
});

test('cierre M2: los Datos traen casos y herramientas, no la regla ni la respuesta', () => {
  assert.ok(!idea('cada-caso-con-su-lugar').ejemplos[2].datos.some(d => /n filas de n \+ 1/.test(d)));
  assert.ok(!idea('tres-casos-no-prueban').ejemplos[13].datos.some(d => /El 2 es primo/.test(d)));
});

test('cierre M3: «Ahora tú» trae al menos 4 opciones (más «No sé») en 400 semillas de cada idea', () => {
  for (const I of def.ideas) for (let s = 0; s < 400; s++) assert.ok(I.ahoraTu.generar(s).opciones.length >= 4, `${I.id} ${s}`);
});

test('cierre M4 a M10: residuo de ejemplo, reglas que se leen enteras, «lineal» y la forma de las cuentas largas', () => {
  for (const [id, ts] of Object.entries(TEXTOS)) for (const t of ts) {
    assert.ok(!/(^|[^\d])23 entre 4/.test(t), `${id}: ${t}`);
    assert.ok(!/sobran 0\b/.test(t), `${id}: ${t}`);
  }
  const r1 = idea('figuras-que-crecen').regla.ecuacion, llave = r1.find(x => x && x.nota === 'lo que agregan los pasos');
  assert.ok(llave && plano(llave.llave).includes('× ('), 'la llave encierra paso × (n − 1)');
  assert.ok(!/⇏/.test(plano(idea('tres-casos-no-prueban').regla.ecuacion)));
  assert.ok(!/lineal/.test(plano(idea('cada-caso-con-su-lugar').mira.datos.nota.map(x => x.t))));
  const L = idea('cuenta-larga');
  for (let s = 0; s < 400; s++) {
    const a = L.ahoraTu.generar(s);
    if (/cifras [36] cada uno/.test(a.pregunta)) assert.match(a.solucion.texto, /suma 9/, `${s}`);
    if (/de 1+ × 1+\?/.test(plano(a.pregunta).replace(/ /g, ''))) assert.match(a.solucion.texto, /hasta 9 unos/, `${s}`);
  }
  // la forma que dicen los textos es la de verdad (BigInt), y con 10 unos el patrón se rompe
  for (let n = 2; n <= 60; n++) {
    const u = n - 1;
    assert.equal(cuad('3'.repeat(n)), '1'.repeat(u) + '0' + '8'.repeat(u) + '9');
    assert.equal(cuad('6'.repeat(n)), '4'.repeat(u) + '3' + '5'.repeat(u) + '6');
  }
  assert.notEqual(sumaCif(cuad('1'.repeat(10))), 100);
});

test('cierre M7: la prueba del curso (rm-26) dice filas y columnas: tres números solos admiten varias reglas', () => {
  const Pr = require('../../../catalogo/pruebas/razonamiento-matematico.json');
  const todos = JSON.stringify(Pr), par = [];
  (function buscar(x) { if (Array.isArray(x)) x.forEach(buscar); else if (x && typeof x === 'object') { if (x.par === 'rm-26') par.push(x); Object.values(x).forEach(buscar); } })(Pr);
  assert.equal(par.length, 1, todos.length);
  for (const f of ['A', 'B']) {
    const { a, b } = par[0][f].datos.modelo;
    for (let n = 1; n <= 3; n++) assert.ok(par[0][f].enunciado.includes(`${n + a} ${n + a === 1 ? 'fila' : 'filas'} de ${n + b}`), `${f}: rectángulo ${n}`);
  }
});
