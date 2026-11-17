# Auditoría de contenido: «Tema central e idea principal» (razonamiento-verbal.tema-e-idea-principal)

17 nov 2026. Auditor externo; no se editó la unidad. Contrato: `docs/plan-calidad.md` §3 (13 puntos, con la regla de
verbal del punto 1) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5, y `docs/formato-lectura.md`. La vara es
`docs/molde-unidad.md`, con la fila de verbal de §11. Mandan las decisiones de `docs/etapa2/decisiones.md`. Lo que ya
corrigió el lector en frío (`rutinas/frio/razonamiento-verbal.tema-e-idea-principal.md`) no se repite. Lo que él dejó
pendiente solo se nombra cuando sigue igual.

**Qué se revisó**
- `contenido/teoria/razonamiento-verbal/tema-e-idea-principal.js`, versión 0.4.0: 4 ideas, 60 ejemplos, «Así se
  resuelve» con las semillas 0–7, «Ahora tú» con las semillas 0–5, glosario, historia y las 3 mesas del laboratorio.
- Las piezas `rv-soporte`, `rv-escalera`, `rv-arbol` y `rv-texto`.
- El módulo `plantillas/tema-idea-principal/`: su índice, los textos t175–t189, el previo `medida` de
  `nucleo/lectura.js` y `app/lectura.js`, y `papel.json`.
- Las 19 preguntas de la unidad que saca `lectura-verbal` (`indice.json`).
- La app a 390 × 844: los 28 momentos, el glosario y el laboratorio, con `herramientas/capturas-teoria.js` contra un
  servidor propio en el puerto 4191, ya apagado. La captura no dio errores de página.

**Scripts propios.** Están en el scratchpad de la sesión (`aud/citas.js`, `aud/largos.js`). Leen los datos de la unidad
y de los JSON, pero no usan ninguna función de la unidad.

- **Citas y conteos.** Se revisaron los 60 ejemplos (los 20 de nivel 3 y los 40 de los niveles 1 y 2), 32 «Así se
  resuelve», las 24 opciones de «Ahora tú» con su `siFuera`, los 4 Predice y los 4 Mira.
  - Cada número de oración citado existe.
  - Cada conteo coincide con el soporte: «las cuatro», «las seis oraciones», «las dos filas», «las dos barras», «4 de 4».
  - En cada nivel 3, el resuelto nombra todas las letras y una sola buena.
  - Lo que el resuelto pone entre «» está en el enunciado, en las alternativas o en el texto.
  - Resultado: **ningún error de cita ni de conteo.** Solo hay una cita no literal (B2).
- **Posición y largo de la correcta.** Se midieron 80 preguntas de la teoría y las 46 de t175–t189, con la letra, el
  lugar en el enunciado y la copia del texto (palabras compartidas con la oración más parecida).
- **Explicaciones.** Se revisó el arranque de las 259 explicaciones de las alternativas incorrectas.
- **Contenido propio.** No hay fuentes de verbal en el repo para comparar: `fuentes/examenes` y `fuentes/libros` están
  vacíos. Se buscaron en la web dos oraciones textuales (t175 o1, t189 o3) y no aparece ninguna copia. Los textos tratan
  casos locales, concretos y propios. No se pudo cotejar con manuales de academia.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3 de CLAUDE.md, 12; molde §2 | Glosario: `tema-e-idea-principal.js:2079, 2091-2092, 2097, 2104, 2111, 2126-2128` | Los ejemplos del glosario dan las respuestas de la propia unidad. Estos términos se tocan en la ficha de cada idea («Palabras de esta idea»), en todo texto de la teoría y en la pestaña Glosario, antes de jugar o predecir. Lo que adelantan:<br>• «idea principal» trae, palabra por palabra, la respuesta del Predice de la idea 2: «En la altura el agua hierve a menos grados y cocina más lento».<br>• «jerarquía» da la del Predice de la idea 3: «En el texto del cuy, manda la oración 2».<br>• «subrayado» y «idea secundaria» dan la solución de la misión de la idea 3: «se marca la oración 1 y se tacha la 5», el adobe como «cómo» y Ilave como ejemplo.<br>• «macroestructura» da la misión de la idea 2 (la totora, «base de su vida») y los dos Predice.<br>• «título» da la respuesta de «Ahora tú» de la idea 4, semilla 0: «Biblioteca abierta en vacaciones». | Que los ejemplos del glosario usen textos que no salen en Juega, Predice ni «Ahora tú» (sirven los de los ejemplos resueltos). Agregar la prueba de la regla R1. |
