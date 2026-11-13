#!/usr/bin/env node
/*
 * Cortador de ejercicios: convierte PDF, HTML o texto en ejercicios «crudos» (docs/ejercicios-7000.md, sección 1).
 *
 *   node herramientas/cortar-ejercicios.js <archivo>... [--lote <nombre>] [--salida <carpeta>]
 *        [--origen academia|oficial|propio] [--universidad unmsm --periodo 2025-I] [--area A]
 *
 * Sin dependencias. El PDF pasa por `pdftotext -layout` (poppler-utils); si no trae capa de texto,
 * avisa y pide `herramientas/ocr_pdf.sh`. El HTML se limpia aquí mismo (imágenes → «[figura]»).
 *
 * Salida, por lote:
 *   crudo.jsonl        un ejercicio por línea, válido contra contenido/ejercicios/esquema.json (estado «crudo»)
 *   soluciones.ndjson  { id, solucion } con la resolución de la fuente: solo para verificar la clave, nunca se publica (regla 5)
 *   no-cortados.ndjson bloques que el script no pudo cortar: van a un LLM por páginas
 * (Las dos últimas van en .ndjson para que herramientas/validar-ejercicios.js no las lea como ejercicios.)
 * Los de academia van a fuentes/ejercicios/<lote>/ (no se versiona); los oficiales, a contenido/ejercicios/<lote>/,
 * y sus soluciones (que suelen ser de una academia) siempre a fuentes/.
 *
 * El origen se deduce del nombre del archivo si no se da: «unmsm-2025-I-area-A.pdf» → oficial;
 * «academia-<libro>.pdf» o cualquier otro → academia, con el nombre como fuente.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const UNIVERSIDADES = ['uni', 'unmsm', 'una', 'unsa', 'unsaac'];
const LETRAS = 'ABCDE';

// ---------------- Texto de cada formato ----------------

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', minus: '−', times: '×',
  divide: '÷', deg: '°', middot: '·', le: '≤', ge: '≥', ne: '≠', pi: 'π', alpha: 'α', beta: 'β', theta: 'θ', radic: '√',
  sup2: '²', sup3: '³', frac12: '½', iquest: '¿', iexcl: '¡', aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó',
  uacute: 'ú', ntilde: 'ñ', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', uuml: 'ü' };

function decodificar(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z0-9]+);/gi, (m, n) => (n in ENTIDADES ? ENTIDADES[n] : m));
}

// HTML → texto con saltos de línea donde había bloques. Las imágenes y los svg quedan como «[figura]».
function textoDeHTML(html) {
  return decodificar(html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|head|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' [figura] ')
    .replace(/<img\b[^>]*>/gi, ' [figura] ')
    .replace(/<sup>([\s\S]*?)<\/sup>/gi, '^$1')
    .replace(/<sub>([\s\S]*?)<\/sub>/gi, '_$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6]|section|article|table|ol|ul|blockquote)>/gi, '\n')
    .replace(/<(p|div|li|tr|h[1-6])\b[^>]*>/gi, '\n')
    .replace(/<\/t[dh]>/gi, '  ')
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

// PDF → páginas de texto. Devuelve { paginas: [texto], sinTexto: [números de página] }.
// modo «layout» conserva la disposición (sirve a una columna y en tablas de alternativas); modo «lectura» sigue el
// orden de lectura (sirve a dos columnas, donde «layout» pega las columnas lado a lado). procesar() prueba los dos.
function textoDePDF(archivo, modo = 'layout') {
  let salida;
  const args = (modo === 'layout' ? ['-layout'] : []).concat(['-enc', 'UTF-8', archivo, '-']);
  try { salida = execFileSync('pdftotext', args, { maxBuffer: 1 << 28 }).toString('utf8'); }
  catch (e) { throw new Error(`pdftotext no pudo leer ${archivo} (¿falta poppler-utils?): ${e.message}`); }
  const paginas = salida.split('\f');
  if (paginas.length > 1 && !paginas[paginas.length - 1].trim()) paginas.pop();
  const sinTexto = paginas.map((p, i) => (p.replace(/\s/g, '').length < 40 ? i + 1 : 0)).filter(Boolean);
  return { paginas, sinTexto };
}

// Modo «columnas»: lee los bloques con sus coordenadas (-bbox-layout) y, en cada página, pone primero los de la
// columna izquierda y después los de la derecha, cada columna de arriba abajo. Los bloques anchos (títulos que
// cruzan la página) van en su lugar según su altura, antes de las columnas que empiezan debajo.
function textoDePDFColumnas(archivo) {
  let x;
  try { x = execFileSync('pdftotext', ['-bbox-layout', '-enc', 'UTF-8', archivo, '-'], { maxBuffer: 1 << 28 }).toString('utf8'); }
  catch (e) { throw new Error(`pdftotext no pudo leer ${archivo}: ${e.message}`); }
  const num = (s, k) => +((new RegExp(k + '="([0-9.]+)"')).exec(s) || [0, 0])[1];
  const paginas = [];
  for (const pm of x.split(/<page\b/).slice(1)) {
    const ancho = num(pm, 'width'), mitad = ancho / 2;
    const bloques = [];
    for (const bm of pm.split(/<block\b/).slice(1)) {
      const x0 = num(bm, 'xMin'), x1 = num(bm, 'xMax'), y0 = num(bm, 'yMin');
      const lineas = bm.split(/<line\b/).slice(1).map(l => decodificar([...l.matchAll(/<word[^>]*>([\s\S]*?)<\/word>/g)].map(w => w[1]).join(' ')));
      const col = x1 <= mitad + ancho * 0.03 ? 0 : x0 >= mitad - ancho * 0.03 ? 1 : -1;
      bloques.push({ col, y0, texto: lineas.join('\n') });
    }
    // Orden: los anchos parten la página en franjas; dentro de cada franja, izquierda y luego derecha.
    const anchos = bloques.filter(b => b.col < 0).sort((a, b) => a.y0 - b.y0);
    const cortes = [-Infinity, ...anchos.map(b => b.y0), Infinity];
    const salida = [];
    for (let k = 0; k + 1 < cortes.length; k++) {
      if (k > 0) salida.push(anchos[k - 1].texto);
      for (const c of [0, 1]) bloques.filter(b => b.col === c && b.y0 >= cortes[k] && b.y0 < cortes[k + 1]).sort((a, b) => a.y0 - b.y0).forEach(b => salida.push(b.texto));
    }
    paginas.push(salida.join('\n'));
  }
  const sinTexto = paginas.map((p, i) => (p.replace(/\s/g, '').length < 40 ? i + 1 : 0)).filter(Boolean);
  return { paginas, sinTexto };
}

function leerArchivo(archivo, modo) {
  const ext = path.extname(archivo).toLowerCase();
  if (ext === '.pdf') return modo === 'columnas' ? textoDePDFColumnas(archivo) : textoDePDF(archivo, modo);
  const bruto = fs.readFileSync(archivo, 'utf8');
  const texto = /\.html?$/.test(ext) ? textoDeHTML(bruto) : bruto.replace(/\r\n?/g, '\n');
  return { paginas: texto.split('\f'), sinTexto: [] };
}

// ---------------- Origen desde el nombre del archivo ----------------

function origenDeNombre(archivo, op = {}) {
  const base = path.basename(archivo).replace(/\.[^.]+$/, '');
  const m = /^(uni|unmsm|una|unsa|unsaac)-(20\d{2})-(I{1,3}|[12])(?:-area-([a-z0-9]+))?/i.exec(base);
  const tipo = op.origen || (m ? 'oficial' : 'academia');
  const o = { tipo };
  if (tipo === 'oficial') {
    o.universidad = (op.universidad || (m && m[1]) || '').toLowerCase();
    o.periodo = op.periodo || (m && `${m[2]}-${m[3].toUpperCase()}`);
    const area = op.area || (m && m[4]);
    if (area) o.area = area.toUpperCase();
    if (!UNIVERSIDADES.includes(o.universidad) || !o.periodo) throw new Error(`Oficial sin universidad o periodo: usa --universidad y --periodo, o nombra el archivo como «unmsm-2025-I-area-A.pdf» (${archivo})`);
  }
  o.fuente = path.basename(archivo);
  return o;
}

// ---------------- Corte ----------------

// Inicio de un ejercicio: «12.», «12)», «12 -», «Problema 12», «PREGUNTA N.º 12:», «Ejercicio 12».
const RE_INICIO = /^\s*(?:(?:problema|pregunta|ejercicio|ítem|item)\s*(?:n\.?\s*[°º]?\s*)?)?(\d{1,4})\s*(?:[.)\-–:]|(?=\s+[A-ZÁÉÍÓÚÑ¿¡(]))\s*/i;
const RE_CON_PALABRA = /^\s*(?:problema|pregunta|ejercicio|ítem|item)\b/i;
// Inicio de la resolución que traen los libros resueltos.
const RE_SOLUCION = /^\s*(?:resoluci[oó]n|soluci[oó]n|desarrollo|resolviendo)\b\s*[:.]?/i;
// Respuesta declarada: «Rpta.: B», «Respuesta: C», «Clave: D», «Clave B».
const RE_RPTA = /\b(?:rpta|respuesta|clave)\s*\.?\s*[:=]?\s*\(?([A-E])\)?(?![a-zñ])/i;
// Encabezado de la tabla de claves al final del archivo.
const RE_CLAVES = /^\s*(?:claves?|clave de respuestas|respuestas|solucionario)\s*[:.]?\s*$/i;

