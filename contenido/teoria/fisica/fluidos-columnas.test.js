'use strict';
// Oráculo independiente: caminos de presión, raíces y conservación de volumen.
const assert = require('node:assert/strict');
const test = require('node:test');
const def = require(process.env.FLUIDOS_COLUMNAS_MODULE || './fluidos.js');
const idea = def.ideas.find(i => i.id === 'vasos-comunicantes');
const pieza = require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const Ecuacion = require('../../../nucleo/ecuacion.js');
function cerca(a, b, mensaje = '') {
  assert.ok(Number.isFinite(a) && Number.isFinite(b), `${mensaje}: valor no finito`);
  assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)),
    `${mensaje}: ${a} frente a ${b}`);
}

// Un camino admite tramos descendentes y ascendentes, incluso por fluidos distintos.
function recorrer(pInicial, g, tramos) {
  return tramos.reduce((p, t) => p - t.rho * g * (t.final - t.inicio), pInicial);
}

function cero(funcion, minimo, maximo) {
  let izquierda = minimo, derecha = maximo;
  let fi = funcion(izquierda), fd = funcion(derecha);
  assert.ok(Number.isFinite(fi) && Number.isFinite(fd), 'Extremos no finitos');
  if (fi === 0) return izquierda;
  if (fd === 0) return derecha;
  assert.ok(fi * fd < 0, `La raíz no está encerrada: ${fi}; ${fd}`);
  for (let i = 0; i < 100; i++) {
    const medio = (izquierda + derecha) / 2, fm = funcion(medio);
    if (fm === 0) return medio;
    if (fm * fi > 0) { izquierda = medio; fi = fm; }
    else { derecha = medio; fd = fm; }
  }
  return (izquierda + derecha) / 2;
}

function alturaLigera(c) {
  if (c.hLigero !== undefined) return c.hLigero;
  const area = c.areaCm2 / (100 * 100);
  const volumen = c.volumenCm3 !== undefined
    ? c.volumenCm3 / (100 * 100 * 100)
    : (c.mLigeroG / 1000) / c.rhoLigero;
  cerca(area * (volumen / area), volumen, 'Volumen reconstruido');
  return volumen / area;
}

function nivelesDosLiquidos(c) {
  assert.ok(c.rhoLigero > 0 && c.rhoLigero < c.rhoBase, 'Orden estable de capas');
  const alto = alturaLigera(c), z0 = c.zInicial;
  // Igual sección constante: la superficie derecha gana el volumen perdido a la izquierda.
  const derecha = interfaz => 2 * z0 - interfaz;
  const residual = interfaz => {
    const porIzquierda = recorrer(0, 10, [{ rho: c.rhoLigero, inicio: interfaz + alto, final: interfaz }]);
    const porDerecha = recorrer(0, 10, [{ rho: c.rhoBase, inicio: derecha(interfaz), final: interfaz }]);
    return porIzquierda - porDerecha;
  };
  const interfaz = cero(residual, 0, z0), zDerecha = derecha(interfaz);
  cerca(residual(interfaz), 0, 'Balance en la interfaz');
  cerca((interfaz - z0) + (zDerecha - z0), 0, 'Volumen de líquido base');
  return { interfaz, derecha: zDerecha, ligera: interfaz + alto, ascenso: zDerecha - z0 };
}

