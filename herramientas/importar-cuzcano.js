#!/usr/bin/env node
// Importa el banco Cuzcano (traspaso de D:) a contenido/ejercicios/cuzcano/, un tema a la vez.
// Regla 5 (13 nov 2026): todo ejercicio entra con su cita. Ver contenido/ejercicios/LEEME.md.
//
//   node herramientas/importar-cuzcano.js --tema algebra.polinomios-y-grados [--limite 5] [--seco]
//   node herramientas/importar-cuzcano.js --sin-tema algebra            fichas pendientes de clasificar del curso
//   node herramientas/importar-cuzcano.js --listar                       temas del índice con sus conteos
//
// Origen: --desde <carpeta fuentes/ocr-local/cuzcano> o la variable MESA_CUZCANO.
// El inventario de libros se busca en <proyecto>/fuentes/cuzcano/inventario.json (o --inventario).
//
// Idempotente: el id sale del uid de la ficha, así que repetir la importación reemplaza la línea y no
// duplica. Lo que una persona escribió en banco.revision se conserva. El archivo queda ordenado por id.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const DESTINO = path.join(RAIZ, 'contenido', 'ejercicios', 'cuzcano');
const TEMAS = path.join(DESTINO, 'temas.json');
const DESDE_DEFECTO = 'D:/ChatGPT/Fanservice Historica Económica/fuentes/ocr-local/cuzcano';
const EDITORIAL = 'Editorial Cuzcano';
const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));

// id estable a partir del uid «<libro>:<tipo>:<número>».
function idDeUid(uid) {
  const limpio = uid.split(':').map(p => p.replace(/[^A-Za-z0-9._-]+/g, '-')).join('-');
  return `cz-${limpio}`.replace(/-+/g, '-');
}

function rotuloProblema(tipo, numero) {
  const t = String(tipo || 'problema').replace(/[-_]+/g, ' ').trim();
  if (t === 'problema') return `problema ${numero}`;
  if (t === 'propuesto') return `problema propuesto ${numero}`;
  return `${t}, problema ${numero}`;
}

function armarCita({ libro, autor, coleccion, rotulo, pagina, paginaPdf }) {
  const partes = [];
  const autorReal = autor && autor !== EDITORIAL ? autor : null;
  const titulo = coleccion && !libro.includes(coleccion) ? `${libro} (${coleccion})` : libro;
  if (autorReal) partes.push(autorReal);
  partes.push(titulo, EDITORIAL, rotulo);
  if (pagina) partes.push(`p. ${pagina}`);
  else if (paginaPdf) partes.push(`p. ${paginaPdf} del PDF`);
  return partes.join(', ') + '.';
}

// Alternativas como vienen en la ficha ({ A: 6, B: -6 } o lista) → ["A) 6", …], solo si son de 2 a 5.
function alternativasFuente(alt) {
  if (!alt) return null;
  const pares = Array.isArray(alt) ? alt.map((v, i) => ['ABCDE'[i], v]) : Object.entries(alt);
  if (pares.length < 2 || pares.length > 5) return null;
  return pares.map(([k, v]) => `${k}) ${typeof v === 'object' ? JSON.stringify(v) : v}`);
}

function respuestaDe(res) {
  if (!res || typeof res !== 'object') return null;
  if (typeof res.valor === 'number' || typeof res.valor === 'string') return { valor: res.valor };
  if (typeof res.expresion === 'string' && res.expresion.trim()) return { texto: res.expresion.trim() };
  return null;
}