| A2 | 9, 6 | Mesa «Propuestas en tres textos», la primera que abre el laboratorio: `:1984, 1986, 1988, 1994, 2029-2031` | La propuesta «amplia» de cada texto cubre 0 oraciones. Por ejemplo, «Las bibliotecas son importantes para la educación» tiene `c: []` y el veredicto «Habla de otro texto». El reto dice «Encuentra una propuesta que no cubra ninguna oración» y responde «Es tan amplia que podría ser de otro texto». La idea 1 enseña lo contrario: muy amplia es la frase que cubre todo el texto y además sirve a otro (escalera `:98-99`, «cubre los dos avisos y cualquier otro»). Con la definición de «cubrir» del glosario (`:2068`), esa frase cubre las cuatro oraciones. El alumno aprende en el laboratorio que «amplia» quiere decir «no cubre nada». | Dar a «amplia» todas las oraciones (`c: [1, 2, 3, 4]`) con el veredicto «Muy amplia: le serviría a otro texto». Para el caso de «no cubre ninguna», usar otra propuesta que hable de otra cosa, como el «se vende a los turistas» de la idea 2. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Proceso (`formato-lectura.md` §5.5 regla 9 y §5.6; `plan-calidad.md` §8) | `revision` de t175 a t189 | Los 15 textos entraron al índice con `"veredicto": "aprobado"`, pero en `por` dice «autor (sesión de práctica…) y script…; falta el revisor a ciegas». Las notas dejan la revisión a ciegas «pendiente para Gerson». Así, la regla 9 se cumple solo de nombre. M4 es un ejemplo de lo que un revisor a ciegas habría visto. | Sacar los 15 del índice o dejar `veredicto: "pendiente"` hasta que pase el revisor a ciegas. Agregar la prueba de la regla R4. |
| M2 | 1 (regla de verbal) | Lee de las ideas 2, 3 y 4 (`:948-952`, `:1397-1401`, `:1849-1853`); captura `claro-cel-tema-e-idea-1-lee` | La primera pantalla de estas tres ideas son tarjetas de texto sin ningún dibujo. La tarjeta 3 de la idea 3 dice «Rosa copió este texto del libro», pero no lo muestra. El soporte recién aparece en Juega. Solo la idea 1 trae el aviso con su soporte (quién escribe y para quién) en Lee. | Poner en una tarjeta de Lee de cada idea su soporte (`rv-soporte`): el folleto del muelle, la hoja de Rosa, la hoja de simulacro. |
| M3 | Delatar por posición | Ejemplos de nivel 3 (`:388-472, 865-938, 1319-1387, 1776-1839`), `RESUELVE_ALT` (`:1584-1625`), juego y Predice de la idea 4 | En las 26 hojas con letras fijas, la correcta es la C 11 veces, la B 7, la D 6, la A 1 y la E 1. Quien elige siempre «C o B» acierta el 69 %. En las listas de frases del enunciado (27 casos, niveles 1 y 2 y «Así se resuelve»), la correcta va 2.ª o 3.ª en 24 y solo 2 veces 1.ª. | Repartir las letras: cada una entre el 15 % y el 25 %, con A y E incluidas, y rotar el lugar de la correcta en los enunciados. Agregar la prueba de la regla R2. |
| M4 | 13, niveles | t176, t180, t185, t187, t188 (y en parte t175, t177, t178, t182, t184) | Las preguntas de un mismo texto tienen casi la misma respuesta: tema central, idea principal y título. Por ejemplo, en t176:<br>• p1: «los bebederos… y cuántas botellas menos se botan»;<br>• p2: «Gracias a los bebederos, el colegio bota muchas menos botellas»;<br>• p3: «Menos botellas con los bebederos».<br>La explicación de p1, que el alumno ve antes de p2, ya responde p2 y p3. Además, los distractores repiten el mismo molde (marco, muy amplia, un dato del gráfico, agrega). Las preguntas 2 y 3 no miden nada nuevo. | Una sola pregunta de «frase» por texto (tema central o título) y otra de otro tipo (idea principal implícita, papel de una oración o eliminar una oración). O dar en el título un ángulo distinto del tema. |
| M5 | Delatar por copia | «Ahora tú» de la idea 2, semillas 0, 1 y 2 (`:706, 714, 724`); ejemplo «Dos títulos parecidos» (`:1748`) | En «Ahora tú» de la idea 2, la correcta copia una oración del texto al 100 %, contra 80 % a 83 % de cualquier distractor. Por ejemplo, «Desde junio, la biblioteca abrirá también los sábados» es la oración 1 tal cual. En «Dos títulos parecidos» la buena copia al 100 % y la mala al 20 %. El alumno aprende que gana «la que repite una oración». | Parafrasear la correcta, como hace el examen, o hacer que un distractor (RV4 o RV1) copie una oración entera. Agregar la advertencia de la regla R7. |
| M6 | Delatar por largo | Enunciados de ejemplos: «El caso de Ana» (`:846`), «El agua de la quebrada» (`:816`), «Las colcas» (`:856`), «El título con gráfico» (`:1757`) | La correcta mide 2,30, 2,11, 1,32 y 1,33 veces lo que mide la opción más larga de las otras. El alumno lee el enunciado antes que el resuelto. En toda la teoría, la correcta es la más larga en 6 de 80 preguntas: el problema es este grupo. | Alargar una incorrecta en cada uno, sin cambiar su falla. |
| M7 | Paleta | «Ahora tú» de jerarquía: `estJer(…, marca)` (`:1214`) con `AHORA_JER[1].marca = 3` (`:1174`) | La oración por la que se pregunta se pinta en naranja antes de responder. En la paleta de lectura, naranja es «distractor, lo que se descarta». Aquí la oración 3 sí sostiene a la principal (es la correcta) y el naranja empuja hacia «no la sostiene» (RV30). | Señalar la oración preguntada con un recuadro de tinta o con su número en negrita, nunca con un color de la paleta. |
| M8 | Lo que se enseña | Ejemplo «El caso de Ana» (`:849-853`) | El resuelto dice «Ana es un caso de ella» (de «cada colegio puede pedir a la UGEL una charla gratuita»). Pero Ana fue sola a la UGEL y la ayudó una orientadora, sin ninguna charla en su colegio. El caso no muestra la principal. | Cambiar la 2 por «Su colegio pidió la charla a la UGEL, y ahí supo qué temas venían», o cambiar la principal. |
| M9 | Respuesta discutible | Ejemplo «La pregunta que responde» (`:1299-1307`) | La oración 3, «Cada escalón es plano, así que el agua de riego no se escurre», responde tan bien a «¿por qué?» (por qué se puede sembrar) como a «¿cómo?». El «así que» es causal, y la respuesta única es «¿Cómo?». | Usar una oración que solo sea un modo («Se construyen con piedras puestas a mano, sin barro») o aceptar las dos y preguntar otra cosa. |
| M10 | 13 (datos en práctica) | t175–t189 (formato lectura sin `datos`) | El previo `medida` lleva el criterio en el botón, y está bien. Pero las preguntas no traen definiciones: «tesis» (t179, t181, t186), «dan cuenta, principalmente, de» (t178, t182, t188), «tema central». Es la falta que el lector en frío marcó como Alta en la teoría (el `D_GIRA`), y aquí sigue. El papel tampoco las trae. | Un campo `datos` por pregunta en el banco, mostrado como recuadro en `app/lectura.js` y en el papel, con las líneas `D_GIRA`, `D_TESIS` y `D_FRASE` de la teoría. |
| M11 | Delatar por largo | `lectura-verbal`, las 19 preguntas de la unidad | La correcta es la más larga (o empata) en 7 de 19 (37 %); en t001 mide 1,26 veces la siguiente y en t006, 1,33. Las de t175–t189 están bien: 6 de 46. | Alargar una incorrecta en t001, t006, t016, t022 y t024. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 4 de CLAUDE.md; molde §5b | `:18-19` contra `:1420, 1437` | La cabecera dice «El carmín (ángulos) ya no se usa en la unidad», pero el lápiz de jerarquía va en carmín y la leyenda lo nombra. Es un cuarto color con un papel que no está en la paleta. Lo dejó pendiente el lector en frío. | Que Gerson decida: tinta (habría que ampliar el validador para admitirla) o quitar el color del asa. Después, corregir la cabecera. |
| B2 | Citas | `:1838` | El resuelto cita «el más importante», y la alternativa dice «el curso más importante». | Citar la alternativa tal cual. |
| B3 | Niveles | `:442-456`, `:1826-1839`, `AHORA_ALT[5]` (`:1668-1676`) | Los tres casos de «dos textos» son el mismo molde (A a favor, B en contra, «Si … debe…») y la correcta es la B en los dos ejemplos de nivel 3. | Cambiar uno por un par que coincide en algo, o que trata dos aspectos. |
| B4 | Lo que se enseña | «Tapar para probar» (`:1316`), «Las motos» (`:1385`), «El agua de la cocina» (`:902`) | Tres afirmaciones flojas en los resueltos:<br>• «La 1 y la 4 dicen cuánto se gasta», cuando la 1 solo dice que se compran bidones;<br>• «E subraya un porqué y tacha otro», cuando la 1 es el marco;<br>• la correcta generaliza («gasta») lo que el texto mide en una familia («gastó»). | Ajustar cada frase. |
| B5 | Contrato (`siFuera`) | `:1176, 1183, 1200, 1210, 525`; t176 p3, t178 p1, t180 p3, t187 p3, t189 p3 | Unas 10 explicaciones abren con el veredicto («Es la principal: las demás…», «Cuenta un caso; la principal es…», «Es el marco de la oración 1») y no con lo que el alumno hizo bien. De 259, 49 no tienen un arranque explícito. | Empezar por lo cierto («Leíste bien que la 1 abre el folleto, pero…»). Agregar la advertencia de la regla R8. |
| B6 | Medición | `:1664`, `:1190` contra t181, t186 (RV33); `:1450`; `banco.test.js:130-134` | Hay tres problemas de códigos:<br>• «Lo que dicen otros» lleva RV4 en la teoría y RV33 en la práctica: el mismo error se cuenta con dos códigos.<br>• RV43 («el resumen como lista») se usa para «todas pesan igual».<br>• En `medida`, llamar «muy amplia» a una frase estrecha se cuenta como RV2 («elige lo demasiado general»). Es el error contrario, y ensucia la tabla de RV2. | Unificar en RV33. Pedir un código propio para «invierte la medida» o dejar `null` (la regla del banco hoy lo prohíbe). |
| B7 | 7, 11 | Laboratorio: `:2008-2009, 2019` | Hay tres detalles en la mesa:<br>• El control «Propuesta» se llama «tema / detalle / principal / amplia»: el reto «busca la que cubre todo y afirma algo» se resuelve leyendo el botón.<br>• El control «Oración» ofrece del 1 al 4 en textos de 3.<br>• La lectura separa con «·». | Rotular las propuestas «A, B, C, D» o con su frase. Ajustar las oraciones al texto. Separar con salto de línea. |
| B8 | Fuente | Historia, `:2053` | El título de la fuente, «Matriz de teoría de razonamiento verbal», no es el de la página enlazada (CVC, diccionario ELE, «macroestructura textual»). | Poner el título real. |
| B9 | 4 (paleta) | Ejemplo «Dos avisos del club» (`:373`) | Lo que la frase cubre del aviso 2 sale en naranja. En el juego, lo cubierto del otro aviso es turquesa. | Turquesa para lo cubierto y naranja solo para «muy amplia». |
| B10 | 8 (app) | Capturas de Juega a 390 px | Hay dos problemas de pantalla:<br>• El botón «‹ Atrás» de la barra fija es transparente y se lee encima del texto de la hoja (`claro-cel-jerarquia-2-juega`, `…-alternativas-2-juega`).<br>• Consigna y misión ocupan la primera pantalla, y el soporte empieza bajo el pliegue.<br>Sigue además el pendiente del lector en frío: «Ahora tú» baraja «La 1 / La 3 / La 2» (`app/teoria.js:634`). | Fondo de tarjeta para «‹ Atrás». `orden: 'fijo'` también en «Ahora tú». |

