// Pruebas propias de «Circunferencia y ángulos en ella» (geometria.circunferencia), etapa 7 del plan de calidad (19 nov
// 2026): las seis ideas contra su propuesta (docs/etapa7/propuesta-geometria.md). El validador con calidad 2;
// los juegos y sus misiones; la regla de colores en todas las figuras; los rótulos que caben; que ninguna figura traiga la
// respuesta; las figuras sin escala; las respuestas de «Ahora tú» y «Así se resuelve» rehechas leyendo el enunciado (con
// coordenadas y fuerza bruta, sin las cuentas de la unidad); toda igualdad escrita es cierta; el glosario no delata.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./circunferencia.js');

const P = Kit.piezas['geo-objeto'], G = Kit.piezas['geo-figura'];
const SEMILLAS = 400;
const plano = x => Teoria.plano(x);
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const C = require('../../../catalogo/cursos/geometria.json');
const FICHA = C.unidades.find(u => u.id === def.unidad), TEMAS = FICHA.temas;
const RAD = Math.PI / 180;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/[  ]/g, '').replace(',', '.');
const NO_ESC = 'El dibujo no está a escala.';
const idea = id => def.ideas.find(i => i.id === id);
const pol = (g, r = 1, c = [0, 0]) => [c[0] + r * Math.cos(g * RAD), c[1] + r * Math.sin(g * RAD)];
const ang = (V, A, B) => { const u = [A[0] - V[0], A[1] - V[1]], w = [B[0] - V[0], B[1] - V[1]]; return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))))) / RAD; };
const corte = (A, B, Cc, D) => { const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - Cc[0], D[1] - Cc[1]], den = r[0] * s[1] - r[1] * s[0], t = ((Cc[0] - A[0]) * s[1] - (Cc[1] - A[1]) * s[0]) / den; return [A[0] + r[0] * t, A[1] + r[1] * t]; };

test('las seis ideas de la propuesta, en orden, con los seis id de antes; las tres mesas; la ficha pide Polígonos', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['tangentes', 'poncelet-pitot', 'posiciones', 'inscrito', 'interior-exterior', 'cuadrilatero-inscrito']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['dos-libres', 'inscrito-libre', 'cuadrilatero-libre']);
  assert.ok(def.ideas.every(i => Teoria.palabras(i.titulo) <= 6));
  assert.deepEqual(FICHA.requiere, ['geometria.poligonos-y-cuadrilateros']);
  // geo-circunferencia-metrica sigue: también sirve a Relaciones métricas y su ficha cubre las dos unidades.
  assert.deepEqual(FICHA.plantillas, ['geo-circunferencia', 'angulo-inscrito', 'geo-circunferencia-metrica']);
  const p = Teoria.problemas(def, { temas: TEMAS, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('la unidad lleva calidad 2, pasa el validador sin excepciones y cada idea trae 15 ejemplos', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: TEMAS, semillas: 200 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), []);
  const letras = {};
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === nv).length, 5, `${i.id} nivel ${nv}`);
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.equal(e.alternativas.length, 5, e.titulo);
      assert.ok(e.solucion.length >= 2, `${e.titulo}: un nivel 3 no se resuelve en una línea`);
      const sol = sinDuros(e.solucion.map(x => plano(x.texto) + ' ' + plano(x.ecuacion || '')).join(' '));
      const resp = sinDuros(plano(e.respuesta));
      const esta = (txt, a) => new RegExp(`(^|[^\\d,])${sinDuros(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\d|,\\d)`).test(txt);
      const buenas = e.alternativas.filter(a => esta(resp, a) || esta(resp, sinDuros(a).replace(/ cm$/, '')));
      assert.equal(buenas.length, 1, `${e.titulo}: una sola alternativa es la respuesta (${buenas})`);
      for (const a of e.alternativas.filter(x => x !== buenas[0])) assert.ok(esta(sol, sinDuros(a).replace(/ cm$/, '')), `${i.id} «${e.titulo}»: el resuelto no dice nada de «${a}»`);
      assert.ok(!/\b(alternativa|opción|respuesta:?)\s+[A-E]\b/i.test(sol + resp), `${e.titulo}: nombra una alternativa por su letra`);
      const L = 'ABCDE'[e.alternativas.indexOf(buenas[0])];
      letras[L] = (letras[L] || 0) + 1;
    }
  }
  for (const L of 'ABCDE') assert.ok(letras[L] >= 4 && letras[L] <= 8, JSON.stringify(letras));
});

