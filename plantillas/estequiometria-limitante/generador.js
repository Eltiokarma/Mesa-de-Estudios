/*
 * Generador: reactivo limitante y masa de producto.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['estequiometria-limitante']) y en Node (require).
 *
 * Masas molares de academia (H = 1, C = 12, N = 14, O = 16, Mg = 24, Al = 27).
 * Las alternativas incorrectas salen de errores de docs/investigacion/estequiometria-ideas-erroneas.md.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const FUENTE = 'docs/investigacion/estequiometria-ideas-erroneas.md';

  // A + B → P (+ otros). c: coeficiente; M: masa molar en g/mol.
  const REACCIONES = [
    { id: 'agua', A: { f: 'H₂', M: 2, c: 2 }, B: { f: 'O₂', M: 32, c: 1 }, P: { f: 'H₂O', M: 18, c: 2 }, otros: [], contexto: 'En una celda de combustible' },
    { id: 'amoniaco', A: { f: 'N₂', M: 28, c: 1 }, B: { f: 'H₂', M: 2, c: 3 }, P: { f: 'NH₃', M: 17, c: 2 }, otros: [], contexto: 'En una planta de fertilizantes' },
    { id: 'metano', A: { f: 'CH₄', M: 16, c: 1 }, B: { f: 'O₂', M: 32, c: 2 }, P: { f: 'CO₂', M: 44, c: 1 }, otros: [{ f: 'H₂O', M: 18, c: 2 }], contexto: 'En la hornilla de una cocina a gas' },
    { id: 'magnesio', A: { f: 'Mg', M: 24, c: 2 }, B: { f: 'O₂', M: 32, c: 1 }, P: { f: 'MgO', M: 40, c: 2 }, otros: [], contexto: 'Al encender una cinta de magnesio en el laboratorio' },
    { id: 'aluminio', A: { f: 'Al', M: 27, c: 4 }, B: { f: 'O₂', M: 32, c: 3 }, P: { f: 'Al₂O₃', M: 102, c: 2 }, otros: [], contexto: 'Cuando el aluminio se oxida al aire' },
    { id: 'propano', A: { f: 'C₃H₈', M: 44, c: 1 }, B: { f: 'O₂', M: 32, c: 5 }, P: { f: 'CO₂', M: 44, c: 3 }, otros: [{ f: 'H₂O', M: 18, c: 4 }], contexto: 'En un balón de gas de cocina' },
  ];
  // Cuántas "veces la ecuación" alcanza cada reactivo. Valores que dan masas limpias.
  const VECES = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

  function ecuacion(r) {
    const t = x => (x.c > 1 ? x.c + ' ' : '') + x.f;
    return `${t(r.A)} + ${t(r.B)} → ${[r.P, ...r.otros].map(t).join(' + ')}`;
  }

  function generar(semilla) {
    const rng = Azar.crear('estequiometria-limitante|' + semilla);
    // Se reintenta con otros números hasta tener al menos 4 alternativas distintas
    // (si varios errores dan el mismo valor que la respuesta, no sirven para distinguir).
    for (let intento = 0; intento < 50; intento++) {
      const p = construir(rng, semilla);
      if (p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla) {
    const r = rng.elegir(REACCIONES);
    // La mitad de las veces el limitante es el reactivo con MÁS gramos: así el error ES20 se distingue.
    const trampa = rng.moneda();
    let kA, kB, mA, mB, ok = false;
    for (let i = 0; i < 200 && !ok; i++) {
      const a = rng.elegir(VECES), b = rng.elegir(VECES);
      const ma = a * r.A.c * r.A.M, mb = b * r.B.c * r.B.M;
      if (a === b || ma === mb) continue;
      const limTieneMasGramos = a < b ? ma > mb : mb > ma;
      if (limTieneMasGramos !== trampa) continue;
      [kA, kB, mA, mB, ok] = [a, b, ma, mb, true];
    }
    // Sin números válidos para esta reacción y esta trampa: se descarta el intento
    // (antes quedaban mezclados valores de dos intentos distintos).
    if (!ok) return { alternativas: [] };
    const lim = kA < kB ? 'A' : 'B', exc = lim === 'A' ? 'B' : 'A';
    const k = Math.min(kA, kB), kExc = Math.max(kA, kB);
    const masaProducto = k * r.P.c * r.P.M;
    const menorMasa = mA < mB ? 'A' : 'B';
    const menorCoef = r.A.c < r.B.c ? 'A' : r.B.c < r.A.c ? 'B' : null;
    const kDe = x => (x === 'A' ? kA : kB);
    const molesLim = (lim === 'A' ? mA / r.A.M : mB / r.B.M);

    const errores = [
      { id: 'ES20', respaldo: 'documentado', fuente: FUENTE, valor: kDe(menorMasa) * r.P.c * r.P.M,
        explicacion: `Tomaste como limitante al ${r[menorMasa].f} porque hay menos gramos. El limitante no es el que pesa menos: es el que se acaba primero según la ecuación. Hay que pasar a moles y dividir entre el coeficiente.` },
      ...(menorCoef ? [{ id: 'ES21', respaldo: 'documentado', fuente: FUENTE, valor: kDe(menorCoef) * r.P.c * r.P.M,
        explicacion: `Tomaste como limitante al ${r[menorCoef].f} porque su coeficiente es el menor. El coeficiente solo dice la proporción; hay que compararla con lo que de verdad hay.` }] : []),
      { id: 'exceso', respaldo: 'hipotesis', fuente: FUENTE, valor: kExc * r.P.c * r.P.M,
        explicacion: `Calculaste con el ${r[exc].f}, que es el reactivo en exceso. Con ese cálculo saldría más producto del que permite el ${r[lim].f}: la reacción se detiene cuando se acaba el limitante.` },
      { id: 'suma-masas', respaldo: 'hipotesis', fuente: FUENTE, valor: mA + mB,
        explicacion: `Sumaste las masas de los dos reactivos. La masa se conserva, pero una parte del ${r[exc].f} sobra y no se convierte en ${r.P.f}${r.otros.length ? ' (además se forma ' + r.otros.map(o => o.f).join(' y ') + ')' : ''}.` },
      { id: 'gramos-como-moles', respaldo: 'hipotesis', fuente: FUENTE, valor: (lim === 'A' ? mA : mB) * r.P.c / r[lim].c,
        explicacion: `Aplicaste los coeficientes directamente a los gramos (${r[lim].c} g de ${r[lim].f} dan ${r.P.c} g de ${r.P.f}). Los coeficientes cuentan moles, no gramos: primero hay que pasar a moles con la masa molar.` },
      { id: 'sin-coef-producto', respaldo: 'hipotesis', fuente: FUENTE, valor: molesLim * r.P.M,
        explicacion: `Pasaste bien a moles el limitante, pero luego usaste una relación 1 a 1 con el ${r.P.f}. Hay que usar los coeficientes: ${r[lim].c} mol de ${r[lim].f} dan ${r.P.c} mol de ${r.P.f}.` },
    ];
    const alternativas = P.armar({ correcta: masaProducto, errores, rng, unidad: 'g', decimales: 1 });
    const v = P.v;
    return {
      id: `estequiometria-limitante#${semilla}`,
      variables: {
        mA: { nombre: `masa de ${r.A.f}`, color: 'o' }, mB: { nombre: `masa de ${r.B.f}`, color: 'i' },
        mP: { nombre: `masa de ${r.P.f}`, color: 'h' },
      },
      enunciado: [
        `${r.contexto} ocurre la reacción `, { t: ecuacion(r), formula: true }, '. Se mezclan ',
        v('mA', `${P.formatear(mA, 1)} g de ${r.A.f}`), ' con ', v('mB', `${P.formatear(mB, 1)} g de ${r.B.f}`), '.',
      ],
      pregunta: [`¿Cuántos gramos de ${r.P.f} se forman como máximo?`],
      datos: `Masas molares (g/mol): ${[r.A, r.B, r.P].map(x => `${x.f} = ${x.M}`).join('; ')}.`,
      alternativas,
      solucion: [
        ['Pasa cada masa a moles: ', v('mA', `${P.formatear(mA, 1)} g`), ` ÷ ${r.A.M} = ${P.formatear(mA / r.A.M, 2)} mol de ${r.A.f}; `,
          v('mB', `${P.formatear(mB, 1)} g`), ` ÷ ${r.B.M} = ${P.formatear(mB / r.B.M, 2)} mol de ${r.B.f}.`],
        [`Divide entre el coeficiente: ${r.A.f} alcanza para ${P.formatear(kA, 2)} veces la ecuación y ${r.B.f} para ${P.formatear(kB, 2)} veces.`],
        [`El que alcanza para menos veces es el limitante: ${r[lim].f}. ${menorMasa !== lim ? `Ojo: tiene más gramos que el ${r[exc].f}, y aun así se acaba primero.` : ''}`],
        ['Producto: ', `${P.formatear(k, 2)} × ${r.P.c} mol × ${r.P.M} g/mol = `, v('mP', `${P.formatear(masaProducto, 1)} g de ${r.P.f}`), '.'],
      ],
      respuesta: { valor: masaProducto, unidad: 'g', limitante: r[lim].f },
      // Para las pruebas: datos crudos que permiten recalcular la respuesta por otro camino.
      _datos: { reaccion: r.id, mA, mB },
    };
  }

  return { id: 'estequiometria-limitante', titulo: 'Reactivo limitante', generar, REACCIONES };
});
