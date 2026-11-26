'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const G = require('./generador.js');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'fisica.fluidos', FUENTE = 'docs/etapa12/errores-fisica.md';
const raiz = path.resolve(__dirname, '../..');
const fuenteErrores = fs.readFileSync(path.join(raiz, FUENTE), 'utf8');
const plano = x => Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x ?? '');
const palabras = x => plano(x).trim().split(/\s+/).filter(Boolean).length;
const recorrer = (x, f) => { if (Array.isArray(x)) x.forEach(y => recorrer(y, f)); else f(x); };
const COLOR = { p: 'i', F: 'h', E: 'h', P: 'h', T: 'h', g: 'h', t: 'h', rho: 'f', m: 'f', gamma: 'f', n: 'f', A: 'd', V: 'd', h: 'd', z: 'd', ell: 'd', L: 'd', r: 'd', d: 'd', v: 'o', Q: 'o', W: 'o' };
const grupo = p => [p._datos.tipo, p._datos.variante || p._datos.pide || p._datos.ramaMasAlta || p._datos.caras || ''].join('/');

// Los cálculos por fracciones, balances y cada igualdad visible se comprueban
// por separado en oraculo.test.js. Aquí se prueba el contrato completo de uso.
probarGenerador(G, { semillas: 400 });

test('las seis ideas tienen tres familias y los filtros no mezclan sus ámbitos', () => {
  const U = require('../../contenido/teoria/fisica/fluidos.js');
  assert.deepEqual(Object.keys(G.TIPOS_POR_IDEA), U.ideas.map(i => i.id));
  assert.equal(G.TIPOS.length, 18);
  for (const [idea, tipos] of Object.entries(G.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => G.NIVEL[t]), [1, 2, 3]);
    const vistos = new Set();
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = G.generar(semilla, { unidad: UNIDAD, idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort());
    for (const tipo of tipos) assert.equal(G.generar(0, { unidad: UNIDAD, idea, tipo })._datos.tipo, tipo);
  }
  assert.throws(() => G.generar(0, { unidad: 'fisica.oscilaciones' }), /unidad ajena/);
  assert.throws(() => G.generar(0, { idea: 'desconocida' }), /idea desconocida/);
  assert.throws(() => G.generar(0, { tipo: 'desconocido' }), /tipo desconocido/);
  assert.throws(() => G.generar(0, { idea: 'empuje', tipo: 'caudal-volumen' }), /ajeno/);
});

