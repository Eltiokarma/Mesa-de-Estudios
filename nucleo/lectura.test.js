// Núcleo del formato lectura: corre sobre los textos reales del banco (contenido/razonamiento-verbal/)
// y sobre ejercicios sueltos de muestra para los tipos que el banco todavía no usa
// (analogía, plan de redacción y eliminación).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const L = require('./lectura.js');
const Codigos = require('../herramientas/codigos-verbal.js');

const raiz = path.join(__dirname, '..');
const dirBanco = path.join(raiz, 'contenido', 'razonamiento-verbal');
const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const INDICE = leer(path.join(dirBanco, 'indice.json'));
const CODIGOS = leer(path.join(dirBanco, 'codigos.json'));
const FRASES = leer(path.join(dirBanco, 'frases.json'));
const UNIDADES = new Set(leer(path.join(raiz, 'catalogo/cursos/razonamiento-verbal.json')).unidades.map(u => u.id));
const TEXTOS = fs.readdirSync(path.join(dirBanco, 'textos')).filter(f => f.endsWith('.json')).sort()
  .map(f => leer(path.join(dirBanco, 'textos', f)));
// Las pruebas de entrada y salida (t000a, t000b) van sin paso previo: para lo que necesita un previo,
// se busca el caso por su forma en los textos de práctica, no por su posición en la carpeta.
const PRACTICA = TEXTOS.filter(t => INDICE.textos.includes(t.id));
const conPrevio = (pred = () => true) => {
  for (const t of PRACTICA) { const k = t.preguntas.findIndex(q => q.previo && pred(q.previo)); if (k >= 0) return { t, k, q: t.preguntas[k] }; }
  throw new Error('ningún texto de práctica tiene un paso previo de esa forma');
};
const MARCAR = conPrevio(p => p.tipo === 'marcar-oracion');

// Ejercicios de muestra (no están en el banco: solo prueban el núcleo).
const ANALOGIA = { id: 'e901', version: 1, tipo: 'analogia', unidad: 'razonamiento-verbal.analogias',
  cuerpo: { base: ['VACA', 'LECHE'] },
  previo: { tipo: 'relacion-analogia', pide: '¿Qué relación hay?', aceptada: 'a-produce-b', explicacion: 'La vaca da la leche.' },
  enunciado: 'VACA : LECHE ::', alternativas: [
    { t: 'abeja : miel', correcta: true, evidencia: [], explicacion: 'Un animal y lo que produce.' },
    { t: 'abeja : panal', codigo: 'RV15', explicacion: 'Asociada a abeja.' },
    { t: 'miel : abeja', codigo: 'RV16', explicacion: 'Al revés.' },
    { t: 'flor : abeja', codigo: 'RV17', explicacion: 'Otra relación.' }] };
const PLAN = { id: 'e902', version: 2, tipo: 'plan-de-redaccion', unidad: 'razonamiento-verbal.plan-de-redaccion',
  cuerpo: { oraciones: [{ n: 'I', t: 'Esta celebración dura semanas.', retoma: 'II' }, { n: 'II', t: 'La Candelaria se celebra en Puno.' },
    { n: 'III', t: 'Participan miles de danzantes.' }] },
  previo: { tipo: 'ordenar', pide: 'Ordena.', aceptada: ['II', 'I', 'III'], explicacion: 'Primero se presenta, luego se retoma.' },
  enunciado: 'Elige el orden correcto.', alternativas: [
    { t: 'II – I – III', correcta: true, evidencia: [], explicacion: 'Bien.' },
    { t: 'I – II – III', codigo: 'RV28', explicacion: 'Retoma antes.' },
    { t: 'III – I – II', codigo: 'RV29', explicacion: 'Otro orden.' }] };
const ELIM = { id: 'e903', version: 1, tipo: 'eliminacion', unidad: 'razonamiento-verbal.eliminacion-de-oraciones',
  cuerpo: { oraciones: [{ n: 'I', t: 'La totora crece en el lago.' }, { n: 'II', t: 'Con ella se hacen balsas.' }, { n: 'III', t: 'La trucha se pesca en el lago.' }] },
  previo: { tipo: 'marcar-oracion', pide: 'Toca la que sobra.', aceptadas: ['III'], codigos: { I: 'RV30', II: 'RV30' }, explicacion: 'La III no habla de la totora.' },
  enunciado: '¿Qué oración se elimina?', alternativas: [
    { t: 'III', correcta: true, evidencia: [], explicacion: 'No habla de la totora.' },
    { t: 'II', codigo: 'RV30', explicacion: 'Es otro uso.' }] };

test('codigos.json está al día con el informe (si falla: npm run catalogo)', () => {
  assert.equal(fs.readFileSync(Codigos.SALIDA, 'utf8'), Codigos.texto());
  for (const v of Object.values(CODIGOS)) assert.ok(['documentado', 'parcial', 'hipotesis'].includes(v.respaldo));
  assert.equal(Codigos.normalizarRespaldo('Hipótesis (con contexto indirecto)'), 'hipotesis');
  assert.equal(Codigos.normalizarRespaldo('Parcial (por verificar)'), 'parcial');
});