## Lo que está bien y hay que copiar al molde

- **Citas y conteos impecables.** El script independiente revisó 60 ejemplos, 32 resueltos, 24 casos de «Ahora tú», 4
  Predice y 4 Mira, sin encontrar ningún número de oración inexistente ni ningún conteo errado. La regla del comentario
  de cabecera («cada oración citada existe y cada “las cuatro” coincide») funciona: copiarla tal cual al molde de verbal.
- **El objeto reconocible de verbal, bien resuelto en Juega, Predice, Mira, ejemplos y práctica.** Todo soporte lleva su
  lugar, quién lo escribe y para quién: «Folleto del puesto de salud de Acora · De: el puesto de salud · Para: familias
  de Acora». Los textos de práctica lo llevan en el título («Boletín de la cooperativa cafetalera, para sus socios»).
- **Datos que son criterios.** `D_TEMA`, `D_IDEA`, `D_SEC`, `D_GIRA`, `D_MIXTO`, `D_AGREGA` y `D_AGREGA_M` son
  constantes que se reusan en toda la unidad. La versión con o sin gráfico evita prometer un gráfico que no hay, y las
  palabras difíciles van como definición, no como resumen. Es el mejor molde del punto 13 para verbal.
- **El criterio dentro del botón del previo `medida`** («Muy estrecha: deja fuera una parte»): da la herramienta sin
  dar la respuesta. Copiarlo a cualquier previo de clasificación.
