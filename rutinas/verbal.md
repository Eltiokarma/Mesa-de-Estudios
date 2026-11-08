# Rutina de razonamiento verbal: reporte

Cada ejecución hace la primera pieza que falte:

1. [x] Informe `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`
2. [x] Diseño del formato lectura, `docs/formato-lectura.md`
3. [x] Banco de textos propios en `contenido/razonamiento-verbal/` (30 de 30, más la pareja de entrada y salida y 15 ejercicios sueltos)
4. [x] Guía para profesores, `docs/guia-profesores.md` (adelantada: se hizo antes de llegar a 30 textos)

---

## 6 nov 2026 · Pieza 1: el informe

**Qué hice.** Escribí el informe de ideas erróneas de razonamiento verbal con la misma estructura de los otros de `docs/investigacion/` (resumen, de dónde salen los datos, catálogo con respaldo, lo que no tiene respaldo, propuesta, huecos y fuentes). Son 32 errores, de RV1 a RV32:

- Idea principal (RV1 a RV4), inferencia, compatibilidad y extrapolación (RV5 a RV12), intención del autor (RV13 y RV14).
- Analogías (RV15 a RV17), sinónimos y antónimos en contexto (RV18 a RV21), término excluido (RV22), oraciones incompletas (RV23).
- Conectores y referentes (RV24 a RV27), plan de redacción y eliminación de oraciones (RV28 a RV32).

Trae además una sección de contexto peruano (PISA 2018 y 2022, evaluación muestral de 2.º de secundaria, ingresantes de la UNA Puno) que va a servir para la guía de profesores, y una tabla de qué distractores usar por tipo de pregunta, que es la base de la pieza 2.

**Lo más importante, de frente:** ningún error llegó a "documentado". Lo mejor respaldado (detalle y "demasiado general" en idea principal, eco literal, asociación en analogías, contracausal leído como causal, último sustantivo como referente) es "parcial": hay estudios, pero de otra población (japoneses leyendo en inglés, niños) o sin el porcentaje a la vista. Plan de redacción, eliminación de oraciones, extrapolación, negación y términos absolutos son hipótesis. No apareció ningún estudio de distractores con postulantes peruanos. Eso lo tiene que medir la app en el colegio.

**Archivos:** `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (nuevo) y este reporte.

**Pruebas:** `npm test`, 535 en verde (no toqué código).

**Subagentes:**
- Tres investigadores en paralelo (comprensión lectora y datos peruanos; léxico y analogías; conectores, cohesión y ordenamiento). Ninguno pudo abrir originales: la red de la sesión no resuelve umc.minedu.gob.pe, scielo, redalyc, ncbi, eprints.whiterose, boris.unibe ni nite.org.il. Todo sale de resúmenes del buscador.
- Un revisor aparte, que verificó 12 citas por su cuenta y revisó etiquetas, ejemplos y lenguaje. Apliqué lo que encontró: el 50,4 % de PISA 2022 no se confirmó (quedó "cerca del 50 %"); Ehrlich y otros estaba mal puesto en RV9 (pasó a RV27); RV6 bajó a hipótesis; la cifra 10 % y 28 % de Yuill y Oakhill no tenía fuente identificable y la saqué; "el último personaje mencionado" no está en el resumen de Borzone y quedó marcado así; corregí autora y revista de Valero-Ancco, volumen de Ludewig, número de informe de McClure y Steffensen; y rehíce siete ejemplos ambiguos o con errores (quinua en suelo salino, totora y turismo, la papa "europea", alpaca y fibra, helada y escarcha, instrumentos andinos, "levantar la huelga").

**Pendiente:**
- Confirmar cifras con los originales cuando la red lo permita (lista en "Huecos" del informe). Si Gerson quiere que se haga, hay que permitir en la red del entorno: umc.minedu.gob.pe, scielo.org.ar, scielo.org.mx, redalyc.org, eldorado.tu-dortmund.de, journals.sagepub.com, core.ac.uk y nite.org.il.
- Siguiente ejecución: pieza 2, `docs/formato-lectura.md`.

**Pedidos para la integración** (no los toqué, son de la conversación principal):
- `catalogo/cursos/razonamiento-verbal.json`: llenar `"investigacion"` de las unidades con `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (todas menos `textos-discontinuos`, `lectura-en-ingles`, `definiciones`, `tipologia-textual`, `resumen-y-sintesis` y `textos-filosoficos-y-cientificos`, que el informe no cubre o cubre solo de paso).
- `docs/pendientes.md`, fila "ra2 y pl4": cambiar "Sin informe" por el nombre del informe.
- `CLAUDE.md`, sección Historia: agregar el informe de razonamiento verbal a la lista de informes.
- `fuentes/por-conseguir.md`: agregar Terao e Ishii (2020), Ludewig y otros (2023), Zunino (2016), Borzone (2005), Cain y Nash (2011), NITE e239 y los informes de la UMC para el docente de secundaria.

---

## 6 nov 2026 · Pieza 2: el diseño del formato lectura

**Qué hice.** Escribí `docs/formato-lectura.md`:
- la pantalla (celular primero, con el texto plegado arriba y una hoja que sube para releer; dos columnas en el laboratorio);
- el **paso previo** antes de las alternativas, de seis tipos: marcar oración, clasificar una afirmación, elegir la relación de un conector, la relación de una analogía con su sentido, el propósito del autor y ordenar tarjetas en el plan de redacción. Cada uno trae en el JSON la respuesta aceptada y un código RV por respuesta incorrecta, así que calificar es buscar en una tabla;
- la explicación pintada en el texto con tres colores de la familia de variables;
- el **formato JSON del banco**, con un texto de ejemplo completo (t001, "El frío que conserva", 173 palabras, 3 preguntas);
- los eventos de medición y cómo lo cargaría un módulo, paso por paso.