test('cada texto del banco pasa la validación del núcleo', () => {
  assert.ok(TEXTOS.length >= 1);
  for (const t of TEXTOS) assert.deepEqual(L.validar(t, { codigos: CODIGOS, unidades: UNIDADES }), [], t.id);
  for (const e of [ANALOGIA, PLAN, ELIM]) assert.deepEqual(L.validar(e, { codigos: CODIGOS, unidades: UNIDADES }), [], e.id);
});

test('validar encuentra los errores que romperían la pantalla', () => {
  // Un texto de práctica con un previo de tabla (clasificar, relación o propósito): quitarle un código debe saltar.
  const base = conPrevio(p => p.tipo !== 'marcar-oracion' && p.codigos && Object.keys(p.codigos).length);
  const t = structuredClone(base.t);
  t.preguntas[0].alternativas[0].correcta = false;
  t.preguntas[0].alternativas[1].evidencia = ['o99'];
  const q = t.preguntas[base.k];
  delete q.previo.codigos[Object.keys(q.previo.codigos)[0]];
  const err = L.validar(t, { codigos: CODIGOS, unidades: UNIDADES }).join('\n');
  assert.match(err, /una sola correcta/);
  assert.match(err, /o99/);
  assert.match(err, /falta el código/);
  assert.match(L.validar({ ...TEXTOS[0], version: 0 }).join(), /versión/);
});

test('el paso previo se califica con las tablas del banco (todas las respuestas posibles)', () => {
  let n = 0;
  for (const t of TEXTOS) for (const q of t.preguntas) {
    if (!q.previo) continue;
    const p = q.previo;
    for (const o of L.opcionesPrevio(p, L.normalizar(t))) {
      const r = L.calificarPrevio(p, o, t); n++;
      assert.equal(r.opcion, o);
      if (p.tipo === 'marcar-oracion') {
        if (o === 'ninguna') { assert.equal(r.correcta, p.ninguna === 'correcta'); continue; }
        assert.equal(r.correcta, p.aceptadas.includes(o), `${t.id}.${q.id} ${o}`);
        if (!r.correcta) {
          // Orden de la sección 5.3: codigos; RV4 si es la primera; si no, el rol.
          const or = t.parrafos.flat().find(x => x.id === o);
          const esperado = (p.codigos || {})[o] || (o === t.parrafos[0][0].id ? 'RV4' : { detalle: 'RV1', ejemplo: 'RV1', cita: 'RV1', general: 'RV2', apoyo: 'RV3', contraste: 'RV3' }[or.rol]);
          assert.equal(r.error, esperado, `${t.id}.${q.id} ${o}`);
          assert.ok(FRASES[r.error], `falta la frase de ${r.error}`);
        }
      } else {
        const aceptada = p.tipo === 'clasificar' ? p.clase : p.aceptada;
        assert.equal(r.correcta, o === aceptada);
        if (!r.correcta) assert.equal(r.error, p.codigos[o]);
      }
    }
  }
  assert.ok(n > 30, `se calificaron ${n} respuestas`);
  // Un código null del banco se registra como error sin código.
  const t3 = TEXTOS.find(t => t.preguntas.some(q => q.previo && q.previo.codigos && Object.values(q.previo.codigos).includes(null)));
  if (t3) {
    const q = t3.preguntas.find(x => x.previo && x.previo.codigos && Object.values(x.previo.codigos).includes(null));
    const o = Object.keys(q.previo.codigos).find(k => q.previo.codigos[k] === null);
    assert.deepEqual(L.calificarPrevio(q.previo, o, t3), { correcta: false, error: null, opcion: o });
  }
  assert.throws(() => L.calificarPrevio(MARCAR.q.previo, 'o99', MARCAR.t), /no existe/);
});

test('analogía, plan de redacción y eliminación se califican con sus reglas', () => {
  const pa = ANALOGIA.previo;
  assert.deepEqual(L.calificarPrevio(pa, 'a-produce-b', ANALOGIA), { correcta: true, error: null, opcion: 'a-produce-b' });
  assert.equal(L.calificarPrevio(pa, 'b-produce-a', ANALOGIA).error, 'RV16'); // la inversa
  assert.equal(L.calificarPrevio(pa, 'a-parte-de-b', ANALOGIA).error, 'RV17');
  assert.equal(L.calificarPrevio(pa, 'sinonimos', ANALOGIA).error, 'RV17');
  assert.equal(L.etiquetaPrevio(pa, 'b-produce-a', ANALOGIA), 'De LECHE se obtiene VACA');
  const pp = PLAN.previo;
  assert.deepEqual(L.calificarPrevio(pp, ['II', 'I', 'III'], PLAN), { correcta: true, error: null, opcion: 'II-I-III' });
  assert.equal(L.calificarPrevio(pp, ['I', 'II', 'III'], PLAN).error, 'RV28'); // "Esta celebración" antes de nombrarla
  assert.equal(L.calificarPrevio(pp, 'II-III-I', PLAN).error, 'RV29');
  // RV37: empezar por la conclusión (sin retoma y con «así» o «por eso») pesa más que el retoma roto.
  const CONC = structuredClone(PLAN); CONC.cuerpo.oraciones.push({ n: 'IV', t: 'Por eso, la fiesta sigue viva.' }); CONC.previo.aceptada = [...CONC.previo.aceptada, 'IV'];
  assert.equal(L.calificarPrevio(CONC.previo, ['IV', 'II', 'I', 'III'], CONC).error, 'RV37');
  assert.equal(L.calificarPrevio(CONC.previo, ['I', 'II', 'III', 'IV'], CONC).error, 'RV28');
  // El orden aceptado no puede ser el presentado (bastaría confirmar sin mover nada).
  const mal = structuredClone(PLAN); mal.previo.aceptada = ['I', 'II', 'III'];
  assert.match(L.validar(mal).join(), /mismo en que se presentan/);
  const pe = ELIM.previo;
  assert.equal(L.calificarPrevio(pe, 'III', ELIM).correcta, true);
  assert.equal(L.calificarPrevio(pe, 'I', ELIM).error, 'RV30'); // sin la regla de RV4
  assert.equal(L.etiquetaPrevio(pe, 'II', ELIM), 'la oración II');
});

