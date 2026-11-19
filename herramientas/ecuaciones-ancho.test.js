// La medición de herramientas/ecuaciones-ancho.js en una página armada a mano, sin servidor: con app/estilos.css a
// 390 px, encuentra la ecuación que no cabe y no acusa a las que caben. Y lo que arregla la app: una cuenta larga sin
// «=» donde partir se parte después de un signo en vez de quedar cortada. Usa el Chromium de Playwright; si no hay,
// se salta. El barrido de las unidades de verdad tarda minutos y se corre a mano (ver la cabecera de la herramienta).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('../nucleo/ecuacion.js');
const { medirPagina } = require('./ecuaciones-ancho.js');
const { partirLargas } = require('../app/teoria.js');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) {
  try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch (e2) { chromium = null; }
}
const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'estilos.css'), 'utf8');
const v = (c, t) => ({ v: c, t });
const pagina = cuerpo => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>${css}</style></head>
  <body><div id="app"><section class="card te-idea"><div class="te-zona">${cuerpo}</div></section></div></body></html>`;

async function conPagina(t, fn) {
  let nav;
  try { nav = await chromium.launch(); } catch (e) { t.skip(`sin Chromium: ${e.message.split('\n')[0]}`); return; }
  try { await fn(await nav.newPage({ viewport: { width: 390, height: 844 } })); } finally { await nav.close(); }
}

test('la medición encuentra la ecuación que no cabe a 390 px y deja pasar las que caben', { skip: !chromium && 'sin Playwright' }, async t => {
  await conPagina(t, async p => {
    // Una fracción no se puede partir: si es más ancha que la tarjeta, no hay arreglo de la app (es del contenido).
    const fraccion = [v('c-f', 'x'), ' = ', { frac: [[v('c-o', 'velocidad de la combi'), ' · ', v('c-i', 'tiempo que lleva andando'), ' + ', v('c-h', 'posición de salida')], '2']}];
    await p.setContent(pagina(`
      <p class="te-ec" id="corta">${E.html([v('c-f', 'x'), ' = ', v('c-o', 'v'), ' · ', v('c-i', 't'), ' = 8 · 5 = 40 m'])}</p>
      <p class="te-ec" id="fraccion">${E.html(fraccion)}</p>
      <p id="renglon">Se cumple ${E.html([{ frac: ['1', '2'] }, ' de la ', v('c-o', 'distancia que la combi recorre desde el paradero hasta la esquina del mercado')])}</p>
      <p id="cabe">La mitad es ${E.html([{ frac: ['1', '2'] }])} del total.</p>
      <p id="adorno" style="width:200px"><span class="var c-o" style="display:inline-block;width:206px;white-space:normal">texto corto</span></p>
      <div class="te-lee" id="carrusel">${[1, 2, 3].map(k => `<article class="te-lee-t"><p>Tarjeta ${k}</p><p class="te-ec">${E.html(['a + b = ', { frac: ['c', 'd'] }])}</p></article>`).join('')}</div>`));
    const { total, fuera } = await medirPagina(p);
    assert.ok(total >= 7, `midió ${total} renglones`);
    const textos = fuera.map(f => f.texto);
    assert.equal(fuera.length, 2, `esperaba 2 que no caben y salieron: ${JSON.stringify(textos)}`);
    const f1 = fuera.find(f => /tiempo que lleva andando/.test(f.texto)), f2 = fuera.find(f => /esquina del mercado/.test(f.texto));
    assert.ok(f1 && f1.linea && f1.contenido > f1.caja && f1.sobra === f1.contenido - f1.caja, JSON.stringify(f1));
    assert.match(f1.tipo, /deslizar/, 'la línea de fórmula se puede deslizar, pero el alumno no ve que sigue: cuenta');
    assert.ok(f2 && !f2.linea && /se sale/.test(f2.tipo), JSON.stringify(f2));
    assert.ok(!textos.some(x => /^Tarjeta|a \+ b/.test(x)), 'las tarjetas de un carrusel que caben en su ancho no cuentan');
    // El relleno de una ficha que pasa unos px del borde, con todas sus letras adentro, no es una ecuación cortada.
    assert.ok(await p.evaluate(() => { const e = document.getElementById('adorno'); return e.scrollWidth > e.clientWidth + 1; }), 'el caso del adorno sí desborda su caja');
    assert.ok(!textos.includes('texto corto'), 'solo sobra el relleno de la ficha: no cuenta');
  });
});

// Lo que es de la app (app/teoria.js, partirLargas): una cuenta larga iba pegada con espacios duros alrededor de cada
// signo (así no se parte junto a + − × ÷), una igualdad corta tampoco se partía después del «=» y una ficha de color
// larga no se parte. Si no cabían, quedaban cortadas dentro de su línea. Ahora, solo el renglón que no cabe se afloja:
// primero la ficha larga, después el «=», después + y −.
test('el renglón que no cabe se parte después de un signo en vez de cortarse', { skip: !chromium && 'sin Playwright' }, async t => {
  await conPagina(t, async p => {
    const larga = ['1 · 3⁴ + 2 · 3³ + 0 · 3² + 1 · 3¹ + 2 · 3⁰ + 1 · 3⁴ + 2 · 3³ + 0 · 3² + 1 · 3¹'];
    // Como la escribe Segmentos y ángulos: «= m∠» más una ficha corta queda pegado (igualdad corta) y no hay dónde partir.
    const cuerpo = `<p class="te-ec" id="larga">${E.html(larga)}</p>
      <ol class="te-res-pasos"><li class="te-res-paso"><p class="te-ec" id="paso">${E.html(['81 + 54 + 0 + 3 + 2 + 81 + 54 + 0 + 3 + 2 + 81 + 54 + 0 + 3 + 2'])}</p></li></ol>
      <p class="te-ec" id="igualdad">${E.html(['m∠', v('c-h', 'AOC'), ' + m∠', v('c-h', 'BOD'), ' = m∠', v('c-h', 'AOD'), ' + m∠', v('c-h', 'BOC')])}</p>
      <p class="te-res-resp" id="ficha"><b>Respuesta:</b> ${E.html([v('c-f', 'Gaby: choclo, blanco. Ana: jugos, azul. Dina: tamales, rojo')])}</p>
      <p class="te-ec" id="corta">${E.html(['AC = 13 + 5 = 18 cm'])}</p>`;
    await p.setContent(pagina(cuerpo));
    const antes = (await medirPagina(p)).fuera.map(f => f.texto);
    assert.equal(antes.length, 4, `sin el arreglo, las cuatro largas no caben: ${JSON.stringify(antes)}`);
    const cortaAntes = await p.evaluate(() => document.getElementById('corta').innerHTML);
    await p.evaluate(`(${partirLargas})(document.querySelector('.te-zona'))`);
    const { fuera } = await medirPagina(p);
    assert.deepEqual(fuera.map(f => f.texto), [], 'ninguna queda cortada');
    assert.equal(await p.evaluate(() => document.getElementById('corta').innerHTML), cortaAntes, 'lo que cabe no se toca');
    // La igualdad se parte después del «=» y deja pegados los + (no hizo falta más).
    assert.match(await p.evaluate(() => document.getElementById('igualdad').textContent), /^m∠AOC\u00a0\+\u00a0m∠BOD\u00a0= m∠AOD\u00a0\+\u00a0m∠BOC/);
    assert.ok(await p.evaluate(() => document.querySelector('#ficha .var').classList.contains('largo')), 'la ficha larga puede partir');
    const lineas = id => p.evaluate(i => { const e = document.getElementById(i); return Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)); }, id);
    assert.ok(await lineas('larga') >= 2, 'la cuenta larga ocupa más de un renglón');
    assert.equal(await lineas('corta'), 1, 'la que cabe sigue en un renglón');
    // Se parte después de un signo, nunca antes: ningún renglón empieza con + − × ÷ ·.
    const inicios = await p.evaluate(() => {
      const out = [];
      for (const id of ['larga', 'paso', 'igualdad']) {
        const r = document.createRange(), w = document.createTreeWalker(document.getElementById(id), NodeFilter.SHOW_TEXT);
        let y = null;
        for (let n = w.nextNode(); n; n = w.nextNode()) for (let i = 0; i < n.data.length; i++) {
          if (/\s/.test(n.data[i])) continue;
          r.setStart(n, i); r.setEnd(n, i + 1);
          const c = r.getBoundingClientRect();
          if (y === null || c.top > y + c.height * 0.8) { out.push(n.data[i]); y = c.top; }
        }
      }
      return out;
    });
    assert.ok(inicios.length >= 4 && !inicios.some(c => /[+\-−×÷·=]/.test(c)), `renglones que empiezan con: ${inicios.join(' ')}`);
  });
});

// Lo otro que era de la app: la etiqueta de un control con color iba en una ficha que no se parte (.var) y, si era una
// frase, se salía de la tarjeta. El marcado es el de control() en app/teoria.js.
test('la etiqueta larga de un control con color parte en dos renglones', { skip: !chromium && 'sin Playwright' }, async t => {
  await conPagina(t, async p => {
    await p.setContent(pagina(`<div class="te-controles"><div class="te-control" data-c="co">
      <label class="te-etq" for="te-c-co"><span class="var c-o">Estaca de arriba: distancia a la esquina del terreno</span></label>
      <button type="button" class="te-mm" data-paso="-1">−</button><input id="te-c-co" type="range" min="0" max="10" step="1" value="3">
      <button type="button" class="te-mm" data-paso="1">+</button><output for="te-c-co">3 m</output></div></div>`));
    const { total, fuera } = await medirPagina(p);
    assert.ok(total >= 1);
    assert.deepEqual(fuera.map(f => `${f.texto}: ${f.tipo}, sobran ${f.sobra} px`), []);
  });
});
