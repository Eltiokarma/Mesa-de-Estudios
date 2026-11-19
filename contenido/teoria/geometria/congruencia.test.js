// Pruebas propias de «Congruencia de triángulos» (geometria.congruencia), etapa 5 del plan de calidad (19 nov 2026):
// las seis ideas contra su propuesta (docs/etapa5/propuesta-geometria.md). Idea 1 en detalle (fase 2): el juego y su
// misión, la regla de colores, la fidelidad de cada figura, los rótulos, que ninguna figura traiga la respuesta y las
// respuestas de «Ahora tú» rehechas aparte. Ideas 2 a 6 (fase 3, al final del archivo): lo mismo para cada una, con las
// respuestas de «Ahora tú» rehechas leyendo el enunciado (o la figura, cuando la pareja la dicen los arcos o las rayitas).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./congruencia.js');

const P = Kit.piezas['geo-objeto'], G = Kit.piezas['geo-figura'];
const SEMILLAS = 400;
const idea = def.ideas[0];
const plano = x => Teoria.plano(x);
const C = require('../../../catalogo/cursos/geometria.json');
const TEMAS = C.unidades.find(u => u.id === def.unidad).temas;
const RAD = Math.PI / 180;

test('las seis ideas de la propuesta, en orden; se conservan los id de antes, sus controles y las mesas', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['criterios', 'partes-correspondientes', 'mediatriz-bisectriz', 'base-media', 'mediana-hipotenusa', 'notables']);
  const ctr = id => def.ideas.find(i => i.id === id).juega.controles.map(c => c.id);
  assert.deepEqual(ctr('criterios'), ['t']);
  assert.deepEqual(ctr('partes-correspondientes'), ['giro', 'cara']);
  assert.deepEqual(ctr('mediatriz-bisectriz'), ['dx', 'y']);
  assert.deepEqual(ctr('base-media'), ['ax', 'ay']);
  assert.deepEqual(ctr('mediana-hipotenusa'), ['fi']);
  assert.deepEqual(ctr('notables'), ['tipo', 'k']);
  // Las tres mesas de antes conservan su id; dos nuevas (el pozo y las escuadras). Una por idea, salvo la idea 2.
  assert.deepEqual(def.laboratorio.map(m => m.id), ['compas-lla', 'pozo', 'base-libre', 'c-libre', 'escuadras']);
  assert.ok(def.ideas.every(i => Teoria.palabras(i.titulo) <= 6));
  assert.notEqual(def.calidad, 2, 'la sesión marca calidad 2 después del lector en frío y el auditor');
  const p = Teoria.problemas(def, { temas: TEMAS, semillas: SEMILLAS });
  assert.deepEqual(p, [], p.join('\n'));
});

test('la unidad entera pasa el validador como si fuera calidad 2 (sin excepciones) y cada idea trae 15 ejemplos', () => {
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: TEMAS, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === nv).length, 5, `${i.id} nivel ${nv}`);
    // Nivel 3: tipo examen, con sus cinco alternativas en línea aparte; el resuelto explica cada incorrecta por su valor.
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.equal(e.alternativas.length, 5, e.titulo);
      assert.ok(e.solucion.length >= 2, `${e.titulo}: un nivel 3 no se resuelve en una línea`);
      const sol = e.solucion.map(x => plano(x.texto) + ' ' + plano(x.ecuacion || '')).join(' ');
      for (const a of e.alternativas.filter(x => !plano(e.respuesta).includes(plano(x)))) assert.ok(sol.includes(plano(a).replace(/ cm$| m$| valores$/, '')) || /mismo perímetro/.test(plano(a)) && /mismo perímetro/.test(sol), `${i.id} «${e.titulo}»: el resuelto no dice nada de «${plano(a)}»`);
      const txt = e.solucion.map(x => plano(x.texto)).join(' ') + plano(e.respuesta);
      assert.ok(!/\b(alternativa|opción|respuesta:?)\s+[A-E]\b/i.test(txt), `${e.titulo}: nombra una alternativa por su letra`);
      assert.equal(e.alternativas.filter(a => plano(e.respuesta).includes(plano(a))).length >= 1, true, `${e.titulo}: la respuesta está entre las alternativas`);
    }
  }
});

// ---------- El juego ----------
const bcDe = t => Math.hypot(8 - 5 * Math.cos(t * RAD), 5 * Math.sin(t * RAD));   // por coordenadas, sin la unidad
test('el juego: el control t (40° a 120°), la misión sin cumplir al abrir y cumplida solo con 60°; la lectura dice BC y el del modelo', () => {
  const j = idea.juega, c = j.controles[0];
  assert.deepEqual([c.id, c.min, c.max, c.paso, c.inicio], ['t', 40, 120, 10, 100]);
  assert.equal(j.mision.logrado({ t: c.inicio }), false);
  const cumplen = [];
  for (let t = c.min; t <= c.max; t += c.paso) {
    if (j.mision.logrado({ t })) cumplen.push(t);
    const l = plano(j.lectura({ t })), bc = bcDe(t);
    assert.ok(l.includes(`m∠A = ${t}°`), l);
    assert.ok(l.includes(`${Math.abs(bc - Math.round(bc)) < 1e-9 ? '=' : '≈'} ${Kit.formatear(bc, 1)} m`), `${t}°: ${l} (BC = ${bc})`);
    assert.ok(/el modelo, BC = 7 m/.test(l), l);
    // En la figura, las vigas miden lo que dicen: AB 8 m, AC 5 m y BC lo que da la cuenta.
    const fg = P.escena(j.dibujo({ t }).datos).fig, g = G.geometria(fg), d = (a, b) => Math.hypot(g.P(a)[0] - g.P(b)[0], g.P(a)[1] - g.P(b)[1]);
    assert.ok(Math.abs(d('A', 'B') - 8) < 1e-9 && Math.abs(d('A', 'C') - 5) < 1e-9 && Math.abs(d('B', 'C') - bc) < 1e-9, `${t}°`);
  }
  assert.deepEqual(cumplen, [60]);
  assert.ok(Math.abs(bcDe(60) - 7) < 1e-9, 'el modelo cierra con 7 m');
  assert.match(j.consigna + j.mision.texto, /arrastra C o usa el control/, 'la misión dice cómo se mueve la viga');
  // El objeto de la primera pantalla es el tijeral en el piso del taller (dibujo de prueba), con la silueta del modelo.
  const s = P.dibujar(j.dibujo({ t: 100 }).datos, {});
  assert.match(s, /data-objeto="armazon" data-prueba="si"/);
  assert.equal(j.dibujo({ t: 100 }).datos.silueta.puntos.length, 3);
});

