// Pruebas de «Calor que no sube la temperatura»: casos.json (calculados aparte, con un script que no usa el generador),
// un recálculo independiente en 600 problemas (tramo por tramo, con los valores de libro escritos aquí), fugas, el
// recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente: cal/(g·°C), cal/g y °C ----
const AGUA = 1, HIELO = 0.5, FUSION = 80, VAPOR = 540, JULIACA = 87, LIMA = 100, JOULE = 4.18;
const r12 = x => Number(x.toPrecision(12));
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'sensible': return r12(d.m * d.ce * (d.t1 - d.t0));
    case 'latente': return d.sub === 'masa' ? d.q / VAPOR : d.m * (d.funde ? FUSION : VAPOR);
    case 'variacion': return r12((d.t1 - d.t0) * (d.a === '°F' ? 1.8 : 1));
    case 'tramos': return d.m * FUSION + d.m * AGUA * d.t;
    case 'juliaca': return d.sub === 'lima' ? d.litros * 1000 * AGUA * (LIMA - JULIACA) : d.litros * 1000 * AGUA * (JULIACA - d.t0);
    case 'joules': return r12(d.kg * 1000 * AGUA * (d.t1 - d.t0) * JOULE / 1000);
    case 'bajo-cero': return d.m * HIELO * d.T0 + d.m * FUSION + d.m * AGUA * d.t;
    default: return (d.q - d.m * FUSION) / (d.m * AGUA); // final
  }
}
const igual = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(c.esperado.respuesta, p.respuesta.valor), `da ${p.respuesta.valor}, se esperaba ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('salen todos los tipos, los tres niveles y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : '')); niveles.add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['sensible', 'latente/calor', 'latente/masa', 'variacion', 'tramos', 'juliaca/juliaca', 'juliaca/lima', 'joules', 'bajo-cero', 'final'])
    assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['MA6', 'MA7', 'QM-T-FINAL', 'QM-SIN-CE', 'QM-OTRO-L', 'QM-SOLO-LATENTE', 'QM-SIN-LATENTE', 'QM-T-INICIAL', 'QM-CERO',
    'QM-LECTURA-PUNTO', 'QM-ESCALA-SIN-FACTOR', 'QM-CE-HIELO', 'QM-CAL-J-INVERSO', 'QU1-kg-sin-g'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('explicaciones que empiezan por «Bien», respaldos y escala (salvo el cero)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, /^MA\d/.test(a.error.id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${a.error.id}`);
      if (a.valor === 0) assert.ok(['MA6', 'QM-CERO'].includes(a.error.id), `semilla ${s}: un 0 que no es MA6 ni QM-CERO`);
      else {
        assert.ok(a.valor > 0, `semilla ${s}: ${a.texto} negativo`);
        assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
      }
    }
  }
});

test('cada incorrecta muestra su valor en la explicación (salvo el cero y los que solo nombran un tramo)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error && x.valor !== 0 && !['QM-SOLO-LATENTE', 'MA6', 'QM-ESCALA-SIN-FACTOR', 'QM-DT-SUMA', 'QM-LECTURA-PUNTO', 'QM-UN-TRAMO'].includes(x.error.id)))
      assert.ok(a.error.explicacion.includes(a.texto.split(' ').slice(0, -1).join(' ')), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const PIDE = {
    sensible: ['Q = m · cₑ · ΔT', 'ΔT: temperatura final menos'], latente: ['Q = m · L', '540 cal/g'], variacion: ['ΔK = Δ°C', 'Δ°F = 1,8 · Δ°C'],
    tramos: ['Q = m · L', 'Q = m · cₑ · ΔT', '80 cal/g', 'cₑ = 1'], juliaca: ['Q = m · cₑ · ΔT', '1 L de agua = 1000 g', 'unos 87 °C'],
    joules: ['Q = m · cₑ · ΔT', '1 cal ≈ 4,18 J', '1 kJ = 1000 J', '1 kg = 1000 g'], 'bajo-cero': ['Q = m · L', 'Q = m · cₑ · ΔT', 'cₑ = 0,5', '80 cal/g'],
    final: ['Q = m · L', 'Q = m · cₑ · ΔT', '80 cal/g'],
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length && palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d|^Dato:/i.test(l), `semilla ${s}: «${l}»`);
      // Sin lecturas punto a punto ni el factor de un tramo ya armado (decisiones, 17 nov).
      assert.ok(!/\+ ?273|\+ ?32|cal\b.*=.*cal\b/.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length);
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto;
    for (const x of PIDE[d.tipo]) assert.ok(todo.includes(x), `semilla ${s} (${d.tipo}): falta «${x}»`);
    assert.ok(!new RegExp(`(^|[^\\d,])${c.split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `semilla ${s}: el número de ${c} está en los datos`);
    // Notación de la unidad: cₑ, nunca c a secas (la c es la de la luz).
    assert.ok(!/\bc =|\bc\b ·/.test(todo), `semilla ${s}: calor específico sin el subíndice`);
  }
});

test('colores por papel: masa naranja, ΔT, L o calor dado turquesa, cₑ verde, lo que se pide violeta', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, { m: 'o', dT: 'i', L: 'i', Q: 'i', ce: 'd', x: 'f' }[k], `semilla ${s}: ${k}`);
    assert.ok(p.pregunta.some(x => typeof x === 'object' && x.v === 'x'), `semilla ${s}: lo que se pide no va en violeta`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
