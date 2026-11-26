'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const P = require('./fis-fluidos-e12.js'), Kit = require('../kit.js');
const copia = x => JSON.parse(JSON.stringify(x));
const cerca = (a, b) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${a} frente a ${b}`);
const cajaCruza = (a, b) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 1e-7 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 1e-7;
const ampliar = (b, margen) => ({ x0: b.x0 - margen, x1: b.x1 + margen, y0: b.y0 - margen, y1: b.y1 + margen });
// Recorte de Liang–Barsky, independiente de la generación de los trazos.
function corta(b, a, z) { let lo = 0, hi = 1; const dx = z[0] - a[0], dy = z[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - b.x0], [dx, b.x1 - a[0]], [-dy, a[1] - b.y0], [dy, b.y1 - a[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return false; } else { const r = q / p; if (p < 0) lo = Math.max(lo, r); else hi = Math.min(hi, r); if (lo > hi) return false; }
  } return hi - lo > 1e-7;
}
function revisar(d, estado = {}) {
  const g = P.geometria(d, estado), svg = P.dibujar(d, estado);
  assert.doesNotMatch(svg, /NaN|Infinity|#[0-9a-f]{3,8}\b/i);
  for (const r of g.rotulos) {
    assert.ok(r.x0 >= 4 && r.y0 >= 4 && r.x1 <= 316 && r.y1 <= g.H - 4, r.texto + ': margen');
    assert.ok(r.tam >= 14);
    for (const o of g.objetos.filter(o => o.solido)) assert.ok(!cajaCruza(r, o), r.texto + ': cuerpo ' + o.id);
    for (const li of g.segmentos) assert.ok(!corta(ampliar(r, li.grosor / 2), li.de, li.a), r.texto + ': trazo ' + li.id);
    for (const f of g.flechas) {
      assert.ok(!corta(ampliar(r, f.grosor / 2), f.de, f.a), r.texto + ': flecha');
      for (let i = 0; i < 3; i++) assert.ok(!corta(r, f.punta[i], f.punta[(i + 1) % 3]), r.texto + ': punta');
    }
  }
  for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!cajaCruza(g.rotulos[i], g.rotulos[j]), 'Rótulos superpuestos');
  for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= 316 && o.y0 >= 4 && o.y1 <= g.H - 4);
  return g;
}
const piston = F => ({ tipo: 'prensa', escala: { transversal: 4000, fuerza: 1 }, prensa: { profundidad: .1, pistones: [{ id: 'cara', area: .002 }] }, flechas: [{ id: 'f', ref: 'cara', magnitud: F }], rotulos: [{ ref: 'cara', texto: 'Área: 20 cm²', color: 'd' }, { ref: 'cara', fila: 1, texto: `F = ${Math.round(F)} N`, color: 'h' }] });
const vaso = () => ({ tipo: 'vasos', escala: { vertical: 500, transversal: 500 }, vasos: [{ id: 'agua', alto: .3, ancho: .2, nivel: .2 }], puntos: [{ id: 'punto-1', recipiente: 'agua', altura: .1, texto: '1' }], cotas: [{ de: 'superficie-agua', a: 'punto-1', texto: 'h', color: 'd' }], rotulos: [{ ref: 'agua', texto: 'Agua', color: 'f' }] });

test('Fluidos E12: registro, pureza y texto del Kit sin renderer propio', () => {
  assert.equal(Kit.piezas[P.id], P);
  const d = piston(40), antes = copia(d); const freeze = o => { Object.values(o).filter(v => v && typeof v === 'object').forEach(freeze); Object.freeze(o); }; freeze(d);
  assert.equal(P.dibujar(d), P.dibujar(d)); assert.deepEqual(d, antes);
  const s = P.dibujar(d); assert.match(s, /class="kit-txt/); assert.match(s, /font-size="14"/); assert.match(s, /var\(--c-d\)/); assert.match(s, /var\(--c-h\)/);
});

test('Fluidos E12: pistón de 20 cm², cuatro controles y 400 fuerzas conservan área y escala', () => {
  for (const F of [...[20, 40, 60, 80], ...Array.from({ length: 400 }, (_, i) => 20 + 60 * i / 399)]) {
    const g = revisar(piston(F)), cara = g.referencias.cara, flecha = g.flechas[0];
    cerca(cara.alturaCara, 80); cerca((cara.abajo - cara.arriba) / 4000 * .1, 20 / 10000);
    cerca(Math.hypot(flecha.a[0] - flecha.de[0], flecha.a[1] - flecha.de[1]), F);
    assert.ok(flecha.a[0] > flecha.de[0]); cerca(flecha.a[1], cara.y);
    assert.equal(g.superficies.length, 0); assert.doesNotMatch(P.alt(piston(F)), /Pa|presión.*(?:sube|baja|mayor|menor)/);
  }
});

test('Fluidos E12: dos caras independientes usan la misma escala y no una cámara común', () => {
  const d = { tipo: 'prensa', escala: { transversal: 2000, fuerza: .5 }, prensa: { profundidad: .1, conectados: false, pistones: [{ id: 'cara-1', area: .003 }, { id: 'cara-2', area: .0015 }] }, flechas: [{ ref: 'cara-1', magnitud: 90 }, { ref: 'cara-2', magnitud: 90 }], rotulos: [{ ref: 'cara-1', texto: '30 cm²', color: 'd' }, { ref: 'cara-2', texto: '15 cm²', color: 'd' }] };
  const g = revisar(d); cerca(g.referencias['cara-1'].alturaCara, 60); cerca(g.referencias['cara-2'].alturaCara, 30);
  for (const f of g.flechas) cerca(f.a[0] - f.de[0], 45);
  assert.ok(!g.segmentos.some(x => x.id.startsWith('prensa-superior')));
});

test('Fluidos E12: prensa prismática horizontal conserva proporción de áreas y recorridos en 400 casos', () => {
  for (let s = 0; s < 400; s++) {
    const A = .001 + .000002 * s, r = .02 * s / 399;
    const d = { tipo: 'prensa', escala: { transversal: 2000, axial: 1000, fuerza: 1 }, prensa: { profundidad: .1, pistones: [{ id: 'pequeno', area: A, recorrido: r }, { id: 'grande', area: 2 * A, recorrido: r / 2 }] }, flechas: [{ ref: 'pequeno', magnitud: 20 + 20 * s / 399 }], rotulos: [{ ref: 'pequeno', texto: 'Pequeño' }, { ref: 'grande', texto: 'Grande' }] };
    const g = revisar(d), a = g.referencias.pequeno, b = g.referencias.grande;
    cerca(a.y, b.y); cerca(b.alturaCara / a.alturaCara, 2); cerca((a.x - g.referencias['inicio-pequeno'].x) / 1000, r); cerca((b.x - g.referencias['inicio-grande'].x) / 1000, r / 2);
  }
});

test('Fluidos E12: 400 niveles, puntos y cotas usan profundidad vertical con inversa exacta', () => {
  for (let s = 0; s < 400; s++) {
    const d = vaso(), nivel = .1 + .1 * s / 399, altura = nivel - .05;
    d.vasos[0].nivel = nivel; d.puntos[0].altura = altura;
    const g = revisar(d), sup = g.referencias['superficie-agua'], punto = g.referencias['punto-1'];
    cerca(punto.y - sup.y, 25); cerca(g.Yi(sup.y), nivel); cerca(g.Yi(punto.y), altura);
    const c = g.segmentos.filter(x => x.tipo === 'cota'); assert.equal(c.length, 3); cerca(Math.abs(c[0].a[1] - c[0].de[1]), 25);
  }
  for (const cantidad of [1, 2, 3]) {
    const d = { tipo: 'vasos', escala: { vertical: 500, transversal: 500 }, vasos: Array.from({ length: cantidad }, (_, i) => ({ id: 'v' + i, alto: .3, ancho: .08, anchoSuperior: .1, nivel: .2, tono: i + 1 })) };
    const g = revisar(d); assert.equal(g.superficies.length, cantidad); for (const s of g.superficies) cerca(s.y, 142);
  }
});

test('Fluidos E12: esquemas e incógnitas no dependen de los valores ocultos ni de metadatos', () => {
  const a = { tipo: 'vasos', modo: 'esquema', vasos: [{ id: 'tanque', tapa: true }], puntos: [{ id: 'punto', recipiente: 'tanque' }], cotas: [{ de: 'superficie-tanque', a: 'punto', texto: 'h = ?' }] };
  const b = copia(a); Object.assign(b.vasos[0], { alto: 999, ancho: 123, nivel: 456 }); b.puntos[0].altura = 789; b.verificacion = { respuesta: 4321 };
  revisar(a); assert.equal(P.dibujar(a), P.dibujar(b)); assert.equal(P.alt(a), P.alt(b)); assert.doesNotMatch(P.dibujar(b), /4321|999|456|789/);
  const p = { tipo: 'prensa', modo: 'esquema', prensa: { pistones: [{ id: 'cara' }] } }, q = copia(p); q.prensa.pistones[0].area = 123;
  revisar(p); assert.equal(P.dibujar(p), P.dibujar(q)); assert.match(P.dibujar(p), /Esquema sin escala/);
});

test('Fluidos E12: reemplazo de escena en Mira y pasos afectan dibujo, geometría y alt', () => {
  const d = piston(40), v = vaso(); v.alt = 'Recipiente y punto señalado.'; v.rotulos.push({ texto: 'Solo al revelar', fila: 2, desde: 2 });
  const e = { datos: v, paso: 0 }; const g = revisar(d, e);
  assert.ok(g.referencias.agua); assert.equal(g.referencias.cara, undefined); assert.equal(P.alt(d, e), v.alt);
  assert.doesNotMatch(P.dibujar(d, e), /Solo al revelar|20 cm²/);
  assert.match(P.dibujar(d, { datos: v, paso: 2 }), /Solo al revelar/);
});

test('Fluidos E12: entradas imposibles fallan sin recortar, inventar datos ni reducir letra', () => {
  const d = vaso(); delete d.escala.vertical; assert.throws(() => P.dibujar(d), /escala.vertical/);
  const n = vaso(); n.vasos[0].nivel = .5; assert.throws(() => P.dibujar(n), /rango/);
  const p = piston(1); assert.throws(() => P.dibujar(p), /16 px/);
  const l = piston(40); l.rotulos[0].texto = 'Un rótulo demasiado largo para caber dentro del lienzo sin recortar'; assert.throws(() => P.dibujar(l), /marco/);
  const x = vaso(); x.puntos[0].altura = .4; assert.throws(() => P.dibujar(x), /fuera/);
  assert.throws(() => P.dibujar(piston(40), { datos: null }), /reemplazo completo/);
});

test('Fluidos E12: 400 salidas laterales tienen altura dada y no inventan rapidez ni vaciado', () => {
  for (let s = 0; s < 400; s++) {
    const altura = .04 + .07 * s / 399, nivel = .16 + .04 * s / 399;
    const d = { tipo: 'vasos', escala: { vertical: 600, transversal: 600 }, vasos: [{ id: 'deposito', alto: .3, ancho: .2, nivel, salida: { id: 'salida', altura, lado: s % 2 ? 'izq' : 'der' } }], rotulos: [{ texto: 'Depósito' }] };
    const g = revisar(d), p = g.referencias.salida, sup = g.referencias['superficie-deposito'];
    cerca((p.y - sup.y) / 600, nivel - altura); cerca(g.Yi(p.y), altura);
    assert.equal(g.flechas.length, 0); assert.doesNotMatch(P.alt(d), /rapidez|velocidad|constante|vacía|segundo/);
    const paredes = g.segmentos.filter(x => /pared-(superior|inferior)/.test(x.id));
    assert.equal(paredes.length, 2); for (const li of paredes) assert.ok(!corta({ x0: p.x - 20, x1: p.x + 20, y0: p.y - 3, y1: p.y + 3 }, li.de, li.a));
  }
  const d = { tipo: 'vasos', modo: 'esquema', vasos: [{ id: 'deposito', salida: { id: 'salida' } }] };
  const e = copia(d); e.vasos[0].salida.altura = 12345; e.vasos[0].nivel = 7654;
  revisar(d); assert.equal(P.dibujar(d), P.dibujar(e));
  const q = vaso(); q.vasos[0].salida = { altura: 0 }; assert.throws(() => P.dibujar(q), /pared lateral/);
});

test('Fluidos E12: tapas de fondo y gas encerrado conservan orden físico en medida y esquema', () => {
  for (const modo of ['medida', 'esquema']) {
    const d = vaso(); d.modo = modo; d.vasos[0].tapa = 'fondo'; d.vasos[0].cerrado = true;
    d.puntos = []; d.cotas = [{ de: 'superficie-agua', a: 'tapa-agua', texto: 'h' }];
    const g = revisar(d), fondo = g.referencias['tapa-agua'];
    assert.equal(fondo.y, g.referencias['fondo-agua'].y); assert.ok(fondo.y > g.referencias['superficie-agua'].y);
    const superior = g.segmentos.find(x => x.id === 'agua-cierre-superior'); assert.ok(superior); assert.ok(superior.de[1] < g.referencias['superficie-agua'].y);
  }
});

test('Fluidos E12: 400 estados de U conservan escala, volumen y lectura de interfaces', () => {
  for (let s = 0; s < 400; s++) {
    const delta = .15 * s / 399, h1 = .2 - delta / 2, h2 = .2 + delta / 2;
    const d = { tipo: 'tubo-u', escala: { vertical: 500, transversal: 1000 }, tuboU: { alto: .35, ancho: .025, ramas: [{ id: 'rama-1', capas: [{ alto: h1 }] }, { id: 'rama-2', capas: [{ alto: h2 }] }] }, rotulos: [{ ref: 'rama-1', texto: 'Rama 1' }, { ref: 'rama-2', texto: 'Rama 2' }] };
    const g = revisar(d), a = g.referencias['superficie-rama-1'], b = g.referencias['superficie-rama-2'];
    cerca(a.y - b.y, delta * 500); cerca(g.Yi(a.y) + g.Yi(b.y), .4); cerca(g.referencias['rama-1'].der - g.referencias['rama-1'].izq, 25);
  }
  const capas = { tipo: 'tubo-u', escala: { vertical: 500, transversal: 1000 }, tuboU: { alto: .35, ancho: .025, ramas: [{ id: 'rama-1', capas: [{ alto: .14, tono: 3 }, { alto: .15, tono: 1 }] }, { id: 'rama-2', capas: [{ alto: .26, tono: 3 }] }] } };
  const g = revisar(capas); cerca(g.Yi(g.referencias['interfaz-rama-1-1'].y), .14); cerca(g.Yi(g.referencias['superficie-rama-1'].y), .29); cerca(g.Yi(g.referencias['superficie-rama-2'].y), .26);
});

test('Fluidos E12: 400 columnas de barómetro miden desde la cubeta y no suponen vacío', () => {
  for (let s = 0; s < 400; s++) {
    const h = .3 + .5 * s / 399;
    const d = { tipo: 'barometro', escala: { vertical: 200, transversal: 1000 }, barometro: { alto: .95, ancho: .025, columna: h }, cotas: [{ de: 'cubeta', a: 'columna', separacion: 44, texto: 'h' }] };
    const g = revisar(d); cerca(g.referencias.cubeta.y - g.referencias.columna.y, h * 200); assert.doesNotMatch(P.dibujar(d), /Vacío|Gas/);
    d.barometro.camara = s % 2 ? 'gas' : 'vacio'; revisar(d); assert.match(P.dibujar(d), s % 2 ? /Gas/ : /Vacío/);
  }
});

test('Fluidos E12: 400 flujos por forma respetan áreas, alturas y velocidades dadas', () => {
  for (const forma of ['prismatico', 'circular']) for (let s = 0; s < 400; s++) {
    const area = .0004 + .0002 * s / 399, v = .5 + 1.5 * s / 399, z = .03 * s / 399;
    const k = forma === 'circular' ? 1800 : 4000;
    const d = { tipo: 'flujo', escala: { transversal: k, rapidez: 32, vertical: 500 }, flujo: { forma, profundidad: .05, secciones: [{ id: 'entrada', area }, { id: 'salida', area: 2 * area, z }] }, flechas: [{ ref: 'entrada', clase: 'rapidez', magnitud: v, anclaje: 'centro' }], rotulos: [{ ref: 'entrada', texto: 'Entrada' }, { ref: 'salida', texto: 'Salida' }] };
    const g = revisar(d), a = g.referencias.entrada, b = g.referencias.salida;
    if (forma === 'prismatico') { cerca(a.alturaCara / k * .05, area); cerca(b.alturaCara / a.alturaCara, 2); }
    else { cerca((a.alturaCara / k / 2) ** 2 * (4 * Math.atan(1)), area); cerca((b.alturaCara / a.alturaCara) ** 2, 2); }
    cerca(a.y - b.y, z * 500); cerca(g.flechas[0].a[0] - g.flechas[0].de[0], v * 32);
  }
  const d = { tipo: 'flujo', escala: { transversal: 4000, vertical: 500 }, flujo: { forma: 'prismatico', profundidad: .05, secciones: [{ id: 'entrada', area: .0004, columna: .16 }, { id: 'salida', area: .0004, columna: .1 }] } };
  const g = revisar(d); cerca(g.referencias.entrada.y - g.referencias['columna-entrada'].y, 80); cerca(g.referencias.salida.y - g.referencias['columna-salida'].y, 50);
  delete d.flujo.forma; assert.throws(() => P.dibujar(d), /forma/);
});

test('Fluidos E12: 400 inmersiones sostenidas dibujan el nivel dado, sin calcular fuerza ni flotación', () => {
  for (let s = 0; s < 400; s++) {
    const sumergido = .0006 * s / 399, nivel = .14 + sumergido / .012, base = nivel - sumergido / .005;
    const d = { tipo: 'vasos', escala: { vertical: 600, transversal: 600 }, vasos: [{ id: 'tina', alto: .28, ancho: .24, nivel, bloque: { id: 'bloque', ancho: .1, alto: .12, base, soporte: 'superior' } }], rotulos: [{ ref: 'tina', texto: 'Soporte superior' }] };
    const g = revisar(d), b = g.referencias.bloque;
    cerca((b.abajo - b.arriba) / 600, .12); cerca(g.Yi(b.abajo), base); cerca(g.Yi(g.referencias['superficie-tina'].y), nivel);
    cerca(.012 * (nivel - .14), sumergido); assert.equal(g.flechas.length, 0); assert.ok(g.segmentos.some(x => x.id === 'bloque-cuerda'));
    assert.doesNotMatch(P.alt(d), /flota|hundirá|tensión|600/);
  }
});

test('Fluidos E12: capas dadas y relaciones de inmersión canónicas no reciben soluciones', () => {
  for (let s = 0; s < 400; s++) {
    const h1 = .06 + .04 * s / 399, h2 = .1;
    const d = { tipo: 'vasos', escala: { vertical: 600, transversal: 600 }, vasos: [{ id: 'tina', alto: .3, ancho: .24, capas: [{ alto: h1, tono: 3 }, { alto: h2, tono: 1 }], bloque: { id: 'bloque', ancho: .1, alto: .1, base: h1 - .06 } }] };
    const g = revisar(d), b = g.referencias.bloque, interfaz = g.referencias['interfaz-tina-1'];
    cerca(g.Yi(interfaz.y), h1); cerca(g.Yi(g.referencias['superficie-tina'].y), h1 + h2);
    cerca((b.abajo - interfaz.y) / 600, .06); cerca((interfaz.y - b.arriba) / 600, .04);
  }
  for (const inmersion of ['completa', 'parcial', 'fuera']) for (const forma of ['regular', 'ancho']) {
    const d = { tipo: 'vasos', modo: 'esquema', vasos: [{ id: 'tina', capas: [{ tono: 3 }, { tono: 1 }], bloque: { id: 'bloque', inmersion, forma } }] };
    const g = revisar(d), b = g.referencias.bloque, sup = g.referencias['superficie-tina'];
    if (inmersion === 'completa') assert.ok(b.arriba > sup.y && b.abajo < 242);
    if (inmersion === 'parcial') assert.ok(b.arriba < sup.y && b.abajo > sup.y);
    if (inmersion === 'fuera') assert.ok(b.abajo < sup.y);
    if (forma === 'ancho') assert.ok(b.der - b.izq > b.abajo - b.arriba);
    const e = copia(d); Object.assign(e.vasos[0].bloque, { ancho: 123, alto: 456, base: 789 }); e.vasos[0].capas[0].alto = 999;
    assert.equal(P.dibujar(d), P.dibujar(e)); assert.equal(P.alt(d), P.alt(e));
  }
  const d = vaso(); d.vasos[0].capas = [{ alto: .1 }]; assert.throws(() => P.dibujar(d), /coincidir/);
});

test('Fluidos E12: 400 fracciones publicadas conservan proporción del bloque prismático', () => {
  for(let s=0;s<400;s++) {
    const fraccion=s/399,d={tipo:'vasos',modo:'esquema',vasos:[{id:'tina',bloque:{id:'bloque',forma:s%2?'ancho':'regular',fraccionDada:fraccion}}]};
    const g=revisar(d),b=g.referencias.bloque,sup=g.referencias['superficie-tina'];
    cerca((b.abajo-sup.y)/(b.abajo-b.arriba),fraccion);
  }
  const d={tipo:'vasos',modo:'esquema',vasos:[{id:'tina',bloque:{fraccionDada:1.1}}]};
  assert.throws(()=>P.dibujar(d),/fraccionDada/);d.vasos[0].bloque={inmersion:'completa',fraccionDada:.4};assert.throws(()=>P.dibujar(d),/contradice/);
});

test('Fluidos E12: 400 repartos publicados entre dos capas conservan volúmenes relativos', () => {
  for(let s=0;s<400;s++){
    const fraccion=.3+.4*s/399,d={tipo:'vasos',modo:'esquema',vasos:[{id:'tina',capas:[{tono:3},{tono:1}],bloque:{id:'bloque',inmersion:'completa',fraccionSuperiorDada:fraccion,forma:s%2?'ancho':'regular'}}]};
    const g=revisar(d),b=g.referencias.bloque,y=g.referencias['interfaz-tina-1'].y;
    cerca((y-b.arriba)/(b.abajo-b.arriba),fraccion);cerca((b.abajo-y)/(b.abajo-b.arriba),1-fraccion);
    assert.ok(b.arriba>=g.referencias['superficie-tina'].y&&b.abajo<=242);
  }
  for(const bloque of[{inmersion:'completa',fraccionSuperiorDada:0},{inmersion:'parcial',fraccionSuperiorDada:.4}]){
    const d={tipo:'vasos',modo:'esquema',vasos:[{id:'tina',capas:[{},{}],bloque}]};assert.throws(()=>P.dibujar(d),/fraccionSuperiorDada/);
  }
});
