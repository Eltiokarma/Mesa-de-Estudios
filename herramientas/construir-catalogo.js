// Junta catalogo/cursos/*.json y plantillas/*/plantilla.json en un solo archivo para la app:
// app/datos/catalogo.json. La app lee solo ese archivo, así funciona sin conexión.
//   node herramientas/construir-catalogo.js   (o npm run catalogo)
// El servidor local lo arma al vuelo; el archivo escrito sirve para publicar la app como
// sitio estático. Una prueba (app/app.test.js) avisa si quedó desactualizado.
// También arma app/datos/pruebas.json con el banco de pruebas de entrada y salida por curso
// (catalogo/pruebas/<curso>.json), sin los datos que solo sirven para verificarlo, y
// contenido/razonamiento-verbal/codigos.json desde el informe (herramientas/codigos-verbal.js), y el papel.json
// de cada módulo de lectura desde su banco (herramientas/papel-lectura.js).

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'app', 'datos', 'catalogo.json');
const SALIDA_PRUEBAS = path.join(RAIZ, 'app', 'datos', 'pruebas.json');
const ORDEN_AREAS = ['ciencias', 'matematica', 'razonamiento', 'letras'];

// Teoría interactiva (docs/teoria.md): si existe contenido/teoria/<curso>/<unidad>.js, la unidad trae
// teoria: { archivo, requiere, ideas }. requiere son las piezas del kit que pide el archivo (las lee en Node, sin DOM),
// para que el service worker las guarde y la teoría abra sin conexión.
// El servidor local arma el catálogo en cada pedido: se guarda lo leído por fecha de modificación, y el módulo se
// suelta de module.children (si no, cada recarga dejaba 152 módulos vivos y Node se quedaba sin memoria).
const teoriaLeida = new Map();
const Glosario = require('../nucleo/glosario.js');
function leerTeoria(u) {
  const [curso, slug] = u.id.split('.');
  const rel = `contenido/teoria/${curso}/${slug}.js`;
  const abs = path.join(RAIZ, rel);
  if (!fs.existsSync(abs)) return null;
  const t = fs.statSync(abs).mtimeMs, previo = teoriaLeida.get(abs);
  if (previo && previo.t === t) return previo;
  delete require.cache[require.resolve(abs)];
  const def = require(abs);
  delete require.cache[require.resolve(abs)];
  module.children = module.children.filter(m => m.id !== abs);
  // Del archivo solo se guarda lo que necesitan el catálogo y el glosario (no el módulo entero).
  // titulos (18 nov): id → título de cada idea, para que Ejercicios ofrezca practicar idea por idea.
  const x = { t, r: { teoria: { archivo: `/${rel}`, requiere: def.requiere || [], ideas: (def.ideas || []).length,
    titulos: Object.fromEntries((def.ideas || []).map(i => [i.id, i.titulo])) } },
    glosario: def.glosario || [], glosarioSin: def.glosarioSin, texto: Glosario.texto(def) };
  teoriaLeida.set(abs, x);
  return x;
}
const teoriaDe = u => { const x = leerTeoria(u); return x ? x.r : {}; };
// Apertura de la unidad (docs/metodo/apertura-pisa.md): si existe contenido/aperturas/<curso>/<unidad>.js, la unidad
// trae apertura: '/contenido/aperturas/…'. La portada la carga y el service worker la guarda.
const aperturaDe = u => {
  const [curso, slug] = u.id.split('.'), rel = `contenido/aperturas/${curso}/${slug}.js`;
  return fs.existsSync(path.join(RAIZ, rel)) ? { apertura: `/${rel}` } : {};
};

// Glosario de un curso (nucleo/glosario.js): los términos que define cada unidad, en el orden del curso, y en qué
// unidades aparece cada uno. La app lo lee de app/datos/glosario/<curso>.json.
function glosarioDeCurso(c) {
  const us = c.unidades.map(u => ({ u, x: leerTeoria(u) })).filter(y => y.x)
    .map(({ u, x }) => ({ id: u.id, nombre: u.nombre, def: { glosario: x.glosario, glosarioSin: x.glosarioSin }, texto: x.texto }));
  return Glosario.indice(us);
}
function construirGlosario() {
  const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  const dir = path.join(RAIZ, 'catalogo', 'cursos'), out = {};
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const c = leer(path.join(dir, f)), g = glosarioDeCurso(c);
    out[c.id] = { curso: c.id, entradas: g.entradas, problemas: g.problemas };
  }
  return out;
}

