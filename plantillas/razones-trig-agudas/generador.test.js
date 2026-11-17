// Pruebas de «Razones trigonométricas de ángulos agudos»: casos.json (calculados aparte, con un script que no usa el
// generador), un recálculo independiente en 600 problemas (con Math.sin, Math.cos y Math.tan de los ángulos de verdad,
// no con la tabla exacta del generador), fugas, tipos por idea, errores, el recuadro «Datos» en 400 semillas, colores,
// escala, presupuesto de texto y figuras que no delatan la respuesta.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Lectura de un texto exacto: «2√3/3», «(4 + √3)/2», «−1/2», «2,4 m», «30°» → número ----
function aNumero(t) {
  let s = String(t).replace(/\s*(cm|m|°)$/, '').trim(), den = 1;
  const m = s.match(/^\((.+)\)\/(\d+)$/) || s.match(/^([^()]+)\/(\d+)$/);
  if (m) { s = m[1]; den = +m[2]; }
  let tot = 0;
  for (const q0 of s.replace(/ − /g, ' + −').split(' + ')) {
    let q = q0.trim(), sg = 1;
    if (q.startsWith('−')) { sg = -1; q = q.slice(1); }
    const mm = q.match(/^(\d+(?:,\d+)?)?(?:√(\d+))?$/);
    if (!mm || (!mm[1] && !mm[2])) return NaN;
    tot += sg * (mm[1] ? Number(mm[1].replace(',', '.')) : 1) * (mm[2] ? Math.sqrt(+mm[2]) : 1);
  }
  return tot / den;
}

