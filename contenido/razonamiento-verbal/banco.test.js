// Valida el banco de textos de razonamiento verbal con las reglas de docs/formato-lectura.md (sección 5.5).
// Los códigos de error se leen del informe (docs/investigacion/razonamiento-verbal-ideas-erroneas.md)
// (codigos.json se genera de ahí con herramientas/codigos-verbal.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const aqui = __dirname;
const raiz = path.join(aqui, '..', '..');
const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));

const informe = fs.readFileSync(path.join(raiz, 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md'), 'utf8');
const CODIGOS = new Set([...informe.matchAll(/^\| (RV\d+) \|/gm)].map(m => m[1]));
const curso = leer(path.join(raiz, 'catalogo/cursos/razonamiento-verbal.json'));
const UNIDADES = new Set(curso.unidades.map(u => u.id));
const FRASES = leer(path.join(aqui, 'frases.json'));
const INDICE = leer(path.join(aqui, 'indice.json'));
const dirTextos = path.join(aqui, 'textos');
const TEXTOS = fs.readdirSync(dirTextos).filter(f => f.endsWith('.json')).sort()
  .map(f => ({ archivo: f, t: leer(path.join(dirTextos, f)) }));

const ROLES = ['principal', 'apoyo', 'detalle', 'ejemplo', 'general', 'contraste', 'cita'];
const TIPOS_TEXTO = ['expositivo', 'argumentativo', 'narrativo', 'descriptivo', 'discontinuo'];
const TIPOS_PREGUNTA = ['idea-principal', 'inferencia', 'compatibilidad', 'incompatibilidad', 'extrapolacion',
  'intencion', 'sentido-contextual', 'referente', 'conector'];
const CLASES = ['lo-dice', 'se-deduce', 'no-se-sabe', 'lo-contradice'];
const PROPOSITOS = ['explicar', 'convencer', 'narrar'];
// Sin \b al final: en JavaScript, \b toma las letras con tilde como separadores ("la década" daría falso positivo).
const LETRA = /(^|[^\p{L}])(la|alternativa|opción) [A-E](?![\p{L}\p{N}])/iu;
const ROL_CODIGO = { detalle: 'RV1', ejemplo: 'RV1', cita: 'RV1', general: 'RV2', apoyo: 'RV3', contraste: 'RV3' };

const oraciones = t => t.parrafos.flat();
const palabras = t => oraciones(t).reduce((n, o) => n + o.t.trim().split(/\s+/).length, 0);
const codigoValido = c => CODIGOS.has(c);
const usados = new Set();

// Código que recibe cada oración no aceptada en el previo de idea principal (sección 5.3).
function codigoMarcar(previo, t, o) {
  if (previo.codigos && o.id in previo.codigos) return previo.codigos[o.id];
  if (o.id === oraciones(t)[0].id) return 'RV4';
  return ROL_CODIGO[o.rol];
}

function validarPrevio(q, t, donde) {
  const p = q.previo;
  assert.ok(p.pide && p.explicacion, `${donde}: el previo necesita "pide" y "explicacion"`);
  const revisar = (mapa, claves) => {
    assert.deepEqual(Object.keys(mapa || {}).sort(), [...claves].sort(), `${donde}: el previo necesita un código para ${claves.join(', ')}`);
    for (const c of Object.values(mapa)) {
      assert.ok(c === null || codigoValido(c), `${donde}: el código ${c} del previo no está en el informe`);
      if (c) usados.add(c);
    }
  };
  const ids = new Set(oraciones(t).map(o => o.id));
  if (p.tipo === 'marcar-oracion') {
    assert.equal(q.tipo, 'idea-principal', `${donde}: en un texto, marcar-oracion es para idea principal`);
    const principales = oraciones(t).filter(o => o.rol === 'principal').map(o => o.id).sort();
    assert.deepEqual([...p.aceptadas].sort(), principales, `${donde}: "aceptadas" debe ser justo las oraciones de rol principal`);
    assert.ok(p.ninguna === 'correcta' || codigoValido(p.ninguna), `${donde}: "ninguna" debe ser "correcta" o un código`);
    if (p.ninguna !== 'correcta') usados.add(p.ninguna);
    for (const id of Object.keys(p.codigos || {})) assert.ok(ids.has(id), `${donde}: el código apunta a ${id}, que no existe`);
    for (const id of Object.keys(p.explicaciones || {})) assert.ok(ids.has(id) || id === 'ninguna', `${donde}: la explicación apunta a ${id}, que no existe`);
    for (const o of oraciones(t)) {
      if (p.aceptadas.includes(o.id)) continue;
      const c = codigoMarcar(p, t, o);
      assert.ok(codigoValido(c), `${donde}: la oración ${o.id} no recibe un código válido (${c})`);
      usados.add(c);
    }
  } else if (p.tipo === 'clasificar') {
    assert.ok(p.sonda && CLASES.includes(p.clase), `${donde}: clasificar necesita "sonda" y una "clase" válida`);
    revisar(p.codigos, CLASES.filter(c => c !== p.clase));
  } else if (p.tipo === 'relacion') {
    assert.equal(p.aceptada, 'oposicion', `${donde}: por ahora, el previo relacion solo se usa con la oposición`);
    revisar(p.codigos, ['suma', 'causa']);
  } else if (p.tipo === 'proposito') {
    assert.ok(PROPOSITOS.includes(p.aceptada), `${donde}: propósito "${p.aceptada}" no válido`);
    revisar(p.codigos, PROPOSITOS.filter(c => c !== p.aceptada));
  } else {
    assert.fail(`${donde}: tipo de previo "${p.tipo}" no válido en un texto`);
  }
  // Toda respuesta incorrecta del previo trae su explicación (pedido de la integración, 6 nov 2026).
  const incorrectas = p.tipo === 'marcar-oracion'
    ? [...oraciones(t).map(o => o.id).filter(id => !p.aceptadas.includes(id)), ...(p.ninguna && p.ninguna !== 'correcta' ? ['ninguna'] : [])]
    : Object.keys(p.codigos);
  for (const r of incorrectas) assert.ok(p.explicaciones && p.explicaciones[r], `${donde}: falta la explicación del previo para "${r}"`);
  for (const r of Object.keys(p.explicaciones || {})) assert.ok(incorrectas.includes(r), `${donde}: sobra la explicación del previo para "${r}"`);
}

test('el índice apunta a textos que existen y están aprobados (reglas 9 y 7)', () => {
  const ids = new Set(TEXTOS.map(x => x.t.id));
  for (const id of INDICE.textos) {
    assert.ok(ids.has(id), `indice.json: falta textos/${id}.json`);
    const t = TEXTOS.find(x => x.t.id === id).t;
    assert.equal(t.revision && t.revision.veredicto, 'aprobado', `${id}: está en el índice sin revisión aprobada`);
    assert.ok(t.preguntas.some(q => q.previo), `${id}: un texto de práctica necesita al menos un paso previo`);
  }
  assert.equal(new Set(INDICE.textos).size, INDICE.textos.length, 'indice.json: hay textos repetidos');
  for (const f of ['entrada', 'salida']) {
    if (INDICE[f] === null) continue; // todavía no se escriben (ver rutinas/verbal.md)
    assert.ok(ids.has(INDICE[f]), `indice.json: falta el texto de ${f}`);
    assert.ok(!TEXTOS.find(x => x.t.id === INDICE[f]).t.preguntas.some(q => q.previo), `${INDICE[f]}: la prueba de ${f} va sin paso previo`);
  }
});

test('la entrada y la salida son formas paralelas', () => {
  if (INDICE.entrada === null || INDICE.salida === null) return;
  const [a, b] = [INDICE.entrada, INDICE.salida].map(id => TEXTOS.find(x => x.t.id === id).t);
  assert.equal(a.preguntas.length, b.preguntas.length, 'entrada y salida: distinta cantidad de preguntas');
  assert.equal(a.dificultad, b.dificultad, 'entrada y salida: distinta dificultad');
  a.preguntas.forEach((qa, i) => {
    const qb = b.preguntas[i];
    assert.equal(qa.tipo, qb.tipo, `pregunta ${i + 1}: distinto tipo`);
    const cods = q => q.alternativas.filter(x => !x.correcta).map(x => x.codigo).sort().join();
    assert.equal(cods(qa), cods(qb), `pregunta ${i + 1}: distintos códigos RV en los distractores`);
  });
});

for (const { archivo, t } of TEXTOS) {
  test(`${archivo}: cumple el formato del banco`, () => {
    assert.equal(archivo, `${t.id}.json`, `${archivo}: el id debe coincidir con el nombre del archivo`);
    assert.match(t.id, /^t\d{3}[ab]?$/);
    assert.ok(Number.isInteger(t.version) && t.version >= 1, `${t.id}: versión inválida`);
    assert.ok(t.titulo && t.tema, `${t.id}: falta título o tema`);
    assert.ok([3, 4, 5].includes(t.grado), `${t.id}: grado debe ser 3, 4 o 5`);
    assert.ok([1, 2, 3].includes(t.dificultad), `${t.id}: dificultad debe ser 1, 2 o 3`);
    assert.ok(TIPOS_TEXTO.includes(t.tipo_texto), `${t.id}: tipo de texto inválido`);
    assert.equal(t.origen, 'propio', `${t.id}: el texto debe ser propio (regla 5)`);
    assert.ok(Array.isArray(t.hechos) && t.hechos.every(h => h.afirmacion && h.fuente), `${t.id}: cada hecho necesita afirmación y fuente`);
    // Regla 1: largo y cantidad.
    const n = palabras(t);
    assert.ok(n >= 150 && n <= 350, `${t.id}: tiene ${n} palabras (de 150 a 350)`);
    assert.ok(t.preguntas.length >= 3 && t.preguntas.length <= 5, `${t.id}: de 3 a 5 preguntas`);
    // Regla 5: oraciones con id único y rol válido.
    const ors = oraciones(t), ids = new Set(ors.map(o => o.id));
    assert.equal(ids.size, ors.length, `${t.id}: hay ids de oración repetidos`);
    for (const o of ors) assert.ok(ROLES.includes(o.rol) && o.t, `${t.id}.${o.id}: rol o texto inválido`);
    const idsP = new Set();
    for (const q of t.preguntas) {
      const donde = `${t.id}.${q.id}`;
      assert.ok(!idsP.has(q.id), `${donde}: id de pregunta repetido`); idsP.add(q.id);
      assert.ok(TIPOS_PREGUNTA.includes(q.tipo), `${donde}: tipo "${q.tipo}" no válido`);
      assert.ok(UNIDADES.has(q.unidad), `${donde}: la unidad ${q.unidad} no existe en el catálogo (regla 6)`);
      assert.ok(q.enunciado, `${donde}: falta el enunciado`);
      const alts = q.alternativas;
      assert.ok(alts.length >= 4 && alts.length <= 5, `${donde}: 4 o 5 alternativas (regla 1)`);
      assert.equal(new Set(alts.map(a => a.t)).size, alts.length, `${donde}: hay alternativas repetidas`);
      const correctas = alts.filter(a => a.correcta === true);
      assert.equal(correctas.length, 1, `${donde}: debe haber una sola correcta (regla 2)`);
      assert.ok(correctas[0].evidencia && correctas[0].evidencia.length, `${donde}: la correcta necesita evidencia (regla 2)`);
      const cods = [];
      for (const a of alts) {
        assert.ok(a.t && a.explicacion, `${donde}: cada alternativa necesita texto y explicación`);
        assert.ok(!LETRA.test(a.explicacion), `${donde}: una explicación nombra una letra (regla 8): "${a.explicacion}"`);
        for (const o of [...(a.evidencia || []), ...(a.origen ? [a.origen] : [])]) assert.ok(ids.has(o), `${donde}: apunta a ${o}, que no existe (regla 5)`);
        if (!a.correcta) {
          assert.ok(codigoValido(a.codigo), `${donde}: el código ${a.codigo} no está en el informe (regla 3)`);
          assert.ok(!('evidencia' in a), `${donde}: una incorrecta no lleva evidencia`);
          cods.push(a.codigo); usados.add(a.codigo);
        }
      }
      assert.equal(new Set(cods).size, cods.length, `${donde}: dos incorrectas con el mismo código (regla 4): ${cods}`);
      if (q.previo) {
        validarPrevio(q, t, donde);
        assert.ok(!LETRA.test(q.previo.explicacion) && Object.values(q.previo.explicaciones || {}).every(e => !LETRA.test(e)), `${donde}: el previo nombra una letra`);
      }
    }
    if (t.revision) assert.ok(t.revision.por && t.revision.fecha && ['aprobado', 'cambios'].includes(t.revision.veredicto), `${t.id}: revisión incompleta`);
  });
}

// ---------- Ejercicios sueltos (ejercicios/eNNN.json: una sola pregunta con su "cuerpo") ----------
const Lectura = require(path.join(raiz, 'nucleo/lectura.js'));
const CODIGOS_JSON = leer(path.join(aqui, 'codigos.json'));
const dirEj = path.join(aqui, 'ejercicios');
const EJERCICIOS = fs.existsSync(dirEj) ? fs.readdirSync(dirEj).filter(f => f.endsWith('.json')).sort()
  .map(f => ({ archivo: f, e: leer(path.join(dirEj, f)) })) : [];
// Tipo de ejercicio → forma del cuerpo y paso previo que admite (null: sin paso previo).
const TIPOS_EJ = {
  analogia: { cuerpo: c => Array.isArray(c.base) && c.base.length === 2, previo: 'relacion-analogia' },
  'termino-excluido': { cuerpo: c => Array.isArray(c.terminos) && c.terminos.length >= 4, previo: null },
  'oracion-incompleta': { cuerpo: c => typeof c.oracion === 'string' && c.oracion.includes('___'), previo: 'relacion' },
  conector: { cuerpo: c => typeof c.oracion === 'string' && c.oracion.includes('___'), previo: 'relacion' },
  'plan-de-redaccion': { cuerpo: c => Array.isArray(c.oraciones) && c.oraciones.length >= 4, previo: 'ordenar' },
  eliminacion: { cuerpo: c => Array.isArray(c.oraciones) && c.oraciones.length >= 4, previo: 'marcar-oracion' },
};

test('el índice apunta a ejercicios que existen y están aprobados', () => {
  const ids = new Set(EJERCICIOS.map(x => x.e.id));
  const lista = INDICE.ejercicios || [];
  assert.equal(new Set(lista).size, lista.length, 'indice.json: hay ejercicios repetidos');
  for (const id of lista) {
    assert.ok(ids.has(id), `indice.json: falta ejercicios/${id}.json`);
    const e = EJERCICIOS.find(x => x.e.id === id).e;
    assert.equal(e.revision && e.revision.veredicto, 'aprobado', `${id}: está en el índice sin revisión aprobada`);
  }
});

for (const { archivo, e } of EJERCICIOS) {
  test(`ejercicios/${archivo}: cumple el formato del banco`, () => {
    assert.equal(archivo, `${e.id}.json`, `${archivo}: el id debe coincidir con el nombre del archivo`);
    assert.match(e.id, /^e\d{3}$/);
    assert.deepEqual(Lectura.validar(e, { codigos: CODIGOS_JSON, unidades: UNIDADES }), []);
    const tipo = TIPOS_EJ[e.tipo];
    assert.ok(tipo, `${e.id}: tipo "${e.tipo}" no válido`);
    assert.ok(tipo.cuerpo(e.cuerpo || {}), `${e.id}: el cuerpo no tiene la forma de un ejercicio de ${e.tipo}`);
    assert.ok([3, 4, 5].includes(e.grado) && [1, 2, 3].includes(e.dificultad), `${e.id}: grado o dificultad inválidos`);
    assert.equal(e.origen, 'propio', `${e.id}: el ejercicio debe ser propio (regla 5)`);
    assert.ok(!e.hechos || e.hechos.every(h => h.afirmacion && h.fuente), `${e.id}: cada hecho necesita afirmación y fuente`);
    const alts = e.alternativas;
    assert.ok(alts.length >= 4 && alts.length <= 5, `${e.id}: 4 o 5 alternativas (regla 1)`);
    assert.equal(new Set(alts.map(a => a.t)).size, alts.length, `${e.id}: hay alternativas repetidas`);
    const cods = alts.filter(a => !a.correcta).map(a => a.codigo);
    assert.equal(new Set(cods).size, cods.length, `${e.id}: dos incorrectas con el mismo código (regla 4): ${cods}`);
    for (const c of cods) { assert.ok(codigoValido(c), `${e.id}: el código ${c} no está en el informe`); usados.add(c); }
    for (const a of alts) assert.ok(!LETRA.test(a.explicacion), `${e.id}: una explicación nombra una letra (regla 8): "${a.explicacion}"`);
    if (e.tipo === 'termino-excluido') assert.deepEqual(alts.map(a => a.t).sort(), [...e.cuerpo.terminos].sort(), `${e.id}: las alternativas deben ser los términos`);
    if (e.tipo === 'eliminacion') assert.deepEqual(alts.map(a => a.t).sort(), e.cuerpo.oraciones.map(o => o.n).sort(), `${e.id}: las alternativas deben ser los numerales de las oraciones`);
    const p = e.previo;
    assert.equal(p ? p.tipo : null, tipo.previo, `${e.id}: un ejercicio de ${e.tipo} lleva el paso previo ${tipo.previo}`);
    if (!p) return;
    assert.ok(!LETRA.test(p.explicacion) && Object.values(p.explicaciones || {}).every(x => !LETRA.test(x)), `${e.id}: el previo nombra una letra`);
    const correcta = alts.find(a => a.correcta).t;
    if (p.tipo === 'ordenar') {
      // La correcta es el orden aceptado, y el motor no ve un retoma roto en ella.
      assert.equal(correcta, p.aceptada.join(' – '), `${e.id}: la correcta debe ser el orden aceptado`);
      for (const a of alts) {
        const r = Lectura.calificarPrevio(p, a.t.split(' – '), e);
        if (a.codigo === 'RV28') assert.equal(r.error, 'RV28', `${e.id}: "${a.t}" dice RV28, pero no rompe ningún retoma`);
        if (a.codigo && a.codigo !== 'RV28') assert.notEqual(r.error, 'RV28', `${e.id}: "${a.t}" rompe un retoma y debería ser RV28`);
      }
      return;
    }
    let incorrectas;
    if (p.tipo === 'marcar-oracion') {
      assert.deepEqual(p.aceptadas, [correcta], `${e.id}: la oración que se marca debe ser la correcta`);
      const ns = e.cuerpo.oraciones.map(o => o.n).filter(n => !p.aceptadas.includes(n));
      assert.deepEqual(Object.keys(p.codigos).sort(), ns.sort(), `${e.id}: el previo necesita un código para cada oración que no sobra`);
      for (const n of ns) assert.equal(p.codigos[n], alts.find(a => a.t === n).codigo, `${e.id}: la oración ${n} tiene otro código en el previo y en la alternativa`);
      incorrectas = ns;
    } else if (p.tipo === 'relacion') {
      assert.equal(p.aceptada, 'oposicion', `${e.id}: por ahora, el previo relacion solo se usa con la oposición`);
      assert.deepEqual(p.codigos, { suma: 'RV26', causa: 'RV24' }, `${e.id}: códigos del previo relacion`);
      incorrectas = ['suma', 'causa'];
    } else {
      // Analogía: el código sale de la regla (inversa → RV16, otra → RV17); se pide la explicación de la inversa.
      const inv = Lectura.ANALOGIAS.find(x => x.id === p.aceptada).inversa;
      incorrectas = inv ? [inv] : [];
      for (const r of Object.keys(p.explicaciones || {})) assert.ok(r !== p.aceptada && Lectura.ANALOGIAS.some(x => x.id === r), `${e.id}: sobra la explicación del previo para "${r}"`);
    }
    for (const r of incorrectas) assert.ok(p.explicaciones && p.explicaciones[r], `${e.id}: falta la explicación del previo para "${r}"`);
    if (p.tipo !== 'relacion-analogia') for (const r of Object.keys(p.explicaciones || {})) assert.ok(incorrectas.includes(r), `${e.id}: sobra la explicación del previo para "${r}"`);
    for (const c of Object.values(p.codigos || {})) usados.add(c);
  });
}

test('la correcta no es siempre la más larga (regla 10)', () => {
  let total = 0, largas = 0;
  for (const { t } of TEXTOS) for (const q of t.preguntas) {
    total++;
    const max = Math.max(...q.alternativas.map(a => a.t.length));
    if (q.alternativas.find(a => a.correcta).t.length === max) largas++;
  }
  assert.ok(largas <= 0.4 * total, `la correcta es la más larga en ${largas} de ${total} preguntas (máximo 40 %)`);
});

test('cada código usado tiene su frase para el alumno (regla 11)', () => {
  for (const c of usados) assert.ok(FRASES[c] && FRASES[c].length > 10, `frases.json: falta la frase de ${c}`);
  for (const c of Object.keys(FRASES)) assert.ok(codigoValido(c), `frases.json: ${c} no está en el informe`);
});
