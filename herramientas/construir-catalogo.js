// Junta catalogo/cursos/*.json y plantillas/*/plantilla.json en un solo archivo para la app:
// app/datos/catalogo.json. La app lee solo ese archivo, así funciona sin conexión.
//   node herramientas/construir-catalogo.js   (o npm run catalogo)
// El servidor local lo arma al vuelo; el archivo escrito sirve para publicar la app como
// sitio estático. Una prueba (app/app.test.js) avisa si quedó desactualizado.
// También arma app/datos/pruebas.json con el banco de pruebas de entrada y salida por curso
// (catalogo/pruebas/<curso>.json), sin los datos que solo sirven para verificarlo.

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'app', 'datos', 'catalogo.json');
const SALIDA_PRUEBAS = path.join(RAIZ, 'app', 'datos', 'pruebas.json');
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
        potencial_visual: u.potencial_visual, grado: u.grado, plantillas: u.plantillas,
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
    // El primer archivo es el que se carga (escena o generador); los problemas de papel van al final.
    const archivos = [...(formato === 'escena' ? [f.escena, f.motor] : [f.generador]), ...(f.papel ? [f.papel] : [])].map(a => `/plantillas/${f.id}/${a}`);
    plantillas[f.id] = { id: f.id, titulo: f.titulo, formato, estado: f.estado, version: f.version, unidades: f.unidades,
      url: formato === 'escena' ? `/plantillas/${f.id}/${f.escena}` : `#/practica/${f.id}`,
      papel: f.papel ? `/plantillas/${f.id}/${f.papel}` : null, archivos };
  }
  const nombresUni = Object.fromEntries(Object.entries(universidades).map(([k, v]) => [k, { nombre: v.nombre, ubicacion: v.ubicacion }]));
  return { universidades: nombresUni, cursos, plantillas };
}

function texto() { return JSON.stringify(construir(), null, 1) + '\n'; }

// Banco de pruebas para la app: lo que el alumno ve y lo que se registra. Quedan fuera "datos",
// "valor" y "clave", que usa catalogo/pruebas/pruebas.test.js para comprobar cada respuesta con el motor.
function construirPruebas() {
  const dir = path.join(RAIZ, 'catalogo', 'pruebas');
  const cursos = {};
  if (!fs.existsSync(dir)) return { cursos };
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const forma = x => ({ enunciado: x.enunciado, opciones: x.opciones.map(o => (o.correcta ? { texto: o.texto, correcta: true } : { texto: o.texto, error: o.error })) });
    cursos[b.curso] = { curso: b.curso, version: b.version, minutos: b.minutos,
      errores: Object.fromEntries(Object.entries(b.errores).map(([k, e]) => [k, { respaldo: e.respaldo, describe: e.describe }])),
      pares: b.pares.map(p => ({ par: p.par, plantilla: p.plantilla, unidad: p.unidad, mide: p.mide, A: forma(p.A), B: forma(p.B) })) };
  }
  return { cursos };
}
function textoPruebas() { return JSON.stringify(construirPruebas(), null, 1) + '\n'; }

module.exports = { construir, texto, SALIDA, construirPruebas, textoPruebas, SALIDA_PRUEBAS };

if (require.main === module) {
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, texto());
  fs.writeFileSync(SALIDA_PRUEBAS, textoPruebas());
  const c = construir(), pr = construirPruebas();
  console.log(`app/datos/catalogo.json: ${c.cursos.length} cursos, ${c.cursos.reduce((n, x) => n + x.unidades.length, 0)} unidades, ${Object.keys(c.plantillas).length} plantillas`);
  console.log(`app/datos/pruebas.json: ${Object.keys(pr.cursos).length} cursos, ${Object.values(pr.cursos).reduce((n, b) => n + b.pares.length, 0)} ítems por forma`);
}
