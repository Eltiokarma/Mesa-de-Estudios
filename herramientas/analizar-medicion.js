// Junta los archivos JSON que exportan los alumnos (Perfil → Datos para el profesor →
// Descargar JSON) y resume el lanzamiento por módulo.
//   node herramientas/analizar-medicion.js datos/*.json            → resumen en Markdown
//   node herramientas/analizar-medicion.js --csv todo.csv datos/*.json   → además, un CSV unido
// Un mismo evento exportado dos veces (por ejemplo, dos descargas del mismo celular) se cuenta una vez.
const fs = require('node:fs');
const path = require('node:path');
const Medicion = require('../nucleo/medicion.js');

function unir(listas) {
  const vistos = new Set(), todos = [];
  for (const l of listas) for (const e of l) {
    const k = [e.alumno, e.t, e.tipo, e.modulo, e.problema, e.fase].join('|');
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
  return md;
}

module.exports = { unir, informe };

if (require.main === module) {
  const args = process.argv.slice(2);
  let csv = null;
  if (args[0] === '--csv') { csv = args[1]; args.splice(0, 2); }
  if (!args.length) { console.error('Uso: node herramientas/analizar-medicion.js [--csv salida.csv] archivo1.json archivo2.json ...'); process.exit(1); }
  const eventos = unir(args.map(f => JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'))));
  if (csv) fs.writeFileSync(csv, Medicion.aCSV(eventos));
  process.stdout.write(informe(eventos));
}