test('preparar baraja con semilla y guarda la posición en el banco', () => {
  const t = TEXTOS[0];
  const a = L.preparar(t, 'a1'), b = L.preparar(t, 'a1'), c = L.preparar(t, 'otro');
  assert.deepEqual(a, b, 'la misma semilla da el mismo orden');
  assert.equal(a.problema, `${t.id}v${t.version}`);
  const letrasCorrecta = new Set();
  let distintos = 0;
  for (const [k, q] of a.preguntas.entries()) {
    assert.equal(q.problema, `${t.id}v${t.version}.${q.id}`);
    assert.deepEqual(q.alternativas.map(x => x.letra), L.LETRAS.slice(0, q.alternativas.length));
    assert.deepEqual(q.alternativas.map(x => x.pos).sort(), t.preguntas[k].alternativas.map((_, i) => i + 1));
    for (const x of q.alternativas) assert.equal(x.t, t.preguntas[k].alternativas[x.pos - 1].t, 'pos apunta a la alternativa del banco');
    if (q.alternativas.map(x => x.pos).join() !== c.preguntas[k].alternativas.map(x => x.pos).join()) distintos++;
  }
  assert.ok(distintos > 0, 'otra semilla cambia el orden');
  // En el banco la correcta suele ir primera: barajada, cae en distintas letras según el alumno.
  for (let s = 0; s < 40; s++) letrasCorrecta.add(L.preparar(t, 'al' + s).preguntas[0].alternativas.find(x => x.correcta).letra);
  assert.ok(letrasCorrecta.size >= 3);
  // Las pruebas usan una semilla fija, igual para todos.
  assert.deepEqual(L.preparar(t, 'entrada'), L.preparar(t, 'entrada'));
  // Un ejercicio suelto es una pregunta sin id: su problema es el ítem.
  assert.equal(L.preparar(ANALOGIA, 'x').preguntas[0].problema, 'e901v1');
});

test('calificar por letra o por posición, y la pintura del texto', () => {
  const q = L.preparar(TEXTOS[0], 'a1').preguntas[0];
  const mal = q.alternativas.find(x => !x.correcta && x.origen);
  const r = L.calificar(q, mal.letra);
  assert.equal(r.correcta, false);
  assert.equal(r.error, mal.codigo);
  assert.equal(r.pos, mal.pos);
  assert.deepEqual(L.calificar(q, mal.pos), r);
  const p = L.pintura(q, mal.letra);
  assert.deepEqual(p.evidencia, q.alternativas.find(x => x.correcta).evidencia);
  assert.deepEqual(p.distractor, [mal.origen]);
  assert.deepEqual(L.pintura(q, r.clave.letra).distractor, []);
});

test('la corrección del paso previo usa su explicación o la frase del código', () => {
  // El banco trae una explicación para cada respuesta incorrecta del previo (banco.test.js); para probar la
  // vuelta a la frase del código se le quita la explicación a una oración en una copia.
  const { t } = MARCAR, p0 = MARCAR.q.previo;
  const mal = t.parrafos.flat().find(o => !p0.aceptadas.includes(o.id) && L.calificarPrevio(p0, o.id, t).error);
  const p = structuredClone(p0);
  if (p.explicaciones) delete p.explicaciones[mal.id];
  const c = L.correccionPrevio(p, L.calificarPrevio(p, mal.id, t), t, FRASES);
  assert.equal(c.correcta, false);
  assert.match(c.eligio, /^la oración \d+$/);
  assert.equal(c.explicacion, p.explicacion);
  assert.ok(FRASES[L.calificarPrevio(p, mal.id, t).error]);
  assert.equal(c.porQue, FRASES[L.calificarPrevio(p, mal.id, t).error]);
  assert.deepEqual(c.idea, p.aceptadas);
  const conExp = Object.keys(p0.explicaciones || {}).find(o => o !== 'ninguna');
  assert.ok(conExp, 'el previo del banco trae explicaciones propias');
  assert.equal(L.correccionPrevio(p0, L.calificarPrevio(p0, conExp, t), t, FRASES).porQue, p0.explicaciones[conExp]);
  const bien = L.correccionPrevio(p, L.calificarPrevio(p, p.aceptadas[0], t), t, FRASES);
  assert.equal(bien.porQue, '');
});

