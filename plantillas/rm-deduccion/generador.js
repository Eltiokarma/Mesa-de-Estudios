/*
 * Generador: deducción por enumeración de casos (razonamiento deductivo y certezas).
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['rm-deduccion']) y en Node (require).
 * La respuesta la decide el código revisando todos los casos posibles (regla 1).
 *
 * Tipos y sus _datos:
 *   silogismo       dos premisas categóricas («todos los…», «ningún…», «algunos…», «algunos… no…»)
 *                   sobre tres clases; se pide la conclusión que se deduce, o «ninguna se deduce».
 *                   _datos: { tipo, terminos: [X, M, Z] (plurales; M es el término medio),
 *                             premisas: [{ f: 'A'|'E'|'I'|'O', s, p }] (s y p son índices de terminos),
 *                             opciones: [claves] }
 *                   Validez: las 8 zonas de un diagrama de Venn de tres conjuntos, vacías o no
 *                   (256 modelos). La correcta es válida en todos los modelos que cumplen las premisas;
 *                   los distractores son inválidos aunque se suponga que las tres clases tienen
 *                   elementos (así ninguno se defiende con la lógica tradicional).
 *                   Claves: 'sil:A:0:2' («todos los X son Z»), 'sil:E:0:2', 'sil:I:0:2', 'sil:O:2:0',
 *                   'sil:nada'. E e I son simétricas: su clave lleva los índices ordenados.
 *   siempre-cierto  cuatro frascos (o cajas) A–D con una de tres cosas cada uno (pueden repetirse) y
 *                   3 a 5 pistas (condicionales, negaciones, «no es cierto que si…», distintos, «hay de
 *                   las tres»); se pide la afirmación que es cierta en todos los casos posibles.
 *                   _datos: { tipo, piel, cosas: [3 textos], pistas: [...], opciones: [claves] }
 *                   Pistas: { t: 'cond', a: lit, b: lit } · { t: 'no', o, c } · { t: 'es', o, c } ·
 *                           { t: 'nocond', a, b } · { t: 'distintos', o1, o2 } · { t: 'todas' },
 *                   con lit = { o, c, neg } (o: frasco 0–3, c: cosa 0–2).
 *                   Claves: 'sc:es:o:c', 'sc:no:o:c', 'sc:igual:o1:o2', 'sc:dist:o1:o2',
 *                           'sc:alguno:c', 'sc:ninguno:c'.
 *   asignacion      cuatro personas y cuatro talleres (deportes, ciudades) distintos, con pistas
 *                   «si… entonces…», negaciones y al menos un contrafáctico («si X llevara…, Y
 *                   llevaría…», que dice que X no lleva eso; en la solución tampoco se cumple lo
 *                   segundo, así que la lectura fuerte da lo mismo; y leído como «si…, entonces…» común el reparto
 *                   también es único). Una sola asignación posible con cualquier lectura.
 *                   _datos: { tipo, piel, personas, cosas, pistas, modo: 'afirmacion'|'quien',
 *                             persona (solo en 'quien'), opciones: [claves] }
 *                   Pistas: { t: 'cond', a: lit, b: lit } · { t: 'contra', a: lit, b: lit } ·
 *                           { t: 'no', o, c }, con lit = { o, c, neg } (o: persona, c: cosa).
 *                   Claves: 'as:o:c' («o lleva c») en 'afirmacion'; 'cosa:c' en 'quien'.
 *
 *   puntajes        (nuevo, cierre-100) tres personas, tres dados de colores distintos, cada uno lanzado varias veces; con
 *                   pistas de orden entre puntajes («X obtuvo más que el del dado c», «el del dado c obtuvo el menor»),
 *                   de dados («X no usó el dado c») y de paridad («ninguno obtuvo puntaje par»), se pide el puntaje
 *                   (el mayor posible para todos a la vez) de una persona y su dado.
 *                   _datos: { tipo, personas, colores, lanz, pistas, persona, opciones }
 *                   Pistas: { t: 'mayor', p, c } · { t: 'menor-todos', c } · { t: 'mayor-todos', c } · { t: 'no', p, c } ·
 *                           { t: 'paridad', par: 'impar' | 'par' }. Claves: 'pt:puntaje:color' (índice de color).
 *                   Solo con semillas de práctica y numéricas desde 400 (ver «generar»).
 *
 * calc (funciones puras, para el papel y las pruebas):
 *   proposicion(f, s, p) → clave · modelosSilogismo(premisas, existencial) → [modelo (8 bits)]
 *   validaSilogismo(premisas, clave, existencial) → bool
 *   conclusionesValidas(premisas) → { booleanas: [claves], existenciales: [claves] }
 *   casosFrascos(pistas, n = 4, k = 3) → [[cosa de cada frasco]]
 *   necesaria(pistas, clave) → bool (cierta en todos los casos de casosFrascos)
 *   repartos(pistas, n = 4) → [[cosa de cada persona]] (permutaciones que cumplen las pistas)
 *   puntajes({ lanz, pistas, persona }) → { respuesta: { color, puntaje } | null, repartos, maximos } (tipo puntajes)
 *
 * Errores (todos hipótesis: el informe de razonamiento no trae datos de lógica; las trampas salen
 * de docs/clasificacion/trampas-admision-unmsm/rm-a.md, filas 16 y 25):
 *   RMP70 condicional como bicondicional · RMP71 recíproca, inversa o negación mal hecha del
 *   condicional · RMP72 pareja que cumple todas las pistas menos una · RMP73 conversión ilícita
 *   («todos los A son B» leído como «todos los B son A») · RMP74 cuantificador cambiado («algunos»
 *   en vez de «ninguno», o generalizar un «algunos») · RMP75 «algunos son» leído como «solo algunos»
 *   · RMP76 encadenar por un término medio que no conecta · RMP77 posible pero no necesaria ·
 *   RMP78 creer que no se deduce nada · RMP79 contrafáctico con su primera parte tomada como dato.
 *   Tipo puntajes (cierre-100): RMP72-… (una pista sin revisar o dado cruzado) y RMP2-sin-maximizar (puntaje posible, no el mayor).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-deduccion';
  const TIPOS = ['silogismo', 'siempre-cierto', 'asignacion'];
  const v = P.v;
  const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const err = (id, op, explicacion) => (op ? { id, clave: op.clave, texto: op.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];
  const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  const escRe = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Pinta, dentro de un texto plano, cada nombre de la lista con el color de su variable (regla 4).
  const colorear = pares => {
    const orden = pares.slice().sort((a, b) => b[0].length - a[0].length);
    const re = new RegExp(`(?<![\\p{L}])(${orden.map(p => escRe(p[0])).join('|')})(?![\\p{L}])`, 'gu');
    const clave = new Map(pares);
    return texto => texto.split(re).map((trozo, i) => (i % 2 ? v(clave.get(trozo), trozo) : trozo)).filter(x => x !== '');
  };

  // =====================================================================================
  // 1. Silogismos: modelos de 8 zonas
  // =====================================================================================
  // Zona r (0–7): bit 0 = está en X (término 0), bit 1 = en M (término 1), bit 2 = en Z (término 2).
  // Un modelo es un número de 8 bits: el bit r dice si la zona r tiene elementos.
  const enT = (r, t) => (r >> t) & 1;
  function verdad(f, s, p, modelo) {
    for (let r = 0; r < 8; r++) {
      if (!((modelo >> r) & 1)) continue;
      const a = enT(r, s), b = enT(r, p);
      if (f === 'A' && a && !b) return false;
      if (f === 'E' && a && b) return false;
      if (f === 'I' && a && b) return true;
      if (f === 'O' && a && !b) return true;
    }
    return f === 'A' || f === 'E';
  }
  const conTerminos = modelo => [0, 1, 2].every(t => { for (let r = 0; r < 8; r++) if (((modelo >> r) & 1) && enT(r, t)) return true; return false; });
  function modelosSilogismo(premisas, existencial = false) {
    const out = [];
    for (let m = 0; m < 256; m++) {
      if (existencial && !conTerminos(m)) continue;
      if (premisas.every(q => verdad(q.f, q.s, q.p, m))) out.push(m);
    }
    return out;
  }
  function proposicion(f, s, p) {
    if ((f === 'E' || f === 'I') && s > p) [s, p] = [p, s];
    return `sil:${f}:${s}:${p}`;
  }
  const leerClave = clave => { const [, f, s, p] = clave.split(':'); return { f, s: +s, p: +p }; };
  function validaSilogismo(premisas, clave, existencial = false) {
    const c = leerClave(clave);
    return modelosSilogismo(premisas, existencial).every(m => verdad(c.f, c.s, c.p, m));
  }
  // Las 6 conclusiones distintas entre X (0) y Z (2).
  const CONCLUSIONES = [proposicion('A', 0, 2), proposicion('A', 2, 0), proposicion('E', 0, 2), proposicion('I', 0, 2), proposicion('O', 0, 2), proposicion('O', 2, 0)];
  function conclusionesValidas(premisas) {
    return {
      booleanas: CONCLUSIONES.filter(c => validaSilogismo(premisas, c, false)),
      existenciales: CONCLUSIONES.filter(c => validaSilogismo(premisas, c, true)),
    };
  }

  const CLASES = [
    ['ajedrecista', 'ajedrecistas'], ['ciclista', 'ciclistas'], ['pianista', 'pianistas'], ['violinista', 'violinistas'],
    ['futbolista', 'futbolistas'], ['voleibolista', 'voleibolistas'], ['cantante', 'cantantes'], ['dibujante', 'dibujantes'],
    ['atleta', 'atletas'], ['nadador', 'nadadores'], ['guitarrista', 'guitarristas'], ['bailarín', 'bailarines'],
  ];
  const LUGARES = ['En una feria de talentos de un colegio de Puno', 'En un club juvenil de Juliaca', 'Entre los participantes de unos juegos escolares',
    'En un grupo de amigos del barrio', 'Entre los alumnos de una academia de Arequipa'];
  const singular = pl => (CLASES.find(c => c[1] === pl) || [pl])[0];

  // Texto de una proposición: con colores (lista de segmentos) o plano (para las alternativas).
  function frase(f, s, p, T, color) {
    const n = (i, sg) => { const t = sg ? singular(T[i]) : T[i]; return color ? v(['X', 'M', 'Z'][i], t) : t; };
    const seg = f === 'A' ? ['Todos los ', n(s), ' son ', n(p)]
      : f === 'E' ? ['Ningún ', n(s, true), ' es ', n(p, true)]
      : f === 'I' ? ['Algunos ', n(s), ' son ', n(p)]
      : ['Algunos ', n(s), ' no son ', n(p)];
    return color ? seg : seg.join('');
  }
  const opcionSil = (clave, T) => clave === 'sil:nada'
    ? { clave, texto: 'Ninguna de las otras conclusiones se deduce.' }
    : { clave, texto: (c => frase(c.f, c.s, c.p, T, false))(leerClave(clave)) + '.' };
  // Lo que las premisas no impiden, cuando la conclusión c no se deduce.
  function contraejemplo(c, T) {
    const s = T[c.s], p = T[c.p];
    if (c.f === 'A') return `haya algún ${singular(s)} que no sea ${singular(p)}`;
    if (c.f === 'E') return `alguien sea ${singular(s)} y ${singular(p)} a la vez`;
    if (c.f === 'I') return `ningún ${singular(s)} sea ${singular(p)}`;
    return `todos los ${s} sean ${p}`;
  }
  const conversa = q => ({ f: q.f, s: q.p, p: q.s });

  // ¿Por qué un alumno elegiría la conclusión c (que no se deduce)? Devuelve un error o null.
  function errorSilogismo(prem, clave, correcta, T) {
    const c = leerClave(clave), op = opcionSil(clave, T);
    const no = `Las premisas permiten que ${contraejemplo(c, T)}.`;
    const fr = q => '«' + frase(q.f, q.s, q.p, T, false) + '»';
    const cc = correcta === 'sil:nada' ? null : leerClave(correcta);
    // La conclusión al revés.
    if ((c.f === 'A' || c.f === 'O') && validaSilogismo(prem, proposicion(c.f, c.p, c.s))) {
      return err('RMP73-conclusion-al-reves', op, `Diste vuelta la conclusión. Se deduce ${fr({ f: c.f, s: c.p, p: c.s })}, y eso no es lo mismo: ${c.f === 'A' ? '«todos los A son B» no dice que todos los B sean A' : '«algunos A no son B» no dice que algunos B no sean A'}. ${no}`);
    }
    if (cc) {
      const mismoPar = (c.s === cc.s && c.p === cc.p) || (c.s === cc.p && c.p === cc.s);
      if (cc.f === 'E' && c.f === 'I' && mismoPar) return err('RMP74-algunos-por-ninguno', op, `Concluiste «algunos» donde las premisas dicen «ninguno». En el diagrama, la zona común de ${T[0]} y ${T[2]} queda tachada: no puede haber nadie ahí. Se deduce ${fr(cc)}.`);
      if (cc.f === 'O' && c.f === 'E' && mismoPar) return err('RMP74-generalizar', op, `Generalizaste: las premisas solo aseguran que algunos ${T[cc.s]} no son ${T[cc.p]}, no que ninguno lo sea. ${no}`);
      if (cc.f === 'I' && c.f === 'A') return err('RMP74-generalizar', op, `Generalizaste: las premisas solo aseguran que algunos ${T[c.s]} son ${T[c.p]}, no que lo sean todos. ${no}`);
      if (cc.f === 'I' && c.f === 'O') return err('RMP75-algunos-no-todos', op, `Leíste «algunos son» como «solo algunos son, y otros no». «Algunos» quiere decir «por lo menos uno»: no dice nada de los demás. ${no}`);
    }
    for (let i = 0; i < 2; i++) {
      const q = prem[i];
      if (q.f === 'A' || q.f === 'O') {
        const mod = prem.map((x, j) => (j === i ? conversa(x) : x));
        if (validaSilogismo(mod, clave, true)) return err('RMP73-conversion', op, `Leíste ${fr(q)} al revés, como ${fr(conversa(q))}. No es lo mismo: ${q.f === 'A' ? `que todos los ${T[q.s]} sean ${T[q.p]} no dice que todos los ${T[q.p]} sean ${T[q.s]}` : `que algunos ${T[q.s]} no sean ${T[q.p]} no dice que algunos ${T[q.p]} no sean ${T[q.s]}`}. ${no}`);
      }
    }
    for (let i = 0; i < 2; i++) {
      const q = prem[i];
      if (q.f === 'I' || q.f === 'O') {
        const mod = prem.map((x, j) => (j === i ? { f: q.f === 'I' ? 'A' : 'E', s: q.s, p: q.p } : x));
        if (validaSilogismo(mod, clave, true)) return err('RMP74-generalizar', op, `Leíste ${fr(q)} como si dijera ${fr({ f: q.f === 'I' ? 'A' : 'E', s: q.s, p: q.p })}. «Algunos» es «por lo menos uno», no «todos». ${no}`);
      }
    }
    for (let i = 0; i < 2; i++) {
      const q = prem[i];
      if (q.f === 'I') {
        const mod = prem.concat([{ f: 'O', s: q.s, p: q.p }]);
        if (modelosSilogismo(mod, true).length && validaSilogismo(mod, clave, true)) return err('RMP75-algunos-no-todos', op, `Leíste ${fr(q)} como «solo algunos, y otros no». «Algunos» quiere decir «por lo menos uno»: no dice que haya ${T[q.s]} que no sean ${T[q.p]}. ${no}`);
      }
    }
    // Atmósfera: el cuantificador de las premisas pasa a la conclusión sin que el término medio conecte.
    const neg = prem.some(q => q.f === 'E' || q.f === 'O'), part = prem.some(q => q.f === 'I' || q.f === 'O');
    const fAtm = neg ? (part ? 'O' : 'E') : (part ? 'I' : 'A');
    if (c.f === fAtm) {
      const medio = T[1];
      return err('RMP76-medio-no-conecta', op, `Encadenaste las dos premisas a través de los ${medio}, pero ellos no conectan a los ${T[0]} con los ${T[2]}: ${correcta === 'sil:nada' ? 'las premisas no obligan ninguna conclusión' : 'lo que sí se deduce es otra cosa'}. ${no}`);
    }
    return null;
  }

  function figuraVenn(prem, T, idf) {
    const C = [[130, 120], [180, 205], [230, 120]], R = 78; // X, M, Z
    const COL = ['var(--c-o)', 'var(--c-i)', 'var(--c-h)'];
    const CENTRO = { 1: [88, 100], 2: [180, 258], 4: [272, 100], 3: [126, 182], 6: [234, 182], 5: [180, 82], 7: [180, 148] };
    const vacias = new Set();
    for (const q of prem) if (q.f === 'A' || q.f === 'E') for (let r = 1; r < 8; r++) {
      const a = enT(r, q.s), b = enT(r, q.p);
      if ((q.f === 'A' && a && !b) || (q.f === 'E' && a && b)) vacias.add(r);
    }
    const nombreZona = r => {
      const dentro = [0, 1, 2].filter(t => enT(r, t)).map(t => T[t]), fuera = [0, 1, 2].filter(t => !enT(r, t)).map(t => T[t]);
      return `la de los que son ${lista(dentro)}${fuera.length ? ` pero no ${fuera.join(' ni ')}` : ''}`;
    };
    let defs = '', capas = '';
    [0, 1, 2].forEach(t => { defs += `<clipPath id="${idf}c${t}"><circle cx="${C[t][0]}" cy="${C[t][1]}" r="${R}"/></clipPath>`; });
    [0, 1, 2].forEach(t => { defs += `<mask id="${idf}m${t}"><rect x="0" y="0" width="360" height="320" style="fill:white"/><circle cx="${C[t][0]}" cy="${C[t][1]}" r="${R}" style="fill:black"/></mask>`; });
    for (const r of [...vacias].sort()) {
      let forma = `<rect x="0" y="0" width="360" height="320" style="fill:var(--muted);opacity:.45"${[0, 1, 2].filter(t => !enT(r, t)).map(t => ` mask="url(#${idf}m${t})"`).slice(0, 1).join('')}/>`;
      // Un rect solo admite una máscara: las otras exclusiones van como grupos con máscara.
      const fuera = [0, 1, 2].filter(t => !enT(r, t));
      for (const t of fuera.slice(1)) forma = `<g mask="url(#${idf}m${t})">${forma}</g>`;
      for (const t of [0, 1, 2].filter(t => enT(r, t))) forma = `<g clip-path="url(#${idf}c${t})">${forma}</g>`;
      capas += forma;
    }
    const cruces = [], altCruces = [];
    for (const q of prem) if (q.f === 'I' || q.f === 'O') {
      const zonas = [1, 2, 3, 4, 5, 6, 7].filter(r => enT(r, q.s) && (q.f === 'I' ? enT(r, q.p) : !enT(r, q.p)) && !vacias.has(r));
      if (zonas.length === 1) { cruces.push(CENTRO[zonas[0]]); altCruces.push(`una × en ${nombreZona(zonas[0])} (por «${frase(q.f, q.s, q.p, T, false)}»)`); }
      else if (zonas.length === 2) {
        // La × va sobre el borde del círculo que separa las dos zonas.
        const [a, b] = zonas.map(r => CENTRO[r]);
        const t = [0, 1, 2].find(t => enT(zonas[0], t) !== enT(zonas[1], t));
        let mejor = [a[0], a[1]], dmin = Infinity;
        for (let k = 0; k <= 100; k++) {
          const x = a[0] + (b[0] - a[0]) * k / 100, y = a[1] + (b[1] - a[1]) * k / 100;
          const d = Math.abs(Math.hypot(x - C[t][0], y - C[t][1]) - R);
          if (d < dmin) { dmin = d; mejor = [x, y]; }
        }
        cruces.push(mejor);
        altCruces.push(`una × sobre la línea entre ${nombreZona(zonas[0])} y ${nombreZona(zonas[1])}, porque «${frase(q.f, q.s, q.p, T, false)}» no dice en cuál de las dos está`);
      }
    }
    const circulos = [0, 1, 2].map(t => `<circle cx="${C[t][0]}" cy="${C[t][1]}" r="${R}" style="fill:none;stroke:${COL[t]};stroke-width:3"/>`).join('');
    const etiquetas = `<text x="22" y="30" style="font-size:16px;fill:${COL[0]}">${P.xml(T[0])}</text>`
      + `<text x="338" y="30" text-anchor="end" style="font-size:16px;fill:${COL[2]}">${P.xml(T[2])}</text>`
      + `<text x="180" y="308" text-anchor="middle" style="font-size:16px;fill:${COL[1]}">${P.xml(T[1])}</text>`;
    const xs = cruces.map(([x, y]) => `<text x="${x.toFixed(0)}" y="${(y + 8).toFixed(0)}" text-anchor="middle" style="font-size:24px;font-weight:bold;fill:currentColor">×</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320" role="img"><defs>${defs}</defs>${capas}${circulos}${etiquetas}${xs}</svg>`;
    const zonasV = [...vacias].sort().map(nombreZona);
    const alt = `Diagrama de Venn con tres círculos: ${T[0]} arriba a la izquierda, ${T[2]} arriba a la derecha y ${T[1]} abajo. `
      + (zonasV.length ? `Zonas tachadas (vacías): ${zonasV.join('; ')}. ` : 'No hay zonas tachadas. ')
      + (altCruces.length ? `Marcas de que hay alguien: ${altCruces.join('; ')}.` : 'No hay marcas ×.');
    return { svg, alt };
  }

  function construirSilogismo(rng, semilla) {
    const nada = rng.sig() < 0.2;
    const fs = ['A', 'E', 'I', 'O'];
    const q1 = { f: rng.elegir(fs), ...(rng.moneda() ? { s: 1, p: 2 } : { s: 2, p: 1 }) };
    const q2 = { f: rng.elegir(fs), ...(rng.moneda() ? { s: 0, p: 1 } : { s: 1, p: 0 }) };
    const prem = rng.moneda() ? [q1, q2] : [q2, q1];
    const val = conclusionesValidas(prem);
    let correcta;
    if (nada) { if (val.existenciales.length) return null; correcta = 'sil:nada'; }
    else { if (val.booleanas.length !== 1) return null; correcta = val.booleanas[0]; }
    const T = rng.barajar(CLASES).slice(0, 3).map(c => c[1]);
    const errores = [];
    if (correcta !== 'sil:nada') {
      errores.push(err('RMP78-nada', opcionSil('sil:nada', T), `Sí se deduce una conclusión: «${opcionSil(correcta, T).texto.slice(0, -1)}». Dibuja las dos premisas en el mismo diagrama y mira la zona de los ${T[0]} y los ${T[2]}.`));
    }
    for (const k of rng.barajar(CONCLUSIONES)) {
      if (k === correcta || val.existenciales.includes(k)) continue;
      const e = errorSilogismo(prem, k, correcta, T);
      if (e) errores.push(e);
    }
    // Una premisa con «todos» o «algunos… no» leída al revés, ofrecida como conclusión.
    for (const q of rng.barajar(prem)) {
      if (q.f !== 'A' && q.f !== 'O') continue;
      const k = proposicion(q.f, q.p, q.s);
      if (validaSilogismo(prem, k, true)) continue;
      const fq = '«' + frase(q.f, q.s, q.p, T, false) + '»';
      errores.push(err('RMP73-conversion', opcionSil(k, T), `Diste vuelta la premisa ${fq}. ${q.f === 'A' ? `Que todos los ${T[q.s]} sean ${T[q.p]} no dice que todos los ${T[q.p]} sean ${T[q.s]}` : `Que algunos ${T[q.s]} no sean ${T[q.p]} no dice que algunos ${T[q.p]} no sean ${T[q.s]}`}. Las premisas permiten que ${contraejemplo(leerClave(k), T)}.`));
    }
    if (errores.length < 3) return null;
    const alternativas = P.armarTexto({ correcta: opcionSil(correcta, T), errores, rng });
    if (alternativas.length < 4) return null;
    const lugar = rng.elegir(LUGARES);
    const enunciado = [`${lugar} se sabe que:`];
    prem.forEach((q, i) => enunciado.push(` ${ROMANOS[i]}. `, ...frase(q.f, q.s, q.p, T, true), '.'));
    const pregunta = ['¿Qué conclusión se deduce necesariamente de I y II?'];
    const fig = figuraVenn(prem, T, 'vn' + Math.floor(rng.sig() * 1e6).toString(36).replace(/^[0-9a-f]+/, 'q'));
    const cc = correcta === 'sil:nada' ? null : leerClave(correcta);
    const pasoPremisa = q => {
      const t = ['«', ...frase(q.f, q.s, q.p, T, true), '»'];
      if (q.f === 'A') return [...t, `: se tacha la parte de los ${T[q.s]} que queda fuera de los ${T[q.p]}.`];
      if (q.f === 'E') return [...t, `: se tacha la zona común de los ${T[q.s]} y los ${T[q.p]}.`];
      if (q.f === 'I') return [...t, `: se pone una × en la zona común de los ${T[q.s]} y los ${T[q.p]} (si una parte ya está tachada, la × va en la otra; si no, sobre la línea).`];
      return [...t, `: se pone una × en los ${T[q.s]} que no son ${T[q.p]} (si una parte ya está tachada, la × va en la otra; si no, sobre la línea).`];
    };
    const orden = prem.slice().sort((a, b) => ('AE'.includes(a.f) ? 0 : 1) - ('AE'.includes(b.f) ? 0 : 1));
    const solucion = [
      ['Se dibujan tres círculos, uno por clase: ', v('X', T[0]), ', ', v('M', T[1]), ' y ', v('Z', T[2]), '. Primero se marcan las premisas con «todos» o «ningún»; después, las de «algunos».'],
      ...orden.map(pasoPremisa),
    ];
    if (cc) {
      const lectura = cc.f === 'A' ? `toda la parte de los ${T[cc.s]} fuera de los ${T[cc.p]} quedó tachada`
        : cc.f === 'E' ? `toda la zona común de los ${T[0]} y los ${T[2]} quedó tachada`
        : cc.f === 'I' ? `hay una × dentro de la zona común de los ${T[0]} y los ${T[2]}`
        : `hay una × entre los ${T[cc.s]} que no son ${T[cc.p]}`;
      solucion.push([`En el diagrama, ${lectura}. Por eso: `, ...frase(cc.f, cc.s, cc.p, T, true), '.']);
      solucion.push(['Las otras conclusiones piden algo que el diagrama no asegura (una zona tachada o una × que no está), así que no se deducen. «Algunos» quiere decir «por lo menos uno».']);
    } else {
      solucion.push([`Entre los `, v('X', T[0]), ' y los ', v('Z', T[2]), ' el diagrama no obliga nada: para cada conclusión queda una zona sin decidir (sin tachar y sin ×) donde puede fallar.']);
      solucion.push([`Los `, v('M', T[1]), ' no conectan a las otras dos clases: para encadenar, una premisa tiene que hablar de todos los ', v('M', T[1]), ' (o de ninguno), y aquí no alcanza.']);
    }
    return {
      enunciado, pregunta, solucion, alternativas, correcta: opcionSil(correcta, T), figuraSolucion: fig,
      variables: { X: { nombre: T[0], color: 'o' }, M: { nombre: T[1] + ' (término medio)', color: 'i' }, Z: { nombre: T[2], color: 'h' } },
      datos: { tipo: 'silogismo', terminos: T, premisas: prem, opciones: alternativas.map(a => a.valor) },
    };
  }

  // =====================================================================================
  // 2 y 3. Casos con pistas: motor común (frascos con repetición; personas sin repetición)
  // =====================================================================================
  const lit = (asig, l) => (asig[l.o] === l.c) !== !!l.neg;
  function cumple(asig, q) {
    if (q.t === 'cond') return !lit(asig, q.a) || lit(asig, q.b);
    if (q.t === 'bicond') return lit(asig, q.a) === lit(asig, q.b);
    if (q.t === 'contra') return !lit(asig, q.a);
    if (q.t === 'hecho') return lit(asig, q.a) && lit(asig, q.b);
    if (q.t === 'nocond') return lit(asig, q.a) && !lit(asig, q.b);
    if (q.t === 'ninguna') return !lit(asig, q.a) && !lit(asig, q.b);
    if (q.t === 'no') return asig[q.o] !== q.c;
    if (q.t === 'es') return asig[q.o] === q.c;
    if (q.t === 'distintos') return asig[q.o1] !== asig[q.o2];
    if (q.t === 'todas') return [0, 1, 2].every(c => asig.includes(c));
    throw new Error('pista desconocida ' + q.t);
  }
  const TODAS_FRASCOS = (() => { const out = []; for (let i = 0; i < 81; i++) out.push([i % 3, Math.floor(i / 3) % 3, Math.floor(i / 9) % 3, Math.floor(i / 27) % 3]); return out; })();
  const PERMS = (() => { const out = []; const rec = (a, usados) => { if (a.length === 4) { out.push(a.slice()); return; } for (let c = 0; c < 4; c++) if (!usados[c]) { usados[c] = 1; a.push(c); rec(a, usados); a.pop(); usados[c] = 0; } }; rec([], []); return out; })();
  const casosFrascos = pistas => TODAS_FRASCOS.filter(a => pistas.every(q => cumple(a, q)));
  const repartos = pistas => PERMS.filter(a => pistas.every(q => cumple(a, q)));

  function evaluaSC(clave, a) {
    const [, t, x, y] = clave.split(':'), i = +x, j = +y;
    if (t === 'es') return a[i] === j;
    if (t === 'no') return a[i] !== j;
    if (t === 'igual') return a[i] === a[j];
    if (t === 'dist') return a[i] !== a[j];
    if (t === 'alguno') return a.includes(i);
    if (t === 'ninguno') return !a.includes(i);
    throw new Error('clave ' + clave);
  }
  const necesaria = (pistas, clave) => casosFrascos(pistas).every(a => evaluaSC(clave, a));

  // --------- Pieles ---------
  const FRASCOS = ['A', 'B', 'C', 'D'];
  const PIELES_SC = {
    frascos: { obj: 'frasco', objs: 'frascos', el: 'El', los: 'Los', un: 'un', ningun: 'Ningún', tiene: 'tiene', tienen: 'tienen', tenga: 'tenga', tuviera: 'tuviera', inf: 'tener', tendria: 'tendría',
      cosas: [['sal', 'azúcar', 'arroz'], ['quinua', 'maíz', 'trigo'], ['canela', 'clavo', 'anís']], intro: (c) => ['Hay cuatro frascos, A, B, C y D. Cada uno tiene una sola cosa: ', c[0], ', ', c[1], ' o ', c[2], '. Dos frascos pueden tener lo mismo.'] },
    cajas: { obj: 'caja', objs: 'cajas', el: 'La', los: 'Las', un: 'una', ningun: 'Ninguna', tiene: 'guarda', tienen: 'guardan', tenga: 'guarde', tuviera: 'guardara', inf: 'guardar', tendria: 'guardaría',
      cosas: [['un trompo', 'un yoyo', 'una pelota'], ['un lápiz', 'un borrador', 'una regla']], intro: (c) => ['Hay cuatro cajas, A, B, C y D. Cada una guarda una sola cosa: ', c[0], ', ', c[1], ' o ', c[2], '. Dos cajas pueden guardar lo mismo.'] },
  };
  const CV = ['a', 'b', 'c'];

  // Segmentos de texto de un literal «el frasco B (no) tiene sal».
  function segLit(l, pi, cosas, color, verbo) {
    const cosa = color ? v(CV[l.c], cosas[l.c]) : cosas[l.c];
    return [`${pi.el.toLowerCase()} ${pi.obj} ${FRASCOS[l.o]} ${l.neg ? 'no ' : ''}${verbo || pi.tiene} `, cosa];
  }
  const plano = segs => segs.map(s => (typeof s === 'string' ? s : s.t)).join('');
  function segPistaSC(q, pi, cosas, color = true) {
    const L = (l, verbo) => segLit(l, pi, cosas, color, verbo);
    const cs = c => (color ? v(CV[c], cosas[c]) : cosas[c]);
    const M = segs => { const s = segs.slice(); s[0] = mayus(s[0]); return s; };
    if (q.t === 'cond' || q.t === 'bicond') return M(['si ', ...L(q.a), q.t === 'cond' ? ', entonces ' : ', entonces ', ...L(q.b), q.t === 'bicond' ? ', y si no, no' : '']);
    if (q.t === 'nocond') return ['No es cierto que, si ', ...L(q.a), ', ', ...L(q.b, pi.tenga)];
    if (q.t === 'ninguna') return M(['ni ', ...L({ ...q.a, neg: false }).slice(0), ' ni ', ...L({ ...q.b, neg: false })]);
    if (q.t === 'no') return M(L({ o: q.o, c: q.c, neg: true }));
    if (q.t === 'es') return M(L({ o: q.o, c: q.c, neg: false }));
    if (q.t === 'distintos') return [`${pi.los} ${pi.objs} ${FRASCOS[q.o1]} y ${FRASCOS[q.o2]} no ${pi.tienen} lo mismo`];
    if (q.t === 'todas') return [`Hay por lo menos ${pi.un} ${pi.obj} con cada cosa`];
    return [];
  }
  function textoSC(clave, pi, cosas) {
    const [, t, x, y] = clave.split(':'), i = +x, j = +y;
    if (t === 'es') return `${pi.el} ${pi.obj} ${FRASCOS[i]} ${pi.tiene} ${cosas[j]}.`;
    if (t === 'no') return `${pi.el} ${pi.obj} ${FRASCOS[i]} no ${pi.tiene} ${cosas[j]}.`;
    if (t === 'igual') return `${pi.los} ${pi.objs} ${FRASCOS[i]} y ${FRASCOS[j]} ${pi.tienen} lo mismo.`;
    if (t === 'dist') return `${pi.los} ${pi.objs} ${FRASCOS[i]} y ${FRASCOS[j]} ${pi.tienen} cosas distintas.`;
    if (t === 'alguno') return `Por lo menos ${pi.un} ${pi.obj} ${pi.tiene} ${cosas[i]}.`;
    return `${pi.ningun} ${pi.obj} ${pi.tiene} ${cosas[i]}.`;
  }
  // Por qué la afirmación es falsa en el caso a: «ahí el frasco B tiene sal».
  function fallaEn(clave, a, pi, cosas) {
    const [, t, x, y] = clave.split(':'), i = +x, j = +y;
    const de = o => `${pi.el.toLowerCase()} ${pi.obj} ${FRASCOS[o]} ${pi.tiene} ${cosas[a[o]]}`;
    if (t === 'es') return `ahí ${de(i)}, no ${cosas[j]}`;
    if (t === 'no') return `ahí ${pi.el.toLowerCase()} ${pi.obj} ${FRASCOS[i]} sí ${pi.tiene} ${cosas[j]}`;
    if (t === 'igual') return `ahí ${de(i)} y ${de(j)}`;
    if (t === 'dist') return `ahí ${pi.los.toLowerCase()} ${pi.objs} ${FRASCOS[i]} y ${FRASCOS[j]} ${pi.tienen} ${cosas[a[i]]}`;
    if (t === 'alguno') return `ahí ${pi.ningun.toLowerCase()} ${pi.obj} ${pi.tiene} ${cosas[i]}`;
    const o = a.indexOf(i);
    return `ahí ${de(o)}`;
  }
  // ¿La tabla ya deja decidida (como cierta) la afirmación?
  function decidida(clave, celda) {
    const [, t, x, y] = clave.split(':'), i = +x, j = +y;
    const tiene = o => celda[o].indexOf(true);
    if (t === 'es') return celda[i][j] === true;
    if (t === 'no') return celda[i][j] === false;
    if (t === 'igual') return tiene(i) >= 0 && tiene(i) === tiene(j);
    if (t === 'dist') return (tiene(i) >= 0 && celda[j][tiene(i)] === false) || (tiene(j) >= 0 && celda[i][tiene(j)] === false);
    if (t === 'alguno') return celda.some(f => f[i] === true);
    return celda.every(f => f[i] === false);
  }
  const casoTexto = (a, cosas) => a.map((c, o) => `${FRASCOS[o]}: ${cosas[c]}`).join(', ');

  function todasLasAfirmaciones() {
    const out = [];
    for (let o = 0; o < 4; o++) for (let c = 0; c < 3; c++) out.push(`sc:es:${o}:${c}`, `sc:no:${o}:${c}`);
    for (let o = 0; o < 4; o++) for (let p = o + 1; p < 4; p++) out.push(`sc:igual:${o}:${p}`, `sc:dist:${o}:${p}`);
    for (let c = 0; c < 3; c++) out.push(`sc:alguno:${c}`, `sc:ninguno:${c}`);
    return out;
  }
  const AFIRMACIONES = todasLasAfirmaciones();

  function pistaAlAzarSC(rng) {
    const l = () => ({ o: rng.entero(0, 3), c: rng.entero(0, 2), neg: rng.sig() < 0.25 });
    const x = rng.sig();
    if (x < 0.5) { const a = l(); let b = l(); while (b.o === a.o) b = l(); return { t: 'cond', a, b }; }
    if (x < 0.72) return { t: 'no', o: rng.entero(0, 3), c: rng.entero(0, 2) };
    if (x < 0.8) { const a = { ...l(), neg: false }; let b = { ...l(), neg: false }; while (b.o === a.o) b = { ...l(), neg: false }; return { t: 'nocond', a, b }; }
    if (x < 0.9) { const o1 = rng.entero(0, 3); let o2 = rng.entero(0, 3); while (o2 === o1) o2 = rng.entero(0, 3); return { t: 'distintos', o1: Math.min(o1, o2), o2: Math.max(o1, o2) }; }
    if (x < 0.96) return { t: 'todas' };
    return { t: 'es', o: rng.entero(0, 3), c: rng.entero(0, 2) };
  }
  const esCondicional = q => q.t === 'cond' || q.t === 'nocond';

  // Lecturas equivocadas de cada pista condicional: { id, pistas modificadas, cómo se leyó }.
  function lecturas(pistas, segPista) {
    const out = [];
    pistas.forEach((q, i) => {
      const cambia = nueva => pistas.map((x, j) => (j === i ? nueva : x));
      const dicha = '«' + plano(segPista(q, false)) + '»';
      if (q.t === 'cond') {
        const rec = { t: 'cond', a: q.b, b: q.a }, inv = { t: 'cond', a: { ...q.a, neg: !q.a.neg }, b: { ...q.b, neg: !q.b.neg } };
        out.push({ id: 'RMP70-bicondicional', pistas: cambia({ t: 'bicond', a: q.a, b: q.b }), como: `Leíste ${dicha} como si también dijera «${plano(segPista(rec, false))}». Un «si…, entonces…» va en un solo sentido: no dice qué pasa cuando no se cumple la primera parte.`, i });
        out.push({ id: 'RMP71-reciproca', pistas: cambia(rec), como: `Usaste la recíproca de ${dicha}: «${plano(segPista(rec, false))}». La recíproca no se deduce de la pista: que se cumpla la segunda parte no obliga a la primera.`, i });
        out.push({ id: 'RMP71-inversa', pistas: cambia(inv), como: `Negaste las dos partes de ${dicha} y usaste «${plano(segPista(inv, false))}». Eso no se deduce: si la primera parte no se cumple, la pista no dice nada.`, i });
      } else if (q.t === 'nocond') {
        out.push({ id: 'RMP71-negacion', pistas: cambia({ t: 'ninguna', a: q.a, b: q.b }), como: `Negaste mal la pista ${dicha}: la leíste como «${plano(segPista({ t: 'ninguna', a: q.a, b: q.b }, false))}». Un «si…, entonces…» solo es falso cuando la primera parte se cumple y la segunda no; así que la pista dice que la primera parte sí se cumple.`, i });
      } else if (q.t === 'contra') {
        // Leer la primera parte como un dato («si Ana fuera de Puno…» → «Ana es de Puno»). Tomarlo entero
        // como hecho (las dos partes) no sirve de distractor: con la otra lectura del contrafáctico no deja casos.
        out.push({ id: 'RMP79-contrafactico', pistas: cambia({ t: 'hecho', a: q.a, b: q.a }), como: `Tomaste la primera parte de ${dicha} como un dato. «Si… fuera…, sería…» habla de algo que no pasa: dice que la primera parte no se cumple.`, i });
      }
    });
    return out;
  }

  // El error del bicondicional es la trampa que más se repite: la mitad de las veces va primero.
  const primeroBicondicional = (rng, ls) => { const b = rng.barajar(ls); return rng.moneda() ? b.filter(L => L.id === 'RMP70-bicondicional').concat(b.filter(L => L.id !== 'RMP70-bicondicional')) : b; };

  // ----- Deducción paso a paso (para la solución): propagación sobre una tabla de casillas -----
  // celda[o][c]: true, false o null. perm: cada cosa la tiene uno solo (asignación).
  // ini (opcional): { celda, porque, o, c } para seguir desde una tabla ya trabajada suponiendo «o tiene c».
  // tx: { fila(o), columna(c), sinOpcion(o), nadie(c) } con los textos de cada piel.
  function deducir(pistas, n, k, perm, nombreLit, tx, ini = null) {
    const celda = ini ? ini.celda.map(f => f.slice()) : Array.from({ length: n }, () => Array(k).fill(null));
    const pasos = [];
    const porque = ini ? ini.porque.map(f => f.slice()) : Array.from({ length: n }, () => Array(k).fill(null));
    let choque = false;
    // El primer choque se cuenta con su motivo: «Pero eso choca con …».
    const chocar = texto => { if (!choque) { choque = true; pasos.push(texto); } };
    const poner = (o, c, val, razon = null) => {
      if (celda[o][c] === val) return false;
      if (celda[o][c] !== null) { chocar(`Pero eso choca con que ${nombreLit({ o, c, neg: !celda[o][c] })}.`); return false; }
      celda[o][c] = val; porque[o][c] = razon; return true;
    };
    // Un literal ya sabido, con la razón si salió de descartar («porque … »).
    const hecho = l => { const r = porque[l.o][l.c]; return nombreLit(l) + (r ? ` (porque ${r})` : ''); };
    const valorLit = l => (celda[l.o][l.c] === null ? null : celda[l.o][l.c] !== !!l.neg);
    const ponerLit = (l, val) => poner(l.o, l.c, val !== !!l.neg);
    const directos = [];
    if (ini) poner(ini.o, ini.c, true);
    if (!ini) pistas.forEach(q => {
      if (q.t === 'no' && poner(q.o, q.c, false)) directos.push(nombreLit({ o: q.o, c: q.c, neg: true }));
      if (q.t === 'es' && poner(q.o, q.c, true)) directos.push(nombreLit({ o: q.o, c: q.c, neg: false }));
      if (q.t === 'contra' && ponerLit(q.a, false)) directos.push(nombreLit({ ...q.a, neg: !q.a.neg }) + ' (lo dice el «si… fuera»)');
      if (q.t === 'nocond') { ponerLit(q.a, true); ponerLit(q.b, false); directos.push(nombreLit(q.a) + ' y ' + nombreLit({ ...q.b, neg: !q.b.neg }) + ' (es lo único que hace falso un «si…, entonces…»)'); }
    });
    if (directos.length) pasos.push('Lo que las pistas dicen directamente: ' + directos.join('; ') + '.');
    for (let vuelta = 0; vuelta < 40 && !choque; vuelta++) {
      let cambio = false;
      for (let o = 0; o < n; o++) {
        const si = celda[o].indexOf(true);
        if (si >= 0) { for (let c = 0; c < k; c++) if (c !== si && poner(o, c, false, nombreLit({ o, c: si, neg: false }))) cambio = true; }
        else {
          const abiertas = [...Array(k).keys()].filter(c => celda[o][c] !== false);
          if (abiertas.length === 0) { chocar(`Pero eso choca: ${tx.sinOpcion(o)}.`); break; }
          if (abiertas.length === 1 && poner(o, abiertas[0], true)) { cambio = true; pasos.push(`${tx.fila(o)}: ${nombreLit({ o, c: abiertas[0], neg: false })}.`); }
        }
      }
      if (perm) for (let c = 0; c < k; c++) {
        const quien = [...Array(n).keys()].filter(o => celda[o][c] === true);
        if (quien.length > 1) { chocar(`Pero eso choca: ${nombreLit({ o: quien[0], c, neg: false })} y también ${nombreLit({ o: quien[1], c, neg: false })}, y ${tx.unico}.`); break; }
        if (quien.length === 1) { for (let o = 0; o < n; o++) if (o !== quien[0] && poner(o, c, false, nombreLit({ o: quien[0], c, neg: false }))) cambio = true; }
        else {
          const abiertos = [...Array(n).keys()].filter(o => celda[o][c] !== false);
          if (abiertos.length === 0) { chocar(`Pero eso choca: ${tx.nadie(c)}.`); break; }
          if (abiertos.length === 1 && poner(abiertos[0], c, true)) { cambio = true; pasos.push(`${tx.columna(c)}: ${nombreLit({ o: abiertos[0], c, neg: false })}.`); }
        }
      }
      pistas.forEach((q, i) => {
        if (q.t === 'cond') {
          if (valorLit(q.a) === true && valorLit(q.b) === null) { ponerLit(q.b, true); cambio = true; pasos.push(`Como ${hecho(q.a)}, la pista ${ROMANOS[i]} da: ${nombreLit(q.b)}.`); }
          else if (valorLit(q.b) === false && valorLit(q.a) === null) { ponerLit(q.a, false); cambio = true; pasos.push(`Como ${hecho({ ...q.b, neg: !q.b.neg })}, la primera parte de la pista ${ROMANOS[i]} no puede cumplirse: ${nombreLit({ ...q.a, neg: !q.a.neg })}.`); }
        } else if (q.t === 'distintos') {
          for (const [x, y] of [[q.o1, q.o2], [q.o2, q.o1]]) { const c = celda[x].indexOf(true); if (c >= 0 && celda[y][c] === true) chocar(`Pero eso choca con la pista ${ROMANOS[i]}: ${nombreLit({ o: x, c, neg: false })} y ${nombreLit({ o: y, c, neg: false })}.`); if (c >= 0 && celda[y][c] === null) { poner(y, c, false); cambio = true; pasos.push(`Por la pista ${ROMANOS[i]}, ${nombreLit({ o: y, c, neg: true })}.`); } }
        } else if (q.t === 'todas') {
          for (let c = 0; c < k; c++) {
            const abiertos = [...Array(n).keys()].filter(o => celda[o][c] !== false);
            if (abiertos.length === 0) chocar(`Pero eso choca con la pista ${ROMANOS[i]}: ${tx.nadie(c)}.`);
            if (abiertos.length === 1 && celda[abiertos[0]][c] === null) { poner(abiertos[0], c, true); cambio = true; pasos.push(`Por la pista ${ROMANOS[i]}, ${tx.columna(c)}: ${nombreLit({ o: abiertos[0], c, neg: false })}.`); }
          }
        }
        if (q.t === 'cond' && valorLit(q.a) === true && valorLit(q.b) === false) chocar(`Pero eso choca con la pista ${ROMANOS[i]}: ${hecho(q.a)}, y sin embargo ${hecho({ ...q.b, neg: !q.b.neg })}.`);
      });
      if (!cambio) break;
    }
    return { celda, porque, pasos, choque };
  }

  function construirSiempre(rng, semilla) {
    const pielId = rng.elegir(['frascos', 'frascos', 'cajas']);
    const pi = PIELES_SC[pielId], cosas = rng.elegir(pi.cosas);
    const npistas = rng.entero(3, 5);
    const pistas = [];
    let usadas = new Set();
    while (pistas.length < npistas) {
      const q = pistaAlAzarSC(rng);
      if ((q.t === 'todas' || q.t === 'nocond') && usadas.has(q.t)) continue;
      usadas.add(q.t); pistas.push(q);
    }
    if (!pistas.some(esCondicional) || pistas.filter(q => q.t === 'cond').length === 0) return null;
    const casos = casosFrascos(pistas);
    if (casos.length < 2 || casos.length > 4) return null;
    if (pistas.filter(q => q.t === 'no' || q.t === 'es').length > 2) return null;
    // Cada pista hace falta.
    for (let i = 0; i < pistas.length; i++) if (casosFrascos(pistas.filter((_, j) => j !== i)).length === casos.length) return null;
    const sinCond = pistas.filter(q => !esCondicional(q));
    const nec = AFIRMACIONES.filter(c => casos.every(a => evaluaSC(c, a)));
    const casosSinCond = casosFrascos(sinCond);
    const candidatas = nec.filter(c => !casosSinCond.every(a => evaluaSC(c, a)));
    if (!candidatas.length) return null;
    const pref = candidatas.filter(c => /sc:(es|igual)/.test(c));
    const correctaClave = rng.elegir(pref.length && rng.sig() < 0.8 ? pref : candidatas);
    const op = clave => ({ clave, texto: textoSC(clave, pi, cosas) });
    const segP = (q, color = true) => segPistaSC(q, pi, cosas, color);
    const errores = [];
    const usadasErr = new Set([correctaClave]);
    // Errores de lectura de los condicionales.
    for (const L of primeroBicondicional(rng, lecturas(pistas, segP))) {
      const mal = casosFrascos(L.pistas);
      if (!mal.length) continue;
      const nuevas = rng.barajar(AFIRMACIONES.filter(c => !usadasErr.has(c) && mal.every(a => evaluaSC(c, a)) && !nec.includes(c)));
      const k = nuevas[0];
      if (!k) continue;
      const contra = casos.find(a => !evaluaSC(k, a));
      usadasErr.add(k);
      errores.push(err(L.id, op(k), `${L.como} Con ${casoTexto(contra, cosas)} se cumplen todas las pistas, y ${fallaEn(k, contra, pi, cosas)}.`));
      if (errores.length >= 2) break;
    }
    if (!errores.length) return null;
    // Posibles pero no necesarias: las que se cumplen en más casos primero.
    const posibles = rng.barajar(AFIRMACIONES.filter(c => !usadasErr.has(c) && !nec.includes(c) && casos.some(a => evaluaSC(c, a))))
      .map(c => ({ c, n: casos.filter(a => evaluaSC(c, a)).length })).sort((x, y) => y.n - x.n);
    for (const { c } of posibles) {
      if (errores.length >= 4) break;
      const no = rng.elegir(casos.filter(a => !evaluaSC(c, a)));
      // Que no se parezca a una pista dicha tal cual.
      usadasErr.add(c);
      errores.push(err('RMP77-posible-no-necesaria', op(c), `Puede pasar, pero no siempre. Con ${casoTexto(no, cosas)} también se cumplen todas las pistas, y ${fallaEn(c, no, pi, cosas)}. «Siempre cierto» pide que valga en todos los casos que dejan las pistas.`));
    }
    if (errores.length < 3) return null;
    const alternativas = P.armarTexto({ correcta: op(correctaClave), errores, rng });
    if (alternativas.length < 4) return null;
    const pintar = segs => segs.map(s => (typeof s === 'string' ? s : s));
    const intro = pi.intro(cosas.map((c, i) => v(CV[i], c)));
    const enunciado = [...intro, ' Se sabe que:'];
    pistas.forEach((q, i) => enunciado.push(` ${ROMANOS[i]}. `, ...pintar(segP(q)), '.'));
    const pregunta = ['¿Cuál de las siguientes afirmaciones es siempre cierta?'];
    const nombreLit = l => plano(segLit(l, pi, cosas, false));
    const uno = pi.un === 'una' ? 'una' : 'uno', alg = pi.un === 'una' ? 'alguna' : 'algún';
    const tx = {
      fila: o => `${pi.el} ${pi.obj} ${FRASCOS[o]} no puede ${pi.inf} otra cosa`,
      columna: c => `${alg} ${pi.obj} ${pi.tiene} ${cosas[c]}, y solo puede ser ${uno}`,
      sinOpcion: o => `${pi.el.toLowerCase()} ${pi.obj} ${FRASCOS[o]} se queda sin ninguna cosa posible`,
      nadie: c => `${pi.ningun.toLowerCase()} ${pi.obj} ${pi.tendria} ${cosas[c]}`,
    };
    const d = deducir(pistas, 4, 3, false, nombreLit, tx);
    const lineas = d.pasos.slice();
    const ok = textoSC(correctaClave, pi, cosas);
    const okSin = ok.charAt(0).toLowerCase() + ok.slice(1, -1);
    let sinPrueba = false;
    if (decidida(correctaClave, d.celda)) lineas.push(`Por lo tanto, ${okSin}.`);
    else {
      // Prueba por casos: un frasco con varias opciones; cada rama choca o deja decidida la afirmación.
      let mejor = null;
      for (let o = 0; o < 4 && !mejor; o++) {
        const abiertas = [0, 1, 2].filter(c => d.celda[o][c] === null);
        if (abiertas.length < 2 || d.celda[o].includes(true)) continue;
        const ramas = abiertas.map(c => ({ c, br: deducir(pistas, 4, 3, false, nombreLit, tx, { celda: d.celda, porque: d.porque, o, c }) }));
        if (ramas.every(r => r.br.choque || decidida(correctaClave, r.br.celda)) && ramas.every(r => r.br.pasos.length <= 6)) mejor = { o, ramas };
      }
      if (mejor) {
        const nom = `${pi.el.toLowerCase()} ${pi.obj} ${FRASCOS[mejor.o]}`;
        lineas.push(`Todavía no se sabe qué ${pi.tiene} ${nom}: puede ${pi.inf} ${lista(mejor.ramas.map(r => cosas[r.c])).replace(/ y ([^ ]+( [^ ]+)?)$/, ' o $1')}. Se prueba cada opción.`);
        for (const r of mejor.ramas) {
          const pasos = r.br.pasos.length ? ' ' + minus(r.br.pasos.join(' ')) : '';
          lineas.push(r.br.choque
            ? `Si ${nom} ${pi.tuviera} ${cosas[r.c]}:${pasos} Así que ${nom} no ${pi.tiene} ${cosas[r.c]}.`
            : `Si ${nom} ${pi.tiene} ${cosas[r.c]}:${pasos || ' ya se ve.'} Ahí ${okSin}.`);
        }
        lineas.push(`En todas las opciones que no chocan, ${okSin}.`);
      } else sinPrueba = true;
    }
    if (sinPrueba) return null; // la solución tiene que mostrar el razonamiento, no solo la lista de casos
    lineas.push(`Comprobación: solo ${casos.length === 1 ? 'un caso cumple' : casos.length + ' casos cumplen'} todas las pistas: ${casos.map((a, i) => `(${i + 1}) ${casoTexto(a, cosas)}`).join('; ')}.`);
    lineas.push(`En ${casos.length === 2 ? 'los dos' : `los ${casos.length}`} se cumple que ${okSin}. Las otras afirmaciones fallan en por lo menos uno de esos casos.`);
    const pintarCosas = colorear(cosas.map((c, i) => [c, CV[i]]));
    const solucion = lineas.map(pintarCosas);
    return {
      enunciado, pregunta, solucion, alternativas, correcta: op(correctaClave),
      variables: { a: { nombre: cosas[0], color: 'o' }, b: { nombre: cosas[1], color: 'i' }, c: { nombre: cosas[2], color: 'h' } },
      datos: { tipo: 'siempre-cierto', piel: pielId, cosas, pistas, opciones: alternativas.map(a => a.valor) },
    };
  }

  // =====================================================================================
  // 3. Asignación con condicionales y contrafácticos
  // =====================================================================================
  const NOMBRES = ['Ana', 'Beto', 'Carla', 'Dante', 'Elsa', 'Fito', 'Gaby', 'Hugo', 'Inés', 'Julio', 'Kelly', 'Luis', 'Rosa', 'Saúl', 'Tania', 'Wilber'];
  const PIELES_AS = {
    talleres: { cosas: ['Física', 'Química', 'Historia', 'Arte', 'Música', 'Inglés'], pres: 'lleva', inf: 'llevar', unico: 'cada taller lo lleva una sola persona', subj: 'llevara', cond: 'llevaría', pre: '', que: 'taller',
      intro: (ps, cs) => [...ps, ' llevan cada uno un taller distinto: ', ...cs, '.'] },
    deportes: { cosas: ['vóley', 'fútbol', 'básquet', 'atletismo', 'natación', 'ajedrez'], pres: 'practica', inf: 'practicar', unico: 'cada deporte lo practica una sola persona', subj: 'practicara', cond: 'practicaría', pre: '', que: 'deporte',
      intro: (ps, cs) => [...ps, ' practican cada uno un deporte distinto: ', ...cs, '.'] },
    ciudades: { cosas: ['Puno', 'Juliaca', 'Cusco', 'Arequipa', 'Tacna', 'Ilave'], pres: 'es', inf: 'ser', unico: 'cada uno es de una ciudad distinta', subj: 'fuera', cond: 'sería', pre: 'de ', que: 'ciudad',
      intro: (ps, cs) => [...ps, ' son cada uno de una ciudad distinta: ', ...cs, '.'] },
  };
  const PV = ['p0', 'p1', 'p2', 'p3'];
  const conY = (xs, sep = ', ') => { const out = []; xs.forEach((x, i) => { if (i) out.push(i === xs.length - 1 ? ' y ' : sep); out.push(x); }); return out; };

  function segLitAS(l, pa, ps, cs, color, modo = 'pres') {
    const per = color ? v(PV[l.o], ps[l.o]) : ps[l.o];
    return [per, ` ${l.neg ? 'no ' : ''}${pa[modo]} ${pa.pre}${cs[l.c]}`];
  }
  function segPistaAS(q, pa, ps, cs, color = true) {
    const L = (l, m) => segLitAS(l, pa, ps, cs, color, m);
    if (q.t === 'cond') return ['Si ', ...L(q.a), ', entonces ', ...L(q.b)];
    if (q.t === 'bicond') return ['Si ', ...L(q.a), ', entonces ', ...L(q.b), ', y si no, no'];
    if (q.t === 'contra') return ['Si ', ...L(q.a, 'subj'), ', ', ...L(q.b, 'cond')];
    if (q.t === 'hecho') return [...L(q.a), ' y ', ...L(q.b)];
    if (q.t === 'no') return L({ o: q.o, c: q.c, neg: true });
    return [];
  }
  const textoAS = (clave, pa, ps, cs) => {
    const [t, x, y] = clave.split(':');
    if (t === 'cosa') return mayus(`${pa.pre}${cs[+x]}`);
    return `${ps[+x]} ${pa.pres} ${pa.pre}${cs[+y]}.`;
  };

  function pistaAlAzarAS(rng, tipo) {
    const l = neg => ({ o: rng.entero(0, 3), c: rng.entero(0, 3), neg: neg && rng.sig() < 0.25 });
    if (tipo === 'no') return { t: 'no', o: rng.entero(0, 3), c: rng.entero(0, 3) };
    const a = l(true); let b = l(tipo === 'cond'); while (b.o === a.o || b.c === a.c) b = l(tipo === 'cond');
    return { t: tipo, a, b };
  }

  function construirAsignacion(rng, semilla) {
    const pielId = rng.elegir(Object.keys(PIELES_AS)), pa = PIELES_AS[pielId];
    const ps = rng.barajar(NOMBRES).slice(0, 4).sort((x, y) => x.localeCompare(y, 'es'));
    const cs = rng.barajar(pa.cosas).slice(0, 4);
    let pistas = [pistaAlAzarAS(rng, 'contra'), pistaAlAzarAS(rng, 'cond')];
    for (let i = 0; i < 6; i++) pistas.push(pistaAlAzarAS(rng, rng.sig() < 0.55 ? 'cond' : (rng.sig() < 0.6 ? 'no' : 'contra')));
    if (repartos(pistas).length !== 1) return null;
    // Quitar las pistas que sobran, en orden al azar.
    for (const q of rng.barajar(pistas.slice())) {
      const sin = pistas.filter(x => x !== q);
      if (repartos(sin).length === 1) pistas = sin;
    }
    pistas = rng.barajar(pistas);
    if (!pistas.some(q => q.t === 'cond') || !pistas.some(q => q.t === 'contra') || pistas.length < 3 || pistas.length > 6) return null;
    const sol = repartos(pistas)[0];
    // La respuesta no depende de la convención: leyendo cada contrafáctico como un «si…, entonces…»
    // común, el reparto también es único (y es el mismo, porque la solución cumple ese condicional).
    if (repartos(pistas.map(q => (q.t === 'contra' ? { t: 'cond', a: q.a, b: q.b } : q))).length !== 1) return null;
    // El contrafáctico, leído fuerte (tampoco se cumple lo segundo), da la misma solución.
    if (!pistas.filter(q => q.t === 'contra').every(q => !lit(sol, q.b))) return null;
    // Ningún condicional repite a otra pista con las mismas personas y cosas.
    const firmas = pistas.map(q => JSON.stringify(q));
    if (new Set(firmas).size !== firmas.length) return null;

    // En «quien» no se pregunta por la persona del antecedente de un contrafáctico (eso lo da la pista sola).
    const libres = [0, 1, 2, 3].filter(o => !pistas.some(q => q.t === 'contra' && q.a.o === o));
    const modo = rng.sig() < 0.4 && libres.length ? 'quien' : 'afirmacion';
    const segP = (q, color = true) => segPistaAS(q, pa, ps, cs, color);
    const nombreLit = l => plano(segLitAS(l, pa, ps, cs, false, l.modo || 'pres'));
    let correcta, persona = null;
    const errores = [];
    const usadas = new Set();
    const solTexto = a => a.map((c, o) => `${ps[o]}: ${cs[c]}`).join(', ');
    const sinRevisar = (a, i) => {
      const q = pistas[i], dicha = `«${plano(segP(q, false))}»`;
      if (q.t === 'contra') return `El reparto ${solTexto(a)} cumple las demás pistas, pero choca con la ${ROMANOS[i]}: ${dicha} dice que ${nombreLit({ ...q.a, neg: !q.a.neg })}, y en ese reparto no es así. Hay que comprobar todas las pistas.`;
      return `El reparto ${solTexto(a)} cumple las demás pistas, pero no cumple la ${ROMANOS[i]}: ${dicha}. Hay que comprobar todas las pistas.`;
    };
    if (modo === 'quien') {
      persona = rng.elegir(libres);
      const opC = c => ({ clave: `cosa:${c}`, texto: textoAS(`cosa:${c}`, pa, ps, cs) });
      correcta = opC(sol[persona]); usadas.add(sol[persona]);
      for (const L of primeroBicondicional(rng, lecturas(pistas, segP))) {
        const mal = repartos(L.pistas);
        if (!mal.length) continue;
        const vals = new Set(mal.map(a => a[persona]));
        if (vals.size !== 1) continue;
        const c = [...vals][0];
        if (usadas.has(c)) continue;
        usadas.add(c);
        errores.push(err(L.id, opC(c), `${L.como} Con esa lectura sale que ${ps[persona]} ${pa.pres} ${pa.pre}${cs[c]}, pero el reparto que cumple todas las pistas es ${solTexto(sol)}.`));
      }
      for (const i of rng.barajar([...pistas.keys()])) {
        const casi = repartos(pistas.filter((_, j) => j !== i));
        for (const a of rng.barajar(casi)) {
          if (usadas.has(a[persona])) continue;
          usadas.add(a[persona]);
          errores.push(err('RMP72-pista-sin-revisar', opC(a[persona]), sinRevisar(a, i)));
        }
      }
      if (errores.length < 3) return null;
    } else {
      const opA = (o, c) => ({ clave: `as:${o}:${c}`, texto: textoAS(`as:${o}:${c}`, pa, ps, cs) });
      const o0 = rng.entero(0, 3);
      correcta = opA(o0, sol[o0]);
      const verdaderas = new Set(sol.map((c, o) => `as:${o}:${c}`));
      for (const L of primeroBicondicional(rng, lecturas(pistas, segP))) {
        const mal = repartos(L.pistas);
        if (!mal.length) continue;
        const nuevas = [];
        for (let o = 0; o < 4; o++) { const vals = new Set(mal.map(a => a[o])); if (vals.size === 1) { const c = [...vals][0]; const k = `as:${o}:${c}`; if (!verdaderas.has(k) && !usadas.has(k)) nuevas.push([o, c]); } }
        if (!nuevas.length) continue;
        const [o, c] = rng.elegir(nuevas);
        usadas.add(`as:${o}:${c}`);
        errores.push(err(L.id, opA(o, c), `${L.como} Con esa lectura sale que ${ps[o]} ${pa.pres} ${pa.pre}${cs[c]}, pero el único reparto que cumple todas las pistas es ${solTexto(sol)}.`));
        if (errores.length >= 2) break;
      }
      for (const i of rng.barajar([...pistas.keys()])) {
        if (errores.length >= 4) break;
        const casi = repartos(pistas.filter((_, j) => j !== i));
        const pares = [];
        for (const a of casi) for (let o = 0; o < 4; o++) { const k = `as:${o}:${a[o]}`; if (!verdaderas.has(k) && !usadas.has(k)) pares.push([o, a]); }
        if (!pares.length) continue;
        const [o, a] = rng.elegir(pares);
        usadas.add(`as:${o}:${a[o]}`);
        errores.push(err('RMP72-pista-sin-revisar', opA(o, a[o]), sinRevisar(a, i)));
      }
      if (errores.length < 3) return null;
    }
    const alternativas = P.armarTexto({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const enunciado = [...pa.intro(conY(ps.map((p, i) => v(PV[i], p))), conY(cs, ', ')), ' Se sabe que:'];
    pistas.forEach((q, i) => enunciado.push(` ${ROMANOS[i]}. `, ...segP(q), '.'));
    const pregunta = modo === 'quien'
      ? [`¿${pa.que === 'ciudad' ? 'De qué ciudad es' : pa.que === 'deporte' ? 'Qué deporte practica' : 'Qué taller lleva'} `, v(PV[persona], ps[persona]), '?']
      : ['¿Cuál de las siguientes afirmaciones es verdadera?'];
    const tx = {
      fila: o => `A ${ps[o]} solo le queda una opción`,
      columna: c => `Nadie más puede ${pa.inf} ${pa.pre}${cs[c]}`,
      sinOpcion: o => `a ${ps[o]} no le queda ninguna opción`,
      nadie: c => `nadie podría ${pa.inf} ${pa.pre}${cs[c]}`,
      unico: pa.unico,
    };
    const d = deducir(pistas, 4, 4, true, nombreLit, tx);
    const solucion = d.pasos.map(t => [t]);
    const completo = d.celda.every(f => f.includes(true)) && !d.choque;
    if (!completo) {
      // Se prueba con la primera persona que tiene más de una opción.
      const o = d.celda.findIndex(f => !f.includes(true));
      const abiertas = [...Array(4).keys()].filter(c => d.celda[o][c] !== false);
      solucion.push([`Quedan opciones para ${ps[o]}: ${lista(abiertas.map(c => pa.pre + cs[c]))}. Se prueba cada una.`]);
      for (const c of abiertas.filter(c => c !== sol[o])) {
        const br = deducir(pistas, 4, 4, true, nombreLit, tx, { celda: d.celda, porque: d.porque, o, c });
        if (br.choque && br.pasos.length <= 6) solucion.push([`Si ${nombreLit({ o, c, modo: 'subj' })}: ${minus(br.pasos.join(' '))} Así que eso no puede ser.`]);
        else return null; // la rama no se cierra en pocos pasos: mejor otro problema
      }
      const sigue = deducir(pistas, 4, 4, true, nombreLit, tx, { celda: d.celda, porque: d.porque, o, c: sol[o] });
      if (sigue.choque || !sigue.celda.every(f => f.includes(true))) return null;
      solucion.push([`Entonces ${nombreLit({ o, c: sol[o] })}.${sigue.pasos.length ? ' ' + sigue.pasos.join(' ') : ''}`]);
    }
    solucion.push(['El único reparto que cumple todas las pistas es: ', ...conY(sol.map((c, o) => [v(PV[o], ps[o]), `, ${pa.pre}${cs[c]}`]).map(x => x), '; ').flat(), '.']);
    solucion.push([modo === 'quien' ? `Respuesta: ${correcta.texto}.` : `Respuesta: ${correcta.texto}`]);
    const pintarPersonas = colorear(ps.map((p, i) => [p, PV[i]]));
    for (let i = 0; i < solucion.length; i++) solucion[i] = solucion[i].flatMap(x => (typeof x === 'string' ? pintarPersonas(x) : [x]));
    const variables = {}; ps.forEach((p, i) => { variables[PV[i]] = { nombre: p, color: ['o', 'i', 'h', 'd'][i] }; });
    return {
      enunciado, pregunta, solucion, alternativas, correcta, variables,
      datos: { tipo: 'asignacion', piel: pielId, personas: ps, cosas: cs, pistas, modo, ...(modo === 'quien' ? { persona } : {}), opciones: alternativas.map(a => a.valor) },
    };
  }


  // =====================================================================================
  // 4. Puntajes de dados (nuevo, cierre-100)
  // =====================================================================================
  const PERMS3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // col[p] = dado (índice) de la persona p; s[p] = su puntaje. holder(c) = quién tiene el dado c.
  function cumplePuntajes(q, col, s) {
    const dueno = c => col.indexOf(c);
    if (q.t === 'no') return col[q.p] !== q.c;
    if (q.t === 'paridad') return s.every(x => (x % 2 === 0) === (q.par === 'par'));
    const d = dueno(q.c);
    if (q.t === 'mayor') return q.p !== d && s[q.p] > s[d];
    if (q.t === 'menor-todos') return s.every((x, p) => p === d || s[d] < x);
    return s.every((x, p) => p === d || s[d] > x);
  }
  // Todas las parejas (reparto de dados, puntajes) que cumplen las pistas; los puntajes van de lanz a 6·lanz.
  function puntajes({ lanz, pistas, persona }) {
    const val = []; for (let x = lanz; x <= 6 * lanz; x++) val.push(x);
    const porReparto = [];
    for (const col of PERMS3) {
      const ok = [];
      for (const a of val) for (const b of val) for (const c of val) if (pistas.every(q => cumplePuntajes(q, col, [a, b, c]))) ok.push([a, b, c]);
      if (ok.length) {
        const maximos = [0, 1, 2].map(p => Math.max(...ok.map(t => t[p])));
        porReparto.push({ col, maximos, valido: ok.some(t => t.every((x, p) => x === maximos[p])), distintos: [...new Set(ok.map(t => t[persona]))].sort((x, y) => y - x) });
      }
    }
    const unico = porReparto.length === 1 && porReparto[0].valido;
    const u = porReparto[0];
    return { respuesta: unico ? { color: u.col[persona], puntaje: u.maximos[persona] } : null, repartos: porReparto, maximos: unico ? u.maximos : null };
  }

  // Solo la respuesta de puntajes: { color, puntaje } del máximo de la persona (null si el reparto no es único).
  const puntajeMaximo = a => puntajes(a).respuesta;
  const DADOS = ['azul', 'rojo', 'blanco', 'verde', 'amarillo', 'negro'];
  function textoPistaPT(q, ps, cs) {
    if (q.t === 'no') return [v(PV[q.p], ps[q.p]), ` no usó el dado ${cs[q.c]}`];
    if (q.t === 'paridad') return [`Ninguno obtuvo un puntaje total ${q.par === 'impar' ? 'par' : 'impar'}`];
    if (q.t === 'mayor') return [v(PV[q.p], ps[q.p]), ` obtuvo más puntos que quien usó el dado ${cs[q.c]}`];
    return [`Quien usó el dado ${cs[q.c]} obtuvo el ${q.t === 'menor-todos' ? 'menor' : 'mayor'} puntaje de los tres`];
  }
  function construirPuntajes(rng, semilla) {
    const ps = rng.barajar(NOMBRES).slice(0, 3), cs = rng.barajar(DADOS).slice(0, 3);
    const lanz = rng.entero(4, 6), par = rng.sig() < 0.8 ? 'impar' : 'par';
    // un mundo verdadero: cada persona con un dado y un lugar (0 = menor) entre los tres puntajes
    const col = rng.barajar([0, 1, 2]), rango = rng.barajar([0, 1, 2]), dueno = c => col.indexOf(c);
    const hechos = [];
    for (let p = 0; p < 3; p++) for (let c = 0; c < 3; c++) {
      if (col[p] !== c) hechos.push({ t: 'no', p, c });
      if (p !== dueno(c) && rango[p] > rango[dueno(c)]) hechos.push({ t: 'mayor', p, c });
    }
    for (let c = 0; c < 3; c++) { if (rango[dueno(c)] === 0) hechos.push({ t: 'menor-todos', c }); if (rango[dueno(c)] === 2) hechos.push({ t: 'mayor-todos', c }); }
    let pistas = rng.barajar(hechos).slice(0, rng.entero(3, 4)).concat([{ t: 'paridad', par }]);
    const persona = rng.entero(0, 2);
    const R = puntajes({ lanz, pistas, persona });
    if (!R.respuesta) return null;
    // Quitar pistas que no hacen falta (la paridad se queda): sin ellas la respuesta debe cambiar.
    const clave = ps_ => { const z = puntajes({ lanz, pistas: ps_, persona }); return z.respuesta ? `${z.respuesta.puntaje}:${z.respuesta.color}` : 'x' + z.repartos.length; };
    const base = clave(pistas);
    for (const q of rng.barajar(pistas.filter(x => x.t !== 'paridad'))) {
      const sin = pistas.filter(x => x !== q);
      if (clave(sin) === base) pistas = sin;
    }
    if (pistas.length < 3 || new Set(pistas.map(q => JSON.stringify(q))).size !== pistas.length) return null;
    if (!pistas.some(q => q.t === 'menor-todos' || q.t === 'mayor-todos' || q.t === 'mayor')) return null;
    pistas = rng.barajar(pistas);
    const sol = puntajes({ lanz, pistas, persona }), col0 = sol.repartos[0].col, max = sol.maximos;
    const correcta = { clave: `pt:${sol.respuesta.puntaje}:${sol.respuesta.color}`, texto: `${sol.respuesta.puntaje} puntos, dado ${cs[sol.respuesta.color]}` };
    const op = (puntaje, color) => ({ clave: `pt:${puntaje}:${color}`, texto: `${puntaje} puntos, dado ${cs[color]}` });
    const errores = [];
    const vistas = new Set([correcta.clave]);
    const poner = (id, o, texto) => { if (!o || vistas.has(o.clave)) return; vistas.add(o.clave); errores.push(err(id, o, texto)); };
    // 1. Una pista sin revisar: el puntaje y el dado que salen si se ignora esa pista (y no es el correcto).
    const ROM = ROMANOS;
    for (const i of rng.barajar([...pistas.keys()])) {
      const z = puntajes({ lanz, pistas: pistas.filter((_, j) => j !== i), persona });
      for (const rep of z.repartos) {
        if (!rep.valido) continue;
        const dicha = plano(textoPistaPT(pistas[i], ps, cs).map(x => (typeof x === 'string' ? x : x.t)));
        poner('RMP72-pista-sin-revisar', op(rep.maximos[persona], rep.col[persona]),
          `Con todas las pistas menos la ${ROM[i]} («${dicha}») también sale ${rep.maximos[persona]} puntos y el dado ${cs[rep.col[persona]]} para ${ps[persona]}, pero esa pista descarta esa posibilidad. Hay que usar todas.`);
      }
    }
    // 2. Puntaje posible pero no el mayor: el siguiente puntaje permitido más abajo.
    const dist = sol.repartos[0].distintos, menor = dist.find(x => x < sol.respuesta.puntaje);
    if (menor !== undefined) poner('RMP2-sin-maximizar', op(menor, sol.respuesta.color), `${menor} puntos cumple las pistas, pero no es el mayor posible: ${sol.respuesta.puntaje} también las cumple. Se pide que cada uno saque el máximo.`);
    // 3. El puntaje correcto con el dado de otra persona.
    for (const q of rng.barajar([0, 1, 2].filter(x => x !== persona))) poner('RMP72-dado-cruzado', op(sol.respuesta.puntaje, col0[q]), `Ese puntaje es el de ${ps[persona]}, pero el dado ${cs[col0[q]]} lo usó ${ps[q]}: cruzaste los dados.`);
    if (errores.length < 3) return null;
    const alternativas = P.armarTexto({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const enunciado = [];
    enunciado.push(...conY(ps.map((p, i) => v(PV[i], p))), ` juegan con tres dados de colores: uno ${cs[0]}, uno ${cs[1]} y uno ${cs[2]}. Cada uno toma un dado de color distinto y lo lanza ${lanz} veces; después suma sus ${lanz} resultados. Se sabe que:`);
    pistas.forEach((q, i) => enunciado.push(` ${ROMANOS[i]}. `, ...textoPistaPT(q, ps, cs), '.'));
    enunciado.push(` Cada uno obtuvo el mayor puntaje que permiten estas pistas.`);
    const pregunta = ['¿Qué puntaje obtuvo ', v(PV[persona], ps[persona]), ' y con qué dado?'];
    // solución
    const nom = p => ps[p], dado = p => cs[col0[p]];
    const rel = [];
    for (const q of pistas) {
      if (q.t === 'mayor') rel.push(`${nom(q.p)} > ${nom(col0.indexOf(q.c))}`);
      if (q.t === 'menor-todos') rel.push(`${nom(col0.indexOf(q.c))} es el menor`);
      if (q.t === 'mayor-todos') rel.push(`${nom(col0.indexOf(q.c))} es el mayor`);
    }
    const orden = [0, 1, 2].sort((a, b) => max[b] - max[a]);
    const tope = par === 'impar' ? 6 * lanz - (6 * lanz % 2 === 0 ? 1 : 0) : 6 * lanz - (6 * lanz % 2);
    const solucion = [
      [`Hay 6 maneras de repartir los tres dados. Con las pistas de dados y de orden, solo una cumple todas: ${[0, 1, 2].map(p => `${nom(p)} usó el dado ${dado(p)}`).join(', ')}.`],
      [`Entonces las pistas de orden dicen: ${rel.join('; ')}.`],
      [`Con ${lanz} lanzamientos el máximo posible es ${6 * lanz}; como ninguno obtuvo un puntaje ${par === 'impar' ? 'par' : 'impar'}, el mayor puntaje permitido es ${tope}. Cada uno saca lo máximo que deja el orden: ${orden.map(p => `${nom(p)}, ${max[p]}`).join('; ')}.`],
      [`Respuesta: ${nom(persona)} obtuvo ${max[persona]} puntos con el dado ${dado(persona)}.`],
    ];
    const pintar = colorear(ps.map((p, i) => [p, PV[i]]));
    for (let i = 0; i < solucion.length; i++) solucion[i] = solucion[i].flatMap(x => (typeof x === 'string' ? pintar(x) : [x]));
    const variables = {}; ps.forEach((p, i) => { variables[PV[i]] = { nombre: p, color: ['o', 'i', 'h'][i] }; });
    return { enunciado, pregunta, solucion, alternativas, correcta, variables,
      datos: { tipo: 'puntajes', personas: ps, colores: cs, lanz, pistas, persona, opciones: alternativas.map(a => a.valor) } };
  }

  // =====================================================================================
  const conNuevos = s => (typeof s === 'number' ? s >= 400 : !/^(entrada|salida)-/.test(s));
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    // Las pruebas de entrada y salida traen un problema de cada tipo (formas paralelas).
    const prueba = /^(entrada|salida)-(\d+)$/.exec(String(semilla));
    let tipo = prueba ? TIPOS[(+prueba[2] - 1) % TIPOS.length] : rng.elegir(TIPOS);
    // Tipo nuevo (cierre-100): sorteo aparte, para que las semillas ya fijadas en casos.json no cambien.
    if (!prueba && conNuevos(semilla) && Azar.crear(`${ID}+nuevos|${semilla}`).sig() < 0.25) tipo = 'puntajes';
    const hacer = { silogismo: construirSilogismo, 'siempre-cierto': construirSiempre, asignacion: construirAsignacion, puntajes: construirPuntajes }[tipo];
    for (let intento = 0; intento < 4000; intento++) {
      const pr = hacer(rng, semilla);
      if (!pr) continue;
      const out = {
        id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: '',
        alternativas: pr.alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta.clave, texto: pr.correcta.texto, unidad: '' },
        _datos: pr.datos,
      };
      if (pr.figuraSolucion) out.figuraSolucion = pr.figuraSolucion;
      return out;
    }
    throw new Error(`${ID}: no se pudo generar un problema (${tipo})`);
  }

  const calc = { proposicion, modelosSilogismo, validaSilogismo, conclusionesValidas, casosFrascos, necesaria, repartos, puntajes, puntajeMaximo };
  return { id: ID, titulo: 'Lo que se deduce: clases, frascos y condicionales', generar, calc };
});
