/*
 * Generador «quimica-conceptos»: verdadero o falso de química (preguntas conceptuales, sin cálculo,
 * de los exámenes de admisión). Formato "predicciones" con alternativas de texto (armarTexto de
 * nucleo/predicciones.js). Funciona en el navegador (window.Generadores['quimica-conceptos']) y en
 * Node (require). No usa ningún motor: la química vive en el banco de proposiciones de abajo.
 *
 * BANCO (exportado como gen.BANCO): proposiciones propias, una idea cada una:
 *   { id, unidad, tema, texto, verdad: true|false, error, explicacion, corregida, negar, excluye, respaldo }
 *   - verdad: el valor de verdad a nivel de secundaria y academia.
 *   - error (solo las falsas): código de la trampa que la hace parecer verdadera.
 *   - corregida (solo las falsas): la versión verdadera.
 *   - negar (opcional, solo las verdaderas): código del error que lleva a creerla falsa;
 *     si falta, se usa 'QA-negar-verdadera'.
 *   - excluye: ids que no pueden salir en el mismo problema (su espejo: una V que dice lo contrario
 *     o casi lo mismo). La relación vale en los dos sentidos.
 *   - respaldo (opcional): pisa el respaldo del código solo en esa proposición.
 * TEMAS (gen.TEMAS): grupos del banco con { id, unidad, nombre, contexto?, ids }. El tema «tendencia»
 *   trae un contexto (datos de un glaciar inventado) que se muestra en el enunciado.
 * PARES (gen.PARES): conjuntos para relacionar { id, unidad, izqNombre, izqVar, derNombre, codigo,
 *   familia?, codigoFamilia?, choques?, pares: [{ id, izq, izqCorto?, der }] }.
 * ERRORES (gen.ERRORES): código → { respaldo, fuente, nombre }. Respaldo según docs/metodo/LEEME.md:
 *   un código de informe va como «parcial» (el informe tiene un dato para ese error, pero medido con
 *   otro ítem); sube a «documentado» solo en la proposición que pregunta lo mismo que el ítem con
 *   cifra del informe (campo respaldo de la proposición); los QA-… nuevos son «hipotesis».
 *
 * Tipos de problema (_datos.tipo):
 *   vf          3 o 4 proposiciones de un mismo tema (al menos una V y una F, ninguna excluida por
 *               otra). Respuesta: la secuencia («VFV»), clave 'vf:VFV'. Distractores alrededor de un
 *               pivote D0 = la correcta con una F invertida (la trampa principal), más las secuencias
 *               a distancia 1 de D0 (a distancia 2 de la correcta). Código: en D0, el error de su F; en
 *               cada vecino, el de su segunda inversión (la que lo distingue de D0): el error si es
 *               una F, el negar si es una V.
 *   incorrecta  4 o 5 proposiciones de un tema, una sola falsa. Respuesta: la falsa, clave 'p:<id>'.
 *               Distractores: las verdaderas, cada una con su código negar.
 *   correcta    4 o 5 proposiciones de un tema, una sola verdadera. Respuesta: la verdadera, clave
 *               'p:<id>'. Distractores: las falsas, cada una con su código error.
 *   relacionar  3 o 4 pares de un conjunto (sin dos pares con el mismo lado derecho ni pares en
 *               «choques»). Columna izquierda I, II, III, IV en el orden de _datos.ids; columna
 *               derecha a, b, c, d en el orden de _datos.derecha. Respuesta: «Ib, IIa, IIIc», clave
 *               'rel:Ib, IIa, IIIc'. Ni la respuesta ni un distractor es el orden idéntico
 *               («Ia, IIb, IIIc»). Distractores alrededor de un pivote D0 = la correcta con dos letras
 *               intercambiadas, más los intercambios de dos letras de D0. Código: codigoFamilia si
 *               todos los pares cambiados están en familia; si no, codigo.
 *   En incorrecta y correcta, si la respuesta es la más larga, se vuelve a sortear con probabilidad
 *   0,8, para que el largo no la delate.
 *   En vf y relacionar se vuelve a sortear si la «votación por posición» (la letra o el valor más
 *   repetido en cada posición entre las alternativas) da la respuesta correcta.
 * _datos: { tipo, tema | conjunto, ids: ids en el orden en que se muestran (I, II, … o como se
 *   eligieron), derecha (solo relacionar) }. respuesta: { valor: clave, texto }.
 * Pesos de tipo: vf 4, incorrecta 2, correcta 2, relacionar 2 (de 10). Tema y conjunto: al azar
 *   uniforme. Al menos 4 alternativas distintas, hasta 5.
 * Colores (regla 4): los números romanos van sin color. En relacionar, cada elemento de la columna
 *   izquierda va en naranja (o), turquesa (i), rojo (h) o verde (d), en el enunciado y en la
 *   solución; en «incorrecta» la palabra y la respuesta van en rojo (h) y en «correcta», en verde (d).
 * Fin de la cabecera.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const fA = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const fM = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const fQ = 'docs/investigacion/quimica-ambiente-ideas-erroneas.md';
  const fE = 'docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md';
  const fG = 'docs/investigacion/gases-soluciones-ideas-erroneas.md';
  const fB = 'docs/investigacion/biomoleculas-ideas-erroneas.md';

  // ---------- Errores: código → respaldo y fuente ----------
  const ERRORES = {
    // De los informes (parcial: dato para el mismo error con otro ítem, o estudio sin cifra).
    AT5: { respaldo: 'parcial', fuente: fA, nombre: 'Mezclar los aportes de los modelos atómicos (el átomo es el de Bohr)' },
    AT6: { respaldo: 'parcial', fuente: fA, nombre: 'Orbital = órbita' },
    MA9: { respaldo: 'parcial', fuente: fM, nombre: 'Elemento, compuesto y mezcla confundidos' },
    MA10: { respaldo: 'parcial', fuente: fM, nombre: 'La mezcla homogénea se reconoce a la vista' },
    GQ18: { respaldo: 'parcial', fuente: fG, nombre: 'La presión de vapor depende del recipiente' },
    EN1: { respaldo: 'parcial', fuente: fA, nombre: 'El NaCl está hecho de moléculas o pares iónicos' },
    EN3: { respaldo: 'parcial', fuente: fA, nombre: 'El octeto es una ley' },
    EN5: { respaldo: 'parcial', fuente: fA, nombre: 'Clasificar el enlace al revés' },
    EN13: { respaldo: 'parcial', fuente: fA, nombre: 'Al fundir o hervir se rompen los enlaces covalentes' },
    EN17: { respaldo: 'parcial', fuente: fA, nombre: 'El grafito conduce por átomos sueltos' },
    QA8: { respaldo: 'parcial', fuente: fQ, nombre: 'No saber de dónde sale el ozono de la ciudad (smog fotoquímico)' },
    TP4: { respaldo: 'parcial', fuente: fA, nombre: 'La atracción del núcleo se «reparte» entre los electrones' },
    QA4: { respaldo: 'parcial', fuente: fQ, nombre: 'El CO₂ causa la lluvia ácida' },
    QA14: { respaldo: 'hipotesis', fuente: fQ, nombre: 'Todos los polímeros son sintéticos' },
    NO2: { respaldo: 'parcial', fuente: fM, nombre: 'Sufijos y reglas de nomenclatura aplicados mal' },
    EC2: { respaldo: 'parcial', fuente: fE, nombre: 'Los electrones viajan por la disolución' },
    EC8: { respaldo: 'parcial', fuente: fE, nombre: 'Pila y celda electrolítica al revés' },
    EC9: { respaldo: 'parcial', fuente: fE, nombre: 'Oxidar y reducir al revés (aceptar electrones es oxidarse)' },
    EQ3: { respaldo: 'parcial', fuente: fE, nombre: 'En equilibrio la reacción terminó' },
    EQ13: { respaldo: 'parcial', fuente: fE, nombre: 'Solo hay equilibrio en una sola fase; los sólidos entran en K' },
    AB1: { respaldo: 'parcial', fuente: fE, nombre: 'Ácido es lo que tiene H y base lo que tiene OH' },
    AB3: { respaldo: 'parcial', fuente: fE, nombre: 'Confundir qué ácidos y bases son fuertes' },
    AB9: { respaldo: 'parcial', fuente: fE, nombre: 'Toda sal (o neutralización) da una solución neutra' },
    HC4: { respaldo: 'parcial', fuente: fM, nombre: 'Isomería geométrica mal reconocida (todo alqueno tiene cis y trans)' },
    FO4: { respaldo: 'parcial', fuente: fM, nombre: 'No reconocer el grupo funcional ni la clase de alcohol' },
    BM1: { respaldo: 'parcial', fuente: fB, nombre: 'Las vitaminas dan energía' },
    BMH1: { respaldo: 'hipotesis', fuente: fB, nombre: 'La desnaturalización rompe los enlaces peptídicos' },
    BMH4: { respaldo: 'hipotesis', fuente: fB, nombre: 'Grasa, lípido y colesterol confundidos' },
    BMH13: { respaldo: 'hipotesis', fuente: fB, nombre: 'Desnaturalizada = sin valor nutritivo' },
    // Nuevos (química admisión, hipótesis nuestras).
    'QA-negar-verdadera': { nombre: 'Creer falsa una proposición verdadera (sin un error con nombre)' },
    'QA-aporte-adelantado': { nombre: 'Atribuir a un modelo o experimento antiguo lo que se supo después' },
    'QA-aporte-cruzado': { nombre: 'Cruzar el aporte de dos científicos' },
    'QA-bohr-continuo': { nombre: 'En el modelo de Bohr la energía del electrón es continua' },
    'QA-alfa-negativa': { nombre: 'Las partículas alfa tienen carga negativa' },
    'QA-rebote-mayoria': { nombre: 'La mayoría de las partículas alfa rebotó' },
    'QA-rama-por-sustancia': { nombre: 'Elegir la rama de la química por el tipo de sustancia y no por la tarea' },
    'QA-rama-definicion': { nombre: 'Definir una rama de la química por un rasgo que no es el suyo' },
    'QA-organico-es-vivo': { nombre: 'Orgánico = que viene de seres vivos' },
    'QA-compuesto-suma': { nombre: 'Un compuesto tiene las propiedades de sus elementos' },
    'QA-atomo-por-ion': { nombre: 'Confundir el átomo neutro con su ion' },
    'QA-ion-cambia-protones': { nombre: 'Al formar un ion cambian los protones' },
    'QA-periodo-del-ion': { nombre: 'Leer el periodo en la configuración del ion' },
    'QA-viscosidad-esferica': { nombre: 'Las moléculas esféricas dan líquidos más viscosos' },
    'QA-pvapor-volatil': { nombre: 'Más presión de vapor = menos volátil' },
    'QA-tension-jabon': { nombre: 'El jabón sube la tensión superficial' },
    'QA-ionico-amorfo': { nombre: 'Llamar amorfo a un sólido iónico cristalino' },
    'QA-anion-pierde': { nombre: 'El anión se forma perdiendo electrones' },
    'QA-radio-ion': { nombre: 'Radio del ion al revés respecto del átomo' },
    'QA-amorfo-cristalino': { nombre: 'Confundir sólido amorfo con cristalino' },
    'QA-aire-oxigeno': { nombre: 'El O₂ es el gas más abundante del aire' },
    'QA-agua-dulce-rios': { nombre: 'El agua dulce está sobre todo en ríos y lagos' },
    'QA-ozono-troposfera': { nombre: 'La capa de ozono está en la tropósfera' },
    'QA-hielo-fuera': { nombre: 'El hielo no es parte de la hidrósfera' },
    'QA-secundario-primario': { nombre: 'Llamar primario a un contaminante secundario (o al revés)' },
    'QA-solo-humano': { nombre: 'Todo contaminante es de origen humano' },
    'QA-lluvia-ph': { nombre: 'La lluvia ácida sube el pH' },
    'QA-intervalo-mal-leido': { nombre: 'Leer mal la diferencia en un intervalo de la tendencia' },
    'QA-absoluto-por-porcentaje': { nombre: 'Dar el cambio absoluto como porcentaje' },
    'QA-base-equivocada': { nombre: 'Calcular un porcentaje sobre el año base equivocado' },
    'QA-tendencia-lineal': { nombre: 'Suponer que la tendencia tiene ritmo constante' },
    'QA-caracter-oxido': { nombre: 'Confundir óxido ácido con óxido básico' },
    'QA-proceso-metalurgico': { nombre: 'Confundir los procesos metalúrgicos' },
    'QA-so2-so3': { nombre: 'Llamar anhídrido sulfúrico (SO₃) al SO₂ de la tostación' },
    'QA-reductor-alto-horno': { nombre: 'El agente reductor del alto horno es el oxígeno' },
    'QA-anillos-aromatico': { nombre: 'Todo anillo (o varios anillos) es aromático' },
    'QA-adicion-condensacion': { nombre: 'Confundir polimerización de adición con condensación' },
    'QA-combustion-incompleta': { nombre: 'La combustión incompleta da solo CO₂ y agua' },
    'QA-acido-descarga': { nombre: 'El ácido de la batería se concentra al descargarse' },
    'QA-buffer-infinito': { nombre: 'Una solución reguladora aguanta cualquier cantidad de ácido' },
    'QA-base-debil-acida': { nombre: 'Una base débil da pH menor que 7' },
    'QA-lewis-invertido': { nombre: 'Ácido y base de Lewis al revés' },
    'QA-ionico-conduce': { nombre: 'El sólido iónico conduce en estado sólido' },
    'QA-covalente-bajo': { nombre: 'Covalente = funde a baja temperatura, aun en una red' },
    'QA-molecular-soluble': { nombre: 'Todo sólido molecular se disuelve en agua' },
    'QA-tipo-solido': { nombre: 'Asignar mal el tipo de sólido' },
    'QA-anion-monoatomico': { nombre: 'Los aniones son solo monoatómicos' },
    'QA-carga-oxoanion': { nombre: 'Carga equivocada de un oxoanión' },
    'QA-ionico-ductil': { nombre: 'Los sólidos iónicos son dúctiles como los metales' },
    'QA-sal-inorganica': { nombre: 'Toda sal es inorgánica' },
    'QA-ion-radical': { nombre: 'Tener carga = ser radical' },
    'QA-peroxido-radical': { nombre: 'Llamar radical al peróxido o al hidroperóxido' },
    'QA-hidruro-sin-pares': { nombre: 'Creer que el hidruro no tiene pares libres' },
    'QA-sal-acida-basica': { nombre: 'Confundir sal ácida, básica y neutra' },
    'QA-vitamina-solubilidad': { nombre: 'Cruzar vitaminas hidrosolubles y liposolubles' },
    'QA-ruta-vitamina-d': { nombre: 'Orden equivocado de la activación de la vitamina D' },
    'QA-vitamina-coenzima': { nombre: 'Cruzar una vitamina con la coenzima de otra' },
    'QA-vitamina-funcion': { nombre: 'Cruzar una vitamina con la función de otra' },
    'QA-desnaturalizacion-reversible': { nombre: 'La desnaturalización por calor se revierte al enfriar' },
    'QA-punto-isoelectrico': { nombre: 'En el punto isoeléctrico la carga no es cero' },
    'QA-peptidico-exclusivo': { nombre: 'El enlace peptídico es propio de una sola fuente de proteínas' },
    'QA-reductor-dulce': { nombre: 'Azúcar reductor = azúcar dulce' },
    'QA-disacarido-no-reductor': { nombre: 'Ningún disacárido es reductor' },
    'QA-alcaloide-clase': { nombre: 'No reconocer qué es un alcaloide' },
    'QA-oh-soluble': { nombre: 'Un grupo OH basta para que la molécula se disuelva en agua' },
    'QA-catalizador-activo': { nombre: 'Con un catalizador activo, la hidrogenación se detiene en el alqueno' },
    'QA-lindlar-trans': { nombre: 'El catalizador de Lindlar da el alqueno trans' },
    'QA-h2-por-pi': { nombre: 'Moles de H₂ que no corresponden a los enlaces π' },
    'QA-oxidacion-organica-invertida': { nombre: 'Oxidación y reducción orgánica al revés' },
    'QA-cis-es-z': { nombre: 'Cis-trans y Z/E siempre coinciden' },
    'QA-anhidrido-trans': { nombre: 'El isómero trans forma el anhídrido cíclico' },
    'QA-polaridad-geometrica': { nombre: 'Polaridad de los isómeros geométricos al revés' },
    'QA-fusion-geometrica': { nombre: 'Temperatura de fusión de los isómeros geométricos al revés' },
    'QA-gas-fermentacion': { nombre: 'La fermentación alcohólica libera O₂' },
    'QA-clase-alcohol': { nombre: 'Clase de alcohol o producto de su oxidación equivocados' },
    'QA-disulfuro-debil': { nombre: 'El puente disulfuro es una interacción débil' },
    'QA-hidrofobico-afuera': { nombre: 'Las cadenas apolares quedan hacia el agua' },
    'QA-ionica-iguales': { nombre: 'Cargas iguales forman una interacción iónica' },
    'QA-cadena-lateral-peptidico': { nombre: 'Las cadenas laterales se unen por enlaces peptídicos' },
    'QA-aldosa-cetosa-posicion': { nombre: 'Aldosa y cetosa como isómeros de posición' },
    'QA-aldosa-cetosa': { nombre: 'Confundir aldosa con cetosa' },
    'QA-isomeros-formula': { nombre: 'Los isómeros tienen fórmulas moleculares distintas' },
    'QA-azucar-insoluble': { nombre: 'Los monosacáridos son poco solubles en agua' },
    'QA-co2-hemoglobina': { nombre: 'El CO₂ viaja sobre todo unido a la hemoglobina' },
    'QA-o2-disuelto': { nombre: 'El O₂ viaja sobre todo disuelto en el plasma' },
    'QA-reactividad-aire': { nombre: 'Reactividad de los gases del aire al revés' },
    'QA-metal-degradable': { nombre: 'Los metales pesados se degradan' },
    'QA-nutriente-inocuo': { nombre: 'Los fertilizantes no contaminan porque son nutrientes' },
    'QA-oxisal-haloidea': { nombre: 'Confundir oxisal con sal haloidea' },
    'QA-dativo-aporte': { nombre: 'En el enlace dativo cada átomo aporta un electrón' },
    'QA-sin-dativo': { nombre: 'No ver los enlaces dativos de un oxoanión' },
    'QA-porcentaje-solvente': { nombre: 'Leer el porcentaje del soluto como el del solvente' },
    'QA-alcohol-acido': { nombre: 'Una solución de alcohol es ácida' },
    'QA-fem-negativa': { nombre: 'Una celda espontánea tiene fem negativa' },
    'QA-cation-anion': { nombre: 'Llamar anión a un catión (o al revés)' },
    'QA-electrones-oxidacion': { nombre: 'Contar mal los electrones que cede el carbono' },
    'QA-precursor-cruzado': { nombre: 'Cruzar una sustancia con lo que se forma de otra' },
  };
  for (const k of Object.keys(ERRORES)) {
    ERRORES[k].respaldo = ERRORES[k].respaldo || 'hipotesis';
    ERRORES[k].fuente = ERRORES[k].fuente || null;
  }

  // ---------- Banco ----------
  const V = (id, texto, explicacion, negar = null) => ({ id, texto, verdad: true, error: null, explicacion, corregida: null, negar, excluye: [], respaldo: null });
  const F = (id, texto, error, explicacion, corregida) => ({ id, texto, verdad: false, error, explicacion, corregida, negar: null, excluye: [], respaldo: null });

  const TEMAS = [
    // ===== Estructura atómica =====
    { id: 'dalton', unidad: 'quimica.estructura-atomica', nombre: 'la teoría atómica de Dalton', props: [
      V('dal1', 'Según Dalton, la materia está formada por átomos que no se pueden dividir.', 'Es su primer postulado: el átomo como esfera maciza e indivisible.'),
      V('dal2', 'Según Dalton, todos los átomos de un mismo elemento son iguales en masa y en propiedades.', 'Así lo postuló; después los isótopos mostraron que la masa puede variar.', 'QA-aporte-adelantado'),
      V('dal3', 'Según Dalton, en una reacción química los átomos solo se reordenan: no se crean ni se destruyen.', 'Ese postulado explica la conservación de la masa.'),
      V('dal4', 'Según Dalton, los átomos de elementos distintos se combinan en proporciones de números enteros sencillos.', 'Con eso explicó las proporciones fijas y múltiples de los compuestos.'),
      F('dal6', 'Según Dalton, el átomo tiene electrones incrustados en una masa de carga positiva.', 'AT5', 'Ese es el modelo de Thomson (1904). Para Dalton el átomo no tenía partes.', 'Thomson propuso los electrones incrustados en una masa positiva; para Dalton, el átomo era una esfera maciza sin partes.'),
      F('dal7', 'Según Dalton, los átomos de un mismo elemento pueden tener masas distintas.', 'QA-aporte-adelantado', 'Dalton postuló que todos los átomos de un elemento tienen la misma masa; los isótopos, de masas distintas, se conocieron un siglo después.', 'Según Dalton, todos los átomos de un mismo elemento tienen la misma masa.'),
      F('dal8', 'Según Dalton, el átomo está formado por electrones, protones y neutrones.', 'QA-aporte-adelantado', 'La teoría es de 1808; el electrón se descubrió en 1897 y el neutrón en 1932.', 'Según Dalton, el átomo es indivisible: no tiene partículas más pequeñas.'),
      F('dal9', 'Según Dalton, el átomo se puede dividir en partículas más pequeñas.', 'QA-aporte-adelantado', 'Que el átomo tiene partes se supo después; Dalton lo consideraba indivisible.', 'Según Dalton, el átomo no se puede dividir.'),
    ] },
    { id: 'modelos', unidad: 'quimica.estructura-atomica', nombre: 'los modelos de Thomson, Rutherford y Bohr, y el modelo actual', props: [
      V('mod1', 'En el modelo de Thomson, los electrones están incrustados en una esfera de carga positiva repartida en todo el átomo.', 'Es el modelo del «budín con pasas».', 'AT5'),
      V('mod2', 'Rutherford propuso que casi toda la masa del átomo y toda su carga positiva están en un núcleo muy pequeño.', 'Lo dedujo del rebote de unas pocas partículas alfa en la lámina de oro.', 'AT5'),
      V('mod3', 'En el modelo de Bohr, el electrón del hidrógeno solo puede estar en ciertas órbitas, cada una con una energía fija.', 'Las energías están cuantizadas: solo se permiten ciertos niveles.', 'QA-bohr-continuo'),
      V('mod5', 'En el modelo actual, un orbital es la región del espacio donde es más probable encontrar al electrón.', 'El modelo mecánico-cuántico no da trayectorias, sino probabilidades.', 'AT6'),
      V('mod6', 'El modelo de Bohr explicó el espectro de líneas del átomo de hidrógeno.', 'Cada línea corresponde a un salto entre dos niveles de energía.'),
      F('mod7', 'En el modelo de Rutherford, los electrones ocupan orbitales con forma de nube.', 'AT5', 'Los orbitales son del modelo mecánico-cuántico (Schrödinger, 1926). Rutherford ponía a los electrones girando alrededor del núcleo, sin niveles definidos.', 'En el modelo de Rutherford, los electrones giran alrededor del núcleo; los orbitales aparecen con el modelo mecánico-cuántico.'),
      F('mod8', 'Thomson propuso que el átomo tiene un núcleo positivo pequeño y denso.', 'AT5', 'El núcleo es la idea de Rutherford (1911). En el modelo de Thomson la carga positiva está repartida en todo el átomo.', 'Rutherford propuso el núcleo pequeño y denso; Thomson, una carga positiva repartida en todo el átomo.'),
      F('mod9', 'En el modelo de Bohr, el electrón puede tener cualquier valor de energía al girar alrededor del núcleo.', 'QA-bohr-continuo', 'Bohr postuló que solo se permiten ciertas órbitas, con energías fijas.', 'En el modelo de Bohr, el electrón solo puede tener ciertos valores de energía.'),
      F('mod10', 'En el modelo actual, el electrón sigue una trayectoria circular fija, como un planeta alrededor del Sol.', 'AT5', 'Las órbitas fijas son del modelo de Bohr. En el modelo actual no se habla de trayectorias, sino de orbitales.', 'En el modelo actual, el electrón se describe con orbitales: regiones de probabilidad, no trayectorias.'),
      F('mod11', 'Un orbital y una órbita son lo mismo: el camino que recorre el electrón.', 'AT6', 'La órbita es una trayectoria (Bohr); el orbital es una región de probabilidad (modelo actual).', 'Una órbita es una trayectoria; un orbital es la región donde es más probable hallar al electrón.'),
    ] },
    { id: 'rutherford', unidad: 'quimica.estructura-atomica', nombre: 'el experimento de Rutherford con la lámina de oro', props: [
      V('rut1', 'En el experimento de la lámina de oro, la mayoría de las partículas alfa atravesó la lámina sin desviarse.', 'Por eso se concluyó que casi todo el átomo es espacio casi vacío.', 'QA-rebote-mayoria'),
      V('rut2', 'Que unas pocas partículas alfa rebotaran indicó que en el átomo hay una zona muy pequeña, densa y con carga positiva.', 'Esa zona es el núcleo.'),
      V('rut3', 'Las partículas alfa usadas en el experimento tienen carga positiva.', 'Son núcleos de helio: dos protones y dos neutrones, carga 2+.', 'QA-alfa-negativa'),
      V('rut4', 'Del experimento se concluyó que la mayor parte del volumen del átomo es espacio casi vacío.', 'Lo indica que la mayoría de las partículas pasó sin desviarse.'),
      F('rut6', 'Las partículas alfa tienen carga negativa; por eso el núcleo las atrajo.', 'QA-alfa-negativa', 'Las partículas alfa son núcleos de helio, con carga 2+: el núcleo positivo las repele.', 'Las partículas alfa tienen carga positiva; las que se desviaron fueron repelidas por el núcleo positivo.'),
      F('rut7', 'El experimento de la lámina de oro mostró que los electrones giran en órbitas de energía fija.', 'AT5', 'Las órbitas de energía fija las propuso Bohr en 1913, después. El experimento mostró el núcleo.', 'El experimento de la lámina de oro mostró que el átomo tiene un núcleo pequeño, denso y positivo.'),
      F('rut8', 'La mayoría de las partículas alfa rebotó en la lámina de oro.', 'QA-rebote-mayoria', 'Solo una fracción muy pequeña rebotó; la mayoría pasó sin desviarse.', 'La mayoría de las partículas alfa atravesó la lámina; solo unas pocas rebotaron.'),
      F('rut10', 'Del experimento de la lámina de oro se dedujo que el núcleo contiene neutrones.', 'QA-aporte-adelantado', 'El neutrón lo descubrió Chadwick en 1932, más de veinte años después.', 'Del experimento se dedujo que existe un núcleo positivo; los neutrones se descubrieron después.'),
    ] },
    // ===== Materia y energía =====
    { id: 'ramas', unidad: 'quimica.materia-y-energia', nombre: 'las ramas de la química', props: [
      V('ram1', 'La química orgánica estudia principalmente los compuestos del carbono.', 'Naturales o sintéticos: proteínas, plásticos, combustibles, medicinas.', 'QA-organico-es-vivo'),
      V('ram2', 'La química analítica se ocupa de identificar qué sustancias hay en una muestra y en qué cantidad.', 'Qué hay es el análisis cualitativo; cuánto hay, el cuantitativo.', 'QA-rama-por-sustancia'),
      V('ram3', 'La bioquímica estudia las sustancias y las reacciones químicas de los seres vivos.', 'Por ejemplo, cómo la célula obtiene energía de la glucosa.'),
      V('ram4', 'La fisicoquímica estudia la energía, la velocidad y el equilibrio de los procesos químicos.', 'Usa las leyes de la física para explicar los cambios químicos.'),
      F('ram6', 'Determinar cuánta cafeína tiene una bebida es tarea de la química orgánica, porque la cafeína es un compuesto orgánico.', 'QA-rama-por-sustancia', 'La rama se elige por lo que se hace: medir cuánto hay de una sustancia es química analítica, aunque la sustancia sea orgánica.', 'Determinar cuánta cafeína tiene una bebida es tarea de la química analítica.'),
      F('ram7', 'La química inorgánica estudia solo los metales.', 'QA-rama-definicion', 'Estudia los elementos y sus compuestos en general (metales, no metales, sales, ácidos), salvo los compuestos orgánicos.', 'La química inorgánica estudia los elementos y los compuestos que no son orgánicos, metálicos o no.'),
      F('ram8', 'La química orgánica estudia solo las sustancias que provienen de seres vivos.', 'QA-organico-es-vivo', 'Estudia los compuestos del carbono, también los sintéticos, como los plásticos o muchas medicinas.', 'La química orgánica estudia los compuestos del carbono, naturales o sintéticos.'),
      F('ram9', 'Estudiar las reacciones con que una célula muscular obtiene energía de la glucosa es tarea de la química analítica.', 'QA-rama-por-sustancia', 'Las reacciones de los seres vivos son el campo de la bioquímica.', 'Estudiar cómo una célula obtiene energía de la glucosa es tarea de la bioquímica.'),
    ] },
    { id: 'sustancias', unidad: 'quimica.materia-y-energia', nombre: 'los elementos, los compuestos y las mezclas', props: [
      V('sus1', 'El oxígeno gaseoso (O₂) es una sustancia simple: sus moléculas tienen un solo tipo de átomo.', 'Una molécula con dos átomos del mismo elemento sigue siendo un elemento.', 'MA9'),
      V('sus2', 'El ozono (O₃) y el oxígeno (O₂) son formas distintas de un mismo elemento.', 'Son alótropos del oxígeno.', 'MA9'),
      V('sus3', 'El agua pura es un compuesto, porque tiene dos elementos unidos en una proporción fija.', 'Siempre 2 átomos de H por cada átomo de O.'),
      V('sus4', 'El aire seco y limpio es una mezcla homogénea de gases.', 'N₂, O₂, Ar y otros gases repartidos de modo uniforme y en proporción variable.'),
      V('sus5', 'Un compuesto se puede descomponer en sus elementos por medios químicos.', 'Por ejemplo, el agua por electrólisis da H₂ y O₂.'),
      F('sus7', 'El O₂ es un compuesto, porque cada molécula tiene dos átomos.', 'MA9', 'Un compuesto tiene átomos de elementos distintos. En el O₂ los dos átomos son de oxígeno.', 'El O₂ es una sustancia simple (un elemento): sus dos átomos son del mismo elemento.'),
      F('sus8', 'El agua de mar, que se ve uniforme, es una sustancia pura.', 'MA10', 'Que se vea uniforme solo dice que es homogénea; tiene sales disueltas en proporción variable.', 'El agua de mar es una mezcla homogénea.'),
      F('sus9', 'Un globo lleno de H₂ y O₂ sin reaccionar contiene un compuesto de dos elementos.', 'MA9', 'Si los dos gases no reaccionaron, las moléculas de H₂ y de O₂ solo están mezcladas.', 'Un globo con H₂ y O₂ sin reaccionar contiene una mezcla de dos elementos.'),
      F('sus10', 'El ozono es un compuesto formado por tres elementos distintos.', 'MA9', 'El O₃ tiene tres átomos de un solo elemento, el oxígeno.', 'El ozono es una sustancia simple: tres átomos de oxígeno.'),
      F('sus11', 'Un compuesto tiene las mismas propiedades que los elementos que lo forman.', 'QA-compuesto-suma', 'El sodio es un metal que reacciona con el agua y el cloro un gas tóxico; el cloruro de sodio es la sal de mesa.', 'Un compuesto tiene propiedades propias, distintas de las de sus elementos.'),
      F('oxi12', 'El agua gasificada (agua con CO₂ disuelto) es un compuesto.', 'MA9', 'Es CO₂ disuelto en agua: dos sustancias mezcladas, que se separan al destapar la botella.', 'El agua gasificada es una mezcla homogénea.'),
    ] },
    // ===== Tabla periódica =====
    { id: 'ion-sodio', unidad: 'quimica.tabla-periodica', nombre: 'los átomos y sus iones', props: [
      V('sod1', 'El átomo de sodio (Z = 11) tiene un solo electrón en su último nivel: 3s¹.', 'Su configuración es 1s² 2s² 2p⁶ 3s¹.'),
      V('sod2', 'El ion Na⁺ tiene 10 electrones y la misma configuración electrónica que el neón.', 'Perdió el electrón 3s: queda 1s² 2s² 2p⁶.', 'QA-atomo-por-ion'),
      V('sod3', 'El ion Na⁺ y el átomo de sodio tienen el mismo número de protones.', 'Al formar un ion solo cambian los electrones; los 11 protones siguen.', 'QA-ion-cambia-protones'),
      V('sod4', 'En el cuerpo humano, el sodio está como ion Na⁺ disuelto, no como sodio metálico.', 'El sodio metálico reaccionaría con el agua; en los líquidos del cuerpo hay iones Na⁺.', 'QA-atomo-por-ion'),
      V('sod5', 'El radio del ion Na⁺ es menor que el del átomo de sodio, porque el ion perdió su último nivel.', 'Queda con dos niveles y los mismos 11 protones.', 'QA-radio-ion'),
      F('sod7', 'El ion Na⁺ tiene 12 electrones, porque ganó un electrón.', 'QA-atomo-por-ion', 'La carga positiva indica que perdió un electrón: 11 − 1 = 10.', 'El ion Na⁺ tiene 10 electrones: el átomo perdió uno.'),
      F('sod8', 'El ion Na⁺ tiene la configuración 1s² 2s² 2p⁶ 3s¹.', 'QA-atomo-por-ion', 'Esa es la configuración del átomo neutro. El ion perdió el electrón 3s.', 'El ion Na⁺ tiene la configuración 1s² 2s² 2p⁶.'),
      F('sod9', 'El sodio de la sal de mesa reacciona con el agua igual que el sodio metálico.', 'QA-atomo-por-ion', 'En la sal el sodio está como Na⁺, que ya perdió su electrón: no reacciona con el agua como el metal.', 'El ion Na⁺ de la sal no reacciona con el agua como el sodio metálico; solo se disuelve.'),
      F('sod10', 'Al formar el ion Na⁺, el átomo de sodio pierde un protón.', 'QA-ion-cambia-protones', 'Si perdiera un protón dejaría de ser sodio. Lo que pierde es un electrón.', 'Al formar el ion Na⁺, el átomo de sodio pierde un electrón.'),
      F('sod12', 'El sodio está en el mismo periodo que el neón.', 'QA-periodo-del-ion', 'El neón está en el periodo 2 y el sodio en el 3. Lo que comparten es la configuración del ion Na⁺ con la del neón.', 'El sodio está en el periodo 3: el átomo neutro tiene electrones en el nivel 3.'),
      V('sol6', 'El ion cloruro (Cl⁻) es más grande que el átomo de cloro, porque tiene un electrón más con la misma carga nuclear.', 'Aumenta la repulsión entre electrones y la nube electrónica se expande.', 'QA-radio-ion'),
      F('sol9', 'El ion cloruro se forma cuando el átomo de cloro pierde un electrón.', 'QA-anion-pierde', 'Un anión tiene carga negativa: el cloro gana un electrón.', 'El ion cloruro se forma cuando el átomo de cloro gana un electrón.'),
      F('sol10', 'El ion Cl⁻ es más pequeño que el átomo de cloro, porque tiene carga.', 'TP4', 'Con un electrón más y la misma carga nuclear, la repulsión entre electrones aumenta y la nube se expande.', 'El ion Cl⁻ es más grande que el átomo de cloro.'),
    ] },
    // ===== Líquidos y sólidos =====
    { id: 'liquidos', unidad: 'quimica.liquidos-y-solidos', nombre: 'la viscosidad, la tensión superficial y la presión de vapor', props: [
      V('liq1', 'Un líquido de moléculas largas y flexibles, que se enredan entre sí, suele ser muy viscoso.', 'Las moléculas enredadas no se deslizan con facilidad unas sobre otras.', 'QA-viscosidad-esferica'),
      V('liq2', 'La glicerina es más viscosa que el agua: sus moléculas son más grandes y tienen tres grupos OH que forman puentes de hidrógeno.', 'Moléculas más grandes y con más puntos de atracción se deslizan peor unas sobre otras.'),
      V('liq4', 'En general, cuanto más fuertes son las fuerzas intermoleculares de un líquido, mayor es su tensión superficial.', 'Las moléculas de la superficie son jaladas con más fuerza hacia el interior.'),
      V('liq5', 'A una misma temperatura, el líquido más volátil tiene la mayor presión de vapor.', 'Más moléculas escapan al vapor cuando las fuerzas entre ellas son débiles.', 'QA-pvapor-volatil'),
      V('liq6', 'El agua tiene mayor tensión superficial que el etanol, porque forma más puentes de hidrógeno por molécula.', 'Las moléculas de la superficie son jaladas con más fuerza hacia el interior.'),
      F('liq9', 'Los líquidos de moléculas pequeñas y casi esféricas son los más viscosos.', 'QA-viscosidad-esferica', 'Las moléculas pequeñas y redondeadas ruedan con facilidad unas sobre otras: dan líquidos poco viscosos.', 'Los líquidos de moléculas largas que se enredan, o con muchas fuerzas entre ellas, son los más viscosos.'),
      F('liq10', 'Un líquido con mayor presión de vapor es menos volátil.', 'QA-pvapor-volatil', 'Mayor presión de vapor significa que más moléculas pasan al vapor: es más volátil.', 'Un líquido con mayor presión de vapor es más volátil.'),
      F('liq11', 'La presión de vapor de un líquido depende del tamaño del recipiente que lo contiene.', 'GQ18', 'A una temperatura dada, la presión de vapor de un líquido puro es fija.', 'La presión de vapor depende de la temperatura y del líquido, no del recipiente.'),
      F('liq12', 'Al agregarle jabón, la tensión superficial del agua aumenta.', 'QA-tension-jabon', 'El jabón se acomoda en la superficie y debilita las atracciones entre las moléculas de agua.', 'El jabón disminuye la tensión superficial del agua.'),
      F('liq15', 'A 25 °C, el etanol tiene menor presión de vapor que el agua.', 'QA-pvapor-volatil', 'El etanol es más volátil que el agua: a 25 °C su presión de vapor es mayor.', 'A 25 °C, el etanol tiene mayor presión de vapor que el agua.'),
    ] },
    { id: 'solidos', unidad: 'quimica.liquidos-y-solidos', nombre: 'los sólidos cristalinos y amorfos', props: [
      V('sol1', 'En un sólido cristalino, las partículas se ordenan en un patrón que se repite en el espacio.', 'Ese orden de largo alcance es lo que define al cristal.', 'QA-amorfo-cristalino'),
      V('sol2', 'El cloruro de sodio sólido es cristalino: sus iones forman una red ordenada.', 'Cada Na⁺ queda rodeado de seis Cl⁻ y cada Cl⁻ de seis Na⁺.', 'QA-ionico-amorfo'),
      V('sol3', 'El vidrio común es un sólido amorfo.', 'Sus partículas no tienen un orden que se repita; se ablanda en un intervalo de temperaturas.', 'QA-amorfo-cristalino'),
      V('sol5', 'La celda unitaria es la unidad de la red que, repetida en el espacio, reproduce todo el cristal.', 'Es como el ladrillo con que se arma el cristal.'),
      F('sol8', 'La sal común es un sólido amorfo, porque sus granos tienen formas distintas.', 'QA-ionico-amorfo', 'Cada grano es un cristal (o varios): por dentro, los iones siguen una red ordenada.', 'La sal común es un sólido cristalino.'),
      F('sol11', 'El vidrio es un sólido cristalino.', 'QA-amorfo-cristalino', 'La dureza y la transparencia no dicen nada del orden interno: el vidrio no tiene red ordenada.', 'El vidrio es un sólido amorfo.'),
      F('sol13', 'El cloruro de sodio sólido está formado por moléculas de NaCl separadas.', 'EN1', 'Es una red de iones: cada ion atrae a todos sus vecinos de carga opuesta, sin moléculas sueltas.', 'El cloruro de sodio sólido es una red de iones Na⁺ y Cl⁻.'),
      F('sol14', 'En un sólido amorfo, las partículas forman una red ordenada que se repite en todo el sólido.', 'QA-amorfo-cristalino', 'Ese orden que se repite es el de los sólidos cristalinos. En un amorfo, como el vidrio, no hay un patrón repetido.', 'En un sólido amorfo, las partículas no siguen un patrón que se repita.'),
    ] },
    // ===== Ambiente =====
    { id: 'esferas', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'la atmósfera, la hidrósfera y la litósfera', props: [
      V('esf1', 'La hidrósfera comprende toda el agua del planeta: océanos, ríos, lagos, aguas subterráneas y hielo.', 'El hielo de glaciares y casquetes también es parte de la hidrósfera.', 'QA-hielo-fuera'),
      V('esf2', 'La mayor parte del agua de la hidrósfera es agua salada de los océanos.', 'Cerca del 97 % del agua del planeta es salada.'),
      V('esf3', 'La litósfera es la capa rocosa externa de la Tierra: la corteza y la parte superior del manto.', 'Es la capa sólida y rígida sobre la que están los continentes y el fondo de los océanos.'),
      V('esf4', 'El nitrógeno (N₂) es el gas más abundante de la atmósfera.', 'Es cerca del 78 % del aire seco en volumen; el O₂, cerca del 21 %.', 'QA-aire-oxigeno'),
      V('esf5', 'La capa de ozono se encuentra en la estratósfera.', 'Allí el O₃ absorbe gran parte de la radiación ultravioleta del Sol.', 'QA-ozono-troposfera'),
      F('esf8', 'El oxígeno (O₂) es el gas más abundante de la atmósfera.', 'QA-aire-oxigeno', 'El O₂ es cerca del 21 % del aire seco; el N₂, cerca del 78 %.', 'El gas más abundante de la atmósfera es el nitrógeno (N₂).'),
      F('esf9', 'La mayor parte del agua dulce del planeta está en los ríos y los lagos.', 'QA-agua-dulce-rios', 'Casi toda el agua dulce está en glaciares y casquetes de hielo, y en el subsuelo; ríos y lagos tienen una parte muy pequeña.', 'La mayor parte del agua dulce está congelada en glaciares y casquetes, y en el subsuelo.'),
      F('esf10', 'La capa de ozono está en la tropósfera, donde se forman las nubes.', 'QA-ozono-troposfera', 'La tropósfera es la capa más baja; la capa de ozono está más arriba, en la estratósfera.', 'La capa de ozono está en la estratósfera.'),
      F('esf12', 'La hidrósfera solo incluye el agua líquida; el hielo de los glaciares es parte de la litósfera.', 'QA-hielo-fuera', 'La hidrósfera incluye el agua en todos sus estados, también el hielo.', 'El hielo de los glaciares es parte de la hidrósfera.'),
    ] },
    { id: 'contaminantes', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'los contaminantes del aire y la lluvia ácida', props: [
      V('con1', 'Un contaminante primario es el que se emite directamente desde su fuente, como el CO del escape de un auto.', 'Sale tal cual de la fuente; no se forma después en el aire.', 'QA-secundario-primario'),
      V('con2', 'El ozono cercano al suelo es un contaminante secundario: se forma en el aire a partir de otros contaminantes y la luz solar.', 'Se forma con los NOₓ y los hidrocarburos del tráfico, con luz solar (smog fotoquímico).', 'QA8'),
      V('con3', 'El SO₂ que sale al quemar carbón o petróleo con azufre es un contaminante primario.', 'Sale directamente de la combustión.'),
      V('con4', 'El ácido sulfúrico de la lluvia ácida es un contaminante secundario, porque se forma en el aire a partir del SO₂.', 'El SO₂ se oxida y se disuelve en las gotas de agua.', 'QA-secundario-primario'),
      V('con6', 'Un volcán puede emitir SO₂: también hay contaminantes de origen natural.', 'Los volcanes, los incendios forestales y el polvo también aportan contaminantes.', 'QA-solo-humano'),
      F('con8', 'El ozono cercano al suelo es un contaminante primario, porque lo emiten directamente los autos.', 'QA8', 'Los autos emiten NOₓ e hidrocarburos; el ozono se forma después en el aire, con la luz solar.', 'El ozono cercano al suelo es un contaminante secundario.'),
      F('con9', 'La lluvia ácida se debe sobre todo al CO₂.', 'QA4', 'El CO₂ forma ácido carbónico, que es débil: la lluvia normal ya tiene pH cerca de 5,6. La lluvia ácida viene del SO₂ y de los NOₓ.', 'La lluvia ácida se debe sobre todo al SO₂ y a los NOₓ.'),
      F('con10', 'Todos los contaminantes del aire provienen de la actividad humana.', 'QA-solo-humano', 'Los volcanes emiten SO₂ y ceniza, y los incendios forestales emiten humo y CO.', 'Hay contaminantes del aire de origen humano y de origen natural.'),
      F('con12', 'El monóxido de carbono es un contaminante secundario.', 'QA-secundario-primario', 'El CO sale directamente de una combustión incompleta: es primario.', 'El monóxido de carbono es un contaminante primario.'),
      F('con13', 'La lluvia ácida sube el pH de los lagos y los suelos.', 'QA-lluvia-ph', 'Lo ácido baja el pH: los lagos y los suelos se acidifican.', 'La lluvia ácida baja el pH de los lagos y los suelos.'),
    ] },
    { id: 'tendencia', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'lo que dicen esos datos del glaciar',
      contexto: 'Un informe dice que el glaciar de un nevado andino tenía 30 km² en 1980, 24 km² en 1995, 20 km² en 2005 y 12 km² en 2020.', props: [
      V('ten1', 'Entre 1980 y 2020, el glaciar perdió 18 km².', '30 − 12 = 18 km².', 'QA-intervalo-mal-leido'),
      V('ten2', 'Entre 1980 y 2020, el glaciar perdió el 60 % del área que tenía en 1980.', '18 ÷ 30 = 0,6, es decir, el 60 %.', 'QA-absoluto-por-porcentaje'),
      V('ten3', 'Entre 2005 y 2020 se perdió más área que entre 1980 y 1995.', '20 − 12 = 8 km² contra 30 − 24 = 6 km², en intervalos de 15 años los dos.', 'QA-intervalo-mal-leido'),
      V('ten5', 'El glaciar retrocedió más rápido entre 2005 y 2020 que entre 1995 y 2005.', '8 km² en 15 años (más de 0,5 km² por año) contra 4 km² en 10 años (0,4 km² por año).', 'QA-tendencia-lineal'),
      V('ten10', 'Entre 1995 y 2020, el glaciar perdió la mitad del área que tenía en 1995.', 'Pasó de 24 km² a 12 km²: perdió 12 km², la mitad.', 'QA-base-equivocada'),
      F('ten6', 'Entre 1995 y 2005, el glaciar perdió 6 km².', 'QA-intervalo-mal-leido', 'De 24 km² a 20 km² hay 4 km². Los 6 km² son del intervalo 1980–1995.', 'Entre 1995 y 2005, el glaciar perdió 4 km².'),
      F('ten7', 'Entre 1980 y 2020, el glaciar perdió el 18 % de su área.', 'QA-absoluto-por-porcentaje', 'Perdió 18 km², que no es lo mismo que el 18 %: 18 ÷ 30 = 60 %.', 'Entre 1980 y 2020, el glaciar perdió 18 km², el 60 % de su área.'),
      F('ten8', 'En 2020, el glaciar tenía el 40 % del área que tenía en 1995.', 'QA-base-equivocada', 'El 40 % es 12 ÷ 30, sobre el área de 1980. Sobre la de 1995: 12 ÷ 24 = 50 %.', 'En 2020, el glaciar tenía el 50 % del área que tenía en 1995.'),
      F('ten9', 'De 1980 a 2020, el glaciar perdió área siempre al mismo ritmo.', 'QA-tendencia-lineal', 'Hasta 2005 perdió 0,4 km² por año; de 2005 a 2020, más de 0,5 km² por año.', 'De 2005 a 2020 el glaciar retrocedió más rápido que antes.'),
      F('ten11', 'Entre 2005 y 2020, el área del glaciar se redujo a la mitad.', 'QA-intervalo-mal-leido', 'De 20 km² a 12 km² perdió 8 km², el 40 %: quedó el 60 %.', 'Entre 2005 y 2020, el glaciar perdió el 40 % de su área.'),
    ] },
    // ===== Nomenclatura inorgánica =====
    { id: 'oxidos', unidad: 'quimica.nomenclatura-inorganica', nombre: 'los óxidos, los ácidos y sus nombres tradicionales', props: [
      V('oxi1', 'El CO₂ es un óxido ácido, porque con agua forma ácido carbónico.', 'CO₂ + H₂O → H₂CO₃.', 'QA-caracter-oxido'),
      V('oxi2', 'El CaO es un óxido básico: con agua forma hidróxido de calcio.', 'CaO + H₂O → Ca(OH)₂.', 'QA-caracter-oxido'),
      V('oxi3', 'En general, los óxidos de los no metales son ácidos y los de los metales activos son básicos.', 'Los de no metales dan ácidos con agua; los de metales activos, hidróxidos.', 'QA-caracter-oxido'),
      V('oxi4', 'En la nomenclatura tradicional, el sufijo -ico indica el mayor de dos estados de oxidación.', 'Y el sufijo -oso, el menor: férrico (+3) y ferroso (+2).', 'NO2'),
      V('oxi5', 'El FeCl₃ se llama cloruro férrico en la nomenclatura tradicional.', 'El hierro actúa con +3, su mayor estado de oxidación común.', 'NO2'),
      F('oxi8', 'El SO₂ es un óxido básico.', 'QA-caracter-oxido', 'Todo óxido contiene oxígeno. El SO₂ es óxido de un no metal: con agua forma ácido sulfuroso.', 'El SO₂ es un óxido ácido (anhídrido sulfuroso).'),
      F('oxi9', 'El sufijo -oso indica el mayor estado de oxidación del metal.', 'NO2', 'Es al revés: -oso para el menor, -ico para el mayor.', 'El sufijo -oso indica el menor estado de oxidación del metal.'),
      F('oxi10', 'El FeO se llama óxido férrico.', 'NO2', 'En el FeO el hierro tiene +2, su menor estado común: lleva -oso.', 'El FeO se llama óxido ferroso.'),
      F('oxi11', 'El Na₂O forma un ácido al reaccionar con agua.', 'QA-caracter-oxido', 'Es el óxido de un metal activo: con agua forma NaOH, una base.', 'El Na₂O forma hidróxido de sodio al reaccionar con agua: es un óxido básico.'),
      F('oxi13', 'El ácido sulfúrico tiene la fórmula H₂SO₃.', 'NO2', 'El H₂SO₃ es el ácido sulfuroso (S con +4); el sulfúrico es H₂SO₄ (S con +6).', 'El ácido sulfúrico tiene la fórmula H₂SO₄.'),
    ] },
    { id: 'sales-acidas', unidad: 'quimica.nomenclatura-inorganica', nombre: 'las sales ácidas', props: [
      V('hid4', 'El NaHCO₃ es una sal ácida, porque su anión conserva un hidrógeno del ácido carbónico.', 'El H₂CO₃ cambió solo uno de sus dos hidrógenos por sodio.', 'QA-sal-acida-basica'),
      V('hid5', 'Una sal ácida se forma cuando solo una parte de los hidrógenos ácidos de un ácido es reemplazada por un metal.', 'Por eso solo la forman los ácidos con dos o más hidrógenos ácidos.', 'QA-sal-acida-basica'),
      F('hid9', 'El NaHCO₃ es una sal básica, porque contiene grupos OH⁻.', 'QA-sal-acida-basica', 'El NaHCO₃ no tiene OH⁻; tiene un H del ácido que no fue reemplazado.', 'El NaHCO₃ es una sal ácida.'),
      F('hid13', 'El NaHSO₄ es una sal neutra.', 'QA-sal-acida-basica', 'El anión HSO₄⁻ conserva un hidrógeno del ácido sulfúrico: es una sal ácida.', 'El NaHSO₄ es una sal ácida.'),
      V('hid7', 'El KHSO₄ es una sal ácida.', 'Su anión, HSO₄⁻, conserva uno de los dos hidrógenos del ácido sulfúrico.', 'QA-sal-acida-basica'),
      V('hid16', 'El NaH₂PO₄ es una sal ácida: su anión conserva dos hidrógenos del ácido fosfórico.', 'El H₃PO₄ tiene tres hidrógenos ácidos y solo uno fue reemplazado por sodio.', 'QA-sal-acida-basica'),
      F('hid12', 'Una sal ácida es la que se obtiene de un ácido fuerte.', 'QA-sal-acida-basica', 'Lo que hace ácida a la sal es que conserve hidrógenos ácidos del ácido, fuerte o débil: el NaHCO₃ viene del ácido carbónico, que es débil.', 'Una sal ácida conserva en su anión algún hidrógeno ácido del ácido del que proviene.'),
      F('hid17', 'El ácido clorhídrico (HCl) puede formar sales ácidas.', 'QA-sal-acida-basica', 'El HCl tiene un solo hidrógeno ácido: al reemplazarlo no queda ninguno. Solo los ácidos con dos o más hidrógenos ácidos forman sales ácidas.', 'El HCl no forma sales ácidas, porque tiene un solo hidrógeno ácido.'),
    ] },
    // ===== Recursos naturales =====
    { id: 'metalurgia', unidad: 'quimica.recursos-naturales', nombre: 'los procesos metalúrgicos', props: [
      V('met1', 'La tostación calienta un sulfuro metálico con aire y libera dióxido de azufre.', 'Por ejemplo, 2 ZnS + 3 O₂ → 2 ZnO + 2 SO₂.', 'QA-proceso-metalurgico'),
      V('met2', 'En la flotación, la mena se separa de la ganga porque sus partículas se pegan a burbujas y suben con la espuma.', 'Es un método para concentrar el mineral; no cambia su composición química.', 'QA-proceso-metalurgico'),
      V('met3', 'En la lixiviación, el metal pasa a una solución acuosa al tratar el mineral con un reactivo, como el ácido sulfúrico en el cobre.', 'Después el metal se recupera de la solución.', 'QA-proceso-metalurgico'),
      V('met4', 'En el alto horno, el monóxido de carbono reduce el óxido de hierro a hierro metálico.', 'Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂; el CO sale del coque.', 'QA-reductor-alto-horno'),
      V('met7', 'En la electrorrefinación del cobre, el cobre puro se deposita en el cátodo.', 'El cobre impuro es el ánodo: se oxida y pasa a la solución; en el cátodo se reduce Cu²⁺ a cobre puro.', 'QA-proceso-metalurgico'),
      F('met8', 'La tostación consiste en disolver el metal del mineral en un ácido.', 'QA-proceso-metalurgico', 'Disolver el metal con un reactivo es la lixiviación. La tostación calienta el mineral con aire.', 'La tostación calienta un sulfuro con aire y lo convierte en óxido.'),
      F('met9', 'El gas que se libera en la tostación de los sulfuros es el anhídrido sulfúrico (SO₃).', 'QA-so2-so3', 'Sale SO₂, el dióxido de azufre o anhídrido sulfuroso. El SO₃ es el anhídrido sulfúrico.', 'El gas que se libera en la tostación de los sulfuros es el SO₂ (anhídrido sulfuroso).'),
      F('met10', 'En el alto horno, el agente reductor del óxido de hierro es el oxígeno del aire.', 'QA-reductor-alto-horno', 'El oxígeno es un oxidante. El reductor es el CO (y el carbono del coque).', 'En el alto horno, el agente reductor del óxido de hierro es el monóxido de carbono.'),
      F('met11', 'La flotación es un proceso químico que convierte el sulfuro en metal puro.', 'QA-proceso-metalurgico', 'La flotación solo separa la mena de la ganga; el sulfuro sigue siendo sulfuro.', 'La flotación concentra el mineral: separa la mena de la ganga sin convertirla en metal.'),
      F('met12', 'En la electrorrefinación del cobre, el cobre puro se obtiene en el ánodo.', 'QA-proceso-metalurgico', 'En el ánodo el cobre impuro se oxida y se disuelve; el cobre puro se deposita en el cátodo.', 'En la electrorrefinación del cobre, el cobre puro se obtiene en el cátodo.'),
    ] },
    { id: 'polimeros', unidad: 'quimica.recursos-naturales', nombre: 'los polímeros, los aromáticos y la combustión', props: [
      V('pol1', 'El polietileno se obtiene por polimerización de adición del eteno (etileno).', 'n CH₂=CH₂ → (–CH₂–CH₂–)ₙ.', 'QA-adicion-condensacion'),
      V('pol2', 'En la polimerización por adición de un alqueno, el doble enlace C=C se abre para que los monómeros se unan en cadena.', 'Cada monómero se suma entero a la cadena.', 'QA-adicion-condensacion'),
      V('pol3', 'La polimerización por adición no libera agua, porque cada monómero se suma entero a la cadena.', 'Eso la distingue de la polimerización por condensación.', 'QA-adicion-condensacion'),
      V('pol4', 'El naftaleno, con dos anillos bencénicos fusionados, es un hidrocarburo aromático policíclico.', 'Comparte electrones π deslocalizados en sus dos anillos.', 'QA-anillos-aromatico'),
      V('pol5', 'La combustión incompleta de un hidrocarburo puede producir monóxido de carbono y hollín.', 'Ocurre cuando falta oxígeno.', 'QA-combustion-incompleta'),
      F('pol8', 'Todo compuesto con varios anillos de carbono es aromático.', 'QA-anillos-aromatico', 'Para ser aromático, el anillo debe tener electrones π deslocalizados, como el benceno. Los esteroides tienen varios anillos y no son aromáticos.', 'Un compuesto con varios anillos es aromático solo si sus anillos tienen electrones π deslocalizados, como los del benceno.'),
      F('pol9', 'En la polimerización por adición del eteno se libera una molécula de agua por cada unión.', 'QA-adicion-condensacion', 'Soltar agua en cada unión es propio de la condensación (como en el nailon o el poliéster).', 'En la polimerización por adición del eteno no se libera ninguna molécula.'),
      F('pol11', 'La combustión incompleta del metano produce solo CO₂ y agua.', 'QA-combustion-incompleta', 'CO₂ y agua son los productos de la combustión completa. Con poco oxígeno se forma también CO o carbono (hollín).', 'La combustión incompleta del metano produce también CO o hollín.'),
      F('pol12', 'El ciclohexano es un hidrocarburo aromático.', 'QA-anillos-aromatico', 'El ciclohexano solo tiene enlaces simples: es un hidrocarburo saturado, no aromático.', 'El ciclohexano es un cicloalcano: no es aromático.'),
      F('pol13', 'Todos los polímeros son sintéticos: en la naturaleza no hay polímeros.', 'QA14', 'Las proteínas, el almidón, la celulosa y el caucho natural son polímeros naturales.', 'Hay polímeros sintéticos, como el polietileno, y naturales, como la celulosa.'),
    ] },
    // ===== Electroquímica =====
    { id: 'pilas', unidad: 'quimica.electroquimica', nombre: 'la batería de plomo y las celdas de combustible', props: [
      V('pil1', 'En la batería de plomo, al descargarse, el plomo metálico (Pb) se oxida en el ánodo.', 'Pb pasa de 0 a +2 y forma PbSO₄.', 'EC9'),
      V('pil2', 'En la batería de plomo, el PbO₂ se reduce durante la descarga, porque el plomo pasa de +4 a +2.', 'Bajar el estado de oxidación es ganar electrones.', 'EC9'),
      V('pil3', 'El electrolito de la batería de plomo es una solución de ácido sulfúrico.', 'Sus iones llevan la carga entre las placas.'),
      V('pil5', 'La batería de plomo es recargable: al cargarla, una corriente externa invierte la reacción.', 'Al cargar funciona como celda electrolítica.', 'EC8'),
      V('pil6', 'En una celda de combustible de hidrógeno y oxígeno, el hidrógeno se oxida en el ánodo.', 'H₂ → 2 H⁺ + 2 e⁻ (en medio ácido).', 'EC9'),
      V('pil9', 'En una celda de combustible, el oxígeno acepta electrones: se reduce en el cátodo.', 'Aceptar electrones es reducirse.', 'EC9'),
      F('pil10', 'En la batería de plomo, el PbO₂ se oxida porque acepta electrones.', 'EC9', 'Aceptar electrones es reducirse, no oxidarse.', 'En la batería de plomo, el PbO₂ acepta electrones: se reduce.'),
      F('pil11', 'Durante la descarga de la batería de plomo, la concentración del ácido sulfúrico aumenta.', 'QA-acido-descarga', 'Los dos electrodos consumen iones sulfato para formar PbSO₄: el ácido se diluye.', 'Durante la descarga, la concentración del ácido sulfúrico disminuye.'),
      F('pil12', 'Una celda de combustible necesita una fuente de corriente externa para funcionar.', 'EC8', 'Es una celda galvánica: produce corriente con una reacción espontánea mientras recibe combustible.', 'Una celda de combustible produce corriente; no necesita una fuente externa.'),
      F('pil13', 'Una celda de combustible que funciona de modo espontáneo tiene fem negativa.', 'EC8', 'Una celda galvánica espontánea tiene fem positiva.', 'Una celda que funciona de modo espontáneo tiene fem positiva.'),
      F('pil15', 'En la batería de plomo, los electrones viajan por el ácido sulfúrico de un electrodo al otro.', 'EC2', 'Los electrones van por el circuito externo; dentro de la solución se mueven iones.', 'Los electrones van por el circuito externo; en el ácido sulfúrico se mueven iones.'),
    ] },
    // ===== Equilibrio químico =====
    { id: 'equilibrio-sangre', unidad: 'quimica.equilibrio-quimico', nombre: 'los equilibrios heterogéneos y la solución reguladora del ácido carbónico', props: [
      V('eqs1', 'CaCO₃(s) ⇌ CaO(s) + CO₂(g) es un equilibrio heterogéneo: hay sustancias en más de una fase.', 'Hay dos sólidos y un gas.', 'EQ13'),
      V('eqs2', 'En la constante de equilibrio de CaCO₃(s) ⇌ CaO(s) + CO₂(g) solo aparece el CO₂, porque los sólidos puros no entran en K.', 'Kc = [CO₂].', 'EQ13'),
      V('eqs3', 'El ácido carbónico es un ácido débil: en agua se disocia solo en parte.', 'H₂CO₃ ⇌ H⁺ + HCO₃⁻ queda muy desplazado a la izquierda.', 'QA-negar-verdadera'),
      V('eqs4', 'En la sangre, el par H₂CO₃ / HCO₃⁻ forma una solución reguladora que limita los cambios de pH.', 'Es el principal sistema regulador de la sangre.'),
      V('eqs5', 'Si a una solución reguladora de H₂CO₃ y HCO₃⁻ se le agrega un poco de ácido, el HCO₃⁻ reacciona con los H⁺ añadidos.', 'HCO₃⁻ + H⁺ → H₂CO₃: el pH casi no cambia.'),
      V('eqs7', 'Una solución reguladora amortigua el pH al agregar pequeñas cantidades de ácido o de base, pero no cantidades grandes.', 'Su capacidad se acaba cuando se gasta uno de los componentes del par.', 'QA-buffer-infinito'),
      F('eqs8', 'En un equilibrio heterogéneo, los sólidos puros sí aparecen en la expresión de K.', 'EQ13', 'La concentración de un sólido puro no cambia: se omite en K.', 'En un equilibrio heterogéneo, los sólidos y los líquidos puros no aparecen en la expresión de K.'),
      F('eqs9', 'Solo hay equilibrio químico cuando todas las sustancias están en la misma fase.', 'EQ13', 'Hay equilibrios heterogéneos, como CaCO₃(s) ⇌ CaO(s) + CO₂(g).', 'Puede haber equilibrio entre sustancias de fases distintas: es un equilibrio heterogéneo.'),
      F('eqs10', 'El ácido carbónico es un ácido fuerte: en agua se disocia por completo.', 'AB3', 'El ácido carbónico es débil; solo una pequeña parte se disocia.', 'El ácido carbónico es un ácido débil: se disocia solo en parte.'),
      F('eqs11', 'Una solución reguladora mantiene el pH constante aunque se le agregue cualquier cantidad de ácido.', 'QA-buffer-infinito', 'Si el ácido agregado gasta todo el HCO₃⁻, el pH cae.', 'Una solución reguladora amortigua solo cantidades pequeñas de ácido o de base.'),
      F('eqs12', 'Cuando el ácido carbónico llega al equilibrio, su disociación se detiene.', 'EQ3', 'El equilibrio es dinámico: la disociación y la reacción inversa siguen, con la misma velocidad.', 'En el equilibrio, la disociación y la reacción inversa siguen ocurriendo con la misma velocidad.'),
    ] },
    // ===== Ácidos y bases =====
    { id: 'lewis-bronsted', unidad: 'quimica.acidos-y-bases', nombre: 'los ácidos y las bases de Brønsted y de Lewis', props: [
      V('lb1', 'Según Lewis, una base es una especie que dona un par de electrones.', 'Y un ácido de Lewis es el que acepta ese par.', 'QA-lewis-invertido'),
      V('lb2', 'El amoníaco (NH₃) es una base de Lewis, porque el nitrógeno tiene un par de electrones libre.', 'Ese par puede formar un enlace con un H⁺ o con otra especie que lo acepte.', 'AB1'),
      V('lb3', 'Según Brønsted y Lowry, una base es una especie que acepta un protón (H⁺).', 'Y un ácido es el que lo cede.'),
      V('lb4', 'A 25 °C, una solución acuosa de amoníaco tiene pH mayor que 7, porque el amoníaco produce iones OH⁻ al reaccionar con el agua.', 'Aunque es una base débil, el NH₃ toma protones del agua: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻.', 'QA-base-debil-acida'),
      V('lb8', 'Una sal formada por una base débil y un ácido fuerte, como el NH₄Cl, da una solución ácida.', 'El NH₄⁺ cede protones al agua.', 'AB9'),
      F('lb9', 'Una base débil en agua da una solución de pH menor que 7, porque es débil.', 'QA-base-debil-acida', 'Débil no es ácida: la base produce OH⁻, aunque poco, y el pH queda mayor que 7.', 'Una base débil en agua da una solución de pH mayor que 7.'),
      F('lb10', 'Una sustancia sin el grupo OH en su fórmula no puede ser una base.', 'AB1', 'El NH₃ y las aminas no tienen OH y son bases: aceptan protones.', 'Una sustancia puede ser base sin tener OH, como el amoníaco.'),
      F('lb11', 'Según Lewis, un ácido es una especie que dona un par de electrones.', 'QA-lewis-invertido', 'Es al revés: el ácido de Lewis acepta el par y la base lo dona.', 'Según Lewis, un ácido es una especie que acepta un par de electrones.'),
      F('lb13', 'El amoníaco es una base fuerte porque acepta protones.', 'AB3', 'Aceptar protones lo hace base; que acepte pocos lo hace débil.', 'El amoníaco es una base débil.'),
      F('lb14', 'Toda sal disuelta en agua da una solución neutra.', 'AB9', 'El NH₄Cl da una solución ácida y el acetato de sodio, una básica.', 'Algunas sales dan soluciones ácidas o básicas, porque sus iones reaccionan con el agua.'),
    ] },
    // ===== Enlace químico =====
    { id: 'tipo-solido', unidad: 'quimica.enlace-quimico', nombre: 'los tipos de sólidos y sus propiedades', props: [
      V('ts1', 'Un sólido iónico no conduce la corriente en estado sólido, porque sus iones están fijos en la red.', 'Fundido o disuelto en agua, sus iones se mueven y sí conduce.', 'QA-ionico-conduce'),
      V('ts2', 'Los metales conducen la corriente en estado sólido gracias a sus electrones deslocalizados.', 'Los electrones de valencia se mueven por toda la red.'),
      V('ts3', 'El diamante, un sólido covalente de red, es muy duro y tiene una temperatura de fusión muy alta.', 'Para fundirlo hay que romper enlaces covalentes en toda la red.', 'QA-covalente-bajo'),
      V('ts4', 'Los sólidos moleculares, como el hielo o el yodo, suelen tener temperaturas de fusión bajas.', 'Al fundirlos solo se vencen las fuerzas entre moléculas.', 'EN13'),
      V('ts7', 'El grafito conduce la corriente porque tiene electrones deslocalizados en sus capas.', 'Cada carbono usa tres electrones en enlaces y el cuarto queda deslocalizado.', 'EN17'),
      F('ts8', 'Todo sólido que conduce la corriente en estado sólido es iónico.', 'QA-ionico-conduce', 'Los sólidos iónicos no conducen en estado sólido; conducen los metales (y el grafito).', 'Un sólido que conduce la corriente en estado sólido suele ser metálico; los iónicos no conducen en estado sólido.'),
      F('ts9', 'El NaCl sólido conduce la corriente porque está formado por iones.', 'QA-ionico-conduce', 'Sus iones están fijos en la red: no pueden llevar carga hasta que se funde o se disuelve.', 'El NaCl conduce la corriente fundido o disuelto, no en estado sólido.'),
      F('ts10', 'Los sólidos covalentes de red, como el diamante, funden a temperaturas bajas.', 'QA-covalente-bajo', 'Funden bajo los sólidos moleculares, donde solo se vencen fuerzas entre moléculas. En una red hay que romper enlaces covalentes.', 'Los sólidos covalentes de red funden a temperaturas muy altas.'),
      F('ts11', 'Todos los sólidos moleculares son solubles en agua.', 'QA-molecular-soluble', 'El yodo y la naftalina son moleculares y casi no se disuelven en agua.', 'Algunos sólidos moleculares se disuelven en agua, como el azúcar, y otros no, como el yodo.'),
      F('ts12', 'El grafito conduce la corriente porque sus átomos de carbono se mueven sueltos.', 'EN17', 'Los átomos están fijos en las capas; lo que se mueve son electrones deslocalizados.', 'El grafito conduce porque tiene electrones deslocalizados en sus capas.'),
    ] },
    { id: 'ionicos', unidad: 'quimica.enlace-quimico', nombre: 'los sólidos iónicos y sus iones', props: [
      V('ion1', 'En un sólido iónico, cada ion está rodeado de varios iones de carga opuesta.', 'La atracción es en todas las direcciones de la red.', 'EN1'),
      V('ion3', 'El ion bicarbonato (HCO₃⁻) tiene carga 1−.', 'Es el carbonato (2−) con un H⁺: 2− + 1 = 1−.', 'QA-carga-oxoanion'),
      V('ion4', 'El ion sulfato (SO₄²⁻) es un anión poliatómico.', 'Tiene cinco átomos con una carga total de 2−.', 'QA-anion-monoatomico'),
      V('ion5', 'Los sólidos iónicos son duros pero quebradizos: un golpe desplaza las capas de iones y quedan juntas cargas iguales.', 'La repulsión entre iones de igual carga parte el cristal.', 'QA-ionico-ductil'),
      V('ion6', 'El acetato de sodio es una sal con un anión orgánico.', 'El ion acetato, CH₃COO⁻, viene del ácido acético.', 'QA-sal-inorganica'),
      F('ion9', 'Los aniones siempre están formados por un solo átomo.', 'QA-anion-monoatomico', 'Hay aniones poliatómicos: sulfato (SO₄²⁻), nitrato (NO₃⁻), bicarbonato (HCO₃⁻).', 'Hay aniones monoatómicos, como el Cl⁻, y poliatómicos, como el SO₄²⁻.'),
      F('ion10', 'El ion bicarbonato tiene carga 2−, como el carbonato.', 'QA-carga-oxoanion', 'Con el H⁺ que conserva, la carga baja a 1−.', 'El ion bicarbonato (HCO₃⁻) tiene carga 1−.'),
      F('ion11', 'Los sólidos iónicos se pueden estirar en hilos, como los metales.', 'QA-ionico-ductil', 'Al deformarlos, quedan juntos iones de igual carga y el cristal se rompe.', 'Los sólidos iónicos son quebradizos; los metales sí se estiran en hilos.'),
      F('ion12', 'Todas las sales son compuestos inorgánicos.', 'QA-sal-inorganica', 'El acetato de sodio y los jabones son sales de aniones orgánicos.', 'Hay sales inorgánicas, como el NaCl, y orgánicas, como el acetato de sodio.'),
      F('ion13', 'En el NaCl, cada ion Na⁺ está unido solo al ion Cl⁻ que le quitó su electrón.', 'EN1', 'En la red, cada Na⁺ atrae por igual a sus seis Cl⁻ vecinos.', 'En el NaCl sólido, cada ion Na⁺ está rodeado de seis iones Cl⁻.'),
      F('ion14', 'El ion sulfato tiene la fórmula SO₃²⁻.', 'NO2', 'El SO₃²⁻ es el sulfito (-ito, del ácido sulfuroso); el sulfato es SO₄²⁻.', 'El ion sulfato tiene la fórmula SO₄²⁻.'),
    ] },
    { id: 'radicales', unidad: 'quimica.enlace-quimico', nombre: 'los radicales libres', props: [
      V('rad1', 'Un radical libre tiene al menos un electrón desapareado.', 'Esa es su definición.', 'QA-ion-radical'),
      V('rad2', 'En el radical hidroxilo (·OH) hay 7 electrones de valencia y el oxígeno no completa el octeto.', '6 del oxígeno y 1 del hidrógeno: un número impar.', 'EN3'),
      V('rad3', 'El monóxido de nitrógeno (NO) tiene un número impar de electrones de valencia: es un radical.', '5 del nitrógeno y 6 del oxígeno suman 11.', 'EN3'),
      V('rad4', 'El ion superóxido (O₂⁻) tiene un electrón desapareado.', '6 + 6 + 1 = 13 electrones de valencia: un número impar.', 'QA-peroxido-radical'),
      V('rad6', 'El ion hidróxido (OH⁻) no es un radical, porque todos sus electrones están apareados.', '6 + 1 + 1 = 8 electrones de valencia, en cuatro pares.', 'QA-ion-radical'),
      F('rad7', 'El ion peróxido (O₂²⁻) es un radical libre porque tiene carga.', 'QA-ion-radical', 'Tener carga no hace a un radical. El O₂²⁻ tiene 14 electrones de valencia, todos apareados.', 'El ion peróxido no es un radical: todos sus electrones están apareados.'),
      F('rad8', 'El radical hidroxilo (·OH) cumple el octeto, igual que el ion hidróxido.', 'EN3', 'Con 7 electrones de valencia el oxígeno queda con 7 a su alrededor; el OH⁻, con uno más, sí completa 8.', 'En el radical hidroxilo el oxígeno no completa el octeto: tiene un electrón desapareado.'),
      F('rad9', 'El peróxido de hidrógeno (H₂O₂) es un radical libre porque tiene un enlace O–O.', 'QA-peroxido-radical', 'El H₂O₂ tiene 14 electrones de valencia, todos apareados. Al romperse el enlace O–O sí se forman dos radicales ·OH.', 'El H₂O₂ no es un radical; al romperse su enlace O–O forma dos radicales ·OH.'),
      F('rad11', 'Una molécula con un número impar de electrones puede tener todos sus electrones apareados.', 'EN3', 'Con un número impar, al menos uno queda sin pareja.', 'Una molécula con un número impar de electrones tiene al menos un electrón desapareado.'),
      F('rad12', 'El ion hidroperóxido (HO₂⁻) es un radical libre.', 'QA-peroxido-radical', '1 + 6 + 6 + 1 = 14 electrones de valencia: todos apareados.', 'El ion hidroperóxido no es un radical; el radical es el hidroperoxilo neutro (HO₂·).'),
    ] },
    { id: 'hidruros', unidad: 'quimica.enlace-quimico', nombre: 'los pares libres y los enlaces de los hidruros no metálicos', props: [
      V('hid1', 'En el amoníaco (NH₃), el nitrógeno tiene un par de electrones libre.', 'De sus 5 electrones de valencia, 3 forman enlaces con los H y 2 quedan como par libre.', 'QA-hidruro-sin-pares'),
      V('hid2', 'El H₂S (sulfuro de hidrógeno) es un compuesto binario de hidrógeno y un no metal: sus enlaces S–H son covalentes.', 'El hidrógeno y el azufre son no metales y comparten electrones.', 'EN5'),
      V('hid3', 'En la molécula de agua, el oxígeno tiene dos pares de electrones libres, porque usa solo dos de sus seis electrones de valencia en enlaces.', 'De sus 6 electrones de valencia, 2 forman enlaces con los H y 4 quedan en dos pares.', 'QA-hidruro-sin-pares'),
      F('hid8', 'El amoníaco no tiene pares de electrones libres, porque todos los electrones del nitrógeno forman enlaces.', 'QA-hidruro-sin-pares', 'El nitrógeno tiene 5 electrones de valencia y solo 3 enlaces: le queda un par libre.', 'En el amoníaco, el nitrógeno tiene un par de electrones libre.'),
      F('hid10', 'El H₂S es un compuesto iónico, como el NaCl.', 'EN5', 'El H y el S son no metales: comparten electrones.', 'El H₂S es un compuesto covalente.'),
      F('hid11', 'En el agua, el oxígeno no tiene pares libres: sus seis electrones de valencia forman enlaces.', 'QA-hidruro-sin-pares', 'Solo forma dos enlaces (con 2 electrones suyos); los otros 4 quedan como dos pares libres.', 'En el agua, el oxígeno tiene dos pares de electrones libres.'),
      V('hid6', 'El HCl gaseoso es un compuesto covalente; en agua se ioniza.', 'Las moléculas de HCl comparten electrones; al disolverse, ceden H⁺ al agua.', 'EN5'),
      V('hid14', 'En el H₂S, el azufre tiene dos pares de electrones libres.', 'De sus 6 electrones de valencia, 2 forman enlaces con los H y 4 quedan en dos pares, como en el agua.', 'QA-hidruro-sin-pares'),
      F('hid15', 'El amoníaco es un compuesto iónico: el nitrógeno les quita los electrones a los hidrógenos.', 'EN5', 'El nitrógeno y el hidrógeno son no metales: comparten pares de electrones en enlaces covalentes polares.', 'El amoníaco es un compuesto covalente.'),
    ] },
    // ===== Biomoléculas =====
    { id: 'vitaminas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las vitaminas', props: [
      V('vit1', 'La vitamina C y las vitaminas del complejo B son hidrosolubles.', 'Se disuelven en agua y el exceso sale por la orina.', 'QA-vitamina-solubilidad'),
      V('vit2', 'Las vitaminas A, D, E y K son liposolubles.', 'Se disuelven en grasas y se pueden acumular en el cuerpo.', 'QA-vitamina-solubilidad'),
      V('vit4', 'Muchas vitaminas del complejo B forman parte de coenzimas.', 'Por ejemplo, la niacina del NAD⁺ y la riboflavina del FAD.', 'QA-vitamina-coenzima'),
      V('vit5', 'La niacina (vitamina B3) forma parte de la coenzima NAD⁺.', 'El NAD⁺ transporta electrones en la respiración celular.', 'QA-vitamina-coenzima'),
      V('vit6', 'La riboflavina (vitamina B2) forma parte del FAD.', 'El FAD también transporta electrones.', 'QA-vitamina-coenzima'),
      V('vit7', 'La vitamina D se forma en la piel por la acción de la luz ultravioleta sobre un derivado del colesterol.', 'El 7-deshidrocolesterol de la piel se convierte en vitamina D₃.', 'QA-ruta-vitamina-d'),
      V('vit8', 'La forma activa de la vitamina D se obtiene tras dos hidroxilaciones: primero en el hígado y después en el riñón.', 'Ruta: piel → hígado → riñón.', 'QA-ruta-vitamina-d'),
      F('vit12', 'Las vitaminas aportan energía al organismo, como los carbohidratos.', 'BM1', 'Las vitaminas no se «queman» para dar energía; muchas ayudan como coenzimas a las reacciones que la liberan.', 'Las vitaminas no aportan energía; muchas forman parte de coenzimas.'),
      F('vit13', 'La vitamina C es liposoluble y se almacena en el tejido graso.', 'QA-vitamina-solubilidad', 'La vitamina C es hidrosoluble: no se acumula en la grasa y el exceso se elimina.', 'La vitamina C es hidrosoluble.'),
      F('vit14', 'La vitamina D se activa primero en el riñón y después en el hígado.', 'QA-ruta-vitamina-d', 'El orden es el contrario: la primera hidroxilación es en el hígado y la segunda en el riñón.', 'La vitamina D se activa primero en el hígado y después en el riñón.'),
      F('vit15', 'La vitamina D que se forma en la piel ya es la forma activa: no necesita pasar por el hígado ni por el riñón.', 'QA-ruta-vitamina-d', 'La de la piel es inactiva; se activa con una hidroxilación en el hígado y otra en el riñón.', 'La vitamina D de la piel se activa después en el hígado y en el riñón.'),
      F('vit17', 'La niacina forma parte del FAD.', 'QA-vitamina-coenzima', 'La niacina forma parte del NAD⁺; el FAD viene de la riboflavina.', 'La niacina forma parte del NAD⁺, y la riboflavina, del FAD.'),
    ] },
    { id: 'proteinas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las proteínas y su desnaturalización', props: [
      V('pro1', 'En el punto isoeléctrico, la carga neta de una proteína o de un aminoácido es cero.', 'Las cargas positivas y negativas se compensan.', 'QA-punto-isoelectrico'),
      V('pro2', 'Una proteína suele ser menos soluble en su punto isoeléctrico, porque sin carga neta sus moléculas no se repelen.', 'Las moléculas tienden a juntarse y precipitar.', 'QA-punto-isoelectrico'),
      V('pro3', 'El enlace peptídico une el carboxilo de un aminoácido con el grupo amino de otro y libera una molécula de agua.', '–COOH + H₂N– → –CO–NH– + H₂O.'),
      V('pro4', 'La desnaturalización cambia la forma de la proteína sin romper sus enlaces peptídicos.', 'Rompe interacciones débiles (puentes de hidrógeno, puentes salinos); la cadena de aminoácidos sigue entera.', 'BMH1'),
      V('pro6', 'Al cocinar un huevo, la clara se desnaturaliza y no vuelve a su forma original al enfriarse.', 'La desnaturalización por calor de la clara es irreversible.', 'QA-desnaturalizacion-reversible'),
      V('pro7', 'A pH cercano a 7, el grupo amino y el grupo carboxilo de un aminoácido están ionizados: NH₃⁺ y COO⁻.', 'El aminoácido está como ion dipolar.'),
      F('pro8', 'La desnaturalización rompe los enlaces peptídicos y separa la proteína en aminoácidos.', 'BMH1', 'Separar en aminoácidos es la hidrólisis (la digestión). La desnaturalización solo cambia la forma.', 'La desnaturalización cambia la forma de la proteína; sus enlaces peptídicos siguen enteros.'),
      F('pro9', 'La clara de un huevo cocido vuelve a ser líquida y transparente si se deja enfriar.', 'QA-desnaturalizacion-reversible', 'La desnaturalización de la clara por calor no se revierte al enfriar.', 'La clara cocida sigue sólida y blanca al enfriarse: su desnaturalización es irreversible.'),
      F('pro10', 'En el punto isoeléctrico, la proteína tiene carga neta positiva.', 'QA-punto-isoelectrico', 'En el punto isoeléctrico la carga neta es cero; a pH menor es positiva y a pH mayor, negativa.', 'En el punto isoeléctrico, la carga neta de la proteína es cero.'),
      F('pro11', 'El enlace peptídico solo existe en las proteínas de origen animal.', 'QA-peptidico-exclusivo', 'Las proteínas de las menestras, los cereales o la quinua también son cadenas de aminoácidos unidas por enlaces peptídicos.', 'Toda proteína, animal o vegetal, tiene enlaces peptídicos.'),
      F('pro12', 'Una proteína desnaturalizada pierde sus aminoácidos y ya no aporta nutrientes.', 'BMH13', 'Un huevo cocido tiene los mismos aminoácidos que uno crudo; la digestión los separa después.', 'Una proteína desnaturalizada conserva sus aminoácidos y sigue aportándolos como nutriente.'),
    ] },
    { id: 'alimentos', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las sustancias de los alimentos', props: [
      V('ali1', 'El colesterol es un esterol: un lípido con el núcleo de cuatro anillos de los esteroides.', 'Además tiene un grupo OH.', 'BMH4'),
      V('ali2', 'La leche contiene colesterol, porque es un alimento de origen animal.', 'El colesterol se encuentra en los alimentos de origen animal.'),
      V('ali3', 'La lactosa de la leche es un azúcar reductor.', 'Uno de sus extremos puede abrirse y dar un grupo aldehído.', 'QA-disacarido-no-reductor'),
      V('ali4', 'La glucosa es un azúcar reductor: en su forma abierta tiene un grupo aldehído que puede oxidarse.', 'Por eso da positiva la prueba de Fehling o de Benedict.'),
      V('ali5', 'La sacarosa no es un azúcar reductor, porque no tiene un extremo que pueda abrirse y dar un grupo aldehído.', 'Sus dos monosacáridos se unen justo por los carbonos que darían el grupo reductor.', 'QA-reductor-dulce'),
      V('ali6', 'La cafeína es un alcaloide: un compuesto nitrogenado de origen vegetal.', 'Tiene cuatro átomos de nitrógeno en sus anillos.', 'QA-alcaloide-clase'),
      F('ali9', 'La sacarosa es un azúcar reductor porque es dulce.', 'QA-reductor-dulce', 'Ser reductor depende de tener un grupo que se oxida (aldehído libre), no del sabor.', 'La sacarosa es dulce, pero no es un azúcar reductor.'),
      F('ali10', 'El colesterol es una grasa como el aceite: un triglicérido.', 'BMH4', 'Los dos son lípidos, pero el colesterol es un esterol, con cuatro anillos; los aceites y las grasas son triglicéridos: glicerol con tres ácidos grasos.', 'El colesterol es un lípido de la familia de los esteroides, no un triglicérido.'),
      F('ali11', 'La cafeína no tiene nitrógeno: es un carbohidrato del grano de café.', 'QA-alcaloide-clase', 'La cafeína es un alcaloide, con cuatro nitrógenos; no es un carbohidrato.', 'La cafeína es un alcaloide: un compuesto nitrogenado.'),
      F('ali12', 'Los esteroles se disuelven bien en agua porque tienen un grupo OH.', 'QA-oh-soluble', 'Un solo OH no compensa el gran esqueleto de carbonos: el colesterol casi no se disuelve en agua.', 'Los esteroles son lípidos: casi no se disuelven en agua, aunque tengan un grupo OH.'),
      F('ali13', 'La lactosa no es un azúcar reductor.', 'QA-disacarido-no-reductor', 'Algunos disacáridos son reductores (lactosa, maltosa) y otros no (sacarosa).', 'La lactosa es un disacárido reductor.'),
      F('ali14', 'Los alcaloides tienen, en general, carácter ácido.', 'QA-alcaloide-clase', '«Alcaloide» quiere decir «parecido a un álcali»: por su nitrógeno, suelen tener carácter básico.', 'Los alcaloides suelen tener carácter básico, por su nitrógeno.'),
    ] },
    // ===== Hidrocarburos (12 nov 2026) =====
    { id: 'hidrogenacion', unidad: 'quimica.hidrocarburos', nombre: 'la hidrogenación de alquenos y alquinos', props: [
      V('hgn1', 'Con un catalizador de platino o paladio y suficiente H₂, un alquino se hidrogena hasta el alcano.', 'Esos catalizadores son muy activos: el alqueno que se forma sigue tomando H₂.', 'QA-catalizador-activo'),
      V('hgn2', 'Con el catalizador de Lindlar, un alquino se hidrogena solo hasta el alqueno, que sale cis.', 'Es un paladio «envenenado»: los dos H entran por el mismo lado y no sigue hasta el alcano.', 'QA-lindlar-trans'),
      V('hgn3', 'Para pasar un mol de alquino a alcano se necesitan dos moles de H₂.', 'El triple enlace tiene dos enlaces π: cada uno consume un H₂.', 'QA-h2-por-pi'),
      V('hgn4', 'En la hidrogenación, cada enlace π que se rompe consume una molécula de H₂.', 'Los dos átomos de H del H₂ se suman a los dos carbonos de ese enlace π.', 'QA-h2-por-pi'),
      V('hgn5', 'La hidrogenación de un alqueno es una reducción del compuesto orgánico.', 'El carbono gana hidrógeno y baja su estado de oxidación.', 'QA-oxidacion-organica-invertida'),
      F('hgn6', 'Con platino o paladio activos, la hidrogenación de un alquino se detiene en el alqueno.', 'QA-catalizador-activo', 'Con catalizadores activos y H₂ suficiente, el alqueno sigue hidrogenándose hasta el alcano; para detenerse en el alqueno se usa el de Lindlar.', 'Con platino o paladio activos, un alquino se hidrogena hasta el alcano.'),
      F('hgn7', 'El catalizador de Lindlar convierte un alquino en un alqueno trans.', 'QA-lindlar-trans', 'Con Lindlar los dos H entran por el mismo lado del enlace: el alqueno sale cis.', 'El catalizador de Lindlar convierte un alquino en un alqueno cis.'),
      F('hgn8', 'Para hidrogenar por completo un mol de un dieno se necesita un mol de H₂.', 'QA-h2-por-pi', 'Un dieno tiene dos dobles enlaces, es decir, dos enlaces π: necesita dos moles de H₂.', 'Para hidrogenar por completo un mol de un dieno se necesitan dos moles de H₂.'),
      F('hgn9', 'La hidrogenación de un alqueno es una oxidación del compuesto orgánico.', 'QA-oxidacion-organica-invertida', 'Ganar hidrógeno es reducirse: el estado de oxidación del carbono baja.', 'La hidrogenación de un alqueno es una reducción.'),
    ] },
    { id: 'isomeros-geometricos', unidad: 'quimica.hidrocarburos', nombre: 'la isomería cis-trans, la notación Z/E y los dos ácidos butenodioicos', props: [
      V('geo1', 'Para que un alqueno tenga isómeros cis y trans, cada carbono del doble enlace debe tener dos grupos distintos.', 'Si un carbono tiene dos grupos iguales, las dos formas son la misma molécula.', 'HC4'),
      V('geo2', 'En el ácido cis-butenodioico (maleico), los dos grupos COOH están del mismo lado del doble enlace, y la molécula es Z.', 'En cada carbono el COOH tiene más prioridad que el H, y los dos COOH quedan juntos.', 'QA-cis-es-z'),
      V('geo3', 'Las notaciones cis-trans y Z/E no siempre coinciden, porque Z/E compara los grupos de mayor prioridad de cada carbono.', 'Cis-trans mira dos grupos iguales; Z/E, los de mayor prioridad, que pueden ser otros.', 'QA-cis-es-z'),
      V('geo4', 'El isómero cis del ácido butenodioico funde a menor temperatura que el isómero trans.', 'El trans se acomoda mejor en el cristal y forma más puentes de hidrógeno entre moléculas.', 'QA-fusion-geometrica'),
      V('geo5', 'Al calentarlo, el isómero cis del ácido butenodioico pierde agua y forma un anhídrido cíclico, porque sus dos COOH están cerca.', 'Los dos COOH del mismo lado pueden unirse dentro de la molécula soltando una molécula de agua.', 'QA-anhidrido-trans'),
      V('geo6', 'El ácido maleico (cis) es más polar que el ácido fumárico (trans).', 'En el trans los dipolos de los dos COOH apuntan a lados opuestos y casi se anulan.', 'QA-polaridad-geometrica'),
      F('geo7', 'Todo alqueno tiene un isómero cis y uno trans.', 'HC4', 'El propeno no los tiene: uno de sus carbonos del doble enlace lleva dos H.', 'Solo hay isómeros cis y trans si cada carbono del doble enlace tiene dos grupos distintos.'),
      F('geo8', 'Si un alqueno es cis, siempre es Z.', 'QA-cis-es-z', 'Z/E se decide con los grupos de mayor prioridad, que no siempre son los grupos iguales que definen cis-trans.', 'Un alqueno cis puede ser Z o E, según la prioridad de sus grupos.'),
      F('geo9', 'El isómero trans del ácido butenodioico forma un anhídrido cíclico con más facilidad que el cis.', 'QA-anhidrido-trans', 'En el trans los COOH están en lados opuestos y no pueden unirse dentro de la molécula.', 'El isómero cis forma con facilidad el anhídrido cíclico; el trans no, mientras siga siendo trans.'),
      F('geo10', 'El ácido fumárico (trans) es más polar que el ácido maleico (cis).', 'QA-polaridad-geometrica', 'En el trans los dipolos de los COOH se oponen y casi se anulan.', 'El ácido maleico (cis) es más polar que el fumárico (trans).'),
      F('geo11', 'El isómero cis del ácido butenodioico funde a mayor temperatura que el trans.', 'QA-fusion-geometrica', 'El trans funde mucho más alto: se ordena mejor en el cristal.', 'El isómero trans del ácido butenodioico funde a mayor temperatura que el cis.'),
    ] },
    // ===== Funciones orgánicas (12 nov 2026) =====
    { id: 'fermentacion', unidad: 'quimica.funciones-organicas', nombre: 'la fermentación alcohólica y la oxidación del etanol', props: [
      V('fer1', 'En la fermentación alcohólica, la glucosa se transforma en etanol y dióxido de carbono.', 'C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂, por acción de las levaduras.', 'QA-gas-fermentacion'),
      V('fer2', 'El etanol es un alcohol primario: el carbono que lleva el OH está unido a un solo carbono.', 'CH₃–CH₂–OH: el carbono del OH tiene un solo carbono vecino.', 'FO4'),
      V('fer3', 'Al oxidar el etanol con suavidad se forma etanal (acetaldehído).', 'El alcohol primario pierde dos H y queda el grupo aldehído.', 'QA-oxidacion-organica-invertida'),
      V('fer4', 'Si la oxidación del etanol sigue, el etanal se oxida a ácido acético.', 'El aldehído gana un oxígeno y queda el grupo carboxilo.', 'QA-oxidacion-organica-invertida'),
      V('fer5', 'Un alcohol secundario, como el 2-propanol, se oxida a una cetona.', 'El carbono del OH tiene dos carbonos vecinos: queda un carbonilo en medio de la cadena.', 'QA-clase-alcohol'),
      F('fer6', 'El etanol es un alcohol secundario.', 'FO4', 'El carbono que lleva el OH está unido a un solo carbono: es primario.', 'El etanol es un alcohol primario.'),
      F('fer7', 'En la fermentación alcohólica se libera oxígeno gaseoso.', 'QA-gas-fermentacion', 'El gas que sale es CO₂; la fermentación ocurre sin oxígeno.', 'En la fermentación alcohólica se libera dióxido de carbono.'),
      F('fer8', 'Pasar de etanol a etanal es una reducción.', 'QA-oxidacion-organica-invertida', 'El etanol pierde hidrógeno y el carbono sube su estado de oxidación: es una oxidación.', 'Pasar de etanol a etanal es una oxidación.'),
      F('fer9', 'El ácido acético se obtiene al reducir el etanal.', 'QA-oxidacion-organica-invertida', 'De aldehído a ácido el carbono gana oxígeno: es una oxidación.', 'El ácido acético se obtiene al oxidar el etanal.'),
      F('fer10', 'Un alcohol secundario se oxida a un ácido carboxílico, igual que el etanol.', 'QA-clase-alcohol', 'Un alcohol secundario se oxida a cetona y ahí se detiene la oxidación suave.', 'Un alcohol secundario se oxida a una cetona.'),
    ] },
    // ===== Biomoléculas (12 nov 2026) =====
    { id: 'cadenas-laterales', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las interacciones entre las cadenas laterales de una proteína', props: [
      V('cad1', 'Dos cisteínas pueden unir dos partes de una proteína con un puente disulfuro (S–S), que es un enlace covalente.', 'Se forma al oxidarse los grupos –SH de las dos cisteínas.', 'QA-disulfuro-debil'),
      V('cad2', 'La cadena lateral de la lisina, con carga positiva, puede formar una interacción iónica con la del ácido aspártico, de carga negativa.', 'Es un puente salino: atracción entre cargas opuestas.', 'QA-ionica-iguales'),
      V('cad3', 'Las cadenas laterales apolares, como la de la valina, tienden a quedar en el interior de la proteína, lejos del agua.', 'Es la interacción hidrofóbica: lo apolar se junta y el agua queda afuera.', 'QA-hidrofobico-afuera'),
      V('cad4', 'Las cadenas laterales con grupos OH, como la de la serina, pueden formar puentes de hidrógeno.', 'El H del OH es atraído por un par libre de un O o un N cercano.'),
      V('cad5', 'Si el pH es menor que el punto isoeléctrico, la proteína tiene carga neta positiva.', 'Con más H⁺ en el medio, los grupos básicos quedan protonados.', 'QA-punto-isoelectrico'),
      F('cad6', 'El puente disulfuro es una interacción débil, como el puente de hidrógeno.', 'QA-disulfuro-debil', 'El puente disulfuro es un enlace covalente S–S, mucho más fuerte que un puente de hidrógeno.', 'El puente disulfuro es un enlace covalente.'),
      F('cad7', 'Las cadenas laterales apolares tienden a quedar en la superficie de la proteína, en contacto con el agua.', 'QA-hidrofobico-afuera', 'Lo apolar se aleja del agua: queda en el interior; en la superficie quedan las cadenas polares y con carga.', 'Las cadenas laterales apolares tienden a quedar en el interior de la proteína.'),
      F('cad8', 'Dos cadenas laterales con carga negativa se atraen y forman una interacción iónica.', 'QA-ionica-iguales', 'Cargas iguales se repelen; la interacción iónica es entre cargas opuestas.', 'Una cadena lateral positiva y una negativa forman una interacción iónica.'),
      F('cad9', 'Si el pH es mayor que el punto isoeléctrico, la proteína tiene carga neta positiva.', 'QA-punto-isoelectrico', 'Con pocos H⁺ en el medio, los grupos ácidos pierden su H⁺ y la carga neta queda negativa.', 'Si el pH es mayor que el punto isoeléctrico, la proteína tiene carga neta negativa.'),
      F('cad10', 'Las interacciones entre las cadenas laterales de una proteína son enlaces peptídicos.', 'QA-cadena-lateral-peptidico', 'Los enlaces peptídicos forman la cadena principal; entre cadenas laterales hay puentes de hidrógeno, interacciones iónicas e hidrofóbicas y puentes disulfuro.', 'Las cadenas laterales interactúan por puentes de hidrógeno, interacciones iónicas, interacciones hidrofóbicas y puentes disulfuro.'),
    ] },
    { id: 'aldosas-cetosas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las aldosas y las cetosas', props: [
      V('ald1', 'La glucosa es una aldosa: su grupo carbonilo es un aldehído.', 'El carbonilo está en el carbono 1, al extremo de la cadena.', 'QA-aldosa-cetosa'),
      V('ald2', 'La fructosa es una cetosa: su grupo carbonilo está en un carbono intermedio de la cadena.', 'Está en el carbono 2.', 'QA-aldosa-cetosa'),
      V('ald3', 'La glucosa y la fructosa son isómeros de función: tienen la misma fórmula, C₆H₁₂O₆, y distinto grupo funcional.', 'Una tiene aldehído y la otra cetona.', 'QA-aldosa-cetosa-posicion'),
      V('ald4', 'Una hexosa es un monosacárido de seis carbonos.', 'Hex- indica seis; la glucosa y la fructosa son hexosas.'),
      V('ald5', 'La glucosa y la fructosa son muy solubles en agua, porque tienen varios grupos OH.', 'Cada OH forma puentes de hidrógeno con el agua.', 'QA-azucar-insoluble'),
      V('ald6', 'La ribosa, de cinco carbonos y con grupo aldehído, es una aldopentosa.', 'Aldo- por el aldehído y -pentosa por los cinco carbonos.'),
      F('ald7', 'La glucosa y la fructosa son isómeros de posición.', 'QA-aldosa-cetosa-posicion', 'No es el mismo grupo cambiado de lugar: una tiene aldehído y la otra cetona, que son funciones distintas.', 'La glucosa y la fructosa son isómeros de función.'),
      F('ald8', 'La fructosa es una aldosa.', 'QA-aldosa-cetosa', 'Su carbonilo está en el carbono 2: es una cetona.', 'La fructosa es una cetosa.'),
      F('ald9', 'La glucosa y la fructosa tienen fórmulas moleculares distintas.', 'QA-isomeros-formula', 'Las dos son C₆H₁₂O₆: por eso son isómeros.', 'La glucosa y la fructosa tienen la misma fórmula molecular.'),
      F('ald10', 'La glucosa casi no se disuelve en agua.', 'QA-azucar-insoluble', 'Sus cinco OH forman puentes de hidrógeno con el agua: es muy soluble.', 'La glucosa es muy soluble en agua.'),
      F('ald11', 'Una cetosa tiene el grupo carbonilo en el extremo de la cadena.', 'QA-aldosa-cetosa', 'El carbonilo en el extremo es un aldehído (aldosa); en una cetosa está en un carbono intermedio.', 'Una cetosa tiene el grupo carbonilo en un carbono intermedio de la cadena.'),
    ] },
    // ===== Enlace químico (12 nov 2026) =====
    { id: 'gases-sangre', unidad: 'quimica.enlace-quimico', nombre: 'el oxígeno, el dióxido de carbono y su transporte en la sangre', props: [
      V('gas1', 'El oxígeno que respiramos (O₂) es una sustancia simple, no un compuesto.', 'Sus dos átomos son del mismo elemento.', 'MA9'),
      V('gas2', 'En la sangre, casi todo el O₂ viaja unido a la hemoglobina de los glóbulos rojos.', 'Muy poco va disuelto en el plasma.', 'QA-o2-disuelto'),
      V('gas3', 'En la sangre, la mayor parte del CO₂ viaja como ion bicarbonato (HCO₃⁻).', 'El CO₂ reacciona con el agua y forma H₂CO₃, que pasa a HCO₃⁻; una parte menor va unida a la hemoglobina o disuelta.', 'QA-co2-hemoglobina'),
      V('gas4', 'El HCO₃⁻ que lleva el CO₂ en la sangre es un anión de carga 1−.', 'Es el carbonato (2−) con un H⁺.', 'QA-carga-oxoanion'),
      V('gas5', 'La hemoglobina tiene hierro, que es donde se une el O₂.', 'Cada grupo hemo tiene un ion de hierro que une una molécula de O₂.'),
      F('gas6', 'El O₂ que transporta la hemoglobina es un compuesto diatómico.', 'MA9', 'Es diatómico, pero sus dos átomos son de oxígeno: es un elemento.', 'El O₂ que transporta la hemoglobina es una sustancia simple diatómica.'),
      F('gas7', 'En la sangre, la mayor parte del CO₂ viaja unido a la hemoglobina.', 'QA-co2-hemoglobina', 'Solo una parte menor va unida a la hemoglobina; la mayor parte va como HCO₃⁻.', 'En la sangre, la mayor parte del CO₂ viaja como ion bicarbonato.'),
      F('gas8', 'El ion bicarbonato que lleva el CO₂ en la sangre tiene carga 2−.', 'QA-carga-oxoanion', 'La carga 2− es la del carbonato; el bicarbonato conserva un H⁺ y queda con 1−.', 'El ion bicarbonato tiene carga 1−.'),
      F('gas9', 'La mayor parte del O₂ de la sangre va disuelto en el plasma.', 'QA-o2-disuelto', 'El O₂ se disuelve poco en agua: casi todo viaja unido a la hemoglobina.', 'Casi todo el O₂ de la sangre viaja unido a la hemoglobina.'),
    ] },
    { id: 'dativo-oxisales', unidad: 'quimica.enlace-quimico', nombre: 'el enlace dativo en los oxoaniones del cloro y los tipos de sales', props: [
      V('dat1', 'En un enlace dativo (coordinado), los dos electrones del par compartido vienen de un mismo átomo.', 'Un átomo pone el par y el otro lo acepta.', 'QA-dativo-aporte'),
      V('dat2', 'En la estructura de Lewis del ion clorato (ClO₃⁻) que cumple el octeto, el cloro forma dos enlaces dativos con oxígenos.', 'El cloro se une a un O⁻ por un enlace simple común y presta dos de sus pares a los otros dos oxígenos.', 'QA-sin-dativo'),
      V('dat3', 'El NaCl es una sal haloidea: no tiene oxígeno.', 'Viene de un hidrácido, el HCl.', 'QA-oxisal-haloidea'),
      V('dat4', 'El KClO₃ es una oxisal: tiene un metal, un no metal y oxígeno.', 'Viene de un oxácido, el HClO₃.', 'QA-oxisal-haloidea'),
      V('dat5', 'En el ion hipoclorito (ClO⁻), el cloro y el oxígeno se unen por un enlace simple que no es dativo.', 'Cada átomo aporta un electrón al par: el cloro uno de sus 7 y el oxígeno uno de los suyos.'),
      F('dat6', 'El NaClO₄ es una sal haloidea, como el NaCl.', 'QA-oxisal-haloidea', 'Tiene oxígeno: viene del ácido perclórico, un oxácido. Es una oxisal.', 'El NaClO₄ es una oxisal.'),
      F('dat7', 'En un enlace dativo, cada átomo aporta un electrón al par compartido.', 'QA-dativo-aporte', 'Eso es un enlace covalente común; en el dativo un solo átomo aporta los dos electrones.', 'En un enlace dativo, un solo átomo aporta los dos electrones del par.'),
      F('dat8', 'El KCl es una oxisal.', 'QA-oxisal-haloidea', 'No tiene oxígeno: viene del HCl, un hidrácido. Es una sal haloidea.', 'El KCl es una sal haloidea.'),
      F('dat9', 'En la estructura de Lewis del ion perclorato (ClO₄⁻) que cumple el octeto, no hay ningún enlace dativo.', 'QA-sin-dativo', 'Con el octeto, el cloro se une a un O⁻ por un enlace común y a los otros tres oxígenos por enlaces dativos.', 'En la estructura de Lewis del ion perclorato que cumple el octeto hay tres enlaces dativos.'),
    ] },
    // ===== Ambiente (12 nov 2026) =====
    { id: 'suelo-aire', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'los contaminantes del suelo y la reactividad de los gases del aire', props: [
      V('sue1', 'El nitrógeno (N₂) del aire es poco reactivo, porque su triple enlace es muy fuerte.', 'Por eso se acumula en la atmósfera y es casi el 78 % del aire.', 'QA-reactividad-aire'),
      V('sue2', 'El ozono (O₃) es un gas mucho más reactivo que el oxígeno (O₂).', 'Es un oxidante fuerte: por eso irrita los pulmones y daña plantas y materiales.', 'QA-reactividad-aire'),
      V('sue3', 'El NO₂ es un gas reactivo: participa en la formación del smog fotoquímico y de la lluvia ácida.', 'Con luz solar se descompone y forma ozono; con agua da ácido nítrico.', 'QA-reactividad-aire'),
      V('sue4', 'Los metales pesados, como el plomo y el cadmio, contaminan el suelo y no se degradan.', 'Son elementos: no se descomponen y se acumulan en el suelo y en los seres vivos.', 'QA-metal-degradable'),
      V('sue5', 'El uso excesivo de pesticidas y fertilizantes puede contaminar el suelo y el agua subterránea.', 'Lo que las plantas no absorben se queda en el suelo o baja con el agua de lluvia o de riego.', 'QA-nutriente-inocuo'),
      F('sue6', 'El N₂, por ser el gas más abundante del aire, es también el más reactivo.', 'QA-reactividad-aire', 'Es abundante justamente porque reacciona muy poco: su triple enlace es muy fuerte.', 'El N₂ es el gas más abundante del aire y es poco reactivo.'),
      F('sue7', 'El ozono es tan poco reactivo como el nitrógeno del aire.', 'QA-reactividad-aire', 'El O₃ es un oxidante fuerte; el N₂ casi no reacciona.', 'El ozono es mucho más reactivo que el nitrógeno del aire.'),
      F('sue8', 'Los metales pesados del suelo se degradan solos en pocos meses.', 'QA-metal-degradable', 'Un metal es un elemento: no se descompone en nada más simple y permanece en el suelo.', 'Los metales pesados no se degradan: se acumulan en el suelo.'),
      F('sue9', 'El NO₂ es un gas inerte que no reacciona en la atmósfera.', 'QA-reactividad-aire', 'El NO₂ reacciona con la luz solar (smog) y con el agua (lluvia ácida).', 'El NO₂ es un gas reactivo en la atmósfera.'),
      F('sue10', 'Los fertilizantes no pueden contaminar el suelo ni el agua: son nutrientes para las plantas.', 'QA-nutriente-inocuo', 'En exceso, los nitratos y fosfatos se acumulan, pasan al agua y causan eutrofización.', 'En exceso, los fertilizantes contaminan el suelo y el agua.'),
    ] },
    // ===== Soluciones (12 nov 2026) =====
    { id: 'solucion-alcoholica', unidad: 'quimica.soluciones', nombre: 'las soluciones de alcohol en agua y su carácter ácido o básico', props: [
      V('alc1', 'A 25 °C, una solución de etanol en agua es prácticamente neutra: su pH es cercano a 7.', 'El etanol casi no cede ni acepta protones del agua.', 'QA-alcohol-acido'),
      V('alc2', 'El etanol no es una base, aunque su fórmula tenga un grupo OH.', 'Su OH está unido por enlace covalente al carbono: no se libera como ion OH⁻ en el agua.', 'AB1'),
      V('alc3', 'El vinagre es ácido porque contiene ácido acético, que cede algunos protones al agua.', 'CH₃COOH ⇌ CH₃COO⁻ + H⁺.'),
      V('alc4', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL de la solución son etanol.', 'El porcentaje en volumen se refiere al soluto, el etanol.', 'QA-porcentaje-solvente'),
      V('alc5', 'El ácido acético es un ácido débil: en agua solo una pequeña parte de sus moléculas se ioniza.', 'Por eso el vinagre no es tan corrosivo como un ácido fuerte de igual concentración.', 'AB3'),
      F('alc6', 'El etanol en agua da una solución básica, porque tiene un grupo OH.', 'AB1', 'El OH del etanol no se libera como ion OH⁻: la solución es prácticamente neutra.', 'El etanol en agua da una solución prácticamente neutra.'),
      F('alc7', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL de la solución son agua.', 'QA-porcentaje-solvente', 'El porcentaje se da para el soluto: 40 mL son etanol y el resto, unos 60 mL, es agua.', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL son etanol.'),
      F('alc8', 'El ácido acético es un ácido fuerte: en agua se ioniza por completo.', 'AB3', 'Solo una pequeña parte de sus moléculas se ioniza: es un ácido débil.', 'El ácido acético es un ácido débil.'),
      F('alc9', 'Una solución de etanol en agua es ácida, como el vinagre.', 'QA-alcohol-acido', 'El vinagre es ácido por el ácido acético; el etanol casi no cede protones y la solución queda neutra.', 'Una solución de etanol en agua es prácticamente neutra.'),
    ] },
    // ===== Electroquímica (12 nov 2026) =====
    { id: 'celda-metanol', unidad: 'quimica.electroquimica', nombre: 'las celdas de combustible de metanol y de etanol', props: [
      V('cme1', 'En una celda de combustible de metanol en medio ácido, el metanol se oxida en el ánodo.', 'Es el combustible: cede electrones.', 'EC9'),
      V('cme2', 'En el ánodo de una celda de metanol en medio ácido, el metanol se convierte en CO₂ y libera iones H⁺ y electrones.', 'CH₃OH + H₂O → CO₂ + 6 H⁺ + 6 e⁻.', 'QA-cation-anion'),
      V('cme3', 'En el cátodo de una celda de combustible en medio ácido, el O₂ se reduce y forma agua.', 'O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.', 'EC9'),
      V('cme4', 'Una celda de combustible de etanol que funciona sola, de modo espontáneo, tiene fem positiva.', 'Una reacción redox espontánea en una celda galvánica da fem positiva.', 'QA-fem-negativa'),
      V('cme5', 'En la oxidación del metanol a CO₂, el estado de oxidación del carbono pasa de −2 a +4.', 'Por eso cada molécula de metanol cede 6 electrones.', 'QA-electrones-oxidacion'),
      F('cme6', 'En una celda de combustible de metanol, el metanol se reduce en el cátodo.', 'EC9', 'El metanol es el combustible: cede electrones, se oxida, y eso ocurre en el ánodo.', 'En una celda de combustible de metanol, el metanol se oxida en el ánodo.'),
      F('cme7', 'En una celda de combustible de metanol, el O₂ cede electrones en el ánodo.', 'EC9', 'El O₂ acepta electrones: se reduce en el cátodo.', 'En una celda de combustible de metanol, el O₂ acepta electrones en el cátodo.'),
      F('cme8', 'Una celda de combustible de etanol que funciona de modo espontáneo tiene fem negativa.', 'QA-fem-negativa', 'Una celda galvánica espontánea tiene fem positiva.', 'Una celda de combustible de etanol que funciona de modo espontáneo tiene fem positiva.'),
      F('cme9', 'En la oxidación del metanol a CO₂, cada átomo de carbono pierde 4 electrones.', 'QA-electrones-oxidacion', 'El carbono pasa de −2 a +4: pierde 6 electrones.', 'En la oxidación del metanol a CO₂, cada átomo de carbono pierde 6 electrones.'),
      F('cme10', 'En una celda de combustible en medio ácido, los iones H⁺ que salen del ánodo son aniones.', 'QA-cation-anion', 'El H⁺ tiene carga positiva: es un catión.', 'Los iones H⁺ que salen del ánodo son cationes.'),
    ] },
  ];


  // Espejos: una F y la V que dice lo contrario o casi lo mismo no salen juntas (vale en los dos sentidos).
  const EXCLUYE = {
    dal7: ['dal2'], dal9: ['dal1'], dal8: ['dal1'],
    mod8: ['mod2'], mod9: ['mod3'], mod10: ['mod5'], mod11: ['mod5'],
    rut6: ['rut3'], rut8: ['rut1', 'rut4'],
    ram6: ['ram2'], ram8: ['ram1'], ram9: ['ram3'],
    sus7: ['sus1'], sus10: ['sus2'],
    sod7: ['sod2'], sod8: ['sod1', 'sod2'], sod9: ['sod4'], sod10: ['sod3'], sod12: ['sod1'], sol10: ['sol6', 'sod5'],
    liq9: ['liq1'], liq10: ['liq5'], liq15: ['liq5', 'liq6'], liq12: ['liq4'],
    sol8: ['sol2'], sol11: ['sol3'], sol13: ['sol2'], sol14: ['sol1', 'sol3'],
    esf8: ['esf4'], esf10: ['esf5'], esf12: ['esf1'], esf9: ['esf2'],
    con8: ['con2'], con12: ['con1'], con10: ['con6'], con9: ['con4'],
    ten6: ['ten3'], ten7: ['ten1', 'ten2'], ten8: ['ten10'], ten9: ['ten5'], ten11: ['ten10'],
    oxi8: ['oxi1', 'oxi3'], oxi9: ['oxi4'], oxi10: ['oxi4'], oxi11: ['oxi2', 'oxi3'],
    met8: ['met1', 'met3'], met9: ['met1'], met10: ['met4'], met11: ['met2'], met12: ['met7'],
    pol8: ['pol4'], pol9: ['pol2', 'pol3'], pol11: ['pol5'], pol12: ['pol4'],
    pil10: ['pil2'], pil12: ['pil5'], pil15: ['pil3'],
    eqs8: ['eqs2'], eqs9: ['eqs1'], eqs10: ['eqs3'], eqs11: ['eqs5', 'eqs7'],
    lb9: ['lb4'], lb10: ['lb2'], lb11: ['lb1'], lb13: ['lb2', 'lb4'], lb14: ['lb8'],
    ts8: ['ts1', 'ts2'], ts9: ['ts1'], ts10: ['ts3'], ts11: ['ts4'], ts12: ['ts7'],
    ion9: ['ion4'], ion10: ['ion3'], ion11: ['ion5'], ion12: ['ion6'], ion13: ['ion1'], ion14: ['ion4'],
    rad7: ['rad6'], rad8: ['rad2'], rad11: ['rad1', 'rad3'], rad12: ['rad4'],
    hid8: ['hid1'], hid10: ['hid2'], hid11: ['hid3', 'hid14'], hid15: ['hid1'],
    hid9: ['hid4'], hid12: ['hid5'], hid13: ['hid7'], hid17: ['hid5'],
    vit12: ['vit4'], vit13: ['vit1'], vit14: ['vit8'], vit15: ['vit7', 'vit8'], vit17: ['vit5', 'vit6'],
    pro8: ['pro4'], pro9: ['pro6'], pro10: ['pro1', 'pro2'], pro11: ['pro3'], pro12: ['pro4'],
    ali9: ['ali5'], ali10: ['ali1'], ali11: ['ali6'], ali13: ['ali3'], ali14: ['ali6'],
    // 12 nov 2026
    hgn6: ['hgn1'], hgn7: ['hgn2'], hgn8: ['hgn3', 'hgn4'], hgn9: ['hgn5'],
    geo7: ['geo1'], geo8: ['geo2', 'geo3'], geo9: ['geo5'], geo10: ['geo6'], geo11: ['geo4'],
    fer6: ['fer2'], fer7: ['fer1'], fer8: ['fer3'], fer9: ['fer4'], fer10: ['fer5'],
    cad6: ['cad1'], cad7: ['cad3'], cad8: ['cad2'], cad9: ['cad5'],
    ald7: ['ald3'], ald8: ['ald2'], ald9: ['ald3'], ald10: ['ald5'], ald11: ['ald2', 'ald1'],
    gas6: ['gas1'], gas7: ['gas3'], gas8: ['gas4'], gas9: ['gas2'],
    dat6: ['dat3', 'dat4'], dat7: ['dat1', 'dat5'], dat8: ['dat3', 'dat4'], dat9: ['dat2'],
    sue6: ['sue1'], sue7: ['sue2'], sue8: ['sue4'], sue9: ['sue3'], sue10: ['sue5'],
    alc6: ['alc1', 'alc2'], alc7: ['alc4'], alc8: ['alc5'], alc9: ['alc1', 'alc3'],
    cme6: ['cme1'], cme7: ['cme3'], cme8: ['cme4'], cme9: ['cme5'], cme10: ['cme2'],
  };
  // Proposiciones que preguntan lo mismo que el ítem con cifra del informe: documentado.
  const RESPALDO = {
    lb10: 'documentado',  // AB1: «un ácido debe tener H y una base, OH», 45 % de 24 (Çetingül y Geban 2011)
    pil15: 'documentado', // EC2: electrones «a través de la disolución», 56 % de 306 (Tagle Barrios 2024)
    eqs9: 'documentado',  // EQ13: «solo hay equilibrio si todo está en el mismo estado», 10 % y 44 % (Riddle y Lo-Fan-Hin 2023)
    ion13: 'documentado', // EN1: par iónico, 39,2 % de 102 (Kumpha y otros 2014)
    sol13: 'documentado', // EN1: el NaCl existe como moléculas, 92,2 % de 102 (Kumpha y otros 2014)
    eqs12: 'documentado', // EQ3: «en equilibrio la reacción terminó», 6 % y 13 % (Riddle y Lo-Fan-Hin 2023)
    alc8: 'documentado',  // AB3: «H₂SO₄ y ácido acético son ácidos fuertes», 27,6 % de 304 (Damanhuri y otros 2016)
    mod11: 'documentado', // AT6: orbitales dibujados como órbitas, 17,2 % de 192 (Zarkadis y otros 2024)
  };

  const BANCO = [];
  for (const t of TEMAS) for (const p of t.props) BANCO.push({ ...p, unidad: t.unidad, tema: t.id });
  const POR_ID = new Map(BANCO.map(p => [p.id, p]));
  for (const [a, lista] of Object.entries(EXCLUYE)) for (const b of lista) {
    POR_ID.get(a).excluye.push(b);
    POR_ID.get(b).excluye.push(a);
  }
  for (const [id, r] of Object.entries(RESPALDO)) POR_ID.get(id).respaldo = r;
  for (const t of TEMAS) t.props = t.props.map(p => POR_ID.get(p.id));

  // ---------- Pares para relacionar ----------
  const PARES = [
    { id: 'cientificos', unidad: 'quimica.estructura-atomica', izqNombre: 'cada científico', izqVar: 'científico', derNombre: 'su aporte al conocimiento del átomo',
      codigo: 'QA-aporte-cruzado', familia: ['c-dalton', 'c-thomson', 'c-rutherford', 'c-bohr', 'c-schrodinger'], codigoFamilia: 'AT5',
      choques: [['c-schrodinger', 'c-debroglie']], pares: [
        { id: 'c-dalton', izq: 'Dalton', der: 'átomos indivisibles, iguales dentro de cada elemento' },
        { id: 'c-thomson', izq: 'Thomson', der: 'descubrió el electrón estudiando los rayos catódicos' },
        { id: 'c-rutherford', izq: 'Rutherford', der: 'núcleo pequeño, denso y positivo' },
        { id: 'c-bohr', izq: 'Bohr', der: 'el electrón solo ocupa ciertas órbitas, con energías fijas' },
        { id: 'c-chadwick', izq: 'Chadwick', der: 'descubrió el neutrón' },
        { id: 'c-millikan', izq: 'Millikan', der: 'midió la carga del electrón con gotitas de aceite' },
        { id: 'c-schrodinger', izq: 'Schrödinger', der: 'describió el electrón con una ecuación de onda, de la que salen los orbitales' },
        { id: 'c-debroglie', izq: 'De Broglie', der: 'propuso que el electrón también se comporta como una onda' },
        { id: 'c-heisenberg', izq: 'Heisenberg', der: 'no se pueden conocer a la vez con exactitud la posición y la velocidad del electrón' },
      ] },
    { id: 'coenzimas', unidad: 'quimica.biomoleculas-y-productos-naturales', izqNombre: 'cada vitamina', izqVar: 'vitamina', derNombre: 'la coenzima de la que forma parte',
      codigo: 'QA-vitamina-coenzima', pares: [
        { id: 'z-b1', izq: 'tiamina (B1)', der: 'TPP' },
        { id: 'z-b2', izq: 'riboflavina (B2)', der: 'FAD y FMN' },
        { id: 'z-b3', izq: 'niacina (B3)', der: 'NAD⁺ y NADP⁺' },
        { id: 'z-b5', izq: 'ácido pantoténico (B5)', der: 'coenzima A' },
        { id: 'z-b6', izq: 'piridoxina (B6)', der: 'PLP' },
        { id: 'z-b9', izq: 'ácido fólico (B9)', der: 'THF' },
      ] },
    { id: 'funciones', unidad: 'quimica.biomoleculas-y-productos-naturales', izqNombre: 'cada vitamina', izqVar: 'vitamina', derNombre: 'una de sus funciones principales',
      codigo: 'QA-vitamina-funcion', pares: [
        { id: 'f-a', izq: 'vitamina A', der: 'la visión: forma parte del pigmento de la retina' },
        { id: 'f-d', izq: 'vitamina D', der: 'la absorción del calcio y la formación de los huesos' },
        { id: 'f-k', izq: 'vitamina K', der: 'la coagulación de la sangre' },
        { id: 'f-c', izq: 'vitamina C', der: 'la formación del colágeno' },
        { id: 'f-b12', izq: 'vitamina B12', der: 'la formación de glóbulos rojos; tiene cobalto' },
      ] },
    { id: 'metalurgia', unidad: 'quimica.recursos-naturales', izqNombre: 'cada proceso metalúrgico', izqVar: 'proceso metalúrgico', derNombre: 'lo que se hace en él',
      codigo: 'QA-proceso-metalurgico', choques: [['m-lixiviacion', 'm-cianuracion']], pares: [
        { id: 'm-tostacion', izq: 'tostación', der: 'calentar un sulfuro con aire para pasarlo a óxido' },
        { id: 'm-flotacion', izq: 'flotación', der: 'separar la mena de la ganga sin cambiarla químicamente, con un espumante' },
        { id: 'm-lixiviacion', izq: 'lixiviación', der: 'disolver el metal del mineral con una solución acuosa' },
        { id: 'm-cianuracion', izq: 'cianuración', der: 'disolver el oro con una sal que forma un complejo soluble' },
        { id: 'm-altohorno', izq: 'alto horno', der: 'reducir el óxido de hierro con monóxido de carbono' },
        { id: 'm-electro', izq: 'electrorrefinación', der: 'purificar el cobre depositándolo en el cátodo' },
      ] },
    { id: 'precursores', unidad: 'quimica.biomoleculas-y-productos-naturales', izqNombre: 'cada sustancia', izqVar: 'sustancia', derNombre: 'lo que el cuerpo forma a partir de ella',
      codigo: 'QA-precursor-cruzado', pares: [
        { id: 'pr-colesterol', izq: 'colesterol', der: 'las hormonas esteroideas y la vitamina D₃' },
        { id: 'pr-caroteno', izq: 'β-caroteno', der: 'la vitamina A (retinol)' },
        { id: 'pr-niacina', izq: 'niacina (B3)', der: 'NAD⁺' },
        { id: 'pr-riboflavina', izq: 'riboflavina (B2)', der: 'FAD' },
        { id: 'pr-pantotenico', izq: 'ácido pantoténico (B5)', der: 'coenzima A' },
        { id: 'pr-tiamina', izq: 'tiamina (B1)', der: 'TPP' },
      ] },
    { id: 'solido-ejemplo', unidad: 'quimica.enlace-quimico', izqNombre: 'cada sólido', izqVar: 'sólido', derNombre: 'su tipo de sólido',
      codigo: 'QA-tipo-solido', pares: [
        { id: 'se-nacl', izq: 'cloruro de sodio (NaCl)', der: 'iónico' },
        { id: 'se-mgo', izq: 'óxido de magnesio (MgO)', der: 'iónico' },
        { id: 'se-cu', izq: 'cobre (Cu)', der: 'metálico' },
        { id: 'se-fe', izq: 'hierro (Fe)', der: 'metálico' },
        { id: 'se-diamante', izq: 'diamante (C)', der: 'covalente de red' },
        { id: 'se-cuarzo', izq: 'cuarzo (SiO₂)', der: 'covalente de red' },
        { id: 'se-hielo', izq: 'hielo (H₂O)', der: 'molecular' },
        { id: 'se-yodo', izq: 'yodo (I₂)', der: 'molecular' },
        { id: 'se-sacarosa', izq: 'sacarosa (C₁₂H₂₂O₁₁)', der: 'molecular' },
      ] },
    { id: 'solido-propiedad', unidad: 'quimica.enlace-quimico', izqNombre: 'cada sólido descrito', izqVar: 'sólido descrito', derNombre: 'su tipo de sólido',
      codigo: 'QA-tipo-solido', familia: ['sp-ionico', 'sp-metalico'], codigoFamilia: 'QA-ionico-conduce', pares: [
        { id: 'sp-ionico', izq: 'funde a unos 800 °C; no conduce sólido, pero sí fundido o disuelto en agua', izqCorto: 'el que conduce solo fundido o disuelto', der: 'iónico' },
        { id: 'sp-metalico', izq: 'conduce la corriente en estado sólido y se puede estirar en hilos', izqCorto: 'el que conduce en estado sólido', der: 'metálico' },
        { id: 'sp-red', izq: 'funde a más de 1500 °C, es insoluble en agua y no conduce ni sólido ni fundido', izqCorto: 'el que funde a más de 1500 °C', der: 'covalente de red' },
        { id: 'sp-molecular', izq: 'funde por debajo de 150 °C y no conduce ni sólido ni fundido', izqCorto: 'el que funde por debajo de 150 °C', der: 'molecular' },
      ] },
  ];

  // ---------- Armado ----------
  const ROM = ['I', 'II', 'III', 'IV', 'V'];
  const LET = ['a', 'b', 'c', 'd', 'e'];
  const COLOR = ['o', 'i', 'h', 'd'];
  const v = P.v;
  const NEGAR = 'QA-negar-verdadera';
  const err = (id, clave, texto, explicacion, respaldo = null) => ({ id, clave, texto, explicacion,
    respaldo: respaldo || ERRORES[id].respaldo, fuente: ERRORES[id].fuente });
  const vf = p => (p.verdad ? 'V' : 'F');
  // Minúscula después de dos puntos, salvo nombres propios y símbolos químicos («Pb pasa…»).
  const PROPIOS = new Set(['Thomson', 'Rutherford', 'Bohr', 'Dalton', 'Chadwick', 'Schrödinger', 'Lewis', 'Brønsted', 'Millikan', 'Heisenberg', 'Kc', 'Ruta']);
  const CORTAS = new Set(['El', 'La', 'Lo', 'Es', 'Se', 'Su', 'En', 'Al', 'Un', 'Y', 'Ya', 'Si', 'No', 'De', 'A']);
  function minus(t) {
    const pal = t.split(/[\s,.:;]/)[0];
    if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñü]/.test(pal) || PROPIOS.has(pal)) return t;
    if (pal.length <= 2 && !CORTAS.has(pal)) return t; // símbolo químico
    return t[0].toLowerCase() + t.slice(1);
  }
  const corregir = p => `Lo correcto: ${minus(p.corregida)}`;
  const compatibles = (lista, p) => lista.every(q => !q.excluye.includes(p.id) && !p.excluye.includes(q.id));
  function tomar(rng, candidatos, n, base = []) {
    const out = base.slice();
    for (const p of rng.barajar(candidatos)) {
      if (out.length === n + base.length) break;
      if (!out.includes(p) && compatibles(out, p)) out.push(p);
    }
    return out.slice(base.length);
  }
  // Votación por posición: el valor más repetido en cada posición (null si hay empate).
  function votacion(listas) {
    return listas[0].map((_, k) => {
      const c = {};
      for (const l of listas) c[l[k]] = (c[l[k]] || 0) + 1;
      const m = Math.max(...Object.values(c)), w = Object.keys(c).filter(x => c[x] === m);
      return w.length === 1 ? w[0] : null;
    });
  }

  function generar(semilla) {
    const rng = Azar.crear('quimica-conceptos|' + semilla);
    const tipo = rng.elegir(['vf', 'vf', 'vf', 'vf', 'incorrecta', 'incorrecta', 'correcta', 'correcta', 'relacionar', 'relacionar']);
    for (let intento = 0; intento < 500; intento++) {
      const pr = tipo === 'vf' ? secuencia(rng) : tipo === 'relacionar' ? relacionar(rng) : unaSola(rng, tipo);
      if (pr && pr.alternativas.length >= 4) {
        pr.id = `quimica-conceptos#${semilla}`;
        return pr;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cierre(o) {
    return { id: '', variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '', alternativas: o.alternativas,
      solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto }, _datos: o.datos };
  }

  // ---- vf: secuencia de 3 o 4 proposiciones ----
  function secuencia(rng) {
    const tema = rng.elegir(TEMAS);
    const n = rng.elegir([3, 4]);
    const props = tomar(rng, tema.props, n);
    if (props.length < n || !props.some(p => p.verdad) || !props.some(p => !p.verdad)) return null;
    const buena = props.map(vf);
    const sec = buena.join('');
    const correcta = { clave: 'vf:' + sec, texto: sec };
    const invertir = ks => buena.map((c, k) => (ks.includes(k) ? (c === 'V' ? 'F' : 'V') : c)).join('');
    const motivo = k => (props[k].verdad
      ? `Tomaste la ${ROM[k]} como falsa, pero es verdadera: ${minus(props[k].explicacion)}`
      : `Tomaste la ${ROM[k]} como verdadera, pero es falsa: ${minus(props[k].explicacion)}`);
    // El código es el de la inversión que distingue al distractor: en D0, su F; en un vecino, la segunda.
    const distractor = ks => {
      const p = props[ks[ks.length - 1]];
      const id = p.verdad ? (p.negar || NEGAR) : p.error;
      const s = invertir(ks);
      return err(id, 'vf:' + s, s, ks.slice().reverse().map(motivo).join(' '), p.verdad ? null : p.respaldo);
    };
    const falsas = props.map((p, k) => k).filter(k => !props[k].verdad);
    const f0 = rng.elegir(falsas);
    const vecinos = rng.barajar(props.map((p, k) => k).filter(k => k !== f0)).map(k => distractor([f0, k]));
    const errores = [distractor([f0]), ...vecinos];
    const alternativas = P.armarTexto({ correcta, errores, rng, total: 5 });
    const voto = votacion(alternativas.map(a => [...a.texto]));
    if (voto.every((c, k) => c === buena[k])) return null;
    const enunciado = [...(tema.contexto ? [tema.contexto + ' '] : []),
      `Sobre ${tema.nombre}, indica si cada proposición es verdadera (V) o falsa (F).`];
    props.forEach((p, k) => enunciado.push(` ${ROM[k]}. ${p.texto}`));
    const solucion = props.map((p, k) => [p.verdad ? `${ROM[k]} es V. ${p.explicacion}` : `${ROM[k]} es F. ${p.explicacion} ${corregir(p)}`]);
    solucion.push([`La secuencia es ${sec}.`]);
    return cierre({ variables: {}, enunciado, pregunta: ['¿Cuál es la secuencia correcta?'], alternativas, solucion, correcta,
      datos: { tipo: 'vf', tema: tema.id, ids: props.map(p => p.id) } });
  }

  // ---- incorrecta / correcta: una sola falsa (o una sola verdadera) entre 4 o 5 ----
  function unaSola(rng, tipo) {
    const buscada = tipo === 'correcta'; // valor de verdad de la que se busca
    let n = rng.elegir([4, 5]);
    const tema = rng.elegir(TEMAS);
    const meta = rng.elegir(tema.props.filter(p => p.verdad === buscada));
    let otras = tomar(rng, tema.props.filter(p => p.verdad !== buscada), n - 1, [meta]);
    if (otras.length < n - 1) { n = 4; otras = otras.slice(0, 3); }
    if (otras.length < 3) return null;
    // Delator de forma: la respuesta que es la más larga se vuelve a sortear casi siempre.
    if (otras.every(p => p.texto.length < meta.texto.length) && rng.sig() > 0.2) return null;
    const props = rng.barajar([meta, ...otras]);
    const correcta = { clave: 'p:' + meta.id, texto: meta.texto };
    const errores = otras.map(p => (buscada
      ? err(p.error, 'p:' + p.id, p.texto, `Esta proposición es falsa: ${minus(p.explicacion)} ${corregir(p)}`, p.respaldo)
      : err(p.negar || NEGAR, 'p:' + p.id, p.texto, `Esta proposición es verdadera: ${minus(p.explicacion)}`)));
    const alternativas = P.armarTexto({ correcta, errores, rng, total: 5 });
    const palabra = buscada ? 'correcta' : 'incorrecta';
    const color = buscada ? 'd' : 'h';
    const enunciado = [...(tema.contexto ? [tema.contexto + ' '] : []),
      `Las alternativas son proposiciones sobre ${tema.nombre}. Solo una es `, v('q', palabra), '.'];
    const solucion = alternativas.map(a => {
      const p = POR_ID.get(a.valor.slice(2));
      const cola = p.verdad ? ` V. ${p.explicacion}` : ` F. ${p.explicacion} ${corregir(p)}`;
      return a.correcta ? [v('q', `${a.letra})`), cola] : [`${a.letra})`, cola];
    });
    const m = alternativas.find(a => a.correcta);
    solucion.push(['La ', v('q', palabra), ' es la ', v('q', m.letra), '.']);
    return cierre({ variables: { q: { nombre: `la proposición ${palabra}`, color } }, enunciado,
      pregunta: ['¿Cuál es la proposición ', v('q', palabra), '?'], alternativas, solucion, correcta,
      datos: { tipo, tema: tema.id, ids: props.map(p => p.id) } });
  }

  // ---- relacionar: 3 o 4 pares ----
  function relacionar(rng) {
    const conj = rng.elegir(PARES);
    const n = rng.elegir([3, 4]);
    const elegidos = [];
    for (const p of rng.barajar(conj.pares)) {
      if (elegidos.length === n) break;
      if (elegidos.some(q => q.der === p.der)) continue;
      if ((conj.choques || []).some(c => c.includes(p.id) && elegidos.some(q => c.includes(q.id)))) continue;
      elegidos.push(p);
    }
    if (elegidos.length < 3) return null;
    const m = elegidos.length;
    const derecha = rng.barajar(elegidos);
    const buenas = elegidos.map(p => LET[derecha.indexOf(p)]);
    const identidad = LET.slice(0, m);
    const igual = (a, b) => a.every((x, k) => x === b[k]);
    if (igual(buenas, identidad)) return null;
    const texto = letras => letras.map((l, k) => ROM[k] + l).join(', ');
    const correcta = { clave: 'rel:' + texto(buenas), texto: texto(buenas) };
    const fam = conj.familia || [];
    const corto = p => p.izqCorto || p.izq;
    const distractor = l => {
      const cambiados = elegidos.filter((p, k) => l[k] !== buenas[k]);
      const id = conj.codigoFamilia && cambiados.every(p => fam.includes(p.id)) ? conj.codigoFamilia : conj.codigo;
      const lista = cambiados.map(p => `${corto(p)}, ${p.der}`).join('; ');
      const nombres = cambiados.map(corto);
      const unidos = nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
      return err(id, 'rel:' + texto(l), texto(l), `Cruzaste ${unidos}. Lo correcto: ${lista}.`);
    };
    const swap = (l, i, j) => { const c = l.slice(); [c[i], c[j]] = [c[j], c[i]]; return c; };
    const parejas = [];
    for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) parejas.push([i, j]);
    // Pivote: la correcta con dos letras intercambiadas (que no sea el orden idéntico).
    const pivotes = rng.barajar(parejas).map(([i, j]) => swap(buenas, i, j)).filter(l => !igual(l, identidad));
    if (!pivotes.length) return null;
    const d0 = pivotes[0];
    const vecinos = rng.barajar(parejas.map(([i, j]) => swap(d0, i, j)))
      .filter(l => !igual(l, buenas) && !igual(l, identidad));
    const otros = rng.barajar(pivotes.slice(1));
    const errores = [d0, ...vecinos, ...otros].map(distractor);
    const alternativas = P.armarTexto({ correcta, errores, rng, total: 5 });
    if (alternativas.some(a => a.texto === texto(identidad))) return null;
    const voto = votacion(alternativas.map(a => a.texto.split(', ').map(x => x.replace(/^[IV]+/, ''))));
    if (igual(voto, buenas)) return null;
    const variables = Object.fromEntries(elegidos.map((p, k) => [ROM[k], { nombre: conj.izqVar, color: COLOR[k] }]));
    const enunciado = [`Relaciona ${conj.izqNombre} con ${conj.derNombre}.`];
    elegidos.forEach((p, k) => enunciado.push(` ${ROM[k]}. `, v(ROM[k], p.izq)));
    enunciado.push(' —');
    derecha.forEach((p, k) => enunciado.push(` ${LET[k]}) ${p.der}`));
    const solucion = elegidos.map((p, k) => [`${ROM[k]}. `, v(ROM[k], p.izq), ` → ${buenas[k]}) ${p.der}.`]);
    solucion.push([`La relación es ${texto(buenas)}.`]);
    return cierre({ variables, enunciado, pregunta: ['¿Cuál es la relación correcta?'], alternativas, solucion, correcta,
      datos: { tipo: 'relacionar', conjunto: conj.id, ids: elegidos.map(p => p.id), derecha: derecha.map(p => p.id) } });
  }

  return { id: 'quimica-conceptos', generar, BANCO, TEMAS: TEMAS.map(({ props, ...t }) => ({ ...t, ids: props.map(p => p.id) })), PARES, ERRORES };
});
