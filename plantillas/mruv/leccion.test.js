// Pruebas de la lógica de la lección MRU y MRUV (versión A). Los valores esperados están calculados a mano,
// aparte del motor: x = x0 + v·t; encuentro cuando xA = xB; MRUV con x = v0·t + a·t²/2.
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('./leccion.js');

const cerca = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) <= e, `${a} ≠ ${b}`);

test('rapidez del dedo: solo cuentan los últimos 100 ms; quieto al soltar es 0', () => {
  // 300 px/s parejo: 3 px cada 10 ms.
  const parejo = Array.from({ length: 30 }, (_, k) => ({ t: k * 10, x: k * 3 }));
  cerca(L.rapidezDedo(parejo), 300, 1e-6);
  // Rápido al principio y quieto los últimos 150 ms: la rapidez de salida es 0, no la vieja.
  const frena = [...Array.from({ length: 10 }, (_, k) => ({ t: k * 10, x: k * 20 })), ...Array.from({ length: 15 }, (_, k) => ({ t: 100 + k * 10, x: 180 }))];
  assert.equal(L.rapidezDedo(frena), 0);
  assert.equal(L.rapidezDedo([{ t: 0, x: 0 }]), 0);
});

test('la rapidez se ajusta a 2, 4 o 6 m/s; un empujón flojo o hacia atrás no suelta', () => {
  assert.equal(L.ajustarRapidez(0.4), null);
  assert.equal(L.ajustarRapidez(-5), null);
  assert.equal(L.ajustarRapidez(NaN), null);
  assert.equal(L.ajustarRapidez(1.2), 2);
  assert.equal(L.ajustarRapidez(3.1), 4);
  assert.equal(L.ajustarRapidez(5.2), 6);
  assert.equal(L.ajustarRapidez(40), 6);
  assert.deepEqual(Object.values(L.BOTONES), [2, 4, 6]);
});

test('MRU: marcas de cada segundo a la misma distancia (v metros) y corrida de 5 s como máximo', () => {
  const a = L.corridaMRU(2);
  assert.equal(a.dur, 5);
  assert.deepEqual(a.marcas, [0, 2, 4, 6, 8, 10]);
  const b = L.corridaMRU(6);
  assert.equal(b.dur, 5);                       // 30 m / 6 m/s = 5 s: llega justo al final de la pista
  assert.deepEqual(b.marcas, [0, 6, 12, 18, 24, 30]);
  cerca(b.x(9), 30);                            // después del final se queda al final
});

test('dos carritos: cruce, alcance y nunca, con el encuentro calculado aparte', () => {
  // cruce: 4t = 30 − 2t → t = 5 s, x = 20 m.
  const c = L.dosCarritos('cruce');
  cerca(c.encuentro.t, 5); cerca(c.encuentro.x, 20);
  assert.equal(c.rapidezAcercamiento, 6);
  // alcance: 6t = 10 + 2t → t = 2,5 s, x = 15 m. En ese instante vA = 6 y vB = 2: misma posición, distinta rapidez.
  const a = L.dosCarritos('alcance');
  cerca(a.encuentro.t, 2.5); cerca(a.encuentro.x, 15);
  assert.equal(a.encuentro.vA, 6); assert.equal(a.encuentro.vB, 2);
  assert.equal(a.rapidezAcercamiento, 4);
  // nunca: 2t = 10 + 4t no tiene solución con t > 0.
  assert.equal(L.dosCarritos('nunca').encuentro, null);
  // Ninguna corrida pasa de 5 s ni saca un carrito de la pista.
  for (const k of Object.keys(L.CASOS)) {
    const d = L.dosCarritos(k);
    assert.ok(d.dur <= 5);
    for (const x of [...d.marcasA, ...d.marcasB]) assert.ok(x >= -1e-9 && x <= 30 + 1e-9, `${k}: ${x}`);
  }
});

test('la bandera mide la distancia al encuentro, sin juzgar', () => {
  const enc = L.dosCarritos('alcance').encuentro;
  assert.deepEqual(L.leerBandera(16, enc), { hay: true, dif: 1, cerca: true });
  assert.deepEqual(L.leerBandera(10, enc), { hay: true, dif: -5, cerca: false });
  assert.deepEqual(L.leerBandera(10, null), { hay: false, dif: null });
});