function claveDe(res) {
  if (!res || typeof res !== 'object') return null;
  const k = res.alternativa || res.alternativa_cotejada;
  if (typeof k === 'string' && /^[A-E]$/.test(k.trim())) return k.trim();
  if (typeof res.expresion === 'string') {
    const m = res.expresion.match(/alternativa\s+([A-E])\b/i);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

// Un ejercicio del manifiesto + su ficha → ejercicio del esquema (estado crudo).
function convertir(e, ficha, { curso, temaId, unidad, libros, previo }) {
  const [libroId, tipoUid, numeroUid] = e.uid.split(':');
  const fuente = (ficha && ficha.fuente) || {};
  const inv = libros.get(libroId) || {};
  const libro = inv.titulo || fuente.libro_titulo || libroId;
  const numero = Number.isInteger(fuente.numero) ? fuente.numero : (/^\d+$/.test(numeroUid) ? Number(numeroUid) : null);
  const tipo = fuente.tipo || tipoUid;
  const pagina = (fuente.paginas_impresas || [])[0];
  const paginasPdf = e.paginas_pdf || fuente.paginas_pdf || [];
  const rotulo = numero ? rotuloProblema(tipo, numero) : `${String(tipo).replace(/[-_]+/g, ' ')} ${numeroUid}`;

  const origen = { tipo: 'libro', fuente: libroId, libro };
  if (inv.coleccion) origen.coleccion = inv.coleccion;
  if (inv.autor && inv.autor !== EDITORIAL) origen.autor = inv.autor;
  origen.editorial = EDITORIAL;
  if (numero) origen.problema = { tipo, numero };
  if (Number.isInteger(pagina)) origen.pagina = pagina;
  if (paginasPdf.length) origen.paginas_pdf = paginasPdf;
  origen.cita = armarCita({ libro, autor: inv.autor, coleccion: inv.coleccion, rotulo, pagina, paginaPdf: paginasPdf[0] });

  const ej = { id: idDeUid(e.uid), lote: 'cuzcano', estado: 'crudo', origen };
  if (curso) ej.curso = curso;
  if (unidad) ej.unidad = unidad;
  const texto = (ficha && typeof ficha.enunciado === 'string' && ficha.enunciado.trim()) || e.titulo || '(sin enunciado en la ficha)';
  // Los enunciados de origen usan llaves literales para conjuntos y exponentes.
  // El esquema reserva {clave} para datos interpolados solo en texto plano.
  ej.enunciado = /\{[A-Za-z0-9_]+\}/.test(texto) ? [texto] : texto;
  if (ficha && (ficha.expresion_latex || ficha.expresion_texto)) {
    ej.expresion = {};
    if (ficha.expresion_latex) ej.expresion.latex = ficha.expresion_latex;
    if (ficha.expresion_texto) ej.expresion.texto = ficha.expresion_texto;
  }
  const alt = alternativasFuente(ficha && ficha.alternativas);
  if (alt) ej.alternativas_fuente = alt;
  const clave = claveDe(ficha && ficha.resultado);
  if (clave) ej.clave_fuente = clave;
  const resp = respuestaDe(ficha && ficha.resultado);
  if (resp) ej.respuesta = resp;
  if (e.grafico || (ficha && ficha.grafico)) ej.figura_fuente = true;

  const banco = { uid: e.uid, tema: temaId };
  if (e.subtema !== undefined) banco.subtema = e.subtema;
  if (e.titulo) banco.titulo = e.titulo;
  banco.estado_ficha = e.estado ?? (ficha && ficha.estado) ?? null;
  banco.revisar_antes_de_integrar = e.revisar_antes_de_integrar ?? null;
  banco.requiere_aclaracion = e.requiere_aclaracion_para_producto ?? null;
  banco.ficha_ruta = e.ficha;
  if (e.lector) banco.lector = e.lector;
  if (e.grafico) { banco.figura = `figuras/${ej.id}.svg`; banco.tipo_figura = e.tipo_grafico ?? null; }
  if (previo && previo.banco && previo.banco.revision) banco.revision = previo.banco.revision;
  banco.ficha = ficha;
  ej.banco = banco;
  return ej;
}

function leerJsonl(f) {
  if (!fs.existsSync(f)) return new Map();
  const m = new Map();
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) if (l.trim()) { const x = JSON.parse(l); m.set(x.id, x); }
  return m;
}
function escribirJsonl(f, mapa) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  const filas = [...mapa.values()].sort((a, b) => a.id.localeCompare(b.id)).map(x => JSON.stringify(x));
  fs.writeFileSync(f, filas.join('\n') + '\n');
}

function cargarLibros(archivo) {
  const m = new Map();
  if (archivo && fs.existsSync(archivo)) for (const l of leer(archivo).libros || []) m.set(l.id, l);
  return m;
}

// Importa los ejercicios de un manifiesto. Devuelve el resumen; con seco no escribe nada.
function importar({ desde, manifiesto, curso, temaId, unidad, libros, limite = Infinity, seco = false, destino = DESTINO }) {
  const dirTraspaso = path.join(desde, 'traspaso-claude');
  const m = leer(path.join(dirTraspaso, manifiesto));
  const nombre = temaId.includes('.') ? temaId.split('.').slice(1).join('.') : temaId;
  const archivo = path.join(destino, curso, `${nombre}.jsonl`);
  const actuales = leerJsonl(archivo);
  const res = { archivo: path.relative(RAIZ, archivo), leidos: 0, nuevos: 0, actualizados: 0, iguales: 0, figuras: 0, sin_ficha: [], sin_enunciado: [], revisar: 0 };
  for (const e of m.ejercicios.slice(0, limite)) {
    res.leidos++;
    const rutaFicha = path.join(desde, e.ficha.split('#')[0]);
    const id = idDeUid(e.uid);
    const antes = actuales.get(id);
    if (!fs.existsSync(rutaFicha)) {
      res.sin_ficha.push(e.uid);
      continue;
    }
    const ficha = leer(rutaFicha);
    if (typeof ficha.enunciado !== 'string' || !ficha.enunciado.trim()) {
      // Una ficha piloto puede haberse completado y clasificado después con el escaneo.
      if (antes?.banco?.uid === e.uid && antes.banco.ficha?.enunciado) {
        res.iguales++;
        if (antes.banco.revisar_antes_de_integrar) res.revisar++;
      } else {
        res.sin_enunciado.push(e.uid);
      }
      continue;
    }
    const ej = convertir(e, ficha, { curso, temaId, unidad, libros, previo: antes });
    if (ej.banco.revisar_antes_de_integrar) res.revisar++;
    if (!antes) res.nuevos++;
    else if (JSON.stringify(antes) === JSON.stringify(ej)) res.iguales++;
    else res.actualizados++;
    actuales.set(id, ej);
    if (e.grafico) {
      const svg = path.join(desde, e.grafico);
      if (fs.existsSync(svg)) {
        res.figuras++;
        if (!seco) { fs.mkdirSync(path.join(destino, 'figuras'), { recursive: true }); fs.copyFileSync(svg, path.join(destino, ej.banco.figura)); }
      }
    }
  }
  res.total_en_archivo = actuales.size;
  if (!seco && (res.nuevos || res.actualizados)) escribirJsonl(archivo, actuales);
  return res;
}