También agregué **RV33** al informe ("se le atribuye al autor una postura que no toma", hipótesis), porque el ejemplo la necesitaba y no existía.

**Lo que decidí, de frente:**
- El paso previo se registra como evento propio (`tipo: 'previo'`), **no como predicción**: si no, se sumaba al acierto y contaba dos veces el mismo error.
- En `opcion` va la posición de la alternativa en el banco, no la letra, porque las letras se barajan para cada alumno.
- Las pruebas de entrada y salida van sin paso previo y con semilla fija.

**Pruebas:** `npm test`, 762 en verde (no toqué código). Validé el JSON del ejemplo con un guion: es válido, los códigos existen, las referencias apuntan a oraciones reales, no hay códigos repetidos y la correcta nunca es la más larga.

**Subagentes:**
- Un revisor del diseño contra el código real. Encontró cuatro problemas graves, todos corregidos:
  - el banco en `/contenido/` no se serviría sin conexión, porque `sw.js` solo atiende `app`, `plantillas` y `nucleo`;
  - el paso previo contaminaba el acierto;
  - la letra registrada no se puede comparar entre alumnos;
  - el esquema del paso previo estaba incompleto.
- Un revisor que resolvió el ejemplo a ciegas. Acertó todo, pero vio que la correcta era la más larga (agregué la regla 10 del banco) y que la idea principal admitía dos oraciones (ahora se aceptan las dos). Corregí los datos del chuño (secado al sol, chuño negro) y cambié "malograrse" por "echarse a perder".
- Una segunda revisión del documento corregido. Confirmó que lo grave quedó resuelto y encontró huecos menores, también corregidos:
  - faltaban las explicaciones del paso previo (ahora están, más `frases.json` por código);
  - los roles de "marcar oración" no cerraban;
  - las analogías no tenían relaciones inversas;
  - tres códigos del ejemplo estaban mal puestos;
  - la vista de papel necesita un ajuste.

**Pendiente:**
- La pieza 3, el banco de textos. La primera ejecución arranca con t001 (revisión incluida), más 5 textos nuevos, el `indice.json`, `frases.json` y `banco.test.js` con las 12 reglas de la sección 5.5.
- `codigos.json` lo genera un guion en `herramientas/`, que está fuera de mi alcance. Mientras no exista, `banco.test.js` puede leer los códigos directo del informe.

**Pedidos para la integración:** los de la sección 8 de `docs/formato-lectura.md`. Los más importantes:
- `contenido` en la expresión del `fetch` de `app/sw.js`;
- `REQUERIDOS.lectura` en `catalogo.test.js`;
- la rama de lectura en `construir-catalogo.js` (antes de crear la ficha);
- `nucleo/lectura.js` y `app/lectura.js`;
- aceptar el respaldo `parcial`;
- unidades para término excluido y oraciones incompletas;
- ampliar el alcance de la rutina a `herramientas/codigos-verbal.js`, si se quiere que lo escriba ella.

**Red:** Gerson no pudo agregar los dominios de revistas al entorno. Probé Google Drive como alternativa (lo usa `fuentes/descargar.sh`), pero también está bloqueado en este entorno. Las cifras del informe siguen "por verificar".

---

## 6 nov 2026 · Pieza 3, primera tanda: 6 textos

**Qué hice.** Armé el banco en `contenido/razonamiento-verbal/`:

| Texto | Tema | Preguntas | Pasos previos |
| --- | --- | --- | --- |
| t001 El frío que conserva | Chuño y heladas | idea principal, sentido contextual, intención | marcar oración, propósito |
| t002 El puente que se teje cada año | Q'eswachaka | idea principal, inferencia, sentido contextual, extrapolación | marcar oración, clasificar |
| t003 El agua prestada | Glaciares de la Cordillera Blanca y el río Santa | idea principal, conector, compatibilidad, intención | marcar oración, relación, clasificar |
| t004 Cuerdas que guardan cuentas | Quipus, texto dialéctico | idea principal, compatibilidad, extrapolación | marcar oración, clasificar |
| t005 Dos lenguas no se estorban | Transmitir el quechua y el aimara | tesis, intención, referente, sentido contextual | marcar oración, propósito |
| t006 El rojo que vino de la tuna | Cochinilla | idea principal, inferencia, conector | marcar oración, clasificar, relación |

En total son 21 preguntas y 14 pasos previos, con 19 códigos RV distintos en los distractores. Los que más se usan son RV2 y RV5 (9 veces cada uno) y RV3 (7). El texto más corto tiene 163 palabras y el más largo, unas 210.

Archivos nuevos:
- `textos/t001.json` a `t006.json`;
- `indice.json`, con los 6 textos aprobados;
- `frases.json`, con una frase para el alumno por cada uno de los 34 códigos;
- `banco.test.js`, el validador con las reglas del diseño (5.5);
- `LEEME.md`.

En el informe agregué RV34 ("se queda en lo literal: no acepta lo que se deduce"), que el clasificador de afirmaciones necesitaba. En el diseño: los códigos del paso previo pueden ser `null` cuando el informe no tiene un error para esa respuesta; las oraciones llevan número en pantalla; y el ejemplo de t001 se corrigió.

**Pruebas:** `npm test`, 837 en verde, incluido `banco.test.js`. El validador lee los códigos del propio informe y las unidades del catálogo.

