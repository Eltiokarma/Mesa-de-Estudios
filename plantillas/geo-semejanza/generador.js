/*
 * Generador «Proporcionalidad y semejanza»: la práctica de las seis ideas de geometria.proporcionalidad-y-semejanza
 * (contenido/teoria/geometria/proporcionalidad-y-semejanza.js). Formato "predicciones" (docs/arquitectura.md). Funciona en
 * el navegador (window.Generadores['geo-semejanza']) y en Node (require). Propuesta: docs/etapa8/propuesta-geometria.md §7a.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   thales           tres (1): el tramo que falta con tres paralelas · total (2): un tramo desde el total de la otra
 *                    secante · triangulo (1): la paralela en el triángulo · thales-x (3): la x en los tramos
 *   bisectriz        tramo (1): un tramo desde los tres lados · lado (1): un lado desde los tramos · perimetro (2): el
 *                    perímetro del terreno · exterior (3): la bisectriz exterior
 *   semejanza        sombra (1): el poste por su sombra · base (2): el segmento paralelo a la base · lll (2): ¿son
 *                    semejantes? · espejo (3): el edificio con el espejo en el piso
 *   encajados        cruzados (1): AB ∥ CD con las diagonales cruzadas · anti (2): la antiparalela · comun (3): el lado
 *                    que se repite (AB · AB = AD · AC) · cuadrado (3): el cuadrado sobre la base
 *   area-y-escala    area (1): el área desde k · lindero (2): el cerco paralelo · per-area (2): perímetro o área ·
 *                    raices (3): las raíces de áreas
 *   ceva-menelao     ceva (1): un tramo con Ceva · ceva-razon (2): la razón que falta · menelao (3): un tramo por fuera ·
 *                    ceva-x (3): la x con Ceva
 * Todos se resuelven con el texto (sin figura): la práctica y el papel no llevan dibujo.
 *
 * Datos (punto 13; molde §4): una línea por dato, las mismas de la teoría, nunca el paso hecho. Sin incentro, baricentro
 * ni relaciones métricas de la circunferencia (llegan después). Colores: lo pedido y su resultado en violeta, solo en la
 * solución. Errores (hipótesis de aula, salvo GE1, GE2, GE8 y GE22 del informe; docs/investigacion/geometria-ideas-
 * erroneas.md, «Proporcionalidad y semejanza (19 nov)»). Ninguna explicación nombra una alternativa por su letra; cada
 * una empieza por lo que el alumno hizo bien o dice qué es el valor que dio. Cuentas comprobadas con un script aparte
 * (casos.json, «verificacion») y en generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-semejanza';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const cm = x => `${f(x)} cm`, m = x => `${f(x)} m`, cm2 = x => `${f(x)} cm²`, m2 = x => `${f(x)} m²`;
  const RESP = new Set(['GE1', 'GE2', 'GE8', 'GE22']);
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: RESP.has(id) ? 'parcial' : 'hipotesis', fuente: null });
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const existe = (a, b, c) => a < b + c && b < a + c && c < a + b;
  const razon = (a, b) => { const g = mcd(a, b); return `${a / g} : ${b / g}`; };
  const fr = (n, d) => { const g = mcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };

  const D = {
    thales: 'Thales: tres o más paralelas cortan a dos secantes en tramos proporcionales, en el mismo orden: AB/BC = DE/EF.',
    tri: 'En un triángulo ABC, si MN ∥ BC (M en AB, N en AC): AM/MB = AN/NC.',
    suma: 'Un tramo entero es la suma de sus partes: AC = AB + BC.',
    bis: 'Teorema de la bisectriz: la bisectriz de A llega a BC en D, y BD/DC = AB/AC.',
    bisext: 'La bisectriz exterior de A llega a la prolongación de BC en E, y BE/CE = AB/AC.',
    perim: 'El perímetro de un triángulo es la suma de sus tres lados.',
    aa: 'AA: si dos triángulos tienen dos ángulos iguales, son semejantes.',
    sem: 'Semejantes: cada lado se multiplica por el mismo k, en el orden de los vértices.',
    lll: 'LLL: si los tres lados de un triángulo están en la misma razón con los de otro, son semejantes.',
    sol: 'A la misma hora, los rayos del sol llegan paralelos: forman el mismo ángulo con el suelo.',
    para: 'Una paralela a un lado de un triángulo forma con los otros dos un triángulo semejante al grande.',
    espejo: 'El rayo de luz sale del espejo con el mismo ángulo (con el suelo) con que llega.',
    enc: 'Si dos triángulos comparten un ángulo y tienen otro ángulo igual, son semejantes (AA).',
    hom: 'Lados homólogos: el lado frente a un ángulo va con el lado frente a su ángulo igual.',
    opv: 'Los ángulos opuestos por el vértice miden igual.',
    alt: 'Una recta que corta dos paralelas forma ángulos alternos internos iguales.',
    altura: 'En triángulos semejantes, también las alturas se multiplican por k.',
    area: 'Áreas de semejantes con razón k: S₂/S₁ = k², con S₂ el área de la grande y S₁ la de la chica.',
    per: 'Si dos figuras son semejantes con razón k, sus perímetros están en razón k.',
    raices: 'Por un punto interior, paralelas a los lados forman tres triángulos semejantes al grande, de áreas S₁, S₂ y S₃.',
    fila: 'Los lados de los tres triángulos chicos, puestos en fila, cubren el lado del grande.',
    ceva: 'Ceva: AD, BE y CF concurren si y solo si AF/FB · BD/DC · CE/EA = 1.',
    // Auditoría (20 nov): Menelao en un solo sentido (con largos sin signo, el recíproco es falso: los puntos medios dan 1).
    mene: 'Menelao: la recta por F, D y E (en AB, BC y CA alargado) da AF/FB · BD/DC · CE/EA = 1.',
    largos: 'Cada tramo se mide como un largo, sin signo.',
  };

  // =============================== Idea 1: Thales ===============================
  function tres(rng) {
    for (;;) {
      const a = rng.entero(2, 12), b = rng.entero(2, 12), k = rng.elegir([1.5, 2, 2.5, 3, 0.5]), c = a * k, x = b * k;
      if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * x)) continue;
      return { enunciado: [`Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = ${a} cm, BC = ${b} cm y DE = ${f(c)} cm.`], pregunta: ['¿Cuánto mide EF?'],
        datos: [D.thales], correcta: x, fmt: cm,
        errores: [er('GE22', a * c / b, `Usar la razón está bien; pero va AB con DE y BC con EF: ${a}/${b} = ${f(c)}/EF.`), er('GE-THA1', c + b - a, `Sumar la diferencia, ${b} − ${a}, sería si los tramos crecieran igual; crecen en la misma razón.`),
          er('GE-THA5', c * (a + b) / a, `La razón está bien; ${f(c * (a + b) / a)} cm es DF entero, no EF.`), er('GE-THA2', b, `${b} cm es BC; EF está en la otra secante.`)],
        solucion: [[`${a}/${b} = ${f(c)}/EF.`], ['EF = ', v('x', cm(x)), '.']], _datos: { tipo: 'tres', idea: 'thales', nivel: 1, a, b, c } };
    }
  }
  function total(rng) {
    for (;;) {
      const p = rng.entero(1, 5), q = rng.entero(1, 6), k = rng.entero(2, 5), u = rng.entero(2, 9);
      if (p === q || mcd(p, q) !== 1) continue;
      const a = p * k, b = q * k, T = (p + q) * u, x = p * u;
      return { enunciado: [`Tres rectas paralelas cortan a dos secantes: la primera en A, B y C; la segunda en D, E y F. AB = ${a} m, BC = ${b} m y DF = ${T} m.`], pregunta: ['¿Cuánto mide DE?'],
        datos: [D.thales, D.suma], correcta: x, fmt: m,
        errores: [er('GE22', T * a / b, `Usar Thales está bien; pero ${a}/${b} es parte con parte, y ${T} es el todo: no se emparejan.`), er('GE-THA4', T / 2, `Partir DF está bien; pero en la razón ${razon(a, b)}, no por la mitad.`),
          er('GE-THA5', q * u, `El reparto está bien: ${f(q * u)} m es EF, la otra parte.`), er('GE-THA1', T - a - b, 'Restar no sirve: DE y EF se reparten DF en la misma razón que AB y BC.')],
        solucion: [[`AB : BC = ${razon(a, b)}: DF en ${p + q} partes de ${u} m.`], [`DE = ${p} · ${u} = `, v('x', m(x)), '.']], _datos: { tipo: 'total', idea: 'thales', nivel: 2, a, b, T } };
    }
  }
  function triangulo(rng) {
    for (;;) {
      const a = rng.entero(2, 10), b = rng.entero(2, 10), k = rng.elegir([1.5, 2, 3, 0.5, 2.5]), c = a * k, x = b * k;
      if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * x)) continue;
      return { enunciado: [`En el triángulo ABC, MN es paralela a BC, con M en AB y N en AC. AM = ${a} cm, MB = ${b} cm y AN = ${f(c)} cm.`], pregunta: ['¿Cuánto mide NC?'],
        datos: [D.tri], correcta: x, fmt: cm,
        errores: [er('GE22', a * c / b, `Usar la razón está bien; pero va AM con AN y MB con NC: ${a}/${b} = ${f(c)}/NC.`), er('GE-THA1', c + b - a, 'Sumar la diferencia sería si los tramos crecieran igual; crecen en la misma razón.'),
          er('GE-THA5', c * (a + b) / a, `La razón está bien; ${f(c * (a + b) / a)} cm es AC entero, no NC.`), er('GE-THA2', b, `${b} cm es MB; NC está en el otro lado.`)],
        solucion: [[`${a}/${b} = ${f(c)}/NC.`], ['NC = ', v('x', cm(x)), '.']], _datos: { tipo: 'triangulo', idea: 'thales', nivel: 1, a, b, c } };
    }
  }
  function thalesX(rng) {
    for (;;) {
      const mm = rng.entero(2, 9), n = rng.entero(mm + 1, 14), p = rng.entero(1, 6), x = mm * p / (n - mm);
      if (!Number.isInteger(x) || x < 1 || x > 20) continue;
      const AB = 2 * x + p;
      return { enunciado: [`En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = x, MB = x + ${p}, AN = ${mm} y NC = ${n}, en centímetros.`], pregunta: ['¿Cuánto mide AB?'],
        datos: [D.tri], correcta: AB, fmt: cm,
        errores: [er('GE-THA6', x, `La ecuación está bien: x = ${x}. Falta AB = x + (x + ${p}).`), er('GE-THA6', x + p, `x = ${x} está bien; ${x + p} cm es solo MB.`),
          er('GE-THA2', mm + n, `${mm + n} cm es AC; AB es el otro lado.`), er('GE-THA6', 2 * x, `x = ${x} está bien; pero MB es x + ${p}, no x.`)],
        solucion: [[`x/(x + ${p}) = ${mm}/${n}, así que ${n}x = ${mm}x + ${mm * p} y x = ${x}.`], [`AB = ${x} + ${x + p} = `, v('x', cm(AB)), '.']], _datos: { tipo: 'thales-x', idea: 'thales', nivel: 3, mm, n, p } };
    }
  }

  // =============================== Idea 2: bisectriz ===============================
  function lados(rng) {
    for (;;) {
      const p = rng.entero(1, 5), q = rng.entero(1, 6), k = rng.entero(2, 7), u = rng.entero(1, 5);
      if (p === q || mcd(p, q) !== 1) continue;
      const c = p * k, b = q * k, a = (p + q) * u;
      if (existe(a, b, c)) return { p, q, k, u, c, b, a };
    }
  }
  function tramo(rng) {
    const { p, q, u, c, b, a } = lados(rng), bd = rng.entero(0, 1) === 1, x = bd ? p * u : q * u, otro = bd ? q * u : p * u, nom = bd ? 'BD' : 'DC';
    return { enunciado: [`En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La bisectriz de A llega a BC en D.`], pregunta: [`¿Cuánto mide ${nom}?`],
      datos: [D.bis], correcta: x, fmt: cm,
      errores: [er('GE8', a / 2, 'Repartir BC está bien; pero la bisectriz no llega al medio: sale de la razón de los lados.'), er('GE-PIE1', otro, `El reparto está bien: ${f(otro)} cm es el otro tramo. ${nom} va con el lado que lo toca.`),
        er('GE-PIE3', u, `${f(u)} cm es una sola parte; ${nom} toma ${bd ? p : q}.`), er('GE-PIE4', bd ? a * c / b : a * b / c, 'Usar los lados está bien; pero BC se reparte en partes, no se divide entre un lado.')],
      solucion: [[`BD : DC = ${c} : ${b} = ${p} : ${q}; BC en ${p + q} partes de ${u} cm.`], [`${nom} = `, v('x', cm(x)), '.']], _datos: { tipo: 'tramo', idea: 'bisectriz', nivel: 1, a, b, c, pide: nom } };
  }
  function lado(rng) {
    const { p, q, u, c, b } = lados(rng);
    return { enunciado: [`En el triángulo ABC, la bisectriz de A llega a BC en D, con BD = ${p * u} cm y DC = ${q * u} cm. AB = ${c} cm.`], pregunta: ['¿Cuánto mide AC?'],
      datos: [D.bis], correcta: b, fmt: cm,
      errores: [er('GE-PIE1', c * p / q, `Usar la razón está bien; pero AC va con DC: ${p * u}/${q * u} = ${c}/AC.`), er('GE-PIE2', c + q * u - p * u, 'Sumar la diferencia de los tramos sería si crecieran igual; van en la misma razón.'),
        er('GE8', c, 'AC igual a AB solo si D cae en el medio; aquí los tramos son distintos.'), er('GE-PIE4', q * u, `${q * u} cm es DC, un tramo de BC; AC es el lado.`)],
      solucion: [[`${p * u}/${q * u} = ${c}/AC.`], ['AC = ', v('x', cm(b)), '.']], _datos: { tipo: 'lado', idea: 'bisectriz', nivel: 1, bd: p * u, dc: q * u, c } };
  }
  function perimetro(rng) {
    const { p, q, u, c, b, a } = lados(rng), Pm = a + b + c;
    return { enunciado: [`Un canal recto parte la esquina A de un terreno triangular ABC en dos ángulos iguales y llega a BC en D. BD = ${p * u} m, DC = ${q * u} m y AB = ${c} m.`], pregunta: ['¿Cuál es el perímetro del terreno?'],
      datos: [D.bis, D.perim], correcta: Pm, fmt: m,
      errores: [er('GE8', a + 2 * c, 'Sumar los tres lados está bien; pero AC no mide lo que AB: D no está en el medio.'), er('GE-PIE1', a + c + c * p / q, `Sumar está bien; pero AC va con DC: AC = ${b} m.`),
        er('GE-PIE5', a + b, `AC = ${b} m está bien; falta sumar AB.`), er('GE-PIE5', b + c, `AC = ${b} m está bien; falta sumar BC = ${a} m.`)],
      solucion: [[`${p * u}/${q * u} = ${c}/AC da AC = ${b} m; BC = ${a} m.`], [`${c} + ${b} + ${a} = `, v('x', m(Pm)), '.']], _datos: { tipo: 'perimetro', idea: 'bisectriz', nivel: 2, bd: p * u, dc: q * u, c } };
  }
  function exterior(rng) {
    for (;;) {
      const b = rng.entero(2, 12), k = rng.entero(1, 6), c = b + k, a = rng.entero(k + 1, b + c - 1), x = a * b / k;
      if (!Number.isInteger(2 * x) || !existe(a, b, c) || x > 120) continue;
      return { enunciado: [`En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La bisectriz del ángulo exterior en A corta la prolongación de BC en E.`], pregunta: ['¿Cuánto mide CE?'],
        datos: [D.bisext], correcta: x, fmt: cm,
        errores: [er('GE-PIE6', a * b / (b + c), `${f(a * b / (b + c))} cm es DC, el tramo de la bisectriz interior; E está afuera, más allá de C.`), er('GE-PIE7', a + x, `La ecuación está bien: CE = ${f(x)} cm. ${f(a + x)} cm es BE entero.`),
          er('GE-PIE1', a * c / k, 'Plantear afuera está bien; pero CE va con AC, el lado que lo toca.'), er('GE-PIE2', a, `${a} cm es BC; CE es lo que sigue después de C.`)],
        solucion: [[`(${a} + CE)/CE = ${c}/${b}.`], ['CE = ', v('x', cm(x)), '.']], _datos: { tipo: 'exterior', idea: 'bisectriz', nivel: 3, a, b, c } };
    }
  }

  // =============================== Idea 3: semejanza ===============================
  function sombra(rng) {
    for (;;) {
      const h = rng.elegir([1.5, 1.6, 1.8, 2]), s = rng.elegir([1, 1.2, 1.5, 2, 2.5]), k = rng.entero(3, 6), S = s * k, H = h * k;
      if (H > 12) continue;
      return { enunciado: [`A la misma hora, un poste proyecta una sombra de ${m(S)} y un palo vertical de ${m(h)} proyecta una de ${m(s)}.`], pregunta: ['¿Cuánto mide el poste?'],
        datos: [D.sol, D.aa, D.sem], correcta: H, fmt: m,
        errores: [er('GE22', S * s / h, 'Usar la razón está bien; pero va alto con alto y sombra con sombra.'), er('GE-SEM1', S + h - s, 'Sumar la diferencia sería si todo creciera igual; crece en la misma razón.'),
          er('GE-SEM2', S, `${f(S)} m es la sombra; el poste y su sombra miden igual solo con el sol a 45°.`), er('GE-SEM3', k, `${k} es cuántas veces cabe la sombra chica en la grande; falta multiplicar el palo.`)],
        solucion: [[`La sombra del poste es ${f(S)} ÷ ${f(s)} = ${k} veces la del palo.`], [`poste = ${k} · ${f(h)} = `, v('x', m(H)), '.']], _datos: { tipo: 'sombra', idea: 'semejanza', nivel: 1, S, h, s } };
    }
  }
  function base(rng) {
    for (;;) {
      const p = rng.entero(1, 5), q = rng.entero(1, 6), u = rng.entero(1, 4), w = rng.entero(2, 6);
      if (p === q || mcd(p, q) !== 1) continue;
      const AM = p * u, MB = q * u, BC = (p + q) * w, MN = p * w;
      return { enunciado: [`En el triángulo ABC, MN es paralela a BC (M en AB, N en AC). AM = ${AM} cm, MB = ${MB} cm y BC = ${BC} cm.`], pregunta: ['¿Cuánto mide MN?'],
        datos: [D.para, D.sem], correcta: MN, fmt: cm,
        errores: [er('GE22', BC * AM / MB, 'Usar la razón está bien; pero MN va con BC, y AM con AB entero, no con MB.'), er('GE-SEM1', BC - MB, 'Restar no sirve: el triángulo chico es el grande multiplicado por un número.'),
          er('GE-SEM5', BC / 2, 'La mitad de BC vale solo si M es el punto medio de AB.'), er('GE-THA5', q * w, 'El reparto está bien; pero MN va con AM, la parte de arriba.')],
        solucion: [[`AMN ∼ ABC con k = ${AM} ÷ ${AM + MB}.`], [`MN = ${BC} · ${AM} ÷ ${AM + MB} = `, v('x', cm(MN)), '.']], _datos: { tipo: 'base', idea: 'semejanza', nivel: 2, AM, MB, BC } };
    }
  }
  function lll(rng) {
    for (;;) {
      const T = rng.elegir([[3, 4, 5], [4, 6, 7], [5, 6, 8], [2, 3, 4], [4, 5, 6], [5, 7, 9]]), k = rng.elegir([1.5, 2, 2.5, 3]), si = rng.entero(0, 1) === 1;
      const o = T.map(x => x * k);
      if (!si) o[2] += rng.elegir([-1, 1, 2]);
      // Auditoría (20 nov): el triángulo del «No» tiene que existir (2, 3 y 4 por 1,5, más 2: 3; 4,5; 8 no existe).
      if (o.some(x => !Number.isInteger(2 * x)) || !existe(...o)) continue;
      const ok = si ? `Sí, con k = ${f(k)}` : `No: ${f(o[2])} ÷ ${T[2]} no es ${f(k)}`;
      const otros = si ? [['No: sus lados no miden igual', 'GE-SEM4', 'Semejantes no es iguales: basta que todos se multipliquen por el mismo número.'], ['Faltan los ángulos', 'GE-SEM6', 'Con los tres lados en la misma razón alcanza: es LLL.'], ['No: las diferencias no son iguales', 'GE-SEM1', 'Se comparan cocientes, no restas.']]
        : [[`Sí: dos lados dan ${f(k)}`, 'GE-SEM6', 'Dos lados no alcanzan: los tres tienen que dar el mismo cociente.'], ['Faltan los ángulos', 'GE-SEM6', 'Con los tres lados basta: se comparan sus cocientes.'], ['Sí: los cocientes casi coinciden', 'GE-SEM6', 'Casi no alcanza: tienen que ser iguales.']];
      return { texto: true, enunciado: [`Un triángulo tiene lados de ${T[0]} cm, ${T[1]} cm y ${T[2]} cm, y otro, de ${f(o[0])} cm, ${f(o[1])} cm y ${f(o[2])} cm.`], pregunta: ['¿Son semejantes?'],
        datos: [D.lll], correcta: { clave: si ? 'si' : 'no', texto: ok },
        errores: otros.map(([t, id, e], k2) => ({ id, clave: `o${k2}`, texto: t, explicacion: e, respaldo: 'hipotesis' })),
        solucion: [[`Cocientes en orden: ${o.map((x, i) => `${f(x)} ÷ ${T[i]} ${Number.isInteger(100 * x / T[i]) ? '=' : '≈'} ${f(x / T[i])}`).join('; ')}.`], [v('x', si ? 'Sí son semejantes' : 'No son semejantes'), '.']],
        _datos: { tipo: 'lll', idea: 'semejanza', nivel: 2, T, o } };
    }
  }
  function espejo(rng) {
    for (;;) {
      const ojo = rng.elegir([1.5, 1.6]), a = rng.elegir([1.5, 2, 2.5, 3]), k = rng.entero(3, 8), b = a * k, H = ojo * k;
      if (H > 15 || !Number.isInteger(2 * b)) continue;
      return { enunciado: [`Un espejo en el piso está a ${m(a)} de un alumno, con los ojos a ${m(ojo)} de altura, y a ${m(b)} de un edificio. Él ve en el espejo lo más alto del edificio.`], pregunta: ['¿Cuánto mide el edificio?'],
        datos: [D.espejo, D.aa, D.sem], correcta: H, fmt: m,
        errores: [er('GE22', ojo * a / b, 'Usar la razón está bien; pero el edificio es el grande: tiene que salir mayor que el alumno.'), er('GE-SEM1', ojo + b - a, 'Sumar la diferencia sería si todo creciera igual; crece en la misma razón.'),
          er('GE-SEM2', b, `${f(b)} m es el piso hasta el edificio, no su altura.`), er('GE-SEM7', ojo * (a + b) / a, 'Usar el piso entero no sirve: cada triángulo tiene su tramo.')],
        solucion: [[`Mismo ángulo en el espejo: el piso del edificio es ${f(b)} ÷ ${f(a)} = ${k} veces el del alumno.`], [`${k} · ${f(ojo)} = `, v('x', m(H)), '.']], _datos: { tipo: 'espejo', idea: 'semejanza', nivel: 3, a, ojo, b } };
    }
  }

  // =============================== Idea 4: triángulos encajados ===============================
  function cruzados(rng) {
    for (;;) {
      const a = rng.entero(2, 9), k = rng.elegir([1.5, 2, 2.5, 3]), b = rng.entero(2, 9), c = a * k, d = b * k;
      if (a === b || !Number.isInteger(2 * c) || !Number.isInteger(2 * d)) continue;
      return { enunciado: [`Los segmentos AC y BD se cortan en O, con AB paralela a CD. OA = ${a} cm, OC = ${f(c)} cm y AB = ${b} cm.`], pregunta: ['¿Cuánto mide CD?'],
        datos: [D.opv, D.alt, D.sem], correcta: d, fmt: cm,
        errores: [er('GE22', b * a / c, 'Usar la razón está bien; pero CD está del lado grande: OC > OA.'), er('GE-SEM1', b + c - a, 'Sumar la diferencia sería si creciera igual; crece en la misma razón.'),
          er('GE-HOM3', c, `${f(c)} cm es OC; CD es la pareja de AB.`), er('GE-SEM3', k, `${f(k)} es k; falta multiplicar AB.`)],
        solucion: [[`OAB ∼ OCD: k = ${f(c)} ÷ ${a} = ${f(k)}.`], [`CD = ${f(k)} · ${b} = `, v('x', cm(d)), '.']], _datos: { tipo: 'cruzados', idea: 'encajados', nivel: 1, a, c, b } };
    }
  }
  function anti(rng) {
    for (;;) {
      const ab = rng.entero(5, 15), ac = rng.entero(5, 15), ae = rng.entero(2, Math.min(ac, ab) - 1), ad = ae * ac / ab;
      if (ab === ac || !Number.isInteger(4 * ad) || ad >= ab || Math.abs(ad - ae) < 1e-9) continue;
      return { enunciado: [`En el triángulo ABC, AB = ${ab} cm y AC = ${ac} cm. D está en AB y E en AC, con AE = ${ae} cm y m∠ADE = m∠ACB.`], pregunta: ['¿Cuánto mide AD?'],
        datos: [D.enc, D.hom, D.sem], correcta: ad, fmt: cm,
        errores: [er('GE22', ae * ab / ac, 'Usar la semejanza está bien; pero AD/AB = AE/AC vale si DE ∥ BC. Aquí D va con C.'), er('GE-HOM1', ae, 'AD = AE solo si ADE fuera isósceles; no hay dato para eso.'),
          er('GE-HOM2', ac - ae, 'Restar AC − AE da EC, lo que falta de AC; AD está en el otro lado.'), er('GE-THA5', ab - ad, `La semejanza está bien: AD = ${f(ad)} cm. ${f(ab - ad)} cm es DB.`)],
        solucion: [['ADE ∼ ACB: AD va con AC y AE con AB.'], [`AD = ${ac} · ${ae} ÷ ${ab} = `, v('x', cm(ad)), '.']], _datos: { tipo: 'anti', idea: 'encajados', nivel: 2, ab, ac, ae } };
    }
  }
  function comun(rng) {
    for (;;) {
      const ad = rng.entero(1, 9), ac = rng.entero(ad + 1, 25), p = ad * ac, ab = Math.round(Math.sqrt(p));
      if (ab * ab !== p || ab >= ac || ab <= ad) continue;
      return { enunciado: [`En el triángulo ABC, D está en AC, con AD = ${ad} cm y DC = ${ac - ad} cm, y m∠ABD = m∠ACB.`], pregunta: ['¿Cuánto mide AB?'],
        datos: [D.enc, D.hom, D.sem], correcta: ab, fmt: cm,
        errores: [er('GE-HOM4', (ad + ac) / 2, 'Ver que AB queda entre AD y AC está bien; pero no es su promedio: AB · AB = AD · AC.'), er('GE-HOM1', ad, `${ad} cm es AD; AB es la pareja de AD en el otro triángulo, no la misma medida.`),
          er('GE-HOM2', ac - ad, `${ac - ad} cm es DC; AB sale de la semejanza ABD ∼ ACB.`), er('GE-HOM3', ac, `${ac} cm es AC entero, la pareja de AB en el grande.`)],
        solucion: [[`ABD ∼ ACB: AB/AC = AD/AB, así que AB · AB = ${ad} · ${ac} = ${p}.`], ['AB = ', v('x', cm(ab)), '.']], _datos: { tipo: 'comun', idea: 'encajados', nivel: 3, ad, ac } };
    }
  }
  function cuadrado(rng) {
    for (;;) {
      const b = rng.entero(4, 30), h = rng.entero(3, 24), x = b * h / (b + h);
      if (!Number.isInteger(2 * x) || b === h) continue;
      return { enunciado: [`Un triángulo tiene una base de ${b} cm y una altura de ${h} cm sobre ella. Un cuadrado se apoya en la base, con sus dos vértices de arriba en los otros lados.`], pregunta: ['¿Cuánto mide el lado del cuadrado?'],
        datos: [D.para, D.sem, D.altura], correcta: x, fmt: cm,
        errores: [er('GE-HOM4', (b + h) / 2, 'Promediar no sirve: el lado sale de la semejanza del triángulo de arriba.'), er('GE-SEM5', Math.min(b, h) / 2, 'La mitad no es: el triángulo de arriba tiene base x y altura (altura − x).'),
          er('GE-HOM4', b + h, 'Sumar no sirve: el lado es menor que la base y que la altura.'), er('GE-SEM1', Math.abs(b - h), 'Restar no sirve: plantea x/base = (altura − x)/altura.')],
        solucion: [[`x/${b} = (${h} − x)/${h}, así que ${h}x = ${b * h} − ${b}x.`], ['x = ', v('x', cm(x)), '.']], _datos: { tipo: 'cuadrado', idea: 'encajados', nivel: 3, b, h } };
    }
  }

  // =============================== Idea 5: áreas ===============================
  function area(rng) {
    const k = rng.elegir([1.5, 2, 2.5, 3, 4, 5]), S = rng.entero(2, 40) * (k === 1.5 || k === 2.5 ? 4 : 1), x = S * k * k;
    return { enunciado: [`Dos figuras son semejantes, y cada lado de la grande mide ${f(k)} veces el de la chica. La chica tiene ${S} cm² de área.`], pregunta: ['¿Cuál es el área de la grande?'],
      datos: [D.area], correcta: x, fmt: cm2,
      errores: [er('GE1', S * k, 'Multiplicar por k está bien para un largo; el área crece a lo largo y a lo ancho: por k².'), er('GE2', S * k * k * k, 'k³ es para el volumen, con tres medidas; el área tiene dos.'),
        er('GE-ARE2', S * 2 * k, 'k² no es 2 · k: es k por k.'), er('GE-ARE3', S + k * k, 'k² multiplica el área, no se le suma.')],
      solucion: [[`k² = ${f(k)} · ${f(k)} = ${f(k * k)}.`], [`${S} · ${f(k * k)} = `, v('x', cm2(x)), '.']], _datos: { tipo: 'area', idea: 'area-y-escala', nivel: 1, k, S } };
  }
  function lindero(rng) {
    const [p, q] = rng.elegir([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), u = rng.entero(2, 12), S = q * q * u, ch = p * p * u, tr = S - ch, otra = rng.entero(0, 1) === 1;
    return { enunciado: [`Un terreno triangular de ${S} m² se parte con un cerco paralelo a un lado. El triángulo junto al vértice opuesto tiene sus lados en ${p}/${q} de los del terreno.`], pregunta: [`¿Cuál es el área ${otra ? 'de la otra parte' : 'de ese triángulo'}?`],
      datos: [D.area], correcta: otra ? tr : ch, fmt: m2,
      errores: [er('GE1', otra ? S - S * p / q : S * p / q, `${p}/${q} es la razón de los lados; el área va por (${p}/${q})².`), er('GE-ARE6', otra ? ch : tr, 'La cuenta está bien; pero esa es la otra parte del terreno.'),
        er('GE2', otra ? S - S * p ** 3 / q ** 3 : S * p ** 3 / q ** 3, 'Elevar al cubo es para el volumen; el área va al cuadrado.'), er('GE-ARE1', S / 2, 'Un cerco paralelo no parte el terreno por la mitad: depende de la razón al cuadrado.')],
      solucion: [[`El triángulo: ${S} · (${p}/${q})² = ${ch} m².`], otra ? [`${S} − ${ch} = `, v('x', m2(tr)), '.'] : ['Su área: ', v('x', m2(ch)), '.']], _datos: { tipo: 'lindero', idea: 'area-y-escala', nivel: 2, S, p, q, otra } };
  }
  function perArea(rng) {
    const k = rng.entero(2, 5), Pm = rng.entero(6, 30), S = rng.entero(3, 30), pideP = rng.entero(0, 1) === 1, x = pideP ? Pm * k : S * k * k;
    return { enunciado: [`Dos triángulos son semejantes con k = ${k}, del chico al grande. El chico tiene ${Pm} cm de perímetro y ${S} cm² de área.`], pregunta: [`¿Cuánto mide ${pideP ? 'el perímetro' : 'el área'} del grande?`],
      datos: [D.per, D.area], correcta: x, fmt: pideP ? cm : cm2,
      errores: pideP ? [er('GE-ARE7', Pm * k * k, 'k² es para el área; el perímetro es un largo y va por k.'), er('GE-ARE6', S * k * k, 'Esa es el área del grande; piden su perímetro.'), er('GE-ARE3', Pm + k, 'k multiplica, no se suma.'), er('GE2', Pm * k ** 3, 'k³ es para un volumen; el perímetro va por k.')]
        : [er('GE1', S * k, 'Por k va el perímetro; el área va por k².'), er('GE-ARE6', Pm * k, 'Ese es el perímetro del grande; piden su área.'), er('GE2', S * k ** 3, 'k³ es para un volumen; el área va por k².'), er('GE-ARE3', S + k * k, 'k² multiplica el área, no se le suma.')],
      solucion: [[pideP ? 'El perímetro es un largo: va por k.' : 'El área va por k².'], pideP ? [`${Pm} · ${k} = `, v('x', cm(x)), '.'] : [`${S} · ${k * k} = `, v('x', cm2(x)), '.']], _datos: { tipo: 'per-area', idea: 'area-y-escala', nivel: 2, k, Pm, S, pideP } };
  }
  function raices(rng) {
    for (;;) {
      const a = rng.entero(1, 6), b = rng.entero(1, 6), c = rng.entero(1, 7);
      if (a === b || b === c || a === c) continue;
      const S = (a + b + c) ** 2, q = a * a + b * b + c * c;
      return { enunciado: [`Por un punto interior de un triángulo se trazan paralelas a sus tres lados. Quedan tres triángulos de ${a * a} cm², ${b * b} cm² y ${c * c} cm².`], pregunta: ['¿Cuál es el área del triángulo grande?'],
        datos: [D.raices, D.area, D.fila], correcta: S, fmt: cm2,
        errores: [er('GE-ARE8', q, 'Sumar las áreas no alcanza: faltan los paralelogramos. Se suman las raíces.'), er('GE-ARE5', a + b + c, `La suma de las raíces, ${a + b + c}, es √S: falta elevar al cuadrado.`),
          er('GE-ARE8', 2 * q, 'Duplicar la suma de áreas no sirve: se suman las raíces y se eleva al cuadrado.'), er('GE-ARE8', 3 * q, 'Triplicar la suma de áreas no sirve: se suman las raíces y se eleva al cuadrado.')],
        solucion: [[`√S = ${a} + ${b} + ${c} = ${a + b + c}.`], ['S = ', v('x', cm2(S)), '.']], _datos: { tipo: 'raices', idea: 'area-y-escala', nivel: 3, a, b, c } };
    }
  }

  // =============================== Idea 6: Ceva y Menelao ===============================
  function ceva(rng) {
    for (;;) {
      const a = rng.entero(1, 6), b = rng.entero(1, 6), c = rng.entero(1, 6), d = rng.entero(1, 6), e = rng.entero(1, 8), x = e * b * d / (a * c);
      // El triángulo de lados AB, BC y CA existe (auditoría, 20 nov: salían 4, 11 y 23 cm).
      if (!Number.isInteger(2 * x) || x === e || (a === b && c === d) || !existe(a + b, c + d, e + x)) continue;
      return { enunciado: [`Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y EA = ${e} cm.`], pregunta: ['¿Cuánto mide CE?'],
        datos: [D.ceva], correcta: x, fmt: cm,
        errores: [er('GE-CEV3', e * a * c / (b * d), 'Usar Ceva está bien; pero dando la vuelta se escribe CE/EA, no EA/CE.'), er('GE-CEV4', a + c, 'Ceva multiplica razones; no se suman tramos.'),
          er('GE-CEV5', e, 'CE = EA solo si las otras dos razones se compensan; aquí no.'), er('GE-CEV6', e * b / a, 'Faltó la razón de BC: el producto lleva las tres.')],
        solucion: [[`(${a}/${b}) · (${c}/${d}) · (CE/${e}) = 1.`], ['CE = ', v('x', cm(x)), '.']], _datos: { tipo: 'ceva', idea: 'ceva-menelao', nivel: 1, a, b, c, d, e } };
    }
  }
  function cevaRazon(rng) {
    for (;;) {
      const p = [rng.entero(1, 4), rng.entero(1, 4)], q = [rng.entero(1, 4), rng.entero(1, 4)];
      if (p[0] === p[1] || q[0] === q[1] || mcd(p[0], p[1]) !== 1 || mcd(q[0], q[1]) !== 1) continue;
      const ok = razon(p[1] * q[1], p[0] * q[0]);
      const vistos = new Set([ok]), errores = [];
      for (const [t, id, e] of [[razon(p[0] * q[0], p[1] * q[1]), 'GE-CEV3', 'Usar Ceva está bien; pero al despejar, AF/FB queda al revés del producto de las otras dos.'],
        ['1 : 1', 'GE-CEV5', 'F en el medio sería si las otras dos razones se compensaran.'],
        [razon(p[0] + q[0], p[1] + q[1]), 'GE-CEV4', 'Sumar no sirve: Ceva multiplica las razones.'],
        [razon(p[1] + q[1], p[0] + q[0]), 'GE-CEV4', 'Sumar no sirve: Ceva multiplica las razones.']]) {
        if (vistos.has(t)) continue;
        vistos.add(t); errores.push({ id, clave: `o${errores.length}`, texto: `AF : FB = ${t}`, explicacion: e, respaldo: 'hipotesis' });
      }
      if (errores.length < 3) continue;
      return { texto: true, enunciado: [`En el triángulo ABC, las cevianas AD, BE y CF pasan por un punto, con BD : DC = ${p[0]} : ${p[1]} y CE : EA = ${q[0]} : ${q[1]}.`], pregunta: ['¿En qué razón parte F al lado AB?'],
        datos: [D.ceva], correcta: { clave: ok, texto: `AF : FB = ${ok}` }, errores,
        solucion: [[`AF/FB · ${fr(p[0], p[1])} · ${fr(q[0], q[1])} = 1.`], ['AF : FB = ', v('x', ok), '.']], _datos: { tipo: 'ceva-razon', idea: 'ceva-menelao', nivel: 2, p, q } };
    }
  }
  function menelao(rng) {
    for (;;) {
      const a = rng.entero(1, 5), b = rng.entero(1, 6), c = rng.entero(1, 5), d = rng.entero(1, 6), L = rng.entero(2, 12), r = b * d / (a * c);
      if (Math.abs(r - 1) < 1e-9) continue;
      const masA = r > 1, ce = masA ? r * L / (r - 1) : r * L / (1 - r), ea = masA ? ce - L : ce + L;
      if (!Number.isInteger(2 * ea) || ea > 60 || !existe(a + b, c + d, L)) continue;
      return { enunciado: [`Una recta corta AB en F, BC en D y la prolongación de CA, más allá de ${masA ? 'A' : 'C'}, en E. AF = ${a} cm, FB = ${b} cm, BD = ${c} cm, DC = ${d} cm y CA = ${L} cm.`], pregunta: ['¿Cuánto mide EA?'],
        datos: [D.mene, D.largos], correcta: ea, fmt: cm,
        errores: [er('GE-CEV7', ce, `Menelao está bien: CE = ${f(ce)} cm. EA es el otro tramo.`), er('GE-CEV1', L / (1 + r), 'Repartir CA en la razón supone E adentro; está en la prolongación.'),
          er('GE-CEV8', masA ? ce + L : Math.abs(ce - L), masA ? 'CE está bien; pero E está más allá de A: EA es CE menos CA.' : 'CE está bien; pero E está más allá de C: EA es CE más CA.'), er('GE-CEV5', L, `${L} cm es CA; EA es lo que hay de E hasta A.`)],
        solucion: [[`(${a}/${b}) · (${c}/${d}) · (CE/EA) = 1, así que CE/EA = ${fr(b * d, a * c)}, con ${masA ? `CE = EA + ${L}` : `EA = CE + ${L}`}.`], ['EA = ', v('x', cm(ea)), '.']],
        _datos: { tipo: 'menelao', idea: 'ceva-menelao', nivel: 3, a, b, c, d, L, masA } };
    }
  }
  function cevaX(rng) {
    for (;;) {
      const c = rng.entero(1, 6), d = rng.entero(1, 6), e1 = rng.entero(1, 6), e2 = rng.entero(1, 6), b = rng.entero(2, 9), x = b * d * e2 / (c * e1);
      if (!Number.isInteger(x) || x < 1 || x > 30 || (c === d && e1 === e2) || !existe(x + b, c + d, e1 + e2)) continue;
      return { enunciado: [`Las cevianas AD, BE y CF del triángulo ABC pasan por un punto. AF = x, FB = ${b}, BD = ${c}, DC = ${d}, CE = ${e1} y EA = ${e2}, en centímetros.`], pregunta: ['¿Cuánto mide AB?'],
        datos: [D.ceva], correcta: x + b, fmt: cm,
        errores: [er('GE-THA6', x, `Ceva está bien: x = ${x}. Falta AB = x + ${b}.`), er('GE-CEV3', b * c * e1 / (d * e2) + b, 'Usar Ceva está bien; pero una razón quedó al revés: se da la vuelta A, F, B, D, C, E.'),
          er('GE-CEV5', 2 * b, 'AF = FB solo si las otras dos razones se compensan.'), er('GE-CEV4', x + b + c, 'AB son AF y FB; BD está en otro lado.')],
        solucion: [[`(x/${b}) · (${c}/${d}) · (${e1}/${e2}) = 1, así que x = ${x}.`], [`AB = ${x} + ${b} = `, v('x', cm(x + b)), '.']], _datos: { tipo: 'ceva-x', idea: 'ceva-menelao', nivel: 3, b, c, d, e1, e2 } };
    }
  }

  const TIPOS = { tres, total, triangulo, 'thales-x': thalesX, tramo, lado, perimetro, exterior, sombra, base, lll, espejo,
    cruzados, anti, comun, cuadrado, area, lindero, 'per-area': perArea, raices, ceva, 'ceva-razon': cevaRazon, menelao, 'ceva-x': cevaX };
  const IDEAS = {
    thales: ['tres', 'total', 'triangulo', 'thales-x'],
    bisectriz: ['tramo', 'lado', 'perimetro', 'exterior'],
    semejanza: ['sombra', 'base', 'lll', 'espejo'],
    encajados: ['cruzados', 'anti', 'comun', 'cuadrado'],
    'area-y-escala': ['area', 'lindero', 'per-area', 'raices'],
    'ceva-menelao': ['ceva', 'ceva-razon', 'menelao', 'ceva-x'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas.
  const PAPEL = { 'papel-1': 'total', 'papel-2': 'perimetro', 'papel-3': 'sombra', 'papel-4': 'anti', 'papel-5': 'lindero', 'papel-6': 'ceva', 'papel-7': 'exterior', 'papel-8': 'cuadrado' };
  // Prueba del curso (reserva ps-01 y ps-02: catalogo/pruebas/geometria.json).
  const PRUEBA = { 'ps-01': 'total', 'ps-02': 'tramo' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      let alternativas;
      if (pr.texto) alternativas = P.armarTexto({ correcta: pr.correcta, errores: rng.barajar(pr.errores), rng });
      else {
        const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
        alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
      }
      if (alternativas.length < 4) continue;
      const valor = pr.texto ? pr.correcta.clave : pr.correcta;
      return { id: `${ID}#${semilla}`, variables: { x: { nombre: 'lo que se pide', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor, unidad: '' }, _datos: Object.assign({ valor }, pr._datos) };
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js).
  return { id: ID, titulo: 'Proporcionalidad y semejanza', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS };
});
