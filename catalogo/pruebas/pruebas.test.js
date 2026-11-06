// Banco de pruebas de entrada y salida por curso (catalogo/pruebas/<curso>.json).
// Comprueba el formato, que las formas A y B sean paralelas y, sobre todo, que cada respuesta y
// cada distractor salgan del motor de su plantilla (catalogo/pruebas/verificar.js): ningún ítem
// puede tener la respuesta mal (reglas 1 y 2 de CLAUDE.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Pruebas = require('../../nucleo/pruebas.js');
const { verificadores } = require('./verificar.js');
const { textoPruebas, SALIDA_PRUEBAS, construirPruebas } = require('../../herramientas/construir-catalogo.js');
const Parecidos = require('./parecidos.js');

const raiz = path.join(__dirname, '..', '..');
const leer = p => JSON.parse(fs.readFileSync(path.join(raiz, p), 'utf8'));
const bancos = fs.readdirSync(__dirname).filter(f => f.endsWith('.json')).sort().map(f => ({ archivo: f, ...leer(`catalogo/pruebas/${f}`) }));
const cursos = Object.fromEntries(fs.readdirSync(path.join(raiz, 'catalogo/cursos')).filter(f => f.endsWith('.json')).map(f => { const c = leer(`catalogo/cursos/${f}`); return [c.id, c]; }));
const plantillasDe = c => [...new Set(c.unidades.flatMap(u => u.plantillas))];

// Número que el alumno lee en el texto de una opción: "1,4 M", "12 000 W", "−6,7 °C", "2π cm", "π/2", "1/61".
function leerNumero(texto) {
  const t = texto.replace(/−/g, '-');
  const pi = t.match(/(-?\d+(?:,\d+)?)?π(?:\/(\d+))?/);
  if (pi) return { v: (pi[1] === undefined ? 1 : Number(pi[1].replace(',', '.'))) * Math.PI / (pi[2] ? Number(pi[2]) : 1), tol: 1e-3, rel: true };
  const rz = t.match(/(-?)√(\d+)(?:\/(\d+))?/);
  if (rz) return { v: (rz[1] ? -1 : 1) * Math.sqrt(Number(rz[2])) / (rz[3] ? Number(rz[3]) : 1), tol: 1e-3, rel: true };
  const fr = t.match(/(-?\d+)\/(\d+)/);
  if (fr) return { v: Number(fr[1]) / Number(fr[2]), tol: 1e-3, rel: true };
  const n = t.match(/-?\d+(?: \d{3})*(?:,(\d+))?/);
  if (!n) return null;
  const dec = n[1] ? n[1].length : 0;
  return { v: Number(n[0].replace(/ /g, '').replace(',', '.')), tol: 0.5 * 10 ** -dec + 1e-9, rel: false };
}
const cerca = (a, b) => Math.abs(a - b) <= 1e-3 * Math.abs(b) + 1e-6;
const fmt = x => String(Math.round(Math.abs(x) * 1e6) / 1e6).replace('.', ',');

// Un curso o una plantilla nuevos no rompen las pruebas: avisan (diagnóstico) que el banco tiene que crecer.
test('hay banco para cada curso que ya tiene plantillas (aviso)', t => {
  const conBanco = new Set(bancos.map(b => b.curso));
  for (const c of Object.values(cursos)) if (plantillasDe(c).length && !conBanco.has(c.id)) t.diagnostic(`${c.id} tiene plantillas pero todavía no tiene catalogo/pruebas/${c.id}.json`);
  assert.ok(bancos.length > 0);
});

