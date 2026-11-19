# Auditoría de contenido: «Ordenamiento de información» (razonamiento-matematico.ordenamiento-de-informacion)

19 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato:
`docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-razonamiento-matematico.md` (§10 y
§11). Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/razonamiento-matematico.ordenamiento-de-informacion.md`;
aquí se cita solo cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js` (v0.4.0, sin `calidad: 2`): las 6 ideas
  con sus 7 momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea), el glosario
  (22 términos), las 4 mesas del laboratorio y la historia.
- La pieza `nucleo/kit/piezas/rm-orden.js` (escenas banca, edificio, talla, sobres, barras y mesa) y su prueba.
- La práctica: `plantillas/rm-ordenamiento/` (11 tipos en las 6 ideas, `casos.json` y `papel.json`); los tipos de esta
  unidad en `rm-parentesco` (orden, edades) y `rm-deduccion` (puntajes); la escena `orden-informacion` («Más mesas del
  tema», con su papel).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4318).

**Cuentas.** Rehechas con resolvedores propios en Python
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-rm/cuentas/`: `motor.py`, `ahora.py`,
`ejemplos.py`, `practica.py`, `papel.py`, `casos.py`). De la unidad y de los generadores solo se lee el texto que ve el
alumno (`dump.js` y `dumpgen.js` vuelcan lo que devuelve `generar`): cada pista se lee con una expresión regular, se prueban
todos los arreglos (filas, pisos con huecos, llegadas, tallas y edades con y sin empates, repartos de valores, mesas con
una persona fija, mesas numeradas con sillas vacías) y se cuenta. La derecha en la mesa no se copia de la unidad: sale de
vectores (la mano derecha de quien mira al centro, vista desde arriba), y la silla de enfrente en la cuadrada, de
coordenadas.
- **«Ahora tú»: 1 200** (200 por idea). Una sola respuesta, la marcada, y cada explicación de distractor comprobada:
  «valdría sin la pista N» (sin ella cabe; con todas no), «tendrías que saltarte dos pistas» (ninguna sola basta), «pasa en
  uno de los N» (quedan N y pasa en uno), «con izquierda y derecha cambiadas» (las pistas al espejo dejan un solo orden y
  da eso), «si “a la izquierda de” obligara a ir pegados», el piso con la distancia leída como «pisos en medio», «está a su
  izquierda», «junto a quien queda enfrente», la media vuelta, el mismo lado y la esquina en la cuadrada.
- **«Así se resuelve»: 1 200.** El orden completo y cada «no va en el N (rompe la pista M)», «en a y b rompe la pista M»,
  «la N pone a X antes de Y», «Solo a + b da S» y «la media vuelta coincide / no es la de enfrente».
- **Los 90 ejemplos** y las 6 predicciones, a mano con el motor propio (123 comprobaciones), con la letra de cada nivel 3 y
  las explicaciones de sus distractores.
- **Las 6 misiones y sus lecturas** en toda su grilla (4 + 5 + 4 + 3 + 4 + 8 casos).
- **La práctica: 1 200** problemas de `rm-ordenamiento` (200 por idea, con `{ idea }`), los 22 de `casos.json` y los 8 del
  papel; 600 semillas de `rm-parentesco` (orden y edades) y 4 de `rm-deduccion` (puntajes); los 5 problemas de orden del
  papel de `orden-informacion`.
- **Izquierda y derecha, y la numeración.** En la mesa redonda vista desde arriba, la silla siguiente contra el reloj queda
  hacia la mano derecha de quien mira al centro en mesas de 3 a 8 (vectores), y la cuchara de la pieza (`rx = −fy`,
  `ry = fx`) cae de ese lado: quien está abajo la tiene a la derecha del dibujo; quien está arriba, a la izquierda. Las
  sillas numeradas van contra el reloj desde la de abajo (redonda) y desde la de abajo a la izquierda (cuadrada) en la
  teoría, la pieza, la práctica y el papel, y «la derecha es la silla siguiente» vale también en la cuadrada (por
  vectores). En la fila, los puestos van de izquierda a derecha y todos miran hacia donde mira el alumno; el único caso de
  frente («La foto de frente») da vuelta las pistas bien, y sin darlas vuelta sale Pía, como dice el resuelto.

**Resultado: ninguna respuesta marcada como correcta está mal y todo acertijo tiene una sola solución.** Fallan una
explicación de ejemplo (A2), los pasos «Sumando/Restando» de `rm-parentesco` (A3), una figura de la regla (A1) y varias
cosas de figura, datos y redacción.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas, 0 pendientes.** Ninguna de las
faltas de abajo la ve una regla de hoy. `node --test` de la unidad, de la pieza y del generador: en verde antes de corregir.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 1, 4 | La regla de la idea 6 (`regla.dibujo`, figCuad con 4 líneas) y la pieza (`rm-orden.js`, `frente` en la cuadrada, `r0 = 52`) | Las cuatro líneas «frente a» terminan a 20 del centro de la mesa y juntas forman un cuadradito dentro: la de 3–8 pasa justo encima de los carteles 1 y 2, y la de 4–7, encima de 5 y 6. El lector B leyó «unen 1–2, 3–4, 5–6, 7–8, sillas del mismo lado». La regla enseña justo lo contrario. Además «con un número impar de sillas redondas». | Que la línea cruce la mesa de silla a silla (de borde a borde). Prueba en la pieza: cada línea empieza y termina junto a sus dos sillas, y esas dos se miran. «En la mesa redonda con un número impar de sillas». |
| A2 | 13, 10 | Ejemplo 15 de la idea 6, «Ocho sillas, dos vacías» (`:2691`) | «Ana tiene dos sillas posibles: junto a Iván o junto a Hugo». Son **tres**: la silla junto a Iván, la de la derecha de Hugo y la de la izquierda de Eva (quedan 3 mesas, no 2). La respuesta E sigue valiendo en las 3, pero quien encontró la tercera lee que se equivocó. El comentario de la constante también dice «en las 2 mesas». | «Ana tiene tres sillas posibles: junto a Iván, junto a Hugo o junto a Eva. A y D pasan en una sola de las 3 mesas.» Prueba: el ejemplo, por fuerza bruta, deja 3 mesas y E vale en las 3. |
| A3 | 13, 9 | `rm-parentesco`, tipo `orden` (solo de esta unidad), `armarOrden` (`generador.js:789`) | El paso dice «Sumando E + G < F + H y E + H = F + G, … queda H > G» (semilla 1). Sumando sale F > E; H > G sale restando. Las deducciones se hacen con las pistas dadas vuelta a «>» y el texto escribe la pista como se dio: **436 de 778** pasos «Sumando/Restando» (600 semillas) nombran la operación que no es. La conclusión es cierta; el camino, falso. | Escribir en el paso la pista tal como se usó (con «>»), para que «Sumando/Restando» sea verdad. Prueba que rehace cada suma o resta y compara con lo que el paso dice. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 3, 7 | Regla de la idea 2 (`:829`) | El texto dice «“Dos pisos más arriba” amarra a dos en un bloque, con un piso en medio» y el dibujo de al lado es el bloque de +3, con dos pisos grises en medio. El gris no tiene leyenda. (Lector A.) | El texto habla del dibujo: «“Tres pisos más arriba” amarra a dos en un bloque, con dos pisos en medio (en gris)». Prueba: la distancia del texto es la del dibujo y los pisos grises son la distancia menos 1. |
| M2 | 5 | `minus()` de la teoría (`:1039`) y del generador | La solución de nivel examen pasa a minúscula la primera letra de la afirmación, que es un nombre: «el de la figura: ana vive más arriba que Ciro», «en las dos, gino se sienta entre Ciro y Dina». **71 de 1 200** «Ahora tú»; **101 de 1 200** problemas de práctica y el papel p7 («En los dos, beto está junto a Ciro»). | No bajar la mayúscula si empieza por un nombre (o no bajarla nunca). Prueba: ningún nombre de persona en minúscula en ningún texto. |
| M3 | 13 | «Ahora tú» de la idea 6, tipo 0 con tres sillas por lado (`:2494`) | «¿Qué silla comparte el lado con la 4?» tiene dos respuestas (la 5 y la 6). Se marca la 5 y la solución dice «En el mismo borde que la 4 está la 5», como si fuera la única. Pasa en 12 de 200. | Con tres por lado, preguntar solo «frente a»; «comparte el lado» queda para dos por lado. Prueba: la pregunta tiene una sola silla correcta en 400 semillas. |
| M4 | 13 | «Ahora tú» de la idea 6, tipo 3 (50 de 200); ejemplos 14 de la idea 1 y 11 de la idea 6 | Se alternan mujeres y varones, pero nadie dice quién es mujer: hay que adivinarlo por el nombre (lector B, tarjeta 03). El enunciado del tipo 3 además no se entiende: «Ana, Ciro, Dina, Fito, Gino y Rosa mujeres y varones, comparten en una mesa redonda». La línea 2 del ejemplo 14 junta dos casos en una frase. | Una línea de Datos: «Mujeres: Ana, Dina y Rosa. Varones: Ciro, Fito y Gino.»; enunciado «… comparten un almuerzo en una mesa redonda de 6 sillas»; la línea 2 del ejemplo 14 en dos frases. Prueba: todo ejercicio que alterna dice en Datos quién es mujer y quién varón. |
| M5 | 12, regla 3 | Glosario | **«frente a»** lo estrena la idea 5 por «su mano derecha queda frente a tu mano izquierda» (ejemplo 2): el Resumen de la mesa redonda promete «frente a» (sillas que se cruzan) y la idea 6 queda con dos palabras. **«suman lo mismo»**, tercer ejemplo: «Si un trozo de una barra crece, el otro trozo de esa barra se achica» es la clave de la predicción de la idea 4, y se lee antes de jugar. **«sentido antihorario»**, primer ejemplo: «Desde las 12, contra el reloj se pasa por las 11, las 10…»; con «a la derecha de» («la silla que sigue contra el reloj») responde la predicción de la idea 5 (Dina arriba, a las 12). La regla `glosario-predice` no lo ve (respuestas de texto). | Sin «frente a» en la idea 5 («queda del lado de tu mano izquierda»); otro tercer ejemplo para «suman lo mismo» («Si dos pares suman lo mismo, los cuatro juntos suman el doble»); el reloj desde las 3 («por las 2 y la 1»). Prueba: el término lo estrena la idea que lo enseña; ningún ejemplo del glosario de la idea 4 ni de la 5 da su clave. |
| M6 | 1 | Figura de Predice de la idea 5 y ejemplos 1 y 2 de la idea 5 | Quien espera de pie (`espera`) se dibuja en la esquina de abajo a la izquierda. En la predicción, «Eva» queda escrita a la izquierda del dibujo, que es la respuesta (lector B: «casi regala la respuesta»). En el ejemplo 2, «Dina» espera a la izquierda y va a la izquierda del dibujo. Además, en esos dos ejemplos la cuchara dibujada es la respuesta misma («Su cuchara lo muestra»): la pregunta es justo de qué lado está la derecha (molde §3: si la pregunta es dónde va la marca, el dibujo va sin ella). | Quien espera, centrado debajo de la mesa («De pie: Eva»); los ejemplos 1 y 2 sin cucharas. Prueba en la pieza: el nombre de quien espera queda centrado; prueba de la unidad: ningún ejemplo que pregunta de qué lado va alguien trae cucharas. |
| M7 | 5 (violeta), 3 | Juega de las ideas 2 y 5 (`arrastres`, `color: 'c-f'`); leyenda de la idea 5 | El asa para arrastrar es violeta: Ana en el piso 1 (que rompe una pista) y Beto en una silla equivocada salen con un círculo violeta, y la leyenda dice «violeta: el lugar que no rompe ninguna pista» y «la silla pedida, ya comprobada» (lectores A y B). La leyenda de la idea 5 nombra una «flecha turquesa» que solo aparece al acertar. | Asa en tinta (sin color de papel) en las ideas 2 y 5; la leyenda de la flecha: «al acertar: va hacia su derecha, contra el reloj». Prueba: ningún asa de arrastre de la unidad lleva violeta. |
| M8 | 4, 3 | Idea 3: Juega, Mira y La regla | La misma figura dice dos cosas: en Mira, dos en la misma columna son «miden lo mismo»; en la regla y en Juega, «no están comparados». La leyenda del juego dice «columnas: de izquierda a derecha, más altos», y con 0 pistas los cuatro van en una sola columna bajo el título «Del más bajo al más alto»: parece que son iguales o que Ana es la más baja (lector A). | Leyenda: «misma columna: todavía sin comparar»; el empate de Mira se marca con su «=»; con 0 pistas, el título «Todavía sin flechas». Prueba: con 0 pistas el título no dice «del más bajo al más alto». |
| M9 | 1 (el objeto que nombra el texto; molde §3) | Ejemplos 3 y 9 de la idea 4 (dados dibujados como sobres); ejemplos 8 y 12 de la idea 3 (puntos de un concurso con tallímetro); «Así se resuelve» y «Ahora tú» de la idea 3 (edades con tallímetro) | El dibujo no es lo que cuenta el texto (lector B, tarjetas 08 y 10; lector A, «Así se resuelve» de comparaciones). | Pieza: `forma: 'dado'` en los sobres (cara con sus puntos) y `forma: 'tarjeta'` para edades; la formación sin tallímetro (`tallimetro: false`) cuando no son tallas. Prueba de pieza para las dos formas y de la unidad: dados y puntajes no van con sobre ni tallímetro. |
| M10 | 13, molde §3 | Ejemplos de la idea 3: 1, 3 y 14 | El resuelto habla de flechas que la figura no trae: «Las dos flechas salen de Beto» (ejemplo 3) con un dibujo sin flechas (lector B, tarjeta 07); «antes» por «menor» sin decirlo (tarjeta 09). | El resuelto escribe las flechas («Beto → Ana y Beto → Ciro») y dice «antes: menor». |
| M11 | 13 | Datos de los ejemplos 2 y 8 de la idea 1, 8 y 10 de la idea 2 | El 8 de la idea 2 resuelve con «el 2 es de Nora: Rosa no va ahí» sin el dato «una persona por piso» (lector B, tarjeta 05); el 10 igual. Los ejemplos 2 y 8 de la idea 1 no dicen qué es «a la izquierda de» (tarjeta 02). | Agregar `D_FAMILIA` a los ejemplos de pisos con dos personas o más, y «A la izquierda de: en un puesto de número menor» a los de la fila que no traen `D_PISTAS`. |
| M12 | 9 (orden entre unidades) | `plantillas/orden-informacion/papel.json`, que esta unidad muestra en «Más mesas del tema» | El papel trae verdades y mentiras (p7, p8), certezas (p9, p10) y un cuadro (p6), sin `unidades`: un alumno de esta unidad recibe «Beto miente» y «con seguridad» antes de esas unidades. `papel-reglas` no lo mira porque la escena tiene `rehacer` para esta unidad. | Marcar `unidades` en los 10 problemas (p1–p5 orden; p6 deductivo; p7–p8 verdades y mentiras; p9–p10 certezas). |
| M13 | 9; propuesta §5 y decisión 10 | `rm-parentesco` (orden, edades) y `rm-deduccion` (puntajes), práctica de la idea 4 | Resuelven con iniciales, «>», «<», «;» y sumas de desigualdades («Escribe cada pista con las iniciales: G > F ; E + G < F + H…»), con datos «Si a + b > a + c, entonces b > c». La unidad decidió no usar iniciales ni «<» y enseña la compensación con dos barras. «Edades» pide «la menor suma posible» con primos (optimización que ninguna idea enseña). No van por idea (no declaran `ideas`). | Para Gerson (decisión de alcance): recomiendo reescribir la solución de `orden` con nombres y palabras («lo que Elsa le gana a Fico…»), y dejar `edades` fuera de la unidad hasta que una idea enseñe el mínimo. Se corrigió solo A3. |
| M14 | 13 | Ejemplo 11 de la idea 5 (`:2302`) | «Quedan tres sillas; Iván no toca a Rosa: va en la del medio.» No tocar a Rosa solo descarta la última; la primera libre (junto a Nora) se descarta por Maru, que iría donde está Nora. El resuelto salta ese caso. | «Iván no toca a Rosa: no va en la última. En la primera, Maru (a su izquierda) caería en la silla de Nora: Iván va en la del medio.» |
| M15 | 3, 7 | Idea 4: regla, Mira y ejemplo 8 | «Con los valores a la vista, una suma dice qué par es» no se entiende; «si Ana gana, Beto pierde» no dice frente a quién; Faro dice «Mira la franja» en el paso 1, cuando no hay franja; el ejemplo 8 dice «su parte de arriba es más larga» y «Teo tiene que ser más corto» con barras sin partir (lector B). | Regla: «Si conoces los valores, una suma te dice qué dos valores son. Si dos pares suman lo mismo, lo que uno le gana a otro del otro par, su compañero lo pierde.»; nota «si Ana supera a Ciro, Dina supera a Beto»; voz «Compara las barras; después, la franja»; ejemplo 8 con «el trozo de Maru es más largo que el de Lucho». |
| M16 | 2, 7 | Idea 6, Mira (`voz`) | «Compara las sillas cercanas a la 6 con la 6» no se entiende (lector B). | «Desde la 1, mira cuál de estas sillas te queda al cruzar.» |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 | «Ahora tú» de la idea 2, tipo 1 | «Quedan 1 orden, pero en él hay 2 en medio» (9 de 50); «Quedan 2 órdenes; en todos» (30 casos): con dos, «en los dos». | «Queda 1 orden»; «en los dos». |
| B2 | 13 | Ejemplo 11 de la idea 4 | Las alternativas C («Dina es menor que Beto») y E («Beto es mayor que Dina») dicen lo mismo: quien lo note descarta las dos sin pensar. «D choca con el paso 2» usa «choca», que la unidad evita a propósito (lo estrena Verdades y mentiras). | E: «Beto es mayor que Ciro» (choca con la pista); «D no puede pasar: va contra el paso 2». |
| B3 | 5 | Práctica `rm-ordenamiento`, tipo `cadena` | «Ana es el menor de todos» (45 de 200); el cuarto distractor («cuenta otra vez los lugares») lleva el código RMP72, que es otro error. | Concordar con el nombre; código del error de contar (RMP64 o uno nuevo). |
| B4 | 13 (una sola redacción) | `D_PISTAS` de la teoría y del generador | Teoría: «Junto a: vale por ambos lados. Inmediatamente: en el puesto de al lado.» Práctica: «Junto a: al lado, por cualquier lado. Inmediatamente: justo al lado.» | Una sola línea (la de la teoría) en las dos. |
| B5 | 1 | Lee de la idea 1 (pieza, escena banca) | La cancha (arco) está dibujada a la izquierda de la banca, no al frente; el texto dice que miran hacia la cancha «igual que tú» (lector A). | Pendiente de dibujo (prueba): arco al fondo, sobre la banca. No se hizo. |
| B6 | 13 | Ejemplo 8 de la idea 6 | «6 − 4 = 2» sin decir por qué 4 (lector B, tarjeta 17). | «Media vuelta son 4 sillas: contando 4 hacia atrás desde la 6». |
| B7 | 7 | Solución de «Ahora tú» de la idea 3, tipo 3 | «Una cadena de flechas sube desde Dina hasta 2: esos son mayores» | «Desde Dina, las flechas suben hasta Ciro y Beto: 2 mayores con seguridad». |
| B8 | 1 | Lee de la idea 2 | El título promete «puestos de llegada» y Lee solo dibuja el edificio (lector A). | La tarjeta 2 con la tira de llegadas. |

## Lo que está bien y hay que copiar al molde

- **Todo sale de contar.** Los órdenes tachados, los marcos, las lecturas, las misiones y cada explicación de distractor
  («valdría sin la pista N», «saltarte dos», «pasa en uno de los N», el espejo, el pegado, la distancia leída como «en
  medio») salen de `cumplen`, `porQueNo`, `soloPosible`, `alEspejo` y `alPegar`. Por eso 1 200 + 1 200 + 1 200 cuentas
  rehechas aparte no encontraron ninguna explicación falsa en «Ahora tú» ni en la práctica: el error de la unidad anterior
  (A1 y A2 de Razonamiento deductivo) no se repitió.
- **La derecha en la mesa está bien en todas partes**, también en la cuadrada y en las mesas numeradas, y la pieza dibuja
  la cuchara del lado correcto: la convención «sillas contra el reloj = hacia la derecha» hace que «a la derecha» sea
  siempre «la silla siguiente», sin dos sentidos.
- **«Así se resuelve» explica cada puesto descartado con la pista que lo rompe** («Hugo no va en el 1 y el 4 (rompe la
  pista 3), ni en el 3 (rompe la pista 1 o la 2)»), calculado con el grupo más chico de pistas.
- **Lo que se reserva para Predice está declarado** en el comentario de cada idea y se cumple (salvo la figura de M6).
- **La práctica por idea** (`TIPOS_POR_IDEA`) con el motor de la escena para la fila y la mesa.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `nombre-minuscula` | Ningún nombre de persona de la unidad aparece en minúscula en un texto visible (M2). | Sí: lista de nombres propios de la unidad (los de sus enunciados) contra todo texto, en 200 semillas. |
| `figura-lado` | En Predice y en un ejemplo que pregunta de qué lado va alguien, la figura no pone a esa persona (ni su nombre de pie) a un lado ni dibuja la marca que lo dice (M6). | A medias: la pieza centra a quien espera (prueba de pieza); que no haya cucharas en esos ejemplos, prueba de la unidad. |
| `linea-relacion` | Una línea que une dos lugares («frente a», una distancia) llega a sus dos lugares y no a otros (A1). | Sí, en la prueba de la pieza: los extremos de la línea quedan más cerca de sus dos sillas que de cualquier otra. |
| `conteo-resuelto` | Un resuelto que dice «quedan N», «N sillas posibles» o «en las dos» coincide con el conteo (A2). | En la prueba propia de la unidad (el validador no sabe resolver). |
| `estrena-donde-enseña` | Un término del glosario lo estrena una idea que lo usa en su Lee, Juega o La regla, no solo en un ejemplo con otro sentido (M5, «frente a»). | Sí: `Glosario.porIdea` contra el texto de esos tres momentos. |
| `quien-es-quien` | Si un problema alterna mujeres y varones (o usa parejas), Datos dice quién es cada uno (M4). | Sí, en la prueba de la unidad: «alternad» en Datos ⇒ una línea «Mujeres: …». |
| `papel-rehacer-unidades` | Una escena con `rehacer` que sirve a varias unidades marca `unidades` en cada problema de papel, porque la app lo muestra en «Más mesas del tema» (M12). | Sí: extender `papel-unidades` a las escenas con `rehacer`. |
| `asa-violeta` | Un asa de arrastre no lleva el color de lo seguro (M7). | Sí: ningún `arrastres[].color` es `c-f`. |
| `pregunta-una` | «¿Qué silla…?», «¿Quién…?» tienen una sola respuesta en el caso, no solo una sola opción correcta (M3). | En la prueba de la unidad. |

## Pendientes de Gerson que no se cuentan como hallazgo

La cancha del Lee de la fila (B5, dibujo de prueba); el método y la notación de los tipos que llegaron de Razonamiento
deductivo (M13).

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`). Cada corrección lleva una prueba que falla con la versión de antes
(comprobado: las pruebas nuevas corren contra una copia con los archivos viejos y fallan las 18, en el scratchpad
`e5-cierre-rm/viejo/`). Las respuestas no cambiaron; los acertijos tocados se volvieron a resolver con los scripts de la
auditoría (`cuentas/`, otra vez 1 200 + 1 200 + 123 + 1 200 + 8 + 22, todo en verde). Validador con `calidad: 2` simulada y
200 semillas: 0 problemas. Los lectores en frío pidieron casi lo mismo: lo suyo está en
`rutinas/frio/razonamiento-matematico.ordenamiento-de-informacion.md` («Correcciones de la ronda 1»).