// ---- Camino independiente ----
const RAD = Math.PI / 180;
const F = { sen: Math.sin, cos: Math.cos, tan: Math.tan, csc: x => 1 / Math.sin(x), sec: x => 1 / Math.cos(x), cot: x => 1 / Math.tan(x) };
// El triángulo de cada objeto con coordenadas: r = (0, 0), a = (ra, 0), b = (0, rb). El ángulo en un vértice agudo sale
// de atan2; un cateto «toca» un vértice si es uno de sus extremos.
function triangulo(ra, rb) {
  const P = { r: [0, 0], a: [ra, 0], b: [0, rb] };
  const lados = { ra: ['r', 'a'], rb: ['r', 'b'], h: ['a', 'b'] };
  const largo = k => Math.hypot(P[lados[k][0]][0] - P[lados[k][1]][0], P[lados[k][0]][1] - P[lados[k][1]][1]);
  const cateto = (vtx, toca) => ['ra', 'rb'].find(k => lados[k].includes(vtx) === toca);
  const angulo = vtx => (vtx === 'a' ? Math.atan2(rb, ra) : Math.atan2(ra, rb));
  return { largo, cateto, angulo };
}
// Una expresión escrita: «2 sen 30° + tan 45° · cos 60°», «cos² 30°», «sen 2θ · tan θ» (con θ dado).
function evaluar(expr, th) {
  let tot = 0;
  for (const t0 of expr.replace(/ − /g, ' + −').split(' + ')) {
    let t = t0.trim(), sg = 1;
    if (t.startsWith('−')) { sg = -1; t = t.slice(1); }
    const mc = t.match(/^(\d+) (.*)$/);
    let c = 1;
    if (mc) { c = +mc[1]; t = mc[2]; }
    let prod = sg * c;
    for (const fa of t.split(' · ')) {
      const m = fa.match(/^(sen|cos|tan|cot|sec|csc)(²)? (?:(\d+)°|(\d*)θ)$/);
      assert.ok(m, `no entiendo «${fa}»`);
      const ang = m[3] ? +m[3] : (m[4] ? +m[4] : 1) * th;
      prod *= F[m[1]](ang * RAD) ** (m[2] ? 2 : 1);
    }
    tot += prod;
  }
  return tot;
}
// La convención del examen: lados del triángulo (frente al ángulo, junto a él, hipotenusa), tabla propia.
const CONV = { 37: [3, 4, 5], 53: [4, 3, 5], 16: [7, 24, 25], 74: [24, 7, 25] };
const razonConv = (rz, g) => { const [o, a, h] = CONV[g]; return { sen: o / h, cos: a / h, tan: o / a }[rz]; };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'vertices': {
      const otro = [d.a, d.b].find(x => x !== d.angulo);
      return `CO = ${[d.r, otro].sort().join('')}; CA = ${[d.r, d.angulo].sort().join('')}`;
    }
    case 'lado-objeto': case 'suma-nombres': {
      const T = triangulo(d.ra, d.rb), al = d.theta === 'a' ? 'b' : 'a';
      assert.ok(Math.abs(T.largo('h') - d.h) < 1e-9, 'la terna no cumple Pitágoras');
      const nombre = q => T.largo(T.cateto(q.endsWith('-t') ? d.theta : al, q.startsWith('ca')));
      return d.pide.split('+').reduce((s, q) => s + nombre(q), 0);
    }
    case 'razon-lados': {
      const T = triangulo(d.ra, d.rb);
      return F[d.razon](T.angulo(d.angulo));
    }
    case 'semejante': return F[d.razon](triangulo(d.ra * d.k, d.rb * d.k).angulo('a'));
    case 'otra-razon': {
      const t = Math.atan2(d.co, d.ca);
      return d.pide === 'sen θ + cos θ' ? Math.sin(t) + Math.cos(t) : F[d.pide.split(' ')[0]](t);
    }
    case 'razon-figura': {
      if (d.forma === 'diagonal') return F[d.razon](d.angulo === 'A' ? Math.atan2(d.BC, d.AB) : Math.atan2(d.AB, d.BC));
      // A = (0, 0), D = (0, L), M = (L/2, L): ángulo DAM en A o AMD en M.
      const L = d.lado, ang = (u, w) => Math.acos((u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w));
      return Math.tan(d.angulo === 'A' ? ang([0, L], [L / 2, L]) : ang([-L / 2, 0], [-L / 2, -L]));
    }
    case 'valor-notable': return F[d.razon](d.g * RAD);
    case 'reconoce-angulo': {
      const lado = d.dado === 'ra' ? d.H * Math.cos(d.g * RAD) : d.H * Math.sin(d.g * RAD);
      const ang = (d.dado === 'ra' ? Math.acos(lado / d.H) : Math.asin(lado / d.H)) / RAD;
      return `${Math.round(ang)}°`;
    }
    case 'expresion-notable': return evaluar(d.expresion, d.th);
    case 'reciproca-notable': return evaluar(d.expresion);
    case 'razon-convencion': return razonConv(d.razon, d.g);
    case 'lado-k': {
      const [o, a, h] = CONV[d.g].map(x => x * d.k), lados = { rb: o, ra: a, h };
      return d.pide === 'per' ? o + a + h : lados[d.pide];
    }
    case 'figura-k': {
      if (d.forma === 'trapecio') {
        const [o, a, h] = CONV[d.g].map(x => x * d.k);
        return { AB: d.menor + a, BC: h, per: d.menor + a + h + d.menor + o }[d.pide];
      }
      if (d.forma === 'cartulina') return 3 * d.k + 4 * d.k + 5 * d.k;
      if (d.forma === 'resbala') return d.escalera * (CONV[d.g1][0] / CONV[d.g1][2] - CONV[d.g2][0] / CONV[d.g2][2]);
      return d.poste * (4 / 3 - 3 / 4);
    }
    case 'cofuncion-x': case 'reciproca-x': {
      // x de medio en medio grado hasta que la igualdad se cumpla con las funciones de verdad.
      for (let x = 0.5; x < 45; x += 0.5) {
        const u = F[d.r1]((d.a * x + d.b) * RAD), w = F[d.r2]((d.c * x + d.d) * RAD);
        if (d.tipo === 'cofuncion-x' ? Math.abs(u - w) < 1e-9 : Math.abs(u * w - 1) < 1e-9) return x;
      }
      return NaN;
    }
    case 'complemento': return F[d.pide.slice(0, 3)]((90 * RAD) - Math.atan2(d.co, d.ca));
    default: return NaN;
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === valor : Math.abs(aNumero(valor) - esperado) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo, valorNumerico: a => aNumero(a.texto) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const t = p.alternativas.find(a => a.correcta).texto;
    assert.equal(t, c.esperado.texto);
    if (typeof c.esperado.valor === 'number') assert.ok(Math.abs(aNumero(t) - c.esperado.valor) <= casos.tolerancia, `da ${t}`);
  });
}

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;