function resolver(c) {
  const rho = c.rho !== undefined ? c.rho : c.rhoGcm3 * 1000;
  const h = c.h !== undefined ? c.h : c.hCm / 100;
  if (c.tipo === 'manometro-gauge' || c.tipo === 'manometro-absoluta') {
    assert.ok(c.sentido === 1 || c.sentido === -1);
    const zIzquierda = 0.25 + (c.sentido < 0 ? h : 0);
    const zDerecha = 0.25 + (c.sentido > 0 ? h : 0);
    const pCamara = recorrer(c.pAtm, c.g, [
      { rho, inicio: zDerecha, final: 0 },
      { rho, inicio: 0, final: zIzquierda },
    ]);
    assert.ok(pCamara > 0, 'La presión absoluta debe ser positiva');
    return c.tipo === 'manometro-absoluta' ? pCamara : pCamara - c.pAtm;
  }
  if (c.tipo === 'barometro-presion') {
    return recorrer(c.pTop, c.g, [{ rho, inicio: h, final: 0 }]);
  }
  if (c.tipo === 'barometro-altura') {
    return cero(altura => recorrer(c.pTop, c.g, [{ rho, inicio: altura, final: 0 }]) - c.pAtm, 0, 20);
  }
  if (c.tipo === 'dosliquidos-desnivel') {
    const hBase = cero(altura =>
      recorrer(0, 10, [{ rho: c.rhoLigero, inicio: c.hLigero, final: 0 }]) -
      recorrer(0, 10, [{ rho: c.rhoBase, inicio: altura, final: 0 }]), 0, c.hLigero);
    return c.hLigero - hBase;
  }
  if (c.tipo === 'dosliquidos-densidad') {
    const alto = alturaLigera(c), hBase = alto - c.desnivel;
    assert.ok(hBase > 0 && hBase < alto, 'Alturas de líquidos inmiscibles');
    return cero(densidad =>
      recorrer(0, 10, [{ rho: densidad, inicio: alto, final: 0 }]) -
      recorrer(0, 10, [{ rho: c.rhoBase, inicio: hBase, final: 0 }]), 0, c.rhoBase);
  }
  if (c.tipo === 'dosliquidos-ascenso') {
    const niveles = nivelesDosLiquidos(c);
    return c.pide === 'nivel-final' ? niveles.derecha : niveles.ascenso;
  }
  if (c.tipo === 'capas-gas') {
    let z = 0, densidadAnterior = c.rhoBase;
    const tramos = [{ rho: c.rhoBase, inicio: c.hBase, final: 0 }];
    for (const capa of c.capas) {
      assert.ok(capa.rho > 0 && capa.rho < densidadAnterior, 'Capas ordenadas por densidad');
      tramos.push({ rho: capa.rho, inicio: z, final: z + capa.h });
      z += capa.h;
      densidadAnterior = capa.rho;
    }
    const pGas = recorrer(c.pAtm, c.g, tramos);
    assert.ok(pGas > 0, 'Presión absoluta del gas');
    return pGas;
  }
  if (c.tipo === 'barometro-calibracion') {
    const densidad = cero(r => recorrer(c.pTop1, c.g,
      [{ rho: r, inicio: c.h1, final: 0 }]) - c.pAtm1, 0, 1e6);
    cerca(recorrer(c.pTop1, c.g, [{ rho: densidad, inicio: c.h1, final: 0 }]), c.pAtm1);
    if (c.pide === 'altura') return cero(altura => recorrer(c.pTop2, c.g,
      [{ rho: densidad, inicio: altura, final: 0 }]) - c.pAtm2, 0, 20);
    return recorrer(c.pTop2, c.g, [{ rho: densidad, inicio: c.h2, final: 0 }]);
  }
  throw new Error(`Familia no cubierta: ${c.tipo}`);
}

