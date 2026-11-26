'use strict';

// Contratos propios: conserva las cinco ideas antiguas, añade una sin regalar avance,
// mantiene el legado y calcula los dos pares de reserva por un camino independiente.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const raiz = path.resolve(__dirname, '../../..');
const leer = p => JSON.parse(fs.readFileSync(path.join(raiz, p), 'utf8'));
const Avance = require('../../../nucleo/avance.js');
const RT = require('../../../nucleo/repaso-tipos.js');
const Repaso = require('../../../nucleo/repaso.js');
const Pruebas = require('../../../nucleo/pruebas.js');
const { verificadores } = require('../../../catalogo/pruebas/verificar.js');
const Papel = require('../../../herramientas/papel-reglas.js');
const U = 'fisica.oscilaciones';
const viejas = ['aceleracion-al-centro', 'graficas-mas', 'periodo-resorte', 'pendulo', 'energia-mas'];
const nueva = 'ciclo-y-amplitud';
const seis = [nueva, ...viejas];
const copia = x => JSON.parse(JSON.stringify(x));
const cerca = (a, b, contexto = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(b)), `${contexto}: ${a} frente a ${b}`);
function estado(mask = 31) {
  return { avanceV: 1, vistas: { [U]: '2026-11-12' }, teoria: { [U]: { ideas: Object.fromEntries(viejas.map((id, k) => [id,
    { hecha: !!(mask & 2 ** k), prediccion: k ? 'opcion-antigua' : 'c', momento: 'mira', casos: k + 1 }])) } } };
}

test('Oscilaciones: migración conserva estudio completo, fecha, cartas, repaso e historial', () => {
  const e = estado();
  e.glosario = { [U]: { periodo: 'sabe', amplitud: 'repasa' }, 'otra.unidad': { fuerza: 'sabe' } };
  e.repaso = { [U]: { desde: '2026-11-03', paso: 2, toca: '2026-12-01', hechos: 5, aciertos: 4, ultimo: '2026-11-10' } };
  e.respuestas = [{ unidad: U, correcta: false, error: 'antiguo' }];
  e.eventos = [{ tipo: 'prediccion', unidad: U, correcta: true, t: '2026-11-12' }];
  e.teoria['otra.unidad'] = { ideas: { antigua: { hecha: true, prediccion: 'b' } } };
  const antes = copia(e);
  assert.equal(Avance.migrar(e), true);
  assert.equal(e.prediccionOSC, 1); assert.equal(e.estudiadaOSC, 1);
  assert.equal(e.marcadas[U], antes.vistas[U]);
  for (const id of viejas) assert.deepEqual(e.teoria[U].ideas[id], Object.fromEntries(Object.entries(antes.teoria[U].ideas[id]).filter(([k]) => k !== 'prediccion')));
  assert.equal(e.teoria[U].ideas[nueva], undefined);
  assert.deepEqual(e.teoria['otra.unidad'], antes.teoria['otra.unidad']);
  for (const k of ['vistas', 'glosario', 'repaso', 'respuestas', 'eventos']) assert.deepEqual(e[k], antes[k], k);
  assert.equal(Avance.nivel(e, { id: U, teoria: { ideas: 6 } }).estudio, true);
  assert.equal(Avance.teoriaCompleta(e, { id: U, teoria: { ideas: 6 } }), false);
  const despues = copia(e); assert.equal(Avance.migrar(e), false); assert.deepEqual(e, despues);
});

test('Oscilaciones: los 32 avances parciales conservan estudio solo al completar las cinco ideas antiguas', () => {
  for (let mask = 0; mask < 32; mask++) {
    const e = estado(mask); Avance.migrar(e);
    assert.equal(!!(e.marcadas || {})[U], mask === 31, 'Máscara ' + mask);
    for (const [k, id] of viejas.entries()) assert.equal(e.teoria[U].ideas[id].hecha, !!(mask & 2 ** k));
    assert.equal(e.teoria[U].ideas[nueva], undefined);
    assert.equal(Avance.migrar(e), false);
  }
  const sinVisita = estado(); delete sinVisita.vistas; Avance.migrar(sinVisita);
  assert.equal(sinVisita.marcadas[U], '2026-11-26');
  const marcada = estado(); marcada.marcadas = { [U]: '2026-11-01' }; Avance.migrar(marcada);
  assert.equal(marcada.marcadas[U], '2026-11-01');
});

