/*
 * Teoría de «Movimiento parabólico» (fisica.movimiento-parabolico-y-circular), para 5.º de secundaria y
 * preuniversitario. El 19 nov 2026 la unidad «Movimiento parabólico y circular» se partió en dos
 * (docs/etapa5/propuesta-fisica.md §1 y §9, decisión 1; Gerson delegó el criterio y revisa después): esta conserva el id
 * con el movimiento parabólico, y el giro (`arco-y-radian`, `rapidez-constante-acelera` y `dos-aceleraciones`, las mesas
 * `rueda` y `giro` y once palabras) se fue a contenido/teoria/fisica/movimiento-circular.js (fisica.movimiento-circular),
 * con el avance migrado por Avance.migrar (nucleo/avance.js, partición partidoPC).
 *
 * Las cinco ideas de la propuesta (A1–A5), en orden, todas hechas con el método (A1 en la fase 2; A2 a A5 en la fase 3,
 * 19 nov): Lee, Juega con misión, Predice, Mira, La regla, Así se resuelve, Ahora tú, glosario y 15 ejemplos.
 *   A1 `un-reloj-dos-ejes` «Tiro horizontal: dos movimientos» .. la piedra lanzada de lado desde una peña, a orillas del
 *      lago, con la balsa de totora. Misión: caer en la balsa (solo 10 m/s). Predice: la lanzada y la soltada.
 *   A2 `velocidad-en-vuelo` «La velocidad en cada instante» ...... la misma piedra con sus flechas a 1 s y a 2 s. Misión:
 *      bajar a 45° a los 2 s (solo 20 m/s). Predice: la rapidez a los 2 s, saliendo a 15 m/s (25 m/s).
 *   A3 `tiro-oblicuo` «Lanzar con ángulo» ...................... la pelota que patea el arquero en la cancha. Misión: 4 s
 *      de vuelo (solo 25 m/s con 53°). Predice: la rapidez en lo más alto (15 m/s).
 *   A4 `altura-y-alcance` «Altura máxima y alcance» ............ el chorro de la manguera de la plaza y la planta. Misión:
 *      otro ángulo que riegue la planta (60°). Predice: al doble de rapidez, cuatro veces más lejos.
 *   A5 `ecuaciones-en-el-plano` «Ecuaciones del movimiento en el plano» .. el dron sobre las calles, visto desde arriba.
 *      Misión: pasar sobre la antena (3 y 4 m/s o 6 y 8 m/s). Predice: la distancia a la plaza con 6t y 8t (50 m).
 * La unidad lleva calidad: 2 desde el 19 nov, después del lector en frío y el auditor (la prueba propia la
 * simula y pasa).
 *
 * Ficha de tarea (diseno-y-animacion), idea A1:
 *   Promesa: la piedra lanzada de lado avanza parejo y cae como si la soltaran; con la altura se sabe cuánto tarda.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla el tiempo de caída con la altura y, con él, el alcance o la rapidez de salida.
 *   Orden de atención: 1.º la piedra y su camino · 2.º las marcas de las dos reglas · acción: el botón fijo.
 *   Estados: juego sin tocar · misión cumplida · predicción pendiente · coincide / no coincide · caso nuevo · «No sé».
 *   Duda que resuelve: ¿lanzarla más rápido la hace tardar más (o menos) en caer? (No: el tiempo lo pone la altura.)
 * Objeto de la primera pantalla: la peña a orillas del lago, la piedra con la flecha de su rapidez de salida y la balsa
 * de totora (pieza fis-tiro, dibujo de prueba, 19 nov).
 *
 * Letras de A1 (propuesta §5): v₀ la rapidez con que sale, de lado; t el tiempo desde que sale; x cuánto avanzó de lado,
 * desde el pie de donde salió; h cuánto ha caído, medido hacia abajo desde donde salió (la misma h de «Caída libre desde
 * el reposo», en MRUV); g la gravedad, 10 m/s² en los problemas. El alcance va en palabras: es la x donde cae. La altura
 * de la peña o de la azotea va en palabras o como la h de llegada.
 * REGLA DE COLORES (los de MRU y MRUV; docs/molde-unidad.md §5b; tabla COLORES, def.colores): un color fijo por magnitud,
 *   el mismo en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú», y la respuesta en el color de su
 *   magnitud:
 *   - naranja (c-o): la velocidad y la rapidez (v₀, también en km/h) y la flecha de salida;
 *   - turquesa (c-i): el tiempo (t, los rótulos «1 s, 2 s» de la pared);
 *   - violeta (c-f): la posición y la altura (x, h, el alcance, las marcas de las dos reglas, las cotas);
 *   - carmín (c-h): la aceleración (g);
 *   - tinta: la piedra, la peña, el agua, la balsa, las reglas y lo que se pide en una figura («?»).
 *   Sin verde: iría junto al naranja de v (protanopía: 0,010). El ángulo de lanzamiento (A3, A4) irá en tinta.
 * Errores de A1 (docs/investigacion/cinematica-ideas-erroneas.md; los TP- son hipótesis de diseño):
 *   P1 lo soltado cae antes que lo lanzado · P2 la rapidez de lado cambia el tiempo de caída · C2 el más pesado cae antes ·
 *   P4 lo soltado desde algo que se mueve cae recto · P5 sigue recto y después cae · TP-SIN-MEDIO olvida el ½ de ½·g·t² ·
 *   TP-RAIZ da t² como si fuera t · TP-VT usa la rapidez de lado para bajar · C-LINEAL cae con velocidad fija ·
 *   TP-ALTURA da la altura como alcance · K-TIEMPO avanza un solo segundo · TP-POR multiplica en vez de dividir ·
 *   TP-VY da la rapidez que gana cayendo · TP-CAIDA da lo que cayó cuando piden la altura · TP-PISO no compara tiempos ·
 *   TP-RESTA resta una distancia de lado a una altura · U1-kmh usa km/h como m/s · PR1 proporción directa.
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 3),
 * docs/etapa5/propuesta-fisica.md y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Las mesas del laboratorio (`dos-sombras-3d` y `tiro-libre`) pasaron a los colores de la unidad en la fase 3.
 * Desde A2, la velocidad entera es un vector (v⃗) y sus componentes, números con signo (vₓ y vᵧ con { sub }): en A2 la
 * vertical se mide hacia abajo, como h; desde A3, el eje y apunta hacia arriba (lo dice la condición de cada regla).
 * Errores de A2 a A5: docs/investigacion/cinematica-ideas-erroneas.md, «Movimiento parabólico (19 nov)».
 * Práctica: plantillas/fis-parabolico (tipos por idea); la escena tiro-parabolico queda en «Más mesas del tema».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «La pelota y sus dos sombras» con el motor de plantillas/tiro-parabolico (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const G = 10; // convención del examen, declarada en la condición de cada regla y en los datos
  const rad = d => d * Math.PI / 180;
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un valor se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Un color fijo por magnitud (cabecera y COLORES): cada ficha dice su magnitud en m; lo comprueba el .test.js.
  const Mv = { v: 'c-o', t: 'v', m: 'velocidad' }, Mt = { v: 'c-i', t: 't', m: 'tiempo' }, Mg = { v: 'c-h', t: 'g', m: 'aceleración' };
  const Mx = { v: 'c-f', t: 'x', m: 'posición' }, Mh = { v: 'c-f', t: 'h', m: 'altura' };
  const Mv0 = { sub: [Mv, '0'] }, Mt2 = { sup: [Mt, '2'] };
  const pv = s => ({ v: 'c-o', t: String(s), m: 'velocidad' }), pt = s => ({ v: 'c-i', t: String(s), m: 'tiempo' });
  const px = s => ({ v: 'c-f', t: String(s), m: 'posición' }), ph = s => ({ v: 'c-f', t: String(s), m: 'altura' });
  const pa = s => ({ v: 'c-h', t: String(s), m: 'aceleración' });
  const neg = l => ({ negrita: [l] });
  const cuadrado = q => ({ sup: [q, '2'] });


  // ---------- Idea 1 (A1): tiro horizontal, dos movimientos (19 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-tiro: la piedra que sale de lado desde una peña de 45 m, a orillas del lago. Cambia: con qué rapidez sale ·
  // Permanece: la peña de 45 m, la balsa a 30 m y las dos reglas · Progresa: el reloj, que deja una piedra tenue y una
  // marca violeta en cada regla cada medio segundo · Se reserva: la piedra que se suelta a la vez (solo en Predice y
  // Mira) · Debe verse: las marcas del agua, igual de separadas; las de la peña, cada vez más.
  const fm = n => f(n, 2);
  // Las cuentas que se escriben se hacen con los números que se ven (igualdad-falsa, Etapa 6, 19 nov: «5 · 1,73 = 8,66 m»
  // era falsa, porque 5 · 1,73 da 8,65). Un factor que no es exacto con dos decimales va con tres (√3 ≈ 1,732), y un dato
  // del enunciado que se muestra redondeado entra a la cuenta tal como se ve (visto).
  const fmFactor = n => (Math.abs(n * 100 - Math.round(n * 100)) < 1e-6 ? fm(n) : f(n, 3));
  const visto = n => Number(fm(n).replace(/\s/g, '').replace(',', '.').replace('−', '-'));
  const tCae = h => Math.sqrt(2 * h / G);                 // s: lo que tarda en caer h metros desde el reposo
  const tiroH = (d, estado = {}) => ({ pieza: 'fis-tiro', datos: d, estado });
  // La peña del juego, de Predice y de «Mira»: 45 m (3 s de caída con g = 10 m/s²) y hasta 47 m de lado; la figura, grande.
  const PENA = { plataforma: 'pena', alto: 45, ancho: 47, altoMax: 200 };
  const REGLA_X = { paso: 5, numero: 10 }, REGLA_H = { paso: 5, numero: 5, tiempos: true };
  const T_A1 = tCae(PENA.alto), BALSA = 30;
  const juegoA1 = val => tiroH(Object.assign({}, PENA, { v0: val.v0, t: Math.min(val.t, T_A1), cada: 0.5, sombras: true, camino: 'recorrido',
    flecha: { texto: `${fm(val.v0)} m/s` }, regla: REGLA_X, alturas: REGLA_H, blanco: { en: BALSA, tipo: 'balsa' } }));
  // Gesto directo (docs/teoria.md §4b): la punta de la flecha de salida se arrastra de lado. La pieza la dibuja con 3 px
  // por cada m/s (geometria().salida); mover da la rapidez de la punta y la app la ajusta al paso del control.
  const salidaDe = d => Kit.piezas['fis-tiro'].geometria(d).salida;
  const puntaSalida = d => { const q = salidaDe(d); return { x: q.x, y: q.y }; };
  const rapidezDePunta = (d, x) => { const q = salidaDe(d); return (x - q.x0) / q.kv; };
  // Predice y Mira: a la vez que sale la piedra lanzada (10 m/s), otra se suelta desde la misma peña. El juego no la mostró.
  const PRED_A1 = Object.assign({}, PENA, { ancho: 36, v0: 10, t: 0, flecha: { texto: '10 m/s' }, otra: { texto: 'se suelta' }, alturas: { paso: 5, numero: 5 } });
  const MIRA_A1 = Object.assign({}, PENA, { ancho: 36, v0: 10, cada: 0.5, sombras: true, camino: 'recorrido', flecha: { texto: '10 m/s' }, otra: {}, alturas: REGLA_H,
    cortes: [{ t: 0, otra: { texto: 'se suelta' } }, { t: 1, niveles: true }, { t: 2, niveles: true }, { t: 3, niveles: true }, { t: 3, niveles: true },
      { t: 3, niveles: true, regla: REGLA_X }, { t: 3, niveles: true, regla: REGLA_X }] });

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho. Las dos fórmulas generales (el
  // alumno elige cuál usa y qué despeja), g y las equivalencias; ningún atajo ni consejo.
  const DA = {
    lado: ['De lado avanza parejo: ', Mx, ' = ', Mv0, ' · ', Mt],
    cae: ['Hacia abajo cae desde el reposo: ', Mh, ' = ½ · ', Mg, ' · ', Mt2],
    g: [Mg, ' = ', pa('10 m/s²'), ' (convención del examen); sin resistencia del aire.'],
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    cm: '1 m = 100 cm',
  };

  // Ejemplos resueltos de A1 (pestaña «Ejemplos»). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e5-fisica/cuentas-a1.js, 19 nov: integra el movimiento paso a paso, sin las fórmulas): 12·2; ½·10·3²;
  // 20 = 5t²; 0,6/0,4; 1·0,4 y 3·0,4; 45 = 5t² y 14·3; 12/6 y 5·2²; 0,8 = 5t² y 2·0,4; 1,25 = 5t² y 2/0,5; 18/3,6,
  // 20 = 5t² y 5·2; 1,25 = 5t², 2·0,5 y 4·0,5; 144/3,6, 125 = 5t² y 40·5; 40/20, 5·2² y 45 − 20; t ∝ √h y 2·12;
  // 80 = 5t², 10·4, 25·4 y 100 − 40; y el valor de cada alternativa equivocada con el error que dice el resuelto.
  // Las figuras muestran lo que cada dato marca por sí solo (la altura dada, la rapidez de salida, un alcance dado),
  // nunca lo que sale de juntarlos (molde §3, 18 nov): lo que se pide va con «?» en tinta.
  const fig = d => tiroH(Object.assign({ t: 0 }, d));
  const EJEMPLOS_TIRO_H = [
    { nivel: 1, titulo: 'Lo que avanza de lado',
      figura: fig({ plataforma: 'pena', alto: 20, ancho: 30, v0: 12, flecha: { texto: '12 m/s' }, cotaAlcance: { texto: '?', hasta: 24 } }),
      enunciado: ['Una piedra sale de lado a ', pv('12 m/s'), ' desde una peña y tarda ', pt('2 s'), ' en llegar al agua. ¿A qué distancia del pie de la peña cae?'],
      datos: [DA.lado],
      solucion: [{ texto: 'De lado avanza lo mismo en cada segundo: 12 m.', ecuacion: [Mx, ' = ', pv('12'), ' · ', pt('2'), ' = ', px('24 m')] }],
      respuesta: ['Cae a ', px('24 m'), ' del pie de la peña'] },
    { nivel: 1, titulo: 'Lo que ha caído',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 80, ancho: 60, v0: 8, flecha: { texto: '8 m/s' } }),
      enunciado: ['Una pelota sale de lado, a ', pv('8 m/s'), ', desde la azotea de un edificio alto. ¿Cuánto ha caído ', pt('3 s'), ' después, si sigue en el aire?'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Hacia abajo sale sin velocidad, como si la soltaran.', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('3')), ' = ', ph('45 m')] },
        { texto: 'Los 8 m/s son de lado: no entran en esta cuenta.' },
      ],
      respuesta: ['Ha caído ', ph('45 m')] },
    { nivel: 1, titulo: '¿Cuánto tarda en caer?',
      figura: fig({ plataforma: 'pena', alto: 20, ancho: 30, v0: 10, flecha: {}, cotaAlto: { texto: '20 m' } }),
      enunciado: ['Una piedra sale de lado desde una peña de ', ph('20 m'), ' de altura. ¿Cuánto tarda en llegar al agua?'],
      datos: [DA.cae, DA.g],
      solucion: [{ texto: 'Al llegar al agua ha caído los 20 m. Se despeja el tiempo.', ecuacion: [ph('20'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 4   →   ', Mt, ' = ', pt('2 s')] }],
      respuesta: ['Tarda ', pt('2 s')] },
    { nivel: 1, titulo: '¿Con qué rapidez salió?',
      figura: fig({ plataforma: 'mesa', objeto: 'canica', alto: 0.8, ancho: 1, v0: 1.5, flecha: { texto: '?' }, cotaAlcance: { texto: '0,6 m', hasta: 0.6 } }),
      enunciado: ['Una canica rueda por una mesa, sale de lado por el borde y tarda ', pt('0,4 s'), ' en llegar al piso, a ', px('0,6 m'), ' del pie de la mesa. ¿Con qué rapidez salió?'],
      datos: [DA.lado],
      solucion: [{ texto: ['De lado avanzó parejo esos 0,6 m. Se despeja ', Mv0, '.'], ecuacion: [Mv0, ' = ', { frac: [Mx, Mt] }, ' = ', { frac: [px('0,6'), pt('0,4')] }, ' = ', pv('1,5 m/s')] }],
      respuesta: ['Salió a ', pv('1,5 m/s')] },
    { nivel: 1, titulo: 'Dos canicas, una mesa',
      figura: fig({ plataforma: 'mesa', objeto: 'canica', alto: 0.8, ancho: 1.5, v0: 3, flecha: { texto: '1 m/s o 3 m/s' } }),
      enunciado: ['Dos canicas salen de lado de la misma mesa: una a ', pv('1 m/s'), ' y otra a ', pv('3 m/s'), '. Las dos tardan ', pt('0,4 s'), ' en caer. ¿A qué distancia del pie de la mesa cae cada una?'],
      datos: [DA.lado],
      solucion: [{ texto: 'Cada una avanza de lado con su rapidez, durante el mismo tiempo.', ecuacion: [pv('1'), ' · ', pt('0,4'), ' = ', px('0,4 m'), ';   ', pv('3'), ' · ', pt('0,4'), ' = ', px('1,2 m')] }],
      respuesta: [px('0,4 m'), ' y ', px('1,2 m'), ': triple de rapidez, triple de lejos'] },
    { nivel: 2, titulo: 'De la peña al lago',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 50, v0: 14, flecha: { texto: '14 m/s' }, cotaAlto: { texto: '45 m' }, cotaAlcance: { texto: '?', hasta: 42 } }),
      enunciado: ['Desde una peña de ', ph('45 m'), ' de altura se lanza una piedra de lado a ', pv('14 m/s'), '. ¿A qué distancia del pie de la peña cae al lago?'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Primero, el tiempo de vuelo: cae 45 m desde el reposo.', ecuacion: [ph('45'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 9   →   ', Mt, ' = ', pt('3 s')] },
        { texto: 'En ese tiempo avanza de lado, parejo:', ecuacion: [Mx, ' = ', pv('14'), ' · ', pt('3'), ' = ', px('42 m')] },
      ],
      respuesta: ['Cae a ', px('42 m'), ' del pie de la peña'] },
    { nivel: 2, titulo: '¿Desde qué altura?',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 20, ancho: 16, v0: 6, flecha: { texto: '6 m/s' }, cotaAlto: { texto: '?' }, cotaAlcance: { texto: '12 m', hasta: 12 } }),
      enunciado: ['Una pelota sale de lado a ', pv('6 m/s'), ' desde una azotea y cae a ', px('12 m'), ' del pie del edificio. ¿Qué altura tiene la azotea?'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Primero el tiempo, con lo que avanzó de lado:', ecuacion: [Mt, ' = ', { frac: [px('12'), pv('6')] }, ' = ', pt('2 s')] },
        { texto: 'En ese tiempo cayó toda la altura de la azotea:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('2')), ' = ', ph('20 m')] },
      ],
      respuesta: ['La azotea está a ', ph('20 m'), ' del piso'] },
    { nivel: 2, titulo: 'La canica de la mesa',
      figura: fig({ plataforma: 'mesa', objeto: 'canica', alto: 0.8, ancho: 1.2, v0: 2, flecha: { texto: '2 m/s' }, cotaAlto: { texto: '80 cm' }, cotaAlcance: { texto: '?', hasta: 0.8 } }),
      enunciado: ['Una canica sale de lado, a ', pv('2 m/s'), ', del borde de una mesa de ', ph('80 cm'), ' de alto. ¿A cuántos centímetros del pie de la mesa cae?'],
      datos: [DA.lado, DA.cae, DA.g, DA.cm],
      solucion: [
        { texto: 'La altura, en metros, para que cuadre con g:', ecuacion: [ph('80 cm'), ' = ', ph('0,8 m')] },
        { texto: 'El tiempo de vuelo sale de la altura:', ecuacion: [ph('0,8'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 0,16   →   ', Mt, ' = ', pt('0,4 s')] },
        { texto: 'De lado, en ese tiempo, y de vuelta a centímetros:', ecuacion: [Mx, ' = ', pv('2'), ' · ', pt('0,4'), ' = ', px('0,8 m'), ' = ', px('80 cm')] },
      ],
      respuesta: ['Cae a ', px('80 cm'), ' del pie de la mesa'] },
    { nivel: 2, titulo: 'El chorro del caño',
      figura: fig({ plataforma: 'muro', objeto: 'agua', alto: 1.25, ancho: 2.4, v0: 4, flecha: { texto: '?' }, cotaAlto: { texto: '1,25 m' }, cotaAlcance: { texto: '2 m', hasta: 2 } }),
      enunciado: ['De un caño horizontal, a ', ph('1,25 m'), ' del piso, sale un chorro de agua que cae a ', px('2 m'), ' del muro. ¿Con qué rapidez sale el agua?'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Cada gota es un tiro horizontal. Su tiempo de vuelo sale de la altura:', ecuacion: [ph('1,25'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 0,25   →   ', Mt, ' = ', pt('0,5 s')] },
        { texto: 'En ese tiempo avanzó 2 m de lado:', ecuacion: [Mv0, ' = ', { frac: [px('2'), pt('0,5')] }, ' = ', pv('4 m/s')] },
      ],
      respuesta: ['El agua sale a ', pv('4 m/s')] },
    { nivel: 2, titulo: 'Sale rodando, en km/h',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 20, ancho: 14, v0: 5, flecha: { texto: '18 km/h' }, cotaAlto: { texto: '20 m' }, cotaAlcance: { texto: '?', hasta: 10 } }),
      enunciado: ['Una pelota rueda por una azotea de ', ph('20 m'), ' de altura y sale de lado por el borde a ', pv('18 km/h'), '. ¿A qué distancia del pie del edificio cae?'],
      datos: [DA.lado, DA.cae, DA.g, DA.kmh],
      solucion: [
        { texto: 'La rapidez, a m/s:', ecuacion: [pv('18 km/h'), ' = ', { frac: ['18 000 m', '3600 s'] }, ' = ', pv('5 m/s')] },
        { texto: 'El tiempo de vuelo sale de la altura:', ecuacion: [ph('20'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('2 s')] },
        { texto: 'De lado, en ese tiempo:', ecuacion: [Mx, ' = ', pv('5'), ' · ', pt('2'), ' = ', px('10 m')] },
      ],
      respuesta: ['Cae a ', px('10 m'), ' del pie del edificio'] },
    { nivel: 3, titulo: 'Dos esferas, dos rapideces',
      figura: fig({ plataforma: 'mesa', objeto: 'canica', alto: 1.25, ancho: 2.4, v0: 4, flecha: { texto: '2 m/s o 4 m/s' }, cotaAlto: { texto: '1,25 m' } }),
      enunciado: ['Del borde de una repisa de ', ph('1,25 m'), ' salen de lado dos esferas: una lenta, a ', pv('2 m/s'), ', y una rápida, a ', pv('4 m/s'), '. ¿Cuánto tarda cada una en llegar al piso y a qué distancia cae?'],
      alternativas: ['La lenta: 0,5 s y 1 m. La rápida: 0,25 s y 1 m', 'La lenta: 0,5 s y 1 m. La rápida: 1 s y 4 m', 'Las dos: 0,25 s. Caen a 0,5 m y a 1 m',
        'Las dos: 0,5 s. Caen a 1 m y a 2 m', 'Las dos: 0,5 s. Las dos caen a 1,25 m'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'El tiempo sale solo de la altura: es el mismo para las dos.', ecuacion: [ph('1,25'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 0,25   →   ', Mt, ' = ', pt('0,5 s')] },
        { texto: 'De lado, cada una con su rapidez:', ecuacion: [pv('2'), ' · ', pt('0,5'), ' = ', px('1 m'), ';   ', pv('4'), ' · ', pt('0,5'), ' = ', px('2 m')] },
        { texto: ['La ', neg('A'), ' y la ', neg('B'), ' creen que la rapidez de lado cambia el tiempo; la ', neg('C'), ' toma t² = 0,25 como si fuera t.'] },
      ],
      respuesta: [neg('D'), ', ', pt('0,5 s'), ' las dos; caen a ', px('1 m'), ' y a ', px('2 m')] },
    { nivel: 3, titulo: 'Soltar el paquete a tiempo',
      figura: fig({ plataforma: 'avioneta', objeto: 'paquete', alto: 125, ancho: 235, v0: 40, flecha: { texto: '144 km/h' }, cotaAlto: { texto: '125 m' }, blanco: { en: 200, tipo: 'marca' }, cotaAlcance: { texto: '?', hasta: 200 } }),
      enunciado: ['Una avioneta vuela de lado a ', pv('144 km/h'), ', a ', ph('125 m'), ' del suelo, y debe dejar víveres sobre una marca. ¿A qué distancia de lado, antes de la marca, debe soltar el paquete?'],
      alternativas: ['720 m', '125 m', '200 m', '0 m: justo encima de la marca', '1000 m'],
      datos: [DA.lado, DA.cae, DA.g, DA.kmh],
      solucion: [
        { texto: 'El paquete sale de lado con la rapidez de la avioneta:', ecuacion: [pv('144 km/h'), ' = ', { frac: ['144 000 m', '3600 s'] }, ' = ', pv('40 m/s')] },
        { texto: 'Cae 125 m y, mientras cae, sigue avanzando:', ecuacion: [ph('125'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('5 s'), ';   ', Mx, ' = ', pv('40'), ' · ', pt('5'), ' = ', px('200 m')] },
        { texto: ['La ', neg('D'), ' cree que cae recto; la ', neg('A'), ' deja los km/h; la ', neg('E'), ' toma t² = 25 como el tiempo.'] },
      ],
      respuesta: [neg('C'), ', ', px('200 m'), ' antes de la marca'] },
    { nivel: 3, titulo: 'La pared de enfrente',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 48, v0: 20, flecha: { texto: '20 m/s' }, cotaAlto: { texto: '45 m' }, cotaAlcance: { texto: '40 m', hasta: 40 }, pared: { en: 40, alto: 45 } }),
      enunciado: ['Desde una azotea de ', ph('45 m'), ' se lanza una pelota de lado, a ', pv('20 m/s'), ', hacia un edificio que está a ', px('40 m'), '. ¿A qué altura del piso golpea la pared?'],
      alternativas: ['20 m', '25 m', '5 m', '45 m', '0 m: llega antes al piso'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Llega a la pared cuando avanzó 40 m de lado:', ecuacion: [Mt, ' = ', { frac: [px('40'), pv('20')] }, ' = ', pt('2 s')] },
        { texto: 'En 2 s cae 20 m. Lo que falta para el piso es la altura del golpe:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('2')), ' = ', ph('20 m'), ';   ', ph('45'), ' − ', ph('20'), ' = ', ph('25 m')] },
        { texto: ['La ', neg('A'), ' da lo que cayó; la ', neg('C'), ' resta los 40 m de lado; la ', neg('D'), ' cree que sigue recto; la ', neg('E'), ' olvida que al piso tardaría 3 s.'] },
      ],
      respuesta: [neg('B'), ', a ', ph('25 m'), ' del piso'] },
    { nivel: 3, titulo: 'Cuatro veces más alto',
      figura: fig({ plataforma: 'pena', alto: 20, ancho: 18, v0: 6, flecha: {}, cotaAlcance: { texto: '12 m', hasta: 12 } }),
      enunciado: ['Una piedra lanzada de lado desde una peña cae al lago a ', px('12 m'), ' del pie. Con la misma rapidez, desde una peña cuatro veces más alta, ¿a qué distancia cae?'],
      alternativas: ['48 m', '12 m', '16 m', '96 m', '24 m'],
      datos: [DA.lado, DA.cae],
      solucion: [
        { texto: ['Con ', Mh, ' cuatro veces mayor, ', Mt2, ' se cuadruplica: el tiempo solo se duplica.'], ecuacion: [Mh, ' = ½ · ', Mg, ' · ', Mt2, '   →   4', Mh, ' = ½ · ', Mg, ' · ', { sup: [{ par: ['2', Mt] }, '2'] }] },
        { texto: 'De lado va igual de rápido, el doble de tiempo:', ecuacion: [Mx, ' = 2 · ', px('12'), ' = ', px('24 m')] },
        { texto: ['La ', neg('A'), ' crece igual que la altura; la ', neg('B'), ' cree que la altura no cuenta; la ', neg('C'), ' suma 4 m; la ', neg('D'), ' multiplica por 4 y por 2.'] },
      ],
      respuesta: [neg('E'), ', ', px('24 m')] },
    { nivel: 3, titulo: 'Dos piedras desde la torre',
      figura: fig({ plataforma: 'azotea', objeto: 'piedra', alto: 80, ancho: 112, v0: 25, flecha: { texto: '10 m/s o 25 m/s' }, cotaAlto: { texto: '80 m' } }),
      enunciado: ['Desde una torre de ', ph('80 m'), ' se lanzan de lado, a la vez y hacia el mismo lado, dos piedras: una a ', pv('10 m/s'), ' y otra a ', pv('25 m/s'), '. ¿Qué distancia separa los puntos donde caen?'],
      alternativas: ['60 m', '140 m', '15 m', '100 m', '240 m'],
      datos: [DA.lado, DA.cae, DA.g],
      solucion: [
        { texto: 'Las dos tardan lo mismo, porque caen la misma altura:', ecuacion: [ph('80'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 16   →   ', Mt, ' = ', pt('4 s')] },
        { texto: 'Cada una cae donde la lleva su rapidez; se restan:', ecuacion: [pv('25'), ' · ', pt('4'), ' − ', pv('10'), ' · ', pt('4'), ' = ', px('100'), ' − ', px('40'), ' = ', px('60 m')] },
        { texto: ['La ', neg('B'), ' suma los dos alcances; la ', neg('E'), ' toma t² = 16 como el tiempo; la ', neg('C'), ' resta las rapideces y olvida el tiempo.'] },
      ],
      respuesta: [neg('A'), ', ', px('60 m')] },
  ];

  // De dónde sale cada caso generado («Así se resuelve» y «Ahora tú»): la peña, una azotea o una mesa (repisa si es alta).
  // Ninguna altura da 1 s de caída: con t = 1, t² vale lo mismo que t y varios errores dan la respuesta correcta.
  const SITIOS = [
    { plataforma: 'pena', objeto: 'piedra', alturas: [20, 45], rapideces: [6, 8, 12, 14, 15],   // sin 10 m/s: desde 45 m es el caso del juego
      llega: 'al agua', pie: 'del pie de la peña',
      sale: (h, vv) => ['Desde una peña de ', ph(`${fm(h)} m`), ' de altura, a orillas del lago, se lanza una piedra de lado a ', pv(`${fm(vv)} m/s`), '.'],
      cae: (h, xx) => ['Desde una peña de ', ph(`${fm(h)} m`), ' de altura se lanza una piedra de lado, y cae al lago a ', px(`${fm(xx)} m`), ' del pie de la peña.'] },
    { plataforma: 'azotea', objeto: 'pelota', alturas: [20, 45, 80], rapideces: [4, 5, 6, 8, 10, 12], llega: 'al piso', pie: 'del pie del edificio',
      sale: (h, vv) => ['Desde una azotea de ', ph(`${fm(h)} m`), ' de altura se lanza una pelota de lado a ', pv(`${fm(vv)} m/s`), '.'],
      cae: (h, xx) => ['Desde una azotea de ', ph(`${fm(h)} m`), ' de altura se lanza una pelota de lado, y cae a ', px(`${fm(xx)} m`), ' del pie del edificio.'] },
    { plataforma: 'mesa', objeto: 'canica', alturas: [0.8, 1.25, 1.8], rapideces: [1, 1.5, 2, 2.5, 3], llega: 'al piso', pie: 'del pie del mueble',
      sale: (h, vv) => ['Una canica rueda por una ', h < 1 ? 'mesa' : 'repisa', ' de ', ph(`${fm(h)} m`), ' de alto y sale de lado por el borde a ', pv(`${fm(vv)} m/s`), '.'],
      cae: (h, xx) => ['Una canica sale de lado del borde de una ', h < 1 ? 'mesa' : 'repisa', ' de ', ph(`${fm(h)} m`), ' de alto, y cae a ', px(`${fm(xx)} m`), ' del pie del mueble.'] },
  ];
  // La figura de un caso: de dónde sale, con la altura acotada y lo demás según lo que se pide.
  const figCaso = (st, h, vv, extra) => tiroH(Object.assign({ plataforma: st.plataforma, objeto: st.objeto, alto: h, ancho: Math.max(vv * tCae(h) * 1.25, h * 0.5), v0: vv, t: 0,
    cotaAlto: { texto: `${fm(h)} m` } }, extra));
  // Azoteas con una pared enfrente: [altura (m), rapidez (m/s), distancia a la pared (m)]. Llega a la pared antes que al
  // piso, tarda un número entero de segundos y la pared queda a media altura o más lejos (la cota de la altura cabe).
  const PAREDES = [[45, 20, 40], [45, 15, 30], [80, 20, 40], [80, 20, 60], [80, 15, 45], [80, 25, 50], [80, 25, 75], [20, 10, 10], [20, 15, 15], [20, 20, 20]];

  const tiroHorizontal = {
    id: 'un-reloj-dos-ejes',
    titulo: 'Tiro horizontal: dos movimientos',
    pregunta: 'Si lanzas una piedra de lado, ¿tarda más en caer que si la sueltas?',
    temas: ['Movimiento en dos dimensiones', 'Tiro parabólico'],
    pieza: 'fis-tiro',
    aprendizaje: 'Lanzada de lado, la piedra avanza parejo y cae como si la soltaran: el tiempo de caída solo depende de la altura.',
    actividad: 'Lanzar una piedra de lado desde una peña, sobre el lago.',
    lee: {
      tarjetas: [
        { titulo: 'Lanzar de lado', texto: ['Desde una peña a orillas del lago lanzas una piedra de lado: ni hacia arriba ni hacia abajo. Es un tiro horizontal. La flecha es su rapidez de salida, ', Mv0, '. Desde que sale, solo la jala la gravedad.'],
          dibujo: tiroH(Object.assign({}, PENA, { v0: 12, t: 0, flecha: { texto: 'v₀' }, camino: 'entero', blanco: { en: 20, tipo: 'balsa' } })) },
        { titulo: 'Dos reglas para una piedra', texto: ['Para seguirla hacen falta dos reglas. La del agua mide ', Mx, ': cuánto avanzó de lado desde el pie de la peña. La de la peña mide ', Mh, ': cuánto ha caído desde que salió.'],
          dibujo: tiroH(Object.assign({}, PENA, { v0: 12, t: 2, camino: 'recorrido', guias: true, regla: REGLA_X, alturas: { paso: 5, numero: 5 } })) },
        { titulo: 'Tres palabras', texto: 'El camino que dibuja la piedra en el aire es su trayectoria. Lo que dura en el aire es su tiempo de vuelo. Y qué tan lejos cae, medido por el agua, es su alcance horizontal.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir con qué rapidez sale la piedra. Cada medio segundo deja una piedra tenue y una marca violeta en cada regla. Compara entre sí las marcas del agua; después, las de la peña.' },
      ],
    },
    ejemplos: EJEMPLOS_TIRO_H,
    juega: {
      pieza: 'fis-tiro',
      consigna: 'Desde una peña de 45 m, a orillas del lago, lanzas una piedra de lado. En el agua flota una balsa de totora.',
      mision: {
        texto: 'Haz que la piedra caiga justo en la balsa, a 30 m de la peña.',
        // Una sola rapidez lo logra: 10 m/s (10 m por segundo durante los 3 s de caída). El reloj no cuenta.
        logrado: val => val.v0 * T_A1 === BALSA,
        bien: '¡En la balsa! De lado avanzó 10 m en cada segundo, sin frenarse.',
      },
      voz: 'Compara las marcas del agua: ¿están igual de separadas?',
      leyenda: [
        { s: [Mv0], t: 'la rapidez con que sale, de lado' },
        { s: [Mx], t: 'cuánto avanzó de lado, en metros' },
        { s: [Mh], t: 'cuánto ha caído desde que salió' },
        { s: [Mt], t: 'segundos desde que sale' },
        { s: 'piedra tenue', t: 'cada medio segundo, al correr el reloj' },
        { s: 'punto violeta', t: 'su marca en cada regla, con el reloj' },
        { s: 'balsa', t: 'la balsa de totora, en el agua' },
      ],
      controles: [
        { id: 'v0', etiqueta: 'Sale a, v₀', color: 'c-o', min: 5, max: 15, paso: 1, inicio: 7, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A1 + 0.6, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA1,
      // La lectura dice cuánto avanza de lado y dónde cae; no dice cuánto tarda en caer (eso queda para Predice y Mira).
      lectura: val => ['Avanza ', pv(`${fm(val.v0)} m`), ' cada segundo: cae al agua a ', px(`${fm(val.v0 * T_A1)} m`)],
      resumen: { v0: 8, t: 2 },
      minimo: 3,
      arrastres: [{ id: 'salida', etiqueta: 'rapidez de salida (punta de la flecha)', color: 'c-o',
        donde: val => puntaSalida(juegoA1(val).datos), mover: (pt0, val) => ({ v0: rapidezDePunta(juegoA1(val).datos, pt0.x) }) }],
    },
    predice: {
      pregunta: 'A la vez que lanzas tu piedra de lado, tu amiga suelta otra desde la misma peña. ¿Cuál llega primero al agua?',
      datos: ['Las dos salen a la vez, desde 45 m de altura.', 'Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: 'Llegan a la vez', correcta: true },
        { id: 'soltada', texto: 'La que se soltó: recorre menos camino', error: 'P1', siFuera: 'Recorre menos camino, cierto. Pero hacia abajo las dos salen sin velocidad y con la misma gravedad.' },
        { id: 'lanzada', texto: 'La lanzada: va más rápido', error: 'P2', siFuera: 'Va más rápido, pero de lado. Esa rapidez no la empuja hacia abajo ni la sostiene.' },
        { id: 'pesada', texto: 'Depende de cuál pese más', error: 'C2', siFuera: 'Con aire, el peso y la forma importan. Sin aire, todo cae con la misma gravedad.' },
      ],
      dibujo: tiroH(PRED_A1),
      revelar: tiroH(MIRA_A1, { corte: 3 }),
      coincide: 'Coincide: en cada instante las dos están a la misma altura. Tocan el agua juntas.',
    },
    mira: {
      datos: MIRA_A1,
      pasos: [
        { estado: { corte: 0 }, texto: 'Salen a la vez: una de lado, a 10 m/s; la otra, soltada.', ecuacion: [Mv0, ' = ', pv('10 m/s')] },
        { estado: { corte: 1 }, texto: 'Al primer segundo, las dos han caído lo mismo: 5 m.', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('1')), ' = ', ph('5 m')] },
        { estado: { corte: 2 }, texto: 'A los 2 s, las dos han caído 20 m.', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('2')), ' = ', ph('20 m')] },
        { estado: { corte: 3 }, texto: 'A los 3 s han caído 45 m: tocan el agua juntas.', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('3')), ' = ', ph('45 m')] },
        { estado: { corte: 4 }, texto: 'Hacia abajo, ninguna salió con ventaja: las dos partieron sin velocidad.' },
        { estado: { corte: 5 }, texto: 'De lado, la lanzada avanzó 10 m en cada segundo.', ecuacion: [Mx, ' = ', Mv0, ' · ', Mt, ' = ', pv('10'), ' · ', pt('3'), ' = ', px('30 m')] },
        { estado: { corte: 6 }, texto: 'Dos movimientos con el mismo reloj: de lado, parejo; hacia abajo, caída libre.' },
      ],
    },
    regla: {
      texto: 'De lado avanza parejo, como un MRU; hacia abajo cae como si la soltaran. El tiempo de caída sale solo de la altura; con él se halla el alcance.',
      ecuacion: [Mx, ' = ', { llave: [Mv0, ' · ', Mt], nota: 'de lado: parejo', color: 'c-o' }, '   ·   ', Mh, ' = ', { llave: ['½ · ', Mg, ' · ', Mt2], nota: 'hacia abajo: caída libre', color: 'c-h' }],
      condicion: 'sale de lado, sin aire, con g = 10 m/s². h se mide hacia abajo. La academia dice semiparabólico.',
    },
    // Así se resuelve: dos preguntas que «Ahora tú» no hace (la altura de la azotea con el alcance, y la canica en cm).
    resuelve: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const tv = r.de([1, 2, 3, 4]), vv = r.de([3, 4, 5, 6, 8, 10, 12]), xx = vv * tv, h = G * tv * tv / 2;
          return {
            enunciado: ['Una pelota sale de lado a ', pv(`${fm(vv)} m/s`), ' desde una azotea y cae a ', px(`${fm(xx)} m`), ' del pie del edificio. ¿Qué altura tiene la azotea?'],
            datos: [DA.lado, DA.cae, DA.g],
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: h, ancho: Math.max(xx * 1.25, h * 0.5), v0: vv, t: 0, flecha: { texto: `${fm(vv)} m/s` },
              cotaAlto: { texto: '?' }, cotaAlcance: { texto: `${fm(xx)} m`, hasta: xx } }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la altura de la azotea: lo que cae la pelota, ', Mh, ', hasta llegar al piso.'] },
              { tipo: 'datos', texto: ['Sale de lado a ', pv(`${fm(vv)} m/s`), ' y avanza ', px(`${fm(xx)} m`), ' antes de tocar el piso.'] },
              { tipo: 'regla', texto: 'Dos movimientos con el mismo reloj: de lado avanza parejo y hacia abajo cae desde el reposo.',
                ecuacion: [Mx, ' = ', Mv0, ' · ', Mt, ';   ', Mh, ' = ½ · ', Mg, ' · ', Mt2] },
              { tipo: 'cuentas', texto: 'Primero el tiempo, con lo que avanzó de lado; después, lo que cae en ese tiempo.',
                ecuacion: [Mt, ' = ', { frac: [px(fm(xx)), pv(fm(vv))] }, ' = ', pt(`${fm(tv)} s`), '   →   ', Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt(fm(tv))), ' = ', ph(`${fm(h)} m`)] },
              { tipo: 'sentido', texto: `Comprobación: en ${fm(tv)} s avanza ${fm(vv)} · ${fm(tv)} = ${fm(xx)} m de lado. Sí cuadra.` },
            ],
            respuesta: ['La azotea está a ', ph(`${fm(h)} m`), ' del piso'],
          };
        }
        const cmAlto = r.de([45, 80, 125, 180]), vv = r.de([1, 1.5, 2, 2.5, 3]), h = cmAlto / 100, tv = tCae(h), xx = vv * tv;
        const mueble = cmAlto < 100 ? 'mesa' : 'repisa';
        return {
          enunciado: ['Una canica sale de lado, a ', pv(`${fm(vv)} m/s`), ', del borde de una ', mueble, ' de ', ph(`${fm(cmAlto)} cm`), ' de alto. ¿A cuántos centímetros del pie del mueble cae?'],
          datos: [DA.lado, DA.cae, DA.g, DA.cm],
          dibujo: tiroH({ plataforma: 'mesa', objeto: 'canica', alto: h, ancho: Math.max(xx * 1.25, h * 0.5), v0: vv, t: 0, flecha: { texto: `${fm(vv)} m/s` },
            cotaAlto: { texto: `${fm(cmAlto)} cm` }, cotaAlcance: { texto: '?', hasta: xx } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el alcance: cuánto avanza de lado, ', Mx, ', hasta tocar el piso, en centímetros.'] },
            { tipo: 'datos', texto: ['Sale de lado a ', pv(`${fm(vv)} m/s`), ' desde ', ph(`${fm(cmAlto)} cm`), ', que son ', ph(`${fm(h)} m`), '.'] },
            { tipo: 'regla', texto: 'Dos movimientos con el mismo reloj: hacia abajo cae desde el reposo y de lado avanza parejo.',
              ecuacion: [Mh, ' = ½ · ', Mg, ' · ', Mt2, ';   ', Mx, ' = ', Mv0, ' · ', Mt] },
            { tipo: 'cuentas', texto: 'Primero el tiempo de vuelo, con la altura; después, lo que avanza en ese tiempo.',
              ecuacion: [ph(fm(h)), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt(`${fm(tv)} s`), '   →   ', Mx, ' = ', pv(fm(vv)), ' · ', pt(fm(tv)), ' = ', px(`${fm(xx)} m`)] },
            { tipo: 'sentido', texto: `Menos de un segundo en el aire y cae cerca del mueble: ${fm(xx)} m son ${fm(xx * 100)} cm.` },
          ],
          respuesta: ['Cae a ', px(`${fm(xx * 100)} cm`), ' del pie del mueble'],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 31), k = sm % 4, datos = [DA.lado, DA.cae, DA.g];
        if (k === 3) {
          // Nivel examen: la pared de enfrente. Llega a la pared antes que al piso (PAREDES lo garantiza).
          const [h, vv, dd] = r.de(PAREDES), tp = dd / vv, cayo = G * tp * tp / 2, alt = h - cayo;
          return {
            pregunta: ['Desde una azotea de ', ph(`${fm(h)} m`), ' se lanza una pelota de lado, a ', pv(`${fm(vv)} m/s`), ', hacia un edificio que está a ', px(`${fm(dd)} m`), '. ¿A qué altura del piso golpea la pared?'],
            datos,
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: h, ancho: dd * 1.2, v0: vv, t: 0, flecha: { texto: `${fm(vv)} m/s` }, cotaAlto: { texto: `${fm(h)} m` },
              cotaAlcance: { texto: `${fm(dd)} m`, hasta: dd }, pared: { en: dd, alto: h } }),
            opciones: opciones(alt, [
              { id: 'caida', valor: cayo, error: 'TP-CAIDA', siFuera: 'Bien: eso es lo que cayó. La altura del golpe es lo que falta hasta el piso.' },
              { id: 'recto', valor: h, error: 'P5', siFuera: 'Avanza de lado, cierto. Pero mientras avanza también cae: no llega a la misma altura.' },
              { id: 'sin-medio', valor: h - 2 * cayo > 0 ? h - 2 * cayo : NaN, error: 'TP-SIN-MEDIO', siFuera: 'Bien el tiempo y la resta. En lo que cae falta el ½ de ½·g·t².' },
              { id: 'resta', valor: h - dd > 0 ? h - dd : NaN, error: 'TP-RESTA', siFuera: 'Bien que restes algo a la altura. Pero se resta lo que cae, no lo que avanza de lado.' },
              { id: 'piso', valor: 0, error: 'TP-PISO', siFuera: 'Al piso llegaría más tarde: la pared está antes. Compara los dos tiempos.' },
            ], n => `${fm(n)} m`),
            solucion: { texto: `Llega a la pared en ${fm(tp)} s; en ese tiempo cae ${fm(cayo)} m.`, ecuacion: [ph(fm(h)), ' − ', ph(fm(cayo)), ' = ', ph(`${fm(alt)} m`)] },
          };
        }
        const st = r.de(SITIOS), h = r.de(st.alturas), vv = r.de(st.rapideces), tv = tCae(h), xx = vv * tv;
        if (k === 0) return {
          pregunta: [...st.sale(h, vv), ` ¿Cuánto tarda en llegar ${st.llega}?`],
          datos,
          dibujo: figCaso(st, h, vv, { flecha: { texto: `${fm(vv)} m/s` } }),
          opciones: opciones(tv, [
            { id: 'sin-medio', valor: Math.sqrt(h / G), error: 'TP-SIN-MEDIO', siFuera: 'Bien que uses solo la altura. Falta el ½: lo que cae es ½·g·t².' },
            { id: 'con-v0', valor: h / vv, error: 'TP-VT', siFuera: 'Bien que dividas una distancia entre una rapidez. Pero esa rapidez es de lado: no la hace bajar.' },
            { id: 'sin-raiz', valor: 2 * h / G, error: 'TP-RAIZ', siFuera: 'Bien el despeje: eso vale t². Falta sacar la raíz cuadrada.' },
            { id: 'lineal', valor: h / G, error: 'C-LINEAL', siFuera: 'Eso sería bajando con velocidad fija. Al caer, cada segundo baja más que el anterior.' },
          ], n => `${fm(n)} s`),
          solucion: { texto: 'El tiempo sale solo de la altura; la rapidez de lado no cuenta.', ecuacion: [ph(fm(h)), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt(`${fm(tv)} s`)] },
        };
        if (k === 1) return {
          pregunta: [...st.sale(h, vv), ` ¿A qué distancia ${st.pie} cae?`],
          datos,
          dibujo: figCaso(st, h, vv, { flecha: { texto: `${fm(vv)} m/s` }, cotaAlcance: { texto: '?', hasta: xx } }),
          opciones: opciones(xx, [
            { id: 'sin-raiz', valor: vv * 2 * h / G, error: 'TP-RAIZ', siFuera: 'Bien que multipliques rapidez por tiempo. Pero 2h/g es t²: falta la raíz.' },
            { id: 'sin-medio', valor: vv * Math.sqrt(h / G), error: 'TP-SIN-MEDIO', siFuera: 'Bien los dos pasos. En el tiempo falta el ½ de ½·g·t².' },
            { id: 'altura', valor: h, error: 'TP-ALTURA', siFuera: 'Esa es la altura. Lo que avanza de lado sale de la rapidez y del tiempo.' },
            { id: 'un-segundo', valor: vv, error: 'K-TIEMPO', siFuera: 'Eso avanza en un solo segundo. Hay que multiplicar por todo el tiempo de vuelo.' },
          ], n => `${fm(n)} m`),
          solucion: { texto: `Cae ${fm(h)} m en ${fm(tv)} s; en ese tiempo avanza de lado.`, ecuacion: [Mx, ' = ', pv(fm(vv)), ' · ', pt(fm(tv)), ' = ', px(`${fm(xx)} m`)] },
        };
        return {
          pregunta: [...st.cae(h, xx), ' ¿Con qué rapidez salió?'],
          datos,
          dibujo: figCaso(st, h, vv, { flecha: { texto: '?' }, cotaAlcance: { texto: `${fm(xx)} m`, hasta: xx } }),
          opciones: opciones(vv, [
            { id: 'por-t', valor: xx * tv, error: 'TP-POR', siFuera: 'Bien que uses el tiempo de vuelo. Pero la rapidez es distancia entre tiempo, no por tiempo.' },
            { id: 'sin-raiz', valor: xx / (2 * h / G), error: 'TP-RAIZ', siFuera: 'Bien que dividas entre el tiempo. Pero 2h/g es t²: falta la raíz.' },
            { id: 'caida', valor: G * tv, error: 'TP-VY', siFuera: 'Esa es la rapidez que gana cayendo. De lado salió con otra: distancia entre tiempo.' },
            { id: 'sin-medio', valor: xx / Math.sqrt(h / G), error: 'TP-SIN-MEDIO', siFuera: 'Bien los dos pasos. En el tiempo falta el ½ de ½·g·t².' },
          ], n => `${fm(n)} m/s`),
          solucion: { texto: `Cae ${fm(h)} m en ${fm(tv)} s; en ese tiempo avanzó ${fm(xx)} m de lado.`, ecuacion: [Mv0, ' = ', { frac: [px(fm(xx)), pt(fm(tv))] }, ' = ', pv(`${fm(vv)} m/s`)] },
        };
      },
    },
  };

  // ====================== Fichas y datos comunes de las ideas A2 a A5 (fase 3, 19 nov) ======================
  // Las componentes de la velocidad llevan su subíndice de verdad y el naranja de la velocidad; la velocidad entera, en
  // el plano, es un vector y lleva flecha (vVec). El ángulo de lanzamiento, θ, va en tinta (propuesta §6, decisión 3).
  const Mvx = { sub: [Mv, 'x'] }, Mvy = { sub: [Mv, 'y'] }, Mv0x = { sub: [Mv, '0x'] }, Mv0y = { sub: [Mv, '0y'] };
  const My = { v: 'c-f', t: 'y', m: 'altura' }, MH = { v: 'c-f', t: 'H', m: 'altura' }, MR = { v: 'c-f', t: 'R', m: 'posición' }, Md = { v: 'c-f', t: 'd', m: 'posición' };
  const Mts = { sub: [Mt, 's'] };
  const vVec = { vec: [Mv] };
  const raiz = q => ({ raiz: q });
  // Seno y coseno de los ángulos de examen: 37° y 53° son los del triángulo 3-4-5 (convención del examen).
  const SEN = { 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2 };
  const COS = { 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6, 60: 0.5 };
  const TAN = { 37: 0.75, 45: 1, 53: 4 / 3 };
  const DB = {
    vx: ['De lado, la velocidad no cambia: ', Mvx, ' = ', Mv0],
    vy: ['Hacia abajo, desde el reposo: ', Mvy, ' = ', Mg, ' · ', Mt],
    vxy: ['De lado no cambia, ', Mvx, ' = ', Mv0, '; hacia abajo, desde el reposo, ', Mvy, ' = ', Mg, ' · ', Mt],
    rap: ['Rapidez: ', Mv, ' = ', raiz([cuadrado(Mvx), ' + ', cuadrado(Mvy)])],
    ang: ['Ángulo de la velocidad con la horizontal, θ: tan θ = ', { frac: [Mvy, Mvx] }],
    tan: 'tan 37° = 3/4, tan 45° = 1 y tan 53° = 4/3 (convención del examen)',
    comp: ['Componentes de la salida: ', Mv0x, ' = ', Mv0, ' · cos\u00a0θ y ', Mv0y, ' = ', Mv0, ' · sen\u00a0θ'],   // «sen» y «θ», en un renglón
    trig: 'sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5 (convención del examen)',
    trig30: 'sen 30° = cos 60° = 1/2 y cos 30° = sen 60° = √3/2',
    trig45: 'sen 45° = cos 45° = √2/2',
    x: ['De lado avanza parejo: ', Mx, ' = ', Mv0x, ' · ', Mt],
    y: ['Altura, con el eje hacia arriba: ', My, ' = ', Mv0y, ' · ', Mt, ' − ½ · ', Mg, ' · ', Mt2],
    vyt: ['Velocidad vertical, con el eje hacia arriba: ', Mvy, ' = ', Mv0y, ' − ', Mg, ' · ', Mt],
    H: ['Altura máxima, ', MH, ': la altura del punto donde ', Mvy, ' = 0'],
    R: ['Alcance, ', MR, ': lo que avanzó de lado al volver al piso'],
    cuadratica: 'Si p · t² + q · t + r = 0 (p, q, r: sus tres números): t = (−q ± √(q² − 4pr)) ÷ (2p)',
    dist: ['Distancia al origen: ', Md, ' = ', raiz([cuadrado(Mx), ' + ', cuadrado(My)])],
    eje: ['En cada eje, con aceleración constante: posición = salida + velocidad · ', Mt, ' + ½ · aceleración · ', Mt2],
  };
  // La letra de cada alternativa equivocada, en negrita, con lo que hace (regla «alternativa-sin-explicar»).
  const ms = q => `${fm(q)} m/s`;

  // ---------- Idea 2 (A2): la velocidad en cada instante ----------
  // Pieza fis-tiro: la piedra de la peña de 45 m, ahora con las flechas de su velocidad en cada segundo. Cambia: con qué
  // rapidez sale · Permanece: la peña, y lo que gana hacia abajo en cada segundo · Progresa: el reloj, que deja las dos
  // flechas (de lado y hacia abajo) y la que arman, a 1 s y a 2 s · Se reserva: cuánto mide la flecha entera (Predice) ·
  // Debe verse: la flecha de lado no cambia; la que va hacia abajo se duplica.
  const PENA2 = { plataforma: 'pena', alto: 45, ancho: 62, altoMax: 200 };
  const REGLA_H2 = { paso: 5, numero: 15, tiempos: true };
  const juegoA2 = val => tiroH(Object.assign({}, PENA2, { v0: val.v0, t: Math.min(val.t, T_A1), cada: 1, camino: 'recorrido', flecha: { texto: `${fm(val.v0)} m/s` },
    regla: REGLA_X, alturas: REGLA_H2, flechas: { en: [1, 2], kv: 2, textos: { vx: 'v_x', vy: 'v_y', v: 'v⃗' } } }));
  // Predice y Mira: sale a 15 m/s; a los 2 s va con 15 m/s de lado y 20 m/s hacia abajo: 25 m/s (3-4-5).
  const MIRA_A2 = Object.assign({}, PENA2, { ancho: 50, v0: 15, cada: 1, camino: 'recorrido', flecha: { texto: '15 m/s' }, alturas: REGLA_H2,
    cortes: [{ t: 0 }, { t: 1, flechas: { en: [1], kv: 2, v: false, textos: { vx: '15 m/s', vy: '10 m/s' } } },
      { t: 2, flechas: { en: [1, 2], kv: 2, v: false, textos: { vx: '15 m/s', vy: '20 m/s' } } },
      { t: 2, flechas: { en: [2], kv: 2, textos: { vx: '15 m/s', vy: '20 m/s', v: '25 m/s' } } },
      { t: 2, flechas: { en: [1, 2], kv: 2, vx: false, vy: false } },
      { t: 2, flechas: { en: [1, 2], kv: 2, vx: false, vy: false }, gravedad: { en: [1, 2], texto: 'g' } }] });

  // Ejemplos resueltos de A2. Cuentas rehechas aparte (scratchpad e5-fisica/cuentas-a2a5.js, 19 nov: simula el vuelo paso
  // a paso y mide la velocidad con dos posiciones seguidas): 10·3; 12 y 12; 10·1,5; √(8² + 6²); 25/10; 20 = 5t², 10·2 y
  // √(15² + 20²); 10·3 y 30/40; 45 = 5t² y √(40² + 30²); 12·3/4 = 10·t; 108/3,6, 10·4 y √(30² + 40²); 15·4/3 = 10·t con
  // 5·t²; 80 = 5t², √(30² + 40²) y 40/30; √(25² − 20²); 24 = 10·t y 24√2; y el valor de cada alternativa equivocada.
  const EJEMPLOS_VELOCIDAD = [
    { nivel: 1, titulo: 'La velocidad hacia abajo',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 80, ancho: 50, v0: 6, flecha: { texto: '6 m/s' } }),
      enunciado: ['Una pelota sale de lado, a ', pv('6 m/s'), ', desde una azotea alta. ¿Con qué velocidad hacia abajo va ', pt('3 s'), ' después?'],
      datos: [DB.vx, DB.vy, DA.g],
      solucion: [{ texto: 'Hacia abajo parte de cero y gana 10 m/s cada segundo.', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt('3'), ' = ', pv('30 m/s')] }],
      respuesta: ['Baja a ', pv('30 m/s')] },
    { nivel: 1, titulo: 'La velocidad de lado',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 40, v0: 12, flecha: { texto: '12 m/s' } }),
      enunciado: ['Una piedra sale de lado, a ', pv('12 m/s'), ', desde una peña. ¿Cuánto vale su velocidad de lado al salir y ', pt('2 s'), ' después?'],
      datos: [DB.vx, DB.vy],
      solucion: [{ texto: 'De lado nada la empuja ni la frena: no cambia.', ecuacion: [Mvx, ' = ', Mv0, ' = ', pv('12 m/s')] }],
      respuesta: [pv('12 m/s'), ' en los dos instantes'] },
    { nivel: 1, titulo: 'Un segundo y medio',
      figura: fig({ plataforma: 'azotea', objeto: 'canica', alto: 20, ancho: 16, v0: 4, flecha: { texto: '4 m/s' } }),
      enunciado: ['Una canica sale de lado, a ', pv('4 m/s'), ', del borde de una azotea alta. ¿Con qué velocidad hacia abajo va a los ', pt('1,5 s'), '?'],
      datos: [DB.vx, DB.vy, DA.g],
      solucion: [{ texto: 'Los 4 m/s son de lado. Hacia abajo solo cuenta el tiempo.', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt('1,5'), ' = ', pv('15 m/s')] }],
      respuesta: ['Baja a ', pv('15 m/s')] },
    { nivel: 1, titulo: 'Armar la rapidez',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 40, v0: 8, flecha: { texto: '8 m/s' } }),
      enunciado: ['En un instante, una piedra lanzada de lado va con ', pv('8 m/s'), ' de lado y ', pv('6 m/s'), ' hacia abajo. ¿Cuál es su rapidez?'],
      datos: [DB.rap],
      solucion: [{ texto: 'Las dos componentes forman un ángulo recto: Pitágoras.', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('8')), ' + ', cuadrado(pv('6'))]), ' = ', raiz('100'), ' = ', pv('10 m/s')] }],
      respuesta: ['Va a ', pv('10 m/s')] },
    { nivel: 1, titulo: '¿Cuándo baja a 25 m/s?',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 80, ancho: 50, v0: 10, flecha: { texto: '10 m/s' } }),
      enunciado: ['Una pelota sale de lado, a ', pv('10 m/s'), ', desde una azotea alta. ¿En qué instante su velocidad hacia abajo vale ', pv('25 m/s'), '?'],
      datos: [DB.vx, DB.vy, DA.g],
      solucion: [{ texto: ['Gana 10 m/s cada segundo. Se despeja ', Mt, '.'], ecuacion: [Mt, ' = ', { frac: [pv('25'), pa('10')] }, ' = ', pt('2,5 s')] }],
      respuesta: ['A los ', pt('2,5 s')] },
    { nivel: 2, titulo: 'La rapidez al llegar',
      figura: fig({ plataforma: 'pena', alto: 20, ancho: 36, v0: 15, flecha: { texto: '15 m/s' }, cotaAlto: { texto: '20 m' } }),
      enunciado: ['Desde una peña de ', ph('20 m'), ' se lanza una piedra de lado a ', pv('15 m/s'), '. ¿Con qué rapidez llega al agua?'],
      datos: [DA.cae, DB.vx, DB.vy, DB.rap, DA.g],
      solucion: [
        { texto: 'El tiempo de vuelo sale de la altura; con él, la velocidad hacia abajo:', ecuacion: [ph('20'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('2 s'), ';   ', Mvy, ' = ', pa('10'), ' · ', pt('2'), ' = ', pv('20 m/s')] },
        { texto: 'De lado sigue a 15 m/s. Se arman con Pitágoras:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('15')), ' + ', cuadrado(pv('20'))]), ' = ', pv('25 m/s')] },
      ],
      respuesta: ['Llega a ', pv('25 m/s')] },
    { nivel: 2, titulo: '¿Con qué ángulo va?',
      figura: fig({ plataforma: 'pena', alto: 80, ancho: 170, v0: 40, flecha: { texto: '40 m/s' } }),
      enunciado: ['Con una huaraca (honda) se lanza una piedra de lado a ', pv('40 m/s'), ' desde lo alto de un cerro. ¿Qué ángulo forma su velocidad con la horizontal a los ', pt('3 s'), '?'],
      datos: [DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
      solucion: [
        { texto: 'Las dos componentes a los 3 s:', ecuacion: [Mvx, ' = ', pv('40 m/s'), ';   ', Mvy, ' = ', pa('10'), ' · ', pt('3'), ' = ', pv('30 m/s')] },
        { texto: 'tan θ es lo que baja entre lo que avanza:', ecuacion: ['tan θ = ', { frac: [pv('30'), pv('40')] }, ' = ', { frac: ['3', '4'] }, '   →   θ = 37°'] },
      ],
      respuesta: ['37° bajo la horizontal, con ', pv('30 m/s'), ' hacia abajo'] },
    { nivel: 2, titulo: 'Desde 45 metros',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 130, v0: 40, flecha: { texto: '40 m/s' }, cotaAlto: { texto: '45 m' } }),
      enunciado: ['Desde un acantilado de ', ph('45 m'), ' se lanza con una huaraca una piedra de lado a ', pv('40 m/s'), '. ¿Con qué rapidez llega abajo?'],
      datos: [DA.cae, DB.vx, DB.vy, DB.rap, DA.g],
      solucion: [
        { texto: 'Tiempo de vuelo y velocidad hacia abajo al llegar:', ecuacion: [ph('45'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('3 s'), ';   ', Mvy, ' = ', pa('10'), ' · ', pt('3'), ' = ', pv('30 m/s')] },
        { texto: 'Con los 40 m/s de lado, que no cambiaron:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('40')), ' + ', cuadrado(pv('30'))]), ' = ', pv('50 m/s')] },
      ],
      respuesta: ['Llega a ', pv('50 m/s')] },
    { nivel: 2, titulo: 'El instante de los 37°',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 44, v0: 12, flecha: { texto: '12 m/s' } }),
      enunciado: ['Una pelota sale de lado a ', pv('12 m/s'), ' desde una azotea alta. ¿En qué instante su velocidad forma 37° con la horizontal?'],
      datos: [DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
      solucion: [
        { texto: 'A 37°, lo que baja es 3/4 de lo que avanza:', ecuacion: [Mvy, ' = ', pv('12'), ' · ', { frac: ['3', '4'] }, ' = ', pv('9 m/s')] },
        { texto: 'Esa velocidad hacia abajo la gana en:', ecuacion: [Mt, ' = ', { frac: [pv('9'), pa('10')] }, ' = ', pt('0,9 s')] },
      ],
      respuesta: ['A los ', pt('0,9 s')] },
    { nivel: 2, titulo: 'Desde la avioneta, en km/h',
      figura: fig({ plataforma: 'avioneta', objeto: 'paquete', alto: 125, ancho: 150, v0: 30, flecha: { texto: '108 km/h' } }),
      enunciado: ['Una avioneta vuela de lado a ', pv('108 km/h'), ', a ', ph('125 m'), ' del suelo, y suelta un paquete. ¿Con qué rapidez va el paquete ', pt('4 s'), ' después?'],
      datos: [DB.vx, DB.vy, DB.rap, DA.g, DA.kmh],
      solucion: [
        { texto: 'El paquete sale de lado con la rapidez de la avioneta:', ecuacion: [pv('108 km/h'), ' = ', { frac: ['108 000 m', '3600 s'] }, ' = ', pv('30 m/s')] },
        { texto: 'Hacia abajo, a los 4 s, y las dos juntas:', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt('4'), ' = ', pv('40 m/s'), ';   ', Mv, ' = ', raiz([cuadrado(pv('30')), ' + ', cuadrado(pv('40'))]), ' = ', pv('50 m/s')] },
      ],
      respuesta: ['Va a ', pv('50 m/s')] },
    { nivel: 3, titulo: 'A 53°, ¿cuánto ha caído?',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 50, v0: 15, flecha: { texto: '15 m/s' } }),
      enunciado: ['Una piedra sale de lado a ', pv('15 m/s'), ' desde una peña alta. Cuando su velocidad forma 53° con la horizontal, ¿cuánto ha caído?'],
      alternativas: ['10 m', '40 m', '20 m', '6,33 m', '30 m'],
      datos: [DA.cae, DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
      solucion: [
        { texto: 'A 53°, lo que baja es 4/3 de lo que avanza; de ahí, el tiempo:', ecuacion: [Mvy, ' = ', pv('15'), ' · ', { frac: ['4', '3'] }, ' = ', pv('20 m/s'), '   →   ', Mt, ' = ', pt('2 s')] },
        { texto: 'En ese tiempo ha caído:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', cuadrado(pt('2')), ' = ', ph('20 m')] },
        { texto: [neg('A'), ' no eleva el tiempo al cuadrado; ', neg('B'), ' olvida el ½; ', neg('D'), ' usa 3/4, que es tan 37°; ', neg('E'), ' da lo que avanzó de lado.'] },
      ],
      respuesta: [neg('C'), ', ', ph('20 m')] },
    { nivel: 3, titulo: 'Rapidez y ángulo al llegar',
      figura: fig({ plataforma: 'azotea', objeto: 'piedra', alto: 80, ancho: 130, v0: 30, flecha: { texto: '30 m/s' }, cotaAlto: { texto: '80 m' } }),
      enunciado: ['Desde una torre de ', ph('80 m'), ' se lanza con una huaraca una piedra de lado a ', pv('30 m/s'), '. ¿Con qué rapidez y con qué ángulo bajo la horizontal llega al piso?'],
      alternativas: ['50 m/s y 53°', '50 m/s y 37°', '70 m/s y 53°', '40 m/s y 90°', '30 m/s y 0°'],
      datos: [DA.cae, DB.vxy, DB.rap, DB.ang, DB.tan, DA.g],
      solucion: [
        { texto: 'Tiempo de vuelo y velocidad hacia abajo al llegar:', ecuacion: [ph('80'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('4 s'), ';   ', Mvy, ' = ', pv('40 m/s')] },
        { texto: 'Rapidez y ángulo, con los 30 m/s de lado:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('30')), ' + ', cuadrado(pv('40'))]), ' = ', pv('50 m/s'), ';   tan θ = ', { frac: ['40', '30'] }, '   →   θ = 53°'] },
        { texto: [neg('B'), ' invierte tan θ; ', neg('C'), ' suma 30 + 40; ', neg('D'), ' olvida la velocidad de lado; ', neg('E'), ' cree que la velocidad no cambia.'] },
      ],
      respuesta: [neg('A'), ', ', pv('50 m/s'), ' y 53°'] },
    { nivel: 3, titulo: 'De la rapidez a la salida',
      figura: fig({ plataforma: 'pena', alto: 20, ancho: 36, v0: 15, flecha: { texto: '?' }, cotaAlto: { texto: '20 m' } }),
      enunciado: ['Una piedra lanzada de lado desde una peña de ', ph('20 m'), ' llega al agua con una rapidez de ', pv('25 m/s'), '. ¿Con qué rapidez salió?'],
      alternativas: ['5 m/s', '25 m/s', '20 m/s', '45 m/s', '15 m/s'],
      datos: [DA.cae, DB.vx, DB.vy, DB.rap, DA.g],
      solucion: [
        { texto: 'Al llegar, hacia abajo va a:', ecuacion: [ph('20'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('2 s'), ';   ', Mvy, ' = ', pv('20 m/s')] },
        { texto: 'La parte de lado es el otro cateto, y es la de salida:', ecuacion: [Mv0, ' = ', raiz([cuadrado(pv('25')), ' − ', cuadrado(pv('20'))]), ' = ', raiz('225'), ' = ', pv('15 m/s')] },
        { texto: [neg('A'), ' resta 25 − 20; ', neg('B'), ' cree que la rapidez no cambia; ', neg('C'), ' da la componente vertical; ', neg('D'), ' suma 25 + 20.'] },
      ],
      respuesta: [neg('E'), ', ', pv('15 m/s')] },
    { nivel: 3, titulo: '¿Qué es verdad en el vuelo?',
      figura: fig({ plataforma: 'pena', alto: 45, ancho: 50, v0: 12, flecha: { texto: 'v₀' }, camino: 'entero' }),
      enunciado: ['Una piedra se lanza de lado y vuela sin aire. ¿Cuál de estas afirmaciones es verdadera durante todo el vuelo?'],
      alternativas: ['Su aceleración apunta hacia donde se mueve', 'Su velocidad es tangente a la trayectoria', 'Su rapidez no cambia', 'Su velocidad de lado disminuye', 'Su aceleración crece mientras cae'],
      // Lector en frío (19 nov): «aceleración: g, hacia abajo» y «vₓ = v₀» en los datos descartaban tres alternativas.
      datos: [DA.g],
      solucion: [
        { texto: ['La velocidad ', vVec, ' apunta hacia donde va la piedra en ese instante: roza la trayectoria, es tangente a ella.'] },
        { texto: [neg('A'), ' y ', neg('E'), ' fallan: la aceleración es siempre g, hacia abajo. ', neg('C'), ' falla: la rapidez crece al caer. ', neg('D'), ' falla: de lado no cambia.'] },
      ],
      respuesta: [neg('B'), ': la ', pv('velocidad'), ' es tangente a la trayectoria'] },
    { nivel: 3, titulo: 'El instante de los 45°',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 80, v0: 24, flecha: { texto: '24 m/s' } }),
      enunciado: ['Una pelota sale de lado a ', pv('24 m/s'), ' desde una torre alta. ¿En qué instante baja a 45° y cuál es entonces su rapidez?'],
      alternativas: ['2,4 s y 24 m/s', '2,4 s y 48 m/s', '4,8 s y 33,94 m/s', '2,4 s y 33,94 m/s', '1,2 s y 26,83 m/s'],
      datos: [DB.vx, DB.vy, DB.rap, DB.ang, DB.tan, DA.g],
      solucion: [
        { texto: 'A 45° las dos componentes miden lo mismo:', ecuacion: [Mvy, ' = ', Mvx, ' = ', pv('24 m/s'), '   →   ', Mt, ' = ', { frac: [pv('24'), pa('10')] }, ' = ', pt('2,4 s')] },
        { texto: 'La rapidez es la diagonal de un cuadrado de lado 24:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('24')), ' + ', cuadrado(pv('24'))]), ' = 24', raiz('2'), ' ≈ ', pv('33,94 m/s')] },
        { texto: [neg('A'), ' da solo una componente; ', neg('B'), ' suma las dos; ', neg('C'), ' toma el doble de tiempo; ', neg('E'), ' toma la mitad del tiempo.'] },
      ],
      respuesta: [neg('D'), ', a los ', pt('2,4 s'), ' va a ', pv('33,94 m/s')] },
  ];

  // Ternas (de lado, hacia abajo, rapidez) con la velocidad hacia abajo = 10·t: para «Ahora tú» y «Así se resuelve».
  const TERNAS = [[15, 20, 25], [20, 15, 25], [12, 5, 13], [8, 15, 17], [12, 35, 37], [16, 30, 34], [9, 40, 41], [20, 21, 29]];
  // Alturas con su velocidad de llegada hacia abajo (10·t) y una rapidez de lado que da terna.
  const LLEGADAS = [[20, 15], [20, 21], [45, 16], [80, 9], [80, 18], [5, 10], [20, 10], [45, 12]];
  // Rapideces de lado y ángulo (37° o 53°) cuyo instante sale con un decimal: t = v₀·tan θ ÷ 10.
  const ANGULOS = [[20, 37], [4, 37], [8, 37], [16, 37], [12, 37], [15, 53], [6, 53], [12, 53], [9, 53], [18, 53], [20, 53]];

  const velocidadVuelo = {
    id: 'velocidad-en-vuelo',
    titulo: 'La velocidad en cada instante',
    pregunta: '¿Con qué rapidez llega al agua una piedra lanzada de lado?',
    temas: ['Movimiento en dos dimensiones', 'Tiro parabólico'],
    pieza: 'fis-tiro',
    aprendizaje: 'En el aire, la velocidad de lado no cambia y la vertical gana 10 m/s por segundo; juntas arman la velocidad, tangente al camino.',
    actividad: 'Elegir con qué rapidez sale la piedra y mirar sus flechas en cada segundo.',
    lee: {
      tarjetas: [
        { titulo: 'La flecha de la velocidad', texto: ['En cada instante, la velocidad de la piedra es una flecha que apunta hacia donde va: es tangente a la trayectoria. Como en el plano es un vector, se escribe ', vVec, '; su largo es la rapidez, ', Mv, '.'],
          dibujo: tiroH(Object.assign({}, PENA2, { ancho: 50, v0: 12, t: 2, camino: 'recorrido', flecha: { texto: '12 m/s' }, flechas: { en: [2], kv: 2, vx: false, vy: false, textos: { v: 'v⃗' } } })) },
        { titulo: 'Sus dos componentes', texto: ['Esa flecha se arma con dos componentes: la velocidad horizontal, ', Mvx, ', de lado, y la velocidad vertical, ', Mvy, ', que aquí se mide hacia abajo, igual que ', Mh, '.'],
          dibujo: tiroH(Object.assign({}, PENA2, { ancho: 50, v0: 12, t: 2, camino: 'recorrido', flecha: { texto: '12 m/s' }, flechas: { en: [2], kv: 2, textos: { vx: 'v_x', vy: 'v_y' } } })) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir con qué rapidez sale la piedra. Al primer segundo y a los 2 s quedan dibujadas sus flechas. Compara las dos flechas de lado; después, las dos que van hacia abajo.' },
      ],
    },
    ejemplos: EJEMPLOS_VELOCIDAD,
    juega: {
      pieza: 'fis-tiro',
      consigna: 'La piedra sale de lado desde la peña de 45 m. Al primer segundo y a los 2 s se dibujan sus flechas.',
      mision: {
        texto: 'Haz que a los 2 s la piedra baje justo a 45°: dos flechas iguales.',
        // A los 2 s baja con 20 m/s (10 m/s por segundo): de lado tiene que ir también a 20 m/s. El reloj no cuenta.
        logrado: val => val.v0 === G * 2,
        bien: 'A los 2 s va igual de rápido de lado que hacia abajo: baja a 45°.',
      },
      voz: 'Compara las flechas que van hacia abajo: ¿cuánto crecen?',
      leyenda: [
        { s: [Mv0], t: 'la rapidez con que sale, de lado' },
        { s: 'flecha entera', t: 'la velocidad en ese instante' },
        { s: [Mvx], t: 'velocidad de lado: la flecha discontinua horizontal' },
        { s: [Mvy], t: 'velocidad hacia abajo: la flecha discontinua vertical' },
        { s: [Mt], t: 'segundos desde que sale' },
        { s: [Mx], t: 'cuánto avanzó de lado, en metros' },
        { s: [Mh], t: 'cuánto ha caído, en metros' },
      ],
      controles: [
        { id: 'v0', etiqueta: 'Sale a, v₀', color: 'c-o', min: 5, max: 20, paso: 1, inicio: 8, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A1 + 0.6, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA2,
      // La lectura da las dos componentes a los 2 s, el instante de la misión, y lo dice (lector en frío, 19 nov: «Tras 2 s»
      // junto a un reloj en 0,21 s se leía como lo de ahora); no dice cuánto mide la flecha entera (eso es Predice).
      lectura: val => ['Misión (', pt('2 s'), '): ', pv(ms(val.v0)), ' de lado, ', pv('20 m/s'), ' abajo'],
      resumen: { v0: 12, t: 2.2 },
      minimo: 3,
      // Gesto directo: la punta de la flecha de salida se arrastra de lado (3 px por cada m/s, como la dibuja la pieza).
      arrastres: [{ id: 'salida', etiqueta: 'rapidez de salida (punta de la flecha)', color: 'c-o',
        donde: val => puntaSalida(juegoA2(val).datos), mover: (pt0, val) => ({ v0: rapidezDePunta(juegoA2(val).datos, pt0.x) }) }],
    },
    predice: {
      pregunta: ['La piedra sale de lado a ', pv('15 m/s'), '. A los ', pt('2 s'), ', todavía en el aire, ¿con qué rapidez se mueve?'],
      datos: ['g = 10 m/s² (convención del examen): lo que cae gana 10 m/s cada segundo.', 'Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: '25 m/s', correcta: true },
        { id: 'suma', texto: '35 m/s', error: 'TP-SUMA', siFuera: 'Bien las dos partes: 15 de lado y 20 hacia abajo. Pero forman un ángulo recto: no se suman así.' },
        { id: 'solo-vy', texto: '20 m/s', error: 'TP-SOLO-VY', siFuera: 'Eso es lo que ganó cayendo. De lado sigue yendo a 15 m/s: falta juntarlas.' },
        { id: 'igual', texto: '15 m/s', error: 'TP-V-CONSTANTE', siFuera: 'De lado sí sigue a 15 m/s. Pero además cae cada vez más rápido.' },
      ],
      dibujo: tiroH(Object.assign({}, PENA2, { ancho: 50, v0: 15, t: 2, cada: 1, camino: 'recorrido', flecha: { texto: '15 m/s' }, alturas: REGLA_H2, flechas: { en: [2], kv: 2, vx: false, vy: false, textos: { v: '?' } } })),
      revelar: tiroH(MIRA_A2, { corte: 3 }),
      coincide: 'Coincide: 15 m/s de lado y 20 m/s hacia abajo arman 25 m/s.',
    },
    mira: {
      datos: MIRA_A2,
      pasos: [
        { estado: { corte: 0 }, texto: 'Sale de lado a 15 m/s: toda su velocidad es horizontal.', ecuacion: [Mvx, ' = ', pv('15 m/s'), ';   ', Mvy, ' = 0'] },
        { estado: { corte: 1 }, texto: 'Al primer segundo, de lado sigue igual; hacia abajo ganó 10 m/s.', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt('1'), ' = ', pv('10 m/s')] },
        { estado: { corte: 2 }, texto: 'A los 2 s, hacia abajo ya va a 20 m/s.', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt('2'), ' = ', pv('20 m/s')] },
        { estado: { corte: 3 }, texto: 'Forman un ángulo recto: la rapidez sale con Pitágoras.', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('15')), ' + ', cuadrado(pv('20'))]), ' = ', raiz('625'), ' = ', pv('25 m/s')] },
        { estado: { corte: 4 }, texto: 'La velocidad es tangente a la trayectoria: apunta hacia donde va.' },
        { estado: { corte: 5 }, texto: 'La aceleración, en cambio, es siempre la misma: g, hacia abajo.', ecuacion: [Mg, ' = ', pa('10 m/s²')] },
      ],
    },
    regla: {
      texto: 'De lado, la velocidad no cambia; hacia abajo gana 10 m/s cada segundo. Juntas arman la velocidad: su rapidez sale con Pitágoras y es tangente a la trayectoria.',
      ecuacion: [Mvx, ' = ', Mv0, '   ·   ', Mvy, ' = ', Mg, ' · ', Mt, '   ·   ', Mv, ' = ', raiz([cuadrado(Mvx), ' + ', cuadrado(Mvy)])],
      condicion: 'tiro horizontal, sin aire; la velocidad vertical se mide hacia abajo. Su ángulo θ con la horizontal: tan θ = abajo ÷ de lado.',
    },
    // Así se resuelve: el ángulo con que llega (con la altura) y el instante de los 45°; «Ahora tú» pregunta otras cosas.
    resuelve: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [h, vv, ang] = r.de([[20, 15, 53], [20, 20, 45], [5, 10, 45], [5, 7.5, 53], [11.25, 20, 37], [11.25, 15, 45]]), tv = tCae(h), vyf = G * tv;
          return {
            enunciado: ['Desde una azotea de ', ph(`${fm(h)} m`), ' se lanza una pelota de lado a ', pv(ms(vv)), '. ¿Con qué ángulo bajo la horizontal llega al piso?'],
            datos: [DA.cae, DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: h, ancho: Math.max(vv * tv * 1.25, h * 0.5), v0: vv, t: 0, flecha: { texto: ms(vv) }, cotaAlto: { texto: `${fm(h)} m` } }),
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo de la velocidad con la horizontal, justo al llegar al piso.' },
              { tipo: 'datos', texto: ['Sale de lado a ', pv(ms(vv)), ' y cae ', ph(`${fm(h)} m`), '.'] },
              { tipo: 'regla', texto: 'De lado la velocidad no cambia; hacia abajo gana 10 m/s cada segundo. El ángulo sale de tan θ.',
                ecuacion: [Mvx, ' = ', Mv0, ';   ', Mvy, ' = ', Mg, ' · ', Mt, ';   tan θ = ', { frac: [Mvy, Mvx] }] },
              { tipo: 'cuentas', texto: 'El tiempo de vuelo, la velocidad hacia abajo al llegar y tan θ:',
                ecuacion: [ph(fm(h)), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt(`${fm(tv)} s`), ';   ', Mvy, ' = ', pv(ms(vyf)), ';   tan θ = ', { frac: [pv(fm(vyf)), pv(fm(vv))] }, '   →   θ = ', `${ang}°`] },
              { tipo: 'sentido', texto: ang === 45 ? 'Las dos componentes miden lo mismo: por eso baja a 45°.' : ang > 45 ? 'Baja más rápido de lo que avanza: el ángulo pasa de 45°.' : 'Avanza más rápido de lo que baja: el ángulo no llega a 45°.' },
            ],
            respuesta: ['Llega a ', `${ang}°`, ' bajo la horizontal, con ', pv(ms(vyf)), ' hacia abajo'],
          };
        }
        const vv = r.de([5, 8, 10, 12, 15, 18, 20, 25]), ti = vv / G;
        return {
          enunciado: ['Una piedra sale de lado a ', pv(ms(vv)), ' desde una peña alta. ¿En qué instante su velocidad forma 45° con la horizontal?'],
          datos: [DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
          dibujo: tiroH({ plataforma: 'pena', alto: 45, ancho: Math.max(vv * 3.4, 30), v0: vv, t: 0, flecha: { texto: ms(vv) } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el instante ', Mt, ' en que la velocidad baja a 45°.'] },
            { tipo: 'datos', texto: ['De lado va siempre a ', pv(ms(vv)), '. Hacia abajo parte de cero.'] },
            { tipo: 'regla', texto: 'A 45°, tan θ vale 1: las dos componentes miden lo mismo.', ecuacion: ['tan 45° = ', { frac: [Mvy, Mvx] }, ' = 1   →   ', Mvy, ' = ', Mvx] },
            { tipo: 'cuentas', texto: 'Hacia abajo gana 10 m/s cada segundo, hasta igualar a la de lado:', ecuacion: [pa('10'), ' · ', Mt, ' = ', pv(fm(vv)), '   →   ', Mt, ' = ', pt(`${fm(ti)} s`)] },
            { tipo: 'sentido', texto: `Antes de los ${fm(ti)} s baja con menos de 45°; después, con más. Cuanto más rápido sale, más tarda en llegar a 45°.` },
          ],
          respuesta: ['A los ', pt(`${fm(ti)} s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 53), k = sm % 4;
        if (k === 0) {
          // La velocidad hacia abajo a los t s (un paso): la de lado es un dato que sobra.
          const vv = r.de([4, 6, 8, 12, 15]), ti = r.de([1.5, 2, 2.5, 3, 3.5]);
          return {
            pregunta: ['Una pelota sale de lado, a ', pv(ms(vv)), ', desde una torre alta. ¿Con qué velocidad hacia abajo va ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DB.vx, DB.vy, DA.g],
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: 80, ancho: 60, v0: vv, t: 0, flecha: { texto: ms(vv) } }),
            opciones: opciones(G * ti, [
              { id: 'suma', valor: vv + G * ti, error: 'TP-SUMA', siFuera: 'Bien los 10 m/s por segundo. Pero la rapidez de lado no se suma a la de abajo.' },
              { id: 'caida', valor: G * ti * ti / 2, error: 'TP-CAIDA', siFuera: 'Eso son los metros que ha caído. La velocidad es 10 m/s por cada segundo.' },
              { id: 'lado', valor: vv, error: 'TP-V-CONSTANTE', siFuera: 'Esa es la de lado, que no cambia. Hacia abajo gana 10 m/s cada segundo.' },
              { id: 'un-segundo', valor: G, error: 'K-TIEMPO', siFuera: 'Eso gana en un solo segundo. Hay que multiplicar por el tiempo.' },
            ], q => ms(q)),
            solucion: { texto: 'Hacia abajo parte de cero y gana 10 m/s cada segundo.', ecuacion: [Mvy, ' = ', pa('10'), ' · ', pt(fm(ti)), ' = ', pv(ms(G * ti))] },
          };
        }
        if (k === 1) {
          // La rapidez a los t s: las dos componentes forman una terna.
          const [wx, wy, w] = r.de(TERNAS), ti = wy / G;
          return {
            pregunta: ['Una piedra sale de lado a ', pv(ms(wx)), ' desde una peña alta. ¿Con qué rapidez se mueve ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DB.vx, DB.vy, DB.rap, DA.g],
            dibujo: tiroH({ plataforma: 'pena', alto: 80, ancho: Math.max(wx * 4.4, 40), v0: wx, t: 0, flecha: { texto: ms(wx) } }),
            opciones: opciones(w, [
              { id: 'suma', valor: wx + wy, error: 'TP-SUMA', siFuera: 'Bien las dos componentes. Pero forman un ángulo recto: se juntan con Pitágoras, no sumando.' },
              { id: 'solo-vy', valor: wy, error: 'TP-SOLO-VY', siFuera: 'Eso es lo que ganó cayendo. Falta juntarlo con la velocidad de lado.' },
              { id: 'igual', valor: wx, error: 'TP-V-CONSTANTE', siFuera: 'De lado sí sigue igual. Pero además cae cada vez más rápido.' },
              { id: 'resta', valor: Math.abs(wx - wy), error: 'TP-RESTA-V', siFuera: 'Bien las dos componentes. Pero no van en la misma línea: no se restan.' },
            ], q => ms(q)),
            solucion: { texto: `Hacia abajo va a ${ms(wy)}; de lado, a ${ms(wx)}.`, ecuacion: [Mv, ' = ', raiz([cuadrado(pv(fm(wx))), ' + ', cuadrado(pv(fm(wy)))]), ' = ', pv(ms(w))] },
          };
        }
        if (k === 2) {
          // La rapidez al llegar, con la altura (dos pasos).
          const [h, wx] = r.de(LLEGADAS), wy = G * tCae(h), w = Math.hypot(wx, wy);
          return {
            pregunta: ['Desde una torre de ', ph(`${fm(h)} m`), ' se lanza una pelota de lado a ', pv(ms(wx)), '. ¿Con qué rapidez llega al piso?'],
            datos: [DA.cae, DB.vx, DB.vy, DB.rap, DA.g],
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: h, ancho: Math.max(wx * tCae(h) * 1.25, h * 0.5), v0: wx, t: 0, flecha: { texto: ms(wx) }, cotaAlto: { texto: `${fm(h)} m` } }),
            opciones: opciones(w, [
              { id: 'solo-vy', valor: wy, error: 'TP-SOLO-VY', siFuera: 'Bien: esa es la velocidad hacia abajo al llegar. Falta juntarla con la de lado.' },
              { id: 'suma', valor: wx + wy, error: 'TP-SUMA', siFuera: 'Bien las dos componentes. Pero forman un ángulo recto: se juntan con Pitágoras.' },
              { id: 'igual', valor: wx, error: 'TP-V-CONSTANTE', siFuera: 'De lado sí llega igual. Pero además viene cayendo.' },
              { id: 'sin-medio', valor: Math.hypot(wx, G * Math.sqrt(h / G)), error: 'TP-SIN-MEDIO', siFuera: 'Bien el camino. En el tiempo de caída falta el ½ de ½·g·t².' },
            ], q => ms(q)),
            solucion: { texto: `Cae ${fm(h)} m en ${fm(tCae(h))} s: llega con ${ms(wy)} hacia abajo.`, ecuacion: [Mv, ' = ', raiz([cuadrado(pv(fm(wx))), ' + ', cuadrado(pv(fm(wy)))]), ' = ', pv(ms(w))] },
          };
        }
        // Nivel examen: el instante en que la velocidad forma 37° o 53° con la horizontal.
        const [vv, ang] = r.de(ANGULOS), ti = vv * TAN[ang] / G;
        return {
          pregunta: ['Una piedra sale de lado a ', pv(ms(vv)), ' desde una peña alta. ¿En qué instante su velocidad forma ', `${ang}°`, ' con la horizontal?'],
          datos: [DB.vx, DB.vy, DB.ang, DB.tan, DA.g],
          dibujo: tiroH({ plataforma: 'pena', alto: 80, ancho: Math.max(vv * 4.4, 40), v0: vv, t: 0, flecha: { texto: ms(vv) } }),
          opciones: opciones(ti, [
            { id: 'inversa', valor: vv / TAN[ang] / G, error: 'TP-TAN-INV', siFuera: 'Bien que uses tan θ. Pero es lo que baja entre lo que avanza, no al revés.' },
            { id: 'sin-g', valor: vv * TAN[ang], error: 'TP-VY', siFuera: 'Bien: esa es la velocidad hacia abajo que hace falta. Divide entre 10 para tener el tiempo.' },
            { id: 'a45', valor: vv / G, error: 'TP-45', siFuera: 'Ese es el instante de los 45°, cuando las dos componentes son iguales.' },
            { id: 'seno', valor: vv * SEN[ang] / G, error: 'TP-SENO', siFuera: 'Bien que busques la velocidad hacia abajo. Pero sale de la de lado con tan θ, no con el seno.' },
          ], q => `${fm(q)} s`),
          solucion: { texto: `A ${ang}°, lo que baja es ${ang === 37 ? '3/4' : '4/3'} de lo que avanza.`, ecuacion: [pa('10'), ' · ', Mt, ' = ', pv(fm(vv)), ' · ', ang === 37 ? '3/4' : '4/3', '   →   ', Mt, ' = ', pt(`${fm(ti)} s`)] },
        };
      },
    },
  };

  // ====== Ayudantes de los gestos y de la mesa «tiro-libre» ======
  // Gesto directo (docs/teoria.md §4b): cuando una manija mueve dos controles a la vez (la punta de la flecha de salida
  // da la rapidez y el ángulo), mover elige la pareja de valores cuya manija queda más cerca del dedo.
  const EJ = datos => Kit.piezas.ejes.geometria(datos);
  const pasos = c => c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
  function masCerca(c1, c2, donde, pt) {
    let mejor = null, dist = Infinity;
    for (const a1 of pasos(c1)) for (const a2 of pasos(c2)) {
      const q = donde(a1, a2), dd = Math.hypot(q.x - pt.x, q.y - pt.y);
      if (dd < dist - 1e-9) { dist = dd; mejor = { [c1.id]: a1, [c2.id]: a2 }; }
    }
    return mejor;
  }
  // Los ejes de la mesa «tiro-libre», con la posición en violeta (el color de la unidad).
  const EJE_TIRO = (xmax = 65, ymax = 42) => ({
    x: { min: 0, max: xmax, paso: 10, nombre: 'x', unidad: 'm', decimales: 0, color: 'f' },
    y: { min: 0, max: ymax, paso: 10, nombre: 'y', unidad: 'm', decimales: 0, color: 'f' },
  });

  // ---------- Idea 3 (A3): lanzar con ángulo (fase 3, 19 nov) ----------
  // Pieza fis-tiro (plataforma 'piso'): la pelota que patea el arquero en la cancha del colegio. Cambia: la rapidez y el
  // ángulo de la patada · Permanece: la cancha y la gravedad · Progresa: el reloj, que deja una pelota tenue cada segundo
  // · Se reserva: la rapidez en lo más alto (Predice) · Debe verse: lo que sube decide cuánto vuela; lo de lado, cuánto
  // avanza. Sin flechas en vuelo: la de lo más alto es la predicción.
  const ANGS = [30, 37, 45, 53, 60];
  const comp = (v0, a) => ({ vx: v0 * COS[a], vy: v0 * SEN[a] });
  const vuelo = (vy, h = 0) => (vy + Math.sqrt(vy * vy + 2 * G * h)) / G;   // s: hasta el piso, saliendo h metros sobre él
  const Mtv = { sub: [Mt, 'v'] };
  const trigDe = a => (a === 37 || a === 53 ? DB.trig : a === 45 ? DB.trig45 : DB.trig30);
  const fun = (a, f2) => `${f2} ${a}°`;
  const CANCHA = { plataforma: 'piso', objeto: 'pelota', ancho: 64, techo: 24, altoMax: 170 };
  const REGLA_Y = { modo: 'sube', paso: 5, numero: 10 };
  const juegoA3 = val => {
    const c = comp(val.v0, val.ang), tt = Math.min(val.t, vuelo(c.vy));
    return tiroH(Object.assign({}, CANCHA, { vx: c.vx, vy: c.vy, t: tt, cada: 1, camino: 'recorrido', flecha: { texto: ms(val.v0) },
      angulo: { texto: `${val.ang}°` }, regla: { paso: 5, numero: 10 }, alturas: REGLA_Y, reloj: { texto: `t = ${fm(tt)} s` } }));
  };
  const CTRL_A3 = [
    { id: 'v0', etiqueta: 'Sale a, v₀', color: 'c-o', min: 10, max: 25, paso: 5, inicio: 15, unidad: 'm/s', decimales: 0 },
    { id: 'ang', etiqueta: 'Ángulo, θ', opciones: ANGS.map(k => ({ valor: k, texto: `${k}°` })), inicio: 37 },
    { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 4.9, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
  ];
  // Predice y Mira: sale a 25 m/s con 53° (15 de lado y 20 hacia arriba): 2 s de subida, 4 s de vuelo y 60 m de alcance.
  const MIRA_A3 = Object.assign({}, CANCHA, { vx: 15, vy: 20, cada: 1, camino: 'recorrido', flecha: false, angulo: { texto: '53°' }, alturas: REGLA_Y,
    // Lector en frío (19 nov): las flechas, en m/s, junto a la regla en metros parecían llegar a y = 10 m. Mientras se
    // dibujan, la regla de la pared no está (cada flecha tiene su propia escala, y el paso 1 lo dice); la regla vuelve al
    // final, con la rapidez de salida escrita.
    cortes: [{ t: 0, angulo: false, alturas: false, flechas: { en: [0], kv: 2, textos: { vx: '15 m/s', vy: '20 m/s', v: '25 m/s' } } },
      { t: 1, alturas: false, flechas: { en: [1], kv: 2, v: false, textos: { vx: '15 m/s', vy: '10 m/s' } } },
      { t: 2, alturas: false, flechas: { en: [2], kv: 2, v: false, textos: { vx: '15 m/s' } } },
      { t: 2, alturas: false, flechas: { en: [2], kv: 2, vx: false, textos: { v: '15 m/s' } } },
      { t: 4, alturas: false, flechas: { en: [3], kv: 2, v: false, textos: { vx: '15 m/s', vy: '10 m/s' } } },
      { t: 4, flecha: { texto: '25 m/s' }, cotaAlcance: { texto: '60 m', hasta: 60 } }] });

  // Ejemplos resueltos de A3. Cuentas rehechas aparte (scratchpad e5-fisica/cuentas-a2a5.js, 19 nov: simula el vuelo paso
  // a paso con las componentes): 20·4/5; 15·4/5; 12·2; 25 − 10·1,5; 10·1/2; 25·3/5 y 0 = 15t − 5t²; 20·4/5 y 16 − 5;
  // 10√2·√2/2 y 10·1 con 10 − 5; 25·4/5, 20 − 30 y √(15² + 10²); 30/20 y 15·1,5 − 5·1,5²; 60/20; −20 = 15t − 5t² y 20·4;
  // 19,8/9 y 12·2,2 − 5·2,2²; 16 y 12 − 20 con √(16² + 8²); 25·4/5 = 20; y el valor de cada alternativa equivocada.
  const EJEMPLOS_OBLICUO = [
    { nivel: 1, titulo: 'La parte de lado',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 40, vx: 16, vy: 12, flecha: { texto: '20 m/s' }, angulo: { texto: '37°' } }),
      enunciado: ['El arquero patea la pelota a ', pv('20 m/s'), ' con un ángulo de 37° sobre el piso. ¿Cuánto vale su velocidad horizontal al salir?'],
      datos: [DB.comp, DB.trig],
      solucion: [{ texto: 'De lado va la parte del coseno:', ecuacion: [Mv0x, ' = ', pv('20'), ' · cos 37° = ', pv('20'), ' · ', { frac: ['4', '5'] }, ' = ', pv('16 m/s')] }],
      respuesta: [Mv0x, ' = ', pv('16 m/s')] },
    { nivel: 1, titulo: 'La parte que sube',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 25, vx: 9, vy: 12, flecha: { texto: '15 m/s' }, angulo: { texto: '53°' } }),
      enunciado: ['Una pelota sale del piso a ', pv('15 m/s'), ' con 53°. ¿Con qué velocidad vertical sale?'],
      datos: [DB.comp, DB.trig],
      solucion: [{ texto: 'Hacia arriba va la parte del seno:', ecuacion: [Mv0y, ' = ', pv('15'), ' · sen 53° = ', pv('15'), ' · ', { frac: ['4', '5'] }, ' = ', pv('12 m/s')] }],
      respuesta: [Mv0y, ' = ', pv('12 m/s')] },
    { nivel: 1, titulo: 'Lo que avanza de lado',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 60, vx: 12, vy: 16, flecha: false, flechas: { en: [0], kv: 2, v: false, textos: { vx: '12 m/s', vy: '16 m/s' } } }),
      enunciado: ['Una pelota sale con ', pv('12 m/s'), ' de lado y ', pv('16 m/s'), ' hacia arriba. ¿Cuánto avanzó de lado a los ', pt('2 s'), '?'],
      datos: [DB.x],
      solucion: [{ texto: 'De lado nada la frena: avanza 12 m cada segundo.', ecuacion: [Mx, ' = ', pv('12'), ' · ', pt('2'), ' = ', px('24 m')] }],
      respuesta: ['Avanzó ', px('24 m')] },
    { nivel: 1, titulo: 'La velocidad vertical después',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 60, vx: 10, vy: 25, flecha: false, flechas: { en: [0], kv: 1.6, v: false, textos: { vx: '10 m/s', vy: '25 m/s' } } }),
      enunciado: ['Una pelota sale con ', pv('25 m/s'), ' hacia arriba y ', pv('10 m/s'), ' de lado. ¿Cuánto vale su velocidad vertical ', pt('1,5 s'), ' después?'],
      datos: [DB.vyt, DA.g],
      solucion: [{ texto: 'Hacia arriba pierde 10 m/s cada segundo, como en el lanzamiento vertical.', ecuacion: [Mvy, ' = ', pv('25'), ' − ', pa('10'), ' · ', pt('1,5'), ' = ', pv('10 m/s')] }],
      respuesta: ['Todavía sube, a ', pv('10 m/s')] },
    { nivel: 1, titulo: 'A 30°',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 12, vx: 10 * COS[30], vy: 5, flecha: { texto: '10 m/s' }, angulo: { texto: '30°' } }),
      enunciado: ['Una pelota sale del piso a ', pv('10 m/s'), ' con 30°. ¿Con qué velocidad vertical sale?'],
      datos: [DB.comp, DB.trig30],
      solucion: [{ texto: 'Hacia arriba va la parte del seno:', ecuacion: [Mv0y, ' = ', pv('10'), ' · sen 30° = ', pv('10'), ' · ', { frac: ['1', '2'] }, ' = ', pv('5 m/s')] }],
      respuesta: [Mv0y, ' = ', pv('5 m/s')] },
    { nivel: 2, titulo: 'Cuánto vuela',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 66, vx: 20, vy: 15, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' } }),
      enunciado: ['El arquero patea la pelota a ', pv('25 m/s'), ' con 37°. ¿Cuánto tiempo está en el aire antes de volver al piso?'],
      datos: [DB.comp, DB.trig, DB.y, DA.g],
      solucion: [
        { texto: 'Lo que decide el vuelo es la parte que sube:', ecuacion: [Mv0y, ' = ', pv('25'), ' · ', { frac: ['3', '5'] }, ' = ', pv('15 m/s')] },
        { texto: ['Vuelve al piso cuando ', My, ' = 0:'], ecuacion: ['0 = ', pv('15'), ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mt, ' = ', pt('3 s')] },
      ],
      respuesta: ['Está ', pt('3 s'), ' en el aire'] },
    { nivel: 2, titulo: 'La altura a 1 segundo',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 40, vx: 12, vy: 16, flecha: { texto: '20 m/s' }, angulo: { texto: '53°' } }),
      enunciado: ['Una pelota sale del piso a ', pv('20 m/s'), ' con 53°. ¿A qué altura está ', pt('1 s'), ' después?'],
      datos: [DB.comp, DB.trig, DB.y, DA.g],
      solucion: [
        { texto: 'La parte que sube:', ecuacion: [Mv0y, ' = ', pv('20'), ' · ', { frac: ['4', '5'] }, ' = ', pv('16 m/s')] },
        { texto: 'Sube 16 m en ese segundo y la gravedad le quita 5 m:', ecuacion: [My, ' = ', pv('16'), ' · ', pt('1'), ' − ½ · ', pa('10'), ' · ', cuadrado(pt('1')), ' = ', ph('11 m')] },
      ],
      respuesta: ['Está a ', ph('11 m'), ' del piso'] },
    { nivel: 2, titulo: 'A 45°, ¿dónde está?',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 24, vx: 10, vy: 10, flecha: { texto: '10√2 m/s' }, angulo: { texto: '45°' } }),
      enunciado: ['Una pelota sale del piso a ', pv('10√2 m/s'), ' con 45°. ¿Dónde está ', pt('1 s'), ' después?'],
      datos: [DB.comp, DB.trig45, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'A 45° las dos partes miden lo mismo:', ecuacion: [Mv0x, ' = ', Mv0y, ' = ', pv('10√2'), ' · ', { frac: ['√2', '2'] }, ' = ', pv('10 m/s')] },
        { texto: 'En 1 s, de lado y hacia arriba:', ecuacion: [Mx, ' = ', pv('10'), ' · ', pt('1'), ' = ', px('10 m'), ';   ', My, ' = ', pv('10'), ' · ', pt('1'), ' − 5 · ', cuadrado(pt('1')), ' = ', ph('5 m')] },
      ],
      respuesta: [px('10 m'), ' de lado y ', ph('5 m'), ' de alto'] },
    { nivel: 2, titulo: 'La rapidez a los 3 s',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 64, vx: 15, vy: 20, flecha: { texto: '25 m/s' }, angulo: { texto: '53°' } }),
      enunciado: ['Una pelota sale a ', pv('25 m/s'), ' con 53°. ¿Con qué rapidez se mueve ', pt('3 s'), ' después, todavía en el aire?'],
      datos: [DB.comp, DB.trig, DB.vyt, DB.rap, DA.g],
      solucion: [
        { texto: 'Las dos partes a los 3 s: la de lado no cambia; la vertical ya es negativa, porque baja.', ecuacion: [Mvx, ' = ', pv('15 m/s'), ';   ', Mvy, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('3'), ' = ', pv('−10 m/s')] },
        { texto: 'Se juntan con Pitágoras (el signo no cambia el cuadrado):', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('15')), ' + ', cuadrado(pv('10'))]), ' = ', raiz('325'), ' ≈ ', pv('18,03 m/s')] },
      ],
      respuesta: ['Va a ', pv('18,03 m/s'), ', bajando'] },
    { nivel: 2, titulo: '¿A qué altura pasa?',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 66, vx: 20, vy: 15, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' }, cotaAlcance: { texto: '30 m', hasta: 30 } }),
      enunciado: ['Una pelota sale a ', pv('25 m/s'), ' con 37°. ¿A qué altura pasa cuando avanzó ', px('30 m'), ' de lado?'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'Primero el tiempo, con lo de lado (20 m/s):', ecuacion: [Mt, ' = ', { frac: [px('30'), pv('20')] }, ' = ', pt('1,5 s')] },
        { texto: 'Con ese reloj, la altura (sube con 15 m/s):', ecuacion: [My, ' = ', pv('15'), ' · ', pt('1,5'), ' − 5 · ', cuadrado(pt('1,5')), ' = 22,5 − 11,25 = ', ph('11,25 m')] },
      ],
      respuesta: ['Pasa a ', ph('11,25 m'), ' del piso'] },
    { nivel: 3, titulo: 'El vuelo, con lo que avanza',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 66, vx: 20, vy: 15, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' }, cotaAlcance: { texto: '60 m', hasta: 60 } }),
      enunciado: ['Una pelota pateada a ', pv('25 m/s'), ' con 37° cae a ', px('60 m'), ' de donde salió. ¿Cuánto tiempo estuvo en el aire?'],
      alternativas: ['2,4 s', '3 s', '4 s', '1,5 s', '5 s'],
      datos: [DB.comp, DB.trig, DB.x],
      solucion: [
        { texto: 'De lado avanza parejo con su parte horizontal:', ecuacion: [Mv0x, ' = ', pv('25'), ' · ', { frac: ['4', '5'] }, ' = ', pv('20 m/s')] },
        { texto: 'Los 60 m los avanzó a 20 m/s todo el vuelo:', ecuacion: [Mt, ' = ', { frac: [px('60'), pv('20')] }, ' = ', pt('3 s')] },
        { texto: [neg('A'), ' divide entre la rapidez total; ', neg('C'), ' divide entre la parte que sube; ', neg('D'), ' da solo la subida; ', neg('E'), ' toma 25 m/s como si subiera entera.'] },
      ],
      respuesta: [neg('B'), ', ', pt('3 s')] },
    { nivel: 3, titulo: 'Desde la azotea, con ángulo',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 20, ancho: 92, vx: 20, vy: 15, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' }, cotaAlto: { texto: '20 m' }, cotaAlcance: { texto: '?', hasta: 80 } }),
      enunciado: ['Desde una azotea de ', ph('20 m'), ' se lanza una pelota a ', pv('25 m/s'), ' con 37° hacia arriba. ¿A qué distancia del pie del edificio cae?'],
      alternativas: ['60 m', '100 m', '80 m', '40 m', '72,43 m'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DB.cuadratica, DA.g],
      solucion: [
        { texto: ['Sube con 15 m/s y avanza con 20 m/s. El piso está en ', My, ' = −20 m:'], ecuacion: ['−20 = ', pv('15'), ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mt2, ' − 3', Mt, ' − 4 = 0   →   ', Mt, ' = ', pt('4 s')] },
        { texto: 'La otra raíz, −1 s, no sirve. En 4 s avanza:', ecuacion: [Mx, ' = ', pv('20'), ' · ', pt('4'), ' = ', px('80 m')] },
        { texto: [neg('A'), ' se detiene a la altura de la azotea; ', neg('B'), ' avanza con 25 m/s; ', neg('D'), ' la deja caer desde el reposo; ', neg('E'), ' cambia seno y coseno.'] },
      ],
      respuesta: [neg('C'), ', ', px('80 m')] },
    { nivel: 3, titulo: '¿Pasa bajo el travesaño?',
      fuente: 'IFAB, Reglas de Juego, regla 1 (theifab.com): el borde inferior del travesaño, a 2,44 m del piso.',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 24, vx: 9, vy: 12, flecha: { texto: '15 m/s' }, angulo: { texto: '53°' }, blanco: { en: 19.8, tipo: 'arco', alto: 2.44 }, cotaAlcance: { texto: '19,8 m', hasta: 19.8 } }),
      enunciado: ['En un tiro libre, la pelota sale del piso a ', pv('15 m/s'), ' con 53°, a ', px('19,8 m'), ' del arco. El travesaño está a 2,44 m. ¿A qué altura cruza la línea del arco?'],
      alternativas: ['26,4 m: pasa por encima', '7,2 m: pasa por encima', '7,13 m: pasa por encima', '2,2 m: entra bajo el travesaño', '1,24 m: entra bajo el travesaño'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'Avanza con 9 m/s y sube con 12 m/s. Llega a la línea del arco a los:', ecuacion: [Mt, ' = ', { frac: [px('19,8'), pv('9')] }, ' = ', pt('2,2 s')] },
        { texto: 'Su altura en ese instante:', ecuacion: [My, ' = ', pv('12'), ' · ', pt('2,2'), ' − 5 · ', cuadrado(pt('2,2')), ' = 26,4 − 24,2 = ', ph('2,2 m')] },
        { texto: [neg('A'), ' olvida la gravedad; ', neg('B'), ' da la altura máxima; ', neg('C'), ' divide entre la rapidez total; ', neg('E'), ' cambia el seno y el coseno.'] },
      ],
      respuesta: [neg('D'), ', ', ph('2,2 m'), ': entra'] },
    { nivel: 3, titulo: 'La rapidez a los 2 s',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 40, vx: 16, vy: 12, flecha: { texto: '20 m/s' }, angulo: { texto: '37°' } }),
      enunciado: ['Una pelota sale del piso a ', pv('20 m/s'), ' con 37°. ¿Con qué rapidez se mueve ', pt('2 s'), ' después, todavía en el aire?'],
      alternativas: ['17,89 m/s', '20 m/s', '16 m/s', '24 m/s', '35,78 m/s'],
      datos: [DB.comp, DB.trig, DB.vyt, DB.rap, DA.g],
      solucion: [
        { texto: 'Las dos partes de la salida:', ecuacion: [Mv0x, ' = ', pv('20'), ' · ', { frac: ['4', '5'] }, ' = ', pv('16 m/s'), ';   ', Mv0y, ' = ', pv('20'), ' · ', { frac: ['3', '5'] }, ' = ', pv('12 m/s')] },
        { texto: 'A los 2 s: de lado sigue igual; hacia arriba ya pasó por cero y baja.', ecuacion: [Mvx, ' = ', pv('16 m/s'), ';   ', Mvy, ' = ', pv('12'), ' − ', pa('10'), ' · ', pt('2'), ' = ', pv('−8 m/s')] },
        { texto: 'Con Pitágoras:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('16')), ' + ', cuadrado(pv('8'))]), ' = ', raiz('320'), ' ≈ ', pv('17,89 m/s')] },
        { texto: [neg('B'), ' cree que la rapidez no cambia; ', neg('C'), ' da solo la parte de lado; ', neg('D'), ' suma 16 + 8; ', neg('E'), ' suma g · t = 20 m/s en vez de restarlo.'] },
      ],
      respuesta: [neg('A'), ', ', pv('17,89 m/s')] },
    { nivel: 3, titulo: 'Patada o lanzamiento vertical',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 64, vx: 15, vy: 20, flecha: { texto: '25 m/s' }, angulo: { texto: '53°' }, camino: 'entero' }),
      enunciado: ['Una pelota se patea a ', pv('25 m/s'), ' con 53°. A la vez, otra se lanza recto hacia arriba a ', pv('20 m/s'), '. ¿Cuál vuelve antes al piso?'],
      alternativas: ['La vertical, porque no avanza', 'La pateada, porque va más rápido', 'La vertical, porque sube más alto', 'La pateada, porque recorre más camino', 'Las dos a la vez, a los 4 s'],
      datos: [DB.comp, DB.trig, DB.y, DA.g],
      solucion: [
        { texto: 'La pateada sube con la misma velocidad que la vertical:', ecuacion: [Mv0y, ' = ', pv('25'), ' · ', { frac: ['4', '5'] }, ' = ', pv('20 m/s')] },
        { texto: 'El tiempo de vuelo sale solo de la parte que sube; en las dos:', ecuacion: ['0 = ', pv('20'), ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mt, ' = ', pt('4 s')] },
        { texto: [neg('A'), ' y ', neg('D'), ' creen que avanzar de lado cambia el vuelo; ', neg('B'), ' mira la rapidez entera; ', neg('C'), ' falla: las dos suben lo mismo.'] },
      ],
      respuesta: [neg('E'), ': las dos a los ', pt('4 s')] },
  ];

  // Casos de «Ahora tú» (sin 25 m/s a 53°, el caso de Predice) y de «Así se resuelve» (listas distintas).
  const PATADAS = [[10, 37], [15, 37], [20, 37], [25, 37], [10, 53], [15, 53], [20, 53], [20, 30], [10, 30], [12, 30], [20, 60], [10, 60]];
  // Azoteas con ángulo: [altura (m), rapidez (m/s), ángulo]: llegan al piso en un número entero de segundos.
  const AZOTEAS = [[20, 25, 37], [16, 20, 53], [32, 20, 37], [40, 20, 30], [45, 20, 53], [15, 20, 30], [30, 10, 30], [27, 10, 37], [21, 10, 53], [50, 25, 37]];
  // Rapidez en un instante: [rapidez, ángulo, instante] todavía en el aire.
  const INSTANTES = [[25, 53, 3], [25, 37, 1], [15, 53, 2], [20, 53, 1], [10, 37, 1], [20, 30, 1.5], [25, 53, 1], [20, 37, 0.5], [15, 37, 1.5]];
  const figPatada = (v0, a, extra) => { const c = comp(v0, a); return tiroH(Object.assign({ plataforma: 'piso', objeto: 'pelota', ancho: Math.max(c.vx * 2 * c.vy / G * 1.1, 12), vx: c.vx, vy: c.vy, t: 0, flecha: { texto: ms(v0) }, angulo: { texto: `${a}°` } }, extra)); };

  const oblicuo = {
    id: 'tiro-oblicuo',
    titulo: 'Lanzar con ángulo',
    pregunta: '¿Qué parte de la rapidez de una pelota la hace subir?',
    temas: ['Tiro parabólico'],
    pieza: 'fis-tiro',
    aprendizaje: 'Con ángulo, la rapidez de salida se parte en dos: de lado avanza parejo y hacia arriba es un lanzamiento vertical, con el mismo reloj.',
    actividad: 'Patear una pelota con distinto ángulo en la cancha del colegio.',
    lee: {
      tarjetas: [
        { titulo: 'Patear con ángulo', texto: ['En la cancha del colegio, el arquero patea la pelota desde el piso, inclinada hacia arriba. Ese ángulo con el piso es el ángulo de lanzamiento, θ. La flecha es su rapidez de salida, ', Mv0, '.'],
          dibujo: tiroH(Object.assign({}, CANCHA, { ancho: 50, vx: 12, vy: 16, t: 0, camino: 'entero', flecha: { texto: 'v₀' }, angulo: { texto: 'θ' } })) },
        { titulo: 'La flecha, en dos', texto: ['Como en Vectores, esa flecha se parte en dos componentes: ', Mv0x, ', de lado, y ', Mv0y, ', hacia arriba. El triángulo que forman tiene a θ en la esquina de salida.'],
          dibujo: tiroH(Object.assign({}, CANCHA, { ancho: 14, techo: 9, vx: 12, vy: 16, t: 0, flecha: false, angulo: { texto: 'θ' }, flechas: { en: [0], kv: 5, textos: { vx: 'v_0x', vy: 'v_0y', v: 'v₀' } } })) },
        { titulo: 'Dos palabras', texto: 'Algo lanzado que, después de salir, solo siente la gravedad es un proyectil. Si sale con ángulo, hace un tiro parabólico: sube, llega a lo más alto y baja más allá.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir la rapidez y el ángulo de la patada. La lectura dice con cuánto sube y con cuánto avanza. Mira el reloj: ¿cuál de las dos partes cambia lo que dura el vuelo?' },
      ],
    },
    ejemplos: EJEMPLOS_OBLICUO,
    juega: {
      pieza: 'fis-tiro',
      consigna: 'El arquero patea la pelota desde el piso de la cancha. Tú eliges con qué rapidez y con qué ángulo sale.',
      mision: {
        texto: 'Haz que la pelota tarde justo 4 s en volver al piso.',
        // Solo 25 m/s con 53° sube con 20 m/s: 2 s de subida y 2 s de bajada. El reloj no cuenta.
        logrado: val => Math.abs(comp(val.v0, val.ang).vy - 20) < 1e-9,
        bien: 'Lo que sube es 20 m/s: 2 s de subida y 2 s de bajada.',
      },
      voz: 'Cambia el ángulo y mira el reloj: ¿cuánto dura el vuelo cuando sube con más rapidez?',
      leyenda: [
        { s: [Mv0], t: 'la rapidez con que sale la pelota' },
        { s: 'θ', t: 'el ángulo de la patada, sobre el piso' },
        { s: [Mt], t: 'el reloj: segundos desde la patada' },
        { s: [Mx], t: 'cuánto avanzó de lado, en metros' },
        { s: [My], t: 'a qué altura va, sobre el piso' },
        { s: 'pelota tenue', t: 'dónde estaba cada segundo' },
      ],
      controles: CTRL_A3,
      dibujo: juegoA3,
      // La lectura da las dos partes de la salida; no dice cuánto vuela ni qué rapidez tiene arriba (eso es Predice).
      lectura: val => { const c = comp(val.v0, val.ang); return ['Sube con ', pv(ms(c.vy)), ' y avanza con ', pv(ms(c.vx))]; },
      resumen: { v0: 20, ang: 37, t: 1.2 },
      minimo: 3,
      // Gesto directo: la punta de la flecha de salida da la rapidez (su largo) y el ángulo (su inclinación) a la vez.
      arrastres: [{ id: 'salida', etiqueta: 'rapidez y ángulo de la patada (punta de la flecha)', color: 'c-o',
        donde: val => puntaSalida(juegoA3(val).datos),
        mover: (q, val) => masCerca(CTRL_A3[0], CTRL_A3[1], (a, b) => puntaSalida(juegoA3({ v0: a, ang: b, t: val.t }).datos), q) }],
    },
    predice: {
      pregunta: ['La pelota sale a ', pv('25 m/s'), ' con 53°. En su punto más alto, ¿con qué rapidez se mueve?'],
      datos: ['sen 53° = 4/5 y cos 53° = 3/5 (convención del examen).', 'Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: '15 m/s', correcta: true },
        { id: 'cero', texto: '0: arriba se detiene un instante', error: 'TP-CIMA-0', siFuera: 'Hacia arriba sí deja de subir un instante. De lado sigue avanzando igual que al salir.' },
        { id: 'igual', texto: '25 m/s', error: 'TP-V-CONSTANTE', siFuera: 'De lado no cambia, cierto. Pero la parte que sube se va gastando hasta la cima.' },
        { id: 'sube', texto: '20 m/s', error: 'TP-COMPONENTE', siFuera: 'Esa es la parte que sube al salir. En la cima esa parte ya vale cero.' },
      ],
      dibujo: tiroH(Object.assign({}, CANCHA, { vx: 15, vy: 20, t: 0, camino: 'entero', flecha: { texto: '25 m/s' }, angulo: { texto: '53°' }, otros: [{ vx: 15, vy: 20, texto: '?' }] })),
      revelar: tiroH(MIRA_A3, { corte: 3 }),
      coincide: 'Coincide: arriba ya no sube, pero sigue avanzando de lado a 15 m/s.',
    },
    mira: {
      datos: MIRA_A3,
      pasos: [
        { estado: { corte: 0 }, texto: 'Se parte en dos. Las flechas van en m/s, no en metros.', ecuacion: [Mv0x, ' = ', pv('25'), ' · cos 53° = ', pv('15 m/s'), ';   ', Mv0y, ' = ', pv('25'), ' · sen 53° = ', pv('20 m/s')] },
        { estado: { corte: 1 }, texto: 'Al primer segundo, de lado sigue igual; hacia arriba perdió 10 m/s.', ecuacion: [Mvy, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('1'), ' = ', pv('10 m/s')] },
        { estado: { corte: 2 }, texto: 'A los 2 s ya no sube: está en lo más alto.', ecuacion: [Mvy, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('2'), ' = ', pv('0')] },
        { estado: { corte: 3 }, texto: 'Ahí solo le queda la parte de lado.', ecuacion: [Mv, ' = ', Mvx, ' = ', pv('15 m/s')] },
        { estado: { corte: 4 }, texto: 'Baja igual que subió: toca el piso a los 4 s.', ecuacion: [Mt, ' = ', pt('2 s'), ' + ', pt('2 s'), ' = ', pt('4 s')] },
        { estado: { corte: 5 }, texto: 'De lado avanzó parejo durante todo el vuelo.', ecuacion: [Mx, ' = ', pv('15'), ' · ', pt('4'), ' = ', px('60 m')] },
      ],
    },
    regla: {
      texto: 'Con ángulo, la rapidez de salida se parte en dos componentes. De lado avanza parejo; hacia arriba es un lanzamiento vertical. Las dos, con el mismo reloj.',
      ecuacion: [Mv0x, ' = ', Mv0, ' · cos\u00a0θ', '   ·   ', Mv0y, ' = ', Mv0, ' · sen\u00a0θ', '   ·   ', Mx, ' = ', Mv0x, ' · ', Mt, '   ·   ', My, ' = ', Mv0y, ' · ', Mt, ' − ½ · ', Mg, ' · ', Mt2],
      // Desde A3 el eje vertical apunta hacia arriba (decisión 13) y la regla traduce el «±» de la academia (propuesta §1).
      condicion: 'sin aire; eje vertical hacia arriba (al subir, velocidad positiva). La academia usa ± ½ · g · t²; aquí el eje da el signo.',
    },
    // Así se resuelve: desde una azotea (dos raíces) y la rapidez en un instante; «Ahora tú» pregunta otras cosas.
    resuelve: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [h, v0, a] = r.de(AZOTEAS), c = comp(v0, a), tv = vuelo(c.vy, h);
          return {
            enunciado: ['Desde una azotea de ', ph(`${fm(h)} m`), ' se lanza una pelota a ', pv(ms(v0)), ' con ', `${a}°`, ' hacia arriba. ¿Cuánto tarda en llegar al piso?'],
            datos: [DB.comp, trigDe(a), DB.y, DB.cuadratica, DA.g],
            dibujo: tiroH({ plataforma: 'azotea', objeto: 'pelota', alto: h, ancho: Math.max(c.vx * tv * 1.15, 20), vx: c.vx, vy: c.vy, t: 0, flecha: { texto: ms(v0) }, angulo: { texto: `${a}°` }, cotaAlto: { texto: `${fm(h)} m` } }),
            pasos: [
              { tipo: 'pide', texto: ['Piden el tiempo ', Mt, ' hasta el piso, que está ', ph(`${fm(h)} m`), ' más abajo que la salida.'] },
              { tipo: 'datos', texto: ['Sale a ', pv(ms(v0)), ' con ', `${a}°`, ': sube con ', pv(ms(c.vy)), '.'], ecuacion: [Mv0y, ' = ', pv(fm(v0)), ' · ', fun(a, 'sen'), ' = ', pv(ms(c.vy))] },
              { tipo: 'regla', texto: 'Hacia arriba es un lanzamiento vertical. Con el eje hacia arriba, el piso está en y negativa.', ecuacion: [My, ' = ', Mv0y, ' · ', Mt, ' − ½ · ', Mg, ' · ', Mt2] },
              { tipo: 'cuentas', texto: 'Se iguala a la altura del piso y se resuelve la ecuación de segundo grado:',
                ecuacion: ['−', ph(fm(h)), ' = ', pv(fm(c.vy)), ' · ', Mt, ' − 5 · ', Mt2, '   →   5', Mt2, ' − ', pv(fm(c.vy)), Mt, ' − ', ph(fm(h)), ' = 0   →   ', Mt, ' = ', pt(`${fm(tv)} s`)] },
              { tipo: 'sentido', texto: `La otra raíz sale negativa: es antes del lanzamiento. Tarda más que si cayera desde el reposo, porque primero sube.` },
            ],
            respuesta: ['Llega al piso a los ', pt(`${fm(tv)} s`)],
          };
        }
        const [v0, a, ti] = r.de(INSTANTES), c = comp(v0, a), wy = c.vy - G * ti, w = Math.hypot(c.vx, wy);
        return {
          enunciado: ['Una pelota sale del piso a ', pv(ms(v0)), ' con ', `${a}°`, '. ¿Con qué rapidez se mueve ', pt(`${fm(ti)} s`), ' después?'],
          datos: [DB.comp, trigDe(a), DB.vyt, DB.rap, DA.g],
          dibujo: figPatada(v0, a),
          pasos: [
            { tipo: 'pide', texto: ['Piden la rapidez ', Mv, ' a los ', pt(`${fm(ti)} s`), ': el largo de la flecha de la velocidad.'] },
            { tipo: 'datos', texto: 'Las dos partes de la salida:', ecuacion: [Mv0x, ' = ', pv(ms(c.vx)), ';   ', Mv0y, ' = ', pv(ms(c.vy))] },
            { tipo: 'regla', texto: 'De lado no cambia; hacia arriba pierde 10 m/s cada segundo. Las dos se juntan con Pitágoras.', ecuacion: [Mvy, ' = ', Mv0y, ' − ', Mg, ' · ', Mt, ';   ', Mv, ' = ', raiz([cuadrado(Mvx), ' + ', cuadrado(Mvy)])] },
            { tipo: 'cuentas', texto: 'A ese instante:', ecuacion: [Mvy, ' = ', pv(fm(c.vy)), ' − ', pa('10'), ' · ', pt(fm(ti)), ' = ', pv(ms(wy)), ';   ', Mv, ' = ', raiz([cuadrado(pv(fm(c.vx))), ' + ', cuadrado(pv(fm(Math.abs(wy))))]), ' ≈ ', pv(ms(w))] },
            { tipo: 'sentido', texto: wy > 1e-9 ? 'Todavía sube: va más lento que al salir.' : wy < -1e-9 ? 'Ya baja: la velocidad vertical es negativa, pero su cuadrado no.' : 'Está en lo más alto: solo queda la parte de lado.' },
          ],
          respuesta: ['Va a ', pv(ms(w))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 77), k = sm % 4, [v0, a] = r.de(PATADAS), c = comp(v0, a), tv = vuelo(c.vy);
        const pat = ['Una pelota se patea desde el piso a ', pv(ms(v0)), ' con ', `${a}°`, '.'];
        if (k === 0) {
          const lado = r() < 0.5, ok = lado ? c.vx : c.vy, otra = lado ? c.vy : c.vx;
          return {
            pregunta: [...pat, lado ? ' ¿Cuánto vale su velocidad horizontal al salir?' : ' ¿Con qué velocidad vertical sale?'],
            datos: [DB.comp, trigDe(a)],
            dibujo: figPatada(v0, a),
            opciones: opciones(ok, [
              { id: 'cambia', valor: otra, error: 'TP-SENCOS', siFuera: lado ? 'Bien partir la rapidez. Pero de lado va el coseno; el seno es lo que sube.' : 'Bien partir la rapidez. Pero lo que sube lleva el seno; el coseno es de lado.' },
              { id: 'entera', valor: v0, error: 'TP-V0', siFuera: 'Esa es la rapidez entera. Cada parte es más chica: se multiplica por seno o coseno.' },
              { id: 'mitad', valor: v0 / 2, error: 'TP-MITAD', siFuera: 'Bien que cada parte sea menor. Pero no se reparte por mitades: depende del ángulo.' },
            ], q => ms(q)),
            solucion: { texto: lado ? 'De lado va la parte del coseno.' : 'Hacia arriba va la parte del seno.', ecuacion: [lado ? Mv0x : Mv0y, ' = ', pv(fm(v0)), ' · ', fun(a, lado ? 'cos' : 'sen'), ' = ', pv(ms(ok))] },
          };
        }
        if (k === 1) return {
          pregunta: [...pat, ' ¿Cuánto tiempo está en el aire?'],
          datos: [DB.comp, trigDe(a), DB.y, DA.g],
          dibujo: figPatada(v0, a),
          opciones: opciones(tv, [
            { id: 'subida', valor: c.vy / G, error: 'TP-SUBIDA', siFuera: 'Bien con la parte que sube. Pero eso es hasta lo más alto: falta la bajada.' },
            { id: 'v0', valor: 2 * v0 / G, error: 'TP-V0', siFuera: 'Eso sería lanzándola recto hacia arriba. Solo sube su parte vertical.' },
            { id: 'lado', valor: 2 * c.vx / G, error: 'TP-SENCOS', siFuera: 'Bien la subida y la bajada. Pero el vuelo lo decide lo que sube, no lo de lado.' },
          ], q => `${fm(q)} s`),
          solucion: { texto: `Sube con ${ms(c.vy)}; vuelve al piso cuando y = 0.`, ecuacion: ['0 = ', pv(fm(c.vy)), ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mt, ' = ', pt(`${fm(tv)} s`)] },
        };
        if (k === 2) {
          const ti = r.de([0.5, 1, 1.5, 2].filter(q => q < tv - 0.2)), yy = c.vy * ti - G * ti * ti / 2;
          return {
            pregunta: [...pat, ' ¿A qué altura está ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DB.comp, trigDe(a), DB.y, DA.g],
            dibujo: figPatada(v0, a),
            opciones: opciones(yy, [
              { id: 'sin-g', valor: c.vy * ti, error: 'TP-SIN-G', siFuera: 'Bien lo que sube por su velocidad. Pero la gravedad le quita ½·g·t².' },
              { id: 'sin-medio', valor: c.vy * ti - G * ti * ti > 0 ? c.vy * ti - G * ti * ti : NaN, error: 'TP-SIN-MEDIO', siFuera: 'Bien restar lo que quita la gravedad. Pero es ½·g·t², con el ½.' },
              { id: 'v0', valor: v0 * ti - G * ti * ti / 2, error: 'TP-V0', siFuera: 'Bien la ecuación. Pero hacia arriba solo sube la parte vertical, no la rapidez entera.' },
              { id: 'lado', valor: c.vx * ti - G * ti * ti / 2 > 0 ? c.vx * ti - G * ti * ti / 2 : NaN, error: 'TP-SENCOS', siFuera: 'Bien la ecuación. Pero lo que sube lleva el seno, no el coseno.' },
            ], q => `${fm(q)} m`),
            solucion: { texto: `Sube con ${ms(c.vy)}; la gravedad le quita ½·g·t².`, ecuacion: [My, ' = ', pv(fm(c.vy)), ' · ', pt(fm(ti)), ' − 5 · ', cuadrado(pt(fm(ti))), ' = ', ph(`${fm(yy)} m`)] },
          };
        }
        // Nivel examen (San Marcos 2022, 85): el tiempo de vuelo con lo que avanza de lado.
        const R = c.vx * tv;
        return {
          pregunta: ['Una pelota pateada a ', pv(ms(v0)), ' con ', `${a}°`, ' cae a ', px(`${fm(R)} m`), ' de donde salió. ¿Cuánto tiempo estuvo en el aire?'],
          datos: [DB.comp, trigDe(a), DB.x],
          dibujo: figPatada(v0, a, { cotaAlcance: { texto: `${fm(R)} m`, hasta: R } }),
          opciones: opciones(tv, [
            { id: 'total', valor: R / v0, error: 'TP-V0', siFuera: 'Bien dividir lo que avanza entre una rapidez. Pero de lado solo va la parte horizontal.' },
            { id: 'sube', valor: R / c.vy, error: 'TP-SENCOS', siFuera: 'Bien dividir lo que avanza entre una rapidez. Pero de lado va el coseno, no el seno.' },
            { id: 'subida', valor: tv / 2, error: 'TP-SUBIDA', siFuera: 'Bien el camino. Pero ese es solo el tiempo de subida: el vuelo dura el doble.' },
          ], q => `${fm(q)} s`),
          solucion: { texto: `De lado avanza parejo, a ${ms(c.vx)}, todo el vuelo.`, ecuacion: [Mt, ' = ', { frac: [px(fm(R)), pv(fm(c.vx))] }, ' = ', pt(`${fm(tv)} s`)] },
        };
      },
    },
  };


  // ---------- Idea 4 (A4): altura máxima y alcance (fase 3, 19 nov) ----------
  // Pieza fis-tiro (plataforma 'manguera'): el chorro de la manguera del jardinero de la plaza, que riega una planta.
  // Cambia: la inclinación de la boquilla · Permanece: la rapidez del agua, 10 m/s, y la planta a 8,66 m · Progresa: la
  // altura y el alcance del chorro · Se reserva: qué pasa al doble de rapidez (Predice) · Debe verse: dos ángulos que
  // suman 90° riegan la misma planta; 45° llega más lejos.
  const sen = a => (SEN[a] !== undefined ? SEN[a] : Math.sin(rad(a))), cos = a => (COS[a] !== undefined ? COS[a] : Math.cos(rad(a)));
  const medidas = (v0, a) => { const vx = v0 * cos(a), vy = v0 * sen(a), ts = vy / G; return { vx, vy, ts, tv: 2 * ts, H: vy * vy / (2 * G), R: vx * 2 * ts }; };
  DB.v2 = ['Velocidad vertical y altura, con el eje hacia arriba: ', cuadrado(Mvy), ' = ', cuadrado(Mv0y), ' − 2 · ', Mg, ' · ', My];
  const V_AGUA = 10, ANGS4 = [15, 30, 45, 60, 75], PLANTA = medidas(V_AGUA, 30).R;   // 8,66 m: donde cae el agua a 30°
  const MANGUERA = { plataforma: 'manguera', objeto: 'agua', ancho: 10.6, techo: 4.8, altoMax: 150 };
  const juegoA4 = val => { const m = medidas(V_AGUA, val.ang);
    return tiroH(Object.assign({}, MANGUERA, { vx: m.vx, vy: m.vy, t: 0, flecha: { texto: '10 m/s' }, angulo: { texto: `${val.ang}°` }, blanco: { en: PLANTA, tipo: 'planta' },
      cotaH: { texto: 'H' }, cotaAlcance: { texto: 'R', hasta: m.R } })); };
  const CTRL_A4 = [{ id: 'ang', etiqueta: 'Ángulo, θ', opciones: ANGS4.map(k => ({ valor: k, texto: `${k}°` })), inicio: 30 }];
  // El ángulo que señala un punto, visto desde donde sale el agua: el de la lista más cercano.
  const anguloDe = (q, val) => { const g0 = Kit.piezas['fis-tiro'].geometria(juegoA4(val).datos), a = Math.atan2(g0.YL - q.y, q.x - g0.XL) * 180 / Math.PI;
    return ANGS4.reduce((m, k) => (Math.abs(k - a) < Math.abs(m - a) ? k : m), ANGS4[0]); };
  // Mira: a 10 m/s y 30° (sube 0,5 s y 1,25 m, cae a 8,66 m); al doble de rapidez, 1 s, 5 m y 34,64 m.
  const R10 = medidas(10, 30), R20 = medidas(20, 30);
  const MIRA_A4 = Object.assign({}, MANGUERA, { vx: R10.vx, vy: R10.vy, t: 0, flecha: { texto: '10 m/s' }, angulo: { texto: '30°' },
    cortes: [{ cotaH: false }, { cotaH: { texto: '1,25 m' } }, { cotaH: { texto: '1,25 m' }, cotaAlcance: { texto: '8,66 m', hasta: R10.R } },
      { ancho: 37, techo: 5.4, vx: R20.vx, vy: R20.vy, flecha: { texto: '20 m/s' }, otros: [{ vx: R10.vx, vy: R10.vy }], blanco: { en: PLANTA, tipo: 'planta' }, cotaH: { texto: '5 m' } },
      { ancho: 37, techo: 5.4, vx: R20.vx, vy: R20.vy, flecha: { texto: '20 m/s' }, otros: [{ vx: R10.vx, vy: R10.vy }], blanco: { en: PLANTA, tipo: 'planta' }, cotaAlcance: { texto: '34,64 m', hasta: R20.R } },
      { ancho: 37, techo: 5.4, vx: R20.vx, vy: R20.vy, flecha: { texto: '20 m/s' }, otros: [{ vx: R10.vx, vy: R10.vy }], blanco: { en: PLANTA, tipo: 'planta' }, cotaAlcance: { texto: '34,64 m', hasta: R20.R } }] });

  // Ejemplos resueltos de A4. Cuentas rehechas aparte (scratchpad e5-fisica/cuentas-a2a5.js, 19 nov: el vuelo paso a paso
  // hasta que vᵧ cambia de signo y hasta que vuelve al piso): 15/10; 20·4/5; 0 = 20² − 20·H; 12·3; 2·2; 25·4/5 y 20²/20;
  // 25·4/5, 25·3/5, 2·1,5 y 20·3; 20·√2/2, 2·1,41 y 14,14·2,83; 15 y 20 a 53°; 90 = 2·(v₀/√2)²/10; 10·2√2/2 y √2;
  // 8·3²; 16²/20 − 12²/20; 24 = 0,6v₀ · 1,6v₀/10 y (0,8v₀)²/20; 30°, 45° y 60° a la misma rapidez; y cada alternativa.
  const EJEMPLOS_ALCANCE = [
    { nivel: 1, titulo: 'El tiempo de subida',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 30, vx: 8, vy: 15, flecha: false, flechas: { en: [0], kv: 2, v: false, textos: { vx: '8 m/s', vy: '15 m/s' } } }),
      enunciado: ['Una pelota sale del piso con ', pv('15 m/s'), ' hacia arriba y ', pv('8 m/s'), ' de lado. ¿Cuánto tarda en llegar a lo más alto?'],
      datos: [DB.vyt, DB.H, DA.g],
      solucion: [{ texto: ['Arriba deja de subir: ', Mvy, ' = 0. Se despeja el tiempo.'], ecuacion: ['0 = ', pv('15'), ' − ', pa('10'), ' · ', Mts, '   →   ', Mts, ' = ', pt('1,5 s')] }],
      respuesta: ['Tarda ', pt('1,5 s')] },
    { nivel: 1, titulo: 'La rapidez en la cima',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 40, vx: 16, vy: 12, flecha: { texto: '20 m/s' }, angulo: { texto: '37°' }, camino: 'entero' }),
      enunciado: ['Una pelota sale a ', pv('20 m/s'), ' con 37°. ¿Con qué rapidez pasa por lo más alto?'],
      datos: [DB.comp, DB.trig, DB.H],
      solucion: [{ texto: 'Arriba ya no sube: solo le queda la parte de lado.', ecuacion: [Mv, ' = ', Mv0x, ' = ', pv('20'), ' · ', { frac: ['4', '5'] }, ' = ', pv('16 m/s')] }],
      respuesta: ['Pasa a ', pv('16 m/s')] },
    { nivel: 1, titulo: 'La altura máxima',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 50, vx: 12, vy: 20, flecha: false, flechas: { en: [0], kv: 1.6, v: false, textos: { vx: '12 m/s', vy: '20 m/s' } }, cotaH: { texto: '?' } }),
      enunciado: ['Una pelota sale del piso con ', pv('20 m/s'), ' hacia arriba y ', pv('12 m/s'), ' de lado. ¿Qué altura máxima alcanza?'],
      datos: [DB.v2, DB.H, DA.g],
      solucion: [{ texto: 'Arriba la velocidad vertical vale cero; lo de lado no cuenta.', ecuacion: ['0 = ', cuadrado(pv('20')), ' − 2 · ', pa('10'), ' · ', MH, '   →   ', MH, ' = ', ph('20 m')] }],
      respuesta: [MH, ' = ', ph('20 m')] },
    { nivel: 1, titulo: 'El alcance',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 40, vx: 12, vy: 15, flecha: false, flechas: { en: [0], kv: 2, v: false, vy: false, textos: { vx: '12 m/s' } }, cotaAlcance: { texto: '?', hasta: 36 } }),
      enunciado: ['Una pelota avanza de lado a ', pv('12 m/s'), ' y está ', pt('3 s'), ' en el aire. ¿Cuál es su alcance?'],
      datos: [DB.x, DB.R],
      solucion: [{ texto: 'De lado avanza parejo todo el vuelo.', ecuacion: [MR, ' = ', pv('12'), ' · ', pt('3'), ' = ', px('36 m')] }],
      respuesta: [MR, ' = ', px('36 m')] },
    { nivel: 1, titulo: 'Subir y bajar',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 50, vx: 12, vy: 20, flecha: { texto: 'v₀' }, angulo: { texto: 'θ' }, camino: 'entero' }),
      enunciado: ['Una pelota pateada desde el piso tarda ', pt('2 s'), ' en llegar a lo más alto. ¿Cuánto dura todo su vuelo?'],
      datos: [DB.y, DB.H],
      solucion: [{ texto: 'Sin aire, baja hasta el piso en el mismo tiempo que subió.', ecuacion: [Mtv, ' = 2 · ', pt('2 s'), ' = ', pt('4 s')] }],
      respuesta: ['Dura ', pt('4 s')] },
    { nivel: 2, titulo: 'La altura de una patada',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 64, vx: 15, vy: 20, flecha: { texto: '25 m/s' }, angulo: { texto: '53°' }, cotaH: { texto: '?' } }),
      enunciado: ['El arquero patea la pelota a ', pv('25 m/s'), ' con 53°. ¿Qué altura máxima alcanza?'],
      datos: [DB.comp, DB.trig, DB.v2, DA.g],
      solucion: [
        { texto: 'La parte que sube:', ecuacion: [Mv0y, ' = ', pv('25'), ' · ', { frac: ['4', '5'] }, ' = ', pv('20 m/s')] },
        { texto: 'Arriba la velocidad vertical vale cero:', ecuacion: ['0 = ', cuadrado(pv('20')), ' − 2 · ', pa('10'), ' · ', MH, '   →   ', MH, ' = ', ph('20 m')] },
      ],
      respuesta: [MH, ' = ', ph('20 m')] },
    { nivel: 2, titulo: 'El alcance a 37°',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 66, vx: 20, vy: 15, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' }, cotaAlcance: { texto: '?', hasta: 60 } }),
      enunciado: ['Una pelota sale del piso a ', pv('25 m/s'), ' con 37°. ¿A qué distancia cae?'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'Las dos partes de la salida:', ecuacion: [Mv0x, ' = ', pv('25'), ' · ', { frac: ['4', '5'] }, ' = ', pv('20 m/s'), ';   ', Mv0y, ' = ', pv('25'), ' · ', { frac: ['3', '5'] }, ' = ', pv('15 m/s')] },
        { texto: 'Sube 1,5 s y baja 1,5 s: vuela 3 s, y de lado avanza:', ecuacion: [Mtv, ' = ', pt('3 s'), ';   ', MR, ' = ', pv('20'), ' · ', pt('3'), ' = ', px('60 m')] },
      ],
      respuesta: [MR, ' = ', px('60 m')] },
    { nivel: 2, titulo: 'A 45 grados',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 44, vx: 20 * COS[45], vy: 20 * SEN[45], flecha: { texto: '20 m/s' }, angulo: { texto: '45°' }, cotaAlcance: { texto: '?', hasta: 40 } }),
      enunciado: ['Una pelota sale del piso a ', pv('20 m/s'), ' con 45°. ¿A qué distancia cae?'],
      datos: [DB.comp, DB.trig45, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'A 45° las dos partes miden lo mismo:', ecuacion: [Mv0x, ' = ', Mv0y, ' = ', pv('20'), ' · ', { frac: ['√2', '2'] }, ' = ', pv('10√2 m/s')] },
        { texto: ['Vuelve al piso cuando ', My, ' = 0:'], ecuacion: ['0 = ', pv('10√2'), ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mtv, ' = ', { frac: [pv('10√2'), '5'] }, ' = ', pt('2√2 s')] },
        { texto: 'En ese tiempo, de lado avanza:', ecuacion: [MR, ' = ', pv('10√2'), ' · ', pt('2√2'), ' = ', px('40 m')] },
      ],
      respuesta: [MR, ' = ', px('40 m')] },
    { nivel: 2, titulo: '37° y 53°, la misma rapidez',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 64, vx: 15, vy: 20, flecha: { texto: '25 m/s' }, angulo: { texto: '53°' }, otros: [{ vx: 20, vy: 15 }], camino: 'entero' }),
      enunciado: ['A ', pv('25 m/s'), ' con 37°, una pelota cae a ', px('60 m'), '. Con la misma rapidez y 53°, ¿a qué distancia cae?'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'A 53° se intercambian las partes: sube con 20 m/s y avanza con 15 m/s.', ecuacion: [Mv0x, ' = ', pv('15 m/s'), ';   ', Mv0y, ' = ', pv('20 m/s')] },
        { texto: 'Sube más tiempo, pero avanza más lento:', ecuacion: [Mtv, ' = ', pt('4 s'), ';   ', MR, ' = ', pv('15'), ' · ', pt('4'), ' = ', px('60 m')] },
      ],
      respuesta: ['También a ', px('60 m'), ': 37° y 53° suman 90°'] },
    { nivel: 2, titulo: 'La rapidez desde el alcance',
      figura: fig({ plataforma: 'piso', objeto: 'piedra', ancho: 96, vx: 30 * COS[45], vy: 30 * SEN[45], flecha: { texto: '?' }, angulo: { texto: '45°' }, cotaAlcance: { texto: '90 m', hasta: 90 } }),
      enunciado: ['Con una huaraca se lanza una piedra desde el piso con 45°, y cae a ', px('90 m'), '. ¿Con qué rapidez salió?'],
      datos: [DB.comp, DB.trig45, DB.x, DB.y, DA.g],
      solucion: [
        { texto: ['A 45° las dos partes son iguales, ', Mv0x, ' = ', Mv0y, ' = u. Vuela 2u/10 y avanza u por segundo:'], ecuacion: [px('90'), ' = u · ', { frac: ['2u', pa('10')] }, '   →   u² = 450   →   u = ', pv('15√2 m/s')] },
        { texto: 'Cada parte es la rapidez por √2/2:', ecuacion: [Mv0, ' = ', { frac: [pv('15√2'), '√2/2'] }, ' = ', pv('30 m/s')] },
      ],
      respuesta: ['Salió a ', pv('30 m/s')] },
    { nivel: 3, titulo: 'El ángulo del mayor alcance',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 44, vx: 20 * COS[45], vy: 20 * SEN[45], flecha: { texto: '?' }, angulo: { texto: 'θ' }, camino: 'entero' }),
      enunciado: ['Una pelota se patea con el ángulo que le da el mayor alcance y está ', pt('2√2 s'), ' en el aire. ¿Con qué rapidez salió?'],
      alternativas: ['10√2 m/s', '20 m/s', '20√2 m/s', '40 m/s', '10 m/s'],
      datos: [DB.comp, DB.trig45, DB.y, DA.g],
      solucion: [
        { texto: 'El mayor alcance es a 45°. Sube la mitad del vuelo, √2 s; arriba la velocidad vertical vale cero:', ecuacion: [Mv0y, ' = ', pa('10'), ' · ', pt('√2'), ' = ', pv('10√2 m/s')] },
        { texto: 'A 45°, esa parte es la rapidez por √2/2:', ecuacion: [Mv0, ' = ', { frac: [pv('10√2'), '√2/2'] }, ' = ', pv('20 m/s')] },
        { texto: [neg('A'), ' da solo lo que sube; ', neg('C'), ' toma todo el vuelo como subida y da lo que sube; ', neg('D'), ' toma todo el vuelo como subida; ', neg('E'), ' multiplica por √2/2.'] },
      ],
      respuesta: [neg('B'), ', ', pv('20 m/s')] },
    { nivel: 3, titulo: 'Al triple de rapidez',
      // El ángulo que da 8 m a 10 m/s tiene tan θ = 1/2 (8 = 2 · vₓ · v_y ÷ 10 con vₓ = 2·v_y): el chorro cae justo en la cota.
      figura: fig({ plataforma: 'manguera', objeto: 'agua', ancho: 10, vx: 20 / Math.sqrt(5), vy: 10 / Math.sqrt(5), flecha: { texto: '10 m/s' }, angulo: { texto: 'θ' }, cotaAlcance: { texto: '8 m', hasta: 8 } }),
      enunciado: ['Con cierto ángulo, el chorro de una manguera sale a ', pv('10 m/s'), ' y cae a ', px('8 m'), '. Con el mismo ángulo y ', pv('30 m/s'), ', ¿a qué distancia cae?'],
      alternativas: ['24 m', '216 m', '8 m', '72 m', '48 m'],
      datos: [DB.comp, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'Al triple de rapidez, las dos partes se triplican: sube el triple de tiempo (vuela el triple) y avanza el triple por segundo.', ecuacion: [MR, ' = (3 · ', Mv0x, ') · (3 · ', Mtv, ') = 9 · ', MR] },
        { texto: 'Nueve veces el alcance de antes:', ecuacion: ['9 · ', px('8'), ' = ', px('72 m')] },
        { texto: [neg('A'), ' triplica el alcance; ', neg('B'), ' eleva al cubo; ', neg('C'), ' cree que solo cuenta el ángulo; ', neg('E'), ' multiplica por 2 · 3, no por 3 · 3.'] },
      ],
      respuesta: [neg('D'), ', ', px('72 m')] },
    { nivel: 3, titulo: '¿Cuánto más sube a 53°?',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 42, vx: 12, vy: 16, flecha: { texto: '20 m/s' }, angulo: { texto: '53°' }, otros: [{ vx: 16, vy: 12 }], camino: 'entero' }),
      enunciado: ['Dos pelotas salen del piso a ', pv('20 m/s'), ': una con 37° y otra con 53°. ¿Cuánto más alto sube la de 53°?'],
      alternativas: ['5,6 m', '0 m: suben igual', '12,8 m', '4 m', '16 m'],
      datos: [DB.comp, DB.trig, DB.v2, DA.g],
      solucion: [
        { texto: 'Lo que sube cada una: 16 m/s a 53° y 12 m/s a 37°. Sus alturas máximas:', ecuacion: [{ sub: [MH, '53'] }, ' = ', { frac: [cuadrado(pv('16')), '20'] }, ' = ', ph('12,8 m'), ';   ', { sub: [MH, '37'] }, ' = ', { frac: [cuadrado(pv('12')), '20'] }, ' = ', ph('7,2 m')] },
        { texto: 'La diferencia:', ecuacion: [ph('12,8'), ' − ', ph('7,2'), ' = ', ph('5,6 m')] },
        { texto: [neg('B'), ' cree que suben igual porque caen igual; ', neg('C'), ' da solo la de 53°; ', neg('D'), ' resta las velocidades; ', neg('E'), ' toma 16 m/s como altura.'] },
      ],
      respuesta: [neg('A'), ', ', ph('5,6 m')] },
    { nivel: 3, titulo: 'De la distancia a la altura',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 27, vx: Math.sqrt(250) * COS[53], vy: Math.sqrt(250) * SEN[53], flecha: { texto: 'v₀' }, angulo: { texto: '53°' }, cotaAlcance: { texto: '24 m', hasta: 24 }, cotaH: { texto: '?' } }),
      enunciado: ['Una pelota sale del piso con 53° y cae a ', px('24 m'), '. ¿Qué altura máxima alcanzó?'],
      alternativas: ['16 m', '6 m', '12 m', '4,5 m', '8 m'],
      datos: [DB.comp, DB.trig, DB.x, DB.y, DB.v2, DA.g],
      solucion: [
        { texto: ['Con la rapidez ', Mv0, ' sin conocer: avanza con 0,6', Mv0, ' y sube con 0,8', Mv0, '. Vuelve al piso cuando ', My, ' = 0:'], ecuacion: ['0 = 0,8', Mv0, ' · ', Mt, ' − 5 · ', Mt2, '   →   ', Mtv, ' = 0,16', Mv0] },
        { texto: 'Lo de lado por ese tiempo es el alcance:', ecuacion: [px('24'), ' = 0,6', Mv0, ' · 0,16', Mv0, '   →   ', cuadrado(Mv0), ' = 250'] },
        { texto: ['La altura sale de lo que sube, 0,8', Mv0, ':'], ecuacion: [MH, ' = ', { frac: [['0,64 · ', cuadrado(Mv0)], '20'] }, ' = ', { frac: ['0,64 · 250', '20'] }, ' = ', ph('8 m')] },
        { texto: [neg('A'), ' toma como vuelo solo la subida, 0,08', Mv0, '; ', neg('B'), ' lo trata como si fuera a 45°; ', neg('C'), ' da la mitad del alcance; ', neg('D'), ' usa 37°.'] },
      ],
      respuesta: [neg('E'), ', ', MH, ' = ', ph('8 m')] },
    { nivel: 3, titulo: 'Más alto no es más lejos',
      figura: fig({ plataforma: 'manguera', objeto: 'agua', ancho: 10.6, techo: 4, vx: 5, vy: 10 * SEN[60], flecha: { texto: '10 m/s' }, angulo: { texto: '60°' }, otros: [{ vx: 10 * COS[45], vy: 10 * SEN[45], texto: '45°' }, { vx: 10 * COS[30], vy: 5, texto: '30°' }] }),
      enunciado: ['El jardinero riega con el agua a ', pv('10 m/s'), ', primero a 30°, luego a 45° y luego a 60°. ¿Qué es verdad?'],
      alternativas: ['A 60° llega más lejos, porque sube más', 'A 30° llega más lejos, porque va más de lado', 'A 45° llega más lejos; 30° y 60° caen en el mismo sitio', 'Los tres caen en el mismo sitio', 'A 45° y a 60° caen en el mismo sitio'],
      datos: [DB.comp, DB.trig30, DB.trig45, DB.x, DB.y, DA.g],
      solucion: [
        { texto: 'Los tres alcances, de lado por el tiempo de vuelo:', ecuacion: [{ sub: [MR, '30'] }, ' = ', pv('8,66'), ' · ', pt('1'), ' = ', px('8,66 m'), ';   ', { sub: [MR, '45'] }, ' = ', pv('7,07'), ' · ', pt('1,41'), ' = ', px('10 m'), ';   ', { sub: [MR, '60'] }, ' = ', pv('5'), ' · ', pt('1,732'), ' = ', px('8,66 m')] },
        { texto: [neg('A'), ' confunde subir más con llegar más lejos; ', neg('B'), ' olvida que a 30° vuela poco; ', neg('D'), ' y ', neg('E'), ' no miran el ángulo.'] },
      ],
      respuesta: [neg('C'), ': a 45° llega a ', px('10 m')] },
  ];

  // Casos de «Ahora tú» y de «Así se resuelve» (listas distintas; ninguno es el chorro de Predice, 10 y 20 m/s a 30°).
  const TIROS4 = [[10, 37], [15, 37], [20, 37], [25, 37], [10, 53], [15, 53], [20, 53], [25, 53], [20, 30], [12, 30], [20, 60], [10, 60]];
  const COMPLEMENTOS = [15, 30, 37, 53, 60, 75];
  // [k, v₀]: vuela k√2 s a 45° y sale a v₀ m/s. Sin 2√2 s (es el ejemplo «El ángulo del mayor alcance») y sin patadas de
  // más de 25 m/s (decisión 14).
  const T45 = [[1, 10], [1.5, 15], [2.5, 25]];
  const RAPIDEZ37 = [10, 15, 20, 25];
  const VECES = [[3, 'el triple de esa rapidez'], [1.5, '1,5 veces esa rapidez'], [0.5, 'la mitad de esa rapidez']];
  const figTiro4 = (v0, a, extra) => { const m = medidas(v0, a); return tiroH(Object.assign({ plataforma: 'piso', objeto: 'pelota', ancho: Math.max(m.R * 1.1, 12), vx: m.vx, vy: m.vy, t: 0, flecha: { texto: ms(v0) }, angulo: { texto: `${a}°` } }, extra)); };

  const alcance = {
    id: 'altura-y-alcance',
    titulo: 'Altura máxima y alcance',
    pregunta: '¿Con qué ángulo llega más lejos el chorro de una manguera?',
    temas: ['Tiro parabólico'],
    pieza: 'fis-tiro',
    aprendizaje: 'La altura máxima sale de lo que sube; el alcance, de lo de lado por el vuelo, y es máximo a 45°.',
    actividad: 'Inclinar la manguera para regar una planta lejana.',
    lee: {
      tarjetas: [
        { titulo: 'La manguera de la plaza', texto: 'El jardinero de la plaza riega con una manguera. El agua sale de la boquilla a 10 m/s y, sin aire, cada gota hace un tiro parabólico: el chorro dibuja su trayectoria.',
          dibujo: tiroH(Object.assign({}, MANGUERA, { techo: 1.6, vx: R10.vx, vy: R10.vy, t: 0, flecha: { texto: '10 m/s' }, angulo: { texto: '30°' }, blanco: { en: PLANTA, tipo: 'planta' } })) },
        { titulo: 'Altura máxima y alcance', texto: ['Lo más alto que llega el agua sobre la boquilla es su altura máxima, ', MH, '. Hasta donde cae, medido por el piso, es su alcance, ', MR, '. El tiempo que tarda en llegar arriba es el tiempo de subida.'],
          dibujo: tiroH(Object.assign({}, MANGUERA, { techo: 1.6, vx: R10.vx, vy: R10.vy, t: 0, flecha: false, angulo: { texto: '30°' }, cotaH: { texto: 'H' }, cotaAlcance: { texto: 'R', hasta: R10.R } })) },
        { titulo: 'Qué mirar al jugar', texto: 'La rapidez del agua no cambia: solo inclinas la boquilla. La lectura dice cuánto sube el chorro y hasta dónde cae. Compara los ángulos de dos en dos.' },
      ],
    },
    ejemplos: EJEMPLOS_ALCANCE,
    juega: {
      pieza: 'fis-tiro',
      consigna: 'El agua sale de la manguera a 10 m/s. A 30°, riega justo la planta.',
      mision: {
        texto: 'Encuentra otro ángulo que riegue la misma planta.',
        // 30° y 60° caen en el mismo sitio (8,66 m); ningún otro ángulo de la lista llega ahí.
        logrado: val => val.ang === 60,
        bien: '30° y 60° suman 90°: caen en el mismo sitio, por caminos distintos.',
      },
      voz: 'Prueba los ángulos uno por uno: ¿cuál moja justo la planta?',
      leyenda: [
        { s: 'θ', t: 'el ángulo de la boquilla, sobre el piso' },
        { s: [MH], t: 'la altura máxima del chorro' },
        { s: [MR], t: 'el alcance: hasta dónde cae el agua' },
        { s: 'planta', t: 'la planta que hay que regar' },
      ],
      controles: CTRL_A4,
      dibujo: juegoA4,
      lectura: val => { const m = medidas(V_AGUA, val.ang); return ['Sube ', ph(`${fm(m.H)} m`), ' y cae a ', px(`${fm(m.R)} m`)]; },
      resumen: { ang: 45 },
      minimo: 3,
      // Gesto directo: la punta de la flecha del agua se arrastra para inclinar la boquilla.
      arrastres: [{ id: 'boquilla', etiqueta: 'inclinación de la boquilla (punta de la flecha)', color: 'c-o',
        donde: val => puntaSalida(juegoA4(val).datos), mover: (q, val) => ({ ang: anguloDe(q, val) }) }],
    },
    predice: {
      pregunta: 'Si el agua sale de la manguera al doble de rapidez, con el mismo ángulo, ¿cuánto más lejos llega?',
      datos: ['En el juego, a 10 m/s y 30°, llegó a 8,66 m.', 'Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: 'Cuatro veces más lejos', correcta: true },
        { id: 'doble', texto: 'El doble de lejos', error: 'PR1-alcance', siFuera: 'Avanza el doble por segundo, cierto. Pero además sube más rápido: vuela más tiempo.' },
        { id: 'igual', texto: 'Igual de lejos: el ángulo no cambió', error: 'TP-SOLO-ANGULO', siFuera: 'El ángulo decide la forma del chorro. La rapidez decide su tamaño.' },
        { id: 'ocho', texto: 'Ocho veces más lejos', error: 'PR-CUBO', siFuera: 'Bien que crezca más que el doble. Pero solo se duplican dos cosas: el tiempo y el avance.' },
      ],
      dibujo: tiroH(Object.assign({}, MANGUERA, { techo: 1.6, vx: R10.vx, vy: R10.vy, t: 0, flecha: { texto: '10 m/s' }, angulo: { texto: '30°' }, blanco: { en: PLANTA, tipo: 'planta' }, cotaAlcance: { texto: '8,66 m', hasta: R10.R } })),
      revelar: tiroH(MIRA_A4, { corte: 4 }),
      coincide: 'Coincide: vuela el doble de tiempo y avanza el doble cada segundo.',
    },
    mira: {
      datos: MIRA_A4,
      pasos: [
        { estado: { corte: 0 }, texto: 'Sube con 5 m/s; g = 10 m/s² lo frena.',
          ecuacion: [Mv0y, ' = ', pv('10'), ' · sen 30° = ', pv('5 m/s'), ';   ', Mts, ' = ', { frac: [pv('5'), pa('10')] }, ' = ', pt('0,5 s')] },
        { estado: { corte: 1 }, texto: 'Arriba la velocidad vertical es cero. La altura máxima:', ecuacion: [MH, ' = ', pv('5'), ' · ', pt('0,5'), ' − 5 · ', cuadrado(pt('0,5')), ' = ', ph('1,25 m')] },
        { estado: { corte: 2 }, texto: 'Baja en otros 0,5 s: vuela 1 s, avanzando 8,66 m/s de lado.', ecuacion: [MR, ' = ', pv('8,66'), ' · ', pt('1'), ' = ', px('8,66 m')] },
        { estado: { corte: 3 }, texto: 'Al doble de rapidez, sube con 10 m/s: llega arriba en 1 s.', ecuacion: [Mtv, ' = 2 · ', pt('1 s'), ' = ', pt('2 s')] },
        { estado: { corte: 4 }, texto: 'Doble de tiempo y doble de avance cada segundo: cuatro veces más lejos.', ecuacion: [MR, ' = ', pv('17,32'), ' · ', pt('2'), ' = ', px('34,64 m')] },
        { estado: { corte: 5 }, texto: 'Juntando los pasos sale una fórmula práctica: el alcance máximo es a 45°.', ecuacion: [MR, ' = ', { frac: [[cuadrado(Mv0), ' · sen 2θ'], Mg] }] },
      ],
    },
    regla: {
      texto: 'Arriba la velocidad vertical es cero: de ahí salen el tiempo de subida y la altura máxima. El alcance es lo de lado por el vuelo; es máximo a 45°.',
      ecuacion: [MH, ' = ', { frac: [cuadrado(Mv0y), ['2', Mg]] }, '   ·   ', MR, ' = ', Mv0x, ' · ', { llave: [Mtv], nota: 'tiempo de vuelo', color: 'c-i' }, '   ·   ', MR, ' = ', { frac: [[cuadrado(Mv0), ' · sen 2θ'], Mg] }],
      condicion: 'sale del piso y cae al mismo nivel, sin aire; eje vertical hacia arriba. Ángulos complementarios (suman 90°) dan el mismo alcance.',
    },
    // Así se resuelve: la rapidez con el alcance a 37° (y su complementario) y el alcance a otra rapidez.
    resuelve: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const v0 = r.de(RAPIDEZ37), m = medidas(v0, 37);
          return {
            enunciado: ['Una pelota sale del piso con 37° y cae a ', px(`${fm(m.R)} m`), '. ¿Con qué rapidez salió, y con qué otro ángulo caería en el mismo sitio?'],
            datos: [DB.comp, DB.trig, DB.x, DB.y, DA.g],
            dibujo: figTiro4(v0, 37, { flecha: { texto: '?' }, cotaAlcance: { texto: `${fm(m.R)} m`, hasta: m.R } }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la rapidez de salida, ', Mv0, ', y el ángulo que da el mismo alcance.'] },
              { tipo: 'datos', texto: ['Sale con 37° y avanza ', px(`${fm(m.R)} m`), ' antes de volver al piso.'] },
              { tipo: 'regla', texto: 'El alcance es lo de lado por el tiempo de vuelo, y el vuelo dura el doble de la subida.', ecuacion: [MR, ' = ', Mv0x, ' · ', Mtv, ';   ', Mtv, ' = 2 · ', { frac: [Mv0y, Mg] }] },
              { tipo: 'cuentas', texto: 'Con 0,8v₀ de lado y 0,6v₀ hacia arriba:', ecuacion: [px(fm(m.R)), ' = 0,8', Mv0, ' · ', { frac: ['2 · 0,6' , pa('10')] }, Mv0, ' = 0,096 · ', cuadrado(Mv0), '   →   ', Mv0, ' = ', pv(ms(v0))] },
              { tipo: 'sentido', texto: 'A 53° se intercambian el seno y el coseno: el producto es el mismo, y cae en el mismo sitio. 37° y 53° suman 90°.' },
            ],
            respuesta: ['Salió a ', pv(ms(v0)), '; a 53° cae en el mismo sitio'],
          };
        }
        const [v0, a] = r.de([[10, 53], [20, 37], [12, 30], [10, 60], [20, 53], [15, 37]]), [k, cuanto] = r.de(VECES), m = medidas(v0, a), R2 = visto(m.R) * k * k;
        return {
          enunciado: ['A ', pv(ms(v0)), ' con ', `${a}°`, ', una pelota cae a ', px(`${fm(m.R)} m`), '. Con el mismo ángulo y ', cuanto, ', ¿a qué distancia cae?'],
          datos: [DB.comp, DB.x, DB.y, DA.g],
          dibujo: figTiro4(v0, a, { cotaAlcance: { texto: `${fm(m.R)} m`, hasta: m.R } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el nuevo alcance, ', MR, ', con la rapidez multiplicada por ', fm(k), '.'] },
            { tipo: 'datos', texto: ['A ', pv(ms(v0)), ' cae a ', px(`${fm(m.R)} m`), '; el ángulo no cambia.'] },
            { tipo: 'regla', texto: 'El alcance es lo de lado por el tiempo de vuelo. Las dos partes de la salida cambian con la rapidez.', ecuacion: [MR, ' = ', Mv0x, ' · ', Mtv] },
            { tipo: 'cuentas', texto: `Lo de lado se multiplica por ${fm(k)}; lo que sube también, y con él el tiempo de vuelo:`, ecuacion: [MR, ' = ', fm(k), ' · ', fm(k), ' · ', px(fm(m.R)), ' = ', px(`${fm(R2)} m`)] },
            { tipo: 'sentido', texto: k > 1 ? 'Crece más que la rapidez: con el cuadrado de cuántas veces cambió.' : 'Con la mitad de rapidez, cae a la cuarta parte: también con el cuadrado.' },
          ],
          respuesta: ['Cae a ', px(`${fm(R2)} m`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 41), k = sm % 4, [v0, a] = r.de(TIROS4), m = medidas(v0, a);
        const pat = ['Una pelota sale del piso a ', pv(ms(v0)), ' con ', `${a}°`, '.'];
        if (k === 0) return {
          pregunta: [...pat, ' ¿Qué altura máxima alcanza?'],
          datos: [DB.comp, trigDe(a), DB.v2, DA.g],
          dibujo: figTiro4(v0, a, { cotaH: { texto: '?' } }),
          opciones: opciones(m.H, [
            { id: 'sin-dos', valor: m.vy * m.vy / G, error: 'TP-MEDIO', siFuera: 'Bien con lo que sube, al cuadrado. Pero se divide entre 2g, no solo entre g.' },
            { id: 'v0', valor: v0 * v0 / (2 * G), error: 'TP-V0', siFuera: 'Esa sería la altura lanzándola recto hacia arriba. Solo sube su parte vertical.' },
            { id: 'lado', valor: m.vx * m.vx / (2 * G), error: 'TP-SENCOS', siFuera: 'Bien la cuenta. Pero la altura la da lo que sube (el seno), no lo de lado.' },
            { id: 'tiempo', valor: m.ts, error: 'TP-TIEMPO', siFuera: 'Ese es el tiempo de subida, en segundos. La altura sale de él con otra cuenta.' },
          ], q => `${fm(q)} m`),
          solucion: { texto: `Sube con ${ms(m.vy)}; arriba la velocidad vertical vale cero.`, ecuacion: ['0 = ', cuadrado(pv(fm(m.vy))), ' − 2 · ', pa('10'), ' · ', MH, '   →   ', MH, ' = ', ph(`${fm(m.H)} m`)] },
        };
        if (k === 1) return {
          pregunta: [...pat, ' ¿A qué distancia cae?'],
          datos: [DB.comp, trigDe(a), DB.x, DB.y, DA.g],
          dibujo: figTiro4(v0, a, { cotaAlcance: { texto: '?', hasta: m.R } }),
          opciones: opciones(m.R, [
            { id: 'mitad', valor: m.R / 2, error: 'TP-SUBIDA', siFuera: 'Bien lo de lado por un tiempo. Pero ese es solo el de subida: falta la bajada.' },
            { id: 'v0', valor: v0 * m.tv, error: 'TP-V0', siFuera: 'Bien el tiempo de vuelo. Pero de lado avanza solo con su parte horizontal.' },
            { id: 'sube', valor: m.vy * m.tv, error: 'TP-SENCOS', siFuera: 'Bien el tiempo de vuelo. Pero de lado va el coseno, no la parte que sube.' },
            { id: 'altura', valor: m.H, error: 'TP-ALTURA', siFuera: 'Esa es la altura máxima. El alcance se mide por el piso.' },
          ], q => `${fm(q)} m`),
          solucion: { texto: `Vuela ${fmFactor(m.tv)} s, avanzando ${ms(m.vx)} de lado.`, ecuacion: [MR, ' = ', pv(fm(m.vx)), ' · ', pt(fmFactor(m.tv)), ' = ', px(`${fm(m.R)} m`)] },
        };
        if (k === 2) {
          const b = r.de(COMPLEMENTOS), w = r.de([10, 20]), mb = medidas(w, b);
          return {
            pregunta: ['Una pelota sale del piso a ', pv(ms(w)), ' con ', `${b}°`, ' y cae a ', px(`${fm(mb.R)} m`), '. ¿Con qué otro ángulo, a la misma rapidez, cae en el mismo sitio?'],
            datos: [DB.comp, [MR, ' = ', Mv0x, ' · ', Mtv], 'Sin resistencia del aire; el piso es plano.'],
            dibujo: figTiro4(w, b, { cotaAlcance: { texto: `${fm(mb.R)} m`, hasta: mb.R } }),
            opciones: opciones(90 - b, [
              { id: 'doble', valor: 2 * b < 90 ? 2 * b : NaN, error: 'TP-DOBLE', siFuera: 'Bien buscar otro ángulo. Pero el doble sube más y avanza menos: no cuadra.' },
              { id: 'suple', valor: 180 - b, error: 'TP-SUPLEMENTO', siFuera: 'Bien que sumen algo. Pero ese ángulo apunta hacia atrás; es 90° lo que suman.' },
              { id: 'a45', valor: 45, error: 'TP-45', siFuera: 'A 45° llega más lejos que con cualquier otro: no al mismo sitio.' },
              { id: 'mitad', valor: b / 2, error: 'TP-MITAD-ANG', siFuera: 'Bien buscar otro ángulo. Pero a la mitad cae más cerca.' },
            ], q => `${fm(q)}°`),
            solucion: { texto: 'Con el ángulo que completa 90° se intercambian seno y coseno: el alcance es el mismo.', ecuacion: ['90° − ', `${b}°`, ' = ', `${90 - b}°`] },
          };
        }
        // Nivel examen (San Marcos 2026-I, 89): el ángulo del mayor alcance y el tiempo de vuelo dan la rapidez.
        const [kk, w] = r.de(T45), uy = G * kk * Math.SQRT2 / 2;
        const raiz2 = q => (q === 1 ? '√2' : `${fm(q)}√2`);
        return {
          pregunta: ['Una pelota se patea con el ángulo que le da el mayor alcance y está ', pt(`${raiz2(kk)} s`), ' en el aire. ¿Con qué rapidez salió?'],
          datos: [DB.comp, DB.trig45, DB.y, DA.g],
          dibujo: figTiro4(w, 45, { flecha: { texto: '?' }, angulo: { texto: 'θ' } }),
          opciones: opciones(w, [
            { id: 'sube', valor: uy, error: 'TP-COMPONENTE', siFuera: 'Bien: eso es lo que sube. La rapidez entera es mayor: divide entre sen 45°.' },
            { id: 'todo', valor: 2 * uy, error: 'TP-SUBIDA', siFuera: 'Bien que arriba la vertical valga cero. Pero sube solo la mitad del vuelo.' },
            { id: 'por', valor: uy * Math.SQRT2 / 2, error: 'TP-SEN-POR', siFuera: 'Bien lo que sube. Pero para la rapidez entera se divide entre sen 45°, no se multiplica.' },
            { id: 'ambos', valor: 2 * w, error: 'TP-SUBIDA-V0', siFuera: 'Bien dividir entre sen 45°. Pero sube solo la mitad del vuelo.' },
          ], q => ms(q)),
          solucion: { texto: `El mayor alcance es a 45°. Sube ${raiz2(kk / 2)} s: lo que sube vale 10 por ese tiempo.`, ecuacion: [Mv0, ' = ', { frac: [pv(ms(uy)), 'sen 45°'] }, ' = ', pv(ms(w))] },
        };
      },
    },
  };


  // ---------- Idea 5 (A5): ecuaciones del movimiento en el plano (fase 3, 19 nov) ----------
  // Pieza fis-tiro (vista 'plano'): un dron sobre las calles, visto desde arriba, que sale de la plaza. Cambia: cuánto
  // avanza cada segundo hacia el este y hacia el norte · Permanece: la plaza en el origen y la antena · Progresa: el
  // reloj, que deja un dron tenue cada segundo y sus dos marcas en los ejes · Se reserva: la distancia a la plaza
  // (Predice) · Debe verse: x e y crecen a la vez, cada una con su velocidad.
  const Mx0 = { sub: [Mx, '0'] }, My0 = { sub: [My, '0'] };
  const May = { sub: [{ v: 'c-h', t: 'a', m: 'aceleración' }, 'y'] }, Max = { sub: [{ v: 'c-h', t: 'a', m: 'aceleración' }, 'x'] };
  const CALLES = { vista: 'plano', max: 80, paso: 10, numero: 20 };
  const ANTENA = { x: 30, y: 40, texto: 'antena' };
  const T_DRON = 10.5;
  const juegoA5 = val => tiroH(Object.assign({}, CALLES, { vx: val.vx, vy: val.vy, t: val.t, cada: 1, camino: true, guias: true, antena: ANTENA,
    reloj: { texto: `t = ${fm(Kit.piezas['fis-tiro'].geometria(Object.assign({}, CALLES, { vx: val.vx, vy: val.vy, t: val.t })).t)} s` } }));
  const CTRL_A5 = [
    { id: 'vx', etiqueta: 'Al este', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
    { id: 'vy', etiqueta: 'Al norte', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 5, unidad: 'm/s', decimales: 0 },
    { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_DRON, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1.5, modo: 'repite' } },
  ];
  // Predice y Mira: x = 6t e y = 8t; a los 5 s, 30 m al este y 40 m al norte: 50 m de la plaza.
  const MIRA_A5 = Object.assign({}, CALLES, { vx: 6, vy: 8, cada: 1, camino: true,
    cortes: [{ t: 0 }, { t: 1, guias: true }, { t: 5, guias: true }, { t: 5, guias: true, linea: { texto: '?' } }, { t: 5, linea: { texto: '50 m' } }, { t: 5, linea: { texto: '50 m' } }] });

  const DC = {
    x: ['Al este: ', Mx, ' = ', Mvx, ' · ', Mt, ' (sale de la plaza, x = 0)'],
    y: ['Al norte: ', My, ' = ', Mvy, ' · ', Mt, ' (sale de la plaza, y = 0)'],
    dist: DB.dist,
    recto: 'El este y el norte forman 90°.',
    tiro: ['En un tiro, ', My, ' es la altura sobre la salida: ', My, ' = ', Mv0y, ' · ', Mt, ' − ½ · ', Mg, ' · ', Mt2],
    leer: ['Ecuación de cada eje: posición = salida + velocidad · ', Mt, ' + ½ · aceleración · ', Mt2],
    vyt: DB.vyt,
  };

  // Ejemplos resueltos de A5. Cuentas rehechas aparte (scratchpad e5-fisica/cuentas-a2a5.js, 19 nov: posiciones con las
  // ecuaciones dadas y distancias medidas paso a paso, sin Pitágoras): 4·2 y 3·2; √(9² + 12²); 7; 20·2 − 5·2²; 35/5;
  // 3·4, 4·4 y √(12² + 16²); √(12² + 16²); 0 = 30t − 5t² y 8·6; 45 = 5t² y 10·3; t = x/10 en y; 4 + 4·2, 4·2² y
  // √(12² + 16²); 8/10 y 8·0,8 − 5·0,8²; t = x/5; 3·5 y 4·5 con √(15² + 20²); 20 − 10·1 y √(15² + 10²); y cada alternativa.
  const EJEMPLOS_PLANO = [
    { nivel: 1, titulo: 'Dónde está el dron',
      figura: fig({ vista: 'plano', max: 20, paso: 2, numero: 4 }),
      enunciado: ['Un dron sale de la plaza con ', Mx, ' = 4t e ', My, ' = 3t (en metros y segundos). ¿Dónde está a los ', pt('2 s'), '?'],
      datos: [DC.x, DC.y],
      solucion: [{ texto: 'Se reemplaza el tiempo en cada ecuación:', ecuacion: [Mx, ' = 4 · ', pt('2'), ' = ', px('8 m'), ';   ', My, ' = 3 · ', pt('2'), ' = ', px('6 m')] }],
      respuesta: [px('8 m'), ' al este y ', px('6 m'), ' al norte'] },
    { nivel: 1, titulo: 'La distancia a la plaza',
      figura: fig({ vista: 'plano', max: 20, paso: 2, numero: 4, vx: 9, vy: 12, t: 1, guias: true, linea: { texto: '?' } }),
      enunciado: ['Un dron está ', px('9 m'), ' al este y ', px('12 m'), ' al norte de la plaza. ¿A qué distancia de la plaza está, en línea recta?'],
      datos: [DC.dist, DC.recto],
      solucion: [{ texto: 'Las dos coordenadas son los catetos de un triángulo recto:', ecuacion: [Md, ' = ', raiz([cuadrado(px('9')), ' + ', cuadrado(px('12'))]), ' = ', raiz('225'), ' = ', px('15 m')] }],
      respuesta: [Md, ' = ', px('15 m')] },
    { nivel: 1, titulo: 'Leer la velocidad',
      figura: fig({ vista: 'plano', max: 40, paso: 5, numero: 10 }),
      enunciado: ['Un dron se mueve con ', Mx, ' = 7t (en metros y segundos). ¿Cuántos metros avanza hacia el este en cada segundo?'],
      datos: [DC.x],
      solucion: [{ texto: 'El número que multiplica a t es la velocidad de ese eje:', ecuacion: [Mx, ' = ', Mvx, ' · ', Mt, '   →   ', Mvx, ' = ', pv('7 m/s')] }],
      respuesta: [px('7 m'), ' cada segundo: ', Mvx, ' = ', pv('7 m/s')] },
    { nivel: 1, titulo: 'La altura en la ecuación',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 44, vx: 10, vy: 20, flecha: false, camino: 'entero' }),
      enunciado: ['Una pelota sigue la ecuación ', My, ' = 20t − 5t² (en metros y segundos). ¿A qué altura está a los ', pt('2 s'), '?'],
      datos: [DC.tiro],
      solucion: [{ texto: 'Se reemplaza t = 2 s:', ecuacion: [My, ' = 20 · ', pt('2'), ' − 5 · ', cuadrado(pt('2')), ' = 40 − 20 = ', ph('20 m')] }],
      respuesta: ['Está a ', ph('20 m')] },
    { nivel: 1, titulo: '¿Cuándo pasa por ahí?',
      figura: fig({ vista: 'plano', max: 40, paso: 5, numero: 10, antena: { x: 35, y: 0, texto: '35 m' } }),
      enunciado: ['Un dron sale de la plaza con ', Mx, ' = 5t (en metros y segundos). ¿En qué instante está ', px('35 m'), ' al este?'],
      datos: [DC.x],
      solucion: [{ texto: 'Se iguala la ecuación a 35 y se despeja t:', ecuacion: [px('35'), ' = 5 · ', Mt, '   →   ', Mt, ' = ', pt('7 s')] }],
      respuesta: ['A los ', pt('7 s')] },
    { nivel: 2, titulo: 'La distancia a los 4 s',
      figura: fig({ vista: 'plano', max: 18, paso: 2, numero: 6 }),
      enunciado: ['Un dron sale de la plaza con ', Mx, ' = 3t e ', My, ' = 4t (en metros y segundos). ¿A qué distancia de la plaza está a los ', pt('4 s'), '?'],
      datos: [DC.x, DC.y, DC.dist, DC.recto],
      solucion: [
        { texto: 'Dónde está a los 4 s:', ecuacion: [Mx, ' = 3 · ', pt('4'), ' = ', px('12 m'), ';   ', My, ' = 4 · ', pt('4'), ' = ', px('16 m')] },
        { texto: 'La distancia en línea recta, con Pitágoras:', ecuacion: [Md, ' = ', raiz([cuadrado(px('12')), ' + ', cuadrado(px('16'))]), ' = ', px('20 m')] },
      ],
      respuesta: [Md, ' = ', px('20 m')] },
    { nivel: 2, titulo: 'La rapidez de salida',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 44, vx: 12, vy: 16, flecha: { texto: '?' }, angulo: { texto: 'θ' } }),
      enunciado: ['Una pelota sigue ', Mx, ' = 12t e ', My, ' = 16t − 5t² (en metros y segundos). ¿Con qué rapidez salió?'],
      datos: [DC.leer, DB.rap],
      solucion: [
        { texto: 'Lo que multiplica a t en cada ecuación es la velocidad de salida de ese eje:', ecuacion: [Mv0x, ' = ', pv('12 m/s'), ';   ', Mv0y, ' = ', pv('16 m/s')] },
        { texto: 'Se juntan con Pitágoras:', ecuacion: [Mv0, ' = ', raiz([cuadrado(pv('12')), ' + ', cuadrado(pv('16'))]), ' = ', pv('20 m/s')] },
      ],
      respuesta: ['Salió a ', pv('20 m/s')] },
    { nivel: 2, titulo: 'Dónde cae',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 52, vx: 8, vy: 30, techo: 46, flecha: false, camino: 'entero', cotaAlcance: { texto: '?', hasta: 48 } }),
      enunciado: ['Una pelota sigue ', Mx, ' = 8t e ', My, ' = 30t − 5t² (en metros y segundos, desde el piso). ¿A qué distancia de la salida vuelve al piso?'],
      datos: [DC.leer, DC.tiro],
      solucion: [
        { texto: ['Vuelve al piso cuando ', My, ' = 0:'], ecuacion: ['0 = 30', Mt, ' − 5', Mt2, ' = 5', Mt, '(6 − ', Mt, ')   →   ', Mt, ' = ', pt('6 s')] },
        { texto: 'En ese instante, de lado:', ecuacion: [Mx, ' = 8 · ', pt('6'), ' = ', px('48 m')] },
      ],
      respuesta: ['Cae a ', px('48 m')] },
    { nivel: 2, titulo: 'Desde una azotea',
      figura: fig({ plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 36, v0: 10, flecha: { texto: '10 m/s' }, cotaAlto: { texto: '45 m' } }),
      enunciado: ['Una pelota sale de una azotea con ', Mx, ' = 10t e ', My, ' = 45 − 5t² (en metros y segundos; y desde el piso). ¿Cuándo y dónde llega al piso?'],
      datos: [DC.leer],
      solucion: [
        { texto: ['Llega al piso cuando ', My, ' = 0:'], ecuacion: ['0 = 45 − 5', Mt2, '   →   ', Mt2, ' = 9   →   ', Mt, ' = ', pt('3 s')] },
        { texto: 'Lo que avanzó de lado en ese tiempo:', ecuacion: [Mx, ' = 10 · ', pt('3'), ' = ', px('30 m')] },
      ],
      respuesta: ['A los ', pt('3 s'), ', a ', px('30 m'), ' del pie'] },
    { nivel: 2, titulo: 'La ecuación del camino',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 22, vx: 10, vy: 10, flecha: false, camino: 'entero' }),
      enunciado: ['Una pelota sigue ', Mx, ' = 10t e ', My, ' = 10t − 5t² (en metros y segundos). ¿A qué altura pasa cuando ', Mx, ' = 10 m?'],
      datos: [DC.leer],
      solucion: [
        { texto: 'Se despeja t de la primera y se lleva a la segunda: queda la ecuación de la trayectoria.', ecuacion: [Mt, ' = ', { frac: [Mx, '10'] }, '   →   ', My, ' = ', Mx, ' − ', { frac: [cuadrado(Mx), '20'] }] },
        { texto: 'Con x = 10 m:', ecuacion: [My, ' = 10 − ', { frac: ['100', '20'] }, ' = ', ph('5 m')] },
      ],
      respuesta: ['Pasa a ', ph('5 m'), ' de altura'] },
    { nivel: 3, titulo: 'Distancia al origen',
      figura: fig({ vista: 'plano', max: 18, paso: 2, numero: 6, x0: 4, vx: 4, ay: 8, t: 0 }),
      enunciado: ['Una partícula se mueve con ', Mx, ' = 4 + 4t e ', My, ' = 4t² (en metros y segundos). ¿A qué distancia del origen está a los ', pt('2 s'), '?'],
      alternativas: ['28 m', '16 m', '12 m', '14,42 m', '20 m'],
      datos: [DC.leer, DC.dist],
      solucion: [
        { texto: 'Dónde está a los 2 s:', ecuacion: [Mx, ' = 4 + 4 · ', pt('2'), ' = ', px('12 m'), ';   ', My, ' = 4 · ', cuadrado(pt('2')), ' = ', px('16 m')] },
        { texto: 'La distancia al origen, con Pitágoras:', ecuacion: [Md, ' = ', raiz([cuadrado(px('12')), ' + ', cuadrado(px('16'))]), ' = ', px('20 m')] },
        { texto: [neg('A'), ' suma las coordenadas; ', neg('B'), ' da solo la mayor; ', neg('C'), ' da solo x; ', neg('D'), ' usa t en vez de t² en y.'] },
      ],
      respuesta: [neg('E'), ', ', px('20 m')] },
    { nivel: 3, titulo: 'La altura máxima, de la ecuación',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 11, vx: 6, vy: 8, flecha: false, camino: 'entero', cotaH: { texto: '?' } }),
      enunciado: ['Una pelota sigue ', Mx, ' = 6t e ', My, ' = 8t − 5t² (en metros y segundos). ¿Cuál es su altura máxima?'],
      alternativas: ['3,2 m', '6,4 m', '8 m', '2,4 m', '4,8 m'],
      datos: [DC.leer, DC.vyt, DB.H],
      solucion: [
        { texto: 'De la ecuación: sube con 8 m/s, y 5 es ½ · g, así que g = 10 m/s². Arriba la velocidad vertical vale cero:', ecuacion: ['0 = ', pv('8'), ' − ', pa('10'), ' · ', Mts, '   →   ', Mts, ' = ', pt('0,8 s')] },
        { texto: 'La altura en ese instante:', ecuacion: [MH, ' = 8 · ', pt('0,8'), ' − 5 · ', cuadrado(pt('0,8')), ' = 6,4 − 3,2 = ', ph('3,2 m')] },
        { texto: [neg('B'), ' olvida restar la gravedad; ', neg('C'), ' toma la velocidad como altura; ', neg('D'), ' no eleva el tiempo al cuadrado; ', neg('E'), ' da lo que avanzó de lado hasta la cima.'] },
      ],
      respuesta: [neg('A'), ', ', MH, ' = ', ph('3,2 m')] },
    { nivel: 3, titulo: 'La ecuación de la trayectoria',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 22, vx: 5, vy: 20, techo: 21, flecha: false, camino: 'entero' }),
      enunciado: ['Una pelota sigue ', Mx, ' = 5t e ', My, ' = 20t − 5t² (en metros y segundos). ¿Qué ecuación une ', My, ' con ', Mx, '?'],
      alternativas: ['y = 20x − 5x²', 'y = 4x − x²', 'y = 4x − x²/5', 'y = 100x − 125x²', 'y = 4x − x²/25'],
      datos: [DC.leer],
      solucion: [
        { texto: 'Se despeja t de la ecuación de x:', ecuacion: [Mt, ' = ', { frac: [Mx, '5'] }] },
        { texto: 'Se reemplaza en la de y:', ecuacion: [My, ' = 20 · ', { frac: [Mx, '5'] }, ' − 5 · ', cuadrado({ par: [{ frac: [Mx, '5'] }] }), ' = 4', Mx, ' − ', { frac: [cuadrado(Mx), '5'] }] },
        { texto: [neg('A'), ' pone x en lugar de t; ', neg('B'), ' eleva la x al cuadrado pero no el 5; ', neg('D'), ' usa t = 5x; ', neg('E'), ' olvida el 5 que multiplica.'] },
      ],
      respuesta: [neg('C'), ': ', My, ' = 4', Mx, ' − ', Mx, '²/5'] },
    { nivel: 3, titulo: 'Dos drones',
      figura: fig({ vista: 'plano', max: 30, paso: 5, numero: 10 }),
      enunciado: ['Dos drones salen a la vez de la plaza: uno con ', Mx, ' = 3t hacia el este y otro con ', My, ' = 4t hacia el norte (en metros y segundos). ¿Qué distancia los separa a los ', pt('5 s'), '?'],
      alternativas: ['35 m', '25 m', '5 m', '20 m', '7 m'],
      // Lector en frío (19 nov): «distancia al origen» en los datos, cuando piden la que separa a los dos drones.
      datos: [DC.x, DC.y, ['Distancia entre dos puntos, uno en cada eje: ', Md, ' = ', raiz([cuadrado(Mx), ' + ', cuadrado(My)])], DC.recto],
      solucion: [
        { texto: 'A los 5 s, uno está a 15 m al este y el otro a 20 m al norte:', ecuacion: [Mx, ' = 3 · ', pt('5'), ' = ', px('15 m'), ';   ', My, ' = 4 · ', pt('5'), ' = ', px('20 m')] },
        { texto: 'La línea que los une es la hipotenusa:', ecuacion: [Md, ' = ', raiz([cuadrado(px('15')), ' + ', cuadrado(px('20'))]), ' = ', px('25 m')] },
        { texto: [neg('A'), ' suma las dos distancias; ', neg('C'), ' olvida el tiempo; ', neg('D'), ' da solo la mayor; ', neg('E'), ' suma las velocidades.'] },
      ],
      respuesta: [neg('B'), ', ', px('25 m')] },
    { nivel: 3, titulo: 'La rapidez en un instante',
      figura: fig({ plataforma: 'piso', objeto: 'pelota', ancho: 64, vx: 15, vy: 20, flecha: false, camino: 'entero' }),
      enunciado: ['Una pelota sigue ', Mx, ' = 15t e ', My, ' = 20t − 5t² (en metros y segundos). ¿Con qué rapidez se mueve a los ', pt('1 s'), '?'],
      alternativas: ['15 m/s', '25 m/s', '35 m/s', '18,03 m/s', '10 m/s'],
      datos: [DC.leer, DC.vyt, DB.rap],
      solucion: [
        { texto: 'De las ecuaciones: 15 m/s de lado y 20 m/s hacia arriba al salir, con g = 10 m/s². A 1 s:', ecuacion: [Mvx, ' = ', pv('15 m/s'), ';   ', Mvy, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('1'), ' = ', pv('10 m/s')] },
        { texto: 'Con Pitágoras:', ecuacion: [Mv, ' = ', raiz([cuadrado(pv('15')), ' + ', cuadrado(pv('10'))]), ' ≈ ', pv('18,03 m/s')] },
        { texto: [neg('A'), ' da solo la de lado; ', neg('B'), ' da la de salida; ', neg('C'), ' suma 15 + 20; ', neg('E'), ' da solo la vertical.'] },
      ],
      respuesta: [neg('D'), ', ', pv('18,03 m/s')] },
  ];

  // Casos de «Ahora tú» y de «Así se resuelve» (listas distintas; ninguno es 6t y 8t, el caso de Predice).
  const DRONES = [[3, 4], [4, 3], [5, 12], [12, 5], [8, 6], [9, 12], [8, 15], [15, 8], [7, 24], [2, 3], [5, 2]];
  const TIROS5 = [[15, 20], [10, 20], [12, 16], [20, 15], [8, 30], [6, 10], [9, 12], [16, 12], [20, 25]];
  // Partículas de nivel examen: x = x₀ + a·t, y = c·t², a los 2 s (la distancia no siempre es entera).
  const PARTICULAS = [[2, 2, 2], [3, 6, 2], [1, 4, 3], [4, 4, 4], [3, 6, 4], [2, 4, 3], [6, 12, 4], [1, 7, 5], [3, 6, 6], [2, 8, 6]];
  const TRAYECTORIAS = [[10, 20], [5, 10], [10, 30], [20, 20], [15, 30], [5, 20]];

  const ecuaciones = {
    id: 'ecuaciones-en-el-plano',
    titulo: 'Ecuaciones del movimiento en el plano',
    pregunta: '¿Cómo se sabe dónde está un dron con dos ecuaciones?',
    temas: ['Movimiento en dos dimensiones'],
    pieza: 'fis-tiro',
    aprendizaje: 'Con x(t) e y(t) se sabe dónde está en cada instante; la distancia al origen sale con Pitágoras, no sumando las coordenadas.',
    actividad: 'Programar el vuelo de un dron sobre las calles, con dos velocidades.',
    lee: {
      tarjetas: [
        { titulo: 'El dron sobre las calles', texto: ['Un dron de reparto sale de la plaza y vuela sobre las calles, que van cada 10 m. Desde arriba, su posición se dice con dos coordenadas: ', Mx, ', cuánto avanzó hacia el este, e ', My, ', hacia el norte.'],
          dibujo: tiroH(Object.assign({}, CALLES, { vx: 4, vy: 3, t: 5, camino: true, guias: true })) },
        { titulo: 'Una ecuación por eje', texto: ['Cada coordenada cambia con el reloj. Si el dron avanza 4 m al este cada segundo, ', Mx, ' = 4t; si avanza 3 m al norte, ', My, ' = 3t. Con las dos, dónde está a cada instante.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir cuánto avanza el dron cada segundo hacia el este y hacia el norte. Cada segundo deja un dron tenue. Mira cómo crecen sus dos marcas en los ejes.' },
      ],
    },
    ejemplos: EJEMPLOS_PLANO,
    juega: {
      pieza: 'fis-tiro',
      consigna: 'El dron sale de la plaza. Cada segundo avanza lo mismo hacia el este y lo mismo hacia el norte.',
      mision: {
        texto: 'Haz que el dron pase sobre la antena: 30 m al este, 40 m al norte.',
        // Pasa por la antena si 30/vx = 40/vy dentro del mapa: 3 y 4 m/s (a los 10 s) o 6 y 8 m/s (a los 5 s).
        logrado: val => val.vx * 4 === val.vy * 3,
        bien: 'x e y crecen a la vez: cada una con su velocidad, con el mismo reloj.',
      },
      voz: 'Compara las dos marcas de los ejes: ¿crecen igual de rápido?',
      leyenda: [
        { s: [Mx], t: 'cuánto avanzó al este, en metros' },
        { s: [My], t: 'cuánto avanzó al norte, en metros' },
        { s: [Mt], t: 'segundos desde que salió de la plaza' },
        { s: 'plaza', t: 'de donde sale: x = 0, y = 0' },
        { s: 'dron tenue', t: 'cada segundo, al correr el reloj' },
        { s: 'punto violeta', t: 'su marca en cada eje, con el reloj' },
      ],
      controles: CTRL_A5,
      dibujo: juegoA5,
      // La lectura dice dónde está; no dice a qué distancia de la plaza (eso es Predice).
      // Con el instante redondeado que se muestra (lector en frío, 19 nov: «0,63 s: 1,25 m» con 2 m/s).
      lectura: val => { const g0 = Kit.piezas['fis-tiro'].geometria(juegoA5(val).datos), tt = Math.round(g0.t * 100) / 100;
        return ['En ', pt(`${fm(tt)} s`), ': ', px(`${fm(val.vx * tt)} m`), ' al este, ', px(`${fm(val.vy * tt)} m`), ' al norte']; },
      resumen: { vx: 4, vy: 3, t: 6 },
      minimo: 3,
    },
    predice: {
      pregunta: ['El dron sale de la plaza con ', Mx, ' = 6t e ', My, ' = 8t (en metros y segundos). ¿A qué distancia de la plaza está a los ', pt('5 s'), '?'],
      datos: ['x es lo que avanzó hacia el este; y, hacia el norte.', 'El este y el norte forman 90°.'],
      opciones: [
        { id: 'c', texto: '50 m', correcta: true },
        { id: 'suma', texto: '70 m', error: '2D-SUMA', siFuera: 'Bien: 30 m y 40 m. Pero sumarlos es ir por las calles, no en línea recta.' },
        { id: 'una', texto: '40 m', error: '2D-UNA', siFuera: 'Esa es solo lo que avanzó al norte. También se fue al este.' },
        { id: 'sin-t', texto: '14 m', error: '2D-SIN-T', siFuera: '6 y 8 son lo que avanza cada segundo. Falta multiplicar por los 5 s.' },
      ],
      dibujo: tiroH(Object.assign({}, CALLES, { vx: 6, vy: 8, t: 5, camino: true, linea: { texto: '?' } })),
      revelar: tiroH(MIRA_A5, { corte: 4 }),
      coincide: 'Coincide: 30 m y 40 m son los catetos; la distancia es la hipotenusa.',
    },
    mira: {
      datos: MIRA_A5,
      pasos: [
        { estado: { corte: 0 }, texto: 'Al salir, el dron está en la plaza: x = 0 e y = 0.' },
        { estado: { corte: 1 }, texto: 'Cada segundo avanza 6 m al este y 8 m al norte.', ecuacion: [Mx, ' = ', pv('6'), ' · ', Mt, ';   ', My, ' = ', pv('8'), ' · ', Mt] },
        { estado: { corte: 2 }, texto: 'A los 5 s, cada ecuación da su coordenada.', ecuacion: [Mx, ' = 6 · ', pt('5'), ' = ', px('30 m'), ';   ', My, ' = 8 · ', pt('5'), ' = ', px('40 m')] },
        { estado: { corte: 3 }, texto: 'La distancia a la plaza es la diagonal de un triángulo recto.' },
        { estado: { corte: 4 }, texto: 'Pitágoras con los dos catetos:', ecuacion: [Md, ' = ', raiz([cuadrado(px('30')), ' + ', cuadrado(px('40'))]), ' = ', px('50 m')] },
        { estado: { corte: 5 }, texto: 'Sumar 30 + 40 sería ir por las calles, no en línea recta.' },
      ],
    },
    regla: {
      texto: 'Cada coordenada tiene su ecuación, con el mismo reloj. Con x(t) e y(t) se sabe dónde está en cada instante; la distancia al origen sale con Pitágoras.',
      ecuacion: [Mx, ' = ', Mx0, ' + ', Mv0x, ' · ', Mt, ' + ½ · ', Max, ' · ', Mt2, '   ·   ', My, ' = ', My0, ' + ', Mv0y, ' · ', Mt, ' + ½ · ', May, ' · ', Mt2, '   ·   ', { llave: [Md], nota: 'distancia al origen', color: 'c-f' }, ' = ', raiz([cuadrado(Mx), ' + ', cuadrado(My)])],
      // Lector en frío, 19 nov: la de x no traía ½·a·t² aunque la condición hablaba de aceleración en cada eje, y d no decía
      // que es al origen. Y el cambio de y (al norte, en el dron; la altura, en un tiro) se dice aquí.
      condicion: 'aceleración constante en cada eje (dron: cero); d, distancia al origen. En un tiro de costado, y es la altura: aceleración −g.',
    },
    // Así se resuelve: la ecuación de la trayectoria y leer la salida de las dos ecuaciones; «Ahora tú» pregunta otras cosas.
    resuelve: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [a, b] = r.de(TRAYECTORIAS), tf = 2 * b / G, xs = r.de([0.25, 0.5, 0.75].map(q => q * a * tf)), ti = xs / a, ys = b * ti - 5 * ti * ti;
          return {
            enunciado: ['Una pelota sigue ', Mx, ` = ${fm(a)}t e `, My, ` = ${fm(b)}t − 5t²`, ' (en metros y segundos). ¿A qué altura pasa cuando ', Mx, ' = ', px(`${fm(xs)} m`), '?'],
            datos: [DC.leer],
            dibujo: tiroH({ plataforma: 'piso', objeto: 'pelota', ancho: Math.max(a * tf * 1.1, 12), vx: a, vy: b, t: 0, flecha: false, camino: 'entero', blanco: { en: xs, tipo: 'marca' } }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la altura ', My, ' en el punto donde ', Mx, ' vale ', px(`${fm(xs)} m`), ' (la × del piso).'] },
              { tipo: 'datos', texto: 'Ahora la pelota se ve de costado: x es lo que avanza e y, la altura. Las dos ecuaciones, con el mismo reloj.', ecuacion: [Mx, ` = ${fm(a)}`, Mt, ';   ', My, ` = ${fm(b)}`, Mt, ' − 5', Mt2] },
              { tipo: 'regla', texto: 'Se despeja t de la ecuación de x y se reemplaza en la de y: queda la ecuación de la trayectoria.', ecuacion: [Mt, ' = ', { frac: [Mx, fm(a)] }] },
              { tipo: 'cuentas', texto: 'Con ese x, primero el tiempo y luego la altura:', ecuacion: [Mt, ' = ', { frac: [px(fm(xs)), fm(a)] }, ' = ', pt(`${fm(ti)} s`), '   →   ', My, ` = ${fm(b)} · `, pt(fm(ti)), ' − 5 · ', cuadrado(pt(fm(ti))), ' = ', ph(`${fm(ys)} m`)] },
              { tipo: 'sentido', texto: 'La altura es positiva: pasa por ese punto todavía en el aire.' },
            ],
            respuesta: ['Pasa a ', ph(`${fm(ys)} m`), ' de altura'],
          };
        }
        const [a, b] = r.de(TIROS5), v0 = Math.hypot(a, b), ang = Math.round(Math.atan2(b, a) * 180 / Math.PI);
        const conocido = [37, 53, 45].includes(ang) && Math.abs(Math.tan(rad(ang)) - b / a) < 0.01;
        return {
          enunciado: ['Una pelota sigue ', Mx, ` = ${fm(a)}t e `, My, ` = ${fm(b)}t − 5t²`, ' (en metros y segundos). ¿Con qué rapidez salió?'],
          datos: [DC.leer, DB.rap],
          dibujo: tiroH({ plataforma: 'piso', objeto: 'pelota', ancho: Math.max(a * 2 * b / G * 1.1, 12), vx: a, vy: b, t: 0, flecha: { texto: '?' }, camino: 'entero' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la rapidez de salida, ', Mv0, ': el largo de la flecha con que sale.'] },
            { tipo: 'datos', texto: 'Ahora la pelota se ve de costado: x es lo que avanza e y, la altura. Una ecuación por eje.', ecuacion: [Mx, ` = ${fm(a)}`, Mt, ';   ', My, ` = ${fm(b)}`, Mt, ' − 5', Mt2] },
            { tipo: 'regla', texto: 'Lo que multiplica a t es la velocidad de salida de cada eje; el término con t² es ½ · aceleración.', ecuacion: [Mv0x, ` = ${fm(a)} m/s;   `, Mv0y, ` = ${fm(b)} m/s`] },
            { tipo: 'cuentas', texto: 'Las dos partes se juntan con Pitágoras:', ecuacion: [Mv0, ' = ', raiz([cuadrado(pv(fm(a))), ' + ', cuadrado(pv(fm(b)))]), ' = ', pv(ms(v0))] },
            { tipo: 'sentido', texto: conocido ? `Además, tan θ = ${fm(b)}/${fm(a)}: salió con ${ang}°.` : 'Es mayor que cada parte, como la hipotenusa de un triángulo recto.' },
          ],
          respuesta: ['Salió a ', pv(ms(v0))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-tiro',
      generar(sm) {
        const r = azar(sm + 65), k = sm % 4;
        if (k === 0 || k === 1) {
          const [a, b] = r.de(DRONES), ti = r.de([2, 3, 4]), X = a * ti, Y = b * ti, d = Math.hypot(X, Y);
          const max = Math.max(20, Math.ceil(Math.max(X, Y) * 1.15 / 10) * 10);
          const enun = ['Un dron sale de la plaza con ', Mx, ` = ${fm(a)}t e `, My, ` = ${fm(b)}t`, ' (en metros y segundos).'];
          if (k === 0) return {
            pregunta: [...enun, ' ¿Cuántos metros al norte está a los ', pt(`${fm(ti)} s`), '?'],
            datos: [DC.x, DC.y],
            dibujo: tiroH(Object.assign({}, CALLES, { max, paso: 10, numero: 1000 })),
            opciones: opciones(Y, [
              { id: 'este', valor: X, error: '2D-EJE', siFuera: 'Bien reemplazar el tiempo. Pero esa es la ecuación del este; al norte va y.' },
              { id: 'sin-t', valor: b, error: '2D-SIN-T', siFuera: 'Eso es lo que avanza en un solo segundo. Falta multiplicar por el tiempo.' },
              { id: 'cuadrado', valor: b * ti * ti, error: '2D-CUADRADO', siFuera: 'Bien reemplazar el tiempo. Pero la ecuación tiene t, no t²: no se eleva.' },
              { id: 'dist', valor: d, error: '2D-DIST', siFuera: 'Esa es la distancia a la plaza. Piden solo lo que avanzó al norte.' },
            ], q => `${fm(q)} m`),
            solucion: { texto: 'Se reemplaza el tiempo en la ecuación del norte.', ecuacion: [My, ` = ${fm(b)} · `, pt(fm(ti)), ' = ', px(`${fm(Y)} m`)] },
          };
          return {
            pregunta: [...enun, ' ¿A qué distancia de la plaza está a los ', pt(`${fm(ti)} s`), '?'],
            datos: [DC.x, DC.y, DC.dist, DC.recto],
            dibujo: tiroH(Object.assign({}, CALLES, { max, paso: 10, numero: 1000 })),
            opciones: opciones(d, [
              { id: 'suma', valor: X + Y, error: '2D-SUMA', siFuera: 'Bien las dos coordenadas. Pero sumarlas es ir por las calles: se juntan con Pitágoras.' },
              { id: 'una', valor: Math.max(X, Y), error: '2D-UNA', siFuera: 'Esa es solo la coordenada mayor. El dron también se movió en el otro eje.' },
              { id: 'sin-t', valor: Math.hypot(a, b), error: '2D-SIN-T', siFuera: 'Bien Pitágoras. Pero con lo de un segundo: falta multiplicar por el tiempo.' },
              { id: 'resta', valor: Math.abs(X - Y) || NaN, error: '2D-RESTA', siFuera: 'Bien las dos coordenadas. Pero forman un ángulo recto: no se restan.' },
            ], q => `${fm(q)} m`),
            solucion: { texto: `Está a ${fm(X)} m al este y ${fm(Y)} m al norte.`, ecuacion: [Md, ' = ', raiz([cuadrado(px(fm(X))), ' + ', cuadrado(px(fm(Y)))]), ' = ', px(`${fm(d)} m`)] },
          };
        }
        if (k === 2) {
          const [a, b] = r.de(TIROS5), tf = 2 * b / G, R = a * tf;
          return {
            pregunta: ['Una pelota sigue ', Mx, ` = ${fm(a)}t e `, My, ` = ${fm(b)}t − 5t²`, ' (en metros y segundos, desde el piso). ¿A qué distancia de la salida vuelve al piso?'],
            datos: [DC.leer, DC.tiro],
            dibujo: tiroH({ plataforma: 'piso', objeto: 'pelota', ancho: Math.max(R * 1.1, 12), vx: a, vy: b, t: 0, flecha: false, camino: 'entero', cotaAlcance: { texto: '?', hasta: R } }),
            opciones: opciones(R, [
              { id: 'tiempo', valor: tf, error: '2D-TIEMPO', siFuera: 'Bien: ese es el instante en que y vuelve a 0, en segundos. Falta llevarlo a x.' },
              { id: 'subida', valor: R / 2, error: 'TP-SUBIDA', siFuera: 'Bien llevar el tiempo a x. Pero ese es el de la cima: el vuelo dura el doble.' },
              { id: 'y', valor: b * tf, error: '2D-EJE', siFuera: 'Bien el tiempo de vuelo. Pero se reemplaza en la ecuación de x, no en el primer término de y.' },
            ], q => `${fm(q)} m`),
            solucion: { texto: `y = 0 a los ${fm(tf)} s; en ese instante se mira x.`, ecuacion: [Mx, ` = ${fm(a)} · `, pt(fm(tf)), ' = ', px(`${fm(R)} m`)] },
          };
        }
        // Nivel examen (San Marcos 2025-I, 81): la distancia al origen con x = x₀ + a·t e y = c·t².
        const [x0, a, c] = r.de(PARTICULAS), ti = 2, X = x0 + a * ti, Y = c * ti * ti, d = Math.hypot(X, Y);
        return {
          pregunta: ['Una partícula se mueve con ', Mx, ` = ${fm(x0)} + ${fm(a)}t e `, My, ` = ${fm(c)}t²`, ' (en metros y segundos). ¿A qué distancia del origen está a los ', pt('2 s'), '?'],
          datos: [DC.leer, DC.dist],
          dibujo: tiroH(Object.assign({}, CALLES, { max: Math.ceil(Math.max(X, Y) * 1.15 / 10) * 10, paso: 5, numero: 1000 })),
          opciones: opciones(d, [
            { id: 'suma', valor: X + Y, error: '2D-SUMA', siFuera: 'Bien las dos coordenadas. Pero sumarlas no da la distancia: se juntan con Pitágoras.' },
            { id: 'una', valor: Math.max(X, Y), error: '2D-UNA', siFuera: 'Esa es solo la coordenada mayor. La partícula también se movió en el otro eje.' },
            { id: 't', valor: Math.hypot(X, c * ti), error: '2D-CUADRADO', siFuera: 'Bien Pitágoras. Pero y lleva t²: a los 2 s es c · 4, no c · 2.' },
            { id: 'sin-x0', valor: Math.hypot(a * ti, Y), error: '2D-SIN-X0', siFuera: 'Bien Pitágoras. Pero x no sale de 0: suma la posición inicial.' },
          ], q => `${fm(q)} m`),
          solucion: { texto: `A los 2 s: x = ${fm(X)} m e y = ${fm(Y)} m.`, ecuacion: [Md, ' = ', raiz([cuadrado(px(fm(X))), ' + ', cuadrado(px(fm(Y)))]), ' = ', px(`${fm(d)} m`)] },
        };
      },
    },
  };

  // Laboratorio: el tiro con ángulos de 15° en 15° y rapidez de 5 a 30 m/s (seno y coseno exactos de Math), en
  // ejes fijos para que dos casos guardados se comparen a la misma escala.
  const TIRO_LIBRE = [
    { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 5, max: 30, paso: 5, inicio: 20, unidad: 'm/s', decimales: 0 },
    { id: 'ang', etiqueta: 'Ángulo', min: 15, max: 75, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
  ];
  function tiroLibre(vi, ang) {
    const ux = vi * Math.cos(rad(ang)), uy = vi * Math.sin(rad(ang)), T = 2 * uy / G;
    const curva = Array.from({ length: 41 }, (_, k) => { const tt = T * k / 40; return [ux * tt, uy * tt - G * tt * tt / 2]; });
    const puntos = [];
    for (let k = 0; k * 0.5 <= T + 1e-9; k++) { const tt = k * 0.5; puntos.push({ x: ux * tt, y: uy * tt - G * tt * tt / 2, color: 'f' }, { x: ux * tt, y: 0, color: 'f', abierto: true }); }
    return Object.assign(EJE_TIRO(95, 50), { curvas: [{ puntos: curva, color: 'f' }], puntos });
  }
  const cimaLibre = (vi, ang) => { const g_ = EJ(tiroLibre(vi, ang)), ux = vi * Math.cos(rad(ang)), uy = vi * Math.sin(rad(ang)); return { x: g_.X(ux * uy / G), y: g_.Y(uy * uy / (2 * G)) }; };
  // Lo que se lee del tiro libre (las mismas cuentas que trazan la curva): vuelo, altura máxima y alcance.
  const medidasTiro = val => {
    const ux = val.v0 * Math.cos(rad(val.ang)), uy = val.v0 * Math.sin(rad(val.ang)), T = 2 * uy / G;
    return { T, H: uy * uy / (2 * G), R: ux * T };
  };
  const ANGS_LIBRES = Array.from({ length: (TIRO_LIBRE[1].max - TIRO_LIBRE[1].min) / TIRO_LIBRE[1].paso + 1 }, (_, k) => TIRO_LIBRE[1].min + k * TIRO_LIBRE[1].paso);

  // La pelota y sus dos sombras (laboratorio 3D de contexto, 15 nov: exploración libre, sin predicciones). Una luz desde
  // arriba deja la sombra en el suelo (x, MRU) y otra desde el frente la deja en la pared (y, MRUV): el mismo reloj t,
  // que arrastra el alumno, mueve las dos. Posiciones, tiempos y alcance: motor de plantillas/tiro-parabolico
  // (proyectil) a través de nucleo/fisica3d.js. Las marcas son cada medio segundo.
  const tiro3 = val => F3.tiro(val);
  const ANGS3 = [30, 37, 45, 53, 60];
  const igual3 = (p, q) => Math.abs(p - q) < 1e-9;
  const mesaSombras = {
    id: 'dos-sombras-3d', titulo: 'La pelota y sus dos sombras', pieza: 'fis-espacio-3d',
    consigna: 'La pelota sale una y otra vez. Gira la escena y compara las marcas de la sombra del suelo con las de la pared.',
    controles: [
      { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 10, max: 30, paso: 5, inicio: 20, unidad: 'm/s', decimales: 0 },
      { id: 'ang', etiqueta: 'Ángulo', opciones: ANGS3.map(a => ({ valor: a, texto: `${a}°` })), inicio: 45 },
      // Animación (15 nov): t corre solo en tiempo real; F3.tiro arma siempre los mismos objetos (la escena se mueve sin
      // rearmarse) y, al caer, la pelota espera en el suelo hasta que t vuelve a 0.
      { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 6, paso: 0.25, inicio: 1.5, unidad: 's', decimales: 2,
        auto: { velocidad: 1, modo: 'repite' } },
    ],
    dibujo: val => ({ datos: tiro3(val).datos, estado: {} }),
    lectura: val => { const r = tiro3(val); return ['A los ', pt(`${f(r.t, 2)} s`), ': ', px(`${f(r.x, 1)} m`), ' de lado, ', ph(`${f(r.y, 1)} m`), ' de alto']; },
    invitaciones: [
      { texto: 'Detén la pelota justo en lo más alto de su camino.',
        logrado: val => tiro3(val).enAire && igual3(tiro3(val).t, tiro3(val).tSubida),
        bien: 'En la cima, la sombra de la pared se detiene; la del suelo sigue igual.',
        pista: 'Pausa cerca de la cima y ajusta t con − y + hasta que la flecha vy desaparezca.' },
      { texto: 'Logra que la sombra del suelo pase los 40 m con la pelota en el aire.',
        logrado: val => tiro3(val).enAire && tiro3(val).x >= 40,
        bien: 'La sombra del suelo avanza lo mismo cada medio segundo: vx no cambia.' },
      { texto: 'Busca el tiro que sube más alto en toda la mesa.',
        logrado: (val, g, mesa) => igual3(tiro3(val).H, Math.max(...ANGS3.map(a => tiro3({ v0: mesa.controles[0].max, ang: a, t: 0 }).H))),
        bien: 'Mucha rapidez y el ángulo más empinado: más vy, más altura.',
        pista: 'La altura solo depende de vy. ¿Qué rapidez y ángulo dan la mayor?' },
      { texto: 'Guarda dos tiros con el mismo alcance y distinto ángulo.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.ang !== q.ang && igual3(tiro3(p).alcance, tiro3(q).alcance))),
        bien: 'Ángulos que suman 90° llegan igual de lejos, por caminos distintos.' },
    ],
  };

  // Un color fijo por magnitud (idea A1; las ideas que faltan lo siguen). Los mismos de MRU y de MRUV.
  const COLORES = { velocidad: 'o', tiempo: 'i', posición: 'f', altura: 'f', aceleración: 'h' };

  return {
    unidad: 'fisica.movimiento-parabolico-y-circular',
    version: '0.5.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    // En el plano la velocidad es un vector: desde la idea A2 se escribe v⃗, y sus componentes, sin flecha. En A1 solo
    // aparece v₀, la rapidez de salida (un número), así que todavía no hay ninguna flecha.
    notacion: { vectores: true, motivo: 'En el plano la velocidad es un vector, v⃗, y sus componentes son números con signo. v₀ sin flecha es la rapidez de salida.' },
    // Tabla de letras (propuesta §5): un solo significado en la unidad.
    letras: { v: 'rapidez: el largo de la flecha de la velocidad', v_0: 'rapidez de salida', v_x: 'velocidad horizontal', v_y: 'velocidad vertical',
      v_0x: 'velocidad horizontal de salida', v_0y: 'velocidad vertical de salida', t: 'tiempo desde que sale', t_s: 'tiempo de subida', t_v: 'tiempo de vuelo',
      x: 'lo que avanzó de lado (o al este)', y: 'la altura sobre la salida (o lo que avanzó al norte)', x_0: 'la x de donde sale', y_0: 'la y de donde sale',
      h: 'lo que ha caído, hacia abajo', H: 'altura máxima', R: 'alcance', d: 'distancia al origen', g: 'gravedad', a_y: 'aceleración vertical',
      'θ': 'ángulo con la horizontal' },
    requiere: ['/nucleo/kit/piezas/fis-tiro.js', '/nucleo/kit/piezas/ejes.js', '/plantillas/tiro-parabolico/motor.js', '/nucleo/fisica3d.js',
      '/nucleo/kit/piezas/fis-espacio-3d.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. Velocidad, rapidez y MRU
    // vienen de Movimiento rectilíneo uniforme; aceleración, caída libre, gravedad, parábola y altura máxima, de MRUV y
    // caída libre; componente, de Vectores: aquí no se definen y el lector las marca «se explica en…». Las once palabras
    // del giro se fueron con Movimiento circular (partición partidoPC).
    // Ningún ejemplo dice quién llega primero, la soltada o la lanzada (es la predicción de A1; auditoría de MRUV, A2).
    glosario: [
      { termino: 'tiro horizontal', def: 'Movimiento de algo que sale de lado desde una altura y, sin aire, solo siente la gravedad.',
        simple: 'Lanzar algo de lado: ni hacia arriba ni hacia abajo.',
        ejemplos: ['Una piedra lanzada de lado desde una peña, hacia el lago.', 'Una canica que rueda por la mesa y sale por el borde.', 'El agua que sale de un caño horizontal.'],
        formas: ['tiro horizontal', 'tiros horizontales'], ver: ['trayectoria', 'tiempo de vuelo'] },
      { termino: 'trayectoria', def: 'El camino que dibuja un cuerpo al moverse. La de un tiro horizontal, sin aire, es media parábola.',
        simple: 'El camino que deja dibujado algo que se mueve.',
        ejemplos: ['La curva que dibuja el chorro de una manguera.', 'El arco que dibuja una pelota pateada.', 'En un MRU, es una línea recta.'],
        formas: ['trayectoria', 'trayectorias'], ver: ['parábola'] },
      { termino: 'alcance horizontal', medida: 'm', formas: ['alcance horizontal', 'alcance', 'alcances'],
        def: 'Distancia de lado entre el punto de donde sale algo lanzado y el punto donde cae.',
        simple: 'Qué tan lejos cae, medido por el piso.',
        ejemplos: ['Avanza 12 m cada segundo durante 3 s: cae a 36 m.', 'Una canica que cae a 60 cm del pie de la mesa.', 'El chorro de un caño que moja el piso a 2 m del muro.'],
        ver: ['tiempo de vuelo'] },
      { termino: 'tiempo de vuelo', medida: 's', def: 'Cuánto dura un lanzamiento en el aire, desde que sale hasta que toca el piso o el agua.',
        simple: 'Cuánto rato está en el aire.',
        ejemplos: ['Una piedra que sale a los 0 s y toca el agua a los 3 s: 3 s.', 'Una canica que cae de una mesa está menos de medio segundo.', 'Una pelota pateada bien alto puede pasar de 3 s.'],
        formas: ['tiempo de vuelo', 'tiempos de vuelo'], ver: ['alcance horizontal'] },
      // A2: la velocidad en vuelo. Ningún ejemplo junta 15 m/s con 20 m/s (la predicción de A2 da 25 m/s).
      { termino: 'velocidad horizontal', simbolo: 'v_x', medida: 'm/s', formas: ['velocidad horizontal', 'velocidades horizontales'],
        def: 'La parte de la velocidad que va de lado, paralela al piso. Sin aire, no cambia en todo el vuelo.',
        simple: 'Qué tan rápido avanza de lado.',
        ejemplos: ['Una piedra que sale de lado a 8 m/s avanza 8 m cada segundo.', 'Una canica que sale de la mesa a 2 m/s sigue a 2 m/s de lado.', 'El paquete que suelta una avioneta sale con la velocidad horizontal de la avioneta.'],
        ver: ['velocidad vertical'] },
      { termino: 'velocidad vertical', simbolo: 'v_y', medida: 'm/s', formas: ['velocidad vertical', 'velocidades verticales'],
        def: 'La parte de la velocidad que sube o baja. La gravedad la cambia en 10 m/s cada segundo.',
        simple: 'Qué tan rápido sube o baja.',
        ejemplos: ['Una piedra que cae desde el reposo baja a 30 m/s a los 3 s.', 'Lanzada de lado, sale con velocidad vertical cero.', 'Una pelota que sube a 12 m/s, un segundo después sube a 2 m/s.'],
        ver: ['velocidad horizontal'] },
      { termino: 'tangente', formas: ['tangente', 'tangentes'],
        def: 'Que toca una curva en un punto, sin cortarla, y apunta hacia donde sigue la curva ahí.',
        simple: 'Que apunta hacia donde sigue el camino en ese punto.',
        ejemplos: ['El barro que salta de una llanta sale tangente a la rueda.', 'Al soltar una honda, la piedra sale tangente al círculo.', 'La flecha de la velocidad de una piedra en vuelo roza su camino.'],
        ver: ['trayectoria'] },
      // A3: lanzar con ángulo. Ninguno dice qué rapidez queda en lo más alto (la predicción de A3).
      { termino: 'tiro parabólico', formas: ['tiro parabólico', 'tiros parabólicos'],
        def: 'Movimiento de algo lanzado con ángulo: avanza de lado mientras sube y cae. Sin aire, dibuja una parábola.',
        simple: 'Lanzar algo inclinado: sube, llega arriba y baja más allá.',
        ejemplos: ['Una pelota que el arquero patea hacia el otro arco.', 'El chorro de una manguera inclinada.', 'Una piedra lanzada hacia arriba y hacia adelante desde la orilla.'],
        ver: ['ángulo de lanzamiento', 'proyectil'] },
      { termino: 'ángulo de lanzamiento', simbolo: 'θ', medida: '°', formas: ['ángulo de lanzamiento', 'ángulos de lanzamiento'],
        def: 'El ángulo que forma la velocidad de salida con la horizontal.',
        simple: 'Qué tan inclinado sale lo que lanzas.',
        ejemplos: ['Una patada rasante sale con un ángulo pequeño, como 15°.', 'A 90° sale recto hacia arriba.', 'Lanzada de lado, el ángulo de lanzamiento es 0°.'],
        ver: ['tiro parabólico'] },
      { termino: 'proyectil', formas: ['proyectil', 'proyectiles'],
        def: 'Cuerpo lanzado que, después de salir, solo siente la gravedad (sin aire).',
        simple: 'Algo lanzado que vuela solo, sin motor.',
        ejemplos: ['Una pelota pateada.', 'Una piedra lanzada con la mano.', 'Un dron no lo es: su motor lo empuja.'],
        ver: ['tiro parabólico'] },
      // A4: altura máxima y alcance. Ninguno dice qué pasa con el alcance al doble de rapidez (la predicción de A4).
      { termino: 'tiempo de subida', simbolo: 't_s', medida: 's', formas: ['tiempo de subida', 'tiempos de subida'],
        def: 'Lo que tarda un lanzamiento en llegar a lo más alto, donde la velocidad vertical vale cero.',
        simple: 'Cuánto tarda en llegar arriba.',
        ejemplos: ['Una pelota que sube con 20 m/s tarda 2 s en llegar arriba.', 'Lanzada de lado, su tiempo de subida es cero.', 'Si sube con 15 m/s, llega arriba en 1,5 s.'],
        ver: ['tiempo de vuelo'] },
      { termino: 'alcance máximo', medida: 'm', formas: ['alcance máximo', 'alcances máximos'],
        def: 'El mayor alcance que se logra con una rapidez dada, cambiando solo el ángulo. Sin aire, es a 45°.',
        simple: 'Lo más lejos que puede llegar con esa rapidez.',
        ejemplos: ['Con la misma rapidez, ningún ángulo llega más lejos que 45°.', 'A 40° o a 50° cae un poco más cerca que a 45°.', 'Un jugador que despeja lejos busca un ángulo cercano a 45°.'],
        ver: ['alcance horizontal', 'ángulos complementarios'] },
      { termino: 'ángulos complementarios', formas: ['ángulos complementarios', 'complementarios'],
        def: 'Dos ángulos que suman 90°.',
        simple: 'Dos ángulos que juntos hacen una esquina recta.',
        ejemplos: ['20° y 70°.', '37° y 53°, los del triángulo 3-4-5.', '15° y 75°.'],
        ver: ['alcance máximo'] },
      // A5: ecuaciones en el plano. Ninguno junta 30 m con 40 m (la predicción de A5 da 50 m).
      { termino: 'coordenada', formas: ['coordenada', 'coordenadas'],
        def: 'Cada número que dice dónde está un punto: cuánto avanzó en un eje y cuánto en el otro.',
        simple: 'Un número que dice dónde está algo sobre un eje.',
        ejemplos: ['El dron está en x = 20 m, y = 10 m.', 'La plaza, de donde sale, tiene coordenadas x = 0 e y = 0.', 'En un tiro, x es lo que avanzó y, la altura.'],
        ver: ['ecuación de la trayectoria'] },
      { termino: 'ecuación de la trayectoria', formas: ['ecuación de la trayectoria', 'ecuaciones de la trayectoria'],
        def: 'La ecuación que une y con x, sin el tiempo: dice qué camino dibuja el cuerpo.',
        simple: 'La fórmula del camino, sin el reloj.',
        ejemplos: ['Con x = 10t e y = 5t, sale y = x/2: una recta.', 'En un tiro sin aire, sale una parábola.', 'Se despeja t de x(t) y se reemplaza en y(t).'],
        ver: ['coordenada', 'trayectoria'] },
    ],
    // Laboratorio: juego libre, sin preguntas. El tiro libre abre el rango (5 a 30 m/s, 15° a 75°) para probar el caso
    // raro: ángulos que suman 90° llegan igual de lejos. La rueda y el giro se fueron con Movimiento circular.
    laboratorio: [
      mesaSombras,
      {
        id: 'tiro-libre', titulo: 'Tiro con cualquier ángulo', pieza: 'ejes',
        consigna: 'Arrastra la cima o usa − y +. Guarda un tiro a 30° y otro a 60° con la misma rapidez.',
        controles: TIRO_LIBRE,
        dibujo: val => ({ datos: tiroLibre(val.v0, val.ang), estado: {} }),
        lectura: val => {
          const m = medidasTiro(val);
          return [`${f(val.v0, 0)} m/s a ${f(val.ang, 0)}°: cae a ${f(m.R, 1)} m, sube ${f(m.H, 1)} m`];
        },
        invitaciones: [
          { texto: 'Guarda dos tiros con la misma rapidez, otro ángulo y el mismo alcance.',
            logrado: (val, guardados) => guardados.some(x => x.v0 === val.v0 && x.ang !== val.ang && Math.abs(medidasTiro(x).R - medidasTiro(val).R) < 1e-6)
              && guardados.some(x => x.v0 === val.v0 && x.ang === val.ang),
            bien: 'Caen en el mismo sitio y sus ángulos suman 90°. ¿Pasa también con 15° y 75°?' },
          { texto: 'Con 20 m/s, busca el ángulo que llega más lejos.',
            logrado: val => val.v0 === 20 && ANGS_LIBRES.every(an => medidasTiro(val).R >= medidasTiro({ v0: 20, ang: an }).R - 1e-9),
            bien: '45° gana: reparte la rapidez por igual entre subir y avanzar.' },
          { texto: 'Haz que la pelota esté justo 3 s en el aire.',
            logrado: val => Math.abs(medidasTiro(val).T - 3) < 1e-9,
            bien: 'El tiempo de vuelo solo mira la parte de la rapidez que sube.' },
          { texto: 'Guarda dos tiros: el que sube más debe llegar menos lejos.',
            logrado: (val, guardados) => guardados.some(x => {
              const a = medidasTiro(x), b = medidasTiro(val);
              return (a.H > b.H + 1e-9 && a.R < b.R - 1e-9) || (a.H < b.H - 1e-9 && a.R > b.R + 1e-9);
            }) && guardados.some(x => x.v0 === val.v0 && x.ang === val.ang),
            bien: 'Más alto no es más lejos: subir le quita rapidez de lado.' },
        ],
        arrastres: [{ id: 'cima', etiqueta: 'cima de la parábola (rapidez y ángulo)', color: 'c-o',
          donde: val => cimaLibre(val.v0, val.ang),
          mover: (pt, val) => masCerca(TIRO_LIBRE[0], TIRO_LIBRE[1], cimaLibre, pt) }],
      },
    ],
    historia: {
      texto: 'Un proyectil avanza y cae a la vez. En 1638, Galileo explicó su camino como la suma de dos movimientos sencillos: un avance parejo y una caída acelerada, sin aire. Juntos dibujan una parábola.',
      pregunta: '¿Cómo puede algo avanzar y caer a la vez?',
      fuente: { titulo: 'Museo Galileo — aparato de la trayectoria parabólica', url: 'https://catalogue.museogalileo.it/object/ApparatusToDemonstrateParabolicTrajectoryProjectiles.html' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov). Las dos son de lanzar con ángulo; en la fase 3,
    // `tiro-libre` pasa a «Altura máxima y alcance».
    laboratorioIdeas: {
      'dos-sombras-3d': ['tiro-oblicuo'],
      'tiro-libre': ['altura-y-alcance'],
    },
    ideas: [tiroHorizontal, velocidadVuelo, oblicuo, alcance, ecuaciones],
  };
});
