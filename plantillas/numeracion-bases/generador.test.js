// Pruebas de «El puesto de las bases»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (parseInt y toString de JavaScript, y fuerza bruta para contar), fugas, los
// tipos por idea, los colores de la unidad, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const formatear = require('../../nucleo/predicciones.js').formatear;

// ---- Camino independiente ----
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const escrito = (cifras, base) => (base === 10 ? cifras : `${cifras}₍${[...String(base)].map(c => SUB[c]).join('')}₎`);
const lee = t => { // «2301₍₄₎» → { cifras: '2301', base: 4 }; sin subíndice, base 10
  const m = t.match(/^(\d+)(?:₍([₀-₉]+)₎)?$/);
  return m && { cifras: m[1], base: m[2] ? Number([...m[2]].map(c => SUB.indexOf(c)).join('')) : 10 };
};
const bienEscrito = ({ cifras, base }) => [...cifras].every(c => Number(c) < base);
const contar = (desde, hasta, ok) => { let c = 0; for (let x = desde; x <= hasta; x++) if (ok(x)) c++; return c; };
// Cuántas cifras tiene N en base b, dividiendo (toString solo llega a base 36).
const largo = (N, b) => { let k = 0; for (let x = N; x > 0; x = Math.floor(x / b)) k++; return k; };
const cifrasDel1Al = (N, base) => { let s = 0; for (let i = 1; i <= N; i++) s += i.toString(base).length; return s; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'etiqueta': case 'de-10': return escrito(d.N.toString(d.n), d.n);
    case 'mal-escrito': {
      const malos = p.alternativas.map(a => lee(a.texto)).filter(x => !bienEscrito(x));
      assert.equal(malos.length, 1, `${p.id}: hay ${malos.length} mal escritos`);
      return escrito(malos[0].cifras, malos[0].base);
    }
    case 'menor-base': return Math.max(...d.cifras.join('').split('').map(Number)) + 1;
    case 'sucesor': return escrito((parseInt(d.cifras, d.n) + d.llega).toString(d.n), d.n);
    case 'valor': return parseInt(d.cifras, d.n);
    case 'ordenar': {
      const vals = d.numerales.map(([t, b]) => parseInt(t, b)), i = vals.indexOf(Math.max(...vals));
      return escrito(...d.numerales[i]);
    }
    case 'mayor-k': return parseInt(String(d.n - 1).repeat(d.k), d.n);
    case 'cruzados': {
      const vals = new Set();
      for (let a = 1; a < d.n; a++) for (let b = 1; b < d.n; b++) {
        if (a === b) continue;
        const ab = parseInt(`${a}${b}`, d.n), ba = parseInt(`${b}${a}`, d.n);
        if (d.sub === 'suma' && a + b === d.S) vals.add(ab + ba);
        if (d.sub === 'resta' && a - b === d.d) vals.add(ab - ba);
      }
      assert.equal(vals.size, 1, `${p.id}: el resultado depende de a y b`);
      return [...vals][0];
    }
    case 'entre-bases': return escrito(parseInt(d.cifras, d.de).toString(d.a), d.a);
    case 'suma-cifras': return [...d.N.toString(d.n)].reduce((s, c) => s + Number(c), 0);
    case 'paquetes': { // voraz: siempre el paquete más grande que cabe
      let x = d.N, k = 0;
      for (let t = d.n ** 3; t >= 1; t /= d.n) while (x >= t) { x -= t; k++; }
      return k;
    }
    case 'lineal': case 'cuadratica': {
      const max = Math.max(...[...d.cifras].map(Number));
      const bases = []; for (let b = max + 1; b <= 40; b++) if (parseInt(d.cifras, b) === d.N) bases.push(b);
      assert.equal(bases.length, 1, `${p.id}: bases ${bases}`);
      return bases[0];
    }
    case 'otra-etiqueta': return parseInt(d.B, d.n);
    case 'acotar': {
      if (d.sub === 'suma') {
        let mejor = -1;
        for (let a = 0; a <= 9; a++) {
          const A = { cifras: `${a}${d.u}`, base: d.p }, Bn = { cifras: `${d.w}${a}`, base: d.q };
          if (a === 0 || !bienEscrito(A) || !bienEscrito(Bn)) continue;
          mejor = Math.max(mejor, parseInt(A.cifras, d.p) + parseInt(Bn.cifras, d.q));
        }
        return mejor;
      }
      return contar(-5, 30, a => a - d.s >= 1 && a - d.s < d.n && d.m * a >= 0 && d.m * a < d.n);
    }
    case 'mayor-suma': { // la base cuyo mayor numeral de k cifras tiene cifras que suman S
      const bases = []; for (let b = 2; b <= 20; b++) if ((b - 1) * d.k === d.S) bases.push(b);
      assert.equal(bases.length, 1);
      return parseInt(String(bases[0] - 1).repeat(d.k), bases[0]);
    }
    case 'cifras': return cifrasDel1Al(d.N, 10);
    case 'hasta': { let s = 0, i = 0; while (s < d.cifras) { i++; s += String(i).length; } assert.equal(s, d.cifras); return i; }
    case 'cuantos-k': return contar(1, d.n ** d.k, x => x.toString(d.n).length === d.k);
    case 'cifras-base': return cifrasDel1Al(d.N, d.n);
    case 'bases-tres': return contar(2, d.N, b => largo(d.N, b) === 3);
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const IDEAS = require('../../contenido/teoria/aritmetica/numeracion.js').ideas.map(i => i.id);
test('tipos por idea: las cinco ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) {
      const p = gen.generar(`i${s}`, { idea, unidad: 'aritmetica.numeracion' });
      assert.equal(p._datos.idea, idea);
      assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo), `${idea}: salió ${p._datos.tipo}`);
      vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('salen todos los tipos, los tres niveles por idea y los errores de la teoría', () => {
  const tipos = new Set(), niveles = {}, ids = new Set();
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    (niveles[d.idea] = niveles[d.idea] || new Set()).add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['etiqueta/bolsitas', 'etiqueta/cajas', 'mal-escrito', 'menor-base/uno', 'menor-base/tres', 'sucesor/sigue', 'sucesor/llegan',
    'valor', 'ordenar/mayor', 'mayor-k', 'cruzados/suma', 'cruzados/resta', 'de-10', 'entre-bases', 'suma-cifras', 'paquetes',
    'lineal', 'cuadratica', 'otra-etiqueta', 'acotar/suma', 'acotar/cuantos', 'mayor-suma', 'cifras', 'hasta', 'cuantos-k', 'cifras-base', 'bases-tres'])
    assert.ok(tipos.has(t), `no sale ${t}`);
  for (const idea of IDEAS) assert.deepEqual([...niveles[idea]].sort(), [1, 2, 3], `${idea}: niveles ${[...niveles[idea]]}`);
  for (const id of ['AT-CIFRA-B', 'AT-ORDEN', 'AT-DECIMAL', 'AT-LLEVA-UNA', 'AT-PIERDE', 'AT-CERO', 'AT-SIN-BASE', 'AT-CIFRA-MAYOR', 'AT-UNO-SOLO',
    'AT-MENOR', 'AT-LARGO', 'AT-CERO-LUGAR', 'AT-SUMA', 'AT-BASE-MAYOR', 'AT-PRIMERA', 'AT-PRODUCTO', 'AT-SIN-UNIDADES', 'AT-COCIENTE',
    'AT-CONTEO', 'AT-COPIA', 'AT-UNO-POR-TAMAÑO', 'AT-SIGNO', 'AT-SIN-SUELTOS', 'AT-PIDE-BASE', 'AT-INVIERTE', 'AT-BLOQUE', 'AT-SIN-DOS',
    'AT-UNA-COTA', 'AT-EXPONENTE'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

// Los códigos son los de la teoría de la unidad, salvo tres nuevos (hipótesis, en la cabecera del generador).
test('cada error usa un código de la teoría (o uno de los tres nuevos) y es hipótesis', () => {
  const fs = require('node:fs');
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/aritmetica/numeracion.js'), 'utf8');
  const deLaTeoria = new Set(teoria.match(/AT-[A-ZÑ-]+[A-ZÑ]/g));
  const NUEVOS = ['AT-RAIZ', 'AT-SIGUIENTE', 'AT-SIN-CERO'];
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    assert.ok(deLaTeoria.has(a.error.id) || NUEVOS.includes(a.error.id), `semilla ${s}: ${a.error.id} no es de la teoría`);
    assert.equal(a.error.respaldo, 'hipotesis');
  }
});

test('cada explicación empieza por lo que el alumno hizo bien y muestra lo que da su error', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      const valor = typeof a.valor === 'number' ? formatear(a.valor, 0) : a.texto;
      assert.ok(e.includes(valor), `semilla ${s}: «${e}» no muestra ${valor}`);
    }
  }
});