- **La idea principal en cualquier lugar.** En t175–t189 va al inicio en 3 textos, en medio en 5, al final en 5 y
  repartida en 2. «Así se resuelve» de la idea 2 recorre inicio, medio, final y repartida. El índice sube de dificultad
  (1 → 2 → 3).
- **Largo de la correcta bajo control** en la teoría (6 de 80) y en t175–t189 (6 de 46), sin que «nunca la más larga»
  se vuelva otra pista: la correcta es la más corta en 2 y en 4 casos.
- **Predice con `orden: 'fijo'`** cuando las letras están en la hoja, y Mira tachando sobre esa misma hoja.
- **Cada incorrecta tiene su código**: 259 de 259. RV64 a RV66 se usan con un sentido estable.
- **Paleta de lectura con papel fijo** declarada en la cabecera y en cada leyenda: lo cubierto en turquesa, lo que se
  prueba en naranja, lo aceptado en violeta, lo que queda fuera en gris. Se respeta en las cuatro ideas, salvo B1, B9 y
  M7.

## Reglas que faltan en el contrato o el validador

| # | Regla | ¿Automática? |
|---|---|---|
| R1 | **El glosario no usa los textos ni las respuestas de Juega, Predice, Mira ni «Ahora tú»** (de ninguna unidad). Es la causa de A1. Completa la regla del molde §2 («el `simple` nunca afirma lo que un distractor afirma»). | Sí: buscar en cada ejemplo del glosario las oraciones del soporte, la correcta de Predice, la `mision.bien` y la correcta de «Ahora tú». |
| R2 | **Hojas con letras fijas**: en cada unidad, ninguna letra es la correcta en más del 30 % de las veces, y A y E también lo son. **Listas en el enunciado**: la correcta no ocupa siempre el mismo lugar. | Sí, como en `largos.js`. |
| R3 | **Mismo concepto en idea y laboratorio**: una mesa que califica («amplia», «estrecha», «principal») usa la definición de la idea. | En parte: en verbal, la propuesta rotulada «amplia» cubre todas las oraciones. |
| R4 | **«aprobado» exige revisor a ciegas**: `revision.ciega: true` y `por` distinto del autor. Hoy el banco acepta «aprobado» con la nota «falta el revisor a ciegas». | Sí, en `banco.test.js`. |
| R5 | **En verbal, Lee muestra el soporte** en al menos una tarjeta de cada idea (punto 1). | Sí: con `calidad: 2` y curso verbal, alguna tarjeta trae `pieza: 'rv-soporte'`. |
| R6 | **Un texto no repite su respuesta**: tema central, título e idea principal del mismo texto no comparten casi todas sus palabras. | Sí, como advertencia: superposición de palabras entre las correctas de un mismo texto ≥ 60 %. |
| R7 | **La correcta no gana por copiar**: no copia una oración más que todos los distractores, con 15 puntos o más de diferencia. | Sí, como advertencia. |
| R8 | **`siFuera` y `explicacion` empiezan por lo que el alumno hizo bien**. | Solo como advertencia, con una lista de arranques. El juicio final es humano. |
| R9 | **Colores declarados**: la unidad lista en su cabecera los tokens que usa, y el validador falla si aparece otro (el `c-h` de B1). En verbal, ningún token de la paleta marca la pregunta (M7). | Sí lo primero; lo segundo, en parte. |
| R10 | **Datos en la práctica de verbal**: el banco de lectura acepta `datos` por pregunta y los exige en `tema-central`, `titulo`, `idea-principal` con «tesis» y «da cuenta de». | Sí, en `banco.test.js`. |
| R11 | **Un error, un código** en teoría y práctica (B6), con una tabla de qué opción típica va con qué código. | En parte: comparar los códigos de las opciones que copian la oración 1 marcada como `contraste`. |

