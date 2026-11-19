# Propuesta: «Precisión léxica y sentido contextual» (`razonamiento-verbal.sentido-contextual`)

19 nov 2026 · Etapa 7 del plan de calidad · Última unidad de la rama «Palabras», después de Definiciones y Analogías
(las dos con `calidad: 2`). Encargo: `docs/metodo/unidad/etapa-delegada.md` (criterio delegado: nada espera el visto bueno
de Gerson; la última sección dice qué se decidió y qué se descartó). Formato y profundidad: `docs/etapa6/propuesta-verbal.md`.
Modelos de unidad terminada: `definiciones.js`, `analogias.js` y `tema-e-idea-principal.js`, con sus auditorías y sus
lectores en frío (lo que se corrigió en Analogías está en la sección 9, para no repetirlo).

Leído: CLAUDE.md, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3 y
`reglas-validador.md`), las decisiones de las etapas 2 a 6, `docs/teoria.md` (4e a 4j y §5), la teoría actual de la unidad
(v0.2.0), su ficha del catálogo, la matriz (`docs/teoria/matriz/razonamiento-verbal.json`, unidad 3), el temario, el
informe de códigos (RV18 a RV21, RV23, RV34 y RV49), las 82 preguntas de San Marcos de esta unidad
(`docs/datos/admision-unmsm.csv`), Analogías entera (teoría, prueba, generador, auditoría y lector en frío) y el glosario
de todo el curso, para no definir dos veces un término.

**Lo que pregunta la admisión, en corto.**
- **San Marcos.** Es la unidad de palabras que más pregunta: **82 de 690 preguntas de verbal** (76 de sentido
  contextual y 6 de antonimia), todas dentro de una lectura: «En el texto, el término X connota / significa / puede
  reemplazarse por». Las trampas que registra la clasificación, de más a menos frecuentes:
  - el sentido más frecuente de la palabra y no el del texto (unas 20: «elegir el sentido físico o económico más
    frecuente del verbo», «el sentido material del sustantivo»): RV18;
  - una palabra del mismo campo que no dice lo mismo («digestión» por «ingesta», «determinar» sin el matiz normativo): RV19;
  - leer al pie de la letra una metáfora, una locución o una frase hecha (unas 12: «leer la locución de forma literal»,
    «el sentido literal de lugar físico»);
  - en antónimos, un sinónimo en vez del antónimo, o el contrario de otro rasgo (2023-II, 2024-II, 2026-I, 2026-II): RV21;
  - la valoración: un término más ofensivo o exagerado («escarnio, mofa»), dos vocablos que valoran distinto en dos
    textos (2023-II, 2024-I, 2025-I);
  - el parecido de forma («elegir el sentido de conducta por parecido de forma», 2022): RV20;
  - desde 2026, **pares**: «sinónimos (o antónimos) contextuales de un adjetivo y un verbo», con la trampa «par con un
    término correcto y otro de sentido frecuente».
  Es el modelo de nivel de los ejemplos de nivel 3, de «Así se resuelve» y del tipo de examen de la práctica. No se copia
  ningún texto (son de autores) ni la solución de la academia (regla 5).
- **UNI.** El catálogo pone la unidad en las semanas 3, 4 y 16 del sílabo CEPRE-UNI 2026-2 (precisión léxica, sinónimos
  y antónimos contextuales). En el repo no hay examen de verbal de la UNI: el formato «oración con la palabra en
  mayúsculas y cinco alternativas» va como hipótesis, igual que en Definiciones y Analogías.
- **Errores con respaldo** (informe del curso): RV18, RV19 y RV20 con un estudio de 924 alumnos alemanes de 4.º grado
  (Ludewig y otros 2023: los distractores del sentido frecuente, del mismo campo y de forma parecida hacen el ítem más
  difícil); RV21, RV23, RV49 y los nuevos RVS1 a RVS8 son hipótesis (sección 8).

---

## 0. Diagnóstico de la teoría actual (v0.2.0) contra el contrato

