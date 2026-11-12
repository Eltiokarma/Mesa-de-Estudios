// Junta los archivos JSON que exportan los alumnos (Perfil → Datos para el profesor →
// Descargar JSON) y resume el lanzamiento por módulo; en el formato lectura, el paso previo y la respuesta
// por código RV; y, para las pruebas de entrada y salida, por curso.
//   node herramientas/analizar-medicion.js datos/*.json            → resumen en Markdown
//   node herramientas/analizar-medicion.js --csv todo.csv datos/*.json   → además, un CSV unido
// Un mismo evento exportado dos veces (por ejemplo, dos descargas del mismo celular) se cuenta una vez.
const fs = require('node:fs');
const path = require('node:path');
const Medicion = require('../nucleo/medicion.js');

function unir(listas) {
  const vistos = new Set(), todos = [];
  for (const l of listas) for (const e of l) {
    const k = [e.alumno, e.t, e.tipo, e.modulo, e.problema, e.fase, e.curso, e.item].join('|');
    if (vistos.has(k)) continue;
    vistos.add(k); todos.push(e);
  }
  return todos.sort((a, b) => String(a.t).localeCompare(String(b.t)));
}

function informe(eventos) {
  const pct = x => x === null ? '—' : `${Math.round(x * 100)} %`;
  const respaldo = {};
  for (const e of eventos) if (e.tipo === 'prediccion' && e.error) respaldo[`${e.modulo}|${e.error}`] = e.respaldo;
  const alumnos = new Set(eventos.map(e => e.alumno)).size;
  const colegios = [...new Set(eventos.map(e => e.colegio).filter(Boolean))].join(', ') || 'sin código';
  const grados = {}; const vistoAl = new Set();
  for (const e of eventos) if (!vistoAl.has(e.alumno)) { vistoAl.add(e.alumno); grados[e.grado || '?'] = (grados[e.grado || '?'] || 0) + 1; }
  let md = `# Resultados del lanzamiento\n\n${eventos.length} eventos · ${alumnos} alumnos · colegio: ${colegios} · grados: ${Object.entries(grados).map(([g, n]) => `${g} (${n})`).join(', ')}\n\n`;
  md += '| Módulo | Alumnos | Entrada | Salida | Ganancia (pareados) | Predicciones | Acierto | «No sé» entrada / salida / práctica | Confianza calibrada entrada / salida / práctica |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
  const r = Medicion.resumir(eventos);
  const tres = o => `${pct(o.entrada)} / ${pct(o.salida)} / ${pct(o.practica)}`;
  for (const m of r) md += `| ${m.modulo} | ${m.alumnos} | ${pct(m.entrada)} | ${pct(m.salida)} | ${m.ganancia === null ? '—' : `${m.ganancia >= 0 ? '+' : ''}${Math.round(m.ganancia * 100)} pts (${m.pareados})`} | ${m.predicciones} | ${pct(m.acierto)} | ${tres(m.nose)} | ${tres(m.confianza)} |\n`;
  // Los módulos de lectura tienen su propia tabla de errores (paso previo y respuesta), en informeLectura.
  const deLectura = new Set(Medicion.resumirLectura(eventos).map(m => m.modulo));
  for (const m of r) if (m.errores.length && !deLectura.has(m.modulo)) {
    md += `\n## Errores elegidos en ${m.modulo}\n\n| Error | Veces | Respaldo previo |\n| --- | --- | --- |\n`;
    for (const e of m.errores) md += `| ${e.id} | ${e.n} | ${respaldo[`${m.modulo}|${e.id}`] || '?'} |\n`;
  }
  md += '\nLa ganancia se calcula solo con quienes hicieron la prueba de entrada y la de salida. Con pocos alumnos, las diferencias pueden ser azar.\n';
  md += '«No sé» cuenta como no acierto en la entrada, la salida y la ganancia. La confianza calibrada es la tasa de aciertos sobre lo intentado, sin contar los «No sé»: si sube mucho más que el acierto, el alumno adivina menos y sabe cuándo no sabe.\n';
  md += informeLectura(eventos);
  md += informeCursos(eventos);
  return md;
}

