// Pruebas del generador «funciones-dominio-rango»: casos.json (verificados aparte, a ciegas), un
// recálculo independiente en cada uno de 600 problemas y pruebas de propiedades. El recálculo no
// usa las fórmulas del generador: los dominios se comprueban evaluando la función punto por punto,
// los rangos y extremos muestreando, las áreas integrando numéricamente, las cifras con BigInt y la
// clasificación de funciones armando cada función como tabla y revisándola por fuerza bruta.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Conjuntos: se lee la clave «set:[a,b)U(c,Infinity)» y se pregunta si x está ----------
function leerConjunto(clave) {
  assert.ok(clave.startsWith('set:'), clave);
  const cuerpo = clave.slice(4);
  if (!cuerpo) return [];
  return cuerpo.split('U').map(t => {
    const m = /^([\[(])(-?(?:\d+(?:\.\d+)?|Infinity)),(-?(?:\d+(?:\.\d+)?|Infinity))([\])])$/.exec(t);
    assert.ok(m, `pieza ilegible: ${t}`);
    return { lo: Number(m[2]), hi: Number(m[3]), cl: m[1] === '[', cr: m[4] === ']' };
  });
}
const esta = (S, x) => S.some(p => (x > p.lo || (x === p.lo && p.cl)) && (x < p.hi || (x === p.hi && p.cr)));
const MUESTRA = [];
for (let i = -160; i <= 240; i++) MUESTRA.push(i / 4);
MUESTRA.push(-1e4, -500, 500, 1e4);
// El conjunto de la clave coincide con «definida(x)» en toda la muestra.
function mismoConjunto(clave, definida) {
  const S = leerConjunto(clave);
  for (const x of MUESTRA) if (esta(S, x) !== !!definida(x)) return `x = ${x}: clave ${esta(S, x)}, función ${!!definida(x)}`;
  return null;
}
const EPS = 1e-12;