**Subagentes:**
- **Tres revisores a ciegas**, cada uno con dos textos. Primero resolvieron sin ver las claves y después compararon. **Coincidieron con la clave en los 21 ítems y en los 14 pasos previos.** Igual encontraron cosas que había que arreglar:
  - **Un hecho falso en t001.** Las heladas que arruinan la papa son las de la campaña (noviembre a marzo). En junio la papa ya está cosechada, y por eso esas heladas sirven para el chuño. Lo corregí también en el ejemplo del diseño.
  - **Datos desactualizados o exagerados.** En el Santa, la baja del caudal de estiaje ya ocurre: 7 de 9 subcuencas ya pasaron el pico (Baraer y otros, 2012). En t004, "administraron un Estado con cuerdas" exageraba. En t006, el ejemplo de cochinilla en Paracas estaba mal (abunda desde Wari).
  - **Distractores defendibles:** en t002, el de extrapolación y "un daño", que es un sentido de "pérdida" en el diccionario; en t003, "los reservorios detendrán…"; en t004, "los quipus todavía se usan", que es cierto.
  - **Códigos mal puestos** (RV7 por RV33 en t005, entre otros), un enunciado de t006 que dejaba defendible otra alternativa y una clave de t003 demasiado absoluta.
- **Una cuarta verificación** de los ítems cambiados. Pidió otros cinco ajustes y los apliqué. No le hice caso en uno: pasar a RV9 un distractor de t003 dejaba dos RV9 en la misma pregunta, así que quedó en RV7.

Cada texto lleva en `revision` sus notas, con lo que se cambió.

**Pendiente:**
- **24 textos más**, en cuatro ejecuciones de 6. Conviene cubrir lo que falta:
  - más incompatibilidad, extrapolación y referentes;
  - textos de grado 5 y dificultad 3 (tipo UNI);
  - textos narrativos;
  - temas de ciencia (física y química de todos los días), de historia republicana y del Perú amazónico y costeño, no solo andino.
- **La pareja de textos de entrada y salida** (`t000a` y `t000b`), en una de las próximas tandas. Los dos tienen que ser paralelos (mismos tipos de pregunta y dificultad parecida) y van sin paso previo.
- **Las preguntas de incompatibilidad** ("Es incompatible con el texto…") tienen un problema de códigos. Ahí el distractor es una afirmación compatible, y el informe no tiene un error para "marcar como incompatible algo compatible". Por eso esta tanda usó solo compatibilidad. Si se quiere la otra forma, hace falta un código nuevo; lo propondría en la próxima tanda.
- Algunas fuentes de `hechos` siguen "por confirmar con una fuente académica" (chuño: CIP o FAO).

**Pedidos para la integración** (además de los de la sección 8 del diseño):
- Mostrar en pantalla el número de cada oración (ya está en el diseño, sección 2), porque las explicaciones las citan por número.
- Cuando entre `catalogo.test.js` con el formato lectura, `banco.test.js` ya está en `contenido/razonamiento-verbal/` y corre con `npm test`.

---

## 6 nov 2026 · Pieza 3, correcciones de la integración y pareja de entrada y salida

**Qué hice.** Apliqué los 8 pedidos que mandó la conversación principal después de su revisión del banco:

1. **Explicaciones del paso previo para cada respuesta incorrecta.** Ahora `banco.test.js` lo exige: en "marcar oración", una por cada oración no aceptada y otra para "ninguna"; en los demás tipos, una por cada opción con código.
2. **Conectores sin la respuesta a la vista.** En t003 (oración 6) y t006 (oración 7) saqué el conector del texto. La pregunta ahora es "¿qué conector podría ir al comienzo?", con "Sin embargo"/"No obstante", "Por eso" (RV24), "Además" (RV26) y "Dicho de otro modo" (**RV35**, código nuevo en el informe, hipótesis: conector de otra clase elegido por descarte).
3. **Sondas nuevas** que no anticipan la correcta: en t002, "techar con q'oya"; en t006, "el Perú produce mucha cochinilla porque hay más tunas". Las dos son "no se sabe". La sonda que propuso la principal para t002 ("los jóvenes aprenden en la escuela") el revisor la encontró defendible como "lo contradice", así que la cambié.
4. **Intención antes que idea principal** en t001, t003 y t005. La correcta de intención se reescribió para que no regale la idea principal.
5. **t004:** distractor nuevo sobre la segunda postura. Uso "conocieran" y no "recitaran", porque esa palabra no está en el texto.
6. **t005:** "un obstáculo para progresar" pasa a RV10.
7. **Correcciones menores:** "aimaras"; t002 o5; RV7 en t002 p4; t006 o3; la explicación del previo de t001; RV1 más corto en t001 y t006; enunciado de t005 p3 como pregunta.
8. **La pareja de entrada y salida:** t000a ("Islas que flotan", los uros) y t000b ("Escalones para sembrar", los andenes). Son formas paralelas: la misma estructura oración por oración, 3 preguntas en el mismo orden (idea principal, inferencia y sentido contextual), los mismos códigos RV en los distractores, sin paso previo y con 162 y 163 palabras. Están en `indice.json` como `entrada` y `salida`. `banco.test.js` comprueba ahora que la pareja sea paralela (mismos tipos y mismos códigos, pregunta por pregunta).

Todos los textos pasaron a `version: 2`, para que la medición no mezcle los datos de antes y después.

**Pruebas:** el validador del banco da 12 de 12. **`npm test` da 1048 de 1053: fallan 5 pruebas fuera de mi alcance**, y las dos causas las piden los mismos pedidos:
- `app/app.test.js`: "app/datos/catalogo.json está al día". El catálogo generado quedó viejo porque cambió el banco. Se arregla con `npm run catalogo`, que escribe en `app/`.
- `nucleo/lectura.test.js`, 4 pruebas. Dan por hecho que `TEXTOS[0].preguntas[0]` tiene un paso previo de marcar oración, pero ahora el primer texto en orden es `t000a` (sin paso previo, como pide el diseño) y la primera pregunta de t001 es la de intención (pedido 4). Lo comprobé: sacando t000a y t000b, siguen fallando 3, por el cambio de orden. La corrección es que esas pruebas busquen la primera pregunta con `previo.tipo === 'marcar-oracion'` entre los textos del índice, no `TEXTOS[0].preguntas[0]`.

