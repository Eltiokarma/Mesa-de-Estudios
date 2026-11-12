// Pruebas del generador de sólidos de revolución: casos.json (verificados aparte, a ciegas), papel.json
// contra calc y un recálculo independiente en cada uno de 600 problemas.
// El camino independiente no usa las fórmulas cerradas: integra discos y anillos con Simpson, usa el
// teorema de Pappus con el centroide de la región (fórmula del cordón), busca radios por bisección y
// pone los puntos en coordenadas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const PI = Math.PI;
function simpson(fn, a, b, n = 2000) {
  const hh = (b - a) / n; let s = fn(a) + fn(b);
  for (let i = 1; i < n; i++) s += fn(a + i * hh) * (i % 2 ? 4 : 2);
  return s * hh / 3;
}
function biseccion(fn, a, b) { // fn creciente con fn(a) < 0 < fn(b)
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (fn(m) < 0) a = m; else b = m; }
  return (a + b) / 2;
}
function cordon(pts) { let A = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; A += x1 * y2 - x2 * y1; } return Math.abs(A) / 2; }
// Respuestas aπ − b√3: la clave «mix:n/m|n/m» se lleva a número para comparar.
const numero = x => { if (typeof x === 'number') return x; const [a, b] = x.slice(4).split('|').map(q => { const [n, m] = q.split('/').map(Number); return n / m; }); return a * PI - b * Math.sqrt(3); };
const discos = (rho, a, b) => simpson(z => PI * rho(z) ** 2, a, b);
const lineal = (r, R, H) => z => r + (R - r) * z / H;
// Polígono: área y centroide por la fórmula del cordón.
function centroide(pts) {
  let A = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length], c = x1 * y2 - x2 * y1;
    A += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c;
  }
  A /= 2; return { A: Math.abs(A), x: cx / (6 * A), y: cy / (6 * A) };
}
// Radio de la esfera inscrita en el cono (R, H): centro (0, y) a igual distancia de la base y de la generatriz.
function inscrita(R, H) {
  // Generatriz: recta por (R, 0) y (0, H): H x + R y − R H = 0.
  const dist = y => Math.abs(R * y - R * H) / Math.hypot(H, R);
  return biseccion(y => y - dist(y), 0, H);
}
const SEN = { 37: 0.6, 53: 0.8, 30: 0.5 };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'tronco-volumen': {
      if (d.sub === 'radios') return discos(lineal(d.r, d.R, d.h), 0, d.h);
      if (d.sub === 'generatriz') { const h = Math.sqrt(d.g ** 2 - (d.R - d.r) ** 2); return discos(lineal(d.r, d.R, h), 0, h); }
      const h = Math.sqrt(d.g ** 2 - (d.R - d.r) ** 2);
      return discos(() => d.R, 0, d.H) + discos(lineal(d.r, d.R, h), 0, h);
    }
    case 'tronco-area': {
      const g = Math.hypot(d.h, d.R - d.r);
      const lat = simpson(s => 2 * PI * (d.r + (d.R - d.r) * s / g), 0, g);
      return d.sub === 'pantalla' ? lat : lat + simpson(() => 2 * PI * d.r, 0, d.H);
    }
    case 'tronco-llenado': {
      if (d.sub === 'tronco') return discos(lineal(d.r, d.R, d.H), 0, d.H * d.p / d.q);
      if (d.sub === 'cono') return discos(lineal(0, d.R, d.H), 0, d.H * d.p / d.q);
      if (d.sub === 'suma') { const R = (d.S + d.D) / 2, r = (d.S - d.D) / 2; return biseccion(H => discos(lineal(r, R, H), 0, H) - d.V3pi * PI / 3, 0.01, 100); }
      if (d.sub === 'inclinado') {
        // Superficie inclinada que pasa por el borde de la boca (altura H en x = r) y por la altura g en x = −r:
        // se integra el agua por rebanadas verticales y se busca g con el volumen inicial πr²h0.
        const vol = g => simpson(t => (g + (d.H - g) * (d.r * Math.sin(t) + d.r) / (2 * d.r)) * 2 * d.r * d.r * Math.cos(t) ** 2, -PI / 2, PI / 2);
        return biseccion(g => vol(g) - PI * d.r * d.r * d.h0, 0, d.H);
      }
      return biseccion(H => discos(lineal(d.r, d.R, H), 0, H) - d.V3pi * PI / 3, 0.01, 100);
    }
    case 'desplazamiento': {
      if (d.sub === 'cubo') return biseccion(s => discos(() => d.d / 2, 0, s) - d.a ** 3, 0, 100);
      if (d.sub === 'esfera') { const Ve = discos(z => Math.sqrt(Math.max(0, d.rho ** 2 - z * z)), -d.rho, d.rho); return biseccion(s => PI * (d.d / 2) ** 2 * s - Ve, 0, 100); }
      if (d.sub === 'pieza') return discos(() => d.d / 2, 0, d.s);
      if (d.sub === 'piramide') {
        // Vaso por discos; pirámide por rebanadas: hexágono (fórmula del cordón) que se achica linealmente.
        const hex = l => cordon(Array.from({ length: 6 }, (_, k) => [l * Math.cos(k * PI / 3), l * Math.sin(k * PI / 3)]));
        const Vp = simpson(z => hex(d.s * (1 - z / d.hp)), 0, d.hp);
        return discos(lineal(d.r, d.R, d.H), 0, d.H) - Vp;
      }
      return discos(lineal(d.r, d.R, d.H), d.h1, d.h2);
    }
    case 'region-gira': {
      if (d.sub === 'triangulo') {
        if (d.eje === 'x') return simpson(x => PI * (d.b * x / d.a) ** 2, 0, d.a);    // discos
        return simpson(x => 2 * PI * x * (d.b * x / d.a), 0, d.a);                     // cascarones
      }
      if (d.sub === 'trapecio') {
        const h = d.h ?? Math.sqrt(d.CD ** 2 - (d.B - d.b) ** 2);
        const c = centroide([[0, 0], [0, h], [d.b, h], [d.B, 0]]);                   // A, B, C, D
        const dist = { AB: c.x, AD: c.y, BC: h - c.y }[d.eje];
        return 2 * PI * dist * c.A;                                                    // Pappus
      }
      return 2 * PI * (d.d + d.w / 2) * d.w * d.L;
    }
    case 'esfera-segmento': {
      const capa = (R, z1, z2) => discos(z => Math.sqrt(Math.max(0, R * R - z * z)), z1, z2);
      const areaCasquete = (R, z0) => simpson(phi => 2 * PI * R * Math.sin(phi) * R, 0, Math.acos(z0 / R));
      if (d.sub === 'casquete') return areaCasquete(d.R, d.d);
      if (d.sub === 'cubo') {
        // Cubo [−a/2, a/2]³: el radio es la distancia del centro al punto medio de una arista.
        const R = Math.hypot(d.a / 2, d.a / 2, 0);
        const uno = areaCasquete(R, d.a / 2);
        return d.pide === 'uno' ? uno : 6 * uno;
      }
      if (d.sub === 'cupula') { const R = biseccion(R => R * R - d.a ** 2 - (R - d.hh) ** 2, d.hh / 2, 1000); return areaCasquete(R, R - d.hh); }
      if (d.sub === 'una-base') return capa(d.R, d.R - d.hh, d.R);
      if (d.sub === 'equilatero') {
        const v = [90, 210, 330].map(t => [d.R * Math.cos(t * PI / 180), d.R * Math.sin(t * PI / 180)]);
        const [[x1, y1], [x2, y2]] = [v[1], v[2]];
        const dist = Math.abs((x2 - x1) * y1 - (y2 - y1) * x1) / Math.hypot(x2 - x1, y2 - y1);
        return d.pide === 'menor' ? capa(d.R, dist, d.R) : capa(d.R, -d.R, dist);
      }
      const z1 = Math.sqrt(d.R ** 2 - d.a1 ** 2), z2 = Math.sqrt(d.R ** 2 - d.a2 ** 2);
      return d.mismoLado ? capa(d.R, Math.min(z1, z2), Math.max(z1, z2)) : capa(d.R, -z1, z2);
    }
    case 'esfera-cono': {
      if (d.sub === 'razon') {
        const R = d.equilatero ? 1 : d.R, H = d.equilatero ? Math.sqrt(3) : d.H, r = inscrita(R, H), g = Math.hypot(R, H);
        if (d.pide === 'lateral') return 4 * PI * r * r / (PI * R * g);
        if (d.pide === 'total') return 4 * PI * r * r / (PI * R * g + PI * R * R);
        return (4 / 3 * PI * r ** 3) / discos(lineal(R, 0, H), 0, H);
      }
      const R = d.sub === 'liquido' && d.equilatero ? d.H / Math.sqrt(3) : d.R;
      const r = inscrita(R, d.H);
      if (d.sub === 'radio') return r;
      return discos(lineal(R, 0, d.H), 0, d.H) - discos(z => Math.sqrt(Math.max(0, r * r - z * z)), -r, r);
    }
    case 'esferas-tangentes': {
      if (d.sub === 'tres') {
        const lado = d.dato === 'perimetro' ? d.valor / 3 : d.dato === 'area' ? biseccion(s => s * s * Math.sqrt(3) / 4 - d.valor * Math.sqrt(3), 0, 100)
          : biseccion(s => s * Math.sqrt(3) / 2 - d.valor * Math.sqrt(3), 0, 100);
        const r = lado / 2;
        return simpson(phi => 2 * PI * r * Math.sin(phi) * r, 0, PI);
      }
      return Math.sqrt((d.R + d.r) ** 2 - (d.R - d.r) ** 2);
    }
    case 'tronco-cilindro': {
      const vol = (r, g1, g2) => simpson(t => (g1 + (g2 - g1) * (r * Math.sin(t) + r) / (2 * r)) * 2 * r * r * Math.cos(t) ** 2, -PI / 2, PI / 2);
      if (d.sub === 'generatrices') return vol(d.r, d.g1, d.g2);
      const e = biseccion(e => simpson(() => e * d.r, 0, 2 * PI) - d.ALpi * PI, 0, 1000);
      return vol(d.r, e - 1, e + 1); // cualquier par con la misma semisuma
    }
    case 'cilindro-oblicuo': {
      if (d.sub === 'altura') {
        const s = biseccion(s => -(PI * d.r * (d.r / s)) + d.Sbpi[0] / d.Sbpi[1] * PI, 0.01, 1); // la base es una elipse de semiejes r y r/sen θ
        return d.g * s;                                                              // altura = componente vertical de la generatriz
      }
      const s = SEN[d.theta];
      return simpson(() => PI * d.r * (d.r / s), 0, d.g * s);                        // rebanadas horizontales (elipses)
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p), x = numero(p.respuesta.valor);
  return Math.abs(r - x) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
}, igual: (a, b) => a === b || Math.abs(numero(a) - numero(b)) < 1e-9 });
const { probarFugas } = require('../../nucleo/probar-generador.js');
probarFugas(gen, { valorNumerico: a => numero(a.valor) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y todas las variantes', () => {
  const tipos = new Set(), subs = new Set();
  for (let s = 0; s < 1500; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); subs.add(d.tipo + '/' + d.sub); }
  assert.equal(tipos.size, gen.TIPOS.length);
  assert.equal(subs.size, 33);
});

