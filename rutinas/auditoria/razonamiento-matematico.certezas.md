# Auditoría de contenido: «Certezas» (razonamiento-matematico.certezas)

19 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; fase 7 del método,
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y las 17 de «Lo que encontraron
los auditores» (`docs/metodo/unidad/etapa-delegada.md`). Decisiones: `docs/etapa7/propuesta-razonamiento-matematico.md`
(§10 y §11). Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/razonamiento-matematico.certezas.md`;
aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-matematico/certezas.js` (v0.3.0, sin `calidad: 2`): las 6 ideas con sus 7
  momentos, los 90 ejemplos, las 6 predicciones, los 6 juegos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno
  por idea), el glosario (14 términos), las 3 mesas del laboratorio y la historia.
- La pieza `nucleo/kit/piezas/rm-certeza.js` y su prueba.
- La práctica: `plantillas/rm-certezas/` (21 tipos con `TIPOS_POR_IDEA`, los 19 viejos sin idea, `casos.json` con 76 casos
  y `papel.json` con 10) y el tipo `siempre-cierto` de `plantillas/rm-deduccion/` para esta unidad.
- La app a 390 px con `--entera` (servidor propio en el puerto 4436): los 42 momentos y los 90 ejemplos (132 capturas, más
  las 18 del lector; sin repetidas por md5 y sin «No se pudo cargar el catálogo»). La herramienta se copió al scratchpad
  con más espera (la máquina estaba cargada: la primera corrida se cayó por tiempo en `page.goto`).