// ---------- Todas las figuras de la idea 1 ----------
function figuras(N = SEMILLAS) {
  const out = [], toma = (donde, dib, o = {}) => { if (dib && dib.datos) out.push(Object.assign({ donde, datos: dib.datos, estado: dib.estado || {} }, o)); };
  const j = idea.juega;
  for (let t = j.controles[0].min; t <= j.controles[0].max; t += j.controles[0].paso) toma(`juego ${t}`, j.dibujo({ t }));
  for (const [k, t] of idea.lee.tarjetas.entries()) toma(`lee ${k + 1}`, t.dibujo);
  toma('predice', idea.predice.dibujo, { ejercicio: true, texto: plano(idea.predice.pregunta), respuesta: 'Dos' }); toma('revelar', idea.predice.revelar);
  idea.mira.pasos.forEach((p, k) => toma(`mira ${k + 1}`, { datos: idea.mira.datos, estado: p.estado }));
  toma('regla', idea.regla.dibujo);
  idea.ejemplos.forEach((e, k) => toma(`ejemplo ${k + 1}`, e.figura, { ejercicio: true, texto: plano(e.enunciado), respuesta: plano(e.respuesta) }));
  for (let s = 0; s < N; s++) {
    const r = idea.resuelve.generar(s);
    toma(`resuelve ${s}`, r.dibujo, { ejercicio: true, texto: plano(r.enunciado) });
    r.pasos.forEach((x, k) => toma(`resuelve ${s} paso ${k + 1}`, x.dibujo));
    const a = idea.ahoraTu.generar(s);
    toma(`ahora tú ${s}`, a.dibujo, { ejercicio: true, texto: plano(a.pregunta), respuesta: plano(a.opciones.find(o => o.correcta).texto) });
  }
  return out;
}
const FIGS = figuras();
const corteDe = it => (it.estado.corte === undefined ? Infinity : it.estado.corte);
const visible = (x, corte) => (x.desde || 0) <= corte && !(x.hasta < corte);
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

test('hay figuras de sobra (la prueba no corre en vacío)', () => assert.ok(FIGS.length > 900, `${FIGS.length}`));

test('colores de la unidad: ángulos en carmín o en tinta, lados en naranja, turquesa o tinta; nunca violeta ni verde; marcas solo sobre llaves', () => {
  for (const it of FIGS) {
    const s = P.dibujar(it.datos, it.estado);
    assert.ok(!/var\(--c-f\)/.test(s), `${it.donde}: violeta en una figura`);
    assert.ok(!/var\(--c-d\)/.test(s), `${it.donde}: verde en una figura`);
    const fg = P.escena(it.datos).fig;
    for (const an of fg.angulos || []) assert.ok(an.color === undefined || an.color === 'h', `${it.donde}: ángulo de color ${an.color}`);
    for (const sg of fg.segmentos || []) {
      assert.ok(sg.color === undefined || sg.color === 'o' || sg.color === 'i', `${it.donde}: lado de color ${sg.color}`);
      assert.ok(!sg.marcas, `${it.donde}: una marca de igualdad sobre el lado (va sobre una llave)`);
    }
    // En un ejercicio, lo pedido («?») va en tinta, y un ángulo carmín sin rótulo tiene su valor en el enunciado o es
    // un dato sin número (una pareja de ángulos iguales).
    if (it.ejercicio) for (const an of fg.angulos || []) if (an.texto === '?') assert.equal(an.color, undefined, `${it.donde}: «?» con color`);
  }
});

test('fidelidad: cada ángulo mide en el dibujo lo que dice su rótulo (±0,5°) y los lados con medida van a una sola escala (±1 %)', () => {
  let ang = 0, lados = 0;
  for (const it of FIGS) {
    if (it.datos.sinEscala) continue;
    const fg = P.escena(it.datos).fig, g = G.geometria(fg), corte = corteDe(it);
    for (const an of (fg.angulos || []).filter(a => visible(a, corte))) {
      const m = G.util.angulo(g.P(an.en), g.P(an.de), g.P(an.a));
      const num = /^(?:≈ )?(\d+(?:,\d+)?)°$/.exec(String(an.texto === undefined ? '' : an.texto));
      if (num) { assert.ok(Math.abs(m - +num[1].replace(',', '.')) < 0.5, `${it.donde}: «${an.texto}» mide ${m.toFixed(2)}° en el dibujo`); ang++; }
      if (an.mide !== undefined) assert.ok(Math.abs(m - an.mide) < 0.5, `${it.donde}: mide dice ${an.mide} y el dibujo ${m.toFixed(2)}`);
    }
    const esc = [];
    for (const l of (it.datos.ladosRot || []).filter(x => visible(x, corte))) {
      const num = /^(?:≈ )?(\d+(?:,\d+)?) (cm|m)$/.exec(String(l.texto));
      if (!num) continue;
      const p = g.P(l.de), q = g.P(l.a), largo = Math.hypot(p[0] - q[0], p[1] - q[1]);
      esc.push([largo / +num[1].replace(',', '.'), l.texto, /^≈/.test(l.texto)]);
      lados++;
    }
    for (const [k, t, aprox] of esc) assert.ok(Math.abs(k / esc[0][0] - 1) < (aprox || esc[0][2] ? 0.012 : 0.01), `${it.donde}: «${t}» no va a la escala de «${esc[0][1]}»`);
  }
  assert.ok(ang > 500 && lados > 800, `${ang} ángulos y ${lados} lados comprobados`);
});