// ---------- Los juegos ----------
const grilla = c => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6)));
function casosJuego(j) { let all = [{}]; for (const c of j.controles) all = all.flatMap(v => grilla(c).map(x => Object.assign({}, v, { [c.id]: x }))); return all; }
test('las misiones: sin cumplir al abrir; se cumplen justo donde dice la propuesta (la del tanque, una sola altura)', () => {
  const esperado = { tangentes: v => v.h === 20, 'poncelet-pitot': v => v.d === 26, posiciones: v => v.d === 20, inscrito: v => v.arco === 130, 'interior-exterior': v => v.a + v.b === 150, 'cuadrilatero-inscrito': v => v.fi === 200 };
  for (const i of def.ideas) {
    const j = i.juega, ini = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
    assert.equal(j.mision.logrado(ini), false, i.id);
    for (const v of casosJuego(j)) assert.equal(j.mision.logrado(v), esperado[i.id](v), `${i.id} ${JSON.stringify(v)}`);
  }
  assert.equal(casosJuego(idea('tangentes').juega).filter(v => idea('tangentes').juega.mision.logrado(v)).length, 1);
});
const ptsDe = F => Object.fromEntries(P.escena(F).fig.puntos.map(q => [q.id, [q.x, q.y]]));
test('las lecturas del juego dicen una relación verdadera en toda la grilla (medida en la figura)', () => {
  for (const v of casosJuego(idea('tangentes').juega)) {
    const p = ptsDe(idea('tangentes').juega.dibujo(v).datos), l = sinDuros(plano(idea('tangentes').juega.lectura(v)));
    const ab = Math.hypot(p.A[0] - p.B[0], p.A[1] - p.B[1]) * 50 / 3;   // el radio, 3 en el plano, es 50 cm
    const m = /AM = MB (=|≈) ([\d,]+) cm: AB (=|≈) ([\d,]+) cm/.exec(l);
    assert.ok(m && casi(num(m[2]), ab / 2, 0.051) && casi(num(m[4]), ab, 0.051), `${JSON.stringify(v)}: ${l}`);
    if (p.M) assert.ok(casi(Math.hypot(p.A[0] - p.M[0], p.A[1] - p.M[1]), Math.hypot(p.B[0] - p.M[0], p.B[1] - p.M[1])), 'M en el medio');
  }
  for (const v of casosJuego(idea('poncelet-pitot').juega)) {
    const p = ptsDe(idea('poncelet-pitot').juega.dibujo(v).datos), l = sinDuros(plano(idea('poncelet-pitot').juega.lectura(v)));
    const ae = Math.hypot(p.A[0] - p.E[0], p.A[1] - p.E[1]) / 0.2, ah = Math.hypot(p.A[0] - p.H[0], p.A[1] - p.H[1]) / 0.2;
    assert.ok(casi(ae, ah) && casi(Math.hypot(p.O[0] - p.E[0], p.O[1] - p.E[1]) / 0.2, 10), JSON.stringify(v));
    const m = /AE = AH (=|≈) ([\d,]+) cm, con OA = (\d+) cm/.exec(l);
    assert.ok(m && casi(num(m[2]), ae, 0.051) && +m[3] === v.d, l);
  }
  const posicion = (d, r1, r2) => (d === 0 ? 'mismo centro' : d > r1 + r2 ? 'no se tocan, una fuera de la otra' : d === r1 + r2 ? 'se tocan por fuera en un punto' : d > r1 - r2 ? 'se cortan en dos puntos' : d === r1 - r2 ? 'se tocan por dentro en un punto' : 'no se tocan, una dentro de la otra');
  for (const v of casosJuego(idea('posiciones').juega)) assert.equal(sinDuros(plano(idea('posiciones').juega.lectura(v))), `d = ${v.d} cm: ${posicion(v.d, 40, 20)}`);
  for (const v of casosJuego(idea('inscrito').juega)) {
    const p = ptsDe(idea('inscrito').juega.dibujo(v).datos), medido = ang(p.P, p.A, p.B), l = sinDuros(plano(idea('inscrito').juega.lectura(v)));
    assert.ok(casi(medido, v.arco / 2, 1e-6) && l === `arco AB = ${v.arco}°: ∠APB = ${Kit.formatear(v.arco / 2, 1)}°, esté donde esté P`, `${JSON.stringify(v)} ${l}`);
  }
  for (const v of casosJuego(idea('interior-exterior').juega)) {
    const p = ptsDe(idea('interior-exterior').juega.dibujo(v).datos), medido = ang(p.Q, p.A, p.B), l = sinDuros(plano(idea('interior-exterior').juega.lectura(v)));
    assert.ok(casi(medido, (v.a + v.b) / 2, 1e-6) && l.endsWith(`∠AQB = ${Kit.formatear(medido, 1)}°`), l);
  }
  for (const v of casosJuego(idea('cuadrilatero-inscrito').juega)) {
    const p = ptsDe(idea('cuadrilatero-inscrito').juega.dibujo(v).datos), B = ang(p.B, p.A, p.C), D = ang(p.D, p.A, p.C), l = sinDuros(plano(idea('cuadrilatero-inscrito').juega.lectura(v)));
    assert.ok(casi(B + D, 180, 1e-6) && l === `m∠B = ${Kit.formatear(B, 1)}° y m∠D = ${Kit.formatear(D, 1)}°: suman 180°`, l);
  }
});

// ---------- Todas las figuras ----------
function figuras(N = SEMILLAS) {
  const out = [], toma = (donde, dib, o = {}) => { if (dib && dib.datos && dib.datos.objeto) out.push(Object.assign({ donde, datos: dib.datos, estado: dib.estado || {} }, o)); };
  for (const i of def.ideas) {
    for (const v of casosJuego(i.juega)) toma(`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    for (const [k, t] of i.lee.tarjetas.entries()) toma(`${i.id} lee ${k + 1}`, t.dibujo);
    toma(`${i.id} predice`, i.predice.dibujo, { ejercicio: true, texto: plano(i.predice.pregunta), respuesta: plano(i.predice.opciones.find(o => o.correcta).texto) });
    toma(`${i.id} revelar`, i.predice.revelar);
    i.mira.pasos.forEach((p, k) => toma(`${i.id} mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }));
    if (i.regla.dibujo) toma(`${i.id} regla`, i.regla.dibujo);
    i.ejemplos.forEach((e, k) => toma(`${i.id} ejemplo ${k + 1}`, e.figura, { ejercicio: true, texto: plano(e.enunciado), respuesta: plano(e.respuesta) }));
    for (let s = 0; s < N; s += 4) {
      const r = i.resuelve.generar(s);
      toma(`${i.id} resuelve ${s}`, r.dibujo, { ejercicio: true, texto: plano(r.enunciado), respuesta: plano(r.respuesta) });
      const a = i.ahoraTu.generar(s);
      toma(`${i.id} ahora tú ${s}`, a.dibujo, { ejercicio: true, texto: plano(a.pregunta), respuesta: plano(a.opciones.find(o => o.correcta).texto) });
    }
  }
  for (const m of def.laboratorio) for (const v of casosJuego(m)) toma(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v));
  return out;
}
const FIGS = figuras();
const corteDe = it => (it.estado.corte === undefined ? Infinity : it.estado.corte);
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

test('hay figuras de sobra (la prueba no corre en vacío)', () => assert.ok(FIGS.length > 600, `${FIGS.length}`));

test('colores de la unidad: nunca violeta ni verde en una figura; ángulos en carmín o tinta; lo pedido («?») en tinta', () => {
  for (const it of FIGS) {
    const s = P.dibujar(it.datos, it.estado);
    assert.ok(!/var\(--c-f\)/.test(s), `${it.donde}: violeta en una figura`);
    assert.ok(!/var\(--c-d\)/.test(s), `${it.donde}: verde en una figura`);
    const fg = P.escena(it.datos).fig;
    for (const an of fg.angulos || []) assert.ok(an.color === undefined || an.color === 'h', `${it.donde}: ángulo de color ${an.color}`);
    for (const sg of fg.segmentos || []) assert.ok(!sg.marcas, `${it.donde}: una marca de igualdad sobre el lado (va sobre una llave)`);
    for (const an of fg.angulos || []) if (an.texto === '?') assert.equal(an.color, undefined, `${it.donde}: «?» de color`);
    for (const l of it.datos.ladosRot || []) if (l.texto === '?' || / = \?$/.test(l.texto)) assert.equal(l.color, undefined, `${it.donde}: «?» de color`);
  }
});