// Un color fijo por magnitud, el de la teoría (cabecera de numeracion.js): la cantidad en base 10 violeta, la base
// turquesa, las cifras naranja y la segunda base verde (solo al pasar entre dos bases). Sin carmín.
test('un color por magnitud: N violeta, n turquesa, cifras naranja, segunda base verde; sin carmín', () => {
  const COLOR = { N: 'f', n: 'i', c: 'o', m: 'd' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    if (V.m) assert.equal(p._datos.tipo, 'entre-bases', `semilla ${s}: verde fuera de entre-bases`);
    // La base de un numeral (₍₆₎) va siempre en el color de la base (o de la segunda base).
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea)
      if (x && typeof x === 'object' && /^₍/.test(x.t)) assert.ok(x.v === 'n' || x.v === 'm', `semilla ${s}: base en ${x.v}`);
  }
});

test('notación: 342₍₆₎ sin raya; con letras, raya sobre cada carácter (a̅b̅₍ₙ₎)', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) assert.ok(!a.texto.includes('̅'), `semilla ${s}: ${a.texto} con raya`);
    for (const linea of [p.enunciado, p.pregunta]) for (const x of linea) {
      if (!x || typeof x !== 'object' || x.v !== 'c') continue;
      const letras = /[a-z]/.test(x.t.replace(/̅/g, '')) && !/\s/.test(x.t);
      if (letras && (linea[linea.indexOf(x) + 1] || {}).v) {
        // numeral con letras seguido de su base: cada carácter lleva raya
        assert.ok([...x.t].every((c, i, l) => c === '̅' || l[i + 1] === '̅'), `semilla ${s}: «${x.t}» sin raya completa`);
      }
    }
    const todo = [p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' ');
    assert.ok(!/\(\d+\)[₀-₉]/.test(todo), `semilla ${s}: notación vieja (132)₄`);
    assert.ok(!/\d\.\d|\bde el\b|\ba el\b|1 bolsitas|1 cajas|1 sueltos/.test(todo), `semilla ${s}: ${todo}`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo (la descomposición, la división con resto o «del primero, p, al último, u»).
test('datos: una lista de líneas cortas, sin la respuesta y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const FORMULA = {
    etiqueta: /^1 bolsita = \d caramelos/, 'mal-escrito': /n − 1/, 'menor-base': /n − 1/, sucesor: /^1 bolsita = /,
    valor: /a̅b̅c̅(d̅)?₍ₙ₎ = a × n/, ordenar: /a̅b̅c̅₍ₙ₎ = a × n²/, 'mayor-k': /a̅b̅(c̅)?(d̅)?₍ₙ₎ = a × n/, cruzados: /a̅b̅₍ₙ₎ = a × n \+ b/,
    'de-10': /D = q × \d \+ r/, 'entre-bases': /D = q × \d \+ r/, 'suma-cifras': /D = q × \d \+ r/, paquetes: /D = q × \d \+ r/,
    lineal: /a̅b̅₍ₙ₎ = a × n \+ b/, cuadratica: /a̅b̅c̅₍ₙ₎ = a × n²/, 'otra-etiqueta': /a̅b̅₍ₙ₎ = a × n \+ b/, 'mayor-suma': /₍ₙ₎ = a × n/,
    cifras: /u − p \+ 1/, hasta: /u − p \+ 1/, 'cuantos-k': /u − p \+ 1/, 'cifras-base': /u − p \+ 1/, 'bases-tres': /n² a n³ − 1/,
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|^Dato:|_/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    const f = FORMULA[d.tipo] || (d.sub === 'suma' ? /a̅b̅₍ₙ₎ = a × n \+ b/ : /u − p \+ 1/);
    assert.match(todo, f, `semilla ${s} (${d.tipo}): falta su fórmula`);
    // La respuesta no está en los datos: ni su numeral ni su número.
    // (Un número de una cifra puede ser la base que da el enunciado: solo se revisan los de dos o más cifras.)
    const c = p.alternativas.find(a => a.correcta).texto, num = (c.match(/\d+(?: \d{3})*/) || [''])[0];
    if (num.length > 1) assert.ok(!new RegExp(`(?<![\\d])${num}(?![\\d])`).test(todo), `semilla ${s}: los datos traen ${num} (${c})`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x']) gen.generar(s, { unidad: 'aritmetica.numeracion' });
});

test('papel.json: 8 problemas de las cinco ideas, con sus datos y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.ok(pr.enunciado.includes('Datos:'), pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    const r = recalcular(p);
    assert.ok(pr.respuesta.includes(typeof r === 'number' ? formatear(r, 0) : r), `${pr.id}: ${pr.respuesta} no es ${r}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
});

// Auditoría de la unidad (M6): la letra a es una cifra en toda la unidad, también en «¿Cuántos valores puede tomar a?».
// Los extremos de un bloque se llaman p (el primero) y u (el último), nunca a y z.
test('la letra a es siempre una cifra: los datos y las explicaciones no la usan como extremo de un bloque', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const todo = [p.datos.join('\n'), JSON.stringify(p.solucion), p.alternativas.map(a => a.explicacion || '').join('\n')].join('\n');
    assert.ok(!/z − a|de a hasta|hasta z\b/i.test(todo), `semilla ${s}: a como extremo`);
  }
});
