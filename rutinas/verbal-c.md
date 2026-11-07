# Rutina de razonamiento verbal C: reporte

7 de noviembre de 2026 · Rama `rutina/verbal-c`, creada desde `claude/awesome-wozniak-5etl1n`. No toqué `VERSION` de `app/sw.js`; **la tarea 3 cambia la cáscara** (`app/app.js` y `app/estilos.css`), así que hay que subirla al integrar.

**Encargo:** (1) arreglar RV6 en «lo dice», (2) un texto de dificultad 3 para tipología, resumen y contexto, (3) `herramientas/papel-lectura.js` para que los módulos de lectura tengan lápiz y papel.

**Resultado:** las tres hechas. `npm test` da **4414 en verde** (antes eran 4395; los textos nuevos ya se validaban en `textos/` antes de entrar al índice).

## Commits

| Commit | Qué |
| --- | --- |
| 8189da2 | Tarea 1: RV58, diez previos corregidos, sin el parche de la frase, prueba nueva |
| 9e292a4 | Tarea 3: `papel-lectura.js`, siete `papel.json`, `vPapel` con texto y preguntas, prueba nueva |
| 984fc7c | Tarea 2: t055, t056 y t057 (dificultad 3) en sus índices; papel regenerado |
| (este) | Este reporte |

## Tarea 1: RV6 en «lo dice»

**Qué estaba mal.** En un previo `clasificar` con clase `se-deduce`, al alumno que respondía «Lo dice el texto» se le registraba RV6 («se toma lo literal como si fuera inferencia»). Es el error contrario: el alumno tomó una inferencia por algo escrito. La app ya escondía la frase (`FRASE_NO_APLICA`), pero el código guardado en la medición seguía siendo falso.

**No eran 6, eran 5 con RV6** (t010, t013, t022, t028 y t044). Al revisar encontré el mismo error con otros códigos: t034 y t048 con RV5 (eco literal), y t039, t040 y t041 con `null`. Los 10 pasaron al código nuevo.

**Código nuevo: RV58, «Se da por dicho lo que solo se deduce»** (hipótesis con contexto indirecto). El alumno completa el texto con su propia inferencia y cree que está escrito. El contexto indirecto sale de los estudios de memoria de oraciones (Bransford, Barclay y Franks, 1972): los lectores reconocen como leídas oraciones que solo infirieron. Es población distinta y otra tarea, así que va marcado como hipótesis y la cita queda «por verificar páginas». Frase para el alumno: «Eso no está escrito: lo dedujiste (o lo calculaste) a partir de lo que dice el texto. Está bien deducirlo, pero deducir no es lo mismo que leerlo.»

**El parche ya no hace falta.** Quité `clasificar: ['lo-dice']` de `FRASE_NO_APLICA` en `nucleo/lectura.js`. Queda solo `marcar-oracion: ['ninguna']`, que sí hace falta. Ajusté la prueba de `nucleo/lectura.test.js`.

**Prueba que impide que vuelva:** `banco.test.js` rechaza RV6 en cualquier previo `clasificar` y exige RV58 en «lo dice» cuando la clase es `se-deduce`. Comprobé que falla si se vuelve a poner RV6 en t010.

**Revisión:** un verificador clasificó a ciegas las 10 afirmaciones: 10 de 10 «se deduce». Confirmó RV58 y propuso pasar t034 de RV5 a RV58, porque la afirmación es una inferencia correcta y no un eco con otro sentido; lo apliqué. También suavizó la frase. Notó que t041 (la ventana) y t040 (una resta) están cerca de «lo dice»; los dejé, porque sus explicaciones ya dicen qué falta para que esté escrito.

## Tarea 2: dificultad 3 en tipología, resumen y contexto

Tres textos propios de dificultad 3 (tipo UNI) y grado 5, uno por unidad. Cada uno entró al final del índice de su módulo. Todas sus preguntas llevan la unidad del módulo.

| Texto | Unidad | Palabras | Preguntas / previos | Qué lo hace de nivel UNI |
| --- | --- | --- | --- | --- |
| t055 La riqueza que llegaba en barcos (la época del guano) | Tipología textual | 309 | 4 / 2 (propósito y clasificar) | Media página parece narrativa o descriptiva (Chincha, 1840, 1854, 1876), pero lo que organiza el texto es argumentar. La tesis es implícita y está repartida al final. Un distractor tiene el tipo correcto y la tesis equivocada (RV53). |
| t056 Lo que el mar caliente no explica (El Niño y la anchoveta) | Resumen y síntesis | 292 | 5 / 2 (marcar oración y clasificar) | Abre con la idea que va a corregir. La relación entre las ideas es de concesión con condición (el calor golpea siempre, pero la pesca decide si hay colapso), y para verla hay que comparar 1972 con 1997-98. Los distractores de resumen son muy cercanos: lista (RV43), relación cambiada (RV44) y parcial (RV3). |
| t057 Carta al reloj de la ventanilla 3 (columna irónica sobre una cola) | Texto y contexto | 303 | 5 / 2 (propósito y clasificar) | El destinatario que se nombra (el reloj) no es el real (la gerencia del segundo piso). Hay dos voces citadas que pueden confundirse con el emisor (RV50), un agradecimiento irónico (RV49) y una intención que recién aparece en la última oración. |