test('todos los rótulos caben: ninguno se sale, pisa otro, una letra, un trazo, un arco ni el borde de una circunferencia', () => {
  for (const it of FIGS) assert.ok(P.escenaCabe(it.datos, corteDe(it)), `${it.donde}: un rótulo no cabe`);
});

test('ninguna figura de un ejercicio trae su respuesta escrita', () => {
  for (const it of FIGS.filter(x => x.ejercicio)) {
    const s = P.dibujar(it.datos, it.estado), tx = textosSVG(s).map(sinDuros), enun = sinDuros(it.texto);
    for (const m of sinDuros(it.respuesta).matchAll(/\d+(?: \d{3})*(?:,\d+)?/g)) {
      const n = m[0];
      if (enun.includes(n) || n.length < 2) continue;
      assert.ok(!tx.some(t => new RegExp(`(^|[^\\d,])${n}([^\\d,]|$)`).test(t)), `${it.donde}: la figura escribe ${n} (${tx.join(' | ')})`);
    }
  }
});

test('escala: «El dibujo no está a escala» va con su figura sin escala; con escala, cada ángulo rotulado mide lo que dice', () => {
  for (const it of FIGS.filter(x => x.ejercicio)) {
    const sin = !!it.datos.sinEscala, dice = sinDuros(it.texto).includes(NO_ESC);
    assert.equal(sin, dice, `${it.donde}: sinEscala ${sin} y el texto ${dice ? 'lo dice' : 'no lo dice'}`);
    const fg = P.escena(it.datos).fig, p = Object.fromEntries(fg.puntos.map(q => [q.id, [q.x, q.y]]));
    if (!sin) for (const an of fg.angulos || []) { const m = /^(\d+(?:,\d+)?)°$/.exec(String(an.texto || '')); if (m) assert.ok(Math.abs(ang(p[an.en], p[an.de], p[an.a]) - num(m[1])) < 0.6, `${it.donde}: «${an.texto}»`); }
    // Con escala o sin ella, el ángulo pedido («?») no se dibuja con el valor de la respuesta.
    const r = /(\d+(?:,\d+)?)°/.exec(sinDuros(it.respuesta));
    if (r) for (const an of (fg.angulos || []).filter(a => a.texto === '?')) assert.ok(Math.abs(ang(p[an.en], p[an.de], p[an.a]) - num(r[1])) >= 7.9, `${it.donde}: el «?» se dibuja con la respuesta`);
  }
});

test('los dibujos de prueba: el objeto de cada primera pantalla va marcado como prueba', () => {
  const tipos = { tangentes: 'tanque', 'poncelet-pitot': 'bandeja', posiciones: 'luces', inscrito: 'pileta', 'interior-exterior': 'veredas', 'cuadrilatero-inscrito': 'pileta' };
  for (const i of def.ideas) {
    const d = i.juega.dibujo(Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]))).datos;
    assert.equal(d.objeto, 'redondo'); assert.equal(d.tipo, tipos[i.id], i.id);
    assert.match(P.dibujar(d, {}), /data-objeto="redondo" data-prueba="si"/);
  }
});

