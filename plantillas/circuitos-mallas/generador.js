/*
 * Generador «Dos pilas y una malla»: redes de corriente continua que no se resuelven con
 * serie y paralelo de memoria. Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['circuitos-mallas']) y en Node (require). No usa ningún motor:
 * las pruebas lo comparan con el motor nodal de plantillas/circuitos-cc/.
 *
 * Tipos y subtipos:
 *   kirchhoff  dos nodos, A y B, unidos por tres ramas en paralelo; cada rama lleva una
 *              resistencia y, a veces, una pila ideal con su borne positivo hacia A o hacia B.
 *     rama       dos pilas; la corriente por la resistencia de la rama central (sin pila)
 *     fuente     dos pilas; la corriente que pasa por la pila 3
 *     tres       tres pilas (una en cada rama); la corriente por la rama central
 *     potencia   dos pilas; la potencia que entrega la pila 1 (ε1·I1)
 *     ddp        dos pilas; la lectura con signo (V_A − V_B) de un voltímetro ideal con su borne + en A
 *     estado     dos pilas; si la pila 3 entrega energía o se carga, y con qué corriente (armarTexto)
 *     fem        se conocen la corriente por la pila 1 y por la rama central: la fem de la pila 3
 *   puente     cinco resistencias: R1 de A a C, R2 de C a B, R3 de A a D, R4 de D a B, y el tramo
 *              central entre C y D.
 *     req        la resistencia equivalente entre A y B; la mitad de las veces el puente está equilibrado
 *                (R1/R2 = R3/R4, R5 no conduce) y la otra mitad no (potenciales de nodo)
 *     corriente  igual, con una pila ideal entre A y B: la corriente de la pila
 *     r5         puente no equilibrado con pila: la corriente por R5
 *     amperimetro puente no equilibrado con un amperímetro ideal en el tramo central: su lectura
 *     corto      tres resistencias y un cable sin resistencia que deja una en corto: Req
 *   pilas      n pilas iguales reales (fem ε, resistencia interna r) alimentan una resistencia R.
 *     serie / paralelo, con medidor 'A' (amperímetro ideal en serie) o 'V' (voltímetro ideal
 *     entre los bornes del arreglo)
 *     grafica    la gráfica corriente contra resistencia externa pasa por dos puntos: r o ε
 *
 * Convenciones: corrientes en A, fem y voltajes en V, resistencias en Ω, potencias en W. Las
 * respuestas son magnitudes (positivas), salvo ddp (con signo) y estado (texto); el sentido se dice en la solución. Pilas ideales salvo
 * en «pilas». En kirchhoff, las fem se guardan con signo en _datos.e: positiva si el borne
 * positivo mira hacia A.
 * Errores: C6 (documentado), C11 y C12 (parcial; docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md, con
 * su respaldo); KIR-* (signos y nodos en Kirchhoff, hipótesis que sale de C10), PU-* (puentes),
 * PI-* (pilas reales) y POT-* (potencia), hipótesis nuestras; PR5 del informe transversal.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = EM) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const doc = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'documentado', fuente: EM });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: EM });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x > 0 && x < 1e5;
  const par = (a, b) => a * b / (a + b);

  const VAR = {
    e: { nombre: 'fem de las pilas', color: 'o' },
    r: { nombre: 'resistencias', color: 'h' },
    i: { nombre: 'corrientes', color: 'i' },
    x: { nombre: 'lo que se pide', color: 'd' },
  };

  function generar(semilla) {
    const rng = Azar.crear('circuitos-mallas|' + semilla);
    const equilibrado = rng.moneda(); // en puente/req y puente/corriente: mitad y mitad
    const [tipo, sub] = rng.elegir([
      ['kirchhoff', 'rama'], ['kirchhoff', 'rama'], ['kirchhoff', 'fuente'], ['kirchhoff', 'tres'], ['kirchhoff', 'tres'],
      ['kirchhoff', 'potencia'], ['kirchhoff', 'ddp'], ['kirchhoff', 'fem'], ['kirchhoff', 'fem'], ['kirchhoff', 'estado'], ['kirchhoff', 'estado'],
      ['puente', 'req'], ['puente', 'req'], ['puente', 'corriente'], ['puente', 'corriente'], ['puente', 'r5'], ['puente', 'amperimetro'], ['puente', 'amperimetro'], ['puente', 'corto'],
      ['pilas', 'serie'], ['pilas', 'serie'], ['pilas', 'paralelo'], ['pilas', 'paralelo'], ['pilas', 'grafica'], ['pilas', 'grafica']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'kirchhoff' ? kirchhoff(rng, semilla, sub) : tipo === 'puente' ? puente(rng, semilla, sub, equilibrado) : pilas(rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    let alternativas;
    if (o.textual) alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    else {
      const errores = o.errores.filter(e => Number.isFinite(e.valor) && Math.abs(e.valor) >= 0.01 && Math.abs(e.valor) < 1e5 && (o.negativos || e.valor > 0));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, unidad: o.unidad, negativos: !!o.negativos });
    }
    if (o.textual) o.correcta = o.correcta.clave;
    return {
      id: `circuitos-mallas#${semilla}`, variables: VAR, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---------------- Kirchhoff: tres ramas entre A y B ----------------
  // Rama k: fem con signo e[k] (positiva si el borne + mira hacia A) en serie con R[k].
  // Con B a 0 V, la corriente que sube por la rama k hacia A es (e[k] − VA)/R[k].
  function nodal(e, R) {
    const VA = e.reduce((s, ek, k) => s + ek / R[k], 0) / R.reduce((s, Rk) => s + 1 / Rk, 0);
    return { VA, u: e.map((ek, k) => (ek - VA) / R[k]) };
  }
  const borne = ek => (ek > 0 ? 'con su borne positivo hacia A' : 'con su borne positivo hacia B');
  function ramaTexto(k, ek, Rk) {
    const seg = [`Rama ${k}: `];
    if (ek) seg.push('una pila ideal de ', v('e', `ε${k} = ${f(Math.abs(ek))} V`), `, ${borne(ek)}, en serie con `);
    seg.push(ek ? '' : 'solo ', v('r', `R${k} = ${f(Rk)} Ω`), '. ');
    return seg;
  }
  const sube = (uk, k) => (uk > 0 ? `sube por la rama ${k} hacia A` : `baja por la rama ${k} hacia B`);

  function kirchhoff(rng, semilla, sub) {
    const RS = [1, 2, 3, 4, 5, 6, 8, 10];
    const R = [rng.elegir(RS), rng.elegir(RS), rng.elegir(RS)];
    const U = [-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3];
    const u1 = rng.elegir(U), u3 = rng.elegir(U), u2 = -u1 - u3;
    if (u2 === 0) return null;
    const central = sub === 'tres';
    const VA = central ? rng.entero(-12, 12) : -u2 * R[1];
    const u = [u1, u2, u3];
    const e = u.map((uk, k) => VA + uk * R[k]);
    if (!central) e[1] = 0;
    if (e[0] <= 0) return null; // la pila 1 siempre con el borne + hacia A
    for (const k of central ? [0, 1, 2] : [0, 2]) if (e[k] === 0 || Math.abs(e[k]) > 30 || Math.abs(e[k]) < 2 || !limpio(Math.abs(e[k]))) return null;
    if (VA === 0) return null;
    const sol = nodal(e, R);
    if (Math.abs(sol.VA - VA) > 1e-9) return null;
    if (sub === 'potencia' && u1 <= 0) return null;

    const enunciado = ['Dos nodos, A y B, están unidos por tres ramas en paralelo. ',
      ...ramaTexto(1, e[0], R[0]), ...ramaTexto(2, e[1], R[1]), ...ramaTexto(3, e[2], R[2]), 'Los cables no tienen resistencia.'];
    // Ecuación de nodo con los valores: la solución la escribe en colores.
    const termino = k => [`(`, v('e', e[k] < 0 ? `−${f(-e[k])}` : f(e[k])), ' − V)/', v('r', f(R[k]))];
    const nodoEc = ['Toma B como 0 V y llama V al potencial de A. Por cada rama sube hacia A la corriente (fem con signo − V)/R, con la fem positiva si el borne + mira hacia A. Lo que llega a A suma cero: ',
      ...termino(0), ' + ', ...termino(1), ' + ', ...termino(2), ' = 0, así que ', v('x', `V = ${f(VA)} V`), '.'];
    const corrientes = [`Corrientes: I1 = ${f(Math.abs(u1))} A (${sube(u1, 1)}), I2 = ${f(Math.abs(u2))} A (${sube(u2, 2)}) e I3 = ${f(Math.abs(u3))} A (${sube(u3, 3)}). Comprueba: lo que sube es igual a lo que baja.`];
    const datos = { tipo: 'kirchhoff', sub, e, R };
    const con = (k, s) => { const ee = e.slice(); ee[k] = s; return nodal(ee, R); };
    const flip3 = con(2, -e[2]), flip1 = con(0, -e[0]);
    // Malla de afuera sola (ramas 1 y 3, con la rama 2 abierta): sube por la rama 1 y baja por la 3.
    const Iext = (e[0] - e[2]) / (R[0] + R[2]);
    const exterior = (que) => h('KIR-malla-exterior', Math.abs(Iext), `Recorriste solo la malla de afuera (ramas 1 y 3), como si la rama central estuviera abierta: ${e[2] > 0 ? 'las dos pilas miran hacia A, así que en esa malla se oponen' : 'las pilas miran a lados opuestos, así que en esa malla se suman'}, y (${f(e[0])} ${e[2] > 0 ? '−' : '+'} ${f(Math.abs(e[2]))})/(${f(R[0])} + ${f(R[2])}) = ${f(Math.abs(Iext))} A. Esa sería la corriente sin la rama 2${que}. Con R2 conectada, la corriente se reparte: hay que plantear el nodo A o las dos mallas.`);

    if (sub === 'rama' || sub === 'tres') {
      const correcta = Math.abs(u2);
      const pregunta = ['¿Qué ', v('x', 'intensidad de corriente'), ' pasa por la resistencia R2 de la rama central?'];
      const errores = [
        h('KIR-signo', Math.abs(flip3.u[1]), 'Tomaste la pila 3 con la polaridad al revés. Al recorrer una rama, la fem suma si vas del borne − al + y resta si vas del + al −: mira hacia dónde está su borne positivo.'),
        h('KIR-signo', Math.abs(flip1.u[1]), 'Cambiaste el signo de la pila 1. Su borne positivo mira hacia A: en la ecuación entra con signo +.'),
        exterior(', y además la tomaste como la de R2, que en ese caso no llevaría nada'),
      ];
      if (central) errores.unshift(h('KIR-sin-fem-central', Math.abs(con(1, 0).u[1]), 'Dejaste fuera la pila de la rama central. Cada pila que cruzas al recorrer una malla entra en la ecuación con su signo.'),
        h('KIR-ohm-rama', Math.abs(e[1]) / R[1], `Aplicaste Ohm a la rama central sola, ε2/R2. Pero entre A y B no hay 0 V: la corriente de la rama es (ε2 − V)/R2, con V el potencial de A.`));
      else errores.push(h('KIR-una-fuente', Math.abs(con(2, 0).u[1]), 'Calculaste con la pila 1 sola, como si la pila 3 fuera un cable. Las dos pilas empujan a la vez: entran las dos en las ecuaciones.'));
      const solucion = [nodoEc, corrientes, ['Por R2 pasa ', v('x', `${f(correcta)} A`), '.']];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'A', enunciado, pregunta, solucion, datos });
    }
    if (sub === 'fuente') {
      const correcta = Math.abs(u3);
      const pregunta = ['¿Qué ', v('x', 'intensidad de corriente'), ' pasa por la pila 3?'];
      const errores = [
        h('KIR-signo', Math.abs(flip3.u[2]), 'Tomaste la pila 3 con la polaridad al revés. Al recorrer una rama, la fem suma si vas del borne − al + y resta si vas del + al −.'),
        h('KIR-ohm-rama', Math.abs(e[2]) / R[2], 'Aplicaste Ohm a la rama 3 sola, ε3/R3, como si entre A y B hubiera 0 V. La corriente de la rama es (fem con signo − V)/R3, con V el potencial de A.'),
        h('KIR-nodo', Math.abs(u1 - u2), `Te equivocaste en el nodo A: sumaste corrientes que en realidad se restan. Lo que llega a A es igual a lo que sale de A; con I1 e I2 bien calculadas, I3 sale de esa cuenta.`),
        exterior(''),
      ];
      const solucion = [nodoEc, corrientes, ['Por la pila 3 pasa ', v('x', `${f(correcta)} A`), u3 < 0 && e[2] > 0 || u3 > 0 && e[2] < 0 ? ': entra por su borne positivo, así que la pila 3 se está cargando.' : ': sale por su borne positivo, así que la pila 3 entrega energía.']];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'A', enunciado, pregunta, solucion, datos });
    }
    if (sub === 'potencia') {
      const correcta = e[0] * u1;
      const pregunta = ['¿Qué ', v('x', 'potencia'), ' entrega la pila 1?'];
      const errores = [
        h('POT-calor-interno', u1 * u1 * R[0], 'Calculaste I1²·R1: es el calor que se disipa en R1, no la potencia de la pila. La pila entrega P = ε1·I1.'),
        h('POT-borne', Math.abs(VA) * u1, 'Multiplicaste la corriente por la diferencia de potencial entre A y B. Eso es lo que la rama 1 le pasa al resto del circuito; la pila entrega P = ε1·I1, que incluye lo que se calienta R1.'),
        h('POT-sola', e[0] * e[0] / R[0], 'Calculaste ε1²/R1, como si la pila 1 alimentara sola a R1. Su corriente depende de toda la red: hay que resolver las mallas.'),
        h('KIR-signo', e[0] * Math.abs(flip3.u[0]), 'Tomaste la pila 3 con la polaridad al revés y te salió otra corriente por la pila 1. Mira hacia dónde está el borne positivo de cada pila.'),
      ];
      const solucion = [nodoEc, corrientes, ['La pila 1 entrega ', v('x', 'P'), ' = ', v('e', 'ε1'), '·', v('i', 'I1'), ` = ${f(e[0])} · ${f(u1)} = `, v('x', `${f(correcta)} W`), '.']];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'W', enunciado, pregunta, solucion, datos });
    }
    if (sub === 'ddp') {
      const correcta = VA;
      const enun = [...enunciado, ' Un voltímetro ideal tiene su borne positivo en A y su borne negativo en B.'];
      const pregunta = ['¿Qué marca el ', v('x', 'voltímetro'), '? (Con signo: marca V_A − V_B.)'];
      const errores = [
        h('KIR-fem-como-ddp', e[0], 'Tomaste la fem de la pila 1 como el voltaje entre A y B. Por R1 pasa corriente, así que en R1 cambia el potencial en I1·R1: V_A − V_B = ε1 − I1·R1.'),
        h('KIR-caida-por-potencial', u1 * R[0], 'Esa es la caída en R1, I1·R1, no el voltaje entre A y B. Falta la fem: V_A − V_B = ε1 − I1·R1.'),
        h('KIR-fem-neta', e[0] - e[2], 'Combinaste las dos fem como si estuvieran solas en una malla. Las resistencias también cambian el potencial.'),
        h('KIR-signo', flip3.VA, 'Tomaste la pila 3 con la polaridad al revés. Mira hacia dónde está su borne positivo.'),
        h('KIR-lectura-invertida', -VA, 'Leíste el voltímetro al revés. Su borne positivo está en A: marca V_A − V_B, no V_B − V_A.'),
      ];
      const solucion = [nodoEc, ['El voltímetro ideal no deja pasar corriente y marca ', v('x', `V_A − V_B = ${f(correcta)} V`), `. Con la rama 1: ε1 − I1·R1 = ${f(e[0])} − ${u1 < 0 ? `(${f(u1)})` : f(u1)} · ${f(R[0])} = ${f(VA)} V.`]];
      return cerrar(rng, semilla, { correcta, errores, negativos: true, unidad: 'V', enunciado: enun, pregunta, solucion, datos });
    }
    if (sub === 'estado') {
      // ¿La pila 3 entrega energía o se carga, y con qué corriente? Entrega si la corriente sale por su borne +.
      const op = (ek3, uk3) => { const I = Math.round(Math.abs(uk3) * 100) / 100, ent = (uk3 > 0) === (ek3 > 0); const texto = `${ent ? 'Entrega energía' : 'Se carga'}, con ${f(I)} A`; return { clave: 'pila3:' + texto, texto }; };
      const correcta = op(e[2], u3);
      const errores = [
        { ...op(-e[2], u3), id: 'KIR-estado-invertido', explicacion: 'La corriente está bien, pero no el papel de la pila. Si la corriente sale por su borne positivo, la pila entrega energía; si entra por el borne positivo, la están cargando.', respaldo: 'hipotesis', fuente: EM },
        { ...op(e[2], flip3.u[2]), id: 'KIR-signo', explicacion: 'Tomaste la pila 3 con la polaridad al revés, y cambiaron la corriente y el papel de la pila. Mira hacia dónde está su borne positivo.', respaldo: 'hipotesis', fuente: EM },
        { ...op(e[2], e[2] / R[2]), id: 'KIR-ohm-rama', explicacion: 'Aplicaste Ohm a la rama 3 sola, ε3/R3, como si esa pila empujara sola. Entre A y B hay voltaje por las otras ramas: la corriente es (fem con signo − V)/R3.', respaldo: 'hipotesis', fuente: EM },
        { ...op(e[2], -Iext), ...exterior(''), valor: undefined },
      ];
      const solucion = [nodoEc, corrientes, ['Por la pila 3 pasan ', v('x', `${f(Math.abs(u3))} A`), (u3 > 0) === (e[2] > 0) ? ', que salen por su borne positivo: ' : ', que entran por su borne positivo: ', v('x', correcta.texto[0].toLowerCase() + correcta.texto.slice(1)), '.']];
      return cerrar(rng, semilla, { textual: true, correcta, errores, unidad: '', enunciado, pregunta: ['¿Qué hace la ', v('x', 'pila 3'), ': entrega energía o se está cargando? ¿Con qué corriente?'], solucion, datos });
    }
    // fem: la pila 3 con fem desconocida; se dan I1 (por la pila 1) e I2 (por R2).
    const E3 = Math.abs(e[2]), s3 = Math.sign(e[2]);
    const enun = ['Dos nodos, A y B, están unidos por tres ramas en paralelo. Rama 1: una pila ideal con su borne positivo hacia A, en serie con una resistencia. Rama 2: solo ',
      v('r', `R2 = ${f(R[1])} Ω`), '. Rama 3: una pila ideal de fem desconocida, ', borne(e[2]), ', en serie con ', v('r', `R3 = ${f(R[2])} Ω`),
      '. Por la pila 1 pasa una corriente de ', v('i', `I1 = ${f(Math.abs(u1))} A`), u1 > 0 ? ' que sale por su borne positivo (sube hacia A)' : ' que entra por su borne positivo (baja hacia B)',
      ', y por R2 pasa ', v('i', `I2 = ${f(Math.abs(u2))} A`), u2 < 0 ? ' de A hacia B.' : ' de B hacia A.'];
    const pregunta = ['¿Cuál es la ', v('x', 'fem de la pila 3'), '?'];
    // Con B a 0 V: VA = −u2·R2; u3 = −u1 − u2; e3 = VA + u3·R3.
    const u3mal = u1 - u2; // signos del nodo cambiados
    const errores = [
      h('KIR-nodo', Math.abs(VA + u3mal * R[2]), 'Te equivocaste en el nodo A: sumaste I1 e I2 donde una entra y la otra sale. En A, lo que llega es igual a lo que sale; así se obtiene I3.'),
      h('KIR-signo', Math.abs(VA - u3 * R[2]), 'Al recorrer la rama 3 pusiste la caída en R3 con el signo cambiado. En una resistencia el potencial baja en el sentido de la corriente.'),
      h('KIR-sin-caida', Math.abs(VA), `Tomaste el voltaje entre A y B como la fem de la pila 3. Por R3 pasa corriente, así que en R3 también hay caída: hay que contarla.`),
      h('KIR-solo-caida', Math.abs(u3) * R[2], 'Te quedaste con la caída en R3, I3·R3. Falta el voltaje entre A y B, que es el que da R2.'),
    ];
    const solucion = [
      ['Toma B como 0 V. En R2 la corriente va ', u2 < 0 ? 'de A hacia B' : 'de B hacia A', `, así que A está a V = ${f(VA)} V`, ` (V = ${u2 < 0 ? '' : '−'}I2·R2 = ${u2 < 0 ? '' : '−'}${f(Math.abs(u2))} · ${f(R[1])}).`],
      [`Nodo A: lo que sube por las tres ramas suma cero. I3 = ${f(Math.abs(u3))} A, que ${sube(u3, 3)}.`],
      ['Rama 3, de B a A: ', s3 > 0 ? 'la pila sube ε3' : 'la pila baja ε3', ` y R3 ${u3 > 0 ? 'baja' : 'sube'} I3·R3 = ${f(Math.abs(u3) * R[2])} V. Así: `, v('x', `ε3 = ${f(E3)} V`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: E3, errores, unidad: 'V', enunciado: enun, pregunta, solucion, datos: { tipo: 'kirchhoff', sub, e, R, I1: u1, I2: u2 } });
  }

  // ---------------- Puente ----------------
  const RP = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
  function puenteTexto(R, central) {
    return ['Entre los nodos A y B hay dos caminos. Por uno: ', v('r', `R1 = ${f(R[0])} Ω`), ' de A a C y ', v('r', `R2 = ${f(R[1])} Ω`), ' de C a B. Por el otro: ',
      v('r', `R3 = ${f(R[2])} Ω`), ' de A a D y ', v('r', `R4 = ${f(R[3])} Ω`), ' de D a B. ', ...central];
  }
  // Potenciales de C y D con A a E voltios y B a 0 (regla de Cramer sobre los dos nodos).
  function puenteNodal(R, R5, E) {
    const g = R.map(x => 1 / x), g5 = 1 / R5;
    const a11 = g[0] + g[1] + g5, a22 = g[2] + g[3] + g5, b1 = E * g[0], b2 = E * g[2];
    const det = a11 * a22 - g5 * g5;
    const VC = (b1 * a22 + g5 * b2) / det, VD = (a11 * b2 + g5 * b1) / det;
    return { VC, VD, It: (E - VC) * g[0] + (E - VD) * g[2], I5: (VC - VD) * g5 };
  }
  function puente(rng, semilla, sub, eq) {
    if (sub === 'req' || sub === 'corriente' || sub === 'r5') {
      // req y corriente: mitad equilibrados (R1/R2 = R3/R4) y mitad no; r5: nunca equilibrado.
      const equilibrado = sub !== 'r5' && eq;
      let R;
      if (equilibrado) {
        const R1 = rng.elegir(RP), R2 = rng.elegir(RP), k = rng.elegir([1, 2, 3, 0.5, 1.5]);
        R = [R1, R2, R1 * k, R2 * k];
        if (R1 === R2 && k === 1) return null; // todo igual: muy evidente
        if (!Number.isInteger(R[2]) || !Number.isInteger(R[3])) return null;
      } else {
        R = [rng.elegir(RP), rng.elegir(RP), rng.elegir(RP), rng.elegir(RP)];
        if (R[0] * R[3] === R[1] * R[2]) return null;
      }
      const R5 = rng.elegir(RP);
      const E = sub === 'req' ? rng.elegir([6, 12, 24, 30, 60]) : rng.elegir([6, 9, 12, 18, 20, 24, 30, 36, 48, 60]);
      const n = puenteNodal(R, R5, E), Req = E / n.It;
      if (!limpio(Req)) return null;
      if (!equilibrado && (!limpio(Math.abs(n.VC)) || !limpio(Math.abs(n.VD)))) return null;
      if (!limpio(n.It) || n.It > 50) return null;
      if (sub === 'r5' && (!limpio(Math.abs(n.I5)) || Math.abs(n.I5) < 0.05)) return null;
      const enunciado = puenteTexto(R, ['Además, entre C y D hay una ', v('r', `R5 = ${f(R5)} Ω`), '.',
        ...(sub === 'req' ? [] : [' Una pila ideal de ', v('e', `ε = ${f(E)} V`), ' se conecta entre A y B', sub === 'corriente' ? ', con un amperímetro ideal en serie con ella.' : '.'])]);
      const sinR5 = par(R[0] + R[1], R[2] + R[3]), conCable = par(R[0], R[2]) + par(R[1], R[3]);
      const r12 = `${f(R[0])}/${f(R[1])}`, r34 = `${f(R[2])}/${f(R[3])}`;
      const resistencias = [
        h('PU-puente-en-serie', par(R[0], R[2]) + R5 + par(R[1], R[3]), 'Pusiste R5 en serie entre los dos pares, como si toda la corriente tuviera que cruzar el puente. R5 une C con D: por ella pasa, como mucho, una parte de la corriente.'),
        h('PU-puente-en-paralelo', par(sinR5, R5), 'Pusiste R5 en paralelo con todo, entre A y B. R5 no une A con B: une C con D.'),
        h('RES-paralelo-como-serie', R[0] + R[1] + R[2] + R[3], 'Sumaste los dos caminos como si estuvieran en serie. Los caminos A-C-B y A-D-B salen de A y llegan a B: están en paralelo.'),
        h('PU-un-camino', R[0] + R5 + R[3], 'Seguiste un solo camino, A-C-D-B, pasando por el puente. La corriente se reparte por varios caminos.'),
      ];
      if (!equilibrado) resistencias.unshift(
        h('PU-como-equilibrado', sinR5, `Quitaste R5 como si el puente estuviera equilibrado. Compruébalo antes: R1/R2 = ${r12} y R3/R4 = ${r34} no son iguales, así que C y D no quedan al mismo potencial y por R5 sí pasa corriente.`),
        h('PU-como-cable', conCable, `Tomaste R5 como un cable que une C con D. Eso solo da lo mismo en un puente equilibrado, y aquí R1/R2 = ${r12} no es igual a R3/R4 = ${r34}.`));
      const sol0 = equilibrado
        ? ['R1/R2 = ', r12, ' y R3/R4 = ', r34, ': son iguales, el puente está equilibrado. C y D quedan al mismo potencial y por R5 no pasa corriente: se puede quitar.']
        : ['R1/R2 = ', r12, ' y R3/R4 = ', r34, ': no son iguales, el puente no está equilibrado y R5 sí lleva corriente. No es serie ni paralelo: se resuelve con potenciales de nodo (o pasando un triángulo a estrella).'];
      const sol1 = equilibrado
        ? ['Quedan dos caminos en paralelo: ', v('r', `R1 + R2 = ${f(R[0] + R[1])} Ω`), ' y ', v('r', `R3 + R4 = ${f(R[2] + R[3])} Ω`), `. Req = ${f(R[0] + R[1])} · ${f(R[2] + R[3])}/(${f(R[0] + R[1])} + ${f(R[2] + R[3])}) = ${f(Req)} Ω.`]
        : [sub === 'req' ? `Pon una pila de prueba de ${f(E)} V entre A y B (A a ${f(E)} V, B a 0 V). ` : `A a ${f(E)} V y B a 0 V. `,
          `Nodo C: (${f(E)} − VC)/${f(R[0])} = VC/${f(R[1])} + (VC − VD)/${f(R5)}. Nodo D: (${f(E)} − VD)/${f(R[2])} = VD/${f(R[3])} + (VD − VC)/${f(R5)}. Salen VC = ${f(n.VC)} V y VD = ${f(n.VD)} V.`];
      const sol2 = equilibrado ? [] : [[`Corriente que sale de A: (${f(E)} − ${f(n.VC)})/${f(R[0])} + (${f(E)} − ${f(n.VD)})/${f(R[2])} = ${f(n.It)} A`, sub === 'req' ? `, así que Req = ${f(E)}/${f(n.It)} = ${f(Req)} Ω.` : '.']];
      const datos = { tipo: 'puente', sub, R, R5, ...(sub === 'req' ? {} : { E }) };
      if (sub === 'req') {
        return cerrar(rng, semilla, { correcta: Req, errores: resistencias, unidad: 'Ω', enunciado, pregunta: ['¿Cuál es la ', v('x', 'resistencia equivalente'), ' entre A y B?'],
          solucion: [sol0, sol1, ...sol2, ['La resistencia equivalente es ', v('x', `${f(Req)} Ω`), '.']], datos });
      }
      if (sub === 'corriente') {
        const errs = resistencias.map(er => ({ ...er, valor: E / er.valor, explicacion: 'Usaste una resistencia equivocada. ' + er.explicacion }));
        return cerrar(rng, semilla, { correcta: n.It, errores: errs, unidad: 'A', enunciado, pregunta: ['¿Cuánto marca el ', v('x', 'amperímetro'), '?'],
          solucion: [sol0, sol1, ...sol2, ['El amperímetro marca ', v('x', `${f(n.It)} A`), equilibrado ? ` (ε/Req = ${f(E)}/${f(Req)}).` : '.']], datos });
      }
      // r5: corriente por R5
      const correcta = Math.abs(n.I5);
      const VC0 = E * R[1] / (R[0] + R[1]), VD0 = E * R[3] / (R[2] + R[3]);
      const Ra = par(R[0], R[2]), VM = E * par(R[1], R[3]) / (Ra + par(R[1], R[3]));
      const errores = [
        h('PU-tramo-abierto', Math.abs(VC0 - VD0) / R5, 'Calculaste VC y VD como si R5 no estuviera, y dividiste su diferencia entre R5. Al conectar R5, la corriente que pasa por ella cambia esos potenciales: hay que plantear los nodos con R5 puesta.'),
        h('PU-todo-el-voltaje', E / R5, 'Pusiste todo el voltaje de la pila sobre R5. R5 no va de A a B: va de C a D, que están a potenciales parecidos.'),
        h('PU-como-cable', Math.abs((E - VM) / R[0] - VM / R[1]), 'Calculaste la corriente como si R5 fuera un cable (sin resistencia). R5 frena la corriente y cambia los potenciales de C y D.'),
        h('PU-total', n.It, 'Esa es la corriente que da la pila. Por R5 pasa solo una parte: la que no sigue por R2 (o por R4).'),
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'A', enunciado, pregunta: ['¿Qué ', v('x', 'corriente'), ' pasa por R5?'],
        solucion: [sol0, sol1, ['Por R5: ', v('x', `|VC − VD|/R5 = ${f(Math.abs(n.VC - n.VD))}/${f(R5)} = ${f(correcta)} A`), n.I5 > 0 ? ', de C hacia D.' : ', de D hacia C.']], datos });
    }
    if (sub === 'amperimetro') {
      const R = [rng.elegir(RP), rng.elegir(RP), rng.elegir(RP), rng.elegir(RP)];
      if (R[0] * R[3] === R[1] * R[2]) return null; // equilibrado: el amperímetro marcaría 0
      const E = rng.elegir([6, 9, 12, 18, 20, 24, 30, 36, 48, 60]);
      const Ra = par(R[0], R[2]), Rb = par(R[1], R[3]), It = E / (Ra + Rb);
      const VAM = It * Ra, I1 = VAM / R[0], I2 = (E - VAM) / R[1], Iam = I1 - I2;
      const correcta = Math.abs(Iam);
      if (!limpio(correcta) || !limpio(It) || !limpio(I1) || !limpio(Ra) || !limpio(Rb) || correcta > 50) return null;
      const enunciado = puenteTexto(R, ['Entre C y D hay un amperímetro ideal. Una pila ideal de ', v('e', `ε = ${f(E)} V`), ' se conecta entre A y B.']);
      const errores = [
        h('PU-total', It, 'Esa es la corriente que da la pila. El amperímetro está en el tramo central: marca solo la diferencia entre lo que llega a C por R1 y lo que sale de C por R2.'),
        h('PU-una-rama', I1, 'Esa es la corriente por R1. Por el amperímetro pasa la diferencia entre lo que llega a C por R1 y lo que sale de C por R2: hay que calcular las dos y restar.'),
        h('PU-tramo-abierto', Math.abs(E / (R[0] + R[1]) - E / (R[2] + R[3])), 'Calculaste las corrientes de los dos caminos como si el tramo central no existiera, y las restaste. El amperímetro ideal es un cable: une C con D y cambia el circuito.'),
        Iam > 0
          ? pa('C11-mitades', I1 / 2, `Supusiste que la corriente que llega a C por R1 (${f(I1)} A) se reparte por mitades entre R2 y el amperímetro. No hay por qué: el amperímetro ideal no tiene resistencia y R2 sí. Lo que cruza es lo que llega por R1 menos lo que sigue por R2.`)
          : pa('C11-mitades', VAM / R[2] / 2, `Supusiste que la corriente que llega a D por R3 (${f(VAM / R[2])} A) se reparte por mitades entre R4 y el amperímetro. No hay por qué: el amperímetro ideal no tiene resistencia y R4 sí. Lo que cruza es lo que llega por R3 menos lo que sigue por R4.`),
      ];
      const solucion = [
        ['El amperímetro ideal no tiene resistencia: C y D quedan unidos. Así, ', v('r', 'R1'), ' y ', v('r', 'R3'), ` quedan en paralelo (${f(Ra)} Ω), y `, v('r', 'R2'), ' y ', v('r', 'R4'), ` también (${f(Rb)} Ω), en serie entre sí.`],
        [`Corriente de la pila: ${f(E)}/(${f(Ra)} + ${f(Rb)}) = ${f(It)} A. Voltaje entre A y C: ${f(It)} · ${f(Ra)} = ${f(VAM)} V.`],
        ['Por R1: ', v('i', `${f(VAM)}/${f(R[0])} = ${f(I1)} A`), '. Por R2: ', v('i', `${f(E - VAM)}/${f(R[1])} = ${f(I2)} A`), '. La diferencia cruza el amperímetro: ', v('x', `${f(correcta)} A`), Iam > 0 ? ', de C hacia D.' : ', de D hacia C.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'A', enunciado, pregunta: ['¿Cuánto marca el ', v('x', 'amperímetro'), '?'], solucion, datos: { tipo: 'puente', sub, R, E } });
    }
    // corto: R1 de A a C, R2 de C a B, R3 de A a B y un cable que une C con B (o A con C).
    const R = [rng.elegir(RP), rng.elegir(RP), rng.elegir(RP)];
    const cable = rng.elegir(['CB', 'AC']);
    const queda = cable === 'CB' ? 0 : 1; // la que no queda en corto
    const correcta = par(R[queda], R[2]);
    if (!limpio(correcta)) return null;
    const enunciado = ['Entre los nodos A y B: ', v('r', `R1 = ${f(R[0])} Ω`), ' va de A a C, ', v('r', `R2 = ${f(R[1])} Ω`), ' va de C a B y ', v('r', `R3 = ${f(R[2])} Ω`),
      ' va directamente de A a B. Además, un cable sin resistencia une ', cable === 'CB' ? 'C con B.' : 'A con C.'];
    const corta = cable === 'CB' ? 'R2' : 'R1';
    const errores = [
      pa('C12-corto', par(R[0] + R[1], R[2]), `No viste el corto. El cable une los dos extremos de ${corta}: la corriente pasa por el cable y ${corta} no lleva nada.`),
      h('RES-todo-serie', R[0] + R[1] + R[2], 'Sumaste todo como si fuera una sola fila. R3 va de A a B por su cuenta: está en paralelo con el resto.'),
      h('PU-corto-en-serie', par(R[queda], R[2]) + R[1 - queda], `Dejaste ${corta} en serie con el resto. Sus dos extremos están unidos por un cable: no hay voltaje entre ellos y no pasa corriente.`),
      h('RES-todo-paralelo', 1 / (1 / R[0] + 1 / R[1] + 1 / R[2]), 'Pusiste las tres en paralelo. Solo están en paralelo las que van entre los mismos dos nodos; mira qué nodos quedan unidos por el cable.'),
    ];
    const solucion = [
      ['El cable une ', cable === 'CB' ? 'C con B' : 'A con C', `: son un mismo nodo. ${corta} tiene sus dos extremos en ese nodo y queda en corto.`],
      [cable === 'CB' ? 'Quedan R1 (de A a C, que ahora es B) y R3, las dos entre A y B: en paralelo.' : 'Quedan R2 (de C, que ahora es A, a B) y R3, las dos entre A y B: en paralelo.'],
      [v('x', 'Req'), ` = ${f(R[queda])} · ${f(R[2])}/(${f(R[queda])} + ${f(R[2])}) = `, v('x', `${f(correcta)} Ω`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', enunciado, pregunta: ['¿Cuál es la ', v('x', 'resistencia equivalente'), ' entre A y B?'], solucion, datos: { tipo: 'puente', sub, R, cable } });
  }

  // ---------------- Pilas reales ----------------
  const OBJ = ['una linterna', 'un radio pequeño', 'un foquito', 'un timbre', 'un juguete'];
  function pilas(rng, semilla, sub) {
    if (sub === 'grafica') {
      const E = rng.elegir([3, 4.5, 6, 9, 12, 18, 24]), r = rng.elegir([0.5, 1, 1.5, 2, 3]);
      const Ra = rng.elegir([0.5, 1, 2, 3, 4, 5]), Rb = Ra + rng.elegir([1, 2, 3, 4, 6, 8, 10]);
      const Ia = E / (Ra + r), Ib = E / (Rb + r);
      if (!limpio(Ia) || !limpio(Ib)) return null;
      const pide = rng.elegir(['r', 'fem']);
      const enunciado = ['Una batería real se conecta a un reóstato (resistencia externa variable). Al medir la corriente para distintos valores del reóstato, la gráfica de la corriente contra la resistencia externa pasa por los puntos (',
        v('r', `${f(Ra)} Ω`), '; ', v('i', `${f(Ia)} A`), ') y (', v('r', `${f(Rb)} Ω`), '; ', v('i', `${f(Ib)} A`), ').'];
      const sol = [['La misma batería en los dos puntos: ', v('e', 'ε'), ' = I·(R + r). Así: ', `${f(Ia)} · (${f(Ra)} + r) = ${f(Ib)} · (${f(Rb)} + r).`],
        [`Despejando: r = (${f(Ib)} · ${f(Rb)} − ${f(Ia)} · ${f(Ra)})/(${f(Ia)} − ${f(Ib)}) = ${f(r)} Ω, y ε = ${f(Ia)} · (${f(Ra)} + ${f(r)}) = ${f(E)} V.`]];
      if (pide === 'r') {
        const errores = [
          h('PI-pendiente', (Rb - Ra) / (Ia - Ib), 'Tomaste ΔR/ΔI como si fuera la resistencia interna. La gráfica I contra R no es una recta; hay que plantear ε = I·(R + r) en los dos puntos.'),
          h('PI-r-total', Ra + r, 'Esa es la resistencia total del circuito en el primer punto (R + r), no la resistencia interna sola. Falta restar el reóstato.'),
          h('PI-signo', (Ib * Rb + Ia * Ra) / (Ia - Ib), 'Al restar las dos ecuaciones cambiaste un signo. De Ia·(Ra + r) = Ib·(Rb + r) sale r·(Ia − Ib) = Ib·Rb − Ia·Ra.'),
          h('PI-sin-r', Ib * Rb / Ia - Ra, 'Tomaste Ib·Rb, el voltaje en el reóstato, como si fuera la fem, y despejaste r con el otro punto. Ese voltaje no es la fem: dentro de la batería también se pierde I·r. Plantea ε = I·(R + r) en los dos puntos.'),
        ];
        return cerrar(rng, semilla, { correcta: r, errores, unidad: 'Ω', enunciado, pregunta: ['¿Cuál es la ', v('x', 'resistencia interna'), ' de la batería?'],
          solucion: [...sol, ['Resistencia interna: ', v('x', `r = ${f(r)} Ω`), '.']], datos: { tipo: 'pilas', sub, pide, puntos: [[Ra, Ia], [Rb, Ib]] } });
      }
      const rp = (Rb - Ra) / (Ia - Ib);
      const errores = [
        h('PI-sin-r', Ia * Ra, 'Aplicaste Ohm solo al reóstato: Ia·Ra. Esa es la diferencia de potencial en los bornes, no la fem: dentro de la batería también se pierde I·r.'),
        h('PI-sin-r', Ib * Rb, 'Aplicaste Ohm solo al reóstato: Ib·Rb. Esa es la diferencia de potencial en los bornes, no la fem: falta la caída I·r dentro de la batería.'),
        h('PI-pendiente', Ia * (Ra + rp), 'Tomaste ΔR/ΔI como la resistencia interna y la usaste en ε = I·(R + r). La gráfica no es una recta: plantea ε = I·(R + r) en los dos puntos.'),
        h('PI-suma-lecturas', Ia * Ra + Ib * Rb, 'Sumaste los dos voltajes de bornes. Cada punto da la misma fem por separado: ε = I·(R + r) en cada uno.'),
      ];
      return cerrar(rng, semilla, { correcta: E, errores, unidad: 'V', enunciado, pregunta: ['¿Cuál es la ', v('x', 'fem'), ' de la batería?'],
        solucion: [...sol, ['Fem: ', v('x', `ε = ${f(E)} V`), '.']], datos: { tipo: 'pilas', sub, pide, puntos: [[Ra, Ia], [Rb, Ib]] } });
    }
    const n = rng.elegir([2, 3, 4]), E = rng.elegir([1.5, 2, 3, 6, 9, 12]), r = rng.elegir([0.2, 0.5, 1, 1.5, 2]);
    const R = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10, 12]);
    const medidor = rng.elegir(['A', 'V']);
    const serie = sub === 'serie';
    const Eeq = serie ? n * E : E, req = serie ? n * r : r / n;
    const I = Eeq / (R + req), V = I * R;
    const correcta = medidor === 'A' ? I : V;
    if (!limpio(I) || !limpio(V) || !limpio(req)) return null;
    const obj = rng.elegir(OBJ);
    const enunciado = [`${n} pilas iguales, cada una de `, v('e', `ε = ${f(E)} V`), ' y resistencia interna ', v('r', `r = ${f(r)} Ω`),
      serie ? ', se conectan en serie (el borne + de cada una con el − de la siguiente)' : ', se conectan en paralelo (todos los bornes + juntos y todos los − juntos)',
      ` y alimentan ${obj} de resistencia `, v('r', `R = ${f(R)} Ω`), '. ',
      medidor === 'A' ? 'Un amperímetro ideal está en serie con el aparato.' : 'Un voltímetro ideal está conectado entre los bornes del arreglo de pilas.'];
    const pregunta = ['¿Cuánto marca el ', v('x', medidor === 'A' ? 'amperímetro' : 'voltímetro'), '?'];
    const aV = x => (medidor === 'A' ? x : x * R);
    const errores = serie ? [
      h('PI-sin-r', aV(n * E / R), 'Ignoraste la resistencia interna de las pilas. Cada pila real tiene r, y en serie se suman: la corriente es nε/(R + nr).'),
      h('PI-r-una-vez', aV(n * E / (R + r)), 'Contaste la resistencia interna de una sola pila. En serie, las resistencias internas también se suman: nr.'),
      h('PI-no-suma-fem', aV(E / (R + n * r)), 'No sumaste las fem. En serie, cada pila sube el potencial: la fem del arreglo es nε.'),
    ] : [
      doc('C6-paralelo-suma', aV(n * E / (R + r / n)), 'Sumaste las fem como si estuvieran en serie. En paralelo, la fem del arreglo es la de una sola pila; lo que mejora es la resistencia interna, r/n.'),
      h('PR5-r-paralelo', aV(E / (R + n * r)), 'Sumaste las resistencias internas como si estuvieran en serie. En paralelo quedan n resistencias iguales en paralelo: r/n.', TR),
      h('PI-sin-r', aV(E / R), 'Ignoraste la resistencia interna. Las pilas reales tienen r; en paralelo queda r/n en serie con R.'),
      h('PI-r-una-vez', aV(E / (R + r)), 'Usaste la resistencia interna de una sola pila. En paralelo, las n resistencias internas quedan en paralelo: r/n.'),
    ];
    if (medidor === 'V') {
      errores.unshift(h('PI-fem-por-borne', Eeq, `Leíste la fem del arreglo. Pasa corriente, así que dentro de las pilas se pierde I·${serie ? 'nr' : 'r/n'}: el voltímetro marca ε${serie ? '·n' : ''} − I·${serie ? 'nr' : 'r/n'}.`),
        h('PI-caida-interna', I * req, 'Esa es la caída dentro de las pilas, no la lectura. El voltímetro entre los bornes marca la fem menos esa caída, que es lo mismo que I·R.'));
    }
    const solucion = [
      serie ? ['En serie: fem ', v('e', `nε = ${n} · ${f(E)} = ${f(Eeq)} V`), ' y resistencia interna ', v('r', `nr = ${n} · ${f(r)} = ${f(req)} Ω`), '.']
        : ['En paralelo: la fem es la de una pila, ', v('e', `${f(E)} V`), ', y las resistencias internas quedan en paralelo: ', v('r', `r/n = ${f(r)}/${n} = ${f(req)} Ω`), '.'],
      ['Corriente: ', v('i', 'I'), ` = ${f(Eeq)}/(${f(R)} + ${f(req)}) = `, medidor === 'A' ? v('x', `${f(I)} A`) : v('i', `${f(I)} A`), '.'],
    ];
    if (medidor === 'V') solucion.push(['El voltímetro marca la fem menos la caída interna, que es igual al voltaje en el aparato: ', v('x', `V = I·R = ${f(I)} · ${f(R)} = ${f(V)} V`), '.']);
    else solucion.push(['El amperímetro ideal marca esa corriente: ', v('x', `${f(I)} A`), '.']);
    return cerrar(rng, semilla, { correcta, errores, unidad: medidor === 'A' ? 'A' : 'V', enunciado, pregunta, solucion, datos: { tipo: 'pilas', sub, n, E, r, R, medidor } });
  }

  return { id: 'circuitos-mallas', titulo: 'Dos pilas y una malla', generar };
});
