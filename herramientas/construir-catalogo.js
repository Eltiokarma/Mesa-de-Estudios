// Junta catalogo/cursos/*.json y plantillas/*/plantilla.json en un solo archivo para la app:
// app/datos/catalogo.json. La app lee solo ese archivo, así funciona sin conexión.
//   node herramientas/construir-catalogo.js   (o npm run catalogo)
// El servidor local lo arma al vuelo; el archivo escrito sirve para publicar la app como
// sitio estático. Una prueba (app/app.test.js) avisa si quedó desactualizado.

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'app', 'datos', 'catalogo.json');
const ORDEN_AREAS = ['ciencias', 'matematica', 'razonamiento', 'letras'];

function construir() {
  const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  const universidades = leer(path.join(RAIZ, 'catalogo', 'universidades.json'));
  const dirCursos = path.join(RAIZ, 'catalogo', 'cursos');
  const cursos = fs.readdirSync(dirCursos).filter(f => f.endsWith('.json')).sort()
    .map(f => leer(path.join(dirCursos, f)))
    .sort((a, b) => ORDEN_AREAS.indexOf(a.area) - ORDEN_AREAS.indexOf(b.area) || a.nombre.localeCompare(b.nombre, 'es'))
    .map(c => ({
      id: c.id, nombre: c.nombre, area: c.area, formato_principal: c.formato_principal,
      unidades: c.unidades.map(u => ({
        id: u.id, nombre: u.nombre, temas: u.temas, universidades: u.universidades,
        potencial_visual: u.potencial_visual, plantillas: u.plantillas,
      })),
    }));
  const dirPl = path.join(RAIZ, 'plantillas');
  const plantillas = {};
  for (const d of fs.readdirSync(dirPl).sort()) {
    const ficha = path.join(dirPl, d, 'plantilla.json');
    if (!fs.existsSync(ficha)) continue;
    const f = leer(ficha);
    const formato = f.formato || 'escena';
    // Escena: página propia. Predicciones: se juega dentro de la app con el generador del módulo.
    const archivos = (formato === 'escena' ? [f.escena, f.motor] : [f.generador]).map(a => `/plantillas/${f.id}/${a}`);
    plantillas[f.id] = { id: f.id, titulo: f.titulo, formato, estado: f.estado, version: f.version, unidades: f.unidades,
      url: formato === 'escena' ? `/plantillas/${f.id}/${f.escena}` : `#/practica/${f.id}`, archivos };
  }
  const nombresUni = Object.fromEntries(Object.entries(universidades).map(([k, v]) => [k, { nombre: v.nombre, ubicacion: v.ubicacion }]));
  return { universidades: nombresUni, cursos, plantillas };
}

function texto() { return JSON.stringify(construir(), null, 1) + '\n'; }

module.exports = { construir, texto, SALIDA };

if (require.main === module) {
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, texto());
  const c = construir();
  console.log(`app/datos/catalogo.json: ${c.cursos.length} cursos, ${c.cursos.reduce((n, x) => n + x.unidades.length, 0)} unidades, ${Object.keys(c.plantillas).length} plantillas`);
}
