// Pruebas de «Reducción al primer cuadrante» (práctica): casos.json (calculados aparte, con un script que no usa el
// generador), un recálculo independiente en 600 problemas (con Math.sin y Math.cos de los ángulos de verdad, 37° y 53° con
// la convención del examen 3-4-5), fugas, tipos por idea, el recuadro «Datos» en 400 semillas y los colores de la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => (plano(x).match(/[\p{L}\p{N}]+(?:[.,]\p{N}+)*/gu) || []).length;
// ---- Camino independiente: Math con el ángulo de verdad; 37° y 53° con el triángulo 3-4-5 ----
const R37 = Math.atan2(3, 4);
function rad(deg) {
  const m = ((deg % 360) + 360) % 360, a = m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m;
  if (Math.abs(a - 37) > 1e-9 && Math.abs(a - 53) > 1e-9) return deg * Math.PI / 180;
  const r = Math.abs(a - 37) < 1e-9 ? R37 : Math.PI / 2 - R37;
  return m <= 90 ? r : m <= 180 ? Math.PI - r : m <= 270 ? Math.PI + r : 2 * Math.PI - r;
}
const F = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) };
// Evalúa «sen 217°», «cos(-240°)», «tan(17π/3)», «sec(270° - φ)», «3*tan 127° - 2*sen 330°»… con φ y θ dados (grados).
function evaluar(expr, vars) {
  const js = expr.replace(/(sen|cos|tan|cot|sec|csc)\s*(?:\(([^()]*)\)|(-?\d+)°|([θφ]))/g, (_, fn, dentro, num, letra) => {
    let a = dentro !== undefined ? dentro : num !== undefined ? num : letra, rads = /π/.test(a);
    a = a.replace(/°/g, '').replace(/(\d+)π\/(\d+)/, '($1*Math.PI/$2)').replace(/θ/g, `(${vars.θ})`).replace(/φ/g, `(${vars.φ})`);
    const x = eval(a);
    return `F.${fn}(${rads ? x : (/[θφ]/.test(dentro || letra || '') ? x * Math.PI / 180 : rad(x))})`;
  }).replace(/θ/g, `(${vars.θ})`).replace(/φ/g, `(${vars.φ})`);
  return eval(js);
}
function num(t, vars) {
  t = String(t).trim();
  if (/[a-z]{3} φ/.test(t)) return evaluar(t.replace(/−/g, '-').replace(/^-(\w+) φ$/, '-1*$1 φ'), vars);
  const s = t.replace(/−/g, '-').replace(/°$/, '').replace(/,/g, '.');
  let m = s.match(/^(-?)(\d*)√(\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]) / +m[4];
  m = s.match(/^(-?)(\d*)√(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]);
  m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
  return +s;
}
const refA = g => Math.round(Math.atan2(Math.abs(Math.sin(g * Math.PI / 180)), Math.abs(Math.cos(g * Math.PI / 180))) * 180 / Math.PI);
function esperado(p, vars) {
  const e = p._datos;
  if (e.tipo === 'referencia') return refA(e.g);
  if (e.tipo === 'theta-desde-alfa') { for (let g = 1; g < 360; g++) if (g % 90 && refA(g) === e.a && Math.ceil(g / 90) === e.q) return g; }
  if (e.tipo === 'suma-referencias') { let s = 0; for (const q of [e.q1, e.q2]) for (let g = 1; g < 360; g++) if (g % 90 && refA(g) === e.a && Math.ceil(g / 90) === q) s += g; return s; }
  return evaluar(e.expr, e.phi ? Object.assign({}, vars, { φ: e.phi }) : vars);
}

test('recálculo independiente en 600 problemas: una sola alternativa vale lo que da el ángulo de verdad', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), vars = { θ: 23 + (s % 50), φ: 11 + (s % 70) };
    const real = esperado(p, vars), buenas = p.alternativas.filter(a => Math.abs(num(a.texto, Object.assign({}, vars, p._datos.phi ? { φ: p._datos.phi } : {})) - real) < 1e-6);
    assert.equal(buenas.length, 1, `semilla ${s} (${p._datos.tipo}): ${plano(p.pregunta)} = ${real}; ${p.alternativas.map(a => a.texto).join(' | ')}`);
    assert.ok(buenas[0].correcta, `semilla ${s}: la que calza no es la marcada`);
  }
});

test('casos.json: cada caso, recalculado aparte, da la alternativa correcta que ve el alumno', () => {
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto, `${c.semilla}: ${plano(p.pregunta)}`);
  }
});

test('tipos por idea: cada idea da solo sus tipos, con los tres niveles', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 120; s++) { const p = gen.generar(s, { idea }); assert.ok(tipos.includes(p._datos.tipo), `${idea}: ${p._datos.tipo}`); vistos.add(p._datos.nivel); }
    assert.deepEqual([...vistos].sort(), [1, 2, 3], idea);
  }
});

probarGenerador(gen, { semillas: 600 });
probarFugas(gen, { grupo: p => p._datos.tipo, valorNumerico: a => (/φ/.test(a.texto) ? NaN : num(a.texto, {})) });

test('cada explicación de un error empieza por lo que el alumno hizo bien y, si da un valor, es el de su alternativa', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const ex = a.error.explicacion;
      assert.ok(palabras(ex) <= 25, `semilla ${s}: explicación larga «${ex}»`);
      const m = ex.match(/sale (−?[\d√/]+°?)/);
      if (m && /^(El tamaño|Los tamaños|Las razones|El segundo|El primer|Quitar|La segunda|La primera|Cada|Restar|Usar|Sumar)/.test(ex) && !/sale \d+°: /.test(ex))
        assert.ok([a.texto, p.alternativas.find(x => x.correcta).texto].includes(m[1]) || /°$/.test(m[1]), `semilla ${s}: «${ex}» para ${a.texto}`);
    }
  }
});

test('Datos en 400 semillas: de 1 a 6 líneas, ≤ 22 palabras, sin la respuesta y sin consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(p.datos.length >= 1 && p.datos.length <= 6, `semilla ${s}: ${p.datos.length} líneas`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `semilla ${s}: dato largo «${d}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `semilla ${s}: consejo «${d}»`);
      const pide = plano(p.pregunta).replace(/^¿Cuánto vale |\?$/g, '');
      assert.ok(!d.includes(`${pide} = ${ok}`), `semilla ${s}: los datos traen la respuesta`);
    }
  }
});

test('colores de la unidad: ángulos carmín, α violeta; sin verde', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(s);
    for (const [k, v] of Object.entries(p.variables)) assert.ok({ ang: 'h', alfa: 'f' }[k] === v.color, `semilla ${s}: ${k} en ${v.color}`);
  }
});

test('textos: grados sin espacio de miles; enunciado y pregunta de 45 palabras o menos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(palabras([p.enunciado, ' ', p.pregunta]) <= 45, `semilla ${s}`);
    assert.ok(!/\d \d{3}°/.test(plano(p.enunciado) + plano(p.pregunta) + p.alternativas.map(a => a.texto).join(' ')), `semilla ${s}`);
  }
});