test('la práctica sigue el índice, filtra por unidad y no repite hasta acabar', () => {
  const items = Object.fromEntries(TEXTOS.map(t => [t.id, t]));
  const todos = L.lista(INDICE, items);
  assert.deepEqual(todos.map(x => x.id), INDICE.textos);
  const u = 'razonamiento-verbal.conectores';
  const con = L.lista(INDICE, items, u);
  assert.ok(con.length >= 1 && con.every(x => x.preguntas.some(q => q.unidad === u)));
  assert.equal(L.siguiente(todos, {}).id, INDICE.textos[0]);
  assert.equal(L.siguiente(todos, { [INDICE.textos[0]]: 1 }).id, INDICE.textos[1]);
  const hechos = Object.fromEntries(INDICE.textos.map(id => [id, 1]));
  assert.equal(L.siguiente(todos, hechos).id, INDICE.textos[0], 'acabados todos, vuelve a empezar');
  assert.deepEqual(L.lista({ textos: [], ejercicios: ['e901'] }, { e901: ANALOGIA }, 'razonamiento-verbal.analogias').map(x => x.id), ['e901']);
});

test('los eventos tienen la forma del diseño (sección 6)', () => {
  const t = MARCAR.t, pr = L.preparar(t, 'a1'), q = pr.preguntas[MARCAR.k];
  assert.deepEqual(L.ev.lectura({ modulo: 'lectura-verbal', unidad: q.unidad, item: t, ms: 1200 }),
    { tipo: 'lectura', modulo: 'lectura-verbal', unidad: q.unidad, problema: `${t.id}v${t.version}`, ms: 1200 });
  const mal = t.parrafos.flat().find(o => !q.previo.aceptadas.includes(o.id));
  const rp = L.calificarPrevio(q.previo, mal.id, t);
  const e1 = L.ev.previo({ modulo: 'lectura-verbal', pregunta: q, resultado: rp, codigos: CODIGOS, ms: 5 });
  assert.deepEqual(e1, { tipo: 'previo', modulo: 'lectura-verbal', unidad: q.unidad, problema: q.problema, opcion: mal.id,
    correcta: false, error: rp.error, respaldo: CODIGOS[rp.error].respaldo, ms: 5 });
  const alt = q.alternativas.find(x => !x.correcta);
  const e2 = L.ev.respuesta({ modulo: 'lectura-verbal', pregunta: q, resultado: L.calificar(q, alt.letra), codigos: CODIGOS, ms: 7 });
  assert.equal(e2.tipo, 'prediccion');
  assert.equal(e2.opcion, String(alt.pos), 'se registra la posición en el banco, no la letra');
  assert.equal(e2.error, alt.codigo);
  assert.equal(e2.respaldo, CODIGOS[alt.codigo].respaldo);
  const rs = pr.preguntas.map(x => L.calificar(x, x.alternativas[0].letra));
  const e3 = L.ev.prueba({ fase: 'entrada', modulo: 'lectura-verbal', unidad: q.unidad, item: t, resultados: rs, ms: 9 });
  assert.equal(e3.respuestas, rs.map(r => r.pos).join(''));
  assert.equal(e3.total, t.preguntas.length);
  assert.equal(e3.aciertos, rs.filter(r => r.correcta).length);
  const sinCodigo = L.ev.previo({ modulo: 'm', pregunta: q, resultado: { opcion: 'x', correcta: false, error: null }, codigos: CODIGOS, ms: 1 });
  assert.equal(sinCodigo.error, '');
  assert.equal(sinCodigo.respaldo, '');
});

test('repetir un texto cambia el barajado (semilla con el intento)', () => {
  const t = TEXTOS[0];
  assert.deepEqual(L.preparar(t, 'a1', 1), L.preparar(t, 'a1', 1));
  let distinto = 0;
  for (let i = 2; i < 8; i++) if (JSON.stringify(L.preparar(t, 'a1', i).preguntas.map(q => q.alternativas.map(a => a.pos))) !== JSON.stringify(L.preparar(t, 'a1', 1).preguntas.map(q => q.alternativas.map(a => a.pos)))) distinto++;
  assert.ok(distinto > 0);
  const q = L.preparar(t, 'a1', 3).preguntas[0];
  const r = L.calificar(q, q.alternativas[0].letra);
  assert.equal(L.ev.respuesta({ modulo: 'm', pregunta: q, resultado: r, ms: 1, intento: 3 }).intento, 3);
  assert.equal(L.ev.previo({ modulo: 'm', pregunta: q, resultado: { opcion: 'o1', correcta: false, error: 'RV4' }, ms: 1, intento: 2 }).intento, 2);
  assert.equal(L.ev.lectura({ modulo: 'm', unidad: 'u', item: t, ms: 1, intento: 2 }).intento, 2);
});

