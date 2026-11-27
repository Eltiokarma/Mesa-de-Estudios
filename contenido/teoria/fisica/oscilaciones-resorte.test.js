/* Comprobación independiente de periodo-resorte, etapa 11.
 * El motor se carga únicamente para observar entradas/salidas. Este archivo no llama sus helpers.
 * Para las conexiones, aplica una fuerza de prueba y suma desplazamientos o fuerzas.
 * Para el período, resuelve m·ω²=k y después cuenta una vuelta de fase.
 * El movimiento se contrasta por integración RK4 de Newton, sin usar el coseno del motor.
 * Fundamentos: OpenStax University Physics I, §15.1; conexión ideal de resortes por Hooke y Newton.
 */
'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const repo = path.resolve(__dirname, '../../..');
function cargar() { return require('./oscilaciones.js'); }
function cerca(a, b, contexto, tol = 1e-9) {
  assert.ok(Number.isFinite(a) && Number.isFinite(b), `${contexto}: número no finito`);
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${contexto}: ${a} frente a ${b}`);
}
function raizPositiva(n) {
  assert.ok(n > 0); let lo = 0, hi = Math.max(1, n);
  for (let i = 0; i < 100; i++) { const medio = (lo + hi) / 2; if (medio * medio < n) lo = medio; else hi = medio; }
  return (lo + hi) / 2;
}
function rigidezConjunto(k1, k2, serie) {
  // Aplicamos una fuerza de prueba de 1 N en serie; un desplazamiento de 1 m en paralelo.
  assert.ok(k1 > 0 && k2 > 0);
  return serie ? 1 / (1 / k1 + 1 / k2) : (k1 * 1 + k2 * 1) / 1;
}
function vuelta(m, k) { assert.ok(m > 0 && k > 0); return 2 * Math.PI / raizPositiva(k / m); }
function calcular(c) {
  let esperado, k1, k2, conjunto, equilibrio;
  const t = c.tipo;
  if (t === 'periodo') esperado = vuelta(c.m, c.k);
  else if (t === 'periodo-gramos') esperado = vuelta(c.gramos / 1000, c.k);
  else if (t === 'razon-masa') {
    const frecuenciaInicial = 2 * Math.PI / c.T0, rigidez = c.m0 * frecuenciaInicial ** 2;
    esperado = vuelta(c.m1, rigidez);
  } else if (t === 'razon-rigidez') {
    const frecuenciaInicial = 2 * Math.PI / c.T0, masa = c.k0 / frecuenciaInicial ** 2;
    esperado = vuelta(masa, c.k1);
  } else if (t === 'masa-periodo') esperado = c.k / (2 / c.q) ** 2;
  else if (t === 'rigidez-periodo') esperado = c.m * (2 / c.q) ** 2;
  else if (t === 'vertical-periodo') esperado = 2 * Math.PI * raizPositiva(c.sCm / (100 * c.g));
  else if (t === 'vertical-amplitud' || t === 'vertical-desde-periodo') {
    // En el segundo caso se elimina k: la aceleración por desplazamiento es ω².
    equilibrio = t === 'vertical-desde-periodo' ? c.g / (2 / c.q) ** 2 : c.m * c.g / c.k;
    esperado = Math.abs(c.yCm - 100 * equilibrio);
  } else if (/^(serie|paralelo)-(periodo|estatico)$/.test(t)) {
    k1 = t.endsWith('estatico') ? c.mc * c.g * 100 / c.sCm : c.k1;
    k2 = c.k2; conjunto = rigidezConjunto(k1, k2, t.startsWith('serie')); esperado = vuelta(c.m, conjunto);
  } else if (/^(serie|paralelo)-inversa$/.test(t)) {
    conjunto = c.m * (2 / c.q) ** 2; k1 = c.k1;
    if (t.startsWith('serie')) {
      const fuerzaPrueba = 1, recorridoTotal = fuerzaPrueba / conjunto, recorridoPrimero = fuerzaPrueba / k1;
      esperado = fuerzaPrueba / (recorridoTotal - recorridoPrimero);
    } else esperado = conjunto * 1 - k1 * 1;
  } else throw new Error('Tipo no cubierto: ' + t);
  const errores = {};
  for (const e of c.errores) {
    if (e.id === 'medio' || e.id === 'mitad') errores[e.id] = esperado / 2;
    else if (e.id === 'doble') errores[e.id] = 2 * esperado;
    else if (e.id === 'masa-doble') errores[e.id] = esperado * raizPositiva(2);
    else if (e.id === 'rigidez-doble') errores[e.id] = esperado / raizPositiva(2);
    else if (e.id === 'factor-cuatro') errores[e.id] = esperado * 4;
    else if (e.id === 'cuarto') errores[e.id] = esperado / 4;
    else if (e.id === 'sin-raiz') errores[e.id] = c.T0 * (t === 'razon-masa' ? c.m1 / c.m0 : c.k0 / c.k1);
    else if (e.id === 'sin-cambio') errores[e.id] = c.T0;
    else if (e.id === 'inversa') errores[e.id] = c.T0 * c.T0 / esperado;
    else if (e.id === 'natural') errores[e.id] = c.yCm;
    else if (e.id === 'equilibrio') errores[e.id] = equilibrio * 100;
    else if (e.id === 'signo-alargamiento') errores[e.id] = equilibrio * 100 - c.yCm;
    else if (e.id === 'recorrido') errores[e.id] = 4 * esperado;
    else if (e.id === 'suma') errores[e.id] = t.startsWith('vertical') ? c.yCm + equilibrio * 100 : conjunto + c.k1;
    else if (e.id === 'otra-conexion') errores[e.id] = vuelta(c.m, rigidezConjunto(k1, k2, !t.startsWith('serie')));
    else if (e.id === 'solo-primero') errores[e.id] = vuelta(c.m, k1);
    else if (e.id === 'conjunto') errores[e.id] = conjunto;
    else if (e.id === 'primero') errores[e.id] = c.k1;
    else if (e.id === 'diferencia-inversa') errores[e.id] = t.startsWith('serie') ? conjunto - c.k1 : c.k1 - conjunto;
    else throw new Error('Error no cubierto: ' + e.id);
  }
  return { esperado, errores };
}
function texto(n) {
  if (n === undefined || n === null) return '';
  if (Array.isArray(n)) return n.map(texto).join('');
  if (typeof n !== 'object') return String(n);
  if (n.t !== undefined) return String(n.t);
  if (n.sub) return texto(n.sub[0]) + '_' + texto(n.sub[1]);
  if (n.sup) return '(' + texto(n.sup[0]) + ')^(' + texto(n.sup[1]) + ')';
  if (n.frac) return '(' + texto(n.frac[0]) + ')/(' + texto(n.frac[1]) + ')';
  if (n.raiz) return '√(' + texto(n.raiz) + ')';
  return Object.values(n).map(texto).join(' ');
}
function literal(s) {
  const t = String(s).trim().replace(/[  ](?=\d{3})/g, '');
  const m = /^(≈\s*)?([−-]?\d+(?:[.,]\d+)?)(π)?\s*(s|kg|N\/m|cm|m\/s²|m|g)?$/.exec(t);
  if (!m) return null;
  const numero = Number(m[2].replace('−', '-').replace(',', '.')), factor = m[3] ? Math.PI : 1;
  return { valor: numero * factor, aproximado: !!m[1], decimales: (m[2].split(/[.,]/)[1] || '').length, factor, unidad: m[4] || '' };
}
function verificarLiteral(s, valor, contexto) {
  const l = literal(s); assert.ok(l, contexto + ': literal ilegible ' + s);
  if (l.aproximado) assert.ok(Math.abs(l.valor - valor) <= 0.50001 * 10 ** -l.decimales * l.factor, contexto + ': aproximación fuera de intervalo');
  else cerca(l.valor, valor, contexto);
}
function fichas(n, out = []) {
  if (Array.isArray(n)) n.forEach(x => fichas(x, out));
  else if (n && typeof n === 'object') { if (n.v && n.t !== undefined) out.push(n); else Object.values(n).forEach(x => fichas(x, out)); }
  return out;
}
function comprobarEntradas(obj) {
  const c = obj.caso, visibles = fichas(obj.enunciado || obj.pregunta).map(x => literal(x.t)).filter(Boolean);
  for (const [key, unidad] of Object.entries({ m:'kg', mc:'kg', m0:'kg', m1:'kg', k:'N/m', k0:'N/m', k1:'N/m', k2:'N/m', T0:'s', sCm:'cm', yCm:'cm', g:'m/s²', gramos:'g', q:'s' })) {
    if (c[key] === undefined) continue;
    const n = key === 'q' ? c.q * Math.PI : c[key];
    assert.ok(visibles.some(x => x.unidad === unidad && Math.abs(x.valor - n) < 1e-9), `${c.tipo}: falta entrada exacta ${key}=${n} ${unidad}`);
  }
}
function expresion(n) {
  if (Array.isArray(n)) return n.map(expresion).join('');
  if (n && typeof n === 'object') {
    if (n.v) { const l = literal(n.t); return l ? String(l.valor * (l.unidad === 'cm' ? 0.01 : l.unidad === 'g' ? 0.001 : 1)) : '?' + texto(n); }
    if (n.sub) return '?' + texto(n);
    if (n.sup) return '(' + expresion(n.sup[0]) + ')**(' + expresion(n.sup[1]) + ')';
    if (n.frac) return '(' + expresion(n.frac[0]) + ')/(' + expresion(n.frac[1]) + ')';
    if (n.raiz) return 'sqrt(' + expresion(n.raiz) + ')';
    return '?';
  }
  return String(n || '');
}
function evaluar(s) {
  if (s.includes('?')) return null;
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*g\/kg/g, (_, n) => String(Number(n.replace(',', '.')) / 1000)).replace(/m\/s²/g, '').replace(/\b(?:N\/m|kg|cm|g|m|s)\b/g, '')
    .replace(/(\d)[   ](?=\d{3}(?!\d))/g, '$1').replace(/,/g, '.').replace(/−/g, '-').replace(/·|×/g, '*').replace(/÷/g, '/')
    .replace(/²/g, '**2').replace(/√(\d+(?:\.\d+)?)/g, 'sqrt($1)').replace(/(\d|\))π/g, '$1*π').replace(/(\d|π|\))sqrt/g, '$1*sqrt')
    .replace(/π/g, '(Math.PI)').replace(/sqrt/g, 'Math.sqrt').replace(/≈/g, '').trim();
  if (!s || /[^\d\s.()+*/\-MathPIqrt]/.test(s)) return null;
  const resultado = Function('return (' + s + ')')();
  assert.ok(Number.isFinite(resultado), 'Expresión no finita: ' + s); return resultado;
}
let igualdades = 0;
function comprobarEcuacion(eq, contexto) {
  const e = expresion(eq), valores = new Map();
  for (const trozo of e.split(';')) {
    const partes = trozo.split(/(=|≈)/), referencia = partes[0].trim();
    let anterior = evaluar(referencia);
    // k = cuenta; k = resultado conserva la misma igualdad que k = cuenta = resultado.
    if (anterior === null && valores.has(referencia)) anterior = valores.get(referencia);
    for (let i = 1; i < partes.length; i += 2) {
      const actual = evaluar(partes[i + 1]);
      if (anterior !== null && actual !== null) {
        if (partes[i] === '=') cerca(anterior, actual, contexto + ': ' + trozo, 2e-8);
        else assert.ok(Math.abs(anterior - actual) <= 0.00051, contexto + ': aproximación falsa');
        igualdades++;
      }
      if (actual !== null && referencia.includes('?')) valores.set(referencia, actual);
      anterior = actual;
    }
  }
}
function comprobarCaso(obj, modo) {
  const c = obj.caso, { esperado, errores } = calcular(c);
  cerca(c.valor, esperado, c.tipo + ' resultado'); assert.ok(esperado > 0);
  comprobarEntradas(obj);
  for (const e of c.errores) cerca(e.valor, errores[e.id], c.tipo + '/' + e.id);
  const respuesta = obj.respuesta && fichas(obj.respuesta).map(x => literal(x.t)).filter(Boolean).at(-1);
  if (respuesta) cerca(respuesta.valor, esperado, c.tipo + ' respuesta visible');
  const pasos = obj.solucion && Array.isArray(obj.solucion) ? obj.solucion : obj.pasos || [obj.solucion];
  for (const p of pasos) if (p && p.ecuacion) comprobarEcuacion(p.ecuacion, c.tipo);
  if (obj.opciones) {
    assert.equal(obj.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(obj.opciones.map(o => texto(o.texto))).size, obj.opciones.length);
    for (const o of obj.opciones) {
      const n = o.correcta ? esperado : errores[o.error.replace(/^RES-/, '')];
      verificarLiteral(texto(o.texto), n, c.tipo + ' opción'); cerca(o.valor, n, c.tipo + ' opción numérica');
      if (!o.correcta) { assert.ok(o.siFuera.includes(texto(o.texto)), 'siFuera no explica el mismo valor'); assert.ok(Math.abs(n - esperado) > 1e-8); }
    }
  }
  if (obj.alternativas) {
    const nums = obj.alternativas.map(x => literal(texto(x)));
    assert.equal(nums.filter(x => Math.abs(x.valor - esperado) < 1e-8).length, 1, c.tipo + ': alternativas');
    for (const e of c.errores) assert.ok(obj.alternativas.some(x => { try { verificarLiteral(texto(x), errores[e.id], 'alternativa'); return true; } catch { return false; } }));
  }
  assert.ok((obj.datos || []).every(x => !/[=√]/.test(texto(x)) || /^1 (?:kg|m) =/.test(texto(x))), c.tipo + ': Datos trae procedimiento');
  return { tipo: c.tipo, esperado, modo };
}
function integrar(t, k) {
  let x = 8, v = 0; const pasos = Math.max(1, Math.ceil(t * Math.sqrt(k / 0.5) / 0.004)), h = t / pasos;
  const a = x => -k / 0.5 * x;
  for (let j = 0; j < pasos; j++) {
    const x1 = v, v1 = a(x), x2 = v + h*v1/2, v2 = a(x+h*x1/2), x3=v+h*v2/2, v3=a(x+h*x2/2), x4=v+h*v3, v4=a(x+h*x3);
    x += h*(x1+2*x2+2*x3+x4)/6; v += h*(v1+2*v2+2*v3+v4)/6;
  }
  return x;
}
let figuras = 0;
function comprobarGeometria(fig, nombre) {
  const P = require(repo + '/nucleo/kit/piezas/fis-estatica.js'), g = P.geometria(fig.datos, fig.estado || {});
  const toca = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
  for (let j = 0; j < g.rotulos.length; j++) {
    const r = g.rotulos[j];
    assert.ok(r.x0 >= 4 && r.x1 <= 316 && r.y0 >= 4 && r.y1 <= g.H - 4, nombre + ': rótulo fuera de margen: ' + r.texto);
    for (const q of g.rotulos.slice(j + 1)) assert.ok(!toca(r, q), nombre + ': rótulos cruzados');
    for (const ob of g.objetos) assert.ok(!toca(r, ob), nombre + ': rótulo sobre ' + ob.nombre + ': ' + r.texto);
  }
  const svg = P.dibujar(fig.datos, fig.estado || {}), textos = (svg.match(/<text\b[\s\S]*?<\/text>/g) || []).join(' ').replace(/<[^>]*>/g, '');
  assert.ok(!/_[A-Za-z0-9]|\[object Object\]/.test(textos), nombre + ': notación sin renderizar');
  figuras++;
}
function ejecutar() {
  const def = cargar(), idea = def.ideas.find(i => i.id === 'periodo-resorte'); assert.equal(idea.id, 'periodo-resorte');
  const esperados = [.4*Math.PI,2.4,.6,2,80,.1*Math.PI,.2*Math.PI,12,.2*Math.PI,.4*Math.PI,.2*Math.PI,.2*Math.PI,40,30,12];
  assert.equal(idea.ejemplos.length, 15);
  for (const nivel of [1,2,3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
  const letras = [];
  idea.ejemplos.forEach((e,i) => { comprobarCaso(e, 'ejemplo'); comprobarGeometria(e.figura, 'ejemplo '+i); cerca(e.caso.valor, esperados[i], 'testigo ' + (i+1)); if (e.alternativas) letras.push(e.alternativas.findIndex(x=>Math.abs(literal(texto(x)).valor-esperados[i])<1e-8)); });
  assert.equal(new Set(letras).size, 5, 'Las cinco letras deben ser correctas una vez');
  const tipos = { resuelve: new Set(), ahoraTu: new Set() }, casos = { resuelve: new Set(), ahoraTu: new Set() };
  const huella = c => JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['valor','pi','unidad','errores'].includes(k))));
  const ejemploInputs = new Set(idea.ejemplos.map(e=>huella(e.caso)));
  for (const modo of ['resuelve','ahoraTu']) for (let s=0;s<400;s++) {
    const c=idea[modo].generar(s); comprobarCaso(c, modo); comprobarGeometria(c.dibujo,modo+' '+s); tipos[modo].add(c.caso.tipo); const h=huella(c.caso); casos[modo].add(h); assert.ok(!ejemploInputs.has(h),`${modo} ${s} repite ejemplo`);
  }
  for (const t of tipos.resuelve) assert.ok(!tipos.ahoraTu.has(t),'Bancos repiten familia '+t);
  for (const c of casos.resuelve) assert.ok(!casos.ahoraTu.has(c),'Bancos repiten caso');
  for(const k of [12.5,50,112.5,200]) for(let j=0;j<=200;j++) assert.equal(idea.juega.mision.logrado({k,t:j/100}),k===50);
  for(let i=0;i<400;i++) {
    const k=[12.5,50,112.5,200][i%4], bruto=Number((2*i/399).toFixed(5)), t=Math.round(bruto*100)/100;
    const dibujo=idea.juega.dibujo({k,t:bruto}); comprobarGeometria(dibujo,'juego '+i); const fig=dibujo.datos, bloque=fig.objetos.find(o=>o.tipo==='caja');
    cerca((bloque.x-178)/4,integrar(t,k),'Newton en estado animado '+i,2e-8);
    assert.ok(fig.textos.some(o=>o.texto==='k = '+String(k).replace('.',',')+' N/m'));
    const lectura=texto(idea.juega.lectura({k,t:bruto})); assert.ok(lectura.includes(String(t).replace('.',',')));
    assert.ok(fig.textos.some(o=>/^T ≈/.test(o.texto))); // π hace inexacta la escritura decimal del período.
  }
  const pred=idea.predice.opciones, esperadoPred=vuelta(4,1)/vuelta(1,1)*.6;
  cerca(pred.find(o=>o.correcta).valor,esperadoPred,'Predice');
  for(const p of idea.mira.pasos) comprobarEcuacion(p.ecuacion,'Mira');
  require(repo+'/nucleo/kit/piezas/fis-estatica.js'); require(repo+'/nucleo/kit/piezas/ejes.js');
  assert.ok(igualdades>500,'Faltan comprobaciones de igualdades numéricas');
  return {def,idea};
}
test('Resortes: el parser comprueba relaciones separadas sin confundir símbolos', () => {
  const k = { v:'c-f', t:'k', m:'k' }, m = { v:'c-f', t:'m', m:'m' }, antes = igualdades;
  try {
    comprobarEcuacion([k, ' = 40 / 2', '   ;   ', m, ' = 3', '   ;   ', k, ' = 20'], 'separadas');
    assert.equal(igualdades - antes, 1, 'Debe comparar los dos valores de k');
    const k1 = { sub:[k,'1'] }, k2 = { sub:[k,'2'] };
    comprobarEcuacion([k1, ' = 20', '   ;   ', k2, ' = 30', '   ;   ', k1, ' = 20'], 'subíndices');
    assert.equal(igualdades - antes, 2, 'Debe distinguir k1 de k2');
    assert.throws(() => comprobarEcuacion([k, ' = 20', '   ;   ', k, ' = 21'], 'separada falsa'), /20 frente a 21/);
  } finally { igualdades = antes; }
});

test('Resortes: 15 ejemplos, 800 casos, ecuaciones, misión, Newton y geometría', () => { ejecutar(); });
