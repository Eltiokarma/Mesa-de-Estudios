/*
 * Teoría de «Vectores» (fisica.vectores), unidad nueva del 16 nov: sale de «Magnitudes y vectores», que Gerson eligió
 * partir en dos. Molde de docs/teoria.md. Ideas, mesas y glosario movidos tal cual desde magnitudes-y-vectores.js; el
 * vector unitario y las componentes van antes de sumar. 16 nov: idea nueva «¿Basta un número?» (escalar o vector, con
 * la pieza fis-dron) y las cuatro ideas pasadas por el contrato «se entiende sin profesor» (calidad: 2), con dos
 * rondas de lector en frío cada una (rutinas/frio/fisica.vectores.md).
 * 16 nov, más tarde: 15 ejemplos resueltos por idea (pestaña «Ejemplos», docs/teoria.md 4h; molde EJEMPLOS_UNIDADES),
 * con la pieza fis-fuerzas para los objetos de la vida real (caja, nudo, bote, avioneta, llave, carretilla, cuadras).
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; Gerson, mesa de revisión, 17 nov,
 *   que reemplaza «un color por papel en cada ejercicio»). Cada magnitud lleva un solo color en el control, el juego,
 *   la figura, la fórmula, los datos, los ejemplos, «Ahora tú», la práctica (plantillas/vectores-*) y la escena
 *   (plantillas/vectores/index.html), elegido por su papel más común; la respuesta va en el color de su magnitud:
 *   - naranja (c-o): A⃗, su módulo A y sus componentes A_x, A_y (también si se piden: el m o el b que falta); la fuerza
 *     F⃗ y el peso P⃗ con sus componentes; una velocidad dada; el primer tramo de un recorrido.
 *   - turquesa (c-i): B⃗ con su módulo y sus componentes; el segundo tramo.
 *   - verde (c-d): C⃗, la tercera flecha (también la que equilibra un nudo, cuando se pide), y el tercer tramo. Es el
 *     tercer dato, poco frecuente: nunca hace de resultante ni de desplazamiento, y siempre lleva su letra o su valor.
 *   - violeta (c-f): R⃗ y su módulo; el desplazamiento d⃗ (y Δx), en toda la unidad, también el del dron que se arrastra
 *     y el de la carretilla del trabajo; el unitario û; el resultado de A⃗ · B⃗ y el área de A⃗ × B⃗.
 *   - carmín (c-h): los ángulos, θ y los de cada vector con su eje, también cuando se piden (θ = 120°).
 *   - tinta: la distancia recorrida y la rapidez media (antes carmín: no tienen papel en la tabla del molde, el
 *     carmín es de los ángulos y quedaba junto al verde del tercer tramo, 0,038 con deuteranopía), el círculo de la
 *     distancia y la plaza del dron, el cuarto tramo y el trabajo W del ejemplo de la carretilla (allí d⃗ ya es violeta).
 *   Cambios del 17 nov: el vuelo del dron pasó de naranja a violeta (es un desplazamiento), la C⃗ que equilibra de
 *   violeta a verde, la d⃗ del trabajo de turquesa a violeta y la distancia de carmín a tinta.
 *   Lo comprueba contenido/teoria/fisica/vectores.test.js («un color por magnitud»): cada ficha de color dice su magnitud
 *   (m) y cada letra (A, B, C, R, d, F, P, θ, û) tiene un solo color en toda la unidad.
 * Notación (17 nov, auditoría): el vector lleva flecha (A⃗, { vec }) en todo texto, rótulo y dato; su módulo se escribe
 *   con la letra sola (A) y |A⃗| solo donde hace falta distinguir (|A⃗ × B⃗|, |A⃗ − B⃗|). Subíndices con { sub } en las
 *   ecuaciones y «A_x» en los rótulos de las piezas (las piezas lo dibujan como subíndice): nunca «ᵧ», que es una gamma.
 *   La figura de un ejemplo muestra el planteamiento: lo que se pide va con «?».
 * Códigos de error nuevos (hipótesis, sin dato empírico propio; matriz: «sumar módulos ignorando el ángulo»,
 * «aplicar el producto escalar donde se pide el vectorial»):
 *   V-SUMA suma módulos · V-RESTA resta módulos · V-PITAGORAS usa Pitágoras sin ángulo recto · V-COS signo del coseno
 *   U-SUMA divide entre la suma de componentes · U-CAMBIO cruza componentes · U-UNOS toma î + ĵ como unitario
 *   PE-MODULOS producto sin ángulo · PE-VECTOR confunde escalar con vectorial · PE-ORDEN orden del producto cruz
 *   ESC-IGUAL mismo número, mismo lugar · ESC-NADA cree que no se sabe ni la distancia · ESC-OPUESTO siempre opuestos
 *   ESC-SINRUMBO ignora el «hacia dónde» · ESC-UNIDAD cree que la unidad decide · ESC-SUBEBAJA toma subir o bajar por
 *   dirección · ESC-DISTANCIA da la distancia recorrida por desplazamiento · ESC-SENTIDO invierte el sentido ·
 *   ESC-ULTIMO toma solo el último tramo · ESC-MOVIMIENTO cree que moverse vuelve vector a la distancia ·
 *   ESC-PESO confunde masa con peso · ESC-TIEMPO cree que el tiempo apunta
 *   C-SENO usa el seno para lo que avanza en x · C-MODULO toma el largo entero · C-MITAD reparte por mitades
 *   (17 nov, «Ahora tú» de nivel de examen) C-SIGNO olvida el signo del cuadrante · C-AGUDO da el ángulo agudo por el
 *   ángulo desde +x · C-CUADRANTE usa la regla de otro cuadrante · C-TANGENTE invierte la tangente · V-EXTREMOS usa la
 *   máxima y la mínima como si fueran los módulos · V-MEDIO toma la mitad de máx + mín como la resultante
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «Flechas en el espacio» con el motor de plantillas/vectores (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  // Un color fijo por magnitud (cabecera): cada ficha dice su magnitud en m; lo comprueba vectores.test.js.
  const A = { v: 'c-o', t: 'A', m: 'primero' }, B = { v: 'c-i', t: 'B', m: 'segundo' }, R = { v: 'c-f', t: 'R', m: 'pedido' }, th = { v: 'c-h', t: 'θ', m: 'ángulo' };
  const u = { v: 'c-f', t: 'û', m: 'pedido' };
  const vA = { vec: A }, vB = { vec: B };
  const rad = g => g * Math.PI / 180;
  const cosG = g => (g % 180 === 90 ? 0 : Math.cos(rad(g)));
  const senG = g => (g % 180 === 0 ? 0 : Math.sin(rad(g)));
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura (flechas.geometria) y su
  // inversa (Xi, Yi) da las unidades del problema; el lector ajusta cada valor al paso y al rango de su control.
  const FL = () => Kit.piezas.flechas;
  // Ángulo de un punto visto desde un origen, entre 0° y 180° (lo que queda bajo el eje se pega al eje más cercano).
  const anguloDe = (o, q) => {
    const dx = q[0] - o[0], dy = q[1] - o[1];
    if (dy < 0) return dx >= 0 ? 0 : 180;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  // Una guía con paso 99 no se dibuja, pero cuenta para la escala: así la figura no se encoge mientras se arrastra.
  const marco = (de, a) => ({ de, a, paso: 99 });
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // La correcta primero; los distractores que repiten un texto o no son finitos se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (typeof d.valor === 'number' && !Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Ejemplos resueltos (pestaña «Ejemplos», Gerson 16 nov; docs/teoria.md 4h) ----------
  // Molde: EJEMPLOS_UNIDADES de magnitudes-y-vectores.js (3 niveles × 5, la solución entera a la vista). Colores: la
  // regla de la cabecera, un color fijo por magnitud. El vector lleva flecha ({ vec }); su módulo, no. Las figuras de
  // objetos de la vida real usan la pieza fis-fuerzas.
  const C = { v: 'c-d', t: 'C', m: 'tercero' }, vC = { vec: C }, vR = { vec: R };
  const F = { v: 'c-o', t: 'F', m: 'primero' }, vF = { vec: F }, Pe = { v: 'c-o', t: 'P', m: 'primero' };
  const dA = t => ({ v: 'c-o', t, m: 'primero' }), dB = t => ({ v: 'c-i', t, m: 'segundo' }), dR = t => ({ v: 'c-f', t, m: 'pedido' });
  const dC = t => ({ v: 'c-d', t, m: 'tercero' }), dTh = t => ({ v: 'c-h', t, m: 'ángulo' });
  // El desplazamiento d⃗ (y Δx) es violeta en toda la unidad, como R⃗: casi siempre es lo que se pide. La distancia
  // recorrida, en tinta (dist): no tiene papel en la tabla del molde (el violeta es de d⃗ y el carmín, de los ángulos).
  const Dd = { v: 'c-f', t: 'd', m: 'pedido' }, vDd = { vec: Dd }, dist = t => t;
  const ff = datos => ({ pieza: 'fis-fuerzas', datos, estado: {} });
  const flx = (datos, estado = { final: true }) => ({ pieza: 'flechas', datos, estado });
  const raiz2 = (a, b, signo = ' + ') => ({ raiz: [[{ sup: [a, '2'] }, signo, { sup: [b, '2'] }]] });
  const ejesG = (x0, x1, y0, y1) => [{ de: [x0, 0], a: [x1, 0] }, { de: [0, y0], a: [0, y1] }];
  const sub = (v, i) => ({ sub: [v, i] });

  // ---------- Datos de cada ejercicio (contrato, punto 13; Gerson, 16 nov: «criterio, no memoria») ----------
  // Cada ejercicio trae en `datos` las fórmulas, los valores de academia y las equivalencias que usa, una por línea,
  // con los colores de la unidad. Los valores de los ángulos salen de estas tablas; solo se dan los que el ejercicio usa.
  const COS = { 0: '1', 30: '√3/2', 37: '4/5', 45: '√2/2', 53: '3/5', 60: '1/2', 90: '0', 120: '−1/2', 143: '−4/5', 180: '−1' };
  const SEN = { 0: '0', 30: '1/2', 37: '3/5', 45: '√2/2', 53: '4/5', 60: '√3/2', 90: '1', 120: '√3/2', 143: '3/5', 180: '0' };
  const cosD = (...gs) => gs.map(g => `cos ${g}° = ${COS[g]}`).join(', ');
  const senD = (...gs) => gs.map(g => `sen ${g}° = ${SEN[g]}`).join(', ');
  const senCos = g => `sen ${g}° = ${SEN[g]} y cos ${g}° = ${COS[g]}`;
  const cuad = x => ({ sup: [x, '2'] });
  // El módulo se escribe con la letra sola: A = √(A_x² + A_y²) (una sola notación en la unidad).
  const modD = V => ['Módulo: ', V, ' = ', { raiz: [[cuad(sub(V, 'x')), ' + ', cuad(sub(V, 'y'))]] }];
  const DT = {
    clase: 'Escalar: queda dicha con un número y su unidad. Vectorial: necesita además un «hacia dónde».',
    distancia: 'Distancia recorrida: la suma de todos los tramos, sin mirar hacia dónde.',
    desplaz: 'Desplazamiento: la flecha que va del punto de salida al punto de llegada.',
    rapidez: ['Rapidez media = ', { frac: ['distancia recorrida', 'tiempo'] }],
    velocidad: ['Velocidad media = ', { frac: ['desplazamiento', 'tiempo'] }],
    cuadra: '1 cuadra = 100 m',
    hip: ['Pitágoras: ', cuad('hipotenusa'), ' = ', cuad('cateto'), ' + ', cuad('cateto')],
    // θ de la ley de cosenos: el ángulo entre A⃗ y B⃗ cola con cola (no el de adentro del triángulo; por eso «+»).
    ley: [cuad(R), ' = ', cuad(A), ' + ', cuad(B), ' + 2', A, B, ' cos ', th, '; ', th, ' entre ', vA, ' y ', vB, ' cola con cola'],
    pita: ['Si ', vA, ' y ', vB, ' forman 90°: ', cuad(R), ' = ', cuad(A), ' + ', cuad(B)],
    extremos: ['Si apuntan igual: ', R, ' = ', A, ' + ', B, '. Si se oponen: ', R, ' = ', A, ' − ', B, ', con ', A, ' la mayor'],
    comp: [sub(A, 'x'), ' = ', A, ' cos ', th, ',   ', sub(A, 'y'), ' = ', A, ' sen ', th, ', con ', th, ' medido desde el eje x'],
    compEje: V => ['Con ', th, ' medido desde un eje: sobre ese eje, ', V, ' cos ', th, '; sobre el otro, ', V, ' sen ', th],
    signos: 'Signos: la componente x es negativa si apunta a la izquierda; la y, si apunta hacia abajo.',
    unitario: [u, ' = ', { frac: [vA, A] }, ': cada componente de ', vA, ' entre su módulo ', A],
    sumaComp: [vR, ' = ', vA, ' + ', vB, ' = (', sub(A, 'x'), ' + ', sub(B, 'x'), ')î + (', sub(A, 'y'), ' + ', sub(B, 'y'), ')ĵ'],
    tan: ['tan ', th, ' = ', { frac: [sub(A, 'y'), sub(A, 'x')] }, ', con ', th, ' el ángulo con el eje x'],
    escalar: [vA, ' · ', vB, ' = ', A, B, ' cos ', th],
    escalarC: [vA, ' · ', vB, ' = ', sub(A, 'x'), sub(B, 'x'), ' + ', sub(A, 'y'), sub(B, 'y')],
    escalar2: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = ', sub(A, 'x'), sub(B, 'x'), ' + ', sub(A, 'y'), sub(B, 'y')],
    vectorial: ['|', vA, ' × ', vB, '| = ', A, B, ' sen ', th],
    vectorialC: [vA, ' × ', vB, ' = (', sub(A, 'x'), sub(B, 'y'), ' − ', sub(A, 'y'), sub(B, 'x'), ') k̂'],
    area: ['Área del paralelogramo que arman ', vA, ' y ', vB, ' = |', vA, ' × ', vB, '|'],
    mano: 'Regla de la mano derecha: î × ĵ = k̂ y ĵ × î = −k̂',
    sale: 'k̂ sale de la pantalla (⊙); −k̂ entra en ella (⊗).',
    ij: 'î y ĵ: flechas de largo 1 por los ejes x e y; 3î + 2ĵ avanza 3 y sube 2.',
    u: 'u: una unidad de largo cualquiera; el problema no dice cuál.',
    cuadrante: 'Ángulo desde +x, con α el agudo con el eje x: I, α; II, 180° − α; III, 180° + α; IV, 360° − α.',
    perpend: 'Dos ángulos cuyos lados son perpendiculares entre sí son iguales.',
    dirSentido: 'Dirección: la recta por la que va (este-oeste). Sentido: hacia cuál de sus dos lados (al este).',
  };

  // ---------- Idea 1: ¿basta un número? Escalar o vector (16 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-dron: un dron sale de la plaza y vuela en línea recta. Cambia: cuánto vuela y hacia dónde · Permanece:
  // la plaza y los lugares del mapa · Progresa: el círculo punteado de los puntos a la misma distancia pasa por el
  // colegio y por el mercado · Se reserva: el nombre «vector» hasta «Mira» · Debe verse: mismo número, otro lugar.
  const DR = () => Kit.piezas['fis-dron'];
  const LUGARES = [
    { nombre: 'Colegio', largo: 300, rumbo: 'NE' },
    { nombre: 'Mercado', largo: 300, rumbo: 'NO' },
    { nombre: 'Paradero', largo: 150, rumbo: 'S' },
  ];
  const RUMBO_TXT = { E: 'Este', NE: 'Noreste', N: 'Norte', NO: 'Noroeste', O: 'Oeste', SO: 'Suroeste', S: 'Sur', SE: 'Sureste' };
  const RUMBO_DE = { 0: 'E', 45: 'NE', 90: 'N', 135: 'NO', 180: 'O', 225: 'SO', 270: 'S', 315: 'SE' };
  const hacia = r => `hacia el ${RUMBO_TXT[r].toLowerCase()}`;
  const vuelo = (largo, rumbo, o = {}) => ({ datos: { lugares: LUGARES, drones: [{ largo, rumbo, valor: `${f(largo, 0)} m` }],
    circulo: o.circulo === false ? null : largo, textoCirculo: o.circulo === false ? '' : `Todos a ${f(largo, 0)} m de la plaza` }, estado: {} });
  const VISTAS_V = [
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NE', valor: '300 m' }] },
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NE', valor: '300 m' }, { largo: 300, rumbo: 'NO', valor: '300 m' }] },
    { lugares: LUGARES, circulo: 300, textoCirculo: 'Con solo «300 m»: cualquiera de estos puntos' },
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NO', valor: '300 m' }], circulo: 300, textoCirculo: '«300 m hacia el noroeste»: un solo punto' },
  ];
  // Magnitudes para clasificar. El enunciado no dice «hacia dónde» (lector en frío, 16 nov: con «hacia Puno» en el texto
  // se contestaba por la palabra); las escalares traen la trampa que hace pensar que apuntan (bajar, ser negativa…).
  const DATOS_EV = [
    { q: 'Una combi va a 40 km/h. ¿Qué clase de magnitud es su velocidad?', es: 'v', mag: 'la velocidad' },
    { q: 'Empujas una puerta con 20 N. ¿Qué clase de magnitud es esa fuerza?', es: 'v', mag: 'la fuerza' },
    { q: 'Un dron se desplazó 300 m. ¿Qué clase de magnitud es su desplazamiento?', es: 'v', mag: 'el desplazamiento' },
    { q: 'Una piedra cae con 9,8 m/s². ¿Qué clase de magnitud es su aceleración?', es: 'v', mag: 'la aceleración' },
    { q: 'En la noche, la temperatura baja a −8 °C. ¿Qué clase de magnitud es la temperatura?', es: 'e', mag: 'la temperatura',
      trampa: { id: 'baja', texto: 'Vectorial: baja y hasta es negativa', error: 'ESC-SUBEBAJA', siFuera: 'Bajar es cambiar de valor, y el signo de −8 °C no apunta a ningún lado.' },
      nota: 'Bajar o ser negativa no es apuntar hacia un lado: sigue siendo escalar.' },
    { q: 'Un ciclista recorre 700 m entre ida y vuelta. ¿Qué clase de magnitud es la distancia recorrida?', es: 'e', mag: 'la distancia recorrida',
      trampa: { id: 'mueve', texto: 'Vectorial: el ciclista se movió', error: 'ESC-MOVIMIENTO', siFuera: 'Se movió, pero la distancia suma todo el camino sin mirar hacia dónde. La flecha es el desplazamiento.' },
      nota: 'Suma todo el camino sin mirar hacia dónde: es escalar. La flecha sería el desplazamiento.' },
    { q: 'Un saco de quinua tiene 50 kg. ¿Qué clase de magnitud es su masa?', es: 'e', mag: 'la masa',
      trampa: { id: 'cae', texto: 'Vectorial: si lo sueltas, cae', error: 'ESC-PESO', siFuera: 'Lo que tira hacia abajo es el peso, una fuerza. La masa solo dice cuánta materia hay.' },
      nota: 'Lo que tira hacia abajo es el peso, una fuerza; la masa no apunta.' },
    { q: 'El viaje a Puno dura 45 min. ¿Qué clase de magnitud es el tiempo?', es: 'e', mag: 'el tiempo',
      trampa: { id: 'avanza', texto: 'Vectorial: el tiempo avanza', error: 'ESC-TIEMPO', siFuera: 'Que el tiempo pase no es apuntar en el espacio: 45 min no tiene rumbo.' },
      nota: 'Que el tiempo pase no es apuntar hacia un lado: es escalar.' },
  ];
  const QUIEN_EV = ['Un ciclista', 'Una vicuña', 'Una alumna', 'Un perro'];
  // Ejemplos resueltos de «Escalar o vector». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad: 40 + 15; 4 · 100;
  // 60 + 25 + 15 y 60 − 25 + 15; 1200/600 y 0/600; 21 − 12 y 18 + 9; 6/0,5; √(300² + 400²); 6 − 2, 5 − 2 y √(4² + 3²);
  // 1400/200 y √(600² + 800²)/200; 3,14 · 50 y 2 · 50; 40 + 30 + 40 y 110 − 30.
  const EJEMPLOS_ESCALAR = [
    { nivel: 1, titulo: 'Un saco, una fuerza, un tiempo', figura: ff({ objeto: 'caja', texto: '50 kg', flechas: [{ ang: 90, mod: 500, color: 'o', rotulo: 'F⃗', valor: '500 N' }] }),
      enunciado: ['Un agricultor levanta un saco de papa de 50 kg con una fuerza de ', dA('500 N hacia arriba'), ' durante 2 s. ¿Cuáles de esos tres datos son vectoriales?'],
      datos: [DT.clase],
      solucion: [
        { texto: ['La masa, 50 kg, y el tiempo, 2 s, quedan dichos con un número y su unidad: son escalares.'] },
        { texto: ['La fuerza necesita además hacia dónde, ', dA('hacia arriba'), ': es un vector y se dibuja como una flecha.'] },
      ],
      respuesta: ['Solo la ', dA('fuerza'), '; la masa y el tiempo son escalares'] },
    { nivel: 1, titulo: 'Una lancha hacia Taquile', figura: ff({ objeto: 'bote', rumbo: 0, norte: true, flechas: [{ ang: 0, mod: 20, color: 'o', rotulo: 'v⃗', valor: '20 km/h' }] }),
      enunciado: ['Una lancha va de Puno hacia la isla Taquile a ', dA('20 km/h hacia el este'), '. En ese dato, ¿cuál es el módulo, cuál la dirección y cuál el sentido?'],
      datos: ['Módulo: cuánto mide el vector, con su unidad.', DT.dirSentido],
      solucion: [
        { texto: ['La velocidad es un vector: dice cuánto y hacia dónde. El módulo es el número con su unidad, ', dA('20 km/h'), ', que también se llama rapidez.'] },
        { texto: ['La dirección es la recta por la que va: la línea este-oeste. El sentido es hacia cuál de sus dos lados: ', dA('hacia el este'), '.'] },
      ],
      respuesta: ['Módulo: ', dA('20 km/h'), '; dirección: este-oeste; sentido: ', dA('al este')] },
    { nivel: 1, titulo: 'Una alpaca que va y vuelve', figura: ff({ objeto: 'cuadras', rejilla: false, norte: true, tramos: [{ dir: 'E', n: 40, rotulo: '40 m' }, { dir: 'O', n: 15, rotulo: '15 m' }] }),
      enunciado: ['Una alpaca camina ', dA('40 m'), ' hacia el este y luego regresa ', dB('15 m'), ' hacia el oeste. ¿Cuál es la distancia que recorrió?'],
      datos: [DT.distancia],
      solucion: [
        { texto: ['La distancia recorrida es un escalar: suma todo el camino, sin mirar hacia dónde.'], ecuacion: [dA('40 m'), ' + ', dB('15 m'), ' = ', dist('55 m')] },
      ],
      respuesta: [dist('55 m')] },
    { nivel: 1, titulo: '¿A 2 km de dónde?', figura: { pieza: 'fis-dron', datos: { max: 3000, paso: 1000, circulo: 2000, textoCirculo: 'Todos a 2 km de la plaza' }, estado: {} },
      enunciado: ['Un vecino dice: «La chacra queda a 2 km de la plaza». ¿Basta ese dato para llegar a la chacra?'],
      datos: [DT.clase],
      solucion: [
        { texto: ['Con solo «2 km», la chacra puede estar en cualquier punto del círculo punteado.'] },
        { texto: ['Falta saber hacia dónde. La posición de la chacra vista desde la plaza es un vector: necesita un módulo, 2 km, y un rumbo.'] },
      ],
      respuesta: ['No: falta hacia dónde, por ejemplo «hacia el norte»'] },
    { nivel: 1, titulo: 'Una vuelta a la plaza', figura: ff({ objeto: 'cuadras', plaza: [0, 0], tramos: [{ dir: 'E', n: 1, rotulo: '100 m' }, { dir: 'N', n: 1, rotulo: '100 m' }, { dir: 'O', n: 1, rotulo: '100 m' }, { dir: 'S', n: 1, rotulo: '100 m' }] }),
      enunciado: ['Un ciclista da una vuelta completa a una plaza de Juliaca, que es cuadrada, de 100 m de lado. ¿Cuál es su distancia recorrida y cuál su desplazamiento?'],
      datos: [DT.distancia, DT.desplaz],
      solucion: [
        { texto: ['La distancia suma los cuatro lados.'], ecuacion: ['4 × 100 m = ', dist('400 m')] },
        { texto: ['Terminó donde empezó, así que la flecha que va de la salida a la llegada no tiene largo.'], ecuacion: [vDd, ' = 0'] },
      ],
      respuesta: ['Recorrió ', dist('400 m'), '; su desplazamiento es ', dR('0')] },
    { nivel: 2, titulo: 'La carretilla en la feria', figura: ff({ objeto: 'cuadras', rejilla: false, norte: true, tramos: [{ dir: 'E', n: 60, rotulo: '60 m' }, { dir: 'O', n: 25, rotulo: '25 m' }, { dir: 'E', n: 15, rotulo: '15 m' }], resultante: { rotulo: 'Δx', valor: '?' } }),
      enunciado: ['En la feria de Juliaca, un vendedor empuja su carretilla ', dA('60 m'), ' al este, ', dB('25 m'), ' al oeste y ', dC('15 m'), ' al este. ¿Cuál es su distancia recorrida y cuál su desplazamiento?'],
      datos: [DT.distancia, ['Desplazamiento en una recta, ', dR('Δx'), ': los tramos al este suman y los tramos al oeste restan.']],
      solucion: [
        { texto: ['La distancia suma los tres tramos.'], ecuacion: [dA('60'), ' + ', dB('25'), ' + ', dC('15'), ' = ', dist('100 m')] },
        { texto: ['El desplazamiento toma el este como positivo y el oeste como negativo.'], ecuacion: [dR('Δx'), ' = ', dA('60'), ' − ', dB('25'), ' + ', dC('15'), ' = ', dR('+50 m')] },
      ],
      respuesta: ['Recorrió ', dist('100 m'), '; se desplazó ', dR('50 m al este')] },
    { nivel: 2, titulo: 'La masa y el peso', figura: ff({ objeto: 'caja', texto: 'mochila' }),
      enunciado: ['Una mochila tiene una masa de 4 kg y pesa unos 40 N. ¿Cuál de esos dos datos es escalar y cuál vectorial? ¿Hacia dónde apunta el vectorial?'],
      datos: [DT.clase, 'Peso: la fuerza con que la Tierra jala un cuerpo hacia su centro.'],
      solucion: [
        { texto: ['La masa dice cuánta materia hay, y 4 kg queda dicho con un número y su unidad: es escalar.'] },
        { texto: ['El peso es la fuerza con que la Tierra jala la mochila hacia su centro; es un vector y apunta ', dA('hacia abajo'), '.'] },
      ],
      respuesta: ['Masa: escalar. Peso: un vector de 40 N ', dA('hacia abajo')] },
    { nivel: 2, titulo: 'Los kilómetros de la carretera', figura: ff({ objeto: 'cuadras', rejilla: false, inicio: 'km 12', fin: 'km 21', tramos: [{ dir: 'E', n: 18, rotulo: 'ida' }, { dir: 'O', n: 9, rotulo: 'vuelta' }], marcas: [{ en: [18, 0], texto: 'km 30' }], resultante: { rotulo: 'Δx', valor: '?' } }),
      enunciado: ['En la carretera de Juliaca a Puno, una combi pasa por el ', dA('km 12'), ', sigue hasta el ', dA('km 30'), ' y regresa hasta el ', dB('km 21'), '. ¿Cuál es su desplazamiento y qué distancia recorrió?'],
      datos: ['En esa carretera, los kilómetros crecen hacia Puno.', ['Desplazamiento: ', dR('Δx'), ' = posición final − posición inicial'], DT.distancia],
      solucion: [
        { texto: ['El desplazamiento es la posición final menos la inicial. Sale positivo, es decir, hacia donde crecen los kilómetros: hacia Puno.'], ecuacion: [dR('Δx'), ' = ', dB('21 km'), ' − ', dA('12 km'), ' = ', dR('+9 km')] },
        { texto: ['La distancia suma la ida, del km 12 al 30, y la vuelta, del 30 al 21.'], ecuacion: ['(30 − 12) + (30 − 21) = 18 + 9 = ', dist('27 km')] },
      ],
      respuesta: [dR('9 km'), ' hacia Puno; recorrió ', dist('27 km')] },
    { nivel: 2, titulo: 'Dos caminos al colegio', figura: ff({ objeto: 'cuadras', norte: true, inicio: 'Casa', fin: 'Colegio', tramos: [{ dir: 'E', n: 4, rotulo: '400 m' }, { dir: 'N', n: 3, rotulo: '300 m' }], resultante: { rotulo: 'Luis: 500 m' } }),
      enunciado: ['Ana va de su casa al colegio: ', dA('400 m'), ' al este y ', dB('300 m'), ' al norte. Luis, desde la misma casa, va en línea recta: ', dR('500 m'), '. ¿Tienen el mismo desplazamiento? ¿Cuánto recorrió cada uno?'],
      datos: [DT.distancia, DT.desplaz],
      solucion: [
        { texto: ['Los dos salen de la casa y llegan al colegio. Como el desplazamiento solo mira la salida y la llegada, es el mismo para ambos.'] },
        { texto: ['La distancia recorrida suma el camino de cada uno.'], ecuacion: ['Ana: ', dA('400 m'), ' + ', dB('300 m'), ' = ', dist('700 m'), ';   Luis: ', dist('500 m')] },
      ],
      respuesta: ['Mismo desplazamiento; Ana recorrió ', dist('700 m'), ' y Luis, ', dist('500 m')] },
    { nivel: 2, titulo: 'Cinco datos para clasificar', figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -20, mod: 40, color: 'o', rotulo: 'F⃗', valor: '40 N' }] }),
      enunciado: ['¿Cuáles son vectoriales? 1) una temperatura de −5 °C; 2) un empuje de ', dA('40 N'), ' hacia adelante; 3) una energía de 30 J; 4) una aceleración de 2 m/s² hacia abajo; 5) un tiempo de 3 h.'],
      datos: [DT.clase],
      solucion: [
        { texto: ['Se pregunta si cada dato necesita un «hacia dónde». La temperatura, la energía y el tiempo no apuntan, así que son escalares, aunque −5 °C tenga signo.'] },
        { texto: ['El empuje apunta hacia adelante y la aceleración, hacia abajo: los dos son vectores.'] },
      ],
      respuesta: ['El ', dA('empuje'), ' (2) y la aceleración (4)'] },
    { nivel: 3, titulo: 'Tres cuadras y cuatro cuadras', figura: ff({ objeto: 'cuadras', norte: true, inicio: 'Paradero', tramos: [{ dir: 'E', n: 3, rotulo: '300 m' }, { dir: 'N', n: 4, rotulo: '400 m' }], resultante: { rotulo: 'd⃗', valor: '?' } }),
      enunciado: ['Desde el paradero, Luis camina ', dA('3 cuadras'), ' al este y ', dB('4 cuadras'), ' al norte. ¿Cuánto recorrió y a qué distancia en línea recta quedó del paradero?'],
      datos: [DT.cuadra, DT.distancia, DT.hip],
      solucion: [
        { texto: ['La distancia recorrida suma los dos tramos.'], ecuacion: [dA('300 m'), ' + ', dB('400 m'), ' = ', dist('700 m')] },
        { texto: ['El desplazamiento va del paradero al punto de llegada. Como el este y el norte forman 90°, se usa Pitágoras.'], ecuacion: [Dd, ' = ', raiz2('300', '400'), ' = √250 000 = ', dR('500 m')] },
      ],
      respuesta: ['Recorrió ', dist('700 m'), '; quedó a ', dR('500 m'), ' del paradero'] },
    { nivel: 3, titulo: 'Cuatro tramos por cuadras', figura: ff({ objeto: 'cuadras', norte: true, inicio: 'Casa', tramos: [{ dir: 'E', n: 6, rotulo: '6' }, { dir: 'N', n: 5, rotulo: '5' }, { dir: 'O', n: 2, rotulo: '2' }, { dir: 'S', n: 2, rotulo: '2' }], resultante: { rotulo: 'd⃗', valor: '?' } }),
      enunciado: ['Una alumna sale de su casa y camina ', dA('6 cuadras'), ' al este, ', dB('5'), ' al norte, ', dC('2'), ' al oeste y 2 al sur. ¿Cuánto mide su desplazamiento?'],
      datos: [DT.cuadra, 'En una misma recta, los tramos de ida suman y los de vuelta restan.', DT.hip],
      solucion: [
        { texto: ['Cada dirección se trata como una recta: hacia el este van 6 cuadras y vuelven 2; hacia el norte van 5 y vuelven 2.'], ecuacion: ['este: ', dA('6'), ' − ', dC('2'), ' = 4 cuadras,   norte: ', dB('5'), ' − 2 = 3 cuadras'] },
        { texto: ['Quedan 4 cuadras al este y 3 al norte, que forman 90°, así que se usa Pitágoras.'], ecuacion: [Dd, ' = ', raiz2('4', '3'), ' = 5 cuadras = ', dR('500 m')] },
      ],
      respuesta: [dR('500 m'), ', aunque caminó ', dist('1500 m')] },
    { nivel: 3, titulo: 'Rapidez media y velocidad media', figura: ff({ objeto: 'cuadras', norte: true, tramos: [{ dir: 'E', n: 6, rotulo: '600 m' }, { dir: 'N', n: 8, rotulo: '800 m' }], resultante: { rotulo: 'd⃗', valor: '?' } }),
      enunciado: ['Un ciclista va ', dA('600 m'), ' al este y luego ', dB('800 m'), ' al norte, en 200 s en total. ¿Cuánto valen su rapidez media y el módulo de su velocidad media?'],
      datos: [DT.rapidez, DT.velocidad, DT.hip],
      solucion: [
        { texto: ['La rapidez media es la distancia recorrida entre el tiempo.'], ecuacion: [{ frac: [[dA('600 m'), ' + ', dB('800 m')], '200 s'] }, ' = ', { frac: [dist('1400 m'), '200 s'] }, ' = ', dist('7 m/s')] },
        { texto: ['La velocidad media es el desplazamiento entre el tiempo, y el desplazamiento sale de Pitágoras.'], ecuacion: [Dd, ' = ', raiz2('600', '800'), ' = ', dR('1000 m'), ',   ', { frac: [dR('1000 m'), '200 s'] }, ' = ', dR('5 m/s')] },
      ],
      respuesta: ['Rapidez media: ', dist('7 m/s'), '. Velocidad media: ', dR('5 m/s')] },
    { nivel: 3, titulo: 'Media vuelta a la pista',
      figura: flx({ unidad: 'm', contorno: Array.from({ length: 19 }, (_, i) => [50 * Math.cos(i * Math.PI / 18), 50 * Math.sin(i * Math.PI / 18)]),
        segmentos: [{ de: [0, 0], a: [0, 50], texto: 'r = 50 m' }],
        resultante: { de: [50, 0], a: [-50, 0], color: 'f', rotulo: 'd⃗', valor: '?', lejos: [0, 50] } }),
      enunciado: ['Una atleta corre media vuelta en una pista circular de 50 m de radio, de un extremo al otro. ¿Cuál es su distancia recorrida y cuál el módulo de su desplazamiento?'],
      datos: ['Longitud de una circunferencia de radio r: L = 2πr', 'π ≈ 3,14', [Dd, ': el módulo del desplazamiento']],
      solucion: [
        { texto: ['Media vuelta es la mitad de la circunferencia, que mide 2πr; por eso queda πr.'], ecuacion: ['π · r = 3,14 · 50 m = ', dist('157 m')] },
        { texto: ['El desplazamiento va en línea recta de un extremo al otro: cruza el centro y mide un diámetro, dos radios.'], ecuacion: [Dd, ' = 2 · 50 m = ', dR('100 m')] },
      ],
      respuesta: ['Recorrió ', dist('157 m'), '; se desplazó ', dR('100 m')] },
    { nivel: 3, titulo: 'Un dron que sube y baja',
      figura: flx({ unidad: 'm', flechas: [{ de: [0, 0], a: [0, 40], color: 'o', rotulo: 'sube', valor: '40 m' }, { de: [0, 40], a: [30, 40], color: 'i', rotulo: 'avanza', valor: '30 m' }, { de: [30, 40], a: [30, 0], color: 'd', rotulo: 'baja', valor: '40 m' }],
        resultante: { de: [0, 0], a: [30, 0], color: 'f', rotulo: 'd⃗', lejos: [15, 40] } }),
      enunciado: ['Un dron sube ', dA('40 m'), ', avanza ', dB('30 m'), ' en horizontal y baja ', dC('40 m'), '. ¿Cuántos metros más larga es su distancia recorrida que su desplazamiento?'],
      datos: [DT.distancia, DT.desplaz],
      solucion: [
        { texto: ['La distancia recorrida suma los tres tramos.'], ecuacion: [dA('40 m'), ' + ', dB('30 m'), ' + ', dC('40 m'), ' = ', dist('110 m')] },
        { texto: ['Subió 40 m y bajó 40 m, así que terminó a la misma altura; del inicio al final solo quedan los 30 m horizontales.'], ecuacion: [Dd, ' = ', dR('30 m')] },
        { texto: ['Para comparar, se resta el desplazamiento de la distancia recorrida.'], ecuacion: [dist('110 m'), ' − ', dR('30 m'), ' = 80 m'] },
      ],
      respuesta: [dist('80 m'), ' más larga'] },
  ];

  const escalarOVector = {
    id: 'escalar-vector',
    titulo: 'Escalar o vector',
    pregunta: '¿Basta con decir «300 m» para saber dónde aterrizó un dron?',
    temas: ['Escalares y vectores'],
    pieza: 'fis-dron',
    lee: {
      tarjetas: [
        { titulo: 'Datos con número y unidad', texto: 'Muchos datos se dicen con un número y su unidad: una masa de 50 kg, una clase de 45 min. Con otros, como un vuelo de 300 m, vale la pena preguntarse si basta con el número.' },
        { titulo: 'El rumbo', texto: 'En un mapa, el norte va arriba, y el rumbo dice hacia dónde se va: norte, sur, este, oeste o uno intermedio, como noreste. Quien va al este y vuelve al oeste recorre la misma recta en sentidos opuestos.' },
        { titulo: 'Distancia y desplazamiento', texto: 'La distancia recorrida es todo el camino que haces, con sus vueltas. El desplazamiento, en cambio, solo mira de dónde saliste y a dónde llegaste.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover un dron que sale de la plaza. Cambia cuánto vuela y hacia dónde, y mira el círculo punteado: ¿por dónde pasa?' },
      ],
    },
    actividad: 'Volar un dron desde la plaza y cambiar cuánto vuela y hacia dónde.',
    ejemplos: EJEMPLOS_ESCALAR,
    aprendizaje: 'Con solo «300 m», el dron puede estar en cualquier punto de un círculo; con el rumbo, en uno solo: eso es un vector.',
    juega: {
      pieza: 'fis-dron',
      consigna: 'Un dron sale de la plaza y vuela en línea recta. Tú decides cuánto vuela y hacia dónde.',
      mision: {
        texto: 'Lleva el dron al mercado.',
        logrado: val => val.largo === 300 && val.rumbo === 'NO',
        bien: 'Llegaste: 300 m hacia el noroeste. Hacia el noreste habrías caído en el colegio.',
      },
      voz: '¿Por qué lugares pasa el círculo punteado?',
      leyenda: [
        { s: 'N', t: 'el norte: arriba en el mapa' },
        { s: '→', t: 'el vuelo, de la plaza al dron' },
        { s: '100 m', t: 'cada cuadro del mapa' },
      ],
      controles: [
        { id: 'largo', etiqueta: 'Cuánto vuela', color: 'c-f', min: 100, max: 400, paso: 50, inicio: 200, unidad: 'm', decimales: 0 },
        { id: 'rumbo', etiqueta: 'Hacia dónde', opciones: ['E', 'NE', 'N', 'NO', 'O', 'SO', 'S', 'SE'].map(r => ({ valor: r, texto: RUMBO_TXT[r] })) },
      ],
      // Gesto directo: el dron se arrastra; el largo se ajusta a 50 m y el rumbo, al más cercano de los ocho.
      arrastres: [
        { id: 'dron', etiqueta: 'el dron', color: 'c-f',
          donde: val => { const p = DR().punto({}, val.largo, val.rumbo); return { x: p[0], y: p[1] }; },
          mover: pt => {
            const c = DR().constantes, dx = pt.x - c.CX, dy = c.CY - pt.y;
            const g = ((Math.round(Math.atan2(dy, dx) * 180 / Math.PI / 45) * 45) % 360 + 360) % 360;
            return { largo: Math.hypot(dx, dy) / c.RPX * 400, rumbo: RUMBO_DE[g] };
          } },
      ],
      dibujo: val => vuelo(val.largo, val.rumbo),
      lectura: val => [`Voló ${f(val.largo, 0)} m ${hacia(val.rumbo)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos drones salen de la plaza y cada uno vuela 300 m en línea recta. ¿Dónde aterrizan?',
      opciones: [
        { id: 'c', texto: 'Depende de hacia dónde vuela cada uno', correcta: true },
        { id: 'igual', texto: 'En el mismo lugar: los dos volaron 300 m', error: 'ESC-IGUAL', siFuera: 'Sería cierto si volaran hacia el mismo lado. Un dron que vuela 300 m al noreste y otro que vuela 300 m al noroeste terminan lejos uno del otro.' },
        { id: 'nada', texto: 'No se sabe ni a qué distancia de la plaza quedan', error: 'ESC-NADA', siFuera: 'Sin rumbo no se sabe dónde aterrizan, pero los 300 m sí dicen algo: los dos quedan en el círculo de 300 m alrededor de la plaza. Lo que falta es hacia dónde.' },
        { id: 'opuestos', texto: 'Siempre en lados opuestos de la plaza', error: 'ESC-OPUESTO', siFuera: 'Eso pasaría solo si volaran en sentidos contrarios, como uno al norte y otro al sur. Cada dron puede ir hacia cualquier lado, y con rumbos vecinos aterrizan cerca.' },
      ],
      dibujo: { datos: { lugares: LUGARES }, estado: {} },
      revelar: { datos: VISTAS_V[1], estado: {} },
      coincide: 'Coincide: los dos quedan a 300 m de la plaza, pero cada uno donde lo llevó su rumbo.',
    },
    mira: {
      datos: { vistas: VISTAS_V },
      pasos: [
        { estado: { vista: 0 }, texto: 'Un dron vuela 300 m hacia el noreste y aterriza en el colegio.' },
        { estado: { vista: 1 }, texto: 'Otro vuela también 300 m, pero hacia el noroeste: llega al mercado.' },
        { estado: { vista: 2 }, texto: 'Con solo «300 m», el dron podría estar en cualquier punto del círculo, porque todos sus puntos quedan a 300 m de la plaza.' },
        { estado: { vista: 3 }, texto: 'Con «300 m hacia el noroeste» queda un solo punto: un dato que dice cuánto y hacia dónde es un vector.' },
        { estado: { vista: 3 }, texto: 'El módulo es el largo, 300 m; la dirección es la recta por donde va, y el sentido, el lado hacia el que apunta.' },
        { estado: { vista: 3 }, texto: 'La distancia recorrida es un escalar; el desplazamiento, que va de la salida a la llegada, es un vector.' },
      ],
    },
    regla: {
      texto: 'Una magnitud escalar queda dicha con un número y su unidad: 5 kg de papa no apuntan a ningún lado. Una vectorial necesita además hacia dónde, porque el mismo número lleva a lugares distintos: 300 m al noreste y 300 m al noroeste terminan lejos. Se dibuja como una flecha, y su largo es el módulo.',
      condicion: 'el dato vectorial dice hacia dónde va, con un rumbo como «al noroeste» o con «hacia arriba»; si falta, el dato queda incompleto y la llegada puede ser cualquier punto del círculo.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 700);
        if (s % 2 === 0) {
          // La semilla 0, la primera que se ve, es una vectorial sin «hacia dónde» en el texto (lector en frío, ronda 2:
          // solo había visto resuelto el caso escalar y dudaba con el peso).
          const d = DATOS_EV[s === 0 ? 3 : (s / 2 + r.ent(0, 7)) % DATOS_EV.length];
          const v = d.es === 'v';
          return {
            enunciado: d.q,
            datos: [DT.clase],
            pasos: [
              { tipo: 'pide', texto: 'Piden saber si esa magnitud necesita un «hacia dónde» para quedar completa.' },
              { tipo: 'datos', texto: `La magnitud es ${d.mag}. El enunciado no dice hacia dónde, pero eso no decide de qué clase es.` },
              { tipo: 'regla', texto: 'A una magnitud escalar le basta un número y su unidad; una vectorial necesita además hacia dónde. Se mira la magnitud misma, no si el texto escribe el rumbo.' },
              { tipo: 'aplica', texto: v ? `${d.mag.charAt(0).toUpperCase() + d.mag.slice(1)} siempre va hacia algún lado; si no lo dicen, el dato está incompleto.` : `No tiene sentido preguntar hacia dónde apunta ${d.mag}.` },
              { tipo: 'sentido', texto: v ? 'Se puede dibujar como una flecha, así que es un vector.' : d.nota },
            ],
            respuesta: v ? 'Vectorial.' : 'Escalar.',
          };
        }
        const a = r.ent(3, 9) * 100, b = r.ent(1, a / 100 - 1) * 100, q = r.de(QUIEN_EV);
        return {
          enunciado: `${q} avanza ${f(a, 0)} m hacia el este y luego regresa ${f(b, 0)} m hacia el oeste. ¿Cuál es su desplazamiento?`,
          datos: [DT.desplaz, DT.distancia],
          dibujo: { datos: { drones: [{ largo: a - b, rumbo: 'E', valor: `${f(a - b, 0)} m` }], max: 900, paso: 300 }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el desplazamiento: la flecha de donde salió a donde terminó.' },
            { tipo: 'datos', texto: `Primero avanza ${f(a, 0)} m al este y después vuelve ${f(b, 0)} m al oeste.` },
            { tipo: 'regla', texto: 'El desplazamiento solo mira el inicio y el final; la vuelta deshace parte de la ida.' },
            { tipo: 'cuentas', texto: 'La vuelta va en sentido contrario a la ida y deshace parte de lo avanzado, así que se restan.', ecuacion: [`${f(a, 0)} m − ${f(b, 0)} m = ${f(a - b, 0)} m`] },
            { tipo: 'sentido', texto: `Es un vector de ${f(a - b, 0)} m hacia el este. La distancia recorrida, que es un escalar, suma la ida y la vuelta: ${f(a + b, 0)} m.` },
          ],
          respuesta: `${f(a - b, 0)} m hacia el este`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s + 11);
        if (s % 2 === 0) {
          // Sin la piedra (DATOS_EV[3]): es el primer «Así se resuelve» y no se regala la respuesta (auditoría, M1).
          const pool = DATOS_EV.filter((_, i) => i !== 3);
          const d = pool[(Math.floor(s / 2) + r.ent(0, pool.length - 1)) % pool.length], v = d.es === 'v';
          const ops = v ? [
            { id: 'c', texto: 'Vectorial: siempre va hacia algún lado', correcta: true },
            { id: 'sin', texto: 'Escalar: el dato no dice hacia dónde', error: 'ESC-SINRUMBO', siFuera: `Que aquí no lo digan no cambia qué es: ${d.mag} siempre va hacia algún lado. El dato está incompleto.` },
            { id: 'unidad', texto: 'Escalar: se dice con número y unidad', error: 'ESC-UNIDAD', siFuera: 'Todo lo que se mide tiene número y unidad: también 20 N de fuerza o 50 kg de masa. Lo que decide la clase es si además necesita un hacia dónde.' },
          ] : [
            { id: 'c', texto: 'Escalar: no apunta hacia ningún lado', correcta: true },
            d.trampa,
            { id: 'unidad', texto: 'Vectorial: tiene número y unidad', error: 'ESC-UNIDAD', siFuera: 'Todo lo que se mide tiene número y unidad: también 45 min o 20 N. Vectorial es lo que además necesita un hacia dónde, y este dato no lo necesita.' },
          ];
          return {
            pregunta: d.q,
            datos: [DT.clase],
            opciones: ops,
            solucion: { texto: v ? `${d.mag.charAt(0).toUpperCase() + d.mag.slice(1)} siempre va hacia algún lado: es un vector, aunque el dato no lo diga.` : d.nota },
          };
        }
        const a = r.ent(3, 9) * 100, q = r.de(QUIEN_EV);
        let b = r.ent(1, a / 100 - 1) * 100;
        if (2 * b === a) b -= 100;   // si la vuelta es la mitad, dos opciones dirían lo mismo
        return {
          pregunta: `${q} avanza ${f(a, 0)} m hacia el norte y regresa ${f(b, 0)} m hacia el sur. ¿Cuál es su desplazamiento?`,
          datos: [DT.desplaz, DT.distancia],
          opciones: [
            { id: 'c', texto: `${f(a - b, 0)} m hacia el norte`, correcta: true },
            { id: 'dist', texto: `${f(a + b, 0)} m hacia el norte`, error: 'ESC-DISTANCIA', siFuera: 'Eso es la distancia recorrida, que suma la ida y la vuelta. El desplazamiento solo mira dónde empezó y dónde terminó.' },
            { id: 'sentido', texto: `${f(a - b, 0)} m hacia el sur`, error: 'ESC-SENTIDO', siFuera: 'Regresó menos de lo que avanzó, así que terminó al norte del punto de salida.' },
            { id: 'vuelta', texto: `${f(b, 0)} m hacia el sur`, error: 'ESC-ULTIMO', siFuera: 'Eso es solo el último tramo. El desplazamiento va del punto de salida al punto de llegada.' },
          ],
          solucion: { texto: 'La ida y la vuelta van en sentidos contrarios, así que se restan; lo que queda dice cuánto terminó al norte del punto de salida.', ecuacion: [`${f(a, 0)} m − ${f(b, 0)} m = ${f(a - b, 0)} m`] },
        };
      },
    },
  };

  // ---------- Idea 3: la resultante depende del ángulo ----------
  // Cambia: el ángulo θ entre A y B · Permanece: los módulos (A = 6, B = 4) y el círculo donde puede caer la punta de B ·
  // Progresa: el largo de R, de A − B a A + B · Se reserva: el ángulo recto, donde vale Pitágoras ·
  // Debe verse: R va de la cola de A a la punta de B puesta a continuación.
  const colaPunta = (a, b, g, o = {}) => {
    const tip = [a + b * cosG(g), b * senG(g)], r = Math.hypot(...tip);
    // Media vuelta: dónde puede caer la punta de B con θ entre 0° y 180° (fija la escala mientras se juega).
    const circ = Array.from({ length: 19 }, (_, i) => [a + b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    return {
      datos: {
        unidad: 'u',
        contorno: o.circulo === false ? undefined : circ,
        flechas: [
          { de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A⃗', valor: o.valores === false ? undefined : `${f(a, 0)}` },
          { de: [a, 0], a: tip, color: 'i', rotulo: 'B⃗', valor: o.valores === false ? undefined : `${f(b, 0)}`, paso: o.pasoB || 0, lejos: [0, 0], rotuloEn: 0.72 },   // el rótulo de B, cerca de su punta: en la cola está el ángulo
        ],
        angulos: g > 0 && g < 180 ? [{ en: [a, 0], de: 0, a: g, texto: o.angTexto || `${f(g, 0)}°`, color: 'h', paso: o.pasoB || 0 }] : [],
        guias: [{ de: [a, 0], a: [a + b + 0.5, 0], color: 'h', paso: o.pasoB || 0 }, ...(o.marco ? [marco(...o.marco)] : [])],
        // En los ejemplos, R lleva «?»: la figura muestra el planteamiento, no la respuesta.
        resultante: { de: [0, 0], a: tip, color: 'f', rotulo: 'R⃗', valor: o.sinR ? undefined : o.rTexto || `${f(r, 2)}`, paso: o.pasoR === undefined ? 0 : o.pasoR, lejos: [a, 0] },
      },
      estado: { paso: o.paso === undefined ? 9 : o.paso },
      r,
    };
  };
  // El juego fija la escala con el B más largo (6): así la punta de B sigue al dedo sin que la figura se encoja.
  const MARCO_R = [[0, 0], [12.5, 6]];
  // Con los largos escritos (lector en frío, 16 nov: sin el número de A y de R, la misión se adivinaba).
  const juegoR = val => colaPunta(6, val.b, val.g, { marco: MARCO_R });
  // Ejemplos resueltos de «Suma de vectores». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad
  // (17 nov, fix-vec/cuentas-correcciones.js): 30 + 20; 1500 − 1200; √(6² + 8²); 7 ± 3; 64 + 49 + 56 = 169;
  // F² = 2F² + 2F² cos θ → cos θ = −1/2; (5 − 2, 4) y 5; (3 + 4, 5 − 2) y √58 ≈ 7,62; 24î + 32ĵ, su opuesta y 40;
  // 36 + 16 − 24 = 28 y √28 ≈ 5,29; √(2² + 1,5²) = 2,5, 40/2 y 1,5 · 20; 70/250 = 7/25 y √(250² − 70²) = 240;
  // (40 − 8, 30 + 6 − 12) y √(32² + 24²); (−14 + 8, 2 + 6), √100 y 180° − 53°; (17 + 7)/2 = 12, 17 − 12 = 5 y √(12² + 5²).
  // Las figuras de flechas sueltas salen de colaPunta, la misma de «Mira»: el largo y el ángulo dibujados son los datos.
  const cp = (a, b, g, o = {}) => { const c = colaPunta(a, b, g, Object.assign({ circulo: false, rTexto: '?' }, o)); return flx(c.datos, o.final === false ? c.estado : { final: true }); };
  // «Lee» de la suma: dos personas jalan una caja con cuerdas; la suma va punteada, sin valor (no adelanta la predicción).
  const LEE_SUMA = (() => {
    const a = [40 * cosG(35), 40 * senG(35)], b = [30 * cosG(5), 30 * senG(5)];
    return { datos: { objeto: 'caja', flechas: [{ ang: 35, mod: 40, desde: [34, -10], color: 'o', rotulo: 'A⃗' }, { ang: 5, mod: 30, desde: [34, 8], color: 'i', rotulo: 'B⃗', lado: -1 },
      { a: [a[0] + b[0], a[1] + b[1]], desde: [34, 0], color: 'f', rotulo: 'R⃗', discontinua: true }] }, estado: {} };
  })();
  // Valor de academia de un coseno, con paréntesis si es negativo: «(−1/2)».
  const cosP = g => (COS[g].startsWith('−') ? `(${COS[g]})` : COS[g]);
  const EJEMPLOS_SUMA = [
    { nivel: 1, titulo: 'Dos jalan hacia el mismo lado', figura: ff({ objeto: 'caja', flechas: [{ ang: 0, mod: 30, desde: [34, -20], color: 'o', rotulo: 'A⃗', valor: '30 N' }, { ang: 0, mod: 20, desde: [34, 8], color: 'i', rotulo: 'B⃗', valor: '20 N', lado: -1 }] }),
      enunciado: ['Dos personas jalan una caja hacia el este con cuerdas: una con ', A, ' = 30 N y la otra con ', B, ' = 20 N. ¿Cuánto mide la fuerza resultante?'],
      datos: [DT.extremos],
      solucion: [
        { texto: ['Como apuntan hacia el mismo lado, ', th, ' = 0°, los módulos se suman.'], ecuacion: [R, ' = ', A, ' + ', B, ' = 30 N + 20 N = 50 N'] },
      ],
      respuesta: [R, ' = ', dR('50 N'), ' hacia el este'] },
    { nivel: 1, titulo: 'La soga en la fiesta', figura: ff({ objeto: 'nudo', flechas: [{ ang: 0, mod: 1500, color: 'o', rotulo: 'A⃗', valor: '1500 N' }, { ang: 180, mod: 1200, color: 'i', rotulo: 'B⃗', valor: '1200 N' }] }),
      enunciado: ['En la fiesta del pueblo, dos equipos jalan una soga: uno con ', A, ' = 1500 N al este y el otro con ', B, ' = 1200 N al oeste. ¿Cuánto vale la resultante y hacia dónde apunta?'],
      datos: [DT.extremos],
      solucion: [
        { texto: ['Como apuntan en sentidos opuestos, ', th, ' = 180°, los módulos se restan, y gana el sentido de la fuerza mayor.'], ecuacion: [R, ' = ', A, ' − ', B, ' = 1500 N − 1200 N = 300 N'] },
      ],
      respuesta: [R, ' = ', dR('300 N'), ' hacia el este'] },
    { nivel: 1, titulo: 'Dos flechas perpendiculares', figura: cp(6, 8, 90),
      enunciado: ['Dos vectores de ', A, ' = 6 u y ', B, ' = 8 u forman ', th, ' = 90°. ¿Cuánto mide su resultante?'],
      datos: [DT.pita, DT.u],
      solucion: [
        { texto: ['Con 90°, las flechas forman un triángulo rectángulo: ', A, ' y ', B, ' son los catetos y ', R, ', la hipotenusa.'], ecuacion: [R, ' = ', raiz2('6', '8'), ' = √100 = 10 u'] },
      ],
      respuesta: [R, ' = ', dR('10 u')] },
    { nivel: 1, titulo: 'La mayor y la menor',
      figura: (() => { const c = colaPunta(7, 3, 60, { sinR: true, pasoR: 99 }); return flx(c.datos, { paso: 9 }); })(),
      enunciado: ['Dos fuerzas de ', A, ' = 7 N y ', B, ' = 3 N pueden formar cualquier ángulo. ¿Cuál es la resultante más grande posible y cuál la más chica?'],
      datos: [DT.extremos],
      solucion: [
        { texto: ['La punta de ', vB, ' puede caer en cualquier punto del arco. La mayor sale cuando apuntan igual, ', th, ' = 0°; la menor, cuando se oponen, ', th, ' = 180°.'], ecuacion: ['máx: 7 N + 3 N = 10 N,   mín: 7 N − 3 N = 4 N'] },
      ],
      respuesta: [dR('10 N'), ' la mayor y ', dR('4 N'), ' la menor'] },
    { nivel: 1, titulo: 'Ley de cosenos con 60°', figura: cp(8, 7, 60),
      enunciado: ['Dos fuerzas de ', A, ' = 8 N y ', B, ' = 7 N forman ', th, ' = 60°. ¿Cuánto mide su resultante?'],
      datos: [DT.ley, cosD(60)],
      solucion: [
        { texto: ['Con un ángulo que no es 0°, 90° ni 180° se usa la ley de cosenos, con ', th, ' el ángulo entre las dos fuerzas cola con cola.'], ecuacion: [{ sup: [R, '2'] }, ' = 64 + 49 + 2 · 8 · 7 · cos 60° = 64 + 49 + 2 · 8 · 7 · 1/2 = 169,   ', R, ' = √169 = 13 N'] },
      ],
      respuesta: [R, ' = ', dR('13 N')] },
    { nivel: 2, titulo: 'Iguales y con la misma resultante', figura: cp(5, 5, 120, { valores: false, sinR: true, angTexto: 'θ = ?' }),
      enunciado: ['Dos fuerzas de igual módulo F dan una resultante que también mide F. ¿Qué ángulo forman?'],
      datos: [DT.ley, cosD(60, 90, 120)],
      solucion: [
        { texto: ['Se usa la ley de cosenos con ', A, ' = ', B, ' = ', R, ' = F.'], ecuacion: [{ sup: ['F', '2'] }, ' = ', { sup: ['F', '2'] }, ' + ', { sup: ['F', '2'] }, ' + 2 · F · F · cos ', th] },
        { texto: ['Se pasan los dos F² de la derecha al otro lado y se despeja el coseno.'], ecuacion: ['−F² = 2F² cos ', th, '   →   cos ', th, ' = −1/2'] },
        { texto: ['El ángulo entre 0° y 180° con coseno −1/2 es 120°.'], ecuacion: [th, ' = 120°'] },
      ],
      respuesta: [th, ' = ', dTh('120°')] },
    { nivel: 2, titulo: 'El método del polígono',
      figura: flx({ unidad: 'm', flechas: [{ de: [0, 0], a: [5, 0], color: 'o', rotulo: 'A⃗', valor: '5 m' }, { de: [5, 0], a: [5, 4], color: 'i', rotulo: 'B⃗', valor: '4 m' }, { de: [5, 4], a: [3, 4], color: 'd', rotulo: 'C⃗', valor: '2 m' }],
        resultante: { de: [0, 0], a: [3, 4], color: 'f', rotulo: 'R⃗', valor: '?', lejos: [5, 0] } }),
      enunciado: ['Un perro pastor camina ', A, ' = 5 m al este, ', B, ' = 4 m al norte y ', C, ' = 2 m al oeste. ¿Cuánto mide su desplazamiento total?'],
      datos: [['Cada flecha empieza en la punta de la anterior; ', vR, ' va de la primera cola a la última punta.'], 'En una misma recta, los tramos de ida suman y los de vuelta restan.', [R, ' = ', { raiz: [[cuad(sub(R, 'x')), ' + ', cuad(sub(R, 'y'))]] }]],
      solucion: [
        { texto: ['En el método del polígono, cada flecha empieza en la punta de la anterior, y ', vR, ' va de la primera cola a la última punta.'] },
        { texto: ['Los tramos al este y al oeste se restan, y el tramo al norte queda solo.'], ecuacion: [sub(R, 'x'), ' = 5 − 2 = 3 m,   ', sub(R, 'y'), ' = 4 m'] },
        { texto: ['Los 3 m al este y los 4 m al norte forman 90°, así que se usa Pitágoras.'], ecuacion: [R, ' = ', raiz2('3', '4'), ' = 5 m'] },
      ],
      respuesta: [R, ' = ', dR('5 m')] },
    { nivel: 2, titulo: 'Sumar por componentes',
      figura: flx({ unidad: 'm', guias: ejesG(-1, 8, -1, 6), flechas: [{ de: [0, 0], a: [3, 5], color: 'o', rotulo: 'A⃗' }, { de: [3, 5], a: [7, 3], color: 'i', rotulo: 'B⃗' }],
        resultante: { de: [0, 0], a: [7, 3], color: 'f', rotulo: 'R⃗', valor: '?', lejos: [3, 5] } }),
      enunciado: ['Un dron hace dos tramos: ', vA, ' = 3î + 5ĵ y ', vB, ' = 4î − 2ĵ, en metros. ¿Cuál es su desplazamiento total y cuánto mide?'],
      datos: [DT.ij, DT.sumaComp, modD(R)],
      solucion: [
        { texto: ['Se suman las componentes de cada eje por separado.'], ecuacion: [vR, ' = (3 + 4)î + (5 − 2)ĵ = 7î + 3ĵ'] },
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [R, ' = ', raiz2('7', '3'), ' = √58 ≈ 7,62 m'] },
      ],
      respuesta: [vR, ' = 7î + 3ĵ, que mide ', dR('√58 ≈ 7,62 m')] },
    { nivel: 2, titulo: 'La fuerza que equilibra',
      figura: ff({ objeto: 'nudo', flechas: [{ a: [30, 10], color: 'o', rotulo: 'A⃗' }, { a: [-6, 22], color: 'i', rotulo: 'B⃗' }] }),
      enunciado: ['Sobre un nudo actúan ', vA, ' = 30î + 10ĵ y ', vB, ' = −6î + 22ĵ, en newtons. ¿Qué tercera fuerza ', vC, ' lo deja en equilibrio, y cuánto mide?'],
      datos: [['En equilibrio, las fuerzas suman cero: ', vA, ' + ', vB, ' + ', vC, ' = 0'], DT.sumaComp, modD(C)],
      solucion: [
        { texto: ['En equilibrio, las tres fuerzas suman cero. Primero se suman ', vA, ' y ', vB, '.'], ecuacion: [vA, ' + ', vB, ' = (30 − 6)î + (10 + 22)ĵ = 24î + 32ĵ'] },
        { texto: [vC, ' es la opuesta de esa suma: tiene el mismo largo y el sentido contrario.'], ecuacion: [vC, ' = −24î − 32ĵ'] },
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [C, ' = ', raiz2('24', '32'), ' = √1600 = 40 N'] },
      ],
      respuesta: [vC, ' = −24î − 32ĵ N, que mide ', dC('40 N')] },
    { nivel: 2, titulo: 'La diferencia de dos vectores',
      figura: flx({ unidad: 'u', flechas: [{ de: [0, 0], a: [6, 0], color: 'o', rotulo: 'A⃗', valor: '6' }, { de: [0, 0], a: [2, 2 * Math.sqrt(3)], color: 'i', rotulo: 'B⃗', valor: '4' }], angulos: [{ en: [0, 0], de: 0, a: 60, texto: '60°', color: 'h' }] }),
      enunciado: ['Dos vectores miden ', A, ' = 6 u y ', B, ' = 4 u, y forman ', th, ' = 60°. ¿Cuánto mide su diferencia ', vA, ' − ', vB, '?'],
      datos: [DT.ley, ['Restar es sumar el opuesto: ', vA, ' − ', vB, ' = ', vA, ' + (−', vB, ')'], ['−', vB, ' mide lo mismo que ', vB, ' y apunta al revés.'], cosD(60, 120), DT.u],
      solucion: [
        { texto: ['Restar ', vB, ' es sumar −', vB, ', que apunta al revés. Si ', vB, ' forma 60° con ', vA, ', −', vB, ' forma 180° − 60° = 120°.'] },
        { texto: ['Se usa la ley de cosenos con 120°; como cos 120° es negativo, el último término resta.'], ecuacion: ['|', vA, ' − ', vB, '|² = 36 + 16 + 2 · 6 · 4 · cos 120° = 36 + 16 + 2 · 6 · 4 · (−1/2) = 28'] },
        { texto: ['Se saca la raíz. El resultado queda entre 6 − 4 = 2 y 6 + 4 = 10, como debe ser.'], ecuacion: ['|', vA, ' − ', vB, '| = √28 = 2√7 ≈ 5,29 u'] },
      ],
      respuesta: ['|', vA, ' − ', vB, '| = ', dR('2√7 ≈ 5,29 u')] },
    { nivel: 3, titulo: 'Cruzar un río de la sierra',
      figura: ff({ objeto: 'bote', orillas: true, ancho: 'Río de 40 m de ancho', flechas: [{ ang: 90, mod: 2, color: 'o', rotulo: 'A⃗', valor: '2 m/s' }, { de: [0, 2], ang: 0, mod: 1.5, color: 'i', rotulo: 'B⃗', valor: '1,5 m/s' }, { a: [1.5, 2], color: 'f', rotulo: 'R⃗', valor: '?' }] }),
      enunciado: ['Un bote cruza un río de 40 m de ancho a ', A, ' = 2 m/s, y la corriente lo lleva a ', B, ' = 1,5 m/s. ¿Qué rapidez lleva respecto a la orilla, cuánto tarda en cruzar y cuánto lo arrastra?'],
      datos: [DT.pita, 'Con rapidez constante: distancia = rapidez × tiempo'],
      solucion: [
        { texto: ['Como las dos velocidades forman 90°, la del bote respecto a la orilla sale de Pitágoras.'], ecuacion: [R, ' = ', raiz2('2', '1,5'), ' = √6,25 = 2,5 m/s'] },
        { texto: ['Para cruzar solo cuenta lo que avanza hacia la otra orilla, 2 m/s. La corriente no lo acerca ni lo aleja.'], ecuacion: ['t = 40 m ÷ 2 m/s = 20 s'] },
        { texto: ['En esos 20 s, la corriente lo lleva río abajo.'], ecuacion: ['1,5 m/s × 20 s = 30 m'] },
      ],
      respuesta: [R, ' = ', dR('2,5 m/s'), '; tarda 20 s y llega 30 m río abajo'] },
    { nivel: 3, titulo: 'Una avioneta con viento cruzado',
      figura: ff({ objeto: 'avion', norte: true, largo: 150, flechas: [{ ang: 106.26, mod: 250, color: 'o', rotulo: 'A⃗', valor: '250 km/h' }, { de: [-70, 240], ang: 0, mod: 70, color: 'i', rotulo: 'B⃗', valor: '70 km/h' }, { ang: 90, mod: 240, color: 'f', rotulo: 'R⃗', valor: '?' }], angulos: [{ de: 90, a: 106.26, texto: 'θ', radio: 60 }] }),
      enunciado: ['Una avioneta vuela a ', A, ' = 250 km/h respecto al aire, y el viento sopla a ', B, ' = 70 km/h hacia el este. ¿Hacia dónde apunta para ir al norte, y con qué rapidez avanza?'],
      datos: [DT.hip, ['En un triángulo rectángulo: sen ', th, ' = ', { frac: ['cateto opuesto a θ', 'hipotenusa'] }], 'sen 16° = 7/25 y sen 74° = 24/25'],
      solucion: [
        { texto: ['Debe apuntar un poco al oeste, para que el viento la corrija. ', vR, ', su velocidad respecto al suelo, apunta al norte: ', vR, ' = ', vA, ' + ', vB, '.'] },
        { texto: [A, ' es la hipotenusa del triángulo y ', B, ', el cateto opuesto al desvío ', th, '.'], ecuacion: ['sen ', th, ' = ', { frac: ['70', '250'] }, ' = 7/25,   ', th, ' = 16°'] },
        { texto: [R, ' es el otro cateto, así que sale de Pitágoras.'], ecuacion: [R, ' = ', raiz2('250', '70', ' − '), ' = √57 600 = 240 km/h'] },
      ],
      respuesta: [th, ' = 16° al oeste del norte; avanza a ', R, ' = ', dR('240 km/h')] },
    { nivel: 3, titulo: 'Tres cuerdas en un nudo',
      figura: ff({ objeto: 'nudo', largo: 210, flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'A⃗', valor: '50 N' }, { ang: 143.13, mod: 10, color: 'i', rotulo: 'B⃗', valor: '10 N', lado: -1 }, { ang: 270, mod: 12, color: 'd', rotulo: 'C⃗', valor: '12 N', lado: -1 }],
        angulos: [{ de: 0, a: 36.87, texto: '37°', radio: 28 }], guias: [{ de: [-30, 0], a: [42, 0] }] }),
      enunciado: ['Sobre un nudo jalan tres cuerdas: ', A, ' = 50 N a 37°, ', B, ' = 10 N a 143° y ', C, ' = 12 N a 270°, desde el eje +x. Halla cuánto mide la fuerza total.'],
      datos: [senCos(37), DT.cuadrante, 'Tamaños de las componentes, con α agudo desde el eje x: F cos α en x y F sen α en y.', DT.signos, DT.sumaComp, modD(R)],
      solucion: [
        { texto: [vA, ' se descompone con su ángulo de 37°. ', vB, ' está a 143° = 180° − 37°: forma 37° con el eje x negativo y va a la izquierda y hacia arriba.'], ecuacion: [vA, ' = 50 · cos 37° î + 50 · sen 37° ĵ = 40î + 30ĵ,   ', vB, ' = −10 · cos 37° î + 10 · sen 37° ĵ = −8î + 6ĵ'] },
        { texto: [vC, ' apunta hacia abajo, así que solo tiene componente y, y es negativa.'], ecuacion: [vC, ' = −12ĵ'] },
        { texto: ['Se suman las componentes de cada eje.'], ecuacion: [vR, ' = (40 − 8)î + (30 + 6 − 12)ĵ = 32î + 24ĵ'] },
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [R, ' = ', raiz2('32', '24'), ' = √1600 = 40 N'] },
      ],
      respuesta: ['La fuerza total mide ', R, ' = ', dR('40 N')] },
    { nivel: 3, titulo: 'Hacia dónde apunta la suma',
      figura: flx({ unidad: 'N', guias: ejesG(-15, 9, -1, 9), flechas: [{ de: [0, 0], a: [-14, 2], color: 'o', rotulo: 'A⃗' }, { de: [0, 0], a: [8, 6], color: 'i', rotulo: 'B⃗' }] }),
      enunciado: ['Dos cuerdas jalan un bote: ', vA, ' = −14î + 2ĵ y ', vB, ' = 8î + 6ĵ, en newtons. ¿Cuánto mide la fuerza total ', vR, ' = ', vA, ' + ', vB, ' y qué ángulo forma con el eje +x?'],
      datos: [DT.sumaComp, modD(R), ['Con α el ángulo agudo con el eje x: tan α = ', { frac: [['|', sub(R, 'y'), '|'], ['|', sub(R, 'x'), '|']] }], 'tan 37° = 3/4 y tan 53° = 4/3', DT.cuadrante],
      solucion: [
        { texto: ['Se suman las componentes.'], ecuacion: [vR, ' = (−14 + 8)î + (2 + 6)ĵ = −6î + 8ĵ'] },
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [R, ' = ', raiz2('6', '8'), ' = √100 = 10 N'] },
        { texto: [vR, ' apunta arriba y a la izquierda, en el segundo cuadrante. Su ángulo agudo con el eje x tiene tangente 8/6 = 4/3, así que α = 53°.'], ecuacion: [th, ' = 180° − 53° = 127°'] },
      ],
      respuesta: [R, ' = ', dR('10 N'), ', a ', th, ' = 127° del eje +x'] },
    { nivel: 3, titulo: 'Máxima, mínima y a 90°', figura: cp(12, 5, 90, { valores: false }),
      enunciado: ['Dos fuerzas dan una resultante máxima de 17 N y una mínima de 7 N. ¿Cuánto vale la resultante si forman 90°?'],
      datos: [DT.extremos, DT.pita],
      solucion: [
        { texto: ['La máxima es la suma de los módulos y la mínima, la resta.'], ecuacion: [A, ' + ', B, ' = 17,   ', A, ' − ', B, ' = 7'] },
        { texto: ['Se suman las dos ecuaciones: 2', A, ' = 24.'], ecuacion: [A, ' = 12 N,   ', B, ' = 17 − 12 = 5 N'] },
        { texto: ['Como forman 90°, se usa Pitágoras.'], ecuacion: [R, ' = ', raiz2('12', '5'), ' = √169 = 13 N'] },
      ],
      respuesta: [R, ' = ', dR('13 N')] },
  ];

  const resultante = {
    id: 'resultante',
    titulo: 'Suma de vectores',
    pregunta: '¿Por qué 3 + 4 no siempre da 7 cuando sumas flechas?',
    temas: ['Suma de vectores por el método gráfico'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        // Punto 1 del contrato: la primera pantalla trae un objeto reconocible (dos personas jalan una caja con cuerdas).
        { titulo: 'Dos cuerdas, una caja', pieza: 'fis-fuerzas', dibujo: LEE_SUMA,
          texto: ['Dos personas jalan una caja con cuerdas, ', vA, ' y ', vB, '. La caja se mueve como si la jalara una sola cuerda, ', vR, ': esa flecha es la suma de las dos.'] },
        { titulo: 'Sumar flechas', texto: ['Sumar dos vectores es hacer uno y después el otro: ', vB, ' se pone con su cola en la punta de ', vA, ', sin cambiar su largo ni su rumbo. ', vR, ' va de la cola de ', vA, ' a la punta de ', vB, '.'] },
        { titulo: 'El ángulo entre dos flechas', texto: [th, ' es el ángulo entre ', vA, ' y ', vB, ' cola con cola: vale 0° si apuntan igual y 180° si se oponen, y se mide desde la línea punteada que sigue a ', vA, '. El ángulo de adentro del triángulo es otro: 180° − ', th, '.'] },
        { titulo: 'Qué mirar al jugar', texto: [vB, ' gira sobre la punta de ', vA, '. Mira cuánto mide ', vR, ' cuando ', vB, ' apunta como ', vA, ' y cuando apunta al revés.'] },
      ],
    },
    actividad: 'Girar una flecha B sobre la punta de A y mirar cuánto mide la suma.',
    ejemplos: EJEMPLOS_SUMA,
    aprendizaje: 'R mide A + B si apuntan igual, A − B si se oponen, y un valor intermedio con cualquier otro ángulo.',
    juega: {
      consigna: [vB, ' gira sola sobre la punta de ', vA, '. Mira cómo ', vR, ' se estira hasta ', A, ' + ', B, ' y se encoge hasta ', A, ' − ', B, '.'],
      mision: {
        texto: ['Haz que ', R, ' valga 0. Vas a tener que cambiar también el largo de ', vB, '.'],
        logrado: val => colaPunta(6, val.b, val.g).r < 1e-9,
        bien: ['', vA, ' y ', vB, ', iguales y opuestas, se anulan: así se equilibran dos fuerzas.'],
      },
      voz: 'Mira entre qué valores se mueve R.',
      leyenda: [
        { s: [vA], t: 'la primera flecha; mide A = 6' },
        { s: [vB], t: 'la segunda, puesta en la punta de A⃗' },
        { s: [vR], t: 'la resultante: la suma A⃗ + B⃗' },
        { s: [R], t: 'cuánto mide R⃗ (su módulo)' },
        { s: [th], t: 'el ángulo entre A⃗ y B⃗' },
        { s: ['- - -'], t: 'sigue a A⃗: θ se mide desde ahí' },
        { s: ['u'], t: 'los largos van en unidades cualesquiera' },
      ],
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => { const c = juegoR(val); return { datos: c.datos, estado: c.estado }; },
      // La lectura enuncia la relación (contrato, punto 7): R queda entre A − B y A + B.
      lectura: val => [R, ` = ${f(colaPunta(6, val.b, val.g).r, 2)}: entre `, A, ' − ', B, ` = ${f(Math.abs(6 - val.b), 0)} y `, A, ' + ', B, ` = ${f(6 + val.b, 0)}`],
      minimo: 4,
      // Arrastra la punta de B: su giro es θ y su distancia a la punta de A es el largo de B.
      arrastres: [
        { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
          donde: val => { const g = FL().geometria(juegoR(val).datos), tip = [6 + val.b * cosG(val.g), val.b * senG(val.g)]; return { x: g.X(tip[0]), y: g.Y(tip[1]) }; },
          mover: (pt, val) => {
            const g = FL().geometria(juegoR(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
            return { g: anguloDe([6, 0], q), b: Math.hypot(q[0] - 6, Math.max(0, q[1])) };
          } },
      ],
    },
    predice: {
      pregunta: ['Dos fuerzas de ', A, ' = 3 N y ', B, ' = 4 N forman un ángulo ', th, ' = 90°. ¿Cuánto mide la resultante?'],
      opciones: [
        { id: 'c', texto: '5 N', correcta: true },
        { id: 'suma', texto: '7 N', error: 'V-SUMA', siFuera: 'Sumaste 3 + 4 como si las fuerzas jalaran hacia el mismo lado, lo que solo pasa con θ = 0°. A 90°, cada una jala hacia otro lado y la resultante es menor que 7.' },
        { id: 'resta', texto: '1 N', error: 'V-RESTA', siFuera: 'Restaste 4 − 3 como si las fuerzas se opusieran, lo que solo pasa con θ = 180°. A 90° no se estorban de frente, así que la resultante es mayor que 1.' },
        { id: 'raiz', texto: '√7 N', error: 'V-PITAGORAS', siFuera: 'Pitágoras es la idea, pero lo que se suma son los cuadrados, 9 + 16, y después se saca la raíz.' },
      ],
      dibujo: (() => { const c = colaPunta(3, 4, 90, { circulo: false, sinR: true, pasoR: 9, paso: 0 }); return { datos: c.datos, estado: c.estado }; })(),
      revelar: (() => { const c = colaPunta(3, 4, 90, { circulo: false }); return { datos: c.datos, estado: c.estado }; })(),
      coincide: 'Coincide: A, B y R forman un triángulo rectángulo de lados 3, 4 y 5.',
    },
    mira: {
      datos: colaPunta(6, 4, 60, { circulo: false, pasoB: 1, pasoR: 2 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: [vA, ' es un vector: se dibuja con su largo, 6 unidades.'], ecuacion: [A, ' = 6'] },
        { estado: { paso: 1 }, texto: [vB, ' empieza en la punta de ', vA, ', sin cambiar su largo ni su dirección.'], ecuacion: [B, ' = 4,   ', th, ' = 60°'] },
        { estado: { paso: 2 }, texto: ['La resultante, ', vR, ', se calcula con la ley de cosenos.'], ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
        { estado: { paso: 2, final: true }, texto: 'El último término, con cos 60° = 0,5, da 24.', ecuacion: ['2 · 6 · 4 · cos 60° = 2 · 6 · 4 · 0,5 = 24;   ', { sup: [R, '2'] }, ' = 36 + 16 + 24 = 76,   ', R, ` ≈ ${f(Math.sqrt(76), 2)}`] },
      ],
    },
    regla: {
      texto: 'Sumar vectores es ponerlos uno tras otro: R⃗ va de la cola de A⃗ a la punta de B⃗. Por eso su módulo R depende del ángulo: vale A + B si apuntan igual, A − B si se oponen y algo intermedio en otro caso: 3 y 4 a 90° dan 5. El término 2AB cos θ hace ese ajuste.',
      ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + ', { llave: ['2', A, B, ' cos ', th], nota: 'el término del ángulo', color: 'c-h' }],
      // Lector en frío (17 nov): el «+» choca con la ley de cosenos del colegio; se dice por qué.
      condicion: 'θ es el ángulo entre A⃗ y B⃗ puestos cola con cola; si usas el de adentro del triángulo, 180° − θ, como en la ley del colegio, el término cambia de signo.',
    },
    resuelve: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s + 500), tipo = s % 3;
        if (tipo === 0) {
          // Con 120° el coseno es negativo y el término resta (lector en frío, ronda 2: todos los ejemplos eran de 60° o 90°).
          const [a, b, g, cs] = s === 0 ? [5, 3, 120, -0.5] : r.de([[5, 3, 60, 0.5], [8, 3, 60, 0.5], [5, 8, 60, 0.5], [7, 8, 60, 0.5], [5, 3, 120, -0.5], [8, 5, 120, -0.5]]);
          const rr = Math.sqrt(a * a + b * b + 2 * a * b * cs);
          const c = colaPunta(a, b, g, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
          return {
            enunciado: ['Dos fuerzas de ', A, ` = ${f(a, 0)} N y `, B, ` = ${f(b, 0)} N forman `, th, ` = ${g}°. ¿Cuánto mide la resultante?`],
            datos: [DT.ley, cosD(g)],
            dibujo: { datos: c.datos, estado: { paso: 1 } },
            pasos: [
              { tipo: 'pide', texto: 'Piden R, el módulo de la fuerza que resulta de sumar las dos.' },
              { tipo: 'datos', texto: `A = ${f(a, 0)} N, B = ${f(b, 0)} N y el ángulo entre ellas es ${g}°.` },
              { tipo: 'regla', texto: ['Con un ángulo cualquiera se usa la ley de cosenos, con ', th, ' entre ', vA, ' y ', vB, ' cola con cola.'], ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
              { tipo: 'cuentas', texto: cs < 0 ? `Como cos ${g}° = ${COS[g]}, el último término resta.` : `Se reemplaza cos ${g}° = ${COS[g]}.`, ecuacion: [{ sup: [R, '2'] }, ` = ${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · cos ${g}° = ${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · ${cosP(g)} = ${f(rr * rr, 0)},   `, R, Number.isInteger(rr) ? ` = √${f(rr * rr, 0)} = ${f(rr, 0)} N` : ` = √${f(rr * rr, 0)} ≈ ${f(rr, 2)} N`], dibujo: { datos: colaPunta(a, b, g, { circulo: false }).datos, estado: { paso: 9, final: true } } },
              { tipo: 'sentido', texto: `El resultado, ${f(rr, 2)} N, queda entre la diferencia, ${f(Math.abs(a - b), 0)} N, y la suma, ${f(a + b, 0)} N, como debe ser.` },
            ],
            respuesta: [R, Number.isInteger(rr) ? ` = ${f(rr, 0)} N` : ` ≈ ${f(rr, 2)} N`],
          };
        }
        if (tipo === 1) {
          const a = r.ent(5, 12), b = r.ent(2, a - 1);
          return {
            enunciado: ['Dos fuerzas de ', A, ` = ${f(a, 0)} N y `, B, ` = ${f(b, 0)} N actúan sobre una caja. ¿Entre qué valores puede estar su resultante?`],
            datos: [DT.extremos],
            pasos: [
              { tipo: 'pide', texto: 'Piden la resultante más grande y la más chica que pueden dar las dos fuerzas.' },
              { tipo: 'datos', texto: `Se conocen los módulos, ${f(a, 0)} N y ${f(b, 0)} N; el ángulo no.` },
              { tipo: 'regla', texto: ['La mayor sale con ', th, ' = 0°, cuando apuntan igual; la menor sale con ', th, ' = 180°, cuando se oponen, y es la grande menos la chica.'], ecuacion: [A, ' − ', B, ' ≤ ', R, ' ≤ ', A, ' + ', B, ',  con ', A, ' la mayor'] },
              { tipo: 'cuentas', texto: 'Se suman y se restan los módulos.', ecuacion: [`${f(a, 0)} − ${f(b, 0)} = ${f(a - b, 0)} N,   ${f(a, 0)} + ${f(b, 0)} = ${f(a + b, 0)} N`] },
              { tipo: 'sentido', texto: 'Cualquier otro ángulo da un valor entre esos dos: cuanto más se abren las flechas, menos se ayudan, y la resultante baja de la máxima hacia la mínima.' },
            ],
            respuesta: [`${f(a - b, 0)} N ≤ `, R, ` ≤ ${f(a + b, 0)} N`],
          };
        }
        const [a, b] = r.de([[6, 8], [5, 12], [9, 12], [8, 15]]), rr = Math.hypot(a, b);
        const c = colaPunta(a, b, 90, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
        return {
          enunciado: ['Una persona camina ', A, ` = ${f(a, 0)} m al este y luego `, B, ` = ${f(b, 0)} m al norte. ¿Cuánto mide su desplazamiento?`],
          datos: [DT.pita],
          dibujo: { datos: c.datos, estado: { paso: 1 } },
          pasos: [
            { tipo: 'pide', texto: 'Piden R, el largo de la flecha que va del inicio al final.' },
            { tipo: 'datos', texto: `El este y el norte forman 90°, así que θ = 90°.` },
            { tipo: 'regla', texto: 'Con 90°, cos 90° = 0 y la ley de cosenos se vuelve Pitágoras.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza y se saca la raíz.', ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)}) = ${f(rr, 0)} m`], dibujo: { datos: colaPunta(a, b, 90, { circulo: false }).datos, estado: { paso: 9, final: true } } },
            { tipo: 'sentido', texto: `Caminó ${f(a + b, 0)} m, pero quedó a ${f(rr, 0)} m del inicio: la diagonal es más corta.` },
          ],
          respuesta: [R, ` = ${f(rr, 0)} m`],
        };
      },
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          // Nivel de examen (auditoría, M18): de la máxima y la mínima a los módulos, y de ahí la resultante a 90°.
          // [12, 5] es el ejemplo resuelto de nivel 3: aquí no sale.
          const [a, b] = r.de([[8, 6], [4, 3], [15, 8], [24, 7], [12, 9], [20, 15]]), mx = a + b, mn = a - b, rr = Math.hypot(a, b);
          return {
            pregunta: [`Dos vectores dan una resultante máxima de ${f(mx, 0)} u y una mínima de ${f(mn, 0)} u. ¿Cuánto mide su resultante si forman 90°?`],
            datos: [DT.extremos, DT.pita, DT.u],
            dibujo: (() => { const c = colaPunta(a, b, 90, { circulo: false, sinR: true, valores: false, paso: 1, pasoR: 9 }); return { datos: c.datos, estado: { paso: 1 } }; })(),
            opciones: opciones(rr, [
              { id: 'extremos', valor: Math.hypot(mx, mn), error: 'V-EXTREMOS', siFuera: 'Pitágoras va bien a 90°, pero con los módulos, no con la máxima y la mínima.' },
              { id: 'suma', valor: mx, error: 'V-SUMA', siFuera: 'Esa es la máxima: vale cuando apuntan igual, no a 90°.' },
              { id: 'mitad', valor: (mx + mn) / 2, error: 'V-MEDIO', siFuera: `Ese es el módulo mayor, A = ${f(a, 0)} u; falta hallar B y usar Pitágoras.` },
            ], x => `${f(x, 2)} u`),
            solucion: { texto: `De A + B = ${f(mx, 0)} y A − B = ${f(mn, 0)} salen A = ${f(a, 0)} y B = ${f(b, 0)}; como forman 90°, se usa Pitágoras.`, ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)}) = ${f(rr, 0)} u`] },
          };
        }
        // [5, 3, 120] es el primer «Así se resuelve»: aquí no sale (auditoría, M2).
        const [a, b, g] = r.de([[3, 4, 90], [6, 8, 90], [5, 5, 60], [8, 3, 120], [6, 6, 120], [4, 4, 0], [7, 3, 180], [8, 6, 60], [5, 12, 90]]);
        const c = colaPunta(a, b, g, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
        const ops = opciones(c.r, [
          { id: 'suma', valor: a + b, error: 'V-SUMA', siFuera: 'Sumaste los módulos como si apuntaran al mismo lado, lo que solo pasa con 0°. Con otro ángulo, parte de una flecha no ayuda a la otra y R sale menor.' },
          { id: 'resta', valor: Math.abs(a - b), error: 'V-RESTA', siFuera: 'Restaste los módulos como si se opusieran, lo que solo pasa con 180°. Con otro ángulo no se anulan de frente y R sale mayor que la resta.' },
          { id: 'pita', valor: Math.hypot(a, b), error: 'V-PITAGORAS', siFuera: 'Usaste Pitágoras, que solo vale con 90° porque ahí cos 90° = 0. Con este ángulo, el término 2AB cos θ no se anula y hay que sumarlo.' },
          { id: 'cos', valor: Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * cosG(g))), error: 'V-COS', siFuera: 'Con el signo menos, la fórmula da el lado opuesto a un ángulo del triángulo, no la suma de dos flechas cola con cola.' },
        ], x => `${f(x, 2)} u`);
        return {
          pregunta: ['Dos vectores de ', A, ` = ${f(a, 0)} u y `, B, ` = ${f(b, 0)} u forman `, th, ` = ${f(g, 0)}°. ¿Cuánto mide la resultante?`],
          datos: [DT.ley, cosD(g), DT.u],
          dibujo: { datos: c.datos, estado: { paso: 1 } },
          opciones: ops,
          solucion: {
            texto: `Se reemplaza cos ${f(g, 0)}° = ${COS[g]} en la ley de cosenos.`,
            ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · cos ${f(g, 0)}°) = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · ${cosP(g)}) ${Number.isInteger(Math.round(c.r * 1e9) / 1e9) ? '=' : '≈'} ${f(c.r, 2)} u`],
            dibujo: { datos: colaPunta(a, b, g, { circulo: false }).datos, estado: { paso: 9, final: true } },
          },
        };
      },
    },
  };

  // ---------- Idea 4: componentes y vector unitario ----------
  // Cambia: las componentes A_x y A_y · Permanece: los ejes de −4 a 4 ·
  // Progresa: el largo de A (Pitágoras) · Se reserva: A = 0, que no tiene unitario ·
  // Debe verse: û apunta igual que A⃗ y mide 1; se obtiene dividiendo cada componente entre el módulo A.
  // Ejes de −4 a 4 dibujados como guías: fijan la escala mientras se juega y no tapan al unitario.
  const EJES = [{ de: [-4, 0], a: [4, 0] }, { de: [0, -4], a: [0, 4] }];
  const compA = (ax, ay, o = {}) => {
    const m = Math.hypot(ax, ay);
    // En el juego, A lleva escrito cuánto mide (lector en frío, 16 nov: el número estaba solo en la lectura, abajo).
    const fl = [{ de: [0, 0], a: [ax, ay], color: 'o', rotulo: 'A⃗', valor: o.valor && m > 0 ? f(m, 2) : undefined, paso: 0 }];
    if (m > 0 && o.unitario) fl.push({ de: [0, 0], a: [ax / m, ay / m], color: 'f', rotulo: 'û', paso: o.pasoU || 0 });
    return { datos: { unidad: 'u', flechas: fl,
      guias: [...EJES, ...(m > 0 ? [{ de: [ax, 0], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }, { de: [0, ay], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }] : [])],
      // A_y se marca en la vertical de la punta, a la derecha, lejos del rótulo de A (lector en frío: se encimaban);
      // la pieza dibuja «A_x» con la x como subíndice.
      segmentos: m > 0 && o.textos ? [{ de: [0, 0], a: [ax, 0], color: 'o', texto: `A_x = ${f(ax, 0)}`, paso: o.pasoG || 0 }, { de: [ax, 0], a: [ax, ay], color: 'o', texto: `A_y = ${f(ay, 0)}`, paso: o.pasoG || 0 }].filter(sg => Math.hypot(sg.a[0], sg.a[1]) > 0) : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // Ejemplos resueltos de «Componentes». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad
  // (17 nov, fix-vec/cuentas-correcciones.js): 50 · 4/5 y 50 · 3/5; 10 · 3/5 y 10 · 4/5; 40 · √3/2 ≈ 34,64 y 40 · 1/2;
  // 100√2 · √2/2; √(5² + 12²); √(8² + 6²) y 8/10, −6/10; −10 · 4/5 y 10 · 3/5; −25 · 3/5 y −25 · 4/5; (7 − 1, 10 − 2) y
  // √100; √(40² + 30²) y tan = 3/4; √(6² + 8²), tan α = 4/3 y 180° − 53°; 12 · 5/3 = 20 y 20 · 4/5; √(13² − 12²);
  // √(5² + 12²) = 13 y 26 · (5/13, −12/13); 100 · 3/5 y 100 · 4/5. «Componentes» no suma vectores: eso es de la idea
  // siguiente (auditoría, M7: los cuatro ejemplos que sumaban pasaron a «Suma de vectores»).
  const R2 = Math.SQRT2;
  // «Lee» de componentes: una cuerda jala una caja en diagonal; sus dos partes punteadas, sin valores.
  const LEE_COMP = { datos: { objeto: 'caja', flechas: [{ ang: 37, mod: 50, desde: [0, -12], color: 'o', rotulo: 'A⃗' },
    { ang: 0, mod: 40, desde: [0, -12], color: 'o', rotulo: 'A_x', discontinua: true }, { ang: 90, mod: 30, desde: [0, -12], color: 'o', rotulo: 'A_y', discontinua: true, lado: -1 }],
    angulos: [{ desde: [0, -12], de: 0, a: 37, texto: 'θ', radio: 30 }] }, estado: {} };
  const EJEMPLOS_COMPONENTES = [
    { nivel: 1, titulo: 'Una cuerda a 37°',
      figura: ff({ objeto: 'caja', flechas: [{ ang: 37, mod: 50, desde: [0, -12], color: 'o', rotulo: 'A⃗', valor: '50 N' }, { ang: 0, mod: 40, desde: [0, -12], color: 'o', rotulo: 'A_x', valor: '?', discontinua: true }, { ang: 90, mod: 30, desde: [0, -12], color: 'o', rotulo: 'A_y', valor: '?', discontinua: true, lado: -1 }], angulos: [{ desde: [0, -12], de: 0, a: 37, texto: '37°', radio: 30 }] }),
      enunciado: ['Una cuerda jala una caja con una fuerza de ', A, ' = 50 N, a ', th, ' = 37° del piso. ¿Cuánto jala en horizontal y cuánto hacia arriba?'],
      datos: [senCos(37), DT.comp],
      solucion: [
        { texto: ['Con el ángulo medido desde el piso, el coseno da lo que jala en horizontal y el seno, lo que jala hacia arriba.'],
          ecuacion: [sub(A, 'x'), ' = 50 · cos 37° = 50 · 4/5 = 40 N,   ', sub(A, 'y'), ' = 50 · sen 37° = 50 · 3/5 = 30 N'] },
      ],
      respuesta: [sub(A, 'x'), ' = 40 N y ', sub(A, 'y'), ' = 30 N'] },
    { nivel: 1, titulo: 'Un vector a 53°',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 8, -1, 9), flechas: [{ de: [0, 0], a: [6, 8], color: 'o', rotulo: 'A⃗', valor: '10', rotuloEn: 0.75 }, { de: [0, 0], a: [6, 0], color: 'o', rotulo: 'A_x', valor: '?', discontinua: true }, { de: [0, 0], a: [0, 8], color: 'o', rotulo: 'A_y', valor: '?', discontinua: true }], angulos: [{ en: [0, 0], de: 0, a: 53, texto: '53°', color: 'h' }] }),
      enunciado: ['Un vector ', vA, ' mide ', A, ' = 10 u y forma ', th, ' = 53° con el eje x. ¿Cuáles son sus componentes?'],
      datos: [senCos(53), DT.comp, DT.u],
      solucion: [
        { texto: ['El coseno da lo que avanza en x, y el seno, lo que sube en y.'],
          ecuacion: [sub(A, 'x'), ' = 10 · cos 53° = 10 · 3/5 = 6,   ', sub(A, 'y'), ' = 10 · sen 53° = 10 · 4/5 = 8'] },
      ],
      respuesta: [vA, ' = 6î + 8ĵ'] },
    { nivel: 1, titulo: 'Empujar una carretilla',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -30, mod: 40, color: 'o', rotulo: 'A⃗', valor: '40 N' }, { desde: 'manijas', de: [-40 * Math.sqrt(3) / 2, 20], a: [0, 20], color: 'o', rotulo: 'A_x', discontinua: true }, { desde: 'manijas', de: [-40 * Math.sqrt(3) / 2, 20], a: [-40 * Math.sqrt(3) / 2, 0], color: 'o', rotulo: 'A_y', discontinua: true }],
        angulos: [{ desde: 'manijas', en: [-40 * Math.sqrt(3) / 2, 20], de: -30, a: 0, texto: '30°', radio: 30 }] }),
      enunciado: ['Un niño empuja una carretilla con ', A, ' = 40 N, inclinada ', th, ' = 30° hacia abajo. ¿Cuánto empuja hacia adelante y cuánto contra el piso?'],
      datos: [senCos(30), '√3 ≈ 1,73', ['Hacia adelante, ', A, ' cos ', th, '; contra el piso, ', A, ' sen ', th, ', con ', th, ' medido desde la horizontal']],
      solucion: [
        { texto: ['Lo que empuja hacia adelante sale con el coseno, y lo que empuja contra el piso, con el seno.'],
          ecuacion: [sub(A, 'x'), ' = 40 · cos 30° = 40 · √3/2 = 20√3 ≈ 34,6 N,   ', sub(A, 'y'), ' = 40 · sen 30° = 40 · 1/2 = 20 N'] },
      ],
      respuesta: [dA('20√3 ≈ 34,6 N'), ' hacia adelante y ', dA('20 N'), ' contra el piso'] },
    { nivel: 1, titulo: 'Una avioneta al noreste',
      figura: ff({ objeto: 'avion', norte: true, flechas: [{ ang: 45, mod: 100 * R2, color: 'o', rotulo: 'A⃗', valor: '100√2 km/h' }, { ang: 0, mod: 100, color: 'o', rotulo: 'A_x', valor: '?', discontinua: true }, { ang: 90, mod: 100, color: 'o', rotulo: 'A_y', valor: '?', discontinua: true }], angulos: [{ de: 0, a: 45, texto: '45°', radio: 34 }] }),
      enunciado: ['Una avioneta vuela a ', A, ' = 100√2 km/h hacia el noreste, a ', th, ' = 45° del este. ¿Cuánto avanza hacia el este y cuánto hacia el norte en una hora?'],
      datos: ['sen 45° = cos 45° = √2/2', DT.comp, 'Distancia = rapidez × tiempo'],
      solucion: [
        { texto: ['Como cos 45° = sen 45°, las dos componentes valen lo mismo.'],
          ecuacion: [sub(A, 'x'), ' = ', sub(A, 'y'), ' = 100√2 · cos 45° = 100√2 · √2/2 = 100 km/h'] },
        { texto: ['En una hora, lo que avanza hacia cada lado es esa rapidez por 1 h.'], ecuacion: ['100 km/h × 1 h = 100 km'] },
      ],
      respuesta: [dA('100 km'), ' hacia el este y ', dA('100 km'), ' hacia el norte'] },
    { nivel: 1, titulo: 'El largo desde las componentes',
      figura: flx({ unidad: 'm', guias: [{ de: [-1, 0], a: [7, 0] }], flechas: [{ de: [0, 0], a: [5, 12], color: 'o', rotulo: 'A⃗', valor: '?', rotuloEn: 0.75, lado: 1 }, { de: [0, 0], a: [5, 0], color: 'o', rotulo: 'A_x', valor: '5', discontinua: true }, { de: [0, 0], a: [0, 12], color: 'o', rotulo: 'A_y', valor: '12', discontinua: true, rotuloEn: 0.4, lado: 1 }] }),
      enunciado: ['Un dron se desplaza ', vA, ' = 5î + 12ĵ, en metros: 5 m al este y 12 m al norte. ¿Cuánto mide su desplazamiento?'],
      datos: [DT.ij, modD(A)],
      solucion: [
        { texto: ['Las dos componentes y la flecha forman un triángulo rectángulo, así que se usa Pitágoras.'], ecuacion: [A, ' = ', raiz2('5', '12'), ' = √169 = 13 m'] },
      ],
      respuesta: [A, ' = 13 m'] },
    { nivel: 2, titulo: 'El unitario de un vector',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 9, -7, 1.5), flechas: [{ de: [0, 0], a: [8, -6], color: 'o', rotulo: 'A⃗' }] }),
      enunciado: ['¿Cuál es el vector unitario ', u, ' de ', vA, ' = 8î − 6ĵ?'],
      datos: [DT.ij, modD(A), DT.unitario],
      solucion: [
        { texto: ['Primero se halla el módulo con Pitágoras.'], ecuacion: [A, ' = ', raiz2('8', '6'), ' = √100 = 10'] },
        { texto: ['Luego cada componente se divide entre 10, con su signo.'], ecuacion: [u, ' = ', { frac: [vA, A] }, ' = ', { frac: ['8', '10'] }, 'î − ', { frac: ['6', '10'] }, 'ĵ = 0,8î − 0,6ĵ'] },
      ],
      respuesta: [u, ' = 0,8î − 0,6ĵ: mide 1 y apunta como ', vA] },
    { nivel: 2, titulo: 'En el segundo cuadrante',
      figura: flx({ unidad: 'N', guias: ejesG(-9, 2, -1, 7), flechas: [{ de: [0, 0], a: [-8, 6], color: 'o', rotulo: 'A⃗', valor: '10 N' }], angulos: [{ en: [0, 0], de: 143.13, a: 180, texto: '37°', color: 'h', radio: 30 }] }),
      enunciado: ['Una fuerza de ', A, ' = 10 N apunta hacia arriba y a la izquierda, a 37° por encima del eje x negativo. Escríbela con î y ĵ.'],
      datos: [DT.ij, senCos(37), DT.compEje(A), DT.signos],
      solucion: [
        { texto: ['Los tamaños salen del ángulo de 37°, medido desde el eje x negativo.'], ecuacion: ['10 · cos 37° = 10 · 4/5 = 8,   10 · sen 37° = 10 · 3/5 = 6'] },
        { texto: ['Los signos salen del dibujo: como va a la izquierda, la componente x es negativa, y como va hacia arriba, la y es positiva.'], ecuacion: [vA, ' = −8î + 6ĵ N'] },
      ],
      respuesta: [vA, ' = −8î + 6ĵ N'] },
    { nivel: 2, titulo: 'En el tercer cuadrante',
      figura: flx({ unidad: 'N', guias: ejesG(-17, 3, -22, 3), flechas: [{ de: [0, 0], a: [-15, -20], color: 'o', rotulo: 'A⃗', valor: '25 N', rotuloEn: 0.8 }], angulos: [{ en: [0, 0], de: 180, a: 233.13, texto: '53°', color: 'h', radio: 30 }] }),
      enunciado: ['Una fuerza de ', A, ' = 25 N apunta hacia abajo y a la izquierda, a 53° por debajo del eje x negativo. ¿Cuáles son sus componentes?'],
      datos: [senCos(53), DT.compEje(A), DT.signos],
      solucion: [
        { texto: ['Primero se hallan los tamaños, con el ángulo medido desde el eje x negativo.'], ecuacion: ['25 · cos 53° = 25 · 3/5 = 15,   25 · sen 53° = 25 · 4/5 = 20'] },
        { texto: ['Como va a la izquierda y hacia abajo, las dos componentes son negativas.'], ecuacion: [sub(A, 'x'), ' = −15 N,   ', sub(A, 'y'), ' = −20 N'] },
      ],
      respuesta: [vA, ' = −15î − 20ĵ N'] },
    { nivel: 2, titulo: 'De un punto a otro',
      figura: flx({ unidad: 'cm', guias: ejesG(-1, 9, -1, 11), flechas: [{ de: [1, 2], a: [7, 10], color: 'o', rotulo: 'A⃗' }], puntos: [{ x: 1, y: 2, rotulo: 'P(1; 2)' }, { x: 7, y: 10, rotulo: 'Q(7; 10)' }] }),
      enunciado: ['Una hormiga camina en línea recta del punto P(1; 2) al punto Q(7; 10), en centímetros. Escribe su desplazamiento ', vA, ' con î y ĵ. ¿Cuánto mide?'],
      datos: ['Vector de un punto P a otro Q: Q − P, eje por eje (punta menos cola).', DT.ij, modD(A)],
      solucion: [
        { texto: ['Lo que avanza en x es la x de Q menos la de P; lo mismo en y.'], ecuacion: [sub(A, 'x'), ' = 7 − 1 = 6,   ', sub(A, 'y'), ' = 10 − 2 = 8,   ', vA, ' = 6î + 8ĵ'] },
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [A, ' = ', raiz2('6', '8'), ' = √100 = 10 cm'] },
      ],
      respuesta: [vA, ' = 6î + 8ĵ cm, que mide ', A, ' = 10 cm'] },
    { nivel: 2, titulo: 'De las componentes al ángulo',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -36.87, mod: 50, color: 'o', rotulo: 'A⃗', valor: '?' }, { desde: 'manijas', de: [-40, 30], a: [0, 30], color: 'o', rotulo: 'A_x', valor: '40 N', discontinua: true }, { desde: 'manijas', de: [-40, 30], a: [-40, 0], color: 'o', rotulo: 'A_y', valor: '30 N', discontinua: true }],
        angulos: [{ desde: 'manijas', en: [-40, 30], de: -36.87, a: 0, texto: 'θ', radio: 30 }] }),
      enunciado: ['Una carretilla se empuja con una fuerza que tiene ', sub(A, 'x'), ' = 40 N hacia adelante y ', sub(A, 'y'), ' = 30 N contra el piso. ¿Cuánto mide la fuerza y qué ángulo forma con el piso?'],
      datos: [modD(A), DT.tan, 'tan 37° = 3/4 y tan 53° = 4/3'],
      solucion: [
        { texto: ['El módulo sale con Pitágoras.'], ecuacion: [A, ' = ', raiz2('40', '30'), ' = √2500 = 50 N'] },
        { texto: ['Para el ángulo con el piso, se divide lo que baja entre lo que avanza: eso es su tangente.'], ecuacion: ['tan ', th, ' = ', { frac: ['30', '40'] }, ' = 3/4,   ', th, ' = 37°'] },
      ],
      respuesta: [A, ' = 50 N, a ', th, ' = 37° por debajo de la horizontal'] },
    { nivel: 3, titulo: 'Hacia dónde apunta',
      figura: flx({ unidad: 'N', guias: ejesG(-8, 3, -1, 9), flechas: [{ de: [0, 0], a: [-6, 8], color: 'o', rotulo: 'A⃗' }], angulos: [{ en: [0, 0], de: 0, a: 126.87, texto: 'θ = ?', color: 'h', radio: 22 }] }),
      enunciado: ['Una fuerza vale ', vA, ' = −6î + 8ĵ, en newtons. ¿Cuánto mide y qué ángulo ', th, ' forma con el eje +x?'],
      datos: [modD(A), ['Con α el ángulo agudo con el eje x: tan α = ', { frac: [['|', sub(A, 'y'), '|'], ['|', sub(A, 'x'), '|']] }], 'tan 37° = 3/4 y tan 53° = 4/3', DT.cuadrante],
      solucion: [
        { texto: ['Su módulo sale con Pitágoras.'], ecuacion: [A, ' = ', raiz2('6', '8'), ' = √100 = 10 N'] },
        { texto: ['El ángulo agudo con el eje x tiene tangente 8/6 = 4/3, así que α = 53°.'], ecuacion: ['tan α = ', { frac: ['8', '6'] }, ' = 4/3,   α = 53°'] },
        { texto: ['Como va a la izquierda y hacia arriba, está en el segundo cuadrante.'], ecuacion: [th, ' = 180° − 53° = 127°'] },
      ],
      respuesta: [A, ' = 10 N, a ', th, ' = 127° del eje +x'] },
    { nivel: 3, titulo: 'De una componente al módulo',
      figura: ff({ objeto: 'caja', flechas: [{ ang: 53.13, mod: 20, desde: [0, -12], color: 'o', rotulo: 'A⃗', valor: '?' }, { ang: 0, mod: 12, desde: [0, -12], color: 'o', rotulo: 'A_x', valor: '12 N', discontinua: true }, { de: [12, 0], ang: 90, mod: 16, desde: [0, -12], color: 'o', rotulo: 'A_y', valor: '?', discontinua: true }], angulos: [{ desde: [0, -12], de: 0, a: 53.13, texto: '53°', radio: 26 }] }),
      enunciado: ['Una cuerda jala una caja a ', th, ' = 53° del piso. Lo que jala en horizontal es ', sub(A, 'x'), ' = 12 N. ¿Cuánto mide la fuerza de la cuerda y cuánto jala hacia arriba?'],
      datos: [senCos(53), DT.comp],
      solucion: [
        { texto: ['Lo que jala en horizontal es el módulo por el coseno; de ahí se despeja el módulo.'], ecuacion: [A, ' · cos 53° = 12   →   ', A, ' · 3/5 = 12   →   ', A, ' = 12 · 5/3 = 20 N'] },
        { texto: ['Lo que jala hacia arriba sale con el seno.'], ecuacion: [sub(A, 'y'), ' = 20 · sen 53° = 20 · 4/5 = 16 N'] },
      ],
      respuesta: [A, ' = 20 N y ', sub(A, 'y'), ' = 16 N'] },
    { nivel: 3, titulo: 'La componente que falta',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 13, -6, 1.5), flechas: [{ de: [0, 0], a: [12, -5], color: 'o', rotulo: 'A⃗', valor: '13' }] }),
      enunciado: ['El vector ', vA, ' = 12î + bĵ mide ', A, ' = 13 y apunta hacia abajo y a la derecha. ¿Cuánto vale b?'],
      datos: [modD(A), DT.signos],
      solucion: [
        { texto: ['El módulo sale de Pitágoras con las dos componentes.'], ecuacion: [{ sup: ['13', '2'] }, ' = ', { sup: ['12', '2'] }, ' + ', { sup: ['b', '2'] }, '   →   ', { sup: ['b', '2'] }, ' = 169 − 144 = 25'] },
        { texto: ['b puede valer 5 o −5. Como ', vA, ' apunta hacia abajo, su componente y es negativa.'], ecuacion: ['b = −5'] },
      ],
      respuesta: [dA('b = −5'), ', y ', vA, ' = 12î − 5ĵ'] },
    { nivel: 3, titulo: 'Un largo y una dirección',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 6, -13, 1.5), flechas: [{ de: [0, 0], a: [5, -12], color: 'i', rotulo: 'B⃗ = 5î − 12ĵ' }] }),
      enunciado: ['Una fuerza ', vA, ' mide ', A, ' = 26 N y apunta igual que el vector ', vB, ' = 5î − 12ĵ. Escribe ', vA, ' con î y ĵ.'],
      datos: [modD(B), [u, ' = ', { frac: [vB, B] }, ': mide 1 y apunta como ', vB], ['Un vector de módulo ', A, ' que apunta como ', u, ': ', vA, ' = ', A, ' ', u]],
      solucion: [
        { texto: ['Primero se halla el largo de ', vB, '.'], ecuacion: [B, ' = ', raiz2('5', '12'), ' = 13'] },
        { texto: ['Su unitario sale de dividir cada componente entre 13.'], ecuacion: [u, ' = ', { frac: ['5', '13'] }, 'î − ', { frac: ['12', '13'] }, 'ĵ'] },
        { texto: ['El unitario solo da hacia dónde; se multiplica por el módulo de ', vA, '.'], ecuacion: [vA, ' = 26 · ', u, ' = 26 · ', { frac: ['5', '13'] }, 'î − 26 · ', { frac: ['12', '13'] }, 'ĵ = 10î − 24ĵ'] },
      ],
      respuesta: [vA, ' = 10î − 24ĵ N'] },
    { nivel: 3, titulo: 'Una caja en la rampa',
      figura: ff({ objeto: 'caja', rampa: 37, flechas: [{ ang: -90, mod: 100, color: 'o', rotulo: 'P⃗', valor: '100 N' }, { ang: 217, mod: 60, color: 'o', rotulo: 'P_x', valor: '?', discontinua: true }, { ang: -53, mod: 80, color: 'o', rotulo: 'P_y', valor: '?', discontinua: true }] }),
      enunciado: ['Una caja de peso ', Pe, ' = 100 N descansa sobre una rampa de 37°. ¿Qué parte del peso la empuja rampa abajo y qué parte la aprieta contra la rampa?'],
      datos: [senCos(37), 'Ejes girados: x a lo largo de la rampa, y perpendicular a ella.', DT.perpend, DT.compEje(Pe)],
      solucion: [
        { texto: ['El peso es perpendicular al piso y el eje y, a la rampa. El piso y la rampa forman 37°: el peso y el eje y también.'] },
        { texto: ['Como los 37° se miden desde el eje y, lo que aprieta contra la rampa sale con el coseno, y lo que empuja rampa abajo, con el seno.'], ecuacion: [sub(Pe, 'x'), ' = 100 · sen 37° = 100 · 3/5 = 60 N,   ', sub(Pe, 'y'), ' = 100 · cos 37° = 100 · 4/5 = 80 N'] },
      ],
      respuesta: [sub(Pe, 'x'), ' = 60 N rampa abajo y ', sub(Pe, 'y'), ' = 80 N contra la rampa'] },
  ];

  const componentes = {
    id: 'componentes',
    titulo: 'Componentes',
    pregunta: '¿Cómo se parte una flecha en dos, y qué flecha mide 1?',
    temas: ['Componentes y vector unitario'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        // Punto 1 del contrato: la primera pantalla trae un objeto reconocible (una cuerda que jala una caja en diagonal).
        { titulo: 'Una cuerda en diagonal', pieza: 'fis-fuerzas', dibujo: LEE_COMP,
          texto: ['Una cuerda que jala una caja en diagonal, ', vA, ', hace dos cosas a la vez: la arrastra hacia adelante, ', sub(A, 'x'), ', y la levanta un poco, ', sub(A, 'y'), '. Esas dos partes son sus componentes.'] },
        { titulo: 'Los ejes', texto: ['En un plano, el eje x va a la derecha y el eje y hacia arriba. î y ĵ son flechas de largo 1 por los ejes: ', vA, ' = 3î + 2ĵ avanza 3 en x y sube 2 en y.'] },
        { titulo: 'Con un ángulo', texto: ['A veces te dan cuánto mide ', vA, ', su módulo ', A, ', y el ángulo ', th, ' que forma con el eje x. Entonces lo que avanza es ', A, ' cos ', th, ', y lo que sube, ', A, ' sen ', th, '.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar cuánto avanza y cuánto sube ', vA, '. Mira cuánto mide, su módulo ', A, ', y la flechita violeta que sale con ella: ¿cuánto mide siempre?'] },
      ],
    },
    actividad: 'Cambiar cuánto avanza y cuánto sube una flecha, y mirar su largo y su flechita violeta.',
    ejemplos: EJEMPLOS_COMPONENTES,
    aprendizaje: 'A⃗ se parte en lo que avanza en x y lo que sube en y; su módulo sale de Pitágoras; û = A⃗ ÷ A.',
    juega: {
      consigna: [sub(A, 'x'), ' va y viene sola. Arrastra la punta de ', vA, ' y la flecha se queda donde la sueltes. La violeta es su unitario.'],
      mision: {
        texto: ['Haz que ', vA, ' mida justo 5.'],
        logrado: val => Math.abs(Math.hypot(val.ax, val.ay) - 5) < 1e-9,
        bien: 'Avanza 3 y sube 4: 3² + 4² = 25, y √25 = 5.',
      },
      voz: 'Alarga A⃗ sin girarla. ¿Cambia la flecha violeta?',
      leyenda: [
        { s: [{ sub: [A, 'x'] }], t: 'cuánto avanza A⃗ en x' },
        { s: [{ sub: [A, 'y'] }], t: 'cuánto sube A⃗ en y' },
        { s: [u], t: 'el unitario: apunta como A⃗ y mide 1' },
        { s: [vA], t: 'el vector: la flecha entera' },
        { s: [A], t: 'el módulo: cuánto mide A⃗' },
      ],
      // La etiqueta de un control es texto plano (sin subíndices): «A en x» y «A en y» se ven iguales.
      controles: [
        { id: 'ax', etiqueta: 'A en x', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'ay', etiqueta: 'A en y', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => compA(val.ax, val.ay, { unitario: true, valor: true }),
      lectura: val => {
        const m = Math.hypot(val.ax, val.ay);
        const c = x => `${x < 0 ? '−' : ''}${f(Math.abs(x), 2)}`;
        // Dos relaciones, separadas con «;» (un «·» entre dos igualdades se leía como un producto).
        return m > 1e-9 ? [A, ` = ${f(m, 2)};   `, u, ` = ${c(val.ax / m)}î ${val.ay < 0 ? '−' : '+'} ${f(Math.abs(val.ay / m), 2)}ĵ, que mide 1`] : [A, ' = 0: ', vA, ' no apunta a ningún lado; no tiene ', u];
      },
      minimo: 3,
      // Arrastra la punta de A: su sombra en x es A_x y su sombra en y es A_y (los ejes de −4 a 4 fijan la escala).
      arrastres: [
        { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
          donde: val => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { x: g.X(val.ax), y: g.Y(val.ay) }; },
          mover: (pt, val) => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { ax: g.Xi(pt.x), ay: g.Yi(pt.y) }; } },
      ],
    },
    predice: {
      pregunta: ['El vector ', vA, ' = 6î + 8ĵ. ¿Cuál es su vector unitario ', u, '?'],
      opciones: [
        { id: 'c', texto: '0,6î + 0,8ĵ', correcta: true },
        { id: 'suma', texto: '(6î + 8ĵ)/14', error: 'U-SUMA', siFuera: 'Dividiste entre 6 + 8 = 14, como si el largo fuera la suma de las componentes. La flecha va en diagonal y mide √(36 + 64) = 10; con 14, el unitario no mediría 1.' },
        { id: 'unos', texto: 'î + ĵ', error: 'U-UNOS', siFuera: 'î + ĵ mide √2, no 1, y apunta a 45°: otra dirección.' },
        { id: 'cruce', texto: '0,8î + 0,6ĵ', error: 'U-CAMBIO', siFuera: 'Mide 1, pero cambiaste de eje el 0,6 y el 0,8. A⃗ sube más de lo que avanza, así que su unitario también tiene que subir más.' },
      ],
      datos: ['î y ĵ: flechas de largo 1 por los ejes x e y.', 'Un vector unitario mide 1 y apunta igual que su vector.'],
      // A⃗ y û a escala: û mide la décima parte de A⃗ (auditoría, B4: antes A⃗ se dibujaba a la mitad).
      dibujo: compA(6, 8, { paso: 0 }),
      revelar: compA(6, 8, { unitario: true }),
      coincide: ['Coincide: ', A, ' = 10, y cada componente se divide entre 10.'],
    },
    mira: {
      datos: compA(3, 4, { unitario: true, pasoG: 1, pasoU: 3, textos: true }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: [vA, ' va del origen al punto (3; 4).'], ecuacion: [vA, ' = 3î + 4ĵ'] },
        { estado: { paso: 1 }, texto: 'Sus componentes son lo que avanza en cada eje.', ecuacion: [{ sub: [A, 'x'] }, ' = 3,   ', { sub: [A, 'y'] }, ' = 4'] },
        { estado: { paso: 2 }, texto: 'Su módulo sale de Pitágoras con las componentes.', ecuacion: [A, ' = ', { raiz: [[{ sup: ['3', '2'] }, ' + ', { sup: ['4', '2'] }]] }, ' = 5'] },
        { estado: { paso: 3 }, texto: 'El unitario sale de dividir cada componente entre 5, y mide 1.', ecuacion: [u, ' = ', { frac: [vA, A] }, ' = 0,6î + 0,8ĵ'] },
        { estado: { paso: 3 }, texto: [vA, ' forma 53° con el eje x; el coseno da lo que avanza y el seno, lo que sube.'], ecuacion: ['5 cos 53° = 5 · 3/5 = 3,   5 sen 53° = 5 · 4/5 = 4'] },
      ],
    },
    regla: {
      texto: 'Las componentes de un vector son lo que avanza en x y lo que sube en y: A⃗ = 3î + 4ĵ avanza 3 y sube 4. Con la flecha forman un triángulo rectángulo, así que el módulo sale de Pitágoras: 5. El unitario û apunta igual y mide 1; sale de dividir cada componente entre el módulo.',
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ', ';   ', A, ' = ', { llave: [{ raiz: [[{ sub: [A, 'x'] }, '²', ' + ', { sub: [A, 'y'] }, '²']] }], nota: 'el módulo', color: 'c-o' }, ';   ', u, ' = ', { llave: [{ frac: [vA, A] }], nota: 'û mide 1', color: 'c-f' }],
      condicion: 'los ejes son perpendiculares y θ se mide desde el eje x; así, A⃗ avanza A cos θ y sube A sen θ. Si θ se mide desde el eje y, el seno y el coseno se cambian de lugar.',
    },
    resuelve: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s + 300), tipo = s % 3;
        // 9, 12, 15 no sale en «Ahora tú»: el primer ejemplo resuelto no regala la respuesta del primer ejercicio.
        const [p, q, m] = s === 0 ? [9, 12, 15] : r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 5, 13], [8, 6, 10], [9, 12, 15]]);
        const esc = Math.max(p, q) / 4;
        if (tipo === 0) return {
          enunciado: ['¿Cuánto mide el vector ', vA, ` = ${f(p, 0)}î + ${f(q, 0)}ĵ?`],
          datos: [DT.ij, modD(A)],
          dibujo: compA(p / esc, q / esc, { paso: 0 }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el módulo ', A, ': cuánto mide la flecha ', vA, '.'] },
            { tipo: 'datos', texto: [vA, ` avanza ${f(p, 0)} en x y sube ${f(q, 0)} en y.`], ecuacion: [{ sub: [A, 'x'] }, ` = ${f(p, 0)},   `, { sub: [A, 'y'] }, ` = ${f(q, 0)}`] },
            { tipo: 'regla', texto: 'Las componentes y la flecha forman un triángulo rectángulo, así que se usa Pitágoras.', ecuacion: [A, ' = ', { raiz: [[{ sub: [A, 'x'] }, '²', ' + ', { sub: [A, 'y'] }, '²']] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza y se saca la raíz.', ecuacion: [A, ` = √(${f(p * p, 0)} + ${f(q * q, 0)}) = √${f(m * m, 0)} = ${f(m, 0)}`] },
            { tipo: 'sentido', texto: `${f(m, 0)} es más que cada componente y menos que su suma, ${f(p + q, 0)}: la diagonal es un atajo.` },
          ],
          respuesta: [A, ` = ${f(m, 0)}`],
        };
        if (tipo === 1) {
          // Ángulos notables de 37° y 53° (triángulo 3, 4, 5), como en el examen.
          const k = r.de([2, 5, 10, 20]), mod = 5 * k, g = r.de([37, 53]), ax = (g === 37 ? 4 : 3) * k, ay = (g === 37 ? 3 : 4) * k;
          return {
            enunciado: ['Un vector ', vA, ' mide ', A, ` = ${f(mod, 0)} y forma `, th, ` = ${g}° con el eje x. ¿Cuáles son sus componentes?`],
            datos: [senCos(g), DT.comp],
            dibujo: compA(ax / (mod / 4), ay / (mod / 4), { paso: 0 }),
            pasos: [
              { tipo: 'pide', texto: ['Piden cuánto avanza ', vA, ' en x y cuánto sube en y.'] },
              { tipo: 'datos', texto: [A, ` = ${f(mod, 0)} y el ángulo con el eje x es ${g}°.`] },
              { tipo: 'regla', texto: 'Con el ángulo medido desde el eje x, el coseno da lo que avanza y el seno, lo que sube.', ecuacion: [{ sub: [A, 'x'] }, ' = ', A, ' cos ', th, ',   ', { sub: [A, 'y'] }, ' = ', A, ' sen ', th] },
              { tipo: 'cuentas', texto: `En el triángulo de 37° y 53°, cos ${g}° = ${g === 37 ? '4/5' : '3/5'} y sen ${g}° = ${g === 37 ? '3/5' : '4/5'}.`, ecuacion: [{ sub: [A, 'x'] }, ` = ${f(mod, 0)} · cos ${g}° = ${f(mod, 0)} · ${g === 37 ? '4/5' : '3/5'} = ${f(ax, 0)},   `, { sub: [A, 'y'] }, ` = ${f(mod, 0)} · sen ${g}° = ${f(mod, 0)} · ${g === 37 ? '3/5' : '4/5'} = ${f(ay, 0)}`] },
              { tipo: 'sentido', texto: `Como ${g}° es ${g === 37 ? 'menos de 45°, el vector avanza más de lo que sube' : 'más de 45°, el vector sube más de lo que avanza'}, y ${f(ax, 0)} y ${f(ay, 0)} cumplen eso.` },
            ],
            respuesta: [vA, ` = ${f(ax, 0)}î + ${f(ay, 0)}ĵ`],
          };
        }
        return {
          enunciado: ['¿Cuál es el vector unitario de ', vA, ` = ${f(p, 0)}î + ${f(q, 0)}ĵ?`],
          datos: [modD(A), DT.unitario],
          dibujo: compA(p / esc, q / esc, { paso: 0 }),
          pasos: [
            { tipo: 'pide', texto: ['Piden una flecha que apunte igual que ', vA, ' y mida 1.'] },
            { tipo: 'datos', texto: [vA, ` avanza ${f(p, 0)} y sube ${f(q, 0)}.`] },
            { tipo: 'regla', texto: ['El unitario es ', vA, ' dividido entre su módulo: cada componente entre ', A, '.'], ecuacion: [u, ' = ', { frac: [vA, A] }] },
            { tipo: 'cuentas', texto: `Primero se halla el módulo con Pitágoras, que da ${f(m, 0)}; luego se divide cada componente entre ${f(m, 0)}.`, ecuacion: [u, ` = ${f(p, 0)}/${f(m, 0)} î + ${f(q, 0)}/${f(m, 0)} ĵ = ${f(p / m, 2)}î + ${f(q / m, 2)}ĵ`] },
            { tipo: 'sentido', texto: `Para comprobar, con las fracciones: (${f(p, 0)}/${f(m, 0)})² + (${f(q, 0)}/${f(m, 0)})² = ${f(p * p + q * q, 0)}/${f(m * m, 0)} = 1, así que mide 1, como debe. Con los decimales redondeados sale casi 1.` },
          ],
          respuesta: [u, ` = ${f(p / m, 2)}î + ${f(q / m, 2)}ĵ`],
        };
      },
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        const [p, q, m] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13], [8, 6, 10]]);
        const sx = r.de([1, -1]), sy = r.de([1, -1]), ax = sx * p, ay = sy * q;
        const esc = Math.max(p, q) / 4;
        const dib = compA(ax / esc, ay / esc, { paso: 0 });
        const txt = (x, y) => `${f(x, 0)}î ${y < 0 ? '−' : '+'} ${f(Math.abs(y), 0)}ĵ`;
        if (s % 4 === 3) {
          // Nivel de examen (auditoría, M18): signos por cuadrante y el ángulo desde las componentes, alternados.
          const k = r.de([2, 3, 5, 10]), g = r.de([37, 53]), cx = (g === 37 ? 4 : 3) * k, cy = (g === 37 ? 3 : 4) * k, mod = 5 * k;
          const cu = r.de([2, 3, 4]), sgx = cu === 4 ? 1 : -1, sgy = cu === 2 ? 1 : -1, vx = sgx * cx, vy = sgy * cy;
          const dibQ = compA(vx / (mod / 4), vy / (mod / 4), { paso: 0 });
          const lado = `${vx < 0 ? 'a la izquierda' : 'a la derecha'} y ${vy < 0 ? 'hacia abajo' : 'hacia arriba'}`;
          if (s % 8 === 3) {
            return {
              pregunta: ['Un vector ', vA, ' mide ', A, ` = ${f(mod, 0)} y apunta ${lado}, a ${g}° del eje x ${vx < 0 ? 'negativo' : 'positivo'}. ¿Cuánto vale su componente y?`],
              datos: [senCos(g), DT.compEje(A), DT.signos],
              dibujo: dibQ,
              opciones: opciones(vy, [
                { id: 'signo', valor: -vy, error: 'C-SIGNO', siFuera: `El tamaño, ${f(cy, 0)}, está bien, pero el signo lo da hacia dónde apunta: ${vy < 0 ? 'hacia abajo es negativo' : 'hacia arriba es positivo'}.` },
                { id: 'cruce', valor: sgy * cx, error: 'C-SENO', siFuera: 'Ese tamaño es el de la componente x, que va con el coseno. La y va con el seno.' },
                { id: 'mod', valor: sgy * mod, error: 'C-MODULO', siFuera: 'Ese es todo el largo de A⃗; la componente y es más corta.' },
              ], x => f(x, 0)),
              solucion: { texto: `El tamaño es ${f(mod, 0)} · sen ${g}° = ${f(mod, 0)} · ${g === 37 ? '3/5' : '4/5'} = ${f(cy, 0)}, y como apunta ${vy < 0 ? 'hacia abajo, la componente es negativa' : 'hacia arriba, la componente es positiva'}.`, ecuacion: [{ sub: [A, 'y'] }, ` = ${f(vy, 0)}`] },
            };
          }
          const ang = cu === 2 ? 180 - g : cu === 3 ? 180 + g : 360 - g;
          const errAng = [
            { id: 'agudo', valor: g, error: 'C-AGUDO', siFuera: `${g}° es el ángulo agudo con el eje x; medido desde +x, en ese cuadrante, el giro es mayor.` },
            { id: 'cuad', valor: cu === 2 ? 180 + g : 180 - g, error: 'C-CUADRANTE', siFuera: 'Esa regla es de otro cuadrante; los signos de las componentes dicen en cuál está el vector.' },
            { id: 'comp', valor: cu === 2 ? 180 - (90 - g) : cu === 3 ? 180 + (90 - g) : 360 - (90 - g), error: 'C-TANGENTE', siFuera: 'Tomaste la tangente al revés: tan α es lo que sube entre lo que avanza.' },
          ];
          return {
            pregunta: ['El vector ', vA, ` = ${txt(vx, vy)}. ¿Qué ángulo forma con el eje +x, medido en sentido antihorario?`],
            datos: [['Con α el ángulo agudo con el eje x: tan α = ', { frac: [['|', sub(A, 'y'), '|'], ['|', sub(A, 'x'), '|']] }], 'tan 37° = 3/4 y tan 53° = 4/3', DT.cuadrante],
            dibujo: dibQ,
            opciones: opciones(ang, errAng, x => `${f(x, 0)}°`),
            solucion: { texto: `Como tan α = ${f(cy, 0)}/${f(cx, 0)}, α = ${g}°; el vector apunta ${lado}, en el ${cu === 2 ? 'segundo' : cu === 3 ? 'tercer' : 'cuarto'} cuadrante.`, ecuacion: [th, ` = ${cu === 2 ? '180° − ' + g : cu === 3 ? '180° + ' + g : '360° − ' + g}° = ${ang}°`] },
          };
        }
        if (s % 4 === 2) {
          // Componentes a partir del módulo y el ángulo, con los notables de 37° y 53° (lector en frío, 16 nov: el
          // ángulo es lo más típico del examen y «Ahora tú» no lo pedía).
          const k = r.de([2, 4, 5, 10]), mod = 5 * k, g = r.de([37, 53]), ax = (g === 37 ? 4 : 3) * k, ay = (g === 37 ? 3 : 4) * k;
          return {
            pregunta: ['Un vector ', vA, ' mide ', A, ` = ${f(mod, 0)} y forma ${g}° con el eje x. ¿Cuánto vale su componente x?`],
            datos: [senCos(g), DT.comp],
            dibujo: compA(ax / (mod / 4), ay / (mod / 4), { paso: 0 }),
            opciones: opciones(ax, [
              { id: 'cruce', valor: ay, error: 'C-SENO', siFuera: 'Esa es la que sube, A sen θ. Lo que avanza en x es A cos θ.' },
              { id: 'mod', valor: mod, error: 'C-MODULO', siFuera: 'Ese es todo el largo de A⃗. Lo que avanza en x es más corto, porque A⃗ también sube; solo serían iguales si A⃗ estuviera sobre el eje x.' },
              { id: 'mitad', valor: mod / 2, error: 'C-MITAD', siFuera: 'La mitad saldría con 60°; aquí lo que avanza depende del ángulo dado: A cos θ.' },
            ], x => f(x, 1)),
            solucion: { texto: `En el triángulo de 37° y 53°, cos ${g}° = ${g === 37 ? '4/5' : '3/5'}.`, ecuacion: [{ sub: [A, 'x'] }, ` = ${f(mod, 0)} · cos ${g}° = ${f(mod, 0)} · ${g === 37 ? '4/5' : '3/5'} = ${f(ax, 0)}`] },
          };
        }
        if (s % 4 === 0) return {
          pregunta: ['¿Cuánto mide el vector ', vA, ` = ${txt(ax, ay)}?`],
          datos: [DT.ij, modD(A), DT.u],
          dibujo: dib,
          opciones: opciones(m, [
            { id: 'suma', valor: Math.abs(ax) + Math.abs(ay), error: 'V-SUMA', siFuera: 'Sumaste las componentes como si caminaras por los ejes, primero en x y luego en y. La flecha va en diagonal, que es más corta, y se mide con Pitágoras.' },
            { id: 'signo', valor: Math.abs(ax + ay), error: 'V-RESTA', siFuera: 'Los signos solo dicen hacia dónde apunta; el módulo usa los cuadrados de las componentes.' },
            { id: 'cuadrado', valor: m * m, error: 'V-RAIZ', siFuera: 'Eso es el módulo al cuadrado: falta la raíz.' },
          ], x => `${f(x, 2)} u`),
          solucion: { texto: 'El módulo sale de Pitágoras con las dos componentes.', ecuacion: [A, ` = √(${f(p * p, 0)} + ${f(q * q, 0)}) = ${f(m, 0)} u`] },
        };
        const uy = ay / m;
        return {
          pregunta: ['El vector ', vA, ` = ${txt(ax, ay)}. ¿Cuánto vale la componente y de su unitario `, u, '?'],
          datos: [modD(A), DT.unitario],
          dibujo: dib,
          opciones: opciones(uy, [
            { id: 'suma', valor: ay / (Math.abs(ax) + Math.abs(ay)), error: 'U-SUMA', siFuera: 'Se divide, sí, pero entre el módulo, no entre la suma de componentes.' },
            { id: 'cruce', valor: ax / m, error: 'U-CAMBIO', siFuera: 'Esa es la componente x del unitario.' },
            { id: 'sin', valor: ay, error: 'U-UNOS', siFuera: 'Esa es la componente y de A⃗, pero el unitario mide 1: falta dividir entre el módulo.' },
            { id: 'signo', valor: -uy, error: 'U-SIGNO', siFuera: 'El unitario apunta igual que A⃗: conserva el signo.' },
          ], x => f(x, 4)),
          solucion: { texto: `El módulo es A = ${f(m, 0)}, y se divide la componente y entre ${f(m, 0)}.`, ecuacion: [{ sub: [u, 'y'] }, ` = ${f(ay, 0)} / ${f(m, 0)} = ${f(uy, 4)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: producto escalar y producto vectorial ----------
  // Cambia: el ángulo θ entre A (4) y B (3) · Permanece: los módulos y el círculo donde puede caer la punta de B ·
  // Progresa: la sombra de B sobre A (escalar) y el área del paralelogramo (vectorial) ·
  // Se reserva: 90°, donde el escalar es 0 y el vectorial es máximo · Debe verse: uno es un número con signo; el otro, un área con dirección.
  const prod = (a, b, g, o = {}) => {
    const tip = [b * cosG(g), b * senG(g)], circ = Array.from({ length: 19 }, (_, i) => [b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    const yS = -0.7; // la sombra se dibuja un poco debajo de A, para que su rótulo no tape el de A
    const sombra = b * cosG(g);
    return { datos: {
      unidad: 'u',
      contorno: o.circulo === false ? undefined : circ,
      flechas: [{ de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A⃗' }, { de: [0, 0], a: tip, color: 'i', rotulo: 'B⃗' }],
      angulos: g > 0 && g < 180 ? [{ en: [0, 0], de: 0, a: g, texto: o.angTexto || `${f(g, 0)}°`, color: 'h' }] : [],
      guias: [{ de: tip, a: [sombra, yS], color: 'i', paso: o.pasoS || 0 },
        { de: [a, 0], a: [a + tip[0], tip[1]], color: 'f', paso: o.pasoP || 0 }, { de: tip, a: [a + tip[0], tip[1]], color: 'f', paso: o.pasoP || 0 },
        ...(o.marco ? [marco(...o.marco)] : [])],
      segmentos: Math.abs(sombra) > 1e-9 ? [{ de: [0, yS], a: [sombra, yS], color: 'i', texto: `B cos θ = ${f(sombra, 2)}`, paso: o.pasoS || 0 }] : [],
      // A × B, perpendicular a la pantalla: ⊙ (sale) en el centro del paralelogramo (lector en frío: no se dibujaba).
      fuera: o.pasoK === undefined || !(g > 0 && g < 180) ? [] : [{ en: [(a + tip[0]) / 2, tip[1] / 2], sentido: 'sale', rotulo: 'A⃗ × B⃗', color: 'f', paso: o.pasoK }],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // El juego fija la escala con todo lo que puede ocupar la figura en la media vuelta (sombra y paralelogramo).
  const MARCO_P = [[-3, -0.7], [7, 3]];
  // Ejemplos resueltos de «Productos». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad
  // (17 nov, fix-vec/cuentas-correcciones.js): 6 · 5 · 1/2; 2 · 4 + 3 · (−1); 3 · 8 + 4 · (−6); 4 · 5 · 1/2;
  // 3 · 2 (î × ĵ); 8/(2√2 · 4) = √2/2; 30 · 20 − 10 · 10; 12 · √2/2 ≈ 8,49; 12 − 3m = 0; 2 · 1 − 5 · 3;
  // 40 · 15 + (−30) · 0; A⃗ ⊥ (A⃗ − B⃗) con 4 y 8: 16/32 = 1/2; −12/24 y 24 · √3/2 ≈ 20,78; 12/20 = 3/5, √(1 − 9/25) = 4/5
  // y 20 · 4/5 = 16; (40, 10) × (10, 30) = 1100. El nivel 3 ya no es la multiplicación del nivel 1 con otro nombre
  // (auditoría, M19: salieron «el trabajo de jalar un costal» y «la llave y la tuerca»).
  // Las figuras de A y B desde un mismo punto salen de prod, la misma de «Mira» (sombra de B y paralelogramo a escala).
  const pr = (a, b, g, o = {}) => {
    const c = prod(a, b, g, Object.assign({ circulo: false }, o));
    if (o.valores !== false) { c.datos.flechas[0].valor = f(a, 0); c.datos.flechas[1].valor = f(b, 0); }
    // En un ejemplo, la sombra de B⃗ solo se dibuja si el problema la usa (lector en frío: sobraba).
    if (o.ladoB) c.datos.flechas[1].lado = o.ladoB;
    return flx(c.datos, c.estado);
  };
  // «Lee» de productos: un costal que se jala con una soga inclinada; la parte a lo largo del piso, punteada.
  const LEE_PROD = { datos: { objeto: 'caja', texto: 'papa', flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'F⃗' }, { ang: 0, mod: 40, color: 'o', discontinua: true }],
    angulos: [{ de: 0, a: 37, texto: 'θ', radio: 34 }] }, estado: {} };
  const EJEMPLOS_PRODUCTOS = [
    { nivel: 1, titulo: 'El escalar con el ángulo', figura: pr(6, 5, 60, { pasoP: 99, pasoS: 99 }),
      enunciado: ['Dos vectores de ', A, ' = 6 y ', B, ' = 5 forman ', th, ' = 60°. ¿Cuánto vale ', vA, ' · ', vB, '?'],
      datos: [DT.escalar, cosD(60)],
      solucion: [
        { texto: ['El producto escalar es ', A, ' por la sombra de ', vB, ' sobre ', vA, '.'], ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 6 · 5 · cos 60° = 6 · 5 · 1/2 = 15'] },
      ],
      respuesta: [vA, ' · ', vB, ' = ', dR('15'), ': un número, sin dirección'] },
    { nivel: 1, titulo: 'El escalar con componentes',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 5, -2, 4), flechas: [{ de: [0, 0], a: [2, 3], color: 'o', rotulo: 'A⃗', rotuloEn: 0.95 }, { de: [0, 0], a: [4, -1], color: 'i', rotulo: 'B⃗' }] }),
      enunciado: ['Si ', vA, ' = 2î + 3ĵ y ', vB, ' = 4î − ĵ, ¿cuánto vale ', vA, ' · ', vB, '?'],
      datos: [DT.ij, DT.escalarC],
      solucion: [
        { texto: ['Cada componente se multiplica con la de su mismo eje, y los dos productos se suman.'], ecuacion: [vA, ' · ', vB, ' = (2)(4) + (3)(−1) = 8 − 3 = 5'] },
      ],
      respuesta: [vA, ' · ', vB, ' = ', dR('5')] },
    { nivel: 1, titulo: '¿Son perpendiculares?',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 9, -7, 5), flechas: [{ de: [0, 0], a: [3, 4], color: 'o', rotulo: 'A⃗', rotuloEn: 0.95 }, { de: [0, 0], a: [8, -6], color: 'i', rotulo: 'B⃗' }] }),
      enunciado: ['¿Son perpendiculares los vectores ', vA, ' = 3î + 4ĵ y ', vB, ' = 8î − 6ĵ?'],
      datos: [DT.escalar2, cosD(90)],
      solucion: [
        { texto: ['Si forman 90°, cos 90° = 0 y el producto escalar vale 0: ninguno hace sombra sobre el otro. Se calcula con componentes.'], ecuacion: [vA, ' · ', vB, ' = (3)(8) + (4)(−6) = 24 − 24 = 0'] },
      ],
      respuesta: ['Sí: ', vA, ' · ', vB, ' = 0, forman ', dTh('90°')] },
    { nivel: 1, titulo: 'El área que encierran', figura: pr(4, 5, 30, { pasoS: 99 }),
      enunciado: ['Dos vectores de ', A, ' = 4 y ', B, ' = 5 forman ', th, ' = 30°. ¿Cuánto mide ', vA, ' × ', vB, '?'],
      datos: [DT.vectorial, senD(30)],
      solucion: [
        { texto: ['El módulo del producto vectorial es el área del paralelogramo que arman ', vA, ' y ', vB, ': base por altura.'], ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ' sen ', th, ' = 4 · 5 · sen 30° = 4 · 5 · 1/2 = 10'] },
      ],
      respuesta: ['|', vA, ' × ', vB, '| = ', dR('10')] },
    { nivel: 1, titulo: '¿Sale o entra?',
      figura: flx({ unidad: 'u', flechas: [{ de: [0, 0], a: [3, 0], color: 'o', rotulo: 'A⃗ = 3î' }, { de: [0, 0], a: [0, 2], color: 'i', rotulo: 'B⃗ = 2ĵ', lado: -1, rotuloEn: 0.8 }],
        guias: [{ de: [3, 0], a: [3, 2], color: 'f' }, { de: [0, 2], a: [3, 2], color: 'f' }] }),
      enunciado: ['Si ', vA, ' = 3î y ', vB, ' = 2ĵ, ¿cuánto vale ', vA, ' × ', vB, ' y hacia dónde apunta? ¿Y ', vB, ' × ', vA, '?'],
      datos: [DT.mano, DT.sale],
      solucion: [
        { texto: ['î × ĵ = k̂: si los dedos de la mano derecha giran de x hacia y, el pulgar sale de la pantalla.'], ecuacion: [vA, ' × ', vB, ' = 3 · 2 (î × ĵ) = 6k̂,  sale: ⊙'] },
        { texto: ['Si se cambia el orden, cambia el sentido.'], ecuacion: [vB, ' × ', vA, ' = −6k̂,  entra: ⊗'] },
      ],
      respuesta: [dR('6k̂'), ', que sale (⊙); al revés, ', dR('−6k̂'), ', que entra (⊗)'] },
    { nivel: 2, titulo: 'El ángulo entre dos vectores',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 5, -1, 3), flechas: [{ de: [0, 0], a: [2, 2], color: 'o', rotulo: 'A⃗' }, { de: [0, 0], a: [4, 0], color: 'i', rotulo: 'B⃗', rotuloEn: 0.8 }], angulos: [{ en: [0, 0], de: 0, a: 45, texto: 'θ = ?', color: 'h', radio: 30 }] }),
      enunciado: ['¿Qué ángulo forman los vectores ', vA, ' = 2î + 2ĵ y ', vB, ' = 4î?'],
      datos: [DT.escalar2, modD(A), cosD(30, 45, 60)],
      solucion: [
        { texto: ['Primero se calcula el producto escalar con componentes.'], ecuacion: [vA, ' · ', vB, ' = (2)(4) + (2)(0) = 8'] },
        { texto: ['También vale ', A, B, ' cos ', th, '. Con los módulos, ', A, ' = 2√2 y ', B, ' = 4, se despeja el coseno.'], ecuacion: ['cos ', th, ' = ', { frac: ['8', '2√2 · 4'] }, ' = ', { frac: ['1', '√2'] }, ' = √2/2,   ', th, ' = 45°'] },
      ],
      respuesta: [th, ' = ', dTh('45°')] },
    { nivel: 2, titulo: 'Una chacra en paralelogramo',
      figura: flx({ unidad: 'm', contorno: [[0, 0], [30, 10], [40, 30], [10, 20]], flechas: [{ de: [0, 0], a: [30, 10], color: 'o', rotulo: 'A⃗' }, { de: [0, 0], a: [10, 20], color: 'i', rotulo: 'B⃗' }],
        guias: [{ de: [30, 10], a: [40, 30], color: 'f' }, { de: [10, 20], a: [40, 30], color: 'f' }] }),
      enunciado: ['Una chacra tiene forma de paralelogramo. Dos de sus lados, desde una esquina, son ', vA, ' = 30î + 10ĵ y ', vB, ' = 10î + 20ĵ, en metros. ¿Cuál es su área?'],
      datos: [DT.area, DT.vectorialC],
      solucion: [
        { texto: ['El área del paralelogramo es el módulo del producto vectorial de sus dos lados.'] },
        { texto: ['Se cruzan las componentes y se restan: la x de ', vA, ' por la y de ', vB, ', menos la y de ', vA, ' por la x de ', vB, '.'], ecuacion: [vA, ' × ', vB, ' = [(30)(20) − (10)(10)] k̂ = (600 − 100) k̂ = 500 k̂'] },
      ],
      respuesta: ['Área = ', dR('500 m²')] },
    { nivel: 2, titulo: 'Cuando los dos productos empatan', figura: pr(4, 3, 45, { pasoS: 99, pasoP: 99, angTexto: 'θ = ?' }),
      enunciado: ['Dos vectores miden ', A, ' = 4 y ', B, ' = 3. ¿Con qué ángulo ', th, ' el producto escalar vale lo mismo que el módulo del vectorial? ¿Cuánto vale cada uno?'],
      datos: [DT.escalar, DT.vectorial, ['tan ', th, ' = ', { frac: [['sen ', th], ['cos ', th]] }], 'tan 37° = 3/4, tan 45° = 1 y tan 53° = 4/3', senD(45) + ' y ' + cosD(45), '√2 ≈ 1,4142'],
      solucion: [
        { texto: ['Se igualan las dos fórmulas; ', A, ' y ', B, ' se cancelan.'], ecuacion: [A, B, ' cos ', th, ' = ', A, B, ' sen ', th, '   →   tan ', th, ' = 1'] },
        { texto: ['El ángulo con tangente 1 es 45°. Se reemplaza en cualquiera de las dos.'], ecuacion: [th, ' = 45°,   4 · 3 · cos 45° = 12 · √2/2 = 6√2 ≈ 8,49'] },
      ],
      respuesta: [th, ' = 45°; los dos valen ', dR('6√2 ≈ 8,49')] },
    { nivel: 2, titulo: 'El valor que los vuelve perpendiculares',
      figura: flx({ unidad: 'u', guias: [...ejesG(-1, 7, -4, 5), { de: [2, -3.5], a: [2, 4.5], color: 'o' }], flechas: [{ de: [0, 0], a: [6, -3], color: 'i', rotulo: 'B⃗', rotuloEn: 0.8 }], puntos: [{ x: 2, y: 4.5, rotulo: 'aquí va la punta de A⃗' }] }),
      enunciado: ['¿Para qué valor de m son perpendiculares ', vA, ' = 2î + mĵ y ', vB, ' = 6î − 3ĵ?'],
      datos: [DT.escalar2, cosD(90)],
      solucion: [
        { texto: ['Perpendiculares quiere decir 90°: cos 90° = 0, y el producto escalar vale cero.'], ecuacion: [vA, ' · ', vB, ' = (2)(6) + (m)(−3) = 12 − 3m = 0'] },
        { texto: ['Se despeja m.'], ecuacion: ['3m = 12,   m = 4'] },
      ],
      respuesta: [dA('m = 4'), ', y ', vA, ' = 2î + 4ĵ'] },
    { nivel: 2, titulo: 'El vectorial con componentes',
      figura: flx({ unidad: 'u', guias: [...ejesG(-1, 6, -1, 7), { de: [2, 5], a: [5, 6], color: 'f' }, { de: [3, 1], a: [5, 6], color: 'f' }], flechas: [{ de: [0, 0], a: [2, 5], color: 'o', rotulo: 'A⃗', rotuloEn: 0.95 }, { de: [0, 0], a: [3, 1], color: 'i', rotulo: 'B⃗' }] }),
      enunciado: ['Si ', vA, ' = 2î + 5ĵ y ', vB, ' = 3î + ĵ, ¿cuánto vale ', vA, ' × ', vB, '? ¿Sale de la pantalla o entra?'],
      datos: [DT.vectorialC, DT.sale],
      solucion: [
        { texto: ['Se multiplica la x de ', vA, ' por la y de ', vB, ' y se le resta la y de ', vA, ' por la x de ', vB, ', en ese orden.'], ecuacion: [vA, ' × ', vB, ' = [(2)(1) − (5)(3)] k̂ = (2 − 15) k̂ = −13 k̂'] },
        { texto: ['El signo menos dice que apunta contra k̂: entra en la pantalla, ⊗. De ', vA, ' hacia ', vB, ' se gira en sentido horario.'] },
      ],
      respuesta: [vA, ' × ', vB, ' = ', dR('−13 k̂'), ': entra (⊗)'] },
    { nivel: 3, titulo: 'El trabajo con componentes',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -36.87, mod: 50, color: 'o', rotulo: 'F⃗', valor: '50 N' }, { desde: 'manijas', de: [-40, 30], a: [0, 30], color: 'o', rotulo: '40 N', discontinua: true }, { desde: 'manijas', de: [-40, 30], a: [-40, 0], color: 'o', rotulo: '30 N', discontinua: true, rotuloEn: 0.6 }, { desde: 'piso', ang: 0, mod: 15, color: 'f', rotulo: 'd⃗', valor: '15 m' }] }),
      enunciado: ['Se empuja una carretilla con ', vF, ' = 40î − 30ĵ N, y avanza ', vDd, ' = 15î m por el piso. ¿Cuánto trabajo hace esa fuerza? ¿Qué parte de la fuerza no trabaja?'],
      datos: [['Trabajo de una fuerza: W = ', vF, ' · ', vDd, ' = ', sub(F, 'x'), sub(Dd, 'x'), ' + ', sub(F, 'y'), sub(Dd, 'y')], '1 J = 1 N · m'],
      solucion: [
        { texto: ['El trabajo es el producto escalar: se multiplica x con x e y con y, y ', vDd, ' no tiene componente y.'], ecuacion: ['W = ', vF, ' · ', vDd, ' = (40)(15) + (−30)(0) = 600 J'] },
        { texto: ['La parte vertical, −30ĵ N, es perpendicular al desplazamiento: aprieta la carretilla contra el piso, pero no trabaja.'] },
      ],
      respuesta: ['W = 600 J; la parte vertical, de 30 N, no trabaja'] },
    { nivel: 3, titulo: 'Perpendicular a la diferencia', figura: pr(4, 8, 60, { pasoS: 99, pasoP: 99, angTexto: 'θ = ?' }),
      enunciado: ['Dos vectores miden ', A, ' = 4 y ', B, ' = 8, y ', vA, ' es perpendicular a ', vA, ' − ', vB, '. ¿Qué ángulo forman ', vA, ' y ', vB, '?'],
      datos: [DT.escalar, 'Dos vectores perpendiculares tienen producto escalar 0.', ['El escalar se reparte: ', vA, ' · (', vA, ' − ', vB, ') = ', vA, ' · ', vA, ' − ', vA, ' · ', vB], [vA, ' · ', vA, ' = ', cuad(A)], cosD(30, 45, 60)],
      solucion: [
        { texto: ['Como son perpendiculares, su producto escalar es 0, y el producto se reparte sobre la resta.'], ecuacion: [vA, ' · (', vA, ' − ', vB, ') = ', cuad(A), ' − ', vA, ' · ', vB, ' = 0   →   ', vA, ' · ', vB, ' = ', cuad(A), ' = 16'] },
        { texto: ['Con la fórmula del ángulo se despeja el coseno.'], ecuacion: ['4 · 8 · cos ', th, ' = 16   →   cos ', th, ' = ', { frac: ['16', '32'] }, ' = 1/2,   ', th, ' = 60°'] },
      ],
      respuesta: [th, ' = ', dTh('60°')] },
    { nivel: 3, titulo: 'El ángulo desde el escalar', figura: pr(6, 4, 120, { ladoB: -1, angTexto: 'θ = ?', pasoS: 99, pasoP: 99 }),
      enunciado: ['Dos vectores de ', A, ' = 6 y ', B, ' = 4 cumplen ', vA, ' · ', vB, ' = −12. ¿Qué ángulo forman y cuánto mide ', vA, ' × ', vB, '?'],
      datos: [DT.escalar, DT.vectorial, cosD(60, 120), senD(120), '√3 ≈ 1,73'],
      solucion: [
        { texto: ['Del escalar se despeja el coseno, que sale negativo: forman más de 90°.'], ecuacion: ['cos ', th, ' = ', { frac: ['−12', '6 · 4'] }, ' = −1/2,   ', th, ' = 120°'] },
        { texto: ['Con ese ángulo se calcula el módulo del vectorial.'], ecuacion: ['|', vA, ' × ', vB, '| = 6 · 4 · sen 120° = 24 · √3/2 = 12√3 ≈ 20,8'] },
      ],
      respuesta: [th, ' = 120°; |', vA, ' × ', vB, '| = ', dR('12√3 ≈ 20,8')] },
    { nivel: 3, titulo: 'El área desde el escalar', figura: pr(5, 4, 53.13, { pasoS: 99, angTexto: 'θ' }),
      enunciado: ['Dos vectores miden ', A, ' = 5 u y ', B, ' = 4 u, y su producto escalar vale ', vA, ' · ', vB, ' = 12. ¿Cuánto mide el área del paralelogramo que arman?'],
      datos: [DT.escalar, DT.vectorial, DT.area, 'Para cualquier ángulo: sen² θ + cos² θ = 1', DT.u],
      solucion: [
        { texto: ['Del escalar sale el coseno del ángulo.'], ecuacion: ['5 · 4 · cos ', th, ' = 12   →   cos ', th, ' = ', { frac: ['12', '20'] }, ' = 3/5'] },
        { texto: ['El seno sale de sen² θ + cos² θ = 1; entre 0° y 180° es positivo.'], ecuacion: ['sen ', th, ' = √(1 − 9/25) = √(16/25) = 4/5'] },
        { texto: ['El área es el módulo del vectorial.'], ecuacion: ['|', vA, ' × ', vB, '| = 5 · 4 · 4/5 = 16'] },
      ],
      respuesta: ['Área = ', dR('16 u²')] },
    { nivel: 3, titulo: 'Tres estacas en la chacra',
      figura: flx({ unidad: 'm', guias: [...ejesG(0, 55, 0, 45), { de: [50, 20], a: [20, 40], color: 'f' }], flechas: [{ de: [10, 10], a: [50, 20], color: 'o', rotulo: 'A⃗' }, { de: [10, 10], a: [20, 40], color: 'i', rotulo: 'B⃗' }],
        puntos: [{ x: 10, y: 10, rotulo: 'P' }, { x: 50, y: 20, rotulo: 'Q' }, { x: 20, y: 40, rotulo: 'S' }] }),
      enunciado: ['Tres estacas marcan un terreno triangular en P(10; 10), Q(50; 20) y S(20; 40), en metros. ¿Cuál es su área?'],
      datos: ['Vector de un punto P a otro Q: Q − P, eje por eje (punta menos cola).', DT.vectorialC, DT.area, 'El área de un triángulo es la mitad de la del paralelogramo.'],
      solucion: [
        { texto: ['Desde P se trazan dos lados como vectores: punta menos cola.'], ecuacion: [vA, ' = Q − P = 40î + 10ĵ,   ', vB, ' = S − P = 10î + 30ĵ'] },
        { texto: ['El vectorial da el área del paralelogramo que arman ', vA, ' y ', vB, '.'], ecuacion: [vA, ' × ', vB, ' = [(40)(30) − (10)(10)] k̂ = 1100 k̂'] },
        { texto: ['El triángulo es la mitad de ese paralelogramo.'], ecuacion: ['Área = 1100 ÷ 2 = 550 m²'] },
      ],
      respuesta: ['Área = ', dR('550 m²')] },
  ];

  const productos = {
    id: 'productos',
    titulo: 'Productos',
    pregunta: '¿De qué dos maneras se multiplican dos flechas?',
    temas: ['Producto escalar y vectorial'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        // Punto 1 del contrato: la primera pantalla trae un objeto reconocible (un costal que se jala con una soga).
        { titulo: 'Jalar un costal', pieza: 'fis-fuerzas', dibujo: LEE_PROD,
          texto: ['Un agricultor jala un costal con una soga inclinada, ', vF, '. Solo la parte de la fuerza que va a lo largo del piso, punteada, lo hace avanzar: es la «sombra» de ', vF, ' sobre el piso.'] },
        { titulo: 'Dos maneras de multiplicar', texto: ['El producto escalar, ', vA, ' · ', vB, ', es ', A, ' por la sombra de ', vB, ' sobre ', vA, ': un número. Desde un mismo punto, ', vA, ' y ', vB, ' arman un paralelogramo: su área la da el producto vectorial, ', vA, ' × ', vB, ', una flecha.'] },
        { titulo: 'k̂ y la mano derecha', texto: ['Además de î y ĵ está k̂: mide 1 y sale de la pantalla hacia ti. ⊙ es una flecha que sale; ⊗, una que entra. Si los dedos de la mano derecha giran de ', vA, ' hacia ', vB, ', el pulgar da ', vA, ' × ', vB, '.'] },
        { titulo: 'Qué mirar al jugar', texto: [vB, ' gira sola. Mira cuándo la sombra crece, cuándo desaparece y cuándo el área es la mayor.'] },
      ],
    },
    actividad: 'Girar B y comparar su sombra sobre A con el área que encierran juntas.',
    ejemplos: EJEMPLOS_PRODUCTOS,
    aprendizaje: 'El producto escalar es A por la sombra de B⃗ sobre A⃗: un número. El vectorial mide el área y apunta fuera del plano.',
    juega: {
      consigna: [A, ' = 4 y ', B, ' = 3. ', vB, ' gira sola, y si la arrastras, se queda quieta. Mira su sombra sobre ', vA, ' y el área.'],
      mision: {
        texto: 'Haz que el producto escalar valga 0.',
        logrado: val => Math.abs(cosG(val.g)) < 1e-9,
        bien: 'A 90°, B⃗ no hace sombra: el escalar es 0 y el área es máxima.',
      },
      voz: 'Busca dónde la sombra desaparece y dónde el área es mayor.',
      leyenda: [
        { s: [vA, ', ', vB], t: 'las dos flechas: miden 4 y 3' },
        { s: [th], t: 'el ángulo entre A⃗ y B⃗' },
        { s: [B, ' cos ', th], t: 'la sombra de B⃗ sobre A⃗' },
        { s: [vA, ' · ', vB], t: 'producto escalar: da un número' },
        { s: ['|', vA, ' × ', vB, '|'], t: 'módulo del vectorial: el área' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } }],
      dibujo: val => prod(4, 3, val.g, { marco: MARCO_P }),
      // Dos relaciones, separadas con «;»: un «·» entre ellas se leía como un producto (auditoría, M12).
      lectura: val => [vA, ' · ', vB, ` = ${f(12 * cosG(val.g), 2)};   |`, vA, ' × ', vB, `| = ${f(12 * senG(val.g), 2)}`],
      minimo: 3,
      // Arrastra la punta de B por su media vuelta: su giro es θ (el largo de B queda en 3).
      arrastres: [
        { id: 'giro-b', etiqueta: 'punta de B', color: 'c-h',
          donde: val => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { x: g.X(3 * cosG(val.g)), y: g.Y(3 * senG(val.g)) }; },
          mover: (pt, val) => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { g: anguloDe([0, 0], [g.Xi(pt.x), g.Yi(pt.y)]) }; } },
      ],
    },
    predice: {
      pregunta: ['Dos vectores de ', A, ' = 4 y ', B, ' = 5 forman ', th, ' = 90°. ¿Cuánto vale el producto escalar ', vA, ' · ', vB, '?'],
      opciones: [
        { id: 'c', texto: '0', correcta: true },
        { id: 'modulos', texto: '20', error: 'PE-MODULOS', siFuera: '20 sería cierto si apuntaran al mismo lado, pero a 90° B⃗ no hace sombra sobre A⃗.' },
        { id: 'vector', texto: '20 k̂', error: 'PE-VECTOR', siFuera: '20 k̂ es el producto vectorial a 90°. El escalar es un número, sin dirección.' },
        { id: 'suma', texto: '9', error: 'V-SUMA', siFuera: 'Sumaste 4 + 5, pero el producto escalar no suma los módulos: multiplica A por la sombra de B⃗ sobre A⃗, y a 90° esa sombra mide 0.' },
      ],
      dibujo: prod(4, 5, 90, { circulo: false, paso: 0, pasoS: 9, pasoP: 9 }),
      revelar: prod(4, 5, 90, { circulo: false, pasoP: 9 }),
      coincide: 'Coincide: a 90°, la sombra de B sobre A mide 0.',
    },
    mira: {
      datos: prod(4, 3, 60, { circulo: false, pasoS: 1, pasoP: 3, pasoK: 4 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: [vA, ' mide 4, ', vB, ' mide 3 y forman 60°.'], ecuacion: [A, ' = 4,  ', B, ' = 3,  ', th, ' = 60°'] },
        { estado: { paso: 1 }, texto: ['La sombra de ', vB, ' sobre ', vA, ' mide 3 · cos 60° = 1,5.'], ecuacion: [B, ' cos ', th, ' = 3 · cos 60° = 3 · 0,5 = 1,5'] },
        { estado: { paso: 2 }, texto: 'El producto escalar da una magnitud escalar: un número, sin dirección.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 4 · 3 · cos 60° = 4 · 1,5 = 6'] },
        { estado: { paso: 3 }, texto: 'El módulo del producto vectorial es el área del paralelogramo.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ` sen `, th, ` = ${f(12 * senG(60), 2)}`] },
        { estado: { paso: 4 }, texto: ['Apunta hacia fuera de la pantalla, ⊙: con la mano derecha, los dedos giran de ', vA, ' a ', vB, '.'], ecuacion: [vA, ' × ', vB, ` = ${f(12 * senG(60), 2)} k̂`] },
        { estado: { paso: 4 }, texto: 'Con componentes, el escalar multiplica cada componente por la de su mismo eje y suma los productos.', ecuacion: [vA, ' · ', vB, ' = ', { sub: [A, 'x'] }, { sub: [B, 'x'] }, ' + ', { sub: [A, 'y'] }, { sub: [B, 'y'] }, ';   (3î + 4ĵ) · (2î + ĵ) = 6 + 4 = 10'] },
        { estado: { paso: 4 }, texto: 'El vectorial multiplica en cruz, la x de una por la y de la otra, y resta los productos.', ecuacion: [vA, ' × ', vB, ' = (', { sub: [A, 'x'] }, { sub: [B, 'y'] }, ' − ', { sub: [A, 'y'] }, { sub: [B, 'x'] }, ') k̂'] },
      ],
    },
    regla: {
      texto: 'El producto escalar A⃗ · B⃗ multiplica A por la sombra de B⃗ sobre A⃗ y da solo un número; así se calcula cuánto ayuda una soga inclinada a avanzar. El vectorial A⃗ × B⃗ es una flecha perpendicular a los dos, y su largo es el área del paralelogramo que arman. Si cambias el orden, B⃗ × A⃗ apunta al revés.',
      ecuacion: [vA, ' · ', vB, ' = ', A, { llave: [B, ' cos ', th], nota: 'sombra de B⃗', color: 'c-i' }, ';   ', '|', vA, ' × ', vB, '| = ', { llave: [A, B, ' sen ', th], nota: 'área', color: 'c-f' }],
      condicion: 'θ es el ángulo entre A⃗ y B⃗ puestos cola con cola; si pones una flecha en la punta de la otra, el ángulo que ves es 180° − θ y el coseno cambia de signo.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 800), tipo = s % 4;
        const t = (x, y) => `${f(x, 0)}î ${y < 0 ? '−' : '+'} ${f(Math.abs(y), 0)}ĵ`;
        if (tipo === 3) {
          // El vectorial con componentes, resuelto (lector en frío, ronda 2: no había ningún ejemplo con números).
          const [a1, a2, b1, b2] = r.de([[3, 2, 1, 4], [2, 5, 3, 1], [4, -1, 2, 3], [1, 3, -2, 2], [5, 2, 1, 3], [2, -3, 4, 1]]), pv = a1 * b2 - a2 * b1;
          return {
            enunciado: ['Si ', vA, ` = ${t(a1, a2)} y `, vB, ` = ${t(b1, b2)}, ¿cuánto vale `, vA, ' × ', vB, '?'],
            datos: [DT.vectorialC, DT.sale],
            pasos: [
              { tipo: 'pide', texto: 'Piden el producto vectorial: una flecha perpendicular al plano, según k̂.' },
              { tipo: 'datos', texto: [sub(A, 'x'), ` = ${f(a1, 0)}, `, sub(A, 'y'), ` = ${f(a2, 0)}; `, sub(B, 'x'), ` = ${f(b1, 0)}, `, sub(B, 'y'), ` = ${f(b2, 0)}.`] },
              { tipo: 'regla', texto: ['Se multiplica la x de ', vA, ' por la y de ', vB, ' y se le resta la y de ', vA, ' por la x de ', vB, ', en ese orden.'], ecuacion: [vA, ' × ', vB, ' = (', { sub: [A, 'x'] }, { sub: [B, 'y'] }, ' − ', { sub: [A, 'y'] }, { sub: [B, 'x'] }, ') k̂'] },
              { tipo: 'cuentas', texto: 'Se reemplaza con sus signos.', ecuacion: [`(${f(a1, 0)})(${f(b2, 0)}) − (${f(a2, 0)})(${f(b1, 0)}) = ${f(a1 * b2, 0)} − (${f(a2 * b1, 0)}) = ${f(pv, 0)}`] },
              { tipo: 'sentido', texto: pv > 0 ? [`Sale ${f(pv, 0)} k̂, positivo, así que apunta hacia fuera de la pantalla; `, vB, ' × ', vA, ` daría ${f(-pv, 0)} k̂.`] : [`Sale ${f(pv, 0)} k̂, negativo, así que entra en la pantalla; `, vB, ' × ', vA, ` daría ${f(-pv, 0)} k̂.`] },
            ],
            respuesta: [vA, ' × ', vB, ` = ${f(pv, 0)} k̂`],
          };
        }
        if (tipo === 0) {
          // Más casos (auditoría, B9: con 4, las semillas 0, 4 y 500 daban el mismo).
          const [a, b, g] = r.de([[10, 5, 60], [8, 5, 37], [6, 10, 53], [4, 5, 120], [12, 5, 53], [5, 8, 60], [10, 4, 37], [6, 6, 120]]);
          const cs = { 37: 4 / 5, 53: 3 / 5, 60: 1 / 2, 120: -1 / 2 }[g], pe = a * b * cs;
          return {
            enunciado: ['Dos vectores de ', A, ` = ${f(a, 0)} y `, B, ` = ${f(b, 0)} forman `, th, ` = ${g}°. ¿Cuánto vale `, vA, ' · ', vB, '?'],
            datos: [DT.escalar, cosD(g)],
            pasos: [
              { tipo: 'pide', texto: 'Piden el producto escalar: un número.' },
              { tipo: 'datos', texto: [A, ` = ${f(a, 0)}, `, B, ` = ${f(b, 0)} y `, th, ` = ${g}°.`] },
              { tipo: 'regla', texto: ['El escalar es ', A, ' por la sombra de ', vB, ' sobre ', vA, '.'], ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th] },
              { tipo: 'cuentas', texto: `Se reemplaza cos ${g}° = ${COS[g]}.`, ecuacion: [vA, ' · ', vB, ` = ${f(a, 0)} · ${f(b, 0)} · cos ${g}° = ${f(a, 0)} · ${f(b, 0)} · ${cosP(g)} = ${f(pe, 0)}`] },
              { tipo: 'sentido', texto: g > 90 ? ['Pasado 90°, la sombra cae detrás de ', vA, ': el escalar sale negativo.'] : `Es un número, sin flecha, y menor que ${f(a, 0)} · ${f(b, 0)} = ${f(a * b, 0)} porque cos θ es menor que 1.` },
            ],
            respuesta: [vA, ' · ', vB, ` = ${f(pe, 0)}`],
          };
        }
        if (tipo === 1) {
          const [a, b, g] = r.de([[6, 4, 30], [10, 5, 37], [5, 4, 53], [8, 3, 90], [10, 6, 53], [7, 4, 30], [5, 6, 37], [8, 5, 30]]);
          const sn = { 30: 1 / 2, 37: 3 / 5, 53: 4 / 5, 90: 1 }[g], pv = a * b * sn;
          return {
            enunciado: ['Dos vectores de ', A, ` = ${f(a, 0)} y `, B, ` = ${f(b, 0)} forman `, th, ` = ${g}°. ¿Cuánto mide `, vA, ' × ', vB, '?'],
            datos: [DT.vectorial, senD(g)],
            pasos: [
              { tipo: 'pide', texto: 'Piden el módulo del producto vectorial: el área del paralelogramo.' },
              { tipo: 'datos', texto: [A, ` = ${f(a, 0)}, `, B, ` = ${f(b, 0)} y `, th, ` = ${g}°.`] },
              { tipo: 'regla', texto: ['El área es base por altura: ', A, ' por lo que ', vB, ' sube sobre ', vA, '.'], ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ' sen ', th] },
              { tipo: 'cuentas', texto: `Se reemplaza sen ${g}° = ${SEN[g]}.`, ecuacion: ['|', vA, ' × ', vB, `| = ${f(a, 0)} · ${f(b, 0)} · sen ${g}° = ${f(a, 0)} · ${f(b, 0)} · ${SEN[g]} = ${f(pv, 0)}`] },
              { tipo: 'sentido', texto: [`Es perpendicular al plano de `, vA, ' y ', vB, `; el sentido lo da la mano derecha. Su módulo nunca pasa de ${f(a, 0)} · ${f(b, 0)} = ${f(a * b, 0)}.`] },
            ],
            respuesta: ['|', vA, ' × ', vB, `| = ${f(pv, 0)}`],
          };
        }
        const [a1, a2, b1, b2] = r.de([[3, 4, 2, -1], [2, 5, 4, 1], [1, 3, 5, 2], [4, -2, 3, 6], [5, 1, 2, 3], [-2, 3, 4, 2]]), pe = a1 * b1 + a2 * b2;
        return {
          enunciado: ['Si ', vA, ` = ${t(a1, a2)} y `, vB, ` = ${t(b1, b2)}, ¿cuánto vale `, vA, ' · ', vB, '?'],
          datos: [DT.ij, DT.escalarC],
          pasos: [
            { tipo: 'pide', texto: 'Piden el producto escalar con componentes.' },
            { tipo: 'datos', texto: [sub(A, 'x'), ` = ${f(a1, 0)}, `, sub(A, 'y'), ` = ${f(a2, 0)}; `, sub(B, 'x'), ` = ${f(b1, 0)}, `, sub(B, 'y'), ` = ${f(b2, 0)}.`] },
            { tipo: 'regla', texto: 'Cada componente se multiplica con la de su mismo eje, y se suman.', ecuacion: [vA, ' · ', vB, ' = ', { sub: [A, 'x'] }, { sub: [B, 'x'] }, ' + ', { sub: [A, 'y'] }, { sub: [B, 'y'] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza con sus signos.', ecuacion: [`(${f(a1, 0)})(${f(b1, 0)}) + (${f(a2, 0)})(${f(b2, 0)}) = ${f(a1 * b1, 0)} + (${f(a2 * b2, 0)}) = ${f(pe, 0)}`] },
            { tipo: 'sentido', texto: pe === 0 ? ['Da 0: ', vA, ' y ', vB, ' son perpendiculares.'] : `Da ${f(pe, 0)}, un número sin î ni ĵ, y como es ${pe < 0 ? 'negativo, forman más de 90°.' : 'positivo, forman menos de 90°.'}` },
          ],
          respuesta: [vA, ' · ', vB, ` = ${f(pe, 0)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a1 = r.ent(-4, 5), a2 = r.ent(-3, 5), b1 = r.ent(-3, 5), b2 = r.ent(-4, 5);
        if (a1 === 0) a1 = 2; if (b2 === 0) b2 = 3;
        // Sin «1 k̂», «5î − 1ĵ» ni «+ 0ĵ» (auditoría, B6): el 1 no se escribe y el término 0 se omite.
        const coef = (n, e) => (n === 1 ? e : n === -1 ? `−${e}` : `${f(n, 0)}${e}`);
        const txt = (x, y) => (x === 0 && y === 0 ? '0' : x === 0 ? coef(y, 'ĵ') : y === 0 ? coef(x, 'î') : `${coef(x, 'î')} ${y < 0 ? '−' : '+'} ${coef(Math.abs(y), 'ĵ')}`);
        const kfmt = x => (x === 0 ? '0' : coef(x, ' k̂').replace(/^ /, '').replace(/^−\s/, '−'));
        const pre = ['Si ', vA, ` = ${txt(a1, a2)} y `, vB, ` = ${txt(b1, b2)}, `];
        if (s % 4 === 3) {
          // Nivel de examen (auditoría, M18): el ángulo desde el escalar, o el valor que los vuelve perpendiculares.
          if (s % 8 === 3) {
            const [a, b, pe, g] = r.de([[5, 4, 10, 60], [5, 6, 24, 37], [10, 5, 30, 53], [10, 4, -20, 120], [8, 5, 32, 37]]);
            return {
              pregunta: ['Dos vectores de ', A, ` = ${f(a, 0)} y `, B, ` = ${f(b, 0)} cumplen `, vA, ' · ', vB, ` = ${f(pe, 0)}. ¿Qué ángulo forman?`],
              datos: [DT.escalar, 'cos 37° = 4/5, cos 53° = 3/5, cos 60° = 1/2 y cos 120° = −1/2'],
              opciones: opciones(g, [
                { id: 'signo', valor: 180 - g, error: 'PE-SIGNO', siFuera: pe < 0 ? 'El tamaño del coseno está bien, pero es negativo: forman más de 90°.' : 'El tamaño del coseno está bien, pero es positivo: forman menos de 90°.' },
                { id: 'seno', valor: 90 - g > 0 ? 90 - g : g - 90, error: 'VE-escalar-por-vectorial', siFuera: 'Tomaste ese cociente como un seno, pero el producto escalar va con el coseno.' },
                // Solo con 120°: en los otros casos el valor coincidía con el de «seno» y se descartaba (verificación, 26 nov).
                { id: 'directo', valor: g === 120 ? 150 : NaN, error: 'VE-escalar-por-vectorial', siFuera: 'Tomaste 1/2 como un seno y, como el producto es negativo, buscaste el ángulo obtuso con ese seno. Pero el producto escalar va con el coseno: cos θ = −1/2.' },
              ], x => `${f(x, 0)}°`),
              solucion: { texto: `Se despeja el coseno: cos θ = ${f(pe, 0)}/(${f(a, 0)} · ${f(b, 0)}) = ${COS[g]}.`, ecuacion: [th, ` = ${g}°`] },
            };
          }
          const [p1, q1, p2, q2] = r.de([[2, 0, 6, -3], [3, 0, 4, 2], [4, 0, 2, -1], [1, 0, 6, 3], [6, 0, 2, -4], [5, 0, 3, -5]]);
          const m = -p1 * p2 / q2;
          return {
            pregunta: ['¿Para qué valor de m son perpendiculares ', vA, ` = ${coef(p1, 'î')} + mĵ y `, vB, ` = ${txt(p2, q2)}?`],
            datos: [DT.escalarC, 'Dos vectores perpendiculares tienen producto escalar 0.'],
            opciones: opciones(m, [
              { id: 'signo', valor: -m, error: 'PE-SIGNO', siFuera: 'El tamaño está bien, pero el signo cambia al pasar el término al otro lado del igual.' },
              { id: 'cruz', valor: p1 * q2 / p2, error: 'PE-VECTOR', siFuera: 'Igualaste a cero el producto vectorial, pero en dos vectores perpendiculares es el escalar el que vale 0.' },
              { id: 'cruce', valor: -p2 * q2 / p1, error: 'PE-MODULOS', siFuera: 'Cada componente va con la de su mismo eje: x con x, y con y.' },
            ], x => f(x, 2)),
            solucion: { texto: 'Como son perpendiculares, el producto escalar vale 0, y de ahí se despeja m.', ecuacion: [vA, ' · ', vB, ` = (${f(p1, 0)})(${f(p2, 0)}) + (m)(${f(q2, 0)}) = 0   →   m = ${f(m, 2)}`] },
          };
        }
        if (s % 2 === 0) {
          const pe = a1 * b1 + a2 * b2;
          return {
            pregunta: [...pre, '¿cuánto vale ', vA, ' · ', vB, '?'],
            // Las dos fórmulas: elegir cuál es el criterio que se practica (el distractor «cruz» lo mide).
            datos: [DT.escalarC, DT.vectorialC],
            opciones: opciones(pe, [
              { id: 'cruz', valor: a1 * b2 - a2 * b1, error: 'PE-VECTOR', siFuera: 'Cruzaste x con y, que es lo que hace el producto vectorial. El escalar junta cada componente con la de su mismo eje y suma.' },
              { id: 'resta', valor: a1 * b1 - a2 * b2, error: 'PE-SIGNO', siFuera: 'En el escalar los dos productos se suman.' },
              { id: 'suma', valor: (a1 + a2) * (b1 + b2), error: 'PE-MODULOS', siFuera: 'Eso mezcla x con y; cada componente se multiplica con la de su mismo eje.' },
            ], x => f(x, 0)),
            solucion: { texto: 'Cada componente se multiplica con la de su mismo eje, y los productos se suman.', ecuacion: [vA, ' · ', vB, ` = (${f(a1, 0)})(${f(b1, 0)}) + (${f(a2, 0)})(${f(b2, 0)}) = ${f(pe, 0)}`] },
          };
        }
        const pv = a1 * b2 - a2 * b1;
        return {
          pregunta: [...pre, '¿cuánto vale ', vA, ' × ', vB, '?'],
          datos: [DT.escalarC, DT.vectorialC],
          opciones: opciones(pv, [
            { id: 'orden', valor: -pv, error: 'PE-ORDEN', siFuera: 'Ese es B⃗ × A⃗: el orden cambia el signo.' },
            { id: 'escalar', valor: a1 * b1 + a2 * b2, error: 'PE-VECTOR', siFuera: 'Ese es el producto escalar: un número, sin k̂.' },
            { id: 'sin-resta', valor: a1 * b2 + a2 * b1, error: 'PE-SIGNO', siFuera: 'Los productos cruzados se restan, no se suman.' },
          ], kfmt),
          solucion: { texto: 'Se cruzan las componentes y se restan; el resultado apunta según k̂.', ecuacion: [vA, ' × ', vB, ` = [(${f(a1, 0)})(${f(b2, 0)}) − (${f(a2, 0)})(${f(b1, 0)})] k̂ = ${kfmt(pv)}`] },
        };
      },
    },
  };

  // Mesas del laboratorio: la escala se fija con los largos máximos, para que las puntas sigan al dedo.
  const sumaLibre = val => colaPunta(val.a, val.b, val.g, { marco: [[-4, 0], [12.5, 6]] });
  const prodLibre = val => prod(val.a, val.b, val.g, { marco: [[-5, -0.7], [10, 5]] });
  // Lo que miden la sombra (escalar) y el paralelogramo (área del vectorial) en la mesa libre; lo usan la lectura y los retos.
  const escalarLibre = val => val.a * val.b * cosG(val.g);
  const areaLibre = val => Math.abs(val.a * val.b * senG(val.g));
  const rLibre = val => sumaLibre(val).r;
  const modA = val => Math.hypot(val.ax, val.ay);
  // Flechas en el espacio (laboratorio 3D, 15 nov: exploración libre, sin predicciones). Módulo, A · B y A × B salen del
  // motor de plantillas/vectores a través de nucleo/fisica3d.js: la figura, la lectura y los retos usan el mismo número.
  const esp = val => F3.vectores(val);
  const casi = (a, b) => Math.abs(a - b) < 1e-9;
  const mesaEspacio = {
    id: 'flechas-espacio', titulo: 'Flechas en el espacio', pieza: 'fis-espacio-3d',
    consigna: 'A en z sube y baja sola: mira cómo cambia el largo de A⃗. Gira el espacio con el dedo; después mira A⃗ × B⃗.',
    controles: [
      { id: 'ver', etiqueta: 'Mirar', opciones: [{ valor: 'comp', texto: 'Componentes' }, { valor: 'cruz', texto: 'A⃗ × B⃗' }] },
      { id: 'ax', etiqueta: 'A en x', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 2, decimales: 0 },
      { id: 'ay', etiqueta: 'A en y', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      // Az barre de −2 a 2 y vuelve; los cuadros casi nunca caen justo en 0, así la flecha de Az no desaparece y la
      // escena 3D se mueve sin rearmarse (fis-espacio-3d, forma y mover). Los retos piden valores que el alumno fija.
      { id: 'az', etiqueta: 'A en z', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
      { id: 'b', etiqueta: 'B⃗', color: 'c-i', opciones: ['x', 'y', 'z', 'xy'].map(k => ({ valor: k, texto: F3.BNOMBRE[k] })) },
    ],
    dibujo: val => ({ datos: esp(val).datos, estado: {} }),
    lectura: val => {
      const e = esp(val);
      // Dos relaciones, separadas con «;» (un «·» entre ellas se leía como un producto).
      return val.ver === 'cruz' ? [vA, ' · ', vB, ` = ${f(e.punto)};   |`, vA, ' × ', vB, `| = ${f(e.modCruz)}`] : [A, ` = √(${[val.ax, val.ay, val.az].map(x => f(x * x)).join(' + ')}) = ${f(e.modA)}`];
    },
    invitaciones: [
      { texto: 'Arma una A⃗ que mida justo 3 sin ponerla sobre un eje.',
        logrado: val => casi(esp(val).modA, 3) && [val.ax, val.ay, val.az].filter(x => x !== 0).length >= 2,
        bien: 'Tres sombras, un solo largo: √(4 + 4 + 1) = 3. Pitágoras dos veces.',
        pista: 'Prueba componentes 2, 2 y 1, con el signo que quieras.' },
      { texto: 'Mirando A⃗ × B⃗, logra un producto cero sin que A⃗ sea cero.',
        logrado: val => val.ver === 'cruz' && esp(val).modA > 0 && casi(esp(val).modCruz, 0),
        bien: 'A⃗ quedó paralela a B⃗: no hay paralelogramo, no hay área.',
        pista: 'Pon A⃗ en la misma dirección que B⃗. Mira si queda área entre las dos.' },
      { texto: 'Logra que A⃗ × B⃗ apunte hacia arriba, con z positivo.',
        logrado: val => val.ver === 'cruz' && esp(val).cruz[2] > 1e-9,
        bien: 'Cambia el orden de los giros y la flecha cambia de lado. Míralo de costado.',
        pista: 'Con B⃗ = î, prueba A en y negativa. Gira el espacio y mira hacia dónde sale.' },
      { texto: 'Haz A⃗ · B⃗ = 0 con una A⃗ de largo 2 o más.',
        logrado: val => val.ver === 'cruz' && esp(val).modA >= 2 - 1e-9 && casi(esp(val).punto, 0),
        bien: 'Perpendiculares: la sombra de A⃗ sobre B⃗ no mide nada, pero el área es máxima.',
        pista: 'Elige B⃗ = k̂ y deja A en z en 0.' },
      { texto: 'Guarda dos A⃗ del mismo largo que apunten a lugares distintos.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => esp(a).modA > 0 && casi(esp(a).modA, esp(b).modA)
          && (a.ax !== b.ax || a.ay !== b.ay || a.az !== b.az))),
        bien: 'El largo no dice hacia dónde: para eso están las tres componentes.' },
    ],
  };

  return {
    unidad: 'fisica.vectores',
    // Unidad nueva del 16 nov: sale de «Magnitudes y vectores» (Gerson eligió partirla).
    version: '0.2.0',
    estado: 'completa',
    // Pasó por el contrato «se entiende sin profesor» (16 nov): misión, leyenda, aprendizaje, actividad, pregunta, palabras
    // del Resumen y 3 ejemplos por término; las cuatro ideas, con lector en frío (rutinas/frio/fisica.vectores.md).
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/fis-dron.js', '/nucleo/kit/piezas/flechas.js', '/nucleo/kit/piezas/fis-fuerzas.js', '/plantillas/vectores/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    glosario: [
      { termino: 'magnitud escalar', formas: ['magnitud escalar', 'magnitudes escalares', 'escalar', 'escalares'],
        simple: 'Queda dicha con un número y su unidad: 5 kg, 20 °C, 45 min.',
        def: 'La que queda dicha del todo con un número y su unidad, sin dirección.',
        ejemplos: ['Una masa de 3 kg o un tiempo de 10 s.', 'La temperatura de un vaso de agua: 20 °C.', 'El volumen de una botella: 0,5 L. No apunta a ningún lado.'], ver: ['vector'] },
      { termino: 'vector', formas: ['vector', 'vectores', 'magnitud vectorial', 'magnitudes vectoriales', 'vectorial', 'vectoriales'],
        simple: 'Un dato con cuánto y hacia dónde: 300 m hacia el noroeste.',
        def: 'Flecha con módulo, dirección y sentido, como el desplazamiento o la fuerza. Se escribe con flecha: A⃗.',
        ejemplos: ['Una fuerza de 4 N hacia arriba.', 'El desplazamiento de una combi: 3 km hacia el norte.', 'La velocidad del viento: 5 m/s hacia el este.'], ver: ['módulo', 'dirección y sentido', 'magnitud escalar', 'componente'] },
      { termino: 'módulo', simbolo: 'A', simple: 'Cuánto mide la flecha, sin importar hacia dónde apunta.', def: 'El tamaño de un vector, el largo de su flecha. Se escribe sin flecha: A. Nunca es negativo.',
        ejemplos: ['A⃗ = 3î + 4ĵ mide A = 5.', 'Una fuerza de 10 N hacia abajo tiene módulo 10 N.', 'Caminar 3 m al este y 4 m al norte: el desplazamiento mide 5 m.'], ver: ['vector'] },
      { termino: 'dirección y sentido', formas: ['dirección y sentido', 'dirección', 'sentido', 'sentidos'],
        def: 'La recta sobre la que va un vector, y hacia cuál de sus dos lados apunta.',
        ejemplos: ['Ir al este y volver al oeste: la misma dirección, este-oeste, en sentidos opuestos.', 'Un ascensor que sube y otro que baja: dirección vertical, sentidos contrarios.', 'Dos vectores antiparalelos tienen la misma dirección y sentidos opuestos.'], ver: ['vector'] },
      { termino: 'desplazamiento', simbolo: 'Δx', medida: 'm', simple: 'La flecha de donde saliste a donde llegaste, sin contar el camino.',
        def: 'Cambio de posición: va de donde empezó a donde terminó. En una recta, su signo da el sentido.',
        ejemplos: ['Ir a la tienda y volver a casa: el desplazamiento es 0.', 'Un dron que vuela 300 m hacia el noroeste: 300 m al noroeste.', 'De x = 5 m a x = 2 m: Δx = −3 m, hacia atrás.'], ver: ['distancia recorrida', 'vector'] },
      { termino: 'distancia recorrida', medida: 'm', def: 'Todo el camino hecho, sumando idas y vueltas. Nunca es negativa.',
        ejemplos: ['Ir 4 m y volver 4 m: recorriste 8 m, aunque Δx = 0.', 'Dar una vuelta de 400 m a la pista: 400 m recorridos.', 'Ir 600 m al este y volver 200 m: 800 m recorridos.'], ver: ['desplazamiento'] },
      { termino: 'ley de cosenos', formas: ['ley de cosenos', 'ley del coseno', 'teorema de cosenos'], simple: 'La fórmula que da la suma de dos flechas con cualquier ángulo.',
        def: 'R² = A² + B² + 2AB cos θ, con θ entre A⃗ y B⃗ cola con cola.',
        ejemplos: ['Con 5, 3 y 60°: R² = 25 + 9 + 15 = 49, y R = 7.', 'Con θ = 90°, cos θ = 0 y queda Pitágoras.', 'Con θ = 180°, cos θ = −1 y R = A − B.', 'La del colegio, c² = a² + b² − 2ab cos C, usa C = 180° − θ.'], ver: ['resultante'] },
      { termino: 'resultante', simbolo: 'R⃗', simple: 'La flecha que hace lo mismo que varias juntas.', def: 'Vector que reemplaza a varios: va de la cola del primero a la punta del último. Su módulo es R.',
        ejemplos: ['A = 3 y B = 4 a 90°: R = 5.', 'Dos personas jalan una caja con 30 N cada una, hacia el mismo lado: R = 60 N.', 'Con 30 N y 20 N en sentidos opuestos: R = 10 N.'], ver: ['vector'] },
      { termino: 'componente', simple: 'Lo que una flecha avanza de lado o sube; sus dos «sombras».', def: 'Lo que un vector avanza sobre un eje, con su signo. î y ĵ miden 1 y marcan los ejes.',
        ejemplos: ['A⃗ = 3î + 4ĵ avanza 3 en x y sube 4 en y: sus componentes son 3 y 4.', 'Una flecha de 10 a 37° del eje x tiene componentes 8 y 6.', 'Una flecha que apunta al oeste tiene componente x negativa.'], ver: ['vector unitario', 'módulo'] },
      { termino: 'vector unitario', simbolo: 'û', simple: 'Una flechita de largo 1 que apunta igual que la otra.', formas: ['vector unitario', 'vectores unitarios', 'unitario', 'unitarios'],
        def: 'Flecha de largo 1 que apunta igual que otra; sale de dividirla entre su módulo.',
        ejemplos: ['A⃗ = 6î + 8ĵ: û = 0,6î + 0,8ĵ.', 'î es el unitario del eje x: mide 1 y apunta a la derecha.', 'Una fuerza de 5 N hacia arriba es 5 veces el unitario ĵ.'], ver: ['componente'] },
      { termino: 'producto escalar', simbolo: 'A⃗ · B⃗', simple: 'Un largo por la sombra del otro: da solo un número.', def: 'Número que sale de multiplicar un largo por la sombra del otro: A B cos θ.',
        ejemplos: ['A = 4 y B = 3 a 60°: A⃗ · B⃗ = 6.', 'Dos flechas perpendiculares: A⃗ · B⃗ = 0.', 'Si A⃗ · B⃗ sale negativo, las flechas forman más de 90°.'], ver: ['producto vectorial'] },
      { termino: 'producto vectorial', simbolo: 'A⃗ × B⃗', simple: 'Da una flecha nueva que sale del plano; mide el área que encierran.',
        def: 'Vector perpendicular a los dos; su largo es el área del paralelogramo: |A⃗ × B⃗| = A B sen θ.',
        ejemplos: ['A = 4 y B = 5 a 90°: |A⃗ × B⃗| = 20.', 'Dos flechas paralelas: |A⃗ × B⃗| = 0, no encierran área.', 'î × ĵ = k̂, que sale de la pantalla; ĵ × î = −k̂, que entra.'], ver: ['producto escalar'] },
    ],
    laboratorio: [
      mesaEspacio,
      {
        id: 'suma-libre', titulo: 'Dos flechas sin amarras', pieza: 'flechas',
        consigna: 'Arrastra la punta de A⃗ o la de B⃗, o usa los botones. Busca dos casos con el mismo R y otro ángulo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 5, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0 },
        ],
        dibujo: val => { const c = sumaLibre(val); return { datos: c.datos, estado: c.estado }; },
        lectura: val => [R, ` = ${f(rLibre(val), 2)}: entre `, A, ' − ', B, ` = ${f(Math.abs(val.a - val.b), 0)} y `, A, ' + ', B, ` = ${f(val.a + val.b, 0)}`],
        // Retos: cada uno lo comprueba la misma resultante que se dibuja (colaPunta).
        invitaciones: [
          { texto: 'Haz que R mida lo mismo que A + B.',
            logrado: val => Math.abs(rLibre(val) - (val.a + val.b)) < 1e-9,
            bien: 'Solo a 0° los módulos se suman: las dos flechas apuntan igual.' },
          { texto: 'Consigue que R mida justo 5, sin que A ni B midan 5.',
            logrado: val => Math.abs(rLibre(val) - 5) < 1e-9 && val.a !== 5 && val.b !== 5,
            bien: 'Un triángulo 3, 4, 5 escondido en la suma. ¿Qué ángulo lo arma?' },
          { texto: 'Haz que R sea más corta que A y también que B.',
            logrado: val => rLibre(val) < Math.min(val.a, val.b) - 1e-9,
            bien: 'Sumar flechas puede dar menos que cada una. ¿Desde qué ángulo pasa?' },
          { texto: 'Guarda dos casos con el mismo R y distinto ángulo.',
            logrado: (val, guardados) => guardados.some(x => x.g !== val.g && Math.abs(rLibre(x) - rLibre(val)) < 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Mismo R por dos caminos: los largos compensan lo que cambia el ángulo.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A⃗', color: 'c-o',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(sumaLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a + val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(sumaLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([val.a, 0], q), b: Math.hypot(q[0] - val.a, Math.max(0, q[1])) };
            } },
        ],
      },
      Object.assign({ id: 'componentes', titulo: 'Componentes y unitario', pieza: 'flechas',
        // Retos: el módulo es el mismo Math.hypot que dibuja compA; el unitario, cada componente entre el módulo.
        invitaciones: [
          { texto: 'Consigue que A mida justo 5.',
            logrado: val => Math.abs(modA(val) - 5) < 1e-9,
            bien: 'Con componentes 3 y 4, el módulo es 5: Pitágoras con las sombras de A⃗.' },
          { texto: 'Haz que el unitario apunte hacia abajo y a la izquierda.',
            logrado: val => modA(val) > 0 && val.ax / modA(val) < 0 && val.ay / modA(val) < 0,
            bien: 'El unitario copia los signos de A⃗: apunta igual y mide 1.' },
          { texto: 'Guarda dos A de distinto largo con el mismo unitario.',
            logrado: (val, guardados) => modA(val) > 0 && guardados.some(x => modA(x) > 0 && Math.abs(modA(x) - modA(val)) > 1e-9
              && Math.abs(x.ax / modA(x) - val.ax / modA(val)) < 1e-9 && Math.abs(x.ay / modA(x) - val.ay / modA(val)) < 1e-9)
              && guardados.some(x => x.ax === val.ax && x.ay === val.ay),
            bien: 'Distinto largo, mismo unitario: û solo guarda hacia dónde apunta A.' },
        ] }, componentes.juega),
      {
        id: 'productos-libre', titulo: 'Sombra y área a la vez', pieza: 'flechas',
        consigna: 'Cambia los dos largos y el ángulo. Compara la sombra de B⃗ sobre A⃗ con el área del paralelogramo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        ],
        dibujo: val => prodLibre(val),
        lectura: val => [vA, ' · ', vB, ` = ${f(escalarLibre(val), 2)};   área = ${f(areaLibre(val), 2)}`],
        // Retos: la sombra y el área son las de la figura (A B cos θ y A B sen θ).
        invitaciones: [
          { texto: 'Haz que el producto escalar valga 0.',
            logrado: val => Math.abs(escalarLibre(val)) < 1e-9,
            bien: 'A 90° la sombra desaparece y el área es la mayor. ¿Coincidencia?' },
          { texto: 'Busca el menor ángulo que da un producto escalar negativo.',
            logrado: val => escalarLibre(val) < -1e-9 && escalarLibre(Object.assign({}, val, { g: val.g - 15 })) >= -1e-9,
            bien: 'Pasado 90°, la sombra cae detrás de A: el escalar tiene signo.' },
          { texto: 'Haz que el área sea 0 sin que el escalar sea 0.',
            logrado: val => areaLibre(val) < 1e-9 && Math.abs(escalarLibre(val)) > 1e-9,
            bien: 'Flechas alineadas: no encierran área, pero la sombra es entera.' },
          { texto: 'Guarda dos casos con la misma área y distinto producto escalar.',
            logrado: (val, guardados) => guardados.some(x => Math.abs(areaLibre(x) - areaLibre(val)) < 1e-9 && Math.abs(escalarLibre(x) - escalarLibre(val)) > 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Misma área, otra sombra: cada producto mira el ángulo a su manera.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(prodLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(prodLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([0, 0], q), b: Math.hypot(q[0], Math.max(0, q[1])) };
            } },
        ],
      },
    ],
    laboratorioIdeas: {
      'flechas-espacio': ['componentes', 'productos'],
      'suma-libre': ['resultante'],
      'componentes': ['componentes'],
      'productos-libre': ['productos'],
    },
    // El vector unitario y las componentes van antes de sumar (Gerson, 16 nov).
    ideas: [escalarOVector, componentes, resultante, productos],
  };
});