for (const b of bancos) {
  test(`${b.curso}: formato y formas paralelas`, () => {
    assert.equal(`${b.curso}.json`, b.archivo, 'el nombre del archivo debe ser el id del curso');
    assert.ok(cursos[b.curso], `el curso ${b.curso} no está en catalogo/cursos/`);
    assert.deepEqual(Pruebas.validar(b), []);
    for (const f of Pruebas.FORMAS) assert.equal(Pruebas.items(b, f).length, b.pares.length);
    for (const inf of b.informes || []) assert.ok(fs.existsSync(path.join(raiz, inf)), `no existe el informe ${inf}`);
  });

  test(`${b.curso}: cada ítem es de una plantilla del curso (y aviso si falta alguna)`, t => {
    const c = cursos[b.curso], pls = plantillasDe(c), unidades = new Map(c.unidades.map(u => [u.id, u]));
    const porPlantilla = {};
    for (const p of b.pares) {
      assert.ok(pls.includes(p.plantilla), `${p.par}: la plantilla ${p.plantilla} no está en ninguna unidad de ${c.id}`);
      const ficha = leer(`plantillas/${p.plantilla}/plantilla.json`);
      assert.ok(ficha.unidades.includes(p.unidad), `${p.par}: ${p.plantilla} no cubre la unidad ${p.unidad}`);
      assert.ok(unidades.has(p.unidad) && unidades.get(p.unidad).plantillas.includes(p.plantilla), `${p.par}: la unidad ${p.unidad} no cita a ${p.plantilla}`);
      porPlantilla[p.plantilla] = (porPlantilla[p.plantilla] || 0) + 1;
    }
    for (const pl of pls) if (!porPlantilla[pl]) t.diagnostic(`${c.id}: la plantilla ${pl} todavía no tiene ítems en el banco`);
    // Con varias plantillas, una o dos por plantilla; con pocas, se reparten los 8 a 10 ítems entre ellas.
    if (pls.length >= 4) for (const [pl, n] of Object.entries(porPlantilla)) assert.ok(n <= 2, `${c.id}: ${pl} tiene ${n} ítems (máximo 2)`);
  });

  test(`${b.curso}: las respuestas y los distractores salen del motor (también la reserva)`, () => {
    for (const p of [...b.pares, ...(b.reserva || [])]) {
      const v = verificadores[p.par];
      assert.ok(v, `${p.par}: falta su verificador en catalogo/pruebas/verificar.js`);
      for (const f of Pruebas.FORMAS) {
        const it = p[f], id = p.par + f;
        const { modelo, ...vistos } = it.datos || {};
        // Los números de los datos son los del enunciado (así nadie cambia uno sin el otro).
        for (const [k, x] of Object.entries(vistos)) if (typeof x === 'number') assert.ok(it.enunciado.includes(fmt(x)), `${id}: el dato ${k} = ${x} no aparece en el enunciado`);
        const r = v({ ...vistos, ...(modelo || {}) });
        const ok = it.opciones.find(o => o.correcta);
        const comparar = (o, esperado, que) => {
          if (typeof esperado === 'number') {
            assert.ok(typeof o.valor === 'number', `${id}: la opción «${o.texto}» necesita "valor"`);
            assert.ok(cerca(o.valor, esperado), `${id}: ${que} «${o.texto}» vale ${o.valor} y el motor da ${esperado}`);
          } else assert.equal(o.clave ?? o.texto, esperado, `${id}: ${que} «${o.texto}» no es la que da el motor`);
        };
        comparar(ok, r.correcta, 'la correcta');
        for (const o of it.opciones) {
          if (typeof o.valor === 'number') {
            const n = leerNumero(o.texto);
            if (n) assert.ok(n.rel ? cerca(n.v, o.valor) : Math.abs(n.v - o.valor) <= n.tol, `${id}: el texto «${o.texto}» no muestra el valor ${o.valor}`);
          }
          if (o.correcta) continue;
          const tieneValor = typeof o.valor === 'number' || o.clave !== undefined;
          if (tieneValor) {
            assert.ok(o.error in r.errores, `${id}: el verificador no calcula el distractor ${o.error}`);
            comparar(o, r.errores[o.error], `el distractor ${o.error}`);
          }
          // Ningún distractor puede ser también correcto.
          if (typeof r.correcta === 'number' && typeof o.valor === 'number') assert.ok(!cerca(o.valor, r.correcta), `${id}: el distractor «${o.texto}» coincide con la respuesta`);
          if (typeof r.correcta === 'string') assert.notEqual(o.clave ?? o.texto, r.correcta, `${id}: el distractor «${o.texto}» coincide con la respuesta`);
        }
        const vals = it.opciones.filter(o => typeof o.valor === 'number').map(o => o.valor);
        for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) assert.ok(!cerca(vals[i], vals[j]), `${id}: dos opciones valen lo mismo (${vals[i]})`);
      }
      assert.notEqual(p.A.enunciado, p.B.enunciado, `${p.par}: A y B tienen el mismo enunciado`);
    }
  });
}

