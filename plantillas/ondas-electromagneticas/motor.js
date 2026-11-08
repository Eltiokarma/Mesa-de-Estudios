/*
 * Motor de «La antena y el arcoíris: ondas electromagnéticas».
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorOndasEM) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: frecuencias f en Hz; longitudes de onda λ en m (y en nm donde el nombre termina en Nm); rapideces c y v
 * en m/s; distancias d en m; tiempos t en s; energía del fotón E en eV (y en J donde el nombre termina en J); campo
 * eléctrico de la onda en V/m y campo magnético B en T; índice de refracción n sin unidades.
 *
 * Constantes de academia: c = 3 × 10⁸ m/s, hc = 1240 eV·nm, e = 1,6 × 10⁻¹⁹ C (1 eV = 1,6 × 10⁻¹⁹ J),
 *   ε₀ = 8,85 × 10⁻¹² C²/(N·m²).
 *   De ahí h = hc/c = 4,1333… × 10⁻¹⁵ eV·s = 6,6133… × 10⁻³⁴ J·s (el 6,6 × 10⁻³⁴ J·s de los problemas da casi lo
 *   mismo; aquí se usa un solo juego para que E en J = E en eV · e siempre).
 *
 * El campo eléctrico de la onda no lleva letra en la escena: la E es la energía del fotón (la misma E ocre de
 * «La lámpara y la placa»). En los resultados se llama 'electrico' (V/m) y 'electrico0' su máximo.
 *
 * Bordes del espectro (de academia; en la realidad las regiones se solapan), por la longitud de onda en el vacío:
 *   rayos gamma   λ < 0,01 nm                (f > 3 × 10¹⁹ Hz)
 *   rayos X       0,01 nm ≤ λ < 10 nm        (3 × 10¹⁶ Hz < f ≤ 3 × 10¹⁹ Hz)
 *   ultravioleta  10 nm ≤ λ < 380 nm
 *   visible       380 nm ≤ λ ≤ 750 nm        (unos 4 × 10¹⁴ Hz a 7,9 × 10¹⁴ Hz; los mismos bordes que física moderna)
 *   infrarrojo    750 nm < λ ≤ 1 mm
 *   microondas    1 mm < λ ≤ 30 cm           (1 GHz a 300 GHz)
 *   radio         λ > 30 cm                  (f < 1 GHz)
 *   Colores visibles (los de física moderna): violeta < 450 ≤ azul < 495 ≤ verde < 570 ≤ amarillo < 590 ≤ naranja
 *   < 620 ≤ rojo ≤ 750 nm.
 *
 *   aHz(valor, unidad)              'Hz', 'kHz', 'MHz', 'GHz' o 'THz' → Hz
 *   aMetros(valor, unidad)          'nm', 'µm' (o 'um'), 'mm', 'cm', 'm' o 'km' → m
 *   region(lambda)                  región del espectro de λ (m): { region, nombre, visible, color (o null), orden
 *                                   (0 = radio … 6 = gamma) }
 *   regiones()                      las siete regiones de menor a mayor frecuencia, con sus bordes en λ (m) y f (Hz)
 *   onda(valor, unidad)             onda de frecuencia valor·unidad en el vacío: f, lambda (m), lambdaNm, E (eV), EJ,
 *                                   la región y los errores (abajo)
 *   ondaDeLambda(valor, unidad)     lo mismo desde la longitud de onda
 *   foton(f)                        E = h·f en eV y J
 *   campos(electrico0)              B₀ = (campo eléctrico máximo)/c (T), con errores
 *   campoDeB(B0)                    campo eléctrico máximo = c·B₀ (V/m)
 *   direccionB(dirE, dirAvance)     dirección del campo magnético, B ∥ avance × campo eléctrico (vectores [x, y, z];
 *                                   así campo eléctrico × B apunta hacia donde avanza la onda). Exige que el campo
 *                                   eléctrico sea perpendicular al avance (la onda es transversal)
 *   producto(a, b), punto(a, b)     producto vectorial y escalar
 *   instante(x, t, lambda, T)       los dos campos en x y t para el dibujo, con amplitud 1: los dos en fase,
 *                                   sen(2π(x/λ − t/T)); x y λ en las mismas unidades, t y T también
 *   viaje(d, n)                     tiempo t = d/v de una onda electromagnética que recorre d (m) en un medio de
 *                                   índice n (1 si se omite): t (s), minutos y segundos (m, s), con errores
 *   eco(t)                          radar: el eco vuelve a los t s; distancia d = c·t/2 (m), con errores
 *   medio(lambdaNm, n)              luz de λ nm (en el vacío) que entra a un medio de índice n: v = c/n, λ' = λ/n,
 *                                   f igual, color igual (el que pone f), con errores
 *   atraviesa(material, region)     'si', 'no' o 'parcial' (tabla simplificada de abajo); null si la tabla no lo dice
 *   materiales()                    la lista de materiales de la tabla
 *   posicion(f, fmin, fmax)         lugar de f en una regla logarítmica entre fmin y fmax (0 a 1)
 *   frecuenciaEn(u, fmin, fmax)     el inverso: la f del lugar u
 *   referencias()                   objetos de referencia { id, objeto, tam (m), f = c/tam, y la región de esa λ }
 *   carrera(d, t, ondas)            dónde va cada onda (m) a los t s en el vacío, hasta llegar a d: todas a c
 *   colorLuz(lambdaNm)              color aproximado de la luz visible { r, g, b } o null fuera de 380 a 750 nm
 *                                   (copiado de plantillas/fisica-moderna/motor.js). Solo para pintar la banda de luz:
 *                                   no es un color de variable
 *   ionizante(f)                    E (eV) del fotón, si ioniza (E ≥ 10 eV) y el error OE18 (abajo)
 *   leerOnda(o)                     lee la expresión (campo eléctrico) = E0·sen(k·x ∓ ω·t) de una onda en el vacío:
 *                                   o = { E0 (V/m), k (rad/m), w (rad/s), signo ('-' si es k·x − ω·t, avanza hacia
 *                                   +eje; '+' si es k·x + ω·t, avanza hacia −eje), eje ([1, 0, 0] si se omite), dirE
 *                                   ([0, 1, 0] si se omite) }. Da lambda = 2π/k (m), f = ω/(2π) (Hz), v = ω/k (m/s),
 *                                   la región, B0 = E0/v (T), avance y dirB (vectores) e I (W/m²), con errores
 *   intensidad(E0)                  intensidad media I = c·ε₀·E0²/2 (W/m²), con ε₀ = 8,85 × 10⁻¹² C²/(N·m²)
 *   snell(n1, n2, i)                un rayo que viaja por un medio de índice n1 llega a otro de índice n2 con un ángulo
 *                                   de incidencia i (grados, desde la normal, 0 a 90): n1·sen i = n2·sen r. Da r
 *                                   (grados; null si no hay rayo refractado), senR (lo que valdría sen r, aunque pase de
 *                                   1), total (reflexión total), seAcerca (el rayo se acerca a la normal), L (ángulo
 *                                   límite, o null si n1 ≤ n2), el ángulo de reflexión (igual a i), la fracción de luz
 *                                   que se refleja R y la que pasa T (Fresnel, luz sin polarizar; con reflexión total,
 *                                   R = 1), y los errores (abajo). Trigonometría exacta, sin la convención sen 37° = 3/5
 *   anguloLimite(n1, n2)            sen L = n2/n1 (grados): { existe, L, senL } (existe es false si n1 ≤ n2), con errores
 *   azar(semilla)                   números al azar con semilla
 *
 * Tabla de «qué atraviesa qué» (simplificada, de lo que se ve en la vida diaria; 'parcial' = pasa una parte):
 *                     radio  microondas  infrarrojo  visible  ultravioleta  rayosX   gamma
 *   pared (ladrillo)  si     parcial     no          no       no            no       parcial
 *   vidrio (ventana)  si     si          parcial     si       parcial       parcial  si
 *   piel y músculo    si     parcial     parcial     parcial  no            si       si
 *   hueso             si     parcial     no          no       no            parcial  parcial
 *   rejilla metálica  no     no          si          si       si            si       si
 *   (la rejilla de la puerta del horno: agujeros de unos 2 mm, mucho menores que los 12,5 cm de las microondas y
 *    mucho mayores que la λ del infrarrojo y de la luz. Las microondas y la radio rebotan en el metal; la luz pasa por
 *    los agujeros. El vidrio común frena buena parte del ultravioleta, casi todo el que quema la piel. La luz roja y el
 *    infrarrojo cercano cruzan unos milímetros de piel: un dedo frente a una linterna se ve rojo. Los rayos X cruzan
 *    la piel casi sin frenarse y el hueso los absorbe mucho más: por eso el hueso sale blanco en la radiografía.)
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que da cada error típico. Los códigos son
 * los de docs/investigacion/ondas-electromagneticas-ideas-erroneas.md (OE1 a OE20; todas sus cifras salen de
 * resúmenes y están por verificar); los que llevan un nombre sin número son hipótesis nuestras:
 *   onda.errores (m):    multiplica   λ = c·f (despejar mal c = λ·f; hipótesis nuestra).
 *                        sinPrefijo   OE20: λ = c/valor, sin pasar el prefijo a Hz (100 MHz como si fueran 100 Hz).
 *                        exponente    OE20: λ/10, diez veces menos, por sumar mal los exponentes (100 × 10⁶ como 10⁹).
 *   ondaDeLambda.errores (Hz): multiplica f = c·λ; sinPrefijo f = c/valor (OE20: 600 nm como si fueran 600 m).
 *   campos.errores (T):  igual       OE15: B₀ = campo eléctrico máximo (sin c).
 *                        multiplica  OE15: B₀ = campo eléctrico máximo · c.
 *                        kms         OE20: B₀ = campo eléctrico máximo / 300 000 (c en km/s).
 *   viaje.errores (s):   instantaneo  0 (la luz no tarda; hipótesis nuestra).
 *                        minutos      OE20: el número de t leído como minutos, t·60 s (500 s tomados como 500 min).
 *                        exponente    OE20: t/10 (c como 3 × 10⁹ m/s).
 *   eco.errores (m):     sinMitad     d = c·t (la ida y la vuelta como si fuera solo la ida; hipótesis nuestra).
 *                        conSonido    d = 340·t/2 (el eco con la rapidez del sonido en el aire, 340 m/s; OE1).
 *   medio.errores:       cambiaF      OE12: cambia la frecuencia y no λ (v = f·λ leído con λ fija, como ON2):
 *                                     { v: c/n, f: f/n, lambdaNm: λ }.
 *                        cambiaColor  λ' manda el color (variante de OE12): { v, lambdaNm: λ/n, color: el de λ/n }.
 *                        alReves      el medio acelera la luz: { v: c·n, lambdaNm: λ·n, f } (hipótesis nuestra).
 *                        nadaCambia   la luz siempre va a c: { v: c, lambdaNm: λ, f } (hipótesis nuestra).
 *   leerOnda.errores:    lambdaEsK      OE-lambda-es-k: λ = k (m), con su región.
 *                        unoSobreK      OE-lambda-1-sobre-k: λ = 1/k, sin el 2π, con su región.
 *                        kSobreDosPi    OE-lambda-k-sobre-2pi: λ = k/(2π), con su región.
 *                        fEsW           f = ω, sin el 2π (Hz).
 *                        BParalelo      OE13: B en la dirección del campo eléctrico.
 *                        avanceAlReves  el signo leído al revés: avance −avance y B −dirB.
 *                        BIgual         OE15: B0 = E0.
 *   intensidad.errores (W/m²): sinMitad c·ε₀·E0²; sinCuadrado c·ε₀·E0/2.
 *   snell.errores:       noSeDesvia   R1 (al entrar a un medio de mayor índice) y R5 (al salir a uno de menor): el rayo
 *                                     sigue recto, { r: i }.
 *                        alReves      R3: los índices al revés (n2·sen i = n1·sen r): { r, total } con esa cuenta; el
 *                                     rayo se desvía hacia el otro lado.
 *                        desdeSuperficie  el ángulo medido desde la superficie (trampa 17 de la admisión de San Marcos,
 *                                     hipótesis nuestra): { r: 90 − r } (null si hay reflexión total).
 *                        noPasa       R4 (no sale «porque el agua es más densa») y R2 (no entra al medio más denso):
 *                                     { total: true }.
 *   anguloLimite.errores: invertido  sen L = n1/n2 (los índices al revés): { existe, L } con esa cuenta.
 *                        desdeSuperficie  { L: 90 − L }, el ángulo con la superficie (hipótesis nuestra).
 *                        rozando     { L: 90 }, el ángulo del rayo que sale rozando, no el de incidencia (hipótesis nuestra).
 *   ionizante(f)         si un fotón de frecuencia f ioniza (E ≥ 10 eV, borde de academia: λ ≤ 124 nm, en el
 *                        ultravioleta alto) y lo que espera OE18: { potente: { ioniza: true } } (con la potencia basta).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorOndasEM = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const C = 3e8, HC_EV_NM = 1240, E_CARGA = 1.6e-19, H_EV = HC_EV_NM * 1e-9 / C, V_SONIDO = 340;
  const PREF_F = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 };
  const PREF_L = { nm: 1e-9, 'µm': 1e-6, um: 1e-6, mm: 1e-3, cm: 1e-2, m: 1, km: 1e3 };

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) {
    numero(x, que);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function noNegativo(x, que) {
    numero(x, que);
    if (x < 0) throw new Error(`${que} no puede ser negativo`);
    return x;
  }
  // Redondea a 12 cifras significativas (4,000000000000001 → 4) para mostrar y comparar.
  const limpio = x => (x === 0 ? 0 : Number(x.toPrecision(12)) + 0);

  function aHz(valor, unidad) {
    positivo(valor, 'la frecuencia');
    const u = unidad === undefined ? 'Hz' : unidad;
    if (!(u in PREF_F)) throw new Error("la unidad de frecuencia debe ser 'Hz', 'kHz', 'MHz', 'GHz' o 'THz'");
    return limpio(valor * PREF_F[u]);
  }
  function aMetros(valor, unidad) {
    positivo(valor, 'la longitud');
    const u = unidad === undefined ? 'm' : unidad;
    if (!(u in PREF_L)) throw new Error("la unidad de longitud debe ser 'nm', 'µm', 'mm', 'cm', 'm' o 'km'");
    return limpio(valor * PREF_L[u]);
  }

  // ---------- Regiones del espectro ----------
  const REGIONES = [
    { region: 'radio', nombre: 'radio', lmin: 0.3, lmax: Infinity },
    { region: 'microondas', nombre: 'microondas', lmin: 1e-3, lmax: 0.3 },
    { region: 'infrarrojo', nombre: 'infrarrojo', lmin: 750e-9, lmax: 1e-3 },
    { region: 'visible', nombre: 'luz visible', lmin: 380e-9, lmax: 750e-9 },
    { region: 'ultravioleta', nombre: 'ultravioleta', lmin: 10e-9, lmax: 380e-9 },
    { region: 'rayosX', nombre: 'rayos X', lmin: 0.01e-9, lmax: 10e-9 },
    { region: 'gamma', nombre: 'rayos gamma', lmin: 0, lmax: 0.01e-9 },
  ];
  function colorNombre(nm) {
    return nm < 450 ? 'violeta' : nm < 495 ? 'azul' : nm < 570 ? 'verde' : nm < 590 ? 'amarillo' : nm < 620 ? 'naranja' : 'rojo';
  }
  function region(lambda) {
    positivo(lambda, 'la longitud de onda λ');
    const nm = lambda * 1e9;
    let k;
    if (nm < 0.01) k = 6;
    else if (nm < 10) k = 5;
    else if (nm < 380) k = 4;
    else if (nm <= 750) k = 3;
    else if (lambda <= 1e-3) k = 2;
    else if (lambda <= 0.3) k = 1;
    else k = 0;
    const R = REGIONES[k];
    return { region: R.region, nombre: R.nombre, visible: k === 3, color: k === 3 ? colorNombre(nm) : null, orden: k };
  }
  function regiones() {
    return REGIONES.map((R, k) => ({ region: R.region, nombre: R.nombre, orden: k, lambdaMin: R.lmin, lambdaMax: R.lmax,
      fMin: R.lmax === Infinity ? 0 : limpio(C / R.lmax), fMax: R.lmin === 0 ? Infinity : limpio(C / R.lmin) }));
  }

  // ---------- Onda en el vacío ----------
  function foton(f) {
    positivo(f, 'la frecuencia f');
    const E = H_EV * f;
    return { E: limpio(E), EJ: limpio(E * E_CARGA) };
  }
  function desdeF(f) {
    const l = C / f, F = foton(f);
    return Object.assign({ f: limpio(f), lambda: limpio(l), lambdaNm: limpio(l * 1e9), c: C, E: F.E, EJ: F.EJ }, region(l));
  }
  function onda(valor, unidad) {
    const f = aHz(valor, unidad);
    const r = desdeF(f);
    r.errores = { multiplica: limpio(C * f), sinPrefijo: limpio(C / valor), exponente: limpio(r.lambda / 10) };
    return r;
  }
  function ondaDeLambda(valor, unidad) {
    const l = aMetros(valor, unidad);
    const r = desdeF(C / l);
    r.lambda = l; r.lambdaNm = limpio(l * 1e9);
    r.errores = { multiplica: limpio(C * l), sinPrefijo: limpio(C / valor) };
    return r;
  }

  // ---------- Los campos de la onda ----------
  function campos(electrico0) {
    positivo(electrico0, 'el campo eléctrico máximo');
    return { electrico0, B0: limpio(electrico0 / C),
      errores: { igual: electrico0, multiplica: limpio(electrico0 * C), kms: limpio(electrico0 / 3e5) } };
  }
  function campoDeB(B0) { positivo(B0, 'el campo magnético máximo B₀'); return { B0, electrico0: limpio(C * B0) }; }
  function vec(a, que) {
    if (!Array.isArray(a) || a.length !== 3) throw new Error(`${que} debe ser un vector [x, y, z]`);
    a.forEach(x => numero(x, que));
    return a;
  }
  const producto = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]].map(x => x + 0);
  const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function direccionB(dirE, dirAvance) {
    vec(dirE, 'la dirección del campo eléctrico'); vec(dirAvance, 'la dirección de avance');
    const ne = Math.hypot(...dirE), nk = Math.hypot(...dirAvance);
    if (!(ne > 0) || !(nk > 0)) throw new Error('las direcciones no pueden ser cero');
    if (Math.abs(punto(dirE, dirAvance)) > 1e-9 * ne * nk) throw new Error('el campo eléctrico debe ser perpendicular al avance (onda transversal)');
    const b = producto(dirAvance, dirE), nb = Math.hypot(...b);
    return b.map(x => limpio(x / nb) + 0);
  }
  function instante(x, t, lambda, T) {
    numero(x, 'x'); numero(t, 't'); positivo(lambda, 'λ'); positivo(T, 'el período T');
    const s = limpio(Math.sin(2 * Math.PI * (x / lambda - t / T)));
    return { electrico: s, B: s };
  }

  // ---------- Tiempos de viaje ----------
  function viaje(d, n) {
    noNegativo(d, 'la distancia d');
    const N = n === undefined ? 1 : positivo(n, 'el índice n');
    const v = C / N, t = d / v;
    return { v: limpio(v), t: limpio(t), min: Math.floor(t / 60 + 1e-9), s: limpio(t - 60 * Math.floor(t / 60 + 1e-9)),
      errores: { instantaneo: 0, minutos: limpio(t * 60), exponente: limpio(t / 10) } };
  }
  function eco(t) {
    positivo(t, 'el tiempo del eco t');
    return { d: limpio(C * t / 2), errores: { sinMitad: limpio(C * t), conSonido: limpio(V_SONIDO * t / 2) } };
  }

  // ---------- Al entrar a un medio ----------
  function medio(lambdaNm, n) {
    positivo(lambdaNm, 'la longitud de onda λ'); positivo(n, 'el índice n');
    if (n < 1) throw new Error('el índice de refracción no puede ser menor que 1');
    const f = C / (lambdaNm * 1e-9), l2 = lambdaNm / n, R = region(lambdaNm * 1e-9);
    return { n, v: limpio(C / n), lambdaNm: limpio(l2), lambda0Nm: lambdaNm, f: limpio(f), color: R.color, region: R.region,
      errores: {
        cambiaF: { v: limpio(C / n), f: limpio(f / n), lambdaNm },
        cambiaColor: { v: limpio(C / n), lambdaNm: limpio(l2), color: region(l2 * 1e-9).color },
        alReves: { v: limpio(C * n), lambdaNm: limpio(lambdaNm * n), f: limpio(f) },
        nadaCambia: { v: C, lambdaNm, f: limpio(f) },
      } };
  }

  // ---------- Qué atraviesa qué ----------
  const ORD = ['radio', 'microondas', 'infrarrojo', 'visible', 'ultravioleta', 'rayosX', 'gamma'];
  const TABLA = {
    pared:   { nombre: 'pared de ladrillo', fila: ['si', 'parcial', 'no', 'no', 'no', 'no', 'parcial'] },
    vidrio:  { nombre: 'vidrio de ventana', fila: ['si', 'si', 'parcial', 'si', 'parcial', 'parcial', 'si'] },
    piel:    { nombre: 'piel y músculo', fila: ['si', 'parcial', 'parcial', 'parcial', 'no', 'si', 'si'] },
    hueso:   { nombre: 'hueso', fila: ['si', 'parcial', 'no', 'no', 'no', 'parcial', 'parcial'] },
    rejilla: { nombre: 'rejilla metálica del horno', fila: ['no', 'no', 'si', 'si', 'si', 'si', 'si'] },
  };
  function atraviesa(material, reg) {
    if (!(material in TABLA)) throw new Error(`material desconocido: ${material}`);
    const k = ORD.indexOf(reg);
    if (k < 0) throw new Error(`región desconocida: ${reg}`);
    return TABLA[material].fila[k] || null;
  }
  function materiales() { return Object.keys(TABLA).map(id => ({ id, nombre: TABLA[id].nombre })); }

  // ---------- Regla logarítmica y referencias (para el dibujo) ----------
  function posicion(f, fmin, fmax) {
    positivo(f, 'f'); positivo(fmin, 'fmin'); positivo(fmax, 'fmax');
    if (!(fmax > fmin)) throw new Error('fmax debe ser mayor que fmin');
    return limpio((Math.log10(f) - Math.log10(fmin)) / (Math.log10(fmax) - Math.log10(fmin)));
  }
  function frecuenciaEn(u, fmin, fmax) {
    numero(u, 'u'); positivo(fmin, 'fmin'); positivo(fmax, 'fmax');
    return limpio(Math.pow(10, Math.log10(fmin) + u * (Math.log10(fmax) - Math.log10(fmin))));
  }
  function referencias() {
    return [
      { id: 'edificio', objeto: 'un edificio', tam: 30 },
      { id: 'persona', objeto: 'una persona', tam: 1.7 },
      { id: 'moneda', objeto: 'una moneda', tam: 0.02 },
      { id: 'bacteria', objeto: 'una bacteria', tam: 2e-6 },
      { id: 'virus', objeto: 'un virus', tam: 1e-7 },
      { id: 'atomo', objeto: 'un átomo', tam: 1e-10 },
    ].map(r => Object.assign(r, { f: limpio(C / r.tam) }, region(r.tam)));
  }

  function carrera(d, t, ondas) {
    positivo(d, 'la distancia d'); noNegativo(t, 'el tiempo t');
    const lista = ondas || ['radio', 'visible', 'rayosX'];
    return { tLlega: limpio(d / C), pos: lista.map(id => ({ id, x: limpio(Math.min(d, C * t)) })) };
  }

  // Color aproximado de la luz visible (copiado de plantillas/fisica-moderna/motor.js; solo para pintar la banda).
  function colorLuz(lambda) {
    numero(lambda, 'la longitud de onda λ');
    if (lambda < 380 || lambda > 750) return null;
    let r = 0, g = 0, b = 0;
    if (lambda < 440) { r = (440 - lambda) / 60; b = 1; }
    else if (lambda < 490) { g = (lambda - 440) / 50; b = 1; }
    else if (lambda < 510) { g = 1; b = (510 - lambda) / 20; }
    else if (lambda < 580) { r = (lambda - 510) / 70; g = 1; }
    else if (lambda < 600) { r = 1; g = 1 - 0.65 * (lambda - 580) / 20; }
    else if (lambda < 630) { r = 1; g = 0.35 * (630 - lambda) / 30; }
    else r = 1;
    const f = lambda < 420 ? 0.3 + 0.7 * (lambda - 380) / 40 : lambda > 700 ? 0.3 + 0.7 * (750 - lambda) / 50 : 1;
    const q = x => Math.round(255 * Math.pow(x * f, 0.8));
    return { r: q(r), g: q(g), b: q(b) };
  }

  // Un fotón ioniza si trae al menos unos 10 eV (borde de academia): del ultravioleta alto hacia arriba.
  const E_IONIZA = 10;
  function ionizante(f) {
    const F = foton(f);
    return { E: F.E, ioniza: F.E >= E_IONIZA, lambdaBordeNm: limpio(HC_EV_NM / E_IONIZA), errores: { potente: { ioniza: true } } };
  }

  // ---------- La expresión de la onda y su intensidad ----------
  const EPS0 = 8.85e-12;
  function intensidad(E0) {
    positivo(E0, 'el campo eléctrico máximo E0');
    return { I: limpio(C * EPS0 * E0 * E0 / 2), errores: { sinMitad: limpio(C * EPS0 * E0 * E0), sinCuadrado: limpio(C * EPS0 * E0 / 2) } };
  }
  function leerOnda(o) {
    if (!o || typeof o !== 'object') throw new Error('falta la onda { E0, k, w, signo }');
    positivo(o.E0, 'el campo eléctrico máximo E0'); positivo(o.k, 'el número de onda k'); positivo(o.w, 'la frecuencia angular ω');
    const signo = o.signo === undefined ? '-' : o.signo;
    if (signo !== '-' && signo !== '+') throw new Error("el signo debe ser '-' (k·x − ω·t) o '+' (k·x + ω·t)");
    const eje = vec(o.eje || [1, 0, 0], 'el eje'), dirE = vec(o.dirE || [0, 1, 0], 'la dirección del campo eléctrico');
    const avance = eje.map(x => (signo === '-' ? x : -x) + 0);
    const lambda = 2 * Math.PI / o.k, f = o.w / (2 * Math.PI), v = o.w / o.k;
    const dirB = direccionB(dirE, avance);
    const reg = l => Object.assign({ lambda: limpio(l) }, region(l));
    return Object.assign({ lambda: limpio(lambda), f: limpio(f), v: limpio(v), B0: limpio(o.E0 / v), avance, dirB, I: intensidad(o.E0).I }, region(lambda), {
      errores: {
        lambdaEsK: reg(o.k), unoSobreK: reg(1 / o.k), kSobreDosPi: reg(o.k / (2 * Math.PI)), fEsW: limpio(o.w),
        BParalelo: { dirB: dirE.slice() }, avanceAlReves: { avance: avance.map(x => -x + 0), dirB: dirB.map(x => -x + 0) }, BIgual: { B0: o.E0 },
      } });
  }

  // ---------- Refracción: el rayo que cambia de medio ----------
  const RAD = Math.PI / 180;
  const grados = x => limpio(Math.asin(Math.min(1, x)) / RAD);
  function indice(n, que) { positivo(n, que); if (n < 1) throw new Error(`${que} no puede ser menor que 1`); return n; }
  function anguloLimite(n1, n2) {
    indice(n1, 'el índice n1'); indice(n2, 'el índice n2');
    const L = n1 > n2 ? grados(n2 / n1) : null;
    const inv = n1 / n2, existeInv = n2 > n1; // con los índices al revés, sen L = n1/n2
    return { existe: n1 > n2, L, senL: n1 > n2 ? limpio(n2 / n1) : null,
      errores: { invertido: { existe: existeInv, L: existeInv ? grados(n1 / n2) : null, senL: limpio(inv) },
        desdeSuperficie: { L: L === null ? null : limpio(90 - L) }, rozando: { L: 90 } } };
  }
  // Fresnel para luz sin polarizar: fracción de la potencia que se refleja.
  function reflejada(n1, n2, i, r) {
    if (r === null) return 1;
    const ci = Math.cos(i * RAD), cr = Math.cos(r * RAD);
    const rs = (n1 * ci - n2 * cr) / (n1 * ci + n2 * cr), rp = (n1 * cr - n2 * ci) / (n1 * cr + n2 * ci);
    return limpio((rs * rs + rp * rp) / 2);
  }
  function snell(n1, n2, i) {
    indice(n1, 'el índice n1'); indice(n2, 'el índice n2'); numero(i, 'el ángulo de incidencia');
    if (i < 0 || i > 90) throw new Error('el ángulo de incidencia va de 0° a 90°, medido desde la normal');
    const senR = limpio(n1 * Math.sin(i * RAD) / n2);
    const total = senR > 1;
    const r = total ? null : grados(senR);
    const senInv = n2 * Math.sin(i * RAD) / n1, totalInv = senInv > 1 + 1e-12;
    const R = reflejada(n1, n2, i, r);
    return { n1, n2, i, r, senR, total, seAcerca: !total && r < i, reflejado: i, R, T: limpio(1 - R), L: anguloLimite(n1, n2).L,
      errores: { noSeDesvia: { r: i }, alReves: { r: totalInv ? null : grados(senInv), total: totalInv },
        desdeSuperficie: { r: total ? null : limpio(90 - r) }, noPasa: { total: true } } };
  }

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    C, HC_EV_NM, E_CARGA, H_EV, V_SONIDO, E_IONIZA, EPS0,
    aHz, aMetros, region, regiones, onda, ondaDeLambda, foton, campos, campoDeB, direccionB, producto, punto, instante,
    viaje, eco, medio, atraviesa, materiales, posicion, frecuenciaEn, referencias, carrera, colorLuz, ionizante, intensidad, leerOnda,
    snell, anguloLimite, azar,
  };
});
