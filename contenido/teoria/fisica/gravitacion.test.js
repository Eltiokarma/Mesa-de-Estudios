'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./gravitacion.js');
for (const p of def.requiere) require(path.join(__dirname, '../../..', p));

test('Gravitación conserva sus cuatro ideas y añade energía antes de órbitas y escape al final', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['cuadrado-inverso', 'campo-gravitatorio', 'energia-gravitatoria', 'orbita-circular', 'leyes-de-kepler', 'escape']);
  assert.equal(def.ideas.reduce((n, i) => n + i.ejemplos.length, 0), 90);
  for (const idea of def.ideas) for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
  const porIdea = Glosario.porIdea(def);
  for (const [n, entradas] of porIdea.entries()) assert.ok(entradas.length >= 2 && entradas.length <= 4, `${def.ideas[n].id}: ${entradas.length} términos`);
  for (const termino of ['energía potencial gravitatoria', 'nivel de referencia']) {
    const entrada = def.glosario.find(g => g.termino === termino);
    assert.equal(entrada.local, true, `${termino}: el tooltip debe explicar el contexto gravitatorio exterior.`);
  }
  assert.deepEqual(Glosario.revisar(def), []);
});

test('Gravitación pasa el contrato de calidad 2 en 400 semillas sin marcarse', () => {
  // La copia permite aplicar todas las reglas a una unidad todavía pendiente
  // de auditoría y lectura en frío. No se modifica la definición publicada.
  const problemas = Teoria.problemas({ ...def, calidad: 2 }, { semillas: 400 });
  assert.deepEqual(problemas, [], problemas.join('\n'));
});

// Auditoría (26 nov). Con la misma semilla (la app arranca las dos en 0), «Ahora tú» repetía el tipo de «Así se
// resuelve» con otros números (820 N y 320 N con los mismos factores 2; 1,5; 2).
test('Gravitación: «Ahora tú» no repite el tipo de «Así se resuelve» con la misma semilla', () => {
  const unidad = require('./gravitacion.js');
  for (const idea of unidad.ideas) for (let s = 0; s < 60; s++)
    assert.notEqual(idea.ahoraTu.generar(s).verificacion.tipo, idea.resuelve.generar(s).verificacion.tipo, `${idea.id} semilla ${s}`);
});

// Auditoría (26 nov). Planetas posibles: campos de 369 N/kg o fuentes de 10¹⁵ m³/s² con radio de 2000 km daban
// densidades de 10⁵ a 10⁶ kg/m³. Ningún punto estudiado puede estar fuera de una fuente más densa que 15 000 kg/m³.
test('Gravitación: los planetas de «Así se resuelve» y «Ahora tú» tienen densidades posibles', () => {
  const unidad = require('./gravitacion.js'), G = 6.67e-11, V = r => 4 / 3 * Math.PI * r ** 3, malos = [];
  for (const idea of unidad.ideas) for (const banco of ['resuelve', 'ahoraTu']) for (let s = 0; s < 400; s++) {
    const v = idea[banco].generar(s).verificacion; let rho = null;
    const masa = v.GM || v.mu ? (v.GM || v.mu) / G : v.M;
    if (v.R && v.g0) rho = v.g0 * v.R ** 2 / G / V(v.R);
    else if (v.R && masa) rho = masa / V(v.R);
    else if (masa && (v.r || v.r1)) rho = masa / V(v.r || v.r1);
    if (v.MA && v.x) rho = v.MA / V(Math.abs(v.x));
    if (v.muA && v.x) rho = v.muA / G / V(Math.abs(v.x));
    if ((v.tipo === 'equilibrio' || v.tipo === 'nulo') && (v.MA || v.muA)) {
      const a = v.MA || v.muA / G, b = v.MB || v.muB / G, rA = v.D / (1 + Math.sqrt(b / a));
      rho = Math.max(a / V(rA), b / V(v.D - rA));
    }
    if (rho != null && rho > 15000) malos.push(`${idea.id} ${banco} ${s} ${v.tipo} ${Math.round(rho)}`);
  }
  assert.deepEqual(malos.slice(0, 8), []);
});

// Auditoría y lector en frío (26 nov): subíndices anidados («v_escnueva», «E_PG_1»), fórmulas escritas como texto
// crudo en Datos («F_A = G·M_A·m/r_A^2», «g_superficie») y equivalencias que el caso no usa («1 MJ», «1 km/s»).
test('Gravitación: Datos y pasos sin subíndices anidados, sin texto crudo y sin equivalencias que sobran', () => {
  const unidad = require('./gravitacion.js'), malos = [];
  const anidado = n => n && typeof n === 'object' && (Array.isArray(n) ? n.some(anidado)
    : (n.sub && n.sub[0] && typeof n.sub[0] === 'object' && n.sub[0].sub) || Object.values(n).some(anidado));
  const crudo = x => typeof x === 'string' && /[A-Za-z]_[A-Za-z0-9{]|\^/.test(x);
  for (const idea of unidad.ideas) {
    const casos = [...idea.ejemplos.map(e => ({ datos: e.datos, solucion: e.solucion, enunciado: e.enunciado }))];
    for (let s = 0; s < 120; s++) casos.push(idea.resuelve.generar(s), idea.ahoraTu.generar(s));
    for (const c of casos) {
      if (anidado([c.datos, c.solucion, c.pasos])) malos.push(`${idea.id}: subíndice anidado`);
      for (const d of c.datos || []) if (crudo(d)) malos.push(`${idea.id}: Datos crudo «${d}»`);
      const cadenas = x => typeof x === 'string' ? [x] : Array.isArray(x) ? x.flatMap(cadenas) : x && typeof x === 'object' ? Object.entries(x).filter(([k]) => !['dibujo', 'figura', 'verificacion'].includes(k)).flatMap(([, v]) => cadenas(v)) : [];
      for (const t of cadenas([c.enunciado, c.pregunta, c.solucion, c.pasos, c.opciones])) if (crudo(t)) malos.push(`${idea.id}: texto crudo «${t}»`);
      const texto = JSON.stringify([c.enunciado || c.pregunta, c.solucion, c.pasos, c.respuesta, c.opciones]);
      const datos = JSON.stringify(c.datos);
      if (idea.id === 'orbita-circular' && /1 MJ/.test(datos) && !/MJ/.test(texto)) malos.push(`${idea.id}: 1 MJ sin usar`);
      if (idea.id === 'orbita-circular' && /1 min/.test(datos) && !/min/.test(texto)) malos.push(`${idea.id}: 1 min sin usar`);
      if (idea.id === 'energia-gravitatoria' && /1 km\/s/.test(datos) && !/km\/s/.test(texto)) malos.push(`${idea.id}: 1 km/s sin usar`);
    }
  }
  assert.deepEqual([...new Set(malos)].slice(0, 10), []);
});