test('cada idea tiene dos tipos o más, uno de nivel examen, y salen todos los errores pedidos', () => {
  const porIdea = {}, niveles = {}, ids = new Set();
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s), d = p._datos;
    (porIdea[d.idea] = porIdea[d.idea] || new Set()).add(d.tipo);
    (niveles[d.idea] = niveles[d.idea] || new Set()).add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual(Object.keys(porIdea).sort(), ['aproximados', 'complementarias', 'lados-desde-angulo', 'notables', 'razon-cociente']);
  for (const [idea, tipos] of Object.entries(porIdea)) {
    assert.ok(tipos.size >= 2, `${idea}: solo ${[...tipos]}`);
    assert.ok(niveles[idea].has(3), `${idea}: sin nivel examen`);
  }
  assert.equal(new Set(Object.values(porIdea).flatMap(t => [...t])).size, gen.TIPOS.length);
  for (const id of ['TR7', 'TR8', 'TR9', 'TR10', 'LAD-HIPOTENUSA', 'LAD-TOCA-H', 'LAD-NO-CAMBIA', 'PIT-LINEAL', 'REC-INVERSA', 'NOT-MISMO',
    'NOT-CAMBIA', 'ANG-OTRO', 'K-SIN-DIVIDIR', 'COMP-IGUALA', 'COMP-180', 'COMP-MISMO-ANG', 'REC-COMPLEMENTO', 'REC-NO-INVIERTE'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada explicación empieza por lo que el alumno hizo bien, es corta y lleva el respaldo de su código', () => {
  const TR = /^TR(7|8|9|10)$/;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien\b/, `semilla ${s}: ${a.error.explicacion}`);
      assert.ok(palabras(a.error.explicacion) <= 20, `semilla ${s}: ${a.error.explicacion}`);
      if (TR.test(a.error.id)) assert.ok(['parcial', 'documentado'].includes(a.error.respaldo) && a.error.fuente, `semilla ${s}: ${a.error.id}`);
      else assert.equal(a.error.respaldo, 'hipotesis', `semilla ${s}: ${a.error.id}`);
    }
  }
});

test('ninguna alternativa queda fuera de escala (de 1/20 a 20 veces la correcta) ni es cero', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), c = aNumero(p.alternativas.find(a => a.correcta).texto);
    for (const a of p.alternativas) {
      const x = aNumero(a.texto);
      if (!Number.isFinite(x) || !Number.isFinite(c)) continue;
      assert.ok(x !== 0 && Math.abs(x / c) >= 1 / 20 && Math.abs(x / c) <= 20, `semilla ${s}: ${a.texto} frente a ${c}`);
    }
  }
});

test('respuestas racionalizadas: ninguna alternativa lleva una raíz abajo', () => {
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas) assert.ok(!/\/\s*\d*√/.test(a.texto), `semilla ${s}: ${a.texto}`);
});