1. **Faltan los campos del contrato:** sin `calidad: 2`, sin Ejemplos, sin `mision`, `leyenda`, `aprendizaje`,
   `actividad`, `pregunta`, `lee` ni `resuelve`; el glosario trae un ejemplo por término y ningún `simple`; ningún
   ejercicio trae `datos`.
2. **Punto 1: la primera pantalla es una tarjeta «Oración» sin soporte** (pieza `rv-texto`): no se sabe quién escribe ni
   para quién. En Sentido contextual eso importa más que en ninguna otra unidad: quién escribe y para qué decide la
   valoración de una palabra.
3. **Punto 2: los juegos no tienen meta.** «Cambia la oración y prueba reemplazos» describe los botones.
4. **Punto 5, colores.** La valoración va en verde (`d`) y lo que no encaja en carmín (`h`): verde y naranja juntos dan
   0,011 en protanopía, y el carmín es de ángulos. No es la paleta de lectura del curso.
5. **La correcta se delata.** En la idea 1, los distractores de sentido frecuente llevan su acepción entre las palabras
   («denso de carga», «opaco de color», «bajo de estatura»): se descartan sin leer la oración. En la idea 3, «hizo algo
   en» y «pusieron cosas» son los únicos de varias palabras. En la idea 2 la correcta es la única que no repite el campo.
6. **Dos lecturas para un alumno peruano:** «el precio está alto: antónimo barato» (alto se opone a «bajo», y «caro» es
   sinónimo, pero barato no es el antónimo de «alto»: es el de «caro»), «golpe: puñete», «el líder fue firme: obstinado».
7. **Lo previo delata:** el glosario de la idea 1 dice que «cortante muestra que se habla del trato», justo la pista de
   la predicción.
8. **No hay nada con forma de examen** (texto de dos o tres oraciones, «el término X puede reemplazarse por», cinco
   alternativas), que es lo único que pregunta San Marcos.
9. **El sentido figurado no tiene idea**, y es la trampa de una de cada siete preguntas de San Marcos.
10. **La fuente de la historia no es la que dice:** el título es «Matriz de teoría…» y el enlace va al diccionario del
    CVC (la misma falla que se corrigió en Definiciones y Analogías).
11. **Práctica:** solo `lectura-verbal`, sin ningún ejercicio de esta unidad por idea.

Se queda: los cuatro `id` de idea (`acepcion`, `denota-connota`, `palabra-precisa`, `inferir-significado`), el
«inocuo» y el «efímero» como objetos de la idea de las pistas (el segundo pasa a un ejemplo), «terco y perseverante»,
«hizo un informe», la comisión que examina el reglamento antes de aprobarlo y la historia del Diccionario de autoridades.

---

## 1. Las ideas en orden

Cinco. Los cuatro `id` de hoy se quedan (guardan el avance); uno es nuevo.

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí | Qué da por sabido |
| --- | --- | --- | --- | --- | --- |
| 1 | `acepcion` | **La oración elige la acepción** | Una palabra con varias acepciones toma la que piden las pistas de su oración; su sinónimo o su antónimo es de esa acepción. | Es la prueba que usan todas las demás: la pista y el reemplazo. | Analogías: sinónimo y antónimo en un rasgo. Definiciones: rasgo. |
| 2 | `denota-connota` | **Lo que dice y cómo lo valora** | La denotación es lo que la palabra describe; la connotación, cómo lo valora. Un reemplazo conserva las dos, y quien escribe dice cuál. | Agrega la segunda condición del reemplazo: el tono. | Idea 1. |
| 3 | `palabra-precisa` | **La palabra precisa** | La palabra precisa nombra justo lo que dice la oración y no choca con ninguna de sus partes; un comodín encaja en todo y dice poco. | Es el reemplazo visto al revés: entre varias que encajan, la que dice más. | Ideas 1 y 2. |
| 4 | `sentido-figurado` (nueva) | **Literal o figurado** | Una expresión va en sentido figurado si, leída en sentido literal, no encaja con lo que habla el texto; se lee por su parecido. | La trampa de una de cada siete preguntas de San Marcos; usa la pista de la idea 1. | Idea 1; Definiciones: sentido figurado. |
| 5 | `inferir-significado` | **El significado sale de las pistas** | El significado de una palabra nueva sale de las pistas de su texto: una explicación, un ejemplo, un contraste o una consecuencia. | La palabra que el alumno no conoce: todo lo anterior junto. | Todas. |

