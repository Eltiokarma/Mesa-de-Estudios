// Validador de la tanda de ejercicios (docs/ejercicios-7000.md, contenido/ejercicios/LEEME.md).
// Sin dependencias. Tres usos:
//   node herramientas/validar-ejercicios.js --validar <carpeta>        errores y avisos por ejercicio (sale con 1 si hay errores)
//   node herramientas/validar-ejercicios.js --contar <carpeta> [--json] conteo por curso, unidad, tipo, pieza, origen y estado
//   node herramientas/validar-ejercicios.js --auditar [--semillas 20] [--json] [--generador id]
//       presupuesto de texto de los generadores de hoy (formato «predicciones»): el backlog de migración medido
// El presupuesto de texto es el de docs/escena-viva.md, regla 3.1.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const ESQUEMA = path.join(RAIZ, 'contenido', 'ejercicios', 'esquema.json');
const TIPOS = path.join(RAIZ, 'contenido', 'ejercicios', 'tipos.json');
const PRESUPUESTO = { enunciado: 40, paso: 14, explicacion: 20 };
const ESTADOS = ['crudo', 'clasificado', 'mapeado', 'verificado', 'publicado'];
const rango = e => ESTADOS.indexOf(e);
// Primeras piezas del contrato (docs/escena-viva.md, sección 5). Valen con aviso hasta que exista nucleo/kit/piezas/.
const PIEZAS_PREVISTAS = ['barra-porcentaje', 'recta', 'balanza', 'flechas', 'triangulo', 'ejes'];
const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));

