// node rutinas/verbal-mas/comparar.js respuestas.json  → compara con ciego-claves.json
const fs = require('fs'), path = require('path');
const c = JSON.parse(fs.readFileSync(path.join(__dirname, 'ciego-claves.json'), 'utf8'));
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let ok = 0, mal = 0;
for (const id in c) for (const k in c[id]) {
  const e = c[id][k], d = (r[id] || {})[k];
  const bien = Array.isArray(e) ? e.includes(String(d)) : String(d).trim() === String(e);
  if (bien) ok++; else { mal++; console.log(`DISTINTO ${id} ${k}: clave ${JSON.stringify(e)}, revisor ${JSON.stringify(d)}`); }
}
console.log(`coinciden ${ok}, distintos ${mal}`);