`pregunta` de cada idea (Resumen): 1. «¿«Claro» quiere decir lo mismo en cualquier oración?» · 2. «¿«Ahorrativo» y
«tacaño» dicen lo mismo de una persona?» · 3. «¿Por qué «hizo un muro» dice menos que «construyó un muro»?» · 4. «¿Una
helada puede «golpear» a alguien?» · 5. «¿Cómo sé qué significa una palabra que nunca vi?».

`actividad` (≤ 16 palabras): 1. «Cambiar «claro» en tres notas del mural por la palabra que dice lo mismo.» · 2. «Poner en
cada mensaje del celular la palabra que valora como quiere quien escribe.» · 3. «Cambiar cada «hizo» del acta de la junta
por el verbo que nombra esa acción.» · 4. «Decidir, en el periódico mural, qué expresiones van en sentido literal y
cuáles no.» · 5. «Marcar en un aviso de la posta la oración que dice qué significa «inocuo».»

**Límites con las unidades vecinas.**
- **Analogías** (antes) enseñó sinónimos, antónimos e intensidad entre palabras sueltas, con su sentido más común. Aquí
  las palabras van dentro de una oración, y la oración elige. Por eso la unidad pide también Analogías (`requiere`).
- **Definiciones** (antes) ya definió «sentido figurado» (glosario) para decir que una comparación no define. Aquí se usa
  ese término, sin redefinirlo, y se estrena «sentido literal».
- **Conectores** (rama siguiente) se queda con el hueco que se llena por el conector (RV23 en oraciones incompletas). Aquí
  el «choca con otra parte de la oración» de la idea 3 es de la palabra precisa, no del conector.
- **Inferencias** (Comprensión de lectura) define «inferencia». Aquí se dice «deducir» y no se nombra «inferencia».
- **Texto y contexto** define «registro» y «emisor». Aquí se dice «quien escribe» y «para quién», como en todo el soporte.

---

## 2. La primera pantalla de cada idea

En verbal el objeto reconocible es el texto en su soporte, con quién lo escribe y para quién (contrato, punto 1).

| Idea | Soporte (pieza `rv-soporte`) | Quién lo escribe y para quién |
| --- | --- | --- |
| 1 | Mural del colegio, «Tres notas de la semana»: el cielo de Puno que amaneció claro, la explicación clara de la profesora y la sala pintada de un verde claro | 5.º B, para todo el colegio |
| 2 | Celular, grupo «Familia Quispe»: la abuela cuenta que su nieto guarda sus propinas; el tío se queja de que el vecino no puso ni un sol para la fiesta | la abuela y el tío, para la familia |
| 3 | Puerta del local comunal, «Acta de la reunión del sábado»: el albañil hizo el muro, doña Carmen hizo una pregunta, don Pedro hizo un hueco | la secretaria de la junta, para los vecinos de la calle Lima |
| 4 | Periódico mural, «La helada de junio»: la helada golpeó a los productores, el granizo golpeó los techos, el precio de la papa se disparó, la municipalidad tendió una mano | el equipo de prensa de 5.º B, para el colegio |
| 5 | Puerta de la posta, «Aviso»: el jarabe es inocuo; aunque un niño lo tome por error, no le hará daño; frasco azul; los lunes | la posta, para las mamás y los papás |

Para tocar una palabra dentro de su oración hace falta marcarla en su renglón. `rv-soporte` lo hace desde ahora con
**oraciones en trozos** (`frags`): cada renglón sigue siendo un solo `<text>` y cada trozo va en su `<tspan>`, con el color
y el subrayado de su marca (continuo, a trazos o punteado, con `text-decoration`; probado en Chromium). Es un bloque propio
en la pieza compartida, con su prueba; las otras unidades no cambian.