test('Oscilaciones: conserva predicciones con huella y no borra por segunda vez las respuestas nuevas', () => {
  for (const huella of [undefined, '', null, 'huella-de-pregunta']) {
    const e = estado();
    for (const id of viejas) if (huella !== undefined) e.teoria[U].ideas[id].prediccionDe = huella;
    e.teoria[U].ideas[nueva] = { hecha: false, prediccion: 'ya-nueva', prediccionDe: 'ciclo-nueva' };
    const ciclo = copia(e.teoria[U].ideas[nueva]); Avance.migrar(e);
    for (const [k, id] of viejas.entries()) assert.equal(e.teoria[U].ideas[id].prediccion, huella ? (k ? 'opcion-antigua' : 'c') : undefined);
    assert.deepEqual(e.teoria[U].ideas[nueva], ciclo);
    e.teoria[U].ideas.pendulo.prediccion = 'respuesta-nueva';
    const antes = copia(e); assert.equal(Avance.migrar(e), false); assert.deepEqual(e, antes);
  }
});

test('Oscilaciones: conserva los cinco temas y las dos mesas heredadas bajo rehacer', () => {
  const ficha = leer('catalogo/cursos/fisica.json').unidades.find(u => u.id === U);
  assert.deepEqual(ficha.requiere, ['fisica.trabajo-y-energia', 'fisica.movimiento-circular', 'trigonometria.funciones-trigonometricas']);
  assert.deepEqual(ficha.plantillas, ['fis-oscilaciones', 'mas', 'mas-horaria']);
  assert.deepEqual(ficha.temas, ['Movimiento periódico y oscilatorio', 'Ecuaciones y gráficas del MAS', 'Masa-resorte horizontal y vertical', 'Péndulo simple', 'Energía en el MAS']);
  const unidad = require('./oscilaciones.js'), cubiertos = new Set(unidad.ideas.flatMap(i => i.temas));
  assert.deepEqual(unidad.ideas.map(i => i.id), seis);
  assert.deepEqual(ficha.temas.filter(t => !cubiertos.has(t)), []);
  for (const id of ['mas', 'mas-horaria']) {
    const vieja = leer(`plantillas/${id}/plantilla.json`);
    assert.equal(vieja.rehacer, true); assert.deepEqual(vieja.unidades, [U]);
    assert.ok(fs.existsSync(path.join(raiz, 'plantillas', id, vieja.escena || vieja.generador)));
    assert.equal(RT.cubre(vieja, U), true); assert.equal(RT.unidadDe(vieja, {}), U);
  }
});

test('Oscilaciones: práctica de las seis ideas entra en repaso sin cambiar otras unidades', () => {
  const ficha = leer('plantillas/fis-oscilaciones/plantilla.json');
  const G = require('../../../plantillas/fis-oscilaciones/generador.js');
  assert.deepEqual(ficha.unidades, [U]); assert.deepEqual(Object.keys(G.TIPOS_POR_IDEA).sort(), [...seis].sort());
  assert.equal(RT.cubre(ficha, U), true); assert.equal(RT.cubre(ficha, 'fisica.dinamica'), false);
  for (const [idea, tipos] of Object.entries(G.TIPOS_POR_IDEA)) for (const tipo of tipos) for (let semilla = 0; semilla < 4; semilla++) {
    const p = G.generar(semilla, { idea, tipo, unidad: U });
    assert.equal(RT.unidadDe(ficha, p), U); assert.equal(p._datos.tipo, tipo);
  }
  const e = { alumno: 'a1' }, eventos = [{ tipo: 'prediccion', unidad: U, alumno: 'a1', t: '2026-11-12T12:00:00Z' }];
  assert.deepEqual(Repaso.sembrar(e, eventos, u => RT.cubre(ficha, u), t => t.slice(0, 10)), [U]);
  assert.equal(e.repaso[U].toca, '2026-11-14');
  const antes = copia(e.repaso); assert.deepEqual(Repaso.sembrar(e, eventos, () => true), []); assert.deepEqual(e.repaso, antes);
});

test('Oscilaciones: todo el papel de la ficha cumple calidad 2 simulada, sin excepciones nuevas', () => {
  const unidad = leer('catalogo/cursos/fisica.json').unidades.find(u => u.id === U);
  for (const id of unidad.plantillas) {
    const ficha = leer(`plantillas/${id}/plantilla.json`), papel = leer(`plantillas/${id}/${ficha.papel}`);
    assert.deepEqual(Papel.revisar({ id, ficha, papel }, new Set([U])), [], id);
    if (id === 'fis-oscilaciones') {
      assert.ok(papel.problemas.length >= 8); assert.equal(RT.papelCubre(ficha, U), true);
      for (const p of papel.problemas) assert.deepEqual(RT.unidadesPapel(ficha, p.id), [U]);
    }
  }
});

