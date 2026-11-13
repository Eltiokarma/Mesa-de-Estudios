// Pruebas de la unificación de subtemas del banco Cuzcano (herramientas/unificar-subtemas.js).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const U = require('./unificar-subtemas');

const DIR = path.join(__dirname, '..', 'contenido', 'ejercicios', 'cuzcano');
const tablas = {
  temas: { 'fisica.cinematica': 'fisica.movimiento-rectilineo' },
  subtemas: {
    'fisica.cinematica': {
      canonicos: [
        { id: 'encuentros-y-alcances', nombre: 'Encuentros y alcances', unidad: 'fisica.movimiento-rectilineo' },
        { id: 'tiro-parabolico', nombre: 'Tiro parabólico', unidad: 'fisica.movimiento-parabolico-y-circular' },
        { id: 'mezclas-de-gases', nombre: 'Mezclas de gases', unidad: 'quimica.gases' },
      ],
      etiquetas: { 'encuentros y alcances': 'encuentros-y-alcances', 'tiro': 'tiro-parabolico', 'gases': 'mezclas-de-gases', 'cajon': 'encuentros-y-alcances' },
      fichas: { 'L:propuesto:7': 'tiro-parabolico', 'L:propuesto:9': 'tiro-parabolico' },
    },
  },
};
const ficha = (uid, subtema) => ({ id: 'cz-x', curso: 'fisica', enunciado: '…', banco: { uid, tema: 'fisica.cinematica', subtema, titulo: 't', ficha: {} } });

test('la limpieza junta las variantes de una misma etiqueta', () => {
  for (const v of ['Ley de Faraday', 'ley-de-faraday', 'ley_de_faraday', '  LEY   de  Faraday ']) assert.equal(U.normalizar(v), 'ley de faraday');
  assert.equal(U.normalizar('Neutralización'), U.normalizar('neutralizacion'));
  assert.equal(U.normalizar(null), null);
  assert.equal(U.normalizar('None'), null);
});

test('una etiqueta conocida pasa a su nombre unificado y conserva la de origen', () => {
  const ej = ficha('L:propuesto:1', 'Encuentros_y-alcances');
  assert.equal(U.aplicar(ej, tablas), 'unificado');
  assert.equal(ej.banco.subtema, 'Encuentros y alcances');
  assert.equal(ej.banco.subtema_fuente, 'Encuentros_y-alcances');
  assert.equal(ej.unidad, 'fisica.movimiento-rectilineo');
});

test('la unidad es la del subtema, aunque sea de otro curso', () => {
  const a = ficha('L:propuesto:2', 'tiro'); U.aplicar(a, tablas);
  assert.equal(a.unidad, 'fisica.movimiento-parabolico-y-circular');
  const b = ficha('L:propuesto:3', 'gases'); U.aplicar(b, tablas);
  assert.equal(b.banco.subtema, 'Mezclas de gases');
  assert.equal(b.unidad, 'quimica.gases');   // de otro curso: el curso es el del libro; la unidad, donde se estudia
});

test('la asignación por ficha manda: sin etiqueta y con etiqueta que juntaba cosas', () => {
  const a = ficha('L:propuesto:7', null); U.aplicar(a, tablas);
  assert.equal(a.banco.subtema, 'Tiro parabólico'); assert.equal(a.banco.subtema_fuente, null);
  const b = ficha('L:propuesto:9', 'cajon'); U.aplicar(b, tablas);
  assert.equal(b.banco.subtema, 'Tiro parabólico'); assert.equal(b.banco.subtema_fuente, 'cajon');
});

test('una etiqueta desconocida se deja como vino', () => {
  const ej = ficha('L:propuesto:4', 'etiqueta nueva');
  assert.equal(U.aplicar(ej, tablas), 'sin-asignar');
  assert.equal(ej.banco.subtema, 'etiqueta nueva');
  assert.ok(!('subtema_fuente' in ej.banco));
  assert.equal(ej.unidad, 'fisica.movimiento-rectilineo');
});

test('repetir la unificación no cambia nada', () => {
  const ej = ficha('L:propuesto:1', 'encuentros y alcances'); U.aplicar(ej, tablas);
  const antes = JSON.stringify(U.ordenar(ej));
  U.aplicar(ej, tablas);
  assert.equal(JSON.stringify(U.ordenar(ej)), antes);
});

