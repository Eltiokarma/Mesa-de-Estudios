// Pruebas de la mascota en Node, sin DOM: nombres de pose, contrato Rive, registro y fichas (nucleo/mascota.js).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const M = require('./mascota.js');

const RAIZ = path.join(__dirname, '..');
const DIR = path.join(RAIZ, 'app', 'mascotas');
const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));

test('repertorio cerrado: ocho poses en el orden del contrato', () => {
  assert.deepEqual(M.POSES, ['reposo', 'saluda', 'señala', 'espera', 'celebra', 'acompaña', 'ayuda', 'hito']);
  assert.deepEqual(M.CONTRATO, { maquina: 'Mesa', pose: 'pose', reducido: 'reducido' });
});

test('normalizarPose acepta mayúsculas, espacios y la forma sin tilde ni ñ', () => {
  assert.equal(M.normalizarPose('señala'), 'señala');
  assert.equal(M.normalizarPose('senala'), 'señala');
  assert.equal(M.normalizarPose(' SEÑALA '), 'señala');
  assert.equal(M.normalizarPose('acompana'), 'acompaña');
  assert.equal(M.normalizarPose('Acompaña'), 'acompaña');
  assert.equal(M.normalizarPose('señala'), 'señala'); // ñ escrita como n + tilde combinada
  for (const malo of ['', 'baila', 'reposo2', null, undefined, 4, {}]) assert.equal(M.normalizarPose(malo), null);
});

test('numeroPose: 0 reposo … 7 hito, y -1 para lo desconocido', () => {
  const esperado = { reposo: 0, saluda: 1, señala: 2, senala: 2, espera: 3, celebra: 4, acompaña: 5, acompana: 5, ayuda: 6, hito: 7 };
  for (const [p, n] of Object.entries(esperado)) assert.equal(M.numeroPose(p), n, p);
  assert.equal(M.numeroPose('baila'), -1);
});

test('leerRegistro tolera lo que falta', () => {
  assert.deepEqual(M.leerRegistro(null), { porDefecto: null, mascotas: [], cursos: {} });
  assert.deepEqual(M.leerRegistro({ cursos: { fisica: 'llama' } }), { porDefecto: 'llama', mascotas: ['llama'], cursos: { fisica: 'llama' } });
  assert.deepEqual(M.leerRegistro({ porDefecto: 'gato', cursos: { fisica: 'llama' } }).mascotas, ['gato', 'llama']);
});

test('elegirMascota: la del curso si existe; si no, la de por defecto', () => {
  const r = { porDefecto: 'gato', mascotas: ['gato', 'llama'], cursos: { fisica: 'llama', quimica: 'fantasma' } };
  assert.equal(M.elegirMascota(r, 'fisica'), 'llama');
  assert.equal(M.elegirMascota(r, 'quimica'), 'gato');   // no está en la lista de mascotas
  assert.equal(M.elegirMascota(r, 'algebra'), 'gato');   // curso sin asignar
  assert.equal(M.elegirMascota(r, null), 'gato');
  assert.equal(M.elegirMascota(null, 'fisica'), null);
});

test('leerMascota: riv null → respaldo SVG; riv con ruta → usaRive y ruta resuelta', () => {
  const base = 'https://ejemplo.pe/app/mascotas/gato/';
  const sin = M.leerMascota({ id: 'gato', riv: null, respaldo: 'respaldo.svg' }, base);
  assert.equal(sin.usaRive, false);
  assert.equal(sin.riv, null);
  assert.equal(sin.respaldo, base + 'respaldo.svg');
  assert.equal(sin.maquina, 'Mesa');
  assert.deepEqual(sin.entradas, { pose: 'pose', reducido: 'reducido' });
  const con = M.leerMascota({ id: 'gato', riv: 'gato.riv', respaldo: 'respaldo.svg' }, base);
  assert.equal(con.usaRive, true);
  assert.equal(con.riv, base + 'gato.riv');
  assert.equal(M.leerMascota({ riv: '   ' }, base).usaRive, false);
  assert.equal(M.leerMascota({ riv: '/otro/x.riv' }, base).riv, '/otro/x.riv');
});

