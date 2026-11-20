# Auditoría de contenido: «Razonamiento inductivo» (razonamiento-matematico.razonamiento-inductivo)

20 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; fase 7 del método,
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y las 19 de «Lo que encontraron
los auditores» y «Lo que salió al cerrar la Etapa 7» (`docs/metodo/unidad/etapa-delegada.md`). Decisiones:
`docs/etapa8/propuesta-razonamiento-matematico.md` (§10 y §11). Lo que vieron los dos lectores en frío está en
`rutinas/frio/razonamiento-matematico.razonamiento-inductivo.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-matematico/razonamiento-inductivo.js` (v0.4.0, sin `calidad: 2`): las 6 ideas
  con sus 7 momentos, los 90 ejemplos, las 6 predicciones, los 6 juegos con todos sus valores, «Ahora tú» y «Así se
  resuelve» (400 semillas de cada uno por idea), el glosario (16 términos), las 5 mesas del laboratorio y la historia.
- La pieza `nucleo/kit/piezas/rm-patrones.js` y su prueba.
- La práctica: `plantillas/rm-induccion/` (18 tipos con `TIPOS_POR_IDEA`, `casos.json` con 18 casos, `papel.json` con 8),
  el bloque de la unidad en `plantillas/rm-ciclos/` (figuras, bloque, espiral, unidades) y en `plantillas/rm-fichas/`
  (medios, fibonacci, malla), y el papel de esas dos y de `plantillas/sucesiones/` (los problemas de esta unidad).
- Los dos ítems de la reserva de la prueba del curso (rm-26 y rm-27, formas A y B).
- La app a 390 px con `--entera` (servidor propio en el puerto 4451): 42 momentos y 90 ejemplos (133 capturas más las 18
  del lector, sin repetidas por md5 y sin «No se pudo cargar el catálogo»; la herramienta de serie alcanzó, no hizo falta
  copiarla).