for (const b of bancos) {
  test(`${b.curso}: la reserva es de plantillas que existen y cubren su unidad`, t => {
    for (const p of b.reserva || []) {
      assert.ok(fs.existsSync(path.join(raiz, 'plantillas', p.plantilla, 'plantilla.json')), `${p.par}: no existe la plantilla ${p.plantilla}`);
      assert.ok(leer(`plantillas/${p.plantilla}/plantilla.json`).unidades.includes(p.unidad), `${p.par}: ${p.plantilla} no cubre ${p.unidad}`);
      if (plantillasDe(cursos[b.curso]).includes(p.plantilla)) t.diagnostic(`${p.par}: ${p.plantilla} ya está en el catálogo; pasa el par de "reserva" a "pares"`);
    }
  });

  test(`${b.curso}: ningún ítem repite una predicción de su escena o un problema de su generador`, () => {
    const h = Parecidos.revisar([b]);
    assert.deepEqual(h.map(x => `${x.item} ~ ${x.plantilla}: ${x.motivo} | ${x.texto.slice(0, 120)}`), []);
  });

  test(`${b.curso}: la respuesta no es un número que ya está en el enunciado, y los atajos son iguales en A y B`, () => {
    for (const p of b.pares) {
      const firma = {};
      for (const f of Pruebas.FORMAS) {
        const it = p[f], id = p.par + f, nums = new Set((it.enunciado.replace(/−/g, '-').match(/\d+(?:,\d+)?/g) || []).map(x => x.replace(',', '.')));
        const enEnunciado = o => { const n = leerNumero(o.texto); return n && !n.rel && nums.has(String(n.v)); };
        const ok = it.opciones.find(o => o.correcta);
        if (typeof ok.valor === 'number' && ok.valor !== 0) assert.ok(!enEnunciado(ok), `${id}: la respuesta «${ok.texto}» ya está escrita en el enunciado`);
        // Un "atajo" (copiar un número del enunciado) debe caer en el mismo lugar en las dos formas.
        firma[f] = it.opciones.filter(o => typeof o.valor === 'number' && enEnunciado(o)).map(o => (o.correcta ? 'correcta' : o.error)).sort().join(',');
      }
      assert.equal(firma.A, firma.B, `${p.par}: copiar un número del enunciado da ${firma.A || 'nada'} en A y ${firma.B || 'nada'} en B`);
    }
  });

  test(`${b.curso}: forma de las opciones (largo) y lugar de la correcta entre los valores`, () => {
    let corta = 0, larga = 0, textuales = 0, menor = 0, mayor = 0, numericos = 0;
    for (const p of b.pares) for (const f of Pruebas.FORMAS) {
      const op = p[f].opciones, id = p.par + f, c = op.findIndex(o => o.correcta);
      const L = op.map(o => o.texto.length), otros = L.filter((_, i) => i !== c);
      // Ninguna opción correcta mucho más larga o mucho más corta que todas las demás.
      assert.ok(L[c] <= 1.6 * Math.max(...otros) + 4, `${id}: la correcta es mucho más larga que las demás`);
      assert.ok(L[c] >= 0.5 * Math.min(...otros) - 4, `${id}: la correcta es mucho más corta que las demás`);
      if (op.every(o => typeof o.valor === 'number')) {
        numericos++;
        const v = op.map(o => o.valor), ord = [...v].sort((a, x) => a - x);
        if (v[c] === ord[0]) menor++; if (v[c] === ord[ord.length - 1]) mayor++;
      } else {
        textuales++;
        if (L[c] < Math.min(...otros)) corta++; if (L[c] > Math.max(...otros)) larga++;
      }
    }
    // En el banco, la correcta no puede ser casi siempre la más corta, la más larga, la menor o la mayor.
    if (textuales >= 6) {
      assert.ok(corta / textuales <= 0.4, `${b.curso}: la correcta es la más corta en ${corta} de ${textuales} ítems de texto`);
      assert.ok(larga / textuales <= 0.4, `${b.curso}: la correcta es la más larga en ${larga} de ${textuales} ítems de texto`);
    }
    if (numericos >= 6) {
      assert.ok(menor / numericos <= 0.4, `${b.curso}: la correcta es el menor valor en ${menor} de ${numericos} ítems`);
      assert.ok(mayor / numericos <= 0.4, `${b.curso}: la correcta es el mayor valor en ${mayor} de ${numericos} ítems`);
    }
  });
}

