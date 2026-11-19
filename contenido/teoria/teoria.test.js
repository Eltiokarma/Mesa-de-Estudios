// Pruebas de la teoría interactiva (docs/teoria.md): cada archivo contenido/teoria/<curso>/<unidad>.js cumple el formato.
// Se corren con npm test. Una unidad nueva no necesita tocar este archivo: se descubre sola.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Teoria = require('../../nucleo/teoria.js');
const Reglas = require('../../nucleo/teoria-reglas.js');

const RAIZ = path.join(__dirname, '..', '..');
const cursos = Object.fromEntries(fs.readdirSync(path.join(RAIZ, 'catalogo', 'cursos')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo', 'cursos', f), 'utf8'))).map(c => [c.id, c]));
const archivos = fs.readdirSync(__dirname, { withFileTypes: true }).filter(d => d.isDirectory())
  .flatMap(d => fs.readdirSync(path.join(__dirname, d.name)).filter(f => f.endsWith('.js') && !f.endsWith('.test.js')).map(f => [d.name, f]));

test('hay al menos una unidad de teoría', () => assert.ok(archivos.length >= 1));

for (const [curso, archivo] of archivos) {
  test(`teoría ${curso}/${archivo}: formato, topes de texto, piezas puras y casos de «Ahora tú»`, () => {
    const def = require(path.join(__dirname, curso, archivo));
    const id = `${curso}.${archivo.replace(/\.js$/, '')}`;
    assert.equal(def.unidad, id, 'el nombre del archivo es el id de la unidad');
    const c = cursos[curso];
    assert.ok(c, `el curso ${curso} no está en el catálogo`);
    const u = c.unidades.find(x => x.id === id);
    assert.ok(u, `la unidad ${id} no está en el catálogo`);
    assert.ok(Teoria.PERSONAJES[curso], `el curso ${curso} no tiene personaje`);
    for (const r of def.requiere || []) {
      // Piezas del kit, el motor de una plantilla (la unidad reusa su cálculo, regla 1), la paleta de elementos o un
      // módulo 3D de nucleo/ que termina en «3d» (ronda 4: nucleo/fisica3d.js, nucleo/solidos3d.js, nucleo/geometria3d.js).
      // app/teoria.js carga los requiere en orden (async = false), así que el motor va antes que la pieza que lo usa.
      assert.match(r, /^\/(nucleo\/kit\/piezas\/[a-z0-9-]+|plantillas\/[a-z0-9-]+\/motor|nucleo\/elementos|nucleo\/[a-z0-9-]+3d)\.js$/,
        `requiere solo piezas del kit, motores de plantilla, nucleo/elementos.js o un módulo 3D de nucleo/: ${r}`);
      require(path.join(RAIZ, r));
    }
    // Con calidad: 2 corren además las reglas de nucleo/teoria-reglas.js (docs/metodo/unidad/reglas-validador.md).
    const p = Teoria.problemas(def, { temas: u.temas, semillas: 60 });
    assert.deepEqual(p, [], p.join('\n'));
  });
}

// Reglas de calidad 2 (Etapa 5, 19 nov): las faltas reales del contenido que ya existía están en una lista con fecha
// (TeoriaReglas.EXCEPCIONES). La lista es de pendientes: cada línea nombra una unidad con calidad 2 y una idea suya.
// Si una excepción ya no cubre nada (alguien corrigió la unidad), la prueba no falla: avisa para que se borre.
test('reglas de calidad 2: cada excepción nombra una unidad con calidad 2 y una idea que existe', t => {
  const defs = {};
  for (const [curso, archivo] of archivos) {
    const id = `${curso}.${archivo.replace(/\.js$/, '')}`;
    if (!Reglas.EXCEPCIONES.some(x => x.unidad === id)) continue;
    try { defs[id] = require(path.join(__dirname, curso, archivo)); for (const r of defs[id].requiere || []) require(path.join(RAIZ, r)); } catch (e) { /* la dirá su propia prueba */ }
  }
  for (const x of Reglas.EXCEPCIONES) {
    const def = defs[x.unidad];
    assert.ok(def, `la excepción nombra una unidad que no existe o no carga: ${x.unidad}`);
    assert.ok(def.calidad >= 2, `${x.unidad} no tiene calidad 2: su excepción sobra`);
    if (x.idea) assert.ok(def.ideas.some(i => i.id === x.idea), `${x.unidad}: no hay idea «${x.idea}»`);
  }
  for (const [id, def] of Object.entries(defs)) {
    for (const x of Reglas.sobran(def, { semillas: 60 }, Teoria)) t.diagnostic(`excepción que ya no hace falta (bórrala de nucleo/teoria-reglas.js): ${x.regla} · ${x.unidad} · ${x.idea || 'toda la unidad'}`);
  }
});

test('el catálogo construido lleva la teoría de cada unidad que la tiene', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app', 'datos', 'catalogo.json'), 'utf8'));
  const conTeoria = cat.cursos.flatMap(c => c.unidades).filter(u => u.teoria).map(u => u.id).sort();
  assert.deepEqual(conTeoria, archivos.map(([c, f]) => `${c}.${f.replace(/\.js$/, '')}`).sort(), 'corre npm run catalogo');
});

test('cada compañero tiene sus líneas por defecto, dentro del tope de la voz', () => {
  const claves = ['prediccion', 'coincide', 'noCoincide', 'mira', 'regla', 'ahora', 'acierto', 'error', 'nose', 'fin', 'llegada', 'regreso', 'despedida', 'ayuda2'];
  for (const [curso, p] of Object.entries(Teoria.PERSONAJES)) {
    for (const k of claves) {
      assert.ok(p.voces && p.voces[k], `${curso}: falta la voz «${k}»`);
      assert.ok(Teoria.palabras(p.voces[k]) <= Teoria.PRESUPUESTO.voz, `${curso}.${k}: ${p.voces[k]}`);
    }
  }
});

test('glosario: un término por curso, referencias que existen y archivos de la app al día', () => {
  const C = require('../../herramientas/construir-catalogo.js');
  const glos = C.construirGlosario();
  const problemas = Object.values(glos).flatMap(g => g.problemas);
  assert.deepEqual(problemas, [], problemas.join('\n'));
  for (const g of Object.values(glos)) {
    const f = path.join(C.DIR_GLOSARIO, `${g.curso}.json`);
    assert.ok(fs.existsSync(f) && fs.readFileSync(f, 'utf8') === C.textoGlosario(g), `app/datos/glosario/${g.curso}.json no está al día: corre npm run catalogo`);
  }
});

// Tope de ideas (Gerson, mesa del 18 nov): 6 por unidad; 7 solo si la unidad declara septimaIdea con su motivo.
test('tope de ideas: 6, o 7 con septimaIdea y su motivo', () => {
  const base = require('./aritmetica/numeracion.js');
  const siete = base.ideas.concat(base.ideas.slice(0, 2)).slice(0, 7).map((i, k) => Object.assign({}, i, { id: `${i.id}-${k}` }));
  const tope = def => Teoria.problemas(def).filter(m => /el tope es/.test(m));
  assert.equal(tope(Object.assign({}, base, { ideas: siete })).length, 1, 'sin motivo, 7 ideas no pasan');
  assert.equal(tope(Object.assign({}, base, { ideas: siete, septimaIdea: 'corto' })).length, 1, 'un motivo vacío no cuenta');
  assert.equal(tope(Object.assign({}, base, { ideas: siete, septimaIdea: 'la resta y las cifras ocultas son 4 de 6 preguntas' })).length, 0);
  const ocho = siete.concat([Object.assign({}, siete[0], { id: 'otra' })]);
  assert.equal(tope(Object.assign({}, base, { ideas: ocho, septimaIdea: 'la resta y las cifras ocultas son 4 de 6 preguntas' })).length, 1, 'ni con motivo pasan 8');
});
