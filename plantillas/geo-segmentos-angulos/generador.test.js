// Pruebas de «Segmentos y ángulos» (práctica de geometria.segmentos-y-angulos): casos.json (calculados aparte, con un
// script que no usa el generador), un recálculo independiente en 400 problemas con el motor de la escena segmentos-angulos
// (otro código) y con las coordenadas de las figuras, fugas, tipos por idea, errores, el recuadro «Datos» en 400
// semillas, colores (los de la pieza), notación, figuras a escala y consistentes con los datos, y rótulos que no se pisan
// (medidos con la geometría de las piezas, no con la del generador).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const motor = require('../segmentos-angulos/motor.js');
const T = require('../../nucleo/kit/trazo.js');
const GO = require('../../nucleo/kit/piezas/geo-objeto.js');
const GF = require('../../nucleo/kit/piezas/geo-figura.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
const aNumero = t => Number(String(t).replace(/\s*(cm|m|km|°)$/, '').replace(/[ \u00a0]/g, '').replace(',', '.'));
const sinDuros = t => String(t).replace(/\u00a0/g, ' ');
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const RAD = Math.PI / 180;

// ---- Ángulos medidos en la figura (geo-figura): el que va de «de» a «a» por el camino corto, o el largo si es mayor ----
function medir(fig, an) {
  const P = id => { const q = fig.puntos.find(p => p.id === id); return [q.x, q.y]; };
  const V = P(an.en), A = P(an.de), B = P(an.a);
  const g = GF.util.angulo(V, A, B);
  return an.mayor ? 360 - g : g;
}
const pedidoEn = (fig, texto) => fig.angulos.find(a => a.etiqueta && a.etiqueta.texto === texto);

// ---- Camino independiente ----
function recalcular(p) {
  const d = p._datos, fig = p.escena && p.escena.datos;
  switch (d.tipo) {
    case 'tramo-orden': case 'pisan': case 'razon': case 'examen-seg': case 'mitad': case 'medio-entre': case 'afuera':
    case 'dos-medios': case 'equidistante': {
      const r = motor.recta(d.puntos);
      return r.seg(d.pide[0], d.pide[1]);
    }
    case 'entre': {
      const [a, b, c] = Object.keys(d.distancias), D = d.distancias;
      // El del medio es la letra común de los dos tramos que suman el tercero.
      for (const [x, y, z] of [[a, b, c], [a, c, b], [b, c, a]]) if (D[x] + D[y] === D[z]) {
        const comun = [...x].find(l => y.includes(l));
        return p.alternativas.find(al => al.texto.endsWith(` ${comun}`)).texto;
      }
      return null;
    }
    case 'clase': return { agudo: 'agudo', recto: 'recto', obtuso: 'obtuso', llano: 'llano' }[motor.angulo(d.a + d.b).clase];
    case 'reloj': { const h = 30 * d.hora; return Math.min(h, 360 - h); }
    case 'consec-x': {
      const x = motor.resolverLineal(d.a1 + d.a2, d.b1 + d.b2, 0, d.total);
      return d.pide === 'BOC' ? d.a2 * x + d.b2 : d.a1 * x + d.b1;
    }
    case 'pisan-ang': return medir(fig, pedidoEn(fig, '?'));
    case 'vuelta': { const x = 360 / d.ks.reduce((s, k) => s + k, 0); return Math.max(...d.ks) * x; }
    case 'comp-sup': return d.sub === 'C' ? motor.angulo(d.a).complemento : motor.angulo(d.a).suplemento;
    case 'veces-x': return motor.resolverAngulo([{ ops: [d.sub === 'C' ? 'complemento' : 'suplemento'] }], [{ k: d.m, ops: [] }]).x;
    case 'cadena': return motor.resolverAngulo([{ ops: d.sub === 'SC' ? ['suplemento', 'complemento'] : ['complemento', 'suplemento'] }], [{ valor: d.k }]).x;
    case 'bisect': return motor.bisectrices(d.a, d.b).entre;
    case 'veces-cs': return d.sub === 'veces'
      ? motor.resolverAngulo([{ ops: ['suplemento'] }], [{ k: d.m, ops: ['complemento'] }]).x
      : motor.resolverAngulo([{ ops: ['suplemento'] }, { ops: ['complemento'] }], [{ k: d.k, ops: [] }]).x;
    case 'maximo': { let x = 0; for (let k = 1; k < 200; k++) if ((d.p + d.q) * k + d.c < 90) x = k; return x; }
    case 'par': return medir(fig, pedidoEn(fig, 'x'));
    case 'ecuacion': return motor.ecuacionPar(d.par, [d.a1, d.b1], [d.a2, d.b2]).x;
    case 'son-paralelas': {
      // Las rectas de la figura: ¿tienen la misma dirección?
      const P = id => fig.puntos.find(q => q.id === id), dir = (a, b) => Math.atan2(P(b).y - P(a).y, P(b).x - P(a).x);
      const paralelas = casi(Math.sin(dir('Pi', 'Pd') - dir('Qi', 'Qd')), 0, 1e-9);
      return paralelas ? 'Sí: los dos cumplen la regla de su par' : `No: los ${d.par} no cumplen su regla`;
    }
    case 'girada': { const r = motor.ecuacionPar(d.par, [d.a1, d.b1], [d.a2, d.b2]); return r.angulos[0]; }
    case 'quiebre': case 'quiebre-afuera': return motor.quiebre(d.a, d.b).angulo;
    case 'quiebre-veces': return medir(fig, pedidoEn(fig, '?'));
    case 'serrucho': {
      const x = d.a + d.m, y = d.m + d.b;
      return d.pide === 'M' ? motor.reglaSerrucho({ derecha: [d.a, y], izquierda: [d.b], incognita: 'izquierda' }).x
        : motor.reglaSerrucho({ derecha: [d.a], izquierda: [x, d.b], incognita: 'derecha' }).x;
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === valor
  : typeof valor === 'number' ? casi(esperado, valor, 1e-6) : casi(esperado, aNumero(valor), 1e-6));

probarGenerador(gen, { semillas: 400, recalcular, igual });
probarFugas(gen, { semillas: 1500 });

// Problemas de prueba: 400 semillas y 40 de cada tipo.
const muestras = (() => {
  const ps = [];
  for (let s = 0; s < 400; s++) ps.push([String(s), gen.generar(s)]);
  for (const t of gen.TIPOS) for (let s = 0; s < 40; s++) ps.push([`${t} ${s}`, gen.generar(`c${s}`, { tipo: t })]);
  return ps;
})();

test('los recálculos también cuadran en 40 problemas de cada tipo', () => {
  for (const [s, p] of muestras) assert.ok(igual(recalcular(p), p.respuesta.valor), `${s}: ${recalcular(p)} contra ${p.respuesta.valor}`);
});

test('casos.json: cada semilla da su problema y su respuesta (calculada aparte)', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 25, `${casos.casos.length} casos`);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla), d = Object.assign({}, p._datos);
    delete d.valor;
    assert.deepEqual(JSON.parse(JSON.stringify(d)), c.entrada, `semilla ${c.semilla}: otro problema`);
    assert.equal(`${plano(p.enunciado)} ${plano(p.pregunta)}`, c.enunciado, `semilla ${c.semilla}: otro enunciado`);
    const ok = p.alternativas.find(a => a.correcta);
    assert.equal(ok.texto, c.esperado.texto, `semilla ${c.semilla}`);
    assert.ok(casi(p._datos.valor === undefined ? aNumero(ok.texto) : (typeof p._datos.valor === 'number' ? p._datos.valor : NaN), c.esperado.valor) || ok.texto === c.esperado.texto, `semilla ${c.semilla}`);
  }
  const ideas = new Set(casos.casos.map(c => c.entrada.idea));
  assert.equal(ideas.size, 6, 'los casos cubren las seis ideas');
});

