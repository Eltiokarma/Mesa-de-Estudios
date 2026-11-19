/*
 * Generador «La combi, la gráfica y el río»: la práctica de las cinco ideas de fisica.movimiento-rectilineo
 * («Movimiento rectilíneo uniforme», contenido/teoria/fisica/movimiento-rectilineo.js). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['fis-mru']) y en Node (require). No usa ningún
 * motor: las cuentas son x = x₀ + v · t, cocientes y sumas de enteros chicos.
 *
 * Propuesta aprobada: docs/etapa4/propuesta-fisica.md §7 (parte A) y docs/etapa4/decisiones.md (Movimiento rectilíneo).
 * Objetos, como en la teoría: la combi y el mototaxi en la avenida con el paradero en x = 0 (A1, A4), la gráfica x–t
 * (A2), la recta de la pista atlética con la valla (A3), la ventana de tu combi y el río en una recta (A5). Valores de
 * problema, sin fuente y posibles (propuesta §8): combi de 8 a 16 m/s (o de 36 a 90 km/h), mototaxi de 4 a 9 m/s,
 * ciclista de 3 a 8 m/s (12 como mucho en «mitades»), corredor de 2 a 7 m/s, pastor de 1,5 a 3 m/s (corre), columna de
 * llamas a 1,5 m/s o menos, bote de 2 a 6 m/s respecto al agua, corriente de 3 m/s o menos,
 * trenes de 10 a 30 m/s; el sonido en el aire a unos 340 m/s (valor de libro, «unos»). Los topes por sujeto están en
 * topes.js, que leen las pruebas de esta práctica, de la teoría y de los tipos de MRU de cinematica-medias y
 * velocidad-relativa (auditoría de MRU, 18 nov, M1 y M2).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los
 * de esa idea; sin idea, las cinco con el mismo peso. La ficha cubre una sola unidad, así que { unidad } no filtra nada.
 *   mru (A1)        donde (1; sub derecha o paradero) dónde está tras t s, con su signo · cuando (1) cuánto tarda en
 *                   llegar a un lugar · combi-kmh (2) dónde está, con v en km/h · ecuacion (2; sub baja o sube) la
 *                   posición x = x₀ + v · t dada como ecuación · trueno (2) a qué distancia cayó el rayo · eco (3; sub
 *                   dos-ecos o bocina) la persona entre dos cerros y la combi que toca la bocina y sigue avanzando ·
 *                   ida-vuelta (3) va, regresa y dónde termina
 *   grafica-xt (A2) pendiente (1; sub sube o baja; con figura) la velocidad de una recta que no sale del cero ·
 *                   inicio (2) dónde estaba a los 0 s · extrapolar (2; sub donde o distancia) la recta cortada que
 *                   sigue, como San Marcos 2024-II (92) · dos-rectas (3) dos velocidades con signo, como San Marcos
 *                   2019-I (107) · ecuacion-recta (3) la ecuación x = x₀ + v · t de una recta · grafica-kmh (3; sub
 *                   kmh o min) la pendiente en otras unidades
 *   desplazamiento-distancia (A3)  valla (1; sub rapidez o velocidad) ida y vuelta en la pista · tramos-tiempo (2) ·
 *                   tramos-distancia (2) · parada (2; sub sigue o regresa) la combi que espera, en km/h · tabla (3;
 *                   sub rapidez o velocidad) la tabla de posiciones, como San Marcos 2021 (80) · mitades (3) mitad del
 *                   camino y mitad del tiempo, como San Marcos 2022 (83) · cerro (3) sube y baja por el mismo camino
 *   encuentro (A4)  frente (1) · alcance (1) · donde-cruzan (2) · alcance-kmh (2) · salio-antes (3) el que salió
 *                   antes, como San Marcos 2021 (83) · trenes (3; sub frente o mismo) se cruzan por completo ·
 *                   dos-veces (3) la segunda vez que están a cierta separación
 *   velocidad-relativa (A5) carril (1) la otra combi del mismo lado, vista desde tu ventana · rio (1; sub abajo o
 *                   arriba) río abajo, lo que rema el bote a partir de lo que se ve desde la orilla; río arriba, lo que se
 *                   ve desde la orilla · frente-kmh (2) la combi que viene de frente, en km/h · tramo-rio (2) un tramo
 *                   río arriba · ventaja-kmh (2) ·
 *                   dos-viajes (2; sub corriente o bote) · ida-vuelta-rio (3; sub bote o columna) el bote que sube y
 *                   vuelve y el pastor en la columna de llamas · placas (3; sub frente o mismo) placas tectónicas
 *                   respecto a una tercera, como San Marcos 2020-I (105) · adelanto (3) tu combi pasa a otra
 *
 * Letras (propuesta §5 y cabecera de la unidad): x la posición con signo desde el paradero (o la partida), x₀ la
 * posición en t = 0, Δx el desplazamiento, d la distancia recorrida, v la velocidad con signo («rapidez» sin signo), vₘ
 * la velocidad media, t el tiempo, D la separación, L un largo. SIN MAGNITUDES VECTORIALES: en una recta v y Δx son
 * números con signo, sin flecha. Los móviles se nombran con palabras (la combi, el mototaxi, tu combi), nunca con A y B,
 * que son las letras de las alternativas (salvo las placas, que el examen nombra así). Subíndices con Unicode (x₀, vₘ,
 * x₁, t₂), que también se leen en el papel.
 * Colores: un color fijo por magnitud, el de la unidad (tabla `colores` de la teoría; docs/molde-unidad.md §5b):
 * velocidad y rapidez naranja (v, o), tiempo turquesa (t, i), posición, desplazamiento, separación y largo violeta (x,
 * dx, D, L; f). La distancia recorrida va en tinta (sin ficha), y lo que se pide se escribe en palabras sin color hasta
 * la solución, donde la respuesta lleva el color de su magnitud. Sin carmín (no hay aceleración) ni verde. En la figura,
 * la recta x–t y sus posiciones en violeta, los tiempos en turquesa y los ejes en tinta.
 * Datos (docs/plan-calidad.md §3, punto 13): la fórmula general de cada tipo (x = x₀ + v · t, la pendiente, las medias,
 * la regla de la velocidad relativa), el eje con su signo y las equivalencias; nunca el paso hecho, el atajo («de frente
 * se suman») ni la respuesta.
 * Errores: los códigos de la unidad. De la idea A1 (cabecera de la teoría, hipótesis): MRU-X0, MRU-SIGNO, MRU-CONTEO,
 * MRU-SUMA, MRU-ECUACION, U1-kmh y U1-inversa. De A2 a A5 (sección «MRU (18 nov)» del informe de cinemática): G2-*
 * (Beichner 1994: documentados G2-altura-entre-tiempo y G2-pendiente-es-altura; G2-ultimo-punto, hipótesis), XT-*,
 * DX-*, MED-*, K1 (parcial), VR-* y REL-*; los demás, hipótesis. Nuevos aquí, hipótesis anotadas en la sección «Práctica
 * de MRU (fis-mru, 18 nov)» del mismo informe: MRU-ECO-MITAD, MRU-ECO-DOBLE, MRU-ECO-SIN-MITAD, MRU-ECO-UNO,
 * MRU-ECO-RESTA, MRU-ECO-QUIETO, MRU-ECO-ESCUCHA, MRU-IDA, MRU-RESTA-V, XT-PRIMER-PUNTO, XT-POSICION, XT-CAMBIA,
 * DX-VUELTA-ENTERA, DX-SUMA-POSICIONES, MED-SIN-PARADA, VR-PROMEDIO, ENC-OTRO, ENC-MITAD, ENC-UN-LARGO, ENC-PRIMERA,
 * ENC-CRUCE, ENC-SOLO-S, MRU-ECO-MEDIO, REL-SIN-MITAD, REL-CRUZA, REL-UN-LARGO; y U6-min, U2-km y U2-cm (códigos U del informe transversal). De
 * todos los errores de un problema van 3 o 4, elegidos para que la correcta no quede en el centro ni en un extremo
 * (elegirErrores). Cada explicación empieza por lo que el alumno hizo bien y muestra lo que da su error; ninguna nombra
 * una alternativa por su letra.
 * La práctica no repite ninguna Predice de la unidad (Ejercicios se abre sin pasar por ella): ni la combi en x = 80 m
 * que va al paradero a 12 m/s por 5 s, ni la recta por (2 s; 26 m) y (5 s; 38 m), ni los 60 m a 2 y 6 m/s, ni el
 * mototaxi 60 m delante a 6 m/s con la combi a 10 m/s, ni el bote a 5 m/s río abajo en un río de 2 m/s.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'fis-mru';
  const UNIDAD = 'fisica.movimiento-rectilineo';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const TRV = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TEO = 'contenido/teoria/fisica/movimiento-rectilineo.js';
  const v = P.v;
  // Coma decimal, «−» de verdad y miles con espacio que no se parte («1 020 m» no queda en dos renglones).
  const f = x => P.formatear(x, 2).replace(/ /g, ' ');
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && Math.abs(x) < 1e6;
  const entero = x => limpio(x, 0);
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  // Formatos de las alternativas: todas con la misma unidad.
  const M = x => `${f(x)} m`, S = x => `${f(x)} s`, MS = x => `${f(x)} m/s`, KMH = x => `${f(x)} km/h`, POS = x => `x = ${f(x)} m`;

  // ---- Variables: un color fijo por magnitud (tabla `colores` de la unidad) ----
  const VARS = {
    v: { nombre: 'velocidad', color: 'o' }, t: { nombre: 'tiempo', color: 'i' }, x: { nombre: 'posición', color: 'f' },
    dx: { nombre: 'desplazamiento', color: 'f' }, D: { nombre: 'separación', color: 'f' }, L: { nombre: 'largo', color: 'f' },
  };
  const Tv = s => v('v', s), Tt = s => v('t', s), Tx = s => v('x', s), Tdx = s => v('dx', s), TD = s => v('D', s), TL = s => v('L', s);

  // ---- Errores: el respaldo sale del código ----
  const A1 = ['MRU-X0', 'MRU-SIGNO', 'MRU-CONTEO', 'MRU-SUMA', 'MRU-ECUACION'];
  function respaldo(id) {
    if (id === 'G2-altura-entre-tiempo' || id === 'G2-pendiente-es-altura') return ['documentado', CIN];
    if (id === 'K1') return ['parcial', CIN];
    if (/^U\d/.test(id)) return ['hipotesis', TRV];
    if (A1.includes(id)) return ['hipotesis', TEO];
    return ['hipotesis', CIN];
  }
  // Un error: su código, su valor y la explicación, que recibe el texto de la alternativa (lo que da el error).
  const E = (id, valor, ex) => ({ id, valor, ex });

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    pos: 'Posición con velocidad constante: x = x₀ + v · t',
    eje: 'El paradero está en x = 0; + hacia la derecha y − hacia la izquierda.',
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    min: '1 min = 60 s',
    hora: '1 h = 60 min',
    sonido: 'Rapidez del sonido en el aire: unos 340 m/s.',
    eco: 'Eco: el sonido que se oye después de rebotar en el cerro.',   // sin el paso («va y vuelve»: auditoría de MRU, B3)
    luz: 'La luz del rayo llega casi de inmediato.',
    recorre: 'Lo que recorre algo con rapidez constante: rapidez · tiempo.',
    xt: 'Velocidad en la gráfica x–t: v = (x₂ − x₁)/(t₂ − t₁)',
    ejes: 'En la gráfica, x va en metros y t en segundos.',
    ejesKm: 'En la gráfica, x va en kilómetros y t en minutos.',
    distancia: 'Distancia recorrida: todo el camino, sin signo.',   // la definición; «sin vuelta, es lo que avanzó» era el paso (B3)
    vm: 'Velocidad media: vₘ = Δx/Δt, con Δx = posición final − posición inicial',
    rm: 'Rapidez media = d/Δt, con d la distancia recorrida: todo el camino, sin signo',
    tramo: 'Tiempo de un tramo con rapidez constante: distancia ÷ rapidez.',
    dtramo: 'Distancia de un tramo con rapidez constante: rapidez · tiempo.',
    partida: 'La partida está en x = 0; + hacia la valla.',
    encuentro: 'Dos móviles se encuentran cuando están en la misma posición en el mismo instante.',
    separacion: 'Separación: la distancia entre los dos, sin signo.',
    completo: 'Se cruzan por completo cuando la cola de uno deja atrás la cola del otro.',
    rel: 'Velocidad de un móvil vista desde otro: la suya menos la del que mira, cada una con su signo.',
    carretera: 'En la carretera, + hacia la derecha y − hacia la izquierda.',
    orilla: 'Velocidad desde la orilla = velocidad respecto al agua + velocidad del agua, con su signo.',
    rio: 'Río abajo es el sentido +; la corriente va río abajo.',
    // Una letra, un significado (cabos de la Etapa 4, 19 nov): u y c son velocidades con signo, como en la regla de la
    // idea 5 (v = u + c). En los dos viajes, río arriba el bote va con −u; antes la solución escribía «u − c», con u de rapidez.
    uc: 'u: velocidad del bote respecto al agua, río abajo; río arriba, remando igual, es −u. c: velocidad de la corriente.',
    suelo: 'Las rapideces de la columna y del pastor se miden desde el suelo.',
    placas: 'Este es el sentido +; oeste, el −.',
    cm: '1 m = 100 cm',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    mru: ['donde', 'cuando', 'combi-kmh', 'ecuacion', 'trueno', 'eco', 'ida-vuelta'],
    'grafica-xt': ['pendiente', 'inicio', 'extrapolar', 'dos-rectas', 'ecuacion-recta', 'grafica-kmh'],
    'desplazamiento-distancia': ['valla', 'tramos-tiempo', 'tramos-distancia', 'parada', 'tabla', 'mitades', 'cerro'],
    encuentro: ['frente', 'alcance', 'donde-cruzan', 'alcance-kmh', 'salio-antes', 'trenes', 'dos-veces'],
    'velocidad-relativa': ['carril', 'rio', 'frente-kmh', 'tramo-rio', 'ventaja-kmh', 'dos-viajes', 'ida-vuelta-rio', 'placas', 'adelanto'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    donde: 1, cuando: 1, 'combi-kmh': 2, ecuacion: 2, trueno: 2, eco: 3, 'ida-vuelta': 3,
    pendiente: 1, inicio: 2, extrapolar: 2, 'dos-rectas': 3, 'ecuacion-recta': 3, 'grafica-kmh': 3,
    valla: 1, 'tramos-tiempo': 2, 'tramos-distancia': 2, parada: 2, tabla: 3, mitades: 3, cerro: 3,
    frente: 1, alcance: 1, 'donde-cruzan': 2, 'alcance-kmh': 2, 'salio-antes': 3, trenes: 3, 'dos-veces': 3,
    carril: 1, rio: 1, 'frente-kmh': 2, 'tramo-rio': 2, 'ventaja-kmh': 2, 'dos-viajes': 2, 'ida-vuelta-rio': 3, placas: 3, adelanto: 3,
  };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las cinco ideas, de menos a más, sin figura, con dos preguntas de nivel examen al final.
  const PAPEL = { 'papel-1': ['donde', 'paradero'], 'papel-2': ['frente'], 'papel-3': ['valla', 'rapidez'],
    'papel-4': ['extrapolar', 'distancia'], 'papel-5': ['tramo-rio'], 'papel-6': ['alcance-kmh'],
    'papel-7': ['mitades'], 'papel-8': ['eco', 'bocina'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo, sub0;
    if (forzado) [tipo, sub0] = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 2000; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub0);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Qué errores van (como en productos-notables): si todos cambian una sola pieza de la correcta, la correcta queda en
  // el centro y se adivina sin resolver (probarFugas, nucleo/probar-generador.js). De todos los errores posibles se
  // eligen 4 (o 3) con los que la correcta no es la más parecida a las demás ni, si es un número, la mayor o la menor.
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  function elegirErrores(rng, correcta, errores, numero) {
    const vistos = new Set([correcta.texto]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub], sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      if (numero) { const vs = al.map(a => a.valor); if (correcta.valor === Math.max(...vs) || correcta.valor === Math.min(...vs)) return false; }
      return true;
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return null;
  }

  // Ningún número de dos cifras o más de la respuesta aparece en los datos (ni su texto).
  const numeros = t => [...String(t).replace(/ /g, '').matchAll(/\d+(?:,\d+)?/g)].map(m => m[0]).filter(n => n.replace(',', '').length >= 2);
  function datosLimpios(datos, texto) {
    const todo = datos.join('\n');
    if (todo.includes(texto)) return false;
    return numeros(texto).every(n => !new RegExp(`(?<![\\d,])${n.replace(',', '\\,')}(?![\\d,])`).test(todo));
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta, textoCorrecta;
    if (typeof o.correcta === 'string') {
      const errores = o.errores.filter(x => x && x.texto).map(x => {
        const [r, fu] = respaldo(x.id);
        return { id: x.id, clave: x.texto, texto: x.texto, explicacion: x.ex(x.texto), respaldo: r, fuente: fu };
      });
      const elegidos = elegirErrores(rng, { texto: o.correcta }, errores, false);
      if (!elegidos) return null;
      alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: elegidos, rng });
      respuesta = { valor: o.correcta, texto: o.correcta, unidad: '' };
      textoCorrecta = o.correcta;
    } else {
      if (!limpio(o.correcta) || o.correcta === 0) return null;
      const fmt = o.fmt;
      const validos = o.errores.filter(x => x && limpio(x.valor) && (o.negativos || x.valor > 0) && fmt(x.valor) !== fmt(o.correcta)
        && ((x.valor === 0 && o.negativos) || P.enEscala(x.valor, o.correcta, x.id))).map(x => {
        const [r, fu] = respaldo(x.id);
        return { id: x.id, valor: x.valor, texto: fmt(x.valor), explicacion: x.ex(fmt(x.valor)), respaldo: r, fuente: fu };
      });
      const elegidos = elegirErrores(rng, { texto: fmt(o.correcta), valor: o.correcta }, validos, true);
      if (!elegidos) return null;
      alternativas = P.armar({ correcta: o.correcta, errores: elegidos, rng, texto: fmt, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
      textoCorrecta = fmt(o.correcta);
    }
    if (alternativas.length < 4) return null;
    if (!datosLimpios(o.datos, textoCorrecta)) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    const p = {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
    if (o.figura) p.figura = o.figura;
    return p;
  }

  // Vehículos de la avenida, con rapideces posibles (m/s).
  const VEHICULOS = [['Una combi', 'la combi', 8, 15], ['Un mototaxi', 'el mototaxi', 4, 9], ['Un ciclista', 'el ciclista', 3, 7]];
  const LUGARES = ['El grifo', 'El mercado', 'El colegio', 'La posta'];

  // ======================= A1: velocidad constante, el MRU =======================

  function donde(rng, forzado) {
    const sub = forzado || rng.elegir(['derecha', 'paradero']);
    const [Veh, veh, lo, hi] = rng.elegir(VEHICULOS), t = rng.entero(3, 9);
    if (sub === 'derecha') {
      const x0 = 10 * rng.entero(-4, 6), vv = rng.entero(lo, hi), x = x0 + vv * t;
      if (x0 === 0) return null;
      return {
        enunciado: [`${Veh} pasa por `, Tx(`x₀ = ${f(x0)} m`), ' hacia la derecha a ', Tv(`${vv} m/s`), ', sin cambiar de velocidad.'],
        pregunta: ['¿Dónde está ', Tt(`${t} s`), ' después?'],
        datos: [D.pos, D.eje], correcta: x, fmt: POS, negativos: true,
        errores: [
          E('MRU-X0', vv * t, T => `Bien: avanza ${vv} · ${t} = ${f(vv * t)} m. Pero no salió del paradero, sino de ${f(x0)} m; sin esa salida queda ${T}.`),
          E('MRU-SIGNO', x0 - vv * t, T => `Bien que multipliques ${vv} por ${t}. Pero va hacia la derecha, el lado +: su posición sube; restar da ${T}.`),
          E('MRU-CONTEO', x0 + vv * (t + 1), T => `Bien la salida y la velocidad. Pero en t = 0 todavía no avanzó: contar ${t + 1} segundos da ${T}.`),
          E('MRU-SUMA', x0 + vv + t, T => `Bien que partas de ${f(x0)} m. Pero en cada segundo avanza ${vv} m: v se multiplica por t; sumar los datos da ${T}.`),
          E('MRU-ECUACION', (x0 + vv) * t, T => `Bien la regla x = x₀ + v · t. Pero t multiplica solo a v; multiplicar también x₀ da ${T}.`),
        ],
        solucion: [
          ['Sale de ', Tx(`x₀ = ${f(x0)} m`), ` y suma ${vv} m en cada segundo, hacia el lado +.`],
          ['x = ', Tx(par(x0)), ' + ', Tv(vv), ' · ', Tt(t), ' = ', Tx(M(x)), '.'],
        ],
        _datos: { sub, x0, v: vv, t },
      };
    }
    const x0 = 10 * rng.entero(6, 15), r = rng.entero(lo, hi), x = x0 - r * t;
    if (x0 === 80 && r === 12) return null;   // la combi de la predicción de la idea 1
    return {
      enunciado: [`${Veh} está en `, Tx(`x₀ = ${f(x0)} m`), ' y va hacia el paradero a ', Tv(`${r} m/s`), ', sin cambiar de velocidad.'],
      pregunta: ['¿Dónde está ', Tt(`${t} s`), ' después?'],
      datos: [D.pos, D.eje], correcta: x, fmt: POS, negativos: true,
      errores: [
        E('MRU-SIGNO', x0 + r * t, T => `Bien que avance ${r} m en cada segundo. Pero va hacia el paradero, el lado −: su posición baja; sumar da ${T}.`),
        E('MRU-X0', r * t, T => `Bien: se mueve ${r} · ${t} = ${f(r * t)} m. Pero eso es lo que se movió, no dónde está: ${T} olvida que salió de ${f(x0)} m.`),
        E('MRU-CONTEO', x0 - r * (t + 1), T => `Bien que su posición baje. Pero en t = 0 todavía no se movió: contar ${t + 1} segundos da ${T}.`),
        E('MRU-SUMA', x0 - r - t, T => `Bien que partas de ${f(x0)} m. Pero en cada segundo se mueve ${r} m: v se multiplica por t; restar los datos da ${T}.`),
        E('MRU-ECUACION', (x0 - r) * t, T => `Bien la regla x = x₀ + v · t, con v negativa. Pero t multiplica solo a v; multiplicar también x₀ da ${T}.`),
      ],
      solucion: [
        ['Va hacia el paradero, el lado −: su velocidad es ', Tv(`v = ${f(-r)} m/s`), '.'],
        ['x = ', Tx(f(x0)), ' + ', Tv(par(-r)), ' · ', Tt(t), ' = ', Tx(M(x)), x < 0 ? ': ya pasó el paradero.' : '.'],
      ],
      _datos: { sub, x0, v: -r, t },
    };
  }

  function cuando(rng) {
    const [Veh, , lo, hi] = rng.elegir(VEHICULOS), x0 = 10 * rng.entero(1, 5), vv = rng.entero(lo, hi), t = rng.entero(3, 15);
    const X = x0 + vv * t, Lugar = rng.elegir(LUGARES);
    return {
      enunciado: [`${Veh} sale de `, Tx(`x₀ = ${x0} m`), ' hacia la derecha a ', Tv(`${vv} m/s`), `, sin cambiar de velocidad. ${Lugar} está en `, Tx(`x = ${f(X)} m`), '.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda en llegar?'],
      datos: [D.pos, D.eje], correcta: t, fmt: S,
      errores: [
        E('MRU-X0', X / vv, T => `Bien que dividas entre ${vv} m/s. Pero no sale del paradero: le faltan ${f(X)} − ${x0} m, no ${f(X)} m; así salen ${T}.`),
        E('MRU-SIGNO', (X + x0) / vv, T => `Bien dividir entre la velocidad. Pero ya está en ${x0} m: lo que falta es ${f(X)} − ${x0}; sumar da ${T}.`),
        E('MRU-CONTEO', t + 1, T => `Bien que le falten ${f(X - x0)} m. Pero ${f(X - x0)} ÷ ${vv} ya es el tiempo: el instante t = 0 no se cuenta; ${T} es un segundo de más.`),
        E('MRU-ECUACION', X / (x0 + vv), T => `Bien la regla x = x₀ + v · t. Pero t multiplica solo a v; dividir entre ${x0} + ${vv} da ${T}.`),
      ],
      solucion: [
        ['Le faltan ', Tx(f(X)), ' − ', Tx(x0), ` = ${f(X - x0)} m, y avanza ${vv} m en cada segundo.`],
        ['t = ', `${f(X - x0)} ÷ `, Tv(vv), ' = ', Tt(S(t)), '.'],
      ],
      _datos: { x0, v: vv, X },
    };
  }

  function combiKmh(rng) {
    const kmh = rng.elegir([36, 54, 72, 90]), ms = kmh / 3.6, x0 = 10 * rng.entero(0, 4), t = rng.entero(4, 12), x = x0 + ms * t;
    if (kmh === 54 && x0 === 0 && t === 8) return null;   // el ejemplo de la idea 1
    return {
      enunciado: ['Una combi pasa por ', Tx(`x₀ = ${x0} m`), ' a ', Tv(`${kmh} km/h`), ' hacia la derecha y no cambia de velocidad.'],
      pregunta: ['¿Dónde está ', Tt(`${t} s`), ' después?'],
      datos: [D.pos, D.kmh, D.eje], correcta: x, fmt: POS,
      errores: [
        E('U1-kmh', x0 + kmh * t, T => `Bien la regla x = x₀ + v · t. Pero ${kmh} km/h no son ${kmh} m/s: sin pasar a m/s queda ${T}.`),
        E('U1-inversa', x0 + kmh * 3.6 * t, T => `Bien que conviertas antes de multiplicar. Pero de km/h a m/s se divide entre 3,6; multiplicar da ${T}.`),
        E('MRU-CONTEO', x0 + ms * (t + 1), T => `Bien los ${f(ms)} m/s. Pero en t = 0 todavía no avanzó: contar ${t + 1} segundos da ${T}.`),
        x0 > 0 && E('MRU-X0', ms * t, T => `Bien los ${f(ms)} m/s y lo que avanza. Pero salió de ${x0} m: sin esa salida queda ${T}.`),
        E('MRU-ECUACION', (x0 + ms) * t, T => `Bien los ${f(ms)} m/s. Pero t multiplica solo a v; multiplicar también x₀ da ${T}.`),
      ],
      solucion: [
        [Tv(`${kmh} km/h`), ` = ${kmh} · 1000 m ÷ 3600 s = `, Tv(`${f(ms)} m/s`), '.'],
        ['x = ', Tx(x0), ' + ', Tv(f(ms)), ' · ', Tt(t), ' = ', Tx(M(x)), '.'],
      ],
      _datos: { kmh, x0, t },
    };
  }

  function ecuacion(rng, forzado) {
    const sub = forzado || rng.elegir(['baja', 'sube']);
    const A = 10 * rng.entero(2, 9), B = rng.entero(3, 9), t = rng.entero(3, 9);
    const x0 = sub === 'baja' ? A : -A, vv = sub === 'baja' ? -B : B, x = x0 + vv * t;
    const eq = sub === 'baja' ? [Tx(A), ' − ', Tv(B), Tt('t')] : [Tx(`−${A}`), ' + ', Tv(B), Tt('t')];
    return {
      enunciado: ['La posición de un mototaxi en la avenida es ', Tx('x'), ' = ', ...eq, ', con x en metros y t en segundos.'],
      pregunta: ['¿Dónde está a los ', Tt(`${t} s`), '?'],
      datos: [D.pos, D.eje], correcta: x, fmt: POS, negativos: true,
      errores: [
        E('MRU-SIGNO', x0 - vv * t, T => `Bien que multipliques ${B} por ${t}. Pero la ecuación ${sub === 'baja' ? 'resta' : 'suma'} ese término: cambiarle el signo da ${T}.`),
        E('MRU-ECUACION', (x0 + vv) * t, T => `Bien reemplazar t = ${t}. Pero t multiplica solo al ${B}; el ${f(x0)} es la salida, x₀, y no cambia: así queda ${T}.`),
        E('MRU-X0', vv * t, T => `Bien: se mueve ${f(vv * t)} m. Pero salió de ${f(x0)} m: sin esa salida queda ${T}.`),
        E('MRU-CONTEO', x0 + vv * (t + 1), T => `Bien la ecuación. Pero se reemplaza t = ${t}, no ${t + 1}: así queda ${T}.`),
      ],
      solucion: [
        ['Es x = x₀ + v · t con ', Tx(`x₀ = ${f(x0)} m`), ' y ', Tv(`v = ${f(vv)} m/s`), '.'],
        ['x = ', Tx(f(x0)), ' + ', Tv(par(vv)), ' · ', Tt(t), ' = ', Tx(M(x)), '.'],
      ],
      _datos: { sub, x0, v: vv, t },
    };
  }

  function trueno(rng) {
    const t = rng.entero(2, 6), Dd = 340 * t;
    if (t === 4) return null;   // el ejemplo de la idea 1
    return {
      enunciado: ['En una tormenta ves un rayo y oyes su trueno ', Tt(`${t} s`), ' después.'],
      pregunta: ['¿A qué distancia de ti cayó el rayo?'],
      datos: [D.sonido, D.luz, D.recorre], correcta: Dd, fmt: M,
      errores: [
        E('MRU-ECO-MITAD', 170 * t, T => `Bien la rapidez del sonido. Pero el trueno no rebota: viene una sola vez del rayo hasta ti; dividir entre 2 da ${T}.`),
        E('MRU-ECO-DOBLE', 680 * t, T => `Bien 340 · ${t}. Pero el sonido viaja una sola vez, del rayo a ti; contar ida y vuelta da ${T}.`),
        E('MRU-SUMA', 340 + t, T => `Bien usar los 340 m/s. Pero en cada segundo el sonido avanza 340 m: se multiplica por el tiempo; sumar da ${T}.`),
        E('MRU-CONTEO', 340 * (t - 1), T => `Bien la rapidez del sonido. Pero la luz llega casi al instante: el trueno viajó los ${t} s enteros; con ${t - 1} s salen ${T}.`),
      ],
      solucion: [
        ['La luz llega casi de inmediato: el trueno viaja los ', Tt(`${t} s`), ' a unos ', Tv('340 m/s'), '.'],
        ['D = ', Tv(340), ' · ', Tt(t), ' = ', TD(M(Dd)), '.'],
      ],
      _datos: { t },
    };
  }

  function eco(rng, forzado) {
    const sub = forzado || rng.elegir(['dos-ecos', 'bocina']);
    if (sub === 'dos-ecos') {
      const t1 = rng.entero(1, 4), t2 = t1 + rng.entero(1, 4), Dd = 170 * (t1 + t2);
      return {
        enunciado: ['Una alumna está entre dos cerros, en una quebrada recta. Grita una vez: oye un eco a los ', Tt(`${t1} s`), ' y otro a los ', Tt(`${t2} s`), '.'],
        pregunta: ['¿Qué distancia separa a los dos cerros?'],
        datos: [D.sonido, D.eco, D.recorre], correcta: Dd, fmt: M,
        errores: [
          E('MRU-ECO-SIN-MITAD', 340 * (t1 + t2), T => `Bien sumar lo que viaja el sonido hasta cada cerro. Pero cada eco es ida y vuelta: sin dividir entre 2 salen ${T}.`),
          E('MRU-ECO-UNO', 170 * t2, T => `Bien: el cerro lejano está a 340 · ${t2} ÷ 2 = ${f(170 * t2)} m. Pero falta el cercano, al otro lado; ${T} es solo una distancia.`),
          E('MRU-ECO-RESTA', 170 * (t2 - t1), T => `Bien dividir cada eco entre 2. Pero los cerros están a los dos lados de la alumna: las distancias se suman; restar da ${T}.`),
          E('MRU-ECO-UNO', 170 * t1, T => `Bien: el cerro cercano está a 340 · ${t1} ÷ 2 = ${f(170 * t1)} m. Pero falta el lejano, al otro lado; ${T} es solo una distancia.`),
        ],
        solucion: [
          ['Cada eco va y vuelve: el cerro cercano está a ', Tv(340), ' · ', Tt(t1), ` ÷ 2 = ${f(170 * t1)} m y el lejano, a `, Tv(340), ' · ', Tt(t2), ` ÷ 2 = ${f(170 * t2)} m.`],
          ['Están a los dos lados: ', `${f(170 * t1)} + ${f(170 * t2)} = `, TD(M(Dd)), '.'],
        ],
        _datos: { sub, t1, t2 },
      };
    }
    const vv = rng.elegir([10, 15, 20]), T = rng.entero(2, 6), Dd = (340 + vv) * T / 2;
    if (!entero(Dd)) return null;
    return {
      enunciado: ['Una combi va hacia un cerro a ', Tv(`${vv} m/s`), ', por una carretera recta y sin frenar. Toca la bocina y oye el eco ', Tt(`${T} s`), ' después.'],
      pregunta: ['¿A qué distancia del cerro estaba cuando tocó la bocina?'],
      datos: [D.sonido, D.eco, D.recorre], correcta: Dd, fmt: M,
      errores: [
        E('MRU-ECO-QUIETO', 170 * T, T2 => `Bien que el sonido vaya y vuelva. Pero la combi también avanza ${vv} · ${T} = ${vv * T} m hacia el cerro; sin eso salen ${T2}.`),
        E('MRU-ECO-ESCUCHA', (340 - vv) * T / 2, T2 => `Bien que el sonido y la combi se muevan a la vez. Pero ${T2} es donde estaba al oír el eco, no al tocar la bocina.`),
        E('MRU-ECO-SIN-MITAD', (340 + vv) * T, T2 => `Bien sumar lo que avanzan el sonido y la combi. Pero entre los dos recorren dos veces la distancia pedida; sin dividir entre 2 salen ${T2}.`),
        E('MRU-ECO-MEDIO', 170 * T + vv * T, T2 => `Bien la mitad del camino del sonido, ${f(170 * T)} m. Pero lo que avanzó la combi también se reparte entre la ida y la vuelta; sumarlo entero da ${T2}.`),
      ],
      solucion: [
        ['En ', Tt(`${T} s`), ', el sonido recorre ', Tv(340), ' · ', Tt(T), ` = ${f(340 * T)} m y la combi, `, Tv(vv), ' · ', Tt(T), ` = ${vv * T} m.`],
        ['Entre los dos recorren dos veces la distancia D: ', `D = (${f(340 * T)} + ${vv * T}) ÷ 2 = `, TD(M(Dd)), '.'],
      ],
      _datos: { sub, v: vv, T },
    };
  }

  function idaVuelta(rng) {
    const t1 = rng.entero(5, 15), v1 = rng.entero(8, 15), t2 = rng.entero(3, 12), v2 = rng.entero(5, 12), x = v1 * t1 - v2 * t2;
    if (x === 0 || v1 === v2) return null;
    return {
      enunciado: ['Una combi sale del paradero y va ', Tt(`${t1} s`), ' hacia la derecha a ', Tv(`${v1} m/s`), '. Después regresa ', Tt(`${t2} s`), ' a ', Tv(`${v2} m/s`), '.'],
      pregunta: ['¿Dónde termina?'],
      datos: [D.pos, D.eje], correcta: x, fmt: POS, negativos: true,
      errores: [
        E('MRU-SIGNO', v1 * t1 + v2 * t2, T => `Bien lo que recorre en cada tramo, ${v1 * t1} m y ${v2 * t2} m. Pero al regresar va hacia el lado −: se resta; sumar da ${T}.`),
        E('MRU-IDA', v1 * t1, T => `Bien la ida, ${v1} · ${t1} = ${v1 * t1} m. Pero después regresa ${v2 * t2} m; ${T} es donde estaba antes de volver.`),
        E('MRU-RESTA-V', (v1 - v2) * (t1 + t2), T => `Bien que la vuelta reste. Pero cada velocidad dura su propio tiempo: ${v1} · ${t1} y ${v2} · ${t2}; mezclarlas da ${T}.`),
        E('MRU-CONTEO', v1 * t1 - v2 * (t2 + 1), T => `Bien la ida y que la vuelta reste. Pero regresa ${t2} s, no ${t2 + 1}; así queda ${T}.`),
      ],
      solucion: [
        ['Ida: ', Tx('x'), ' = 0 + ', Tv(v1), ' · ', Tt(t1), ` = ${v1 * t1} m. La vuelta, hacia el lado −, empieza ahí.`],
        ['x = ', Tx(v1 * t1), ' + ', Tv(par(-v2)), ' · ', Tt(t2), ' = ', Tx(M(x)), '.'],
      ],
      _datos: { t1, v1, t2, v2 },
    };
  }

  // ======================= A2: la gráfica posición–tiempo =======================

  // Figura de una recta x–t (pendiente): ejes en tinta, la recta y las posiciones en violeta, los tiempos en turquesa.
  // Los rótulos van sobre los ejes (los tiempos debajo, las posiciones a la izquierda), con líneas punteadas hasta cada
  // punto. Devuelve null si dos rótulos quedarían demasiado juntos.
  const xml = P.xml;
  function figuraXT(pts, tmax) {
    const W = 320, H = 220, x0p = 48, x1p = 300, y0p = 176, y1p = 28;
    const xs = pts.map(p => p[1]), m = (pts[1][1] - pts[0][1]) / (pts[1][0] - pts[0][0]), b = pts[0][1] - m * pts[0][0];
    const enT = t => b + m * t, ys = [...xs, enT(0), enT(tmax), 0];
    const lo = Math.min(...ys), hi = Math.max(...ys), span = hi - lo || 1;
    const X = t => x0p + (t / tmax) * (x1p - x0p), Y = x => y0p - ((x - lo) / span) * (y0p - y1p);
    const r = n => Math.round(n * 10) / 10;
    // Rótulos de posición a la izquierda del eje, separados al menos 16 px entre sí y del cero.
    const yl = [...xs.map(Y), Y(0)].sort((a, c) => a - c);
    for (let i = 1; i < yl.length; i++) if (yl[i] - yl[i - 1] < 16) return null;
    const t0 = r(X(0)), y0 = r(Y(0));
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13">`;
    s += `<line x1="${x0p}" y1="${r(Y(lo))}" x2="${x0p}" y2="${y1p - 6}" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<line x1="${x0p}" y1="${y0}" x2="${x1p + 8}" y2="${y0}" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<text x="${x1p + 8}" y="${y0 + 32}" text-anchor="end" fill="currentColor">t (s)</text>`;
    s += `<text x="${x0p - 6}" y="${y1p - 10}" text-anchor="end" fill="currentColor">x (m)</text>`;
    s += `<text x="${x0p - 8}" y="${y0 + 4}" text-anchor="end" fill="currentColor">0</text>`;
    s += `<line x1="${t0}" y1="${r(Y(enT(0)))}" x2="${r(X(tmax))}" y2="${r(Y(enT(tmax)))}" stroke="var(--c-f)" stroke-width="3" stroke-linecap="round"/>`;
    for (const [t, x] of pts) {
      const px = r(X(t)), py = r(Y(x));
      s += `<line x1="${px}" y1="${py}" x2="${px}" y2="${y0}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>`;
      s += `<line x1="${x0p}" y1="${py}" x2="${px}" y2="${py}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>`;
      s += `<circle cx="${px}" cy="${py}" r="4.5" fill="var(--c-f)"/>`;
      s += `<text x="${px}" y="${r(y0 + 16)}" text-anchor="middle" fill="var(--c-i)">${xml(f(t))}</text>`;
      s += `<text x="${x0p - 8}" y="${r(py + 4)}" text-anchor="end" fill="var(--c-f)">${xml(f(x))}</text>`;
    }
    s += '</svg>';
    const [[ta, xa], [tb, xb]] = pts;
    return { svg: s, alt: `Gráfica x–t: una recta que pasa por (${f(ta)} s; ${f(xa)} m) y por (${f(tb)} s; ${f(xb)} m).` };
  }

  function pendiente(rng, forzado) {
    const sub = forzado || rng.elegir(['sube', 'baja']);
    const t1 = rng.entero(1, 3), dt = rng.entero(2, 5), t2 = t1 + dt, vv = (sub === 'sube' ? 1 : -1) * rng.entero(2, 9);
    const x1 = sub === 'sube' ? 5 * rng.entero(2, 8) : 5 * rng.entero(10, 18), x2 = x1 + vv * dt;
    if (x1 === vv * t1 || x2 <= 0) return null;   // la recta nunca sale del cero: así se ve el error G2
    if (t1 === 2 && x1 === 26 && t2 === 5) return null;   // la predicción de la idea 2
    const figura = figuraXT([[t1, x1], [t2, x2]], t2 + 2);
    if (!figura) return null;
    const errores = sub === 'sube' ? [
      E('G2-altura-entre-tiempo', x1 / t1, T => `Bien que dividas posición entre tiempo. Pero ${x1} ÷ ${t1} supone que la recta sale del cero, y no sale; así da ${T}.`),
      E('G2-ultimo-punto', x2 / t2, T => `Bien leer los dos ejes. Pero ${f(x2)} ÷ ${t2} supone que la recta sale del cero; la velocidad es lo que sube entre los dos puntos, no ${T}.`),
      E('G2-pendiente-es-altura', x2, T => `Bien leer el punto (${t2} s; ${f(x2)} m). Pero ${f(x2)} m es su altura, una posición; la velocidad es lo que sube por segundo, no ${T}.`),
      E('XT-SIN-DIVIDIR', x2 - x1, T => `Bien: la recta sube ${f(x2 - x1)} m. Pero lo hace en ${dt} s; sin dividir entre el tiempo queda ${T}.`),
      E('XT-INVERSA', dt / (x2 - x1), T => `Bien usar los dos cambios, ${f(x2 - x1)} m y ${dt} s. Pero va el cambio de x entre el de t, no al revés: ${T}.`),
    ] : [
      E('XT-SIGNO', -vv, T => `Bien la cuenta, ${f(Math.abs(x2 - x1))} ÷ ${dt}. Pero la recta baja: x disminuye y la velocidad es negativa, no ${T}.`),
      E('G2-ultimo-punto', x2 / t2, T => `Bien leer los dos ejes. Pero ${f(x2)} ÷ ${t2} divide una posición entre su tiempo; se usa el cambio entre los dos puntos, no ${T}.`),
      E('XT-SIN-DIVIDIR', x2 - x1, T => `Bien: x cambia ${f(x2 - x1)} m, con su signo. Pero en ${dt} s; sin dividir entre el tiempo queda ${T}.`),
      E('XT-INVERSA', dt / (x2 - x1), T => `Bien usar los dos cambios con su signo. Pero va el cambio de x entre el de t, no al revés: ${T}.`),
      E('G2-altura-entre-tiempo', x1 / t1, T => `Bien leer el primer punto. Pero ${x1} ÷ ${t1} supone que la recta sale del cero; así da ${T}.`),
    ];
    return {
      enunciado: ['La gráfica x–t de un mototaxi es una recta que pasa por (', Tt(`${t1} s`), '; ', Tx(`${f(x1)} m`), ') y por (', Tt(`${t2} s`), '; ', Tx(`${f(x2)} m`), ').'],
      pregunta: ['¿Qué velocidad lleva, con su signo?'],
      datos: [D.xt, D.ejes], correcta: vv, fmt: MS, negativos: true, errores, figura,
      solucion: [
        ['Entre los dos puntos, x cambia ', Tx(f(x2)), ' − ', Tx(f(x1)), ` = ${f(x2 - x1)} m en `, Tt(t2), ' − ', Tt(t1), ` = ${dt} s.`],
        ['v = ', `${f(x2 - x1)} ÷ ${dt} = `, Tv(MS(vv)), sub === 'baja' ? ': la recta baja, va hacia el lado −.' : '.'],
      ],
      _datos: { sub, t1, x1, t2, x2 },
    };
  }

  function inicio(rng) {
    const t1 = rng.entero(1, 4), dt = rng.entero(2, 5), vv = (rng.moneda() ? 1 : -1) * rng.entero(2, 8), x0 = 5 * rng.entero(-4, 14);
    const x1 = x0 + vv * t1, x2 = x1 + vv * dt, t2 = t1 + dt;
    if (x0 === 0 || x1 <= 0 || x2 <= 0) return null;
    return {
      enunciado: ['La gráfica x–t de una combi es una recta que pasa por (', Tt(`${t1} s`), '; ', Tx(`${f(x1)} m`), ') y por (', Tt(`${t2} s`), '; ', Tx(`${f(x2)} m`), ').'],
      pregunta: ['¿Dónde estaba a los 0 s?'],
      datos: [D.xt, D.pos], correcta: x0, fmt: POS, negativos: true,
      errores: [
        E('XT-PRIMER-PUNTO', x1, T => `Bien leer el primer punto de la recta. Pero ese es el instante ${t1} s, no el 0 s; ${T} es dónde estaba a los ${t1} s.`),
        E('MRU-SIGNO', x1 + vv * t1, T => `Bien la velocidad, ${f(vv)} m/s. Pero para volver al instante 0 se deshace lo avanzado: x₀ = x₁ − v · t₁; sumar da ${T}.`),
        E('G2-altura-entre-tiempo', 0, T => `Bien la idea de volver hasta t = 0. Pero la recta no tiene por qué salir del cero: ${T} solo valdría si saliera de ahí.`),
        E('XT-SIN-DIVIDIR', x1 - (x2 - x1) * t1, T => `Bien volver desde el primer punto. Pero la velocidad es ${f(x2 - x1)} ÷ ${dt} = ${f(vv)} m/s, no ${f(x2 - x1)}; con eso queda ${T}.`),
      ],
      solucion: [
        ['Velocidad: ', Tv('v'), ' = (', Tx(f(x2)), ' − ', Tx(f(x1)), ') ÷ (', Tt(t2), ' − ', Tt(t1), ') = ', Tv(MS(vv)), '.'],
        ['De x = x₀ + v · t en el primer punto: ', Tx(f(x1)), ' = x₀ + ', Tv(par(vv)), ' · ', Tt(t1), ', así que ', Tx(`x₀ = ${f(x0)} m`), '.'],
      ],
      _datos: { t1, x1, t2, x2 },
    };
  }

  function extrapolar(rng, forzado) {
    const sub = forzado || rng.elegir(['donde', 'distancia']);
    const x0 = 10 * rng.entero(1, 4), vv = rng.entero(2, 6), t1 = rng.entero(3, 5), T = t1 + rng.entero(3, 6), x1 = x0 + vv * t1;
    const enunciado = ['La gráfica x–t de un mototaxi es una recta de (0 s; ', Tx(`${x0} m`), ') a (', Tt(`${t1} s`), '; ', Tx(`${x1} m`), '), y ahí se corta.'];
    if (sub === 'donde') {
      const xf = x0 + vv * T;
      return {
        enunciado, pregunta: ['Si sigue igual, ¿dónde estará a los ', Tt(`${T} s`), '?'],
        datos: [D.xt, D.pos], correcta: xf, fmt: POS,
        errores: [
          E('XT-LEIDO', x1, T2 => `Bien leer el último punto dibujado. Pero el mototaxi sigue avanzando después de los ${t1} s; ${T2} es dónde estaba entonces.`),
          E('MRU-X0', vv * T, T2 => `Bien: en ${T} s avanza ${vv} · ${T} = ${vv * T} m. Pero salió de ${x0} m; sin esa salida queda ${T2}.`),
          E('G2-altura-entre-tiempo', x1 / t1 * T, T2 => `Bien seguir la recta hasta los ${T} s. Pero ${x1} ÷ ${t1} supone que sale del cero, y sale de ${x0} m; así queda ${T2}.`),
          E('MRU-CONTEO', x0 + vv * (T + 1), T2 => `Bien la pendiente y la salida. Pero se reemplaza t = ${T}, no ${T + 1}; así queda ${T2}.`),
        ],
        solucion: [
          ['Pendiente: ', Tv('v'), ' = (', Tx(x1), ' − ', Tx(x0), ') ÷ ', Tt(t1), ' = ', Tv(MS(vv)), '. Sale de ', Tx(`${x0} m`), '.'],
          ['x = ', Tx(x0), ' + ', Tv(vv), ' · ', Tt(T), ' = ', Tx(M(xf)), '.'],
        ],
        _datos: { sub, x0, t1, x1, T },
      };
    }
    const d = vv * T;
    return {
      enunciado, pregunta: ['Si sigue igual, ¿qué distancia recorre en los primeros ', Tt(`${T} s`), '?'],
      datos: [D.xt, D.distancia], correcta: d, fmt: M,
      errores: [
        E('XT-LEIDO', x1, T2 => `Bien leer el último punto dibujado. Pero es una posición, y la recta sigue después de los ${t1} s; ${T2} no es lo recorrido.`),
        E('XT-POSICION', x0 + d, T2 => `Bien seguir la recta hasta los ${T} s: ahí está en ${f(x0 + d)} m. Pero salió de ${x0} m; ${T2} es la posición, no lo recorrido.`),
        E('G2-altura-entre-tiempo', x1 / t1 * T, T2 => `Bien multiplicar la velocidad por ${T} s. Pero ${x1} ÷ ${t1} supone que la recta sale del cero; así salen ${T2}.`),
        E('XT-SIN-DIVIDIR', (x1 - x0) * T, T2 => `Bien que la recta suba ${x1 - x0} m en ${t1} s. Pero la velocidad es ${x1 - x0} ÷ ${t1} m/s; usar ${x1 - x0} como velocidad da ${T2}.`),
      ],
      solucion: [
        ['Pendiente: ', Tv('v'), ' = (', Tx(x1), ' − ', Tx(x0), ') ÷ ', Tt(t1), ' = ', Tv(MS(vv)), '.'],
        ['Sin vuelta, recorre lo que avanza: ', Tv(vv), ' · ', Tt(T), ` = ${M(d)}.`],
      ],
      _datos: { sub, x0, t1, x1, T },
    };
  }

  // «Combi: 8 m/s; mototaxi: −6 m/s»
  const dosV = (a, b) => `Combi: ${f(a)} m/s; mototaxi: ${f(b)} m/s`;
  function dosRectas(rng) {
    const T = rng.entero(4, 8), vA = rng.entero(4, 10), vB = -rng.entero(2, 6), Dd = 10 * rng.entero(6, 12);
    const a = vA * T, b = Dd + vB * T;
    if (b < 0 || a === Dd) return null;
    return {
      enunciado: ['En una gráfica x–t, la recta de la combi va de (0 s; 0 m) a (', Tt(`${T} s`), '; ', Tx(`${a} m`), ') y la del mototaxi, de (0 s; ', Tx(`${Dd} m`), ') a (', Tt(`${T} s`), '; ', Tx(`${b} m`), ').'],
      pregunta: ['¿Qué velocidades llevan, con su signo?'],
      datos: [D.xt, D.ejes], correcta: dosV(vA, vB),
      errores: [
        { id: 'XT-SIGNO', texto: dosV(vA, -vB), ex: t => `Bien las dos pendientes en valor. Pero la recta del mototaxi baja: su x disminuye y su velocidad es negativa; «${t}» no lo dice.` },
        { id: 'XT-SIGNO', texto: dosV(-vA, -vB), ex: t => `Bien las dos cuentas. Pero la recta de la combi sube y la del mototaxi baja: «${t}» tiene los signos al revés.` },
        entero(b / T) && b > 0 && { id: 'G2-altura-entre-tiempo', texto: dosV(vA, b / T), ex: t => `Bien la combi, que sale del cero. Pero la recta del mototaxi sale de ${Dd} m: ${b} ÷ ${T} no es su pendiente; «${t}» no es.` },
        { id: 'G2-pendiente-es-altura', texto: dosV(a, b), ex: t => `Bien leer dónde termina cada recta, ${a} m y ${b} m. Pero esas son posiciones; la velocidad es lo que sube o baja cada segundo, no «${t}».` },
        { id: 'XT-SIN-DIVIDIR', texto: dosV(a, b - Dd), ex: t => `Bien lo que cambia la x de cada uno, con su signo. Pero en ${T} s: falta dividir entre el tiempo; «${t}» no es.` },
      ],
      solucion: [
        ['Combi: ', Tv('v'), ' = (', Tx(a), ' − 0) ÷ ', Tt(T), ' = ', Tv(MS(vA)), '.'],
        ['Mototaxi: ', Tv('v'), ' = (', Tx(b), ' − ', Tx(Dd), ') ÷ ', Tt(T), ' = ', Tv(MS(vB)), ': su recta baja.'],
      ],
      _datos: { T, a, Dd, b },
    };
  }

  // «x = −20 + 10t», «x = 60 − 8t»
  const ecRecta = (x0, vv) => `x = ${f(x0)} ${vv < 0 ? '−' : '+'} ${Math.abs(vv) === 1 ? '' : f(Math.abs(vv))}t`;
  function ecuacionRecta(rng) {
    const x0 = 10 * rng.entero(-4, 6), vv = (rng.moneda() ? 1 : -1) * rng.entero(2, 12), t1 = rng.entero(2, 6), x1 = x0 + vv * t1;
    if (x0 === 0 || x1 === 0) return null;
    return {
      enunciado: ['La gráfica x–t de una combi es una recta que pasa por (0 s; ', Tx(`${f(x0)} m`), ') y por (', Tt(`${t1} s`), '; ', Tx(`${f(x1)} m`), ').'],
      pregunta: ['¿Cuál es su ecuación de posición, con x en metros y t en segundos?'],
      datos: [D.xt, D.pos], correcta: ecRecta(x0, vv),
      errores: [
        { id: 'XT-SIN-DIVIDIR', texto: ecRecta(x0, x1 - x0), ex: T => `Bien la salida, ${f(x0)} m. Pero x cambia ${f(x1 - x0)} m en ${t1} s: falta dividir entre el tiempo; ${T} no es.` },
        entero(x1 / t1) && { id: 'G2-ultimo-punto', texto: ecRecta(x0, x1 / t1), ex: T => `Bien la salida, ${f(x0)} m. Pero ${f(x1)} ÷ ${t1} supone que la recta sale del cero; ${T} no es.` },
        { id: 'XT-CAMBIA', texto: ecRecta(vv, x0), ex: T => `Bien los dos números, ${f(x0)} y ${f(vv)}. Pero x₀ va solo y v acompaña a t: ${T} los cambia de lugar.` },
        { id: 'XT-PRIMER-PUNTO', texto: ecRecta(x1, vv), ex: T => `Bien la pendiente, ${f(vv)} m/s. Pero x₀ es donde corta en t = 0, ${f(x0)} m, no el otro punto; ${T} no es.` },
        { id: 'MRU-SIGNO', texto: ecRecta(x0, -vv), ex: T => `Bien la salida y el tamaño de la pendiente. Pero la recta ${vv > 0 ? 'sube' : 'baja'}: v es ${vv > 0 ? 'positiva' : 'negativa'}; ${T} no es.` },
      ],
      solucion: [
        ['Corta el eje en t = 0 en ', Tx(`x₀ = ${f(x0)} m`), '. Pendiente: ', Tv('v'), ' = (', Tx(f(x1)), ' − ', Tx(par(x0)), ') ÷ ', Tt(t1), ' = ', Tv(MS(vv)), '.'],
        ['x = x₀ + v · t: ', Tx(ecRecta(x0, vv)), '.'],
      ],
      _datos: { x0, t1, x1 },
    };
  }

  function graficaKmh(rng, forzado) {
    const sub = forzado || rng.elegir(['kmh', 'min']);
    if (sub === 'kmh') {
      const vv = rng.elegir([5, 9, 10, 15, 18, 20, 25]), T = rng.entero(4, 20), X = vv * T, kmh = vv * 3.6;
      if (vv === 15 && T === 20) return null;   // el ejemplo de la idea 2
      return {
        enunciado: ['La gráfica x–t de un vehículo es una recta que sale de (0 s; 0 m) y pasa por (', Tt(`${T} s`), '; ', Tx(`${f(X)} m`), ').'],
        pregunta: ['¿Cuál es su velocidad, en km/h?'],
        datos: [D.xt, D.kmh], correcta: kmh, fmt: KMH,
        errores: [
          E('U1-kmh', vv, T2 => `Bien la pendiente, ${f(X)} ÷ ${T} = ${vv}. Pero eso está en m/s; como km/h, ${T2} es otra velocidad.`),
          E('U1-inversa', vv / 3.6, T2 => `Bien la pendiente, ${vv} m/s, y que conviertas. Pero de m/s a km/h se multiplica por 3,6; dividir da ${T2}.`),
          E('G2-pendiente-es-altura', X * 3.6, T2 => `Bien pasar a km/h multiplicando por 3,6. Pero ${f(X)} m es la altura del punto, una posición; la velocidad es lo que sube por segundo, no ${T2}.`),
          E('G2-pendiente-es-altura', X, T2 => `Bien leer el punto (${T} s; ${f(X)} m). Pero ${f(X)} m es su altura, una posición; la velocidad es lo que sube por segundo, no ${T2}.`),
          E('XT-INVERSA', T / X * 3.6, T2 => `Bien multiplicar por 3,6 para pasar a km/h. Pero va la x entre la t, ${f(X)} ÷ ${T}, no al revés; así salen ${T2}.`),
        ],
        solucion: [
          ['Pendiente: ', Tv('v'), ' = ', Tx(f(X)), ' ÷ ', Tt(T), ' = ', Tv(MS(vv)), '.'],
          ['En km/h: ', Tv(vv), ' · 3600 ÷ 1000 = ', Tv(KMH(kmh)), '.'],
        ],
        _datos: { sub, T, X },
      };
    }
    const vv = rng.elegir([5, 10, 12.5, 15, 20, 25]), n = rng.entero(2, 12), k = vv * 60 * n / 1000;
    if (!limpio(k, 1)) return null;
    if (vv === 10 && n === 10) return null;   // el ejemplo de la idea 2
    return {
      enunciado: ['La gráfica x–t de una combi es una recta que sale de (0 min; 0 km) y pasa por (', Tt(`${n} min`), '; ', Tx(`${f(k)} km`), ').'],
      pregunta: ['¿Cuál es su velocidad, en m/s?'],
      datos: [D.xt, D.ejesKm, D.kmh, D.min], correcta: vv, fmt: MS,
      errores: [
        E('U6-min', k * 1000 / n, T2 => `Bien pasar los kilómetros a metros, ${f(k * 1000)} m. Pero los ${n} min no son ${n} s: sin pasarlos a segundos salen ${T2}.`),
        E('U2-km', k / (60 * n), T2 => `Bien pasar los minutos a segundos, ${60 * n} s. Pero ${f(k)} km son ${f(k * 1000)} m: sin pasarlos salen ${T2}.`),
        E('U1-kmh', k / n * 60, T2 => `Bien la pendiente y pasar a horas. Pero eso da km/h; en m/s, ${T2} es otra velocidad.`),
        E('XT-INVERSA', 60 * n / (k * 1000), T2 => `Bien pasar todo a metros y segundos. Pero va la x entre la t, no al revés; así salen ${T2}.`),
      ],
      solucion: [
        ['En metros y segundos: ', Tx(`${f(k)} km = ${f(k * 1000)} m`), ' y ', Tt(`${n} min = ${60 * n} s`), '.'],
        ['Pendiente: ', Tv('v'), ` = ${f(k * 1000)} ÷ ${60 * n} = `, Tv(MS(vv)), '.'],
      ],
      _datos: { sub, n, k },
    };
  }

  // ======================= A3: velocidad media y rapidez media =======================

  function valla(rng, forzado) {
    const sub = forzado || rng.elegir(['rapidez', 'velocidad']);
    const s1 = rng.entero(2, 6), t1 = rng.entero(5, 20), L = s1 * t1, s2 = rng.entero(s1 + 1, 8), t2 = rng.entero(2, Math.floor(L / s2)), L2 = s2 * t2;
    if (L > 100 || L2 > L || (sub === 'velocidad' && L2 === L)) return null;
    if (L === 60 && L2 === 60) return null;   // la predicción de la idea 3
    const T = t1 + t2;
    const enunciado = ['En la pista corres ', `${L} m`, ' hasta la valla en ', Tt(`${t1} s`), ' y vuelves ', `${L2} m`, ' por el mismo carril en ', Tt(`${t2} s`), '.'];
    if (sub === 'rapidez') {
      const rm = (L + L2) / T;
      return {
        enunciado, pregunta: ['¿Cuál es tu rapidez media en todo el paseo?'],
        datos: [D.rm, D.vm], correcta: rm, fmt: MS,
        errores: [
          E('DX-RAPIDEZ', (L - L2) / T, T2 => `Bien el tiempo total, ${T} s. Pero ${T2} usa el desplazamiento, ${L - L2} m; la rapidez media suma todo el camino, ${L + L2} m.`),
          E('DX-IDA', L / T, T2 => `Bien el tiempo total, ${T} s. Pero también recorriste la vuelta, ${L2} m; con solo la ida salen ${T2}.`),
          E('MED-UN-TIEMPO', (L + L2) / t1, T2 => `Bien todo el camino, ${L + L2} m. Pero el tiempo es el de todo el paseo, ${T} s, no solo el de la ida; así salen ${T2}.`),
          E('MED-PROMEDIO', (s1 + s2) / 2, T2 => `Bien la rapidez de cada tramo, ${s1} y ${s2} m/s. Pero los tramos no duran lo mismo: promediarlos da ${T2}.`),
          E('DX-VUELTA-ENTERA', 2 * L / T, T2 => `Bien sumar la ida y la vuelta. Pero volviste ${L2} m, no los ${L} m enteros; así salen ${T2}.`),
        ],
        solucion: [
          ['Camino recorrido: d = ', `${L} + ${L2} = ${L + L2} m`, '. Tiempo: ', Tt(t1), ' + ', Tt(t2), ' = ', Tt(`${T} s`), '.'],
          ['Rapidez media = ', `${L + L2} ÷ `, Tt(T), ' = ', Tv(MS(rm)), '.'],
        ],
        _datos: { sub, L, t1, L2, t2 },
      };
    }
    const vm = (L - L2) / T;
    return {
      enunciado, pregunta: ['¿Cuál es tu velocidad media en todo el paseo?'],
      datos: [D.vm, D.rm, D.partida], correcta: vm, fmt: MS, negativos: true,
      errores: [
        E('DX-DISTANCIA', (L + L2) / T, T2 => `Bien el tiempo total, ${T} s. Pero ${T2} usa todo el camino; la velocidad media usa el desplazamiento: quedaste a ${L - L2} m de la partida.`),
        E('DX-IDA', L / T, T2 => `Bien el tiempo total. Pero volviste ${L2} m: el desplazamiento es ${L} − ${L2}, no ${L} m; así salen ${T2}.`),
        E('MED-UN-TIEMPO', (L - L2) / t1, T2 => `Bien el desplazamiento, ${L - L2} m. Pero el tiempo es el de todo el paseo, ${T} s; así salen ${T2}.`),
        E('MED-PROMEDIO', (s1 - s2) / 2, T2 => `Bien que la vuelta vaya con signo −. Pero los tramos no duran lo mismo: promediar ${s1} y −${s2} m/s da ${T2}.`),
      ],
      solucion: [
        ['Terminas en ', Tx(`x = ${L} − ${L2} = ${L - L2} m`), ': ese es tu desplazamiento, ', Tdx(`Δx = ${L - L2} m`), ', en ', Tt(`${T} s`), '.'],
        ['vₘ = ', Tdx(L - L2), ' ÷ ', Tt(T), ' = ', Tv(MS(vm)), '.'],
      ],
      _datos: { sub, L, t1, L2, t2 },
    };
  }

  const CORREN = [['Un ciclista', 3, 8], ['Una combi', 8, 16], ['Un mototaxi', 4, 9]];
  function tramosTiempo(rng) {
    const [Quien, lo, hi] = rng.elegir(CORREN), v1 = rng.entero(lo, hi), v2 = rng.entero(lo, hi), t1 = 10 * rng.entero(2, 6), t2 = rng.elegir([10, 15, 25, 35, 45]);
    if (v1 === v2 || t1 === t2) return null;
    const rm = (v1 * t1 + v2 * t2) / (t1 + t2);
    return {
      enunciado: [`${Quien} va `, Tt(`${t1} s`), ' a ', Tv(`${v1} m/s`), ' y después ', Tt(`${t2} s`), ' a ', Tv(`${v2} m/s`), ', siempre hacia el mismo lado.'],
      pregunta: ['¿Cuál es su rapidez media en todo el viaje?'],
      datos: [D.rm, D.dtramo], correcta: rm, fmt: MS,
      errores: [
        E('MED-PROMEDIO', (v1 + v2) / 2, T => `Bien usar las dos rapideces. Pero el promedio solo vale si los dos tramos duran lo mismo, y aquí no: así sale ${T}.`),
        E('MED-SUMA', v1 + v2, T => `Bien juntar los dos tramos. Pero sumar las rapideces da ${T}, más de lo que llevó en cualquier momento.`),
        E('MED-CRUZADO', (v1 * t2 + v2 * t1) / (t1 + t2), T => `Bien todo el camino entre todo el tiempo. Pero cada rapidez va con su tiempo: ${v1} · ${t1} y ${v2} · ${t2}; cruzarlos da ${T}.`),
        E('MED-TRAMO', v2, T => `Bien que la rapidez media esté entre las dos. Pero ${T} es la del último tramo; falta juntar los dos.`),
        E('MED-UN-TIEMPO', (v1 * t1 + v2 * t2) / t1, T => `Bien todo el camino, ${v1 * t1 + v2 * t2} m. Pero el tiempo es ${t1} + ${t2} s; con uno solo salen ${T}.`),
      ],
      solucion: [
        ['Camino: ', Tv(v1), ' · ', Tt(t1), ' + ', Tv(v2), ' · ', Tt(t2), ` = ${v1 * t1} + ${v2 * t2} = ${v1 * t1 + v2 * t2} m.`],
        ['Rapidez media = ', `${v1 * t1 + v2 * t2} ÷ `, Tt(t1 + t2), ' = ', Tv(MS(rm)), '.'],
      ],
      _datos: { v1, t1, v2, t2 },
    };
  }

  function tramosDistancia(rng) {
    const [Quien, lo, hi] = rng.elegir(CORREN), v1 = rng.entero(lo, hi), v2 = rng.entero(lo, hi), t1 = rng.entero(10, 40), t2 = rng.entero(10, 40);
    const d1 = v1 * t1, d2 = v2 * t2, rm = (d1 + d2) / (t1 + t2);
    if (v1 === v2 || d1 % 10 || d2 % 10) return null;
    return {
      enunciado: [`${Quien} recorre `, `${d1} m`, ' a ', Tv(`${v1} m/s`), ' y después ', `${d2} m`, ' a ', Tv(`${v2} m/s`), ', siempre hacia el mismo lado.'],
      pregunta: ['¿Cuál es su rapidez media en todo el viaje?'],
      datos: [D.rm, D.tramo], correcta: rm, fmt: MS,
      errores: [
        E('MED-PROMEDIO', (v1 + v2) / 2, T => `Bien usar las dos rapideces. Pero los tramos no duran lo mismo: ${t1} s y ${t2} s; promediar da ${T}.`),
        E('MED-SUMA', v1 + v2, T => `Bien juntar los dos tramos. Pero sumar las rapideces da ${T}, más de lo que llevó en cualquier momento.`),
        E('MED-CRUZADO', (d1 + d2) / (d1 / v2 + d2 / v1), T => `Bien todo el camino, ${d1 + d2} m. Pero cada tramo se divide entre su propia rapidez; cruzarlas da ${T}.`),
        E('MED-TRAMO', v2, T => `Bien que la rapidez media esté entre las dos. Pero ${T} es la del último tramo; falta juntar los dos.`),
        E('MED-UN-TIEMPO', (d1 + d2) / t1, T => `Bien todo el camino, ${d1 + d2} m. Pero el tiempo es el de los dos tramos, ${t1 + t2} s; así salen ${T}.`),
      ],
      solucion: [
        ['Tiempos: ', `${d1} ÷ `, Tv(v1), ' = ', Tt(`${t1} s`), ' y ', `${d2} ÷ `, Tv(v2), ' = ', Tt(`${t2} s`), '.'],
        ['Rapidez media = ', `${d1 + d2} ÷ `, Tt(t1 + t2), ' = ', Tv(MS(rm)), '.'],
      ],
      _datos: { d1, v1, d2, v2 },
    };
  }

  function parada(rng, forzado) {
    const sub = forzado || rng.elegir(['sigue', 'regresa']);
    const m1 = rng.elegir([6, 10, 12, 15, 20]), d1 = rng.entero(2, 8), p = rng.elegir([3, 5, 6, 10]);
    const m2 = rng.elegir([6, 10, 12, 15, 20, 30]), d2 = sub === 'regresa' ? d1 : rng.entero(2, 8), T = m1 + p + m2;
    const v1 = d1 / (m1 / 60), v2 = d2 / (m2 / 60);
    if (v1 > 72 || v2 > 72 || v1 < 12 || v2 < 12) return null;   // una combi en la ciudad: de 12 a 72 km/h
    const rm = (d1 + d2) / (T / 60);
    if (!limpio(rm) || !limpio(T / 60)) return null;
    if (sub === 'regresa' && d1 === 3 && m1 === 10 && p === 5 && m2 === 15) return null;   // el ejemplo de la idea 3
    const enunciado = sub === 'regresa'
      ? ['Una combi va ', `${d1} km`, ' del paradero al mercado en ', Tt(`${m1} min`), ', espera ', Tt(`${p} min`), ' y regresa al paradero en ', Tt(`${m2} min`), '.']
      : ['Una combi va ', `${d1} km`, ' en ', Tt(`${m1} min`), ', espera ', Tt(`${p} min`), ' en un paradero y sigue ', `${d2} km`, ' hacia el mismo lado en ', Tt(`${m2} min`), '.'];
    return {
      enunciado, pregunta: ['¿Cuál es su rapidez media en todo el viaje, en km/h?'],
      datos: [D.rm, D.hora], correcta: rm, fmt: KMH,
      errores: [
        E('MED-SIN-PARADA', (d1 + d2) / ((m1 + m2) / 60), T2 => `Bien todo el camino, ${d1 + d2} km. Pero el tiempo de la espera también cuenta: son ${T} min; sin él salen ${T2}.`),
        E('U6-min', (d1 + d2) / T, T2 => `Bien todo el camino entre todo el tiempo. Pero ${T} min no son ${T} h: sin pasar a horas sale ${T2}.`),
        E('MED-PROMEDIO', (v1 + v2) / 2, T2 => `Bien la rapidez de cada tramo, ${f(v1)} y ${f(v2)} km/h. Pero no duran lo mismo y falta la espera: promediar da ${T2}.`),
        sub === 'regresa'
          ? E('DX-IDA', d1 / (T / 60), T2 => `Bien el tiempo total, ${T} min. Pero también recorrió la vuelta, ${d2} km; con solo la ida salen ${T2}.`)
          : E('MED-TRAMO', v2, T2 => `Bien que la rapidez media esté cerca de las de los tramos. Pero ${T2} es la del último tramo; falta juntar todo el viaje.`),
      ],
      solucion: [
        ['Camino: ', `${d1} + ${d2} = ${d1 + d2} km`, '. Tiempo, con la espera: ', Tt(m1), ' + ', Tt(p), ' + ', Tt(m2), ' = ', Tt(`${T} min = ${f(T / 60)} h`), '.'],
        ['Rapidez media = ', `${d1 + d2} ÷ `, Tt(f(T / 60)), ' = ', Tv(KMH(rm)), '.'],
      ],
      _datos: { sub, d1, m1, p, d2, m2 },
    };
  }

  function tabla(rng, forzado) {
    const sub = forzado || rng.elegir(['rapidez', 'velocidad']);
    const dt = rng.elegir([2, 3, 4, 5]), a = 2 * rng.entero(3, 8), q = 2 * rng.entero(2, 6), r = 2 * rng.entero(2, 6), s = 2 * rng.entero(2, 6);
    const xs = [0, a, a + q, a + q - r, a + q - r - s], T = 4 * dt, b = a + q, e = xs[4];
    if (e <= 0) return null;
    if (dt === 2 && xs.join() === '0,12,24,16,8') return null;   // el ejemplo de la idea 3
    const d = 2 * b - e;
    const enunciado = ['Un mototaxi va y vuelve por una avenida recta, con velocidad constante entre lectura y lectura. Cada ', Tt(`${dt} s`), ', desde t = 0, su posición es ',
      ...xs.flatMap((x, i) => [Tx(i === 4 ? `${x} m` : String(x)), i < 3 ? ', ' : i === 3 ? ' y ' : '']), '.'];
    const sumaPos = xs.reduce((u, w) => u + w, 0) / T;
    if (sub === 'rapidez') {
      return {
        enunciado, pregunta: ['¿Cuál es su rapidez media en todo el recorrido?'],
        datos: [D.rm, D.vm], correcta: d / T, fmt: MS,
        errores: [
          E('DX-RAPIDEZ', e / T, T2 => `Bien el tiempo total, ${T} s. Pero ${T2} usa el desplazamiento, ${e} m; la rapidez media usa todo el camino, ida y vuelta.`),
          E('DX-IDA', b / T, T2 => `Bien la ida hasta ${b} m y el tiempo total. Pero también recorrió ${b - e} m de vuelta; sin ellos salen ${T2}.`),
          E('DX-SUMA-POSICIONES', sumaPos, T2 => `Bien el tiempo total, ${T} s. Pero sumar las posiciones no da el camino: se suman los tramos, ${a}, ${q}, ${r} y ${s} m; así salen ${T2}.`),
          E('MED-TRAMO', s / dt, T2 => `Bien la rapidez del último intervalo, ${s} ÷ ${dt}. Pero se pide la de todo el recorrido; ${T2} es solo un tramo.`),
        ],
        solucion: [
          ['Camino: va hasta ', Tx(`${b} m`), ` y vuelve hasta ${e} m: d = ${b} + ${b - e} = ${d} m, en `, Tt(`4 · ${dt} = ${T} s`), '.'],
          ['Rapidez media = ', `${d} ÷ `, Tt(T), ' = ', Tv(MS(d / T)), '.'],
        ],
        _datos: { sub, dt, xs },
      };
    }
    return {
      enunciado, pregunta: ['¿Cuál es su velocidad media en todo el recorrido?'],
      datos: [D.vm, D.rm], correcta: e / T, fmt: MS, negativos: true,
      errores: [
        E('DX-DISTANCIA', d / T, T2 => `Bien el tiempo total, ${T} s. Pero ${T2} usa todo el camino; la velocidad media usa el desplazamiento: de 0 a ${e} m.`),
        E('DX-IDA', b / T, T2 => `Bien el tiempo total. Pero ${b} m es la posición más lejana, no la final: terminó en ${e} m; así salen ${T2}.`),
        E('DX-SUMA-POSICIONES', sumaPos, T2 => `Bien el tiempo total, ${T} s. Pero el desplazamiento es la posición final menos la inicial, no la suma de las posiciones; así salen ${T2}.`),
        E('MED-TRAMO', -s / dt, T2 => `Bien la velocidad del último intervalo, con su signo. Pero se pide la de todo el recorrido; ${T2} es solo un tramo.`),
      ],
      solucion: [
        ['Desplazamiento: ', Tdx(`Δx = ${e} − 0 = ${e} m`), ', en ', Tt(`4 · ${dt} = ${T} s`), '.'],
        ['vₘ = ', Tdx(e), ' ÷ ', Tt(T), ' = ', Tv(MS(e / T)), '.'],
      ],
      _datos: { sub, dt, xs },
    };
  }

  function mitades(rng) {
    // Un ciclista va a 12 m/s como mucho (unos 43 km/h; auditoría de MRU, 18 nov, M1; tabla de topes.js).
    const v1 = rng.entero(2, 8), v2 = rng.entero(3, 12), v3 = rng.entero(3, 12), w = (v2 + v3) / 2, vm = 2 * v1 * w / (v1 + w);
    if (v2 === v3 || !limpio(vm, 1) || v1 === w) return null;
    if (v1 === 3 && w === 6) return null;   // el ejemplo de la idea 3 (3 m/s; del resto, 4 y 8 m/s)
    return {
      enunciado: ['Un ciclista hace la mitad de su recorrido a ', Tv(`${v1} m/s`), '. Del resto, la mitad del tiempo va a ', Tv(`${v2} m/s`), ' y la otra mitad del tiempo, a ', Tv(`${v3} m/s`), '.'],
      pregunta: ['¿Cuál es su rapidez media en todo el recorrido?'],
      datos: [D.rm, D.tramo, D.dtramo], correcta: vm, fmt: MS,
      errores: [
        E('MED-PROMEDIO', (v1 + v2 + v3) / 3, T => `Bien usar las tres rapideces. Pero no duran lo mismo: promediarlas da ${T}.`),
        E('MED-PROMEDIO-MITADES', (v1 + w) / 2, T => `Bien la segunda mitad: con dos tiempos iguales va a ${f(w)} m/s. Pero las dos mitades del camino no duran lo mismo: promediarlas da ${T}.`),
        E('MED-TRAMO', w, T => `Bien: en la segunda mitad va, en promedio, a ${f(w)} m/s. Pero ${T} es solo esa mitad; falta la primera.`),
        E('MED-SUMA', v1 + w, T => `Bien la rapidez de cada mitad, ${v1} y ${f(w)} m/s. Pero sumarlas da ${T}, más de lo que llevó en cualquier momento.`),
        E('MED-TRAMO', v1, T => `Bien que la primera mitad pese más si dura más. Pero ${T} es solo la rapidez de esa mitad; falta la segunda.`),
      ],
      solucion: [
        ['Segunda mitad: dos tiempos iguales, así que va a (', Tv(v2), ' + ', Tv(v3), `) ÷ 2 = ${f(w)} m/s.`],
        ['Si cada mitad mide 1, los tiempos son 1/', Tv(v1), ` y 1/${f(w)}: rapidez media = 2 ÷ (1/${v1} + 1/${f(w)}) = `, Tv(MS(vm)), '.'],
      ],
      _datos: { v1, v2, v3 },
    };
  }

  function cerro(rng) {
    const v1 = rng.entero(2, 5), v2 = rng.entero(v1 + 1, 12), L = rng.entero(2, 12), rm = 2 * v1 * v2 / (v1 + v2);
    if (!limpio(rm, 1) || !limpio(L / v1, 2) || !limpio(L / v2, 2)) return null;
    if (v1 === 2 && v2 === 6) return null;   // los números de la predicción de la idea 3
    return {
      enunciado: ['Subes a un cerro por un camino de ', `${L} km`, ' a ', Tv(`${v1} km/h`), ' y bajas por el mismo camino a ', Tv(`${v2} km/h`), '.'],
      pregunta: ['¿Cuál es tu rapidez media en todo el paseo?'],
      datos: [D.rm, D.tramo], correcta: rm, fmt: KMH,
      errores: [
        E('MED-PROMEDIO', (v1 + v2) / 2, T => `Bien usar las dos rapideces. Pero subir dura más que bajar: los tramos no duran lo mismo y promediarlos da ${T}.`),
        E('MED-SUMA', v1 + v2, T => `Bien juntar la subida y la bajada. Pero sumar las rapideces da ${T}, más de lo que llevaste en cualquier momento.`),
        E('MED-UN-TIEMPO', 2 * L / (L / v1), T => `Bien todo el camino, ${2 * L} km. Pero el tiempo es el de subir y el de bajar; con el de subida solo salen ${T}.`),
        E('MED-TRAMO', v1, T => `Bien que la subida pese más, porque dura más. Pero ${T} es solo la rapidez de subida; falta la bajada.`),
      ],
      solucion: [
        ['Tiempos: ', `${L} ÷ `, Tv(v1), ' = ', Tt(`${f(L / v1)} h`), ' para subir y ', `${L} ÷ `, Tv(v2), ' = ', Tt(`${f(L / v2)} h`), ' para bajar.'],
        ['Rapidez media = ', `${2 * L} ÷ `, Tt(f(L / v1 + L / v2)), ' = ', Tv(KMH(rm)), '.'],
      ],
      _datos: { L, v1, v2 },
    };
  }

  // ======================= A4: encuentros y alcances =======================

  const SEPARACIONES = [60, 80, 90, 100, 120, 150, 180, 200, 240, 300, 360, 400];
  function frente(rng) {
    const v1 = rng.entero(8, 15), v2 = rng.entero(4, 7), Dd = rng.elegir(SEPARACIONES), t = Dd / (v1 + v2);
    if (!limpio(t, 1)) return null;
    return {
      enunciado: ['Una combi sale del paradero a ', Tv(`${v1} m/s`), ' y, a la vez, un mototaxi viene de frente desde ', TD(`${Dd} m`), ' a ', Tv(`${v2} m/s`), '.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' después se cruzan?'],
      datos: [D.encuentro, D.pos, D.eje], correcta: t, fmt: S,
      errores: [
        E('VR-RESTA', Dd / (v1 - v2), T => `Bien dividir la separación entre una rapidez. Pero van uno hacia el otro: los dos achican la brecha; restar las rapideces da ${T}.`),
        E('VR-UNO', Dd / v1, T => `Bien que la combi avance ${v1} m cada segundo. Pero el mototaxi también se acerca: tratarlo como quieto da ${T}.`),
        E('VR-UNO', Dd / v2, T => `Bien que el mototaxi avance ${v2} m cada segundo. Pero la combi también se acerca: tratarla como quieta da ${T}.`),
        E('VR-PROMEDIO', Dd / ((v1 + v2) / 2), T => `Bien juntar las dos rapideces. Pero cada segundo la brecha se achica ${v1} + ${v2} m, no su promedio; así salen ${T}.`),
        E('ENC-MITAD', Dd / 2 / v1, T => `Bien que la combi avance ${v1} m cada segundo. Pero no se cruzan a la mitad, en ${Dd / 2} m: el que va más rápido avanza más; así salen ${T}.`),
      ],
      solucion: [
        ['Combi: x = ', Tv(v1), ' · t. Mototaxi: x = ', TD(Dd), ' − ', Tv(v2), ' · t. Se cruzan cuando las dos x son iguales.'],
        [Tv(v1), ' · t = ', TD(Dd), ' − ', Tv(v2), ` · t → ${v1 + v2} · t = ${Dd} → t = `, Tt(S(t)), '.'],
      ],
      _datos: { v1, v2, D: Dd },
    };
  }

  function alcance(rng) {
    const v2 = rng.entero(4, 8), v1 = v2 + rng.entero(1, 6), Dd = rng.elegir(SEPARACIONES), t = Dd / (v1 - v2);
    if (!limpio(t, 1) || v1 > 15) return null;
    if (Dd === 60 && v2 === 6 && v1 === 10) return null;   // la predicción de la idea 4
    return {
      enunciado: ['Un mototaxi va ', TD(`${Dd} m`), ' delante de una combi, a ', Tv(`${v2} m/s`), '; la combi lo sigue a ', Tv(`${v1} m/s`), ', hacia el mismo lado.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda la combi en alcanzarlo?'],
      datos: [D.encuentro, D.pos], correcta: t, fmt: S,
      errores: [
        E('VR-SUMA', Dd / (v1 + v2), T => `Bien dividir la brecha entre una rapidez. Pero van hacia el mismo lado: el mototaxi también se aleja; sumar las rapideces da ${T}.`),
        E('VR-UNO', Dd / v1, T => `Bien que la combi avance ${v1} m cada segundo. Pero el mototaxi no está quieto: también avanza; así salen ${T}.`),
        E('VR-PROMEDIO', Dd / ((v1 + v2) / 2), T => `Bien juntar las dos rapideces. Pero cada segundo la combi gana ${v1} − ${v2} m, no su promedio; así salen ${T}.`),
        E('VR-UNO', Dd / v2, T => `Bien la brecha de ${Dd} m. Pero ${Dd} ÷ ${v2} es lo que tardaría el mototaxi en recorrerla, no el alcance; así salen ${T}.`),
      ],
      solucion: [
        ['Combi: x = ', Tv(v1), ' · t. Mototaxi: x = ', TD(Dd), ' + ', Tv(v2), ' · t. La alcanza cuando las dos x son iguales.'],
        [Tv(v1), ' · t = ', TD(Dd), ' + ', Tv(v2), ` · t → ${v1 - v2} · t = ${Dd} → t = `, Tt(S(t)), '.'],
      ],
      _datos: { v1, v2, D: Dd },
    };
  }

  function dondeCruzan(rng) {
    const v1 = rng.entero(8, 15), v2 = rng.entero(4, 9), Dd = rng.elegir(SEPARACIONES), t = Dd / (v1 + v2), x = v1 * t;
    if (!limpio(t, 1) || !limpio(x, 1) || v1 === v2) return null;
    return {
      enunciado: ['Una combi sale del paradero a ', Tv(`${v1} m/s`), ' y, a la vez, un mototaxi viene de frente desde ', TD(`${Dd} m`), ' a ', Tv(`${v2} m/s`), '.'],
      pregunta: ['¿A qué distancia del paradero se cruzan?'],
      datos: [D.encuentro, D.pos, D.eje], correcta: x, fmt: M,
      errores: [
        E('ENC-OTRO', v2 * t, T => `Bien el instante del cruce, ${f(t)} s. Pero ${T} es lo que avanzó el mototaxi; desde el paradero se mide lo que avanzó la combi.`),
        E('ENC-MITAD', Dd / 2, T => `Bien que se crucen entre los dos. Pero la combi va más rápido: avanza más que el mototaxi y no se cruzan a la mitad, en ${T}.`),
        E('VR-RESTA', v1 * Dd / (v1 - v2), T => `Bien multiplicar la rapidez de la combi por el tiempo. Pero van de frente: el tiempo es ${Dd} ÷ (${v1} + ${v2}); restando sale ${T}.`),
        E('VR-UNO', v1 * Dd / v2, T => `Bien multiplicar por la rapidez de la combi. Pero el tiempo no es ${Dd} ÷ ${v2}: los dos se acercan; así sale ${T}.`),
      ],
      solucion: [
        ['Se cruzan cuando ', Tv(v1), ' · t = ', TD(Dd), ' − ', Tv(v2), ' · t: ', Tt(`t = ${Dd} ÷ ${v1 + v2} = ${S(t)}`), '.'],
        ['La combi avanzó ', Tv(v1), ' · ', Tt(f(t)), ' = ', Tx(M(x)), ' desde el paradero.'],
      ],
      _datos: { v1, v2, D: Dd },
    };
  }

  function alcanceKmh(rng) {
    const k2 = rng.elegir([18, 36]), k1 = rng.elegir([36, 54, 72].filter(k => k > k2)), Dd = rng.elegir(SEPARACIONES);
    const rel = (k1 - k2) / 3.6, t = Dd / rel;
    if (!limpio(t, 1)) return null;
    if (k2 === 36 && k1 === 54 && Dd === 100) return null;   // el ejemplo de la idea 4
    return {
      enunciado: ['Un mototaxi a ', Tv(`${k2} km/h`), ' va ', TD(`${Dd} m`), ' delante de una combi a ', Tv(`${k1} km/h`), ', los dos hacia el mismo lado.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda la combi en alcanzarlo?'],
      datos: [D.encuentro, D.pos, D.kmh], correcta: t, fmt: S,
      errores: [
        E('U1-kmh', Dd / (k1 - k2), T => `Bien que la combi gane ${k1} − ${k2} = ${k1 - k2} km/h. Pero eso no son ${k1 - k2} m/s: sin pasar a m/s salen ${T}.`),
        E('U1-inversa', Dd / ((k1 - k2) * 3.6), T => `Bien restar y convertir. Pero de km/h a m/s se divide entre 3,6, no se multiplica; así salen ${T}.`),
        E('VR-SUMA', Dd / ((k1 + k2) / 3.6), T => `Bien pasar a m/s. Pero van hacia el mismo lado: el mototaxi también se aleja; sumar las rapideces da ${T}.`),
        E('VR-UNO', Dd / (k1 / 3.6), T => `Bien pasar a m/s. Pero el mototaxi no está quieto: también avanza; así salen ${T}.`),
        E('VR-UNO', Dd / (k2 / 3.6), T => `Bien pasar a m/s y la brecha de ${Dd} m. Pero ${Dd} ÷ ${f(k2 / 3.6)} es lo que tardaría el mototaxi en recorrerla, no el alcance; así salen ${T}.`),
      ],
      solucion: [
        ['En m/s: ', Tv(`${k1} km/h = ${f(k1 / 3.6)} m/s`), ' y ', Tv(`${k2} km/h = ${f(k2 / 3.6)} m/s`), '.'],
        [Tv(f(k1 / 3.6)), ' · t = ', TD(Dd), ' + ', Tv(f(k2 / 3.6)), ` · t → ${f(rel)} · t = ${Dd} → t = `, Tt(S(t)), '.'],
      ],
      _datos: { k1, k2, D: Dd },
    };
  }

  function salioAntes(rng) {
    const v2 = rng.entero(3, 8), v1 = v2 + rng.entero(2, 6), dt = 5 * rng.entero(2, 6), t = v2 * dt / (v1 - v2);
    if (!limpio(t, 1) || v1 > 15) return null;
    if (v2 === 6 && v1 === 10 && dt === 10) return null;   // el ejemplo de la idea 4
    return {
      enunciado: ['Un mototaxi sale del paradero a ', Tv(`${v2} m/s`), '. ', Tt(`${dt} s`), ' después sale una combi del mismo paradero, a ', Tv(`${v1} m/s`), ', por el mismo camino.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda la combi en alcanzarlo, desde que sale?'],
      datos: [D.encuentro, D.pos], correcta: t, fmt: S,
      errores: [
        E('VR-RELOJ', t + dt, T => `Bien el alcance. Pero ${T} se cuenta desde que salió el mototaxi; se pide desde que sale la combi, ${dt} s después.`),
        E('VR-VENTAJA', dt, T => `Bien que el mototaxi le saque ventaja durante ${dt} s. Pero ${T} es esa ventaja; la combi tarda en descontarla.`),
        E('VR-SUMA', v2 * dt / (v1 + v2), T => `Bien la ventaja del mototaxi, ${v2 * dt} m. Pero van hacia el mismo lado: la combi gana ${v1} − ${v2} m cada segundo, no la suma; así salen ${T}.`),
        E('VR-UNO', v2 * dt / v1, T => `Bien la ventaja del mototaxi, ${v2 * dt} m. Pero él sigue avanzando: tratarlo como quieto da ${T}.`),
      ],
      solucion: [
        ['Cuando sale la combi, el mototaxi va ', Tv(v2), ' · ', Tt(dt), ` = ${v2 * dt} m delante.`],
        ['La combi gana ', Tv(v1), ' − ', Tv(v2), ` = ${v1 - v2} m cada segundo: t = ${v2 * dt} ÷ ${v1 - v2} = `, Tt(S(t)), '.'],
      ],
      _datos: { v1, v2, dt },
    };
  }

  function trenes(rng, forzado) {
    const sub = forzado || rng.elegir(['frente', 'mismo']);
    const L1 = rng.elegir([80, 100, 120, 150, 180, 200]), L2 = rng.elegir([60, 80, 100, 120, 150]), v1 = rng.entero(10, 30), v2 = rng.entero(10, 25);
    if (sub === 'mismo' && v2 >= v1) return null;
    const rel = sub === 'frente' ? v1 + v2 : v1 - v2, t = (L1 + L2) / rel;
    if (!limpio(t, 1) || L1 === L2) return null;
    return {
      enunciado: ['Dos trenes van por vías paralelas', sub === 'frente' ? ', uno hacia el otro' : ', hacia el mismo lado', ': uno de ', TL(`${L1} m`), ' a ', Tv(`${v1} m/s`), ' y otro de ', TL(`${L2} m`), ' a ', Tv(`${v2} m/s`), '.'],
      pregunta: sub === 'frente' ? ['¿Cuánto ', Tt('tiempo'), ' pasa desde que se encuentran sus frentes hasta que se separan sus colas?']
        : ['¿Cuánto ', Tt('tiempo'), ' tarda el más rápido en pasar por completo al otro, de su frente en la cola del otro a su cola en el frente del otro?'],
      datos: [D.completo, D.pos], correcta: t, fmt: S,
      errores: [
        E('ENC-UN-LARGO', L1 / rel, T => `Bien la rapidez con que uno pasa junto al otro, ${rel} m/s. Pero hay que recorrer los dos largos, ${L1} + ${L2} m; con uno salen ${T}.`),
        E('ENC-UN-LARGO', L2 / rel, T => `Bien la rapidez con que uno pasa junto al otro, ${rel} m/s. Pero hay que recorrer los dos largos, ${L1} + ${L2} m; con uno salen ${T}.`),
        sub === 'frente'
          ? E('VR-RESTA', (L1 + L2) / Math.abs(v1 - v2), T => `Bien los dos largos. Pero van uno hacia el otro: cada segundo se pasan ${v1} + ${v2} m; restar da ${T}.`)
          : E('VR-SUMA', (L1 + L2) / (v1 + v2), T => `Bien los dos largos. Pero van hacia el mismo lado: el rápido gana ${v1} − ${v2} m cada segundo; sumar da ${T}.`),
        E('VR-UNO', (L1 + L2) / v1, T => `Bien los dos largos. Pero el otro tren no está parado: tratarlo como quieto da ${T}.`),
        sub === 'mismo' && E('VR-UNO', (L1 + L2) / v2, T => `Bien los dos largos. Pero ${v2} m/s es la rapidez del tren lento desde la vía; el rápido le gana ${v1} − ${v2} m cada segundo; así salen ${T}.`),
      ],
      solucion: [
        ['Uno pasa junto al otro a ', Tv(v1), sub === 'frente' ? ' + ' : ' − ', Tv(v2), ` = ${rel} m/s, y debe recorrer `, TL(L1), ' + ', TL(L2), ` = ${L1 + L2} m.`],
        ['t = ', `${L1 + L2} ÷ ${rel} = `, Tt(S(t)), '.'],
      ],
      _datos: { sub, L1, v1, L2, v2 },
    };
  }

  function dosVeces(rng) {
    const v1 = rng.entero(4, 12), v2 = rng.entero(3, 9), Dd = rng.elegir(SEPARACIONES), s = rng.elegir([20, 30, 40, 50, 60]);
    if (s >= Dd || v1 === v2) return null;
    const t = (Dd + s) / (v1 + v2);
    if (!limpio(t, 1) || !limpio((Dd - s) / (v1 + v2), 1)) return null;
    if (v1 === 6 && v2 === 4 && Dd === 200 && s === 50) return null;   // el ejemplo de la idea 4
    return {
      enunciado: ['Una combi a ', Tv(`${v1} m/s`), ' y un mototaxi a ', Tv(`${v2} m/s`), ' van de frente por una recta, separados ', TD(`${Dd} m`), '.'],
      pregunta: ['¿A los cuántos segundos están a ', TD(`${s} m`), ' uno del otro por segunda vez?'],
      datos: [D.pos, D.separacion], correcta: t, fmt: S,
      errores: [
        E('ENC-PRIMERA', (Dd - s) / (v1 + v2), T => `Bien que la brecha se achique ${v1 + v2} m cada segundo. Pero ${T} es la primera vez, antes de cruzarse; la segunda es después del cruce.`),
        E('ENC-CRUCE', Dd / (v1 + v2), T => `Bien que se acerquen ${v1 + v2} m cada segundo. Pero ${T} es cuando se cruzan; después siguen y se alejan ${s} m más.`),
        E('VR-RESTA', (Dd + s) / Math.abs(v1 - v2), T => `Bien que la segunda vez ya se cruzaron. Pero van de frente: cada segundo cambia su separación ${v1} + ${v2} m; restando salen ${T}.`),
        E('ENC-SOLO-S', s / (v1 + v2), T => `Bien que se separen ${v1 + v2} m cada segundo después de cruzarse. Pero eso empieza tras el cruce: ${T} no cuenta lo que tardan en cruzarse.`),
      ],
      solucion: [
        ['Combi: x = ', Tv(v1), ' · t. Mototaxi: x = ', TD(Dd), ' − ', Tv(v2), ' · t. La segunda vez ya se cruzaron: la combi va ', TD(`${s} m`), ' más allá.'],
        [Tv(v1), ' · t − (', TD(Dd), ' − ', Tv(v2), ` · t) = ${s} → ${v1 + v2} · t = ${Dd + s} → t = `, Tt(S(t)), '.'],
      ],
      _datos: { v1, v2, D: Dd, s },
    };
  }

  // ======================= A5: velocidad relativa =======================

  function carril(rng) {
    const vA = rng.entero(8, 16), vB = rng.entero(5, 20), rel = vB - vA;
    if (vB === vA || (vA === 10 && vB === 15)) return null;   // el ejemplo de la idea 5
    return {
      enunciado: ['Tu combi va a ', Tv(`${vA} m/s`), ' hacia el lado +. La del carril de al lado va a ', Tv(`${vB} m/s`), ', también hacia el lado +.'],
      pregunta: ['¿Con qué velocidad la ves moverse desde tu ventana, con su signo?'],
      datos: [D.rel, D.carretera], correcta: rel, fmt: MS, negativos: true,
      errores: [
        E('REL-SUMA', vB + vA, T => `Bien usar las dos velocidades. Pero van hacia el mismo lado: desde tu ventana solo ves la diferencia; sumar da ${T}.`),
        E('REL-SENTIDO', vA - vB, T => `Bien restar. Pero al revés: es la velocidad de la otra menos la tuya; ${T} tiene el signo cambiado.`),
        E('REL-SIN-MARCO', vB, T => `Bien: la otra va a ${f(vB)} m/s, pero medida desde la carretera. Desde tu ventana se le resta la tuya; ${T} no es.`),
        E('REL-SOLO-A', -vA, T => `Bien que tu propia velocidad cuente, con signo −. Pero ${T} es como verías un poste quieto; la otra combi también avanza.`),
      ],
      solucion: [
        ['Desde la carretera: tu combi ', Tv(`${vA} m/s`), ' y la otra ', Tv(`${vB} m/s`), '.'],
        ['Desde tu ventana: ', Tv(vB), ' − ', Tv(vA), ' = ', Tv(MS(rel)), rel < 0 ? ': la ves quedarse atrás.' : ': la ves adelantarse.'],
      ],
      _datos: { vA, vB },
    };
  }

  function frenteKmh(rng) {
    const kA = rng.elegir([36, 54, 72]), kB = rng.elegir([18, 36, 54, 72]), rel = -(kA + kB) / 3.6;
    if (kA === 54 && kB === 36) return null;   // el ejemplo de la idea 5
    return {
      enunciado: ['Tu combi va a ', Tv(`${kA} km/h`), ' hacia el lado +. Por el otro carril viene otra de frente, a ', Tv(`${kB} km/h`), ' hacia el lado −.'],
      pregunta: ['¿Con qué velocidad la ves moverse desde tu ventana, en m/s y con su signo?'],
      datos: [D.rel, D.carretera, D.kmh], correcta: rel, fmt: MS, negativos: true,
      errores: [
        E('U1-kmh', -(kA + kB), T => `Bien la resta con los signos, −${kB} − ${kA}. Pero eso está en km/h; sin pasar a m/s queda ${T}.`),
        E('REL-SIGNO', (kB - kA) / 3.6, T => `Bien restar tu velocidad y pasar a m/s. Pero la otra va hacia el lado −: es −${kB} km/h antes de restar; así queda ${T}.`),
        E('REL-SENTIDO', (kA + kB) / 3.6, T => `Bien: se acercan a ${f((kA + kB) / 3.6)} m/s. Pero la ves venir hacia el lado −: lleva signo; ${T} no lo tiene.`),
        E('REL-SIN-MARCO', -kB / 3.6, T => `Bien su velocidad en m/s, con su signo. Pero esa es desde la carretera; desde tu ventana se le resta la tuya; ${T} no es.`),
        E('U1-inversa', -(kA + kB) * 3.6, T => `Bien la resta con los signos. Pero de km/h a m/s se divide entre 3,6, no se multiplica; así queda ${T}.`),
      ],
      solucion: [
        ['Desde la carretera: tu combi ', Tv(`+${kA} km/h`), ' y la otra ', Tv(`−${kB} km/h`), '.'],
        ['Desde tu ventana: ', Tv(`−${kB}`), ' − ', Tv(kA), ` = −${kA + kB} km/h = −${kA + kB} ÷ 3,6 m/s = `, Tv(MS(rel)), '.'],
      ],
      _datos: { kA, kB },
    };
  }

  const BOTE = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6], CORRIENTE = [0.5, 1, 1.5, 2, 2.5, 3];
  function rio(rng, forzado) {
    const sub = forzado || rng.elegir(['abajo', 'arriba']);
    const u = rng.elegir(BOTE), c = rng.elegir(CORRIENTE);
    if (c >= u) return null;
    if (u === 5 && c === 2) return null;     // la predicción de la idea 5
    if (u === 4 && c === 1.5) return null;   // los ejemplos de la idea 5
    if (sub === 'abajo') {
      // Al revés: desde la orilla se ve su rapidez río abajo; se pide la que lleva respecto al agua.
      const V = u + c, h = Math.sqrt(V * V - c * c);
      return {
        enunciado: ['Desde la orilla, un bote se ve avanzar río abajo a ', Tv(`${f(V)} m/s`), '. La corriente va a ', Tv(`${f(c)} m/s`), '.'],
        pregunta: ['¿Con qué rapidez rema el bote respecto al agua?'],
        datos: [D.orilla, D.rio], correcta: u, fmt: MS,
        errores: [
          E('REL-SENTIDO', V + c, T => `Bien juntar la orilla y la corriente. Pero el agua ya lo ayuda río abajo: lo que rema es lo de la orilla menos la corriente; sumar da ${T}.`),
          E('REL-SIN-MARCO', V, T => `Bien leer lo que se ve desde la orilla. Pero ${T} incluye la corriente; respecto al agua el bote va más lento.`),
          E('REL-SOLO-RIO', c, T => `Bien que la corriente cuente. Pero ${T} es lo que lleva el agua, no lo que rema el bote.`),
          limpio(h) && E('REL-PITAGORAS', h, T => `Bien juntar las dos velocidades. Pero están sobre la misma recta, no en ángulo recto: se suman o restan con su signo; ${T} no es.`),
        ],
        solucion: [
          ['Río abajo es +: desde la orilla ', Tv(`+${f(V)}`), ' = u + ', Tv(`${f(c)}`), ', con u la velocidad del bote respecto al agua.'],
          ['u = ', Tv(f(V)), ' − ', Tv(f(c)), ' = ', Tv(MS(u)), '.'],
        ],
        _datos: { sub, u, c },
      };
    }
    const vr = u - c, h = Math.hypot(u, c);
    return {
      enunciado: ['Un bote rema río arriba a ', Tv(`${f(u)} m/s`), ' respecto al agua; la corriente va a ', Tv(`${f(c)} m/s`), '.'],
      pregunta: ['¿Con qué rapidez lo ve avanzar alguien parado en la orilla?'],
      datos: [D.orilla, D.rio], correcta: vr, fmt: MS,
      errores: [
        E('REL-SENTIDO', u + c, T => `Bien juntar el bote y la corriente. Pero va río arriba: el agua lo frena; sumar da ${T}.`),
        E('REL-SIN-MARCO', u, T => `Bien: el bote rema a ${f(u)} m/s, pero respecto al agua. Desde la orilla también cuenta el agua que se mueve; ${T} no es.`),
        E('REL-SOLO-RIO', c, T => `Bien que la corriente cuente. Pero ${T} sería un bote que no rema; este rema a ${f(u)} m/s respecto al agua.`),
        limpio(h) && E('REL-PITAGORAS', h, T => `Bien juntar las dos velocidades. Pero están sobre la misma recta, no en ángulo recto: se suman o restan con su signo; ${T} no es.`),
      ],
      solucion: [
        ['Río abajo es +: el bote ', Tv(`−${f(u)}`), ' respecto al agua y el agua ', Tv(`+${f(c)}`), '.'],
        ['Desde la orilla: ', Tv(f(-u)), ' + ', Tv(f(c)), ` = ${f(c - u)} m/s: avanza a `, Tv(MS(vr)), ' río arriba.'],
      ],
      _datos: { sub, u, c },
    };
  }

  function tramoRio(rng) {
    const u = rng.elegir(BOTE), c = rng.elegir(CORRIENTE), L = 10 * rng.entero(4, 30);
    if (c >= u) return null;
    const vr = u - c, t = L / vr;
    if (!limpio(t, 1)) return null;
    return {
      enunciado: ['Un bote rema río arriba a ', Tv(`${f(u)} m/s`), ' respecto al agua; la corriente va a ', Tv(`${f(c)} m/s`), '.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda en recorrer un tramo de ', TL(`${L} m`), ' de orilla?'],
      datos: [D.orilla, D.tramo, D.rio], correcta: t, fmt: S,
      errores: [
        E('REL-SENTIDO', L / (u + c), T => `Bien dividir el tramo entre la rapidez desde la orilla. Pero río arriba el agua lo frena: ${f(u)} − ${f(c)}; sumando salen ${T}.`),
        E('REL-SIN-MARCO', L / u, T => `Bien dividir ${L} m entre una rapidez. Pero ${f(u)} m/s es respecto al agua; la orilla se recorre con la rapidez desde la orilla; así salen ${T}.`),
        E('REL-SOLO-RIO', L / c, T => `Bien dividir ${L} m entre una rapidez. Pero ${T} sería un bote que no rema y se deja llevar.`),
        E('REL-IDA', L / (u + c) + L / (u - c), T => `Bien las rapideces desde la orilla. Pero solo se recorre el tramo una vez, río arriba; ${T} es ida y vuelta.`),
      ],
      solucion: [
        ['Desde la orilla avanza río arriba a ', Tv(f(u)), ' − ', Tv(f(c)), ' = ', Tv(MS(vr)), '.'],
        ['t = ', TL(L), ` ÷ ${f(vr)} = `, Tt(S(t)), '.'],
      ],
      _datos: { u, c, L },
    };
  }

  function ventajaKmh(rng) {
    const kA = rng.elegir([18, 36, 54]), kB = rng.elegir([54, 72, 90].filter(k => k > kA)), s = rng.elegir([50, 60, 80, 100, 120, 150, 200]);
    const rel = (kB - kA) / 3.6, t = s / rel;
    if (!limpio(t, 1)) return null;
    if (kA === 54 && kB === 72 && s === 100) return null;   // el ejemplo de la idea 5
    return {
      enunciado: ['Tu combi va a ', Tv(`${kA} km/h`), ' y la del carril de al lado, a ', Tv(`${kB} km/h`), ', las dos hacia el lado +. Ahora van una al lado de la otra.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ' tarda la otra en sacarte ', TD(`${s} m`), ' de ventaja?'],
      datos: [D.rel, D.kmh, D.tramo], correcta: t, fmt: S,
      errores: [
        E('U1-kmh', s / (kB - kA), T => `Bien que desde tu ventana la otra avance ${kB - kA} km/h. Pero eso no son ${kB - kA} m/s: sin pasar a m/s salen ${T}.`),
        E('U1-inversa', s / ((kB - kA) * 3.6), T => `Bien restar y convertir. Pero de km/h a m/s se divide entre 3,6, no se multiplica; así salen ${T}.`),
        E('REL-SUMA', s / ((kA + kB) / 3.6), T => `Bien pasar a m/s. Pero van hacia el mismo lado: desde tu ventana la otra solo gana la diferencia; sumar da ${T}.`),
        E('REL-SIN-MARCO', s / (kB / 3.6), T => `Bien pasar a m/s. Pero ${f(kB / 3.6)} m/s es su velocidad desde la carretera; desde tu ventana se le resta la tuya; así salen ${T}.`),
        E('REL-SOLO-A', s / (kA / 3.6), T => `Bien pasar a m/s. Pero ${f(kA / 3.6)} m/s es tu velocidad; desde tu ventana la otra avanza ${f(kB / 3.6)} − ${f(kA / 3.6)}; así salen ${T}.`),
      ],
      solucion: [
        ['Desde tu ventana: ', Tv(kB), ' − ', Tv(kA), ` = ${kB - kA} km/h = `, Tv(`${f(rel)} m/s`), '.'],
        ['t = ', TD(s), ` ÷ ${f(rel)} = `, Tt(S(t)), '.'],
      ],
      _datos: { kA, kB, s },
    };
  }

  function dosViajes(rng, forzado) {
    const sub = forzado || rng.elegir(['corriente', 'bote']);
    const u = rng.elegir(BOTE), c = rng.elegir(CORRIENTE);
    if (c >= u) return null;
    const a = u + c, b = u - c;
    if (a === 9 && b === 5) return null;   // el ejemplo de la idea 5
    const enunciado = ['Desde la orilla, un bote avanza a ', Tv(`${f(a)} m/s`), ' cuando va río abajo y a ', Tv(`${f(b)} m/s`), ' cuando va río arriba, remando siempre igual.'];
    if (sub === 'corriente') {
      return {
        enunciado, pregunta: ['¿Con qué rapidez corre el río?'],
        datos: [D.orilla, D.rio, D.uc], correcta: c, fmt: MS,
        errores: [
          E('REL-SIN-MITAD', a - b, T => `Bien restar los dos viajes: así se va lo que rema el bote. Pero la corriente se cuenta dos veces, una en cada viaje; sin dividir entre 2 queda ${T}.`),
          E('REL-CRUZA', u, T => `Bien sumar los dos viajes y dividir entre 2. Pero ${T} es lo que rema el bote respecto al agua, no la corriente.`),
          E('REL-SIN-MARCO', b, T => `Bien usar los dos viajes. Pero ${T} es lo que avanza río arriba, visto desde la orilla; la corriente es la mitad de la diferencia.`),
        ],
        solucion: [
          ['Río abajo: u + c = ', Tv(f(a)), '. Río arriba, hacia el lado −: −u + c = ', Tv(f(-b)), '.'],
          [`Sumando las dos se va u: 2c = ${f(a)} − ${f(b)} = ${f(a - b)} m/s. `, 'c = ', Tv(MS(c)), ' (y el bote rema a ', `${f(u)} m/s respecto al agua).`],
        ],
        _datos: { sub, u, c },
      };
    }
    return {
      enunciado, pregunta: ['¿Con qué rapidez rema el bote respecto al agua?'],
      datos: [D.orilla, D.rio, D.uc], correcta: u, fmt: MS,
      errores: [
        E('REL-SIN-MITAD', a + b, T => `Bien sumar los dos viajes: así se va la corriente. Pero lo que rema el bote se cuenta dos veces; sin dividir entre 2 queda ${T}.`),
        E('REL-CRUZA', c, T => `Bien restar los dos viajes y dividir entre 2. Pero ${T} es la corriente, no lo que rema el bote.`),
        E('REL-SIN-MARCO', a, T => `Bien usar los dos viajes. Pero ${T} es lo que avanza río abajo, visto desde la orilla, con la corriente a favor.`),
      ],
      solucion: [
        ['Río abajo: u + c = ', Tv(f(a)), '. Río arriba, hacia el lado −: −u + c = ', Tv(f(-b)), '.'],
        [`Restando la segunda de la primera se va c: 2u = ${f(a)} + ${f(b)} = ${f(a + b)} m/s. `, 'u = ', Tv(MS(u)), ' (y la corriente va a ', `${f(c)} m/s).`],
      ],
      _datos: { sub, u, c },
    };
  }

  function idaVueltaRio(rng, forzado) {
    const sub = forzado || rng.elegir(['bote', 'columna']);
    // El pastor corre a 3 m/s como mucho, en el altiplano (auditoría de MRU, B1); la columna, a 1,5 m/s.
    const u = sub === 'bote' ? rng.elegir(BOTE) : rng.elegir([1.5, 2, 2.5, 3]), c = sub === 'bote' ? rng.elegir(CORRIENTE) : rng.elegir([0.5, 1, 1.5]);
    const L = sub === 'bote' ? 10 * rng.entero(4, 20) : 10 * rng.entero(2, 8);
    if (c >= u) return null;
    const t1 = L / (u - c), t2 = L / (u + c), t = t1 + t2;
    if (!limpio(t1, 1) || !limpio(t2, 1)) return null;
    if ((sub === 'bote' && u === 5 && c === 3 && L === 80) || (sub === 'columna' && L === 40 && c === 1 && u === 3)) return null;   // los ejemplos de la idea 5
    const enunciado = sub === 'bote'
      ? ['Un bote rema a ', Tv(`${f(u)} m/s`), ' respecto al agua en un río que corre a ', Tv(`${f(c)} m/s`), '. Sube ', TL(`${L} m`), ' río arriba y vuelve al punto de partida.']
      : ['Una columna de llamas de ', TL(`${L} m`), ' avanza a ', Tv(`${f(c)} m/s`), '. El pastor corre de la cola a la cabeza a ', Tv(`${f(u)} m/s`), ' y vuelve a la cola, también a ', Tv(`${f(u)} m/s`), '.'];
    return {
      enunciado, pregunta: sub === 'bote' ? ['¿Cuánto ', Tt('tiempo'), ' dura el viaje de ida y vuelta?'] : ['¿Cuánto ', Tt('tiempo'), ' tarda en ir y volver?'],
      datos: sub === 'bote' ? [D.orilla, D.tramo, D.rio] : [D.rel, D.tramo, D.suelo], correcta: t, fmt: S,
      errores: [
        E('REL-IDA', t1, T => `Bien ${sub === 'bote' ? 'la subida, contra la corriente' : 'la ida, que gana solo la diferencia'}: ${S(t1)}. Pero falta la vuelta; ${T} es un solo tramo.`),
        E('REL-SIN-MARCO', 2 * L / u, T => sub === 'bote'
          ? `Bien los ${2 * L} m de ida y vuelta. Pero la corriente frena la subida y ayuda la bajada; sin ella salen ${T}.`
          : `Bien los ${2 * L} m de ida y vuelta. Pero la columna también avanza: ${T} la trata como quieta.`),
        E('REL-SENTIDO', 2 * L / (u - c), T => `Bien la ${sub === 'bote' ? 'subida' : 'ida'}, con ${f(u)} − ${f(c)}. Pero a la vuelta ${sub === 'bote' ? 'la corriente ayuda' : 'se cruzan'}: ${f(u)} + ${f(c)}; usar la resta en los dos da ${T}.`),
        E('REL-SENTIDO', 2 * L / (u + c), T => `Bien la vuelta, con ${f(u)} + ${f(c)}. Pero a la ida ${sub === 'bote' ? 'la corriente frena' : 'van hacia el mismo lado'}: ${f(u)} − ${f(c)}; usar la suma en los dos da ${T}.`),
      ],
      solucion: [
        [sub === 'bote' ? 'Subida: ' : 'Ida, respecto a la columna: ', TL(L), ' ÷ (', Tv(f(u)), ' − ', Tv(f(c)), ') = ', Tt(S(t1)), '.'],
        [sub === 'bote' ? 'Bajada: ' : 'Vuelta: ', TL(L), ' ÷ (', Tv(f(u)), ' + ', Tv(f(c)), ') = ', Tt(S(t2)), '. En total, ', Tt(S(t)), '.'],
      ],
      _datos: { sub, u, c, L },
    };
  }

  function placas(rng, forzado) {
    const sub = forzado || rng.elegir(['frente', 'mismo']);
    const a = rng.entero(1, 9), b = rng.entero(1, 9), N = rng.elegir([50, 100, 200, 500, 1000, 2000]);
    if (a === b) return null;
    if (sub === 'frente' && a === 4 && b === 6 && N === 50) return null;   // el ejemplo de la idea 5
    const rel = sub === 'frente' ? a + b : Math.abs(a - b), dm = rel * N / 100;
    return {
      enunciado: ['Respecto a una tercera placa, la placa A avanza ', Tv(`${a} cm por año`), ' hacia el este y la placa B, ', Tv(`${b} cm por año`),
        sub === 'frente' ? ' hacia el oeste, una hacia la otra.' : ' también hacia el este; B va delante.'],
      pregunta: ['¿Cuántos metros cambia la separación entre A y B en ', Tt(`${f(N)} años`), '?'],
      datos: [D.rel, D.placas, D.cm], correcta: dm, fmt: M,
      errores: [
        E('REL-SENTIDO', (sub === 'frente' ? Math.abs(a - b) : a + b) * N / 100, T => sub === 'frente'
          ? `Bien pasar los centímetros a metros. Pero van una hacia la otra: B va a −${b} cm por año, y la resta suma; restar las rapideces da ${T}.`
          : `Bien pasar a metros. Pero las dos van hacia el este: desde B, A solo cambia la diferencia; sumar da ${T}.`),
        E('REL-SIN-MARCO', a * N / 100, T => `Bien multiplicar por ${f(N)} años. Pero ${T} es lo que A avanza respecto a la tercera placa; B también se mueve.`),
        E('REL-SIN-MARCO', b * N / 100, T => `Bien multiplicar por ${f(N)} años. Pero ${T} es lo que B avanza respecto a la tercera placa; A también se mueve.`),
        E('U2-cm', rel * N, T => `Bien la velocidad de una respecto a la otra, ${rel} cm por año. Pero ${f(rel * N)} son centímetros; como metros, ${T} es otra distancia.`),
      ],
      solucion: [
        ['Este +: A ', Tv(`+${a}`), ' y B ', Tv(sub === 'frente' ? `−${b}` : `+${b}`), ' cm por año. A vista desde B: ', Tv(a), ' − ', Tv(sub === 'frente' ? `(−${b})` : b), ` = ${f(a - (sub === 'frente' ? -b : b))} cm por año.`],
        ['En ', Tt(`${f(N)} años`), `: ${rel} · ${f(N)} = ${f(rel * N)} cm = `, TD(M(dm)), '.'],
      ],
      _datos: { sub, a, b, N },
    };
  }

  function adelanto(rng) {
    const L1 = rng.elegir([6, 7, 8]), L2 = rng.elegir([6, 8, 10, 12]), v1 = rng.entero(12, 18), v2 = rng.entero(4, 10);
    if (v2 >= v1) return null;
    const rel = v1 - v2, t = (L1 + L2) / rel;
    if (!limpio(t, 1)) return null;
    if (L1 === 6 && L2 === 6 && v1 === 15 && v2 === 10) return null;   // el ejemplo de la idea 5
    const otro = L2 >= 10 ? 'un bus' : 'otra combi';
    return {
      enunciado: ['Tu combi, de ', TL(`${L1} m`), ', va a ', Tv(`${v1} m/s`), ' y pasa a ', otro, ' de ', TL(`${L2} m`), ' que va a ', Tv(`${v2} m/s`), ', hacia el mismo lado.'],
      pregunta: ['¿Cuánto ', Tt('tiempo'), ` dura el adelanto, de tu frente en su cola a tu cola en su frente?`],
      datos: [D.rel, D.tramo], correcta: t, fmt: S,
      errores: [
        E('REL-UN-LARGO', L1 / rel, T => `Bien la rapidez con que te ve pasar, ${rel} m/s. Pero recorres tu largo y el suyo, ${L1} + ${L2} m; con uno solo salen ${T}.`),
        E('REL-UN-LARGO', L2 / rel, T => `Bien la rapidez con que te ve pasar, ${rel} m/s. Pero recorres su largo y también el tuyo, ${L1} + ${L2} m; con uno solo salen ${T}.`),
        E('REL-SUMA', (L1 + L2) / (v1 + v2), T => `Bien los dos largos. Pero van hacia el mismo lado: solo le ganas ${v1} − ${v2} m cada segundo; sumar da ${T}.`),
        E('REL-SIN-MARCO', (L1 + L2) / v1, T => `Bien los dos largos. Pero ${v1} m/s es tu velocidad desde la pista; ${otro === 'un bus' ? 'el bus' : 'la otra'} también avanza; así salen ${T}.`),
        E('REL-SIN-MARCO', (L1 + L2) / v2, T => `Bien los dos largos. Pero ${v2} m/s es la velocidad ${otro === 'un bus' ? 'del bus' : 'de la otra'} desde la pista; desde ahí la ves con ${v1} − ${v2}; así salen ${T}.`),
      ],
      solucion: [
        ['Vista desde ', otro === 'un bus' ? 'el bus' : 'la otra combi', ', tu combi avanza a ', Tv(v1), ' − ', Tv(v2), ` = ${rel} m/s y debe recorrer `, TL(L1), ' + ', TL(L2), ` = ${L1 + L2} m.`],
        ['t = ', `${L1 + L2} ÷ ${rel} = `, Tt(S(t)), '.'],
      ],
      _datos: { L1, v1, L2, v2 },
    };
  }

  const CONSTRUIR = {
    donde, cuando, 'combi-kmh': combiKmh, ecuacion, trueno, eco, 'ida-vuelta': idaVuelta,
    pendiente, inicio, extrapolar, 'dos-rectas': dosRectas, 'ecuacion-recta': ecuacionRecta, 'grafica-kmh': graficaKmh,
    valla, 'tramos-tiempo': tramosTiempo, 'tramos-distancia': tramosDistancia, parada, tabla, mitades, cerro,
    frente, alcance, 'donde-cruzan': dondeCruzan, 'alcance-kmh': alcanceKmh, 'salio-antes': salioAntes, trenes, 'dos-veces': dosVeces,
    carril, rio, 'frente-kmh': frenteKmh, 'tramo-rio': tramoRio, 'ventaja-kmh': ventajaKmh, 'dos-viajes': dosViajes, 'ida-vuelta-rio': idaVueltaRio, placas, adelanto,
  };

  return { id: ID, titulo: 'La combi, la gráfica y el río', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
