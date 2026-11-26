# Auditoría de contenido: «Arreglos numéricos y cuadrados mágicos» (razonamiento-matematico.arreglos-numericos)

26 nov 2026. Auditor externo de cierre (`docs/metodo/unidad/cierre-delegado.md`, con `5-auditor.md` y `6-correcciones.md`),
que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa9/propuesta-razonamiento-matematico.md`. Pasada del
redactor: `rutinas/redaccion/razonamiento-matematico.arreglos-numericos.md` (con sus tres notas para el auditor, que se
resuelven abajo). Lo que vieron los dos lectores en frío está en `rutinas/frio/razonamiento-matematico.arreglos-numericos.md`.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-matematico/arreglos-numericos.js` (sin `calidad: 2`): las 6 ideas con sus 7
  momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea), letras, glosario y
  laboratorio.
- La práctica `plantillas/rm-arreglos-ideas/` (18 tipos en las 6 ideas, `casos.json` y `papel.json`).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4234). La primera tanda
  de capturas de momentos salió rota (pantalla «No se pudo abrir la teoría», porque el servidor se cayó a mitad de la
  corrida); se rehízo en `lector2` y se comprobó con md5 que no hay pantallas repetidas.

**Cuentas, rehechas aparte por fuerza bruta** (Python, sin el resolvedor de la unidad ni el del generador; de la unidad y
del generador solo se lee el texto que ve el alumno). Scripts en el scratchpad de la sesión,
`cierre-rm/cuentas/`: `bruta.py` (predicciones, misiones y ejemplos), `resolver.py` (lee la pregunta y resuelve),
`practica.py` (práctica y papel), `dump.js` y `dumpgen.js` (vuelcan el texto).
- **Marcos** (triángulo, cuadrado, pentágono): todos los juegos de esquinas en todo orden; con las esquinas, los medios
  quedan fijados por la suma y se exige que sean justo las tarjetas que quedan. **Cruces y estrellas**: todas las
  permutaciones. **Repartos**: todas las particiones en grupos del tamaño pedido. **Cuadrados 3 × 3 de suma**: los 8
  giros y reflejos del Lo Shu llevados a la lista (se comprueba que la lista va con salto fijo y que cada uno es mágico);
  para la Predice, los 9! acomodos. **Cuadrados que multiplican**: todas las grillas de divisores de 216 (la Predice).
  **Muros**: fila por fila, y el adobe que falta probando valores.
- **6 predicciones** con sus distractores; **6 misiones** en toda su grilla: reparto (2 soluciones espejo, las dos las
  acepta `logrado`), cruz (una sola: empieza en 2 con el 4 al centro), triángulo de 11 (una sola terna, 2, 4 y 6), 4 × 4
  de 50 (empieza en 5), tiras (2 soluciones espejo) y muro de 20 (28 bases distintas, todas aceptadas: la misión pide
  una cualquiera).
- **Los 90 ejemplos**: respuesta, unicidad y cada arreglo que el resuelto dice que existe («se arma con…»). Los 30 de
  nivel 3, con cada explicación de distractor.
- **«Ahora tú»: 1 200** y **«Así se resuelve»: 1 200** (200 por idea): una sola opción correcta, la del resolvedor, ninguna
  otra con el mismo valor, y que el reparto, el marco o el cuadrado de la pregunta exista. En la idea 3, cada «29 se arma,
  pero hay otra más grande» se comprobó que se arma.
- **Práctica: 1 200** problemas (200 por idea), los **18 casos** de `casos.json` (desde su `entrada`) y los **8** del papel.

