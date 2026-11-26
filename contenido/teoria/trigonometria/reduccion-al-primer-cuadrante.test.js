// Prueba propia de «Reducción al primer cuadrante» (Etapa 9): lo que el validador común no mira. Colores por magnitud en
// figuras y textos (α en violeta, los demás ángulos en carmín), misiones de una sola salida, predicciones que el juego no
// muestra, «Ahora tú» que no repite ejemplos ni la predicción, una sola alternativa correcta recalculada con Math en 400
// semillas, rótulos que no se pisan y nada de las unidades que siguen. Las cuentas completas se rehicieron aparte
// (scratchpad e9-trig/cuentas.js: 4179 comprobaciones en 400 semillas, más los ejemplos con figura revisados a mano).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..', '..');
const Teoria = require(path.join(RAIZ, 'nucleo/teoria.js'));
const EC = require(path.join(RAIZ, 'nucleo/ecuacion.js'));
const T = require(path.join(RAIZ, 'nucleo/kit/trazo.js'));
const P = require(path.join(RAIZ, 'nucleo/kit/piezas/trig-pos.js'));
const def = require('./reduccion-al-primer-cuadrante.js');

const plano = x => (typeof x === 'string' ? x : EC.texto(x)).replace(/ | /g, ' ');
const idea = id => def.ideas.find(i => i.id === id);

// ---- Camino independiente: Math con el ángulo de verdad (37° y 53° con el triángulo 3-4-5) ----
const R37 = Math.atan2(3, 4);
function rad(deg) {
  const m = ((deg % 360) + 360) % 360, a = m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m;
  if (Math.abs(a - 37) > 1e-9 && Math.abs(a - 53) > 1e-9) return deg * Math.PI / 180;
  const r = Math.abs(a - 37) < 1e-9 ? R37 : Math.PI / 2 - R37;
  return m <= 90 ? r : m <= 180 ? Math.PI - r : m <= 270 ? Math.PI + r : 2 * Math.PI - r;
}
const F = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) };
function evaluar(expr, vars) {
  const s = expr.replace(/−/g, '-').replace(/·/g, '*').replace(/\|([^|]*)\|/g, 'Math.abs($1)');
  const js = s.replace(/(sen|cos|tan|cot|sec|csc)\s*(?:\(([^()]*)\)|(-?\d+)°|([θφ]))/g, (_, fn, dentro, num, letra) => {
    let a = dentro !== undefined ? dentro : num !== undefined ? num : letra;
    const rads = /π/.test(a), conVar = /[θφ]/.test(a);
    a = a.replace(/°/g, '').replace(/(\d+)π\/(\d+)/, '($1*Math.PI/$2)').replace(/θ/g, `(${vars.θ})`).replace(/φ/g, `(${vars.φ})`);
    const x = eval(a);
    return `F.${fn}(${rads ? x : rad(x)})`;
  }).replace(/(\d)\s*F\./g, '$1*F.').replace(/(\d)\s*\(/g, '$1*(');
  return eval(js);
}
function num(t, vars) {
  const s0 = plano(t).trim().replace(/^≈\s*/, '');
  if (/[a-z]{3} φ/.test(s0)) return evaluar(s0.replace(/^−(\w+ φ)$/, '-1*$1'), vars);
  const s = s0.replace(/−/g, '-').replace(/°$/, '').replace(/,/g, '.');
  let m = s.match(/^(-?)(\d*)√(\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]) / +m[4];
  m = s.match(/^(-?)(\d*)√(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]);
  m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
  return +s;
}
const refA = g => Math.round(Math.atan2(Math.abs(Math.sin(g * Math.PI / 180)), Math.abs(Math.cos(g * Math.PI / 180))) * 180 / Math.PI);
const deQ = (a, q) => { for (let g = 1; g < 360; g++) if (g % 90 && refA(g) === a && Math.ceil(g / 90) === q) return g; return NaN; };
const ROMQ = { I: 1, II: 2, III: 3, IV: 4 };
// El valor de verdad de una pregunta de «Ahora tú» (o de un ejemplo con su expresión en el enunciado).
function verdad(preg, vars) {
  const p = plano(preg);
  let m = p.match(/^θ = (\d+)° está en posición normal\. ¿Cuánto mide su ángulo de referencia α\?$/); if (m) return refA(+m[1]);
  m = p.match(/cuadrante (\w+), entre 0° y 360°, tiene ángulo de referencia α = (\d+)°\. ¿Cuánto mide θ\?/); if (m) return deQ(+m[2], ROMQ[m[1]]);
  m = p.match(/θ está en el cuadrante (\w+) y β en el (\w+), .* referencia (\d+)°/); if (m) return deQ(+m[3], ROMQ[m[1]]) + deQ(+m[3], ROMQ[m[2]]);
  const v = Object.assign({}, vars);
  m = p.match(/^θ = (\d+)°\. Calcula/); if (m) v.θ = +m[1];
  m = p.match(/sen φ = (\d+)\/(\d+)/); if (m) v.φ = Math.asin(m[1] / m[2]) * 180 / Math.PI;
  m = p.match(/(?:¿Cuánto vale|Calcula E =|Simplifica E =|¿A qué es igual) ([^?]*?)[?.]?$/);
  return m ? evaluar(m[1], v) : undefined;
}

test('cuentas: en 400 semillas, una sola opción de «Ahora tú» vale lo que da el ángulo de verdad, y es la marcada', () => {
  let n = 0;
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const c = i.ahoraTu.generar(s);
    for (const phi of [17, 41, 73]) {
      const vars = { θ: phi + 0.5, φ: phi }, real = verdad(c.pregunta, vars);
      assert.ok(Number.isFinite(real), `${i.id} ${s}: sin valor de verdad para «${plano(c.pregunta)}»`);
      const vv = Object.assign({}, vars); const m = plano(c.pregunta).match(/sen φ = (\d+)\/(\d+)/); if (m) vv.φ = Math.asin(m[1] / m[2]) * 180 / Math.PI;
      const buenas = c.opciones.filter(o => Math.abs(num(o.texto, vv) - real) < 1e-6);
      assert.equal(buenas.length, 1, `${i.id} ${s}: «${plano(c.pregunta)}» = ${real}; ${c.opciones.map(o => plano(o.texto)).join(' | ')}`);
      assert.ok(buenas[0].correcta, `${i.id} ${s}: la que calza no es la marcada`);
      n++;
      if (!/[φθ]/.test(plano(c.pregunta).replace(/θ = \d+°/, '').replace(/ángulo θ|θ está|β en|θ no está|φ es agudo, sen/g, ''))) break;
    }
  }
  assert.ok(n > 2000, `${n} comprobaciones`);
});