**Subagentes:**
- **Revisor de la pareja de entrada y salida, a ciegas:** 6 de 6. Encontró tres desequilibrios entre las formas, todos corregidos:
  - en p2, la forma B era más directa;
  - en el RV7 de B, "al año siguiente" sonaba casi razonable;
  - en p3, la correcta de B era una paráfrasis más fácil.
  También corrigió la frecuencia con que se renueva la totora (varias veces al año, no cada pocas semanas). No le hice caso en una cosa: pedía poner "la isla se va hundiendo" en el texto, pero eso dejaba literal la respuesta de inferencia. Puse "la isla va bajando".
- **Revisor de los cambios en t001 a t006, a ciegas:** coincidió con todas las claves. Encontró las dos sondas discutibles de arriba, que la intención todavía regalaba la idea principal en t001, t003 y t005, una cita mal hecha en t003 y la palabra "recitaran" en t004. Todo corregido.

**Pendiente:**
- 22 textos de práctica más (hay 6 de práctica y la pareja de pruebas; la meta es 30 de práctica).
- Lo que ya estaba anotado: incompatibilidad con código propio, grado 5 y dificultad 3, textos narrativos y temas de la costa y la Amazonía.

**Pedidos para la integración:**
- Correr `npm run catalogo`.
- Ajustar las 4 pruebas de `nucleo/lectura.test.js` como dice arriba.

---

## 6 nov 2026 (ejecución de la tarde) · Pieza 3, segunda tanda: t007 a t012

**Estado al empezar.** La ejecución anterior quedó completa y revisada. La principal todavía no había integrado mis dos últimos commits (t000a, t000b y las correcciones), así que las 5 pruebas de fuera de mi alcance siguen fallando por lo mismo de antes (ver la entrada anterior).

**Qué hice.** Seis textos de práctica nuevos, elegidos para cubrir lo que faltaba:

| Texto | Tema | Tipo, grado y dificultad | Preguntas |
| --- | --- | --- | --- |
| t007 El fruto que necesita al bosque | Castaña, abejas y orquídeas (Amazonía) | argumentativo, 4.º, 2 | idea principal, inferencia, **incompatibilidad**, extrapolación |
| t008 Hervir no es lo mismo que cocinar | Hervir en Juliaca y la olla a presión | expositivo, 3.º, 1 | idea principal, referente, conector, sentido contextual |
| t009 La riqueza que salía de las islas | La época del guano y la «prosperidad falaz» | argumentativo, **5.º, 3 (tipo UNI)** | intención, tesis, compatibilidad dialéctica, sentido contextual (falaz/fugaz), extrapolación |
| t010 La balanza de la feria | Relato en la feria de Juliaca | **narrativo**, 3.º, 1 | idea central, inferencia, sentido contextual, intención |
| t011 El desierto junto al mar | Corriente de Humboldt, garúa y lomas (costa) | expositivo, 4.º, 2 | idea principal, inferencia, **incompatibilidad**, extrapolación |
| t012 Una pizca en el salero | Sal yodada y bocio | argumentativo, **5.º, 3 (tipo UNI)** | intención, tesis, compatibilidad, sentido contextual, extrapolación |

Son 26 preguntas y 16 pasos previos, todos con su explicación para cada respuesta incorrecta.

Para las preguntas de incompatibilidad agregué **RV36** al informe (hipótesis): "se marca como incompatible lo que el texto solo no menciona". Con eso, los distractores de esas preguntas son RV10 (una frase compatible con un "no"), RV36 (algo no mencionado) y RV8 (algo compatible que va contra lo que se cree). `codigos.json` se regeneró con `herramientas/codigos-verbal.js` y ahora tiene 36 códigos; `frases.json` también tiene RV36.

**Pruebas:**
- `banco.test.js` da 18 de 18, y `nucleo/lectura.js` (`validar`) acepta los seis textos.
- `npm test` da 1393 de 1398. Las 5 que fallan son las mismas de antes y no dependen de esta tanda.

**Subagentes:**
- **Tres revisores a ciegas**, dos textos cada uno. Coincidieron con la clave en los 26 ítems y en los 16 pasos previos. Lo que encontraron, ya corregido:
  - **t009:** la sonda "el autor cree que la abolición no tuvo importancia" no era indiscutible y se cambió por otra sobre la venta estatal del guano. Además, tres distractores se descartaban enseguida, así que el texto no llegaba a dificultad alta; se reemplazaron por otros más cercanos.
  - **t010:** el distractor "la señora lo llevaba en su bolsa" era defendible (que el paquete fuera suyo es parte de la razón). La correcta ahora lo incluye, y el distractor cambió por uno que choca con el relato.
  - **t012:** "el Estado habría ahorrado en controles" era defendible y se reemplazó. Dos distractores eran demasiado fáciles.
  - **t007:** las plantaciones no producen poco solo por la polinización (también influyen el suelo y el manejo); quedó "entre otras razones".
  - **t008:** "hierve más fría" pasó a "hierve a menor temperatura". Un distractor de referente no tenía código que lo describiera y cambió por uno de saber del mundo.
- **Una cuarta verificación** de los cambios: claves únicas. Ajusté cuatro explicaciones, un enunciado ("idea central" en vez de "tema") y un código. En dos casos no cambié el código que proponía, porque quedaba repetido en la misma pregunta; en su lugar corregí la explicación.

