/*
 * Generador: «Ponle nombre: moléculas con varios grupos» (nomenclatura IUPAC de compuestos orgánicos con varios
 * grupos funcionales, clase de amina, origen de un éster y secuencia de oxidación de un carbono).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['nombre-polifuncional'])
 * y en Node (require). No usa ningún motor: la química vive aquí, en código determinístico (regla 1).
 *
 * LA MOLÉCULA EN PANTALLA. Se muestra como fórmula semidesarrollada en una línea (_datos.semi, en ASCII; en pantalla
 * los dígitos van en subíndice y «-» se dibuja «–»). Reglas de escritura:
 *   - Unidades separadas por el enlace entre ellas: «-» simple, «=» doble, «≡» triple.
 *   - Unidades de carbono: CH3, CH2, CH, C con sus H; extremos especiales HOOC/COOH (carboxilo), OHC/CHO (aldehído),
 *     HOCH2/CH2OH, H2NCH2/CH2NH2; CO es un C=O entre dos carbonos (cetona); COO / OOC es el grupo éster leído en ese
 *     sentido (C=O unido al carbono de antes y O unido al de después, o al revés) y HCOO el del ácido metanoico.
 *   - Lo que cuelga de un carbono va entre paréntesis detrás de él: CH(OH), C(OH)(COOH), CH(NH2), CH(CH3),
 *     CH(CH2-CH3), N(CH3); «(CH3)2CH-», «(CH3)3C-» y «-CH(CH3)2», «-C(CH3)3» son ramas repetidas.
 *   - C6H5 es un fenilo (anillo de benceno con un enlace). C6H4 es un anillo con dos enlaces en posiciones opuestas
 *     (para, 1 y 4): «-CH2-C6H4-OH» es el 4-hidroxifenilo. HO, OH, H2N y NH2 sueltos son los grupos -OH y -NH2.
 *   - Anillo de un ácido aromático: «C(COOH)=CH-C(OH)=CH-CH=CH-» con la nota de que los seis C se escriben en orden, dando la vuelta, y el último se une al primero
 *     (estructura de Kekulé; se recorre el anillo en un sentido elegido al azar).
 * _datos.smiles trae la misma molécula en SMILES (para comprobarla con OPSIN o RDKit).
 *
 * NOMBRES (IUPAC 2013 en su versión escolar, escritos en español):
 *   1. Grupo principal (da el sufijo), por prioridad: ácido carboxílico > aldehído > cetona > alcohol > amina. Los demás
 *      grupos van como prefijos: oxo (=O, también el C=O de extremo si no es el principal), hidroxi (-OH), amino
 *      (-NH2), carboxi (-COOH cuyo carbono no entra a la cadena); ramas metil, etil, fenil, (4-hidroxifenil). Los
 *      enlaces C=C y C≡C nunca son grupo principal: van en el tallo (-en-, -in-).
 *   2. Cadena principal: la que tiene más grupos principales; después, la más larga; después, la de más enlaces
 *      múltiples; después, la de más prefijos. En todas las moléculas de aquí la cadena más larga ya lleva todos los
 *      enlaces múltiples, así que la regla de 1993 (enlaces múltiples antes que el largo) da el mismo nombre.
 *      Excepción de los ácidos: con TRES -COOH en una cadena abierta, sus carbonos NO entran a la cadena y el sufijo es
 *      «-1,2,3-tricarboxílico» con los localizadores de los carbonos que los llevan (ácido …propano-1,2,3-
 *      tricarboxílico). Con uno o dos -COOH en los extremos, sus carbonos son C1 (y Cn) de la cadena: -oico, -dioico.
 *      En los aminoácidos el anillo (fenil) es rama: la cadena es la que lleva el -COOH.
 *   3. Numeración: el número más bajo al grupo principal; si empata, a todos los enlaces múltiples juntos; si empata, a
 *      los dobles; si empata, a todos los prefijos juntos (como conjunto de localizadores, comparados de menor a mayor
 *      en el primer punto de diferencia); si empata, al prefijo que se escribe primero (orden alfabético).
 *   4. Escritura: prefijos en orden alfabético ESPAÑOL sin contar di-, tri- (amino < carboxi < etil < fenil < hidroxi <
 *      (4-hidroxifenil) < metil < oxo), cada uno con sus localizadores («3-hidroxi-4-metil», «2,3-dihidroxi»). Esto
 *      difiere del inglés (hydroxy < methyl < phenyl): «3-fenil-2-hidroxi…» en español, «2-hydroxy-3-phenyl…» en inglés.
 *      Tallo: raíz (met, et, prop, but, pent, hex, hept, oct) + «an», o los enlaces múltiples con su localizador (el
 *      número más bajo de sus dos carbonos): «-2-en», «-4-in», «-2-en-4-in», «a-2,4-dien» (se agrega «a» a la raíz
 *      cuando sigue un multiplicador: hexa-2,4-dien…). La «o» final del tallo (-ano, -eno, -ino) se escribe delante de
 *      una consonante (butanodioico, hex-2-eno-1,6-diol, propano-1,2,3-tricarboxílico) y se pierde delante de una
 *      vocal (butanoico, pent-4-en-2-ol, hexan-2-ona). Sufijos: «ácido …oico», «ácido …dioico», «ácido …-l,m,n-
 *      tricarboxílico», «-al», «-dial», «-k-ona», «-k-ol», «-k,l-diol», «-tetrol», «-pentol», «-k-amina». El
 *      localizador va delante del sufijo (pentan-2-ona). No se escribe el localizador del -oico ni del -al (siempre
 *      es el C1, o C1 y Cn); los demás se escriben siempre, salvo en los alcoholes sueltos de 1 o 2 C (metanol, etanol)
 *      que aparecen como alcohol de origen de un éster o en la secuencia de oxidación.
 *   5. Ácido aromático: el C del -COOH es el C1 del anillo; se recorre en el sentido que da los localizadores más bajos
 *      a los sustituyentes y, si empata, el más bajo al primero en orden alfabético: «ácido 5-hidroxi-2-metilbenzoico»
 *      (nombre retenido «benzoico», como en la IUPAC 2013 y en la academia; «bencenocarboxílico» no aparece).
 *   Lo que se evita a propósito: anillos (salvo el benceno), estereoquímica (cis/trans, R/S, D/L), varios grupos en
 *   competencia de cadenas iguales. Las moléculas reales que salen en los exámenes sí salen (regla 5, decisión de
 *   Gerson del 12 nov 2026): el ácido cítrico y el isocítrico (ácido 2- y 1-hidroxipropano-1,2,3-tricarboxílico), la
 *   fenilalanina y la tirosina (ácido 2-amino-3-fenil- y 2-amino-3-(4-hidroxifenil)propanoico), la glucosa, la ribosa y
 *   la fructosa de cadena abierta (2,3,4,5,6-pentahidroxihexanal, 2,3,4,5-tetrahidroxipentanal, 1,3,4,5,6-
 *   pentahidroxihexan-2-ona), el ácido salicílico (ácido 2-hidroxibenzoico), la secuencia del etano (etano-1,2-diol,
 *   etanodial, ácido etanodioico) y otros aminoácidos y ácidos conocidos (serina, ácido aspártico, gliceraldehído…).
 *
 * TIPOS de problema (_datos.tipo) y clave de la respuesta (respuesta.valor):
 *   nombre     «¿cuál es el nombre IUPAC?». Familias (_datos.familia): acidoSec (hidroxiácido u oxoácido, con rama
 *              metil o etil y quizá un doble enlace), diacido (ácido -dioico con hidroxi, oxo o amino), tricarboxilico
 *              (cadena de 4 a 6 C con tres -COOH y un -OH), diolEnIno (diol con 1 o 2 dobles y un triple), bifuncional
 *              (hidroxicetona, oxoaldehído, hidroxialdehído, aminoalcohol), azucar (aldosa o cetosa abierta de 3 a 6
 *              C, quizá desoxi: polihidroxialdehído o polihidroxicetona), aminoacido (ácido 2- o 3-amino… con fenil,
 *              4-hidroxifenil, metil o hidroxi), aromatico (ácido benzoico con 1 o 2 de -OH, -NH2, -CH3).
 *              _datos.dibujo = 'rama' cuando la línea escrita no es la cadena principal (un -CH2-CH3 colgado que en
 *              realidad la alarga). Clave 'nom:<nombre>'.
 *   cadena     «¿cuántos C tiene la cadena principal?» (para el tricarboxílico, sin los C de los -COOH). Clave numérica.
 *   sufijo     «¿qué grupo da el sufijo del nombre?». Clave 'suf:<acido|aldehido|cetona|alcohol|amina>'.
 *   amina      «¿qué clase de amina es?»: primaria, secundaria o terciaria según cuántos carbonos tiene unidos el N
 *              (no según el carbono que lleva el N). Clave 'am:<primaria|secundaria|terciaria>' ('am:amida' es un error).
 *   ester      «¿de qué ácido y qué alcohol sale el éster?» R-COO-R′: el ácido lleva el C=O (y sus C), el alcohol el
 *              grupo unido al O del puente. Clave 'es:<ácido>|<alcohol>'.
 *   oxidacion  la secuencia alcano → alcohol → aldehído → ácido sobre el C de un extremo (sub 'terminal', cadenas de 1
 *              a 4 C) o sobre los dos C de los extremos del etano o del propano a la vez (sub 'dos', → diol → dial → diácido).
 *              _datos.paso: 'estado' (número de oxidación e hibridación del C que se oxida en el compuesto _datos.j,
 *              1 = alcohol, 2 = aldehído, 3 = ácido; clave 'eo:<n>:<sp3|sp2|sp>'), 'cambio' (en qué paso deja de ser
 *              sp³; clave 'hib:<j>', con j el compuesto en que ya es sp²: 2), 'serie' (los cuatro números de
 *              oxidación; clave 'serie:a,b,c,d').
 *              Número de oxidación de un C: +1 por cada enlace a O (C=O cuenta +2), −1 por cada H, 0 por cada C.
 *              Hibridación: sp³ con cuatro enlaces simples, sp² con un doble, sp con un triple.
 *
 * Errores: HC3, FO3 y FO4 (docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md; HC3 y FO4
 * «parcial» solo donde el informe describe ese error, sin cifra) y códigos AQ-… (admisión química, hipótesis; mapa de
 * trampas en docs/clasificacion/trampas-admision-unmsm/quimica.md, trampa #36). Colores (regla 4): carboxilo 'h',
 * hidroxilo 'i', carbonilo 'o' (también el CO del éster), amino 'd', en la fórmula del enunciado, en la solución y en
 * los trozos del nombre de la última línea (ácido/-oico/carboxi 'h', hidroxi/-ol 'i', oxo/-al/-ona 'o', amino/-amina
 * 'd'). En la clase de amina, el N (NH2, NH, N) es la variable «nitrógeno de la amina», 'd'. En la oxidación, la única
 * variable es «el carbono que se oxida», 'd'. Las opciones son texto sin color.
 * Fin de la cabecera: con estas reglas y _datos.semi (o _datos.smiles) se recalcula cada respuesta.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'nombre-polifuncional';
  const F_INF = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const F_QA = 'docs/clasificacion/trampas-admision-unmsm/quimica.md';
  const v = P.v;
  const RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
  const MULT = ['', '', 'di', 'tri', 'tetra', 'penta', 'hexa'];
  const PRIORIDAD = ['acido', 'aldehido', 'cetona', 'alcohol', 'amina'];
  const PREFIJO = { aldehido: 'oxo', cetona: 'oxo', alcohol: 'hidroxi', amina: 'amino', carboxi: 'carboxi',
    Me: 'metil', Et: 'etil', Ph: 'fenil', PhOH: '(4-hidroxifenil)' };
  const VARIABLES = { cooh: { nombre: 'carboxilo', color: 'h' }, oh: { nombre: 'hidroxilo', color: 'i' },
    co: { nombre: 'carbonilo', color: 'o' }, nh2: { nombre: 'amino', color: 'd' } };
  const H = (id, explicacion) => ({ id, explicacion, respaldo: 'hipotesis', fuente: F_QA });
  const INF = (id, explicacion, respaldo = 'hipotesis') => ({ id, explicacion, respaldo, fuente: F_INF });

  // ---------- Orden alfabético español (sin multiplicadores, paréntesis ni números) ----------
  const claveAlfa = s => s.replace(/[^\p{L}]/gu, '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const alf = (a, b) => (claveAlfa(a) < claveAlfa(b) ? -1 : claveAlfa(a) > claveAlfa(b) ? 1 : 0);
  const ord = a => a.slice().sort((x, y) => x - y);

  // ---------- Plan de una cadena: carbonos 1..n, enlace enl[i] entre i e i+1, grupos g[i] ----------
  // Grupos: 'OH', 'O' (=O), 'N' (-NH2), 'COOH' (carboxilo con su C fuera de la cadena), 'Me', 'Et', 'Ph', 'PhOH'.
  // Un C de extremo con 'O' y 'OH' es un -COOH cuyo C está en la cadena (-oico).
  function plan(n, carboxilico = false) {
    return { n, enl: Array(n + 1).fill(1), g: Array.from({ length: n + 1 }, () => []), carboxilico };
  }
  const copiar = p => ({ n: p.n, enl: p.enl.slice(), g: p.g.map(x => x.slice()), carboxilico: p.carboxilico, principal: p.principal });
  const extremo = (p, i) => i === 1 || i === p.n;
  const enlacesC = (p, i) => (i > 1 ? p.enl[i - 1] : 0) + (i < p.n ? p.enl[i] : 0);
  const hDe = (p, i) => 4 - enlacesC(p, i) - p.g[i].reduce((s, x) => s + (x === 'O' ? 2 : 1), 0);
  const enMultiple = (p, i) => (i > 1 && p.enl[i - 1] > 1) || (i < p.n && p.enl[i] > 1);
  function valido(p) {
    if (!p || p.n < 1 || p.n > 10) return false;
    for (let i = 1; i <= p.n; i++) {
      const g = p.g[i], c = x => g.filter(y => y === x).length;
      if (hDe(p, i) < 0) return false;
      if (c('OH') > 1 || c('O') > 1 || c('N') > 1 || c('COOH') > 1) return false;
      if (c('O') && c('OH') && (!extremo(p, i) || g.length > 2)) return false;   // -COOH solo en un extremo
      if (c('O') && extremo(p, i) && !c('OH') && g.length > 1) return false;     // C=O de extremo con otra cosa
      if (c('O') && (c('N') || c('COOH'))) return false;
      if (c('OH') && c('N')) return false;
      if (enMultiple(p, i) && (c('OH') || c('O') || c('N'))) return false;      // sin enoles ni enaminas
    }
    return true;
  }
  function clases(p, i) {
    const g = p.g[i], r = [], O = g.includes('O'), OH = g.includes('OH');
    if (O && OH) r.push('acido');
    else { if (O) r.push(extremo(p, i) ? 'aldehido' : 'cetona'); if (OH) r.push('alcohol'); }
    for (const x of g) if (x !== 'O' && x !== 'OH') r.push(x === 'N' ? 'amina' : x === 'COOH' ? 'carboxi' : x);
    return r;
  }
  function principalDe(p) {
    if (p.principal !== undefined) return p.principal;
    if (p.carboxilico) return 'carboxi';
    const todas = new Set();
    for (let i = 1; i <= p.n; i++) clases(p, i).forEach(x => todas.add(x));
    return PRIORIDAD.find(t => todas.has(t)) || null;
  }
  // Rasgos con una numeración (dir = 1: la del plan; −1: desde el otro extremo).
  function rasgos(p, dir) {
    const L = i => (dir > 0 ? i : p.n + 1 - i), pri = principalDe(p);
    const r = { n: p.n, tipo: pri, principal: [], multiples: [], prefijos: [] };
    for (let i = 1; i <= p.n; i++) for (const c of clases(p, i)) {
      if (c === pri) r.principal.push(L(i));
      else r.prefijos.push({ nombre: PREFIJO[c], loc: L(i) });
    }
    for (let i = 1; i < p.n; i++) if (p.enl[i] > 1) r.multiples.push({ loc: Math.min(L(i), L(i + 1)), orden: p.enl[i] });
    return r;
  }
  function criterios(r, modo = 'normal') {
    const Pr = ord(r.principal), M = ord(r.multiples.map(m => m.loc));
    const D = ord(r.multiples.filter(m => m.orden === 2).map(m => m.loc)), T = ord(r.multiples.filter(m => m.orden === 3).map(m => m.loc));
    const X = ord(r.prefijos.map(x => x.loc));
    const alfa = [...new Set(r.prefijos.map(x => x.nombre))].sort(alf).map(nom => ord(r.prefijos.filter(x => x.nombre === nom).map(x => x.loc)));
    if (modo === 'insat') return [M, D, Pr, X, ...alfa];
    if (modo === 'triple') return [Pr, M, T, X, ...alfa];
    return [Pr, M, D, X, ...alfa];
  }
  function comparar(a, b) {
    for (let k = 0; k < a.length; k++) {
      const x = a[k], y = b[k];
      for (let j = 0; j < Math.min(x.length, y.length); j++) if (x[j] !== y[j]) return x[j] - y[j];
      if (x.length !== y.length) return x.length - y.length;
    }
    return 0;
  }
  const direccion = (p, modo) => (comparar(criterios(rasgos(p, 1), modo), criterios(rasgos(p, -1), modo)) <= 0 ? 1 : -1);

  // Escribe el nombre desde los rasgos. Opciones (para los errores): ordenLoc, inEn, sinLocSufijo, quitarLocMedio,
  // multMal (multiplicador de hidroxi con un número de menos).
  function escribir(r, op = {}) {
    const todos = [...r.principal, ...r.prefijos.map(x => x.loc), ...r.multiples.map(m => m.loc)];
    if (r.n < 1 || !RAIZ[r.n] || todos.some(l => l < 1 || l > r.n)) return null;
    const grupos = [];
    for (const x of r.prefijos) {
      let gg = grupos.find(y => y.nombre === x.nombre);
      if (!gg) grupos.push(gg = { nombre: x.nombre, locs: [] });
      gg.locs.push(x.loc);
    }
    grupos.forEach(gg => { gg.locs = ord(gg.locs); });
    grupos.sort(op.ordenLoc ? ((a, b) => a.locs[0] - b.locs[0] || alf(a.nombre, b.nombre)) : ((a, b) => alf(a.nombre, b.nombre)));
    const pref = grupos.map(gg => {
      let k = gg.locs.length;
      if (op.multMal && gg.nombre === 'hidroxi') k += op.multMal;
      return gg.locs.join(',') + '-' + (k > 1 ? MULT[k] : '') + gg.nombre;
    }).join('-');
    const D = ord(r.multiples.filter(m => m.orden === 2).map(m => m.loc)), T = ord(r.multiples.filter(m => m.orden === 3).map(m => m.loc));
    let tallo = RAIZ[r.n];
    if (!D.length && !T.length) tallo += 'an';
    else {
      if (D.length > 1 || (!D.length && T.length > 1)) tallo += 'a';
      const en = D.length ? `-${D.join(',')}-${D.length > 1 ? MULT[D.length] : ''}en` : '';
      const ino = T.length ? `-${T.join(',')}-${T.length > 1 ? MULT[T.length] : ''}in` : '';
      tallo += op.inEn ? ino + en : en + ino;
    }
    const c = r.principal.length, locs = ord(r.principal);
    const conLoc = w => (op.sinLocSufijo ? w : `-${locs.join(',')}-${w}`);
    let suf = '', acido = false;
    switch (r.tipo) {
      case 'acido': suf = (c > 1 ? MULT[c] : '') + 'oico'; acido = true; break;
      case 'carboxi': {
        const l = op.quitarLocMedio ? locs.filter((x, i) => i !== 1) : locs;
        suf = `-${l.join(',')}-${MULT[c]}carboxílico`; acido = true; break;
      }
      case 'aldehido': suf = (c > 1 ? MULT[c] : '') + 'al'; break;
      case 'cetona': suf = conLoc((c > 1 ? MULT[c] : '') + 'ona'); break;
      case 'alcohol': suf = conLoc((c > 1 ? (c > 3 ? MULT[c].replace(/a$/, '') : MULT[c]) : '') + 'ol'); break;
      case 'amina': suf = conLoc((c > 1 ? MULT[c] : '') + 'amina'); break;
      default: suf = '';
    }
    const palabra = suf.replace(/^-[\d,]+-/, '');
    if (!palabra || !/^[aeiouáéíóú]/.test(palabra)) tallo += 'o';
    const nombre = pref + tallo + suf;
    return acido ? 'ácido ' + nombre : nombre;
  }
  function nombrar(p, op = {}) {
    if (!valido(p)) return null;
    const r = rasgos(p, op.dir || direccion(p, op.modo));
    return escribir(op.cambiar ? op.cambiar(r) : r, op);
  }

  // ---------- Transformaciones de plan (para nombrar los errores) ----------
  // Los -COOH de extremo pasan a «carboxi» sobre el carbono vecino (sus C salen de la cadena).
  function acidoAPrefijo(p) {
    const esA = i => p.g[i].includes('O') && p.g[i].includes('OH');
    const ini = esA(1) ? 2 : 1, fin = p.n > 1 && esA(p.n) ? p.n - 1 : p.n;
    if (ini === 1 && fin === p.n) return null;
    const n = fin - ini + 1;
    if (n < 1) return null;
    const r = plan(n);
    for (let i = ini; i <= fin; i++) r.g[i - ini + 1] = p.g[i].slice();
    for (let i = ini; i < fin; i++) r.enl[i - ini + 1] = p.enl[i];
    if (ini === 2) r.g[1].push('COOH');
    if (fin === p.n - 1) r.g[n].push('COOH');
    return r;
  }
  function cambiarGrupo(p, i, de, a) {
    const q = copiar(p), k = q.g[i].indexOf(de);
    if (k < 0) return null;
    if (a) q.g[i][k] = a; else q.g[i].splice(k, 1);
    return valido(q) ? q : null;
  }
  const desplazar = (r, d) => ({ ...r, n: r.n - d, prefijos: r.prefijos.map(x => ({ ...x, loc: x.loc - d })), multiples: r.multiples.map(m => ({ ...m, loc: m.loc - d })) });
  const cambiarNombres = (r, f) => ({ ...r, prefijos: r.prefijos.map(x => ({ ...x, nombre: f(x.nombre) })) });

  // ---------- Fórmula en una línea (semidesarrollada) y SMILES ----------
  const ENLACE = { 1: '-', 2: '=', 3: '≡' };
  const HH = h => (h === 0 ? '' : h === 1 ? 'H' : 'H' + h);
  const TXT_GRUPO = { OH: [{ v: 'oh', t: 'OH' }], N: [{ v: 'nh2', t: 'NH2' }], COOH: [{ v: 'cooh', t: 'COOH' }], Me: ['CH3'],
    Et: ['CH2-CH3'], Ph: ['C6H5'], PhOH: ['C6H4-', { v: 'oh', t: 'OH' }] };
  // Piezas de la línea: cadenas de texto o { v, t } (grupo con color). Devuelve las piezas en el orden de dibujo.
  function semiPlan(p, alReves) {
    const orden = Array.from({ length: p.n }, (_, k) => (alReves ? p.n - k : k + 1));
    const piezas = [];
    orden.forEach((i, k) => {
      const prim = k === 0, ult = k === p.n - 1, g = p.g[i], h = hDe(p, i);
      if (k > 0) piezas.push(ENLACE[p.enl[Math.min(i, orden[k - 1])]]);
      const O = g.includes('O'), OH = g.includes('OH');
      const term = p.n > 1 && (prim || ult);
      if (O && OH) { piezas.push({ v: 'cooh', t: prim ? 'HOOC' : 'COOH' }); return; }
      if (O && term) { piezas.push({ v: 'co', t: prim ? 'OHC' : 'CHO' }); return; }
      if (O) { piezas.push({ v: 'co', t: 'CO' }); return; }
      if (term && g.length === 1 && h === 2 && (OH || g[0] === 'N')) {
        const gr = OH ? { v: 'oh', t: prim ? 'HO' : 'OH' } : { v: 'nh2', t: prim ? 'H2N' : 'NH2' };
        if (prim) piezas.push(gr, 'CH2'); else piezas.push('CH2', gr);
        return;
      }
      const resto = g.slice(), anillo = term ? resto.find(x => x === 'Ph' || x === 'PhOH') : null;
      if (anillo) resto.splice(resto.indexOf(anillo), 1);
      const nucleo = ['C' + HH(h)];
      for (const x of resto) nucleo.push('(', ...TXT_GRUPO[x], ')');
      if (anillo && prim) piezas.push(...(anillo === 'Ph' ? ['C6H5-'] : [{ v: 'oh', t: 'HO' }, '-C6H4-']), ...nucleo);
      else if (anillo) piezas.push(...nucleo, ...(anillo === 'Ph' ? ['-C6H5'] : ['-C6H4-', { v: 'oh', t: 'OH' }]));
      else piezas.push(...nucleo);
    });
    return piezas;
  }
  const SMI = { OH: 'O', O: '=O', N: 'N', COOH: 'C(=O)O', Me: 'C', Et: 'CC', Ph: 'c1ccccc1', PhOH: 'c1ccc(O)cc1' };
  function smilesPlan(p, dir = 1) {
    let s = '';
    for (let k = 1; k <= p.n; k++) {
      const i = dir > 0 ? k : p.n + 1 - k;
      if (k > 1) s += { 1: '', 2: '=', 3: '#' }[p.enl[Math.min(i, dir > 0 ? i - 1 : i + 1)]];
      s += 'C' + p.g[i].map(x => '(' + SMI[x] + ')').join('');
    }
    return s;
  }
  // Piezas → texto ASCII (para _datos) y partes de pantalla (subíndices, «–», colores).
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const pantalla = t => t.replace(/\d/g, d => SUBS[d]).replace(/-/g, '–');
  const ascii = piezas => piezas.map(x => (typeof x === 'string' ? x : x.t)).join('');
  function partes(piezas) {
    const out = [];
    for (const x of piezas) {
      if (typeof x === 'string') {
        const u = out[out.length - 1];
        if (u && u.formula) u.t += pantalla(x); else out.push({ t: pantalla(x), formula: true });
      } else out.push(v(x.v, pantalla(x.t)));
    }
    return out;
  }
  const sub = t => pantalla(t);

  // ---------- Familias de moléculas con nombre ----------
  // Cada familia devuelve { p (plan del nombre), dibujo (plan de la línea escrita), alReves, familia, errores(c) } o null.
  const nomGrupo = { acido: 'el ácido carboxílico (–COOH)', carboxi: 'el ácido carboxílico (–COOH)', aldehido: 'el aldehído (–CHO)',
    cetona: 'la cetona (C=O entre dos C)', alcohol: 'el alcohol (–OH)', amina: 'la amina (–NH₂)' };
  const prefDe = { aldehido: 'oxo', cetona: 'oxo', alcohol: 'hidroxi', amina: 'amino' };
  function tiposSecundarios(p) {
    const pri = principalDe(p), s = new Set();
    for (let i = 1; i <= p.n; i++) for (const c of clases(p, i)) if (c !== pri && PRIORIDAD.includes(c)) s.add(c);
    return PRIORIDAD.filter(t => s.has(t));
  }
  // Errores comunes a las cadenas: numeración al revés, orden por localizador, metil por etil.
  function erroresComunes(p, dirC, lista) {
    const r = rasgos(p, dirC);
    const rv = rasgos(p, -dirC), debil = (rv.tipo === 'acido' || rv.tipo === 'aldehido') && rv.prefijos.some(x => x.loc === 1);
    lista.push({ debil, t: nombrar(p, { dir: -dirC }), e: INF('HC3-numeracion-al-reves', 'Numeraste desde el otro extremo. Se numera desde el lado que da el número más bajo al grupo principal; si empata, a los enlaces dobles y triples, y después a los prefijos.') });
    lista.push({ t: escribir(r, { ordenLoc: true }), e: INF('HC3-orden-por-localizador', 'Ordenaste los prefijos por su número. Se escriben en orden alfabético (sin contar di-, tri-), cada uno con sus localizadores.') });
    if (r.prefijos.some(x => x.nombre === 'metil' || x.nombre === 'etil'))
      lista.push({ t: escribir(cambiarNombres(r, x => (x === 'metil' ? 'etil' : x === 'etil' ? 'metil' : x)), {}), e: H('AQ-metil-por-etil', '–CH₃ es metil (un carbono) y –CH₂–CH₃ es etil (dos carbonos): cambiaste uno por otro.') });
  }
  // Prioridad invertida: el sufijo para el grupo secundario. Con q (los -COOH ya pasados a «carboxi»), el que manda en q.
  function invertida(p, q) {
    let x, t;
    if (q) { x = copiar(q); x.carboxilico = false; delete x.principal; t = principalDe(x); }
    else { const sec = tiposSecundarios(p); if (!sec.length) return null; x = copiar(p); x.principal = t = sec[0]; }
    if (!t) return null;
    const pri = principalDe(p);
    return { t: nombrar(x), e: INF('FO4-sufijo-del-secundario', `Le diste el sufijo ${nomGrupo[t].replace(/^el /, 'al ').replace(/^la /, 'a la ')}${q ? ' y dejaste el –COOH como prefijo «carboxi»' : ''}. El sufijo lo da el grupo de mayor prioridad (ácido > aldehído > cetona > alcohol > amina): aquí es ${nomGrupo[pri]}, y ${nomGrupo[t].replace(/^(el|la) /, '')} va como prefijo (${prefDe[t]}).`, 'parcial') };
  }
  function oxoHidroxi(p) {
    const out = [];
    for (let i = 2; i < p.n; i++) {
      const g = p.g[i];
      if (g.includes('OH') && !g.includes('O')) { const q = cambiarGrupo(p, i, 'OH', 'O'); if (q) out.push(q); }
      else if (g.includes('O') && !g.includes('OH')) { const q = cambiarGrupo(p, i, 'O', 'OH'); if (q) out.push(q); }
    }
    return out.map(q => ({ t: nombrar(q), e: H('AQ-oxo-por-hidroxi', 'Cambiaste el prefijo: –OH es hidroxi y el =O dentro de la cadena es oxo. Con ese prefijo el nombre es el de otra molécula.') }));
  }
  // Sin el C del -COOH (o del -CHO): débil si algún prefijo cae en el «C1» que el alumno no contó.
  function sinC1(p, dirC, e) {
    const r = desplazar(rasgos(p, dirC), 1);
    return { t: escribir(r), e, debil: r.prefijos.some(x => x.loc === 1) };
  }
  const sinCOOH = (p, dirC) => sinC1(p, dirC, H('AQ-cadena-sin-carboxilo', `Dejaste fuera de la cadena el carbono del –COOH. Con el sufijo -oico ese carbono es el C1: la cadena tiene ${p.n} carbonos, no ${p.n - 1}.`));
  const sinCHO = (p, dirC) => sinC1(p, dirC, H('AQ-cadena-sin-carbonilo', `Dejaste fuera de la cadena el carbono del –CHO. Con el sufijo -al ese carbono es el C1: la cadena tiene ${p.n} carbonos.`));
  // Nombre sin el número del sufijo (-ona, -ol, -amina): solo si con los prefijos fijos el grupo principal cabe en dos o más
  // carbonos distintos (si cabe en uno solo, el nombre sin número no es ambiguo y no sería un error).
  function sinLocAmbiguo(p, dirC, explicacion) {
    const t = escribir(rasgos(p, dirC), { sinLocSufijo: true }), pri = principalDe(p), cod = { cetona: 'O', alcohol: 'OH', amina: 'N' }[pri];
    if (!t || !cod) return null;
    const desde = [];
    for (let i = 1; i <= p.n; i++) if (clases(p, i).includes(pri)) desde.push(i);
    if (desde.length !== 1) return null;
    const mol = new Set();
    for (let i = 1; i <= p.n; i++) {
      const q = copiar(p); q.g[desde[0]].splice(q.g[desde[0]].indexOf(cod), 1); q.g[i].push(cod);
      if (!valido(q) || principalDe(q) !== pri || !clases(q, i).includes(pri)) continue;
      if (escribir(rasgos(q, direccion(q)), { sinLocSufijo: true }) === t) mol.add(nombrar(q));
    }
    return mol.size >= 2 ? { t, e: H('AQ-sin-localizador-del-sufijo', explicacion) } : null;
  }

  function famAcidoSec(rng) {
    const rama = rng.sig() < 0.35, n = rama ? rng.entero(5, 7) : rng.entero(4, 7), p = plan(n);
    p.g[1].push('O', 'OH');
    const sec = rng.elegir(['OH', 'O']);
    if (rama) {
      // Metil en C(n−2) con C(n−1) y C(n) solos: la línea puede escribirse con el -CH2-CH3 colgado.
      const k = rng.entero(2, n - 2);
      p.g[k].push(sec);
      if (!(sec === 'O' && k === n - 2)) p.g[n - 2].push('Me');
      if (n >= 6 && rng.sig() < 0.3) p.enl[rng.entero(2, n - 4)] = 2;
    } else {
      const k = sec === 'O' ? rng.entero(2, n - 1) : rng.entero(2, n);
      p.g[k].push(sec);
      const x = rng.sig();
      if (x < 0.55) { const j = rng.entero(2, n - 1); if (!(sec === 'O' && j === k)) p.g[j].push('Me'); }
      else if (x < 0.8 && n >= 5) p.g[rng.entero(2, n - 3)].push('Et');
      if (rng.sig() < 0.3) p.enl[rng.entero(2, n - 1)] = 2;
    }
    if (!valido(p)) return null;
    return conDibujo(p, rng, 'acidoSec', (c, dirC, dib) => {
      const l = [];
      if (dib) l.push({ t: nombrar(dib), e: INF('HC3-cadena-horizontal', `Tomaste como cadena la línea tal como está escrita. El –CH₂–CH₃ colgado alarga la cadena: la más larga que lleva el –COOH tiene ${p.n} carbonos, y lo que queda colgado es un metil.`, 'parcial') });
      l.push(sinCOOH(p, dirC), invertida(p, acidoAPrefijo(p)), ...oxoHidroxi(p));
      erroresComunes(p, dirC, l);
      return l;
    });
  }
  // Si hay un metil en C(n−2) y C(n−1), C(n) están solos, a veces la línea se escribe con -CH2-CH3 colgado.
  function conDibujo(p, rng, familia, errores, permitirRama = true) {
    let dib = null;
    const n = p.n, j = n - 2;
    if (permitirRama && j >= 2 && p.g[j].includes('Me') && !p.g[n - 1].length && !p.g[n].length && p.enl[j] === 1 && p.enl[n - 1] === 1 && rng.sig() < 0.8) {
      dib = plan(n - 1);
      for (let i = 1; i <= n - 2; i++) dib.g[i] = p.g[i].slice();
      dib.g[j][dib.g[j].indexOf('Me')] = 'Et';
      for (let i = 1; i < n - 2; i++) dib.enl[i] = p.enl[i];
    }
    return { p, dibujo: dib || p, rama: !!dib, alReves: rng.moneda(), familia, errores: (c, dirC) => errores(c, dirC, dib) };
  }
  function famDiacido(rng) {
    const n = rng.entero(4, 7), p = plan(n);
    p.g[1].push('O', 'OH'); p.g[n].push('O', 'OH');
    const sec = rng.elegir(['OH', 'O', 'N']), k = rng.entero(2, n - 1);
    p.g[k].push(sec);
    if (rng.sig() < 0.35) { const j = rng.entero(2, n - 1); if (!(sec === 'O' && j === k)) p.g[j].push('Me'); }
    if (n >= 5 && rng.sig() < 0.2) p.enl[rng.entero(2, n - 2)] = 2;
    if (!valido(p)) return null;
    return conDibujo(p, rng, 'diacido', (c, dirC) => {
      const l = [], r = rasgos(p, dirC);
      l.push({ t: escribir({ ...r, principal: [1] }), e: H('AQ-olvida-multiplicador', 'Hay un –COOH en cada extremo: el sufijo es -dioico. Con -oico el nombre describe un solo carboxilo.') });
      const q = acidoAPrefijo(p);
      l.push(invertida(p, q), ...oxoHidroxi(p));
      erroresComunes(p, dirC, l);
      return l;
    }, false);
  }
  function famTricarboxilico(rng) {
    const m = rng.entero(3, 6), b = rng.entero(2, m - 1), h = rng.entero(1, m); // con m = 3 salen el cítrico y el isocítrico
    const p = plan(m, true);
    p.g[1].push('COOH'); p.g[b].push('COOH'); p.g[m].push('COOH'); p.g[h].push('OH');
    // La línea escrita: los -COOH de los extremos como extremos de la línea (m + 2 carbonos).
    const dib = plan(m + 2);
    dib.g[1].push('O', 'OH'); dib.g[m + 2].push('O', 'OH'); dib.g[b + 1].push('COOH'); dib.g[h + 1].push('OH');
    if (!valido(p) || !valido(dib)) return null;
    return { p, dibujo: dib, rama: false, alReves: rng.moneda(), familia: 'tricarboxilico', errores: (c, dirC) => {
      const r = rasgos(p, dirC), l = [];
      // Contar en la cadena los C de los -COOH de los extremos y aun así usar -tricarboxílico (otra molécula).
      const mas = x => x + 1;
      l.push({ t: escribir({ ...r, n: m + 2, principal: r.principal.map(mas), prefijos: r.prefijos.map(x => ({ ...x, loc: mas(x.loc) })) }), e: H('AQ-carboxilo-en-cadena', `Contaste en la cadena los carbonos de los –COOH de los extremos. Con tres –COOH en una cadena abierta, los tres se nombran con -tricarboxílico y sus carbonos quedan fuera: la cadena tiene ${m} carbonos, no ${m + 2}.`) });
      l.push({ t: escribir({ ...r, tipo: 'acido' }), e: H('AQ-trioico', 'El sufijo -oico es para un –COOH cuyo carbono es un extremo de la cadena, y una cadena tiene solo dos extremos. Con tres –COOH se usa -tricarboxílico y los C de los –COOH no se cuentan.') });
      l.push({ t: escribir(r, { quitarLocMedio: true }), e: H('AQ-falta-localizador', 'Falta un localizador: tri- pide tres números, uno por cada carbono que lleva un –COOH.') });
      l.push({ t: nombrar(p, { dir: -dirC }), e: INF('HC3-numeracion-al-reves', 'Numeraste desde el otro extremo. Los –COOH, que dan el sufijo, deben llevar los números más bajos; si empatan, el –OH.') });
      l.push(...oxoHidroxi(p));
      return l;
    } };
  }
  function famDiolEnIno(rng) {
    const n = rng.entero(5, 8), p = plan(n), usado = new Set();
    const poner = orden => {
      const libres = [];
      for (let i = 1; i < n; i++) if (!usado.has(i) && !usado.has(i + 1)) libres.push(i);
      if (!libres.length) return false;
      const i = rng.elegir(libres); p.enl[i] = orden; usado.add(i); usado.add(i + 1); return true;
    };
    if (!poner(3)) return null;
    const nd = n >= 7 && rng.sig() < 0.4 ? 2 : 1;
    for (let k = 0; k < nd; k++) if (!poner(2)) return null;
    const libres = [];
    for (let i = 1; i <= n; i++) if (!usado.has(i)) libres.push(i);
    if (libres.length < 2) return null;
    let oh;
    if (libres.includes(1) && libres.includes(n) && rng.sig() < 0.5) oh = [1, n];
    else oh = rng.barajar(libres).slice(0, 2);
    oh.forEach(i => p.g[i].push('OH'));
    if (!valido(p)) return null;
    return { p, dibujo: p, rama: false, alReves: rng.moneda(), familia: 'diolEnIno', errores: (c, dirC) => {
      const r = rasgos(p, dirC), l = [];
      l.push({ t: nombrar(p, { modo: 'insat' }), e: H('AQ-numera-por-insaturacion', 'Numeraste para dar los números más bajos a los enlaces múltiples. Primero manda el grupo principal (los –OH, sufijo -diol); los enlaces dobles y triples deciden solo si los –OH empatan.') });
      l.push({ t: nombrar(p, { modo: 'triple' }), e: H('AQ-triple-antes-que-doble', 'Si los enlaces múltiples empatan desde los dos lados, el número más bajo es para el doble enlace (-en), no para el triple.') });
      l.push({ t: nombrar(p, { dir: -dirC }), e: INF('HC3-numeracion-al-reves', 'Numeraste desde el otro extremo. Se numera para dar los números más bajos a los –OH; si empatan, a los enlaces múltiples.') });
      l.push({ t: escribir(r, { inEn: true }), e: H('AQ-orden-in-en', 'En el nombre, -en se escribe antes que -in (…-2-en-4-ino…, …-4-en-2-ino…), tenga el número que tenga. La molécula es la misma: el error es de escritura.') });
      l.push({ t: escribir({ ...r, tipo: null, principal: [], prefijos: [...r.prefijos, ...r.principal.map(loc => ({ nombre: 'hidroxi', loc }))] }), e: H('AQ-principal-como-prefijo', 'Nombraste los –OH como prefijo (hidroxi) y la cadena como hidrocarburo. El –OH es el grupo principal de esta molécula: va como sufijo, -diol.') });
      l.push({ t: escribir({ ...r, multiples: r.multiples.map(x => ({ ...x, loc: x.loc + 1 })) }), e: H('AQ-localizador-mayor-del-enlace', 'El localizador de un enlace doble o triple es el número más bajo de sus dos carbonos: un enlace entre C2 y C3 es «2-en», no «3-en».') });
      return l;
    } };
  }
  function famBifuncional(rng) {
    const sub = rng.elegir(['hidroxicetona', 'oxoaldehido', 'hidroxialdehido', 'aminoalcohol']);
    const n = rng.entero(4, 7), p = plan(n);
    if (sub === 'hidroxicetona') { const k = rng.entero(2, n - 1); p.g[k].push('O'); p.g[rng.elegir([...Array(n).keys()].map(x => x + 1).filter(x => x !== k))].push('OH'); }
    if (sub === 'oxoaldehido') { p.g[1].push('O'); p.g[rng.entero(2, n - 1)].push('O'); }
    if (sub === 'hidroxialdehido') { p.g[1].push('O'); p.g[rng.entero(2, n)].push('OH'); }
    if (sub === 'aminoalcohol') { const h = rng.entero(1, n); p.g[h].push('OH'); p.g[rng.elegir([...Array(n).keys()].map(x => x + 1).filter(x => x !== h))].push('N'); }
    if (rng.sig() < 0.4) { const j = rng.entero(2, n - 1); if (!p.g[j].includes('O')) p.g[j].push('Me'); }
    if (rng.sig() < 0.25) p.enl[rng.entero(1, n - 1)] = 2;
    if (!valido(p)) return null;
    return conDibujo(p, rng, 'bifuncional', (c, dirC, dib) => {
      const l = [], pri = principalDe(p), r = rasgos(p, dirC);
      if (dib) l.push({ t: nombrar(dib), e: INF('HC3-cadena-horizontal', `Tomaste como cadena la línea tal como está escrita. El –CH₂–CH₃ colgado alarga la cadena: la más larga tiene ${p.n} carbonos, y lo que queda colgado es un metil.`, 'parcial') });
      l.push(invertida(p));
      if (pri === 'aldehido') l.push(sinCHO(p, dirC));
      else l.push(sinLocAmbiguo(p, dirC, 'Falta el número del grupo principal. Sin él, el nombre sirve para más de una molécula: el grupo puede ir en varios carbonos, así que su localizador se escribe delante del sufijo.'));
      l.push(...oxoHidroxi(p).filter(x => sub !== 'hidroxicetona'));
      erroresComunes(p, dirC, l);
      return l;
    });
  }
  function famAzucar(rng) {
    const cetosa = rng.sig() < 0.4, n = rng.entero(3, 6), p = plan(n);
    if (!cetosa) { p.g[1].push('O'); for (let i = 2; i <= n; i++) p.g[i].push('OH'); if (n >= 4 && rng.sig() < 0.3) p.g[rng.entero(2, n - 1)] = []; }
    else { p.g[2].push('O'); p.g[1].push('OH'); for (let i = 3; i <= n; i++) p.g[i].push('OH'); if (n >= 5 && rng.sig() < 0.3) p.g[rng.entero(3, n - 1)] = []; }
    const completa = cetosa ? p.g.slice(3).every(g => g.includes('OH')) : p.g.slice(2).every(g => g.includes('OH'));
    if (!valido(p)) return null;
    return { p, dibujo: p, rama: false, alReves: rng.sig() < 0.3, familia: 'azucar', errores: (c, dirC) => {
      const l = [], r = rasgos(p, dirC);
      l.push({ t: nombrar(p, { dir: -dirC }), e: H('AQ-numera-desde-hidroxilo', cetosa
        ? 'Numeraste desde el extremo que deja la cetona con el número más alto. El C=O es el grupo principal: se numera para darle el número más bajo, y los –OH van como prefijos.'
        : 'Empezaste a numerar por el –CH₂OH. El C1 es el carbono del grupo principal, el –CHO (sufijo -al); los –OH van como prefijos con los números que les tocan desde ahí.') });
      l.push(invertida(p));
      // La aldosa y la cetosa del mismo número de carbonos.
      const q = copiar(p);
      if (!cetosa && q.g[2].includes('OH')) { q.g[1] = ['OH']; q.g[2] = ['O']; }
      else if (cetosa) { q.g[1] = ['O']; q.g[2] = ['OH']; }
      if (valido(q) && !(q.g[1].includes('OH') && !q.g[2].includes('O')))
        l.push({ t: nombrar(q), e: H('AQ-aldosa-por-cetosa', cetosa ? 'Ese es el nombre de la aldosa del mismo número de carbonos (C=O en el extremo, -al). Aquí el C=O está entre dos carbonos (en el C2): es una cetona, una cetosa.' : 'Ese es el nombre de la cetosa del mismo número de carbonos (C=O en el C2, -ona). Aquí el C=O está en el extremo: es un aldehído, una aldosa.') });
      if (!cetosa) l.push(sinCHO(p, dirC));
      else l.push(sinLocAmbiguo(p, dirC, 'Falta el número de la cetona. Sin él, el nombre sirve para más de una molécula: el C=O puede ir en varios carbonos, así que su localizador va delante de -ona.'));
      const nOH = r.prefijos.filter(x => x.nombre === 'hidroxi').length;
      if (nOH >= 2) l.push({ debil: true, t: escribir(r, { multMal: nOH > 2 ? -1 : 1 }), e: H('AQ-cuenta-mal-los-oh', `Contaste mal los –OH: son ${nOH}, y el multiplicador debe decir cuántos localizadores hay (${MULT[nOH]}hidroxi).`) });
      return l;
    } };
  }
  function famAminoacido(rng) {
    const n = rng.entero(3, 5), p = plan(n);
    p.g[1].push('O', 'OH');
    const a = n >= 4 && rng.sig() < 0.25 ? 3 : 2;
    p.g[a].push('N');
    const lado = rng.elegir(['Ph', 'PhOH', 'Ph', 'PhOH', 'Me', 'OH']);
    let s;
    if (lado === 'Ph' || lado === 'PhOH') s = rng.sig() < 0.65 ? n : rng.entero(a, n);
    else if (lado === 'Me') s = rng.entero(2, n - 1);
    else s = rng.elegir([...Array(n - 1).keys()].map(x => x + 2).filter(x => x !== a));
    p.g[s].push(lado);
    if (!valido(p)) return null;
    return conDibujo(p, rng, 'aminoacido', (c, dirC) => {
      const l = [], r = rasgos(p, dirC);
      l.push(sinCOOH(p, dirC));
      if (lado === 'Ph' || lado === 'PhOH') {
        l.push({ t: escribir(cambiarNombres(r, x => x.replace('fenil', 'bencil'))), e: H('AQ-bencilo-por-fenilo', 'C₆H₅– es fenil. Bencil es C₆H₅–CH₂–, con un carbono más: aquí ese CH₂ ya está contado en la cadena.') });
        if (lado === 'PhOH') { const q = cambiarGrupo(p, s, 'PhOH', 'Ph'); if (q && !q.g[s].includes('OH')) { q.g[s].push('OH'); if (valido(q)) l.push({ t: nombrar(q), e: H('AQ-oh-del-anillo-en-la-cadena', 'El –OH está en el anillo, no en la cadena: el sustituyente es (4-hidroxifenil), un fenil con –OH en la posición para (4). Con «hidroxi» suelto, el –OH quedaría en un carbono de la cadena.') }); } }
      }
      l.push(invertida(p, acidoAPrefijo(p)));
      erroresComunes(p, dirC, l);
      return l;
    }, false);
  }
  // Ácido aromático: anillo R[0..5] en el orden de dibujo; R[0] = 'COOH'.
  const PREF_ANILLO = { COOH: 'carboxi', OH: 'hidroxi', N: 'amino', Me: 'metil' };
  const PADRE_ANILLO = { COOH: 'ácido @benzoico', OH: '@fenol', N: '@anilina', Me: '@tolueno' };
  function nombrarAnillo(R, pi, op = {}) {
    const cands = [1, -1].map(dir => {
      const pre = [];
      R.forEach((x, j) => { if (x && j !== pi) pre.push({ nombre: PREF_ANILLO[x], loc: ((((j - pi) * dir) % 6) + 6) % 6 + 1 }); });
      return { dir, pre };
    });
    const crit = c => [ord(c.pre.map(x => x.loc)), ...[...new Set(c.pre.map(x => x.nombre))].sort(alf).map(nm => ord(c.pre.filter(x => x.nombre === nm).map(x => x.loc)))];
    let c = comparar(crit(cands[0]), crit(cands[1])) <= 0 ? cands[0] : cands[1];
    if (op.otroSentido) c = c === cands[0] ? cands[1] : cands[0];
    const r = { n: 6, tipo: null, principal: [], multiples: [], prefijos: c.pre };
    const pref = escribir(r, op).replace(/hexano$/, '');
    return PADRE_ANILLO[R[pi]].replace('@', pref);
  }
  function famAromatico(rng) {
    const k = rng.sig() < 0.45 ? 1 : 2, R = [ 'COOH', null, null, null, null, null ];
    const pos = rng.barajar([1, 2, 3, 4, 5]).slice(0, k);
    pos.forEach(j => { R[j] = rng.elegir(['OH', 'N', 'Me']); });
    return { anillo: R, familia: 'aromatico', errores: c => {
      const l = [];
      l.push({ t: nombrarAnillo(R, 0, { otroSentido: true }), e: H('AQ-sentido-del-anillo', 'Recorriste el anillo en el sentido que da números más altos. Desde el C del –COOH (C1) se va hacia el lado que da los localizadores más bajos a los sustituyentes.') });
      const pi = R.findIndex((x, j) => j > 0 && x === 'OH') > 0 ? R.findIndex((x, j) => j > 0 && x === 'OH') : R.findIndex((x, j) => j > 0 && x === 'N') > 0 ? R.findIndex((x, j) => j > 0 && x === 'N') : R.findIndex((x, j) => j > 0 && x === 'Me');
      const pri = R[pi];
      l.push({ t: nombrarAnillo(R, pi), e: INF('FO4-sufijo-del-secundario', `Tomaste como nombre base ${pri === 'OH' ? 'el fenol (–OH)' : pri === 'N' ? 'la anilina (–NH₂)' : 'el tolueno (–CH₃)'} y el –COOH como prefijo «carboxi». El –COOH es el grupo de mayor prioridad: el nombre base es ácido benzoico y su carbono es el C1.`, 'parcial') });
      for (const d of [1, -1]) for (const j of pos) {
        const j2 = j + d;
        if (j2 < 1 || j2 > 5 || R[j2]) continue;
        const S = R.slice(); S[j2] = S[j]; S[j] = null;
        l.push({ t: nombrarAnillo(S, 0), e: H('AQ-orto-meta-para', 'Contaste mal la posición en el anillo: el vecino del C1 es el 2 (orto), el siguiente el 3 (meta) y el opuesto el 4 (para).') });
      }
      if (k === 2) l.push({ t: nombrarAnillo(R, 0, { ordenLoc: true }), e: INF('HC3-orden-por-localizador', 'Ordenaste los prefijos por su número. Se escriben en orden alfabético, cada uno con su localizador.') });
      return l;
    } };
  }
  // Solución del anillo: los localizadores leyendo la línea escrita en sus dos sentidos desde el C(COOH).
  const TXT_AN = { OH: 'OH', N: 'NH₂', Me: 'CH₃' };
  function numeracionAnillo(M) {
    const orden = M.alReves ? [0, 5, 4, 3, 2, 1] : [0, 1, 2, 3, 4, 5];
    const sentido = f => orden.map((j, k) => (k && M.anillo[j] ? { loc: f(k), x: TXT_AN[M.anillo[j]] } : null)).filter(Boolean).sort((a, b) => a.loc - b.loc);
    const ida = sentido(k => k + 1), vuelta = sentido(k => 7 - k);
    const txt = l => l.map(o => `${o.loc} (${o.x})`).join(', ');
    const gana = comparar([ida.map(o => o.loc)], [vuelta.map(o => o.loc)]);
    return [`Desde el C(COOH) como C1, siguiendo la línea escrita hacia la derecha: ${txt(ida)}; dando la vuelta al revés: ${txt(vuelta)}. `,
      gana === 0 ? 'Los dos sentidos dan los mismos números: decide el orden alfabético.' : `Gana ${gana < 0 ? 'el sentido escrito' : 'el sentido al revés'}, con los números más bajos.`];
  }
  function semiAnillo(R, alReves) {
    const orden = alReves ? [0, 5, 4, 3, 2, 1] : [0, 1, 2, 3, 4, 5], piezas = [];
    orden.forEach((j, k) => {
      const x = R[j];
      piezas.push(x ? 'C(' : 'CH');
      if (x) piezas.push(...(x === 'COOH' ? [{ v: 'cooh', t: 'COOH' }] : x === 'OH' ? [{ v: 'oh', t: 'OH' }] : x === 'N' ? [{ v: 'nh2', t: 'NH2' }] : ['CH3']), ')');
      piezas.push(k % 2 === 0 ? '=' : '-');
    });
    return piezas;
  }
  const SMI_AN = { COOH: 'C(=O)O', OH: 'O', N: 'N', Me: 'C' };
  const smilesAnillo = R => R.map((x, j) => 'c' + (j === 0 || j === 5 ? '1' : '') + (x ? `(${SMI_AN[x]})` : '')).join('');

  const FAMILIAS = { acidoSec: famAcidoSec, diacido: famDiacido, tricarboxilico: famTricarboxilico, diolEnIno: famDiolEnIno,
    bifuncional: famBifuncional, azucar: famAzucar, aminoacido: famAminoacido, aromatico: famAromatico };
  const PESOS_FAM = ['acidoSec', 'acidoSec', 'diacido', 'tricarboxilico', 'tricarboxilico', 'diolEnIno', 'diolEnIno', 'bifuncional',
    'bifuncional', 'azucar', 'azucar', 'aminoacido', 'aminoacido', 'aromatico'];

  // Molécula lista para mostrar: { familia, nombre, semi, smiles, partes, n (C de la cadena), m }.
  function molecula(rng, familias = PESOS_FAM) {
    for (let i = 0; i < 200; i++) {
      const f = rng.elegir(familias), M = FAMILIAS[f](rng);
      if (!M) continue;
      if (M.anillo) {
        const alReves = rng.moneda(), piezas = semiAnillo(M.anillo, alReves);
        return { ...M, alReves, nombre: nombrarAnillo(M.anillo, 0), piezas, semi: ascii(piezas), smiles: smilesAnillo(M.anillo), nota: ' (anillo de benceno: los seis C del anillo se escriben en orden, dando la vuelta; el último se une al primero)' };
      }
      const dirC = direccion(M.p), nombre = nombrar(M.p);
      if (!nombre || !valido(M.dibujo)) continue;
      const piezas = semiPlan(M.dibujo, M.alReves);
      if (ascii(piezas).length > 38) continue; // fórmulas de una línea que se lean bien en el celular
      const nota = M.dibujo.g.some(g => g.includes('PhOH')) ? ' (C₆H₄: anillo de benceno con sus dos enlaces en posiciones opuestas, para)' : '';
      return { ...M, dirC, nombre, piezas, semi: ascii(piezas), smiles: smilesPlan(M.p, dirC), nota };
    }
    throw new Error('no se pudo armar una molécula');
  }

  // Trozos del nombre con el color de su grupo (regla 4): -oico/carboxi/ácido en h, hidroxi/-ol en i, oxo/-al/-ona en o,
  // amino/-amina en d.
  const RE_TROZO = /(ácido |tricarboxílico|carboxi|dioico|oico|hidroxi|oxo|amino|amina$|(?:di|tri|tetr|pent)?ol$|(?:di)?al$|(?:di)?ona$)/;
  function colorearNombre(nom) {
    const out = [];
    for (const t of nom.split(RE_TROZO).filter(Boolean)) {
      const k = /^(ácido |tricarboxílico|carboxi|dioico|oico)$/.test(t) ? 'cooh' : /^(hidroxi|(di|tri|tetr|pent)?ol)$/.test(t) ? 'oh'
        : /^(oxo|(di)?al|(di)?ona)$/.test(t) ? 'co' : /^(amino|amina)$/.test(t) ? 'nh2' : null;
      out.push(k ? v(k, t) : { t, formula: true });
    }
    return out;
  }
  // Forma anterior (2-butanol, 4-hidroxi-2-pentanona): el localizador del sufijo delante de la raíz.
  function formaAntigua(nom) {
    const m = nom.match(/^(.*?)((?:met|et|prop|but|pent|hex|hept|oct)ano?)-([\d,]+)-((?:di|tri|tetr|pent)?(?:ol|ona|amina))$/);
    if (!m) return null;
    const [, pre, tallo, locs, suf] = m;
    return (pre ? pre + '-' : '') + locs + '-' + tallo + suf;
  }
  const lineaNombre = (antes, nom) => { const a = formaAntigua(nom); return [antes, ...colorearNombre(nom), a ? ` (en muchos libros: ${a})` : '', '.']; };

  // ---------- Solución de un nombre ----------
  function solucionNombre(M) {
    if (M.anillo) {
      return [['El grupo de mayor prioridad es el ', v('cooh', '–COOH'), ' unido al anillo: el nombre base es ácido benzoico y el C del anillo que lo lleva es el C1.'],
        ['Se recorre el anillo desde el C1 hacia el lado que da los números más bajos a los sustituyentes; si empatan, el número más bajo es para el primero en orden alfabético.'],
        numeracionAnillo(M), lineaNombre('Los prefijos van en orden alfabético con su número: ', M.nombre)];
    }
    const p = M.p, r = rasgos(p, M.dirC), pri = r.tipo;
    const grupoPri = { acido: v('cooh', '–COOH'), carboxi: v('cooh', '–COOH'), aldehido: v('co', '–CHO'), cetona: v('co', 'C=O'), alcohol: v('oh', '–OH'), amina: v('nh2', '–NH₂') }[pri];
    const sufTxt = { acido: r.principal.length > 1 ? 'ácido …dioico' : 'ácido …oico', carboxi: 'ácido …tricarboxílico', aldehido: r.principal.length > 1 ? '-dial' : '-al', cetona: '-ona', alcohol: r.principal.length > 1 ? '-diol' : '-ol', amina: '-amina' }[pri];
    const pasos = [['Grupo principal (el de mayor prioridad: ácido > aldehído > cetona > alcohol > amina): ', grupoPri, `, que da el sufijo ${sufTxt}.`]];
    const sec = tiposSecundarios(p);
    if (sec.length) pasos.push(['Los demás grupos van como prefijos: ', ...sec.flatMap((t, i) => [i ? ', ' : '', { aldehido: v('co', 'oxo'), cetona: v('co', 'oxo'), alcohol: v('oh', 'hidroxi'), amina: v('nh2', 'amino') }[t]]), '.']);
    if (pri === 'carboxi') pasos.push(['Con tres ', v('cooh', '–COOH'), ` en una cadena abierta, sus carbonos no entran a la cadena: la cadena tiene ${p.n} carbonos y el sufijo es -tricarboxílico.`]);
    else if (M.rama) pasos.push([`La cadena principal no es la línea escrita: el –CH₂–CH₃ colgado la alarga. La más larga que lleva el grupo principal tiene ${p.n} carbonos; lo que queda colgado es un metil.`]);
    else pasos.push([`Cadena principal: ${p.n} carbonos${pri === 'acido' || pri === 'aldehido' ? ', contando el carbono del grupo principal como C1' : ''}${r.multiples.length ? ', con los enlaces múltiples' : ''}.`]);
    const loc = [];
    loc.push(`grupo principal en ${ord(r.principal).join(', ')}`);
    if (r.multiples.length) loc.push(`enlaces múltiples en ${ord(r.multiples.map(m => m.loc)).join(', ')}`);
    if (r.prefijos.length) loc.push(`prefijos en ${ord(r.prefijos.map(x => x.loc)).join(', ')}`);
    pasos.push([`Numeración: el número más bajo al grupo principal; si empata, a los enlaces múltiples y luego a los prefijos. Queda ${loc.join('; ')}.`]);
    pasos.push(lineaNombre(r.prefijos.length ? 'Prefijos en orden alfabético (sin contar di-, tri-) y el nombre: ' : 'El nombre: ', M.nombre));
    return pasos;
  }

  function cerrar(rng, semilla, o) {
    const alternativas = o.numerica
      ? P.armar({ correcta: o.correcta, errores: o.errores, rng, texto: x => `${x} carbonos` })
      : P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    return { id: `${ID}#${semilla}`, variables: o.variables || VARIABLES, enunciado: o.enunciado, pregunta: o.pregunta, datos: '', alternativas,
      solucion: o.solucion, respuesta: { valor: o.numerica ? o.correcta : o.correcta.clave }, _datos: o._datos,
      ...(o.convenciones ? { convenciones: o.convenciones } : {}) };
  }
  const enunciadoMol = (M, antes) => [antes, ...partes(M.piezas), M.nota || '', '.'];
  const datosMol = (M, tipo, extra = {}) => ({ tipo, familia: M.familia, semi: M.semi, smiles: M.smiles, ...(M.rama ? { dibujo: 'rama' } : {}), ...extra });

  // ---- nombre ----
  function tipoNombre(rng, semilla) {
    const M = molecula(rng);
    const lista = M.errores(M.nombre, M.dirC).filter(x => x && x.t && x.t !== M.nombre);
    const errores = [];
    for (const x of lista) if (!errores.some(y => y.texto === x.t)) errores.push({ ...x.e, clave: 'nom:' + x.t, texto: x.t, debil: !!x.debil });
    if (errores.length < 3) return null;
    // El primero es la trampa propia de la familia: va siempre (si no es débil); los demás, al azar, y los débiles (que se
    // descartan por la forma: un multiplicador que no calza, un prefijo en el C del -CHO o del -COOH) solo si faltan.
    const fijo = errores[0].debil ? [] : [errores[0]], resto = rng.barajar(errores.slice(fijo.length));
    errores.splice(0, errores.length, ...fijo, ...resto.filter(e => !e.debil), ...resto.filter(e => e.debil));
    errores.forEach(e => delete e.debil);
    return cerrar(rng, semilla, {
      enunciado: enunciadoMol(M, 'Observa la molécula '), pregunta: ['¿Cuál es su nombre IUPAC?'],
      correcta: { clave: 'nom:' + M.nombre, texto: M.nombre }, errores: errores.slice(0, 4),
      solucion: solucionNombre(M), _datos: datosMol(M, 'nombre'),
    });
  }

  // ---- cadena: ¿cuántos C tiene la cadena principal? ----
  function contarC(p) {
    let c = 0;
    for (let i = 1; i <= p.n; i++) { c++; for (const x of p.g[i]) c += { COOH: 1, Me: 1, Et: 2, Ph: 6, PhOH: 6 }[x] || 0; }
    return c;
  }
  function tipoCadena(rng, semilla) {
    const M = molecula(rng, ['acidoSec', 'acidoSec', 'tricarboxilico', 'tricarboxilico', 'aminoacido', 'diacido', 'bifuncional']);
    const p = M.p, n = p.n, pri = principalDe(p), total = contarC(p);
    const err = [];
    if (M.rama) err.push({ ...INF('HC3-cadena-horizontal', 'Contaste la línea tal como está escrita. El –CH₂–CH₃ colgado alarga la cadena: la cadena principal es la más larga que lleva el grupo principal.', 'parcial'), valor: M.dibujo.n });
    if (pri === 'acido') err.push({ ...H('AQ-cadena-sin-carboxilo', `Dejaste fuera el carbono del –COOH. Con el sufijo -oico ese carbono es el C1 de la cadena${p.g[n].includes('OH') && p.g[n].includes('O') ? ' (y el del otro –COOH, el último)' : ''}.`), valor: p.g[n].includes('O') && p.g[n].includes('OH') ? n - 2 : n - 1 });
    if (pri === 'aldehido') err.push({ ...H('AQ-cadena-sin-carbonilo', 'Dejaste fuera el carbono del –CHO. Con el sufijo -al ese carbono es el C1 de la cadena.'), valor: n - 1 });
    err.push({ ...H('AQ-cuenta-todos-los-c', `Contaste todos los carbonos de la molécula (${total}). La cadena principal no incluye las ramas${p.g.some(g => g.includes('Ph') || g.includes('PhOH')) ? ' ni el anillo' : ''}${pri === 'carboxi' ? ' ni los C de los –COOH' : ''}.`), valor: total });
    err.push({ ...INF('HC3-cuenta-mal-la-cadena', 'Contaste un carbono de más: quizá sumaste el de una rama o pasaste a un grupo que no es parte de la cadena. Sigue la cadena de un extremo al otro sin desviarte.', 'parcial'), valor: n + 1 });
    err.push({ ...INF('HC3-cuenta-mal-la-cadena', `Te faltó un carbono: cuenta también los de los dos extremos${pri === 'acido' || pri === 'aldehido' ? ', incluido el del grupo principal' : ''}.`, 'parcial'), valor: n - 1 });
    // Con tres -COOH, n + 2 es justo la cadena con los C de los -COOH de los extremos (el otro nombre de 1993): no se ofrece.
    if (pri !== 'carboxi') err.push({ ...INF('HC3-cuenta-mal-la-cadena', 'Sumaste dos carbonos de más: la cadena principal se cuenta por un solo camino, sin las ramas.', 'parcial'), valor: n + 2 });
    if (n - 2 >= 2) err.push({ ...INF('HC3-cuenta-mal-la-cadena', 'Te faltaron dos carbonos: la cadena principal es la más larga posible y va de un extremo al otro.', 'parcial'), valor: n - 2 });
    const pasos = [];
    if (pri === 'carboxi') pasos.push(['Hay tres ', v('cooh', '–COOH'), ' en una cadena abierta: se nombran con -tricarboxílico y sus carbonos quedan fuera de la cadena.']);
    else if (M.rama) pasos.push(['La línea escrita no es la cadena principal: el –CH₂–CH₃ colgado la alarga.']);
    else pasos.push(['La cadena principal es la más larga que lleva el grupo principal', pri === 'acido' ? [', y el carbono del ', v('cooh', '–COOH'), ' es el C1'] : '', '.'].flat());
    pasos.push(lineaNombre(`Tiene ${n} carbonos (raíz «${RAIZ[n]}-»): `, M.nombre));
    return cerrar(rng, semilla, { numerica: true,
      enunciado: enunciadoMol(M, 'Observa la molécula '), pregunta: ['¿Cuántos carbonos tiene su cadena principal (la que da la raíz del nombre IUPAC)?'],
      correcta: n, errores: err, solucion: pasos, _datos: datosMol(M, 'cadena') });
  }

  // ---- sufijo: ¿qué grupo da el sufijo? ----
  const TXT_SUF = { acido: 'el ácido carboxílico (–COOH)', aldehido: 'el aldehído (–CHO)', cetona: 'la cetona (C=O)',
    alcohol: 'el alcohol (–OH)', amina: 'la amina (–NH₂)', doble: 'el doble enlace (C=C)', triple: 'el triple enlace (C≡C)' };
  function tipoSufijo(rng, semilla) {
    // Pocas familias de ácido: «el ácido carboxílico (–COOH)» es la etiqueta más larga y no debe ser la correcta muy seguido.
    const M = molecula(rng, ['acidoSec', 'aminoacido', 'bifuncional', 'bifuncional', 'bifuncional', 'bifuncional', 'azucar', 'azucar', 'azucar']);
    const p = M.p, pri = principalDe(p) === 'carboxi' ? 'acido' : principalDe(p), sec = tiposSecundarios(p);
    const hay = t => sec.includes(t) || pri === t;
    const err = [];
    for (const s of sec) err.push({ ...INF('FO4-sufijo-del-secundario', `Esta molécula también tiene ${nomGrupo[s].replace(/^(el|la) /, '')}, pero no es el grupo de mayor prioridad (ácido > aldehído > cetona > alcohol > amina): va como prefijo (${prefDe[s]}).`, 'parcial'), clave: 'suf:' + s, texto: TXT_SUF[s] });
    for (const o of [2, 3]) if (p.enl.slice(1, p.n).includes(o)) err.push({ ...H('AQ-insaturacion-como-principal', 'Los enlaces dobles y triples no son grupos funcionales con sufijo propio cuando hay un grupo con oxígeno o nitrógeno: van en el tallo (-en-, -in-) y el sufijo lo da el grupo de mayor prioridad.'), clave: 'suf:' + (o === 2 ? 'doble' : 'triple'), texto: TXT_SUF[o === 2 ? 'doble' : 'triple'] });
    if (pri === 'acido') {
      if (!hay('cetona')) err.push({ ...INF('FO3-cooh-como-oh-y-co', 'Leíste el –COOH como un C=O de cetona más un –OH. El C=O y el –OH en el mismo carbono son un solo grupo, el carboxilo, el de mayor prioridad.'), clave: 'suf:cetona', texto: TXT_SUF.cetona });
      if (!hay('alcohol')) err.push({ ...INF('FO3-cooh-como-oh-y-co', 'Leíste el –OH del –COOH como un alcohol. El C=O y el –OH en el mismo carbono son un solo grupo, el carboxilo, el de mayor prioridad.'), clave: 'suf:alcohol', texto: TXT_SUF.alcohol });
      if (!hay('aldehido')) err.push({ ...H('AQ-cooh-como-aldehido', 'Viste el C=O en un extremo y pensaste en un aldehído. Si ese carbono también lleva –OH, es un carboxilo (–COOH), no un –CHO.'), clave: 'suf:aldehido', texto: TXT_SUF.aldehido });
    }
    if (pri === 'aldehido' && !hay('cetona')) err.push({ ...INF('FO3-aldehido-por-cetona', 'El C=O de un extremo (con un H) es un aldehído, –CHO; una cetona tiene el C=O entre dos carbonos.'), clave: 'suf:cetona', texto: TXT_SUF.cetona });
    if (pri === 'cetona' && !hay('aldehido')) err.push({ ...INF('FO3-aldehido-por-cetona', 'El C=O entre dos carbonos es una cetona; el aldehído tiene el C=O en un extremo, –CHO.'), clave: 'suf:aldehido', texto: TXT_SUF.aldehido });
    if (!hay('acido') && hay('alcohol') && (hay('aldehido') || hay('cetona'))) err.push({ ...H('AQ-co-y-oh-como-cooh', 'Ves un C=O y un –OH y lees un –COOH. En el carboxilo los dos están en el mismo carbono; aquí están en carbonos distintos.'), clave: 'suf:acido', texto: TXT_SUF.acido });
    const vistos = new Set(), errores = err.filter(e => !vistos.has(e.clave) && vistos.add(e.clave));
    if (errores.length < 3) return null;
    return cerrar(rng, semilla, {
      enunciado: enunciadoMol(M, 'Observa la molécula '), pregunta: ['¿Qué grupo da el sufijo de su nombre IUPAC?'],
      correcta: { clave: 'suf:' + pri, texto: TXT_SUF[pri] }, errores: rng.barajar(errores).slice(0, 4),
      solucion: [['Orden de prioridad: ácido carboxílico > aldehído > cetona > alcohol > amina; los enlaces C=C y C≡C no dan sufijo, van en el tallo.'],
        ['Aquí el de mayor prioridad es ', nomGrupo[principalDe(p)], '; los demás van como prefijos.'], lineaNombre('Nombre: ', M.nombre)],
      _datos: datosMol(M, 'sufijo'),
    });
  }

  // ---- amina: primaria, secundaria o terciaria ----
  // Grupos unidos al N: [nombre, texto a la izquierda, texto a la derecha, C vecinos del C unido al N].
  const ALQ = [
    ['metil', 'CH3', 'CH3', 0], ['etil', 'CH3-CH2', 'CH2-CH3', 1], ['propil', 'CH3-CH2-CH2', 'CH2-CH2-CH3', 1],
    ['isopropil', '(CH3)2CH', 'CH(CH3)2', 2], ['terc-butil', '(CH3)3C', 'C(CH3)3', 3], ['2-hidroxietil', 'HOCH2-CH2', 'CH2-CH2OH', 1],
    ['sec-butil', 'CH3-CH2-CH(CH3)', 'CH(CH3)-CH2-CH3', 2]];
  const SMI_ALQ = { metil: 'C', etil: 'CC', propil: 'CCC', isopropil: 'C(C)C', 'terc-butil': 'C(C)(C)C', '2-hidroxietil': 'CCO', 'sec-butil': 'C(C)CC' };
  const CLASE = ['', 'primaria', 'secundaria', 'terciaria'];
  const piezasTexto = s => s.split(/(OH|NH2|NH|HO|N(?=\())/).filter(Boolean).map(x => (x === 'OH' || x === 'HO' ? { v: 'oh', t: x } : x === 'NH2' || x === 'NH' || x === 'N' ? { v: 'n', t: x } : x));
  const VAR_AM = { n: { nombre: 'nitrógeno de la amina', color: 'd' }, oh: VARIABLES.oh };
  function tipoAmina(rng, semilla) {
    const k = rng.entero(1, 3), gs = Array.from({ length: k }, () => rng.elegir(k > 2 ? ALQ.filter(g => g[0] !== 'sec-butil') : ALQ));
    if (k === 1 && gs[0][3] < 2 && rng.sig() < 0.6) return null; // más primarias con C secundario o terciario
    const hN = 3 - k;
    let semi;
    if (k === 1) semi = gs[0][1] + '-NH2';
    else if (k === 2) semi = gs[0][1] + '-NH-' + gs[1][2];
    else semi = gs[0][1] + '-N(' + gs[2][2] + ')-' + gs[1][2];
    const smiles = 'N' + gs.map((g, i) => (i < k - 1 ? `(${SMI_ALQ[g[0]]})` : SMI_ALQ[g[0]])).join('');
    const correcta = CLASE[k], err = [];
    const porC = k === 1 ? CLASE[gs[0][3]] : null;
    if (porC && porC !== correcta) err.push({ ...H('AQ-amina-como-alcohol', `Clasificaste por el carbono que lleva el N, como en los alcoholes (ese C tiene ${gs[0][3]} carbonos vecinos). En las aminas se cuenta cuántos carbonos tiene unidos el N.`), clave: 'am:' + porC, texto: 'amina ' + porC });
    const porH = hN === 2 ? 'secundaria' : hN === 1 ? 'primaria' : null;
    if (porH && porH !== correcta) err.push({ ...H('AQ-amina-por-hidrogenos', `Contaste los H del nitrógeno (${hN}) en vez de los carbonos unidos a él (${k}).`), clave: 'am:' + porH, texto: 'amina ' + porH });
    for (const c of [1, 2, 3]) if (CLASE[c] !== correcta) err.push({ ...H('AQ-amina-cuenta-mal', `Cuenta los carbonos unidos directamente al N: son ${k}. Los demás carbonos de cada grupo no cuentan.`), clave: 'am:' + CLASE[c], texto: 'amina ' + CLASE[c] });
    err.push({ ...INF('FO3-amina-por-amida', 'Una amida tiene el N unido a un C=O (–CO–NH₂). Aquí el N solo está unido a carbonos con enlaces simples y a H: es una amina.'), clave: 'am:amida', texto: 'amida (N unido a un C=O)' });
    const vistos = new Set(), errores = err.filter(e => !vistos.has(e.clave) && vistos.add(e.clave));
    if (semi.length > 38) return null;
    const piezas = piezasTexto(semi);
    return cerrar(rng, semilla, {
      enunciado: ['Observa la molécula ', ...partes(piezas), '.'], pregunta: ['¿Qué clase de compuesto nitrogenado es?'],
      correcta: { clave: 'am:' + correcta, texto: 'amina ' + correcta }, errores,
      solucion: [['La clase de una amina la da cuántos carbonos están unidos al ', v('n', 'N'), ' (no el carbono que lo lleva): 1 primaria, 2 secundaria, 3 terciaria.'],
        [`Aquí el N está unido a ${k} carbono${k > 1 ? 's' : ''} (${gs.map(g => g[0]).join(', ')}) y tiene ${hN} H: amina ${correcta}.`]],
      variables: VAR_AM, _datos: { tipo: 'amina', semi, smiles, grupos: gs.map(g => g[0]) },
    });
  }

  // ---- éster: ácido y alcohol de origen ----
  const ACIDOS = ['', 'ácido metanoico', 'ácido etanoico', 'ácido propanoico', 'ácido butanoico', 'ácido pentanoico', 'ácido hexanoico'];
  const ALC_LIN = ['', 'metanol', 'etanol', 'propan-1-ol', 'butan-1-ol', 'pentan-1-ol', 'hexan-1-ol'];
  // [nombre, C, alcohol, alcohol isómero de error, izquierda, derecha]
  const ALCOXI = [['metil', 1, 'metanol', null, 'CH3', 'CH3'], ['etil', 2, 'etanol', null, 'CH3-CH2', 'CH2-CH3'],
    ['propil', 3, 'propan-1-ol', 'propan-2-ol', 'CH3-CH2-CH2', 'CH2-CH2-CH3'], ['isopropil', 3, 'propan-2-ol', 'propan-1-ol', '(CH3)2CH', 'CH(CH3)2'],
    ['butil', 4, 'butan-1-ol', 'butan-2-ol', 'CH3-CH2-CH2-CH2', 'CH2-CH2-CH2-CH3'], ['sec-butil', 4, 'butan-2-ol', 'butan-1-ol', 'CH3-CH2-CH(CH3)', 'CH(CH3)-CH2-CH3'],
    ['isobutil', 4, '2-metilpropan-1-ol', 'butan-1-ol', '(CH3)2CH-CH2', 'CH2-CH(CH3)2']];
  const SMI_ALC = { metil: 'C', etil: 'CC', propil: 'CCC', isopropil: 'C(C)C', butil: 'CCCC', 'sec-butil': 'C(C)CC', isobutil: 'CC(C)C' };
  function tipoEster(rng, semilla) {
    const na = rng.entero(1, 5), R = rng.elegir(ALCOXI), alReves = rng.sig() < 0.4;
    const acil = na === 1 ? '' : Array.from({ length: na - 1 }, (_, i) => (i === 0 ? 'CH3' : 'CH2')).join('-');
    const acilRev = na === 1 ? '' : Array.from({ length: na - 1 }, (_, i) => (i === na - 2 ? 'CH3' : 'CH2')).join('-');
    let semi;
    if (!alReves) semi = (na === 1 ? 'HCOO' : acil + '-COO') + '-' + R[5];
    else semi = R[4] + '-' + (na === 1 ? 'OOCH' : 'OOC-' + acilRev);
    const smiles = (na === 1 ? '' : 'C'.repeat(na - 1)) + 'C(=O)O' + SMI_ALC[R[0]];
    const par = (a, b) => ({ clave: `es:${a}|${b}`, texto: `${a} y ${b}` });
    const correcta = par(ACIDOS[na], R[2]), err = [];
    const iso = R[3] ? par(ACIDOS[na], R[3]) : null, cruce = ACIDOS[R[1]] && ALC_LIN[na] ? par(ACIDOS[R[1]], ALC_LIN[na]) : null;
    if (cruce && (!iso || cruce.texto !== iso.texto)) err.push({ ...H('AQ-ester-partes-cruzadas', 'Cruzaste las partes. El ácido es el lado del C=O (R–CO–), con todos sus carbonos; el alcohol es el grupo unido al O del puente (–O–R′).'), ...cruce });
    if (na >= 2 && ALC_LIN[R[1] + 1]) err.push({ ...H('AQ-ester-carbonilo-al-alcohol', 'Le diste al alcohol el carbono del C=O. Ese carbono es del ácido: el éster R–CO–O–R′ sale de R–COOH y de H–O–R′.'), ...par(ACIDOS[na - 1], ALC_LIN[R[1] + 1]) });
    if (iso) err.push({ ...H('AQ-ester-alcohol-isomero', R[0] === 'isobutil' ? 'El isobutil es ramificado, (CH₃)₂CH–CH₂–: su alcohol es 2-metilpropan-1-ol, no el butan-1-ol de cadena recta.'
      : `El grupo unido al O es ${R[0]}: el alcohol es ${R[2]}, con el –OH en el carbono que estaba unido al O, no ${R[3]}.`), ...iso });
    err.push({ ...INF('FO3-ester-por-eter', 'Leíste el éster como un éter, R–O–R′, que se arma con dos alcoholes. El éster tiene un C=O junto al O del puente: sale de un ácido y un alcohol.'), clave: `es:eter:${na}|${R[2]}`, texto: ALC_LIN[na] === R[2] ? `dos moléculas de ${R[2]}` : `${ALC_LIN[na]} y ${R[2]}` });
    if (R[1] >= 2) err.push({ ...H('AQ-ester-alcohol-corto', 'Al alcohol le faltó un carbono: todo el grupo unido al O del puente pasa al alcohol.'), ...par(ACIDOS[na], ALC_LIN[R[1] - 1]) });
    if (na <= 4 && R[1] >= 2) err.push({ ...H('AQ-ester-acido-largo', 'Al ácido le sumaste un carbono del otro lado: el ácido termina en el C=O; lo que está pasando el O del puente es del alcohol.'), ...par(ACIDOS[na + 1], ALC_LIN[R[1] - 1]) });
    const vistos = new Set([correcta.clave, correcta.texto]), errores = err.filter(e => !vistos.has(e.clave) && !vistos.has(e.texto) && vistos.add(e.clave) && vistos.add(e.texto));
    if (errores.length < 3) return null;
    // El C=O del puente va con el color del carbonilo.
    const piezas = semi.split(/(COO|OOC)/).filter(Boolean).flatMap(x => (x === 'COO' ? [{ v: 'co', t: 'CO' }, 'O'] : x === 'OOC' ? ['O', { v: 'co', t: 'OC' }] : [x]));
    return cerrar(rng, semilla, {
      enunciado: ['Un éster tiene la fórmula ', ...partes(piezas), '.'], pregunta: ['¿De qué ácido y de qué alcohol se obtiene por esterificación?'],
      correcta, errores: errores.slice(0, 4),
      solucion: [['Ácido + alcohol → éster + agua: R–', v('cooh', 'COOH'), ' + H–', v('oh', 'O'), '–R′ → R–', v('co', 'CO'), '–O–R′ + H₂O.'],
        ['La parte del ácido es el lado del ', v('co', 'C=O'), `, con ${na} carbono${na > 1 ? 's' : ''} contando el del C=O: ${ACIDOS[na]}.`],
        [`La parte del alcohol es el grupo unido al O del puente (${R[0]}): ${R[2]}.`]],
      _datos: { tipo: 'ester', semi, smiles, acido: ACIDOS[na], alcohol: R[2] },
    });
  }

  // ---- oxidación: alcano → alcohol → aldehído → ácido ----
  function secuencia(sub, n) {
    if (sub === 'dos') {
      const raiz = RAIZ[n], mid = n === 3 ? '-CH2-' : '-';
      return { nombres: [`${raiz}ano`, `${raiz}ano-1,${n}-diol`, `${raiz}anodial`, `ácido ${raiz}anodioico`],
        semis: [`CH3${mid}CH3`, `HOCH2${mid}CH2OH`, `OHC${mid}CHO`, `HOOC${mid}COOH`], H: [3, 2, 1, 0], Oe: [0, 1, 2, 3], hib: ['sp3', 'sp3', 'sp2', 'sp2'], nC: n };
    }
    const raiz = RAIZ[n], cola = n === 1 ? '' : 'CH3-' + 'CH2-'.repeat(n - 2);
    const semis = n === 1 ? ['CH4', 'CH3OH', 'HCHO', 'HCOOH'] : [cola + 'CH3', cola + 'CH2OH', cola + 'CHO', cola + 'COOH'];
    const nombres = [`${raiz}ano`, n <= 2 ? `${raiz}anol` : `${raiz}an-1-ol`, `${raiz}anal`, `ácido ${raiz}anoico`];
    return { nombres, semis, H: n === 1 ? [4, 3, 2, 1] : [3, 2, 1, 0], Oe: [0, 1, 2, 3], hib: ['sp3', 'sp3', 'sp2', 'sp2'], nC: n };
  }
  // Número de oxidación del C del extremo: +enlaces a O, −H. Con C=O contado como +1 (error): Oe1.
  const eoDe = (S, j) => S.Oe[j] - S.H[j];
  const fmtEO = x => (x > 0 ? '+' + x : x < 0 ? '−' + Math.abs(x) : '0');
  const HIB = { sp3: 'sp³', sp2: 'sp²', sp: 'sp' };
  const VAR_OX = { c: { nombre: 'carbono que se oxida', color: 'd' } };
  function tipoOxidacion(rng, semilla) {
    const sub = rng.sig() < 0.3 ? 'dos' : 'terminal', n = sub === 'dos' ? rng.elegir([2, 3]) : rng.elegir([1, 2, 2, 3, 4]);
    const S = secuencia(sub, n), paso = rng.elegir(['estado', 'estado', 'cambio', 'serie']);
    const linea = [];
    S.semis.forEach((s, j) => { if (j) linea.push(' → '); linea.push({ t: pantalla(s), formula: true }, ` (${S.nombres[j]})`); });
    const enunciado = [`En una secuencia de oxidación, la molécula pasa de alcano a ácido; ${sub === 'dos' ? 'se oxidan los dos carbonos de los extremos' : n === 1 ? 'se oxida su único carbono' : 'se oxida el carbono del extremo'}: `, ...linea, '.'];
    const eo = S.Oe.map((o, j) => o - S.H[j]);
    const regla = ['Número de oxidación de un carbono: +1 por cada enlace a O (un C=O cuenta +2), −1 por cada H y 0 por cada enlace a otro C.'];
    const promedio = j => { // promedio de todos los C (solo la secuencia de un extremo con n ≥ 2)
      if (sub === 'dos' || n === 1) return null;
      const otros = (n - 2) * (-2) + (-3); return (otros + eo[j]) / n;
    };
    if (paso === 'estado') {
      const j = rng.entero(1, 3), c = { e: eo[j], h: S.hib[j] };
      const op = (e, h) => ({ clave: `eo:${e}:${h}`, texto: `${fmtEO(e)} y ${HIB[h]}` });
      const err = [];
      if (j === 3) err.push({ ...H('AQ-carboxilo-sp3', 'El carbono del –COOH tiene un doble enlace C=O: es sp², no sp³. Que también lleve un –OH no cambia eso.'), ...op(c.e, 'sp3') });
      if (j === 2) err.push({ ...H('AQ-aldehido-sp', 'Un carbono con un solo doble enlace (C=O) es sp²; sp es para un triple enlace o dos dobles.'), ...op(c.e, 'sp') });
      if (j === 1) err.push({ ...H('AQ-oh-da-sp2', 'El –OH se une con un enlace simple: el carbono sigue con cuatro enlaces simples, sp³. El sp² aparece recién con el C=O.'), ...op(c.e, 'sp2') });
      if (j >= 2) { const e1 = S.Oe[j] - (j === 3 ? 1 : 1) - S.H[j]; err.push({ ...H('AQ-doble-enlace-cuenta-uno', 'Contaste el C=O como un solo enlace al oxígeno. Un doble enlace C=O suma +2 al número de oxidación del carbono.'), ...op(e1, c.h) }); }
      if (c.e !== 0) err.push({ ...H('AQ-signo-del-estado', 'Cambiaste el signo: el O es más electronegativo que el C y le quita electrones (+1 por enlace); el H es menos electronegativo y le da (−1 por cada H).'), ...op(-c.e, c.h) });
      err.push({ ...H('AQ-estado-del-paso-anterior', 'Ese es el número de oxidación del compuesto anterior de la secuencia: en cada paso el carbono se oxida y su número sube 2.'), ...op(eo[j - 1], c.h) });
      const pr = promedio(j);
      if (pr !== null && Number.isInteger(pr)) err.push({ ...H('AQ-estado-promedio', 'Ese es el promedio de todos los carbonos de la molécula. Se pregunta por el carbono que se oxida, el del grupo funcional.'), ...op(pr, c.h) });
      err.push({ ...H('AQ-hibridacion-por-atomos', `Para la hibridación mira los enlaces del carbono: ${c.h === 'sp2' ? 'un doble enlace C=O da sp²' : 'cuatro enlaces simples dan sp³'}.`), ...op(c.e, c.h === 'sp2' ? 'sp3' : 'sp2') });
      const vistos = new Set(), errores = err.filter(e => !vistos.has(e.clave) && vistos.add(e.clave) && e.clave !== `eo:${c.e}:${c.h}`);
      return cerrar(rng, semilla, {
        enunciado, pregunta: [`En el ${S.nombres[j]}, ¿qué número de oxidación e hibridación tiene `, v('c', sub === 'dos' ? 'cada carbono de los extremos' : 'el carbono que se oxida'), '?'],
        correcta: op(c.e, c.h), errores: rng.barajar(errores).slice(0, 4),
        solucion: [regla, [`En el ${S.nombres[j]}, `, v('c', 'el carbono'), ` tiene ${S.Oe[j] === 3 ? 'un C=O y un –OH (+3)' : S.Oe[j] === 2 ? 'un C=O (+2)' : 'un –OH (+1)'}, ${S.H[j] ? `${S.H[j]} H (−${S.H[j]})` : 'ningún H'}${n > 1 || sub === 'dos' ? ' y un C (0)' : ''}: ${fmtEO(c.e)}.`],
          [`Hibridación: ${c.h === 'sp2' ? 'con un doble enlace C=O es sp²' : 'con cuatro enlaces simples es sp³'}.`]],
        variables: VAR_OX, convenciones: ['hibridacion'], _datos: { tipo: 'oxidacion', sub, n, paso, j, secuencia: S.semis },
      });
    }
    if (paso === 'cambio') {
      const op = j => ({ clave: `hib:${j}`, texto: j === 0 ? 'en ningún paso: sigue sp³ hasta el ácido' : `de ${S.nombres[j - 1]} a ${S.nombres[j]}` });
      const errores = [
        { ...H('AQ-oh-da-sp2', 'Al pasar de alcano a alcohol el carbono gana un –OH con enlace simple: sigue sp³. El doble enlace C=O aparece en el aldehído.'), ...op(1) },
        { ...H('AQ-sp2-recien-en-acido', 'El aldehído ya tiene el C=O: su carbono ya es sp². En el ácido sigue sp² (C=O más –OH).'), ...op(3) },
        { ...H('AQ-carboxilo-sp3', 'El carbono del aldehído y el del –COOH tienen un doble enlace C=O: son sp², no sp³.'), ...op(0) },
      ];
      return cerrar(rng, semilla, {
        enunciado, pregunta: ['¿En qué paso ', v('c', sub === 'dos' ? 'los carbonos de los extremos dejan' : 'el carbono que se oxida deja'), ' de ser sp³?'],
        correcta: op(2), errores,
        solucion: [['Un carbono con cuatro enlaces simples es sp³; con un doble enlace, sp².'],
          [`Alcano y alcohol: solo enlaces simples (sp³). Aldehído y ácido: un C=O (sp²). El cambio ocurre de ${S.nombres[1]} a ${S.nombres[2]}.`]],
        variables: VAR_OX, convenciones: ['hibridacion'], _datos: { tipo: 'oxidacion', sub, n, paso, secuencia: S.semis },
      });
    }
    // serie
    const op = a => ({ clave: 'serie:' + a.join(','), texto: a.map(fmtEO).join('; ') });
    const uno = S.Oe.map((o, j) => (j >= 2 ? o - 1 : o) - S.H[j]);
    const err = [
      { ...H('AQ-signo-del-estado', 'Cambiaste el signo: cada enlace a O suma +1 y cada H resta 1, porque el O es más electronegativo que el C y el H menos.'), ...op(eo.map(x => -x)) },
      { ...H('AQ-doble-enlace-cuenta-uno', 'Contaste el C=O como un solo enlace al oxígeno: un doble enlace C=O suma +2.'), ...op(uno) },
      { ...H('AQ-un-electron-por-paso', 'En cada paso el carbono pierde dos electrones (gana un enlace a O y pierde un H, o cambia un H por el segundo enlace del C=O): el número sube de 2 en 2.'), ...op(eo.map((x, j) => eo[0] + j)) },
    ];
    if (promedio(0) !== null) err.unshift({ ...H('AQ-estado-promedio', 'Ese es el promedio de todos los carbonos de cada molécula. Se pregunta por el carbono que se oxida.'), ...op([0, 1, 2, 3].map(promedio)) });
    err.push({ ...H('AQ-cuenta-solo-oxigenos', 'Contaste solo los enlaces a O y olvidaste restar los H.'), ...op(S.Oe) });
    const vistos = new Set([op(eo).clave]), errores = err.filter(e => e.texto.indexOf('NaN') < 0 && !e.texto.includes('.') && !vistos.has(e.clave) && vistos.add(e.clave));
    return cerrar(rng, semilla, {
      enunciado, pregunta: ['¿Qué números de oxidación tiene ', v('c', sub === 'dos' ? 'cada carbono de los extremos' : 'el carbono que se oxida'), ' en los cuatro compuestos, en orden?'],
      correcta: op(eo), errores: errores.slice(0, 4),
      solucion: [regla, [`Alcano ${fmtEO(eo[0])}, alcohol ${fmtEO(eo[1])}, aldehído ${fmtEO(eo[2])}, ácido ${fmtEO(eo[3])}: sube 2 en cada paso (el carbono pierde 2 electrones).`]],
      variables: VAR_OX, _datos: { tipo: 'oxidacion', sub, n, paso, secuencia: S.semis },
    });
  }

  const TIPOS = { nombre: tipoNombre, cadena: tipoCadena, sufijo: tipoSufijo, amina: tipoAmina, ester: tipoEster, oxidacion: tipoOxidacion };
  const PESOS = ['nombre', 'nombre', 'nombre', 'nombre', 'nombre', 'nombre', 'nombre', 'nombre', 'cadena', 'cadena', 'sufijo', 'sufijo',
    'amina', 'amina', 'ester', 'ester', 'oxidacion', 'oxidacion', 'oxidacion'];
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const t = rng.elegir(PESOS);
    for (let i = 0; i < 400; i++) {
      const p = TIPOS[t](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error(`No se pudo generar un problema de tipo ${t}`);
  }

  return { id: ID, titulo: 'Ponle nombre: moléculas con varios grupos', generar, nombrar, plan, valido, rasgos, escribir, nombrarAnillo,
    smilesPlan, semiPlan, ascii, secuencia };
});
