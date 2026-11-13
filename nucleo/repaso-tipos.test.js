// Tabla de variantes a unidades del repaso (clasificación hecha por un modelo): que no apunte a nada que no exista.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
global.self = global;
global.Azar = require('./azar.js');
global.Predicciones = require('./predicciones.js');
const RT = require('./repaso-tipos.js');
const cat = require('../app/datos/catalogo.json');
const RAIZ = path.join(__dirname, '..');
const gen = pl => require(path.join(RAIZ, pl.archivos[0]));
const clave = d => [d.tipo, d.tema, d.conjunto].filter(Boolean);

test('cada fila de la tabla es de un generador mixto, con variantes que existen y unidades suyas', () => {
  for (const [id, m] of Object.entries(RT.TABLA)) {
    const pl = cat.plantillas[id];
    assert.ok(pl && pl.formato === 'predicciones' && pl.unidades.length > 1, `${id}: no es un generador mixto`);
    const vistas = new Set();
    const g = gen(pl);
    for (let i = 0; i < 1500; i++) { try { clave(g.generar('t' + i)._datos || {}).forEach(k => vistas.add(k)); } catch { /* semilla sin problema */ } }
    for (const [k, u] of Object.entries(m)) {
      assert.ok(vistas.has(k), `${id}: la variante «${k}» no sale del generador`);
      assert.ok(pl.unidades.includes(u), `${id}: ${u} no está entre sus unidades`);
    }
  }
});

test('unidadDe: un generador de una sola unidad, la tabla y p.unidadCatalogo', () => {
  const uno = { id: 'x', unidades: ['a.b'] };
  assert.equal(RT.unidadDe(uno, { _datos: {} }), 'a.b');
  const pl = cat.plantillas['sistemas-ecuaciones'];
  assert.equal(RT.unidadDe(pl, { _datos: { tipo: 'matriz' } }), 'algebra.matrices-y-determinantes');
  assert.equal(RT.unidadDe(pl, { _datos: { tipo: 'no-existe' } }), null);
  assert.equal(RT.unidadDe(pl, { _datos: { tipo: 'matriz' }, unidadCatalogo: 'algebra.sistemas-de-ecuaciones' }), 'algebra.sistemas-de-ecuaciones');
  assert.equal(RT.unidadDe(pl, { _datos: {}, unidadCatalogo: 'fisica.dinamica' }), null); // no es de este generador
  assert.ok(RT.cubre(pl, 'algebra.matrices-y-determinantes'));
  assert.ok(!RT.cubre(cat.plantillas['rm-trasvases'], 'razonamiento-matematico.juegos-recreativos')); // sin filas: no repasa
});

test('cada unidad que la tabla cubre consigue un problema suyo con las semillas del repaso', () => {
  const porUnidad = {};
  for (const pl of Object.values(cat.plantillas)) {
    if (pl.formato !== 'predicciones') continue;
    for (const u of pl.unidades) if (RT.cubre(pl, u)) (porUnidad[u] = porUnidad[u] || []).push(pl);
  }
  const R = require('./repaso.js');
  for (const [u, pls] of Object.entries(porUnidad)) {
    let ok = false;
    for (const pl of pls) {
      const g = gen(pl);
      for (let k = 0; k < 400 && !ok; k++) { try { ok = RT.unidadDe(pl, g.generar(R.semilla('prueba', u, { hechos: 0 }, k))) === u; } catch { /* otra */ } }
      if (ok) break;
    }
    assert.ok(ok, `${u}: ninguna semilla dio un problema suyo`);
  }
  assert.ok(Object.keys(porUnidad).length >= 100, `solo ${Object.keys(porUnidad).length} unidades con repaso`);
});

test('papel: cada fila apunta a un problema que existe y a una unidad de su escena', () => {
  const fs = require('fs');
  for (const [id, m] of Object.entries(RT.PAPEL)) {
    const pl = cat.plantillas[id];
    assert.ok(pl && pl.papel && pl.unidades.length > 1, `${id}: no es una escena de varias unidades con papel`);
    const ids = new Set(JSON.parse(fs.readFileSync(path.join(RAIZ, pl.papel), 'utf8')).problemas.map(q => q.id));
    for (const [pid, v] of Object.entries(m)) {
      assert.ok(ids.has(pid), `${id}: no hay problema ${pid}`);
      for (const u of (Array.isArray(v) ? v : [v])) assert.ok(pl.unidades.includes(u), `${id}.${pid}: ${u} no es de la escena`);
    }
  }
  assert.deepEqual(RT.unidadesPapel(cat.plantillas.termodinamica, 'p1'), ['fisica.termodinamica']);
  assert.deepEqual(RT.unidadesPapel(cat.plantillas.polinomios, 'p9'), ['algebra.ecuaciones-polinomiales']);
  assert.ok(RT.papelCubre(cat.plantillas.solidos, 'geometria.poliedros'));
  assert.ok(!RT.papelCubre(cat.plantillas['orden-informacion'], 'razonamiento-matematico.no-existe'));
});

test('cobertura: generador o papel en todas las unidades que no son de razonamiento verbal', () => {
  const sin = [];
  for (const cu of cat.cursos) for (const u of cu.unidades) {
    if (cu.id === 'razonamiento-verbal') continue;
    const pls = u.plantillas.map(p => cat.plantillas[p]).filter(Boolean);
    if (!pls.some(p => (p.formato === 'predicciones' && RT.cubre(p, u.id)) || RT.papelCubre(p, u.id))) sin.push(u.id);
  }
  assert.deepEqual(sin, []);
  assert.ok(!RT.papelCubre(cat.plantillas['tipologia-textual'], 'razonamiento-verbal.tipologia-textual'));
});

test('cobertura del repaso: las 152 unidades tienen de dónde sacar una pregunta', () => {
  const fs = require('fs');
  const L = require('./lectura.js');
  const unidadesVerbal = new Set();
  for (const pl of Object.values(cat.plantillas)) {
    if (pl.formato !== 'lectura' || !pl.banco) continue;
    const ind = JSON.parse(fs.readFileSync(path.join(RAIZ, pl.banco), 'utf8')), dir = path.dirname(pl.banco);
    for (const [carpeta, ids] of [['textos', ind.textos || []], ['ejercicios', ind.ejercicios || []]]) {
      for (const id of ids) {
        const it = L.normalizar(JSON.parse(fs.readFileSync(path.join(RAIZ, dir, carpeta, id + '.json'), 'utf8')));
        for (const q of it.preguntas) if (pl.unidades.includes(q.unidad)) unidadesVerbal.add(q.unidad);
      }
    }
  }
  const fuente = {};
  for (const cu of cat.cursos) for (const u of cu.unidades) {
    const pls = u.plantillas.map(p => cat.plantillas[p]).filter(Boolean);
    fuente[u.id] = pls.some(p => p.formato === 'predicciones' && RT.cubre(p, u.id)) ? 'generador'
      : pls.some(p => RT.papelCubre(p, u.id)) ? 'papel' : unidadesVerbal.has(u.id) ? 'verbal' : null;
  }
  const sin = Object.keys(fuente).filter(u => !fuente[u]);
  assert.deepEqual(sin, []);
  assert.equal(Object.keys(fuente).length, 152);
});
