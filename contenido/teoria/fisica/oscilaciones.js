/*
 * Teoría de «Movimiento armónico simple» (fisica.oscilaciones). Molde de docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 9), precisiones de física del expediente y
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (códigos O1–O4).
 * Colores (regla 4): x posición turquesa (c-i), v velocidad naranja (c-o), a aceleración verde (c-d),
 * t y T tiempo y período rojo (c-h). m, k, ω, L, g, K, U y E van en tinta.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los cinco temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): OS-EXTREMO, OS-AFUERA, OS-CONSTANTE, OS-SIGNO, OS-LINEAL,
 * OS-MEDIO, OS-CENTRO-QUIETO, OS-OMEGA, OS-SIN-RAIZ, OS-INV, OS-VERTICAL, OS-MITAD, OS-CENTRO, OS-TODO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que en el MAS la aceleración apunta al centro y crece con la distancia, y qué decide el período.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla a, vmáx, el período de un resorte o un péndulo y dónde K = U.
 *   Orden de atención: 1.º el bloque o la gráfica · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué en el extremo, donde se detiene, la aceleración es la mayor?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, v = { v: 'c-o', t: 'v' }, a = { v: 'c-d', t: 'a' }, t = { v: 'c-h', t: 't' }, T = { v: 'c-h', t: 'T' };
  const PI = Math.PI;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura (geometria o escala de la
  // pieza) y su inversa da los valores; el lector los ajusta al paso y al rango de cada control.
  const PZ = id => Kit.piezas[id];
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  // Manija sobre un punto de una gráfica de la pieza ejes, con los mismos datos que dibuja el juego.
  const enEjes = (datos, xx, yy) => { const g = PZ('ejes').geometria(datos); return { x: g.X(xx), y: g.Y(yy) }; };
  const muestras = (fn, x0, x1, n = 61) => Array.from({ length: n }, (_, i) => { const u = x0 + (x1 - x0) * i / (n - 1); return [u, fn(u)]; });

  // ---------- Idea 1: la aceleración apunta al centro ----------
  // Cambia: dónde está el bloque · Permanece: el resorte (k = 50 N/m), la masa (0,5 kg) y la amplitud 0,2 m ·
  // Progresa: la flecha de a, que crece al alejarse del centro · Se reserva: el extremo, donde v = 0 ·
  // Debe verse: a apunta siempre al equilibrio y es proporcional a x; en el extremo es máxima aunque v sea 0.
  const K1 = 50, M1 = 0.5, A1 = 0.2, W1 = Math.sqrt(K1 / M1);
  const bloque = (xx, o = {}) => ({
    A: A1, unidad: 'm', x: xx, v: o.sinV ? null : -W1 * Math.sqrt(Math.max(0, A1 * A1 - xx * xx)), a: o.sinA ? null : -W1 * W1 * xx,
    escalaV: 40, escalaA: 4, colores: { x: 'i', v: 'o', a: 'd' },
    textoA: o.sinA ? undefined : `a = ${f(-W1 * W1 * xx, 0)} m/s²`, marcas: o.marcas,
  });
  // Animación (decisión de Gerson, 15 nov: física se mueve sola). El bloque oscila en cámara lenta: un período (0,63 s)
  // cada 4 s de pantalla. x, v y a salen de x = A cos(ωt), con ω = √(k/m) = 10 rad/s (regla 1).
  const PASO_T1 = Math.round(2 * PI / W1 / 24 * 1e4) / 1e4, T1 = PASO_T1 * 24;
  const r0 = n => (Math.abs(n) < 5e-3 ? 0 : n);
  const xT = tt => A1 * Math.cos(W1 * tt), vT = tt => -A1 * W1 * Math.sin(W1 * tt);
  const bloqueT = tt => Object.assign(bloque(xT(tt)), { v: r0(vT(tt)), a: r0(-W1 * W1 * xT(tt)), textoA: `a = ${f(r0(-W1 * W1 * xT(tt)), 0)} m/s²` });
  const centro = {
    id: 'aceleracion-al-centro',
    titulo: 'La aceleración apunta al centro',
    temas: ['Movimiento periódico y oscilatorio'],
    pieza: 'fis-resorte',
    // Lee (fase 2): contexto y vocabulario (equilibrio, elongación, amplitud). No dice cuánto vale ni hacia dónde
    // apunta la aceleración en el extremo de «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Cosas que van y vienen', texto: 'Un columpio en el parque, la cuerda de una guitarra, la suspensión de una combi en una calle con baches de Juliaca: todos van y vienen alrededor de un punto. Ese vaivén se llama oscilación.' },
        { titulo: 'El centro y los extremos', texto: ['El punto donde el cuerpo podría quedarse quieto es la posición de equilibrio. La elongación ', x, ' dice cuánto se apartó de ahí, con signo: a la derecha es positiva; a la izquierda, negativa.'] },
        { titulo: 'Hasta dónde llega', texto: 'Lo más que se aparta, a un lado o al otro, es la amplitud A. Si va de −0,2 m a +0,2 m, la amplitud es 0,2 m.' },
        { titulo: 'Qué mirar', texto: ['Al jugar, la flecha naranja es la velocidad ', v, ' y la verde, la aceleración ', a, '. Mira hacia dónde apunta la verde a cada lado del centro.'] },
      ],
    },
    juega: {
      consigna: 'El bloque oscila solo, en cámara lenta, entre −0,2 m y +0,2 m. Mira la flecha verde en cada lado. Para detenerlo, pausa o arrástralo.',
      voz: 'Fíjate hacia dónde apunta la flecha verde en cada lado.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-h', min: 0, max: T1, paso: PASO_T1, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: T1 / 4 } }],
      dibujo: val => ({ datos: bloqueT(val.t), estado: {} }),
      lectura: val => [x, ` = ${f(r0(xT(val.t)))} m · `, a, ` = ${f(r0(-W1 * W1 * xT(val.t)), 0)} m/s²`],
      minimo: 2,
      // Arrastra el bloque: lo detiene ahí (la animación se pausa) y las flechas de v y a responden.
      arrastres: [
        { id: 'bloque', etiqueta: 'bloque', color: 'c-i',
          donde: val => ({ x: PZ('fis-resorte').escala(bloqueT(val.t), xT(val.t)), y: PZ('fis-resorte').constantes.centroY }),
          mover: (pt, val) => {
            const q = inversa(qq => PZ('fis-resorte').escala(bloqueT(val.t), qq), -A1, A1)(pt.x);
            const ang = Math.acos(Math.max(-1, Math.min(1, q / A1))) / W1;      // en la primera mitad va a la izquierda
            return { t: val.t > T1 / 2 ? T1 - ang : ang };
          } },
      ],
    },
    predice: {
      pregunta: 'El bloque llega al extremo derecho, x = +0,2 m, y se detiene un instante antes de volver. Justo ahí, su aceleración es…',
      opciones: [
        { id: 'c', texto: 'la mayor, hacia el centro', correcta: true },
        { id: 'cero', texto: 'cero, porque está detenido', error: 'OS-EXTREMO', siFuera: 'v = 0 es cierto. Pero el resorte está más estirado que nunca y tira con más fuerza.' },
        { id: 'afuera', texto: 'la mayor, hacia afuera', error: 'OS-AFUERA', siFuera: 'Hacia afuera iba la velocidad antes de llegar. El resorte tira hacia la pared.' },
        { id: 'igual', texto: 'la misma que en el centro', error: 'OS-CONSTANTE', siFuera: 'Igual sería cierto con fuerza constante. El resorte tira más cuanto más se estira.' },
      ],
      dibujo: { datos: bloque(0.1), estado: {} },
      revelar: { datos: Object.assign(bloque(0.2), { v: 0, textoV: 'v = 0' }), estado: {} },
      coincide: 'Coincide: en el extremo el resorte tira más fuerte: a = −100 · 0,2 = −20 m/s².',
    },
    // Hallazgo 9: el juego mueve el bloque y «Mira» pasa a la gráfica a–x a propósito: cada flecha verde que se vio
    // es un punto de esa recta (mismo x, mismo color); la recta deja ver la proporción que las flechas solo sugieren.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: -0.2, max: 0.2, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
        y: { min: -20, max: 20, paso: 10, nombre: 'a', unidad: 'm/s²', decimales: 0, color: 'd' },
        curvas: [{ puntos: [[-0.2, 20], [0.2, -20]], color: 'd', desde: 2 }],
        puntos: [{ x: 0.1, y: -10, color: 'd', rotulo: '−10', desde: 1 }, { x: 0.2, y: -20, color: 'd', rotulo: '−20', desde: 3 }, { x: 0, y: 0, color: 'd', rotulo: 'centro: 0', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'En x = 0,1 m el resorte tira con F = −k x = −5 N.', ecuacion: [a, ' = ', { frac: ['−5', '0,5'] }, ' = −10 m/s²'] },
        { estado: { corte: 2 }, texto: 'a es proporcional a x y de signo contrario: una recta.', ecuacion: [a, ' = −', { frac: ['k', 'm'] }, ' ', x, ' = −100 ', x] },
        { estado: { corte: 3 }, texto: 'En el centro a = 0; en los extremos, la mayor.', ecuacion: [{ sub: [a, 'máx'] }, ' = 100 · 0,2 = 20 m/s²'] },
        { estado: { corte: 3 }, texto: 'Una fuerza recuperadora, que siempre apunta al centro, produce un vaivén: un MAS.', ecuacion: ['ω = √(k/m) = 10 rad/s'] },
      ],
    },
    regla: {
      texto: 'En un movimiento armónico simple la aceleración apunta siempre a la posición de equilibrio y es proporcional a la elongación x, que mide cuánto se apartó de ella.',
      ecuacion: [a, ' = ', { llave: ['−', { sup: ['ω', '2'] }, ' ', x], nota: 'hacia el centro', color: 'c-d' }, '   ·   ', { sup: ['ω', '2'] }, ' = ', { frac: ['k', 'm'] }],
      condicion: 'x se mide desde el equilibrio; resorte ideal y sin rozamiento.',
    },
    // Así se resuelve: aceleración en una posición, calculado igual que «Ahora tú» (a = −k x / m, mismos k, m y x).
    resuelve: {
      pieza: 'fis-resorte',
      generar(sm) {
        const r = azar(sm + 900), k = r.de([20, 40, 50, 80, 100]), m = r.de([0.2, 0.5, 1, 2]), xx = r.de([-0.15, -0.1, -0.05, 0.05, 0.1, 0.2]);
        const F = -k * xx, ac = F / m, lado = xx > 0 ? 'derecha' : 'izquierda', haciaA = ac > 0 ? 'derecha' : 'izquierda';
        const col = { x: 'i', v: 'o', a: 'd' };
        return {
          enunciado: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Qué aceleración tiene cuando está en `, x, ` = ${f(xx)} m?`],
          dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, colores: col }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la aceleración ', a, ' del bloque en ese lugar: cuánto vale y hacia dónde apunta.'] },
            { tipo: 'datos', texto: ['La masa, la constante del resorte y la elongación, medida desde el centro.'],
              ecuacion: [`m = ${f(m)} kg   ·   k = ${f(k)} N/m   ·   `, x, ` = ${f(xx)} m`] },
            { tipo: 'regla', texto: 'El resorte tira hacia el centro, más fuerte cuanto más se apartó el bloque. La aceleración es esa fuerza dividida entre la masa.',
              ecuacion: ['F = −k ', x, '   ·   ', a, ' = ', { frac: ['F', 'm'] }] },
            { tipo: 'cuentas', texto: 'Primero la fuerza del resorte, con su signo; después la divido entre la masa.',
              ecuacion: [`F = −${f(k)} · (${f(xx)}) = ${f(F, 1)} N   →   `, a, ` = ${f(F, 1)} / ${f(m)} = ${f(ac, 1)} m/s²`],
              dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, a: ac, escalaA: Math.min(4, 80 / Math.abs(ac)), textoA: `${f(ac, 1)} m/s²`, colores: col }, estado: {} } },
            { tipo: 'sentido', texto: `El bloque está a la ${lado} del centro y la aceleración apunta a la ${haciaA}: hacia el centro, como debe ser. Y N entre kg da m/s².` },
          ],
          respuesta: [a, ` = ${f(ac, 1)} m/s², hacia la ${haciaA}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-resorte',
      generar(s) {
        const r = azar(s), k = r.de([20, 40, 50, 80, 100]), m = r.de([0.2, 0.5, 1, 2]), xx = r.de([-0.15, -0.1, -0.05, 0.05, 0.1, 0.2]);
        const ac = -k * xx / m;
        return {
          pregunta: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Qué aceleración tiene cuando está en `, x, ` = ${f(xx)} m?`],
          dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, colores: { x: 'i', v: 'o', a: 'd' } }, estado: {} },
          opciones: opciones(ac, [
            { id: 'signo', valor: -ac, error: 'OS-SIGNO', siFuera: 'El valor está bien; el signo no: a apunta hacia el centro.' },
            { id: 'sin-m', valor: -k * xx, error: 'OS-OMEGA', siFuera: 'Esa es la fuerza del resorte; falta dividir entre la masa.' },
            { id: 'por-m', valor: -k * xx * m, error: 'OS-OMEGA', siFuera: 'Eso multiplica por la masa; a = F / m.' },
          ], n => `${f(n, 1)} m/s²`),
          solucion: { texto: 'Fuerza del resorte entre la masa, hacia el centro.', ecuacion: [a, ` = −${f(k)} · (${f(xx)}) / ${f(m)} = ${f(ac, 1)} m/s²`], dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, a: ac, escalaA: Math.min(4, 80 / Math.abs(ac)), textoA: `${f(ac, 1)} m/s²`, colores: { x: 'i', v: 'o', a: 'd' } }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: ecuaciones y gráficas del MAS ----------
  // Cambia: la amplitud y el período · Permanece: la forma coseno, que empieza en el extremo ·
  // Progresa: el tiempo sobre la gráfica · Se reserva: el instante T/4 ·
  // Debe verse: donde x–t es más empinada (en x = 0) la rapidez es máxima; en las crestas, cero.
  const ejeXt = (A, P, extra = {}) => Object.assign({
    x: { min: 0, max: 4, paso: 0.5, cada: 2, nombre: 't', unidad: 's', decimales: 1, color: 'h' },
    y: { min: -0.3, max: 0.3, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
    curvas: [{ puntos: muestras(tt => A * Math.cos(2 * PI * tt / P), 0, 4, 81), color: 'i' }],
  }, extra);
  // El punto azul recorre la curva con el tiempo (t avanza solo, a velocidad real): x(t) se lee en vivo.
  const xDe = val => r0(val.A * Math.cos(2 * PI * (val.t || 0) / val.P));
  const xtJuego = val => ejeXt(val.A, val.P, { puntos: [{ x: val.P, y: val.A, color: 'h', rotulo: `T = ${f(val.P, 1)} s` },
    { x: val.t || 0, y: xDe(val), color: 'i', guias: true }] });
  const vmaxXt = val => val.A * 2 * PI / val.P;
  const graficas = {
    id: 'graficas-mas',
    titulo: 'La posición sigue un coseno',
    temas: ['Ecuaciones y gráficas del MAS'],
    pieza: 'ejes',
    // Lee (fase 2): período, ω y cómo se lee la gráfica x–t. No dice dónde está ni qué rapidez lleva en T/4 («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Lo que se repite', texto: ['El tiempo de una oscilación completa, ida y vuelta, es el período ', T, '. Un columpio de feria tarda unos 3 s; la cuerda de un charango, menos de una centésima de segundo.'] },
        { titulo: 'Una vuelta en el reloj', texto: ['En cada período el ángulo del coseno avanza una vuelta entera, 2π rad. Lo que avanza por segundo es la frecuencia angular ω.'],
          ecuacion: ['ω = ', { frac: ['2π', T] }] },
        { titulo: 'Cómo leer la curva', texto: ['La altura de la curva es la posición ', x, '; el eje horizontal es el tiempo ', t, '. Una cresta es un extremo, +A; un valle, el otro, −A.'] },
        { titulo: 'Qué mirar', texto: 'Al jugar, el punto recorre la curva con el tiempo. Cambia A y T, y mira en qué tramos la curva sube o baja más empinada.' },
      ],
    },
    juega: {
      consigna: 'La curva es la posición x en el tiempo; en t = 0 parte de +A. Cambia la amplitud y el período, y mira la curva.',
      voz: 'Busca dónde la curva es más empinada.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-i', min: 0.1, max: 0.3, paso: 0.05, inicio: 0.2, unidad: 'm', decimales: 2 },
        { id: 'P', etiqueta: 'T', color: 'c-h', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 's', decimales: 1 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 4, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1 } },
      ],
      dibujo: val => ({ datos: xtJuego(val), estado: {} }),
      lectura: val => [x, ` = ${f(xDe(val))} m · `, { sub: [v, 'máx'] }, ` = ${f(vmaxXt(val))} m/s`],
      minimo: 3,
      // Arrastra la cresta marcada: hacia el lado cambia el período; hacia arriba, la amplitud.
      arrastres: [
        { id: 'cresta', etiqueta: 'cresta de la curva', color: 'c-h',
          donde: val => enEjes(xtJuego(val), val.P, val.A),
          mover: (pt, val) => { const g = PZ('ejes').geometria(xtJuego(val)); return { P: g.Xi(pt.x), A: g.Yi(pt.y) }; } },
      ],
    },
    predice: {
      pregunta: ['Con ', x, ' = A cos(ω', t, '), el movimiento sale del extremo +A. Un cuarto de período después, en ', t, ' = T/4, ¿dónde está y cómo se mueve?'],
      opciones: [
        { id: 'c', texto: 'En x = 0, con la mayor rapidez', correcta: true },
        { id: 'lineal', texto: 'En x = A/2, a media rapidez', error: 'OS-LINEAL', siFuera: 'A/2 sería cierto si avanzara a velocidad constante. Empieza lento y acelera.' },
        { id: 'medio', texto: 'En −A, detenido', error: 'OS-MEDIO', siFuera: 'Eso pasa en T/2, a mitad del período, no en un cuarto.' },
        { id: 'quieto', texto: 'En x = 0, detenido', error: 'OS-CENTRO-QUIETO', siFuera: 'En el centro la fuerza es cero, cierto. Pero ahí llega con toda su rapidez.' },
      ],
      dibujo: { datos: ejeXt(0.2, 2), estado: {} },
      revelar: { datos: ejeXt(0.2, 2, { puntos: [{ x: 0.5, y: 0, color: 'i', rotulo: 'T/4: x = 0', guias: true }, { x: 0, y: 0.2, color: 'i', rotulo: '+A' }] }), estado: {} },
      coincide: 'Coincide: en T/4 la curva cruza el eje y es más empinada: ahí la rapidez es máxima.',
    },
    mira: {
      datos: ejeXt(0.2, 2, { puntos: [{ x: 0, y: 0.2, color: 'i', rotulo: '+A: v = 0', desde: 1 }, { x: 0.5, y: 0, color: 'i', rotulo: 'x = 0: v máx', desde: 2 }, { x: 1, y: -0.2, color: 'i', rotulo: '−A', desde: 3 }, { x: 2, y: 0.2, color: 'h', rotulo: 'T = 2 s', guias: true, desde: 4 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En t = 0 está en +A: la curva es plana, v = 0.', ecuacion: [x, ' = A cos(ω', t, ')'] },
        { estado: { corte: 2 }, texto: 'En T/4 cruza el centro con la pendiente más grande.', ecuacion: [{ sub: [v, 'máx'] }, ' = A ω'] },
        { estado: { corte: 3 }, texto: 'En T/2 llega a −A y se detiene otra vez.', ecuacion: [x, ' = −A'] },
        { estado: { corte: 4 }, texto: 'En T vuelve al inicio: es un movimiento periódico.', ecuacion: ['ω = ', { frac: ['2π', T] }, ' = π rad/s'] },
      ],
    },
    regla: {
      texto: 'En el MAS la posición es un coseno del tiempo; ω es su frecuencia angular. La rapidez es máxima en el centro y la aceleración, en los extremos.',
      ecuacion: [x, ' = A cos(ω', t, ' + φ)', '   ·   ', { sub: [v, 'máx'] }, ' = ', { llave: ['Aω'], nota: 'en el centro', color: 'c-o' }, '   ·   ', { sub: [a, 'máx'] }, ' = ', { llave: ['A', { sup: ['ω', '2'] }], nota: 'en los extremos', color: 'c-d' }, '   ·   ', 'ω = ', { frac: ['2π', T] }],
      condicion: 'φ, la fase inicial, fija dónde empieza; con φ = 0 sale del extremo +A en t = 0.',
    },
    // Así se resuelve: rapidez o aceleración máxima, calculado igual que «Ahora tú» (ω = 2π/T; Aω o Aω²; mismo sm % 2).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), A = r.de([0.1, 0.2, 0.25, 0.3]), P = r.de([1, 2, 4]), w = 2 * PI / P, pide = sm % 2 ? 'v' : 'a';
        const vmax = A * w, val = pide === 'v' ? vmax : A * w * w;
        const vm = { sub: [v, 'máx'] }, am = { sub: [a, 'máx'] };
        const marca = pide === 'v' ? { x: P / 4, y: 0, color: 'o', rotulo: 'v máx', guias: true } : { x: 0, y: A, color: 'd', rotulo: 'a máx', guias: true };
        return {
          enunciado: pide === 'v'
            ? ['La gráfica muestra un MAS de amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es su rapidez máxima?`]
            : ['La gráfica muestra un MAS de amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es el valor máximo de su aceleración?`],
          dibujo: { datos: ejeXt(A, P), estado: {} },
          pasos: [
            { tipo: 'pide', texto: pide === 'v' ? ['Piden ', vm, ': la rapidez más grande del vaivén, la que lleva al cruzar el centro.']
              : ['Piden ', am, ': la aceleración más grande del vaivén, la que tiene en los extremos.'] },
            { tipo: 'datos', texto: ['La cresta da la amplitud y la distancia entre dos crestas da el período.'],
              ecuacion: [`A = ${f(A)} m   ·   `, T, ` = ${f(P)} s`] },
            { tipo: 'regla', texto: pide === 'v' ? 'Primero paso el período a frecuencia angular. La rapidez máxima es la amplitud por ω.'
              : 'Primero paso el período a frecuencia angular. La aceleración máxima es la amplitud por ω al cuadrado.',
              ecuacion: ['ω = ', { frac: ['2π', T] }, '   ·   ', pide === 'v' ? vm : am, pide === 'v' ? ' = A ω' : ' = A ω²'] },
            { tipo: 'cuentas', texto: pide === 'v' ? 'Divido 2π entre el período y multiplico por la amplitud.' : 'Divido 2π entre el período, lo elevo al cuadrado y multiplico por la amplitud.',
              ecuacion: [`ω = 2π / ${f(P)} = ${f(w)} rad/s   →   `, pide === 'v' ? vm : am, pide === 'v' ? ` = ${f(A)} · ${f(w)} = ${f(val)} m/s` : ` = ${f(A)} · ${f(w)}² = ${f(val)} m/s²`],
              dibujo: { datos: ejeXt(A, P, { puntos: [marca] }), estado: {} } },
            { tipo: 'sentido', texto: pide === 'v'
              ? `En un período recorre 4A = ${f(4 * A)} m: su rapidez media es ${f(4 * A / P)} m/s. La máxima tiene que ser mayor, y lo es.`
              : `Las unidades: m por (rad/s)² da m/s². Comprobación: la rapidez máxima es ${f(vmax)} m/s, y por ω da otra vez ${f(vmax * w)} m/s².` },
          ],
          respuesta: pide === 'v' ? [vm, ` = ${f(val)} m/s`] : [am, ` = ${f(val)} m/s²`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), A = r.de([0.1, 0.2, 0.25, 0.3]), P = r.de([1, 2, 4]), w = 2 * PI / P, pide = s % 2 ? 'v' : 'a';
        const val = pide === 'v' ? A * w : A * w * w;
        return {
          pregunta: pide === 'v'
            ? ['La gráfica muestra un MAS de amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es su rapidez máxima?`]
            : ['La gráfica muestra un MAS de amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es el valor máximo de su aceleración?`],
          dibujo: { datos: ejeXt(A, P), estado: {} },
          opciones: opciones(val, pide === 'v' ? [
            { id: 'sin-2pi', valor: A / P, error: 'OS-OMEGA', siFuera: 'Eso usa 1/T en vez de ω = 2π/T.' },
            { id: 'acel', valor: A * w * w, error: 'OS-OMEGA', siFuera: 'Esa es la aceleración máxima, Aω².' },
            { id: 'por-t', valor: A * P, error: 'OS-INV', siFuera: 'Eso multiplica por T; con más período, va más lento.' },
          ] : [
            { id: 'vel', valor: A * w, error: 'OS-OMEGA', siFuera: 'Esa es la rapidez máxima, Aω.' },
            { id: 'sin-2pi', valor: A / (P * P), error: 'OS-OMEGA', siFuera: 'Eso usa 1/T en vez de ω = 2π/T.' },
            { id: 'sin-cuad', valor: A * w * 2, error: 'OS-SIN-RAIZ', siFuera: 'ω va al cuadrado, no multiplicado por 2.' },
          ], n => `${f(n)} ${pide === 'v' ? 'm/s' : 'm/s²'}`),
          solucion: { texto: pide === 'v' ? 'Primero ω = 2π/T; la rapidez máxima es Aω.' : 'Primero ω = 2π/T; la aceleración máxima es Aω².', ecuacion: ['ω = ', f(w), ' rad/s', '   ·   ', pide === 'v' ? `${f(A)} · ${f(w)} = ${f(val)} m/s` : `${f(A)} · ${f(w)}² = ${f(val)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 3: el período del resorte ----------
  // Cambia: la masa y el resorte · Permanece: la forma de la curva T–m ·
  // Progresa: el punto sobre la curva · Se reserva: soltar desde el doble de lejos, y colgarlo vertical ·
  // Debe verse: el período depende de m y k, no de la amplitud.
  const periodoR = (m, k) => 2 * PI * Math.sqrt(m / k);
  const ejeTm = (k, extra = {}) => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'm', unidad: 'kg', decimales: 1 },
    y: { min: 0, max: 2, paso: 0.5, nombre: 'T', unidad: 's', decimales: 1, color: 'h' },
    curvas: [{ puntos: muestras(m => periodoR(m, k), 0, 2, 41), color: 'h', rotulo: `k = ${f(k)} N/m`, en: [0.15, 1.75] }],
  }, extra);
  const tmJuego = val => ejeTm(val.k, { puntos: [{ x: val.m, y: periodoR(val.m, val.k), color: 'h', rotulo: `${f(periodoR(val.m, val.k))} s`, guias: true }] });
  const resorteT = {
    id: 'periodo-resorte',
    titulo: 'El período no depende de A',
    temas: ['Masa-resorte horizontal y vertical'],
    pieza: 'ejes',
    // Lee (fase 2): resortes cercanos, la constante k y qué muestra la curva T–m. No dice qué pasa con el período al
    // cambiar la amplitud («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Resortes por todos lados', texto: 'La balanza de resorte del mercado, el amortiguador de una mototaxi, el colchón de resortes: todos se estiran o se encogen y empujan de vuelta. Con algo de masa encima, se ponen a oscilar.' },
        { titulo: 'Duro o blando', texto: 'La constante elástica k dice qué tan duro es el resorte. Con k = 80 N/m, hacen falta 80 N para estirarlo 1 m; con k = 20 N/m, solo 20 N.',
          ecuacion: ['F = −k ', x] },
        { titulo: 'Qué mirar', texto: ['Al jugar, la masa m crece sola y el punto marca el período ', T, ' en la curva. Mira cuánto crece ', T, ' cuando la masa se cuadruplica, y prueba los dos resortes.'] },
      ],
    },
    juega: {
      consigna: 'La masa m crece y decrece sola. Mira el punto: el período sube cada vez menos. Pausa, cambia k o arrastra el punto.',
      voz: 'Mira cuánto crece T cuando la masa se cuadruplica.',
      // Animación (15 nov): la masa barre su rango ida y vuelta (5 s por tramo) y el punto recorre la curva T–m.
      controles: [
        { id: 'm', etiqueta: 'm', min: 0.25, max: 2, paso: 0.25, inicio: 0.5, unidad: 'kg', decimales: 2, auto: { velocidad: 0.35, modo: 'rebota' } },
        { id: 'k', etiqueta: 'Resorte', opciones: [{ valor: 20, texto: 'k = 20 N/m' }, { valor: 80, texto: 'k = 80 N/m' }], inicio: 20 },
      ],
      dibujo: val => ({ datos: tmJuego(val), estado: {} }),
      lectura: val => [T, ` = 2π √(${f(val.m)}/${f(val.k)}) = ${f(periodoR(val.m, val.k))} s`],
      minimo: 3,
      // Arrastra el punto por la curva: su lugar en el eje horizontal es la masa.
      arrastres: [
        { id: 'masa', etiqueta: 'masa m', color: 'c-h',
          donde: val => enEjes(tmJuego(val), val.m, periodoR(val.m, val.k)),
          mover: (pt, val) => ({ m: PZ('ejes').geometria(tmJuego(val)).Xi(pt.x) }) },
      ],
    },
    predice: {
      pregunta: 'La curva muestra un MAS con resorte, de período 1 s, soltado desde 5 cm. Si se suelta desde 10 cm, ¿cuánto dura cada oscilación?',
      opciones: [
        { id: 'c', texto: '1 s, igual', correcta: true },
        { id: 'doble', texto: '2 s: recorre el doble', error: 'O1', siFuera: 'Recorre el doble, cierto. Pero también va más rápido: tarda lo mismo.' },
        { id: 'raiz', texto: 'Unos 1,4 s', error: 'O2', siFuera: 'La raíz aparece con la masa, no con la amplitud.' },
        { id: 'mitad', texto: '0,5 s: el resorte tira más', error: 'O2', siFuera: 'Tira más fuerte, cierto, pero también tiene más camino: se compensa justo.' },
      ],
      dibujo: { datos: ejeXt(0.05, 1, { y: { min: -0.1, max: 0.1, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2, color: 'i' }, x: { min: 0, max: 2, paso: 0.5, nombre: 't', unidad: 's', decimales: 1, color: 'h' }, curvas: [{ puntos: muestras(tt => 0.05 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', rotulo: '5 cm', en: [0.05, 0.05] }] }), estado: {} },
      revelar: { datos: ejeXt(0.05, 1, { y: { min: -0.1, max: 0.1, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2, color: 'i' }, x: { min: 0, max: 2, paso: 0.5, nombre: 't', unidad: 's', decimales: 1, color: 'h' },
        curvas: [{ puntos: muestras(tt => 0.05 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', rotulo: '5 cm', en: [0.05, 0.05] }, { puntos: muestras(tt => 0.1 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', discontinua: true, rotulo: '10 cm', en: [1.5, -0.1] }],
        puntos: [{ x: 1, y: 0.1, color: 'h', rotulo: 'T = 1 s', guias: true }] }), estado: {} },
      coincide: 'Coincide: las dos curvas vuelven a su cresta al mismo tiempo; solo cambia su altura.',
    },
    mira: {
      datos: ejeTm(20, { puntos: [{ x: 0.5, y: periodoR(0.5, 20), color: 'h', rotulo: `${f(periodoR(0.5, 20))} s`, guias: true, desde: 1 }, { x: 2, y: periodoR(2, 20), color: 'h', rotulo: `${f(periodoR(2, 20))} s`, guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 0,5 kg y k = 20 N/m: ω = √(k/m) = √40.', ecuacion: [T, ' = 2π √(0,5/20) ≈ 0,99 s'] },
        { estado: { corte: 2 }, texto: 'Con 4 veces la masa, el período solo se duplica.', ecuacion: [T, ' = 2π √(2/20) ≈ 1,99 s'] },
        { estado: { corte: 2 }, texto: 'La amplitud no aparece en la fórmula.', ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['m', 'k'] }] }] },
        { estado: { corte: 2 }, texto: 'Colgado vertical, el equilibrio baja mg/k; el período es el mismo.', ecuacion: ['Δy = ', { frac: ['m g', 'k'] }] },
      ],
    },
    regla: {
      texto: 'El período de un bloque unido a un resorte depende de la masa y de la rigidez del resorte, no de la amplitud ni de si está horizontal o colgado.',
      ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['m', 'k'] }] }, '   ·   ', 'colgado: el equilibrio baja ', { frac: ['m g', 'k'] }],
      condicion: 'resorte ideal, sin masa propia y sin rozamiento. Colgado, x se mide desde el nuevo equilibrio.',
    },
    // Así se resuelve: período o estiramiento del resorte colgado, calculado igual que «Ahora tú» (periodoR y m g / k;
    // mismo sm % 2).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), m = r.de([0.1, 0.4, 0.9, 1.6, 2.5]), k = r.de([10, 40, 90, 160]);
        if (sm % 2 === 0) {
          const P = periodoR(m, k), q = m / k, raiz = Math.sqrt(q);
          return {
            enunciado: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Cuál es su período? (usa π ≈ 3,14)`],
            pasos: [
              { tipo: 'pide', texto: ['Piden el período ', T, ': cuánto tarda el bloque en ir y volver una vez.'] },
              { tipo: 'datos', texto: 'La masa del bloque y la constante del resorte. La amplitud no la dan, y no hace falta.',
                ecuacion: [`m = ${f(m)} kg   ·   k = ${f(k)} N/m`] },
              { tipo: 'regla', texto: 'Más masa hace el vaivén más lento; un resorte más duro, más rápido. El período es 2π por la raíz de la masa entre la constante.',
                ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['m', 'k'] }] }] },
              { tipo: 'cuentas', texto: 'Divido la masa entre la constante, saco la raíz y multiplico por 2π.',
                ecuacion: [`m/k = ${f(q, 6)}   →   √(${f(q, 6)}) = ${f(raiz, 4)}   →   `, T, ` = 2π · ${f(raiz, 4)} = ${f(P)} s`] },
              { tipo: 'sentido', texto: `Las unidades: kg entre N/m es s², y su raíz da segundos. Vuelta: ω = 2π/T = ${f(2 * PI / P)} rad/s, y su cuadrado es k/m = ${f(k / m, 1)}.` },
            ],
            respuesta: [T, ` = ${f(P)} s`],
          };
        }
        const peso = m * 10, dy = peso / k;
        return {
          enunciado: ['Se cuelga un bloque de ', f(m), ` kg de un resorte vertical de k = ${f(k)} N/m. ¿Cuánto baja hasta su nuevo equilibrio? (g = 10 m/s²)`],
          pasos: [
            { tipo: 'pide', texto: 'Piden cuánto se estira el resorte hasta que el bloque queda quieto colgado: su nuevo equilibrio.' },
            { tipo: 'datos', texto: 'La masa del bloque, la constante del resorte y la gravedad.',
              ecuacion: [`m = ${f(m)} kg   ·   k = ${f(k)} N/m   ·   g = 10 m/s²`] },
            { tipo: 'regla', texto: 'En el nuevo equilibrio el resorte sostiene todo el peso: lo que se estira, por k, iguala a m g.',
              ecuacion: ['k Δy = m g'] },
            { tipo: 'cuentas', texto: 'Calculo el peso y lo divido entre la constante. Después paso de metros a centímetros.',
              ecuacion: [`m g = ${f(m)} · 10 = ${f(peso)} N   →   Δy = ${f(peso)} / ${f(k)} = ${f(dy, 4)} m = ${f(dy * 100, 1)} cm`] },
            { tipo: 'sentido', texto: `Las unidades: N entre N/m da metros. Vuelta: ${f(k)} N/m · ${f(dy, 4)} m = ${f(k * dy)} N, justo el peso.` },
          ],
          respuesta: `Baja ${f(dy * 100, 1)} cm hasta el nuevo equilibrio.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.de([0.1, 0.4, 0.9, 1.6, 2.5]), k = r.de([10, 40, 90, 160]);
        if (s % 2 === 0) {
          const P = periodoR(m, k);
          return {
            pregunta: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Cuál es su período? (usa π ≈ 3,14)`],
            opciones: opciones(P, [
              { id: 'inv', valor: 2 * PI * Math.sqrt(k / m), error: 'OS-INV', siFuera: 'Ese cociente está al revés: más masa, más lento.' },
              { id: 'sin-raiz', valor: 2 * PI * m / k, error: 'OS-SIN-RAIZ', siFuera: 'Eso olvida la raíz cuadrada.' },
              { id: 'sin-2pi', valor: Math.sqrt(m / k), error: 'OS-OMEGA', siFuera: 'Eso es 1/ω; falta multiplicar por 2π.' },
            ], n => `${f(n)} s`),
            solucion: { texto: 'Raíz de masa entre constante, por 2π.', ecuacion: [T, ` = 2π √(${f(m)}/${f(k)}) = ${f(P)} s`] },
          };
        }
        const dy = m * 10 / k;
        return {
          pregunta: ['Se cuelga un bloque de ', f(m), ` kg de un resorte vertical de k = ${f(k)} N/m. ¿Cuánto baja hasta su nuevo equilibrio? (g = 10 m/s²)`],
          opciones: opciones(dy * 100, [
            { id: 'sin-g', valor: m / k * 100, error: 'OS-VERTICAL', siFuera: 'Eso olvida que lo que estira el resorte es el peso, mg.' },
            { id: 'inv', valor: k / (m * 10) * 100, error: 'OS-INV', siFuera: 'Ese cociente está al revés.' },
            { id: 'doble', valor: 2 * dy * 100, error: 'OS-VERTICAL', siFuera: 'Ese es el punto más bajo si se suelta de golpe; el equilibrio está a la mitad.' },
          ], n => `${f(n, 1)} cm`),
          solucion: { texto: 'En el equilibrio el resorte sostiene el peso: k Δy = m g.', ecuacion: [`Δy = ${f(m)} · 10 / ${f(k)} = ${f(dy, 3)} m`] },
        };
      },
    },
  };

  // ---------- Idea 4: el péndulo simple ----------
  // Cambia: el largo del hilo y el lugar (la Tierra o la Luna) · Permanece: ángulos pequeños ·
  // Progresa: el punto sobre la curva T–L · Se reserva: una bolita de doble masa ·
  // Debe verse: el período del péndulo depende del largo y de g, no de la masa.
  const periodoP = (L, g) => 2 * PI * Math.sqrt(L / g);
  const ejeTL = (g, extra = {}) => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'L', unidad: 'm', decimales: 1 },
    y: { min: 0, max: 8, paso: 2, nombre: 'T', unidad: 's', decimales: 0, color: 'h' },
    curvas: [{ puntos: muestras(L => periodoP(L, g), 0, 2, 41), color: 'h', rotulo: g === 10 ? 'Tierra' : 'Luna', en: [0.3, periodoP(0.3, g) + 0.4] }],
  }, extra);
  const tlJuego = val => ejeTL(val.g, { puntos: [{ x: val.L, y: periodoP(val.L, val.g), color: 'h', rotulo: `${f(periodoP(val.L, val.g))} s`, guias: true }] });
  const pendulo = {
    id: 'pendulo',
    titulo: 'El péndulo no mira la masa',
    temas: ['Péndulo simple'],
    pieza: 'ejes',
    // Lee (fase 2): qué es un péndulo simple, cómo se mide L y la gravedad de la Luna. No dice nada de la masa de la
    // bolita («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un hilo y una bolita', texto: 'La plomada del albañil, un columpio, la lámpara que se mece cuando tiembla: todos son péndulos. El más sencillo es el péndulo simple, una bolita pequeña en un hilo liviano.' },
        { titulo: 'Dónde se mide L', texto: 'El largo L va desde el punto donde cuelga el hilo hasta el centro de la bolita. Y el ángulo tiene que ser pequeño: el péndulo se abre poco.' },
        { titulo: 'Otra gravedad', texto: 'En la Luna la gravedad es de 1,6 m/s², unas seis veces menor que los 10 m/s² de la Tierra. Allá todo cae más despacio.' },
        { titulo: 'Qué mirar', texto: ['Al jugar, el largo L crece solo y el punto marca el período ', T, ' en la curva. Compara un largo con su cuádruple, y después elige la Luna.'] },
      ],
    },
    juega: {
      consigna: 'El largo L crece y decrece solo. Mira el punto subir por la curva; después pausa y elige la Luna.',
      voz: 'Compara L = 0,5 m con L = 2 m.',
      // Animación (15 nov): el largo barre su rango ida y vuelta (5 s por tramo) y el punto recorre la curva T–L.
      controles: [
        { id: 'L', etiqueta: 'L', min: 0.25, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2, auto: { velocidad: 0.35, modo: 'rebota' } },
        { id: 'g', etiqueta: 'Lugar', opciones: [{ valor: 10, texto: 'Tierra' }, { valor: 1.6, texto: 'Luna' }], inicio: 10 },
      ],
      dibujo: val => ({ datos: tlJuego(val), estado: {} }),
      lectura: val => [T, ` = 2π √(${f(val.L)}/${f(val.g)}) = ${f(periodoP(val.L, val.g))} s`],
      minimo: 3,
      // Arrastra el punto por la curva: su lugar en el eje horizontal es el largo del hilo.
      arrastres: [
        { id: 'largo', etiqueta: 'largo del hilo', color: 'c-h',
          donde: val => enEjes(tlJuego(val), val.L, periodoP(val.L, val.g)),
          mover: (pt, val) => ({ L: PZ('ejes').geometria(tlJuego(val)).Xi(pt.x) }) },
      ],
    },
    predice: {
      pregunta: 'Un péndulo de 1 m con una bolita de 50 g tarda 2 s en ir y volver. Se cambia la bolita por una de 100 g, con el mismo hilo. ¿Cuánto tarda ahora?',
      opciones: [
        { id: 'c', texto: '2 s, igual', correcta: true },
        { id: 'mas', texto: 'Más de 2 s: pesa más', error: 'O3', siFuera: 'Pesa más, cierto, pero también cuesta más moverla: las dos cosas se compensan.' },
        { id: 'menos', texto: 'Menos de 2 s: cae más rápido', error: 'D5', siFuera: 'Sin aire, una bolita pesada no cae más rápido que una liviana.' },
      ],
      dibujo: { datos: ejeTL(10, { curvas: [] }), estado: {} },
      revelar: { datos: ejeTL(10, { puntos: [{ x: 1, y: periodoP(1, 10), color: 'h', rotulo: '50 g y 100 g: 1,99 s', guias: true }] }), estado: {} },
      coincide: 'Coincide: la masa no está en la fórmula; el período sale del largo y de g.',
    },
    mira: {
      datos: ejeTL(10, { puntos: [{ x: 0.25, y: periodoP(0.25, 10), color: 'h', rotulo: `${f(periodoP(0.25, 10))} s`, guias: true, desde: 1 }, { x: 1, y: periodoP(1, 10), color: 'h', rotulo: `${f(periodoP(1, 10))} s`, guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 25 cm de hilo, el péndulo tarda casi 1 s.', ecuacion: [T, ' = 2π √(0,25/10) ≈ 0,99 s'] },
        { estado: { corte: 2 }, texto: 'Con 4 veces el largo, tarda el doble.', ecuacion: [T, ' = 2π √(1/10) ≈ 1,99 s'] },
        { estado: { corte: 2 }, texto: 'En la Luna, con g seis veces menor, tardaría unas 2,5 veces más.', ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }] },
      ],
    },
    regla: {
      texto: 'Para oscilaciones pequeñas, el período de un péndulo simple depende solo del largo del hilo y de la gravedad del lugar.',
      ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }],
      condicion: 'ángulos pequeños (menos de unos 10°), hilo sin masa e inextensible; L va del punto de giro al centro de la bolita.',
    },
    // Así se resuelve: período del péndulo o factor con un hilo más largo, calculado igual que «Ahora tú» (periodoP y
    // √q; mismo sm % 2 y mismo orden de sorteo).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), L = r.de([0.4, 0.9, 1.6, 2.5, 3.6]), g = 10;
        if (sm % 2 === 0) {
          const P = periodoP(L, g), raiz = Math.sqrt(L / g), P1 = periodoP(1, g);
          return {
            enunciado: ['¿Cuál es el período de un péndulo de ', f(L), ' m de largo? (g = 10 m/s², π ≈ 3,14)'],
            pasos: [
              { tipo: 'pide', texto: ['Piden el período ', T, ': cuánto tarda el péndulo en ir y volver.'] },
              { tipo: 'datos', texto: 'El largo del hilo y la gravedad de la Tierra. Oscilaciones pequeñas.',
                ecuacion: [`L = ${f(L)} m   ·   g = 10 m/s²`] },
              { tipo: 'regla', texto: 'Un hilo más largo hace el vaivén más lento; más gravedad lo apura. El período es 2π por la raíz del largo entre g.',
                ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }] },
              { tipo: 'cuentas', texto: 'Divido el largo entre g, saco la raíz y multiplico por 2π.',
                ecuacion: [`L/g = ${f(L / g)}   →   √(${f(L / g)}) = ${f(raiz)}   →   `, T, ` = 2π · ${f(raiz)} = ${f(P)} s`] },
              { tipo: 'sentido', texto: `Un péndulo de 1 m tarda ${f(P1)} s. Este hilo es ${L > 1 ? 'más largo' : 'más corto'}, y tarda ${L > 1 ? 'más' : 'menos'}: ${f(P)} s. Las unidades dan segundos.` },
            ],
            respuesta: [T, ` = ${f(P)} s`],
          };
        }
        const q = r.de([4, 9, 16]), n = Math.sqrt(q), P0 = periodoP(L, g), Pq = periodoP(q * L, g);
        return {
          enunciado: ['Un péndulo tiene período ', T, `. Si su hilo se hace ${f(q)} veces más largo, ¿cuál es su nuevo período?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el nuevo período, comparado con el de antes, ', T, '.'] },
            { tipo: 'datos', texto: `El largo se multiplica por ${f(q)}. La gravedad es la misma.`,
              ecuacion: [`L' = ${f(q)} L`] },
            { tipo: 'regla', texto: 'El período va con la raíz cuadrada del largo: si el largo se multiplica por un número, el período se multiplica por su raíz.',
              ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }] },
            { tipo: 'cuentas', texto: `Pongo ${f(q)} L en lugar de L; la raíz de ${f(q)} sale afuera.`,
              ecuacion: [`T' = 2π √(${f(q)} L / g) = √${f(q)} · `, T, ` = ${f(n)} `, T] },
            { tipo: 'sentido', texto: `Con L = ${f(L)} m: pasa de ${f(P0)} s a ${f(Pq)} s, y ${f(Pq)} / ${f(P0)} = ${f(Pq / P0)}. Más lento, pero no ${f(q)} veces.` },
          ],
          respuesta: [`T' = ${f(n)} `, T],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), L = r.de([0.4, 0.9, 1.6, 2.5, 3.6]), g = 10;
        if (s % 2 === 0) {
          const P = periodoP(L, g);
          return {
            pregunta: ['¿Cuál es el período de un péndulo de ', f(L), ' m de largo? (g = 10 m/s², π ≈ 3,14)'],
            opciones: opciones(P, [
              { id: 'inv', valor: 2 * PI * Math.sqrt(g / L), error: 'OS-INV', siFuera: 'Ese cociente está al revés: hilo más largo, más lento.' },
              { id: 'sin-raiz', valor: 2 * PI * L / g, error: 'OS-SIN-RAIZ', siFuera: 'Eso olvida la raíz cuadrada.' },
              { id: 'sin-2pi', valor: Math.sqrt(L / g), error: 'OS-OMEGA', siFuera: 'Falta multiplicar por 2π.' },
            ], n => `${f(n)} s`),
            solucion: { texto: 'Raíz de largo entre g, por 2π.', ecuacion: [T, ` = 2π √(${f(L)}/10) = ${f(P)} s`] },
          };
        }
        const q = r.de([4, 9, 16]);
        return {
          pregunta: ['Un péndulo tiene período ', T, `. Si su hilo se hace ${f(q)} veces más largo, ¿cuál es su nuevo período?`],
          opciones: opciones(Math.sqrt(q), [
            { id: 'lineal', valor: q, error: 'OS-SIN-RAIZ', siFuera: 'El período crece con la raíz del largo, no en proporción.' },
            { id: 'inv', valor: 1 / Math.sqrt(q), error: 'OS-INV', siFuera: 'Con más largo, el péndulo es más lento, no más rápido.' },
            { id: 'igual', valor: 1, error: 'O4', siFuera: 'El largo sí cambia el período.' },
          ], n => `${f(n, 2)} T`),
          solucion: { texto: 'T va con la raíz del largo.', ecuacion: [`T' = √${f(q)} · T = ${f(Math.sqrt(q))} T`] },
        };
      },
    },
  };

  // ---------- Idea 5: la energía en el MAS ----------
  // Cambia: la posición del bloque · Permanece: la energía total (1 J) ·
  // Progresa: el reparto entre U, que crece con x², y K, lo que falta · Se reserva: el punto donde K = U ·
  // Debe verse: la suma no cambia; U es una parábola, y K = U no ocurre a mitad de camino.
  const K5 = 50, A5 = 0.2, E5 = 0.5 * K5 * A5 * A5;
  const ejeE = (extra = {}) => Object.assign({
    x: { min: -0.2, max: 0.2, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
    y: { min: 0, max: 1.2, paso: 0.4, nombre: 'E', unidad: 'J', decimales: 1 },
    curvas: [
      { puntos: muestras(xx => 0.5 * K5 * xx * xx, -0.2, 0.2, 41), rotulo: 'U', en: [0.17, 0.72] },
      { puntos: muestras(xx => E5 - 0.5 * K5 * xx * xx, -0.2, 0.2, 41), discontinua: true, rotulo: 'K', en: [-0.1, 0.82] },
      { puntos: [[-0.2, E5], [0.2, E5]], rotulo: 'E = 1 J', en: [-0.19, 1.1] },
    ],
  }, extra);
  const eJuego = val => { const U = 0.5 * K5 * val.x * val.x; return ejeE({ puntos: [{ x: val.x, y: U, rotulo: `U = ${f(U, 2)}`, guias: true }, { x: val.x, y: E5 - U, rotulo: `K = ${f(E5 - U, 2)}` }] }); };
  // Animación (15 nov): el mismo bloque de la idea 1 (0,5 kg, ω = 10 rad/s) oscila en cámara lenta, un período cada 4 s
  // de pantalla: x = A cos(ωt) y los dos puntos (U y K) corren sobre sus curvas. Arrastrar el punto convierte x en t.
  const xE = tt => r0(A5 * Math.cos(W1 * tt));
  const eJuegoT = val => eJuego({ x: xE(val.t) });
  const energia = {
    id: 'energia-mas',
    titulo: 'La energía se reparte, no cambia',
    temas: ['Energía en el MAS'],
    pieza: 'ejes',
    // Lee (fase 2): las dos energías y cómo se lee la gráfica. No da la fórmula de U ni dice dónde K = U («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Energía que cambia de lugar', texto: 'En una cama elástica de feria pasa algo curioso: al hundirse, la lona guarda energía; al soltarla, esa energía vuelve como rapidez. En el MAS ocurre lo mismo una y otra vez.' },
        { titulo: 'Dos formas', texto: ['La energía cinética K es la del movimiento: crece con la rapidez ', v, '. La energía potencial elástica U es la que guarda el resorte cuando está estirado o encogido.'] },
        { titulo: 'Qué mirar', texto: ['Al jugar, la curva continua es U y la discontinua es K; la recta de arriba es la energía total. Mira los dos puntos mientras ', x, ' va y viene.'] },
      ],
    },
    juega: {
      consigna: 'La posición x va y viene sola, en cámara lenta, con 1 J en total. Mira los dos puntos: uno sube si el otro baja.',
      voz: 'Lee las dos energías y súmalas en cada posición.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-h', min: 0, max: T1, paso: PASO_T1, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: T1 / 4 } }],
      dibujo: val => ({ datos: eJuegoT(val), estado: {} }),
      lectura: val => { const xx = xE(val.t), U = 0.5 * K5 * xx * xx; return [x, ` = ${f(xx)} m · U = ${f(U, 2)} J · K = ${f(E5 - U, 2)} J`]; },
      minimo: 3,
      // Arrastra el punto de U por la parábola: su lugar en el eje horizontal es la posición del bloque, que se convierte
      // en el instante de la oscilación (la animación se pausa).
      arrastres: [
        { id: 'posicion', etiqueta: 'posición x', color: 'c-i',
          donde: val => { const xx = xE(val.t); return enEjes(eJuegoT(val), xx, 0.5 * K5 * xx * xx); },
          mover: (pt, val) => {
            const q = Math.max(-A5, Math.min(A5, PZ('ejes').geometria(eJuegoT(val)).Xi(pt.x)));
            const ang = Math.acos(q / A5) / W1;
            return { t: val.t > T1 / 2 ? T1 - ang : ang };
          } },
      ],
    },
    predice: {
      pregunta: ['La posición va y viene entre −0,2 m y +0,2 m. ¿En qué posición la energía cinética es igual a la energía potencial?'],
      opciones: [
        { id: 'c', texto: 'x = ±0,14 m', correcta: true },
        { id: 'mitad', texto: 'x = ±0,1 m, a mitad de camino', error: 'OS-MITAD', siFuera: 'La mitad del camino sería cierta si U creciera en proporción a x. Crece con x².' },
        { id: 'centro', texto: 'x = 0, en el centro', error: 'OS-CENTRO', siFuera: 'En el centro toda la energía es cinética: U = 0.' },
        { id: 'extremo', texto: 'x = ±0,2 m, en los extremos', error: 'OS-TODO', siFuera: 'En los extremos toda es potencial: K = 0.' },
      ],
      dibujo: { datos: (d => Object.assign(d, { curvas: [d.curvas[0], d.curvas[2]] }))(ejeE()), estado: {} },
      revelar: { datos: ejeE({ puntos: [{ x: 0.1414, y: 0.5, rotulo: 'K = U = 0,5 J', guias: true }, { x: -0.1414, y: 0.5 }] }), estado: {} },
      coincide: 'Coincide: U = 0,5 J pide x² = 0,02 m², o sea x = 0,2/√2 ≈ 0,14 m.',
    },
    mira: {
      datos: ejeE({ puntos: [{ x: 0.2, y: 1, rotulo: 'U', desde: 1 }, { x: 0, y: 1, rotulo: 'todo K', desde: 2 }, { x: 0.1414, y: 0.5, rotulo: 'mitad y mitad', guias: true, desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En el extremo, v = 0: toda la energía es del resorte.', ecuacion: ['E = ½ k ', { sup: ['A', '2'] }, ' = ½ · 50 · ', { sup: ['0,2', '2'] }, ' = 1 J'] },
        { estado: { corte: 2 }, texto: 'En el centro el resorte no está estirado: toda es cinética.', ecuacion: ['½ m ', { sup: [{ sub: [v, 'máx'] }, '2'] }, ' = 1 J'] },
        { estado: { corte: 3 }, texto: 'U crece con x²: la mitad de la energía está a 0,14 m.', ecuacion: ['½ · 50 · ', { sup: [x, '2'] }, ' = 0,5   →   ', x, ' = ', { frac: ['A', '√2'] }] },
      ],
    },
    regla: {
      texto: 'En el MAS la energía total no cambia: se reparte entre la del resorte, que crece con x², y la cinética del bloque.',
      ecuacion: [{ llave: ['½ k ', { sup: ['A', '2'] }], nota: 'total' }, ' = ', { llave: ['½ k ', { sup: [x, '2'] }], nota: 'del resorte', color: 'c-i' }, ' + ', { llave: ['½ m ', { sup: [v, '2'] }], nota: 'del bloque', color: 'c-o' }],
      condicion: 'sin rozamiento ni ayuda externa; x desde el equilibrio. Con roce, la amplitud se apaga.',
    },
    // Así se resuelve: rapidez en una posición, calculado igual que «Ahora tú» (v = √(k/m · (A² − x²)), mismos k, m, A y x),
    // contado como reparto de energía: E − U = K.
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), k = r.de([20, 50, 80, 200]), m = r.de([0.2, 0.5, 2]), A = r.de([0.1, 0.2, 0.3]), xx = A * r.de([0.5, 0.6, 0.8]);
        const vv = Math.sqrt(k / m * (A * A - xx * xx)), E = 0.5 * k * A * A, U = 0.5 * k * xx * xx, K = E - U, vmax = Math.sqrt(k / m) * A;
        return {
          enunciado: ['Un bloque de ', f(m), ` kg oscila con un resorte de k = ${f(k)} N/m y amplitud ${f(A)} m. ¿Qué rapidez tiene en `, x, ` = ${f(xx, 2)} m?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la rapidez ', v, ' del bloque cuando pasa por esa posición.'] },
            { tipo: 'datos', texto: 'La masa, la constante del resorte, la amplitud y la posición pedida.',
              ecuacion: [`m = ${f(m)} kg   ·   k = ${f(k)} N/m   ·   A = ${f(A)} m   ·   `, x, ` = ${f(xx, 2)} m`] },
            { tipo: 'regla', texto: 'La energía total no cambia. En el extremo toda es del resorte; en cualquier otro punto, lo que no guarda el resorte es cinética.',
              ecuacion: ['½ k ', { sup: ['A', '2'] }, ' = ½ k ', { sup: [x, '2'] }, ' + ½ m ', { sup: [v, '2'] }] },
            { tipo: 'cuentas', texto: 'Calculo la energía total y la que guarda el resorte en esa posición. La diferencia es la cinética, y de ella saco v.',
              ecuacion: [`E = ${f(E, 4)} J   ·   U = ${f(U, 4)} J   →   K = ${f(K, 4)} J   →   `, v, ` = √(2 · ${f(K, 4)} / ${f(m)}) = ${f(vv)} m/s`] },
            { tipo: 'sentido', texto: `En el centro iría a ${f(vmax)} m/s, su rapidez máxima. Aquí va más lento, ${f(vv)} m/s, porque parte de la energía sigue en el resorte.` },
          ],
          respuesta: [v, ` = ${f(vv)} m/s`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), k = r.de([20, 50, 80, 200]), m = r.de([0.2, 0.5, 2]), A = r.de([0.1, 0.2, 0.3]), xx = A * r.de([0.5, 0.6, 0.8]);
        const vv = Math.sqrt(k / m * (A * A - xx * xx));
        return {
          pregunta: ['Un bloque de ', f(m), ` kg oscila con un resorte de k = ${f(k)} N/m y amplitud ${f(A)} m. ¿Qué rapidez tiene en `, x, ` = ${f(xx, 2)} m?`],
          opciones: opciones(vv, [
            { id: 'lineal', valor: Math.sqrt(k / m) * (A - xx), error: 'OS-MITAD', siFuera: 'Eso resta A − x antes de elevar; la energía va con los cuadrados.' },
            { id: 'max', valor: Math.sqrt(k / m) * A, error: 'OS-TODO', siFuera: 'Esa es la rapidez en el centro, la máxima.' },
            { id: 'sin-raiz', valor: k / m * (A * A - xx * xx), error: 'OS-SIN-RAIZ', siFuera: 'Eso es v²; falta la raíz.' },
          ], n => `${f(n)} m/s`),
          solucion: { texto: 'La energía del extremo se reparte: lo que no es U, es K.', ecuacion: [v, ` = √(${f(k)}/${f(m)} · (${f(A)}² − ${f(xx, 2)}²)) = ${f(vv)} m/s`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Resorte libre: el mismo bloque con otro resorte u otra masa. Las flechas usan una escala fija en todas las
  // combinaciones, para que dos casos guardados se comparen a ojo.
  // Mesa 3D… no: 2D animada (15 nov). El resorte que oscila: A, k y m se eligen; t avanza solo en cámara lenta.
  const wViva = val => Math.sqrt(val.k / val.m), perViva = val => 2 * PI / wViva(val);
  const xViva = val => r0(val.A * Math.cos(wViva(val) * val.t));
  const resorteViva = val => {
    const w = wViva(val), xx = xViva(val), vv = r0(-val.A * w * Math.sin(w * val.t)), aa = r0(-w * w * xx);
    return { A: 0.2, unidad: 'm', x: xx, v: vv, a: aa, escalaV: 20, escalaA: 1.2, colores: { x: 'i', v: 'o', a: 'd' },
      textoA: `a = ${f(aa, 0)} m/s²`, extremos: true };
  };
  const mesaResorteVivo = {
    id: 'resorte-vivo', titulo: 'El resorte que oscila', pieza: 'fis-resorte',
    consigna: 'El bloque oscila solo, en cámara lenta. Cambia la amplitud, el resorte y la masa, y mira el período.',
    controles: [
      { id: 'A', etiqueta: 'A', color: 'c-i', min: 0.05, max: 0.2, paso: 0.05, inicio: 0.2, unidad: 'm', decimales: 2 },
      { id: 'k', etiqueta: 'k', min: 20, max: 80, paso: 20, inicio: 40, unidad: 'N/m', decimales: 0 },
      { id: 'm', etiqueta: 'm', min: 0.25, max: 1, paso: 0.25, inicio: 1, unidad: 'kg', decimales: 2 },
      { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 2, paso: 0.01, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25 } },
    ],
    dibujo: val => ({ datos: resorteViva(val), estado: {} }),
    lectura: val => [T, ` = ${f(perViva(val))} s · `, x, ` = ${f(xViva(val))} m`],
    invitaciones: [
      { texto: 'Consigue el período más largo que permite la mesa.',
        logrado: val => perViva(val) >= perViva({ k: 20, m: 1 }) - 1e-9,
        bien: 'Mucha masa y un resorte blando: oscila lento.',
        pista: 'Prueba con más masa y un resorte más blando.' },
      { texto: 'Que oscile el doble de rápido que con k = 20 N/m y 1 kg.',
        logrado: val => Math.abs(wViva(val) - 2 * wViva({ k: 20, m: 1 })) < 1e-9,
        bien: 'Para el doble de ω, k/m tiene que ser cuatro veces mayor.',
        pista: 'ω = √(k/m): ¿cuánto tiene que crecer k/m para duplicarse?' },
      { texto: 'Pausa el bloque justo en el centro, donde va más rápido.',
        logrado: val => Math.abs(xViva(val)) <= 0.005,
        bien: 'En el centro la fuerza es cero, pero la rapidez es la mayor.',
        pista: 'Pausa cuando el bloque pase por x = 0; ajusta t con − y +.' },
      { texto: 'Guarda dos casos con distinta amplitud y el mismo resorte y masa.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.A !== q.A && p.k === q.k && p.m === q.m)),
        bien: 'Mismo período con otra amplitud: T no depende de A.' },
    ],
  };
  const resLibre = val => {
    const w = Math.sqrt(val.k / val.m), ac = -w * w * val.x;
    return { A: A1, unidad: 'm', x: val.x, v: -w * Math.sqrt(Math.max(0, A1 * A1 - val.x * val.x)), a: ac,
      escalaV: 20, escalaA: 1.2, colores: { x: 'i', v: 'o', a: 'd' }, textoA: `a = ${f(ac, 0)} m/s²` };
  };
  // Péndulo en tres lugares: las tres curvas a la vez y el punto en la del lugar elegido.
  const LUGARES = [{ g: 10, n: 'Tierra' }, { g: 3.7, n: 'Marte' }, { g: 1.6, n: 'Luna' }];
  const penLibre = val => ({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'L', unidad: 'm', decimales: 1 },
    y: { min: 0, max: 8, paso: 2, nombre: 'T', unidad: 's', decimales: 0, color: 'h' },
    curvas: LUGARES.map(q => ({ puntos: muestras(L => periodoP(L, q.g), 0, 2, 41), color: 'h', discontinua: q.g !== val.g, rotulo: q.n, en: [0.45, periodoP(0.45, q.g) + 0.6] })),
    puntos: [{ x: val.L, y: periodoP(val.L, val.g), color: 'h', rotulo: `${f(periodoP(val.L, val.g))} s`, guias: true }],
  });

  // Para los retos: `guardado` dice si el caso actual ya se guardó entre los de la mesa.
  const guardado = (val, gs, claves) => gs.some(g => claves.every(c => g[c] === val[c]));

  return {
    unidad: 'fisica.oscilaciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-resorte.js', '/nucleo/kit/piezas/ejes.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. «Fase» a secas no se
    // define (en calor es «cambio de fase»): aquí va «fase inicial».
    glosario: [
      { termino: 'MAS', formas: ['MAS', 'movimiento armónico simple'], def: 'Vaivén en el que la aceleración apunta siempre al centro y es proporcional a cuánto se apartó de él.',
        ver: ['fuerza recuperadora', 'frecuencia angular'] },
      { termino: 'oscilación', formas: ['oscilación', 'oscilaciones'], def: 'Un vaivén completo: ir de un extremo al otro y volver al punto de partida.',
        ejemplo: 'Un péndulo de 1 m, en la Tierra, tarda unos 2 s en cada una.', ver: ['MAS'] },
      { termino: 'movimiento periódico', def: 'Movimiento que se repite igual, una y otra vez, cada cierto tiempo fijo.',
        ejemplo: 'Un reloj de péndulo: cada vaivén dura lo mismo.', ver: ['oscilación'] },
      { termino: 'amplitud', simbolo: 'A', medida: 'm', def: 'Lo más que se aparta algo de su posición de equilibrio al oscilar.',
        ejemplo: 'Si va de −0,2 m a +0,2 m: A = 0,2 m.', ver: ['elongación'] },
      { termino: 'posición de equilibrio', def: 'Lugar donde la fuerza neta sobre el cuerpo es cero: el centro del vaivén.',
        ver: ['fuerza recuperadora'] },
      { termino: 'elongación', simbolo: 'x', medida: 'm', def: 'Cuánto se apartó el cuerpo de la posición de equilibrio en un instante, con signo.',
        ejemplo: 'Bloque 0,1 m a la izquierda del centro: x = −0,1 m.', ver: ['amplitud'] },
      { termino: 'fuerza recuperadora', def: 'Fuerza que siempre apunta hacia la posición de equilibrio y crece cuanto más se aparta el cuerpo.',
        ejemplo: 'Resorte de 50 N/m estirado 0,1 m: F = −50 · 0,1 = −5 N.', ver: ['MAS'] },
      { termino: 'frecuencia angular', simbolo: 'ω', medida: 'rad/s', def: 'Cuánto avanza por segundo el ángulo del coseno del MAS: 2π entre el período.',
        ejemplo: 'T = 2 s: ω = 2π / 2 = π rad/s.' },
      { termino: 'fase inicial', simbolo: 'φ', medida: 'rad', def: 'Ángulo que fija en qué punto del vaivén empieza el movimiento, en t = 0.',
        ejemplo: 'φ = 0: sale del extremo +A.' },
      { termino: 'péndulo simple', formas: ['péndulo simple', 'péndulos simples'], def: 'Bolita pequeña colgada de un hilo liviano que oscila abriéndose poco.',
        ejemplo: 'L = 1 m en la Tierra: T = 2π √(1/10) ≈ 1,99 s.' },
    ],
    // Laboratorio: juego libre, sin preguntas. El resorte libre suelta k y m (la idea los deja fijos); el péndulo pone
    // tres lugares juntos; la tercera mesa es el juego de la gráfica x–t con su cresta arrastrable.
    laboratorio: [
      mesaResorteVivo,
      {
        id: 'resorte-libre', titulo: 'Otro resorte, otra masa', pieza: 'fis-resorte',
        consigna: 'Arrastra el bloque y cambia el resorte y la masa. Guarda el mismo lugar con dos resortes y compara las flechas.',
        controles: [
          { id: 'x', etiqueta: 'x', color: 'c-i', min: -0.2, max: 0.2, paso: 0.05, inicio: 0.1, unidad: 'm', decimales: 2 },
          { id: 'k', etiqueta: 'k', min: 20, max: 80, paso: 10, inicio: 50, unidad: 'N/m', decimales: 0 },
          { id: 'm', etiqueta: 'm', min: 0.25, max: 1, paso: 0.25, inicio: 0.5, unidad: 'kg', decimales: 2 },
        ],
        dibujo: val => ({ datos: resLibre(val), estado: {} }),
        lectura: val => { const w = Math.sqrt(val.k / val.m); return [`k = ${f(val.k)}, m = ${f(val.m)}: `, a, ` = ${f(-w * w * val.x, 0)}\u00a0m/s² · ω = ${f(w, 1)}\u00a0rad/s`]; },
        arrastres: [
          { id: 'bloque', etiqueta: 'bloque', color: 'c-i',
            donde: val => ({ x: PZ('fis-resorte').escala(resLibre(val), val.x), y: PZ('fis-resorte').constantes.centroY }),
            mover: (pt, val) => ({ x: inversa(q => PZ('fis-resorte').escala(resLibre(val), q), -A1, A1)(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Haz que las flechas de v y de a apunten en sentidos opuestos.',
            logrado: val => { const q = resLibre(val); return Math.abs(q.v) > 1e-9 && q.v * q.a < 0; },
            bien: 'Va hacia la izquierda, pero ya lo frenan: a siempre mira al centro.' },
          { texto: 'Consigue la mayor aceleración posible hacia la derecha.',
            logrado: val => resLibre(val).a >= resLibre({ x: -0.2, k: 80, m: 0.25 }).a - 1e-9,
            bien: 'Para tirar a la derecha, el bloque tuvo que estar lejos, a la izquierda.' },
          { texto: 'Haz que ω sea el doble que con k = 20 N/m y 1 kg.',
            logrado: val => Math.abs(Math.sqrt(val.k / val.m) - 2 * Math.sqrt(20 / 1)) < 1e-9,
            bien: 'El doble de ω pidió cuatro veces k/m. ¿Cuál cambiaste?' },
          { texto: 'Guarda el mismo lugar con dos resortes distintos y la misma aceleración.',
            logrado: (val, guardados) => val.x !== 0 && guardado(val, guardados, ['x', 'k', 'm'])
              && guardados.some(g => g.x === val.x && g.k !== val.k && Math.abs(resLibre(g).a - resLibre(val).a) < 1e-9),
            bien: 'Manda k/m: doble resorte con doble masa da la misma aceleración.' },
        ],
      },
      {
        id: 'pendulo-libre', titulo: 'Péndulo en tres lugares', pieza: 'ejes',
        consigna: 'Arrastra el punto para cambiar el largo y elige el lugar. Busca un largo en Marte que tarde como uno de la Tierra.',
        controles: [
          { id: 'L', etiqueta: 'L', min: 0.25, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
          { id: 'g', etiqueta: 'Lugar', opciones: LUGARES.map(q => ({ valor: q.g, texto: q.n })), inicio: 10 },
        ],
        dibujo: val => ({ datos: penLibre(val), estado: {} }),
        lectura: val => [`${LUGARES.find(q => q.g === val.g).n}, L = ${f(val.L)}\u00a0m → `, T, ` = ${f(periodoP(val.L, val.g))}\u00a0s`],
        arrastres: [
          { id: 'largo', etiqueta: 'largo del hilo', color: 'c-h',
            donde: val => enEjes(penLibre(val), val.L, periodoP(val.L, val.g)),
            mover: (pt, val) => ({ L: PZ('ejes').geometria(penLibre(val)).Xi(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Guarda un péndulo de Marte y uno de la Tierra que tarden casi igual.',
            // «Casi»: la grilla de L va de 0,25 en 0,25 m; la mejor pareja difiere en unas centésimas de segundo.
            logrado: (val, guardados) => guardado(val, guardados, ['L', 'g'])
              && guardados.some(g => [g.g, val.g].sort().join() === '10,3.7' && Math.abs(periodoP(g.L, g.g) - periodoP(val.L, val.g)) < 0.05),
            bien: 'Con menos gravedad, Marte pidió un hilo mucho más corto.' },
          { texto: 'En la Tierra, haz que tarde el doble que un péndulo de 0,5 m.',
            logrado: val => val.g === 10 && Math.abs(periodoP(val.L, 10) - 2 * periodoP(0.5, 10)) < 1e-9,
            bien: 'El doble de período pidió cuatro veces el hilo: T va con √L.' },
          { texto: 'Busca el péndulo más lento de los tres lugares.',
            logrado: val => periodoP(val.L, val.g) >= periodoP(2, 1.6) - 1e-9,
            bien: 'Hilo largo y poca gravedad: el vaivén más lento de todos.' },
        ],
      },
      Object.assign({ id: 'coseno', titulo: 'La curva x–t', pieza: 'ejes',
        invitaciones: [
          { texto: 'Consigue la mayor rapidez máxima que permite la curva.',
            logrado: val => vmaxXt(val) >= vmaxXt({ A: 0.3, P: 1 }) - 1e-9,
            bien: 'Amplitud grande y período corto: más camino en menos tiempo.' },
          { texto: 'Haz que en los 4 s de la gráfica quepan justo cuatro oscilaciones.',
            logrado: val => Math.abs(4 / val.P - 4) < 1e-9,
            bien: 'Cuatro vaivenes en 4 s: cada uno dura 1 s.' },
          { texto: 'Guarda dos curvas de distinta amplitud con la misma rapidez máxima.',
            logrado: (val, guardados) => guardado(val, guardados, ['A', 'P'])
              && guardados.some(g => g.A !== val.A && Math.abs(vmaxXt(g) - vmaxXt(val)) < 1e-9),
            bien: 'Más amplitud y más período: Aω quedó igual. ¿Y la aceleración máxima?' },
        ] }, graficas.juega),
    ],
    historia: {
      texto: 'Huygens construyó relojes de péndulo en la década de 1650 y publicó su estudio matemático en 1673. Para medir bien había que reconocer un límite: un péndulo que se abre mucho no repite exactamente el período de uno que se abre poco. Un vaivén regular se volvió una forma de medir el tiempo.',
      pregunta: '¿Por qué un reloj de péndulo puede contar segundos?',
      fuente: { titulo: 'APS News — Huygens patents the first pendulum clock', url: 'https://www.aps.org/apsnews/2017/06/huygens-patents-first-pendulum-clock' },
    },
    ideas: [centro, graficas, resorteT, pendulo, energia],
  };
});