**Cuentas.** Rehechas con un motor propio en Python
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-cz/cuentas/`: `motor.py`, `comun.py`,
`teoria.py`, `practica.py`, `deduccion.py`). De la unidad y de los generadores solo se lee lo que ve el alumno (`dump.js`
vuelca el texto de `generar`, los ejemplos y las predicciones; en la práctica, también `_datos`). Ningún mínimo se calcula
con «peor caso + 1»: el motor **enumera las extracciones** y busca el menor m tal que **toda** extracción de m cumple la meta
(y, aparte, el menor m tal que **alguna** la cumple: la buena suerte).
- **Colores, guantes, bingo, billetes, formas:** todos los vectores de cuántas salen de cada clase (la meta solo depende de
  esas cantidades); en la práctica, los guantes de 3 o 4 colores combinan color por color todas las parejas (izquierdos,
  derechos) posibles.
- **Parejas que suman, discos repetidos, bolos de dos colores, diferencias, divisiones:** conjunto independiente máximo por
  búsqueda exhaustiva con memoria sobre todos los objetos (cada copia por separado). **Que la suma pase de S, tríos, primos
  que suman:** todos los subconjuntos (máscaras de bits). **Consecutivos:** todos los subconjuntos recorridos con su racha.
- **Calendarios:** todas las formas de repartir las personas (cuántos casilleros tienen 0, 1, …, k − 1), hasta 366 fechas.
- **Llaves, el peor caso de verdad:** minimax exacto contra todos los repartos, con estrategia adaptativa (cualquier llave
  en cualquier candado, no solo la de siempre), hasta 4 llaves con 4 candados y 4 llaves con 5 candados: da 3 + 2 + 1 y
  4 + 3 + 2 + 1, como la fórmula. Para 5 a 8 candados, la estrategia de siempre contra **todos** los repartos (hasta 8! ); para
  más, por partes (el costo de cada llave depende solo del lugar de su candado entre los que quedan). Que ninguna estrategia
  gane en el peor caso a n(n − 1)/2 para n grande lo da el argumento del adversario (un grafo bipartito con un solo
  emparejamiento perfecto tiene a lo más n(n + 1)/2 aristas); el minimax lo confirma donde se puede correr. La buena suerte
  se cuenta igual: el menor número de pruebas con que algún reparto queda identificado. **Cajas mal rotuladas** (las tres
  cajas y las de «¿cuántas abrir?» hasta 6 + 6 cajas): minimax sobre todos los repartos con todos los rótulos errados.
- **Cada distractor contra el valor de su error:** para cada id (RM6, RMP30 a RMP34, RMP77, RMP78, RMP92, RMP152 a RMP155 de la
  teoría; los 54 ids de la práctica), un modelo propio del error (la buena suerte por enumeración, «sin la que obliga»,
  «sacar todo», «k en cada casillero», «olvidar los sin pareja» como el peor caso sin esas cartas, «una copia» como el
  problema con un disco por número, «365 fechas», «30 días»…) comparado con el valor de la opción. Además, cada igualdad
  escrita («4 + 3 = 7», «9 + 8 + … + 1 = 45») se evalúa, y en «¿qué es seguro?» cada contraejemplo dicho se comprueba posible
  y que rompe la opción.

Recuento: **«Ahora tú»: 2 400** (400 por idea), **«Así se resuelve»: 2 400** (respuesta, igualdades y 2 000 afirmaciones del
caso: «las que menos hay son las verdes», «de las blancas hay menos de 3», «parejas: 1 y 11; …; sin pareja: 6, 12»), **los 90
ejemplos y sus 30 alternativas de nivel 3**, **las 6 predicciones**, **los 6 juegos**, **la práctica: 3 600** (400 por idea y
1 200 sin idea, con los 19 tipos viejos), **76 casos** y **10 de papel**, y **400 «siempre cierto»** de `rm-deduccion` (las 81
asignaciones de cosas a las cajas, desde el texto de las pistas; cada contraejemplo de las explicaciones, comprobado).

**Resultado: ninguna respuesta marcada como correcta está mal y toda pregunta con alternativas tiene una sola correcta.**
Los valores de casi todos los distractores son los de su error. Fallan **explicaciones que afirman algo falso** (A1, A2,
M5), **casos repetidos** (A3) y lo que los lectores no pudieron seguir (dibujos, saltos, la regla del palomar).

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas**, antes y después.
`node herramientas/ecuaciones-ancho.js` sobre la unidad: todo cabe, antes y después.

## Lo que se pidió mirar aparte

- **La letra de color de las bolitas (R, V, N, B).** Ningún texto de la unidad nombra una alternativa por su letra (todas las
  explicaciones van por valor, como decidió la Etapa 3): «B» de blanca nunca se lee como la alternativa B. Las letras solo
  están dentro de las bolitas; en los calendarios las personas son puntos sin letra, y en las llaves los candados y las llaves
  llevan números. Lo único parecido está fuera de la unidad: el tipo `siempre-cierto` de `rm-deduccion` nombra las cajas A, B,
  C y D y sus alternativas también van de A a E («La caja B no guarda un lápiz» puede ser la alternativa C) (B7).
- **«Primo» contra Parentesco.** El glosario de la unidad trae «número primo» solo con sus formas «número primo / números
  primos»: «primo» o «primos» sueltos no se marcan, y el glosario armado del curso no tiene otra entrada con «primo» (en
  Razonamiento deductivo los primos de parentesco no son término). No choca. Donde decía «la primera ya es prima» (una
  bolilla) se cambió por «tiene número primo» (B1).
- **Los 19 tipos viejos de `rm-certezas`.** En 3 600 problemas, cada explicación da el valor de su error salvo uno, y ninguno
  es grave: «Pusiste k personas en cada casilla en el peor caso» marcaba C·k, cuando con su propio razonamiento (y el de
  «k de cada color», que sí suma 1) serían C·k + 1 (B4). Las explicaciones de los tipos viejos no se reescribieron; solo esa
  frase, que ya no dice «en el peor caso».

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, 7 | Predice de la idea 2 y «Ahora tú» de la idea 2 (calendarios, RMP153) | «36 asegura 3 en cada mes; la meta pide 3 en algún mes» y «Eso asegura k en cada casillero»: es falso (36 alumnos pueden haber nacido todos en enero) y contradice lo que la unidad enseña de «asegurar». Sale en la predicción y en **185 de 400** «Ahora tú». | «36 es pedir 3 en cada mes; la meta pide 3 en un mismo mes, no en los 12.» Prueba: ninguna explicación dice «asegura k en cada». |
| A2 | 13, 7 | Idea 6: Predice, «Ahora tú» (tipos 0, 2 y 3) y ejemplos 11, 12 y 14 | «Con buena suerte, cada llave abre al primer intento: 10»: con buena suerte son 9, porque la última no se prueba (lo enseña la misma idea; minimax y enumeración de repartos). **291 de 400** «Ahora tú»; en los ejemplos, «9 es con buena suerte» (son 8) y «6 es con buena suerte» (son 5; lector B, tarjeta 18). El valor de la opción (una prueba por llave) sí es un error real, pero no el que dice. | Explicarlo como lo que es: «Una prueba por llave es contar con que cada una abra al primer intento; la certeza pide la peor suerte». Prueba: toda «buena suerte: N» en las llaves vale la buena suerte de verdad. |
| A3 | 8, regla 15 de la Etapa 6 | «Ahora tú» y «Así se resuelve» de todas las ideas | Repiten el caso de un ejemplo o de la predicción (mismos números y misma meta): palomar **74/400** «Ahora tú»; llaves **88/400** y **191/400** «Así se resuelve»; condicion 33 y 21; parejas 4 y 31; una-de-cada 12, **4 de ellas la predicción misma** (4 pares negros y 3 blancos, un par cualquiera); peor-caso 1. La prueba propia solo excluía el juego y la predicción de las ideas 1, 2 y 5. | Cada ejemplo guarda la clave de su caso y los generadores la evitan (también la del juego y la predicción). Prueba independiente: la «firma» del texto (números y palabras de la meta) de 400 semillas no coincide con la de ningún ejemplo ni predicción. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 3, 7 | Idea 2, La regla | «lo pedido − 1 + 1», leída tal cual, da 3 y no 25 (lector A); el «Vale si» decía «menos objetos que eso». | «(pedido − 1) × casilleros + 1»; el «Vale si» dice «si un casillero no llega a «lo pedido − 1», aporta solo los que tiene». |
| M2 | 1, 3, 4 | Idea 3 (guantes) | Predice salta a guantes; «Así se resuelve» vuelve a bolitas y los guantes quedan sin resuelto; la regla («clases grandes + 1», «si se pide un par de un color, antes salen todos los de otro color») mezcla colores con manos; en Mira y La regla los guantes negros pierden el gris al salir (lector A). | «Así se resuelve» de la idea 3 pasa a guantes (un par de cualquier color o de uno dado); la regla dice «todas las clases menos la más chica… con guantes, salen todos los de una mano»; la pieza conserva el gris de un objeto oscuro con cualquier papel; la nota «En gris, los guantes negros». La predicción sigue siendo de guantes (decisión abajo). |
| M3 | 1, 4 | Idea 4: «Así se resuelve», «Ahora tú» y los ejemplos | El bombo con las bolillas tapadas no deja ver cuáles cumplen (lector B); «2 bolillas con múltiplos de 5». | El tablero numerado, sin marcas, en todos (un tablero sin marcas no muestra ninguna cuenta); «2 bolillas con número múltiplo de 5». |
| M4 | 1, 4 | Idea 5: Mira, el revelar de Predice y La regla | Las cartas vuelven a ir en orden, sin las rayas de pareja del juego; «4 parejas + 2 solas» se lee como 8 cartas; el «Vale si» de «que la suma pase» aparece de la nada; Faro dice «casillero» (lector B). | Después de responder, las cartas van juntas por pareja con su raya; «4, una por pareja»; el «Vale si» lo presenta como otra meta; Faro: «De cada pareja, una carta; de las solas, todas». |
| M5 | 13 | Ejemplos de nivel 3 de la idea 4 (11, 13, 14 y 15) | «10 cuenta los que sí son múltiplos»: son 8 (lector B, tarjeta 12); el 10 es 8 + 2. Lo mismo con «7 cuenta los que sí terminan en 7» (4 + 3), «14 cuenta los pares» (11 + 3) y «24 cuenta las que sí cumplen» (20 + 4). | «10 cuenta los 8 múltiplos de 6 y les suma 2», y así en los cuatro. |
| M6 | 13 | Resueltos de parejas («Dos que sumen 10», «Que pase de 20» y todos los de su forma), «Dos impares» y «Dos llaves» | «5 + 1 = 6» sin decir que 5 = 4 parejas + 1 sola (se confunde con la carta 5); «4 + 1 = 5» salta de sumar puntos a contar cartas, sin 16 + 8 = 24; «salen las 5 y 1 que sí cumplen» (¿cuáles 5?); «falla en 1 candados», «cada llave siguiente» con dos llaves y «1 = 1» (lector B, tarjetas 10, 13, 14 y 16). | El peor caso partido («4 + 1 = 5 sin pareja completa» y después «5 + 1 = 6»); «16 + 8 = 24» antes de contar las cartas; «las 5 que no cumplen y 1 que sí»; la segunda llave «no se prueba: basta la prueba de la primera», «1 + 0 = 1». |
| M7 | 9 (regla 9 de la Etapa 5) | Ejemplos 8 y 14 de la idea 6 | «Ya se saben dos» (8 llaves) y «Ya se saben cuatro» (10 llaves) dan la misma cuenta: 6 por saber, 15 pruebas (lector B). El nivel 3 no sube. | El 14 pasa a 12 llaves con 4 sabidas: 7 + 6 + … + 1 = 28, con sus distractores rehechos (66, 36, 64, 8). |
| M8 | 13 | Datos de los guantes (teoría y práctica de `rm-certezas`) | «un par se usa si son del mismo color»: con los Datos solos, dos guantes del mismo color «se usan» y la respuesta sería 2 (lector B, tarjetas 07 y 08). | «Un par que se puede usar: un guante izquierdo y uno derecho, los dos del mismo color.» También en `datosDe` y en `papel.json`. |
| M9 | 1, 12 | Idea 6: Lee y La regla | Llaves numeradas igual que los candados: «pensé que la llave 1 abre el candado 1»; el «Vale si» de «más candados que llaves» no dice cómo cambia la suma (lector B). | Lee: «Los números solo sirven para nombrarlas: la llave 1 no tiene por qué abrir el candado 1.» «Vale si»: «la primera falla en todos menos uno: 7 candados, 6 pruebas». |
| M10 | 7, 12 | Ideas 1 y 2 | «Peor suerte» y «peor caso», dos nombres para lo mismo; el título «Más objetos que casilleros» no se entiende hasta Predice (lector A). | Lee de la idea 1 dice que son lo mismo y la regla los junta («el peor caso (la peor suerte)»); la primera tarjeta de Lee de la idea 2 presenta el casillero. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 | Idea 4 | «la primera ya es prima», «la siguiente es prima» (una bolilla). | «ya tiene número primo»; Mira: «Solo quedan números primos: la siguiente (aquí, el 2) obliga» (el lector B preguntaba por qué el 2). |
| B2 | 5 | «Ahora tú» de la idea 5 | «pero 1 no tiene pareja: también salen». | «también sale». |
| B3 | 1 | Pieza | Dos circulitos sobre «Cumpleaños del salón» (anillos de colgar) y la barrita del cajón (manija): nadie los reconoce (lector A). | Fuera los dos. |
| B4 | 13 | Práctica, tipo viejo `cumpleanos` | «Pusiste k personas en cada casilla en el peor caso» con valor C·k (con ese peor caso serían C·k + 1). | «C·k es poner k personas en cada casilla, pero la meta pide k en una sola». |
| B5 | 13 | Práctica, tipo viejo `trio-suma` | Datos: «Las tres fichas deben ser distintas», con pesas. | «Las tres pesas…». |
| B6 | 13 | «Ahora tú» de la idea 4, tipo 3 (múltiplos de a o de b) | Datos sin «Se saca sin mirar…». | Agregarlo. |
| B7 | 6 | `rm-deduccion`, tipo `siempre-cierto` (fuera de esta unidad) | Cajas A, B, C y D con alternativas de A a E. | Para la sesión: es de Razonamiento deductivo, ya con `calidad: 2`; no se tocó. |
| B8 | 1 | Pieza (dibujos de prueba) | Los guantes no parecen guantes y sus pulgares se enciman; el ✓ negro (abre) y el ✓ turquesa (se deduce) se distinguen solo por el color; las medias se dibujan como bolitas (lectores A y B). | Para Gerson (M4 del plan: dibujos de prueba). |
| B9 | 9 | Ejemplos de nivel 3 de la idea 4 | El 14 (dos múltiplos de 6 hasta 50) es más fácil de pensar que el 8 (producto par), solo con números más grandes (lector B). | No se tocó: sube en conteo, no en idea. |
| B10 | 1 | Ejemplos 8 y 14 de la idea 6 | La cuadrícula no marca las llaves que ya se saben (lector B). | No se tocó (dibujo). |
| B11 | 7 | Predice de la idea 6 | «como mínimo» y «con certeza» juntos hicieron dudar al lector B. | No se tocó: es la redacción del examen y el juego lo aclara. |

## Lo que está bien y hay que copiar al molde

- **Toda respuesta sale de contar** (`peorCuentas`, `extracciones`) y cada ejemplo comprueba su número con la fuerza bruta al
  cargar: de 2 400 + 2 400 + 90 + 3 600 cuentas aparte, ninguna respuesta estaba mal. Lo que falló fue lo que se escribe a
  mano alrededor del número (A1, A2, M5).
- **El juego hace del alumno la mala suerte**: la misión solo se cumple con el peor caso y la lectura no adelanta cuánto falta.
- **Los distractores de la práctica vieja** tienen ids finos (54) y, salvo uno, cada explicación da el valor de su error.
- **El tipo «¿qué es seguro?»** dice, para cada opción falsa, una extracción concreta que la rompe: las 400 comprobadas.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `suerte-de-verdad` | Una explicación que dice «con buena suerte: N» da el valor de la buena suerte del caso (el menor número con que **algún** caso cumple), no otro error (A2). | En la prueba propia (necesita el motor del caso); aquí ya está. |
| `no-asegura-falso` | Una explicación de distractor no dice que algo «asegura» si no lo asegura (A1). | A medias: lista de verbos de certeza («asegura», «siempre», «con certeza») en `siFuera` para revisar a mano. |
| `caso-repetido` | «Ahora tú» y «Así se resuelve» no repiten los números y la meta de un ejemplo, la predicción ni el juego (A3; regla 15). | Sí: firma del texto (números + palabras de la meta) en 200 semillas contra la de los ejemplos; generalizable a todas las unidades en `nucleo/teoria-reglas.js`. |
| `cuenta-dice-cuantos` | «N cuenta los que…» o «N son los que…» en una explicación: N es la cantidad que nombra, o la frase dice qué se le sumó (M5). | A medias: marcar «\d+ cuenta (los|las) …» sin otro número en la frase. |
| `regla-hace-la-cuenta` | La ecuación de La regla, leída con los números de Mira, da el resultado de Mira (M1). | Sí, si la regla trae `ejemploNumerico`: evaluar la llave con esos valores. |
| `papel-sin-perder` | Un objeto que sale con un papel de color conserva lo que lo distinguía (relleno, letra) (M2). | En la prueba de la pieza: el relleno de los objetos que salen. |

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`). Cada corrección lleva una prueba que falla con la versión de antes
(comprobado: las pruebas nuevas, corridas contra una copia con los archivos viejos en el scratchpad `e7-cierre-cz/viejo/`,
fallan: **9 de la teoría y 1 de la práctica**). Después de corregir se volvieron a correr los scripts de la auditoría sobre
un volcado nuevo (`dump2.json`): 2 400 «Ahora tú», 2 400 «Así se resuelve» (con 2 000 afirmaciones), 90 ejemplos, 6
predicciones, 6 juegos, 3 600 de práctica, 76 casos, 10 de papel y 400 «siempre cierto», **0 fallas**. Validador con
`calidad: 2` simulada y 200 semillas: 0 problemas. `ecuaciones-ancho`: todo cabe (en el camino partió la regla nueva del
palomar y «Así se resuelve» de 12 llaves; las dos se arreglaron: el «+ 1» sin llave y «11 + 10 + … + 1»). Pruebas: `certezas.test.js` 18/18, `rm-certeza.test.js` y
`generador.test.js` de `rm-certezas` en verde (124 en total). `npm run catalogo` corrió. Capturas después:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-cz/despues/`.

### Alta

| # | Qué se hizo | Prueba nueva (`certezas.test.js`, «cierre») |
|---|---|---|
| A1 | Predice y `distCal`: «36 es pedir 3 en cada mes; la meta pide 3 en un mismo mes, no en los 12» y «Eso es pedir k en cada casillero; la meta pide k en uno solo, no en todos». | Ninguna explicación (predicciones, ejemplos, 400 «Ahora tú» por idea) dice «asegura k en cada». |
| A2 | Con tantas llaves como candados, el distractor de una prueba por llave dice «Una prueba por llave es contar con que cada una abra al primer intento; la certeza pide la peor suerte» (Predice, `distLlaves`, el tipo «ya se saben»); en los ejemplos 11, 12 y 14, «es una prueba por llave, con suerte». Con más candados que llaves (k < n), k sí es la buena suerte y se queda. | En 400 semillas, toda «buena suerte…: N» vale la buena suerte (k si hay más candados; n − 1 si no); con n = n, RM6 no empieza por «Con buena suerte»; en los ejemplos, «N es con buena suerte» vale lo mismo. |
| A3 | `CLAVES` por idea (juego, predicción y los 15 ejemplos, cada uno con su `_caso`); todos los generadores de «Ahora tú» y «Así se resuelve» la evitan. En las llaves se abrió el rango (5 a 14 llaves; las de más de 12, sin cuadrícula, que no cabe a 390 px). | Firma del texto (números y palabras de la meta) de 400 semillas de «Ahora tú» y «Así se resuelve» contra las de los ejemplos y la predicción. |

### Media

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| M1 | La regla del palomar: «(pedido − 1) × casilleros + 1» (la llave «peor caso»; el «+ 1» sin llave, para que la igualdad no se parta a 390 px); «Vale si» sin «eso». | La ecuación dice «× casilleros»; el «Vale si» no dice «menos objetos que eso». |
| M2 | «Así se resuelve» de la idea 3 resuelve guantes (cualquier color o uno dado, con sus pasos y su «sentido»); regla y «Vale si» reescritos (≤ 30 y ≤ 22 palabras), con la ecuación «peor caso (todas las clases menos la más chica) + 1»; la pieza conserva el gris de un objeto oscuro con papel (también los bolos negros del ejemplo 14 de la idea 5, que ahora traen «En gris, los bolos negros»); nota del cajón en dos líneas. | 50 semillas de «Así se resuelve» son de guantes; la figura de Mira trae los 8 guantes negros en gris. |
| M3 | `bombo` dibuja el tablero numerado sin marcas (con `desde`); `kTxt`/`metaK` dicen «con número múltiplo de 5», «con número primo», «con número par». | Ninguna bolilla sin número en ejemplos, «Ahora tú» y «Así se resuelve». (La prueba de siempre que excluye el juego y la predicción se adaptó a la redacción nueva.) |
| M4 | Mira y el revelar de la idea 5 con las cartas en parejas y su raya (`GR_P5`); «4, una por pareja»; «Vale si» y voz de Faro reescritos. | Prueba de redacción (capturas después). |
| M5 | Los cuatro ejemplos dicen cuántas cumplen y qué se sumó. | Ninguna explicación «N cuenta los/las que sí…» o «N cuenta los pares» sin el número. |
| M6 | `ejPareja` parte el peor caso («4 + 1 = 5 sin pareja completa» y «5 + 1 = 6»; con discos, «2 × 3 = 6»); `ejSupera` escribe la suma con la siguiente («16 + 8 = 24») antes de contar cartas; `ejCond`: «las 5 que no cumplen y 1 que sí»; `ejLlaves` con dos llaves («1 candado», «A la segunda llave le queda un solo candado: no se prueba», «1 + 0 = 1») y con llaves sabidas («la primera de esas llaves falla, como mucho, en 7 candados»). | Prueba de redacción; las igualdades nuevas, comprobadas por `teoria.py`. |
| M7 | Ejemplo 14 de la idea 6: 12 llaves, 4 sabidas, 28 pruebas (D), con sus distractores rehechos y comprobados. | Los dos «Ya se saben» dan respuestas distintas. |
| M8 | `D_PAR` y `datosDe('guantes')` (y `papel.json`, p2): «Un par que se puede usar: un guante izquierdo y uno derecho, los dos del mismo color». | Teoría: la línea que define el par usable nombra izquierdo y derecho. Práctica (`generador.test.js`, «cierre»): lo mismo en 400 semillas. |
| M9 | Lee de la idea 6 y su «Vale si». | Prueba de redacción. |
| M10 | Lee de la idea 1 («Esa peor suerte tiene un nombre: el peor caso. Son dos nombres para lo mismo»), regla de la idea 1 y Lee de la idea 2. | Prueba de redacción. |

### Baja

- **Hecho:** B1, B2, B3 (sin anillos ni manija; el título del calendario usa el ancho que quedó), B4 y B5 (práctica, con su
  prueba en `generador.test.js`), B6.
- **No se hizo:** B7 (otra unidad, ya con `calidad: 2`), B8 (dibujos de prueba: Gerson), B9, B10 y B11 (arriba, por qué).

### Para Gerson (decidido por la sesión, Gerson revisa después)

1. **La predicción de la idea 3 sigue siendo de guantes** (el lector A pedía prepararla o cambiarla). Elegido: dejarla, porque
   es la trampa del examen (2020-I, 32) y la segunda tarjeta de Lee ya presenta los guantes y el par usable; a cambio, «Así se
   resuelve» de esa idea pasa a guantes, para que tengan su resuelto. Descartado: una predicción de bolitas (sería la misma
   cuenta del juego).
2. **El bingo con números a la vista en todos los ejercicios** (antes, bombo tapado en los ejemplos, propuesta §11.5): un
   tablero sin marcas no muestra ninguna cuenta y deja ver cuáles cumplen. Descartado: el bombo.
3. **«Ahora tú» de las llaves llega a 14 llaves** (antes, 5 a 8 y 9 a 12), para no repetir los ejemplos; con más de 12 va sin
   cuadrícula. Descartado: repetir los casos de los ejemplos.
4. **Dibujos de prueba de `rm-certeza`** (B8): guantes, marcas ✓ de las llaves y medias.

### Archivos tocados

`contenido/teoria/razonamiento-matematico/certezas.js` y su `.test.js`; `nucleo/kit/piezas/rm-certeza.js` (sin cambios en su
prueba: las suyas siguen en verde); `plantillas/rm-certezas/generador.js`, `generador.test.js` y `papel.json` (una línea de
Datos). `casos.json` no cambia (las respuestas son las mismas). `npm run catalogo` corrió.
