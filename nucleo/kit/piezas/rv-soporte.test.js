// Pruebas de la pieza «rv-soporte»: cada soporte encuadra todo dentro del lienzo con 4 de margen, ningún renglón pisa
// a otro, la marca cae bajo su renglón, el alto no cambia con el estado, es pura, sin colores fijos ni texto chico, el
// marco es un dibujo de prueba marcado y el texto alternativo trae el texto entero.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rv-soporte.js');
const T = require('../trazo.js');

const ors = (pre, n) => Array.from({ length: n }, (_, k) => ({ id: `${pre}${k + 1}`, t: `Oración número ${k + 1} de un texto corto, con palabras suficientes para partirse en dos renglones.` }));
const tabla = { titulo: 'Agua juntada', cols: ['Mes', 'Litros'], filas: [{ id: 'f1', celdas: ['Enero', '2400'] }, { id: 'f2', celdas: ['Febrero', '3100'] }], nota: 'Datos inventados para el ejercicio.' };
const barras = { titulo: 'Libros leídos', max: 160, items: [{ id: 'b1', t: 'Antes', v: 40 }, { id: 'b2', t: 'Después', v: 160 }], nota: 'Datos inventados para el ejercicio.' };
const CASOS = {
  mural: { soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'a', titulo: 'Comunicado de la Dirección', para: 'estudiantes y familias', oraciones: ors('o', 4) }, { id: 'b', chica: true, titulo: 'Aviso del quiosco', de: 'el quiosco', para: 'estudiantes', oraciones: ors('q', 2) }] },
  puerta: { soporte: 'puerta', lugar: 'Puerta del puesto de salud', hojas: [{ id: 'a', titulo: 'Aviso', de: 'el puesto de salud', para: 'vecinos', oraciones: ors('o', 4) }] },
  cartel: { soporte: 'cartel', lugar: 'Cartel de la feria', hojas: [{ id: 'a', titulo: 'Comunicado de la junta de la feria', de: 'la junta', para: 'vendedores', oraciones: ors('o', 3) }] },
  folleto: { soporte: 'folleto', lugar: 'Folleto del muelle', hojas: [{ id: 'a', titulo: 'Información', oraciones: ors('o', 3), tabla }] },
  balsa: { soporte: 'folleto', lugar: 'Folleto del muelle', hojas: [{ id: 'a', titulo: 'Los uros y la totora', de: 'la caseta', para: 'visitantes', ilustracion: 'balsa', oraciones: ors('o', 5) }], frase: { etiqueta: 'Tu idea', t: 'La totora, para los uros, es la base de su vida en el lago' } },
  bandeja: { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', bandeja: true, hojas: [{ id: 'a', titulo: 'Ciencias Sociales', de: 'el libro', para: 'estudiar', oraciones: ors('o', 5) }] },
  cuaderno: { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'a', titulo: 'Útiles', oraciones: ors('o', 3) }], frase: { etiqueta: 'Frase', t: 'Los útiles para dibujar y para pintar en la clase de arte' } },
  mensaje: { soporte: 'mensaje', lugar: 'Familias de 5.º B', hojas: [{ id: 'a', de: 'la tutora', para: 'familias', oraciones: ors('o', 3) }] },
  // Etapa 5 (Definiciones): la página de diccionario, con el lema de cada entrada en negrita.
  diccionario: { soporte: 'diccionario', lugar: 'Diccionario escolar', hojas: [{ id: 'a', titulo: 'P', oraciones: ors('o', 3).map((o, k) => Object.assign(o, { lema: ['puente', 'puerta', 'pupitre'][k] })) }] },
  simulacro: { soporte: 'simulacro', numero: 12, hojas: [{ id: 'a', titulo: 'Texto A', oraciones: ors('o', 3), barras }, { id: 'b', titulo: 'Texto B', oraciones: ors('p', 2), tabla }],
    pregunta: 'El texto y el gráfico giran, principalmente, en torno a', alternativas: ['A', 'B', 'C', 'D', 'E'].map(id => ({ id, t: `alternativa ${id}, larga como en el examen de admisión de San Marcos` })) },
};
const ESTADOS = d => {
  const ids = P.disponer(d).items.filter(i => i.id).map(i => i.id);
  return [{}, { marcas: Object.fromEntries(ids.map((i, k) => [i, ['i', 'o', 'f'][k % 3]])), tenue: ids.slice(0, 2), tachar: ids.slice(-1), nuevo: ids.slice(0, 1) },
    { marcas: { frase: 'f' }, tenue: ids }, { tapar: ['frase', ...ids.slice(0, 2)] }];
};