// ---------- «Ahora tú» y «Así se resuelve» rehechos desde el texto ----------
// Cada caso se rehace con coordenadas o fuerza bruta, sin las fórmulas de la unidad.
const pit = (h, c) => Math.sqrt(h * h - c * c);
const inscritoDe = arco => ang(pol(arco + (360 - arco) / 2), pol(0), pol(arco));        // P en el otro arco
function exteriorDe(L, c) { const A = pol(180 - L / 2), D = pol(180 + L / 2), B = pol(c / 2), Cc = pol(-c / 2); return ang(corte(A, B, D, Cc), A, D); }
// Dos tangentes en los extremos del arco cercano c: su corte Q y el ángulo, medidos.
function tangentesDe(c) { const T1 = pol(c / 2), T2 = pol(-c / 2), Q = corte(T1, [T1[0] - T1[1], T1[1] + T1[0]], T2, [T2[0] - T2[1], T2[1] + T2[0]]); return ang(Q, T1, T2); }
function interiorDe(a, b) { const A = pol(90 + a / 2), B = pol(90 - a / 2), Cc = pol(270 + b / 2), D = pol(270 - b / 2); return ang(corte(A, Cc, B, D), A, B); }
const resolver = (f, lo, hi, paso = 1) => { for (let x = lo; x <= hi; x += paso) if (f(x)) return x; return undefined; };
function rehacer(t) {
  t = sinDuros(t);
  let m;
  if ((m = /tiene (\d+) cm de radio\. La cuerda AB está a (\d+) cm del centro/.exec(t))) return 2 * pit(+m[1], +m[2]);
  if ((m = /de (\d+) cm de radio, la cuerda AB mide (\d+) cm\. ¿A qué distancia/.exec(t))) return pit(+m[1], +m[2] / 2);
  if ((m = /la superficie del agua mide (\d+) cm de ancho y el agua llega a (\d+) cm de alto/.exec(t))) { const c = +m[1], h = +m[2]; return resolver(r => casi(r * r, (c / 2) ** 2 + (r - h) ** 2), 1, 400); }
  if ((m = /a (\d+) cm del centro O de una circunferencia de (\d+) cm de radio, se traza la tangente PT/.exec(t))) return pit(+m[1], +m[2]);
  if ((m = /a (\d+) cm del centro O de una circunferencia, la tangente PT mide (\d+) cm\. ¿Cuánto mide el radio/.exec(t))) return pit(+m[1], +m[2]);
  if ((m = /forman un ángulo m∠AOB = (\d+)°\. ¿Cuánto mide m∠OAB/.exec(t))) { const O = [0, 0], A = pol(0, 5), B = pol(+m[1], 5); return ang(A, O, B); }
  if ((m = /m∠OAB = (\d+)°\. ¿Cuánto mide m∠AOB/.exec(t))) return resolver(g => casi(ang(pol(0, 5), [0, 0], pol(g, 5)), +m[1], 1e-6), 1, 179);
  if ((m = /tanque cilíndrico de (\d+) cm de diámetro está echado en el piso, con agua hasta (\d+) cm de alto/.exec(t))) { const r = +m[1] / 2; return 2 * pit(r, r - +m[2]); }
  if ((m = /AB = (\d+) cm, BC = (\d+) cm y CD = (\d+) cm\. ¿Cuánto mide DA/.exec(t))) return resolver(da => +m[1] + +m[3] === +m[2] + da, 1, 200);
  if ((m = /AB = (\d+) cm, BC = (\d+) cm y DA = (\d+) cm\. ¿Cuánto mide CD/.exec(t))) return resolver(cd => +m[1] + cd === +m[2] + +m[3], 1, 200);
  if ((m = /triángulo ABC toca BC en D\. AB = (\d+) cm, BC = (\d+) cm y CA = (\d+) cm/.exec(t))) {
    // Con coordenadas: el incentro y su pie en BC.
    const AB = +m[1], BC = +m[2], CA = +m[3], x = (AB * AB - CA * CA + BC * BC) / (2 * BC), A = [x, Math.sqrt(AB * AB - x * x)];
    return (BC * A[0] + CA * 0 + AB * BC) / (AB + BC + CA);
  }
  if ((m = /catetos de (\d+) cm y (\d+) cm, e hipotenusa de (\d+) cm\. ¿Cuánto mide el radio/.exec(t))) { const a = +m[1], b = +m[2]; return a * b / (a + b + +m[3]); }
  if ((m = /P está a (\d+) cm del centro de una circunferencia de (\d+) cm de radio\. Las tangentes/.exec(t))) return 2 * pit(+m[1], +m[2]);
  if ((m = /bases de (\d+) cm y (\d+) cm, y sus cuatro lados tocan una circunferencia\. ¿Cuánto mide cada lado/.exec(t))) return resolver(l => 2 * l === +m[1] + +m[2], 0.5, 200, 0.5);
  if ((m = /bases de (\d+) cm y (\d+) cm, y sus cuatro lados tocan una circunferencia\. ¿Cuánto mide el radio/.exec(t))) { const B = +m[1], b = +m[2], l = (B + b) / 2; return pit(l, (B - b) / 2) / 2; }
  if ((m = /radios de (\d+) cm y (\d+) cm, y sus centros están a (\d+) cm\. ¿Cuál es su posición/.exec(t))) {
    const r1 = +m[1], r2 = +m[2], d = +m[3];
    // Fuerza bruta: cuántos puntos comparten las dos circunferencias (muestreadas) y si una queda adentro.
    let toca = 0; for (let k = 0; k < 3600; k++) { const p = pol(k / 10, r1), e = Math.abs(Math.hypot(p[0] - d, p[1]) - r2); if (e < 1e-9) toca++; }
    return d > r1 + r2 ? 'Exteriores' : d === r1 + r2 ? 'Tangentes exteriores' : d > r1 - r2 ? 'Secantes' : d === r1 - r2 ? 'Tangentes interiores' : 'Interiores';
  }
  if ((m = /de (\d+) cm y (\d+) cm de radio son tangentes (exteriores|interiores)\. ¿A qué distancia/.exec(t))) return m[3] === 'exteriores' ? +m[1] + +m[2] : +m[1] - +m[2];
  if ((m = /tangentes (exteriores|interiores) y sus centros están a (\d+) cm\. La (?:primera|grande) tiene (\d+) cm de radio/.exec(t))) return m[1] === 'exteriores' ? +m[2] - +m[3] : +m[3] - +m[2];
  if ((m = /distancias entre sus centros son (\d+) cm, (\d+) cm y (\d+) cm\. ¿Cuánto mide el radio de la rueda más (chica|grande)/.exec(t))) {
    const [a, b, c] = [+m[1], +m[2], +m[3]];
    for (let x = 1; x < 30; x++) for (let y = x; y < 30; y++) for (let z = y; z < 30; z++) if (x + y === a && x + z === b && y + z === c) return m[4] === 'chica' ? x : z;
  }
  if ((m = /poleas de (\d+) cm y (\d+) cm de radio tienen sus centros a (\d+) cm/.exec(t))) return pit(+m[3], +m[1] - +m[2]);
  if ((m = /El arco AB que abarca el ángulo APB mide (\d+)°/.exec(t))) return inscritoDe(+m[1]);
  if ((m = /Un ángulo inscrito mide (\d+)°\. ¿Cuánto mide el arco/.exec(t))) return resolver(a => casi(inscritoDe(a), +m[1]), 1, 359);
  if ((m = /el inscrito APB mide (\d+)°\. ¿Cuánto mide el central AOB/.exec(t))) return resolver(a => casi(inscritoDe(a), +m[1]), 1, 359);
  if ((m = /el ángulo central AOB mide (\d+)°\. P está en el arco mayor AB, del otro lado de la cuerda AB/.exec(t))) return inscritoDe(+m[1]);
  if ((m = /forman un ángulo que abarca un arco de (\d+)°\. ¿Cuánto mide ese ángulo/.exec(t))) { const A = pol(270), B = pol(270 + +m[1]), tg = [A[0] + 1, A[1]]; return ang(A, tg, B); }
  if ((m = /el menor mide (\d+)°\. P está en el arco menor/.exec(t))) { const a = +m[1]; return ang(pol(a / 2), pol(0), pol(a)); }
  if ((m = /AB es un diámetro\. Si m∠CAB = (\d+)°/.exec(t))) { const A = pol(180), B = pol(0), Cc = pol(2 * +m[1]); return ang(B, Cc, A); }
  if ((m = /La tangente en A y la cuerda AB forman un ángulo de (\d+)x \+ (\d+)°, y el arco que abarca mide (\d+)x − (\d+)°/.exec(t))) { const x = resolver(x => 2 * (+m[1] * x + +m[2]) === +m[3] * x - +m[4], 0, 200); return +m[1] * x + +m[2]; }
  if ((m = /El arco AB mide (\d+)° y el arco CD, (\d+)°\. ¿Cuánto mide m∠AQB/.exec(t))) return interiorDe(+m[1], +m[2]);
  if ((m = /arco lejano de (\d+)° y uno cercano de (\d+)°/.exec(t))) return exteriorDe(+m[1], +m[2]);
  if ((m = /El arco cercano entre los puntos de contacto mide (\d+)°/.exec(t))) return tangentesDe(+m[1]);
  if ((m = /El arco lejano entre los puntos de contacto mide (\d+)°/.exec(t))) return tangentesDe(360 - +m[1]);
  if ((m = /forman un ángulo de (\d+)°\. Ese ángulo abarca un arco de (\d+)°/.exec(t))) return resolver(b => casi(interiorDe(+m[2], b), +m[1]), 1, 359);
  if ((m = /salen dos secantes que forman un ángulo de (\d+)°\. El arco lejano mide (\d+)°/.exec(t))) return resolver(c => casi(exteriorDe(+m[2], c), +m[1]), 1, 359);
  if ((m = /inscrito en una circunferencia\. (?:Si )?m∠([ABCD]) = (\d+)° y m∠([ABCD]) = (\d+)°[.,] ¿cuánto mide m∠([ABCD])\?/i.exec(t))) {
    // Cuatro puntos en una circunferencia con esos ángulos: se busca por fuerza bruta el arco de cada lado (de 2 en 2 grados).
    const dado = { [m[1]]: +m[2], [m[3]]: +m[4] }, pide = m[5];
    for (let a = 2; a < 360; a += 2) for (let b = 2; a + b < 360; b += 2) for (let c = 2; a + b + c < 360; c += 2) {
      const A = pol(0), B = pol(a), Cc = pol(a + b), D = pol(a + b + c), V = { A: ang(A, D, B), B: ang(B, A, Cc), C: ang(Cc, B, D), D: ang(D, Cc, A) };
      if (Object.entries(dado).every(([k, v]) => casi(V[k], v, 1e-6))) return V[pide];
    }
    return 'sin caso';
  }
  if ((m = /m∠A = (\d)?x \+ (\d+)° y m∠C = (\d)?x \+ (\d+)°, con x en grados/.exec(t))) { const p = +(m[1] || 1), q = +(m[3] || 1), x = resolver(x => p * x + +m[2] + q * x + +m[4] === 180, 0, 200); return p * x + +m[2]; }
  if ((m = /m∠A = (\d+)° y m∠C = (\d+)°\. ¿Se puede inscribir/.exec(t))) return +m[1] + +m[2] === 180 ? 'sí' : 'no';
  if ((m = /y m∠A = (\d+)°\. Se prolonga BC más allá de C/.exec(t))) { const a = +m[1]; return 180 - (180 - a); }
  if ((m = /todos a (\d+) cm de un punto O\. Si m∠B = (\d+)°/.exec(t))) return 180 - +m[2];
  return undefined;
}
const valorDe = txt => { const s = sinDuros(plano(txt)); if (/^(Sí|No)(?=[:\s])/.test(s)) return s.startsWith('Sí') ? 'sí' : 'no'; if (/^[A-ZÁÉ][a-zá]/.test(s) && !/\d/.test(s)) return s; return num((/[\d ,]+/.exec(s) || ['NaN'])[0].trim()); };

