// Pruebas comunes a todo generador del formato "predicciones" (se usan desde cada
// plantillas/<id>/generador.test.js). Cada módulo agrega su cálculo independiente.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RESPALDOS = ['documentado', 'parcial', 'hipotesis'];
const raiz = path.join(__dirname, '..');

// igual(esperado, valor): cómo comparar el recálculo independiente con la respuesta. Por defecto,
// números con tolerancia 1e-9; para respuestas de armarTexto, igualdad de claves (===).
const igualNumero = (a, b) => Math.abs(a - b) < 1e-9;

function probarGenerador(gen, { semillas = 400, recalcular, igual = igualNumero } = {}) {
  test(`${gen.id}: la misma semilla da el mismo problema`, () => {
    for (const s of [0, 1, 'entrada-1', 'salida-3']) assert.deepEqual(gen.generar(s), gen.generar(s));
  });

  test(`${gen.id}: ${semillas} problemas bien armados`, () => {
    for (let s = 0; s < semillas; s++) {
      const p = gen.generar(s);
      const alt = p.alternativas;
      assert.ok(alt.length >= 4 && alt.length <= 5, `semilla ${s}: ${alt.length} alternativas`);
      assert.equal(alt.filter(a => a.correcta).length, 1, `semilla ${s}: debe haber una sola correcta`);
      assert.equal(new Set(alt.map(a => a.texto)).size, alt.length, `semilla ${s}: alternativas repetidas`);
      assert.deepEqual(alt.map(a => a.letra), ['A', 'B', 'C', 'D', 'E'].slice(0, alt.length));
      for (const a of alt.filter(a => !a.correcta)) {
        assert.ok(a.error && a.error.id && a.error.explicacion, `semilla ${s}: error sin id o explicación`);
        assert.ok(RESPALDOS.includes(a.error.respaldo), `semilla ${s}: respaldo inválido`);
        if (a.error.fuente) assert.ok(fs.existsSync(path.join(raiz, a.error.fuente)), `no existe ${a.error.fuente}`);
      }
      const correcta = alt.find(a => a.correcta);
      assert.equal(correcta.valor, p.respuesta.valor, `semilla ${s}: la correcta no es la respuesta`);
      if (recalcular) {
        const esperado = recalcular(p);
        assert.ok(igual(esperado, p.respuesta.valor), `semilla ${s}: el cálculo independiente da ${esperado}, el generador ${p.respuesta.valor}`);
      }
      for (const campo of ['enunciado', 'pregunta', 'solucion']) assert.ok(Array.isArray(p[campo]) && p[campo].length, `semilla ${s}: falta ${campo}`);
      // Nada de «null», «NaN» ni «undefined» en lo que ve el alumno (un texto exacto que no se pudo armar).
      const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
      const visto = [p.enunciado, p.pregunta, p.solucion, alt.map(a => a.texto), alt.filter(a => a.error).map(a => a.error.explicacion)].map(plano).join(' ');
      assert.ok(!/\bnull\b|\bNaN\b|\bundefined\b/.test(visto), `semilla ${s}: el texto muestra null, NaN o undefined`);
      // Figura opcional ({ svg, alt }, ver app/practica.js): SVG propio, con descripción y sin código.
      for (const campo of ['figura', 'figuraSolucion']) {
        const f = p[campo];
        if (f === undefined || f === null) continue;
        assert.ok(typeof f.svg === 'string' && /^<svg[\s>]/.test(f.svg) && /viewBox=/.test(f.svg), `semilla ${s}: ${campo} sin <svg viewBox>`);
        assert.ok(typeof f.alt === 'string' && f.alt.length > 10, `semilla ${s}: ${campo} sin descripción (alt)`);
        assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject/i.test(f.svg), `semilla ${s}: ${campo} con código`);
        assert.ok(!/#[0-9a-f]{3,6}\b/i.test(f.svg), `semilla ${s}: ${campo} con colores fijos (usa var(--c-*) o currentColor)`);
      }
    }
  });
}

