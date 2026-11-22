'use strict';

// Contratos de la unidad: progreso conservado, acceso al legado, repaso y dos pares de reserva.
// Los pares se calculan aquí por balances y bisección, sin llamar al cálculo de la plantilla.
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
const U = 'fisica.gravitacion';
const viejas = ['cuadrado-inverso', 'campo-gravitatorio', 'orbita-circular', 'leyes-de-kepler'];
const nuevas = ['energia-gravitatoria', 'escape'];
const seis = ['cuadrado-inverso', 'campo-gravitatorio', 'energia-gravitatoria', 'orbita-circular', 'leyes-de-kepler', 'escape'];
const copia = x => JSON.parse(JSON.stringify(x));
const cerca = (a, b, contexto = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(b)), `${contexto}: ${a} frente al cálculo independiente ${b}`);
function estado(mask = 15) {
  return { avanceV: 1, vistas: { [U]: '2026-11-12' }, teoria: { [U]: { ideas: Object.fromEntries(viejas.map((id, k) => [id,
    { hecha: !!(mask & 2 ** k), prediccion: k ? 'opcion-antigua' : 'c', momento: 'mira', casos: k + 1 }])) } } };
}

test('Gravitación: migración completa conserva estudio, fecha, cartas, repaso e historial', () => {
  const e = estado();
  e.glosario = { [U]: { orbita: 'sabe', 'campo gravitatorio': 'repasa' }, 'otra.unidad': { fuerza: 'sabe' } };
  e.repaso = { [U]: { desde: '2026-11-03', paso: 2, toca: '2026-12-01', hechos: 5, aciertos: 4, ultimo: '2026-11-10' } };
  e.respuestas = [{ unidad: U, correcta: false, error: 'antiguo' }];
  e.eventos = [{ tipo: 'prediccion', unidad: U, correcta: true, t: '2026-11-12' }];
  e.teoria['otra.unidad'] = { ideas: { antigua: { hecha: true, prediccion: 'b' } } };
  const antes = copia(e);
  assert.equal(Avance.migrar(e), true);
  assert.equal(e.prediccionGV, 1); assert.equal(e.estudiadaGV, 1);
  assert.equal(e.marcadas[U], antes.vistas[U]);
  for (const id of viejas) {
    assert.equal(e.teoria[U].ideas[id].prediccion, undefined);
    assert.deepEqual(e.teoria[U].ideas[id], Object.fromEntries(Object.entries(antes.teoria[U].ideas[id]).filter(([k]) => k !== 'prediccion')));
  }
  for (const id of nuevas) assert.equal(e.teoria[U].ideas[id], undefined, 'No regala una idea nueva');
  assert.deepEqual(e.teoria['otra.unidad'], antes.teoria['otra.unidad']);
  for (const k of ['vistas', 'glosario', 'repaso', 'respuestas', 'eventos']) assert.deepEqual(e[k], antes[k], k);
  assert.equal(Avance.nivel(e, { id: U, teoria: { ideas: 6 } }).estudio, true);
  assert.equal(Avance.teoriaCompleta(e, { id: U, teoria: { ideas: 6 } }), false);
  const despues = copia(e); assert.equal(Avance.migrar(e), false); assert.deepEqual(e, despues);
});

test('Gravitación: los 16 avances parciales solo conservan estudio al completar las cuatro ideas antiguas', () => {
  for (let mask = 0; mask < 16; mask++) {
    const e = estado(mask); Avance.migrar(e);
    assert.equal(!!(e.marcadas || {})[U], mask === 15, 'Máscara ' + mask);
    for (const [k, id] of viejas.entries()) assert.equal(e.teoria[U].ideas[id].hecha, !!(mask & 2 ** k));
    for (const id of nuevas) assert.equal(e.teoria[U].ideas[id], undefined);
    assert.equal(Avance.migrar(e), false);
  }
  const sinVisita = estado(); delete sinVisita.vistas; Avance.migrar(sinVisita);
  assert.equal(sinVisita.marcadas[U], '2026-11-22');
  const marcada = estado(); marcada.marcadas = { [U]: '2026-11-01' }; Avance.migrar(marcada);
  assert.equal(marcada.marcadas[U], '2026-11-01', 'No sustituye una marca anterior por la fecha de visita');
});

test('Gravitación: predicciones con huella se conservan; las nuevas respuestas no se borran por segunda vez', () => {
  for (const huella of [undefined, '', null, 'huella-de-pregunta']) {
    const e = estado();
    for (const id of viejas) if (huella !== undefined) e.teoria[U].ideas[id].prediccionDe = huella;
    e.teoria[U].ideas.escape = { hecha: false, prediccion: 'ya-nueva', prediccionDe: 'escape-nueva' };
    const escape = copia(e.teoria[U].ideas.escape);
    Avance.migrar(e);
    for (const [k, id] of viejas.entries()) assert.equal(e.teoria[U].ideas[id].prediccion, huella ? (k ? 'opcion-antigua' : 'c') : undefined);
    assert.deepEqual(e.teoria[U].ideas.escape, escape);
    e.teoria[U].ideas['cuadrado-inverso'].prediccion = 'respuesta-nueva';
    const antes = copia(e); assert.equal(Avance.migrar(e), false); assert.deepEqual(e, antes);
  }
});

