# Propuesta: «Cohesión y coherencia textual» (`razonamiento-verbal.cohesion-y-coherencia`)

26 nov 2026 · Etapa 9 del plan de calidad · Segunda unidad de la rama «Oraciones y orden», después de Conectores
(`calidad: 2`, Etapa 8). Encargo: `docs/metodo/unidad/etapa-delegada.md` (criterio delegado: nada espera el visto bueno
de Gerson; la última sección dice qué se decidió y qué se descartó). Formato y profundidad: `docs/etapa8/propuesta-verbal.md`.
Modelo de unidad terminada: `conectores.js`, con su prueba propia y su práctica (`plantillas/conectores/`).

Leído: CLAUDE.md, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3,
`reglas-validador.md`), las decisiones de las etapas 2 a 8, `docs/teoria.md` (4e a 4j y §5), la teoría actual de la unidad
(v0.2.0, entera), su ficha del catálogo, el temario (`docs/temario-completo.md`, §7 de verbal), el informe de códigos del
curso (RV9, RV27, RV28), las preguntas de San Marcos (`docs/datos/admision-unmsm.csv`), el glosario de todo el curso, la
investigación de ChatGPT de esta unidad (`docs/investigacion/etapa9/razonamiento-verbal.cohesion-y-coherencia.md`, la
larga, por secciones, y la breve para contrastar), Conectores (mapa, idea 1 en código, glosario, laboratorio, prueba
propia y su propuesta) y las unidades que siguen en la rama (Plan de redacción y Eliminación de oraciones), para no
adelantarlas.

**Lo que pregunta la admisión, en corto.**
- **San Marcos: ninguna pregunta propia.** En `admision-unmsm.csv` no hay ninguna fila de esta unidad: el examen trabaja
  la coherencia dentro de la lectura (compatibilidad, referente de una palabra en el texto), y eso lo cubren
  Compatibilidad y Sentido contextual.
- **UNI.** La investigación contó, en los solucionarios institucionales 2019-2 y 2021-1, 6 preguntas de inclusión de
  enunciado y 14 de orden (plan de redacción y ordenar). No están en `fuentes/examenes/` (vacío): el formato de inclusión
  («un texto de cuatro o cinco oraciones con un espacio y cinco alternativas») va **como hipótesis**, igual que en
  Conectores. El orden y la eliminación tienen su unidad (Plan de redacción, Eliminación de oraciones): aquí no entran.
- **CEPRE-UNI 2023-2** (según la investigación): repetición, sustitución, elipsis, anáfora, catáfora, conectores,
  progresión e inclusión. Coincide con los temas de la ficha.
- **Errores con respaldo:** RV27 (el pronombre al último sustantivo), RV28 (lo viejo y lo nuevo), RV9 (la incompatibilidad
  implícita no se ve). La investigación trae errores de escritura documentados (Llanos y cols. 2006, Ferreira 2025,
  Bolívar y cols. 2010) que no prueban cómo se eligen alternativas, y nueve hipótesis de lectura (H01 a H09). Las uso como
  hipótesis con códigos propios RVK1 a RVK13 (sección 8).

Lo que tomo de la investigación: la contradicción como primera idea (coinciden la larga y la breve), la catáfora que
recoge una indicación entera («pidió esto: …»), la elipsis de un verbo («Ana lleva cuentos; Luis, revistas»), la
predicción de inclusión con «sin embargo» que pide una expectativa atribuida («pensó que»), y la regla de cinco
condiciones de la inclusión, apretada en tres pruebas. Lo que descarto y por qué: sus ideas 3 (conectores: ya es la unidad
anterior), 4 (ordenar: es Plan de redacción) y 5 (pertinencia: es Eliminación de oraciones); los «dados de historias» y
la redacción libre (no se pueden comprobar con un motor); las cuatro alternativas en todas las predicciones (la app usa
cuatro en Predice y cinco en el nivel de examen, como Conectores).

---

