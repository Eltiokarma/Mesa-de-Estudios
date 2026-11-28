/*
 * Gravitación universal · etapa 10. Contenido original para modelos newtonianos exteriores.
 * Se conservan cuatro identificadores y se añaden energía gravitatoria y escape.
 * Todas las cifras se calculan: las pruebas propias usan fracciones, bisección,
 * invariantes físicos e integración independiente; no importan el calculador del contenido.
 * Fuentes y decisiones: docs/etapa10/propuesta-fisica.md e informe-fisica.md.
 * Colores f: masas; i: distancias; h: fuerzas; o: velocidades; d: tiempos.
 * Campo, energías, G y áreas van en tinta. a es exclusivamente semieje mayor.
 * Los modelos didácticos declaran sus constantes; no son mediciones de satélites reales.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = fabrica(nodo ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
function construirGr1(Kit) {
  'use strict';
  const G = 6.67e-11;
  const f = x => Kit.formatear(Math.abs(x) < 1e-10 ? 0 : x, 3);
  const exacto = x => Number.isFinite(x) && Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7;
  const superindice = x => String(x).split('').map(c => ({ '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' })[c]).join('');
  const numero = x => {
    if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001)) {
      const e = Math.floor(Math.log10(Math.abs(x)));
      return `${f(x / 10 ** e)} × 10${superindice(e)}`;
    }
    return f(x);
  };
  const n = x => x < 0 || numero(x).includes('×') ? `(${numero(x)})` : numero(x);
  const q = (color, t) => ({ v: `c-${color}`, t: String(t) });
  const sub = (a, b) => ({ sub: [a, b] });
  const M = q('f', 'M'), m = q('f', 'm'), r = q('i', 'r'), F = q('h', 'F'), Fx = sub(F, 'x');
  const Fr = sub(F, 'ref'), Fn = sub(F, 'nueva'), mr = sub(m, 'ref'), mn = sub(m, 'nueva');
  const leyRazones = [{ frac: [Fn, Fr] }, ' = ', { frac: [sub(M, 'nueva'), sub(M, 'ref')] }, ' · ', { frac: [mn, mr] }, ' · ', { sup: [{ par: [{ frac: [sub(r, 'ref'), sub(r, 'nuevo')] }] }, '2'] }];
  const lit = (color, x) => q(color, numero(x));
  const cuadrado = (color, x) => ({ sup: [{ par: [lit(color, x)] }, '2'] });
  const valor = (x, unidad, color) => q(color, `${numero(x)}${unidad ? ` ${unidad}` : ''}`);
  const textoValor = (x, unidad, aprox) => `${aprox || !exacto(x) ? '≈ ' : ''}${numero(x)}${unidad ? ` ${unidad}` : ''}`;
  const factor = x => `${numero(x)} ${x === 1 ? 'vez' : 'veces'}`;
  const dm = c => c.gramos == null ? c.m : c.gramos / 1000;
  const dr = c => c.rKm == null ? c.r : c.rKm * 1000;
  const datoG = 'G ≈ 6,67 × 10⁻¹¹ N·m²/kg²: valor aproximado para este ejercicio.';
  const ley = [F, ' = G · ', M, ' · ', m, ' / ', r, '²'];
  const modelo = 'Las fuentes son esferas cuya masa se reparte igual en todas las direcciones; el cuerpo estudiado está fuera de ellas.';
  const ref = { M: 6e24, m: 600, r: 12e6 }, fuerza = (fuente, prueba, distancia) => G * fuente * prueba / distancia ** 2;
  const Fref = fuerza(ref.M, ref.m, ref.r);

  function figura(c, revelar = false) {
    const tipo = c.tipo, paneles = [], notas = [];
    const esSuma = tipo === 'superposicion' || tipo === 'equilibrio';
    const resultado = c.resultado;
    if (esSuma) {
      const fuera = tipo === 'superposicion' && c.x < 0;
      const origenA = fuera ? 2 : 0, origenB = 6;
      const sonda = tipo === 'equilibrio' ? 3 : fuera ? 0 : 2.5;
      const planetas = [{ c: [origenA, 0], R: 0.48, rotulo: 'A', colorRotulo: 'f' }, { c: [origenB, 0], R: 0.48, rotulo: 'B', colorRotulo: 'f' }];
      notas.push({ texto: `M_A = ${numero(c.MA)} kg`, color: 'f' }, { texto: `M_B = ${numero(c.MB)} kg`, color: 'f' });
      if (c.m != null) notas.push({ texto: `m = ${numero(c.m)} kg`, color: 'f' });
      notas.push({ texto: 'Derecha positiva. Esquema sin escala.' });
      if (revelar) notas.push({ texto: `${tipo === 'equilibrio' ? 'r_A' : 'F_x'} ${c.aproximado ? '≈' : '='} ${numero(resultado)} ${c.unidad}`, color: tipo === 'equilibrio' ? 'i' : 'h' });
      paneles.push({ titulo: tipo === 'equilibrio' ? 'La ubicación está por hallar' : 'Dos fuentes y una sonda', modo: 'radial', planetas,
        satelite: { c: [sonda, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [origenA, 0], a: [origenB, 0], texto: `D = ${numero(c.D / 1000)} km`, color: 'i' },
          { de: [origenA, 0], a: [sonda, 0], texto: tipo === 'equilibrio' ? 'r_A = ?' : `r_A = ${numero(Math.abs(c.x) / 1000)} km`, color: 'i' }], notas });
    } else {
      const masasConocidas = c.M != null || c.m != null || c.gramos != null;
      if (c.M != null) notas.push({ texto: `M = ${numero(c.M)} kg`, color: 'f' });
      if (c.m != null || c.gramos != null) notas.push({ texto: `m = ${numero(c.gramos == null ? c.m : c.gramos)} ${c.gramos == null ? 'kg' : 'g'}`, color: 'f' });
      if (c.F != null) notas.push({ texto: `F = ${numero(c.F)} N`, color: 'h' });
      if (c.F0 != null) notas.push({ texto: `F_ref = ${numero(c.F0)} N`, color: 'h' });
      if (tipo === 'mutua') notas.push({ texto: `M_A = ${numero(c.ma)} kg; M_B = ${numero(c.mb)} kg`, color: 'f' });
      if (c.kM != null) notas.push({ texto: `M_nueva = ${numero(c.kM)} · M_ref`, color: 'f' });
      if (c.km != null) notas.push({ texto: `m_nueva = ${numero(c.km)} · m_ref`, color: 'f' });
      notas.push({ texto: 'Esquema sin escala de distancias.' });
      if (revelar) notas.push({ texto: `${c.simboloTexto || 'F'} ${c.aproximado ? '≈' : '='} ${numero(resultado)} ${c.unidad}`, color: c.color || 'h' });
      paneles.push({ titulo: masasConocidas ? 'Planeta y sonda' : 'Comparación de ensayos', modo: 'radial',
        planeta: { c: [0, 0], R: 0.7, rotulo: tipo === 'mutua' ? 'A' : 'M', colorRotulo: 'f' },
        satelite: { c: [4, 0], rotulo: tipo === 'mutua' ? 'B' : 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [4, 0], texto: c.r != null || c.rKm != null ? `r = ${numero(dr(c) / 1000)} km` : c.kr != null ? `r_nuevo = ${numero(c.kr)} · r_ref` : 'r = ?', color: 'i' }], notas });
    }
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.25, x1: 7, y0: -1.4, y1: 1.4 }, altoGrafico: 132, paneles,
      alt: esSuma ? 'Dos fuentes A y B y una sonda. Las cotas y notas muestran los datos; el esquema no está a escala y la respuesta no aparece.' : 'Un planeta y una sonda con paneles solares. Las notas muestran los datos conocidos; la separación une sus centros. Esquema sin escala.' }, estado: {} };
  }

  function figuraJuego(k, mostrar = true) {
    const ensayos = [{ titulo: 'Referencia', k: 1 }, { titulo: 'Ensayo elegido', k }];
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.3, x1: 7, y0: -1.4, y1: 1.4 }, altoGrafico: 128, escalas: { F: 40 / Fref },
      paneles: ensayos.map(e => { const distancia = ref.r * e.k, fz = fuerza(ref.M, ref.m, distancia); return {
        titulo: e.titulo, modo: 'radial', planeta: { c: [0, 0], R: 0.65, rotulo: 'M', colorRotulo: 'f' },
        satelite: { c: [2 * e.k, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [2 * e.k, 0], texto: `r ${exacto(distancia / 1000) ? '=' : '≈'} ${numero(distancia / 1000)} km`, color: 'i' }],
        flechas: mostrar ? [{ de: [2 * e.k, 0], d: [-fz, 0], familia: 'F', color: 'h', rotulo: 'F' }] : [],
        notas: [{ texto: 'M = 6 × 10²⁴ kg; m = 600 kg', color: 'f' },
          { texto: mostrar ? `F ≈ ${numero(fz)} N` : 'La fuerza está por medir.', color: mostrar ? 'h' : 'tinta' },
          { texto: 'Separaciones a escala.' }],
      }; }), alt: 'Un planeta y una sonda en dos ensayos. Las masas son las mismas; cambia la separación entre centros. Se comparan dos ensayos didácticos.' }, estado: {} };
  }

  function caso(c) {
    let resultado, unidad = 'N', color = 'h', simbolo = F, simboloTexto = 'F', enunciado;
    const datos = [], solucion = [], errores = [];
    const aproximadoG = c.G != null;
    const error = (id, valorError, causa) => errores.push({ id, valor: valorError, causa });
    const masas = ['El planeta tiene ', valor(c.M, 'kg', 'f'), ' y la sonda, ', valor(c.gramos == null ? c.m : c.gramos, c.gramos == null ? 'kg' : 'g', 'f'), '. '];
    const descR = c.rKm != null ? valor(c.rKm, 'km', 'i') : valor(c.r, 'm', 'i');
    const eq = (s, cuenta, respuesta, u = unidad, col = color, aprox = aproximadoG || !exacto(respuesta)) => [s, aprox ? ' ≈ ' : ' = ', cuenta, aprox ? ' ≈ ' : ' = ', valor(respuesta, u, col)];
    if (['directa', 'masa', 'distancia'].includes(c.tipo)) {
      const distancia = dr(c), masa = dm(c);
      datos.push(modelo, datoG, ley);
      if (c.rKm != null || c.gramos != null) datos.push('1 km = 1000 m; 1 kg = 1000 g.');
      if (c.rKm != null) solucion.push({ texto: 'Primero pasamos la separación entre centros a metros, porque G está en unidades del SI.', ecuacion: [r, ` = ${numero(c.rKm)} · 1000 = ${numero(distancia)} m`] });
      if (c.gramos != null) solucion.push({ texto: 'Pasamos la masa de la sonda a kilogramos, porque G está en unidades del SI.', ecuacion: [m, ` = ${numero(c.gramos)} ÷ 1000 = ${numero(masa)} kg`] });
      if (c.tipo === 'directa') {
        resultado = c.G * c.M * masa / distancia ** 2;
        enunciado = [...masas, 'La separación entre centros es ', descR, '. ¿Cuál es el módulo de la fuerza gravitatoria sobre la sonda?'];
        solucion.push({ texto: 'Sustituimos las dos masas y la separación entre centros en la ley de gravitación.', ecuacion: eq(F, { frac: [[numero(c.G), ' · ', lit('f', c.M), ' · ', lit('f', masa)], cuadrado('i', distancia)] }, resultado) });
        error('lineal', c.G * c.M * masa / distancia, 'Bien planteada la ley, pero la separación va elevada al cuadrado y tú la usaste sin elevar.');
        error('sin-sonda', c.G * c.M / distancia ** 2, 'Bien usada la masa del planeta, pero faltó multiplicar también por la masa de la sonda.');
        error('doble', 2 * resultado, 'Bien calculada la atracción, pero sumaste las dos fuerzas mutuas, y cada una actúa sobre un cuerpo distinto.');
        error('signo', -resultado, 'Bien calculado el tamaño, pero un módulo de fuerza nunca es negativo.');
        error('mitad', resultado / 2, 'Bien hallada la atracción, pero la repartiste entre los dos cuerpos, y cada uno recibe la fuerza completa.');
        error('distancia-doble', resultado / 4, 'Bien elevada la separación al cuadrado, pero antes la duplicaste, y la separación dada ya va de centro a centro.');
        if (c.gramos != null) error('sin-gramos', resultado * 1000, 'Bien convertida la distancia, pero la masa de la sonda quedó en gramos, y la ley pide kilogramos.');
        if (c.rKm != null) error('sin-km', resultado * 1e6, 'Bien usadas las dos masas, pero tomaste los kilómetros como si fueran metros.');
      } else if (c.tipo === 'masa') {
        resultado = c.F * distancia ** 2 / (c.G * c.M); unidad = 'kg'; color = 'f'; simbolo = m; simboloTexto = 'm';
        enunciado = ['Una sonda está a ', descR, ' del centro de un planeta de ', valor(c.M, 'kg', 'f'), '. La atracción vale ', valor(c.F, 'N', 'h'), '. ¿Qué masa tiene la sonda?'];
        solucion.push({ texto: 'Despejamos m de la ley: multiplicamos la fuerza por el cuadrado de la distancia y dividimos entre G por M.', ecuacion: eq(m, { frac: [[lit('h', c.F), ' · ', cuadrado('i', distancia)], [numero(c.G), ' · ', lit('f', c.M)]] }, resultado) });
        error('lineal', c.F * distancia / (c.G * c.M), 'Bien despejada la masa, pero usaste la distancia sin elevarla al cuadrado.');
        error('inversa', (c.G * c.M) / (c.F * distancia ** 2), 'Bien reunidos los datos, pero invertiste el cociente: la fuerza y la distancia al cuadrado van arriba, y G por M va abajo.');
        error('doble', 2 * resultado, 'Bien hecho el despeje, pero contaste dos veces la fuerza dada.');
        error('mitad', resultado / 2, 'Bien usado el módulo, pero repartiste la fuerza entre los dos cuerpos, y la sonda recibe la fuerza completa.');
        error('signo', -resultado, 'Bien calculado el tamaño, pero una masa nunca lleva signo negativo.');
      } else {
        resultado = Math.sqrt(c.G * c.M * masa / c.F) / 1000; unidad = 'km'; color = 'i'; simbolo = r; simboloTexto = 'r';
        enunciado = [...masas, 'La atracción tiene módulo ', valor(c.F, 'N', 'h'), '. ¿Cuál es la separación entre centros, en kilómetros?'];
        datos.push('1 km = 1000 m.');
        solucion.push({ texto: 'Despejamos el cuadrado de la separación y sacamos su raíz positiva, porque una distancia no es negativa; luego pasamos de metros a kilómetros.', ecuacion: eq(r, [{ raiz: [{ frac: [[numero(c.G), ' · ', lit('f', c.M), ' · ', lit('f', masa)], lit('h', c.F)] }] }, ' ÷ 1000'], resultado) });
        error('sin-raiz', (c.G * c.M * masa / c.F) / 1000, 'Bien despejado el cuadrado de la separación, pero faltó sacar la raíz.');
        error('sin-km', resultado * 1000, 'Bien hallada la separación en metros, pero faltó pasarla a kilómetros.');
        error('doble', 2 * resultado, 'Bien hallada la separación, pero la duplicaste como si fuera un diámetro.');
        error('mitad', resultado / 2, 'Bien sacada la raíz, pero después dividiste entre dos, y ese paso no corresponde.');
        error('signo', -resultado, 'Bien calculado el tamaño, pero una separación nunca es negativa.');
      }
    } else if (c.tipo === 'mutua') {
      resultado = c.F0;
      enunciado = ['Un planeta A tiene ', valor(c.ma, 'kg', 'f'), ' y una sonda B, ', valor(c.mb, 'kg', 'f'), '. A atrae a B con ', valor(c.F0, 'N', 'h'), '. ¿Con qué módulo de fuerza B atrae a A?'];
      datos.push('Las fuerzas gravitatorias mutuas tienen igual módulo y sentidos opuestos; actúan sobre cuerpos distintos.');
      solucion.push({ texto: 'La tercera ley de Newton iguala los módulos de estas dos fuerzas, aunque las masas sean distintas.', ecuacion: [sub(F, 'sobre A'), ' = ', sub(F, 'sobre B'), ` = ${numero(resultado)} N`] });
      error('por-masas', c.F0 * c.mb / c.ma, 'Bien comparadas las masas, pero multiplicaste la fuerza por la masa de B entre la de A, y las fuerzas mutuas tienen igual módulo.');
      error('inversa-masas', c.F0 * c.ma / c.mb, 'Bien distinguidos los cuerpos, pero multiplicaste la fuerza por la masa de A entre la de B, y las fuerzas mutuas tienen igual módulo.');
      error('doble', 2 * c.F0, 'Bien reconocidas las dos fuerzas, pero sumaste sus módulos, y cada una actúa sobre un cuerpo distinto.');
      error('cero', 0, 'Bien notados los sentidos opuestos, pero las dos fuerzas actúan sobre cuerpos distintos, así que no se cancelan.');
      error('mitad', c.F0 / 2, 'Bien reconocidos los dos cuerpos, pero repartiste la fuerza entre ellos, y cada uno recibe la fuerza completa.');
      error('signo', -c.F0, 'Bien invertido el sentido, pero un módulo nunca es negativo.');
    } else if (['razon', 'masa-razon', 'distancia-razon'].includes(c.tipo)) {
      // Auditoría (26 nov): la ley general, no el atajo de cocientes (en Datos se partía a 390 px y dejaba «)²» solo).
      datos.push('Los subíndices ref y nuevo distinguen el ensayo de referencia del ensayo modificado.', ley, 'G es la misma en los dos ensayos.');
      if (c.tipo === 'razon') {
        resultado = c.F0 * c.kM * c.km / c.kr ** 2;
        enunciado = ['La atracción de referencia es ', valor(c.F0, 'N', 'h'), '. La masa fuente pasa a ser ', q('f', factor(c.kM)), ' la original; la de la sonda, ', q('f', factor(c.km)), ' la suya, y la separación, ', q('i', factor(c.kr)), ' la original. ¿Cuál es la nueva fuerza?'];
        solucion.push({ texto: 'Como G no cambia, multiplicamos la fuerza de referencia por los factores de las dos masas y la dividimos entre el factor de separación al cuadrado.', ecuacion: eq(Fn, [lit('h', c.F0), ' · ', lit('f', c.kM), ' · ', lit('f', c.km), ' ÷ ', cuadrado('i', c.kr)], resultado) });
        error('lineal', c.F0 * c.kM * c.km / c.kr, 'Bien cambiadas las masas, pero dividiste una sola vez entre el factor de separación, y ese factor va al cuadrado.');
        error('sin-distancia', c.F0 * c.kM * c.km, 'Bien multiplicados los factores de masa, pero olvidaste dividir entre el cambio de separación al cuadrado.');
        error('sin-masas', c.F0 / c.kr ** 2, 'Bien elevado al cuadrado el factor de separación, pero olvidaste multiplicar por los cambios de las masas.');
        error('sin-fuente', c.F0 * c.km / c.kr ** 2, 'Bien cambiada la masa de la sonda, pero olvidaste el cambio de la masa fuente.');
        error('sin-sonda', c.F0 * c.kM / c.kr ** 2, 'Bien cambiada la masa fuente, pero olvidaste el cambio de la masa de la sonda.');
        error('multiplica-distancia', c.F0 * c.kM * c.km * c.kr ** 2, 'Bien elevado al cuadrado el factor de separación, pero multiplicaste por él. Una separación mayor debilita la atracción, así que se divide.');
        error('signo', -resultado, 'Bien calculado el tamaño, pero un módulo de fuerza nunca es negativo.');
      } else if (c.tipo === 'masa-razon') {
        resultado = c.F1 / c.F0 * c.kr ** 2 / c.km; unidad = 'veces'; color = 'f'; simbolo = [sub(M, 'nueva'), '/', sub(M, 'ref')]; simboloTexto = 'M_nueva/M_ref';
        enunciado = ['La atracción pasa de ', valor(c.F0, 'N', 'h'), ' a ', valor(c.F1, 'N', 'h'), '. La masa de la sonda pasa a ser ', q('f', factor(c.km)), ' la original, y la separación, ', q('i', factor(c.kr)), ' la original. ¿Por qué factor cambió la masa fuente?'];
        solucion.push({ texto: 'Despejamos el factor de la masa fuente: dividimos las dos fuerzas, multiplicamos por el factor de separación al cuadrado y dividimos entre el factor de la sonda.', ecuacion: eq(simbolo, [{ frac: [lit('h', c.F1), lit('h', c.F0)] }, ' · ', cuadrado('i', c.kr), ' ÷ ', lit('f', c.km)], resultado) });
        error('lineal', c.F1 / c.F0 * c.kr / c.km, 'Bien comparadas las fuerzas, pero compensaste la separación sin elevar su factor al cuadrado.');
        error('sin-distancia', c.F1 / c.F0 / c.km, 'Bien compensada la masa de la sonda, pero olvidaste el cambio de separación.');
        error('inversa', 1 / resultado, 'Bien reunidos los factores, pero invertiste el cociente: se pide la masa nueva entre la de referencia.');
        error('multiplica-sonda', c.F1 / c.F0 * c.kr ** 2 * c.km, 'Bien elevada la separación al cuadrado, pero multiplicaste por el factor de la sonda en vez de dividir entre él.');
        error('doble', 2 * resultado, 'Bien despejado el factor, pero después lo duplicaste sin motivo.');
      } else {
        resultado = Math.sqrt(c.F0 * c.kM * c.km / c.F1); unidad = 'veces'; color = 'i'; simbolo = [sub(r, 'nuevo'), '/', sub(r, 'ref')]; simboloTexto = 'r_nuevo/r_ref';
        enunciado = ['La atracción pasa de ', valor(c.F0, 'N', 'h'), ' a ', valor(c.F1, 'N', 'h'), '. La masa fuente pasa a ser ', q('f', factor(c.kM)), ' la original, y la de la sonda, ', q('f', factor(c.km)), ' la suya. ¿Por qué factor cambió la separación?'];
        solucion.push({ texto: 'Al comparar las dos fuerzas sale el cuadrado del factor de separación; sacamos su raíz positiva para obtener el factor.', ecuacion: eq(simbolo, { raiz: [{ frac: [[lit('h', c.F0), ' · ', lit('f', c.kM), ' · ', lit('f', c.km)], lit('h', c.F1)] }] }, resultado) });
        error('sin-raiz', resultado ** 2, 'Bien hallado el cuadrado del factor, pero faltó sacar la raíz.');
        error('inversa', 1 / resultado, 'Bien sacada la raíz, pero invertiste el factor: se pide la separación nueva entre la de referencia.');
        error('sin-masas', Math.sqrt(c.F0 / c.F1), 'Bien comparadas las fuerzas, pero olvidaste los cambios de las masas.');
        error('sin-sonda', Math.sqrt(c.F0 * c.kM / c.F1), 'Bien incluido el cambio de la masa fuente, pero olvidaste el de la masa de la sonda.');
        error('doble', 2 * resultado, 'Bien despejada la separación, pero después duplicaste el factor hallado.');
      }
    } else if (c.tipo === 'superposicion') {
      const a = c.G * c.MA * c.m / c.x ** 2, b = c.G * c.MB * c.m / (c.D - c.x) ** 2;
      const sa = Math.sign(-c.x), sb = Math.sign(c.D - c.x);
      resultado = sa * a + sb * b; simbolo = Fx; simboloTexto = 'F_x';
      enunciado = ['A y B tienen ', valor(c.MA, 'kg', 'f'), ' y ', valor(c.MB, 'kg', 'f'), '. Sus centros están separados ', valor(c.D / 1000, 'km', 'i'), '. Una sonda de ', valor(c.m, 'kg', 'f'), ' está ', valor(Math.abs(c.x) / 1000, 'km', 'i'), c.x < 0 ? ' a la izquierda de A.' : ' a la derecha de A, entre ambas.', ' ¿Cuál es la fuerza horizontal neta?'];
      datos.push(modelo, datoG, ['A está a la izquierda de B. Derecha positiva; ', sub(r, 'A'), ' y ', sub(r, 'B'), ' son separaciones entre centros.'],
        [sub(F, 'A'), ' = G · ', sub(M, 'A'), ' · ', m, ' / ', { sup: [sub(r, 'A'), '2'] }], [sub(F, 'B'), ' = G · ', sub(M, 'B'), ' · ', m, ' / ', { sup: [sub(r, 'B'), '2'] }, '. Cada fuerza apunta hacia su fuente.'],
        '1 km = 1000 m. La componente neta es la suma de las componentes de las dos fuerzas.');
      solucion.push({ texto: 'Hallamos la separación de la sonda a cada fuente. Cada atracción apunta desde la sonda hacia su fuente.', ecuacion: [sub(r, 'A'), ` = ${numero(Math.abs(c.x))} m; `, sub(r, 'B'), ` = ${numero(c.D - c.x)} m`] });
      solucion.push({ texto: 'Con la ley de gravitación, calculamos por separado el módulo de cada atracción.', ecuacion: [sub(F, 'A'), ` ≈ ${numero(a)} N; `, sub(F, 'B'), ` ≈ ${numero(b)} N`] });
      solucion.push({ texto: 'Sumamos las componentes con su signo, sin redondear los valores intermedios. El signo de la suma dice hacia dónde apunta la fuerza neta.', ecuacion: [Fx, ' = ', sa < 0 ? '−' : '', sub(F, 'A'), sb < 0 ? ' − ' : ' + ', sub(F, 'B'), ' ≈ ', valor(resultado, 'N', 'h')] });
      error('modulos', a + b, 'Bien halladas las dos fuerzas, pero sumaste sus módulos sin mirar hacia dónde apunta cada una.');
      error('signo', -resultado, 'Bien combinadas las fuerzas, pero invertiste el sentido de la resultante.');
      error('solo-a', sa * a, 'Bien calculada la atracción de A, pero olvidaste la de B.');
      error('solo-b', sb * b, 'Bien calculada la atracción de B, pero olvidaste la de A.');
      error('resta-modulos', a - b, 'Bien hallados los módulos, pero los restaste sin ver hacia dónde apunta cada fuerza.');
      error('doble', 2 * resultado, 'Bien sumadas las componentes, pero contaste dos veces la resultante.');
    } else if (c.tipo === 'equilibrio') {
      resultado = c.D * Math.sqrt(c.MA) / (Math.sqrt(c.MA) + Math.sqrt(c.MB)) / 1000;
      unidad = 'km'; color = 'i'; simbolo = sub(r, 'A'); simboloTexto = 'r_A';
      enunciado = ['Dos fuentes A y B tienen masas ', valor(c.MA, 'kg', 'f'), ' y ', valor(c.MB, 'kg', 'f'), ', separadas ', valor(c.D / 1000, 'km', 'i'), '. Entre sus centros, ¿a qué distancia de A se anula la fuerza neta sobre una sonda?'];
      datos.push(modelo, 'Entre las fuentes, las dos atracciones apuntan en sentidos opuestos; la fuerza neta es cero cuando sus módulos son iguales.',
        // Auditoría (26 nov): la ley iba como texto crudo («F_A = G·M_A·m/r_A^2»); ahora con su notación.
        [sub(F, 'A'), ' = G · ', sub(M, 'A'), ' · ', m, ' / ', { sup: [sub(r, 'A'), '2'] }], [sub(F, 'B'), ' = G · ', sub(M, 'B'), ' · ', m, ' / ', { sup: [sub(r, 'B'), '2'] }],
        [sub(r, 'A'), ' + ', sub(r, 'B'), ' = D'], '1 km = 1000 m. D es la separación entre los centros de A y B.');
      const razon = Math.sqrt(c.MB / c.MA);
      solucion.push({ texto: 'Igualamos los módulos de las dos atracciones. G y la masa de la sonda se cancelan, y queda la razón entre las separaciones.', ecuacion: [{ frac: [sub(r, 'B'), sub(r, 'A')] }, ' = ', { raiz: [{ frac: [lit('f', c.MB), lit('f', c.MA)] }] }, exacto(razon) ? ' = ' : ' ≈ ', numero(razon)] });
      // Auditoría (26 nov): el despeje saltaba de la razón al resultado; ahora se ve r_A + razón · r_A = D.
      solucion.push({ texto: ['Las dos separaciones suman D, y ', sub(r, 'B'), ' es la razón multiplicada por ', sub(r, 'A'), '.'], ecuacion: [sub(r, 'A'), ' + ', numero(razon), ' · ', sub(r, 'A'), ' = ', valor(c.D / 1000, 'km', 'i')] });
      solucion.push({ texto: 'Juntamos los dos términos que llevan la distancia desde A y la despejamos.', ecuacion: eq(simbolo, { frac: [lit('i', c.D / 1000), `1 + ${numero(razon)}`] }, resultado) });
      error('mitad', c.D / 2000, 'Bien buscado el punto entre las dos fuentes, pero el punto medio solo sirve cuando las masas son iguales.');
      error('lineal', c.D * c.MA / (c.MA + c.MB) / 1000, 'Bien comparadas las masas, pero la razón de separaciones es la raíz de la razón de masas, y faltó sacar la raíz.');
      error('desde-b', c.D / 1000 - resultado, 'Bien hallado el punto, pero mediste su distancia desde B y no desde A.');
      error('sin-suma', c.D * Math.sqrt(c.MA / c.MB) / 1000, 'Bien obtenida la razón, pero dividiste D entre ella sin usar que las dos separaciones suman D.');
      error('doble', 2 * resultado, 'Bien ubicado el punto, pero duplicaste su distancia desde A.');
    } else throw new Error(`Tipo desconocido en ley universal: ${c.tipo}`);
    const aproximado = aproximadoG || !exacto(resultado);
    const vistos = new Set([textoValor(resultado, unidad, aproximadoG)]);
    const distintos = errores.filter(e => {
      if (!Number.isFinite(e.valor)) return false;
      const k = textoValor(e.valor, unidad, aproximadoG);
      if (vistos.has(k)) return false; vistos.add(k); return true;
    }).sort((a, b) => {
      const prioridad = e => Math.abs(e.valor / resultado) >= 0.05 && Math.abs(e.valor / resultado) <= 20 ? 0 : 1;
      return prioridad(a) - prioridad(b);
    }).map(e => ({ ...e, texto: textoValor(e.valor, unidad, aproximadoG), error: `GR1-${e.id.toUpperCase()}`, siFuera: `${e.causa} Así sale ${textoValor(e.valor, unidad, aproximadoG)}.` }));
    return { enunciado, datos, solucion, resultado, unidad, color, simbolo, aproximado, errores: distintos,
      respuesta: [simbolo, aproximado ? ' ≈ ' : ' = ', valor(resultado, unidad, color)],
      dibujo: figura({ ...c, resultado, unidad, color, simboloTexto, aproximado }),
      verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado }, errores: distintos.map(e => ({ id: e.id, valor: e.valor })) } };
  }

  const casosEjemplo = [
    { tipo: 'razon', nivel: 1, titulo: 'Cambia una masa', F0: 54, kM: 3, km: 1, kr: 1 },
    { tipo: 'razon', nivel: 1, titulo: 'Cambia la separación', F0: 81, kM: 1, km: 1, kr: 3 },
    { tipo: 'directa', nivel: 1, titulo: 'La atracción sobre una sonda', G, M: 4e24, m: 500, r: 1e7 },
    { tipo: 'directa', nivel: 1, titulo: 'Una sonda más lejana', G, M: 8e24, m: 300, r: 2e7 },
    { tipo: 'mutua', nivel: 1, titulo: 'La fuerza sobre el otro cuerpo', F0: 75, ma: 2e24, mb: 500 },
    { tipo: 'directa', nivel: 2, titulo: 'Gramos y kilómetros', G, M: 3e24, gramos: 75000, rKm: 9000 },
    { tipo: 'directa', nivel: 2, titulo: 'Todas las magnitudes en el SI', G, M: 5e24, gramos: 160000, rKm: 20000 },
    { tipo: 'masa', nivel: 2, titulo: 'La masa desconocida', G, M: 4e24, F: 667, r: 1e7 },
    { tipo: 'distancia', nivel: 2, titulo: 'Una separación en kilómetros', G, M: 6e24, m: 800, F: 800.4 },
    { tipo: 'masa-razon', nivel: 2, titulo: 'Reconstruir el cambio de masa', F0: 32, F1: 72, km: 1, kr: 2 },
    { tipo: 'razon', nivel: 3, titulo: 'Tres cambios en un mismo ensayo', F0: 450, kM: 3, km: 0.5, kr: 1.5 },
    { tipo: 'distancia-razon', nivel: 3, titulo: 'La separación que explica el resultado', F0: 180, F1: 80, kM: 2, km: 2 },
    { tipo: 'superposicion', nivel: 3, titulo: 'Una sonda entre dos fuentes', G, MA: 2e24, MB: 3e24, m: 100, D: 1e7, x: 4e6 },
    { tipo: 'equilibrio', nivel: 3, titulo: 'El punto de fuerza nula', MA: 16e24, MB: 9e24, D: 1e7 },
    { tipo: 'superposicion', nivel: 3, titulo: 'La sonda queda a la izquierda', G, MA: 4e24, MB: 2e24, m: 120, D: 9e6, x: -3e6 },
  ];
  const causasCortas = {
    lineal: 'no elevas la separación al cuadrado', 'sin-distancia': 'olvidas el cambio de separación', 'sin-masas': 'olvidas los cambios de masa',
    'sin-fuente': 'olvidas la masa fuente', 'sin-sonda': 'olvidas la masa de la sonda', 'multiplica-distancia': 'multiplicas por la separación al cuadrado',
    signo: 'cambias el signo', 'sin-raiz': 'no sacas la raíz', inversa: 'inviertes el cociente',
    doble: 'duplicas el resultado', modulos: 'sumas los módulos sin sus sentidos', 'solo-a': 'solo cuentas la fuente A', 'solo-b': 'solo cuentas la fuente B',
    'resta-modulos': 'restas los módulos sin sus sentidos', mitad: 'supones masas iguales', 'desde-b': 'mides desde B', 'sin-suma': 'divides D entre la razón',
  };
  let indiceLetra = 0;
  const ejemplos = casosEjemplo.map(c => {
    const b = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo,
      solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      const incorrectas = b.errores.slice(0, 4);
      if (incorrectas.length !== 4) throw new Error(`Faltan errores distintos en ${c.titulo}`);
      e.alternativas = incorrectas.map(x => x.texto);
      e.alternativas.splice(indiceLetra++, 0, textoValor(b.resultado, b.unidad, c.G != null));
      e.solucion.push({ texto: incorrectas.map(x => `${textoValor(x.valor, '', c.G != null)} sale si ${causasCortas[c.tipo === 'equilibrio' && x.id === 'lineal' ? 'sin-raiz' : x.id]}.`).join(' ') });
    }
    return e;
  });

  function entrada(semilla, resuelto) {
    const s = Math.abs(Math.trunc(semilla));
    const tipos = ['razon', 'directa', 'masa', 'distancia', 'masa-razon', 'superposicion', 'equilibrio', 'mutua', 'distancia-razon'];
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla.
    const tipo = tipos[(s + (resuelto ? 0 : 4)) % tipos.length], k = 1 + Math.floor(s / tipos.length) % 9, z = Math.floor(s / 81) % 8;
    const fuente = (resuelto ? 12 + z : 2 + z) * 1e24;
    if (tipo === 'razon') return { tipo, F0: (resuelto ? 810 : 310) + 10 * k + z, kM: 2 + z % 3, km: 1 + (k % 3) / 2, kr: 1.5 + (k % 3) / 2 };
    if (tipo === 'directa') return { tipo, G, M: fuente, m: (resuelto ? 410 : 110) + 10 * k, r: (7 + k) * 1e6 };
    if (tipo === 'masa') { const radio = resuelto ? 2e7 : 1e7, masa = (resuelto ? 400 : 80) + 40 * k; return { tipo, G, M: fuente, r: radio, F: Math.round(G * fuente * masa / radio ** 2 * 1000) / 1000 }; }
    if (tipo === 'distancia') { const masa = (500 + 20 * z) * k ** 2, radio = (resuelto ? 2e7 : 1e7) * k; return { tipo, G, M: fuente, m: masa, F: Math.round(G * fuente * masa / radio ** 2 * 1000) / 1000 }; }
    if (tipo === 'masa-razon') return { tipo, F0: resuelto ? 420 + 10 * z : 210 + 10 * z, F1: (resuelto ? 180 : 90) + 6 * k, km: 1.5, kr: 2 + z % 2 };
    if (tipo === 'mutua') return { tipo, F0: (resuelto ? 220 : 95) + 7 * k + 5 * z, ma: (resuelto ? 10 + z : 1 + z) * 2e24, mb: (resuelto ? 1600 : 1000) + 50 * k };
    if (tipo === 'distancia-razon') {
      const F0 = (resuelto ? 36000 : 3600) + 3600 * z, kM = 2 + k % 3, km = 1 + k % 2, kr = 2 + k % 4;
      return { tipo, F0, F1: F0 * kM * km / kr ** 2, kM, km };
    }
    if (tipo === 'superposicion') return { tipo, G, MA: (resuelto ? 5 : 3) * 1e24, MB: (2 + z) * 1e24, m: (resuelto ? 45 : 15) + 5 * k, D: 18e6, x: (resuelto ? -1 : 1) * (6 + k % 3) * 1e6 };
    // Auditoría (26 nov): la sonda quedaba a 1300–3000 km de un planeta de 10²⁴ kg o más (densidad imposible).
    const nEq = resuelto ? [2, 3, 4][k % 3] : [1.5, 2, 2.5, 3][k % 4], MAeq = (resuelto ? 2.25 : 4) * 1e24;
    return { tipo, MA: MAeq, MB: MAeq * nEq ** 2, D: (20 + z) * 1e6 };
  }
  function generar(semilla, resuelto) {
    const b = caso(entrada(semilla, resuelto));
    if (b.errores.length < 3) throw new Error(`Faltan alternativas en semilla ${semilla}: ${b.verificacion.tipo}`);
    if (resuelto) return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: b.verificacion,
      pasos: [{ tipo: 'pide', texto: 'Identificamos la magnitud pedida y a qué cuerpo o separación pertenece.' },
        { tipo: 'regla', texto: b.verificacion.tipo === 'superposicion' ? 'Calculamos cada fuerza y sumamos sus componentes sobre la misma sonda.' : 'Usamos la ley de gravitación: la fuerza depende de las dos masas y del cuadrado de la separación entre centros.' },
        ...b.solucion.map(x => ({ tipo: 'cuentas', ...x })),
        { tipo: 'sentido', texto: b.verificacion.tipo === 'superposicion' ? 'El signo señala el sentido de la fuerza neta sobre la sonda.' : 'Comprobamos que la respuesta esté en la unidad pedida y que no sea negativa, porque módulos, masas y separaciones nunca lo son.' }] };
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion,
      opciones: [{ id: 'c', texto: textoValor(b.resultado, b.unidad, b.verificacion.G != null), correcta: true }, ...b.errores.slice(0, 3).map(x => ({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera }))],
      solucion: { texto: b.verificacion.tipo === 'superposicion' ? 'Cada atracción apunta hacia su fuente. Sumamos las componentes sin redondear los pasos intermedios.' : 'Aplicamos la ley a las mismas masas y separaciones que da el problema.', ecuacion: b.solucion.at(-1).ecuacion } };
  }
  const pred = { tipo: 'razon', F0: 160, kM: 2, km: 3, kr: 2 };
  const predCaso = caso(pred);
  const predErrores = ['lineal', 'sin-distancia', 'sin-masas'].map(id => predCaso.errores.find(e => e.id === id));
  const idea = {
    id: 'cuadrado-inverso', titulo: 'Ley de gravitación universal',
    pregunta: '¿Cómo cambia la atracción cuando cambian las masas y la separación?',
    aprendizaje: 'Calculas la atracción entre cuerpos y distingues el efecto de cada masa y de la distancia entre centros.',
    actividad: 'Comparar dos ensayos con las mismas masas y distinta separación entre centros.',
    temas: ['Ley de gravitación universal'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'Un planeta y una sonda', texto: ['Todo cuerpo con masa atrae a cualquier otro cuerpo con masa, y la ley de gravitación universal dice con cuánta fuerza. Aquí comparamos un planeta y una sonda: la fuerza sobre la sonda apunta hacia el planeta.'], dibujo: figuraJuego(1.5, false) },
      { titulo: 'De centro a centro', texto: ['La distancia ', r, ' va del centro del planeta al centro de la sonda; no se mide desde la superficie. La masa del planeta se escribe ', M, ' y la de la sonda, ', m, ', las dos en kilogramos.'] },
      { titulo: 'Qué medimos en cada ensayo', texto: ['El tamaño de la fuerza, su módulo ', F, ', se mide en newtons. La constante de gravitación universal se escribe G, y usaremos G ≈ 6,67 × 10⁻¹¹ N·m²/kg². El subíndice ref marca el ensayo de referencia.'] },
    ] },
    juega: {
      consigna: 'Compara ensayos con las mismas masas. Cambia la separación entre centros y observa cómo cambia la atracción sobre la sonda.',
      voz: 'La referencia no cambia; el ensayo elegido se aleja o se acerca.',
      controles: [{ id: 'k', etiqueta: 'Separación respecto de la referencia', min: 1, max: 3, paso: 0.5, inicio: 1, unidad: 'veces', decimales: 1, color: 'c-i', auto: { velocidad: 0.25, modo: 'rebota' } }],
      mision: { texto: 'Haz que la fuerza sea la cuarta parte de la referencia.',
        logrado: a => Math.abs(fuerza(ref.M, ref.m, ref.r * a.k) / Fref - 0.25) < 1e-10,
        testigo: [{ k: 2 }], bien: 'Coincide: con esta separación, la fuerza es la cuarta parte de la referencia.' },
      // Auditoría (26 nov): con el avance automático el control mostraba «1,1 veces» y el dibujo, 13 599,24 km.
      // Dibujo y lectura usan el valor con la cifra que muestra el control.
      dibujo: a => figuraJuego(Math.round(a.k * 10) / 10),
      lectura: a => { const k = Math.round(a.k * 10) / 10, proporcion = fuerza(ref.M, ref.m, ref.r * k) / Fref; return k === 1 ? 'Ahora atrae lo mismo que en la referencia.' : ['Ahora atrae ', q('h', `${exacto(proporcion) ? '' : '≈ '}${numero(proporcion)}`), ' veces lo que atraía en la referencia.']; },
      leyenda: [{ s: M, t: 'masa de la fuente, en kilogramos' }, { s: m, t: 'masa de la sonda, en kilogramos' },
        { s: r, t: 'distancia entre centros, en kilómetros en la figura' }, { s: F, t: 'módulo de fuerza gravitatoria, en newtons' }], minimo: 2,
    },
    predice: {
      pregunta: 'Ahora cambian las dos masas y la separación. ¿Cuál es el nuevo módulo de la fuerza gravitatoria?',
      datos: ['La fuerza de referencia es 160 N.', 'La masa fuente se duplica y la masa de la sonda se triplica.', 'La separación entre centros también se duplica.'],
      dibujo: figura(pred), revelar: figura({ ...pred, resultado: predCaso.resultado, unidad: 'N', color: 'h', simboloTexto: 'F_nueva', aproximado: false }, true),
      opciones: [{ id: 'c', texto: textoValor(predCaso.resultado, 'N', false), correcta: true }, ...predErrores.map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      coincide: 'Las dos masas aumentan la atracción y la mayor separación la reduce, así que hay que combinar los tres cambios.',
      verificacion: predCaso.verificacion,
    },
    mira: {
      pieza: 'fis-gravitacion', datos: { ...figura(pred).datos, cortes: [figura(pred).datos, figura({ ...pred, resultado: predCaso.resultado, unidad: 'N', color: 'h', simboloTexto: 'F_nueva' }, true).datos] },
      pasos: [
        { estado: { corte: 0 }, texto: 'Dividimos el ensayo nuevo entre la referencia; como G es la misma en los dos, se cancela.', ecuacion: leyRazones },
        { estado: { corte: 0 }, texto: 'Cada masa que crece aumenta la fuerza en la misma proporción, así que sus dos factores se multiplican.', ecuacion: ['Factor de masas = 2 · 3 = 6'] },
        { estado: { corte: 0 }, texto: 'La separación está al cuadrado en el denominador: al duplicarla, la fuerza se divide entre su cuadrado.', ecuacion: ['Factor de separación = 2² = 4'] },
        { estado: { corte: 1 }, texto: 'Multiplicamos la fuerza de referencia por el factor de las masas y la dividimos entre el de la separación.', ecuacion: [Fn, ` = 160 · 6 ÷ 4 = ${numero(predCaso.resultado)} N`] },
      ],
    },
    regla: {
      texto: 'La atracción es proporcional a cada masa y disminuye con el cuadrado de la separación entre centros. Los dos cuerpos se atraen con fuerzas de igual módulo y sentidos opuestos, y cada fuerza actúa sobre un cuerpo distinto.',
      ecuacion: [F, ' = ', { frac: [['G · ', M, ' · ', m], { sup: [r, '2'] }] }],
      condicion: 'los cuerpos son pequeños o son esferas con la masa repartida por igual, el cuerpo atraído está fuera de la esfera y r se mide entre centros.',
      voz: 'Con varias fuentes, calcula cada atracción y suma sus componentes sobre el mismo cuerpo.',
      dibujo: figura({ tipo: 'directa', M: 5e24, m: 200, r: 1.5e7, G }),
    },
    ejemplos,
    resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) },
    ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'ley de gravitación universal', simple: 'La descripción de la atracción entre cuerpos con masa.',
      def: 'Ley que relaciona la atracción entre cuerpos con sus masas y la separación entre sus centros.',
      ejemplos: ['La Tierra atrae una sonda.', 'Una sonda también atrae a la Tierra.', 'Dos esferas con masa se atraen aunque no se toquen.'] },
    { termino: 'distancia entre centros', simbolo: 'r', medida: 'm', simple: 'La longitud que une los centros de los dos cuerpos.',
      def: 'Longitud del segmento entre los centros de los cuerpos; no empieza en la superficie del planeta.',
      ejemplos: ['La cota puede partir del centro dibujado de un planeta.', 'La distancia entre dos centros se expresa en metros.', 'La altura sobre una superficie y la distancia entre centros son medidas distintas.'] },
    { termino: 'constante de gravitación universal', simbolo: 'G', medida: 'N·m²/kg²', simple: 'Una constante medida que aparece en la ley de gravitación.',
      def: 'Constante medida experimentalmente que relaciona masas, separación y fuerza en la ley gravitacional.',
      ejemplos: ['G se distingue de una masa.', 'El ejercicio indica qué aproximación de G utiliza.', 'Cambiar la sonda no significa cambiar G.'] },
  ];
  const letras = { G: 'constante de gravitación universal', M: 'masa de la fuente', m: 'masa del cuerpo atraído',
    r: 'distancia entre centros', F: 'módulo de fuerza gravitatoria', F_x: 'componente horizontal de fuerza gravitatoria',
    k: 'factor de separación respecto de la referencia', A: 'primera fuente o primer cuerpo', B: 'segunda fuente o segundo cuerpo',
    D: 'distancia entre los centros de las fuentes A y B', x: 'coordenada horizontal de la sonda medida desde A',
    r_A: 'separación entre A y la sonda', r_B: 'separación entre B y la sonda',
    F_ref: 'fuerza de referencia', F_nueva: 'fuerza del ensayo modificado', M_ref: 'masa fuente de referencia', M_nueva: 'masa fuente modificada',
    m_ref: 'masa de la sonda de referencia', m_nueva: 'masa de la sonda modificada', r_ref: 'separación de referencia', r_nuevo: 'separación modificada' };
  return { idea, glosario, letras };
}

function construirGr2(Kit) {
  'use strict';

  const fmt = x => Kit.formatear(Math.abs(x)<1e-10?0:x,3);
  const sup = x => String(x).split('').map(t=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'})[t]).join('');
  const exacto = x => { const escala=x&&(Math.abs(x)>=1e6||Math.abs(x)<0.001)?10**Math.floor(Math.log10(Math.abs(x))):1; return Number.isFinite(x)&&Math.abs(x/escala*1000-Math.round(x/escala*1000))<1e-7; };
  const numero = x => {if(x&&(Math.abs(x)>=1e6||Math.abs(x)<0.001)){const e=Math.floor(Math.log10(Math.abs(x)));return `${fmt(x/10**e)} × 10${sup(e)}`;}return fmt(x);};
  const q=(c,t)=>c==='tinta'?String(t):({v:`c-${c}`,t:String(t)}),sub=(a,b)=>({sub:[a,b]}),lit=(c,x)=>q(c,numero(x));
  const valor=(x,u,c='tinta')=>q(c,`${numero(x)}${u?' '+u:''}`);
  const cuadrado=(c,x)=>({sup:[{par:[lit(c,x)]},'2']});
  const textoValor=(x,u,aprox=false)=>`${aprox||!exacto(x)?'≈ ':''}${numero(x)}${u?' '+u:''}`;
  const r=q('i','r'),R=q('i','R'),h=q('i','h'),m=q('f','m'),F=q('h','F'),N=q('h','N'),g=q('tinta','g'),g0=sub(g,'0'),gx=sub(g,'x'),mu=q('tinta','GM');
  const modelo='La fuente es una esfera cuya masa se reparte igual en todas las direcciones. Evaluamos fuera del planeta e ignoramos otras atracciones.';
  const campoLocal=c=>c.g!=null?c.g:c.mu!=null?c.mu/(c.r==null?(c.R+c.h)**2:c.r**2):c.g0*c.R**2/(c.R+c.h)**2;
  const eq=(s,cuenta,res,u,c='tinta',aprox=false)=>[s,' = ',cuenta,aprox||!exacto(res)?' ≈ ':' = ',valor(res,u,c)];
  function figura(c,revelar=false) {
    const notas=[],cotas=[],suma=['superposicion','nulo'].includes(c.tipo);let panel;
    if(suma){
      const fuera=c.x<0,a=fuera?2:0,b=6,p=c.tipo==='nulo'?3:fuera?0:2.5;
      notas.push({texto:`GM_A = ${numero(c.muA)} m³/s²`},{texto:`GM_B = ${numero(c.muB)} m³/s²`},{texto:'Derecha positiva. Esquema sin escala.'});
      cotas.push({de:[a,0],a:[b,0],texto:`D = ${numero(c.D/1000)} km`,color:'i'},{de:[a,0],a:[p,0],texto:c.tipo==='nulo'?'r_A = ?':`r_A = ${numero(Math.abs(c.x)/1000)} km`,color:'i'});
      panel={titulo:c.tipo==='nulo'?'La ubicación está por hallar':'Dos fuentes y un punto de prueba',modo:'radial',planetas:[{c:[a,0],R:.48,rotulo:'A',colorRotulo:'f'},{c:[b,0],R:.48,rotulo:'B',colorRotulo:'f'}],satelite:{c:[p,0],rotulo:'m',colorRotulo:'f',tam:9},cotas,notas};
    } else {
      if(c.mu!=null)notas.push({texto:`GM ${c.aprox?'≈':'='} ${numero(c.mu)} m³/s²`});
      if(c.g0!=null)notas.push({texto:`g_0 = ${numero(c.g0)} N/kg`});
      if(c.g!=null)notas.push({texto:`g = ${numero(c.g)} N/kg`});
      if(c.m!=null)notas.push({texto:`m = ${numero(c.m)} kg`,color:'f'});
      if(c.F!=null)notas.push({texto:`F = ${numero(c.F)} N`,color:'h'});
      if(c.beta!=null)notas.push({texto:`β = ${numero(c.beta)}; descenso acelerado`});
      if(c.kM!=null)notas.push({texto:`M_nueva = ${numero(c.kM)} · M_ref`,color:'f'});
      if(c.kR!=null)notas.push({texto:`R_nuevo = ${numero(c.kR)} · R_ref`,color:'i'});
      if(c.R!=null)cotas.push({de:[0,0],a:[.7,0],texto:`R = ${numero(c.R/1000)} km`,color:'i'},{de:[.7,0],a:[4,0],texto:c.h!=null?`h = ${numero(c.h/1000)} km`:'h = ?',color:'i'});
      else cotas.push({de:[0,0],a:[4,0],texto:c.r==null?'r: desde el centro':`r = ${numero(c.r/1000)} km`,color:'i'});
      notas.push({texto:'Esquema sin escala de distancias.'});
      panel={titulo:c.tipo==='balanza'?'Sensor de apoyo dentro de la sonda':'Planeta y masa de prueba',modo:'radial',planeta:{c:[0,0],R:.7,rotulo:'M',colorRotulo:'f'},satelite:{c:[4,0],rotulo:'m',colorRotulo:'f',tam:9},cotas,notas};
    }
    if(revelar)notas.push({texto:`${c.simboloTexto} ${c.aprox||!exacto(c.resultado)?'≈':'='} ${numero(c.resultado)} ${c.unidad}`,color:c.color});
    return {pieza:'fis-gravitacion',datos:{vista:{x0:-1.3,x1:7,y0:-1.4,y1:1.4},altoGrafico:132,paneles:[panel],alt:suma?'Dos fuentes esféricas y un punto de prueba. Las cotas muestran separaciones conocidas; el esquema no revela la ubicación desconocida.':'Una fuente esférica y una sonda. Las cotas distinguen el radio del planeta y la altura cuando esos datos aparecen. Esquema sin escala.'},estado:{}};
  }

function caso(c) {
  let resultado,unidad='N/kg',color='tinta',simbolo=g,simboloTexto='g',enunciado;
  const datos=[],solucion=[],errores=[];
  const error=(id,v,causa)=>errores.push({id,valor:v,causa});
  const paso=(texto,cuenta,res,s=simbolo,u=unidad,col=color)=>solucion.push({texto,ecuacion:eq(s,cuenta,res,u,col,!!c.aprox)});
  if(c.tipo==='campo'){
    resultado=c.mu/c.r**2;
    enunciado=['Un planeta tiene ',valor(c.mu,'m³/s²'),' como producto GM = G·M. Una sonda está a ',valor(c.r/1000,'km','i'),' del centro. ¿Cuál es el módulo del campo gravitatorio allí?'];
    datos.push(modelo,[g,' = GM / ',r,'². El módulo se expresa en N/kg.'],'1 km = 1000 m.');
    paso('Pasamos a metros la distancia desde el centro.',[lit('i',c.r/1000),' · 1000'],c.r,r,'m','i');
    paso('Dividimos GM entre el cuadrado de esa distancia.',{frac:[lit('tinta',c.mu),cuadrado('i',c.r)]},resultado);
    error('lineal',c.mu/c.r,'Bien ubicado el punto, pero usaste la distancia sin elevarla al cuadrado.');
    error('doble',2*resultado,'Bien hecho el cociente, pero después duplicaste el campo calculado.');
    error('mitad',resultado/2,'Bien hecho el cociente, pero después dividiste el campo entre dos.');
    error('inversa',1/resultado,'Bien usados GM y la distancia, pero invertiste el cociente: GM va arriba y r² va abajo.');
  } else if(c.tipo==='altura'){
    const fuente=c.mu==null?c.g0*c.R**2:c.mu,gs=fuente/c.R**2,distancia=c.R+c.h;
    resultado=fuente/distancia**2;
    enunciado=[c.aprox?'En un modelo terrestre aproximado, ':'Un planeta modelo tiene ',c.mu==null?['campo superficial ',valor(c.g0,'N/kg')]:['GM ',c.aprox?'≈ ':'= ',valor(c.mu,'m³/s²')],', radio ',valor(c.R/1000,'km','i'),' y una sonda a ',valor(c.h/1000,'km','i'),' sobre la superficie. ¿Qué campo hay allí?'];
    datos.push(modelo,[r,' = ',R,' + ',h,'. La altura se mide desde la superficie.'],[g,' = GM / ',r,'²; GM = ',g0,'·',R,'².'],'1 km = 1000 m.');
    if(c.aprox)datos.push('GM y R son aproximaciones; la altura de 400 km es hipotética.');
    paso('La ley mide desde el centro, así que sumamos el radio y la altura, los dos en metros.',[lit('i',c.R),' + ',lit('i',c.h)],distancia,r,'m','i');
    paso('Con la distancia desde el centro, calculamos el campo en la posición de la sonda.',c.mu==null?[lit('tinta',c.g0),' · ',{frac:[cuadrado('i',c.R),cuadrado('i',distancia)]}]:{frac:[lit('tinta',c.mu),cuadrado('i',distancia)]},resultado);
    error('altura-sola',fuente/c.h**2,'Bien usada una distancia, pero la mediste desde la superficie, y la ley pide medirla desde el centro del planeta.');
    error('lineal',gs*c.R/distancia,'Bien comparadas las distancias, pero la razón entre ellas va elevada al cuadrado.');
    error('superficie',gs,'Bien recordado el campo de la superficie, pero la sonda está más arriba, donde el campo es menor.');
    error('cuadrado-altura',gs/(1+(c.h/c.R)**2),'Bien usada la razón h/R, pero la elevaste al cuadrado antes de sumarle uno; primero se suma y después se eleva.');
  } else if(c.tipo==='planeta'){
    resultado=c.g0*c.kM/c.kR**2;
    enunciado=['En el planeta de referencia, el campo superficial vale ',valor(c.g0,'N/kg'),'. Otro planeta tiene ',valor(c.kM,'veces','f'),' su masa y ',valor(c.kR,'veces','i'),' su radio. ¿Qué campo superficial tiene?'];
    datos.push(modelo,['En la superficie, ',r,' = ',R,'.'],[g,' = G·',q('f','M'),' / ',R,'². G no cambia entre planetas.']);
    paso('Multiplicamos el campo superficial por el factor de masa y lo dividimos entre el cuadrado del factor de radio.',[lit('tinta',c.g0),' · ',{frac:[lit('f',c.kM),cuadrado('i',c.kR)]}],resultado);
    error('lineal',c.g0*c.kM/c.kR,'Bien comparados los planetas, pero usaste el factor de radio sin elevarlo al cuadrado.');
    error('sin-masa',c.g0/c.kR**2,'Bien elevado al cuadrado el factor de radio, pero olvidaste el cambio de masa del planeta.');
    error('sin-radio',c.g0*c.kM,'Bien incluido el cambio de masa, pero olvidaste el cambio de radio del planeta.');
    error('inversa',c.g0*c.kR**2/c.kM,'Bien reunidos los dos factores, pero los invertiste: la masa va arriba y el radio al cuadrado va abajo.');
    error('radio-solo',c.g0/c.kR,'Bien considerado el radio, pero olvidaste la masa y no elevaste el factor de radio al cuadrado.');
  } else if(c.tipo==='peso'){
    const campo=c.mu/c.r**2;
    resultado=c.m*campo;unidad='N';color='h';simbolo=F;simboloTexto='F';
    enunciado=['Una sonda de ',valor(c.m,'kg','f'),' está a ',valor(c.r/1000,'km','i'),' del centro de un planeta con GM = ',valor(c.mu,'m³/s²'),'. ¿Cuál es el módulo de su peso gravitatorio?'];
    datos.push(modelo,[g,' = GM / ',r,'².'],[F,' = ',m,'·',g,'. La masa se expresa en kg.'],'1 km = 1000 m.');
    paso('Primero calculamos el campo en la posición de la sonda.',{frac:[lit('tinta',c.mu),cuadrado('i',c.r)]},campo,g,'N/kg','tinta');
    paso('El peso es la masa de la sonda multiplicada por ese campo.',[lit('f',c.m),' · ',{frac:[lit('tinta',c.mu),cuadrado('i',c.r)]}],resultado);
    error('sin-masa',campo,'Bien calculado el campo, pero faltó multiplicarlo por la masa de la sonda para obtener el peso.');
    error('doble',2*resultado,'Bien planteado el peso, pero después lo duplicaste.');
    error('divide',campo/c.m,'Bien calculado el campo, pero lo dividiste entre la masa, y el peso es la masa por el campo.');
    error('cuadrado',c.m*campo**2,'Bien usada la masa, pero la multiplicaste por el campo al cuadrado, y el campo va sin elevar.');
    error('mitad',resultado/2,'Bien planteado el peso, pero después lo dividiste entre dos.');
  } else if(c.tipo==='masa'){
    resultado=c.F/c.g;unidad='kg';color='f';simbolo=m;simboloTexto='m';
    enunciado=['En un punto con campo de ',valor(c.g,'N/kg'),', el peso gravitatorio de una sonda vale ',valor(c.F,'N','h'),'. ¿Cuál es la masa de la sonda?'];
    datos.push([F,' = ',m,'·',g,'. F es el módulo del peso gravitatorio.'],'La masa se expresa en kg y no cambia al cambiar de lugar.');
    paso('Como el peso es la masa por el campo, dividimos el peso entre el campo de ese punto.',{frac:[lit('h',c.F),lit('tinta',c.g)]},resultado);
    error('producto',c.F*c.g,'Bien relacionados el peso y la masa, pero multiplicaste el peso por el campo; para hallar la masa se divide.');
    error('inversa',c.g/c.F,'Bien elegida la división, pero la invertiste: el peso va arriba y el campo, abajo.');
    error('doble',2*resultado,'Bien hecha la división, pero después duplicaste la masa.');
    error('mitad',resultado/2,'Bien hecha la división, pero después dividiste la masa entre dos.');
    error('diferencia',c.F-c.g,'Bien usados el peso y el campo, pero los restaste, y la masa sale de dividirlos.');
  } else if(c.tipo==='altura-inversa'){
    const campo=c.g==null?c.F/c.m:c.g,distancia=c.R*Math.sqrt(c.g0/campo),altura=distancia-c.R;
    resultado=altura/1000;unidad='km';color='i';simbolo=h;simboloTexto='h';
    enunciado=c.g==null?['Un planeta tiene radio ',valor(c.R/1000,'km','i'),' y campo superficial ',valor(c.g0,'N/kg'),'. Una sonda de ',valor(c.m,'kg','f'),' pesa ',valor(c.F,'N','h'),'. ¿A qué altura sobre la superficie está?']:['Un planeta de radio ',valor(c.R/1000,'km','i'),' tiene campo superficial ',valor(c.g0,'N/kg'),'. ¿A qué altura sobre su superficie el campo vale ',valor(c.g,'N/kg'),'?'];
    datos.push(modelo,[g,' / ',g0,' = (',R,' / ',r,')².'],[r,' = ',R,' + ',h,'.'],'1 km = 1000 m.');
    if(c.g==null){datos.push([F,' = ',m,'·',g,'. El peso gravitatorio de la sonda se mide en N.']);paso('Primero hallamos el campo donde está la sonda: dividimos su peso entre su masa.',{frac:[lit('h',c.F),lit('f',c.m)]},campo,g,'N/kg','tinta');}
    // Auditoría (26 nov): el despeje de r no se decía (lector en frío).
    paso(['Despejamos ',r,' de la relación de campos: ',r,' = ',R,' · √(',g0,' / ',g,').'],[lit('i',c.R),' · ',{raiz:[{frac:[lit('tinta',c.g0),lit('tinta',campo)]}]}],distancia,r,'m','i');
    paso('La altura se mide desde la superficie: restamos el radio y pasamos el resultado a kilómetros.',{frac:[[lit('i',distancia),' − ',lit('i',c.R)],'1000']},resultado);
    error('desde-centro',distancia/1000,'Bien hallada la distancia desde el centro, pero faltó restarle el radio para obtener la altura.');
    error('sin-raiz',c.R*(c.g0/campo-1)/1000,'Bien usado el cociente de campos, pero faltó sacarle la raíz antes de multiplicar por el radio.');
    error('inversa',c.R*(Math.sqrt(campo/c.g0)-1)/1000,'Bien planteada la raíz, pero invertiste el cociente de campos que va dentro de ella.');
    error('radio',c.R/1000,'Bien recordado el radio, pero lo diste como si fuera la altura de la sonda.');
    error('mitad',resultado/2,'Bien hallada la altura, pero después la dividiste entre dos.');
  } else if(c.tipo==='superposicion'){
    const ra=Math.abs(c.x),rb=Math.abs(c.D-c.x),ga=c.muA/ra**2,gb=c.muB/rb**2,ca=Math.sign(-c.x)*ga,cb=Math.sign(c.D-c.x)*gb;
    resultado=ca+cb;simbolo=gx;simboloTexto='g_x';
    // Auditoría (26 nov): «GM_A» y «g_x» iban como texto crudo (la teoría no convierte «_» en subíndice).
    enunciado=['Dos fuentes tienen ',sub(mu,'A'),' = ',valor(c.muA,'m³/s²'),' y ',sub(mu,'B'),' = ',valor(c.muB,'m³/s²'),'. A está en x = 0 y B, en ',valor(c.D/1000,'km','i'),'. ¿Cuál es ',gx,' en x = ',valor(c.x/1000,'km','i'),'?'];
    datos.push('Las fuentes son esféricas; el punto está fuera de ambas. Ignoramos otras fuentes.','La derecha es positiva. Cada campo apunta hacia su fuente.','Cada módulo es GM dividido entre su distancia al cuadrado.','Por superposición, el campo total es la suma de las componentes de los dos campos en ese punto.','1 km = 1000 m.');
    paso('Calculamos el campo de A, que apunta desde el punto hacia A; su signo dice hacia qué lado.',[String(Math.sign(-c.x)),' · ',{frac:[lit('tinta',c.muA),cuadrado('i',ra)]}],ca,sub(g,'Ax'));
    paso('La distancia a B es D − x. Calculamos su campo, que apunta desde el punto hacia B.',[String(Math.sign(c.D-c.x)),' · ',{frac:[lit('tinta',c.muB),cuadrado('i',rb)]}],cb,sub(g,'Bx'));
    paso('Sumamos las dos componentes con su signo, sin redondear los resultados intermedios.',[
      String(Math.sign(-c.x)),' · ',{frac:[lit('tinta',c.muA),cuadrado('i',ra)]},' + ',String(Math.sign(c.D-c.x)),' · ',{frac:[lit('tinta',c.muB),cuadrado('i',rb)]}],resultado);
    error('suma',ga+gb,'Bien calculados los dos campos, pero sumaste sus módulos, y en este punto pueden apuntar en sentidos opuestos.');
    error('signo',-resultado,'Bien combinados los campos, pero invertiste el sentido del campo resultante.');
    error('solo-A',ca,'Bien calculado el campo de A, pero olvidaste sumar el de B.');
    error('solo-B',cb,'Bien calculado el campo de B, pero olvidaste sumar el de A.');
    error('resta-modulos',Math.abs(ga-gb),'Bien hallados los módulos, pero los restaste y tomaste el resultado positivo sin mirar los sentidos.');
  } else if(c.tipo==='nulo'){
    const distancia=c.D*Math.sqrt(c.muA)/(Math.sqrt(c.muA)+Math.sqrt(c.muB));
    resultado=distancia/1000;unidad='km';color='i';simbolo=sub(r,'A');simboloTexto='r_A';
    enunciado=['Dos fuentes tienen ',sub(mu,'A'),' = ',valor(c.muA,'m³/s²'),' y ',sub(mu,'B'),' = ',valor(c.muB,'m³/s²'),'. Sus centros están separados ',valor(c.D/1000,'km','i'),'. Entre ellas, ¿a qué distancia de A se anula el campo?'];
    datos.push('Las fuentes son esféricas. El punto buscado está fuera de ambas y entre sus centros.','En ese intervalo, los campos tienen sentidos opuestos.',[sub(mu,'A'),' / ',sub(r,'A'),'² = ',sub(mu,'B'),' / ',sub(r,'B'),'²; ',sub(r,'A'),' + ',sub(r,'B'),' = D.'],'1 km = 1000 m.');
    paso('Igualamos los módulos de los dos campos; de ahí sale la razón entre las dos distancias.',{raiz:[{frac:[lit('tinta',c.muB),lit('tinta',c.muA)]}]},Math.sqrt(c.muB/c.muA),[sub(r,'B'),' / ',sub(r,'A')],'');
    paso('Como las dos distancias suman la separación entre los centros, despejamos la distancia desde A.',{frac:[lit('i',c.D/1000),['1 + ',{raiz:[{frac:[lit('tinta',c.muB),lit('tinta',c.muA)]}]}]]},resultado);
    error('lineal',c.D*c.muA/(c.muA+c.muB)/1000,'Bien comparadas las fuentes, pero repartiste la distancia según GM sin sacar las raíces.');
    error('mitad',c.D/2000,'Bien buscado el punto entre las fuentes, pero la mitad solo sirve cuando las dos fuentes son iguales.');
    error('complemento',(c.D-distancia)/1000,'Bien hallado el punto, pero diste su distancia desde B y no desde A.');
    error('cociente',c.D*Math.sqrt(c.muA/c.muB)/1000,'Bien sacada la razón de raíces, pero multiplicaste la separación por ella en vez de repartirla.');
    error('inversa',c.D/(1+c.muA/c.muB)/1000,'Bien comparadas las fuentes, pero usaste la razón inversa de GM y no sacaste las raíces.');
  } else if(c.tipo==='balanza'){
    const campo=campoLocal(c),peso=c.m*campo;
    resultado=peso*(1-c.beta);unidad='N';color='h';simbolo=N;simboloTexto='N';
    enunciado=['Un bloque de ',valor(c.m,'kg','f'),' descansa sobre un sensor dentro de una sonda. En ese instante, la sonda acelera hacia el planeta con una aceleración de ',valor(c.beta,c.beta===1?'vez':'veces'),' el campo local. ¿Qué fuerza de apoyo registra el sensor?'];
    if(c.g!=null)datos.push([g,' = ',valor(c.g,'N/kg'),'.']);
    else if(c.mu!=null)datos.push(['GM = ',valor(c.mu,'m³/s²'),'; ',r,' = ',valor(c.r/1000,'km','i'),'.']);
    else datos.push([g0,' = ',valor(c.g0,'N/kg'),'; ',R,' = ',valor(c.R/1000,'km','i'),'; ',h,' = ',valor(c.h/1000,'km','i'),'.']);
    datos.push('Ignoramos rozamiento y otras fuerzas sobre el bloque. El sensor inferior mide la fuerza normal.','β es la fracción del campo local que acelera la sonda hacia el planeta.',[N,' = ',m,'·',g,'·(1 − β)']);
    if(c.g==null)datos.push([g,' = GM / ',r,'²; ',r,' = ',R,' + ',h,'; GM = ',g0,'·',R,'².'],'1 km = 1000 m.');
    const cuentaCampo=c.g!=null?lit('tinta',c.g):c.mu!=null?{frac:[lit('tinta',c.mu),cuadrado('i',c.r)]}:[lit('tinta',c.g0),' · ',{frac:[cuadrado('i',c.R),cuadrado('i',c.R+c.h)]}];
    if(c.g==null)paso('Calculamos el campo en el lugar donde está la sonda.',cuentaCampo,campo,g,'N/kg','tinta');
    // Auditoría (26 nov): con el campo ya calculado en el paso anterior, se usa su valor (antes se repetía la cuenta y se partía a 390 px).
    paso('Como la sonda acelera hacia el planeta, el sensor empuja menos: el apoyo es el peso por (1 − β).',[lit('f',c.m),' · ',c.g==null&&exacto(campo)?lit('tinta',campo):{par:[cuentaCampo]},' · (1 − ',lit('tinta',c.beta),')'],resultado);
    error('gravedad',peso,'Bien calculado el peso del bloque, pero el sensor mide el apoyo, que es menor porque la sonda acelera hacia el planeta.');
    error('suma',peso*(1+c.beta),'Bien usada la fracción de aceleración, pero la sumaste; la caída reduce el apoyo, así que se resta.');
    error('beta',peso*c.beta,'Bien calculada la fuerza neta que acelera al bloque, pero el sensor mide el apoyo, no la fuerza neta.');
    error('sin-masa',campo*(1-c.beta),'Bien restada la parte de la aceleración, pero faltó multiplicar por la masa del bloque.');
    error('doble',2*resultado,'Bien planteado el apoyo, pero después lo duplicaste.');
    error('cuadrado',c.m*campo**2,'Bien usada la masa, pero la multiplicaste por el campo al cuadrado, y el campo va sin elevar.');
    error('inversa',c.m/campo,'Bien reunidos la masa y el campo, pero dividiste la masa entre el campo.');
    error('resta',campo-c.m,'Bien reunidos la masa y el campo, pero los restaste, y esas dos magnitudes no se restan.');
  }else throw new Error(`Tipo de campo desconocido: ${c.tipo}`);
  // Redacción (26 nov): cada causa ya dice qué se hizo bien y qué faltó, en segunda persona.
  const visto=new Set([numero(resultado)]);
  const unicos=errores.filter(e=>{const k=numero(e.valor);if(!Number.isFinite(e.valor)||visto.has(k))return false;visto.add(k);return true;})
    .map(e=>({...e,texto:textoValor(e.valor,unidad,!!c.aprox),error:`GR2-${c.tipo}-${e.id}`,siFuera:`${e.causa} Así sale ${textoValor(e.valor,unidad,!!c.aprox)}.`}));
  return {resultado,unidad,color,simboloTexto,enunciado,datos,solucion,dibujo:figura(c),respuesta:[simbolo,c.aprox||!exacto(resultado)?' ≈ ':' = ',valor(resultado,unidad,color)],errores:unicos,
    verificacion:{...c,respuesta:{valor:resultado,unidad,aproximado:!!c.aprox||!exacto(resultado)},errores:unicos.map(e=>({id:e.id,valor:e.valor}))}};
}

  const casosEjemplo=[
    {nivel:1,titulo:'Campo a una distancia conocida',tipo:'campo',mu:6e14,r:1e7},
    {nivel:1,titulo:'Del campo al peso',tipo:'peso',mu:8e14,r:1e7,m:25},
    {nivel:1,titulo:'La masa se obtiene del peso',tipo:'masa',g:12,F:588},
    {nivel:1,titulo:'Un planeta de radio doble',tipo:'planeta',g0:20,kM:3,kR:2},
    {nivel:1,titulo:'Una balanza durante la caída libre',tipo:'balanza',g:8,m:5,beta:1},
    {nivel:2,titulo:'Altura y distancia desde el centro',tipo:'altura',g0:24,R:5e6,h:2.5e6},
    {nivel:2,titulo:'Un punto hipotético sobre la Tierra',tipo:'altura',mu:3.986e14,R:6371e3,h:400e3,aprox:true,fuente:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html'},
    {nivel:2,titulo:'Buscar la altura de cierto campo',tipo:'altura-inversa',g0:32,R:6e6,g:2},
    {nivel:2,titulo:'Dos atracciones en sentidos contrarios',tipo:'superposicion',muA:4e14,muB:9e14,D:1.2e7,x:4e6},
    {nivel:2,titulo:'Apoyo menor que el peso',tipo:'balanza',mu:5e14,r:1e7,m:12,beta:.25},
    {nivel:3,titulo:'Campo exterior a las dos fuentes',tipo:'superposicion',muA:9e14,muB:4e14,D:1.2e7,x:-6e6},
    {nivel:3,titulo:'El punto de campo nulo',tipo:'nulo',muA:4e14,muB:9e14,D:2e7},
    {nivel:3,titulo:'Sensor a cierta altura',tipo:'balanza',g0:36,R:4e6,h:2e6,m:15,beta:.4},
    {nivel:3,titulo:'Localizar la sonda mediante su peso',tipo:'altura-inversa',g0:27,R:7e6,F:180,m:60},
    {nivel:3,titulo:'Una segunda pareja de fuentes',tipo:'nulo',muA:16e14,muB:25e14,D:2.7e7}
  ];
  const cortas={suma:'sumas los módulos',signo:'inviertes el sentido','solo-A':'olvidas el campo de B','solo-B':'olvidas el campo de A','resta-modulos':'restas los módulos',lineal:'no sacas las raíces',mitad:'tomas la mitad de la separación',complemento:'mides desde B',cociente:'multiplicas por la razón de raíces',inversa:'inviertes el cociente',gravedad:'confundes el apoyo con el peso',beta:'das la fuerza neta','sin-masa':'olvidas la masa',doble:'duplicas el apoyo',cuadrado:'elevas el campo al cuadrado',resta:'restas la masa y el campo','desde-centro':'mides desde el centro','sin-raiz':'no sacas la raíz',radio:'das el radio'};
  let letra=0;
  const ejemplos=casosEjemplo.map(c=>{
    const b=caso(c),e={nivel:c.nivel,titulo:c.titulo,enunciado:b.enunciado,datos:b.datos,dibujo:b.dibujo,solucion:b.solucion,respuesta:b.respuesta,verificacion:b.verificacion};
    if(c.fuente)e.fuente='NASA, Earth Fact Sheet: GM y radio medio aproximados; altura hipotética.';
    if(c.nivel===3){
      const errs=b.errores.slice(0,4);if(errs.length<4)throw new Error(`Faltan errores en ${c.titulo}`);
      e.alternativas=errs.map(e=>e.texto);e.alternativas.splice(letra++,0,textoValor(b.resultado,b.unidad,!!c.aprox));
      e.solucion.push({texto:errs.map(e=>`${textoValor(e.valor,'',!!c.aprox)} sale si ${cortas[e.id]}.`).join(' ')});
    }return e;
  });
  function entrada(semilla,resuelto){
    const s=Math.abs(Math.trunc(semilla)),tipos=['campo','altura','planeta','peso','masa','altura-inversa','superposicion','nulo','balanza'];
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla, y los planetas
    // tienen campos y densidades posibles (antes, campos de 369 N/kg y fuentes de 10¹⁵ m³/s² a 3000 km del centro).
    const tipo=tipos[(s+(resuelto?0:4))%9],k=1+Math.floor(s/9)%9,z=Math.floor(s/81),banco=resuelto?40:10;
    if(tipo==='campo')return{tipo,mu:(banco+k+z)*1e14,r:(resuelto?14+k:8+k)*1e6};
    if(tipo==='altura')return{tipo,g0:(resuelto?12:6)+k%5,R:(5+k%3)*1e6,h:(1+k%3)*1e6};
    if(tipo==='planeta')return{tipo,g0:banco+3*k+z,kM:2+k%4,kR:1.5+(k%3)/2};
    if(tipo==='peso')return{tipo,mu:(banco+z)*1e14,r:(resuelto?14+k:7+k)*1e6,m:banco+5*k};
    if(tipo==='masa')return{tipo,g:3+k+z,F:(banco+7*k)*(3+k+z)};
    if(tipo==='altura-inversa'){const n=2+k%3,g=(resuelto?[[2.5,3,3.5,4],[1.2,1.4,1.6,1.5],[0.75,0.8,0.9,1]]:[[2,1.5,2.25,1.75],[1,1.1,1.3,0.9],[0.5,0.6,0.7,0.55]])[n-2][(k+z)%4];return{tipo,g0:Math.round(g*n*n*1e4)/1e4,R:(5+k%4)*1e6,g};}
    if(tipo==='superposicion')return{tipo,muA:((resuelto?4:2)+0.5*(k%5))*1e14,muB:(3+z)*1e14,D:2e7,x:(resuelto?-1:1)*(6+k%3)*1e6};
    if(tipo==='nulo'){const n=[1.5,2,2.5,3][k%4],muA=(resuelto?16:4)*1e14;return{tipo,muA,muB:muA*n*n,D:((resuelto?30:21)+z)*1e6};}
    return{tipo,g0:resuelto?13+k%4:7+k%6,R:6e6,h:(1+k%4)*1e6,m:banco+3*k,beta:[.2,.4,.6,1][k%4]};
  }
  function generar(s,resuelto){
    const b=caso(entrada(s,resuelto));
    if(b.errores.length<3)throw new Error(`Faltan alternativas de campo en semilla ${s}`);
    if(resuelto)return{enunciado:b.enunciado,datos:b.datos,dibujo:b.dibujo,respuesta:b.respuesta,verificacion:b.verificacion,pasos:[
      {tipo:'pide',texto:'Identificamos qué se pide (un campo, una fuerza, una masa o una distancia) y desde dónde se mide cada distancia.'},
      {tipo:'regla',texto:b.verificacion.tipo==='balanza'?'El sensor mide la fuerza de apoyo, que no es lo mismo que la atracción gravitatoria sobre el bloque.':'El campo depende de las fuentes y de la posición, no de la masa de prueba.'},
      ...b.solucion.map(p=>({tipo:'cuentas',...p})),
      {tipo:'sentido',texto:b.verificacion.tipo==='superposicion'?'El signo del campo resultante indica hacia qué lado sería atraída una masa de prueba.':'Comprobamos la unidad pedida y el origen desde el que se mide cada distancia.'}]};
    return{pregunta:b.enunciado,datos:b.datos,dibujo:b.dibujo,verificacion:b.verificacion,
      opciones:[{id:'c',texto:textoValor(b.resultado,b.unidad),correcta:true},...b.errores.slice(0,3).map(e=>({id:e.id,texto:e.texto,error:e.error,siFuera:e.siFuera}))],
      solucion:{texto:b.verificacion.tipo==='balanza'?'Calculamos primero el campo local y después la fuerza de apoyo.':'Usamos el campo de la posición indicada, con cada distancia medida desde el centro de su fuente.',ecuacion:b.solucion.at(-1).ecuacion}};
  }


  const referencia={mu:4e14,r:8e6},campoJuego=referencia.mu/referencia.r**2;
  function figuraJuego(masa,mostrar=true){
    return{pieza:'fis-gravitacion',datos:{vista:{x0:-1.3,x1:7,y0:-1.4,y1:1.4},altoGrafico:144,escalas:{F:.1},paneles:[{titulo:'Otra sonda en la misma posición',modo:'radial',
      planeta:{c:[0,0],R:.7,rotulo:'M',colorRotulo:'f'},satelite:{c:[4,0],rotulo:'m',colorRotulo:'f',tam:9},
      cotas:[{de:[0,0],a:[4,0],texto:'r = 8000 km',color:'i'}],
      flechas:mostrar?[{de:[4,0],d:[-masa*campoJuego,0],familia:'F',color:'h',rotulo:'F'}]:[],
      notas:[{texto:'GM = 4 × 10¹⁴ m³/s²'},{texto:`m ${exacto(masa)?'=':'≈'} ${numero(masa)} kg`,color:'f'},{texto:mostrar?`F ${exacto(masa*campoJuego)?'=':'≈'} ${numero(masa*campoJuego)} N`:'El medidor de fuerza está apagado.',color:mostrar?'h':'tinta'},{texto:'Esquema sin escala de distancias.'}]}],
      alt:'Una sonda a una distancia fija del centro de un planeta. Cambia únicamente la masa de la sonda; la flecha, cuando está encendida, representa la fuerza gravitatoria.'},estado:{}};
  }
  const pred={g0:18,kH:2},predResultado=pred.g0/(1+pred.kH)**2;
  function figuraPred(revelar){
    const d=figura({tipo:'altura',g0:pred.g0,R:1,h:pred.kH}).datos;
    d.paneles[0].titulo='Otro planeta y una nueva altura';
    d.paneles[0].cotas=[{de:[0,0],a:[.7,0],texto:'R: radio del planeta',color:'i'},{de:[.7,0],a:[4,0],texto:'h = 2 R',color:'i'}];
    if(revelar)d.paneles[0].notas.push({texto:`g = ${numero(predResultado)} N/kg`});
    return{pieza:'fis-gravitacion',datos:d,estado:{}};
  }
  const predErrores=[
    {id:'altura-sola',valor:pred.g0/pred.kH**2,causa:'Bien usada la altura, pero la ley mide desde el centro, así que falta sumarle el radio.'},
    {id:'lineal',valor:pred.g0/(1+pred.kH),causa:'Bien sumado el radio, pero la razón entre las distancias va elevada al cuadrado.'},
    {id:'superficie',valor:pred.g0,causa:'Bien recordado el campo de la superficie, pero la sonda está más lejos del centro, donde el campo es menor.'}
  ];
  const idea = {
    id: 'campo-gravitatorio',
    titulo:'Campo gravitatorio y peso',pregunta:'¿Qué cambia al llevar otra masa al mismo lugar?',
    aprendizaje:'Distingues campo, masa y peso; calculas el campo desde el centro del planeta y sumas los efectos de varias fuentes.',
    actividad:'Cambiar la masa de una sonda que permanece en la misma posición.',temas:['Campo gravitatorio','Variación de g con la altura'],pieza:'fis-gravitacion',
    lee: { tarjetas: [
      {titulo:'Una posición, varias sondas',texto:['Una masa de prueba es un cuerpo pequeño que ponemos en un punto para medir cuánto lo atrae un planeta; es tan pequeño que no cambia al planeta. Aquí cambiamos la sonda y dejamos fijo el lugar.'],dibujo:figuraJuego(20,false)},
      {titulo:'Campo y fuerza se distinguen',texto:['El campo gravitatorio g⃗ dice cuánto y hacia dónde atrae el planeta en un punto. Su módulo ',g,' es la fuerza sobre cada kilogramo puesto allí, en N/kg. La masa se mide en kg y el peso, en N.']},
      {titulo:'Dos orígenes para medir',texto:['El radio ',R,' va del centro a la superficie, y la altura ',h,', de la superficie hacia arriba; la distancia ',r,' se mide desde el centro. GM es la constante G por la masa del planeta, que los problemas suelen dar como un solo dato.']}
    ]},
    juega: { consigna:'Cambia la masa de la sonda sin moverla. Compara el peso que señala la flecha en cada ensayo.',voz:'El planeta y la posición no cambian; solo cambia la sonda.',
      controles:[{id:'m',etiqueta:'Masa de la sonda',min:20,max:80,paso:20,inicio:20,unidad:'kg',decimales:0,color:'c-f',auto:{velocidad:10,modo:'rebota'}}],
      mision:{texto:'Elige una sonda cuyo peso gravitatorio sea 250 N.',logrado:a=>Math.abs(a.m*campoJuego-250)<1e-9,testigo:[{m:40}],bien:'Coincide: con esa masa, el peso de la sonda es 250 N.'},
      // Auditoría (26 nov): dibujo y lectura con la masa entera que muestra el control; la lectura enuncia la relación.
      dibujo:a=>figuraJuego(Math.round(a.m)),lectura:a=>{const mm=Math.round(a.m);return['Peso: ',valor(mm,'kg','f'),' · 6,25 N/kg = ',valor(mm*campoJuego,'N','h')];},
      leyenda:[{s:m,t:'masa de prueba, en kilogramos'},{s:r,t:'distancia desde el centro, en kilómetros'},{s:F,t:'peso gravitatorio, en newtons'},{s:mu,t:'G por la masa del planeta (m³/s²)'}],minimo:2},
    predice: { pregunta:'En otro planeta, ¿qué campo gravitatorio hay a una altura igual a dos radios sobre la superficie?',
      datos:['El campo en la superficie vale 18 N/kg.','La altura h sobre la superficie es 2 R, donde R es el radio del planeta.','El planeta es una esfera cuya masa se reparte igual en todas las direcciones. Ignoramos otras fuentes.'],
      dibujo:figuraPred(false),revelar:figuraPred(true),
      opciones:[{id:'c',texto:textoValor(predResultado,'N/kg'),correcta:true},...predErrores.map(e=>({id:e.id,texto:textoValor(e.valor,'N/kg'),error:`GR2-predice-${e.id}`,siFuera:`${e.causa} Así sale ${textoValor(e.valor,'N/kg')}.`}))],
      coincide:'La altura empieza en la superficie, pero la ley mide desde el centro, así que la distancia es el radio más la altura.',
      verificacion:{tipo:'prediccion-altura',...pred,respuesta:{valor:predResultado,unidad:'N/kg',aproximado:false},errores:predErrores.map(e=>({id:e.id,valor:e.valor}))}},
    mira: { pieza:'fis-gravitacion',datos:{...figuraPred(false).datos,cortes:[figuraPred(false).datos,figuraPred(true).datos]},pasos:[
      {estado:{corte:0},texto:'Sumamos el radio y la altura para medir desde el centro.',ecuacion:[r,' = ',R,' + ',h,' = ',R,' + 2',R,' = 3',R]},
      {estado:{corte:0},texto:'Como el planeta es el mismo, GM se cancela al dividir los dos campos y solo quedan las distancias.',ecuacion:[{frac:[g,g0]},' = ',{sup:[{par:[{frac:[R,r]}]},'2']}]},
      {estado:{corte:1},texto:'La sonda está tres veces más lejos del centro, así que el campo se divide entre tres al cuadrado.',ecuacion:[g,' = 18 · (1/3)² = ',valor(predResultado,'N/kg')]}
    ]},
    regla: { texto:'El campo depende del planeta y de la distancia a su centro, no de la sonda, y el peso es la masa por ese campo. Los campos de dos fuentes se suman con sus sentidos. Una balanza mide cuánto la aprietan, no el peso.',
      ecuacion:[g,' = ',{frac:[['G·',q('f','M')],{sup:[r,'2']}]},'; ',F,' = ',m,'·',g,'; ',r,' = ',R,' + ',h],
      condicion:'el punto está fuera de un planeta esférico cuya masa se reparte igual en todas las direcciones, y r se mide desde su centro.',
      voz:'En caída libre, la balanza marca cero aunque la gravedad siga atrayendo al cuerpo.',dibujo:figura({tipo:'campo',mu:7e14,r:1e7})},
    ejemplos: ejemplos,
    resuelve: { pieza:'fis-gravitacion',generar:s=>generar(s,true) },
    ahoraTu: { pieza:'fis-gravitacion',generar:s=>generar(s,false) }
  };
  const glosario=[
    {termino:'campo gravitatorio',simbolo:'g⃗',medida:'N/kg',simple:'La fuerza gravitatoria por cada kilogramo colocado en un punto.',def:'Magnitud vectorial que expresa la fuerza gravitatoria por unidad de masa de prueba en una posición.',ejemplos:['Una sonda permite explorar el campo en un punto.','El campo se expresa en N/kg.','Para describir un campo se indican su módulo, dirección y sentido.']},
    {termino:'masa de prueba',simbolo:'m',medida:'kg',simple:'Un cuerpo pequeño con el que exploramos la atracción de una fuente.',def:'Cuerpo tan pequeño que, al ponerlo en un punto para medir el campo, no cambia la fuente que lo produce.',ejemplos:['Una sonda pequeña puede usarse como masa de prueba.','La masa de prueba se mide en kilogramos.','Dos sondas de distinta masa pueden explorar el mismo punto.']},
    {termino:'superposición',simple:'La suma de los efectos que producen varias fuentes en un mismo punto.',def:'Principio por el que el campo total es la suma vectorial de los campos producidos por cada fuente.',ejemplos:['Dos fuentes pueden atraer una sonda en sentidos opuestos.','Los campos se suman en la misma posición.','En una recta, usamos componentes con signo para sumar los campos.']}
  ];
  const letras={g:'módulo del campo gravitatorio',g_0:'módulo del campo gravitatorio en la superficie del planeta',g_x:'componente horizontal del campo resultante',g_A:'módulo del campo producido por A',g_B:'módulo del campo producido por B',g_Ax:'componente horizontal del campo de A',g_Bx:'componente horizontal del campo de B',
    M:'masa de la fuente',m:'masa de prueba',F:'módulo del peso gravitatorio',N:'módulo de la fuerza de apoyo que mide el sensor',β:'fracción del campo local que acelera la sonda hacia el planeta',
    r:'distancia desde el centro del planeta',R:'radio del planeta',h:'altura sobre su superficie',r_A:'distancia desde A hasta el punto de prueba',r_B:'distancia desde B hasta el punto de prueba',
    D:'distancia entre los centros de A y B',x:'coordenada horizontal medida desde A',A:'primera fuente',B:'segunda fuente',G:'constante de gravitación universal',M_ref:'masa del planeta de referencia',M_nueva:'masa del planeta comparado',R_ref:'radio del planeta de referencia',R_nuevo:'radio del planeta comparado'};
  return {idea,glosario,letras};

}

function construirGr3(Kit) {
  'use strict';
  // Magnitudes SI; los parámetros describen planetas ideales, no mediciones.
  // El oráculo de gravitacion-energia.test.js integra -GMm/r² por otro camino.
  const q = (c, t) => ({ v: `c-${c}`, t: String(t) });
  const sub = (a, b) => ({ sub: [a, b] });
  const m = q('f', 'm'), r = q('i', 'r'), R = q('i', 'R'), h = q('i', 'h'), v = q('o', 'v');
  const EP = sub('E', 'PG'), EC = sub('E', 'C'), EM = sub('E', 'M'), WG = sub('W', 'g');
  const fmt = x => Kit.formatear(Math.abs(x) < 1e-12 ? 0 : x, 3);
  const sup = x => String(x).replace(/[-0123456789]/g, c => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' })[c]);
  const numero = x => {
    if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001)) {
      const e = Math.floor(Math.log10(Math.abs(x))); return `${fmt(x / 10 ** e)} × 10${sup(e)}`;
    }
    return fmt(x);
  };
  const exacto = x => {
    if (!Number.isFinite(x)) return false;
    const e = x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001) ? Math.floor(Math.log10(Math.abs(x))) : 0;
    const redondeado = Math.round(x / 10 ** e * 1000) / 1000 * 10 ** e;
    return Math.abs(x - redondeado) <= Math.max(Math.abs(x), 1e-200) * 1e-12;
  };
  const cantidad = (x, u, c) => c ? q(c, `${numero(x)} ${u}`) : `${numero(x)} ${u}`;
  const opcion = (x, u) => `${exacto(x) ? '' : '≈ '}${numero(x)} ${u}`;
  const ep = (GM, masa, radio) => -GM * masa / radio;
  const ec = (masa, rapidez) => masa * rapidez * rapidez / 2;
  const radio = c => c.r == null ? c.R + c.h : c.r;
  const masa = c => c.toneladas == null ? c.m : 1000 * c.toneladas;
  const leyEP = [EP, ' = −', { frac: [['GM · ', m], r] }];
  const leyEC = [EC, ' = ', { frac: [[m, ' · ', { sup: [v, 2] }], 2] }];
  const leyCambio = ['Δ', EP, ' = ', sub('E', 'PG,2'), ' − ', sub('E', 'PG,1')];
  const leyTrabajo = [WG, ' = −Δ', EP];
  const leyConservacion = [sub('E', 'C,1'), ' + ', sub('E', 'PG,1'), ' = ', sub('E', 'C,2'), ' + ', sub('E', 'PG,2')];
  const modelo = 'Fuente esférica fija; la sonda tiene masa despreciable frente a ella. Todas las posiciones están fuera del planeta.';
  const referencia = 'La energía potencial gravitatoria se toma cero en el infinito.';
  // Auditoría (26 nov): «1 km/s = 1000 m/s» solo cuando el caso tiene una rapidez.
  const unidades = c => c.v != null || c.v1 != null ? '1 GJ = 10⁹ J; 1 km = 1000 m; 1 km/s = 1000 m/s.' : '1 GJ = 10⁹ J; 1 km = 1000 m.';
  const datosBase = c => ['Fuente esférica fija y posiciones exteriores. Masa de la sonda despreciable; energía potencial cero en el infinito.', `GM = ${numero(c.GM)} m³/s²: G por la masa del planeta.`, leyEP, unidades(c)];

  function figura(c, revelar = false) {
    const masaSI = masa(c), dos = c.r1 != null && c.r2 != null || c.tipo === 'cambio-dado';
    const paneles = (dos ? [{ rotulo: 'Posición inicial', rr: c.r1, etiqueta: 'r_1' }, { rotulo: 'Posición final', rr: c.tipo === 'tramos' ? c.r3 : c.r2, etiqueta: c.tipo === 'tramos' ? 'r_3' : 'r_2' }]
      : [{ rotulo: 'Sonda y planeta', rr: c.tipo === 'distancia' ? null : radio(c), etiqueta: 'r' }]).map((p, k) => {
      const notas = [];
      if (c.GM != null) notas.push({ texto: `GM = ${numero(c.GM)} m³/s²` });
      if (c.tipo === 'cambio-dado') notas.push({ texto: `E_PG = ${numero(k ? c.Ep2 : c.Ep1)} GJ` });
      if (c.tipo === 'trabajo-dado') notas.push({ texto: `ΔE_PG = ${numero(c.dEp)} GJ` });
      if (c.tipo === 'mecanica-dada') notas.push({ texto: `E_C = ${numero(c.Ec)} GJ` }, { texto: `E_PG = ${numero(c.Ep)} GJ` });
      if (Number.isFinite(masaSI)) notas.push({ texto: `m = ${numero(masaSI)} kg`, color: 'f' });
      if (c.EpGJ != null) notas.push({ texto: `E_PG = ${numero(c.EpGJ)} GJ` });
      if (c.trabajoGJ != null) notas.push({ texto: `W_g = ${numero(c.trabajoGJ)} GJ` });
      if (c.v1 != null && k === 0) notas.push({ texto: `v_1 = ${numero(c.v1 / 1000)} km/s`, color: 'o' });
      if (c.v != null) notas.push({ texto: `v = ${numero(c.v / 1000)} km/s`, color: 'o' });
      if (c.tipo === 'tramos' && k === 0) notas.push({ texto: `Paso intermedio: r_2 = ${numero(c.r2 / 1000)} km`, color: 'i' });
      if (c.tipo === 'razon') notas.push({ texto: `E_PG,inicial = ${numero(c.Ep0)} GJ` }, { texto: `M cambia por ${numero(c.kM)}; m por ${numero(c.km)}`, color: 'f' }, { texto: `r cambia por ${numero(c.kr)}`, color: 'i' });
      notas.push({ texto: 'Esquema sin escala.' });
      if (revelar && k === (dos ? 1 : 0)) notas.push({ texto: `${c.simboloTexto} ${exacto(c.resultado) ? '=' : '≈'} ${numero(c.resultado)} ${c.unidad}`, color: c.color });
      // Auditoría (26 nov): las dos posiciones se dibujaban a la misma distancia aunque una fuera el doble de la otra.
      // Ahora la más lejana queda más lejos (proporción entre las dos; con solo energías, r va como 1/|E_PG|).
      const lejos = dos ? (() => { const d = c.tipo === 'cambio-dado' ? [1 / Math.abs(c.Ep1), 1 / Math.abs(c.Ep2)] : [c.r1, c.tipo === 'tramos' ? c.r3 : c.r2]; return Math.max(1.6, 4 * d[k] / Math.max(...d)); })() : 4;
      return { titulo: p.rotulo, modo: 'radial', planeta: { c: [0, 0], R: 0.7, rotulo: 'M', colorRotulo: 'f' },
        satelite: { c: [lejos, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [lejos, 0], texto: p.rr ? `${p.etiqueta} = ${numero(p.rr / 1000)} km` : `${p.etiqueta} = ?`, color: 'i' }], notas };
    });
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.3, x1: 5.3, y0: -1.4, y1: 1.4 }, altoGrafico: 132, paneles,
      alt: dos ? 'La misma sonda en dos posiciones exteriores, mostradas por separado. Las cotas parten del centro; el esquema no está a escala.' : 'Un planeta y una sonda con paneles solares. La cota parte del centro y muestra el dato conocido o una interrogación. Esquema sin escala.' }, estado: {} };
  }
  function juegoFigura(rKm, mostrar = true) {
    const GM = 4e14, m0 = 400, rr = [8e6, rKm * 1000];
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.4, x1: 6.3, y0: -1.5, y1: 1.5 }, altoGrafico: 128,
      paneles: rr.map((rr, i) => ({ titulo: i ? 'Posición elegida' : 'Referencia', modo: 'radial',
        planeta: { c: [0, 0], R: 1, rotulo: 'M', colorRotulo: 'f' }, satelite: { c: [rr / 4e6, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [rr / 4e6, 0], texto: `r = ${numero(rr / 1000)} km`, color: 'i' }],
        notas: [{ texto: 'm = 400 kg', color: 'f' }, { texto: 'GM = 4 × 10¹⁴ m³/s²' },
          { texto: mostrar ? `E_PG ${exacto(ep(GM, m0, rr) / 1e9) ? '=' : '≈'} ${numero(ep(GM, m0, rr) / 1e9)} GJ` : 'E_PG está por comparar.' },
          { texto: 'Cero de E_PG en el infinito.' }] })),
      alt: 'Una sonda de 400 kg en dos posiciones exteriores de un planeta ideal. Las distancias están a escala y se miden desde el centro.' }, estado: {} };
  }

  function caso(c) {
    let resultado, unidad = 'GJ', color, simbolo = EP, simboloTexto = 'E_PG', enunciado;
    const dados = ['cambio-dado', 'trabajo-dado', 'mecanica-dada'].includes(c.tipo);
    const datos = dados ? [referencia] : datosBase(c), solucion = [], errores = [], mm = masa(c), rr = radio(c);
    const error = (id, x, causa) => errores.push({ id, valor: x, causa });
    const resultadoEq = (s, x, u = unidad, col = color) => [s, exacto(x) ? ' = ' : ' ≈ ', cantidad(x, u, col)];
    if (dados) {
      if (c.tipo === 'cambio-dado') {
        resultado = c.Ep2 - c.Ep1; simbolo = ['Δ', EP]; simboloTexto = 'ΔE_PG';
        enunciado = ['La energía potencial de una sonda pasa de ', cantidad(c.Ep1, 'GJ'), ' a ', cantidad(c.Ep2, 'GJ'), ', con la misma referencia. ¿Cuánto cambia?'];
        datos.push(leyCambio);
        solucion.push({ texto: 'Restamos la energía final menos la inicial, cada una con su signo.', ecuacion: ['Δ', EP, ` = (${numero(c.Ep2)}) − (${numero(c.Ep1)}) = ${numero(resultado)} GJ`] });
        error('resta-invertida', -resultado, 'Bien identificados los extremos, pero invertiste el orden de la resta: va la final menos la inicial.');
        error('suma-extremos', c.Ep1 + c.Ep2, 'Bien conservados los signos, pero sumaste las energías, y el cambio se obtiene restándolas.');
        error('solo-inicial', c.Ep1, 'Bien leída la energía inicial, pero diste solo ese valor y no la restaste de la final.');
        error('solo-final', c.Ep2, 'Bien leída la energía final, pero diste solo ese valor y no le restaste la inicial.');
      } else if (c.tipo === 'trabajo-dado') {
        resultado = -c.dEp; simbolo = WG; simboloTexto = 'W_g';
        enunciado = ['La energía potencial de una sonda cambia en ', cantidad(c.dEp, 'GJ'), '. ¿Qué trabajo realiza la gravedad durante ese desplazamiento?'];
        datos.push(leyTrabajo);
        solucion.push({ texto: 'El trabajo de la gravedad es el cambio de energía potencial con el signo cambiado.', ecuacion: [WG, ` = −(${numero(c.dEp)}) = ${numero(resultado)} GJ`] });
        error('signo', c.dEp, 'Bien usado el cambio de energía potencial, pero el trabajo de la gravedad lleva el signo contrario.');
        error('doble', 2 * resultado, 'Bien cambiado el signo, pero después contaste el trabajo dos veces.');
        error('mitad', resultado / 2, 'Bien cambiado el signo, pero después lo multiplicaste por un medio que no corresponde.');
        error('nulo', 0, 'Bien distinguidas las energías, pero si la energía potencial cambia, la gravedad sí hace trabajo.');
      } else {
        resultado = c.Ec + c.Ep; simbolo = EM; simboloTexto = 'E_M';
        enunciado = ['Una sonda tiene energía cinética ', cantidad(c.Ec, 'GJ'), ' y energía potencial ', cantidad(c.Ep, 'GJ'), '. ¿Cuál es su energía mecánica?'];
        datos.push([EM, ' = ', EC, ' + ', EP]);
        solucion.push({ texto: 'La energía mecánica es la suma de la cinética y la potencial, cada una con su signo.', ecuacion: [EM, ` = ${numero(c.Ec)} + (${numero(c.Ep)}) = ${numero(resultado)} GJ`] });
        error('potencial-positiva', c.Ec - c.Ep, 'Bien sumadas las energías, pero le cambiaste el signo a la potencial, que es negativa.');
        error('solo-cinetica', c.Ec, 'Bien leída la energía cinética, pero olvidaste sumarle la energía potencial.');
        error('solo-potencial', c.Ep, 'Bien leída la energía potencial, pero olvidaste sumarle la energía cinética.');
        error('sin-medio', 2 * c.Ec + c.Ep, 'Bien incluidas las dos energías, pero duplicaste la energía cinética.');
      }
    } else if (['potencial', 'altura', 'toneladas'].includes(c.tipo)) {
      resultado = ep(c.GM, mm, rr) / 1e9;
      enunciado = c.tipo === 'altura'
        ? ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' está a ', cantidad(c.h / 1000, 'km', 'i'), ' sobre un planeta de radio ', cantidad(c.R / 1000, 'km', 'i'), '. ¿Qué energía potencial tiene?']
        : ['Una sonda de ', cantidad(c.toneladas == null ? mm : c.toneladas, c.toneladas == null ? 'kg' : 't', 'f'), ' está a ', cantidad(rr / 1000, 'km', 'i'), ' del centro del planeta. ¿Cuál es su energía potencial gravitatoria?'];
      if (c.tipo === 'altura') {
        datos.push([r, ' = ', R, ' + ', h]);
        solucion.push({ texto: 'La distancia se mide desde el centro, así que sumamos el radio y la altura.', ecuacion: [r, ` = ${numero(c.R / 1000)} + ${numero(c.h / 1000)} = `, cantidad(rr / 1000, 'km', 'i')] });
      }
      if (c.tipo === 'toneladas') { datos.push('1 t = 1000 kg.'); solucion.push({ texto: 'Pasamos la masa de toneladas a kilogramos.', ecuacion: [m, ` = ${numero(c.toneladas)} · 1000 = `, cantidad(mm, 'kg', 'f')] }); }
      solucion.push({ texto: 'Reemplazamos los datos en la energía potencial, que vale cero en el infinito.', ecuacion: [EP, ' = −', { frac: [[numero(c.GM), ' · ', cantidad(mm, '', 'f')], cantidad(rr, '', 'i')] }, ' J'] });
      solucion.push({ texto: 'Pasamos de joules a gigajoules. El signo negativo sale de poner el cero en el infinito.', ecuacion: resultadoEq(EP, resultado) });
      error('signo', -resultado, 'Bien usadas las magnitudes, pero olvidaste el signo negativo, que sale de poner el cero en el infinito.');
      error('radio-cuadrado', resultado / rr, 'Bien medida la distancia desde el centro, pero la elevaste al cuadrado, y en la energía va sin elevar.');
      error('sin-masa', resultado / mm, 'Bien usada la masa del planeta, pero faltó multiplicar también por la masa de la sonda.');
      error('mitad', resultado / 2, 'Bien usada la distancia, pero agregaste un factor de un medio que no corresponde.');
      if (c.tipo === 'altura') error('desde-superficie', ep(c.GM, mm, c.h) / 1e9, 'Bien incluida la altura, pero la usaste como distancia al centro, y falta sumarle el radio.');
      if (c.tipo === 'toneladas') error('sin-toneladas', resultado / 1000, 'Bien planteada la cuenta, pero dejaste la masa en toneladas, y la fórmula pide kilogramos.');
    } else if (['cambio', 'trabajo', 'tramos'].includes(c.tipo)) {
      const fin = c.tipo === 'tramos' ? c.r3 : c.r2, u1 = ep(c.GM, mm, c.r1) / 1e9, u2 = ep(c.GM, mm, fin) / 1e9;
      resultado = c.tipo === 'cambio' ? u2 - u1 : u1 - u2;
      simbolo = c.tipo === 'cambio' ? ['Δ', EP] : WG; simboloTexto = c.tipo === 'cambio' ? 'ΔE_PG' : 'W_g';
      enunciado = c.tipo === 'tramos'
        ? ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' pasa, una tras otra, por distancias al centro de ', cantidad(c.r1 / 1000, 'km', 'i'), ', ', cantidad(c.r2 / 1000, 'km', 'i'), ' y ', cantidad(c.r3 / 1000, 'km', 'i'), '. ¿Qué trabajo total realiza la gravedad?']
        : ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' pasa de ', cantidad(c.r1 / 1000, 'km', 'i'), ' a ', cantidad(c.r2 / 1000, 'km', 'i'), ' del centro. ', c.tipo === 'cambio' ? '¿Cuánto cambia su energía potencial?' : '¿Qué trabajo realiza la gravedad?'];
      datos.push(leyCambio, leyTrabajo);
      // Auditoría (26 nov): las energías de los extremos aparecían sin su cuenta (lector en frío, tarjeta de tramos).
      const iFin = c.tipo === 'tramos' ? '3' : '2';
      solucion.push({ texto: 'Calculamos la energía potencial en la posición inicial.', ecuacion: [sub('E', 'PG,1'), ' = −', { frac: [`${numero(c.GM)} · ${numero(mm)}`, numero(c.r1)] }, exacto(u1 * 1e9) ? ' = ' : ' ≈ ', `${numero(u1 * 1e9)} J`] });
      solucion.push({ texto: 'Con el mismo cero, calculamos la energía potencial en la posición final.', ecuacion: [sub('E', 'PG,' + iFin), ' = −', { frac: [`${numero(c.GM)} · ${numero(mm)}`, numero(fin)] }, exacto(u2 * 1e9) ? ' = ' : ' ≈ ', `${numero(u2 * 1e9)} J`] });
      solucion.push({ texto: c.tipo === 'tramos' ? 'El paso intermedio no importa: el trabajo de la gravedad solo depende de la posición inicial y de la final.' : c.tipo === 'cambio' ? 'Restamos la energía final menos la inicial, cada una con su signo.' : 'El trabajo de la gravedad es la energía inicial menos la final.',
        ecuacion: resultadoEq(simbolo, resultado) });
      error('resta-invertida', -resultado, 'Bien calculados los extremos, pero invertiste el orden de la resta.');
      error('suma-extremos', u1 + u2, 'Bien conservados los signos, pero sumaste las energías de los extremos en vez de restarlas.');
      error('solo-inicial', u1, 'Bien calculada la energía inicial, pero diste solo ese valor.');
      error('solo-final', u2, 'Bien calculada la energía final, pero diste solo ese valor.');
      error('modulo', Math.abs(u2) + Math.abs(u1), 'Bien hallados los tamaños, pero sumaste sus módulos en vez de calcular el cambio.');
      error('modulo-inicial', Math.abs(u1), 'Bien hallada la energía inicial, pero tomaste su módulo como si fuera el cambio, sin restar la final.');
    } else if (c.tipo === 'mecanica') {
      const cin = ec(mm, c.v) / 1e9, pot = ep(c.GM, mm, rr) / 1e9;
      resultado = cin + pot; simbolo = EM; simboloTexto = 'E_M';
      enunciado = ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' tiene rapidez ', cantidad(c.v / 1000, 'km/s', 'o'), ' a ', cantidad(rr / 1000, 'km', 'i'), ' del centro. ¿Cuál es su energía mecánica?'];
      datos.push(leyEC, [EM, ' = ', EC, ' + ', EP]);
      solucion.push({ texto: 'Calculamos por separado la energía cinética y la potencial.', ecuacion: [EC, exacto(cin) ? ' = ' : ' ≈ ', cantidad(cin, 'GJ'), '; ', EP, exacto(pot) ? ' = ' : ' ≈ ', cantidad(pot, 'GJ')] });
      solucion.push({ texto: 'Sumamos las dos energías; la potencial entra con su signo negativo.', ecuacion: resultadoEq(EM, resultado) });
      error('potencial-positiva', cin - pot, 'Bien sumadas las energías, pero le cambiaste el signo a la potencial, que es negativa.');
      error('sin-medio', 2 * cin + pot, 'Bien incluido el movimiento, pero olvidaste el medio de la energía cinética.');
      error('solo-cinetica', cin, 'Bien calculada la energía cinética, pero olvidaste sumarle la potencial.');
      error('solo-potencial', pot, 'Bien calculada la energía potencial, pero olvidaste sumarle la cinética.');
    } else if (c.tipo === 'distancia') {
      resultado = -c.GM * mm / (c.EpGJ * 1e9) / 1000; unidad = 'km'; color = 'i'; simbolo = r; simboloTexto = 'r';
      enunciado = ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' tiene energía potencial ', cantidad(c.EpGJ, 'GJ'), '. ¿A qué distancia del centro del planeta se encuentra?'];
      solucion.push({ texto: 'Despejamos r de la energía potencial; el signo menos de la fórmula cancela el de la energía dada.', ecuacion: [r, ' = −', { frac: [['GM · ', m], EP] }] });
      // Auditoría (26 nov): faltaba el reemplazo con los GJ pasados a J (lector en frío).
      solucion.push({ texto: 'Reemplazamos con la energía en joules; la distancia sale en metros.', ecuacion: [r, ' = −', { frac: [`${numero(c.GM)} · ${numero(mm)}`, `(${numero(c.EpGJ * 1e9)})`] }, exacto(resultado * 1000) ? ' = ' : ' ≈ ', numero(resultado * 1000)] });
      solucion.push({ texto: 'Pasamos la distancia de metros a kilómetros.', ecuacion: resultadoEq(r, resultado) });
      error('signo', -resultado, 'Bien despejada la distancia, pero olvidaste el signo menos de la fórmula, y una distancia no es negativa.');
      error('sin-km', resultado * 1000, 'Bien obtenida la distancia en metros, pero la diste como si fueran kilómetros.');
      error('raiz-extra', Math.sqrt(resultado * 1000) / 1000, 'Bien hecho el despeje, pero sacaste una raíz que no corresponde, porque aquí la distancia va sin cuadrado.');
      error('mitad', resultado / 2, 'Bien hallada la distancia, pero agregaste un factor de un medio que no corresponde.');
    } else if (c.tipo === 'masa-trabajo') {
      resultado = c.trabajoGJ * 1e9 / (c.GM * (1 / c.r2 - 1 / c.r1)); unidad = 'kg'; color = 'f'; simbolo = m; simboloTexto = 'm';
      enunciado = ['Al pasar de ', cantidad(c.r1 / 1000, 'km', 'i'), ' a ', cantidad(c.r2 / 1000, 'km', 'i'), ' del centro, la gravedad realiza ', cantidad(c.trabajoGJ, 'GJ'), ' de trabajo sobre una sonda. ¿Cuál es su masa?'];
      datos.push(leyCambio, leyTrabajo);
      solucion.push({ texto: 'El trabajo de la gravedad es lo que disminuye la energía potencial; lo escribimos con las dos distancias.', ecuacion: [WG, ' = GM · ', m, ' · (1/', sub(r, '2'), ' − 1/', sub(r, '1'), ')'] });
      solucion.push({ texto: 'Pasamos el trabajo a joules y despejamos la masa.', ecuacion: resultadoEq(m, resultado) });
      error('signo', -resultado, 'Bien usadas las dos distancias, pero invertiste el orden de su resta.');
      error('sin-giga', resultado / 1e9, 'Bien despejada la masa, pero usaste los gigajoules como si fueran joules.');
      error('medio', resultado / 2, 'Bien combinadas las posiciones, pero agregaste un factor de un medio al resultado.');
      error('doble', resultado * 2, 'Bien calculado el trabajo, pero lo contaste dos veces.');
    } else if (c.tipo === 'rapidez') {
      const pot1 = ep(c.GM, mm, c.r1), pot2 = ep(c.GM, mm, c.r2), cin1 = ec(mm, c.v1), cin2 = cin1 + pot1 - pot2;
      if (cin2 <= 0) throw new Error('El caso de rapidez requiere una posición alcanzable con rapidez positiva.');
      resultado = Math.sqrt(2 * cin2 / mm) / 1000; unidad = 'km/s'; color = 'o'; simbolo = sub(v, '2'); simboloTexto = 'v_2';
      enunciado = ['Una sonda de ', cantidad(mm, 'kg', 'f'), ' pasa de ', cantidad(c.r1 / 1000, 'km', 'i'), ' a ', cantidad(c.r2 / 1000, 'km', 'i'), ' del centro. Su rapidez inicial es ', cantidad(c.v1 / 1000, 'km/s', 'o'), '. ¿Cuál es la final?'];
      datos[0] = 'Solo gravedad y movimiento exterior sobre una recta central. Fuente fija, masa de sonda despreciable y cero potencial en el infinito.';
      datos.push(leyEC, leyConservacion);
      solucion.push({ texto: 'Sin otras fuerzas, la energía mecánica se conserva: la energía potencial que se pierde se suma a la cinética inicial.', ecuacion: [sub('E', 'C,2'), ' = ', sub('E', 'C,1'), ' + ', sub('E', 'PG,1'), ' − ', sub('E', 'PG,2')] });
      solucion.push({ texto: 'Calculamos la energía cinética final sin redondear las energías intermedias.', ecuacion: resultadoEq(sub('E', 'C,2'), cin2 / 1e9, 'GJ') });
      solucion.push({ texto: 'De la energía cinética despejamos la rapidez, que es positiva.', ecuacion: resultadoEq(sub(v, '2'), resultado) });
      error('sin-medio', resultado / Math.SQRT2, 'Bien hallada la energía cinética final, pero olvidaste el medio al despejar la rapidez.');
      if (pot1 >= pot2) error('sin-inicial', Math.sqrt(2 * (pot1 - pot2) / mm) / 1000, 'Bien calculado el cambio de energía potencial, pero olvidaste la energía cinética inicial.');
      else error('cambio-invertido', Math.sqrt(2 * (cin1 - pot1 + pot2) / mm) / 1000, 'Bien incluido el movimiento inicial, pero invertiste el cambio de energía potencial.');
      error('sin-gravedad', c.v1 / 1000, 'Bien usado el dato inicial, pero olvidaste que la gravedad cambia la rapidez en el camino.');
      error('signo', -resultado, 'Bien hallado el tamaño, pero una rapidez nunca lleva signo negativo.');
      error('sin-km', resultado * 1000, 'Bien hallada la rapidez en metros por segundo, pero la diste como si fueran kilómetros por segundo.');
    } else if (c.tipo === 'razon') {
      resultado = c.Ep0 * c.kM * c.km / c.kr;
      enunciado = ['La energía potencial inicial es ', cantidad(c.Ep0, 'GJ'), '. La masa del planeta se multiplica por ', numero(c.kM), ', la de la sonda, por ', numero(c.km), ' y la distancia al centro, por ', numero(c.kr), '. ¿Cuál es la nueva energía?'];
      datos.splice(2, 1); datos.push('Cada factor multiplica la magnitud inicial correspondiente; ambas referencias son cero en el infinito.');
      solucion.push({ texto: 'Los factores de las masas multiplican la energía, y el de la distancia la divide una sola vez, sin elevarlo.', ecuacion: [sub('E', 'PG,nueva'), ' = ', sub('E', 'PG,inicial'), ' · ', { frac: [`${numero(c.kM)} · ${numero(c.km)}`, numero(c.kr)] }] });
      solucion.push({ texto: 'La nueva energía conserva el signo negativo de la inicial.', ecuacion: resultadoEq(sub('E', 'PG,nueva'), resultado) });
      error('cuadrado', resultado / c.kr, 'Bien comparadas las distancias, pero elevaste su factor al cuadrado, como en la fuerza; en la energía va sin elevar.');
      error('sin-masas', c.Ep0 / c.kr, 'Bien incluida la distancia, pero olvidaste los cambios de las masas.');
      error('sin-radio', c.Ep0 * c.kM * c.km, 'Bien combinadas las masas, pero olvidaste el cambio de distancia.');
      error('signo', -resultado, 'Bien hallado el tamaño, pero le cambiaste el signo a la energía.');
    } else throw new Error(`Tipo de energía desconocido: ${c.tipo}`);
    const textos = new Set([opcion(resultado, unidad)]);
    const err = errores.filter(e => {
      const t = opcion(e.valor, unidad); if (!Number.isFinite(e.valor) || textos.has(t)) return false; textos.add(t); return true;
    }).map(e => ({ ...e, texto: opcion(e.valor, unidad), error: `GR3-${e.id.toUpperCase()}`, siFuera: `${e.causa} Así sale ${opcion(e.valor, unidad)}.` }));
    return { enunciado, datos, solucion, respuesta: resultadoEq(simbolo, resultado), resultado, unidad, color, simboloTexto, errores: err,
      dibujo: figura({ ...c, resultado, unidad, color, simboloTexto }),
      verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado: !exacto(resultado) }, errores: err.map(e => ({ id: e.id, valor: e.valor })) } };
  }
  const fijos = [
    { tipo: 'potencial', nivel: 1, titulo: 'Una posición exterior', GM: 3e14, m: 200, r: 1e7 },
    { tipo: 'potencial', nivel: 1, titulo: 'La energía de otra sonda', GM: 2e14, m: 600, r: 1.2e7 },
    { tipo: 'cambio-dado', nivel: 1, titulo: 'Comparar dos posiciones', Ep1: -8, Ep2: -3 },
    { tipo: 'trabajo-dado', nivel: 1, titulo: 'La gravedad durante una bajada', dEp: -4 },
    { tipo: 'mecanica-dada', nivel: 1, titulo: 'Sumar dos energías', Ec: 7, Ep: -11 },
    { tipo: 'altura', nivel: 2, titulo: 'Del suelo al centro', GM: 4e14, m: 150, R: 4e6, h: 6e6 },
    { tipo: 'toneladas', nivel: 2, titulo: 'Toneladas en la ecuación', GM: 3e14, toneladas: 0.24, r: 1.6e7 },
    { tipo: 'distancia', nivel: 2, titulo: 'Localizar una sonda', GM: 2e14, m: 360, EpGJ: -4.5 },
    { tipo: 'trabajo', nivel: 2, titulo: 'Alejar la misma sonda', GM: 3e14, m: 400, r1: 6e6, r2: 1.5e7 },
    { tipo: 'mecanica', nivel: 2, titulo: 'Movimiento y posición', GM: 5e14, m: 150, r: 2e7, v: 6000 },
    { tipo: 'rapidez', nivel: 3, titulo: 'La rapidez durante una caída', GM: 2e14, m: 320, r1: 2e7, r2: 8e6, v1: 4000 },
    { tipo: 'masa-trabajo', nivel: 3, titulo: 'Reconstruir la masa', GM: 4e14, r1: 2e7, r2: 1e7, trabajoGJ: 6.4 },
    { tipo: 'razon', nivel: 3, titulo: 'Cambian masas y separación', GM: 3e14, Ep0: -18, kM: 3, km: 1.5, kr: 2 },
    { tipo: 'tramos', nivel: 3, titulo: 'Una ida y otra vuelta', GM: 4e14, m: 280, r1: 8e6, r2: 2e7, r3: 1.4e7 },
    { tipo: 'rapidez', nivel: 3, titulo: 'Una subida todavía posible', GM: 2e14, m: 480, r1: 1e7, r2: 2e7, v1: 7000 },
  ];
  // Redacción (26 nov): causas cortas de las alternativas de nivel 3, en segunda persona.
  const cortas = { 'sin-medio': 'olvidas el medio de la energía cinética', 'sin-inicial': 'olvidas la energía cinética inicial',
    'cambio-invertido': 'inviertes el cambio de energía potencial', 'sin-gravedad': 'olvidas el cambio de energía potencial', signo: 'cambias el signo',
    'sin-km': 'dejas la rapidez en metros por segundo', 'sin-giga': 'usas los gigajoules como joules', medio: 'agregas un factor de un medio',
    doble: 'cuentas el trabajo dos veces', cuadrado: 'elevas al cuadrado el factor de distancia', 'sin-masas': 'olvidas los cambios de masa',
    'sin-radio': 'olvidas el cambio de distancia', 'resta-invertida': 'inviertes el orden de la resta', 'suma-extremos': 'sumas las energías de los extremos',
    'solo-inicial': 'das solo la energía inicial', 'solo-final': 'das solo la energía final', modulo: 'sumas los módulos en vez de restar',
    'modulo-inicial': 'tomas solo el módulo de la energía inicial' };
  let letra = 0;
  const ejemplos = fijos.map(c => {
    const b = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      const errores = b.errores.slice(0, 4); if (errores.length < 4) throw new Error(`Faltan distractores: ${c.titulo}`);
      e.alternativas = errores.map(x => x.texto); e.alternativas.splice(letra++, 0, opcion(b.resultado, b.unidad));
      e.solucion.push({ texto: errores.map(x => { if (!cortas[x.id]) throw new Error(`Falta la causa corta de ${x.id}`); return `${numero(x.valor)} sale si ${cortas[x.id]}.`; }).join(' ') });
    }
    return e;
  });
  function entrada(s, resuelto) {
    s = Math.abs(Math.trunc(s));
    const tipos = ['potencial', 'altura', 'toneladas', 'cambio', 'trabajo', 'mecanica', 'distancia', 'masa-trabajo', 'rapidez', 'razon', 'tramos', 'cambio-dado', 'trabajo-dado', 'mecanica-dada'];
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla.
    const tipo = tipos[(s + (resuelto ? 0 : 7)) % tipos.length], k = Math.floor(s / tipos.length) % 8, z = Math.floor(s / 88) % 7;
    const GM = (resuelto ? 6 + z : 2 + z) * 1e14, mm = (resuelto ? 710 : 110) + 20 * k, r0 = (resuelto ? 13 + k : 7 + k) * 1e6;
    if (tipo === 'cambio-dado') return { tipo, Ep1: -(resuelto ? 51 : 21) - k, Ep2: -(resuelto ? 31 : 11) - z };
    if (tipo === 'trabajo-dado') return { tipo, dEp: (resuelto ? 41 : 11) + k };
    if (tipo === 'mecanica-dada') return { tipo, Ec: (resuelto ? 47 : 17) + k, Ep: -(resuelto ? 83 : 33) - z };
    if (tipo === 'potencial') return { tipo, GM, m: mm, r: r0 };
    if (tipo === 'altura') return { tipo, GM, m: mm, R: (resuelto ? 7 : 6) * 1e6, h: (5 + k) * 1e6 }; // radios de planetas con densidad posible
    if (tipo === 'toneladas') return { tipo, GM, toneladas: (resuelto ? 1.1 : 0.1) + 0.02 * k, r: r0 };
    if (['cambio', 'trabajo'].includes(tipo)) return { tipo, GM, m: mm, r1: r0, r2: r0 * (tipo === 'cambio' ? 2 : 0.75) };
    if (tipo === 'mecanica') return { tipo, GM, m: mm, r: r0, v: (resuelto ? 3 + k : 2 + k) * 1000 };
    if (tipo === 'distancia') return { tipo, GM, m: mm, EpGJ: -(resuelto ? 15 : 5) - k };
    if (tipo === 'masa-trabajo') return { tipo, GM, r1: r0 * 2, r2: r0, trabajoGJ: (resuelto ? 13 : 3) + 0.25 * k };
    if (tipo === 'rapidez') return { tipo, GM, m: mm, r1: r0 * 2, r2: r0, v1: (resuelto ? 4 + k : 1 + k) * 1000 };
    if (tipo === 'razon') return { tipo, GM, Ep0: -(resuelto ? 37 : 17) - k, kM: 2 + z % 3, km: 2, kr: 2.5 + k % 3 };
    return { tipo, GM, m: mm, r1: r0, r2: r0 * 3, r3: r0 * 1.5 };
  }
  function generar(s, resuelto) {
    const b = caso(entrada(s, resuelto));
    if (b.errores.length < 3) throw new Error(`Faltan opciones de energía en ${s}.`);
    if (resuelto) return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion, respuesta: b.respuesta,
      pasos: [{ tipo: 'pide', texto: 'Identificamos la energía, el trabajo o la magnitud que pide el problema.' },
        { tipo: 'regla', texto: 'Usamos el mismo cero de energía potencial, el infinito, en todas las posiciones.' },
        ...b.solucion.map(x => ({ tipo: 'cuentas', ...x })),
        { tipo: 'sentido', texto: 'Con el cero en el infinito, la energía potencial sale negativa; una masa, una distancia o una rapidez nunca lo son.' }] };
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion,
      opciones: [{ id: 'c', texto: opcion(b.resultado, b.unidad), correcta: true }, ...b.errores.slice(0, 3).map(x => ({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera }))],
      solucion: { texto: 'Usamos el mismo cero en el infinito y conservamos los signos, sin redondear las energías intermedias.', ecuacion: b.solucion.at(-1).ecuacion } };
  }
  const p = { tipo: 'cambio', GM: 4e14, m: 300, r1: 1e7, r2: 2e7 }, pc = caso(p);
  const erroresPred = ['resta-invertida', 'suma-extremos', 'modulo-inicial'].map(id => pc.errores.find(e => e.id === id));
  const idea = {
    id: 'energia-gravitatoria', titulo: 'Energía gravitatoria', pregunta: '¿Cómo comparamos energías cuando cambia mucho la separación entre cuerpos?',
    aprendizaje: 'Comparas posiciones mediante energía, declarando el cero en el infinito y conservando los signos.',
    actividad: 'Comparar la energía de una sonda en dos posiciones exteriores de un planeta.',
    temas: ['Energía gravitatoria'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'La misma sonda, dos posiciones', texto: ['En Trabajo y energía usaste ', EP, ' = ', m, '·g·', h, ', que sirve cerca del suelo, donde el campo casi no cambia. Aquí la sonda se aleja mucho del planeta, el campo cambia con la distancia y el cero se pone en otro nivel de referencia.'], dibujo: juegoFigura(12000, false) },
      { titulo: 'Una referencia común', texto: ['Aquí la energía potencial vale cero cuando la sonda está infinitamente lejos del planeta: es la referencia en el infinito. Es una elección para hacer cuentas, no un lugar real. Esa energía se escribe ', EP, ' y se mide en joules.'] },
      { titulo: 'Qué mirar al comparar', texto: ['El trabajo gravitatorio es el que hace la fuerza de gravedad cuando la sonda cambia de posición. En el juego, la masa no cambia; solo cambia la distancia al centro. Un gigajoule (GJ) equivale a mil millones de joules.'] },
    ] },
    juega: {
      consigna: 'Compara la misma sonda en dos posiciones de un planeta ideal. Mueve la posición elegida y observa su energía potencial.',
      voz: 'Las dos energías usan el mismo cero; compáralas con su signo.',
      controles: [{ id: 'rKm', etiqueta: 'Distancia al centro', color: 'c-i', opciones: [8000, 12000, 16000, 20000].map(valor => ({ valor, texto: `${fmt(valor)} km` })), inicio: 8000 }],
      mision: { texto: 'Ubica la sonda donde su energía potencial sea −10 GJ.', logrado: a => Math.abs(ep(4e14, 400, a.rKm * 1000) / 1e9 + 10) < 1e-10,
        testigo: [{ rKm: 16000 }], bien: 'Coincide: a esa distancia, la energía potencial de la sonda es −10 GJ.' },
      dibujo: a => juegoFigura(a.rKm),
      lectura: a => { const actual = ep(4e14, 400, a.rKm * 1000), inicial = ep(4e14, 400, 8e6); return actual === inicial ? 'Las posiciones coinciden y sus energías potenciales también.' : 'Al alejarla, su energía potencial sube y se acerca a cero.'; },
      leyenda: [{ s: m, t: 'masa de la sonda, en kilogramos' }, { s: r, t: 'distancia al centro, en kilómetros' }, { s: EP, t: 'energía potencial gravitatoria, en gigajoules' }, { s: 'GM', t: 'G por la masa del planeta' }], minimo: 2,
    },
    predice: {
      pregunta: 'Una sonda cambia de posición. ¿Cuál es el cambio de su energía potencial gravitatoria?',
      datos: ['La sonda tiene 300 kg; GM es 4 × 10¹⁴ m³/s².', 'Pasa de 10 000 km a 20 000 km del centro.', 'La referencia de energía potencial es cero en el infinito.', '1 km = 1000 m; 1 GJ = 10⁹ J.'],
      dibujo: figura(p), revelar: figura({ ...p, resultado: pc.resultado, unidad: 'GJ', simboloTexto: 'ΔE_PG' }, true),
      opciones: [{ id: 'c', texto: opcion(pc.resultado, 'GJ'), correcta: true }, ...erroresPred.map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      coincide: 'El cambio es la energía final menos la inicial, aunque las dos sean negativas.', verificacion: pc.verificacion,
    },
    mira: { pieza: 'fis-gravitacion', datos: { ...figura(p).datos, cortes: [figura(p).datos, figura({ ...p, resultado: pc.resultado, unidad: 'GJ', simboloTexto: 'ΔE_PG' }, true).datos] },
      pasos: [{ estado: { corte: 0 }, texto: 'Con el cero en el infinito, calculamos la energía potencial en cada posición.', ecuacion: leyEP },
        { estado: { corte: 0 }, texto: 'Calculamos la energía potencial en la posición inicial.', ecuacion: [sub('E', 'PG,1'), ` = ${numero(ep(p.GM, p.m, p.r1) / 1e9)} GJ`] },
        { estado: { corte: 0 }, texto: 'Con el mismo cero, calculamos la energía potencial en la posición final.', ecuacion: [sub('E', 'PG,2'), ` = ${numero(ep(p.GM, p.m, p.r2) / 1e9)} GJ`] },
        { estado: { corte: 1 }, texto: 'Restamos la final menos la inicial; el cambio sale positivo porque la sonda se alejó.', ecuacion: ['Δ', EP, ` = (${numero(ep(p.GM, p.m, p.r2) / 1e9)}) − (${numero(ep(p.GM, p.m, p.r1) / 1e9)}) = ${numero(pc.resultado)} GJ`] }] },
    regla: {
      texto: 'La energía potencial es negativa y se acerca a cero al alejarse la sonda. El trabajo de la gravedad es el cambio de energía potencial, final menos inicial, con el signo cambiado. Sin otras fuerzas, la energía mecánica se conserva.',
      ecuacion: leyEP, condicion: 'el planeta es esférico y está fijo, la masa de la sonda es despreciable frente a la suya y todas las posiciones están fuera del planeta.',
      voz: 'El signo negativo depende de la referencia; no significa que la energía desaparezca.',
      dibujo: figura({ tipo: 'cambio', GM: 3e14, m: 240, r1: 1.2e7, r2: 2.4e7 }),
    },
    ejemplos, resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) }, ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'referencia en el infinito', simple: 'Un cero elegido para comparar posiciones muy separadas.',
      def: 'Elección de cero para la energía potencial gravitatoria cuando la separación entre los cuerpos crece sin límite.',
      ejemplos: ['No corresponde al techo ni al suelo de un edificio.', 'Dos posiciones se comparan usando el mismo cero.', 'Elegir una referencia no mueve físicamente la sonda.'] },
    { termino: 'trabajo gravitatorio', simbolo: 'W_g', medida: 'J', simple: 'El trabajo que realiza la fuerza de gravedad.',
      def: 'Trabajo de la fuerza gravitatoria durante un desplazamiento; relaciona las energías potenciales de sus extremos.',
      ejemplos: ['La gravedad puede realizar trabajo durante una bajada.', 'Una subida también permite calcular el trabajo de la gravedad.', 'La referencia de energía debe mantenerse al comparar extremos.'] },
    { termino: 'energía potencial gravitatoria', local: true, simbolo: 'E_PG', medida: 'J', formas: ['energía potencial gravitatoria', 'energías potenciales gravitatorias'],
      simple: 'La energía que cambia al modificar la posición respecto de la fuente.',
      def: 'Energía asociada a la posición en un campo gravitatorio, calculada con un cero de referencia elegido.',
      ejemplos: ['Cerca del suelo, un campo aproximadamente uniforme permite usar peso por altura con un cero local.',
        'Lejos del planeta, el campo cambia y esa relación de altura ya no sirve.',
        'Cambiar el cero suma la misma constante a todas las energías; no altera sus diferencias.'] },
    { termino: 'nivel de referencia', local: true, formas: ['nivel de referencia', 'niveles de referencia'],
      simple: 'Un cero elegido para comparar energías de distintas posiciones.',
      def: 'Elección de un cero para comparar energías; en este modelo se ubica matemáticamente en el infinito.',
      ejemplos: ['En un problema cercano al suelo, el cero puede estar en una mesa.',
        'La referencia en el infinito no es una superficie material.',
        'Cambiar el cero no cambia el trabajo entre dos posiciones.'] },
  ];
  const letras = { G: 'constante de gravitación universal', M: 'masa de la fuente', m: 'masa de la sonda',
    r: 'separación entre centros', R: 'radio del planeta', h: 'altura sobre su superficie', r_1: 'separación inicial', r_2: 'separación final', r_3: 'tercera separación',
    v: 'rapidez', v_1: 'rapidez inicial', v_2: 'rapidez final', E_PG: 'energía potencial gravitatoria', E_C: 'energía cinética', E_M: 'energía mecánica', W_g: 'trabajo gravitatorio',
    ΔE_PG: 'cambio de energía potencial gravitatoria', E_PG1: 'energía potencial inicial', E_PG2: 'energía potencial final', E_C1: 'energía cinética inicial', E_C2: 'energía cinética final' };
  return { idea, glosario, letras };
}

function construirGr4(Kit) {
  'use strict';
  // Cuentas contrastadas en gravitacion-orbitas.test.js por balance centrípeto,
  // longitud de la circunferencia y energía; no se redondean los datos internos.
  const q = (c, t) => ({ v: `c-${c}`, t: String(t) }), sub = (a, b) => ({ sub: [a, b] });
  const v = q('o', 'v'), r = q('i', 'r'), R = q('i', 'R'), h = q('i', 'h'), T = q('d', 'T');
  const m = q('f', 'm'), M = q('f', 'M'), F = q('h', 'F'), E = sub('E', 'M');
  const f = x => Kit.formatear(x, 3), sp = x => String(x).split('').map(z => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+z] || '⁻').join('');
  function numero(x) {
    if (!x) return '0';
    if (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001) { const e = Math.floor(Math.log10(Math.abs(x))); return `${f(x / 10 ** e)} × 10${sp(e)}`; }
    return f(x);
  }
  function exacto(x) {
    const e = x && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001) ? Math.floor(Math.log10(Math.abs(x))) : 0;
    const mostrado = Math.round(x / 10 ** e * 1000) / 1000 * 10 ** e;
    return Math.abs(mostrado - x) <= 1e-12 * Math.max(1, Math.abs(x));
  }
  const valor = (x, u, c) => c ? q(c, `${numero(x)} ${u}`) : `${numero(x)} ${u}`;
  const textoValor = (x, u, aprox = false) => `${aprox || !exacto(x) ? '≈ ' : ''}${numero(x)} ${u}`;
  const modelo = 'Planeta esférico fijo, satélite de masa despreciable frente al planeta, órbita exterior y sin aire ni propulsión.';
  const leyV = [v, '² = G·', M, '/', r], leyT = [T, ' = 2π·', r, '/', v];
  const leyE = [E, ' = −G·', M, '·', m, '/(2', r, ')'];
  const fuente = (c, mu = c.GM) => `GM = ${numero(mu)} m³/s²: producto de G por la masa del planeta.`;
  const conv = '1 km = 1000 m; 1 min = 60 s; 1 h = 3600 s; 1 MJ = 10⁶ J.';
  const baseFigura = (panel, alto = 190) => ({ pieza: 'fis-gravitacion', datos: {
    vista: { x0: -5, x1: 5, y0: -5, y1: 5 }, altoGrafico: alto, paneles: [panel],
    alt: 'Un planeta y un satélite en una órbita circular. El esquema no está a escala; solo aparecen datos del problema.' }, estado: {} });
  function figura(c, revelar = false) {
    const notas = [{ texto: 'Esquema sin escala de distancias.' }];
    const radioVisible = c.r2 != null ? c.r2 : c.r != null ? c.r : c.r1;
    const nombreRadio = c.r2 != null ? 'r_2' : c.r != null ? 'r' : c.r1 != null ? 'r_1' : 'r';
    if (c.GM != null) notas.push({ texto: `GM = ${numero(c.GM)} m³/s²` });
    if (c.v != null) notas.push({ texto: `v = ${numero(c.v / 1000)} km/s`, color: 'o' });
    if (c.T != null) notas.push({ texto: `T = ${numero(c.T)} s`, color: 'd' });
    if (c.m != null) notas.push({ texto: `m = ${numero(c.m)} kg`, color: 'f' });
    if (c.R != null) notas.push({ texto: `R = ${numero(c.R / 1000)} km`, color: 'i' });
    if (c.h != null) notas.push({ texto: `h = ${numero(c.h / 1000)} km`, color: 'i' });
    if (c.r2 != null) notas.push({ texto: `r_1 = ${numero((c.r1 == null ? c.r : c.r1) / 1000)} km`, color: 'i' });
    if (revelar) notas.push({ texto: `${c.simboloTexto} ${c.aproximado ? '≈' : '='} ${numero(c.resultado)} ${c.unidad}`, color: c.color });
    return baseFigura({ titulo: 'Órbita alrededor del planeta', modo: 'circular', planeta: { c: [0, 0], R: 0.65, rotulo: 'M', colorRotulo: 'f' },
      satelite: { c: [3, 0], tam: 8, rotulo: 'm', colorRotulo: 'f' }, orbita: { r: 3 },
      cotas: [{ de: [0, 0], a: [3, 0], texto: radioVisible != null ? `${nombreRadio} = ${numero(radioVisible / 1000)} km` : 'r = ?', color: radioVisible != null ? 'i' : 'tinta' }], notas });
  }
  function caso(c) {
    let resultado, unidad = 'km/s', simbolo = v, simboloTexto = 'v', color = 'o', enunciado;
    const datos = [modelo], solucion = [], errores = [], intermedios = [];
    const agregar = (nombre, val, u, texto, cuenta, col) => {
      intermedios.push({ nombre, valor: val, unidad: u });
      solucion.push({ texto, ecuacion: [nombre, ' = ', cuenta, exacto(val) && !c.G ? ' = ' : ' ≈ ', valor(val, u, col)] });
    };
    const final = (val, u, s, st, col, texto, cuenta) => {
      resultado = val; unidad = u; simbolo = s; simboloTexto = st; color = col;
      agregar(s, val, u, texto, cuenta, col);
    };
    const error = (id, val, causa) => errores.push({ id, valor: val, causa });
    const rapidez = (mu, radio) => Math.sqrt(mu / radio), periodo = (mu, radio) => 2 * Math.PI * radio / rapidez(mu, radio);
    if (c.tipo === 'rapidez') {
      datos.push(fuente(c), leyV, conv);
      enunciado = ['Un satélite describe una órbita circular de radio ', valor(c.r / 1000, 'km', 'i'), '. ¿Cuál es su rapidez orbital?'];
      final(rapidez(c.GM, c.r) / 1000, 'km/s', v, 'v', 'o', 'Sacamos la raíz positiva de GM entre r, que es la rapidez, y la pasamos a kilómetros por segundo.', [{ raiz: [{ frac: [numero(c.GM), numero(c.r)] }] }, ' ÷ 1000']);
      error('sin-raiz', c.GM / c.r / 1000, 'Bien formado el cociente, pero faltó sacar su raíz.');
      error('radio-doble', rapidez(c.GM, 2 * c.r) / 1000, 'Bien aplicada la relación, pero usaste el diámetro en lugar del radio.');
      error('sin-conversion', resultado * 1000, 'Bien hallada la rapidez en metros por segundo, pero faltó pasarla a kilómetros por segundo.');
      error('raiz-mitad', resultado / 2, 'Bien sacada la raíz, pero después dividiste la rapidez entre dos.');
    } else if (c.tipo === 'periodo') {
      datos.push(leyT, conv);
      enunciado = ['Un satélite recorre una órbita circular de radio ', valor(c.r / 1000, 'km', 'i'), ' con rapidez ', valor(c.v / 1000, 'km/s', 'o'), '. ¿Cuánto dura una vuelta, en minutos?'];
      final(2 * Math.PI * c.r / c.v / 60, 'min', T, 'T', 'd', 'Una vuelta mide 2π por el radio; la dividimos entre la rapidez y pasamos los segundos a minutos.', ['2π × ', numero(c.r), ' ÷ ', numero(c.v), ' ÷ 60']);
      error('sin-dos', resultado / 2, 'Bien dividido entre la rapidez, pero usaste media circunferencia en vez de la vuelta completa.');
      error('sin-pi', 2 * c.r / c.v / 60, 'Bien incluido el diámetro, pero faltó multiplicar por π.');
      error('sin-minutos', resultado * 60, 'Bien hallado el tiempo en segundos, pero lo diste como si fueran minutos.');
      error('radio-como-camino', c.r / c.v / 60, 'Bien dividida la distancia entre la rapidez, pero el radio no es el camino de una vuelta.');
    } else if (c.tipo === 'radio') {
      datos.push(fuente(c), leyV, conv);
      enunciado = ['Un satélite describe una órbita circular con rapidez ', valor(c.v / 1000, 'km/s', 'o'), '. ¿Cuál es el radio orbital, en kilómetros?'];
      final(c.GM / c.v ** 2 / 1000, 'km', r, 'r', 'i', 'Despejamos el radio: dividimos GM entre el cuadrado de la rapidez y pasamos el resultado a kilómetros.', [{ frac: [numero(c.GM), { sup: [numero(c.v), '2'] }] }, ' ÷ 1000']);
      error('sin-cuadrado', c.GM / c.v / 1000, 'Bien despejado el radio, pero dividiste entre la rapidez sin elevarla al cuadrado.');
      error('diametro', 2 * resultado, 'Bien hallado el radio, pero respondiste con el diámetro.');
      error('sin-conversion', resultado * 1000, 'Bien hallado el radio en metros, pero faltó pasarlo a kilómetros.');
      error('mitad', resultado / 2, 'Bien hecho el despeje, pero después dividiste el radio entre dos, como si fuera un diámetro.');
    } else if (c.tipo === 'masa-satelite') {
      datos.push(leyV, 'Las dos órbitas tienen el mismo radio y el mismo planeta.');
      enunciado = ['Un satélite de ', valor(c.m, 'kg', 'f'), ' tiene rapidez circular ', valor(c.v / 1000, 'km/s', 'o'), '. Otro tiene ', valor(c.km * c.m, 'kg', 'f'), '. En la misma órbita, ¿qué rapidez necesita el segundo?'];
      final(c.v / 1000, 'km/s', v, 'v', 'o', 'La masa del satélite se cancela al igualar gravedad y fuerza centrípeta; no modifica la rapidez circular.', [sub(v, 'nueva'), ' = ', sub(v, 'inicial')]);
      error('masa-lineal', resultado * c.km, 'Bien comparadas las masas, pero multiplicaste la rapidez por ese factor, y la rapidez circular no depende de la masa del satélite.');
      error('masa-raiz', resultado * Math.sqrt(c.km), 'Bien recordada la raíz, pero metiste dentro la masa del satélite, que se cancela.');
      error('masa-inversa', resultado / c.km, 'Bien comparados los satélites, pero dividiste la rapidez entre el factor de masa, que no interviene.');
      error('masa-raiz-inversa', resultado / Math.sqrt(c.km), 'Bien usada una raíz, pero dividiste entre la raíz del factor de masa, que no interviene.');
    } else if (c.tipo === 'energia') {
      datos.push(fuente(c), leyE, 'El cero de energía potencial gravitatoria está en el infinito.', conv);
      enunciado = ['Un satélite de ', valor(c.m, 'kg', 'f'), ' describe una órbita circular de radio ', valor(c.r / 1000, 'km', 'i'), '. ¿Cuál es su energía mecánica, en megajoules?'];
      final(-c.GM * c.m / (2 * c.r) / 1e6, 'MJ', E, 'E_M', null, 'Sumamos la energía cinética y la potencial de la órbita; el resultado es negativo porque el cero está en el infinito.', [{ frac: [['−', numero(c.GM), ' × ', numero(c.m)], ['2 × ', numero(c.r)]] }, ' ÷ 10⁶']);
      error('solo-potencial', 2 * resultado, 'Bien conservado el signo, pero respondiste solo con la energía potencial; falta sumarle la cinética.');
      error('solo-cinetica', -resultado, 'Bien hallado el tamaño, pero respondiste con la energía cinética, que es positiva.');
      error('sin-masa', resultado / c.m, 'Bien usada la energía de la órbita, pero faltó multiplicar por la masa del satélite.');
      error('sin-megajoules', resultado * 1e6, 'Bien hallada la energía en joules, pero la diste como si fueran megajoules.');
    } else if (['rapidez-altura', 'periodo-altura', 'rapidez-superficie'].includes(c.tipo)) {
      const radio = c.R + c.h, mu = c.tipo === 'rapidez-superficie' ? c.g0 * c.R ** 2 : c.GM;
      datos.push(c.tipo === 'rapidez-superficie' ? [{ sub: ['g', '0'] }, ' = GM/', R, '²: campo gravitatorio en la superficie.'] : fuente(c), 'r = R + h.', leyV, c.tipo === 'periodo-altura' ? [leyT, '; 1 h = 3600 s; 1 km = 1000 m.'] : '1 km = 1000 m.');
      enunciado = ['Un planeta tiene radio ', valor(c.R / 1000, 'km', 'i'), c.tipo === 'rapidez-superficie' ? ` y campo superficial de ${numero(c.g0)} m/s²` : '', '. Un satélite gira a ', valor(c.h / 1000, 'km', 'i'), ' de altura. ¿Cuál es ', c.tipo === 'periodo-altura' ? 'su período, en horas?' : 'su rapidez circular, en kilómetros por segundo?'];
      agregar(r, radio / 1000, 'km', 'El radio orbital empieza en el centro: sumamos el radio del planeta y la altura.', [numero(c.R / 1000), ' + ', numero(c.h / 1000)], 'i');
      if (c.tipo === 'rapidez-superficie') agregar(['G·', M], mu, 'm³/s²', 'Con el campo en la superficie obtenemos GM: es ese campo por el radio del planeta al cuadrado.', [numero(c.g0), ' × ', { sup: [numero(c.R), '2'] }]);
      if (c.tipo === 'periodo-altura') {
        agregar(v, rapidez(mu, radio) / 1000, 'km/s', 'Calculamos la rapidez con ese radio orbital.', [{ raiz: [{ frac: [numero(mu), numero(radio)] }] }, ' ÷ 1000'], 'o');
        final(periodo(mu, radio) / 3600, 'h', T, 'T', 'd', 'Dividimos el camino de una vuelta entre la rapidez, sin redondearla, y pasamos los segundos a horas.', ['2π·', r, '/', v, ' ÷ 3600']);
        error('altura-como-radio', periodo(mu, c.h) / 3600, 'Bien usado el período circular, pero tomaste la altura como radio orbital, que se mide desde el centro.');
        error('sin-horas', resultado * 3600, 'Bien hallado el tiempo en segundos, pero faltó pasarlo a horas.');
        error('sin-dos', resultado / 2, 'Bien usada la rapidez, pero recorriste solo media circunferencia.');
        error('sin-pi', resultado / Math.PI, 'Bien usados el radio y la rapidez, pero faltó multiplicar por π.');
      } else {
        final(rapidez(mu, radio) / 1000, 'km/s', v, 'v', 'o', 'Calculamos la rapidez circular con el radio medido desde el centro y la pasamos a kilómetros por segundo.',
          [{ raiz: [{ frac: [c.tipo === 'rapidez-superficie' ? [numero(c.g0), ' × ', { sup: [numero(c.R), '2'] }] : numero(mu), numero(radio)] }] }, ' ÷ 1000']);
        error('altura-como-radio', rapidez(mu, c.h) / 1000, 'Bien aplicada la raíz, pero dividiste entre la altura y no entre el radio orbital, que se mide desde el centro.');
        error('superficie', rapidez(mu, c.R) / 1000, 'Bien usado el radio del planeta, pero olvidaste sumarle la altura de la órbita.');
        error('sin-conversion', resultado * 1000, 'Bien hallada la rapidez en metros por segundo, pero faltó pasarla a kilómetros por segundo.');
        error('radio-doble', rapidez(mu, 2 * radio) / 1000, 'Bien sumados el radio y la altura, pero después duplicaste esa distancia.');
      }
    } else if (c.tipo === 'masa-planeta') {
      datos.push(`G ≈ ${numero(c.G)} N·m²/kg².`, leyT, leyV, '1 km = 1000 m.');
      enunciado = ['Una órbita circular tiene radio ', valor(c.r / 1000, 'km', 'i'), ' y período ', valor(c.T, 's', 'd'), '. ¿Cuál es la masa del planeta?'];
      const vel = 2 * Math.PI * c.r / c.T;
      agregar(v, vel, 'm/s', 'En una vuelta, el satélite recorre la circunferencia; dividimos ese largo entre el período para hallar la rapidez.', ['2π × ', numero(c.r), ' ÷ ', numero(c.T)], 'o');
      final(vel ** 2 * c.r / c.G, 'kg', M, 'M', 'f', 'Despejamos la masa del planeta: el cuadrado de la rapidez por el radio, dividido entre G, sin redondear la rapidez.', [v, '²·', r, '/G']);
      error('sin-dos-periodo', resultado / 4, 'Bien hallada una rapidez, pero usaste media circunferencia; la rapidez sale a la mitad, y su cuadrado, a la cuarta parte.');
      error('sin-pi-periodo', resultado / Math.PI ** 2, 'Bien despejada la masa, pero olvidaste π en la rapidez, y por eso también en su cuadrado.');
      error('sin-G', vel ** 2 * c.r, 'Bien hallado el producto GM, pero faltó dividirlo entre G para obtener la masa.');
      error('masa-doble', resultado * 2, 'Bien despejada la masa, pero después la duplicaste.');
    } else if (c.tipo === 'altura') {
      datos.push(fuente(c), leyV, 'r = R + h.', '1 km = 1000 m.');
      enunciado = ['Un planeta tiene radio ', valor(c.R / 1000, 'km', 'i'), '. Un satélite gira con rapidez ', valor(c.v / 1000, 'km/s', 'o'), '. ¿A qué altura sobre la superficie está?'];
      const radio = c.GM / c.v ** 2;
      agregar(r, radio / 1000, 'km', 'Con la rapidez despejamos el radio orbital: GM entre el cuadrado de la rapidez.', [{ frac: [numero(c.GM), { sup: [numero(c.v), '2'] }] }, ' ÷ 1000'], 'i');
      final((radio - c.R) / 1000, 'km', h, 'h', 'i', 'El radio orbital se mide desde el centro e incluye el radio del planeta; lo restamos para obtener la altura.', [r, ' − ', R]);
      error('sin-restar-R', radio / 1000, 'Bien hallado el radio orbital, pero lo diste como si fuera la altura; falta restarle el radio del planeta.');
      error('sumar-R', (radio + c.R) / 1000, 'Bien hallado el radio orbital, pero le sumaste el radio del planeta en vez de restarlo.');
      error('signo', -resultado, 'Bien identificados los dos radios, pero invertiste el orden de la resta.');
      error('sin-conversion', resultado * 1000, 'Bien hallada la altura en metros, pero faltó pasarla a kilómetros.');
    } else if (c.tipo === 'periodo-desde-otra') {
      datos.push(leyV, leyT, 'Las dos órbitas circulares pertenecen al mismo planeta.', conv);
      enunciado = ['Una órbita de radio ', valor(c.r1 / 1000, 'km', 'i'), ' tiene rapidez ', valor(c.v1 / 1000, 'km/s', 'o'), '. ¿Cuál es el período, en minutos, de otra órbita circular de radio ', valor(c.r2 / 1000, 'km', 'i'), '?'];
      const mu = c.v1 ** 2 * c.r1, vel = rapidez(mu, c.r2);
      agregar(['G·', M], mu, 'm³/s²', 'Con la primera órbita hallamos GM: el cuadrado de la rapidez por el radio.', [{ sup: [numero(c.v1), '2'] }, ' × ', numero(c.r1)]);
      agregar(sub(v, '2'), vel / 1000, 'km/s', 'La segunda órbita es del mismo planeta: con el mismo GM, sin redondear, y el nuevo radio, hallamos su rapidez.', [{ raiz: [{ frac: [[{ sup: [numero(c.v1), '2'] }, ' × ', numero(c.r1)], numero(c.r2)] }] }, ' ÷ 1000'], 'o');
      final(periodo(mu, c.r2) / 60, 'min', sub(T, '2'), 'T_2', 'd', 'Dividimos la circunferencia de la segunda órbita entre su rapidez, sin redondearla, y pasamos a minutos.', ['2π·', sub(r, '2'), '/', sub(v, '2'), ' ÷ 60']);
      error('rapidez-igual', 2 * Math.PI * c.r2 / c.v1 / 60, 'Bien cambiada la circunferencia, pero usaste la rapidez de la primera órbita, y en la segunda la rapidez es otra.');
      error('radio-inicial', 2 * Math.PI * c.r1 / c.v1 / 60, 'Bien calculada una vuelta, pero respondiste con la primera órbita y no con la segunda.');
      error('sin-minutos', resultado * 60, 'Bien hallado el tiempo en segundos, pero faltó pasarlo a minutos.');
      error('sin-dos', resultado / 2, 'Bien hallada la segunda rapidez, pero usaste media circunferencia.');
    } else if (c.tipo === 'cambios') {
      datos.push(leyV, 'Los dos satélites tienen masas despreciables frente a sus planetas.');
      enunciado = ['La primera rapidez circular es ', valor(c.v1 / 1000, 'km/s', 'o'), '. En otro sistema, la masa del planeta se multiplica por ', q('f', c.kM), ', el radio por ', q('i', c.kr), ' y la masa del satélite por ', q('f', c.km), '. ¿Cuál es la nueva rapidez?'];
      const razon = c.kM / c.kr;
      agregar([{ frac: [sub(v, '2'), sub(v, '1')] }, '²'], razon, '', 'Al dividir los cuadrados de las dos rapideces, la masa del satélite se cancela; solo quedan la masa del planeta y el radio.', [numero(c.kM), ' ÷ ', numero(c.kr)]);
      final(c.v1 * Math.sqrt(razon) / 1000, 'km/s', sub(v, '2'), 'v_2', 'o', 'Sacamos la raíz de esa razón y la multiplicamos por la rapidez inicial.', [numero(c.v1 / 1000), ' × ', { raiz: [{ frac: [numero(c.kM), numero(c.kr)] }] }]);
      error('sin-raiz', c.v1 / 1000 * razon, 'Bien comparadas la masa del planeta y el radio, pero faltó sacar la raíz del factor.');
      error('incluye-satelite', resultado * Math.sqrt(c.km), 'Bien formada la razón, pero incluiste la masa del satélite, que se cancela.');
      error('radio-directo', c.v1 / 1000 * Math.sqrt(c.kM * c.kr), 'Bien sacada la raíz, pero multiplicaste por el factor de radio en lugar de dividir entre él.');
      error('solo-masa', c.v1 / 1000 * Math.sqrt(c.kM), 'Bien cambiada la masa del planeta, pero olvidaste el cambio de radio.');
      error('inversa', c.v1 / 1000 / Math.sqrt(razon), 'Bien usada la raíz, pero invertiste la razón entre las rapideces.');
    } else if (c.tipo === 'energia-desde-periodo') {
      datos.push(leyT, [leyE, '; ', leyV], 'El cero de energía potencial gravitatoria está en el infinito.', conv);
      enunciado = ['Un satélite de ', valor(c.m, 'kg', 'f'), ' recorre una órbita circular de radio ', valor(c.r / 1000, 'km', 'i'), ' y período ', valor(c.T, 's', 'd'), '. ¿Qué energía mecánica tendría en otra órbita circular de radio ', valor(c.r2 / 1000, 'km', 'i'), ', en megajoules?'];
      const vel = 2 * Math.PI * c.r / c.T;
      agregar(v, vel, 'm/s', 'Con el período y el radio hallamos la rapidez: la circunferencia entre el período.', ['2π × ', numero(c.r), ' ÷ ', numero(c.T)], 'o');
      agregar(['G·', M], vel ** 2 * c.r, 'm³/s²', 'Con la primera órbita hallamos GM, que sirve también para la segunda; no lo redondeamos.', [v, '²·', r]);
      final(-0.5 * c.m * vel ** 2 * c.r / c.r2 / 1e6, 'MJ', E, 'E_M', null, 'Calculamos la energía de la segunda órbita con el mismo GM y el segundo radio, y la pasamos a megajoules.', ['−G·', M, '·', m, '/(2', sub(r, '2'), ') ÷ 10⁶']);
      error('solo-cinetica', -resultado, 'Bien hallado el tamaño, pero diste la energía cinética, que es positiva.');
      error('solo-potencial', 2 * resultado, 'Bien mantenido el signo, pero usaste solo la energía potencial.');
      error('media-vuelta', resultado / 4, 'Bien planteada la energía, pero usaste media circunferencia; la rapidez sale a la mitad, y su cuadrado, a la cuarta parte.');
      error('sin-megajoules', resultado * 1e6, 'Bien calculada la energía en joules, pero faltó pasarla a megajoules.');
    } else if (c.tipo === 'periodo-desde-energia') {
      datos.push(fuente(c), leyE, leyV, leyT, conv);
      enunciado = ['Un satélite de ', valor(c.m, 'kg', 'f'), ' recorre una órbita circular con energía mecánica de ', `${numero(c.energia / 1e6)} MJ`, ', con el cero de energía potencial en el infinito. ¿Cuál es su período en minutos?'];
      const radio = -c.GM * c.m / (2 * c.energia), vel = rapidez(c.GM, radio);
      agregar(r, radio / 1000, 'km', 'Despejamos el radio de la energía de la órbita; como la energía es negativa, el radio sale positivo.', [{ frac: [['−', numero(c.GM), ' × ', numero(c.m)], ['2 × ', { par: [numero(c.energia)] }]] }, ' ÷ 1000'], 'i');
      agregar(v, vel, 'm/s', 'Con ese radio, sin redondearlo, hallamos la rapidez circular.', [{ raiz: [{ frac: [['G·', M], r] }] }], 'o');
      final(periodo(c.GM, radio) / 60, 'min', T, 'T', 'd', 'Dividimos la circunferencia entre la rapidez y pasamos los segundos a minutos.', ['2π·', r, '/', v, ' ÷ 60']);
      error('energia-potencial', periodo(c.GM, radio * 2) / 60, 'Bien despejado un radio, pero tomaste la energía mecánica como si fuera la potencial, y el radio salió el doble.');
      error('sin-minutos', resultado * 60, 'Bien calculado el tiempo en segundos, pero faltó pasarlo a minutos.');
      error('sin-dos', resultado / 2, 'Bien obtenidos el radio y la rapidez, pero recorriste solo media circunferencia.');
      error('sin-pi', resultado / Math.PI, 'Bien dividido entre la rapidez, pero olvidaste π en la circunferencia.');
    } else if (c.tipo === 'altura-desde-periodo') {
      datos.push(leyT, leyV, [{ sub: [r, '2'] }, ' = ', R, ' + ', { sub: [h, '2'] }, '; las dos órbitas pertenecen al mismo planeta.'], conv);
      enunciado = ['Un planeta tiene radio ', valor(c.R / 1000, 'km', 'i'), '. Una órbita circular de radio ', valor(c.r1 / 1000, 'km', 'i'), ' tarda ', valor(c.T1, 's', 'd'), '. ¿Qué altura corresponde a otra órbita circular de rapidez ', valor(c.v2 / 1000, 'km/s', 'o'), '?'];
      const vel1 = 2 * Math.PI * c.r1 / c.T1, mu = vel1 ** 2 * c.r1, radio2 = mu / c.v2 ** 2;
      agregar(sub(v, '1'), vel1, 'm/s', 'Con el radio y el período de la primera órbita hallamos su rapidez.', ['2π × ', numero(c.r1), ' ÷ ', numero(c.T1)], 'o');
      agregar(sub(r, '2'), radio2 / 1000, 'km', 'Las dos órbitas tienen el mismo GM, así que el cuadrado de la rapidez por el radio es igual en ambas; despejamos el segundo radio.', [sub(v, '1'), '²·', sub(r, '1'), '/', sub(v, '2'), '² ÷ 1000'], 'i');
      final((radio2 - c.R) / 1000, 'km', sub(h, '2'), 'h_2', 'i', 'Restamos el radio del planeta para pasar de la distancia al centro a la altura.', [sub(r, '2'), ' − ', R]);
      error('sin-restar-R', radio2 / 1000, 'Bien hallado el segundo radio, pero faltó restarle el radio del planeta.');
      error('sumar-R', (radio2 + c.R) / 1000, 'Bien hallado el segundo radio, pero le sumaste el radio del planeta.');
      error('sin-conversion', resultado * 1000, 'Bien hallada la altura en metros, pero faltó pasarla a kilómetros.');
      error('rapidez-lineal', (c.r1 * vel1 / c.v2 - c.R) / 1000, 'Bien comparadas las órbitas, pero usaste las rapideces sin elevarlas al cuadrado.');
    } else throw new Error(`Tipo circular desconocido: ${c.tipo}`);
    const aprox = !!c.G || !exacto(resultado), vistos = new Set([textoValor(resultado, unidad, !!c.G)]);
    const distintos = errores.filter(e => {
      const texto = textoValor(e.valor, unidad, !!c.G);
      if (!Number.isFinite(e.valor) || vistos.has(texto)) return false; vistos.add(texto); return true;
    }).map(e => ({ ...e, texto: textoValor(e.valor, unidad, !!c.G), error: `GR4-${e.id.toUpperCase()}`,
      siFuera: `${e.causa} Así sale ${textoValor(e.valor, unidad, !!c.G)}.` }));
    // Auditoría (26 nov): la línea de equivalencias solo trae las que el caso usa (antes, min, h y MJ en todos).
    const usado = JSON.stringify([enunciado, unidad, distintos.map(e => e.texto)]);
    const equivalencias = ['1 km = 1000 m', ...(/km\/s/.test(usado) ? ['1 km/s = 1000 m/s'] : []), ...(/\d min\b/.test(usado) || unidad === 'min' ? ['1 min = 60 s'] : []),
      ...(/\d h\b/.test(usado) || unidad === 'h' ? ['1 h = 3600 s'] : []), ...(/MJ/.test(usado) ? ['1 MJ = 10⁶ J'] : [])].join('; ') + '.';
    for (let i = 0; i < datos.length; i++) if (datos[i] === conv) datos[i] = equivalencias;
    return { enunciado, datos, solucion, resultado, unidad, simbolo, color, errores: distintos,
      respuesta: [simbolo, aprox ? ' ≈ ' : ' = ', valor(resultado, unidad, color)], dibujo: figura(c),
      verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado: aprox }, intermedios,
        errores: distintos.map(e => ({ id: e.id, valor: e.valor })) } };
  }

  const casosEjemplo = [
    { tipo: 'rapidez', nivel: 1, titulo: 'La rapidez de una vuelta', GM: 3.6e14, r: 9e6 },
    { tipo: 'periodo', nivel: 1, titulo: 'El tiempo de una vuelta', r: 8e6, v: 5000 },
    { tipo: 'radio', nivel: 1, titulo: 'El radio desde la rapidez', GM: 4.8e14, v: 4000 },
    { tipo: 'masa-satelite', nivel: 1, titulo: 'Otra masa en la órbita', m: 200, km: 4, v: 7000 },
    { tipo: 'energia', nivel: 1, titulo: 'La energía de la órbita', GM: 4.2e14, m: 300, r: 14e6 },
    { tipo: 'rapidez-altura', nivel: 2, titulo: 'Desde la superficie al centro', GM: 4.5e14, R: 5e6, h: 5e6 },
    { tipo: 'periodo-altura', nivel: 2, titulo: 'Una vuelta expresada en horas', GM: 3.2e14, R: 6e6, h: 2e6 },
    { tipo: 'masa-planeta', nivel: 2, titulo: 'La masa del planeta', G: 6.67e-11, r: 10e6, T: 12000 },
    { tipo: 'altura', nivel: 2, titulo: 'La altura desde la rapidez', GM: 4e14, R: 6e6, v: 4000 },
    { tipo: 'rapidez-superficie', nivel: 2, titulo: 'El campo superficial como dato', g0: 9, R: 6e6, h: 3e6 },
    { tipo: 'periodo-desde-otra', nivel: 3, titulo: 'Dos órbitas del mismo planeta', r1: 8e6, v1: 6000, r2: 18e6 },
    { tipo: 'cambios', nivel: 3, titulo: 'Cambian planeta, radio y satélite', v1: 6000, kM: 8, kr: 2, km: 9 },
    { tipo: 'energia-desde-periodo', nivel: 3, titulo: 'La energía de otra órbita', m: 450, r: 9e6, r2: 15e6, T: 9000 },
    { tipo: 'periodo-desde-energia', nivel: 3, titulo: 'Una energía determina la vuelta', GM: 4.8e14, m: 500, energia: -4e9 },
    { tipo: 'altura-desde-periodo', nivel: 3, titulo: 'La altura de otra órbita', R: 5e6, r1: 10e6, T1: 10000, v2: 4000 },
  ];
  const errorCorto = { 'rapidez-igual': 'conservas la rapidez de la primera órbita', 'radio-inicial': 'usas el radio de la primera órbita', 'sin-minutos': 'no pasas los segundos a minutos',
    'sin-dos': 'recorres solo media vuelta', 'sin-raiz': 'no sacas la raíz', 'incluye-satelite': 'incluyes la masa del satélite', 'radio-directo': 'multiplicas por el factor de radio',
    'solo-masa': 'olvidas el cambio de radio', 'solo-cinetica': 'das la energía cinética', 'solo-potencial': 'das solo la energía potencial', 'media-vuelta': 'usas media vuelta para la rapidez',
    'sin-megajoules': 'no pasas los joules a megajoules', 'energia-potencial': 'confundes la energía mecánica con la potencial', 'sin-pi': 'olvidas π',
    'sin-restar-R': 'no restas el radio del planeta', 'sumar-R': 'sumas el radio del planeta', 'sin-conversion': 'no pasas los metros a kilómetros', 'rapidez-lineal': 'no elevas las rapideces al cuadrado', inversa: 'inviertes la razón' };
  let letra = 0;
  const ejemplos = casosEjemplo.map(c => {
    const b = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos,
      figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      if (b.errores.length < 4) throw new Error(`Faltan alternativas: ${c.tipo}`);
      e.alternativas = b.errores.slice(0, 4).map(x => x.texto);
      const correcta = letra++;
      e.alternativas.splice(correcta, 0, textoValor(b.resultado, b.unidad, !!c.G));
      e.solucion.push({ texto: b.errores.slice(0, 4).flatMap((x, i) => [{ negrita: 'ABCDE'[i >= correcta ? i + 1 : i] }, ` sale si ${errorCorto[x.id]}. `]) });
    }
    return e;
  });
  function entrada(semilla, resuelto) {
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla.
    const s = Math.abs(Math.trunc(semilla)), i = (s + (resuelto ? 0 : 7)) % 15, k = 1 + Math.floor(s / 15) % 13, z = Math.floor(s / 195);
    const GM = (resuelto ? 8.8 + k / 10 : 2.3 + k / 10) * 1e14, radio = ((resuelto ? 14 : 7) + k / 5) * 1e6;
    const vel = (resuelto ? 7100 : 3100) + 50 * k, masa = (resuelto ? 1100 : 110) + 10 * k;
    const base = { tipo: casosEjemplo[i].tipo, banco: resuelto ? 'resuelve' : 'ahora', semilla: s };
    if (i === 0) return { ...base, GM, r: radio };
    if (i === 1) return { ...base, r: radio, v: vel };
    if (i === 2) return { ...base, GM, v: vel };
    if (i === 3) return { ...base, m: masa, km: 2 + k % 4, v: vel };
    if (i === 4) return { ...base, GM, m: masa, r: radio };
    if (i === 5 || i === 6) return { ...base, GM, R: (resuelto ? 7.2 : 5.1) * 1e6, h: (2.1 + k / 5) * 1e6 };
    if (i === 7) return { ...base, G: 6.67e-11, r: radio, T: (resuelto ? 23000 : 13000) + 110 * k };
    if (i === 8) return { ...base, GM, R: (resuelto ? 7 : 5.2) * 1e6, v: vel };
    if (i === 9) return { ...base, g0: (resuelto ? 14 : 8) + k / 5, R: (resuelto ? 6.4 : 4.2) * 1e6, h: (1.3 + k / 5) * 1e6 };
    if (i === 10) return { ...base, r1: radio, v1: vel, r2: radio * (2 + (k % 3) / 2) };
    if (i === 11) return { ...base, v1: vel, kM: 5 + k % 4, kr: 2 + k % 2, km: 3 + z % 3 };
    if (i === 12) return { ...base, m: masa, r: radio, r2: radio * (1.5 + (k % 3) / 2), T: (resuelto ? 23000 : 13000) + 130 * k };
    if (i === 13) return { ...base, GM, m: masa, energia: -(resuelto ? 7.7 : 1.7) * 1e9 - k * 1e8 };
    return { ...base, R: (resuelto ? 5.3 : 3.1) * 1e6, r1: radio, T1: (resuelto ? 11000 : 9000) + 100 * k, v2: (resuelto ? 4200 : 2600) + 10 * k };
  }
  function generar(s, resuelto) {
    const b = caso(entrada(s, resuelto));
    if (b.errores.length < 3) throw new Error(`Faltan alternativas en ${s}`);
    if (resuelto) return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: b.verificacion,
      pasos: [{ tipo: 'pide', texto: 'Identificamos la magnitud pedida y si las distancias parten del centro o de la superficie.' },
        { tipo: 'regla', texto: 'La gravedad aporta toda la aceleración hacia el centro que necesita el giro. El período y la energía se calculan con el radio y la rapidez de la misma órbita.' },
        ...b.solucion.map(p => ({ tipo: 'cuentas', ...p })),
        { tipo: 'sentido', texto: 'Comprobamos la unidad pedida y el signo: con el cero en el infinito, la energía de una órbita circular es negativa.' }] };
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion,
      opciones: [{ id: 'c', texto: textoValor(b.resultado, b.unidad, !!b.verificacion.G), correcta: true },
        ...b.errores.slice(0, 3).map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      solucion: { texto: 'Relacionamos el radio, la rapidez y el período de la misma órbita, sin redondear hasta el resultado.', ecuacion: b.solucion.at(-1).ecuacion } };
  }

  const juegoGM = 4e14, juegoR = 16e6, gravedad = juegoGM / juegoR ** 2;
  const periodoJuego = 2 * Math.PI * juegoR / Math.sqrt(juegoGM / juegoR);
  function figuraJuego(a, contexto = false) {
    const velocidad = a.v * 1000, circular = Math.abs(velocidad ** 2 / juegoR - gravedad) < 1e-10;
    const tiempo = circular && !contexto ? a.t || 0 : 0, angulo = velocidad / juegoR * tiempo;
    const x = 3 * Math.cos(angulo), y = 3 * Math.sin(angulo);
    const panel = { titulo: contexto ? 'Un satélite y un planeta' : circular ? 'Movimiento circular' : 'Instante de lanzamiento', modo: 'circular',
      planeta: { c: [0, 0], R: 0.65, rotulo: 'M', colorRotulo: 'f' }, satelite: { c: [x, y], tam: 8, rotulo: 'm', colorRotulo: 'f' },
      flechas: [{ de: [x, y], d: [-velocidad * Math.sin(angulo), velocidad * Math.cos(angulo)], familia: 'v', color: 'o', rotulo: 'v⃗' }],
      notas: [{ texto: 'GM = 4 × 10¹⁴ m³/s²' }, { texto: 'r = 16 000 km', color: 'i' }, { texto: `v = ${numero(a.v)} km/s`, color: 'o' }] };
    if (circular && !contexto) panel.orbita = { r: 3 };
    if (!contexto) panel.notas.push({ texto: `g ${exacto(gravedad) ? '=' : '≈'} ${numero(gravedad)} m/s²` }, { texto: `v²/r ${exacto(velocidad ** 2 / juegoR) ? '=' : '≈'} ${numero(velocidad ** 2 / juegoR)} m/s²` },
      { texto: circular ? `t ${exacto(tiempo) ? '=' : '≈'} ${numero(tiempo)} s` : 'Solo se muestra el estado inicial.', color: circular ? 'd' : 'tinta' });
    const fig = baseFigura(panel, 220); fig.datos.escalas = { v: 0.006 };
    fig.datos.alt = circular && !contexto ? 'Satélite en movimiento circular con velocidad tangente. Las dos aceleraciones coinciden.' : 'Satélite en el instante inicial, con velocidad tangente. No se dibuja su trayectoria posterior.';
    return fig;
  }
  const predV = 8000, predK = 4, predNueva = predV / Math.sqrt(predK) / 1000;
  const predErrores = { lineal: predV / predK / 1000, igual: predV / 1000, directa: predV * Math.sqrt(predK) / 1000 };
  function figuraPred(revelar = false) {
    const panel = { titulo: 'Otra órbita del mismo planeta', modo: 'circular', planeta: { c: [0, 0], R: 0.55, rotulo: 'M', colorRotulo: 'f' },
      satelite: { c: [3, 0], tam: 8, rotulo: 'm', colorRotulo: 'f' }, orbita: { r: 3 },
      notas: [{ texto: `Primera órbita: v_1 = ${numero(predV / 1000)} km/s`, color: 'o' }, { texto: `Segunda órbita: r_2 = ${numero(predK)} r_1`, color: 'i' },
        { texto: revelar ? `v_2 = ${numero(predNueva)} km/s` : 'v_2 = ?', color: revelar ? 'o' : 'tinta' }, { texto: 'Esquema sin escala de distancias.' }] };
    const fig = baseFigura(panel); fig.datos.alt = 'Se comparan dos órbitas circulares del mismo planeta. La primera rapidez y el cambio de radio son datos.'; return fig;
  }
  // Cambia la rapidez tangente; permanecen GM y r. Progresa el balance de
  // aceleraciones. Se reserva para Predice el cambio de radio. Deben verse
  // el planeta, el satélite y la trayectoria solo cuando la circular es posible.
  const idea = {
    id: 'orbita-circular', titulo: 'Órbitas circulares', pregunta: '¿Qué rapidez permite mantener una órbita circular?',
    aprendizaje: 'Relacionas radio, rapidez, período y energía circular cuando la gravedad aporta toda la aceleración centrípeta.',
    actividad: 'Ajustar la rapidez tangente de un satélite y comparar dos aceleraciones.', temas: ['Órbitas circulares'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'Un objeto que gira', texto: ['Un satélite es un cuerpo que gira alrededor de otro atraído por su gravedad, y el camino que recorre se llama órbita. Aquí estudiamos órbitas circulares alrededor de un planeta.'], dibujo: figuraJuego({ v: 2 }, true) },
      { titulo: 'Del centro a la trayectoria', texto: ['El radio orbital ', r, ' se mide desde el centro del planeta. La rapidez orbital ', v, ' dice cuánto camino recorre el satélite en cada segundo; su velocidad es tangente al círculo, es decir, lo toca sin cruzarlo.'] },
      { titulo: 'Dos aceleraciones por comparar', texto: ['Para girar en círculo hace falta una aceleración hacia el centro, v²/r. El juego la compara con la que aporta la gravedad, g, que en m/s² vale lo mismo que en N/kg. El período ', T, ' es el tiempo de una vuelta.'] },
      // Apertura (28 nov, docs/etapa9/aperturas-para-la-teoria.md): el satélite cae todo el tiempo, y se une con la balanza
      // que marca cero en caída libre (regla de la idea 2). No dice la rapidez de Predice (4 km/s).
      { titulo: 'Cae sin llegar al suelo', texto: 'Un satélite en órbita cae todo el tiempo, porque la gravedad lo jala hacia el planeta, pero avanza de lado tan rápido que el suelo curvo se aleja debajo de él. Los astronautas caen con la nave, así que una balanza bajo sus pies marcaría cero, como en la caída libre de la idea del campo: por eso flotan.' },
    ] },
    juega: {
      consigna: 'Elige la rapidez del satélite, lanzado tangente al círculo, y compara la aceleración que necesita para girar con la que le da la gravedad.',
      voz: 'El reloj avanza la posición solo cuando las dos aceleraciones coinciden.',
      controles: [{ id: 'v', etiqueta: 'Rapidez tangente', opciones: [2, 4, 5, 6].map(x => ({ valor: x, texto: `${x} km/s` })), inicio: 2, color: 'c-o' },
        { id: 't', etiqueta: 'Reloj de la órbita circular', min: 0, max: periodoJuego, paso: 500, inicio: 0, unidad: 's', color: 'c-d', auto: { velocidad: 1000, modo: 'reinicia' } }],
      mision: { texto: 'Haz coincidir la aceleración necesaria para girar con la que produce la gravedad.',
        logrado: a => Math.abs((a.v * 1000) ** 2 / juegoR - gravedad) < 1e-10, testigo: [{ v: 5, t: 0 }],
        bien: 'Las dos aceleraciones coinciden: el reloj puede recorrer la órbita circular.' },
      dibujo: a => figuraJuego(a), lectura: a => {
        const necesaria = (a.v * 1000) ** 2 / juegoR;
        return necesaria === gravedad ? 'g coincide con v²/r: órbita circular; el reloj avanza.' : necesaria < gravedad ? 'g mayor que v²/r: no sigue este círculo; el reloj espera.' : 'g menor que v²/r: no sigue este círculo; el reloj espera.';
      },
      leyenda: [{ s: M, t: 'masa del planeta' }, { s: m, t: 'masa del satélite' }, { s: r, t: 'radio desde el centro del planeta' },
        { s: v, t: 'rapidez tangente, en kilómetros por segundo' }, { s: 'g', t: 'aceleración que aporta la gravedad' },
        { s: 'v²/r', t: 'aceleración necesaria para el círculo elegido' }, { s: q('d', 't'), t: 'tiempo transcurrido, en segundos' }, { s: 'GM', t: 'G por la masa del planeta' }], minimo: 2,
    },
    predice: {
      pregunta: 'En otro planeta, una órbita circular tiene rapidez de 8 km/s. Si el radio se cuadruplica, ¿qué rapidez circular corresponde?',
      datos: ['Las dos órbitas corresponden al mismo planeta.', 'La rapidez inicial es 8 km/s.', 'El nuevo radio es cuatro veces el inicial.', 'La masa del satélite es despreciable frente a la planetaria.'],
      dibujo: figuraPred(), revelar: figuraPred(true),
      opciones: [{ id: 'c', texto: textoValor(predNueva, 'km/s'), correcta: true },
        { id: 'lineal', texto: textoValor(predErrores.lineal, 'km/s'), error: 'GR4-PRED-LINEAL', siFuera: `Bien esperada una rapidez menor, pero dividiste entre cuatro sin sacar la raíz. Así sale ${textoValor(predErrores.lineal, 'km/s')}.` },
        { id: 'igual', texto: textoValor(predErrores.igual, 'km/s'), error: 'GR4-PRED-IGUAL', siFuera: `Bien considerado el mismo planeta, pero la rapidez circular cambia cuando cambia el radio. Así sale ${textoValor(predErrores.igual, 'km/s')}.` },
        { id: 'directa', texto: textoValor(predErrores.directa, 'km/s'), error: 'GR4-PRED-DIRECTA', siFuera: `Bien sacada la raíz de cuatro, pero multiplicaste por ella en vez de dividir. Así sale ${textoValor(predErrores.directa, 'km/s')}.` }],
      coincide: 'Al aumentar el radio, la rapidez circular disminuye, pero según la raíz del radio, no en la misma proporción.',
      verificacion: { tipo: 'predice', v1: predV, kr: predK, respuesta: { valor: predNueva, unidad: 'km/s' }, errores: Object.entries(predErrores).map(([id, valor]) => ({ id, valor })) },
    },
    mira: { pieza: 'fis-gravitacion', datos: { ...figuraPred().datos, cortes: [figuraPred().datos, figuraPred(true).datos] }, pasos: [
      { estado: { corte: 0 }, texto: 'La gravedad es la fuerza que lleva al satélite hacia el centro; no hay otra fuerza centrípeta aparte.', ecuacion: ['G·', M, '·', m, '/', r, '² = ', m, '·', v, '²/', r] },
      { estado: { corte: 0 }, texto: 'La masa del satélite está a los dos lados y se cancela; también se cancela un factor r.', ecuacion: leyV },
      { estado: { corte: 0 }, texto: 'Como las dos órbitas tienen el mismo GM, el cociente de los cuadrados de las rapideces depende solo de los radios.', ecuacion: [sub(v, '2'), '²/', sub(v, '1'), '² = ', sub(r, '1'), '/', sub(r, '2'), ` = 1/${numero(predK)}`] },
      { estado: { corte: 1 }, texto: 'Sacamos la raíz positiva: la rapidez inicial se divide entre la raíz de cuatro.', ecuacion: [sub(v, '2'), ` = ${numero(predV / 1000)} ÷ √${numero(predK)} = `, valor(predNueva, 'km/s', 'o')] },
      { estado: { corte: 1 }, texto: 'El período es el tiempo de una vuelta: el largo de la circunferencia dividido entre la rapidez.', ecuacion: leyT },
      { estado: { corte: 1 }, texto: 'Al sumar la energía cinética y la potencial de la órbita, queda la mitad de la energía potencial.', ecuacion: leyE },
    ] },
    regla: { texto: 'Un satélite sigue una órbita circular cuando la gravedad le da justo la aceleración hacia el centro que necesita para girar. La masa del satélite se cancela, el radio se mide desde el centro y la energía de la órbita es negativa.',
      ecuacion: [v, ' = ', { raiz: [{ frac: [['G·', M], r] }] }, '; ', leyT, '; ', leyE],
      condicion: 'el planeta es esférico y fijo, el satélite tiene masa despreciable frente a él, la órbita es exterior y no hay aire ni propulsión; el cero de energía potencial está en el infinito.',
      voz: 'En la órbita circular, la energía mecánica vale la mitad de la energía potencial.',
      dibujo: figura({ GM: 3e14, r: 12e6, m: 150 }) },
    ejemplos, resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) }, ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'órbita', simple: 'El camino de un cuerpo que gira alrededor de otro.', def: 'Trayectoria de un cuerpo bajo la atracción gravitatoria de otro.',
      ejemplos: ['Un círculo es una posible forma de trayectoria alrededor de un planeta.', 'La trayectoria se describe respecto del cuerpo central.', 'El centro del planeta sirve como referencia para ubicar el cuerpo que gira.'] },
    { termino: 'satélite', simple: 'Un cuerpo que gira alrededor de otro por gravedad.', def: 'Cuerpo natural o artificial que gira alrededor de otro por su atracción gravitatoria.',
      ejemplos: ['Una luna puede girar alrededor de un planeta.', 'Un aparato con paneles solares puede recorrer una trayectoria alrededor de un planeta.', 'El modelo distingue la masa del cuerpo central de la del cuerpo que gira.'] },
    { termino: 'rapidez orbital', simbolo: 'v', medida: 'm/s', simple: 'Cuánto camino recorre por segundo un cuerpo que gira.', def: 'Módulo de la velocidad de un cuerpo que recorre una órbita.',
      ejemplos: ['La rapidez se expresa como una distancia recorrida por unidad de tiempo.', 'El problema puede expresar la rapidez en kilómetros por segundo.', 'La flecha de velocidad añade una dirección al valor de la rapidez.'] },
  ];
  const letras = { G: 'constante de gravitación universal', M: 'masa del planeta', m: 'masa del satélite', r: 'radio orbital desde el centro',
    R: 'radio del planeta', h: 'altura sobre su superficie', v: 'rapidez orbital', T: 'período de una órbita circular', t: 'tiempo transcurrido',
    g: 'aceleración gravitatoria del lugar', g_0: 'campo gravitatorio superficial', E_M: 'energía mecánica',
    r_1: 'radio de la primera órbita', r_2: 'radio de la segunda órbita', v_1: 'rapidez de la primera órbita', v_2: 'rapidez de la segunda órbita',
    T_1: 'período de la primera órbita', T_2: 'período de la segunda órbita', h_2: 'altura de la segunda órbita' };
  return { idea, glosario, letras };
}

function construirGr5(Kit) {
  'use strict';
  // Kepler: OpenStax 13.5; anomalía interna: ssd.jpl.nasa.gov/planets/approx_pos.html.
  // UA exacta: ssd.jpl.nasa.gov/astro_par.html, IAU 2012 B1.
  const q = (c, t) => ({ v: `c-${c}`, t: String(t) });
  const sub = (a, b) => ({ sub: [a, b] });
  const a = q('i', 'a'), b = q('i', 'b'), r = q('i', 'r'), R = q('i', 'R'), h = q('i', 'h');
  const T = q('d', 'T'), dt = ['Δ', q('d', 't')], v = q('o', 'v');
  const aA = sub(a, 'A'), aB = sub(a, 'B'), TA = sub(T, 'A'), TB = sub(T, 'B');
  // Auditoría (26 nov): «a» era el semieje y también el subíndice del extremo lejano (r_a, v_a). Subíndices en palabras.
  const rp = sub(r, 'cerca'), ra = sub(r, 'lejos'), vp = sub(v, 'cerca'), va = sub(v, 'lejos');
  const At = sub('S', 'total'), Ab = sub('S', 'barrida');
  const f = n => Kit.formatear(Math.abs(n) < 1e-11 ? 0 : n, 3);
  const exacto = n => Math.abs(n * 1000 - Math.round(n * 1000)) < 1e-7;
  const val = (n, u, c) => c ? q(c, `${f(n)}${u ? ` ${u}` : ''}`) : `${f(n)}${u ? ` ${u}` : ''}`;
  const textoValor = (n, u) => `${exacto(n) ? '' : '≈ '}${f(n)}${u ? ` ${u}` : ''}`;
  const ecuacion = (s, n, u, c) => [s, exacto(n) ? ' = ' : ' ≈ ', val(n, u, c)];
  const ley3 = [{ frac: [{ sup: [TB, 2] }, { sup: [TA, 2] }] }, ' = ', { frac: [{ sup: [aB, 3] }, { sup: [aA, 3] }] }];
  const ley2 = [{ frac: [Ab, At] }, ' = ', { frac: [dt, T] }];
  const geometria = [rp, ' = ', a, '(1 − e); ', ra, ' = ', a, '(1 + e)'];
  const extremos = [rp, ' · ', vp, ' = ', ra, ' · ', va];
  const modelo = 'Órbitas elípticas exteriores; misma fuente dominante fija y masas orbitantes despreciables. Solo actúa la gravedad.';
  const base = { aKm: 10000, e: 0.6, periodoHoras: 20, radioPlanetaKm: 2000 };
  // La elipse tiene foco izquierdo en (0,0), centro (+ae,0); no se anima E uniformemente.
  const n = 2 * Math.PI / (base.periodoHoras * 3600), am = base.aKm * 1000;
  const mu = n * n * am * am * am, bKm = base.aKm * Math.sqrt(1 - base.e ** 2);
  function anomalia(M) {
    const vueltas = Math.floor(M / (2 * Math.PI)), m0 = M - vueltas * 2 * Math.PI;
    let lo = 0, hi = 2 * Math.PI, E = m0 + base.e * Math.sin(m0);
    for (let i = 0; i < 80; i++) {
      const residuo = E - base.e * Math.sin(E) - m0;
      if (Math.abs(residuo) < 8e-15) return E + vueltas * 2 * Math.PI;
      if (residuo > 0) hi = E; else lo = E;
      const siguiente = E - residuo / (1 - base.e * Math.cos(E));
      E = siguiente > lo && siguiente < hi ? siguiente : (lo + hi) / 2;
    }
    return (lo + hi) / 2 + vueltas * 2 * Math.PI;
  }
  function estado(horas) {
    const E = anomalia(n * horas * 3600), de = n / (1 - base.e * Math.cos(E));
    return { E, c: [base.aKm * (base.e - Math.cos(E)), -bKm * Math.sin(E)],
      velocidad: [base.aKm * Math.sin(E) * de, -bKm * Math.cos(E) * de] };
  }
  function sector(inicio, duracion, tramos = 128) {
    const E0 = estado(inicio).E, E1 = estado(inicio + duracion).E;
    const area = base.aKm * bKm / 2 * (E1 - E0 - base.e * (Math.sin(E1) - Math.sin(E0)));
    return { area, fraccion: area / (Math.PI * base.aKm * bKm),
      puntos: [[0, 0], ...Array.from({ length: tramos + 1 }, (_, k) => estado(inicio + duracion * k / tramos).c), [0, 0]] };
  }
  function juegoFigura(c, mostrar = true) {
    const ss = sector(c.inicio, c.duracion), t = c.inicio + c.u * c.duracion, pos = estado(t);
    return { pieza: 'fis-gravitacion', datos: {
      vista: { x0: -6500, x1: 18500, y0: -10500, y1: 10500 }, altoGrafico: 216,
      escalas: { v: 35 }, paneles: [{ titulo: 'Una órbita elíptica', modo: 'elipse',
        planeta: { c: [0, 0], R: base.radioPlanetaKm, rotulo: 'M', colorRotulo: 'f' },
        satelite: { c: pos.c, rotulo: 'm', colorRotulo: 'f', tam: 8 }, orbita: { a: base.aKm, b: bKm },
        sectores: mostrar ? [{ puntos: ss.puntos, color: 'tinta' }] : [],
        cotas: [{ de: [6000, 0], a: [16000, 0], texto: 'a = 10 000 km', color: 'i' }],
        notas: [{ texto: 'e = 0,6' }, { texto: 'R = 2000 km', color: 'i' }, { texto: 'T = 20 h', color: 'd' },
          { texto: mostrar ? `Sector: ${f(100 * ss.fraccion)} % del área total` : 'La línea al satélite barre un área.' },
          { texto: 'Modelo ideal; distancias a escala.' }] }],
      alt: 'Una sonda recorre una elipse alrededor de un planeta situado en su foco izquierdo. La cota a parte del centro geométrico, distinto del planeta.',
      verificacionOrbital: { ...base, GM: mu, inicio: c.inicio, duracion: c.duracion, u: c.u, instanteHoras: t, areaKm2: ss.area } }, estado: {} };
  }
  function figura(c, revelar = false) {
    if (c.circulares) {
      const paneles = ['A', 'B'].map(nombre => ({ titulo: `Órbita circular ${nombre}`, modo: 'circular',
        planeta: { c: [0, 0], R: 0.35, rotulo: 'M', colorRotulo: 'f' }, orbita: { r: 3 },
        satelite: { c: [3, 0], rotulo: nombre, colorRotulo: 'f', tam: 8 },
        cotas: [{ de: [0, 0], a: [3, 0], texto: `a_${nombre} = r_${nombre} = ${f(nombre === 'A' ? c.aA : c.aB)} UA`, color: 'i' }],
        notas: [{ texto: nombre === 'A' ? `T_A = ${f(c.TA)} años` : revelar ? `T_B = ${f(c.resultado)} años` : 'T_B = ?', color: nombre === 'A' || revelar ? 'd' : 'tinta' },
          { texto: 'La misma estrella en ambos casos.' }, { texto: 'Esquema sin escala.' }] }));
      return { pieza: 'fis-gravitacion', datos: { vista: { x0: -4, x1: 4, y0: -4, y1: 4 }, altoGrafico: 144, paneles,
        alt: 'Dos órbitas circulares alrededor de la misma estrella, en paneles separados. En cada círculo el semieje mayor coincide con el radio. Esquemas sin escala.' }, estado: {} };
    }
    const notas = [{ texto: 'Esquema sin escala.' }];
    const agregar = (k, simbolo, unidad, color) => { if (c[k] != null) notas.push({ texto: `${simbolo} = ${f(c[k])} ${unidad}`.trim(), color }); };
    const unidadExtremos = c.tipo === 'periodo-extremos' ? 'millones de km' : 'km';
    agregar('a', 'a', 'km', 'i'); agregar('e', 'e', '', 'tinta'); agregar('rp', 'r_cerca', unidadExtremos, 'i'); agregar('ra', 'r_lejos', unidadExtremos, 'i');
    agregar('R', 'R', 'km', 'i'); agregar('hp', 'h_cerca', 'km', 'i'); agregar('ha', 'h_lejos', 'km', 'i');
    agregar('vp', 'v_cerca', 'km/s', 'o'); agregar('T', 'T', c.dias ? 'días' : 'h', 'd'); agregar('dt', 'Δt', c.tipo === 'sector-semieje' ? (c.uTiempo || 'días') : 'h', 'd');
    agregar('porcentaje', 'Área barrida', '%', 'tinta');
    agregar('aA', 'a_A', c.uLong || 'millones de km', 'i'); agregar('aB', 'a_B', c.uLong || 'millones de km', 'i');
    agregar('TA', 'T_A', c.uTiempo || 'días', 'd'); agregar('TB', 'T_B', c.uTiempo || 'días', 'd');
    if (revelar) notas.push({ texto: `${c.simboloTexto} ${exacto(c.resultado) ? '=' : '≈'} ${f(c.resultado)} ${c.unidad}`, color: c.color || 'tinta' });
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -2.4, x1: 6.2, y0: -3.8, y1: 3.8 }, altoGrafico: 156,
      paneles: [{ titulo: 'Los datos de la órbita', modo: 'elipse', planeta: { c: [0, 0], R: 0.35, rotulo: 'M', colorRotulo: 'f' },
        orbita: { a: 3, b: 2.4 }, satelite: { c: [1.8, -2.4], rotulo: 'm', colorRotulo: 'f', tam: 8 }, notas }],
      alt: 'Un planeta en un foco y una sonda en una órbita elíptica esquemática. Las notas muestran los datos conocidos; las distancias no están a escala.' }, estado: {} };
  }
  function caso(c) {
    const datos = [modelo], solucion = [], errores = [];
    let resultado, unidad = 'km', color = 'i', simbolo = a, simboloTexto = 'a', enunciado;
    const error = (id, valor, causa) => errores.push({ id, valor, causa });
    const paso = (texto, ecuacion) => solucion.push({ texto, ecuacion });
    const terminar = texto => paso(texto, ecuacion(simbolo, resultado, unidad, color));
    const period = (ta, aa, ab) => ta * Math.sqrt((ab / aa) ** 3);
    if (['cercano', 'lejano'].includes(c.tipo)) {
      const cerca = c.tipo === 'cercano'; resultado = c.a * (1 + (cerca ? -c.e : c.e)); simbolo = cerca ? rp : ra; simboloTexto = cerca ? 'r_cerca' : 'r_lejos';
      enunciado = ['Una órbita tiene semieje mayor ', val(c.a, 'km', 'i'), ' y excentricidad ', f(c.e), '. ¿Cuál es la separación ', cerca ? 'mínima' : 'máxima', ' entre la sonda y el centro del planeta?'];
      datos.push(geometria, 'Los subíndices cerca y lejos indican el extremo más cercano y el más lejano al planeta.');
      paso('Elegimos el extremo pedido: en el cercano, a·e se resta del semieje; en el lejano, se suma.', [simbolo, ` = ${f(c.a)} · (1 ${cerca ? '−' : '+'} ${f(c.e)})`]); terminar('El resultado se mide desde el centro del planeta, así que no es una altura.');
      error('otro-extremo', c.a * (1 + (cerca ? c.e : -c.e)), 'Bien usada la excentricidad, pero elegiste el otro extremo de la órbita.');
      error('solo-a', c.a, 'Bien reconocido el semieje mayor, pero lo diste como si fuera la separación en el extremo.');
      error('solo-ae', c.a * c.e, 'Bien multiplicado a por e, pero falta restar ese producto del semieje o sumárselo, según el extremo.');
      error('diametro', resultado * 2, 'Bien escogido el extremo, pero después duplicaste la separación.');
    } else if (['semieje', 'excentricidad'].includes(c.tipo)) {
      const semi = c.tipo === 'semieje'; resultado = semi ? (c.rp + c.ra) / 2 : (c.ra - c.rp) / (c.ra + c.rp);
      simbolo = semi ? a : 'e'; simboloTexto = semi ? 'a' : 'e'; unidad = semi ? 'km' : ''; color = semi ? 'i' : null;
      enunciado = ['Las separaciones mínima y máxima entre la sonda y el centro del planeta son ', val(c.rp, 'km', 'i'), ' y ', val(c.ra, 'km', 'i'), '. ¿Cuál es ', semi ? 'el semieje mayor de la órbita' : 'su excentricidad', '?'];
      datos.push(geometria, 'El diámetro mayor une ambos extremos pasando por el foco.');
      paso('Las dos separaciones extremas juntas forman el diámetro mayor de la elipse, así que las sumamos.', [q('i', '2a'), ` = ${f(c.rp)} + ${f(c.ra)} = `, val(c.rp + c.ra, 'km', 'i')]);
      if (!semi) paso('La diferencia entre los extremos es el doble de la distancia del foco al centro de la elipse; al dividirla entre el diámetro mayor sale e.', ['e = ', { frac: [`${f(c.ra)} − ${f(c.rp)}`, `${f(c.ra)} + ${f(c.rp)}`] }]);
      terminar(semi ? 'El semieje mayor es la mitad de ese diámetro.' : 'La excentricidad es un cociente de longitudes, así que no tiene unidades.');
      error('suma', c.rp + c.ra, 'Bien sumados los extremos, pero falta dividir según lo que se pide.');
      error('diferencia', semi ? (c.ra - c.rp) / 2 : (c.ra - c.rp) / c.ra, 'Bien identificados los extremos, pero combinaste mal las dos separaciones en la fórmula.');
      error('solo-lejano', semi ? c.ra : c.rp / c.ra, 'Bien usado el extremo lejano, pero olvidaste combinarlo con el cercano.');
      error('doble', resultado * 2, 'Bien combinados los dos extremos, pero sobra un factor dos.');
    } else if (['area', 'duracion', 'area-dias'].includes(c.tipo)) {
      const duracion = c.tipo === 'duracion', enDias = c.tipo === 'area-dias' || c.dias, horas = c.T * (enDias ? 24 : 1);
      resultado = duracion ? horas * c.porcentaje / 100 : 100 * c.dt / horas;
      unidad = duracion ? 'h' : '%'; color = duracion ? 'd' : null; simbolo = duracion ? dt : [Ab, '/', At]; simboloTexto = duracion ? 'Δt' : 'Área barrida';
      enunciado = duracion ? ['Una sonda tarda ', val(c.T, enDias ? 'días' : 'h', 'd'), ' en completar su órbita. ¿Cuántas horas tarda en barrer el ', f(c.porcentaje), ' % del área orbital?']
        : ['Una sonda tarda ', val(c.T, c.tipo === 'area-dias' ? 'días' : 'h', 'd'), ' por vuelta. ¿Qué porcentaje del área orbital barre en ', val(c.dt, 'h', 'd'), '?'];
      datos.push(ley2, 'El área se mide desde el foco ocupado por el planeta. Un porcentaje es una fracción de cien.');
      if (enDias) { datos.push('1 día = 24 h.'); paso('Pasamos el período a horas para comparar tiempos en la misma unidad.', [T, ` = ${f(c.T)} · 24 = `, val(horas, 'h', 'd')]); }
      paso('Por la segunda ley, la fracción del área barrida es igual a la fracción del período que pasó.', duracion ? [dt, ` = ${f(horas)} · ${f(c.porcentaje)}/100 h`] : [Ab, '/', At, ` = ${f(c.dt)}/${f(horas)}`]);
      terminar('Hacemos la cuenta. Esta proporción vale en cualquier parte de la órbita, cerca o lejos del planeta.');
      error('inversa', duracion ? horas * 100 / c.porcentaje : 100 * horas / c.dt, 'Bien comparadas las magnitudes, pero invertiste la fracción.');
      error('sin-cien', duracion ? horas * c.porcentaje : c.dt / horas, 'Bien formada la razón, pero faltó pasar de fracción a porcentaje, o al revés.');
      error('complemento', duracion ? horas - resultado : 100 - resultado, 'Bien calculada la fracción, pero elegiste el sector que falta para completar la vuelta.');
      error('doble', resultado * 2, 'Bien relacionados el área y el tiempo, pero agregaste un factor dos.');
      if (c.tipo === 'area-dias') error('sin-dias', 100 * c.dt / c.T, 'Bien hecha la división de tiempos, pero mezclaste horas con días.');
      if (duracion && enDias) error('sin-dias', c.T * c.porcentaje / 100, 'Bien usada la fracción, pero dejaste el período en días, y se piden horas.');
    } else if (['periodo', 'semieje-periodos', 'periodo-extremos', 'periodo-sector', 'sector-semieje'].includes(c.tipo)) {
      unidad = c.uTiempo || 'días'; color = 'd'; simbolo = TB; simboloTexto = 'T_B';
      let aa = c.aA, ab = c.aB, tb = c.TB;
      datos.push(ley3, 'a es el semieje mayor; no se reemplaza por la separación instantánea al foco.');
      if (c.uLong === 'UA') datos.push('UA: unidad astronómica, una distancia fija (1 UA ≈ 150 millones de km).');
      if (c.tipo === 'periodo-extremos') {
        ab = (c.rp + c.ra) / 2; datos.push([aB, ' = (', rp, ' + ', ra, ')/2'], 'En este caso, todas las separaciones se expresan en millones de kilómetros.');
        enunciado = ['A tiene período ', val(c.TA, unidad, 'd'), ' y semieje ', val(aa, 'millones de km', 'i'), '. B se acerca hasta ', val(c.rp, 'millones de km', 'i'), ' del centro y se aleja hasta ', val(c.ra, 'millones de km', 'i'), '. ¿Cuál es el período de B?'];
        paso('El semieje de B es la mitad de la suma de sus separaciones extremas.', [aB, ` = (${f(c.rp)} + ${f(c.ra)})/2 = `, val(ab, 'millones de km', 'i')]);
      } else if (c.tipo === 'periodo-sector') {
        datos.push(ley2); enunciado = ['A tiene período ', val(c.TA, unidad, 'd'), '. Sus semiejes son ', val(aa, 'millones de km', 'i'), ' y ', val(ab, 'millones de km', 'i'), '. ¿Cuánto tarda B en barrer el ', f(c.porcentaje), ' % de su área orbital?'];
      } else if (c.tipo === 'sector-semieje') {
        tb = c.dt * 100 / c.porcentaje; datos.push(ley2);
        enunciado = ['A tiene período ', val(c.TA, unidad, 'd'), ' y semieje ', val(aa, 'millones de km', 'i'), '. B barre el ', f(c.porcentaje), ' % de su área en ', val(c.dt, unidad, 'd'), '. ¿Cuál es el semieje mayor de B?'];
        paso('B barre esa fracción del área en ese tiempo, así que su período completo es el tiempo dividido entre la fracción.', [TB, ` = ${f(c.dt)} · 100/${f(c.porcentaje)} = `, val(tb, unidad, 'd')]);
      } else enunciado = c.tipo === 'periodo' ? ['A tiene período ', val(c.TA, unidad, 'd'), ' y semieje ', val(aa, c.uLong || 'millones de km', 'i'), '. B tiene semieje ', val(ab, c.uLong || 'millones de km', 'i'), '. ¿Cuál es el período de B?']
        : ['A tiene período ', val(c.TA, unidad, 'd'), ' y semieje ', val(aa, 'millones de km', 'i'), '. B tarda ', val(tb, unidad, 'd'), ' por vuelta. ¿Cuál es el semieje mayor de B?'];
      if (['semieje-periodos', 'sector-semieje'].includes(c.tipo)) {
        resultado = aa * Math.cbrt((tb / c.TA) ** 2); unidad = 'millones de km'; color = 'i'; simbolo = aB; simboloTexto = 'a_B';
        paso('Por la tercera ley, el cubo del semieje de B es el de A por la razón de períodos al cuadrado; luego sacamos la raíz cúbica.', [{ sup: [aB, 3] }, ` = ${f(aa)}³ · (${f(tb)}/${f(c.TA)})²`]);
        error('lineal', aa * tb / c.TA, 'Bien comparados los períodos, pero usaste una relación lineal, y la tercera ley usa cuadrados y cubos.');
        error('sin-raiz', aa * (tb / c.TA) ** 2, 'Bien elevada la razón al cuadrado, pero faltó sacar la raíz cúbica.');
        error('inversa', aa * Math.cbrt((c.TA / tb) ** 2), 'Bien usadas las potencias, pero invertiste la razón de períodos.');
        error('raiz-cuadrada', aa * Math.sqrt(tb / c.TA), 'Bien buscado el semieje, pero sacaste la raíz cuadrada de la razón, y la ley pide la raíz cúbica de su cuadrado.');
      } else {
        tb = period(c.TA, aa, ab); resultado = c.tipo === 'periodo-sector' ? tb * c.porcentaje / 100 : tb;
        paso('Por la tercera ley, elevamos al cubo la razón de semiejes, sacamos la raíz cuadrada y multiplicamos por el período de A.', [TB, ` = ${f(c.TA)} · √((${f(ab)}/${f(aa)})³)`, exacto(tb) ? ' = ' : ' ≈ ', val(tb, unidad, 'd')]);
        if (c.tipo === 'periodo-sector') { simbolo = dt; simboloTexto = 'Δt'; paso('Por la segunda ley, barrer esa fracción del área toma la misma fracción del período.', [dt, ` = ${f(tb)} · ${f(c.porcentaje)}/100`, exacto(resultado) ? ' = ' : ' ≈ ', val(resultado, unidad, 'd')]); }
        const k = ab / aa, factorSector = c.tipo === 'periodo-sector' ? c.porcentaje / 100 : 1;
        error('lineal', c.TA * k * factorSector, 'Bien comparados los semiejes, pero usaste una relación lineal, y la tercera ley usa cuadrados y cubos.');
        error('raiz-simple', c.TA * Math.sqrt(k) * factorSector, 'Bien sacada una raíz, pero olvidaste elevar al cubo la razón de semiejes.');
        error('cuadrado', c.TA * k * k * factorSector, 'Bien comparadas las órbitas, pero elevaste la razón de semiejes al cuadrado; la ley pide su cubo y después la raíz.');
        error('inversa', c.TA * Math.sqrt((1 / k) ** 3) * factorSector, 'Bien usados el cubo y la raíz, pero invertiste la razón de semiejes.');
        if (c.tipo === 'periodo-extremos') error('radio-instantaneo', period(c.TA, aa, c.ra), 'Bien usada la tercera ley, pero tomaste la separación máxima como si fuera el semieje.');
      }
      if (c.tipo !== 'periodo-sector') terminar('Hacemos la cuenta. La comparación vale porque las dos órbitas giran alrededor del mismo cuerpo central.');
    } else if (['rapidez', 'rapidez-alturas'].includes(c.tipo)) {
      const rrP = c.tipo === 'rapidez-alturas' ? c.R + c.hp : c.rp, rrA = c.tipo === 'rapidez-alturas' ? c.R + c.ha : c.ra;
      resultado = c.vp * rrP / rrA; unidad = 'km/s'; color = 'o'; simbolo = va; simboloTexto = 'v_lejos';
      datos.push(extremos, 'Los subíndices cerca y lejos marcan los extremos de la órbita. Solo allí la velocidad es perpendicular al radio.');
      if (c.tipo === 'rapidez-alturas') {
        datos.push([r, ' = ', R, ' + ', h]);
        enunciado = ['Un planeta tiene radio ', val(c.R, 'km', 'i'), '. Una sonda pasa a alturas extremas de ', val(c.hp, 'km', 'i'), ' y ', val(c.ha, 'km', 'i'), '. En el punto más cercano lleva ', val(c.vp, 'km/s', 'o'), '. ¿Qué rapidez lleva en el más lejano?'];
        paso('Sumamos el radio del planeta a cada altura para medir desde el centro.', [rp, ` = ${f(rrP)} km; `, ra, ` = ${f(rrA)} km`]);
      } else enunciado = ['La separación entre una sonda y el centro del planeta varía entre ', val(c.rp, 'km', 'i'), ' y ', val(c.ra, 'km', 'i'), '. En el punto más cercano lleva ', val(c.vp, 'km/s', 'o'), '. ¿Cuál es su rapidez en el punto más lejano?'];
      paso('Como se barren áreas iguales en tiempos iguales, en los extremos la separación por la rapidez vale lo mismo cerca y lejos.', [va, ` = ${f(c.vp)} · ${f(rrP)}/${f(rrA)}`]); terminar('Comprobamos el sentido: lejos del planeta, la sonda va más lenta.');
      error('inversa', c.vp * rrA / rrP, 'Bien usados los dos extremos, pero invertiste la razón de separaciones.');
      error('constante', c.vp, 'Bien conservado el dato, pero en una elipse la rapidez no es constante: es menor lejos del planeta.');
      error('raiz', c.vp * Math.sqrt(rrP / rrA), 'Bien comparadas las separaciones, pero usaste la raíz de una órbita circular, y esta órbita es una elipse.');
      error('cuadrado', c.vp * (rrP / rrA) ** 2, 'Bien formada la razón, pero la elevaste al cuadrado.');
      if (c.tipo === 'rapidez-alturas') error('solo-alturas', c.vp * c.hp / c.ha, 'Bien identificadas las alturas, pero faltó sumarles el radio del planeta para medir desde el centro.');
    } else throw new Error(`Caso Kepler desconocido: ${c.tipo}`);
    const vistos = new Set([textoValor(resultado, unidad)]);
    const err = errores.filter(e => { const t = textoValor(e.valor, unidad); if (!Number.isFinite(e.valor) || vistos.has(t)) return false; vistos.add(t); return true; })
      .map(e => ({ ...e, texto: textoValor(e.valor, unidad), error: `GR5-${e.id.toUpperCase()}`, siFuera: `${e.causa} Así sale ${textoValor(e.valor, unidad)}.` }));
    return { enunciado, datos, solucion, resultado, unidad, color, simboloTexto, respuesta: ecuacion(simbolo, resultado, unidad, color), errores: err,
      dibujo: figura(c), verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado: !exacto(resultado) }, errores: err.map(e => ({ id: e.id, valor: e.valor })) } };
  }
  const fijos = [
    { tipo: 'cercano', nivel: 1, titulo: 'El extremo más cercano', a: 12000, e: 0.25 },
    { tipo: 'lejano', nivel: 1, titulo: 'El extremo más lejano', a: 15000, e: 0.4 },
    { tipo: 'semieje', nivel: 1, titulo: 'El semieje desde ambos extremos', rp: 6000, ra: 18000 },
    { tipo: 'area', nivel: 1, titulo: 'Una parte del área orbital', T: 30, dt: 3 },
    { tipo: 'periodo', nivel: 1, titulo: 'Otra órbita, la misma fuente', TA: 7, aA: 3, aB: 12 },
    { tipo: 'excentricidad', nivel: 2, titulo: 'Cuánto se aparta del círculo', rp: 8000, ra: 24000 },
    { tipo: 'area-dias', nivel: 2, titulo: 'Comparar horas con días', T: 3, dias: true, dt: 9 },
    // Auditoría (26 nov): el nivel 2 era un solo paso (36 h · 15 %), más fácil que el semieje del nivel 1; ahora convierte días.
    { tipo: 'duracion', nivel: 2, titulo: 'Del área al reloj', T: 1.5, dias: true, porcentaje: 15 },
    { tipo: 'semieje-periodos', nivel: 2, titulo: 'El semieje a partir del período', TA: 5, TB: 40, aA: 6 },
    { tipo: 'rapidez', nivel: 2, titulo: 'La rapidez en el extremo lejano', rp: 9000, ra: 27000, vp: 12 },
    { tipo: 'periodo-extremos', nivel: 3, titulo: 'Los extremos no son el semieje', TA: 6, aA: 2, rp: 4, ra: 12 },
    { tipo: 'rapidez-alturas', nivel: 3, titulo: 'De la altura al centro', R: 3000, hp: 2000, ha: 12000, vp: 9 },
    { tipo: 'periodo-sector', nivel: 3, titulo: 'Comparar órbitas y medir un sector', TA: 12, aA: 5, aB: 20, porcentaje: 25 },
    { tipo: 'sector-semieje', nivel: 3, titulo: 'Reconstruir la órbita con un sector', TA: 4, aA: 3, dt: 8, porcentaje: 25 },
    { tipo: 'periodo-extremos', nivel: 3, titulo: 'Una órbita interior de comparación', TA: 54, aA: 18, rp: 5, ra: 11 },
  ];
  let posicion = 0;
  const ejemplos = fijos.map(c => {
    const z = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: z.enunciado, datos: z.datos, figura: z.dibujo, solucion: z.solucion,
      respuesta: z.respuesta, verificacion: z.verificacion };
    if (c.nivel === 3) {
      if (z.errores.length < 4) throw new Error('Faltan distractores Kepler.');
      const acierto = posicion++, seleccion = z.errores.slice(0, 4);
      e.alternativas = seleccion.map(x => x.texto); e.alternativas.splice(acierto, 0, textoValor(z.resultado, z.unidad));
      const motivos = { lineal: 'usas una relación lineal', 'raiz-simple': 'olvidas el cubo', cuadrado: 'elevas la razón al cuadrado', inversa: 'inviertes la razón',
        constante: 'supones la rapidez constante', raiz: 'usas la raíz de la órbita circular', 'sin-raiz': 'olvidas la raíz cúbica', 'raiz-cuadrada': 'usas una raíz cuadrada',
        'radio-instantaneo': 'tomas la separación máxima como semieje', 'solo-alturas': 'olvidas sumar el radio del planeta' };
      // Auditoría (26 nov): A y B son los cuerpos de estos ejemplos; las alternativas se explican por su valor.
      e.solucion.push({ texto: seleccion.flatMap(er => [{ negrita: er.texto.replace(/^≈ /, '') }, ` sale si ${motivos[er.id]}. `]) });
    }
    return e;
  });
  function entrada(semilla, resuelto) {
    const s = Math.abs(Math.trunc(semilla)), tipos = ['cercano', 'lejano', 'semieje', 'excentricidad', 'area', 'duracion', 'area-dias', 'periodo', 'semieje-periodos', 'rapidez', 'periodo-extremos', 'rapidez-alturas', 'periodo-sector', 'sector-semieje'];
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla.
    const tipo = tipos[(s + (resuelto ? 0 : 7)) % tipos.length], k = Math.floor(s / tipos.length) % 11, j = Math.floor(s / 154) % 7, z = resuelto ? 50 : 10;
    if (['cercano', 'lejano'].includes(tipo)) return { tipo, a: (z + k + 0.25) * 1000, e: [0.2, 0.4, 0.6][j % 3] };
    if (['semieje', 'excentricidad'].includes(tipo)) return { tipo, rp: (z + k) * 1000, ra: (z + k) * (3 + j) * 1000 };
    if (tipo === 'area') return { tipo, T: z + k + 30, dt: 2 + j };
    if (tipo === 'duracion') return { tipo, T: z + k + 30, porcentaje: 10 + 5 * j };
    if (tipo === 'area-dias') return { tipo, T: z + k, dias: true, dt: 3 + 2 * j };
    if (tipo === 'periodo') return { tipo, TA: z + k + 1, aA: 7 + j, aB: (7 + j) * 4 };
    if (tipo === 'semieje-periodos') return { tipo, TA: z + k + 1, TB: (z + k + 1) * 8, aA: 7 + j };
    if (tipo === 'rapidez') return { tipo, rp: (z + k) * 1000, ra: (z + k) * 4000, vp: 7 + j };
    if (tipo === 'periodo-extremos') return { tipo, TA: z + k + 1, aA: 7 + j, rp: (7 + j) * 2, ra: (7 + j) * 6 };
    if (tipo === 'rapidez-alturas') return { tipo, R: (z + k) * 100, hp: (z + k) * 200, ha: (z + k) * 800, vp: 7 + j };
    if (tipo === 'periodo-sector') return { tipo, TA: z + k + 1, aA: 7 + j, aB: (7 + j) * 4, porcentaje: 15 + 5 * j };
    return { tipo, TA: z + k + 1, aA: 7 + j, dt: (z + k + 1) * 2, porcentaje: 25 };
  }
  function generar(s, resuelto) {
    const z = caso(entrada(s, resuelto));
    if (resuelto) return { enunciado: z.enunciado, datos: z.datos, dibujo: z.dibujo, respuesta: z.respuesta, verificacion: z.verificacion,
      pasos: [{ tipo: 'pide', texto: 'Identificamos la magnitud pedida y sus unidades.' }, { tipo: 'regla', texto: 'Según los datos, usamos la forma de la elipse, la ley de las áreas o la comparación de períodos.' },
        ...z.solucion.map(x => ({ tipo: 'cuentas', ...x }))] };
    if (z.errores.length < 3) throw new Error('Faltan opciones Kepler.');
    return { pregunta: z.enunciado, datos: z.datos, dibujo: z.dibujo, verificacion: z.verificacion,
      opciones: [{ id: 'c', texto: textoValor(z.resultado, z.unidad), correcta: true }, ...z.errores.slice(0, 3).map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      solucion: { texto: 'Medimos las separaciones desde el planeta, que está en un foco, y recordamos que el semieje describe toda la órbita.', ecuacion: z.solucion.at(-1).ecuacion } };
  }
  const predDatos = { tipo: 'periodo', circulares: true, TA: 3, aA: 2, aB: 8, uTiempo: 'años', uLong: 'UA' }, pred = caso(predDatos);
  const idea = {
    id: 'leyes-de-kepler', titulo: 'Leyes de Kepler', pregunta: '¿Cómo describimos una órbita que se acerca y se aleja del planeta?',
    aprendizaje: 'Relacionas la forma, el área barrida y el período de órbitas alrededor del mismo astro central.',
    actividad: 'Mover una sonda en una elipse y comparar el área barrida durante distintos intervalos.', temas: ['Leyes de Kepler'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'La órbita no siempre es circular', texto: 'Una elipse es una curva cerrada con dos puntos especiales, los focos: desde cualquier punto de la curva, la suma de las distancias a los dos focos es la misma. El planeta está en un foco, no en el centro de la elipse.', dibujo: juegoFigura({ inicio: 0, duracion: 1, u: 0.5 }, false) },
      { titulo: 'Una medida de toda la órbita', texto: ['El semieje mayor ', a, ' es la mitad del diámetro más largo de la elipse, y ', b, ', la mitad del más corto. La excentricidad e dice cuánto se aparta la elipse de un círculo. Durante la vuelta, la separación ', r, ' al planeta cambia, pero ', a, ' no.'] },
      { titulo: 'Un reloj y una región', texto: ['Al moverse la sonda, la línea que la une con el planeta barre un área. El período ', T, ' es el tiempo de una vuelta. En el juego eliges un intervalo ', dt, ' y dónde empieza, y miras la región que queda pintada.'] },
    ] },
    juega: { consigna: 'Elige cuánto dura el intervalo y dónde comienza. Reproduce el movimiento y compara el sector barrido con toda la elipse.',
      voz: 'Sigue la sonda y la región pintada; el planeta permanece en un foco.',
      controles: [{ id: 'duracion', etiqueta: 'Duración del intervalo', min: 1, max: 5, paso: 1, inicio: 1, unidad: 'h', decimales: 0, color: 'c-d' },
        { id: 'inicio', etiqueta: 'Lugar de inicio', opciones: [{ valor: 0, texto: 'Extremo cercano' }, { valor: 5, texto: 'Tramo inferior' }, { valor: 10, texto: 'Extremo lejano' }, { valor: 15, texto: 'Tramo superior' }], inicio: 0 },
        { id: 'u', etiqueta: 'Avance dentro del intervalo (0: al empezar; 1: al terminar)', min: 0, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } }],
      mision: { texto: 'Haz que el sector cubra la quinta parte del área orbital.', logrado: c => Math.abs(sector(c.inicio, c.duracion, 4).fraccion - 0.2) < 1e-12,
        testigo: [{ inicio: 0, duracion: 4, u: 0.5 }], bien: 'Coincide: el sector cubre la quinta parte del área, empiece donde empiece.' },
      dibujo: c => juegoFigura(c), lectura: c => `En ${f(c.duracion)} h barre ${f(c.duracion / base.periodoHoras * 100)} % del área.`,
      leyenda: [{ s: a, t: 'semieje mayor de la elipse, en kilómetros' }, { s: R, t: 'radio del planeta, en kilómetros' }, { s: T, t: 'tiempo de una vuelta, en horas' }, { s: 'e', t: 'excentricidad, sin unidades' }], minimo: 2 },
    predice: { pregunta: 'Dos cuerpos describen órbitas circulares alrededor de la misma estrella. ¿Cuál será el período de B?',
      datos: ['La masa de cada cuerpo es despreciable frente a la estrella; solo actúa su gravedad.', [TA, ' = ', val(3, 'años', 'd'), '; ', aA, ' = ', val(2, 'UA', 'i'), '; ', aB, ' = ', val(8, 'UA', 'i')],
        'UA: unidad astronómica, una distancia fija (1 UA ≈ 150 millones de km).', 'Ambas órbitas son circulares: el semieje mayor de cada círculo coincide con su radio.'],
      dibujo: figura(predDatos), revelar: figura({ ...predDatos, resultado: pred.resultado, simboloTexto: 'T_B', unidad: 'años', color: 'd' }, true),
      opciones: [{ id: 'c', texto: textoValor(pred.resultado, 'años'), correcta: true }, ...pred.errores.slice(0, 3).map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      coincide: 'El período no aumenta en la misma proporción que el semieje: intervienen un cubo y una raíz.', verificacion: pred.verificacion },
    mira: { pieza: 'fis-gravitacion', datos: { ...figura(predDatos).datos, cortes: [figura(predDatos).datos, figura({ ...predDatos, resultado: pred.resultado, simboloTexto: 'T_B', unidad: 'años', color: 'd' }, true).datos] },
      pasos: [{ estado: { corte: 0 }, texto: 'Primera ley: cada órbita es una elipse con la estrella en uno de sus focos.', ecuacion: [a, ': tamaño fijo de la elipse; ', r, ': separación que cambia'] },
        { estado: { corte: 0 }, texto: 'Segunda ley: en una misma órbita, la fracción de área barrida es igual a la fracción del período.', ecuacion: ley2 },
        { estado: { corte: 0 }, texto: 'Tercera ley: en dos órbitas del mismo astro, los cuadrados de los períodos van como los cubos de los semiejes.', ecuacion: ley3 },
        { estado: { corte: 1 }, texto: 'Despejamos el período de B: con un semieje cuatro veces mayor, el período no se multiplica por cuatro.', ecuacion: [TB, ' = 3 · √((8/2)³) = ', val(pred.resultado, 'años', 'd')] }] },
    // Auditoría (26 nov): «Así se resuelve» y «Ahora tú» piden los extremos con a y e; la regla no los decía.
    regla: { texto: 'El astro está en un foco y la separación cambia entre los dos extremos. La sonda barre áreas iguales en tiempos iguales, así que su rapidez es mayor cerca del astro. Los períodos se comparan con los semiejes mayores.',
      ecuacion: [...ley3, '; ', rp, ' = ', a, ' · (1 − e); ', ra, ' = ', a, ' · (1 + e)'], condicion: 'hay un solo astro central fijo, con masas que giran despreciables frente a él y solo gravedad; en los extremos, la separación por la rapidez es igual cerca y lejos.',
      voz: 'El semieje pertenece a toda la elipse; la separación al foco cambia durante la vuelta.',
      dibujo: juegoFigura({ inicio: 10, duracion: 2, u: 0.5 }) },
    ejemplos, resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) }, ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'elipse', simple: 'Una curva cerrada definida por dos puntos llamados focos.', def: 'Curva cuyos puntos mantienen constante la suma de sus distancias a dos focos.', ejemplos: ['Un hilo tenso alrededor de dos chinches ayuda a trazar una elipse.', 'El círculo es un caso particular en que ambos focos coinciden.', 'El planeta de este modelo ocupa un foco de la elipse.'] },
    { termino: 'semieje mayor', simbolo: 'a', medida: 'm', simple: 'La mitad del diámetro más largo de una elipse.', def: 'Distancia del centro geométrico a un extremo del diámetro mayor. Describe el tamaño de toda la elipse.', ejemplos: ['Dos semiejes mayores forman el diámetro mayor.', 'Se mide desde el centro geométrico de la elipse.', 'No cambia al mover la sonda por una misma órbita.'] },
    { termino: 'área barrida', simbolo: 'S_barrida', medida: 'm²', simple: 'La región que recorre la línea del planeta a la sonda.', def: 'Área limitada por dos posiciones de la línea al foco y el arco orbital entre ellas.', ejemplos: ['Al avanzar la sonda, aparece un sector de la órbita.', 'El borde del sector incluye dos segmentos que parten del planeta.', 'Una vuelta completa barre toda el área de la elipse.'] },
    { termino: 'excentricidad', simbolo: 'e', simple: 'Un número que describe cuánto se aparta una elipse del círculo.', def: 'Distancia del centro geométrico a un foco dividida entre el semieje mayor. Una elipse cumple 0 ≤ e < 1.', ejemplos: ['Una circunferencia tiene excentricidad cero.', 'La excentricidad no tiene unidades.', 'Una elipse más alargada tiene mayor excentricidad.'] },
  ];
  const letras = { a: 'semieje mayor de la órbita elíptica', b: 'semieje menor de la órbita elíptica', e: 'excentricidad, sin unidades', r: 'separación entre centros', R: 'radio del planeta', h: 'altura sobre la superficie',
    T: 'período orbital', t: 'tiempo', Δt: 'duración del intervalo', a_A: 'semieje mayor de la órbita A', a_B: 'semieje mayor de la órbita B', T_A: 'período de A', T_B: 'período de B',
    r_cerca: 'distancia mínima al centro, en el extremo cercano', r_lejos: 'distancia máxima al centro, en el extremo lejano', v: 'rapidez', v_cerca: 'rapidez en el extremo cercano', v_lejos: 'rapidez en el extremo lejano', h_cerca: 'altura en el extremo cercano', h_lejos: 'altura en el extremo lejano',
    S: 'área', S_barrida: 'área barrida desde el foco', S_total: 'área total de la elipse', M: 'masa de la fuente dominante', m: 'masa de la sonda' };
  return { idea, glosario, letras };
}

function construirGr6(Kit) {
  'use strict';
  // Salidas radiales hacia afuera, sin aire ni propulsión posterior.
  // Todos los parámetros son de modelos didácticos; el cálculo conserva energía.
  const q = (c, t) => ({ v: `c-${c}`, t: String(t) }), sub = (a, b) => ({ sub: [a, b] });
  const r = q('i', 'r'), R = q('i', 'R'), h = q('i', 'h'), v = q('o', 'v'), m = q('f', 'm');
  const ve = sub(v, 'esc'), vi = sub(v, 'inf'), v0 = sub(v, '0'), vc = sub(v, 'c');
  const EP = sub('E', 'PG'), EC = sub('E', 'C'), EM = sub('E', 'M');
  const fmt = x => Kit.formatear(Math.abs(x) < 1e-12 ? 0 : x, 3);
  const sup = x => String(x).replace(/[-0123456789]/g, c => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' })[c]);
  const numero = x => {
    if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001)) {
      const e = Math.floor(Math.log10(Math.abs(x))); return `${fmt(x / 10 ** e)} × 10${sup(e)}`;
    }
    return fmt(x);
  };
  const exacto = x => {
    if (!Number.isFinite(x)) return false;
    const e = x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001) ? Math.floor(Math.log10(Math.abs(x))) : 0;
    return Math.abs(x - Math.round(x / 10 ** e * 1000) / 1000 * 10 ** e) <= Math.max(Math.abs(x), 1e-200) * 1e-12;
  };
  const cantidad = (x, u, c = 'o') => q(c, `${numero(x)} ${u}`), opcion = (x, u) => `${exacto(x) ? '' : '≈ '}${numero(x)} ${u}`;
  const radio = c => c.r == null ? c.R + c.h : c.r;
  const escape = (GM, rr) => Math.sqrt(2 * GM / rr);
  const energia = (GM, masa, rr, rapidez) => masa * rapidez ** 2 / 2 - GM * masa / rr;
  const leyEP = [EP, ' = −', { frac: [['GM · ', m], r] }], leyEC = [EC, ' = ', { frac: [[m, ' · ', { sup: [v, 2] }], 2] }];
  const leyEnergia = [EM, ' = ', EC, ' + ', EP, '; ', sub('E', 'M,inicial'), ' = ', sub('E', 'M,final')];
  const leyEscape = [ve, ' = ', { raiz: [{ frac: ['2 · GM', r] }] }];
  const condiciones = 'Sale desde fuera, en línea recta hacia afuera. Planeta fijo, sonda de masa despreciable, sin aire ni empuje; cero en el infinito.';

  function figura(c, revelar = false) {
    const notas = [];
    if (c.GM != null) notas.push({ texto: `GM = ${numero(c.GM)} m³/s²` });
    if (c.R != null) notas.push({ texto: `R = ${numero(c.R / 1000)} km`, color: 'i' });
    if (c.h != null) notas.push({ texto: `h = ${numero(c.h / 1000)} km`, color: 'i' });
    if (c.v0 != null) notas.push({ texto: `v_0 = ${numero(c.v0 / 1000)} km/s`, color: 'o' });
    if (c.vesc != null) notas.push({ texto: `v_{esc} = ${numero(c.vesc / 1000)} km/s`, color: 'o' });
    if (c.vc != null) notas.push({ texto: `v_c = ${numero(c.vc / 1000)} km/s`, color: 'o' });
    if (c.vRef != null) notas.push({ texto: `v_{esc,ref} = ${numero(c.vRef / 1000)} km/s`, color: 'o' });
    // Auditoría (26 nov): «M nueva: 1 veces» sonaba raro; un factor 1 no se escribe.
    if (c.kr != null && c.kr !== 1) notas.push({ texto: `r_nuevo = ${numero(c.kr)} · r_ref`, color: 'i' });
    if (c.kM != null && c.kM !== 1) notas.push({ texto: `M_nueva = ${numero(c.kM)} · M_ref`, color: 'f' });
    if (c.km != null && c.km !== 1) notas.push({ texto: `m_nueva = ${numero(c.km)} · m_ref`, color: 'f' });
    if (c.kg != null) notas.push({ texto: `Campo superficial: ${numero(c.kg)} veces` });
    if (c.kR != null) notas.push({ texto: `Radio planetario: ${numero(c.kR)} veces`, color: 'i' });
    if (c.rFinal != null) notas.push({ texto: `Posición final: ${numero(c.rFinal / 1000)} km`, color: 'i' });
    notas.push({ texto: 'Salida radial hacia afuera.' }, { texto: 'Esquema sin escala.' });
    if (revelar) notas.push({ texto: `${c.simboloTexto} ${exacto(c.resultado) ? '=' : '≈'} ${numero(c.resultado)} ${c.unidad}`, color: c.color || 'o' });
    const rr = radio(c);
    // Auditoría (26 nov): una salida desde la superficie se dibuja en la superficie, y «r_0 = ?» solo va cuando se pide r_0.
    const superficie = c.tipo === 'dos-planetas', xs = superficie ? 0.95 : 3.5;
    const cota = Number.isFinite(rr) && !['radio', 'radio-altura'].includes(c.tipo) ? `r_0 = ${numero(rr / 1000)} km` : c.tipo === 'radio' ? 'r_0 = ?' : superficie ? 'r_0 = R' : c.kr != null && (c.kM == null || c.kM === 1) ? `r_0 = ${numero(c.kr)} R` : 'r_0';
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.3, x1: 6.3, y0: -1.4, y1: 1.4 }, altoGrafico: 132, escalas: { v: 0.003 },
      paneles: [{ titulo: 'Condiciones de salida', modo: 'escape', planeta: { c: [0, 0], R: 0.7, rotulo: 'M', colorRotulo: 'f' },
        satelite: { c: [xs, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 }, trayectoria: [[xs, 0], [5.7, 0]],
        flechas: c.v0 != null ? [{ de: [xs, 0], d: [c.v0, 0], familia: 'v', color: 'o', rotulo: 'v_0' }] : [],
        cotas: superficie ? [] : [{ de: [0, 0], a: [xs, 0], texto: cota, color: 'i' }], notas }],
      alt: 'Un planeta y una sonda que sale radialmente hacia afuera. El trazo indica la dirección de salida, no su alcance ni una evolución temporal. Esquema sin escala.' }, estado: {} };
  }
  function juegoFigura(vKm, mostrar = true) {
    const velocidades = [6000, vKm * 1000], GM = 4e14, rr = 8e6, masa = 100;
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.4, x1: 5.8, y0: -1.4, y1: 1.4 }, altoGrafico: 132, escalas: { v: 0.004 },
      paneles: velocidades.map((rapidez, i) => {
        const E = energia(GM, masa, rr, rapidez), estado = E < -1e-5 ? 'Se detiene y luego regresa.' : 'Se aleja sin límite.';
        return { titulo: i ? 'Ensayo elegido' : 'Referencia', modo: 'escape', planeta: { c: [0, 0], R: 0.8, rotulo: 'M', colorRotulo: 'f' },
          satelite: { c: [2.5, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
          flechas: [{ de: [2.5, 0], d: [rapidez, 0], familia: 'v', color: 'o', rotulo: 'v_0' }],
          cotas: [{ de: [0, 0], a: [2.5, 0], texto: 'r_0 = 8000 km', color: 'i' }],
          notas: [{ texto: `v_0 = ${numero(rapidez / 1000)} km/s`, color: 'o' }, { texto: 'm = 100 kg', color: 'f' },
            { texto: 'GM = 4 × 10¹⁴ m³/s²' }, { texto: mostrar ? `E_M = ${numero(E / 1e9)} GJ` : 'E_M está por comparar.' },
            { texto: mostrar ? estado : 'Salida radial hacia afuera.' }, { texto: 'Instantánea de salida; sin escala.' }] };
      }), alt: 'La misma sonda se lanza radialmente hacia afuera con dos rapideces iniciales. Las flechas comparten escala. Se comparan estados iniciales, no recorridos en el tiempo.' }, estado: {} };
  }

  function caso(c) {
    let resultado, unidad = 'km/s', color = 'o', simbolo = ve, simboloTexto = 'v_{esc}', enunciado;
    const rr = radio(c), datos = [condiciones, '1 km = 1000 m; 1 km/s = 1000 m/s.'], solucion = [], errores = [];
    if (c.GM != null) datos.push(`GM = ${numero(c.GM)} m³/s²: G por la masa del planeta.`);
    datos.push(leyEscape);
    const error = (id, valor, causa) => errores.push({ id, valor, causa });
    const eq = (s, x, u = unidad, col = color) => [s, exacto(x) ? ' = ' : ' ≈ ', cantidad(x, u, col)];
    if (['umbral', 'altura'].includes(c.tipo)) {
      resultado = escape(c.GM, rr) / 1000;
      enunciado = c.tipo === 'altura'
        ? ['Una sonda sale desde ', cantidad(c.h / 1000, 'km', 'i'), ' de altura sobre un planeta de radio ', cantidad(c.R / 1000, 'km', 'i'), '. ¿Qué rapidez mínima necesita para no regresar?']
        : ['Una sonda parte a ', cantidad(rr / 1000, 'km', 'i'), ' del centro del planeta. ¿Qué rapidez inicial mínima permite alejarse sin regresar?'];
      if (c.tipo === 'altura') { datos.push([r, ' = ', R, ' + ', h]); solucion.push({ texto: 'La fórmula usa la distancia desde el centro, así que sumamos el radio y la altura.', ecuacion: [r, ` = ${numero(c.R / 1000)} + ${numero(c.h / 1000)} = `, cantidad(rr / 1000, 'km', 'i')] }); }
      solucion.push({ texto: 'Calculamos la rapidez de escape con la distancia en metros.', ecuacion: [ve, ' = ', { raiz: [{ frac: [`2 · (${numero(c.GM)})`, numero(rr)] }] }, ' m/s'] });
      solucion.push({ texto: 'Pasamos la rapidez a kilómetros por segundo.', ecuacion: eq(ve, resultado) });
      error('sin-dos', resultado / Math.SQRT2, 'Bien usados GM y la distancia, pero olvidaste el factor dos dentro de la raíz.');
      error('dos-fuera', resultado * Math.SQRT2, 'Bien sacada la raíz, pero dejaste el dos fuera de ella, y va dentro.');
      error('sin-km', resultado * 1000, 'Bien hallada la rapidez en metros por segundo, pero la diste como si fueran kilómetros por segundo.');
      error('sin-gravedad', 0, 'Bien reconocida la salida desde fuera del planeta, pero allí también actúa la gravedad.');
      if (c.tipo === 'altura') error('desde-superficie', escape(c.GM, c.h) / 1000, 'Bien usada la altura, pero la tomaste como distancia al centro, y falta sumarle el radio.');
    } else if (c.tipo === 'circular') {
      resultado = Math.SQRT2 * c.vc / 1000;
      enunciado = ['La rapidez circular a cierta distancia del centro es ', cantidad(c.vc / 1000, 'km/s'), '. ¿Cuál es la rapidez mínima de escape desde esa misma distancia?'];
      datos.push([vc, ' = ', { raiz: [{ frac: ['GM', r] }] }]);
      solucion.push({ texto: 'A la misma distancia, las dos fórmulas solo se diferencian en el factor dos dentro de la raíz.', ecuacion: [ve, ' = ', { raiz: [2] }, ' · ', vc] });
      solucion.push({ texto: 'Multiplicamos la rapidez circular por la raíz de dos.', ecuacion: eq(ve, resultado) });
      error('igual-circular', c.vc / 1000, 'Bien mantenida la misma distancia, pero diste la rapidez circular, y la de escape es mayor.');
      error('doble-circular', 2 * c.vc / 1000, 'Bien buscado un valor mayor, pero multiplicaste por dos fuera de la raíz.');
      error('divide-raiz', c.vc / Math.SQRT2 / 1000, 'Bien usada la raíz de dos, pero dividiste en vez de multiplicar.');
      error('cero', 0, 'Bien distinguido el lanzamiento, pero la gravedad sigue actuando, así que hace falta rapidez para escapar.');
    } else if (['razon', 'otra-masa', 'dos-planetas'].includes(c.tipo)) {
      if (c.tipo === 'razon') {
        resultado = c.vRef * Math.sqrt(c.kM / c.kr) / 1000;
        enunciado = ['La rapidez de escape inicial es ', cantidad(c.vRef / 1000, 'km/s'), '. La masa del planeta se multiplica por ', numero(c.kM), ' y la distancia de salida al centro, por ', numero(c.kr), '. ¿Cuál es la nueva rapidez de escape?'];
        datos.push('Cada factor multiplica la magnitud inicial correspondiente; ambas salidas cumplen las mismas condiciones.');
        solucion.push({ texto: 'Los factores de masa y de distancia quedan dentro de la misma raíz: la masa multiplica y la distancia divide.', ecuacion: [sub(v, 'esc,nueva'), ' = ', sub(v, 'esc,ref'), ' · ', { raiz: [{ frac: [numero(c.kM), numero(c.kr)] }] }] });
        error('lineal', c.vRef * c.kM / c.kr / 1000, 'Bien formado el cociente, pero faltó sacar la raíz.');
        error('directa-radio', c.vRef * Math.sqrt(c.kM * c.kr) / 1000, 'Bien considerada la masa, pero multiplicaste por la raíz del factor de distancia en vez de dividir.');
        error('sin-radio', c.vRef * Math.sqrt(c.kM) / 1000, 'Bien considerada la masa del planeta, pero olvidaste el cambio de distancia.');
        error('sin-masa', c.vRef / Math.sqrt(c.kr) / 1000, 'Bien incluida la distancia, pero olvidaste el cambio de masa del planeta.');
        error('sin-cambios', c.vRef / 1000, 'Bien leída la referencia, pero no aplicaste los cambios.');
        error('signo', -resultado, 'Bien hallado el tamaño, pero una rapidez nunca es negativa.');
      } else if (c.tipo === 'otra-masa') {
        resultado = c.vRef / 1000;
        enunciado = ['Una sonda necesita ', cantidad(c.vRef / 1000, 'km/s'), ' para escapar desde cierta posición. Otra sonda tiene ', numero(c.km), ' veces su masa. ¿Qué rapidez mínima necesita desde el mismo lugar?'];
        datos.push([EC, ' = ', { frac: [[m, ' · ', { sup: [v, 2] }], 2] }, '; ', EP, ' = −GM · ', m, ' / ', r]);
        solucion.push({ texto: 'La masa de la sonda está en las dos energías y se cancela al pedir que la energía total sea cero.', ecuacion: eq(ve, resultado) });
        error('masa-lineal', resultado * c.km, 'Bien distinguidas las sondas, pero multiplicaste por su cambio de masa, y la masa de la sonda se cancela.');
        error('masa-raiz', resultado * Math.sqrt(c.km), 'Bien usada una raíz, pero metiste en ella la masa de la sonda, que se cancela.');
        error('masa-inversa', resultado / c.km, 'Bien comparadas las masas, pero dividiste la rapidez entre ese factor, que no interviene.');
        error('cero', 0, 'Bien distinguidas las sondas, pero la segunda también siente la gravedad del planeta.');
      } else {
        resultado = c.vRef * Math.sqrt(c.kg * c.kR) / 1000;
        enunciado = ['Desde la superficie de un planeta, la rapidez de escape es ', cantidad(c.vRef / 1000, 'km/s'), '. Otro planeta tiene ', numero(c.kg), ' veces su campo superficial y ', numero(c.kR), ' veces su radio. ¿Cuál es la rapidez de escape desde su superficie?'];
        datos.push([sub('g', '0'), ' = GM / ', { sup: [R, 2] }, '; la salida desde la superficie tiene ', r, ' = ', R]);
        solucion.push({ texto: 'Con el campo de la superficie, GM es ese campo por el radio al cuadrado; lo reemplazamos en la rapidez de escape.', ecuacion: [ve, ' = ', { raiz: [['2 · ', sub('g', '0'), ' · ', R]] }] });
        solucion.push({ texto: 'Los factores de campo y de radio quedan multiplicándose dentro de la raíz.', ecuacion: [sub(v, 'esc,nueva'), ' = ', sub(v, 'esc,ref'), ' · ', { raiz: [`${numero(c.kg)} · ${numero(c.kR)}`] }] });
        error('radio-inverso', c.vRef * Math.sqrt(c.kg / c.kR) / 1000, 'Bien incluido el campo, pero dividiste entre el factor de radio en vez de multiplicar.');
        error('lineal', c.vRef * c.kg * c.kR / 1000, 'Bien combinados los dos factores, pero faltó sacar la raíz.');
        error('solo-campo', c.vRef * Math.sqrt(c.kg) / 1000, 'Bien incluido el campo, pero olvidaste el cambio de radio.');
        error('solo-radio', c.vRef * Math.sqrt(c.kR) / 1000, 'Bien incluido el radio, pero olvidaste el cambio de campo.');
      }
      if (c.tipo !== 'otra-masa') solucion.push({ texto: 'Calculamos la nueva rapidez sin redondear los pasos intermedios.', ecuacion: eq(ve, resultado) });
    } else if (['residual', 'residual-altura', 'rapidez-finita'].includes(c.tipo)) {
      const limite2 = c.v0 ** 2 - 2 * c.GM / rr;
      if (limite2 <= 0) throw new Error('La rapidez residual de este caso debe ser positiva.');
      const final2 = limite2 + (c.tipo === 'rapidez-finita' ? 2 * c.GM / c.rFinal : 0);
      resultado = Math.sqrt(final2) / 1000; simbolo = c.tipo === 'rapidez-finita' ? sub(v, 'final') : vi; simboloTexto = c.tipo === 'rapidez-finita' ? 'v_{final}' : 'v_{inf}';
      if (c.tipo === 'residual-altura') enunciado = ['Una sonda parte con ', cantidad(c.v0 / 1000, 'km/s'), ' desde ', cantidad(c.h / 1000, 'km', 'i'), ' de altura. El radio planetario es ', cantidad(c.R / 1000, 'km', 'i'), '. ¿A qué rapidez tiende muy lejos?'];
      else if (c.tipo === 'rapidez-finita') enunciado = ['Una sonda sale con ', cantidad(c.v0 / 1000, 'km/s'), ' desde ', cantidad(rr / 1000, 'km', 'i'), ' del centro. ¿Qué rapidez tiene al alcanzar ', cantidad(c.rFinal / 1000, 'km', 'i'), ' del centro?'];
      else enunciado = ['Una sonda parte a ', cantidad(rr / 1000, 'km', 'i'), ' del centro con ', cantidad(c.v0 / 1000, 'km/s'), '. ¿A qué rapidez tiende cuando se aleja sin límite?'];
      datos.pop(); datos.push(leyEP, [leyEC, '; ', leyEnergia]);
      if (c.tipo === 'residual-altura') datos.push([r, ' = ', R, ' + ', h]);
      else datos.push('Cuando la separación crece sin límite, la energía potencial tiende a cero.');
      if (c.tipo === 'residual-altura') solucion.push({ texto: 'Sumamos el radio y la altura para tener la distancia de salida al centro.', ecuacion: [sub(r, '0'), ` = ${numero(c.R / 1000)} + ${numero(c.h / 1000)} = `, cantidad(rr / 1000, 'km', 'i')] });
      solucion.push({ texto: c.tipo === 'rapidez-finita' ? 'Sin otras fuerzas, la energía mecánica al salir es igual a la de la posición final.' : 'La energía mecánica se conserva, y muy lejos la energía potencial es casi cero: solo queda la cinética.', ecuacion: [sub('E', 'M,inicial'), ' = ', sub('E', 'M,final')] });
      solucion.push({ texto: 'La masa de la sonda se cancela; despejamos la rapidez y tomamos la raíz positiva.', ecuacion: eq(simbolo, resultado) });
      error('resta-rapideces', c.v0 / 1000 - escape(c.GM, rr) / 1000, 'Bien comparada con el escape, pero restaste rapideces, y lo que se resta son energías.');
      error('sin-frenado', c.v0 / 1000, 'Bien usada la rapidez inicial, pero olvidaste que la sonda pierde energía cinética al alejarse.');
      error('solo-escape', escape(c.GM, rr) / 1000, 'Bien hallada la rapidez de escape, pero esa no es la rapidez que se pide.');
      error('signo', -resultado, 'Bien sacada la raíz, pero una rapidez nunca es negativa.');
      if (c.tipo === 'rapidez-finita') error('infinito-antes', Math.sqrt(limite2) / 1000, 'Bien usada la energía, pero trataste la posición final como si estuviera infinitamente lejos.');
      if (c.tipo === 'residual-altura') {
        const mal = c.v0 ** 2 - 2 * c.GM / c.h;
        if (mal >= 0) error('solo-altura', Math.sqrt(mal) / 1000, 'Bien incluida la altura, pero la usaste como distancia al centro, y falta sumarle el radio.');
      }
    } else if (['retorno', 'altura-retorno'].includes(c.tipo)) {
      const EporMasa = c.v0 ** 2 / 2 - c.GM / rr;
      if (EporMasa >= 0) throw new Error('El retorno exige energía mecánica negativa.');
      const maximo = -c.GM / EporMasa;
      resultado = (maximo - (c.tipo === 'altura-retorno' ? c.R : 0)) / 1000; unidad = 'km'; color = 'i'; simbolo = c.tipo === 'altura-retorno' ? sub(h, 'max') : sub(r, 'max'); simboloTexto = c.tipo === 'altura-retorno' ? 'h_{max}' : 'r_{max}';
      enunciado = c.tipo === 'altura-retorno'
        ? ['Una sonda sale a ', cantidad(c.v0 / 1000, 'km/s'), ' desde altura ', cantidad(c.h / 1000, 'km', 'i'), ' sobre un planeta de radio ', cantidad(c.R / 1000, 'km', 'i'), '. ¿Cuál es su altura máxima?']
        : ['Una sonda sale a ', cantidad(c.v0 / 1000, 'km/s'), ' desde ', cantidad(rr / 1000, 'km', 'i'), ' del centro. ¿A qué distancia del centro se detiene antes de regresar?'];
      datos.pop(); datos.push(leyEP, [leyEC, '; ', leyEnergia], c.tipo === 'altura-retorno' ? ['En el retorno, ', v, ' = 0; ', sub(r, '0'), ' = ', R, ' + ', h, ' y ', sub(h, 'max'), ' = ', sub(r, 'max'), ' − ', R, '.'] : 'En el punto de retorno, la rapidez es cero.');
      solucion.push({ texto: 'La energía mecánica inicial es negativa y se conserva hasta que la sonda se detiene.', ecuacion: [sub('E', 'C,inicial'), ' + ', sub('E', 'PG,inicial'), ' = ', sub('E', 'PG,retorno')] });
      solucion.push({ texto: 'Al detenerse, la energía cinética es cero; despejamos la distancia máxima al centro.', ecuacion: [sub(r, 'max'), ' = ', { frac: ['GM', ['GM/', sub(r, '0'), ' − ', { sup: [v0, 2] }, '/2']] }] });
      solucion.push({ texto: c.tipo === 'altura-retorno' ? 'Restamos el radio del planeta para obtener la altura sobre la superficie.' : 'Pasamos la distancia al centro a kilómetros.', ecuacion: eq(simbolo, resultado) });
      if (c.tipo === 'altura-retorno') error('radio-como-altura', maximo / 1000, 'Bien hallada la distancia máxima al centro, pero la diste como altura; falta restarle el radio.');
      error('desde-salida', (maximo - rr) / 1000, 'Bien hallado el punto más alto, pero mediste desde el punto de salida y no desde donde se pide.');
      error('sin-movimiento', (rr - (c.tipo === 'altura-retorno' ? c.R : 0)) / 1000, 'Bien ubicado el punto de salida, pero olvidaste que la sonda sigue subiendo después.');
      error('signo', -resultado, 'Bien despejado el máximo, pero le cambiaste el signo a la distancia.');
      error('sin-km', resultado * 1000, 'Bien hallada la distancia en metros, pero la diste como si fueran kilómetros.');
    } else if (['radio', 'radio-altura'].includes(c.tipo)) {
      const distancia = 2 * c.GM / c.vesc ** 2;
      resultado = (distancia - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000; unidad = 'km'; color = 'i'; simbolo = c.tipo === 'radio-altura' ? h : r; simboloTexto = c.tipo === 'radio-altura' ? 'h' : 'r';
      enunciado = c.tipo === 'radio-altura'
        ? ['Un planeta tiene radio ', cantidad(c.R / 1000, 'km', 'i'), '. ¿A qué altura la rapidez de escape vale ', cantidad(c.vesc / 1000, 'km/s'), '?']
        : ['¿A qué distancia del centro de este planeta la rapidez de escape es ', cantidad(c.vesc / 1000, 'km/s'), '?'];
      if (c.tipo === 'radio-altura') datos.push([r, ' = ', R, ' + ', h]);
      solucion.push({ texto: 'Elevamos al cuadrado la fórmula de escape y despejamos la distancia al centro.', ecuacion: [r, ' = ', { frac: ['2 · GM', { sup: [ve, 2] }] }] });
      solucion.push({ texto: c.tipo === 'radio-altura' ? 'Restamos el radio del planeta y pasamos la altura a kilómetros.' : 'Pasamos la distancia al centro a kilómetros.', ecuacion: eq(simbolo, resultado) });
      error('sin-dos', (distancia / 2 - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000, 'Bien despejada la distancia, pero olvidaste el factor dos.');
      error('sin-cuadrado', (2 * c.GM / c.vesc - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000, 'Bien reunidos los datos, pero no elevaste la rapidez al cuadrado.');
      error('sin-km', resultado * 1000, 'Bien hallada la distancia en metros, pero la diste como si fueran kilómetros.');
      error('signo', -resultado, 'Bien hallado el tamaño, pero una distancia nunca es negativa.');
      if (c.tipo === 'radio-altura') error('radio-como-altura', distancia / 1000, 'Bien hallada la distancia al centro, pero faltó restarle el radio del planeta.');
    } else throw new Error(`Tipo de escape desconocido: ${c.tipo}`);
    const vistos = new Set([opcion(resultado, unidad)]);
    const err = errores.filter(e => { const t = opcion(e.valor, unidad); if (!Number.isFinite(e.valor) || vistos.has(t)) return false; vistos.add(t); return true; })
      .map(e => ({ ...e, texto: opcion(e.valor, unidad), error: `GR6-${e.id.toUpperCase()}`, siFuera: `${e.causa} Así sale ${opcion(e.valor, unidad)}.` }));
    return { enunciado, datos, solucion, respuesta: eq(simbolo, resultado), resultado, unidad, color, simboloTexto, errores: err,
      dibujo: figura({ ...c, resultado, unidad, color, simboloTexto }),
      verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado: !exacto(resultado) }, errores: err.map(e => ({ id: e.id, valor: e.valor })) } };
  }
  const fijos = [
    { tipo: 'umbral', nivel: 1, titulo: 'El umbral de salida', GM: 1.8e14, r: 1e7 },
    { tipo: 'umbral', nivel: 1, titulo: 'Otro planeta ideal', GM: 3.6e14, r: 8e6 },
    { tipo: 'circular', nivel: 1, titulo: 'Comparar dos rapideces', vc: 4000 },
    { tipo: 'otra-masa', nivel: 1, titulo: 'Una sonda de otra masa', vRef: 12000, km: 3 },
    { tipo: 'razon', nivel: 1, titulo: 'Cambiar solo la fuente', vRef: 9000, kM: 4, kr: 1 },
    { tipo: 'altura', nivel: 2, titulo: 'Salir desde cierta altura', GM: 4.5e14, R: 3e6, h: 1.5e7 },
    { tipo: 'radio', nivel: 2, titulo: 'Encontrar el lugar de salida', GM: 5e14, vesc: 10000 },
    { tipo: 'razon', nivel: 2, titulo: 'Cambian fuente y separación', vRef: 14000, kM: 2, kr: 8 },
    { tipo: 'residual', nivel: 2, titulo: 'La rapidez que permanece', GM: 4.05e14, r: 1e7, v0: 15000 },
    { tipo: 'rapidez-finita', nivel: 2, titulo: 'Una posición todavía cercana', GM: 4e14, r: 1e7, rFinal: 2e7, v0: 10000 },
    { tipo: 'retorno', nivel: 3, titulo: 'Hasta dónde llega la sonda', GM: 3e14, r: 1e7, v0: 6000 },
    { tipo: 'altura-retorno', nivel: 3, titulo: 'Altura máxima sobre el planeta', GM: 4e14, R: 4e6, h: 4e6, v0: 8000 },
    { tipo: 'residual-altura', nivel: 3, titulo: 'Desde la altura hacia lejos', GM: 4.8e14, R: 4e6, h: 8e6, v0: 12000 },
    { tipo: 'dos-planetas', nivel: 3, titulo: 'Campo, radio y salida', vRef: 9000, kg: 3, kR: 2 },
    { tipo: 'radio-altura', nivel: 3, titulo: 'Ubicar una salida posible', GM: 9.6e14, R: 6e6, vesc: 8000 },
  ];
  let letra = 0;
  const causasCortas = { 'desde-salida': 'mides desde el punto de salida', 'sin-movimiento': 'olvidas la subida', signo: 'cambias el signo', 'sin-km': 'no pasas los metros a kilómetros',
    'radio-como-altura': 'confundes la distancia al centro con la altura', 'resta-rapideces': 'restas rapideces', 'sin-frenado': 'mantienes la rapidez inicial', 'solo-escape': 'das la rapidez de escape',
    'radio-inverso': 'divides entre el radio', lineal: 'no sacas la raíz', 'solo-campo': 'olvidas el radio', 'solo-radio': 'olvidas el campo', 'sin-dos': 'olvidas el dos', 'sin-cuadrado': 'no elevas la rapidez al cuadrado',
    'solo-altura': 'tomas la altura como distancia al centro' };
  const ejemplos = fijos.map(c => {
    const b = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      const err = b.errores.slice(0, 4); if (err.length < 4) throw new Error('Faltan errores de examen: ' + c.tipo);
      e.alternativas = err.map(x => x.texto); e.alternativas.splice(letra++, 0, opcion(b.resultado, b.unidad));
      e.solucion.push({ texto: err.map(x => `${numero(x.valor)} sale si ${causasCortas[x.id]}.`).join(' ') });
    }
    return e;
  });
  function entrada(s, resuelto) {
    s = Math.abs(Math.trunc(s));
    const tipos = ['umbral', 'altura', 'razon', 'circular', 'otra-masa', 'residual', 'retorno', 'altura-retorno', 'radio', 'rapidez-finita', 'residual-altura', 'dos-planetas', 'radio-altura'];
    // Auditoría (26 nov): «Ahora tú» empieza en otro tipo que «Así se resuelve» con la misma semilla, y el radio del
    // planeta da una densidad posible (antes, R = 2000 km con GM de hasta 2,7 × 10¹⁵ m³/s²: 10⁶ kg/m³).
    const tipo = tipos[(s + (resuelto ? 0 : 6)) % tipos.length], k = Math.floor(s / tipos.length) % 8, z = Math.floor(s / 104) % 5;
    const Rp = resuelto ? 1e7 : 6e6;
    // Radios pares: GM se muestra exactamente con tres decimales de mantisa.
    const rr = (resuelto ? 18 + 2 * k : 8 + 2 * k) * 1e6, vv = (resuelto ? 9 + z : 4 + z) * 1000, GM = vv * vv * rr / 2;
    if (tipo === 'umbral') return { tipo, GM, r: rr };
    if (tipo === 'altura') return { tipo, GM, R: Rp, h: rr - Rp };
    if (tipo === 'razon') return { tipo, vRef: (resuelto ? 21 + k : 11 + k) * 1000, kM: 2 + z, kr: 2.5 + k % 3 };
    if (tipo === 'circular') return { tipo, vc: (resuelto ? 11 + k : 3 + k) * 1000 };
    if (tipo === 'otra-masa') return { tipo, vRef: (resuelto ? 21 + k : 11 + k) * 1000, km: 2 + z };
    if (tipo === 'residual') return { tipo, GM, r: rr, v0: vv + (resuelto ? 7000 : 3000) + k * 1000 };
    if (tipo === 'retorno') return { tipo, GM, r: rr, v0: vv * [0.5, 0.6, 0.8][k % 3] };
    if (tipo === 'altura-retorno') return { tipo, GM, R: Rp, h: rr - Rp, v0: vv * [0.5, 0.6, 0.8][k % 3] };
    if (tipo === 'radio') return { tipo, GM, vesc: vv };
    if (tipo === 'radio-altura') return { tipo, GM, R: Rp, vesc: vv };
    if (tipo === 'rapidez-finita') return { tipo, GM, r: rr, rFinal: rr * 2, v0: vv + (resuelto ? 8000 : 4000) + k * 1000 };
    if (tipo === 'residual-altura') return { tipo, GM, R: Rp, h: rr - Rp, v0: vv + (resuelto ? 6000 : 2000) + k * 1000 };
    return { tipo, vRef: (resuelto ? 21 + k : 11 + k) * 1000, kg: 2 + z, kR: 2 + k % 3 };
  }
  function generar(s, resuelto) {
    const b = caso(entrada(s, resuelto)); if (b.errores.length < 3) throw new Error('Faltan opciones de escape: ' + s);
    if (resuelto) return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: b.verificacion,
      pasos: [{ tipo: 'pide', texto: 'Identificamos qué se pide: la rapidez mínima de escape, otra rapidez o el punto donde la sonda regresa.' },
        { tipo: 'regla', texto: 'Trabajamos con la energía mecánica, cinética más potencial, y distinguimos la altura de la distancia al centro.' }, ...b.solucion.map(x => ({ tipo: 'cuentas', ...x })),
        { tipo: 'sentido', texto: 'Una rapidez nunca es negativa, y la sonda solo regresa si su energía mecánica inicial es negativa.' }] };
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion,
      opciones: [{ id: 'c', texto: opcion(b.resultado, b.unidad), correcta: true }, ...b.errores.slice(0, 3).map(x => ({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera }))],
      solucion: { texto: 'Usamos la conservación de la energía con la distancia al centro, el cero en el infinito y las unidades del SI.', ecuacion: b.solucion.at(-1).ecuacion } };
  }
  const p = { tipo: 'razon', vRef: 10000, kM: 1, kr: 4 }, pc = caso(p);
  const erroresPred = ['sin-radio', 'lineal', 'directa-radio'].map(id => pc.errores.find(e => e.id === id));
  const idea = {
    id: 'escape', titulo: 'Rapidez de escape', pregunta: '¿Qué rapidez necesita una sonda para alejarse sin regresar?',
    aprendizaje: 'Hallas el umbral energético de una salida radial hacia afuera, sin aire ni propulsión posterior.',
    actividad: 'Comparar lanzamientos radiales desde la misma posición con distintas rapideces iniciales.', temas: ['Rapidez de escape'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'Una salida hacia afuera', texto: 'La sonda parte desde fuera del planeta y se aleja por una recta que pasa por su centro. Después del impulso inicial solo actúa la gravedad: no hay aire ni motores encendidos en el camino.', dibujo: juegoFigura(8, false) },
      { titulo: 'Dos resultados posibles', texto: 'La rapidez de escape es la rapidez inicial mínima para alejarse sin regresar. Con menos rapidez, la sonda se detiene en un punto de retorno y vuelve. Compararemos lanzamientos desde el mismo lugar.' },
      { titulo: 'Lo que significa muy lejos', texto: ['Si la sonda escapa, su rapidez se acerca a un valor fijo mientras se aleja: es la rapidez residual límite, ', vi, '. No significa que llegue al infinito en algún momento. La energía mecánica, cinética más potencial, se escribe ', EM, '.'] },
    ] },
    juega: {
      consigna: 'Lanza la sonda hacia afuera, en línea recta desde el centro, y compara qué pasa al cambiar su rapidez inicial.', voz: 'Con la energía inicial ya sabes si regresa, sin seguir todo el viaje.',
      controles: [{ id: 'vKm', etiqueta: 'Rapidez inicial', color: 'c-o', opciones: [6, 8, 9, 10, 11].map(valor => ({ valor, texto: `${fmt(valor)} km/s` })), inicio: 6 }],
      mision: { texto: 'Busca la menor rapidez que permite alejarse sin regresar.', logrado: a => {
        const E = energia(4e14, 100, 8e6, a.vKm * 1000); return E >= 0 && [6, 8, 9, 10, 11].filter(x => x < a.vKm).every(x => energia(4e14, 100, 8e6, x * 1000) < 0);
      }, testigo: [{ vKm: 10 }], bien: 'Coincide: es la menor rapidez del control con la que la sonda no regresa.' },
      dibujo: a => juegoFigura(a.vKm), lectura: a => {
        const E = energia(4e14, 100, 8e6, a.vKm * 1000);
        return E < 0 ? 'Su energía es negativa: se detiene y regresa.' : E === 0 ? 'Está en el umbral: se aleja sin límite.' : 'Supera el umbral: le queda una rapidez residual positiva.';
      },
      leyenda: [{ s: v0, t: 'rapidez inicial, en kilómetros por segundo' }, { s: sub(r, '0'), t: 'distancia inicial al centro' }, { s: m, t: 'masa de la sonda, en kilogramos' }, { s: EM, t: 'energía mecánica, en gigajoules' }, { s: 'GM', t: 'G por la masa del planeta' }], minimo: 2,
    },
    predice: {
      pregunta: 'La salida cambia de lugar. ¿Qué rapidez mínima permite escapar desde la nueva posición?',
      datos: ['Desde la superficie de un planeta de radio R, la rapidez de escape es 10 km/s.', 'La nueva salida está a cuatro veces R del centro del mismo planeta.', 'Ambas salidas son radiales hacia afuera, sin aire ni empuje posterior.'], dibujo: figura(p), revelar: figura({ ...p, resultado: pc.resultado, unidad: 'km/s', simboloTexto: 'v_{esc}' }, true),
      opciones: [{ id: 'c', texto: opcion(pc.resultado, 'km/s'), correcta: true }, ...erroresPred.map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      coincide: 'La distancia está dentro de la raíz, así que cuadruplicarla no divide la rapidez entre cuatro.', verificacion: pc.verificacion,
    },
    mira: { pieza: 'fis-gravitacion', datos: { ...figura(p).datos, cortes: [figura(p).datos, figura({ ...p, resultado: pc.resultado, unidad: 'km/s', simboloTexto: 'v_{esc}' }, true).datos] },
      pasos: [{ estado: { corte: 0 }, texto: 'En el umbral, la energía mecánica es cero: la cinética compensa justo la potencial.', ecuacion: [EC, ' + ', EP, ' = 0'] },
        { estado: { corte: 0 }, texto: 'Despejamos la rapidez; la masa de la sonda se cancela.', ecuacion: leyEscape },
        { estado: { corte: 0 }, texto: 'Comparamos dos salidas del mismo planeta; solo cambia la distancia al centro.', ecuacion: [sub(v, 'esc,nueva'), ' = ', sub(v, 'esc,ref'), ' / ', { raiz: [p.kr] }] },
        { estado: { corte: 1 }, texto: 'La distancia es cuatro veces mayor, así que la rapidez de escape se divide entre la raíz de cuatro.', ecuacion: [sub(v, 'esc,nueva'), ` = ${numero(p.vRef / 1000)} / ${numero(Math.sqrt(p.kr))} = `, cantidad(pc.resultado, 'km/s')] }] },
    regla: { texto: 'En una salida en línea recta hacia afuera, la energía mecánica decide si la sonda regresa: si es negativa, regresa; si es cero, está en el umbral; si es positiva, se aleja y le queda rapidez.', ecuacion: leyEscape,
      condicion: 'el planeta está fijo, la sonda tiene masa despreciable, parte desde fuera del planeta y se aleja en línea recta, sin aire ni empuje después; el cero de energía potencial está en el infinito.',
      voz: 'En el umbral, la rapidez tiende a cero al crecer la separación sin límite.', dibujo: figura({ tipo: 'umbral', GM: 3e14, r: 1.2e7 }) },
    ejemplos, resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) }, ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'rapidez de escape', simbolo: 'v_esc', medida: 'm/s', simple: 'El umbral inicial para alejarse sin regresar.',
      def: 'Rapidez inicial mínima que permite alejarse sin regresar, en la salida exterior y sin pérdidas descrita por el modelo.',
      ejemplos: ['La salida debe especificar desde qué posición se lanza.', 'Un motor encendido durante todo el viaje cambia el modelo.', 'La gravedad sigue actuando durante el alejamiento.'] },
    { termino: 'punto de retorno', simbolo: 'r_max', medida: 'm', simple: 'El lugar donde la sonda deja de alejarse y empieza a regresar.',
      def: 'Posición exterior donde una salida radial de energía mecánica negativa alcanza rapidez cero antes de volver hacia la fuente.',
      ejemplos: ['No es el mismo punto que la posición inicial.', 'Su separación se mide desde el centro del planeta.', 'Su altura se mide sobre la superficie planetaria.'] },
    { termino: 'rapidez residual límite', simbolo: 'v_inf', medida: 'm/s', simple: 'La rapidez a la que se aproxima una sonda cada vez más lejana.',
      def: 'Límite de la rapidez cuando la separación crece sin límite en una salida que no retorna.',
      ejemplos: ['No indica una llegada al infinito en tiempo finito.', 'Se distingue de la rapidez inicial de lanzamiento.', 'Se evalúa con la misma referencia de energía que al inicio.'] },
  ];
  const letras = { G: 'constante de gravitación universal', M: 'masa de la fuente', m: 'masa de la sonda', r: 'separación entre centros', R: 'radio del planeta', h: 'altura sobre la superficie',
    r_0: 'separación inicial', r_max: 'separación del punto de retorno', h_max: 'altura máxima sobre la superficie', v: 'rapidez', v_0: 'rapidez inicial', v_c: 'rapidez circular', v_esc: 'rapidez mínima de escape',
    v_inf: 'rapidez residual límite', v_final: 'rapidez en la posición final', E_PG: 'energía potencial gravitatoria', E_C: 'energía cinética', E_M: 'energía mecánica', g_0: 'campo gravitatorio en la superficie' };
  return { idea, glosario, letras };
}

function construirLaboratorioGr(Kit) {
  'use strict';
  // Un modelo didáctico único. El período, la posición y las flechas usan los
  // mismos GM y radio, sin integrar con el período redondeado de la lectura.
  const GM = 4e14, R = 4e6, radioEscena = 0.42, escala = radioEscena / R;
  const f = n => Kit.formatear(n, 3);
  function fisica(a) {
    const r = a.r * R, v = Math.sqrt(GM / r), omega = v / r;
    const T = 2 * Math.PI / omega, theta = omega * a.t * 3600;
    const inc = a.inc * Math.PI / 180;
    const plano = (x, y) => [x, y * Math.cos(inc), y * Math.sin(inc)];
    return { GM, R, r, v, g: GM / r ** 2, T,
      posicion: plano(r * Math.cos(theta), r * Math.sin(theta)),
      velocidad: plano(-v * Math.sin(theta), v * Math.cos(theta)),
      vueltas: a.t * 3600 / T, theta };
  }
  function dibujo(a) {
    const q = fisica(a), s = q.posicion.map(x => x * escala);
    const camino = [], ecuador = [], inc = a.inc * Math.PI / 180;
    for (let j = 0; j <= 128; j++) {
      const t = 2 * Math.PI * j / 128;
      camino.push([q.r * Math.cos(t) * escala, q.r * Math.sin(t) * Math.cos(inc) * escala, q.r * Math.sin(t) * Math.sin(inc) * escala]);
      ecuador.push([1.02 * radioEscena * Math.cos(t), 1.02 * radioEscena * Math.sin(t), 0]);
    }
    const aceleracion = q.posicion.map(x => -GM * x / q.r ** 3);
    // Escalas constantes: 0,00009 unidades gráficas por m/s, y 0,06 por m/s² (auditoría, 26 nov: con 0,05 la flecha de g⃗
    // quedaba escondida bajo el rótulo r; con 0,06 no entra al planeta ni en la órbita de 2 R).
    const vPunta = s.map((x, k) => x + 0.00009 * q.velocidad[k]);
    const gPunta = s.map((x, k) => x + 0.06 * aceleracion[k]);
    return { datos: {
      escena: 'gravitacion-plano-etapa10', escala: 0.95, // auditoría (26 nov): la escena ocupaba un tercio del cuadro ejes: null, vista: { giro: 25, inclinacion: 22 },
      bolas: [{ en: [0, 0, 0], r: radioEscena, color: 'tinta' }, { en: s, r: 0.085, color: 'tinta' }],
      trazos: [
        { puntos: [[0, 0, -radioEscena - 0.25], [0, 0, radioEscena + 0.25]], color: 'tinta' },
        { puntos: ecuador, color: 'tinta' }, { puntos: camino, color: 'c-i', punteado: true },
        { puntos: [[0, 0, 0], s], color: 'c-i' },
      ],
      flechas: [{ de: s, a: vPunta, color: 'c-o', rotulo: 'v⃗' }, { de: s, a: gPunta, color: 'tinta', rotulo: 'g⃗' }],
      // Auditoría (26 nov): el rótulo r tapaba la flecha de g⃗; el radio ya es el trazo turquesa que nombra el control «Radio orbital r».
      caras: [], rotulos: [],
      alt: `Modelo de un planeta esférico y un satélite en órbita circular. El radio orbital es ${f(a.r)} veces el radio del planeta. El plano está inclinado ${f(a.inc)}°. La velocidad es tangente y el campo apunta al centro.`,
    }, estado: {} };
  }
  const mesa = {
    id: 'orbita-plano-3d', titulo: 'Una órbita circular en distintos planos', pieza: 'fis-espacio-3d',
    consigna: 'Gira el planeta y compara sus órbitas: GM = 4 × 10¹⁴ m³/s², R = 4000 km, sin aire y con masa satelital despreciable.',
    controles: [
      { id: 'r', etiqueta: 'Radio orbital r', color: 'c-i', opciones: [2, 3, 4, 6].map(valor => ({ valor, texto: `${valor} R` })), inicio: 3 },
      { id: 'inc', etiqueta: 'Inclinación del plano', min: 0, max: 90, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
      { id: 't', etiqueta: 'Tiempo t', color: 'c-d', min: 0, max: 12, paso: 0.25, inicio: 0, unidad: 'h', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
    ],
    dibujo,
    lectura: a => {
      const q = fisica(a);
      return ['Cada vuelta tarda ', { v: 'c-d', t: `T ≈ ${f(q.T / 3600)} h` },
        '; ', { v: 'c-o', t: `v ≈ ${f(q.v / 1000)} km/s` }, '.'];
    },
    invitaciones: [
      { texto: 'Busca la órbita que completa una vuelta en menos tiempo.',
        logrado: a => fisica(a).T <= fisica({ ...a, r: 2 }).T + 1e-9,
        bien: 'La órbita de menor radio tiene mayor rapidez y menor recorrido por vuelta.' },
      { texto: 'Haz que el plano de la órbita pase por los dos polos.',
        logrado: a => a.inc === 90,
        bien: 'El plano polar contiene el eje de los polos y el centro del planeta.' },
      { texto: 'En la órbita de menor radio, espera hasta completar más de dos vueltas.',
        logrado: a => a.r === 2 && fisica(a).vueltas > 2,
        bien: 'El número de vueltas se obtiene dividiendo el tiempo transcurrido entre el período.' },
      { texto: 'Guarda dos órbitas con igual radio y distinta inclinación.',
        logrado: (a, guardados) => guardados.some(b => b.r === a.r && b.inc !== a.inc),
        testigo: [{ r: 3, inc: 0, t: 0 }, { r: 3, inc: 90, t: 0 }],
        bien: 'Cambiar la inclinación conserva la rapidez y el período en este campo esférico.' },
    ],
    verificacion: fisica,
  };
  return [mesa];
}

  const bloques = [construirGr1, construirGr2, construirGr3, construirGr4, construirGr5, construirGr6].map(crear => crear(Kit));
  return {
    unidad: 'fisica.gravitacion', version: '0.4.0', calidad: 2, estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-gravitacion.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    letras: Object.assign({}, ...bloques.map(b => b.letras), {
      G: 'constante de gravitación universal', M: 'masa de la fuente gravitatoria', m: 'masa del cuerpo estudiado',
      r: 'distancia al centro de la fuente', R: 'radio de la fuente esférica', h: 'altura sobre su superficie',
      F: 'módulo de fuerza gravitatoria', v: 'rapidez', t: 'tiempo transcurrido', T: 'período orbital',
      g: 'módulo del campo gravitatorio', a: 'semieje mayor de una elipse', b: 'semieje menor de una elipse',
      e: 'excentricidad de una elipse',
      A: 'cuerpo o caso identificado con A', B: 'cuerpo o caso identificado con B',
      r_A: 'distancia entre centros correspondiente al caso A', r_B: 'distancia entre centros correspondiente al caso B',
      r_1: 'distancia al centro de la posición o caso 1', r_2: 'distancia al centro de la posición o caso 2',
      v_1: 'rapidez de la posición o caso 1', v_2: 'rapidez de la posición o caso 2',
      E_PG: 'energía potencial gravitatoria', E_C: 'energía cinética', E_M: 'energía mecánica', W_g: 'trabajo de la gravedad',
    }),
    glosario: bloques.flatMap(b => b.glosario),
    ideas: bloques.map(b => b.idea),
    laboratorio: construirLaboratorioGr(Kit),
    laboratorioIdeas: { 'orbita-plano-3d': ['orbita-circular'] },
    historia: {
      texto: 'Kepler estudió los registros de Marte que había reunido Tycho Brahe. Publicó sus dos primeras leyes en 1609 y la tercera en 1619. Las leyes describían regularidades del movimiento. Después, Newton relacionó esas regularidades con la atracción gravitatoria.',
      pregunta: '¿Qué cambia cuando una relación observada también puede explicarse con una fuerza?',
      fuente: { titulo: 'NASA — Orbits and Kepler’s Laws', url: 'https://science.nasa.gov/solar-system/orbits-and-keplers-laws/' },
    },
  };
});
