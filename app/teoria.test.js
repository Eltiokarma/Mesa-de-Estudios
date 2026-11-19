// Pruebas del lector de la teoría (app/teoria.js): lo que no toca el DOM.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { avisoJuego, trozosTermino } = require('./teoria.js');

// Pendiente del 18 nov (lector en frío de Las cuatro operaciones): «Prueba 3 casos distintos (otro valor u otra
// opción): llevas 1» se confundía, y «llevas 1» se leía como la llevada de la suma.
test('«Juega»: el contador dice qué hacer y cuánto falta, sin «llevas»', () => {
  const src = fs.readFileSync(path.join(__dirname, 'teoria.js'), 'utf8');
  assert.doesNotMatch(src.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ''), /llevas/i, 'app/teoria.js ya no le dice «llevas» al alumno');
  // Sin misión, minimo 3: el caso con que abre no cuenta; faltan 2 cambios, después 1, después nada.
  const pasos = [1, 2, 3, 7].map(probados => avisoJuego({ minimo: 3, probados }));
  assert.deepEqual(pasos.map(a => a.faltan), [2, 1, 0, 0]);
  assert.deepEqual(pasos.map(a => a.hechos), [0, 1, 2, 2]);
  assert.equal(pasos[0].texto, 'Cambia un valor: te faltan 2 cambios para seguir.');
  assert.equal(pasos[1].texto, 'Cambia un valor: te falta 1 cambio para seguir.');
  assert.equal(pasos[2].texto, 'Listo: ya puedes seguir.');
  assert.equal(pasos[0].alSeguir, 'Antes de seguir, cambia un valor: te faltan 2 cambios.');
  assert.equal(pasos[2].alSeguir, '');
  for (const a of pasos) {
    assert.doesNotMatch(a.texto + a.alSeguir, /llev|casos distintos/i);
    assert.ok(a.texto.length <= 50, `cabe en dos líneas a 360 px: «${a.texto}»`);
    assert.equal(a.hechos + a.faltan, a.total);
  }
  // Dice qué tocar según lo que el juego tiene.
  assert.match(avisoJuego({ minimo: 3, probados: 1, valores: false, opciones: true }).texto, /^Elige otra opción: /);
  assert.match(avisoJuego({ minimo: 3, probados: 1, valores: true, opciones: true }).texto, /^Cambia un valor o una opción: /);
  // minimo 1 (o sin minimo): no hay nada que contar.
  assert.equal(avisoJuego({ minimo: 1, probados: 1 }).texto, '');
  assert.equal(avisoJuego({}).faltan, 0);
});

test('«Juega»: con misión el contador calla y lograrla deja seguir', () => {
  // La misión ya dice qué hay que lograr: el contador no pone una segunda consigna.
  const sinLograr = avisoJuego({ minimo: 4, probados: 1, mision: true });
  assert.equal(sinLograr.texto, '');
  assert.equal(sinLograr.faltan, 3);
  assert.equal(sinLograr.alSeguir, 'Antes de seguir, cambia un valor: te faltan 3 cambios.', 'si pulsa «Siguiente» antes de tiempo, se le dice qué falta');
  // Misión lograda con menos cambios que el mínimo: no se le pide «uno más».
  const lograda = avisoJuego({ minimo: 4, probados: 2, mision: true, lograda: true });
  assert.deepEqual([lograda.faltan, lograda.texto, lograda.alSeguir], [0, '', '']);
  // Sin lograrla, jugar lo suficiente también deja seguir (la misión no bloquea: docs/teoria.md).
  assert.equal(avisoJuego({ minimo: 4, probados: 4, mision: true }).faltan, 0);
});

