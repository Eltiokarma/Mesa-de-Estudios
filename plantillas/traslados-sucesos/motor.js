/*
 * Motor de «La posta, el paradero y la plaza» (razonamiento matemático): sucesos que se repiten cada cierto tiempo
 * (pastillas de un tratamiento, campanadas, combis que salen de un paradero, turnos y dietas que se repiten en ciclos,
 * el día de la semana en que cae un suceso), traslado de monedas sobre una mesa (el triángulo que se invierte con el
 * menor número de jugadas) y orientación con los puntos cardinales (recorridos por cuadras y giros en el sitio).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorTraslados) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Tiempos: las funciones de sucesos aceptan cualquier unidad, la misma en todos los datos (horas para pastillas,
 *     minutos para combis y campanadas, días para turnos). Una hora del día se da en minutos desde las 0:00
 *     (6:00 = 360) y se escribe 'h:mm' (horaTexto). Todos los números son enteros salvo donde se dice.
 *   - Días de la semana: los textos de DIAS, en minúsculas y con tilde: 'lunes', 'martes', 'miércoles', 'jueves',
 *     'viernes', 'sábado', 'domingo'.
 *   - Monedas: puntos de una red triangular (monedas iguales que se tocan). Un punto es [u, v] con u y v enteros; su
 *     lugar en el plano es x = u + v/2, y = v · √3/2 (v es la fila, hacia arriba; dos puntos vecinos están a 1).
 *     Una jugada es levantar una moneda y ponerla en un punto libre de la red. Dos disposiciones son la misma figura
 *     si una es la otra corrida (traslación de la red, sin girar ni reflejar).
 *   - Puntos cardinales: 'N', 'E', 'S', 'O' (norte, este, sur, oeste). En el plano, x crece hacia el este e y hacia
 *     el norte; una cuadra mide 1. Un giro es [lado, grados] con lado 'D' (derecha, sentido de las agujas del reloj)
 *     o 'I' (izquierda) y grados múltiplo de 90.
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico), 'coinciden'
 *     (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no van en
 *     'errores') y 'repetidos' (un error que da lo mismo que otro anterior de la lista: { nombre: el anterior }; no va
 *     en 'errores'). El orden de los errores es el de esta cabecera.
 *
 * Funciones (argumentos entre llaves):
 *   DIAS                        la lista de los 7 días, de lunes a domingo.
 *   horaTexto(min)              'h:mm' de min minutos desde las 0:00 (360 → '6:00', 396 → '6:36'); desde 1440 se
 *                               resta un día y se agrega ' del día siguiente' (o ' de dentro de 2 días', …).
 *   mcd(lista), mcm(lista)      máximo común divisor y mínimo común múltiplo de una lista de enteros positivos.
 *   tomas({ k, t, porToma, final })   un suceso (una toma de pastillas, una campanada) ocurre al empezar (instante 0) y
 *                               después cada k, durante un lapso t. porToma: pastillas en cada toma (por defecto 1).
 *                               final: true (por defecto) si también ocurre en el instante t cuando t es múltiplo de k
 *                               (los dos extremos cuentan); false si el lapso termina justo antes del instante t.
 *                               { intervalos: ⌊t/k⌋ (los de k completos), tomas (con final: ⌊t/k⌋ + 1; sin final:
 *                               ⌈t/k⌉), pastillas: tomas · porToma, instantes: [0, k, 2k, …] (los de cada toma),
 *                               respuesta (= pastillas), errores (en pastillas): sinMasUno (⌊t/k⌋ · porToma),
 *                               menosUno ((⌊t/k⌋ − 1) · porToma), deMas ((⌊t/k⌋ + 2) · porToma: los dos extremos
 *                               sumados aparte), sinMultiplicar (tomas; solo si porToma > 1) }. Sin final, los
 *                               errores son conElFinal ((tomas + 1) · porToma) y menosUno ((tomas − 1) · porToma).
 *   proximaCoincidencia({ intervalos, inicio })   varios sucesos (combis) ocurren juntos en el minuto inicio (por
 *                               defecto 0) y después cada uno con su intervalo. ¿Cuándo vuelven a ocurrir todos
 *                               juntos? { mcm, mcd, producto, suma (de los intervalos), minutos (= mcm: lo que pasa
 *                               hasta la siguiente vez juntos), en (inicio + mcm), hora (horaTexto(en)), errores (en
 *                               minutos desde inicio): mcd, suma, producto, mcmDeDos (el mcm de los dos primeros; solo
 *                               con 3 o más intervalos), horas: { la hora de cada error, horaTexto(inicio + valor) } }.
 *   salidas({ intervalo, inicio, fin })   los minutos inicio, inicio + intervalo, … hasta fin inclusive.
 *   recorrerMinutos({ intervalos, inicio, fin })   comprobación por fuerza bruta: recorre minuto a minuto de inicio a
 *                               fin y lista los minutos en que salen todos (cada uno sale cuando su contador de
 *                               minutos desde su última salida llega a su intervalo). Devuelve [minutos].
 *   vecesCoinciden({ intervalos, inicio, fin })   cuántas veces ocurren todos juntos de inicio a fin, contando la de
 *                               inicio y la de fin si cae. { mcm, lapso (fin − inicio), veces (⌊lapso/mcm⌋ + 1),
 *                               momentos: [minutos], horas: [textos], comprobado (true si recorrerMinutos da los mismos
 *                               momentos), errores: sinLaPrimera (veces − 1), conSuma (⌊lapso/suma⌋ + 1), conMcd
 *                               (⌊lapso/mcd⌋ + 1), conProducto (⌊lapso/producto⌋ + 1) }.
 *   diaSemana({ desde, dias })  el día de la semana que es 'dias' días después de 'desde' (dias puede ser negativo).
 *                               { dia, resto (dias mod 7, de 0 a 6) }.
 *   descanso({ ciclo, primero, n })   un turno que se repite: un descanso cada 'ciclo' días (trabaja ciclo − 1 días y
 *                               descansa el siguiente, sin saltar domingos ni feriados); el primer descanso cae el día
 *                               'primero'. ¿Qué día cae el descanso número n? { dias ((n − 1) · ciclo: del primero al
 *                               n-ésimo), semanas (⌊dias/7⌋), resto (dias mod 7), dia, errores (días de la semana):
 *                               unCicloDeMas (n · ciclo días después del primero), mismoDia (el día del primero:
 *                               «los descansos se repiten»), alReves (resto días antes del primero),
 *                               cuentaElDiaDePartida (resto − 1 días después: el día del primero contado como uno) }.
 *   recorrerDias({ ciclo, primero, n })   comprobación día por día, sin módulo: avanza un día a la vez con un
 *                               contador de días trabajados y el nombre del día siguiente en la lista. { dia,
 *                               dias (días pasados desde el primero), descansos: [{ num, dia (días desde el primero),
 *                               nombre }] }.
 *   triangulo(filas, invertido)   las monedas de un triángulo de 'filas' filas: hacia arriba, la fila v = 0 tiene
 *                               'filas' monedas (u = 0 … filas − 1) y la de arriba una. Invertido: el reflejo, con la
 *                               fila larga arriba (fila v = filas − 1) y la punta abajo (v = 0). Devuelve [[u, v]].
 *   minMovimientos(origen, destino)   el menor número de jugadas para pasar de la disposición origen a la figura
 *                               destino puesta en cualquier lugar (corrida): N − (la mayor cantidad de monedas de
 *                               origen que coinciden con alguna traslación de destino), porque cada moneda que no
 *                               está ya en su lugar se mueve al menos una vez y basta con moverla una vez. { minimo,
 *                               traslado: [du, dv] (el que más deja en su lugar; si empatan, el de menor |du| + |dv|),
 *                               meta: [[u, v]] (destino corrido), quedan: [las que no se mueven], mover: [las que se
 *                               mueven], a: [los lugares libres de la meta, en el mismo orden] }.
 *   monedasTriangulo({ filas })   el triángulo de 'filas' filas que apunta hacia arriba debe quedar apuntando hacia
 *                               abajo. { monedas, inicio, meta, minimo, mover, a, errores: esquinas (3: mover las tres
 *                               puntas), dosPuntas (2), filaMasLarga (filas), mitad (⌈monedas/2⌉), filaYPunta
 *                               (filas + 1: la fila de abajo y la punta), todas (monedas) }.
 *   revisarMonedas(posiciones, filas)   lo que armó el alumno: { llego (posiciones es el triángulo invertido de
 *                               'filas' filas, corrido a cualquier lugar), faltan (el menor número de jugadas que le
 *                               quedan), repetida (dos monedas en el mismo punto) }.
 *   recorrido(tramos)           tramos: [[rumbo, cuadras], …] con rumbo 'N', 'E', 'S' u 'O'. { x, y (dónde termina),
 *                               puntos: [[x, y]] (el inicio y el final de cada tramo), total (cuadras caminadas),
 *                               distancia (en línea recta al inicio), d2 (su cuadrado), exacto (texto: '13' o '5√2'), direccion (desde el
 *                               inicio: 'norte', 'noreste', 'este', …; 'el mismo lugar' si vuelve), errores:
 *                               sumaTodo (total), sumaCatetos (|x| + |y|), sinRestar (la distancia si los tramos al
 *                               sur se sumaran al norte y los del oeste al este) }.
 *   girar(rumbo, lado, grados)  el rumbo después de un giro ('N' con 'D' y 90 → 'E').
 *   giros({ inicio, giros })    giros: [[lado, grados], …]. { final, rumbos: [inicio y después de cada giro], neto
 *                               (grados netos a la derecha, de 0 a 359), nombre (el final en palabras), errores
 *                               (nombres): izquierda (derecha e izquierda cambiadas), sinMedia (sin los giros de 180°),
 *                               mediaComoCuarto (cada giro de 180° tomado como de 90° al mismo lado),
 *                               mediaDesdeElInicio (cada giro de 180° deja mirando al contrario del rumbo inicial) }.
 *   caminarConGiros({ inicio, pasos })   pasos: ['avanza', cuadras], ['D'] o ['I'] (giro de 90°). { tramos (como en
 *                               recorrido), x, y, distancia, exacto, direccion, respuesta (texto 'N cuadras hacia el
 *                               …'), errores (textos de la misma forma): izquierda (giros al otro lado), sumaTodo (las
 *                               cuadras caminadas, con la dirección correcta), sumaCatetos (|x| + |y|, con la dirección
 *                               correcta) }.
 *   NOMBRES                     { N: 'norte', E: 'este', S: 'sur', O: 'oeste' }.
 *
 * Configuraciones predefinidas (motor.escena): las de la escena, para que el HTML y las pruebas usen los mismos datos.
 *   pastillas   { k: 6, t: 48 }                    una cada 6 h durante 2 días, lunes 8:00 a miércoles 8:00 → 9.
 *   combis      { intervalos: [12, 18], inicio: 360, fin: 540 }   6:00 a 9:00 → juntas a las 6:36; 6 veces.
 *   turno       { ciclo: 6, primero: 'lunes', n: 10 }               → sábado.
 *   monedas     { filas: 4 }                       → 3 jugadas.
 *   plaza       [['N', 7], ['E', 4], ['S', 2], ['E', 8]]           → 13 cuadras al noreste.
 *   dosPastillas { k: 8, t: 72, porToma: 2 }       → 20.
 *   tresCombis  { intervalos: [8, 10, 12], inicio: 360 }           → 120 min (8:00).
 *   guardia     { inicio: 'N', giros: [['D', 90], ['D', 90], ['D', 90], ['D', 180]] }   → 'E'.
 *   seisMonedas { filas: 3 }                       → 2 jugadas.
 *   pileta      { inicio: 'N', pasos: [['avanza', 4], ['D'], ['avanza', 6], ['D'], ['avanza', 12]] }   → 10 al sureste.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorTraslados = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-9;
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const NOMBRES = { N: 'norte', E: 'este', S: 'sur', O: 'oeste' };
  const RUMBOS = ['N', 'E', 'S', 'O'];
  const PASO = { N: [0, 1], E: [1, 0], S: [0, -1], O: [-1, 0] };

  // ---------- Utilidades ----------
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    return x;
  }
  function objeto(o, que) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  const casi = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  const igual = (a, b) => (typeof a === 'number' && typeof b === 'number' ? casi(a, b) : a === b);
  // Separa los errores que coinciden con la respuesta y los que repiten a otro anterior.
  function apartar(errores, correcto) {
    const e = {}, coinciden = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      const antes = Object.keys(e).find(j => igual(e[j], v));
      if (antes) { repetidos[k] = antes; continue; }
      e[k] = v;
    }
    return { errores: e, coinciden, repetidos };
  }
  const mcd2 = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  function enteros(lista, que, min) {
    if (!Array.isArray(lista) || lista.length < (min || 1)) throw new Error(`${que} debe ser una lista de al menos ${min || 1} números`);
    lista.forEach((x, k) => numero(x, `${que}[${k}]`, { entero: true, positivo: true }));
    return lista;
  }
  function mcd(lista) { enteros(lista, 'la lista'); return lista.reduce((a, b) => mcd2(a, b)); }
  function mcm(lista) { enteros(lista, 'la lista'); return lista.reduce((a, b) => a / mcd2(a, b) * b); }

  function horaTexto(min) {
    numero(min, 'los minutos', { entero: true, noNegativo: true });
    const dia = Math.floor(min / 1440), m = min % 1440, h = Math.floor(m / 60), mm = m % 60;
    const base = `${h}:${String(mm).padStart(2, '0')}`;
    return dia === 0 ? base : dia === 1 ? `${base} del día siguiente` : `${base} de dentro de ${dia} días`;
  }
  function indiceDia(d, que) {
    const k = DIAS.indexOf(d);
    if (k < 0) throw new Error(`${que || 'el día'} debe ser uno de: ${DIAS.join(', ')}`);
    return k;
  }
  const mas = (d, n) => DIAS[(((indiceDia(d) + n) % 7) + 7) % 7];

  // ---------- Sucesos que se repiten ----------
  function tomas(o) {
    objeto(o, 'tomas');
    const k = numero(o.k, 'k', { entero: true, positivo: true }), t = numero(o.t, 't', { entero: true, positivo: true });
    const porToma = o.porToma === undefined ? 1 : numero(o.porToma, 'porToma', { entero: true, positivo: true });
    const final = o.final === undefined ? true : !!o.final;
    const intervalos = Math.floor(t / k);
    const n = final ? intervalos + 1 : Math.ceil(t / k);
    const instantes = Array.from({ length: n }, (_, j) => j * k);
    const pastillas = n * porToma;
    const err = final
      ? { sinMasUno: intervalos * porToma, menosUno: (intervalos - 1) * porToma, deMas: (intervalos + 2) * porToma, sinMultiplicar: porToma > 1 ? n : null }
      : { conElFinal: (n + 1) * porToma, menosUno: (n - 1) * porToma, sinMultiplicar: porToma > 1 ? n : null };
    return Object.assign({ k, t, porToma, final, intervalos, tomas: n, pastillas, instantes, respuesta: pastillas }, apartar(err, pastillas));
  }

  function proximaCoincidencia(o) {
    objeto(o, 'proximaCoincidencia');
    const I = enteros(o.intervalos, 'intervalos', 2), inicio = o.inicio === undefined ? 0 : numero(o.inicio, 'inicio', { entero: true, noNegativo: true });
    const M = mcm(I), D = mcd(I), producto = I.reduce((a, b) => a * b, 1), suma = I.reduce((a, b) => a + b, 0);
    const err = { mcd: D, suma, producto, mcmDeDos: I.length >= 3 ? mcm(I.slice(0, 2)) : null };
    const A = apartar(err, M);
    const horas = {};
    for (const [k, v] of Object.entries(A.errores)) horas[k] = horaTexto(inicio + v);
    return Object.assign({ mcm: M, mcd: D, producto, suma, minutos: M, en: inicio + M, hora: horaTexto(inicio + M) }, A, { horas });
  }
  function salidas(o) {
    objeto(o, 'salidas');
    const p = numero(o.intervalo, 'intervalo', { entero: true, positivo: true }), a = numero(o.inicio, 'inicio', { entero: true }), b = numero(o.fin, 'fin', { entero: true });
    const out = []; for (let m = a; m <= b; m += p) out.push(m); return out;
  }
  function recorrerMinutos(o) {
    objeto(o, 'recorrerMinutos');
    const I = enteros(o.intervalos, 'intervalos', 1), a = numero(o.inicio, 'inicio', { entero: true }), b = numero(o.fin, 'fin', { entero: true });
    const espera = I.map(() => 0), juntas = [];
    for (let m = a; m <= b; m++) {
      // en el minuto a salen todas; después, cada una cuando su contador llega a su intervalo
      const salen = I.map((p, j) => m === a || espera[j] === p);
      salen.forEach((s, j) => { if (s) espera[j] = 0; });
      if (salen.every(Boolean)) juntas.push(m);
      espera.forEach((_, j) => { espera[j]++; });
    }
    return juntas;
  }
  function vecesCoinciden(o) {
    objeto(o, 'vecesCoinciden');
    const I = enteros(o.intervalos, 'intervalos', 2), inicio = numero(o.inicio, 'inicio', { entero: true, noNegativo: true }), fin = numero(o.fin, 'fin', { entero: true });
    if (fin < inicio) throw new Error('fin no puede ser antes de inicio');
    const M = mcm(I), lapso = fin - inicio, veces = Math.floor(lapso / M) + 1;
    const momentos = Array.from({ length: veces }, (_, j) => inicio + j * M);
    const comprobado = recorrerMinutos({ intervalos: I, inicio, fin }).join() === momentos.join();
    const D = mcd(I), producto = I.reduce((a, b) => a * b, 1), suma = I.reduce((a, b) => a + b, 0);
    const err = { sinLaPrimera: veces - 1, conSuma: Math.floor(lapso / suma) + 1, conMcd: Math.floor(lapso / D) + 1, conProducto: Math.floor(lapso / producto) + 1 };
    return Object.assign({ mcm: M, lapso, veces, momentos, horas: momentos.map(horaTexto), comprobado }, apartar(err, veces));
  }

  function diaSemana(o) {
    objeto(o, 'diaSemana');
    indiceDia(o.desde, 'desde');
    const dias = numero(o.dias, 'dias', { entero: true });
    return { dia: mas(o.desde, dias), resto: ((dias % 7) + 7) % 7 };
  }
  function descanso(o) {
    objeto(o, 'descanso');
    const ciclo = numero(o.ciclo, 'ciclo', { entero: true, positivo: true }), n = numero(o.n, 'n', { entero: true, positivo: true });
    indiceDia(o.primero, 'primero');
    const dias = (n - 1) * ciclo, resto = dias % 7, dia = mas(o.primero, dias);
    const err = { unCicloDeMas: mas(o.primero, n * ciclo), mismoDia: o.primero, alReves: mas(o.primero, -resto), cuentaElDiaDePartida: mas(o.primero, resto - 1) };
    return Object.assign({ ciclo, n, dias, semanas: Math.floor(dias / 7), resto, dia }, apartar(err, dia));
  }
  function recorrerDias(o) {
    objeto(o, 'recorrerDias');
    const ciclo = numero(o.ciclo, 'ciclo', { entero: true, positivo: true }), n = numero(o.n, 'n', { entero: true, positivo: true });
    let k = indiceDia(o.primero, 'primero'), d = 0, trabajados = 0;
    const descansos = [{ num: 1, dia: 0, nombre: DIAS[k] }];
    while (descansos.length < n) {
      d++; k = k === 6 ? 0 : k + 1;                       // el día siguiente, sin módulo
      if (trabajados === ciclo - 1) { descansos.push({ num: descansos.length + 1, dia: d, nombre: DIAS[k] }); trabajados = 0; }
      else trabajados++;
    }
    return { dia: descansos[n - 1].nombre, dias: d, descansos };
  }

  // ---------- Monedas en la red triangular ----------
  const clave = p => p[0] + ',' + p[1];
  function puntos(lista, que) {
    if (!Array.isArray(lista) || !lista.length) throw new Error(`${que} debe ser una lista de puntos [u, v]`);
    lista.forEach((p, k) => { if (!Array.isArray(p) || p.length !== 2) throw new Error(`${que}[${k}] debe ser [u, v]`); numero(p[0], `${que}[${k}][0]`, { entero: true }); numero(p[1], `${que}[${k}][1]`, { entero: true }); });
    return lista;
  }
  function triangulo(filas, invertido) {
    numero(filas, 'filas', { entero: true, positivo: true });
    const out = [];
    for (let v = 0; v < filas; v++) for (let u = 0; u < filas - v; u++) out.push(invertido ? [u + v, filas - 1 - v] : [u, v]);
    if (invertido) out.sort((p, q) => q[1] - p[1] || p[0] - q[0]);
    return out;
  }
  function minMovimientos(origen, destino) {
    puntos(origen, 'origen'); puntos(destino, 'destino');
    if (origen.length !== destino.length) throw new Error('origen y destino deben tener las mismas monedas');
    const O = new Set(origen.map(clave));
    if (O.size !== origen.length) throw new Error('origen tiene dos monedas en el mismo punto');
    let mejor = null;
    for (const p of origen) for (const q of destino) {
      const du = p[0] - q[0], dv = p[1] - q[1];
      const meta = destino.map(r => [r[0] + du, r[1] + dv]);
      const quedan = meta.filter(r => O.has(clave(r))).length;
      const peso = Math.abs(du) + Math.abs(dv);
      if (!mejor || quedan > mejor.quedan || (quedan === mejor.quedan && peso < mejor.peso)) mejor = { du, dv, meta, quedan, peso };
    }
    const M = new Set(mejor.meta.map(clave));
    return { minimo: origen.length - mejor.quedan, traslado: [mejor.du, mejor.dv], meta: mejor.meta,
      quedan: origen.filter(p => M.has(clave(p))), mover: origen.filter(p => !M.has(clave(p))), a: mejor.meta.filter(r => !O.has(clave(r))) };
  }
  function monedasTriangulo(o) {
    objeto(o, 'monedasTriangulo');
    const filas = numero(o.filas, 'filas', { entero: true, positivo: true });
    if (filas < 2) throw new Error('el triángulo necesita al menos 2 filas');
    const inicio = triangulo(filas), R = minMovimientos(inicio, triangulo(filas, true)), N = inicio.length;
    const err = { esquinas: 3, dosPuntas: 2, filaMasLarga: filas, mitad: Math.ceil(N / 2), filaYPunta: filas + 1, todas: N };
    return Object.assign({ filas, monedas: N, inicio, meta: R.meta, minimo: R.minimo, mover: R.mover, a: R.a }, apartar(err, R.minimo));
  }
  function revisarMonedas(pos, filas) {
    puntos(pos, 'posiciones'); numero(filas, 'filas', { entero: true, positivo: true });
    const repetida = new Set(pos.map(clave)).size !== pos.length;
    if (repetida) return { llego: false, faltan: null, repetida };
    const R = minMovimientos(pos, triangulo(filas, true));
    return { llego: R.minimo === 0, faltan: R.minimo, repetida };
  }

  // ---------- Puntos cardinales ----------
  function rumbo(r, que) { if (!PASO[r]) throw new Error(`${que || 'el rumbo'} debe ser 'N', 'E', 'S' u 'O'`); return r; }
  // texto exacto de √n: '13', '5√2'
  function raizTexto(n2) {
    if (n2 === 0) return '0';
    let a = 1, b = n2;
    for (let f = 2; f * f <= b; f++) while (b % (f * f) === 0) { b /= f * f; a *= f; }
    return b === 1 ? String(a) : `${a === 1 ? '' : a}√${b}`;
  }
  function direccion(x, y) {
    if (x === 0 && y === 0) return 'el mismo lugar';
    const ns = y > 0 ? 'nor' : y < 0 ? 'sur' : '', eo = x > 0 ? 'este' : x < 0 ? 'oeste' : '';
    if (!eo) return y > 0 ? 'norte' : 'sur';
    if (!ns) return eo;
    return ns + eo;           // noreste, noroeste, sureste, suroeste
  }
  function recorrido(tramos) {
    if (!Array.isArray(tramos) || !tramos.length) throw new Error('tramos debe ser una lista de [rumbo, cuadras]');
    let x = 0, y = 0, total = 0, nx = 0, ny = 0;
    const pts = [[0, 0]];
    tramos.forEach((t, k) => {
      if (!Array.isArray(t) || t.length !== 2) throw new Error(`tramos[${k}] debe ser [rumbo, cuadras]`);
      const [r, c] = [rumbo(t[0], `tramos[${k}][0]`), numero(t[1], `tramos[${k}][1]`, { entero: true, noNegativo: true })];
      x += PASO[r][0] * c; y += PASO[r][1] * c; total += c;
      nx += Math.abs(PASO[r][0]) * c; ny += Math.abs(PASO[r][1]) * c;
      pts.push([x, y]);
    });
    const d2 = x * x + y * y, distancia = Math.sqrt(d2);
    const err = { sumaTodo: total, sumaCatetos: Math.abs(x) + Math.abs(y), sinRestar: Math.hypot(nx, ny) };
    return Object.assign({ x, y, puntos: pts, total, distancia, d2, exacto: raizTexto(d2), direccion: direccion(x, y) }, apartar(err, distancia));
  }
  function girar(r, lado, grados) {
    rumbo(r);
    if (lado !== 'D' && lado !== 'I') throw new Error("el lado debe ser 'D' o 'I'");
    numero(grados, 'grados', { entero: true });
    if (grados % 90 !== 0) throw new Error('los grados deben ser múltiplo de 90');
    const pasos = (lado === 'D' ? 1 : -1) * grados / 90;
    return RUMBOS[(((RUMBOS.indexOf(r) + pasos) % 4) + 4) % 4];
  }
  const opuesto = r => girar(r, 'D', 180);
  function aplicar(inicio, lista, como) {
    let r = inicio;
    for (const [lado, g] of lista) {
      if (como === 'izquierda') r = girar(r, lado === 'D' ? 'I' : 'D', g);
      else if (como === 'sinMedia' && g % 360 === 180) continue;
      else if (como === 'mediaComoCuarto' && g % 360 === 180) r = girar(r, lado, 90);
      else if (como === 'mediaDesdeElInicio' && g % 360 === 180) r = opuesto(inicio);
      else r = girar(r, lado, g);
    }
    return r;
  }
  function giros(o) {
    objeto(o, 'giros');
    const inicio = rumbo(o.inicio, 'inicio');
    if (!Array.isArray(o.giros)) throw new Error('giros debe ser una lista de [lado, grados]');
    o.giros.forEach((g, k) => { if (!Array.isArray(g) || g.length !== 2) throw new Error(`giros[${k}] debe ser [lado, grados]`); girar('N', g[0], g[1]); });
    const rumbos = [inicio]; let r = inicio, neto = 0;
    for (const [lado, g] of o.giros) { r = girar(r, lado, g); rumbos.push(r); neto += (lado === 'D' ? 1 : -1) * g; }
    const err = {};
    for (const k of ['izquierda', 'sinMedia', 'mediaComoCuarto', 'mediaDesdeElInicio']) err[k] = NOMBRES[aplicar(inicio, o.giros, k)];
    return Object.assign({ final: r, nombre: NOMBRES[r], rumbos, neto: ((neto % 360) + 360) % 360 }, apartar(err, NOMBRES[r]));
  }
  function caminar(inicio, pasos, alReves) {
    let r = inicio; const tramos = [];
    pasos.forEach((p, k) => {
      if (!Array.isArray(p)) throw new Error(`pasos[${k}] debe ser ['avanza', cuadras], ['D'] o ['I']`);
      if (p[0] === 'avanza') tramos.push([r, numero(p[1], `pasos[${k}][1]`, { entero: true, noNegativo: true })]);
      else if (p[0] === 'D' || p[0] === 'I') r = girar(r, alReves ? (p[0] === 'D' ? 'I' : 'D') : p[0], 90);
      else throw new Error(`pasos[${k}] debe ser ['avanza', cuadras], ['D'] o ['I']`);
    });
    return tramos;
  }
  const textoCuadras = (n, dir) => `${n} ${n === '1' ? 'cuadra' : 'cuadras'} hacia el ${dir}`;
  function caminarConGiros(o) {
    objeto(o, 'caminarConGiros');
    const inicio = rumbo(o.inicio, 'inicio');
    if (!Array.isArray(o.pasos) || !o.pasos.length) throw new Error('pasos debe ser una lista');
    const tramos = caminar(inicio, o.pasos), R = recorrido(tramos), Ri = recorrido(caminar(inicio, o.pasos, true));
    const respuesta = textoCuadras(R.exacto, R.direccion);
    const err = { izquierda: textoCuadras(Ri.exacto, Ri.direccion), sumaTodo: textoCuadras(String(R.total), R.direccion),
      sumaCatetos: textoCuadras(String(Math.abs(R.x) + Math.abs(R.y)), R.direccion) };
    return Object.assign({ tramos, x: R.x, y: R.y, puntos: R.puntos, total: R.total, distancia: R.distancia, exacto: R.exacto, direccion: R.direccion, respuesta }, apartar(err, respuesta));
  }

  const escena = {
    pastillas: { k: 6, t: 48 },
    combis: { intervalos: [12, 18], inicio: 360, fin: 540 },
    turno: { ciclo: 6, primero: 'lunes', n: 10 },
    monedas: { filas: 4 },
    plaza: [['N', 7], ['E', 4], ['S', 2], ['E', 8]],
    dosPastillas: { k: 8, t: 72, porToma: 2 },
    tresCombis: { intervalos: [8, 10, 12], inicio: 360 },
    guardia: { inicio: 'N', giros: [['D', 90], ['D', 90], ['D', 90], ['D', 180]] },
    seisMonedas: { filas: 3 },
    pileta: { inicio: 'N', pasos: [['avanza', 4], ['D'], ['avanza', 6], ['D'], ['avanza', 12]] },
  };

  return { DIAS, NOMBRES, horaTexto, mcd, mcm, tomas, proximaCoincidencia, salidas, recorrerMinutos, vecesCoinciden, diaSemana,
    descanso, recorrerDias, triangulo, minMovimientos, monedasTriangulo, revisarMonedas, recorrido, girar, giros, caminarConGiros, escena };
});