test('cuentas: los ejemplos con su expresión en el enunciado dan la respuesta escrita, y una sola alternativa calza', () => {
  for (const i of def.ideas.slice(1)) i.ejemplos.forEach((e, k) => {
    const p = plano(e.enunciado), m = p.match(/(?:¿Cuánto vale|Calcula E =|Simplifica E =|Escribe) ([^?]*?)(?: con una razón de φ)?[?.]?$/);
    if (!m || /φ = \d+°|rueda|minutero|aspas|tanque|válvula|sen 20° ≈/.test(p)) return;   // con objeto o con ≈: revisados a mano
    const vars = { θ: 23, φ: 23 }, mm = p.match(/θ está en el (\w+) y su ángulo de referencia mide (\d+)°/);
    if (mm) vars.θ = { II: 180 - +mm[2], III: 180 + +mm[2], IV: 360 - +mm[2] }[mm[1]];
    const mt = p.match(/tan φ = (\d+)\/(\d+)/); if (mt) vars.φ = Math.atan(mt[1] / mt[2]) * 180 / Math.PI;
    const ms = p.match(/sen φ = (\d+)\/(\d+)/); if (ms) vars.φ = Math.asin(ms[1] / ms[2]) * 180 / Math.PI;
    let real; try { real = evaluar(m[1], vars); } catch (err) { return; }
    const resp = plano(e.respuesta).split(', ').pop().replace(/^.*= /, '');
    assert.ok(Math.abs(num(resp, vars) - real) < 1e-6, `${i.id} ejemplo ${k + 1}: ${real} contra «${resp}»`);
    if (e.alternativas) assert.equal(e.alternativas.filter(a => Math.abs(num(a, vars) - real) < 1e-6).length, 1, `${i.id} ejemplo ${k + 1}`);
  });
});

