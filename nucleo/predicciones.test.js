// Pruebas de nucleo/predicciones.js: formato con coma, raíces simplificadas y las opciones de armar.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./predicciones.js');
const Azar = require('./azar.js');

test('radical: entero, a√b, √b/2 o decimales', () => {
  assert.equal(P.radical(5), '5');
  assert.equal(P.radical(Math.sqrt(75)), '5√3');
  assert.equal(P.radical(Math.sqrt(97)), '√97');
  assert.equal(P.radical(-2 * Math.SQRT2), '−2√2');
  assert.equal(P.radical(Math.sqrt(26) / 2), '√26/2');
  assert.equal(P.radical(3.5), '3,5');
  assert.equal(P.radical(0), '0');
  assert.equal(P.radical(1.234), '1,23');
});

test('armar descarta ceros y negativos salvo con negativos: true', () => {
  const errores = [{ id: 'a', valor: -3, explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 0, explicacion: 'x', respaldo: 'hipotesis' },
    { id: 'c', valor: 4, explicacion: 'x', respaldo: 'hipotesis' }];
  assert.equal(P.armar({ correcta: 2, errores, rng: Azar.crear(1) }).length, 2);
  const con = P.armar({ correcta: -2, errores, rng: Azar.crear(1), negativos: true });
  assert.equal(con.length, 4);
  assert.deepEqual(con.map(a => a.texto).sort(), ['0', '4', '−2', '−3'].sort());
});

test('armar con texto propio compara lo que ve el alumno', () => {
  const errores = [{ id: 'a', valor: Math.sqrt(12), explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 2 * Math.sqrt(3) + 1e-12, explicacion: 'x', respaldo: 'hipotesis' }];
  const alt = P.armar({ correcta: 5, errores, rng: Azar.crear(2), texto: x => `${P.radical(x)} u` });
  assert.deepEqual(alt.map(a => a.texto).sort(), ['2√3 u', '5 u']);
});

test('pi: múltiplos enteros y fraccionarios de π, con unidad y con signo', () => {
  assert.equal(P.pi(Math.PI), 'π');
  assert.equal(P.pi(3 * Math.PI), '3π');
  assert.equal(P.pi(Math.PI / 2), 'π/2');
  assert.equal(P.pi(4 * Math.PI / 9), '4π/9');
  assert.equal(P.pi(-2 * Math.PI / 3), '−2π/3');
  assert.equal(P.pi(-Math.PI), '−π');
  assert.equal(P.pi(1200 * Math.PI), '1 200π');
  assert.equal(P.pi(3 * Math.PI, 'rad/s'), '3π rad/s');
  assert.equal(P.pi(0, 'rad/s'), '0 rad/s');
  assert.equal(P.pi(1), null);                       // 1/π no es una fracción con denominador ≤ 12
  assert.equal(P.pi(Math.PI / 13), null);
  assert.equal(P.pi(Math.PI / 13, '', 13), 'π/13');
});

test('armar con formato pi escribe múltiplos de π y descarta los que no salen limpios', () => {
  const e = (id, valor) => ({ id, valor, explicacion: 'x', respaldo: 'hipotesis' });
  const errores = [e('a', Math.PI / 2), e('b', 7), e('c', 4 * Math.PI / 9), e('d', Math.PI / 2 + 1e-13), e('e', Math.PI / 13), e('f', 60 * Math.PI)];
  const alt = P.armar({ correcta: 2 * Math.PI, errores, rng: Azar.crear(3), unidad: 'rad/s', formato: 'pi' });
  assert.deepEqual(alt.map(a => a.texto).sort(), ['2π rad/s', '4π/9 rad/s', '60π rad/s', 'π/2 rad/s'].sort());
  assert.equal(alt.find(a => a.correcta).texto, '2π rad/s');
  assert.ok(alt.every(a => a.correcta || a.error.id !== 'd'), 'el repetido se descarta');
  // Negativos solo con negativos: true
  const neg = [e('g', -Math.PI), e('h', Math.PI / 3)];
  assert.deepEqual(P.armar({ correcta: Math.PI, errores: neg, rng: Azar.crear(4), formato: 'pi' }).map(a => a.texto).sort(), ['π', 'π/3'].sort());
  assert.deepEqual(P.armar({ correcta: -Math.PI / 2, errores: neg, rng: Azar.crear(4), formato: 'pi', negativos: true }).map(a => a.texto).sort(), ['−π', '−π/2', 'π/3'].sort());
  assert.throws(() => P.armar({ correcta: 1, errores: neg, rng: Azar.crear(4), formato: 'pi' }), /múltiplo limpio de π/);
});

test('armar sin formato da exactamente lo mismo que antes', () => {
  const errores = [{ id: 'a', valor: Math.PI, explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 3, explicacion: 'x', respaldo: 'hipotesis' }];
  const alt = P.armar({ correcta: 2, errores, rng: Azar.crear(5), unidad: 'm' });
  assert.deepEqual(alt.map(a => a.texto).sort(), ['2 m', '3 m', '3,14 m'].sort());
});