// Pendiente del 18 nov: un término del glosario justo después de una comilla de apertura podía quedar en el renglón
// siguiente, con la «» sola al final del anterior. La puntuación que abre va pegada al término, como la que cierra.
const marca = (txt, palabra, clave = palabra) => { const i = txt.indexOf(palabra); return { inicio: i, fin: i + palabra.length, clave }; };
test('glosario: la comilla o el signo que abre va pegado al término, como la puntuación que cierra', () => {
  const txt = 'La palabra «llevada» viene de «llevar»; y (¿base?) también.';
  const ms = [marca(txt, 'llevada'), marca(txt, 'base')];
  const tr = trozosTermino(txt, ms);
  assert.deepEqual(tr, ['La palabra ', { termino: 'llevada', clave: 'llevada', abre: '«', cierra: '»' },
    ' viene de «llevar»; y ', { termino: 'base', clave: 'base', abre: '(¿', cierra: '?)' }, ' también.']);
  // No se pierde ni se repite ninguna letra.
  assert.equal(tr.map(t => (typeof t === 'string' ? t : t.abre + t.termino + t.cierra)).join(''), txt);
  // Sin puntuación alrededor, el término va solo; al comienzo y al final del texto también.
  assert.deepEqual(trozosTermino('cifra y base', [marca('cifra y base', 'cifra'), marca('cifra y base', 'base')]),
    [{ termino: 'cifra', clave: 'cifra', abre: '', cierra: '' }, ' y ', { termino: 'base', clave: 'base', abre: '', cierra: '' }]);
  assert.deepEqual(trozosTermino('“base”', [marca('“base”', 'base')]), [{ termino: 'base', clave: 'base', abre: '“', cierra: '”' }]);
  // La comilla que cierra otra cosa, separada por un espacio, no se lleva.
  assert.deepEqual(trozosTermino('«uno» base', [marca('«uno» base', 'base')]), ['«uno» ', { termino: 'base', clave: 'base', abre: '', cierra: '' }]);
});

// Y en la página, con app/estilos.css: a ningún ancho la comilla queda en un renglón y el término en otro. Con el
// marcado de antes (la comilla suelta, fuera de .te-term-nb) sí pasaba: se comprueba también, para que la prueba valga.
let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch (e2) { chromium = null; } }
test('glosario: el renglón no se corta entre la comilla de apertura y el término', { skip: !chromium && 'sin Playwright' }, async t => {
  let nav;
  try { nav = await chromium.launch(); } catch (e) { t.skip(`sin Chromium: ${e.message.split('\n')[0]}`); return; }
  try {
    const p = await nav.newPage({ viewport: { width: 390, height: 844 } });
    const css = fs.readFileSync(path.join(__dirname, 'estilos.css'), 'utf8');
    const txt = 'En la suma de la tarde, la cifra que sube a la columna siguiente se llama «llevada» y se anota arriba.';
    const html = tr => tr.map(x => (typeof x === 'string' ? x : `<span class="te-term-nb">${x.abre}<button type="button" class="te-term">${x.termino}</button>${x.cierra}</span>`)).join('');
    const antes = txt.replace('«llevada»', '«<span class="te-term-nb"><button type="button" class="te-term">llevada</button>»</span>');
    await p.setContent(`<!doctype html><style>${css}</style><body><p id="nuevo" style="font-size:17px">${html(trozosTermino(txt, [marca(txt, 'llevada')]))}</p><p id="viejo" style="font-size:17px">${antes}</p></body>`);
    const cortes = await p.evaluate(() => {
      const out = { nuevo: [], viejo: [] };
      for (let w = 120; w <= 380; w++) for (const id of ['nuevo', 'viejo']) {
        const el = document.getElementById(id); el.style.width = `${w}px`;
        const r = document.createRange(), b = el.querySelector('.te-term');
        const tn = [...el.childNodes].concat([...el.querySelectorAll('.te-term-nb')].flatMap(s => [...s.childNodes])).find(n => n.nodeType === 3 && /«$/.test(n.data));
        r.setStart(tn, tn.data.length - 1); r.setEnd(tn, tn.data.length);
        if (Math.abs(r.getBoundingClientRect().top - b.getBoundingClientRect().top) > 4) out[id].push(w);
      }
      return out;
    });
    assert.ok(cortes.viejo.length > 0, 'con el marcado de antes hay anchos donde la comilla queda sola: la prueba mide lo que debe');
    assert.deepEqual(cortes.nuevo, [], `la comilla quedó en otro renglón a ${cortes.nuevo.join(', ')} px`);
  } finally { await nav.close(); }
});
