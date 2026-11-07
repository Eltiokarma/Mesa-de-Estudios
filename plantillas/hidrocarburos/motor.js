/*
 * Motor de «Bolitas y palitos: hidrocarburos».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorHidrocarburos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * La idea: una molécula es un GRAFO de carbonos, no un dibujo. Cada átomo de C tiene 4 enlaces (los H van
 * implícitos: los que faltan para llegar a 4); cada enlace C–C tiene su orden (1, 2, 3, o 1,5 en el benceno).
 * Girar un enlace simple cambia el dibujo, no el grafo; el nombre, la fórmula y los isómeros salen del grafo.
 *
 * Qué calcula:
 *   - molecula(texto): lee una fórmula semidesarrollada sencilla ("CH3-CH(CH3)-CH2-CH3", "CH2=CH-CH3", "CH≡C-CH3",
 *     "(CH3)3C-CH2-CH(CH3)2", "CH3(CH2)3CH3", "CH3-CH(C2H5)-CH2-CH3", "CHCl=CHCl") o un SMILES sencillo ("CC(C)C",
 *     "C/C=C\C", "C1CCC1", "c1ccccc1"). Comprueba la valencia: 4 enlaces por C (1 por Cl o Br).
 *   - formula (molecular), tipo (alcano, alqueno, alquino, dieno, cicloalcano, cicloalqueno, aromático) y su
 *     fórmula general, insaturaciones, tipos de carbono (primario a cuaternario), hibridación y ángulo por carbono,
 *     enlaces σ y π, la semidesarrollada escrita por el motor.
 *   - canonica / mismaMolecula: forma canónica del grafo (etiquetado canónico por refinamiento de colores con
 *     búsqueda en los empates), con o sin la configuración cis-trans. Dos dibujos son la misma sustancia si y solo si
 *     su forma canónica es la misma.
 *   - nombre: IUPAC para C1 a C10 (cadena principal, numeración, sustituyentes en orden alfabético con di-, tri-,
 *     localizadores; alquenos, alquinos, dienos; cicloalcanos y cicloalquenos con un anillo; benceno con ramas
 *     alquilo; cis- o trans- si la molécula lo dice). También el nombre con la forma anterior ("4-metil-2-penteno").
 *   - isomeros: enumeración de alcanos CnH2n+2 (n ≤ 10), alquenos con un doble enlace y alquinos con un triple
 *     (n ≤ 8) y cicloalcanos (n ≤ 6), con o sin los cis-trans (en los anillos, solo n ≤ 5: ahí hay a lo más dos
 *     carbonos del anillo con dos grupos distintos y la cuenta es exacta).
 *   - cisTrans: si cada carbono de un doble enlace (o dos carbonos de un anillo) tiene dos grupos distintos.
 *   - coordenadas 2D (con z para girar) para dibujar bolitas y palitos y el esqueleto; girar una rama alrededor de un
 *     enlace simple (rotación 3D alrededor del eje del enlace; prohibido en un doble enlace y dentro de un anillo);
 *     intercambiar los dos grupos de un carbono del doble enlace (lo que haría falta para pasar de cis a trans:
 *     romper el enlace π); leer cis o trans de las coordenadas.
 *   - armar: agregar o quitar un carbono, cambiar el orden de un enlace (con la valencia comprobada).
 *   - ebullicion: puntos de ebullición normales de referencia de algunos alcanos (de tabla).
 * Cada función que alimenta una predicción devuelve además `errores`: lo que da cada error típico (tabla «Lo que
 * no tiene respaldo» y bloque HC de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md).
 *
 * CONVENCIONES (el informe pide decirlas):
 *   1. Cadena principal de alquenos y alquinos: la REGLA ESCOLAR (IUPAC 1979/1993, la de los libros escolares y las
 *      academias peruanas): primero, la cadena con más enlaces múltiples; después, la más larga; después, la de más
 *      dobles; después, la de más ramas. Las recomendaciones IUPAC de 2013 eligen primero la más larga aunque no
 *      lleve el doble enlace; nombre().difiereIUPAC2013 avisa cuando las dos reglas eligen cadenas distintas, y los
 *      casos de prueba y la escena evitan esas moléculas.
 *   2. Numeración: localizadores más bajos para los enlaces múltiples (juntos), después para los dobles, después para
 *      las ramas; si sigue el empate, el primer sustituyente en orden alfabético lleva el número más bajo.
 *   3. Localizador del enlace múltiple delante del sufijo, como en la IUPAC actual (but-2-eno, buta-1,3-dieno,
 *      4-metilpent-2-eno); `antiguo` da la forma anterior (2-buteno, 1,3-butadieno, 4-metil-2-penteno). Con 2 o 3
 *      carbonos en la cadena el localizador del múltiple se omite (eteno, propeno, propino, 2-metilpropeno). El de un
 *      sustituyente se escribe siempre (2-metilpropano, 2,2-dimetilpropano), salvo con una sola rama en un anillo
 *      sin doble enlace o en el benceno (metilciclopropano, metilbenceno).
 *   4. Orden alfabético de los sustituyentes sin contar di-, tri-, sec- ni terc- (sí cuenta iso-). Nombres de
 *      academia para ramas de 3 y 4 carbonos: isopropil, butil, isobutil, sec-butil, terc-butil; las demás ramas
 *      ramificadas se nombran entre paréntesis, "(1-metilbutil)".
 *   5. Anillos: el anillo es la cadena principal si ninguna rama tiene más carbonos que él (regla escolar); si no, el
 *      motor no lo nombra. Cicloalquenos: el doble enlace va entre C1 y C2. Benceno: nombres comunes tolueno y o-,
 *      m-, p-xileno. Solo moléculas con un anillo.
 *   6. cis y trans se leen respecto de la cadena principal (cis: la cadena sigue por el mismo lado del doble enlace).
 *      No se calcula Z/E: en los hidrocarburos de la escena (cada carbono del doble enlace con un H) cis = Z.
 *   7. Tipos de carbono por cuántos carbonos tiene unidos (1 primario, 2 secundario, 3 terciario, 4 cuaternario); el
 *      C del metano no se clasifica. Hibridación: sp³ con 4 enlaces simples (109,5°), sp² con un doble o en el
 *      benceno (120°), sp con un triple o dos dobles (180°).
 *   8. Puntos de ebullición normales en °C, de tabla (CRC Handbook of Chemistry and Physics, redondeados a 0,1 °C;
 *      los mismos que usa plantillas/liquidos-y-solidos/ para butano, isobutano, pentano y neopentano). Son datos
 *      medidos, no salen de una fórmula; conviene contrastarlos con la tabla del libro que se use.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorHidrocarburos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VALENCIA = { C: 4, Cl: 1, Br: 1 };
  const HALO = { Cl: 'cloro', Br: 'bromo' };
  const RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec'];
  const MULT = ['', '', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'];
  const MULTC = ['', '', 'bis', 'tris', 'tetrakis'];
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const raiz = n => { if (!RAIZ[n]) throw new Error(`hidrocarburos: no sé la raíz de ${n} carbonos`); return RAIZ[n]; };

  // ---------- Molécula ----------
  // { at: [{ el, h }], en: [{ a, b, o }], est: { [enlace]: { a, b, mismo } } }
  // est: configuración de un doble enlace: el vecino `a` del primer átomo del enlace y el vecino `b` del segundo
  // están del mismo lado (mismo = true, cis) o en lados opuestos.
  function clonar(m) { return { at: m.at.map(x => ({ ...x })), en: m.en.map(x => ({ ...x })), est: JSON.parse(JSON.stringify(m.est || {})), anillo: m.anillo || null }; }
  function vecinos(m) {
    const v = m.at.map(() => []);
    m.en.forEach((e, k) => { v[e.a].push({ j: e.b, o: e.o, k }); v[e.b].push({ j: e.a, o: e.o, k }); });
    return v;
  }
  function completarH(m) {
    const v = vecinos(m);
    m.at.forEach((a, i) => {
      const s = v[i].reduce((t, x) => t + x.o, 0), val = VALENCIA[a.el];
      if (val === undefined) throw new Error(`hidrocarburos: elemento «${a.el}» fuera de la escena`);
      const h = val - s;
      if (h < -1e-9) throw new Error(`hidrocarburos: el átomo ${i + 1} (${a.el}) tiene ${s} enlaces; la valencia es ${val}`);
      if (Math.abs(h - Math.round(h)) > 1e-9) throw new Error('hidrocarburos: los enlaces aromáticos no cierran');
      if (a.h !== undefined && a.h !== Math.round(h)) throw new Error(`hidrocarburos: valencia: el ${a.el}H${a.h || ''} del lugar ${i + 1} tiene ${s} enlaces con otros átomos; con ${a.h} H suma ${s + a.h}, no 4`);
      a.h = Math.round(h);
    });
    // Conexa.
    const vis = new Set([0]), pila = [0];
    while (pila.length) { const i = pila.pop(); for (const x of v[i]) if (!vis.has(x.j)) { vis.add(x.j); pila.push(x.j); } }
    if (m.at.length && vis.size !== m.at.length) throw new Error('hidrocarburos: la fórmula tiene piezas sueltas');
    if (!m.at.some(a => a.el === 'C')) throw new Error('hidrocarburos: no hay carbono');
    return m;
  }
  function enlazar(m, a, b, o, extra) {
    if (a === b || m.en.some(e => (e.a === a && e.b === b) || (e.a === b && e.b === a))) throw new Error('hidrocarburos: enlace repetido');
    m.en.push({ a, b, o, ...(extra || {}) }); return m.en.length - 1;
  }

  // --- Semidesarrollada ---
  function leerSemi(texto) {
    let t = String(texto).replace(/\s+/g, '').replace(/[–—−]/g, '-').replace(/[₀-₉]/g, c => SUB[c]);
    const m = { at: [], en: [], est: {} };
    const nuevo = (el, h) => { m.at.push({ el, h }); return m.at.length - 1; };
    const ORDEN = { '-': 1, '=': 2, '≡': 3 };
    function cierre(s, i) { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '(') d++; else if (s[k] === ')') { d--; if (!d) return k; } } throw new Error('hidrocarburos: falta cerrar un paréntesis'); }
    function cadena(s) {
      let i = 0;
      const num = () => { let d = ''; while (/\d/.test(s[i] || '')) d += s[i++]; return d ? +d : 1; };
      const unidad = () => {
        if (s[i] !== 'C' || s[i + 1] === 'l') throw new Error(`hidrocarburos: no entiendo «${s.slice(i) || s}»`);
        i++;
        let n = 1; if (/\d/.test(s[i] || '')) n = num();
        let h = 0; if (s[i] === 'H') { i++; h = num(); }
        if (n > 1) {   // CnH2n+1: rama recta de n carbonos (C2H5, C3H7…)
          if (h !== 2 * n + 1) throw new Error(`hidrocarburos: «C${n}H${h}» no es una rama alquilo`);
          let pri = -1, ult = -1;
          for (let k = 0; k < n; k++) { const a = nuevo('C', k === n - 1 ? 3 : 2); if (ult >= 0) enlazar(m, ult, a, 1); else pri = a; ult = a; }
          return { pri, ult: -1 };
        }
        const c = nuevo('C', h);
        while (s.startsWith('Cl', i) || s.startsWith('Br', i)) { const el = s.slice(i, i + 2); i += 2; const k = num(); for (let q = 0; q < k; q++) enlazar(m, c, nuevo(el, 0), 1); }
        return { pri: c, ult: c };
      };
      const colgar = (sub, at) => {
        let o = 1; if (ORDEN[sub[0]]) { o = ORDEN[sub[0]]; sub = sub.slice(1); }
        const r = cadena(sub); enlazar(m, at, r.pri, o);
      };
      const antes = [];
      while (s[i] === '(') { const j = cierre(s, i), sub = s.slice(i + 1, j); i = j + 1; antes.push([sub, num()]); }
      let u = unidad(); const pri = u.pri; let ult = u.ult;
      for (const [sub, k] of antes) for (let q = 0; q < k; q++) colgar(sub, pri);
      while (i < s.length) {
        if (ult < 0) throw new Error('hidrocarburos: una rama CnH2n+1 va al final');
        if (s[i] === '(') {
          const j = cierre(s, i), sub = s.slice(i + 1, j); i = j + 1; const k = num();
          if (sub === 'CH2') { for (let q = 0; q < k; q++) { const a = nuevo('C', 2); enlazar(m, ult, a, 1); ult = a; } }
          else for (let q = 0; q < k; q++) colgar(sub, ult);
          continue;
        }
        let o = 1;
        if (ORDEN[s[i]]) { o = ORDEN[s[i]]; i++; }
        else if (s[i] !== 'C') throw new Error(`hidrocarburos: no entiendo «${s.slice(i)}»`);
        u = unidad(); enlazar(m, ult, u.pri, o); ult = u.ult;
      }
      return { pri, ult };
    }
    cadena(t.replace(/#/g, '≡'));
    return completarH(m);
  }

  // --- SMILES sencillo ---
  function leerSmiles(texto) {
    const s = String(texto).replace(/\s+/g, '');
    const m = { at: [], en: [], est: {} }, arom = [], dir = [];
    let prev = -1, enl = null, pila = [], anillos = {}, i = 0;
    const ord = { '-': 1, '=': 2, '#': 3, '/': 1, '\\': 1 };
    while (i < s.length) {
      const ch = s[i];
      let el = null;
      if (s.startsWith('Cl', i) || s.startsWith('Br', i)) { el = s.slice(i, i + 2); i += 2; }
      else if (ch === 'C' || ch === 'c') { el = 'C'; arom.push(ch === 'c'); i++; }
      if (el) {
        if (el !== 'C') arom.push(false);
        m.at.push({ el }); const n = m.at.length - 1;
        if (prev >= 0) {
          const o = enl ? ord[enl] : (arom[prev] && arom[n] ? 1.5 : 1);
          const k = enlazar(m, prev, n, o);
          if (enl === '/' || enl === '\\') dir.push({ k, desde: prev, hacia: n, d: enl });
        }
        prev = n; enl = null; continue;
      }
      if (ch === '(') { pila.push(prev); i++; continue; }
      if (ch === ')') { if (!pila.length) throw new Error('hidrocarburos: paréntesis de más'); prev = pila.pop(); i++; continue; }
      if (ord[ch]) { enl = ch; i++; continue; }
      if (/\d/.test(ch)) {
        const d = ch; i++;
        if (anillos[d]) { const r = anillos[d]; const o = enl ? ord[enl] : r.enl ? ord[r.enl] : (arom[r.at] && arom[prev] ? 1.5 : 1); enlazar(m, r.at, prev, o); delete anillos[d]; }
        else anillos[d] = { at: prev, enl };
        enl = null; continue;
      }
      throw new Error(`hidrocarburos: no entiendo «${s.slice(i)}»`);
    }
    if (Object.keys(anillos).length) throw new Error('hidrocarburos: un anillo sin cerrar');
    // Configuración de los dobles enlaces con / y \ (arriba: / si el vecino se escribió antes, \ si después).
    const arriba = (x, n) => { const q = dir.find(t => (t.desde === x && t.hacia === n) || (t.desde === n && t.hacia === x)); if (!q) return null; return q.desde === n ? q.d === '/' : q.d === '\\'; };
    const v = vecinos(m);
    m.en.forEach((e, k) => {
      if (e.o !== 2) return;
      const ua = v[e.a].filter(x => x.j !== e.b).map(x => [x.j, arriba(e.a, x.j)]).find(z => z[1] !== null);
      const ub = v[e.b].filter(x => x.j !== e.a).map(x => [x.j, arriba(e.b, x.j)]).find(z => z[1] !== null);
      if (ua && ub) m.est[k] = { a: ua[0], b: ub[0], mismo: ua[1] === ub[1] };
    });
    completarH(m);
    return normalizar(m);
  }
  // Un anillo de 6 C con dobles alternados (Kekulé) se guarda como benceno (enlaces 1,5): las dos formas de Kekulé
  // son la misma sustancia.
  function normalizar(m) {
    for (const c of ciclos(m)) {
      if (c.length !== 6 || c.some(i => m.at[i].el !== 'C')) continue;
      const ks = c.map((x, q) => m.en.findIndex(e => (e.a === x && e.b === c[(q + 1) % 6]) || (e.b === x && e.a === c[(q + 1) % 6])));
      const os = ks.map(k => m.en[k].o);
      const alt = os.every((o, q) => o === (q % 2 ? os[1] : os[0])) && os[0] + os[1] === 3;
      if (alt) ks.forEach(k => { m.en[k].o = 1.5; delete m.est[k]; });
    }
    return m;
  }
  function molecula(x) {
    if (x && typeof x === 'object' && Array.isArray(x.at)) return x;
    const s = String(x).trim();
    if (!s) throw new Error('hidrocarburos: fórmula vacía');
    return /H|≡|[–—]|[₀-₉]/.test(s) ? normalizar(leerSemi(s)) : leerSmiles(s);
  }

  // ---------- Grafo: anillos, cadenas ----------
  function enAnillo(m, k) {
    const e = m.en[k], v = vecinos(m), vis = new Set([e.a]), pila = [e.a];
    while (pila.length) { const i = pila.pop(); for (const x of v[i]) if (x.k !== k && !vis.has(x.j)) { if (x.j === e.b) return true; vis.add(x.j); pila.push(x.j); } }
    return false;
  }
  // Ciclos simples (para moléculas chicas): cada uno como lista de átomos en orden.
  function ciclos(m) {
    const v = vecinos(m), vistos = new Set(), out = [];
    const n = m.at.length;
    for (let s = 0; s < n; s++) {
      const camino = [s], usado = new Set([s]);
      const dfs = i => {
        if (camino.length > 12) return;
        for (const x of v[i]) {
          if (x.j === s && camino.length >= 3) { const c = [...camino], clave = [...c].sort((a, b) => a - b).join(','); if (!vistos.has(clave)) { vistos.add(clave); out.push(c); } continue; }
          if (usado.has(x.j) || x.j < s) continue;
          usado.add(x.j); camino.push(x.j); dfs(x.j); camino.pop(); usado.delete(x.j);
        }
      };
      dfs(s);
    }
    return out;
  }
  const carbonos = m => m.at.map((a, i) => i).filter(i => m.at[i].el === 'C');
  function camino(v, a, b, permitido) {   // en un árbol: el único camino de a a b
    const prev = new Map([[a, -1]]), cola = [a];
    while (cola.length) { const i = cola.shift(); if (i === b) break; for (const x of v[i]) if (permitido(x.j) && !prev.has(x.j)) { prev.set(x.j, i); cola.push(x.j); } }
    if (!prev.has(b)) return null;
    const p = []; for (let i = b; i !== -1; i = prev.get(i)) p.unshift(i);
    return p;
  }
  // Todas las cadenas de carbono de punta a punta (en las moléculas sin anillo), de la más larga a la más corta.
  function cadenas(x) {
    const m = molecula(x), v = vecinos(m), C = carbonos(m), esC = i => m.at[i].el === 'C';
    if (ciclos(m).length) throw new Error('hidrocarburos: cadenas() es para moléculas sin anillo');
    const gradoC = i => v[i].filter(y => esC(y.j)).length;
    const puntas = C.filter(i => gradoC(i) <= 1);
    if (C.length === 1) return [{ atomos: [C[0]], largo: 1 }];
    const out = [];
    for (let p = 0; p < puntas.length; p++) for (let q = p + 1; q < puntas.length; q++) { const c = camino(v, puntas[p], puntas[q], esC); out.push({ atomos: c, largo: c.length }); }
    return out.sort((a, b) => b.largo - a.largo);
  }

  // ---------- Forma canónica ----------
  // Etiquetado canónico: refinamiento de colores (Weisfeiler–Lehman) y, en los empates, se individualiza cada átomo
  // de la clase y se toma la cadena mínima. Las moléculas de la escena son chicas, así que alcanza.
  function canonica(x, o) {
    const m = molecula(x); o = o || {};
    const n = m.at.length, v = vecinos(m), marcas = o.marcas || {};
    const pad = k => String(k).padStart(3, '0');
    const rango = arr => { const u = [...new Set(arr)].sort(); return arr.map(s => u.indexOf(s)); };
    const refinar = col => {
      for (;;) {
        const nc = rango(col.map((c, i) => pad(c) + '|' + v[i].map(y => y.o + '-' + pad(col[y.j])).sort().join(',')));
        if (new Set(nc).size === new Set(col).size) return nc;
        col = nc;
      }
    };
    const estereo = o.estereo !== false;
    const cadenaDe = col => {
      const orden = col.map((c, i) => [c, i]).sort((a, b) => a[0] - b[0]).map(z => z[1]), pos = []; orden.forEach((i, p) => { pos[i] = p; });
      const at = orden.map(i => m.at[i].el + m.at[i].h + (marcas[i] || '')).join('.');
      const en = m.en.map(e => [Math.min(pos[e.a], pos[e.b]), Math.max(pos[e.a], pos[e.b]), e.o]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(z => z.join('-')).join(',');
      let es = '';
      if (estereo) {
        const l = [];
        for (const [k, c] of Object.entries(m.est || {})) {
          const e = m.en[k]; if (!e || e.o !== 2 || !estereogenico(m, +k)) continue;
          const ref = (at0, otro, dado) => { const hs = v[at0].filter(y => y.j !== otro).map(y => y.j); const r = hs.reduce((a, b) => (pos[b] < pos[a] ? b : a)); return [r, r === dado]; };
          const [ra, sa] = ref(e.a, e.b, c.a), [rb, sb] = ref(e.b, e.a, c.b);
          const mismo = c.mismo === (sa === sb);
          l.push([Math.min(pos[e.a], pos[e.b]), Math.max(pos[e.a], pos[e.b]), mismo ? 'c' : 't'].join(':'));
        }
        if (m.anillo) l.push('anillo:' + m.anillo);
        es = l.sort().join(',');
      }
      return at + '|' + en + '|' + es;
    };
    let mejor = null;
    const buscar = col => {
      col = refinar(col);
      const cuenta = {}; col.forEach(c => { cuenta[c] = (cuenta[c] || 0) + 1; });
      const amb = Object.keys(cuenta).map(Number).filter(c => cuenta[c] > 1).sort((a, b) => a - b)[0];
      if (amb === undefined) { const s = cadenaDe(col); if (mejor === null || s < mejor) mejor = s; return; }
      for (let i = 0; i < n; i++) if (col[i] === amb) buscar(rango(col.map((c, j) => pad(2 * c + (c === amb && j !== i ? 1 : 0)))));
    };
    buscar(rango(m.at.map((a, i) => a.el + a.h + ':' + v[i].length + (marcas[i] || ''))));
    return mejor;
  }
  function mismaMolecula(a, b, o) { return canonica(a, o) === canonica(b, o); }

  // ---------- Cis-trans ----------
  // ¿Los dos grupos que el átomo `at` tiene además de `fuera` son distintos? (Dos H, o dos grupos iguales, no.)
  function gruposDistintos(m, at, fuera) {
    const v = vecinos(m), otros = v[at].filter(y => !fuera.includes(y.j)).map(y => y.j), h = m.at[at].h;
    if (otros.length + h !== 2) return false;
    if (h === 2) return false;
    if (h === 1) return true;
    const mk = (g) => canonica(m, { estereo: false, marcas: { [at]: '*', [g]: '#' } });
    return mk(otros[0]) !== mk(otros[1]);
  }
  function estereogenico(m, k) {
    const e = m.en[k]; if (e.o !== 2 || enAnillo(m, k)) return false;
    const v = vecinos(m);
    if (v[e.a].some(y => y.k !== k && y.o >= 2) || v[e.b].some(y => y.k !== k && y.o >= 2)) return false;   // aleno
    return gruposDistintos(m, e.a, [e.b]) && gruposDistintos(m, e.b, [e.a]);
  }
  // Carbonos de un anillo sin doble enlace con dos grupos distintos (H y una rama, o dos ramas distintas).
  function centrosAnillo(m) {
    const c = ciclos(m); if (c.length !== 1) return [];
    const anillo = c[0], v = vecinos(m);
    if (m.en.some((e, k) => e.o > 1 && anillo.includes(e.a) && anillo.includes(e.b))) return [];
    return anillo.filter(at => {
      const fuera = v[at].filter(y => anillo.includes(y.j)).map(y => y.j);
      return gruposDistintos(m, at, fuera);
    });
  }
  function cisTrans(x) {
    const m = molecula(x), v = vecinos(m);
    const dobles = m.en.map((e, k) => k).filter(k => m.en[k].o === 2);
    const enl = dobles.filter(k => estereogenico(m, k)).map(k => ({ enlace: k, a: m.en[k].a, b: m.en[k].b }));
    const centros = centrosAnillo(m);
    const anillo = centros.length >= 2;
    const tiene = enl.length > 0 || anillo;
    const halo = dobles.some(k => [m.en[k].a, m.en[k].b].every(at => v[at].some(y => m.at[y.j].el !== 'C')));
    let razon;
    if (enl.length) razon = 'cada carbono del doble enlace tiene dos grupos distintos';
    else if (anillo) razon = 'dos carbonos del anillo tienen cada uno dos grupos distintos: pueden quedar del mismo lado del anillo o en lados opuestos';
    else if (dobles.length) razon = 'un carbono del doble enlace tiene dos grupos iguales: al cambiarlos de lugar sale la misma molécula';
    else if (m.en.some(e => e.o === 3)) razon = 'el triple enlace es lineal: no hay dos lados';
    else razon = 'no hay doble enlace ni anillo con dos carbonos de grupos distintos';
    return { tiene, enlaces: enl, anillo, centrosAnillo: centros, razon,
      errores: { todoAlqueno: dobles.length > 0, soloConHalogenos: halo, porRamificado: m.at.some((a, i) => a.el === 'C' && v[i].filter(y => m.at[y.j].el === 'C').length >= 3) } };
  }

  // ---------- Fórmula, tipo, insaturaciones, carbonos, hibridación ----------
  function cuenta(m) { const c = {}; for (const a of m.at) { c[a.el] = (c[a.el] || 0) + 1; c.H = (c.H || 0) + a.h; } return c; }
  function formula(x) {
    const m = molecula(x), c = cuenta(m);
    const t = ['C', 'H', 'Br', 'Cl'].filter(e => c[e]).map(e => e + (c[e] > 1 ? c[e] : '')).join('');
    return { C: c.C || 0, H: c.H || 0, Cl: c.Cl || 0, Br: c.Br || 0, texto: t };
  }
  function insaturaciones(x) {
    const m = molecula(x), f = formula(m), X = f.Cl + f.Br;
    const valor = (2 * f.C + 2 - f.H - X) / 2;
    const nAn = m.en.length - m.at.length + 1;   // número ciclomático: anillos de una molécula conexa
    const arom = m.en.some(e => e.o === 1.5);
    const dobles = m.en.filter(e => e.o === 2).length + (arom ? 3 : 0), triples = m.en.filter(e => e.o === 3).length;
    return { valor, anillos: nAn, dobles, triples,
      errores: { tripleCuentaUno: nAn + dobles + triples, sinAnillos: dobles + 2 * triples, contarH: (2 * f.C + 2 - f.H) } };
  }
  function tipo(x) {
    const m = molecula(x), c = ciclos(m).length, d = m.en.filter(e => e.o === 2).length, t = m.en.filter(e => e.o === 3).length, ar = m.en.some(e => e.o === 1.5);
    const halo = m.at.some(a => a.el !== 'C');
    let tp, general;
    if (ar) { tp = 'aromático'; general = 'CnH2n-6'; }
    else if (c) { tp = d ? 'cicloalqueno' : (t ? 'cicloalquino' : 'cicloalcano'); general = d ? 'CnH2n-2' : 'CnH2n'; }
    else if (!d && !t) { tp = 'alcano'; general = 'CnH2n+2'; }
    else if (d === 1 && !t) { tp = 'alqueno'; general = 'CnH2n'; }
    else if (t === 1 && !d) { tp = 'alquino'; general = 'CnH2n-2'; }
    else if (d === 2 && !t) { tp = 'dieno'; general = 'CnH2n-2'; }
    else { tp = 'poliinsaturado'; general = null; }
    return { tipo: tp, general: halo ? null : general, halogenado: halo, anillos: c, dobles: d, triples: t };
  }
  function formulaGeneral(t, n) {
    const H = { alcano: 2 * n + 2, alqueno: 2 * n, cicloalcano: 2 * n, alquino: 2 * n - 2, dieno: 2 * n - 2, cicloalqueno: 2 * n - 2 }[t];
    if (H === undefined) throw new Error(`hidrocarburos: no sé la fórmula general de «${t}»`);
    const min = { alcano: 1, alqueno: 2, alquino: 2, cicloalcano: 3, dieno: 3, cicloalqueno: 3 }[t];
    if (n < min) throw new Error(`hidrocarburos: no hay ${t} de ${n} carbonos`);
    return { C: n, H, texto: `C${n > 1 ? n : ''}H${H}` };
  }
  const CLASE = ['ninguno', 'primario', 'secundario', 'terciario', 'cuaternario'];
  function tiposCarbono(x) {
    const m = molecula(x), v = vecinos(m), lista = [], c = { primario: 0, secundario: 0, terciario: 0, cuaternario: 0 }, err = { primario: 0, secundario: 0, terciario: 0, cuaternario: 0 };
    m.at.forEach((a, i) => {
      if (a.el !== 'C') return;
      const nC = v[i].filter(y => m.at[y.j].el === 'C').length, k = CLASE[nC];
      lista.push({ atomo: i, carbonos: nC, clase: nC ? k : null });
      if (nC) c[k]++;
      const porH = { 3: 'primario', 2: 'secundario', 1: 'terciario', 0: 'cuaternario' }[a.h];
      if (porH && a.h < 4) err[porH]++;
    });
    return { lista, cuenta: c, errores: { porHidrogenos: err } };
  }
  function hibridacion(x) {
    const m = molecula(x), v = vecinos(m), lista = [];
    m.at.forEach((a, i) => {
      if (a.el !== 'C') return;
      const os = v[i].map(y => y.o), tri = os.includes(3), dob = os.filter(o => o === 2).length, ar = os.includes(1.5);
      const hib = tri || dob >= 2 ? 'sp' : dob || ar ? 'sp2' : 'sp3';
      const maxO = Math.max(1, ...os.map(o => Math.floor(o)));
      lista.push({ atomo: i, hib, angulo: { sp3: 109.5, sp2: 120, sp: 180 }[hib], error: { exponenteEsOrden: maxO === 1 ? 'sp' : 'sp' + maxO } });
    });
    const hibs = lista.map(z => z.hib);
    return { lista, hibs, angulos: lista.map(z => z.angulo),
      errores: { todoSp3: hibs.map(() => 'sp3'), exponenteEsOrden: lista.map(z => z.error.exponenteEsOrden), todoSp: hibs.map(() => 'sp') } };
  }
  function enlaces(x) {
    const m = molecula(x), f = formula(m);
    let sigma = 0, pi = 0, cc = 0;
    for (const e of m.en) { sigma++; cc++; pi += e.o === 1.5 ? 0.5 : e.o - 1; }
    const ch = f.H; sigma += ch;
    const extra = m.en.reduce((t, e) => t + (e.o === 1.5 ? 0.5 : e.o - 1), 0);
    return { sigma, pi, sigmaCC: cc, sigmaCH: ch, errores: { multipleTodoSigma: { sigma: sigma + extra, pi: 0 }, sinCH: { sigma: sigma - ch, pi } } };
  }

  // ---------- Nombres ----------
  const MULTIPLES = { 1: '', 2: 'di', 3: 'tri', 4: 'tetra' };
  const COMUNES = { '1-metiletil': 'isopropil', '2-metilpropil': 'isobutil', '1-metilpropil': 'sec-butil', '1,1-dimetiletil': 'terc-butil' };
  const alfa = n => n.replace(/^(sec|terc)-/, '').replace(/[()]/g, '');
  function cmp(a, b) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const x = a[i], y = b[i];
      if (x === undefined) return -1; if (y === undefined) return 1;
      if (Array.isArray(x)) { const c = cmp(x, y); if (c) return c; continue; }
      if (x < y) return -1; if (x > y) return 1;
    }
    return 0;
  }
  // Nombre de una rama que empieza en r y cuelga de p.
  function rama(m, v, r, p) {
    if (m.at[r].el !== 'C') return { nombre: HALO[m.at[r].el], alfa: HALO[m.at[r].el], complejo: false, atomos: [r], carbonos: 0 };
    const atomos = [], cola = [r], vis = new Set([p, r]);
    while (cola.length) { const i = cola.shift(); atomos.push(i); for (const y of v[i]) if (!vis.has(y.j)) { vis.add(y.j); cola.push(y.j); } }
    const enRama = new Set(atomos), esC = i => enRama.has(i) && m.at[i].el === 'C';
    const puntas = atomos.filter(i => esC(i) && (i === r || v[i].filter(y => esC(y.j)).length <= 1));
    let mejor = null;
    for (const q of puntas) {
      const P = camino(v, r, q, esC); if (!P) continue;
      const d = desc(m, v, P, new Set([p]));
      const key = [-d.nMult, -P.length, -d.nDoble, -d.subs.length, d.locMult, d.locDoble, d.subs.map(s => s.loc).sort((a, b) => a - b)];
      if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, P, d };
    }
    const { P, d } = mejor;
    let base = raiz(P.length);
    if (d.nMult) {
      const dl = d.locMult.filter((l, i) => d.ordMult[i] === 2), tl = d.locMult.filter((l, i) => d.ordMult[i] === 3);
      let suf = '';
      if (dl.length) suf += (P.length > 2 ? '-' + dl.join(',') + '-' : '') + MULT[dl.length] + 'en';
      if (tl.length) suf += (P.length > 2 ? '-' + tl.join(',') + '-' : '') + MULT[tl.length] + 'in';
      base += (dl.length > 1 || tl.length > 1 ? 'a' : '') + suf;
    }
    const pref = prefijos(d.subs);
    let nombre = pref.texto + base + 'il';
    if (COMUNES[nombre]) nombre = COMUNES[nombre];
    const complejo = d.subs.length > 0 && !Object.values(COMUNES).includes(nombre);
    return { nombre, alfa: alfa(nombre), complejo, atomos, carbonos: atomos.filter(i => m.at[i].el === 'C').length, cadena: P };
  }
  // Lo que cuelga de la cadena P (sin entrar a `fuera`): sustituyentes con su localizador y enlaces múltiples.
  function desc(m, v, P, fuera, o) {
    o = o || {};
    const enP = new Set(P), subs = [], locMult = [], ordMult = [], locDoble = [];
    for (let i = 0; i + 1 < P.length; i++) {
      const e = v[P[i]].find(y => y.j === P[i + 1]);
      if (e.o > 1 && !o.ignorarMult) { const l = o.locMayor ? i + 2 : i + 1; locMult.push(l); ordMult.push(e.o); if (e.o === 2) locDoble.push(l); }
    }
    P.forEach((a, i) => { for (const y of v[a]) if (!enP.has(y.j) && !fuera.has(y.j)) { const r = rama(m, v, y.j, a); subs.push({ ...r, loc: i + 1, raiz: y.j, en: a }); } });
    return { subs, locMult, ordMult, locDoble, nMult: locMult.length, nDoble: locDoble.length };
  }
  // Prefijos agrupados y en orden alfabético: "3-etil-2,2-dimetil". o.porLocalizador: el error de ordenar por número.
  function prefijos(subs, o) {
    o = o || {};
    const g = new Map();
    for (const s of subs) { if (!g.has(s.nombre)) g.set(s.nombre, { nombre: s.nombre, alfa: s.alfa, complejo: s.complejo, locs: [] }); g.get(s.nombre).locs.push(s.loc); }
    const grupos = [...g.values()].map(x => ({ ...x, locs: x.locs.sort((a, b) => a - b) }));
    const conMult = x => (x.locs.length > 1 ? (x.complejo ? MULTC[x.locs.length] : MULT[x.locs.length]) : '') + (x.complejo ? `(${x.nombre})` : x.nombre);
    const clave = x => (x.complejo ? alfa(conMult(x)) : x.alfa);
    grupos.sort(o.porLocalizador ? (a, b) => a.locs[0] - b.locs[0] || (clave(a) < clave(b) ? -1 : 1) : (a, b) => (clave(a) < clave(b) ? -1 : clave(a) > clave(b) ? 1 : 0));
    const partes = [];
    grupos.forEach((x, i) => {
      if (i) partes.push({ t: '-' });
      if (!o.sinLoc) { partes.push({ t: x.locs.join(','), tipo: 'loc' }); partes.push({ t: '-' }); }
      partes.push({ t: conMult(x), tipo: 'sus' });
    });
    return { texto: partes.map(z => z.t).join(''), partes, grupos, alfaLocs: grupos.flatMap(x => x.locs) };
  }
  // Nombre a partir de una cadena P ya numerada (P[0] es el C1).
  function nombrePorCadena(m, P, o) {
    o = o || {};
    const v = vecinos(m), d = desc(m, v, P, new Set(), o);
    const n = P.length, pref = prefijos(d.subs, o), partes = [...pref.partes], ant = [...pref.partes];
    const st = raiz(n);
    const dl = d.locMult.filter((l, i) => d.ordMult[i] === 2), tl = d.locMult.filter((l, i) => d.ordMult[i] === 3);
    const sinLoc = n <= 3;
    if (!dl.length && !tl.length) { partes.push({ t: st, tipo: 'cad' }, { t: 'ano', tipo: 'suf' }); ant.push({ t: st, tipo: 'cad' }, { t: 'ano', tipo: 'suf' }); }
    else {
      const a = (dl.length > 1 || (!dl.length && tl.length > 1)) ? 'a' : '';
      partes.push({ t: st + a, tipo: 'cad' });
      if (dl.length) { if (!sinLoc) partes.push({ t: '-' }, { t: dl.join(','), tipo: 'loc' }, { t: '-' }); partes.push({ t: MULT[dl.length] + (tl.length ? 'en' : 'eno'), tipo: 'mul' }); }
      if (tl.length) { if (!sinLoc) partes.push({ t: '-' }, { t: tl.join(','), tipo: 'loc' }, { t: '-' }); partes.push({ t: MULT[tl.length] + 'ino', tipo: 'mul' }); }
      // Forma anterior: "4-metil-2-penteno", "1,3-butadieno".
      const pri = dl.length ? dl : tl;
      if (!sinLoc) { if (ant.length) ant.push({ t: '-' }); ant.push({ t: pri.join(','), tipo: 'loc' }, { t: '-' }); }
      ant.push({ t: st + (pri.length > 1 ? 'a' : ''), tipo: 'cad' });
      if (dl.length) ant.push({ t: MULT[dl.length] + (tl.length ? 'en' : 'eno'), tipo: 'mul' });
      if (dl.length && tl.length) ant.push({ t: '-' }, { t: tl.join(','), tipo: 'loc' }, { t: '-' });
      if (tl.length) ant.push({ t: MULT[tl.length] + 'ino', tipo: 'mul' });
    }
    // cis / trans, respecto de la cadena principal.
    let ct = null; const cts = [];
    for (let i = 0; i + 1 < n && !o.ignorarMult; i++) {
      const y = v[P[i]].find(z => z.j === P[i + 1]); if (y.o !== 2 || !estereogenico(m, y.k)) continue;
      const c = (m.est || {})[y.k];
      // Referencia de cada extremo: el carbono de la cadena que sigue; en una punta, su único otro átomo (Cl, Br).
      const refDe = (at, otro, prev) => { if (prev !== undefined) return prev; const l = v[at].filter(z => z.j !== otro); return l.length === 1 ? l[0].j : undefined; };
      const izq = refDe(P[i], P[i + 1], P[i - 1]), der = refDe(P[i + 1], P[i], P[i + 2]);
      if (!c || izq === undefined || der === undefined) { cts.push({ loc: i + 1, cfg: null }); continue; }
      const e = m.en[y.k];
      const sa = (e.a === P[i] ? c.a : c.b) === izq, sb = (e.a === P[i] ? c.b : c.a) === der;
      cts.push({ loc: i + 1, cfg: (c.mismo === (sa === sb)) ? 'cis' : 'trans' });
    }
    if (cts.length === 1 && cts[0].cfg) ct = cts[0].cfg;
    const pre = [];
    if (cts.length === 1 && cts[0].cfg) pre.push({ t: cts[0].cfg + '-', tipo: 'ct' });
    else if (cts.length > 1 && cts.every(z => z.cfg)) pre.push({ t: cts.map(z => z.loc + '-' + z.cfg).join(',') + '-', tipo: 'ct' });
    const texto = l => l.map(z => z.t).join('');
    return { nombre: texto([...pre, ...partes]), antiguo: texto([...pre, ...ant]), partes: [...pre, ...partes], cadena: P, d,
      cisTrans: cts.length ? (cts.every(z => z.cfg) ? (ct || cts.map(z => z.cfg).join(',')) : 'sin especificar') : null };
  }
  function opcionesCadena(m) {
    const v = vecinos(m), esC = i => m.at[i].el === 'C', C = carbonos(m);
    const gradoC = i => v[i].filter(y => esC(y.j)).length;
    const puntas = C.filter(i => gradoC(i) <= 1);
    const P = [];
    if (C.length === 1) return [[C[0]]];
    for (const a of puntas) for (const b of puntas) if (a !== b) P.push(camino(v, a, b, esC));
    return P;
  }
  function clave(m, P, regla) {
    const v = vecinos(m), d = desc(m, v, P, new Set());
    const r = nombrePorCadena(m, P);
    const subsLocs = d.subs.map(s => s.loc).sort((a, b) => a - b);
    const pref = prefijos(d.subs);
    const comp = d.subs.filter(s => s.complejo).length;
    const cadena = regla === 'iupac2013' ? [-P.length, -d.nMult, -d.nDoble, -d.subs.length] : [-d.nMult, -P.length, -d.nDoble, -d.subs.length];
    return { key: [...cadena, d.locMult, d.locDoble, subsLocs, comp, pref.alfaLocs, r.nombre], r };
  }
  function nombreAciclico(m, o) {
    let mejor = null;
    for (const P of opcionesCadena(m)) { const k = clave(m, P); if (!mejor || cmp(k.key, mejor.key) < 0) mejor = k; }
    let m13 = null;
    for (const P of opcionesCadena(m)) { const k = clave(m, P, 'iupac2013'); if (!m13 || cmp(k.key, m13.key) < 0) m13 = k; }
    const r = mejor.r, P = r.cadena, n = P.length;
    // Errores típicos.
    // Errores típicos: el nombre que da cada uno (errores) y sus partes de colores (erroresPartes).
    const err = {}, partes = {};
    const poner = (k, q) => { if (q && q.nombre !== r.nombre) { err[k] = q.nombre; partes[k] = q.partes; } else err[k] = null; };
    poner('numeracionContraria', nombrePorCadena(m, [...P].reverse()));
    poner('ordenPorLocalizador', nombrePorCadena(m, P, { porLocalizador: true }));
    const tp = tipo(m), nC = formula(m).C;
    const suf = tp.tipo === 'alcano' ? 'ano' : tp.tipo === 'alquino' ? 'ino' : 'eno';
    poner('todosLosC', nC > n ? { nombre: raiz(nC) + suf, partes: [{ t: raiz(nC), tipo: 'cad' }, { t: suf, tipo: suf === 'ano' ? 'suf' : 'mul' }] } : null);
    if (r.d.nMult) {
      // Numerar dando el número más bajo a las ramas (y no al enlace múltiple).
      let alt = null;
      for (const Q of [P, [...P].reverse()]) { const d = desc(m, vecinos(m), Q, new Set()); const k = [d.subs.map(s => s.loc).sort((a, b) => a - b), d.locMult]; if (!alt || cmp(k, alt.k) < 0) alt = { k, Q }; }
      poner('numeracionPorSustituyente', nombrePorCadena(m, alt.Q));
      poner('localizadorMayor', nombrePorCadena(m, P, { locMayor: true }));
      // Como si el enlace múltiple no estuviera: el nombre del alcano con el mismo esqueleto.
      const sat = clonar(m); sat.en.forEach(e => { e.o = 1; }); sat.est = {}; sat.at.forEach(a => { delete a.h; }); completarH(sat);
      poner('comoAlcano', nombre(sat));
    }
    if (o && o.dibujada) {
      const D = o.dibujada; let b = null;
      for (const Q of [D, [...D].reverse()]) { const k = clave(m, Q); if (!b || cmp(k.key.slice(4), b.key.slice(4)) < 0) b = k; }
      poner('cadenaDibujada', b.r);
      poner('cadenaDibujadaContraria', nombrePorCadena(m, b.r.cadena.slice().reverse()));
    }
    // Las dos reglas eligen cadenas distintas solo si la cadena escolar no es una de las más largas.
    return { ...r, tipo: tp.tipo, difiereIUPAC2013: m13.r.cadena.length !== n, errores: err, erroresPartes: partes };
  }
  function nombreCiclico(m, anillo, o) {
    const v = vecinos(m), k = anillo.length, enA = new Set(anillo);
    const bond = (a, b) => v[a].find(y => y.j === b);
    const arom = anillo.every((a, i) => bond(a, anillo[(i + 1) % k]).o === 1.5);
    const dob = anillo.map((a, i) => bond(a, anillo[(i + 1) % k]).o).filter(x => x === 2).length;
    if (m.en.some((e, q) => e.o > 1 && e.o !== 1.5 && !(enA.has(e.a) && enA.has(e.b)))) throw new Error('hidrocarburos: no sé nombrar un anillo con enlaces múltiples en las ramas');
    if (dob > 1) throw new Error('hidrocarburos: no sé nombrar un anillo con más de un doble enlace');
    if (arom && k !== 6) throw new Error('hidrocarburos: anillo aromático que no es benceno');
    let mejor = null;
    for (let s = 0; s < k; s++) for (const dir of [1, -1]) {
      const ord = Array.from({ length: k }, (_, i) => anillo[((s + dir * i) % k + k) % k]);
      if (dob && bond(ord[0], ord[1]).o !== 2) continue;
      const subs = [];
      ord.forEach((a, i) => { for (const y of v[a]) if (!enA.has(y.j)) subs.push({ ...rama(m, v, y.j, a), loc: i + 1, raiz: y.j, en: a }); });
      const pref = prefijos(subs);
      const key = [subs.map(z => z.loc).sort((a, b) => a - b), pref.alfaLocs];
      if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, ord, subs, pref };
    }
    const { ord, subs } = mejor;
    for (const s of subs) if (s.carbonos > k) throw new Error('hidrocarburos: la rama es más larga que el anillo (fuera de la escena)');
    const sinLoc = subs.length === 1 && !dob;
    const pref = prefijos(subs, { sinLoc });
    const partes = [...pref.partes];
    let base;
    if (arom) { partes.push({ t: 'benceno', tipo: 'cad' }); base = 'benceno'; }
    else { partes.push({ t: 'ciclo' + raiz(k), tipo: 'cad' }, { t: dob ? 'eno' : 'ano', tipo: dob ? 'mul' : 'suf' }); }
    let pre = [];
    if (m.anillo && centrosAnillo(m).length === 2) pre = [{ t: m.anillo + '-', tipo: 'ct' }];
    const nombreT = [...pre, ...partes].map(z => z.t).join('');
    let comun = null;
    if (arom) {
      if (subs.length === 1 && subs[0].nombre === 'metil') comun = 'tolueno';
      if (subs.length === 2 && subs.every(z => z.nombre === 'metil')) comun = { 2: 'o-xileno', 3: 'm-xileno', 4: 'p-xileno' }[subs[1].loc];
    }
    const err = {};
    if (subs.length > 1) { const alt = prefijos(subs, { porLocalizador: true }); const t = [...alt.partes, ...partes.slice(pref.partes.length)].map(z => z.t).join(''); if (t !== nombreT) err.ordenPorLocalizador = t; }
    return { nombre: nombreT, antiguo: nombreT, partes: [...pre, ...partes], cadena: ord, anillo: true, comun, d: { subs, locMult: dob ? [1] : [], ordMult: dob ? [2] : [] },
      cisTrans: centrosAnillo(m).length === 2 ? (m.anillo || 'sin especificar') : null, tipo: tipo(m).tipo, difiereIUPAC2013: false, errores: err };
  }
  function nombre(x, o) {
    const m = molecula(x);
    const c = ciclos(m);
    if (c.length > 1) throw new Error('hidrocarburos: no sé nombrar moléculas con más de un anillo');
    if (formula(m).C > 12) throw new Error('hidrocarburos: demasiados carbonos para la escena');
    const r = c.length ? nombreCiclico(m, c[0], o) : nombreAciclico(m, o);
    const subs = r.d.subs.map(s => ({ nombre: s.nombre, loc: s.loc, atomos: s.atomos, en: s.en }));
    return { nombre: r.nombre, antiguo: r.antiguo, comun: r.comun || null, partes: r.partes, cadena: r.cadena, anillo: !!r.anillo,
      localizadores: { multiples: r.d.locMult, sustituyentes: subs.map(s => s.loc).sort((a, b) => a - b) }, sustituyentes: subs,
      cisTrans: r.cisTrans, tipo: r.tipo, difiereIUPAC2013: !!r.difiereIUPAC2013, errores: r.errores, erroresPartes: r.erroresPartes || {} };
  }

  // Semidesarrollada escrita por el motor, a lo largo de la cadena principal: "CH3–CH(CH3)–CH2–CH3".
  function semidesarrollada(x) {
    const m = molecula(x);
    if (ciclos(m).length) return null;
    const v = vecinos(m), P = nombre(m).cadena, enP = new Set(P);
    const sim = { 1: '–', 2: '=', 3: '≡' };
    const grupo = (a, de) => {   // condensada de una rama, sin guiones: CH2CH3, CH(CH3)2
      const at = m.at[a]; if (at.el !== 'C') return at.el;
      let t = 'C' + (at.h ? 'H' + (at.h > 1 ? at.h : '') : '');
      const hijos = v[a].filter(y => y.j !== de);
      if (!hijos.length) return t;
      const prof = j => { let mx = 0; const vis = new Set([a]); const r = (i, d) => { vis.add(i); mx = Math.max(mx, d); for (const y of v[i]) if (!vis.has(y.j)) r(y.j, d + 1); }; r(j, 1); return mx; };
      hijos.sort((p, q) => prof(p.j) - prof(q.j));
      if (prof(hijos[hijos.length - 1].j) === 1 && hijos.length > 1) return t + ramas(hijos.map(y => (y.o > 1 ? sim[y.o] : '') + grupo(y.j, a)));
      const sigue = hijos.pop();
      t += ramas(hijos.map(y => (y.o > 1 ? sim[y.o] : '') + grupo(y.j, a)));
      return t + (sigue.o > 1 ? sim[sigue.o] : '') + grupo(sigue.j, a);
    };
    const ramas = l => { const g = new Map(); for (const s of l) g.set(s, (g.get(s) || 0) + 1); return [...g].map(([s, k]) => `(${s})${k > 1 ? k : ''}`).join(''); };
    const partes = P.map((a, i) => {
      const at = m.at[a]; let t = 'C' + (at.h ? 'H' + (at.h > 1 ? at.h : '') : '');
      const fuera = v[a].filter(y => !enP.has(y.j));
      const hal = fuera.filter(y => m.at[y.j].el !== 'C'), car = fuera.filter(y => m.at[y.j].el === 'C');
      const g = new Map(); for (const y of hal) g.set(m.at[y.j].el, (g.get(m.at[y.j].el) || 0) + 1);
      for (const [e, k] of g) t += e + (k > 1 ? k : '');
      t += ramas(car.map(y => (y.o > 1 ? sim[y.o] : '') + grupo(y.j, a)));
      return t;
    });
    let s = partes[0];
    for (let i = 1; i < P.length; i++) s += sim[v[P[i - 1]].find(y => y.j === P[i]).o] + partes[i];
    return s;
  }

  // ---------- Isómeros ----------
  const CACHE = {};
  function crecer(lista, n) {   // agrega un CH3 a cada lugar posible; deja una de cada forma canónica
    const vistos = new Map();
    for (const m of lista) m.at.forEach((a, i) => {
      if (a.el !== 'C' || a.h < 1) return;
      const q = clonar(m); q.at.push({ el: 'C' }); enlazar(q, i, q.at.length - 1, 1); q.at.forEach(z => { delete z.h; }); completarH(q);
      const k = canonica(q, { estereo: false }); if (!vistos.has(k)) vistos.set(k, q);
    });
    return [...vistos.values()];
  }
  function alcanos(n) {
    if (n < 1 || n > 10) throw new Error('hidrocarburos: alcanos de 1 a 10 carbonos');
    if (CACHE['a' + n]) return CACHE['a' + n];
    let l = [molecula('C')];
    for (let k = 2; k <= n; k++) l = CACHE['a' + k] || (CACHE['a' + k] = crecer(l, k));
    return (CACHE['a' + n] = l);
  }
  function conMultiple(n, o) {   // alquenos (o = 2) o alquinos (o = 3) con un solo enlace múltiple
    if (n < 2 || n > 8) throw new Error('hidrocarburos: alquenos y alquinos de 2 a 8 carbonos');
    const vistos = new Map();
    for (const a of alcanos(n)) a.en.forEach((e, k) => {
      if (a.at[e.a].h < o - 1 || a.at[e.b].h < o - 1) return;
      const q = clonar(a); q.en[k].o = o; q.at.forEach(z => { delete z.h; }); completarH(q);
      const c = canonica(q, { estereo: false }); if (!vistos.has(c)) vistos.set(c, q);
    });
    return [...vistos.values()];
  }
  function cicloalcanos(n) {
    if (n < 3 || n > 6) throw new Error('hidrocarburos: cicloalcanos de 3 a 6 carbonos');
    const vistos = new Map();
    for (let r = 3; r <= n; r++) {
      let l = [molecula('C1' + 'C'.repeat(r - 1) + '1')];
      for (let k = r + 1; k <= n; k++) l = crecer(l, k);
      for (const q of l) vistos.set(canonica(q, { estereo: false }), q);
    }
    return [...vistos.values()];
  }
  // Las dos formas de un doble enlace estereogénico (o de un anillo con dos centros).
  function formasEstereo(m) {
    const ks = m.en.map((e, k) => k).filter(k => estereogenico(m, k));
    if (ks.length) {
      let out = [m];
      for (const k of ks) out = out.flatMap(q => [true, false].map(mismo => {
        const z = clonar(q), e = z.en[k], v = vecinos(z);
        z.est[k] = { a: v[e.a].find(y => y.j !== e.b).j, b: v[e.b].find(y => y.j !== e.a).j, mismo };
        return z;
      }));
      const vistos = new Map(); for (const q of out) vistos.set(canonica(q), q);
      return [...vistos.values()];
    }
    if (centrosAnillo(m).length === 2) return ['cis', 'trans'].map(t => { const z = clonar(m); z.anillo = t; return z; });
    return [m];
  }
  function isomeros(n, clase, o) {
    o = o || {};
    let l;
    if (clase === 'alcano') l = alcanos(n);
    else if (clase === 'alqueno') l = conMultiple(n, 2);
    else if (clase === 'alquino') l = conMultiple(n, 3);
    else if (clase === 'cicloalcano') l = cicloalcanos(n);
    else if (clase === 'CnH2n') l = [...conMultiple(n, 2), ...(n >= 3 ? cicloalcanos(n) : [])];
    else throw new Error(`hidrocarburos: no sé enumerar «${clase}»`);
    if (o.cisTrans) {
      if (l.some(m => ciclos(m).length) && n > 5) throw new Error('hidrocarburos: cis-trans en anillos solo hasta 5 carbonos');
      l = l.flatMap(formasEstereo);
    }
    const lista = l.map(m => { const r = nombre(m); return { nombre: r.nombre, antiguo: r.antiguo, formula: formula(m).texto, molecula: m, cisTrans: r.cisTrans }; });
    const orden = z => [ciclos(z.molecula).length ? 1 : 0, -nombre(z.molecula).cadena.length, z.nombre.replace(/^(cis|trans)-/, ''), z.nombre];
    lista.sort((a, b) => cmp(orden(a), orden(b)));
    return lista;
  }
  // Cuántos isómeros, y lo que da cada error al contarlos.
  function contarIsomeros(n, clase, o) {
    o = o || {};
    const l = isomeros(n, clase, o), sin = isomeros(n, clase, { ...o, cisTrans: false });
    const err = {};
    if (clase === 'alcano') {
      err.sinCuaternario = l.filter(z => !tiposCarbono(z.molecula).cuenta.cuaternario).length;
      err.torcidaDosVeces = l.length + 1;
      if (n < 10) err.deUnCarbonoMas = isomeros(n + 1, 'alcano').length;
    }
    if (o.cisTrans) err.sinCisTrans = sin.length;
    if (clase === 'CnH2n') { err.sinAnillos = l.filter(z => !ciclos(z.molecula).length).length; err.sinAnillosNiCisTrans = sin.filter(z => !ciclos(z.molecula).length).length; }
    return { n: l.length, nombres: l.map(z => z.nombre), errores: err };
  }

  // ---------- Coordenadas, girar, intercambiar ----------
  const R60 = Math.PI / 3;
  const LCH = 0.64;
  function coordenadas(x, o) {
    o = o || {};
    const m = molecula(x), v = vecinos(m), n = m.at.length, pos = new Array(n);
    const sp = i => v[i].some(y => y.o === 3) || v[i].filter(y => y.o === 2).length >= 2;
    const cs = ciclos(m);
    const prof = (j, de) => { let mx = 0; const vis = new Set([de]); const r = (i, d) => { vis.add(i); mx = Math.max(mx, d); for (const y of v[i]) if (!vis.has(y.j)) r(y.j, d + 1); }; r(j, 1); return mx; };
    const P = cs.length ? null : (o.cadena || nombre(m).cadena);
    const sigP = new Map(); if (P) P.forEach((a, i) => { if (i + 1 < P.length) sigP.set(a, P[i + 1]); });
    const colocar = (a, de, dir, giro) => {
      const hijos = v[a].filter(y => y.j !== de && pos[y.j] === undefined).map(y => y.j);
      if (!hijos.length) return;
      const pri = sigP.has(a) && hijos.includes(sigP.get(a)) ? sigP.get(a) : hijos.slice().sort((p, q) => prof(q, a) - prof(p, a))[0];
      const otros = hijos.filter(h => h !== pri);
      let dirs;
      if (sp(a)) dirs = [dir, dir + Math.PI / 2, dir - Math.PI / 2];
      else if (hijos.length === 1) dirs = [dir + giro * R60];
      else if (hijos.length === 2) dirs = [dir + giro * R60, dir - giro * R60];
      else dirs = [dir, dir + Math.PI / 2, dir - Math.PI / 2];
      const lista = [pri, ...otros];
      lista.forEach((h, k) => {
        const d = dirs[k], p = pos[a];
        pos[h] = { x: p.x + Math.cos(d), y: p.y + Math.sin(d), z: 0 };
        const g = h === pri ? (hijos.length >= 3 || sp(a) ? giro : -giro) : (Math.sin(d - dir) > 0 ? -1 : 1);
        colocar(h, a, d, g);
      });
    };
    if (cs.length) {
      const an = cs[0], k = an.length, R = 1 / (2 * Math.sin(Math.PI / k));
      an.forEach((a, i) => { const t = Math.PI / 2 + 2 * Math.PI * i / k + (k % 2 ? 0 : Math.PI / k); pos[a] = { x: R * Math.cos(t), y: R * Math.sin(t), z: 0 }; });
      const enA = new Set(an), centros = centrosAnillo(m);
      let signo = 1;
      an.forEach(a => {
        const d = Math.atan2(pos[a].y, pos[a].x);
        const hijos = v[a].filter(y => !enA.has(y.j)).map(y => y.j);
        const dirs = hijos.length === 2 ? [d + 0.5, d - 0.5] : [d];
        hijos.forEach((h, q) => {
          let z = 0;
          if (m.anillo && centros.includes(a) && hijos.length === 1) { z = signo * 0.7; signo = m.anillo === 'cis' ? signo : -signo; }
          pos[h] = { x: pos[a].x + Math.cos(dirs[q]) * (z ? 0.8 : 1), y: pos[a].y + Math.sin(dirs[q]) * (z ? 0.8 : 1), z };
          colocar(h, a, dirs[q], -1);
        });
      });
    } else {
      const r0 = P[0]; pos[r0] = { x: 0, y: 0, z: 0 };
      const h0 = v[r0].map(y => y.j);
      if (h0.length) {
        const d0 = sp(r0) || (h0.length && sp(h0[0])) ? 0 : Math.PI / 6;
        const pri = sigP.get(r0) !== undefined ? sigP.get(r0) : h0[0];
        pos[pri] = { x: Math.cos(d0), y: Math.sin(d0), z: 0 };
        const paso = h0.length === 2 ? 2 * Math.PI / 3 : 2 * Math.PI / h0.length;
        h0.filter(h => h !== pri).forEach((h, k) => { const d = d0 + (k + 1) * paso; pos[h] = { x: Math.cos(d), y: Math.sin(d), z: 0 }; colocar(h, r0, d, -1); });
        colocar(pri, r0, d0, -1);
      }
    }
    // Configuración cis-trans pedida por la molécula: si el dibujo sale al revés, se cambian los grupos de lado.
    let c = { atomos: m.at.map((a, i) => ({ i, el: a.el, x: pos[i].x, y: pos[i].y, z: pos[i].z, padre: null })), enlaces: m.en.map(e => ({ ...e })) };
    for (const [k, cfg] of Object.entries(m.est || {})) {
      if (!estereogenico(m, +k)) continue;
      if (ladoMismo(c, m.en[k], cfg.a, cfg.b) !== cfg.mismo) c = reflejar(m, c, +k, m.en[k].b);
    }
    // Hidrógenos en los huecos más grandes.
    m.at.forEach((a, i) => {
      if (!a.h) return;
      const p = c.atomos[i], ang = v[i].map(y => Math.atan2(c.atomos[y.j].y - p.y, c.atomos[y.j].x - p.x)).sort((s, t) => s - t);
      let dirs = [];
      if (!ang.length) dirs = [0, Math.PI / 2, Math.PI, -Math.PI / 2].slice(0, a.h);
      else {
        const huecos = ang.map((t, q) => { const sig = q + 1 < ang.length ? ang[q + 1] : ang[0] + 2 * Math.PI; return { ini: t, ancho: sig - t, k: 0 }; });
        for (let q = 0; q < a.h; q++) huecos.sort((s, t) => t.ancho / (t.k + 1) - s.ancho / (s.k + 1))[0].k++;
        // Repartidos en el hueco, sin abrirse más de 72° entre sí (un CH₃ de punta queda como tridente).
        for (const hq of huecos) { const pasoH = Math.min(hq.ancho / (hq.k + 1), 1.25), mid = hq.ini + hq.ancho / 2; for (let q = 0; q < hq.k; q++) dirs.push(mid + (q - (hq.k - 1) / 2) * pasoH); }
      }
      dirs.forEach(d => c.atomos.push({ i: c.atomos.length, el: 'H', x: p.x + LCH * Math.cos(d), y: p.y + LCH * Math.sin(d), z: p.z, padre: i, ang: d }));
    });
    // Los H se acomodan un poco (hasta ±40°) para no encimarse con otros átomos.
    const otros = h => c.atomos.filter(q => q.i !== h.i && q.i !== h.padre);
    for (let pasada = 0; pasada < 3; pasada++) for (const h of c.atomos) {
      if (h.padre === null) continue;
      const p = c.atomos[h.padre], vec = otros(h);
      const lejos = d => { const x = p.x + LCH * Math.cos(d), y = p.y + LCH * Math.sin(d); return Math.min(...vec.map(q => Math.hypot(q.x - x, q.y - y, q.z - p.z) - (q.el === 'H' ? 0 : 0.25))); };
      let mejor = h.ang, val = lejos(h.ang);
      for (let dd = -0.7; dd <= 0.7001; dd += 0.0875) { const t = lejos(h.ang + dd) - Math.abs(dd) * 0.05; if (t > val + 1e-9) { val = t; mejor = h.ang + dd; } }
      h.x = p.x + LCH * Math.cos(mejor); h.y = p.y + LCH * Math.sin(mejor);
    }
    c.atomos.forEach(q => { delete q.ang; });
    return c;
  }
  // ¿Los vecinos na (del átomo e.a) y nb (de e.b) quedan del mismo lado de la recta del enlace?
  function ladoMismo(c, e, na, nb) {
    const A = c.atomos[e.a], B = c.atomos[e.b], lado = P => Math.sign((B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x));
    return lado(c.atomos[na]) === lado(c.atomos[nb]);
  }
  // Átomos (con sus H) del lado de `mueve` al cortar el enlace k.
  function ladoDe(m, k, mueve) {
    const e = m.en[k], fijo = mueve === e.a ? e.b : e.a, v = vecinos(m), vis = new Set([mueve]), pila = [mueve];
    while (pila.length) { const i = pila.pop(); for (const y of v[i]) if (y.j !== fijo && !vis.has(y.j)) { vis.add(y.j); pila.push(y.j); } }
    if (vis.has(fijo)) return null;
    return vis;
  }
  // Rotación 3D de un lado alrededor del eje del enlace k (Rodrigues). theta en radianes.
  function rotar(m, c, k, theta, mueve) {
    const e = m.en[k], lado = ladoDe(m, k, mueve), fijo = mueve === e.a ? e.b : e.a;
    const A = c.atomos[fijo], B = c.atomos[mueve];
    const ux0 = B.x - A.x, uy0 = B.y - A.y, uz0 = B.z - A.z, L = Math.hypot(ux0, uy0, uz0), ux = ux0 / L, uy = uy0 / L, uz = uz0 / L;
    const co = Math.cos(theta), si = Math.sin(theta);
    const atomos = c.atomos.map(p => {
      const dentro = (p.padre === null ? lado.has(p.i) : lado.has(p.padre)) && p.i !== mueve;
      if (!dentro) return { ...p };
      const vx = p.x - B.x, vy = p.y - B.y, vz = p.z - B.z, dot = ux * vx + uy * vy + uz * vz;
      const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
      return { ...p, x: B.x + vx * co + cx * si + ux * dot * (1 - co), y: B.y + vy * co + cy * si + uy * dot * (1 - co), z: B.z + vz * co + cz * si + uz * dot * (1 - co) };
    });
    return { atomos, enlaces: c.enlaces };
  }
  const reflejar = (m, c, k, mueve) => { const r = rotar(m, c, k, Math.PI, mueve); r.atomos.forEach(p => { if (Math.abs(p.z) < 1e-9) p.z = 0; }); return r; };
  // Girar una rama alrededor de un enlace simple. Por defecto gira el lado más chico.
  function girar(x, c, k, theta, mueve) {
    const m = molecula(x), e = m.en[k];
    if (!e) throw new Error('hidrocarburos: no hay ese enlace');
    if (e.o === 2 || e.o === 1.5) return { ok: false, razon: 'doble', texto: 'El doble enlace no gira: para girarlo habría que romper el enlace π.' };
    if (enAnillo(m, k)) return { ok: false, razon: 'anillo', texto: 'Dentro de un anillo los enlaces no giran del todo: el anillo no se abre.' };
    if (mueve === undefined) { const la = ladoDe(m, k, e.a), lb = ladoDe(m, k, e.b); const t = s => [...s].reduce((q, i) => q + 1 + m.at[i].h, 0); mueve = t(la) <= t(lb) ? e.a : e.b; }
    const r = rotar(m, c, k, theta === undefined ? Math.PI : theta, mueve);
    return { ok: true, coords: r, mueve };
  }
  // Intercambiar los dos grupos de un carbono del doble enlace (girar 180° el doble enlace: romper el π).
  // theta (por defecto π) sirve para animar el giro a medias; los nombres se leen del dibujo final, a media vuelta.
  function intercambiar(x, c, k, mueve, theta) {
    const m = molecula(x), e = m.en[k];
    if (!e || e.o !== 2) throw new Error('hidrocarburos: intercambiar es para un doble enlace');
    const lado = mueve === undefined ? e.b : mueve;
    if (theta !== undefined && theta !== Math.PI) return { coords: rotar(m, c, k, theta, lado), parcial: true };
    const r = reflejar(m, c, k, lado);
    const antes = estereoDeCoordenadas(m, c), despues = estereoDeCoordenadas(m, r);
    return { coords: r, antes: nombre(antes).nombre, despues: nombre(despues).nombre, mismaMolecula: canonica(antes) === canonica(despues) };
  }
  // La molécula con la configuración de cada doble enlace leída del dibujo (solo si el dibujo es plano, z = 0).
  function estereoDeCoordenadas(x, c) {
    const m = clonar(molecula(x)), v = vecinos(m); m.est = {};
    m.en.forEach((e, k) => {
      if (!estereogenico(m, k)) return;
      const na = v[e.a].find(y => y.j !== e.b).j, nb = v[e.b].find(y => y.j !== e.a).j;
      m.est[k] = { a: na, b: nb, mismo: ladoMismo(c, e, na, nb) };
    });
    return m;
  }

  // ---------- Armar ----------
  function rehacer(q) { q.at.forEach(z => { delete z.h; }); return completarH(q); }
  function agregarC(x, i) {
    const m = clonar(molecula(x));
    if (!m.at[i] || m.at[i].el !== 'C') throw new Error('hidrocarburos: ahí no hay un carbono');
    if (m.at[i].h < 1) throw new Error('hidrocarburos: ese carbono ya tiene sus 4 enlaces');
    if (formula(m).C >= 10) throw new Error('hidrocarburos: hasta 10 carbonos');
    m.at.push({ el: 'C' }); enlazar(m, i, m.at.length - 1, 1); return rehacer(m);
  }
  function quitarC(x, i) {
    const m = clonar(molecula(x)), v = vecinos(m);
    if (!m.at[i] || m.at[i].el !== 'C') throw new Error('hidrocarburos: ahí no hay un carbono');
    if (formula(m).C <= 1) throw new Error('hidrocarburos: queda un solo carbono');
    if (v[i].length > 1) throw new Error('hidrocarburos: solo se quita un carbono de una punta');
    const nuevo = j => (j > i ? j - 1 : j);
    const est = {};
    m.en.forEach((e, k) => { if (m.est[k] && e.a !== i && e.b !== i && m.est[k].a !== i && m.est[k].b !== i) est[k] = m.est[k]; });
    const en = [], mapa = {};
    m.en.forEach((e, k) => { if (e.a === i || e.b === i) return; mapa[k] = en.length; en.push({ a: nuevo(e.a), b: nuevo(e.b), o: e.o }); });
    const q = { at: m.at.filter((a, j) => j !== i).map(a => ({ el: a.el })), en, est: {} };
    for (const [k, c] of Object.entries(est)) q.est[mapa[k]] = { a: nuevo(c.a), b: nuevo(c.b), mismo: c.mismo };
    return completarH(q);
  }
  function cambiarEnlace(x, k) {
    const m = clonar(molecula(x)), e = m.en[k];
    if (!e) throw new Error('hidrocarburos: no hay ese enlace');
    if (e.o === 1.5) throw new Error('hidrocarburos: el benceno no se cambia');
    for (let paso = 1; paso <= 3; paso++) {
      const o = (e.o - 1 + paso) % 3 + 1;
      const q = clonar(m); q.en[k].o = o; delete q.est[k];
      try { return rehacer(q); } catch (err) { /* valencia: se prueba el siguiente */ }
    }
    throw new Error('hidrocarburos: ese enlace no puede cambiar');
  }

  // Una serie de pasos de armado: [['agregar', i], ['quitar', i], ['enlace', k]] → la molécula y su resumen.
  function armar(x, acciones) {
    let m = molecula(x);
    for (const [q, i] of acciones || []) m = q === 'agregar' ? agregarC(m, i) : q === 'quitar' ? quitarC(m, i) : q === 'enlace' ? cambiarEnlace(m, i) : (() => { throw new Error(`hidrocarburos: no sé «${q}»`); })();
    const r = nombre(m);
    return { molecula: m, nombre: r.nombre, formula: formula(m).texto, tipo: tipo(m).tipo, semidesarrollada: semidesarrollada(m), carbonos: tiposCarbono(m).cuenta, errores: r.errores };
  }
  // ¿Qué sale si se intercambian los dos grupos de un carbono del (primer) doble enlace?
  function probarIntercambio(x) {
    const m = molecula(x), k = m.en.findIndex(e => e.o === 2);
    if (k < 0) throw new Error('hidrocarburos: no hay doble enlace');
    const c = coordenadas(m), e = m.en[k], v = vecinos(m);
    // Se intercambian los grupos del extremo que tenga carbonos a los dos lados, si hay; si no, del segundo.
    const mueve = v[e.a].filter(y => y.j !== e.b).length + m.at[e.a].h === 2 && v[e.a].filter(y => y.j !== e.b).length === 2 ? e.a : e.b;
    const r = intercambiar(m, c, k, mueve);
    return { enlace: k, mueve, antes: r.antes, despues: r.despues, mismaMolecula: r.mismaMolecula, errores: { todoAlqueno: !r.mismaMolecula ? null : 'trans-' + r.antes } };
  }
  // Dos fórmulas: ¿misma fórmula molecular?, ¿misma molécula?, ¿isómeros?
  function compararIsomeria(a, b) {
    const A = molecula(a), B = molecula(b), fa = formula(A).texto, fb = formula(B).texto, misma = mismaMolecula(A, B);
    const r = { formulaA: fa, formulaB: fb, mismaFormula: fa === fb, mismaMolecula: misma, isomeros: fa === fb && !misma, tipoA: tipo(A).tipo, tipoB: tipo(B).tipo };
    // Lo que concluye cada error: «mismos átomos, misma sustancia» y «isómeros solo si son de la misma clase» (HC1).
    r.errores = { mismaSustancia: { isomeros: false, mismaMolecula: fa === fb }, soloMismaClase: { isomeros: r.isomeros && r.tipoA === r.tipoB } };
    return r;
  }

  // ---------- Puntos de ebullición de referencia ----------
  // °C a 1 atm, CRC Handbook (redondeados a 0,1 °C).
  const EBULLICION = {
    'metano': -161.5, 'etano': -88.6, 'propano': -42.1, 'butano': -0.5, '2-metilpropano': -11.7,
    'pentano': 36.1, '2-metilbutano': 27.8, '2,2-dimetilpropano': 9.5,
    'hexano': 68.7, '2-metilpentano': 60.3, '3-metilpentano': 63.3, '2,2-dimetilbutano': 49.7, '2,3-dimetilbutano': 58.0,
    'heptano': 98.4, 'octano': 125.6, '2,2,4-trimetilpentano': 99.2
  };
  function ebullicion(x) {
    const m = molecula(x), n = nombre(m).nombre, teb = EBULLICION[n];
    if (teb === undefined) return { nombre: n, teb: null, fuente: null };
    return { nombre: n, teb, fuente: 'tabla (CRC Handbook)', errores: { porCarbonos: 'igual que los otros alcanos de ' + formula(m).C + ' C' } };
  }
  // Comparar dos alcanos: cuál hierve a mayor temperatura y por qué.
  function compararEbullicion(a, b) {
    const A = ebullicion(a), B = ebullicion(b);
    if (A.teb === null || B.teb === null) throw new Error('hidrocarburos: falta el dato de tabla');
    const fa = formula(a).C, fb = formula(b).C, mayor = A.teb > B.teb ? A.nombre : B.nombre;
    const razon = fa !== fb ? 'más carbonos: más superficie y más masa' : 'misma cantidad de carbonos: la cadena recta (o menos ramificada) tiene más superficie de contacto';
    return { mayor, a: A, b: B, diferencia: Math.abs(A.teb - B.teb), razon, errores: { porCarbonos: fa === fb ? 'iguales' : (fa > fb ? A.nombre : B.nombre), compacto: fa === fb ? (A.teb > B.teb ? B.nombre : A.nombre) : null } };
  }

  return {
    molecula, formula, tipo, formulaGeneral, insaturaciones, tiposCarbono, hibridacion, enlaces,
    canonica, mismaMolecula, cisTrans, nombre, semidesarrollada, cadenas,
    isomeros, contarIsomeros, coordenadas, girar, intercambiar, estereoDeCoordenadas,
    agregarC, quitarC, cambiarEnlace, armar, probarIntercambio, compararIsomeria, ebullicion, compararEbullicion, EBULLICION,
    // Para las pruebas
    ciclos: x => ciclos(molecula(x)), enAnillo: (x, k) => enAnillo(molecula(x), k)
  };
});
