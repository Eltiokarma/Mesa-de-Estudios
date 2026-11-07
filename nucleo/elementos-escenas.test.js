// Las escenas de química pintan sus elementos con la paleta común (nucleo/elementos.js), y en cada vista
// esos colores se separan de las variables no-elemento de la escena (ΔE00 ≥ 20 en claro y en oscuro).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./elementos.js');

const raiz = path.join(__dirname, '..', 'plantillas');
// Por escena: los elementos que pinta y, por vista, qué elementos y qué variables propias salen a la vez.
const ESCENAS = {
  'limitante-particulas': {
    elementos: ['H', 'C', 'N', 'O', 'Al', 'Cl', 'Ca'],
    vistas: [
      [['N', 'H'], ['--c-prod', '--c-mol', '--c-g']],
      [['H', 'O'], ['--c-prod', '--c-mol', '--c-g']],
      [['Al', 'Cl'], ['--c-prod', '--c-g']],
      [['C', 'O'], ['--c-prod', '--c-g']],
    ] },
  'mol-composicion': {
    elementos: ['H', 'C', 'N', 'O', 'Mg', 'S', 'Ca', 'Fe', 'Cu'],
    vistas: [
      [['Mg', 'C'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
      [['C', 'H', 'O'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
      [['Ca', 'C', 'O', 'H'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
      [['Fe', 'O', 'H'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
      [['N', 'H', 'O'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
      [['H', 'S', 'O'], ['--c-masa', '--c-mol', '--c-Mm', '--c-part']],
    ] },
  'balance-reacciones': {
    elementos: ['H', 'C', 'N', 'O', 'Cl', 'Cr', 'Mn', 'Fe', 'Cu', 'Zn'],
    vistas: [
      [['H', 'O'], ['--c-coef', '--c-e']],
      [['C', 'H', 'O'], ['--c-coef', '--c-e']],
      [['Zn', 'H', 'Cl'], ['--c-coef', '--c-e']],
      [['Zn', 'Cu', 'Cl'], ['--c-coef', '--c-e']],
      [['Mn', 'Fe', 'O', 'H'], ['--c-coef', '--c-e']],
      [['Cr', 'Fe', 'O', 'H'], ['--c-coef', '--c-e']],
      [['Fe', 'Cl'], ['--c-coef', '--c-e']],
      [['N', 'O', 'H'], ['--c-coef', '--c-e']],
    ] },
  'celda-galvanica': {
    elementos: ['K', 'Fe', 'Cu', 'Zn', 'Ag'],
    ajenas: ['I'],   // --c-I es la corriente de Faraday, no el yodo
    vistas: [
      [['Zn', 'Fe', 'Cu', 'Ag', 'K'], ['--c-e', '--c-E', '--c-an']],
      [['Cu', 'Ag'], ['--c-e', '--c-E', '--c-I', '--c-t']],
    ] },
  'enlace': {
    elementos: ['Na', 'Cl'],   // los átomos de las moléculas de Lewis van en tinta
    vistas: [
      // La red de NaCl; por si acaso, contra todas las variables de la escena.
      [['Na', 'Cl'], ['--c-enl', '--c-libre', '--c-dip', '--c-mu']],
    ] },
  'liquidos-y-solidos': {
    elementos: ['H', 'C', 'N', 'O', 'F', 'S'],   // los grupos CH₃, CH₂ y CH de los alcanos van con el color del C
    vistas: [
      [['H', 'O'], ['--c-Pv', '--c-Pext', '--c-T']],           // frascos de agua, la olla, Puno y la olla a presión
      [['H', 'O'], ['--c-T', '--c-pu']],                       // agua líquida con sus puentes de hidrógeno
      [['H', 'S'], ['--c-T', '--c-pu']],                       // el H₂S gaseoso junto al agua
      [['N', 'H', 'C', 'F', 'O'], ['--c-pu']],                 // NH₃, CH₃F y CH₃OCH₃
      [['H', 'O', 'C'], ['--c-Pv', '--c-Pext', '--c-T']],      // el explorador (agua, etanol y acetona)
      [['H', 'O'], ['--c-Pext', '--c-Pv', '--c-Pgas']],        // el gas recogido sobre agua
      [['C'], ['--c-T']],                                      // butano, isobutano, pentano y neopentano
      [['H', 'O'], ['--c-T']],                                 // el vapor que se enfría
    ] },
  // Viene de la rutina de química B; la prueba la cuida en cuanto la escena llegue a esta rama.
  'rendimiento-pureza': {
    elementos: ['O', 'Fe'],   // solo en la lupa de la hematita; las sustancias van con los colores de sus masas
    vistas: [
      [['Fe', 'O'], ['--c-imp', '--c-pur', '--c-teo', '--c-real']],   // la hematita (pasos 1 a 3, experimento 2, explorador)
    ] },
  'biomoleculas': {
    elementos: ['H', 'O'],   // las piezas son bloques con nombre; solo el H y el OH que salen en cada unión llevan color
    vistas: [
      [['H', 'O'], ['--c-n', '--c-k', '--c-Mp', '--c-Ma', '--c-M']],   // el taller: la gota de agua con todas las variables
    ] },
  'nomenclatura-inorganica': {
    elementos: ['H', 'C', 'N', 'O', 'Na', 'Al', 'P', 'S', 'Cl', 'K', 'Ca', 'Fe', 'Zn', 'Pb'],
    vistas: [
      [['Fe', 'O', 'H'], []], [['Al', 'S', 'O'], []], [['Pb', 'O'], []], [['Na', 'O'], []],
      [['Na', 'S', 'O', 'H'], []], [['Na', 'Cl', 'O', 'H'], []], [['Cl', 'O', 'H'], []],
      [['K', 'C', 'O', 'H'], []], [['Fe', 'S', 'O', 'H'], []],
      // Mesa y árbol libres: las parejas de Elementos.CERCANOS se apagan.
      [['Na', 'O', 'H', 'N', 'P', 'S', 'Cl'], []], [['K', 'O', 'H', 'C', 'N', 'P', 'Cl'], []],
      [['Ca', 'O', 'H', 'C', 'N', 'P', 'Cl'], []], [['Al', 'O', 'H', 'C', 'P', 'S', 'Cl'], []],
      [['Fe', 'O', 'H', 'C', 'P', 'S', 'Cl'], []], [['Zn', 'O', 'H', 'N', 'P', 'S', 'Cl'], []],
      [['Pb', 'O', 'H', 'C', 'N', 'S', 'Cl'], []], [['N', 'H', 'O', 'C', 'P', 'S', 'Cl'], []],
    ] },
  'materia-energia': {
    elementos: ['H', 'C', 'O', 'Na', 'Si', 'S', 'Cl', 'Fe'],
    vistas: [
      [['H', 'O', 'Fe'], []],
      [['H', 'O', 'Na', 'Cl'], ['--c-fa', '--c-co']],
      [['C', 'H', 'O'], ['--c-m']],
      [['C', 'H', 'O', 'Fe'], []],
      [['H', 'O', 'Si'], []],
      [['H', 'O', 'C'], []],
      [['H', 'O', 'Fe', 'S'], []],
      [['Fe', 'O'], ['--c-m']],
      [['H', 'O'], ['--c-T']],
    ] },
};

const leer = d => fs.readFileSync(path.join(raiz, d, 'index.html'), 'utf8');
function variables(html, selector) {
  const i = html.indexOf(selector);
  const cuerpo = html.slice(i + selector.length, html.indexOf('}', i));
  return Object.fromEntries([...cuerpo.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)].map(m => [m[1], m[2].toLowerCase()]));
}

for (const [dir, cfg] of Object.entries(ESCENAS)) {
  if (!fs.existsSync(path.join(raiz, dir, 'index.html'))) { test(`${dir}: todavía no está en esta rama`, { skip: true }, () => {}); continue; }
  test(`${dir}: el bloque de elementos es el de Elementos.css()`, () => {
    const html = leer(dir);
    assert.ok(html.includes(E.css(cfg.elementos)), 'falta el bloque generado o no coincide con nucleo/elementos.js');
    // Ningún elemento se define a mano con otro nombre o con otro color.
    for (const e of E.SIMBOLOS) {
      if (!(cfg.ajenas || []).includes(e)) assert.ok(!new RegExp(`--(?:c|e)-${e}\\s*:\\s*#`).test(html), `${e} definido a mano`);
      const defs = html.match(new RegExp(`--el-${e}:#[0-9a-f]{6}`, 'g')) || [];
      assert.ok(defs.length === 0 || cfg.elementos.includes(e), `${e} sin declarar en la lista de la escena`);
    }
    // Todo --el-X que la escena usa está en su bloque.
    for (const m of html.matchAll(/var\(--el-([A-Z][a-z]?)\)/g)) assert.ok(cfg.elementos.includes(m[1]), `usa --el-${m[1]} sin definirlo`);
  });

  test(`${dir}: en cada vista, elementos y variables se separan (ΔE00 ≥ 20)`, () => {
    const html = leer(dir);
    const claro = variables(html, ':root{'), oscuro = variables(html, ':root[data-theme="dark"]{');
    for (const [els, vars] of cfg.vistas) {
      const col = x => x.startsWith('--') ? { claro: claro[x], oscuro: oscuro[x] } : E.COLORES[x];
      const todos = [...els, ...vars, '--ink'];
      for (let i = 0; i < todos.length; i++)
        for (let j = i + 1; j < todos.length; j++) {
          const a = todos[i], b = todos[j];
          if (a.startsWith('--') && b.startsWith('--')) continue;   // los pares entre variables son de la escena
          assert.ok(col(a).claro && col(a).oscuro && col(b).claro && col(b).oscuro, `${dir}: falta color de ${a} o ${b}`);
          const d = E.distancia(col(a), col(b));
          assert.ok(d >= 20, `${dir} [${els.join(', ')}]: ${a}–${b} ${d.toFixed(1)}`);
        }
    }
  });
}