**Resultado: ninguna respuesta marcada como correcta está mal y toda pregunta tiene una sola respuesta.** Fallan dos
distractores que no salen de su error (A2, M1), un dato que regala la respuesta en todo el cuadrado que multiplica (A1),
el porqué de dos pasos (A3, M3) y varias cosas de figura y redacción.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas** antes de corregir. Ninguna de las
faltas de abajo la ve una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13 | `D_CUBOS` de la teoría (ejemplos 1, 5, 7, 8 y 14 de la idea 5, «Ahora tú» y «Así se resuelve» del centro) y del generador (`centro`, `datosDe`) | Los Datos traían «Números por sí mismos tres veces: … 10 → 1000; 14 → 2744; 15 → 3375». Cuando se pregunta el centro de un cuadrado que multiplica 3375, el dato dice «15 → 3375»: la respuesta, buscada en una tabla (lector B, tarjeta 15 y momentos 6 y 7). El nivel 3 quedaba más fácil que el 2. | En vez de la tabla, el producto en factores primos («3375 = 3 × 3 × 3 × 5 × 5 × 5»), como ya hace la Predice. Ningún centro primo (343 = 7 × 7 × 7 lo diría): los ejemplos 5 y 7 pasan a 512 y 1728, y la práctica a centros 4, 6, 10, 12, 14, 15 y 21. Prueba: ningún dato del centro con «→» ni con un solo factor repetido igual al centro. |
| A2 | 13 | Ejemplos 8 y 14 de la idea 5; «Ahora tú» del centro | «Primero el centro: 10 × 10 × 10 = 1000» y «El centro multiplicado tres veces por sí mismo da 3375» se afirman sin razón ni dato (lector B). La regla lo dice, pero los ejemplos se abren después de la Predice y pueden leerse antes. | El porqué en el resuelto (las cuatro líneas del centro tienen las nueve casillas, P × P × P, y el centro tres veces más), y en el ejemplo 8, donde el centro es un paso, el dato «el centro por sí mismo tres veces da P». |
| A3 | 13 | «Así se resuelve» de la idea 3 (todas las semillas) | Las tarjetas van de 2 en 2: «la cuenta da 61. Es entera, pero no se arma, y el primer valor que sí se arma es 60». No dice por qué (tres pares siempre suman par), ni hacia dónde se prueba; en «diferencia», la menor sale sin cuenta («la menor que se arma es 60»). En las 200 semillas el caso es siempre el de paridad (lector A). | Una función `porQue` que da la razón (paridad de tres tarjetas, no entera, o ninguna elección de esquinas) y el sentido de la prueba; la menor de «diferencia» con su propia cuenta. Prueba: todo «Es entera, pero» dice su porqué. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13, 10 | Predice de la idea 2, opción «12» (RMP182) | La explicación dice «algo entra dos veces, pero son las esquinas, no las del medio». Contar dos veces las del medio (2, 4 y 6) da (21 + 12) ÷ 3 = 11, no 12; la propuesta lo cuenta como (21 + 15) ÷ 3 y 15 no es nada del marco. En la práctica y en los ejemplos 11 y 13 de la idea 2 el mismo error sí da su valor ((2T − V) ÷ L). | La opción es 11, con la cuenta en su explicación. |
| M2 | 13 | Ejemplo 15 de la idea 6, «Cinco adobes iguales» (nota 1 del redactor) | «20 cuenta dos veces los del medio»: con cinco 2, eso da 2 + 4 + 4 + 4 + 2 = 16, no 20; 20 es duplicar la base. «64 duplica de más» no sale de ningún error. | Alternativas 10, 20, 22, 16 y 32: 20 duplica la base, 22 cuenta tres veces los del medio (como el muro de cuatro), 16 son solo los caminos. |
| M3 | 3, 7 | Regla de la idea 4 y Mira | «En el 3 × 3 pasan cuatro líneas por el centro, y por eso el centro es la tercera parte» no justifica nada; la nota «4 × 15 = 45 + 3 × 5» va sin decir qué es (lector B). La condición mezclaba el 3 × 3 con el caso general. | Regla: las cuatro líneas del centro cubren las nueve casillas y el centro tres veces más; nota «Las cuatro líneas: 4 × 15 = 45 + 3 × 5»; condición «el cuadrado es mágico; para el centro y las opuestas, además, es de 3 × 3…». |
| M4 | 12 (cada nivel sube) | Ejemplo 14 de la idea 3, «La cruz, la mayor» | Es la misma cruz de 1 a 5 del ejemplo 3 de la idea 2 (nivel 1), con la misma cuenta y el mismo arreglo (lector A, tarjetas 04 y 09). | La cruz grande de 1 a 9 (fila y columna de cinco): la mayor es 27, con el 9 al centro y grupos de 18. Distractores 22,5, 25, 9 y 45. |
| M5 | 1, molde §3 | Todo marco vacío (Ahora tú y Así se resuelve de las ideas 2 y 3, ejemplos 8 de la idea 3 y otros) | Con todas las casillas en «?», el pentágono se lee como un óvalo de diez casillas y no se sabe cuáles son esquinas (lector A, tarjeta 08 y Ahora tú 3; lo vi en la captura). | Las esquinas siempre con el papel de lo compartido (turquesa), también vacías (`esqComp` en `marco`). Prueba de la unidad. |
| M6 | 13 | Ejemplo 14 de la idea 2, «Las que no son esquina» | «V = 52 − 36 = 16» con V sin decir y el 36 sin «T = 36» (lector A, tarjeta 06). Lo mismo, el 15 de la cruz sin «T = 15» (tarjeta 04) y los totales de los ejemplos 1, 4 y 5. | El resuelto dice «las esquinas, que suman V» y lleva «T = …» en la ecuación. |
| M7 | 4 (datos) | Idea 4, «Así se resuelve» (centro y fila) | Suma 14, 17, …, 38 sin dato que diga cómo: `D_SEGUIDOS` hablaba de seguidos o de 2 en 2 (lector B). | `D_SEGUIDOS` con «un mismo salto», en la teoría y en la práctica, y el paso con la fórmula escrita. |
| M8 | 2, 7 | Juega de las ideas 2, 5 y 6; Lee de las ideas 2, 4 y 5; voces | Control «Desde» sin decir de qué; V sin decir por qué V («vértice» no aparece); Faro dice «tope» y la regla «cota»; «tablero de madera» gris con rombos sin explicar (son las diagonales); «otro juego de la kermés» y tiras que parecen caja; leyenda del producto con «= 72, = 18»; leyenda del muro «adobe: la suma de los dos de abajo», que no vale para la base; la voz de «Ahora tú» de la idea 4 dice «después, lo que falta» cuando solo se pide la suma (lectores A y B). | «Primera tarjeta»; Lee de la idea 2 presenta V «de vértices» (y la tabla de letras); «cota» en las tres voces; Lee del tablero dice que las líneas grises son las diagonales; Lee de las tiras («una bandeja con dos tiras… la de arriba y la de abajo»); leyendas nuevas; voz «Piensa qué se reparte entre las filas y qué líneas pasan por el centro». |
| M9 | 13, 10 | Explicación de «la casilla de enfrente repite el número» (Ahora tú de las ideas 4 y 5, práctica `opuesta` y `opuestaP`) | «No repite el número, porque cada número va una sola vez», cuando la pregunta no dice que vayan una vez (y en la idea 5 se permite repetir). | «Las dos opuestas suman 2c (multiplican c × c), y a + a no da eso». |
| M10 | 7 | Regla de la idea 6 | «Cada fila de caminos sale de la anterior sumando vecinos» no se muestra en ningún lado (lector B). | «La fila de cuatro sale de la de tres como el muro: 1, 1 + 2, 2 + 1, 1». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 4 | Predice de la idea 1 | El único dato («un número par se parte en dos mitades enteras») apunta a la opción «el total es par», y lo que decide es que 15 no sale sumando pares (lector A). | Se agrega «Al sumar números pares, el resultado siempre es par» (información, no la fórmula). |
| B2 | 7 | Mira y regla de la idea 1 | «Con 2, 4, 6, 8 y 10: mitad 15, impar» no se entiende solo; «lo que ya tiene» se partía en dos líneas en la caja de la regla. | «2, 4, 6, 8 y 10 suman 30; la mitad, 15, es impar»; espacios duros en «lo que ya tiene». |
| B3 | 1 | «Así se resuelve» de la idea 1 y ejemplo 4 | Rótulos «Columna 1, 2, 3» al lado de lo que la bandeja dibuja como filas. | Filas en el texto y en los rótulos. |
| B4 | 13 | Ejemplo 14 de la idea 6 | No dice qué orden usa (hay varios que dan 24). | «Con el orden 1, 4, 3 y 2…» y que otros órdenes con 4 y 3 al medio dan lo mismo. |
| B5 | 13 | Ejemplo 3 de la idea 4 | No dice de dónde sale T (el 8 sí). | «Son dieciséis números seguidos, así que el total sale con la fórmula». |
| B6 | 12 | Ejemplos 3 y 8 de la idea 4 | Casi iguales (4 × 4 de 1 a 16 y de 3 a 18). | Sin cambio: el 8 obliga a contar los 16 números; anotado. |
| B7 | 1 | Ejemplo 14 de la idea 4 (tarjeta 12 del lector B) | «Ahora sumo esas dos casillas opuestas.» llega al borde del recuadro. | Es del ancho del lector (`app/`), fuera de alcance; se anota. |