**Códigos que usan:** del informe, sin crear ninguno. RV58 está en los tres previos `clasificar`.

**Hechos:**
- **t055:** guano de Chincha, exportación desde 1840, abolición de la esclavitud y del tributo indígena en 1854 (decretos de Castilla como presidente provisorio, con bonos de manumisión desde 1855), empréstitos de 1870 y 1872, cese de pagos en 1876 y la «prosperidad falaz» de Basadre. Fuentes: Cushman, Bonilla, Contreras y Cueto, Hunt, Marichal y Basadre. El tomo de Basadre quedó en el IV, con la página por verificar.
- **t056:** afloramiento, colapso de 1972 (El Niño más la sobrepesca), capturas de más de 10 millones de toneladas a fines de los 60 y en 1970, y El Niño de 1997-98 más intenso. Fuentes: Chavez y otros 2008 y 2003, Ñiquen y Bouchon 2004, Clark 1977, Pauly y Tsukayama 1987, McPhaden 1999 y Sandweiss y otros 1996. La tesis va matizada («no parece ser… sino sobre todo»), y en `hechos` está anotado que el texto simplifica: el cambio de régimen decenal y las vedas también pesaron.
- **t057:** no tiene datos del mundo. La oficina, la gerencia y la columnista son inventadas, y el verificador buscó los nombres sin hallar coincidencias reales.

## Tarea 3: lápiz y papel de los módulos de lectura

**`herramientas/papel-lectura.js`** arma `plantillas/<módulo>/papel.json` para los siete módulos de formato `lectura`, y `npm run catalogo` lo corre. Las siete fichas pasan de `papel: null` a `papel: "papel.json"`.

**Formato.** Es el de siempre (`titulo`, `indicacion` y `problemas` con `enunciado`, `respuesta` y `pasos`), así que la ruta `#/papel/` y el botón «✎ Papel» funcionan sin cambios. Cada problema es un texto con todas sus preguntas, o un ejercicio suelto, y trae dos campos más:
- `texto`: título, oraciones numeradas por párrafo, figuras (tabla, barras y recuadros) e idioma. En un ejercicio va `lineas`.
- `preguntas`: el paso previo como consigna («Antes de mirar las alternativas, escribe el número de la oración…» o «decide… Elige: …»), el enunciado y las alternativas con letra.

La regla 3 pasa al papel así: la indicación pide tapar las alternativas mientras se responde el previo, y la respuesta del previo va con la clave. La clave (`respuesta`) da la letra de cada pregunta, y los `pasos` dan la respuesta del previo y la explicación de cada correcta.

**Decisiones:**
- Las alternativas se barajan con la semilla fija `'papel'`. Si no, la clave saldría casi siempre A, porque en el banco la correcta suele ir primera.
- La entrada y la salida (t000a y t000b) no van al papel: son la prueba del curso.
- **Cuántos problemas.** La regla 6 pide de 5 a 10 problemas. En lectura, un problema es un texto con 3 a 5 preguntas:
  - Cada módulo de verbal B lleva todos sus textos: 4 o 5, que son entre 13 y 20 preguntas.
  - `lectura-verbal` tiene 45 ítems. Lleva 10, elegidos uno por uno para cubrir sus 12 unidades: 6 textos y 4 ejercicios (analogía, término excluido, plan de redacción y eliminación).
  - La prueba exige de 4 a 10 problemas y al menos 10 preguntas. **Para Gerson:** confirmar si así está bien, o si prefiere contar preguntas.
- `vPapel` (`app/app.js`) dibuja el texto, las figuras (con las clases que ya usa el lector) y las preguntas. Los pasos de lectura van sin numeración automática, porque ya dicen «Pregunta 2.». Al imprimir, la respuesta se esconde como en las escenas.

**Prueba nueva, `herramientas/papel-lectura.test.js`:**
- cada `papel.json` está al día con el banco;
- tiene la misma cantidad de preguntas y previos que el banco, con las mismas alternativas;
- la clave coincide con la correcta del banco;
- las oraciones van numeradas;
- no están la entrada ni la salida;
- el previo no usa verbos de pantalla («toca», «arrastra»);
- `lectura-verbal` cubre todas sus unidades;
- ninguna letra pasa del 40 % de las claves.

**Playwright a 390 × 844:**
- el papel de discontinuos (con tabla, barras e infografía), el de `lectura-verbal` (con ejercicios) y el de inglés (`lang="en"`) se ven sin desborde horizontal y sin errores de consola;
- la página del curso muestra los 17 botones «✎ Papel»;
- el lector sigue funcionando.

Revisé las capturas: las oraciones van con su número volado, la tabla entra en el ancho y el previo va en un recuadro antes del enunciado.

**El estado de los módulos sigue en `borrador`.** Ya tienen papel, que era lo que les faltaba según `catalogo.test.js`. Pasarlos a otro estado lo decide la principal.