/*
 * Fugas (opcional): la correcta no debe poder adivinarse sin resolver.
 *   - «central»: la alternativa que comparte más rasgos con las demás (distancia entre los textos
 *     partidos en números, letras y signos) es la correcta en más de `central` de los problemas;
 *   - «extremo»: con respuestas numéricas, la correcta es la mayor o la menor en más de `extremo`.
 * Se mide por grupo (por defecto _datos.tipo + _datos.sub), solo en grupos con al menos `minimo` problemas.
 * valorNumerico(a) convierte una alternativa en número (por defecto a.valor si es número; si no, NaN).
 */
const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
function distancia(a, b) {
  const A = trozos(a), B = trozos(b); let d = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++;
  return d;
}
function medirFugas(gen, { semillas = 1500, grupo = p => [p._datos && p._datos.tipo, p._datos && (p._datos.sub || p._datos.pide || '')].join('/'), valorNumerico = a => (typeof a.valor === 'number' ? a.valor : NaN) } = {}) {
  const por = {};
  for (let s = 0; s < semillas; s++) {
    const p = gen.generar(s), al = p.alternativas, k = grupo(p);
    const o = por[k] = por[k] || { n: 0, central: 0, numericos: 0, extremo: 0 };
    o.n++;
    const sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
    const mejores = al.filter((a, i) => sc[i] === Math.min(...sc));
    if (mejores.length === 1 && mejores[0].correcta) o.central++;
    const v = al.map(valorNumerico);
    if (v.every(Number.isFinite)) {
      o.numericos++;
      const c = v[al.findIndex(a => a.correcta)];
      if (c === Math.max(...v) || c === Math.min(...v)) o.extremo++;
    }
  }
  return por;
}
function probarFugas(gen, { central = 0.4, extremo = 0.75, minimo = 15, ...opciones } = {}) {
  test(`${gen.id}: la correcta no se adivina por ser la central ni por estar en un extremo`, () => {
    const malos = [];
    for (const [k, o] of Object.entries(medirFugas(gen, opciones))) {
      if (o.n < minimo) continue;
      if (o.central / o.n > central) malos.push(`${k}: central ${Math.round(100 * o.central / o.n)} %`);
      if (o.numericos >= minimo && o.extremo / o.numericos > extremo) malos.push(`${k}: extremo ${Math.round(100 * o.extremo / o.numericos)} %`);
    }
    assert.deepEqual(malos, []);
  });
}

/*
 * Escala de los distractores (decisión de Gerson, 12 nov 2026). Un distractor va entre 1/tope y tope
 * veces la correcta (por defecto 20), salvo que sea una trampa de unidades: su error tiene un código
 * U1–U8 (docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md) o QU1–QU4, AU1–AU4, RU1
 * (química, aritmética y geometría, razonamiento matemático). Esas pueden llegar a topeUnidades
 * veces (por defecto 1000): mT sin pasar a T, cm² entre 100, g por kg, minutos por segundos.
 */
const { CODIGO_UNIDADES } = require('./predicciones.js');
const esTrampaDeUnidades = a => !!(a && a.error && CODIGO_UNIDADES.test(String(a.error.id)));
const topeEscala = (a, { tope = 20, topeUnidades = 1000 } = {}) => (esTrampaDeUnidades(a) ? Math.max(tope, topeUnidades) : tope);
function dentroDeEscala(a, correcta, { tope = 20, topeUnidades = 1000 } = {}) {
  const r = Math.abs(a.valor) / Math.abs(correcta);
  const t = topeEscala(a, { tope, topeUnidades });
  return r >= 1 / t && r <= t;
}

module.exports = { probarGenerador, probarFugas, medirFugas, distancia, dentroDeEscala, topeEscala, esTrampaDeUnidades, CODIGO_UNIDADES };