test('presupuesto de texto: enunciado y pregunta hasta 40 palabras; textos sin punto decimal ni null', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `semilla ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto)].join(' ');
    assert.ok(!/\d\.\d|\bnull\b|\bNaN\b|undefined|\b1x\b|−1x/.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('colores por papel: θ y α en carmín, lo que se pide en violeta y cada tramo de color es de una variable', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    assert.equal(V.x.color, 'f', `semilla ${s}`);
    if (V.a) assert.equal(V.a.color, 'o');
    if (V.b) assert.equal(V.b.color, 'i');
    assert.ok(p.pregunta.some(x => typeof x === 'object' && x.v === 'x') || p._datos.tipo === 'reconoce-angulo', `semilla ${s}: lo que se pide no va en violeta`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) {
        if (typeof x === 'string') assert.ok(!/[θα]/.test(x), `semilla ${s}: «${x}» lleva θ o α sin carmín`);
        else {
          assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
          if (/[θα]/.test(x.t)) assert.ok(V[x.v].color === 'h', `semilla ${s}: «${x.t}» no va en carmín`);
        }
      }
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): una lista de líneas cortas en texto plano, con la fórmula de
// cada tipo; nunca el valor de lo que se pide ni un consejo.
const FORMULA = {
  vertices: ['Cateto opuesto a un ángulo agudo', 'Cateto adyacente a un ángulo agudo', 'Hipotenusa:'],
  'lado-objeto': ['Cateto opuesto a un ángulo agudo', 'Cateto adyacente a un ángulo agudo', 'Pitágoras: hipotenusa² = cateto² + cateto²'],
  'suma-nombres': ['Cateto opuesto a un ángulo agudo', 'Cateto adyacente a un ángulo agudo', 'Pitágoras: hipotenusa² = cateto² + cateto²'],
  'razon-lados': [/sen [θα] = CO\/H; cos [θα] = CA\/H; tan [θα] = CO\/CA/, 'Pitágoras'],
  semejante: ['sen θ = CO/H', 'semejantes'],
  'otra-razon': ['sen θ = CO/H', 'Pitágoras'],
  'razon-figura': ['sen θ = CO/H'],
  'valor-notable': ['sen θ = CO/H', 'Media señal', 'Media loseta'],
  'reconoce-angulo': ['sen θ = CO/H', 'Media señal', 'Media loseta'],
  'expresion-notable': ['sen θ = CO/H', 'Media señal', 'Media loseta', 'Racionalizar'],
  'razon-convencion': ['sen θ = CO/H', '(convención del examen)'],
  'lado-k': ['(convención del examen)', 'Lado = partes · k'],
  'figura-k': ['(convención del examen)', 'Lado = partes · k'],
  'cofuncion-x': ['Cofunciones: sen θ = cos(90° − θ)', 'Recíprocas: sen θ · csc θ = 1'],
  'reciproca-x': ['Cofunciones: sen θ = cos(90° − θ)', 'Recíprocas: sen θ · csc θ = 1'],
  'reciproca-notable': ['sec θ = H/CA', 'Media señal'],
  complemento: ['sec θ = H/CA', 'Cofunciones', 'Pitágoras'],
};
test('datos: lista de líneas cortas, con la fórmula de cada tipo, sin la respuesta ni consejos, en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Truco|Tip|Consejo|Primero|Siempre|No olvides)/i.test(l), `semilla ${s}: «${l}» es un consejo`);
      // El atajo de las partes ya repartidas («frente a 53° van 4 partes») no es un dato.
      assert.ok(!/(frente|junto) a \d+° (van|tiene)/i.test(l), `semilla ${s}: «${l}» da el paso hecho`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    for (const fo of FORMULA[d.tipo]) assert.ok(fo instanceof RegExp ? fo.test(todo) : todo.includes(fo), `semilla ${s} (${d.tipo}): falta «${fo}»`);
    // Sin la respuesta: ni lo que se pide con su valor («cos 53° = …», «x = …») ni el largo o el ángulo que sale.
    const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.ok(!new RegExp(`${esc(d.pide)} = (?!C[OA]\\/|H\\/)`).test(todo), `semilla ${s}: los datos dan ${d.pide}`);
    const c = p.alternativas.find(a => a.correcta).texto;
    // (Un ángulo notable sí sale en los nombres de las figuras: «Media loseta (45° y 45°)» es la herramienta.)
    if (/ (m|cm)$/.test(c) || (/°$/.test(c) && /-x$/.test(d.tipo))) assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(todo), `semilla ${s}: los datos traen ${c}`);
  }
});

// La figura (pieza trig-objeto de la teoría) muestra el planteamiento: todo lo que rotula ya está en el enunciado, y lo
// que se pide va con «?» o sin rótulo.
const pieza = require('../../nucleo/kit/piezas/trig-objeto.js');
test('la figura no delata la respuesta: sus rótulos salen del enunciado', () => {
  let con = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (!p.escena) continue;
    con++;
    assert.equal(p.escena.pieza, 'trig-objeto');
    const svg = pieza.dibujar(p.escena.datos, { corte: 0 }), enun = plano(p.enunciado) + ' ' + plano(p.pregunta);
    const rotulos = (svg.match(/<text[^>]*>([^<]+)</g) || []).map(t => t.replace(/<text[^>]*>/, '').replace(/<$/, '').trim()).filter(Boolean);
    for (const r of rotulos) {
      if (/^[θα?]$|^[A-Z]$/.test(r)) continue;
      assert.ok(enun.includes(r), `semilla ${s} (${p._datos.tipo}): la figura rotula «${r}», que el enunciado no dice`);
    }
    // Ningún lado lleva el violeta de lo que se pide.
    assert.ok(!/var\(--c-f\)/.test(svg), `semilla ${s}: la figura usa violeta`);
  }
  assert.ok(con > 150, `solo ${con} problemas con figura`);
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 3000 y de texto)', () => {
  for (let s = 0; s <= 3000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'alumno-7']) gen.generar(s);
  for (const t of gen.TIPOS) for (let s = 0; s < 50; s++) assert.equal(gen.generar(`t${s}`, { tipo: t })._datos.tipo, t);
});
