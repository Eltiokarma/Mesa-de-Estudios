// Pruebas del motor de «¿Cuál pesa más?» (node --test).
// La verificación independiente es `evaluar`: lee el texto que ve el alumno, sin usar el motor,
// y calcula su valor en el SI con números de coma flotante. Primero se comprueba contra casos.json
// (calculados a mano) y luego contra miles de rondas del motor.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const M = require('./motor');
const Azar = require(path.join(__dirname, '..', '..', 'nucleo', 'azar'));
const casos = require('./casos.json');

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const UNI = { 'km/h': 1000 / 3600, 'm/s': 1, km: 1000, m: 1, cm: 0.01, kg: 1, g: 0.001, L: 0.001, 'cm³': 1e-6, mL: 1e-6 };
const VULGAR = { '½': 1 / 2, '¼': 1 / 4, '¾': 3 / 4, '⅓': 1 / 3, '⅔': 2 / 3, '⅕': 1 / 5, '⅖': 2 / 5, '⅗': 3 / 5, '⅘': 4 / 5 };
const RAD = Math.PI / 180;
const TRIG = { sen: Math.sin, cos: Math.cos, tg: Math.tan };
const num = t => Number(t.replace(',', '.'));

function evaluar(texto) {
  let m;
  const t = texto.trim();
  if ((m = t.match(/^([\d,]+) (km\/h|m\/s|km|m|cm|kg|g|L|cm³|mL)$/))) return num(m[1]) * UNI[m[2]];
  if ((m = t.match(/^([\d,]+) \+ ([\d,]+)$/))) return num(m[1]) + num(m[2]);
  if ((m = t.match(/^([\d,]+) − ([\d,]+)$/))) return num(m[1]) - num(m[2]);
  if ((m = t.match(/^([\d,]+) × 10([⁰-⁹¹²³]+)$/))) return num(m[1]) * 10 ** exp(m[2]);
  if ((m = t.match(/^([\d,]+) × ([\d,]+)$/))) return num(m[1]) * num(m[2]);
  if ((m = t.match(/^([\d,]+) ÷ ([\d,]+)$/))) return num(m[1]) / num(m[2]);
  if ((m = t.match(/^(\d+)([⁰-⁹¹²³]+)$/))) return num(m[1]) ** exp(m[2]);
  if ((m = t.match(/^(.) de (\d+)$/)) && VULGAR[m[1]]) return VULGAR[m[1]] * num(m[2]);
  if ((m = t.match(/^(\d+) % de (\d+)$/))) return num(m[1]) / 100 * num(m[2]);
  if ((m = t.match(/^(\d+) (sen|cos|tg) (\d+)°$/))) {
    // Notables de examen: 37° y 53° se toman como el triángulo 3-4-5 (no como el ángulo exacto).
    const g = Number(m[3]);
    const exacto = { 37: { sen: 0.6, cos: 0.8, tg: 0.75 }, 53: { sen: 0.8, cos: 0.6, tg: 4 / 3 } };
    const r = exacto[g] ? exacto[g][m[2]] : TRIG[m[2]](g * RAD);
    return num(m[1]) * r;
  }
  if ((m = t.match(/^[\d,]+$/))) return num(t);
  throw new Error('no sé leer «' + texto + '»');
}
function exp(s) { return Number([...s].map(c => SUP.indexOf(c)).join('')); }
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const valorMotor = v => v.n / v.d;

test('el evaluador independiente da los valores calculados a mano', () => {
  for (const c of casos.tarjetas) assert.ok(cerca(evaluar(c.texto), c.valor), `${c.texto}: ${evaluar(c.texto)} ≠ ${c.valor}`);
  for (const r of casos.rondas) {
    const a = evaluar(r.izq), b = evaluar(r.der);
    const resp = cerca(a, b) ? 'iguales' : a > b ? 'izq' : 'der';
    assert.equal(resp, r.respuesta, `${r.izq} contra ${r.der}`);
  }
});