### Notas del redactor

1. **Ejemplo 15 de la idea 6**: confirmado y corregido (M2).
2. **Predice de la idea 3, opción 21 (RMP185)**: la explicación nueva es correcta: 21 = 8 + 7 + 6 llena un lado, y con 1 a 8
   ningún arreglo pasa de 15 por lado (fuerza bruta: las sumas que se arman son 12, 13, 14 y 15), así que los otros lados
   no llegan. Es la lectura de RMP185 («los tres mayores en cada lado a la vez»). Sin cambio.
3. **Idea 5, «no se reparte con ÷ 3»**: no hace falta en la condición (no es una condición); lo dicen la Predice (opción 72)
   y el Mira, y ahora también el porqué de los ejemplos 1 y 14. Sin cambio.
4. **D_SEGUIDOS en la idea 3**: «Así se resuelve» de la idea 3 no usa la fórmula en el texto (suma la lista); sin cambio.

### Observaciones que no se corrigen (contrato o decisión ya tomada)

- **«Los Datos traen la fórmula armada»** (lector A, tarjetas 03, 07 y 08 y los «Así se resuelve» y «Ahora tú» de las
  ideas 1 a 3): el contrato pide que los datos traigan la fórmula general que se usa (`plan-calidad.md`, punto 13); lo que
  no va es el paso hecho ni el atajo, y no lo hay. Lo que sí regalaba la respuesta era la tabla de cubos (A1).