test('aritmética marca qué pares miden transferencia (ideas que el módulo no practica)', () => {
  const b = bancos.find(x => x.curso === 'aritmetica');
  const tr = b.pares.filter(p => p.transferencia === true).map(p => p.par);
  assert.ok(tr.length >= 1 && tr.length < b.pares.length, `transferencia: ${tr.join(', ')}`);
});

test('app/datos/pruebas.json no trae la correcta ni los errores en texto plano, y se recuperan igual', () => {
  const app = construirPruebas();
  const texto = JSON.stringify(app);
  assert.ok(!/"correcta"|"error"|"valor"|"clave"|"datos"|"reserva"/.test(texto), 'el banco de la app trae campos que no debe');
  for (const b of bancos) for (const f of Pruebas.FORMAS) {
    const fuente = Pruebas.items(b, f), deApp = Pruebas.items(app.cursos[b.curso], f);
    assert.deepEqual(deApp.map(i => i.opciones), fuente.map(i => i.opciones.map(o => (o.correcta ? { texto: o.texto, correcta: true } : { texto: o.texto, error: o.error }))));
  }
  const k = Pruebas.ocultar('x-01A', [{ texto: 'a', error: 'E1' }, { texto: 'b', correcta: true }]);
  assert.deepEqual(Pruebas.revelar('x-01A', k), { c: 1, errores: ['E1', ''] });
  assert.notDeepEqual(Pruebas.ocultar('x-01B', [{ texto: 'a', error: 'E1' }, { texto: 'b', correcta: true }]), k);
});

test('el orden A→B o B→A se reparte cerca de la mitad y no cambia para un mismo alumno', () => {
  let ab = 0; const N = 2000;
  for (let k = 0; k < N; k++) if (Pruebas.orden('a' + k.toString(16).padStart(10, '0'), 'fisica') === 'AB') ab++;
  assert.ok(ab > N * 0.45 && ab < N * 0.55, `AB salió ${ab} de ${N}`);
  assert.equal(Pruebas.orden('a123', 'quimica'), Pruebas.orden('a123', 'quimica'));
  assert.equal(Pruebas.formaDe('AB', 'entrada'), 'A'); assert.equal(Pruebas.formaDe('AB', 'salida'), 'B');
  assert.equal(Pruebas.formaDe('BA', 'entrada'), 'B'); assert.equal(Pruebas.formaDe('BA', 'salida'), 'A');
});

test('presentar baraja las opciones siempre igual para el mismo alumno y conserva la correcta', () => {
  const [it] = Pruebas.items(bancos[0], 'A');
  const a = Pruebas.presentar(it, 'a1'), b = Pruebas.presentar(it, 'a1');
  assert.deepEqual(a.map(o => o.indice), b.map(o => o.indice));
  assert.deepEqual(a.map(o => o.letra), Pruebas.LETRAS.slice(0, it.opciones.length));
  assert.equal(a.filter(o => o.correcta).length, 1);
  const elegida = a.find(o => !o.correcta);
  assert.deepEqual(Pruebas.corregir(elegida), { opcion: elegida.letra, correcta: false, error: elegida.error });
});

test('validar avisa si las formas no son paralelas', () => {
  const b = JSON.parse(JSON.stringify(bancos[0]));
  b.pares[0].B.opciones = b.pares[0].B.opciones.slice(0, 3).concat([{ texto: 'otra', error: 'inventado' }]);
  const mal = Pruebas.validar(b);
  assert.ok(mal.some(x => /no miden los mismos errores/.test(x)), mal.join('\n'));
  assert.ok(mal.some(x => /no está en el diccionario/.test(x)), mal.join('\n'));
});

test('app/datos/pruebas.json está al día con catalogo/pruebas/ (si falla: npm run catalogo)', () => {
  assert.equal(fs.readFileSync(SALIDA_PRUEBAS, 'utf8'), textoPruebas());
});