function construir() {
  const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  const universidades = leer(path.join(RAIZ, 'catalogo', 'universidades.json'));
  const dirCursos = path.join(RAIZ, 'catalogo', 'cursos');
  const cursos = fs.readdirSync(dirCursos).filter(f => f.endsWith('.json')).sort()
    .map(f => leer(path.join(dirCursos, f)))
    .sort((a, b) => ORDEN_AREAS.indexOf(a.area) - ORDEN_AREAS.indexOf(b.area) || a.nombre.localeCompare(b.nombre, 'es'))
    .map(c => ({
      id: c.id, nombre: c.nombre, area: c.area, formato_principal: c.formato_principal, ramas: c.ramas,
      unidades: c.unidades.map(u => Object.assign({
        id: u.id, nombre: u.nombre, temas: u.temas, universidades: u.universidades,
        potencial_visual: u.potencial_visual, grado: u.grado, requiere: u.requiere, plantillas: u.plantillas,
      }, teoriaDe(u), aperturaDe(u))),
    }));
  // Cuántos términos del glosario del curso aparecen en cada unidad (los propios y los que vienen de otra): la app
  // muestra el chip «Glosario» solo si hay alguno.
  for (const c of cursos) {
    const { entradas } = glosarioDeCurso(c);
    for (const u of c.unidades) {
      const n = entradas.filter(e => e.aparece.includes(u.id)).length;
      if (u.teoria && n) u.teoria.terminos = n;
    }
  }
  const dirPl = path.join(RAIZ, 'plantillas');
  const plantillas = {};
  for (const d of fs.readdirSync(dirPl).sort()) {
    const ficha = path.join(dirPl, d, 'plantilla.json');
    if (!fs.existsSync(ficha)) continue;
    const f = leer(ficha);
    const formato = f.formato || 'escena';
    const url = a => path.posix.join(`/plantillas/${f.id}`, a); // normaliza "../../contenido/…"
    if (formato === 'lectura') {
      // Lectura: se lee dentro de la app (app/lectura.js). Los archivos son el banco entero, para tenerlo
      // sin conexión: el índice primero, después los códigos, las frases y cada texto y ejercicio.
      const banco = url(f.banco), dir = path.posix.dirname(banco);
      const indice = leer(path.join(RAIZ, banco));
      const items = [indice.entrada, indice.salida, ...indice.textos].filter(Boolean).map(id => `${dir}/textos/${id}.json`);
      const ejercicios = (indice.ejercicios || []).map(id => `${dir}/ejercicios/${id}.json`);
      plantillas[f.id] = { id: f.id, titulo: f.titulo, formato, estado: f.estado, version: f.version, unidades: f.unidades,
        url: `#/lectura/${f.id}`, banco, papel: f.papel ? url(f.papel) : null,
        // Ids de los textos de entrada y salida (o null): la app pide la entrada al entrar al curso sin cargar el banco.
        entrada: indice.entrada || null, salida: indice.salida || null,
        archivos: [banco, `${dir}/codigos.json`, `${dir}/frases.json`, ...items, ...ejercicios, ...(f.papel ? [url(f.papel)] : [])] };
      continue;
    }
    // Escena: página propia. Predicciones: se juega dentro de la app con el generador del módulo.
    // El primer archivo es el que se carga (escena o generador); los problemas de papel van al final.
    // Además, todo script o estilo local que cargue la escena (p. ej. una biblioteca de datos aparte): si no estuviera
    // aquí, el service worker no lo guardaría y la escena no abriría sin conexión.
    const locales = [];
    if (formato === 'escena') {
      const html = fs.readFileSync(path.join(dirPl, d, f.escena), 'utf8');
      for (const m of html.matchAll(/(?:src|href)="([^"#?:]+\.(?:js|css))"/g)) {
        const u = path.posix.join(`/plantillas/${f.id}`, m[1]);
        if (u.startsWith(`/plantillas/${f.id}/`) && fs.existsSync(path.join(RAIZ, u))) locales.push(m[1]);
      }
    }
    const archivos = [...new Set([...(formato === 'escena' ? [f.escena, f.motor, ...locales] : [f.generador]), ...(f.papel ? [f.papel] : [])].map(url))];
    // Práctica por idea (18 nov; auditorías de Numeración y de Las cuatro operaciones): un generador con TIPOS_POR_IDEA
    // da solo los tipos de una idea con generar(semilla, { idea }); el catálogo guarda qué ideas trae.
    let ideasPr = null;
    if (formato === 'predicciones' && f.generador) {
      try {
        const abs = path.join(dirPl, d, f.generador), g = require(abs);
        if (g && g.TIPOS_POR_IDEA && typeof g.TIPOS_POR_IDEA === 'object') ideasPr = Object.keys(g.TIPOS_POR_IDEA);
      } catch (e) { ideasPr = null; }
    }
    plantillas[f.id] = { id: f.id, titulo: f.titulo, formato, estado: f.estado, version: f.version, unidades: f.unidades,
      url: formato === 'escena' ? url(f.escena) : `#/practica/${f.id}`, ...(ideasPr && ideasPr.length ? { ideas: ideasPr } : {}),
      papel: f.papel ? url(f.papel) : null, archivos,
      // "rehacer": true (18 nov): la escena espera rehacerse; Ejercicios la pone al final, en «Más mesas del tema».
      // También una lista de unidades: solo en esas va al final (la escena compartida que una unidad ya reemplazó).
      ...(f.rehacer === true ? { rehacer: true } : Array.isArray(f.rehacer) && f.rehacer.length ? { rehacer: f.rehacer.slice() } : {}) };
  }
  const nombresUni = Object.fromEntries(Object.entries(universidades).map(([k, v]) => [k, { nombre: v.nombre, ubicacion: v.ubicacion }]));
  return { universidades: nombresUni, cursos, plantillas };
}

function texto() { return JSON.stringify(construir(), null, 1) + '\n'; }

// Banco de pruebas para la app: lo que el alumno ve y lo que se registra. Quedan fuera "datos",
// "valor", "clave" y la "reserva" (ítems listos para plantillas que todavía no están en el catálogo),
// que usa catalogo/pruebas/pruebas.test.js. La correcta y los códigos de error no van en texto plano:
// van en "k", mezclados con una cifra del ítem (nucleo/pruebas.js, ocultar). No es seguridad real.
function construirPruebas() {
  const Pruebas = require('../nucleo/pruebas.js');
  const dir = path.join(RAIZ, 'catalogo', 'pruebas');
  const cursos = {};
  if (!fs.existsSync(dir)) return { cursos };
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const forma = (id, x) => ({ enunciado: x.enunciado, opciones: x.opciones.map(o => ({ texto: o.texto })), k: Pruebas.ocultar(id, x.opciones) });
    cursos[b.curso] = { curso: b.curso, version: b.version, minutos: b.minutos,
      errores: Object.fromEntries(Object.entries(b.errores).map(([k, e]) => [k, { respaldo: e.respaldo, describe: e.describe }])),
      pares: b.pares.map(p => ({ par: p.par, plantilla: p.plantilla, unidad: p.unidad, mide: p.mide, ...(p.transferencia ? { transferencia: true } : {}),
        A: forma(p.par + 'A', p.A), B: forma(p.par + 'B', p.B) })) };
  }
  return { cursos };
}
function textoPruebas() { return JSON.stringify(construirPruebas(), null, 1) + '\n'; }