test('Gravitación: ficha completa y mesas heredadas accesibles con rehacer propio', () => {
  const ficha = leer('catalogo/cursos/fisica.json').unidades.find(u => u.id === U);
  assert.deepEqual(ficha.requiere, ['fisica.dinamica', 'fisica.movimiento-circular', 'fisica.trabajo-y-energia']);
  assert.deepEqual(ficha.plantillas, ['fis-gravitacion', 'gravitacion', 'dinamica-fuerzas']);
  for (const tema of ['Leyes de Kepler', 'Ley de gravitación universal', 'Campo gravitatorio', 'Variación de g con la altura', 'Energía gravitatoria', 'Órbitas circulares', 'Rapidez de escape']) assert.ok(ficha.temas.includes(tema));
  const cubiertos = new Set(require('./gravitacion.js').ideas.flatMap(i => i.temas));
  assert.deepEqual(ficha.temas.filter(t => !cubiertos.has(t)), [], 'Cada tema de la ficha aparece en las ideas');
  const vieja = leer('plantillas/gravitacion/plantilla.json'), compartida = leer('plantillas/dinamica-fuerzas/plantilla.json');
  assert.equal(vieja.rehacer, true); assert.ok(fs.existsSync(path.join(raiz, 'plantillas/gravitacion', vieja.escena)));
  assert.deepEqual(compartida.rehacer, ['fisica.estatica', 'fisica.dinamica', U]);
  for (const tipo of ['astro', 'gravitatoria']) assert.equal(RT.unidadDe(compartida, { _datos: { tipo } }), U);
  assert.equal(RT.unidadDe(compartida, { _datos: { tipo: 'tabla' } }), 'fisica.dinamica');
  assert.equal(RT.unidadDe(compartida, { _datos: { tipo: 'escalera' } }), 'fisica.estatica');
  assert.equal(RT.cubre(compartida, U), true);
});