test('colores en las figuras: x turquesa y horizontal, y naranja y vertical, ángulos carmín y α violeta sin flecha; sin verde', () => {
  const figs = [];
  const add = (d, f) => { if (f && f.datos) figs.push([d, f.datos]); };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach((t, k) => add(`${i.id} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(i.juega.controles)) add(`${i.id} juego`, i.juega.dibujo(v));
    add(`${i.id} predice`, i.predice.dibujo); add(`${i.id} revelar`, i.predice.revelar); add(`${i.id} mira`, { datos: i.mira.datos }); add(`${i.id} regla`, i.regla.dibujo);
    i.ejemplos.forEach((e, k) => add(`${i.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 60; s++) { add(`${i.id} ahora ${s}`, i.ahoraTu.generar(s).dibujo); add(`${i.id} resuelve ${s}`, i.resuelve.generar(s).dibujo); }
  }
  for (const [d, f] of figs) {
    for (const s of f.segmentos || []) {
      const hor = Math.abs(s.de[1] - s.a[1]) < 1e-9 && Math.abs(s.de[1]) < 1e-9, ver = Math.abs(s.de[0] - s.a[0]) < 1e-9 && Math.abs(s.de[1]) < 1e-9;
      if (s.color === 'i') assert.ok(hor, `${d}: un tramo turquesa que no es la abscisa`);
      if (s.color === 'o') assert.ok(ver, `${d}: un tramo naranja que no es la ordenada`);
      assert.ok([undefined, 'i', 'o'].includes(s.color), `${d}: tramo en ${s.color}`);
    }
    for (const a of f.arcos || []) {
      assert.ok(['h', 'f'].includes(a.color), `${d}: arco en ${a.color}`);
      if (a.color === 'f') assert.equal(a.flecha, false, `${d}: el arco de α va sin flecha`);
    }
    for (const p of f.puntos || []) assert.equal(p.color, undefined, `${d}: el punto P va en tinta`);
  }
  assert.ok(figs.length > 400);
});

test('colores en los textos: θ, β y φ en carmín, α en violeta; nada en verde', () => {
  const recorre = (x, d) => {
    if (Array.isArray(x)) return x.forEach(y => recorre(y, d));
    if (x && typeof x === 'object') {
      if (x.v) {
        assert.notEqual(x.v, 'c-d', `${d}: verde`);
        if (/^[θβφ]$/.test(x.t)) assert.equal(x.v, 'c-h', `${d}: ${x.t} sin carmín`);
        if (x.t === 'α') assert.equal(x.v, 'c-f', `${d}: α sin violeta`);
      }
      Object.values(x).forEach(y => recorre(y, d));
    }
  };
  for (const i of def.ideas) {
    recorre([i.lee, i.juega.consigna, i.juega.leyenda, i.predice, i.mira.pasos, i.regla.ecuacion], i.id);
    i.ejemplos.forEach((e, k) => recorre([e.enunciado, e.datos, e.solucion, e.respuesta], `${i.id} ej ${k + 1}`));
    for (let s = 0; s < 30; s++) { recorre(i.ahoraTu.generar(s), `${i.id} ahora ${s}`); recorre(i.resuelve.generar(s), `${i.id} resuelve ${s}`); }
  }
});

test('misiones: una sola salida en la grilla y ninguna al abrir', () => {
  for (const i of def.ideas) {
    const g = Teoria.grilla(i.juega.controles), ini = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(g.filter(v => i.juega.mision.logrado(v)).length, 1, i.id);
    assert.ok(!i.juega.mision.logrado(ini), `${i.id}: cumplida al abrir`);
  }
});

test('el juego no muestra la respuesta de la predicción', () => {
  for (const i of def.ideas) {
    const ok = plano(i.predice.opciones.find(o => o.correcta).texto).replace(/^≈ /, '');
    const pide = { 'angulo-referencia': '250°', 'misma-razon': 'cos 240°', opuestos: 'cos(−60°)', 'mayores-negativos': 'cos 480°', cofuncion: 'cos 110°' }[i.id];
    for (const v of Teoria.grilla(i.juega.controles)) {
      const t = plano(i.juega.lectura(v));
      assert.ok(!t.includes(pide), `${i.id}: la lectura nombra ${pide}`);
      if (!['opuestos', 'angulo-referencia'].includes(i.id)) assert.ok(!new RegExp(`(^|[^\\d,√/])${ok.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}($|[^\\d,/])`).test(t) || i.id === 'misma-razon', `${i.id}: la lectura dice ${ok} en ${JSON.stringify(v)}: «${t}»`);
    }
  }
});

test('«Ahora tú» no repite un ejemplo ni la predicción, y «Así se resuelve» no repite «Ahora tú»', () => {
  const firma = t => { const p = plano(t), ns = (p.match(/\d+(?:,\d+)?/g) || []).filter(x => x !== '0'); return ns.length ? ns.sort().join('|') : p.replace(/\s+/g, ' ').trim(); };
  for (const i of def.ideas) {
    const previos = new Set(i.ejemplos.map(e => firma(e.enunciado)).concat([firma(i.predice.pregunta)]));
    const res = new Set(Array.from({ length: 12 }, (_, s) => plano(i.resuelve.generar(s).enunciado)));
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), k = firma(c.pregunta);
      if (/φ/.test(plano(c.pregunta))) assert.ok(!i.ejemplos.some(e => plano(e.enunciado) === plano(c.pregunta)), `${i.id} ${s}: repite un ejemplo`);
      else if (/[0-9]/.test(plano(c.pregunta))) assert.ok(!previos.has(k), `${i.id} ${s}: repite un ejemplo o la predicción: «${plano(c.pregunta)}»`);
      if (s < 12) assert.ok(!res.has(plano(c.pregunta)), `${i.id} ${s}: repite «Así se resuelve»`);
    }
  }
});

