// Pruebas propias de «Tema central e idea principal» (además del validador común de contenido/teoria/teoria.test.js).
// Salen de la auditoría del 17 nov (rutinas/auditoria/razonamiento-verbal.tema-e-idea-principal.md, reglas R1 a R7):
//   R1. El glosario se lee antes de jugar: ningún ejemplo suyo usa una oración de un juego, una predicción, un «Mira»,
//       un «Ahora tú» o un ejemplo resuelto, ni da su respuesta.
//   R2. En las hojas con letras fijas, ninguna letra es la correcta más del 30 % de las veces, y A y E también lo son; en
//       las listas de frases de un enunciado, la correcta no va casi siempre en el mismo lugar.
//   R3. La mesa del laboratorio mide como la idea 1: lo que llama «muy amplia» cubre todas las oraciones.
//   R5. En verbal, la primera tarjeta de «Lee» de cada idea muestra el texto en su soporte (contrato, punto 1).
//   R7. La correcta no gana por copiar: no copia una oración del texto (≥ 60 %) 15 puntos más que todos los distractores.
//   M7. Antes de responder «Ahora tú», la figura no pinta ninguna oración con un color de la paleta de lectura.
// Las medidas se hacen aquí, sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./tema-e-idea-principal.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x == null ? '' : typeof x === 'object' ? plano(x.t !== undefined ? x.t : '') : String(x));
const limpia = s => String(s).replace(/[⁠ ]/g, ' ').replace(/\s+/g, ' ').trim();
const norm = s => limpia(s).toLowerCase().replace(/[.,;:¿?¡!«»"()]/g, '').replace(/\s+/g, ' ').trim();
const STOP = new Set('el la los las un una unos unas de del a al y o que en con por para su sus se es no lo le les más como sin ya muy son este esta ese esa cada'.split(' '));
const pal = s => limpia(s).toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(w => w && !STOP.has(w));
const oracionesDe = sop => {
  const s = sop && typeof sop.soporte === 'object' ? sop.soporte : sop;
  return ((s && s.hojas) || []).flatMap(h => (h.oraciones || []).map(o => o.t));
};
const alternativasDe = sop => {
  const s = sop && typeof sop.soporte === 'object' ? sop.soporte : sop;
  return ((s && s.alternativas) || []).map(a => a.t);
};
const SEMILLAS = 60;

// ---------- R1: el glosario no da respuestas ----------
function protegidos() {
  const frases = new Set(), respuestas = new Set();
  const sop = d => { if (!d) return; for (const t of oracionesDe(d)) frases.add(t); for (const t of alternativasDe(d)) frases.add(t); if (d.frase) frases.add(d.frase.t); for (const p of d.peldanos || []) frases.add(p); };
  for (const idea of def.ideas) {
    const j = idea.juega;
    for (const v of Teoria.grilla(j.controles || [])) {
      const dib = j.dibujo(v);
      sop(dib && dib.datos);
      if (j.mision && j.mision.logrado(v) && dib && dib.datos && dib.datos.frase) respuestas.add(dib.datos.frase.t);
    }
    if (j.mision) respuestas.add(j.mision.bien);
    sop(idea.predice.dibujo && idea.predice.dibujo.datos);
    sop(idea.predice.revelar && idea.predice.revelar.datos);
    for (const o of idea.predice.opciones) if (o.correcta) respuestas.add(o.texto);
    sop(idea.mira.datos);
    for (let s = 0; s < SEMILLAS; s++) {
      const a = idea.ahoraTu.generar(s);
      sop(a.dibujo && a.dibujo.datos);
      for (const o of a.opciones) if (o.correcta) respuestas.add(o.texto);
    }
    for (const e of idea.ejemplos || []) {
      sop(e.figura && e.figura.datos);
      // La respuesta sin la letra de la alternativa («C: …»).
      respuestas.add(plano(e.respuesta).replace(/^[A-E]\s*:\s*/, ''));
      for (const q of plano(e.solucion.map(p => p.texto)).matchAll(/«([^»]+)»/g)) respuestas.add(q[1]);
    }
  }
  return { frases: [...frases].map(norm).filter(x => x.length >= 15), respuestas: [...respuestas].filter(Boolean) };
}

test('R1: ningún ejemplo del glosario usa una oración ni da una respuesta de la unidad', () => {
  const { frases, respuestas } = protegidos();
  assert.ok(frases.length > 300 && respuestas.length > 100, 'la prueba no corre en vacío');
  const malos = [];
  for (const g of def.glosario) for (const ej of g.ejemplos || []) {
    const n = norm(ej);
    for (const f of frases) if (n.includes(f)) malos.push(`«${g.termino}»: «${ej}» copia «${f}»`);
    // Lo que el ejemplo pone entre comillas (tres palabras o más) no puede ser parte de una oración o de una respuesta.
    for (const q of limpia(ej).matchAll(/«([^»]+)»/g)) {
      const c = norm(q[1]);
      if (pal(q[1]).length >= 3) for (const f of frases.concat(respuestas.map(norm))) if (f.includes(c)) malos.push(`«${g.termino}»: «${q[1]}» sale de «${f}»`);
    }
    // Y no repite casi todas las palabras de una respuesta (una predicción, una misión, un «Ahora tú» o un ejemplo).
    const w = new Set(pal(ej));
    for (const r of respuestas) {
      const rw = pal(r);
      if (rw.length >= 4 && rw.filter(x => w.has(x)).length / rw.length >= 0.7) malos.push(`«${g.termino}»: «${ej}» repite la respuesta «${r}»`);
    }
  }
  assert.deepEqual([...new Set(malos)], []);
});

// ---------- R2: la letra y el lugar de la correcta ----------
function hojasConLetra() {
  const out = [];
  for (const idea of def.ideas) {
    for (const e of idea.ejemplos || []) {
      const alts = e.figura && e.figura.datos.alternativas;
      if (!alts) continue;
      const L = limpia(plano(e.respuesta))[0];
      assert.ok(alts.some(a => a.id === L), `${idea.id} «${e.titulo}»: la respuesta nombra la ${L}`);
      out.push({ donde: `${idea.id} «${e.titulo}»`, L });
    }
    if (idea.resuelve) {
      const vistos = new Set();
      for (let s = 0; s < SEMILLAS; s++) {
        const R = idea.resuelve.generar(s), alts = R.dibujo.datos.alternativas;
        if (!alts || vistos.has(R.enunciado)) continue;
        vistos.add(R.enunciado);
        out.push({ donde: `${idea.id} resuelve ${s}`, L: limpia(plano(R.respuesta))[0] });
      }
    }
    if (idea.predice.orden === 'fijo') out.push({ donde: `${idea.id} predice`, L: 'ABCDE'[idea.predice.opciones.findIndex(o => o.correcta)] });
    // El juego con hoja de simulacro: la letra que queda cuando se cumple la misión.
    const j = idea.juega, dib0 = j.dibujo(Teoria.inicio(j));
    if (dib0.datos.alternativas && j.mision) {
      const ok = Teoria.grilla(j.controles).find(v => j.mision.logrado(v));
      const quedan = dib0.datos.alternativas.map(a => a.id).filter(id => !j.dibujo(ok).estado.tachar.includes(id));
      assert.equal(quedan.length, 1);
      out.push({ donde: `${idea.id} juega`, L: quedan[0] });
    }
  }
  return out;
}

test('R2: en las hojas con letras fijas, la correcta se reparte entre A y E (ninguna pasa del 30 %)', () => {
  const H = hojasConLetra(), n = H.length, cuenta = {};
  for (const h of H) cuenta[h.L] = (cuenta[h.L] || 0) + 1;
  assert.ok(n >= 20, `solo ${n} hojas`);
  for (const L of 'ABCDE') {
    assert.ok(cuenta[L] >= 1, `la ${L} nunca es la correcta (${JSON.stringify(cuenta)})`);
    assert.ok(cuenta[L] / n <= 0.3, `la ${L} es la correcta en ${cuenta[L]} de ${n} (${JSON.stringify(cuenta)})`);
  }
});

test('R2: en las listas de frases del enunciado, la correcta no va siempre en el mismo lugar', () => {
  const lugares = {};
  const anota = (en, resp) => {
    const ops = [...limpia(plano(en)).matchAll(/«([^»]+)»/g)].map(m => norm(m[1]));
    const i = ops.indexOf(norm(resp));
    if (ops.length === 3 && i >= 0) lugares[i + 1] = (lugares[i + 1] || 0) + 1;
  };
  for (const idea of def.ideas) {
    for (const e of idea.ejemplos || []) if (!(e.figura && e.figura.datos.alternativas)) anota(e.enunciado, plano(e.respuesta).split(':')[0]);
    if (idea.resuelve) for (let s = 0; s < 4; s++) { const R = idea.resuelve.generar(s); if (!R.dibujo.datos.alternativas) anota(R.enunciado, plano(R.respuesta)); }
  }
  const n = Object.values(lugares).reduce((a, b) => a + b, 0);
  assert.ok(n >= 15, `solo ${n} listas de tres`);
  for (const k of [1, 2, 3]) assert.ok((lugares[k] || 0) / n >= 0.2, `la correcta va ${k}.ª en ${lugares[k] || 0} de ${n} (${JSON.stringify(lugares)})`);
});

// ---------- R3: la mesa mide como la idea 1 ----------
test('R3: en la mesa de propuestas, lo «muy amplio» cubre todo el texto y lo que no cubre nada no se llama amplio', () => {
  const mesa = def.laboratorio.find(m => m.id === 'propuestas');
  let amplias = 0, ninguna = 0;
  for (const v of Teoria.grilla(mesa.controles)) {
    const lec = limpia(plano(mesa.lectura(v))).toLowerCase(), d = mesa.dibujo(v), oras = oracionesDe(d.datos);
    const tenue = (d.estado.tenue || []).length;
    if (/amplia/.test(lec)) { amplias++; assert.equal(tenue, 0, `${JSON.stringify(v)}: «muy amplia» y deja oraciones fuera`); }
    if (tenue === oras.length) { ninguna++; assert.ok(!/amplia/.test(lec), `${JSON.stringify(v)}: no cubre nada y se llama amplia`); }
  }
  assert.ok(amplias > 0 && ninguna > 0, 'la mesa tiene propuestas muy amplias y propuestas que no cubren nada');
});

// ---------- R5: el soporte en la primera pantalla de cada idea ----------
test('R5: la primera tarjeta de «Lee» de cada idea muestra el texto en su soporte', () => {
  for (const idea of def.ideas) {
    const t = idea.lee && idea.lee.tarjetas && idea.lee.tarjetas[0];
    assert.ok(t, `${idea.id}: sin Lee`);
    assert.equal(t.pieza || idea.pieza, 'rv-soporte', `${idea.id}: la tarjeta 1 no lleva rv-soporte`);
    assert.ok(t.dibujo && oracionesDe(t.dibujo.datos).length >= 2, `${idea.id}: la tarjeta 1 no trae un texto en su soporte`);
  }
});

// ---------- R7: la correcta no gana por copiar ----------
const copia = (op, oras) => { const w = pal(op); if (!w.length || !oras.length) return 0; return Math.max(...oras.map(o => { const s = new Set(pal(o)); return w.filter(x => s.has(x)).length / w.length; })); };
function revisaCopia(donde, ops, iOk, oras, malos) {
  const c = ops.map(o => copia(o, oras)), otras = c.filter((_, k) => k !== iOk);
  if (c[iOk] >= 0.6 && c[iOk] > Math.max(...otras) + 0.15) malos.push(`${donde}: la correcta copia ${Math.round(100 * c[iOk])} % y los distractores hasta ${Math.round(100 * Math.max(...otras))} %`);
}
test('R7: la correcta no copia una oración del texto mucho más que todos los distractores', () => {
  const malos = [];
  let n = 0;
  for (const idea of def.ideas) {
    const P = idea.predice;
    revisaCopia(`${idea.id} predice`, P.opciones.map(o => o.texto), P.opciones.findIndex(o => o.correcta), oracionesDe(P.dibujo.datos), malos); n++;
    for (let s = 0; s < SEMILLAS; s++) {
      const A = idea.ahoraTu.generar(s);
      revisaCopia(`${idea.id} ahoraTu ${s}`, A.opciones.map(o => o.texto), A.opciones.findIndex(o => o.correcta), oracionesDe(A.dibujo.datos), malos); n++;
    }
    for (const e of idea.ejemplos || []) {
      const sop = e.figura.datos, alts = sop.alternativas;
      if (alts) { const L = limpia(plano(e.respuesta))[0]; revisaCopia(`${idea.id} «${e.titulo}»`, alts.map(a => a.t), alts.findIndex(a => a.id === L), oracionesDe(sop), malos); n++; continue; }
      const ops = [...limpia(plano(e.enunciado)).matchAll(/«([^»]+)»/g)].map(m => m[1]), i = ops.map(norm).indexOf(norm(plano(e.respuesta).split(':')[0]));
      if (ops.length >= 2 && i >= 0) { revisaCopia(`${idea.id} «${e.titulo}»`, ops, i, oracionesDe(sop), malos); n++; }
    }
  }
  assert.ok(n > 250, 'la prueba no corre en vacío');
  assert.deepEqual(malos, []);
});

// ---------- M7: «Ahora tú» no pinta antes de responder ----------
test('M7: antes de responder «Ahora tú», la figura no pinta ninguna oración con un color de la paleta', () => {
  for (const idea of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const A = idea.ahoraTu.generar(s), m = (A.dibujo.estado && A.dibujo.estado.marcas) || {};
    assert.deepEqual(Object.keys(m), [], `${idea.id} ahoraTu ${s}: marca ${JSON.stringify(m)} antes de responder`);
  }
  // La oración por la que se pregunta va señalada con un recuadro de tinta en su número.
  const jer = def.ideas.find(i => i.id === 'jerarquia');
  const conSenal = Array.from({ length: SEMILLAS }, (_, s) => jer.ahoraTu.generar(s)).filter(a => /papel cumple la oración (\d)/.test(a.pregunta));
  assert.ok(conSenal.length > 0);
  for (const a of conSenal) {
    const k = +/oración (\d)/.exec(a.pregunta)[1];
    assert.deepEqual(a.dibujo.estado.senal.length, 1);
    const ids = (a.dibujo.datos.hojas || []).flatMap(h => h.oraciones.map(o => o.id));
    assert.equal(a.dibujo.estado.senal[0], ids[k - 1], 'el recuadro va en la oración que se pregunta');
  }
});
