// Pruebas de la animación automática (docs/3d.md §6) en las unidades de química de la ronda 5, parte A.
// El lector mueve el control con `auto` sin ajustarlo a su paso: dibujo y lectura reciben valores intermedios.
// Aquí se recorre cada control animado en 61 instantes (también entre pasos) y se exige que:
//   - el dibujo salga sano (sin NaN ni undefined) con su texto alternativo;
//   - la lectura cumpla su tope de 12 palabras y cambie a lo largo del recorrido (se mueve con la animación);
//   - las manijas de arrastre queden en números finitos;
//   - cada idea y la primera mesa del laboratorio tengan un control animado (salvo las que el reporte excusa).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../nucleo/teoria.js');
const Kit = require('../../nucleo/kit/kit.js');
const Ecuacion = require('../../nucleo/ecuacion.js');

const RAIZ = path.join(__dirname, '..', '..');
// Unidades de esta parte. A medida que se animan, se agregan aquí.
const UNIDADES = ['materia-y-energia', 'estructura-atomica', 'propiedades-periodicas', 'enlace-quimico', 'nomenclatura-inorganica', 'mol-y-composicion', 'reacciones-y-balance', 'estequiometria', 'gases', 'liquidos-y-solidos'];
// Ideas que de verdad no se prestan a animación (explicadas en rutinas/teoria5-quimica-a.md).
// Estructura atómica (18 nov, propuesta §5 aprobada): el juego espera al alumno, sin automático. Idea 1, la misión pide
// armar el carbono-14 a mano; ideas 3 y 4, la propuesta les quita el automático; ideas 2 y 6, sale el control «t» (el
// reloj de la animación, propuesta §1, punto 4); idea 5, la misión (el Na⁺) se cumpliría sola si Z se moviera solo.
const SIN_ANIMAR = new Set(['estructura-atomica/nucleo-identidad', 'estructura-atomica/modelos-atomicos', 'estructura-atomica/numeros-cuanticos',
  'estructura-atomica/configuracion-electronica', 'estructura-atomica/configuracion-iones', 'estructura-atomica/desapareados-isoelectronicos',
  // Propiedades periódicas (19 nov, etapa 5): las cuatro misiones son de buscar un elemento, un ion o un enlace en la
  // tabla; con un control que se mueve solo, la misión se cumpliría sin el alumno. Sus dos mesas sí se animan. Tabla
  // periódica sale de esta lista: sus cuatro juegos también son de buscar y sus mesas se fueron con Propiedades.
  'propiedades-periodicas/radio-atomico-ionico', 'propiedades-periodicas/radio-ionico',
  'propiedades-periodicas/energia-ionizacion', 'propiedades-periodicas/electronegatividad',
  // Enlace químico (19 nov, etapa 6): las cinco misiones son de buscar una sustancia, un compuesto o una molécula entre
  // opciones; con un control que se mueve solo, la misión se cumpliría sin el alumno. La mesa que giraba sola se fue con
  // Geometría molecular (unidad nueva, fuera de esta ronda).
  'enlace-quimico/tres-enlaces', 'enlace-quimico/enlace-ionico', 'enlace-quimico/lewis-octeto',
  'enlace-quimico/dativo-excepciones', 'enlace-quimico/resonancia',
  // Nomenclatura inorgánica (19 nov, etapa 7): las seis misiones son de buscar o armar un compuesto entre opciones (el EO
  // del N en el NH₄⁺, el óxido -oso, el H con −1, el oxácido con un H, la sal sin carga suelta, la sal con OH⁻); con un
  // control que se mueve solo, la misión se cumpliría sin el alumno.
  'nomenclatura-inorganica/estados-oxidacion', 'nomenclatura-inorganica/tres-nombres', 'nomenclatura-inorganica/peroxidos-hidruros',
  'nomenclatura-inorganica/arbol-funciones', 'nomenclatura-inorganica/sales', 'nomenclatura-inorganica/sales-acidas-basicas-hidratadas']);
// Unidades cuya primera mesa es de elegir entre opciones (sin un valor que recorrer). Enlace químico (etapa 6): sus dos
// mesas eligen átomos o la posición del doble enlace; la mesa que gira se fue con Geometría molecular.
// Nomenclatura inorgánica (etapa 7): sus dos mesas arman sales y eligen especies.
const LAB_SIN_ANIMAR = new Set(['enlace-quimico', 'nomenclatura-inorganica']);

function revisar(nombre, j, piezaPorDefecto) {
  const ctr = j.controles || [];
  const auto = ctr.find(c => c.auto && !c.opciones);
  assert.ok(auto, `${nombre}: sin control animado`);
  const base = Teoria.inicio(j);
  const lecturas = new Set();
  for (let i = 0; i <= 60; i++) {
    const v = Object.assign({}, base, { [auto.id]: Math.round((auto.min + (auto.max - auto.min) * i / 60) * 1e5) / 1e5 });
    const dib = j.dibujo(v);
    const P = Kit.piezas[j.pieza || piezaPorDefecto];
    assert.ok(P, `${nombre}: pieza ${j.pieza}`);
    const svg = P.dibujar(dib.datos, dib.estado || {});
    assert.ok(svg.includes('<svg'), `${nombre} ${auto.id}=${v[auto.id]}: sin SVG`);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `${nombre} ${auto.id}=${v[auto.id]}: el SVG muestra NaN`);
    assert.ok(P.alt(dib.datos).length >= 15, `${nombre}: alt corto`);
    if (j.lectura) {
      const l = j.lectura(v), txt = Ecuacion.texto(l);
      assert.ok(!/NaN|undefined|Infinity/.test(txt), `${nombre} ${auto.id}=${v[auto.id]}: lectura ${txt}`);
      assert.ok(Teoria.palabras(l) <= Teoria.PRESUPUESTO.lectura, `${nombre}: lectura de ${Teoria.palabras(l)} palabras: ${txt}`);
      lecturas.add(txt);
    }
    for (const a of j.arrastres || []) {
      const p = a.donde(v);
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${nombre}: manija ${a.id} no finita`);
    }
  }
  if (j.lectura) assert.ok(lecturas.size >= 2, `${nombre}: la lectura no se mueve con la animación`);
}

for (const u of UNIDADES) {
  test(`animación de quimica.${u}: cada idea y la primera mesa se mueven solas`, () => {
    const def = require(path.join(__dirname, 'quimica', `${u}.js`));
    for (const r of def.requiere || []) require(path.join(RAIZ, r));
    for (const idea of def.ideas) {
      if (SIN_ANIMAR.has(`${u}/${idea.id}`)) continue;
      revisar(`${u}/${idea.id}`, idea.juega, idea.pieza);
    }
    const mesa = (def.laboratorio || [])[0];
    assert.ok(mesa, `${u}: sin laboratorio`);
    if (LAB_SIN_ANIMAR.has(u)) return;
    revisar(`${u}/lab ${mesa.id}`, mesa, mesa.pieza);
  });
}
