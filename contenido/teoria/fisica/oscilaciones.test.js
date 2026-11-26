// Contrato de la unidad completa; los seis archivos específicos recalculan la física por otros caminos.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const def = require('./oscilaciones.js');
const T = require('../../../nucleo/teoria.js');
const E = require('../../../nucleo/ecuacion.js');
const Kit = require('../../../nucleo/kit/kit.js');
for (const ruta of def.requiere) require(path.resolve(__dirname, '../../..', '.' + ruta));

test('oscilaciones: seis ideas y noventa ejemplos; conserva los cinco identificadores anteriores', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['ciclo-y-amplitud', 'aceleracion-al-centro', 'graficas-mas', 'periodo-resorte', 'pendulo', 'energia-mas']);
  assert.ok(!(def.calidad >= 2), 'La auditoría posterior es quien concede calidad 2.');
  for (const i of def.ideas) {
    assert.deepEqual(T.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
    assert.equal(i.ejemplos.length, 15);
    for (const nivel of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === nivel).length, 5);
  }
});

test('oscilaciones: contrato de calidad 2 simulado en 400 semillas, sin marcar la unidad', () => {
  const temas = ['Movimiento periódico y oscilatorio', 'Ecuaciones y gráficas del MAS', 'Masa-resorte horizontal y vertical', 'Péndulo simple', 'Energía en el MAS'];
  assert.deepEqual(T.problemas({ ...def, calidad: 2 }, { semillas: 400, temas }), []);
});

test('oscilaciones: texto real de ecuaciones y SVG sin subíndices crudos ni valores inválidos', () => {
  function texto(partes, donde) {
    if (partes === undefined || partes === null) return;
    const html = E.html(partes), visible = html.replace(/<[^>]*>/g, '');
    assert.ok(!/_|undefined|NaN|Infinity|\[object Object\]/.test(visible), `${donde}: ${visible}`);
  }
  function figura(fig, pieza, donde) {
    if (!fig) return;
    const p = Kit.piezas[fig.pieza || pieza]; assert.ok(p, donde);
    const svg = p.dibujar(fig.datos, fig.estado || {});
    assert.ok(!/NaN|undefined|Infinity/.test(svg), donde);
    const rotulos = (svg.match(/<text\b[\s\S]*?<\/text>/g) || []).map(s => s.replace(/<[^>]+>/g, '')).join(' ');
    assert.ok(!/_|\[object Object\]/.test(rotulos), `${donde}: ${rotulos}`);
  }
  function lineas(pasos, donde) {
    for (const p of pasos || []) { texto(p.texto, donde); texto(p.ecuacion, donde); }
  }
  function caso(c, pieza, donde) {
    for (const campo of ['enunciado', 'pregunta', 'respuesta']) texto(c[campo], donde);
    for (const d of c.datos || []) {
      texto(d, donde);
      assert.ok(!/(?:F|a|T|f|ω|E|k)\s*=\s*[−-]?(?:[A-Za-zωφδ]|\d+\s*[·×]\s*[A-Za-zωφδ])/.test(E.texto(d)), `${donde}: Datos adelanta una relación: ${E.texto(d)}`);
    }
    for (const o of c.opciones || []) { texto(o.texto, donde); texto(o.siFuera, donde); }
    lineas(c.pasos || (Array.isArray(c.solucion) ? c.solucion : [c.solucion].filter(Boolean)), donde);
    figura(c.figura || c.dibujo, pieza, donde);
  }
  for (const idea of def.ideas) {
    texto(idea.regla.ecuacion, idea.id); lineas(idea.mira.pasos, idea.id);
    for (const tarjeta of idea.lee.tarjetas) { texto(tarjeta.texto, idea.id); texto(tarjeta.ecuacion, idea.id); figura(tarjeta.dibujo, idea.pieza, idea.id); }
    caso(idea.predice, idea.pieza, idea.id + ' Predice'); figura(idea.predice.revelar, idea.pieza, idea.id + ' revelar');
    figura(idea.regla.dibujo, idea.pieza, idea.id + ' regla');
    idea.ejemplos.forEach((e, n) => caso(e, idea.pieza, `${idea.id} ejemplo ${n + 1}`));
    for (let semilla = 0; semilla < 400; semilla++) {
      caso(idea.resuelve.generar(semilla), idea.pieza, `${idea.id} Resuelve ${semilla}`);
      caso(idea.ahoraTu.generar(semilla), idea.pieza, `${idea.id} Ahora tú ${semilla}`);
    }
    for (const val of T.grilla(idea.juega.controles)) { texto(idea.juega.lectura(val), idea.id); figura(idea.juega.dibujo(val), idea.juega.pieza || idea.pieza, idea.id); }
  }
});
