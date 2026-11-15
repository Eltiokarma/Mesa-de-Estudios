// Pruebas de la animación automática (docs/3d.md §6) en las unidades de química de la ronda 5, parte A.
// El lector mueve el control con `auto` sin ajustarlo a su paso: dibujo y lectura reciben valores intermedios.
// Aquí se recorre cada control animado en 61 instantes (también entre pasos) y se exige que:
//   - el dibujo salga sano (sin NaN ni undefined) con su texto alternativo;
//   - la lectura cumpla su tope de 12 palabras y cambie a lo largo del recorrido (se mueve con la animación);
//   - las manijas de arrastre queden en números finitos;
//   - cada idea y la primera mesa del laboratorio tengan un control animado (salvo las que el reporte excusa).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../nucleo/teoria.js');
const Kit = require('../../nucleo/kit/kit.js');
const Ecuacion = require('../../nucleo/ecuacion.js');

const RAIZ = path.join(__dirname, '..', '..');
// Unidades de esta parte. A medida que se animan, se agregan aquí.
const UNIDADES = ['materia-y-energia', 'estructura-atomica', 'tabla-periodica', 'enlace-quimico', 'nomenclatura-inorganica'];
// Ideas que de verdad no se prestan a animación (explicadas en rutinas/teoria5-quimica-a.md).
const SIN_ANIMAR = new Set([]);

function revisar(nombre, j, piezaPorDefecto) {
  const ctr = j.controles || [];
  const auto = ctr.find(c => c.auto && !c.opciones);
  assert.ok(auto, `${nombre}: sin control animado`);
  const base = Teoria.inicio(j);
  const lecturas = new Set();
  for (let i = 0; i <= 60; i++) {
    const v = Object.assign({}, base, { [auto.id]: Math.round((auto.min + (auto.max - auto.min) * i / 60) * 1e5) / 1e5 });
    const dib = j.dibujo(v);
    const P = Kit.piezas[j.pieza || piezaPorDefecto];
    assert.ok(P, `${nombre}: pieza ${j.pieza}`);
    const svg = P.dibujar(dib.datos, dib.estado || {});
    assert.ok(svg.includes('<svg'), `${nombre} ${auto.id}=${v[auto.id]}: sin SVG`);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `${nombre} ${auto.id}=${v[auto.id]}: el SVG muestra NaN`);
    assert.ok(P.alt(dib.datos).length >= 15, `${nombre}: alt corto`);
    if (j.lectura) {
      const l = j.lectura(v), txt = Ecuacion.texto(l);
      assert.ok(!/NaN|undefined|Infinity/.test(txt), `${nombre} ${auto.id}=${v[auto.id]}: lectura ${txt}`);
      assert.ok(Teoria.palabras(l) <= Teoria.PRESUPUESTO.lectura, `${nombre}: lectura de ${Teoria.palabras(l)} palabras: ${txt}`);
      lecturas.add(txt);
    }
    for (const a of j.arrastres || []) {
      const p = a.donde(v);
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${nombre}: manija ${a.id} no finita`);
    }
  }
  if (j.lectura) assert.ok(lecturas.size >= 2, `${nombre}: la lectura no se mueve con la animación`);
}

for (const u of UNIDADES) {
  test(`animación de quimica.${u}: cada idea y la primera mesa se mueven solas`, () => {
    const def = require(path.join(__dirname, 'quimica', `${u}.js`));
    for (const r of def.requiere || []) require(path.join(RAIZ, r));
    for (const idea of def.ideas) {
      if (SIN_ANIMAR.has(`${u}/${idea.id}`)) continue;
      revisar(`${u}/${idea.id}`, idea.juega, idea.pieza);
    }
    const mesa = (def.laboratorio || [])[0];
    assert.ok(mesa, `${u}: sin laboratorio`);
    revisar(`${u}/lab ${mesa.id}`, mesa, mesa.pieza);
  });
}