// Busca las alternativas A…E en orden dentro de un texto. Acepta «A) 12», «(A) 12», «A. 12», «a) 12», varias en una línea.
function alternativas(texto) {
  const marcas = [];
  const re = /(^|[\s;])\(?([A-Ea-e])\)\s*|(^|\s)([A-E])\.\s+(?=\S)/g;
  let m;
  while ((m = re.exec(texto))) {
    const letra = (m[2] || m[4]).toUpperCase();
    const ini = m.index + (m[1] || m[3] || '').length;
    marcas.push({ letra, ini, fin: re.lastIndex });
  }
  // La secuencia buena: la última que empieza en A y sigue B, C, D (y E opcional), en orden.
  let mejor = null;
  for (let i = 0; i < marcas.length; i++) {
    if (marcas[i].letra !== 'A') continue;
    const sec = [marcas[i]];
    for (let j = i + 1; j < marcas.length && sec.length < 5; j++) if (marcas[j].letra === LETRAS[sec.length]) sec.push(marcas[j]);
    if (sec.length >= 4) mejor = sec;
  }
  if (!mejor) return null;
  const textos = mejor.map((mk, k) => texto.slice(mk.fin, k + 1 < mejor.length ? mejor[k + 1].ini : undefined).replace(/\s+/g, ' ').trim());
  if (textos.some(t => !t)) return null;
  return { antes: texto.slice(0, mejor[0].ini), textos };
}