test('revisarContrato: máquina Mesa con pose numérica y reducido booleano', () => {
  const T = M.TIPO;
  const bien = [{ name: 'pose', type: T.numero }, { name: 'reducido', type: T.booleano }];
  assert.deepEqual(M.revisarContrato(['Mesa'], bien), { ok: true, problemas: [] });
  assert.equal(M.revisarContrato(['State Machine 1'], bien).ok, false);
  assert.match(M.revisarContrato([], []).problemas[0], /«Mesa»/);
  const r1 = M.revisarContrato(['Mesa'], [{ name: 'pose', type: T.disparo }]);
  assert.equal(r1.ok, false);
  assert.equal(r1.problemas.length, 2); // pose de otro tipo y falta reducido
  const def = M.leerMascota({ maquina: 'Gato', entradas: { pose: 'gesto' } }, 'x/');
  assert.equal(M.revisarContrato(['Gato'], [{ name: 'gesto', type: T.numero }, { name: 'reducido', type: T.booleano }], def).ok, true);
});

test('registro del repo: los 8 cursos del catálogo tienen una mascota que existe', () => {
  const reg = leer(path.join(DIR, 'registro.json'));
  const cursos = fs.readdirSync(path.join(RAIZ, 'catalogo', 'cursos')).filter(f => f.endsWith('.json')).map(f => leer(path.join(RAIZ, 'catalogo', 'cursos', f)).id);
  assert.equal(cursos.length, 8);
  for (const c of cursos) {
    assert.ok(reg.cursos[c], `el curso ${c} no está en el registro`);
    const id = M.elegirMascota(reg, c);
    assert.equal(id, reg.cursos[c], `${c}: la mascota «${reg.cursos[c]}» no está en la lista`);
    assert.ok(fs.existsSync(path.join(DIR, id, 'mascota.json')), `falta app/mascotas/${id}/mascota.json`);
  }
  assert.ok(reg.mascotas.includes(reg.porDefecto));
});

test('fichas del repo: respaldo con sus partes y .riv que existe si se declara', () => {
  const reg = leer(path.join(DIR, 'registro.json'));
  for (const id of reg.mascotas) {
    const json = leer(path.join(DIR, id, 'mascota.json'));
    assert.equal(json.id, id);
    assert.equal(json.maquina, 'Mesa', `${id}: la máquina debe llamarse Mesa`);
    const def = M.leerMascota(json, `file://${DIR}/${id}/`);
    assert.ok(def.respaldo, `${id}: falta el respaldo SVG`);
    const svg = fs.readFileSync(path.join(DIR, id, json.respaldo), 'utf8');
    assert.match(svg, /viewBox="0 0 120 120"/);
    for (const parte of ['m-salto', 'm-todo', 'm-cola', 'm-cabeza', 'm-oreja-i', 'm-oreja-d', 'm-ojos-felices', 'm-ojos-abiertos']) {
      assert.ok(svg.includes(`class="${parte}"`), `${id}: al respaldo le falta la parte ${parte}`);
    }
    assert.doesNotMatch(svg, /<script|on[a-z]+=|href=/i, `${id}: el respaldo no lleva scripts ni enlaces`);
    if (def.usaRive) assert.ok(fs.existsSync(path.join(DIR, id, json.riv)), `${id}: no existe ${json.riv}`);
  }
});

test('el gato de ejemplo empieza sin .riv (respaldo SVG)', () => {
  const g = M.leerMascota(leer(path.join(DIR, 'gato', 'mascota.json')), 'https://x/app/mascotas/gato/');
  assert.equal(g.usaRive, false);
});

test('mascota.css tiene un estado para cada pose (sin tilde ni ñ en data-pose)', () => {
  const css = fs.readFileSync(path.join(__dirname, 'mascota.css'), 'utf8');
  assert.match(css, /width: 72px; height: 72px/);
  for (const p of M.POSES.slice(1)) {
    const slug = p.normalize('NFD').replace(/[̀-ͯ]/g, '');
    assert.ok(css.includes(`[data-pose="${slug}"]`), `falta la pose ${slug} en mascota.css`);
  }
  assert.match(css, /prefers-reduced-motion: no-preference/);
});

test('el runtime de Rive está en local, con su licencia MIT', () => {
  const v = path.join(RAIZ, 'app', 'vendor', 'rive');
  for (const f of ['rive.js', 'rive.wasm', 'rive_fallback.wasm', 'LICENSE', 'LEEME.md']) assert.ok(fs.existsSync(path.join(v, f)), f);
  assert.match(fs.readFileSync(path.join(v, 'LICENSE'), 'utf8'), /MIT License/);
});