test('«Ahora tú»: cada respuesta rehecha desde el texto, una sola correcta, cuatro opciones distintas, sin repetir un ejemplo', () => {
  for (const i of def.ideas) {
    const firmas = new Set(i.ejemplos.map(e => sinDuros(plano(e.enunciado))));
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), r = rehacer(q);
      assert.notEqual(r, undefined, `${i.id} ${s}: no sé rehacer «${q}»`);
      const ok = a.opciones.filter(o => o.correcta);
      assert.equal(ok.length, 1, `${i.id} ${s}`);
      const vc = valorDe(ok[0].texto);
      assert.ok(typeof r === 'string' ? r === vc : casi(r, vc, 0.051), `${i.id} ${s}: «${q}» da ${r} y la correcta dice ${ok[0].texto}`);
      assert.equal(new Set(a.opciones.map(o => sinDuros(o.texto))).size, a.opciones.length, `${i.id} ${s}: opciones repetidas`);
      assert.ok(a.opciones.length >= 4, `${i.id} ${s}`);
      for (const o of a.opciones.filter(x => !x.correcta)) {
        assert.ok(!(typeof r === 'string' ? r === valorDe(o.texto) : casi(r, valorDe(o.texto), 1e-6)), `${i.id} ${s}: el distractor «${o.texto}» vale la respuesta`);
        assert.ok(o.error && o.siFuera && o.siFuera.length > 10, `${i.id} ${s}: distractor sin error o sin explicación`);
      }
      assert.ok(!firmas.has(sinDuros(q)), `${i.id} ${s}: repite un ejemplo`);
    }
  }
});

test('«Así se resuelve»: la respuesta sale del enunciado (200 semillas), con sus pasos de siempre', () => {
  for (const i of def.ideas) for (let s = 0; s < 200; s++) {
    const r = i.resuelve.generar(s), e = sinDuros(plano(r.enunciado)), resp = sinDuros(plano(r.respuesta));
    const esp = rehacer(e);
    assert.notEqual(esp, undefined, `${i.id} ${s}: no sé rehacer «${e}»`);
    if (typeof esp === 'string') assert.ok(resp.toLowerCase().includes(esp.toLowerCase()), `${i.id} ${s}: «${e}» da ${esp} y dice «${resp}»`);
    else { const v = num((/(\d+(?: \d{3})*(?:,\d+)?)(?!.*\d)/.exec(resp) || [, 'NaN'])[1]); assert.ok(casi(v, esp, 0.051), `${i.id} ${s}: «${e}» da ${esp} y la respuesta dice «${resp}»`); }
    assert.ok(r.pasos.length >= 3 && r.pasos[0].tipo === 'pide' && r.pasos.some(p => p.tipo === 'regla') && r.pasos.some(p => p.tipo === 'cuentas'), `${i.id} ${s}`);
  }
});