function contexto(c) {
  const valor = resolver(c), rho = c.rho ?? c.rhoGcm3 * 1000, h = c.h ?? c.hCm / 100;
  const e = { rho, g: 10, h, p_atm: c.pAtm, p_sup: c.pTop, rho_base: c.rhoBase,
    rho_ligero: c.rhoLigero, z_0: c.zInicial, p_atm_1: c.pAtm1, p_sup_1: c.pTop1,
    p_atm_2: c.pAtm2, p_sup_2: c.pTop2, h_1: c.h1, h_2: c.h2 };
  let unidad = 'Pa', intermedios = {};
  if (c.tipo.startsWith('manometro')) {
    e.p_camara = resolver({ ...c, tipo: 'manometro-absoluta' });
    e.p_man = e.p_camara - c.pAtm;
  }
  if (c.tipo === 'barometro-presion') e.p_atm = valor;
  if (c.tipo === 'barometro-altura') { e.h = valor; unidad = 'm'; }
  if (c.tipo.startsWith('dosliquidos')) {
    const alto = alturaLigera(c);
    const densidad = c.tipo === 'dosliquidos-densidad' ? valor : c.rhoLigero;
    const base = cero(x => recorrer(0, 10, [{ rho: densidad, inicio: alto, final: 0 }]) -
      recorrer(0, 10, [{ rho: c.rhoBase, inicio: x, final: 0 }]), 0, alto);
    Object.assign(e, { rho_ligero: densidad, h_ligero: alto, h_base: base,
      DeltaH: alto - base, DeltaZ: base / 2, z_final: c.zInicial + base / 2,
      V: c.volumenCm3 !== undefined ? c.volumenCm3 / 1e6 : c.mLigeroG !== undefined ? c.mLigeroG / (1000 * densidad) : undefined,
      m: c.mLigeroG / 1000, A: c.areaCm2 / 10000 });
    unidad = c.tipo === 'dosliquidos-densidad' ? 'kg/m³' : 'm';
    intermedios = { hLigero: alto, hBase: base };
  }
  if (c.tipo === 'capas-gas') Object.assign(e, { p_camara: valor, h_base: c.hBase,
    rho_1: c.capas[0].rho, h_1: c.capas[0].h, rho_2: c.capas[1].rho, h_2: c.capas[1].h });
  if (c.tipo === 'barometro-calibracion') {
    e.rho = cero(r => recorrer(c.pTop1, 10, [{ rho: r, inicio: c.h1, final: 0 }]) - c.pAtm1, 0, 1e6);
    intermedios.rho = e.rho;
    if (c.pide === 'altura') { unidad = 'm'; e.h_2 = valor; }
    else e.p_atm_2 = valor;
  }
  return { valor, unidad, env: e, intermedios };
}

function errores(c, o) {
  const e = o.env, v = o.valor;
  if (c.tipo.startsWith('manometro')) {
    const base = c.tipo === 'manometro-absoluta' ? c.pAtm : 0;
    return { SIGNO: base - e.p_man, MEDIO_DESNIVEL: base + e.p_man / 2, DOBLE_DESNIVEL: base + e.p_man * 2 };
  }
  if (c.tipo === 'barometro-presion') {
    const aporte = recorrer(0, 10, [{ rho: c.rho, inicio: c.h, final: 0 }]);
    return { OMITE_SUPERIOR: aporte, DOBLE_COLUMNA: c.pTop + 2 * aporte, MEDIA_COLUMNA: c.pTop + aporte / 2, SIN_GRAVEDAD: c.pTop + aporte / 10 };
  }
  if (c.tipo === 'barometro-altura') return { OMITE_SUPERIOR: resolver({ ...c, pTop: 0 }),
    SUMA_SUPERIOR: resolver({ ...c, pTop: -c.pTop }), DOS_COLUMNAS: v / 2, SIN_GRAVEDAD: v * 10 };
  if (c.tipo === 'dosliquidos-desnivel') return { COLUMNA_BASE: e.h_base, COLUMNA_LIGERA: e.h_ligero, NIVELES_IGUALES: 0 };
  if (c.tipo === 'dosliquidos-densidad') return { USA_DESNIVEL: c.rhoBase * c.desnivel / e.h_ligero,
    INVIERTE_ALTURAS: c.rhoBase * e.h_ligero / e.h_base, IGUALA_DENSIDADES: c.rhoBase };
  if (c.tipo === 'dosliquidos-ascenso') { const base = c.pide === 'nivel-final' ? c.zInicial : 0;
    return { TODO_DESNIVEL: base + e.h_base, OTRO_DESNIVEL: base + e.DeltaH / 2, IGUALA_DENSIDADES: base + e.h_ligero / 2 }; }
  if (c.tipo === 'capas-gas') {
    const aporte = recorrer(0, 10, [{ rho: c.rhoBase, inicio: c.hBase, final: 0 }]);
    const capas = c.capas.reduce((s, x) => s + recorrer(0, 10, [{ rho: x.rho, inicio: x.h, final: 0 }]), 0);
    return { INVIERTE_RECORRIDO: c.pAtm - aporte + capas, SUMA_CAPAS: c.pAtm + aporte + capas,
      OMITE_SUPERIOR: v + recorrer(0, 10, [{ rho: c.capas[1].rho, inicio: c.capas[1].h, final: 0 }]) };
  }
  if (c.tipo === 'barometro-calibracion') return {
    OMITE_PRIMERA_SUPERIOR: resolver({ ...c, pTop1: 0 }),
    OMITE_SEGUNDA_SUPERIOR: resolver({ ...c, pTop2: 0 }),
    SUMA_PRIMERA_SUPERIOR: resolver({ ...c, pTop1: -c.pTop1 }) };
  throw new Error('Errores no cubiertos: ' + c.tipo);
}

