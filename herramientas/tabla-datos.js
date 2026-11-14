#!/usr/bin/env node
/*
 * Arma nucleo/kit/tabla/datos.js (los 118 elementos de la tabla viva) desde las páginas de la CIAAW.
 *
 *   node herramientas/tabla-datos.js <carpeta>
 *
 * <carpeta> trae tres páginas bajadas tal cual (no se versionan: son de la CIAAW):
 *   atomic-weights.htm            https://www.ciaaw.org/atomic-weights.htm            (Standard Atomic Weights 2024)
 *   abridged-atomic-weights.htm   https://www.ciaaw.org/abridged-atomic-weights.htm   (Abridged Standard Atomic Weights 2024)
 *   radioactive-elements.htm      https://www.ciaaw.org/radioactive-elements.htm      (isótopos más estables, NUBASE2020)
 *
 * Lo que sale de cada fuente (decisión 9 de docs/pendientes.md: nada se estima):
 *   - Z, símbolo y nombre en inglés: tabla de la CIAAW (la misma de la IUPAC).
 *   - Peso atómico estándar (completo, tal cual) y abreviado (valor ± incertidumbre): CIAAW 2024.
 *   - Sin peso atómico estándar («—» en la CIAAW): el número másico del isótopo más estable conocido (NUBASE2020,
 *     compilado por la CIAAW). Si la CIAAW da varios porque no se distinguen, se guardan todos.
 *   - Nombre en español: transcrito por un modelo (nomenclatura IUPAC en español); POR VERIFICAR con la RSEQ.
 */
'use strict';
const fs = require('fs');
const path = require('path');

// Nombres en español, índice = Z. Transcritos por modelo: por verificar (ver cabecera).
const NOMBRES = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón',
  'sodio', 'magnesio', 'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio',
  'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso', 'hierro', 'cobalto', 'níquel', 'cobre', 'zinc',
  'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón', 'rubidio', 'estroncio', 'itrio', 'circonio',
  'niobio', 'molibdeno', 'tecnecio', 'rutenio', 'rodio', 'paladio', 'plata', 'cadmio', 'indio', 'estaño',
  'antimonio', 'telurio', 'yodo', 'xenón', 'cesio', 'bario', 'lantano', 'cerio', 'praseodimio', 'neodimio',
  'prometio', 'samario', 'europio', 'gadolinio', 'terbio', 'disprosio', 'holmio', 'erbio', 'tulio', 'iterbio',
  'lutecio', 'hafnio', 'tantalio', 'wolframio', 'renio', 'osmio', 'iridio', 'platino', 'oro', 'mercurio',
  'talio', 'plomo', 'bismuto', 'polonio', 'astato', 'radón', 'francio', 'radio', 'actinio', 'torio',
  'protactinio', 'uranio', 'neptunio', 'plutonio', 'americio', 'curio', 'berkelio', 'californio', 'einstenio', 'fermio',
  'mendelevio', 'nobelio', 'laurencio', 'rutherfordio', 'dubnio', 'seaborgio', 'bohrio', 'hasio', 'meitnerio', 'darmstatio',
  'roentgenio', 'copernicio', 'nihonio', 'flerovio', 'moscovio', 'livermorio', 'teneso', 'oganesón'];
// Otros nombres de uso común en el Perú (tungsteno, cinc). Por modelo.
const OTROS = { 30: ['cinc'], 74: ['tungsteno'] };

function texto(archivo) {
  let t = fs.readFileSync(archivo, 'utf8');
  t = t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  t = t.replace(/&nbsp;/g, ' ').replace(/&plusmn;/g, '±').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  return t.replace(/\s+/g, ' ');
}

// Corta la tabla en filas «Z Símbolo nombre resto» desde el primer «1 H hydrogen» hasta «118 Og oganesson …».
function filas(t, finDeFila) {
  const ini = t.indexOf(' 1 H hydrogen ');
  if (ini < 0) throw new Error('no encontré la tabla');
  const cuerpo = t.slice(ini);
  const re = /(?:^|\s)(\d{1,3}) ([A-Z][a-z]?) ([a-z]+) /g;
  const marcas = [];
  let m, esperado = 1;
  while ((m = re.exec(cuerpo)) && esperado <= 118) {
    if (Number(m[1]) !== esperado) continue;
    marcas.push({ Z: esperado, simbolo: m[2], ingles: m[3], desde: m.index + m[0].length, inicio: m.index });
    esperado++;
  }
  if (marcas.length !== 118) throw new Error(`esperaba 118 filas, salieron ${marcas.length}`);
  return marcas.map((f, i) => {
    let resto = cuerpo.slice(f.desde, i + 1 < marcas.length ? marcas[i + 1].inicio : undefined);
    if (i === 117) resto = resto.split(finDeFila)[0];
    return { Z: f.Z, simbolo: f.simbolo, ingles: f.ingles, resto: resto.trim() };
  });
}

function notas(s) { const m = s.match(/((?:\s[gmr])+)\s*$/); return m ? m[1].trim().split(/\s+/) : []; }
function sinNotas(s) { return s.replace(/((?:\s[gmr])+)\s*$/, '').trim(); }