// Tabla de claves al final: «1. B  2. C  3-A …» o «1 B / 2 C».
function leerClaves(lineas) {
  const claves = {};
  for (const l of lineas) {
    const re = /(\d{1,4})\s*[.)\-–:]?\s*\(?([A-E])\)?(?![a-zñ])/g;
    let m;
    while ((m = re.exec(l))) claves[+m[1]] = m[2];
  }
  return claves;
}

const limpia = s => s.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
const PALABRAS_FIGURA = /\[figura\]|\b(figura|gráfico|grafico|diagrama|mostrad[oa]|adjunt[oa]|se muestra|siguiente gráfica|en la imagen)\b/i;

// ¿Lo que empieza en la línea i parece un ejercicio? Hasta la próxima resolución (o 15 líneas) debe haber
// alternativas o una pregunta. Sirve para no cortar en los pasos numerados de una resolución.
function pareceEjercicio(lineas, i, fin) {
  const tramo = [];
  // El tramo termina en la próxima resolución, en una «Rpta.» o en el próximo número: no se mira el ejercicio siguiente.
  for (let k = i; k < Math.min(fin, i + 15); k++) {
    const t = lineas[k].t;
    if (k > i && (RE_SOLUCION.test(t) || RE_INICIO.test(t))) break;
    if (RE_RPTA.test(t) && !alternativas(tramo.join('\n'))) break;
    tramo.push(t);
  }
  const t = tramo.join('\n');
  return /\?/.test(t) || alternativas(t) !== null;
}