test('el paso previo no usa la frase del código cuando no describe la respuesta', () => {
  const t = TEXTOS.find(x => x.preguntas.some(q => q.previo && q.previo.tipo === 'marcar-oracion' && q.previo.ninguna && q.previo.ninguna !== 'correcta'));
  const p = t.preguntas.find(q => q.previo && q.previo.tipo === 'marcar-oracion').previo;
  const c = L.correccionPrevio(p, L.calificarPrevio(p, 'ninguna', t), t, FRASES);
  if (!(p.explicaciones || {}).ninguna) { assert.equal(c.neutra, true); assert.equal(c.porQue, ''); }
  // Clasificar: "lo dice" ante algo que se deduce es RV58, y su frase sí describe esa respuesta.
  const sinte = { tipo: 'clasificar', pide: 'x', sonda: 's', clase: 'se-deduce', codigos: { 'lo-dice': 'RV58', 'no-se-sabe': 'RV34', 'lo-contradice': null }, explicacion: 'Se deduce de la oración 6.' };
  const c1 = L.correccionPrevio(sinte, L.calificarPrevio(sinte, 'lo-dice', t), t, FRASES);
  assert.deepEqual([c1.neutra, c1.porQue], [false, FRASES.RV58]);
  const c2 = L.correccionPrevio(sinte, L.calificarPrevio(sinte, 'no-se-sabe', t), t, FRASES);
  assert.deepEqual([c2.neutra, c2.porQue], [false, FRASES.RV34]);
  const c3 = L.correccionPrevio(sinte, L.calificarPrevio(sinte, 'lo-contradice', t), t, FRASES);
  assert.equal(c3.neutra, true, 'sin código ni explicación: frase neutra');
  const av = L.avisos({ ...t, preguntas: [{ ...t.preguntas[0], previo: sinte }] }, FRASES);
  assert.ok(av.some(a => a.opcion === 'lo-dice' && !a.neutra) && av.some(a => a.opcion === 'lo-contradice' && a.neutra));
});

test('avisos del banco: respuestas incorrectas del paso previo sin explicación propia', t => {
  const todos = TEXTOS.flatMap(x => L.avisos(x, FRASES));
  const neutras = todos.filter(a => a.neutra);
  // No es un error (el banco es de la rutina verbal): se avisa en la salida de las pruebas.
  t.diagnostic(`${todos.length} respuestas incorrectas de pasos previos sin explicación propia; ${neutras.length} quedan con la frase neutra: ${neutras.map(a => `${a.item}.${a.pregunta}:${a.opcion}`).join(', ') || 'ninguna'}`);
  for (const a of todos) assert.ok(a.item && a.pregunta && a.opcion);
});

test('pruebas de entrada y salida: orden AB o BA y eventos que resumirCursos entiende', () => {
  const M = require('./medicion.js');
  // Banco de muestra (no está en contenido/): dos textos paralelos, A y B.
  const A = structuredClone(TEXTOS[0]); A.id = 't900a'; for (const q of A.preguntas) delete q.previo;
  const B = structuredClone(TEXTOS[1]); B.id = 't900b'; B.preguntas = B.preguntas.slice(0, A.preguntas.length); for (const q of B.preguntas) delete q.previo;
  const indice = { entrada: 't900a', salida: 't900b', textos: [], ejercicios: [] };
  const items = { t900a: A, t900b: B };
  const ordenes = new Set();
  for (let i = 0; i < 40; i++) {
    const e = L.formaPrueba(indice, 'al' + i, 'entrada', 'razonamiento-verbal'), s = L.formaPrueba(indice, 'al' + i, 'salida', 'razonamiento-verbal');
    assert.notEqual(e.id, s.id); assert.equal(e.orden, s.orden); ordenes.add(e.orden);
  }
  assert.deepEqual([...ordenes].sort(), ['AB', 'BA']);
  assert.deepEqual(L.formaPrueba({ entrada: 't900a', salida: null }, 'x', 'entrada', 'c'), { orden: 'AB', forma: 'A', id: 't900a' });
  // Dos alumnos: uno falla todo en la entrada y acierta todo en la salida; el otro acierta la mitad y luego todo.
  const ev = [];
  const hacer = (alumno, fase, elegir) => {
    const f = L.formaPrueba(indice, alumno, fase, 'razonamiento-verbal');
    const it = L.preparar(items[f.id], `prueba-${f.forma}`);
    const rs = it.preguntas.map((q, k) => {
      const r = L.calificar(q, elegir(q, k).letra);
      ev.push({ alumno, t: `${alumno}${fase}${k}`, ...L.ev.item({ fase, curso: 'razonamiento-verbal', modulo: 'lectura-verbal', forma: f.forma, orden: f.orden, pregunta: q, resultado: r, codigos: CODIGOS, ms: 5 }) });
      return r;
    });
    ev.push({ alumno, t: `${alumno}${fase}z`, ...L.ev.prueba({ fase, curso: 'razonamiento-verbal', forma: f.forma, orden: f.orden, modulo: 'lectura-verbal', unidad: 'u', item: it, resultados: rs, ms: 9 }) });
  };
  const bien = q => q.alternativas.find(a => a.correcta), mal = q => q.alternativas.find(a => !a.correcta);
  hacer('a1', 'entrada', mal); hacer('a1', 'salida', bien);
  hacer('a2', 'entrada', (q, k) => (k % 2 ? mal(q) : bien(q))); hacer('a2', 'salida', bien);
  const item = ev.find(e => e.tipo === 'item');
  assert.equal(item.banco, 'lectura'); assert.equal(item.plantilla, 'lectura-verbal'); assert.match(item.opcion, /^[1-5]$/);
  const [r] = M.resumirCursos(ev);
  assert.equal(r.curso, 'razonamiento-verbal');
  assert.equal(r.pareados, 2);
  assert.equal(r.salidaPareados, 1);
  assert.equal(r.hake, 1, 'de lo que faltaba, se ganó todo');
  assert.ok(r.errores.length > 0 && r.errores.every(e => /^RV\d+$/.test(e.id) && e.despues === 0 && e.antes >= 1));
  assert.deepEqual(r.plantillas.map(p => p.id), ['lectura-verbal']);
});