function leer(carpeta) {
  const completo = filas(texto(path.join(carpeta, 'atomic-weights.htm')), ' Z Symbol');
  const abreviado = filas(texto(path.join(carpeta, 'abridged-atomic-weights.htm')), ' Z Symbol');
  const radio = texto(path.join(carpeta, 'radioactive-elements.htm'));
  const iniR = radio.indexOf('Half-life ') + 'Half-life '.length;
  const finR = radio.indexOf(' Z Symbol', iniR);
  const cuerpoR = radio.slice(iniR, finR);
  // Filas: «43 Tc technetium 97 4.21(16) Ma 98 4.2(3) Ma 61 Pm …»: el másico es un entero seguido de una vida media.
  const masicos = {};
  const reR = /(\d{1,3}) ([A-Z][a-z]?) ([a-z]+) ((?:\d{2,3} (?:approx\. )?[\d.]+(?:\([\d.]+\))? (?:Ma|ka|a|d|h|min|ms|s) ?)+)/g;
  let m;
  while ((m = reR.exec(cuerpoR))) {
    masicos[Number(m[1])] = [...m[4].matchAll(/(\d{2,3}) (?:approx\. )?[\d.]+(?:\([\d.]+\))? (?:Ma|ka|a|d|h|min|ms|s)/g)].map(x => Number(x[1]));
  }

  return completo.map((c, i) => {
    const a = abreviado[i];
    if (a.simbolo !== c.simbolo) throw new Error(`Z = ${c.Z}: ${a.simbolo} contra ${c.simbolo}`);
    const e = { Z: c.Z, simbolo: c.simbolo, nombre: NOMBRES[c.Z] };
    if (OTROS[c.Z]) e.otros = OTROS[c.Z];
    const estandar = sinNotas(c.resto);
    if (estandar === '—') {
      if (!masicos[c.Z]) throw new Error(`Z = ${c.Z} no tiene peso estándar ni número másico`);
      e.masico = masicos[c.Z];
    } else {
      const ab = sinNotas(a.resto).match(/^([\d.]+) ± ([\d.]+)$/);
      if (!ab) throw new Error(`Z = ${c.Z}: no entiendo el abreviado «${a.resto}»`);
      e.peso = Number(ab[1]);
      e.pesoTexto = ab[1];
      e.incertidumbre = Number(ab[2]);
      e.estandar = estandar;
      const n = notas(c.resto);
      if (n.length) e.notas = n;
    }
    return e;
  });
}

function escribir(datos, destino) {
  const lineas = datos.map(e => '    ' + JSON.stringify(e));
  const js = `/*
 * Datos de la tabla viva: los 118 elementos. ARCHIVO GENERADO por herramientas/tabla-datos.js: no se edita a mano.
 *
 * Fuentes (bajadas el ${new Date().toISOString().slice(0, 10)}):
 *   - Z, símbolo, peso atómico estándar (\`estandar\`, tal cual) y abreviado (\`peso\` ± \`incertidumbre\`, con su texto
 *     en \`pesoTexto\` para no perder los ceros): CIAAW, Standard Atomic Weights 2024 y Abridged Standard Atomic Weights
 *     2024 (https://www.ciaaw.org/atomic-weights.htm y abridged-atomic-weights.htm). Notas g, m y r de la CIAAW.
 *   - \`masico\`: solo en los elementos SIN peso atómico estándar; números másicos del isótopo más estable conocido
 *     (NUBASE2020, compilado por la CIAAW en radioactive-elements.htm). Varios si la CIAAW no los distingue.
 *     No es un peso atómico: se muestra entre corchetes y con su rótulo.
 *   - \`nombre\` y \`otros\` en español: transcritos por un modelo, POR VERIFICAR con la nomenclatura de la RSEQ.
 * Ninguna propiedad se estima (decisión 9): lo que no está aquí no existe para la tabla.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Kit = root.Kit || {}).tablaDatos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ELEMENTOS = [
${lineas.join(',\n')}
  ];
  ELEMENTOS.forEach(Object.freeze);
  const FUENTES = Object.freeze({
    peso: 'CIAAW, Standard Atomic Weights 2024 (abreviado)',
    masico: 'NUBASE2020 (Kondev y otros, Chinese Physics C 45, 030001), compilado por la CIAAW',
    nombre: 'Transcrito por modelo; por verificar con la RSEQ'
  });
  return Object.freeze({ ELEMENTOS: Object.freeze(ELEMENTOS), FUENTES });
});
`;
  fs.writeFileSync(destino, js);
}

if (require.main === module) {
  const carpeta = process.argv[2];
  if (!carpeta) { console.error('uso: node herramientas/tabla-datos.js <carpeta con las páginas de la CIAAW>'); process.exit(1); }
  const datos = leer(carpeta);
  const destino = path.join(__dirname, '..', 'nucleo', 'kit', 'tabla', 'datos.js');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  escribir(datos, destino);
  console.log(`${datos.length} elementos; ${datos.filter(e => e.peso).length} con peso estándar → ${path.relative(process.cwd(), destino)}`);
}

module.exports = { leer, NOMBRES };
