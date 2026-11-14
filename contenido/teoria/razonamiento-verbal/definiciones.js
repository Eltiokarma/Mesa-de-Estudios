/*
 * Teoría de «Definiciones» (razonamiento-verbal.definiciones). Molde: docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js. Contenido: docs/teoria/matriz/razonamiento-verbal.json (unidad 1)
 * y docs/teoria/fuentes/historia-ecuaciones (verbal, Tópicos de Aristóteles). Textos y casos propios (regla 5).
 * Ruta C · Comparar: se ajusta la definición y se ve qué casos entran; la predicción es «¿este caso entra?».
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: elegir la definición que deja dentro todos los casos y fuera todos los vecinos.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin audio; definiciones de examen (UNI).
 *   Resultado observable: acepta ejemplos, rechaza contraejemplos y nombra el rasgo que decide.
 *   Orden de atención: 1.º la definición (tarjeta) · 2.º qué casos entran (marcas) · acción: cambiar un rasgo.
 *   Estados: definición amplia · estrecha · justa; caso que entra por error (h) o que queda fuera (h).
 *   Duda que resuelve: ¿por qué «animal que vuela» no define «ave», si casi todas vuelan?
 *
 * Colores (regla 4, en toda la unidad): género próximo d (verde, punteado), diferencia específica o (naranja,
 * discontinuo), caso que entra bien i (turquesa), caso mal clasificado h (rojo). Mismo color en control, texto,
 * figura y ecuación.
 * Códigos de error: RV56 (ejemplo en vez de definición) existe; RVD1–RVD4 son hipótesis nuevas (ver
 * rutinas/teoria-razonamiento-verbal.md).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): entre la definición y los casos hay una bandeja con los rasgos; el alumno
  // arrastra la ficha al rasgo que quiere poner en la definición. La manija va sobre el número del rasgo
  // (rv-texto.ancla) y salta al más cercano al dedo (rv-texto.cercana); los botones del control son la alternativa.
  const RV = () => Kit.piezas['rv-texto'];
  const manija = (id, control, datosDe, ids, etiqueta, color = 'c-o') => ({
    id, etiqueta, color,
    donde: val => RV().ancla(datosDe(val), val[control]),
    mover: (pt, val) => ({ [control]: RV().cercana(datosDe(val), pt, ids) }),
  });
  // La bandeja va entre la tarjeta de la definición y los casos (el sello de los casos no queda bajo la lupa).
  const conBandeja = (datos, titulo, items) => ({ secciones: [datos.secciones[0], { id: 'bandeja', titulo, modo: 'lista', fragmentos: items }, ...datos.secciones.slice(1)] });
  // Una lectura en vivo no parte línea dentro de un color (.var): si el texto es largo, solo va en color su cabeza.
  const corto = (fn, t) => {
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const gen = t => ({ v: 'c-d', t }), dif = t => ({ v: 'c-o', t }), bien = t => ({ v: 'c-i', t }), mal = t => ({ v: 'c-h', t });
  // Figura: una tarjeta con la definición (huecos para género y diferencia) y la lista numerada de casos.
  const figura = (concepto, casos, reserva = ['mueble para sentarse', 'con respaldo, para una persona']) => ({
    secciones: [
      { id: 'def', titulo: `Definición de «${concepto}»`, modo: 'tarjeta', fragmentos: [
        { id: 'g', hueco: true, reserva: reserva[0] }, { id: 'd', hueco: true, reserva: reserva[1] }] },
      { id: 'casos', titulo: 'Casos', modo: 'lista', fragmentos: casos.map((c, k) => ({ id: `c${k}`, t: c.nombre })) },
    ],
  });
  // Qué casos admite una definición (lista de rasgos): un caso entra si tiene todos los rasgos pedidos.
  const admite = (caso, rasgos) => rasgos.every(r => caso.rasgos.includes(r));
  // Marcas: i si la definición lo clasifica bien (dentro y es, o fuera y no es); h si se equivoca. Lo que queda
  // fuera bien se tacha suave; así se ve qué deja pasar la definición.
  function clasificar(casos, rasgos) {
    const marcas = {}, tachar = [];
    let errores = 0, dentro = 0;
    casos.forEach((c, k) => {
      const entra = admite(c, rasgos), ok = entra === c.es;
      if (entra) dentro++;
      if (!ok) errores++;
      if (entra) marcas[`c${k}`] = ok ? 'i' : 'h';
      else { if (!ok) marcas[`c${k}`] = 'h'; tachar.push(`c${k}`); }
    });
    return { marcas, tachar, errores, dentro };
  }
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    return () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  }
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];

  // ---------- Idea 1: clase cercana más rasgo que separa ----------
  // Cambia: el género y la diferencia de la definición. Permanece: los seis casos y su orden.
  // Progresa: cuántos casos clasifica bien (de 6). Se reserva: el caso que solo la diferencia completa separa
  // (la banca). Debe verse: qué casos entran por error con cada definición.
  const SILLAS = [
    { nombre: 'silla de comedor', es: true, rasgos: ['mueble', 'asiento', 'respaldo', 'una'] },
    { nombre: 'banca del parque', es: false, rasgos: ['mueble', 'asiento', 'respaldo'] },
    { nombre: 'taburete de cocina', es: false, rasgos: ['mueble', 'asiento', 'una'] },
    { nombre: 'silla plegable', es: true, rasgos: ['mueble', 'asiento', 'respaldo', 'una'] },
    { nombre: 'mesa de noche', es: false, rasgos: ['mueble'] },
    { nombre: 'silla de oficina con ruedas', es: true, rasgos: ['mueble', 'asiento', 'respaldo', 'una'] },
  ];
  const GENEROS = { mueble: { texto: 'mueble', rasgos: ['mueble'] }, asiento: { texto: 'mueble para sentarse', rasgos: ['mueble', 'asiento'] } };
  const DIFS = { nada: { texto: '(sin rasgo)', rasgos: [] }, respaldo: { texto: 'con respaldo', rasgos: ['respaldo'] }, completa: { texto: 'con respaldo, para una persona', rasgos: ['respaldo', 'una'] } };
  const dibujoSilla = (g, d, extra = {}) => {
    const r = clasificar(SILLAS, [...GENEROS[g].rasgos, ...DIFS[d].rasgos]);
    return {
      datos: figura('silla', SILLAS),
      estado: Object.assign({
        huecos: { g: GENEROS[g].texto, d: DIFS[d].texto }, marcas: Object.assign({ g: 'd', d: d === 'nada' ? undefined : 'o' }, r.marcas), tachar: r.tachar,
        sellos: { casos: r.errores ? { t: `${r.errores} mal ${r.errores === 1 ? 'ubicado' : 'ubicados'}`, c: 'h' } : { t: '6 de 6 bien', c: 'i' } },
      }, extra),
    };
  };
  // El juego dibuja la misma figura que «Mira» con la bandeja de rasgos en medio (hallazgo 9: mismo dibujo, más fichas).
  const figSillaB = () => conBandeja(figura('silla', SILLAS), 'Rasgos', Object.entries(DIFS).map(([id, d]) => ({ id, t: d.texto })));
  const generoDiferencia = {
    id: 'genero-diferencia',
    titulo: 'Clase cercana y rasgo que separa',
    temas: ['Género próximo', 'Diferencia específica'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Arma la definición de «silla»: elige la clase y el rasgo. Mira qué casos entran y cuáles quedan fuera.',
      voz: 'Fíjate en los casos rojos: entran sin ser sillas o quedan fuera siéndolo.',
      controles: [
        { id: 'g', etiqueta: 'Clase', opciones: [{ valor: 'mueble', texto: 'mueble' }, { valor: 'asiento', texto: 'mueble para sentarse' }] },
        { id: 'd', etiqueta: 'Rasgo', opciones: [{ valor: 'nada', texto: 'ninguno' }, { valor: 'respaldo', texto: 'con respaldo' }, { valor: 'completa', texto: 'con respaldo, para una persona' }] },
      ],
      dibujo: val => { const d = dibujoSilla(val.g, val.d); return { datos: figSillaB(), estado: Object.assign(d.estado, { marcas: Object.assign(d.estado.marcas, { [val.d]: 'o' }) }) }; },
      lectura: val => {
        const r = clasificar(SILLAS, [...GENEROS[val.g].rasgos, ...DIFS[val.d].rasgos]);
        return r.errores ? [`Entran ${r.dentro} casos · `, mal(`${r.errores} mal ${r.errores === 1 ? 'ubicado' : 'ubicados'}`)] : [bien('Entran justo las 3 sillas')];
      },
      minimo: 3,
      // Arrastra la ficha por la bandeja: el rasgo donde la sueltas entra en la definición.
      arrastres: [manija('rasgo', 'd', figSillaB, Object.keys(DIFS), 'ficha del rasgo')],
    },
    predice: {
      pregunta: 'Ahora el concepto es «taburete». ¿Qué definición deja dentro solo al taburete de la lista?',
      voz: 'Antes de comprobar, piensa qué vecino se cuela con cada una.',
      opciones: opciones('Mueble para sentarse, sin respaldo, para una persona', [
        ['Mueble para sentarse, para una persona', 'RVD2', 'Esa clase es buena, pero falta el rasgo: también entran las tres sillas.'],
        ['Mueble sin respaldo', 'RVD2', '«Sin respaldo» separa bien de las sillas; con «mueble», también entra la mesa de noche.'],
        ['El que está en la cocina de mi casa', 'RV56', 'Un ejemplo ayuda a imaginarlo, pero no dice qué rasgos tiene todo taburete.'],
      ]),
      dibujo: { datos: figura('taburete', SILLAS, ['mueble para sentarse', 'sin respaldo, para una persona']), estado: { huecos: {} } },
      revelar: {
        datos: figura('taburete', SILLAS, ['mueble para sentarse', 'sin respaldo, para una persona']),
        estado: { huecos: { g: 'mueble para sentarse', d: 'sin respaldo, para una persona' }, marcas: { g: 'd', d: 'o', c2: 'i' }, tachar: ['c0', 'c1', 'c3', 'c4', 'c5'], sellos: { casos: { t: 'Solo el taburete', c: 'i' } } },
      },
      coincide: 'Coincide: la clase deja fuera la mesa y los dos rasgos dejan fuera las sillas y la banca.',
    },
    mira: {
      datos: figura('silla', SILLAS),
      voz: 'Cada paso agrega una sola pieza de la definición.',
      pasos: [
        { estado: dibujoSilla('mueble', 'nada').estado, texto: 'Con «mueble» entran los seis: la clase sola es demasiado amplia.', ecuacion: [gen('mueble'), ' → 3 mal ubicados'] },
        { estado: dibujoSilla('asiento', 'nada', { nuevo: ['c4', 'g'] }).estado, texto: 'La clase más cercana, «para sentarse», deja fuera la mesa.', ecuacion: [gen('mueble para sentarse'), ' → 2 mal ubicados'] },
        { estado: dibujoSilla('asiento', 'respaldo', { nuevo: ['c2', 'd'] }).estado, texto: '«Con respaldo» saca el taburete, pero la banca sigue dentro.', ecuacion: [gen('para sentarse'), ' + ', dif('con respaldo'), ' → 1'] },
        { estado: dibujoSilla('asiento', 'completa', { nuevo: ['c1', 'd'] }).estado, texto: '«Para una persona» saca la banca: quedan justo las sillas.', ecuacion: [gen('para sentarse'), ' + ', dif('respaldo, una persona'), ' → 0'] },
      ],
    },
    regla: {
      texto: 'Una definición ubica el concepto en su clase más cercana (género próximo) y agrega los rasgos que lo separan de sus vecinos (diferencia específica).',
      ecuacion: ['definición = ', { llave: [gen('género próximo')], nota: 'su clase', color: 'c-d' }, ' + ', { llave: [dif('diferencia específica')], nota: 'lo que separa', color: 'c-o' }],
      condicion: 'la clase es la más cercana que lo contiene, y los rasgos están en todos sus casos y en ningún vecino.',
      voz: 'Comprueba siempre con un vecino: si se cuela, falta un rasgo.',
    },
    ahoraTu: {
      voz: 'Busca el vecino que se colaría con cada opción.',
      generar(s) {
        const B = [
          { c: 'bicicleta', g: 'vehículo de dos ruedas', d: 'con pedales', v: 'moto, triciclo', ok: 'Vehículo de dos ruedas que se mueve con pedales', m: [['Vehículo de dos ruedas', 'RVD2', 'Es la clase correcta, pero también entra la moto: falta «con pedales».'], ['Vehículo que se mueve con pedales', 'RVD2', 'Separa de la moto, pero también entra el triciclo.'], ['Como la que uso para ir al colegio', 'RV56', 'Un ejemplo no dice qué rasgos tiene toda bicicleta.']] },
          { c: 'lápiz', g: 'instrumento para escribir', d: 'con grafito', v: 'lapicero, plumón', ok: 'Instrumento para escribir con una barra de grafito', m: [['Instrumento para escribir', 'RVD2', 'Es su clase, pero también entran el lapicero y el plumón.'], ['Objeto amarillo y largo', 'RVD1', 'Muchos lápices lo son, pero no todos: ese rasgo es frecuente, no necesario.'], ['El que se usa en la clase de dibujo', 'RV56', 'Eso es un uso de ejemplo, no los rasgos que lo separan.']] },
          { c: 'río', g: 'corriente de agua', d: 'continua, desemboca', v: 'lago, arroyo de una semana de lluvia', ok: 'Corriente de agua continua que desemboca en otra', m: [['Agua que hay en la sierra', 'RVD1', 'Hay ríos en la sierra, pero también en la costa y la selva.'], ['Masa de agua', 'RVD2', 'Es su clase, pero también entra el lago.'], ['Como el Amazonas', 'RV56', 'El Amazonas es un caso; no dice qué tienen todos los ríos.']] },
          { c: 'reloj', g: 'instrumento que mide el tiempo', d: 'muestra la hora', v: 'calendario, cronómetro', ok: 'Instrumento que mide y muestra la hora del día', m: [['Instrumento que mide el tiempo', 'RVD2', 'Es su clase, pero también entra el cronómetro, que no da la hora.'], ['Objeto redondo con agujas', 'RVD1', 'Muchos relojes lo son, pero los digitales no tienen agujas.'], ['Lo que llevo en la muñeca', 'RV56', 'Es un ejemplo de reloj; no dice qué rasgos tienen todos.']] },
          { c: 'cuaderno', g: 'hojas unidas', d: 'en blanco, para escribir', v: 'libro, hoja suelta', ok: 'Conjunto de hojas en blanco unidas para escribir', m: [['Conjunto de hojas unidas', 'RVD2', 'Es su clase, pero también entra el libro, que ya viene escrito.'], ['Objeto de tapa azul', 'RVD1', 'Algunos cuadernos son azules; ese rasgo no está en todos.'], ['El de matemática de mi mochila', 'RV56', 'Es un caso concreto; no dice qué tienen todos los cuadernos.']] },
          { c: 'puente', g: 'construcción para pasar', d: 'por encima', v: 'túnel, carretera', ok: 'Construcción que permite pasar por encima de un río o un vacío', m: [['Construcción para pasar de un lado a otro', 'RVD2', 'Es su clase, pero también entra el túnel, que pasa por debajo.'], ['Construcción de piedra antigua', 'RVD1', 'Algunos puentes lo son; hay puentes de acero y de madera.'], ['Como el de mi pueblo', 'RV56', 'Es un caso; no dice qué rasgo comparten todos los puentes.']] },
        ];
        const b = B[s % B.length], r = azar(s)();
        const malas = b.m.slice();
        if (r < 0.5) malas.reverse();
        return {
          pregunta: `¿Qué definición de «${b.c}» deja dentro todos sus casos y fuera a sus vecinos?`,
          dibujo: { datos: { secciones: [{ id: 'v', titulo: `Vecinos de «${b.c}»`, modo: 'tarjeta', fragmentos: b.v.split(', ').map((t, k, a) => ({ id: `v${k}`, t: k < a.length - 1 ? `${t},` : t })) }] }, estado: {} },
          opciones: opciones(b.ok, malas),
          solucion: { texto: `La clase cercana más el rasgo que ningún vecino tiene.`, ecuacion: [gen(b.g), ' + ', dif(b.d)] },
        };
      },
    },
  };

  // ---------- Idea 2: rasgo necesario, no frecuente ----------
  // Cambia: el rasgo que define «ave». Permanece: los seis animales. Progresa: aves dejadas fuera y animales
  // colados. Se reserva: el rasgo «pone huevos», necesario pero no suficiente (la predicción). Debe verse: el
  // pingüino fuera y el murciélago dentro con «vuela».
  const AVES = [
    { nombre: 'gorrión', es: true, rasgos: ['vuela', 'plumas', 'huevos', 'pico'] },
    { nombre: 'pingüino', es: true, rasgos: ['plumas', 'huevos', 'pico'] },
    { nombre: 'murciélago', es: false, rasgos: ['vuela'] },
    { nombre: 'avestruz', es: true, rasgos: ['plumas', 'huevos', 'pico'] },
    { nombre: 'tortuga', es: false, rasgos: ['huevos', 'pico'] },
    { nombre: 'cóndor', es: true, rasgos: ['vuela', 'plumas', 'huevos', 'pico'] },
  ];
  const RASGOS = { vuela: 'animal que vuela', plumas: 'animal con plumas', pico: 'animal con pico', huevos: 'animal que pone huevos' };
  const figAve = () => ({
    secciones: [
      { id: 'def', titulo: 'Definición de «ave»', modo: 'tarjeta', fragmentos: [{ id: 'r', hueco: true, reserva: 'animal que pone huevos' }] },
      { id: 'casos', titulo: 'Casos', modo: 'lista', fragmentos: AVES.map((c, k) => ({ id: `c${k}`, t: c.nombre })) },
    ],
  });
  const RASGOS_J = ['vuela', 'pico', 'plumas'];
  const figAveB = () => conBandeja(figAve(), 'Rasgos', RASGOS_J.map(id => ({ id, t: RASGOS[id] })));
  const dibujoAve = (rasgo, extra = {}) => {
    const r = clasificar(AVES, [rasgo]);
    return { datos: figAve(), estado: Object.assign({ huecos: { r: RASGOS[rasgo] }, marcas: Object.assign({ r: 'o' }, r.marcas), tachar: r.tachar, sellos: { casos: r.errores ? { t: `${r.errores} mal ${r.errores === 1 ? 'ubicado' : 'ubicados'}`, c: 'h' } : { t: '6 de 6 bien', c: 'i' } } }, extra) };
  };
  const cuentaAve = rasgo => {
    const fuera = AVES.filter(c => c.es && !admite(c, [rasgo])).length, colados = AVES.filter(c => !c.es && admite(c, [rasgo])).length;
    return { fuera, colados };
  };
  const rasgoNecesario = {
    id: 'rasgo-necesario',
    titulo: 'Necesario, no solo frecuente',
    temas: ['Rasgos mínimos de significado'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Define «ave» con un solo rasgo. Prueba cada uno y mira qué aves quedan fuera y qué animales se cuelan.',
      voz: 'Un rasgo puede ser común y aun así fallar.',
      controles: [{ id: 'r', etiqueta: 'Rasgo', opciones: [{ valor: 'vuela', texto: 'vuela' }, { valor: 'pico', texto: 'tiene pico' }, { valor: 'plumas', texto: 'tiene plumas' }] }],
      dibujo: val => { const d = dibujoAve(val.r); return { datos: figAveB(), estado: Object.assign(d.estado, { marcas: Object.assign(d.estado.marcas, { [val.r]: 'o' }) }) }; },
      // Arrastra la ficha a otro rasgo: la definición cambia y los casos se reclasifican.
      arrastres: [manija('rasgo', 'r', figAveB, RASGOS_J, 'ficha del rasgo')],
      lectura: val => { const c = cuentaAve(val.r), tono = n => (n ? mal : bien); return [tono(c.fuera)(`${c.fuera} ${c.fuera === 1 ? 'ave' : 'aves'} fuera`), ' · ', tono(c.colados)(`${c.colados} ${c.colados === 1 ? 'colado' : 'colados'}`)]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Todas las aves ponen huevos. Si la definición fuera «animal que pone huevos», ¿qué pasaría con la lista?',
      opciones: opciones('Entran las cuatro aves, y también la tortuga', [
        ['Entran justo las cuatro aves', 'RVD3', 'Es cierto que ninguna ave queda fuera; pero la tortuga también pone huevos.'],
        ['Quedan fuera el pingüino y el avestruz', 'RVD1', 'Eso pasaba con «vuela». Poner huevos sí lo hacen todas las aves.'],
        ['Entran todos los animales de la lista', 'RVD2', 'Sería cierto si el murciélago pusiera huevos; es un mamífero y no los pone.'],
      ]),
      dibujo: { datos: figAve(), estado: { huecos: { r: RASGOS.huevos }, marcas: { r: 'o' } } },
      revelar: dibujoAve('huevos'),
      coincide: 'Coincide: el rasgo está en todas las aves, pero no basta para dejar fuera a la tortuga.',
    },
    mira: {
      datos: figAve(),
      voz: 'Compara qué falla en cada rasgo.',
      pasos: [
        { estado: dibujoAve('vuela', { nuevo: ['c1', 'c2', 'c3'] }).estado, texto: '«Vuela» es frecuente, no necesario: deja fuera pingüino y avestruz.', ecuacion: [dif('vuela'), ': ', mal('2 fuera'), ', ', mal('1 colado')] },
        { estado: dibujoAve('huevos', { nuevo: ['c4'] }).estado, texto: '«Pone huevos» es necesario, pero no suficiente: se cuela la tortuga.', ecuacion: [dif('pone huevos'), ': ', mal('0 fuera'), ', ', mal('1 colado')] },
        { estado: dibujoAve('plumas', { nuevo: ['c4'] }).estado, texto: '«Tiene plumas» está en todas las aves y en ningún otro animal.', ecuacion: [dif('plumas'), ': ', bien('6 de 6 bien')] },
      ],
    },
    regla: {
      texto: 'Un rasgo mínimo está en todos los casos del concepto (necesario). Los rasgos elegidos, juntos, dejan fuera a todo lo demás (suficiente). Lo frecuente y el ejemplo no definen.',
      ecuacion: [{ llave: [bien('todos los casos'), ' lo tienen'], nota: 'necesario', color: 'c-i' }, '   ·   ', { llave: [mal('ningún vecino'), ' lo tiene'], nota: 'suficiente', color: 'c-h' }],
      condicion: 'se prueba contra un caso raro del concepto (el pingüino) y contra un vecino parecido (la tortuga).',
    },
    ahoraTu: {
      voz: 'Piensa en un caso raro y en un vecino parecido.',
      generar(s) {
        const B = [
          { c: 'pez', casos: 'sardina, caballito de mar, pez payaso', ok: 'Respira por branquias', m: [['Vive en el mar', 'RVD1', 'Muchos peces son de mar, pero la trucha vive en ríos y lagos.'], ['Nada', 'RVD3', 'Todos los peces nadan, pero también el delfín, que no es pez.'], ['Es como la sardina', 'RV56', 'La sardina es un caso; no dice qué rasgo tienen todos.']] },
          { c: 'triángulo', casos: 'equilátero, rectángulo, obtusángulo', ok: 'Tiene exactamente tres lados', m: [['Tiene un ángulo recto', 'RVD1', 'Algunos triángulos lo tienen; el equilátero no.'], ['Es una figura con lados rectos', 'RVD3', 'Todo triángulo la cumple, pero también el cuadrado.'], ['Es como una tajada de pizza', 'RV56', 'Es un ejemplo que se le parece; no dice el rasgo.']] },
          { c: 'mamífero', casos: 'perro, ballena, murciélago', ok: 'Alimenta a sus crías con leche', m: [['Tiene cuatro patas', 'RVD1', 'Muchos las tienen; la ballena y el murciélago, no.'], ['Respira aire', 'RVD3', 'Todos respiran aire, pero también las aves y los reptiles.'], ['Es como el perro', 'RV56', 'El perro es un caso; no dice qué comparten todos.']] },
          { c: 'insecto', casos: 'hormiga, mariposa, escarabajo', ok: 'Tiene seis patas y el cuerpo en tres partes', m: [['Tiene alas', 'RVD1', 'Muchos insectos vuelan; la hormiga obrera no tiene alas.'], ['Es un animal pequeño', 'RVD3', 'Los insectos lo son, pero también la lagartija.'], ['Es como la mosca', 'RV56', 'La mosca es un caso; no da el rasgo que comparten.']] },
          { c: 'fruta', casos: 'mango, tomate, palta', ok: 'Parte de la planta que nace de la flor y guarda semillas', m: [['Es dulce', 'RVD1', 'Muchas lo son; la palta y el tomate, no.'], ['Es una parte de la planta que se come', 'RVD3', 'Las frutas lo son, pero también la papa, que es tallo.'], ['Es como la manzana', 'RV56', 'Es un caso; no dice el rasgo de todas.']] },
          { c: 'instrumento musical', casos: 'quena, charango, cajón', ok: 'Objeto hecho para producir sonidos musicales', m: [['Tiene cuerdas', 'RVD1', 'El charango las tiene; la quena y el cajón, no.'], ['Hace ruido', 'RVD3', 'Todos suenan, pero también una puerta que se cierra.'], ['Es como la guitarra', 'RV56', 'La guitarra es un caso; no dice qué tienen todos.']] },
        ];
        const b = B[s % B.length];
        const malas = s % 3 ? b.m.slice().reverse() : b.m.slice();
        return {
          pregunta: `¿Qué rasgo tienen todos los casos de «${b.c}» y, además, lo separa de lo que no es ${b.c}?`,
          dibujo: { datos: { secciones: [{ id: 'k', titulo: `Algunos casos de «${b.c}»`, modo: 'tarjeta', fragmentos: b.casos.split(', ').map((t, k, a) => ({ id: `k${k}`, t: k < a.length - 1 ? `${t},` : t })) }] }, estado: {} },
          opciones: opciones(b.ok, malas),
          solucion: { texto: 'Está en todos los casos, incluso los raros, y en ningún vecino.', ecuacion: [bien('necesario'), ' + ', dif('suficiente')] },
        };
      },
    },
  };

  // ---------- Laboratorio: dos rasgos a la vez ----------
  // Más rico que la idea 2: la definición junta dos rasgos (o uno, con «ninguno») y la lista suma el ornitorrinco,
  // un mamífero con pico que pone huevos: el caso raro que la idea no deja probar. El código cuenta, con los rasgos
  // de cada animal (regla 1), cuántas aves entran y cuántos vecinos se cuelan.
  const ANIMALES = AVES.concat([{ nombre: 'ornitorrinco', es: false, rasgos: ['huevos', 'pico'] }]);
  const PIEZAS = { ninguno: 'ninguno', vuela: 'vuela', pico: 'tiene pico', plumas: 'tiene plumas', huevos: 'pone huevos' };
  const rasgosDe = val => [...new Set([val.a, val.b].filter(x => x !== 'ninguno'))];
  const figDos = () => ({ secciones: [
    { id: 'def', titulo: 'Definición de «ave»', modo: 'tarjeta', fragmentos: [{ id: 'r', hueco: true, reserva: 'tiene plumas y pone huevos' }] },
    { id: 'bandeja', titulo: 'Rasgos', modo: 'lista', fragmentos: Object.entries(PIEZAS).map(([id, t]) => ({ id, t })) },
    { id: 'casos', titulo: 'Casos', modo: 'lista', fragmentos: ANIMALES.map((c, k) => ({ id: `c${k}`, t: c.nombre })) },
  ] });
  const textoDef = val => { const rs = rasgosDe(val); return rs.length ? rs.map(r => PIEZAS[r]).join(' y ') : 'animal'; };
  const mesaDos = {
    id: 'dos-rasgos', titulo: 'Dos rasgos a la vez', pieza: 'rv-texto',
    consigna: 'Arrastra las dos fichas a los rasgos de la definición de «ave». Busca la que deja dentro las cuatro aves y fuera a los demás.',
    voz: 'Mira qué hace el ornitorrinco con cada par.',
    controles: [
      { id: 'a', etiqueta: 'Rasgo 1', opciones: Object.entries(PIEZAS).map(([valor, texto]) => ({ valor, texto })), inicio: 'huevos' },
      { id: 'b', etiqueta: 'Rasgo 2', opciones: Object.entries(PIEZAS).map(([valor, texto]) => ({ valor, texto })), inicio: 'pico' },
    ],
    dibujo: val => {
      const r = clasificar(ANIMALES, rasgosDe(val)), n = ANIMALES.length;
      return { datos: figDos(), estado: { huecos: { r: textoDef(val) }, marcas: Object.assign({ r: 'o', [val.a]: 'o', [val.b]: 'd' }, r.marcas), tachar: r.tachar, sellos: { casos: r.errores ? { t: `${r.errores} mal ${r.errores === 1 ? 'ubicado' : 'ubicados'}`, c: 'h' } : { t: `${n} de ${n} bien`, c: 'i' } } } };
    },
    lectura: val => {
      const rs = rasgosDe(val), dentro = ANIMALES.filter(c => c.es && admite(c, rs)).length, colados = ANIMALES.filter(c => !c.es && admite(c, rs)).length;
      const tono = (n, ok) => (ok ? bien : mal)(n);
      // La definición va sin color: un trozo de color no se parte y, largo, desborda la miniatura del caso guardado.
      return [`${textoDef(val)}: `, tono(`${dentro} de ${ANIMALES.filter(c => c.es).length} aves`, dentro === ANIMALES.filter(c => c.es).length), ' · ', tono(`${colados} ${colados === 1 ? 'colado' : 'colados'}`, colados === 0)];
    },
    arrastres: [
      manija('rasgo-1', 'a', figDos, Object.keys(PIEZAS), 'primera ficha de rasgo'),
      manija('rasgo-2', 'b', figDos, Object.keys(PIEZAS), 'segunda ficha de rasgo', 'c-d'),
    ],
  };

  return {
    unidad: 'razonamiento-verbal.definiciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En los Tópicos, en la Grecia del siglo IV a. C., Aristóteles estudió cómo discutir una definición y encontrar sus defectos: podía quedar demasiado amplia, demasiado estrecha o poco clara. Relacionó la clase con las diferencias que separan una especie de otra. Enumerar cualidades llamativas no basta para delimitar un concepto.',
      pregunta: '¿Cómo sabrías si una definición se queda corta?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Aristóteles, Tópicos)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/comprensionlectora.htm' },
    },
    laboratorio: [
      mesaDos,
      Object.assign({ id: 'silla', titulo: 'Arma la silla', pieza: 'rv-texto' }, generoDiferencia.juega),
      Object.assign({ id: 'un-rasgo', titulo: 'Un solo rasgo', pieza: 'rv-texto' }, rasgoNecesario.juega),
    ],
    ideas: [generoDiferencia, rasgoNecesario],
  };
});