// ---------- Figuras de los textos discontinuos (tabla, barras, recuadros) ----------
const DISCONTINUO = { id: 't900', version: 1, titulo: 'Lluvias', tipo_texto: 'discontinuo',
  parrafos: [[{ id: 'o1', rol: 'principal', t: 'En Juliaca casi toda la lluvia cae de diciembre a marzo.' }],
    [{ id: 'o2', rol: 'detalle', t: 'En invierno casi no llueve.' }]],
  figuras: [
    { id: 'f1', tipo: 'barras', despues: 1, titulo: 'Lluvia por mes', unidad: 'mm', barras: [{ id: 'f1a', etiqueta: 'Ene', valor: 130 }, { id: 'f1b', etiqueta: 'Jul', valor: 2 }], nota: 'Datos ilustrativos.' },
    { id: 'f2', tipo: 'tabla', despues: 2, titulo: 'Temperatura', columnas: ['Mes', 'Mínima (°C)'], filas: [{ id: 'f2a', celdas: ['Ene', '3'] }, { id: 'f2b', celdas: ['Jul', '-8'] }] },
    { id: 'f3', tipo: 'recuadros', despues: 0, titulo: 'Qué hacer', recuadros: [{ id: 'f3a', titulo: 'Antes', t: 'Limpiar el techo.' }, { id: 'f3b', t: 'Guardar agua.' }] }],
  preguntas: [{ id: 'p1', tipo: 'dato', unidad: 'razonamiento-verbal.textos-discontinuos', enunciado: '¿Cuánto llueve en enero?',
    previo: { tipo: 'clasificar', pide: '¿Qué relación tiene?', sonda: 'En julio llueve menos que en enero.', clase: 'lo-dice', codigos: { 'se-deduce': null, 'no-se-sabe': 'RV34', 'lo-contradice': null }, explicacion: 'Lo dice el gráfico.' },
    alternativas: [{ t: '130 mm', correcta: true, evidencia: ['f1a'], explicacion: 'La barra de enero.' },
      { t: '2 mm', codigo: 'RV5', origen: 'f1b', explicacion: 'Es julio.' }] }] };

test('figuras: partes citables, referencias y etiquetas', () => {
  const els = L.elementos(DISCONTINUO);
  assert.deepEqual(els.map(e => e.id), ['f1', 'f1a', 'f1b', 'f2', 'f2a', 'f2b', 'f3', 'f3a', 'f3b']);
  assert.equal(els.find(e => e.id === 'f1a').t, 'Ene: 130 mm');
  assert.equal(els.find(e => e.id === 'f2b').t, 'Mes: Jul · Mínima (°C): -8');
  assert.equal(els.find(e => e.id === 'f3a').t, 'Antes: Limpiar el techo.');
  assert.ok(L.referencias(DISCONTINUO).has('f2a') && L.referencias(DISCONTINUO).has('o2'));
  assert.equal(L.etiquetaRef(DISCONTINUO, 'o2'), 'la oración 2');
  assert.equal(L.etiquetaRef(DISCONTINUO, 'f1a'), 'la barra «Ene» del gráfico');
  assert.equal(L.etiquetaRef(DISCONTINUO, 'f2a'), 'la fila «Ene» de la tabla');
  assert.equal(L.etiquetaRef(DISCONTINUO, 'f3'), 'la infografía');
  assert.deepEqual(L.citas(DISCONTINUO, ['f1a', 'o1']).map(c => [c.id, c.marca]), [['o1', '1'], ['f1a', 'Gráfico']]);
  assert.deepEqual(L.pintura(L.preparar(DISCONTINUO, 's').preguntas[0], 2).distractor, ['f1b']);
});

test('figuras: validar acepta el texto y rechaza figuras mal armadas', () => {
  assert.deepEqual(L.validar(DISCONTINUO, { codigos: CODIGOS, unidades: UNIDADES }), []);
  const con = cambio => { const t = JSON.parse(JSON.stringify(DISCONTINUO)); cambio(t); return L.validar(t); };
  assert.ok(con(t => { t.figuras[0].despues = 3; }).some(e => /despues/.test(e)));
  assert.ok(con(t => { t.figuras[1].filas[0].celdas.pop(); }).some(e => /una celda por columna/.test(e)));
  assert.ok(con(t => { t.figuras[0].barras[0].valor = -1; }).some(e => /no negativo/.test(e)));
  assert.ok(con(t => { t.figuras[2].tipo = 'torta'; }).some(e => /tipo/.test(e)));
  assert.ok(con(t => { t.figuras[0].barras[1].id = 'o1'; }).some(e => /repetidos/.test(e)));
  assert.ok(con(t => { t.preguntas[0].alternativas[0].evidencia = ['f9']; }).some(e => /f9/.test(e)));
  assert.ok(con(t => { delete t.figuras[0].titulo; }).some(e => /título/.test(e)));
});

