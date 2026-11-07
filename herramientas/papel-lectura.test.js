// El papel de los módulos de lectura sale del banco: cada papel.json tiene que estar al día y cumplir la regla 6.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const P = require('./papel-lectura.js');
const L = require('../nucleo/lectura.js');

const MODULOS = P.modulos();
const banco = (ficha, dir) => {
  const ruta = path.resolve(dir, ficha.banco), base = path.dirname(ruta), i = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  const leer = (c, id) => JSON.parse(fs.readFileSync(path.join(base, c, id + '.json'), 'utf8'));
  return { indice: i, items: [...(i.textos || []).map(id => leer('textos', id)), ...(i.ejercicios || []).map(id => leer('ejercicios', id))] };
};

test('hay papel para los siete módulos de lectura', () => {
  assert.ok(MODULOS.length >= 7);
  for (const { ficha } of MODULOS) assert.equal(ficha.papel, 'papel.json', `${ficha.id}: la ficha debe apuntar a papel.json`);
});

for (const { ficha, dir } of MODULOS) {
  test(`${ficha.id}: papel.json está al día con el banco (npm run catalogo)`, () => {
    assert.equal(fs.readFileSync(path.join(dir, 'papel.json'), 'utf8'), P.texto(ficha, dir));
  });

  test(`${ficha.id}: el papel cumple la regla 6 y conserva la clave del banco`, () => {
    const d = P.construir(ficha, dir), { indice, items } = banco(ficha, dir);
    const n = d.problemas.length, preguntas = d.problemas.reduce((s, p) => s + p.preguntas.length, 0);
    // Un problema es un texto con 3 a 5 preguntas: 4 textos ya son más de 10 preguntas.
    assert.ok(n >= 4 && n <= 10 && preguntas >= 10, `${ficha.id}: ${n} problemas y ${preguntas} preguntas`);
    const ids = d.problemas.map(p => p.id);
    assert.ok(!ids.includes(indice.entrada) && !ids.includes(indice.salida), 'la entrada y la salida no van al papel');
    if (items.length > 10) {
      const cubiertas = new Set(ids.flatMap(id => L.normalizar(items.find(x => x.id === id)).preguntas.map(q => q.unidad)));
      for (const u of ficha.unidades) assert.ok(cubiertas.has(u), `${ficha.id}: el papel no tiene ninguna pregunta de ${u}`);
    }
    for (const p of d.problemas) {
      const it = L.normalizar(items.find(x => x.id === p.id));
      assert.ok(p.enunciado && p.respuesta && p.pasos.length, `${p.id}: falta enunciado, respuesta o pasos`);
      assert.equal(p.preguntas.length, it.preguntas.length);
      const claves = [];
      p.preguntas.forEach((q, j) => {
        const orig = it.preguntas[j];
        assert.equal(Boolean(q.previo), Boolean(orig.previo), `${p.id}.${orig.id}: el paso previo no pasó al papel`);
        if (q.previo) assert.match(q.previo, /^Antes de mirar las alternativas/);
        assert.doesNotMatch(q.previo || '', /\b(toca|arrastra)\b/i, `${p.id}.${orig.id}: el previo del papel usa verbos de la pantalla`);
        // Mismas alternativas que el banco, barajadas, con letras seguidas.
        assert.deepEqual(q.alternativas.map(a => a.t).sort(), orig.alternativas.map(a => a.t).sort());
        assert.deepEqual(q.alternativas.map(a => a.letra), L.LETRAS.slice(0, q.alternativas.length));
        const c = q.alternativas.find(a => a.t === orig.alternativas.find(x => x.correcta).t);
        claves.push(c.letra);
      });
      assert.equal(p.respuesta, `Clave: ${claves.map((l, j) => (claves.length > 1 ? `${j + 1}: ` : '') + l).join(' · ')}.`);
      if (!it.ejercicio) {
        const ors = p.texto.parrafos.flat();
        assert.deepEqual(ors.map(o => o.n), ors.map((_, k) => k + 1), `${p.id}: las oraciones van numeradas desde 1`);
        assert.equal((p.texto.figuras || []).length, L.figuras(it).length, `${p.id}: faltan figuras`);
      }
    }
  });
}

test('papel: barajar con la semilla fija no deja la clave siempre en la misma letra', () => {
  const letras = MODULOS.flatMap(({ ficha, dir }) => P.construir(ficha, dir).problemas
    .flatMap(p => p.respuesta.replace(/^Clave: /, '').split(' · ').map(x => x.slice(-2, -1) === ':' ? x : x.replace(/^\d+: /, '').replace('.', ''))));
  const cuenta = {};
  for (const l of letras) cuenta[l] = (cuenta[l] || 0) + 1;
  assert.ok(Math.max(...Object.values(cuenta)) / letras.length < 0.4, JSON.stringify(cuenta));
});