---

## 3. La misión de «Juega»

Cada misión cabe en 16 palabras, la comprueba el código y no está cumplida al abrir; **una sola combinación de toda la
grilla la cumple** (prueba propia). Los cinco juegos se juegan **tocando la oración en el soporte** (`data-toque`, Gerson,
17 nov): cada toque le cambia la palabra o la marca; los botones siguen debajo.

| Idea | Controles (toque) | Misión | Se cumple con | Lectura en vivo (≤ 12 palabras) |
| --- | --- | --- | --- | --- |
| 1 | `n1` a `n3`: claro · despejado · comprensible · suave (con el género de cada nota) | «Toca cada nota hasta que el reemplazo de «claro» diga lo mismo que la nota.» | despejado, comprensible, suave | «Despejada: habla del cielo; la nota 2 habla de entender» |
| 2 | `m1`, `m2`: ¿…? · ahorrativo · tacaño · derrochador | «Pon en cada mensaje la palabra que elogia o critica, como quiere quien escribe.» | ahorrativo (la abuela), tacaño (el tío) | «Tacaño critica, y la abuela está orgullosa de su nieto» |
| 3 | `a1` a `a3`: hizo · construyó · formuló · abrió | «Cambia cada «hizo» del acta por el verbo que nombra justo esa acción.» | construyó el muro, formuló una pregunta, abrió un hueco | «Hizo encaja en las tres oraciones: por eso dice poco» |
| 4 | `e1` a `e4`: ¿…? · literal · figurado | «Marca cada expresión en negrita como literal o figurada, tocándola en el mural.» | figurado, literal, figurado, figurado | «Una helada no tiene manos: no golpea personas en sentido literal» |
| 5 | `p2` a `p4`: ¿…? · pista · no ayuda | «Marca la oración que dice qué significa «inocuo» y tacha las que no ayudan.» | la 2 pista, la 3 y la 4 tachadas | «El frasco azul no dice nada de «inocuo»» |

**Regla 1 en verbal:** lo que conserva o cambia lo que dice la oración, lo que se lee literal o figurado y lo que es pista
lo calcula el código con un mundo chico (cada nota con su acepción y el reemplazo de cada acepción; cada mensaje con la
valoración de quien escribe y la de cada palabra; cada objeto del acta con el verbo que lo nombra; cada expresión con su
lectura; cada oración del aviso con lo que dice de la palabra).

---

## 4. La predicción de cada idea

Opciones sin justificación; dos incorrectas de una misma predicción nunca comparten código; la correcta no es la más
larga ni la más corta; ninguna repite lo que el juego ya mostró. Sin letras en la figura (la app baraja).

| Idea | Pregunta | Correcta | Incorrectas (código) | Qué trae de nuevo |
| --- | --- | --- | --- | --- |
| 1 | En la nota 2 («La explicación fue clara: todos entendieron a la primera»), ¿qué palabra dice lo contrario de «clara»? | confusa | nublada (RV18, el contrario en el cielo) · sencilla (RVS1, sinónimo) · corta (RV21, otro rasgo) | El antónimo: el juego solo tenía sinónimos. |
| 2 | Mensaje de la enfermera: «Su hijo está ___ para su edad: pesa menos de lo esperado». ¿Qué palabra describe lo mismo sin elogiar ni criticar? | delgado | esbelto (RVS2, elogia) · esquelético (RVS3, exagera la crítica) · débil (RV19, describe otra cosa) | La palabra neutra: el juego solo tenía elogio y crítica. |
| 3 | Mensaje de la APAFA: «La comisión ___ el reglamento con cuidado antes de aprobarlo». ¿Qué verbo es el más preciso? | examinó | aprobó (RV23, choca con «antes de aprobarlo») · vio (RVS4, comodín) · imprimió (RV19, otra acción del mismo tema) | Choca con otra parte de la oración, no con su objeto. |
| 4 | En el mismo periódico mural: «La subida del pasaje fue un balde de agua fría para los estudiantes». ¿Qué quiere decir? | una noticia que desanima | un baño con agua muy helada (RVS5, literal) · una broma de mal gusto (RVS7, idea propia) · una sorpresa muy agradable (RVS2, otra valoración) | La frase hecha: el juego solo tenía palabras. |
| 5 | Mensaje de Rosa: «Mi primo Teo es locuaz; en cambio, su hermano casi no habla». ¿Qué significa «locuaz»? | que conversa mucho | que casi no habla (RVS8, el contraste leído al revés) · que está medio loco (RV20, parecido de forma) · que es muy amable (RVS7, idea propia) | La pista de contraste: el juego solo tenía la explicación. |