test('«Así se resuelve» no repite un ejemplo ni un «Ahora tú» (400 semillas)', () => {
  for (const i of def.ideas) {
    const ej = new Set(i.ejemplos.map(e => sinDuros(plano(e.enunciado)))), at = new Set();
    for (let s = 0; s < SEMILLAS; s++) at.add(sinDuros(plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < SEMILLAS; s++) { const e = sinDuros(plano(i.resuelve.generar(s).enunciado)); assert.ok(!ej.has(e) && !at.has(e), `${i.id} ${s}: «${e}»`); }
  }
});

// ---------- Toda igualdad escrita es cierta ----------
function textosUnidad() {
  const out = [], mete = (donde, x) => { if (x !== undefined && x !== null) out.push({ donde, t: sinDuros(plano(x)) }); };
  for (const i of def.ideas) {
    for (const t of i.lee.tarjetas) mete(`${i.id} lee`, [t.texto, ' ', t.ecuacion || '']);
    mete(`${i.id} misión`, [i.juega.mision.texto, ' ', i.juega.mision.bien]);
    for (const v of casosJuego(i.juega)) mete(`${i.id} lectura ${JSON.stringify(v)}`, i.juega.lectura(v));
    mete(`${i.id} predice`, [i.predice.pregunta, ' ', i.predice.coincide, ' ', i.predice.noCoincide]);
    for (const p of i.mira.pasos) mete(`${i.id} mira`, [p.texto, ' ', p.ecuacion || '']);
    mete(`${i.id} regla`, [i.regla.texto, ' ', i.regla.ecuacion]);
    for (const e of i.ejemplos) { mete(`${i.id} «${e.titulo}»`, e.enunciado); for (const l of e.solucion) mete(`${i.id} «${e.titulo}»`, [l.texto, '   ', l.ecuacion || '']); }
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s); mete(`${i.id} ahora tú ${s}`, [a.pregunta, '   ', a.solucion.texto, '   ', a.solucion.ecuacion || '']);
      for (const o of a.opciones) if (o.siFuera) mete(`${i.id} ahora tú ${s} ${o.id}`, o.siFuera);
    }
    for (let s = 0; s < 200; s++) { const r = i.resuelve.generar(s); for (const p of r.pasos) mete(`${i.id} resuelve ${s}`, [p.texto, '   ', p.ecuacion || '']); }
  }
  for (const g of def.glosario) mete(`glosario ${g.termino}`, [g.def, ' ', ...(g.ejemplos || [])]);
  return out;
}
test('toda cuenta numérica escrita («a op b = c», en cadena) es cierta', () => {
  let n = 0;
  for (const { donde, t } of textosUnidad()) {
    for (const m of t.matchAll(/(?<!(?:[\d,∠A-Za-zx(]|\) [·÷] ))((?:\d+(?: \d{3})*(?:,\d+)?°? [−+·÷] )+\d+(?: \d{3})*(?:,\d+)?°?) = (\d+(?: \d{3})*(?:,\d+)?)(?![\d,]|°? [−+·÷])/g)) {
      const e = m[1].replace(/°/g, '').replace(/(\d) (\d{3})/g, '$1$2').replace(/,/g, '.').replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/');
      const r = Function(`return (${e})`)(); n++;
      assert.ok(casi(r, num(m[2]), 1e-6), `${donde}: «${m[0]}» en «${t}»`);
    }
    for (const m of t.matchAll(/(\d+)² ([−+]) (\d+)² = (\d+(?: \d{3})*)(?![\d,]| [−+·÷]| \d)/g)) { n++; const r = m[2] === '+' ? (+m[1]) ** 2 + (+m[3]) ** 2 : (+m[1]) ** 2 - (+m[3]) ** 2; assert.equal(r, num(m[4]), `${donde}: «${m[0]}»`); }
  }
  assert.ok(n > 2000, `${n} cuentas`);
});

test('el glosario no dice la respuesta ni la medida de ninguna predicción; «circunferencia», «radio» y «diámetro» se mudaron aquí', () => {
  const txt = t => { const g = def.glosario.find(x => x.termino === t); return sinDuros([g.def, g.simple || '', ...(g.ejemplos || [])].join(' ')); };
  for (const g of def.glosario) {
    const t = sinDuros([g.def, g.simple || '', ...(g.ejemplos || [])].join(' '));
    assert.ok(!/la mitad|semisuma|semidiferencia|suman 180|\b36 cm\b|\b60 cm\b/.test(t), `${g.termino}: ${t}`);
  }
  assert.ok(!/misma distancia del centro miden|igual de lejos/.test(txt('cuerda') + txt('circunferencia') + txt('radio')));
  assert.ok(!/r₁|r₂|suma|resta/.test(txt('tangentes exteriores') + txt('tangentes interiores') + txt('circunferencias secantes')));
  const cong = require('./congruencia.js');
  for (const t of ['circunferencia', 'radio', 'diámetro']) { assert.ok(def.glosario.some(g => g.termino === t), t); assert.ok(!cong.glosario.some(g => g.termino === t), `Congruencia sigue definiendo «${t}»`); }
});

test('no adelanta Relaciones métricas ni Longitud y áreas circulares: sin teorema de la tangente, π, áreas ni semejanza', () => {
  const todo = textosUnidad().map(x => x.t).join(' ');
  assert.ok(!/PA · PB|π|área|semejan|potencia de un punto/i.test(todo));
});

// ---------- Auditoría y lectores en frío (cierre, 19 nov; rutinas/auditoria/geometria.circunferencia.md) ----------
const ptsFig = d => Object.fromEntries((d.figura.puntos || []).map(q => [q.id, [q.x, q.y]]));
const dist2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const ejDe = (id, titulo) => idea(id).ejemplos.find(e => e.titulo === titulo);

test('auditoría A1: el «Tiene sentido» del ángulo interior dice algo cierto (400 semillas)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const r = idea('interior-exterior').resuelve.generar(s), txt = sinDuros(r.pasos.map(p => plano(p.texto)).join(' '));
    assert.ok(!/mitad del arco chico/.test(txt), `semilla ${s}: ${txt}`);
    const m = /queda entre (\d+)° y (\d+)°/.exec(txt), v = num(/(\d+(?:,\d+)?)°/.exec(sinDuros(plano(r.respuesta)))[1]);
    if (m) assert.ok(+m[1] < v && v < +m[2], `semilla ${s}: ${m[0]} con ${v}`);
  }
});