test('el banco versionado está unificado: todo subtema es del vocabulario de su tema', () => {
  if (!fs.existsSync(path.join(DIR, 'subtemas.json'))) return;
  const t = U.cargar(DIR);
  const cat = new Set();
  const dirCat = path.join(__dirname, '..', 'catalogo', 'cursos');
  for (const f of fs.readdirSync(dirCat)) for (const u of JSON.parse(fs.readFileSync(path.join(dirCat, f), 'utf8')).unidades) cat.add(u.id);
  for (const [tema, v] of Object.entries(t.subtemas)) {
    assert.ok(v.canonicos.length >= 1 && v.canonicos.length <= 14, `${tema}: ${v.canonicos.length} subtemas`);
    assert.equal(new Set(v.canonicos.map(c => c.id)).size, v.canonicos.length, `${tema}: ids repetidos`);
    for (const c of v.canonicos) assert.ok(cat.has(c.unidad), `${tema}: unidad desconocida ${c.unidad}`);
    const ids = new Set(v.canonicos.map(c => c.id));
    for (const [k, id] of Object.entries(v.etiquetas)) assert.ok(ids.has(id), `${tema}: la etiqueta «${k}» apunta a ${id}, que no existe`);
    for (const [uid, id] of Object.entries(v.fichas)) assert.ok(ids.has(id), `${tema}: la ficha ${uid} apunta a ${id}, que no existe`);
  }
  for (const [tema, u] of Object.entries(t.temas)) assert.equal(u.split('.')[0], tema.split('.')[0], `${tema}: la unidad principal debe ser de su curso`);
  let fichas = 0;
  for (const curso of fs.readdirSync(DIR)) {
    const d = path.join(DIR, curso);
    if (!fs.statSync(d).isDirectory() || curso === 'figuras') continue;
    for (const f of fs.readdirSync(d).filter(x => x.endsWith('.jsonl'))) {
      for (const l of fs.readFileSync(path.join(d, f), 'utf8').split('\n')) {
        if (!l.trim()) continue;
        const ej = JSON.parse(l); fichas++;
        const v = t.subtemas[ej.banco.tema];
        assert.ok(v, `${ej.id}: el tema ${ej.banco.tema} no tiene vocabulario`);
        assert.ok(v.canonicos.some(c => c.nombre === ej.banco.subtema), `${ej.id}: «${ej.banco.subtema}» no es un subtema de ${ej.banco.tema}`);
        assert.ok('subtema_fuente' in ej.banco, `${ej.id}: falta la etiqueta de origen`);
        assert.ok(ej.unidad, `${ej.id}: sin unidad`);
        const can = v.canonicos.find(c => c.nombre === ej.banco.subtema);
        if (can.unidad && !ej.banco.revision_unidad) assert.equal(ej.unidad, can.unidad, `${ej.id}: la unidad no es la de su subtema`);
      }
    }
  }
  assert.ok(fichas > 0);
  const res = U.aplicarCarpeta({ dir: DIR, seco: true });
  assert.equal(res.unificado, fichas);
  assert.equal(res['sin-asignar'], 0);
});

test('la revisión por ficha manda sobre el subtema y deja su marca', () => {
  const t = { ...tablas, revisado_por: 'modelo', revision: { 'L:propuesto:2': { veredicto: 'dudosa', unidad: 'fisica.dinamica', propuesta: 'fisica.movimiento-parabolico-y-circular', estado: 'por-revisar', nota: 'n' } } };
  const a = ficha('L:propuesto:2', 'tiro'); U.aplicar(a, t);
  assert.equal(a.unidad, 'fisica.dinamica');
  assert.deepEqual(a.banco.revision_unidad, { por: 'modelo', veredicto: 'dudosa', estado: 'por-revisar', propuesta: 'fisica.movimiento-parabolico-y-circular', nota: 'n' });
  const b = ficha('L:propuesto:3', 'tiro'); b.banco.revision_unidad = { por: 'modelo' }; U.aplicar(b, t);
  assert.equal(b.unidad, 'fisica.movimiento-parabolico-y-circular');
  assert.ok(!('revision_unidad' in b.banco));   // si sale de la revisión, la marca se va
});

test('revision-unidades.json: unidades del catálogo, veredictos válidos y fichas al día', () => {
  const f = path.join(DIR, 'revision-unidades.json');
  if (!fs.existsSync(f)) return;
  const rev = JSON.parse(fs.readFileSync(f, 'utf8'));
  const cat = new Set();
  const dirCat = path.join(__dirname, '..', 'catalogo', 'cursos');
  for (const c of fs.readdirSync(dirCat).filter(x => x.endsWith('.json'))) for (const u of JSON.parse(fs.readFileSync(path.join(dirCat, c), 'utf8')).unidades || []) cat.add(u.id);
  for (const [uid, r] of Object.entries(rev.fichas)) {
    assert.ok(cat.has(r.unidad), `${uid}: unidad desconocida ${r.unidad}`);
    assert.ok(['correcta', 'incorrecta', 'dudosa'].includes(r.veredicto), `${uid}: veredicto ${r.veredicto}`);
    assert.equal(r.estado, r.veredicto === 'dudosa' ? 'por-revisar' : 'revisada-por-modelo', `${uid}: estado`);
  }
  let vistas = 0;
  for (const curso of fs.readdirSync(DIR)) {
    const d = path.join(DIR, curso);
    if (!fs.statSync(d).isDirectory() || curso === 'figuras') continue;
    for (const a of fs.readdirSync(d).filter(x => x.endsWith('.jsonl'))) {
      for (const l of fs.readFileSync(path.join(d, a), 'utf8').split('\n')) {
        if (!l.trim()) continue;
        const ej = JSON.parse(l); const r = rev.fichas[ej.banco.uid];
        if (!r) { assert.ok(!ej.banco.revision_unidad, `${ej.id}: marca de revisión sin revisión`); continue; }
        vistas++;
        assert.equal(ej.unidad, r.unidad, `${ej.id}: falta aplicar la revisión (node herramientas/unificar-subtemas.js)`);
        assert.equal(ej.banco.revision_unidad.estado, r.estado);
      }
    }
  }
  assert.equal(vistas, Object.keys(rev.fichas).length, 'hay fichas en la revisión que no están en el banco');
});