`datos` de Predice: ninguno (las palabras son comunes); nunca la acepción, la valoración ni la lectura que se predice.

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra en `datos`** (una línea por dato, ≤ 22 palabras): el criterio de la idea, el nombre de cada falla que el resuelto
usa (`completar`, como en Analogías: lección M8 de Definiciones) y la glosa de una palabra poco común **que no nombre la
correcta** (lección M7 de Analogías).

| Idea | Líneas (las mismas en teoría y práctica) |
| --- | --- |
| 1 | Acepción · Pista · Prueba del reemplazo · Sinónimo en contexto · Antónimo en contexto · y las fallas: Otra acepción, Mismo campo, Parecido de forma, Otro rasgo, Sinónimo por antónimo |
| 2 | Denotación · Connotación · Quien escribe · y las fallas: Otra valoración, Otro grado, Otra cosa |
| 3 | Palabra precisa · Comodín · y las fallas: Choca, Mismo campo |
| 4 | Sentido literal · Sentido figurado · Frase hecha (desde «Mira») · y las fallas: Lectura literal, Idea propia |
| 5 | Pista (explicación, ejemplo, contraste o consecuencia) · Detalle cercano · Idea propia · Contraste |

**No se da:** la acepción que usa el texto, la valoración que busca quien escribe, si una expresión es figurada, el
significado de la palabra que se pregunta, atajos («descarta la más rara», «la correcta es la menos frecuente») ni
consejos.

---

## 6. Colores y símbolos

### Paleta de lectura (papel fijo en todo verbal)

| Papel en esta unidad | Token | Trazo | Cuándo se ve |
| --- | --- | --- | --- |
| La pista del texto (evidencia) | `i` turquesa | continuo | Juego, «Mira», «Así se resuelve» y solución |
| El reemplazo o la lectura que se prueba y falla, con su motivo (distractor) | `o` naranja | a trazos | Juego, «Mira» y resuelto |
| El reemplazo o la lectura que conserva lo que dice el texto, y la respuesta | `f` violeta | punteado | Con la misión cumplida, en «revelar», en el último paso y en la respuesta |
| Lo descartado | gris (tenue) y raya de tinta | — | Siempre |
| La palabra por la que se pregunta | negrita, en tinta | — | Siempre (no es una marca: no delata nada) |

- Sin verde ni carmín (prueba propia). La letra de una alternativa en negrita: naranja si se descarta, violeta si es la
  correcta.
- Antes de responder, ninguna figura trae colores ni marcas (la palabra va solo en negrita).

### Símbolos

La unidad no usa letras de fórmula (`letras: {}`). Lo que hay que leer en la figura va en la leyenda: la negrita (la
palabra que se prueba), el turquesa (la pista), el naranja y el violeta (el reemplazo que falla o que sirve), lo tachado.

---

## 7. Ejemplos resueltos (15 por idea)