// ---------- Figura «imagen» (svg propio + sus partes en texto) ----------
const IMAGEN = { id: 't901', version: 1, titulo: 'Plaza', tipo_texto: 'discontinuo',
  parrafos: [[{ id: 'o1', rol: 'principal', t: 'La plaza se llenaba en la fiesta.' }]],
  figuras: [{ id: 'f1', tipo: 'imagen', despues: 1, titulo: 'La plaza', alt: 'Dibujo de una torre con una cruz y de unas andas.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="var(--c-i)" stroke="currentColor"/></svg>',
    partes: [{ id: 'f1a', n: 1, titulo: 'Torre', t: 'Una torre con una cruz.' }, { id: 'f1b', n: 2, titulo: 'Andas', t: 'Unas andas con un santo.' }] }],
  preguntas: [{ id: 'p1', tipo: 'dato', unidad: 'razonamiento-verbal.textos-discontinuos', enunciado: '¿Qué hay en la imagen?',
    alternativas: [{ t: 'Una torre.', correcta: true, evidencia: ['f1a'], explicacion: 'El elemento 1.' }, { t: 'Un río.', codigo: 'RV5', origen: 'f1b', explicacion: 'No hay río.' }] }] };

test('imagen: partes citables, etiquetas y citas', () => {
  assert.deepEqual(L.elementos(IMAGEN).map(e => e.id), ['f1', 'f1a', 'f1b']);
  assert.equal(L.elementos(IMAGEN).find(e => e.id === 'f1a').t, 'Torre: Una torre con una cruz.');
  assert.equal(L.etiquetaRef(IMAGEN, 'f1'), 'la imagen');
  assert.equal(L.etiquetaRef(IMAGEN, 'f1b'), 'el elemento «Andas» de la imagen');
  assert.deepEqual(L.citas(IMAGEN, ['f1a']).map(c => c.marca), ['Imagen']);
  assert.deepEqual(L.pintura(L.preparar(IMAGEN, 's').preguntas[0], 2).evidencia, ['f1a']);
});

test('imagen: validar acepta el texto y rechaza svg inseguro o partes incompletas', () => {
  assert.deepEqual(L.validar(IMAGEN, { codigos: CODIGOS, unidades: UNIDADES }), []);
  const con = cambio => { const t = JSON.parse(JSON.stringify(IMAGEN)); cambio(t); return L.validar(t); };
  assert.ok(con(t => { t.figuras[0].svg = '<svg viewBox="0 0 1 1"><script>x()</script></svg>'; }).some(e => /código/.test(e)));
  assert.ok(con(t => { t.figuras[0].svg = '<svg viewBox="0 0 1 1"><rect onclick="x()"/></svg>'; }).some(e => /código/.test(e)));
  assert.ok(con(t => { t.figuras[0].svg = '<svg viewBox="0 0 1 1"><foreignObject/></svg>'; }).some(e => /código/.test(e)));
  assert.ok(con(t => { t.figuras[0].svg = '<svg viewBox="0 0 1 1"><rect fill="#ff0000"/></svg>'; }).some(e => /colores fijos/.test(e)));
  assert.ok(con(t => { t.figuras[0].svg = '<svg><rect/></svg>'; }).some(e => /viewBox/.test(e)));
  assert.ok(con(t => { t.figuras[0].alt = 'corta'; }).some(e => /alt/.test(e)));
  assert.ok(con(t => { t.figuras[0].partes.pop(); }).some(e => /al menos 2/.test(e)));
  assert.ok(con(t => { delete t.figuras[0].partes[0].t; }).some(e => /necesita texto/.test(e)));
});

// ---------- Pares de textos A/B (rutina verbal A/B, 8 nov 2026) ----------
const PAR = {
  id: 'tpar', version: 1, titulo: 'Par de muestra', tipo_texto: 'argumentativo',
  autores: [{ id: 'A', desde: 0 }, { id: 'B', desde: 1, firma: 'Una profesora' }],
  parrafos: [
    [{ id: 'o1', rol: 'principal', t: 'Conviene X.' }, { id: 'o2', rol: 'apoyo', t: 'Practicar ayuda.' }],
    [{ id: 'o3', rol: 'principal', t: 'Conviene Y.' }, { id: 'o4', rol: 'apoyo', t: 'Practicar ayuda, sí.' }],
  ],
  preguntas: [{
    id: 'p1', tipo: 'postura', unidad: 'razonamiento-verbal.textos-argumentativos-y-dialecticos', enunciado: '¿Qué sostiene B?',
    previo: { tipo: 'atribuir', pide: '¿Quién lo sostiene?', sonda: 'Conviene Y.', aceptada: 'B',
      codigos: { A: 'RV59', ambos: 'RV60', ninguno: null }, explicacion: 'Lo dice B.', explicaciones: { A: 'No.', ambos: 'No.', ninguno: 'No.' } },
    alternativas: [{ t: 'Y', correcta: true, evidencia: ['o3'], explicacion: 'Sí.' }, { t: 'X', codigo: 'RV59', origen: 'o1', explicacion: 'Es de A.' }],
  }],
};