- **La respuesta en violeta «como S»** (tarjetas 03 y 06): violeta es lo que se pide (`molde-unidad.md`, tabla de colores).
- **El título de la idea 4 habla del centro y el juego es el 4 × 4** (lector B): decisión de la propuesta, para que el
  juego no muestre la respuesta de la Predice (el centro del 3 × 3).
- **Misiones con varias soluciones** (reparto, tiras y muro): `logrado` las acepta todas.

## Lo que está bien y hay que copiar al molde

- **Cada distractor de «Ahora tú» y de la práctica sale de su error con una cuenta** (`ds` con `valor`), y en 2 400 + 1 200
  problemas ninguno coincide con la correcta. Los dos que fallaban eran de texto fijo (M1, M2).
- **El juego de la idea 3 obliga a ver que «entera» no basta**: la grilla tiene ternas que dan entero y no se arman.
- **Los cuadrados se arman con fórmula y se comprueban al cargar** (`esMulti`, Lo Shu llevado a la lista): no hay
  cuadrados inventados a mano.
- **La prueba propia lee el texto del alumno** y no el código, como pide el método.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `datos-tabla-respuesta` | Ningún dato es una tabla («a → b») que contenga la pareja pregunta-respuesta del ejercicio (A1). `datos-respuesta` solo mira «lo que se pregunta = respuesta». | Sí: en cada línea de datos con «→», ningún par «r → x» con r la respuesta y x un número del enunciado. |
| `datos-factores-respuesta` | Si un dato descompone un número del enunciado en factores, los factores no son todos la respuesta (343 = 7 × 7 × 7). | Sí (ya lo vio `datos-respuesta` en el ejemplo 7 tras la corrección; vale extenderlo a «Ahora tú» con 200 semillas). |
| `distractor-con-cuenta` | En la Predice y en los ejemplos de nivel 3, la explicación de cada alternativa que nombra un error con cuenta («cuenta dos veces los del medio») da ese valor (M1, M2). | No en general; sí en la prueba propia de cada unidad. |
| `cota-con-porque` | Un paso que descarta un candidato («es entera, pero no se arma») dice por qué (A3). | A medias: buscar «pero no» sin «porque / siempre / ninguna» en el mismo paso. |
| `ejemplo-repetido` | Dos ejemplos de la unidad no tienen la misma lista de datos y la misma cuenta en niveles distintos (M4). | Sí: comparar los números del enunciado y la respuesta entre ejemplos de la unidad. |