**Forma.** Figura: el texto en su soporte (aviso, mensaje, cuaderno, acta, periódico mural), sin marcas, con la palabra en
negrita. Nivel 1: una pregunta de un paso (qué acepción usa la palabra, si un reemplazo sirve). Nivel 2: elegir entre
tres palabras de una lista, con dos fallas distintas (el lugar de la correcta repartido en la unidad). Nivel 3: hoja de
simulacro con un texto de dos o tres oraciones, como en San Marcos, y cinco alternativas A–E; en cada idea las correctas
son A, B, C, D y E una vez. Solución de 1 a 4 líneas: la pista en turquesa, lo que se descarta en naranja, la respuesta
en violeta; cada alternativa incorrecta nombrada con su letra en negrita y su motivo.

**Cómo se recalcula en verbal** (lo que en física son las cuentas): un script aparte (`<SCRATCH>/revisa.js`), con un
léxico propio escrito sin mirar la unidad: para cada palabra, sus acepciones, y para cada acepción sus sinónimos,
antónimos, palabras del mismo campo y parónimos; para cada palabra valorativa, su denotación y su valoración; para cada
expresión, su lectura literal y la figurada. Con eso comprueba, alternativa por alternativa, que **solo una** cumple lo
que pide la pregunta en la acepción del texto, que cada distractor falla por el motivo que dice su explicación, que la
correcta no es la más larga ni la más corta ni la única escrita dentro de otra, y que la letra y el lugar se reparten.

---

## 8. Práctica, códigos y datos del mundo

**Qué existe:** `lectura-verbal` (textos largos con preguntas de lectura). Pasa a «Más mesas del tema» con `rehacer`
(cambio mínimo en `plantillas/lectura-verbal/plantilla.json`, compartido).

**Qué falta:** generador propio `plantillas/sentido-contextual/` (formato «predicciones», como `analogias`), dos tipos por
idea (`TIPOS_POR_IDEA`): el de nivel 2 con cuatro alternativas y el de examen con cinco. Un banco de oraciones, cada una
con su palabra, la acepción que pide su pista y cada alternativa con una etiqueta (la acepción del texto, otra acepción,
mismo campo, forma parecida, otro rasgo, otra valoración, otro grado, comodín, lectura literal, idea propia, contraste al
revés). El generador elige como correcta la única con la etiqueta buena y arma el código y la explicación de cada
incorrecta con su etiqueta; si el banco no cuadra, lanza un error. `casos.json` calculado con un léxico aparte;
`papel.json` de 8 problemas con `herramientas/papel-generador.js`.

**Códigos nuevos, como hipótesis** (informe del curso, sección «Sentido contextual (códigos RVS, etapa 7)»; la
herramienta `codigos-verbal.js` lee ahora también las filas RVS, cambio mínimo en archivo compartido):

| Código | Error |
| --- | --- |
| RVS1 | Se elige un sinónimo cuando se pide el antónimo (o al revés) |
| RVS2 | El reemplazo describe lo mismo pero cambia la valoración (elogia donde critica, o al revés) |
| RVS3 | El reemplazo conserva la valoración pero cambia su grado (exagera o suaviza) |
| RVS4 | Se elige un comodín: encaja en todo, pero no nombra lo que dice la oración |
| RVS5 | Se lee en sentido literal una expresión figurada |
| RVS6 | Se lee en sentido figurado una expresión que va en sentido literal |
| RVS7 | Se toma por significado una idea propia o una asociación sin apoyo en el texto |
| RVS8 | Se lee la pista de contraste como si confirmara: se da a la palabra el sentido de lo que se le opone |

Se usan junto con RV18, RV19, RV20, RV21 y RV23. Dos incorrectas de una misma pregunta nunca comparten código.

**Datos del mundo:** ninguno con cifra; los textos son propios y de todos los días (Puno, Ilave, Chucuito, una posta,
una junta vecinal). La historia (el Diccionario de autoridades, 1726–1739) va con la fuente que cita la matriz (ASALE).
**Prueba del curso:** verbal no tiene banco en `catalogo/pruebas/` (su entrada y salida son los textos t000a y t000b):
no se agregan ítems, igual que en Definiciones y Analogías. **Prueba propia de la unidad:**
`contenido/teoria/razonamiento-verbal/sentido-contextual.test.js`.

