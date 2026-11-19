# Auditoría de contenido: «Precisión léxica y sentido contextual» (razonamiento-verbal.sentido-contextual)

19 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Vara: `docs/molde-unidad.md` §10 y la fila de verbal de §11. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en las etapas 5 y 6: «Lo que encontraron los
auditores» de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa7/propuesta-verbal.md`. Lo que vieron los
dos lectores en frío está en `rutinas/frio/razonamiento-verbal.sentido-contextual.md`; aquí se cita cuando el código lo
confirma.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-verbal/sentido-contextual.js` (v0.3.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Así se resuelve» (4 hojas por idea) y «Ahora tú» (6 casos por idea; la app baraja las opciones);
  - el glosario (12 términos), la historia con su fuente y las 5 mesas.
- La práctica `plantillas/sentido-contextual/`: 10 tipos (2 por idea), banco de 30 ítems, `casos.json` (20) y
  `papel.json` (8).
- La pieza compartida `nucleo/kit/piezas/rv-soporte.js` (el bloque de la etapa 7: oraciones en trozos).
- La app a 390 px con `--entera`, contra un servidor propio en el puerto 4431: 35 momentos y 75 ejemplos, sin errores de
  página y sin capturas repetidas (md5; solo las 15 copias de `lector/`).

**Cuentas (en verbal: cada pregunta con alternativas, rehecha por otro camino).** Todo está en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-sc/aud/`.
- **Lo que se revisa** lo saca `extrae.js` de lo que la unidad y el generador entregan (textos, opciones, explicaciones,
  figuras), sin sus funciones internas: 105 preguntas de la teoría (5 predicciones, 30 «Ahora tú», 20 hojas de «Así se
  resuelve», 25 hojas de nivel 3 y 25 listas de nivel 2) y 400 semillas de la práctica. Escribe además un listado con
  las alternativas en orden alfabético, sin marcar la correcta.
- **Un léxico propio** (`lexico.js`), escrito pregunta por pregunta desde ese listado, con etiquetas mías y no las de la
  unidad ni las del generador: cumple, otro uso, mismo tema, suena parecido, otra cualidad, al revés, otro juicio, otra
  fuerza, otra cosa, vale para todo, no cabe, otro objeto, al pie de la letra, otro sentido sin motivo, ocurrencia,
  vecino del texto, espejo del contraste, y «rival» (un alumno atento podría defenderla). Una alternativa que falla por
  dos razones lleva las dos.
- **Un revisor** (`revisa.js`) comprueba que una sola alternativa cumpla según mi léxico y que sea la que la unidad
  marca; saca de la explicación de cada incorrecta el motivo que da y lo compara con mi etiqueta; y mide la regla 10 de
  verbal (ni la más larga ni la más corta, no escrita dentro de otra, la letra y el lugar repartidos).
- **`pistas.js`** mira tres cosas que no ve el revisor: si la pista que el resuelto pinta en turquesa es la que la
  figura marca; el eco (la correcta es la única que repite una palabra de la pista); y «pista» usada con otro sentido.
- **`casos-aparte.js`** rehace `casos.json` con mi léxico y mi tabla de etiqueta a código.
- **A mano**: las 105 preguntas, los 25 ejemplos de nivel 1 y los 30 ítems del banco, alternativa por alternativa,
  pensando en un alumno peruano de 5.º (palabras regionales, dos lecturas), y todo lo que se lee buscando «inferencia».

**Resultado de las cuentas, antes de corregir.**
- En las 105 preguntas de la teoría hay una sola correcta, y es la que la unidad marca. En la práctica también, pero
  en tres ítems otra alternativa encaja casi igual (M5).
- La regla 10 de largo y de «escrita dentro de otra» se cumple en todas: 0 fallas en 505 preguntas.
- Lugar de la correcta: nivel 3, cinco de cada letra; listas de nivel 2, 9, 8 y 8; práctica A 106, B 72, C 98, D 90 y
  E 34 (la E solo existe en las de cinco). «Así se resuelve» va en D, A, E y B en las cinco ideas: la C nunca (B4).
- Motivo de los distractores: 6 explicaciones dicen un motivo que no es el suyo (2 de la teoría y 4 del banco, en 19
  semillas), más las que encontró el lector B (M4).
- `pistas.js`: 2 pistas citadas que no son la marcada (M9), 14 ecos de la correcta (M10, B5) y 2 textos con «pista» de
  asfalto (M3).

Validador con `calidad: 2` simulada y 200 semillas: **0 problemas, 0 pendientes**, antes y después. Ninguna falta de
abajo la ve una regla de hoy. `herramientas/ecuaciones-ancho.js`: antes, dos ecuaciones partidas tras «→» (las reglas de las ideas 1 y 5).
Pruebas propias antes de corregir: teoría 50 de 50, generador 31 de 31, pieza 33 de 33.

**Contenido propio y datos del mundo.**
- Los textos, avisos, mensajes y hojas son inventados; ninguno copia un examen ni un manual. La forma del nivel 3 sigue a
  San Marcos sin copiar ninguna pregunta.
- El único dato del mundo es la historia (el Diccionario de autoridades, 1726–1739), con la fuente de la matriz (ASALE).
  Las menciones de lugares (Puno, Ilave, Chucuito, Juliaca, la cultura Pucará) no dan cifras ni hechos que necesiten
  fuente.
- «Inferencia»: no sale en ningún texto de la teoría, pero sí en el tema del catálogo «Inferencias léxicas», que la app
  muestra en la página de la unidad (M2).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

Ninguno.

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (datos: herramientas, no el paso hecho) | Datos de los niveles 2 y 3 y de «Así se resuelve» (`completar`), «Ahora tú» de las ideas 2, 3 y 5 y la práctica (`valor`, `precisa`, `pistas`) (lectores A y B) | `completar` pone en Datos el nombre de cada trampa que usa el resuelto. Con una línea por opción mala («Otra acepción», «Mismo campo», «Parecido de forma», «Sinónimo por antónimo»…), el alumno descarta sin leer el texto: el lector B lo dijo de las tarjetas 02 y 05 («sale por descarte»), y el A, que «la mitad no son datos del problema». Además, «Lectura literal», «Idea propia» y «Otra cosa» llegan sin haberse enseñado en esa pantalla. | Datos con las definiciones del criterio de la idea, nunca con los nombres de las trampas (los presenta «Mira» y los explica el resuelto); en el nivel 1, que mira una sola cosa, se queda el nombre que usa la solución. |
| M2 | Encargo («inferencia» es de Inferencias); 9 | Tema de la idea 5, `catalogo/cursos/razonamiento-verbal.json` y `plantilla.json`: «Inferencias léxicas» | La app lo muestra en la página de la unidad (`app/app.js`, lista de temas). La propuesta decidió decir «deducir» y no nombrar la inferencia, que estrena la unidad Inferencias. | «Significado por el contexto» en los tres sitios. |
| M3 | 6 (una palabra, un significado); regla 10 (dos lecturas) | «Así se resuelve» de la idea 2, hoja 41 («Pidió durante dos años la pista para el barrio»), y el banco `barato` («la pista se rajó») (lector A) | En el Perú la pista es la calle asfaltada, y en esta unidad «pista» es el término central (la parte del texto que decide). En la hoja 41 la frase de la pista de asfalto está, además, marcada en turquesa como pista. | «que asfaltaran la calle del barrio, hasta que lo logró» y «la vereda se rajó». Prueba: ningún texto de un soporte usa «pista». |
| M4 | 2 de la Etapa 5 (la explicación da el error de verdad) | Varias | La explicación no dice el motivo real:<br>• hoja 83 (idea 4): «lo hizo famoso» se explica como «lectura figurada», y no es un sentido figurado de «partió en dos»;<br>• «La respuesta tajante» (idea 5): «cortado con un cuchillo» se explica por «parecido de forma con tajada», y es la lectura al pie de la letra (tajar es cortar);<br>• «Ahora tú» de la idea 2: «ingenuos» «describe a quien da sin pensarlo», y no lo describe;<br>• Predice de la idea 2: «esquelético» es «otro grado», pero el Dato dice que otro grado «valora igual», y el texto de la enfermera no valora;<br>• banco `nubes`: «está muy concentrada» «lo valora al revés», y es lo opuesto (8 de 400 semillas);<br>• lector B: «muy feliz con su nota» como «otra valoración» («Hecho polvo»), y «vio» como comodín sin estar en la lista de la definición. | «dividió a los vecinos en dos bandos» (un sentido figurado real); «lectura literal: tajar es cortar»; «derrochadores» (describe a quien da mucho, y critica); «Otro grado: dice lo mismo, pero con más o con menos fuerza» y «lo exagera tanto que suena a crítica»; «es muy imaginativa»; «otra cosa: no habla del cansancio»; comodín «(hacer, dar, tener, poner, ver, cosa)». |
| M5 | 3 de la Etapa 5 (una sola respuesta) | Banco: `empresa`, `vacuna` y `libros` (33 de 400 semillas); teoría: «El aviso del diario», «El corazón del barrio» (lector B) y «La casa de la tía» | Sin una pista que decida, otra alternativa encaja casi igual:<br>• «La empresa pagó a diez trabajadores nuevos para la cosecha»;<br>• «El científico abandonó para siempre una vacuna… después de diez años de trabajo» se explica como «choca», y no choca con nada;<br>• «La biblioteca prestó a los lectores cien libros nuevos que le donó una editorial»;<br>• «expuso un aviso en el diario» se puede defender junto a «publicó»;<br>• «¿qué pista dice que «el corazón» va en sentido figurado?»: «del barrio» y «ahí se encuentran todos los vecinos» sirven las dos;<br>• «¿«antigua» elogia, critica o solo describe la casa?»: «solo describe» se defiende, porque el elogio está en «balcones preciosos». | Pistas nuevas («desde el lunes forman parte de su equipo», «hoy ya la ponen en todas las postas», «llegaron ayer en dos cajas») y «entrevistó» por «pagó»; «impuso» por «expuso»; la tarjeta 10 pregunta en qué se parece el mercado a un corazón; «elegante» por «antigua». |
| M6 | Regla 10 (dos lecturas en el Perú) | Banco `corto` («Mi primo es corto: le da vergüenza…») | «Corto» por tímido es de España; aquí se lee «bajo» o «de pocas luces». | Otro ítem de la misma forma: «Mi primo es muy apagado» (antónimo «animado»; «encendido», otra acepción). |
| M7 | 3, 4 | Figura de «Mira» (el cuaderno) en las 5 ideas, y 9 hojas con una oración partida (lectores A y B) | El cuaderno numeraba juntas la oración y las palabras que se prueban (1 a 5, o 2 a 5 en lo que vio el lector B): «parecen cinco oraciones». En las hojas de simulacro, una oración que sigue tras «:» iba en otro número («1 La sequía dejó yermos…:» y «2 no crece…»). | La oración sin número y las palabras con raya (`num` en `rv-soporte`, cambio aditivo con su prueba); una oración que sigue tras «:», «;» o «,» va en el mismo número. |
| M8 | 5 (un color, un papel); 7 | Idea 3: leyenda y consigna del juego, Mira 1 y la regla (lector A) | En el juego el turquesa era «el objeto de la acción», y en Mira marca «antes de aprobarlo». La ecuación de la regla, «precisa: encaja con todo», se lee como lo que la regla dice del comodín («encaja en todo»). | El turquesa es «la pista» también en la idea 3 (leyenda, consigna, Lee 4 y Mira 1). Ecuación: «precisa: no choca + dice más que un comodín». |
| M9 | 7; 13 | «Así se resuelve» de la idea 3, hoja 62, y el ejemplo «La fecha del paseo» | El paso pinta en turquesa «en la reunión» como la pista, pero la figura resuelta marca «el colegio tendrá internet desde mayo». En el ejemplo, la solución cita «dos semanas después» y la marcada es «porque iba a llover». | El paso cita la pista marcada; en el ejemplo, la pista marcada es «ahora será dos semanas después». Prueba: lo que el resuelto pinta en turquesa está marcado como pista. |
| M10 | 10; 9 de la Etapa 5 (niveles) | «Ahora tú» de la idea 5 («sinuoso», «perenne»), hoja 63 («recetó»), ejemplo «Las vasijas del museo» (lector B) | Eco: la correcta es la única que repite una palabra de la pista («da tantas curvas» → «con muchas curvas»; «se la anotó en la receta» → «recetó»; «durante todo el año» → «que dura todo el año», que además vale para una planta que vive un solo año). Las vasijas (nivel 3) traían los ejemplos «cántaros, ollas y platos de barro» y la correcta «recipientes de barro»: más fácil que el nivel 2. | «da tantas vueltas»; «se la anotó en una hoja»; «que siempre tiene hojas»; las vasijas con la pista del uso («en ellas guardaban agua, chicha y granos») y la correcta «objetos para contener algo». Prueba: en «Ahora tú» la correcta no es la única que repite una palabra de la pista. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 6 | Hueco y valor inicial (lectores A y B) | El hueco era «¿…?» en unas pantallas, «______» en otras y «___» en la práctica. El valor inicial de los botones decía «vacío» (que se lee «Iván es vacío»), «sin leer» o «sin marcar». | Todo «¿…?». |
| B2 | 3, 12 | Idea 2: «Vale si» con «flaco», que no salió antes; «imposible» para una persona; los cuadernos de Rosa (como la abuela Rosa) y de Iván (que hace la práctica de su propio peso) (lector A) | — | «delgado»; «insoportable»; cuadernos de Sofía, Nilda y Joel. |
| B3 | 7, 3 | Idea 4: Mira 1 («la subida del pasaje → no es literal») y la regla («el golpe es el daño», con el ejemplo del balde); idea 5: «pista + su lugar → significado», que además se partía a 390 px (lector B y `ecuaciones-ancho.js`) | — | «el balde no es literal»; «el agua fría es el desánimo»; «pista → significado». |
| B4 | Regla 10 (lugar) | «Así se resuelve», las 20 hojas | La correcta va en D, A, E y B en las cinco ideas; la C nunca. No es una pregunta que el alumno responda, pero el patrón se repite. | Se deja: cambiarlo es reescribir las letras de 20 resueltos. Queda como regla propuesta. |
| B5 | 10 | Ecos que quedan, en ejemplos y en el banco | La correcta repite una palabra de la pista en «informante», «las sujetó con clavos», «promesas sin nada detrás», «un problema sin resolver», «se equivocó», «que vive muchos años», «que no quiere soltar su dinero», «lo hizo más corto» y «lo que le da aire limpio». En muchos es la deducción misma. | Se dejan; regla propuesta abajo. |
| B6 | 7 | Soluciones de 8 ejemplos | La solución cita la pista con otras palabras («un árbol» por «el árbol grande»). Las figuras de los ejemplos no traen marcas, así que no se ve el choque. | Se dejan, salvo la de la tarjeta 01 que vio el lector B. |
| B7 | 10 | «La amiga de Lucía» (nivel 2), «Ahora tú» de la idea 2 («generosos»), «El puente sobre el río» | «Amena» conserva el elogio pero no lo que describe «conversadora», y la regla pide las dos. «Bondadosos» describe la bondad, no el dar. «Resistente» queda lejos de «sin peligro» (lector B). | «comunicativa» (con «tímida con todos»); «desprendidos»; «confiable». |
| B8 | 10 | Hoja 9 («En marzo, los transportistas de Juliaca pararon tres días…») | Se lee como una noticia, pero es un texto propio de simulacro, sin cifras del mundo. | Se deja. |
| B9 | App, pieza | Tarjeta 04 (lector B) | El punto final del mensaje toca el borde del globo del chat. Es del dibujo de `mensaje` en `rv-soporte`, común a todo verbal. | Para la pieza; no se toca aquí. |

## Lo que está bien y hay que copiar al molde

- **Un mundo chico por juego con una sola combinación que cumple la misión** (prueba propia) y juegos que se juegan
  tocando la oración en su soporte, con las oraciones en trozos de `rv-soporte` (cada renglón, un solo `<text>`).
- **El banco de la práctica con la etiqueta de cada alternativa** y un generador que lanza un error si el ítem no cuadra:
  en 400 semillas, una sola buena por pregunta y ningún código repetido.
- **El largo de la correcta controlado en todas partes**: 0 fallas de la regla 10 de largo en 505 preguntas.
- **Las predicciones que agregan algo que el juego no tenía** (el antónimo, la palabra neutra, el verbo que choca con
  otra parte, la frase hecha, la pista de contraste), cada una con su Mira paso a paso.
- **La prueba que compara cada oración en trozos con su texto entero**, para que el texto alternativo diga lo mismo.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Los Datos de un ejercicio con alternativas no traen una línea por trampa** (M1): en verbal, solo las definiciones del criterio; los nombres de las trampas los presenta «Mira». | Sí: una lista de nombres de trampa por curso; si los Datos de un nivel 2 o 3 traen tantos como opciones malas, falla. |
| **Una palabra clave del curso no se usa con otro sentido en un texto** (M3: «pista» de asfalto). | Sí: los términos del glosario de la unidad no aparecen en los textos de los soportes, salvo en la oración que los estudia. |
| **La pista que el resuelto pinta es la que la figura marca** (M9). | Sí: es la prueba de esta unidad («cierre · la pista que el resuelto pinta…»), y sirve para todo verbal. |
| **Eco: la correcta no es la única alternativa que repite una palabra de la pista o de la expresión** (M10). | Sí, como aviso: raíz de 5 letras, palabras de 4 o más. En «Ahora tú» como falla; en los ejemplos marca deducciones legítimas. |
| **El lugar de la correcta también se reparte en «Así se resuelve»** (B4). | Sí: el mismo cálculo de `letra-repartida`, con las letras de las hojas. |
| **Un solo hueco y un solo valor inicial en una unidad** (B1). | Sí: «______», «___» y «¿…?» no conviven; ningún botón inicial dice «vacío». |
| **Una oración que sigue tras «:» no va en otro número** (M7). | Sí: ninguna oración de un soporte termina en «:», «;» o «,». |
| **Una alternativa con una pista que la decide** (M5): cuando el ítem pide la palabra más precisa, la oración trae lo que descarta a las demás. | No: es juicio del auditor. Ayuda el léxico aparte con su etiqueta «rival». |

## Correcciones (19 nov)

Hechas por el mismo auditor (paso 3 del cierre delegado), junto con lo que señalaron los dos lectores en frío (ver
`rutinas/frio/razonamiento-verbal.sentido-contextual.md`, «Correcciones de la ronda 1»). Las copias de antes están en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-sc/antes/`.

**Pruebas nuevas.**
- **Teoría**: 10 al final de `sentido-contextual.test.js` («cierre · …»): «inferencia», «pista» de asfalto, Datos sin
  trampas, un solo hueco, cuaderno y oraciones partidas, motivos reales, el turquesa y la regla de la idea 3, el «Vale
  si» y los cuadernos, la pista que pinta el resuelto, y el eco en «Ahora tú». Con la versión de antes fallan las 10; con
  la nueva pasan 60 de 60. Se comprobó con el arnés `…/e7-cierre-sc/viejo/corre-viejo.test.js`.
- **Generador**: 2 al final de `generador.test.js` (Datos sin trampas, hueco y «pista»; pistas que dejan una sola,
  «corto» y «concentrada»). Con el generador de antes fallan las 2; con el nuevo pasan 33 de 33
  (`…/viejo/corre-gen-viejo.test.js`).
- **Pieza**: 1 al final de `rv-soporte.test.js` (`num`). Con la pieza de antes falla; con la nueva pasan 34 de 34.

| # | Qué se hizo |
|---|---|
| M1 | `completar` queda solo para el nivel 1; en los niveles 2 y 3, «Así se resuelve» y «Ahora tú», `sinTrampas` deja las definiciones del criterio. La práctica, igual (`DATOS` sin «Otro grado», «Choca» ni «Detalle cercano»; se regeneró `papel.json`). |
| M2 | «Significado por el contexto» en la idea 5, el catálogo y `plantilla.json`. |
| M3 | Hoja 41: «Pidió durante dos años que asfaltaran la calle del barrio, hasta que lo logró». Banco: «la vereda se rajó». |
| M4 | Como dice la tabla. `D_GRADO` cambia en la teoría y en el generador. |
| M5 | Como dice la tabla. `casos.json`: los casos se recalcularon con mi léxico (`casos-aparte.js`); cambian dos (caso-5, que pasa de `corto` a `apagado`, y caso-8, `nubes`) y los otros 18 dieron lo mismo. |
| M6 | Ítem `apagado` en lugar de `corto`. |
| M7 | `num` en `rv-soporte` (bloque propio, aditivo: sin `num`, todo igual) y `juntar` en `ors`. |
| M8 | El turquesa es «la pista» en las cinco leyendas; la ecuación de la regla de la idea 3 ya no dice «encaja con todo». |
| M9 | Hoja 62 y «La fecha del paseo», como dice la tabla. |
| M10 | Como dice la tabla. |
| B1–B3, B7 | Hechos, como dice la tabla. La ecuación de la regla de la idea 1 queda «pista → acepción de la palabra»: con el tercer tramo («→ reemplazo») se partía a 390 px. |
| B4–B6, B8, B9 | No se tocaron (ver la tabla). |

**Resultado.**
- **`revisa.js` sobre la versión nueva**: 0 fallas y 0 avisos en 105 preguntas y 400 semillas. Lugar de la correcta:
  nivel 3, cinco de cada letra; listas 9, 8 y 8; práctica A 106, B 72, C 100, D 88 y E 34.
- **Validador** con `calidad: 2` simulada y 200 semillas: 0 problemas, 0 pendientes (los topes de palabras de Mira y de
  la regla se respetaron al reescribir).
- **Pruebas**: teoría 60 de 60, generador 33 de 33, pieza 34 de 34; `contenido/teoria/teoria.test.js` 164 de 164;
  `papel-reglas.test.js` y `alternativas.test.js` 153 de 153; `papel-generador.js --revisar`: al día.
- **`ecuaciones-ancho.js`**: todo cabe (50 pantallas, 347 renglones).
- **Capturas de después**: 110, sin errores de página ni capturas repetidas (md5), en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-sc/despues/` (tomadas antes del
  último cambio de la ecuación de la idea 1). Se miraron Mira de la idea 3 (cuaderno sin numerar junto, «¿…?» y la
  pista) y el juego de la idea 2 (botón «¿…?»).
- **No se corrió `npm test` completo**, porque hay otras sesiones trabajando. Sí se corrió `npm run catalogo`.

### Pendiente

- **De la pieza**: el punto final que toca el borde del globo del mensaje (B9).
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad, M1, M3, M7, M9, M10 y B1
  ya son prueba propia.
- **Decidido por la sesión, Gerson revisa después**:
  - **Los Datos de los niveles 2 y 3 sin nombres de trampas** (M1). Es un cambio frente a la lección M8 de Definiciones,
    que pedía que todo nombre que usa el resuelto estuviera en Datos, y que siguió Analogías. Aquí los dos lectores en
    frío dijeron que la lista de trampas, una por opción mala, deja responder por descarte. Se mantiene en el nivel 1. Se
    descartó poner todas las trampas de la idea en cada recuadro: son hasta 5 y no caben en 6 líneas con el criterio. Si
    se aprueba, Definiciones y Analogías tendrían que revisarse con la misma vara.
  - **El tema «Inferencias léxicas» pasa a «Significado por el contexto»** (M2), en el catálogo y en la ficha. Se
    descartó dejar el nombre del temario del CEPRE, porque la app lo muestra y la propuesta reserva «inferencia» para la
    unidad Inferencias. `docs/temario-completo.md` y la matriz no se tocaron.
  - **`num` en `rv-soporte`** para el cuaderno de Mira (M7): la oración sin número y las palabras con raya. Se descartó
    partir el cuaderno en dos hojas, que movía más la figura.
  - **Los nombres de trampa se dejan como están** («contraste al revés», «lo contrario», «sinónimo por antónimo»,
    «lectura literal»), aunque el lector B los sintió parecidos. Con los Datos nuevos ya no salen juntos en un recuadro.
    Si Gerson quiere menos nombres, la propuesta es juntar «lo contrario» y «sinónimo por antónimo» en «lo opuesto».