test('auditoría M1 (lector A): la bandeja del juego no cruza el plato; la consigna dice qué se mueve', () => {
  const j = idea('poncelet-pitot').juega;
  for (const v of casosJuego(j)) {
    const d = j.dibujo(v).datos, p = ptsFig(d), K = d.plato.centro, ids = d.bandeja;
    for (let k = 0; k < ids.length; k++) {
      const A = p[ids[k]], B = p[ids[(k + 1) % ids.length]], u = [B[0] - A[0], B[1] - A[1]], L2 = u[0] * u[0] + u[1] * u[1];
      const t = Math.max(0, Math.min(1, ((K[0] - A[0]) * u[0] + (K[1] - A[1]) * u[1]) / L2)), F = [A[0] + u[0] * t, A[1] + u[1] * t];
      assert.ok(dist2(F, K) >= d.plato.r - 1e-6, `${JSON.stringify(v)}: el borde ${ids[k]}${ids[(k + 1) % ids.length]} cruza el plato`);
    }
  }
  assert.ok(/aleja A/.test(j.consigna) && /Aleja la esquina A/.test(j.mision.texto) && !/plato se corre/.test(j.consigna));
});

test('auditoría M2 (lector A): la regla de Pitot y Poncelet no usa letras que no están; el triángulo va sin A, B y C', () => {
  const r = idea('poncelet-pitot').regla, ec = sinDuros(plano(r.ecuacion));
  assert.ok(!/PT|PS/.test(ec), ec);
  for (const q of r.dibujo.datos.figura.puntos) if ('ABC'.includes(q.id)) assert.ok(!q.rotulo, `${q.id} con letra`);
  assert.ok((r.dibujo.datos.ladosRot || []).some(l => l.texto === 'r'), 'el radio r va rotulado');
});

test('auditoría M3: en las reglas, dos relaciones se separan con «y», nunca con «·»', () => {
  // (Ninguna regla multiplica: todo «·» en una regla separaba dos relaciones, como «AM = MB · OT ⟂ tangente».)
  for (const i of def.ideas) assert.ok(!/·/.test(plano(i.regla.ecuacion)), `${i.id}: ${plano(i.regla.ecuacion)}`);
});

test('auditoría M4 y M5 (lector B): afuera, el arco lejano es AB (naranja) y el cercano CD (turquesa); a escala en revelar, Mira y la regla', () => {
  const i = idea('interior-exterior');
  const figs = [['predice', i.predice.dibujo.datos], ['revelar', i.predice.revelar.datos], ['mira', i.mira.datos], ['regla', i.regla.dibujo.datos]];
  for (const [n, d] of figs) {
    const p = ptsFig(d), arcos = d.figura.arcos, gr = q => ((Math.atan2(q[1], q[0]) / RAD) % 360 + 360) % 360;
    const o = arcos.find(a => a.color === 'o'), t = arcos.find(a => a.color === 'i');
    assert.ok(casi(((o.de % 360) + 360) % 360, gr(p.A), 1e-6) && casi(((o.a % 360) + 360) % 360, gr(p.B), 1e-6), `${n}: el arco naranja no es AB`);
    assert.ok(casi(((t.de % 360) + 360) % 360, gr(p.C), 1e-6) && casi(((t.a % 360) + 360) % 360, gr(p.D), 1e-6), `${n}: el arco turquesa no es CD`);
    // Q, D y A en una recta (la vereda QDA); Q, C y B en la otra.
    const col = (X, Y, Z) => Math.abs((Y[0] - X[0]) * (Z[1] - X[1]) - (Y[1] - X[1]) * (Z[0] - X[0])) < 1e-9;
    assert.ok(col(p.Q, p.D, p.A) && col(p.Q, p.C, p.B), `${n}: las veredas no son QDA y QCB`);
    if (n !== 'predice') {
      assert.ok(!d.sinEscala, `${n}: sin escala`);
      assert.ok(casi(o.a - o.de, 110, 1e-6) && casi(t.a - t.de, 30, 1e-6), `${n}: los arcos no miden 110° y 30°`);
      assert.ok(casi(ang(p.Q, p.A, p.B), 40, 1e-6), `${n}: Q no mide 40°`);
    }
  }
  assert.ok(/ACB/.test(i.mira.pasos.map(q => plano(q.texto)).join(' ')));
});

test('auditoría M6: Predice de la idea 4 sin escala, con el ángulo entre tangente y cuerda dibujado lejos de 50°', () => {
  const pr = idea('inscrito').predice, d = pr.dibujo.datos, p = ptsFig(d);
  assert.ok(d.sinEscala && sinDuros(plano(pr.pregunta)).endsWith(NO_ESC));
  const an = d.figura.angulos.find(a => a.en === 'A');
  assert.ok(Math.abs(ang(p.A, p[an.de], p[an.a]) - 50) >= 8, `${ang(p.A, p[an.de], p[an.a])}`);
  assert.ok(!/P llegó/.test(plano(pr.voz)));
});

test('auditoría M8: «El radio de la escuadra» va sin escala, con su aviso, y el radio dibujado no mide 2 cm', () => {
  const e = ejDe('poncelet-pitot', 'El radio de la escuadra'), d = e.figura.datos, p = ptsFig(d);
  assert.ok(d.sinEscala && sinDuros(plano(e.enunciado)).endsWith(NO_ESC));
  const esc = 8 / dist2(p.C, p.B), r = d.figura.circulos[0].r * esc;
  assert.ok(Math.abs(r - 2) > 0.2, `r dibujado ${r}`);
});

test('auditoría M10 (lector B): los datos alcanzan: «si no, no caben» y la media circunferencia', () => {
  for (const e of idea('cuadrilatero-inscrito').ejemplos) if (/Se puede inscribir/.test(plano(e.enunciado))) assert.ok(e.datos.some(x => /si no, no caben/.test(x)), e.titulo);
  for (const t of ['El triángulo en el diámetro', 'El transportador']) assert.ok(ejDe('inscrito', t).datos.some(x => /media circunferencia, 180°/.test(x)), t);
  assert.ok(!ejDe('cuadrilatero-inscrito', 'No cabe').datos.some(x => /360°/.test(x)), 'el dato de los 360° no se usa');
});