## Correcciones

Pendientes: esta auditoría no editó nada.

## Correcciones (17 nov)

Alcance: `contenido/teoria/razonamiento-verbal/tema-e-idea-principal.js` (ahora 0.5.0, con su glosario y su
laboratorio), la pieza `rv-soporte` con su prueba, una prueba nueva de la unidad
(`contenido/teoria/razonamiento-verbal/tema-e-idea-principal.test.js`) y la nota de `revision` de t175–t189. No se tocó
`app/`, `nucleo/teoria.js` ni `nucleo/lectura.js`. Lo que corrigió el lector en frío no se deshizo. Las cuentas se
rehicieron con los dos scripts de esta auditoría, que no usan funciones de la unidad (copiados en el scratchpad,
`fix/citas.js` y `fix/largos.js`). `citas.js` da los mismos avisos que antes de corregir: son falsos positivos del
script (preguntas como «¿cómo?», «las tres» del aviso 1 en un mural de 5 oraciones). Hay uno nuevo del mismo tipo: «las
seis jugadoras». No aparece ningún número de oración inexistente.

### Alta

- **A1, glosario.** Se cambiaron 26 ejemplos en 10 términos. Ahora usan textos que no salen en ningún juego, Predice,
  Mira, «Ahora tú» ni ejemplo resuelto: el afiche de lentes gratis de la posta, el riego de noche, las abejas y el haba,
  el tren de las 8:00, la carretera a Moho. Se fueron, por ejemplo, el agua que hierve (respuesta del Predice de la
  idea 2), el cuy (Predice de la idea 3), «se marca la 1 y se tacha la 5» (misión de la idea 3), la totora como «base de
  su vida» (misión de la idea 2), «Biblioteca abierta en vacaciones» («Ahora tú» de la idea 4) y las respuestas de los
  ejemplos (vacunación, desfile, lanchas, ajedrez, rabia, lavaderos). También salieron «nunca cierra» y «la única forma»,
  que copiaban distractores. La prueba nueva **R1** busca en cada ejemplo del glosario tres cosas: las oraciones de todos
  los soportes (juego en toda su grilla, Predice, Mira, «Ahora tú» en 60 semillas y ejemplos), lo citado entre comillas y
  el 70 % de las palabras de cualquier respuesta. Con la versión anterior falla en 22 casos y con esta pasa.