function plano(x) {
  if (x == null) return ''; if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if ('t' in x) return plano(x.t);
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')**(' + plano(x.sup[1]) + ')';
  return '';
}
function texto(x) {
  if (x == null || typeof x === 'function') return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(texto).join(' ');
  if (x.t || x.frac || x.sub || x.sup) return plano(x);
  return Object.values(x).map(texto).join(' ');
}
function numero(s) {
  s = plano(s).replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '').replace(/−/g, '-');
  const a = s.match(/[+-]?\d+(?:[,.]\d+)?/g);
  assert.equal(a?.length, 1, 'Cantidad única: ' + s);
  return Number(a[0].replace(',', '.'));
}
function visible(s, valor, unidad) {
  const t = plano(s), v = numero(t), diferencia = Math.abs(v - valor);
  assert.ok(t.includes(unidad), 'Unidad de ' + t);
  if (diferencia > 1e-8 * Math.max(1, Math.abs(valor))) assert.ok(t.includes('≈'), 'Falta ≈: ' + t);
  assert.ok(diferencia <= 0.00050001, 'Redondeo: ' + t + ' frente a ' + valor);
}
const unidades = { 'kg/m³': 1, 'g/cm³': 1000, 'm/s²': 1, 'cm³': 1e-6, 'cm²': 1e-4, 'm³': 1, 'm²': 1, 'kPa': 1000, 'Pa': 1, 'cm': 0.01, 'm': 1, 'kg': 1, 'g': 0.001 };
function unidadFinal(s) { return Object.keys(unidades).find(u => s.trim().endsWith(' ' + u)); }
function evaluar(s, env, factor) {
  s = s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/ρ/g, 'rho').replace(/Δh/g, 'DeltaH').replace(/Δz/g, 'DeltaZ');
  s = s.replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '');
  let salida = factor; const u = unidadFinal(s);
  if (u) { s = s.slice(0, -u.length).trim(); salida = unidades[u]; }
  let simbolico = false;
  s = s.replace(/\b[A-Za-z]+(?:_[A-Za-z0-9]+)*\b/g, k => {
    assert.ok(Number.isFinite(env[k]), 'Símbolo sin valor ' + k + ' en ' + s);
    simbolico = true; return '(' + env[k] + ')';
  });
  assert.match(s, /^[\d\s()+*/.\-]+$/, 'Expresión aritmética: ' + s);
  const valor = Function('"use strict";return (' + s + ')')();
  assert.ok(Number.isFinite(valor), 'Expresión finita');
  return valor * (simbolico ? 1 : salida);
}
function ecuaciones(filas, o) {
  for (const fila of filas) if (fila?.ecuacion) for (const bloque of plano(fila.ecuacion).split(/;|⇒| {3}· {3}/)) {
    const partes = bloque.split(/(=|≈)/).map(s => s.trim()); if (partes.length < 3) continue;
    const expresiones = partes.filter((_, i) => !(i % 2));
    const factores = expresiones.map((s, i) => unidades[expresiones.slice(i).map(unidadFinal).find(Boolean) || o.unidad]);
    const valores = expresiones.map((s, i) => evaluar(s, o.env, factores[i]));
    for (let i = 1; i < valores.length; i++) {
      if (partes[2 * i - 1] === '=') cerca(valores[i - 1], valores[i], 'Igualdad ' + bloque);
      else assert.ok(Math.abs(valores[i - 1] - valores[i]) <= 0.00050001 * factores[i], 'Aproximación ' + bloque);
    }
  }
}
function nodos(x, out = []) {
  if (Array.isArray(x)) x.forEach(v => nodos(v, out));
  else if (x && typeof x === 'object') { if (x.v && /^[+−-]?\d/.test(x.t)) out.push(x); else Object.values(x).forEach(v => { if (typeof v === 'object') nodos(v, out); }); }
  return out;
}
function entradas(p, c) {
  const ns = nodos([p.enunciado || p.pregunta, p.datos]);
  const claves = { rho: ['rho', 'kg/m³'], rhoGcm3: ['rho', 'g/cm³'], h: ['h', 'm'], hCm: ['h', 'cm'],
    pAtm: ['p', 'Pa'], pTop: ['p', 'Pa'], rhoBase: ['rho', 'kg/m³'], rhoLigero: ['rho', 'kg/m³'], hLigero: ['h', 'm'],
    desnivel: ['h', 'm'], zInicial: ['z', 'm'], mLigeroG: ['m', 'g'], volumenCm3: ['V', 'cm³'], areaCm2: ['A', 'cm²'],
    hBase: ['h', 'm'], pAtm1: ['p', 'Pa'], pAtm2: ['p', 'Pa'], pTop1: ['p', 'Pa'], pTop2: ['p', 'Pa'], h1: ['h', 'm'], h2: ['h', 'm'], g: ['g', 'm/s²'] };
  const colores = { rho: 'f', p: 'i', h: 'd', z: 'd', m: 'f', V: 'd', A: 'd', g: 'h' };
  const verificar = (valor, clave, unidad) => {
    const j = ns.findIndex(n => n.m === clave && Math.abs(numero(n) - valor) < 1e-8 && plano(n).endsWith(' ' + unidad));
    assert.ok(j >= 0, 'Entrada visible exacta: ' + clave + '=' + valor + ' ' + unidad);
    assert.equal(ns[j].v, 'c-' + colores[clave]); ns.splice(j, 1);
  };
  for (const [k, v] of Object.entries(c)) if (claves[k]) verificar(v, ...claves[k]);
  for (const capa of c.capas || []) { verificar(capa.rho, 'rho', 'kg/m³'); verificar(capa.h, 'h', 'm'); }
  assert.equal(ns.length, 0, 'Datos numéricos sin entrada original');
  for (const d of p.datos) assert.doesNotMatch(plano(d), /ρ\s*[·×]|p\s*=|dividimos|multiplicamos|despejamos|restamos|sumamos|h\s*=/i, 'Datos sin procedimiento');
}
const cajaCruza = (a, b) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 1e-7 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 1e-7;
const ampliar = (b, margen) => ({ x0: b.x0 - margen, x1: b.x1 + margen, y0: b.y0 - margen, y1: b.y1 + margen });
// Recorte de Liang–Barsky, independiente de la generación de los trazos.
function corta(b, a, z) { let lo = 0, hi = 1; const dx = z[0] - a[0], dy = z[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - b.x0], [dx, b.x1 - a[0]], [-dy, a[1] - b.y0], [dy, b.y1 - a[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return false; } else { const r = q / p; if (p < 0) lo = Math.max(lo, r); else hi = Math.min(hi, r); if (lo > hi) return false; }
  } return hi - lo > 1e-7;
}
function geometriaRevisada(d, estado = {}) {
  const g = pieza.geometria(d, estado), svg = pieza.dibujar(d, estado);
  assert.doesNotMatch(svg, /NaN|Infinity|#[0-9a-f]{3,8}\b/i);
  for (const r of g.rotulos) {
    assert.ok(r.x0 >= 4 && r.y0 >= 4 && r.x1 <= 316 && r.y1 <= g.H - 4, r.texto + ': margen');
    assert.ok(r.tam >= 14);
    for (const o of g.objetos.filter(o => o.solido)) assert.ok(!cajaCruza(r, o), r.texto + ': cuerpo ' + o.id);
    for (const li of g.segmentos) assert.ok(!corta(ampliar(r, li.grosor / 2), li.de, li.a), r.texto + ': trazo ' + li.id);
    for (const f of g.flechas) {
      assert.ok(!corta(ampliar(r, f.grosor / 2), f.de, f.a), r.texto + ': flecha');
      for (let i = 0; i < 3; i++) assert.ok(!corta(r, f.punta[i], f.punta[(i + 1) % 3]), r.texto + ': punta');
    }
  }
  for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!cajaCruza(g.rotulos[i], g.rotulos[j]), 'Rótulos superpuestos');
  for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= 316 && o.y0 >= 4 && o.y1 <= g.H - 4);
  return g;
}