## 0. Diagnóstico de la teoría actual (v0.2.0) contra el contrato

1. **Faltan los campos del contrato:** sin `calidad`, sin Ejemplos, sin `lee`, `mision`, `leyenda`, `aprendizaje`,
   `actividad`, `pregunta` ni `resuelve`; el glosario trae un ejemplo por término y ningún `simple`; ningún ejercicio trae
   `datos`.
2. **Punto 1: la primera pantalla es una tarjeta «Texto» sin soporte** (pieza `rv-texto`): no se sabe quién escribe ni
   para quién.
3. **Punto 2: los juegos no tienen misión** («Elige un pronombre del texto y únelo con un referente» describe botones).
4. **Punto 5, colores.** Lo nuevo va en verde (`d`) y lo que choca en carmín (`h`): verde y naranja juntos dan 0,011 en
   protanopía y el carmín es de ángulos. No es la paleta de lectura del curso (turquesa, naranja, violeta).
5. **Códigos que chocan.** Usa RVC1 a RVC3 con otro sentido: desde la Etapa 8 son de Conectores.
6. **Predicciones flojas.** La de la idea 1 («La profesora entró al aula. Lo dijo claro: …») tiene un «lo» forzado; la de
   la idea 3 la responde el juego (el juego ya muestra qué oración retoma a quién).
7. **Falta la idea de inclusión de enunciado**, que es la forma de examen de la UNI y un tema de la ficha; hoy va dentro
   del juego de la progresión.
8. **El orden.** La no contradicción va al final y la unidad nunca dice qué es la coherencia antes de usarla.
9. **La fuente de la historia** es el diccionario del CVC con el título «Matriz de teoría…» (la misma falla que
   corrigieron Definiciones, Analogías, Sentido contextual y Conectores).
10. **Práctica:** solo `lectura-verbal`, sin ningún ejercicio por idea.

Se queda: los cuatro `id` de idea (guardan el avance), el pronombre que no va con el sustantivo más cercano, la vicuña de
la idea 3, los caminos del inca de la idea 4, la mesa «Concordar no basta» (los vecinos, el costal y el burro) y la
historia de la lingüística del texto (con su fuente arreglada).

---

## 1. Las ideas en orden

Cinco. Los cuatro `id` de hoy se quedan; uno es nuevo. La no contradicción pasa al primer lugar: presenta la coherencia,
que las otras cuatro usan.

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí |
| --- | --- | --- | --- | --- |
| 1 | `no-contradiccion` | **Un texto que no se contradice** | Un texto se contradice si afirma y niega lo mismo, de lo mismo y a la vez; si cambia el tiempo, la persona o la parte, no. | Presenta coherencia y cohesión; es la prueba final de toda inclusión (idea 5). |
| 2 | `referente` | **A quién se refiere** | El referente de un pronombre concuerda con él y da sentido; no siempre es el más cercano, y puede venir después o ser una idea entera. | La primera señal de cohesión. |
| 3 | `repetir-sustituir-callar` | **Repetir, sustituir o callar** | Lo ya dicho se vuelve a nombrar repitiéndolo, sustituyéndolo o callándolo; lo callado se recupera de lo dicho justo antes. | Las otras formas de retomar; usa el referente. |
| 4 | `conocido-y-nuevo` | **Lo conocido trae lo nuevo** | Cada oración parte de algo ya dicho y agrega algo nuevo; si parte de algo que nadie presentó, el hilo se corta. | El hilo del texto entero, hecho con lo de las ideas 2 y 3. |
| 5 | `incluir` (nueva) | **La oración que falta** | La oración que falta retoma lo de antes, prepara lo que la siguiente nombra o anuncia, y no contradice al texto. | La forma del examen: todo lo anterior en una decisión. |