- **A2, mesa «Propuestas en tres textos».** Cada texto tiene ahora cuatro oraciones y cinco propuestas medidas como en
  las ideas 1 y 2:
  - solo nombra el tema (cubre todo y no afirma);
  - muy amplia (cubre las cuatro y le serviría a otro texto, p. ej. «Las bibliotecas ayudan a estudiar»);
  - muy estrecha (un detalle);
  - la idea principal;
  - lo que ninguna oración dice («La biblioteca venderá libros usados», como el «se vende a los turistas» de la idea 2).

  Los retos son cinco: la principal del chuño, una muy amplia («cubre todas, pero nada la ata a este texto»), una que no
  cubre ninguna, la oración que deja fuera la muy estrecha en los paneles, y guardar la que solo nombra junto con la
  principal. También se arregló B7: los botones dicen A–E, con la principal en otra letra en cada texto; ningún texto
  ofrece una oración que no existe; la lectura separa con punto, no con «·». La mesa cuenta ahora para las ideas 1 y 2.
  La prueba **R3** recorre toda la grilla y comprueba que lo que la lectura llama «muy amplia» no deja oraciones fuera, y
  que lo que no cubre nada no se llama amplio.

### Media

- **M1, revisión de t175–t189.** La nota de `revision` de los 15 textos dice ahora que el revisor a ciegas coincidió en
  79 de 79 ítems de la tanda (46 preguntas y 33 previos), con el conteo de cada texto. En t182, t184, t185 y t189 agrega
  que los ítems con dudas se reescribieron y que la segunda vuelta a ciegas dio 22 de 22. `por` ya no dice «falta el
  revisor a ciegas». La fecha es 2026-11-17. El índice y la plantilla no cambian. **Pendiente (R4, fuera de alcance):**
  que `banco.test.js` exija una marca de revisión a ciegas (`revision.ciega: true`, o `por` distinto del autor) para
  aceptar «aprobado».
