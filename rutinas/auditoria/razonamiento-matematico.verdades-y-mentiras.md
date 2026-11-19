# Auditoría de contenido: «Verdades y mentiras» (razonamiento-matematico.verdades-y-mentiras)

19 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; fase 7 del método,
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones:
`docs/etapa6/propuesta-razonamiento-matematico.md` (§10 y §11). Lo que vieron los dos lectores en frío de esta ronda está
en `rutinas/frio/razonamiento-matematico.verdades-y-mentiras.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js` (v0.3.0, sin `calidad: 2`): las 6 ideas con
  sus 7 momentos, los 90 ejemplos, las 6 predicciones, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea),
  el glosario (17 términos), las 3 mesas del laboratorio y la historia.
- La pieza `nucleo/kit/piezas/rm-veraz.js` y su prueba.
- La práctica: `plantillas/rm-verdades/` (12 tipos en las 6 ideas, `casos.json` con 18 casos y `papel.json` con 8).
- La app a 390 px con `--entera` (servidor propio en el puerto 4418): los 42 momentos y los 90 ejemplos (150 capturas, sin
  repetidas por md5 y sin «No se pudo cargar el catálogo»).

**Cuentas.** Rehechas con resolvedores propios en Python
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-vm/cuentas/`: `motor.py`, `ahora.py`,
`practica.py`, `ejemplos.py`). De la unidad y del generador solo se lee el texto que ve el alumno (`dump.js` vuelca lo que
devuelven `generar`, los ejemplos y las predicciones): cada frase se lee con una expresión regular y se prueban **todas
las asignaciones de veraz y mentiroso** (2ⁿ), **todos los culpables, ganadores, mochilas y cajas**, **todos los podios** (n!)
y todos los repartos de oficios y sobres, todas las listas de 1 a 4 personas para «todos/ninguno/algunos» y todas las
cantidades de 0 a 200 para «más de / menos de».
- **«Ahora tú»: 2 400** (400 por idea). Una sola respuesta, la marcada, y cada explicación de distractor comprobada contra
  su suposición: «la frase de X sale cierta/falsa y X es veraz/miente: choca», «quedarían N frases falsas», «habría N
  frases ciertas», «Eso dice X, pero miente», «X está en el par / fuera del par», «Pasa en una de las 2 suposiciones»,
  «en cada orden posible choca alguien: …», «Con k mintiendo saldrían N frases ciertas, y harían falta M veraces»,
  «también falla si solo uno no…», «Puede pasar», «Eso es creerle», «con k justos la frase dicha también es falsa», las
  edades con «creerle la frase 1 / 2» y «cumple las frases 1 y 2 al revés».
- **«Así se resuelve»: 2 400.** Cada eslabón de la cadena de la idea 1 («Hugo miente (frase de Eva)») se comprueba forzado
  por la frase que nombra; el par de las ideas 3 y 4 se comprueba contradictorio, la contraria escrita se comprueba
  contraria con cada culpable, «puede ser X o Y» y «solo queda X» se cuentan; los órdenes y choques de la idea 5 y la
  tabla «k: ciertas y veraces» de la idea 6, uno por uno.
- **Los 90 ejemplos y las 6 predicciones**, a mano con el motor propio (todas las letras de nivel 3 y la explicación de
  cada distractor de nivel 3: «con C o D, Ana mentiría diciendo algo cierto», «C no pasa en ninguna», «con A, C, D o E
  culpables, las de Ciro y Dina serían falsas», «con cualquier otro culpable, Gino y Pía dirían la verdad»…).
- **La práctica: 2 400** problemas de `rm-verdades` (400 por idea, con `{ idea }`), los 18 de `casos.json` y los 8 del
  papel, con el mismo motor.
- **Cuantificadores.** La negación de cada «todos», «ninguno», «los dos», «más de» y «menos de» que dice un mentiroso es
  exacta (la correcta vale justo cuando la frase dicha es falsa, en todas las listas o cantidades); «algunos» solo aparece
  como distractor («Algunos aprobaron y otros no»), que nunca es seguro y siempre es posible; «al menos uno» (uno o más),
  «por lo menos» (esa cantidad o más) y «exactamente uno» / «solo una de las frases» (ni más ni menos) no se confunden en
  ningún texto: «Solo una de las frases es falsa» se resolvió como «exactamente una», y las 2 400 cuentas lo confirman.

**Resultado: ninguna respuesta marcada como correcta está mal y todo acertijo tiene una sola solución** (ningún caso con
dos culpables, dos podios o dos cuentas de mentirosos). Fallan caminos y explicaciones (A1, A2), una pregunta que delata la
respuesta (A3) y un «Ahora tú» que repite el juego (A4).

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas, 0 pendientes**, antes y después.
`node herramientas/ecuaciones-ancho.js` sobre la unidad: todo cabe, antes y después. Ninguna de las faltas de abajo la ve
una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, 7 | «Así se resuelve» de la idea 1 (`cadena`) | Un veraz que dice «X y Y mienten» obligaba a los que faltaban aunque uno ya sabido rompiera la frase: «Si Ciro es veraz: Eva es veraz (frase de Ciro) y Hugo miente (frase de Eva). Eva es veraz y su frase sale falsa: choca» (semilla 0). Con Ciro veraz, «Ciro y Hugo mienten» ya es falsa y no obliga a nada sobre Hugo. **118 de 400** semillas traen un eslabón que no sale de la frase que cita. El choque final es cierto; el camino, falso. | En `cadena`, la frase de un veraz solo obliga si los ya sabidos la cumplen. Prueba: cada «X (frase de Z)» se rehace probando todas las tarjetas con lo sabido. |
| A2 | 13, 7 | «Ahora tú» de las ideas 3 y 4 (`casoC`) y la práctica (`rm-verdades`, `casoC`) | Con dos pares que se contradicen, el distractor de alguien del segundo par decía «Gaby está fuera del par que se contradice: dice la verdad». La conclusión es cierta (el que miente es el de los dos pares), la razón no: Gaby está en un par. **78 de 400** (idea 3), **41 de 400** (idea 4), **68 de 400** en la práctica de la idea 3 y el caso 8 de `casos.json`. Quien encontró el segundo par lee que se equivocó. | Un solo par que se contradice en lo generado (los ejemplos de nivel examen con dos pares, a propósito, se quedan). Prueba en 400 semillas de la teoría y de la práctica. |
| A3 | 13, molde §3 | «Ahora tú» de la idea 5, tipo 1; títulos de los ejemplos 8 de la idea 3 y 7 de la idea 5 | «¿Quién llegó última?» cuando la respuesta es mujer y «último» cuando es varón: con equipos mixtos la palabra dice el género de la respuesta (**85 de 100** preguntas de ese tipo; en **17** hay una sola mujer entre las opciones: la respuesta está en la pregunta). El título «La ganadora de la rifa» descarta a Gino (lector B, tarjeta 08) y «Quién llegó última» deja dos de tres. | «¿Quién llegó en el último puesto?»; títulos «La rifa del aniversario» y «Quién cerró el podio». Prueba: ninguna pregunta ni título con «último/última», «ganadora». |
| A4 | 8 (regla 8 de la Etapa 5), molde §2 | «Ahora tú» de la idea 6, tipo 0 (100 de 400), y **todo** «Así se resuelve» de la idea 6 (400 de 400) | `casoCuantos` en modo «exactamente» baraja los números 1 a n: con n distintos sale siempre el acertijo del juego y de Lee (1, 2, 3, 4: mienten 3), con otros nombres. El lector B lo contestó «de memoria sin pensar». | Modo «exactamente» con algún número repetido y al menos tres distintos; lo mismo en la práctica (`cuantos`). Prueba: ningún caso con los n números distintos. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 8 | «Ahora tú» de la idea 1, tipo 0 (dos personas) | Con dos personas solo caben dos acertijos: el del juego («X miente» y «Los dos mentimos», 51 de 100) y el del ejemplo 6 (los otros 49). El lector A: «Es el mismo problema de Juega con otros nombres». | Tipo 0 con tres personas («¿Quiénes mienten?»). Prueba: «Ahora tú» de la idea 1 nunca es de dos. |
| M2 | 13 | «Ahora tú» de la idea 1, tipo 2, distractor «X tiene …» (100 de 400) | «Con Hugo mintiendo y los demás como antes, la frase de…»: el alumno nunca vio ese «antes» (es la primera suposición que encaja, interna al generador). | Decir la suposición entera: «Ninguna suposición con Hugo MIENTE encaja: con Ciro VERAZ y Eva MIENTE, por ejemplo, choca la frase de Eva.» |
| M3 | 13, 4 | Datos de toda la idea 2 («Ahora tú», «Así se resuelve», 5 ejemplos de cantidades y el 15) y de la práctica | «A lo más 5: 5 o menos» en cada caso: con «todos» no se usa y distrae (lector A); con «más de 10 soles» da la forma de la respuesta (lector B, tarjeta 04). | Datos solo con lo que el caso usa: «Lo que dice quien siempre miente es falso.» y, con «todos/ninguno», «Al menos uno: uno o más.» |
| M4 | 13 (regla 10 de la Etapa 5) | Ejemplos de nivel 3: 13 de la idea 1, 11 de la idea 2, 14 de la idea 4 y 12 de la idea 6 | La correcta es la única más larga («Teo, Nora y Leo», «Al menos uno de sus primos juega fútbol», «Los cuatro») o la única más corta («Omar»). La propuesta (§11, 7) hablaba de tres; son cuatro. En el 11 de la idea 2 (frases) delata: 5 caracteres más que la siguiente. | Un distractor más largo («Rosa, Nora y Leo», «Todos sus primos juegan fútbol y ninguno vóley»), «Cuatro» en vez de «Los cuatro» y, en el sobre de 50, Leo en vez de Lucho. Prueba en los 30 de nivel 3. |
| M5 | 5 | Opciones y respuesta de la idea 2 | «Al menos uno de mis primos no es de Puno»: la opción habla en primera persona, como si la dijera Pía (lector A). | Lo que dice el mentiroso, con «mi/mis»; lo seguro, en tercera persona («sus primos»). |
| M6 | 4, 1 | Idea 3: Mira, La regla y el revelar de Predice | El anillo marca en el juego al culpable supuesto; en Mira y en La regla rodeaba también a Fito y Hugo («dicen la verdad»): «parecen dos culpables» (lector A). | Anillo solo en el culpable; «Fito y Hugo dicen la verdad» como nota. |
| M7 | 3, 7 | Idea 6: Juega, Lee y Mira | «Supón: no miente nadie» con cuatro tarjetas MIENTE debajo, y la leyenda «la tarjeta que le toca» (lector B); Lee daba por sabido el juego de las tarjetas; la tabla de Mira ponía las frases ciertas sin los veraces que harían falta. | Leyenda «la tarjeta que sale de su frase»; Lee dice qué es la tarjeta; la tabla con «Ciertas» y «Veraces» lado a lado. |
| M8 | 13 | Ejemplos 14 de la idea 1, 8 y 14 de la idea 5 y 14 de la idea 6 (lector B, tarjetas 03, 14, 15 y 18) | Resueltos que saltan pasos: «Con Gino mintiendo encajan dos» sin decir por qué las otras dos chocan; «Si ganó Hugo, Eva llegó tercera» sin decir de qué frase sale; «Mienten 3, no 1» antes de contar a Leo; «por lo menos» sin su definición en Datos. | Cada deducción con la frase de donde sale; «Por lo menos 1: 1 o más.» en Datos. |
| M9 | 9, 12 | Idea 2: La regla, Mira | «Más de 5 → 5 o menos» aparece por primera vez en La regla; la tabla de Mira salta de 3 de 4 a 1 de 4 (lector A). | Lee presenta «más de 5» (sin la respuesta de Predice, que es de «todos»); la tabla con 2 de 4. |
| M10 | 13 | Ejemplos 1 a 4 de la idea 5 | Habla una sola persona y el dato dice «Cada uno dice dos frases» (lector B, tarjeta 13); el 3 resuelve con «hay un solo primero», que no está en Datos. | «Quien habla dice dos frases: una es cierta y la otra, falsa.» y «Cada puesto es de un solo atleta.» |
| M11 | 12, 6 | Idea 4, Mira | «Ahí está el veraz»: la palabra llega sin decir que aquí es «el único que dice la verdad» (no hay tarjetas en esta idea; lector B). | Lee: «Al único que dice la verdad lo llamamos el veraz.» |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 | «Así se resuelve» de la idea 5 | «quedan 1 orden, y en él…». | «queda 1 orden». |
| B2 | 7 | Condición («Vale si») de las ideas 1, 2, 3 y 5 | «Seguro: lo que vale en todas las suposiciones que quedan», «lo contrario es falso justo cuando…», «“Fue Ana” y “Fue Beto” no.», «y no se niegan las dos»: los dos lectores los releyeron. | Reescribir cada uno en una frase de todos los días (tope de 22 palabras). |
| B3 | 3 | Datos de las ideas 1 y 6 | «veraz o mentiroso» en Datos y VERAZ / MIENTE en la tarjeta (lector A). | «Cada uno es veraz (tarjeta VERAZ) o mentiroso (tarjeta MIENTE)…». |
| B4 | 7 | Distractores de «Ahora tú» de la idea 5 | «en cada orden posible choca alguien: Beto y Dina» se lee como que chocan los dos en cada orden. | «… choca alguien: Beto o Dina». |
| B5 | 1 | Pieza: la pelota de Lee de la idea 3 y los carteles de las cajas (ejemplo 14 de la idea 3) | La pelota no se reconoce (lector A); los carteles van en una lista y no pegados a su caja (lector B). | Dibujo de prueba: para Gerson. |
| B6 | — | Toda la unidad | Ciro, Eva, Beto y Dina se repiten entre problemas e ideas (lector A); en las figuras con globos, Datos repite las frases (lector B). | Decisión de diseño de la rama (las frases van en Datos, una por línea): para Gerson. |

## Lo que está bien y hay que copiar al molde

- **Todo sale de contar.** Ningún «cierta», «falsa», «choca» ni «N frases falsas» se escribe a mano: salen de `valorFrase`,
  `valorC`, `vymEncaja` y `supK`. Por eso, de 2 400 + 2 400 + 2 400 cuentas aparte, ninguna respuesta ni número de una
  explicación estaba mal: lo que falló fue el camino escrito (A1) y una razón (A2), no la cuenta.
- **Los ejemplos de nivel 3 explican cada distractor con su cuenta**, y las 30 letras se reparten 6 y 6.
- **«Cierta/falsa» para las frases y «veraz/mentiroso» para las personas** en toda la unidad: las dos capas nunca se
  mezclan en un texto.
- **Las negaciones son exactas**: la correcta vale justo cuando lo dicho es falso, en todas las listas y cantidades.
- **La práctica por idea** (`TIPOS_POR_IDEA`) con un camino independiente en su prueba.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `cadena-forzada` | Cada eslabón «X es … (frase de Z)» de un resuelto sale de la frase que cita, con lo ya sabido (A1). | En la prueba propia de la unidad (hace falta el motor); la de esta unidad ya lo hace. |
| `razon-del-distractor` | Una explicación que dice «X está fuera del par» o «X está en el par» es cierta para X (A2). Generalizable: toda razón de un distractor que nombra a una persona y una propiedad se comprueba, no solo su conclusión. | En la prueba propia (ya está aquí). |
| `pregunta-sin-genero` | Si la respuesta es una persona, la pregunta y el título no la delatan con el género («última», «la ganadora») (A3). | Sí, a medias: lista de palabras con género (último/a, ganador/a, primero/a) en preguntas cuyas opciones son nombres; mirar si la forma coincide con la respuesta en más de la mitad de las semillas. |
| `juego-repetido` | «Ahora tú» y «Así se resuelve» no son el acertijo del juego con otros nombres (A4, M1). | Sí: el texto de las frases con los nombres cambiados por X, comparado con el del juego, en 200 semillas. |
| `dato-sin-usar` | Una línea de Datos con un número que no está en el enunciado, las opciones ni la solución («A lo más 5» con 10 soles) (M3). | Sí: número de la línea de Datos ausente del resto del ejercicio, salvo definiciones marcadas. |
| `correcta-larga-todas` | La regla 10 (la correcta no es la única más larga ni la única más corta) también fuera de verbal, en los ejemplos de nivel 3 (M4). | Sí: ya está en la prueba de esta unidad; pasarla a `nucleo/teoria-reglas.js` con calidad 2. |
| `marca-un-sentido` | Una marca de la pieza (anillo, recuadro) significa lo mismo en Juega, Mira y La regla (M6). | A medias: en la prueba de la pieza, el papel de cada marca por escena. |

## Pendientes de Gerson que no se cuentan como hallazgo

La pelota y los carteles de las cajas (B5, dibujo de prueba); los nombres que se repiten y las frases en Datos y en los
globos a la vez (B6).

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`). Cada corrección lleva una prueba que falla con la versión de antes
(comprobado: las pruebas nuevas, corridas contra una copia con los archivos viejos en el scratchpad `e6-cierre-vm/viejo/`,
fallan: 8 de la teoría y 1 de la práctica). Después de corregir se volvieron a correr los scripts de la auditoría
(`cuentas/`): 2 400 «Ahora tú», 2 400 «Así se resuelve», 90 ejemplos y 6 predicciones, 2 400 de práctica, 18 casos y 8 de
papel, **0 fallas**. Las respuestas de la teoría no cambiaron salvo donde cambió el acertijo (A2, A4, M1: otros casos,
resueltos otra vez aparte). Validador con `calidad: 2` simulada y 200 semillas: 0 problemas. `ecuaciones-ancho`: todo cabe.
Capturas después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-vm/despues/`.

### Alta

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| A1 | `cadena`: la frase «X y Y mienten / dicen la verdad» de un veraz solo obliga a los que faltan si los ya sabidos la cumplen; si no, ya es falsa y el choque lo dice `chocaEn` al final. | `verdades-y-mentiras.test.js`, «cierre, idea 1»: en 400 semillas cada «X … (frase de Z)» se rehace con todas las tarjetas compatibles con lo sabido y sale una sola. |
| A2 | `casoC` de la teoría y del generador: un solo par que se contradice. `casos.json` (caso 8) y `papel.json` (p3 y p4) regenerados; los 18 casos y los 8 problemas, resueltos otra vez con `practica.py`. | Teoría: un solo par en 400 semillas de «Ahora tú» y «Así se resuelve» de las ideas 3 y 4. Práctica: un solo par en 400 semillas, y quien está «fuera del par» no está en él. |
| A3 | «¿Quién llegó en el último puesto?»; títulos «La rifa del aniversario» y «Quién cerró el podio». | Ninguna pregunta de 400 semillas dice «último/última»; ningún título «último/a» ni «ganadora». |
| A4 | `casoCuantos`, modo «exactamente»: algún número repetido y al menos tres distintos (así no es el juego ni el modo «repite»). En la práctica, `cuantos` sin los n números distintos. | «Ahora tú» y «Así se resuelve» de la idea 6 en 400 semillas; en la práctica, 400 semillas. |

### Media

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| M1 | Idea 1, tipo 0: tres personas, «¿Quiénes mienten?». | «Ahora tú» de la idea 1 tiene 3 o más personas en 400 semillas; la prueba de siempre, adaptada al tipo 0. |
| M2 | `otraTarjeta`: «Ninguna suposición con X MIENTE encaja: con A VERAZ y B MIENTE, por ejemplo, choca la frase de B.» (≤ 20 palabras). | La prueba de 400 semillas de la idea 1; `ahora.py` comprueba que la suposición dicha choca y que ninguna con X así encaja. |
| M3 | `D_MIENTE` y `D_NEG` (con «Al menos uno: uno o más.» solo para «todos/ninguno»), en la teoría y en el generador; fuera la línea «A lo más 5» del ejemplo 15, y su resuelto dice «50 soles o menos». | Ningún dato de la idea 2 ni de la práctica trae «A lo más 5». |
| M4 | «Rosa, Nora y Leo» (idea 1, 13), «Todos sus primos juegan fútbol y ninguno vóley» (idea 2, 11), Leo en el sobre de 50 (idea 4, 14), «Cuatro» (idea 6, 12). Las explicaciones siguen valiendo (`ejemplos.py`). | Ninguna correcta de nivel 3 es la única más larga ni la única más corta. |
| M5 | `GRUPOS` con `s3`: el mentiroso dice «mis primos»; las opciones y lo seguro dicen «sus primos». | Ninguna opción ni respuesta de la idea 2 con «mi/mis» en 400 semillas. |
| M6 | Idea 3: el anillo solo en el culpable (Mira, desde el paso 4); «Fito y Hugo dicen la verdad» como nota en Mira y al revelar. | El anillo de Mira es solo de Fito; el revelar no trae anillos. |
| M7 | Leyenda «la tarjeta que sale de su frase»; Lee «cada uno tiene una tarjeta boca abajo, VERAZ o MIENTE»; tabla de Predice y Mira con «Ciertas» y «Veraces» (los veraces van a la vista en Predice: es un dato, no la respuesta). | Prueba de redacción (captura `despues/claro-cel-cuantos-mienten-3-predice.png`). |
| M8 | Ejemplo 14 de la idea 1 (por qué fallan las otras dos), 8 y 14 de la idea 5 (cada deducción con su frase), 14 de la idea 6 (en orden, con «Por lo menos 1: 1 o más.» en Datos). | «Por lo menos» en los ejemplos de la idea 6 ⇒ su definición en Datos. |
| M9 | Lee de la idea 2: «Con números pasa lo mismo: “más de 5” es 6, 7, 8…; con 5 justos ya no se cumple.» Mira con 3, 2, 1 y 0 de 4. | Prueba de redacción. |
| M10 | `D_VYM1` para un solo atleta que habla: «Quien habla dice dos frases…» y «Cada puesto es de un solo atleta.» | Si habla uno solo, ningún dato dice «Cada uno dice dos frases». |
| M11 | Lee de la idea 4: «Al único que dice la verdad lo llamamos el veraz.» | Prueba de redacción. |

### Baja

- **Hecho:** B1 («queda 1 orden»); B2 (las cuatro condiciones reescritas: «Si varias suposiciones quedan sin choque, es
  seguro lo que pasa en todas», «una frase y su contraria nunca valen lo mismo», «“Fue Ana” y “Fue Beto” no se
  contradicen: pueden fallar juntas», «no se le cree todo ni se le da vuelta todo»); B3 (`D_TARJ` une palabra y tarjeta);
  B4 («choca alguien: Beto o Dina»).
- **No se hizo:** B5 y B6 (dibujo de prueba y decisión de diseño; abajo).

### Para Gerson (decidido por la sesión, Gerson revisa después)

1. **Un solo par en lo generado** (A2): con dos pares, el acertijo se resuelve más rápido y la explicación «fuera del par»
   se volvía falsa. Los ejemplos de nivel examen con alguien en dos pares (el 15 de las ideas 3 y 4) se quedan, para que el
   caso exista.
2. **«Ahora tú» de la idea 1 sin parejas** (M1): con dos personas solo caben el acertijo del juego y el del ejemplo 6. Se
   empieza en tres personas; las parejas quedan para los ejemplos de nivel 1 y 2.
3. **La pelota de Lee de la idea 3 y los carteles de las cajas** (B5): dibujo de prueba de `rm-veraz`.
4. **Frases en Datos y en los globos a la vez** y **nombres que se repiten entre ideas** (B6): la decisión de la rama es
   que las frases vayan en Datos, una por línea; el lector B lo nota como repetición.

### Archivos tocados

`contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js` y su `.test.js`; `plantillas/rm-verdades/generador.js`,
`generador.test.js`, `casos.json` (caso 8) y `papel.json` (regenerado con `herramientas/papel-generador.js`). La pieza no se
tocó. `npm run catalogo` corrió; el glosario no cambió.