`pregunta` de cada idea (Resumen): 1. «¿Cuándo dos oraciones de un texto no pueden ser verdad a la vez?» · 2. «¿Cómo
sabes a qué se refiere «lo», «ella» o «esto»?» · 3. «¿De cuántas maneras se puede volver a nombrar algo?» · 4. «¿Por qué
una oración solo se entiende después de otra?» · 5. «¿Cómo se sabe qué oración falta en un texto?».

`actividad` (≤ 16 palabras): 1. «Arreglar el horario de la puerta de la biblioteca para que no se contradiga.» · 2. «Unir
cada palabra del mensaje de la mamá con lo que nombra.» · 3. «Nombrar de nuevo a la vicuña en el folleto sin que se pierda
de quién se habla.» · 4. «Elegir cómo sigue cada oración del mural para que retome lo dicho.» · 5. «Probar cuatro
oraciones en el espacio del borrador y ver cuál encaja.»

**Límites con las unidades vecinas.**
- **Conectores** (antes, `requiere`) estrenó «conector», «contraste», «causa», «expectativa»… Aquí se usan sin volver a
  definirlas. Las palabras «pista» y «contexto» son de Sentido contextual: no se usan (como en Conectores).
- **Plan de redacción** (después) ordena oraciones: aquí nunca se ordena un texto entero. La idea 4 elige cómo sigue una
  oración, no en qué lugar va.
- **Eliminación de oraciones** (después) elimina por redundancia, impertinencia o incompatibilidad. Aquí no se elimina
  nada: la idea 1 juzga si dos oraciones pueden ser verdad a la vez y la idea 5 elige qué entra. **«Contradicción» se muda
  de su glosario a este** (la estrena la idea 1); «incompatibilidad» y «compatible» se quedan allá.
- **Compatibilidad e Inferencias** (Comprensión de lectura) estrenan «compatible», «inferencia» y «conclusión»: no se usan.

---

## 2. La primera pantalla de cada idea

| Idea | Soporte (pieza `rv-soporte`) | Quién lo escribe y para quién |
| --- | --- | --- |
| 1 | Puerta de la biblioteca municipal de Ayaviri, «Horario de atención»: «La biblioteca abre ¿?. ¿? no atiende.» | la bibliotecaria, para los lectores |
| 2 | Mensaje del grupo «Familia Quispe»: el pan en el horno, la canasta en la mesa, «lo pones», «la llevas», «ella te espera» | la mamá, para Rosa |
| 3 | Folleto de la feria de ciencias, «La vicuña»: la vicuña vive en la puna, come ichu, un guardaparque la cuida, tiene una fibra muy fina | el club de ciencias, para los visitantes |
| 4 | Periódico mural de 5.º A, «El Qhapaq Ñan»: los caminos, los chasquis, los mensajes, el Cusco | el equipo de Historia, para todo el colegio |
| 5 | Cuaderno de Elena, «Borrador para el periódico escolar»: las cajas de libros donados, el espacio, «esa revisión» | Elena, para el periódico escolar |

La palabra por la que se pregunta va en negrita y en tinta (no es una marca: no delata nada). El espacio de una oración
que falta es «¿…?», también en negrita, como en Conectores.

---

## 3. La misión de «Juega»

Cada juego es un mundo chico que el código decide (regla 1); una sola combinación de la grilla cumple la misión.

| Idea | Controles | Lo que decide el código | Misión (≤ 16 palabras) |
| --- | --- | --- | --- |
| 1 | días que abre (todos, lunes a sábado, lunes a viernes) · día que no atiende (domingo, sábado, lunes) | conjuntos de días: se contradice si el día cerrado está entre los que abre | «Arma un horario que no se contradiga y en el que se pueda ir el sábado.» |
| 2 | un control por pronombre («lo», «la», «ella»), con los candidatos del mensaje | género y número de cada palabra, y una tabla de qué tiene sentido (qué se pone en la canasta, qué se lleva, quién espera) | «Une cada pronombre del mensaje con lo que nombra.» |
| 3 | cómo se nombra a la vicuña en dos espacios (repetir, sustituir, callar) | callar recupera al último que hizo algo en la oración anterior | «Usa una sustitución y una elipsis sin que cambie de quién se habla.» |
| 4 | cómo sigue cada una de las oraciones 2, 3 y 4 (tres versiones cada una) | cada versión tiene de qué parte y qué trae; el hilo lineal pide partir de lo nuevo de la anterior | «Haz que cada oración parta de lo nuevo de la oración anterior.» |
| 5 | qué oración va en el espacio (cuatro) | cada candidata dice qué retoma y qué presenta; la oración 3 necesita «esa revisión» | «Pon en el espacio la oración que encaja con la 1 y con la 3.» |