// Formato lectura (razonamiento verbal): el paso previo se cuenta aparte de la respuesta. El previo se responde
// sin alternativas a la vista; si un código aparece mucho en la respuesta y poco en el previo, el error lo
// sugiere la alternativa (RV5) más que la lectura del alumno.
// codigos (opcional): contenido/razonamiento-verbal/codigos.json, para el nombre de cada código.
function informeLectura(eventos, codigos) {
  const r = Medicion.resumirLectura(eventos);
  if (!r.length) return '';
  codigos = codigos || cargarCodigosVerbal();
  const pct = x => x === null ? '—' : `${Math.round(x * 100)} %`;
  let md = '\n# Formato lectura: paso previo y respuesta\n\n';
  md += '| Módulo | Alumnos | Textos leídos | Lectura (mediana) | Pasos previos | Acierto del previo | Respuestas | Acierto de la respuesta |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n';
  for (const m of r) md += `| ${m.modulo} | ${m.alumnos} | ${m.textosLeidos} | ${m.msLecturaMediana === null ? '—' : `${Math.round(m.msLecturaMediana / 1000)} s`} | ${m.previos} | ${pct(m.aciertoPrevio)} | ${m.respuestas} | ${pct(m.aciertoRespuesta)} |\n`;
  for (const m of r) {
    if (m.unidades.length) {
      md += `\n| Unidad (${m.modulo}) | Pasos previos | Acierto del previo | Respuestas | Acierto de la respuesta |\n| --- | --- | --- | --- | --- |\n`;
      for (const u of m.unidades) md += `| ${u.id} | ${u.previos} | ${pct(u.aciertoPrevio)} | ${u.respuestas} | ${pct(u.aciertoRespuesta)} |\n`;
    }
    if (m.codigos.length || m.sinCodigo.previo || m.sinCodigo.respuesta) {
      md += `\n## Errores por código RV en ${m.modulo}: sin alternativas (paso previo) y con alternativas (respuesta)\n\n| Código | Qué es | Respaldo previo | Paso previo | Respuesta |\n| --- | --- | --- | --- | --- |\n`;
      for (const c of m.codigos) md += `| ${c.id} | ${(codigos[c.id] || {}).nombre || '?'} | ${c.respaldo || (codigos[c.id] || {}).respaldo || '?'} | ${c.previo} | ${c.respuesta} |\n`;
      if (m.sinCodigo.previo || m.sinCodigo.respuesta) md += `| sin código | Respuesta incorrecta para la que el informe no tiene error | — | ${m.sinCodigo.previo} | ${m.sinCodigo.respuesta} |\n`;
    }
  }
  md += '\nEn lectura, la columna "opcion" guarda la posición de la alternativa en el banco (1 a 5), no la letra que vio el alumno; en el paso previo, la oración, la clase, la relación o el orden. No se mezcla con la "opcion" de predicciones, que es la letra.\n';
  return md;
}

function cargarCodigosVerbal() {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'contenido', 'razonamiento-verbal', 'codigos.json'), 'utf8')); } catch { return {}; }
}