- **M2, Lee con su soporte.** La primera tarjeta de Lee de cada idea trae el texto en su soporte, sin marcas: el folleto
  del muelle (idea 2), la hoja de Rosa con el resaltador y el lápiz (idea 3) y la hoja de simulacro de las alpacas, con su
  pregunta y sus cinco alternativas (idea 4). El texto de cada tarjeta dice quién lo escribe y para quién. Ninguno es el
  texto de un Predice. La prueba **R5** lo comprueba en las cuatro ideas.
- **M3, letra y lugar de la correcta.** Se cambiaron de letra ocho hojas (las bicicletas, el caño, el puente, la cocina,
  las motos, la feria de semillas, cocinar y la tesis del celular), con sus resueltos y sus respuestas. Ahora la correcta
  es A en 5, B en 5, C en 6, D en 5 y E en 5 de las 26 hojas con letras fijas; antes, C en 11. En las listas de frases del
  enunciado se movió la correcta en 12 casos. En las 20 listas de tres va 1.ª en 7, 2.ª en 7 y 3.ª en 6 (antes, 1, 9 y 10).
  En las 6 de cuatro va 1.ª en 2, 2.ª en 1, 3.ª en 2 y 4.ª en 1. Lo comprueba **R2**: ninguna letra pasa del 30 %, A y E
  aparecen, y cada lugar de las listas de tres llega al 20 % o más.
- **M5, copia.** En «Ahora tú» de la idea 2, la correcta parafrasea («La biblioteca abrirá los sábados para quien no puede
  ir entre semana», «Un tacho por pabellón buscará dejar el patio sin envolturas», «Cortar la fibra en tiempo de lluvias,
  no de heladas, cuida a las alpacas»). Además, un distractor copia su oración entera: la 2 de la biblioteca, la 1 del
  patio y la 1 de don Teófilo. En «Dos títulos parecidos», la buena es «Una radio hecha por estudiantes». Con el mismo
  script aparecieron otros cuatro casos que también se arreglaron: el concurso de cuentos, el cartel del patio, el
  simulacro de sismo y la bolsa de tela. Ahora ninguna correcta copia una oración 15 puntos más que todos sus
  distractores (antes había 8). La prueba **R7** lo comprueba en Predice, «Ahora tú» (60 semillas) y ejemplos.
- **M6, largo.** Se alargó una incorrecta sin cambiar su falla en la quebrada, el caso de Ana, las colcas y el título con
  gráfico. La correcta es la más larga en 3 de 80 preguntas de la teoría (antes, 6): «La nota de Rosa», 1,10; la
  quebrada, 1,09; «Qué pide la idea principal», 1,14. Es la más corta en 2. No se bajó más para que «nunca la más larga»
  no se vuelva otra pista.
- **M7, el naranja de «Ahora tú».** La oración por la que se pregunta lleva ahora un recuadro de tinta alrededor de su
  número. Es un estado nuevo de `rv-soporte` (`senal`), con su prueba: recuadro dentro del lienzo, alrededor del número,
  sin pisar el renglón y sin colores de la paleta. **M7** prueba que ningún «Ahora tú» pinta una oración antes de
  responder.
- **M8, el caso de Ana.** La oración 2 dice ahora «Su colegio pidió una charla a la UGEL, y ahí supo qué temas venían».
  Así, Ana sí es un caso de la principal, y el resuelto lo dice.
- **M9, «La pregunta que responde».** El texto de los andenes se rehízo: la 1 es la principal (los antiguos peruanos
  lograron sembrar en las laderas), la 2 y la 3 dicen cómo, sin un «así que» («Cada escalón se rellenó con tierra y se
  sostuvo con un muro de piedra»), y la 4 es el ejemplo de Pisac. La respuesta sigue siendo «¿Cómo?».
- **M4, M10 y M11: pendientes.** Ver abajo.

### Baja (lo que salió barato)

- B2: se cita «el curso más importante», tal cual la alternativa.
- B4: tres arreglos.
  - «Tapar para probar»: «la 1 dice que se compra agua en bidones; la 4, cuánto cuesta uno».
  - «Las motos»: la 1 es el marco y E «subraya un porqué y tacha el marco».
  - «El agua de la cocina»: la 5 dice «Así comprobó que lavar con balde gasta…», así que la correcta ya no generaliza
    por su cuenta.
- B5: siete `siFuera` de la unidad empiezan ahora por lo que el alumno hizo bien (Predice de la idea 1 y «Ahora tú» de
  jerarquía).
