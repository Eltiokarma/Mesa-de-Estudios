// Pruebas del generador de horas, relojes y calendarios: las comunes (600 problemas), casos.json,
// papel.json y propiedades. El recálculo independiente busca por fuerza bruta (minuto a minuto, día a
// día, los siete días de la semana) y lleva las fechas con Date de JavaScript, sin las cuentas del generador.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const DIA_MS = 86400000;
const clave = t => { const d = new Date(t); return `f:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`; };
const utc = f => Date.UTC(f.a, f.m - 1, f.d);

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'que-hora') {
    // Minuto a minuto, con enteros: ¿en qué minuto x del día se cumple la relación?
    for (let x = 1; x < 1440; x++) {
      const pasa = x, falta = 1440 - x;
      if (d.forma === 'razon' && pasa * d.q === falta * d.p) return x;
      if (d.forma === 'fraccion' && falta * d.q === pasa * d.p) return x;
      if (d.forma === 'hace-dentro' && falta + 60 * d.a === d.k * (falta - 60 * d.b)) return x;
      if (d.forma === 'pasado-dentro' && pasa + 60 * d.a === d.k * (pasa - 60 * d.b)) return x;
    }
    return NaN;
  }
  if (d.tipo === 'turno') {
    const T = 60 * d.D;
    if (d.forma === 'inicio') {
      for (let e = 1; e < T; e++) if ((T - e) * d.q === e * d.p) return d.ahora - e;
      return NaN;
    }
    if (d.forma === 'fin') {
      for (let e = 1; e < T; e++) if ((T - e) * d.q === e * d.p) return d.ahora + (T - e);
      return NaN;
    }
    for (let e = 1; e < T; e++) if (e * d.q === (T - e) * d.p) return d.forma === 'hora' ? d.inicio + e : `dur:${T - e}`;
    return NaN;
  }
  if (d.tipo === 'anio') {
    const total = (Date.UTC(d.anio + 1, 0, 1) - Date.UTC(d.anio, 0, 1)) / 60000;
    for (let m = 1; m < total; m++) if (m * d.q === (total - m) * d.p) return `min:${m}`;
    return NaN;
  }
  if (d.tipo === 'adelanto') {
    // Día a día se acumula el desfase hasta que es múltiplo de 12 h.
    let t = utc(d.desde), acum = 0;
    do { t += DIA_MS; acum += d.a; } while (acum % 720 !== 0);
    return clave(t);
  }
  if (d.tipo === 'dos-relojes') {
    let n = 0, A = 0, B = 0;
    do { n++; A += d.a; B += d.b; } while (A % 720 !== 0 || B % 720 !== 0);
    return n;
  }
  if (d.tipo === 'creciente') {
    let n = 0, acum = 0;
    while (acum < 720) { n++; acum += d.a1 + (n - 1) * d.r; }
    if (acum !== 720) return NaN;
    return d.pide === 'dias' ? n : clave(utc(d.desde) + n * DIA_MS);
  }
  if (d.tipo === 'calendario') {
    // Se prueban los siete días de inicio, contando día por día.
    let mejor = -1, inicio = null;
    for (let s = 0; s < 7; s++) {
      let c = 0; for (let i = 0; i < d.N; i++) if (d.clase.includes((s + i) % 7)) c++;
      if (c > mejor) { mejor = c; inicio = s; }
    }
    return d.forma === 'maximo' ? mejor : `dia:${inicio}`;
  }
  // mentirosos: tabla de verdad día por día
  const miente = (L, dd) => L.includes(((dd % 7) + 7) % 7);
  const cierta = (L, dicho, dd) => ({ 'ayer-menti': miente(L, dd - 1), 'ayer-verdad': !miente(L, dd - 1), 'manana-mentire': miente(L, dd + 1), 'manana-verdad': !miente(L, dd + 1) })[dicho];
  const ok = [];
  for (let dd = 0; dd < 7; dd++) if (cierta(d.mienteA, d.dichoA, dd) !== miente(d.mienteA, dd) && cierta(d.mienteB, d.dichoB, dd) !== miente(d.mienteB, dd)) ok.push(dd);
  if (ok.length !== 1) return NaN;
  return `dia:${(ok[0] + { hoy: 0, manana: 1, ayer: 6 }[d.pide]) % 7}`;
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b);
probarGenerador(gen, { semillas: 600, recalcular, igual });

test('salen los ocho tipos y sus formas', () => {
  const vistos = new Set();
  for (let s = 0; s < 300; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo); if (d.forma) vistos.add(`${d.tipo}/${d.forma}`); if (d.pide) vistos.add(`${d.tipo}/${d.pide}`); }
  for (const k of ['que-hora/razon', 'que-hora/fraccion', 'que-hora/hace-dentro', 'que-hora/pasado-dentro', 'turno/hora', 'turno/falta', 'turno/inicio', 'turno/fin', 'anio', 'adelanto', 'dos-relojes', 'creciente/dias', 'creciente/fecha', 'calendario/maximo', 'calendario/inicio', 'mentirosos/hoy', 'mentirosos/manana', 'mentirosos/ayer']) assert.ok(vistos.has(k), `falta ${k}`);
});