test('formatear con 0 decimales no borra los ceros de los enteros', () => {
  assert.equal(P.formatear(10, 0), '10');
  assert.equal(P.formatear(1200, 0), '1 200');
  assert.equal(P.formatear(2.5, 0), '3');
  assert.equal(P.formatear(2.50), '2,5');
});

test('frac y textoFraccion: reducidas, con el signo arriba', () => {
  assert.deepEqual(P.frac(4, -6), { n: -2, d: 3 });
  assert.deepEqual(P.frac([0, 5]), { n: 0, d: 1 });
  assert.equal(P.textoFraccion([-3, 6]), '−1/2');
  assert.equal(P.textoFraccion(5), '5');
  assert.throws(() => P.frac(1.5, 2));
});

test('combinacion: forma de academia y clave canónica', () => {
  assert.equal(P.combinacion([[2, 3], [1, 3]], ['A', 'B']).texto, '(2A + B)/3');
  assert.equal(P.combinacion([2, -1], ['A', 'B']).texto, '2A − B');
  assert.equal(P.combinacion([[1, 2], [-1, 2]], ['a', 'b']).texto, '(a − b)/2');
  assert.equal(P.combinacion([0, [3, 4]], ['A', 'B']).texto, '3B/4');
  assert.equal(P.combinacion([-1, 0], ['A', 'B']).texto, '−A');
  assert.equal(P.combinacion([[-1, 2], 1], ['a', 'b']).texto, '(2b − a)/2');
  assert.equal(P.combinacion([-2, 3], ['A', 'B']).texto, '3B − 2A');
  assert.equal(P.combinacion([[-1, 6], [-1, 6]], ['u', 'w']).texto, '−(u + w)/6');
  assert.equal(P.combinacion([0, 0], ['A', 'B']).texto, '0');
  assert.equal(P.combinacion([[2, 4], 1], ['A', 'B']).clave, P.combinacion([[1, 2], [3, 3]], ['A', 'B']).clave);
  assert.notEqual(P.combinacion([1, 2], ['A', 'B']).clave, P.combinacion([2, 1], ['A', 'B']).clave);
});

test('vector: punto y coma y fracciones', () => {
  assert.equal(P.vector([3, -4]).texto, '(3; −4)');
  assert.equal(P.vector([[1, 2], 0, -2]).texto, '(1/2; 0; −2)');
  assert.equal(P.vector([[2, 4], 1]).clave, P.vector([[1, 2], 1]).clave);
});

test('armarTexto: compara por clave, descarta equivalentes y no deja dos textos iguales', () => {
  const C = P.combinacion([[2, 3], [1, 3]], ['A', 'B']);
  const err = (id, c) => ({ id, ...c, explicacion: 'x', respaldo: 'hipotesis' });
  const alt = P.armarTexto({ correcta: C, rng: Azar.crear(3), errores: [
    err('derechos', P.combinacion([[1, 3], [2, 3]], ['A', 'B'])),
    err('equivalente', P.combinacion([[4, 6], [2, 6]], ['A', 'B'])), // es la correcta escrita de otra forma
    err('mitades', P.combinacion([[1, 2], [1, 2]], ['A', 'B'])),
    err('sin-dividir', P.combinacion([2, 1], ['A', 'B'])),
  ] });
  assert.equal(alt.length, 4);
  assert.equal(alt.filter(a => a.correcta).length, 1);
  assert.equal(alt.find(a => a.correcta).valor, C.clave);
  assert.ok(!alt.some(a => a.error && a.error.id === 'equivalente'));
  assert.deepEqual(alt.map(a => a.letra), ['A', 'B', 'C', 'D']);
  assert.throws(() => P.armarTexto({ correcta: C, rng: Azar.crear(1), errores: [{ id: 'x', clave: 'otra', texto: C.texto, explicacion: 'x', respaldo: 'hipotesis' }] }));
});

test('armar sigue igual que antes sin opciones nuevas', () => {
  const alt = P.armar({ correcta: 10, rng: Azar.crear(9), errores: [{ id: 'a', valor: 20, explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 10.001, explicacion: 'x', respaldo: 'hipotesis' }] });
  assert.deepEqual(alt.map(a => a.texto).sort(), ['10', '20']);
});

test('formatear redondea bien los valores que en binario quedan justo debajo de la mitad', () => {
  assert.equal(P.formatear(1.035), '1,04');
  assert.equal(P.formatear(1.005), '1,01');
  assert.equal(P.formatear(0.345), '0,35');
  assert.equal(P.formatear(5.175), '5,18');
  assert.equal(P.formatear(-2.675), '−2,68');
  assert.equal(P.formatear(1.0349), '1,03');
  assert.equal(P.formatear(0), '0');
});