## Correcciones (26 nov)

Todo en `contenido/teoria/razonamiento-matematico/arreglos-numericos.js` y `plantillas/rm-arreglos-ideas/` (generador,
`casos.json` y papel regenerado). Pruebas nuevas al final de `arreglos-numericos.test.js` (5) y de `generador.test.js`
(1); las seis fallan con la versión anterior (comprobado con copias en el scratchpad: la unidad de `HEAD` y el generador
con la tabla de cubos y los centros viejos).

- **A1**: `D_CUBOS` fuera de la teoría y del generador; `D_FACT(P)` da los factores primos. Ejemplos 5 y 7 de la idea 5
  pasan a 512 (centro 8) y 1728 (centro 12, esquinas 144); «Ahora tú» del centro usa centros 21, 22 y 26 (ya no repite
  los ejemplos 1 y 14, que el lector B vio repetidos); la práctica, centros no primos. `casos.json` caso-1: la misma semilla
  ahora da 3375 (respuesta 15, rehecha aparte). Prueba: «los Datos del cuadrado que multiplica no traen el centro» y
  «los Datos del centro no traen la respuesta» (generador).
- **A2**: el porqué en los ejemplos 1 y 14 y en la solución de «Ahora tú»; dato `D_CENTRO_P` en el ejemplo 8.
- **A3**: `porQue` en «Así se resuelve» de la idea 3 y la menor de «diferencia» con su cuenta. Prueba: «dice por qué la
  cota entera no se arma».
- **M1**: opción 11 (antes 12). **M2**: alternativas 10, 20, 22, 16 y 32 con su explicación. Prueba común.
- **M3**: regla, nota del Mira y condición de la idea 4.
- **M4**: ejemplo 14 de la idea 3, «La cruz grande, la mayor» (27). Prueba: «la cruz de nivel 3 de la idea 3 no repite…».
- **M5**: `esqComp` en `marco`. Prueba: «las esquinas llevan el papel de lo compartido».
- **M6, M7, M8, M9, M10, B1 a B5**: como se propone arriba (texto). **B6, B7**: sin cambio (anotado).
- Recortes para los topes del validador después de las correcciones (tarjeta de Lee de la idea 2, pasos de la idea 3,
  reglas 4 y 6, leyendas de las ideas 5 y 6).

Cuentas después de corregir, otra vez aparte: 1 200 «Ahora tú» + 1 200 «Así se resuelve» + 1 200 de práctica + 8 del papel
+ 18 casos, sin fallas; los ejemplos cambiados, por fuerza bruta (cruz de 1 a 9: la mayor es 27; 512 = 8³; 1728 = 12³).
Validador con `calidad: 2` simulada (200 semillas): 0 problemas. `node --test` de la unidad, del generador y de
`rm-casillas`: en verde (20 + 1). `contenido/teoria/teoria.test.js`: la de esta unidad pasa; fallan
`geometria/puntos-notables.js` (glosario de 31 palabras) y «archivos de la app al día» (`app/datos/glosario/algebra.json`),
de otras sesiones. No corrí `npm run catalogo`: esta unidad no cambió `catalogo/` ni `plantilla.json`, y la corrida
reescribiría los glosarios de otras unidades en curso. Papel: `node herramientas/papel-generador.js rm-arreglos-ideas` y
`--revisar` al día.

**Para Gerson**: nada nuevo que decidir. Decidido por la sesión (Gerson revisa después): el dato de la Predice de la idea 1
(B1) y el cambio de centros del cuadrado que multiplica en «Ahora tú» y en la práctica (A1).
