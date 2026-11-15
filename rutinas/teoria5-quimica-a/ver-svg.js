// Pinta en una sola captura varios cuadros del juego de una idea (o mesa), para mirar casos que no son el de inicio.
// node rutinas/teoria5-quimica-a/ver-svg.js <unidad-corta> <idea|lab:mesa> '<json de valores>' ['<json>' …] > salida en $SAL/ver.png
const path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..', '..');
const Kit = require(path.join(RAIZ, 'nucleo', 'kit', 'kit.js'));
const Teoria = require(path.join(RAIZ, 'nucleo', 'teoria.js'));
const Ec = require(path.join(RAIZ, 'nucleo', 'ecuacion.js'));
const [uc, cual, ...vs] = process.argv.slice(2);
const def = require(path.join(RAIZ, 'contenido', 'teoria', 'quimica', `${uc}.js`));
for (const r of def.requiere || []) require(path.join(RAIZ, r));
const j = cual.startsWith('lab:') ? def.laboratorio.find(m => m.id === cual.slice(4)) : def.ideas.find(i => i.id === cual).juega;
const pieza = cual.startsWith('lab:') ? j.pieza : def.ideas.find(i => i.id === cual).pieza;
const celdas = vs.map(x => {
  const v = Object.assign(Teoria.inicio(j), JSON.parse(x)), d = j.dibujo(v);
  return `<figure><figcaption>${x} — ${j.lectura ? Ec.texto(j.lectura(v)) : ''}</figcaption>${Kit.piezas[pieza].dibujar(d.datos, d.estado || {})}</figure>`;
});
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 700, height: 400 } });
  await p.setContent(`<style>body{font:13px sans-serif;display:flex;flex-wrap:wrap;gap:8px;--c-o:#b85a06;--c-i:#08807a;--c-h:#c0392b;--c-d:#3c7a2a;--c-f:#6b3dbd;--card:#fff;color:#2d2340}figure{margin:0;width:330px}svg{width:320px;height:auto}</style>${celdas.join('')}`);
  await p.screenshot({ path: `${process.env.SAL || '/tmp/claude-0/qa'}/ver.png`, fullPage: true }); await b.close();
})();