- B6: «lo que dicen otros» en la tesis de «Ahora tú» pasa a RV33, como en t181 y t186.
- B7: hecho dentro de A2.
- B8: la fuente es ahora «Macroestructura textual, Diccionario de términos clave de ELE (Centro Virtual Cervantes)».
- B9: en «Dos avisos del club», lo cubierto del aviso 2 va en turquesa.
- El comentario de cabecera ya no dice que el carmín no se usa: dice dónde queda (B1) y que la pregunta se señala con
  tinta.

### Pendiente, y por qué

- **M4 (t176, t180, t185, t187, t188: el mismo texto repite la respuesta).** Para arreglarlo hay que reescribir unas diez
  preguntas: dejar una sola pregunta de frase por texto y cambiar la otra por otro tipo (idea implícita, papel de una
  oración, eliminación). Eso invalida la revisión a ciegas que se acaba de anotar (79 de 79) y pide otra vuelta. Además,
  qué tipos de pregunta lleva cada texto de la práctica es una decisión de Gerson. No se tocó ningún ítem de t175–t189.
- **M10 (datos en la práctica de lectura).** Necesita `app/lectura.js` y `nucleo/lectura.js`, que están fuera de
  alcance. Habría que hacer cuatro cosas:
  1. Agregar un campo `datos: [..]` por pregunta en el JSON, una línea por dato, con las de la teoría: `D_GIRA` («“Gira
     en torno a” y “da cuenta de”: así pregunta el examen por el tema central»), `D_TESIS` y `D_FRASE`.
  2. Que `nucleo/lectura.js` lo valide y que `app/lectura.js` lo muestre en un recuadro «Datos» bajo el enunciado, como
     `.te-datos` de la teoría.
  3. Que `herramientas/papel-lectura.js` lo imprima al final del enunciado.
  4. Que `banco.test.js` lo exija en `tema-central`, `titulo` e `idea-principal` cuando la pregunta dice «tesis» o «da
     cuenta de» (R10).
- **M11 (`lectura-verbal`: la correcta es la más larga en 7 de 19).** Son textos del banco general (t001, t006, t016,
  t022, t024), fuera de este encargo. Se alarga una incorrecta en cada uno, con su revisión.
- **De Gerson:**
  - B1: el lápiz de jerarquía, en carmín o en tinta. La tinta pide ampliar el validador de `nucleo/teoria.js`.
  - B6: un código propio para «todas pesan igual» (hoy RV43) y para «invierte la medida» en el previo `medida`. Hoy se
    cuenta como RV2, y la regla del banco no deja `null`.
- **Baja que quedó así:**
  - B3: los tres pares A/B tienen el mismo molde.
  - B5 en t176, t178, t180, t187 y t189: no se tocaron, para no cambiar textos recién revisados a ciegas.
- **App (B10 y los pendientes del lector en frío):**
  - el botón «‹ Atrás» transparente;
  - consigna y misión que empujan el soporte bajo el pliegue;
  - `orden: 'fijo'` también en «Ahora tú» (`app/teoria.js:634`);
  - el subrayado del glosario y el botón marcado en violeta.
- **Para el validador común (`nucleo/teoria.js`, fuera de alcance):** R1, R2, R5 y R7 están ahora solo en la prueba de
  esta unidad. Valdría llevarlos al validador para todas las unidades de verbal, con R1 para todas.

### Comprobación

- Validador de la teoría de esta unidad sin problemas; `tema-e-idea-principal.test.js` 7 de 7; piezas `rv-*` en verde
  (`rv-soporte` con la prueba nueva de `senal`); `banco.test.js`, `nucleo/lectura.test.js`,
  `herramientas/papel-lectura.test.js` y `herramientas/alternativas.test.js` en verde (336 de 336).
- `npm run catalogo` y `npm test`: 9289 de 9292. Las 3 fallas son de unidades que otras sesiones están editando ahora
  (química, materia y energía; trigonometría, razones agudas, con su prueba propia), y no se tocaron.
- Capturas: 90 a 390 × 844 (momentos, ejemplos, glosario y laboratorio), contra un servidor propio en el puerto 4192, ya
  apagado, sin errores de página. Están en el scratchpad, `fix/cap/`. Se revisaron Lee de las ideas 2 y 3 (el soporte
  va arriba y el texto de la tarjeta queda debajo, como en la idea 1) y «Ahora tú» de la idea 2.