function comprobar(p, contextoCaso) {
  const c = p.caso, o = contexto(c), err = errores(c, o);
  cerca(c.valor, o.valor, contextoCaso); assert.equal(c.unidad, o.unidad); entradas(p, c);
  for (const [k, v] of Object.entries(c.intermedios)) cerca(v, o.intermedios[k], 'Intermedio ' + k);
  for (const e of c.errores) { assert.ok(e.operacion in err); cerca(e.valor, err[e.operacion], 'Error ' + e.operacion); }
  if (p.respuesta) visible(p.respuesta, o.valor, o.unidad);
  ecuaciones(p.pasos || (Array.isArray(p.solucion) ? p.solucion : [p.solucion]), o);
  if (p.opciones) {
    assert.equal(p.opciones.length, 4);
    assert.equal(p.opciones.filter(x => x.correcta).length, 1);
    assert.equal(new Set(p.opciones.map(x => numero(x.texto))).size, 4);
    for (const opcion of p.opciones) {
      const v = opcion.correcta ? o.valor : err[opcion.error.replace('FL12-C-', '')];
      cerca(opcion.valor, v); visible(opcion.texto, v, o.unidad);
      if (!opcion.correcta) {
        assert.ok(opcion.siFuera.split(/\s+/).length <= 20, 'siFuera breve');
        assert.match(opcion.siFuera, /^Identificaste los datos;/);
        const motivos = { SIGNO: /invertiste.*superficie/, MEDIO_DESNIVEL: /medio desnivel/, DOBLE_DESNIVEL: /duplicaste.*desnivel/,
          OMITE_SUPERIOR: /omitiste.*superior/, SUMA_SUPERIOR: /sumaste.*restarlas/, DOS_COLUMNAS: /dos columnas/,
          SIN_GRAVEDAD: /omitiste.*gravitatoria/, DOBLE_COLUMNA: /dos veces.*columna/, MEDIA_COLUMNA: /mitad.*altura/,
          COLUMNA_BASE: /columna base.*interfaz/, COLUMNA_LIGERA: /toda.*columna/, NIVELES_IGUALES: /igualaste superficies/,
          USA_DESNIVEL: /desnivel como columna/, INVIERTE_ALTURAS: /invertiste.*alturas/, IGUALA_DENSIDADES: /supusiste iguales/,
          TODO_DESNIVEL: /desnivel.*ascenso/, OTRO_DESNIVEL: /diferencia entre superficies/,
          INVIERTE_RECORRIDO: /invertiste.*subidas.*bajadas/, SUMA_CAPAS: /sumaste.*subir/,
          OMITE_PRIMERA_SUPERIOR: /omitiste.*calibrar/, OMITE_SEGUNDA_SUPERIOR: /omitiste.*segundo estado/, SUMA_PRIMERA_SUPERIOR: /sumaste.*calibrar/ };
        assert.match(opcion.siFuera, motivos[opcion.error.replace('FL12-C-', '')], 'Explicación fiel al error');
        visible(opcion.siFuera.split('Obtienes ')[1].replace(/\.$/, ''), v, o.unidad);
      }
    }
  }
  if (p.alternativas) {
    assert.equal(p.alternativas.length, 4);
    const posibles = [o.valor, ...c.errores.map(e => err[e.operacion])];
    assert.equal(p.alternativas.filter(x => Math.abs(numero(x) - o.valor) <= 0.00050001).length, 1);
    for (const s of p.alternativas) { const v = posibles.find(v => Math.abs(numero(s) - v) <= 0.00050001); assert.ok(Number.isFinite(v)); visible(s, v, o.unidad); }
    for (const e of c.errores) assert.ok(texto(p.solucion.at(-1)).includes(p.alternativas.find(x => Math.abs(numero(x) - err[e.operacion]) <= 0.00050001)), 'Descarta cada alternativa');
  }
  const f = p.dibujo || p.figura, geo = geometriaRevisada(f.datos, f.estado || {}), svg = pieza.dibujar(f.datos, f.estado || {});
  assert.doesNotMatch(svg, /NaN|Infinity|undefined|\[object Object\]|_[A-Za-z]/);
  assert.equal(f.datos.caso, undefined);
  if (c.tipo.startsWith('manometro')) {
    const diferencia = geo.referencias['superficie-izquierda'].y - geo.referencias['superficie-derecha'].y;
    cerca(diferencia, c.sentido * (c.h ?? c.hCm / 100) * 450, 'Desnivel dibujado');
    assert.equal(f.datos.tuboU.ramas[0].cerrada, true);
    assert.doesNotMatch(pieza.alt(f.datos, f.estado || {}), /\d+\s*Pa/);
  } else if (c.tipo.startsWith('dosliquidos')) {
    assert.equal(f.datos.modo, 'esquema');
    for (const rama of f.datos.tuboU.ramas) { assert.equal(rama.capas.length, 1); assert.equal(rama.capas[0].alto, undefined); }
    assert.match(pieza.alt(f.datos, f.estado || {}), /previo/);
  } else if (c.tipo === 'barometro-altura') {
    assert.equal(f.datos.modo, 'esquema'); assert.equal(f.datos.barometro.columna, undefined);
  } else if (c.tipo.startsWith('barometro')) cerca(f.datos.barometro.columna, c.h ?? c.h1, 'Altura conocida');
  return o;
}