test('par A/B: cada oración sabe de qué autor es y la numeración sigue de corrido', () => {
  const ors = L.oraciones(PAR);
  assert.deepEqual(ors.map(o => [o.id, o.n, o.autor]), [['o1', 1, 'A'], ['o2', 2, 'A'], ['o3', 3, 'B'], ['o4', 4, 'B']]);
  assert.equal(L.autores(PAR)[1].titulo, 'Texto B');
  assert.equal(L.autorDe(PAR, 0), 'A');
  // Un texto sin autores no cambia: sus oraciones no llevan "autor".
  assert.ok(L.oraciones(TEXTOS.find(t => !t.autores)).every(o => !('autor' in o)));
});

test('par A/B: el previo atribuir se califica con su tabla y valida sus campos', () => {
  const p = PAR.preguntas[0].previo;
  assert.deepEqual(L.opcionesPrevio(p, PAR), ['A', 'B', 'ambos', 'ninguno']);
  assert.deepEqual(L.calificarPrevio(p, 'B', PAR), { correcta: true, error: null, opcion: 'B' });
  assert.deepEqual(L.calificarPrevio(p, 'A', PAR), { correcta: false, error: 'RV59', opcion: 'A' });
  assert.deepEqual(L.calificarPrevio(p, 'ninguno', PAR), { correcta: false, error: null, opcion: 'ninguno' });
  assert.equal(L.etiquetaPrevio(p, 'ambos', PAR), 'Los dos autores');
  assert.throws(() => L.calificarPrevio(p, 'C', PAR));
  assert.deepEqual(L.validar(PAR, { codigos: CODIGOS, unidades: UNIDADES }), []);
  const c = L.correccionPrevio(p, L.calificarPrevio(p, 'A', PAR), PAR, FRASES);
  assert.equal(c.porQue, 'No.');
  assert.equal(c.aceptada, 'El autor del texto B');
});

test('par A/B: validar avisa de autores mal puestos y de un atribuir sin par', () => {
  const mal = { ...PAR, autores: [{ id: 'A', desde: 0 }, { id: 'B', desde: 2 }] };
  assert.ok(L.validar(mal).some(e => /texto B debe empezar/.test(e)));
  const solo = { ...PAR, autores: undefined };
  assert.ok(L.validar(solo).some(e => /atribuir solo va en un par/.test(e)));
  const sinSonda = { ...PAR, preguntas: [{ ...PAR.preguntas[0], previo: { ...PAR.preguntas[0].previo, sonda: '' } }] };
  assert.ok(L.validar(sinSonda).some(e => /atribuir necesita "sonda"/.test(e)));
});

// ---------- «No sé» en las pruebas de entrada y salida ----------
test('«No sé» en la prueba de lectura: ni acierto ni código, 0 en las respuestas', () => {
  const M = require('./medicion.js');
  const t = TEXTOS[0], it = L.preparar(t, 'prueba-A'), q = it.preguntas[0];
  const r = L.noSe(q);
  assert.equal(r.nose, true); assert.equal(r.correcta, false); assert.equal(r.error, null); assert.equal(r.pos, 0);
  const e = L.ev.item({ fase: 'entrada', curso: 'razonamiento-verbal', modulo: 'lectura-verbal', forma: 'A', orden: 'AB', pregunta: q, resultado: r, codigos: CODIGOS, ms: 3 });
  assert.equal(e.nose, true); assert.equal(e.opcion, ''); assert.equal(e.error, ''); assert.equal(e.respaldo, '');
  const sinNose = L.ev.item({ fase: 'entrada', curso: 'razonamiento-verbal', modulo: 'lectura-verbal', forma: 'A', orden: 'AB', pregunta: q, resultado: L.calificar(q, 'A'), codigos: CODIGOS, ms: 3 });
  assert.ok(!('nose' in sinNose), 'una respuesta normal no lleva el campo');
  const rs = it.preguntas.map((x, k) => (k === 0 ? L.noSe(x) : L.calificar(x, x.alternativas.find(a => a.correcta).letra)));
  const p = L.ev.prueba({ fase: 'entrada', curso: 'razonamiento-verbal', forma: 'A', orden: 'AB', modulo: 'lectura-verbal', unidad: 'u', item: it, resultados: rs, ms: 9 });
  assert.equal(p.respuestas[0], '0');
  assert.equal(p.nose, 1);
  assert.equal(p.aciertos, it.preguntas.length - 1);
  // En el resumen por curso, «No sé» no aparece como error RV.
  const [c] = M.resumirCursos([{ alumno: 'x', ...e }, { alumno: 'x', ...p }]);
  assert.deepEqual(c.errores, []);
});