---

## 9. Lo que se corrigió en Analogías y aquí se evita desde el principio

- **Un solo nombre por relación** (M1): «acepción» (nunca «sentido» para lo mismo; «sentido literal» y «sentido
  figurado» son otra cosa y se dicen así), «pista» (nunca «indicio» ni «clave»), «prueba del reemplazo», «connotación»
  (nunca «valoración» como término), «comodín», «palabra precisa».
- **La posición de la correcta se reparte también en las listas de nivel 2** (M3), no solo en el nivel 3.
- **Ninguna glosa de Datos nombra la correcta** (M7).
- **Palabras de dos lecturas en el Perú** (M5): fuera «caliente» (enojado), «vivo» (astuto), «fresco» (descarado),
  «bravo», «pesado» como trampa, «rico», «jalar», «chancar», «palta», «piña». Una oración con dos acepciones posibles no
  entra.
- **`ahoraTu.voz` propia** en las cinco ideas (M8): la voz del curso dice «Otro texto», y aquí sí hay texto, pero corto.
- **Los botones y la figura numeran igual** (M9): «Nota 1» es la oración 1 del mural.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con una nueva (`sentido-figurado`) y los cuatro `id` de hoy conservados.** Motivo: la lectura literal de
   una metáfora o una frase hecha es la trampa de una de cada siete preguntas de San Marcos y no tenía idea. Descartado:
   una idea propia para el antónimo en contexto (seis ideas): va como predicción de la idea 1 y en su «Ahora tú», porque
   es la misma prueba de la acepción.
2. **La unidad pide también Analogías** (`requiere`). Motivo: usa «sinónimo» y «antónimo», que estrena Analogías, y la
   rama los pone en ese orden. Descartado: definirlos otra vez (el glosario es uno por curso).
3. **`rv-soporte` con oraciones en trozos** (bloque propio en la pieza compartida, con su prueba): la palabra y la pista
   se marcan dentro de su renglón con `<tspan>` y `text-decoration`. Descartado: volver a `rv-texto` (sin soporte, el
   objeto del contrato) o medir dónde cae cada palabra (la medida del kit erra hasta un 30 % en palabras sueltas).
4. **Códigos nuevos RVS1 a RVS8, como hipótesis**, en el informe y en `codigos.json`. Los viejos RVL1 a RVL4 (citados en la
   cabecera de la v0.2.0, nunca registrados) salen. Descartado: usar RV19 para toda «otra cosa».
5. **«Deducir» y no «inferir»** en la idea 5: «inferencia» la estrena Inferencias, más adelante en el árbol.
6. **El formato UNI va como hipótesis**; el de San Marcos (texto de dos o tres oraciones y «el término X puede
   reemplazarse por») es el modelo del nivel 3.
7. **La palabra por la que se pregunta va en negrita y en tinta** en todas las figuras, también antes de responder (como
   en el examen, que la nombra en mayúsculas en la pregunta). No es una marca de la paleta.
8. **Las mesas viejas salen** («Fría y dura», «Del elogio a la crítica» y «Las pistas de inocuo», con verde y carmín) y
   entran las mesas de los cinco juegos nuevos, con sus retos.
9. **Práctica propia `plantillas/sentido-contextual/`**, y `lectura-verbal` a «Más mesas del tema» (`rehacer`) para esta
   unidad.
10. **El avance:** las cuatro ideas que conservan su `id` cambian de Predice, y la unidad suma una idea: entra en
    `REHECHAS_E6` de `nucleo/avance.js` (marcas `prediccionSC` y `estudiadaSC`, con su prueba).

---

## 11. Fases 2 a 5 (19 nov): lo que cambió al escribir

La unidad quedó escrita entera (`contenido/teoria/razonamiento-verbal/sentido-contextual.js`, versión 0.3.0, **sin**
`calidad: 2`) con su prueba propia (`sentido-contextual.test.js`, 50 pruebas) y su práctica (`plantillas/sentido-contextual/`).

