// Pruebas de app/estilos.css: los estados de una alternativa (elegida, correcta, incorrecta) medidos con los colores
// que de verdad declara la hoja, en tema claro y oscuro. Las cuentas son las de herramientas/auditar-colores.py
// (contraste WCAG, distancia en OKLab y simulación de daltonismo de Machado y otros, 2009).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, 'estilos.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const dec = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const enc = c => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const lin = h => { const x = h.replace('#', ''); const y = x.length === 3 ? x.replace(/./g, '$&$&') : x; return [0, 2, 4].map(i => dec(parseInt(y.slice(i, i + 2), 16) / 255)); };
const hex = l => '#' + l.map(c => Math.round(enc(c) * 255).toString(16).padStart(2, '0')).join('');
const Y = h => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [lo, hi] = [Y(a), Y(b)].sort((x, y) => x - y); return (hi + 0.05) / (lo + 0.05); };
const oklab = ([r, g, b]) => {
  const [L, M, S] = [0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b, 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b].map(Math.cbrt);
  return [0.2104542553 * L + 0.7936177850 * M - 0.0040720468 * S, 1.9779984951 * L - 2.4285922050 * M + 0.4505937099 * S, 0.0259040371 * L + 0.7827717662 * M - 0.8086757660 * S];
};
const dist = (a, b) => Math.hypot(...oklab(lin(a)).map((x, i) => x - oklab(lin(b))[i]));
const CVD = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const simular = (h, t) => { const l = lin(h); return hex(CVD[t].map(f => f.reduce((s, m, i) => s + m * l[i], 0))); };

// Los tokens de cada tema: el bloque :root del principio y el de :root[data-theme="dark"] (el oscuro hereda del claro).
const tokens = bloque => Object.fromEntries([...bloque.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)].map(m => [m[1], m[2].trim()]));
const claro = tokens(css.match(/:root\{([\s\S]*?)\}/)[1]);
const oscuro = Object.assign({}, claro, tokens(css.match(/:root\[data-theme="dark"\]\{([\s\S]*?)\}/)[1]));
const TEMAS = { claro, oscuro };
// Las declaraciones que le tocan a un selector exacto (el último gana, como en la cascada para la misma especificidad).
function regla(selector) {
  const out = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!m[1].split(',').map(s => s.trim()).includes(selector)) continue;
    for (const d of m[2].split(';')) { const k = d.indexOf(':'); if (k > 0) out[d.slice(0, k).trim()] = d.slice(k + 1).trim(); }
  }
  return out;
}
const color = (valor, tema) => {
  const v = String(valor).replace(/var\((--[\w-]+)\)/g, (_, k) => tema[k] || `var(${k})`);
  assert.match(v, /^#[0-9a-f]{3,8}$/i, `se esperaba un color liso y salió «${valor}»`);
  return v;
};

test('la alternativa elegida va en tinta: sin el violeta de la marca, con contraste y distinta de correcta e incorrecta', () => {
  for (const sel of ['.alt.on', '.alt.elegida']) {
    const caja = regla(sel), letra = regla(`${sel} .letra`);
    for (const [k, v] of Object.entries(Object.assign({}, caja, Object.fromEntries(Object.entries(letra).map(([a, b]) => [`letra ${a}`, b])))))
      assert.doesNotMatch(v, /--brand|--c-f/, `${sel}: ${k} usa el violeta (${v})`);
    for (const [nombre, t] of Object.entries(TEMAS)) {
      const donde = `${sel}, tema ${nombre}`;
      const relleno = color(letra.background, t), tinta = color(letra.color, t), fondo = color(caja.background, t), borde = color(caja['border-color'], t);
      // La letra (14 px): texto normal, 4,5:1. El relleno y el borde son lo que identifica el estado: 3:1 contra lo de al lado.
      assert.ok(contraste(tinta, relleno) >= 4.5, `${donde}: la letra sobre su relleno da ${contraste(tinta, relleno).toFixed(2)}:1`);
      assert.ok(contraste(relleno, fondo) >= 3, `${donde}: el relleno de la letra contra el fondo da ${contraste(relleno, fondo).toFixed(2)}:1`);
      assert.ok(contraste(borde, t['--bg']) >= 3 && contraste(borde, t['--card']) >= 3, `${donde}: el borde no llega a 3:1`);
      assert.ok(contraste(t['--ink'], fondo) >= 4.5, `${donde}: el texto de la alternativa no llega a 4,5:1`);
      // Distinta del violeta de las variables y de los rellenos de «correcta» e «incorrecta», también con daltonismo.
      // 0,12 en OKLab: el umbral que aguantó en los casos del cuaderno de teoría del color (antes, --brand quedaba a
      // 0,089 de --c-f en claro y a 0,042 en oscuro).
      const otros = { 'el violeta de las variables (--c-f)': t['--c-f'], correcta: color(regla('.alt.ok .letra').background, t), incorrecta: color(regla('.alt.mal .letra').background, t) };
      for (const [n, c] of Object.entries(otros)) {
        const d = [dist(relleno, c), ...Object.keys(CVD).map(x => dist(simular(relleno, x), simular(c, x)))];
        assert.ok(Math.min(...d) >= 0.12, `${donde}: la letra elegida queda a ${Math.min(...d).toFixed(3)} de ${n}`);
      }
    }
  }
});