Lectura en vivo: una oración que dice la relación («"Todos los días" incluye el domingo: abre y no atiende», «"Lo" y
"el horno" concuerdan, pero un horno no va en la canasta», «La 3 parte de "los mensajes", que nadie presentó»).

---

## 4. La predicción de cada idea

Siempre sobre algo que el juego no mostró. Datos de Predice: el significado de las palabras que se necesitan, nunca la
relación que se predice.

| Idea | Lo que el juego no mostró | Pregunta (resumida) | Correcta |
| --- | --- | --- | --- |
| 1 | un cambio en el tiempo | «Hasta marzo, la biblioteca abrió solo los sábados. Desde abril, abre también los domingos.» ¿Se contradice? | «No: cada oración habla de un tiempo distinto» |
| 2 | una palabra que anuncia lo que viene y recoge un pedido entero | «La directora pidió esto: cada sección dejará su aula limpia antes de salir.» ¿A qué se refiere «esto»? | «Al pedido que viene después de los dos puntos» |
| 3 | lo callado es un verbo | «Mi tía vende papa; mi mamá, chuño.» ¿Qué palabra se calló después de «mi mamá»? | «vende» |
| 4 | todas las oraciones parten del mismo tema | La quinua crece en el altiplano · Aguanta heladas y sequías · Sus granos se comen en sopa. ¿Se corta el hilo? | «No: todas parten de la quinua, el tema del inicio» |
| 5 | la siguiente oración anuncia, con «sin embargo», que algo esperado no pasó | Libros donados · ¿…? · «Sin embargo, al revisarlos, solo una parte necesitaba arreglo.» | «Al ver las cajas, la bibliotecaria pensó que todos estaban rotos.» |

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra** (una línea por criterio, la tabla entre la que se elige): la definición de contradicción con sus tres
condiciones, la de anáfora y catáfora, la de concordancia, la de repetición, sustitución y elipsis, la de lo conocido y
lo nuevo, y las tres pruebas de la inclusión. **No entra:** cuál es el referente, qué se calló, qué oración va (el paso
hecho), ni consejos («fíjate en…»). En la idea 1, cuando se pregunta si hay contradicción, los Datos dan la definición;
nunca «un cambio de tiempo no la produce» antes de la regla (Predice).

---

## 6. Colores y símbolos

**Paleta de lectura** (papel fijo en todo verbal, como en Conectores):

| Papel en esta unidad | Token | Trazo |
| --- | --- | --- |
| Lo que decide (la evidencia: los dos días, el referente con sentido, lo ya dicho de lo que se parte, lo que retoma la oración) | `i` turquesa | continuo |
| Lo que se prueba y falla (el referente sin sentido, la oración que corta el hilo, los dos días que chocan) | `o` naranja | a trazos |
| La respuesta (el par con sentido, la oración que encaja) | `f` violeta | punteado |
| Lo descartado | gris y raya de tinta | — |
| La palabra por la que se pregunta o el espacio «¿…?» | negrita, en tinta | — |

Sin verde ni carmín (prueba propia). Antes de responder, ninguna figura trae colores. La letra de una alternativa que
nombra un resuelto, en negrita (naranja si se descarta, violeta la correcta). La unidad no usa letras de fórmula
(`letras: {}`); las oraciones de un texto de examen se numeran 1, 2, 3 (como en `rv-soporte`), sin romanos.