test('pedal: acelera 3 s, suelta 1 s y frena hasta parar (sin marcha atrás)', () => {
  const ev = [{ t: 0, pedal: 'acelera' }, { t: 3, pedal: 'suelto' }, { t: 4, pedal: 'frena' }];
  assert.deepEqual(L.tramosDe(ev), [{ dur: 3, a: 2 }, { dur: 1, a: 0 }, { a: -3 }]);
  const { movil } = L.corridaPedal(ev);
  // A mano: a los 3 s, v = 6 y x = 9; al 4.º s, x = 15; frena 2 s (6/3) y avanza 6·2 − 3·4/2 = 6 → x = 21.
  cerca(movil.v(3), 6); cerca(movil.x(3), 9); cerca(movil.x(4), 15);
  cerca(movil.tParada, 6); cerca(movil.x(6), 21); cerca(movil.x(9), 21); cerca(movil.v(8), 0);
  // Dos pulsaciones seguidas del mismo pedal son un solo tramo; una de duración cero no cuenta.
  assert.deepEqual(L.tramosDe([{ t: 0, pedal: 'acelera' }, { t: 1, pedal: 'acelera' }, { t: 2, pedal: 'suelto' }, { t: 2, pedal: 'frena' }]), [{ dur: 2, a: 2 }, { a: -3 }]);
  assert.deepEqual(L.tramosDe([]), [{ a: 0 }]);
});

test('predicciones: una sola correcta, errores con nombre y explicación que empieza por lo que sería cierto', () => {
  for (const [id, p] of Object.entries(L.PREDICCIONES)) {
    assert.equal(p.opciones.filter(o => o.correcta).length, 1, id);
    for (const o of p.opciones.filter(o => !o.correcta)) {
      assert.ok(o.error, `${id}/${o.id} sin código de error`);
      assert.ok(o.explica.split(/\s+/).length <= 20, `${id}/${o.id}: la explicación pasa de 20 palabras`);
      assert.ok(!/elegiste|incorrect|la correcta/i.test(o.explica), 'tono: sin «Elegiste» ni «La correcta»');
    }
  }
  assert.deepEqual(L.responder('k1', 'iguales'), { correcta: false, error: 'K1', explica: L.PREDICCIONES.k1.opciones[1].explica });
  assert.equal(L.responder('k3', 'atras').correcta, true);
});

test('MRU desde donde se soltó: la corrida termina al final de la pista', () => {
  const c = L.corridaMRU(6, 3);
  assert.equal(c.dur, 4.5);                    // (30 − 3) / 6
  assert.deepEqual(c.marcas, [3, 9, 15, 21, 27]);
});

test('sesión 2: el área bajo v-t de la corrida por defecto, tramo por tramo (calculada a mano)', () => {
  // Acelera 2 m/s² 3 s: triángulo ½·3·6 = 9. Sigue 1 s a 6 m/s: rectángulo 6. Frena 3 m/s² hasta parar en 2 s: ½·2·6 = 6.
  const r = L.areas(L.CORRIDA_DEFECTO);
  assert.deepEqual(r.tramos.map(t => [t.forma, t.area]), [['triangulo', 9], ['rectangulo', 6], ['triangulo', 6]]);
  assert.equal(r.total, 21); assert.equal(r.fin, 6);
  // Pintado hasta 3 s: 9 m, que son 4,5 cuadritos de 2 m (1 s × 2 m/s).
  assert.deepEqual(L.pintado(L.CORRIDA_DEFECTO, 3), { area: 9, cuadritos: 4.5 });
  assert.deepEqual(L.pintado(L.CORRIDA_DEFECTO, 99), { area: 21, cuadritos: 10.5 });
});

test('sesión 3: lanzamiento hacia arriba y dos pelotas (g = 10)', () => {
  // v0 = 20: sube 2 s hasta 20 m (v²/2g) y vuelve al suelo a los 4 s. A los 0,5 s: 20·0,5 − 5·0,25 = 8,75 m.
  const l = L.lanzar(20);
  assert.equal(l.tCima, 2); assert.equal(l.cima, 20); assert.equal(l.dur, 4);
  assert.deepEqual(l.marcas, [0, 8.75, 15, 18.75, 20, 18.75, 15, 8.75, 0]);
  assert.equal(l.v(2), 0); assert.equal(l.a(), -10);   // en la cima: v = 0, a = −10
  for (const v0 of L.LANZAMIENTOS) assert.ok(L.lanzar(v0).cima <= L.ALTO + 1e-9, 'no se sale de la torre');
  // Desde 20 m: t = √(2·20/10) = 2 s, para las dos.
  assert.equal(L.soltarDos().tSuelo, 2);
});

test('sesión 3: problemas de transferencia, áreas a mano y alternativas distintas', () => {
  // auto: ½·4·12 = 24, 12·6 = 72, ½·3·12 = 18 → 114 m. bus: 25 + 40 + 10 = 75. moto: 18 + 60 + 24 = 102.
  const esperado = { auto: [24, 72, 18, 114], bus: [25, 40, 10, 75], moto: [18, 60, 24, 102] };
  for (const p of L.PROBLEMAS) {
    const r = L.problema(p.id), e = esperado[p.id];
    assert.deepEqual([...r.partes.map(q => q.area), r.total], e, p.id);
    assert.equal(r.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(r.opciones.map(o => o.valor)).size, r.opciones.length);
    for (const o of r.opciones.filter(o => !o.correcta)) assert.ok(o.explica.split(/\s+/).length <= 20, `${p.id}/${o.id}`);
    assert.ok(p.texto.split(/\s+/).length <= 40, 'enunciado de 40 palabras como máximo');
  }
});