## Subagentes (método de cuatro manos)

- **Tarea 1:**
  - Un verificador a ciegas clasificó las 10 afirmaciones y revisó RV58 y su frase.
  - Yo armé el código, la frase, la prueba y quité el parche.
- **Tarea 2:**
  - **Tres constructores**, uno por texto, con un brief común (está en el scratchpad de la sesión y no sobrevive al contenedor). Escribieron con `revision: null` y después aplicaron las correcciones.
  - **Tres verificadores a ciegas que también revisaron el contenido.** Resolvieron una versión sin claves y con las alternativas barajadas (armada con la misma consigna del papel), y después compararon con las claves.
    - **t055** (4 de 4 preguntas y 2 de 2 previos). P4 se apoyaba sobre todo en el descarte: se agregó a o10 que el Estado «ya no necesitaba cobrarle a la población». P1 y P3 se resolvían buscando la frase de o13, así que se reescribieron sus correctas. Se corrigió el hecho de 1854 (los dueños se pagaron después, con bonos) y un código de P2 (RV13 pasó a RV42, y el que ya era RV42 pasó a RV4).
    - **t056** (5 de 5 y 2 de 2). La tesis de o9 era demasiado tajante para las fuentes y se matizó. «Hunde» tenía dos sentidos y pasó a «lleva al colapso». El previo aceptaba o11, que es la recomendación, y castigaba o9, que es la tesis: ahora acepta o9, o10 o «ninguna». Las capturas eran de fines de los 60, no de los 70. P3 repetía P1 y pasó a ser una pregunta de estructura (para qué compara 1972 con 1997-98).
    - **t057** (5 de 5 y 2 de 2). El texto no decía «municipalidad». La semana no cerraba (cola de lunes a miércoles con cita el jueves). La oración 12 regalaba el destinatario y se volvió una pista. Un distractor fácil de P2 se cambió por uno más fino.
  - **Un segundo verificador a ciegas** revisó los ítems que cambiaron de fondo: 9 de 9 y 2 de 2. En t057, la sonda del previo de P5 repetía la alternativa correcta, y la cambié por otra deducción («Lo que anunció el gerente en la radio no se cumplía en la ventanilla 3»).
  - **Yo:**
    - leí las tres versiones finales con sus claves y códigos;
    - decidí qué correcciones aplicar;
    - dejé RV5 en el distractor «De pie frente al reloj» de t057 P2, porque su explicación es de eco («frente a usted», oración 8). El segundo verificador lo ve débil pero aceptable: RV49 ya lo usa otro distractor de la misma pregunta.
- **Tarea 3:** la hice yo. La verificación son la prueba nueva y Playwright. El papel de los textos nuevos también se generó y se vio a 390 px: 5 problemas por módulo, sin desborde.

## Dudas y pendientes para Gerson

1. **RV58 no tiene dato.** Es hipótesis con contexto indirecto (memoria de oraciones, Bransford y otros 1972, citado de memoria: falta verificar las páginas). Se confirma con los previos del colegio: si muchos responden «lo dice» ante lo que se deduce, el código sirve.
2. **Papel de lectura: ¿cuenta textos o preguntas?** La regla 6 pide de 5 a 10 problemas. Un módulo de verbal B tiene 4 o 5 textos, que son de 13 a 20 preguntas. Lo dejé como «4 a 10 textos y al menos 10 preguntas». Si prefieres otra regla, se cambia en `papel-lectura.test.js`.
3. **lectura-verbal en papel lleva 10 de 45 ítems,** elegidos para cubrir sus 12 unidades: t007, t008, t009, t012, t017 y t018, más e002, e005, e011 y e014. Si quieres más hojas (por ejemplo, una por unidad), el generador puede armar varias.
4. **Hechos por confirmar:** el tomo y la página de Basadre para la «prosperidad falaz» (t055), y las páginas de Clark 1977 y de Ñiquen y Bouchon 2004 (t056).
5. **t040 y t041 quedan cerca de «lo dice».** Uno es una resta y el otro un consejo que se lee como comparación. El verificador los aceptó como «se deduce». Si los datos del colegio muestran muchos «lo dice» ahí, convendría cambiar las sondas.
6. **Estado de los módulos.** Los siete siguen en `borrador`, aunque ya tienen papel. ¿Los pasamos a otro estado?

## Pedidos para la integración

- Subir `VERSION` en `app/sw.js`: cambiaron `app/app.js` y `app/estilos.css`. Los `papel.json` ya entran en `archivos` del catálogo, así que se guardan para usarse sin conexión.
- `CLAUDE.md` y `docs/pendientes.md`:
  - los códigos van hasta RV58;
  - los módulos de lectura tienen papel;
  - tipología, resumen y contexto tienen un texto de dificultad 3;
  - sacar de «Verbal B, dudas» lo de RV6, lo de la dificultad 3 y lo del papel;
  - sumar la línea de esta rutina a la Historia.
- `npm run catalogo` ya está corrido. Si al integrar cambia un índice, hay que volver a correrlo, porque regenera el papel.