// Pruebas de entrada y salida por curso (formas A y B contrabalanceadas; ver nucleo/pruebas.js).
// banco (opcional): { <curso>: banco } para mostrar qué describe cada código de error y su respaldo.
function informeCursos(eventos, bancos) {
  const r = Medicion.resumirCursos(eventos);
  if (!r.length) return '';
  bancos = bancos || cargarBancos();
  const pct = x => x === null || x === undefined ? '—' : `${Math.round(x * 100)} %`;
  const g = x => x === null || x === undefined ? '—' : x.toFixed(2).replace('.', ',');
  let md = '\n# Pruebas de entrada y salida por curso\n\n';
  md += '| Curso | Entrada (alumnos) | Salida (alumnos) | Pareados | Entrada pareados | Salida pareados | Ganancia normalizada ⟨g⟩ | g individual promedio | Forma A / B en la entrada | «No sé» entrada / salida | Confianza calibrada entrada / salida |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
  for (const c of r) md += `| ${c.curso} | ${pct(c.entrada)} (${c.alumnosEntrada}) | ${pct(c.salida)} (${c.alumnosSalida}) | ${c.pareados}${c.pareadosMismoDia ? ` (+${c.pareadosMismoDia} el mismo día, fuera)` : ""} | ${pct(c.entradaPareados)} | ${pct(c.salidaPareados)} | ${g(c.hake)} | ${g(c.hakeIndividual)} | ${pct(c.porForma.A.entrada)} (${c.porForma.A.alumnos}) / ${pct(c.porForma.B.entrada)} (${c.porForma.B.alumnos}) | ${pct(c.nose.entrada)} / ${pct(c.nose.salida)} | ${pct(c.confianza.entrada)} / ${pct(c.confianza.salida)} |\n`;
  for (const c of r) {
    const dic = (bancos[c.curso] || {}).errores || {};
    if (c.errores.length) {
      md += `\n## Errores en ${c.curso}: cuántos alumnos pareados lo cometieron antes y después\n\n| Error | Qué es | Respaldo previo | Entrada | Salida | Cambio |\n| --- | --- | --- | --- | --- | --- |\n`;
      for (const e of c.errores) md += `| ${e.id} | ${(dic[e.id] || {}).describe || '?'} | ${(dic[e.id] || {}).respaldo || '?'} | ${e.antes} | ${e.despues} | ${e.despues - e.antes >= 0 ? '+' : ''}${e.despues - e.antes} |\n`;
    }
    if (c.plantillas.length) {
      md += `\n| Plantilla (${c.curso}) | Acierto en la entrada | Acierto en la salida | «No sé» entrada / salida | Confianza calibrada entrada / salida |\n| --- | --- | --- | --- | --- |\n`;
      for (const p of c.plantillas) md += `| ${p.id} | ${pct(p.entrada)} | ${pct(p.salida)} | ${pct(p.noseEntrada)} / ${pct(p.noseSalida)} | ${pct(p.confianzaEntrada)} / ${pct(p.confianzaSalida)} |\n`;
    }
    if (c.entradaConPrevias) md += `\n${c.entradaConPrevias} alumno(s) hicieron la entrada de ${c.curso} después de abrir alguna unidad del curso: su entrada no fue en frío.\n`;
  }
  md += '\n«No sé» cuenta como no acierto: no sube ni baja ⟨g⟩ por sí solo. La confianza calibrada (aciertos sobre lo intentado) se calcula por pregunta, sin los «No sé».\n';
  md += '\n⟨g⟩ = (salida − entrada) / (1 − entrada), con los promedios de los pareados (Hake, 1998). Como referencia, Hake midió 0,23 en cursos tradicionales y 0,48 en cursos de participación activa. Si la forma A y la B dan promedios muy distintos en la entrada, las formas no son equivalentes y hay que revisar el banco.\n';
  return md;
}

function cargarBancos() {
  const dir = path.join(__dirname, '..', 'catalogo', 'pruebas'), out = {};
  try { for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) { const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); out[b.curso] = b; } } catch { /* sin banco: se muestran solo los códigos */ }
  return out;
}

module.exports = { unir, informe, informeCursos, informeLectura };

if (require.main === module) {
  const args = process.argv.slice(2);
  let csv = null;
  if (args[0] === '--csv') { csv = args[1]; args.splice(0, 2); }
  if (!args.length) { console.error('Uso: node herramientas/analizar-medicion.js [--csv salida.csv] archivo1.json archivo2.json ...'); process.exit(1); }
  const eventos = unir(args.map(f => JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'))));
  if (csv) fs.writeFileSync(csv, Medicion.aCSV(eventos));
  process.stdout.write(informe(eventos));
}