test('cada problema: a lo más 4 colores, distintos, y la correcta se escribe como sus distractores', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length, `semilla ${s}: colores ${colores}`);
    const usadas = new Set([...p.enunciado, ...p.pregunta, ...p.solucion.flat()].filter(x => x && x.v).map(x => x.v));
    for (const k of usadas) assert.ok(p.variables[k], `semilla ${s}: ${k} sin color`);
    const forma = t => (t.includes('/π') || t.includes('π)') ? 'invpi' : t.includes('π') ? 'pi' : t.includes('√') ? 'rad' : 'num');
    const formas = new Set(p.alternativas.map(a => forma(a.texto)));
    if (formas.has('rad')) formas.delete('num'); // a√b y enteros conviven: 6√6 junto a 15
    assert.equal(formas.size, 1, `semilla ${s}: ${p.alternativas.map(a => a.texto)}`);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
  }
});

test('papel.json: entre 6 y 10 problemas, cada uno verificado contra calc', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.id && pr.enunciado && pr.respuesta && pr.pasos.length && pr.verificar.length, pr.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    for (const vf of pr.verificar) {
      const fn = gen.calc[vf.fn];
      assert.ok(fn, `${pr.id}: no existe calc.${vf.fn}`);
      const valor = fn(...vf.args);
      const esperado = typeof vf.espera === 'number' ? vf.espera : vf.espera.pi * PI / (vf.espera.den || 1); // { pi: n, den: m } = nπ/m
      assert.ok(Math.abs(valor - esperado) < 1e-9 * Math.max(1, Math.abs(esperado)), `${pr.id}: ${vf.fn} da ${valor}, se esperaba ${esperado}`);
    }
  }
});
