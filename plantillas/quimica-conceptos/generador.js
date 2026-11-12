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
 *     si falta, se usa 'AQ-negar-verdadera'.
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
 *   cifra del informe (campo respaldo de la proposición); los AQ-… nuevos son «hipotesis».
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
    'AQ-negar-verdadera': { nombre: 'Creer falsa una proposición verdadera (sin un error con nombre)' },
    'AQ-aporte-adelantado': { nombre: 'Atribuir a un modelo o experimento antiguo lo que se supo después' },
    'AQ-aporte-cruzado': { nombre: 'Cruzar el aporte de dos científicos' },
    'AQ-bohr-continuo': { nombre: 'En el modelo de Bohr la energía del electrón es continua' },
    'AQ-alfa-negativa': { nombre: 'Las partículas alfa tienen carga negativa' },
    'AQ-rebote-mayoria': { nombre: 'La mayoría de las partículas alfa rebotó' },
    'AQ-rama-por-sustancia': { nombre: 'Elegir la rama de la química por el tipo de sustancia y no por la tarea' },
    'AQ-rama-definicion': { nombre: 'Definir una rama de la química por un rasgo que no es el suyo' },
    'AQ-organico-es-vivo': { nombre: 'Orgánico = que viene de seres vivos' },
    'AQ-compuesto-suma': { nombre: 'Un compuesto tiene las propiedades de sus elementos' },
    'AQ-atomo-por-ion': { nombre: 'Confundir el átomo neutro con su ion' },
    'AQ-ion-cambia-protones': { nombre: 'Al formar un ion cambian los protones' },
    'AQ-periodo-del-ion': { nombre: 'Leer el periodo en la configuración del ion' },
    'AQ-viscosidad-esferica': { nombre: 'Las moléculas esféricas dan líquidos más viscosos' },
    'AQ-pvapor-volatil': { nombre: 'Más presión de vapor = menos volátil' },
    'AQ-tension-jabon': { nombre: 'El jabón sube la tensión superficial' },
    'AQ-ionico-amorfo': { nombre: 'Llamar amorfo a un sólido iónico cristalino' },
    'AQ-anion-pierde': { nombre: 'El anión se forma perdiendo electrones' },
    'AQ-radio-ion': { nombre: 'Radio del ion al revés respecto del átomo' },
    'AQ-amorfo-cristalino': { nombre: 'Confundir sólido amorfo con cristalino' },
    'AQ-aire-oxigeno': { nombre: 'El O₂ es el gas más abundante del aire' },
    'AQ-agua-dulce-rios': { nombre: 'El agua dulce está sobre todo en ríos y lagos' },
    'AQ-ozono-troposfera': { nombre: 'La capa de ozono está en la tropósfera' },
    'AQ-hielo-fuera': { nombre: 'El hielo no es parte de la hidrósfera' },
    'AQ-secundario-primario': { nombre: 'Llamar primario a un contaminante secundario (o al revés)' },
    'AQ-solo-humano': { nombre: 'Todo contaminante es de origen humano' },
    'AQ-lluvia-ph': { nombre: 'La lluvia ácida sube el pH' },
    'AQ-intervalo-mal-leido': { nombre: 'Leer mal la diferencia en un intervalo de la tendencia' },
    'AQ-absoluto-por-porcentaje': { nombre: 'Dar el cambio absoluto como porcentaje' },
    'AQ-base-equivocada': { nombre: 'Calcular un porcentaje sobre el año base equivocado' },
    'AQ-tendencia-lineal': { nombre: 'Suponer que la tendencia tiene ritmo constante' },
    'AQ-caracter-oxido': { nombre: 'Confundir óxido ácido con óxido básico' },
    'AQ-proceso-metalurgico': { nombre: 'Confundir los procesos metalúrgicos' },
    'AQ-so2-so3': { nombre: 'Llamar anhídrido sulfúrico (SO₃) al SO₂ de la tostación' },
    'AQ-reductor-alto-horno': { nombre: 'El agente reductor del alto horno es el oxígeno' },
    'AQ-anillos-aromatico': { nombre: 'Todo anillo (o varios anillos) es aromático' },
    'AQ-adicion-condensacion': { nombre: 'Confundir polimerización de adición con condensación' },
    'AQ-combustion-incompleta': { nombre: 'La combustión incompleta da solo CO₂ y agua' },
    'AQ-acido-descarga': { nombre: 'El ácido de la batería se concentra al descargarse' },
    'AQ-buffer-infinito': { nombre: 'Una solución reguladora aguanta cualquier cantidad de ácido' },
    'AQ-base-debil-acida': { nombre: 'Una base débil da pH menor que 7' },
    'AQ-lewis-invertido': { nombre: 'Ácido y base de Lewis al revés' },
    'AQ-ionico-conduce': { nombre: 'El sólido iónico conduce en estado sólido' },
    'AQ-covalente-bajo': { nombre: 'Covalente = funde a baja temperatura, aun en una red' },
    'AQ-molecular-soluble': { nombre: 'Todo sólido molecular se disuelve en agua' },
    'AQ-tipo-solido': { nombre: 'Asignar mal el tipo de sólido' },
    'AQ-anion-monoatomico': { nombre: 'Los aniones son solo monoatómicos' },
    'AQ-carga-oxoanion': { nombre: 'Carga equivocada de un oxoanión' },
    'AQ-ionico-ductil': { nombre: 'Los sólidos iónicos son dúctiles como los metales' },
    'AQ-sal-inorganica': { nombre: 'Toda sal es inorgánica' },
    'AQ-ion-radical': { nombre: 'Tener carga = ser radical' },
    'AQ-peroxido-radical': { nombre: 'Llamar radical al peróxido o al hidroperóxido' },
    'AQ-hidruro-sin-pares': { nombre: 'Creer que el hidruro no tiene pares libres' },
    'AQ-sal-acida-basica': { nombre: 'Confundir sal ácida, básica y neutra' },
    'AQ-vitamina-solubilidad': { nombre: 'Cruzar vitaminas hidrosolubles y liposolubles' },
    'AQ-ruta-vitamina-d': { nombre: 'Orden equivocado de la activación de la vitamina D' },
    'AQ-vitamina-coenzima': { nombre: 'Cruzar una vitamina con la coenzima de otra' },
    'AQ-vitamina-funcion': { nombre: 'Cruzar una vitamina con la función de otra' },
    'AQ-desnaturalizacion-reversible': { nombre: 'La desnaturalización por calor se revierte al enfriar' },
    'AQ-punto-isoelectrico': { nombre: 'En el punto isoeléctrico la carga no es cero' },
    'AQ-peptidico-exclusivo': { nombre: 'El enlace peptídico es propio de una sola fuente de proteínas' },
    'AQ-reductor-dulce': { nombre: 'Azúcar reductor = azúcar dulce' },
    'AQ-disacarido-no-reductor': { nombre: 'Ningún disacárido es reductor' },
    'AQ-alcaloide-clase': { nombre: 'No reconocer qué es un alcaloide' },
    'AQ-oh-soluble': { nombre: 'Un grupo OH basta para que la molécula se disuelva en agua' },
    'AQ-catalizador-activo': { nombre: 'Con un catalizador activo, la hidrogenación se detiene en el alqueno' },
    'AQ-lindlar-trans': { nombre: 'El catalizador de Lindlar da el alqueno trans' },
    'AQ-h2-por-pi': { nombre: 'Moles de H₂ que no corresponden a los enlaces π' },
    'AQ-oxidacion-organica-invertida': { nombre: 'Oxidación y reducción orgánica al revés' },
    'AQ-cis-es-z': { nombre: 'Cis-trans y Z/E siempre coinciden' },
    'AQ-anhidrido-trans': { nombre: 'El isómero trans forma el anhídrido cíclico' },
    'AQ-polaridad-geometrica': { nombre: 'Polaridad de los isómeros geométricos al revés' },
    'AQ-fusion-geometrica': { nombre: 'Temperatura de fusión de los isómeros geométricos al revés' },
    'AQ-gas-fermentacion': { nombre: 'La fermentación alcohólica libera O₂' },
    'AQ-clase-alcohol': { nombre: 'Clase de alcohol o producto de su oxidación equivocados' },
    'AQ-disulfuro-debil': { nombre: 'El puente disulfuro es una interacción débil' },
    'AQ-hidrofobico-afuera': { nombre: 'Las cadenas apolares quedan hacia el agua' },
    'AQ-ionica-iguales': { nombre: 'Cargas iguales forman una interacción iónica' },
    'AQ-cadena-lateral-peptidico': { nombre: 'Las cadenas laterales se unen por enlaces peptídicos' },
    'AQ-aldosa-cetosa-posicion': { nombre: 'Aldosa y cetosa como isómeros de posición' },
    'AQ-aldosa-cetosa': { nombre: 'Confundir aldosa con cetosa' },
    'AQ-isomeros-formula': { nombre: 'Los isómeros tienen fórmulas moleculares distintas' },
    'AQ-azucar-insoluble': { nombre: 'Los monosacáridos son poco solubles en agua' },
    'AQ-co2-hemoglobina': { nombre: 'El CO₂ viaja sobre todo unido a la hemoglobina' },
    'AQ-o2-disuelto': { nombre: 'El O₂ viaja sobre todo disuelto en el plasma' },
    'AQ-reactividad-aire': { nombre: 'Reactividad de los gases del aire al revés' },
    'AQ-metal-degradable': { nombre: 'Los metales pesados se degradan' },
    'AQ-nutriente-inocuo': { nombre: 'Los fertilizantes no contaminan porque son nutrientes' },
    'AQ-oxisal-haloidea': { nombre: 'Confundir oxisal con sal haloidea' },
    'AQ-dativo-aporte': { nombre: 'En el enlace dativo cada átomo aporta un electrón' },
    'AQ-sin-dativo': { nombre: 'No ver los enlaces dativos de un oxoanión' },
    'AQ-porcentaje-solvente': { nombre: 'Leer el porcentaje del soluto como el del solvente' },
    'AQ-alcohol-acido': { nombre: 'Una solución de alcohol es ácida' },
    'AQ-fem-negativa': { nombre: 'Una celda espontánea tiene fem negativa' },
    'AQ-cation-anion': { nombre: 'Llamar anión a un catión (o al revés)' },
    'AQ-electrones-oxidacion': { nombre: 'Contar mal los electrones que cede el carbono' },
    'AQ-precursor-cruzado': { nombre: 'Cruzar una sustancia con lo que se forma de otra' },
    // Cierre 100 (12 nov 2026, hipótesis nuestras).
    'AQ-sp2-sin-carboxilo': { nombre: 'Olvidar el carbono del carboxilo al contar los carbonos sp²' },
    'AQ-carboxilo-sp3': { nombre: 'Creer que el carbono del carboxilo es sp³' },
    'AQ-isomero-por-grupos': { nombre: 'Llamar isómeros a moléculas parecidas que no tienen la misma fórmula' },
    'AQ-quiral-no-ve': { nombre: 'No reconocer un carbono con cuatro grupos distintos' },
    'AQ-quiral-en-CH2': { nombre: 'Ver un carbono quiral en un CH₂ o en un CH₃' },
    'AQ-formula-olvida-O': { nombre: 'Olvidar el oxígeno del OH al escribir la fórmula de un hidroxiácido' },
    'AQ-hidrogeno-en-el-nitrogeno': { nombre: 'Pegar el H al nitrógeno en un oxoácido (en vez de a un oxígeno)' },
    'AQ-lewis-enlaces': { nombre: 'Contar mal los enlaces simples y dobles de la estructura de Lewis del HNO₂' },
    'AQ-color-no-no2': { nombre: 'Cruzar el color del NO con el del NO₂' },
    'AQ-dismutacion-una-via': { nombre: 'Creer que una sustancia no puede oxidarse y reducirse a la vez' },
    'AQ-nox-hno2': { nombre: 'Dar al N del HNO₂ el número de oxidación del HNO₃' },
    'AQ-escala-mal': { nombre: 'Escalar mal una cantidad (dividir cuando había que multiplicar)' },
    'AQ-metilo-etilo': { nombre: 'Llamar etilo a un metilo' },
    'AQ-pi-olvida-anillos': { nombre: 'Olvidar los dobles enlaces de los anillos al contar enlaces π' },
    'AQ-hidrocarburo-solo-cadena': { nombre: 'Creer que un hidrocarburo no puede tener anillos' },
    'AQ-metilos-solo-cadena': { nombre: 'Contar como metilos solo los de la cadena y olvidar los de los anillos' },
    'AQ-aromatico-adicion': { nombre: 'Creer que el anillo aromático reacciona por adición, como un alqueno' },
    'AQ-aromatico-inerte': { nombre: 'Creer que, por tener un anillo aromático, la molécula no reacciona con un hidróxido' },
    'AQ-amina-clase': { nombre: 'Llamar alifática a una amina unida directamente a un anillo aromático' },
    'AQ-ester-eter': { nombre: 'Confundir éster con éter' },
    'AQ-cadena-insoluble': { nombre: 'Creer que una cadena de carbonos hace insoluble a una molécula con muchos OH' },
    'AQ-ester-insoluble': { nombre: 'Creer que todo éster es insoluble en agua o no hace puentes de hidrógeno' },
    'AQ-aldehido-carboxilo': { nombre: 'Confundir el aldehído con el carboxilo' },
    'AQ-lewis-radical-anion': { nombre: 'Escribir igual el radical ·OH y el anión OH⁻' },
    'AQ-fenton-reversible': { nombre: 'Creer que la reacción de Fenton es reversible' },
    'AQ-lactama-carboxilo': { nombre: 'Contar como carboxilo el C=O de una lactama' },
    'AQ-conteo-carboxilos': { nombre: 'Contar mal los carboxilos de una molécula grande' },
    'AQ-hidrocarburo-muchos-C': { nombre: 'Creer que una molécula con muchos carbonos es un hidrocarburo' },
    'AQ-cadena-sp2': { nombre: 'Creer que todos los carbonos de una cadena con un carboxilo son sp²' },
    'AQ-dismutacion-cruzada': { nombre: 'Cruzar las especies que salen de la dismutación del ácido nitroso' },
    'AQ-pourbaix-h-poh': { nombre: 'Pourbaix: tomar [H⁺] = 10⁻ᵏ como si el exponente fuera el pOH (pH = 14 − k)' },
    'AQ-pourbaix-poh-ph': { nombre: 'Pourbaix: usar el pOH como si fuera el pH' },
    'AQ-pourbaix-ph-poh': { nombre: 'Pourbaix: usar el pH como si fuera el pOH' },
    'AQ-pourbaix-signo-e': { nombre: 'Pourbaix: leer el potencial con el signo cambiado' },
    'AQ-pourbaix-lectura': { nombre: 'Pourbaix: ubicar mal el punto en el diagrama (pH en el eje horizontal, potencial en el vertical)' },
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
      V('dal2', 'Según Dalton, todos los átomos de un mismo elemento son iguales en masa y en propiedades.', 'Así lo postuló; después los isótopos mostraron que la masa puede variar.', 'AQ-aporte-adelantado'),
      V('dal3', 'Según Dalton, en una reacción química los átomos solo se reordenan: no se crean ni se destruyen.', 'Ese postulado explica la conservación de la masa.'),
      V('dal4', 'Según Dalton, los átomos de elementos distintos se combinan en proporciones de números enteros sencillos.', 'Con eso explicó las proporciones fijas y múltiples de los compuestos.'),
      F('dal6', 'Según Dalton, el átomo tiene electrones incrustados en una masa de carga positiva.', 'AT5', 'Ese es el modelo de Thomson (1904). Para Dalton el átomo no tenía partes.', 'Thomson propuso los electrones incrustados en una masa positiva; para Dalton, el átomo era una esfera maciza sin partes.'),
      F('dal7', 'Según Dalton, los átomos de un mismo elemento pueden tener masas distintas.', 'AQ-aporte-adelantado', 'Dalton postuló que todos los átomos de un elemento tienen la misma masa; los isótopos, de masas distintas, se conocieron un siglo después.', 'Según Dalton, todos los átomos de un mismo elemento tienen la misma masa.'),
      F('dal8', 'Según Dalton, el átomo está formado por electrones, protones y neutrones.', 'AQ-aporte-adelantado', 'La teoría es de 1808; el electrón se descubrió en 1897 y el neutrón en 1932.', 'Según Dalton, el átomo es indivisible: no tiene partículas más pequeñas.'),
      F('dal9', 'Según Dalton, el átomo se puede dividir en partículas más pequeñas.', 'AQ-aporte-adelantado', 'Que el átomo tiene partes se supo después; Dalton lo consideraba indivisible.', 'Según Dalton, el átomo no se puede dividir.'),
    ] },
    { id: 'modelos', unidad: 'quimica.estructura-atomica', nombre: 'los modelos de Thomson, Rutherford y Bohr, y el modelo actual', props: [
      V('mod1', 'En el modelo de Thomson, los electrones están incrustados en una esfera de carga positiva repartida en todo el átomo.', 'Es el modelo del «budín con pasas».', 'AT5'),
      V('mod2', 'Rutherford propuso que casi toda la masa del átomo y toda su carga positiva están en un núcleo muy pequeño.', 'Lo dedujo del rebote de unas pocas partículas alfa en la lámina de oro.', 'AT5'),
      V('mod3', 'En el modelo de Bohr, el electrón del hidrógeno solo puede estar en ciertas órbitas, cada una con una energía fija.', 'Las energías están cuantizadas: solo se permiten ciertos niveles.', 'AQ-bohr-continuo'),
      V('mod5', 'En el modelo actual, un orbital es la región del espacio donde es más probable encontrar al electrón.', 'El modelo mecánico-cuántico no da trayectorias, sino probabilidades.', 'AT6'),
      V('mod6', 'El modelo de Bohr explicó el espectro de líneas del átomo de hidrógeno.', 'Cada línea corresponde a un salto entre dos niveles de energía.'),
      F('mod7', 'En el modelo de Rutherford, los electrones ocupan orbitales con forma de nube.', 'AT5', 'Los orbitales son del modelo mecánico-cuántico (Schrödinger, 1926). Rutherford ponía a los electrones girando alrededor del núcleo, sin niveles definidos.', 'En el modelo de Rutherford, los electrones giran alrededor del núcleo; los orbitales aparecen con el modelo mecánico-cuántico.'),
      F('mod8', 'Thomson propuso que el átomo tiene un núcleo positivo pequeño y denso.', 'AT5', 'El núcleo es la idea de Rutherford (1911). En el modelo de Thomson la carga positiva está repartida en todo el átomo.', 'Rutherford propuso el núcleo pequeño y denso; Thomson, una carga positiva repartida en todo el átomo.'),
      F('mod9', 'En el modelo de Bohr, el electrón puede tener cualquier valor de energía al girar alrededor del núcleo.', 'AQ-bohr-continuo', 'Bohr postuló que solo se permiten ciertas órbitas, con energías fijas.', 'En el modelo de Bohr, el electrón solo puede tener ciertos valores de energía.'),
      F('mod10', 'En el modelo actual, el electrón sigue una trayectoria circular fija, como un planeta alrededor del Sol.', 'AT5', 'Las órbitas fijas son del modelo de Bohr. En el modelo actual no se habla de trayectorias, sino de orbitales.', 'En el modelo actual, el electrón se describe con orbitales: regiones de probabilidad, no trayectorias.'),
      F('mod11', 'Un orbital y una órbita son lo mismo: el camino que recorre el electrón.', 'AT6', 'La órbita es una trayectoria (Bohr); el orbital es una región de probabilidad (modelo actual).', 'Una órbita es una trayectoria; un orbital es la región donde es más probable hallar al electrón.'),
    ] },
    { id: 'rutherford', unidad: 'quimica.estructura-atomica', nombre: 'el experimento de Rutherford con la lámina de oro', props: [
      V('rut1', 'En el experimento de la lámina de oro, la mayoría de las partículas alfa atravesó la lámina sin desviarse.', 'Por eso se concluyó que casi todo el átomo es espacio casi vacío.', 'AQ-rebote-mayoria'),
      V('rut2', 'Que unas pocas partículas alfa rebotaran indicó que en el átomo hay una zona muy pequeña, densa y con carga positiva.', 'Esa zona es el núcleo.'),
      V('rut3', 'Las partículas alfa usadas en el experimento tienen carga positiva.', 'Son núcleos de helio: dos protones y dos neutrones, carga 2+.', 'AQ-alfa-negativa'),
      V('rut4', 'Del experimento se concluyó que la mayor parte del volumen del átomo es espacio casi vacío.', 'Lo indica que la mayoría de las partículas pasó sin desviarse.'),
      F('rut6', 'Las partículas alfa tienen carga negativa; por eso el núcleo las atrajo.', 'AQ-alfa-negativa', 'Las partículas alfa son núcleos de helio, con carga 2+: el núcleo positivo las repele.', 'Las partículas alfa tienen carga positiva; las que se desviaron fueron repelidas por el núcleo positivo.'),
      F('rut7', 'El experimento de la lámina de oro mostró que los electrones giran en órbitas de energía fija.', 'AT5', 'Las órbitas de energía fija las propuso Bohr en 1913, después. El experimento mostró el núcleo.', 'El experimento de la lámina de oro mostró que el átomo tiene un núcleo pequeño, denso y positivo.'),
      F('rut8', 'La mayoría de las partículas alfa rebotó en la lámina de oro.', 'AQ-rebote-mayoria', 'Solo una fracción muy pequeña rebotó; la mayoría pasó sin desviarse.', 'La mayoría de las partículas alfa atravesó la lámina; solo unas pocas rebotaron.'),
      F('rut10', 'Del experimento de la lámina de oro se dedujo que el núcleo contiene neutrones.', 'AQ-aporte-adelantado', 'El neutrón lo descubrió Chadwick en 1932, más de veinte años después.', 'Del experimento se dedujo que existe un núcleo positivo; los neutrones se descubrieron después.'),
    ] },
    // ===== Materia y energía =====
    { id: 'ramas', unidad: 'quimica.materia-y-energia', nombre: 'las ramas de la química', props: [
      V('ram1', 'La química orgánica estudia principalmente los compuestos del carbono.', 'Naturales o sintéticos: proteínas, plásticos, combustibles, medicinas.', 'AQ-organico-es-vivo'),
      V('ram2', 'La química analítica se ocupa de identificar qué sustancias hay en una muestra y en qué cantidad.', 'Qué hay es el análisis cualitativo; cuánto hay, el cuantitativo.', 'AQ-rama-por-sustancia'),
      V('ram3', 'La bioquímica estudia las sustancias y las reacciones químicas de los seres vivos.', 'Por ejemplo, cómo la célula obtiene energía de la glucosa.'),
      V('ram4', 'La fisicoquímica estudia la energía, la velocidad y el equilibrio de los procesos químicos.', 'Usa las leyes de la física para explicar los cambios químicos.'),
      F('ram6', 'Determinar cuánta cafeína tiene una bebida es tarea de la química orgánica, porque la cafeína es un compuesto orgánico.', 'AQ-rama-por-sustancia', 'La rama se elige por lo que se hace: medir cuánto hay de una sustancia es química analítica, aunque la sustancia sea orgánica.', 'Determinar cuánta cafeína tiene una bebida es tarea de la química analítica.'),
      F('ram7', 'La química inorgánica estudia solo los metales.', 'AQ-rama-definicion', 'Estudia los elementos y sus compuestos en general (metales, no metales, sales, ácidos), salvo los compuestos orgánicos.', 'La química inorgánica estudia los elementos y los compuestos que no son orgánicos, metálicos o no.'),
      F('ram8', 'La química orgánica estudia solo las sustancias que provienen de seres vivos.', 'AQ-organico-es-vivo', 'Estudia los compuestos del carbono, también los sintéticos, como los plásticos o muchas medicinas.', 'La química orgánica estudia los compuestos del carbono, naturales o sintéticos.'),
      F('ram9', 'Estudiar las reacciones con que una célula muscular obtiene energía de la glucosa es tarea de la química analítica.', 'AQ-rama-por-sustancia', 'Las reacciones de los seres vivos son el campo de la bioquímica.', 'Estudiar cómo una célula obtiene energía de la glucosa es tarea de la bioquímica.'),
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
      F('sus11', 'Un compuesto tiene las mismas propiedades que los elementos que lo forman.', 'AQ-compuesto-suma', 'El sodio es un metal que reacciona con el agua y el cloro un gas tóxico; el cloruro de sodio es la sal de mesa.', 'Un compuesto tiene propiedades propias, distintas de las de sus elementos.'),
      F('oxi12', 'El agua gasificada (agua con CO₂ disuelto) es un compuesto.', 'MA9', 'Es CO₂ disuelto en agua: dos sustancias mezcladas, que se separan al destapar la botella.', 'El agua gasificada es una mezcla homogénea.'),
    ] },
    // ===== Tabla periódica =====
    { id: 'ion-sodio', unidad: 'quimica.tabla-periodica', nombre: 'los átomos y sus iones', props: [
      V('sod1', 'El átomo de sodio (Z = 11) tiene un solo electrón en su último nivel: 3s¹.', 'Su configuración es 1s² 2s² 2p⁶ 3s¹.'),
      V('sod2', 'El ion Na⁺ tiene 10 electrones y la misma configuración electrónica que el neón.', 'Perdió el electrón 3s: queda 1s² 2s² 2p⁶.', 'AQ-atomo-por-ion'),
      V('sod3', 'El ion Na⁺ y el átomo de sodio tienen el mismo número de protones.', 'Al formar un ion solo cambian los electrones; los 11 protones siguen.', 'AQ-ion-cambia-protones'),
      V('sod4', 'En el cuerpo humano, el sodio está como ion Na⁺ disuelto, no como sodio metálico.', 'El sodio metálico reaccionaría con el agua; en los líquidos del cuerpo hay iones Na⁺.', 'AQ-atomo-por-ion'),
      V('sod5', 'El radio del ion Na⁺ es menor que el del átomo de sodio, porque el ion perdió su último nivel.', 'Queda con dos niveles y los mismos 11 protones.', 'AQ-radio-ion'),
      F('sod7', 'El ion Na⁺ tiene 12 electrones, porque ganó un electrón.', 'AQ-atomo-por-ion', 'La carga positiva indica que perdió un electrón: 11 − 1 = 10.', 'El ion Na⁺ tiene 10 electrones: el átomo perdió uno.'),
      F('sod8', 'El ion Na⁺ tiene la configuración 1s² 2s² 2p⁶ 3s¹.', 'AQ-atomo-por-ion', 'Esa es la configuración del átomo neutro. El ion perdió el electrón 3s.', 'El ion Na⁺ tiene la configuración 1s² 2s² 2p⁶.'),
      F('sod9', 'El sodio de la sal de mesa reacciona con el agua igual que el sodio metálico.', 'AQ-atomo-por-ion', 'En la sal el sodio está como Na⁺, que ya perdió su electrón: no reacciona con el agua como el metal.', 'El ion Na⁺ de la sal no reacciona con el agua como el sodio metálico; solo se disuelve.'),
      F('sod10', 'Al formar el ion Na⁺, el átomo de sodio pierde un protón.', 'AQ-ion-cambia-protones', 'Si perdiera un protón dejaría de ser sodio. Lo que pierde es un electrón.', 'Al formar el ion Na⁺, el átomo de sodio pierde un electrón.'),
      F('sod12', 'El sodio está en el mismo periodo que el neón.', 'AQ-periodo-del-ion', 'El neón está en el periodo 2 y el sodio en el 3. Lo que comparten es la configuración del ion Na⁺ con la del neón.', 'El sodio está en el periodo 3: el átomo neutro tiene electrones en el nivel 3.'),
      V('sol6', 'El ion cloruro (Cl⁻) es más grande que el átomo de cloro, porque tiene un electrón más con la misma carga nuclear.', 'Aumenta la repulsión entre electrones y la nube electrónica se expande.', 'AQ-radio-ion'),
      F('sol9', 'El ion cloruro se forma cuando el átomo de cloro pierde un electrón.', 'AQ-anion-pierde', 'Un anión tiene carga negativa: el cloro gana un electrón.', 'El ion cloruro se forma cuando el átomo de cloro gana un electrón.'),
      F('sol10', 'El ion Cl⁻ es más pequeño que el átomo de cloro, porque tiene carga.', 'TP4', 'Con un electrón más y la misma carga nuclear, la repulsión entre electrones aumenta y la nube se expande.', 'El ion Cl⁻ es más grande que el átomo de cloro.'),
    ] },
    // ===== Líquidos y sólidos =====
    { id: 'liquidos', unidad: 'quimica.liquidos-y-solidos', nombre: 'la viscosidad, la tensión superficial y la presión de vapor', props: [
      V('liq1', 'Un líquido de moléculas largas y flexibles, que se enredan entre sí, suele ser muy viscoso.', 'Las moléculas enredadas no se deslizan con facilidad unas sobre otras.', 'AQ-viscosidad-esferica'),
      V('liq2', 'La glicerina es más viscosa que el agua: sus moléculas son más grandes y tienen tres grupos OH que forman puentes de hidrógeno.', 'Moléculas más grandes y con más puntos de atracción se deslizan peor unas sobre otras.'),
      V('liq4', 'En general, cuanto más fuertes son las fuerzas intermoleculares de un líquido, mayor es su tensión superficial.', 'Las moléculas de la superficie son jaladas con más fuerza hacia el interior.'),
      V('liq5', 'A una misma temperatura, el líquido más volátil tiene la mayor presión de vapor.', 'Más moléculas escapan al vapor cuando las fuerzas entre ellas son débiles.', 'AQ-pvapor-volatil'),
      V('liq6', 'El agua tiene mayor tensión superficial que el etanol, porque forma más puentes de hidrógeno por molécula.', 'Las moléculas de la superficie son jaladas con más fuerza hacia el interior.'),
      F('liq9', 'Los líquidos de moléculas pequeñas y casi esféricas son los más viscosos.', 'AQ-viscosidad-esferica', 'Las moléculas pequeñas y redondeadas ruedan con facilidad unas sobre otras: dan líquidos poco viscosos.', 'Los líquidos de moléculas largas que se enredan, o con muchas fuerzas entre ellas, son los más viscosos.'),
      F('liq10', 'Un líquido con mayor presión de vapor es menos volátil.', 'AQ-pvapor-volatil', 'Mayor presión de vapor significa que más moléculas pasan al vapor: es más volátil.', 'Un líquido con mayor presión de vapor es más volátil.'),
      F('liq11', 'La presión de vapor de un líquido depende del tamaño del recipiente que lo contiene.', 'GQ18', 'A una temperatura dada, la presión de vapor de un líquido puro es fija.', 'La presión de vapor depende de la temperatura y del líquido, no del recipiente.'),
      F('liq12', 'Al agregarle jabón, la tensión superficial del agua aumenta.', 'AQ-tension-jabon', 'El jabón se acomoda en la superficie y debilita las atracciones entre las moléculas de agua.', 'El jabón disminuye la tensión superficial del agua.'),
      F('liq15', 'A 25 °C, el etanol tiene menor presión de vapor que el agua.', 'AQ-pvapor-volatil', 'El etanol es más volátil que el agua: a 25 °C su presión de vapor es mayor.', 'A 25 °C, el etanol tiene mayor presión de vapor que el agua.'),
    ] },
    { id: 'solidos', unidad: 'quimica.liquidos-y-solidos', nombre: 'los sólidos cristalinos y amorfos', props: [
      V('sol1', 'En un sólido cristalino, las partículas se ordenan en un patrón que se repite en el espacio.', 'Ese orden de largo alcance es lo que define al cristal.', 'AQ-amorfo-cristalino'),
      V('sol2', 'El cloruro de sodio sólido es cristalino: sus iones forman una red ordenada.', 'Cada Na⁺ queda rodeado de seis Cl⁻ y cada Cl⁻ de seis Na⁺.', 'AQ-ionico-amorfo'),
      V('sol3', 'El vidrio común es un sólido amorfo.', 'Sus partículas no tienen un orden que se repita; se ablanda en un intervalo de temperaturas.', 'AQ-amorfo-cristalino'),
      V('sol5', 'La celda unitaria es la unidad de la red que, repetida en el espacio, reproduce todo el cristal.', 'Es como el ladrillo con que se arma el cristal.'),
      F('sol8', 'La sal común es un sólido amorfo, porque sus granos tienen formas distintas.', 'AQ-ionico-amorfo', 'Cada grano es un cristal (o varios): por dentro, los iones siguen una red ordenada.', 'La sal común es un sólido cristalino.'),
      F('sol11', 'El vidrio es un sólido cristalino.', 'AQ-amorfo-cristalino', 'La dureza y la transparencia no dicen nada del orden interno: el vidrio no tiene red ordenada.', 'El vidrio es un sólido amorfo.'),
      F('sol13', 'El cloruro de sodio sólido está formado por moléculas de NaCl separadas.', 'EN1', 'Es una red de iones: cada ion atrae a todos sus vecinos de carga opuesta, sin moléculas sueltas.', 'El cloruro de sodio sólido es una red de iones Na⁺ y Cl⁻.'),
      F('sol14', 'En un sólido amorfo, las partículas forman una red ordenada que se repite en todo el sólido.', 'AQ-amorfo-cristalino', 'Ese orden que se repite es el de los sólidos cristalinos. En un amorfo, como el vidrio, no hay un patrón repetido.', 'En un sólido amorfo, las partículas no siguen un patrón que se repita.'),
    ] },
    // ===== Ambiente =====
    { id: 'esferas', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'la atmósfera, la hidrósfera y la litósfera', props: [
      V('esf1', 'La hidrósfera comprende toda el agua del planeta: océanos, ríos, lagos, aguas subterráneas y hielo.', 'El hielo de glaciares y casquetes también es parte de la hidrósfera.', 'AQ-hielo-fuera'),
      V('esf2', 'La mayor parte del agua de la hidrósfera es agua salada de los océanos.', 'Cerca del 97 % del agua del planeta es salada.'),
      V('esf3', 'La litósfera es la capa rocosa externa de la Tierra: la corteza y la parte superior del manto.', 'Es la capa sólida y rígida sobre la que están los continentes y el fondo de los océanos.'),
      V('esf4', 'El nitrógeno (N₂) es el gas más abundante de la atmósfera.', 'Es cerca del 78 % del aire seco en volumen; el O₂, cerca del 21 %.', 'AQ-aire-oxigeno'),
      V('esf5', 'La capa de ozono se encuentra en la estratósfera.', 'Allí el O₃ absorbe gran parte de la radiación ultravioleta del Sol.', 'AQ-ozono-troposfera'),
      F('esf8', 'El oxígeno (O₂) es el gas más abundante de la atmósfera.', 'AQ-aire-oxigeno', 'El O₂ es cerca del 21 % del aire seco; el N₂, cerca del 78 %.', 'El gas más abundante de la atmósfera es el nitrógeno (N₂).'),
      F('esf9', 'La mayor parte del agua dulce del planeta está en los ríos y los lagos.', 'AQ-agua-dulce-rios', 'Casi toda el agua dulce está en glaciares y casquetes de hielo, y en el subsuelo; ríos y lagos tienen una parte muy pequeña.', 'La mayor parte del agua dulce está congelada en glaciares y casquetes, y en el subsuelo.'),
      F('esf10', 'La capa de ozono está en la tropósfera, donde se forman las nubes.', 'AQ-ozono-troposfera', 'La tropósfera es la capa más baja; la capa de ozono está más arriba, en la estratósfera.', 'La capa de ozono está en la estratósfera.'),
      F('esf12', 'La hidrósfera solo incluye el agua líquida; el hielo de los glaciares es parte de la litósfera.', 'AQ-hielo-fuera', 'La hidrósfera incluye el agua en todos sus estados, también el hielo.', 'El hielo de los glaciares es parte de la hidrósfera.'),
    ] },
    { id: 'contaminantes', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'los contaminantes del aire y la lluvia ácida', props: [
      V('con1', 'Un contaminante primario es el que se emite directamente desde su fuente, como el CO del escape de un auto.', 'Sale tal cual de la fuente; no se forma después en el aire.', 'AQ-secundario-primario'),
      V('con2', 'El ozono cercano al suelo es un contaminante secundario: se forma en el aire a partir de otros contaminantes y la luz solar.', 'Se forma con los NOₓ y los hidrocarburos del tráfico, con luz solar (smog fotoquímico).', 'QA8'),
      V('con3', 'El SO₂ que sale al quemar carbón o petróleo con azufre es un contaminante primario.', 'Sale directamente de la combustión.'),
      V('con4', 'El ácido sulfúrico de la lluvia ácida es un contaminante secundario, porque se forma en el aire a partir del SO₂.', 'El SO₂ se oxida y se disuelve en las gotas de agua.', 'AQ-secundario-primario'),
      V('con6', 'Un volcán puede emitir SO₂: también hay contaminantes de origen natural.', 'Los volcanes, los incendios forestales y el polvo también aportan contaminantes.', 'AQ-solo-humano'),
      F('con8', 'El ozono cercano al suelo es un contaminante primario, porque lo emiten directamente los autos.', 'QA8', 'Los autos emiten NOₓ e hidrocarburos; el ozono se forma después en el aire, con la luz solar.', 'El ozono cercano al suelo es un contaminante secundario.'),
      F('con9', 'La lluvia ácida se debe sobre todo al CO₂.', 'QA4', 'El CO₂ forma ácido carbónico, que es débil: la lluvia normal ya tiene pH cerca de 5,6. La lluvia ácida viene del SO₂ y de los NOₓ.', 'La lluvia ácida se debe sobre todo al SO₂ y a los NOₓ.'),
      F('con10', 'Todos los contaminantes del aire provienen de la actividad humana.', 'AQ-solo-humano', 'Los volcanes emiten SO₂ y ceniza, y los incendios forestales emiten humo y CO.', 'Hay contaminantes del aire de origen humano y de origen natural.'),
      F('con12', 'El monóxido de carbono es un contaminante secundario.', 'AQ-secundario-primario', 'El CO sale directamente de una combustión incompleta: es primario.', 'El monóxido de carbono es un contaminante primario.'),
      F('con13', 'La lluvia ácida sube el pH de los lagos y los suelos.', 'AQ-lluvia-ph', 'Lo ácido baja el pH: los lagos y los suelos se acidifican.', 'La lluvia ácida baja el pH de los lagos y los suelos.'),
    ] },
    { id: 'tendencia', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'lo que dicen esos datos del glaciar',
      contexto: 'Un informe dice que el glaciar de un nevado andino tenía 30 km² en 1980, 24 km² en 1995, 20 km² en 2005 y 12 km² en 2020.', props: [
      V('ten1', 'Entre 1980 y 2020, el glaciar perdió 18 km².', '30 − 12 = 18 km².', 'AQ-intervalo-mal-leido'),
      V('ten2', 'Entre 1980 y 2020, el glaciar perdió el 60 % del área que tenía en 1980.', '18 ÷ 30 = 0,6, es decir, el 60 %.', 'AQ-absoluto-por-porcentaje'),
      V('ten3', 'Entre 2005 y 2020 se perdió más área que entre 1980 y 1995.', '20 − 12 = 8 km² contra 30 − 24 = 6 km², en intervalos de 15 años los dos.', 'AQ-intervalo-mal-leido'),
      V('ten5', 'El glaciar retrocedió más rápido entre 2005 y 2020 que entre 1995 y 2005.', '8 km² en 15 años (más de 0,5 km² por año) contra 4 km² en 10 años (0,4 km² por año).', 'AQ-tendencia-lineal'),
      V('ten10', 'Entre 1995 y 2020, el glaciar perdió la mitad del área que tenía en 1995.', 'Pasó de 24 km² a 12 km²: perdió 12 km², la mitad.', 'AQ-base-equivocada'),
      F('ten6', 'Entre 1995 y 2005, el glaciar perdió 6 km².', 'AQ-intervalo-mal-leido', 'De 24 km² a 20 km² hay 4 km². Los 6 km² son del intervalo 1980–1995.', 'Entre 1995 y 2005, el glaciar perdió 4 km².'),
      F('ten7', 'Entre 1980 y 2020, el glaciar perdió el 18 % de su área.', 'AQ-absoluto-por-porcentaje', 'Perdió 18 km², que no es lo mismo que el 18 %: 18 ÷ 30 = 60 %.', 'Entre 1980 y 2020, el glaciar perdió 18 km², el 60 % de su área.'),
      F('ten8', 'En 2020, el glaciar tenía el 40 % del área que tenía en 1995.', 'AQ-base-equivocada', 'El 40 % es 12 ÷ 30, sobre el área de 1980. Sobre la de 1995: 12 ÷ 24 = 50 %.', 'En 2020, el glaciar tenía el 50 % del área que tenía en 1995.'),
      F('ten9', 'De 1980 a 2020, el glaciar perdió área siempre al mismo ritmo.', 'AQ-tendencia-lineal', 'Hasta 2005 perdió 0,4 km² por año; de 2005 a 2020, más de 0,5 km² por año.', 'De 2005 a 2020 el glaciar retrocedió más rápido que antes.'),
      F('ten11', 'Entre 2005 y 2020, el área del glaciar se redujo a la mitad.', 'AQ-intervalo-mal-leido', 'De 20 km² a 12 km² perdió 8 km², el 40 %: quedó el 60 %.', 'Entre 2005 y 2020, el glaciar perdió el 40 % de su área.'),
    ] },
    // ===== Nomenclatura inorgánica =====
    { id: 'oxidos', unidad: 'quimica.nomenclatura-inorganica', nombre: 'los óxidos, los ácidos y sus nombres tradicionales', props: [
      V('oxi1', 'El CO₂ es un óxido ácido, porque con agua forma ácido carbónico.', 'CO₂ + H₂O → H₂CO₃.', 'AQ-caracter-oxido'),
      V('oxi2', 'El CaO es un óxido básico: con agua forma hidróxido de calcio.', 'CaO + H₂O → Ca(OH)₂.', 'AQ-caracter-oxido'),
      V('oxi3', 'En general, los óxidos de los no metales son ácidos y los de los metales activos son básicos.', 'Los de no metales dan ácidos con agua; los de metales activos, hidróxidos.', 'AQ-caracter-oxido'),
      V('oxi4', 'En la nomenclatura tradicional, el sufijo -ico indica el mayor de dos estados de oxidación.', 'Y el sufijo -oso, el menor: férrico (+3) y ferroso (+2).', 'NO2'),
      V('oxi5', 'El FeCl₃ se llama cloruro férrico en la nomenclatura tradicional.', 'El hierro actúa con +3, su mayor estado de oxidación común.', 'NO2'),
      F('oxi8', 'El SO₂ es un óxido básico.', 'AQ-caracter-oxido', 'Todo óxido contiene oxígeno. El SO₂ es óxido de un no metal: con agua forma ácido sulfuroso.', 'El SO₂ es un óxido ácido (anhídrido sulfuroso).'),
      F('oxi9', 'El sufijo -oso indica el mayor estado de oxidación del metal.', 'NO2', 'Es al revés: -oso para el menor, -ico para el mayor.', 'El sufijo -oso indica el menor estado de oxidación del metal.'),
      F('oxi10', 'El FeO se llama óxido férrico.', 'NO2', 'En el FeO el hierro tiene +2, su menor estado común: lleva -oso.', 'El FeO se llama óxido ferroso.'),
      F('oxi11', 'El Na₂O forma un ácido al reaccionar con agua.', 'AQ-caracter-oxido', 'Es el óxido de un metal activo: con agua forma NaOH, una base.', 'El Na₂O forma hidróxido de sodio al reaccionar con agua: es un óxido básico.'),
      F('oxi13', 'El ácido sulfúrico tiene la fórmula H₂SO₃.', 'NO2', 'El H₂SO₃ es el ácido sulfuroso (S con +4); el sulfúrico es H₂SO₄ (S con +6).', 'El ácido sulfúrico tiene la fórmula H₂SO₄.'),
    ] },
    { id: 'sales-acidas', unidad: 'quimica.nomenclatura-inorganica', nombre: 'las sales ácidas', props: [
      V('hid4', 'El NaHCO₃ es una sal ácida, porque su anión conserva un hidrógeno del ácido carbónico.', 'El H₂CO₃ cambió solo uno de sus dos hidrógenos por sodio.', 'AQ-sal-acida-basica'),
      V('hid5', 'Una sal ácida se forma cuando solo una parte de los hidrógenos ácidos de un ácido es reemplazada por un metal.', 'Por eso solo la forman los ácidos con dos o más hidrógenos ácidos.', 'AQ-sal-acida-basica'),
      F('hid9', 'El NaHCO₃ es una sal básica, porque contiene grupos OH⁻.', 'AQ-sal-acida-basica', 'El NaHCO₃ no tiene OH⁻; tiene un H del ácido que no fue reemplazado.', 'El NaHCO₃ es una sal ácida.'),
      F('hid13', 'El NaHSO₄ es una sal neutra.', 'AQ-sal-acida-basica', 'El anión HSO₄⁻ conserva un hidrógeno del ácido sulfúrico: es una sal ácida.', 'El NaHSO₄ es una sal ácida.'),
      V('hid7', 'El KHSO₄ es una sal ácida.', 'Su anión, HSO₄⁻, conserva uno de los dos hidrógenos del ácido sulfúrico.', 'AQ-sal-acida-basica'),
      V('hid16', 'El NaH₂PO₄ es una sal ácida: su anión conserva dos hidrógenos del ácido fosfórico.', 'El H₃PO₄ tiene tres hidrógenos ácidos y solo uno fue reemplazado por sodio.', 'AQ-sal-acida-basica'),
      F('hid12', 'Una sal ácida es la que se obtiene de un ácido fuerte.', 'AQ-sal-acida-basica', 'Lo que hace ácida a la sal es que conserve hidrógenos ácidos del ácido, fuerte o débil: el NaHCO₃ viene del ácido carbónico, que es débil.', 'Una sal ácida conserva en su anión algún hidrógeno ácido del ácido del que proviene.'),
      F('hid17', 'El ácido clorhídrico (HCl) puede formar sales ácidas.', 'AQ-sal-acida-basica', 'El HCl tiene un solo hidrógeno ácido: al reemplazarlo no queda ninguno. Solo los ácidos con dos o más hidrógenos ácidos forman sales ácidas.', 'El HCl no forma sales ácidas, porque tiene un solo hidrógeno ácido.'),
    ] },
    // ===== Recursos naturales =====
    { id: 'metalurgia', unidad: 'quimica.recursos-naturales', nombre: 'los procesos metalúrgicos', props: [
      V('met1', 'La tostación calienta un sulfuro metálico con aire y libera dióxido de azufre.', 'Por ejemplo, 2 ZnS + 3 O₂ → 2 ZnO + 2 SO₂.', 'AQ-proceso-metalurgico'),
      V('met2', 'En la flotación, la mena se separa de la ganga porque sus partículas se pegan a burbujas y suben con la espuma.', 'Es un método para concentrar el mineral; no cambia su composición química.', 'AQ-proceso-metalurgico'),
      V('met3', 'En la lixiviación, el metal pasa a una solución acuosa al tratar el mineral con un reactivo, como el ácido sulfúrico en el cobre.', 'Después el metal se recupera de la solución.', 'AQ-proceso-metalurgico'),
      V('met4', 'En el alto horno, el monóxido de carbono reduce el óxido de hierro a hierro metálico.', 'Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂; el CO sale del coque.', 'AQ-reductor-alto-horno'),
      V('met7', 'En la electrorrefinación del cobre, el cobre puro se deposita en el cátodo.', 'El cobre impuro es el ánodo: se oxida y pasa a la solución; en el cátodo se reduce Cu²⁺ a cobre puro.', 'AQ-proceso-metalurgico'),
      F('met8', 'La tostación consiste en disolver el metal del mineral en un ácido.', 'AQ-proceso-metalurgico', 'Disolver el metal con un reactivo es la lixiviación. La tostación calienta el mineral con aire.', 'La tostación calienta un sulfuro con aire y lo convierte en óxido.'),
      F('met9', 'El gas que se libera en la tostación de los sulfuros es el anhídrido sulfúrico (SO₃).', 'AQ-so2-so3', 'Sale SO₂, el dióxido de azufre o anhídrido sulfuroso. El SO₃ es el anhídrido sulfúrico.', 'El gas que se libera en la tostación de los sulfuros es el SO₂ (anhídrido sulfuroso).'),
      F('met10', 'En el alto horno, el agente reductor del óxido de hierro es el oxígeno del aire.', 'AQ-reductor-alto-horno', 'El oxígeno es un oxidante. El reductor es el CO (y el carbono del coque).', 'En el alto horno, el agente reductor del óxido de hierro es el monóxido de carbono.'),
      F('met11', 'La flotación es un proceso químico que convierte el sulfuro en metal puro.', 'AQ-proceso-metalurgico', 'La flotación solo separa la mena de la ganga; el sulfuro sigue siendo sulfuro.', 'La flotación concentra el mineral: separa la mena de la ganga sin convertirla en metal.'),
      F('met12', 'En la electrorrefinación del cobre, el cobre puro se obtiene en el ánodo.', 'AQ-proceso-metalurgico', 'En el ánodo el cobre impuro se oxida y se disuelve; el cobre puro se deposita en el cátodo.', 'En la electrorrefinación del cobre, el cobre puro se obtiene en el cátodo.'),
    ] },
    { id: 'polimeros', unidad: 'quimica.recursos-naturales', nombre: 'los polímeros, los aromáticos y la combustión', props: [
      V('pol1', 'El polietileno se obtiene por polimerización de adición del eteno (etileno).', 'n CH₂=CH₂ → (–CH₂–CH₂–)ₙ.', 'AQ-adicion-condensacion'),
      V('pol2', 'En la polimerización por adición de un alqueno, el doble enlace C=C se abre para que los monómeros se unan en cadena.', 'Cada monómero se suma entero a la cadena.', 'AQ-adicion-condensacion'),
      V('pol3', 'La polimerización por adición no libera agua, porque cada monómero se suma entero a la cadena.', 'Eso la distingue de la polimerización por condensación.', 'AQ-adicion-condensacion'),
      V('pol4', 'El naftaleno, con dos anillos bencénicos fusionados, es un hidrocarburo aromático policíclico.', 'Comparte electrones π deslocalizados en sus dos anillos.', 'AQ-anillos-aromatico'),
      V('pol5', 'La combustión incompleta de un hidrocarburo puede producir monóxido de carbono y hollín.', 'Ocurre cuando falta oxígeno.', 'AQ-combustion-incompleta'),
      F('pol8', 'Todo compuesto con varios anillos de carbono es aromático.', 'AQ-anillos-aromatico', 'Para ser aromático, el anillo debe tener electrones π deslocalizados, como el benceno. Los esteroides tienen varios anillos y no son aromáticos.', 'Un compuesto con varios anillos es aromático solo si sus anillos tienen electrones π deslocalizados, como los del benceno.'),
      F('pol9', 'En la polimerización por adición del eteno se libera una molécula de agua por cada unión.', 'AQ-adicion-condensacion', 'Soltar agua en cada unión es propio de la condensación (como en el nailon o el poliéster).', 'En la polimerización por adición del eteno no se libera ninguna molécula.'),
      F('pol11', 'La combustión incompleta del metano produce solo CO₂ y agua.', 'AQ-combustion-incompleta', 'CO₂ y agua son los productos de la combustión completa. Con poco oxígeno se forma también CO o carbono (hollín).', 'La combustión incompleta del metano produce también CO o hollín.'),
      F('pol12', 'El ciclohexano es un hidrocarburo aromático.', 'AQ-anillos-aromatico', 'El ciclohexano solo tiene enlaces simples: es un hidrocarburo saturado, no aromático.', 'El ciclohexano es un cicloalcano: no es aromático.'),
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
      F('pil11', 'Durante la descarga de la batería de plomo, la concentración del ácido sulfúrico aumenta.', 'AQ-acido-descarga', 'Los dos electrodos consumen iones sulfato para formar PbSO₄: el ácido se diluye.', 'Durante la descarga, la concentración del ácido sulfúrico disminuye.'),
      F('pil12', 'Una celda de combustible necesita una fuente de corriente externa para funcionar.', 'EC8', 'Es una celda galvánica: produce corriente con una reacción espontánea mientras recibe combustible.', 'Una celda de combustible produce corriente; no necesita una fuente externa.'),
      F('pil13', 'Una celda de combustible que funciona de modo espontáneo tiene fem negativa.', 'EC8', 'Una celda galvánica espontánea tiene fem positiva.', 'Una celda que funciona de modo espontáneo tiene fem positiva.'),
      F('pil15', 'En la batería de plomo, los electrones viajan por el ácido sulfúrico de un electrodo al otro.', 'EC2', 'Los electrones van por el circuito externo; dentro de la solución se mueven iones.', 'Los electrones van por el circuito externo; en el ácido sulfúrico se mueven iones.'),
    ] },
    // ===== Equilibrio químico =====
    { id: 'equilibrio-sangre', unidad: 'quimica.equilibrio-quimico', nombre: 'los equilibrios heterogéneos y la solución reguladora del ácido carbónico', props: [
      V('eqs1', 'CaCO₃(s) ⇌ CaO(s) + CO₂(g) es un equilibrio heterogéneo: hay sustancias en más de una fase.', 'Hay dos sólidos y un gas.', 'EQ13'),
      V('eqs2', 'En la constante de equilibrio de CaCO₃(s) ⇌ CaO(s) + CO₂(g) solo aparece el CO₂, porque los sólidos puros no entran en K.', 'Kc = [CO₂].', 'EQ13'),
      V('eqs3', 'El ácido carbónico es un ácido débil: en agua se disocia solo en parte.', 'H₂CO₃ ⇌ H⁺ + HCO₃⁻ queda muy desplazado a la izquierda.', 'AQ-negar-verdadera'),
      V('eqs4', 'En la sangre, el par H₂CO₃ / HCO₃⁻ forma una solución reguladora que limita los cambios de pH.', 'Es el principal sistema regulador de la sangre.'),
      V('eqs5', 'Si a una solución reguladora de H₂CO₃ y HCO₃⁻ se le agrega un poco de ácido, el HCO₃⁻ reacciona con los H⁺ añadidos.', 'HCO₃⁻ + H⁺ → H₂CO₃: el pH casi no cambia.'),
      V('eqs7', 'Una solución reguladora amortigua el pH al agregar pequeñas cantidades de ácido o de base, pero no cantidades grandes.', 'Su capacidad se acaba cuando se gasta uno de los componentes del par.', 'AQ-buffer-infinito'),
      F('eqs8', 'En un equilibrio heterogéneo, los sólidos puros sí aparecen en la expresión de K.', 'EQ13', 'La concentración de un sólido puro no cambia: se omite en K.', 'En un equilibrio heterogéneo, los sólidos y los líquidos puros no aparecen en la expresión de K.'),
      F('eqs9', 'Solo hay equilibrio químico cuando todas las sustancias están en la misma fase.', 'EQ13', 'Hay equilibrios heterogéneos, como CaCO₃(s) ⇌ CaO(s) + CO₂(g).', 'Puede haber equilibrio entre sustancias de fases distintas: es un equilibrio heterogéneo.'),
      F('eqs10', 'El ácido carbónico es un ácido fuerte: en agua se disocia por completo.', 'AB3', 'El ácido carbónico es débil; solo una pequeña parte se disocia.', 'El ácido carbónico es un ácido débil: se disocia solo en parte.'),
      F('eqs11', 'Una solución reguladora mantiene el pH constante aunque se le agregue cualquier cantidad de ácido.', 'AQ-buffer-infinito', 'Si el ácido agregado gasta todo el HCO₃⁻, el pH cae.', 'Una solución reguladora amortigua solo cantidades pequeñas de ácido o de base.'),
      F('eqs12', 'Cuando el ácido carbónico llega al equilibrio, su disociación se detiene.', 'EQ3', 'El equilibrio es dinámico: la disociación y la reacción inversa siguen, con la misma velocidad.', 'En el equilibrio, la disociación y la reacción inversa siguen ocurriendo con la misma velocidad.'),
    ] },
    // ===== Ácidos y bases =====
    { id: 'lewis-bronsted', unidad: 'quimica.acidos-y-bases', nombre: 'los ácidos y las bases de Brønsted y de Lewis', props: [
      V('lb1', 'Según Lewis, una base es una especie que dona un par de electrones.', 'Y un ácido de Lewis es el que acepta ese par.', 'AQ-lewis-invertido'),
      V('lb2', 'El amoníaco (NH₃) es una base de Lewis, porque el nitrógeno tiene un par de electrones libre.', 'Ese par puede formar un enlace con un H⁺ o con otra especie que lo acepte.', 'AB1'),
      V('lb3', 'Según Brønsted y Lowry, una base es una especie que acepta un protón (H⁺).', 'Y un ácido es el que lo cede.'),
      V('lb4', 'A 25 °C, una solución acuosa de amoníaco tiene pH mayor que 7, porque el amoníaco produce iones OH⁻ al reaccionar con el agua.', 'Aunque es una base débil, el NH₃ toma protones del agua: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻.', 'AQ-base-debil-acida'),
      V('lb8', 'Una sal formada por una base débil y un ácido fuerte, como el NH₄Cl, da una solución ácida.', 'El NH₄⁺ cede protones al agua.', 'AB9'),
      F('lb9', 'Una base débil en agua da una solución de pH menor que 7, porque es débil.', 'AQ-base-debil-acida', 'Débil no es ácida: la base produce OH⁻, aunque poco, y el pH queda mayor que 7.', 'Una base débil en agua da una solución de pH mayor que 7.'),
      F('lb10', 'Una sustancia sin el grupo OH en su fórmula no puede ser una base.', 'AB1', 'El NH₃ y las aminas no tienen OH y son bases: aceptan protones.', 'Una sustancia puede ser base sin tener OH, como el amoníaco.'),
      F('lb11', 'Según Lewis, un ácido es una especie que dona un par de electrones.', 'AQ-lewis-invertido', 'Es al revés: el ácido de Lewis acepta el par y la base lo dona.', 'Según Lewis, un ácido es una especie que acepta un par de electrones.'),
      F('lb13', 'El amoníaco es una base fuerte porque acepta protones.', 'AB3', 'Aceptar protones lo hace base; que acepte pocos lo hace débil.', 'El amoníaco es una base débil.'),
      F('lb14', 'Toda sal disuelta en agua da una solución neutra.', 'AB9', 'El NH₄Cl da una solución ácida y el acetato de sodio, una básica.', 'Algunas sales dan soluciones ácidas o básicas, porque sus iones reaccionan con el agua.'),
    ] },
    // ===== Enlace químico =====
    { id: 'tipo-solido', unidad: 'quimica.enlace-quimico', nombre: 'los tipos de sólidos y sus propiedades', props: [
      V('ts1', 'Un sólido iónico no conduce la corriente en estado sólido, porque sus iones están fijos en la red.', 'Fundido o disuelto en agua, sus iones se mueven y sí conduce.', 'AQ-ionico-conduce'),
      V('ts2', 'Los metales conducen la corriente en estado sólido gracias a sus electrones deslocalizados.', 'Los electrones de valencia se mueven por toda la red.'),
      V('ts3', 'El diamante, un sólido covalente de red, es muy duro y tiene una temperatura de fusión muy alta.', 'Para fundirlo hay que romper enlaces covalentes en toda la red.', 'AQ-covalente-bajo'),
      V('ts4', 'Los sólidos moleculares, como el hielo o el yodo, suelen tener temperaturas de fusión bajas.', 'Al fundirlos solo se vencen las fuerzas entre moléculas.', 'EN13'),
      V('ts7', 'El grafito conduce la corriente porque tiene electrones deslocalizados en sus capas.', 'Cada carbono usa tres electrones en enlaces y el cuarto queda deslocalizado.', 'EN17'),
      F('ts8', 'Todo sólido que conduce la corriente en estado sólido es iónico.', 'AQ-ionico-conduce', 'Los sólidos iónicos no conducen en estado sólido; conducen los metales (y el grafito).', 'Un sólido que conduce la corriente en estado sólido suele ser metálico; los iónicos no conducen en estado sólido.'),
      F('ts9', 'El NaCl sólido conduce la corriente porque está formado por iones.', 'AQ-ionico-conduce', 'Sus iones están fijos en la red: no pueden llevar carga hasta que se funde o se disuelve.', 'El NaCl conduce la corriente fundido o disuelto, no en estado sólido.'),
      F('ts10', 'Los sólidos covalentes de red, como el diamante, funden a temperaturas bajas.', 'AQ-covalente-bajo', 'Funden bajo los sólidos moleculares, donde solo se vencen fuerzas entre moléculas. En una red hay que romper enlaces covalentes.', 'Los sólidos covalentes de red funden a temperaturas muy altas.'),
      F('ts11', 'Todos los sólidos moleculares son solubles en agua.', 'AQ-molecular-soluble', 'El yodo y la naftalina son moleculares y casi no se disuelven en agua.', 'Algunos sólidos moleculares se disuelven en agua, como el azúcar, y otros no, como el yodo.'),
      F('ts12', 'El grafito conduce la corriente porque sus átomos de carbono se mueven sueltos.', 'EN17', 'Los átomos están fijos en las capas; lo que se mueve son electrones deslocalizados.', 'El grafito conduce porque tiene electrones deslocalizados en sus capas.'),
    ] },
    { id: 'ionicos', unidad: 'quimica.enlace-quimico', nombre: 'los sólidos iónicos y sus iones', props: [
      V('ion1', 'En un sólido iónico, cada ion está rodeado de varios iones de carga opuesta.', 'La atracción es en todas las direcciones de la red.', 'EN1'),
      V('ion3', 'El ion bicarbonato (HCO₃⁻) tiene carga 1−.', 'Es el carbonato (2−) con un H⁺: 2− + 1 = 1−.', 'AQ-carga-oxoanion'),
      V('ion4', 'El ion sulfato (SO₄²⁻) es un anión poliatómico.', 'Tiene cinco átomos con una carga total de 2−.', 'AQ-anion-monoatomico'),
      V('ion5', 'Los sólidos iónicos son duros pero quebradizos: un golpe desplaza las capas de iones y quedan juntas cargas iguales.', 'La repulsión entre iones de igual carga parte el cristal.', 'AQ-ionico-ductil'),
      V('ion6', 'El acetato de sodio es una sal con un anión orgánico.', 'El ion acetato, CH₃COO⁻, viene del ácido acético.', 'AQ-sal-inorganica'),
      F('ion9', 'Los aniones siempre están formados por un solo átomo.', 'AQ-anion-monoatomico', 'Hay aniones poliatómicos: sulfato (SO₄²⁻), nitrato (NO₃⁻), bicarbonato (HCO₃⁻).', 'Hay aniones monoatómicos, como el Cl⁻, y poliatómicos, como el SO₄²⁻.'),
      F('ion10', 'El ion bicarbonato tiene carga 2−, como el carbonato.', 'AQ-carga-oxoanion', 'Con el H⁺ que conserva, la carga baja a 1−.', 'El ion bicarbonato (HCO₃⁻) tiene carga 1−.'),
      F('ion11', 'Los sólidos iónicos se pueden estirar en hilos, como los metales.', 'AQ-ionico-ductil', 'Al deformarlos, quedan juntos iones de igual carga y el cristal se rompe.', 'Los sólidos iónicos son quebradizos; los metales sí se estiran en hilos.'),
      F('ion12', 'Todas las sales son compuestos inorgánicos.', 'AQ-sal-inorganica', 'El acetato de sodio y los jabones son sales de aniones orgánicos.', 'Hay sales inorgánicas, como el NaCl, y orgánicas, como el acetato de sodio.'),
      F('ion13', 'En el NaCl, cada ion Na⁺ está unido solo al ion Cl⁻ que le quitó su electrón.', 'EN1', 'En la red, cada Na⁺ atrae por igual a sus seis Cl⁻ vecinos.', 'En el NaCl sólido, cada ion Na⁺ está rodeado de seis iones Cl⁻.'),
      F('ion14', 'El ion sulfato tiene la fórmula SO₃²⁻.', 'NO2', 'El SO₃²⁻ es el sulfito (-ito, del ácido sulfuroso); el sulfato es SO₄²⁻.', 'El ion sulfato tiene la fórmula SO₄²⁻.'),
    ] },
    { id: 'radicales', unidad: 'quimica.enlace-quimico', nombre: 'los radicales libres', props: [
      V('rad1', 'Un radical libre tiene al menos un electrón desapareado.', 'Esa es su definición.', 'AQ-ion-radical'),
      V('rad2', 'En el radical hidroxilo (·OH) hay 7 electrones de valencia y el oxígeno no completa el octeto.', '6 del oxígeno y 1 del hidrógeno: un número impar.', 'EN3'),
      V('rad3', 'El monóxido de nitrógeno (NO) tiene un número impar de electrones de valencia: es un radical.', '5 del nitrógeno y 6 del oxígeno suman 11.', 'EN3'),
      V('rad4', 'El ion superóxido (O₂⁻) tiene un electrón desapareado.', '6 + 6 + 1 = 13 electrones de valencia: un número impar.', 'AQ-peroxido-radical'),
      V('rad6', 'El ion hidróxido (OH⁻) no es un radical, porque todos sus electrones están apareados.', '6 + 1 + 1 = 8 electrones de valencia, en cuatro pares.', 'AQ-ion-radical'),
      F('rad7', 'El ion peróxido (O₂²⁻) es un radical libre porque tiene carga.', 'AQ-ion-radical', 'Tener carga no hace a un radical. El O₂²⁻ tiene 14 electrones de valencia, todos apareados.', 'El ion peróxido no es un radical: todos sus electrones están apareados.'),
      F('rad8', 'El radical hidroxilo (·OH) cumple el octeto, igual que el ion hidróxido.', 'EN3', 'Con 7 electrones de valencia el oxígeno queda con 7 a su alrededor; el OH⁻, con uno más, sí completa 8.', 'En el radical hidroxilo el oxígeno no completa el octeto: tiene un electrón desapareado.'),
      F('rad9', 'El peróxido de hidrógeno (H₂O₂) es un radical libre porque tiene un enlace O–O.', 'AQ-peroxido-radical', 'El H₂O₂ tiene 14 electrones de valencia, todos apareados. Al romperse el enlace O–O sí se forman dos radicales ·OH.', 'El H₂O₂ no es un radical; al romperse su enlace O–O forma dos radicales ·OH.'),
      F('rad11', 'Una molécula con un número impar de electrones puede tener todos sus electrones apareados.', 'EN3', 'Con un número impar, al menos uno queda sin pareja.', 'Una molécula con un número impar de electrones tiene al menos un electrón desapareado.'),
      F('rad12', 'El ion hidroperóxido (HO₂⁻) es un radical libre.', 'AQ-peroxido-radical', '1 + 6 + 6 + 1 = 14 electrones de valencia: todos apareados.', 'El ion hidroperóxido no es un radical; el radical es el hidroperoxilo neutro (HO₂·).'),
    ] },
    { id: 'hidruros', unidad: 'quimica.enlace-quimico', nombre: 'los pares libres y los enlaces de los hidruros no metálicos', props: [
      V('hid1', 'En el amoníaco (NH₃), el nitrógeno tiene un par de electrones libre.', 'De sus 5 electrones de valencia, 3 forman enlaces con los H y 2 quedan como par libre.', 'AQ-hidruro-sin-pares'),
      V('hid2', 'El H₂S (sulfuro de hidrógeno) es un compuesto binario de hidrógeno y un no metal: sus enlaces S–H son covalentes.', 'El hidrógeno y el azufre son no metales y comparten electrones.', 'EN5'),
      V('hid3', 'En la molécula de agua, el oxígeno tiene dos pares de electrones libres, porque usa solo dos de sus seis electrones de valencia en enlaces.', 'De sus 6 electrones de valencia, 2 forman enlaces con los H y 4 quedan en dos pares.', 'AQ-hidruro-sin-pares'),
      F('hid8', 'El amoníaco no tiene pares de electrones libres, porque todos los electrones del nitrógeno forman enlaces.', 'AQ-hidruro-sin-pares', 'El nitrógeno tiene 5 electrones de valencia y solo 3 enlaces: le queda un par libre.', 'En el amoníaco, el nitrógeno tiene un par de electrones libre.'),
      F('hid10', 'El H₂S es un compuesto iónico, como el NaCl.', 'EN5', 'El H y el S son no metales: comparten electrones.', 'El H₂S es un compuesto covalente.'),
      F('hid11', 'En el agua, el oxígeno no tiene pares libres: sus seis electrones de valencia forman enlaces.', 'AQ-hidruro-sin-pares', 'Solo forma dos enlaces (con 2 electrones suyos); los otros 4 quedan como dos pares libres.', 'En el agua, el oxígeno tiene dos pares de electrones libres.'),
      V('hid6', 'El HCl gaseoso es un compuesto covalente; en agua se ioniza.', 'Las moléculas de HCl comparten electrones; al disolverse, ceden H⁺ al agua.', 'EN5'),
      V('hid14', 'En el H₂S, el azufre tiene dos pares de electrones libres.', 'De sus 6 electrones de valencia, 2 forman enlaces con los H y 4 quedan en dos pares, como en el agua.', 'AQ-hidruro-sin-pares'),
      F('hid15', 'El amoníaco es un compuesto iónico: el nitrógeno les quita los electrones a los hidrógenos.', 'EN5', 'El nitrógeno y el hidrógeno son no metales: comparten pares de electrones en enlaces covalentes polares.', 'El amoníaco es un compuesto covalente.'),
    ] },
    // ===== Biomoléculas =====
    { id: 'vitaminas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las vitaminas', props: [
      V('vit1', 'La vitamina C y las vitaminas del complejo B son hidrosolubles.', 'Se disuelven en agua y el exceso sale por la orina.', 'AQ-vitamina-solubilidad'),
      V('vit2', 'Las vitaminas A, D, E y K son liposolubles.', 'Se disuelven en grasas y se pueden acumular en el cuerpo.', 'AQ-vitamina-solubilidad'),
      V('vit4', 'Muchas vitaminas del complejo B forman parte de coenzimas.', 'Por ejemplo, la niacina del NAD⁺ y la riboflavina del FAD.', 'AQ-vitamina-coenzima'),
      V('vit5', 'La niacina (vitamina B3) forma parte de la coenzima NAD⁺.', 'El NAD⁺ transporta electrones en la respiración celular.', 'AQ-vitamina-coenzima'),
      V('vit6', 'La riboflavina (vitamina B2) forma parte del FAD.', 'El FAD también transporta electrones.', 'AQ-vitamina-coenzima'),
      V('vit7', 'La vitamina D se forma en la piel por la acción de la luz ultravioleta sobre un derivado del colesterol.', 'El 7-deshidrocolesterol de la piel se convierte en vitamina D₃.', 'AQ-ruta-vitamina-d'),
      V('vit8', 'La forma activa de la vitamina D se obtiene tras dos hidroxilaciones: primero en el hígado y después en el riñón.', 'Ruta: piel → hígado → riñón.', 'AQ-ruta-vitamina-d'),
      F('vit12', 'Las vitaminas aportan energía al organismo, como los carbohidratos.', 'BM1', 'Las vitaminas no se «queman» para dar energía; muchas ayudan como coenzimas a las reacciones que la liberan.', 'Las vitaminas no aportan energía; muchas forman parte de coenzimas.'),
      F('vit13', 'La vitamina C es liposoluble y se almacena en el tejido graso.', 'AQ-vitamina-solubilidad', 'La vitamina C es hidrosoluble: no se acumula en la grasa y el exceso se elimina.', 'La vitamina C es hidrosoluble.'),
      F('vit14', 'La vitamina D se activa primero en el riñón y después en el hígado.', 'AQ-ruta-vitamina-d', 'El orden es el contrario: la primera hidroxilación es en el hígado y la segunda en el riñón.', 'La vitamina D se activa primero en el hígado y después en el riñón.'),
      F('vit15', 'La vitamina D que se forma en la piel ya es la forma activa: no necesita pasar por el hígado ni por el riñón.', 'AQ-ruta-vitamina-d', 'La de la piel es inactiva; se activa con una hidroxilación en el hígado y otra en el riñón.', 'La vitamina D de la piel se activa después en el hígado y en el riñón.'),
      F('vit17', 'La niacina forma parte del FAD.', 'AQ-vitamina-coenzima', 'La niacina forma parte del NAD⁺; el FAD viene de la riboflavina.', 'La niacina forma parte del NAD⁺, y la riboflavina, del FAD.'),
    ] },
    { id: 'proteinas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las proteínas y su desnaturalización', props: [
      V('pro1', 'En el punto isoeléctrico, la carga neta de una proteína o de un aminoácido es cero.', 'Las cargas positivas y negativas se compensan.', 'AQ-punto-isoelectrico'),
      V('pro2', 'Una proteína suele ser menos soluble en su punto isoeléctrico, porque sin carga neta sus moléculas no se repelen.', 'Las moléculas tienden a juntarse y precipitar.', 'AQ-punto-isoelectrico'),
      V('pro3', 'El enlace peptídico une el carboxilo de un aminoácido con el grupo amino de otro y libera una molécula de agua.', '–COOH + H₂N– → –CO–NH– + H₂O.'),
      V('pro4', 'La desnaturalización cambia la forma de la proteína sin romper sus enlaces peptídicos.', 'Rompe interacciones débiles (puentes de hidrógeno, puentes salinos); la cadena de aminoácidos sigue entera.', 'BMH1'),
      V('pro6', 'Al cocinar un huevo, la clara se desnaturaliza y no vuelve a su forma original al enfriarse.', 'La desnaturalización por calor de la clara es irreversible.', 'AQ-desnaturalizacion-reversible'),
      V('pro7', 'A pH cercano a 7, el grupo amino y el grupo carboxilo de un aminoácido están ionizados: NH₃⁺ y COO⁻.', 'El aminoácido está como ion dipolar.'),
      F('pro8', 'La desnaturalización rompe los enlaces peptídicos y separa la proteína en aminoácidos.', 'BMH1', 'Separar en aminoácidos es la hidrólisis (la digestión). La desnaturalización solo cambia la forma.', 'La desnaturalización cambia la forma de la proteína; sus enlaces peptídicos siguen enteros.'),
      F('pro9', 'La clara de un huevo cocido vuelve a ser líquida y transparente si se deja enfriar.', 'AQ-desnaturalizacion-reversible', 'La desnaturalización de la clara por calor no se revierte al enfriar.', 'La clara cocida sigue sólida y blanca al enfriarse: su desnaturalización es irreversible.'),
      F('pro10', 'En el punto isoeléctrico, la proteína tiene carga neta positiva.', 'AQ-punto-isoelectrico', 'En el punto isoeléctrico la carga neta es cero; a pH menor es positiva y a pH mayor, negativa.', 'En el punto isoeléctrico, la carga neta de la proteína es cero.'),
      F('pro11', 'El enlace peptídico solo existe en las proteínas de origen animal.', 'AQ-peptidico-exclusivo', 'Las proteínas de las menestras, los cereales o la quinua también son cadenas de aminoácidos unidas por enlaces peptídicos.', 'Toda proteína, animal o vegetal, tiene enlaces peptídicos.'),
      F('pro12', 'Una proteína desnaturalizada pierde sus aminoácidos y ya no aporta nutrientes.', 'BMH13', 'Un huevo cocido tiene los mismos aminoácidos que uno crudo; la digestión los separa después.', 'Una proteína desnaturalizada conserva sus aminoácidos y sigue aportándolos como nutriente.'),
    ] },
    { id: 'alimentos', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las sustancias de los alimentos', props: [
      V('ali1', 'El colesterol es un esterol: un lípido con el núcleo de cuatro anillos de los esteroides.', 'Además tiene un grupo OH.', 'BMH4'),
      V('ali2', 'La leche contiene colesterol, porque es un alimento de origen animal.', 'El colesterol se encuentra en los alimentos de origen animal.'),
      V('ali3', 'La lactosa de la leche es un azúcar reductor.', 'Uno de sus extremos puede abrirse y dar un grupo aldehído.', 'AQ-disacarido-no-reductor'),
      V('ali4', 'La glucosa es un azúcar reductor: en su forma abierta tiene un grupo aldehído que puede oxidarse.', 'Por eso da positiva la prueba de Fehling o de Benedict.'),
      V('ali5', 'La sacarosa no es un azúcar reductor, porque no tiene un extremo que pueda abrirse y dar un grupo aldehído.', 'Sus dos monosacáridos se unen justo por los carbonos que darían el grupo reductor.', 'AQ-reductor-dulce'),
      V('ali6', 'La cafeína es un alcaloide: un compuesto nitrogenado de origen vegetal.', 'Tiene cuatro átomos de nitrógeno en sus anillos.', 'AQ-alcaloide-clase'),
      F('ali9', 'La sacarosa es un azúcar reductor porque es dulce.', 'AQ-reductor-dulce', 'Ser reductor depende de tener un grupo que se oxida (aldehído libre), no del sabor.', 'La sacarosa es dulce, pero no es un azúcar reductor.'),
      F('ali10', 'El colesterol es una grasa como el aceite: un triglicérido.', 'BMH4', 'Los dos son lípidos, pero el colesterol es un esterol, con cuatro anillos; los aceites y las grasas son triglicéridos: glicerol con tres ácidos grasos.', 'El colesterol es un lípido de la familia de los esteroides, no un triglicérido.'),
      F('ali11', 'La cafeína no tiene nitrógeno: es un carbohidrato del grano de café.', 'AQ-alcaloide-clase', 'La cafeína es un alcaloide, con cuatro nitrógenos; no es un carbohidrato.', 'La cafeína es un alcaloide: un compuesto nitrogenado.'),
      F('ali12', 'Los esteroles se disuelven bien en agua porque tienen un grupo OH.', 'AQ-oh-soluble', 'Un solo OH no compensa el gran esqueleto de carbonos: el colesterol casi no se disuelve en agua.', 'Los esteroles son lípidos: casi no se disuelven en agua, aunque tengan un grupo OH.'),
      F('ali13', 'La lactosa no es un azúcar reductor.', 'AQ-disacarido-no-reductor', 'Algunos disacáridos son reductores (lactosa, maltosa) y otros no (sacarosa).', 'La lactosa es un disacárido reductor.'),
      F('ali14', 'Los alcaloides tienen, en general, carácter ácido.', 'AQ-alcaloide-clase', '«Alcaloide» quiere decir «parecido a un álcali»: por su nitrógeno, suelen tener carácter básico.', 'Los alcaloides suelen tener carácter básico, por su nitrógeno.'),
    ] },
    // ===== Hidrocarburos (12 nov 2026) =====
    { id: 'hidrogenacion', unidad: 'quimica.hidrocarburos', nombre: 'la hidrogenación de alquenos y alquinos', props: [
      V('hgn1', 'Con un catalizador de platino o paladio y suficiente H₂, un alquino se hidrogena hasta el alcano.', 'Esos catalizadores son muy activos: el alqueno que se forma sigue tomando H₂.', 'AQ-catalizador-activo'),
      V('hgn2', 'Con el catalizador de Lindlar, un alquino se hidrogena solo hasta el alqueno, que sale cis.', 'Es un paladio «envenenado»: los dos H entran por el mismo lado y no sigue hasta el alcano.', 'AQ-lindlar-trans'),
      V('hgn3', 'Para pasar un mol de alquino a alcano se necesitan dos moles de H₂.', 'El triple enlace tiene dos enlaces π: cada uno consume un H₂.', 'AQ-h2-por-pi'),
      V('hgn4', 'En la hidrogenación, cada enlace π que se rompe consume una molécula de H₂.', 'Los dos átomos de H del H₂ se suman a los dos carbonos de ese enlace π.', 'AQ-h2-por-pi'),
      V('hgn5', 'La hidrogenación de un alqueno es una reducción del compuesto orgánico.', 'El carbono gana hidrógeno y baja su estado de oxidación.', 'AQ-oxidacion-organica-invertida'),
      F('hgn6', 'Con platino o paladio activos, la hidrogenación de un alquino se detiene en el alqueno.', 'AQ-catalizador-activo', 'Con catalizadores activos y H₂ suficiente, el alqueno sigue hidrogenándose hasta el alcano; para detenerse en el alqueno se usa el de Lindlar.', 'Con platino o paladio activos, un alquino se hidrogena hasta el alcano.'),
      F('hgn7', 'El catalizador de Lindlar convierte un alquino en un alqueno trans.', 'AQ-lindlar-trans', 'Con Lindlar los dos H entran por el mismo lado del enlace: el alqueno sale cis.', 'El catalizador de Lindlar convierte un alquino en un alqueno cis.'),
      F('hgn8', 'Para hidrogenar por completo un mol de un dieno se necesita un mol de H₂.', 'AQ-h2-por-pi', 'Un dieno tiene dos dobles enlaces, es decir, dos enlaces π: necesita dos moles de H₂.', 'Para hidrogenar por completo un mol de un dieno se necesitan dos moles de H₂.'),
      F('hgn9', 'La hidrogenación de un alqueno es una oxidación del compuesto orgánico.', 'AQ-oxidacion-organica-invertida', 'Ganar hidrógeno es reducirse: el estado de oxidación del carbono baja.', 'La hidrogenación de un alqueno es una reducción.'),
    ] },
    { id: 'isomeros-geometricos', unidad: 'quimica.hidrocarburos', nombre: 'la isomería cis-trans, la notación Z/E y los dos ácidos butenodioicos', props: [
      V('geo1', 'Para que un alqueno tenga isómeros cis y trans, cada carbono del doble enlace debe tener dos grupos distintos.', 'Si un carbono tiene dos grupos iguales, las dos formas son la misma molécula.', 'HC4'),
      V('geo2', 'En el ácido cis-butenodioico (maleico), los dos grupos COOH están del mismo lado del doble enlace, y la molécula es Z.', 'En cada carbono el COOH tiene más prioridad que el H, y los dos COOH quedan juntos.', 'AQ-cis-es-z'),
      V('geo3', 'Las notaciones cis-trans y Z/E no siempre coinciden, porque Z/E compara los grupos de mayor prioridad de cada carbono.', 'Cis-trans mira dos grupos iguales; Z/E, los de mayor prioridad, que pueden ser otros.', 'AQ-cis-es-z'),
      V('geo4', 'El isómero cis del ácido butenodioico funde a menor temperatura que el isómero trans.', 'El trans se acomoda mejor en el cristal y forma más puentes de hidrógeno entre moléculas.', 'AQ-fusion-geometrica'),
      V('geo5', 'Al calentarlo, el isómero cis del ácido butenodioico pierde agua y forma un anhídrido cíclico, porque sus dos COOH están cerca.', 'Los dos COOH del mismo lado pueden unirse dentro de la molécula soltando una molécula de agua.', 'AQ-anhidrido-trans'),
      V('geo6', 'El ácido maleico (cis) es más polar que el ácido fumárico (trans).', 'En el trans los dipolos de los dos COOH apuntan a lados opuestos y casi se anulan.', 'AQ-polaridad-geometrica'),
      F('geo7', 'Todo alqueno tiene un isómero cis y uno trans.', 'HC4', 'El propeno no los tiene: uno de sus carbonos del doble enlace lleva dos H.', 'Solo hay isómeros cis y trans si cada carbono del doble enlace tiene dos grupos distintos.'),
      F('geo8', 'Si un alqueno es cis, siempre es Z.', 'AQ-cis-es-z', 'Z/E se decide con los grupos de mayor prioridad, que no siempre son los grupos iguales que definen cis-trans.', 'Un alqueno cis puede ser Z o E, según la prioridad de sus grupos.'),
      F('geo9', 'El isómero trans del ácido butenodioico forma un anhídrido cíclico con más facilidad que el cis.', 'AQ-anhidrido-trans', 'En el trans los COOH están en lados opuestos y no pueden unirse dentro de la molécula.', 'El isómero cis forma con facilidad el anhídrido cíclico; el trans no, mientras siga siendo trans.'),
      F('geo10', 'El ácido fumárico (trans) es más polar que el ácido maleico (cis).', 'AQ-polaridad-geometrica', 'En el trans los dipolos de los COOH se oponen y casi se anulan.', 'El ácido maleico (cis) es más polar que el fumárico (trans).'),
      F('geo11', 'El isómero cis del ácido butenodioico funde a mayor temperatura que el trans.', 'AQ-fusion-geometrica', 'El trans funde mucho más alto: se ordena mejor en el cristal.', 'El isómero trans del ácido butenodioico funde a mayor temperatura que el cis.'),
    ] },
    // ===== Funciones orgánicas (12 nov 2026) =====
    { id: 'fermentacion', unidad: 'quimica.funciones-organicas', nombre: 'la fermentación alcohólica y la oxidación del etanol', props: [
      V('fer1', 'En la fermentación alcohólica, la glucosa se transforma en etanol y dióxido de carbono.', 'C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂, por acción de las levaduras.', 'AQ-gas-fermentacion'),
      V('fer2', 'El etanol es un alcohol primario: el carbono que lleva el OH está unido a un solo carbono.', 'CH₃–CH₂–OH: el carbono del OH tiene un solo carbono vecino.', 'FO4'),
      V('fer3', 'Al oxidar el etanol con suavidad se forma etanal (acetaldehído).', 'El alcohol primario pierde dos H y queda el grupo aldehído.', 'AQ-oxidacion-organica-invertida'),
      V('fer4', 'Si la oxidación del etanol sigue, el etanal se oxida a ácido acético.', 'El aldehído gana un oxígeno y queda el grupo carboxilo.', 'AQ-oxidacion-organica-invertida'),
      V('fer5', 'Un alcohol secundario, como el 2-propanol, se oxida a una cetona.', 'El carbono del OH tiene dos carbonos vecinos: queda un carbonilo en medio de la cadena.', 'AQ-clase-alcohol'),
      F('fer6', 'El etanol es un alcohol secundario.', 'FO4', 'El carbono que lleva el OH está unido a un solo carbono: es primario.', 'El etanol es un alcohol primario.'),
      F('fer7', 'En la fermentación alcohólica se libera oxígeno gaseoso.', 'AQ-gas-fermentacion', 'El gas que sale es CO₂; la fermentación ocurre sin oxígeno.', 'En la fermentación alcohólica se libera dióxido de carbono.'),
      F('fer8', 'Pasar de etanol a etanal es una reducción.', 'AQ-oxidacion-organica-invertida', 'El etanol pierde hidrógeno y el carbono sube su estado de oxidación: es una oxidación.', 'Pasar de etanol a etanal es una oxidación.'),
      F('fer9', 'El ácido acético se obtiene al reducir el etanal.', 'AQ-oxidacion-organica-invertida', 'De aldehído a ácido el carbono gana oxígeno: es una oxidación.', 'El ácido acético se obtiene al oxidar el etanal.'),
      F('fer10', 'Un alcohol secundario se oxida a un ácido carboxílico, igual que el etanol.', 'AQ-clase-alcohol', 'Un alcohol secundario se oxida a cetona y ahí se detiene la oxidación suave.', 'Un alcohol secundario se oxida a una cetona.'),
    ] },
    // ===== Biomoléculas (12 nov 2026) =====
    { id: 'cadenas-laterales', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las interacciones entre las cadenas laterales de una proteína', props: [
      V('cad1', 'Dos cisteínas pueden unir dos partes de una proteína con un puente disulfuro (S–S), que es un enlace covalente.', 'Se forma al oxidarse los grupos –SH de las dos cisteínas.', 'AQ-disulfuro-debil'),
      V('cad2', 'La cadena lateral de la lisina, con carga positiva, puede formar una interacción iónica con la del ácido aspártico, de carga negativa.', 'Es un puente salino: atracción entre cargas opuestas.', 'AQ-ionica-iguales'),
      V('cad3', 'Las cadenas laterales apolares, como la de la valina, tienden a quedar en el interior de la proteína, lejos del agua.', 'Es la interacción hidrofóbica: lo apolar se junta y el agua queda afuera.', 'AQ-hidrofobico-afuera'),
      V('cad4', 'Las cadenas laterales con grupos OH, como la de la serina, pueden formar puentes de hidrógeno.', 'El H del OH es atraído por un par libre de un O o un N cercano.'),
      V('cad5', 'Si el pH es menor que el punto isoeléctrico, la proteína tiene carga neta positiva.', 'Con más H⁺ en el medio, los grupos básicos quedan protonados.', 'AQ-punto-isoelectrico'),
      F('cad6', 'El puente disulfuro es una interacción débil, como el puente de hidrógeno.', 'AQ-disulfuro-debil', 'El puente disulfuro es un enlace covalente S–S, mucho más fuerte que un puente de hidrógeno.', 'El puente disulfuro es un enlace covalente.'),
      F('cad7', 'Las cadenas laterales apolares tienden a quedar en la superficie de la proteína, en contacto con el agua.', 'AQ-hidrofobico-afuera', 'Lo apolar se aleja del agua: queda en el interior; en la superficie quedan las cadenas polares y con carga.', 'Las cadenas laterales apolares tienden a quedar en el interior de la proteína.'),
      F('cad8', 'Dos cadenas laterales con carga negativa se atraen y forman una interacción iónica.', 'AQ-ionica-iguales', 'Cargas iguales se repelen; la interacción iónica es entre cargas opuestas.', 'Una cadena lateral positiva y una negativa forman una interacción iónica.'),
      F('cad9', 'Si el pH es mayor que el punto isoeléctrico, la proteína tiene carga neta positiva.', 'AQ-punto-isoelectrico', 'Con pocos H⁺ en el medio, los grupos ácidos pierden su H⁺ y la carga neta queda negativa.', 'Si el pH es mayor que el punto isoeléctrico, la proteína tiene carga neta negativa.'),
      F('cad10', 'Las interacciones entre las cadenas laterales de una proteína son enlaces peptídicos.', 'AQ-cadena-lateral-peptidico', 'Los enlaces peptídicos forman la cadena principal; entre cadenas laterales hay puentes de hidrógeno, interacciones iónicas e hidrofóbicas y puentes disulfuro.', 'Las cadenas laterales interactúan por puentes de hidrógeno, interacciones iónicas, interacciones hidrofóbicas y puentes disulfuro.'),
    ] },
    { id: 'aldosas-cetosas', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'las aldosas y las cetosas', props: [
      V('ald1', 'La glucosa es una aldosa: su grupo carbonilo es un aldehído.', 'El carbonilo está en el carbono 1, al extremo de la cadena.', 'AQ-aldosa-cetosa'),
      V('ald2', 'La fructosa es una cetosa: su grupo carbonilo está en un carbono intermedio de la cadena.', 'Está en el carbono 2.', 'AQ-aldosa-cetosa'),
      V('ald3', 'La glucosa y la fructosa son isómeros de función: tienen la misma fórmula, C₆H₁₂O₆, y distinto grupo funcional.', 'Una tiene aldehído y la otra cetona.', 'AQ-aldosa-cetosa-posicion'),
      V('ald4', 'Una hexosa es un monosacárido de seis carbonos.', 'Hex- indica seis; la glucosa y la fructosa son hexosas.'),
      V('ald5', 'La glucosa y la fructosa son muy solubles en agua, porque tienen varios grupos OH.', 'Cada OH forma puentes de hidrógeno con el agua.', 'AQ-azucar-insoluble'),
      V('ald6', 'La ribosa, de cinco carbonos y con grupo aldehído, es una aldopentosa.', 'Aldo- por el aldehído y -pentosa por los cinco carbonos.'),
      F('ald7', 'La glucosa y la fructosa son isómeros de posición.', 'AQ-aldosa-cetosa-posicion', 'No es el mismo grupo cambiado de lugar: una tiene aldehído y la otra cetona, que son funciones distintas.', 'La glucosa y la fructosa son isómeros de función.'),
      F('ald8', 'La fructosa es una aldosa.', 'AQ-aldosa-cetosa', 'Su carbonilo está en el carbono 2: es una cetona.', 'La fructosa es una cetosa.'),
      F('ald9', 'La glucosa y la fructosa tienen fórmulas moleculares distintas.', 'AQ-isomeros-formula', 'Las dos son C₆H₁₂O₆: por eso son isómeros.', 'La glucosa y la fructosa tienen la misma fórmula molecular.'),
      F('ald10', 'La glucosa casi no se disuelve en agua.', 'AQ-azucar-insoluble', 'Sus cinco OH forman puentes de hidrógeno con el agua: es muy soluble.', 'La glucosa es muy soluble en agua.'),
      F('ald11', 'Una cetosa tiene el grupo carbonilo en el extremo de la cadena.', 'AQ-aldosa-cetosa', 'El carbonilo en el extremo es un aldehído (aldosa); en una cetosa está en un carbono intermedio.', 'Una cetosa tiene el grupo carbonilo en un carbono intermedio de la cadena.'),
    ] },
    // ===== Enlace químico (12 nov 2026) =====
    { id: 'gases-sangre', unidad: 'quimica.enlace-quimico', nombre: 'el oxígeno, el dióxido de carbono y su transporte en la sangre', props: [
      V('gas1', 'El oxígeno que respiramos (O₂) es una sustancia simple, no un compuesto.', 'Sus dos átomos son del mismo elemento.', 'MA9'),
      V('gas2', 'En la sangre, casi todo el O₂ viaja unido a la hemoglobina de los glóbulos rojos.', 'Muy poco va disuelto en el plasma.', 'AQ-o2-disuelto'),
      V('gas3', 'En la sangre, la mayor parte del CO₂ viaja como ion bicarbonato (HCO₃⁻).', 'El CO₂ reacciona con el agua y forma H₂CO₃, que pasa a HCO₃⁻; una parte menor va unida a la hemoglobina o disuelta.', 'AQ-co2-hemoglobina'),
      V('gas4', 'El HCO₃⁻ que lleva el CO₂ en la sangre es un anión de carga 1−.', 'Es el carbonato (2−) con un H⁺.', 'AQ-carga-oxoanion'),
      V('gas5', 'La hemoglobina tiene hierro, que es donde se une el O₂.', 'Cada grupo hemo tiene un ion de hierro que une una molécula de O₂.'),
      F('gas6', 'El O₂ que transporta la hemoglobina es un compuesto diatómico.', 'MA9', 'Es diatómico, pero sus dos átomos son de oxígeno: es un elemento.', 'El O₂ que transporta la hemoglobina es una sustancia simple diatómica.'),
      F('gas7', 'En la sangre, la mayor parte del CO₂ viaja unido a la hemoglobina.', 'AQ-co2-hemoglobina', 'Solo una parte menor va unida a la hemoglobina; la mayor parte va como HCO₃⁻.', 'En la sangre, la mayor parte del CO₂ viaja como ion bicarbonato.'),
      F('gas8', 'El ion bicarbonato que lleva el CO₂ en la sangre tiene carga 2−.', 'AQ-carga-oxoanion', 'La carga 2− es la del carbonato; el bicarbonato conserva un H⁺ y queda con 1−.', 'El ion bicarbonato tiene carga 1−.'),
      F('gas9', 'La mayor parte del O₂ de la sangre va disuelto en el plasma.', 'AQ-o2-disuelto', 'El O₂ se disuelve poco en agua: casi todo viaja unido a la hemoglobina.', 'Casi todo el O₂ de la sangre viaja unido a la hemoglobina.'),
    ] },
    { id: 'dativo-oxisales', unidad: 'quimica.enlace-quimico', nombre: 'el enlace dativo en los oxoaniones del cloro y los tipos de sales', props: [
      V('dat1', 'En un enlace dativo (coordinado), los dos electrones del par compartido vienen de un mismo átomo.', 'Un átomo pone el par y el otro lo acepta.', 'AQ-dativo-aporte'),
      V('dat2', 'En la estructura de Lewis del ion clorato (ClO₃⁻) que cumple el octeto, el cloro forma dos enlaces dativos con oxígenos.', 'El cloro se une a un O⁻ por un enlace simple común y presta dos de sus pares a los otros dos oxígenos.', 'AQ-sin-dativo'),
      V('dat3', 'El NaCl es una sal haloidea: no tiene oxígeno.', 'Viene de un hidrácido, el HCl.', 'AQ-oxisal-haloidea'),
      V('dat4', 'El KClO₃ es una oxisal: tiene un metal, un no metal y oxígeno.', 'Viene de un oxácido, el HClO₃.', 'AQ-oxisal-haloidea'),
      V('dat5', 'En el ion hipoclorito (ClO⁻), el cloro y el oxígeno se unen por un enlace simple que no es dativo.', 'Cada átomo aporta un electrón al par: el cloro uno de sus 7 y el oxígeno uno de los suyos.'),
      F('dat6', 'El NaClO₄ es una sal haloidea, como el NaCl.', 'AQ-oxisal-haloidea', 'Tiene oxígeno: viene del ácido perclórico, un oxácido. Es una oxisal.', 'El NaClO₄ es una oxisal.'),
      F('dat7', 'En un enlace dativo, cada átomo aporta un electrón al par compartido.', 'AQ-dativo-aporte', 'Eso es un enlace covalente común; en el dativo un solo átomo aporta los dos electrones.', 'En un enlace dativo, un solo átomo aporta los dos electrones del par.'),
      F('dat8', 'El KCl es una oxisal.', 'AQ-oxisal-haloidea', 'No tiene oxígeno: viene del HCl, un hidrácido. Es una sal haloidea.', 'El KCl es una sal haloidea.'),
      F('dat9', 'En la estructura de Lewis del ion perclorato (ClO₄⁻) que cumple el octeto, no hay ningún enlace dativo.', 'AQ-sin-dativo', 'Con el octeto, el cloro se une a un O⁻ por un enlace común y a los otros tres oxígenos por enlaces dativos.', 'En la estructura de Lewis del ion perclorato que cumple el octeto hay tres enlaces dativos.'),
    ] },
    // ===== Ambiente (12 nov 2026) =====
    { id: 'suelo-aire', unidad: 'quimica.ambiente-y-quimica-aplicada', nombre: 'los contaminantes del suelo y la reactividad de los gases del aire', props: [
      V('sue1', 'El nitrógeno (N₂) del aire es poco reactivo, porque su triple enlace es muy fuerte.', 'Por eso se acumula en la atmósfera y es casi el 78 % del aire.', 'AQ-reactividad-aire'),
      V('sue2', 'El ozono (O₃) es un gas mucho más reactivo que el oxígeno (O₂).', 'Es un oxidante fuerte: por eso irrita los pulmones y daña plantas y materiales.', 'AQ-reactividad-aire'),
      V('sue3', 'El NO₂ es un gas reactivo: participa en la formación del smog fotoquímico y de la lluvia ácida.', 'Con luz solar se descompone y forma ozono; con agua da ácido nítrico.', 'AQ-reactividad-aire'),
      V('sue4', 'Los metales pesados, como el plomo y el cadmio, contaminan el suelo y no se degradan.', 'Son elementos: no se descomponen y se acumulan en el suelo y en los seres vivos.', 'AQ-metal-degradable'),
      V('sue5', 'El uso excesivo de pesticidas y fertilizantes puede contaminar el suelo y el agua subterránea.', 'Lo que las plantas no absorben se queda en el suelo o baja con el agua de lluvia o de riego.', 'AQ-nutriente-inocuo'),
      F('sue6', 'El N₂, por ser el gas más abundante del aire, es también el más reactivo.', 'AQ-reactividad-aire', 'Es abundante justamente porque reacciona muy poco: su triple enlace es muy fuerte.', 'El N₂ es el gas más abundante del aire y es poco reactivo.'),
      F('sue7', 'El ozono es tan poco reactivo como el nitrógeno del aire.', 'AQ-reactividad-aire', 'El O₃ es un oxidante fuerte; el N₂ casi no reacciona.', 'El ozono es mucho más reactivo que el nitrógeno del aire.'),
      F('sue8', 'Los metales pesados del suelo se degradan solos en pocos meses.', 'AQ-metal-degradable', 'Un metal es un elemento: no se descompone en nada más simple y permanece en el suelo.', 'Los metales pesados no se degradan: se acumulan en el suelo.'),
      F('sue9', 'El NO₂ es un gas inerte que no reacciona en la atmósfera.', 'AQ-reactividad-aire', 'El NO₂ reacciona con la luz solar (smog) y con el agua (lluvia ácida).', 'El NO₂ es un gas reactivo en la atmósfera.'),
      F('sue10', 'Los fertilizantes no pueden contaminar el suelo ni el agua: son nutrientes para las plantas.', 'AQ-nutriente-inocuo', 'En exceso, los nitratos y fosfatos se acumulan, pasan al agua y causan eutrofización.', 'En exceso, los fertilizantes contaminan el suelo y el agua.'),
    ] },
    // ===== Soluciones (12 nov 2026) =====
    { id: 'solucion-alcoholica', unidad: 'quimica.soluciones', nombre: 'las soluciones de alcohol en agua y su carácter ácido o básico', props: [
      V('alc1', 'A 25 °C, una solución de etanol en agua es prácticamente neutra: su pH es cercano a 7.', 'El etanol casi no cede ni acepta protones del agua.', 'AQ-alcohol-acido'),
      V('alc2', 'El etanol no es una base, aunque su fórmula tenga un grupo OH.', 'Su OH está unido por enlace covalente al carbono: no se libera como ion OH⁻ en el agua.', 'AB1'),
      V('alc3', 'El vinagre es ácido porque contiene ácido acético, que cede algunos protones al agua.', 'CH₃COOH ⇌ CH₃COO⁻ + H⁺.'),
      V('alc4', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL de la solución son etanol.', 'El porcentaje en volumen se refiere al soluto, el etanol.', 'AQ-porcentaje-solvente'),
      V('alc5', 'El ácido acético es un ácido débil: en agua solo una pequeña parte de sus moléculas se ioniza.', 'Por eso el vinagre no es tan corrosivo como un ácido fuerte de igual concentración.', 'AB3'),
      F('alc6', 'El etanol en agua da una solución básica, porque tiene un grupo OH.', 'AB1', 'El OH del etanol no se libera como ion OH⁻: la solución es prácticamente neutra.', 'El etanol en agua da una solución prácticamente neutra.'),
      F('alc7', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL de la solución son agua.', 'AQ-porcentaje-solvente', 'El porcentaje se da para el soluto: 40 mL son etanol y el resto, unos 60 mL, es agua.', 'En un alcohol de 40 % en volumen, 40 mL de cada 100 mL son etanol.'),
      F('alc8', 'El ácido acético es un ácido fuerte: en agua se ioniza por completo.', 'AB3', 'Solo una pequeña parte de sus moléculas se ioniza: es un ácido débil.', 'El ácido acético es un ácido débil.'),
      F('alc9', 'Una solución de etanol en agua es ácida, como el vinagre.', 'AQ-alcohol-acido', 'El vinagre es ácido por el ácido acético; el etanol casi no cede protones y la solución queda neutra.', 'Una solución de etanol en agua es prácticamente neutra.'),
    ] },
    // ===== Electroquímica (12 nov 2026) =====
    { id: 'celda-metanol', unidad: 'quimica.electroquimica', nombre: 'las celdas de combustible de metanol y de etanol', props: [
      V('cme1', 'En una celda de combustible de metanol en medio ácido, el metanol se oxida en el ánodo.', 'Es el combustible: cede electrones.', 'EC9'),
      V('cme2', 'En el ánodo de una celda de metanol en medio ácido, el metanol se convierte en CO₂ y libera iones H⁺ y electrones.', 'CH₃OH + H₂O → CO₂ + 6 H⁺ + 6 e⁻.', 'AQ-cation-anion'),
      V('cme3', 'En el cátodo de una celda de combustible en medio ácido, el O₂ se reduce y forma agua.', 'O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.', 'EC9'),
      V('cme4', 'Una celda de combustible de metanol que funciona sola, de modo espontáneo, tiene fem positiva.', 'Una reacción redox espontánea en una celda galvánica da fem positiva.', 'AQ-fem-negativa'),
      V('cme5', 'En la oxidación del metanol a CO₂, el estado de oxidación del carbono pasa de −2 a +4.', 'Por eso cada molécula de metanol cede 6 electrones.', 'AQ-electrones-oxidacion'),
      F('cme6', 'En una celda de combustible de metanol, el metanol se reduce en el cátodo.', 'EC9', 'El metanol es el combustible: cede electrones, se oxida, y eso ocurre en el ánodo.', 'En una celda de combustible de metanol, el metanol se oxida en el ánodo.'),
      F('cme7', 'En una celda de combustible de metanol, el O₂ cede electrones en el ánodo.', 'EC9', 'El O₂ acepta electrones: se reduce en el cátodo.', 'En una celda de combustible de metanol, el O₂ acepta electrones en el cátodo.'),
      F('cme8', 'Una celda de combustible de metanol que funciona de modo espontáneo tiene fem negativa.', 'AQ-fem-negativa', 'Una celda galvánica espontánea tiene fem positiva.', 'Una celda de combustible de metanol que funciona de modo espontáneo tiene fem positiva.'),
      F('cme9', 'En la oxidación del metanol a CO₂, cada átomo de carbono pierde 4 electrones.', 'AQ-electrones-oxidacion', 'El carbono pasa de −2 a +4: pierde 6 electrones.', 'En la oxidación del metanol a CO₂, cada átomo de carbono pierde 6 electrones.'),
      F('cme10', 'En una celda de combustible en medio ácido, los iones H⁺ que salen del ánodo son aniones.', 'AQ-cation-anion', 'El H⁺ tiene carga positiva: es un catión.', 'Los iones H⁺ que salen del ánodo son cationes.'),
    ] },
    // ===== Cierre 100 (12 nov 2026): preguntas oficiales de UNMSM que faltaban (proposiciones propias) =====
    // UNMSM 2023-I (23.10.2022, p. 90): hidratación de un alqueno y oxidación del alcohol.
    { id: 'hidratacion-oxidacion', unidad: 'quimica.funciones-organicas', nombre: 'la secuencia hidratación, oxidación del ácido crotónico',
      contexto: 'Un doble enlace C=C del ácido crotónico (CH₃–CH=CH–COOH) se hidrata y el alcohol secundario que resulta se oxida a cetona: crotónico → ácido 3-hidroxibutanoico → ácido acetoacético (3-oxobutanoico).', props: [
      V('hio1', 'El ácido crotónico tiene tres carbonos sp²: los dos del C=C y el del carboxilo.', 'El carbono del –COOH tiene un doble enlace con el O, así que también es sp².', 'AQ-sp2-sin-carboxilo'),
      V('hio2', 'Al hidratar el C=C del ácido crotónico se forma un hidroxiácido cuyo alcohol es secundario.', 'El OH queda en el carbono 3, unido a otros dos carbonos.', 'AQ-clase-alcohol'),
      V('hio3', 'El ácido 3-hidroxibutanoico tiene un carbono quiral: el carbono 3.', 'Ese carbono tiene cuatro grupos distintos: H, OH, CH₃ y CH₂COOH.', 'AQ-quiral-no-ve'),
      V('hio4', 'Al oxidar el alcohol secundario del hidroxiácido se obtiene un cetoácido.', 'Un alcohol secundario se oxida a cetona (C=O entre dos carbonos).', 'AQ-oxidacion-organica-invertida'),
      V('hio5', 'El ácido 3-hidroxibutanoico (C₄H₈O₃) y el ácido acetoacético (C₄H₆O₃) no son isómeros.', 'No tienen la misma fórmula molecular: el cetoácido tiene 2 H menos.', 'AQ-isomero-por-grupos'),
      V('hio6', 'El ácido acetoacético tiene dos carbonos sp² y dos sp³.', 'Son sp² el C=O de la cetona y el del carboxilo; son sp³ el CH₃ y el CH₂.', 'AQ-sp2-sin-carboxilo'),
      F('hio7', 'El ácido crotónico tiene solo dos carbonos sp², los del doble enlace C=C.', 'AQ-sp2-sin-carboxilo', 'Falta el carbono del carboxilo, que también es sp² por su doble enlace con el O.', 'El ácido crotónico tiene tres carbonos sp²: los dos del C=C y el del carboxilo.'),
      F('hio8', 'El carbono del carboxilo del ácido acetoacético es sp³, porque está unido a dos oxígenos.', 'AQ-carboxilo-sp3', 'Tiene un doble enlace C=O: por eso es sp².', 'El carbono del carboxilo del ácido acetoacético es sp², por su doble enlace con el oxígeno.'),
      F('hio9', 'El ácido 3-hidroxibutanoico tiene un alcohol primario, porque el OH está en la cadena.', 'AQ-clase-alcohol', 'La clase depende de cuántos carbonos tiene unidos el carbono del OH: aquí, dos.', 'El ácido 3-hidroxibutanoico tiene un alcohol secundario.'),
      F('hio10', 'El ácido 3-hidroxibutanoico y el ácido acetoacético son isómeros de compensación funcional.', 'AQ-isomero-por-grupos', 'Para ser isómeros deben tener la misma fórmula: C₄H₈O₃ contra C₄H₆O₃.', 'El hidroxiácido y el cetoácido no son isómeros: sus fórmulas moleculares son distintas.'),
      F('hio11', 'Al oxidar el alcohol secundario del hidroxiácido se obtiene un ácido dicarboxílico.', 'AQ-oxidacion-organica-invertida', 'Un alcohol secundario se oxida solo hasta cetona; para llegar a ácido hace falta un alcohol primario.', 'Al oxidar el alcohol secundario del hidroxiácido se obtiene una cetona: el cetoácido.'),
      F('hio12', 'El ácido 3-hidroxibutanoico no tiene ningún carbono quiral.', 'AQ-quiral-no-ve', 'El carbono 3 tiene H, OH, CH₃ y CH₂COOH: cuatro grupos distintos.', 'El ácido 3-hidroxibutanoico tiene un carbono quiral: el carbono 3.'),
      F('hio13', 'La fórmula molecular del ácido 3-hidroxibutanoico es C₄H₈O₂.', 'AQ-formula-olvida-O', 'Tiene tres oxígenos: dos del carboxilo y uno del OH. La fórmula es C₄H₈O₃.', 'La fórmula molecular del ácido 3-hidroxibutanoico es C₄H₈O₃.'),
    ] },
    // UNMSM 2023-I (10.12.2022, p. 89): estructura de Lewis del HNO₂ en una dismutación.
    { id: 'acido-nitroso', unidad: 'quimica.enlace-quimico', nombre: 'el ácido nitroso y su dismutación',
      contexto: 'En medio acuoso, el ácido nitroso se dismuta: 2 HNO₂ → NO + NO₂ + H₂O.', props: [
      V('nit1', 'En esa reacción, el NO₂ es la especie oxidada y el NO, la reducida.', 'El nitrógeno pasa de +3 (en el HNO₂) a +4 en el NO₂ (se oxida) y a +2 en el NO (se reduce).', 'EC9'),
      V('nit2', 'El NO₂ es un gas pardo y el NO es un gas incoloro.', 'Así se reconocen en el laboratorio: el pardo rojizo es el NO₂.', 'AQ-color-no-no2'),
      V('nit3', 'En la estructura de Lewis del HNO₂ (H–O–N=O) hay dos enlaces simples y uno doble.', 'Son simples H–O y O–N; el doble es N=O.', 'AQ-lewis-enlaces'),
      V('nit4', 'En el HNO₂, el hidrógeno está unido a un oxígeno y no al nitrógeno.', 'El enlace O–H es el que se rompe al ionizarse el ácido.', 'AQ-hidrogeno-en-el-nitrogeno'),
      V('nit5', 'En el HNO₂, el nitrógeno tiene un par de electrones libre.', 'De sus 5 electrones de valencia, 3 van en enlaces (uno simple y uno doble) y 2 quedan como par.', 'AQ-hidruro-sin-pares'),
      V('nit6', 'El NO₂ tiene 17 electrones de valencia: un número impar, así que es un radical.', '5 del nitrógeno más 6 de cada oxígeno suman 17; uno queda sin pareja.', 'EN3'),
      V('nit7', 'Las sales del ácido nitroso se llaman nitritos y tienen el ion NO₂⁻.', 'Del ácido -oso sale la sal en -ito.', 'NO2'),
      F('nit8', 'En esa reacción, el NO₂ es la especie reducida y el NO, la oxidada.', 'EC9', 'El N del NO₂ (+4) tiene más oxidación que el del HNO₂ (+3): se oxidó. El del NO (+2) se redujo.', 'En esa reacción, el NO₂ es la especie oxidada y el NO, la reducida.'),
      F('nit9', 'En el HNO₂, el hidrógeno está unido al nitrógeno, y los dos oxígenos, al nitrógeno.', 'AQ-hidrogeno-en-el-nitrogeno', 'En un oxoácido, el H va en un O: la estructura es H–O–N=O.', 'En el HNO₂, el hidrógeno está unido a un oxígeno, no al nitrógeno.'),
      F('nit10', 'La estructura de Lewis del HNO₂ tiene tres enlaces simples y ninguno doble.', 'AQ-lewis-enlaces', 'Con tres simples, el O terminal quedaría sin completar su octeto: forma un doble enlace con el N.', 'La estructura de Lewis del HNO₂ tiene dos enlaces simples y uno doble.'),
      F('nit11', 'El NO₂ es un gas incoloro y el NO es un gas pardo.', 'AQ-color-no-no2', 'Es al revés: el pardo es el NO₂; el NO es incoloro.', 'El NO₂ es un gas pardo y el NO es un gas incoloro.'),
      F('nit12', 'Una misma sustancia no puede oxidarse y reducirse a la vez: el HNO₂ solo se oxida.', 'AQ-dismutacion-una-via', 'En una dismutación, parte del N se oxida (a NO₂) y parte se reduce (a NO).', 'En la dismutación del HNO₂, el nitrógeno se oxida y se reduce a la vez.'),
      F('nit13', 'El NO₂ tiene todos sus electrones apareados, porque tiene dos átomos de oxígeno.', 'EN3', 'Con 17 electrones de valencia, un número impar, al menos uno queda sin pareja.', 'El NO₂ tiene un electrón desapareado: es un radical.'),
      F('nit14', 'Las sales del ácido nitroso se llaman nitratos.', 'NO2', 'Del ácido -oso sale la sal en -ito: nitritos. Los nitratos vienen del ácido nítrico.', 'Las sales del ácido nitroso se llaman nitritos.'),
      F('nit15', 'En el HNO₂, el nitrógeno tiene número de oxidación +5.', 'AQ-nox-hno2', 'H = +1 y 2 O = −4: el N queda en +3. El +5 es el del HNO₃.', 'En el HNO₂, el nitrógeno tiene número de oxidación +3.'),
    ] },
    // UNMSM 2023-II (25.03.2023, p. 95): contar enlaces π y metilos del β-caroteno y escalar su contenido en un fruto.
    { id: 'carotenoide', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'el β-caroteno y su contenido en el arándano',
      contexto: 'El β-caroteno (C₄₀H₅₆) es un hidrocarburo poliénico: una cadena larga de dobles enlaces alternados que une dos anillos de seis carbonos. El arándano trae 32 µg de β-caroteno por cada 100 g de fruto.', props: [
      V('car1', 'La molécula de β-caroteno tiene 11 enlaces dobles carbono–carbono.', 'Dos están en los anillos y nueve, en la cadena que los une.', 'AQ-pi-olvida-anillos'),
      V('car2', 'Los sustituyentes que salen de la cadena y de los anillos del β-caroteno son 10 grupos metilo (CH₃).', 'Seis están en los anillos (tres en cada uno) y cuatro, en la cadena.', 'AQ-metilo-etilo'),
      V('car3', 'El β-caroteno es un hidrocarburo, porque solo tiene carbono e hidrógeno.', 'Su fórmula, C₄₀H₅₆, no tiene otros elementos; que tenga anillos no lo cambia.', 'AQ-hidrocarburo-solo-cadena'),
      V('car4', 'Si 100 g de arándano contienen 32 µg de β-caroteno, 200 g contienen 64 µg.', 'La masa se duplica y la cantidad de β-caroteno también: 2 × 32 µg.', 'AQ-escala-mal'),
      V('car5', 'Cada anillo del β-caroteno tiene tres grupos metilo: dos en un mismo carbono sp³ y uno en un carbono del doble enlace.', 'Con los dos anillos suman 6 metilos; los otros 4 están en la cadena.', 'AQ-metilos-solo-cadena'),
      V('car6', 'Los dobles enlaces alternados con simples del β-caroteno deslocalizan electrones π, y de ello depende su color.', 'Una cadena larga de dobles y simples alternados (conjugada) absorbe luz visible.'),
      F('car7', 'Los sustituyentes que salen de la cadena y de los anillos del β-caroteno son 10 grupos etilo (CH₃–CH₂–).', 'AQ-metilo-etilo', 'Un etilo tiene dos carbonos. Cada sustituyente de la estructura es un solo carbono con tres H: un metilo.', 'Los sustituyentes del β-caroteno son 10 grupos metilo (CH₃).'),
      F('car8', 'El β-caroteno tiene 9 enlaces dobles carbono–carbono, todos en la cadena entre los anillos.', 'AQ-pi-olvida-anillos', 'Cada anillo tiene además un doble enlace: 9 + 2 = 11.', 'El β-caroteno tiene 11 enlaces dobles: nueve en la cadena y uno en cada anillo.'),
      F('car9', 'Si 100 g de arándano contienen 32 µg de β-caroteno, 200 g contienen 16 µg.', 'AQ-escala-mal', 'Al duplicar la masa del fruto, se duplica la cantidad de β-caroteno: 64 µg, no la mitad.', 'Si 100 g de arándano contienen 32 µg de β-caroteno, 200 g contienen 64 µg.'),
      F('car10', 'El β-caroteno no es un hidrocarburo, porque tiene anillos.', 'AQ-hidrocarburo-solo-cadena', 'Un hidrocarburo solo tiene C y H, con cadenas o con anillos.', 'El β-caroteno es un hidrocarburo: solo tiene carbono e hidrógeno.'),
      F('car11', 'El β-caroteno tiene 4 grupos metilo: los de la cadena entre los anillos.', 'AQ-metilos-solo-cadena', 'Faltan los metilos de los anillos: tres en cada uno. En total hay 10.', 'El β-caroteno tiene 10 grupos metilo: 4 en la cadena y 6 en los anillos.'),
    ] },
    // UNMSM 2024-II, área A (16.03.2024, p. 90): ácido p-aminobenzoico.
    { id: 'paba', unidad: 'quimica.funciones-organicas', nombre: 'el ácido 4-aminobenzoico',
      contexto: 'El ácido 4-aminobenzoico (NH₂–C₆H₄–COOH) es precursor de un grupo de medicamentos.', props: [
      V('pab1', 'Con un hidróxido como el NaOH, el ácido 4-aminobenzoico forma una sal: el 4-aminobenzoato de sodio.', 'El H del carboxilo se une al OH⁻ y sale como agua; queda el carboxilato con el Na⁺.', 'AQ-aromatico-inerte'),
      V('pab2', 'El anillo del ácido 4-aminobenzoico puede sufrir reacciones de sustitución electrofílica.', 'En el anillo aromático un H se cambia por otro grupo, y el anillo se conserva.', 'AQ-aromatico-adicion'),
      V('pab3', 'El ácido 4-aminobenzoico tiene siete carbonos sp²: los seis del anillo y el del carboxilo.', 'El C del –COOH tiene un doble enlace con el O: también es sp².', 'AQ-sp2-sin-carboxilo'),
      V('pab4', 'El nitrógeno del grupo amino del ácido 4-aminobenzoico tiene un par de electrones sin compartir.', 'Tiene 3 enlaces (dos con H y uno con el anillo) y, de sus 5 electrones, 2 quedan como par.', 'AQ-hidruro-sin-pares'),
      V('pab5', 'En el nombre ácido 4-aminobenzoico, el carboxilo manda y el amino queda como sustituyente en el carbono 4 del anillo.', 'El ácido carboxílico tiene más prioridad que la amina; se numera desde el carbono del anillo que lleva el carboxilo, que es el 1.', 'NO2'),
      V('pab6', 'El ácido 4-aminobenzoico no tiene ningún carbono sp³.', 'Sus siete carbonos son sp²; no hay ninguno con cuatro enlaces simples.'),
      F('pab7', 'El ácido 4-aminobenzoico tiene seis carbonos sp², los del anillo.', 'AQ-sp2-sin-carboxilo', 'Falta el del carboxilo: con su doble enlace al O también es sp². En total son siete.', 'El ácido 4-aminobenzoico tiene siete carbonos sp²: los seis del anillo y el del carboxilo.'),
      F('pab8', 'El ácido 4-aminobenzoico no reacciona con un hidróxido, porque su anillo es aromático.', 'AQ-aromatico-inerte', 'El anillo no impide que el carboxilo ceda su H: forma una sal con el hidróxido.', 'El ácido 4-aminobenzoico reacciona con un hidróxido y forma una sal.'),
      F('pab9', 'El ácido 4-aminobenzoico se llama 1-carboxi-4-aminobenceno, porque el amino manda sobre el carboxilo.', 'NO2', 'El carboxilo tiene más prioridad que el amino: da el sufijo -oico y el amino es un sustituyente.', 'El ácido 4-aminobenzoico se nombra con el carboxilo como grupo principal.'),
      F('pab10', 'El nitrógeno del grupo amino del ácido 4-aminobenzoico no tiene pares libres, porque todos sus electrones están en enlaces.', 'AQ-hidruro-sin-pares', 'Solo 3 de sus 5 electrones forman enlaces; los otros 2 son un par libre.', 'El nitrógeno del grupo amino del ácido 4-aminobenzoico tiene un par de electrones libre.'),
      F('pab11', 'El anillo del ácido 4-aminobenzoico reacciona por adición, como un alqueno, y deja de ser aromático.', 'AQ-aromatico-adicion', 'El anillo aromático prefiere sustituir un H y así conserva su nube de electrones π.', 'El anillo del ácido 4-aminobenzoico reacciona por sustitución y conserva su carácter aromático.'),
      F('pab12', 'El ácido 4-aminobenzoico tiene una amina alifática, porque tiene un grupo NH₂.', 'AQ-amina-clase', 'El NH₂ está pegado directamente al anillo: es una amina aromática, como la anilina.', 'El ácido 4-aminobenzoico tiene una amina aromática, porque el NH₂ está unido al anillo.'),
    ] },
    // UNMSM 2024-II, medicina (17.03.2024, p. 90): derivados oxidados, reducidos y ésteres de la glucosa.
    { id: 'derivados-glucosa', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'los derivados de la glucosa',
      contexto: 'En la glucosa abierta, HOCH₂–(CHOH)₄–CHO, el carbono 1 es el del aldehído. Si ese carbono se oxida, se obtiene el ácido glucónico; si se reduce, el sorbitol.', props: [
      V('dgl1', 'El carbono 1 del ácido glucónico es sp², igual que el carbono 1 de la glucosa abierta.', 'En los dos hay un doble enlace C=O (en el aldehído y en el carboxilo).', 'AQ-sp2-sin-carboxilo'),
      V('dgl2', 'Al reducir el aldehído de la glucosa se obtiene sorbitol, un alcohol con seis grupos OH.', 'El C1 pasa de –CHO a –CH₂OH: el alcohol primario.', 'AQ-oxidacion-organica-invertida'),
      V('dgl3', 'El sorbitol es muy soluble en agua, porque sus seis grupos OH forman puentes de hidrógeno con ella.', 'Cada OH hace puentes de hidrógeno con el agua.'),
      V('dgl4', 'Al reaccionar un ácido carboxílico con un alcohol se forma un éster, y sale una molécula de agua.', 'El OH del carboxilo y el H del alcohol forman el agua; el resto queda unido como R–CO–O–R′.', 'AQ-ester-eter'),
      V('dgl5', 'El gluconato de isopropilo es un éster: tiene un C=O unido a un O que se une a otro carbono.', 'Esa unión C(=O)–O–C es la del éster.', 'AQ-ester-eter'),
      V('dgl6', 'La oxidación del C1 de la glucosa (aldehído) da un ácido carboxílico: el ácido glucónico.', 'El aldehído –CHO se oxida a –COOH.', 'AQ-oxidacion-organica-invertida'),
      V('dgl7', 'El sorbitol no tiene ningún carbono sp²: todos sus carbonos tienen solo enlaces simples.', 'No hay C=O ni C=C; los seis carbonos son sp³.'),
      V('dgl8', 'La glucosa 6-fosfato es un éster fosfórico: el OH del carbono 6 de la glucosa se une al ácido fosfórico.', 'El OH y el ácido sueltan agua y queda la unión C–O–P.', 'AQ-ester-eter'),
      F('dgl9', 'El carbono 1 del ácido glucónico es sp³, porque forma enlaces simples con dos oxígenos.', 'AQ-carboxilo-sp3', 'Tiene un doble enlace con uno de los O (el del C=O): es sp².', 'El carbono 1 del ácido glucónico es sp², por su doble enlace C=O.'),
      F('dgl10', 'El ácido glucónico reacciona con un alcohol y forma un éter.', 'AQ-ester-eter', 'Un carboxilo con un alcohol da un éster. El éter (R–O–R′) se forma entre dos alcoholes.', 'El ácido glucónico reacciona con un alcohol y forma un éster.'),
      F('dgl11', 'El sorbitol se obtiene oxidando la glucosa.', 'AQ-oxidacion-organica-invertida', 'Pasar de aldehído a alcohol primario es reducir (entran H): el sorbitol sale de reducir.', 'El sorbitol se obtiene reduciendo la glucosa.'),
      F('dgl12', 'El sorbitol es poco soluble en agua, porque tiene una cadena de seis carbonos.', 'AQ-cadena-insoluble', 'Cada carbono lleva un OH: hay seis OH que forman puentes de hidrógeno con el agua.', 'El sorbitol es muy soluble en agua, por sus seis grupos OH.'),
      F('dgl13', 'El gluconato de isopropilo no puede formar puentes de hidrógeno con el agua, porque es un éster.', 'AQ-ester-insoluble', 'Conserva cinco grupos OH, que sí forman puentes de hidrógeno con el agua.', 'El gluconato de isopropilo tiene cinco grupos OH, que forman puentes de hidrógeno con el agua.'),
      F('dgl14', 'El ácido glucónico y la glucosa tienen el mismo grupo funcional en el carbono 1.', 'AQ-aldehido-carboxilo', 'En la glucosa es un aldehído (–CHO); en el glucónico, un carboxilo (–COOH). Lo que comparten es la hibridación sp².', 'En el carbono 1, la glucosa tiene un aldehído y el ácido glucónico, un carboxilo.'),
      F('dgl15', 'La glucosa 6-fosfato es un éter de la glucosa con el ácido fosfórico.', 'AQ-ester-eter', 'El OH de la glucosa y el ácido fosfórico sueltan agua: se forma un éster fosfórico, no un éter.', 'La glucosa 6-fosfato es un éster fosfórico de la glucosa.'),
    ] },
    // UNMSM 2026-I, medicina (12.10.2025, p. 89): Lewis del radical ·OH y la reacción de Fenton.
    { id: 'fenton-lewis', unidad: 'quimica.enlace-quimico', nombre: 'la reacción de Fenton y el radical hidroxilo',
      contexto: 'Los iones de hierro de algunas enzimas intervienen en la reacción de Fenton: Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + ·OH.', props: [
      V('fen1', 'En la reacción de Fenton, el Fe²⁺ es el agente reductor, porque cede un electrón y pasa a Fe³⁺.', 'El agente reductor es la especie que se oxida.', 'EC9'),
      V('fen2', 'En la reacción de Fenton, el Fe³⁺ es la especie oxidada.', 'El Fe²⁺ perdió un electrón; la forma que queda, Fe³⁺, es la especie oxidada.', 'EC9'),
      V('fen3', 'En la reacción de Fenton, el H₂O₂ se reduce: uno de sus oxígenos pasa de −1 a −2 en el OH⁻.', 'El otro oxígeno queda en el radical ·OH, también con −1.', 'EC9'),
      V('fen4', 'En la notación de Lewis del radical ·OH, el oxígeno tiene dos pares libres y un electrón desapareado.', 'De sus 6 electrones de valencia, 1 va al enlace con H y 5 quedan sin enlazar: 2 pares y 1 solo.', 'EN3'),
      V('fen5', 'El OH⁻ y el ·OH no se escriben igual en Lewis: el anión tiene tres pares libres en el oxígeno.', 'El OH⁻ tiene un electrón más que el ·OH, que completa el tercer par.', 'AQ-lewis-radical-anion'),
      V('fen6', 'La reacción de Fenton se escribe con una flecha simple, de reactivos a productos.', 'Así se escribe en los textos: el radical ·OH que se forma reacciona enseguida y no se plantea un equilibrio.', 'AQ-fenton-reversible'),
      F('fen7', 'En la reacción de Fenton, el Fe³⁺ es el agente reductor.', 'EC9', 'El Fe³⁺ es el producto de oxidar al Fe²⁺: el agente reductor es el Fe²⁺.', 'En la reacción de Fenton, el agente reductor es el Fe²⁺.'),
      F('fen8', 'En la reacción de Fenton, el H₂O₂ se oxida a anión hidróxido (OH⁻).', 'EC9', 'El O del OH⁻ tiene −2, menos que el −1 del H₂O₂: se redujo, no se oxidó.', 'En la reacción de Fenton, el H₂O₂ se reduce.'),
      F('fen9', 'En el radical ·OH, el oxígeno completa el octeto con sus dos pares libres y su enlace con el H.', 'EN3', 'Quedan 7 electrones alrededor del O (2 pares, el enlace y un electrón solo): le falta uno para el octeto.', 'En el radical ·OH, el oxígeno tiene 7 electrones a su alrededor y no completa el octeto.'),
      F('fen10', 'El radical ·OH y el anión OH⁻ tienen la misma notación de Lewis.', 'AQ-lewis-radical-anion', 'El OH⁻ tiene un electrón de más: tres pares libres en el O. El ·OH tiene dos pares y un electrón solo.', 'El radical ·OH y el anión OH⁻ tienen notaciones de Lewis distintas.'),
      F('fen11', 'En la reacción de Fenton, el hierro pasa de Fe²⁺ a Fe³⁺ ganando un electrón.', 'EC9', 'Pasar de 2+ a 3+ es perder un electrón: se oxida.', 'En la reacción de Fenton, el hierro pasa de Fe²⁺ a Fe³⁺ perdiendo un electrón.'),
      F('fen12', 'La reacción de Fenton se escribe con doble flecha, como un equilibrio.', 'AQ-fenton-reversible', 'Se escribe con flecha simple: el radical ·OH reacciona enseguida y no se plantea un equilibrio.', 'La reacción de Fenton se escribe con una flecha simple, de reactivos a productos.'),
    ] },
    // UNMSM 2026-II, área C (08.03.2026, p. 89): bilirrubina, un tetrapirrol lineal.
    { id: 'bilirrubina', unidad: 'quimica.biomoleculas-y-productos-naturales', nombre: 'la bilirrubina',
      contexto: 'La bilirrubina (C₃₃H₃₆N₄O₆) es un pigmento biliar: cuatro anillos con nitrógeno unidos en cadena por puentes de un carbono, con dos cadenas laterales –CH₂CH₂COOH.', props: [
      V('bil1', 'La bilirrubina tiene dos grupos carboxilo (–COOH), uno al final de cada cadena lateral –CH₂CH₂COOH.', 'Son dos carboxilos; los C=O de los anillos de los extremos son de otro grupo.', 'AQ-conteo-carboxilos'),
      V('bil2', 'La bilirrubina no tiene ningún carbono quiral.', 'Sus carbonos sp³ son CH₃ o CH₂: ninguno tiene cuatro grupos distintos.', 'AQ-quiral-en-CH2'),
      V('bil3', 'Cada uno de los cuatro nitrógenos de la bilirrubina tiene un par de electrones libre.', 'Cada N forma tres enlaces y, de sus 5 electrones, 2 quedan como par.', 'AQ-hidruro-sin-pares'),
      V('bil4', 'Los seis oxígenos de la bilirrubina son los de dos carboxilos (4 O) y los de dos grupos C=O de los anillos de los extremos (2 O).', 'Son cuatro O de los carboxilos más dos de las lactamas: 4 + 2 = 6.', 'AQ-lactama-carboxilo'),
      V('bil5', 'En los dos anillos de los extremos de la bilirrubina hay un C=O unido a un N (una lactama).', 'Un C=O al lado de un N es el grupo de una amida; en un anillo, una lactama.', 'AQ-lactama-carboxilo'),
      V('bil6', 'Entre los anillos de la bilirrubina hay un solo puente CH₂; los otros dos puentes son CH= con doble enlace.', 'El CH₂ (sp³) une los dos anillos del centro; los otros dos puentes, =CH–, son sp².'),
      F('bil7', 'Los C=O de los anillos de los extremos son carboxilos, así que la bilirrubina tiene cuatro carboxilos.', 'AQ-lactama-carboxilo', 'Un carboxilo es C(=O)OH. El C=O de un anillo está unido a un N: es una lactama.', 'La bilirrubina tiene dos carboxilos; los C=O de los anillos de los extremos son lactamas.'),
      F('bil8', 'La bilirrubina tiene un carbono quiral: el CH₂ del puente central.', 'AQ-quiral-en-CH2', 'Un CH₂ tiene dos H iguales: no puede tener cuatro grupos distintos.', 'La bilirrubina no tiene carbonos quirales.'),
      F('bil9', 'Los nitrógenos de los anillos de la bilirrubina no tienen pares libres, porque cada uno está unido a un H.', 'AQ-hidruro-sin-pares', 'El N con un H y dos enlaces más aún conserva un par libre.', 'Cada nitrógeno de la bilirrubina tiene un par de electrones libre.'),
      F('bil10', 'La bilirrubina es un hidrocarburo, porque tiene 33 carbonos.', 'AQ-hidrocarburo-muchos-C', 'Tiene N y O además de C y H (C₃₃H₃₆N₄O₆): no es un hidrocarburo.', 'La bilirrubina no es un hidrocarburo: tiene nitrógeno y oxígeno.'),
      F('bil11', 'La bilirrubina tiene un solo grupo carboxilo, porque solo una cadena lateral termina en –COOH.', 'AQ-conteo-carboxilos', 'Las dos cadenas laterales –CH₂CH₂COOH terminan en carboxilo: son dos.', 'La bilirrubina tiene dos grupos carboxilo.'),
      F('bil12', 'Los tres carbonos de cada cadena lateral –CH₂CH₂COOH de la bilirrubina son sp².', 'AQ-cadena-sp2', 'Solo el carbono del –COOH es sp²; los dos CH₂ tienen solo enlaces simples: son sp³.', 'En cada cadena lateral –CH₂CH₂COOH, solo el carbono del –COOH es sp².'),
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
    // Cierre 100 (12 nov 2026)
    hio7: ['hio1'], hio8: ['hio6'], hio9: ['hio2'], hio10: ['hio5'], hio11: ['hio4'], hio12: ['hio3'],
    nit8: ['nit1'], nit9: ['nit4'], nit10: ['nit3'], nit11: ['nit2'], nit12: ['nit1'], nit13: ['nit6'], nit14: ['nit7'],
    car7: ['car2'], car8: ['car1'], car9: ['car4'], car10: ['car3'], car11: ['car2', 'car5'],
    pab7: ['pab3', 'pab6'], pab8: ['pab1'], pab9: ['pab5'], pab10: ['pab4'], pab11: ['pab2'],
    dgl9: ['dgl1'], dgl10: ['dgl4', 'dgl5', 'dgl8'], dgl11: ['dgl2', 'dgl6'], dgl12: ['dgl3'], dgl14: ['dgl1', 'dgl6'], dgl15: ['dgl8', 'dgl4'],
    fen7: ['fen1', 'fen2'], fen8: ['fen3'], fen9: ['fen4'], fen10: ['fen5'], fen11: ['fen1', 'fen2'], fen12: ['fen6'],
    bil7: ['bil1', 'bil4', 'bil5'], bil8: ['bil2'], bil9: ['bil3'], bil11: ['bil1'],
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
      codigo: 'AQ-aporte-cruzado', familia: ['c-dalton', 'c-thomson', 'c-rutherford', 'c-bohr', 'c-schrodinger'], codigoFamilia: 'AT5',
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
      codigo: 'AQ-vitamina-coenzima', pares: [
        { id: 'z-b1', izq: 'tiamina (B1)', der: 'TPP' },
        { id: 'z-b2', izq: 'riboflavina (B2)', der: 'FAD y FMN' },
        { id: 'z-b3', izq: 'niacina (B3)', der: 'NAD⁺ y NADP⁺' },
        { id: 'z-b5', izq: 'ácido pantoténico (B5)', der: 'coenzima A' },
        { id: 'z-b6', izq: 'piridoxina (B6)', der: 'PLP' },
        { id: 'z-b9', izq: 'ácido fólico (B9)', der: 'THF' },
      ] },
    { id: 'funciones', unidad: 'quimica.biomoleculas-y-productos-naturales', izqNombre: 'cada vitamina', izqVar: 'vitamina', derNombre: 'una de sus funciones principales',
      codigo: 'AQ-vitamina-funcion', pares: [
        { id: 'f-a', izq: 'vitamina A', der: 'la visión: forma parte del pigmento de la retina' },
        { id: 'f-d', izq: 'vitamina D', der: 'la absorción del calcio y la formación de los huesos' },
        { id: 'f-k', izq: 'vitamina K', der: 'la coagulación de la sangre' },
        { id: 'f-c', izq: 'vitamina C', der: 'la formación del colágeno' },
        { id: 'f-b12', izq: 'vitamina B12', der: 'la formación de glóbulos rojos; tiene cobalto' },
      ] },
    { id: 'metalurgia', unidad: 'quimica.recursos-naturales', izqNombre: 'cada proceso metalúrgico', izqVar: 'proceso metalúrgico', derNombre: 'lo que se hace en él',
      codigo: 'AQ-proceso-metalurgico', choques: [['m-lixiviacion', 'm-cianuracion']], pares: [
        { id: 'm-tostacion', izq: 'tostación', der: 'calentar un sulfuro con aire para pasarlo a óxido' },
        { id: 'm-flotacion', izq: 'flotación', der: 'separar la mena de la ganga sin cambiarla químicamente, con un espumante' },
        { id: 'm-lixiviacion', izq: 'lixiviación', der: 'disolver el metal del mineral con una solución acuosa' },
        { id: 'm-cianuracion', izq: 'cianuración', der: 'disolver el oro con una sal que forma un complejo soluble' },
        { id: 'm-altohorno', izq: 'alto horno', der: 'reducir el óxido de hierro con monóxido de carbono' },
        { id: 'm-electro', izq: 'electrorrefinación', der: 'purificar el cobre depositándolo en el cátodo' },
      ] },
    { id: 'precursores', unidad: 'quimica.biomoleculas-y-productos-naturales', izqNombre: 'cada sustancia', izqVar: 'sustancia', derNombre: 'lo que el cuerpo forma a partir de ella',
      codigo: 'AQ-precursor-cruzado', pares: [
        { id: 'pr-colesterol', izq: 'colesterol', der: 'las hormonas esteroideas y la vitamina D₃' },
        { id: 'pr-caroteno', izq: 'β-caroteno', der: 'la vitamina A (retinol)' },
        { id: 'pr-niacina', izq: 'niacina (B3)', der: 'NAD⁺' },
        { id: 'pr-riboflavina', izq: 'riboflavina (B2)', der: 'FAD' },
        { id: 'pr-pantotenico', izq: 'ácido pantoténico (B5)', der: 'coenzima A' },
        { id: 'pr-tiamina', izq: 'tiamina (B1)', der: 'TPP' },
      ] },
    { id: 'solido-ejemplo', unidad: 'quimica.enlace-quimico', izqNombre: 'cada sólido', izqVar: 'sólido', derNombre: 'su tipo de sólido',
      codigo: 'AQ-tipo-solido', pares: [
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
      codigo: 'AQ-tipo-solido', familia: ['sp-ionico', 'sp-metalico'], codigoFamilia: 'AQ-ionico-conduce', pares: [
        { id: 'sp-ionico', izq: 'funde a unos 800 °C; no conduce sólido, pero sí fundido o disuelto en agua', izqCorto: 'el que conduce solo fundido o disuelto', der: 'iónico' },
        { id: 'sp-metalico', izq: 'conduce la corriente en estado sólido y se puede estirar en hilos', izqCorto: 'el que conduce en estado sólido', der: 'metálico' },
        { id: 'sp-red', izq: 'funde a más de 1500 °C, es insoluble en agua y no conduce ni sólido ni fundido', izqCorto: 'el que funde a más de 1500 °C', der: 'covalente de red' },
        { id: 'sp-molecular', izq: 'funde por debajo de 150 °C y no conduce ni sólido ni fundido', izqCorto: 'el que funde por debajo de 150 °C', der: 'molecular' },
      ] },
    // UNMSM 2023-I (10.12.2022, p. 89): las especies de la dismutación del ácido nitroso.
    { id: 'nitroso', unidad: 'quimica.enlace-quimico', izqNombre: 'cada descripción', izqVar: 'descripción', derNombre: 'la especie que describe, en 2 HNO₂ → NO + NO₂ + H₂O',
      codigo: 'AQ-dismutacion-cruzada', pares: [
        { id: 'ni-oxidada', izq: 'la especie oxidada, un gas pardo', izqCorto: 'la especie oxidada', der: 'NO₂' },
        { id: 'ni-reducida', izq: 'la especie reducida, un gas incoloro', izqCorto: 'la especie reducida', der: 'NO' },
        { id: 'ni-acido', izq: 'el ácido, con dos enlaces simples y uno doble', izqCorto: 'el ácido', der: 'HNO₂' },
        { id: 'ni-anion', izq: 'el anión de las sales llamadas nitritos', izqCorto: 'el anión de los nitritos', der: 'NO₂⁻' },
      ] },
  ];

  // ---------- Armado ----------
  // Lo agregado en el cierre 100 (12 nov 2026) va en su propia bolsa; ver generar().
  const IDS_NUEVOS = new Set(['hidratacion-oxidacion', 'acido-nitroso', 'carotenoide', 'paba', 'derivados-glucosa', 'fenton-lewis', 'bilirrubina', 'nitroso']);
  const BOLSA_VIEJA = { temas: TEMAS.filter(t => !IDS_NUEVOS.has(t.id)), pares: PARES.filter(c => !IDS_NUEVOS.has(c.id)) };
  const BOLSA_NUEVA = { temas: TEMAS.filter(t => IDS_NUEVOS.has(t.id)), pares: PARES.filter(c => IDS_NUEVOS.has(c.id)) };
  const ROM = ['I', 'II', 'III', 'IV', 'V'];
  const LET = ['a', 'b', 'c', 'd', 'e'];
  const COLOR = ['o', 'i', 'h', 'd'];
  const v = P.v;
  const xml = P.xml;
  const NEGAR = 'AQ-negar-verdadera';
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
    // Los diagramas de Pourbaix salen con un azar aparte (7 % de los problemas): el resto no cambia de semilla.
    const aparte = Azar.crear('quimica-conceptos|pourbaix|' + semilla);
    const u = aparte.sig();
    if (u < 0.07) {
      for (let intento = 0; intento < 50; intento++) {
        const pr = pourbaix(aparte);
        if (pr && pr.alternativas.length >= 4) { pr.id = `quimica-conceptos#${semilla}`; return pr; }
      }
    }
    // Los temas y los conjuntos del cierre 100 salen en otro 17 % con su propia bolsa; en el resto, la bolsa de antes:
    // así cada semilla que ya existía da el mismo problema que antes.
    const bolsa = u < 0.24 ? BOLSA_NUEVA : BOLSA_VIEJA;
    const tipo = rng.elegir(['vf', 'vf', 'vf', 'vf', 'incorrecta', 'incorrecta', 'correcta', 'correcta', 'relacionar', 'relacionar']);
    for (let intento = 0; intento < 500; intento++) {
      const pr = tipo === 'vf' ? secuencia(rng, bolsa) : tipo === 'relacionar' ? relacionar(rng, bolsa) : unaSola(rng, tipo, bolsa);
      if (pr && pr.alternativas.length >= 4) {
        pr.id = `quimica-conceptos#${semilla}`;
        return pr;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Convenciones de academia que la respuesta sigue (nucleo/convencion.js): se muestran en grande bajo la solución.
  const CONVENCION_POR_TEMA = { 'dativo-oxisales': 'dativos' };
  function cierre(o) {
    const temas = new Set([o.datos.tema, ...(o.datos.ids || []).map(id => (BANCO.find(b => b.id === id) || {}).tema)]);
    const convenciones = [...new Set([...temas].map(t => CONVENCION_POR_TEMA[t]).filter(Boolean))];
    const r = { id: '', variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '', alternativas: o.alternativas,
      solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto }, _datos: o.datos,
      ...(convenciones.length ? { convenciones } : {}) };
    if (o.figura) r.figura = o.figura;
    if (o.figuraSolucion) r.figuraSolucion = o.figuraSolucion;
    return r;
  }

  // ---- vf: secuencia de 3 o 4 proposiciones ----
  function secuencia(rng, bolsa) {
    const tema = rng.elegir(bolsa.temas);
    const n = rng.elegir([3, 4]);
    const props = tomar(rng, tema.props, n);
    return secuenciaDe(rng, tema, props, { tipo: 'vf', tema: tema.id, ids: props.map(p => p.id) });
  }
  // El armado de una secuencia V/F a partir de proposiciones ya elegidas (las del banco o las de un diagrama de Pourbaix).
  function secuenciaDe(rng, tema, props, datos) {
    if (props.length < 3 || !props.some(p => p.verdad) || !props.some(p => !p.verdad)) return null;
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
    return cierre({ variables: {}, enunciado, pregunta: ['¿Cuál es la secuencia correcta?'], alternativas, solucion, correcta, datos });
  }

  // ---- incorrecta / correcta: una sola falsa (o una sola verdadera) entre 4 o 5 ----
  function unaSola(rng, tipo, bolsa) {
    const buscada = tipo === 'correcta'; // valor de verdad de la que se busca
    let n = rng.elegir([4, 5]);
    const tema = rng.elegir(bolsa.temas);
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
  function relacionar(rng, bolsa) {
    const conj = rng.elegir(bolsa.pares);
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


  // ---- pourbaix: leer un diagrama de potencial contra pH (UNMSM 2026-II, medicina, 15.03.2026, p. 88) ----
  // Dos diagramas SIMPLIFICADOS propios (no son el del zinc del examen): el del aluminio, con límites redondeados que
  // sirven para el ejercicio y no para datos de laboratorio, y el de un metal inventado «X». Cada zona es un polígono
  // en (pH, E); la figura se dibuja con esos mismos polígonos y la especie estable de un punto es el polígono que lo
  // contiene (la prueba lo recalcula con las rectas, sin los polígonos). El dato de acidez llega como pH, como [H⁺] o
  // como pOH; los errores típicos son tomar el exponente o el pOH como si fuera el pH (pH = 14 − dato) y cambiar el
  // signo del potencial.
  const DIAGRAMAS = [
    { id: 'aluminio', metal: 'el aluminio', de: 'del aluminio', ejeE: [-2.6, 0.6], especies: [
      { id: 'Al', nombre: 'Al(s)', desc: 'metal sólido', poly: [[0, -2.6], [14, -2.6], [14, -2.4], [10, -2.16], [4, -1.8], [0, -1.8]], et: [7, -2.3] },
      { id: 'Al3', nombre: 'Al³⁺(ac)', desc: 'catión disuelto', poly: [[0, -1.8], [4, -1.8], [4, 0.6], [0, 0.6]], et: [2, -0.6] },
      { id: 'Al2O3', nombre: 'Al₂O₃(s)', desc: 'óxido sólido', poly: [[4, -1.8], [10, -2.16], [10, 0.6], [4, 0.6]], et: [7, -0.6] },
      { id: 'AlO2', nombre: 'AlO₂⁻(ac)', desc: 'anión disuelto', poly: [[10, -2.16], [14, -2.4], [14, 0.6], [10, 0.6]], et: [12, -0.6] },
    ] },
    { id: 'metal-x', metal: 'el metal X', de: 'del metal inventado X', ejeE: [-1.2, 1.6], especies: [
      { id: 'X', nombre: 'X(s)', desc: 'metal sólido', poly: [[0, -1.2], [14, -1.2], [14, -0.96], [8, -0.6], [0, -0.6]], et: [7, -0.95] },
      { id: 'X2', nombre: 'X²⁺(ac)', desc: 'catión disuelto', poly: [[0, -0.6], [8, -0.6], [8, 1.0], [0, 1.0]], et: [4, 0.2] },
      { id: 'XOH2', nombre: 'X(OH)₂(s)', desc: 'hidróxido sólido', poly: [[8, -0.6], [14, -0.96], [14, 0.64], [8, 1.0]], et: [11, 0.0] },
      { id: 'XO4', nombre: 'XO₄²⁻(ac)', desc: 'anión disuelto', poly: [[0, 1.0], [8, 1.0], [14, 0.64], [14, 1.6], [0, 1.6]], et: [7, 1.3] },
    ] },
  ];
  const dentro = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  // Especie estable en (pH, E). Fuera del cuadro (el signo cambiado puede dejarlo fuera) se lee la zona más cercana al borde.
  function especieEn(d, pH, E) {
    const x = Math.min(13.999, Math.max(0.001, pH)), y = Math.min(d.ejeE[1] - 1e-6, Math.max(d.ejeE[0] + 1e-6, E));
    const e = d.especies.find(s => dentro(s.poly, x, y));
    if (!e) throw new Error(`especieEn: (${pH}, ${E}) no cae en ninguna zona de ${d.id}`);
    return e;
  }
  // Un punto al que no le falte margen: la misma zona 0,4 de pH y 0,1 V alrededor.
  const seguro = (d, pH, E) => {
    const z = especieEn(d, pH, E);
    for (const a of [-0.4, 0, 0.4]) for (const b of [-0.1, 0, 0.1]) if (especieEn(d, pH + a, E + b) !== z) return false;
    return true;
  };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const fEv = e => (e < 0 ? '−' : '') + Math.abs(e).toFixed(1).replace('.', ',');
  const fpH = n => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));
  const datoPH = (forma, pH) => (forma === 'H' ? `[H⁺] = 10⁻${sup(pH)} M` : forma === 'pOH' ? `pOH = ${fpH(14 - pH)}` : `pH = ${fpH(pH)}`);
  const convPH = (forma, pH) => (forma === 'H' ? `pH = −log[H⁺] = ${pH}` : forma === 'pOH' ? `pH = 14 − pOH = 14 − ${fpH(14 - pH)} = ${fpH(pH)}` : `pH = ${fpH(pH)} (el dato ya es el pH)`);
  const CODIGO_PH = { H: 'AQ-pourbaix-h-poh', pOH: 'AQ-pourbaix-poh-ph', pH: 'AQ-pourbaix-ph-poh' };
  const POURBAIX_CODIGOS = ['AQ-pourbaix-h-poh', 'AQ-pourbaix-poh-ph', 'AQ-pourbaix-ph-poh', 'AQ-pourbaix-signo-e', 'AQ-pourbaix-lectura'];
  // Lo que da cada lectura equivocada de un punto.
  function lecturas(d, forma, pH, E) {
    const k = pH;
    const cambio = especieEn(d, 14 - pH, E), signo = especieEn(d, pH, -E);
    const expCambio = forma === 'H' ? `Tomaste el exponente (${k}) como si fuera el pOH: eso da pH = 14 − ${k} = ${14 - k}. Pero [H⁺] = 10⁻${sup(k)} M ya da pH = ${k}.`
      : forma === 'pOH' ? `Usaste el pOH (${fpH(14 - pH)}) como si fuera el pH. Hay que pasarlo: pH = 14 − ${fpH(14 - pH)} = ${fpH(pH)}.`
      : `Cambiaste el pH por 14 − pH = ${fpH(14 - pH)}, que sería el pOH.`;
    return { cambio, signo, expCambio, expSigno: `Cambiaste el signo del potencial: el punto está en E = ${fEv(E)} V, no en ${fEv(-E)} V.`,
      expLectura: 'Esa especie es la estable en otra zona del diagrama: ubica primero el pH en el eje horizontal y después el potencial en el eje vertical.' };
  }
  function puntoSeguro(rng, d, forma, trampa) {
    let ultimo = null;
    for (let i = 0; i < 400; i++) {
      const pH = forma === 'H' ? rng.entero(1, 13) : rng.entero(1, 27) / 2;
      const E = rng.entero(Math.ceil(d.ejeE[0] * 10) + 1, Math.floor(d.ejeE[1] * 10) - 1) / 10;
      // También los puntos de las lecturas con error (pH cambiado por 14 − pH y potencial con el signo cambiado) deben tener margen.
      const Ec = Math.min(d.ejeE[1] - 0.1, Math.max(d.ejeE[0] + 0.1, -E));
      if (E === 0 || !seguro(d, pH, E) || !seguro(d, 14 - pH, E) || !seguro(d, pH, Ec)) continue;
      ultimo = { pH, E };
      if (!trampa || especieEn(d, 14 - pH, E) !== especieEn(d, pH, E)) return ultimo;
    }
    return ultimo;
  }
  function svgPourbaix(d, marcas) {
    const W = 380, H = 266, x0 = 50, x1 = 366, y0 = 22, y1 = 222, [e0, e1] = d.ejeE;
    const X = ph => x0 + (x1 - x0) * ph / 14, Y = e => y1 - (y1 - y0) * (e - e0) / (e1 - e0);
    const nE = e => (e === 0 ? '0' : fEv(e));
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" style="color:inherit">`;
    d.especies.forEach((sp, k) => {
      s += `<polygon points="${sp.poly.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(' ')}" style="fill:currentColor;fill-opacity:${[0.05, 0.12, 0.18, 0.09][k]};stroke:var(--muted)" stroke-width="1.2"/>`;
      s += `<text x="${X(sp.et[0]).toFixed(1)}" y="${(Y(sp.et[1]) + 4).toFixed(1)}" text-anchor="middle" font-size="13" style="fill:currentColor">${xml(sp.nombre)}</text>`;
    });
    s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" style="fill:none;stroke:currentColor" stroke-width="1.6"/>`;
    for (let ph = 0; ph <= 14; ph += 2) s += `<line x1="${X(ph)}" y1="${y1}" x2="${X(ph)}" y2="${y1 + 4}" style="stroke:currentColor"/><text x="${X(ph)}" y="${y1 + 17}" text-anchor="middle" font-size="12" style="fill:currentColor">${ph}</text>`;
    for (let e = Math.ceil(e0 * 2) / 2; e <= e1 + 1e-9; e += 0.5) {
      const ee = Math.round(e * 10) / 10;
      s += `<line x1="${x0 - 4}" y1="${Y(ee).toFixed(1)}" x2="${x0}" y2="${Y(ee).toFixed(1)}" style="stroke:currentColor"/><text x="${x0 - 7}" y="${(Y(ee) + 4).toFixed(1)}" text-anchor="end" font-size="12" style="fill:currentColor">${nE(ee)}</text>`;
    }
    s += `<text x="${(x0 + x1) / 2}" y="${H - 6}" text-anchor="middle" font-size="13" style="fill:currentColor">pH</text>`;
    s += `<text x="${x0}" y="13" text-anchor="middle" font-size="13" style="fill:currentColor">E (V)</text>`;
    for (const m of marcas || []) {
      const cx = X(m.pH).toFixed(1), cy = Y(m.E).toFixed(1), cH = m.colorPH || 'currentColor', cE = m.colorE || 'currentColor';
      s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${y1}" style="stroke:${cH}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      s += `<line x1="${cx}" y1="${cy}" x2="${x0}" y2="${cy}" style="stroke:${cE}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="4.5" style="fill:var(--card);stroke:currentColor" stroke-width="2"/>`;
      if (m.rotulo) s += `<text x="${(+cx + 8).toFixed(1)}" y="${(+cy - 7).toFixed(1)}" font-size="13" font-weight="700" style="fill:currentColor">${xml(m.rotulo)}</text>`;
    }
    return s + '</svg>';
  }
  const altPourbaix = (d, extra) => `Diagrama de Pourbaix simplificado ${d.de}: potencial en voltios contra pH, dividido en cuatro zonas: ${d.especies.map(e => `${e.nombre} (${e.desc})`).join(', ')}.${extra ? ' ' + extra : ''}`;

  // Tipo A: ¿qué especie es estable en el punto (E, dato de acidez)?
  function pourbaixEspecie(rng) {
    const d = rng.elegir(DIAGRAMAS), forma = rng.elegir(['H', 'H', 'pOH', 'pH']);
    const { pH, E } = puntoSeguro(rng, d, forma, true);
    const verdad = especieEn(d, pH, E), L = lecturas(d, forma, pH, E);
    const texto = e => `${e.nombre} (${e.desc})`;
    const correcta = { clave: 'pb:' + verdad.id, texto: texto(verdad) };
    const errores = d.especies.filter(e => e !== verdad).map(e => {
      const [id, ex] = e === L.cambio ? [CODIGO_PH[forma], L.expCambio] : e === L.signo ? ['AQ-pourbaix-signo-e', L.expSigno] : ['AQ-pourbaix-lectura', L.expLectura];
      return err(id, 'pb:' + e.id, texto(e), ex);
    });
    const alternativas = P.armarTexto({ correcta, errores: rng.barajar(errores), rng, total: 4 });
    const variables = { pH: { nombre: 'acidez (pH)', color: 'i' }, E: { nombre: 'potencial E', color: 'o' } };
    const enunciado = [`En el diagrama de Pourbaix simplificado ${d.de} de la figura, ${d.metal} se encuentra a un potencial de `, v('E', `${fEv(E)} V`), ' y a ', v('pH', datoPH(forma, pH)), '.'];
    const solucion = [
      ['Pasa el dato de acidez a pH: ', v('pH', convPH(forma, pH)), '.'],
      ['Ubica el pH ', v('pH', fpH(pH)), ' en el eje horizontal y el potencial ', v('E', `${fEv(E)} V`), ' en el eje vertical.'],
      [`El punto cae en la zona de ${verdad.nombre}: ${verdad.desc}.`],
    ];
    return cierre({ variables, enunciado, pregunta: [`¿Cuál es la especie estable ${d.de.replace(" inventado", "")}?`], alternativas, solucion, correcta,
      datos: { tipo: 'pourbaix', sub: 'especie', diagrama: d.id, forma, pH, E },
      figura: { svg: svgPourbaix(d, []), alt: altPourbaix(d) },
      figuraSolucion: { svg: svgPourbaix(d, [{ pH, E, colorPH: 'var(--c-i)', colorE: 'var(--c-o)' }]), alt: altPourbaix(d, `El punto (pH ${fpH(pH)}; E ${fEv(E)} V) cae en la zona de ${verdad.nombre}.`) } });
  }

  // Tipo B: tres puntos, cada uno con la especie que se afirma; ¿cuáles afirmaciones son verdaderas?
  function pourbaixVF(rng) {
    const d = rng.elegir(DIAGRAMAS);
    const props = [], marcas = [];
    const quedan = rng.barajar([true, false, rng.moneda()]);
    for (let k = 0; k < 3; k++) {
      const forma = rng.elegir(['H', 'pOH', 'pH']);
      let pt, intentos = 0;
      do { pt = puntoSeguro(rng, d, forma, !quedan[k]); intentos++; } while (marcas.some(m => m.pH === pt.pH && m.E === pt.E) && intentos < 20);
      const { pH, E } = pt, verdad = especieEn(d, pH, E), L = lecturas(d, forma, pH, E);
      let dicha = verdad, error = null, nota = '';
      if (!quedan[k]) {
        const trampas = [[L.cambio, CODIGO_PH[forma], L.expCambio], [L.signo, 'AQ-pourbaix-signo-e', L.expSigno]].filter(t => t[0] !== verdad);
        const t = trampas.length ? rng.elegir(trampas) : null;
        if (t) { dicha = t[0]; error = t[1]; nota = ' ' + t[2]; }
        else { dicha = rng.elegir(d.especies.filter(e => e !== verdad)); error = 'AQ-pourbaix-lectura'; nota = ' ' + L.expLectura; }
      }
      const frase = e => `Con ${datoPH(forma, pH)} y E = ${fEv(E)} V, ${d.metal} está como ${e.nombre}.`;
      const base = `${convPH(forma, pH)}; con E = ${fEv(E)} V el punto cae en la zona de ${verdad.nombre}.`;
      props.push({ id: 'pb' + k, texto: frase(dicha), verdad: dicha === verdad, error, negar: null, excluye: [], respaldo: null,
        explicacion: dicha === verdad ? base : `${base}${nota}`, corregida: frase(verdad) });
      marcas.push({ pH, E, rotulo: ROM[k] });
    }
    const tema = { id: 'pourbaix', nombre: `el diagrama de Pourbaix simplificado ${d.de} de la figura`, contexto: null };
    const r = secuenciaDe(rng, tema, props, { tipo: 'pourbaix', sub: 'vf', diagrama: d.id, puntos: marcas.map((m, k) => ({ pH: m.pH, E: m.E, dicha: props[k].texto, verdad: props[k].verdad })) });
    if (!r) return null;
    r.figura = { svg: svgPourbaix(d, []), alt: altPourbaix(d) };
    r.figuraSolucion = { svg: svgPourbaix(d, marcas), alt: altPourbaix(d, `Los puntos I, II y III caen en las zonas ${props.map((p, k) => `${ROM[k]}: ${especieEn(d, marcas[k].pH, marcas[k].E).nombre}`).join('; ')}.`) };
    return r;
  }
  function pourbaix(rng) { return rng.sig() < 0.5 ? pourbaixEspecie(rng) : pourbaixVF(rng); }

  return { id: 'quimica-conceptos', generar, BANCO, TEMAS: TEMAS.map(({ props, ...t }) => ({ ...t, ids: props.map(p => p.id) })), PARES, ERRORES, POURBAIX: { DIAGRAMAS, especieEn, codigos: POURBAIX_CODIGOS } };
});
