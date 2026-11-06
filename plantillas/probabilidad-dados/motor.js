/*
 * Motor de «La tabla de los dos dados: conteo y probabilidad».
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorDados; antes hay que cargar nucleo/azar.js) y en
 * Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Las probabilidades son fracciones exactas { num, den, texto, valor } hechas con enteros: 11/36 es
 * 11/36, no 0,30555… Los conteos grandes se rechazan si pasan de Number.MAX_SAFE_INTEGER.
 *
 *   fraccion(num, den), sumar, restar, multiplicar, dividir, comparar   aritmética de fracciones
 *   espacio({ dados, caras, monedas })            el espacio muestral: cada resultado es una lista
 *                                                  (primero los dados, 1 a caras; luego las monedas, 'cara' o 'sello')
 *   cumple(evento, resultado, cfg)                si un resultado está en el evento (formato de eventos abajo)
 *   probabilidad(cfg, evento)                     casos favorables / casos posibles, con las casillas, los grupos
 *                                                  sin orden y los 'errores' (AR17, AR20)
 *   union(cfg, A, B), interseccion(cfg, A, B), complemento(cfg, A), condicional(cfg, A, B), independientes(cfg, A, B)
 *   distribucionSuma({ dados, caras })            cuántas maneras da cada suma
 *   multiplicacion([n1, n2, …]), adicion([n1, n2, …])   principios de conteo
 *   factorial(n), permutaciones(n), variaciones(n, k), variacionesConRepeticion(n, k),
 *   permutacionesCirculares(n), permutacionesConRepeticion([a, b, …]), combinaciones(n, k),
 *   combinacionesConRepeticion(n, k)              fórmulas
 *   enumerarVariaciones(lista, k, repetir), enumerarCombinaciones(lista, k), enumerarCirculares(lista),
 *   enumerarPermutaciones(lista)                  las mismas cuentas hechas listando (las pruebas comprueban que coinciden)
 *   comite({ n, k }), comiteConGrupos({ grupos, k, condicion, separados })   comités, con y sin restricciones
 *   clave({ simbolos, largo, repetir }), placa({ letras, digitos, alfabeto }), circular(n), anagramas(palabra)
 *   alMenosUno({ dados, valor, caras }), secuenciaMoneda(secuencia), siguiente({ historia, valor, caras })
 *   cumpleanos({ n, dias }), curvaCumpleanos(max, dias)
 *   tirada({ semilla, dados, caras, cuadros })    la animación de un lanzamiento: caras, giro y salto por cuadro
 *   simular({ dados, caras, lanzamientos, semilla })       lanzamientos con semilla y frecuencias de cada suma
 *   simularEvento({ cfg, evento, lanzamientos, semilla })  frecuencia relativa de un evento
 *   despuesDeRacha({ largo, valor, lanzamientos, semilla }) qué sale justo después de una racha
 *   simularCumpleanos({ n, salones, semilla, dias })
 *   sortearPlaca({ semilla, letras, digitos })     una placa al azar, con los cuadros de su animación
 *
 * Eventos (objetos JSON, para que casos.json los pueda escribir):
 *   { tipo:'suma' | 'producto' | 'diferencia', op, valor }     op: '=', '!=', '<', '<=', '>', '>=', 'multiplo', 'par', 'impar', 'primo'
 *   { tipo:'dado', i, op, valor }                              el dado i (0 = rojo, 1 = azul, 2 = café)
 *   { tipo:'alMenosUno' | 'todos' | 'ninguno', op, valor }     cuántos dados cumplen op/valor
 *   { tipo:'exactamente', cuantos, op, valor }
 *   { tipo:'iguales' } | { tipo:'distintos' }
 *   { tipo:'valores', valores:[5, 6] }                         esos valores sin importar el orden ("un 5 y un 6")
 *   { tipo:'caras', op, valor }                                cuántas monedas salen cara
 *   { tipo:'secuencia', valores:['cara', 'sello', …] }         las monedas en ese orden exacto
 *   { tipo:'y' | 'o', eventos:[…] } | { tipo:'no', evento }
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores' con lo que dan los errores
 * típicos de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (AR17 a AR22).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Azar = nodo ? require('../../nucleo/azar.js') : root.Azar;
  const motor = fabrica(Azar);
  if (nodo) module.exports = motor;
  else root.MotorDados = motor;
})(typeof self !== 'undefined' ? self : this, function (Azar) {
  'use strict';

  // ---------- Enteros y fracciones exactas ----------
  function entero(x, que, o) {
    o = o || {};
    if (!Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser a lo más ${o.max}`);
    return x;
  }
  function seguro(x, que) {
    if (!Number.isSafeInteger(x)) throw new Error(`${que || 'el conteo'} es demasiado grande para contarlo exacto`);
    return x;
  }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function fraccion(num, den) {
    if (den === undefined) den = 1;
    seguro(num, 'el numerador'); seguro(den, 'el denominador');
    if (den === 0) throw new Error('el denominador no puede ser cero');
    if (den < 0) { num = -num; den = -den; }
    const g = mcd(num, den) || 1;
    num = num / g + 0; den = den / g;
    return { num, den, texto: den === 1 ? String(num) : `${num}/${den}`, valor: num / den };
  }
  const fr = x => (typeof x === 'number' ? fraccion(x, 1) : x);
  const sumar = (a, b) => { a = fr(a); b = fr(b); const g = mcd(a.den, b.den); return fraccion(a.num * (b.den / g) + b.num * (a.den / g), seguro(a.den / g * b.den)); };
  const restar = (a, b) => { b = fr(b); return sumar(a, fraccion(-b.num, b.den)); };
  const multiplicar = (a, b) => { a = fr(a); b = fr(b); const g1 = mcd(a.num, b.den) || 1, g2 = mcd(b.num, a.den) || 1; return fraccion(seguro((a.num / g1) * (b.num / g2)), seguro((a.den / g2) * (b.den / g1))); };
  const dividir = (a, b) => { b = fr(b); if (b.num === 0) throw new Error('no se puede dividir entre cero'); return multiplicar(a, fraccion(b.den, b.num)); };
  const potencia = (a, n) => { let r = fraccion(1); for (let i = 0; i < n; i++) r = multiplicar(r, a); return r; };
  // −1, 0 o 1, sin pasar por decimales
  const comparar = (a, b) => { a = fr(a); b = fr(b); const d = a.num * b.den - b.num * a.den; return d < 0 ? -1 : d > 0 ? 1 : 0; };

  // ---------- Espacio muestral ----------
  function config(cfg) {
    cfg = cfg || {};
    const dados = entero(cfg.dados === undefined ? 2 : cfg.dados, 'el número de dados', { min: 0, max: 6 });
    const caras = entero(cfg.caras === undefined ? 6 : cfg.caras, 'el número de caras', { min: 2, max: 20 });
    const monedas = entero(cfg.monedas || 0, 'el número de monedas', { min: 0, max: 12 });
    if (dados + monedas === 0) throw new Error('hace falta al menos un dado o una moneda');
    if (Math.pow(caras, dados) * Math.pow(2, monedas) > 200000) throw new Error('el espacio muestral es demasiado grande para listarlo');
    return { dados, caras, monedas };
  }
  function espacio(cfg) {
    const c = config(cfg);
    let res = [[]];
    for (let i = 0; i < c.dados; i++) { const n = []; for (const r of res) for (let v = 1; v <= c.caras; v++) n.push(r.concat(v)); res = n; }
    for (let i = 0; i < c.monedas; i++) { const n = []; for (const r of res) for (const v of ['cara', 'sello']) n.push(r.concat(v)); res = n; }
    return { resultados: res, total: res.length, cfg: c };
  }

  const PRIMOS = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]);
  function cmp(x, op, v) {
    switch (op || '=') {
      case '=': return x === v;
      case '!=': return x !== v;
      case '<': return x < v;
      case '<=': return x <= v;
      case '>': return x > v;
      case '>=': return x >= v;
      case 'multiplo': return x % v === 0;
      case 'par': return x % 2 === 0;
      case 'impar': return x % 2 !== 0;
      case 'primo': return PRIMOS.has(x);
      default: throw new Error(`operación desconocida: ${op}`);
    }
  }
  function cumple(ev, r, cfg) {
    const c = config(cfg), d = r.slice(0, c.dados), m = r.slice(c.dados);
    const cuantos = () => d.filter(x => cmp(x, ev.op, ev.valor)).length;
    switch (ev.tipo) {
      case 'suma': return cmp(d.reduce((a, b) => a + b, 0), ev.op, ev.valor);
      case 'producto': return cmp(d.reduce((a, b) => a * b, 1), ev.op, ev.valor);
      case 'diferencia': return cmp(Math.max(...d) - Math.min(...d), ev.op, ev.valor);
      case 'dado': if (!(ev.i >= 0 && ev.i < c.dados)) throw new Error('ese dado no existe'); return cmp(d[ev.i], ev.op, ev.valor);
      case 'alMenosUno': return cuantos() >= 1;
      case 'todos': return cuantos() === d.length;
      case 'ninguno': return cuantos() === 0;
      case 'exactamente': return cuantos() === ev.cuantos;
      case 'iguales': return d.every(x => x === d[0]);
      case 'distintos': return new Set(d).size === d.length;
      case 'valores': { const a = d.slice().sort((x, y) => x - y), b = ev.valores.slice().sort((x, y) => x - y); return a.length === b.length && a.every((x, k) => x === b[k]); }
      case 'caras': return cmp(m.filter(x => x === 'cara').length, ev.op, ev.valor);
      case 'secuencia': { const s = c.monedas ? m : d; return s.length === ev.valores.length && s.every((x, k) => x === ev.valores[k]); }
      case 'y': return ev.eventos.every(e => cumple(e, r, c));
      case 'o': return ev.eventos.some(e => cumple(e, r, c));
      case 'no': return !cumple(ev.evento, r, c);
      default: throw new Error(`evento desconocido: ${ev && ev.tipo}`);
    }
  }

  // Los resultados sin orden (multiconjuntos): (1, 2) y (2, 1) en un mismo grupo.
  const claveGrupo = r => r.slice().sort((x, y) => (typeof x === 'number' ? x - y : String(x).localeCompare(String(y)))).join(',');

  function probabilidad(cfg, ev) {
    const E = espacio(cfg), c = E.cfg;
    const casillas = E.resultados.filter(r => cumple(ev, r, c));
    const p = fraccion(casillas.length, E.total);
    // grupos sin orden: cada uno con cuántos órdenes trae
    const grupos = new Map(), todos = new Set();
    for (const r of E.resultados) todos.add(claveGrupo(r));
    for (const r of casillas) { const k = claveGrupo(r); grupos.set(k, (grupos.get(k) || 0) + 1); }
    const listaGrupos = [...grupos].map(([k, n]) => ({ valores: k.split(',').map(x => (isNaN(+x) ? x : +x)), ordenes: n }));
    const errores = {
      // AR17: contar (1, 2) y (2, 1) como uno solo, sobre los resultados sin orden (21 con dos dados)
      sinOrden: fraccion(grupos.size, todos.size),
      // AR17: contar los grupos favorables sin orden, pero sobre los 36 casos con orden
      sinOrdenSobreTotal: fraccion(grupos.size, E.total),
    };
    if (ev.tipo === 'suma' && (ev.op || '=') === '=' && c.dados >= 2 && !c.monedas) {
      // AR20: todas las sumas igual de probables (de 2 a 12 hay 11)
      errores.sumasEquiprobables = fraccion(1, c.dados * (c.caras - 1) + 1);
    }
    if (ev.tipo === 'alMenosUno' && !c.monedas) {
      const uno = probabilidad({ dados: 1, caras: c.caras }, { tipo: 'dado', i: 0, op: ev.op, valor: ev.valor }).p;
      errores.sumaProbabilidades = multiplicar(uno, c.dados);   // 1/6 + 1/6 = 2/6
    }
    return { favorables: casillas.length, total: E.total, p, texto: p.texto, valor: p.valor, casillas, grupos: listaGrupos,
      gruposTotal: todos.size, errores };
  }
  function union(cfg, A, B) {
    const pA = probabilidad(cfg, A), pB = probabilidad(cfg, B), y = probabilidad(cfg, { tipo: 'y', eventos: [A, B] }), o = probabilidad(cfg, { tipo: 'o', eventos: [A, B] });
    return { p: o.p, favorables: o.favorables, total: o.total, pA: pA.p, pB: pB.p, pAyB: y.p, excluyentes: y.favorables === 0,
      errores: { sumaDirecta: sumar(pA.p, pB.p) } };  // olvidar restar la intersección
  }
  function interseccion(cfg, A, B) { const y = probabilidad(cfg, { tipo: 'y', eventos: [A, B] }); return { p: y.p, favorables: y.favorables, total: y.total }; }
  function complemento(cfg, A) { const pA = probabilidad(cfg, A); return { p: restar(1, pA.p), pA: pA.p, favorables: pA.total - pA.favorables, total: pA.total }; }
  function condicional(cfg, A, B) {
    const y = probabilidad(cfg, { tipo: 'y', eventos: [A, B] }), pB = probabilidad(cfg, B), pA = probabilidad(cfg, A);
    if (!pB.favorables) throw new Error('la condición no puede ser imposible');
    return { p: fraccion(y.favorables, pB.favorables), favorables: y.favorables, total: pB.favorables,
      errores: { conjunta: y.p, transpuesta: fraccion(y.favorables, pA.favorables || 1), sinCondicion: pA.p } };
  }
  function independientes(cfg, A, B) {
    const pA = probabilidad(cfg, A).p, pB = probabilidad(cfg, B).p, pAyB = interseccion(cfg, A, B).p, prod = multiplicar(pA, pB);
    return { independientes: comparar(pAyB, prod) === 0, pA, pB, pAyB, producto: prod };
  }
  function distribucionSuma(cfg) {
    const c = config(Object.assign({ dados: 2 }, cfg, { monedas: 0 })), min = c.dados, max = c.dados * c.caras;
    const maneras = {}; for (let s = min; s <= max; s++) maneras[s] = 0;
    for (const r of espacio(c).resultados) maneras[r.reduce((a, b) => a + b, 0)]++;
    const total = Math.pow(c.caras, c.dados), p = {};
    for (const s in maneras) p[s] = fraccion(maneras[s], total);
    let moda = min; for (let s = min; s <= max; s++) if (maneras[s] > maneras[moda]) moda = s;
    return { maneras, total, p, min, max, moda, sumas: max - min + 1 };
  }

  // ---------- Conteo ----------
  const multiplicacion = etapas => seguro(etapas.reduce((a, n) => a * entero(n, 'cada etapa', { min: 0 }), 1));
  const adicion = casos => seguro(casos.reduce((a, n) => a + entero(n, 'cada caso', { min: 0 }), 0));
  function factorial(n) { entero(n, 'n', { min: 0, max: 18 }); let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  const permutaciones = n => factorial(n);
  function variaciones(n, k) {
    entero(n, 'n', { min: 0 }); entero(k, 'k', { min: 0 });
    if (k > n) return 0;
    let r = 1; for (let i = 0; i < k; i++) r = seguro(r * (n - i), 'V(n, k)'); return r;
  }
  function variacionesConRepeticion(n, k) { entero(n, 'n', { min: 0 }); entero(k, 'k', { min: 0 }); return seguro(Math.pow(n, k), 'nᵏ'); }
  function permutacionesCirculares(n) { entero(n, 'n', { min: 1 }); return factorial(n - 1); }
  function permutacionesConRepeticion(cuantas) {
    const n = cuantas.reduce((a, b) => a + entero(b, 'cada repetición', { min: 0 }), 0);
    // n!/(a!·b!·…) sin pasar por n! completo: producto de combinaciones
    let r = 1, quedan = n; for (const a of cuantas) { r = seguro(r * combinaciones(quedan, a)); quedan -= a; }
    return r;
  }
  function combinaciones(n, k) {
    entero(n, 'n', { min: 0 }); entero(k, 'k', { min: 0 });
    if (k > n) return 0;
    k = Math.min(k, n - k);
    let r = 1; for (let i = 0; i < k; i++) r = seguro(r * (n - i), 'C(n, k)') / (i + 1);
    return r;
  }
  const combinacionesConRepeticion = (n, k) => combinaciones(n + k - 1, k);

  // ---------- Enumerar (para comprobar las fórmulas listando) ----------
  function enumerarVariaciones(lista, k, repetir) {
    const out = [];
    (function rec(pre, usados) {
      if (pre.length === k) { out.push(pre); return; }
      lista.forEach((x, i) => { if (repetir || !usados.has(i)) rec(pre.concat([x]), new Set(usados).add(i)); });
    })([], new Set());
    return out;
  }
  function enumerarCombinaciones(lista, k) {
    const out = [];
    (function rec(desde, pre) {
      if (pre.length === k) { out.push(pre); return; }
      for (let i = desde; i < lista.length; i++) rec(i + 1, pre.concat([lista[i]]));
    })(0, []);
    return out;
  }
  const enumerarPermutaciones = lista => enumerarVariaciones(lista, lista.length, false);
  // Arreglos alrededor de una mesa: dos son el mismo si uno es un giro del otro.
  function enumerarCirculares(lista) {
    const vistos = new Set(), out = [];
    for (const p of enumerarPermutaciones(lista)) {
      const giros = p.map((_, i) => p.slice(i).concat(p.slice(0, i)).join('|')).sort();
      if (!vistos.has(giros[0])) { vistos.add(giros[0]); out.push(p); }
    }
    return out;
  }
  const distintasListas = l => new Set(l.map(x => x.join('|'))).size;

  // ---------- Comités, claves, placas, mesas y anagramas ----------
  const NOMBRES = ['Gina', 'Hugo', 'Iris', 'Juan', 'Kati', 'Lalo', 'Mía', 'Noé', 'Olga', 'Pepe'];
  function comite(o) {
    const n = entero(o.n, 'el número de personas', { min: 1, max: 30 }), k = entero(o.k, 'el tamaño del comité', { min: 1, max: n });
    const C = combinaciones(n, k), V = variaciones(n, k);
    const r = { valor: C, ordenes: V, ordenesPorComite: factorial(k),
      errores: { variacion: V, conRepeticion: variacionesConRepeticion(n, k), producto: n * k } };
    if (n <= 10) {
      const gente = NOMBRES.slice(0, n), comites = enumerarCombinaciones(gente, k), ordenes = enumerarVariaciones(gente, k, false);
      // cada orden cae en el comité de sus mismas personas
      const de = ord => comites.findIndex(cm => cm.every(x => ord.includes(x)));
      Object.assign(r, { personas: gente, comites, listaOrdenes: ordenes.map(ord => ({ orden: ord, comite: de(ord) })), porEnumeracion: comites.length });
    }
    return r;
  }
  // grupos: [{ nombre, n }]; condicion: { grupo, exactos | alMenos | alMas }; separados: true si dos personas
  // determinadas (las dos primeras del primer grupo) no pueden ir juntas.
  function comiteConGrupos(o) {
    const grupos = o.grupos.map(g => ({ nombre: g.nombre, n: entero(g.n, `el grupo ${g.nombre}`, { min: 0 }) }));
    const N = grupos.reduce((a, g) => a + g.n, 0), k = entero(o.k, 'el tamaño del comité', { min: 1, max: N });
    const cond = o.condicion, gi = cond ? grupos.findIndex(g => g.nombre === cond.grupo) : -1;
    if (cond && gi < 0) throw new Error('ese grupo no existe');
    const vale = x => !cond || (cond.exactos !== undefined ? x === cond.exactos : cond.alMenos !== undefined ? x >= cond.alMenos : x <= cond.alMas);
    // fórmula: se reparte k entre los grupos (principio de adición de productos de combinaciones)
    const desglose = [];
    (function rec(i, quedan, pre) {
      if (i === grupos.length) { if (quedan === 0 && vale(gi >= 0 ? pre[gi] : 0)) desglose.push({ reparto: pre, formas: multiplicacion(pre.map((x, j) => combinaciones(grupos[j].n, x))) }); return; }
      for (let x = 0; x <= Math.min(quedan, grupos[i].n); x++) rec(i + 1, quedan - x, pre.concat(x));
    })(0, k, []);
    let valor = adicion(desglose.map(d => d.formas));
    if (o.separados) {
      // se restan los comités que cumplen la condición y llevan a las dos personas juntas
      const juntos = desglose.reduce((a, d) => {
        if (d.reparto[0] < 2) return a;
        return a + multiplicacion(d.reparto.map((x, j) => (j === 0 ? combinaciones(grupos[0].n - 2, x - 2) : combinaciones(grupos[j].n, x))));
      }, 0);
      valor -= juntos;
    }
    // enumeración: personas con etiqueta de grupo
    let porEnumeracion = null;
    if (N <= 16) {
      const gente = []; grupos.forEach((g, j) => { for (let t = 0; t < g.n; t++) gente.push({ g: j, id: `${j}-${t}` }); });
      porEnumeracion = enumerarCombinaciones(gente, k).filter(cm => {
        const cuenta = grupos.map((_, j) => cm.filter(p => p.g === j).length);
        if (!vale(gi >= 0 ? cuenta[gi] : 0)) return false;
        if (o.separados && cm.some(p => p.id === '0-0') && cm.some(p => p.id === '0-1')) return false;
        return true;
      }).length;
    }
    const errores = { sinRestriccion: combinaciones(N, k), variacion: valor * factorial(k) };
    if (cond && cond.alMenos === 1 && gi >= 0) errores.fijarUno = combinaciones(grupos[gi].n, 1) * combinaciones(N - 1, k - 1);   // fija "una" y elige el resto: cuenta de más
    if (cond && cond.exactos !== undefined && grupos.length === 2) {
      const otro = 1 - gi; errores.sumar = combinaciones(grupos[gi].n, cond.exactos) + combinaciones(grupos[otro].n, k - cond.exactos);   // suma en vez de multiplicar
    }
    return { valor, desglose, total: N, porEnumeracion, errores };
  }
  function clave(o) {
    const n = entero(o.simbolos === undefined ? 10 : o.simbolos, 'los símbolos', { min: 1 }), k = entero(o.largo, 'el largo', { min: 1 });
    const con = variacionesConRepeticion(n, k), sin = variaciones(n, k);
    const valor = o.repetir === false ? sin : con;
    return { valor, errores: { sinRepeticion: sin, conRepeticion: con, combinacion: combinaciones(n, k), suma: n * k } };
  }
  function placa(o) {
    const L = entero(o.letras === undefined ? 3 : o.letras, 'las letras', { min: 0 }), D = entero(o.digitos === undefined ? 3 : o.digitos, 'los dígitos', { min: 0 });
    const A = entero(o.alfabeto === undefined ? 26 : o.alfabeto, 'el alfabeto', { min: 1 });
    const etapas = Array(L).fill(A).concat(Array(D).fill(10));
    const parciales = []; etapas.reduce((a, n) => { const x = seguro(a * n); parciales.push(x); return x; }, 1);
    return { valor: multiplicacion(etapas), etapas, parciales,
      errores: { sinRepeticion: seguro(variaciones(A, L) * variaciones(10, D)), suma: variacionesConRepeticion(A, L) + variacionesConRepeticion(10, D),
        sinOrden: seguro(combinacionesConRepeticion(A, L) * combinacionesConRepeticion(10, D)), sinOrdenNiRepeticion: seguro(combinaciones(A, L) * combinaciones(10, D)) } };
  }
  function circular(n) {
    const r = { valor: permutacionesCirculares(n), errores: { lineal: factorial(n) } };
    if (n <= 7) r.porEnumeracion = enumerarCirculares(NOMBRES.slice(0, n)).length;
    return r;
  }
  function anagramas(palabra) {
    const letras = [...String(palabra).toUpperCase()];
    if (!letras.length) throw new Error('hace falta una palabra');
    const cuenta = {}; for (const l of letras) cuenta[l] = (cuenta[l] || 0) + 1;
    const r = { valor: permutacionesConRepeticion(Object.values(cuenta)), largo: letras.length, repetidas: cuenta,
      errores: { todasDistintas: factorial(letras.length) } };
    if (letras.length <= 8) r.porEnumeracion = distintasListas(enumerarPermutaciones(letras));
    return r;
  }

  // ---------- Probabilidades con nombre ----------
  function alMenosUno(o) {
    const n = entero(o.dados === undefined ? 2 : o.dados, 'los dados', { min: 1, max: 30 }), c = entero(o.caras === undefined ? 6 : o.caras, 'las caras', { min: 2 });
    const no = potencia(fraccion(c - 1, c), n), p = restar(1, no);
    return { p, texto: p.texto, valor: p.valor, ninguno: no,
      errores: { sumaProbabilidades: fraccion(n, c), todos: potencia(fraccion(1, c), n), unDado: fraccion(1, c),
        exactamenteUno: fraccion(seguro(n * Math.pow(c - 1, n - 1)), seguro(Math.pow(c, n))) } };
  }
  function secuenciaMoneda(sec) {
    const n = sec.length; if (!n || sec.some(x => x !== 'cara' && x !== 'sello')) throw new Error("la secuencia es de 'cara' y 'sello'");
    const caras = sec.filter(x => x === 'cara').length, p = fraccion(1, Math.pow(2, n));
    const comp = fraccion(combinaciones(n, caras), Math.pow(2, n));
    // AR21: confundir esta secuencia exacta con "esa cantidad de caras en cualquier orden"
    return { p, texto: p.texto, valor: p.valor, caras, mismaComposicion: combinaciones(n, caras), errores: { composicion: comp } };
  }
  function siguiente(o) {
    const c = o.caras || 6, h = o.historia || [], p = fraccion(1, c);
    let racha = 0; for (let i = h.length - 1; i >= 0 && h[i] === o.valor; i--) racha++;
    return { p, texto: p.texto, valor: p.valor, racha,
      // AR22 y vecinos: "ya salió mucho" (menos), "está en racha" (más) y confundir con la racha completa
      errores: { recenciaNegativa: 'menor', recenciaPositiva: 'mayor', rachaCompleta: potencia(fraccion(1, c), racha + 1) } };
  }
  function cumpleanos(o) {
    const n = entero(o.n, 'el número de personas', { min: 1, max: 400 }), d = entero(o.dias === undefined ? 365 : o.dias, 'los días', { min: 1 });
    let q = 1; for (let i = 0; i < n; i++) q *= (d - i) / d;
    q = Math.max(0, q);
    return { p: 1 - q, ninguno: q, parejas: combinaciones(n, 2),
      errores: { lineal: n / d, unaPareja: 1 / d, conmigo: 1 - Math.pow((d - 1) / d, n - 1) } };
  }
  function curvaCumpleanos(max, dias) {
    const out = []; for (let n = 1; n <= max; n++) out.push({ n, p: cumpleanos({ n, dias }).p });
    const mitad = out.find(x => x.p > 0.5);
    return { puntos: out, mitad: mitad ? mitad.n : null };
  }

  // ---------- Azar con semilla ----------
  function generador(semilla) {
    if (!Azar) throw new Error('falta nucleo/azar.js');
    return Azar.crear(semilla === undefined ? 'dados' : semilla);
  }
  // Un lanzamiento con su animación: las caras van cambiando cada vez más despacio hasta la final;
  // el dado gira un número entero de cuartos de vuelta (cae plano) y rebota con saltos que se apagan.
  function tirada(o) {
    o = o || {};
    const n = entero(o.dados === undefined ? 2 : o.dados, 'los dados', { min: 1, max: 6 }), c = o.caras || 6, cuadros = o.cuadros || 36;
    const g = generador(o.semilla);
    const dados = [];
    for (let j = 0; j < n; j++) {
      const final = g.entero(1, c), cambios = []; let t = 0, cara = g.entero(1, c);
      while (t < 0.78) { cambios.push({ t, cara }); t += 0.035 + 0.16 * t + 0.03 * g.sig(); let nv = g.entero(1, c - 1); if (nv >= cara) nv++; cara = nv; }
      if (cambios[cambios.length - 1].cara === final && cambios.length > 1) cambios.pop();
      cambios.push({ t: Math.max(t, 0.6), cara: final });
      const vueltas = (2 + g.entero(0, 2)) * 4 + 0, sentido = g.moneda() ? 1 : -1, alto = 0.75 + 0.25 * g.sig(), fase = 0.1 * g.sig();
      dados.push({ final, cambios, vueltas, sentido, alto, fase });
    }
    const out = [];
    for (let f = 0; f <= cuadros; f++) {
      const t = f / cuadros;
      out.push({ t, caras: dados.map(d => { let x = d.cambios[0].cara; for (const ch of d.cambios) if (ch.t <= t) x = ch.cara; return x; }),
        giro: dados.map(d => d.sentido * d.vueltas * 90 * (1 - Math.pow(1 - t, 3))),   // grados; al final, múltiplo de 360
        alto: dados.map(d => { const u = Math.min(1, Math.max(0, (t - d.fase) / (1 - d.fase))); return d.alto * Math.abs(Math.sin(Math.PI * 3 * Math.sqrt(u))) * Math.pow(1 - u, 2); }) });
    }
    return { valores: dados.map(d => d.final), cuadros: out };
  }
  function simular(o) {
    const c = config({ dados: o.dados === undefined ? 2 : o.dados, caras: o.caras, monedas: 0 });
    const N = entero(o.lanzamientos, 'los lanzamientos', { min: 0, max: 5e6 }), g = generador(o.semilla);
    const dist = distribucionSuma(c), veces = {}; for (let s = dist.min; s <= dist.max; s++) veces[s] = 0;
    const resultados = [], serie = [], cortes = o.pasos ? entero(o.pasos, 'los pasos', { min: 1, max: 1000 }) : 0;
    for (let i = 0; i < N; i++) {
      const r = []; let s = 0; for (let j = 0; j < c.dados; j++) { const v = g.entero(1, c.caras); r.push(v); s += v; }
      veces[s]++; if (N <= 20000) resultados.push(r);
      // la serie guarda cómo iban los conteos en 'pasos' momentos parejos (para animar el histograma)
      if (cortes && (Math.floor((i + 1) * cortes / N) > Math.floor(i * cortes / N))) serie.push({ n: i + 1, veces: { ...veces }, ultimo: r });
    }
    const frecuencias = {}; let desvioMax = 0;
    for (const s in veces) { frecuencias[s] = N ? veces[s] / N : 0; desvioMax = Math.max(desvioMax, Math.abs(frecuencias[s] - dist.p[s].valor)); }
    return { lanzamientos: N, veces, frecuencias, desvioMax, resultados, serie };
  }
  function simularEvento(o) {
    const c = config(o.cfg), N = entero(o.lanzamientos, 'los lanzamientos', { min: 1, max: 2e6 }), g = generador(o.semilla);
    const P = probabilidad(c, o.evento).p;
    let veces = 0, ultimo = null; const serie = [], cada = Math.max(1, Math.floor(N / 200));
    for (let i = 1; i <= N; i++) {
      const r = []; for (let j = 0; j < c.dados; j++) r.push(g.entero(1, c.caras)); for (let j = 0; j < c.monedas; j++) r.push(g.moneda() ? 'cara' : 'sello');
      if (cumple(o.evento, r, c)) veces++;
      if (i % cada === 0 || i === N) serie.push({ n: i, f: veces / i });
      ultimo = r;
    }
    return { veces, lanzamientos: N, frecuencia: veces / N, p: P, desvio: Math.abs(veces / N - P.valor), serie, ultimo };
  }
  // Se lanza un dado muchas veces y, cada vez que acaban de salir 'largo' veces seguidas el 'valor',
  // se anota lo que sale después. El dado no tiene memoria: la frecuencia del valor sigue cerca de 1/6.
  function despuesDeRacha(o) {
    const c = o.caras || 6, largo = entero(o.largo, 'el largo de la racha', { min: 1, max: 8 }), N = entero(o.lanzamientos, 'los lanzamientos', { min: 1, max: 2e7 });
    const g = generador(o.semilla), siguienteCara = Array(c + 1).fill(0);
    let racha = 0, veces = 0;
    for (let i = 0; i < N; i++) {
      const v = g.entero(1, c);
      if (racha >= largo) { siguienteCara[v]++; veces++; }
      racha = v === o.valor ? racha + 1 : 0;
    }
    return { veces, siguiente: siguienteCara.slice(1), frecuencias: siguienteCara.slice(1).map(x => (veces ? x / veces : 0)),
      frecuenciaValor: veces ? siguienteCara[o.valor] / veces : 0, p: fraccion(1, c) };
  }
  function simularCumpleanos(o) {
    const n = entero(o.n, 'el número de personas', { min: 1 }), S = entero(o.salones, 'los salones', { min: 1, max: 1e5 }), d = o.dias || 365, g = generador(o.semilla);
    let con = 0; const ejemplo = [];
    for (let s = 0; s < S; s++) {
      const vistos = new Set(); let hay = false; const dias = [];
      for (let i = 0; i < n; i++) { const x = g.entero(1, d); dias.push(x); if (vistos.has(x)) hay = true; vistos.add(x); }
      if (hay) con++;
      if (s < 12) ejemplo.push({ dias, coincide: hay });
    }
    return { conCoincidencia: con, salones: S, frecuencia: con / S, p: cumpleanos({ n, dias: d }).p, ejemplo };
  }

  // Una placa al azar y los cuadros de la animación: cada casilla da vueltas y se detiene, una tras otra.
  function sortearPlaca(o) {
    o = o || {};
    const L = o.letras === undefined ? 3 : o.letras, D = o.digitos === undefined ? 3 : o.digitos, g = generador(o.semilla), cuadros = o.cuadros || 30;
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sim = i => (i < L ? ABC : '0123456789');
    const final = []; for (let i = 0; i < L + D; i++) final.push(sim(i)[g.entero(0, sim(i).length - 1)]);
    const out = [];
    for (let f = 0; f <= cuadros; f++) {
      const t = f / cuadros;
      // la casilla i se detiene en t = (i + 1)/(L + D + 1)
      out.push({ t, casillas: final.map((x, i) => (t >= (i + 1) / (L + D + 1) ? x : sim(i)[g.entero(0, sim(i).length - 1)])), quietas: final.filter((_, i) => t >= (i + 1) / (L + D + 1)).length });
    }
    return { texto: final.slice(0, L).join('') + '-' + final.slice(L).join(''), casillas: final, cuadros: out };
  }

  // Resultado precalculado de despuesDeRacha({ largo: 5, valor: 6, lanzamientos: 15e6, semilla: 'racha-5' }), para que
  // la escena no simule 15 millones de lanzamientos al cargar. motor.test.js lo vuelve a simular y compara.
  const RACHA_CINCO_SEIS = (() => {
    const r = { largo: 5, valor: 6, lanzamientos: 15000000, semilla: 'racha-5', veces: 1935, siguiente: [328, 337, 322, 297, 319, 332] };
    r.frecuencias = r.siguiente.map(x => x / r.veces); r.frecuenciaValor = r.siguiente[5] / r.veces; r.p = fraccion(1, 6);
    return r;
  })();

  return { RACHA_CINCO_SEIS, fraccion, sumar, restar, multiplicar, dividir, potencia, comparar,
    espacio, cumple, probabilidad, union, interseccion, complemento, condicional, independientes, distribucionSuma,
    multiplicacion, adicion, factorial, permutaciones, variaciones, variacionesConRepeticion, permutacionesCirculares,
    permutacionesConRepeticion, combinaciones, combinacionesConRepeticion,
    enumerarVariaciones, enumerarCombinaciones, enumerarPermutaciones, enumerarCirculares,
    comite, comiteConGrupos, clave, placa, circular, anagramas,
    alMenosUno, secuenciaMoneda, siguiente, cumpleanos, curvaCumpleanos,
    tirada, simular, simularEvento, despuesDeRacha, simularCumpleanos, sortearPlaca, NOMBRES };
});
