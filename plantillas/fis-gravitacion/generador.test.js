// Contratos de práctica. La física y las cuentas visibles se recalculan aparte
// en oraculo.test.js; este archivo cubre filtros, formato, Datos y convivencia.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const G = require('./generador.js');
const P = require('../../nucleo/predicciones.js');
const Kit = require('../../nucleo/kit/kit.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const U = 'fisica.gravitacion', FUENTE = 'docs/etapa10/errores-fisica.md';
const plano = x => Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t || '' : String(x || '');
probarGenerador(G, { semillas: 400 });
probarFugas(G, { semillas: 2000, grupo: p => `${p._datos.tipo}/${p._datos.variante}` });

test('gravitación: UMD de navegador sin XHR, DOM ni motor de otra unidad', () => {
  const c = { self: null }; c.self = c; vm.createContext(c);
  for (const f of ['nucleo/azar.js', 'nucleo/predicciones.js', 'plantillas/fis-gravitacion/generador.js'])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../..', f), 'utf8'), c, { filename: f });
  assert.ok(c.Generadores['fis-gravitacion']);
  for (const tipo of G.TIPOS) assert.deepEqual(JSON.parse(JSON.stringify(c.Generadores['fis-gravitacion'].generar(17, { tipo }))), G.generar(17, { tipo }));
});

test('gravitación: seis ideas, tres niveles cada una y filtros compatibles explícitos', () => {
  const esperadas = ['cuadrado-inverso', 'campo-gravitatorio', 'energia-gravitatoria', 'orbita-circular', 'leyes-de-kepler', 'escape'];
  assert.deepEqual(Object.keys(G.TIPOS_POR_IDEA), esperadas); assert.equal(G.TIPOS.length, 18);
  for (const idea of esperadas) {
    assert.deepEqual(G.TIPOS_POR_IDEA[idea].map(t => G.NIVEL[t]), [1, 2, 3]);
    const vistos = new Set();
    for (let s = 0; s < 120; s++) { const p = G.generar(s, { idea, unidad: U }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...G.TIPOS_POR_IDEA[idea]].sort());
    for (const tipo of G.TIPOS_POR_IDEA[idea]) assert.equal(G.generar(12, { idea, unidad: U, tipo })._datos.tipo, tipo);
  }
  assert.throws(() => G.generar(1, { unidad: 'fisica.impulso-y-choques' }), /unidad incompatible/);
  assert.throws(() => G.generar(1, { idea: 'no-existe' }), /idea desconocida/);
  assert.throws(() => G.generar(1, { tipo: 'no-existe' }), /tipo desconocido/);
  assert.throws(() => G.generar(1, { idea: 'escape', tipo: 'fuerza' }), /incompatibles/);
});

test('gravitación: 400 semillas por tipo, Datos cortos, errores trazables y alternativas en escala', () => {
  const color = { M: 'f', m: 'f', r: 'i', R: 'i', h: 'i', F: 'h', v: 'o', T: 'd', t: 'd', a: 'i' };
  for (const tipo of G.TIPOS) for (let s = 0; s < 400; s++) {
    const p = G.generar(s, { tipo }), etiqueta = `${tipo}/${s}`;
    assert.equal(p._datos.tipo, tipo); assert.equal(p._datos.nivel, G.NIVEL[tipo]);
    assert.ok(p.datos.length > 0 && p.datos.length <= 6, `${etiqueta}: cantidad de Datos`);
    for (const d of p.datos) {
      assert.equal(typeof d, 'string'); assert.ok(Kit.palabras(d) <= 22, `${etiqueta}: ${Kit.palabras(d)} palabras: ${d}`);
      assert.ok(!/^(Recuerda|Ojo|Debes|Primero|Conviene|No olvides)/i.test(d), `${etiqueta}: consejo`);
      assert.ok(!d.includes(p.alternativas.find(a => a.correcta).texto), `${etiqueta}: los Datos escriben la respuesta`);
    }
    assert.ok(p.datos.some(d => /=/.test(d)), `${etiqueta}: falta herramienta o fórmula`);
    for (const [k, v] of Object.entries(p.variables)) { assert.equal(v.color, color[k], `${etiqueta}: color de ${k}`); assert.ok(v.nombre); }
    const usadas = new Set();
    const recorrer = x => { if (Array.isArray(x)) x.forEach(recorrer); else if (x && typeof x === 'object') { assert.ok(x.v && typeof x.t === 'string'); usadas.add(x.v); } };
    recorrer([p.enunciado, p.pregunta, p.solucion]);
    assert.deepEqual([...usadas].sort(), Object.keys(p.variables).sort(), `${etiqueta}: declaración de variables`);
    assert.ok(Kit.palabras(plano(p.enunciado)) <= 40, `${etiqueta}: enunciado largo`);
    assert.ok(Kit.palabras(plano(p.pregunta)) <= 40, `${etiqueta}: pregunta larga`);
    assert.ok(p.respuesta.unidad && Number.isFinite(p.respuesta.valor), `${etiqueta}: respuesta`);
    assert.ok(!/NaN|undefined|\[object Object\]/.test(plano([p.enunciado, p.pregunta, p.solucion])), etiqueta);
    assert.ok(p.alternativas.length >= 4 && p.alternativas.length <= 5, etiqueta);
    assert.equal(p.alternativas.filter(a => a.correcta).length, 1, etiqueta);
    assert.equal(new Set(p.alternativas.map(a => a.texto)).size, p.alternativas.length, etiqueta);
    for (const a of p.alternativas.filter(a => !a.correcta)) {
      assert.ok(P.enEscala(a.valor, p.respuesta.valor, a.error.id), `${etiqueta}: fuera de escala`);
      assert.match(a.error.id, new RegExp(`^GRP-${tipo.toUpperCase()}-`));
      assert.equal(a.error.fuente, FUENTE); assert.equal(a.error.respaldo, 'hipotesis');
      assert.match(a.error.explicacion, /^Bien /); assert.ok(a.error.explicacion.includes(a.texto), etiqueta);
      assert.ok(Kit.palabras(a.error.explicacion) <= 30, `${etiqueta}: explicación larga`);
    }
    for (const [k, v] of Object.entries(p._datos)) {
      assert.ok(!/respuesta|correcta|errores|resultado|intermedio/i.test(k), `${etiqueta}: resultado oculto en entradas`);
      assert.ok(typeof v === 'string' || Number.isFinite(v), `${etiqueta}: entrada inválida ${k}`);
    }
  }
});

test('gravitación: ocho semillas de papel cubren las ideas y ambos finales radiales', () => {
  const casos = Array.from({ length: 8 }, (_, i) => G.generar(`papel-${i + 1}`));
  assert.deepEqual(casos.slice(0, 6).map(p => p._datos.idea), Object.keys(G.TIPOS_POR_IDEA));
  assert.equal(casos[5]._datos.variante, 'residual'); assert.equal(casos[7]._datos.variante, 'retorno');
  assert.equal(casos[6]._datos.tipo, 'rapidez-energia');
  assert.equal(new Set(casos.map(p => plano([p.enunciado, p.pregunta]))).size, 8);
  const papel = path.join(__dirname, 'papel.json');
  if (fs.existsSync(papel)) assert.deepEqual(JSON.parse(fs.readFileSync(papel, 'utf8')), require('../../herramientas/papel-generador.js').armar(G.id));
});

test('gravitación: las sustituciones conservan el color de cada magnitud, además de la respuesta', () => {
  const entradas = { fuerza: ['M', 'm', 'r'], 'factores-fuerza': ['F', 'M', 'm', 'r'], superposicion: ['M', 'm', 'r'],
    campo: ['r'], 'peso-altura': ['m', 'R', 'h', 'r'], 'campo-nulo': ['M', 'r'], potencial: ['m', 'r'],
    'trabajo-radial': ['m', 'r'], 'rapidez-energia': ['v', 'r'], circular: ['r'], 'periodo-altura': ['R', 'h', 'r'],
    'altura-otra-orbita': ['r', 'T', 'R'], semieje: ['r'], 'sector-tiempo': ['T'], 'kepler-extremos': ['T', 'r', 'a'],
    escape: ['r'], 'escape-superficie': ['R', 'h'], 'escape-radial': ['v', 'r'] };
  for (const tipo of G.TIPOS) for (let s = 0; s < 400; s++) {
    const p = G.generar(s, { tipo }), usadas = new Set();
    for (const fila of p.solucion) {
      const sustitucion = fila.slice(2, -2);
      assert.ok(sustitucion.some(x => x && typeof x === 'object' && x.v), `${tipo}/${s}: sustitución sin color`);
      for (const x of sustitucion) if (x && typeof x === 'object') usadas.add(x.v);
    }
    for (const k of entradas[tipo]) assert.ok(usadas.has(k), `${tipo}/${s}: ${k} perdió su color en la cuenta`);
  }
});

test('gravitación: los bancos evitan las entradas reservadas del curso y las predicciones', () => {
  const reservadas = [{ GM: 2.56e14, r0: 8e6, v0: 10000 }, { GM: 9e14, r0: 8e6, v0: 17000 },
    { T1: 20 * 86400, a1: 4e9, rp: 9e9, ra: 9e9 }, { T1: 81 * 86400, a1: 9e9, rp: 4e9, ra: 4e9 }];
  const comunes = ['G', 'GM', 'M', 'm', 'r', 'R', 'h', 'r0', 'v0', 'ri', 'rf', 'vi', 'rp', 'ra', 'T1', 'a1', 'g0'];
  const teoria = require('../../contenido/teoria/fisica/gravitacion.js');
  const previos = teoria.ideas.flatMap(i => [i.predice.verificacion, ...i.ejemplos.map(e => e.verificacion)].filter(Boolean).map(v => ({ idea: i.id, entradas: v })));
  for (const tipo of G.TIPOS) for (let s = 0; s < 400; s++) {
    const d = G.generar(s, { tipo })._datos;
    for (const r of reservadas) assert.ok(!Object.entries(r).every(([k, v]) => d[k] === v), `${tipo}/${s}: reserva repetida`);
    for (const p of previos.filter(p => p.idea === d.idea)) {
      const keys = comunes.filter(k => typeof p.entradas[k] === 'number');
      if (keys.length >= 3) assert.ok(!keys.every(k => d[k] === p.entradas[k]), `${tipo}/${s}: repite entradas de la teoría`);
    }
  }
});