test('auditoría M11 (lector B, tarjeta 06): la tercera tangente con dibujo y con el paso de las tangentes desde M y N', () => {
  const e = ejDe('poncelet-pitot', 'Tercera tangente desde lejos'), d = e.figura.datos, p = ptsFig(d), r = d.figura.circulos[0].r;
  for (const id of ['T', 'S', 'Q']) assert.ok(casi(dist2(p[id], p.O), r));
  for (const [X, T] of [['P', 'T'], ['P', 'S'], ['M', 'Q']]) assert.ok(casi(((p[X][0] - p[T][0]) * (p[T][0] - p.O[0]) + (p[X][1] - p[T][1]) * (p[T][1] - p.O[1])), 0, 1e-9), `${X}${T} no es tangente`);
  assert.ok(casi(dist2(p.M, p.T), dist2(p.M, p.Q)) && casi(dist2(p.N, p.S), dist2(p.N, p.Q)));
  assert.ok(/MT y MQ/.test(e.solucion.map(x => plano(x.texto)).join(' ')));
});

test('auditoría M12 (lector B, tarjeta 09): en «Una dentro, otra fuera» las tres no se tocan en un mismo punto', () => {
  const e = ejDe('posiciones', 'Una dentro, otra fuera'), t = sinDuros(plano(e.enunciado));
  const [r2, r1, r3] = [6, 20, 4]; assert.ok(t.includes(`${r2} cm de radio`) && t.includes(`${r1} cm`) && t.includes(`${r3} cm`));
  // Por coordenadas: O1 en 0, O2 a r1 − r2 (por dentro), O3 entre los dos a r2 + r3 de O2.
  const o2 = r1 - r2, o3 = o2 - (r2 + r3), tocaGrande = r1, tocaChica = o3 + r3;
  assert.ok(o3 > 0 && o3 < o2 && tocaGrande !== tocaChica && o3 + r3 < r1);
  assert.equal(sinDuros(plano(e.respuesta)), `${o3} cm`);
});

test('auditoría M13 (lector B, tarjeta 08): objetos creíbles, sin monedas de 10 cm de radio en los ejercicios', () => {
  const textos = def.ideas.flatMap(i => i.ejemplos.map(e => plano(e.enunciado)));
  for (const i of def.ideas) for (let s = 0; s < 50; s++) textos.push(plano(i.ahoraTu.generar(s).pregunta), plano(i.resuelve.generar(s).enunciado));
  assert.ok(!textos.some(t => /moneda/.test(t)));
});

test('lector A: la distancia de la cuerda dice «OM = …» y M tiene letra (400 semillas)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea('tangentes').ahoraTu.generar(s); if (!a.dibujo || !/La cuerda AB está a|está la cuerda/.test(plano(a.pregunta))) continue;
    const d = a.dibujo.datos, l = (d.ladosRot || []).find(x => x.a === 'M');
    assert.ok(l && /^OM = /.test(l.texto), `${s}: ${JSON.stringify(d.ladosRot)}`);
    assert.ok(d.figura.puntos.find(q => q.id === 'M').rotulo === 'M');
    assert.ok(P.escenaCabe(d), `${s}: no cabe`);
  }
});

test('lector A: posiciones, cada copia punteada con su centro y su rótulo; «r₁ − r₂» no se parte', () => {
  const m = idea('posiciones').mira.datos, p = ptsFig(m);
  for (const c of m.figura.circulos.filter(x => x.discontinua)) {
    const q = m.figura.puntos.find(x => !x.sinPunto && casi(x.x, c.centro[0]) && casi(x.y, c.centro[1]));
    assert.ok(q, `la punteada en ${c.centro} no marca su centro`);
    const l = m.libres.find(x => x.desde === c.desde), lp = p[l.en];
    const otros = m.figura.circulos.filter(x => x !== c).map(x => dist2(lp, x.centro) - x.r);
    assert.ok(casi(dist2(lp, c.centro), c.r) && otros.every(x => x > -1e-9), `${l.texto} no está junto a su circunferencia`);
  }
  // La regla lo dice en palabras: ninguna «r₁ − r₂» que se parta entre renglones (la fórmula va en la ecuación).
  assert.ok(typeof idea('posiciones').regla.texto === 'string' && !/r₁|r₂/.test(idea('posiciones').regla.texto) && /la resta y la suma/.test(idea('posiciones').regla.texto));
});

test('lector A: el piso se nombra tangente en la regla; h se ve en el juego', () => {
  assert.ok((idea('tangentes').regla.dibujo.datos.libres || []).some(l => l.texto === 'tangente'));
  for (const h of [10, 20, 50]) assert.ok((idea('tangentes').juega.dibujo({ h }).datos.libres || []).some(l => l.texto === `${h} cm`), `h = ${h}`);
});

test('lector B: controles que dicen desde dónde se miden; las marcas del ángulo no se llaman «arco»', () => {
  for (const i of [idea('inscrito'), idea('cuadrilatero-inscrito')]) for (const c of i.juega.controles.filter(x => /dónde está/.test(x.etiqueta))) assert.ok(/desde la derecha/.test(c.etiqueta), c.etiqueta);
  assert.ok(!idea('cuadrilatero-inscrito').juega.leyenda.some(l => /\((un|dos) arcos?\)/.test(l.t)));
  const m = idea('cuadrilatero-inscrito').mira.datos;
  assert.deepEqual((m.libres || []).filter(l => /^~a/.test(l.en)).map(l => l.texto), ['140°', '220°']);
});

test('auditoría: las letras del fotógrafo y de los faroles no se tocan en la mesa libre', () => {
  const T = require('../../../nucleo/kit/trazo.js');
  const cajas = s => [...s.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)].map(m => { const a = m[1], t = m[2], n = k => +(a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)) || [0, 0])[1]; const tam = n('font-size') || 16, w = T.ancho(t, tam, n('font-weight') || 400), anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? n('x') - w / 2 : anc === 'end' ? n('x') - w : n('x'); return { x0, x1: x0 + w, y0: n('y') - tam * 0.8, y1: n('y') + tam * 0.25 }; });
  const mesa = def.laboratorio.find(m => m.id === 'inscrito-libre');
  for (const v of casosJuego(mesa)) {
    const c = cajas(P.dibujar(mesa.dibujo(v).datos, {}));
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) assert.ok(!(c[i].x0 < c[j].x1 && c[j].x0 < c[i].x1 && c[i].y0 < c[j].y1 && c[j].y0 < c[i].y1), `${JSON.stringify(v)}: dos letras se tocan`);
  }
});