function recalcular(p) {
  const d = p._datos, r = p.respuesta.valor;
  const ok = falla => (falla ? `falla: ${falla}` : r);
  switch (d.tipo) {
    case 'composicion': {
      // Hora por hora: se suman a chompas (o kilos) por cada hora y luego p soles por cada una.
      const ganancia = h => { let c = d.b; for (let i = 0; i < h; i++) c += d.a; let g = -d.F; for (let i = 0; i < c; i++) g += d.p; return g; };
      if (d.sub === 'evaluar') return ganancia(d.h0);
      for (let h = 0; h <= 40; h++) if (ganancia(h) === d.G) return h;
      return 'sin solución';
    }
    case 'area-entero-abs': {
      const a = -d.m, b = d.sub === 'total' ? d.n : 0, N = 200000, dx = (b - a) / N;
      let s = 0;
      for (let i = 0; i < N; i++) { const x = a + (i + 0.5) * dx; s += (Math.abs(x) - Math.floor(x)) * dx; }
      return Math.abs(s - r) < 1e-6 ? r : s;
    }
    case 'costo-recipiente': {
      const caras = x => {
        const V = d.k * d.x * d.x * d.h, largo = d.k * x, alto = V / (x * largo);
        const base = [x * largo], paredes = [x * alto, x * alto, largo * alto, largo * alto];
        return d.a * base.reduce((s, t) => s + t, 0) + d.b * paredes.reduce((s, t) => s + t, 0);
      };
      if (d.sub === 'evaluar') return caras(d.x);
      const [, A, B] = r.split(':').map(Number);
      for (const x of [0.5, 1, 2, 3, 7]) if (Math.abs(A * x * x + B / x - caras(x)) > 1e-7) return `C(${x}) no coincide`;
      return r;
    }
    case 'rango-exp-abs': {
      const B = d.base === '1/2' ? 0.5 : Number(d.base), f = x => B ** Math.abs(x - d.a) + d.c;
      if (d.sub === 'sobre') {
        let mn = Infinity, mx = -Infinity;
        for (let i = 0; i <= 10000; i++) { const y = f(d.p + (d.q - d.p) * i / 10000); mn = Math.min(mn, y); mx = Math.max(mx, y); }
        for (let x = d.p; x <= d.q; x++) { mn = Math.min(mn, f(x)); mx = Math.max(mx, f(x)); }
        const s = mn + mx; return Math.abs(s - r) < 1e-9 ? r : s;
      }
      // Rango: y está si alguna x de una muestra fina da f(x) = y (a menos de un paso), y no se
      // llega a valores por debajo del ínfimo. Se comprueba sobre una muestra de y.
      const xs = []; for (let i = -4000; i <= 4000; i++) xs.push(d.a + i / 100);
      const ys = xs.map(f), mn = Math.min(...ys), mx = Math.max(...ys);
      const S = leerConjunto(r);
      for (let y = d.c - 3; y <= d.c + 6; y += 0.125) {
        const alcanzado = y >= mn - EPS && y <= mx + EPS && (y > d.c + 1e-6);
        if (esta(S, y) !== alcanzado) return `y = ${y}`;
      }
      return r;
    }
    case 'dominio-radicales': {
      if (d.sub === 'anidado') {
        const def = x => x - d.a >= 0 && (d.dentro ? d.c - Math.sqrt(x - d.a) : Math.sqrt(x - d.a) - d.c) >= -EPS;
        return ok(mismoConjunto(r, def));
      }
      const k = d.r * (d.r - 1);
      const def = x => x - d.s + k >= 0 && (x - d.s) - Math.sqrt(x - d.s + k) >= -EPS;
      return ok(mismoConjunto(r, def));
    }
    case 'racional-simplificable': {
      const q = x => (x * x - (d.a + d.b) * x + d.a * d.b) / (x - d.a);
      const def = x => x !== d.a && q(x) >= -EPS;
      if (d.sub === 'dominio') return ok(mismoConjunto(r, def));
      // y está en el rango si hay una x del dominio con √q(x) = y; se busca en una malla fina.
      const S = leerConjunto(r);
      for (let y = -1; y <= 8; y += 0.25) {
        let hay = false;
        for (let x = d.b; x <= d.b + 80 && !hay; x += 0.0625) if (def(x) && Math.abs(Math.sqrt(Math.max(0, q(x))) - y) < 1e-9) hay = true;
        if (esta(S, y) !== hay) return `y = ${y}`;
      }
      return r;
    }
    case 'inyectiva-restringir': {
      if (d.sub === 'raiz') {
        const c = d.r * d.r - d.h * d.h, inside = x => -x * x + 2 * d.h * x + c;
        const f = x => (inside(x) >= -EPS ? Math.sqrt(Math.max(0, inside(x))) : NaN);
        const [I] = leerConjunto(r);
        if (!(I.cl && I.cr && I.lo <= d.q && d.q <= I.hi)) return 'no contiene a q';
        const malla = (lo, hi) => { const l = []; for (let i = 0; i <= 400; i++) l.push(lo + (hi - lo) * i / 400); return l; };
        const iny = (lo, hi) => { const ys = malla(lo, hi).map(f); if (ys.some(Number.isNaN)) return false; const s = Math.sign(ys[1] - ys[0]); return ys.every((y, i) => i === 0 || Math.sign(y - ys[i - 1]) === s); };
        if (!iny(I.lo, I.hi)) return 'no es inyectiva en el intervalo';
        if (iny(I.lo - 0.05, I.hi) || iny(I.lo, I.hi + 0.05)) return 'se puede agrandar';
        return r;
      }
      const g = x => (x - d.u) * (x - d.w);
      const mono = (lo, hi) => { const ys = []; for (let i = 0; i <= 200; i++) ys.push(g(lo + (hi - lo) * i / 200)); const s = Math.sign(ys[1] - ys[0]); return ys.every((y, i) => i === 0 || Math.sign(y - ys[i - 1]) === s); };
      if (d.sentido === 'der') { for (let a = -20; a <= 20; a += 0.5) if (mono(a, a + 30)) return a; }
      else { for (let a = 20; a >= -20; a -= 0.5) if (mono(a - 30, a)) return a; }
      return 'sin a';
    }
    case 'clasificar-verbal': {
      const tabla = t => {
        if (t.s === 'combi') return { dom: [...Array(t.n).keys()], lleg: [...Array(t.m).keys()], f: i => i };
        if (t.s === 'cumple') return { dom: [...Array(t.n).keys()], lleg: [...Array(12).keys()], f: i => (t.todos ? i % 12 : 2 + (i % 3)) };
        if (t.s === 'cuadrado') { const dom = []; for (let x = -t.k; x <= t.k; x++) dom.push(x); const lleg = t.exacta ? [...new Set(dom.map(x => x * x))] : [...Array(t.k * t.k + 1).keys()]; return { dom, lleg, f: x => x * x }; }
        if (t.s === 'doble') { const dom = []; for (let x = 1; x <= t.n; x++) dom.push(x); const lleg = t.exacta ? dom.map(x => 2 * x) : [...Array(2 * t.n).keys()].map(i => i + 1); return { dom, lleg, f: x => 2 * x }; }
        const dom = [...Array(2 * t.k).keys()].map(i => i + 1); return { dom, lleg: [...Array(t.k).keys()].map(i => i + 1), f: pg => Math.ceil(pg / 2) };
      };
      const vfs = d.sits.map(t => {
        const { dom, lleg, f } = tabla(t), im = dom.map(f);
        assert.ok(im.every(y => lleg.includes(y)), 'la imagen se sale de la llegada');
        let iny = true; for (let i = 0; i < im.length; i++) for (let j = i + 1; j < im.length; j++) if (im[i] === im[j]) iny = false;
        const sob = lleg.every(y => im.includes(y));
        const v = t.prop === 'inyectiva' ? iny : t.prop === 'sobreyectiva' ? sob : iny && sob;
        return v ? 'V' : 'F';
      });
      return 'vf:' + vfs.join('');
    }
    case 'monotonia-vf': {
      const g = x => (x - d.u) * (x - d.w);
      const ys = []; for (let i = 0; i <= 8 * (d.q - d.p); i++) ys.push(g(d.p + i / 8));
      const V1 = new Set(ys.map(y => y.toFixed(9))).size === ys.length;
      // II: el valor afirmado (1 o d) se excluye del rango si ninguna x ≠ d da r(x) = ese valor.
      const rr = x => (x + d.e) / (x - d.d), k = d.rangoUno ? 1 : d.d;
      // y se alcanza si r(x) − y cambia de signo (o vale 0) entre dos muestras de una misma rama.
      const alcanza = y => { let prev = null; for (let x = -400; x <= 400; x += 0.01) { if (Math.abs(x - d.d) < 0.005) { prev = null; continue; } const z = rr(x) - y; if (z === 0 || (prev !== null && Math.sign(z) !== Math.sign(prev))) return true; prev = z; } return false; };
      let V2 = !alcanza(k);
      for (let y = -6; y <= 6 && V2; y += 0.5) if (y !== k && !alcanza(y)) V2 = false;
      const t = x => 2 ** (d.k - x) + d.m, ts = []; for (let i = 0; i <= 100; i++) ts.push(t(d.p3 + (d.q3 - d.p3) * i / 100));
      const crece = ts.every((y, i) => i === 0 || y > ts[i - 1]), decrece = ts.every((y, i) => i === 0 || y < ts[i - 1]);
      const V3 = { crece, decrece, min: Math.min(...ts) === t(d.p3), max: Math.max(...ts) === t(d.p3) }[d.afirma];
      return 'vf:' + [V1, V2, V3].map(b => (b ? 'V' : 'F')).join('');
    }
    case 'log-entero': {
      if (d.sub === 'cifras') return String(BigInt(d.base) ** BigInt(d.n)).length;
      const ns = []; for (let n = d.L + 1; n < d.U; n++) if (/^10*$/.test(String(n))) ns.push(n);
      assert.equal(ns.length, 1, 'debe haber una sola cantidad posible');
      return ns[0] * (d.A - (String(ns[0]).length - 1));
    }
    case 'logistico': {
      const Pexacta = t => { const num = d.A * d.b ** t, den = d.c * d.b ** t + d.d; assert.equal(num % den, 0, 'P(t) no es entero'); return num / den; };
      if (d.sub === 'incremento') return Pexacta(d.t1) - Pexacta(0);
      const lejos = d.A / (d.c + d.d * d.b ** -80); return Math.round(lejos * 1e6) / 1e6;
    }
    case 'dominio-log': {
      const base = x => (d.sub === 'base-crece' ? x - d.a : d.c - x), arg = x => (d.sub === 'base-crece' ? d.c - x : x - d.a);
      const def = x => base(x) > 0 && base(x) !== 1 && arg(x) > 0 && Math.log(arg(x)) / Math.log(d.bi) > 0;
      return ok(mismoConjunto(r, def));
    }
    default: return 'tipo desconocido';
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-7) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const resp = typeof c.esperado.respuesta === 'number' ? p.respuesta.valor : p.respuesta.texto;
    if (typeof resp === 'number') assert.ok(Math.abs(resp - c.esperado.respuesta) <= casos.tolerancia, `da ${resp}`);
    else assert.equal(resp, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const forma = t => (/^[\[⟨ℝ∅]/.test(t) ? 'conjunto' : /^[VF]{3}$/.test(t) ? 'vf' : /^C\(x\) = /.test(t) ? 'formula' : /^−?\d{1,3}( \d{3})*(,\d+)?/.test(t) ? 'numero:' + t.replace(/^−?\d{1,3}( \d{3})*(,\d+)?/, '').replace(/^ cifra$/, ' cifras') : 'otra');

test('salen todos los tipos y subtipos; las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + (d.sub || ''));
    const formas = new Set(p.alternativas.map(a => forma(a.texto)));
    assert.equal(formas.size, 1, `semilla ${s}: formas mezcladas (${p.alternativas.map(a => a.texto)})`);
    assert.ok(!formas.has('otra'), `semilla ${s}: forma desconocida`);
  }
  assert.equal(vistos.size, 22, [...vistos].join(', '));
  assert.deepEqual(new Set([...vistos].map(k => k.split('/')[0])), new Set(gen.TIPOS));
});

test('ningún distractor da la correcta ni se repite, y cada uno tiene su id', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    const vals = p.alternativas.map(a => (typeof a.valor === 'number' ? a.valor.toFixed(6) : a.valor));
    assert.equal(new Set(vals).size, vals.length, `semilla ${s}: dos alternativas valen lo mismo`);
    if (p._datos.tipo.startsWith('dominio') || p._datos.tipo === 'racional-simplificable') {
      // Un distractor de dominio no puede coincidir con el dominio en la muestra.
      for (const a of p.alternativas.filter(a => !a.correcta)) {
        const S = leerConjunto(a.valor), C = leerConjunto(p.respuesta.valor);
        assert.ok(MUESTRA.some(x => esta(S, x) !== esta(C, x)), `semilla ${s}: ${a.texto} no se distingue de la correcta`);
      }
    }
  }
});

