const test = require('node:test');
const assert = require('node:assert/strict');
const Mapa = require('./mapa.js');
const cat = require('../app/datos/catalogo.json');

const curso = {
  ramas: [{ nombre: 'A', unidades: ['x.a', 'x.b', 'x.c', 'x.d'] }, { nombre: 'B', unidades: ['x.e'] }, { nombre: 'C', unidades: ['x.f'] }],
  unidades: [
    { id: 'x.a', requiere: [] }, { id: 'x.b', requiere: ['x.a'] }, { id: 'x.c', requiere: ['x.a'] },
    { id: 'x.d', requiere: ['x.b', 'x.c', 'y.z'] }, { id: 'x.e', requiere: ['x.b'] }, { id: 'x.f', requiere: [] },
  ],
};

test('los pisos de una rama van de lo básico a lo complejo', () => {
  const { ramas } = Mapa.armar(curso);
  assert.deepEqual(ramas[0].pisos.map(f => f.map(n => n.id)), [['x.a'], ['x.b', 'x.c'], ['x.d']]);
  const d = ramas[0].nodos.find(n => n.id === 'x.d');
  assert.deepEqual(d.dentro, ['x.b', 'x.c']);
  assert.deepEqual(d.fuera, ['y.z']);
});

test('una rama que no se apoya en otra es independiente', () => {
  const { ramas } = Mapa.armar(curso);
  assert.equal(ramas[0].independiente, true);
  assert.deepEqual(ramas[1].necesita, [0]);
  assert.equal(ramas[1].independiente, false);
  assert.equal(ramas[2].independiente, true);
  // B solo tiene x.e, que necesita x.b de la rama A: no se puede empezar por B
  assert.equal(ramas[1].conEntrada, false);
  // una rama con un tema libre y otro que se apoya en otra rama sí se puede empezar
  const mixto = { ramas: [{ nombre: 'A', unidades: ['x.a'] }, { nombre: 'B', unidades: ['x.b', 'x.c'] }],
    unidades: [{ id: 'x.a', requiere: [] }, { id: 'x.b', requiere: [] }, { id: 'x.c', requiere: ['x.a'] }] };
  const r = Mapa.armar(mixto).ramas[1];
  assert.equal(r.independiente, false);
  assert.equal(r.conEntrada, true);
});

test('lo siguiente es la primera unidad abierta sin hacer', () => {
  const hechas = new Set(['x.a']);
  const m = Mapa.armar(curso, { hecha: id => hechas.has(id) });
  assert.equal(m.siguiente.id, 'x.b');
  hechas.add('x.b'); hechas.add('x.c');
  // x.d está abierta (y.z es de otro curso: no cierra), pero x.e ya tiene todos sus requisitos: va primero
  assert.equal(Mapa.armar(curso, { hecha: id => hechas.has(id) }).siguiente.id, 'x.e');
});

test('un tema se abre cuando su requisito del mismo curso está aprobado', () => {
  const nodo = (opc, id) => Mapa.armar(curso, opc).ramas.flatMap(r => r.nodos).find(n => n.id === id);
  // al inicio solo las raíces están abiertas
  assert.equal(nodo({}, 'x.a').abierta, true);
  assert.equal(nodo({}, 'x.f').abierta, true);
  assert.equal(nodo({}, 'x.b').abierta, false);
  assert.deepEqual(nodo({}, 'x.b').faltan, ['x.a']);
  // aprobar la prueba de x.a (sin estudiarla) abre x.b y x.c
  const aprobada = id => id === 'x.a';
  assert.equal(nodo({ aprobada }, 'x.b').abierta, true);
  assert.equal(nodo({ aprobada }, 'x.c').abierta, true);
  // x.d necesita x.b y x.c; y.z, de otro curso, no cierra
  const ab = id => ['x.a', 'x.b', 'x.c'].includes(id);
  assert.equal(nodo({ aprobada: ab }, 'x.d').abierta, true);
  assert.deepEqual(nodo({ aprobada: ab }, 'x.d').faltan, []);
  // lo que ya empezó no se cierra
  assert.equal(nodo({ empezada: id => id === 'x.d' }, 'x.d').abierta, true);
  // la consulta suelta da lo mismo
  assert.deepEqual(Mapa.abierta(curso, 'x.b', {}), { abierta: false, faltan: ['x.a'] });
});

test('un requisito que la universidad no pide no cierra nada', () => {
  const n = Mapa.armar(curso, { incluir: u => u.id !== 'x.a' }).ramas[0].nodos.find(x => x.id === 'x.b');
  assert.equal(n.abierta, true);
});

test('si la universidad no pide una unidad, sale del mapa y queda como requisito de afuera', () => {
  const m = Mapa.armar(curso, { incluir: u => u.id !== 'x.a' });
  assert.deepEqual(m.ramas[0].pisos[0].map(n => n.id), ['x.b', 'x.c']);
  assert.deepEqual(m.ramas[0].nodos[0].fuera, ['x.a']);
});

test('el catálogo real arma un mapa con todas sus unidades', () => {
  for (const c of cat.cursos) {
    const m = Mapa.armar(c);
    assert.equal(m.ramas.reduce((s, r) => s + r.nodos.length, 0), c.unidades.length, c.id);
    assert.ok(m.ramas.some(r => r.independiente), `${c.id}: alguna rama tiene que poder empezarse sin otra`);
    assert.ok(m.siguiente, c.id);
    assert.ok(m.ramas.flatMap(r => r.nodos).some(n => n.abierta), `${c.id}: sin nada aprobado, algo tiene que estar abierto`);
  }
});
