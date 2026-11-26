# Auditoría de contenido: «Cohesión y coherencia textual» (razonamiento-verbal.cohesion-y-coherencia)

26 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad ni
la pasada del redactor. Contrato: `docs/plan-calidad.md` §3 y §5. Vara: `docs/molde-unidad.md` §10 y la fila de verbal de
§11. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa9/propuesta-verbal.md`. Lo
que vio el redactor: `rutinas/redaccion/razonamiento-verbal.cohesion-y-coherencia.md` (dejó cuatro puntos para el
auditor; van abajo como M6, M7, M8 y M9). Lo que vieron los dos lectores en frío está en
`rutinas/frio/razonamiento-verbal.cohesion-y-coherencia.md`; aquí se cita cuando el código lo confirma.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.js` (sin `calidad: 2`): las 5 ideas con sus 7
  momentos, los 75 ejemplos, «Así se resuelve» (4 hojas por idea), «Ahora tú» (6 casos por idea; la semilla elige el
  caso y da vuelta las opciones, y la app las baraja), el glosario, las 5 mesas y la historia.
- La práctica `plantillas/cohesion-coherencia/` (nueva): 10 tipos (2 por idea), banco de 36 ítems, `casos.json` (20) y
  `papel.json` (8).
- La app a 390 px con `--entera --lector`, contra un servidor propio en el puerto 4231: 35 momentos, 75 ejemplos y las 15
  tarjetas, sin errores de página.

