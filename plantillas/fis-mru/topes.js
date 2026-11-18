/*
 * Topes de rapidez por sujeto (contrato, punto 10: «¿Es creíble?»; auditoría de MRU, 18 nov, M1, M2 y B1). Una sola
 * tabla para la teoría de «Movimiento rectilíneo uniforme» y para su práctica (fis-mru y los tipos de MRU de
 * cinematica-medias y velocidad-relativa): la leen sus pruebas en 400 semillas. Valores de problema, sin fuente: lo que
 * un postulante reconoce como posible, no un límite de tránsito (los del reglamento no se pudieron confirmar).
 *
 * revisar(texto) → [{ sujeto, valor, tope, texto }] con cada rapidez del enunciado que pasa el tope de su sujeto. Cada
 * rapidez («12 m/s», «72 km/h») es del último sujeto nombrado antes de ella; las que no tienen sujeto (el sonido, «tú
 * corres») no se revisan. Se revisa el enunciado y la pregunta, no la solución (que habla de rapideces relativas).
 * Funciona en el navegador y en Node.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TopesMRU = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // m/s. El orden importa: «mototaxi» antes que «moto»; «río que corre» antes que «corre».
  const TOPES = [
    ['mototaxi', /\bmototaxis?\b/i, 15],          // 54 km/h
    ['moto', /\bmotos?\b/i, 25],
    ['combi', /\bcombis?\b|\bbus(es)?\b|\bcami[oó]n(es)?\b/i, 25],   // 90 km/h
    ['auto', /\bautos?\b/i, 28],                  // 100 km/h
    ['tren', /\btren(es)?\b/i, 35],
    ['ciclista', /\bciclistas?\b|\bbicicletas?\b/i, 12],             // 43 km/h
    ['columna', /\bcolumnas?\b|\bdesfil[ea]\b|\bllamas\b/i, 2],
    ['pastor', /\bpastor\b/i, 4],                 // corre
    ['camina', /\bniñ[oa]\b|\bpasajer[oa]\b|\bvendedora\b|\bheladero\b|\bcamina\b/i, 2],
    ['nadador', /\bnadador(a)?\b/i, 2],
    ['corriente', /\bcorriente\b|\bríos? que corre\b|\bel río corre\b/i, 3],
    ['bote', /\bbotes?\b|\blanchas?\b/i, 9],      // desde la orilla: hasta 6 respecto al agua más 3 de corriente
    ['corredor', /\bcorredor(a)?\b|\batleta\b/i, 10.5],
  ];
  const RAPIDEZ = /(\d+(?:[  ]\d{3})*(?:,\d+)?)\s*(m\/s|km\/h)/g;
  function revisar(texto) {
    const t = String(texto), marcas = [];
    for (const [sujeto, re, tope] of TOPES) {
      const g = new RegExp(re.source, 'gi');
      let m;
      while ((m = g.exec(t))) marcas.push({ en: m.index, sujeto, tope });
    }
    marcas.sort((a, b) => a.en - b.en);
    const fuera = [];
    let m;
    RAPIDEZ.lastIndex = 0;
    while ((m = RAPIDEZ.exec(t))) {
      const quien = marcas.filter(x => x.en < m.index).pop();
      if (!quien) continue;
      const n = Number(m[1].replace(/[  ]/g, '').replace(',', '.')), ms = m[2] === 'km/h' ? n / 3.6 : n;
      if (ms > quien.tope + 1e-9) fuera.push({ sujeto: quien.sujeto, valor: ms, tope: quien.tope, texto: m[0] });
    }
    return fuera;
  }
  return { TOPES, revisar };
});
