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
function teoriaDe(u) {
  const [curso, slug] = u.id.split('.');
  const rel = `contenido/teoria/${curso}/${slug}.js`;
  const abs = path.join(RAIZ, rel);
  if (!fs.existsSync(abs)) return {};
  delete require.cache[require.resolve(abs)];
  const def = require(abs);
  return { teoria: { archivo: `/${rel}`, requiere: def.requiere || [], ideas: (def.ideas || []).length } };
}

function construir() {
  const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  const universidades = leer(path.join(RAIZ, 'catalogo', 'universidades.json'));
  const dirCursos = path.join(RAIZ, 'catalogo', 'cursos');
  const cursos = fs.readdirSync(dirCursos).filter(f => f.endsWith('.json')).sort()
    .map(f => leer(path.join(dirCursos, f)))
    .sort((a, b) => ORDEN_AREAS.indexOf(a.area) - ORDEN_AREAS.indexOf(b.area) || a.nombre.localeCompare(b.nombre, 'es'))
    .map(c => ({
      id: c.id, nombre: c.nombre, area: c.area, formato_principal: c.formato_principal,
      unidades: c.unidades.map(u => Object.assign({
        id: u.id, nombre: u.nombre, temas: u.temas, universidades: u.universidades,
        potencial_visual: u.potencial_visual, grado: u.grado, plantillas: u.plantillas,
      }, teoriaDe(u))),
    }));
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
    plantillas[f.id] = { id: f.id, titulo: f.titulo, formato, estado: f.estado, version: f.version, unidades: f.unidades,
      url: formato === 'escena' ? url(f.escena) : `#/practica/${f.id}`,
      papel: f.papel ? url(f.papel) : null, archivos };
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

module.exports = { construir, texto, SALIDA, construirPruebas, textoPruebas, SALIDA_PRUEBAS };

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
  const c = construir(), pr = construirPruebas();
  console.log(`app/datos/catalogo.json: ${c.cursos.length} cursos, ${c.cursos.reduce((n, x) => n + x.unidades.length, 0)} unidades, ${Object.keys(c.plantillas).length} plantillas`);
  console.log(`app/datos/pruebas.json: ${Object.keys(pr.cursos).length} cursos, ${Object.values(pr.cursos).reduce((n, b) => n + b.pares.length, 0)} ítems por forma`);
}