// La frecuencia del oscilador se encuentra por balance cuadrático, sin usar la raíz
// ni el despeje productivo. El péndulo compara cocientes de los cuadrados de períodos.
function positiva(balance) {
  let lo = 0, hi = 1;
  while (balance(hi) < 0) hi *= 2;
  for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; if (balance(m) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function independiente(id, d) {
  if (id === 'osc-01') {
    const rigidez = d.m1 * d.g / d.e1;
    const w1 = positiva(w => d.m1 * w * w - rigidez), w2 = positiva(w => d.m2 * w * w - rigidez);
    const vuelta = 8 * Math.atan(1), t1 = vuelta / w1;
    return { correcta: vuelta / w2, errores: { 'OS11-R-SIN-MASA': t1, 'OS11-R-LINEAL': t1 * d.m2 / d.m1, 'OS11-R-INVERSA': t1 * d.m1 / d.m2 } };
  }
  const t1 = d.dt1 / d.N1;
  const t2 = positiva(t => t * t * d.kG - t1 * t1 * d.kL);
  return { correcta: d.N2 * t2, errores: {
    'OS11-P-SIN-RAIZ': d.N2 * t1 * d.kL / d.kG,
    'OS11-P-INVIERTE-G': d.N2 * positiva(t => t * t - t1 * t1 * d.kL * d.kG),
    'OS11-P-SIN-LONGITUD': d.N2 * positiva(t => t * t * d.kG - t1 * t1) } };
}

test('Oscilaciones: dos pares en reserva tienen 16 alternativas verificadas y una correcta por forma', () => {
  const banco = leer('catalogo/pruebas/fisica.json');
  assert.deepEqual(Pruebas.validar(banco), []); assert.equal(banco.pares.length, 10);
  const claves = { 'osc-01': { A: .4 * Math.PI, B: .2 * Math.PI }, 'osc-02': { A: 45, B: 24 } };
  for (const id of Object.keys(claves)) {
    assert.equal(banco.pares.filter(p => p.par === id).length, 0);
    const pares = banco.reserva.filter(p => p.par === id); assert.equal(pares.length, 1);
    const p = pares[0]; assert.equal(p.plantilla, 'fis-oscilaciones'); assert.equal(p.unidad, U);
    for (const forma of ['A', 'B']) {
      const it = p[forma], d = it.datos, r = independiente(id, d), prod = verificadores[id](d);
      cerca(r.correcta, claves[id][forma]); cerca(prod.correcta, r.correcta);
      assert.equal(it.opciones.length, 4); assert.equal(new Set(it.opciones.map(x => x.texto)).size, 4);
      const correctas = it.opciones.filter(x => Math.abs(x.valor - r.correcta) < 1e-10); assert.equal(correctas.length, 1); assert.equal(correctas[0].correcta, true);
      for (const op of it.opciones) {
        const coef = Number(op.texto.match(/^\d+(?:,\d+)?/)[0].replace(',', '.'));
        cerca(coef * (id === 'osc-01' ? 4 * Math.atan(1) : 1), op.valor, 'Valor visible');
        assert.match(op.texto, id === 'osc-01' ? /π s$/ : / s$/);
        if (!op.correcta) { cerca(op.valor, r.errores[op.error]); cerca(prod.errores[op.error], r.errores[op.error]); assert.equal(banco.errores[op.error].respaldo, 'hipotesis'); }
      }
      for (const valor of Object.values(d)) assert.ok(it.enunciado.includes(String(valor).replace('.', ',')), 'Dato visible ' + valor);
      assert.match(it.enunciado, /sin rozamiento/i); assert.doesNotMatch(it.enunciado, /2π|√|T\s*[=≈]/);
      if (id === 'osc-01') { assert.match(it.enunciado, /masa despreciable/); assert.match(it.enunciado, /equilibrio/); }
      else { assert.match(it.enunciado, /inextensible/); assert.match(it.enunciado, /8°/); assert.match(it.enunciado, /masa puntual/); }
    }
  }
  assert.ok([...banco.pares, ...banco.reserva].some(p => p.par === 'fis-19'), 'Conserva el par heredado');
});

test('Oscilaciones: verificadores coinciden con balances independientes en 400 casos por par', () => {
  for (let s = 0; s < 400; s++) {
    const entradas = {
      'osc-01': { m1: .1 + s % 20 / 10, e1: .05 + s % 11 / 20, m2: .2 + s % 17 / 10, g: 10 },
      'osc-02': { N1: 5 + s % 20, dt1: 10 + s % 50, N2: 4 + s % 25, kL: 2 + s % 12, kG: 3 + s % 11 }
    };
    for (const [id, d] of Object.entries(entradas)) {
      const prod = verificadores[id](d), esperado = independiente(id, d);
      cerca(prod.correcta, esperado.correcta, id + '/' + s);
      assert.deepEqual(Object.keys(prod.errores).sort(), Object.keys(esperado.errores).sort());
      for (const [error, valor] of Object.entries(prod.errores)) cerca(valor, esperado.errores[error], error + '/' + s);
    }
  }
  assert.throws(() => verificadores['osc-01']({ m1: .2, e1: 0, m2: .8, g: 10 }), /positivos/);
  assert.throws(() => verificadores['osc-02']({ N1: 0, dt1: 20, N2: 15, kL: 9, kG: 4 }), /positivos/);
});