// Corta las páginas en bloques numerados. Exige numeración casi correlativa para no cortar en los «2.» de una resolución.
function cortar(paginas) {
  const lineas = [];
  paginas.forEach((p, i) => p.split('\n').forEach(t => lineas.push({ t, pagina: i + 1 })));
  // La tabla de claves (si la hay) se separa: desde su encabezado hasta el final.
  let fin = lineas.length, claves = {};
  for (let i = lineas.length - 1; i >= Math.max(0, lineas.length - 400); i--) {
    if (RE_CLAVES.test(lineas[i].t)) {
      // Es tabla si la mayoría de las líneas que siguen son pares número-letra (y no el texto de otro capítulo).
      const resto = lineas.slice(i + 1).map(x => x.t).filter(t => t.trim());
      const c = leerClaves(resto);
      const conPar = resto.filter(t => Object.keys(leerClaves([t])).length).length;
      if (Object.keys(c).length && conPar >= 0.6 * resto.length) { claves = c; fin = i; }
      break;
    }
  }
  const bloques = [];
  let actual = null, esperado = null, enSolucion = false;
  for (let i = 0; i < fin; i++) {
    const { t, pagina } = lineas[i];
    const m = RE_INICIO.exec(t);
    const n = m ? +m[1] : null;
    // Un número nuevo cuenta como inicio si sigue la numeración (n = esperado), si reinicia en 1, si trae
    // «Problema/Pregunta», o si es el primero. Dentro de una resolución solo cuenta si sigue la numeración.
    const correlativo = n !== null && esperado !== null && n === esperado;
    const inicio = n !== null && n > 0 && (enSolucion
      ? correlativo && pareceEjercicio(lineas, i, fin) // el «2.» de una resolución no abre un ejercicio
      : correlativo || esperado === null || n === 1 || RE_CON_PALABRA.test(t));
    if (inicio) {
      actual = { numero: n, pagina, texto: [t.slice(m[0].length)], solucion: [] };
      bloques.push(actual); esperado = n + 1; enSolucion = false;
      continue;
    }
    if (!actual) continue;
    if (RE_SOLUCION.test(t)) { enSolucion = true; actual.solucion.push(t.replace(RE_SOLUCION, '')); continue; }
    (enSolucion ? actual.solucion : actual.texto).push(t);
  }
  return { bloques, claves };
}

// Bloque → ejercicio crudo (o motivo por el que no se pudo).
function aEjercicio(b, lote, origen, claves) {
  const texto = limpia(b.texto.join('\n'));
  const solucion = limpia(b.solucion.join('\n'));
  const alts = alternativas(texto);
  const id = `${lote}-${String(b.numero).padStart(4, '0')}`;
  if (!alts) return { error: 'sin alternativas A–D en orden', id, numero: b.numero, pagina: b.pagina, texto, solucion };
  const enunciado = alts.antes.replace(/\s+/g, ' ').trim();
  if (enunciado.split(' ').length < 3) return { error: 'enunciado vacío o muy corto', id, numero: b.numero, pagina: b.pagina, texto, solucion };
  // Una «Clave: D» o «Rpta.: B» pegada después de la última alternativa no es parte de ella.
  const k = alts.textos.length - 1, enUltima = RE_RPTA.exec(alts.textos[k]);
  if (enUltima) alts.textos[k] = alts.textos[k].slice(0, enUltima.index).trim();
  if (!alts.textos[k]) return { error: 'última alternativa vacía', id, numero: b.numero, pagina: b.pagina, texto, solucion };
  // La clave: la tabla del final manda; si no, la «Rpta.» de la resolución o la que venía tras las alternativas.
  const rpta = (RE_RPTA.exec(solucion) || enUltima || [])[1];
  const clave = claves[b.numero] || (rpta && rpta.toUpperCase());
  const ej = {
    id, lote, estado: 'crudo',
    origen: { ...origen, numero: b.numero, pagina: b.pagina },
    enunciado,
    alternativas_fuente: alts.textos,
  };
  if (clave && LETRAS.slice(0, alts.textos.length).includes(clave)) ej.clave_fuente = clave;
  if (PALABRAS_FIGURA.test(texto)) ej.figura_fuente = true;
  if (claves[b.numero] && rpta && claves[b.numero] !== rpta.toUpperCase()) ej.notas = `La tabla de claves dice ${claves[b.numero]} y la resolución, ${rpta.toUpperCase()}: revisar.`;
  return { ej, solucion };
}

function procesar(archivo, op = {}) {
  const origen = origenDeNombre(archivo, op);
  const base = path.basename(archivo).replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const lote = op.lote || (origen.tipo === 'oficial' ? `of-${base}` : `ac-${base.replace(/^academia-/, '')}`);
  const modos = path.extname(archivo).toLowerCase() === '.pdf' ? ['layout', 'columnas', 'lectura'] : [null];
  let mejor = null;
  for (const modo of modos) {
    const r = armar(archivo, modo, lote, origen);
    r.calidad = calidad(r);
    if (!mejor || r.calidad > mejor.calidad || (r.calidad === mejor.calidad && r.ejercicios.length > mejor.ejercicios.length)) mejor = r;
  }
  return mejor;
}

// Cuántos ejercicios salieron limpios: una sola pregunta en el enunciado y ningún «13. Un…» de otro ejercicio
// metido dentro (señal de que se pegaron dos columnas). Decide el modo de lectura del PDF.
function calidad(r) {
  return r.ejercicios.filter(e => (e.enunciado.match(/\?/g) || []).length <= 1
    && !/(^|\s)\d{1,4}\s*[.)]\s+[A-ZÁÉÍÓÚÑ¿]/.test(e.enunciado)).length;
}