**Cuentas.** Rehechas con scripts propios en Python
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ri/cuentas/`: `dump.js` vuelca lo
que ve el alumno; `geometria.py`, `verificar.py` + `ideas.py` y `practica.py` rehacen las cuentas). Del código de la
unidad y de los generadores solo se lee el texto, las opciones y los datos de los dibujos; nada de sus funciones.
- **Fósforos:** un modelo propio de cada forma (cuadrados, triángulos alternados, casitas y columnas de dos pisos) arma la
  figura k lado por lado; contar es contar lados distintos (todos de largo 1). Cada figura **dibujada** (2 452, en juego,
  predicción, ejemplos, «Ahora tú» y «Así se resuelve») se compara lado por lado con el modelo: iguales, sin fósforos
  repetidos.
- **Torta:** con los ángulos del dibujo (constantes de la pieza), las regiones se cuentan de dos maneras: grafo plano
  (V − E + F con los cruces calculados) y relleno por píxeles de una imagen a escala 5. Dan **1, 2, 4, 8, 16, 31 y 57**.
  Posición general: ningún punto junta tres cortes con 1 a 7 velitas (con un hexágono regular saldrían 30). Pero con
  7 velitas dos cruces quedan a **2,2 px** y hay un pedazo de **2,8 px²** (M11).
- **Chapitas y monedas:** filas y columnas se leen de las figuras 1, 2 y 3 dibujadas, se ajusta su crecimiento y la figura
  k se cuenta chapita por chapita; los puntos de contacto de las monedas, armando el triángulo y contando pares a
  distancia de un diámetro.
- **Latas:** cada pirámide (impares, 1, 2, 3…, suma de las dos de encima) se arma lata por lata y se compara con la
  dibujada.
- **Cuentas largas:** enteros de Python (exactos), cifra por cifra; también la forma del resultado.
- **Ciclos:** la lista se escribe término por término hasta el lugar pedido (pulseras, bloques con y sin cifra de
  inicio, cifras de las unidades del producto, punto y flecha de `rm-ciclos`, espiral armada casilla por casilla).
- **Primos:** por división. Cada «Con n = c sale X, que es primo» y cada «tampoco sale primo» se comprueba.
- **Distractores:** cada id con su modelo propio del error («4 por cuadrado», «sin la figura 1», «el doble de la mitad»,
  «la figura siguiente», «sumar siempre lo del primer paso», «los primeros impares», «el cociente en vez del residuo»,
  «no descontar lo de antes»…), comparado con el valor de la opción.
- **Igualdades:** 9 864 igualdades escritas («4 + 3 × 3 = 13», «102 − 2 = 100 = 6 × 16 + 4»…) evaluadas.
- **Rehechos aparte también:** el validador con `calidad: 2` simulada (200 semillas: **0 problemas**),
  `node herramientas/ecuaciones-ancho.js` (54 pantallas, 306 renglones: todo cabe), la regla del papel con la marca
  simulada (sin fallas) y las pruebas (138 en verde).

Recuento: **«Ahora tú»: 2 400**, **«Así se resuelve»: 2 400**, **90 ejemplos** (83 automáticos y 7 de texto a mano) **y sus
30 juegos de alternativas de nivel 3**, **6 predicciones**, **6 juegos** (todos sus valores), **práctica: 3 600** (`rm-induccion`
400 por idea y 400 sin idea; `rm-ciclos` 400 y `rm-fichas` 400 desde la unidad), **18 casos**, **18 problemas de papel**
de la unidad y los **4 ítems** de rm-26 y rm-27.

**Resultado: ninguna respuesta marcada como correcta está mal, toda pregunta con alternativas tiene una sola correcta y
todas las igualdades son ciertas.** Lo que falla es lo que se dice alrededor del número: la unidad enseña en la idea 2 que
un caso más no prueba y en las ideas 3 a 5 dice que sí (A1), da por regla un patrón que en la idea 2 era la trampa (A2),
y algunas explicaciones afirman algo falso (A3).

## Lo que se pidió mirar aparte

- **La idea 2 enseña que tres casos no prueban sin dar por regla algo falso.** Las afirmaciones que fallan (n × n + n + p,
  6 × n ± 1, 2 × n × n + 11, 2ⁿ − 1, «termina en 7», «suma de dos primos») fallan donde dice la unidad, y cada caso que
  «cumple» cumple. Dos cosas no: el ejemplo 13 marca «Es falsa» como confusión, pero su propia solución muestra que la
  afirmación es falsa (n = 11) (A3); y la explicación de «24 pedazos» afirma algo falso (A3).
- **Reglas dichas como ciertas.** Todas las reglas que da la unidad son verdaderas (comprobadas en 400 semillas y en los
  ejemplos): figura n = primera + paso × (n − 1), n × (n + 1), n³ por fila, 2 multiplicado n − 1 veces, 9 × n de cifras,
  n × n con los unos hasta 9, los ciclos. Pero varias salen solo de mirar 3 o 4 casos, sin el porqué, justo después de la
  idea 2: la más grave es «cada fila suma el doble de la anterior» a partir de **1, 2, 4, 8**, la misma lista que en la torta
  falla (A2). Los unos (n × n) se presentan sin decir que el patrón se rompe pasado el 9 (salvo en un paso de «Así se
  resuelve»), y la regla de los nueves se usa con treses y seises sin la forma de su resultado (M10).
- **Distractores con error con nombre.** Todos llevan id (RM2, RMP1, RMP26, RMP27, RMP86, RMP160 a RMP171) y su valor es el
  de su error, salvo «sumaste 2 por fila» en las sumas de la pirámide de «suma de arriba»: vale 2 × (n − 1), y sumar 2 por
  fila desde la fila 1 da 2n − 1 (133 «Ahora tú», 163 de práctica, ejemplo 14) (M12). En la práctica, «Con n = x + 1 tampoco
  sale primo» es falso con 6 × n ± 1 (A3).
- **La misión y la predicción no se ven jugando.** Ninguna predicción cae en el rango del juego (fósforos hasta 7
  cuadrados y se pregunta 20; torta hasta 5 velitas y se pregunta 6; chapitas hasta la figura 6 y se pregunta la 10; latas
  hasta la fila 5 y se pregunta la 10; hasta 5 nueves y se preguntan 25; la pulsera hasta 30 y se pregunta el 50). Ninguna
  misión está cumplida al abrir (cada juego probado en todos sus valores). Sí se ve en el laboratorio: la mesa «La torta
  hasta 7 velitas» muestra los 31 pedazos y se puede abrir antes de Predice (B17, para Gerson; la exploración libre es la
  excepción de la regla 3).
- **Alternativas por su valor (las mostacillas tienen letras).** Ninguna explicación (30 juegos de nivel 3, 2 400 «Ahora
  tú») nombra una alternativa por su letra; los colores van con su nombre («Negra», «Verde»). La leyenda dice «R, V, N, B:
  roja, verde, negra y blanca». En la pulsera de seis colores hay mostacillas con D y C (dorada, celeste): solo en la
  figura, nunca en un texto que hable de alternativas.
- **El papel de `rm-ciclos`, `rm-fichas` y `sucesiones` con la marca simulada:** la regla del papel no da fallas (cada
  problema de una plantilla compartida dice su unidad y los de esta traen Datos). Por contenido: `sucesiones` p3 resuelve
  con «tₙ» y «razón» (notación de Aritmética que la propuesta deja fuera) y p9 (analogía numérica, que la unidad no enseña)
  da por probada una regla con dos filas; `rm-ciclos` p7 usa «4j² + bj + c» (segundo grado, de Álgebra) (M9).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 7, 9 | Ideas 3, 4 y 5 contra la 2 | La idea 2 enseña «casos que cumplen ⇏ regla» y «un caso más solo descarta»; el glosario, «que cumpla un caso de prueba no prueba la regla». Pero: idea 3, «Vale si: … y se prueba con un caso más»; idea 4, regla «pruébalo en una fila que no usaste» y Mira «Se prueba con la fila 5»; idea 5, regla con la llave **«caso 4: lo prueba»**, Mira «Se prueba con 4 nueves», ejemplo 6 «el caso 4, que se usa para probar», «Así se resuelve» «Lo pruebo con 4 nueves» y, en las ideas 3 y 4, «Pruebo la regla con la figura 4». El lector A se trabó ahí («¿un caso más prueba o no prueba?»). | Un solo discurso: la regla sale de cómo se arma (filas y columnas, el promedio de la fila, la forma del resultado); un caso más **se comprueba** y, si falla, descarta. Prueba: ningún texto de las ideas 3 a 6 dice «lo prueba», «se prueba con», «pruébalo», «para probar» o «Lo pruebo». |
| A2 | 7, 13 | Idea 4: ejemplos 3, 9 y 14, «Ahora tú» tipo 2 (133 de 400), la mesa de latas y `rm-induccion` `fila-pascal` | «Cada fila suma el doble de la anterior» sale de **1, 2, 4 y 8**, sin porqué: es la lista de la torta, donde «se duplica» falla con 6 velitas. El alumno que aprendió la idea 2 no puede saber por qué aquí sí vale. | Decir por qué: cada lata de una fila se suma en las dos que tiene debajo, así que cada número cuenta dos veces en la fila siguiente y la suma se duplica. Prueba: toda solución de «suma de arriba» trae el porqué. |
| A3 | 13 | Predice de la idea 2; ejemplo 13 de la idea 2; `rm-induccion` `primer-fallo` | (a) «24 pedazos»: «Sumaste 8, lo mismo que se sumó de 3 a 4 velitas»: de 3 a 4 se sumaron 4. (b) Ejemplo 13: «Es falsa» se explica como «confunde sin probar con falso», pero la solución dice que con n = 11 falla: la afirmación **es** falsa. (c) Práctica: con 6 × n + 1 y 6 × n − 1, «Con n = 5 (o 7) tampoco sale primo» es falso (31 y 41 son primos): **70 de 800**. | (a) «Sumaste 8 otra vez, lo que creció de 4 a 5 velitas; nada dice que el paso se repita». (b) La pregunta dice «Con solo esos cinco casos» y la explicación, que con ellos no se sabe (ninguno la contradice; recién falla en n = 11). (c) El distractor «después» es el siguiente n que tampoco es primo. Pruebas: las tres frases. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 8, regla 15 | Idea 2 y 5, «Así se resuelve» y «Ahora tú» | Repiten un ejemplo: idea 2, «Así se resuelve» 6 × n − 1 (n = 6) en **92 de 400**, que es el ejemplo 15; «Ahora tú» n × n + n + 41 (n = 40) en 45 (el ejemplo 11 y la historia) y la lista 2, 4, 8 en 20 (el ejemplo 9); idea 5, «Así se resuelve» la cifra del medio de 11 111 × 11 111 en **81** (el ejemplo 3 da ese resultado entero). | Las claves de esos ejemplos entran en `CLAVES` y los generadores las evitan (6 × n − 1 sale de «Así se resuelve»; 41 de «Ahora tú»; a ≥ 3; 11 111 fuera). Prueba: la firma de 400 semillas no coincide con ningún ejemplo. |
| M2 | 13, 4 | Ejemplos 3 de la idea 3 y 14 de la idea 2 | Datos que regalan: «La figura n tiene n filas de n + 1 chapitas» (es la regla; lector B, tarjeta 07); «El 2 es primo» (es la respuesta; tarjeta 06), con el cierre «Solo el 2… da una suma impar», impreciso (2 + 2 es par). | Fuera esas dos líneas de Datos (el dibujo da filas y columnas; la definición de primo da el 2). El cierre: «una suma de dos primos es impar solo si uno es par, y el único primo par es el 2». |
| M3 | 1 | «Ahora tú» de la idea 6 (298 de 400) y de la idea 1, tipo inverso (90 de 133) | Solo tres opciones más «No sé» (lector B: «falta Roja»): los distractores coinciden entre sí o con la correcta. | Más errores con nombre: la primera y la última del ciclo (RMP27), y en la idea 1 dos pasos de más o de menos. Prueba: 400 semillas con 4 opciones o más. |
| M4 | 13, 4 | Datos de la idea 6 (teoría y práctica) | «Residuo: 23 entre 4 da 5 y sobran 3» es la cuenta de un «Ahora tú» (95 = 4 × 23 + 3) y confunde con ciclos de 3 (lector B). | Un ejemplo que no cae en ningún caso: «17 entre 5 da 3 y sobran 2 (17 = 5 × 3 + 2)». |
| M5 | 3 | Idea 1, La regla | «× (n − 1)» baja solo al segundo renglón y se lee (figura 1 + paso) × (n − 1) (lector A). | La llave de lo que agregan los pasos encierra «paso × (n − 1)». |
| M6 | 3, 7 | Idea 2, La regla y Mira | «⇏» no se explica; «⇒ se / descarta» se parte; el «Vale si» no se entiende; los 31 pedazos no se pueden contar en el dibujo (lector A). | Ecuación sin flechas («un caso que no cumple → la descarta», con la llave «contraejemplo»); «Vale si» en palabras; la pieza numera los pedazos (`numerar`) en Mira y en el revelar. |
| M7 | 13, 7 | Prueba del curso, rm-26 A y B | «El primero usa 4 baldosas; el segundo, 10; el tercero, 18. Siguiendo así…»: tres números sin construcción admiten varias reglas (justo lo que enseña la idea 2); los rectángulos no dicen filas ni columnas. | El enunciado da las filas y columnas de los tres rectángulos. |
| M8 | 12 | Idea 3, Mira | «Agrega 4, 6, 8: no es lineal» (lector A: «no sé qué es lineal»). | «Agrega 4, 6, 8: no siempre lo mismo». |
| M9 | 6, 9 | Papel de `sucesiones` (p3, p9) y `rm-ciclos` (p7, tipo espiral) | p3 resuelve con «tₙ» y «razón»; p9 da por buena una regla vista en dos filas («la regla se cumple en las dos filas»); el tipo espiral de la práctica (61 de 400) trae los Datos del perímetro aunque pregunte por un número de la espiral, y su solución dice «4j² + j + 1, de segundo grado». | p3 sin notación de Aritmética; p9 dice que es la regla más simple que encaja, no una regla probada; Datos de la espiral según lo que pide. La solución de segundo grado queda para la sesión (tipo viejo compartido; B19). |
| M10 | 7, 13 | Idea 5: «Ahora tú» (treses, seises, unos), ejemplos 4, 7, 8, 11, 12 y 14 | «9 por cada cifra» con treses y seises sale de tres casos, sin la forma del resultado (lector B: «la regla de los nueves no sirve para los seises»); los unos (n × n) no avisan que se rompe pasado el 9 (lector B, tarjeta 14). | Cada uno con la forma de su resultado (n − 1 unos, un 0, n − 1 ochos y un 9; n − 1 cuatros, un 3, n − 1 cincos y un 6) y, con unos, «vale hasta 9 unos: con 10 ya hay llevadas». |
| M11 | 1 | Pieza, torta con 7 velitas (laboratorio) | Dos cruces a 2,2 px y un pedazo de 2,8 px²: a la vista hay 56 pedazos, no 57. | Otra séptima velita (las seis primeras no cambian); prueba: con 1 a 7 velitas, cruces a 6 px o más y pedazos de 12 px² o más. |
| M12 | 13 | Idea 4 y `rm-induccion` `fila-pascal` | «Sumaste 2 por fila» marca 2 × (n − 1) (28 en la fila 15); sumar 2 por fila da 2n − 1 (29). El error que da 2 × (n − 1) es multiplicar 2 por n − 1 en vez de multiplicar 2 por sí mismo. | «2 × 14 multiplica 2 por 14; la fila pide 2 multiplicado por sí mismo 14 veces». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 | «Así se resuelve» de la idea 6 | «162 entre 6 da 27 ciclos completos y sobran 0». | «y no sobra nada». |
| B2 | 5 | `rm-induccion` `unidades` y su papel (p6) | «Antes del ciclo van 1 términos». | «va 1 término». |
| B3 | 1 | Idea 2, la torta | Los puntitos grises (las llamas) no se explican (lector A). | Leyenda: «velita: el círculo del borde, con su llama». |
| B4 | 1 | Idea 2, Predice | Cinco casos con el título «Tres casos no prueban» (lector A). | No se toca: el título es la idea. |
| B5 | 1 | «Ahora tú» de la idea 2 | Ver que 1681 no es primo pide probar divisores hasta 41 (lector A). | La solución escribe «40 × 41 + 41 = 41 × 41» (n × (n + 1) + p con n = p − 1). |
| B6 | 1 | Idea 1, Mira paso 1 | «Figura 4» sobre un solo cuadrado. | No se toca (se arma paso a paso). |
| B7 | 1 | Idea 3, Juega y Mira | La figura 1 en tinta en Juega y en turquesa en Mira (lector A). | La figura 1 no agrega nada: sin turquesa en Mira. |
| B8 | 3 | Idea 4, La regla | La llave «promedio» sobre n × n; en una fila par no hay lata del medio (lector B). | Nota «promedio: n × n» y el «Vale si» con la fila 4: (15 + 17) ÷ 2 = 16. |
| B9 | 6 | Idea 5, La regla | n sin decir qué es (lector B). | «Con n nueves…». |
| B10 | 1 | Idea 6, Mira | La mostacilla 12 marcada y el cociente 12 de 50 = 4 × 12 + 2 (lector B). | No se toca (marca los lugares que cierran ciclo; el paso lo dice). |
| B11 | 1 | Ejemplo 3 de la idea 5 | «?» en la calculadora aunque 123 454 321 cabe (lector B). | No se toca: los ejercicios no muestran el resultado. |
| B12 | 13 | Ejemplos 13 y 14 de la idea 1 | «21 columnas sueltas… usan 147: no comparten» no se entiende (lector B, tarjeta 03). | «21 sale de repartir 152 entre 7, como si cada columna tuviera sus 7 fósforos». |
| B13 | 9 | Ejemplo 3 de la idea 2 | Demasiado fácil (lector B). | No se toca (nivel 1). |
| B14 | 5 | Idea 4, «2 multiplicado n − 1 veces» | Ambiguo (lector B, tarjeta 12). | «2 × 2 × … × 2, con n − 1 doses». |
| B15 | 5 | Ejemplo 14 de la idea 5 | «171 deja fuera el 3 y el 6» (¿cuáles?) (lector B, tarjeta 15). | «deja fuera el 3 y el 6 que no se repiten». |
| B16 | 8 | Papel de `rm-ciclos`, p4 | El bloque 31415 y 203 cifras es el ejemplo 12 de la idea 6. | Otro lugar (207). |
| B17 | 3 | Laboratorio, la torta | Muestra 31 pedazos antes de Predice. | Para Gerson (exploración libre). |
| B18 | 5 | `rm-fichas` `medios` (tipo viejo, compartido) | «4^2» y «(√2)^2» con el signo ^ en el texto del alumno (148 de 400). | Exponentes con superíndice. |
| B19 | 6 | `rm-ciclos` tipo espiral (viejo, compartido) | «4j² + j + 1, de segundo grado» (Álgebra). | Para la sesión: sumar los saltos de 8 en 8 sin fórmula de segundo grado. |

## Lo que está bien y hay que copiar al molde

- **Toda respuesta sale de contar el dibujo o de BigInt**: los fósforos se cuentan sobre los mismos palitos que se dibujan
  (y los 2 452 dibujos coinciden con un modelo armado aparte), las latas y las chapitas se arman una por una. De 9 600
  cuentas, ninguna respuesta estaba mal.
- **La torta en posición general, con prueba**: ángulos irregulares elegidos para que ningún punto junte tres cortes.
- **La calculadora que no alcanza**: con más de 10 cifras dice «Error» y en los ejercicios muestra «?»; no regala nada.
- **Juegos con rango corto y predicción lejos**: ninguna predicción se ve jugando.
- **`CLAVES` por idea**: el mecanismo de Certezas contra casos repetidos ya está; solo faltaban claves (M1).

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `probar-uno` | En una unidad que enseña que los casos no prueban, ningún texto dice que un caso más «prueba» una regla (A1). | Sí, por unidad: lista de frases («lo prueba», «se prueba con», «pruébalo») en las ideas que siguen a la que lo enseña. |
| `regla-con-porque` | Una regla que sale de mirar casos (3 o 4 valores y «cada… es…») trae su porqué o se presenta como hipótesis (A2). | A medias: marcar soluciones con «Cada fila/figura … el doble/al cubo» sin «porque»/«por qué»; revisión a mano. |
| `mismo-patron-distinto-final` | Si una idea muestra que una lista (1, 2, 4, 8) engaña, otra idea no da esa misma lista como regla sin explicarla (A2). | Sí: listas de 4 números iguales entre ideas distintas. |
| `afirma-primo` | «sale X, que es primo» / «tampoco sale primo» se comprueban en cada semilla (A3c). | Sí, en la prueba de la plantilla. |
| `siFuera-cuenta-pasada` | «lo mismo que se sumó de a a b» se comprueba con los casos del enunciado (A3a). | A medias. |
| `datos-sin-regla` | Los Datos de un ejercicio de inducción traen casos, nunca la cuenta general que se pide encontrar (M2). | A medias: una línea de Datos con «n» y la misma forma que la respuesta. |
| `opciones-minimas` | «Ahora tú» trae al menos 4 opciones (más «No sé») en toda semilla (M3). | Sí. |
| `dato-ejemplo-choca` | El número de ejemplo de una definición en Datos no es la cuenta de un caso de esa idea (M4). | Sí: números de Datos contra las cuentas de 400 semillas. |

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), hecha el 20 nov en la misma sesión del cierre. Cada corrección lleva una
prueba que falla con la versión de antes (comprobado: las pruebas nuevas, corridas contra una copia con los archivos
viejos en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ri/contra-viejo/`, fallan:
**7 de la teoría, 1 de la pieza y 3 de `rm-induccion`**; las de antes siguen pasando). Después se volvieron a correr los
scripts de la auditoría sobre un volcado nuevo (`dump2.json`): 2 400 «Ahora tú», 2 400 «Así se resuelve», 90 ejemplos, 6
predicciones, 6 juegos, 3 600 de práctica, **0 fallas** (quedan dos avisos que son del script: una igualdad partida en
«1 + 2 + … + 10» y el «sumar 2 por fila», que ahora dice que empieza en la fila 2). Validador con `calidad: 2` simulada y
200 semillas: 0 problemas. `ecuaciones-ancho`: todo cabe. Regla del papel con la marca simulada: sin fallas.
`node herramientas/papel-generador.js --revisar`: al día. Pruebas: `razonamiento-inductivo.test.js` 18/18 (11 + 7 del
cierre), `rm-patrones.test.js` 8/8, `rm-induccion` 26/26, `rm-ciclos` 43/43, `rm-fichas` 56/56, `sucesiones` 39/39,
`catalogo/pruebas/pruebas.test.js` en verde; `contenido/teoria/teoria.test.js` falla solo en
`trigonometria/angulos-en-posicion-normal.js` (otra unidad, en trabajo de otro agente). `npm run catalogo` corrió.
Capturas después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ri/despues/` y
`despues2/` (momentos con la regla de la idea 2 corregida).

### Alta

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| A1 | Un solo discurso: la regla sale de cómo se arma; un caso más **se comprueba** y, si falla, descarta. Idea 3: «Vale si: la cuenta sale de las filas y columnas de la figura. Un caso más solo la comprueba: si falla, se descarta»; idea 4: regla «La regla vale si ves por qué: n latas que promedian n × n», Mira «Se comprueba con la fila 5», aprendizaje «se busca por qué vale»; idea 5: llave «caso 4: lo comprueba», Mira con el porqué («multiplicar por 99…9 es multiplicar por 100…0 y restar»), ejemplo 6 y «Así se resuelve» con «compruebo»; idea 2: «Se revisa con n = 0, 1, 2…». El glosario: «hipótesis» simple, «todavía no está probado». | Ningún texto de las seis ideas (400 semillas) dice «se prueba con/en», «lo prueba», «pruébalo», «para probar», «pruebo». |
| A2 | La suma que se duplica dice por qué: «Cada número de una fila pasa a las dos latas que tiene debajo (los bordes repiten el 1): por eso la suma se duplica», en los ejemplos 3, 9 y 14, «Ahora tú», la mesa y `rm-induccion` (`fila-pascal`). | Toda solución de «suma de arriba» lo trae, y en 30 filas la suma de la siguiente es el doble. Práctica: en 400 semillas. |
| A3 | (a) «Sumaste 8 otra vez, lo que creció de 4 a 5 velitas; nada dice que el paso se repita». (b) Ejemplo 13: «Con solo esos cinco casos, ¿qué se puede afirmar?»; «Es falsa» no se sabe con esos cinco: ninguno la contradice; la solución: «Seguir revisando la descarta recién en n = 11… Con los cinco casos solos, eso no se sabía». (c) `rm-induccion`: el distractor «después» es el siguiente n que tampoco cumple (`primerFallo(fn, x + 1)`). | (a) y (b) en la teoría; (c) «tampoco sale primo» es verdad en 400 semillas. |

### Media

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| M1 | «Así se resuelve» de la idea 2 usa 2 × n + 1 (desde 1, falla en 4) y 2 × n × n + 11; «Ahora tú» deja n × n + n + 41 y empieza las listas en 3; el medio de 11 111 × 11 111 sale de «Así se resuelve» (clave del ejemplo 3). | Firma en 400 semillas. |
| M2 | Fuera «La figura n tiene n filas de n + 1 chapitas» (la solución las lee del dibujo: 1 × 2, 2 × 3, 3 × 4) y «El 2 es primo»; cierre del ejemplo 14: «Para que la suma sea impar, un primo tiene que ser par: el 2». | Los Datos de esos ejemplos. |
| M3 | Pulseras de 4 o 5 colores y bloques de 4 a 6 cifras en «Ahora tú» (con 3 no hay 4 opciones distintas); errores con nombre nuevos: dos de más (RMP27), la primera del bloque, y en la idea 1 dos pasos de más o de menos (RMP161, los mismos de la práctica). | 400 semillas de cada idea con 4 opciones o más. |
| M4 | «Residuo: 17 entre 5 da 3 y sobran 2 (17 = 5 × 3 + 2)» en la teoría, `rm-induccion`, `rm-ciclos` y su papel. | Ningún texto con «23 entre 4» (teoría, `rm-induccion`, `rm-ciclos`). |
| M5 | La llave «lo que agregan los pasos» encierra «paso × (n − 1)». | La llave lo contiene. |
| M6 | Regla de la idea 2: «[un caso que falla]⏟contraejemplo la descarta», sin ⇏; «Vale si: muchos casos que cumplen no prueban la regla: uno más puede descartarla, nunca probarla. Si caben varias reglas, decide el enunciado». Mira: «Con 6 velitas se cuentan 31 pedazos (con la lupa se ven todos)». **Numerar los pedazos no se hizo**: el pedazo más chico con 6 velitas tiene un radio interior de 3,9 px y no cabe un número sin tocar los cortes (decidido por la sesión, Gerson revisa después). | Sin «⇏» en la regla. |
| M7 | rm-26 A y B dicen filas y columnas: «el primero tiene 1 fila de 4 baldosas (4 en total); el segundo, 2 filas de 5 (10); el tercero, 3 filas de 6 (18)». Respuestas iguales (180 y 132, rehechas aparte). | Prueba de la unidad: cada rectángulo del modelo aparece con sus filas. |
| M8 | «Agrega 4, 6, 8: no siempre lo mismo». | Sin «lineal» en la nota. |
| M9 | `sucesiones` p3 sin «tₙ» ni «razón» (3 + 2 × 24 = 51); p9: «Que cumpla las dos filas no la prueba: es la más simple que encaja con todas, y es la que se usa»; `rm-ciclos`: la espiral que pregunta un número trae los Datos de la espiral, no los del perímetro; p7 resuelve sumando los saltos (24 × 15 + 8 × (1 + … + 23) = 2568; 8 + 2568 = 2576, rehecho con la espiral armada casilla por casilla) con 1 + 2 + … + n en Datos. | `rm-ciclos`: 400 semillas sin Datos de perímetro en la espiral de números. |
| M10 | Treses y seises con la forma de su resultado («Unos, un 0, ochos y un 9: cada 1 con un 8 suma 9, como el 0 con el 9»; cuatros, un 3, cincos y un 6) y los unos con «vale hasta 9 unos; con 10, hay llevadas», en «Ahora tú», los ejemplos 4, 7, 8, 11, 12 y 14 y `rm-induccion`. | La forma que dicen los textos, comprobada con BigInt de 2 a 60 cifras; las soluciones la traen. |
| M11 | La séptima velita pasa de 5,9 a 2,65 rad (las seis primeras no cambian: 1 a 31 pedazos iguales): el cruce más cercano a otro, de 2,2 a 9,4 px; el pedazo más chico, de 2,8 a 65 px². | `rm-patrones.test.js`: cruces a más de 6 px (antes bastaba 1,5). |
| M12 | No era un error de valor: 2 × (n − 1) es sumar 2 por fila desde la fila 2. Pasa a Baja y se aclara: «Seguiste 2, 4, 6…: sumaste 2 por fila desde la fila 2. Pero cada suma duplica la anterior» (y «28 es 2 × 14, que suma 2 por fila desde la fila 2»). | — |

### Baja

- **Hecho:** B1 («no sobra nada»), B2 («va 1 término» y la solución dice qué término toca), B3 (leyenda «el círculo del
  borde, con su llama»), B5 (la solución escribe n × (n + 1) + p = p × p), B7 (la figura 1 sin turquesa), B8 (nota «su
  promedio» y la fila par en el «Vale si»), B9 («Para n cifras repetidas…»), B12, B14 («2 × 2 × … × 2, con n − 1 doses»),
  B15, B16 (`rm-ciclos` p4 pasa a 207 cifras: 578) y B18 (`rm-fichas`: exponentes con superíndice, con su prueba).
  De la ronda del lector, además: el ejemplo 14 de la idea 3 dice «Filas por columnas: 1 × 3, 2 × 4, 3 × 5» y la
  calculadora, «(30 cifras 9 cada uno)» (`rutinas/frio/razonamiento-matematico.razonamiento-inductivo.md`).
- **No se hizo:** B4, B6, B10, B11 y B13 (arriba, por qué); B17 y B19 (abajo).

### Para Gerson (decidido por la sesión, Gerson revisa después)

1. **Los 31 pedazos no se numeran** (M6): no caben números en los pedazos más chicos; se remite a la lupa. Descartado:
   agrandar la torta (no alcanza) o numerar con flechas.
2. **La mesa de la torta muestra 31 antes de Predice** (B17): es exploración libre (excepción de la regla 3). Descartado:
   limitar la mesa a 5 velitas (perdería el contraejemplo).
3. **`sucesiones` p9 (analogía numérica) sigue en esta unidad** con la frase de que dos filas no prueban la regla; la
   unidad no enseña analogías. Descartado: moverla a otra unidad sin saber cuál la enseña.
4. **El tipo espiral de `rm-ciclos`** (viejo, compartido) sigue resolviendo con «4j² + j + 1, de segundo grado» (B19); su
   papel de esta unidad ya no. Cambiarlo es de la plantilla compartida.
5. **Dibujos de prueba de `rm-patrones`** (todos con `data-prueba`), como en las unidades anteriores.

### Archivos tocados

`contenido/teoria/razonamiento-matematico/razonamiento-inductivo.js` y su `.test.js`; `nucleo/kit/piezas/rm-patrones.js`
(un ángulo) y su prueba; `plantillas/rm-induccion/generador.js`, `generador.test.js` y `papel.json` (regenerado con
`papel-generador.js`; `casos.json` no cambia); `plantillas/rm-ciclos/generador.js` (bloque de la unidad), `generador.test.js`
y `papel.json` (p4 a p7 y p10); `plantillas/rm-fichas/generador.js` (exponentes) y `generador.test.js`;
`plantillas/sucesiones/papel.json` (p3 y p9); `catalogo/pruebas/razonamiento-matematico.json` (rm-26). `npm run catalogo`
corrió.