test('cada tarjeta del motor vale lo que dice su texto, en los cinco niveles', () => {
  let n = 0;
  for (let nivel = 1; nivel <= M.NIVEL_MAX; nivel++) {
    for (let s = 0; s < 400; s++) {
      const r = M.ronda(Azar.crear(`n${nivel}-s${s}`), nivel);
      for (const lado of ['izq', 'der']) {
        const c = r[lado];
        assert.ok(cerca(evaluar(c.texto), valorMotor(c.valor)), `nivel ${nivel}: «${c.texto}» ${evaluar(c.texto)} contra ${valorMotor(c.valor)}`);
        n++;
      }
    }
  }
  assert.equal(n, 4000);
});

test('la respuesta del motor coincide con la del evaluador independiente', () => {
  for (let nivel = 1; nivel <= M.NIVEL_MAX; nivel++) {
    for (let s = 0; s < 400; s++) {
      const r = M.ronda(Azar.crear(`resp-${nivel}-${s}`), nivel);
      const a = evaluar(r.izq.texto), b = evaluar(r.der.texto);
      const esperada = cerca(a, b) ? 'iguales' : a > b ? 'izq' : 'der';
      assert.equal(r.respuesta, esperada, `${r.izq.texto} contra ${r.der.texto}`);
    }
  }
});

test('las dos tarjetas de una ronda tienen la misma dimensión y textos distintos', () => {
  for (let s = 0; s < 1000; s++) {
    const r = M.ronda(Azar.crear('dim' + s), 1 + (s % 5));
    assert.equal(r.izq.dim, r.der.dim);
    assert.notEqual(r.izq.texto, r.der.texto);
  }
});

test('hay rondas de «Iguales», pero no la mayoría; y las desiguales son cercanas', () => {
  for (let nivel = 1; nivel <= M.NIVEL_MAX; nivel++) {
    let iguales = 0, lejanas = 0;
    for (let s = 0; s < 400; s++) {
      const r = M.ronda(Azar.crear(`ig-${nivel}-${s}`), nivel);
      if (r.respuesta === 'iguales') iguales++;
      else {
        const a = valorMotor(r.izq.valor), b = valorMotor(r.der.valor);
        if (Math.max(a, b) / Math.min(a, b) > 1.8 + 1e-12) lejanas++;   // solo en el respaldo, cuando no hubo par igual
      }
    }
    assert.ok(iguales >= 40 && iguales <= 160, `nivel ${nivel}: ${iguales} de 400 son iguales`);
    assert.ok(lejanas <= 20, `nivel ${nivel}: ${lejanas} de 400 son lejanas`);
  }
});

test('la misma semilla da la misma ronda', () => {
  assert.deepEqual(M.ronda(Azar.crear('x'), 4), M.ronda(Azar.crear('x'), 4));
});

test('puntaje: multiplicador por racha, sube con 4 seguidos, baja con 2 errores', () => {
  let e = M.nuevo();
  const puntos = [];
  for (let i = 0; i < 3; i++) { const a = M.anotar(e, true); e = a.estado; puntos.push(a.ganados); }
  assert.deepEqual(puntos, [100, 100, 200]);           // x2 desde el tercero
  const cuarto = M.anotar(e, true);
  assert.equal(cuarto.cambio, 1); assert.equal(cuarto.estado.nivel, 2);
  e = cuarto.estado;
  e = M.anotar(e, false).estado;
  assert.equal(e.racha, 0); assert.equal(e.nivel, 2);
  const baja = M.anotar(e, false);
  assert.equal(baja.cambio, -1); assert.equal(baja.estado.nivel, 1);
  assert.equal(baja.estado.mejorRacha, 4);
  assert.equal(baja.estado.nivelMax, 2);
  assert.equal(M.multiplicador(10), 4);
});

test('el valor que se muestra después de responder', () => {
  assert.equal(M.mostrar(M.frac(20)), '20');
  assert.equal(M.mostrar(M.frac(3, 2)), '1,5');
  assert.equal(M.mostrar(M.frac(20, 3)), '≈ 6,67');
});
