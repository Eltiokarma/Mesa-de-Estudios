/*
 * Pruebas comunes de la escena viva de un generador (docs/escena-viva.md, sección 4), para los que usan las
 * piezas «flechas» y «triangulo». Se llama desde el generador.test.js de cada uno:
 *   probarViva(gen, { semillas, pieza, conEscena(p) → bool, final(p, svg), presupuestoSoloEscena })
 * Comprueba: la pieza existe; el final no tiene NaN y dibuja lo que pide final(); presupuesto de texto
 * (enunciado ≤ 40, paso ≤ 14, error ≤ 20); cada error con nombre tiene fantasma; si se arrastra, cada
 * alternativa cabe en la marca y la marca en su valor equivale a esa alternativa. Un id de error repetido dentro
 * de un problema lleva fantasma vacío ({}): no se sabría cuál de los dos dibujar.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const LT = require('../linea-tiempo.js');

function probarViva(gen, o = {}) {
  const N = o.semillas || 300;
  const pieza = require(`./${o.pieza}.js`);
  const conEscena = o.conEscena || (() => true);

  test(`${gen.id}: escena viva con la pieza «${o.pieza}» y su final dibuja la respuesta`, () => {
    let con = 0;
    for (let s = 0; s < N; s++) {
      const p = gen.generar(s);
      if (!conEscena(p)) { assert.equal(p.escena, undefined, `semilla ${s}: este tipo no lleva escena`); continue; }
      con++;
      assert.equal(p.escena.pieza, o.pieza);
      assert.ok(Kit.piezas[p.escena.pieza]);
      assert.ok(typeof p.escena.alt === 'string' && p.escena.alt.length > 20);
      const fin = pieza.dibujar(p.escena.datos, LT.estado(p.pasos, p.pasos.length, { fantasma: Object.values(p.fantasmas)[0] }));
      assert.ok(!/NaN|undefined|null|Infinity/.test(fin), `semilla ${s}: ${fin.match(/.{30}(NaN|undefined|null|Infinity).{10}/)}`);
      if (o.final) o.final(p, fin, s);
      const ini = pieza.dibujar(p.escena.datos, { corte: 0 });
      assert.ok(!/NaN|undefined|null|Infinity/.test(ini));
      assert.equal(ini.match(/viewBox="([^"]+)"/)[1], fin.match(/viewBox="([^"]+)"/)[1], 'alto fijo');
    }
    assert.ok(con > 0, 'ningún problema trae escena');
  });

  test(`${gen.id}: presupuesto de texto (enunciado ≤ 40, paso ≤ 14, error ≤ 20)`, () => {
    for (let s = 0; s < N; s++) {
      const p = gen.generar(s);
      if (o.presupuestoSoloEscena && !p.escena) continue; // migración a medias: los tipos sin escena siguen como antes
      // Enunciado: palabras con al menos una letra, como herramientas/validar-ejercicios.js (los datos no cuentan).
      const letras = x => Kit.plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
      const n = letras(p.enunciado) + letras(p.pregunta);
      assert.ok(n <= 40, `semilla ${s}: enunciado de ${n} palabras`);
      for (const a of p.alternativas.filter(x => x.error)) assert.ok(Kit.palabras(a.error.explicacion) <= 20, `semilla ${s}: «${a.error.explicacion}»`);
      const pasos = p.pasos || p.solucion.map(t => ({ texto: t }));
      for (const q of pasos) {
        assert.ok(Kit.palabras(q.texto) <= 14, `semilla ${s}: «${Kit.plano(q.texto)}» pasa de 14 palabras`);
        assert.ok(!/NaN|undefined|null/.test(Kit.plano(q.texto) + Kit.plano(q.ecuacion || '')));
      }
      if (p.pasos) {
        assert.ok(p.pasos.length >= 2);
        for (const q of p.pasos) assert.ok(Array.isArray(q.ecuacion) && q.ecuacion.length, `semilla ${s}: paso sin ecuación`);
        assert.ok(p.pasos[p.pasos.length - 1].estado.final, 'el último paso es el resultado');
      }
    }
  });

  test(`${gen.id}: fantasmas por error y la marca equivale a cada alternativa`, () => {
    for (let s = 0; s < N; s++) {
      const p = gen.generar(s);
      if (!p.escena) continue;
      for (const a of p.alternativas) if (a.error) assert.ok(p.fantasmas[a.error.id], `semilla ${s}: ${a.error.id} sin fantasma`);
      const r = p.respuesta;
      if (r.tipo !== 'arrastrar') continue;
      const c = pieza.controles(p.escena.datos).marca;
      assert.ok(c, `semilla ${s}: se arrastra pero la pieza no da marca`);
      assert.ok(r.paso > 0 && r.tolerancia >= r.paso / 2);
      assert.ok(Math.abs(pieza.controles(p.escena.datos).respuesta - r.valor) < 1e-9);
      for (const a of p.alternativas) {
        assert.ok(a.valor >= c.min - 1e-9 && a.valor <= c.max + 1e-9, `semilla ${s}: ${a.texto} no cabe`);
        const puesto = Kit.respuesta.ajustar(a.valor, r.paso, c.min, c.max);
        assert.equal(Kit.respuesta.clasificar(puesto, p.alternativas, r.tolerancia), a, `semilla ${s}: la marca en ${a.texto} no equivale`);
        // Un id que se repite en el problema no lleva fantasma (no se sabría cuál dibujar): su fantasma va vacío.
        const veces = p.alternativas.filter(x => x.error && a.error && x.error.id === a.error.id).length;
        if (a.error && veces > 1) assert.deepEqual(p.fantasmas[a.error.id], {}, `semilla ${s}: ${a.error.id} repetido con fantasma`);
        else if (a.error) assert.equal(p.fantasmas[a.error.id].marca, a.valor);
      }
    }
  });
}

module.exports = { probarViva };