test('tipos por idea: cada idea tiene práctica, cada tipo dice su idea y llega a nivel de examen', () => {
  assert.deepEqual(Object.keys(gen.IDEAS), ['suma-de-segmentos', 'punto-medio', 'abertura', 'bisectrices', 'paralelas', 'quiebre']);
  assert.deepEqual(Object.values(gen.IDEAS).flat().sort(), gen.TIPOS.slice().sort());
  const niveles = {};
  for (const [idea, tipos] of Object.entries(gen.IDEAS)) for (const t of tipos) for (let s = 0; s < 20; s++) {
    const d = gen.generar(`i${s}`, { tipo: t })._datos;
    assert.equal(d.tipo, t); assert.equal(d.idea, idea);
    (niveles[idea] = niveles[idea] || new Set()).add(d.nivel);
  }
  for (const [idea, n] of Object.entries(niveles)) assert.ok(n.has(1) && n.has(2) && n.has(3), `${idea}: niveles ${[...n]}`);
  for (let s = 0; s < 60; s++) for (const idea of Object.keys(gen.IDEAS)) assert.equal(gen.generar(`id${s}`, { idea })._datos.idea, idea);
});

test('cada explicación empieza por lo que el alumno hizo bien, es corta y es una hipótesis (GE17 con su informe)', () => {
  for (const [s, p] of muestras) for (const a of p.alternativas.filter(x => x.error)) {
    assert.match(a.error.explicacion, /^Bien\b/, `${s}: ${a.error.explicacion}`);
    assert.ok(palabras(a.error.explicacion) <= 22, `${s}: ${a.error.explicacion}`);
    assert.equal(a.error.respaldo, 'hipotesis', `${s}: ${a.error.id}`);
    assert.match(a.error.id, /^GE(17-[ab]|-(SEG|RAZ|PM|ANG|CS|BIS|PAR|QB)\d+)$/, `${s}: ${a.error.id}`);
    if (/^GE17/.test(a.error.id)) assert.equal(a.error.fuente, 'docs/investigacion/geometria-ideas-erroneas.md');
  }
});

test('ninguna explicación ni solución nombra una alternativa por su letra', () => {
  for (const [s, p] of muestras) {
    const textos = [...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)];
    for (const t of textos) {
      assert.ok(!/\b(alternativa|opci[oó]n|respuesta)\b/i.test(t), `${s}: «${t}»`);
      assert.ok(!/\b(la|es la|marca la) [A-E]\b(?! *(y|,|=|\+|−|está|es|queda|en|de))/.test(t), `${s}: «${t}»`);
    }
  }
});

test('ninguna alternativa queda fuera de escala (de 1/20 a 20 veces la correcta) ni es cero', () => {
  for (const [s, p] of muestras) {
    const c = aNumero(p.alternativas.find(a => a.correcta).texto);
    for (const a of p.alternativas) {
      const x = aNumero(a.texto);
      if (!Number.isFinite(x) || !Number.isFinite(c)) continue;
      assert.ok(x > 0 && x / c >= 1 / 20 && x / c <= 20, `${s}: ${a.texto} frente a ${c}`);
    }
  }
});

