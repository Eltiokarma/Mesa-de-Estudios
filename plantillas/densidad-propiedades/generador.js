/*
 * Generador «Lo que no cambia al partir»: práctica de la idea 2 de «Materia y energía» (quimica.materia-y-energia;
 * contenido/teoria/quimica/materia-y-energia.js, idea «propiedades»): densidad, propiedades intensivas y extensivas, y
 * separación de mezclas. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['densidad-propiedades']) y en Node (require). No usa ningún motor: ρ = m / V y sus despejes, y
 * una tabla de propiedades (intensiva o extensiva) y de métodos de separación, las mismas de la teoría.
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   densidad   (1) balanza y probeta: ρ = m / (lectura final − lectura inicial)
 *   intensiva  (1) se parte un objeto en dos: ¿qué propiedad queda igual?, o ¿cuál se parte a la mitad?
 *   liquido    (2) sub masa: la masa de unos litros de un líquido; sub volumen: el volumen, en mL, de unos gramos
 *   separar    (2) el método para separar una mezcla (filtración, decantación, destilación, evaporación, imantación)
 *   cubo       (3) un cubo de lado en cm y masa en kg: ρ en g/cm³
 *   barra      (3) una barra se corta en partes iguales: masa y densidad de cada parte
 *   contar     (3) como San Marcos: cuántas de una lista son intensivas
 * _datos: densidad { tipo, nivel, objeto, m (g), V (cm³), v0 (mL) }; intensiva { tipo, nivel, material, pide: 'igual' |
 *   'mitad', lista }; liquido { tipo, sub, nivel, liquido, rho (g/mL), litros | masa (g) }; separar { tipo, nivel, caso };
 *   cubo { tipo, nivel, metal, rho, lado (cm), kg }; barra { tipo, nivel, m (g), V (cm³), partes };
 *   contar { tipo, nivel, lista }.
 * Respuestas: densidad, liquido y cubo, un número (g/cm³, g o mL); contar, un número; intensiva, 'prop:<nombre>';
 *   separar, 'metodo:<id>'; barra, 'parte:<m>|<ρ>'.
 *
 * Colores: un color fijo por magnitud, el de la teoría (docs/molde-unidad.md §5b; tabla COLOR, que compara
 * plantillas/materia-energia/colores.test.js): la masa, naranja (o), también cuando es lo que se pide; el volumen y el
 * lado, turquesa (i); la densidad, violeta (f). La palabra dice cuál es la pedida. Sin figura.
 * Datos (docs/plan-calidad.md §3, punto 13): ρ = m / V, 1 mL = 1 cm³, 1 L = 1000 mL, 1 kg = 1000 g, el volumen del
 * cubo y la densidad de cada líquido con «unos» (valores de libro: aceite 0,92; alcohol 0,79; leche 1,03; miel 1,4
 * g/mL); las definiciones de intensiva y extensiva; los métodos entre los que se elige. Nunca la densidad del metal que
 * se pide.
 * Errores: Q4 (la temperatura depende de la cantidad; docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md)
 *   y AT1 (lo que se mide depende de cuánto hay, como en la teoría; docs/investigacion/atomo-enlace-ideas-erroneas.md),
 *   con respaldo parcial; trampas de unidades QU1 (masa sin convertir) y QU2 (volumen sin convertir), de
 *   docs/investigacion/unidades-ideas-erroneas.md; los de la teoría QM-RHO-INVIERTE, QM-RHO-PRODUCTO, QM-PROBETA,
 *   QM-COMO-AGUA, QM-FILTRA-DISUELTO, QM-DECANTA-MISCIBLE y QM-METODO, y los nuevos QM-PROBETA-INICIAL (divide entre
 *   la lectura de antes), QM-AREA y QM-LADO (el volumen del cubo como lado² o como lado), QM-PARTE-DENSIDAD (también
 *   parte la densidad) y QM-CONTEO, todos hipótesis.
 * Escala: un distractor va de 1/20 a 20 veces la correcta; las trampas QU, hasta 1000 (nucleo/predicciones.js).
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'densidad-propiedades';
  const FUN = 'docs/investigacion/unidades-ideas-erroneas.md';
  const FCAL = 'docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md';
  const FAT = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const FUENTE = { Q4: FCAL, AT1: FAT };
  const err = (id, explicacion) => {
    if (FUENTE[id]) return { id, explicacion, respaldo: 'parcial', fuente: FUENTE[id] };
    if (P.esUnidades(id)) return { id, explicacion, respaldo: 'hipotesis', fuente: FUN };
    return { id, explicacion, respaldo: 'hipotesis', fuente: null };
  };
  const e = (valor, id, explicacion) => ({ valor, ...err(id, explicacion) });
  const v = P.v;
  const limpio = x => Number(x.toPrecision(12));
  const f = (x, d = 2) => P.formatear(limpio(x), d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  const lista = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  const May = s => s[0].toUpperCase() + s.slice(1);
  // Una densidad, con los decimales que hacen falta (los mismos en la alternativa y en su explicación).
  const fr = x => f(x, x < 0.01 ? 6 : x < 1 ? 3 : 2);

  // Un color fijo por magnitud (docs/molde-unidad.md §5b): la tabla de la unidad, copia de `colores` de la teoría
  // (contenido/teoria/quimica/materia-y-energia.js). La práctica carga solo este archivo, así que la tabla va copiada;
  // plantillas/materia-energia/colores.test.js comprueba que coincida. Cada variable dice su magnitud (`mag`).
  const COLOR = { masa: 'o', volumen: 'i', longitud: 'i', densidad: 'f', calor: 'f', 'por gramo': 'i', temperatura: 'd', energía: 'f', luz: 'i',
    'energía de un balón': 'd', balones: 'h', tiempo: 'i', 'vida media': 'f', 'vidas medias': 'h', factor: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });

  // ---- Datos (las mismas líneas de la teoría) ----
  const DEF_RHO = 'Densidad: ρ = m / V';
  const DEF_ML = '1 mL = 1 cm³';
  const DEF_SUBE = 'El volumen de un objeto es lo que sube el agua al meterlo';
  const DEF_INT = 'Propiedad intensiva: no depende de cuánta muestra hay';
  const DEF_EXT = 'Propiedad extensiva: depende de cuánta muestra hay';

  // Arma las alternativas numéricas: errores dentro de escala (1/20 a 20; QU, hasta 1000) y distintos de la correcta.
  function numericas(rng, correcta, errores, texto) {
    const ok = errores.filter(x => Number.isFinite(x.valor) && x.valor > 0 && P.enEscala(x.valor, correcta, x.id));
    return P.armar({ correcta, errores: ok, rng, texto });
  }

  // ---- densidad: balanza y probeta chica ----
  const OBJETOS = [
    { id: 'canica', nombre: 'una canica de vidrio', rho: 2.5 }, { id: 'piedrita', nombre: 'una piedrita de río', rho: 2.7 },
    { id: 'clavo', nombre: 'un clavo de hierro', rho: 7.9 }, { id: 'tuerca', nombre: 'una tuerca de cobre', rho: 8.9 },
    { id: 'anillo', nombre: 'un anillo de plata', rho: 10.5 }, { id: 'plomada', nombre: 'una plomada de pesca', rho: 11.3 },
    { id: 'pepita', nombre: 'una pepita de oro', rho: 19.3 }, { id: 'tornillo', nombre: 'un tornillo de aluminio', rho: 2.7 },
  ];
  function tDensidad(rng) {
    const o = rng.elegir(OBJETOS), V = rng.elegir([2, 3, 4]), v0 = rng.elegir([10, 15, 20]), m = limpio(o.rho * V), v1 = v0 + V;
    const correcta = limpio(m / V);
    const errores = [
      e(m / v1, 'QM-PROBETA', `Dividir la masa está bien. Pero la lectura final incluye el agua que ya había: el volumen del objeto es solo lo que subió. Así hiciste ${f(m)} ÷ ${v1} = ${fr(m / v1)}.`),
      e(m / v0, 'QM-PROBETA-INICIAL', `Dividir la masa está bien. Pero la lectura de antes es el agua sola, sin el objeto: su volumen es lo que subió el agua. Así hiciste ${f(m)} ÷ ${v0} = ${fr(m / v0)}.`),
      e(V / m, 'QM-RHO-INVIERTE', `El volumen, ${V} cm³, está bien. Pero la densidad dice cuántos gramos hay en cada cm³, así que va la masa entre el volumen: ${V} ÷ ${f(m)} = ${fr(V / m)} es al revés.`),
      e(m * V, 'QM-RHO-PRODUCTO', `La masa y el volumen están bien. Pero para saber cuántos gramos tocan a cada cm³ se reparte la masa: se divide, y ${f(m)} × ${V} = ${fr(m * V)} multiplica.`),
    ];
    return {
      variables: { m: va('masa', 'masa'), V: va('volumen', 'volumen'), r: va('densidad (lo que se pide)', 'densidad') },
      enunciado: ['La balanza marca ', v('m', `${f(m)} g`), ` para ${o.nombre}. Al meter el objeto en una probeta, el agua sube de ${v0} mL a ${v1} mL.`],
      pregunta: ['¿Cuál es su ', v('r', 'densidad'), '?'], datos: [DEF_RHO, DEF_ML, DEF_SUBE],
      alternativas: numericas(rng, correcta, errores, x => `${fr(x)} g/cm³`), respuesta: { valor: correcta, unidad: 'g/cm³' },
      solucion: [
        ['El volumen del objeto es lo que subió el agua en la probeta: ', `${v1} − ${v0} = `, v('V', `${V} cm³`), '.'],
        ['ρ = m / V = ', v('m', `${f(m)} g`), ' ÷ ', v('V', `${V} cm³`), ' = ', v('r', `${f(correcta)} g/cm³`), '.'],
        [`Comprobación: ${f(correcta)} × ${V} = ${f(m)} g, lo que marca la balanza.`],
      ],
      _datos: { tipo: 'densidad', nivel: 1, objeto: o.id, m, V, v0 },
    };
  }

  // ---- intensiva: ¿qué queda igual al partir? ----
  const EXT = ['masa', 'volumen', 'peso', 'longitud'];
  const INT = ['densidad', 'temperatura de fusión', 'color', 'dureza', 'olor', 'brillo', 'temperatura'];
  const MATERIAL = ['un trozo de cobre', 'un queso', 'una barra de chocolate', 'un trozo de hielo', 'una vela', 'un ladrillo'];
  const articulo = x => (['masa', 'densidad', 'temperatura de fusión', 'dureza', 'temperatura', 'longitud'].includes(x) ? `la ${x}` : `el ${x}`);
  function tIntensiva(rng) {
    const mat = rng.elegir(MATERIAL), pide = rng.elegir(['igual', 'mitad']);
    const buenas = pide === 'igual' ? INT : EXT, malas = pide === 'igual' ? EXT : INT;
    const buena = rng.elegir(buenas), otras = rng.barajar(malas).slice(0, 3);
    const errores = otras.map(x => ({ clave: 'prop:' + x, texto: May(x), ...err(x === 'temperatura' ? 'Q4' : 'AT1', pide === 'igual'
      ? `Buscar algo que se mide en cada pedazo está bien. Pero ${articulo(x)} depende de cuánto hay, así que se parte con el trozo: cada pedazo tiene menos.`
      : `Buscar algo que se mide en cada pedazo está bien. Pero ${articulo(x)} depende solo del material, no de cuánto hay, así que queda igual en cada pedazo.`) }));
    return {
      variables: {}, enunciado: [`Partes ${mat} en dos pedazos iguales.`],
      pregunta: [pide === 'igual' ? '¿Qué propiedad de cada pedazo es igual a la del entero?' : '¿Qué propiedad de cada pedazo es la mitad de la del entero?'],
      datos: [DEF_INT, DEF_EXT],
      alternativas: P.armarTexto({ correcta: { clave: 'prop:' + buena, texto: May(buena) }, errores, rng }),
      respuesta: { valor: 'prop:' + buena, texto: May(buena), unidad: '' },
      solucion: [
        ['Pregunta por cada una: si tienes el doble de muestra, ¿también se duplica? Si se duplica, es extensiva; si queda igual, es intensiva.'],
        [pide === 'igual' ? `${May(articulo(buena))} no depende de cuánto hay, así que es intensiva y queda igual en cada pedazo.`
          : `${May(articulo(buena))} depende de cuánto hay, así que es extensiva y cada pedazo tiene la mitad.`],
        [`Las otras, ${lista(otras)}, ${pide === 'igual' ? 'son extensivas y se parten con el pedazo' : 'son intensivas y quedan igual'}.`],
      ],
      _datos: { tipo: 'intensiva', nivel: 1, material: mat, pide, lista: [buena, ...otras] },
    };
  }

  // ---- liquido: masa o volumen con la densidad de libro ----
  const LIQUIDOS = [{ id: 'aceite', nombre: 'aceite', art: 'el', rho: 0.92 }, { id: 'alcohol', nombre: 'alcohol', art: 'el', rho: 0.79 },
    { id: 'leche', nombre: 'leche', art: 'la', rho: 1.03 }, { id: 'miel', nombre: 'miel', art: 'la', rho: 1.4 }];
  function tLiquido(rng) {
    const l = rng.elegir(LIQUIDOS), sub = rng.elegir(['masa', 'volumen']);
    const dRho = `${May(l.nombre)}: unos ${f(l.rho)} g/mL`;
    if (sub === 'masa') {
      const L = rng.elegir([0.5, 1.5, 2, 2.5, 3]), mL = limpio(L * 1000), correcta = limpio(l.rho * mL);
      const errores = [
        e(l.rho * L, 'QU2-litros-sin-mL', `Multiplicar densidad por volumen está bien. Pero la densidad va por mL, así que faltó pasar los litros a mL: ${f(l.rho)} × ${f(L)} = ${f(l.rho * L)}.`),
        e(mL / l.rho, 'QM-RHO-INVIERTE', `Pasar a ${f(mL)} mL está bien. Pero si cada mL tiene cierta masa, más mL juntan más masa: la masa es densidad por volumen, no volumen entre densidad, que da ${f(mL / l.rho)}.`),
        e(mL, 'QM-COMO-AGUA', `Pasar a ${f(mL)} mL está bien. Pero gramos y mL solo coinciden en el agua, que tiene 1 g/mL; ${l.art} ${l.nombre} tiene unos ${f(l.rho)} g/mL.`),
        e(l.rho * L * 100, 'QU2-litro-100-mL', `Multiplicar densidad por volumen está bien. Pero 1 L son 1000 mL, no 100, así que el volumen quedó diez veces chico: ${f(l.rho)} × ${f(L * 100)} = ${f(l.rho * L * 100)}.`),
      ];
      return {
        variables: { V: va('volumen', 'volumen'), x: va('masa (lo que se pide)', 'masa') },
        enunciado: ['Una botella tiene ', v('V', `${f(L)} L`), ` de ${l.nombre}.`], pregunta: ['¿Cuál es su ', v('x', 'masa'), '?'],
        datos: [DEF_RHO, dRho, '1 L = 1000 mL'],
        alternativas: numericas(rng, correcta, errores, x => `${f(x)} g`), respuesta: { valor: correcta, unidad: 'g' },
        solucion: [
          ['La densidad está en g/mL: el volumen va en mL. ', v('V', `${f(L)} L`), ` = ${f(mL)} mL.`],
          ['De ρ = m / V, la masa es densidad por volumen: ', `${f(l.rho)} × ${f(mL)} = `, v('x', `${f(correcta)} g`), '.'],
          [l.rho < 1 ? 'Es más liviano que el agua: los gramos son menos que los mL.' : 'Es más denso que el agua: los gramos son más que los mL.'],
        ],
        _datos: { tipo: 'liquido', sub, nivel: 2, liquido: l.id, rho: l.rho, litros: L },
      };
    }
    const mL = rng.elegir([200, 250, 500, 1000, 1500]), masa = limpio(l.rho * mL), correcta = mL;
    const errores = [
      e(masa * l.rho, 'QM-RHO-PRODUCTO', `Usar la masa y la densidad está bien. Pero para saber cuántos mL juntan esos gramos se divide la masa entre la densidad: ${f(masa)} × ${f(l.rho)} = ${f(masa * l.rho)} multiplica.`),
      e(masa, 'QM-COMO-AGUA', `Gramos y mL se parecen, cierto, pero solo en el agua, que tiene 1 g/mL. Este líquido tiene otra densidad, así que no son ${f(masa)} mL.`),
      e(mL / 1000, 'QU2-mL-como-L', `La división ${f(masa)} ÷ ${f(l.rho)} está bien, y como la densidad iba en g/mL, eso ya sale en mL. ${f(mL / 1000)} son litros, y piden mL.`),
    ];
    return {
      variables: { m: va('masa', 'masa'), x: va('volumen (lo que se pide)', 'volumen') },
      enunciado: ['En un frasco hay ', v('m', `${f(masa)} g`), ` de ${l.nombre}.`], pregunta: ['¿Qué ', v('x', 'volumen'), ' ocupa, en mL?'],
      datos: [DEF_RHO, dRho],
      alternativas: numericas(rng, correcta, errores, x => `${f(x)} mL`), respuesta: { valor: correcta, unidad: 'mL' },
      solucion: [
        ['De ρ = m / V se despeja el volumen: V = m / ρ.'],
        ['V = ', v('m', `${f(masa)} g`), ` ÷ ${f(l.rho)} g/mL = `, v('x', `${f(correcta)} mL`), '.'],
        [`Comprobación: ${f(l.rho)} × ${f(mL)} = ${f(masa)} g.`],
      ],
      _datos: { tipo: 'liquido', sub, nivel: 2, liquido: l.id, rho: l.rho, masa },
    };
  }

  // ---- separar: el método para una mezcla ----
  const METODOS = {
    filtracion: { nombre: 'Filtración', dato: 'Filtración: un papel retiene el sólido sin disolver y deja pasar el líquido' },
    decantacion: { nombre: 'Decantación', dato: 'Decantación: se deja asentar y se vierte la capa de arriba, la menos densa' },
    destilacion: { nombre: 'Destilación', dato: 'Destilación: se hierve; el vapor del que hierve antes se enfría y se recoge aparte' },
    evaporacion: { nombre: 'Evaporación', dato: 'Evaporación: el líquido se va al aire y queda lo que estaba disuelto' },
    imantacion: { nombre: 'Imantación', dato: 'Imantación: un imán atrae al hierro y deja lo demás' },
  };
  const ERR_MET = { filtracion: 'QM-FILTRA-DISUELTO', decantacion: 'QM-DECANTA-MISCIBLE', destilacion: 'QM-METODO', evaporacion: 'QM-METODO', imantacion: 'QM-METODO' };
  // En agua con arena sirven filtrar y decantar: la pregunta pide uno y el otro no está entre las opciones.
  const SEPARAR = [
    { id: 'agua-arena', texto: 'separar la arena del agua de un balde, sin perder el agua', pide: 'filtracion', fuera: 'decantacion', dato: 'La arena no se disuelve en el agua',
      porque: 'La arena es un sólido sin disolver: el papel la retiene y el agua pasa.',
      si: { destilacion: 'Destilar también separa, cierto. Pero hace hervir toda el agua y gasta mucho calor, cuando la arena no se disuelve y un papel la retiene.', evaporacion: 'Evaporar deja la arena, cierto. Pero el agua se va al aire y la pierdes, y querías conservarla; el filtro guarda las dos.', imantacion: 'Buscar una diferencia está bien. Pero la arena no es magnética, así que un imán no la atrae; lo que la distingue es que no se disuelve.' } },
    { id: 'agua-aceite', texto: 'separar el aceite del agua de una olla', pide: 'decantacion', dato: 'El aceite no se mezcla con el agua y flota sobre ella',
      porque: 'El aceite no se mezcla y es menos denso: queda arriba y se vierte aparte.',
      si: { filtracion: 'Buscar un método sin calor está bien. Pero el papel solo retiene granos sólidos, y los dos líquidos pasan juntos; lo que los distingue es la densidad.', evaporacion: 'Buscar una diferencia está bien. Pero evaporar se lleva el agua al aire y no la recuperas; como forman dos capas, basta verter la de arriba.', imantacion: 'Buscar una diferencia está bien. Pero ni el agua ni el aceite son magnéticos; lo que los distingue es que el aceite flota en su capa.' } },
    { id: 'agua-alcohol', texto: 'separar el alcohol del agua', pide: 'destilacion', dato: 'El alcohol se mezcla del todo con el agua; hierve a unos 78 °C y el agua a 100 °C',
      porque: 'Difieren en la temperatura de ebullición: el alcohol hierve antes, su vapor se enfría y se recoge.',
      si: { decantacion: 'Sus densidades son distintas, cierto. Pero se mezclan del todo y forman una sola fase, así que no hay capas que verter; lo que sirve es que hierven a temperaturas distintas.', filtracion: 'Buscar un método sencillo está bien. Pero el papel solo retiene granos sólidos, y los dos líquidos mezclados pasan juntos.', evaporacion: 'Usar el calor está bien. Pero evaporar se lleva los dos líquidos al aire y no queda nada que recoger; hay que recoger aparte el vapor del que hierve antes.' } },
    { id: 'hierro-azufre', texto: 'separar limaduras de hierro de azufre en polvo', pide: 'imantacion', dato: 'Hierro y azufre: dos polvos sólidos mezclados',
      porque: 'Solo el hierro es atraído por un imán: el azufre se queda.',
      si: { filtracion: 'Buscar una diferencia de tamaño está bien. Pero filtrar necesita un líquido que pase por el papel, y aquí hay dos polvos; lo que los distingue es que el hierro es magnético.', decantacion: 'Buscar una diferencia de densidad está bien. Pero decantar necesita un líquido donde algo flote o se asiente, y aquí hay dos polvos secos.', destilacion: 'Buscar una diferencia está bien. Pero destilar necesita un líquido que hierva, y aquí no hay ninguno; lo que los distingue es que el hierro es magnético.' } },
    { id: 'sal-mar', texto: 'sacar la sal del agua de mar; el agua no importa', pide: 'evaporacion', fuera: 'destilacion', dato: 'La sal está disuelta en el agua: no se ve',
      porque: 'Basta con que el agua se vaya al aire: la sal disuelta queda en el fondo.',
      si: { filtracion: 'Buscar un método sencillo está bien. Pero el papel solo retiene sólidos sin disolver, y la sal disuelta pasa con el agua.', decantacion: 'Buscar un método sin calor está bien. Pero la sal disuelta no forma capa: queda en una sola fase con el agua, y no hay nada que verter.', imantacion: 'Buscar una diferencia está bien. Pero la sal no es magnética; lo que la distingue es que el agua se evapora y la sal no.' } },
    { id: 'sal-agua', texto: 'recuperar el agua y también la sal de un agua salada', pide: 'destilacion', fuera: 'evaporacion', dato: 'La sal está disuelta en el agua: no se ve',
      porque: 'El agua hierve, su vapor se enfría y se recoge aparte; la sal queda en el fondo.',
      si: { filtracion: 'Buscar un método sencillo está bien. Pero el papel solo retiene sólidos sin disolver, y la sal disuelta pasa con el agua.', decantacion: 'Buscar un método sin calor está bien. Pero la sal disuelta no forma capa: queda en una sola fase con el agua, y no hay nada que verter.', imantacion: 'Buscar una diferencia está bien. Pero la sal no es magnética; lo que la distingue es que el agua se evapora y la sal no.' } },
  ];
  function tSeparar(rng) {
    const q = rng.elegir(SEPARAR);
    const metodos = Object.keys(METODOS).filter(k => k !== q.fuera), malos = metodos.filter(k => k !== q.pide && q.si[k]);
    const errores = malos.map(k => ({ clave: 'metodo:' + k, texto: METODOS[k].nombre, ...err(ERR_MET[k], q.si[k]) }));
    return {
      variables: {}, enunciado: [`Quieres ${q.texto}.`], pregunta: ['¿Qué método usas?'],
      datos: [q.dato, ...metodos.map(k => METODOS[k].dato)],
      alternativas: P.armarTexto({ correcta: { clave: 'metodo:' + q.pide, texto: METODOS[q.pide].nombre }, errores, rng }),
      respuesta: { valor: 'metodo:' + q.pide, texto: METODOS[q.pide].nombre, unidad: '' },
      solucion: [
        ['Una mezcla se separa por una propiedad en que sus componentes difieren: el tamaño del sólido, la densidad, la temperatura de ebullición o el magnetismo.'],
        [q.porque],
        [`Por eso el método es la ${METODOS[q.pide].nombre.toLowerCase()}.`],
      ],
      _datos: { tipo: 'separar', nivel: 2, caso: q.id },
    };
  }

  // ---- cubo: lado en cm, masa en kg ----
  const METALES = [{ id: 'aluminio', rho: 2.7 }, { id: 'hierro', rho: 7.9 }, { id: 'cobre', rho: 8.9 }, { id: 'plomo', rho: 11.3 }, { id: 'zinc', rho: 7.1 }];
  function tCubo(rng) {
    const mt = rng.elegir(METALES), a = rng.elegir([2, 4, 5, 10]), V = a ** 3, g = limpio(mt.rho * V), kg = limpio(g / 1000), correcta = mt.rho;
    const errores = [
      e(kg / V, 'QU1-kg-sin-g', `El volumen, ${V} cm³, está bien. Pero la masa va en gramos para que la densidad salga en g/cm³; en kg queda mil veces chica: ${f(kg, 4)} ÷ ${V} = ${fr(kg / V)}.`),
      e(g / (a * a), 'QM-AREA', `Pasar a ${f(g)} g está bien. Pero el volumen del cubo es lado × lado × lado: ${a} × ${a} = ${a * a} es el área de una cara, no lo que ocupa. ${f(g)} ÷ ${a * a} = ${fr(g / (a * a))}.`),
      e(g / a, 'QM-LADO', `Pasar a ${f(g)} g está bien. Pero el volumen del cubo es lado × lado × lado, no el lado solo, que es una longitud: ${f(g)} ÷ ${a} = ${fr(g / a)}.`),
      e(V / g, 'QM-RHO-INVIERTE', `El volumen y la masa en gramos están bien. Pero la densidad dice cuántos gramos hay en cada cm³, así que va masa entre volumen: ${V} ÷ ${f(g)} = ${fr(V / g)} es al revés.`),
      e(kg * 100 / V, 'QU1-kg-100-g', `El volumen, ${V} cm³, está bien. Pero 1 kg son 1000 g, no 100, así que la masa quedó diez veces chica: ${f(kg * 100)} ÷ ${V} = ${fr(kg * 100 / V)}.`),
    ];
    return {
      variables: { a: va('lado', 'longitud'), m: va('masa', 'masa'), r: va('densidad (lo que se pide)', 'densidad') },
      enunciado: ['Un cubo de metal de ', v('a', `${a} cm`), ' de lado tiene una masa de ', v('m', `${f(kg, 4)} kg`), '.'],
      pregunta: ['¿Cuál es su ', v('r', 'densidad'), ', en g/cm³?'],
      datos: [DEF_RHO, 'Volumen de un cubo: lado × lado × lado', '1 kg = 1000 g'],
      alternativas: numericas(rng, correcta, errores, x => `${fr(x)} g/cm³`), respuesta: { valor: correcta, unidad: 'g/cm³' },
      solucion: [
        ['El volumen del cubo: ', `${a} × ${a} × ${a} = ${V} cm³. La masa en gramos: `, v('m', `${f(kg, 4)} kg`), ` = ${f(g)} g.`],
        ['ρ = m / V = ', `${f(g)} g ÷ ${V} cm³ = `, v('r', `${f(correcta)} g/cm³`), '.'],
        ['Unidades: g entre cm³ da g/cm³, como pide la pregunta.'],
      ],
      _datos: { tipo: 'cubo', nivel: 3, metal: mt.id, rho: mt.rho, lado: a, kg },
    };
  }

  // ---- barra: se corta en partes iguales ----
  const BARRAS = [{ rho: 7.9, nombre: 'hierro' }, { rho: 8.9, nombre: 'cobre' }, { rho: 2.7, nombre: 'aluminio' }, { rho: 11.3, nombre: 'plomo' }];
  function tBarra(rng) {
    const b = rng.elegir(BARRAS), k = rng.elegir([2, 3, 4, 5]), Vp = rng.elegir([5, 10, 20]), V = Vp * k, m = limpio(b.rho * V);
    const mp = limpio(m / k), rho = b.rho;
    const tx = (mm, rr) => `${f(mm)} g y ${f(rr, rr < 1 ? 3 : 2)} g/cm³`;
    const cl = (mm, rr) => `parte:${limpio(mm)}|${limpio(rr)}`;
    const cand = [
      [mp, rho / k, 'QM-PARTE-DENSIDAD', `La masa de cada parte, ${f(mp)} g, está bien. Pero la densidad no depende de cuánto hay: cada parte tiene menos masa y también menos volumen, así que no se divide entre ${k}.`],
      [m, rho, 'AT1', `La densidad, ${f(rho)} g/cm³, está bien. Pero la masa sí depende de cuánto hay: cada parte tiene la ${({ 2: 'mitad', 3: 'tercera parte', 4: 'cuarta parte', 5: 'quinta parte' })[k]} de la masa de la barra.`],
      [m, rho / k, 'AT1', 'Ver que algo se reparte está bien. Pero se reparte la masa, que depende de cuánto hay; la densidad depende solo del metal y queda igual. Lo pusiste al revés.'],
      [mp, V / m, 'QM-RHO-INVIERTE', `La masa de cada parte está bien. Pero la densidad dice cuántos gramos hay en cada cm³, así que es masa entre volumen: ${V} ÷ ${f(m)} es al revés.`],
    ];
    const errores = cand.map(([mm, rr, id, ex]) => ({ clave: cl(mm, rr), texto: tx(mm, rr), ...err(id, ex) }));
    return {
      variables: { m: va('masa de la barra', 'masa'), V: va('volumen de la barra', 'volumen'), mp: va('masa de cada parte', 'masa'), rp: va('densidad de cada parte', 'densidad') },
      enunciado: [`Una barra de ${b.nombre} de `, v('m', `${f(m)} g`), ' ocupa ', v('V', `${V} cm³`), `. Se corta en ${k} partes iguales.`],
      pregunta: ['¿Qué ', v('mp', 'masa'), ' y qué ', v('rp', 'densidad'), ' tiene cada parte?'], datos: [DEF_RHO, DEF_INT, DEF_EXT],
      alternativas: P.armarTexto({ correcta: { clave: cl(mp, rho), texto: tx(mp, rho) }, errores, rng }),
      respuesta: { valor: cl(mp, rho), texto: tx(mp, rho), unidad: '' },
      solucion: [
        ['La masa es extensiva, así que se reparte entre las partes: ', v('m', `${f(m)} g`), ` ÷ ${k} = `, v('mp', `${f(mp)} g`), '.'],
        ['La densidad es intensiva, así que cada parte tiene la de la barra entera: ', v('m', `${f(m)} g`), ' ÷ ', v('V', `${V} cm³`), ' = ', v('rp', `${f(rho)} g/cm³`), '.'],
        [`Comprobación con una parte: ${f(mp)} g ÷ ${Vp} cm³ = ${f(rho)} g/cm³, lo mismo.`],
      ],
      _datos: { tipo: 'barra', nivel: 3, m, V, partes: k },
    };
  }

  // ---- contar: cuántas intensivas en una lista (San Marcos) ----
  // tipo y, para los errores: num (intensiva que se mide con un número), temp (una temperatura).
  const PROPS = {
    masa: { int: false }, volumen: { int: false }, peso: { int: false }, longitud: { int: false }, 'calor absorbido': { int: false }, 'área': { int: false },
    densidad: { int: true, num: true }, temperatura: { int: true, num: true, temp: true }, 'temperatura de fusión': { int: true, num: true, temp: true },
    'temperatura de ebullición': { int: true, num: true, temp: true }, viscosidad: { int: true, num: true }, 'conductividad eléctrica': { int: true, num: true },
    color: { int: true }, olor: { int: true }, sabor: { int: true }, brillo: { int: true },
  };
  function tContar(rng) {
    const ext = rng.barajar(Object.keys(PROPS).filter(k => !PROPS[k].int)), int = rng.barajar(Object.keys(PROPS).filter(k => PROPS[k].int));
    const n = rng.entero(2, 4), xs = rng.barajar([...int.slice(0, n), ...ext.slice(0, 5 - n)]);
    const num = xs.filter(x => PROPS[x].int && PROPS[x].num).length, temp = xs.filter(x => PROPS[x].temp).length;
    const errores = [
      e(n - num, 'AT1', `Las que no se miden con un número están bien. Pero medirse con un número no la vuelve extensiva: la densidad se mide y no crece con la muestra. Así contaste ${n - num}.`),
      e(n - temp, 'Q4', `Casi todas están bien. Pero las temperaturas no se suman al juntar dos muestras: dos vasos a 20 °C, juntos, siguen a 20 °C. Son intensivas. Así contaste ${n - temp}.`),
      e(n + 1, 'QM-CONTEO', `El criterio está bien, pero contaste una extensiva. Pregúntate por cada una si se duplica al tener el doble de muestra; si se duplica, no es intensiva. Así son ${n + 1}.`),
      e(n - 1, 'QM-CONTEO', `El criterio está bien, pero se te pasó una intensiva: una que no cambia si hay más muestra, aunque no sea densidad ni temperatura. Así son ${n - 1}.`),
      e(n + 2, 'QM-CONTEO', `El criterio está bien, pero contaste dos extensivas. Pregúntate por cada una si se duplica al tener el doble de muestra; si se duplica, no es intensiva. Así son ${n + 2}.`),
    ].filter(x => x.valor !== n && x.valor > 0 && x.valor <= 5);
    return {
      variables: {}, enunciado: [`Mira esta lista de propiedades: ${lista(xs)}.`], pregunta: ['¿Cuántas son propiedades intensivas?'],
      datos: [DEF_INT, DEF_EXT],
      alternativas: P.armar({ correcta: n, errores, rng, texto: x => String(x) }), respuesta: { valor: n, unidad: '' },
      solucion: [
        ['Pregunto por cada una: si tengo el doble de muestra, ¿también se duplica? Si se duplica, es extensiva; si queda igual, es intensiva.'],
        [5 - n === 1 ? `Se duplica ${lista(xs.filter(x => !PROPS[x].int))}, que es extensiva. Quedan igual ${lista(xs.filter(x => PROPS[x].int))}, que son intensivas.`
          : `Se duplican ${lista(xs.filter(x => !PROPS[x].int))}, que son extensivas. Quedan igual ${lista(xs.filter(x => PROPS[x].int))}, que son intensivas.`],
        [`Son ${n} intensivas. Que una propiedad se mida con un número no la vuelve extensiva: la temperatura se mide y es intensiva.`],
      ],
      _datos: { tipo: 'contar', nivel: 3, lista: xs },
    };
  }

  const TIPOS = ['densidad', 'densidad', 'intensiva', 'intensiva', 'liquido', 'liquido', 'separar', 'separar', 'cubo', 'cubo', 'barra', 'contar', 'contar'];
  const NIVEL = { densidad: 1, intensiva: 1, liquido: 2, separar: 2, cubo: 3, barra: 3, contar: 3 };
  const CONSTRUIR = { densidad: tDensidad, intensiva: tIntensiva, liquido: tLiquido, separar: tSeparar, cubo: tCubo, barra: tBarra, contar: tContar };
  const PAPEL = { 'papel-1': 'densidad', 'papel-2': 'intensiva', 'papel-3': 'liquido', 'papel-4': 'separar', 'papel-5': 'liquido',
    'papel-6': 'contar', 'papel-7': 'cubo', 'papel-8': 'barra' };

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = PAPEL[String(semilla)] || rng.elegir(TIPOS);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (pr && pr.alternativas.length >= 4) {
        return { id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
          alternativas: pr.alternativas, solucion: pr.solucion, respuesta: pr.respuesta, _datos: pr._datos };
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Lo que no cambia al partir', generar, NIVEL, PROPS, SEPARAR, COLOR };
});