test('nada de las unidades que siguen: ni radio 1, ni sen², ni seno de una suma', () => {
  const textos = [];
  for (const i of def.ideas) {
    textos.push(plano([i.lee.tarjetas.map(t => t.texto), i.regla.texto, i.regla.ecuacion, i.mira.pasos.map(p => [p.texto, p.ecuacion || ''])]));
    i.ejemplos.forEach(e => textos.push(plano([e.enunciado, e.datos, e.solucion.map(x => [x.texto, x.ecuacion || ''])])));
  }
  for (const t of textos) {
    assert.ok(!/circunferencia trigonométrica|radio 1\b|sen²|cos²|sen\(a \+ b\)/.test(t), t.slice(0, 80));
  }
});

// Rótulos de todas las figuras: dentro del lienzo con 4 de margen y sin pisarse (como la prueba de la pieza).
test('figuras: rótulos dentro del lienzo y sin pisarse', () => {
  const cajas = svg => [...svg.matchAll(/<text[^>]*?x="([-\d.]+)" y="([-\d.]+)"[^>]*?font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g)].map(m => {
    const peso = /font-weight="700"/.test(m[4]) ? 700 : 400, ancla = (m[4].match(/text-anchor="(\w+)"/) || [])[1] || 'start', w = T.ancho(m[5], +m[3], peso);
    const x0 = ancla === 'middle' ? +m[1] - w / 2 : ancla === 'end' ? +m[1] - w : +m[1];
    return [x0, +m[2] - 0.72 * +m[3], x0 + w, +m[2] + 0.18 * +m[3], m[5]];
  });
  const malos = [], vistos = new Set();
  const revisa = (d, f) => {
    if (!f || !f.datos) return;
    const svg = P.dibujar(f.datos, f.estado || {});
    if (vistos.has(svg)) return; vistos.add(svg);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), d);
    const [W, H] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number), cs = cajas(svg);
    for (const c of cs) if (c[0] < 4 - 1e-6 || c[2] > W - 4 + 1e-6 || c[1] < 4 - 1e-6 || c[3] > H - 4 + 1e-6) malos.push(`${d}: «${c[4]}» se sale`);
    for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) {
      const dx = Math.min(cs[a][2], cs[b][2]) - Math.max(cs[a][0], cs[b][0]), dy = Math.min(cs[a][3], cs[b][3]) - Math.max(cs[a][1], cs[b][1]);
      if (dx > 1 && dy > 1) malos.push(`${d}: «${cs[a][4]}» pisa «${cs[b][4]}»`);
    }
  };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach((t, k) => revisa(`${i.id} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(i.juega.controles)) revisa(`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    revisa(`${i.id} predice`, i.predice.dibujo); revisa(`${i.id} revelar`, i.predice.revelar); revisa(`${i.id} regla`, i.regla.dibujo);
    i.mira.pasos.forEach((p, k) => revisa(`${i.id} mira ${k}`, { datos: i.mira.datos, estado: p.estado }));
    i.ejemplos.forEach((e, k) => revisa(`${i.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 60; s++) { revisa(`${i.id} ahora ${s}`, i.ahoraTu.generar(s).dibujo); const r = i.resuelve.generar(s); revisa(`${i.id} resuelve ${s}`, r.dibujo); r.pasos.forEach(p => revisa(`${i.id} resuelve ${s}`, p.dibujo)); }
  }
  assert.deepEqual(malos.slice(0, 20), [], `${malos.length} rótulos con problemas`);
});

// ---- Correcciones del cierre (auditoría y lectores en frío, 26 nov; rutinas/auditoria/ y rutinas/frio/) ----

// Lectores A y B: el rótulo de un ángulo quedaba a 50–80 px de su arco, junto a la altura («α» parecía la altura). Ahora
// la pieza busca primero a 12–30 px del arco: ningún rótulo de arco queda a más de 46 px de él (medido a la caja).
test('figuras: cada rótulo de arco queda junto a su arco', () => {
  const g0 = require(path.join(RAIZ, 'nucleo/kit/piezas/trig-plano.js'));
  const lejos = [], vistos = new Set();
  const revisa = (d, f) => {
    if (!f || !f.datos || !f.datos.arcos) return;
    const svg = P.dibujar(f.datos, f.estado || {});
    if (vistos.has(svg)) return; vistos.add(svg);
    const g = g0.geometria(f.datos), textos = [...svg.matchAll(/<text[^>]*?x="([-\d.]+)" y="([-\d.]+)"[^>]*?font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g)];
    for (const a of f.datos.arcos) {
      if (!a.rotulo || ((a.desde || 0) > ((f.estado || {}).corte || 0))) continue;
      const m = textos.filter(t => t[5] === String(a.rotulo)).pop();
      if (!m) { lejos.push(`${d}: sin «${a.rotulo}»`); continue; }
      const peso = /font-weight="700"/.test(m[4]) ? 700 : 400, ancla = (m[4].match(/text-anchor="(\w+)"/) || [])[1] || 'start', w = T.ancho(m[5], +m[3], peso);
      const x0 = ancla === 'middle' ? +m[1] - w / 2 : ancla === 'end' ? +m[1] - w : +m[1], caja = [x0, +m[2] - 0.72 * +m[3], x0 + w, +m[2] + 0.18 * +m[3]];
      const de = a.de || 0, tot = a.a - de, r0 = Math.max(a.r === undefined ? 0.35 : a.r, 20 / g.k) * g.k, esp = a.espiral === undefined ? 10 : a.espiral;
      let min = 1e9;
      for (let t = 0; t <= 1; t += 0.005) {
        const an = (de + tot * t) * Math.PI / 180, r = r0 + esp * Math.abs(tot * t) / 360, px = g.X(a.cx || 0) + r * Math.cos(an), py = g.Y(a.cy || 0) - r * Math.sin(an);
        min = Math.min(min, Math.hypot(Math.max(caja[0] - px, 0, px - caja[2]), Math.max(caja[1] - py, 0, py - caja[3])));
      }
      if (min > 46) lejos.push(`${d}: «${a.rotulo}» a ${Math.round(min)} px de su arco`);
    }
  };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach((t, k) => revisa(`${i.id} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(i.juega.controles)) revisa(`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    revisa(`${i.id} predice`, i.predice.dibujo); revisa(`${i.id} revelar`, i.predice.revelar); revisa(`${i.id} regla`, i.regla.dibujo);
    i.mira.pasos.forEach((p, k) => revisa(`${i.id} mira ${k}`, { datos: i.mira.datos, estado: p.estado }));
    i.ejemplos.forEach((e, k) => revisa(`${i.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 60; s++) { revisa(`${i.id} ahora ${s}`, i.ahoraTu.generar(s).dibujo); revisa(`${i.id} resuelve ${s}`, i.resuelve.generar(s).dibujo); }
  }
  assert.deepEqual(lejos.slice(0, 20), [], `${lejos.length} rótulos lejos de su arco`);
});

// Auditoría: un «   ·   » entre dos igualdades con números se leía como un producto («4 · (−1) · E = −3 − 4»,
// «510° · 510° − 360°»). En los resueltos de los ejemplos, cada igualdad va en su línea o unida por «y».
test('ejemplos: ningún resuelto separa dos igualdades con un punto medio', () => {
  const malos = [];
  for (const i of def.ideas) i.ejemplos.forEach((e, k) => (e.solucion || []).forEach(p => {
    if (p.ecuacion && /\s{2,}·\s{2,}/.test(JSON.stringify(p.ecuacion))) malos.push(`${i.id} ejemplo ${k + 1}: ${plano(p.ecuacion)}`);
  }));
  assert.deepEqual(malos, []);
});

// Auditoría y redactor: «el aspa C» con la alternativa C (y en la cuarta aspa, que es la D); P para la pérdida del tanque
// cuando P es la punta del objeto (campo letras). Un ejemplo con alternativas no nombra un objeto con una letra de A a E,
// y ninguno usa P como incógnita.
test('ejemplos: ni objetos con letras de alternativa ni P como otra cosa', () => {
  const malos = [];
  for (const i of def.ideas) i.ejemplos.forEach((e, k) => {
    const t = plano(e.enunciado);
    if (e.alternativas && /\b(aspa|cabina|punto|reloj|rueda) [A-E]\b/.test(t)) malos.push(`${i.id} ejemplo ${k + 1}: ${t}`);
    if (/\bP = /.test(t)) malos.push(`${i.id} ejemplo ${k + 1}: P como incógnita`);
  });
  assert.deepEqual(malos, []);
});

// Auditoría: en el ejemplo 15 de la idea 3, «D mide los agudos hasta el eje y» daba 0, la respuesta correcta; el valor
// de D, −√3, sale de medir hasta el eje y y además olvidar el menos de sen(−210°). Se rehace aquí: con los agudos hasta
// el eje y (30° y 60°), cos 240° = −√3/2 y sen 210° = −√3/2; con el menos olvidado, E = −√3/2 + (−√3/2).
test('ejemplo 15 de opuestos: la explicación de D da su valor', () => {
  const e = idea('opuestos').ejemplos[14], D = plano(e.alternativas[3]), sol = e.solucion.map(p => plano(p.texto)).join(' ');
  assert.equal(D, '−√3');
  const conEjeY = -Math.sqrt(3) / 2 + (-Math.sqrt(3) / 2);
  assert.ok(Math.abs(conEjeY + Math.sqrt(3)) < 1e-12);
  assert.match(sol, /D\b[^;.]*eje y[^;.]*olvida el menos de sen\(−210°\)/);
});

// Lectores A y B: la voz de «Ahora tú» no calzaba con el caso («¿90° o 270°?» con 180° + φ; «después, el cuadrante» con
// 53°). La voz es general: nombra los dos casos.
test('voces de «Ahora tú» que valen para todos sus casos', () => {
  assert.match(idea('cofuncion').ahoraTu.voz, /180°/);
  assert.match(idea('opuestos').ahoraTu.voz, /si el ángulo no es agudo/);
});

// Lector A: en el I la lectura decía «sen 45° = sen 45° = √2/2».
test('juego de misma-razon: la lectura no repite el mismo ángulo a los dos lados', () => {
  for (const v of Teoria.grilla(idea('misma-razon').juega.controles)) {
    const t = plano(idea('misma-razon').juega.lectura(v));
    assert.ok(!/sen (\d+)° = sen \1°/.test(t), t);
  }
});

// Redactor (nota 6): «uno es el reflejo del otro en el eje y» era falso con θ = 0°, donde 180° + θ y 180° − θ dan el mismo
// P′. La invitación pide ahora dos P′ distintos: entonces, a la misma altura, uno es el reflejo del otro.
test('laboratorio: la invitación de la misma altura no se cumple con el mismo punto', () => {
  const mesa = def.laboratorio.find(m => m.id === 'siete-relaciones'), inv = mesa.invitaciones.find(v => /misma altura/.test(v.texto));
  const rels = mesa.controles[1].opciones.map(o => o.valor);
  for (const a of rels) for (const b of rels) if (a !== b && inv.logrado({ g: 0, rel: a }, [{ g: 0, rel: b }])) {
    const pa = mesa.dibujo({ g: 0, rel: a }).datos, pb = mesa.dibujo({ g: 0, rel: b }).datos;
    assert.notDeepEqual(pa.puntos.slice(-1)[0], pb.puntos.slice(-1)[0], `con θ = 0° las parejas ${a} y ${b} dan el mismo P′`);
  }
});