Los 12 textos de práctica ya están en el índice.

**Pendiente:**
- 18 textos de práctica más para llegar a 30, en tres tandas.
- Faltan más textos narrativos, temas de historia antigua o contemporánea fuera del sur andino y algún texto discontinuo (tabla o gráfico), cuando el formato lo admita.
- En t008, el error de "tomar como referente algo que viene después" no tiene código en el informe. Si vuelve a aparecer, propongo uno.

**Pedidos para la integración** (siguen los de la entrada anterior):
- Integrar `rutina/verbal`.
- Correr `npm run catalogo`.
- Ajustar las 4 pruebas de `nucleo/lectura.test.js` que dan por hecho que `TEXTOS[0].preguntas[0]` tiene un paso previo de marcar oración.

---

## 7 nov 2026 · Pieza 3, tercera tanda: t013 a t018

**Estado al empezar.** La nueva conversación principal integró todo hasta 1457604 (12 textos, t000a y t000b), y `npm test` daba 1567 de 1567. Me pidió seguir con el plan y no pasar de 2 subagentes a la vez; los revisores fueron 2 a la vez.

**Qué hice.** Seis textos de práctica:

| Texto | Tema | Tipo, grado y dificultad | Preguntas |
| --- | --- | --- | --- |
| t013 La ciudad sin murallas | Caral y el debate sobre una sociedad sin guerra | argumentativo (dialéctico), 4.º, 2 | idea principal, compatibilidad, extrapolación, sentido contextual |
| t014 La quena de Mateo | Relato: paciencia | narrativo, 3.º, 1 | idea central, inferencia, sentido contextual |
| t015 ¿Celular en el aula? | Dos posturas y una síntesis | argumentativo (dialéctico), 4.º, 2 | tesis, compatibilidad, conector, extrapolación |
| t016 La memoria del cuerpo | Vacunas e inmunidad de grupo | expositivo, 3.º, 1 | idea principal, conector, inferencia, sentido contextual |
| t017 La ciudad de barro y la lluvia | Chan Chan y qué es conservar | argumentativo, **5.º, 3** | intención, tesis, sentido contextual, incompatibilidad, extrapolación |
| t018 Ríos que vuelan | El bosque que hace llover | argumentativo, **5.º, 3** | idea principal, referente, inferencia, extrapolación |

Son 24 preguntas y 16 pasos previos, todos con su explicación para cada respuesta incorrecta. Los conectores siguen sin estar a la vista en el texto (t015 y t016): se pregunta qué conector podría ir.

En el informe amplié la definición de RV10 para que cubra también el caso inverso: en incompatibilidad, marcar como incompatible una frase compatible solo porque tiene un "no". `codigos.json` se regeneró.

**Pruebas:**
- `banco.test.js` da 24 de 24, y `validar` del núcleo acepta los seis textos.
- `npm test` da 1572 de 1573. **Falla solo la prueba de "app/datos/catalogo.json está al día"**, porque el índice tiene 6 textos más. Se arregla con `npm run catalogo`, que escribe en `app/`, fuera de mi alcance.

**Subagentes** (2 revisores a la vez y una verificación final):
- **Revisor de t013 a t015, a ciegas:** coincidió en los 17 ítems y pasos previos. Encontró una frase de t013 que sonaba contradictoria, un distractor de compatibilidad débil y códigos del paso previo que no eran coherentes con los distractores.
- **Revisor de t016 a t018, a ciegas:**
  - **Falló dos pasos previos, y tenía razón.** En t016 y t018 marcó "ninguna la dice completa" porque la idea principal junta dos oraciones. Ahora "ninguna" también se acepta en esos dos.
  - En t018 dudó en la pregunta de inferencia porque la alternativa literal era defendible, así que la reescribí entera, y cambié la sonda del paso previo.
  - En t017, varios distractores se descartaban enseguida y no llegaba a dificultad alta; puse otros más cercanos.
- **Verificación final:** seis ajustes chicos (evidencias, dos códigos y un enunciado). Todos aplicados.

**Pendiente:**
- 12 textos de práctica más para llegar a 30, en dos tandas.
- Después, la pieza 4: la guía para profesores. Tiene que explicar `?colegio=`, `?salida=`, `?soluciones=` y "Otro alumno en esta PC", como pidió la principal.
- Los ejercicios sueltos (analogías, plan de redacción, eliminación, término excluido, oraciones incompletas), que el núcleo ya califica, quedan para después de los 30 textos o para cuando la principal los priorice.

**Pedidos para la integración:**
- Integrar `rutina/verbal`.
- Correr `npm run catalogo` (es la única prueba que falla).

---

## 7 nov 2026 · Pieza 4, adelantada: la guía para profesores

**Por qué antes de los 30 textos.** La conversación principal pidió la guía primero, por ser lo más urgente para el colegio. Lo hice así porque está dentro de mi alcance. Lo demás que pidió (seguir sin parar con las dos tandas de textos que faltan y con los ejercicios sueltos) queda a la espera de que Gerson lo confirme, porque cambia el ritmo de la rutina, que hace una pieza por ejecución.

**Qué hice.** `docs/guia-profesores.md`, unas 4 páginas en español claro, escrita después de leer `app/app.js`, `app/prueba.js`, `app/lectura.js`, `nucleo/medicion.js` y `herramientas/analizar-medicion.js`. Explica:
- qué es la app y los tres tipos de actividad;
- qué preparar antes de la primera clase: la dirección, el código del colegio y el enlace `…/app/?colegio=ABC`;
- las pruebas de entrada y salida: `?salida=<curso>`, `=todas`, varios cursos separados por comas, `?soluciones=<curso>`, los nombres de los 8 cursos y las formas A y B;
- "Otro alumno en esta PC";
- una clase de 45 minutos con una escena;
- cómo descargar y juntar los datos, con un ejemplo real de `analizar-medicion.js` (datos inventados, simplificados) y cómo leer la ganancia de Hake;
- qué mide, qué no guarda, lo que la app no hace y problemas frecuentes.