---

## 7. Ejemplos resueltos (15 por idea)

Figura: el texto en su soporte, sin marcas (lo que se pregunta, en negrita). Nivel 1: una pregunta de un paso (¿se
contradice este par?, ¿a qué se refiere «lo»?, ¿qué recurso usa?). Nivel 2: elegir entre tres de una lista. Nivel 3: hoja
de simulacro con cinco alternativas A–E; en cada idea las correctas son A, B, C, D y E una vez. Solución de 1 a 4 líneas:
la evidencia en turquesa, lo que falla en naranja, la respuesta en violeta; cada alternativa incorrecta nombrada con su
letra en negrita y su motivo.

**Cómo se recalcula:** un script aparte (`<SCRATCH>/rev/revisa.js`) que no usa el código de la unidad: para cada pregunta
con alternativas, una tabla escrita leyendo el texto (qué afirma cada oración de qué, en qué tiempo y quién; qué concuerda
con qué; qué presenta y qué retoma cada candidata) decide cuál cumple, y comprueba que solo una cumple, que la correcta no
es la más larga ni la más corta ni la única escrita dentro de otra, y que la letra y el lugar se reparten.

---

## 8. Práctica, códigos y datos del mundo

**Qué existe:** `lectura-verbal` (formato lectura, compartida por doce unidades). Pasa a «Más mesas del tema» con
`rehacer` para esta unidad (cambio mínimo en `plantillas/lectura-verbal/plantilla.json`).

**Qué falta:** generador propio `plantillas/cohesion-coherencia/` (formato «predicciones»), dos tipos por idea
(`TIPOS_POR_IDEA`): uno de cuatro alternativas y uno de examen con cinco. Banco de textos propios con su tabla (qué afirma
cada oración, qué concuerda, qué presenta cada candidata); el generador elige como correcta la única que cumple según la
tabla y lanza un error si el banco no cuadra. `casos.json` calculado con un juez aparte; `papel.json` de 8 problemas con
`herramientas/papel-generador.js`.

**Códigos nuevos, como hipótesis** (informe del curso, sección «Cohesión y coherencia (códigos RVK, etapa 9)»; la
herramienta `codigos-verbal.js` lee también las filas RVK, cambio mínimo en archivo compartido). Salen de las hipótesis
H01 a H09 de la investigación y de las predicciones de esta unidad:

| Código | Error |
| --- | --- |
| RVK1 | Un conector bien puesto o una oración bien escrita se toma como prueba de que el texto tiene sentido (H05) |
| RVK2 | Se ve contradicción donde cambia el tiempo, la persona que lo dice o la parte de la que se habla |
| RVK3 | Basta que dos oraciones hablen de lo mismo para que encajen o no choquen (H01) |
| RVK4 | La referencia solo mira atrás: se rechaza la que anuncia lo que viene (H03) |
| RVK5 | El referente solo puede ser un nombre, no un pedido o un hecho entero (H04) |
| RVK6 | Se acepta un referente que concuerda aunque no tenga sentido |
| RVK7 | Lo callado se recupera con otra palabra de la oración o con otra persona |
| RVK8 | La elipsis o la sustitución se toman por una falta: «le falta el nombre» |
| RVK9 | Se exige que cada oración retome lo nuevo de la anterior: una sola forma de hilo (H06) |
| RVK10 | Se cree que volver al mismo tema corta el hilo o repite sin aportar (H08) |
| RVK11 | Se elige la oración que falta por un solo enlace, sin probar el otro lado (H07) |
| RVK12 | Se elige la oración que repite palabras del texto sin preparar lo que sigue (H08) |
| RVK13 | Lo que alguien creyó o supuso se toma como un hecho del texto (H09) |

Se usan junto con RV9, RV27 y RV28. Dos incorrectas de una misma pregunta nunca comparten código.

