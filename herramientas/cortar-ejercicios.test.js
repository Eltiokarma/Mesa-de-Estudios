'use strict';
// Pruebas del cortador con muestras inventadas (no son problemas de ninguna academia).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const C = require('./cortar-ejercicios.js');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'cortar-'));

// Libro resuelto: la resolución trae su propia numeración («1.», «2.») que no debe cortar ejercicios.
const RESUELTO = `CAPÍTULO 3: PORCENTAJES

1. Una tienda rebaja un polo de S/ 80 en 25 %. ¿Cuánto cuesta ahora?
A) 55   B) 60   C) 65   D) 70   E) 75
Resolución:
1. Queda el 75 %.
2. 0,75 × 80 = 60
Rpta.: B

2) Si el 20 % de un número es 14, ¿cuál es el número?
(A) 60
(B) 65
(C) 70
(D) 75
(E) 80
Solución: 14 / 0,2 = 70. Respuesta: C

Problema 3: Observa la figura adjunta. ¿Qué porcentaje del cuadrado está sombreado?
[figura]
a) 20 %  b) 25 %  c) 30 %  d) 40 %
Resolución
Se sombrea 1 de 4 partes. Rpta: b

4. Este no trae alternativas. ¿Cuánto cuesta el polo con IGV?
Resolución: 2. se calcula directo.

CLAVES
1. B   2. C   3. B
`;

test('texto resuelto: corta 3, la resolución numerada no parte ejercicios, y el 4 va a no cortados', () => {
  const d = tmp(), f = path.join(d, 'academia-porcentajes.txt');
  fs.writeFileSync(f, RESUELTO);
  const r = C.procesar(f);
  assert.strictEqual(r.lote, 'ac-porcentajes');
  assert.deepStrictEqual(r.ejercicios.map(e => e.origen.numero), [1, 2, 3]);
  const [e1, e2, e3] = r.ejercicios;
  assert.deepStrictEqual(e1.alternativas_fuente, ['55', '60', '65', '70', '75']);
  assert.strictEqual(e1.clave_fuente, 'B');
  assert.match(e1.enunciado, /^Una tienda rebaja/);
  assert.strictEqual(e2.alternativas_fuente.length, 5);
  assert.strictEqual(e2.clave_fuente, 'C');
  assert.strictEqual(e3.clave_fuente, 'B');
  assert.strictEqual(e3.figura_fuente, true);
  assert.strictEqual(e3.alternativas_fuente.length, 4);
  assert.strictEqual(r.noCortados.length, 1);
  assert.strictEqual(r.noCortados[0].numero, 4);
  assert.strictEqual(r.soluciones.length, 3);
  assert.match(r.soluciones[0].solucion, /0,75 × 80 = 60/);
  assert.strictEqual(r.origen.tipo, 'academia');
  assert.strictEqual(r.origen.fuente, 'academia-porcentajes.txt');
});

test('la tabla de claves manda y avisa si choca con la resolución', () => {
  const d = tmp(), f = path.join(d, 'libro.txt');
  fs.writeFileSync(f, RESUELTO.replace('1. B   2. C   3. B', '1. D   2. C   3. B'));
  const e1 = C.procesar(f).ejercicios[0];
  assert.strictEqual(e1.clave_fuente, 'D');
  assert.match(e1.notas, /tabla de claves dice D y la resolución, B/);
});

