// Pruebas de las aperturas (docs/metodo/apertura-pisa.md): cada archivo contenido/aperturas/<curso>/<unidad>.js cumple
// el formato y las reglas de la entrada PISA (docs/metodo/entrada-pisa.md). Una apertura nueva se descubre sola.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Ecuacion = require('../../nucleo/ecuacion.js');
const Teoria = require('../../nucleo/teoria.js');
const Reglas = require('../../nucleo/teoria-reglas.js');

const RAIZ = path.join(__dirname, '..', '..');
const cursos = Object.fromEntries(fs.readdirSync(path.join(RAIZ, 'catalogo', 'cursos')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo', 'cursos', f), 'utf8'))).map(c => [c.id, c]));
const archivos = fs.readdirSync(__dirname, { withFileTypes: true }).filter(d => d.isDirectory())
  .flatMap(d => fs.readdirSync(path.join(__dirname, d.name)).filter(f => f.endsWith('.js') && !f.endsWith('.test.js')).map(f => [d.name, f]));

// El lector de la app, sin DOM: solo arma el HTML (window.Apertura.html).
global.window = { Ecuacion };
require('../../app/apertura.js');
const Apertura = global.window.Apertura;

const liso = Reglas.liso;
const textoSVG = svg => Teoria.textoSVG(svg);
const norma = s => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[«»"“”¿?¡!.,;:()]/g, ' ').replace(/\s+/g, ' ').trim();
const palabrasDe = s => norma(s).split(' ').filter(Boolean);
const VACIAS = new Set(('el la los las un una unos unas de del al a en y o u e que se su sus es son por con para como mas menos no si lo le les ' +
  'este esta estos estas ese esa eso cada otro otra hay tiene tienen').split(' '));
// Oraciones de un texto: se corta después de . ! ? cuando sigue una mayúscula, un signo de apertura o una cifra.
const oraciones = t => liso(t).split(/(?<=[.!?])\s+(?=[¿¡«A-ZÁÉÍÓÚÑ0-9])/u).map(x => x.trim()).filter(Boolean);
const nPalabras = o => o.split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length;

// ¿La apertura trae la respuesta de una Predice o de una misión? Misma comprobación que el glosario y «Lee» en
// nucleo/teoria-reglas.js: la respuesta entera (de tres palabras o más) o cuatro palabras seguidas de ella con tres que
// digan algo, y el valor de dos cifras o más que la pregunta no dio.
function delata(texto, respuesta, pregunta, { entera = true } = {}) {
  const w = palabrasDe(liso(respuesta)), t = ` ${palabrasDe(texto).join(' ')} `;
  const frases = [];
  if (entera && w.length >= 3) frases.push(w.join(' '));
  for (let i = 0; i + 4 <= w.length; i++) { const f = w.slice(i, i + 4); if (f.filter(x => !VACIAS.has(x)).length >= 3) frases.push(f.join(' ')); }
  const f = frases.find(x => t.includes(` ${x} `));
  if (f) return `la frase «${f}»`;
  const dados = Teoria.numerosDe(liso(pregunta)), enTexto = Teoria.numerosDe(texto);
  const nuevos = [...Teoria.numerosDe(liso(respuesta))].filter(n => !dados.has(n) && n.replace(/[^\d]/g, '').replace(/^0+/, '').length >= 2);
  const v = nuevos.find(n => enTexto.has(n));
  return v ? `el valor ${v}` : null;
}

test('hay al menos una apertura', () => assert.ok(archivos.length >= 1));

for (const [curso, archivo] of archivos) {
  test(`apertura ${curso}/${archivo}: formato y reglas de la entrada PISA`, () => {
    const def = require(path.join(__dirname, curso, archivo));
    const id = `${curso}.${archivo.replace(/\.js$/, '')}`;
    assert.equal(def.unidad, id, 'el nombre del archivo es el id de la unidad');
    assert.ok(cursos[curso] && cursos[curso].unidades.some(u => u.id === id), `la unidad ${id} no está en el catálogo`);

    // Título en pregunta, de 3 a 4 párrafos y la pregunta «Antes de seguir».
    assert.match(def.titulo || '', /^¿[^?]+\?$/, 'el título es una pregunta: abre con ¿ y cierra con ?');
    assert.ok(Array.isArray(def.parrafos) && def.parrafos.length >= 3 && def.parrafos.length <= 4, 'de 3 a 4 párrafos');
    assert.ok(def.pregunta && /\?$/.test(liso(def.pregunta).trim()), 'la pregunta «Antes de seguir» termina en ?');

    // Lo que ve el alumno, en texto plano.
    const f = def.figura;
    const visibles = [['título', def.titulo], ...def.parrafos.map((p, i) => [`párrafo ${i + 1}`, liso(p)]), ['pregunta', liso(def.pregunta)],
      ...(f ? [['pie de la figura', liso(f.pie || '')], ['texto alternativo', f.alt || ''], ['texto de la figura', textoSVG(f.svg || '')]] : []),
      ...(def.ecuacion ? [['ecuación', liso(def.ecuacion)]] : [])];
    for (const [d, t] of visibles) {
      assert.ok(!/—/.test(t), `${d}: sin raya (—); usa punto, coma, dos puntos o paréntesis`);
      assert.ok(!/\d\.\d/.test(t), `${d}: coma decimal, no punto («${(t.match(/\S*\d\.\d\S*/) || [''])[0]}»)`);
      assert.ok(!/NaN|undefined|Infinity|\[object/.test(t), `${d}: muestra NaN, undefined o un objeto`);
    }

    // Oraciones de 10 palabras o más en los párrafos y en la pregunta (texto de corrido, escribidor-escribano 9.4).
    for (const [d, t] of [...def.parrafos.map((p, i) => [`párrafo ${i + 1}`, p]), ['pregunta', def.pregunta]]) {
      for (const o of oraciones(t)) assert.ok(nPalabras(o) >= 10, `${d}: oración de ${nPalabras(o)} palabras (mínimo 10): «${o}»`);
    }

    // La figura: dos paneles rotulados, sin NaN, después de un párrafo que existe y con su texto alternativo.
    assert.ok(f && typeof f.svg === 'string' && /^\s*<svg\b[\s\S]*<\/svg>\s*$/.test(f.svg), 'figura: { svg } con un <svg> entero');
    const tf = textoSVG(f.svg);
    // En razonamiento verbal el choque es entre dos lecturas de un texto: sus paneles pueden ser «Lo que se entiende» y «Lo que dice».
    const [rIzq, rDer] = curso === 'razonamiento-verbal' && tf.includes('Lo que se entiende') ? ['Lo que se entiende', 'Lo que dice'] : ['Lo que predice', 'Lo que se mide'];
    assert.ok(tf.includes(rIzq) && tf.includes(rDer), `figura: dos paneles rotulados «${rIzq}» y «${rDer}»`);
    assert.ok(!/NaN|undefined|Infinity/.test(f.svg), 'figura: el SVG trae NaN o undefined');
    assert.ok(Number.isInteger(f.antes) && f.antes >= 1 && f.antes < def.parrafos.length, 'figura.antes: el párrafo después del que va (no el último)');
    assert.ok(f.alt && f.alt.length > 40, 'figura.alt: el texto alternativo cuenta el choque');
    // Los colores de la figura son los de las variables y los de la app (regla 4): nunca un color suelto.
    for (const m of f.svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{3,8}|rgb[^"]*)"/gi)) assert.fail(`figura: color suelto ${m[1]}; usa var(--c-*) o currentColor`);
    for (const m of f.svg.matchAll(/var\(--(c-[a-z])\)/g)) assert.ok(['c-o', 'c-i', 'c-h', 'c-d', 'c-f'].includes(m[1]), `figura: --${m[1]} no es un color de variable`);

    // La ecuación (opcional): fichas de color de nucleo/ecuacion.js que se pintan.
    if (def.ecuacion !== undefined) {
      const ls = Array.isArray(def.ecuacion[0]) ? def.ecuacion : [def.ecuacion];
      for (const l of ls) assert.ok(!/NaN|undefined/.test(Ecuacion.html(l)), 'ecuación con NaN o undefined');
      if (def.ecuacionAntes !== undefined) assert.ok(Number.isInteger(def.ecuacionAntes) && def.ecuacionAntes >= 1 && def.ecuacionAntes <= def.parrafos.length, 'ecuacionAntes: un párrafo que existe');
    }

    // No delata: ni la respuesta de una Predice ni la de una misión de la unidad.
    const rel = path.join(RAIZ, 'contenido', 'teoria', curso, archivo);
    if (fs.existsSync(rel)) {
      const T = require(rel), todo = visibles.map(([, t]) => t).join(' · ');
      for (const [k, idea] of (T.ideas || []).entries()) {
        const P = idea.predice, buena = P && (P.opciones || []).find(x => x && x.correcta);
        if (buena) {
          const q = delata(todo, buena.texto, `${liso(P.pregunta)} ${(P.datos || []).map(liso).join(' ')}`);
          assert.ok(!q, `trae ${q}, que es la respuesta de la Predice de la idea ${k + 1} (${idea.id}): «${liso(buena.texto)}»`);
        }
        const M = idea.juega && idea.juega.mision;
        if (M && M.bien) {
          const q = delata(todo, M.bien, liso(M.texto), { entera: false });
          assert.ok(!q, `trae ${q}, que sale del acierto de la misión de la idea ${k + 1} (${idea.id}): «${liso(M.bien)}»`);
        }
      }
    }

    // La ficha para Gerson: completa, con los datos de memoria, y fuera de lo que ve el alumno.
    const fi = def.ficha || {};
    for (const c of ['seLleva', 'alcance', 'choque', 'atajo']) assert.ok(typeof fi[c] === 'string' && fi[c].trim(), `ficha.${c}: falta`);
    // Lo que el alumno se lleva (apertura-pisa.md, «Lo que el alumno se lleva»): una oración entera, con verbo y punto final.
    assert.ok(oraciones(fi.seLleva).length >= 1 && nPalabras(fi.seLleva) >= 10 && /\.$/.test(fi.seLleva.trim()), 'ficha.seLleva: una oración de 10 palabras o más que termina en punto');
    assert.ok(Array.isArray(fi.porVerificar) && fi.porVerificar.every(x => typeof x === 'string' && x.trim()), 'ficha.porVerificar: lista de los datos que salieron de memoria (vacía si no hay)');
    const html = Apertura.html(def);
    for (const c of ['seLleva', 'alcance', 'choque', 'atajo']) assert.ok(!html.includes(fi[c]), `la app muestra ficha.${c}`);
    for (const x of fi.porVerificar) assert.ok(!html.includes(x), 'la app muestra ficha.porVerificar');
    assert.ok(html.includes('Antes de seguir') && html.includes(rIzq), 'el HTML trae la pregunta y la figura');
  });
}

test('el catálogo de la app sabe qué unidades tienen apertura (si falla: npm run catalogo)', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app', 'datos', 'catalogo.json'), 'utf8'));
  const con = new Set(cat.cursos.flatMap(c => c.unidades).filter(u => u.apertura).map(u => u.id));
  for (const [curso, archivo] of archivos) {
    const id = `${curso}.${archivo.replace(/\.js$/, '')}`;
    assert.ok(con.has(id), `${id} tiene apertura y el catálogo no la trae`);
    const u = cat.cursos.flatMap(c => c.unidades).find(x => x.id === id);
    assert.equal(u.apertura, `/contenido/aperturas/${curso}/${archivo}`);
  }
});