**Datos del mundo:** pocos y de libro: la vicuña vive en la puna y tiene una fibra muy fina (sin «la más fina del mundo»,
que pide una fuente); el Qhapaq Ñan unía los Andes y los chasquis llevaban mensajes; la quinua aguanta heladas y sequías.
Sin cifras. Los horarios, avisos y mensajes son ficción didáctica (Ayaviri, Juliaca, Puno, Lampa).

**Prueba del curso:** verbal no tiene banco en `catalogo/pruebas/` (su entrada y salida son los textos t000a y t000b): no
se agregan ítems, igual que en las cuatro unidades anteriores. **Prueba propia:**
`contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.test.js`.

---

## 9. Lo que se corrigió en Conectores (y antes) y aquí se evita desde el principio

- **Datos que dejan descartar alternativas** (Conectores, 391 de 400 semillas): los Datos dan los criterios de todas las
  alternativas, nunca uno que solo calce con la correcta.
- **La puntuación no delata** (Conectores): el espacio «¿…?» va solo como oración entera o tras coma, nunca con la
  puntuación de una sola candidata.
- **Ni «pista» ni «contexto» ni «inferencia» ni «conclusión»**; ni Ilave (se lee «llave»).
- **El turquesa es siempre lo que decide**, y lo que el resuelto pinta en turquesa es lo que la figura marca.
- **El cuaderno de Mira** no numera junto la oración y lo que se prueba; ninguna oración termina en «:», «;» o «,».
- **El lugar de la correcta se reparte** en el nivel 2, en el nivel 3 (A–E una vez por idea) y en «Así se resuelve»
  (cada letra cuatro veces en las 20 hojas).
- **Una sola respuesta:** ningún referente ambiguo, ninguna oración que «también podría» ir.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas: los cuatro `id` de hoy y una nueva (`incluir`), con la no contradicción en primer lugar.** Motivo: la
   coherencia se presenta antes de usarla, y la inclusión es la forma del examen y un tema de la ficha. Descartado: las seis
   de la investigación (tres son de Conectores, Plan de redacción y Eliminación de oraciones) y dejar la no contradicción
   al final (las otras ideas hablarían de «sentido» sin haberlo presentado).
2. **«Contradicción» se estrena aquí y sale del glosario de Eliminación de oraciones** (cambio mínimo en una unidad de mi
   curso, que aún no se rehízo). Motivo: en la rama, Cohesión va antes que Eliminación. Descartado: dejarla allá (la idea
   1 usaría una palabra definida en una unidad posterior).
3. **La predicción de la idea 1 es un cambio de tiempo, no una contradicción.** El juego ya muestra la contradicción del
   mismo día; lo nuevo es que dos tiempos no chocan. Descartado: «abre únicamente el sábado; el domingo también» (la de
   la investigación), que el juego ya responde.
4. **Códigos nuevos RVK1 a RVK13, como hipótesis.** Descartado: reutilizar RV27 y RV9 para todo (dos incorrectas de una
   pregunta compartirían código) y los RVC viejos de esta unidad (desde la Etapa 8 son de Conectores).
5. **El formato UNI de inclusión va como hipótesis**: un texto de cuatro o cinco oraciones numeradas, una con «¿…?», y
   cinco alternativas. San Marcos no pregunta la unidad por separado.
6. **La ambigüedad (dos referentes posibles) no se pregunta.** Una pregunta con «es ambiguo» como correcta choca con «una
   sola respuesta» y el examen no la usa. La regla de la idea 2 dice qué hacer si quedan dos («repetir el nombre»), sin
   ejercicio propio.
7. **Las mesas:** `referente` e `hilo` conservan su `id` con el dibujo del juego nuevo de su idea; entran `horario`
   (idea 1), `recursos` (idea 3) e `incluir` (idea 5). `concordar-no-basta` (pieza `rv-texto`) sale: el tope es de cinco
   mesas y su juego de concordar y sentido es ahora el de la idea 2 (cambió al escribir; ver §11).
