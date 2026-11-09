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
      explicacion: 'n−3 exige n≥3 y n/2 exige n par. Dentro de 0 a 12 se admiten 4, 6, 8, 10 y 12. El motor revisa ese intervalo, no afirma haber resuelto todos los valores reales posibles.' },
    { id: 'propio-grados-04', titulo: 'El mismo grado en cada término', tipo: 'homogeneidad',
      contexto: 'n es un entero entre 0 y 8. Busca el valor que hace homogéneo este polinomio.',
      familia: [{ c: 3, x: { a: 1, b: 1, d: 1 }, y: { a: 0, b: 2, d: 1 } },
        { c: 2, x: { a: 0, b: 3, d: 1 }, y: { a: 0, b: 4, d: 1 } }],
      desde: 0, hasta: 8, pregunta: '¿Qué valor de n lo hace homogéneo?',
      explicacion: 'El primer término tiene grado n + 3 y el segundo, 7. Igualarlos da n + 3 = 7, por lo que n = 4. Quedan 3x⁵y² y 2x³y⁴: ambos de grado 7.' },
    { id: 'propio-grados-05', titulo: 'Homogéneo no significa completo', tipo: 'faltantes',
      contexto: 'Todos los términos tienen grado 5. Ahora revisa sólo las potencias de x, desde la mayor hasta cero.',
      terminos: [{ c: 7, x: 4, y: 1 }, { c: 3, x: 2, y: 3 }, { c: 8, x: 0, y: 5 }],
      pregunta: '¿Cuántas potencias de x faltan para ser completo?',
      explicacion: 'Aparecen x⁴, x² y x⁰. Entre 4 y 0 faltan x³ y x¹: dos potencias. Aunque todos los términos suman grado 5, el polinomio no es completo respecto de x.' },
    { id: 'propio-grados-06', titulo: 'El menor grado permitido', tipo: 'minimo',
      contexto: 'n es un entero entre 0 y 14. Considera únicamente valores que produzcan exponentes enteros no negativos.',
      familia: [{ c: 2, x: { a: 1, b: -4, d: 1 }, y: { a: 1, b: 2, d: 2 } },
        { c: 3, x: { a: 1, b: -1, d: 1 }, y: { a: 0, b: 2, d: 1 } }],
      desde: 0, hasta: 14, pregunta: '¿Cuál es el menor grado absoluto posible en ese intervalo?',
      explicacion: 'Se necesita n ≥ 4 y n par. Los grados de los términos son 3n/2 − 3 y n + 1. Ambos aumentan al crecer n; el mínimo ocurre en n = 4. Queda 2y³ + 3x³y², de grados 3 y 5: el grado absoluto mínimo es 5.' }
  ];
});