function main(argv) {
  const arg = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const desde = arg('--desde') || process.env.MESA_CUZCANO || DESDE_DEFECTO;
  if (!fs.existsSync(path.join(desde, 'traspaso-claude', 'indice.json'))) {
    console.error(`No encuentro ${path.join(desde, 'traspaso-claude', 'indice.json')}. Pasa --desde <fuentes/ocr-local/cuzcano>.`);
    return 2;
  }
  const indice = leer(path.join(desde, 'traspaso-claude', 'indice.json'));
  if (argv.includes('--listar')) {
    for (const c of indice.cursos) for (const t of c.temas) console.log(`${t.id}\t${t.fichas}\t(revisar ${t.por_revisar ?? '?'})`);
    return 0;
  }
  const inventario = arg('--inventario') || path.join(desde, '..', '..', 'cuzcano', 'inventario.json');
  const libros = cargarLibros(inventario);
  if (!libros.size) console.warn(`Aviso: sin inventario de libros (${inventario}); la cita usará el título de la ficha.`);
  const temas = fs.existsSync(TEMAS) ? leer(TEMAS).temas || {} : {};
  const limite = arg('--limite') ? Number(arg('--limite')) : Infinity;
  const seco = argv.includes('--seco');

  let trabajo;
  if (arg('--tema')) {
    const id = arg('--tema');
    const curso = indice.cursos.find(c => c.temas.some(t => t.id === id));
    if (!curso) { console.error(`El tema «${id}» no está en el índice. Usa --listar.`); return 2; }
    const t = curso.temas.find(t => t.id === id);
    trabajo = { manifiesto: t.manifiesto, curso: curso.id, temaId: id, unidad: temas[id] || null };
  } else if (arg('--sin-tema')) {
    const curso = arg('--sin-tema');
    const datos = indice.cursos.find(c => c.id === curso);
    if (!datos) { console.error(`El curso «${curso}» no está en el índice.`); return 2; }
    if (!datos.sin_tema) { console.log(`${curso}: sin fichas pendientes de tema.`); return 0; }
    trabajo = { manifiesto: datos.sin_tema.manifiesto, curso, temaId: `${curso}.sin-tema`, unidad: null };
  } else {
    console.error('Uso: --tema <curso.tema> | --sin-tema <curso> | --listar   [--limite n] [--seco] [--desde carpeta]');
    return 2;
  }
  const res = importar({ desde, libros, limite, seco, ...trabajo });
  console.log(`${seco ? '(seco) ' : ''}${trabajo.temaId} → ${res.archivo}${trabajo.unidad ? ` (unidad ${trabajo.unidad})` : ' (sin unidad: agrégala en cuzcano/temas.json)'}`);
  console.log(`  leídos ${res.leidos}: nuevos ${res.nuevos}, actualizados ${res.actualizados}, iguales ${res.iguales}; en el archivo ${res.total_en_archivo}`);
  console.log(`  figuras ${res.figuras}; por revisar antes de integrar ${res.revisar}${res.sin_ficha.length ? `; SIN FICHA ${res.sin_ficha.length}: ${res.sin_ficha.join(', ')}` : ''}`);
  if (res.sin_enunciado.length) console.error(`  SIN ENUNCIADO ${res.sin_enunciado.length}: ${res.sin_enunciado.join(', ')}`);
  return res.sin_ficha.length || res.sin_enunciado.length ? 1 : 0;
}

module.exports = { idDeUid, armarCita, alternativasFuente, respuestaDe, claveDe, convertir, importar, leerJsonl };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