8. **El avance:** las cuatro ideas que conservan su `id` cambian de Predice y la unidad suma una: entra en `REHECHAS_E6`
   de `nucleo/avance.js` (marcas `prediccionCH` y `estudiadaCH`, con su prueba).
9. **`requiere` sigue siendo Conectores.** Se usan «conector», «contraste» y «expectativa» sin definirlas.
10. **Práctica propia `plantillas/cohesion-coherencia/`**, y `lectura-verbal` a «Más mesas del tema» para esta unidad.

---

## 11. Fases 2 a 5 (26 nov): lo que cambió al escribir

La unidad quedó escrita entera (`contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.js`, versión 0.3.0, **sin**
`calidad: 2`) con su prueba propia (`cohesion-y-coherencia.test.js`) y su práctica (`plantillas/cohesion-coherencia/`).
Con `calidad: 2` simulada, el validador no encuentra nada en 200 semillas y `ecuaciones-ancho.js` dice que todo cabe.

**Las cinco ideas, en una línea cada una (título · objeto · misión · predicción):**
1. Un texto que no se contradice · puerta de la biblioteca de Ayaviri · horario sin choque que abra el sábado («de lunes a
   sábado» y «el domingo») · «Hasta marzo… solo los sábados. Desde abril… también los domingos»: no se contradice.
2. A quién se refiere · mensaje de la mamá de Rosa · unir «lo», «la» y «ella» con el pan, la canasta y la abuela · «La
   directora pidió esto: …»: el pedido entero que sigue (catáfora).
3. Repetir, sustituir o callar · folleto de la vicuña · una sustitución y una elipsis sin cambiar de quién se habla
   (callar en la 2, sustituir en la 4) · «Mi tía vende papa; mi mamá, chuño»: se calló «vende».
4. Lo conocido trae lo nuevo · periódico mural del Qhapaq Ñan · cada oración parte de lo nuevo de la anterior (caminos,
   chasquis, mensajes) · la quinua en las tres oraciones: el hilo no se corta.
5. La oración que falta · borrador de Elena · la oración que retoma las cajas y presenta «esa revisión» · «Sin embargo,
   solo una parte necesitaba arreglo»: «la bibliotecaria pensó que todos estaban rotos».

**Cambios respecto del guion (decisiones nuevas, Gerson revisa después):**
11. **Notas de la sesión sobre la idea 1** (aplicadas): Predice sin Datos (los de «hasta marzo» y «desde abril» daban la
    relación que se predice); se comprobó el largo de las alternativas (la correcta no es la más larga ni la más corta).
    Lo mismo en las otras cuatro: ninguna Predice trae Datos (lo prueba la unidad).
12. **Lección 10 con empates:** la correcta no puede ser la única más larga ni la única más corta; si empata (como en
    «La 4», «La 2», «La 5»), no delata. Así lo miden la prueba de la unidad, el generador y el juez aparte.
13. **La elipsis se marca con «[ ]»** en el juego y en Mira (con «( )» la pieza pegaba el paréntesis: «()»). No es el
    espacio de examen «¿…?».
14. **La oración 4 del folleto dice «recorre los cerros todo el día»**, algo que pueden hacer la vicuña y el
    guardaparque: así callar recupera de verdad al guardaparque (con «tiene una fibra muy fina», el sentido salvaba la
    elipsis y el juego mentía).
15. **Código nuevo RVK18** (inventar un cambio de tiempo, persona o parte que el texto no dice), para que las cinco
    alternativas de la práctica de la idea 1 tengan códigos distintos. RVK1 a RVK18 quedan en el informe del curso.
16. **«Contradicción» se mudó** del glosario de Eliminación de oraciones (borrada allá, con un comentario), como decía la
    decisión 2.
17. **Práctica:** `plantillas/cohesion-coherencia/` con 10 tipos (2 por idea), un banco de 36 ítems con sus rasgos; el
    generador decide la correcta con los rasgos y un juez aparte (en la prueba) la rehace leyendo cada texto.
