/*
 * Motor de «Balance de reacciones: contar átomos».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorBalance) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Qué calcula:
 *   - Los átomos y la carga de una especie: "Ca(OH)2", "CuSO4·5H2O", "MnO4^-", "Cr2O7^2-", "Fe^3+", "e^-".
 *   - Una ecuación ("C3H8 + O2 -> CO2 + H2O"): cuántos átomos de cada elemento hay a cada lado con unos
 *     coeficientes dados, si está balanceada (átomos y carga) y la masa de cada lado.
 *   - El balance por álgebra: el núcleo (espacio nulo) de la matriz elemento × sustancia, con fracciones exactas,
 *     llevado a los menores enteros. Los pasos de tanteo (metales, no metales, H y O al final) salen de ese resultado.
 *   - La clasificación por la forma de la ecuación: adición, descomposición, desplazamiento simple, doble
 *     desplazamiento y combustión; y si es redox.
 *   - Números de oxidación por reglas de academia (F −1; metales alcalinos +1; alcalinotérreos +2; Al +3; H +1;
 *     O −2; halógenos −1; S −2; N −3…; el último elemento se despeja de la carga). Así salen solos el H −1 de los
 *     hidruros y el O −1 de los peróxidos.
 *   - Redox: quién se oxida, quién se reduce, el agente oxidante y el reductor, y los electrones transferidos.
 *   - Ion-electrón: cada semirreacción en medio ácido (H⁺ y H₂O) o básico (OH⁻ y H₂O), el mínimo común múltiplo
 *     de los electrones y la ecuación global, con la suma de coeficientes que pregunta la academia.
 * En `contar`, `diferencia[e]` es derecha menos izquierda: átomos de e en los productos menos en los reactivos.
 * En `errores.unSoloCoeficiente`, `elemento` es el elemento que el alumno arreglaba con ese único coeficiente (ya
 * queda igual a los dos lados); `queda` lista los elementos que siguen desbalanceados.
 * Cada función que alimenta una predicción devuelve además `errores`: lo que da cada error típico (ES9, ES11, ES12
 * y los de la tabla «Lo que no tiene respaldo» de docs/investigacion/estequiometria-ideas-erroneas.md).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorBalance = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = Object.freeze({ H: 1, He: 4, Li: 7, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32,
    Cl: 35.5, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Hg: 200.6, Pb: 207 });

  // ---------- Fracciones exactas (para el álgebra del balance) ----------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => Math.abs(a * b) / mcd(a, b);
  const fr = (n, d) => { if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } const g = mcd(n, d) || 1; return [n / g, d / g]; };
  const sum = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const divi = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  const cero = a => a[0] === 0;

  // ---------- Especies ----------
  // "Fe^3+" → carga +3; "MnO4^-" → −1; "Cr2O7^2-" → −2; "e^-" → electrón (sin átomos).
  function especie(texto) {
    const t = String(texto).replace(/\s/g, '');
    const m = t.match(/^(.*?)(?:\^(\d*)([+-]))?$/);
    const cuerpo = m[1], carga = m[3] ? (m[3] === '+' ? 1 : -1) * (m[2] ? Number(m[2]) : 1) : 0;
    if (cuerpo === 'e') return { formula: t, atomos: {}, carga: carga || -1, electron: true };
    return { formula: t, atomos: atomos(cuerpo), carga, electron: false };
  }
  // "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }; "CuSO4·5H2O" (o con "." o "*") suma el agua de hidratación.
  function atomos(formula) {
    const partes = String(formula).replace(/\s/g, '').replace(/\^.*$/, '').split(/[·.*]/);
    const total = {};
    for (const parte of partes) {
      const m = parte.match(/^(\d+)(.*)$/), veces = m ? Number(m[1]) : 1, f = m ? m[2] : parte;
      let i = 0;
      const grupo = () => {
        const r = {};
        while (i < f.length && f[i] !== ')') {
          let sub;
          if (f[i] === '(') { i++; sub = grupo(); if (f[i] !== ')') throw new Error(`falta ")" en ${formula}`); i++; }
          else {
            const e = f.slice(i).match(/^[A-Z][a-z]?/);
            if (!e) throw new Error(`no entiendo la fórmula ${formula}`);
            if (!(e[0] in MASAS)) throw new Error(`elemento sin masa atómica: ${e[0]}`);
            i += e[0].length; sub = { [e[0]]: 1 };
          }
          const d = f.slice(i).match(/^\d+/); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
          for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
        }
        return r;
      };
      const g = grupo();
      if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
      for (const [el, n] of Object.entries(g)) total[el] = (total[el] || 0) + n * veces;
    }
    if (!Object.keys(total).length) throw new Error(`fórmula vacía: ${formula}`);
    return total;
  }
  const masaMolar = f => { const e = especie(f); return Object.entries(e.atomos).reduce((s, [el, n]) => s + MASAS[el] * n, 0); };
  const esElemento = f => { const e = especie(f); return !e.electron && e.carga === 0 && Object.keys(e.atomos).length === 1; };

  // ---------- Ecuaciones ----------
  // "2H2 + O2 -> 2H2O" (también con "→" o "="). Los términos se separan con " + " (con espacios), porque el
  // signo + de una carga va pegado: "Fe^3+". Un número al inicio de un término es su coeficiente.
  function ecuacion(texto) {
    if (texto && texto.reactivos) return texto;
    const lados = String(texto).split(/\s*(?:->|→|=)\s*/);
    if (lados.length !== 2) throw new Error(`la ecuación necesita una flecha: ${texto}`);
    const lado = s => s.trim().split(/\s+\+\s+/).map(term => {
      const m = term.trim().match(/^(\d+(?:\/\d+)?)\s*(.+)$/);
      // Un número suelto delante de una letra mayúscula, "(" o "e^" es el coeficiente; "2e^-" también.
      if (m && /^[A-Z(]|^e\^/.test(m[2])) { const [a, b] = m[1].split('/').map(Number); return { f: m[2], coef: b ? a / b : a }; }
      return { f: term.trim(), coef: 1 };
    });
    const r = { reactivos: lado(lados[0]), productos: lado(lados[1]) };
    for (const t of [...r.reactivos, ...r.productos]) especie(t.f);   // valida
    return r;
  }
  const especies = ec => [...ec.reactivos, ...ec.productos].map(t => t.f);
  // Orden de los elementos como aparecen en la ecuación (izquierda a derecha).
  function elementos(ec) {
    const s = [];
    for (const f of especies(ec)) for (const e of Object.keys(especie(f).atomos)) if (!s.includes(e)) s.push(e);
    return s;
  }
  const coefsDe = (ec, coefs) => coefs || [...ec.reactivos, ...ec.productos].map(t => t.coef);

  // Cuántos átomos de cada elemento a cada lado, carga de cada lado y si está balanceada.
  function contar(texto, coefs) {
    const ec = ecuacion(texto), c = coefsDe(ec, coefs), nR = ec.reactivos.length, els = elementos(ec);
    if (c.length !== nR + ec.productos.length) throw new Error('hace falta un coeficiente por sustancia');
    const izq = {}, der = {}; for (const e of els) { izq[e] = 0; der[e] = 0; }
    let cargaIzq = 0, cargaDer = 0;
    especies(ec).forEach((f, k) => {
      const s = especie(f), lado = k < nR ? izq : der;
      for (const [e, n] of Object.entries(s.atomos)) lado[e] += c[k] * n;
      if (k < nR) cargaIzq += c[k] * s.carga; else cargaDer += c[k] * s.carga;
    });
    const dif = {}; for (const e of els) dif[e] = der[e] - izq[e];
    const atomosOk = els.every(e => Math.abs(dif[e]) < 1e-9), cargaOk = Math.abs(cargaIzq - cargaDer) < 1e-9;
    const totalIzq = els.reduce((s, e) => s + izq[e], 0), totalDer = els.reduce((s, e) => s + der[e], 0);
    return { elementos: els, izq, der, diferencia: dif, cargaIzq, cargaDer, atomosBalanceados: atomosOk, cargaBalanceada: cargaOk,
      balanceada: atomosOk && cargaOk, totalIzq, totalDer, coefs: c, ...masas(ec, c) };
  }
  // Masa de cada lado (en u, si los coeficientes son moléculas; en g, si son moles): se conserva si está balanceada.
  function masas(texto, coefs) {
    const ec = ecuacion(texto), c = coefsDe(ec, coefs), nR = ec.reactivos.length;
    let mi = 0, md = 0; especies(ec).forEach((f, k) => { const m = c[k] * masaMolar(f); if (k < nR) mi += m; else md += m; });
    return { masaIzq: mi, masaDer: md };
  }
  // Texto de la ecuación con coeficientes (el 1 no se escribe).
  function escribir(texto, coefs, flecha) {
    const ec = ecuacion(texto), c = coefsDe(ec, coefs), nR = ec.reactivos.length;
    const term = (f, k) => (c[k] === 1 ? '' : fmtCoef(c[k])) + f;
    const fs = especies(ec);
    const izq = fs.slice(0, nR).map((f, k) => term(f, k)).filter((_, k) => c[k] !== 0);
    const der = fs.slice(nR).map((f, k) => term(f, k + nR)).filter((_, k) => c[k + nR] !== 0);
    return izq.join(' + ') + (flecha || ' -> ') + der.join(' + ');
  }
  const fmtCoef = x => (Number.isInteger(x) ? String(x) : (() => { for (let d = 2; d <= 12; d++) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return `${Math.round(x * d)}/${d}`; return String(x); })());

  // ---------- Álgebra: espacio nulo con fracciones ----------
  // Filas: un elemento (y la carga, si hay iones); columnas: sustancias. Reactivos con +, productos con −.
  function nulo(M) {
    const filas = M.map(f => f.map(x => fr(x))), n = M[0].length, piv = [];
    let r = 0;
    for (let col = 0; col < n && r < filas.length; col++) {
      let p = r; while (p < filas.length && cero(filas[p][col])) p++;
      if (p === filas.length) continue;
      [filas[r], filas[p]] = [filas[p], filas[r]];
      const pv = filas[r][col]; filas[r] = filas[r].map(x => divi(x, pv));
      for (let i = 0; i < filas.length; i++) if (i !== r && !cero(filas[i][col])) {
        const k = filas[i][col]; filas[i] = filas[i].map((x, j) => sum(x, mul(fr(-k[0], k[1]), filas[r][j])));
      }
      piv.push(col); r++;
    }
    const libres = []; for (let j = 0; j < n; j++) if (!piv.includes(j)) libres.push(j);
    return libres.map(l => {
      const v = Array.from({ length: n }, () => fr(0)); v[l] = fr(1);
      piv.forEach((col, i) => { v[col] = fr(-filas[i][l][0], filas[i][l][1]); });
      return v;
    });
  }
  // Vector de fracciones → menores enteros, con el primer distinto de cero positivo.
  function enteros(v) {
    const L = v.reduce((a, x) => mcm(a, x[1]), 1);
    let w = v.map(x => x[0] * L / x[1]);
    const g = w.reduce((a, x) => mcd(a, x), 0) || 1; w = w.map(x => x / g);
    const s = w.find(x => x !== 0); if (s < 0) w = w.map(x => -x);
    return w.map(x => x + 0);
  }
  function matriz(fs, signos) {
    const els = []; for (const f of fs) for (const e of Object.keys(especie(f).atomos)) if (!els.includes(e)) els.push(e);
    const M = els.map(e => fs.map((f, k) => signos[k] * (especie(f).atomos[e] || 0)));
    if (fs.some(f => especie(f).carga)) M.push(fs.map((f, k) => signos[k] * especie(f).carga));
    return M;
  }

  // Balance por álgebra. Devuelve los menores enteros y lo que da cada error típico.
  function balancear(texto) {
    const ec = ecuacion(texto), fs = especies(ec), nR = ec.reactivos.length;
    const signos = fs.map((_, k) => (k < nR ? 1 : -1));
    const base = nulo(matriz(fs, signos));
    if (base.length !== 1) throw new Error(base.length ? 'la ecuación tiene más de una forma de balancearse' : 'la ecuación no se puede balancear con estas sustancias');
    const coefs = enteros(base[0]);
    if (coefs.some(x => x <= 0)) throw new Error('alguna sustancia está del lado equivocado de la flecha');
    const suma = coefs.reduce((s, x) => s + x, 0);
    const res = { coefs, suma, ecuacion: escribir(ec, coefs), reactivos: coefs.slice(0, nR), productos: coefs.slice(nR),
      fraccional: coefs.map(x => x / coefs[0]), sumaFraccional: suma / coefs[0], pasos: pasosTanteo(ec, coefs) };
    res.errores = erroresBalance(ec, coefs);
    return res;
  }
  // Pasos de tanteo (orden de academia: metales, no metales, H y O al final). Después de cada elemento, toda
  // sustancia que lo contiene ya tiene su coeficiente final; las demás siguen en 1.
  const NO_METALES = ['C', 'N', 'P', 'S', 'Si', 'F', 'Cl', 'Br', 'I'];
  function ordenTanteo(els) {
    const rango = e => (e === 'O' ? 3 : e === 'H' ? 2 : NO_METALES.includes(e) ? 1 : 0);
    return [...els].sort((a, b) => rango(a) - rango(b) || els.indexOf(a) - els.indexOf(b));
  }
  function pasosTanteo(ec, coefs) {
    const fs = especies(ec), hechos = [], pasos = [];
    for (const e of ordenTanteo(elementos(ec))) {
      hechos.push(e);
      const c = fs.map((f, k) => (hechos.some(h => especie(f).atomos[h]) ? coefs[k] : 1));
      pasos.push({ elemento: e, coefs: c });
    }
    return pasos;
  }
  function erroresBalance(ec, coefs) {
    const fs = especies(ec), nR = ec.reactivos.length, uno = fs.map(() => 1), cuenta1 = contar(ec, uno);
    const suma = coefs.reduce((s, x) => s + x, 0);
    // ES11: balancear cambiando un subíndice (con todos los coeficientes en 1). Devuelve las fórmulas inventadas.
    const subindices = [];
    fs.forEach((f, k) => {
      const at = especie(f).atomos;
      for (const e of Object.keys(at)) {
        const falta = (k < nR ? 1 : -1) * cuenta1.diferencia[e];
        const nuevo = at[e] + falta;
        if (falta === 0 || nuevo < 1) continue;
        const f2 = f.replace(new RegExp(`${e}(\\d*)(?![a-z])`), `${e}${nuevo === 1 ? '' : nuevo}`);
        const fs2 = fs.slice(); fs2[k] = f2;
        const ec2 = { reactivos: fs2.slice(0, nR).map(x => ({ f: x, coef: 1 })), productos: fs2.slice(nR).map(x => ({ f: x, coef: 1 })) };
        if (contar(ec2, uno).atomosBalanceados) subindices.push({ formula: f, cambiada: f2, ecuacion: escribir(ec2, uno) });
      }
    });
    // ES12: arreglar un elemento con un solo coeficiente y no volver a contar los demás.
    const unSoloCoeficiente = [];
    for (const e of elementos(ec)) {
      const d = cuenta1.diferencia[e]; if (!d) continue;
      fs.forEach((f, k) => {
        const n = especie(f).atomos[e]; if (!n) return;
        const lado = k < nR ? 1 : -1, c = 1 + lado * d / n;
        if (c < 2 || !Number.isInteger(c)) return;
        const cs = uno.slice(); cs[k] = c;
        const r = contar(ec, cs);
        if (r.diferencia[e] === 0 && !r.atomosBalanceados) unSoloCoeficiente.push({ elemento: e, queda: r.elementos.filter(x => r.diferencia[x] !== 0), coefs: cs, ecuacion: escribir(ec, cs), balanceada: false, suma: cs.reduce((s, x) => s + x, 0) });
      });
    }
    // ES12: balancear sin contar un elemento (por ejemplo, el O al final). Las sustancias que solo tienen ese
    // elemento se quedan con 1.
    const olvida = {};
    for (const e of elementos(ec)) {
      const solo = fs.map(f => { const a = especie(f).atomos; return Object.keys(a).length === 1 && a[e]; });
      const idx = fs.map((_, k) => k).filter(k => !solo[k]);
      if (!idx.length || idx.length === fs.length) continue;
      const sub = idx.map(k => fs[k]), sg = idx.map(k => (k < nR ? 1 : -1));
      const M = matriz(sub, sg).filter((fila, i) => { const els = []; for (const f of sub) for (const x of Object.keys(especie(f).atomos)) if (!els.includes(x)) els.push(x); return els[i] !== e; });
      const b = nulo(M); if (b.length !== 1) continue;
      const w = enteros(b[0]); if (w.some(x => x <= 0)) continue;
      const cs = uno.slice(); idx.forEach((k, i) => { cs[k] = w[i]; });
      if (contar(ec, cs).atomosBalanceados) continue;
      olvida[e] = { coefs: cs, ecuacion: escribir(ec, cs), suma: cs.reduce((s, x) => s + x, 0) };
    }
    const unos = coefs.filter(x => x === 1).length;
    return { subindices, unSoloCoeficiente, olvida, sinContarUnos: suma - unos, doble: 2 * suma, sinBalancear: fs.length };
  }

  // ES8 y ES9: un frasco con partículas que reaccionan. inicial = { H2: 5, O2: 2 } (moléculas de cada reactivo).
  // Reaccionan tantas "vueltas" de la ecuación como permita el que se acaba; el resto sobra.
  function frasco(texto, inicial) {
    const ec = ecuacion(texto), b = balancear(ec), nR = ec.reactivos.length, fs = especies(ec);
    const vueltas = Math.min(...ec.reactivos.map((t, k) => Math.floor((inicial[t.f] || 0) / b.coefs[k])));
    const final = {}, reaccionan = {}, sobrante = {};
    ec.reactivos.forEach((t, k) => { reaccionan[t.f] = vueltas * b.coefs[k]; final[t.f] = (inicial[t.f] || 0) - reaccionan[t.f]; if (final[t.f]) sobrante[t.f] = final[t.f]; });
    ec.productos.forEach((t, k) => { final[t.f] = vueltas * b.coefs[nR + k]; });
    // Los errores, escritos como ecuaciones.
    const cIni = ec.reactivos.map(t => inicial[t.f] || 0), cProd = ec.productos.map((t, k) => vueltas * b.coefs[nR + k]);
    const sobr = Object.keys(sobrante);
    const ecSobr = { reactivos: ec.reactivos.map(t => ({ f: t.f, coef: 1 })), productos: [...ec.productos.map(t => ({ f: t.f, coef: 1 })), ...sobr.map(f => ({ f, coef: 1 }))] };
    const conSobrante = escribir(ecSobr, [...cIni, ...cProd, ...sobr.map(f => sobrante[f])]);
    const conCantidades = escribir(ec, [...cIni, ...cProd]);
    // ES11: una sola "molécula" con todos los átomos del frasco (de 3 X y 8 Y sale X3Y8).
    const todos = {}; ec.reactivos.forEach(t => { for (const [e, n] of Object.entries(especie(t.f).atomos)) todos[e] = (todos[e] || 0) + n * (inicial[t.f] || 0); });
    const junta = Object.entries(todos).map(([e, n]) => e + (n === 1 ? '' : n)).join('');
    const juntaTodo = escribir({ reactivos: ec.reactivos.map(t => ({ f: t.f, coef: 1 })), productos: [{ f: junta, coef: 1 }] }, [...cIni, 1]);
    const masaAntes = ec.reactivos.reduce((s, t) => s + (inicial[t.f] || 0) * masaMolar(t.f), 0);
    const masaDespues = Object.entries(final).reduce((s, [f, n]) => s + n * masaMolar(f), 0);
    return { vueltas, reaccionan, final, sobrante, ecuacion: b.ecuacion, coefs: b.coefs, masaAntes, masaDespues,
      errores: { conSobrante, conCantidades, juntaTodo, formulaJunta: junta,
        conSobranteBalanceada: contar(conSobrante).atomosBalanceados, conCantidadesBalanceada: contar(conCantidades).atomosBalanceados } };
  }

  // Lavoisier con un gas: el reactivo dado (gramos) se acaba y sale un gas. En el frasco cerrado la balanza no cambia;
  // en el abierto marca menos, justo la masa del gas que se fue. Errores: restar el gas también en el cerrado (ES13)
  // y sumar el gas como si "agregara" masa.
  function conservacion(texto, reactivo, gramos, gas, masaInicial) {
    const b = balancear(texto), ec = ecuacion(texto), fs = especies(ec);
    const kR = fs.indexOf(reactivo), kG = fs.indexOf(gas);
    if (kR < 0 || kR >= ec.reactivos.length) throw new Error(`${reactivo} no es un reactivo`);
    if (kG < ec.reactivos.length) throw new Error(`${gas} no es un producto`);
    const moles = gramos / masaMolar(reactivo), molesGas = moles * b.coefs[kG] / b.coefs[kR], masaGas = molesGas * masaMolar(gas);
    return { moles, molesGas, masaGas, cerrado: masaInicial, abierto: masaInicial - masaGas,
      errores: { cerradoPierde: masaInicial - masaGas, abiertoIgual: masaInicial, gana: masaInicial + masaGas } };
  }

  // ---------- Clasificación ----------
  function clasificar(texto) {
    const ec = ecuacion(texto), R = ec.reactivos.map(t => t.f), P = ec.productos.map(t => t.f);
    const tiene = (lista, f) => lista.includes(f);
    const conC = R.some(f => especie(f).atomos.C && f !== 'O2');
    let tipo = 'otra';
    if (tiene(R, 'O2') && tiene(P, 'CO2') && tiene(P, 'H2O') && conC && R.length === 2) tipo = 'combustión';
    else if (P.length === 1 && R.length >= 2) tipo = 'adición';
    else if (R.length === 1 && P.length >= 2) tipo = 'descomposición';
    else if (R.length === 2 && P.length === 2) {
      const el = l => l.filter(esElemento).length;
      if (el(R) === 1 && el(P) === 1) tipo = 'desplazamiento simple';
      else if (el(R) === 0 && el(P) === 0) tipo = 'doble desplazamiento';
    }
    const rx = redox(ec);
    return { tipo, redox: rx.esRedox, reactivos: R.length, productos: P.length };
  }

  // ---------- Números de oxidación ----------
  const ALCALINOS = ['Li', 'Na', 'K'], ALCALINOTERREOS = ['Mg', 'Ca', 'Ba'], HALOGENOS = ['Cl', 'Br', 'I'];
  const PRIORIDAD = ['F', ...ALCALINOS, ...ALCALINOTERREOS, 'Al', 'H', 'O', ...HALOGENOS, 'S', 'N', 'P', 'C'];
  const FIJO = e => (e === 'F' ? -1 : ALCALINOS.includes(e) ? 1 : ALCALINOTERREOS.includes(e) ? 2 : e === 'Al' ? 3 : e === 'H' ? 1 : e === 'O' ? -2
    : HALOGENOS.includes(e) ? -1 : e === 'S' ? -2 : e === 'N' ? -3 : e === 'P' ? -3 : e === 'C' ? -4 : null);
  const OXOANIONES = [['S', 4, 6], ['N', 3, 5], ['C', 3, 4], ['P', 4, 5], ['Cl', 3, 5], ['Cl', 4, 7]];
  // Se fijan los elementos de más prioridad y el último se despeja: carga = Σ n·EO.
  function oxidacion(f) {
    // Hidrato: el agua de hidratación es neutra (H +1, O −2); se calcula la sal sola.
    if (/[·.*]/.test(f)) { const r = oxidacion(String(f).split(/[·.*]/)[0]); for (const [e, v] of [['H', 1], ['O', -2]]) if (!(e in r.porElemento)) r.porElemento[e] = v; return r; }
    const s = especie(f); if (s.electron) throw new Error('el electrón no tiene número de oxidación');
    const els = Object.keys(s.atomos);
    if (els.length === 1) return { porElemento: { [els[0]]: s.carga / s.atomos[els[0]] }, carga: s.carga };
    const rango = e => { const i = PRIORIDAD.indexOf(e); return i < 0 ? 99 : i; };
    const orden = [...els].sort((a, b) => rango(a) - rango(b));
    // Oxoaniones con metal (CuSO₄, Cu(NO₃)₂, ZnCO₃): el no metal toma el valor de su anión y el metal se despeja.
    const fijos = {};
    if (s.atomos.O) for (const [x, k, v] of OXOANIONES) if (s.atomos[x] && s.atomos.O === k * s.atomos[x] && els.some(e => !['O', 'H', x].includes(e) && FIJO(e) === null)) fijos[x] = v;
    orden.sort((a, b) => (b in fijos) - (a in fijos));
    const ultimo = orden.pop(), r = {}; let suma = 0;
    for (const e of orden) { const v = e in fijos ? fijos[e] : FIJO(e); if (v === null) throw new Error(`no sé el número de oxidación de ${e} en ${f}`); r[e] = v; suma += v * s.atomos[e]; }
    r[ultimo] = (s.carga - suma) / s.atomos[ultimo];
    return { porElemento: r, carga: s.carga };
  }

  // ---------- Redox ----------
  // Quién se oxida (sube su número de oxidación), quién se reduce, los agentes y los electrones transferidos
  // en la ecuación balanceada. Errores: el agente oxidante como el que se oxida; las definiciones al revés
  // ("reducir es perder electrones", EC9); y "oxidar es ganar oxígeno" (EC9).
  function redox(texto) {
    const ec = ecuacion(texto), fs = especies(ec).filter(f => !especie(f).electron), nR = ec.reactivos.length;
    const reac = ec.reactivos.map(t => t.f).filter(f => !especie(f).electron), prod = ec.productos.map(t => t.f).filter(f => !especie(f).electron);
    const eo = f => oxidacion(f).porElemento;
    const estados = {};
    for (const e of elementos(ec)) {
      const a = [...new Set(reac.filter(f => especie(f).atomos[e]).map(f => eo(f)[e]))];
      const b = [...new Set(prod.filter(f => especie(f).atomos[e]).map(f => eo(f)[e]))];
      estados[e] = { izq: a, der: b };
    }
    const sube = [], baja = [];
    for (const [e, s] of Object.entries(estados)) {
      if (s.der.some(x => s.izq.some(y => x > y + 1e-9))) sube.push(e);
      if (s.der.some(x => s.izq.some(y => x < y - 1e-9))) baja.push(e);
    }
    const esRedox = sube.length > 0 && baja.length > 0;
    // Agentes: el reactivo que trae el elemento que cambia (el de número de oxidación distinto al del producto).
    const cambiaEn = (e, haciaArriba) => reac.filter(f => { const x = especie(f).atomos[e]; if (!x) return false; const v = eo(f)[e];
      return estados[e].der.some(w => (haciaArriba ? w > v + 1e-9 : w < v - 1e-9)); });
    const reductor = esRedox ? [...new Set(sube.flatMap(e => cambiaEn(e, true)))] : [];
    const oxidante = esRedox ? [...new Set(baja.flatMap(e => cambiaEn(e, false)))] : [];
    // Electrones: con la ecuación balanceada, Σ coef·átomos·(subida) de lo que se oxida.
    let electrones = null, porUnidad = {};
    if (esRedox) {
      let b; try { b = balancear(ec); } catch (err) { b = null; }
      const c = b ? b.coefs : null; electrones = 0;
      for (const e of sube) for (const f of cambiaEn(e, true)) {
        const k = especies(ec).indexOf(f), v = eo(f)[e], fin = Math.max(...estados[e].der);
        porUnidad[f] = (porUnidad[f] || 0) + especie(f).atomos[e] * (fin - v);
        if (c) electrones += c[k] * especie(f).atomos[e] * (fin - v);
      }
      for (const e of baja) for (const f of cambiaEn(e, false)) {
        const v = eo(f)[e], fin = Math.min(...estados[e].der);
        porUnidad[f] = (porUnidad[f] || 0) + especie(f).atomos[e] * (v - fin);
      }
      if (!c) electrones = null;
    }
    return { esRedox, estados, seOxida: sube, seReduce: baja, agenteReductor: reductor, agenteOxidante: oxidante, electrones, electronesPorUnidad: porUnidad,
      errores: { oxidanteEsElQueSeOxida: reductor, alReves: { seOxida: baja, agenteOxidante: reductor }, sinOxigeno: !fs.some(f => especie(f).atomos.O) } };
  }

  // ---------- Ion-electrón ----------
  // Una semirreacción A → B en medio 'acido' (con H⁺ y H₂O) o 'basico' (con OH⁻ y H₂O). Se resuelve por álgebra:
  // A, B, H₂O, H⁺ (u OH⁻) y e⁻ con coeficientes con signo; el signo dice de qué lado va cada uno.
  function semirreaccion(A, B, medio) {
    if (!['acido', 'basico'].includes(medio)) throw new Error("el medio es 'acido' o 'basico'");
    const ion = medio === 'acido' ? 'H^+' : 'OH^-';
    const fs = [A, B, 'H2O', ion, 'e^-'];
    const base = nulo(matriz(fs, [1, 1, 1, 1, 1]));
    if (base.length !== 1) throw new Error(`no puedo balancear ${A} → ${B} por ion-electrón`);
    let v = enteros(base[0]);           // primer coeficiente (A) positivo: A a la izquierda
    if (!(v[1] < 0)) throw new Error(`${B} no queda del lado de los productos`);
    const izq = [], der = [], mapa = {};
    fs.forEach((f, k) => { if (v[k] > 0) izq.push([v[k], f]); else if (v[k] < 0) der.push([-v[k], f]); mapa[f] = v[k]; });
    const e = Math.abs(v[4]), ladoE = v[4] > 0 ? 'izq' : v[4] < 0 ? 'der' : null;
    const carga = lista => lista.reduce((s, [c, f]) => s + c * especie(f).carga, 0);
    const sinE = l => l.filter(([, f]) => f !== 'e^-');
    // Elemento que cambia: el que no es H ni O (o el que esté, si no hay otro).
    const central = Object.keys(especie(A).atomos).find(x => x !== 'O' && x !== 'H') || Object.keys(especie(A).atomos)[0];
    const eoA = oxidacion(A).porElemento[central], eoB = oxidacion(B).porElemento[central];
    const r = { A, B, medio, izq, der, mapa, electrones: e, ladoElectrones: ladoE, tipo: eoB < eoA ? 'reducción' : 'oxidación',
      central, eoA, eoB, electronesPorAtomo: Math.abs(eoA - eoB), cargaIzq: carga(izq), cargaDer: carga(der),
      cargaIzqSinE: carga(sinE(izq)), cargaDerSinE: carga(sinE(der)), texto: textoTerminos(izq, der) };
    // Errores (tabla «Lo que no tiene respaldo»): electrones del lado equivocado; igualar átomos sin igualar cargas;
    // usar H⁺ en medio básico; contar los electrones con el número de oxidación sin restar; o con la carga del ion
    // sin agregar H⁺ (o OH⁻).
    const otro = ladoE === 'izq' ? 'der' : 'izq';
    const alReves = { izq: ladoE === 'izq' ? sinE(izq) : [...izq, [e, 'e^-']], der: ladoE === 'der' ? sinE(der) : [...der, [e, 'e^-']] };
    r.errores = {
      electronesAlReves: { lado: otro, texto: textoTerminos(alReves.izq, alReves.der), cargaIzq: carga(alReves.izq), cargaDer: carga(alReves.der) },
      sinElectrones: { texto: textoTerminos(sinE(izq), sinE(der)), cargaIzq: carga(sinE(izq)), cargaDer: carga(sinE(der)) },
      numeroOxidacion: Math.abs(eoA),
      cargaDelIon: Math.abs(especie(A).carga - especie(B).carga * (especie(A).atomos[central] / especie(B).atomos[central])),
      conH: medio === 'basico' ? semirreaccion(A, B, 'acido').texto : null,
    };
    return r;
  }
  function textoTerminos(izq, der) {
    const t = l => l.map(([c, f]) => (c === 1 ? '' : c) + f).join(' + ');
    return `${t(izq)} -> ${t(der)}`;
  }
  // Ecuación global: cada semirreacción por el factor que iguala los electrones, sumadas; lo que se repite a los
  // dos lados (H₂O, H⁺, OH⁻, e⁻) se cancela solo, porque cada término lleva su signo.
  function ionElectron(oxid, red, medio) {
    const o = semirreaccion(oxid[0], oxid[1], medio), r = semirreaccion(red[0], red[1], medio);
    if (o.tipo !== 'oxidación' || r.tipo !== 'reducción') throw new Error('la primera semirreacción debe ser la oxidación y la segunda, la reducción');
    const L = mcm(o.electrones, r.electrones), fo = L / o.electrones, frd = L / r.electrones;
    const sumar = (a, ka, b, kb) => { const m = {}; for (const [f, c] of Object.entries(a.mapa)) m[f] = (m[f] || 0) + ka * c; for (const [f, c] of Object.entries(b.mapa)) m[f] = (m[f] || 0) + kb * c; return m; };
    const global = sumar(o, fo, r, frd);
    if (global['e^-']) throw new Error('los electrones no se cancelaron');
    // Orden de academia: el oxidante y el reductor primero; H⁺, OH⁻ y H₂O al final de cada lado.
    const ordI = [red[0], oxid[0], 'H^+', 'OH^-', 'H2O', 'e^-'], ordD = [red[1], oxid[1], 'H2O', 'OH^-', 'H^+', 'e^-'];
    const desde = (m, sinE) => {
      const izq = [], der = [];
      for (const f of ordI) { const c = m[f]; if (c > 0 && !(sinE && f === 'e^-')) izq.push([c, f]); }
      for (const f of ordD) { const c = m[f]; if (c < 0 && !(sinE && f === 'e^-')) der.push([-c, f]); }
      return { izq, der, suma: [...izq, ...der].reduce((s, [c]) => s + c, 0), texto: textoTerminos(izq, der) };
    };
    const g = desde(global);
    const coef = f => global[f] ? Math.abs(global[f]) : 0;
    // Errores: sumar sin igualar los electrones (y borrarlos); contar los electrones por átomo y no por especie
    // (en Cr₂O₇²⁻, 3 en vez de 6); no contar los coeficientes 1 en la suma.
    const sinIgualar = desde(sumar(o, 1, r, 1), true);
    const kAt = r.electronesPorAtomo / o.electrones;
    const porAtomo = desde(sumar(o, kAt, r, 1), true);
    const unos = [...g.izq, ...g.der].filter(([c]) => c === 1).length;
    return { oxidacion: o, reduccion: r, factores: [fo, frd], electrones: L, izq: g.izq, der: g.der, texto: g.texto, suma: g.suma, coef,
      agenteOxidante: red[0], agenteReductor: oxid[0], ecuacionBalanceada: contar(g.texto).balanceada,
      errores: { sinIgualar: { texto: sinIgualar.texto, suma: sinIgualar.suma }, porAtomo: { texto: porAtomo.texto, suma: porAtomo.suma }, sinContarUnos: g.suma - unos } };
  }

  return { MASAS, especie, atomos, masaMolar, esElemento, ecuacion, elementos, contar, masas, escribir, balancear, ordenTanteo,
    frasco, conservacion, clasificar, oxidacion, redox, semirreaccion, ionElectron, mcd, mcm };
});