// Caja de cada cosa escrita: renglones, números, letras, celdas y barras.
function cajas(L) {
  const out = [];
  for (const it of L.items.concat(L.frase ? L.frase.lineas : [])) {
    if (it.tipo === 'tabla-cab' || it.tipo === 'tabla-fila' || it.tipo === 'barra') out.push({ x: it.x, y: it.y, w: it.w, h: it.h, q: it.tipo });
    else if (it.tipo === 'letra') out.push({ x: it.x - 10, y: it.y - 10, w: 20, h: 20, q: 'letra' });
    else if (it.tipo === 'banda') out.push({ x: it.x - it.w / 2, y: it.y - 16, w: it.w, h: 20, q: it.texto });
    else if (it.tipo === 'balsa') out.push({ x: it.x + it.w / 2 - 112, y: it.y + 4, w: 224, h: 46, q: 'balsa' });
    else out.push({ x: it.x, y: it.y - (it.tam || 15) + 1, w: it.w, h: (it.tam || 15) + 3, q: it.texto });
  }
  return out;
}

for (const [nombre, d] of Object.entries(CASOS)) {
  test(`${nombre}: todo cabe en el lienzo con 4 de margen y ningún renglón pisa a otro`, () => {
    const L = P.disponer(d), cs = cajas(L), W = P.constantes.W;
    for (const c of cs) {
      assert.ok(c.x >= 4 - 0.01 && c.x + c.w <= W - 4 + 0.01, `${nombre}: «${c.q}» se sale por el costado (${c.x}, ${c.w})`);
      assert.ok(c.y >= 4 - 0.01 && c.y + c.h <= L.alto - 4 + 0.01, `${nombre}: «${c.q}» se sale por arriba o por abajo`);
    }
    for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
      const a = cs[i], b = cs[j];
      const pisa = a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
      assert.ok(!pisa, `${nombre}: «${a.q}» pisa a «${b.q}»`);
    }
    // Cada papel guarda su contenido.
    for (const p of L.papeles.filter(x => x.w)) assert.ok(p.x >= 4 && p.x + p.w <= W - 4, `${nombre}: el papel se sale`);
  });
  test(`${nombre}: el alto no cambia con el estado; puro, sin NaN, colores fijos ni texto chico`, () => {
    const altos = new Set();
    for (const e of ESTADOS(d)) {
      const s = P.dibujar(d, e);
      assert.equal(s, P.dibujar(d, e));
      assert.ok(!/NaN|undefined|null|Infinity/.test(s));
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
      assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
      for (const [tag] of s.matchAll(/<[a-z]+ [^>]+>/g)) {
        const at = [...tag.matchAll(/\s([a-z-]+)="/g)].map(m => m[1]);
        assert.equal(new Set(at).size, at.length, `atributo repetido en ${tag.slice(0, 60)}`);
      }
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'f'].includes(c), `color ${c} fuera de la paleta de lectura`);
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1);
  });
}

test('la marca cae bajo su renglón y cada color tiene su trazo (el color no es la única señal)', () => {
  const d = CASOS.mural, L = P.disponer(d);
  const lineas = L.items.filter(i => i.tipo === 'linea' && i.id === 'o2');
  for (const [c, raya] of [['i', null], ['o', '7 4'], ['f', '0.1 6']]) {
    const s = P.dibujar(d, { marcas: { o2: c } });
    const subs = [...s.matchAll(/class="rv-sub" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)"[^>]*?(?:stroke-dasharray="([^"]+)")?\/>/g)];
    assert.equal(subs.length, lineas.length, 'un subrayado por renglón');
    subs.forEach((m, k) => {
      assert.ok(Math.abs(+m[1] - lineas[k].x) < 0.01 && Math.abs(+m[3] - lineas[k].x - lineas[k].w) < 0.01);
      assert.ok(Math.abs(+m[2] - lineas[k].y - 4) < 0.01);
      assert.equal(m[4] || null, raya);
    });
  }
});