test('Columnas: calibración independiente y datos derivados sin consultar el motor', () => {
  cerca(resolver({ tipo: 'manometro-gauge', rho: 1200, h: 0.05, g: 10, sentido: -1, pAtm: 100000 }), -600);
  cerca(resolver({ tipo: 'barometro-presion', rho: 12500, g: 10, h: 0.64, pTop: 2000, valor: -1 }), 82000);
  assert.throws(() => visible('0,333 m', 1 / 3, 'm'), /≈/);
  assert.throws(() => ecuaciones([{ ecuacion: '10 − 2 = 9 Pa' }], { unidad: 'Pa', env: {} }), /Igualdad/);
});
test('Columnas: quince ejemplos, cinco por nivel y todas las operaciones', () => {
  assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
  assert.deepEqual(idea.ejemplos.reduce((a, e) => (a[e.nivel - 1]++, a), [0, 0, 0]), [5, 5, 5]);
  idea.ejemplos.forEach((p, i) => comprobar(p, 'Ejemplo ' + (i + 1)));
});
for (const momento of ['resuelve', 'ahoraTu']) test('Columnas: 400 semillas de ' + momento, () => {
  const tipos = new Set();
  for (let s = 0; s < 400; s++) { const p = idea[momento].generar(s); comprobar(p, momento + '/' + s); tipos.add(p.caso.tipo); }
  assert.equal(tipos.size, 9);
});
test('Columnas: bancos distintos y sin repetir ejemplos', () => {
  const firma = c => JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k]) => !['titulo', 'valor', 'unidad', 'intermedios', 'errores'].includes(k)).sort(([a], [b]) => a.localeCompare(b))));
  const ejemplos = new Set(idea.ejemplos.map(p => firma(p.caso))), resuelve = new Set();
  for (let s = 0; s < 400; s++) { const x = firma(idea.resuelve.generar(s).caso); assert.ok(!ejemplos.has(x)); resuelve.add(x); }
  for (let s = 0; s < 400; s++) { const x = firma(idea.ahoraTu.generar(s).caso); assert.ok(!ejemplos.has(x)); assert.ok(!resuelve.has(x)); }
});
test('Columnas: misión completa y 400 estados de animación canónicos', () => {
  const c = idea.juega.controles[0], ganadores = [];
  for (let p = c.min; p <= c.max; p += c.paso) if (idea.juega.mision.logrado({ p })) ganadores.push(p);
  assert.deepEqual(ganadores, [1000]); assert.equal(idea.juega.mision.logrado({ p: c.inicio }), false);
  for (let i = 0; i < 400; i++) {
    const control = Number((1500 * i / 399).toFixed(5)), p = Math.round(control), f = idea.juega.dibujo({ p: control });
    const niveles = f.datos.tuboU.ramas.map(r => r.capas[0].alto);
    cerca(niveles[0] + niveles[1], 0.4);
    cerca(recorrer(100000, 10, [{ rho: 1000, inicio: niveles[1], final: 0 }, { rho: 1000, inicio: 0, final: niveles[0] }]), 100000 + p);
    geometriaRevisada(f.datos, f.estado || {});
    visible(nodos(idea.juega.lectura({ p: control }))[0], (niveles[1] - niveles[0]) * 100, 'cm');
  }
});
test('Columnas: predicción, niveles, ascenso y figura previa sin respuesta', () => {
  const n = nivelesDosLiquidos({ rhoLigero: 800, rhoBase: 1000, hLigero: 0.15, zInicial: 0.2 });
  const valores = { c: (n.ligera - n.derecha) * 100, 'FL12-C-COLUMNA_BASE': (n.derecha - n.interfaz) * 100, 'FL12-C-COLUMNA_LIGERA': 15, 'FL12-C-NIVELES_IGUALES': 0 };
  for (const o of idea.predice.opciones) { const v = valores[o.correcta ? 'c' : o.error]; cerca(o.valor, v); visible(o.texto, v, 'cm'); if (!o.correcta) visible(o.siFuera, v, 'cm'); }
  const previo = idea.predice.dibujo.datos, despues = idea.predice.revelar.datos;
  assert.deepEqual(previo.tuboU.ramas.map(r => r.capas.map(c => c.alto)), [[0.2], [0.2]]);
  cerca(despues.tuboU.ramas[0].capas[0].alto, n.interfaz);
  cerca(despues.tuboU.ramas[0].capas.reduce((s, c) => s + c.alto, 0), n.ligera);
  cerca(despues.tuboU.ramas[1].capas[0].alto, n.derecha);
  cerca(n.ascenso, 0.06);
  const glosario = def.glosario.filter(t => ['manómetro', 'barómetro', 'interfaz', 'vasos comunicantes'].includes(t.termino));
  assert.doesNotMatch(texto([idea.lee, idea.predice.datos, idea.predice.dibujo, glosario]), /(?:^|\s)3 cm|12 cm|6 cm|14 cm|26 cm|29 cm/);
  const o = { unidad: 'm', env: { p_atm: 100000, rho_ligero: 800, rho_base: 1000, g: 10, h_ligero: 0.15, h_base: 0.12, DeltaH: 0.03, DeltaZ: 0.06, p_sup: 2000, rho: 1000, h: 9.8 } };
  ecuaciones(idea.mira.pasos, o);
});