test('Gravitación: práctica de las seis ideas entra en repaso sin reclasificar las demás unidades', () => {
  const ficha = leer('plantillas/fis-gravitacion/plantilla.json');
  const G = require('../../../plantillas/fis-gravitacion/generador.js');
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

test('Gravitación: todo el papel de la ficha pasa calidad 2 simulada sin excepciones nuevas', () => {
  const unidad = leer('catalogo/cursos/fisica.json').unidades.find(u => u.id === U);
  for (const id of unidad.plantillas) {
    const ficha = leer(`plantillas/${id}/plantilla.json`), papel = leer(`plantillas/${id}/${ficha.papel}`);
    assert.deepEqual(Papel.revisar({ id, ficha, papel }, new Set([U])), [], id);
    if (id === 'fis-gravitacion') {
      assert.ok(papel.problemas.length >= 8); assert.equal(RT.papelCubre(ficha, U), true);
      for (const p of papel.problemas) assert.deepEqual(RT.unidadesPapel(ficha, p.id), [U]);
    }
  }
});

function raizPorBalance(balance) {
  let menor = 0, mayor = 1;
  assert.ok(balance(0) <= 0);
  while (balance(mayor) < 0) mayor *= 2;
  for (let i = 0; i < 120; i++) { const medio = (menor + mayor) / 2; if (balance(medio) < 0) menor = medio; else mayor = medio; }
  return (menor + mayor) / 2;
}
function independiente(id, d) {
  if (id === 'grav-01') {
    const cuadrado = d.aA * d.aA, cubo = cuadrado * d.aA;
    return { correcta: raizPorBalance(T => T * T * cubo - d.TA * d.TA * d.aB * d.aB * d.aB), errores: {
      'GV-K-LINEAL': d.TA / d.aA * d.aB,
      'GV-K-RAIZ': raizPorBalance(T => T * T * d.aA - d.TA * d.TA * d.aB),
      'GV-K-CUADRADO': d.TA / cuadrado * d.aB * d.aB } };
  }
  const GM = d.GM * d.escalaGM, r0 = d.r0 * d.escalaRadio, v0 = d.v0 * d.escalaRapidez;
  // Trabajo por kilogramo con u=1/r: integral de GM du desde 1/r0 hasta 0.
  // Se acumulan ocho tramos; no se usa v0²-v_escape², que es la ruta del verificador.
  let trabajo = 0; for (let i = 0; i < 8; i++) trabajo += GM * ((1 - (i + 1) / 8) / r0 - (1 - i / 8) / r0);
  const energiaFinal = v0 * v0 / 2 + trabajo;
  const escape = raizPorBalance(v => v * v / 2 + trabajo);
  return { correcta: raizPorBalance(v => v * v / 2 - energiaFinal) / d.escalaRapidez, errores: {
    'GV-E-RESTA': (v0 - escape) / d.escalaRapidez,
    'GV-E-SIN-GRAVEDAD': v0 / d.escalaRapidez,
    'GV-E-UMBRAL': escape / d.escalaRapidez } };
}

test('Gravitación: dos pares quedan en reserva y sus 16 opciones tienen un cálculo independiente y una sola correcta', () => {
  const banco = leer('catalogo/pruebas/fisica.json');
  assert.deepEqual(Pruebas.validar(banco), []); assert.equal(banco.pares.length, 10);
  const claves = { 'grav-01': { A: 67.5, B: 24 }, 'grav-02': { A: 6, B: 8 } };
  for (const id of Object.keys(claves)) {
    assert.equal(banco.pares.filter(p => p.par === id).length, 0);
    const pares = banco.reserva.filter(p => p.par === id); assert.equal(pares.length, 1);
    const p = pares[0]; assert.equal(p.plantilla, 'fis-gravitacion'); assert.equal(p.unidad, U);
    for (const forma of ['A', 'B']) {
      const it = p[forma], { modelo, ...datos } = it.datos, d = { ...datos, ...(modelo || {}) };
      const r = independiente(id, d), prod = verificadores[id](d);
      cerca(r.correcta, claves[id][forma]); cerca(prod.correcta, r.correcta);
      assert.equal(it.opciones.length, 4); assert.equal(new Set(it.opciones.map(x => x.texto)).size, 4);
      const correctasPorBalance = it.opciones.filter(x => Math.abs(x.valor - r.correcta) < 1e-10); assert.equal(correctasPorBalance.length, 1);
      assert.equal(correctasPorBalance[0].correcta, true);
      for (const op of it.opciones) {
        const valor = Number(op.texto.match(/^\d+(?:,\d+)?/)[0].replace(',', '.'));
        assert.equal(valor, op.valor, 'Valor visible exacto');
        assert.match(op.texto, id === 'grav-01' ? / días$/ : / km\/s$/);
        if (!op.correcta) { cerca(op.valor, r.errores[op.error]); cerca(prod.errores[op.error], r.errores[op.error]); assert.equal(banco.errores[op.error].respaldo, 'hipotesis'); }
      }
      for (const valor of Object.values(datos)) assert.ok(it.enunciado.includes(String(valor).replace('.', ',')), 'Dato visible ' + valor);
      assert.match(it.enunciado, /masa despreciable/); assert.match(it.enunciado, /fijo/); assert.match(it.enunciado, /sin aire/);
      if (id === 'grav-01') { assert.match(it.enunciado, /mismo planeta/); assert.match(it.enunciado, /semieje mayor/); assert.match(it.enunciado, /T²\/a³/); }
      else {
        assert.ok(d.r0 >= d.R); assert.match(it.enunciado, /dirección radial/); assert.match(it.enunciado, /sin aire ni empuje/);
        assert.match(it.enunciado, /cero en el infinito/); assert.match(it.enunciado, /v²\/2 − GM\/r/);
        assert.equal(d.escalaGM, 1e14); assert.equal(d.escalaRadio, 1000); assert.equal(d.escalaRapidez, 1000);
        assert.equal(d.r0 * d.escalaRadio, 8e6); assert.equal(d.R * d.escalaRadio, 4e6);
      }
    }
  }
  assert.ok([...banco.pares, ...banco.reserva].some(p => p.par === 'fis-21'), 'Conserva el ítem anterior de peso planetario');
});

test('Gravitación: los verificadores propios coinciden con balances independientes en 400 casos por par', () => {
  for (let s = 0; s < 400; s++) {
    const entradas = {
      'grav-01': { TA: 10 + s % 80, aA: 4 + s % 8, aB: 13 + s % 10 },
      'grav-02': { GM: 1 + s % 10, r0: 8 + s % 4, R: 4, v0: 20 + s % 10, escalaGM: 1e14, escalaRadio: 1e6, escalaRapidez: 1000 }
    };
    for (const [id, d] of Object.entries(entradas)) {
      const prod = verificadores[id](d), esperado = independiente(id, d);
      cerca(prod.correcta, esperado.correcta, id + '/' + s);
      assert.deepEqual(Object.keys(prod.errores).sort(), Object.keys(esperado.errores).sort());
      for (const [error, valor] of Object.entries(prod.errores)) cerca(valor, esperado.errores[error], error + '/' + s);
    }
  }
  assert.throws(() => verificadores['grav-01']({ TA: 0, aA: 4, aB: 9 }), /positivos/);
  assert.throws(() => verificadores['grav-02']({ GM: 2.56, r0: 3, R: 4, v0: 10, escalaGM: 1e14, escalaRadio: 1e6, escalaRapidez: 1000 }), /exterior/);
  assert.throws(() => verificadores['grav-02']({ GM: 2.56, r0: 8, R: 4, v0: 1, escalaGM: 1e14, escalaRadio: 1e6, escalaRapidez: 1000 }), /infinito/);
});