test('lo que queda fuera se lee: la tinta al 65 % pasa 4,5:1 en claro y en oscuro', () => {
  const dec = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16));
  const Y = rgb => { const [r, g, b] = rgb.map(v => dec(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const mezcla = (a, b, t) => h(a).map((x, i) => Math.round(x * t + h(b)[i] * (1 - t)));
  const contraste = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((m, n) => m - n); return (y + 0.05) / (x + 0.05); };
  for (const [tinta, tarjeta] of [['#2d2340', '#fffaf6'], ['#f1ebf7', '#2a2135']]) {
    assert.ok(contraste(mezcla(tinta, tarjeta, P.constantes.TENUE), h(tarjeta)) >= 4.5, `${tinta} sobre ${tarjeta}`);
  }
});

test('los marcos son dibujos de prueba y el texto alternativo trae el texto, el soporte y quién escribe', () => {
  for (const [nombre, d] of Object.entries(CASOS)) {
    const s = P.dibujar(d, {});
    if (nombre !== 'simulacro') assert.match(s, /data-prueba="si"/, nombre);
    const a = P.alt(d);
    for (const h of d.hojas) for (const o of h.oraciones) assert.ok(a.includes(o.t), `${nombre}: falta una oración en el alt`);
    if (d.alternativas) for (const x of d.alternativas) assert.ok(a.includes(x.t));
  }
  assert.match(P.alt(CASOS.mural), /para estudiantes y familias/);
  assert.match(P.alt(CASOS.simulacro), /Tabla.*Enero, 2400/);
  assert.match(P.alt(CASOS.simulacro), /barras.*Después, 160/);
});

test('las barras son proporcionales al dato desde cero', () => {
  const L = P.disponer(CASOS.simulacro);
  const [a, b] = L.items.filter(i => i.tipo === 'barra');
  assert.ok(Math.abs(a.largo / b.largo - 40 / 160) < 1e-9);
  assert.ok(T.ancho('160', 15, 700) + b.x0 + b.largo + 6 <= 320 - 4);
});

test('la bandeja queda debajo de la hoja, con sus rótulos dentro del lienzo, y la balsa no pisa el texto', () => {
  const L = P.disponer(CASOS.bandeja), B = L.bandeja;
  const hoja = L.papeles.find(p => p.w);
  assert.ok(B.y >= hoja.y + hoja.h, 'la bandeja va debajo de la hoja');
  for (const h of [B.resaltador, B.lapiz]) {
    assert.ok(h.x - 44 >= 4 && h.x + 36 <= 316, 'la herramienta cabe');
    assert.ok(h.y + 30 <= L.alto - 4, 'el rótulo cabe');
  }
  assert.ok(B.resaltador.x + 36 < B.lapiz.x - 44, 'las dos herramientas no se tocan');
  assert.match(P.dibujar(CASOS.bandeja, {}), /data-objeto="bandeja" data-prueba="si"/);
  assert.match(P.dibujar(CASOS.balsa, {}), /data-objeto="balsa" data-prueba="si"/);
  assert.match(P.alt(CASOS.balsa), /balsa de totora/);
});

