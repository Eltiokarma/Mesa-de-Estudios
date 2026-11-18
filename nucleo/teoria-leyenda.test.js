// La leyenda de Juega no muestra la respuesta de la misión (auditoría de Exponentes y radicales, M1; 18 nov):
// nucleo/teoria.js, revisarContrato → leyendaSinRespuesta, y los números que compara (Teoria.numerosDe).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');
const Kit = require('./kit/kit.js');

Kit.registrar({ id: 'prueba-rotulo', dibujar: d => `<svg viewBox="0 0 10 10"><text x="1" y="5">${d.rotulo}</text></svg>`, alt: () => 'Un rótulo de prueba con el largo.' });

// Un juego mínimo: el largo a va de 0 a 10; la misión pide que el doble sea 14 (se cumple con a = 7, y entonces la
// figura y la lectura dicen «7 m»).
const conLeyenda = (leyenda, extra = {}) => {
  const juega = Object.assign({
    consigna: 'Mueve el largo y mira el rótulo.', minimo: 1,
    controles: [{ id: 'a', etiqueta: 'Largo', min: 0, max: 10, paso: 1, inicio: 2, unidad: 'm', decimales: 0 }],
    dibujo: v => ({ datos: { rotulo: `${v.a} m` } }), lectura: v => [`largo: ${v.a} m`],
    mision: { texto: 'Haz que el doble del largo sea 14 m.', logrado: v => v.a * 2 === 14 },
    leyenda,
  }, extra);
  const def = { unidad: 'fisica.prueba', version: '0.1.0', ideas: [{ id: 'uno', titulo: 'Prueba', temas: ['x'], pieza: 'prueba-rotulo', juega }] };
  return T.problemas(def).filter(p => /leyenda: muestra/.test(p));
};

test('números de un texto: signos, unidades, fracciones, miles y nombres', () => {
  assert.deepEqual([...T.numerosDe('× 4 · 6,5 m · −3 · 10 000 · 1 / 3 · P1 · x2 · 64 m²')].sort(), ['1/3', '10000', '3', '4', '6.5', '64'].sort());
  assert.equal(T.textoSVG('<svg><text x="1">4 <tspan>dm</tspan></text><text>a &lt; b</text></svg>').replace(/\s+/g, ' ').trim(), '4 dm · a < b');
});

test('leyenda: falla si muestra un número que solo se ve con la misión cumplida', () => {
  assert.match(conLeyenda([{ s: 'a', t: 'el largo' }, { s: '7 m', t: 'la meta' }]).join('\n'), /muestra «7»/);
  // En la descripción cuentan los números de una cuenta escrita (tras =, ×, ·, √, ∛).
  assert.match(conLeyenda([{ s: 'a', t: 'el largo: √49 = 7' }]).join('\n'), /«7»/);
});

test('leyenda: pasa con lo que se ve al abrir, lo que dice la misión y los números sueltos de la descripción', () => {
  assert.deepEqual(conLeyenda([{ s: 'a', t: 'el largo' }, { s: '2 m', t: 'el largo al empezar' }]), [], 'el valor inicial se ve al abrir');
  assert.deepEqual(conLeyenda([{ s: '14 m', t: 'el doble que pide la misión' }]), [], 'lo dice la misión');
  assert.deepEqual(conLeyenda([{ s: 'a', t: 'sube de 7 en 7' }]), [], 'un número suelto de la descripción no cuenta');
  assert.deepEqual(conLeyenda([{ s: '9 m', t: 'otro largo' }]), [], 'un número que no sale con la misión cumplida no la regala');
});

test('leyenda: los textos de todas las opciones de un control se ven al abrir (son botones)', () => {
  const controles = [{ id: 'a', etiqueta: 'Largo', opciones: [{ valor: 2, texto: 'Dos metros' }, { valor: 7, texto: '7 m' }], inicio: 2 }];
  assert.deepEqual(conLeyenda([{ s: '7 m', t: 'una de las opciones' }], { controles }), [], 'el 7 está en un botón');
  const sinNumero = [{ id: 'a', etiqueta: 'Largo', opciones: [{ valor: 2, texto: 'Corto' }, { valor: 7, texto: 'Largo' }], inicio: 2 }];
  assert.match(conLeyenda([{ s: '7 m', t: 'la meta' }], { controles: sinNumero }).join('\n'), /«7»/, 'si ningún botón lo dice, sigue marcado');
});

test('leyenda: con testigo, mira el caso del testigo', () => {
  const mision = { texto: 'Haz que el doble del largo sea 14 m.', logrado: v => v.a * 2 === 14, testigo: [{ a: 7 }] };
  assert.match(conLeyenda([{ s: '7 m', t: 'la meta' }], { mision }).join('\n'), /«7»/);
});