test('rótulos: caben, no pisan nada ni tocan una línea, y cada rótulo de ángulo queda más cerca de su vértice que de otro', () => {
  const mal = [];
  for (const it of FIGS) {
    const corte = corteDe(it);
    if (!P.escenaCabe(it.datos, corte)) { mal.push(`${it.donde}: no cabe`); continue; }
    const { rot, vertice, angs } = P.rotulos(it.datos, corte), ids = [...new Set(angs.filter(a => visible(a, corte)).map(q => q.en))];
    for (const z of rot) {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      if (!ids.every(id => id === z.an.en || d(z.an.en) < 0.85 * d(id))) mal.push(`${it.donde}: «${z.an.texto}» queda lejos de su vértice`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('ninguna figura de la predicción, de un ejemplo ni de «Ahora tú» trae la respuesta; las que van sin escala lo dicen', () => {
  for (const it of FIGS.filter(x => x.ejercicio)) {
    const textos = textosSVG(P.dibujar(it.datos, it.estado));
    // La respuesta con número (17 cm, 55°, 14 cm) no está escrita en el dibujo.
    for (const m of (it.respuesta || '').matchAll(/\d+(?:,\d+)? ?(?:cm|m|°)/g)) assert.ok(!textos.includes(m[0]), `${it.donde}: el dibujo trae «${m[0]}»`);
    // Una figura con dos triángulos dibujados diría si son o no congruentes: cuando se pregunta eso, va uno solo.
    if (/¿Son congruentes\?|aseguran? que|¿Qué criterio asegura/.test(it.texto || '')) {
      const letras = new Set((P.escena(it.datos).fig.puntos || []).map(q => q.rotulo).filter(Boolean));
      assert.ok(!['D', 'E', 'F'].some(x => letras.has(x)), `${it.donde}: dibuja también el segundo triángulo`);
    }
    if (it.datos.sinEscala) assert.match(it.texto, /El dibujo no está a escala\./, it.donde);
    else assert.ok(!/no está a escala/.test(it.texto || ''), `${it.donde}: dice sin escala y va a escala`);
  }
  // El tijeral con su poste: la respuesta es 55° y ningún ángulo dibujado queda a 7° o menos de ella.
  const e15 = idea.ejemplos[14], fg = P.escena(e15.figura.datos).fig, g = G.geometria(fg);
  assert.ok(e15.figura.datos.sinEscala);
  for (const [v, a, b] of [['A', 'B', 'M'], ['B', 'A', 'M'], ['M', 'A', 'B'], ['A', 'B', 'C']]) assert.ok(Math.abs(G.util.angulo(g.P(v), g.P(a), g.P(b)) - 55) > 7, `ángulo ${a}${v}${b}`);
});

// ---------- «Ahora tú»: la respuesta rehecha aparte, leyendo el enunciado ----------
const NINGUNO = 'Ninguno: esos datos no bastan';
function rehacer(q) {
  let m;
  // Tipo 0: tres parejas de medidas iguales. Se cuentan lados y ángulos y se mira si la pieza del medio queda entre las otras.
  if ((m = /se sabe: (.+)\. ¿Qué criterio/.exec(q))) {
    const datos = m[1].split('; ').map(t => t.split(' = ')[0]), lados = datos.filter(t => !t.startsWith('m∠')), angs = datos.filter(t => t.startsWith('m∠')).map(t => t.slice(2));
    if (lados.length === 3) return 'LLL';
    if (angs.length === 3) return NINGUNO;
    if (lados.length === 2) return lados.every(L => L.includes(angs[0])) ? 'LAL' : NINGUNO;
    return angs.every(v => lados[0].includes(v)) ? 'ALA' : NINGUNO;
  }
  // Tipo 1: dos lados; hace falta el ángulo del vértice que comparten.
  if ((m = /se sabe que ([A-C]{2}) = [D-F]{2} y ([A-C]{2}) = [D-F]{2}\. ¿Qué dato más/.exec(q))) {
    const v = m[1].split('').find(x => m[2].includes(x));
    return `m∠${v} = m∠${{ A: 'D', B: 'E', C: 'F' }[v]}`;
  }
  // Tipo 2: cuántos puntos de la semirrecta que sale de A a 30° quedan a la distancia BC de B.
  if ((m = /con AB = (\d+) cm, m∠A = 30° y BC = (\d+) cm\. ¿Cuántos/.exec(q))) {
    const c = +m[1], r = +m[2], b = -2 * c * Math.cos(30 * RAD), k = c * c - r * r, disc = b * b - 4 * k;
    const ts = Math.abs(disc) < 1e-9 ? [-b / 2] : disc < 0 ? [] : [(-b - Math.sqrt(disc)) / 2, (-b + Math.sqrt(disc)) / 2];
    return ['Ninguno', 'Uno solo', 'Dos'][ts.filter(t => t > 1e-9).length];
  }
  // Tipo 3: dos datos escritos y un tercero que pone la figura (el lado común AC o los ángulos opuestos en O).
  if ((m = /En la figura, (.+)\. ¿Por qué criterio/.exec(q))) {
    const partes = m[1].replace(/^AD y BC se cortan en O, con /, '').split(' y '), lados = partes.filter(t => !t.startsWith('m∠')).length + (/se cortan en O/.test(m[1]) ? 0 : 1);
    const angs = partes.length - partes.filter(t => !t.startsWith('m∠')).length + (/se cortan en O/.test(m[1]) ? 1 : 0);
    return lados === 3 ? 'LLL' : lados === 2 && angs === 1 ? 'LAL' : 'ALA';
  }
  // Tipo 4: dos expresiones iguales; se despeja x y se reemplaza.
  if ((m = /= (\d+)x − (\d+) y [A-F]{2} = x \+ (\d+), en centímetros/.exec(q))) {
    const x = (+m[3] + +m[2]) / (+m[1] - 1);
    return `${Kit.formatear(+m[1] * x - +m[2], 1)} cm`;
  }
  return null;
}
test('«Ahora tú»: cuatro opciones distintas, una correcta, tres códigos distintos, datos sin la respuesta y la respuesta rehecha aparte (400 semillas)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea.ahoraTu.generar(s), q = plano(c.pregunta), ops = c.opciones;
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}: opciones repetidas`);
    const bien = ops.filter(o => o.correcta);
    assert.equal(bien.length, 1);
    assert.equal(new Set(ops.filter(o => !o.correcta).map(o => o.error)).size, 3, `semilla ${s}: dos opciones con el mismo código (${ops.map(o => o.error).join(', ')})`);
    assert.ok(ops.filter(o => !o.correcta).every(o => /^GE-(CON|TRI)\d+$/.test(o.error)), `semilla ${s}`);
    const esp = rehacer(q);
    assert.ok(esp, `semilla ${s}: no pude leer «${q}»`);
    assert.equal(plano(bien[0].texto), esp, `semilla ${s}: ${q}`);
    assert.ok(Array.isArray(c.datos) && c.datos.length >= 1 && !c.datos.some(d => plano(d).includes(esp) && /\d/.test(esp)), `semilla ${s}: los datos traen la respuesta`);
    tipos.add(s % 5);
  }
  assert.equal(tipos.size, 5);
});

test('«Así se resuelve» no repite «Ahora tú»: dos ángulos y otro lado (ALA con el tercer ángulo) o un ángulo en otro vértice', () => {
  for (let s = 0; s < 60; s++) {
    const r = idea.resuelve.generar(s), q = plano(r.enunciado), resp = plano(r.respuesta);
    assert.ok(rehacer(q) === null, `semilla ${s}: es un caso de «Ahora tú»`);
    const m = /m∠A = m∠D = (\d+)°, m∠C = m∠F = (\d+)° y AB = DE = 8 cm/.exec(q);
    if (m) assert.ok(resp.includes('ALA') && resp.includes(`m∠B = m∠E = ${180 - m[1] - m[2]}°`), `semilla ${s}: ${resp}`);
    else { assert.match(q, /m∠A = (\d+)°\. En △DEF: DE = \d+ cm, DF = \d+ cm y m∠E = \1°/); assert.match(resp, /^No/); }
    assert.ok(Array.isArray(r.datos) && r.datos.length >= 1);
  }
});

// ---------- Notación y glosario ----------
function cadenas(o, out = [], visto = new Set()) {
  if (typeof o === 'string') out.push(o);
  else if (o && typeof o === 'object' && !visto.has(o)) { visto.add(o); for (const [k, v] of Object.entries(o)) if (!['id', 'error', 'alt', 'pieza', 'objeto', 'tipo', 'color', 'v', 'de', 'a', 'en', 'rotulo', 'ref'].includes(k)) cadenas(v, out, visto); }
  return out;
}
test('notación de la idea 1: m∠ (nunca «∠A = 40°»), x sin «°», el segundo triángulo es DEF y todo largo lleva su unidad', () => {
  const textos = cadenas({ lee: idea.lee, juega: [idea.juega.consigna, idea.juega.mision, idea.juega.leyenda], predice: idea.predice, mira: idea.mira.pasos, regla: [idea.regla.texto, idea.regla.condicion, idea.regla.ecuacion],
    ejemplos: idea.ejemplos.map(e => [e.enunciado, e.datos, e.solucion, e.respuesta, e.alternativas]) });
  for (let s = 0; s < SEMILLAS; s++) { const c = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s); textos.push(...cadenas([c.pregunta, c.datos, c.opciones, c.solucion, r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta])); }
  for (const t of new Set(textos)) {
    assert.ok(!/(^|[^m])∠[A-F]{1,3} = \d/.test(t), `ángulo sin m∠: «${t}»`);
    assert.ok(!/\bx = \d+(,\d+)?°/.test(t), `x con «°»: «${t}»`);
    assert.ok(!/△PQR|\bPQ\b|\bQR\b/.test(t), `el segundo triángulo es DEF: «${t}»`);
    assert.ok(!/\b[CS]\(x\)/.test(t), t);
    assert.ok(!/\b(?:AB|AC|BC|DE|DF|EF|OA|OB|OC|OD) = \d+(?:,\d+)?(?![\d,]| ?(?:cm|m)\b| ?[·+−x])/.test(t), `un largo sin unidad: «${t}»`);
  }
});

test('glosario de la idea 1: cuatro palabras con su aproximación y tres ejemplos; ninguna da la respuesta de la predicción', () => {
  const g = t => def.glosario.find(x => x.termino === t);
  for (const t of ['congruente', 'criterio', 'LAL', 'ALA']) { assert.ok(g(t).simple && Teoria.palabras(g(t).simple) <= 14, t); assert.ok(g(t).ejemplos.length >= 3, t); }
  for (const t of ['LLL', 'LLA']) assert.ok(g(t).ejemplos.length >= 3, t);
  // La predicción pregunta cuántos tijerales da LLA: ni la definición ni sus ejemplos lo dicen.
  const lla = [g('LLA').def, ...g('LLA').ejemplos, g('criterio').simple, ...g('criterio').ejemplos, g('LAL').simple, ...g('LAL').ejemplos].join(' ');
  assert.ok(!/\b(salen|hay|haber|dar|da|dan) dos\b|\bdos (triángulos|tijerales) distintos\b/i.test(lla), lla);
});

// ====================================================================================================================
// Ideas 2 a 6 (fase 3, 19 nov)
// ====================================================================================================================
const IDEAS = def.ideas.slice(1);
const N3 = 200;
// Todas las figuras de una idea, como las arma el lector: juego (toda la grilla), «Lee», predicción, «Mira», la regla,
// los ejemplos, «Así se resuelve» y «Ahora tú».
function figurasDe(i, N = N3) {
  const out = [], toma = (donde, dib, o = {}) => { if (dib && dib.datos && dib.datos.objeto) out.push(Object.assign({ donde: `${i.id} ${donde}`, datos: dib.datos, estado: dib.estado || {} }, o)); };
  let grid = [{}];
  for (const c of i.juega.controles) {
    const vals = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6));
    grid = grid.flatMap(g => vals.map(v => Object.assign({}, g, { [c.id]: v })));
  }
  for (const v of grid) toma(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
  for (const [k, t] of i.lee.tarjetas.entries()) toma(`lee ${k + 1}`, t.dibujo);
  toma('predice', i.predice.dibujo, { ejercicio: true, texto: plano(i.predice.pregunta), respuesta: plano(i.predice.opciones.find(o => o.correcta).texto) });
  toma('revelar', i.predice.revelar);
  i.mira.pasos.forEach((p, k) => toma(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }));
  toma('regla', i.regla.dibujo);
  i.ejemplos.forEach((e, k) => toma(`ejemplo ${k + 1}`, e.figura, { ejercicio: true, texto: plano(e.enunciado), respuesta: plano(e.respuesta) }));
  for (let s = 0; s < N; s++) {
    const r = i.resuelve.generar(s);
    toma(`resuelve ${s}`, r.dibujo, { ejercicio: true, texto: plano(r.enunciado), respuesta: plano(r.respuesta) });
    const a = i.ahoraTu.generar(s);
    toma(`ahora tú ${s}`, a.dibujo, { ejercicio: true, texto: plano(a.pregunta), respuesta: plano(a.opciones.find(o => o.correcta).texto) });
  }
  return out;
}
const FIGS3 = IDEAS.flatMap(i => figurasDe(i));

test('ideas 2 a 6: el objeto de la primera pantalla es un dibujo de prueba de la pieza (banderines, mapa, tijeral, escalera, escuadras)', () => {
  const tipos = { 'partes-correspondientes': 'costura', 'mediatriz-bisectriz': 'mapa', 'base-media': 'taller', 'mediana-hipotenusa': 'escalera', notables: 'escuadras' };
  for (const i of IDEAS) {
    const v = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    const d = i.juega.dibujo(v).datos;
    assert.equal(d.objeto, 'armazon', i.id); assert.equal(d.tipo, tipos[i.id], i.id);
    assert.match(P.dibujar(d, {}), /data-objeto="armazon" data-prueba="si"/, i.id);
    assert.equal(i.lee.tarjetas[0].dibujo.datos.tipo, tipos[i.id], `${i.id}: la primera tarjeta de «Lee» muestra el objeto`);
  }
});

test('ideas 2 a 6: la misión no está cumplida al abrir y solo la cumple lo que dice la propuesta', () => {
  const grilla = i => i.juega.controles.reduce((gs, c) => gs.flatMap(g => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6))).map(v => Object.assign({}, g, { [c.id]: v }))), [{}]);
  const esperado = {
    'partes-correspondientes': [{ giro: 60, cara: 'vuelta' }],
    'mediatriz-bisectriz': [{ dx: 0, y: 4 }],
    'base-media': [0, 1, 2, 3, 4, 5, 6, 7, 8].map(ax => ({ ax, ay: 4 })),
    'mediana-hipotenusa': [{ fi: 60 }],
    notables: [{ tipo: '30-60', k: 5 }],
  };
  for (const i of IDEAS) {
    const ini = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(i.juega.mision.logrado(ini), false, i.id);
    const ok = grilla(i).filter(v => i.juega.mision.logrado(v));
    assert.deepEqual(ok, esperado[i.id], i.id);
  }
  // Las cuentas de cada misión, por otro camino: el pozo a 5 km de A(−3; 0) y de B(3; 0) (3-4-5); el listón a ay ÷ 2 del
  // piso; el pie de la escalera de 4 m a 4·cos 60° = 2 m; la escuadra de 30° y 60° con k = 5: 2k = 10 y k = 5.
  assert.ok(Math.abs(Math.hypot(3, 4) - 5) < 1e-12);
  assert.ok(Math.abs(4 * Math.cos(60 * RAD) - 2) < 1e-12);
  // La lectura de cada juego enuncia una relación (lleva «=» o «:»), no un número suelto.
  for (const i of IDEAS) for (const v of grilla(i).slice(0, 40)) assert.match(plano(i.juega.lectura(v)), /[=:]/, i.id);
});

test('ideas 2 a 6, colores: ángulos en carmín o tinta, lados en naranja, turquesa o tinta; nunca violeta ni verde; marcas solo sobre llaves', () => {
  assert.ok(FIGS3.length > 1500, `${FIGS3.length}`);
  for (const it of FIGS3) {
    const s = P.dibujar(it.datos, it.estado);
    assert.ok(!/var\(--c-[fd]\)/.test(s), `${it.donde}: violeta o verde en una figura`);
    const fg = P.escena(it.datos).fig;
    for (const an of fg.angulos || []) assert.ok(an.color === undefined || an.color === 'h', `${it.donde}: ángulo de color ${an.color}`);
    for (const sg of fg.segmentos || []) {
      assert.ok(sg.color === undefined || sg.color === 'o' || sg.color === 'i', `${it.donde}: lado de color ${sg.color}`);
      assert.ok(!sg.marcas, `${it.donde}: una marca de igualdad sobre el lado`);
    }
    if (it.ejercicio) for (const an of fg.angulos || []) if (an.texto === '?') assert.equal(an.color, undefined, `${it.donde}: «?» con color`);
  }
  // En la idea 2 los lados de los triángulos que se emparejan van en tinta (el color no da la pareja).
  for (const it of FIGS3.filter(x => /^partes-correspondientes (ahora tú|ejemplo [1-7]\b|predice|juego)/.test(x.donde) && x.datos.tipo !== 'cometa')) {
    const fg = P.escena(it.datos).fig;
    if ((fg.puntos || []).some(q => q.id === 'O')) continue;   // el cruce: OA y OD son datos, no parejas por hallar
    for (const sg of fg.segmentos || []) assert.equal(sg.color, undefined, `${it.donde}: lado ${sg.de}${sg.a} con color`);
  }
});

test('ideas 2 a 6, fidelidad: cada ángulo mide lo que dice su rótulo (±0,5°) y las medidas de lados van a una escala', () => {
  let ang = 0, lados = 0;
  for (const it of FIGS3) {
    if (it.datos.sinEscala) continue;
    const fg = P.escena(it.datos).fig, g = G.geometria(fg), corte = corteDe(it);
    for (const an of (fg.angulos || []).filter(a => visible(a, corte))) {
      const m = G.util.angulo(g.P(an.en), g.P(an.de), g.P(an.a)), num = /^(?:≈ )?(\d+(?:,\d+)?)°$/.exec(String(an.texto === undefined ? '' : an.texto));
      if (num) { assert.ok(Math.abs(m - +num[1].replace(',', '.')) < 0.5, `${it.donde}: «${an.texto}» mide ${m.toFixed(2)}°`); ang++; }
      if (an.mide !== undefined) assert.ok(Math.abs(m - an.mide) < 0.5, `${it.donde}: mide ${an.mide} y el dibujo ${m.toFixed(2)}`);
    }
    const esc = [];
    for (const l of (it.datos.ladosRot || []).filter(x => visible(x, corte))) {
      const num = /^(?:≈ )?(\d+(?:,\d+)?) (cm|m|km)$/.exec(String(l.texto));
      if (!num) continue;
      const p = g.P(l.de), q = g.P(l.a);
      const v = +num[1].replace(',', '.'); esc.push([Math.hypot(p[0] - q[0], p[1] - q[1]) / v, l.texto, /^≈/.test(l.texto) ? 0.05 / v : 0]); lados++;
    }
    // (Una medida con «≈» está redondeada a la décima: su error relativo llega a 0,05 ÷ la medida.)
    for (const [k, t, e] of esc) assert.ok(Math.abs(k / esc[0][0] - 1) < 0.01 + e + esc[0][2], `${it.donde}: «${t}» no va a la escala de «${esc[0][1]}»`);
  }
  assert.ok(ang > 1000 && lados > 1500, `${ang} ángulos y ${lados} lados comprobados`);
});

test('ideas 2 a 6, rótulos: caben, no pisan nada y cada rótulo de ángulo queda más cerca de su vértice que de otro', () => {
  const mal = [];
  for (const it of FIGS3) {
    const corte = corteDe(it);
    if (!P.escenaCabe(it.datos, corte)) { mal.push(`${it.donde}: no cabe`); continue; }
    const { rot, vertice, angs } = P.rotulos(it.datos, corte), ids = [...new Set(angs.filter(a => visible(a, corte)).map(q => q.en))];
    for (const z of rot) {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      if (!ids.every(id => id === z.an.en || d(z.an.en) < 0.85 * d(id))) mal.push(`${it.donde}: «${z.an.texto}» queda lejos de su vértice`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('ideas 2 a 6: ninguna figura de un ejercicio trae la respuesta; las que van sin escala lo dicen', () => {
  for (const it of FIGS3.filter(x => x.ejercicio)) {
    const textos = textosSVG(P.dibujar(it.datos, it.estado));
    // (En la idea 2, «¿cuánto mide DE?» con la figura: la respuesta es una de las medidas de ABC, que son el dato; lo que
    // se practica es cuál.)
    const deDato = /^partes-correspondientes/.test(it.donde) && /¿Cuánto mide [D-F]{2}\?|¿cuánto mide DE en el segundo\?/.test(it.texto || '');
    if (!deDato) for (const m of (it.respuesta || '').matchAll(/\d+(?:,\d+)?(?:√\d)? ?(?:cm|m|km|°)/g)) assert.ok(!textos.includes(m[0]) || (it.texto || '').includes(m[0]), `${it.donde}: el dibujo trae «${m[0]}»`);
    if (it.datos.sinEscala) assert.match(it.texto, /El dibujo no está a escala\./, it.donde);
    else assert.ok(!/no está a escala/.test(it.texto || ''), `${it.donde}: dice sin escala y va a escala`);
  }
});

// «Ahora tú»: la respuesta rehecha aparte. Del enunciado cuando basta; de la figura cuando la pareja la dicen los arcos
// o las rayitas (idea 2).
const num = t => +String(t).replace(',', '.');
const valorLado = t => { const m = /^(\d+(?:,\d+)?)?(?:√(\d))? ?cm$/.exec(t.trim()); return m ? (m[1] ? num(m[1]) : 1) * (m[2] ? Math.sqrt(+m[2]) : 1) : NaN; };
const resolverLineal = (a1, b1, a2, b2) => (b2 - b1) / (a1 - a2);
const exprLin = t => { const m = /^(\d*)x ([+−]) (\d+)$/.exec(t.trim()); return m ? [m[1] ? +m[1] : 1, (m[2] === '−' ? -1 : 1) * +m[3]] : null; };
function rehacer3(i, c) {
  const q = plano(c.pregunta);
  let m;
  if (i.id === 'partes-correspondientes') {
    if ((m = /△ABC ≅ △(\w{3}), con AB = (\d+) cm, BC = (\d+) cm y AC = (\d+) cm\. ¿Cuánto mide (\w\w)\?/.exec(q))) {
      const [, per, ab, bc, ac, pide] = m, med = { AB: ab, BC: bc, AC: ac }, pos = pide.split('').map(x => per.indexOf(x)).sort().join('');
      return `${med[{ '01': 'AB', '12': 'BC', '02': 'AC' }[pos]]} cm`;
    }
    if ((m = /AD y BC se cortan en O, con OA = OD y OB = OC\. Si AB = (\d+)x − (\d+) y CD = x \+ (\d+)/.exec(q))) return `${+m[1] * ((+m[3] + +m[2]) / (+m[1] - 1)) - +m[2]} cm`;
    if ((m = /AB = AC\. D y E están en BC, con BD = EC\. Si m∠DAE = (\d+)°/.exec(q))) return `${(180 - +m[1]) / 2}°`;
    // De la figura: el lado o el ángulo con «?» de la copia, su pareja por marcas (arcos o rayitas) y lo de enfrente.
    if (!c.dibujo) return undefined;
    const fg = P.escena(c.dibujo.datos).fig, d = c.dibujo.datos, copia = fg.puntos.map(p => p.id).filter(x => 'DEF'.includes(x));
    const enfrente = (L, ids) => ids.find(x => !L.includes(x));
    if (/¿Cuánto mide [D-F]{2}\?/.test(q)) {
      const L2 = d.ladosRot.find(t => t.texto === '?'), V2 = enfrente([L2.de, L2.a], copia), k = fg.angulos.find(a => a.en === V2).marcas;
      const V = fg.angulos.find(a => 'ABC'.includes(a.en) && a.marcas === k).en, L = ['A', 'B', 'C'].filter(x => x !== V);
      return d.ladosRot.find(t => [t.de, t.a].sort().join('') === L.join('')).texto;
    }
    if ((m = /En ABC, (.+)\. ¿Cuánto mide el ángulo ([D-F])\?/.exec(q))) {
      const vals = Object.fromEntries([...m[1].matchAll(/m∠([A-C]) = (\d+)°/g)].map(x => [x[1], +x[2]])), V2 = m[2];
      const L2 = copia.filter(x => x !== V2).sort().join(''), k = d.llaves.find(l => [l.de, l.a].sort().join('') === L2).marcas;
      const L = d.llaves.find(l => 'ABC'.includes(l.de) && 'ABC'.includes(l.a) && l.marcas === k), V = enfrente([L.de, L.a], ['A', 'B', 'C']);
      return `${vals[V] !== undefined ? vals[V] : 180 - Object.values(vals).reduce((a, b) => a + b, 0)}°`;
    }
  }
  if (i.id === 'mediatriz-bisectriz') {
    if ((m = /con PA = (.+) y PB = (.+), en centímetros\. ¿Cuánto mide PA\?/.exec(q)) || (m = /PH = (.+) y PK = (.+), en centímetros\. ¿Cuánto mide PH\?/.exec(q))) {
      const [a1, b1] = exprLin(m[1]), [a2, b2] = exprLin(m[2]); return `${a1 * resolverLineal(a1, b1, a2, b2) + b1} cm`;
    }
    if ((m = /AB = (\d+) cm, BC = (\d+) cm y AC = (\d+) cm\. La mediatriz de AC corta BC/.exec(q))) return `${+m[1] + +m[2]} cm`;
    if ((m = /AB = (\d+) cm y AC = (\d+) cm\. Desde C se traza la perpendicular/.exec(q))) return `${+m[1] - +m[2]} cm`;
    if ((m = /P equidista de A y de B\. Si m∠PAB = (\d+)°/.exec(q))) return `${180 - 2 * +m[1]}°`;
  }
  if (i.id === 'base-media') {
    if ((m = /AB y AC, y MN = (\d+(?:,\d+)?) cm\. ¿Cuánto mide BC/.exec(q))) return `${Kit.formatear(2 * num(m[1]), 2)} cm`;
    if ((m = /AB y AC, y BC = (\d+) cm\. ¿Cuánto mide MN/.exec(q))) return `${Kit.formatear(+m[1] / 2, 2)} cm`;
    if ((m = /AC = (\d+) cm\. Por M se traza una paralela a BC/.exec(q))) return `${Kit.formatear(+m[1] / 2, 2)} cm`;
    if ((m = /Si MN = x \+ (\d+) y BC = (\d+)x − (\d+)/.exec(q))) { const x = (2 * +m[1] + +m[3]) / (+m[2] - 2); return `${x + +m[1]} cm`; }
    if ((m = /forman un triángulo de lados (.+)\. ¿Cuánto mide el perímetro de △ABC/.exec(q))) return `${Kit.formatear(2 * [...m[1].matchAll(/(\d+(?:,\d+)?) cm/g)].reduce((s, x) => s + num(x[1]), 0), 2)} cm`;
    if ((m = /tiene lados de (\d+) cm, (\d+) cm y (\d+) cm\. M, N y P/.exec(q))) return `${Kit.formatear((+m[1] + +m[2] + +m[3]) / 2, 2)} cm`;
    if ((m = /BC = (\d+) cm\. M y N son los puntos medios de AB y AC; Q y R/.exec(q))) return `${Kit.formatear(+m[1] / 4, 2)} cm`;
    if ((m = /m∠B = (\d+)°\. ¿Cuánto mide el ángulo AMN/.exec(q))) return `${m[1]}°`;
  }
  if (i.id === 'mediana-hipotenusa') {
    if ((m = /CM = (\d+(?:,\d+)?) cm\. ¿Cuánto mide AB/.exec(q))) return `${Kit.formatear(2 * num(m[1]), 2)} cm`;
    if ((m = /hipotenusa AB = (\d+) cm\. ¿Cuánto mide CM/.exec(q))) return `${Kit.formatear(+m[1] / 2, 2)} cm`;
    if ((m = /Si m∠([AB]) = (\d+)°, ¿cuánto mide el ángulo ([AB])CM/.exec(q))) return `${m[1] === m[3] ? +m[2] : 90 - +m[2]}°`;
    if ((m = /Si CM = x \+ (\d+) y AB = (\d+)x − (\d+)/.exec(q))) { const x = (2 * +m[1] + +m[3]) / (+m[2] - 2); return `${x + +m[1]} cm`; }
    if ((m = /m∠A = (\d+)°\. CM es la mediana relativa a la hipotenusa y CH/.exec(q))) return `${90 - 2 * +m[1]}°`;
    if ((m = /CM = (\d+) cm\. Si AC mide un número entero/.exec(q))) return `${2 * +m[1] - 1} cm`;
  }
  if (i.id === 'notables') {
    // Lados por trigonometría (sen y cos de los ángulos del notable; 37° y 53° con la convención 3-4-5).
    if ((m = /de (30° y 60°|45° y 45°), recto en C, (el cateto menor CA|el cateto mayor CB|el cateto CA|el cateto CB|la hipotenusa AB) mide (.+)\. ¿Cuánto mide (el cateto menor CA|el cateto mayor CB|el cateto CA|el cateto CB|la hipotenusa AB)\?/.exec(q))) {
      const a = m[1] === '30° y 60°' ? 30 : 45, r = { 'el cateto menor CA': Math.sin(a * RAD), 'el cateto CA': Math.sin(a * RAD), 'el cateto mayor CB': Math.cos(a * RAD), 'el cateto CB': Math.cos(a * RAD), 'la hipotenusa AB': 1 };
      return valorLado(m[3]) / r[m[2]] * r[m[4]];
    }
    if ((m = /mide (\d+) m y forma (37|53)° con el piso\. ¿A qué (altura|distancia)/.exec(q))) { const h = +m[1], sen = m[2] === '37' ? 3 / 5 : 4 / 5, cos = m[2] === '37' ? 4 / 5 : 3 / 5; return `${h * (m[3] === 'altura' ? sen : cos)} m`; }
    if ((m = /tiene lados de (.+), (.+), (.+)\. ¿Qué ángulos agudos/.exec(q))) {
      const [x, y, z] = [m[1], m[2], m[3]].map(valorLado).sort((p, q2) => p - q2);
      const ok = (p, q2) => Math.abs(p - q2) < 1e-9;
      if (!ok(x * x + y * y, z * z)) return 'Ninguno: no es notable';
      if (ok(x, y)) return '45° y 45°';
      if (ok(z, 2 * x)) return '30° y 60°';
      if (ok(y / x, 4 / 3)) return '37° y 53°';
      return 'Ninguno: no es notable';
    }
    if ((m = /AB = AC = (\d+) cm y m∠A = 120°/.exec(q))) return 2 * +m[1] * Math.sin(60 * RAD);
    if ((m = /m∠A = 45° y m∠C = (37|53)°\. La altura BH mide (\d+) cm/.exec(q))) { const h = +m[2], tanC = m[1] === '37' ? 3 / 4 : 4 / 3; return `${h + h / tanC} cm`; }
  }
  return undefined;
}
test('ideas 2 a 6, «Ahora tú»: cuatro opciones distintas, una correcta, tres códigos distintos, datos sin la respuesta y la respuesta rehecha aparte', () => {
  for (const i of IDEAS) {
    const tipos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const c = i.ahoraTu.generar(s), ops = c.opciones, d = `${i.id} semilla ${s}`;
      assert.equal(ops.length, 4, d);
      assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `${d}: opciones repetidas`);
      const bien = ops.filter(o => o.correcta);
      assert.equal(bien.length, 1, d);
      assert.equal(new Set(ops.filter(o => !o.correcta).map(o => o.error)).size, 3, `${d}: dos opciones con el mismo código (${ops.map(o => o.error).join(', ')})`);
      assert.ok(ops.filter(o => !o.correcta).every(o => /^GE-(CON|TRI|DT)\d+$/.test(o.error) && o.siFuera), d);
      const esp = rehacer3(i, c);
      assert.ok(esp !== undefined, `${d}: no pude leer «${plano(c.pregunta)}»`);
      if (typeof esp === 'number') assert.ok(Math.abs(valorLado(plano(bien[0].texto)) - esp) < 1e-9, `${d}: ${plano(bien[0].texto)} y no ${esp}`);
      else assert.equal(plano(bien[0].texto).replace(/\.0+ /, ' '), esp.replace(/\./, ','), `${d}: ${plano(c.pregunta)}`);
      assert.ok(Array.isArray(c.datos) && c.datos.length >= 1, d);
      const re = new RegExp(`(^|[^\\d,])${plano(bien[0].texto).replace(/[.*+?^${}()|[\]\\√]/g, '\\$&')}`);
      // (Si se elige un notable, los datos traen los tres entre los que se elige: molde §4.)
      if (/\d/.test(plano(bien[0].texto)) && !/^\d+° y \d+°$/.test(plano(bien[0].texto))) assert.ok(!c.datos.some(x => re.test(plano(x))), `${d}: los datos traen la respuesta`);
      tipos.add(s % (i.id === 'base-media' ? 6 : 5));
    }
    assert.equal(tipos.size, i.id === 'base-media' ? 6 : 5, i.id);
  }
});

test('ideas 2 a 6, «Así se resuelve» no repite «Ahora tú» y su respuesta se rehace aparte', () => {
  for (const i of IDEAS) for (let s = 0; s < 60; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado), resp = plano(r.respuesta), d = `${i.id} semilla ${s}`;
    assert.equal(rehacer3(i, { pregunta: r.enunciado, dibujo: r.dibujo }), undefined, `${d}: es un caso de «Ahora tú»`);
    let m;
    if ((m = /△ABC ≅ △(\w{3})\. Si m∠A = (\d)x − (\d+)°, m∠\w = x \+ (\d+)° y m∠\w = (\d+)°/.exec(q))) { const x = (+m[3] + +m[4]) / (+m[2] - 1); assert.ok(resp.includes(`${180 - (+m[2] * x - +m[3]) - +m[5]}°`), `${d}: ${resp}`); }
    else if ((m = /formando (\d+)°\. Una antena P/.exec(q))) assert.ok(resp.includes(`${+m[1] / 2}°`), d);
    else if ((m = /mediatriz de AB y m∠APB = (\d+)°/.exec(q))) assert.ok(resp.includes(`${(180 - +m[1]) / 2}°`), d);
    else if ((m = /y m∠C = (\d+)°\. ¿Cuánto mide el ángulo MNC/.exec(q))) assert.ok(resp.includes(`${180 - +m[1]}°`), d);
    else if ((m = /AB = (\d+) cm, AC = (\d+) cm y BC = (\d+) cm\. M y N/.exec(q))) assert.ok(resp.includes(`${Kit.formatear((+m[1] + +m[2] + +m[3]) / 2, 1)} cm`), `${d}: ${resp}`);
    else if ((m = /hipotenusa AB y m∠A = (\d+)°\. ¿Cuánto mide el ángulo BMC/.exec(q))) assert.ok(resp.includes(`${2 * +m[1]}°`), d);
    else if ((m = /AB = (\d+) cm y CB = (\d+) cm\. M es el punto medio de AB\. ¿Cuánto mide el perímetro de △BMC/.exec(q))) assert.ok(resp.includes(`${+m[1] + +m[2]} cm`), d);
    else if ((m = /30° y 60°, la hipotenusa mide (\d+) cm\. ¿Cuánto mide su perímetro/.exec(q))) assert.ok(resp.includes(`${3 * +m[1] / 2} + ${+m[1] / 2}√3 cm`), d);
    else if ((m = /cateto frente a (37|53)° mide (\d+) cm\. ¿Cuánto mide su perímetro/.exec(q))) assert.ok(resp.includes(`${12 * +m[2] / (m[1] === '37' ? 3 : 4)} cm`), d);
    else assert.fail(`${d}: no pude leer «${q}»`);
  }
});

test('ideas 4 y 5: las pruebas no usan paralelogramo, rectángulo ni circunferencia (vienen después en el curso)', () => {
  for (const i of def.ideas.filter(x => ['base-media', 'mediana-hipotenusa'].includes(x.id))) {
    const t = cadenas({ lee: i.lee, mira: i.mira.pasos, regla: [i.regla.texto, i.regla.condicion], ej: i.ejemplos.map(e => [e.enunciado, e.solucion, e.datos]) }).join(' ');
    assert.ok(!/paralelogramo|rect[aá]ngulo de diagonales|circunferencia|semicircunferencia|inscrito/i.test(t), i.id);
  }
});

test('ideas 2 a 6, notación: m∠, x sin «°», todo largo con su unidad', () => {
  for (const i of IDEAS) {
    const textos = cadenas({ lee: i.lee, juega: [i.juega.consigna, i.juega.mision, i.juega.leyenda], predice: i.predice, mira: i.mira.pasos, regla: [i.regla.texto, i.regla.condicion, i.regla.ecuacion],
      ejemplos: i.ejemplos.map(e => [e.enunciado, e.datos, e.solucion, e.respuesta, e.alternativas]) });
    for (let s = 0; s < 60; s++) { const c = i.ahoraTu.generar(s), r = i.resuelve.generar(s); textos.push(...cadenas([c.pregunta, c.datos, c.opciones, c.solucion, r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta])); }
    for (const t of new Set(textos)) {
      assert.ok(!/(^|[^m])∠[A-HKMNOPQR]{1,3} = \d/.test(t), `${i.id}: ángulo sin m∠: «${t}»`);
      assert.ok(!/\bx = \d+(,\d+)?°/.test(t), `${i.id}: x con «°»: «${t}»`);
      assert.ok(!/△PQR/.test(t), t);
      assert.ok(!/\b(?:AB|AC|BC|DE|DF|EF|PA|PB|PH|PK|MN|CM|BD|AN|NC|QR|HM|AD|CD|AH|BH|HC) = \d+(?:,\d+)?(?![\d,√k]| ?(?:cm|m|km)\b| ?[·+−x÷])/.test(t), `${i.id}: un largo sin unidad: «${t}»`);
    }
  }
});

test('glosario de las ideas 2 a 6: de 2 a 4 palabras con su aproximación por idea, tres ejemplos, y ninguna da la respuesta de su predicción', () => {
  const Glosario = require('../../../nucleo/glosario.js');
  const por = Glosario.porIdea(def);
  por.forEach((es, k) => { const n = es.filter(e => e.simple).length; assert.ok(n >= 2 && n <= 4, `${def.ideas[k].id}: ${n}`); });
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, g.termino);
  const txt = t => { const g = def.glosario.find(x => x.termino === t); return [g.def, g.simple || '', ...g.ejemplos].join(' '); };
  assert.ok(!/frente|enfrente/.test(txt('partes correspondientes')), 'el glosario dice qué lado va con cuál');
  assert.ok(!/bisectriz/.test(txt('distancia')) && !/2,5/.test(txt('distancia')), 'distancia');
  assert.ok(!/paralela|llega/.test(txt('base media')), 'base media');
  assert.ok(!/mitad|mediana/.test(txt('hipotenusa') + txt('cateto')), 'hipotenusa');
  assert.ok(!/√2|45/.test(txt('Pitágoras')), 'Pitágoras');
});
