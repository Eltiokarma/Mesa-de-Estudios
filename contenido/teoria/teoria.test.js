// Pruebas de la teoría interactiva (docs/teoria.md): cada archivo contenido/teoria/<curso>/<unidad>.js cumple el formato.
// Se corren con npm test. Una unidad nueva no necesita tocar este archivo: se descubre sola.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Teoria = require('../../nucleo/teoria.js');

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
      assert.match(r, /^\/nucleo\/kit\/piezas\/[a-z0-9-]+\.js$/, `requiere solo piezas del kit: ${r}`);
      require(path.join(RAIZ, r));
    }
    const p = Teoria.problemas(def, { temas: u.temas, semillas: 60 });
    assert.deepEqual(p, [], p.join('\n'));
  });
}

test('el catálogo construido lleva la teoría de cada unidad que la tiene', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app', 'datos', 'catalogo.json'), 'utf8'));
  const conTeoria = cat.cursos.flatMap(c => c.unidades).filter(u => u.teoria).map(u => u.id).sort();
  assert.deepEqual(conTeoria, archivos.map(([c, f]) => `${c}.${f.replace(/\.js$/, '')}`).sort(), 'corre npm run catalogo');
});