test('senal: un recuadro de tinta alrededor del número de la oración, sin color de la paleta y dentro del papel', () => {
  for (const [nombre, d] of Object.entries(CASOS)) {
    const L = P.disponer(d), nums = L.items.filter(i => i.tipo === 'num');
    const s = P.dibujar(d, { senal: nums.map(n => n.id) });
    const cajas = [...s.matchAll(/<rect class="rv-senal" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*\/>/g)];
    assert.equal(cajas.length, nums.length, `${nombre}: un recuadro por número`);
    cajas.forEach((m, k) => {
      const [x, y, w, h] = m.slice(1, 5).map(Number), n = nums[k];
      assert.ok(!/var\(--c-/.test(m[0]), `${nombre}: el recuadro va en tinta`);
      assert.ok(x >= 4 && x + w <= 316 && y >= 4 && y + h <= L.alto - 4, `${nombre}: recuadro dentro del lienzo`);
      assert.ok(x < n.x && x + w > n.x + T.ancho(n.texto, 14, 700), `${nombre}: el recuadro rodea el número ${n.texto}`);
      const linea = L.items.find(i => i.tipo === 'linea' && i.id === n.id);
      assert.ok(x + w < linea.x - 0.5, `${nombre}: el recuadro no pisa el renglón`);
    });
  }
  assert.equal(P.dibujar(CASOS.mural, {}).includes('rv-senal'), false, 'sin senal, ningún recuadro');
});

test('tapar guarda el lugar del renglón sin mostrar su texto', () => {
  const d = CASOS.balsa, s = P.dibujar(d, { tapar: ['frase'] });
  const textos = [...s.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]).join(' ');
  assert.ok(!textos.includes('base de su vida'), 'la frase tapada no se lee');
  assert.match(s, /class="rv-tapa"/);
  assert.ok(P.dibujar(d, {}).includes('es la base de su vida'));
});

test('ancla, cercana y enBandeja: la manija cae sobre su oración y soltarla ahí la elige', () => {
  const d = CASOS.bandeja, ids = ['o1', 'o2', 'o3', 'o4', 'o5'];
  for (const id of ids) for (const lado of [undefined, 'fin']) {
    const p = P.ancla(d, id, lado);
    assert.ok(p.x >= 4 && p.x <= 316, `${id} ${lado}`);
    assert.equal(P.cercana(d, p, ids), id);
    assert.equal(P.enBandeja(d, p), false);
  }
  const B = P.disponer(d).bandeja;
  assert.equal(P.enBandeja(d, B.lapiz), true);
  assert.equal(P.enBandeja(CASOS.mural, { x: 10, y: 9999 }), false, 'sin bandeja, nunca');
  assert.ok(P.ancla(CASOS.simulacro, 'C'), 'también las letras de las alternativas');
});