**Pruebas:** `npm test` da 2110 de 2110 (no toqué código).

**Subagente:** un revisor contrastó cada afirmación con el código y encontró 13 problemas, todos corregidos. Los más graves:
- Decía que se podía probar con `npm run dev` y `localhost`, pero `herramientas/servidor.js` escucha solo en 127.0.0.1, así que los celulares no llegan. Ahora dice que el equipo la instala en el laboratorio.
- Decía que "Borrar mi avance" no borra las pruebas, pero en razonamiento verbal sí las borra (ver los pedidos).
- Decía que "Ahora no" pospone la prueba hasta la próxima vez que se abre la app; en realidad dura hasta que se cierra el navegador (`sessionStorage`). Además, verbal no tiene "Ahora no".
- `?soluciones=` no muestra la revisión en verbal.
- El ejemplo de salida tenía un 25 %, imposible con 3 alumnos y 10 preguntas. Lo regeneré con la herramienta real.
- El comando de Node pasó a un recuadro "para el equipo técnico", porque un profesor no lo va a correr.

**Pedidos para la integración** (son fallos del código que salieron al escribir la guía; ahora la guía los avisa como limitaciones):
1. **"Borrar mi avance" borra las pruebas de razonamiento verbal.** En `vPerfil` se vacía `practica: {}`, y ahí guarda `app/lectura.js` su `entrada` y su `salida`. Las de los demás cursos se conservan (`pruebas: est.pruebas`). Hay que conservar también las de lectura. Cuando se arregle, hay que quitar el aviso de la sección 4 de la guía.
2. **Verbal no tiene "Ahora no" en la entrada**, a diferencia de los otros cursos. Decidir si debe tenerlo.
3. **`?soluciones=razonamiento-verbal` no muestra revisión pregunta por pregunta.** Si se implementa, hay que quitar la nota de la tabla de la sección 4.
4. **El Banco Óptico pide fuentes a fonts.googleapis.com** (ya estaba en pendientes). La guía dice "no envía sus respuestas ni ningún dato", que sí es cierto.
5. **Cuando la app tenga dirección pública (la3),** hay que completar el punto 2.1 de la guía.

**Lo que sigue:** dos tandas de textos para llegar a 30 (t019 a t030) y después los ejercicios sueltos, cuando Gerson lo confirme o en las próximas ejecuciones de la rutina.

---

## 7 nov 2026 · Pieza 3, cuarta tanda: t019 a t024

Gerson confirmó que siga sin parar con los textos y los ejercicios sueltos.

**Qué hice.** Seis textos más:

| Texto | Tema | Grado y dificultad |
| --- | --- | --- |
| t019 | Anchoveta, afloramiento y El Niño | 4.º, 2 |
| t020 | El hierro que se oxida | 3.º, 1 |
| t021 | Túpac Amaru II, debate entre historiadores | 5.º, 2 (bajó de 3) |
| t022 | Relato «Medir dos veces» | 3.º, 1 |
| t023 | Semmelweis y el lavado de manos | 5.º, 2 (bajó de 3) |
| t024 | El agua en Lima | 4.º, 2 |

Ya son 24 textos de práctica en el índice.

También corregí el validador: `\b` de JavaScript toma las letras con tilde como separadores, y "la década" se leía como "la D".

**Subagentes:** tres revisores a ciegas (dos textos cada uno) y una verificación de los cambios.
- **Pasos previos fallados a ciegas, todos reescritos:**
  - t021: propósito, "explicar" contra "convencer";
  - t020: idea principal, el revisor marcó "ninguna";
  - t020: la sonda del zinc, que tenía dos lecturas.
- **Distractores defendibles:** en t021, la extrapolación y la compatibilidad; en t023 y t024, la inferencia.
- **Códigos que no correspondían:**
  - la pregunta de conector de t020 era de suma, y RV24 y RV26 solo sirven donde hay oposición;
  - en t019 y t020, dos RV3 que eran detalles;
  - en t024, RV11 y RV7 estaban cruzados.
- **Hechos:** la rebelión de Túpac Amaru no terminó "al año siguiente", sino en 1782.
- **Dificultad:** t021 y t023 no llegaban a dificultad 3; quedaron en 2.
- **Verificación final:** la concordancia de t023 p2 estaba rota ("las parteras… las parteras") y se ajustaron cuatro detalles más.

**Pruebas:** `banco.test.js` da 30 de 30. `npm test` da 3980 de 3981; la que falla es la de siempre, "app/datos/catalogo.json está al día", que se arregla con `npm run catalogo`.

---

## 7 nov 2026 · Pieza 3, quinta tanda: t025 a t030

**Qué hice.** Seis textos más, y con eso el banco llega a 30 textos de práctica en el índice:

| Texto | Tema | Grado y dificultad |
| --- | --- | --- |
| t025 | El caucho en la Amazonía | 5.º, 2 (bajó de 3) |
| t026 | El rayo y el trueno | 3.º, 1 |
| t027 | La lengua de señas peruana | 4.º, 2 |
| t028 | Relato «La mancha» | 3.º, 1 |
| t029 | Qué es una teoría científica | 5.º, 2 (bajó de 3) |
| t030 | El ferrocarril central y sus zigzags | 4.º, 2 |

