// Versión a ciegas de unos textos: sin claves, sin códigos, alternativas barajadas.
//   node rutinas/verbal-mas/ciego.js t134 t135 …  > ciego.md   (y deja ciego-claves.json al lado)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', '..', 'contenido', 'razonamiento-verbal', 'textos');
const ids = process.argv.slice(2), claves = {};
let semilla = 12345; const azar = () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;
const L = 'ABCDE', OPC = { A: 'El autor del texto A', B: 'El autor del texto B', ambos: 'Los dos autores', ninguno: 'Ninguno de los dos' };
const CLASES = { 'lo-dice': 'Lo dice', 'se-deduce': 'Se deduce', 'no-se-sabe': 'No se sabe', 'lo-contradice': 'Lo contradice' };
for (const id of ids) {
  const t = JSON.parse(fs.readFileSync(path.join(dir, id + '.json'), 'utf8'));
  claves[id] = {};
  let out = `\n\n# ${id}: ${t.titulo || ''}\n`;
  let n = 0;
  t.parrafos.forEach((p, i) => {
    const a = (t.autores || []).find(x => x.desde === i);
    if (a) out += `\n**Texto ${a.id}**${a.firma ? ' (' + a.firma + ')' : ''}\n`;
    out += '\n' + p.map(o => `(${o.id.slice(1)}) ${o.t}`).join(' ') + '\n';
  });
  for (const q of t.preguntas) {
    out += `\n## ${q.id}\n`;
    if (q.previo) {
      const pv = q.previo;
      out += `\n*Paso previo (${pv.tipo}):* ${pv.pide}\n`;
      if (pv.sonda) out += `> ${pv.sonda}\n`;
      if (pv.tipo === 'atribuir') out += Object.entries(OPC).map(([k, v]) => `- ${k}: ${v}`).join('\n') + '\n', claves[id][q.id + '.previo'] = pv.aceptada;
      else if (pv.tipo === 'clasificar') out += Object.entries(CLASES).map(([k, v]) => `- ${k}: ${v}`).join('\n') + '\n', claves[id][q.id + '.previo'] = pv.clase;
      else if (pv.tipo === 'proposito') out += '- explicar\n- convencer\n- narrar\n', claves[id][q.id + '.previo'] = pv.aceptada;
      else if (pv.tipo === 'marcar-oracion') out += '(responde con el número de oración, o "ninguna")\n', claves[id][q.id + '.previo'] = pv.aceptadas.map(x => x.slice(1));
    }
    out += `\n${q.enunciado}\n`;
    const alts = q.alternativas.slice();
    for (let i = alts.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [alts[i], alts[j]] = [alts[j], alts[i]]; }
    alts.forEach((a, i) => { out += `${L[i]}) ${a.t}\n`; if (a.correcta) claves[id][q.id] = L[i]; });
  }
  process.stdout.write(out);
}
fs.writeFileSync(path.join(__dirname, 'ciego-claves.json'), JSON.stringify(claves, null, 1));