**Cuentas (en verbal: cada pregunta con alternativas, rehecha por otro camino).** Todo está en
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-verbal/aud/`.
- `extrae.js` vuelca en texto lo que ve el alumno (textos en su soporte, preguntas, opciones con su largo, explicaciones,
  Datos y pasos), sin las funciones de la unidad. Con ese volcado se resolvió a mano, leyendo cada texto, toda pregunta
  de la teoría: 5 predicciones, 30 «Ahora tú» (las 200 semillas recorren esos 6 casos por idea, con el orden dado vuelta
  en las impares), 20 hojas de «Así se resuelve», 25 hojas de nivel 3, 25 listas de nivel 2 y 25 preguntas abiertas de
  nivel 1. Las 5 misiones, desde las tablas de los juegos: una sola combinación cumple en cada una (en la idea 1, a mano
  sobre los 9 horarios: solo «de lunes a sábado» con «el domingo» no choca y abre el sábado).
- `forma.js` busca pistas de forma en la teoría: la correcta como única más larga o más corta (en letras y en palabras),
  y como la única que empieza distinto cuando las incorrectas empiezan igual.
- `revisa-gen.js` resuelve 400 semillas de la práctica con mi propia tabla de respuestas por ítem (escrita leyendo los
  36 textos del banco, sin el generador ni el juez de su prueba) y busca las mismas pistas de forma y códigos repetidos.
- `casos.js` rehace `casos.json` con la tabla del juez de `generador.test.js` (escrita sin las funciones del generador).
- El validador con `calidad: 2` simulada (200 semillas) corre dentro de la prueba de la unidad: sin hallazgos antes y
  después de las correcciones.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3 de la etapa 5 (una sola respuesta) | Idea 1, ejemplo 8 «La panadería sin pan» (lector A, tarjeta 02) | «Hoy la panadería vendió pan de su horno» no choca con «Hoy no horneamos pan»: el pan pudo hornearse ayer. Quedan dos que pueden ser verdad junto con el aviso, y el resuelto dice que esa choca. | «Hoy la panadería horneó pan de maíz». |
| A2 | 7, 13 | Idea 2, ejemplo 8 «El horario de invierno» (lector A, tarjeta 05) | El resuelto dice que «lo siguiente» es «todo lo que sigue a los dos puntos», y la respuesta marcada, «que empieza el horario de invierno», deja fuera «el lunes»; la distractora «el lunes» es justo la otra parte. Además, «Les recuerdo» hace defendible «algo que se dijo en la reunión anterior». | Respuesta «que el lunes empieza el horario de invierno»; «Les aviso»; la parte, «solo el día, el lunes». |
| A3 | 3 de la etapa 5; 7 (la explicación dice algo falso) | Práctica, ítem `pelota` | «Luis pateó la pelota contra la ventana y la rompió»: «la pelota» es defendible (una pelota se rompe), y la explicación de esa incorrecta (RVK6) dice que «la oración no tiene sentido», lo que es falso. | «Luis guardó la pelota en la mochila y la cerró»: cerrar una pelota no tiene sentido. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 10 de verbal (la correcta no se delata) | Idea 1: «Ahora tú» de la clausura y del pozo (lector A); práctica: todo problema de choque | Cuando la respuesta es «Sí», las tres incorrectas empiezan con «No»: se acierta sin leer el texto. En la práctica pasaba en cada problema de los cuatro ítems de choque (`tienda`, `ninguno`, `lago`, `tanque`). La prueba de largo no lo ve. | Una «Sí» incorrecta con otra razón (RVK3 «hablan de lo mismo»; RVK1 «les falta un conector»), y una regla: la correcta no es la única que empieza distinto cuando las incorrectas empiezan igual. |
| M2 | 13 (los Datos no dicen cuál cumple); 10 de verbal | Ideas 1 y 5: 15 ejercicios de la teoría (lector A, tarjeta 01; lector B, tarjetas 13 y 14) | La línea «Lo que una persona cree o dice se le atribuye a ella» (idea 1), la de «todos y ninguno» (idea 1) y «Lo que alguien cree o piensa no es un hecho del texto» (idea 5) salían solo en los ejercicios cuya respuesta las usa; la idea 5 sumaba «Contradicción» solo en el ejemplo 4, cuya respuesta es «contradice». La presencia de la línea dice la respuesta. | El mismo recuadro en todo ejercicio de la idea (cuatro líneas), también en la práctica (`contradice` suma la de «todos», `incluir` la de las creencias). |
| M3 | 10 de verbal | Idea 2, «Ahora tú» del gato (lector A); ejemplo 12 «El afiche de la feria» | «Al gato que huía» era la única con un detalle; «Al afiche nuevo», la única con un adjetivo, que además el texto no dice («un afiche»). | Detalle en todas («Al perro, que lo perseguía», «Al techo, el último nombrado»); «Al afiche pegado» (el texto lo dice). |
| M4 | 9 y 2 (cada idea practica lo suyo) | Idea 3, «Ahora tú» de la quena (lector A) | Pregunta «¿A qué se refiere «este instrumento»?»: es la idea 2, los Datos de la idea 3 no sirven, y el texto es casi el del ejemplo 3 (charango). | Texto y pregunta del recurso: «Esa vasija» por «una olla de barro»; «¿Qué hace «esa vasija» en la oración 2?». |
| M5 | 3 de la etapa 5 (con lo que el alumno vio) | Idea 4, Predice de la quinua (lector B) | La misión del juego solo pedía la cadena («que cada oración parta de lo nuevo de la anterior») y la presentaba como la meta; así «Sí: la 2 no retoma lo nuevo de la 1» se puede defender antes de la regla. | La misión se presenta como una forma entre otras («Arma una cadena: …»); lo demás ya estaba («Lee» dice que el hilo sigue cuando cada oración parte de algo ya dicho, y el juego pinta en turquesa la vuelta a los incas). Decisión para Gerson. |
| M6 | 7 (la regla es completa y verdadera) | Idea 3: regla, condición, `REGLA3` y el paso de la práctica (redactor, punto 1) | «Lo callado… concuerda en persona y número con quien hace la acción»: en «Mis primos… Trajeron» lo callado es quien hace la acción, y en «yo llevo; tú, el queso» lo callado es el verbo, que cambia de persona. La frase no dice qué concuerda con qué. | «Lo callado se recupera de lo dicho justo antes, y el verbo va en la persona y el número de quien hace la acción»: vale para los dos casos («trajeron» dice que son ellos; «llevas», que eres tú). |
| M7 | 7 (credibilidad de un dato del mundo); 13 | Glosario «inclusión» (redactor, punto 2) | «La UNI suele preguntar inclusión en Razonamiento Verbal» afirma como hecho lo que la cabecera de la unidad llama hipótesis (en el repo no hay examen de verbal de la UNI). | «En una pregunta de inclusión, solo una alternativa encaja en el espacio.» |
| M8 | 3 de la etapa 5 | Idea 5, «Ahora tú» de doña Julia (redactor, punto 3) | El choque de «Doña Julia no vende pescado» con «Esas truchas llegan cada mañana del lago» depende de suponer que llegan a su puesto; leída sin eso, la oración falla porque no presenta las truchas, como otra incorrecta. | «Esas truchas llegan a su puesto cada mañana desde el lago» y la incorrecta «En su puesto no hay ningún pescado.» |
| M9 | 7 (la explicación nombra el error real) | Práctica: rol `noCorresponde2` con RVK8 (redactor, punto 4) | RVK8 es «la elipsis o la sustitución se toman por una falta o por algo nuevo», y quien elige «Este cerro» por la llama no cree que haya algo nuevo: acepta un nombre que no le corresponde. La explicación («hace pensar en algo nuevo») no describe lo que hizo. | Dos clases distintas por el código: la que concuerda y no tiene sentido (RVK6: «Esta planta», «Esta fruta», «Esta comida», «Este animal» para el cañón) y la que no corresponde ni concuerda (RVK17: «Este cerro», «Este pueblo», «Esta laguna»). |
| M10 | 7 | Práctica, explicación RVK10 del hilo | «Bien visto que la 2 repite un nombre»: en `mercado` la 2 empieza con «Ese día», que no repite ningún nombre. | «… retoma algo de la anterior». |
| M11 | 10 de verbal | Idea 1, ejemplos 8, 9 y 10; idea 5, «Ahora tú» del cohete | En el 8, dos opciones empezaban con «Hoy» y la correcta con «Ayer»; en el 9, dos con «hablan» y la correcta con «son»; en el 10, la correcta era la más corta; en el cohete, tres con «El» y la correcta con «Los». | Cambiar una distractora en cada uno (ver las correcciones). |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 6 | Idea 2, «Así se resuelve» 9 (lector A) | «ya lo había vendido todo»: el alumno puede leer que «lo» es «todo». | «ya lo había vendido». |
| B2 | 2, 8 | Juega 2 y 3 (lector A) | Turquesa «el referente elegido con sentido» y violeta «pronombre bien unido» se confunden; la leyenda de la idea 3 tenía cinco entradas. | Leyendas que dicen qué se pinta («el nombre elegido, si concuerda y tiene sentido» y «el pronombre, ya unido a ese nombre»); «[ ]» va con la negrita. |
| B3 | 5 (un color, un papel) | Idea 4, leyenda del juego (lector B) | Violeta «la cadena de la misión», y en Mira y la regla el violeta marca la vuelta al tema. | «el hilo que pide la misión». |
| B4 | 7 | Idea 3, ejemplo 8 (lector A) | «¿Qué forma usa «Lo»…: «repetir la palabra», «sustituirla»…?» (es la oración la que usa una forma). | «¿Qué hace la oración 2 con «un sol»…?». |
| B5 | 7 | Idea 5: Predice A (lector B); ejemplos 8 y 14 (lector B) | «Al ver las cajas…»: cajas que el texto no nombra, junto a «todos»; el resuelto del 8 cita entre comillas algo que no es la opción; el 14 dice «retoma la preparación», y su D era de las más largas. | «Al recibirlos…»; citas enteras; «el examen es aquello para lo que Raúl se preparó»; C más larga. |
| B6 | 4 | Idea 4, ejemplo 8 (lector B) | La lista empezaba por «la 4», que es la respuesta. | «la 2», «la 4» o «la 3». |
| B7 | 7 | Idea 4, «Ahora tú» de la feria; idea 1, «Ahora tú» de la casa | La explicación de «De nada ya dicho: es un tema nuevo» decía «Bien que busques un nombre repetido»; en la casa, la correcta empataba en largo con la más larga. | «Es cierto que la 2 dice cosas nuevas, pero…»; el RVK1 se alarga. |
| B8 | 10 | Práctica, ítem `bus` | «El bus es nuevo» y «sus llantas están gastadas» se leen como choque más que como partes distintas. | `casa`: paredes de adobe, techo de calamina. |
| B9 | 10 de verbal | Idea 1 «Así se resuelve» 11; idea 2 Predice; idea 4 ejemplos 12 y 14; idea 5 «Así se resuelve» 9 y ejemplo 14 | La correcta tiene una o dos palabras más que las demás, aunque no es la más larga en letras. | Se deja: la diferencia es chica y no se ve sin contar. |
| B10 | — (app) | Juega 1 a 5 (lectores A y B) | «Volver al inicio» tiene forma de chip junto a las opciones; los chips de los juegos 4 y 5 traen solo el comienzo de la oración («…»). | Para la app y la sesión (`app/teoria.js`, `te-reinicio`); no se toca aquí. |

## Lo que está bien y hay que copiar al molde

- Cada juego decide con un mundo chico (días, género y número, quién hizo algo antes, de qué parte cada oración, qué
  retoma y qué presenta cada candidata), y la prueba exige que una sola combinación cumpla la misión.
- «Así se resuelve» de la idea 1 practica las tres condiciones de la regla por separado (mismo momento, otra persona,
  cambio que quita el choque) y «Ahora tú» cubre cada parte con un caso; las predicciones de las cinco ideas apuntan a
  lo que el juego no mostró (otro tiempo, catáfora, verbo callado, vuelta al tema, creencia antes de «sin embargo»).
- Las explicaciones de las incorrectas reconocen lo que el alumno hizo bien y dicen por qué falla con el texto, sin el
  molde «X, bien; pero Y» (pasada del redactor).
- La práctica arma la correcta con rasgos y lanza un error si un ítem no cuadra; el juez de su prueba está escrito
  aparte. Con esta auditoría, `elegir` también rechaza la mezcla que delata la correcta por su primera palabra o por
  sus palabras.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **La correcta no es la única que empieza distinto cuando todas las incorrectas empiezan igual** (M1, M11: «Sí» contra tres «No», «Ayer» contra dos «Hoy»). Vale para todo verbal y para toda pregunta de sí o no. | Sí: prueba de esta unidad (todas las preguntas de la teoría) y del generador (400 semillas); «al» y «del» cuentan como «a» y «de». Conviene subirla al validador común. |
| **El recuadro «Datos» no cambia según la respuesta** (M2): una línea que solo sale en los ejercicios que la usan la delata. | Sí, en su forma simple: el mismo recuadro en todos los ejercicios de una idea (prueba de esta unidad). En general: avisar si una línea de Datos aparece solo en ejercicios cuya respuesta comparte palabras con ella. |
| **La correcta no es la única con más o menos palabras, ni la única con un complemento** (M3; «Al gato que huía»). | En parte: el número de palabras (prueba del generador); el complemento es juicio. |
| **La explicación de una incorrecta describe lo que esa opción hace** (A3, M9, M10). | No: juicio del auditor; ayuda leer cada explicación junto a su opción en el volcado. |
| **Un dato del mundo en el glosario o en la teoría (qué pregunta una universidad) lleva fuente o va como hipótesis** (M7). | En parte: buscar nombres de universidades (UNI, San Marcos, UNA, UNSA, UNSAAC) en el glosario y los ejemplos, y pedir fuente. |

## Correcciones (26 nov)

Hechas por la misma sesión de cierre, cada una con su prueba (falla con la versión anterior: se corrieron las pruebas
nuevas contra copias de la unidad y del generador de antes de corregir, en `aud/unidad.antes.js` y
`aud/generador.antes.js`: 3 y 8 pruebas en rojo). Lo de los lectores en frío está en
`rutinas/frio/razonamiento-verbal.cohesion-y-coherencia.md`, «Correcciones de la ronda 1».

| # | Qué se hizo |
|---|---|
| A1 | Ejemplo 8 de la idea 1: «Hoy la panadería horneó pan de maíz» y «Esta mañana compré ahí pan recién horneado» (M11); resuelto al día. |
| A2 | Ejemplo 8 de la idea 2: «Les aviso lo siguiente…», respuesta «Que el lunes empieza el horario de invierno», opciones «solo el día, el lunes» y «algo que ya se les dijo en la reunión de padres»; el resuelto dice que antes de los dos puntos no se dijo nada. |
| A3 | Ítem `pelota`: «Luis guardó la pelota en la mochila y la cerró» (respuesta «A la mochila»). Juez y `casos.json` al día. |
| M1 | Teoría: «Ahora tú» de la clausura y del pozo con una «Sí» incorrecta (RVK3). Práctica: el choque trae «Sí: las dos oraciones hablan de la misma cosa» (RVK3) y, sin conector, «Sí: les falta un conector que las una» (RVK1); `elegir` rechaza la mezcla que delata por la primera palabra o por el número de palabras. Pruebas nuevas en las dos. |
| M2 | `D_IDEA1` y `D_IDEA5` con cuatro líneas, las mismas en todo ejercicio de la idea; `DATOS.contradice` suma «todos y ninguno» y `DATOS.incluir` la línea de las creencias. Prueba nueva. |
| M3 | Como dice la tabla. |
| M4 | «Ahora tú» de la olla y la vasija (cuatro opciones, códigos RVK8, RVK6 y RVK14 distintos). |
| M5 | Misión y `bien` de la idea 4 como una forma de seguir el hilo. **Decidido por la sesión, Gerson revisa después:** no se adelanta antes de Predice que volver al tema también vale, porque eso responde la predicción (regla `antes-predice`). |
| M6 | Regla 3: `REGLA3`, condición y el paso de la práctica con «el verbo va en la persona y el número de quien hace la acción». |
| M7 | Ejemplo del glosario cambiado (sin afirmar qué pregunta la UNI). |
| M8 | Como dice la tabla. |
| M9 | Roles del banco de recursos redistribuidos: `noCorresponde2` = RVK6 (concuerda, sin sentido) y `noCorresponde` = RVK17; el cañón cambia «Este río» por «Esta laguna». Juez, `casos.json` y `papel.json` al día. |
| M10, M11 | Como dicen las tablas («Ese club también tiene un microscopio»; «son dos tiempos distintos»; «poner «también» en la segunda»). |
| B1–B8 | Hechos, como dicen las tablas. |
| B9, B10 | No se tocaron (ver la tabla). |

Comprobaciones al cerrar:
- `node --test contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.test.js plantillas/cohesion-coherencia/*.test.js`: 92 de 92.
- `contenido/teoria/teoria.test.js` (esta unidad y el glosario): en verde. El validador con `calidad: 2` simulada, sin hallazgos.
- `npm run catalogo` (glosario de verbal al día) y `node herramientas/papel-generador.js cohesion-coherencia` (8 problemas).
- `aud/revisa-gen.js`: 400 semillas, 36 de 36 ítems, 0 fallas. `aud/forma.js`: sin la pista de la primera palabra; quedan
  solo las de B9.
- Capturas después de corregir en `…/scratchpad/cierre-verbal/despues/`.

### Pendiente
- M5: si Gerson prefiere que el juego muestre antes de Predice las dos formas de seguir el hilo, la predicción de la idea
  4 tiene que cambiar de pregunta.
- B10, para la app: el botón «Volver al inicio» de los juegos se confunde con una opción, y los chips de verbal cortan
  la oración.
- Los niveles 2 de referente y de repetir no suben mucho sobre el 1 (lector A); se deja para la revisión de Gerson.
