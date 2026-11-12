/*
 * Generador: planteo con horas, relojes que se adelantan y calendarios (razonamiento matemático,
 * cronometría y calendarios). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-relojes']) y en Node (require). No usa ningún motor.
 *
 * Convenciones (las mismas de plantillas/relojes-calendarios/motor.js): horas del día en minutos desde las
 * 0:00 y escritas «3:36 p. m.»; un reloj de agujas vuelve a marcar la hora correcta cuando acumula 720 min
 * (12 h) de adelanto o de atraso; días de la semana con índice 0 = lunes … 6 = domingo; calendario gregoriano.
 *
 * Tipos y sus _datos:
 *   que-hora     relación entre lo que pasó del día y lo que falta. { tipo, forma: 'razon' | 'fraccion' |
 *                'hace-dentro' | 'pasado-dentro', p, q (razón o fracción), a, b (horas), k }
 *   turno        un turno o una reunión de duración fija: la hora actual, lo que falta del turno, o a qué hora
 *                empezó o terminará la reunión. { tipo, forma: 'hora' | 'falta' | 'inicio' | 'fin', D (horas),
 *                inicio (min, en 'hora' y 'falta'), ahora (min, en 'inicio' y 'fin'), p, q }
 *   anio         la fracción del año transcurrido. { tipo, anio, p, q }
 *   adelanto     un reloj se adelanta (o atrasa) a min por día: fecha en que vuelve a marcar bien.
 *                { tipo, a, sentido, desde: { a, m, d }, hora }
 *   dos-relojes  uno se adelanta a y otro se atrasa b min por día: días hasta que marquen bien a la vez. { tipo, a, b }
 *   creciente    el atraso crece cada día en r min (a1, a1 + r, …): días o fecha. { tipo, a1, r, pide, desde, hora }
 *   calendario   'maximo': cuántos días de una clase puede tener como máximo un año; 'inicio': qué día de la
 *                semana debe empezar un periodo para tener la mayor cantidad de días de una clase.
 *                { tipo, forma, N (días), clase: [índices], ... }
 *   retraso      una persona llega tarde a un examen de duración fija; el tiempo desde una hora de referencia hasta
 *                que empezó el examen es una fracción del que hay desde que termina hasta otra hora: a qué hora llegó.
 *                { tipo, H0, Hf (min), D (min), r (retraso, min), q (la parte es 1/q del tiempo de después) }
 *                (UNMSM 2019-II: H0 = 18:00, Hf = 22:00, D = 105, r = 25, q = 4; semilla 'unmsm-2019-II-10mar-31'.)
 *   jornada      las horas transcurridas del día son un número de dos cifras y las que faltan para que termine el
 *                día cumplen una relación con sus cifras; se pregunta lo que falta (o lo que ya pasó) de la
 *                jornada. { tipo, rel: 'suma'|'suma+2'|'suma-1'|'producto'|'doble-decenas'|'triple-unidades',
 *                S, J (horas de inicio y fin de la jornada), pide: 'falta'|'ya' }
 *                (UNMSM 2024-II: suma, S = 15, J = 23, falta; semilla 'unmsm-2024-II-18'.)
 *   mentirosos   dos personas que mienten ciertos días y dicen algo sobre ayer o mañana: qué día es (o qué día
 *                fue ayer, o será mañana). { tipo, mienteA, mienteB, dichoA, dichoB, pide }
 *
 * Respuestas: horas del día y duraciones en minutos (número); fechas con clave 'f:AAAA-MM-DD' o 'min:<minutos
 * desde el inicio del año>'; días de la semana con clave 'dia:<índice>'; cantidades de días como número.
 *
 * calc (puras): hora(min) → texto; anioMinutos(min, anio) → { m, d, min } (fecha y hora dentro del año);
 *   sumarDias({ a, m, d }, n); diaSemanaMax({ N, clase }) → { maximo, inicio (índice del mejor primer día) };
 *   mentirosos({ mienteA, mienteB, dichoA, dichoB }) → índices de los días posibles; vueltaCorrecta(a) → 720/a;
 *   mcm(a, b); diasCreciente(a1, r) → días hasta que la suma a1 + (a1 + r) + … llegue justo a 720 (NaN si se pasa).
 *
 * Errores (hipótesis salvo donde se dice; docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md):
 *   RMP48 confundir lo de antes con lo de después (lo que pasó con lo que falta, hace con dentro, inicio con fin,
 *   ayer con mañana); RMP44 confundir las 12 horas del reloj con las 24 del día (día de 12 h, a. m. por p. m.,
 *   1440 min en vez de 720); RMP47 olvidar el 29 de febrero (o contar uno que no hay); RMP49 creerle al
 *   mentiroso; RMP1 contar el día de partida (días transcurridos contra día en curso); RMP2 no maximizar;
 *   AR5 dato intermedio (la hora y no lo que falta; el día del encuentro y no el siguiente); AR7 atraso
 *   constante en vez de creciente (parcial); RMP85 leer la parte decimal de las horas como minutos (13,5 h
 *   como 13 h 50 min); AR13 MCD o producto en vez
 *   de MCM (parcial); AR18 quedarse con un día que cumple una sola condición (parcial).
 * Errores de «retraso» y «jornada» (cierre-100, 12 nov 2026; hipótesis): RMP100 olvidar sumar el retraso (dar la hora
 *   en que empezó el examen), RMP101 invertir la razón (la parte de antes como múltiplo de la de después), RMP102
 *   repartir todo el intervalo sin quitar la duración del examen, RMP103 restar el retraso en vez de sumarlo;
 *   RMP104 dar lo que falta del día cuando se pregunta por la jornada, RMP105 dar lo que ya se trabajó en vez de lo
 *   que falta (y AR5 de la hora actual y de la duración completa, RMP48 de pasado por falta).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-relojes';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const par = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: RM });
  const ht = (id, r, explicacion, respaldo = 'hipotesis') => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente: respaldo === 'parcial' ? RM : null } : null);
  const v = P.v;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => a / mcd(a, b) * b;
  const ent = x => Number.isInteger(x) || Math.abs(x - Math.round(x)) < 1e-9;
  const fr = (p, q) => (q === 1 ? `${p}` : `${p}/${q}`);
  // «el triple», «los 7/5», «1/3»: cómo se dice la fracción en el enunciado.
  const fraseFr = (p, q) => (q === 1 ? ({ 2: 'el doble de', 3: 'el triple de', 4: 'el cuádruple de' }[p] || `${p} veces`) : p === 1 ? `${p}/${q} de` : `los ${p}/${q} de`);

  // ---------- horas ----------
  function hora(min) {
    const m = ((Math.round(min) % 1440) + 1440) % 1440, H = Math.floor(m / 60), M = m % 60;
    return `${H % 12 === 0 ? 12 : H % 12}:${String(M).padStart(2, '0')} ${H < 12 ? 'a. m.' : 'p. m.'}`;
  }
  const horaOk = m => ent(m) && m > 0 && m < 1440 && Math.round(m) % 720 !== 0;
  function dur(min) {
    const H = Math.floor(min / 60), M = Math.round(min % 60);
    return H && M ? `${H} h ${M} min` : H ? `${H} h` : `${M} min`;
  }
  const hDec = min => P.formatear(min / 60, 2);

  // ---------- calendario ----------
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const bisiesto = a => (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
  const diasMes = (m, a, feb = null) => [31, feb !== null ? feb : (bisiesto(a) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  // n días después de una fecha; feb fuerza los días de febrero (para el error del bisiesto).
  function sumarDias(f, n, feb = null) {
    let { a, m, d } = f;
    while (n > 0) { d++; if (d > diasMes(m, a, feb)) { d = 1; m++; if (m > 12) { m = 1; a++; } } n--; }
    while (n < 0) { d--; if (d < 1) { m--; if (m < 1) { m = 12; a--; } d = diasMes(m, a, feb); } n++; }
    return { a, m, d };
  }
  const fechaTxt = (f, conAnio = true) => `${f.d} de ${MESES[f.m - 1]}${conAnio ? ` de ${f.a}` : ''}`;
  const clF = f => `f:${f.a}-${String(f.m).padStart(2, '0')}-${String(f.d).padStart(2, '0')}`;
  const fecha = f => ({ clave: clF(f), texto: fechaTxt(f) });
  // ¿Hay un 29 de febrero entre f (excluido) y n días después (incluido)?
  function cruza29(f, n) { let g = f; for (let i = 0; i < n; i++) { g = sumarDias(g, 1); if (g.m === 2 && g.d === 29) return true; } return false; }
  function cruzaFebrero(f, n) { let g = f; for (let i = 0; i < n; i++) { g = sumarDias(g, 1); if (g.m === 3 && g.d === 1) return true; } return false; }
  // Minutos desde el inicio del año → fecha y hora.
  // feb fuerza los días de febrero (para el error del bisiesto: el año supuesto con 365 o 366 días).
  function anioMinutos(min, anio, feb = null) {
    let dia = Math.floor(min / 1440), m = 1;
    while (dia >= diasMes(m, anio, feb)) { dia -= diasMes(m, anio, feb); m++; }
    return { m, d: dia + 1, min: min % 1440 };
  }

  const NOMBRES = [['Rosa', 'Tito'], ['Lucha', 'Pepe'], ['Ana', 'Beto'], ['Celia', 'Juan'], ['Nora', 'Raúl']];

  // Preguntas oficiales reproducidas tal cual (UNMSM): semilla → [tipo, datos]; la solución y la figura son propias.
  const OFICIAL = {
    'unmsm-2019-II-10mar-31': ['retraso', { tipo: 'retraso', H0: 1080, Hf: 1320, D: 105, r: 25, q: 4 }],
    'unmsm-2024-II-18': ['jornada', { tipo: 'jornada', rel: 'suma', S: 15, J: 23, pide: 'falta' }],
  };
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const FIJO = { 1: 'que-hora', 2: 'adelanto', 3: 'calendario' };
    const m = /^(entrada|salida)-([123])$/.exec(String(semilla));
    let tipo = m ? FIJO[m[2]] : rng.elegir(['que-hora', 'que-hora', 'turno', 'turno', 'anio', 'adelanto', 'dos-relojes', 'creciente', 'calendario', 'calendario', 'mentirosos', 'mentirosos']);
    // Los tipos de cierre-100 salen de un sorteo aparte, para no mover lo que ya se había generado con cada semilla.
    const lado = Azar.crear(`${ID}|nuevos|${semilla}`);
    if (!m && lado.sig() < 0.15) tipo = lado.elegir(['retraso', 'jornada']);
    const of = OFICIAL[semilla];
    if (of) tipo = of[0];
    for (let intento = 0; intento < 3000; intento++) {
      const pr = ({ 'que-hora': queHora, turno, anio, adelanto, 'dos-relojes': dosRelojes, creciente, calendario, mentirosos, retraso, jornada })[tipo](rng, semilla, of && of[1]);
      if (pr && pr.alternativas.length >= 4) return pr;
      if (of) break;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  // «a. m.» al final de un trozo seguido de un punto: un solo punto.
  function puntos(l) {
    const r = l.map(x => (typeof x === 'string' ? x.replace(/m\.\./g, 'm.') : x));
    for (let i = 0; i + 1 < r.length; i++) {
      const a = typeof r[i] === 'string' ? r[i] : r[i].t, b = r[i + 1];
      if (/m\.$/.test(a) && typeof b === 'string' && b.startsWith('.')) r[i + 1] = b.slice(1);
    }
    return r;
  }
  function cerrar(semilla, o) {
    o.enunciado = puntos(o.enunciado); o.solucion = o.solucion.map(puntos);
    o.alternativas = o.alternativas.map(a => (a.error ? { ...a, error: { ...a.error, explicacion: a.error.explicacion.replace(/m\.\./g, 'm.') } } : a));
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas: o.alternativas, solucion: o.solucion, respuesta: { valor: o.valor, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }
  const armarHora = (rng, correcta, errores) => P.armar({ correcta, errores: errores.filter(e => horaOk(e.valor)), rng, texto: hora });

  // ---------- ¿qué hora es? ----------
  // Con «hace» y «dentro de», cada plazo con su color; la relación (el doble, el triple…) queda sin color.
  const VAR_HD = { H: { nombre: 'hace', color: 'o' }, f: { nombre: 'lo que falta', color: 'i' }, E: { nombre: 'dentro de', color: 'h' }, x: { nombre: 'la hora', color: 'd' } };
  const VAR_PD = { H: { nombre: 'hace', color: 'o' }, t: { nombre: 'lo que pasó', color: 'i' }, E: { nombre: 'dentro de', color: 'h' }, x: { nombre: 'la hora', color: 'd' } };
  const VAR_DIA = { t: { nombre: 'lo que pasó', color: 'o' }, f: { nombre: 'lo que falta', color: 'i' }, k: { nombre: 'relación', color: 'h' }, x: { nombre: 'la hora', color: 'd' } };
  function queHora(rng, semilla) {
    const forma = rng.elegir(['razon', 'fraccion', 'hace-dentro', 'hace-dentro', 'pasado-dentro']);
    let x, enunciado, solucion, p = null, q = null, a = null, b = null, k = null;
    const errores = [];
    const amPm = xx => (xx < 720 ? xx + 720 : xx - 720);
    if (forma === 'razon' || forma === 'fraccion') {
      p = rng.entero(1, 7); q = rng.entero(1, 7);
      if (p === q || mcd(p, q) !== 1) return null;
      // razon: pasó : falta = p : q.  fraccion: falta = (p/q) de lo que pasó, o sea pasó : falta = q : p.
      const [P1, Q1] = forma === 'razon' ? [p, q] : [q, p];
      x = 1440 * P1 / (P1 + Q1);
      if (!horaOk(x)) return null;
      enunciado = forma === 'razon'
        ? ['Las horas que ya ', v('t', 'pasaron'), ' del día y las que ', v('f', 'faltan'), ' para que termine están en la razón de ', v('k', `${p} a ${q}`), '.']
        : ['Lo que ', v('f', 'falta'), ' del día para que termine es ', v('k', fraseFr(p, q)), ' lo que ya ', v('t', 'pasó'), '.'];
      solucion = [
        ['Si ya pasaron ', v('t', 'x'), ' horas, faltan ', v('f', '24 − x'), '. El día entero son 24 horas (no 12).'],
        forma === 'razon' ? ['La razón ', v('k', `${p} a ${q}`), ` reparte las 24 horas en ${p} + ${q} = ${p + q} partes: `, v('t', `x = 24 · ${p}/${p + q} h = ${dur(x)}`), '.']
          : [v('f', '24 − x'), ' = ', v('k', fr(p, q)), ' · ', v('t', 'x'), ` → 24 = x · (1 + ${fr(p, q)}) = x · ${fr(p + q, q)} → `, v('t', `x = 24 · ${q}/${p + q} h = ${dur(x)}`), '.'],
        [`${dur(x)} después de la medianoche: son las `, v('x', hora(x)), '.'],
      ];
      errores.push(h('RMP48-pasado-por-falta', 1440 - x, `Cambiaste lo que pasó con lo que falta: ${dur(1440 - x)} es lo que falta para que termine el día, no lo que ya pasó desde la medianoche.`));
      errores.push(h('RMP44-dia-de-12', x / 2, 'Hiciste las cuentas con un día de 12 horas. El día tiene 24 horas: lo que pasa más lo que falta suma 24.'));
    } else if (forma === 'hace-dentro') {
      // Hace a horas faltaba k veces lo que faltará dentro de b horas: 24 − x + a = k(24 − x − b).
      a = rng.entero(1, 8); b = rng.entero(1, 6); k = rng.entero(2, 5);
      const F = (k * b + a) / (k - 1);          // lo que falta ahora, en horas
      x = 1440 - 60 * F;
      if (!horaOk(x) || x - 60 * a <= 0 || x + 60 * b >= 1440 || F <= b) return null;
      const VEZ = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple', 5: 'el quíntuple' };
      enunciado = ['Hace ', v('H', `${a} ${a === 1 ? 'hora' : 'horas'}`), `, lo que faltaba para que terminara el día era ${VEZ[k]} de lo que `, v('f', 'faltará'), ' dentro de ', v('E', `${b} ${b === 1 ? 'hora' : 'horas'}`), '.'];
      solucion = [
        ['Llama ', v('f', 'f'), ' a las horas que faltan ahora para que termine el día. Hace ', v('H', `${a} h`), ` faltaban f + ${a}; dentro de `, v('E', `${b} h`), ` faltarán f − ${b}.`],
        ['Ecuación: ', `f + ${a} = ${k} · (f − ${b}) → ${a} + ${k * b} = ${k - 1}f → `, v('f', `f = ${ent(F) ? F : fr(k * b + a, k - 1)} h = ${dur(60 * F)}`), '.'],
        [`Ya pasaron 24 h − ${dur(60 * F)} = ${dur(x)} desde la medianoche: son las `, v('x', hora(x)), '.'],
      ];
      errores.push(h('RMP48-pasado-por-falta', 1440 - x, `Esa hora corresponde a lo que falta (${dur(60 * F)}), no a lo que ya pasó desde la medianoche. Hay que restarlo de 24 h.`));
      errores.push(h('RMP48-hace-por-dentro', 1440 - 60 * (k * a + b) / (k - 1), 'Cambiaste las horas de «hace» con las de «dentro de». Hace un tiempo faltaba más que ahora (se suma); dentro de un tiempo faltará menos (se resta).'));
      errores.push(h('AR5-hora-de-entonces', x - 60 * a, `Esa es la hora de hace ${a} ${a === 1 ? 'hora' : 'horas'}, no la de ahora.`));
      errores.push(h('RMP44-dia-de-12', 720 - 60 * F, 'Restaste de 12 horas, como si el día tuviera 12. Desde la medianoche hasta la medianoche hay 24 horas.'));
    } else {
      // Dentro de a horas habrá pasado k veces lo que había pasado hace b horas: x + a = k(x − b).
      a = rng.entero(1, 8); b = rng.entero(1, 6); k = rng.entero(2, 4);
      const X = (a + k * b) / (k - 1);
      x = 60 * X;
      if (!horaOk(x) || x - 60 * b <= 0 || x + 60 * a >= 1440) return null;
      const VEZ = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple' };
      enunciado = ['Dentro de ', v('E', `${a} ${a === 1 ? 'hora' : 'horas'}`), `, las horas que habrán pasado del día serán ${VEZ[k]} de las que habían pasado hace `, v('H', `${b} ${b === 1 ? 'hora' : 'horas'}`), '.'];
      solucion = [
        ['Llama ', v('t', 'x'), ' a las horas que pasaron desde la medianoche. Dentro de ', v('E', `${a} h`), ` habrán pasado x + ${a}; hace `, v('H', `${b} h`), ` habían pasado x − ${b}.`],
        ['Ecuación: ', `x + ${a} = ${k} · (x − ${b}) → ${a} + ${k * b} = ${k - 1}x → `, v('t', ent(X) ? `x = ${X} h` : `x = ${fr(a + k * b, k - 1)} h = ${dur(x)}`), '.'],
        ['Son las ', v('x', hora(x)), '.'],
      ];
      errores.push(h('RMP48-pasado-por-falta', 1440 - x, `${dur(x)} es lo que ya pasó desde la medianoche, y eso da la hora. Restarlo de 24 h da lo que falta, no la hora.`));
      errores.push(h('RMP48-hace-por-dentro', 60 * (b + k * a) / (k - 1), 'Cambiaste las horas de «hace» con las de «dentro de»: dentro de un tiempo habrá pasado más (se suma) y hace un tiempo había pasado menos (se resta).'));
      errores.push(h('AR5-hora-de-despues', x + 60 * a, `Esa es la hora de dentro de ${a} ${a === 1 ? 'hora' : 'horas'}, no la de ahora.`));
    }
    errores.push(h('RMP44-am-pm', amPm(x), `Las cuentas están bien, pero ${x < 720 ? 'antes del mediodía es a. m.' : 'después del mediodía es p. m.'}: ${dur(x)} después de la medianoche son las ${hora(x)}.`));
    // 13,5 h leído como 13 h 50 min: la parte decimal (en centésimas) tomada como minutos.
    const cent = Math.round((x / 60 - Math.floor(x / 60)) * 100);
    if (!ent(x / 60) && ent((x / 60) * 100) && cent < 60 && cent !== Math.round(x % 60)) errores.push(h('RMP85-decimal-como-minutos', Math.floor(x / 60) * 60 + cent, `Leíste ${hDec(x)} h como ${Math.floor(x / 60)} h ${cent} min. La parte decimal es una fracción de hora: ${P.formatear(x / 60 - Math.floor(x / 60), 2)} · 60 = ${Math.round(x % 60)} min.`));
    const alternativas = armarHora(rng, x, errores);
    return cerrar(semilla, { variables: forma === 'hace-dentro' ? VAR_HD : forma === 'pasado-dentro' ? VAR_PD : VAR_DIA, enunciado, pregunta: ['¿Qué hora es?'], alternativas, solucion, valor: x, unidad: 'min',
      datos: { tipo: 'que-hora', forma, p, q, a, b, k } });
  }

  // ---------- llegar tarde a un examen ----------
  const PARTE = { 2: 'la mitad', 3: 'la tercera parte', 4: 'la cuarta parte', 5: 'la quinta parte' };
  const NOM_RET = ['Pedro', 'Rosa', 'Luis', 'Carmen', 'Mario', 'Elena'];
  // Minutos antes de que empiece el examen: x + q·x + D = Hf − H0. Llegada = H0 + x + r.
  const llegada = (H0, Hf, D, q, r) => H0 + (Hf - H0 - D) / (1 + q) + r;
  function retraso(rng, semilla, fijo) {
    let o = fijo;
    if (!o) {
      const q = rng.elegir([2, 3, 4, 5]);
      const H0 = rng.elegir([360, 480, 540, 840, 900, 960, 1080]), T = 60 * rng.entero(3, 8);
      o = { tipo: 'retraso', H0, Hf: H0 + T, D: 5 * rng.entero(9, 30), r: rng.elegir([10, 15, 20, 25, 30]), q };
    }
    const { H0, Hf, D, r, q } = o, T = Hf - H0;
    const x = (T - D) / (1 + q);
    if (!ent(x) || x < 10 || x > 90 || r >= D || Hf >= 1440) return null;
    const lleg = H0 + x + r;
    if (!horaOk(lleg)) return null;
    const nom = rng.elegir(NOM_RET);
    const variables = { r: { nombre: 'retraso', color: 'o' }, D: { nombre: 'duración del examen', color: 'i' }, k: { nombre: 'la fracción', color: 'h' }, x: { nombre: 'la hora de llegada', color: 'd' } };
    const enunciado = [`${nom} llegó con `, v('r', `${r} minutos`), ' de retraso a un examen que duraba ', v('D', `${D} minutos`), ' y que empezó a su hora. Notó que el tiempo que transcurrió desde las ', hora(H0),
      ' hasta que empezó el examen era ', v('k', PARTE[q]), ' del tiempo que transcurriría desde que terminó el examen hasta las ', hora(Hf), '.'];
    const solucion = [
      [`Entre las ${hora(H0)} y las ${hora(Hf)} hay ${dur(T)}. El examen ocupa `, v('D', dur(D)), `, así que para el tiempo de antes y el de después quedan ${dur(T - D)}.`],
      ['Si el tiempo de antes es ', v('k', 'x'), `, como es ${PARTE[q]} del de después, el de después es ${q}x. Entonces x + ${q}x = ${dur(T - D)} → ${q + 1}x = ${dur(T - D)} → `, v('k', `x = ${dur(x)}`), '.'],
      [`El examen empezó a las ${hora(H0)} + ${dur(x)} = ${hora(H0 + x)}.`],
      [v('r', `${nom} llegó ${r} minutos después`), `: ${hora(H0 + x)} + ${r} min = `, v('x', hora(lleg)), '.'],
    ];
    const errores = [
      h('RMP100-sin-retraso', H0 + x, `Esa es la hora en que empezó el examen. ${nom} llegó ${r} minutos después, y la pregunta pide la hora de llegada.`),
      h('RMP101-razon-invertida', H0 + (q * (T - D)) / (1 + q) + r, `Tomaste el tiempo de antes como ${q} veces el de después. Si lo de antes es ${PARTE[q]} de lo de después, lo de después es el que tiene ${q} partes.`),
      h('RMP102-sin-duracion', H0 + T / (1 + q) + r, `Repartiste todo el intervalo entre las partes. Una parte de ese intervalo es el examen mismo (${dur(D)}): hay que quitarlo antes de repartir.`),
      h('RMP103-retraso-restado', H0 + x - r, `Restaste el retraso. Llegar con retraso es llegar después de la hora de inicio: se suma.`),
      h('AR5-hora-de-fin', H0 + x + D, 'Esa es la hora en que termina el examen, no la hora de llegada.'),
      h('RMP44-am-pm', lleg < 720 ? lleg + 720 : lleg - 720, 'La cuenta está bien, pero confundiste a. m. con p. m.'),
    ];
    return cerrar(semilla, { variables, enunciado, pregunta: ['¿A qué hora llegó ', nom, '?'], alternativas: armarHora(rng, lleg, errores), solucion, valor: lleg, unidad: 'min', datos: o });
  }

  // ---------- horas transcurridas de dos cifras y lo que falta de la jornada ----------
  const RELACIONES = {
    suma: { f: (a, b) => a + b, t: 'la suma de las cifras de las horas transcurridas', e: (a, b) => `${a} + ${b}` },
    'suma+2': { f: (a, b) => a + b + 2, t: 'dos más que la suma de las cifras de las horas transcurridas', e: (a, b) => `${a} + ${b} + 2` },
    'suma-1': { f: (a, b) => a + b - 1, t: 'una menos que la suma de las cifras de las horas transcurridas', e: (a, b) => `${a} + ${b} − 1` },
    producto: { f: (a, b) => a * b, t: 'el producto de las cifras de las horas transcurridas', e: (a, b) => `${a} × ${b}` },
    'doble-decenas': { f: (a, b) => 2 * a, t: 'el doble de la cifra de las decenas de las horas transcurridas', e: (a, b) => `2 × ${a}` },
    'triple-unidades': { f: (a, b) => 3 * b, t: 'el triple de la cifra de las unidades de las horas transcurridas', e: (a, b) => `3 × ${b}` },
  };
  // Las horas transcurridas (de 10 a 23) cuyas horas que faltan para las 24 cumplen la relación.
  const horasDosCifras = rel => { const r = []; for (let t = 10; t < 24; t++) if (24 - t === RELACIONES[rel].f(Math.floor(t / 10), t % 10)) r.push(t); return r; };
  const NOM_JOR = ['Roberto', 'Marisol', 'Hugo', 'Teresa', 'Wilmer', 'Dina'];
  const LUGAR_JOR = ['una empresa textil', 'una panadería', 'una planta de lácteos', 'una fábrica de calzado', 'un taller de cerámica'];
  const hs = n => `${n} ${n === 1 ? 'hora' : 'horas'}`;
  function jornada(rng, semilla, fijo) {
    let o = fijo;
    if (!o) {
      const rel = rng.elegir(Object.keys(RELACIONES)), t0 = horasDosCifras(rel)[0];
      o = { tipo: 'jornada', rel, S: rng.elegir([6, 7, 8, 12, 13, 14, 15].filter(S => S <= t0 - 2)), J: rng.entero(t0 + 1, 23), pide: rng.elegir(['falta', 'falta', 'ya']) };
    }
    const sols = horasDosCifras(o.rel);
    if (sols.length !== 1 || o.S === undefined || o.J === undefined) return null;
    const t = sols[0], R = RELACIONES[o.rel];
    if (!(o.S < t && t < o.J && o.J < 24 && o.J - o.S >= 6)) return null;
    const a = Math.floor(t / 10), b = t % 10, resp = o.pide === 'falta' ? o.J - t : t - o.S;
    const nom = rng.elegir(NOM_JOR), lugar = rng.elegir(LUGAR_JOR);
    const variables = { t: { nombre: 'horas transcurridas del día', color: 'o' }, f: { nombre: 'horas que faltan del día', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`${nom} trabaja en ${lugar}, desde las ${o.S} horas hasta las ${o.J} horas. Las `, v('t', 'horas transcurridas del día'), ' son un número de dos cifras, y las ', v('f', 'horas que faltan'), ' para que termine el día son ', R.t, '.'];
    const pregunta = o.pide === 'falta' ? ['¿Cuántas horas le faltan para terminar su jornada?'] : [`¿Cuántas horas de su jornada ya trabajó ${nom}?`];
    const solucion = [
      ['Si han transcurrido ', v('t', 't'), ' horas del día (de 24), faltan ', v('f', '24 − t'), '. Como t tiene dos cifras, va de 10 a 23.'],
      [`Se prueba cada valor de t entre 10 y 23: lo que falta (24 − t) debe ser ${R.t.replace(' de las horas transcurridas', '')}. Solo cumple t = ${t}: faltan 24 − ${t} = ${24 - t} y sus cifras dan ${R.e(a, b)} = ${24 - t}. Con los demás valores no coincide.`],
      [`Son las ${t} horas. `, o.pide === 'falta' ? `La jornada termina a las ${o.J} horas: faltan ${o.J} − ${t} = ` : `La jornada empezó a las ${o.S} horas: ya trabajó ${t} − ${o.S} = `, v('x', hs(resp)), '.'],
    ];
    const errores = [
      h('RMP104-falta-del-dia', 24 - t, `Esas son las horas que faltan para que termine el día (24 − ${t}). La pregunta es por la jornada, que termina a las ${o.J} horas.`),
      h('AR5-la-hora', t, `Esa es la hora actual, no lo que ${o.pide === 'falta' ? 'falta' : 'ya trabajó'}.`),
      o.pide === 'falta' ? h('RMP105-ya-trabajadas', t - o.S, `Esas son las horas que ya trabajó (desde las ${o.S} hasta las ${t}). La pregunta pide las que le faltan.`)
        : h('RMP48-pasado-por-falta', o.J - t, `Esas son las horas que le faltan (hasta las ${o.J}). La pregunta pide las que ya trabajó.`),
      h('AR5-duracion-del-turno', o.J - o.S, 'Esa es la duración completa de la jornada, no la parte que corresponde a la pregunta.'),
    ];
    const alternativas = P.armar({ correcta: resp, errores, rng, texto: hs });
    return cerrar(semilla, { variables, enunciado, pregunta, alternativas, solucion, valor: resp, unidad: 'h', datos: o });
  }

  // ---------- turnos y reuniones ----------
  function turno(rng, semilla) {
    const forma = rng.elegir(['hora', 'falta', 'falta', 'inicio', 'fin']);
    const esTurno = forma !== 'inicio' && forma !== 'fin';
    const D = esTurno ? rng.elegir([6, 8, 10, 12]) : rng.elegir([2, 3, 4, 5]);
    const p = rng.entero(1, 7), q = rng.entero(1, 7);
    if (p === q || mcd(p, q) !== 1) return null;
    const Dm = 60 * D;
    const variables = { t: { nombre: 'lo que pasó', color: 'o' }, f: { nombre: 'lo que falta', color: 'i' }, D: { nombre: 'duración', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (esTurno) {
      const ini = rng.elegir([360, 420, 450, 480, 780, 840, 900]);
      if (ini + Dm >= 1440) return null;
      const e = Dm * p / (p + q);
      if (!ent(e) || e % 5 !== 0) return null;
      const quien = rng.elegir(['El turno de una enfermera de la posta', 'El turno de un vigilante del mercado', 'La jornada de un operario de la planta']);
      // Un solo nombre en todo el problema: «turno» o «jornada».
      const jor = /^La jornada/.test(quien);
      const J = t => (jor ? String(t).replace(/\bdel turno\b/g, 'de la jornada').replace(/\bel turno\b/g, 'la jornada').replace(/\bturno\b/g, 'jornada') : t);
      const Jl = l => l.map(x => (typeof x === 'string' ? J(x) : { ...x, t: J(x.t) }));
      const Je = es => es.map(e => (e ? { ...e, explicacion: J(e.explicacion) } : e));
      const enunciado = [`${quien} dura `, v('D', `${D} horas`), ' y empezó a las ', hora(ini), '. Lo que ya ', v('t', 'pasó'), ' del turno y lo que ', v('f', 'falta'), ' están en la razón de ', `${p} a ${q}`, '.'];
      const solucion = [
        ['La razón reparte las ', v('D', `${D} h`), ` del turno en ${p} + ${q} = ${p + q} partes: ya `, v('t', `pasó ${dur(e)}`), ' y ', v('f', `falta ${dur(Dm - e)}`), '.'],
      ];
      if (forma === 'hora') {
        solucion.push([`Son las ${hora(ini)} + ${dur(e)} = `, v('x', hora(ini + e)), '.']);
        const errores = [
          h('RMP48-pasado-por-falta', ini + Dm - e, `Sumaste a la hora de inicio lo que falta (${dur(Dm - e)}) en vez de lo que ya pasó (${dur(e)}).`),
          h('AR5-hora-de-fin', ini + Dm, 'Esa es la hora en que termina el turno, no la hora actual.'),
          h('RMP44-am-pm', ini + e < 720 ? ini + e + 720 : ini + e - 720, 'La cuenta está bien, pero confundiste a. m. con p. m.'),
          h('AR5-razon-del-dia', 1440 * p / (p + q), 'Repartiste las 24 horas del día con esa razón. La razón es entre lo que pasó y lo que falta del turno, no del día.'),
        ];
        return cerrar(semilla, { variables, enunciado: Jl(enunciado), pregunta: ['¿Qué hora es?'], alternativas: armarHora(rng, ini + e, Je(errores)), solucion: solucion.map(Jl), valor: ini + e, unidad: 'min',
          datos: { tipo: 'turno', forma, D, inicio: ini, ahora: null, p, q } });
      }
      // falta: lo que falta del turno, con la hora como trampa
      const durT = m => ({ clave: `dur:${m}`, texto: dur(m) });
      const horaT = m => (horaOk(m) ? { clave: `hora:${m}`, texto: hora(m) } : null);
      solucion.push(['Falta ', v('x', dur(Dm - e)), ` para que termine (ahora son las ${hora(ini + e)}).`]);
      const errores = [
        ht('RMP48-pasado-por-falta', durT(e), `Ese es el tiempo que ya pasó del turno (${p} de las ${p + q} partes). ${q === 1 ? 'Lo que falta es la otra parte.' : `Lo que falta son las otras ${q} partes.`}`),
        ht('AR5-la-hora', horaT(ini + e), `Esa es la hora actual. La pregunta pide cuánto falta para que termine el turno.`),
        ht('AR5-duracion-del-turno', durT(Dm), 'Esa es la duración completa del turno, no lo que falta.'),
        ht('AR5-falta-del-dia', 1440 - (ini + e) !== Dm - e ? durT(1440 - (ini + e)) : null, 'Eso es lo que falta para que termine el día, no el turno.'),
        ht('AR5-hora-de-fin', horaT(ini + Dm), 'Esa es la hora en que termina el turno. La pregunta pide cuánto tiempo falta.'),
      ].filter(Boolean);
      return cerrar(semilla, { variables, enunciado: Jl(enunciado), pregunta: ['¿Cuánto tiempo falta para que termine?'], alternativas: P.armarTexto({ correcta: durT(Dm - e), errores: Je(errores), rng }), solucion: solucion.map(Jl),
        valor: `dur:${Dm - e}`, datos: { tipo: 'turno', forma, D, inicio: ini, ahora: null, p, q } });
    }
    // inicio: una reunión de D horas; ahora son las T y lo que falta es p/q de lo que pasó.
    const e = Dm * q / (p + q);           // lo que pasó: falta = (p/q)·pasó
    if (!ent(e) || e % 5 !== 0) return null;
    const ahora = rng.elegir([600, 630, 660, 690, 900, 930, 960, 1020, 1080, 1110]);
    const ini = ahora - e;
    const enunciado = ['Una reunión de la junta de vecinos dura ', v('D', `${D} horas`), '. Ahora son las ', hora(ahora), ' y lo que ', v('f', 'falta'), ' de la reunión es ', fraseFr(p, q), ' lo que ya ', v('t', 'pasó'), '.'];
    const solucion = [
      ['Si ya pasó ', v('t', 'x'), ', falta ', v('f', `${D} h − x`), `. Como lo que falta es ${fraseFr(p, q)} lo que pasó: x + ${fr(p, q)}·x = ${D} h → x = ${D} · ${q}/${p + q} h = `, v('t', dur(e)), ', y falta ', v('f', dur(Dm - e)), '.'],
    ];
    if (forma === 'fin') {
      const fin = ahora + Dm - e;
      solucion.push(['Termina ', v('f', dur(Dm - e)), ` después de las ${hora(ahora)}: a las `, v('x', hora(fin)), '.']);
      const errores = [
        h('RMP48-pasado-por-falta', ahora + e, `Sumaste lo que ya pasó (${dur(e)}) en vez de lo que falta (${dur(Dm - e)}).`),
        h('RMP48-hora-de-inicio', ini, 'Esa es la hora en que empezó la reunión. La pregunta pide a qué hora termina.'),
        h('RMP48-empieza-ahora', ahora + Dm, 'Sumaste la duración completa, como si la reunión empezara ahora. Ya pasó una parte.'),
        h('RMP44-am-pm', fin < 720 ? fin + 720 : fin - 720, 'La cuenta está bien, pero confundiste a. m. con p. m.'),
      ];
      return cerrar(semilla, { variables, enunciado, pregunta: ['¿A qué hora terminará la reunión?'], alternativas: armarHora(rng, fin, errores), solucion, valor: fin, unidad: 'min',
        datos: { tipo: 'turno', forma, D, inicio: null, ahora, p, q } });
    }
    solucion.push(['Empezó ', v('t', dur(e)), ` antes de las ${hora(ahora)}: a las `, v('x', hora(ini)), '.']);
    const errores = [
      h('RMP48-pasado-por-falta', ahora - (Dm - e), `Restaste lo que falta (${dur(Dm - e)}) en vez de lo que ya pasó (${dur(e)}).`),
      h('RMP48-hora-de-fin', ahora + (Dm - e), 'Esa es la hora en que termina la reunión. La pregunta pide a qué hora empezó.'),
      h('RMP48-termina-ahora', ahora - Dm, 'Restaste la duración completa, como si la reunión terminara ahora. Todavía le falta un rato.'),
      h('RMP44-am-pm', ini < 720 ? ini + 720 : ini - 720, 'La cuenta está bien, pero confundiste a. m. con p. m.'),
    ];
    return cerrar(semilla, { variables, enunciado, pregunta: ['¿A qué hora empezó la reunión?'], alternativas: armarHora(rng, ini, errores), solucion, valor: ini, unidad: 'min',
      datos: { tipo: 'turno', forma, D, inicio: null, ahora, p, q } });
  }

  // ---------- fracción del año ----------
  function anio(rng, semilla) {
    const A = rng.elegir([2026, 2027, 2028, 2029, 2030, 2031, 2032]);
    const p = rng.entero(1, 9), q = rng.entero(1, 9);
    if (p === q || mcd(p, q) !== 1) return null;
    const dias = bisiesto(A) ? 366 : 365, T = dias * 1440;
    const M = T * p / (p + q);
    if (!ent(M) || M % 60 !== 0) return null;
    const f0 = anioMinutos(M, A);
    if (f0.min % 720 === 0 || f0.min < 60) return null;
    // feb: los días de febrero del año supuesto (el error del bisiesto pasa a fecha con sus propios meses).
    const mk = (min, feb = null, Tmax = T) => {
      if (!ent(min) || min <= 0 || min >= Tmax) return null;
      const g = anioMinutos(min, A, feb);
      if (g.min % 720 === 0) return null;
      return { clave: `min:${min}`, texto: `el ${g.d} de ${MESES[g.m - 1]}, a las ${hora(g.min)}` };
    };
    const Totro = (bisiesto(A) ? 365 : 366) * 1440;
    const errores = [
      ht('RMP47-bisiesto', mk(Totro * p / (p + q), bisiesto(A) ? 28 : 29, Totro), bisiesto(A) ? `${A} es bisiesto: tiene 366 días, con el 29 de febrero. Hiciste la cuenta con 365.` : `${A} no es bisiesto: tiene 365 días. Hiciste la cuenta con 366.`),
      ht('RMP48-pasado-por-falta', mk(T * q / (p + q)), 'Cambiaste lo que pasó del año con lo que falta.'),
      ht('RMP1-dias-transcurridos', mk(M - 1440), `Pasaron ${Math.floor(M / 1440)} días completos y algo más: entonces estamos en el día ${Math.floor(M / 1440) + 1} del año, no en el ${Math.floor(M / 1440)}.`),
      ht('RMP44-am-pm', mk(f0.min < 720 ? M + 720 : M - 720), 'La fecha está bien, pero confundiste a. m. con p. m.'),
    ].filter(Boolean);
    const correcta = mk(M);
    if (!correcta) return null;
    for (let i = 0; i < errores.length; i++) if (errores[i].texto === correcta.texto) errores.splice(i--, 1);
    const diasPas = Math.floor(M / 1440), horas = (M % 1440) / 60;
    // día del año → mes, contado mes por mes
    let resto = diasPas, m = 1; const cuenta = [];
    while (resto >= diasMes(m, A)) { cuenta.push(`${MESES[m - 1]} ${diasMes(m, A)}`); resto -= diasMes(m, A); m++; }
    const enunciado = ['En el año ', v('k', `${A}`), ', el tiempo que ya ', v('t', 'pasó'), ' del año y el que ', v('f', 'falta'), ' para que termine están en la razón de ', `${p} a ${q}`, '.'];
    const solucion = [
      [`${A} ${bisiesto(A) ? 'es bisiesto (divisible por 4): tiene 366 días' : 'no es bisiesto: tiene 365 días'}, o sea ${dias} · 24 = ${dias * 24} horas.`],
      ['Lo que pasó: ', v('t', `${dias * 24} · ${p}/${p + q} = ${M / 60} h`), ` = ${diasPas} días completos y ${P.formatear(horas, 2)} h.`],
      [`Pasaron ${diasPas} días enteros, así que estamos en el día ${diasPas + 1} del año. ${cuenta.length ? `Quitando ${cuenta.join(', ')}, ` : ''}${resto === 0 ? `empieza ${MESES[m - 1]}: es el 1 de ${MESES[m - 1]}.` : `${resto === 1 ? 'queda 1 día entero' : `quedan ${resto} días enteros`} del mes de ${MESES[m - 1]}: es el ${resto + 1} de ${MESES[m - 1]}.`}`],
      ['Fecha y hora: ', v('x', correcta.texto), '.'],
    ];
    return cerrar(semilla, { variables: { k: { nombre: 'año', color: 'h' }, t: { nombre: 'lo que pasó', color: 'o' }, f: { nombre: 'lo que falta', color: 'i' }, x: { nombre: 'la fecha', color: 'd' } },
      enunciado, pregunta: ['¿Qué fecha y qué hora es?'], alternativas: P.armarTexto({ correcta, errores, rng }), solucion, valor: correcta.clave,
      datos: { tipo: 'anio', anio: A, p, q } });
  }

  // ---------- un reloj que se adelanta ----------
  const DIVISORES = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45];
  const VAR_RELOJ = { a: { nombre: 'adelanto o atraso', color: 'o' }, b: { nombre: 'otro reloj', color: 'i' }, F: { nombre: 'cuándo se puso en hora', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function adelanto(rng, semilla) {
    const a = rng.elegir(DIVISORES.filter(x => x <= 24));
    const sentido = rng.elegir(['adelanta', 'atrasa']);
    const A = rng.elegir([2027, 2028, 2028, 2029, 2032]);
    const desde = { a: A, m: rng.entero(1, 12), d: rng.entero(1, 28) };
    const H = rng.elegir([420, 480, 540, 600, 840, 960, 1080]);
    const n = 720 / a;
    const fin = sumarDias(desde, n);
    const errores = [
      ht('RMP44-24-horas', fecha(sumarDias(desde, 1440 / a)), 'Esperaste a que acumulara 24 horas. Un reloj de agujas marca lo mismo cada 12 horas: con 720 minutos (12 h) de diferencia ya vuelve a marcar la hora correcta.'),
      ht('RMP44-una-hora', 60 % a === 0 ? fecha(sumarDias(desde, 60 / a)) : null, 'Esperaste a que acumulara 60 minutos. Con una hora de diferencia marca otra hora; tiene que acumular 12 horas (720 minutos).'),
      ht('RMP1-dia-de-partida', fecha(sumarDias(desde, n - 1)), `Contaste el ${fechaTxt(desde, false)} como el primero de los ${n} días. Ese día recién se pone en hora: los ${n} días se cuentan después.`),
    ];
    if (cruza29(desde, n)) errores.push(ht('RMP47-bisiesto', fecha(sumarDias(desde, n, 28)), 'Olvidaste el 29 de febrero: ese año es bisiesto, y febrero tiene 29 días.'));
    else if (cruzaFebrero(desde, n)) errores.push(ht('RMP47-bisiesto', fecha(sumarDias(desde, n, 29)), 'Contaste un 29 de febrero que no hay: ese año no es bisiesto, y febrero tiene 28 días.'));
    const enunciado = ['Un reloj de agujas se puso en hora el ', v('F', `${fechaTxt(desde)}`), ` a las ${hora(H)}. Desde entonces se ${sentido} `, v('a', `${a} minutos`), ' cada día, siempre igual.'];
    const solucion = [
      ['Un reloj de agujas vuelve a marcar la hora correcta cuando su ', sentido === 'adelanta' ? 'adelanto' : 'atraso', ' llega a 12 horas: 12 · 60 = 720 minutos.'],
      ['Días necesarios: 720 ÷ ', v('a', `${a}`), ` = ${n}.`],
      [`${n} días después del `, v('F', fechaTxt(desde)), ' (contando cada mes con sus días' + (cruza29(desde, n) ? ', y febrero con 29 porque el año es bisiesto' : cruzaFebrero(desde, n) ? ', y febrero con 28' : '') + '): ', v('x', fechaTxt(fin)), `, a las ${hora(H)}.`],
    ];
    return cerrar(semilla, { variables: VAR_RELOJ, enunciado, pregunta: ['¿En qué fecha volverá a marcar la hora correcta por primera vez?'],
      alternativas: P.armarTexto({ correcta: fecha(fin), errores: errores.filter(Boolean), rng }), solucion, valor: clF(fin),
      datos: { tipo: 'adelanto', a, sentido, desde, hora: H } });
  }

  // ---------- dos relojes ----------
  function dosRelojes(rng, semilla) {
    const a = rng.elegir(DIVISORES), b = rng.elegir(DIVISORES);
    const ca = 720 / a, cb = 720 / b;
    if (a === b || mcd(ca, cb) === 1 || ca % cb === 0 || cb % ca === 0) return null;
    const L = mcm(ca, cb);
    if (L > 400) return null;
    const enunciado = ['Dos relojes de agujas se ponen en hora al mismo tiempo. Uno se adelanta ', v('a', `${a} minutos`), ' por día y el otro se atrasa ', v('b', `${b} minutos`), ' por día.'];
    const errores = [
      par('AR13-mcd', mcd(ca, cb), `Usaste el MCD de ${ca} y ${cb}. Los dos marcan bien a la vez en un múltiplo común de sus ciclos: el primero es el MCM.`),
      par('AR13-producto', ca * cb, `Multiplicaste los ciclos (${ca} · ${cb}). También es un múltiplo común, pero no el primero: el MCM es menor.`),
      h('RMP44-24-horas', mcm(1440 / a, 1440 / b), 'Esperaste a que cada uno acumulara 24 horas de diferencia. A un reloj de agujas le basta con 12 horas (720 minutos) para volver a marcar la hora correcta.'),
      h('RMP44-entre-ellos', ent(720 / (a + b)) ? 720 / (a + b) : NaN, `Ese es el día en que los dos marcan la misma hora entre ellos (su diferencia llega a 720 minutos), pero ninguno marca la hora correcta.`),
    ];
    const solucion = [
      ['Cada reloj marca bien cuando su diferencia con la hora real llega a 720 minutos (12 h): el primero, cada 720 ÷ ', v('a', `${a}`), ` = ${ca} días; el segundo, cada 720 ÷ `, v('b', `${b}`), ` = ${cb} días.`],
      [`Los dos marcan bien a la vez en un múltiplo común de ${ca} y ${cb}. El primero es el MCM: `, v('x', `mcm(${ca}; ${cb}) = ${L} días`), '.'],
    ];
    return cerrar(semilla, { variables: VAR_RELOJ, enunciado, pregunta: ['¿Dentro de cuántos días volverán a marcar los dos la hora correcta a la vez, por primera vez?'],
      alternativas: P.armar({ correcta: L, errores: errores.filter(e => ent(e.valor)), rng, texto: x => `${P.formatear(x, 0)} días` }), solucion, valor: L, unidad: 'días',
      datos: { tipo: 'dos-relojes', a, b } });
  }

  // ---------- atraso que crece ----------
  const CRECE = (() => {
    const l = [];
    for (let a1 = 1; a1 <= 40; a1++) for (let r = 1; r <= 12; r++) for (let n = 5; n <= 40; n++) if (n * (2 * a1 + (n - 1) * r) === 1440) l.push({ a1, r, n });
    return l;
  })();
  const nPara = (a1, r, S) => { for (let n = 1; n <= 200; n++) { const s = n * (2 * a1 + (n - 1) * r) / 2; if (s === S) return n; if (s > S) return NaN; } return NaN; };
  function creciente(rng, semilla) {
    const c = rng.elegir(CRECE);
    const pide = rng.elegir(['dias', 'fecha']);
    const A = rng.elegir([2027, 2028, 2029, 2032]);
    const desde = { a: A, m: rng.entero(1, 12), d: rng.entero(1, 28) };
    const H = rng.elegir([420, 480, 600, 1080]);
    const { a1, r, n } = c;
    const ult = a1 + (n - 1) * r;
    const enunciado = ['Un reloj de agujas se puso en hora ', pide === 'fecha' ? ['el ', v('F', fechaTxt(desde)), ` a las ${hora(H)}`] : 'un día a las 8:00 a. m.', '. El primer día se atrasó ', v('a', `${a1} min`), ', el segundo ', `${a1 + r} min`, ', el tercero ', `${a1 + 2 * r} min`, ', y así: cada día se atrasa ', v('b', `${r} min`), ' más que el día anterior.'].flat();
    const nConst = 720 / a1, nUno = (720 - a1) / r + 1, n24 = nPara(a1, r, 1440);
    const solucion = [
      ['Vuelve a marcar la hora correcta cuando el atraso acumulado llega a 720 minutos (12 h).'],
      ['Los atrasos diarios forman una progresión aritmética: ', v('a', `${a1}`), ', ', `${a1 + r}, ${a1 + 2 * r}, …`, ' (razón ', v('b', `${r}`), '). En n días se acumula n · (', `2·${a1} + (n − 1)·${r}) / 2.`],
      [`Con n = ${n}: ${n} · (${2 * a1} + ${(n - 1) * r}) / 2 = ${n} · ${2 * a1 + (n - 1) * r} / 2 = 720. ✓ (el último día se atrasó ${ult} min).`],
    ];
    if (pide === 'dias') {
      solucion.push(['Al cabo de ', v('x', `${n} días`), '.']);
      const errores = [
        par('AR7-atraso-constante', nConst, `Dividiste 720 entre el atraso del primer día, como si se atrasara siempre ${a1} min. El atraso crece cada día: se acumula más rápido.`),
        h('AR5-atraso-de-un-dia', nUno, `En ese día el atraso de ese solo día sería 720 min. Lo que debe llegar a 720 es el atraso acumulado, la suma de todos los días.`),
        h('RMP44-24-horas', n24, 'Esperaste a que acumulara 24 horas (1440 min). Un reloj de agujas ya marca bien con 12 horas (720 min) de atraso.'),
        h('RMP1-dia-de-partida', n + 1, 'Contaste también el día en que se puso en hora. Los días de atraso empiezan a contarse desde ahí.'),
      ];
      return cerrar(semilla, { variables: VAR_RELOJ, enunciado, pregunta: ['¿Al cabo de cuántos días volverá a marcar la hora correcta por primera vez?'],
        alternativas: P.armar({ correcta: n, errores: errores.filter(e => ent(e.valor) && e.valor > 0), rng, texto: x => `${P.formatear(x, 0)} días` }), solucion, valor: n, unidad: 'días',
        datos: { tipo: 'creciente', a1, r, pide, desde: null, hora: null } });
    }
    const fin = sumarDias(desde, n);
    solucion.push([`${n} días después del `, v('F', fechaTxt(desde)), ': ', v('x', fechaTxt(fin)), `, a las ${hora(H)}.`]);
    const errores = [
      ht('AR7-atraso-constante', ent(nConst) ? fecha(sumarDias(desde, nConst)) : null, `Dividiste 720 entre el atraso del primer día, como si se atrasara siempre ${a1} min. El atraso crece cada día.`, 'parcial'),
      ht('AR5-atraso-de-un-dia', ent(nUno) ? fecha(sumarDias(desde, nUno)) : null, 'Igualaste a 720 el atraso de un solo día. Lo que debe llegar a 720 es el atraso acumulado.'),
      ht('RMP44-24-horas', ent(n24) ? fecha(sumarDias(desde, n24)) : null, 'Esperaste a que acumulara 24 horas. Con 12 horas (720 min) de atraso ya marca bien.'),
      ht('RMP1-dia-de-partida', fecha(sumarDias(desde, n - 1)), `Contaste el ${fechaTxt(desde, false)} como el primer día de atraso. Ese día se puso en hora: el primer día de atraso termina al día siguiente.`),
      cruza29(desde, n) ? ht('RMP47-bisiesto', fecha(sumarDias(desde, n, 28)), 'Olvidaste el 29 de febrero: ese año es bisiesto.') : cruzaFebrero(desde, n) ? ht('RMP47-bisiesto', fecha(sumarDias(desde, n, 29)), 'Contaste un 29 de febrero que no hay: ese año no es bisiesto.') : null,
    ].filter(Boolean);
    return cerrar(semilla, { variables: VAR_RELOJ, enunciado, pregunta: ['¿En qué fecha volverá a marcar la hora correcta por primera vez?'],
      alternativas: P.armarTexto({ correcta: fecha(fin), errores, rng }), solucion, valor: clF(fin),
      datos: { tipo: 'creciente', a1, r, pide, desde, hora: H } });
  }

  // ---------- calendario: días de una clase ----------
  const plural = i => (DIAS[i].endsWith('s') ? DIAS[i] : DIAS[i] + 's');
  const claseTxt = ids => { const n = ids.map(plural); return n.length === 1 ? n[0] : n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1]; };
  function diaSemanaMax({ N, clase }) {
    let maximo = -1, inicio = null;
    const q = Math.floor(N / 7), r = N % 7;
    for (let s = 0; s < 7; s++) {
      let c = q * clase.length;
      for (let j = 0; j < r; j++) if (clase.includes((s + j) % 7)) c++;
      if (c > maximo) { maximo = c; inicio = s; } else if (c === maximo) inicio = inicio === null ? s : inicio;
    }
    return { maximo, inicio };
  }
  const dia = i => ({ clave: `dia:${((i % 7) + 7) % 7}`, texto: DIAS[((i % 7) + 7) % 7] });
  function calendario(rng, semilla) {
    const forma = rng.elegir(['maximo', 'inicio', 'inicio']);
    const VAR = { N: { nombre: 'días del periodo', color: 'o' }, c: { nombre: 'días buscados', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (forma === 'maximo') {
      const bis = rng.moneda(), N = bis ? 366 : 365, r = N % 7;
      const c = rng.elegir([2, 3, 5]), c0 = c === 5 ? 0 : rng.elegir(c === 2 ? [5, 0, 3] : [4, 0]);
      const clase = Array.from({ length: c }, (_, j) => (c0 + j) % 7);
      const { maximo } = diaSemanaMax({ N, clase });
      const otro = diaSemanaMax({ N: bis ? 365 : 366, clase }).maximo;
      const enunciado = [bis ? 'Un año bisiesto tiene ' : 'Un año que no es bisiesto tiene ', v('N', `${N} días`), '. Según el día de la semana en que empiece, tendrá más o menos ', v('c', claseTxt(clase)), '.'];
      const errores = [
        h('RMP2-sin-maximizar', 52 * c, `${52 * c} es lo que hay en las 52 semanas completas. Falta elegir bien el primer día: ${r === 1 ? 'el día que sobra puede' : `los ${r} días que sobran pueden`} ser también de los buscados.`),
        h('RMP47-bisiesto', otro, bis ? 'Contaste el año con 365 días. Un año bisiesto tiene 366: sobran 2 días, no 1.' : 'Contaste el año con 366 días. Un año que no es bisiesto tiene 365: sobra un solo día.'),
        h('AR5-semanas', 52, 'Ese es el número de semanas completas del año, no el de días buscados.'),
        h('RMP2-todos-53', 53 * c, `Supusiste que cada uno de esos días puede salir 53 veces. Solo ${r === 1 ? 'sobra 1 día' : `sobran ${r} días`} después de las 52 semanas: solo ${r === 1 ? 'uno puede' : 'esos pueden'} repetirse una vez más.`),
      ];
      const solucion = [
        [v('N', `${N} días`), ` = 52 semanas y ${r} ${r === 1 ? 'día' : 'días'} más. En las 52 semanas hay ${52 * c} días buscados (${c} por semana).`],
        [`${r === 1 ? 'El día que sobra es el primero' : `Los ${r} días que sobran son los primeros`} del año. Si el año empieza en ${DIAS[c0]}, ${r === 1 ? 'ese día es' : `los ${r} días son`} de los buscados${r > c ? ` (todos los que caben: ${c})` : ''}.`],
        ['Como máximo: ', v('x', `${maximo}`), '.'],
      ];
      return cerrar(semilla, { variables: VAR, enunciado, pregunta: [`¿Cuántos ${claseTxt(clase)} puede tener, como máximo?`],
        alternativas: P.armar({ correcta: maximo, errores, rng, decimales: 0, texto: x => P.formatear(x, 0) }), solucion, valor: maximo,
        datos: { tipo: 'calendario', forma, N, clase } });
    }
    const PER = [[31, 'Un mes tiene'], [45, 'Una campaña de vacunación dura'], [61, 'Un bimestre escolar tiene'], [60, 'Un taller de verano dura'], [40, 'Una feria dura'], [52, 'Un curso de natación dura'], [33, 'Un torneo de fulbito dura']];
    const [N, que] = rng.elegir(PER), r = N % 7, q = Math.floor(N / 7);
    const c0 = rng.entero(0, 6);
    const clase = Array.from({ length: r }, (_, j) => (c0 + j) % 7);
    const { inicio } = diaSemanaMax({ N, clase });
    const enunciado = [`${que} `, v('N', `${N} días`), ' seguidos. Se quiere que en ese periodo haya la mayor cantidad posible de ', v('c', claseTxt(clase)), '.'];
    const errores = [
      ht('RMP1-desde-el-dia-siguiente', dia(c0 - 1), `Empezaste a contar los días que sobran desde el día siguiente al primero. Si el periodo empieza en ${DIAS[(c0 + 6) % 7]}, los ${r} días que sobran son ${claseTxt(Array.from({ length: r }, (_, j) => (c0 + 6 + j) % 7))}: ${DIAS[(c0 + r - 1) % 7]} se queda fuera.`),
      ht('RMP48-dia-final', dia(c0 + r - 1), `Ese es el día en que termina el periodo si empieza en ${DIAS[c0]}. La pregunta pide el día en que empieza.`),
      ht('RMP2-sin-maximizar', dia(c0 + 1), `Empezando en ${DIAS[(c0 + 1) % 7]}, de los ${r} días que sobran solo ${r - 1} son de los buscados. Con ${DIAS[c0]} entran todos.`),
    ];
    const solucion = [
      [v('N', `${N} días`), ` = ${q} semanas y ${r} días más. En las ${q} semanas cada día de la semana sale ${q} veces.`],
      [`Los ${r} días que sobran son los ${r} primeros del periodo: el día en que empieza y los ${r - 1} siguientes.`],
      ['Para que esos días sean ', v('c', claseTxt(clase)), ', el periodo debe empezar en ', v('x', DIAS[inicio]), `: así hay ${q + 1} de cada uno.`],
    ];
    return cerrar(semilla, { variables: VAR, enunciado, pregunta: ['¿En qué día de la semana debe empezar?'],
      alternativas: P.armarTexto({ correcta: dia(inicio), errores, rng }), solucion, valor: dia(inicio).clave,
      datos: { tipo: 'calendario', forma, N, clase } });
  }

  // ---------- mentirosos ----------
  const DICHOS = {
    'ayer-menti': { txt: '«Ayer mentí»', vale: (L, d) => L.includes((d + 6) % 7) },
    'ayer-verdad': { txt: '«Ayer dije la verdad»', vale: (L, d) => !L.includes((d + 6) % 7) },
    'manana-mentire': { txt: '«Mañana mentiré»', vale: (L, d) => L.includes((d + 1) % 7) },
    'manana-verdad': { txt: '«Mañana diré la verdad»', vale: (L, d) => !L.includes((d + 1) % 7) },
  };
  const OTRO_TIEMPO = { 'ayer-menti': 'manana-mentire', 'ayer-verdad': 'manana-verdad', 'manana-mentire': 'ayer-menti', 'manana-verdad': 'ayer-verdad' };
  // Días en que la frase es coherente: dicha en un día de verdad, es cierta; en uno de mentira, es falsa.
  const coherente = (L, dicho, d) => DICHOS[dicho].vale(L, d) === !L.includes(d);
  function diasMentirosos({ mienteA, mienteB, dichoA, dichoB }) {
    const l = [];
    for (let d = 0; d < 7; d++) if (coherente(mienteA, dichoA, d) && coherente(mienteB, dichoB, d)) l.push(d);
    return l;
  }
  function mentirosos(rng, semilla) {
    const largo = () => rng.elegir([2, 3, 3, 4]);
    const bloque = (ini, n) => Array.from({ length: n }, (_, j) => (ini + j) % 7).sort((x, y) => x - y);
    const mienteA = bloque(rng.entero(0, 6), largo()), mienteB = bloque(rng.entero(0, 6), largo());
    if (mienteA.some(d => mienteB.includes(d)) && rng.moneda()) return null;
    const dichos = Object.keys(DICHOS);
    const dichoA = rng.elegir(dichos), dichoB = rng.elegir(dichos);
    const sol = diasMentirosos({ mienteA, mienteB, dichoA, dichoB });
    if (sol.length !== 1) return null;
    const d0 = sol[0];
    const pide = rng.elegir(['hoy', 'manana', 'manana', 'ayer']);
    const desp = { hoy: 0, manana: 1, ayer: -1 }[pide];
    const [nA, nB] = rng.elegir(NOMBRES);
    const enunciado = [`${nA} miente los `, v('a', claseTxt(mienteA)), ' y dice la verdad los demás días. ', `${nB} miente los `, v('b', claseTxt(mienteB)), ` y dice la verdad los demás días. Un día se encuentran, y ${nA} dice: `, v('a', DICHOS[dichoA].txt), `. ${nB} responde: `, v('b', DICHOS[dichoB].txt), '.'];
    const pregunta = [{ hoy: '¿Qué día de la semana se encontraron?', manana: '¿Qué día de la semana será al día siguiente del encuentro?', ayer: '¿Qué día de la semana fue el día anterior al encuentro?' }[pide]];
    // errores
    const literal = []; for (let d = 0; d < 7; d++) if (DICHOS[dichoA].vale(mienteA, d) && DICHOS[dichoB].vale(mienteB, d)) literal.push(d);
    const cambiado = diasMentirosos({ mienteA, mienteB, dichoA: OTRO_TIEMPO[dichoA], dichoB: OTRO_TIEMPO[dichoB] });
    const soloA = []; for (let d = 0; d < 7; d++) if (coherente(mienteA, dichoA, d) && d !== d0) soloA.push(d);
    const soloB = []; for (let d = 0; d < 7; d++) if (coherente(mienteB, dichoB, d) && d !== d0) soloB.push(d);
    const errores = [
      pide !== 'hoy' ? ht('AR5-dia-del-encuentro', dia(d0), `Ese es el día del encuentro. La pregunta pide el día ${pide === 'manana' ? 'siguiente' : 'anterior'}.`) : null,
      literal.length === 1 && literal[0] !== d0 ? ht('RMP49-creerle', dia(literal[0] + desp), 'Tomaste las dos frases como verdaderas. Pero un día en que la persona miente, lo que dice es falso: hay que revisar, día por día, si la frase cuadra con que ese día mienta o diga la verdad.') : null,
      cambiado.length === 1 && cambiado[0] !== d0 ? ht('RMP48-ayer-por-manana', dia(cambiado[0] + desp), '«Ayer» es el día anterior y «mañana» el siguiente: los cambiaste.') : null,
      soloA.length ? ht('AR18-una-condicion', dia(soloA[0] + desp), `${desp ? `Partiste del ${DIAS[soloA[0]]}, que` : 'Ese día'} cuadra con lo que dice ${nA}, pero no con lo que dice ${nB}. Hay que revisar los siete días con las dos frases a la vez.`, 'parcial') : null,
      soloB.length ? ht('AR18-otra-condicion', dia(soloB[0] + desp), `${desp ? `Partiste del ${DIAS[soloB[0]]}, que` : 'Ese día'} cuadra con lo que dice ${nB}, pero no con lo que dice ${nA}. Hay que revisar los siete días con las dos frases a la vez.`, 'parcial') : null,
      pide === 'hoy' ? ht('AR5-dia-siguiente', dia(d0 + 1), 'Ese es el día siguiente al encuentro; la pregunta pide el día del encuentro.') : null,
    ].filter(Boolean);
    const tabla = DIAS.map((nom, d) => `${nom}: ${nA} ${mienteA.includes(d) ? 'miente' : 'dice la verdad'} y su frase ${DICHOS[dichoA].vale(mienteA, d) ? 'es cierta' : 'es falsa'}${coherente(mienteA, dichoA, d) ? ' (cuadra)' : ' (no cuadra)'}; ${nB} ${mienteB.includes(d) ? 'miente' : 'dice la verdad'} y su frase ${DICHOS[dichoB].vale(mienteB, d) ? 'es cierta' : 'es falsa'}${coherente(mienteB, dichoB, d) ? ' (cuadra)' : ' (no cuadra)'}`);
    const solucion = [
      ['Una frase cuadra con un día si, dicha un día de verdad, es cierta, o si, dicha un día de mentira, es falsa. Se revisan los siete días; estos son los que cumplen al menos una frase:'],
      ...tabla.filter((t, d) => coherente(mienteA, dichoA, d) || coherente(mienteB, dichoB, d)).map(t => [t + '.']),
      ['El único día en que cuadran las dos frases es el ', v('x', DIAS[d0]), pide === 'hoy' ? '.' : `; el día ${pide === 'manana' ? 'siguiente' : 'anterior'} es `, ...(pide === 'hoy' ? [] : [v('x', DIAS[(d0 + desp + 7) % 7]), '.'])],
    ];
    return cerrar(semilla, { variables: { a: { nombre: nA, color: 'o' }, b: { nombre: nB, color: 'i' }, x: { nombre: 'el día', color: 'd' } }, enunciado, pregunta,
      alternativas: P.armarTexto({ correcta: dia(d0 + desp), errores, rng }), solucion, valor: dia(d0 + desp).clave,
      datos: { tipo: 'mentirosos', mienteA, mienteB, dichoA, dichoB, pide } });
  }

  const vueltaCorrecta = a => 720 / a;
  const diasCreciente = (a1, r) => nPara(a1, r, 720);
  return { id: ID, titulo: 'Horas, relojes y calendarios', generar, calc: { llegada, horasDosCifras, hora, anioMinutos, sumarDias, diaSemanaMax, mentirosos: diasMentirosos, vueltaCorrecta, mcm, diasCreciente } };
});
