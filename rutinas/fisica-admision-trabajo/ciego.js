// node ciego.js <id> <carpeta-salida>
// Arma, sin respuestas, los enunciados de las semillas de casos.json y de 30 semillas más,
// para el verificador a ciegas. Escribe <id>-ciego.json (sin respuesta) y <id>-con-claves.json
// (con alternativas, correcta y explicaciones) para la segunda fase, de revisión.
const fs = require('fs'), path = require('path');
const [id, out] = process.argv.slice(2);
const raiz = '/home/user/Mesa-de-Estudios';
const gen = require(path.join(raiz, 'plantillas', id, 'generador.js'));
const casos = require(path.join(raiz, 'plantillas', id, 'casos.json'));
const plano = s => s.map(x => (typeof x === 'string' ? x : x.t)).join('');
const semillas = [...casos.casos.map(c => c.semilla), ...Array.from({ length: 30 }, (_, i) => 300 + i)];
const ciego = [], claves = [];
for (const s of semillas) {
  const p = gen.generar(s);
  const base = { semilla: s, deCasos: casos.casos.some(c => c.semilla === s), tipo: p._datos.tipo + (p._datos.sub ? '/' + p._datos.sub : ''),
    enunciado: plano(p.enunciado), pregunta: plano(p.pregunta), alternativas: p.alternativas.map(a => `${a.letra}) ${a.texto}`) };
  ciego.push(base);
  claves.push({ ...base, correcta: p.alternativas.find(a => a.correcta).letra,
    errores: p.alternativas.filter(a => a.error).map(a => ({ letra: a.letra, id: a.error.id, respaldo: a.error.respaldo, explicacion: a.error.explicacion })),
    solucion: p.solucion.map(plano) });
}
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, id + '-ciego.json'), JSON.stringify(ciego, null, 1));
fs.writeFileSync(path.join(out, id + '-con-claves.json'), JSON.stringify(claves, null, 1));
console.log(id, ciego.length);
