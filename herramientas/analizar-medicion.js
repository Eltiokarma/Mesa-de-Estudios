// Junta los archivos JSON que exportan los alumnos (Perfil → Datos para el profesor →
// Descargar JSON) y resume el lanzamiento por módulo y, para las pruebas de entrada y salida, por curso.
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
  md += '| Módulo | Alumnos | Entrada | Salida | Ganancia (pareados) | Predicciones | Acierto |\n| --- | --- | --- | --- | --- | --- | --- |\n';
  const r = Medicion.resumir(eventos);
  for (const m of r) md += `| ${m.modulo} | ${m.alumnos} | ${pct(m.entrada)} | ${pct(m.salida)} | ${m.ganancia === null ? '—' : `${m.ganancia >= 0 ? '+' : ''}${Math.round(m.ganancia * 100)} pts (${m.pareados})`} | ${m.predicciones} | ${pct(m.acierto)} |\n`;
  for (const m of r) if (m.errores.length) {
    md += `\n## Errores elegidos en ${m.modulo}\n\n| Error | Veces | Respaldo previo |\n| --- | --- | --- |\n`;
    for (const e of m.errores) md += `| ${e.id} | ${e.n} | ${respaldo[`${m.modulo}|${e.id}`] || '?'} |\n`;
  }
  md += '\nLa ganancia se calcula solo con quienes hicieron la prueba de entrada y la de salida. Con pocos alumnos, las diferencias pueden ser azar.\n';
  md += informeCursos(eventos);
  return md;
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
  md += '| Curso | Entrada (alumnos) | Salida (alumnos) | Pareados | Entrada pareados | Salida pareados | Ganancia normalizada ⟨g⟩ | g individual promedio | Forma A / B en la entrada |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
  for (const c of r) md += `| ${c.curso} | ${pct(c.entrada)} (${c.alumnosEntrada}) | ${pct(c.salida)} (${c.alumnosSalida}) | ${c.pareados} | ${pct(c.entradaPareados)} | ${pct(c.salidaPareados)} | ${g(c.hake)} | ${g(c.hakeIndividual)} | ${pct(c.porForma.A.entrada)} (${c.porForma.A.alumnos}) / ${pct(c.porForma.B.entrada)} (${c.porForma.B.alumnos}) |\n`;
  for (const c of r) {
    const dic = (bancos[c.curso] || {}).errores || {};
    if (c.errores.length) {
      md += `\n## Errores en ${c.curso}: cuántos alumnos pareados lo cometieron antes y después\n\n| Error | Qué es | Respaldo previo | Entrada | Salida | Cambio |\n| --- | --- | --- | --- | --- | --- |\n`;
      for (const e of c.errores) md += `| ${e.id} | ${(dic[e.id] || {}).describe || '?'} | ${(dic[e.id] || {}).respaldo || '?'} | ${e.antes} | ${e.despues} | ${e.despues - e.antes >= 0 ? '+' : ''}${e.despues - e.antes} |\n`;
    }
    if (c.plantillas.length) {
      md += `\n| Plantilla (${c.curso}) | Acierto en la entrada | Acierto en la salida |\n| --- | --- | --- |\n`;
      for (const p of c.plantillas) md += `| ${p.id} | ${pct(p.entrada)} | ${pct(p.salida)} |\n`;
    }
    if (c.entradaConPrevias) md += `\n${c.entradaConPrevias} alumno(s) hicieron la entrada de ${c.curso} después de abrir alguna unidad del curso: su entrada no fue en frío.\n`;
  }
  md += '\n⟨g⟩ = (salida − entrada) / (1 − entrada), con los promedios de los pareados (Hake, 1998). Como referencia, Hake midió 0,23 en cursos tradicionales y 0,48 en cursos de participación activa. Si la forma A y la B dan promedios muy distintos en la entrada, las formas no son equivalentes y hay que revisar el banco.\n';
  return md;
}

function cargarBancos() {
  const dir = path.join(__dirname, '..', 'catalogo', 'pruebas'), out = {};
  try { for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) { const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); out[b.curso] = b; } } catch { /* sin banco: se muestran solo los códigos */ }
  return out;
}

module.exports = { unir, informe, informeCursos };

if (require.main === module) {
  const args = process.argv.slice(2);
  let csv = null;
  if (args[0] === '--csv') { csv = args[1]; args.splice(0, 2); }
  if (!args.length) { console.error('Uso: node herramientas/analizar-medicion.js [--csv salida.csv] archivo1.json archivo2.json ...'); process.exit(1); }
  const eventos = unir(args.map(f => JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'))));
  if (csv) fs.writeFileSync(csv, Medicion.aCSV(eventos));
  process.stdout.write(informe(eventos));
}