test('toques: una zona tocable por alternativa, dentro del lienzo, sin pisarse y con su control', () => {
  const d = Object.assign({ toques: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' } }, CASOS.simulacro);
  const svg = P.dibujar(d, {});
  const zonas = [...svg.matchAll(/<rect class="rv-toque" data-toque="(\w)" x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)"/g)]
    .map(m => ({ c: m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5] }));
  assert.deepEqual(zonas.map(z => z.c), ['a', 'b', 'c', 'd', 'e']);
  const alto = +/viewBox="0 0 \d+ ([\d.]+)"/.exec(svg)[1];
  for (const z of zonas) {
    assert.ok(z.x >= 4 && z.x + z.w <= 316 && z.y >= 4 && z.y + z.h <= alto - 4, `zona ${z.c} dentro del lienzo`);
    assert.ok(z.h >= 24, `zona ${z.c}: al menos 24 de alto para el dedo`);
  }
  for (let k = 1; k < zonas.length; k++) assert.ok(zonas[k].y >= zonas[k - 1].y + zonas[k - 1].h - 0.5, `${zonas[k].c} no pisa a ${zonas[k - 1].c}`);
  assert.equal(P.dibujar(CASOS.simulacro, {}).includes('data-toque'), false, 'sin toques, ninguna zona');
});

// textLength (la medida del kit) se pone solo en renglones llenos que no cierran su párrafo. Medido en Chromium con
// las 250 figuras de la unidad (17 nov, 5524 renglones): antes, con textLength en todo renglón de más de 3 letras, el
// ancho real iba de −9 % a +31 % del medido y se repartían hasta 2,2 de espacio entre letras («f r í o .») o se
// encimaban («ncche», «Pun o»); ahora, solo en los llenos, va de −6 % a +9 %: menos de 0,65 entre cada par de letras.
test('textLength solo en renglones llenos que no cierran su párrafo, y nunca más de 0,8 entre letras', () => {
  for (const [nombre, d] of Object.entries(CASOS)) {
    const L = P.disponer(d), its = L.items.concat(L.frase ? L.frase.lineas : []).filter(i => i.texto !== undefined && i.tipo !== 'num' && i.tipo !== 'letra' && i.tipo !== 'banda');
    // El último renglón de cada párrafo (oración, alternativa, título, firma, nota, pregunta o frase) no se estira.
    const grupos = {};
    for (const it of its) (grupos[`${it.tipo}|${it.id || ''}|${it.tam}`] = grupos[`${it.tipo}|${it.id || ''}|${it.tam}`] || []).push(it);
    for (const g of Object.values(grupos)) {
      const ult = g[g.length - 1];
      if (g.length && !['titulo', 'firma', 'nota'].includes(ult.tipo)) assert.equal(ult.estira, false, `${nombre}: «${ult.texto}» cierra su párrafo y se estira`);
    }
    for (const it of its.filter(i => i.estira)) {
      assert.ok([...it.texto].length >= 12, `${nombre}: «${it.texto}» es corto y se estira`);
      assert.ok(0.09 * it.w / ([...it.texto].length - 1) < 0.8, `${nombre}: «${it.texto}» repartiría más de 0,8 entre letras`);
    }
    const s = P.dibujar(d, {}), conTL = [...s.matchAll(/<text [^>]*textLength="[^"]+"[^>]*>([^<]*)</g)].map(m => m[1]);
    assert.equal(conTL.length, its.filter(i => i.estira).length, `${nombre}: textLength solo donde estira`);
    assert.ok(!conTL.some(x => x.endsWith('renglones.')), `${nombre}: el cierre de una oración no lleva textLength`);
  }
});

test('aire bajo el marco para la lupa de la app, y sin halo sobre un fondo teñido', () => {
  for (const [nombre, d] of Object.entries(CASOS)) {
    const L = P.disponer(d);
    const fondo = Math.max(L.marco.y + L.marco.h, ...L.papeles.filter(p => p.w).map(p => p.y + p.h + (d.soporte === 'folleto' ? 6 : 0)), L.bandeja ? L.bandeja.y + L.bandeja.h : 0, L.frase ? L.frase.y + L.frase.h : 0);
    assert.ok(L.alto - fondo >= 12, `${nombre}: la lupa pisaría el marco (${L.alto - fondo})`);
  }
  assert.match(P.dibujar(CASOS.mensaje, {}), /class="rv-sin-halo"[^>]*>Familias de 5.º B</);
  assert.match(P.dibujar(CASOS.cartel, {}), /class="rv-sin-halo"[^>]*>Comunicado/);
});

// Etapa 5 (Definiciones): el soporte «diccionario».
test('diccionario: el lema va en negrita al inicio de su entrada, el lomo y los uñeros son dibujos de prueba y caben', () => {
  const d = CASOS.diccionario, s = P.dibujar(d, {}), L = P.disponer(d);
  for (const lema of ['puente', 'puerta', 'pupitre']) assert.match(s, new RegExp(`<tspan font-weight="700">${lema}\\.</tspan> Oración`), lema);
  assert.match(s, /data-objeto="diccionario" data-prueba="si"/);
  assert.match(s, /data-objeto="uneros" data-prueba="si"/);
  assert.match(P.alt(d), /Página de diccionario \(Diccionario escolar\).*1\. puente\. Oración/);
  const papel = L.papeles.find(p => p.w);
  assert.ok(papel.x - 12 >= 4 && papel.x + papel.w <= 316, 'el lomo y la página caben con 4 de margen');
  // Los uñeros (radio 9) no llegan al texto: el renglón termina 12 antes del canto.
  for (const it of L.items.filter(i => i.tipo === 'linea')) assert.ok(it.x + it.w <= papel.x + papel.w - 9 - 1, `«${it.texto}» toca un uñero`);
  // Una entrada sin lema se dibuja como siempre.
  assert.ok(!/<tspan/.test(P.dibujar(CASOS.mural, {})));
});

// Etapa 7 (Sentido contextual): oraciones en trozos. Cada renglón es un solo <text> (nada se pisa); la marca de un trozo
// es su color con un subrayado del trazo de su color; la reserva fija el ancho y el alto no cambia con la palabra.
test('trozos: la palabra se marca dentro de su renglón, la reserva no mueve nada y todo cabe', () => {
  const nota = w => ({ soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'a', titulo: 'Notas', de: '5.º B', para: 'el colegio', oraciones: [
    { id: 'n1', t: `El cielo de Puno amaneció ${w}, sin una sola nube en toda la mañana del sábado.`, frags: [
      { id: 'n1a', t: 'El cielo de Puno amaneció' }, { id: 'n1w', t: w, negrita: true, reserva: 'comprensible' }, { id: 'n1b', t: ',' },
      { id: 'n1p', t: 'sin una sola nube' }, { id: 'n1c', t: 'en toda la mañana del sábado.' }] }] }] });
  const a = P.disponer(nota('claro')), b = P.disponer(nota('comprensible'));
  assert.equal(a.alto, b.alto, 'cambiar la palabra no cambia el alto');
  assert.deepEqual(a.items.filter(i => i.tipo === 'linea').map(i => i.y), b.items.filter(i => i.tipo === 'linea').map(i => i.y));
  for (const L of [a, b]) for (const it of L.items.filter(i => i.trozos)) {
    assert.ok(it.x >= 4 && it.x + it.w <= 320 - 4, `«${it.texto}» cabe`);
    assert.equal(it.texto, it.trozos.map(t => t.pre + t.t).join(''), 'el renglón es la suma de sus trozos');
    assert.equal(it.estira, false, 'un renglón en trozos no se estira: textLength parte el subrayado');
  }
  const s = P.dibujar(nota('despejado'), { marcas: { n1w: 'f', n1p: 'i' }, tachar: ['n1c'] });
  assert.ok(/<tspan class="rv-trozo rv-sub" fill="var\(--c-f\)" font-weight="700"[^>]*text-decoration:underline dotted[^>]*>despejado<\/tspan>/.test(s), 'la palabra en violeta, negrita, punteado');
  assert.ok(/fill="var\(--c-i\)"[^>]*underline solid[^>]*>sin una sola nube</.test(s), 'la pista en turquesa, continuo');
  assert.ok(/class="rv-trozo rv-tacha"[^>]*line-through/.test(s), 'lo tachado, con su raya');
  assert.ok(!/NaN|undefined/.test(s));
  const sin = P.dibujar(nota('claro'), {});
  assert.ok(!/var\(--c-/.test(sin), 'sin estado, sin colores');
  assert.ok(/<tspan class="rv-trozo" font-weight="700">claro<\/tspan>/.test(sin), 'la palabra por la que se pregunta, en negrita y en tinta');
  assert.ok(P.alt(nota('claro')).includes('amaneció claro, sin una sola nube'), 'el texto alternativo lee la oración entera');
  const toque = P.dibujar(Object.assign(nota('claro'), { toques: { n1: 'w1' } }), {});
  assert.ok(/data-toque="w1"[^>]*><title>Tocar para cambiar esta oración<\/title>/.test(toque), 'la oración entera se toca');
});

// Etapa 7 (cierre de Sentido contextual, lector en frío A): `num` cambia la marca de una oración. La oración que se
// estudia va sin número y las palabras que se prueban, con raya: así no parecen cinco oraciones numeradas juntas.
test('num: una oración sin número y una lista con raya; sin `num`, se numera como siempre', () => {
  const d = { soporte: 'cuaderno', lugar: 'Cuaderno', hojas: [{ id: 'k', titulo: 'Prueba', de: 'Sofía', para: 'la clase', oraciones: [
    { id: 'c0', t: 'La explicación fue clara.', num: '' }, { id: 'c1', t: 'nublada', num: '–' }, { id: 'c2', t: 'confusa', num: '–' }] }] };
  const nums = P.disponer(d).items.filter(i => i.tipo === 'num');
  assert.deepEqual(nums.map(n => [n.id, n.texto]), [['c1', '–'], ['c2', '–']]);
  assert.ok(!/NaN|undefined/.test(P.dibujar(d, { senal: ['c0'] })));
  assert.deepEqual(P.disponer(CASOS.mural).items.filter(i => i.tipo === 'num').map(n => n.texto).slice(0, 2), ['1', '2']);
});