test('Columnas: HTML de ecuaciones y figuras de lectura, predicción y explicación', () => {
  const revisarNodos = x => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { x.forEach(revisarNodos); return; }
    if (x.ecuacion) {
      const html = Ecuacion.html(x.ecuacion);
      assert.doesNotMatch(html, /\[object Object\]|undefined|NaN|Infinity|_[A-Za-z0-9]/);
      assert.match(html, /c-[idfh]/, 'Magnitudes con color en la ecuación');
    }
    for (const v of Object.values(x)) if (typeof v !== 'function') revisarNodos(v);
  };
  revisarNodos(idea.lee); revisarNodos(idea.regla); revisarNodos(idea.mira); idea.ejemplos.forEach(revisarNodos);
  for (let s = 0; s < 400; s++) { revisarNodos(idea.resuelve.generar(s)); revisarNodos(idea.ahoraTu.generar(s)); }
  for (const tarjeta of idea.lee.tarjetas) if (tarjeta.dibujo) geometriaRevisada(tarjeta.dibujo.datos, tarjeta.dibujo.estado || {});
  for (const f of [idea.predice.dibujo, idea.predice.revelar, idea.regla.dibujo]) geometriaRevisada(f.datos, f.estado || {});
  for (const p of idea.mira.pasos) geometriaRevisada(idea.mira.datos, p.estado || {});
});