const variantes = {
  'manometro-signo': ['abierta', 'gas'], 'recorrido-volumen': ['diametros', 'trabajo'],
  'equilibrio-cuerpo': ['anclaje', 'libre', 'suspension'], 'pelicula-caras': ['1', '2'],
  'capilaridad-radio': ['diametro', 'radio'], 'continuidad-secciones': ['areas', 'diametros'],
  'bernoulli-desnivel': ['deposito', 'tuberia'],
};
for (const tipo of G.TIPOS) {
  const gen = { id: G.id + '/' + tipo, generar: semilla => G.generar(semilla, { tipo }) };
  probarFugas(gen, { semillas: 400, grupo });
  test(`${tipo}: 400 casos con condiciones, colores, escala y procedencia válidos`, () => {
    const respuestas = new Set(), ramas = new Map(), letras = new Set();
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = gen.generar(semilla), d = p._datos; respuestas.add(Number(p.respuesta.valor.toPrecision(10)));
      const rama = grupo(p).split('/')[1]; ramas.set(rama, (ramas.get(rama) || 0) + 1);
      assert.equal(d.tipo, tipo); assert.equal(d.nivel, G.NIVEL[tipo]);
      for (const k of ['valor', 'respuesta', 'correcta', 'resultado', 'intermedios']) assert.ok(!(k in d), `No hay solución oculta en _datos.${k}`);
      for (const [k, n] of Object.entries(d)) if (typeof n === 'number') {
        assert.ok(Number.isFinite(n), k);
        assert.ok(Math.abs(n - Math.round(n * 1000) / 1000) < 1e-8, `${tipo}/${semilla}: ${k} no cabe exactamente en la entrada publicada`);
      }
      assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6);
      for (const linea of p.datos) {
        assert.equal(typeof linea, 'string'); assert.ok(palabras(linea) <= 22, linea);
        assert.doesNotMatch(linea, /\b(recuerda|primero halla|debes|conviene|no olvides)\b/i);
        assert.doesNotMatch(linea, /(?:[ρρpFETQγ]\s*[=≈]\s*[A-Za-zρργ]|[ρρ]\s*[×·]\s*g|[QF]\s*=\s*[^0-9])/);
      }
      assert.ok(palabras(p.enunciado) <= 40, plano(p.enunciado));
      assert.ok(palabras(p.pregunta) <= 40, plano(p.pregunta));
      assert.ok(p.solucion.length >= 2 && p.solucion.length <= 5);
      for (const fila of p.solucion) assert.ok(palabras(fila) <= 30, plano(fila));
      const usadas = new Set();
      recorrer([p.enunciado, p.pregunta, p.solucion], tramo => {
        if (typeof tramo === 'string') return;
        assert.ok(tramo && typeof tramo === 'object'); assert.deepEqual(Object.keys(tramo).sort(), ['t', 'v']);
        assert.equal(typeof tramo.t, 'string'); assert.ok(tramo.t.length); usadas.add(tramo.v);
        assert.ok(p.variables[tramo.v], 'Toda ficha de color está declarada');
      });
      assert.deepEqual(Object.keys(p.variables).sort(), [...usadas].sort());
      for (const [clave, ficha] of Object.entries(p.variables)) { assert.equal(ficha.color, COLOR[clave]); assert.ok(ficha.nombre); }
      const visible = plano([p.enunciado, p.pregunta, p.solucion]) + p.datos.join(' ') + p.alternativas.map(a => a.texto).join(' ');
      assert.doesNotMatch(visible, /\[object Object\]|\bundefined\b|\bNaN\b|\bnull\b|[₀₁₂₃₄₅₆₇₈₉]|[A-Za-z]_[A-Za-z0-9]/);
      assert.equal(p.alternativas.length, 4); assert.equal(new Set(p.alternativas.map(a => a.texto)).size, 4);
      assert.equal(new Set(p.alternativas.map(a => a.valor)).size, 4);
      const correcta = p.alternativas.find(a => a.correcta); assert.ok(correcta); letras.add(correcta.letra);
      assert.equal(correcta.valor, p.respuesta.valor); assert.equal(p._verificacion.errores.length, 3);
      for (const a of p.alternativas.filter(a => !a.correcta)) {
        assert.ok(a.error); assert.equal(a.error.respaldo, 'hipotesis'); assert.equal(a.error.fuente, FUENTE);
        assert.ok(fuenteErrores.includes(a.error.id), a.error.id);
        assert.ok(a.error.explicacion.includes(a.texto), a.error.explicacion);
        const observado = p._verificacion.errores.find(e => e.id === a.error.id); assert.ok(observado); assert.equal(observado.valor, a.valor);
        assert.ok(dentroDeEscala(a, correcta.valor), `${semilla}: ${a.valor} frente a ${correcta.valor}`);
      }
    }
    assert.ok(respuestas.size >= 4, `${tipo}: variedad de resultados`); assert.equal(letras.size, 4);
    if (variantes[tipo]) {
      assert.deepEqual([...ramas.keys()].sort(), variantes[tipo]);
      assert.ok([...ramas.values()].every(n => n >= 100), `${tipo}: variantes cubiertas explícitamente`);
    }
  });
}

