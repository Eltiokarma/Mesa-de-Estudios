#!/usr/bin/env node
/*
 * Palabras candidatas al glosario de una unidad (docs/teoria.md, 4d). Es un informe para el autor, no una prueba:
 * lista las palabras largas del texto de la unidad que no cubre ningún glosario del curso, primero las que también
 * salen en otras unidades del curso (las más probables de ser vocabulario del curso).
 *   node herramientas/palabras-glosario.js fisica.dinamica [más unidades…]
 * La decisión es del autor: «carrito» no va; «fuerza normal» sí. Un término de varias palabras no sale aquí.
 */
const fs = require('fs');
const path = require('path');
const G = require('../nucleo/glosario.js');
const C = require('./construir-catalogo.js');
const RAIZ = path.join(__dirname, '..');

const COMUNES = new Set(('además ahora alguna algunas algunos antes cambia cambiar cambio cada caso casos cierto cierta como cuando cuánto cuánta '
  + 'cuántos después distinta distinto donde durante entonces escribe estaba frente grande iguales ideas igual mientras mismo misma mismos '
  + 'mueve mover nuevo nueva número números otras otros palabra parte porque primero prueba pruebas puede pueden queda quedan respuesta '
  + 'segundo siempre siguiente sobre también tiene tienen todas todos través último última valor valores vuelve correcta incorrecta '
  + 'opción opciones arrastra elige marca marcas figura círculos compara cuenta cuentas camino lugar manera forma veces juega mira regla '
  + 'coincide depende derecha izquierda duplica importa empieza necesita fórmula ejemplo pregunta resultado cantidad').split(' ').map(G.clave));

function main(ids) {
  const glos = C.construirGlosario();
  for (const id of ids) {
    const [curso, slug] = id.split('.');
    const archivo = path.join(RAIZ, 'contenido', 'teoria', curso, `${slug}.js`);
    if (!fs.existsSync(archivo)) { console.log(`${id}: no tiene teoría`); continue; }
    const cubiertas = (glos[curso] ? glos[curso].entradas : []);
    const texto = G.texto(require(archivo));
    const cuenta = {};
    for (const w of texto.match(/\p{L}{7,}/gu) || []) {
      const k = G.clave(w);
      if (COMUNES.has(k) || cubiertas.some(e => e.formas.some(f => G.clave(f) === k))) continue;
      cuenta[k] = cuenta[k] || { w: w.toLowerCase(), n: 0 };
      cuenta[k].n++;
    }
    // En cuántas otras unidades del curso aparece cada palabra.
    const dir = path.join(RAIZ, 'contenido', 'teoria', curso);
    const otros = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.endsWith('.test.js') && f !== `${slug}.js`)
      .map(f => G.clave(G.texto(require(path.join(dir, f)))));
    const filas = Object.entries(cuenta).map(([k, x]) => ({ ...x, otras: otros.filter(t => t.includes(k)).length }))
      .sort((a, b) => b.otras - a.otras || b.n - a.n).slice(0, 40);
    console.log(`\n${id}: ${cubiertas.filter(e => e.en === id).length} términos propios; candidatas (palabra · veces aquí · en otras unidades)`);
    for (const f of filas) console.log(`  ${f.w} · ${f.n} · ${f.otras}`);
  }
}
main(process.argv.slice(2));