test('presupuesto de texto: enunciado y pregunta hasta 40 palabras; sin punto decimal, null ni «1x»', () => {
  for (const [s, p] of muestras) {
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `${s}: ${palabras(p.enunciado) + palabras(p.pregunta)} palabras: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto)].join(' ');
    assert.ok(!/\d\.\d|\bnull\b|\bNaN\b|undefined|\b1x\b|−1x|\+ 0°|− 0°/.test(todo), `${s}: ${todo}`);
  }
});

// Notación (decisiones de la etapa 3): m∠AOB para la medida; C(x) y S(x) sin puntos C ni S en esas figuras; L₁ y L₂ con
// subíndice de verdad (nunca «L1»).
test('notación: m∠ para la medida, sin puntos C ni S donde se usa C(x) o S(x), L₁ y L₂', () => {
  for (const [s, p] of muestras) {
    const enun = plano(p.enunciado) + ' ' + plano(p.pregunta), todo = enun + ' ' + p.datos.join(' ');
    assert.ok(!/(^|[^m])∠[A-Z]{3} =/.test(todo), `${s}: una medida sin «m»: ${todo}`);
    assert.ok(!/\bL[12]\b/.test(todo + p.solucion.map(plano).join(' ')), `${s}: L1 o L2 sin subíndice`);
    if (/\b[CS]\(/.test(todo + p.solucion.map(plano).join(' ')) && p.escena) {
      const letras = p.escena.pieza === 'geo-figura' ? p.escena.datos.puntos.map(q => q.rotulo).filter(Boolean) : p.escena.datos.puntos.map(q => q.id);
      assert.ok(!letras.includes('C') && !letras.includes('S'), `${s}: C(x) o S(x) con un punto C o S en la figura`);
    }
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas con la herramienta de cada tipo; nunca el valor de
// lo que se pide ni un consejo.
const FORMULA = {
  'tramo-orden': [/[A-Z]{2} \+ [A-Z]{2}/], entre: ['Un punto está entre otros dos'], pisan: ['AD = AB + BC + CD'],
  razon: ['con k la medida de una parte', 'AB + BC = AC'], 'examen-seg': ['cada medida es la suma de sus tramos'],
  mitad: ['es el punto medio de AB', 'AB = AM + MB'], 'medio-entre': ['es el punto medio de AC', 'suma de los tramos'],
  afuera: ['es el punto medio de AB', 'suma de los tramos'], 'dos-medios': ['es el punto medio de AB', 'es el punto medio de CD'],
  equidistante: ['AM = MC = AC/2'],
  clase: ['Consecutivos: m∠AOC = m∠AOB + m∠BOC', 'Agudo: menos de 90°'], reloj: ['360°', '12 números'],
  'consec-x': ['Consecutivos: m∠AOC = m∠AOB + m∠BOC'], 'pisan-ang': ['m∠AOD = m∠AOB + m∠BOC + m∠COD'], vuelta: ['360°', 'se suman'],
  'comp-sup': [/C\(x\) = 90° − x|S\(x\) = 180° − x/], 'veces-x': ['C(x) = 90° − x', 'S(x) = 180° − x'], cadena: ['C(x) = 90° − x', 'S(x) = 180° − x'],
  bisect: ['La bisectriz parte un ángulo en dos ángulos iguales.'], 'veces-cs': ['C(x) = 90° − x', 'S(x) = 180° − x'],
  maximo: ['Consecutivos: m∠AOD = m∠AOB + m∠BOD', 'Agudo: más de 0° y menos de 90°'],
  par: ['son iguales', 'suman 180°', 'opuestos por el vértice'], ecuacion: ['son iguales', 'suman 180°'],
  'son-paralelas': ['son iguales', 'suman 180°', 'Al revés'], girada: ['son iguales', 'suman 180°'],
  quiebre: ['Por V se puede trazar una paralela', 'alternos internos son iguales'], 'quiebre-veces': ['Por V se puede trazar una paralela', 'alternos internos son iguales'],
  'quiebre-afuera': ['Por V se puede trazar una paralela', 'vecinos suman 180°'], serrucho: ['Por M y por N', 'Cada quiebre mide la suma'],
};
test('datos: lista de líneas cortas, con la herramienta de cada tipo, sin la respuesta ni consejos, en 400 semillas', () => {
  for (const [s, p] of muestras) {
    const d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Truco|Tip|Consejo|Primero|Siempre|No olvides)/i.test(l), `${s}: «${l}» es un consejo`);
      // El atajo no es un dato: «MN es la semisuma», «BM es la mitad de la diferencia», «el quiebre es a + b».
      assert.ok(!/semisuma|mitad de la diferencia|MN = |BM = |x = a \+ b/.test(l), `${s}: «${l}» es un atajo`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    for (const fo of FORMULA[d.tipo]) assert.ok(fo instanceof RegExp ? fo.test(todo) : todo.includes(fo), `${s} (${d.tipo}): falta «${fo}»`);
    const c = p.alternativas.find(a => a.correcta).texto;
    // (Una respuesta que es x va sin «°»: «18» no está en «x < 180».)
    if (/^\d/.test(c)) assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `${s}: los datos traen ${c}`);
  }
});

// ---- Colores (regla de la unidad; molde §5b) ----
test('colores: los tramos del texto con el color de la pieza; ángulos dados en carmín y lo pedido en tinta; sin violeta en figura ni enunciado', () => {
  let conSeg = 0, conAng = 0;
  for (const [s, p] of muestras) {
    const V = p.variables;
    assert.equal(V.x.color, 'f');
    const partes = [p.enunciado, p.pregunta].flat().filter(x => x && typeof x === 'object');
    for (const x of partes) assert.notEqual(V[x.v].color, 'f', `${s}: violeta en el enunciado («${x.t}»)`);
    // El resultado de la solución va en violeta.
    assert.ok(p.solucion.flat().some(x => x && typeof x === 'object' && x.v === 'x'), `${s}: la solución no marca el resultado`);
    if (!p.escena) { assert.equal(partes.length, 0, `${s}: sin figura, ningún tramo lleva color`); continue; }
    if (p.escena.pieza === 'geo-objeto') {
      conSeg++;
      const F = p.escena.datos;
      // Cada tramo en color del texto tiene ese color en la figura; y cada tramo de color de la figura que se nombra
      // en el texto va con su color.
      for (const x of partes) assert.equal(GO.colorDe(F, x.t), V[x.v].color, `${s}: «${x.t}» en ${V[x.v].color}, en la figura ${GO.colorDe(F, x.t)}`);
      const nombrados = new Set(partes.map(x => x.t));
      const enun = plano(p.enunciado) + ' ' + plano(p.pregunta);
      for (const t of F.tramos) {
        const c = GO.colorDe(F, t.de + t.a);
        if (!c) continue;
        if (enun.includes(t.de + t.a) || enun.includes(t.a + t.de)) assert.ok(nombrados.has(t.de + t.a) || nombrados.has(t.a + t.de), `${s}: ${t.de}${t.a} va en color en la figura y en tinta en el texto`);
      }
      // Lo que se pide no lleva color.
      for (const t of F.tramos.filter(t => t.texto === '?')) assert.equal(GO.colorDe(F, t.de + t.a), null, `${s}: lo pedido en color`);
      assert.deepEqual(gen.colores(F), Object.fromEntries(Object.entries(GO.colores(F)).filter(([, c]) => c)), `${s}: el generador calcula otros colores que la pieza`);
      const svg = GO.dibujar(F, { corte: 0 });
      assert.ok(!/var\(--c-f\)/.test(svg), `${s}: violeta en la figura`);
    } else {
      conAng++;
      const fig = p.escena.datos;
      assert.equal(p.escena.pieza, 'geo-figura');
      for (const a of fig.angulos) {
        if (!a.etiqueta) continue;
        const pide = a.etiqueta.texto === '?' || (a.etiqueta.texto === 'x' && /^(par|quiebre|quiebre-afuera)$/.test(p._datos.tipo));
        if (pide) assert.ok(!a.color && !a.etiqueta.color, `${s}: lo pedido («${a.etiqueta.texto}») en color`);
        else assert.ok(a.etiqueta.color === 'h' && a.color === 'h', `${s}: el ángulo dado «${a.etiqueta.texto}» no va en carmín`);
      }
      const svg = GF.dibujar(fig, { corte: 0 });
      assert.ok(!/var\(--c-[fio]\)/.test(svg), `${s}: la figura de ángulos usa violeta, naranja o turquesa`);
    }
  }
  assert.ok(conSeg > 150 && conAng > 300, `${conSeg} figuras de segmentos y ${conAng} de ángulos`);
});

// ---- Figuras a escala y consistentes con los datos (molde §6, con números) ----
const NUM = /^(\d[\d ]*(?:,\d+)?) (cm|m|km)$/;
test('segmentos: cada medida de la figura es la distancia entre sus puntos, en el texto y en la figura', () => {
  for (const [s, p] of muestras) {
    if (!p.escena || p.escena.pieza !== 'geo-objeto') continue;
    const F = p.escena.datos, km = id => F.puntos.find(q => q.id === id).km, d = p._datos;
    const enun = sinDuros(plano(p.enunciado));
    for (const t of F.tramos) {
      const L = Math.abs(km(t.a) - km(t.de)), m = sinDuros(t.texto || '').match(NUM);
      if (m) {
        assert.ok(casi(L, aNumero(m[1])), `${s}: ${t.de}${t.a} rotulado ${t.texto}, pero mide ${L}`);
        // El texto dice la misma medida de ese tramo (o la del tramo al revés).
        const re = new RegExp(`(${t.de}${t.a}|${t.a}${t.de}) = ${m[1]} ${m[2]}`);
        assert.ok(re.test(enun) || t.papel === 'todo' && enun.includes(`${m[1]} ${m[2]}`), `${s}: la figura rotula ${t.de}${t.a} = ${t.texto} y el texto no lo dice`);
      }
      if (t.texto === '?') assert.ok(casi(L, aNumero(p.alternativas.find(a => a.correcta).texto)), `${s}: «?» en ${t.de}${t.a} no mide la respuesta`);
      if (/^\d*k$/.test(String(t.texto || ''))) {
        const k = L / (t.texto === 'k' ? 1 : parseInt(t.texto, 10));
        for (const u of F.tramos.filter(u => /^\d*k$/.test(String(u.texto || '')))) assert.ok(casi(Math.abs(km(u.a) - km(u.de)), k * (u.texto === 'k' ? 1 : parseInt(u.texto, 10))), `${s}: las partes con k no van a escala`);
      }
    }
    // Las mitades marcadas miden igual.
    const mitades = F.tramos.filter(t => t.papel === 'igual');
    for (const t of mitades) for (const u of mitades.filter(u => u.marcas === t.marcas)) assert.ok(casi(Math.abs(km(t.a) - km(t.de)), Math.abs(km(u.a) - km(u.de))), `${s}: mitades distintas`);
    // Las medidas que el texto da de dos letras («AC = 13 km») son las de la figura.
    for (const m of enun.matchAll(/(?<![−+] )\b([A-Z])([A-Z]) = (\d[\d ]*(?:,\d+)?) (cm|m|km)/g)) {
      if (!F.puntos.some(q => q.id === m[1]) || !F.puntos.some(q => q.id === m[2])) continue;
      assert.ok(casi(Math.abs(km(m[1]) - km(m[2])), aNumero(m[3])), `${s}: el texto dice ${m[0]} y la figura no`);
    }
    if (d.puntos) for (const [id, x] of Object.entries(d.puntos)) assert.ok(casi(km(id), x), `${s}: ${id} no está donde dicen los datos`);
  }
});

const valorExpr = (t, x) => {
  const m = String(t).match(/^(\d*)x(?: ([+−]) (\d+)°)?$/);
  if (!m) return null;
  return (m[1] ? +m[1] : 1) * x + (m[2] ? (m[2] === '+' ? 1 : -1) * +m[3] : 0);
};
test('ángulos: cada ángulo se dibuja con su medida; los rótulos con números o con x dicen esa medida', () => {
  for (const [s, p] of muestras) {
    if (!p.escena || p.escena.pieza !== 'geo-figura') continue;
    const fig = p.escena.datos, d = p._datos;
    const conX = [];
    for (const a of fig.angulos) {
      const m = medir(fig, a);
      assert.ok(Number.isFinite(a.mide) && Math.abs(m - a.mide) < 0.05, `${s} (${d.tipo}): el ángulo de ${a.en} mide ${m}, no ${a.mide}`);
      const t = a.etiqueta && a.etiqueta.texto;
      if (!t) continue;
      if (/^\d+°$/.test(t)) assert.ok(casi(parseInt(t, 10), a.mide, 1e-9), `${s}: rótulo ${t} en un ángulo de ${a.mide}°`);
      else if (/x/.test(t) && t !== 'x') conX.push([t, a.mide]);
      if (t === '?' || t === 'x') {
        if (d.tipo !== 'clase' && !/maximo|girada|ecuacion|son-paralelas|consec-x|vuelta/.test(d.tipo)) assert.ok(casi(a.mide, aNumero(p.alternativas.find(al => al.correcta).texto), 0.05), `${s} (${d.tipo}): lo pedido mide ${a.mide}`);
      }
    }
    // Todas las expresiones en x de la figura valen lo que miden con un mismo x; con kx (vuelta), x = 360 ÷ suma.
    if (conX.length) {
      const xs = conX.map(([t, m]) => { const q = t.match(/^(\d*)x(?: ([+−]) (\d+)°)?$/); return (m - (q[2] ? (q[2] === '+' ? 1 : -1) * +q[3] : 0)) / (q[1] ? +q[1] : 1); });
      for (const x of xs) assert.ok(casi(x, xs[0], 1e-6), `${s} (${d.tipo}): las expresiones no comparten x`);
      for (const [t, m] of conX) assert.ok(casi(valorExpr(t, xs[0]), m, 1e-6));
    }
    // Las medidas que el texto da en grados (m∠AOB = 30°) son las de la figura.
    const P = id => fig.puntos.find(q => q.rotulo === id);
    for (const m of plano(p.enunciado).matchAll(/m∠([A-Z])([A-Z])([A-Z]) = (\d+)°/g)) {
      const A = P(m[1]), O = P(m[2]), B = P(m[3]);
      if (!A || !O || !B) continue;
      assert.ok(casi(GF.util.angulo([O.x, O.y], [A.x, A.y], [B.x, B.y]), +m[4], 0.05), `${s}: el texto dice ${m[0]} y la figura no`);
    }
    // Paralelas: las rectas son paralelas salvo en «¿son paralelas?» con una diferencia; ahí se cortan.
    if (/par|ecuacion|girada|son-paralelas/.test(d.tipo) && fig.puntos.some(q => q.id === 'Qd')) {
      const Q = id => fig.puntos.find(q => q.id === id), dir = (a, b) => Math.atan2(Q(b).y - Q(a).y, Q(b).x - Q(a).x);
      const dif = Math.abs(Math.sin(dir('Pi', 'Pd') - dir('Qi', 'Qd')));
      if (d.tipo === 'son-paralelas' && d.abre) assert.ok(casi(Math.asin(dif) / RAD, Math.abs(d.abre), 1e-6), `${s}: L₁ no se abre ${d.abre}°`);
      else assert.ok(dif < 1e-9, `${s}: L₁ y L₂ no son paralelas`);
    }
  }
});

// ---- Rótulos que no se pisan, medidos con la geometría de las piezas (no con la del generador) ----
const TAM = 16, ALTO_T = TAM * 1.05, M = 4;
const caja = (x, y, w, h) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
const chocan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function cruza(p, q, b) {
  for (let k = 0; k <= 200; k++) { const x = p[0] + (q[0] - p[0]) * k / 200, y = p[1] + (q[1] - p[1]) * k / 200; if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true; }
  return false;
}
test('ángulos: los rótulos caben en el lienzo, no cruzan líneas ni arcos y no se pisan (geometría de geo-figura)', () => {
  for (const [s, p] of muestras) {
    if (!p.escena || p.escena.pieza !== 'geo-figura') continue;
    const fig = p.escena.datos, g = GF.geometria(fig);
    assert.ok(casi(gen.marco(fig).s, g.s, 1e-9), `${s}: la escala del generador no es la de geo-figura`);
    const cajas = [];
    for (const q of fig.puntos) if (q.rotulo) {
      const [x, y] = g.S(q.id);
      cajas.push({ t: q.rotulo, b: caja(x + Math.cos(q.lado * RAD) * 15, y - Math.sin(q.lado * RAD) * 15 + 1, T.ancho(q.rotulo, TAM, 600), ALTO_T) });
    }
    for (const r of fig.rotulos || []) { const [x, y] = g.S([r.x, r.y]); cajas.push({ t: r.texto, angulo: r.angulo !== undefined, b: caja(x, y + 0.6, T.ancho(r.texto, TAM, 700), ALTO_T) }); }
    const lineas = fig.segmentos.map(l => {
      const a = g.S(l.de), b = g.S(l.a);
      if (!l.recta) return [a, b];
      const u = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...u);
      return [[a[0] - u[0] / L * 900, a[1] - u[1] / L * 900], [a[0] + u[0] / L * 900, a[1] + u[1] / L * 900]];
    });
    for (const [i, c] of cajas.entries()) {
      const b = c.b;
      assert.ok(b.x0 >= M - 1e-9 && b.x1 <= 320 - M + 1e-9 && b.y0 >= M - 1e-9 && b.y1 <= g.alto - M + 1e-9, `${s} (${p._datos.tipo}): «${c.t}» sale del lienzo`);
      for (const [a, q] of lineas) assert.ok(!cruza(a, q, b), `${s} (${p._datos.tipo}): «${c.t}» cruza una línea`);
      for (const o of cajas.slice(i + 1)) assert.ok(!chocan(b, o.b), `${s} (${p._datos.tipo}): «${c.t}» pisa a «${o.t}»`);
      // Los arcos, con su radio de pantalla, del lado «de» al «a» por el camino que dibuja geo-figura.
      for (const a of fig.angulos) {
        const cc = g.S(a.en), p1 = g.S(a.de), p2 = g.S(a.a);
        const t1 = Math.atan2(p1[1] - cc[1], p1[0] - cc[0]), t2 = Math.atan2(p2[1] - cc[1], p2[0] - cc[0]);
        let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
        if (a.mayor) dt = dt > 0 ? dt - 2 * Math.PI : dt + 2 * Math.PI;
        if (Math.abs(Math.abs(dt) - Math.PI / 2) < 1e-4 && !a.mayor) continue; // el cuadradito del recto, junto al vértice
        const r = a.radio || 26;
        for (let k = 0; k <= 60; k++) { const t = t1 + dt * k / 60, x = cc[0] + r * Math.cos(t), y = cc[1] + r * Math.sin(t); assert.ok(!(x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1), `${s} (${p._datos.tipo}): «${c.t}» sobre un arco`); }
      }
    }
    // Un recto que se pide no se dibuja con el cuadradito (diría 90°).
    for (const a of fig.angulos) if (a.etiqueta && !a.etiqueta.color) {
      const cc = g.S(a.en), p1 = g.S(a.de), p2 = g.S(a.a);
      let dt = Math.atan2(p2[1] - cc[1], p2[0] - cc[0]) - Math.atan2(p1[1] - cc[1], p1[0] - cc[0]); while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
      assert.ok(Math.abs(Math.abs(dt) - Math.PI / 2) >= 1e-4, `${s}: lo pedido es recto y saldría con cuadradito`);
    }
  }
});

test('segmentos: las cotas de un mismo nivel no se pisan y las letras de los puntos no se juntan (geometría de geo-objeto)', () => {
  for (const [s, p] of muestras) {
    if (!p.escena || p.escena.pieza !== 'geo-objeto') continue;
    const F = p.escena.datos, g = GO.geometria(F), puestas = [];
    for (const t of F.tramos) {
      if (!t.texto || t.nivel === 0) continue;
      const a = g.P[t.de][0], b = g.P[t.a][0], w = T.ancho(t.texto, TAM, 700), c = (a + b) / 2;
      assert.ok(c - w / 2 >= M && c + w / 2 <= 320 - M, `${s}: la cota «${t.texto}» sale del lienzo`);
      for (const q of puestas) if (q.nivel === t.nivel) assert.ok(c + w / 2 + 4 < q.x0 || q.x1 + 4 < c - w / 2, `${s}: «${t.texto}» pisa a «${q.t}»`);
      puestas.push({ nivel: t.nivel, x0: c - w / 2, x1: c + w / 2, t: t.texto });
    }
    const xs = F.puntos.map(q => g.P[q.id][0]).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 15.9, `${s}: dos puntos a ${xs[i] - xs[i - 1]} px`);
    // La figura no rotula nada que el enunciado no diga (salvo «?», k y las letras).
    const enun = plano(p.enunciado) + ' ' + plano(p.pregunta);
    for (const t of F.tramos) if (t.texto && !/^(\?|\d*k|[A-Z]{2})$/.test(t.texto)) assert.ok(enun.includes(t.texto), `${s}: la figura rotula «${t.texto}» y el enunciado no`);
  }
});

test('la figura de ángulos no rotula nada que el enunciado no diga (salvo «?», x, las letras, los números del reloj y L₁, L₂)', () => {
  for (const [s, p] of muestras) {
    if (!p.escena || p.escena.pieza !== 'geo-figura') continue;
    const enun = plano(p.enunciado) + ' ' + plano(p.pregunta);
    for (const r of p.escena.datos.rotulos || []) {
      if (r.fijo || /^(\?|x|b)$/.test(r.texto)) continue;
      assert.ok(enun.includes(r.texto), `${s} (${p._datos.tipo}): la figura rotula «${r.texto}» y el enunciado no`);
    }
    assert.ok(typeof p.escena.datos.alt === 'string' && p.escena.datos.alt.length > 15, `${s}: figura sin texto alternativo`);
    const ok = p.alternativas.find(a => a.correcta).texto;
    if (/^\d/.test(ok)) assert.ok(!p.escena.datos.alt.includes(ok), `${s}: el texto alternativo trae la respuesta`);
  }
});

test('las piezas dibujan cada figura sin NaN ni colores fijos', () => {
  for (const [s, p] of muestras) {
    if (!p.escena) continue;
    const svg = (p.escena.pieza === 'geo-objeto' ? GO : GF).dibujar(p.escena.datos, { corte: 0 });
    assert.ok(/^<svg[\s>]/.test(svg) && !/NaN|undefined/.test(svg), `${s}: SVG roto`);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), `${s}: colores fijos`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'alumno-7']) gen.generar(s);
  for (const t of gen.TIPOS) for (let s = 0; s < 50; s++) assert.equal(gen.generar(`t${s}`, { tipo: t })._datos.tipo, t);
});

// ---- Correcciones de la auditoría de la teoría (17 nov): la prueba que habría detectado cada una ----
test('M6: las rayitas de «miden igual» caben a 10 px o más de cada punto y de otro grupo (geo-objeto), 300 semillas por tipo', () => {
  const mal = [];
  for (const tipo of ['medio-entre', 'equidistante', 'dos-medios', 'afuera', 'mitad']) for (let s = 0; s < 300; s++) {
    const p = gen.generar(`marcas-${s}`, { tipo });
    if (!p.escena || p.escena.pieza !== 'geo-objeto') continue;
    for (const z of GO.marcas(p.escena.datos)) if (z.holgura < GO.HOLGURA_MARCA) mal.push(`${tipo} ${s}: rayitas de ${z.tramo.de}${z.tramo.a} a ${z.holgura.toFixed(1)} px`);
    // Ronda 2 del lector (18 nov): la marca de un tramo va en el arco que une sus dos puntas, nunca sobre la línea, donde
    // un punto que parte el tramo la haría leer como otro tramo («AM = BC»).
    const g = GO.geometria(p.escena.datos);
    for (const z of GO.marcas(p.escena.datos)) {
      const [a, b] = [g.P[z.tramo.de][0], g.P[z.tramo.a][0]].sort((u, w) => u - w);
      if (!z.arco || Math.abs(z.arco.a - a) > 1e-6 || Math.abs(z.arco.b - b) > 1e-6 || z.y > GO.constantes.BOT - GO.ALTO_ARCO + 1e-9) mal.push(`${tipo} ${s}: la marca de ${z.tramo.de}${z.tramo.a} no va en su arco`);
    }
    assert.equal(gen.marcasCaben(p.escena.datos), GO.marcasCaben(p.escena.datos), `${tipo} ${s}: el generador y la pieza no coinciden`);
  }
  assert.deepEqual(mal.slice(0, 10), []);
});

test('M5: dos ángulos consecutivos dados (carmín) no tienen el mismo radio: se verían como un solo arco', () => {
  const mal = [];
  for (const tipo of ['clase', 'consec-x', 'vuelta', 'pisan-ang']) for (let s = 0; s < 200; s++) {
    const p = gen.generar(`arcos-${s}`, { tipo }), fig = p.escena.datos, an = fig.angulos.filter(a => !a.rayita && !a.marcas);
    for (let i = 0; i < an.length; i++) for (let j = i + 1; j < an.length; j++) {
      const a = an[i], b = an[j];
      if (a.en !== b.en || (a.color || '') !== (b.color || '') || ![a.de, a.a].some(x => x === b.de || x === b.a)) continue;
      if (a.hueco || b.hueco) continue; // ángulos que se pisan (∠AOC y ∠BOD): ya van con radios distintos
      if (Math.abs((a.radio || 26) - (b.radio || 26)) < 6) mal.push(`${tipo} ${s}: ${a.de}${a.en}${a.a} y ${b.de}${b.en}${b.a} con radio ${a.radio}`);
    }
  }
  assert.deepEqual(mal.slice(0, 10), []);
});

test('M10: los tipos del papel (sin figura) se resuelven con el texto: el quiebre dice de qué lado de V quedan P y Q', () => {
  for (let s = 0; s < 100; s++) {
    const q = sinDuros(plano(gen.generar(`papel-q-${s}`, { tipo: 'quiebre' }).enunciado));
    assert.ok(/a la izquierda de V/.test(q) && /del lado de V/.test(q), q);
  }
  const papel = require('./papel.json');
  for (const p of papel.problemas) if (/quiebre/.test(p.enunciado)) assert.ok(/a la izquierda de V/.test(p.enunciado), `${p.id}: el papel no dice de qué lado de V quedan P y Q`);
});

// «x sin °» (decisiones, cuarta ronda, 18 nov; cabecera del generador y de la teoría): una letra latina vale un número
// y va sin «°», ella y su valor («m∠AOB = 3x + 29°», «x = 17»). Falla con «x°», con una letra sola igualada a grados
// («x = 17°», «3x = 90°», «x < 25°», «x = 35° + 45°»), con «¿Cuánto mide x?», si se pide x (o a) y una alternativa
// lleva «°», o si se pide un ángulo y una alternativa no lo lleva. La misma lectura que la prueba de la teoría.
const GRADO_LETRA = /^\d*[a-z]$/, GRADO_NUM = /^\d+(?:,\d+)?$/, GRADO_CON = /^\d+(?:,\d+)?°$/, GRADO_OP = /^[+−·-]$/;
const gradoTermino = t => GRADO_LETRA.test(t) || GRADO_NUM.test(t) || GRADO_CON.test(t);
function gradoExpresion(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i += 2) {
    if (!gradoTermino(tokens[i])) break;
    out.push(tokens[i]);
    if (!GRADO_OP.test(tokens[i + 1] || '') || !gradoTermino(tokens[i + 2] || '')) break;
  }
  return out;
}
function gradosMal(texto) {
  const s = String(texto).replace(/[  ⁠]/g, ' '), mal = [];
  const soloLetra = e => e.length > 0 && e.some(t => GRADO_LETRA.test(t)) && !e.some(t => GRADO_CON.test(t));
  const soloGrados = e => e.length > 0 && e.every(t => GRADO_CON.test(t));
  for (const m of s.matchAll(/(?<![A-Za-zÀ-ÿ])[a-z]°/g)) mal.push(`«${m[0]}» en «${s.slice(0, 90)}»`);
  for (const m of s.matchAll(/¿Cuánto miden? (?:el quiebre )?[a-z]\b/g)) mal.push(`«${m[0]}» en «${s.slice(0, 90)}»`);
  for (const trozo of s.split(/[:;?¿→()«»]|[,.](?=\s|$)|\s{2,}| y | o /)) {
    const lados = trozo.split(/\s*[=<>≤≥]\s*/);
    for (let i = 0; i + 1 < lados.length; i++) {
      const L = gradoExpresion(lados[i].trim().split(/\s+/).filter(Boolean).reverse()), R = gradoExpresion(lados[i + 1].trim().split(/\s+/).filter(Boolean));
      if ((soloLetra(L) && soloGrados(R)) || (soloGrados(L) && soloLetra(R))) mal.push(`una letra igualada a grados en «${trozo.trim().slice(0, 90)}»`);
    }
  }
  return mal;
}
test('x sin «°»: una letra vale un número; el grado va en lo que se mide (400 semillas y 60 por tipo, y el papel)', () => {
  const ANGULOS = new Set(['abertura', 'bisectrices', 'paralelas', 'quiebre']);
  const mal = new Set();
  let pideX = 0;
  const revisa = (s, p) => {
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.datos, ...p.solucion.map(plano), ...p.alternativas.flatMap(a => [a.texto, a.explicacion || ''])];
    const fig = p.escena && p.escena.datos;
    if (fig) textos.push(fig.alt || '', ...(fig.angulos || []).map(a => (a.etiqueta && a.etiqueta.texto) || ''), ...(fig.rotulos || []).map(r => r.texto || ''));
    for (const t of textos) for (const m of gradosMal(t)) mal.add(`${s}: ${m}`);
    const q = plano(p.pregunta), d = p._datos;
    if (!ANGULOS.has(d.idea) || p.alternativas.some(a => !/^\d/.test(a.texto))) return;
    if (/¿Cuánto valen? [a-z]\b|valor entero de [a-z]\b/.test(q)) { pideX++; for (const a of p.alternativas) assert.ok(!/°/.test(a.texto), `${s} (${d.tipo}): se pide una letra y la alternativa es «${a.texto}»`); }
    if (/¿Cuánto miden? /.test(q)) for (const a of p.alternativas) assert.ok(/°$/.test(a.texto), `${s} (${d.tipo}): se pide un ángulo y la alternativa es «${a.texto}»`);
  };
  for (let s = 0; s < 400; s++) revisa(s, gen.generar(s));
  for (const t of gen.TIPOS) for (let s = 0; s < 60; s++) revisa(`${t} ${s}`, gen.generar(s, { tipo: t }));
  const papel = require('./papel.json');
  for (const p of papel.problemas) for (const t of [p.enunciado, p.respuesta, ...p.pasos]) for (const m of gradosMal(t)) mal.add(`papel ${p.id}: ${m}`);
  assert.ok(pideX > 50, `pocos problemas que piden una letra: ${pideX}`);
  for (const t of ['x = 17°', 'x°', '3x = 90°', 'x < 25°', 'x = 35° + 45° = 80°', '¿Cuánto mide x?']) assert.ok(gradosMal(t).length, `no detecta «${t}»`);
  for (const t of ['x = 17', 'm∠AOB = 3x + 29°', '3 · 17 + 29° = 80°', 'x + 20° + 2x = 110°', '75° = m + 40°']) assert.deepEqual(gradosMal(t), [], `«${t}» está bien`);
  assert.deepEqual([...mal].slice(0, 20), []);
});