test('UMD funciona sin red, teoría, otro generador ni archivos de pruebas', () => {
  const src = fs.readFileSync(path.join(__dirname, 'generador.js'), 'utf8');
  assert.doesNotMatch(src, /XMLHttpRequest|\bfetch\s*\(|require\([^)]*(?:teoria|motor|oraculo|casos|reservas)/);
  const entorno = { Azar: require('../../nucleo/azar.js'), Predicciones: require('../../nucleo/predicciones.js') };
  vm.runInNewContext(src, entorno);
  const web = entorno.Generadores[G.id]; assert.ok(web);
  for (const tipo of G.TIPOS) assert.equal(JSON.stringify(web.generar(7, { tipo })), JSON.stringify(G.generar(7, { tipo })));
});

test('el renderer real conserva los colores y acepta cada tramo de la práctica', () => {
  const src = fs.readFileSync(path.join(raiz, 'app/practica.js'), 'utf8');
  const desde = src.indexOf('const conSub = '), hasta = src.indexOf('// Figura opcional del problema', desde);
  assert.ok(desde > 0 && hasta > desde);
  const entorno = {}; vm.runInNewContext(src.slice(desde, hasta) + '\nthis.pintar = texto;', entorno);
  const esc = require('../../nucleo/predicciones.js').xml;
  for (const tipo of G.TIPOS) for (let semilla = 0; semilla < 8; semilla++) {
    const p = G.generar(semilla, { tipo });
    const html = [p.enunciado, p.pregunta, ...p.solucion].map(fila => entorno.pintar(fila, p, esc)).join('');
    assert.doesNotMatch(html, /\[object Object\]|undefined|NaN|<sub>|class="formula"/);
    for (const ficha of Object.values(p.variables)) assert.ok(html.includes(`c-${ficha.color}`), ficha.nombre);
  }
});

test('veinte reservas y ocho papeles cubren las seis ideas con resultados limpios', () => {
  const tipos = new Set(), ideas = new Set();
  for (let semilla = 12001; semilla <= 12020; semilla++) tipos.add(G.generar(semilla)._datos.tipo);
  assert.equal(tipos.size, 18);
  const niveles = [], esperado = [0.8, -1.26, 84, 70, 46, 2, 3, 127.5];
  for (let n = 1; n <= 8; n++) {
    const p = G.generar('papel-' + n); ideas.add(p._datos.idea); niveles.push(p._datos.nivel);
    assert.ok(Math.abs(p.respuesta.valor - esperado[n - 1]) < 1e-9);
    assert.ok(Math.abs(p.respuesta.valor * 100 - Math.round(p.respuesta.valor * 100)) < 1e-7);
  }
  assert.deepEqual([...ideas].sort(), Object.keys(G.TIPOS_POR_IDEA).sort());
  assert.deepEqual(niveles, [1, 1, 1, 2, 2, 2, 3, 3]);
});

// Normalizar unidades y el objeto físico impide esquivar una repetición cambiando
// solamente el nombre del tipo, de la variable o la unidad con que se da un dato.
const disco = diametroCm => Math.PI * (diametroCm / 200) ** 2;
const firma = xs => xs && JSON.stringify(xs.map(x => typeof x === 'number' ? Number(x.toPrecision(10)) : x));
function firmaPractica(d) {
  switch (d.tipo) {
    case 'densidad-muestra': return firma(['densidad', d.masaKg, d.volumenL]);
    case 'presion-cara': return firma(['presion', d.fuerzaN, d.areaCm2 / 10000]);
    case 'referencia-profundidad': return firma(['muestra-profundidad', d.masaKg, d.volumenL, d.pSuperficialKPa, d.pSensorKPa, d.g]);
    case 'manometro-signo': return firma(['manometro', d.rho, d.g, d.desnivelCm / 100, d.ramaMasAlta === 'abierta' ? 1 : -1]);
    case 'columnas-inmiscibles': return firma(['columnas', d.rhoLigero, d.rhoBase, d.volumenLigeroCm3 / d.areaRamaCm2 / 100, d.g]);
    case 'barometro-referencia': return firma(['barometro', d.pAtmInicialKPa * 1000, d.pTopeInicialKPa * 1000, d.alturaInicialCm / 100, d.pTopeFinalKPa * 1000, d.alturaFinalCm / 100, d.g]);
    case 'fuerza-pistones': return firma(['prensa-fuerza', d.areaEntradaCm2 / 10000, d.areaSalidaCm2 / 10000, d.fuerzaEntradaN]);
    case 'recorrido-volumen': return firma(['prensa-recorrido', disco(d.diametroEntradaCm), disco(d.diametroSalidaCm), d.variante === 'trabajo' ? d.trabajoEntradaJ / d.fuerzaEntradaN : d.recorridoEntradaCm / 100]);
    case 'prensa-desnivel': return firma(['prensa-desnivel', d.areaEntradaCm2 / 10000, d.areaSalidaCm2 / 10000, d.fuerzaEntradaN, d.rho, d.g, d.alturaSalidaM - d.alturaEntradaM]);
    case 'volumen-desplazado': return firma(['empuje', d.volumenTotalCm3 / 1e6, d.volumenSumergidoCm3 / 1e6, d.rho, d.g]);
    case 'equilibrio-cuerpo': return d.variante === 'libre' ? firma(['fraccion-flota', d.masaKg / (d.volumenTotalCm3 / 1e6), d.rho, d.g]) : firma([d.variante, d.masaKg, d.volumenTotalCm3, 1, d.rho, d.g]);
    case 'densidad-dos-lecturas': return firma(['densidad-lecturas', d.lecturaAireN, d.lecturaLiquidoN, d.rhoLiquido, d.g]);
    case 'pelicula-caras': return firma(['pelicula', d.caras, d.gammaMNPorM / 1000, d.longitudContactoCm / 100]);
    case 'coeficiente-pelicula': return firma(['pelicula-peso', d.fuerzaSostenMN, d.masaAlambreG, d.longitudContactoCm, d.caras, d.g]);
    case 'capilaridad-radio': return firma(['capilar-radio', d.fuerzaPeliculaMN / 1000 / (d.caras * d.longitudContactoCm / 100), d.rho, d.g, d.ascensoCm / 100]);
    case 'caudal-volumen': return firma(['caudal', d.volumenL, d.tiempoS]);
    case 'continuidad-secciones': return firma(['continuidad', d.variante === 'diametros' ? disco(d.diametroEntradaCm) : d.areaEntradaCm2 / 10000, d.variante === 'diametros' ? disco(d.diametroSalidaCm) : d.areaSalidaCm2 / 10000, d.rapidezEntrada]);
    case 'bernoulli-desnivel': return d.variante === 'deposito' ? firma(['deposito-altura', d.caudalLPorS, d.areaOrificioCm2, d.g]) : firma(['bernoulli', d.rho, d.areaEntradaCm2, d.areaSalidaCm2, d.rapidezEntrada, d.pEntradaKPa, d.alturaEntradaM, d.alturaSalidaM, d.g]);
    default: throw new Error('Tipo sin firma: ' + d.tipo);
  }
}
function firmaTeoria(idea, d) {
  if (!d) return null;
  if (idea === 'presion-profundidad') {
    if (d.tipo === 'densidad') return firma(['densidad', d.m, d.VL]);
    if (d.tipo === 'densidad-conversion') return firma(['densidad', d.mg / 1000, d.Vcm / 1000]);
    if (d.tipo === 'presion') return firma(['presion', d.F, d.A]);
    if (d.tipo === 'muestra-profundidad') return firma(['muestra-profundidad', d.m, d.VL, d.p0, d.pAbs, d.g]);
  }
  if (idea === 'vasos-comunicantes') {
    if (d.tipo === 'manometro-gauge') return firma(['manometro', d.rho, d.g, d.h, d.sentido]);
    if (d.tipo === 'dosliquidos-desnivel') return firma(['columnas', d.rhoLigero, d.rhoBase, d.hLigero, d.g]);
    if (d.tipo === 'barometro-calibracion' && d.pide === 'presion') return firma(['barometro', d.pAtm1, d.pTop1, d.h1, d.pTop2, d.h2, d.g]);
  }
  if (idea === 'prensa-hidraulica') {
    if (d.tipo === 'fuerza-salida') return firma(['prensa-fuerza', d.A1cm2 / 10000, d.A2cm2 / 10000, d.F1N]);
    if (d.tipo === 'fuerza-radios') return firma(['prensa-fuerza', disco(2 * d.r1cm), disco(2 * d.r2cm), d.F1N]);
    if (d.tipo === 'fuerza-areas-unidades') return firma(['prensa-fuerza', d.A1mm2 / 1e6, d.A2cm2 / 10000, d.F1N]);
    if (d.tipo === 'recorrido-salida') return firma(['prensa-recorrido', d.A1cm2 / 10000, d.A2cm2 / 10000, d.l1cm / 100]);
    if (d.tipo === 'recorrido-unidades') return firma(['prensa-recorrido', d.A1cm2 / 10000, d.A2cm2 / 10000, d.l1mm / 1000]);
    if (d.tipo === 'radios-trabajo-recorrido') return firma(['prensa-recorrido', disco(2 * d.r1cm), disco(2 * d.r2cm), d.WJ / d.F1N]);
    if (d.tipo === 'desnivel-estatico') return firma(['prensa-desnivel', d.A1cm2 / 10000, d.A2cm2 / 10000, d.F1N, d.rho, d.g, d.h2menos1m]);
  }
  if (idea === 'empuje') {
    if (d.tipo === 'empuje') return firma(['empuje', d.V, d.Vs, d.rho, d.g]);
    if (d.tipo === 'suspension') return firma(['suspension', d.m, d.Vcm, d.fraccion, d.rho, d.g]);
    if (d.tipo === 'anclaje') return firma(['anclaje', d.m, d.Vcm, 1, d.rho, d.g]);
    if (d.tipo === 'fraccion') return firma(['fraccion-flota', d.rhob, d.rho, d.g]);
    if (d.tipo === 'densidad-lecturas') return firma(['densidad-lecturas', d.Ta, d.Tl, d.rho, d.g]);
  }
  if (idea === 'tension-superficial') {
    if (d.tipo === 'fuerza') return firma(['pelicula', d.n, d.gamma, d.Lcm / 100]);
    if (d.tipo === 'coeficiente-peso') return firma(['pelicula-peso', d.TmN, d.mGramos, d.Lcm, d.n, d.g]);
    if (d.tipo === 'capilar-diametro') return firma(['capilar-radio', d.gamma, d.rho, d.g, d.hCm / 100]);
  }
  if (idea === 'bernoulli') {
    if (d.tipo === 'caudal-tiempo') return firma(['caudal', d.litros, d.tiempo]);
    if (d.tipo === 'continuidad-area') return firma(['continuidad', d.area1 / 10000, d.area2 / 10000, d.v1]);
    if (d.tipo === 'continuidad-diametro') return firma(['continuidad', disco(d.d1), disco(d.d2), d.v1]);
    if (d.tipo === 'presion-areas') return firma(['bernoulli', d.rho, d.area1, d.area2, d.v1, d.p1, d.z1, d.z2, d.g]);
    if (d.tipo === 'altura-desde-caudal') return firma(['deposito-altura', d.caudal, d.area, d.g]);
  }
  return null;
}
test('la práctica no repite los sistemas de teoría, misiones, predicciones o pares reservados', () => {
  const U = require('../../contenido/teoria/fisica/fluidos.js'), prohibidas = new Map();
  function guardar(clave, etiqueta) { if (clave) prohibidas.set(clave, etiqueta); }
  for (const idea of U.ideas) {
    for (const [n, ejemplo] of idea.ejemplos.entries()) guardar(firmaTeoria(idea.id, ejemplo.caso), `${idea.id}: ejemplo ${n + 1}`);
    for (let semilla = 0; semilla < 400; semilla++) for (const momento of ['resuelve', 'ahoraTu']) {
      const p = idea[momento].generar(semilla); guardar(firmaTeoria(idea.id, p.caso), `${idea.id}/${momento}/${semilla}`);
    }
  }
  for (const x of [
    ['presion', 90, 0.0015], ['manometro', 1000, 10, 0.1, 1], ['columnas', 800, 1000, 0.15, 10],
    ['prensa-fuerza', 0.001, 0.004, 30], ['suspension', 0.8, 500, 1, 1000, 10],
    ['pelicula', 2, 0.03, 0.12], ['continuidad', 0.0006, 0.0003, 2],
    ['densidad-lecturas', 18, 12, 900, 10], ['densidad-lecturas', 16, 9, 1050, 10],
    ['bernoulli', 1000, 8, 4, 2, 146, 1, 0, 10], ['bernoulli', 1000, 12, 6, 3, 172, 2, 0, 10],
  ]) guardar(firma(x), 'misión, predicción o reserva de curso');
  assert.ok(prohibidas.size > 500, 'Se comparan bancos reales y no solo unos pocos ejemplos.');
  for (const tipo of G.TIPOS) for (let semilla = 0; semilla < 400; semilla++) {
    const p = G.generar(semilla, { tipo }), repetido = prohibidas.get(firmaPractica(p._datos));
    assert.ok(!repetido, `${tipo}/${semilla} repite ${repetido}`);
  }
  for (let semilla = 12001; semilla <= 12020; semilla++) {
    const p = G.generar(semilla), repetido = prohibidas.get(firmaPractica(p._datos));
    assert.ok(!repetido, `${semilla} repite ${repetido}`);
  }
});
