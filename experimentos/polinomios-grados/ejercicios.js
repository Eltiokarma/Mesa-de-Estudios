(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.EjerciciosPolinomios = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  return [
    { id: 'propio-grados-01', titulo: 'Cada término tiene su grado', tipo: 'grados',
      contexto: 'Trabajamos con dos variables. Predice el grado absoluto del polinomio.',
      terminos: [{ c: 4, x: 3, y: 2 }, { c: -2, x: 1, y: 5 }, { c: 9, x: 0, y: 0 }],
      pregunta: '¿Cuál es su grado absoluto?',
      explicacion: 'Suma los exponentes de cada término y toma el mayor. El coeficiente no se suma al grado. Una constante no nula tiene grado cero.' },
    { id: 'propio-grados-02', titulo: 'Primero, reduce', tipo: 'grados',
      contexto: 'Dos términos pueden anularse. Predice el grado del polinomio después de reducir.',
      terminos: [{ c: 6, x: 4, y: 1 }, { c: -6, x: 4, y: 1 }, { c: 2, x: 2, y: 2 }, { c: -7, x: 1, y: 3 }],
      pregunta: '¿Qué grado queda al reducir?',
      explicacion: 'Los términos 6x⁴y y −6x⁴y se anulan. Sólo se cuentan los términos que sobreviven. Los dos restantes tienen el mismo grado: el polinomio es homogéneo.' },
    { id: 'propio-grados-03', titulo: 'No todos los exponentes sirven', tipo: 'parametro',
      contexto: 'n es un entero entre 0 y 12, incluidos los extremos. No se admiten exponentes negativos ni fraccionarios.',
      familia: [{ c: 2, x: { a: 1, b: -3, d: 1 }, y: { a: 1, b: 0, d: 2 } },
        { c: 1, x: { a: 1, b: -1, d: 1 }, y: { a: 0, b: 1, d: 1 } }],
      desde: 0, hasta: 12, pregunta: '¿Cuántos valores de n producen un polinomio?',
      explicacion: 'n−3 exige n≥3 y n/2 exige n par. Dentro de 0 a 12 se admiten 4, 6, 8, 10 y 12. El motor revisa ese intervalo, no afirma haber resuelto todos los valores reales posibles.' }
  ];
});