test('HTML: imágenes como figura, entidades y párrafos', () => {
  const d = tmp(), f = path.join(d, 'unmsm-2025-I-area-A.html');
  fs.writeFileSync(f, `<html><head><style>p{}</style></head><body>
    <p><b>PREGUNTA N.º 1</b> Un auto recorre 120&nbsp;km en 2&nbsp;h. ¿Cuál es su rapidez media?</p>
    <ol><li>A) 40 km/h</li><li>B) 50 km/h</li><li>C) 60 km/h</li><li>D) 80 km/h</li><li>E) 240 km/h</li></ol>
    <p><b>PREGUNTA N.º 2</b> En el gráfico, ¿cuánto mide el ángulo &theta;? <img src="f.png"></p>
    <p>A) 30&deg; B) 37&deg; C) 45&deg; D) 53&deg; E) 60&deg;</p>
    <p>Clave: D</p></body></html>`);
  const r = C.procesar(f);
  assert.strictEqual(r.origen.tipo, 'oficial');
  assert.strictEqual(r.origen.universidad, 'unmsm');
  assert.strictEqual(r.origen.periodo, '2025-I');
  assert.strictEqual(r.origen.area, 'A');
  assert.strictEqual(r.lote, 'of-unmsm-2025-i-area-a');
  assert.strictEqual(r.ejercicios.length, 2);
  assert.match(r.ejercicios[0].enunciado, /120 km en 2 h/);
  assert.strictEqual(r.ejercicios[0].alternativas_fuente[2], '60 km/h');
  assert.strictEqual(r.ejercicios[1].figura_fuente, true);
  assert.strictEqual(r.ejercicios[1].alternativas_fuente[1], '37°');
  assert.strictEqual(r.ejercicios[1].clave_fuente, 'D');
});

test('oficial sin universidad ni periodo pide los datos', () => {
  assert.throws(() => C.origenDeNombre('examen.pdf', { origen: 'oficial' }), /universidad o periodo/);
});

// PDF mínimo hecho a mano (una página, texto ASCII), para probar el camino de pdftotext sin dependencias.
function pdfMinimo(lineas) {
  const ops = lineas.map((l, i) => `BT /F1 11 Tf 40 ${780 - i * 16} Td (${l.replace(/[()\\]/g, '\\$&')}) Tj ET`).join('\n');
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${ops.length} >>\nstream\n${ops}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let s = '%PDF-1.4\n'; const off = [];
  objs.forEach((o, i) => { off.push(s.length); s += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = s.length;
  s += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('')}`;
  return s + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
}

let hayPdftotext = true;
try { execFileSync('pdftotext', ['-v'], { stdio: 'ignore' }); } catch { hayPdftotext = false; }

test('PDF con capa de texto: corta, y escribe crudo.jsonl válido para el validador', { skip: !hayPdftotext && 'sin pdftotext' }, () => {
  const d = tmp(), f = path.join(d, 'academia-mezclas.pdf');
  fs.writeFileSync(f, pdfMinimo([
    '1. Se mezclan 3 kg de cafe de S/ 20 con 1 kg de S/ 40. Cual es el precio medio?',
    'A) S/ 25   B) S/ 30   C) S/ 35   D) S/ 60',
    '2. Se mezclan 2 L de alcohol de 90 grados con 2 L de agua. Que grado resulta?',
    'A) 30   B) 45   C) 60   D) 90',
    'CLAVES',
    '1. A   2. B',
  ]), 'latin1');
  const r = C.procesar(f);
  assert.strictEqual(r.ejercicios.length, 2);
  assert.strictEqual(r.ejercicios[0].clave_fuente, 'A');
  assert.strictEqual(r.ejercicios[1].alternativas_fuente[1], '45');
  const salida = path.join(d, 'salida');
  C.escribir(r, salida);
  const out = execFileSync(process.execPath, [path.join(__dirname, 'validar-ejercicios.js'), '--validar', salida]).toString();
  assert.match(out, /válidos 2|2 válidos|errores 0|sin errores/i);
});

test('alternativas: exige A, B, C y D en orden y descarta letras sueltas del enunciado', () => {
  assert.strictEqual(C.alternativas('El punto A) está lejos y nada más'), null);
  const a = C.alternativas('Halla x. A) 1 B) 2 C) 3 D) 4');
  assert.deepStrictEqual(a.textos, ['1', '2', '3', '4']);
  assert.strictEqual(a.antes.trim(), 'Halla x.');
});