**Las cinco ideas, en una línea cada una (título · objeto · misión · predicción):**
1. La oración elige la acepción · mural del colegio con tres notas que usan «claro» · tocar cada nota hasta que el
   reemplazo diga lo mismo (despejado, comprensible, pálido) · antónimo de «clara» en «todos entendieron»: «confusa».
2. Lo que dice y cómo valora · celular, grupo «Familia Quispe» (la abuela y el tío) · poner en cada mensaje la palabra que
   valora como quiere quien escribe (ahorrativo, tacaño) · mensaje de la enfermera: la palabra neutra, «delgado».
3. La palabra precisa · acta de la junta en la puerta del local comunal · cambiar cada «hizo» por el verbo de su objeto
   (construyó, formuló, abrió) · «la comisión ___ el reglamento con cuidado antes de aprobarlo»: «examinó».
4. Literal o figurado · periódico mural «La helada de junio» · marcar cada expresión como literal o figurada (el mismo
   «golpeó», figurado con la helada y literal con el granizo) · «un balde de agua fría»: «una noticia que desanima».
5. El significado sale de las pistas · aviso en la puerta de la posta de Chucuito · marcar la oración que dice qué es
   «inocuo» y tachar las que no ayudan · «Teo es locuaz; en cambio, su hermano casi no habla»: «que conversa mucho».

**Cambios respecto del guion (decisiones nuevas, Gerson revisa después):**
11. **Nota 3 del juego de la idea 1: «pálido» en lugar de «suave»** (nota de la sesión): «suave» también vale para una
    explicación; «pálido» es inequívoco para un color. El léxico aparte comprueba que cada nota tiene un solo reemplazo.
12. **Títulos de seis palabras:** la idea 2 pasa a «Lo que dice y cómo valora» (el validador cuenta siete en «… y cómo lo
    valora») y la idea 4 se llama «Literal o figurado».
13. **Las oraciones en trozos de `rv-soporte` no se estiran** (sin `textLength`): con él, Chromium partía el subrayado de
    una pista en pedazos y se leía como a trazos. Probado en capturas.
14. **La ecuación de la regla de la idea 1 va sin llave** («pista → acepción → reemplazo»; nota de la sesión: a 390 px la
    flecha quedaba colgando). `ecuaciones-ancho.js`: todo cabe (50 pantallas, 347 renglones).
15. **Mesas del laboratorio:** las cinco de los juegos nuevos, con sus retos (`mural-claro`, `dos-mensajes`, `acta-junta`,
    `periodico-helada` y `pistas`, que conserva su id). Salen «Fría y dura» y «Del elogio a la crítica».
16. **Práctica:** `plantillas/sentido-contextual/` con 10 tipos (2 por idea; nivel 2 con cuatro alternativas y nivel 3 con
    cinco), un banco de 30 oraciones con la etiqueta de cada alternativa y 4 incorrectas de código distinto por ítem; 8
    problemas de papel. Un tema nuevo en el catálogo: «Sentido literal y figurado».

**Lo que se comprobó aparte:** `<SCRATCH>/rev/revisa.js` (léxico propio, `<SCRATCH>/rev/lexico.js`, escrito pregunta por
pregunta) revisa las 105 preguntas con alternativas de la teoría (5 predicciones, 30 «Ahora tú», 20 «Así se resuelve»,
25 hojas de nivel 3 y 25 listas de nivel 2): una sola correcta en la acepción, la valoración o la lectura del texto; cada
distractor explicado por su motivo; la correcta ni la más larga ni la más corta ni escrita dentro de otra; letras del
nivel 3 A–E una vez por idea; lugar en las listas 9, 8 y 8. Resultado final: 0 fallas (al principio, 75: 21 listas con
la correcta en un extremo de largo y explicaciones que no decían su motivo con el nombre del curso).
`<SCRATCH>/gen/casos-gen.js` (otro léxico, para el banco de la práctica) arma `casos.json` y revisa los 30 ítems: 0 fallas.