function armar(archivo, modo, lote, origen) {
  const { paginas, sinTexto } = leerArchivo(archivo, modo);
  const { bloques, claves } = cortar(paginas);
  const ejercicios = [], soluciones = [], noCortados = [];
  const vistos = new Set();
  for (const b of bloques) {
    const r = aEjercicio(b, lote, origen, claves);
    if (r.error) { noCortados.push(r); continue; }
    if (vistos.has(r.ej.id)) { noCortados.push({ error: 'número repetido', id: r.ej.id, numero: b.numero, pagina: b.pagina, texto: r.ej.enunciado }); continue; }
    vistos.add(r.ej.id);
    ejercicios.push(r.ej);
    if (r.solucion) soluciones.push({ id: r.ej.id, solucion: r.solucion });
  }
  return { lote, origen, modo, paginas: paginas.length, sinTexto, ejercicios, soluciones, noCortados, claves: Object.keys(claves).length };
}

function escribir(res, salida) {
  const dirEj = salida || path.join(RAIZ, res.origen.tipo === 'oficial' ? 'contenido' : 'fuentes', 'ejercicios', res.lote);
  const dirPriv = salida || path.join(RAIZ, 'fuentes', 'ejercicios', res.lote);
  fs.mkdirSync(dirEj, { recursive: true }); fs.mkdirSync(dirPriv, { recursive: true });
  const jsonl = xs => xs.map(x => JSON.stringify(x)).join('\n') + (xs.length ? '\n' : '');
  fs.writeFileSync(path.join(dirEj, 'crudo.jsonl'), jsonl(res.ejercicios));
  fs.writeFileSync(path.join(dirPriv, 'soluciones.ndjson'), jsonl(res.soluciones));
  fs.writeFileSync(path.join(dirPriv, 'no-cortados.ndjson'), jsonl(res.noCortados));
  return { dirEj, dirPriv };
}

function resumen(res, dirs) {
  const conClave = res.ejercicios.filter(e => e.clave_fuente).length;
  const conFig = res.ejercicios.filter(e => e.figura_fuente).length;
  const total = res.ejercicios.length + res.noCortados.length;
  const pct = n => (total ? Math.round(100 * n / total) : 0) + ' %';
  return [
    `Lote ${res.lote} (${res.origen.tipo}${res.origen.universidad ? ` ${res.origen.universidad} ${res.origen.periodo}` : ''}) · ${res.paginas} páginas${res.modo ? ` · pdftotext en modo ${res.modo}` : ''}`,
    `  cortados: ${res.ejercicios.length} de ${total} (${pct(res.ejercicios.length)}) · con clave: ${conClave} · con resolución: ${res.soluciones.length} · con figura en la fuente: ${conFig}`,
    `  no cortados: ${res.noCortados.length}${res.noCortados.length ? ` (→ LLM por páginas: ${[...new Set(res.noCortados.map(x => x.pagina))].slice(0, 12).join(', ')}${res.noCortados.length > 12 ? '…' : ''})` : ''}`,
    res.claves ? `  tabla de claves al final: ${res.claves} respuestas` : '  sin tabla de claves al final (la clave sale de la «Rpta.» de cada resolución)',
    res.sinTexto.length ? `  AVISO: ${res.sinTexto.length} páginas sin capa de texto (escaneadas): pásalas por herramientas/ocr_pdf.sh y vuelve a cortar` : null,
    dirs ? `  → ${path.relative(RAIZ, dirs.dirEj)}/crudo.jsonl · ${path.relative(RAIZ, dirs.dirPriv)}/{soluciones,no-cortados}.ndjson` : null,
  ].filter(Boolean).join('\n');
}

function main(argv) {
  const op = {}, archivos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) op[a.slice(2)] = argv[++i];
    else archivos.push(a);
  }
  if (!archivos.length) {
    console.error('Uso: node herramientas/cortar-ejercicios.js <archivo.pdf|.html|.txt>... [--lote x] [--salida carpeta] [--origen academia|oficial|propio] [--universidad unmsm --periodo 2025-I] [--area A]');
    return 2;
  }
  let fallas = 0;
  for (const f of archivos) {
    try {
      const res = procesar(f, archivos.length > 1 ? { ...op, lote: undefined } : op);
      console.log(resumen(res, escribir(res, op.salida)));
    } catch (e) { fallas++; console.error(`${f}: ${e.message}`); }
  }
  return fallas ? 1 : 0;
}

module.exports = { textoDeHTML, origenDeNombre, alternativas, leerClaves, cortar, procesar, escribir, resumen };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