**Subagentes:** tres revisores a ciegas (dos textos cada uno) y una verificación de los cambios.
- **Idea principal y resumen:**
  - en t025, dos distractores de resumen que eran defendibles se volvieron resúmenes parciales (RV3) de verdad;
  - en t026, la oración 3 daba solo la causa: dejó de ser principal y la aceptada quedó en la 8;
  - en t027, las oraciones 5 y 6 pasaron a apoyo.
- **Códigos:** en t029, la «corazonada» (RV5) pasó a «prueba que ya no admite ninguna duda» (RV11), para no repetir RV19. En t030 p3, RV3 pasó a RV1.
- **Hechos:** t026 decía «tormenta cercana»; ahora dice que hay que refugiarse en cuanto se oye el trueno, con la regla de la NOAA.
- **Redacción:** en t028, «Inés la abrazó» era ambiguo (podía ser la profesora); quedó «Inés abrazó a Carla», en una sola oración.

**Pruebas:** `banco.test.js` da 36 de 36. `npm test` da 3986 de 3987; la que falla es la de siempre, «app/datos/catalogo.json está al día», que se arregla con `npm run catalogo`.

**Pedido para la integración:** correr `npm run catalogo`, porque el índice cambió.

---

## 7 nov 2026 · Pieza 3, ejercicios sueltos: e001 a e015

**Qué hice.** Quince ejercicios en `contenido/razonamiento-verbal/ejercicios/`, tres por tipo:

