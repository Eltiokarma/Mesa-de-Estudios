# Auditoría de contenido: «Analogías» (razonamiento-verbal.analogias)

19 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Vara: `docs/molde-unidad.md` §10 y la fila de verbal de §11. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en la Etapa 5: la sección «Lo que encontraron los
auditores» de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa6/propuesta-verbal.md`. Lo que vieron los
dos lectores en frío está en `rutinas/frio/razonamiento-verbal.analogias.md`; aquí se cita cuando el código lo confirma.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-verbal/analogias.js` (v0.3.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Así se resuelve» (4 hojas por idea) y «Ahora tú» (6 casos por idea; la semilla cambia el orden);
  - el glosario (16 términos) y las 5 mesas.
- La práctica `plantillas/analogias/`: 10 tipos (2 por idea), banco de 30 ítems, `casos.json` (20) y `papel.json` (8).
- La app a 390 px con `--entera`, contra un servidor propio en el puerto 4419: 35 momentos y 75 ejemplos.

**Cuentas (en verbal: cada pregunta con alternativas, rehecha por otro camino).**
- **Un léxico propio**:
  - `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-an/aud/lexico.js`.
  - Pone una etiqueta mía a cada uno de los 692 pares distintos que ve el alumno (unos 30 tipos de relación: oficio y
    útil, oficio y sitio, útil y objeto, usuario, especie, pieza, miembro, provoca y resulta, sucesión, igual, opuesto,
    sube y baja, rasgos dispares…).
  - Está escrito sin mirar las etiquetas de la unidad ni las del generador.
  - Los pares que un alumno de 5.º del Perú puede leer de dos maneras llevan las dos etiquetas.
- **Un revisor**:
  - `…/aud/revisa.js`, que lee lo que la unidad y el generador entregan, extraído con `…/aud/extrae.js`.
  - Revisa 105 preguntas de la teoría (5 predicciones, 30 «Ahora tú», 20 hojas de «Así se resuelve», 25 hojas de
    nivel 3 y 25 listas de nivel 2) y 400 semillas de la práctica.
  - Comprueba que una sola alternativa tenga la etiqueta del par base, en su orden y con su categoría.
  - Saca de la explicación de cada incorrecta el motivo que da (tema, al revés, clase en vez de parte, grado en vez de
    opuesto, categoría, oración muy amplia, sin persona…) y lo compara con la etiqueta mía.
  - Mide la regla 10 de verbal: ni la más larga ni la más corta, no escrita dentro de otra, y la letra o el lugar
    repartidos.
- **A mano**: las 105 preguntas de la teoría y los 30 ítems del banco, alternativa por alternativa, pensando en un
  alumno peruano de 5.º (palabras regionales, dos lecturas).

**Resultado de las cuentas, antes de corregir.**
- En las 505 preguntas hay una sola correcta con la lectura más común.
- La regla 10 de largo y de «escrita dentro de otra» se cumple en todas, con 0 fallas.
- Fallan tres cosas:
  - cinco explicaciones «al revés» no son el revés de la relación del par base (M4);
  - hay pares con dos lecturas, que dan dos correctas posibles o un resuelto falso (A1, M5, M6);
  - la correcta tiende a un lugar: la C en 4 de 5 predicciones y el lugar del medio en 18 de 25 listas (M3).

Validador con `calidad: 2` simulada y 200 semillas: **0 problemas, 0 pendientes**, antes y después. Ninguna falta de
abajo la ve una regla de hoy. `herramientas/ecuaciones-ancho.js`: todo cabe (49 pantallas, 339 renglones). Pruebas
propias antes de corregir: `analogias.test.js` 53 de 53 y generador 29 de 29.

**Contenido propio.**
- Los pares, carteles, murales y cuadernos son inventados; ninguno copia un examen ni un manual.
- El formato de la hoja va como hipótesis declarada (cabecera y propuesta), y el alumno solo lee «simulacro».

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | Regla 3 de CLAUDE.md; 13 | Predice de la idea 2, «ÁRBOL : BOSQUE» (`HOJA_BOSQUE`; lector A) | Antes de predecir, el alumno solo jugó con «es un tipo de» y «es una parte de». Con eso, «el árbol es una parte del bosque» le parece verdadera, y «hoja : rama» (B) vale igual que «abeja : enjambre» (C). El lector A eligió B. «Grupo» recién se nombra en la regla, y la predicción no traía Datos. | Datos con las pruebas de clase y de parte («la primera es una pieza que, con piezas de otro tipo, forma la segunda»), sin nombrar el grupo, que sigue siendo lo nuevo. Con eso B se descarta por sí sola. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 6 (una palabra, un significado) | Ideas 1, 2 y 5 (lectores A y B) | Hay dos problemas de nombres:<br>• «Clase» significa dos cosas. En las ideas 1 y 5 es el primer pedazo de la oración puente («clase: trabaja con»). En la idea 2 es «todo cóndor es un ave».<br>• Cada relación de la idea 2 tiene tres nombres: tipo, clase y «género y especie»; parte y «parte y todo»; grupo y «elemento y conjunto». Los Datos usan unos y el resuelto, otros (tarjetas 05 y 06). | La oración puente se arma con «unión» y «rasgo». Los Datos dicen «Clase (género y especie)», «Parte (parte y todo)» y «Grupo (elemento y conjunto)», y el resuelto dice clase, parte o grupo. |
| M2 | 10; regla 3 | Frontera entre parte y grupo: `RESUELVE_2[0]` («página : libro», «escalón : escalera»), ejemplo «La hoja del cuaderno» y «Las uvas del racimo» («diente : peine») (lectores A y B) | Los Datos decían «Grupo: muchos iguales a la primera» y «Parte: con otras distintas». Pero un libro son muchas páginas iguales, una escalera muchos escalones y un peine muchos dientes, y el diccionario define el libro, el cuaderno y la escalera como un «conjunto» de páginas, pliegos o escalones. Con esos Datos, «diente : peine» y «uva : racimo» quedan en la misma relación: hay dos correctas posibles. | Datos más finos. Grupo: «un conjunto hecho solo de muchos iguales a la primera». Parte: «una pieza que, con piezas de otro tipo, forma la segunda». Y piezas sin esa doble lectura: «tapa : libro» con «hélice : ventilador», «pantalla : celular» y «asa : taza». |
| M3 | Regla 10 (posición) | Predicciones y listas de nivel 2 | La correcta de las predicciones (orden fijo) era la C en 4 de 5: C, C, B, C, C. En las 25 listas «¿«x», «y» o «z»?» la correcta iba en el medio en 18. La prueba propia solo miraba que no fuera al final. | Predicciones en C, B, B, D, C. Listas repartidas 8, 9 y 8. |
| M4 | 2 de la Etapa 5 (la explicación da el error de verdad) | `RESUELVE_5[0]` y `[1]`, ejemplos «El guía del museo» y «El pastor»; banco `enfermera` (16 de 400 semillas) | Cinco incorrectas se explican «va al revés», pero dadas vuelta no se unen como el par base:<br>• «tejer : tejedora» se vuelve «tejedora : tejer», que es persona y acción, y el par base «panadero : pan» es persona y cosa;<br>• lo mismo pasa con «manejar : chofer» (con «piloto : avión»), «cuidar : niñera» (con «pastor : rebaño») y «vigilar : guardián» (con «enfermera : pacientes»): fallan por la categoría y por el orden;<br>• «bus : conductor», dado vuelta, tampoco es persona y lugar.<br>El resuelto le da al alumno un motivo que no es el que decide. | El revés exacto del par base: «chompa : tejedora», «camión : camionero», «oficina : jefe», «plantas : jardinero» y, en el banco, «niños : niñera» (relación nueva `CUIDAP`). |
| M5 | 10 (dos lecturas) | Pares de la teoría y del banco | Para un alumno peruano estos pares se leen de dos maneras:<br>• «HELADO : FRÍO» (`RESUELVE_4[3]`) y «fresco : helado» (banco `fresco`): el helado es el postre, y «fresco» es también «descarado»;<br>• «temblor : frío» (banco `bostezo`): en el Perú, un temblor es un sismo;<br>• «metro : longitud» y «medir : metro»: el metro es la unidad (la cinta es la wincha);<br>• «hielo : frío»: el hielo enfría y el frío hace hielo, así que vale como causa o como efecto;<br>• «frecuente : raro»: «raro» con el sentido de «poco frecuente», en la misma hoja donde «raro : extraño» lo usa con otro. Esa polisemia es de Sentido contextual;<br>• «fuerte : cansado»: casi opuestos en la energía (el lector B dudó);<br>• «enojado : molesto»: puede leerse como intensidad. | Cambiarlos por pares de una sola lectura: «ardiente : caliente», «tibio : ardiente», «llanto : dolor», «regla : longitud», «medir : regla», «cicatriz : herida», «fácil : difícil», «fuerte : callado», «asustado : temeroso». |
| M6 | 10; 13 | Ejemplo 14 de la idea 4, «Hablar y gritar» (lector B, tarjeta 12) | El resuelto dice que «contemplar es mirar con más fuerza», y es falso: contemplar es mirar con atención y por un rato. Además, la incorrecta «correr : caminar» es un par de intensidad más claro que la correcta. Y la glosa de Datos («mirar algo con atención…») casi da la D. | «tocar : golpear», sin glosa: «golpear es tocar con mucha más fuerza». |
| M7 | Etapa 5, punto 4 (Datos que regalan) | Glosas en Datos: el chichón (`RESUELVE_3[0]`; lector A), el camélido (ejemplo «El gato y su clase» y banco `iguana`), el olluco (ejemplo «El durazno») y la caravana (banco `flota`) | La glosa de una palabra nombra la otra palabra de la correcta:<br>• «bulto que sale en la cabeza **después de un golpe**», con la correcta «golpe : chichón»; además usa «después», cuando la regla dice que venir después no es ser efecto;<br>• «animal como la llama, la **alpaca** o la vicuña», con la correcta «alpaca : camélido»;<br>• «**tubérculo** andino», con «olluco : tubérculo»;<br>• «fila de muchos **carros**», con «carro : caravana». | Glosas que no nombran la otra palabra: «bulto que se forma en la cabeza», «animal andino de cuello largo, como la llama», «planta andina que se come, como la papa» y «fila de vehículos que viajan juntos». |
| M8 | 2 | Voz de «Ahora tú» en las 5 ideas (lectores A y B) | Iris dice «Otro texto. Lee primero lo que dice.», que es la voz del curso para la lectura, y en la pantalla no hay ningún texto. | Una `voz` propia en cada `ahoraTu` («Otra hoja. Arma primero la oración puente del par base.»). |
| M9 | 3 | Juego de la idea 3, el mural (lector A) | El mural numera las fichas del 2 al 6 (el 1 es la base), pero los botones dicen «Ficha 1» a «Ficha 5». | Las etiquetas «Ficha 2» a «Ficha 6». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 | Varias incorrectas «del mismo tema» que tienen una relación propia | Hay cinco casos:<br>• «champú : cabello» se explica como del mismo tema, y «peine : pelo», en la misma hoja, como «sin persona», aunque tienen la misma relación;<br>• «pasaje : boleto» son sinónimos en el Perú;<br>• «lago : orilla» es todo y parte;<br>• «jeringa : vacuna» y «pulsera : muñeca», en el banco;<br>• además, «foco : luz», «piedra : estatua», «leña : fogata», «gol : arco», «toga : mazo»…<br>Todas fallan, pero por otra razón. | «toalla : champú», «paradero : boleto», «red : lago» y «algodón : venda». Las demás se dejan: fallan igual y el motivo no engaña. |
| B2 | Regla 10 (pista) | Predicción de la idea 1 | Dos alternativas empezaban con «tejedora»: la correcta y una incorrecta. Un alumno con malicia elige entre las dos parecidas. | «costurera : vestido» en vez de «tejedora : chompa». En las ideas 3 y 4 los pares espejo se dejan: el orden es lo que se enseña. |
| B3 | 7, 13 | Idea 4: Mira y Datos (lector B) | «Tibio, del mismo lado que caliente» confunde, porque el tibio está a medio camino. La intensidad se definía «con más fuerza», pero los ejemplos son de tamaño (charco y lago, colina y montaña). | Mira: «los dos dicen calor, y caliente dice más que tibio»; el paso dice «distinto grado». Intensidad: «en mayor grado (más fuerte, más grande)», también en la regla y en la práctica. |
| B4 | 12, 3 | Idea 5 (lector B) | Hay cinco detalles:<br>• la regla usaba el ejemplo de minero y mina bajo la hoja de CANTANTE : CANTAR;<br>• su «su categoría gramatical» es ambiguo;<br>• la lectura «Muy amplia: pasan 5 pares» repetía el sello de la tabla;<br>• la tarjeta 13 llama «rasgo» a «porque trabaja ahí»;<br>• «vigilante : puerta»: una puerta no es un lugar donde se trabaja. | Hechos:<br>• la regla usa «es el que» + «es un verbo»;<br>• la regla dice «qué nombra la segunda palabra o de qué categoría gramatical es»;<br>• la lectura dice «Se cuelan N pares junto a profesor : colegio»;<br>• la tarjeta 13 pregunta «¿Qué le falta decir a la oración…?»;<br>• «vigilante : fábrica». |
| B5 | 10 | «COCINA : COCINERO» (ejemplo 12 de la idea 5) | En el Perú, «cocina» es también el aparato. Con esa lectura, ninguna alternativa calza, y la del lugar sigue siendo la única que pasa. | Se deja. |
| B6 | Regional | Banco: `grapadora`, `estudio : fotógrafo` | En el Perú se dice «engrapadora». «Estudio» se lee también como «estudiar». | «engrapadora : papel» y «consultorio : dentista». |
| B7 | App | Aire entre la hoja y la pregunta en Predice (pedido de la sesión) | Medido en la app a 390 px (`…/aud/aire.js`): entre el borde de la hoja y la pregunta hay unos 93 px, y casi todos son de la app:<br>• 30 px de la barra de la lupa (`.te-figbarra`, 36 px de alto, que sube 6 px sobre la figura);<br>• 12 px de separación (`gap`);<br>• una caja `.te-lectura` vacía de 24 px (`min-height:24px`), que en Predice no se esconde (`app/estilos.css` solo la oculta en Lee y en «Así se resuelve», línea 1217);<br>• otros 12 px de separación.<br>Del contenido son solo unos 15 px: el `PIE` y el `MARGEN` de `rv-soporte`, una pieza compartida que reserva aire para la lupa.<br>En Definiciones y en Tema e idea principal pasa lo mismo. | Para la app: esconder `.te-lectura:empty` también en `[data-m=predice]`. No se toca aquí. |
| B8 | App | Juegos de las ideas 1 a 4 (lector A) | «Dejar», «así» y «sin elegir» salen ya marcados en todos los pares, y el lector no supo si ya había elegido. Es el botón del valor inicial que pinta la app. | Para la app (o para Gerson). |
| B9 | Diseño | Ejemplos con cartel, mural o mensaje (lector B: tarjetas 02, 04, 05, 07, 08, 11 y 14) | En los niveles 1 y 2, el soporte casi no ayuda: «son adorno». Es la decisión del objeto en la primera pantalla de verbal (contrato, punto 1, Gerson 17 nov). | Para Gerson. |
| B10 | 13 | Juego de la idea 5: columna «Trabaja» (lector B) | «hospital : médico → no» se lee como «el médico no trabaja en el hospital». La consigna dice que la columna habla del primero. «1.º trabaja» no cabe en la columna de 48 px. | Se deja. Si Gerson quiere otra cosa: ensanchar la columna en `TABLA5.anchos`. |

## Lo que está bien y hay que copiar al molde

- **Un mundo chico en el código para cada juego** (`cumpleCarp`, `listo2`, `cumple3`, `medir5`), con misiones de una sola
  combinación en toda la grilla y juegos que se juegan tocando la hoja.
- **El banco de la práctica con su relación por par** y un generador que lanza un error si dos alternativas tienen la
  relación del par base o si dos incorrectas comparten código. Así, 400 semillas dan 0 preguntas con dos correctas.
- **`completar`**, que pone en Datos el nombre de cada falla que el resuelto usa (la lección M8 de Definiciones), con su
  tope de 6 líneas.
- **El largo de la correcta controlado en todas partes** (`elegir` del generador y la prueba propia): 0 fallas de la
  regla 10 de largo en 505 preguntas.
- **Ninguna alternativa de una hoja de examen repite una palabra del par base**: elimina la pista que tenía la versión
  0.2.0.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **La posición de la correcta también se reparte en las predicciones y en las listas del enunciado** (M3), no solo en el nivel 3 y en «Ahora tú». | Sí: el mismo cálculo de `letra-repartida`, sobre `predice.opciones` (orden fijo) y sobre las listas ««x», «y» o «z»». |
| **«Al revés» es el revés exacto** (M4): dada vuelta, la incorrecta tiene la categoría del par base. | Parcial: la prueba propia lo mira con los verbos en infinitivo; los sustantivos (vehículo o lugar) siguen a mano. |
| **Una glosa de Datos no nombra la otra palabra de la correcta** (M7). | Sí: la prueba M5 de `analogias.test.js` y su gemela del generador. Sirve para todo verbal (definiciones, sinónimos). |
| **La voz por defecto de un curso no vale para todas sus unidades** (M8): en verbal, «Otro texto» no sirve donde no hay texto. | Sí: si la unidad no tiene `texto` en sus figuras, `ahoraTu.voz` es obligatoria. |
| **Lista de palabras con dos lecturas en el Perú** (temblor, helado, fresco, metro, pasaje, cocina, rico, vivo, despierto…): avisar cuando entran en un par sin contexto. | Parcial: búsqueda de texto con una lista del curso, como aviso. |
| **Los Datos de una predicción dan lo necesario para descartar las incorrectas** (A1) cuando el juego no mostró su criterio. | No: es juicio del auditor. Lo que sí se puede pedir es que cada código de las incorrectas de Predice salga en el juego o en los Datos. |

## Correcciones (19 nov)

Hechas por el mismo auditor (paso 3 del cierre delegado), junto con lo que señalaron los dos lectores en frío (ver
`rutinas/frio/razonamiento-verbal.analogias.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.3.1. Las copias de
antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-an/antes/`.

**Pruebas nuevas.**
- **Teoría**: 8 al final de `analogias.test.js` (A1 y M1 a M7). Con la versión de antes fallan las 8; con la nueva
  pasan 61 de 61. Se comprobó con el arnés `…/aud/corre-viejo.test.js`.
- **Generador**: 4 al final de `generador.test.js`:
  - sin pares de dos lecturas;
  - glosas que no regalan;
  - RV16 que es el revés exacto;
  - nombres de clase, parte y grupo.

  Con el generador de antes fallan las 4; con el nuevo pasan 33 de 33. Se comprobó con `…/aud/corre-gen-viejo.test.js`.

**Resultado.**
- **Validador** con `calidad: 2` simulada y 200 semillas: 0 problemas, 0 pendientes.
- **Pruebas comunes**:
  - `contenido/teoria/teoria.test.js` y las pruebas de la unidad y del generador: 258 de 258;
  - `papel-reglas.test.js` y `alternativas.test.js`: 146 de 146;
  - `papel-generador.js --revisar`: al día.
- **`ecuaciones-ancho.js`**: todo cabe.
- **`revisa.js` sobre la versión nueva**: 0 fallas en 105 preguntas y 400 semillas.
  - Predicciones en C, B, B, D, C.
  - Listas 8, 9 y 8.
  - Nivel 3: cinco de cada letra.
  - Práctica: A 94, B 84, C 100, D 84 y E 38 (la E solo existe en las de cinco alternativas).
  - Quedan 27 avisos: incorrectas «del mismo tema» con otra relación (B1) y «cocina» (B5).
- **No se corrió `npm test` completo**, porque hay otras sesiones trabajando. Sí se corrió `npm run catalogo`: de esta
  unidad cambia `app/datos/glosario/razonamiento-verbal.json`.
- **Capturas de después**: 110, sin errores de página ni capturas repetidas (md5), en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-an/despues/`. Se miraron
  Predice de la idea 2, el juego de las ideas 3 y 5 y la tarjeta «Hablar y gritar».

| # | Qué se hizo |
|---|---|
| A1 | Predice de la idea 2 trae `datos` con la prueba de clase y la de parte («con piezas de otro tipo»), sin grupo. La correcta pasa a la B; Mira tacha A, C y D. El `siFuera` de «hoja : rama» dice «el bosque no tiene piezas de otro tipo: son puros árboles». La regla dice «Grupo: el bosque está hecho solo de muchos árboles». Prueba A1. |
| M1 | La oración puente se arma con «unión» y «rasgo». Cambió en estos lugares:<br>• Lee 2 de la idea 1 y su regla;<br>• el ejemplo del mecánico;<br>• Lee 1 a 3 de la idea 5, la ficha, la leyenda y el control de su juego, y su regla.<br>Los Datos de la idea 2 (teoría y práctica) dicen «Clase (género y especie)», «Parte (parte y todo)» y «Grupo (elemento y conjunto)». Los resueltos y los ejemplos dicen «es de clase», «es de parte» y «es de grupo». El taller dice «Clase» y «Parte». Prueba M1 y la última del generador. |
| M2 | D_PARTE: «la primera es una pieza que, con piezas de otro tipo, forma la segunda». D_GRUPO: «un conjunto hecho solo de muchos iguales a la primera». Las definiciones del glosario van igual. Pares nuevos:<br>• «tapa : libro» con «hélice : ventilador»;<br>• «pantalla : celular» en lugar de «hoja : cuaderno»;<br>• «asa : taza» en lugar de «diente : peine».<br>Prueba M4 (lista de pares). |
| M3 | Las predicciones de las ideas 2 y 4 van en B y D, con su Mira y su `revelar`. Las 25 listas se repartieron 8, 9 y 8 (`orden` de cada enunciado). Prueba M2. |
| M4 | «chompa : tejedora», «camión : camionero», «oficina : jefe» y «plantas : jardinero». En el banco va «niños : niñera», con la relación `CUIDAP` (y `VUELTA` en el generador y en su prueba). `casos.json`: el caso caso-14 se recalculó con el léxico propio y dio los mismos códigos. Pruebas M3 y la tercera del generador. |
| M5 | Pares cambiados:<br>• teoría: «ARDIENTE : CALIENTE» (con «tibio : hirviendo» y «fogón : cocina de leña»), «CICATRIZ : HERIDA», «fácil : difícil», «fuerte : callado», «ASUSTADO : TEMEROSO» y «medir : regla»;<br>• banco: «tibio : ardiente» (el ítem `fresco` pasa a llamarse `tibio`), «llanto : dolor» y «regla : longitud».<br>`casos.json`: el caso caso-17 se recalculó aparte. Prueba M4 y la primera del generador. |
| M6 | «tocar : golpear», sin glosa. El resuelto dice «golpear es tocar con mucha más fuerza». |
| M7 | Glosas nuevas del chichón, el camélido (teoría y banco), el olluco y la caravana. Prueba M5 y la segunda del generador. |
| M8 | Cada `ahoraTu` tiene su `voz` («Otra hoja. …»). Prueba M6. |
| M9 | Las etiquetas «Ficha 2» a «Ficha 6». Prueba M7. |
| B1–B4, B6 | Hechos, como dice la tabla. La columna «1.º trabaja» se probó y se deshizo: no cabe. |
| B5, B7–B10 | No se tocaron (ver la tabla). |

### Pendiente

- **De `app/`**: hay tres cosas.
  - El aire de Predice (B7): esconder `.te-lectura:empty` también en Predice.
  - Los botones del valor inicial marcados (B8).
  - Las voces de acierto y error de verbal («Bien sustentado en el texto», «Volvamos a las palabras exactas») hablan de
    un texto. La unidad no puede cambiarlas, porque no hay un campo para eso.
- **Para Gerson**: hay dos.
  - Los carteles y murales de los ejemplos de nivel 1 y 2 (B9).
  - La columna «Trabaja» del juego de la idea 5 (B10).
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad, M3, M4, M5, M7 y M8 ya
  son prueba propia.
- **Decidido por la sesión, Gerson revisa después**:
  - **«Unión» y «rasgo»** para los dos pedazos de la oración puente. Antes eran «clase» y «rasgo», en paralelo con
    Definiciones, pero chocaba con la «clase» de la idea 2. Se descartó cambiar «clase» en la idea 2, porque es la
    palabra de Definiciones (género próximo).
  - **Los tres nombres de la idea 2 se juntan en uno**, con el del catálogo entre paréntesis: «Clase (género y
    especie)». El glosario y los temas del catálogo conservan «género y especie», «parte y todo» y «elemento y
    conjunto».
  - **Predice de la idea 2 lleva Datos con clase y parte, no con grupo.** El grupo sigue siendo lo nuevo que se
    predice. Se descartó cambiar la incorrecta «hoja : rama», que es la confusión de RVA6 que la propuesta quería
    medir.