// ======================= JSON Schema (el subconjunto que usa esquema.json) =======================
function tipoDe(x) {
  if (x === null) return 'null';
  if (Array.isArray(x)) return 'array';
  return typeof x;
}
function cumpleTipo(x, t) {
  if (t === 'integer') return Number.isInteger(x);
  if (t === 'number') return typeof x === 'number' && Number.isFinite(x);
  return tipoDe(x) === t;
}
function resolver(ref, raiz) {
  if (!ref.startsWith('#/')) throw new Error(`$ref no soportado: ${ref}`);
  return ref.slice(2).split('/').reduce((o, k) => o[k], raiz);
}
function validarEsquema(x, s, raiz = s, ruta = '') {
  const err = [];
  const r = ruta || '(raíz)';
  if (s.$ref) return validarEsquema(x, resolver(s.$ref, raiz), raiz, ruta);
  if (s.type) {
    const tipos = [].concat(s.type);
    if (!tipos.some(t => cumpleTipo(x, t))) return [`${r}: debe ser ${tipos.join(' o ')}`];
  }
  if (s.const !== undefined && JSON.stringify(x) !== JSON.stringify(s.const)) err.push(`${r}: debe valer ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.some(e => JSON.stringify(e) === JSON.stringify(x))) err.push(`${r}: «${x}» no es ninguno de ${s.enum.join(', ')}`);
  if (typeof x === 'string') {
    if (s.minLength !== undefined && [...x].length < s.minLength) err.push(`${r}: muy corto`);
    if (s.maxLength !== undefined && [...x].length > s.maxLength) err.push(`${r}: muy largo`);
    if (s.pattern && !new RegExp(s.pattern, 'u').test(x)) err.push(`${r}: «${x}» no cumple ${s.pattern}`);
  }
  if (typeof x === 'number') {
    if (s.minimum !== undefined && x < s.minimum) err.push(`${r}: menor que ${s.minimum}`);
    if (s.maximum !== undefined && x > s.maximum) err.push(`${r}: mayor que ${s.maximum}`);
  }
  if (Array.isArray(x)) {
    if (s.minItems !== undefined && x.length < s.minItems) err.push(`${r}: menos de ${s.minItems} elementos`);
    if (s.maxItems !== undefined && x.length > s.maxItems) err.push(`${r}: más de ${s.maxItems} elementos`);
    if (s.items) x.forEach((y, i) => err.push(...validarEsquema(y, s.items, raiz, `${ruta}[${i}]`)));
  }
  if (tipoDe(x) === 'object') {
    for (const k of s.required || []) if (!(k in x)) err.push(`${r}: falta «${k}»`);
    const props = s.properties || {};
    for (const [k, y] of Object.entries(x)) {
      const sub = ruta ? `${ruta}.${k}` : k;
      if (props[k]) err.push(...validarEsquema(y, props[k], raiz, sub));
      else if (s.additionalProperties === false) err.push(`${r}: campo desconocido «${k}»`);
      else if (s.additionalProperties && typeof s.additionalProperties === 'object') err.push(...validarEsquema(y, s.additionalProperties, raiz, sub));
    }
  }
  for (const sub of s.allOf || []) err.push(...validarEsquema(x, sub, raiz, ruta));
  if (s.anyOf && !s.anyOf.some(sub => validarEsquema(x, sub, raiz, ruta).length === 0)) err.push(`${r}: no cumple ninguna de las formas permitidas`);
  if (s.oneOf) {
    const res = s.oneOf.map(sub => validarEsquema(x, sub, raiz, ruta));
    const ok = res.filter(e => e.length === 0).length;
    if (ok !== 1) err.push(ok === 0 ? (res.length === 1 ? res[0][0] : `${r}: no cumple ninguna forma (${res.map(e => e[0]).join(' | ')})`) : `${r}: cumple más de una forma`);
  }
  if (s.if && validarEsquema(x, s.if, raiz, ruta).length === 0) {
    if (s.then) err.push(...validarEsquema(x, s.then, raiz, ruta));
  } else if (s.if && s.else) err.push(...validarEsquema(x, s.else, raiz, ruta));
  return err;
}

// ======================= palabras (presupuesto de texto) =======================
// Texto que ve el alumno, sin los datos con color: los segmentos { v, t } y los marcadores {clave} se quitan.
function plano(x) {
  if (x === null || x === undefined) return '';
  if (typeof x === 'string') return x.replace(/\{[A-Za-z0-9_]+\}/g, ' ');
  if (typeof x === 'number') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (typeof x === 'object') return x.v !== undefined ? ' ' : (x.t !== undefined ? String(x.t) : '');
  return '';
}
// Una palabra: trozo entre espacios con al menos una letra. Números, signos y ecuaciones sin letras no cuentan.
const palabras = x => plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;

// ======================= contexto: catálogo, generadores, piezas, tipos =======================
function cargarContexto({ tipos = TIPOS } = {}) {
  const unidades = new Map();
  const dirCursos = path.join(RAIZ, 'catalogo', 'cursos');
  for (const f of fs.readdirSync(dirCursos).filter(f => f.endsWith('.json'))) {
    const c = leer(path.join(dirCursos, f));
    for (const u of c.unidades) unidades.set(u.id, { curso: c.id, plantillas: u.plantillas || [] });
  }
  const generadores = new Map();
  const dirP = path.join(RAIZ, 'plantillas');
  for (const d of fs.readdirSync(dirP).sort()) {
    const pj = path.join(dirP, d, 'plantilla.json');
    if (!fs.existsSync(pj)) continue;
    const p = leer(pj);
    if (p.formato !== 'predicciones' || !p.generador) continue;
    const u = (p.unidades || [])[0];
    generadores.set(p.id, { id: p.id, archivo: path.join(dirP, d, p.generador), unidades: p.unidades || [], curso: u ? u.split('.')[0] : '?' });
  }
  const dirPiezas = path.join(RAIZ, 'nucleo', 'kit', 'piezas');
  const piezas = new Set();
  if (fs.existsSync(dirPiezas)) {
    for (const f of fs.readdirSync(dirPiezas)) {
      if (f.endsWith('.test.js')) continue;
      if (f.endsWith('.js')) piezas.add(f.slice(0, -3));
      else if (fs.statSync(path.join(dirPiezas, f)).isDirectory()) piezas.add(f);
    }
  }
  return { unidades, generadores, piezas, registro: cargarTipos(tipos), esquema: leer(ESQUEMA) };
}
function cargarTipos(archivo) {
  if (!archivo || !fs.existsSync(archivo)) return {};
  return leer(archivo).tipos || {};
}
function estadoPieza(id, ctx) {
  if (ctx.piezas.has(id)) return 'existe';
  if (ctx.piezas.size === 0 && PIEZAS_PREVISTAS.includes(id)) return 'prevista';
  return 'desconocida';
}
// El mapeo de un ejercicio: el suyo o el de su tipo en el registro.
const mapeoDe = (ej, ctx) => ej.mapeo || (ej.tipo && ctx.registro[ej.tipo]) || null;
// Huérfano: tiene tipo, pero ni generador que exista ni pieza.
function esHuerfano(ej, ctx) {
  if (!ej.tipo) return false;
  const m = mapeoDe(ej, ctx);
  if (!m || m.via === 'nuevo') return true;
  if (m.generador && ctx.generadores.has(m.generador)) return false;
  return !m.pieza;
}

// ======================= validar un ejercicio =======================
function presupuestoEjercicio(ej) {
  const mal = [];
  if (ej.origen && ej.origen.tipo === 'academia') return mal; // no se publica: no paga presupuesto
  if (!(ej.origen && ej.origen.tipo === 'oficial')) {
    const n = palabras(ej.enunciado) + palabras(ej.pregunta);
    if (n > PRESUPUESTO.enunciado) mal.push(`enunciado de ${n} palabras (máximo ${PRESUPUESTO.enunciado} sin los datos con color)`);
  }
  (ej.pasos || []).forEach((p, i) => {
    const n = palabras(p.texto);
    if (n > PRESUPUESTO.paso) mal.push(`paso ${i + 1} de ${n} palabras (máximo ${PRESUPUESTO.paso})`);
  });
  for (const a of ej.alternativas || []) {
    if (!a.error) continue;
    const n = palabras(a.error.explicacion);
    if (n > PRESUPUESTO.explicacion) mal.push(`explicación de «${a.error.id}» de ${n} palabras (máximo ${PRESUPUESTO.explicacion})`);
  }
  return mal;
}

function validarEjercicio(ej, ctx) {
  const errores = validarEsquema(ej, ctx.esquema);
  const avisos = [];
  if (tipoDe(ej) !== 'object') return { errores, avisos };
  const r = rango(ej.estado);
  // Unidad y curso, contra el catálogo.
  if (ej.unidad) {
    const u = ctx.unidades.get(ej.unidad);
    if (!u) errores.push(`unidad: «${ej.unidad}» no está en catalogo/cursos/`);
    else if (ej.curso && u.curso !== ej.curso) errores.push(`unidad: «${ej.unidad}» es de ${u.curso}, no de ${ej.curso}`);
    if (ej.tipo && ej.tipo.split('/')[0] !== ej.unidad.split('.')[1]) errores.push(`tipo: «${ej.tipo}» debe empezar por «${ej.unidad.split('.')[1]}/»`);
  }
  // Mapeo: el propio o el del registro.
  const m = mapeoDe(ej, ctx);
  if (r >= rango('mapeado') && !m) errores.push(`mapeo: el tipo «${ej.tipo}» no está en tipos.json y el ejercicio no trae mapeo`);
  if (m) {
    if (m.via === 'generador' && !m.generador) errores.push('mapeo: via generador sin «generador»');
    if (m.generador) {
      const g = ctx.generadores.get(m.generador);
      if (!g) errores.push(`mapeo: no existe el generador «${m.generador}» (plantilla con formato predicciones)`);
      else {
        if (ej.unidad && !g.unidades.includes(ej.unidad)) avisos.push(`mapeo: el generador «${m.generador}» no declara la unidad ${ej.unidad}`);
        if (m.subtipo && !fs.readFileSync(g.archivo, 'utf8').includes(`'${m.subtipo}'`)) avisos.push(`mapeo: no se ve el subtipo «${m.subtipo}» en ${m.generador}`);
      }
    }
    if (m.via === 'pieza' && !m.pieza) errores.push('mapeo: via pieza sin «pieza»');
    if (m.via === 'instancia' && ej.origen && ej.origen.tipo === 'academia') errores.push('mapeo: una instancia fija no puede ser de academia (regla 5)');
  }
  // Piezas: la del mapeo y la de la escena.
  const piezas = [m && m.pieza, ej.escena && ej.escena.pieza].filter(Boolean);
  for (const p of new Set(piezas)) {
    const e = estadoPieza(p, ctx);
    if (e === 'desconocida') errores.push(`pieza: «${p}» no está en nucleo/kit/piezas/ ni entre las previstas`);
    else if (e === 'prevista') {
      const instancia = m && (m.via === 'instancia' || m.via === 'pieza');
      if (instancia && ej.estado === 'publicado') errores.push(`pieza: «${p}» todavía no existe en nucleo/kit/piezas/`);
      else avisos.push(`pieza: «${p}» es prevista; aún no existe en nucleo/kit/piezas/`);
    }
  }
  // Verificación (regla 1): el resultado del código debe ser la respuesta.
  if (r >= rango('verificado')) {
    if (!ej.respuesta || ej.respuesta.valor === undefined) errores.push('respuesta: falta «valor» recalculado por código');
    const v = ej.verificacion;
    if (v && v.resultado !== undefined && ej.respuesta && ej.respuesta.valor !== undefined) {
      const igual = typeof v.resultado === 'number' && typeof ej.respuesta.valor === 'number'
        ? Math.abs(v.resultado - ej.respuesta.valor) <= 1e-9 * Math.max(1, Math.abs(v.resultado))
        : v.resultado === ej.respuesta.valor;
      if (!igual) errores.push(`verificacion: el código dio ${v.resultado} y la respuesta dice ${ej.respuesta.valor}`);
    }
    if (m && m.via === 'instancia') for (const k of ['escena', 'pasos', 'alternativas']) if (!ej[k]) errores.push(`${k}: una instancia fija verificada lo necesita`);
  }
  // Marcadores {clave} del enunciado: deben estar en datos.
  for (const campo of ['enunciado', 'pregunta']) {
    if (typeof ej[campo] !== 'string') continue;
    for (const [, k] of ej[campo].matchAll(/\{([A-Za-z0-9_]+)\}/g)) if (!ej.datos || !ej.datos[k]) errores.push(`${campo}: el marcador {${k}} no está en datos`);
  }
  // Alternativas propias: una sola correcta; fantasmas con ids de error.
  if (Array.isArray(ej.alternativas)) {
    const c = ej.alternativas.filter(a => a.correcta).length;
    if (c !== 1) errores.push(`alternativas: debe haber una sola correcta (hay ${c})`);
    for (const a of ej.alternativas) if (!a.correcta && !a.error) errores.push(`alternativas: «${a.texto}» es incorrecta y no trae error con nombre (regla 3)`);
    if (ej.respuesta && ej.respuesta.valor !== undefined) {
      const ok = ej.alternativas.find(a => a.correcta);
      if (ok && ok.valor !== undefined && ok.valor !== ej.respuesta.valor) errores.push('alternativas: la correcta no tiene el valor de la respuesta');
    }
  }
  if (ej.fantasmas) {
    const ids = new Set((ej.alternativas || []).filter(a => a.error).map(a => a.error.id));
    for (const k of Object.keys(ej.fantasmas)) if (!ids.has(k)) errores.push(`fantasmas: «${k}» no es el id de error de ninguna alternativa`);
  }
  // Presupuesto de texto: aviso antes de verificado, error desde verificado.
  const pres = presupuestoEjercicio(ej);
  (r >= rango('verificado') ? errores : avisos).push(...pres.map(x => `presupuesto: ${x}`));
  return { errores, avisos };
}

// ======================= leer una carpeta =======================
function leerCarpeta(dir) {
  const out = [];
  const recorrer = d => {
    for (const f of fs.readdirSync(d).sort()) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { recorrer(p); continue; }
      if (f === 'esquema.json' || f === 'tipos.json') continue;
      const rel = path.relative(RAIZ, p);
      try {
        if (f.endsWith('.jsonl')) {
          fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (l.trim()) out.push({ archivo: `${rel}:${i + 1}`, ej: JSON.parse(l) }); });
        } else if (f.endsWith('.json')) {
          const j = leer(p);
          const lista = Array.isArray(j) ? j : (j && Array.isArray(j.ejercicios) ? j.ejercicios : [j]);
          lista.forEach((ej, i) => out.push({ archivo: lista.length > 1 ? `${rel}[${i}]` : rel, ej }));
        }
      } catch (e) {
        out.push({ archivo: rel, ej: null, lectura: `no se pudo leer: ${e.message}` });
      }
    }
  };
  recorrer(dir);
  return out;
}

function validarCarpeta(dir, ctx = null) {
  ctx = ctx || cargarContexto({ tipos: fs.existsSync(path.join(dir, 'tipos.json')) ? path.join(dir, 'tipos.json') : TIPOS });
  const res = leerCarpeta(dir).map(x => x.lectura
    ? { archivo: x.archivo, ej: null, errores: [x.lectura], avisos: [] }
    : { archivo: x.archivo, ej: x.ej, ...validarEjercicio(x.ej, ctx) });
  const vistos = new Map();
  for (const x of res) {
    if (!x.ej || !x.ej.id) continue;
    if (vistos.has(x.ej.id)) x.errores.push(`id: «${x.ej.id}» repetido (también en ${vistos.get(x.ej.id)})`);
    else vistos.set(x.ej.id, x.archivo);
  }
  return { ctx, res };
}

// ======================= contar =======================
function contar(res, ctx) {
  const por = { curso: {}, unidad: {}, tipo: {}, pieza: {}, origen: {}, estado: {}, via: {} };
  const suma = (o, k) => { o[k] = (o[k] || 0) + 1; };
  const huerfanos = { total: 0, tipos: {} };
  let validos = 0, invalidos = 0, duplicados = 0, sinTipo = 0, figura = 0, fueraPresupuesto = 0;
  for (const x of res) {
    if (!x.ej) { invalidos++; continue; }
    const ej = x.ej;
    if (x.errores.length) invalidos++; else validos++;
    if (ej.duplicado_de) duplicados++;
    if (ej.figura_fuente) figura++;
    if (presupuestoEjercicio(ej).length) fueraPresupuesto++;
    const m = mapeoDe(ej, ctx);
    suma(por.curso, ej.curso || '(sin clasificar)');
    suma(por.unidad, ej.unidad || '(sin clasificar)');
    suma(por.tipo, ej.tipo || '(sin clasificar)');
    suma(por.pieza, (ej.escena && ej.escena.pieza) || (m && m.pieza) || '(sin pieza)');
    const o = ej.origen || {};
    suma(por.origen, o.tipo === 'oficial' ? `oficial ${o.universidad || '?'}` : (o.tipo || '(sin origen)'));
    suma(por.estado, ej.estado || '(sin estado)');
    suma(por.via, m ? m.via : (ej.tipo ? '(sin mapeo)' : '(sin clasificar)'));
    if (!ej.tipo) sinTipo++;
    if (esHuerfano(ej, ctx)) { huerfanos.total++; suma(huerfanos.tipos, ej.tipo); }
  }
  const orden = o => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
  for (const k of Object.keys(por)) por[k] = orden(por[k]);
  huerfanos.tipos = orden(huerfanos.tipos);
  return { total: res.length, validos, invalidos, duplicados, sin_tipo: sinTipo, figura_fuente: figura, fuera_de_presupuesto: fueraPresupuesto, huerfanos, por };
}

function tablaConteo(c, { maxFilas = 30 } = {}) {
  const lineas = [];
  lineas.push(`Ejercicios: ${c.total} (válidos ${c.validos}, con errores ${c.invalidos})`);
  lineas.push(`Duplicados: ${c.duplicados} · sin clasificar: ${c.sin_tipo} · con figura en la fuente: ${c.figura_fuente} · fuera de presupuesto: ${c.fuera_de_presupuesto}`);
  lineas.push(`Huérfanos (tipo sin generador ni pieza): ${c.huerfanos.total}`);
  const bloque = (titulo, o) => {
    const filas = Object.entries(o);
    if (!filas.length) return;
    const ancho = Math.max(titulo.length, ...filas.slice(0, maxFilas).map(([k]) => k.length));
    // acum: porcentaje acumulado (Pareto): cuántos tipos hacen falta para cubrir el 80 %.
    lineas.push('', `${titulo.padEnd(ancho)}  ${'n'.padStart(5)}  ${'%'.padStart(5)}  ${'acum'.padStart(5)}`, `${'-'.repeat(ancho)}  -----  -----  -----`);
    let acum = 0;
    const pc = n => `${(c.total ? Math.round(100 * n / c.total) : 0).toString().padStart(4)}%`;
    for (const [k, n] of filas.slice(0, maxFilas)) { acum += n; lineas.push(`${k.padEnd(ancho)}  ${String(n).padStart(5)}  ${pc(n)}  ${pc(acum)}`); }
    if (filas.length > maxFilas) lineas.push(`… y ${filas.length - maxFilas} más (usa --json para verlas todas)`);
  };
  for (const [k, t] of [['curso', 'Curso'], ['origen', 'Origen'], ['estado', 'Estado'], ['via', 'Vía'], ['pieza', 'Pieza'], ['unidad', 'Unidad'], ['tipo', 'Tipo']]) bloque(t, c.por[k]);
  bloque('Tipo huérfano', c.huerfanos.tipos);
  return lineas.join('\n') + '\n';
}

// ======================= auditar los generadores de hoy =======================
const OFICIAL = /\b(UNMSM|UNI|UNA|UNSA|UNSAAC)\b[^.]*20\d\d/;
// Preguntas de admisión reales de San Marcos que cubre cada módulo (docs/datos/admision-unmsm.csv, columna modulo).
function preguntasAdmision() {
  const f = path.join(RAIZ, 'docs', 'datos', 'admision-unmsm.csv');
  const n = {};
  if (!fs.existsSync(f)) return n;
  const filas = fs.readFileSync(f, 'utf8').split('\n');
  const cab = partirCSV(filas[0]), col = cab.indexOf('modulo');
  for (const l of filas.slice(1)) {
    if (!l.trim()) continue;
    const c = partirCSV(l)[col] || '';
    for (const m of c.split(/[;,]/).map(s => s.trim()).filter(Boolean)) n[m] = (n[m] || 0) + 1;
  }
  return n;
}
function partirCSV(l) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
const media = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : 0);
const maximo = l => (l.length ? Math.max(...l) : 0);

function medirProblema(p) {
  const oficial = OFICIAL.test(plano(p.datos));
  const enunciado = palabras(p.enunciado) + palabras(p.pregunta);
  const pasos = Array.isArray(p.pasos) ? p.pasos.map(x => palabras(x && x.texto)) : (p.solucion || []).map(palabras);
  const expl = (p.alternativas || []).filter(a => a.error).map(a => palabras(a.error.explicacion));
  const okE = oficial || enunciado <= PRESUPUESTO.enunciado, okP = maximo(pasos) <= PRESUPUESTO.paso, okX = maximo(expl) <= PRESUPUESTO.explicacion;
  // Carga: la peor razón contra el presupuesto (1 = justo en el límite; 2 = el doble).
  const carga = Math.max(oficial ? 0 : enunciado / PRESUPUESTO.enunciado, maximo(pasos) / PRESUPUESTO.paso, maximo(expl) / PRESUPUESTO.explicacion);
  return { oficial, enunciado, solucion: pasos.reduce((a, b) => a + b, 0), pasoMax: maximo(pasos), npasos: pasos.length, expl, okE, okP, okX, carga,
    escena: !!(p.escena && p.escena.pieza), pasosVivos: Array.isArray(p.pasos), fantasmas: !!p.fantasmas, figura: !!p.figura };
}

function auditar({ semillas = 20, solo = null, ctx = null } = {}) {
  ctx = ctx || cargarContexto();
  const adm = preguntasAdmision();
  const filas = [];
  for (const g of ctx.generadores.values()) {
    if (solo && !solo.includes(g.id)) continue;
    const t0 = Date.now();
    const gen = require(g.archivo);
    const m = [];
    let fallos = 0;
    for (let s = 0; s < semillas; s++) {
      try { m.push(medirProblema(gen.generar(`auditoria-${s}`))); } catch (e) { fallos++; }
    }
    const pct = f => (m.length ? m.filter(f).length / m.length : 0);
    const expl = m.flatMap(x => x.expl);
    filas.push({
      id: g.id, curso: g.curso, admision: adm[g.id] || 0, problemas: m.length, fallos,
      enunciado: { media: media(m.map(x => x.enunciado)), max: maximo(m.map(x => x.enunciado)) },
      solucion: { media: media(m.map(x => x.solucion)), max: maximo(m.map(x => x.solucion)) },
      paso: { media: media(m.map(x => x.pasoMax)), max: maximo(m.map(x => x.pasoMax)) },
      pasos: { media: media(m.map(x => x.npasos)) },
      explicacion: { media: media(expl), max: maximo(expl) },
      cumple: { enunciado: pct(x => x.okE), paso: pct(x => x.okP), explicacion: pct(x => x.okX), todo: pct(x => x.okE && x.okP && x.okX) },
      carga: media(m.map(x => x.carga)),
      escena: pct(x => x.escena), pasosVivos: pct(x => x.pasosVivos), fantasmas: pct(x => x.fantasmas), figura: pct(x => x.figura),
      oficiales: m.filter(x => x.oficial).length,
      ms: Date.now() - t0,
    });
  }
  for (const f of filas) f.pasa = f.problemas > 0 && f.cumple.todo === 1;
  // Orden de migración: primero lo que más preguntas reales cubre; a igualdad, lo que más se pasa del presupuesto.
  const orden = filas.filter(f => !f.pasa).sort((a, b) => b.admision - a.admision || b.carga - a.carga).map(f => f.id);
  const peores = filas.slice().sort((a, b) => b.carga - a.carga).slice(0, 10).map(f => f.id);
  const resumen = {
    generadores: filas.length, semillas,
    pasan: filas.filter(f => f.pasa).length,
    cumplen: {
      enunciado: filas.filter(f => f.cumple.enunciado === 1).length,
      paso: filas.filter(f => f.cumple.paso === 1).length,
      explicacion: filas.filter(f => f.cumple.explicacion === 1).length,
    },
    problemas_que_cumplen: media(filas.map(f => f.cumple.todo)),
    con_escena: filas.filter(f => f.escena > 0).length,
    con_pasos: filas.filter(f => f.pasosVivos > 0).length,
    con_fantasmas: filas.filter(f => f.fantasmas > 0).length,
    con_figura: filas.filter(f => f.figura > 0).length,
    media_enunciado: media(filas.map(f => f.enunciado.media)),
    media_paso: media(filas.map(f => f.paso.media)),
    media_explicacion: media(filas.map(f => f.explicacion.media)),
  };
  return { resumen, filas, orden, peores, presupuesto: PRESUPUESTO };
}

function tablaAuditoria(a) {
  const r = a.resumen, P = a.presupuesto;
  const n1 = x => x.toFixed(1).replace('.', ',');
  const pc = x => `${Math.round(100 * x)}%`;
  const l = [];
  l.push(`Auditoría de ${r.generadores} generadores, ${r.semillas} semillas cada uno. Presupuesto: enunciado ≤ ${P.enunciado}, paso ≤ ${P.paso}, explicación de error ≤ ${P.explicacion} palabras.`);
  l.push(`Pasan el presupuesto en todas las semillas: ${r.pasan} de ${r.generadores}. Cumplen enunciado: ${r.cumplen.enunciado}; pasos: ${r.cumplen.paso}; explicaciones: ${r.cumplen.explicacion}.`);
  l.push(`Problemas que cumplen todo (media por generador): ${pc(r.problemas_que_cumplen)}. Traen escena: ${r.con_escena}; pasos: ${r.con_pasos}; fantasmas: ${r.con_fantasmas}; figura SVG propia: ${r.con_figura}.`);
  l.push(`Palabras promedio: enunciado ${n1(r.media_enunciado)}, paso más largo ${n1(r.media_paso)}, explicación ${n1(r.media_explicacion)}.`, '');
  const cab = ['generador', 'curso', 'adm', 'enun med/máx', 'paso med/máx', 'sol med', 'expl med/máx', 'cumple', 'carga', 'fig', 'viva'];
  const filas = a.filas.slice().sort((x, y) => y.carga - x.carga).map(f => [
    f.id, f.curso, String(f.admision), `${n1(f.enunciado.media)}/${f.enunciado.max}`, `${n1(f.paso.media)}/${f.paso.max}`, n1(f.solucion.media),
    `${n1(f.explicacion.media)}/${f.explicacion.max}`, pc(f.cumple.todo), n1(f.carga), pc(f.figura),
    [f.escena ? 'e' : '-', f.pasosVivos ? 'p' : '-', f.fantasmas ? 'f' : '-'].join('') + (f.fallos ? ` (${f.fallos} fallos)` : ''),
  ]);
  const anchos = cab.map((c, i) => Math.max(c.length, ...filas.map(f => f[i].length)));
  const linea = f => f.map((x, i) => (i < 2 ? x.padEnd(anchos[i]) : x.padStart(anchos[i]))).join('  ');
  l.push(linea(cab), anchos.map(n => '-'.repeat(n)).join('  '), ...filas.map(linea));
  l.push('', 'adm: preguntas de admisión de San Marcos que cubre el módulo (docs/datos/admision-unmsm.csv). carga: peor razón contra el presupuesto (1 = en el límite). viva: e = escena, p = pasos, f = fantasmas.');
  l.push('', `Los 10 peores: ${a.peores.join(', ')}.`);
  l.push(`Orden de migración sugerido (más preguntas reales primero): ${a.orden.slice(0, 15).join(', ')}${a.orden.length > 15 ? `, … (${a.orden.length} en total)` : ''}.`);
  return l.join('\n') + '\n';
}

module.exports = {
  PRESUPUESTO, ESTADOS, PIEZAS_PREVISTAS, validarEsquema, plano, palabras, cargarContexto, cargarTipos, mapeoDe, esHuerfano,
  presupuestoEjercicio, validarEjercicio, leerCarpeta, validarCarpeta, contar, tablaConteo, medirProblema, auditar, tablaAuditoria, preguntasAdmision,
};

// ======================= línea de comandos =======================
if (require.main === module) {
  const args = process.argv.slice(2);
  const valor = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const json = args.includes('--json');
  const salir = (texto, codigo = 0) => { process.stdout.write(texto); process.exitCode = codigo; };
  if (args.includes('--auditar')) {
    const a = auditar({ semillas: Number(valor('--semillas') || 20), solo: valor('--generador') ? valor('--generador').split(',') : null });
    salir(json ? JSON.stringify(a, null, 2) + '\n' : tablaAuditoria(a));
  } else if (args.includes('--contar') || args.includes('--validar')) {
    const dir = path.resolve(valor('--contar') || valor('--validar') || path.join(RAIZ, 'contenido', 'ejercicios', 'ejemplos'));
    if (!fs.existsSync(dir)) { salir(`No existe ${dir}\n`, 2); return; }
    const { ctx, res } = validarCarpeta(dir);
    const conErrores = res.filter(x => x.errores.length);
    if (args.includes('--contar')) {
      const c = contar(res, ctx);
      salir(json ? JSON.stringify(c, null, 2) + '\n' : tablaConteo(c));
    } else {
      const l = [];
      for (const x of res) {
        if (!x.errores.length && !x.avisos.length) continue;
        l.push(`${x.archivo}${x.ej && x.ej.id ? ` (${x.ej.id})` : ''}`);
        for (const e of x.errores) l.push(`  ERROR  ${e}`);
        for (const e of x.avisos) l.push(`  aviso  ${e}`);
      }
      l.push(`${res.length} ejercicios: ${res.length - conErrores.length} sin errores, ${conErrores.length} con errores.`);
      salir(json ? JSON.stringify(res.map(({ archivo, ej, errores, avisos }) => ({ archivo, id: ej && ej.id, errores, avisos })), null, 2) + '\n' : l.join('\n') + '\n', conErrores.length ? 1 : 0);
    }
  } else {
    salir('Uso:\n  node herramientas/validar-ejercicios.js --validar <carpeta>\n  node herramientas/validar-ejercicios.js --contar <carpeta> [--json]\n  node herramientas/validar-ejercicios.js --auditar [--semillas N] [--generador id,id] [--json]\n', 2);
  }
}
