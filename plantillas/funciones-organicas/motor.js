/*
 * Motor de «El grupo que se cambia: funciones orgánicas».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorFunciones) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Parte de plantillas/hidrocarburos/motor.js (grafo, forma canónica, coordenadas), copiado y adaptado aquí.
 *
 * La idea: una molécula es un GRAFO de átomos C, O y N (valencias 4, 2 y 3; los H van implícitos: los que faltan
 * para llegar a la valencia), con enlaces simples, dobles y triples. El mismo esqueleto de carbonos con otro grupo
 * (o el grupo en otro lugar) es otra sustancia: otra familia, otro nombre, otras propiedades. Si la fórmula
 * molecular no cambia, son isómeros (de función, de posición o de cadena).
 *
 * Qué calcula:
 *   - molecula(texto): lee una semidesarrollada ("CH3-CH2-OH", "CH3-O-CH3", "CH3-CHO", "CH3-CO-CH3", "CH3-COOH",
 *     "CH3-COO-CH3", "HCOOH", "CH3-NH2", "(CH3)2NH", "(CH3)3N", "CH3-CONH2", "CH3-CN", "(CH3)3C-OH",
 *     "CH3-CH(OH)-CH3", "C2H5-O-C2H5", "C6H5-OH") o un SMILES sencillo ("CCO", "COC", "CC(=O)O", "CC#N",
 *     "c1ccccc1O"). Comprueba la valencia de cada átomo.
 *   - formula (molecular, orden de Hill: C, H y luego N, O), grupos funcionales y familia (funcion), grupo
 *     principal por prioridad: ácido > éster > amida > nitrilo > aldehído > cetona > alcohol (y fenol) > amina > éter.
 *   - nombre: IUPAC de compuestos monofuncionales de esqueleto saturado, C1 a C8 (cadena principal que contiene el
 *     grupo, numeración con el localizador más bajo para el grupo, después para las ramas; sufijos -ol, -al, -ona,
 *     ácido …-oico, …-oato de …ilo, -amida, -nitrilo, -amina; éteres como alcoxi-alcano; aminas secundarias y
 *     terciarias con N-; varios –OH o C=O del mismo tipo con di-, tri-). Benceno con un solo grupo: fenol,
 *     metoxibenceno, fenilmetanol, bencenamina, bencenocarbaldehído, ácido bencenocarboxílico. También la forma
 *     anterior del nombre ("2-propanol") y el nombre común de una lista (COMUNES).
 *   - tipoAlcohol (primario, secundario, terciario: cuántos C tiene unidos el C del –OH) y tipoAmina (primaria,
 *     secundaria, terciaria: cuántos C tiene unidos el N).
 *   - compararIsomeria(a, b): ¿misma fórmula?, ¿misma sustancia?, ¿isómeros?, ¿de qué tipo? (función, posición o
 *     cadena). isomeros(fórmula): todos los isómeros estructurales monofuncionales de una fórmula pequeña.
 *   - puentes: ¿forma puentes de hidrógeno entre sus moléculas? (hace falta un H unido a O o N) ¿con el agua? (basta
 *     un O o un N que reciba el H del agua).
 *   - ebullicion / compararEbullicion: puntos de ebullición normales de referencia, de tabla.
 *   - ponerGrupo (la caja de grupos: el mismo esqueleto recto de n carbonos con un grupo en una posición),
 *     esterificar (ácido + alcohol → éster + agua, con las partes de cada uno), coordenadas 2D para dibujar.
 * Cada función que alimenta una predicción devuelve además `errores`: lo que da cada error típico (bloque FO y tabla
 * «Lo que no tiene respaldo» de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md).
 *
 * CONVENCIONES (el informe pide decirlas):
 *   1. Esqueleto saturado: sin anillos (salvo el benceno con un grupo), sin C=C ni C≡C. Las únicas insaturaciones
 *      son las del grupo (C=O, C≡N). Así se cuentan los isómeros de la escena: C3H6O tiene 2 (propanal y propanona;
 *      el prop-2-en-1-ol, el metoxieteno y los anillos quedan fuera).
 *   2. isomeros() cuenta isómeros ESTRUCTURALES MONOFUNCIONALES: un solo grupo funcional (el –COOH y el –COO– cuentan
 *      como uno), sin enlaces O–O, O–N ni N–N y sin estereoisómeros (el butan-2-ol cuenta una vez; la isomería óptica
 *      solo la pide San Marcos). C2H6O = 2, C3H8O = 3, C4H10O = 7, C3H6O = 2, C2H4O2 = 2, C4H8O2 = 6.
 *   3. Localizador delante del sufijo, como en la IUPAC actual (propan-2-ol, butan-2-ona); `antiguo` da la forma
 *      anterior (2-propanol, 2-butanona). El localizador del grupo se omite cuando no hay otra posición posible:
 *      siempre en -al, -oico, -oato, -amida y -nitrilo (el grupo es el C1); en -ol y -amina con 1 o 2 C sin ramas
 *      (metanol, etanol, etanamina); en -ona con 3 o 4 C sin ramas (propanona, butanona). El de una rama se escribe
 *      siempre (2-metilpropan-1-ol), salvo en un éter de 1 o 2 C en la cadena con solo el alcoxi (metoxietano).
 *   4. Cadena principal: la que contiene el grupo (o más grupos del mismo tipo); después, la más larga; después, la de
 *      más ramas. Numeración: el localizador más bajo para el grupo; después, para las ramas; después, orden
 *      alfabético. Ramas con los nombres de academia (isopropil, isobutil, sec-butil, terc-butil).
 *   5. Éteres: la cadena más larga es el alcano; el otro lado es el alcoxi (metoxi, etoxi, propoxi, isopropoxi…).
 *      Ésteres: «(parte del ácido)-oato de (parte del alcohol)-ilo»; el O del puente viene del alcohol.
 *      Aminas: la cadena más larga unida al N da el nombre (…-amina); las otras van con N- (N-metiletanamina). El
 *      nombre común radicofuncional (etilmetilamina, trimetilamina) va en `comun`.
 *   6. Clase de alcohol por cuántos C tiene unidos el C del –OH (1 primario, 2 secundario, 3 terciario); el metanol
 *      (ninguno) se cuenta con los primarios. Clase de amina por cuántos C tiene unidos el N (1, 2 o 3).
 *   7. Puente de hidrógeno entre moléculas: hace falta un H unido a O o a N (en esta escena no hay F) y un O o N que
 *      lo reciba. Con el agua basta tener un O o un N: el agua pone el H.
 *   8. Puntos de ebullición normales en °C, de tabla (CRC Handbook of Chemistry and Physics y NIST Chemistry WebBook,
 *      redondeados a 0,1 °C; el del metoximetano, −24,8 °C, el informe lo redondea a −24). Son datos medidos, no salen
 *      de una fórmula; conviene contrastarlos con la tabla del libro que se use.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorFunciones = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VALENCIA = { C: 4, O: 2, N: 3 };
  const RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
  const MULT = ['', '', 'di', 'tri', 'tetra'];
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const fallo = t => new Error('funciones: ' + t);
  const raiz = n => { if (!RAIZ[n]) throw fallo(`no sé la raíz de ${n} carbonos`); return RAIZ[n]; };

  // ---------- Molécula ----------
  // { at: [{ el, h }], en: [{ a, b, o }] }: átomos pesados (C, O, N) con sus H implícitos; enlaces con su orden.
  function clonar(m) { return { at: m.at.map(x => ({ ...x })), en: m.en.map(x => ({ ...x })) }; }
  function vecinos(m) {
    const v = m.at.map(() => []);
    m.en.forEach((e, k) => { v[e.a].push({ j: e.b, o: e.o, k }); v[e.b].push({ j: e.a, o: e.o, k }); });
    return v;
  }
  function completarH(m) {
    const v = vecinos(m);
    m.at.forEach((a, i) => {
      const s = v[i].reduce((t, x) => t + x.o, 0), val = VALENCIA[a.el];
      if (val === undefined) throw fallo(`elemento «${a.el}» fuera de la escena`);
      const h = val - s;
      if (h < -1e-9) throw fallo(`valencia: el átomo ${i + 1} (${a.el}) tiene ${s} enlaces y su valencia es ${val}`);
      if (Math.abs(h - Math.round(h)) > 1e-9) throw fallo('los enlaces aromáticos no cierran');
      if (a.h !== undefined && a.h !== Math.round(h)) throw fallo(`valencia: el ${a.el}${a.h ? 'H' + (a.h > 1 ? a.h : '') : ''} del lugar ${i + 1} tiene ${s} enlaces con otros átomos; con ${a.h} H suma ${s + a.h}, no ${val}`);
      a.h = Math.round(h);
    });
    const vis = new Set([0]), pila = [0];
    while (pila.length) { const i = pila.pop(); for (const x of v[i]) if (!vis.has(x.j)) { vis.add(x.j); pila.push(x.j); } }
    if (m.at.length && vis.size !== m.at.length) throw fallo('la fórmula tiene piezas sueltas');
    return m;
  }
  function enlazar(m, a, b, o) {
    if (a === b || m.en.some(e => (e.a === a && e.b === b) || (e.a === b && e.b === a))) throw fallo('enlace repetido');
    m.en.push({ a, b, o }); return m.en.length - 1;
  }

  // --- Semidesarrollada ---
  // Unidades: CH3, CH2, CH, C, OH, O, NH2, NH, N, CHO, CO (cetona), COOH, COO (éster), CONH2, CN (nitrilo), HO, H2N,
  // HOOC, CnH2n+1 (rama recta), C6H5 (fenilo); una H delante del C (HCOOH, HCHO, HCOO–) suma un H a ese C.
  function leerSemi(texto) {
    const t = String(texto).replace(/\s+/g, '').replace(/[–—−]/g, '-').replace(/[₀-₉]/g, c => SUB[c]).replace(/#/g, '≡');
    const m = { at: [], en: [] };
    const nuevo = (el, h) => { m.at.push({ el, h }); return m.at.length - 1; };
    const ORDEN = { '-': 1, '=': 2, '≡': 3 };
    function cierre(s, i) { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '(') d++; else if (s[k] === ')') { d--; if (!d) return k; } } throw fallo('falta cerrar un paréntesis'); }
    // Una unidad desde s[i]. Devuelve { ini (recibe el enlace de antes), sal (da el de después), centro (lleva las
    // ramas entre paréntesis), i }.
    function unidad(s, i, primera) {
      let extra = 0, r = s.slice(i), q;
      const fin = (len, u) => ({ ...u, i: i + len });
      if (primera && (q = /^HOOC/.exec(r))) { const o = nuevo('O', 1), c = nuevo('C', 0), o2 = nuevo('O', 0); enlazar(m, o, c, 1); enlazar(m, c, o2, 2); return fin(4, { ini: o, sal: c, centro: c }); }
      if (primera && (q = /^HO(?!O)/.exec(r))) { const o = nuevo('O', 1); return fin(2, { ini: o, sal: o, centro: o }); }
      if (primera && (q = /^H2N/.exec(r))) { const n = nuevo('N', 2); return fin(3, { ini: n, sal: n, centro: n }); }
      if (r[0] === 'H' && r[1] === 'C') { extra = 1; i++; r = s.slice(i); }
      if ((q = /^COOH/.exec(r))) { const c = nuevo('C', extra), o1 = nuevo('O', 0), o2 = nuevo('O', 1); enlazar(m, c, o1, 2); enlazar(m, c, o2, 1); return fin(4, { ini: c, sal: o2, centro: c }); }
      if ((q = /^COO/.exec(r))) { const c = nuevo('C', extra), o1 = nuevo('O', 0), o2 = nuevo('O', 0); enlazar(m, c, o1, 2); enlazar(m, c, o2, 1); return fin(3, { ini: c, sal: o2, centro: c }); }
      if ((q = /^CONH2/.exec(r))) { const c = nuevo('C', extra), o1 = nuevo('O', 0), n = nuevo('N', 2); enlazar(m, c, o1, 2); enlazar(m, c, n, 1); return fin(5, { ini: c, sal: n, centro: c }); }
      if ((q = /^CHO/.exec(r))) { const c = nuevo('C', 1 + extra), o1 = nuevo('O', 0); enlazar(m, c, o1, 2); return fin(3, { ini: c, sal: c, centro: c }); }
      if ((q = /^CN(?!H)/.exec(r))) { const c = nuevo('C', extra), n = nuevo('N', 0); enlazar(m, c, n, 3); return fin(2, { ini: c, sal: n, centro: c }); }
      if ((q = /^CO(?![HO\d])/.exec(r))) { const c = nuevo('C', extra), o1 = nuevo('O', 0); enlazar(m, c, o1, 2); return fin(2, { ini: c, sal: c, centro: c }); }
      if ((q = /^C6H5/.exec(r))) {
        const an = []; for (let k = 0; k < 6; k++) an.push(nuevo('C', k ? 1 : 0));
        for (let k = 0; k < 6; k++) enlazar(m, an[k], an[(k + 1) % 6], 1.5);
        return fin(4, { ini: an[0], sal: an[0], centro: an[0] });
      }
      if ((q = /^C(\d+)H(\d+)/.exec(r))) {
        const n = +q[1], h = +q[2];
        if (n < 2 || h !== 2 * n + 1) throw fallo(`«C${n}H${h}» no es una rama alquilo`);
        const sigue = i + q[0].length < s.length;
        const l = []; for (let k = 0; k < n; k++) { const a = nuevo('C', (sigue ? k === 0 : k === n - 1) ? 3 : 2); if (l.length) enlazar(m, l[l.length - 1], a, 1); l.push(a); }
        return fin(q[0].length, { ini: l[0], sal: l[n - 1], centro: sigue ? l[n - 1] : l[0] });
      }
      if ((q = /^C(?:H(\d*))?/.exec(r))) { const h = (q[0].length > 1 ? (q[1] ? +q[1] : 1) : 0) + extra; const c = nuevo('C', h); return fin(q[0].length, { ini: c, sal: c, centro: c }); }
      if (extra) throw fallo(`no entiendo «${s.slice(i - 1)}»`);
      if ((q = /^OH/.exec(r))) { const o = nuevo('O', 1); return fin(2, { ini: o, sal: o, centro: o }); }
      if ((q = /^O/.exec(r))) { const o = nuevo('O', 0); return fin(1, { ini: o, sal: o, centro: o }); }
      if ((q = /^NH2/.exec(r))) { const n = nuevo('N', 2); return fin(3, { ini: n, sal: n, centro: n }); }
      if ((q = /^NH/.exec(r))) { const n = nuevo('N', 1); return fin(2, { ini: n, sal: n, centro: n }); }
      if ((q = /^N/.exec(r))) { const n = nuevo('N', 0); return fin(1, { ini: n, sal: n, centro: n }); }
      throw fallo(`no entiendo «${s.slice(i) || s}»`);
    }
    function cadena(s) {
      let i = 0;
      const num = () => { let d = ''; while (/\d/.test(s[i] || '')) d += s[i++]; return d ? +d : 1; };
      const colgar = (sub, at) => {
        let o = 1; if (ORDEN[sub[0]]) { o = ORDEN[sub[0]]; sub = sub.slice(1); }
        const r = cadena(sub); enlazar(m, at, r.ini, o);
      };
      const antes = [];
      while (s[i] === '(') { const j = cierre(s, i), sub = s.slice(i + 1, j); i = j + 1; antes.push([sub, num()]); }
      if (i >= s.length) throw fallo(`no entiendo «${s}»`);
      let u = unidad(s, i, true); i = u.i;
      const ini = u.ini; let sal = u.sal;
      for (const [sub, k] of antes) for (let q = 0; q < k; q++) colgar(sub, u.centro);
      while (i < s.length) {
        if (s[i] === '(') {
          const j = cierre(s, i), sub = s.slice(i + 1, j); i = j + 1; const k = num();
          if (sub === 'CH2') { for (let q = 0; q < k; q++) { const a = nuevo('C', 2); enlazar(m, sal, a, 1); sal = a; u = { centro: a }; } }
          else for (let q = 0; q < k; q++) colgar(sub, u.centro);
          continue;
        }
        let o = 1;
        if (ORDEN[s[i]]) { o = ORDEN[s[i]]; i++; }
        u = unidad(s, i, false); i = u.i; enlazar(m, sal, u.ini, o); sal = u.sal;
      }
      return { ini, sal };
    }
    cadena(t);
    return completarH(m);
  }

  // --- SMILES sencillo: C, O, N, c (aromático), =, #, ramas y anillos ---
  function leerSmiles(texto) {
    const s = String(texto).replace(/\s+/g, '');
    const m = { at: [], en: [] }, arom = [];
    let prev = -1, enl = null; const pila = [], anillos = {}; let i = 0;
    const ord = { '-': 1, '=': 2, '#': 3 };
    while (i < s.length) {
      const ch = s[i];
      if (ch === 'C' || ch === 'c' || ch === 'O' || ch === 'N') {
        m.at.push({ el: ch.toUpperCase() }); arom.push(ch === 'c'); const n = m.at.length - 1; i++;
        if (prev >= 0) enlazar(m, prev, n, enl ? ord[enl] : (arom[prev] && arom[n] ? 1.5 : 1));
        prev = n; enl = null; continue;
      }
      if (ch === '(') { pila.push(prev); i++; continue; }
      if (ch === ')') { if (!pila.length) throw fallo('paréntesis de más'); prev = pila.pop(); i++; continue; }
      if (ord[ch]) { enl = ch; i++; continue; }
      if (/\d/.test(ch)) {
        i++;
        if (anillos[ch]) { const r = anillos[ch]; enlazar(m, r.at, prev, enl ? ord[enl] : r.enl ? ord[r.enl] : (arom[r.at] && arom[prev] ? 1.5 : 1)); delete anillos[ch]; }
        else anillos[ch] = { at: prev, enl };
        enl = null; continue;
      }
      throw fallo(`no entiendo «${s.slice(i)}»`);
    }
    if (Object.keys(anillos).length) throw fallo('un anillo sin cerrar');
    completarH(m);
    return normalizar(m);
  }
  // Un anillo de 6 C con dobles alternados (Kekulé) se guarda como benceno (enlaces 1,5).
  function normalizar(m) {
    for (const c of ciclos(m)) {
      if (c.length !== 6 || c.some(i => m.at[i].el !== 'C')) continue;
      const ks = c.map((x, q) => m.en.findIndex(e => (e.a === x && e.b === c[(q + 1) % 6]) || (e.b === x && e.a === c[(q + 1) % 6])));
      const os = ks.map(k => m.en[k].o);
      if (os.every((o, q) => o === (q % 2 ? os[1] : os[0])) && os[0] + os[1] === 3) ks.forEach(k => { m.en[k].o = 1.5; });
    }
    return m;
  }
  function molecula(x) {
    if (x && typeof x === 'object' && Array.isArray(x.at)) return x;
    const s = String(x).trim();
    if (!s) throw fallo('fórmula vacía');
    return /H|≡|[–—]|[₀-₉]/.test(s) ? normalizar(leerSemi(s)) : leerSmiles(s);
  }

  // ---------- Grafo ----------
  function ciclos(m) {
    const v = vecinos(m), vistos = new Set(), out = [], n = m.at.length;
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
  function camino(v, a, b, permitido) {   // en un árbol: el único camino de a a b
    const prev = new Map([[a, -1]]), cola = [a];
    while (cola.length) { const i = cola.shift(); if (i === b) break; for (const x of v[i]) if (permitido(x.j) && !prev.has(x.j)) { prev.set(x.j, i); cola.push(x.j); } }
    if (!prev.has(b)) return null;
    const p = []; for (let i = b; i !== -1; i = prev.get(i)) p.unshift(i);
    return p;
  }
  // Átomos que se alcanzan desde r sin pasar por los de `fuera`, solo por los que cumplen `ok`.
  function alcance(v, r, fuera, ok) {
    const vis = new Set([r]), cola = [r];
    while (cola.length) { const i = cola.shift(); for (const y of v[i]) if (!vis.has(y.j) && !fuera.has(y.j) && ok(y.j)) { vis.add(y.j); cola.push(y.j); } }
    return vis;
  }

  // ---------- Forma canónica ----------
  // Refinamiento de colores (Weisfeiler–Lehman) y, en los empates, se individualiza cada átomo de la clase y se toma
  // la cadena mínima. Las moléculas de la escena son chicas, así que alcanza.
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
    const cadenaDe = col => {
      const orden = col.map((c, i) => [c, i]).sort((a, b) => a[0] - b[0]).map(z => z[1]), pos = []; orden.forEach((i, p) => { pos[i] = p; });
      const at = orden.map(i => m.at[i].el + m.at[i].h + (marcas[i] || '')).join('.');
      const en = m.en.map(e => [Math.min(pos[e.a], pos[e.b]), Math.max(pos[e.a], pos[e.b]), e.o]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(z => z.join('-')).join(',');
      return at + '|' + en;
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
  function mismaMolecula(a, b) { return canonica(a) === canonica(b); }

  // ---------- Fórmula ----------
  function cuenta(m) { const c = { C: 0, H: 0, N: 0, O: 0 }; for (const a of m.at) { c[a.el]++; c.H += a.h; } return c; }
  function textoFormula(c) {
    const orden = c.C ? ['C', 'H', 'N', 'O'] : ['H', 'N', 'O'];
    return orden.filter(e => c[e] > 0).map(e => e + (c[e] > 1 ? c[e] : '')).join('');
  }
  function leerFormula(t) {
    const c = { C: 0, H: 0, N: 0, O: 0 };
    const s = String(t).replace(/[₀-₉]/g, d => SUB[d]).replace(/\s+/g, '');
    if (!/^([CHNO]\d*)+$/.test(s)) throw fallo(`no entiendo la fórmula «${t}»`);
    for (const q of s.matchAll(/([CHNO])(\d*)/g)) c[q[1]] += q[2] ? +q[2] : 1;
    return c;
  }
  function formula(x) { const m = molecula(x), c = cuenta(m); return { ...c, texto: textoFormula(c) }; }

  // ---------- Grupos funcionales ----------
  const PRIORIDAD = ['acido', 'ester', 'amida', 'nitrilo', 'aldehido', 'cetona', 'alcohol', 'fenol', 'amina', 'eter'];
  const FAMILIA = { acido: 'ácido carboxílico', ester: 'éster', amida: 'amida', nitrilo: 'nitrilo', aldehido: 'aldehído', cetona: 'cetona',
    alcohol: 'alcohol', fenol: 'fenol', amina: 'amina', eter: 'éter', hidrocarburo: 'hidrocarburo' };
  const GRUPO = { acido: '–COOH', ester: '–COO–', amida: '–CONH₂', nitrilo: '–C≡N', aldehido: '–CHO', cetona: '–CO–', alcohol: '–OH',
    fenol: '–OH en el anillo', amina: '–NH₂, –NH– o –N<', eter: '–O–', hidrocarburo: 'ninguno' };
  const SUFIJO = { acido: 'ácido …-oico', ester: '-oato de …-ilo', amida: '-amida', nitrilo: '-nitrilo', aldehido: '-al', cetona: '-ona',
    alcohol: '-ol', fenol: 'fenol', amina: '-amina', eter: 'alcoxi- (…-oxi)', hidrocarburo: '-ano' };
  const aromatico = (v, i) => v[i].some(y => y.o === 1.5);
  function grupos(x) {
    const m = molecula(x), v = vecinos(m), usado = new Set(), lista = [];
    const el = i => m.at[i].el;
    m.at.forEach((a, i) => {
      if (a.el !== 'C') return;
      const od = v[i].filter(y => el(y.j) === 'O' && y.o === 2), nt = v[i].filter(y => el(y.j) === 'N' && y.o === 3);
      if (od.length > 1 || (od.length && nt.length)) throw fallo('un carbono con dos grupos: fuera de la escena');
      if (od.length) {
        const o1 = od[0].j, os = v[i].filter(y => el(y.j) === 'O' && y.o === 1).map(y => y.j), ns = v[i].filter(y => el(y.j) === 'N' && y.o === 1).map(y => y.j);
        const nC = v[i].filter(y => el(y.j) === 'C').length;
        const oh = os.find(o => m.at[o].h === 1), ob = os.find(o => m.at[o].h === 0);
        if (os.length + ns.length > 1) throw fallo('un carbono con dos grupos: fuera de la escena');
        let g;
        if (oh !== undefined) g = { tipo: 'acido', carbono: i, atomos: [i, o1, oh], oxigenos: [o1, oh] };
        else if (ob !== undefined) g = { tipo: 'ester', carbono: i, atomos: [i, o1, ob], oxigenos: [o1, ob], puente: ob, alquilo: v[ob].find(y => y.j !== i).j };
        else if (ns.length) g = { tipo: 'amida', carbono: i, atomos: [i, o1, ns[0]], nitrogeno: ns[0], oxigenos: [o1] };
        else g = { tipo: nC <= 1 ? 'aldehido' : 'cetona', carbono: i, atomos: [i, o1], oxigenos: [o1] };
        if (aromatico(v, i)) throw fallo('un C=O en el anillo: fuera de la escena');
        g.atomos.forEach(z => { if (z !== i) usado.add(z); });
        lista.push(g);
      } else if (nt.length) {
        usado.add(nt[0].j); lista.push({ tipo: 'nitrilo', carbono: i, atomos: [i, nt[0].j], nitrogeno: nt[0].j });
      }
    });
    m.at.forEach((a, i) => {
      if (usado.has(i) || a.el === 'C') return;
      if (v[i].some(y => el(y.j) !== 'C')) throw fallo(`un ${a.el} unido a otro O o N: fuera de la escena`);
      if (v[i].some(y => y.o !== 1)) throw fallo(`un ${a.el} con enlace múltiple fuera de un grupo de la escena`);
      const cs = v[i].map(y => y.j);
      if (a.el === 'O') {
        if (cs.length === 1 && a.h === 1) {
          const c = cs[0];
          if (aromatico(v, c)) lista.push({ tipo: 'fenol', carbono: c, atomos: [c, i], oxigeno: i });
          else if (v[c].some(y => y.o > 1)) throw fallo('un –OH en un carbono con doble enlace (enol): fuera de la escena');
          else lista.push({ tipo: 'alcohol', carbono: c, atomos: [c, i], oxigeno: i });
        } else if (cs.length === 2) lista.push({ tipo: 'eter', oxigeno: i, carbonos: cs, atomos: [i] });
        else throw fallo('agua u oxígeno suelto: no es una función orgánica');
      } else {
        if (!cs.length) throw fallo('amoniaco: no es una función orgánica');
        lista.push({ tipo: 'amina', nitrogeno: i, carbonos: cs, atomos: [i], clase: cs.length });
      }
    });
    return lista;
  }
  function funcion(x) {
    const m = molecula(x), g = grupos(m);
    const orden = [...g].sort((a, b) => PRIORIDAD.indexOf(a.tipo) - PRIORIDAD.indexOf(b.tipo));
    const fam = orden.length ? orden[0].tipo : 'hidrocarburo';
    return { familia: fam, nombreFamilia: FAMILIA[fam], grupo: GRUPO[fam], sufijo: SUFIJO[fam], grupos: g, principal: orden[0] || null,
      tipos: [...new Set(orden.map(z => z.tipo))], monofuncional: new Set(g.map(z => z.tipo)).size <= 1,
      errores: { porTenerO: m.at.some(a => a.el === 'O') ? 'alcohol' : null } };
  }
  function prioridad(lista) {
    const l = [...lista].map(t => { if (!PRIORIDAD.includes(t)) throw fallo(`no conozco la familia «${t}»`); return t; });
    l.sort((a, b) => PRIORIDAD.indexOf(a) - PRIORIDAD.indexOf(b));
    return { orden: l, principal: l[0], nombres: l.map(t => FAMILIA[t]) };
  }

  // ---------- Nombres ----------
  const COMUNES_RAMA = { '1-metiletil': 'isopropil', '2-metilpropil': 'isobutil', '1-metilpropil': 'sec-butil', '1,1-dimetiletil': 'terc-butil' };
  const alfa = n => n.replace(/^(sec|terc)-/, '').replace(/^N-/, '').replace(/[()]/g, '');
  function cmp(a, b) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const x = a[i], y = b[i];
      if (x === undefined) return -1; if (y === undefined) return 1;
      if (Array.isArray(x)) { const c = cmp(x, y); if (c) return c; continue; }
      if (x < y) return -1; if (x > y) return 1;
    }
    return 0;
  }
  // Rama alquilo que empieza en r y cuelga de p (solo por los carbonos de `perm`).
  function rama(m, v, r, p, perm) {
    const esC = i => m.at[i].el === 'C' && (!perm || perm.has(i));
    const atomos = [...alcance(v, r, new Set([p]), esC)];
    const enRama = new Set(atomos), dentro = i => enRama.has(i);
    const puntas = atomos.filter(i => i === r || v[i].filter(y => dentro(y.j)).length <= 1);
    let mejor = null;
    for (const q of puntas) {
      const P = camino(v, r, q, dentro); if (!P) continue;
      const subs = ramasDe(m, v, P, enRama);
      const key = [-P.length, -subs.length, subs.map(s => s.loc).sort((a, b) => a - b)];
      if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, P, subs };
    }
    const { P, subs } = mejor;
    let nombre = prefijos(subs).texto + raiz(P.length) + 'il';
    if (COMUNES_RAMA[nombre]) nombre = COMUNES_RAMA[nombre];
    const complejo = subs.length > 0 && !Object.values(COMUNES_RAMA).includes(nombre);
    return { nombre, alfa: alfa(nombre), complejo, atomos, carbonos: atomos.length, cadena: P, recta: !subs.length };
  }
  // Ramas que cuelgan de la cadena P, dentro de `perm` (sin entrar a P).
  function ramasDe(m, v, P, perm) {
    const enP = new Set(P), subs = [];
    P.forEach((a, i) => { for (const y of v[a]) if (!enP.has(y.j) && perm.has(y.j)) subs.push({ ...rama(m, v, y.j, a, perm), loc: i + 1, raiz: y.j, en: a }); });
    return subs;
  }
  // Prefijos agrupados y en orden alfabético: "2,2-dimetil", "N,N-dimetil", "2-metoxi".
  function prefijos(subs, o) {
    o = o || {};
    const g = new Map();
    for (const s of subs) { if (!g.has(s.nombre)) g.set(s.nombre, { nombre: s.nombre, alfa: s.alfa, complejo: s.complejo, tipo: s.tipo, locs: [] }); g.get(s.nombre).locs.push(s.loc); }
    const ordLoc = (a, b) => (typeof a === 'string' ? -1 : typeof b === 'string' ? 1 : a - b);
    const grupos = [...g.values()].map(x => ({ ...x, locs: x.locs.sort(ordLoc) }));
    const conMult = x => (x.locs.length > 1 ? (x.complejo ? ['', '', 'bis', 'tris'][x.locs.length] : MULT[x.locs.length]) : '') + (x.complejo ? `(${x.nombre})` : x.nombre);
    const clave = x => (x.complejo ? alfa(conMult(x)) : x.alfa);
    grupos.sort((a, b) => (clave(a) < clave(b) ? -1 : clave(a) > clave(b) ? 1 : 0));
    const partes = [];
    grupos.forEach((x, i) => {
      if (i) partes.push({ t: '-' });
      if (!o.sinLoc) { partes.push({ t: x.locs.join(','), tipo: 'loc' }); partes.push({ t: '-' }); }
      partes.push({ t: conMult(x), tipo: x.tipo || 'sus' });
    });
    return { texto: partes.map(z => z.t).join(''), partes, grupos, alfaLocs: grupos.flatMap(x => x.locs.filter(l => typeof l === 'number')) };
  }
  const texto = l => l.map(z => z.t).join('');

  // Todas las cadenas (de punta a punta, o desde `extremo`) dentro de `perm`.
  function cadenasEn(v, perm, extremo) {
    const C = [...perm], dentro = i => perm.has(i);
    if (C.length === 1) return [[C[0]]];
    const puntas = C.filter(i => v[i].filter(y => dentro(y.j)).length <= 1);
    const out = [];
    const desde = extremo !== undefined ? [extremo] : puntas;
    for (const a of desde) for (const b of puntas) if (a !== b) out.push(camino(v, a, b, dentro));
    if (extremo !== undefined && !out.length) out.push([extremo]);
    return out;
  }
  // La mejor cadena: con más carbonos del grupo, la más larga, con más ramas; después, localizadores más bajos para el
  // grupo, para todas las ramas y en orden alfabético. `extra(P)` agrega ramas que no son de carbono (alcoxi, N-).
  function mejorCadena(m, v, perm, req, o) {
    o = o || {};
    let mejor = null;
    for (const P of cadenasEn(v, perm, o.extremo)) {
      const subs = [...ramasDe(m, v, P, perm), ...(o.extra ? o.extra(P) : [])];
      const nReq = req.filter(c => P.includes(c)).length;
      const lg = req.map(c => P.indexOf(c) + 1).filter(l => l > 0).sort((a, b) => a - b);
      const ls = subs.map(s => s.loc).filter(l => typeof l === 'number').sort((a, b) => a - b);
      const pref = prefijos(subs);
      const key = [-nReq, -P.length, -subs.length, lg, ls, pref.alfaLocs, pref.texto];
      if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, P, subs, lg };
    }
    return mejor;
  }

  // Nombre a partir de una cadena P ya numerada (P[0] es el C1), para una familia con su sufijo.
  // fam: 'alcano', 'alcohol', 'amina', 'cetona', 'aldehido', 'acido', 'amida', 'nitrilo', 'ester' (parte del ácido).
  const SUF = { alcano: 'ano', alcohol: 'ol', amina: 'amina', cetona: 'ona', aldehido: 'al', acido: 'oico', amida: 'amida', nitrilo: 'nitrilo', ester: 'oato' };
  function porCadena(m, v, P, perm, fam, req, o) {
    o = o || {};
    const subs = [...ramasDe(m, v, P, perm), ...(o.extra ? o.extra(P) : [])];
    const n = P.length, k = req.length, locs = req.map(c => P.indexOf(c) + 1).sort((a, b) => a - b);
    const cSubs = subs.filter(s => typeof s.loc === 'number').length;
    const suf = o.sufijo || SUF[fam];
    let omitir;
    if (['aldehido', 'acido', 'amida', 'nitrilo', 'ester', 'alcano'].includes(o.famLoc || fam)) omitir = true;
    else if (k > 1) omitir = false;
    else if ((o.famLoc || fam) === 'cetona') omitir = n <= 4 && !cSubs;
    else omitir = n <= 2 && !cSubs;
    if (o.conLoc) omitir = false;
    const pref = prefijos(subs, { sinLoc: o.prefSinLoc });
    const partes = [];
    if (fam === 'acido') partes.push({ t: 'ácido ', tipo: 'gf' });
    partes.push(...pref.partes);
    let antiguo = [];
    if (fam === 'alcano') { partes.push({ t: raiz(n) + 'ano', tipo: 'cad' }); antiguo = [...partes]; }
    else {
      const vocal = /^[aeiou]/.test(suf) && k <= 1;
      const base = raiz(n) + 'an' + (vocal ? '' : 'o');
      partes.push({ t: base, tipo: 'cad' });
      if (!omitir) partes.push({ t: '-' }, { t: locs.join(','), tipo: 'loc' }, { t: '-' });
      partes.push({ t: MULT[k > 1 ? k : 0] + suf, tipo: 'gf' });
      // Forma anterior: "2-metil-2-propanol", "1,2-etanodiol".
      if (fam === 'acido') antiguo.push({ t: 'ácido ', tipo: 'gf' });
      antiguo.push(...pref.partes);
      if (!omitir) { if (pref.partes.length) antiguo.push({ t: '-' }); antiguo.push({ t: locs.join(','), tipo: 'loc' }, { t: '-' }); }
      antiguo.push({ t: base, tipo: 'cad' }, { t: MULT[k > 1 ? k : 0] + suf, tipo: 'gf' });
    }
    return { nombre: texto(partes), antiguo: texto(antiguo), partes, cadena: P, subs, locGrupo: locs, omitido: omitir };
  }

  const COMUNES = {
    'metanol': 'alcohol metílico', 'etanol': 'alcohol etílico', 'propan-1-ol': 'alcohol propílico', 'propan-2-ol': 'alcohol isopropílico',
    'butan-1-ol': 'alcohol butílico', 'butan-2-ol': 'alcohol sec-butílico', '2-metilpropan-1-ol': 'alcohol isobutílico', '2-metilpropan-2-ol': 'alcohol terc-butílico',
    'etano-1,2-diol': 'etilenglicol', 'propano-1,2,3-triol': 'glicerina (glicerol)',
    'metanal': 'formaldehído', 'etanal': 'acetaldehído', 'propanal': 'propionaldehído', 'butanal': 'butiraldehído',
    'propanona': 'acetona', 'butanona': 'metiletilcetona',
    'ácido metanoico': 'ácido fórmico', 'ácido etanoico': 'ácido acético', 'ácido propanoico': 'ácido propiónico', 'ácido butanoico': 'ácido butírico',
    'metoximetano': 'éter dimetílico', 'etoxietano': 'éter dietílico (éter etílico)', 'metoxietano': 'etil metil éter',
    'metanoato de metilo': 'formiato de metilo', 'metanoato de etilo': 'formiato de etilo', 'etanoato de metilo': 'acetato de metilo', 'etanoato de etilo': 'acetato de etilo',
    'metanamina': 'metilamina', 'etanamina': 'etilamina', 'N-metilmetanamina': 'dimetilamina', 'N,N-dimetilmetanamina': 'trimetilamina', 'N-metiletanamina': 'etilmetilamina',
    'N-etiletanamina': 'dietilamina', 'propan-1-amina': 'propilamina', 'propan-2-amina': 'isopropilamina', '2-metilpropan-2-amina': 'terc-butilamina',
    'metanamida': 'formamida', 'etanamida': 'acetamida', 'etanonitrilo': 'acetonitrilo', 'propanonitrilo': 'propionitrilo',
    'metoxibenceno': 'anisol', 'fenilmetanol': 'alcohol bencílico', 'bencenamina': 'anilina', 'bencenocarbaldehído': 'benzaldehído',
    'ácido bencenocarboxílico': 'ácido benzoico', 'metilbenceno': 'tolueno'
  };
  const ACIDO_COMUN = { 1: 'formiato', 2: 'acetato', 3: 'propionato', 4: 'butirato' };
  const alcoxi = n => (/^(met|et|prop|but|isoprop|isobut|sec-but|terc-but)il$/.test(n) ? n.replace(/il$/, 'oxi') : n + 'oxi');

  function nombre(x) {
    const m = molecula(x), v = vecinos(m);
    if (!m.at.some(a => a.el === 'C')) { if (m.at.length === 1 && m.at[0].el === 'O') return { nombre: 'agua', antiguo: 'agua', comun: null, partes: [{ t: 'agua' }], familia: null, cadena: [], localizadores: { grupo: [], sustituyentes: [] }, errores: {} }; throw fallo('no hay carbono'); }
    const cs = ciclos(m);
    if (cs.length > 1 || (cs.length === 1 && !(cs[0].length === 6 && cs[0].every((a, q) => v[a].find(y => y.j === cs[0][(q + 1) % 6]).o === 1.5))))
      throw fallo('anillos (salvo el benceno con un grupo): fuera de la escena');
    if (formula(m).C > 8) throw fallo('demasiados carbonos para la escena');
    let r;
    if (cs.length) r = nombreBenceno(m, v, cs[0]);
    else {
      if (m.en.some(e => e.o > 1 && m.at[e.a].el === 'C' && m.at[e.b].el === 'C')) throw fallo('esqueleto con C=C o C≡C: la escena usa esqueletos saturados');
      const g = grupos(m), tipos = [...new Set(g.map(z => z.tipo))];
      if (tipos.length > 1) throw fallo(`polifuncional (${tipos.map(t => FAMILIA[t]).join(' y ')}): la escena nombra compuestos con un solo grupo`);
      const t = tipos[0] || 'alcano';
      if (g.length > 1 && !['alcohol', 'cetona'].includes(t)) throw fallo(`más de un grupo ${FAMILIA[t]}: fuera de la escena`);
      r = NOMBRAR[t](m, v, g);
      r.familia = t === 'alcano' ? 'hidrocarburo' : t;
    }
    r.comun = r.comun !== undefined ? r.comun : (COMUNES[r.nombre] || null);
    r.errores = r.errores || {};
    for (const k of Object.keys(r.errores)) if (r.errores[k] === r.nombre || r.errores[k] === r.antiguo) r.errores[k] = null;
    return r;
  }
  const todosC = m => new Set(m.at.map((a, i) => i).filter(i => m.at[i].el === 'C'));
  function resultado(r, extra) {
    return { nombre: r.nombre, antiguo: r.antiguo, partes: r.partes, cadena: r.cadena,
      localizadores: { grupo: r.locGrupo || [], sustituyentes: (r.subs || []).map(s => s.loc).filter(l => typeof l === 'number').sort((a, b) => a - b) },
      sustituyentes: (r.subs || []).map(s => ({ nombre: s.nombre, loc: s.loc, atomos: s.atomos || [], en: s.en })), ...extra };
  }
  // Los errores de nombre típicos que salen de la misma cadena.
  function erroresSufijo(m, v, P, perm, fam, req, o) {
    const e = {};
    const rev = [...P].reverse();
    const nc = porCadena(m, v, rev, perm, fam, req, { ...o, conLoc: true });
    const bien = porCadena(m, v, P, perm, fam, req, { ...o, conLoc: true });
    e.numeracionContraria = nc.nombre !== bien.nombre ? nc.nombre : null;
    if (fam !== 'alcohol') e.sufijoOl = porCadena(m, v, P, perm, fam, req, { ...o, sufijo: 'ol', famLoc: 'alcohol' }).nombre;
    if (fam !== 'aldehido') e.comoAldehido = porCadena(m, v, P, perm, fam, req, { ...o, sufijo: 'al', famLoc: 'aldehido' }).nombre;
    if (fam !== 'cetona') e.sufijoOna = porCadena(m, v, P, perm, fam, req, { ...o, sufijo: 'ona', famLoc: 'cetona', conLoc: fam === 'alcohol' && !bien.omitido ? true : undefined }).nombre;
    return e;
  }
  const NOMBRAR = {
    alcano(m, v) {
      const perm = todosC(m), b = mejorCadena(m, v, perm, []);
      const r = porCadena(m, v, b.P, perm, 'alcano', []);
      return resultado(r, { errores: {} });
    },
    alcohol(m, v, g) {
      const perm = todosC(m), req = g.map(z => z.carbono);
      if (new Set(req).size !== req.length) throw fallo('dos –OH en el mismo carbono: fuera de la escena');
      const b = mejorCadena(m, v, perm, req);
      const r = porCadena(m, v, b.P, perm, 'alcohol', req);
      return resultado(r, { errores: erroresSufijo(m, v, b.P, perm, 'alcohol', req) });
    },
    cetona(m, v, g) {
      const perm = todosC(m), req = g.map(z => z.carbono);
      const b = mejorCadena(m, v, perm, req);
      const r = porCadena(m, v, b.P, perm, 'cetona', req);
      return resultado(r, { errores: erroresSufijo(m, v, b.P, perm, 'cetona', req) });
    },
    aldehido(m, v, g) { return terminal(m, v, g[0], 'aldehido'); },
    acido(m, v, g) { return terminal(m, v, g[0], 'acido'); },
    nitrilo(m, v, g) { return terminal(m, v, g[0], 'nitrilo'); },
    amida(m, v, g) {
      const n = g[0].nitrogeno, c = g[0].carbono;
      const extra = v[n].filter(y => y.j !== c).map(y => ({ ...rama(m, v, y.j, n), loc: 'N' }));
      const perm = alcance(v, c, new Set([n]), i => m.at[i].el === 'C');
      return terminal(m, v, g[0], 'amida', { perm, extra: () => extra });
    },
    ester(m, v, g) {
      const z = g[0], c = z.carbono, ob = z.puente, ca = z.alquilo;
      const permA = alcance(v, c, new Set([ob]), i => m.at[i].el === 'C');
      const permL = alcance(v, ca, new Set([ob]), i => m.at[i].el === 'C');
      const b = mejorCadena(m, v, permA, [c], { extremo: c });
      const ra = porCadena(m, v, b.P, permA, 'ester', [c]);
      const alq = rama(m, v, ca, ob, permL);
      const acidoT = ra.nombre, alcT = alq.nombre + 'o';
      const partes = [{ t: acidoT, tipo: 'ac' }, { t: ' de ' }, { t: alcT, tipo: 'al' }];
      const nA = permA.size, nL = permL.size, recto = !ra.subs.length && alq.recta;
      const nombreT = `${acidoT} de ${alcT}`;
      const comun = !ra.subs.length && ACIDO_COMUN[nA] ? `${ACIDO_COMUN[nA]} de ${alcT}` : null;
      const errores = {
        partesAlReves: recto && nA !== nL ? `${raiz(nL)}anoato de ${raiz(nA)}ilo` : null,
        comoAcido: `ácido ${raiz(nA + nL)}anoico`,
        eterMasCetona: `${alcoxi(alq.nombre)}${raiz(nA)}anona`,
        ordenIngles: `${alq.nombre} ${acidoT}`,
      };
      const acido = new Set([...permA, ...z.oxigenos.filter(o => o !== ob)]), alcohol = new Set([...permL, ob]);
      return { nombre: nombreT, antiguo: nombreT, partes, cadena: b.P, comun, locGrupo: [1], subs: ra.subs,
        localizadores: { grupo: [1], sustituyentes: ra.subs.map(s => s.loc).sort((p, q) => p - q) }, sustituyentes: [],
        ester: { acido: [...acido].sort((p, q) => p - q), alcohol: [...alcohol].sort((p, q) => p - q), alquilo: alcT, parteAcido: acidoT, carbonosAcido: nA, carbonosAlcohol: nL }, errores };
    },
    amina(m, v, g) {
      if (g.length > 1) throw fallo('más de un N: fuera de la escena');
      const n = g[0].nitrogeno, cs = g[0].carbonos;
      // La cadena principal sale del lado (unido al N) con la mejor cadena; los otros lados van con N-.
      let mejor = null;
      for (const c of cs) {
        const perm = alcance(v, c, new Set([n]), i => m.at[i].el === 'C');
        const otros = cs.filter(z => z !== c).map(z => ({ ...rama(m, v, z, n), loc: 'N' }));
        const b = mejorCadena(m, v, perm, [c], { extra: () => otros });
        const key = [-b.P.length, -perm.size, ...b.key.slice(2)];
        if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, c, perm, otros, b };
      }
      const { c, perm, otros, b } = mejor;
      const o = { extra: () => otros };
      const r = porCadena(m, v, b.P, perm, 'amina', [c], o);
      // Común radicofuncional: los radicos en orden alfabético con di- y tri-, y «amina».
      const radicales = cs.map(z => rama(m, v, z, n).nombre), cuentaR = {};
      radicales.forEach(z => { cuentaR[z] = (cuentaR[z] || 0) + 1; });
      const comun = Object.keys(cuentaR).sort((p, q) => (alfa(p) < alfa(q) ? -1 : 1)).map(z => MULT[cuentaR[z]] + z).join('') + 'amina';
      return resultado(r, { comun, errores: erroresSufijo(m, v, b.P, perm, 'amina', [c], o) });
    },
    eter(m, v, g) {
      const o = g[0].oxigeno, [c1, c2] = g[0].carbonos;
      let mejor = null;
      for (const [c, otro] of [[c1, c2], [c2, c1]]) {
        const perm = alcance(v, c, new Set([o]), i => m.at[i].el === 'C');
        const ax = rama(m, v, otro, o);
        const ext = P => (P.includes(c) ? [{ nombre: alcoxi(ax.nombre), alfa: alfa(alcoxi(ax.nombre)), complejo: false, tipo: 'gf', loc: P.indexOf(c) + 1, atomos: [o, ...ax.atomos] }] : []);
        const b = mejorCadena(m, v, perm, [c], { extra: ext });
        const largo = mejorCadena(m, v, perm, []).P.length;
        if (b.P.length < largo) throw fallo('el O cuelga de una rama corta: fuera de la escena');
        const key = [-b.P.length, -perm.size, ...b.key.slice(3)];
        if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, c, perm, b, ext };
      }
      const { perm, b, ext } = mejor;
      const solo = ramasDe(m, v, b.P, perm).length === 0 && b.P.length <= 2;
      const r = porCadena(m, v, b.P, perm, 'alcano', [], { extra: ext, prefSinLoc: solo });
      const rc = porCadena(m, v, [...b.P].reverse(), perm, 'alcano', [], { extra: ext });
      return resultado(r, { errores: { numeracionContraria: rc.nombre !== porCadena(m, v, b.P, perm, 'alcano', [], { extra: ext }).nombre ? rc.nombre : null } });
    },
  };
  // Grupos que siempre son el C1 (aldehído, ácido, nitrilo, amida).
  function terminal(m, v, z, fam, o) {
    o = o || {};
    const c = z.carbono, perm = o.perm || todosC(m);
    const b = mejorCadena(m, v, perm, [c], { extremo: c, extra: o.extra });
    const r = porCadena(m, v, b.P, perm, fam, [c], { extra: o.extra });
    const e = {};
    if (fam !== 'aldehido') e.comoAldehido = porCadena(m, v, b.P, perm, fam === 'acido' ? 'aldehido' : fam, [c], { extra: o.extra, sufijo: 'al', famLoc: 'aldehido' }).nombre;
    e.sufijoOl = porCadena(m, v, b.P, perm, fam === 'acido' ? 'alcohol' : fam, [c], { extra: o.extra, sufijo: 'ol', famLoc: 'alcohol' }).nombre;
    e.sufijoOna = porCadena(m, v, b.P, perm, fam === 'acido' ? 'cetona' : fam, [c], { extra: o.extra, sufijo: 'ona', famLoc: 'cetona', conLoc: true }).nombre.replace(/^ácido /, '');
    return resultado(r, { errores: e });
  }
  function nombreBenceno(m, v, an) {
    const enA = new Set(an), fuera = [];
    an.forEach(a => { for (const y of v[a]) if (!enA.has(y.j)) fuera.push({ en: a, s: y.j }); });
    const P = (partes, fam, comun) => ({ nombre: texto(partes), antiguo: texto(partes), partes, cadena: an, familia: fam, comun: comun !== undefined ? comun : COMUNES[texto(partes)] || null,
      localizadores: { grupo: [], sustituyentes: [] }, sustituyentes: [], errores: {} });
    if (!fuera.length) return P([{ t: 'benceno', tipo: 'cad' }], 'hidrocarburo');
    if (fuera.length > 1) throw fallo('benceno con más de un grupo: fuera de la escena');
    const s = fuera[0].s, at = m.at[s], vs = v[s].filter(y => y.j !== fuera[0].en);
    if (at.el === 'O' && at.h === 1) return P([{ t: 'fen', tipo: 'cad' }, { t: 'ol', tipo: 'gf' }], 'fenol', null);
    if (at.el === 'O' && vs.length === 1) {
      const ax = rama(m, v, vs[0].j, s);
      if (vs[0].j !== undefined && m.at[vs[0].j].el === 'C' && v[vs[0].j].every(y => y.j === s || m.at[y.j].el === 'C')) return P([{ t: alcoxi(ax.nombre), tipo: 'gf' }, { t: 'benceno', tipo: 'cad' }], 'eter');
    }
    if (at.el === 'N' && at.h === 2) return P([{ t: 'bencen', tipo: 'cad' }, { t: 'amina', tipo: 'gf' }], 'amina');
    if (at.el === 'C' && vs.every(y => m.at[y.j].el !== 'C')) {
      const os = vs.filter(y => m.at[y.j].el === 'O');
      if (!vs.length) return P([{ t: 'metil', tipo: 'sus' }, { t: 'benceno', tipo: 'cad' }], 'hidrocarburo');
      if (os.length === 1 && os[0].o === 1 && m.at[os[0].j].h === 1 && vs.length === 1) return P([{ t: 'fenil', tipo: 'sus' }, { t: 'metan', tipo: 'cad' }, { t: 'ol', tipo: 'gf' }], 'alcohol');
      if (os.length === 1 && os[0].o === 2 && vs.length === 1) return P([{ t: 'benceno', tipo: 'cad' }, { t: 'carbaldehído', tipo: 'gf' }], 'aldehido');
      if (os.length === 2 && vs.length === 2 && os.some(y => y.o === 2) && os.some(y => y.o === 1 && m.at[y.j].h === 1)) return P([{ t: 'ácido ', tipo: 'gf' }, { t: 'benceno', tipo: 'cad' }, { t: 'carboxílico', tipo: 'gf' }], 'acido');
    }
    throw fallo('ese grupo en el benceno está fuera de la escena');
  }

  // ---------- Clases de alcohol y de amina ----------
  const CLASE_O = ['primario', 'primario', 'secundario', 'terciario', 'cuaternario', 'cuaternario'];
  const CLASE_A = ['primaria', 'primaria', 'secundaria', 'terciaria', 'cuaternaria', 'cuaternaria'];
  function tipoAlcohol(x) {
    const m = molecula(x), v = vecinos(m), g = grupos(m).filter(z => z.tipo === 'alcohol');
    if (!g.length) throw fallo('no hay un –OH de alcohol');
    const nom = nombre(m);
    const lista = g.map(z => {
      const vc = v[z.carbono].filter(y => m.at[y.j].el === 'C').map(y => y.j), nC = vc.length, loc = nom.cadena.indexOf(z.carbono) + 1;
      const h = m.at[z.carbono].h;
      return { clase: CLASE_O[nC], carbono: z.carbono, oxigeno: z.oxigeno, carbonosVecinos: vc, nC, loc, nota: nC ? null : 'el metanol no tiene carbonos vecinos: se cuenta con los primarios',
        errores: { porLocalizador: CLASE_O[Math.min(loc, 3)], contandoElO: CLASE_O[nC + 1], porHidrogenos: { 3: 'primario', 2: 'secundario', 1: 'terciario', 0: 'cuaternario' }[h], porNumeroDeOH: CLASE_O[g.length] } };
    });
    return { ...lista[0], lista, nombre: nom.nombre };
  }
  function tipoAmina(x) {
    const m = molecula(x), v = vecinos(m), g = grupos(m).filter(z => z.tipo === 'amina');
    if (!g.length) throw fallo('no hay un N de amina');
    const z = g[0], nC = z.carbonos.length, nom = nombre(m);
    const c = z.carbonos[0], cc = v[c].filter(y => m.at[y.j].el === 'C').length, loc = nom.cadena.indexOf(c) + 1;
    return { clase: CLASE_A[nC], nitrogeno: z.nitrogeno, carbonosVecinos: z.carbonos, nC, nombre: nom.nombre,
      errores: { comoAlcohol: nC === 1 ? CLASE_A[cc] : null, contandoElN: nC === 1 ? CLASE_A[cc + 1] : null, porLocalizador: nC === 1 && loc > 0 ? CLASE_A[Math.min(loc, 3)] : null, porEnlaces: 'terciaria' } };
  }

  // ---------- Puentes de hidrógeno ----------
  function puentes(x) {
    const m = molecula(x);
    const donadores = [], aceptores = [];
    m.at.forEach((a, i) => { if (a.el === 'O' || a.el === 'N') { aceptores.push(i); if (a.h > 0) donadores.push(i); } });
    const entre = donadores.length > 0, agua = aceptores.length > 0;
    let razon;
    if (entre) razon = `tiene un H unido a ${m.at[donadores[0]].el === 'O' ? 'O' : 'N'}: ese H se va hacia el ${m.at[donadores[0]].el === 'O' ? 'O' : 'N'} de una molécula vecina`;
    else if (agua) razon = `no tiene ningún H unido a O o a N: sus H están en carbonos. Su ${m.at[aceptores[0]].el} sí puede recibir el H de una molécula de agua`;
    else razon = 'no tiene O ni N';
    return { entreMoleculas: entre, conAgua: agua, donadores, aceptores, razon,
      errores: { porTenerO: aceptores.length > 0, soloOH: m.at.some(a => a.el === 'O' && a.h > 0) } };
  }

  // ---------- Puntos de ebullición de referencia ----------
  // °C a 1 atm, CRC Handbook y NIST WebBook (redondeados a 0,1 °C).
  const EBULLICION = {
    'metano': -161.5, 'etano': -88.6, 'propano': -42.1, 'butano': -0.5, 'pentano': 36.1, 'hexano': 68.7,
    'metanol': 64.7, 'etanol': 78.3, 'propan-1-ol': 97.2, 'propan-2-ol': 82.3, 'butan-1-ol': 117.7, 'butan-2-ol': 99.5,
    '2-metilpropan-1-ol': 108.0, '2-metilpropan-2-ol': 82.4, 'etano-1,2-diol': 197.3, 'propano-1,2,3-triol': 290.0, 'fenol': 181.8,
    'metoximetano': -24.8, 'metoxietano': 7.4, 'etoxietano': 34.5,
    'metanal': -19.1, 'etanal': 20.1, 'propanal': 48.0, 'butanal': 74.8, 'propanona': 56.1, 'butanona': 79.6, 'pentan-2-ona': 102.3, 'pentan-3-ona': 101.9,
    'ácido metanoico': 101.0, 'ácido etanoico': 117.9, 'ácido propanoico': 141.2, 'ácido butanoico': 163.8,
    'metanoato de metilo': 31.7, 'metanoato de etilo': 54.3, 'etanoato de metilo': 56.9, 'etanoato de etilo': 77.1,
    'propanoato de metilo': 79.8, 'metanoato de propilo': 81.3, '1-metoxipropano': 39.1,
    'metanamina': -6.3, 'etanamina': 16.5, 'N-metilmetanamina': 6.9, 'N,N-dimetilmetanamina': 2.9, 'propan-1-amina': 47.2, 'butan-1-amina': 77.0,
    'metanamida': 210.0, 'etanamida': 221.2, 'propanamida': 213.0, 'butanamida': 216.0,
    'metanonitrilo': 26.0, 'etanonitrilo': 81.6, 'propanonitrilo': 97.2, 'butanonitrilo': 117.6
  };
  function ebullicion(x) {
    const m = molecula(x), n = nombre(m).nombre, teb = EBULLICION[n];
    return { nombre: n, teb: teb === undefined ? null : teb, fuente: teb === undefined ? null : 'tabla (CRC Handbook y NIST)', puentes: puentes(m).entreMoleculas };
  }
  function compararEbullicion(a, b) {
    const A = ebullicion(a), B = ebullicion(b);
    if (A.teb === null || B.teb === null) throw fallo('falta el dato de tabla');
    const mayor = A.teb > B.teb ? A.nombre : B.nombre, menor = A.teb > B.teb ? B.nombre : A.nombre;
    const fa = formula(a).texto, fb = formula(b).texto;
    let razon;
    if (A.puentes !== B.puentes) razon = 'el que tiene un H unido a O o N forma puentes de hidrógeno entre sus moléculas: cuesta más separarlas';
    else razon = 'los dos tienen el mismo tipo de atracción entre moléculas; ahí pesan el tamaño y la polaridad';
    const conO = [A, B].filter((z, k) => molecula(k ? b : a).at.some(t => t.el === 'O' || t.el === 'N'));
    return { mayor, menor, a: A, b: B, diferencia: Math.round(Math.abs(A.teb - B.teb) * 10) / 10, razon, mismaFormula: fa === fb,
      errores: { mismaFormulaIgual: fa === fb ? 'iguales' : null, porTenerO: conO.length === 1 ? conO[0].nombre : null, invertido: menor } };
  }

  // ---------- Isomería ----------
  // Esqueleto de carbonos (solo los C y sus enlaces entre sí) y esqueleto con los O y N de puente (sin los de punta).
  function esqueletoC(m) {
    const idx = [], mapa = {};
    m.at.forEach((a, i) => { if (a.el === 'C') { mapa[i] = idx.length; idx.push(i); } });
    return { at: idx.map(() => ({ el: 'C', h: 0 })), en: m.en.filter(e => mapa[e.a] !== undefined && mapa[e.b] !== undefined).map(e => ({ a: mapa[e.a], b: mapa[e.b], o: 1 })) };
  }
  function esqueletoPuente(m) {
    const v = vecinos(m), idx = [], mapa = {};
    m.at.forEach((a, i) => { if (a.el === 'C' || v[i].length >= 2) { mapa[i] = idx.length; idx.push(i); } });
    return { at: idx.map(() => ({ el: 'X', h: 0 })), en: m.en.filter(e => mapa[e.a] !== undefined && mapa[e.b] !== undefined).map(e => ({ a: mapa[e.a], b: mapa[e.b], o: 1 })) };
  }
  function compararIsomeria(a, b) {
    const A = molecula(a), B = molecula(b), fa = formula(A), fb = formula(B), misma = mismaMolecula(A, B);
    const famA = funcion(A).familia, famB = funcion(B).familia;
    const iso = fa.texto === fb.texto && !misma;
    let tipo = null;
    if (iso) {
      if (famA !== famB) tipo = 'función';
      else if (canonica(esqueletoC(A)) === canonica(esqueletoC(B))) tipo = 'posición';
      else if (canonica(esqueletoPuente(A)) === canonica(esqueletoPuente(B))) tipo = 'posición';
      else tipo = 'cadena';
    }
    // Lo que da cada error: «isómeros solo si son de la misma familia» (FO1), «misma fórmula, misma sustancia» y
    // contar los H del segundo como si hubiera perdido el H del –OH.
    const hHet = A.at.reduce((t, z) => t + (z.el !== 'C' ? z.h : 0), 0);
    return { formulaA: fa.texto, formulaB: fb.texto, mismaFormula: fa.texto === fb.texto, mismaMolecula: misma, isomeros: iso, tipo, familiaA: famA, familiaB: famB,
      errores: { soloMismaFamilia: { isomeros: iso && famA === famB }, mismaSustancia: { mismaMolecula: fa.texto === fb.texto }, pierdeH: hHet ? textoFormula({ ...fa, H: fa.H - 1 }) : null } };
  }
  // Árboles de átomos pesados con la composición pedida (C, O, N), sin enlaces múltiples, uno por forma canónica.
  const ARBOLES = {};
  function arboles(comp) {
    const clave = `${comp.C}-${comp.O}-${comp.N}`;
    if (ARBOLES[clave]) return ARBOLES[clave];
    const total = comp.C + comp.O + comp.N;
    let nivel = [completarH({ at: [{ el: 'C' }], en: [] })];
    for (let k = 1; k < total; k++) {
      const vistos = new Map();
      for (const t of nivel) {
        const c = cuenta(t), v = vecinos(t);
        for (const el of ['C', 'O', 'N']) {
          if (c[el] >= comp[el]) continue;
          t.at.forEach((a, i) => {
            if (v[i].length >= VALENCIA[a.el]) return;
            const q = clonar(t); q.at.forEach(z => { delete z.h; }); q.at.push({ el }); enlazar(q, i, q.at.length - 1, 1); completarH(q);
            const kk = canonica(q); if (!vistos.has(kk)) vistos.set(kk, q);
          });
        }
      }
      nivel = [...vistos.values()];
    }
    return (ARBOLES[clave] = nivel.filter(t => { const c = cuenta(t); return c.C === comp.C && c.O === comp.O && c.N === comp.N; }));
  }
  function isomeros(f) {
    const c = typeof f === 'string' ? leerFormula(f) : f;
    if (c.C < 1 || c.C > 6 || c.O > 2 || c.N > 1) throw fallo('isómeros: de 1 a 6 C, hasta 2 O y 1 N');
    const ins = (2 * c.C + 2 + c.N - c.H) / 2;
    if (ins < 0 || ins !== Math.floor(ins)) throw fallo(`la fórmula ${textoFormula(c)} no existe`);
    if (ins > 2) throw fallo('isómeros: hasta dos insaturaciones (la escena no tiene anillos ni C=C)');
    const vistos = new Map();
    for (const t of arboles(c)) {
      const v = vecinos(t);
      // Insaturaciones solo dentro del grupo: C=O con el O en una punta, C≡N con el N en una punta.
      const ops = [];
      t.en.forEach((e, k) => {
        const [x, y] = [e.a, e.b].map(i => t.at[i].el);
        const punta = i => v[i].length === 1;
        if ((x === 'C' && y === 'O' && punta(e.b)) || (y === 'C' && x === 'O' && punta(e.a))) ops.push({ k, d: 1 });
        if ((x === 'C' && y === 'N' && punta(e.b)) || (y === 'C' && x === 'N' && punta(e.a))) ops.push({ k, d: 2 });
      });
      const combos = [];
      const elegir = (desde, resto, sel) => { if (!resto) { combos.push(sel); return; } for (let i = desde; i < ops.length; i++) if (ops[i].d <= resto) elegir(i + 1, resto - ops[i].d, [...sel, ops[i]]); };
      elegir(0, ins, []);
      for (const s of combos) {
        const q = clonar(t); q.at.forEach(z => { delete z.h; });
        s.forEach(z => { q.en[z.k].o += z.d; });
        try { completarH(q); } catch (e) { continue; }
        const qc = cuenta(q); if (qc.H !== c.H) continue;
        let g; try { g = grupos(q); } catch (e) { continue; }
        if (g.length !== 1) continue;
        const kk = canonica(q); if (!vistos.has(kk)) vistos.set(kk, q);
      }
    }
    const lista = [...vistos.values()].map(q => { const r = nombre(q), fu = funcion(q); return { nombre: r.nombre, comun: r.comun, familia: fu.familia, molecula: q, formula: formula(q).texto }; });
    lista.sort((a, b) => PRIORIDAD.indexOf(a.familia) - PRIORIDAD.indexOf(b.familia) || (a.nombre < b.nombre ? -1 : a.nombre > b.nombre ? 1 : 0));
    return lista;
  }
  // Cuántos isómeros hay, por familia, y lo que da cada error al contarlos.
  function contarIsomeros(f) {
    const c = typeof f === 'string' ? leerFormula(f) : f, l = isomeros(c);
    const porFamilia = {}; l.forEach(z => { porFamilia[z.familia] = (porFamilia[z.familia] || 0) + 1; });
    const errores = {};
    if (c.O === 1 && c.N === 0 && l.every(z => ['alcohol', 'eter'].includes(z.familia))) {
      const esq = arboles({ C: c.C, O: 0, N: 0 }), al = porFamilia.alcohol || 0;
      errores.sinEteres = al;
      errores.eteresPorEnlace = al + esq.length * (c.C - 1);
      errores.porPosiciones = esq.length * (2 * c.C - 1);
    }
    if (porFamilia.aldehido && porFamilia.cetona) { errores.sinCetonas = porFamilia.aldehido; errores.soloCetonas = porFamilia.cetona; }
    if (porFamilia.acido && porFamilia.ester) { errores.sinEsteres = porFamilia.acido; errores.soloEsteres = porFamilia.ester; }
    return { n: l.length, nombres: l.map(z => z.nombre), porFamilia, errores };
  }

  // ---------- La caja de grupos: el mismo esqueleto recto con un grupo en un lugar ----------
  // pos: carbono (1 a n) para OH, CO, NH2; extremo (1 o n) para COOH, CONH2, CN; enlace (1 a n − 1, entre el C pos y
  // el C pos + 1) para O (éter), NH (amina secundaria) y COO (éster, con el C=O en el C pos).
  const CAJA = {
    OH: { texto: '–OH', lugar: 'carbono' }, CO: { texto: 'C=O', lugar: 'carbono' }, COOH: { texto: '–COOH', lugar: 'extremo' },
    COO: { texto: '–COO–', lugar: 'enlace' }, O: { texto: '–O–', lugar: 'enlace' }, NH2: { texto: '–NH₂', lugar: 'carbono' },
    NH: { texto: '–NH–', lugar: 'enlace' }, CONH2: { texto: '–CONH₂', lugar: 'extremo' }, CN: { texto: '–C≡N', lugar: 'extremo' }
  };
  function posiciones(n, g) {
    if (!CAJA[g]) throw fallo(`no hay el grupo «${g}» en la caja`);
    const l = CAJA[g].lugar;
    if (l === 'enlace') return Array.from({ length: Math.max(0, n - 1) }, (_, k) => k + 1);
    if (l === 'extremo') return n === 1 ? [1] : [1, n];
    return Array.from({ length: n }, (_, k) => k + 1);
  }
  function ponerGrupo(n, g, pos) {
    if (!(n >= 1 && n <= 6)) throw fallo('la caja usa esqueletos de 1 a 6 carbonos');
    if (!posiciones(n, g).includes(pos)) throw fallo(`el grupo ${CAJA[g] ? CAJA[g].texto : g} no va en ese lugar`);
    const m = { at: [], en: [] };
    for (let k = 0; k < n; k++) { m.at.push({ el: 'C' }); if (k) enlazar(m, k - 1, k, 1); }
    const nuevo = el => { m.at.push({ el }); return m.at.length - 1; };
    const c = pos - 1;
    const insertar = el => { const k = m.en.findIndex(e => e.a === c && e.b === c + 1); m.en.splice(k, 1); const x = nuevo(el); enlazar(m, c, x, 1); enlazar(m, x, c + 1, 1); return x; };
    if (g === 'OH') enlazar(m, c, nuevo('O'), 1);
    else if (g === 'NH2') enlazar(m, c, nuevo('N'), 1);
    else if (g === 'CO') enlazar(m, c, nuevo('O'), 2);
    else if (g === 'COOH') { enlazar(m, c, nuevo('O'), 2); enlazar(m, c, nuevo('O'), 1); }
    else if (g === 'CONH2') { enlazar(m, c, nuevo('O'), 2); enlazar(m, c, nuevo('N'), 1); }
    else if (g === 'CN') enlazar(m, c, nuevo('N'), 3);
    else if (g === 'O') insertar('O');
    else if (g === 'NH') insertar('N');
    else if (g === 'COO') { insertar('O'); enlazar(m, c, nuevo('O'), 2); }
    completarH(m);
    return resumen(m);
  }
  function resumen(x) {
    const m = molecula(x), r = nombre(m), fu = funcion(m), pu = puentes(m), eb = ebullicion(m);
    return { molecula: m, nombre: r.nombre, antiguo: r.antiguo, comun: r.comun, partes: r.partes, cadena: r.cadena, familia: fu.familia, nombreFamilia: fu.nombreFamilia,
      grupo: fu.grupo, sufijo: fu.sufijo, formula: formula(m).texto, teb: eb.teb, puentes: pu.entreMoleculas, conAgua: pu.conAgua, grupoAtomos: fu.principal ? fu.principal.atomos : [] };
  }

  // ---------- Esterificación: ácido + alcohol → éster + agua ----------
  function esterificar(acido, alcohol) {
    const A = molecula(acido), L = molecula(alcohol);
    const ga = grupos(A), gl = grupos(L);
    if (ga.length !== 1 || ga[0].tipo !== 'acido') throw fallo('el primero tiene que ser un ácido carboxílico');
    if (gl.length !== 1 || gl[0].tipo !== 'alcohol') throw fallo('el segundo tiene que ser un alcohol');
    const ohA = ga[0].oxigenos[1], cA = ga[0].carbono, oL = gl[0].oxigeno;
    // Se copian el ácido sin su –OH y el alcohol entero (su O queda de puente); el agua sale del OH del ácido y del H del alcohol.
    const m = { at: [], en: [] }, mapaA = {}, mapaL = {}, origen = [];
    A.at.forEach((a, i) => { if (i === ohA) return; mapaA[i] = m.at.length; m.at.push({ el: a.el }); origen.push('acido'); });
    L.at.forEach((a, i) => { mapaL[i] = m.at.length; m.at.push({ el: a.el }); origen.push('alcohol'); });
    A.en.forEach(e => { if (e.a !== ohA && e.b !== ohA) enlazar(m, mapaA[e.a], mapaA[e.b], e.o); });
    L.en.forEach(e => enlazar(m, mapaL[e.a], mapaL[e.b], e.o));
    enlazar(m, mapaA[cA], mapaL[oL], 1);
    completarH(m);
    const fa = formula(A), fl = formula(L), suma = { C: fa.C + fl.C, H: fa.H + fl.H, N: fa.N + fl.N, O: fa.O + fl.O };
    const r = nombre(m);
    return { ester: m, nombre: r.nombre, partes: r.partes, formula: formula(m).texto, agua: 'H2O', origen, nombreAcido: nombre(A).nombre, nombreAlcohol: nombre(L).nombre,
      formulaAcido: fa.texto, formulaAlcohol: fl.texto, sumaReactivos: textoFormula(suma), oxigenoPuente: mapaL[oL], sale: { acido: ohA, alcohol: oL },
      errores: { sinQuitarAgua: textoFormula(suma), quitaH2: textoFormula({ ...suma, H: suma.H - 2 }), quitaDosAguas: textoFormula({ ...suma, H: suma.H - 4, O: suma.O - 2 }), partesAlReves: r.errores.partesAlReves } };
  }

  // ---------- Coordenadas (para dibujar) ----------
  // Cadena del dibujo: el camino más largo entre átomos pesados; con empate, el de más C y el de menos dobles (así el
  // =O del grupo queda como rama).
  function cadenaDibujo(m) {
    const v = vecinos(m), n = m.at.length;
    if (n === 1) return [0];
    const puntas = m.at.map((a, i) => i).filter(i => v[i].length <= 1);
    let mejor = null;
    for (const a of puntas) for (const b of puntas) {
      if (a === b) continue;
      const P = camino(v, a, b, () => true);
      const nC = P.filter(i => m.at[i].el === 'C').length;
      let dob = 0; for (let k = 0; k + 1 < P.length; k++) if (v[P[k]].find(y => y.j === P[k + 1]).o === 2) dob++;
      const key = [-P.length, -nC, dob, m.at[P[0]].el === 'C' ? 0 : 1, P.join(',')];
      if (!mejor || cmp(key, mejor.key) < 0) mejor = { key, P };
    }
    return mejor.P;
  }
  const R60 = Math.PI / 3, LCH = 0.64;
  function coordenadas(x, o) {
    o = o || {};
    const m = molecula(x), v = vecinos(m), n = m.at.length, pos = new Array(n);
    const sp = i => v[i].some(y => y.o === 3) || v[i].filter(y => y.o === 2).length >= 2;
    const cs = ciclos(m);
    const prof = (j, de) => { let mx = 0; const vis = new Set([de]); const r = (i, d) => { vis.add(i); mx = Math.max(mx, d); for (const y of v[i]) if (!vis.has(y.j)) r(y.j, d + 1); }; r(j, 1); return mx; };
    const P = cs.length ? null : (o.cadena || cadenaDibujo(m));
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
      [pri, ...otros].forEach((h, k) => {
        const d = dirs[k], p = pos[a];
        pos[h] = { x: p.x + Math.cos(d), y: p.y + Math.sin(d), z: 0 };
        const g = h === pri ? (hijos.length >= 3 || sp(a) ? giro : -giro) : (Math.sin(d - dir) > 0 ? -1 : 1);
        colocar(h, a, d, g);
      });
    };
    if (cs.length) {
      const an = cs[0], k = an.length, R = 1 / (2 * Math.sin(Math.PI / k));
      an.forEach((a, i) => { const t = Math.PI / 2 + 2 * Math.PI * i / k + (k % 2 ? 0 : Math.PI / k); pos[a] = { x: R * Math.cos(t), y: R * Math.sin(t), z: 0 }; });
      const enA = new Set(an);
      an.forEach(a => {
        const d = Math.atan2(pos[a].y, pos[a].x);
        const hijos = v[a].filter(y => !enA.has(y.j)).map(y => y.j);
        const dirs = hijos.length === 2 ? [d + 0.5, d - 0.5] : [d];
        hijos.forEach((h, q) => { pos[h] = { x: pos[a].x + Math.cos(dirs[q]), y: pos[a].y + Math.sin(dirs[q]), z: 0 }; colocar(h, a, dirs[q], -1); });
      });
    } else {
      const r0 = P[0]; pos[r0] = { x: 0, y: 0, z: 0 };
      const h0 = v[r0].map(y => y.j);
      if (h0.length) {
        const d0 = sp(r0) || sp(h0[0]) ? 0 : Math.PI / 6;
        const pri = sigP.get(r0) !== undefined ? sigP.get(r0) : h0[0];
        pos[pri] = { x: Math.cos(d0), y: Math.sin(d0), z: 0 };
        const paso = h0.length === 2 ? 2 * Math.PI / 3 : 2 * Math.PI / h0.length;
        h0.filter(h => h !== pri).forEach((h, k) => { const d = d0 + (k + 1) * paso; pos[h] = { x: Math.cos(d), y: Math.sin(d), z: 0 }; colocar(h, r0, d, -1); });
        colocar(pri, r0, d0, -1);
      }
    }
    const c = { atomos: m.at.map((a, i) => ({ i, el: a.el, x: pos[i].x, y: pos[i].y, z: 0, padre: null })), enlaces: m.en.map(e => ({ ...e })) };
    // Hidrógenos en los huecos más grandes.
    m.at.forEach((a, i) => {
      if (!a.h) return;
      const p = c.atomos[i], ang = v[i].map(y => Math.atan2(c.atomos[y.j].y - p.y, c.atomos[y.j].x - p.x)).sort((s, t) => s - t);
      let dirs = [];
      if (!ang.length) dirs = a.el === 'O' && a.h === 2 ? [-Math.PI / 2 + 0.91, -Math.PI / 2 - 0.91] : [0, Math.PI / 2, Math.PI, -Math.PI / 2].slice(0, a.h);
      else {
        const huecos = ang.map((t, q) => { const sig = q + 1 < ang.length ? ang[q + 1] : ang[0] + 2 * Math.PI; return { ini: t, ancho: sig - t, k: 0 }; });
        for (let q = 0; q < a.h; q++) huecos.sort((s, t) => t.ancho / (t.k + 1) - s.ancho / (s.k + 1))[0].k++;
        for (const hq of huecos) { const pasoH = Math.min(hq.ancho / (hq.k + 1), 1.05), mid = hq.ini + hq.ancho / 2; for (let q = 0; q < hq.k; q++) dirs.push(mid + (q - (hq.k - 1) / 2) * pasoH); }
      }
      dirs.forEach(d => c.atomos.push({ i: c.atomos.length, el: 'H', x: p.x + LCH * Math.cos(d), y: p.y + LCH * Math.sin(d), z: 0, padre: i, ang: d }));
    });
    // Los H se acomodan un poco (hasta ±10°) para no encimarse con otros átomos.
    const otros = h => c.atomos.filter(q => q.i !== h.i && q.i !== h.padre);
    for (let pasada = 0; pasada < 3; pasada++) for (const h of c.atomos) {
      if (h.padre === null) continue;
      const p = c.atomos[h.padre], vec = otros(h);
      const lejos = d => { const x = p.x + LCH * Math.cos(d), y = p.y + LCH * Math.sin(d); return Math.min(...vec.map(q => Math.hypot(q.x - x, q.y - y) - (q.el === 'H' ? 0 : 0.25))); };
      let mejor = h.ang, val = lejos(h.ang);
      for (let dd = -0.175; dd <= 0.1751; dd += 0.0875) { const t = lejos(h.ang + dd) - Math.abs(dd) * 0.05; if (t > val + 1e-9) { val = t; mejor = h.ang + dd; } }
      h.x = p.x + LCH * Math.cos(mejor); h.y = p.y + LCH * Math.sin(mejor);
    }
    c.atomos.forEach(q => { delete q.ang; });
    return c;
  }

  return {
    molecula, formula, grupos, funcion, prioridad, nombre, canonica, mismaMolecula,
    tipoAlcohol, tipoAmina, puentes, ebullicion, compararEbullicion, EBULLICION,
    compararIsomeria, isomeros, contarIsomeros, CAJA, posiciones, ponerGrupo, resumen, esterificar,
    coordenadas, cadenaDibujo, PRIORIDAD, FAMILIA, COMUNES,
    // Para las pruebas
    ciclos: x => ciclos(molecula(x)), leerFormula
  };
});
