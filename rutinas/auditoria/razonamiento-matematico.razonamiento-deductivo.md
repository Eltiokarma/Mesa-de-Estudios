# Auditoría de contenido: «Razonamiento deductivo y parentesco» (razonamiento-matematico.razonamiento-deductivo)

17 nov 2026. Auditor externo (fase 7, `docs/metodo/unidad/5-auditor.md`), sin editar la unidad. Contrato:
`docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Decisiones:
`docs/etapa3/decisiones.md` (Razonamiento deductivo y rondas siguientes) y `docs/etapa2/decisiones.md` («Cambios
posteriores»). Lo que ya señaló el lector en frío (`rutinas/frio/razonamiento-matematico.razonamiento-deductivo.md`) se
comprobó en el código o en la app antes de entrar aquí.

**Qué se revisó.**
- `contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js`: las 5 ideas, los 75 ejemplos, «Ahora tú» con las
  semillas 0–399, «Así se resuelve» con las semillas 0–11, el glosario y las 4 mesas del laboratorio.
- La práctica de la unidad: `plantillas/rm-cuadros/` (los 2 tipos con sus 2 subtipos), `plantillas/rm-deduccion/` (los 5
  tipos de esta unidad), `plantillas/rm-parentesco/` (los 5 tipos de esta unidad), los cuatro `papel.json`, y la escena
  `plantillas/orden-informacion/`, que el catálogo pone en esta unidad.
- La app a 390 × 844 con `--entera`: los 35 momentos y los 75 ejemplos.
- Scripts y capturas en el scratchpad de la sesión (`auditoria-deductivo/`): `dump.js`, `claims.js`, `ejemplos.py`,
  `gen-dump.js`, `par-check.js` y `cap/`.

**Cuentas.** Rehechas con resolvedores propios que no usan el código de la unidad.
- **38 de 38** en `ejemplos.py`, escrito a mano desde los enunciados: repartos por permutaciones, dibujos de Venn por
  zonas con grupos no vacíos, casos de condicionales y familias mínimas por fuerza bruta. Entran los 25 ejemplos de
  nivel 3, 9 ejemplos más, la predicción de la idea 5 y 2 casos de «Ahora tú».
- **400 de 400** respuestas de «Ahora tú» de la idea 1. El script lee personas, cosas y pistas del texto
  (`claims.js`).
- **0 respuestas correctas mal** en 400 semillas de la idea 3 (Venn propio).
- **42 de 42** problemas de práctica: 3 semillas por cada uno de los 14 tipos, resueltos a mano o por fuerza bruta desde
  el enunciado.

Ninguna respuesta marcada como correcta está mal. Lo que falla son las explicaciones de las opciones incorrectas y
algunas frases de la solución (Alta 1 a 3).

`node --test` de la unidad, de los tres generadores y de las cuatro piezas: 163 de 163. `teoria.test.js`: 158 de 158.

**Las quejas de las capturas mal sacadas.** «El botón tapa…», «solo se ve el paso 1» y «no veo las pistas» se
revisaron en la app con `--entera`: no pasan. La figura del juego, las pistas, las opciones y los pasos se ven
completos. No van a la tabla.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, regla 3 (opciones de errores reales) | `razonamiento-deductivo.js:1062-1066` (`opcionesVenn`); se usa en «Ahora tú» y en el paso «¿Tiene sentido?» de «Así se resuelve» (`:1168`) | **La explicación de una opción incorrecta dice que lo imposible «pasa en un dibujo».** Toda opción que no es segura sale con RMP77, «Pasa en un dibujo posible, pero no en todos», también las que no pasan en ningún dibujo. Ejemplo (semilla 0): con «todos los pintores son cantantes» y «todos los cantantes son ajedrecistas», «Ningún pintor es ajedrecista» y «Algunos pintores no son ajedrecistas» son imposibles. Mi Venn las da imposibles en **319 opciones de las 400 semillas**. En «Así se resuelve», 3 de 12 semillas (0, 2 y 8) explican el distractor así: «¿Y “Todos los cantantes son delegados”? Pasa en un dibujo posible…», con «ningún ajedrecista es delegado». | Clasificar cada candidata con `posible(ms, a)`. Si es imposible: «Choca con las premisas: no cabe en ningún dibujo» (RMP72 o RMP74). Si es posible: el texto actual. En «Así se resuelve», elegir de preferencia una opción posible para el paso «¿Tiene sentido?». |
| A2 | 13, regla 3 | `:1395-1401` (`ahoraTu` de la idea 4, tipos 0 y 1) | **El texto de cada distractor es fijo y miente cuando el dato es p o «no q».** Ejemplo (semilla 0): dato «Rosa no falta al colegio». «Que Rosa falta al colegio» (contradice el dato) y «Que Rosa tiene fiebre» llevan «Valdría si la regla también fuera al revés. **Con este dato quedan dos casos**». Con ese dato queda uno solo. En la semilla 9, con el dato «Luis estudia», «Que Luis no aprueba» dice «Sería cierto si la regla dijera también “si no p, no q”». En realidad choca con la regla. Pasa en **204 opciones de los 200 casos simples** de 400 semillas: casi todos los casos con dato directo o indirecto llevan dos textos falsos. | Copiar las explicaciones del tipo `condicional` de `rm-deduccion`, que se escriben por dato y son correctas. Si choca con el dato o con la regla: RMP72, «es justo el caso que la regla prohíbe». Si el dato deja dos casos: RMP70 o RMP71, «quedan dos casos». |
| A3 | 13 | `:357` (`ahoraTu` de la idea 1, tipo 0) | La solución dice «Quedan 2 repartos y en los dos Eva está en danza: **es la única casilla que coincide**». Pero en esa semilla (0) también es seguro que Ana está en teatro. Pasa en **48 de 100** casos de tipo 0. Quien encontró las dos ✓ (lo que enseña la idea) lee que solo había una. | «…en los dos, Eva está en danza.» Si hay más ✓, nombrarlas: «También es seguro: Ana teatro». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (consejo); molde §4 | `:1633`, `:2194` y `:2203` (idea 5: «Ahora tú» tipo 2 y ejemplos 13 y 14) | El dato «Se cuentan personas, no papeles: cada persona cuenta una sola vez» es la trampa misma del problema (RMP62). Es el consejo que el molde saca de Datos, y el lector en frío dijo que «regala la trampa». La tabla de nombres de parentesco **no** se cuenta aquí: está pendiente con Gerson. | Sacar la línea. Dejar solo las definiciones («Padre: tiene un hijo en el almuerzo…»). |
| M2 | 1, 3, figuras (molde §3) | Ejemplos de la idea 3 (`:1810-1939`); captura `ej-conclusion-necesaria-08.png` | La figura dibuja solo la primera premisa, y el resuelto no tiene figura propia. **10 de los 15 resueltos** hablan de un aro que nunca se ve: impuntuales (8), nadadores (7), cantantes (14, «la trampa del grupo del medio»), puntuales (6) y otros. En el 8 el lector buscó el aro de impuntuales y no estaba. La idea enseña a razonar con el dibujo, y el dibujo completo no aparece nunca. | Que el resuelto lleve su figura (todas las premisas, en un dibujo o dos que se contradicen), como «Así se resuelve» de la misma idea. O, en nivel 2 y 3, dibujar todos los aros sin marcar la conclusión. |
| M3 | 3, 6 | Regla de la idea 4 (`:1356`) y de la idea 1 (`:305`); captura `si-entonces-5-regla.png` | El esquema «si p, q; p : q» usa «;» y «:» como notación propia («y se sabe», «se concluye»). Ninguna leyenda ni tarjeta de «Lee» la presenta. El lector en frío: «el “:” creo que quiere decir “entonces se concluye”, pero no estoy seguro». | Escribirlo en palabras: «si p, q · pasa p → se concluye q» sin «→» (lo prohíbe la cabecera), por ejemplo `['si p, q; y pasa p. ', { llave: [F('q')], nota: 'se concluye' }]`. O decir en la regla qué es cada signo. |
| M4 | 13, coherencia teoría–práctica | Teoría, ejemplo «Si fuera…, sería…» (`:2041`), frente a `rm-deduccion/generador.js:1098` y su `papel.json` p8 | Hay dos reglas opuestas para la misma frase. La teoría da: «“Si fuera p, sería q” se lee como “si p, q”: no dice que p pase», y su resuelto: «“Beto no fuera el profesor” no es un dato». La práctica da: «“Si X fuera…, Y sería…”: habla de algo que no pasa; **X no es así**», y lo usa como dato («Kelly es de Ilave, lo dice el “si… fuera”»). Además, la teoría pone el paso hecho en Datos: «Regla: si Beto no es el profesor, Ciro es el médico», que es justo lo que el ejemplo practica. | Elegir una lectura (Gerson) y escribirla en una constante común que usen la teoría y el generador. En el ejemplo, quitar la línea «Regla: si Beto no es el profesor…». |
| M5 | 9, 13 | Ejemplo «¿Cuál no se concluye?» de la idea 4 (`:2058-2066`) | Con «Hoy es lunes», el método de la idea (tabla de casos) deja un solo caso: p, q y r sí. Ahí «Si Luis lleva buzo, es lunes» se cumple. El resuelto la descarta con «puede llevar buzo otro día», algo que la tabla no tiene. El lector en frío lo vio: «el método de la tabla y la explicación no van por el mismo camino». | Quitar «Hoy es lunes» y preguntar qué se concluye de las dos reglas: A «Si es lunes, Luis lleva buzo» (sí); D «Si Luis lleva buzo, es lunes» (no). |
| M6 | 13, 10 | Ejemplo 8 de la idea 5 (`:2150`) | «Él es sobrino de mi papá, **pero no es mi hermano ni soy yo**». Esa exclusión es del acertijo «el sobrino de mi tío». Aquí no tiene sentido: Luis y su hermana son hijos de Pedro, no sobrinos. Sugiere algo falso, que alguien puede ser sobrino de su propio padre. | Quitar la exclusión: «Él es sobrino de mi papá». La trampa del «ni soy yo» solo tiene sentido con «el sobrino de mi tío»; si se quiere, en otro ejemplo y con un árbol donde el tío tenga más sobrinos que Luis y su hermana. |
| M7 | Niveles (molde §3) | Idea 4: ejemplo 13 (`:2048`) y ejemplo 2. Idea 5: ejemplos 11, 14 y 15 (`:2173-2217`) | **Idea 4:** «El pan que no está caliente» (nivel 3) es la forma indirecta de un paso, igual a «La forma indirecta» (nivel 1), con alternativas. **Idea 5:** «Una cadena de tres pasos» (nivel 3) es la misma suma de sube y baja que «El hijo de mi tío» (nivel 1). «El hijo de Raúl» es de un paso. El lector en frío halló el nivel 3 más fácil que el 2. | Idea 4: cambiar el 13 por un condicional con «no» en las dos partes, o por uno escondido en un reparto de 4. Idea 5: cadenas con «único» o línea materna y paterna (como el tipo `cadena` de `rm-parentesco`), o el mínimo de personas con abuelos y nietos. |
| M8 | 2e (Así se resuelve), 13 | `:332` (idea 1) y `:896` (idea 2) | «Así se resuelve» muestra una o dos deducciones y salta a «Las demás salen igual» o «Lo demás sale igual, cuadro por cuadro», con el reparto completo. En la idea 2 la deducción que muestra suele ser la menos útil, un ✗ derivado presentado como si fuera una pista: «Gaby usa mandil blanco, y quien usa mandil blanco no vende jugos…» (semilla 0). Ninguna pista dice eso; la pista 4 dice «choclo–blanco». | Mostrar la cadena entera en 2 o 3 pasos «aplica», con su figura, como hace `pasosSolucion` de `rm-cuadros`. Para el paso del cruce, elegir primero una ✓ (`d.v === 'si'`). |
| M9 | 9; molde §7 (práctica por idea) | `app/practica.js:168` (`gen.generar(…, { unidad })`); `rm-deduccion/generador.js:1074`; `rm-parentesco/generador.js:1005` | La práctica no va por idea: quien terminó la idea 1 recibe silogismos, condicionales y parentescos. Hay además tipos que ninguna idea enseña. **puntajes** («cada uno obtuvo el mayor puntaje que permiten las pistas»: orden y máximos) sale en 1 de cada 10 problemas de `rm-deduccion`. **edades** (primos, pares y suma mínima) sale en el 12 % de `rm-parentesco`. **billetes** (sobres que suman) sale en otro 12 %: está rotulado «idea 2, nivel examen», pero es otro razonamiento. | Pasar `{ idea }` desde el avance, como se propuso en Trigonometría (M6). Sacar puntajes y edades de esta unidad o darles una idea. Billetes puede quedarse si la idea 2 lo enseña (el ejemplo 15 ya trae billetes). |
| M10 | 9; molde §7 | `catalogo/cursos/razonamiento-matematico.json:26` (`orden-informacion`) y los cuatro `papel.json` | **La escena** `orden-informacion` entra completa en Ejercicios, sin filtro, y su papel trae 9 de 10 problemas de otras unidades: fila de butacas, mesa redonda, verdades y mentiras, certezas. Ninguno lleva `unidades`, y la app sí sabe filtrar por ese campo (`app/app.js:1301`). **El papel de los generadores** trae «orden» (`rm-parentesco` p7) y «puntajes» (`rm-deduccion` p9). | Marcar `unidades` en cada problema de esos cuatro papeles. Mientras no haya escena propia, sacar `orden-informacion` de esta unidad o dejar solo su problema p6, el del cuadro. |
| M11 | 13 (papel) | `rm-deduccion/papel.json` (9 de 10), `rm-parentesco/papel.json` (8 de 8), `orden-informacion/papel.json` (10 de 10) | Son papeles escritos a mano, sin «Datos». Por ejemplo, el p8 de `rm-deduccion` usa el «si… fuera» sin definirlo. Solo `rm-cuadros`, que sale del generador, los trae. | Agregar los datos de cada tipo (las mismas líneas de `lineasDatos`) o regenerar los papeles con `herramientas/papel-generador.js`. |
| M12 | 6, 9 (método distinto) | `rm-deduccion/generador.js:273, 329-330` (silogismo) | La teoría enseña aros de Euler: «dentro», «no se tocan», «comparten un pedazo», con grupos no vacíos. La solución del generador usa el diagrama de tres círculos con zonas tachadas y «una × sobre la línea entre…», un método que la unidad nunca presenta. Lo mismo en `rm-parentesco`: la teoría cuenta «sube y baja» y la práctica va «eslabón por eslabón» con nombres. | Que la solución del silogismo hable de aros y dibujos (como `ahoraTu` de la idea 3) y que la figura sea de aros. En parentesco, agregar «sube N, baja M» a cada eslabón. |
| M13 | 13 | `rm-parentesco/generador.js:1011-1016` (`lineasDatos` de `cadena`) | La respuesta se elige entre nombres que no están en Datos: bisabuelo o bisabuela, tío abuelo o tía abuela, sobrino nieto o sobrina nieta. Pasa en **92 de 642** cadenas (2000 semillas; `par-check.js`). Datos solo define hermano, tío, primo, sobrino, abuelo y nieto. | Agregar la línea de la teoría (`D_CAMINOS[3]`): «Bisabuelo: sube 3… Tío abuelo: sube 3, baja 1. Sobrino nieto…». |
| M14 | 1, 4 | Juego de la idea 3 (`:966`, `NINOS3`); captura `conclusion-necesaria-2-juega.png` | El lector en frío lo vio y se confirma con `--entera`. En la vista del patio, los alumnos que deciden la lectura se paran sobre la línea de un aro: el quenista que «baila diablada» queda pisando el borde entre los dos aros. La lectura dice «algún quenista baila diablada», y en la figura no se ve con claridad quién es. Las rayas grises del piso no tienen leyenda. | Correr a ese alumno (3.5, 4.4) al centro de la zona común, y a cualquier otro a más de una cabeza del borde. Marcar con un punto, o con el color del aro, a quien está dentro. Decir en la leyenda qué son las rayas, o sacarlas. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 4, 5 | Ejemplos de la idea 4 con `figT(VPQR, 3)` (`:1988-2075`) | 4 de los 5 resueltos con la tabla de 8 casos no la usan: razonan con forma directa e indirecta. Solo «Dos reglas en cadena» la menciona. | Una línea por resuelto que diga qué fila queda, o figura de dos tablas de 4 casos. |
| B2 | 13 | Ejemplo «Los puestos de la kermés» (`:529`), ejemplo «Cuatro amigos» (`:470`, `:472`), ejemplo 4 de la idea 1 (`:433`) | **«…porque la pista 2 tacha a Maru: ✓.»**: la ✓ se lee como de Maru (el lector se perdió ahí). **«Cuatro amigos»:** la ✓ va suelta, sin su caja, y la respuesta corta en «Beto y Ciro, no». **Ejemplo 4:** dice «el 2 y 5». | **Kermés:** «Solo queda Vilma (la pista 2 tacha a Maru): ✓ Vilma, jugos». **Cuatro amigos:** `F('✓')`, y «Beto y Ciro, vóley y ajedrez en cualquier orden». **Ejemplo 4:** «el 2 y el 5». |
| B3 | 4, 10 | Ejemplos de la idea 5: «El hijo de Raúl» (`:2210`) y «Los hijos de Elena» (`:2201`) | **«El hijo de Raúl»:** dice «Raúl tuvo un solo hijo, Pedro». En el árbol de la misma idea, Raúl tiene dos (Pedro y Tomás). **«Los hijos de Elena»:** Elena tiene tres hijos varones; en el árbol de los ejemplos 1–10, Elena tiene a Raúl y Marta. **Los cinco de nivel 3** van sin figura. | Otros nombres en los problemas sin árbol (o un arbolito propio). |
| B4 | 13, coherencia | `:2203` («Hermanos: hijos de la misma madre») frente a `rm-parentesco` (`:1011`, «del mismo padre y de la misma madre») | Dos definiciones de «hermano» en la misma unidad. | Una sola constante. |
| B5 | 6, 3 | Predicción de la idea 3 (`:1125`, `:1128`) | La nota de la figura pregunta «¿Dónde va el aro de la diablada?», y la pregunta es otra («¿Qué se puede asegurar?»). El lector no supo si tenía que arrastrar algo. La opción D dice «danzantes»; el resto de la idea, «diablada». | Nota: «Banda y quenistas; falta la diablada». Cambiar «danzantes» por «los de la diablada». |
| B6 | Opciones (molde §2) | `ahoraTu` de la idea 5 (`:1651`, `opcionesTexto`) | 27 de 400 semillas salen con 3 opciones (p. ej., semilla 4: Prima, Tía, Sobrina). | Completar con «No se puede saber» (RMP78) o con un vecino más. |
| B7 | Códigos RMP | `:1417` (idea 4, tipo 2) y `:1433` (tipo 3) | Con el dato «no p», «Que q» sale como RMP70 («las reglas no van al revés»), que no es ese error. En la asignación, ignorar la regla sale como RMP70 (bicondicional); es RMP63 (ignorar una pista). | Ajustar el código y el texto. |
| B8 | Glosario (4g) | `:2443` («certeza») | Es el único término propio sin `simple`. Se marca en «Así se resuelve» de la idea 3. | `simple: 'Saberlo sin ninguna duda: vale en todos los casos.'` |
| B9 | 3 | Regla de la idea 3 (`:1146`) y regla de la idea 1 (`:306`) | **Idea 3:** en «todos los A son B», A va en naranja y B en tinta («el grupo del medio»), pero aquí B no es el del medio. El lector preguntó por qué solo A tiene color. **Idea 1:** la condición habla de «una pista que nombra a dos personas» antes de que aparezca ninguna (la primera está en «Así se resuelve»). | Idea 3: A y B en tinta en la forma general. Idea 1: un ejemplo en la condición («“Ana almuerza con quien juega vóley”: Ana no juega vóley»). |
| B10 | 5 (color fijo por papel) | `rm-parentesco/generador.js:310, 456, 615` | **Cadena y árbol:** el naranja va en «mi madre» (el primer eslabón). En la teoría, el naranja es quien habla (Ana). **Mínimo:** pinta varones en naranja y mujeres en turquesa, colores con otro papel en la unidad. | Naranja en el nombre de quien habla. En el mínimo, V y M en tinta. |
| B11 | Idea 2 | `rm-cuadros`, subtipo `atributos/quien` (semillas 4 y 13) | A veces la pregunta se responde con dos pistas que nombran a alguien, sin usar el cruce. Es la destreza de la idea 1. | Exigir que la pregunta cambie si se quita la pista que cruza (como hace `objetivos` en la teoría). |
| B12 | 1 | Ejemplos de la idea 2 (captura del lector en frío, ejemplo 4) | Con la letra de la app, «Ilave» se lee «llave» (I mayúscula igual a l). | Pendiente de tipografía: probar una I con remates o Ilave en versalitas en las figuras. |

## Lo que está bien y hay que copiar al molde

- **Todo sale de contar, nada se escribe a mano.**
  - Las ✓, ✗, repartos tachados, casos y caminos salen de `quedanR`/`marcasDe`, `repsL`/`marcasL`, `modelosVenn`,
    `casosQuedan` y `caminoDe`. La misión, la lectura y la predicción también: `PRIMERA`, `N_BETO`, `ANA_P` y
    `relDe('ana', META5)`.
  - Por eso ninguna respuesta correcta falló en 38 + 400 + 400 + 42 cuentas rehechas aparte.
  - La prueba de la unidad vuelve a resolver todo con un resolvedor propio y lee «Ahora tú» de su texto, en 400
    semillas.
- **Paleta por papel con su prueba.** Naranja para lo primero, turquesa para lo segundo, tinta para lo que amarra y
  violeta solo para lo seguro. `razonamiento-deductivo.test.js` falla si un papel cambia de color o si una figura que se
  ve antes de responder trae una ✓, un tachado o la persona pedida. Sirve de molde para cursos sin magnitudes.
- **Lo que se compara se ve junto (punto 4).** Mira de la idea 4 pone «Dato: seca» y «Dato: mojada» lado a lado. Mira de
  la idea 3 pone dos dibujos que cumplen las premisas y se contradicen.
- **Las explicaciones del tipo `condicional` de `rm-deduccion`** se escriben para el dato de cada sujeto y dicen la
  verdad, empezando por lo que el alumno hizo bien. Es lo que le falta a la idea 4 de la teoría (A2).
- **`porQueNo` y `porQueNoL` calculan la pista exacta** sin la cual el distractor cabría («Valdría sin la pista 3»): el
  error se explica con el dato del problema, no con una frase genérica.
- **Un generador sirve a varias unidades con `tiposPorUnidad`** sin cambiar las semillas viejas de `casos.json`.
- **Lo que el juego reserva para Predice está declarado** en el comentario de cada idea («Se reserva: …»), y se cumple.

## Reglas que faltan en el contrato o el validador

1. **La explicación de una opción no puede contradecir el modelo.** Si el `siFuera` dice «pasa en un dibujo», «quedan
   dos casos» o «valdría sin la pista N», el validador lo comprueba. **Automático:** cada distractor lleva una etiqueta
   (`posible` | `imposible` | `nCasos`) que la prueba de la unidad cruza con su resolvedor. Habría detectado A1 y A2.
2. **Las frases con «el único», «la única» o «en los dos» de una solución se comprueban contra el conteo.**
   **Automático** en la prueba de la unidad (A3).
3. **Un dato o una convención que usan la teoría y la práctica se escribe una sola vez**, en una constante común: el
   contrafáctico, la definición de hermano, «algunos». **Automático:** la prueba exige que las líneas de Datos con la
   misma clave sean idénticas (M4, B4).
4. **La práctica resuelve con el método y la figura que enseñó la teoría** (aros contra zonas sombreadas; sube y baja
   contra eslabones). **A medias:** una lista de palabras del método por unidad que la solución del generador debe
   usar, y otra de palabras que no debe usar («se tacha la zona»). El resto es revisión.
5. **Papel con Datos y con unidad.**
   - Todo problema de un `papel.json` escrito a mano lleva `datos`.
   - Si la plantilla sirve a más de una unidad, cada problema lleva `unidades`.
   - **Automático** en `herramientas/` (M10, M11).
6. **Datos define toda respuesta que se elige por nombre.** Si la respuesta es un nombre (parentesco, cuantificador),
   aparece en alguna línea de Datos. **Automático** en la prueba del generador (M13).
7. **Toda figura de un ejemplo resuelto nombra lo que el resuelto nombra.** Cada aro, fila o persona que menciona la
   solución está en la figura o en una figura de la solución. **A medias:** comparar los nombres de grupos de las
   premisas con los `aros` de la figura (M2).
8. **Un signo que no es de los libros («:» como «se concluye», «;» como «y se sabe») está en la leyenda o la regla lo
   dice en palabras.** **A medias:** lista de signos permitidos en `regla.ecuacion` (M3).
9. **Datos sin consejo.** «Se cuentan personas, no papeles» y similares. Es **manual**; el encargo del autor puede
   llevar la lista de frases que no son datos (M1).

## Pendientes de Gerson que no se cuentan como hallazgo

Nombres de columna girados 90° en el cuadro en L; «cada grupo tiene al menos un integrante» como dato; la tabla de
nombres de parentesco en los datos (los subconjuntos que trae cada ejemplo de la idea 5 dejan elegir entre 3 o 4 nombres,
lo que se decide con esa tabla).
