// Problemas de lápiz y papel (regla 6) para los módulos de formato «predicciones» que no traen papel propio.
// Toma 8 problemas del mismo generador (semillas fijas «papel-1», «papel-2», …), con sus alternativas, la respuesta
// y la solución escrita que arma el generador. Así el papel usa el mismo cálculo verificado que la práctica.
//
//   node herramientas/papel-generador.js <id> [<id> …]   escribe plantillas/<id>/papel.json y agrega "papel" a plantilla.json
//   node herramientas/papel-generador.js --revisar        dice si algún papel generado no está al día (sale con 1)
//
// Un papel hecho a mano (sin "origen" de esta herramienta) no se toca.
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const ORIGEN = 'Generado por herramientas/papel-generador.js desde el generador del módulo; no se edita a mano.';
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));
const NIVELES = ['básico', 'básico', 'básico', 'intermedio', 'intermedio', 'intermedio', 'avanzado', 'avanzado'];

function armar(id) {
  const dir = path.join(RAIZ, 'plantillas', id);
  const gen = require(path.join(dir, 'generador.js'));
  const ficha = JSON.parse(fs.readFileSync(path.join(dir, 'plantilla.json'), 'utf8'));
  const vistos = new Set(), problemas = [];
  for (let s = 1; problemas.length < 8 && s < 200; s++) {
    const p = gen.generar(`papel-${s}`);
    if (p.figura) continue; // el papel no lleva dibujos: solo problemas que se entienden con el texto
    const enun = `${plano(p.enunciado)} ${plano(p.pregunta)}`.replace(/\s+/g, ' ').trim();
    if (vistos.has(enun)) continue;
    vistos.add(enun);
    const alts = p.alternativas.map(a => `${a.letra}) ${a.texto}`).join('   ');
    const c = p.alternativas.find(a => a.correcta);
    problemas.push({
      id: `p${problemas.length + 1}`, nivel: NIVELES[problemas.length],
      enunciado: `${enun} Alternativas: ${alts}`,
      respuesta: `${c.letra}) ${c.texto}`,
      pasos: p.solucion.map(plano).map(x => x.trim()).filter(Boolean),
    });
  }
  if (problemas.length < 5) throw new Error(`${id}: solo salieron ${problemas.length} problemas sin figura`);
  return {
    titulo: `${ficha.titulo}: problemas para lápiz y papel`,
    indicacion: 'Resuélvelos en tu cuaderno antes de mirar las alternativas, con unos 3 minutos por problema. Después compara con la respuesta y la solución.',
    origen: ORIGEN, problemas,
  };
}

const texto = d => JSON.stringify(d, null, 2) + '\n';
const generados = () => fs.readdirSync(path.join(RAIZ, 'plantillas')).filter(id => {
  const f = path.join(RAIZ, 'plantillas', id, 'papel.json');
  return fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).origen === ORIGEN;
});

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--revisar') {
    const viejos = generados().filter(id => fs.readFileSync(path.join(RAIZ, 'plantillas', id, 'papel.json'), 'utf8') !== texto(armar(id)));
    if (viejos.length) { console.log('papel.json no está al día:', viejos.join(', ')); process.exit(1); }
    console.log('papel de generadores al día');
  } else {
    for (const id of args.length ? args : generados()) {
      const dir = path.join(RAIZ, 'plantillas', id);
      const f = path.join(dir, 'papel.json');
      if (fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).origen !== ORIGEN) { console.log(`${id}: tiene papel propio, no se toca`); continue; }
      const d = armar(id);
      fs.writeFileSync(f, texto(d));
      const fichaF = path.join(dir, 'plantilla.json'), ficha = JSON.parse(fs.readFileSync(fichaF, 'utf8'));
      if (!ficha.papel) { ficha.papel = 'papel.json'; fs.writeFileSync(fichaF, JSON.stringify(ficha, null, 2) + '\n'); }
      console.log(`plantillas/${id}/papel.json: ${d.problemas.length} problemas`);
    }
  }
}

module.exports = { armar, generados, texto, ORIGEN };