test('las horas de las alternativas son horas válidas y ninguna es justo mediodía o medianoche', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) if (/m\.$/.test(a.texto)) assert.ok(/^(1[0-2]|[1-9]):[0-5]\d [ap]\. m\.$/.test(a.texto.replace(/^.*a las /, '')), `semilla ${s}: ${a.texto}`);
    for (const seg of [...p.enunciado, ...p.solucion.flat()]) assert.ok(!/m\.\./.test(typeof seg === 'string' ? seg : seg.t), `semilla ${s}: punto doble`);
  }
});

test('mentirosos: un solo día cumple las dos frases; dos relojes: el MCM no es el producto', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo === 'mentirosos') assert.equal(gen.calc.mentirosos(d).length, 1, `semilla ${s}`);
    if (d.tipo === 'dos-relojes') { const a = 720 / d.a, b = 720 / d.b; assert.ok(gen.generar(s).respuesta.valor < a * b, `semilla ${s}`); }
  }
});

test('calc.sumarDias coincide con Date en 2000 saltos al azar', () => {
  let x = 12345;
  for (let i = 0; i < 2000; i++) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const f = { a: 2020 + (x % 15), m: 1 + (x % 12), d: 1 + (x % 28) }, n = (x >> 8) % 900 - 300;
    const g = gen.calc.sumarDias(f, n);
    assert.equal(`f:${g.a}-${String(g.m).padStart(2, '0')}-${String(g.d).padStart(2, '0')}`, clave(utc(f) + n * DIA_MS));
  }
});

test('RMP47 en el año: la fecha sale con los meses del año supuesto (2027 con 366 días → 14 de julio, 4:48 a. m.)', () => {
  const p = gen.generar(228);
  assert.equal(p._datos.anio, 2027);
  const e = p.alternativas.find(a => a.error && a.error.id === 'RMP47-bisiesto');
  assert.equal(e.texto, 'el 14 de julio, a las 4:48 a. m.');
  // En general: con Date, contando el año supuesto desde un año con (o sin) 29 de febrero.
  for (let s = 0; s < 1500; s++) {
    const q = gen.generar(s), d = q._datos;
    if (d.tipo !== 'anio') continue;
    const x = q.alternativas.find(a => a.error && a.error.id === 'RMP47-bisiesto');
    if (!x) continue;
    const min = Number(x.valor.slice(4)), bis = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const supuesto = bis(d.anio) ? 2027 : 2028;          // un año con los meses del año supuesto
    const t = new Date(Date.UTC(supuesto, 0, 1) + min * 60000);
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
    assert.ok(x.texto.startsWith(`el ${t.getUTCDate()} de ${MESES[t.getUTCMonth()]}, a las ${gen.calc.hora(t.getUTCHours() * 60 + t.getUTCMinutes())}`), `semilla ${s}: ${x.texto}`);
  }
});

test('RMP85: la parte decimal de las horas leída como minutos (13,5 h → 13 h 50 min), en hipótesis', () => {
  let visto = 0;
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) {
      if (!a.error) continue;
      assert.ok(!a.error.id.startsWith('AR11'), `semilla ${s}: queda AR11`);
      if (a.error.id !== 'RMP85-decimal-como-minutos') continue;
      visto++;
      assert.equal(a.error.respaldo, 'hipotesis');
      const h = p.respuesta.valor / 60, ent = Math.floor(h), cent = Math.round((h - ent) * 100);
      assert.equal(a.valor, ent * 60 + cent, `semilla ${s}`);
    }
  }
  assert.ok(visto > 0);
});

test('concordancia y redacción: la otra parte, 1 día entero, el 1 del mes, turno o jornada, mentirosos', () => {
  const txt = l => l.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    const todo = [txt(p.enunciado), ...p.solucion.map(txt), ...p.alternativas.map(a => (a.error ? a.error.explicacion : ''))].join(' ');
    assert.ok(!/otras 1 partes|quedan 1 días|quedan 0 días/.test(todo), `semilla ${s}: ${todo}`);
    if (/jornada/.test(todo)) assert.ok(!/turno/.test(todo), `semilla ${s}: mezcla turno y jornada`);
    if (d.tipo === 'mentirosos') assert.match(txt(p.solucion[0]), /Se revisan los siete días; estos son los que cumplen al menos una frase:$/);
    if (d.tipo === 'que-hora' && (d.forma === 'hace-dentro' || d.forma === 'pasado-dentro')) {
      const vs = p.enunciado.filter(x => x && x.v);
      const hace = vs.find(x => /hora/.test(x.t) && p.enunciado[p.enunciado.indexOf(x) - 1].endsWith(d.forma === 'hace-dentro' ? 'Hace ' : 'hace '));
      const dentro = vs.find(x => x !== hace && /hora/.test(x.t));
      assert.notEqual(p.variables[hace.v].color, p.variables[dentro.v].color, `semilla ${s}: hace y dentro con el mismo color`);
    }
    const usadas = new Set(); for (const parte of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of parte) if (x && x.v) usadas.add(x.v);
    const col = [...usadas].map(k => { assert.ok(p.variables[k], `semilla ${s}: ${k} sin variable`); return p.variables[k].color; });
    assert.equal(new Set(col).size, col.length, `semilla ${s}: dos variables con un color`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(p.respuesta.valor, c.esperado.respuesta), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('papel.json: cada problema se comprueba con calc', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.verificar && pr.verificar.length, `${pr.id}: sin verificar`);
    for (const ver of pr.verificar) assert.deepEqual(gen.calc[ver.fn](...ver.args), ver.espera, `${pr.id}: ${ver.fn}`);
  }
});