| Tipo | Ejercicios | Unidad | Paso previo |
| --- | --- | --- | --- |
| Analogía | e001 a e003 (agricultor y chaquitaclla, cuy y roedor, pétalo y flor) | `analogias` | relación de la pareja |
| Término excluido | e004 a e006 (instrumentos, aves, metales) | `definiciones` (provisional) | ninguno |
| Conectores | e007 a e009 (la mala cosecha, el quechua, el Q'eswachaka) | `conectores` | relación (oposición) |
| Plan de redacción | e010 a e012 (quinua, Titicaca, cuy) | `plan-de-redaccion` | ordenar tarjetas |
| Eliminación | e013 a e015 (la llama, el chuño, el agua en la altura) | `eliminacion-de-oraciones` | tocar la que sobra |

En la eliminación, uno es impertinente, otro redundante y otro incompatible. En el plan, el orden correcto cambia en cada ejercicio.

**Códigos nuevos en el informe** (los cuatro son hipótesis):
- RV37: el plan empieza por la conclusión.
- RV38: se elimina la oración que presenta el tema.
- RV39: en término excluido, se saca el que difiere en un rasgo secundario.
- RV40: en término excluido, se saca la palabra que no se conoce.

**Validación.** `banco.test.js` valida ahora también los ejercicios:
- corre `validar` de `nucleo/lectura.js`;
- revisa la forma del cuerpo según el tipo y que el paso previo corresponda al tipo;
- en término excluido y eliminación, que las alternativas sean los términos o los numerales;
- en el plan, que la alternativa con RV28 rompa un retoma y las demás no;
- que cada oración que no sobra tenga en el paso previo el mismo código que en la alternativa;
- que haya explicaciones en el paso previo.

**Subagentes:** tres revisores a ciegas (cinco ejercicios cada uno) y una segunda verificación de los cinco que cambiaron.
- **Dos respuestas defendibles:**
  - e004: la trompeta era la única no andina; ahora van flauta dulce y armónica, y el origen parte el grupo dos y dos;
  - e002: en el paso previo, «la sequía produce hambruna» y «la sequía causa hambruna» valían igual. Cambié la pareja por CUY : ROEDOR (ver pedido 2).
- **Hecho y criterio:**
  - e015: la oración incompatible decía que en la altura se cocina más rápido; para verla incompatible había que saber física. Ahora contradice a la oración I dentro del mismo ejercicio;
  - e006: el carbón no es un elemento; quedó el azufre. El oro, único metal precioso, pasó a cobre.
- **Ajustes:**
  - e013 estaba muy fácil;
  - e010 afirmaba de más sobre el consumo de quinua;
  - e014 decía «malograrse».

**En el índice** entran solo e007 a e009, porque su unidad (`conectores`) ya está en la ficha. Los otros doce están aprobados, pero fuera del índice: `catalogo.test.js` exige que la ficha liste cada unidad del banco.

**Pruebas:** `banco.test.js` da 52 de 52. `npm test` da 4002 de 4003; la que falla es la de siempre, «app/datos/catalogo.json está al día».

**Pedidos para la integración:**
1. Agregar a `plantillas/lectura-verbal/plantilla.json` las unidades `razonamiento-verbal.analogias`, `razonamiento-verbal.plan-de-redaccion`, `razonamiento-verbal.eliminacion-de-oraciones` y `razonamiento-verbal.definiciones`, y `lectura-verbal` a sus `plantillas` en `catalogo/cursos/razonamiento-verbal.json`. Después agregar e001 a e006 y e010 a e015 a `indice.json` y correr `npm run catalogo`. Si se prefiere una unidad propia para término excluido (por ejemplo, `series-verbales`), avisar y cambio la de e004 a e006.
2. En `nucleo/lectura.js`, `ANALOGIAS` tiene «produce» y «causa», que el alumno no distingue en pares como sequía y hambruna. Propongo definir «produce» como «fabrica o da» (vaca y leche) o juntarlas. Mientras tanto no uso analogías de causa.
3. En `nucleo/lectura.js`, el paso previo «ordenar» solo da RV28 o RV29. Podría dar RV37 cuando la primera tarjeta es la conclusión (una oración sin retoma que empieza con «por eso», «así» o «por ello»), igual que las alternativas.
4. Correr `npm run catalogo`: el índice cambió.

**Con esto la pieza 3 queda cerrada.** Las cuatro piezas de la rutina están hechas. Lo que sigue depende de Gerson: más textos, ejercicios de oraciones incompletas con palabra (RV23 con contenido y no solo con conector) o los ejercicios que falten cuando la integración agregue las unidades.

**Actualización (7 nov 2026, tarde).** La integración hizo en la principal los pedidos 1 a 4:
- las unidades de la ficha y el índice, con e001 a e015;
- «produce» ahora se lee «fabrica o da»;
- el paso previo «ordenar» da RV37 cuando la primera tarjeta es la conclusión.

Hice merge de la principal en esta rama: `npm test` da 4003 de 4003. En e010 a e012, el motor da para cada orden del paso previo el mismo código que la alternativa (RV37, RV28 y RV29). Ya se pueden escribir analogías de causa.

---

## 7 nov 2026 (noche) · Sin pieza pendiente

Hice fetch y merge de `claude/awesome-wozniak-5etl1n` (trae verbal B y C, el rediseño de la app y matemática avanzada). `npm test` da 4414 de 4414.

Las cuatro piezas de la lista están hechas, así que no empecé nada nuevo. Revisé lo que queda en mi alcance:
- El diagnóstico de `nucleo/lectura.test.js` da 0 respuestas incorrectas de pasos previos sin explicación propia.
- **Guía para profesores:** «reto del día» pasó a «Reto de hoy», como dice la app ahora. También agregué los módulos de lectura de verbal B y C y su botón «✎ Papel».
- **Lo que sigue vigente en la guía**, porque lo comprobé en el código:
  - verbal no tiene «Ahora no» en la entrada;
  - `?soluciones=razonamiento-verbal` solo muestra el puntaje.

**Para Gerson:** la rutina ya no tiene lista. Opciones, si quieres que siga:
1. oraciones incompletas con palabra (RV23), que no tienen ejercicios todavía;
2. analogías de causa, que ya se pueden escribir con el cambio del núcleo;
3. más textos de dificultad 3 en las unidades de la rutina original;
4. apagar la rutina.

---

## 8 nov 2026 · Pedido de Gerson: oraciones incompletas y analogías de causa (e016 a e021)

Gerson eligió las opciones 1 y 2 de la entrada anterior.

**Oraciones incompletas con palabra (e016 a e018), unidad `sentido-contextual`.** Cada una tiene dos espacios y empieza con «aunque». El paso previo pregunta la relación entre las dos partes (oposición). Las incorrectas son:
- RV20: el parónimo (actitud o aptitud, absorber o absolver, prejuicio o perjuicio);
- RV24: leer el «aunque» como si fuera causa;
- RV23: la palabra que encaja con lo inmediato pero no con toda la oración.

El revisor a ciegas las resolvió bien, con una sola respuesta en cada una. Retoques: en e016, «recreo» era demasiado débil y pasó a «equipo de fútbol», y aclaré la diferencia entre actitud y aptitud. Las tres están aprobadas y en el índice.

**Analogías de causa (e019 a e021):** LLUVIA : HUAICO, VIRUS : FIEBRE y FRICCIÓN : CALOR. Las claves salen bien, pero el revisor encontró que en el paso previo **«fabrica o da» sigue compitiendo con «causa»**. En el Perú se dice «el virus te da fiebre» y «frotarse da calor». Por eso quedan con `veredicto: "cambios"` y fuera del índice. Retoques aplicados: «lluvia intensa», «el cuerpo suele responder con fiebre» y «fósforo : vela» pasó a «leña : fogón».

**Pruebas:** `banco.test.js` da 85 de 85. `npm test` da 4418 de 4420; las dos que fallan piden `npm run catalogo` (el catálogo de la app y `papel.json` de lectura-verbal), porque el índice cambió.

**Pedidos para la integración:**
1. Correr `npm run catalogo`.
2. Resolver la etiqueta de `a-produce-b` en `nucleo/lectura.js`. Hay dos salidas:
   - que diga solo productos materiales, por ejemplo «{a} fabrica u obtiene {b}» o «de {a} se saca {b}» (vaca y leche, abeja y miel), sin «da»;
   - que el paso previo `relacion-analogia` acepte más de una respuesta (`aceptadas`), para tomar como buenas «causa» y «fabrica o da» en pares de fenómenos.

   Cuando esté, reviso e019 a e021 y los meto al índice.

**Actualización (8 nov 2026).** La integración cambió la etiqueta de `a-produce-b` a «De {a} se obtiene {b}». Ajusté a esa etiqueta las explicaciones del paso previo de e001, e019 y e020, y repetí la revisión a ciegas de e019 a e021:
- **e019 y e020:** limpias.
- **e021:** con FRICCIÓN : CALOR, «De la fricción se obtiene calor» se defendía con razón, porque se frota justamente para obtener calor. La base pasó a DESCUIDO : ACCIDENTE, con la misma clave (golpe : moretón).

Los tres quedaron aprobados y en el índice. `npm test` da 4419 de 4420; falta `npm run catalogo` por el índice.

---

## 8 nov 2026 (noche) · Sin pieza pendiente

Hice fetch y merge de la principal (trae `rutinas/verbal-ab/` y la nota de la pausa por límite de uso). `npm test` da 5134 de 5134. Los 21 ejercicios sueltos (e001 a e021) y los 30 textos están en el índice.

No empecé nada nuevo. La lista de la rutina está cerrada, y Gerson ya pidió y recibió las opciones 1 y 2. Por el límite de uso, conviene que esta rutina no gaste ejecuciones vacías.

**Para Gerson:**
1. Más textos de dificultad 3 en las unidades de la rutina original.
2. Apagar la rutina diaria hasta que haya algo nuevo que pedirle.