### Alta

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| A1 | `rm-orden`: en la cuadrada la línea «frente a» va de silla a silla, cruza toda la mesa y pasa por debajo de los carteles (se dibuja antes; `data-caja`). En «La regla» las cuatro líneas forman un «#» que se cruza en el centro. «En la mesa redonda con un número impar de sillas». | `rm-orden.test.js`: en toda figura de la unidad, los extremos de cada línea quedan junto a sus dos sillas y, en la cuadrada, la línea mide más que el lado de la mesa. |
| A2 | Ejemplo 15 de la idea 6: «Ana puede ir junto a Iván, junto a Hugo o junto a Eva: quedan 3 mesas, y A y D pasan en una sola»; comentario de la constante corregido. | Fuerza bruta del ejemplo: 3 mesas, E en las 3, y el resuelto dice «quedan 3 mesas». |
| A3 | `rm-parentesco`, `orden`: en los pasos de suma o resta cada pista se escribe como se usó (con «>»), y en la resta de una igualdad y una desigualdad se nombra primero la que va primero. Las alternativas, las respuestas y `casos.json` no cambian (pruebas del generador en verde). | `rm-parentesco/generador.test.js`: 600 semillas; cada «Sumando/Restando … queda A > B» se rehace con los coeficientes. |

### Media

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| M1 | Regla de la idea 2: «“Tres pisos más arriba” amarra a dos en un bloque, con dos pisos en medio (en gris)». | La distancia del texto es la del bloque dibujado y los pisos grises son uno menos. |
| M2 | `minus` solo baja «El/La…»; el generador ya no baja la mayúscula; papel regenerado (p7: «En los dos, Beto…»). | Ningún nombre en minúscula en 1 200 «Ahora tú» + 1 200 «Así se resuelve» y en 1 200 problemas de práctica. |
| M3 | Idea 6, tipo 0: «comparte el lado» solo con dos sillas por lado. | Ninguna pregunta «comparte el lado» con tres por lado. |
| M4 | «Mujeres (…) y varones (…), alternados» en Datos del tipo 3 de la idea 6 y de los ejemplos 14 (idea 1) y 11 (idea 6); enunciado «… comparten un almuerzo en una mesa redonda»; la línea 2 del ejemplo 14 cuenta los dos casos por separado. | Todo ejercicio que alterna dice en Datos quién es mujer y quién varón, y la lista coincide con los nombres. |
| M5 | Idea 5, ejemplo 2: «su mano derecha queda del lado de tu mano izquierda» (sin «frente a»), así «frente a» lo estrena la idea 6; «suman lo mismo»: «Si dos pares suman lo mismo, los cuatro juntos suman el doble de un par»; «sentido antihorario»: «Desde las 3, contra el reloj se pasa por las 2, la 1 y las 12…». | `Glosario.porIdea` pone «frente a» en la idea 6; los ejemplos del glosario no traen la compensación ni el reloj desde las 12. |
| M6 | `rm-orden`: quien espera va centrado sobre la mesa, «De pie: Eva»; ejemplos 1 y 2 de la idea 5 sin cucharas (la pregunta es de qué lado va). | Pieza: el rótulo «De pie» queda en el centro. Unidad: ninguna figura de la mesa con alguien de pie lo pone a un lado, y los ejemplos «¿En qué silla del dibujo…?» no traen cucharas. |
| M7 | Las asas de arrastre de las ideas 2 y 5 ya no son `c-f`; la leyenda de la idea 2 dice «violeta: los nombres, si no rompen ninguna pista», y la de la flecha, «al acertar: su derecha, contra el reloj». **A medias:** sin color, el asa sale en el morado de la app (`--brand`), parecido al violeta, y el validador solo acepta colores de papel (`Ecuacion.COLORES`); un asa en tinta pide tocar `nucleo/teoria.js` y `app/teoria.js` (fuera de alcance; abajo). | Ningún asa de la unidad ni del laboratorio es `c-f`; la leyenda dice «al acertar». |
| M8 | Idea 3: leyenda «columnas: en la misma, todavía sin comparar»; con 0 pistas el título es «Todavía sin flechas». | Con 0 pistas el título no dice «del más bajo al más alto». |
| M9 | `rm-orden`: `forma: 'dado'` (cara con sus puntos) y `forma: 'tarjeta'` en la escena de sobres, y `tallimetro: false` en la formación (con su texto alternativo). Dados en los ejemplos 3 y 9 de la idea 4, tarjetas en todas las edades (7 ejemplos y «Ahora tú»), y sin tallímetro en los 8 ejemplos de edades o puntos y en «Así se resuelve» y «Ahora tú» de la idea 3. | Pieza: 12 puntos en los dados 2, 4 y 6; la tarjeta sin solapa; sin tallímetro el dibujo es otro. Unidad: dado ⇒ `forma: 'dado'`; años ⇒ tarjeta; edades o puntos ⇒ sin tallímetro. |
| M10 | Idea 3: los resueltos escriben las flechas que nombran («Beto → Ana y Beto → Ciro»); el 14 dice «menor/mayor» en vez de «antes/después». | Un resuelto que habla de flechas trae «→». |
| M11 | `D_FAMILIA` en los ejemplos 8 y 10 de la idea 2 (en el 10, junto con «pisos vecinos», por el tope de 6 líneas); «A la izquierda de: en un puesto de número menor» (`D_IZQ`) en los ejemplos 1, 2, 6 y 10 de la idea 1 y `D_PISTAS` en el 8. | Los ejemplos de pisos con 3 personas o más dicen «una sola persona»; los de la fila de nivel 1 y 2 con «a la izquierda/derecha de» traen su definición. |
| M12 | `unidades` en los 10 problemas del papel de `orden-informacion` (p1–p5 esta unidad, p6 deductivo, p7–p8 verdades y mentiras, p9–p10 certezas). Fuera de `herramientas/papel-reglas.js` la excepción `papel-unidades` de esa plantilla, que ya no hace falta. | Cada problema trae `unidades`; los de esta unidad no hablan de mentir ni de «con seguridad». |
| M13 | **Para Gerson** (abajo). Se corrigió solo A3. | — |
| M14 | Ejemplo 11 de la idea 5: «Iván no toca a Rosa: no va en la última. En la primera, Maru caería donde Nora.» | El resuelto dice «no va en la última». |
| M15 | Regla de la idea 4: «Si sabes qué valores hay, una suma dice cuáles dos la forman. Con dos sumas iguales, lo que uno le gana a alguien del otro par, su compañero lo pierde.»; nota «si Ana supera a Ciro, Dina supera a Beto»; voz de Mira «Compara las barras; después, la franja.»; ejemplo 8 con «su trozo es más largo» y «el trozo de Teo». | Prueba de redacción. |
| M16 | Mira de la idea 6: «Desde la 1, mira cuál de estas sillas te queda al cruzar.» | Prueba de redacción. |