const DIR_GLOSARIO = path.join(RAIZ, 'app', 'datos', 'glosario');
// Lo que va a la app: sin la lista de problemas (esa la vigila contenido/teoria/teoria.test.js).
const textoGlosario = g => JSON.stringify({ curso: g.curso, entradas: g.entradas }) + '\n';

module.exports = { construir, texto, SALIDA, construirPruebas, textoPruebas, SALIDA_PRUEBAS, construirGlosario, textoGlosario, DIR_GLOSARIO };

if (require.main === module) {
  // Los códigos del formato lectura salen del informe de razonamiento verbal (la app no lee Markdown).
  const codigos = require('./codigos-verbal');
  fs.writeFileSync(codigos.SALIDA, codigos.texto());
  // Lápiz y papel de los módulos de lectura: sale de su banco (herramientas/papel-lectura.js).
  const papel = require('./papel-lectura');
  for (const { ficha, dir } of papel.modulos()) fs.writeFileSync(path.join(dir, 'papel.json'), papel.texto(ficha, dir));
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, texto());
  fs.writeFileSync(SALIDA_PRUEBAS, textoPruebas());
  fs.mkdirSync(DIR_GLOSARIO, { recursive: true });
  const glos = construirGlosario();
  for (const g of Object.values(glos)) fs.writeFileSync(path.join(DIR_GLOSARIO, `${g.curso}.json`), textoGlosario(g));
  for (const g of Object.values(glos)) for (const p of g.problemas) console.warn(`glosario: ${p}`);
  const c = construir(), pr = construirPruebas();
  console.log(`app/datos/catalogo.json: ${c.cursos.length} cursos, ${c.cursos.reduce((n, x) => n + x.unidades.length, 0)} unidades, ${Object.keys(c.plantillas).length} plantillas`);
  console.log(`app/datos/pruebas.json: ${Object.keys(pr.cursos).length} cursos, ${Object.values(pr.cursos).reduce((n, b) => n + b.pares.length, 0)} ítems por forma`);
}