test('los textos están limpios: sin undefined, NaN, Infinity, −− ni guion ASCII delante de un número', () => {
  const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)];
    for (const t of textos) {
      assert.ok(!/undefined|NaN|Infinity|−−|− −|\+ −|\+ -/.test(t), `semilla ${s}: «${t}»`);
      assert.ok(!/(^|[\s(\[{;=,])-\d/.test(t), `semilla ${s}: guion ASCII en «${t}»`);
    }
    for (const parte of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof parte !== 'string') assert.ok(p.variables[parte.v], `semilla ${s}: color sin variable ${parte.v}`);
    for (const k of Object.keys(p.variables)) assert.ok(['o', 'i', 'd', 'h'].includes(p.variables[k].color));
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), d = p._datos, r = p.respuesta.valor;
    if (d.tipo === 'composicion') assert.ok(d.sub === 'despejar' ? r <= 8 : r < 2000, `semilla ${s}: ${r}`);
    if (d.tipo === 'costo-recipiente' && d.sub === 'evaluar') assert.ok(r > 0 && r < 20000, `semilla ${s}: ${r}`);
    if (d.tipo === 'logistico') { assert.ok(d.A / d.c <= 20000 && d.A / (d.c + d.d) >= 20, `semilla ${s}`); }
    if (d.tipo === 'log-entero' && d.sub === 'ingreso') assert.ok(r <= 200000, `semilla ${s}: ${r}`);
    if (d.tipo === 'rango-exp-abs' && d.sub === 'sobre') assert.ok(r < 100, `semilla ${s}: ${r}`);
  }
});

test('papel.json: entre 5 y 10 problemas completos, con la respuesta que da el código', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const q of papel.problemas) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(q[campo], `${q.id}: falta ${campo}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel), q.id);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2, q.id);
    assert.ok(!ids.has(q.id)); ids.add(q.id);
    const r = gen.resolver(q.datos);
    assert.ok(q.respuesta.startsWith(r.texto), `${q.id}: el código da «${r.texto}», papel dice «${q.respuesta}»`);
    // Y además se recalcula por el camino independiente de arriba.
    const indep = recalcular({ _datos: q.datos, respuesta: { valor: r.valor } });
    assert.ok(indep === r.valor || Math.abs(indep - r.valor) < 1e-7, `${q.id}: el recálculo independiente da ${indep}`);
  }
});