### Baja

- **Hecho:** B1 («Queda 1 orden», «en los dos»); B2 (la E del ejemplo 11 de la idea 4 pasa a «Beto es mayor que Ciro»,
  que va contra la pista, y el resuelto ya no dice «choca»); B3 («la mayor/la menor» para ellas; el distractor de contar
  de nuevo lleva RMP1); B4 (la práctica usa la misma línea de palabras que la teoría, con prueba); B6 («Media vuelta son 4
  sillas: contando 4 hacia atrás desde la 6…»); B7 («Desde Dina, las flechas suben hasta Beto y Ciro: 2 mayores con
  seguridad», con los nombres comprobados en 200 semillas); B8 (la tarjeta 2 de Lee de la idea 2 trae la tira de llegadas).
- **No se hizo:** B5 (la cancha del Lee de la fila, a la izquierda: es el dibujo de prueba de la pieza; moverla al fondo
  pide rehacer la escena de la banca).

### Para Gerson (decidido por la sesión, Gerson revisa después)

1. **M13, los tipos que llegaron de Razonamiento deductivo** (`rm-parentesco`: orden y edades; `rm-deduccion`: puntajes).
   Resuelven con iniciales, «>», «<» y sumas de desigualdades, y «edades» pide «la menor suma posible» con primos; la unidad
   decidió no usar esa notación y no enseña el mínimo. Se dejaron como están (salvo A3). Recomendación: reescribir la
   solución de «orden» en palabras y con nombres («lo que Elsa le gana a Fico…»), y sacar «edades» de esta unidad hasta
   que una idea enseñe el mínimo.
2. La cancha del Lee de la idea 1 (B5).
3. **Asa neutra** (M7): aceptar `color: 'ink'` en `arrastres` (`nucleo/teoria.js`, validador) para que el asa de arrastre no salga en el morado de la app en las unidades de la paleta de deducción.
4. `docs/metodo/unidad/reglas-validador.md` dice «10 líneas» de excepciones del papel: ahora son 9 (no se tocó el
   documento, que no es de la unidad).

### Archivos tocados

`contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js` y su `.test.js`;
`nucleo/kit/piezas/rm-orden.js` y su `.test.js`; `plantillas/rm-ordenamiento/generador.js`, `generador.test.js` y
`papel.json` (regenerado); `plantillas/rm-parentesco/generador.js` y `generador.test.js`;
`plantillas/orden-informacion/papel.json`; `herramientas/papel-reglas.js` (una excepción menos). `npm run catalogo` no
cambió `app/datos/catalogo.json`; el glosario de `app/datos/glosario/razonamiento-matematico.json` ya estaba al día.
